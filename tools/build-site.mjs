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
//   * a brand with a `legal` block (Son Hábitos, every white-label brand) gets the coach's legal party wording
//     (tools/brand-legal.mjs) in the site's copy of the model's words and rules, its own disclaimer pages (disclaimer.html,
//     disclaimer.es.html) instead of DISCLAIMER*.md and LICENSE;
//   * every brand other than the default one is checked for leaks (tools/white-label/leaks.mjs): the build fails if any page,
//     script, style or model word names the default brand, its owner (outside the legal party wording) or another brand.
// The model/ and engine/ files in the repository are never changed. The Blaze Camp build is the same site as before brands.
//
// White-label previews (WHITE_LABEL.md): `--all-brands`, or env BRAND=previews (the Vercel project "white-label-previews",
// https://white-label-previews.vercel.app), builds every white-label brand (`white_label: true`, set by tools/new-brand.mjs; never
// the default brand or the brands that have their own sites) into site/<id>/ (each a full copy of the app with its brand, with <base href="/<id>/"> so /<id> and /<id>/
// both work, and <meta name="robots" content="noindex"> on every page). The site root is a plain "nothing here" page (noindex, no
// list of brands, so one client cannot see another) and robots.txt disallows everything. The API is not used on previews.
//
// Usage: node tools/build-site.mjs [--out <dir>] [--brand <id>] [--site https://...] [--brands-dir <dir>]
//        node tools/build-site.mjs --all-brands [--out <dir>]          Local preview: python3 -m http.server -d site 8000
//   --site        the brand's public address (its disclaimer link in the model's rules); else env SITE_URL, else the Vercel address
//   --brands-dir  where the brand files are (default app/brands; env BC_BRANDS_DIR): tools/new-brand.mjs uses it for a trial run
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { legalSub, brandModelRaw } from './brand-legal.mjs';
import { leakChecker, readBrands, DEFAULT_BRAND, OWNER_NAMES } from './white-label/leaks.mjs';
import { markdown, escapeHtml } from '../app/md.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const OUT = path.resolve(arg('--out') || path.join(ROOT, 'site'));
if (OUT === ROOT || !path.basename(OUT)) throw new Error('refusing to build into the repository root');
const APP_BRANDS = path.join(ROOT, 'app/brands');
const BRANDS_DIR = path.resolve(arg('--brands-dir') || process.env.BC_BRANDS_DIR || APP_BRANDS);
const ids = () => fs.readdirSync(BRANDS_DIR).filter(f => /^[a-z0-9-]+\.js$/.test(f)).map(f => f.slice(0, -3)).sort();
const PREVIEWS = process.argv.includes('--all-brands') || String(process.env.BRAND || '').trim().toLowerCase() === 'previews';
// the default: blazecamp, or the only brand there is (an exported brand: tools/export-brand.mjs)
const fallback = ids().includes(DEFAULT_BRAND) || ids().length !== 1 ? DEFAULT_BRAND : ids()[0];
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

if (!PREVIEWS) {
  const BRAND_ID = String(arg('--brand') || process.env.BRAND || fallback).trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(BRAND_ID) || !fs.existsSync(path.join(BRANDS_DIR, BRAND_ID + '.js'))) {
    throw new Error(`unknown brand '${BRAND_ID}' (app/brands/<id>.js: ${ids().join(', ')})`);
  }
  const host = arg('--site') || process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'https://localhost');
  const r = await buildBrand(BRAND_ID, OUT, { host });
  console.log(`site built: ${path.relative(ROOT, OUT) || OUT} (brand ${BRAND_ID}; ${r.files} files, ${(r.bytes / 1048576).toFixed(1)} MB)`);
} else {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const origin = (arg('--site') || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'https://localhost')).replace(/\/+$/, '');
  const wl = [];
  for (const id of ids()) if ((await import(pathToFileURL(path.join(BRANDS_DIR, id + '.js')).href)).BRAND.white_label === true) wl.push(id);
  for (const id of wl) {
    const r = await buildBrand(id, path.join(OUT, id), { host: `${origin}/${id}/`, base: `/${id}/` });
    console.log(`preview built: ${id}/ (${r.files} files, ${(r.bytes / 1048576).toFixed(1)} MB)`);
  }
  fs.writeFileSync(path.join(OUT, 'index.html'), previewsRoot());
  fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log(`previews built: ${path.relative(ROOT, OUT) || OUT} (${wl.length} white-label brand${wl.length === 1 ? '' : 's'}; the root page lists none)`);
}

/**
 * One brand's site into `OUT`. opts.host: the brand's public address (its disclaimer link in rules.legal); opts.base: the path
 * the site is served under (previews only: adds <base href> and noindex to every page).
 */
async function buildBrand(BRAND_ID, OUT, opts) {
  const { BRAND } = await import(pathToFileURL(path.join(BRANDS_DIR, BRAND_ID + '.js')).href);
  const LEGAL = BRAND.legal || null;

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  let files = 0, bytes = 0;
  const put = (rel, data) => {
    const p = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    if (opts.base && rel.endsWith('.html')) data = previewHead(String(data), opts.base);
    fs.writeFileSync(p, data);
    files++; bytes += Buffer.byteLength(data);
  };
  const copy = (from, to) => put(to, fs.readFileSync(path.join(ROOT, from)));

  // 1. the app at the site root, its paths rewritten to the built layout
  const APP_FILES = fs.readdirSync(path.join(ROOT, 'app')).filter(f => /\.(html|js|css|svg|png|ico|webmanifest)$/.test(f));
  for (const f of APP_FILES) {
    let s = fs.readFileSync(path.join(ROOT, 'app', f), 'utf8');
    if (f.endsWith('.js')) {
      s = s.replace(/(['"`])\.\.\/(engine|model)\//g, '$1./$2/');
      if (/['"`]\.\.\//.test(s)) throw new Error(`app/${f}: a '../' path is left after the rewrite`);
    }
    if (f === 'brand.js') s = `// site/brand.js - the brand this site was built for (tools/build-site.mjs --brand ${BRAND.id}).\nexport { BRAND } from './brands/${BRAND.id}.js';\n`;
    if (f === 'index.html') s = brandIndex(s, BRAND);
    put(f, s);
  }

  // 1a. the brand: its file and its assets only
  put(`brands/${BRAND.id}.js`, fs.readFileSync(path.join(BRANDS_DIR, BRAND.id + '.js')));
  for (const a of BRAND.assets || []) put(`brands/${BRAND.id}/${a}`, fs.readFileSync(path.join(BRANDS_DIR, BRAND.id, a)));

  // 1b. vendored libraries, copied as they are (app/vendor/: jsPDF for Download PDF, with its license; loaded only on demand)
  for (const f of fs.readdirSync(path.join(ROOT, 'app/vendor')).filter(x => /\.(js|txt)$/.test(x))) copy(`app/vendor/${f}`, `vendor/${f}`);

  // 2. the engine (pure ES modules; no fixtures, no docs). For a brand with its own legal wording, a comment line that names the
  //    other brand is left out of the copy (comments only: the code is byte-for-byte the engine's).
  for (const dir of ['engine', 'engine/progression']) {
    for (const f of fs.readdirSync(path.join(ROOT, dir)).filter(x => x.endsWith('.mjs'))) {
      if (!LEGAL) { copy(`${dir}/${f}`, `${dir}/${f}`); continue; }
      const src = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
      put(`${dir}/${f}`, src.split('\n').filter(line => !(/^\s*\/\//.test(line) && OWNER_NAMES.test(line))).join('\n'));
    }
  }

  // 3. the compiled model the page fetches (app/model-loader.js); a brand with a legal block gets its party wording in the copy
  for (const f of ['manifest.json', 'catalog.json', 'templates.json', 'profiles.json']) copy(`model/${f}`, `model/${f}`);
  if (!LEGAL) {
    copy('model/rules.json', 'model/rules.json');
    for (const f of ['en.json', 'es.json', 'es_review.json']) copy(`model/i18n/${f}`, `model/i18n/${f}`);
  } else {
    // the one description of what a brand changes in the model's words (tools/brand-legal.mjs > brandModelRaw; the agent tools use it too)
    const readJ = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'model', f), 'utf8'));
    const b = brandModelRaw({ rules: readJ('rules.json'), i18n: { en: readJ('i18n/en.json'), es: readJ('i18n/es.json'), es_review: readJ('i18n/es_review.json') } }, BRAND, { siteUrl: opts.host });
    put('model/rules.json', JSON.stringify(b.rules, null, 1) + '\n');
    for (const lang of ['en', 'es']) put(`model/i18n/${lang}.json`, JSON.stringify(b.i18n[lang], null, 1) + '\n');
    put('model/i18n/es_review.json', JSON.stringify(b.i18n.es_review, null, 1) + '\n');
  }

  // 4. the legal files: the repository's disclaimers and license, or, for a brand with its own legal wording, its disclaimer pages
  if (!LEGAL) {
    for (const f of ['DISCLAIMER.md', 'DISCLAIMER.es.md', 'LICENSE']) copy(f, f);
  } else {
    put(LEGAL.disclaimer.en, disclaimerPage('DISCLAIMER.md', 'en', BRAND));
    put(LEGAL.disclaimer.es, disclaimerPage('DISCLAIMER.es.md', 'es', BRAND));
  }

  // a plain check: every relative import of every built module resolves inside the site
  for (const rel of walk(OUT).filter(f => /\.(m?js)$/.test(f) && !f.startsWith('vendor' + path.sep))) {
    const s = fs.readFileSync(path.join(OUT, rel), 'utf8');
    for (const m of s.matchAll(/(?:import\s[^'"]*|import\(|from\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target = path.resolve(path.dirname(path.join(OUT, rel)), m[1]);
      if (!target.startsWith(OUT) || !fs.existsSync(target)) throw new Error(`${rel}: import ${m[1]} does not resolve inside the site`);
    }
  }
  // every brand but the default one: no page, script, style or model word may name the default brand or another brand; the owner's
  // name only inside the legal party wording (coach's decisions CH7-02, CH7-03)
  if (BRAND.id !== DEFAULT_BRAND) {
    const others = [...await readBrands(APP_BRANDS), ...(BRANDS_DIR === APP_BRANDS ? [] : await readBrands(BRANDS_DIR))];
    const check = leakChecker(BRAND, others);
    for (const rel of walk(OUT).filter(f => /\.(html|m?js|css|json|md|txt|svg)$/.test(f))) {
      const found = check(fs.readFileSync(path.join(OUT, rel), 'utf8'));
      if (found) throw new Error(`${rel}: names ${found} (brand ${BRAND.id})`);
    }
  }
  return { files, bytes };
}

/** a previews page: <base href> right after the charset (so /<id> and /<id>/ load the same files) and noindex */
function previewHead(html, base) {
  if (!html.includes('<meta charset="utf-8">')) throw new Error('a page without <meta charset="utf-8">');
  return html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<base href="${attr(base)}">\n<meta name="robots" content="noindex, nofollow">`);
}

// the previews site's root page: nothing to see, and no list of brands
function previewsRoot() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<title>Preview</title>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:0;padding:16px;display:grid;place-items:center;min-height:100vh;box-sizing:border-box;background:#fff;color:#333}@media (prefers-color-scheme:dark){body{background:#111;color:#ddd}}</style>
</head>
<body>
<p>Nothing here. Use the link you were sent. · No hay nada aquí. Usa el enlace que te enviaron.</p>
</body>
</html>
`;
}

/** index.html for the brand: language, <title>, description, theme colour, icons, stylesheet, logo (the source file is Blaze Camp's) */
function brandIndex(html, BRAND) {
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

/** the brand's disclaimer page: the repository's DISCLAIMER*.md with the brand's legal party wording, as a plain HTML page */
function disclaimerPage(file, lang, BRAND) {
  const LEGAL = BRAND.legal;
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
