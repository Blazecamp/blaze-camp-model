// QA: every button, chip, tab and card fits its text and nothing overflows the screen - every screen, both brands, EN + ES,
// phone widths 320-430, dark and light. Usage: BC_QA_URLS=blazecamp=http://..,sonhabitos=http://.. node tools/app-qa/fit.mjs
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
const URLS = Object.fromEntries((process.env.BC_QA_URLS || 'blazecamp=http://127.0.0.1:8766/').split(',').map(x => x.split('=')));
const SHOTS = process.env.BC_FIT_SHOTS || '';
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const problems = [];
const SEL = 'button, .btn, a.play, .chip, .card-btn, .seg button, .tabs button, .daytab, summary, .check, select, input';
const check = (page, where) => page.evaluate(([sel, where]) => {
  const out = [];
  const W = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > W + 1) out.push(`${where}: page scrolls sideways (${document.documentElement.scrollWidth} > ${W})`);
  // a number or date box shows its whole value
  for (const el of document.querySelectorAll('input[type=number], input[type=date], .stepper input')) {
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    const cs = getComputedStyle(el); const c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const need = c.measureText(String(el.value || '')).width + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    if (el.type === 'number' && need > el.clientWidth + 1) out.push(`${where}: number cut off "${el.value}" (${Math.round(need)} > ${el.clientWidth})`);
  }
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
    const label = (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    if (r.right > W + 1 || r.left < -1) out.push(`${where}: off screen "${label}" (${Math.round(r.left)}-${Math.round(r.right)} of ${W})`);
    if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).textOverflow !== 'ellipsis') out.push(`${where}: text wider than its box "${label}" (${el.scrollWidth} > ${el.clientWidth})`);
    // text that pokes out of its own box (children wider than the parent and visible)
    for (const c of el.querySelectorAll('span, b, small')) {
      const cr = c.getBoundingClientRect();
      if (!cr.width) continue;
      const cs = getComputedStyle(c);
      if (cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden') continue;
      if (cr.right > r.right + 2 || cr.left < r.left - 2) { out.push(`${where}: "${(c.innerText || '').slice(0, 30)}" spills out of "${label}"`); break; }
    }
  }
  return out;
}, [SEL, where]);

for (const [brand, base] of Object.entries(URLS)) for (const lang of ['en', 'es']) for (const width of [320, 360, 390, 430]) for (const scheme of (width === 360 ? ['dark', 'light'] : ['dark'])) {
  const tag = `${brand} ${lang} ${width} ${scheme}`;
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme });
  const page = await ctx.newPage();
  page.on('pageerror', e => problems.push(`${tag}: page error ${e.message}`));
  await page.goto(base); await page.waitForSelector('[data-screen="you"]');
  await page.click(`.lang [data-value="${lang}"]`);
  const run = async (where) => { for (const p of await check(page, `${tag} ${where}`)) { problems.push(p); } };
  await run('you'); await page.click('[data-action="role"][data-value="client"]'); await run('you-client'); await page.click('[data-action="role"][data-value="self"]');
  await page.click('[data-action="next"]'); await run('goal');
  for (const g of ['athletic', 'active', 'fat_loss', 'muscle']) { await page.click(`[data-action="goal"][data-value="${g}"]`); await page.waitForTimeout(120); await run('goal-' + g); }
  await page.click('[data-action="next"]'); await page.waitForTimeout(200); await run('week');
  await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; })); await run('week-options');
  await page.click('[data-action="next"]'); await page.waitForTimeout(200); await run('safety');
  await page.click('[data-action="pain"]'); await run('safety-pain');
  await page.click('[data-action="health"][data-value="some"]'); await run('safety-health');
  await page.click('[data-action="health"][data-value="none"]');
  await page.check('input[data-field="accepted"]');
  await page.click('[data-action="next"]');
  await page.waitForSelector('#daycard', { timeout: 240000 }); await page.waitForTimeout(300);
  await run('plan-day');
  if (SHOTS && width === 360) await page.screenshot({ path: `${SHOTS}/fit-${brand}-${lang}-${scheme}-day.png`, fullPage: true });
  const strength = page.locator('#daycard button.row').filter({ has: page.locator('.dose') });
  if (await strength.count()) {
    await strength.first().click(); await page.waitForTimeout(150); await run('plan-edit');
    const sw = page.locator('[data-action="edit-swap"], [data-action="swap-open"], .eb-swap').first();
    if (await sw.count()) { await sw.click(); await page.waitForTimeout(150); await run('plan-swap'); }
    const link = page.locator('[data-action^="link"]').first();
    if (await link.count()) { await link.click(); await page.waitForTimeout(150); await run('plan-link'); const c = page.locator('.link-bar [data-action*="cancel"]').first(); if (await c.count()) await c.click(); }
  }
  const add = page.locator('[data-action^="add"]').first();
  if (await add.count()) { await add.click(); await page.waitForTimeout(200); await run('plan-add'); await page.keyboard.press('Escape'); }
  for (const tab of await page.$$eval('.tabs [data-action="tab"]', els => els.map(e => e.dataset.value))) { await page.click(`.tabs [data-action="tab"][data-value="${tab}"]`); await page.waitForTimeout(200); await run('tab-' + tab); }
  if (SHOTS && width === 320) await page.screenshot({ path: `${SHOTS}/fit-${brand}-${lang}-320-last.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
const uniq = [...new Set(problems)];
console.log(uniq.length ? uniq.join('\n') : 'every button fits');
console.log(`problems: ${uniq.length}`);
process.exit(uniq.length ? 1 : 0);
