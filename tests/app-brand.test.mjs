// tests/app-brand.test.mjs - one codebase, two brands (app/brands/<id>.js): both brand files complete, Son Hábitos opens in Spanish,
// its texts name no other brand, the coach's legal party wording (tools/brand-legal.mjs) in English and Spanish, the built sites
// (tools/build-site.mjs --brand ...) and a Son Hábitos PDF. The Blaze Camp build must stay what it was before brands.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ROOT, readModelDir, loadCompiledModel } from './helpers/models.mjs';
import { loadModel } from '../engine/model.mjs';
import { ui, STRINGS } from '../app/i18n.js';
import { brandUi, brandLang, brandRaw, hasBrandWord } from '../app/brand-apply.js';
import { legalSub, brandI18n, legalPartyTexts } from '../tools/brand-legal.mjs';
import { BRAND as ACTIVE } from '../app/brand.js';
import { BRAND as BC } from '../app/brands/blazecamp.js';
import { BRAND as SH } from '../app/brands/sonhabitos.js';
import { pdfDoc, drawPdf, pdfFileName } from '../app/pdf.js';

const BRANDS = [BC, SH];
const NAMES = /blaze|\blalo\b|\bgerardo\b/i;
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const EN = readJson('model/i18n/en.json'), ES = readJson('model/i18n/es.json');
const build = (brand) => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), `site-${brand}-`));
  execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-site.mjs'), '--out', out, '--brand', brand], { stdio: 'pipe' });
  return out;
};
/** a text with the owner's name allowed only inside the legal party wording */
const withoutParties = (s) => legalPartyTexts(SH.legal).reduce((acc, p) => acc.split(p).join(''), String(s));

test('brands: every brand file is complete and has the same shape', () => {
  assert.equal(ACTIVE.id, 'blazecamp', 'the source folder runs as Blaze Camp');
  const keys = Object.keys(BC).sort();
  for (const B of BRANDS) {
    assert.deepEqual(Object.keys(B).sort(), keys, `${B.id}: same keys as blazecamp`);
    assert.ok(fs.existsSync(path.join(ROOT, 'app/brands', B.id + '.js')), B.id);
    for (const k of ['id', 'name', 'short', 'storage_key', 'image_prefix']) assert.ok(typeof B[k] === 'string' && B[k], `${B.id}.${k}`);
    assert.ok(['en', 'es'].includes(B.lang_default), `${B.id}.lang_default`);
    assert.equal(typeof B.follow_browser_lang, 'boolean');
    for (const l of ['en', 'es']) {
      assert.ok(B.meta[l].title && B.meta[l].description, `${B.id}.meta.${l}`);
      assert.deepEqual(Object.keys(B.words[l]).sort(), Object.keys(B.words.en).sort(), `${B.id}.words: EN = ES keys`);
      for (const k of Object.keys(B.words[l])) assert.ok(k in STRINGS.en || /^app\.(eyebrow|welcome)$/.test(k), `${B.id}.words.${l}.${k} is an app word`);
      for (const k of Object.keys(B.model_words[l] || {})) assert.ok(k in EN, `${B.id}.model_words.${l}.${k} is a model word`);
    }
    for (const k of ['theme_color', 'icons', 'logo']) assert.ok(B.html[k], `${B.id}.html.${k}`);
    for (const a of B.assets) assert.ok(fs.existsSync(path.join(ROOT, 'app/brands', B.id, a)), `${B.id} asset ${a}`);
    if (B.html.css) assert.ok(B.assets.includes(B.html.css.split('/').pop()), `${B.id} css is an asset`);
    assert.match(B.pdf.file_prefix, /^[A-Za-z0-9-]+$/);
    for (const k of ['app.title', 'app.brand', 'app.credit', 'plan.share_title', 'print.generated']) assert.ok(B.words.en[k] && B.words.es[k], `${B.id} names itself: ${k}`);
  }
  assert.notEqual(BC.storage_key, SH.storage_key);
  // the assets are small (the logo and icons are a few KB each)
  const size = SH.assets.reduce((n, a) => n + fs.statSync(path.join(ROOT, 'app/brands/sonhabitos', a)).size, 0);
  assert.ok(size < 120 * 1024, `Son Hábitos assets ${size} bytes`);
});

test('brands: Son Hábitos opens in Spanish (a saved choice wins); Blaze Camp keeps English with the browser language', () => {
  assert.equal(SH.lang_default, 'es');
  assert.equal(brandLang(SH, null, 'en-US'), 'es');
  assert.equal(brandLang(SH, undefined, 'es-MX'), 'es');
  assert.equal(brandLang(SH, 'en', 'es-MX'), 'en', 'the visitor chose English before');
  assert.equal(brandLang(SH, 'xx', 'en-US'), 'es');
  assert.equal(BC.lang_default, 'en');
  assert.equal(brandLang(BC, null, 'en-US'), 'en');
  assert.equal(brandLang(BC, null, 'es-MX'), 'es', 'unchanged: Spanish browser -> Spanish');
  assert.equal(brandLang(BC, 'en', 'es-MX'), 'en');
});

test('brands: the app words - each brand names itself, Son Hábitos never names Blaze Camp or Coach Lalo', () => {
  const sh = brandUi(SH, ui), bc = brandUi(BC, ui);
  assert.equal(sh('es', 'app.title'), 'Son Hábitos - Tu plan de ejercicio');
  assert.equal(sh('en', 'app.title'), 'Son Hábitos - Your exercise plan');
  assert.equal(sh('es', 'build.title_weeks', { n: 12 }), 'Creando tu plan de 12 semanas…');
  assert.equal(sh('es', 'plan.share_title', { day: 'Lunes' }), 'Son Hábitos - Lunes');
  assert.equal(sh('es', 'nav.next'), ui('es', 'nav.next'), 'other words are the shared ones');
  assert.ok(hasBrandWord(SH, 'es', 'app.welcome') && !hasBrandWord(BC, 'es', 'app.welcome'));
  // Blaze Camp: exactly the words it had before brands
  assert.equal(bc('en', 'app.title'), 'Blaze Camp - Plan Builder');
  assert.equal(bc('es', 'app.title'), 'Blaze Camp - Creador de planes');
  assert.equal(bc('en', 'app.credit'), 'Model by Coach Lalo (Gerardo Vera), Master NASM coach');
  assert.equal(bc('es', 'print.generated'), 'Creado con el Creador de planes de Blaze Camp');
  // the shared words (app/i18n.js) name no brand, and Son Hábitos's file only the legal parties
  assert.doesNotMatch(JSON.stringify(STRINGS), NAMES);
  const shText = JSON.stringify({ ...SH, legal: { ...SH.legal, parties: null } });
  assert.doesNotMatch(shText, NAMES);
  for (const l of ['en', 'es']) for (const k of Object.keys(STRINGS.en)) assert.doesNotMatch(sh(l, k), NAMES, `${l} ${k}`);
});

test('brands: the legal party wording (coach 2026-10-13) - English', () => {
  const L = SH.legal;
  assert.equal(L.parties.en, 'Lalo Vera and BFit Studios Corp., doing business as Son Hábitos');
  assert.equal(legalSub(EN['ui.plan.release_line'], 'en', L),
    'You accepted the terms and released Lalo Vera and BFit Studios Corp., doing business as Son Hábitos, from all liability before this plan was built. You follow it entirely at your own risk. It is general fitness information, not medical advice: stop and see a professional if something hurts.');
  assert.ok(legalSub(EN['ui.plan.own_risk'], 'en', L).includes('you release Lalo Vera and BFit Studios Corp., doing business as Son Hábitos, from all liability.'));
  const coach = legalSub(EN['release.coach'], 'en', L);
  assert.ok(coach.includes('The Son Hábitos release does not cover your client.'));
  assert.ok(coach.includes('you release Lalo Vera and BFit Studios Corp., doing business as Son Hábitos, from liability and hold them harmless'));
  assert.ok(legalSub(EN['release.client'], 'en', L).includes('Son Hábitos keeps none of your answers.'));
  assert.ok(legalSub(EN['warn.coach_bypass'], 'en', L).includes('Son Hábitos has not screened this client.'));
  for (const k of ['ui.plan.release_line_coach', 'ui.plan.release_line_minor']) assert.ok(legalSub(EN[k], 'en', L).includes('Lalo Vera and BFit Studios Corp., doing business as Son Hábitos, from all liability'), k);
  // the end of a sentence keeps its full stop; a string without the names is unchanged; no legal block = no change
  assert.equal(legalSub('They released Lalo Vera, Blaze Camp and BFit Studios Corp.', 'en', L), 'They released Lalo Vera and BFit Studios Corp., doing business as Son Hábitos.');
  assert.equal(legalSub('Nothing here.', 'en', L), 'Nothing here.');
  assert.equal(legalSub(EN['ui.plan.release_line'], 'en', null), EN['ui.plan.release_line']);
});

test('brands: the legal party wording (coach 2026-10-13) - Spanish', () => {
  const L = SH.legal;
  assert.equal(L.parties.es, 'Lalo Vera y BFit Studios Corp., que opera como Son Hábitos');
  assert.equal(legalSub(ES['ui.plan.release_line'], 'es', L),
    'Aceptaste los términos y liberaste de toda responsabilidad a Lalo Vera y BFit Studios Corp., que opera como Son Hábitos, antes de que se creara este plan. Lo sigues por completo bajo tu propio riesgo. Es información general de acondicionamiento físico, no un consejo médico: detente y consulta a un profesional si algo te duele.');
  assert.ok(legalSub(ES['ui.plan.release_line_coach'], 'es', L).includes('a Lalo Vera y BFit Studios Corp., que opera como Son Hábitos. Ese profesional es responsable'), 'sentence end');
  assert.ok(legalSub(ES['ui.plan.own_risk'], 'es', L).includes('liberas a Lalo Vera y BFit Studios Corp., que opera como Son Hábitos, de toda responsabilidad.'));
  const coach = legalSub(ES['release.coach'], 'es', L);
  assert.ok(coach.includes('La liberación de Son Hábitos no cubre a tu cliente.'));
  assert.ok(legalSub(ES['release.client'], 'es', L).includes('Son Hábitos no guarda ninguna de tus respuestas.'));
  assert.ok(legalSub(ES['warn.coach_bypass'], 'es', L).includes('Son Hábitos no ha evaluado a este cliente.'));
});

test('brands: the whole model word tables - no other brand left, the owner only inside the legal parties', () => {
  for (const [lang, table] of [['en', EN], ['es', ES]]) {
    const { table: out, changed } = brandI18n(table, lang, SH.legal);
    assert.deepEqual(Object.keys(out), Object.keys(table), 'same keys');
    for (const k of ['release.client', 'release.coach', 'ui.plan.own_risk', 'ui.plan.release_line', 'ui.plan.release_line_coach', 'ui.plan.release_line_minor', 'warn.coach_bypass']) assert.ok(changed.includes(k), `${lang} ${k} changed`);
    for (const [k, v] of Object.entries(out)) {
      if (typeof v !== 'string') continue;
      if (k === 'instruction.5') continue;   // the brand's own display word replaces it (model_words)
      assert.doesNotMatch(withoutParties(v), NAMES, `${lang} ${k}`);
    }
    // placeholders are kept
    for (const [k, v] of Object.entries(out)) if (typeof v === 'string') assert.deepEqual(v.match(/\{\w+\}/g) || [], table[k].match(/\{\w+\}/g) || [], k);
    assert.doesNotMatch(SH.model_words[lang]['instruction.5'], NAMES);
  }
});

test('brands: brandRaw - Blaze Camp unchanged; Son Hábitos display words and its own disclaimer link', () => {
  const raw = readModelDir();
  assert.equal(brandRaw(raw, BC, 'https://example.org/'), raw, 'Blaze Camp: the same object');
  const r = brandRaw(raw, SH, 'https://plan.example.org/app/');
  assert.equal(r.rules.legal.disclaimer_url.en, 'https://plan.example.org/app/disclaimer.html');
  assert.equal(r.rules.legal.disclaimer_url.es, 'https://plan.example.org/app/disclaimer.es.html');
  assert.equal(r.i18n.es['instruction.5'], SH.model_words.es['instruction.5']);
  assert.equal(raw.i18n.es['instruction.5'], ES['instruction.5'], 'the raw model is not changed');
  const m = loadModel(r);
  assert.equal(m.t('es', 'instruction.5'), SH.model_words.es['instruction.5']);
});

test('brands: the built sites - Blaze Camp as before; Son Hábitos in Spanish, its own assets and disclaimers, no other brand', () => {
  const bc = build('blazecamp'), sh = build('sonhabitos');
  try {
    // Blaze Camp: the page is the source page, the legal files are the repository's, no Son Hábitos file
    assert.equal(fs.readFileSync(path.join(bc, 'index.html'), 'utf8'), fs.readFileSync(path.join(ROOT, 'app/index.html'), 'utf8'));
    for (const f of ['DISCLAIMER.md', 'DISCLAIMER.es.md', 'LICENSE', 'brands/blazecamp.js']) assert.ok(fs.existsSync(path.join(bc, f)), f);
    assert.ok(!fs.existsSync(path.join(bc, 'brands/sonhabitos')) && !fs.existsSync(path.join(bc, 'brands/sonhabitos.js')));
    assert.match(fs.readFileSync(path.join(bc, 'brand.js'), 'utf8'), /'\.\/brands\/blazecamp\.js'/);
    for (const f of ['model/i18n/en.json', 'model/i18n/es.json', 'model/rules.json', 'engine/intake.mjs']) {
      assert.ok(fs.readFileSync(path.join(bc, f)).equals(fs.readFileSync(path.join(ROOT, f))), `${f} copied as is`);
    }

    // Son Hábitos
    const html = fs.readFileSync(path.join(sh, 'index.html'), 'utf8');
    assert.match(html, /<html lang="es">/);
    assert.match(html, /<title>Son Hábitos - Tu plan de ejercicio<\/title>/);
    assert.match(html, /href="brands\/sonhabitos\/brand\.css"/);
    assert.match(html, /data-value="es" aria-pressed="true"/);
    assert.match(fs.readFileSync(path.join(sh, 'brand.js'), 'utf8'), /'\.\/brands\/sonhabitos\.js'/);
    for (const a of SH.assets) assert.ok(fs.existsSync(path.join(sh, 'brands/sonhabitos', a)), a);
    for (const f of ['DISCLAIMER.md', 'DISCLAIMER.es.md', 'LICENSE', 'brands/blazecamp.js']) assert.ok(!fs.existsSync(path.join(sh, f)), `no ${f}`);
    const en = fs.readFileSync(path.join(sh, 'disclaimer.html'), 'utf8'), es = fs.readFileSync(path.join(sh, 'disclaimer.es.html'), 'utf8');
    assert.ok(en.includes('Lalo Vera and BFit Studios Corp., a Florida corporation, doing business as Son Hábitos (together, &quot;Son Hábitos&quot;)'));
    assert.ok(en.includes('release, waive and discharge Lalo Vera and BFit Studios Corp., doing business as Son Hábitos, and their owners'));
    assert.ok(en.includes('the total liability of Son Hábitos is limited'));
    assert.ok(en.includes('Lalo Vera and BFit Studios Corp., doing business as Son Hábitos, against any claim'));
    assert.ok(es.includes('Lalo Vera y BFit Studios Corp., una corporación de Florida, que opera como Son Hábitos (en conjunto, &quot;Son Hábitos&quot;)'));
    assert.ok(es.includes('Lalo Vera y BFit Studios Corp., que opera como Son Hábitos, y a sus propietarios'));
    assert.ok(es.includes('Lalo Vera y BFit Studios Corp., que opera como Son Hábitos, frente a cualquier reclamo'));
    assert.match(en, /<a href="disclaimer\.es\.html"/);
    // nothing on the site names the other brand; the owner only inside the legal parties
    const walk = (d, b = '') => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name), path.join(b, e.name)) : [path.join(b, e.name)]));
    for (const f of walk(sh).filter(x => /\.(html|m?js|css|json|svg|txt|md)$/.test(x))) {
      assert.doesNotMatch(withoutParties(fs.readFileSync(path.join(sh, f), 'utf8')), NAMES, f);
    }
    // the same plan from both sites' models (a plan holds codes; the seed does not depend on the words)
    const rules = JSON.parse(fs.readFileSync(path.join(sh, 'model/rules.json'), 'utf8'));
    assert.match(rules.legal.disclaimer_url.en, /^https:\/\/.+\/disclaimer\.html$/);
    assert.equal(rules.legal.owner, 'Lalo Vera and BFit Studios Corp., doing business as Son Hábitos');
  } finally {
    fs.rmSync(bc, { recursive: true, force: true }); fs.rmSync(sh, { recursive: true, force: true });
  }
});

test('brands: a Son Hábitos PDF - its name, logo, colours and legal wording; no other brand', () => {
  const sh = build('sonhabitos');
  try {
    const model = loadModel(brandRaw(readModelDir(path.join(sh, 'model')), SH, 'https://plan.example.org/'));
    const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/plans/08-pickleball-genpop.json'), 'utf8'));
    const { jsPDF } = createRequire(import.meta.url)(path.join(ROOT, 'app/vendor/jspdf.umd.min.js'));
    const png = fs.readFileSync(path.join(ROOT, 'app/brands/sonhabitos/logo-flat.png'));
    for (const lang of ['es', 'en']) {
      const t = (k, a) => brandUi(SH, ui)(lang, k, a);
      const doc = pdfDoc(plan, model, lang, t, { ...SH, logo_data: { data: 'data:image/png;base64,' + png.toString('base64'), w: SH.pdf.logo.w, h: SH.pdf.logo.h } });
      assert.equal(doc.brand, 'SON HÁBITOS');
      assert.equal(doc.credit, 'Son Hábitos · Nati Vera');
      assert.ok(doc.release.includes(SH.legal.parties[lang]), 'the legal parties in the release');
      assert.ok(doc.url.endsWith(lang === 'es' ? 'disclaimer.es.html' : 'disclaimer.html'));
      const strings = JSON.stringify(doc, (k, v) => (typeof v === 'function' ? undefined : v)).replace(/"data":"[^"]*"/, '');
      assert.doesNotMatch(withoutParties(strings), NAMES);
      const pdf = drawPdf(doc, jsPDF);
      const buf = Buffer.from(pdf.output('arraybuffer'));
      assert.equal(buf.subarray(0, 5).toString('latin1'), '%PDF-');
      assert.match(buf.toString('latin1'), /\/Subtype \/Image/, 'the logo is drawn');
      let text = '';
      const bin = buf.toString('latin1');
      for (const m of bin.matchAll(/stream\r?\n/g)) {
        const start = m.index + m[0].length, end = bin.indexOf('endstream', start);
        try { text += zlib.inflateSync(buf.subarray(start, end)).toString('latin1'); } catch { /* an image stream */ }
      }
      assert.doesNotMatch(text, /Blaze|Gerardo/);
      assert.ok(buf.length < 2 * 1024 * 1024);
    }
    assert.equal(pdfFileName({ meta: { goal: 'general', start_date: '2026-10-19' } }, SH.pdf.file_prefix), 'Son-Habitos-plan-general-2026-10-19.pdf');
    assert.equal(pdfFileName({ meta: { goal: 'general' } }), 'Blaze-Camp-plan-general.pdf', 'the source folder default: Blaze Camp');
  } finally { fs.rmSync(sh, { recursive: true, force: true }); }
});

test('brands: Blaze Camp PDF words are unchanged', () => {
  const model = loadCompiledModel();
  const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/plans/07-push-pull-legs.json'), 'utf8'));
  const doc = pdfDoc(plan, model, 'en', (k, a) => ui('en', k, a));
  assert.equal(doc.brand, 'BLAZE CAMP');
  assert.equal(doc.credit, 'Model by Coach Lalo (Gerardo Vera), Master NASM coach');
  assert.equal(doc.meta.name, 'Blaze Camp');
  assert.equal(doc.colors, null);
  assert.equal(doc.logo, null);
});
