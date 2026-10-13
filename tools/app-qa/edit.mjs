// QA for editing the plan (app/edit-ui.js, engine/edit.mjs; COACH-CX CX-02 / CX-04): at 390x844 under the production
// Content-Security-Policy (vercel.json), in English and Spanish: build a plan, open a row, sets + and -, swap, remove, a block off,
// add an exercise from the library search, the Progress tab, Undo last, Undo all, then Download PDF and Save image of an edited plan
// (the PDF must name the swapped-in exercise and say "Edited"). Zero page errors. Screenshots of the edit UI go to app/screenshots/
// (BC_SHOTS_DIR to change, e.g. app/screenshots/sonhabitos/ for the Son Hábitos build).
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../../', import.meta.url).pathname;
const BASE = process.env.BC_QA_URL || 'http://127.0.0.1:8766/';
const OUT = (process.env.BC_QA_OUT || '/tmp/bc-qa/') + 'edit/';
const SHOTS = process.env.BC_SHOTS_DIR ? (process.env.BC_SHOTS_DIR.startsWith('/') ? process.env.BC_SHOTS_DIR : ROOT + process.env.BC_SHOTS_DIR) : ROOT + 'app/screenshots/';
const SAMPLE = process.env.BC_EDIT_SAMPLE || '08-pickleball-genpop';
fs.mkdirSync(OUT, { recursive: true });
const vercel = JSON.parse(fs.readFileSync(ROOT + 'vercel.json'));
const csp = vercel.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const RAW = /\b(?:ui\.plan|edit\.(?:c|done)\.|warning\.|note\.|exercise\.|why\.|block\.|group\.)[a-z_]/;
const BAD = /undefined|NaN|\[object|\{[a-z_]+\}/;
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL', m); };
const langs = (process.argv[2] || 'en,es').split(',');

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
  const steps = () => page.evaluate(() => window.__bc.state.hist.steps.length);
  const waitSteps = (n) => page.waitForFunction((k) => window.__bc.state.hist.steps.length === k && !window.__bc.state.busy, n, { timeout: 30000 });
  const state = (fn, arg) => page.evaluate(fn, arg);
  const text = async () => page.locator('#app').innerText();
  // a screenshot with `sel` in the middle of the screen (the toast hidden)
  const shot = async (sel, name) => {
    await page.evaluate((q) => { const t = document.getElementById('bc-toast'); if (t) t.classList.remove('show'); const el = document.querySelector(q); if (el) el.scrollIntoView({ block: 'center' }); }, sel);
    await page.waitForTimeout(250);
    await page.screenshot({ path: SHOTS + name });
  };
  const checkText = async (where) => { const t = await text(); const m = t.match(RAW) || t.match(BAD); if (m) fail(`${where}: "${t.slice(Math.max(0, m.index - 30), m.index + 40)}"`); };

  // 0. the ▶ beside every exercise: a YouTube search (R4-LIB-05), 44px target, a new tab, and tapping it never toggles the row
  const SEARCH = 'https://www.youtube.com/results?search_query=';
  const plays = await page.$$eval('#daycard .play', els => els.map(a => ({ href: a.href, target: a.target, rel: a.rel, label: a.getAttribute('aria-label'), w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height })));
  const exRows = await page.locator('#daycard .row .dose').count();
  console.log(`  play buttons ${plays.length} (exercise rows with a dose ${exRows})`);
  if (plays.length < exRows - 1) fail(`play: ${plays.length} buttons for ${exRows} rows`);
  for (const p of plays) {
    if (!p.href.startsWith(SEARCH)) fail('play: not a YouTube search: ' + p.href);
    if (p.target !== '_blank' || !/noopener/.test(p.rel)) fail('play: not a new tab with noopener');
    if (!new RegExp(lang === 'es' ? '^Ver videos de ' : '^Watch videos of ').test(p.label || '')) fail('play: label ' + p.label);
    if (p.w < 44 || p.h < 44) fail(`play: tap target ${p.w}x${p.h}`);
  }
  const openBefore = await state(() => window.__bc.state.open.size);
  await page.evaluate(() => { const a = document.querySelector('#daycard .play'); a.addEventListener('click', (e) => e.preventDefault(), { once: true }); a.click(); });
  if (await state(() => window.__bc.state.open.size) !== openBefore) fail('play: tapping it toggled the row');
  await shot('#daycard', `phone-${lang}-7a-play.png`);

  // 1. open the first strength row: the edit bar is there
  const row = page.locator('.blk[data-kind="strength"] button.row').filter({ has: page.locator('.dose') });
  let target = null;
  for (let k = 0; k < await row.count(); k++) {
    await row.nth(k).click();
    if (await page.locator('.edit-bar .eb-step').count()) { target = k; break; }
    await row.nth(k).click();
  }
  if (target === null) { fail('no editable row'); await ctx.close(); continue; }
  const info = await state(() => {
    const S = window.__bc.state;
    const key = [...S.open][0];
    const slot = key.split('.').slice(2).join('.');
    const it = S.plan.weeks[0].days.find(d => d.weekday === S.day).blocks.flatMap(b => b.items).find(x => x.slot_id === slot);
    const f = (w) => (w.days.find(d => d.weekday === S.day) || { blocks: [] }).blocks.flatMap(b => b.items).find(x => x.slot_id === slot);
    const same = S.plan.weeks.filter(w => { const x = f(w); return x && x.exercise_id === it.exercise_id; });
    const lastW = same[same.length - 1].n;
    const last = f(S.plan.weeks[lastW - 1]);
    return { slot, day: S.day, sets: it.sets, ex: it.exercise_id, lastW, lastSets: last && last.sets, total1: S.plan.weeks[0].total_resistance_sets, swaps: it.swaps };
  });
  console.log('  row', JSON.stringify(info));
  const shown = async () => Number(await page.locator('.edit-bar .eb-n').first().innerText());
  if (await shown() !== info.sets) fail(`shown sets ${await shown()} != ${info.sets}`);

  // 2. sets +: the number, week 1's total and the last week move by one
  await page.click('.edit-bar [data-action="ed-sets"][data-value$="|1"]');
  await waitSteps(1);
  const after = await state((s) => {
    const S = window.__bc.state;
    const f = (w) => w.days.find(d => d.weekday === s.day).blocks.flatMap(b => b.items).find(x => x.slot_id === s.slot);
    return { sets: f(S.plan.weeks[0]).sets, last: f(S.plan.weeks[s.lastW - 1]).sets, total1: S.plan.weeks[0].total_resistance_sets, edited: S.plan.edited, valid: !!S.plan.validation, summary: S.plan.summary.total_resistance_sets_by_week[0] };
  }, info);
  if (await shown() !== info.sets + 1 || after.sets !== info.sets + 1) fail(`sets + : ${JSON.stringify(after)}`);
  if (after.total1 !== info.total1 + 1 || after.summary !== info.total1 + 1) fail('total not recomputed');
  if (info.lastSets && after.last !== info.lastSets + 1) fail('last week not tuned');
  if (!after.edited) fail('plan not marked edited');
  if (!(await page.locator('.plan-bar .badge.edited').count())) fail('no Edited badge');
  await shot('.det .edit-bar', `phone-${lang}-7-edit.png`);
  await checkText('after sets +');

  // 3. sets -: back to the number
  await page.click('.edit-bar [data-action="ed-sets"][data-value$="|-1"]');
  await waitSteps(2);
  if (await shown() !== info.sets) fail('sets - did not go back');

  // 4. swap: the list, then the first option, in every week with this exercise
  let n = 2;
  if (info.swaps.length) {
    await page.click('.edit-bar [data-action="ed-swap-open"]');
    await page.waitForSelector('.swap-opt');
    await shot('.eb-swaps', `phone-${lang}-7b-swap.png`);
    await page.locator('.swap-opt').first().click();
    await waitSteps(++n);
    const sw = await state((s) => {
      const S = window.__bc.state;
      const out = [];
      for (const w of S.plan.weeks) { const d = w.days.find(x => x.weekday === s.day); const it = d && d.blocks.flatMap(b => b.items).find(x => x.slot_id === s.slot); if (it) out.push(it.exercise_id); }
      return out;
    }, info);
    const base = await state((s) => { const S = window.__bc.state; return S.hist.base.weeks.map(w => { const d = w.days.find(x => x.weekday === s.day); const it = d && d.blocks.flatMap(b => b.items).find(x => x.slot_id === s.slot); return it ? it.exercise_id : null; }).filter(Boolean); }, info);
    const swappedWeeks = base.map((b, i) => (b === info.ex ? sw[i] : null)).filter(Boolean);
    if (!swappedWeeks.every(x => x === info.swaps[0])) fail(`swap: ${JSON.stringify(sw)}`);
    console.log(`  swap: ${info.ex} -> ${info.swaps[0]} in ${swappedWeeks.length} weeks`);
    const want = await state((id) => window.__bc.state.model.t('en', window.__bc.state.model.ex(id).name_key), info.swaps[0]);
    const href = await page.locator('.row-wrap.open .play').first().getAttribute('href');
    if (href !== SEARCH + encodeURIComponent(want)) fail(`play after swap: ${href}`);
  }

  // 5. remove the day's last exercise row
  const rowsBefore = await page.locator('#daycard button.row').count();
  const lastRow = page.locator('.blk:not(.blk-line) button.row').filter({ has: page.locator('.dose') }).last();
  await lastRow.click();
  await page.locator('.det .edit-bar [data-action="ed-remove"]').last().click();
  await waitSteps(++n);
  if (await page.locator('#daycard button.row').count() !== rowsBefore - 1) fail('remove: row count');

  // 6. a block off (core, else the first switch)
  const sw = page.locator('.blk-sw').first();
  if (await sw.count()) {
    await sw.click();
    await waitSteps(++n);
    if (await page.locator('.blk-sw').first().getAttribute('aria-checked') !== 'false') fail('block switch');
    await page.locator('.blk-sw').first().click();
    await waitSteps(++n);
  } else fail('no block switch');

  // 7. add an exercise: search 'curl', pick the first result
  await page.click('[data-action="ed-add-open"]');
  await page.waitForSelector('#addq');
  await page.selectOption('[data-field="addblock"]', 'accessories');
  await page.fill('#addq', 'curl');
  await page.waitForSelector('.add-opt');
  await shot('.add-panel', `phone-${lang}-7c-add.png`);
  const added = await page.locator('.add-opt').first().getAttribute('data-value');
  await page.locator('.add-opt').first().click();
  await waitSteps(++n);
  const addWeeks = await state((s) => { const S = window.__bc.state; return S.plan.weeks.filter(w => { const d = w.days.find(x => x.weekday === s.day); return d && d.blocks.some(b => b.items.some(x => x.exercise_id === s.added && x.origin === 'edit')); }).length; }, { ...info, added });
  console.log(`  add: ${added} in ${addWeeks} weeks`);
  if (!addWeeks) fail('add: not in the plan');
  await checkText('after add');

  // 8. the Progress tab shows the strip and the edited totals
  await page.click('[data-action="tab"][data-value="progress"]');
  if (!(await page.locator('.edit-strip').count())) fail('progress: no edit strip');
  await checkText('progress');
  await page.click('[data-action="tab"][data-value="day"]');

  // 9. PDF and image of the edited plan (desktop user agent at phone width: a real download)
  const swappedName = await state((id) => (id ? window.__bc.state.model.t(window.__bc.state.lang, window.__bc.state.model.ex(id).name_key) : ''), info.swaps[0] || null);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.click('.dayview [data-action="pdf"]')]);
  const file = OUT + `${lang}-` + dl.suggestedFilename();
  await dl.saveAs(file);
  const head = fs.readFileSync(file).subarray(0, 5).toString('latin1');
  if (head !== '%PDF-') fail('pdf: not a PDF');
  try {
    const py = `import sys, json, pypdf\nr = pypdf.PdfReader(sys.argv[1])\nt = ' '.join((p.extract_text() or '') for p in r.pages)\nimport re\nt = re.sub(r'\\s+', ' ', t)\nprint(json.dumps({'pages': len(r.pages), 'edited': ('Edited' in t) or ('Editado' in t), 'swapped': sys.argv[2][:24] in t if sys.argv[2] else None}))`;
    const r = JSON.parse(execFileSync('python3', ['-I', '-c', py, file, swappedName], { encoding: 'utf8' }));
    console.log('  pdf', dl.suggestedFilename(), JSON.stringify(r));
    if (!r.edited) fail('pdf: no "Edited"');
    if (r.swapped === false) fail('pdf: swapped exercise missing: ' + swappedName);
  } catch (e) { console.log('  pdf: pypdf not available'); }
  const [img] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('.dayview [data-action="save-image"]')]);
  console.log('  image', img.suggestedFilename());

  // 10. Undo last, then Undo all: back to the generated plan
  await page.click('[data-action="ed-undo"]');
  await waitSteps(n - 1);
  await page.click('[data-action="ed-undo-all"]');
  await waitSteps(0);
  if (!(await state(() => window.__bc.state.plan === window.__bc.state.hist.base))) fail('undo all: not the generated plan');
  if (await page.locator('.edit-strip, .plan-bar .badge.edited').count()) fail('undo all: Edited still shown');
  if (errs.length) fail('console: ' + errs.join(' | '));
  console.log(`  steps ${n}, page errors ${errs.length}`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `${fails.length} FAIL` : 'all edit checks passed');
process.exit(fails.length ? 1 : 0);
