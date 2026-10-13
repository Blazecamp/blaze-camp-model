// QA and screenshots of a brand's build other than Blaze Camp (default: Son Hábitos), on a phone (390x844):
//   * it opens in the brand's language with no saved choice, and a saved choice wins after a reload;
//   * the wizard (4 screens), the building screen, the day card, the progress tab, dark mode, English, the disclaimer page;
//   * on every screen: no console error, no raw key / undefined / NaN, and no other brand's name in the text, the title or the
//     description ("Lalo Vera" only inside the legal parties: "Lalo Vera and / y BFit Studios Corp. ...").
// Build and serve first:  node tools/build-site.mjs --brand sonhabitos --out /tmp/x-sh && python3 -m http.server -d /tmp/x-sh 8782
// Then: BC_PLAYWRIGHT=... BC_QA_URL=http://127.0.0.1:8782/ node tools/app-qa/brand-shots.mjs [outDir]   (default app/screenshots/sonhabitos/)
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
const OUT = process.argv[2] || ROOT + 'app/screenshots/sonhabitos/';
const BASE = process.env.BC_QA_URL || 'http://127.0.0.1:8782/';
const LANG0 = process.env.BC_BRAND_LANG || 'es';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL', m); };
const NAMES = /.{0,40}(?:Blaze|BLAZE|Gerardo|Lalo(?! Vera (?:and|y) BFit)).{0,40}/;
const BAD = /undefined|NaN|\[object|\{[a-z_]+\}|LEGAL REVIEW|REVISIÓN LEGAL|\b(?:ui\.plan|intake|warning|note|exercise|nav|goal|build|progress)\.[a-z_]+\b/;
const sample = (f) => JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/' + f));

async function open(scheme = 'light', ctxOpts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: Number(process.env.BC_DSF || 1), colorScheme: scheme, ...ctxOpts });
  const page = await ctx.newPage();
  page.errs = [];
  page.on('console', m => { if (m.type() === 'error') page.errs.push(m.text()); });
  page.on('pageerror', e => page.errs.push('PAGEERROR ' + e.message));
  await page.goto(BASE);
  await page.waitForSelector('[data-screen="you"]');
  return page;
}
async function check(page, label) {
  const t = await page.evaluate(() => [document.title, (document.querySelector('meta[name="description"]') || {}).content || '', document.body.innerText,
    [...document.querySelectorAll('[aria-label],[alt],[title]')].map(e => [e.getAttribute('aria-label'), e.getAttribute('alt'), e.getAttribute('title')].join(' ')).join(' ')].join('\n'));
  const flat = t.replace(/\s+/g, ' ');
  const n = NAMES.exec(flat);
  if (n) fail(`${label}: names "${n[0]}"`);
  const b = BAD.exec(t);
  if (b) fail(`${label}: "${b[0]}"`);
  if (page.errs.length) fail(`${label}: console ${page.errs.join(' | ')}`);
}
const shot = async (page, name, full = false) => { await check(page, name); await page.screenshot({ path: OUT + name + '.png', fullPage: full }); console.log('  ' + name); };

// 1. opens in the brand's language; a saved choice wins after a reload
{
  const p = await open();
  const lang = await p.evaluate(() => [document.documentElement.lang, document.querySelector('.lang [aria-pressed="true"]').dataset.value]);
  if (lang[0] !== LANG0 || lang[1] !== LANG0) fail(`opens in ${lang} (want ${LANG0})`);
  await p.click(`.lang [data-value="${LANG0 === 'es' ? 'en' : 'es'}"]`);
  await p.reload(); await p.waitForSelector('[data-screen="you"]');
  const after = await p.evaluate(() => document.documentElement.lang);
  if (after === LANG0) fail('a saved language choice is not kept');
  console.log(`language: opens ${lang[0]}, after choosing the other and reloading: ${after}`);
  await p.context().close();
}

// 2. the wizard (general fitness, 3 days), the build, the plan
{
  const p = await open();
  await shot(p, 'phone-es-1-you');
  await p.click('[data-action="next"]');
  await p.click('[data-action="goal"][data-value="general"]');
  await shot(p, 'phone-es-2-goal');
  await p.click('[data-action="next"]');
  await shot(p, 'phone-es-3-week');
  await p.click('[data-action="next"]');
  await p.click('[data-action="health"][data-value="none"]');
  await p.check('[data-field="accepted"]');
  await shot(p, 'phone-es-4-safety');
  await shot(p, 'phone-es-4-safety-full', true);
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 180000 });
  await shot(p, 'phone-es-6-plan-day');
  await p.locator('button.row').nth(1).click();
  await shot(p, 'phone-es-6b-row-open');
  await p.click('[data-action="tab"][data-value="progress"]');
  await shot(p, 'phone-es-7-progress');
  await shot(p, 'phone-es-7-progress-full', true);
  // every day of every week: the words
  const weeks = await p.evaluate(() => { const S = window.__bc.state; return S.plan.weeks.map(w => ({ n: w.n, days: window.__bc.V.dayTabs(S.plan, w.n).map(d => d.weekday) })); });
  await p.click('[data-action="tab"][data-value="day"]');
  for (const w of weeks) for (const d of w.days) { await p.evaluate(([n, x]) => window.__bc.go(n, x), [w.n, d]); await check(p, `week ${w.n} ${d}`); }
  await p.context().close();
}

// 3. the building screen (a physique plan takes longest), English day card, dark mode
{
  const p = await open();
  await p.click('[data-action="next"]');
  await p.click('[data-action="goal"][data-value="muscle"]');
  await p.click('[data-action="next"]');
  await p.click('[data-action="days"][data-value="4"]');
  await p.click('[data-action="next"]');
  await p.click('[data-action="health"][data-value="none"]');
  await p.check('[data-field="accepted"]');
  await p.click('[data-action="next"]');
  await p.waitForSelector('.building');
  await p.waitForTimeout(1200);
  await shot(p, 'phone-es-5-building');
  await p.waitForSelector('#daycard', { timeout: 240000 });
  await shot(p, 'phone-es-6c-plan-day-muscle');
  await p.click('.lang [data-value="en"]');
  await shot(p, 'phone-en-6-plan-day');
  await p.context().close();
}
{
  const p = await open('dark');
  await p.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), sample('08-pickleball-genpop.json'));
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 180000 });
  await shot(p, 'phone-es-dark-plan-day');
  await p.goto(BASE + 'disclaimer.es.html');
  await shot(p, 'phone-es-dark-disclaimer');
  await p.context().close();
}
{
  const p = await open();
  await p.goto(BASE + 'disclaimer.es.html');
  await shot(p, 'phone-es-disclaimer');
  await p.goto(BASE + 'disclaimer.html');
  await check(p, 'disclaimer.html');
  await p.context().close();
}

await browser.close();
console.log(fails.length ? `${fails.length} FAIL` : 'brand QA: all good');
process.exit(fails.length ? 1 : 0);
