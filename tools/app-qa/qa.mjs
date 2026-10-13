// QA: every sample intake through the wizard's code path (answers -> buildIntake -> worker), EN + ES, every day of every week.
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
const BASE = (process.env.BC_QA_URL || 'http://127.0.0.1:8766/');
const SHOTS = ROOT + 'app/screenshots/';
fs.mkdirSync(process.env.BC_QA_OUT || '/tmp/bc-qa/', { recursive: true });
const only = process.argv[2] || '';
const RAW = /\b(?:ui\.plan|intake\.|warning\.|note\.|exercise\.|why\.|slot\.|reps\.|effort\.|rest\.|load\.|block\.|group\.|plan\.phase|refer\.|release\.|health\.|guide\.|profile\.|sport\.|activity\.|muscle\.|weekday\.|wod\.|aerobic\.|conditioning\.|swap\.|prehab\.|tests\.|program\.|day\.|nav\.|step\.|about\.|goal\.|kit\.|accept\.|build\.|progress\.|err\.)[a-z_]/;
const BAD = /undefined|NaN|\[object|\{[a-z_]+\}|LEGAL REVIEW|REVISIÓN LEGAL/;
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const results = [];
const samples = fs.readdirSync(ROOT + 'samples/intakes').filter(f => f.includes(only));
const extra = [
  { name: 'health-yes', base: '05-bootcamp.json', patch: i => { i.safety.heart = true; } },
  { name: 'coach-client', base: '08-pickleball-genpop.json', patch: i => { i.role = 'client'; i.health_route = 'coach_own_sop'; i.release.version = 'release.coach'; } }
].filter(x => !only || x.name.includes(only));
const cases = [...samples.map(f => ({ name: f.replace('.json', ''), base: f })), ...extra];
for (const c of cases) {
  const intake = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/' + c.base));
  if (c.patch) c.patch(intake);
  for (const lang of ['en', 'es']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    await page.goto(BASE);
    await page.waitForSelector('[data-step="about"]');
    await page.click(`.lang [data-value="${lang}"]`);
    await page.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), intake);
    const t0 = Date.now();
    await page.click('[data-action="next"]');
    await page.waitForSelector('#daycard', { timeout: 180000 });
    const wall = Date.now() - t0;
    const ms = await page.evaluate(() => window.__bcLastBuildMs);
    const problems = [];
    const info = await page.evaluate(() => { const S = window.__bc.state; return { weeks: S.plan.weeks.map(w => ({ n: w.n, days: window.__bc.V.dayTabs(S.plan, w.n).map(d => d.weekday) })), short: window.__bc.V.legal(S.plan, S.model, S.lang).short, health: !!(S.plan.meta.health && S.plan.meta.health.warn), status: S.plan.status, valid: S.plan.validation.ok }; });
    let days = 0;
    for (const w of info.weeks) for (const d of w.days) {
      await page.evaluate(([n, wd]) => window.__bc.go(n, wd), [w.n, d]);
      const txt = await page.locator('#app').innerText();
      days++;
      if (!txt.includes(info.short)) problems.push(`W${w.n} ${d}: no release line`);
      const m1 = txt.match(RAW); if (m1) problems.push(`W${w.n} ${d}: raw key near "${txt.slice(Math.max(0, m1.index - 30), m1.index + 40)}"`);
      const m2 = txt.match(BAD); if (m2) problems.push(`W${w.n} ${d}: bad text "${txt.slice(Math.max(0, m2.index - 30), m2.index + 40)}"`);
    }
    // open every row of week 1's first day and re-check
    await page.evaluate(() => window.__bc.go(1, window.__bc.V.firstDay(window.__bc.state.plan, 1)));
    const rows = await page.locator('button.row').count();
    for (let k = 0; k < rows; k++) await page.locator('button.row').nth(k).click();
    let txt = await page.locator('#app').innerText();
    if (RAW.test(txt) || BAD.test(txt)) problems.push('expanded rows: bad text ' + (txt.match(RAW) || txt.match(BAD))[0]);
    // progress tab
    await page.click('[data-action="tab"][data-value="progress"]');
    txt = await page.locator('#app').innerText();
    const m3 = txt.match(RAW) || txt.match(BAD); if (m3) problems.push(`progress: "${txt.slice(Math.max(0, m3.index - 40), m3.index + 40)}"`);
    if (info.health && !/(Health warning|Advertencia de salud)/i.test(txt)) problems.push('progress: health warning missing');
    // print root
    await page.evaluate(() => { document.querySelector('[data-action="tab"][data-value="day"]').click(); });
    if (problems.length > 20) problems.splice(20);
    results.push({ case: c.name, lang, status: info.status, valid: info.valid, build_ms: ms, wall_ms: wall, days, errors: errs, problems });
    console.log(JSON.stringify(results[results.length - 1]));
    await page.close();
  }
}
fs.writeFileSync((process.env.BC_QA_OUT || '/tmp/bc-qa/') + 'qa-results.json', JSON.stringify(results, null, 1));
await browser.close();
