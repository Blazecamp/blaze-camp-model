#!/usr/bin/env node
// tools/build-site.mjs - builds the public Plan Builder into site/ (what Vercel serves; vercel.json > buildCommand / outputDirectory).
// Dependency-free. Copies exactly what the page needs and nothing else from this repository:
//   app/*            -> site/            (index.html at the site root; the app's '../engine/' and '../model/' paths become './...')
//   app/vendor/*     -> site/vendor/     (jsPDF, as published, with its license)
//   engine/*.mjs     -> site/engine/     (+ engine/progression/*.mjs; never engine/fixtures/ or the engine's docs)
//   model/*.json     -> site/model/      (manifest, catalog, rules, templates, profiles; + model/i18n/*.json; no CHANGELOG / COMPILE_REPORT)
//   DISCLAIMER*.md, LICENSE -> site/
// Usage: node tools/build-site.mjs [--out <dir>]   (default: site/). Local preview: python3 -m http.server -d site 8000
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argOut = process.argv.indexOf('--out');
const OUT = path.resolve(argOut > 0 ? process.argv[argOut + 1] : path.join(ROOT, 'site'));
if (OUT === ROOT || !path.basename(OUT)) throw new Error('refusing to build into the repository root');

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

// 1. the app at the site root, its paths rewritten to the built layout
const APP_FILES = fs.readdirSync(path.join(ROOT, 'app')).filter(f => /\.(html|js|css|svg|png|ico|webmanifest)$/.test(f));
for (const f of APP_FILES) {
  let s = fs.readFileSync(path.join(ROOT, 'app', f), 'utf8');
  if (f.endsWith('.js')) {
    s = s.replace(/(['"`])\.\.\/(engine|model)\//g, '$1./$2/');
    if (/['"`]\.\.\//.test(s)) throw new Error(`app/${f}: a '../' path is left after the rewrite`);
  }
  put(f, s);
}

// 1b. vendored libraries, copied as they are (app/vendor/: jsPDF for Download PDF, with its license; loaded only on demand)
for (const f of fs.readdirSync(path.join(ROOT, 'app/vendor')).filter(x => /\.(js|txt)$/.test(x))) copy(`app/vendor/${f}`, `vendor/${f}`);

// 2. the engine (pure ES modules; no fixtures, no docs)
for (const dir of ['engine', 'engine/progression']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir)).filter(x => x.endsWith('.mjs'))) copy(`${dir}/${f}`, `${dir}/${f}`);
}

// 3. the compiled model the page fetches (app/model-loader.js)
for (const f of ['manifest.json', 'catalog.json', 'rules.json', 'templates.json', 'profiles.json']) copy(`model/${f}`, `model/${f}`);
for (const f of ['en.json', 'es.json', 'es_review.json']) copy(`model/i18n/${f}`, `model/i18n/${f}`);

// 4. the legal files
for (const f of ['DISCLAIMER.md', 'DISCLAIMER.es.md', 'LICENSE']) copy(f, f);

// a plain check: every relative import of every built module resolves inside site/
for (const rel of walk(OUT).filter(f => /\.(m?js)$/.test(f) && !f.startsWith('vendor' + path.sep))) {
  const s = fs.readFileSync(path.join(OUT, rel), 'utf8');
  for (const m of s.matchAll(/(?:import\s[^'"]*|import\(|from\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const target = path.resolve(path.dirname(path.join(OUT, rel)), m[1]);
    if (!target.startsWith(OUT) || !fs.existsSync(target)) throw new Error(`${rel}: import ${m[1]} does not resolve inside the site`);
  }
}
console.log(`site built: ${path.relative(ROOT, OUT) || OUT} (${files} files, ${(bytes / 1048576).toFixed(1)} MB)`);

function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, e.name);
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), rel)); else out.push(rel);
  }
  return out;
}
