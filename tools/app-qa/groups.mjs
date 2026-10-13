// QA for the day card's segmentation (coach, 2026-10-13: "each exercise ... boxed, and then each set or superset ... boxed itself"):
// at 390x844 under the production Content-Security-Policy, EN and ES: a superset day (a plan built with the supersets preference),
// a bootcamp circuit day (sample 05) and a class WOD day (sample 04). Checks: every exercise sits in a box, every group has its
// header in plain words and its A1 -> A2 labels, the rest is said once; removing one exercise of a superset leaves a straight
// exercise; a swap inside a group stays in the group; zero page errors. Screenshots phone-<lang>-8-superset / 8b-circuit / 8c-wod.
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
const BASE = process.env.BC_QA_URL || 'http://127.0.0.1:8766/';
const SHOTS = process.env.BC_SHOTS_DIR ? (process.env.BC_SHOTS_DIR.startsWith('/') ? process.env.BC_SHOTS_DIR : ROOT + process.env.BC_SHOTS_DIR) : ROOT + 'app/screenshots/';
const { loadCompiledModel } = await import(ROOT + 'tests/helpers/models.mjs');
const { generate } = await import(ROOT + 'engine/generate.mjs');
const vercel = JSON.parse(fs.readFileSync(ROOT + 'vercel.json'));
const csp = vercel.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const model = loadCompiledModel();
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL', m); };
const langs = (process.argv[2] || 'en,es').split(',');
const WORDS = { en: { superset: 'SUPERSET', circuit: 'CIRCUIT', wod: 'WOD', rest: 'rest' }, es: { superset: 'SUPERSERIE', circuit: 'CIRCUITO', wod: 'WOD', rest: 'descansa' } };

const ssIntake = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/06-full-body-aesthetics.json', 'utf8'));
ssIntake.prefs = { ...(ssIntake.prefs || {}), supersets_for_fatigue: true };
ssIntake.experience = { years_consistent: 0 };
const CASES = [
  { name: 'superset', shot: '8-superset', plan: (lang) => generate({ ...ssIntake, lang }, model), want: 'superset' },
  { name: 'circuit', shot: '8b-circuit', plan: () => JSON.parse(fs.readFileSync(ROOT + 'samples/plans/05-bootcamp.json', 'utf8')), want: 'circuit' },
  { name: 'wod', shot: '8c-wod', plan: () => JSON.parse(fs.readFileSync(ROOT + 'samples/plans/04-crossfit-style-bootcamp.json', 'utf8')), want: 'wod' }
];

for (const lang of langs) for (const c of CASES) {
  console.log(`${c.name} (${lang})`);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
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
  await page.evaluate((p) => window.__bc.show(p), c.plan(lang));
  await page.waitForSelector('#daycard');
  // the first day of week 1 that holds the wanted group
  const day = await page.evaluate((want) => {
    const S = window.__bc.state;
    for (const d of window.__bc.V.dayTabs(S.plan, 1)) {
      const card = window.__bc.V.dayCard(S.plan, S.model, S.lang, 1, d.weekday);
      if (card && card.blocks.some(b => (b.groups || []).some(g => (want === 'superset' ? ['superset', 'triset', 'giant'].includes(g.kind) : g.kind === want)))) return d.weekday;
    }
    return null;
  }, c.want);
  if (!day) { fail('no day with a ' + c.want); await ctx.close(); continue; }
  await page.evaluate((d) => window.__bc.go(1, d), day);
  const info = await page.evaluate(() => ({
    groups: [...document.querySelectorAll('#daycard .grp')].map(g => ({ head: g.querySelector('.grp-h').innerText, rows: [...g.querySelectorAll('.thing.in .num')].map(x => x.textContent) })),
    singles: document.querySelectorAll('#daycard .things > .thing').length,
    loose: [...document.querySelectorAll('#daycard .blk:not(.blk-line) .row')].filter(r => !r.closest('.thing')).length
  }));
  console.log('  groups', JSON.stringify(info.groups).slice(0, 400), 'singles', info.singles);
  if (!info.groups.length) fail('no group box');
  const over = await page.evaluate(() => [...document.querySelectorAll('#daycard .grp, #daycard .thing')].filter(el => el.scrollWidth > el.clientWidth + 1).length + (document.documentElement.scrollWidth > window.innerWidth ? 1 : 0));
  if (over) fail(`${over} boxes wider than the card (horizontal overflow)`);
  if (info.loose) fail(`${info.loose} rows outside a box`);
  const W = WORDS[lang];
  for (const g of info.groups) {
    const L = g.head.trim()[0];
    if (!g.rows.length || !g.rows.every((x, i) => x === L + (i + 1))) fail('labels ' + JSON.stringify(g));
    if (!/→/.test(g.head)) fail('no sequence in ' + g.head);
  }
  const kindWord = W[c.want];
  if (!info.groups.some(g => g.head.toUpperCase().includes(kindWord))) fail('no ' + kindWord + ' header');
  await page.evaluate(() => { const el = document.querySelector('#daycard .grp'); if (el) el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); });
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOTS + `phone-${lang}-${c.shot}.png` });

  if (c.name === 'superset') {
    // the rest is said once: no row inside a superset repeats 'after the pair'
    const rowsText = await page.$$eval('#daycard .grp .thing.in .r2', els => els.map(e => e.textContent).join(' | '));
    if (/after the pair|después del par/i.test(rowsText)) fail('rest repeated on rows: ' + rowsText.slice(0, 200));
    // swap inside a group: it stays in the group
    const before = info.groups.length;
    const firstIn = page.locator('#daycard .grp .thing.in button.row').first();
    await firstIn.click();
    if (await page.locator('.det .edit-bar [data-action="ed-swap-open"]').count()) {
      await page.locator('.det .edit-bar [data-action="ed-swap-open"]').first().click();
      await page.locator('.swap-opt').first().click();
      await page.waitForFunction(() => window.__bc.state.hist.steps.length === 1 && !window.__bc.state.busy);
      if (await page.locator('#daycard .grp').count() !== before) fail('swap moved a row out of its group');
    }
    // remove one exercise of a two-exercise superset: the other is a straight exercise again
    const n0 = await page.locator('#daycard .grp').count();
    const pair = page.locator('#daycard .grp').filter({ has: page.locator('.thing.in >> nth=1') }).last();
    await pair.locator('button.row').last().click();
    await page.locator('.det .edit-bar [data-action="ed-remove"]').last().click();
    await page.waitForFunction((k) => window.__bc.state.hist.steps.length === k && !window.__bc.state.busy, await page.evaluate(() => window.__bc.state.hist.steps.length + 1));
    const n1 = await page.locator('#daycard .grp').count();
    console.log(`  remove one of a pair: groups ${n0} -> ${n1}`);
    if (n1 !== n0 - 1) fail('a superset with one exercise left is still a group');
  }
  if (errs.length) fail('console: ' + errs.join(' | '));
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `${fails.length} FAIL` : 'all group checks passed');
process.exit(fails.length ? 1 : 0);
