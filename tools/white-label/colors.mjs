// tools/white-label/colors.mjs - a white-label brand's colours: hex parsing, WCAG contrast, and the brand stylesheet
// (app/brands/<id>/brand.css) generated from two or three colours, light and dark, with the same CSS variable names as the
// Son Hábitos look (app/brands/sonhabitos/brand.css). Every text / background pair the page uses is checked and darkened or
// lightened until it reaches 4.5:1 (WCAG AA). No dependencies. Used by tools/new-brand.mjs; tested by tests/white-label.test.mjs.

/** '#abc' | '#aabbcc' | 'abc' -> '#aabbcc' (lower case), else null */
export function normHex(s) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(s || '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map(c => c + c).join('') : m[1];
  return '#' + h.toLowerCase();
}
export const rgb = (hex) => { const h = normHex(hex); return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); };
export const hex = ([r, g, b]) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

/** WCAG relative luminance and contrast ratio */
export function luminance(c) {
  const [r, g, b] = rgb(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** a mixed with b: t = share of b (0..1) */
export const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return hex(A.map((v, i) => v + (B[i] - v) * t)); };

/** HSL helpers (for "how grey is this colour" and hue distance) */
export function hsl(c) {
  const [r, g, b] = rgb(c).map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
/** a colour with some hue that is neither near-white nor near-black (what a brand colour looks like) */
export const isBrandish = (c) => { const [, s, l] = hsl(c); return s >= 0.25 && l >= 0.12 && l <= 0.9; };
export const hueDistance = (a, b) => { const d = Math.abs(hsl(a)[0] - hsl(b)[0]) % 360; return d > 180 ? 360 - d : d; };

/** `fg` moved toward black (or white) in small steps until it reaches `min` contrast on `bg` */
export function ensureContrast(fg, bg, min = 4.5, toward = null) {
  const dir = toward || (luminance(bg) > 0.4 ? '#000000' : '#ffffff');
  let c = normHex(fg);
  for (let i = 0; i <= 40 && contrast(c, bg) < min; i++) c = mix(fg, dir, i / 40);
  return c;
}
/** a fill colour and the text colour on it (white or near-black, whichever reads best); the fill is darkened or lightened
 *  until the pair reaches `min` */
export function fillPair(fill, min = 4.5, dark = '#111111') {
  const f = normHex(fill);
  const onWhite = contrast('#ffffff', f), onDark = contrast(dark, f);
  if (onWhite >= min) return { fill: f, on: '#ffffff' };
  if (onDark >= min) return { fill: f, on: dark };
  // neither: keep white text and darken the fill (a brand's buttons usually keep white text)
  return onWhite >= onDark ? { fill: ensureContrast(f, '#ffffff', min, '#000000'), on: '#ffffff' } : { fill: ensureContrast(f, dark, min, '#ffffff'), on: dark };
}

/** near-black (on a dark page it disappears) and near-white (on a white page it disappears) */
export const isNearBlack = (c) => luminance(c) < 0.03;
export const isNearWhite = (c) => luminance(c) > 0.8;
/** a lighter (`toward` white) or darker shade of `c` with at least `min` contrast on every one of `bgs` */
export function ensureAll(c, bgs, min, toward) {
  let x = normHex(c);
  for (let i = 0; i <= 40; i++) {
    x = mix(c, toward, i / 40);
    if (bgs.every(b => contrast(x, b) >= min)) return x;
  }
  return x;
}
/**
 * The brand colour `c` as one theme shows it (coach CH7-15: brand colours must not vanish on a dark or a light page): kept when it
 * stands out from the theme's surfaces (`min`: 3:1 for UI parts, WCAG 1.4.11); a near-black colour on a dark page (or a
 * near-white one on a white page) is replaced by the brand's other colour when that one stands out, else by a neutral light grey
 * (dark page) or dark grey (white page) - never black on black; any other colour is lightened (dark page) or darkened (white
 * page) in its own hue until it stands out.
 */
export function themeColor(c, surfaces, { dark, min = 3, alts = [] } = {}) {
  const x = normHex(c);
  if (surfaces.every(b => contrast(x, b) >= min)) return x;
  const vanishes = dark ? isNearBlack(x) : isNearWhite(x);
  if (!isBrandish(x)) {   // black, white or grey: no hue to keep
    for (const a of alts.map(normHex).filter(Boolean)) if (isBrandish(a) && surfaces.every(b => contrast(a, b) >= min)) return a;
    if (vanishes) return ensureAll(dark ? '#e4e4e7' : '#3a3a40', surfaces, min, dark ? '#ffffff' : '#000000');
  }
  return ensureAll(x, surfaces, min, dark ? '#ffffff' : '#000000');
}

/** every variable of the light and dark themes, from the brand's colours */
export function themeVars({ primary, accent, ink }) {
  const P0 = normHex(primary), A0 = normHex(accent || primary);
  // light: a white or near-white brand colour with no hue vanishes on the white page, so it is swapped for the other colour, or a
  // dark grey (a pale colour with a hue, a light yellow say, is darkened in its own hue below, and keeps the soft tints)
  const pale = (c) => isNearWhite(c) && !isBrandish(c);
  const P = pale(P0) ? themeColor(P0, ['#ffffff'], { dark: false, alts: [A0] }) : P0;
  const A = pale(A0) ? themeColor(A0, ['#ffffff'], { dark: false, alts: [P0] }) : A0;
  // the strong colour for selections, bars and coloured text: the accent, unless it is a light colour (yellow, mint ...) and the
  // primary is not: then the primary (a light accent stays in the soft tints, and in the dark theme)
  const S = contrast(A, '#ffffff') < 3 && contrast(P, '#ffffff') >= 3 ? P : A;
  const I = normHex(ink) && !isNearWhite(normHex(ink)) ? normHex(ink) : mix(mix(A, '#000000', 0.78), '#0b1416', 0.3);
  // light
  const bg = '#ffffff', card = '#ffffff', card2 = mix(A, '#ffffff', 0.95);
  const L = {};
  L.bg = bg; L.card = card; L['card-2'] = card2;
  L.ink = ensureContrast(I, card2, 7);
  L['ink-2'] = ensureContrast(mix(L.ink, '#ffffff', 0.22), card2, 7);
  L.muted = ensureContrast(mix(L.ink, '#ffffff', 0.32), card2, 4.5);
  L.line = mix(A, '#ffffff', 0.86); L['line-2'] = mix(A, '#ffffff', 0.8);
  // a fill is a UI part: at least 3:1 on the page (WCAG 1.4.11), then its text 4.5:1
  const acc = fillPair(ensureContrast(S, '#ffffff', 3, '#000000')); L.accent = acc.fill; L['on-accent'] = acc.on;
  L['accent-ink'] = ensureAll(S, [card2, mix(P, '#ffffff', 0.9)], 4.5, '#000000');   // also on the pink-soft release banner (its link)
  L['accent-soft'] = mix(A, '#ffffff', 0.9);
  const cta = fillPair(ensureContrast(P, '#ffffff', 3, '#000000')); L.cta = cta.fill; L['on-cta'] = cta.on; L['cta-edge'] = mix(cta.fill, '#000000', 0.25);
  const deep = fillPair(ensureAll(mix(S, L.ink, S === A ? 0.55 : 0.25), ['#ffffff', card2], 4.5, '#000000')); L.deep = deep.fill; L['on-deep'] = deep.on;
  L['pink-soft'] = mix(P, '#ffffff', 0.9); L['pink-ink'] = ensureAll(P, [L['pink-soft'], card, card2], 4.5, '#000000');
  // the darker bottom edge of pills and the border of inputs: a UI part, 3:1 on the page (CH7-15: no box hides on the page)
  L.edge = ensureAll(mix(A, '#ffffff', 0.68), [card, card2], 3, '#000000'); L['ctl-line'] = L.edge;
  L.ok = '#1d7a46'; L.err = '#b3261e'; L['warn-bg'] = '#fff4d6'; L['warn-ink'] = '#6b4a00'; L['warn-line'] = '#f0d48a';
  L['heat-0'] = mix(A, '#ffffff', 0.93); L['heat-rgb'] = rgb(L.accent).join(', ');
  const sh = rgb(mix(A, '#000000', 0.6)).join(', ');
  L.shadow = `0 1px 2px rgba(${sh}, .05), 0 6px 22px rgba(${sh}, .07)`;
  // dark: the page is tinted with a brand colour that has a hue (a black or grey brand gets a neutral page), and every brand colour
  // is shown as it stands out there (themeColor: a black brand colour becomes the other colour or a light grey, never black on black)
  const T = [A0, P0].find(isBrandish) || '#8a8a92';
  const D = {};
  D.bg = mix(mix(T, '#000000', 0.88), '#0b0b0d', 0.4); D.card = mix(D.bg, T, 0.06); D['card-2'] = mix(D.bg, T, 0.1);
  const dSurf = [D.bg, D.card, D['card-2']];
  const dA = themeColor(A0, dSurf, { dark: true, alts: [P0] }), dP = themeColor(P0, dSurf, { dark: true, alts: [A0] });
  D.ink = ensureContrast(mix(T, '#ffffff', 0.92), D['card-2'], 7);
  D['ink-2'] = ensureContrast(mix(T, '#ffffff', 0.78), D['card-2'], 7);
  D.muted = ensureContrast(mix(T, '#ffffff', 0.6), D['card-2'], 4.5);
  D.line = ensureAll(mix(D.bg, dA, 0.2), [D.card], 1.35, '#ffffff'); D['line-2'] = ensureAll(mix(D.bg, dA, 0.28), [D.card], 1.6, '#ffffff');
  const dAcc = fillPair(dA); D.accent = dAcc.fill; D['on-accent'] = dAcc.on;
  D['accent-ink'] = ensureAll(mix(dA, '#ffffff', 0.25), [...dSurf, mix(D.bg, dP, 0.22)], 4.5, '#ffffff');
  D['accent-soft'] = mix(D.bg, dA, 0.22);
  const dCta = fillPair(dP); D.cta = dCta.fill; D['on-cta'] = dCta.on; D['cta-edge'] = mix(dCta.fill, '#000000', 0.35);
  // the selected pill's fill, and the text colour of outlined buttons (.btn, steppers, arrows): 4.5:1 on the page as text
  let dDeep = ensureAll(dA, dSurf, 4.5, '#ffffff');
  for (let i = 0; i < 20 && Math.max(contrast('#ffffff', dDeep), contrast('#000000', dDeep)) < 4.5; i++) dDeep = mix(dDeep, '#ffffff', 0.05);
  D.deep = dDeep; D['on-deep'] = contrast('#ffffff', dDeep) >= 4.5 ? '#ffffff' : contrast('#111111', dDeep) >= 4.5 ? '#111111' : '#000000';
  D['pink-soft'] = mix(D.bg, dP, 0.22); D['pink-ink'] = ensureAll(mix(dP, '#ffffff', 0.4), [D['pink-soft'], ...dSurf], 4.5, '#ffffff');
  D.edge = ensureAll(mix(D.bg, dA, 0.5), dSurf, 3, '#ffffff'); D['ctl-line'] = D.edge;
  D.err = '#ff8a80'; D['warn-bg'] = '#2d2410'; D['warn-ink'] = '#f3d590'; D['warn-line'] = '#5a4716'; D['heat-0'] = D['card-2']; D['heat-rgb'] = rgb(D.accent).join(', ');
  D.shadow = '0 1px 2px rgba(0, 0, 0, .4), 0 6px 20px rgba(0, 0, 0, .35)';
  return { light: L, dark: D };
}

/**
 * The plate behind the header logo in each theme (CH7-15: a logo must not vanish on a dark or a light page), from the logo's pixels
 * (tools/white-label/images.mjs > logoPixels) and the theme's page colour. A logo with a solid background (a white box, say) gets
 * a rounded plate of that colour wherever the page is a different colour; a logo whose drawing is mostly too close to the page
 * colour (under 2:1 for more than half of it) gets a plate in the other theme's page colour. null = no plate.
 */
export function logoPlate(px, pages = { light: '#ffffff', dark: '#0b0b0d' }) {
  const out = { light: null, dark: null };
  for (const theme of ['light', 'dark']) {
    const page = pages[theme];
    if (px.opaque && px.bg) {
      const bg = hex(px.bg);
      if (contrast(bg, page) >= 1.25) out[theme] = bg;
      continue;
    }
    let seen = 0, total = 0;
    for (const [r, g, b, a] of px.samples) { total += a; if (contrast(hex([r, g, b]), page) >= 2) seen += a; }
    if (total && seen / total < 0.5) out[theme] = theme === 'dark' ? '#ffffff' : '#1b1b1f';
  }
  return out;
}

/** the text / background pairs the stylesheet uses, each of which must reach 4.5:1 (tests and new-brand check them) */
export const PAIRS = [
  ['ink', 'bg'], ['ink', 'card'], ['ink', 'card-2'], ['ink-2', 'card'], ['ink-2', 'card-2'], ['muted', 'card'], ['muted', 'card-2'],
  ['accent-ink', 'bg'], ['accent-ink', 'card'], ['accent-ink', 'card-2'], ['on-accent', 'accent'], ['on-cta', 'cta'],
  ['on-deep', 'deep'], ['pink-ink', 'pink-soft'], ['pink-ink', 'card'], ['pink-ink', 'bg'], ['ink', 'pink-soft'], ['ink-2', 'pink-soft'], ['ink', 'accent-soft'],
  ['accent-ink', 'pink-soft'], ['deep', 'card'], ['deep', 'bg'], ['deep', 'card-2'], ['warn-ink', 'warn-bg']
];
/** the UI parts (fills and box edges) that must stand out 3:1 from the page and the cards (WCAG 1.4.11; CH7-15) */
export const UI_PARTS = [['cta', 'card'], ['cta', 'bg'], ['accent', 'card'], ['accent', 'bg'], ['deep', 'card'], ['edge', 'card'], ['edge', 'bg'], ['edge', 'card-2']];
/** every pair under `min`: [] when the theme is fine */
export function contrastProblems(vars, min = 4.5) {
  const out = [];
  for (const theme of ['light', 'dark']) {
    for (const [fg, bg] of PAIRS) {
      const r = contrast(vars[theme][fg], vars[theme][bg]);
      if (r < min) out.push({ theme, fg, bg, ratio: Math.round(r * 100) / 100 });
    }
    for (const [fill, bg] of UI_PARTS) {   // buttons, selections, the progress bar and every box's edge stand out from the page (3:1)
      const r = contrast(vars[theme][fill], vars[theme][bg]);
      if (r < 3) out.push({ theme, fg: fill, bg, ratio: Math.round(r * 100) / 100 });
    }
  }
  return out;
}

const block = (v) => Object.entries(v).map(([k, x]) => `--${k}: ${x};`);

/** app/brands/<id>/brand.css for a white-label brand: the variables, then the shared white-label look (the Son Hábitos rules). The
 *  light colours are the default and are forced by <html data-theme="light">; the dark ones come with a dark phone unless
 *  data-theme="light", or with data-theme="dark" (the sun / moon button; CH7-15); dark is for the screen only (print stays light). */
export function brandCss({ name, primary, accent, ink }) {
  const v = themeVars({ primary, accent, ink });
  const light = block(v.light).map(x => '  ' + x).join('\n');
  const dark = block(v.dark).join(' ');
  return `/* ${name} - the brand's look over app/styles.css (loaded after it). Generated by tools/new-brand.mjs from the brand's colours
   (primary ${normHex(primary)}, accent ${normHex(accent || primary)}${ink ? ', ink ' + normHex(ink) : ''}); every text colour reaches 4.5:1 on its background,
   light and dark, and every box edge a person taps 3:1 (CH7-15). Regenerate with tools/new-brand.mjs --force rather than editing
   by hand. No external fonts (the CSP allows only the site's own files). */
:root {
${light}
  --radius: 22px;
  --radius-sm: 14px;
  --font: Inter, "Manrope", "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Roboto, Arial, sans-serif;
  color-scheme: light;
}
@media screen and (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    ${dark} color-scheme: dark;
  }
}
@media screen {
  :root[data-theme="dark"] {
    ${dark} color-scheme: dark;
  }
}
${RULES}`;
}

// the shared look (the same rules as the Son Hábitos stylesheet, over the variables above)
const RULES = `body { letter-spacing: -.005em; }

/* top bar: the logo, a thin rule */
.topbar { background: var(--card); color: var(--ink); border-bottom: 1px solid var(--line); min-height: 60px; }
.brand { gap: 10px; min-width: 0; }
.brand-logo { display: block; height: 44px; width: auto; max-width: 150px; object-fit: contain; flex: none; }
.brand-sub { color: var(--accent-ink); font-size: 12px; font-weight: 700; letter-spacing: .01em; margin: 0; line-height: 1.2; max-width: 112px; min-width: 0; }
.lang { border: 1.5px solid var(--line-2); box-shadow: 0 2px 0 var(--edge); background: var(--card); }
.lang button { color: var(--ink-2); }
.lang button[aria-pressed="true"] { background: var(--deep); color: var(--on-deep); }
.theme-btn { border: 1.5px solid var(--line-2); border-bottom: 3px solid var(--edge); background: var(--card); color: var(--deep); }

/* headings */
h1.step-title { font-weight: 650; letter-spacing: -.025em; color: var(--ink); }
.welcome { margin: 2px 0 4px; }
.eyebrow { margin: 0 0 2px; font-size: 12.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-ink); }
.welcome .lead { margin: 0 0 4px; font-size: 15.5px; color: var(--ink-2); }
.field > .label, .label { font-weight: 650; color: var(--ink); }
.dot { background: var(--line); }
.dot.on, .dot.done { background: var(--accent); }

/* buttons: pills with a darker bottom edge */
.btn { border-radius: 999px; border: 1.5px solid var(--line-2); border-bottom-width: 4px; border-bottom-color: var(--edge); font-weight: 750; color: var(--deep); }
.btn.primary { background: var(--cta); border-color: var(--cta); border-bottom-color: var(--cta-edge); color: var(--on-cta); }
.btn.ghost { background: var(--card); }
.btn:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
.btn.small { border-radius: 999px; }
.wiz-nav { background: color-mix(in srgb, var(--card) 94%, transparent); }

/* chips, segments, cards */
.chip { border-radius: 999px; border-width: 1.5px; border-bottom-width: 3px; border-color: var(--line-2); border-bottom-color: var(--edge); font-weight: 650; }
.chips.small .chip, .chips.pain .chip { border-radius: 999px; }
.chips.grid8 .chip, .chips.grid7 .chip { border-radius: 16px; }
.chip[aria-pressed="true"] { background: var(--deep); border-color: var(--deep); color: var(--on-deep); }
.chip small { color: var(--accent-ink); }
.chip[aria-pressed="true"] small { color: var(--on-deep); }
.seg { border-radius: 999px; background: var(--card-2); border-color: var(--line); }
.seg button { border-radius: 999px; font-weight: 650; }
.seg.tiny, .seg.tiny button { border-radius: 999px; }
.seg button[aria-pressed="true"] { background: var(--deep); color: var(--on-deep); outline: 0; box-shadow: none; }
.stepper button { border-radius: 999px; border-width: 1.5px; border-bottom-width: 3px; border-color: var(--line-2); border-bottom-color: var(--edge); color: var(--deep); }
.stepper input, .search, .date, .sel select { border-radius: 16px; border-width: 1.5px; border-color: var(--ctl-line); }
.card-btn { border-radius: var(--radius); border-width: 1.5px; border-bottom-width: 4px; border-color: var(--line-2); border-bottom-color: var(--edge); box-shadow: none; }
.card-btn .t { font-weight: 700; color: var(--ink); }
.card-btn .ic { color: var(--pink-ink); }
.card-btn[aria-pressed="true"] { border-color: var(--cta); border-bottom-color: var(--cta-edge); background: var(--pink-soft); }
.cards.mini .card-btn, .cards.kit .card-btn { border-radius: 18px; }
.picked { border-radius: var(--radius-sm); border-color: var(--cta); background: var(--pink-soft); }
.pick-list, .release-text, .sum, details.more, .sum-line, .note { border-radius: var(--radius-sm); }
.pick-group { color: var(--accent-ink); letter-spacing: .1em; }
.check { border-radius: var(--radius-sm); border-width: 1.5px; border-color: var(--ctl-line); }
.check.on { border-color: var(--cta); background: var(--pink-soft); }
.check input { accent-color: var(--cta); }
.link-btn { color: var(--pink-ink); }
a { color: var(--accent-ink); }
details.more > summary::after, details.week-notes > summary::after, details.sec > summary::after { color: var(--pink-ink); }

/* the plan */
.tabs { border-radius: 999px; background: var(--card-2); }
.tabs button { border-radius: 999px; font-weight: 700; }
.tabs button[aria-selected="true"] { background: var(--deep); color: var(--on-deep); }
.weekbar .arrow { border-radius: 999px; border-width: 1.5px; border-bottom-width: 3px; border-color: var(--line-2); border-bottom-color: var(--edge); color: var(--deep); }
.weekbar .wk { font-weight: 750; color: var(--ink); }
.daytab { border-radius: 16px; border-width: 1.5px; border-bottom-width: 3px; border-color: var(--line-2); border-bottom-color: var(--edge); font-weight: 700; }
.daytab[aria-selected="true"] { background: var(--deep); border-color: var(--deep); color: var(--on-deep); }
.daycard { border-radius: var(--radius); }
.dc-head { border-bottom: 3px solid var(--cta); }
.dc-head .wd { color: var(--accent-ink); letter-spacing: .1em; }
.dc-head .tt { font-weight: 750; letter-spacing: -.02em; font-size: 18px; }
.dc-brand { font-style: normal; color: var(--pink-ink); letter-spacing: .08em; }
.row .num { color: var(--pink-ink); }
.badge.plus { background: var(--cta); color: var(--on-cta); }
.badge.new { border-color: var(--cta); color: var(--pink-ink); }
.badge.test { background: var(--deep); color: var(--on-deep); }
.tips-btn { border-radius: 999px; padding: 0 9px; font-size: 12px; }
.tips-btn span { color: var(--pink-ink); }
.det .prog, .md blockquote { border-left-color: var(--accent); }
.panel, details.sec, details.week-notes { border-radius: var(--radius); }
.panel h2 { font-weight: 750; letter-spacing: -.015em; }
table.heat td.f { color: var(--accent-ink); }
.banner.release { background: var(--pink-soft); border-color: var(--line-2); color: var(--ink-2); }
.building .bar span { background: var(--cta); }
.spinner { border-top-color: var(--cta); }
.foot { color: var(--muted); }
.foot p:first-child { color: var(--accent-ink); font-weight: 700; letter-spacing: .04em; }
.sheet { border-radius: var(--radius) var(--radius) 0 0; }
@media (min-width: 700px) { .sheet { border-radius: var(--radius); } }

@media (max-width: 360px) { .brand-logo { height: 38px; max-width: 120px; } .brand-sub { display: none; } }

/* the disclaimer pages (disclaimer.html, disclaimer.es.html) */
.legal-page .topbar { position: static; }
.legal-nav a { font-weight: 700; color: var(--accent-ink); text-decoration: none; border: 1.5px solid var(--line-2); border-bottom-width: 3px; border-bottom-color: var(--edge); border-radius: 999px; padding: 6px 14px; }
.legal-doc { max-width: 760px; margin: 0 auto; padding: 16px 16px 48px; font-size: 16px; line-height: 1.55; color: var(--ink-2); }
.legal-doc h1 { font-size: 30px; font-weight: 650; letter-spacing: -.025em; color: var(--ink); line-height: 1.15; }
.legal-doc h2, .legal-doc h3 { color: var(--ink); font-weight: 700; margin-top: 22px; }
.legal-doc blockquote { background: var(--pink-soft); border-left-color: var(--cta); border-radius: 0 12px 12px 0; }
`;
