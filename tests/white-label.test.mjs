// tests/white-label.test.mjs - white-label brands (WHITE_LABEL.md): tools/new-brand.mjs (from flags and from a website), the
// generated stylesheet's contrast, the leak check, the previews build (tools/build-site.mjs --all-brands / BRAND=previews) and the
// hand-off export (tools/export-brand.mjs, static / --with-api / --zip), the gym's legal name and its addendum (CH7-11), logos made
// into PNGs by a browser (CH7-12; skipped without one) and --publish --dry-run (CH7-13). Every trial brand is written to a temp
// folder (--brands-dir): the repository never holds a test brand.
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
import { sniff, dimensions, sanitizeSvg, decodePng, encodePng, squareIcon, trimImage } from '../tools/white-label/images.mjs';
import { extractFromHtml, fromWebsite, legalNameCandidates, pickLegalName, legalPageUrls } from '../tools/white-label/website.mjs';
import { findBrowser, logoToPng, wordmarkPng, NO_BROWSER } from '../tools/white-label/raster.mjs';
import { whiteLabelParties, legalSub, legalPartyTexts, brandModelRaw, addendumMd, withAddendum } from '../tools/brand-legal.mjs';
import { brandPaths, repoSlug } from '../tools/white-label/publish.mjs';
import { leakChecker, readBrands, scanFolder } from '../tools/white-label/leaks.mjs';
import { readZip } from '../tools/white-label/zip.mjs';
import { RESERVED, MARK } from '../tools/new-brand.mjs';
import { STATIC_TOP, API_TOP } from '../tools/export-brand.mjs';

const FIX = path.join(ROOT, 'tests/fixtures/white-label');
// a browser for the PNG tests (CH7-12): env BC_PLAYWRIGHT / BC_CHROMIUM, else the ones of the build session, else none (skipped)
const firstThere = (...ps) => ps.find(p => p && fs.existsSync(p));
const PW = firstThere(process.env.BC_PLAYWRIGHT, '/tmp/claude-0/-home-user-blaze-camp-model/9ae233b6-7471-59d4-8c59-ab6e7feadfc3/scratchpad/pw/node_modules/playwright/index.mjs');
const CHROME = firstThere(process.env.BC_CHROMIUM, '/opt/pw-browsers/chromium');
if (PW) process.env.BC_PLAYWRIGHT = PW;
if (CHROME) process.env.BC_CHROMIUM = CHROME;
const BROWSER = process.env.BC_NO_BROWSER === '1' ? null : await findBrowser();
const NOB = BROWSER ? false : 'no browser (Playwright or Chrome / Chromium) here';
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
/** a text without the brand's legal texts (the only places the owner's name may appear) */
const noParties = (B, s) => legalPartyTexts(B.legal).reduce((acc, p) => acc.split(p).join(''), String(s));
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
  // trimming: the transparent border of the fixture logo, and a uniform background of an opaque image
  const t = trimImage(img);
  assert.deepEqual([t.w, t.h], [224, 64]);
  const op = { w: 10, h: 10, data: new Uint8Array(400).fill(255) };
  for (const i of [44, 45, 54, 55]) { op.data[i * 4] = 0; op.data[i * 4 + 1] = 0; op.data[i * 4 + 2] = 0; }
  assert.deepEqual([trimImage(op).w, trimImage(op).h], [2, 2]);
  // the header sizes of the other image types a website may give
  assert.deepEqual(dimensions(Buffer.from('GIF89a\x40\x00\x20\x00', 'latin1'), 'gif'), { w: 64, h: 32 });
  const ico = Buffer.alloc(38); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(2, 4); ico[6] = 16; ico[7] = 16; ico[22] = 0; ico[23] = 0;
  assert.equal(sniff(ico), 'ico'); assert.deepEqual(dimensions(ico, 'ico'), { w: 256, h: 256 });
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

test('website extractor: the gym\'s legal name from footers and the terms page (CH7-11)', async () => {
  const cands = (html, brand = '') => pickLegalName(legalNameCandidates(html, 'home page', brand));
  assert.equal(cands('<footer><p>&copy; 2026 Iron Temple Fitness LLC. All rights reserved.</p><p>Site by Wix.com Ltd.</p></footer>', 'Iron Temple Gym').value, 'Iron Temple Fitness LLC');
  assert.match(cands('<footer>© 2026 Iron Temple Fitness LLC.</footer>').from, /copyright line/);
  assert.equal(cands('<p>Entre usted y Fuerza Latina Deportes, S.A. de C.V. ("Fuerza Latina")</p>').value, 'Fuerza Latina Deportes, S.A. de C.V.');
  assert.equal(cands('<div>Todos los derechos reservados © 2025 Box Norte S.A.S.</div>').value, 'Box Norte S.A.S.');
  assert.equal(cands('<div>© 2026 Smith &amp; Sons Strength, Inc.</div>').value, 'Smith & Sons Strength, Inc.');
  // platforms and payment companies are never the gym; a copyright line without a company ending is only a hint
  assert.equal(cands('<p>Powered by Squarespace, Inc. Payments by Stripe, Inc. Google LLC.</p>'), null);
  const hint = legalNameCandidates('<footer>Copyright © 2019-2026 Iron Temple Gym | Powered by Squarespace</footer>', 'home page');
  assert.equal(pickLegalName(hint), null); assert.deepEqual(hint.map(h => [h.value, h.entity]), [['Iron Temple Gym', false]]);
  // the terms and privacy pages linked from the home page (same site only, at most 3)
  assert.deepEqual(legalPageUrls('<a href="/terms-of-service">Terms</a><a href="https://other.com/privacy">p</a><a href="/aviso-de-privacidad">Aviso</a><a href="/about">About</a>', 'https://gym.example.com/'),
    ['https://gym.example.com/terms-of-service', 'https://gym.example.com/aviso-de-privacidad']);
  // through fromWebsite: the home page says only "© Iron Temple Gym"; its terms page names the company
  const en = fs.readFileSync(path.join(FIX, 'site-en.html'), 'utf8');
  const pages = { 'https://irontemple.example.com/': en, 'https://irontemple.example.com/terms.html': fs.readFileSync(path.join(FIX, 'terms.html'), 'utf8') };
  const io = { fetchText: async (u) => { if (!(u in pages)) throw new Error('HTTP 404'); return pages[u]; }, fetchBytes: async (u) => fs.readFileSync(path.join(FIX, new URL(u).pathname)) };
  const w = await fromWebsite('https://irontemple.example.com/', io);
  assert.equal(w.legal_name.value, 'Iron Temple Fitness, LLC');
  assert.match(w.legal_name.from, /^https:\/\/irontemple\.example\.com\/terms\.html: "These terms are an agreement/);
  assert.equal(w.copyright_holder, null);
});

test('legal: the parties of a white-label gym, with and without a separate legal name; the addendum (CH7-11)', () => {
  const two = { brand: 'Iron Temple Gym', legal_name: 'Iron Temple Fitness, LLC', state: 'FL', legal_name_confirmed: true };
  assert.deepEqual(whiteLabelParties(two), {
    en: 'Lalo Vera, BFit Studios Corp. and Iron Temple Fitness, LLC (doing business as Iron Temple Gym)',
    es: 'Lalo Vera, BFit Studios Corp. y Iron Temple Fitness, LLC (que opera como Iron Temple Gym)'
  });
  const one = { brand: 'Iron Temple Gym', legal_name: 'Iron Temple Gym', state: null, legal_name_confirmed: false };
  assert.deepEqual(whiteLabelParties(one), { en: 'Lalo Vera, BFit Studios Corp. and Iron Temple Gym', es: 'Lalo Vera, BFit Studios Corp. y Iron Temple Gym' });
  const L = { business: { en: 'Iron Temple Gym', es: 'Iron Temple Gym' }, parties: whiteLabelParties(two), disclaimer: SH.legal.disclaimer, gym: two };
  const EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'model/i18n/en.json'), 'utf8')), ES = JSON.parse(fs.readFileSync(path.join(ROOT, 'model/i18n/es.json'), 'utf8'));
  assert.ok(legalSub(EN['ui.plan.release_line'], 'en', L).startsWith('You accepted the terms and released Lalo Vera, BFit Studios Corp. and Iron Temple Fitness, LLC (doing business as Iron Temple Gym) from all liability before'));
  assert.ok(legalSub(ES['ui.plan.own_risk'], 'es', L).includes('liberas a Lalo Vera, BFit Studios Corp. y Iron Temple Fitness, LLC (que opera como Iron Temple Gym) de toda responsabilidad.'));
  const L1 = { ...L, parties: whiteLabelParties(one), gym: one };
  assert.ok(legalSub(EN['ui.plan.release_line'], 'en', L1).includes('released Lalo Vera, BFit Studios Corp. and Iron Temple Gym from all liability'));
  // the disclaimer: the owner line names the gym's company and its state; the addendum is its own section, before section 1
  const md = withAddendum(legalSub(fs.readFileSync(path.join(ROOT, 'DISCLAIMER.md'), 'utf8'), 'en', L), 'en', L);
  assert.ok(md.includes('**Owner:** Lalo Vera and BFit Studios Corp., a Florida corporation, and Iron Temple Fitness, LLC, registered in FL (doing business as Iron Temple Gym) (together, "Iron Temple Gym").'));
  assert.ok(md.indexOf('## How this tool is provided') < md.indexOf('## 1. Not medical advice') && md.indexOf('## How this tool is provided') > 0);
  assert.ok(md.includes('## 5. Coaches, trainers, gyms and other professionals'), 'the base content stays');
  const add = addendumMd(L, 'en'), adde = addendumMd(L, 'es');
  assert.match(add, /Iron Temple Gym \(Iron Temple Fitness, LLC, FL\) provides this plan builder to its members and clients under license from BFit Studios Corp\./);
  assert.match(add, /responsible for its own health screening/); assert.match(add, /every member or client sign the Iron Temple Gym liability waiver before training/);
  assert.match(add, /whether the person builds the plan themselves or a coach at Iron Temple Gym builds it for them/);
  assert.match(add, /do not replace the Iron Temple Gym liability waiver.*do not move any responsibility of Iron Temple Gym to Lalo Vera or BFit Studios Corp\./s);
  assert.match(adde, /## Cómo se ofrece esta herramienta/); assert.match(adde, /firme la exención de responsabilidad de Iron Temple Gym antes de entrenar/);
  assert.match(adde, /no reemplazan la exención de responsabilidad de Iron Temple Gym/);
  assert.match(add + adde, /\[LEGAL REVIEW\][\s\S]*\[REVISIÓN LEGAL\]/);
  // a brand without a gym (Son Hábitos) is unchanged
  assert.equal(withAddendum('# x\n\n## 1. a\n', 'en', SH.legal), '# x\n\n## 1. a\n');
  // the release text and the short release line: the parties, plus one short sentence on the gym's own waiver
  const raw = { rules: JSON.parse(fs.readFileSync(path.join(ROOT, 'model/rules.json'), 'utf8')), i18n: { en: EN, es: ES, es_review: {} } };
  const b = brandModelRaw(raw, { id: 'iron', legal: L, model_words: {} }, { siteUrl: 'https://plan.iron.example.com/' });
  assert.match(b.i18n.en['release.client'], /you release Lalo Vera, BFit Studios Corp\. and Iron Temple Fitness, LLC \(doing business as Iron Temple Gym\) from liability/);
  assert.match(b.i18n.en['release.client'], /Iron Temple Gym provides this tool under license from BFit Studios Corp\. Iron Temple Gym is responsible for its own health screening and liability waiver, and these terms do not replace it\. \[Read the full/);
  assert.match(b.i18n.es['release.coach'], /Iron Temple Gym es responsable de su propia evaluación de salud y de su exención de responsabilidad, y estos términos no la reemplazan\. \[Leer los/);
  for (const k of ['ui.plan.release_line', 'ui.plan.release_line_coach', 'ui.plan.release_line_minor']) {
    assert.ok(b.i18n.en[k].endsWith(' The Iron Temple Gym liability waiver also applies.'), k);
    assert.ok(b.i18n.es[k].endsWith(' También aplica la exención de responsabilidad de Iron Temple Gym.'), k);
  }
  assert.ok(b.i18n.en['release.client'].includes('[LEGAL REVIEW'), 'the marker stays');
  // the leak check lets the owner's name through only in these texts, as written or HTML-escaped (a name with & or an apostrophe)
  const amp = { brand: "Joe's Iron & Steel", legal_name: "Joe's Iron & Steel LLC", state: null, legal_name_confirmed: true };
  const LA = { business: { en: amp.brand, es: amp.brand }, parties: whiteLabelParties(amp), disclaimer: SH.legal.disclaimer, gym: amp };
  const check = leakChecker({ id: 'joe', name: amp.brand, short: 'JOE', words: {}, legal: LA }, []);
  assert.equal(check('<p>released Lalo Vera, BFit Studios Corp. and Joe&#39;s Iron &amp; Steel LLC (doing business as Joe&#39;s Iron &amp; Steel) from</p>'), null);
  assert.equal(check('<li>... to Lalo Vera or BFit Studios Corp.</li>'), null);
  assert.ok(check('<p>Coach Lalo says hi</p>'));
});

test('new-brand: from flags into a temp folder - brand file shape, assets, CSS contrast, pack, trial build, no leaks', async () => {
  const build = path.join(TMP, 'build-demo');
  const out = newBrand(['--id', 'demo-gym', '--name', 'Demo Gym', '--lang', 'es', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e,#0e7c86', '--build-out', build, '--site', 'https://plan.demogym.example.com',
    '--legal-name', 'Demo Gym Holdings LLC', '--legal-state', 'FL']);
  assert.match(out, /Trial build OK/); assert.match(out, /https:\/\/white-label-previews\.vercel\.app\/demo-gym\//);
  assert.match(out, /legal name: Demo Gym Holdings LLC, FL +\[your --legal-name\]/);
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
  assert.equal(B.legal.parties.en, 'Lalo Vera, BFit Studios Corp. and Demo Gym Holdings LLC (doing business as Demo Gym)');
  assert.equal(B.legal.parties.es, 'Lalo Vera, BFit Studios Corp. y Demo Gym Holdings LLC (que opera como Demo Gym)');
  assert.deepEqual(B.legal.gym, { brand: 'Demo Gym', legal_name: 'Demo Gym Holdings LLC', state: 'FL', legal_name_confirmed: true, legal_name_source: 'your --legal-name' });
  assert.deepEqual(B.legal.disclaimer, SH.legal.disclaimer);
  for (const a of B.assets) assert.ok(fs.existsSync(path.join(BRANDS, 'demo-gym', a)), a);
  assert.ok(B.assets.includes(B.html.css.split('/').pop()));
  assert.deepEqual(B.assets.sort(), ['brand.css', 'favicon-64.png', 'icon-180.png', 'logo-flat.png', 'logo.png'].sort());
  // the logo: a clean PNG, trimmed of its transparent border (240 x 80 -> 224 x 64), kept as logo-src.png for rebuilds (not served)
  assert.deepEqual(B.pdf.logo, { src: 'brands/demo-gym/logo-flat.png', w: 224, h: 64 });
  assert.ok(fs.existsSync(path.join(BRANDS, 'demo-gym/logo-src.png')) && !B.assets.includes('logo-src.png'));
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
  assert.match(html, /href="brands\/demo-gym\/brand\.css"/); assert.match(html, /src="brands\/demo-gym\/logo\.png" width="154" height="44"/);
  for (const f of ['disclaimer.html', 'disclaimer.es.html', 'brands/demo-gym.js']) assert.ok(fs.existsSync(path.join(build, f)), f);
  for (const f of ['LICENSE', 'DISCLAIMER.md', 'brands/blazecamp.js', 'brands/sonhabitos.js', 'brands/sonhabitos']) assert.ok(!fs.existsSync(path.join(build, f)), 'no ' + f);
  const dEn = fs.readFileSync(path.join(build, 'disclaimer.html'), 'utf8'), dEs = fs.readFileSync(path.join(build, 'disclaimer.es.html'), 'utf8');
  assert.ok(dEn.includes('Lalo Vera and BFit Studios Corp., a Florida corporation, and Demo Gym Holdings LLC, registered in FL (doing business as Demo Gym)'));
  // the addendum, its own section on both pages: the gym's waiver is the gym's job, and these terms do not move it
  assert.match(dEn, /<h3>How this tool is provided<\/h3>\s*<p>Demo Gym \(Demo Gym Holdings LLC, FL\) provides this plan builder to its members and clients under license from BFit Studios Corp\.<\/p>/);
  assert.match(dEn, /every member or client sign the Demo Gym liability waiver before training/);
  assert.match(dEs, /<h3>Cómo se ofrece esta herramienta<\/h3>/); assert.match(dEs, /firme la exención de responsabilidad de Demo Gym antes de entrenar/);
  for (const d of [dEn, dEs]) assert.ok(d.indexOf('ofrece este creador') > 0 || d.indexOf('provides this plan builder') > 0);
  const tEs = JSON.parse(fs.readFileSync(path.join(build, 'model/i18n/es.json'), 'utf8'));
  assert.match(tEs['release.client'], /liberas a Lalo Vera, BFit Studios Corp\. y Demo Gym Holdings LLC \(que opera como Demo Gym\) de toda responsabilidad/);
  assert.match(tEs['ui.plan.release_line'], /También aplica la exención de responsabilidad de Demo Gym\.$/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(build, 'model/rules.json'), 'utf8')).legal.disclaimer_url.es, 'https://plan.demogym.example.com/disclaimer.es.html');
  assert.deepEqual(scanFolder(build, check), []);
  for (const f of walk(build).filter(x => /\.(html|m?js|css|json)$/.test(x))) assert.doesNotMatch(noParties(B, fs.readFileSync(path.join(build, f), 'utf8')), /Son H[aá]bitos|Nati Vera|Blaze/, f);
});

test('new-brand: --from-website with a local page (Spanish, SVG logo) - finds, guesses, makes a PNG; no legal name: not confirmed', { skip: NOB }, async () => {
  const out = newBrand(['--from-website', path.join(FIX, 'site-es.html'), '--no-build']);
  assert.match(out, /name: Fuerza Latina +\[found: <title>/); assert.match(out, /primary colour: #2a9d3f +\[guessed: most used colour/);
  assert.match(out, /id: fuerza-latina +\[made from the name\]/); assert.match(out, /logo: SVG -> PNG \d+ x \d+ \(trimmed, drawn by /);
  assert.match(out, /legal name: not found/); assert.match(out, /legal name: Fuerza Latina +\[NOT CONFIRMED; not found/);
  const B = await load('fuerza-latina');
  assert.equal(B.lang_default, 'es');
  // the SVG logo is a PNG everywhere: the header, the PDF cover, the icons; no SVG is kept
  assert.ok(B.pdf.logo && B.pdf.logo.src === 'brands/fuerza-latina/logo-flat.png');
  assert.match(B.html.icons, /favicon-64\.png/); assert.match(B.html.logo, /logo\.png/);
  assert.ok(fs.readdirSync(path.join(BRANDS, 'fuerza-latina')).every(f => !f.endsWith('.svg')));
  assert.equal(decodePng(fs.readFileSync(path.join(BRANDS, 'fuerza-latina/logo-src.png'))).data[3], 0, 'transparent where the SVG has nothing');
  assert.equal(B.legal.gym.legal_name, 'Fuerza Latina'); assert.equal(B.legal.gym.legal_name_confirmed, false);
  assert.equal(B.legal.parties.es, 'Lalo Vera, BFit Studios Corp. y Fuerza Latina');
  // explicit flags win over what the website says; the terms page gives the company
  const out2 = newBrand(['--from-website', path.join(FIX, 'site-en.html'), '--id', 'iron', '--name', 'Iron Temple', '--colors', '#123456,#abcdef', '--lang', 'es', '--no-build']);
  assert.match(out2, /name: Iron Temple \(your --name; the website said "Iron Temple Gym"\)/);
  assert.match(out2, /legal name: Iron Temple Fitness, LLC +\[found: file:.*terms\.html: "These terms/);
  const I = await load('iron');
  assert.equal(I.name, 'Iron Temple'); assert.equal(I.lang_default, 'es'); assert.match(fs.readFileSync(path.join(BRANDS, 'iron.js'), 'utf8'), /"colors":"#123456,#abcdef"/);
  assert.equal(I.pdf.logo.w, 224, 'the website\'s PNG logo, trimmed');
  assert.equal(I.legal.parties.en, 'Lalo Vera, BFit Studios Corp. and Iron Temple Fitness, LLC (doing business as Iron Temple)');
  assert.equal(I.legal.gym.legal_name_confirmed, true);
  // --force with only what changes: the rest is kept from the brand (name, colours, logo, the legal name)
  const out3 = newBrand(['--id', 'iron', '--colors', '#654321,#abcdef', '--force', '--no-build']);
  assert.match(out3, /kept from the brand \(--force\): name, lang, logo/);
  const I2 = await load('iron');
  assert.equal(I2.name, 'Iron Temple'); assert.equal(I2.legal.gym.legal_name, 'Iron Temple Fitness, LLC'); assert.equal(I2.pdf.logo.w, 224);
  assert.match(fs.readFileSync(path.join(BRANDS, 'iron.js'), 'utf8'), /"colors":"#654321,#abcdef"/);
});

test('logos: SVG and JPEG made into clean PNGs by a browser; a wordmark from the name (CH7-12)', { skip: NOB }, async () => {
  const svg = await logoToPng(fs.readFileSync(path.join(FIX, 'logo-es.svg')), { browser: BROWSER });
  const si = decodePng(svg.png);
  assert.equal(svg.from, 'svg'); assert.ok(si.w <= 512 && si.w > 300, `svg drawn at ${si.w} x ${si.h}`);
  assert.equal(si.data[3], 0, 'the corner is transparent');
  assert.equal(trimImage(si), si, 'already trimmed');
  const jpg = await logoToPng(fs.readFileSync(path.join(FIX, 'logo.jpg')), { browser: BROWSER });
  const ji = decodePng(jpg.png);
  assert.equal(jpg.from, 'jpeg');
  assert.ok(Math.abs(ji.w - 230) <= 4 && Math.abs(ji.h - 60) <= 4, `the white border trimmed: ${ji.w} x ${ji.h}`);
  const wm = await wordmarkPng('Iron Temple Gym', '#c8102e', { browser: BROWSER });
  const wi = decodePng(wm.png);
  assert.ok(wi.w <= 512 && wi.w > 200 && wi.h > 20 && wi.h < wi.w / 3, `wordmark ${wi.w} x ${wi.h}`);
  let red = 0;
  for (let i = 0; i < wi.data.length; i += 4) if (wi.data[i + 3] > 200 && wi.data[i] > 150 && wi.data[i + 1] < 60) red++;
  assert.ok(red > 500, 'drawn in the main colour');
  // new-brand: a JPEG logo, and --logo-text
  const out = newBrand(['--id', 'jpg-gym', '--name', 'Jpg Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.jpg'), '--colors', '#c8102e,#0e7c86', '--no-build']);
  assert.match(out, /logo: JPEG -> PNG/);
  assert.deepEqual(fs.readdirSync(path.join(BRANDS, 'jpg-gym')).sort(), ['brand.css', 'favicon-64.png', 'icon-180.png', 'logo-flat.png', 'logo-src.png', 'logo.png']);
  const out2 = newBrand(['--id', 'word-gym', '--name', 'Word Gym', '--lang', 'en', '--logo-text', '--colors', '#c8102e,#0e7c86', '--no-build']);
  assert.match(out2, /logo: a wordmark "Word Gym" in #c8102e/);
});

test('logos: without a browser, an SVG logo fails with a plain message (make a PNG yourself); a PNG still works', async () => {
  await assert.rejects(logoToPng(fs.readFileSync(path.join(FIX, 'logo-es.svg')), { browser: null }), (e) => e.message === NO_BROWSER);
  assert.match(NO_BROWSER, /--logo <file\.png>/);
  const env = { ...process.env, BC_NO_BROWSER: '1' };
  let err = '';
  try { node([path.join(ROOT, 'tools/new-brand.mjs'), '--brands-dir', BRANDS, '--packs-dir', PACKS, '--id', 'nob', '--name', 'No Browser Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo-es.svg'), '--colors', '#c8102e', '--no-build'], { env }); } catch (e) { err = String(e.stderr); }
  assert.match(err, /No browser to turn this logo into a PNG.*--logo <file\.png>/s);
  assert.ok(!fs.existsSync(path.join(BRANDS, 'nob.js')));
  node([path.join(ROOT, 'tools/new-brand.mjs'), '--brands-dir', BRANDS, '--packs-dir', PACKS, '--id', 'nob', '--name', 'No Browser Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e', '--no-build'], { env });
  assert.ok(fs.existsSync(path.join(BRANDS, 'nob/logo-src.png')));
});

test('--publish --dry-run prints the git commands and the link, and touches nothing (CH7-13)', () => {
  const r = execFileSync(process.execPath, [path.join(ROOT, 'tools/new-brand.mjs'), '--brands-dir', BRANDS, '--packs-dir', PACKS, '--id', 'pub-gym', '--name', 'Pub Gym', '--lang', 'en',
    '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e,#0e7c86', '--build-out', path.join(TMP, 'build-pub'), '--publish', '--dry-run'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  // stdout is only the link and its state
  assert.deepEqual(r.trim().split('\n'), ['https://white-label-previews.vercel.app/pub-gym/', 'dry run: nothing committed or pushed']);
  assert.deepEqual(brandPaths('pub-gym'), ['app/brands/pub-gym.js', 'app/brands/pub-gym', 'agent/packs/pub-gym']);
  let err = '';
  try { newBrand(['--id', 'pub-gym', '--force', '--publish']); } catch (e) { err = String(e.stderr); }
  assert.match(err, /--publish works on the repository's own folders/);
  try { newBrand(['--id', 'pub-gym', '--force', '--publish', '--dry-run', '--no-build']); } catch (e) { err = String(e.stderr); }
  assert.match(err, /--publish needs the trial build/);
  try { newBrand(['--id', 'pub-gym', '--force', '--dry-run']); } catch (e) { err = String(e.stderr); }
  assert.match(err, /--dry-run goes with --publish/);
  assert.equal(repoSlug('https://github.com/Blazecamp/blaze-camp-model.git'), 'Blazecamp/blaze-camp-model');
  assert.equal(repoSlug('git@github.com:Blazecamp/blaze-camp-model.git'), 'Blazecamp/blaze-camp-model');
  assert.equal(repoSlug('http://local_proxy@127.0.0.1:41000/git/Blazecamp/blaze-camp-model'), 'Blazecamp/blaze-camp-model');
});

test('new-brand: refuses bad input and never overwrites a brand it did not make', () => {
  const ok = ['--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e,#0e7c86', '--no-build'];
  fails(['--id', 'Bad Slug', ...ok], /--id must be lower-case/);
  for (const r of ['blazecamp', 'sonhabitos', 'previews', 'api']) { assert.ok(RESERVED.includes(r)); fails(['--id', r, ...ok], /is taken/); }
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', 'red,#0e7c86', '--no-build'], /not a hex colour/);
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'fr', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e', '--no-build'], /--lang must be en or es/);
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'nope.png'), '--colors', '#c8102e', '--no-build'], /file not found/);
  fails(['--id', 'tg', '--name', 'Test Gym', '--lang', 'en', '--logo', path.join(FIX, 'style.css'), '--colors', '#c8102e', '--no-build'], /must be an image \(PNG, SVG, JPG/);
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

test('export: refused until the gym\'s legal name is confirmed (CH7-11), with the steps to find it', () => {
  newBrand(['--id', 'nolegal', '--name', 'No Legal Gym', '--lang', 'en', '--logo', path.join(FIX, 'logo.png'), '--colors', '#c8102e', '--no-build']);
  const run = () => node([path.join(ROOT, 'tools/export-brand.mjs'), '--brand', 'nolegal', '--brands-dir', BRANDS, '--out', path.join(TMP, 'export-nolegal')]);
  let err = '';
  try { run(); } catch (e) { err = String(e.stderr); }
  assert.match(err, /legal name is not confirmed for 'nolegal'/); assert.match(err, /sunbiz/i); assert.match(err, /--legal-name "<Company LLC>"/); assert.match(err, /--legal-name-confirmed/);
  assert.ok(!fs.existsSync(path.join(TMP, 'export-nolegal')), 'nothing written');
  // the company name really is the brand name: confirm it, and the export goes through
  const out = newBrand(['--id', 'nolegal', '--legal-name-confirmed', '--force', '--no-build']);
  assert.match(out, /legal name: No Legal Gym +\[the brand name, confirmed \(--legal-name-confirmed\)\]/);
  run();
  const d = fs.readFileSync(path.join(TMP, 'export-nolegal/website/disclaimer.html'), 'utf8');
  assert.match(d, /<h3>How this tool is provided<\/h3>\s*<p>No Legal Gym provides this plan builder/);
  assert.ok(d.includes('Lalo Vera and BFit Studios Corp., a Florida corporation, and No Legal Gym (together'));
});

test('export: static (one brand, README EN + ES, LICENSE, disclaimers), --with-api (a Vercel project that builds and answers), --zip', async () => {
  const B = await load('demo-gym');
  const exp = path.join(TMP, 'export-static');
  node([path.join(ROOT, 'tools/export-brand.mjs'), '--brand', 'demo-gym', '--brands-dir', BRANDS, '--out', exp, '--zip']);
  assert.deepEqual(fs.readdirSync(exp).sort(), [...STATIC_TOP].sort());
  const files = walk(exp);
  assert.ok(files.includes('website/index.html') && files.includes('website/disclaimer.es.html') && files.includes('website/engine/generate.mjs'));
  assert.ok(files.every(f => !/brands\/(?!demo-gym)/.test(f)), 'only this brand');
  assert.ok(files.every(f => !/(coach_answers|raw\/|dumps|tests\/|design\/|reviews\/|samples\/|synthesis\/)/.test(f)));
  assert.match(fs.readFileSync(path.join(exp, 'LICENSE'), 'utf8'), /MIT License/);
  assert.match(fs.readFileSync(path.join(exp, 'README.md'), 'utf8'), /upload/i); assert.match(fs.readFileSync(path.join(exp, 'LEEME.md'), 'utf8'), /subdominio/);
  const dmd = fs.readFileSync(path.join(exp, 'DISCLAIMER.md'), 'utf8');
  assert.ok(dmd.includes('doing business as Demo Gym')); assert.match(dmd, /## How this tool is provided/);
  assert.match(fs.readFileSync(path.join(exp, 'DISCLAIMER.es.md'), 'utf8'), /## Cómo se ofrece esta herramienta/);
  for (const f of files.filter(x => x !== 'LICENSE' && /\.(html|m?js|css|json|md)$/.test(x))) {
    assert.doesNotMatch(noParties(B, fs.readFileSync(path.join(exp, f), 'utf8')), /Blaze|Gerardo|\bLalo\b|Son H[aá]bitos|Nati Vera/, f);
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
