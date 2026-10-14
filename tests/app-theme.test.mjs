// tests/app-theme.test.mjs - light and dark for every brand (coach CH7-15, 2026-10-14): brand colours that would vanish on the dark
// or the light page are shown in a shade that stands out (black, white, dark navy, bright yellow), every stylesheet honours the
// sun / moon button both ways, the logo plate, the button in the header, the only new stored thing (`<storage_key>.theme`), and
// every white-label brand is current with the generator (node tools/new-brand.mjs --refresh-all). The in-browser contrast check of
// every screen is tools/app-qa/themes.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT } from './helpers/models.mjs';
import { themeVars, contrastProblems, contrast, themeColor, logoPlate, brandCss, isNearBlack, isNearWhite, hueDistance, luminance, normHex } from '../tools/white-label/colors.mjs';
import { decodePng, logoPixels } from '../tools/white-label/images.mjs';
import { STRINGS } from '../app/i18n.js';

const brandIds = fs.readdirSync(path.join(ROOT, 'app/brands')).filter(f => /^[a-z0-9-]+\.js$/.test(f)).map(f => f.slice(0, -3)).sort();
const load = async (id) => (await import(pathToFileURL(path.join(ROOT, 'app/brands', id + '.js')).href)).BRAND;
const css = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

test('CH7-15 colours: black, white, dark navy and bright yellow brands read in light and dark', () => {
  for (const c of ['#000000', '#ffffff', '#0b1f3a', '#ffd400']) {
    const v = themeVars({ primary: c, accent: c });
    assert.deepEqual(contrastProblems(v), [], c);
    for (const t of ['light', 'dark']) {
      const T = v[t];
      for (const k of ['cta', 'accent', 'deep']) assert.ok(contrast(T[k], T.card) >= 3 && contrast(T[k], T.bg) >= 3, `${c} ${t} ${k} stands out 3:1`);
      for (const [fg, bg] of [['on-cta', 'cta'], ['on-accent', 'accent'], ['on-deep', 'deep']]) assert.ok(contrast(T[fg], T[bg]) >= 4.5, `${c} ${t} ${fg} on ${bg}`);
      for (const k of ['edge', 'ctl-line']) assert.ok(contrast(T[k], T.card) >= 3 && contrast(T[k], T.bg) >= 3, `${c} ${t} ${k} 3:1`);
      assert.ok(contrast(T['accent-ink'], T.card) >= 4.5 && contrast(T['pink-ink'], T.card) >= 4.5, `${c} ${t} coloured text`);
    }
  }
  // black: as it is on light; never black on black: a light grey on dark
  const k = themeVars({ primary: '#000000', accent: '#000000' });
  assert.equal(k.light.cta, '#000000');
  assert.ok(!isNearBlack(k.dark.accent) && !isNearBlack(k.dark.cta) && luminance(k.dark.accent) > 0.5, k.dark.accent);
  // white: the mirror (a dark grey on light; white stays on dark)
  const w = themeVars({ primary: '#ffffff', accent: '#ffffff' });
  assert.ok(!isNearWhite(w.light.cta) && !isNearWhite(w.light.accent), w.light.cta);
  assert.equal(w.dark.accent, '#ffffff');
  // dark navy: on dark, a lighter shade of the same blue (not grey)
  const n = themeVars({ primary: '#0b1f3a', accent: '#0b1f3a' });
  assert.equal(n.light.cta, '#0b1f3a');
  assert.ok(hueDistance(n.dark.accent, '#0b1f3a') < 12, n.dark.accent);
  // bright yellow: as it is on dark, a darker yellow on white
  const y = themeVars({ primary: '#ffd400', accent: '#ffd400' });
  assert.equal(y.dark.accent, '#ffd400');
  assert.ok(hueDistance(y.light.cta, '#ffd400') < 12 && contrast(y.light.cta, '#ffffff') >= 3, y.light.cta);
  // a black brand colour with a colour beside it: the other colour on dark (Mr. Strength's green)
  const g = themeVars({ primary: '#69cd3c', accent: '#1a1a1a' });
  assert.equal(g.dark.accent, '#69cd3c');
  assert.equal(g.light.accent, '#1a1a1a');
  // themeColor keeps a colour that already stands out
  assert.equal(themeColor('#0096ff', ['#041726'], { dark: true }), '#0096ff');
  assert.equal(themeColor('#000000', ['#0f0f10'], { dark: true, alts: ['#e31837'] }), '#e31837');
});

test('CH7-15 logo plate: a white box on dark, a dark drawing on dark, a white drawing on light, nothing for a colourful logo', () => {
  const img = (w, h, fn) => { const d = new Uint8Array(w * h * 4); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) d.set(fn(x, y), (y * w + x) * 4); return { w, h, data: d }; };
  const ink = (x, y) => x > 10 && x < 50 && y > 5 && y < 15;
  const boxed = img(60, 20, (x, y) => (ink(x, y) ? [20, 20, 20, 255] : [255, 255, 255, 255]));
  assert.deepEqual(logoPlate(logoPixels(boxed)), { light: null, dark: '#ffffff' });
  const black = img(60, 20, (x, y) => (ink(x, y) ? [0, 0, 0, 255] : [0, 0, 0, 0]));
  assert.deepEqual(logoPlate(logoPixels(black)), { light: null, dark: '#ffffff' });
  const white = img(60, 20, (x, y) => (ink(x, y) ? [255, 255, 255, 255] : [0, 0, 0, 0]));
  assert.deepEqual(logoPlate(logoPixels(white)), { light: '#1b1b1f', dark: null });
  const red = img(60, 20, (x, y) => (ink(x, y) ? [227, 24, 55, 255] : [0, 0, 0, 0]));
  assert.deepEqual(logoPlate(logoPixels(red)), { light: null, dark: null });
});

test('CH7-15 stylesheets: light by default and forced by data-theme="light"; dark with a dark phone or data-theme="dark", screen only', () => {
  const files = ['app/styles.css', ...brandIds.filter(id => fs.existsSync(path.join(ROOT, 'app/brands', id, 'brand.css'))).map(id => `app/brands/${id}/brand.css`)];
  assert.ok(files.length >= 3);
  for (const f of files) {
    const s = css(f);
    assert.match(s, /^:root \{[\s\S]*?color-scheme: light;/m, `${f}: light colours on :root`);
    const a = /@media screen and \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([\s\S]*?)\}\s*\}/.exec(s);
    const b = /@media screen \{\s*:root\[data-theme="dark"\] \{([\s\S]*?)\}\s*\}/.exec(s);
    assert.ok(a && b, `${f}: both dark blocks`);
    const vars = (x) => Object.fromEntries([...x.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
    assert.deepEqual(vars(a[1]), vars(b[1]), `${f}: the phone's dark and the button's dark are the same colours`);
    for (const k of ['bg', 'card', 'ink', 'accent', 'ctl-line', 'err']) assert.ok(k in vars(a[1]), `${f}: dark --${k}`);
    assert.doesNotMatch(s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media screen[^{]*\{\s*:root[^{]*\{[\s\S]*?\}\s*\}/g, ''), /data-theme="dark"/, `${f}: no dark rule outside the screen-only blocks`);
  }
  // the controls a person taps use the 3:1 edge, not the soft line
  const app = css('app/styles.css');
  for (const sel of ['.chip {', '.btn {', '.stepper input', '.search {', '.date {', '.check {', '.daytab {', '.sel select']) {
    const i = app.indexOf('\n' + sel) + 1; assert.ok(i > 0, sel);
    assert.match(app.slice(i, app.indexOf('}', i)), /var\(--ctl-line\)/, sel);
  }
  assert.doesNotMatch(app, /\.sheet-note \{[^}]*#b3261e/, 'the error words follow the theme');
});

test('CH7-15 header: the sun / moon button next to EN | ES, theme.js before the styles, its words in EN and ES', () => {
  const html = css('app/index.html');
  const iTheme = html.indexOf('<script src="theme.js" data-key="bc.lang"></script>'), iCss = html.indexOf('<link rel="stylesheet" href="styles.css">');
  assert.ok(iTheme > 0 && iTheme < iCss, 'theme.js runs before the first paint');
  assert.doesNotMatch(html, /<script>(?!<)/, 'no inline script (CSP script-src self)');
  assert.match(html, /<meta name="color-scheme" content="light dark">/);
  assert.match(html, /<div class="top-tools">\s*<button type="button" class="theme-btn" data-action="theme" aria-pressed="false" aria-label="Dark mode">[\s\S]*?<\/button>\s*<div class="lang"/);
  for (const l of ['en', 'es']) for (const k of ['theme.dark', 'theme.light']) assert.ok(STRINGS[l][k], `${l} ${k}`);
  assert.equal(STRINGS.es['theme.dark'], 'Modo oscuro');
  const theme = css('app/theme.js');
  assert.match(theme, /getAttribute\('data-key'\)/);
  assert.match(theme, /saved === 'light' \|\| saved === 'dark'/);
  assert.doesNotMatch(theme, /setItem/, 'theme.js only reads');
  const main = css('app/main.js');
  assert.match(main, /localStorage\.setItem\(BRAND\.storage_key \+ '\.theme', next\)/);
  assert.match(main, /prepare/, 'Save image takes its picture in the light colours');
});

test('CH7-15 every brand: a logo_plate; every white-label brand current with the generator (--refresh-all)', async () => {
  for (const id of brandIds) {
    const B = await load(id);
    assert.ok(B.logo_plate && 'light' in B.logo_plate && 'dark' in B.logo_plate, `${id}.logo_plate`);
    for (const t of ['light', 'dark']) assert.ok(B.logo_plate[t] === null || /^#[0-9a-f]{6}$/.test(B.logo_plate[t]), `${id} ${t}`);
    if (!B.white_label) continue;
    const src = css(`app/brands/${id}.js`);
    const inputs = JSON.parse(/^\/\/ {3}inputs: (\{.*\})$/m.exec(src)[1]);
    const [primary, accent, ink] = inputs.colors.split(',').map(normHex);
    assert.equal(css(`app/brands/${id}/brand.css`), brandCss({ name: inputs.name, primary, accent: accent || primary, ink }), `${id}: brand.css is current (node tools/new-brand.mjs --refresh-all)`);
    const v = themeVars({ primary, accent: accent || primary, ink });
    const png = decodePng(fs.readFileSync(path.join(ROOT, 'app/brands', id, 'logo.png')));
    assert.deepEqual(B.logo_plate, logoPlate(logoPixels(png), { light: v.light.card, dark: v.dark.card }), `${id}: logo_plate is current`);
  }
});

test('CH7-15 site build: theme.js gets the brand key, the logo plate style, the disclaimer pages follow the choice', () => {
  const wl = brandIds.filter(id => /"white_label": true/.test(css(`app/brands/${id}.js`)));
  const id = wl.find(x => /"dark": "#/.test(css(`app/brands/${x}.js`))) || wl[0];
  if (!id) return;
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-site-'));
  try {
    execFileSync(process.execPath, [path.join(ROOT, 'tools/build-site.mjs'), '--brand', id, '--out', out], { stdio: 'pipe' });
    const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
    assert.match(html, new RegExp(`<script src="theme.js" data-key="${id}\\.lang"></script>`));
    assert.ok(fs.existsSync(path.join(out, 'theme.js')));
    assert.match(html, /class="theme-btn"/);
    const B = JSON.parse(/export const BRAND = (\{[\s\S]*\});\nexport default/.exec(css(`app/brands/${id}.js`))[1]);
    if (B.logo_plate.dark) assert.ok(html.includes(`:root[data-theme="dark"] .brand-logo{background:${B.logo_plate.dark}`), 'the plate style');
    const disc = fs.readFileSync(path.join(out, 'disclaimer.html'), 'utf8');
    assert.match(disc, /<script src="theme.js" data-key="[^"]+"><\/script>\n<link rel="stylesheet" href="styles.css">/);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
