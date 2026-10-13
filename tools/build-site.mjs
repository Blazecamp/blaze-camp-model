#!/usr/bin/env node
// tools/build-site.mjs - builds the public Plan Builder into site/ (what Vercel serves; vercel.json > buildCommand / outputDirectory).
// Dependency-free. Copies exactly what the page needs and nothing else from this repository:
//   app/*            -> site/            (index.html at the site root; the app's '../engine/' and '../model/' paths become './...')
//   app/vendor/*     -> site/vendor/     (jsPDF, as published, with its license)
//   engine/*.mjs     -> site/engine/     (+ engine/progression/*.mjs; never engine/fixtures/ or the engine's docs)
//   model/*.json     -> site/model/      (manifest, catalog, rules, templates, profiles; + model/i18n/*.json; no CHANGELOG / COMPILE_REPORT)
//   DISCLAIMER*.md, LICENSE -> site/
// One codebase, several brands (app/brands/<id>.js). The brand comes from `--brand <id>`, else the env var BRAND, else blazecamp:
//   * site/brand.js re-exports that brand; only its brand file and its assets (app/brands/<id>/) are copied;
//   * index.html's language, <title>, description, theme colour, icons, stylesheet and logo come from the brand;
//   * a brand with a `legal` block (Son Hábitos) gets the coach's legal party wording (tools/brand-legal.mjs) in the site's copy
//     of the model's words and rules, its own disclaimer pages (disclaimer.html, disclaimer.es.html) instead of DISCLAIMER*.md
//     and LICENSE, and the build fails if any page, script or style still names the other brand.
// The model/ and engine/ files in the repository are never changed. The Blaze Camp build is the same site as before brands.
// Usage: node tools/build-site.mjs [--out <dir>] [--brand blazecamp|sonhabitos]   Local preview: python3 -m http.server -d site 8000
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { brandI18n, legalSub, legalPartyTexts } from './brand-legal.mjs';
import { markdown, escapeHtml } from '../app/md.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const OUT = path.resolve(arg('--out') || path.join(ROOT, 'site'));
if (OUT === ROOT || !path.basename(OUT)) throw new Error('refusing to build into the repository root');
const BRAND_ID = String(arg('--brand') || process.env.BRAND || 'blazecamp').trim().toLowerCase();
if (!/^[a-z0-9-]+$/.test(BRAND_ID) || !fs.existsSync(path.join(ROOT, 'app/brands', BRAND_ID + '.js'))) {
  throw new Error(`unknown brand '${BRAND_ID}' (app/brands/<id>.js: ${fs.readdirSync(path.join(ROOT, 'app/brands')).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)).join(', ')})`);
}
const { BRAND } = await import(pathToFileURL(path.join(ROOT, 'app/brands', BRAND_ID + '.js')).href);
const LEGAL = BRAND.legal || null;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
let files = 0, bytes = 0;
const put = (rel, data) => {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
  files++; bytes += Buffer.byteLength(data);
};
const copy = (from, to) => put(to, fs.readFileSync(path.join(ROOT, from)));
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 1. the app at the site root, its paths rewritten to the built layout
const APP_FILES = fs.readdirSync(path.join(ROOT, 'app')).filter(f => /\.(html|js|css|svg|png|ico|webmanifest)$/.test(f));
for (const f of APP_FILES) {
  let s = fs.readFileSync(path.join(ROOT, 'app', f), 'utf8');
  if (f.endsWith('.js')) {
    s = s.replace(/(['"`])\.\.\/(engine|model)\//g, '$1./$2/');
    if (/['"`]\.\.\//.test(s)) throw new Error(`app/${f}: a '../' path is left after the rewrite`);
  }
  if (f === 'brand.js') s = `// site/brand.js - the brand this site was built for (tools/build-site.mjs --brand ${BRAND.id}).\nexport { BRAND } from './brands/${BRAND.id}.js';\n`;
  if (f === 'index.html') s = brandIndex(s);
  put(f, s);
}

// 1a. the brand: its file and its assets only
put(`brands/${BRAND.id}.js`, fs.readFileSync(path.join(ROOT, 'app/brands', BRAND.id + '.js')));
for (const a of BRAND.assets || []) copy(`app/brands/${BRAND.id}/${a}`, `brands/${BRAND.id}/${a}`);

// 1b. vendored libraries, copied as they are (app/vendor/: jsPDF for Download PDF, with its license; loaded only on demand)
for (const f of fs.readdirSync(path.join(ROOT, 'app/vendor')).filter(x => /\.(js|txt)$/.test(x))) copy(`app/vendor/${f}`, `vendor/${f}`);

// 2. the engine (pure ES modules; no fixtures, no docs). For a brand with its own legal wording, a comment line that names the
//    other brand is left out of the copy (comments only: the code is byte-for-byte the engine's).
const NAMES = /blaze|\blalo\b|\bgerardo\b/i;   // "slalom" holds "lalo": whole words for the names
for (const dir of ['engine', 'engine/progression']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir)).filter(x => x.endsWith('.mjs'))) {
    if (!LEGAL) { copy(`${dir}/${f}`, `${dir}/${f}`); continue; }
    const src = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
    put(`${dir}/${f}`, src.split('\n').filter(line => !(/^\s*\/\//.test(line) && NAMES.test(line))).join('\n'));
  }
}

// 3. the compiled model the page fetches (app/model-loader.js); a brand with a legal block gets its party wording in the copy
for (const f of ['manifest.json', 'catalog.json', 'templates.json', 'profiles.json']) copy(`model/${f}`, `model/${f}`);
if (!LEGAL) {
  copy('model/rules.json', 'model/rules.json');
  for (const f of ['en.json', 'es.json', 'es_review.json']) copy(`model/i18n/${f}`, `model/i18n/${f}`);
} else {
  const rules = JSON.parse(fs.readFileSync(path.join(ROOT, 'model/rules.json'), 'utf8'));
  if (rules.legal) {
    rules.legal.owner = legalSub(String(rules.legal.owner || '').replace(/^Lalo Vera \/ Blaze Camp \/ BFit Studios Corp\.$/, 'Lalo Vera, Blaze Camp and BFit Studios Corp.'), 'en', LEGAL).replace(/\.$/, '');
    // the brand's own disclaimer pages; the page sets the absolute link from its address at load time (app/brand-apply.js)
    const host = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'https://localhost');
    rules.legal.disclaimer_url = { ...rules.legal.disclaimer_url, en: new URL(LEGAL.disclaimer.en, host.replace(/\/?$/, '/')).href, es: new URL(LEGAL.disclaimer.es, host.replace(/\/?$/, '/')).href };
  }
  put('model/rules.json', JSON.stringify(rules, null, 1) + '\n');
  for (const lang of ['en', 'es']) {
    const table = JSON.parse(fs.readFileSync(path.join(ROOT, `model/i18n/${lang}.json`), 'utf8'));
    const out = brandI18n(table, lang, LEGAL).table;
    // the brand's display words (brand.model_words; the page applies them too, app/brand-apply.js > brandRaw)
    for (const [k, v] of Object.entries((BRAND.model_words && BRAND.model_words[lang]) || {})) if (k in out) out[k] = v;
    put(`model/i18n/${lang}.json`, JSON.stringify(out, null, 1) + '\n');
  }
  const rev = fs.readFileSync(path.join(ROOT, 'model/i18n/es_review.json'), 'utf8');
  put('model/i18n/es_review.json', JSON.stringify(deepSub(JSON.parse(rev), 'es'), null, 1) + '\n');
}

// 4. the legal files: the repository's disclaimers and license, or, for a brand with its own legal wording, its disclaimer pages
if (!LEGAL) {
  for (const f of ['DISCLAIMER.md', 'DISCLAIMER.es.md', 'LICENSE']) copy(f, f);
} else {
  put(LEGAL.disclaimer.en, disclaimerPage('DISCLAIMER.md', 'en'));
  put(LEGAL.disclaimer.es, disclaimerPage('DISCLAIMER.es.md', 'es'));
}

// a plain check: every relative import of every built module resolves inside site/
for (const rel of walk(OUT).filter(f => /\.(m?js)$/.test(f) && !f.startsWith('vendor' + path.sep))) {
  const s = fs.readFileSync(path.join(OUT, rel), 'utf8');
  for (const m of s.matchAll(/(?:import\s[^'"]*|import\(|from\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const target = path.resolve(path.dirname(path.join(OUT, rel)), m[1]);
    if (!target.startsWith(OUT) || !fs.existsSync(target)) throw new Error(`${rel}: import ${m[1]} does not resolve inside the site`);
  }
}
// a brand with its own legal wording: no page, script, style or model word may name the other brand; the owner's name only
// inside the legal party wording (coach's decision)
if (LEGAL) {
  const allowed = legalPartyTexts(LEGAL);
  for (const rel of walk(OUT).filter(f => /\.(html|m?js|css|json|md|txt|svg)$/.test(f))) {
    let s = fs.readFileSync(path.join(OUT, rel), 'utf8');
    for (const a of allowed) s = s.split(a).join('');
    const m = NAMES.exec(s);
    if (m) throw new Error(`${rel}: names '${s.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}' (brand ${BRAND.id})`);
  }
}
console.log(`site built: ${path.relative(ROOT, OUT) || OUT} (brand ${BRAND.id}; ${files} files, ${(bytes / 1048576).toFixed(1)} MB)`);

/** index.html for the brand: language, <title>, description, theme colour, icons, stylesheet, logo (the source file is Blaze Camp's) */
function brandIndex(html) {
  const lang = BRAND.lang_default, M = BRAND.meta[lang];
  const sub = (re, to) => { if (!re.test(html)) throw new Error(`app/index.html: ${re} not found`); html = html.replace(re, to); };
  sub(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  sub(/<title>[^<]*<\/title>/, `<title>${escapeHtml(M.title).replace(/&#39;/g, "'")}</title>`);
  sub(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(M.description)}">`);
  sub(/<meta name="theme-color" content="[^"]*">/, `<meta name="theme-color" content="${attr(BRAND.html.theme_color)}">`);
  sub(/<link rel="icon"[^>]*>/, () => BRAND.html.icons);
  sub(/<link rel="stylesheet" href="styles.css">/, `<link rel="stylesheet" href="styles.css">${BRAND.html.css ? `\n<link rel="stylesheet" href="${attr(BRAND.html.css)}">` : ''}`);
  sub(/<a class="brand" href="\.\/" aria-label="[^"]*">[\s\S]*?<\/a>/, () => `<a class="brand" href="./" aria-label="${attr(BRAND.name)}">${BRAND.html.logo}</a>`);
  if (lang !== 'en') {
    sub(/data-value="en" aria-pressed="true"/, 'data-value="en" aria-pressed="false"');
    sub(/data-value="es" aria-pressed="false"/, 'data-value="es" aria-pressed="true"');
    sub(/<p>Loading\.\.\.<\/p>/, '<p>Cargando...</p>');
  }
  return html;
}

/** strings anywhere in a JSON value, with the brand's legal wording */
function deepSub(v, lang) {
  if (typeof v === 'string') return legalSub(v, lang, LEGAL);
  if (Array.isArray(v)) return v.map(x => deepSub(x, lang));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepSub(x, lang)]));
  return v;
}

/** the brand's disclaimer page: the repository's DISCLAIMER*.md with the brand's legal party wording, as a plain HTML page */
function disclaimerPage(file, lang) {
  let md = fs.readFileSync(path.join(ROOT, file), 'utf8');
  md = legalSub(md, lang, LEGAL)
    .replace(/`DISCLAIMER\.es\.md`/g, lang === 'en' ? `[${LEGAL.disclaimer.es}](${LEGAL.disclaimer.es})` : '`' + LEGAL.disclaimer.es + '`')
    .replace(/`DISCLAIMER\.md`/g, `[${LEGAL.disclaimer.en}](${LEGAL.disclaimer.en})`);
  // md.js links only http(s); the two pages link each other by a relative link
  const body = markdown(md).replace(/<a href="#"[^>]*>([^<]*)<\/a>/g, (m, t) => `<a href="${attr(t)}">${t}</a>`);
  const title = (/^#\s+(.*)$/m.exec(md) || [, BRAND.name])[1];
  const other = lang === 'en' ? `<a href="${LEGAL.disclaimer.es}" lang="es">Español</a>` : `<a href="${LEGAL.disclaimer.en}" lang="en">English</a>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} - ${escapeHtml(BRAND.name)}</title>
<meta name="description" content="${attr(title)} - ${attr(BRAND.name)}">
<meta name="theme-color" content="${attr(BRAND.html.theme_color)}">
<meta name="referrer" content="no-referrer">
${BRAND.html.icons}
<link rel="stylesheet" href="styles.css">${BRAND.html.css ? `\n<link rel="stylesheet" href="${attr(BRAND.html.css)}">` : ''}
</head>
<body class="legal-page">
<header class="topbar">
  <a class="brand" href="./" aria-label="${attr(BRAND.name)}">${BRAND.html.logo.replace(/<span class="brand-sub"[^>]*>[^<]*<\/span>/, '')}</a>
  <nav class="legal-nav">${other}</nav>
</header>
<main class="legal-doc md">
${body}
</main>
</body>
</html>
`;
}

function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, e.name);
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), rel)); else out.push(rel);
  }
  return out;
}
