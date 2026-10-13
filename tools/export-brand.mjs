#!/usr/bin/env node
// tools/export-brand.mjs - the hand-off for a paying white-label client (WHITE_LABEL.md, step 3): one brand only, nothing else.
//
//   node tools/export-brand.mjs --brand <id> --out <dir> [--site https://plan.theirgym.com] [--with-api] [--zip]
//
// Default (static): <dir>/website/ is the brand's built site (index.html, the app, engine, model, the brand's assets and its
//   disclaimer pages). It works on any static host: their web host (upload the folder), Netlify, Vercel, cPanel. Beside it:
//   README.md (English) and LEEME.md (Spanish) "how to put this on your website", LICENSE (MIT: keep the notice) and the
//   disclaimer in the brand's legal wording (DISCLAIMER.md, DISCLAIMER.es.md).
// --with-api: <dir>/ is a Vercel-ready project instead: the site's sources (app/ with only this brand, engine/, the model in the
//   brand's words), the API (api/, agent/) with the brand's agent pack (agent/packs/<id>/), tools/build-site.mjs and vercel.json
//   with the build fixed to this brand. Deploying it gives their own site + /api/questions, /api/plan, /api/openapi.
// --zip: also <dir>.zip (no dependencies).
// --site: where it will live (the disclaimer link in the plans and the agent pack's API address); default the brand file's
//   site_url (for a new white-label brand, its preview address: pass --site once their domain is known).
//
// Never exported: other brands' files, the coach's answers, raw/, dumps/, tests, design, reviews, samples, synthesis, docs.
// Checked before it finishes: the build's leak check, and a scan of every exported text file for another brand's name (the MIT
// LICENSE notice and the two files that do the legal substitution are the only exceptions).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { legalSub, brandModelRaw } from './brand-legal.mjs';
import { leakChecker, readBrands, scanFolder, OWNER_NAMES, DEFAULT_BRAND } from './white-label/leaks.mjs';
import { zipFolder } from './white-label/zip.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
class InputError extends Error {}
const fail = (m) => { throw new InputError(m); };

/** files a static export may hold (relative to <out>), and folders a --with-api export may hold */
export const STATIC_TOP = ['website', 'README.md', 'LEEME.md', 'LICENSE', 'DISCLAIMER.md', 'DISCLAIMER.es.md'];
export const API_TOP = ['app', 'engine', 'model', 'api', 'agent', 'tools', 'vercel.json', 'README.md', 'LEEME.md', 'LICENSE', 'DISCLAIMER.md', 'DISCLAIMER.es.md'];
/** the two files that hold the default brand's name on purpose: the legal substitution and the leak check itself */
export const CODE_EXEMPT = ['tools/brand-legal.mjs', 'tools/white-label/leaks.mjs', 'LICENSE'];

export async function exportBrand(o) {
  const id = String(o.brand || '').trim().toLowerCase();
  if (!id) fail('--brand <id> is needed');
  const brandsDir = path.resolve(o['brands-dir'] || path.join(ROOT, 'app/brands'));
  const file = path.join(brandsDir, id + '.js');
  if (!/^[a-z0-9-]+$/.test(id) || !fs.existsSync(file)) fail(`unknown brand '${id}'`);
  if (id === DEFAULT_BRAND) fail(`'${id}' is the default brand, not a white-label one`);
  if (!o.out) fail('--out <dir> is needed (a new, empty folder)');
  const out = path.resolve(o.out);
  if (out === ROOT || out.startsWith(ROOT + path.sep)) fail('choose an --out folder outside the repository (so the export is never committed by mistake)');
  if (fs.existsSync(out) && fs.readdirSync(out).length && !o.force) fail(`${out} is not empty (add --force to replace it)`);
  const { BRAND } = await import(pathToFileURL(file).href + '?t=' + fs.statSync(file).mtimeMs);
  if (!BRAND.legal) fail(`brand '${id}' has no legal block; only white-label brands are exported`);
  const site = (o.site || BRAND.site_url || '').replace(/\/?$/, '/');
  if (!/^https:\/\//.test(site)) fail('--site https://... is needed (where the site will live)');
  if (o.site && !/^https:\/\/[^\s/]+\.[^\s]+$/i.test(o.site)) fail(`--site must be an https:// address (got '${o.site}')`);
  const warnings = [];
  if (/white-label-previews|vercel\.app\/[a-z0-9-]+\/$/.test(site) && !o.site) warnings.push(`the site address is the preview link (${site}); pass --site https://plan.theirgym.com for the real one`);

  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const env = { ...process.env, BC_BRANDS_DIR: brandsDir };
  delete env.BRAND; delete env.SITE_URL;
  const others = [...await readBrands(path.join(ROOT, 'app/brands')), ...(brandsDir === path.join(ROOT, 'app/brands') ? [] : await readBrands(brandsDir))];
  const check = leakChecker(BRAND, others);
  const write = (rel, data) => { const p = path.join(out, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, data); };
  const disclaimer = (f, lang) => legalSub(fs.readFileSync(path.join(ROOT, f), 'utf8'), lang, BRAND.legal);

  // the legal files: MIT (keep the notice) and the disclaimer in the brand's legal wording (the build reads them too)
  write('LICENSE', fs.readFileSync(path.join(ROOT, 'LICENSE')));
  write('DISCLAIMER.md', disclaimer('DISCLAIMER.md', 'en'));
  write('DISCLAIMER.es.md', disclaimer('DISCLAIMER.es.md', 'es'));

  if (!o['with-api']) {
    // the static site, built for this brand at its address
    execFileSync(process.execPath, [path.join(ROOT, 'tools/build-site.mjs'), '--brand', id, '--brands-dir', brandsDir, '--out', path.join(out, 'website'), '--site', site], { env, stdio: 'pipe' });
    write('README.md', readmeStatic(BRAND, site, 'en'));
    write('LEEME.md', readmeStatic(BRAND, site, 'es'));
  } else {
    // a Vercel-ready project: the sources of this brand's site and its API
    const brandSrc = fs.readFileSync(file, 'utf8').replace(/("site_url":\s*)"[^"]*"/, `$1${JSON.stringify(site)}`);
    write(`app/brands/${id}.js`, brandSrc);
    for (const a of BRAND.assets || []) write(`app/brands/${id}/${a}`, fs.readFileSync(path.join(brandsDir, id, a)));
    for (const f of fs.readdirSync(path.join(ROOT, 'app')).filter(f => /\.(html|js|css|svg|png|ico|webmanifest)$/.test(f) || f === 'package.json')) {
      const s = f === 'brand.js' ? `// app/brand.js - the active brand.\nexport { BRAND } from './brands/${id}.js';\n`
        : f === 'index.html' ? neutralIndex(fs.readFileSync(path.join(ROOT, 'app', f), 'utf8'), BRAND)
        : fs.readFileSync(path.join(ROOT, 'app', f));
      write(`app/${f}`, f.endsWith('.js') ? code(String(s), id, check) : s);
    }
    for (const f of fs.readdirSync(path.join(ROOT, 'app/vendor')).filter(x => /\.(js|txt)$/.test(x))) write(`app/vendor/${f}`, fs.readFileSync(path.join(ROOT, 'app/vendor', f)));
    for (const dir of ['engine', 'engine/progression']) {
      for (const f of fs.readdirSync(path.join(ROOT, dir)).filter(x => x.endsWith('.mjs'))) write(`${dir}/${f}`, code(fs.readFileSync(path.join(ROOT, dir, f), 'utf8'), id, check));
    }
    // the model in the brand's words (the API and the build apply the same wording again: it changes nothing the second time)
    const readJ = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'model', f), 'utf8'));
    for (const f of ['manifest.json', 'catalog.json', 'templates.json', 'profiles.json']) write(`model/${f}`, fs.readFileSync(path.join(ROOT, 'model', f)));
    const b = brandModelRaw({ rules: readJ('rules.json'), i18n: { en: readJ('i18n/en.json'), es: readJ('i18n/es.json'), es_review: readJ('i18n/es_review.json') } }, BRAND, { siteUrl: site });
    write('model/rules.json', JSON.stringify(b.rules, null, 1) + '\n');
    for (const l of ['en', 'es']) write(`model/i18n/${l}.json`, JSON.stringify(b.i18n[l], null, 1) + '\n');
    write('model/i18n/es_review.json', JSON.stringify(b.i18n.es_review, null, 1) + '\n');
    for (const f of fs.readdirSync(path.join(ROOT, 'api')).filter(x => x.endsWith('.mjs'))) write(`api/${f}`, code(fs.readFileSync(path.join(ROOT, 'api', f), 'utf8'), id, check));
    for (const f of ['core.mjs', 'http.mjs', 'mcp-server.mjs', 'questions.mjs']) write(`agent/${f}`, code(fs.readFileSync(path.join(ROOT, 'agent', f), 'utf8'), id, check));
    for (const f of ['build-site.mjs', 'brand-legal.mjs', 'plan.mjs', 'white-label/leaks.mjs']) {
      const s = fs.readFileSync(path.join(ROOT, 'tools', f), 'utf8');
      write(`tools/${f}`, CODE_EXEMPT.includes(`tools/${f}`) ? s : code(s, id, check));
    }
    // the brand's agent pack, at its own address
    const packTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pack-'));
    try {
      const penv = { ...env, [`SITE_URL_${id.toUpperCase().replace(/-/g, '_')}`]: site };
      execFileSync(process.execPath, [path.join(ROOT, 'agent/packs.mjs'), '--brand', id, '--out', packTmp], { env: penv, stdio: 'pipe' });
      for (const f of fs.readdirSync(path.join(packTmp, id))) write(`agent/packs/${id}/${f}`, fs.readFileSync(path.join(packTmp, id, f)));
      fs.chmodSync(path.join(out, `agent/packs/${id}/check.sh`), 0o755);
    } finally { fs.rmSync(packTmp, { recursive: true, force: true }); }
    const vj = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    vj.buildCommand = `node tools/build-site.mjs --brand ${id}`;
    write('vercel.json', JSON.stringify(vj, null, 2) + '\n');
    write('README.md', readmeApi(BRAND, site, 'en'));
    write('LEEME.md', readmeApi(BRAND, site, 'es'));
    // it builds on its own (what Vercel will run), and the API answers
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'export-check-'));
    try {
      const cenv = { ...process.env }; delete cenv.BRAND; delete cenv.BC_BRANDS_DIR; delete cenv.SITE_URL;
      for (const rel of listAll(out).filter(f => /\.m?js$/.test(f) && !f.startsWith('app/vendor/'))) execFileSync(process.execPath, ['--check', path.join(out, rel)], { stdio: 'pipe' });
      execFileSync(process.execPath, [path.join(out, 'tools/build-site.mjs'), '--out', tmp, '--site', site], { env: cenv, stdio: 'pipe', cwd: out });
      const probe = `import('${pathToFileURL(path.join(out, 'agent/core.mjs')).href}').then(async C => { const r = await C.buildPlan({ answers: { goal: 'general', days: 3, health: 'none', accepted: true }, lang: '${BRAND.lang_default}' }); if (r.status !== 'ok' || r.brand.id !== '${id}') { console.error(r.status, r.brand && r.brand.id, JSON.stringify(r.problems || r.errors)); process.exit(1); } })`;
      execFileSync(process.execPath, ['--input-type=module', '-e', probe], { env: cenv, stdio: 'pipe', cwd: out });
    } catch (e) { fail(`the exported project does not build or answer: ${String(e.stderr || e.message).trim().split('\n').slice(-4).join(' ')}`); } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  }

  // nothing else, and no other brand
  const allowed = o['with-api'] ? API_TOP : STATIC_TOP;
  for (const f of fs.readdirSync(out)) if (!allowed.includes(f)) fail(`unexpected ${f} in the export`);
  const leaks = scanFolder(out, (t) => check(t.replace(/https:\/\/(raw\.githubusercontent|github)\.com\/Blazecamp\/blaze-camp-model\S*/g, '')), { skip: (rel) => CODE_EXEMPT.includes(rel) });
  if (leaks.length) fail('the export names another brand: ' + leaks.map(l => `${l.file}: ${l.found}`).join('; '));
  for (const rel of listAll(out)) if (/(^|\/)(coach_answers|answers_raw|raw|dumps|tests|design|reviews|samples|synthesis|docs)(\/|_|$)/.test(rel) || new RegExp(`(^|/)brands/(?!${id}(\\.js$|/))`).test(rel)) fail(`not part of the product: ${rel}`);

  let zip = null;
  if (o.zip) { zip = out.replace(/\/+$/, '') + '.zip'; fs.writeFileSync(zip, zipFolder(out, path.basename(out))); }
  return { id, out, site, zip, files: listAll(out).length, warnings };
}

/** an exported code file: comment lines that name the default brand or its owner left out; its id literals become this brand's */
function code(s, id, check) {
  // a whole-line // comment, or a middle line of a /* */ block (never its first or last line), that names another brand
  const comment = (line) => /^\s*\/\//.test(line) || (/^\s*\*(?!\/)/.test(line) && !line.includes('*/')) || /^\s*\/\*.*\*\/\s*$/.test(line);
  return s.split('\n').filter(line => !(comment(line) && (OWNER_NAMES.test(line) || check(line)))).join('\n')
    .replace(/'blazecamp'/g, `'${id}'`).replace(/\bblaze-plan\b/g, `${id}-plan`);
}
/** app/index.html for an exported project: the brand's English title and description, a blank icon and an empty logo link, so
 *  the build (tools/build-site.mjs > brandIndex) fills them from the brand file exactly as it does for every brand */
function neutralIndex(html, B) {
  const a = (x) => String(x).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return html.replace(/<title>[^<]*<\/title>/, `<title>${a(B.meta.en.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${a(B.meta.en.description)}">`)
    .replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="data:,">')
    .replace(/<a class="brand" href="\.\/" aria-label="[^"]*">[\s\S]*?<\/a>/, `<a class="brand" href="./" aria-label="${a(B.name)}"></a>`);
}
function listAll(dir, base = '') {
  return fs.readdirSync(path.join(dir, base), { withFileTypes: true }).flatMap(e => {
    const rel = base ? base + '/' + e.name : e.name;
    return e.isDirectory() ? listAll(dir, rel) : [rel];
  });
}

function readmeStatic(B, site, lang) {
  const n = B.name, host = new URL(site).host;
  if (lang === 'es') return `# ${n}: tu creador de planes

Esta carpeta es tu creador de planes de entrenamiento, listo para tu sitio web. Todo pasa en el teléfono o la computadora de
quien lo usa: no hay servidor, no hay base de datos y no se guarda nada.

## Qué hay aquí

- \`website/\`: el sitio. Esto es lo que se sube.
- \`LICENSE\`: la licencia MIT. Debe quedarse con los archivos.
- \`DISCLAIMER.md\`, \`DISCLAIMER.es.md\`: el aviso legal (el sitio ya trae sus páginas: \`disclaimer.html\`, \`disclaimer.es.html\`).

## Cómo ponerlo en tu sitio web

**Opción A: un subdominio (recomendado).** Por ejemplo \`${host}\`.
1. En tu hosting, crea el subdominio (en cPanel: *Dominios* → *Crear dominio*).
2. Sube **el contenido** de \`website/\` a la carpeta de ese subdominio (con el *Administrador de archivos* o FTP).
3. Abre \`https://${host}/\`. Debe verse tu logo y debe poder crear un plan.

**Opción B: una carpeta de tu sitio.** Sube la carpeta \`website/\` (puedes renombrarla, por ejemplo \`plan\`) y abre
\`https://tusitio.com/plan/\` **con la barra al final**.

**Opción C: Netlify o Vercel.** Arrastra la carpeta \`website/\` a *Netlify Drop* (app.netlify.com/drop), o en Vercel:
*Add New → Project → Deploy* con esta carpeta. Luego agrega tu dominio en su configuración.

## Bueno saber

- Usa siempre \`https://\`. El sitio no necesita PHP, Node ni base de datos.
- El enlace del aviso legal en los planes apunta a \`${site}\`. Si el sitio queda en otra dirección, pide una copia nueva.
- Es información general de acondicionamiento físico, no consejo médico.
`;
  return `# ${n}: your plan builder

This folder is your training plan builder, ready for your website. Everything happens on the phone or computer of the person
using it: there is no server, no database, and nothing is saved.

## What is here

- \`website/\`: the site. This is what you upload.
- \`LICENSE\`: the MIT license. Keep it with the files.
- \`DISCLAIMER.md\`, \`DISCLAIMER.es.md\`: the legal notice (the site has its own pages: \`disclaimer.html\`, \`disclaimer.es.html\`).

## How to put it on your website

**Option A: a subdomain (recommended).** For example \`${host}\`.
1. At your web host, create the subdomain (in cPanel: *Domains* → *Create a New Domain*).
2. Upload **the contents** of \`website/\` into that subdomain's folder (with the *File Manager* or FTP).
3. Open \`https://${host}/\`. You should see your logo and be able to build a plan.

**Option B: a folder of your site.** Upload the \`website/\` folder (you can rename it, for example \`plan\`) and open
\`https://yoursite.com/plan/\` **with the slash at the end**.

**Option C: Netlify or Vercel.** Drag the \`website/\` folder onto *Netlify Drop* (app.netlify.com/drop), or in Vercel:
*Add New → Project → Deploy* with this folder. Then add your domain in its settings.

## Good to know

- Always use \`https://\`. The site needs no PHP, Node or database.
- The plans' legal link points to \`${site}\`. If the site ends up at another address, ask for a new copy.
- It is general fitness information, not medical advice.
`;
}

function readmeApi(B, site, lang) {
  const n = B.name, host = new URL(site).host, id = B.id;
  if (lang === 'es') return `# ${n}: creador de planes con API (proyecto para Vercel)

Esta carpeta es un proyecto listo para Vercel: el sitio de ${n} y su API para agentes de IA
(\`/api/questions\`, \`/api/plan\`, \`/api/openapi\`). No guarda nada: ni cuentas ni datos.

## Publicarlo

1. Sube esta carpeta a un repositorio nuevo de GitHub (o usa \`vercel deploy\` desde aquí).
2. En Vercel: *Add New → Project →* elige el repositorio *→ Framework Preset: Other → Deploy*. El comando de build y la
   carpeta de salida vienen de \`vercel.json\` (\`node tools/build-site.mjs --brand ${id}\`, salida \`site\`). No hay \`npm install\`.
3. Opcional: variable de entorno \`SITE_URL\` = \`${site}\`.
4. Dominio: *Settings → Domains →* agrega \`${host}\` y crea en tu proveedor de DNS **solo** el registro CNAME que Vercel muestra.
5. Prueba: \`https://${host}/\` y \`https://${host}/api/questions?lang=${B.lang_default}\`.

## Agentes de IA

\`agent/packs/${id}/AGENTS.md\` tiene las instrucciones para cualquier agente con acceso a la API; \`check.sh\` comprueba que esté viva.

\`LICENSE\` (MIT) se queda con los archivos. Es información general de acondicionamiento físico, no consejo médico.
`;
  return `# ${n}: plan builder with API (Vercel project)

This folder is a project ready for Vercel: the ${n} site and its API for AI agents
(\`/api/questions\`, \`/api/plan\`, \`/api/openapi\`). It keeps nothing: no accounts, no data.

## Publish it

1. Put this folder in a new GitHub repository (or run \`vercel deploy\` from here).
2. In Vercel: *Add New → Project →* pick the repository *→ Framework Preset: Other → Deploy*. The build command and output
   folder come from \`vercel.json\` (\`node tools/build-site.mjs --brand ${id}\`, output \`site\`). There is no \`npm install\`.
3. Optional: environment variable \`SITE_URL\` = \`${site}\`.
4. Domain: *Settings → Domains →* add \`${host}\` and create at your DNS provider **only** the CNAME record Vercel shows.
5. Test: \`https://${host}/\` and \`https://${host}/api/questions?lang=${B.lang_default}\`.

## AI agents

\`agent/packs/${id}/AGENTS.md\` has the instructions for any agent with access to the API; \`check.sh\` checks that it is alive.

Keep \`LICENSE\` (MIT) with the files. It is general fitness information, not medical advice.
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const o = {};
    const a = process.argv.slice(2);
    for (let i = 0; i < a.length; i++) {
      const k = a[i].replace(/^--/, '');
      if (['with-api', 'zip', 'force'].includes(k)) o[k] = true; else o[k] = a[++i];
    }
    const r = await exportBrand(o);
    console.log(`exported '${r.id}' (${o['with-api'] ? 'site + API, Vercel project' : 'static site'}): ${r.out} (${r.files} files)`);
    console.log(`  site address: ${r.site}`);
    if (r.zip) console.log(`  zip: ${r.zip} (${(fs.statSync(r.zip).size / 1048576).toFixed(1)} MB)`);
    for (const w of r.warnings) console.log('  note: ' + w);
  } catch (e) {
    console.error('export-brand: ' + (e instanceof InputError ? e.message : (e.stack || e.message)));
    process.exit(1);
  }
}
