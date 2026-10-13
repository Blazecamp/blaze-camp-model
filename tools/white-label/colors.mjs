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

/** every variable of the light and dark themes, from the brand's colours */
export function themeVars({ primary, accent, ink }) {
  const P = normHex(primary), A = normHex(accent || primary);
  // the strong colour for selections, bars and coloured text: the accent, unless it is a light colour (yellow, mint ...) and the
  // primary is not: then the primary (a light accent stays in the soft tints, and in the dark theme)
  const S = contrast(A, '#ffffff') < 3 && contrast(P, '#ffffff') >= 3 ? P : A;
  const I = normHex(ink) || mix(mix(A, '#000000', 0.78), '#0b1416', 0.3);
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
  L['accent-ink'] = ensureContrast(S, card2, 4.5);
  L['accent-soft'] = mix(A, '#ffffff', 0.9);
  const cta = fillPair(ensureContrast(P, '#ffffff', 3, '#000000')); L.cta = cta.fill; L['on-cta'] = cta.on; L['cta-edge'] = mix(cta.fill, '#000000', 0.25);
  const deep = fillPair(ensureContrast(mix(S, L.ink, S === A ? 0.55 : 0.25), '#ffffff', 4.5)); L.deep = deep.fill; L['on-deep'] = deep.on;
  L['pink-soft'] = mix(P, '#ffffff', 0.9); L['pink-ink'] = ensureContrast(P, L['pink-soft'], 4.5);
  L.edge = mix(A, '#ffffff', 0.68);
  L.ok = '#1d7a46'; L['warn-bg'] = '#fff4d6'; L['warn-ink'] = '#6b4a00'; L['warn-line'] = '#f0d48a';
  L['heat-0'] = mix(A, '#ffffff', 0.93); L['heat-rgb'] = rgb(L.accent).join(', ');
  const sh = rgb(mix(A, '#000000', 0.6)).join(', ');
  L.shadow = `0 1px 2px rgba(${sh}, .05), 0 6px 22px rgba(${sh}, .07)`;
  // dark
  const D = {};
  D.bg = mix(mix(A, '#000000', 0.88), '#0b0b0d', 0.4); D.card = mix(D.bg, A, 0.06); D['card-2'] = mix(D.bg, A, 0.1);
  D.ink = ensureContrast(mix(A, '#ffffff', 0.92), D['card-2'], 7);
  D['ink-2'] = ensureContrast(mix(A, '#ffffff', 0.78), D['card-2'], 7);
  D.muted = ensureContrast(mix(A, '#ffffff', 0.6), D['card-2'], 4.5);
  D.line = mix(D.bg, A, 0.2); D['line-2'] = mix(D.bg, A, 0.28);
  const dAcc = fillPair(ensureContrast(A, D.card, 3, '#ffffff')); D.accent = dAcc.fill; D['on-accent'] = dAcc.on;
  D['accent-ink'] = ensureContrast(mix(A, '#ffffff', 0.25), D['card-2'], 4.5);
  D['accent-soft'] = mix(D.bg, A, 0.22);
  const dCta = fillPair(ensureContrast(P, D.card, 3, '#ffffff')); D.cta = dCta.fill; D['on-cta'] = dCta.on; D['cta-edge'] = mix(dCta.fill, '#000000', 0.35);
  D.deep = D.accent; D['on-deep'] = D['on-accent'];
  D['pink-soft'] = mix(D.bg, P, 0.22); D['pink-ink'] = ensureContrast(mix(P, '#ffffff', 0.4), D['pink-soft'], 4.5);
  D.edge = D['line-2'];
  D['warn-bg'] = '#2d2410'; D['warn-ink'] = '#f3d590'; D['warn-line'] = '#5a4716'; D['heat-0'] = D['card-2']; D['heat-rgb'] = rgb(D.accent).join(', ');
  D.shadow = '0 1px 2px rgba(0, 0, 0, .4), 0 6px 20px rgba(0, 0, 0, .35)';
  return { light: L, dark: D };
}

/** the text / background pairs the stylesheet uses, each of which must reach 4.5:1 (tests and new-brand check them) */
export const PAIRS = [
  ['ink', 'bg'], ['ink', 'card'], ['ink', 'card-2'], ['ink-2', 'card'], ['ink-2', 'card-2'], ['muted', 'card'], ['muted', 'card-2'],
  ['accent-ink', 'bg'], ['accent-ink', 'card'], ['accent-ink', 'card-2'], ['on-accent', 'accent'], ['on-cta', 'cta'],
  ['on-deep', 'deep'], ['pink-ink', 'pink-soft'], ['ink', 'pink-soft'], ['ink-2', 'pink-soft'], ['ink', 'accent-soft'], ['warn-ink', 'warn-bg']
];
/** every pair under `min`: [] when the theme is fine */
export function contrastProblems(vars, min = 4.5) {
  const out = [];
  for (const theme of ['light', 'dark']) {
    for (const [fg, bg] of PAIRS) {
      const r = contrast(vars[theme][fg], vars[theme][bg]);
      if (r < min) out.push({ theme, fg, bg, ratio: Math.round(r * 100) / 100 });
    }
    for (const fill of ['cta', 'accent']) {   // buttons and the progress bar stand out from the page (3:1)
      const r = contrast(vars[theme][fill], vars[theme].card);
      if (r < 3) out.push({ theme, fg: fill, bg: 'card', ratio: Math.round(r * 100) / 100 });
    }
  }
  return out;
}

const block = (v) => Object.entries(v).map(([k, x]) => `--${k}: ${x};`);

/** app/brands/<id>/brand.css for a white-label brand: the variables, then the shared white-label look (the Son Hábitos rules) */
export function brandCss({ name, primary, accent, ink }) {
  const v = themeVars({ primary, accent, ink });
  const light = block(v.light).map(x => '  ' + x).join('\n');
  const dark = block(v.dark).join(' ');
  return `/* ${name} - the brand's look over app/styles.css (loaded after it). Generated by tools/new-brand.mjs from the brand's colours
   (primary ${normHex(primary)}, accent ${normHex(accent || primary)}${ink ? ', ink ' + normHex(ink) : ''}); every text colour reaches 4.5:1 on its background,
   light and dark. Regenerate with tools/new-brand.mjs --force rather than editing by hand. No external fonts (the CSP allows only
   the site's own files). */
:root {
${light}
  --radius: 22px;
  --radius-sm: 14px;
  --font: Inter, "Manrope", "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Roboto, Arial, sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    ${dark} color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  ${dark} color-scheme: dark;
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
.stepper input, .search, .date, .sel select { border-radius: 16px; border-width: 1.5px; border-color: var(--line-2); }
.card-btn { border-radius: var(--radius); border-width: 1.5px; border-bottom-width: 4px; border-color: var(--line-2); border-bottom-color: var(--edge); box-shadow: none; }
.card-btn .t { font-weight: 700; color: var(--ink); }
.card-btn .ic { color: var(--pink-ink); }
.card-btn[aria-pressed="true"] { border-color: var(--cta); border-bottom-color: var(--cta-edge); background: var(--pink-soft); }
.cards.mini .card-btn, .cards.kit .card-btn { border-radius: 18px; }
.picked { border-radius: var(--radius-sm); border-color: var(--cta); background: var(--pink-soft); }
.pick-list, .release-text, .sum, details.more, .sum-line, .note { border-radius: var(--radius-sm); }
.pick-group { color: var(--accent-ink); letter-spacing: .1em; }
.check { border-radius: var(--radius-sm); border-width: 1.5px; border-color: var(--line-2); }
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
.banner.release { background: var(--pink-soft); border-color: transparent; color: var(--ink-2); }
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
