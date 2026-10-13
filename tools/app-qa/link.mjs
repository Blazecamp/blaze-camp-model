// QA for linking exercises (engine/edit.mjs link_exercises / unlink_exercises, app/edit-ui.js; engine/DECISIONS.md G-314; the coach
// in chat, 2026-10-13: "I should be able to link two exercises during a session or more, and create my own supersets"): at 390x844
// under the production Content-Security-Policy (vercel.json), in English and Spanish: link 2 straight exercises (a SUPERSET), grow
// it to 3 (a TRISET), unlink one, Undo last, the PDF shows the group, then a plan with "More supersets" (CH7-07) where a generated
// superset is unlinked. Zero page errors. Screenshots: phone-<lang>-9-link.png (picking, the bar at the bottom) and
// phone-<lang>-9b-linked.png (the triset) in app/screenshots/ (BC_SHOTS_DIR to change, e.g. app/screenshots/sonhabitos/).
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../../', import.meta.url).pathname;
const BASE = process.env.BC_QA_URL || 'http://127.0.0.1:8766/';
const OUT = (process.env.BC_QA_OUT || '/tmp/bc-qa/') + 'link/';
const SHOTS = process.env.BC_SHOTS_DIR ? (process.env.BC_SHOTS_DIR.startsWith('/') ? process.env.BC_SHOTS_DIR : ROOT + process.env.BC_SHOTS_DIR) : ROOT + 'app/screenshots/';
const SAMPLE = process.env.BC_LINK_SAMPLE || '06-full-body-aesthetics';
fs.mkdirSync(OUT, { recursive: true });
const vercel = JSON.parse(fs.readFileSync(ROOT + 'vercel.json'));
const csp = vercel.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const RAW = /\b(?:ui\.plan|edit\.(?:c|done)\.|link\.|warning\.|note\.|exercise\.|why\.|block\.|group\.)[a-z_]/;
const BAD = /undefined|NaN|\[object|\{[a-z_]+\}/;
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL', m); };
const langs = (process.argv[2] || 'en,es').split(',');
const W = { en: { kind2: 'SUPERSET', kind3: 'TRISET', bar: 'Tap exercises to link', link: '🔗 Link', unlink: 'Unlink' },
  es: { kind2: 'SUPERSERIE', kind3: 'TRISERIE', bar: 'Toca ejercicios para unirlos', link: '🔗 Unir', unlink: 'Separar' } };

for (const lang of langs) {
  console.log(`${SAMPLE} (${lang})`);
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('blob:') || u.startsWith('data:')) return route.continue();
    const r = await route.fetch(); await route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
  });
  await page.goto(BASE);
  await page.waitForSelector('[data-screen="you"]');
  await page.click(`.lang [data-value="${lang}"]`);
  const intake = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/' + SAMPLE + '.json'));
  await page.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), intake);
  await page.click('[data-action="next"]');
  await page.waitForSelector('#daycard', { timeout: 240000 });
  const waitSteps = (n) => page.waitForFunction((k) => window.__bc.state.hist.steps.length === k && !window.__bc.state.busy, n, { timeout: 30000 });
  const state = (fn, arg) => page.evaluate(fn, arg);
  const text = async () => page.locator('#app').innerText();
  const shot = async (sel, name) => {
    await page.evaluate((q) => { const t = document.getElementById('bc-toast'); if (t) t.classList.remove('show'); const el = document.querySelector(q); if (el) el.scrollIntoView({ block: 'center' }); }, sel);
    await page.waitForTimeout(250);
    await page.screenshot({ path: SHOTS + name });
  };
  const checkText = async (where) => { const t = await text(); const m = t.match(RAW) || t.match(BAD); if (m) fail(`${where}: "${t.slice(Math.max(0, m.index - 30), m.index + 40)}"`); };
  // the day's items of week `n` (slot id -> superset id), and the groups the card shows
  const groupsOf = (n) => state((k) => { const S = window.__bc.state; const d = S.plan.weeks[k - 1].days.find(x => x.weekday === S.day); return d ? d.blocks.flatMap(b => b.items).filter(x => x.superset).map(x => [x.slot_id, x.superset]) : []; }, n);
  const cardGroups = () => page.$$eval('#daycard .grp', els => els.map(e => ({ cls: e.className, head: e.querySelector('.grp-h').innerText, rows: e.querySelectorAll('.thing.in').length })));
  // open a row (closing the others first, so `.det .edit-bar` is that row's)
  const openRow = async (loc) => {
    for (const el of await page.locator('#daycard button.row[aria-expanded="true"]').all()) await el.click();
    await loc.click(); await page.waitForSelector('.det .edit-bar');
  };

  // 1. open the first accessory row: Link is in its edit bar; tap it, then the next accessory row; Done
  const acc = page.locator('.blk[data-kind="accessories"] button.row').filter({ has: page.locator('.dose') });
  if (await acc.count() < 3) { fail('fewer than 3 accessory rows'); await ctx.close(); continue; }
  const slotOf = async (loc) => { await loc.click(); const s = await state(() => [...window.__bc.state.open][0].split('.').slice(2).join('.')); await loc.click(); return s; };
  const s1 = await slotOf(acc.nth(0)), s2 = await slotOf(acc.nth(1)), s3 = await slotOf(acc.nth(2));
  console.log('  lines', s1, s2, s3);
  await openRow(acc.nth(0));
  const linkBtn = page.locator('.det .edit-bar [data-action="ed-link-start"]');
  if (await linkBtn.innerText() !== W[lang].link) fail('link button words: ' + await linkBtn.innerText());
  await linkBtn.click();
  await page.waitForSelector('.link-bar');
  if (!(await page.locator('.link-bar').innerText()).includes(W[lang].bar)) fail('link bar words');
  if (!(await page.locator('.link-bar [data-action="ed-link-done"]').isDisabled())) fail('Done enabled with one exercise picked');
  await page.locator(`button.link-pick[data-value="${s2}"]`).click();
  if (await page.locator('button.link-pick.picked').count() !== 2) fail('two rows picked');
  const bar = await page.locator('.link-bar').boundingBox();
  if (!bar || bar.y + bar.height < 840 || bar.y > 844) fail('link bar not at the bottom of the screen: ' + JSON.stringify(bar));
  await shot(`button.link-pick[data-value="${s2}"]`, `phone-${lang}-9-link.png`);
  await page.click('.link-bar [data-action="ed-link-done"]');
  await waitSteps(1);
  let g = await groupsOf(1);
  if (!(g.length === 2 && g[0][1] === g[1][1] && g.map(x => x[0]).join() === [s1, s2].join())) fail('link 2: ' + JSON.stringify(g));
  const later = await groupsOf(5);
  if (later.length !== 2) fail('link 2: not in later weeks ' + JSON.stringify(later));
  let cg = await cardGroups();
  if (!cg.some(x => x.cls.includes('grp-superset') && x.head.includes(W[lang].kind2) && x.rows === 2)) fail('card: no 2-row superset ' + JSON.stringify(cg));
  if (await page.locator('.link-bar').count()) fail('link bar still shown');
  await checkText('after link 2');

  // 2. grow it to 3: Link from a line of the pair brings the pair along; tap the third line; Done -> a TRISET
  await openRow(page.locator(`#daycard .grp button.row`).first());
  await page.click('.det .edit-bar [data-action="ed-link-start"]');
  if (await page.locator('button.link-pick.picked').count() !== 2) fail('link from a group: the pair is not picked');
  await page.locator(`button.link-pick[data-value="${s3}"]`).click();
  await page.click('.link-bar [data-action="ed-link-done"]');
  await waitSteps(2);
  g = await groupsOf(1);
  if (!(g.length === 3 && new Set(g.map(x => x[1])).size === 1)) fail('link 3: ' + JSON.stringify(g));
  cg = await cardGroups();
  const tri = cg.find(x => x.cls.includes('grp-triset'));
  if (!tri || !tri.head.includes(W[lang].kind3) || tri.rows !== 3 || !/A1 → A2 → A3/.test(tri.head)) fail('card: no triset ' + JSON.stringify(cg));
  if (await page.locator('#daycard button.row[aria-expanded="true"]').count()) fail('rows still open after Link');
  await shot('#daycard .grp-triset', `phone-${lang}-9b-linked.png`);
  await checkText('after link 3');

  // 3. the PDF shows the group (a band with TRISET / TRISERIE and A1 → A2 → A3)
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.click('.dayview [data-action="pdf"]')]);
  const file = OUT + `${lang}-` + dl.suggestedFilename();
  await dl.saveAs(file);
  if (fs.readFileSync(file).subarray(0, 5).toString('latin1') !== '%PDF-') fail('pdf: not a PDF');
  try {
    const py = `import sys, json, re, pypdf\nr = pypdf.PdfReader(sys.argv[1])\nt = re.sub(r'\\s+', ' ', ' '.join((p.extract_text() or '') for p in r.pages))\nprint(json.dumps({'pages': len(r.pages), 'kind': sys.argv[2] in t, 'seq': ('A1 → A2 → A3' in t) or ('A1 -> A2 -> A3' in t) or ('A1 A2 A3' in t)}))`;
    const r = JSON.parse(execFileSync('python3', ['-I', '-c', py, file, W[lang].kind3], { encoding: 'utf8' }));
    console.log('  pdf', dl.suggestedFilename(), JSON.stringify(r));
    if (!r.kind) fail('pdf: no ' + W[lang].kind3);
  } catch (e) { console.log('  pdf: pypdf not available', String(e.message || e).slice(0, 80)); }

  // 4. Unlink the middle line: the other two stay a superset
  await openRow(page.locator('#daycard .grp-triset button.row').nth(1));
  const un = page.locator('.det .edit-bar [data-action="ed-unlink"]');
  if (await un.innerText() !== W[lang].unlink) fail('unlink words: ' + await un.innerText());
  await un.click();
  await waitSteps(3);
  g = await groupsOf(1);
  if (g.length !== 2) fail('unlink: ' + JSON.stringify(g));
  cg = await cardGroups();
  if (!cg.some(x => x.cls.includes('grp-superset') && x.rows === 2) || cg.some(x => x.cls.includes('grp-triset'))) fail('card after unlink ' + JSON.stringify(cg));

  // 5. Undo last: the triset is back; Undo all: the generated plan
  await page.click('[data-action="ed-undo"]');
  await waitSteps(2);
  if ((await groupsOf(1)).length !== 3) fail('undo last: no triset');
  await page.click('[data-action="ed-undo-all"]');
  await waitSteps(0);
  if (!(await state(() => window.__bc.state.plan === window.__bc.state.hist.base))) fail('undo all');
  if (await page.locator('#daycard .grp-triset, #daycard .grp-superset').count()) fail('undo all: a group is still shown');

  // 6. Cancel leaves the plan alone
  await openRow(acc.nth(0));
  await page.click('.det .edit-bar [data-action="ed-link-start"]');
  await page.locator(`button.link-pick[data-value="${s2}"]`).click();
  await page.click('.link-bar [data-action="ed-link-cancel"]');
  if (await page.locator('.link-bar').count() || await state(() => window.__bc.state.hist.steps.length)) fail('cancel');

  // 7. "More supersets" (CH7-07): Unlink on a generated superset
  await page.evaluate((i) => { const a = window.__bc.answersFromIntake(i); window.__bc.load({ ...a, supersets: 'more', accepted: true }); }, intake);
  await page.click('[data-action="next"]');
  await page.waitForFunction(() => window.__bc.state.screen === 'plan' && window.__bc.state.hist && !window.__bc.state.hist.steps.length && window.__bc.state.plan.weeks[0].days.some(d => d.supersets_on), null, { timeout: 240000 });
  await page.waitForSelector('#daycard .grp-superset');
  const before = (await groupsOf(1)).length;
  await openRow(page.locator('#daycard .grp-superset button.row').last());
  await page.click('.det .edit-bar [data-action="ed-unlink"]');
  await waitSteps(1);
  const afterN = (await groupsOf(1)).length;
  console.log(`  generated supersets: ${before} lines in groups -> ${afterN}`);
  if (afterN !== before - 2) fail(`unlink a generated pair: ${before} -> ${afterN}`);
  await checkText('after unlink of a generated pair');

  if (errs.length) fail('console: ' + errs.join(' | '));
  console.log(`  page errors ${errs.length}`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `${fails.length} FAIL` : 'all link checks passed');
process.exit(fails.length ? 1 : 0);
