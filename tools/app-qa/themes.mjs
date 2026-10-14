// QA: light and dark for every brand (coach CH7-15, 2026-10-14: "adjust for dark backgrounds ... so that it's not just hiding").
// Builds every brand in app/brands plus two throw-away white-label brands (a black brand colour and a white one, made with
// tools/new-brand.mjs --brands-dir in a scratch folder, never in the repository), serves them under the production CSP, and runs
// each brand x {phone dark, phone light} x {the sun / moon button untouched, tapped} through the wizard and a plan. On every screen:
//   * every text against the background it is actually drawn on: 4.5:1 (computed in the page from the computed styles; images
//     skipped; disabled and faded items skipped);
//   * every box a person taps (chips, buttons, card buttons, inputs, selects, tabs, check boxes): its fill or one of its edges
//     3:1 against what is behind it (WCAG 1.4.11); text-only buttons (no fill, no edge) are covered by the text check;
//   * every non-tappable card (day card, panels, notes ...): its edge or fill visible against the page (at least 1.1:1; WCAG asks no
//     contrast of a box nobody taps, but none may vanish);
//   * the header logo: at least half of its drawing 2:1 against what is behind it (the page, or its plate);
//   * the button: tapping switches the colours (the page background changes), aria-pressed follows, the choice is kept after a
//     reload (`<storage_key>.theme`, the only other thing in localStorage is the language), and no page error.
// Save image: the saved PNG is light even in dark mode (the PDF draws its own light colours and reads no CSS).
// Screenshots (first screen + a plan day, dark and light) of every white-label brand and the two throw-away brands go to BC_THEME_SHOTS
// (default reviews/theme-2026-10-14/). The fit checks (every button fits its text) stay in tools/app-qa/fit.mjs.
//   BC_PLAYWRIGHT=/path/to/playwright/index.mjs BC_CHROMIUM=/path/to/chrome node tools/app-qa/themes.mjs [--brands a,b] [--quick]
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { decodePng, encodePng } from '../white-label/images.mjs';

const ROOT = path.resolve(new URL('../../', import.meta.url).pathname);
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const QUICK = process.argv.includes('--quick');
const SHOTS = path.resolve(process.env.BC_THEME_SHOTS || path.join(ROOT, 'reviews/theme-2026-10-14'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'bc-themes-'));
const OUT = path.join(TMP, 'sites');
const csp = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'))).headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const node = (args) => execFileSync(process.execPath, args, { stdio: 'pipe', encoding: 'utf8', env: { ...process.env } });

// 1. the sites: every brand in app/brands, and the two throw-away brands
const real = fs.readdirSync(path.join(ROOT, 'app/brands')).filter(f => /^[a-z0-9-]+\.js$/.test(f)).map(f => f.slice(0, -3)).sort();
const only = arg('--brands') ? arg('--brands').split(',') : null;
const brands = [];
for (const id of real) {
  if (only && !only.includes(id)) continue;
  node([path.join(ROOT, 'tools/build-site.mjs'), '--brand', id, '--out', path.join(OUT, id)]);
  const B = (await import(path.join(ROOT, 'app/brands', id + '.js'))).BRAND;
  brands.push({ id, key: B.storage_key, shots: B.white_label === true });
}
const WL = path.join(TMP, 'brands'), PACKS = path.join(TMP, 'packs');
// a white logo (white bars on a transparent background): the mirror of a black one
const white = { w: 240, h: 60, data: new Uint8Array(240 * 60 * 4) };
for (let y = 8; y < 52; y++) for (let x = 6; x < 234; x++) if (x % 24 < 8 || (y > 26 && y < 34)) { const i = (y * 240 + x) * 4; white.data.set([255, 255, 255, 255], i); }
fs.mkdirSync(TMP, { recursive: true });
fs.writeFileSync(path.join(TMP, 'white-logo.png'), encodePng(white));
const temp = [
  { id: 'qa-black', args: ['--name', 'Night Iron Gym', '--colors', '#000000,#000000', '--logo-text', '--legal-name', 'Night Iron Gym LLC'] },
  { id: 'qa-white', args: ['--name', 'Snow Peak Gym', '--colors', '#ffffff,#ffffff', '--logo', path.join(TMP, 'white-logo.png'), '--legal-name', 'Snow Peak Gym LLC'] }
];
for (const t of temp) {
  if (only && !only.includes(t.id)) continue;
  node([path.join(ROOT, 'tools/new-brand.mjs'), '--brands-dir', WL, '--packs-dir', PACKS, '--id', t.id, '--lang', 'en', ...t.args, '--build-out', path.join(OUT, t.id)]);
  const B = JSON.parse(/export const BRAND = (\{[\s\S]*\});\nexport default/.exec(fs.readFileSync(path.join(WL, t.id + '.js'), 'utf8'))[1]);
  brands.push({ id: t.id, key: B.storage_key, shots: true, plate: B.logo_plate });
  console.log(`${t.id}: logo_plate ${JSON.stringify(B.logo_plate)}`);
}

// 2. a static server: /<id>/... -> the brand's site
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/markdown', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(OUT, path.normalize(p));
  if (!f.startsWith(OUT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'content-security-policy': csp, 'cache-control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// 3. the checks, in the page
function audit(where) {
  const parse = (s) => {
    s = String(s || '');
    let m = /color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)/.exec(s);
    if (m) return [m[1] * 255, m[2] * 255, m[3] * 255, m[4] === undefined ? 1 : Number(m[4])];
    m = /rgba?\(([^)]+)\)/.exec(s);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const over = (fg, bg) => { const a = fg[3]; return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)).concat(1); };
  const lum = (c) => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = (c) => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const bgOf = (el) => {   // the colour an element is drawn on: its own background over every ancestor's, over the page
    const chain = [];
    for (let e = el; e; e = e.parentElement) chain.push(e);
    let c = [255, 255, 255, 1];
    for (const e of chain.reverse()) { const b = parse(getComputedStyle(e).backgroundColor); if (b && b[3] > 0) c = over(b, c); }
    return c;
  };
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    let op = 1;
    for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; op *= Number(cs.opacity); }
    return op >= 0.9;
  };
  const label = (el) => (el.innerText || el.value || el.getAttribute('aria-label') || el.className || el.tagName).toString().trim().replace(/\s+/g, ' ').slice(0, 40);
  const out = { text: [], edge: [], card: [], logo: null, checked: 0 };
  // text
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('#print-root, svg, [aria-hidden="true"]') || el.matches('script, style, img')) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || el.matches('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), select');
    if (!own || !shown(el) || el.closest(':disabled')) continue;
    const cs = getComputedStyle(el);
    const bg = bgOf(el), fg = over(parse(cs.color) || [0, 0, 0, 1], bg);
    const r = ratio(fg, bg); out.checked++;
    if (r < 4.5) out.text.push(`${where}: text "${label(el)}" ${hex(fg)} on ${hex(bg)} = ${r.toFixed(2)}:1`);
  }
  // the edges of what a person taps
  const CTRL = 'button, .btn, .chip, .card-btn, .daytab, .check, select, input:not([type=checkbox]):not([type=radio]):not([type=hidden]), .tips-btn, .blk-sw, .swap-opt, .add-opt, .eb-step, .play span';
  for (const el of document.querySelectorAll(CTRL)) {
    if (el.closest('#print-root') || !shown(el) || el.closest(':disabled')) continue;
    const cs = getComputedStyle(el), behind = bgOf(el.parentElement);
    const fill = over(parse(cs.backgroundColor) || [0, 0, 0, 0], behind);
    const parts = [ratio(fill, behind)];
    let edges = 0;
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${side}Width`]) >= 1 && cs[`border${side}Style`] !== 'none') { edges++; const c = parse(cs[`border${side}Color`]); if (c) parts.push(ratio(over(c, behind), behind)); }
    }
    if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1) { edges++; const c = parse(cs.outlineColor); if (c) parts.push(ratio(over(c, behind), behind)); }
    if (edges < 2 && parts[0] < 1.2) continue;   // text only (a link-like button, a divider line, a soft highlight): the text check covers it
    const best = Math.max(...parts);
    if (best < 3) out.edge.push(`${where}: box "${label(el)}" edge ${best.toFixed(2)}:1 on ${hex(behind)}`);
  }
  // cards: visible on the page
  for (const el of document.querySelectorAll('.daycard, .panel, .sum, .release-text, .note, details.more, details.week-notes, .pick-list, .sum-line, .banner, .thing, .grp, .picked')) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el), behind = bgOf(el.parentElement);
    const fill = over(parse(cs.backgroundColor) || [0, 0, 0, 0], behind);
    const parts = [ratio(fill, behind)];
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(cs[`border${side}Width`]) >= 1 && cs[`border${side}Style`] !== 'none') { const c = parse(cs[`border${side}Color`]); if (c) parts.push(ratio(over(c, behind), behind)); }
    const best = Math.max(...parts);
    if (best < 1.1) out.card.push(`${where}: card "${label(el)}" edge ${best.toFixed(2)}:1 on ${hex(behind)}`);
  }
  // the header logo
  const img = document.querySelector('.topbar .brand-logo');
  if (img && img.complete && img.naturalWidth) {
    const own = parse(getComputedStyle(img).backgroundColor);
    const behind = own && own[3] > 0.9 ? own : bgOf(img.parentElement);
    const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    // a logo in its own box (a white rectangle, say): the box is not the drawing (its most common opaque edge colour, on 60% of the edge)
    const W = cv.width, H = cv.height, edge = [];
    for (let x = 0; x < W; x++) edge.push(x, (H - 1) * W + x);
    for (let y = 1; y < H - 1; y++) edge.push(y * W, y * W + W - 1);
    const cnt = new Map();
    for (const p of edge) if (d[p * 4 + 3] >= 250) { const k = [0, 1, 2].map(j => d[p * 4 + j] >> 4).join(); cnt.set(k, (cnt.get(k) || 0) + 1); }
    const top = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0];
    const box = top && top[1] / edge.length >= 0.6 ? top[0].split(',').map(v => v * 16 + 8) : null;
    let seen = 0, total = 0;
    for (let i = 0; i < d.length; i += 16) { const a = d[i + 3] / 255; if (a < 0.1) continue; if (box && Math.abs(d[i] - box[0]) + Math.abs(d[i + 1] - box[1]) + Math.abs(d[i + 2] - box[2]) <= 48) continue; total += a; if (ratio(over([d[i], d[i + 1], d[i + 2], a], behind), behind) >= 2) seen += a; }
    out.logo = { share: total ? seen / total : 0, behind: hex(behind), plate: !!(own && own[3] > 0.9) };
  } else if (document.querySelector('.topbar .brand-mark')) out.logo = { share: 1, behind: 'svg mark with its own tile', plate: false };
  return out;
}

const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const problems = [], summary = [];
fs.mkdirSync(SHOTS, { recursive: true });

for (const b of brands) for (const phone of ['dark', 'light']) for (const tapped of [false, true]) {
  const theme = tapped ? (phone === 'dark' ? 'light' : 'dark') : phone;
  const tag = `${b.id} phone-${phone}${tapped ? ' tapped' : ''} -> ${theme}`;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: phone, acceptDownloads: true, locale: 'en-US' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const url = `${BASE}/${b.id}/`;
  await page.goto(url); await page.waitForSelector('[data-screen="you"]', { timeout: 60000 });
  const bgBefore = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (await page.evaluate(() => document.documentElement.hasAttribute('data-theme'))) problems.push(`${tag}: data-theme set before any tap`);
  if (tapped) {
    await page.click('.theme-btn');
    const st = await page.evaluate((k) => ({ theme: document.documentElement.getAttribute('data-theme'), pressed: document.querySelector('.theme-btn').getAttribute('aria-pressed'), bg: getComputedStyle(document.body).backgroundColor, saved: localStorage.getItem(k + '.theme'), keys: Object.keys(localStorage) }), b.key);
    if (st.theme !== theme) problems.push(`${tag}: data-theme is ${st.theme}`);
    if (st.pressed !== String(theme === 'dark')) problems.push(`${tag}: aria-pressed ${st.pressed}`);
    if (st.bg === bgBefore) problems.push(`${tag}: the page background did not change (${st.bg})`);
    if (st.saved !== theme) problems.push(`${tag}: saved ${st.saved}`);
    const extra = st.keys.filter(k => k !== b.key && k !== b.key + '.theme');
    if (extra.length) problems.push(`${tag}: localStorage holds ${extra.join(', ')}`);
    await page.reload(); await page.waitForSelector('[data-screen="you"]', { timeout: 60000 });
    const kept = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (kept !== theme) problems.push(`${tag}: after a reload data-theme is ${kept}`);
  } else {
    const pressed = await page.evaluate(() => document.querySelector('.theme-btn').getAttribute('aria-pressed'));
    if (pressed !== String(theme === 'dark')) problems.push(`${tag}: aria-pressed ${pressed} on a ${phone} phone`);
  }
  const res = { text: 0, edge: 0, card: 0, checked: 0, logo: null };
  const run = async (where) => {
    const r = await page.evaluate(audit, `${tag} ${where}`);
    problems.push(...r.text, ...r.edge, ...r.card);
    res.text += r.text.length; res.edge += r.edge.length; res.card += r.card.length; res.checked += r.checked;
    if (where === 'you') {
      res.logo = r.logo;
      if (!r.logo || r.logo.share < 0.5) problems.push(`${tag}: the logo hardly shows (${JSON.stringify(r.logo)})`);
    }
  };
  const shot = async (name) => { if (b.shots && !tapped) await page.screenshot({ path: path.join(SHOTS, `${b.id}-${theme}-${name}.png`) }); };
  await run('you'); await shot('1-first-screen');
  await page.click('[data-action="role"][data-value="client"]'); await run('you-client'); await page.click('[data-action="role"][data-value="self"]');
  await page.click('[data-action="next"]'); await run('goal');
  if (!QUICK) { await page.click('[data-action="goal"][data-value="athletic"]'); await page.waitForTimeout(150); await run('goal-athletic'); }
  await page.click('[data-action="goal"][data-value="muscle"]'); await page.waitForTimeout(100);
  await page.click('[data-action="next"]'); await page.waitForTimeout(200); await run('week');
  if (!QUICK) { await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; })); await run('week-options'); }
  await page.click('[data-action="next"]'); await page.waitForTimeout(200); await run('safety');
  await page.click('[data-action="health"][data-value="none"]');
  await page.check('input[data-field="accepted"]'); await run('safety-accepted');
  await page.click('[data-action="next"]');
  await page.waitForSelector('#daycard', { timeout: 240000 }); await page.waitForTimeout(300);
  await run('plan-day'); await shot('2-plan-day');
  if (!QUICK) {
    const strength = page.locator('#daycard button.row').filter({ has: page.locator('.dose') });
    if (await strength.count()) { await strength.first().click(); await page.waitForTimeout(150); await run('plan-row-open'); }
    for (const tab of await page.$$eval('.tabs [data-action="tab"]', els => els.map(e => e.dataset.value))) { await page.click(`.tabs [data-action="tab"][data-value="${tab}"]`); await page.waitForTimeout(200); await run('tab-' + tab); }
    await page.click('.tabs [data-action="tab"][data-value="day"]').catch(() => {}); await page.waitForTimeout(150);
  }
  // Save image: light, whatever the screen shows
  if (theme === 'dark' && !QUICK) {
    const btn = page.locator('[data-action="save-image"]');
    if (await btn.count()) {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }).catch(() => null), btn.first().click()]);
      if (!dl) problems.push(`${tag}: Save image gave no file`);
      else {
        const png = decodePng(fs.readFileSync(await dl.path()));
        let L = 0, n = 0;
        for (let i = 0; i < png.data.length; i += 4 * 97) { const [r, g, bb] = [png.data[i], png.data[i + 1], png.data[i + 2]]; L += (0.2126 * r + 0.7152 * g + 0.0722 * bb) / 255; n++; }
        res.saveImage = +(L / n).toFixed(2);
        if (L / n < 0.6) problems.push(`${tag}: Save image is dark (mean brightness ${(L / n).toFixed(2)})`);
        const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        if (after !== (tapped ? theme : null)) problems.push(`${tag}: Save image left data-theme ${after}`);
      }
    }
  }
  for (const e of errs) problems.push(`${tag}: page error ${e}`);
  summary.push({ brand: b.id, phone, tapped, theme, ...res, errors: errs.length });
  console.log(`${tag}: ${res.checked} texts checked; text < 4.5: ${res.text}, box edges < 3: ${res.edge}, cards hidden: ${res.card}; logo ${res.logo ? Math.round(res.logo.share * 100) + '% shows' + (res.logo.plate ? ' (on its plate)' : '') : '-'}${res.saveImage !== undefined ? `; Save image brightness ${res.saveImage}` : ''}; errors ${errs.length}`);
  await ctx.close();
}
await browser.close();
server.close();
fs.writeFileSync(path.join(TMP, 'summary.json'), JSON.stringify(summary, null, 1));
fs.rmSync(TMP, { recursive: true, force: true });
const uniq = [...new Set(problems)];
console.log(uniq.length ? '\n' + uniq.join('\n') : '\nevery brand reads in light and dark');
console.log(`problems: ${uniq.length}; screenshots: ${path.relative(ROOT, SHOTS) || SHOTS}`);
process.exit(uniq.length ? 1 : 0);
