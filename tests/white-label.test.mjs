// tests/white-label.test.mjs - white-label brands (WHITE_LABEL.md): tools/new-brand.mjs (from flags and from a website), the
// generated stylesheet's contrast, the leak check, the previews build (tools/build-site.mjs --all-brands / BRAND=previews) and the
// hand-off export (tools/export-brand.mjs, static / --with-api / --zip). Every trial brand is written to a temp folder
// (--brands-dir): the repository never holds a test brand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT } from './helpers/models.mjs';
import { STRINGS } from '../app/i18n.js';
import { BRAND as BC } from '../app/brands/blazecamp.js';
import { BRAND as SH } from '../app/brands/sonhabitos.js';
import { normHex, contrast, themeVars, contrastProblems, PAIRS } from '../tools/white-label/colors.mjs';
import { sniff, dimensions, sanitizeSvg, decodePng, encodePng, squareIcon } from '../tools/white-label/images.mjs';
import { extractFromHtml, fromWebsite } from '../tools/white-label/website.mjs';
import { leakChecker, readBrands, scanFolder } from '../tools/white-label/leaks.mjs';
import { readZip } from '../tools/white-label/zip.mjs';
import { RESERVED, MARK } from '../tools/new-brand.mjs';
import { STATIC_TOP, API_TOP } from '../tools/export-brand.mjs';

const FIX = path.join(ROOT, 'tests/fixtures/white-label');
const NAMES = /blaze|\blalo\b|\bgerardo\b/i;
const brandsBefore = fs.readdirSync(path.join(ROOT, 'app/brands')).sort();
const packsBefore = fs.readdirSync(path.join(ROOT, 'agent/packs')).sort();
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'white-label-test-'));
const BRANDS = path.join(TMP, 'brands'), PACKS = path.join(TMP, 'packs');
const node = (args, opts = {}) => execFileSync(process.execPath, args, { stdio: 'pipe', encoding: 'utf8', ...opts });
const newBrand = (args) => node([path.join(ROOT, 'tools/new-brand.mjs'), '--brands-dir', BRANDS, '--packs-dir', PACKS, ...args]);
const fails = (args, re) => {
  let err = null;
  try { newBrand(args); } catch (e) { err = String(e.stderr); }
  assert.ok(err, 'should fail: ' + args.join(' '));
  assert.match(err, re);
};
const load = async (id) => (await import(pathToFileURL(path.join(BRANDS, id + '.js')).href + '?t=' + Date.now())).BRAND;
const walk = (d, b = '') => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name), b ? b + '/' + e.name : e.name) : [b ? b + '/' + e.name : e.name]));
/** the variables of a generated stylesheet: {light, dark} */
const cssVars = (css) => {
  const grab = (s) => Object.fromEntries([...s.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
  const light = grab(/:root \{([\s\S]*?)\n\}/.exec(css)[1]);
  const dark = grab(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/.exec(css)[1]);
  return { light, dark };
};

process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));

test('colours: hex parsing, WCAG contrast, every text pair 4.5:1 in light and dark, even for awkward colours', () => {
  assert.equal(normHex('#ABC'), '#aabbcc'); assert.equal(normHex('d4005a'), '#d4005a'); assert.equal(normHex('red'), null); assert.equal(normHex('#12345'), null);
  assert.equal(Math.round(contrast('#000000', '#ffffff') * 10) / 10, 21);
  for (const c of [['#d4005a', '#0a8c94'], ['#ffd400', '#00ff00'], ['#ffffff', '#000000'], ['#e8480c', '#e8480c', '#131316'], ['#3366ff', '#ff9900'], ['#000000', '#777777'], ['#ff69b4', '#ffff99'], ['#111111', '#222222'], ['#7fffd4', '#f0e68c']]) {
    const v = themeVars({ primary: c[0], accent: c[1], ink: c[2] });
    assert.deepEqual(contrastProblems(v), [], c.join(','));
  }
  // a colour that already reads well is kept as given
  const sh = themeVars({ primary: '#d4005a', accent: '#0a8c94' });
  assert.equal(sh.light.cta, '#d4005a'); assert.equal(sh.light.accent, '#0a8c94');
});

test('images: type and size from the header, PNG round trip and square icons, SVG sanitized', () => {
  const png = fs.readFileSync(path.join(FIX, 'logo.png')), svg = fs.readFileSync(path.join(FIX, 'logo-es.svg'));
  assert.equal(sniff(png), 'png'); assert.deepEqual(dimensions(png), { w: 240, h: 80 });
  assert.equal(sniff(svg), 'svg'); assert.deepEqual(dimensions(svg), { w: 200, h: 60 });
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x30, 0x00, 0x40, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(sniff(jpeg), 'jpeg'); assert.deepEqual(dimensions(jpeg), { w: 64, h: 48 });
  assert.equal(sniff(Buffer.from('GIF89a......')), 'gif'); assert.equal(sniff(Buffer.from('hello')), null);
  const img = decodePng(png);
  assert.equal(img.w, 240); assert.equal(img.data[(40 * 240 + 40) * 4], 0xc8, 'the red block');
  for (const f of ['logo.png', 'logo-flat.png', 'icon-180.png', 'favicon-64.png']) {
    const im = decodePng(fs.readFileSync(path.join(ROOT, 'app/brands/sonhabitos', f)));
    assert.ok(im && im.w > 0, f);
    const sq = decodePng(encodePng(squareIcon(im, 64, { bg: [255, 255, 255] })));
    assert.deepEqual([sq.w, sq.h], [64, 64]);
  }
  const clean = sanitizeSvg(svg.toString());
  assert.doesNotMatch(clean, /<script|onload|alert/); assert.match(clean, /<rect/);
});

test('website extractor: name, language, logo, icon and colours from local fixtures (no network)', async () => {
  const en = fs.readFileSync(path.join(FIX, 'site-en.html'), 'utf8'), css = fs.readFileSync(path.join(FIX, 'style.css'), 'utf8');
  const f = extractFromHtml(en, 'https://irontemple.example.com/', [css]);
  assert.deepEqual(f.name, { value: 'Iron Temple Gym', from: 'og:site_name' });
  assert.equal(f.lang.value, 'en');
  assert.equal(f.images.logo[0].url, 'https://irontemple.example.com/logo.png');
  assert.match(f.images.logo[0].from, /<img> with "logo"/);
  assert.equal(f.images.icon[0].url, 'https://irontemple.example.com/icon.png');
  assert.equal(f.images.logo.at(-1).from, 'og:image', 'a photo is the last choice');
  assert.equal(f.colors.primary.value, '#c8102e'); assert.equal(f.colors.accent.value, '#0e7c86'); assert.equal(f.colors.ink.value, '#1b1f24');

  const es = fs.readFileSync(path.join(FIX, 'site-es.html'), 'utf8');
  const g = extractFromHtml(es, 'https://fuerza.example.mx/');
  assert.equal(g.name.value, 'Fuerza Latina'); assert.match(g.name.from, /<title>/);
  assert.equal(g.lang.value, 'es');
  assert.equal(g.colors.primary.value, '#2a9d3f'); assert.match(g.colors.primary.from, /most used/);
  assert.equal(g.colors.accent.value, '#1e2a5a');
  assert.equal(g.images.logo[0].url, 'https://fuerza.example.mx/logo-es.svg');

  // through fromWebsite with a fake network: the logo bytes are fetched and typed
  const map = { 'https://irontemple.example.com/': en, 'https://irontemple.example.com/style.css': css };
  const io = {
    fetchText: async (u) => { if (!(u in map)) throw new Error('404'); return map[u]; },
    fetchBytes: async (u) => { const p = path.join(FIX, new URL(u).pathname); if (!fs.existsSync(p)) throw new Error('HTTP 404'); return fs.readFileSync(p); }
  };
  const w = await fromWebsite('https://irontemple.example.com/', io);
  assert.equal(w.logo.type, 'png'); assert.equal(w.icon.url, 'https://irontemple.example.com/icon.png');
  assert.equal(w.colors.primary.value, '#c8102e');
});

test('new-brand: from flags into a temp folder - brand file shape, assets, CSS contrast, pack, trial build, no leaks', async () => {
  const build = path.join(TMP, 'build-demo');
  const out = newBrand(['--id', 'demo-gym', '--name', 'Demo Gym', '--lang', 'es', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e,#0e7c86', '--build-out', build, '--site', 'https://plan.demogym.example.com']);
  assert.match(out, /Trial build OK/); assert.match(out, /https:\/\/white-label-previews\.vercel\.app\/demo-gym\//);
  const B = await load('demo-gym');
  // the same shape as every brand (tests/app-brand.test.mjs), plus the white-label flag (the previews site builds only those)
  assert.deepEqual(Object.keys(B).sort(), [...Object.keys(BC), 'white_label'].sort());
  assert.equal(B.white_label, true); assert.equal(BC.white_label, undefined); assert.equal(SH.white_label, undefined);
  for (const k of ['id', 'name', 'short', 'storage_key', 'image_prefix']) assert.ok(typeof B[k] === 'string' && B[k], k);
  assert.equal(B.lang_default, 'es'); assert.equal(B.follow_browser_lang, false); assert.equal(B.site_url, 'https://plan.demogym.example.com/');
  for (const l of ['en', 'es']) {
    assert.ok(B.meta[l].title && B.meta[l].description);
    assert.deepEqual(Object.keys(B.words[l]).sort(), Object.keys(B.words.en).sort());
    for (const k of Object.keys(B.words[l])) assert.ok(k in STRINGS.en || /^app\.(eyebrow|welcome)$/.test(k), `${l}.${k}`);
    for (const k of ['app.title', 'app.brand', 'app.credit', 'plan.share_title', 'print.generated']) assert.ok(B.words[l][k], k);
  }
  assert.equal(B.words.en['app.credit'], 'Demo Gym plan builder'); assert.equal(B.words.es['app.credit'], 'Creador de planes de Demo Gym');
  assert.equal(B.legal.parties.en, 'Lalo Vera and BFit Studios Corp., doing business as Demo Gym');
  assert.equal(B.legal.parties.es, 'Lalo Vera y BFit Studios Corp., que opera como Demo Gym');
  assert.deepEqual(B.legal.disclaimer, SH.legal.disclaimer);
  for (const a of B.assets) assert.ok(fs.existsSync(path.join(BRANDS, 'demo-gym', a)), a);
  assert.ok(B.assets.includes(B.html.css.split('/').pop()));
  assert.deepEqual(B.assets.sort(), ['brand.css', 'favicon-64.png', 'icon-180.png', 'logo-flat.png', 'logo.png'].sort());
  assert.deepEqual(B.pdf.logo, { src: 'brands/demo-gym/logo-flat.png', w: 240, h: 80 });
  assert.match(B.pdf.file_prefix, /^[A-Za-z0-9-]+$/);
  assert.ok(fs.readFileSync(path.join(BRANDS, 'demo-gym.js'), 'utf8').includes(MARK));
  const size = B.assets.reduce((n, a) => n + fs.statSync(path.join(BRANDS, 'demo-gym', a)).size, 0);
  assert.ok(size < 120 * 1024, `assets ${size} bytes`);
  // the stylesheet: every text pair 4.5:1, light and dark, read back from the file
  const v = cssVars(fs.readFileSync(path.join(BRANDS, 'demo-gym/brand.css'), 'utf8'));
  for (const t of ['light', 'dark']) for (const [fg, bg] of PAIRS) assert.ok(contrast(v[t][fg], v[t][bg]) >= 4.5, `${t} ${fg} on ${bg}`);
  // the brand file names no other brand (the legal parties excepted)
  const check = leakChecker(B, [...await readBrands(path.join(ROOT, 'app/brands')), ...await readBrands(BRANDS)]);
  assert.equal(check(fs.readFileSync(path.join(BRANDS, 'demo-gym.js'), 'utf8')), null);
  // the pack
  for (const f of ['AGENTS.md', 'AGENTS.en.md', 'README.md', 'answers.example.json', 'check.sh', 'questions.en.md', 'preguntas.es.md']) assert.ok(fs.existsSync(path.join(PACKS, 'demo-gym', f)), f);
  const pack = fs.readFileSync(path.join(PACKS, 'demo-gym/AGENTS.md'), 'utf8');
  assert.match(pack, /https:\/\/plan\.demogym\.example\.com\/disclaimer\.es\.html/); assert.match(pack, /DOS mensajes/);
  assert.deepEqual(scanFolder(path.join(PACKS, 'demo-gym'), (t) => check(t.replace(/https:\/\/(raw\.githubusercontent|github)\.com\/Blazecamp\/blaze-camp-model\S*/g, ''))), []);
  // the trial build: Spanish first, its logo and stylesheet, its own disclaimer pages, no other brand anywhere
  const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  assert.match(html, /<html lang="es">/); assert.match(html, /<title>Demo Gym - Tu plan de entrenamiento<\/title>/);
  assert.match(html, /href="brands\/demo-gym\/brand\.css"/); assert.match(html, /src="brands\/demo-gym\/logo\.png" width="132" height="44"/);
  for (const f of ['disclaimer.html', 'disclaimer.es.html', 'brands/demo-gym.js']) assert.ok(fs.existsSync(path.join(build, f)), f);
  for (const f of ['LICENSE', 'DISCLAIMER.md', 'brands/blazecamp.js', 'brands/sonhabitos.js', 'brands/sonhabitos']) assert.ok(!fs.existsSync(path.join(build, f)), 'no ' + f);
  assert.ok(fs.readFileSync(path.join(build, 'disclaimer.html'), 'utf8').includes('Lalo Vera and BFit Studios Corp., a Florida corporation, doing business as Demo Gym'));
  assert.equal(JSON.parse(fs.readFileSync(path.join(build, 'model/rules.json'), 'utf8')).legal.disclaimer_url.es, 'https://plan.demogym.example.com/disclaimer.es.html');
  assert.deepEqual(scanFolder(build, check), []);
  for (const f of walk(build).filter(x => /\.(html|m?js|css|json)$/.test(x))) assert.doesNotMatch(fs.readFileSync(path.join(build, f), 'utf8').split('Lalo Vera and BFit').join('').split('Lalo Vera y BFit').join(''), /Son H[aá]bitos|Nati Vera|Blaze/, f);
});

test('new-brand: --from-website with a local page (Spanish, SVG logo) - finds, guesses, sanitizes; flags override', async () => {
  const out = newBrand(['--from-website', path.join(FIX, 'site-es.html'), '--no-build']);
  assert.match(out, /name: Fuerza Latina +\[found: <title>/); assert.match(out, /primary colour: #2a9d3f +\[guessed: most used colour/);
  assert.match(out, /id: fuerza-latina +\[made from the name\]/); assert.match(out, /scripts or event handlers; they were removed/);
  const B = await load('fuerza-latina');
  assert.equal(B.lang_default, 'es'); assert.equal(B.pdf.logo, null, 'an SVG logo cannot go on the PDF cover');
  assert.match(B.html.icons, /favicon\.svg/);
  assert.doesNotMatch(fs.readFileSync(path.join(BRANDS, 'fuerza-latina/logo.svg'), 'utf8'), /<script|onload/);
  // explicit flags win over what the website says
  const out2 = newBrand(['--from-website', path.join(FIX, 'site-en.html'), '--id', 'iron', '--name', 'Iron Temple', '--colors', '#123456,#abcdef', '--lang', 'es', '--no-build']);
  assert.match(out2, /name: Iron Temple \(your --name; the website said "Iron Temple Gym"\)/);
  const I = await load('iron');
  assert.equal(I.name, 'Iron Temple'); assert.equal(I.lang_default, 'es'); assert.match(fs.readFileSync(path.join(BRANDS, 'iron.js'), 'utf8'), /"colors":"#123456,#abcdef"/);
  assert.equal(I.pdf.logo.w, 240, 'the website\'s PNG logo');
});

test('new-brand: refuses bad input and never overwrites a brand it did not make', () => {
  const ok = ['--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e,#0e7c86', '--no-build'];
  fails(['--id', 'Bad Slug', ...ok], /--id must be lower-case/);
  for (const r of ['blazecamp', 'sonhabitos', 'previews', 'api']) { assert.ok(RESERVED.includes(r)); fails(['--id', r, ...ok], /is taken/); }
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', 'red,#0e7c86', '--no-build'], /not a hex colour/);
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'fr', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e', '--no-build'], /--lang must be en or es/);
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'nope.png'), '--colors', '#c8102e', '--no-build'], /file not found/);
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'style.css'), '--colors', '#c8102e', '--no-build'], /must be a PNG, SVG or JPG/);
  fails(['--id', 'tg', '--name', 'Blaze Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e', '--no-build'], /names another brand/);
  fails(['--id', 'tg', ...ok, '--site', 'http://insecure.example.com'], /https:\/\//);
  newBrand(['--id', 'tg', ...ok]);
  fails(['--id', 'tg', ...ok], /already exists.*--force/);
  newBrand(['--id', 'tg', ...ok, '--force']);
  fs.writeFileSync(path.join(BRANDS, 'handmade.js'), 'export const BRAND = {};\n');
  fails(['--id', 'handmade', ...ok, '--force'], /not made by this tool/);
  fs.rmSync(path.join(BRANDS, 'handmade.js'));
});

test('previews: --all-brands builds every white-label brand into <id>/ (base href, noindex); the root lists no brand', () => {
  const out = path.join(TMP, 'previews');
  node([path.join(ROOT, 'tools/build-site.mjs'), '--all-brands', '--brands-dir', BRANDS, '--out', out]);
  const ids = fs.readdirSync(BRANDS).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));
  assert.ok(ids.includes('demo-gym'));
  for (const id of ids) {
    const html = fs.readFileSync(path.join(out, id, 'index.html'), 'utf8');
    assert.match(html, new RegExp(`<base href="/${id}/">`)); assert.match(html, /<meta name="robots" content="noindex/);
    assert.match(fs.readFileSync(path.join(out, id, 'disclaimer.html'), 'utf8'), /<meta name="robots" content="noindex/);
    assert.equal(JSON.parse(fs.readFileSync(path.join(out, id, 'model/rules.json'), 'utf8')).legal.disclaimer_url.en, `https://localhost/${id}/disclaimer.html`);
  }
  const root = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  assert.match(root, /noindex/); assert.match(root, /Nothing here/);
  for (const id of ids) assert.ok(!root.includes(id), 'the root page lists no brand');
  assert.match(fs.readFileSync(path.join(out, 'robots.txt'), 'utf8'), /Disallow: \//);
  assert.deepEqual(fs.readdirSync(out).sort(), [...ids, 'index.html', 'robots.txt'].sort());
  // env BRAND=previews (the Vercel project) on the repository's own brands: only white-label brands get a preview (none of the
  // brands with their own sites); with none yet, the build still succeeds with just the root page
  const repo = path.join(TMP, 'previews-repo');
  node([path.join(ROOT, 'tools/build-site.mjs'), '--out', repo], { env: { ...process.env, BRAND: 'previews', BC_BRANDS_DIR: '' } });
  const repoWl = brandsBefore.filter(f => f.endsWith('.js') && fs.readFileSync(path.join(ROOT, 'app/brands', f), 'utf8').includes(MARK)).map(f => f.slice(0, -3));
  assert.deepEqual(fs.readdirSync(repo).sort(), [...repoWl, 'index.html', 'robots.txt'].sort());
  assert.ok(!fs.existsSync(path.join(repo, 'blazecamp')) && !fs.existsSync(path.join(repo, 'sonhabitos')));
  // every asset the app loads is relative (it works under /<id>/)
  for (const f of ['index.html', 'main.js', 'model-loader.js', 'brand.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(out, 'demo-gym', f), 'utf8').replace(/<base href="[^"]*">/, ''), /(src|href)="\/(?!\/)|fetch\(['"`]\/|import\(['"`]\//, f);
  }
});

test('export: static (one brand, README EN + ES, LICENSE, disclaimers), --with-api (a Vercel project that builds and answers), --zip', () => {
  const exp = path.join(TMP, 'export-static');
  node([path.join(ROOT, 'tools/export-brand.mjs'), '--brand', 'demo-gym', '--brands-dir', BRANDS, '--out', exp, '--zip']);
  assert.deepEqual(fs.readdirSync(exp).sort(), [...STATIC_TOP].sort());
  const files = walk(exp);
  assert.ok(files.includes('website/index.html') && files.includes('website/disclaimer.es.html') && files.includes('website/engine/generate.mjs'));
  assert.ok(files.every(f => !/brands\/(?!demo-gym)/.test(f)), 'only this brand');
  assert.ok(files.every(f => !/(coach_answers|raw\/|dumps|tests\/|design\/|reviews\/|samples\/|synthesis\/)/.test(f)));
  assert.match(fs.readFileSync(path.join(exp, 'LICENSE'), 'utf8'), /MIT License/);
  assert.match(fs.readFileSync(path.join(exp, 'README.md'), 'utf8'), /upload/i); assert.match(fs.readFileSync(path.join(exp, 'LEEME.md'), 'utf8'), /subdominio/);
  assert.ok(fs.readFileSync(path.join(exp, 'DISCLAIMER.md'), 'utf8').includes('doing business as Demo Gym'));
  for (const f of files.filter(x => x !== 'LICENSE' && /\.(html|m?js|css|json|md)$/.test(x))) {
    assert.doesNotMatch(fs.readFileSync(path.join(exp, f), 'utf8').split('Lalo Vera and BFit').join('').split('Lalo Vera y BFit').join(''), /Blaze|Gerardo|\bLalo\b|Son H[aá]bitos|Nati Vera/, f);
  }
  const z = readZip(fs.readFileSync(exp + '.zip'));
  assert.equal(z.length, files.length);
  assert.ok(z.some(e => e.name === 'export-static/website/index.html'));
  assert.equal(z.find(e => e.name === 'export-static/LICENSE').data.toString(), fs.readFileSync(path.join(ROOT, 'LICENSE'), 'utf8'));
  if (process.platform !== 'win32') { try { assert.match(execFileSync('unzip', ['-tq', exp + '.zip'], { encoding: 'utf8' }), /No errors/); } catch (e) { if (e.code !== 'ENOENT') throw e; } }

  const api = path.join(TMP, 'export-api');
  node([path.join(ROOT, 'tools/export-brand.mjs'), '--brand', 'demo-gym', '--brands-dir', BRANDS, '--out', api, '--with-api', '--site', 'https://plan.demogym.example.com']);
  assert.deepEqual(fs.readdirSync(api).sort(), [...API_TOP].sort());
  const vj = JSON.parse(fs.readFileSync(path.join(api, 'vercel.json'), 'utf8'));
  assert.equal(vj.buildCommand, 'node tools/build-site.mjs --brand demo-gym'); assert.equal(vj.outputDirectory, 'site');
  assert.deepEqual(fs.readdirSync(path.join(api, 'app/brands')).sort(), ['demo-gym', 'demo-gym.js']);
  assert.deepEqual(fs.readdirSync(path.join(api, 'agent/packs')), ['demo-gym']);
  assert.match(fs.readFileSync(path.join(api, 'agent/packs/demo-gym/AGENTS.md'), 'utf8'), /https:\/\/plan\.demogym\.example\.com\/disclaimer\.es\.html/);
  assert.match(fs.readFileSync(path.join(api, 'app/brands/demo-gym.js'), 'utf8'), /"site_url": "https:\/\/plan\.demogym\.example\.com\/"/);
  // the exported project builds by itself and its API answers for its brand
  const site = path.join(TMP, 'export-api-site');
  const env = { ...process.env }; delete env.BRAND; delete env.BC_BRANDS_DIR;
  node([path.join(api, 'tools/build-site.mjs'), '--out', site], { env, cwd: api });
  assert.match(fs.readFileSync(path.join(site, 'index.html'), 'utf8'), /<title>Demo Gym - Tu plan de entrenamiento<\/title>/);
  const probe = `import('${pathToFileURL(path.join(api, 'agent/http.mjs')).href}').then(async H => { const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(b) { console.log(this.statusCode, 'brand=' + b.includes('Demo Gym'), 'other=' + /Blaze|Son H/.test(b)); } }; await H.handle({ method: 'GET', url: '/api/questions?lang=es', headers: { host: 'plan.demogym.example.com' } }, res, 'questions'); })`;
  const r = node(['--input-type=module', '-e', probe], { env, cwd: api });
  assert.equal(r.trim(), '200 brand=true other=false');
});

test('the repository holds no trial brand or pack after these tests', () => {
  assert.deepEqual(fs.readdirSync(path.join(ROOT, 'app/brands')).sort(), brandsBefore);
  assert.deepEqual(fs.readdirSync(path.join(ROOT, 'agent/packs')).sort(), packsBefore);
  for (const f of brandsBefore.filter(x => x.endsWith('.js'))) assert.doesNotMatch(f, /demo|fuerza|iron|^tg\./);
});

test('the white-label docs: WHITE_LABEL.md and the AGENTS.md "When the coach asks" table point to real files and commands', () => {
  const wl = fs.readFileSync(path.join(ROOT, 'WHITE_LABEL.md'), 'utf8');
  for (const s of ['node tools/new-brand.mjs', '--from-website', 'node tools/export-brand.mjs', '--with-api', '--zip', 'BRAND', 'previews', 'white-label-previews', 'CNAME', 'node agent/packs.mjs', 'PROPOSED', 'plan.sonhabitos.com']) assert.ok(wl.includes(s), 'WHITE_LABEL.md: ' + s);
  assert.match(wl, /## .*custom domain/i);
  for (const m of wl.matchAll(/\]\(([^)#\s]+)\)/g)) if (!/^https?:/.test(m[1])) assert.ok(fs.existsSync(path.join(ROOT, m[1])), 'WHITE_LABEL.md links ' + m[1]);
  const ag = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');
  const top = ag.slice(0, ag.indexOf('## 1.'));
  assert.match(top, /When the coach asks/);
  for (const s of ['WHITE_LABEL.md', 'agent/packs/', 'agent/README.md', 'tools/new-brand.mjs', 'site_url', 'node agent/packs.mjs']) assert.ok(top.includes(s), 'AGENTS.md table: ' + s);
  for (const m of top.matchAll(/\]\(([^)#\s]+)(#[^)]*)?\)/g)) if (!/^https?:/.test(m[1])) assert.ok(fs.existsSync(path.join(ROOT, m[1])), 'AGENTS.md links ' + m[1]);
  assert.match(ag, /White-label brands/); assert.match(fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8'), /WHITE_LABEL\.md/);
  for (const f of ['tools/new-brand.mjs', 'tools/export-brand.mjs', 'tools/build-site.mjs']) assert.ok(fs.existsSync(path.join(ROOT, f)), f);
});
