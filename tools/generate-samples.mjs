#!/usr/bin/env node
// tools/generate-samples.mjs - B4 (engine/CONTRACTS.md §4.13). For every samples/intakes/*.json: generate the plan, validate it,
// and write samples/plans/<name>.json, samples/plans/<name>.<lang>.md (+ <name>.en.md when the intake is Spanish).
// Prints one validation line per sample; exits 1 if any plan is not ok or fails an `error` check.
//
//   node tools/generate-samples.mjs                 # model/ when compiled, else the fixture (says which)
//   node tools/generate-samples.mjs --fixture       # engine/fixtures/mini-model.json
//   node tools/generate-samples.mjs --model model   # a compiled model directory
//   node tools/generate-samples.mjs --only 08       # one sample (file-name prefix)
//   node tools/generate-samples.mjs --out <dir>     # write somewhere else (default samples/plans)
//   node tools/generate-samples.mjs --stubs --out <dir>   # preview with the test stubs while B2 / B3 are not built (never into samples/plans)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadModel } from '../engine/model.mjs';
import { generate, generateWith, realModulesStatus, ENGINE_VERSION } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const a = { fixture: false, model: null, only: null, out: null, stubs: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--fixture') a.fixture = true;
    else if (k === '--stubs') a.stubs = true;
    else if (k === '--model') a.model = argv[++i];
    else if (k === '--only') a.only = argv[++i];
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--help' || k === '-h') { a.help = true; }
    else { console.error('unknown argument ' + k); process.exit(2); }
  }
  return a;
}

function readModelDir(dir) {
  const mf = path.join(dir, 'manifest.json');
  if (!fs.existsSync(mf)) return null;
  const manifest = JSON.parse(fs.readFileSync(mf, 'utf8'));
  const f = manifest.files;
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
  const review = f.i18n.es_review && fs.existsSync(path.join(dir, f.i18n.es_review)) ? read(f.i18n.es_review) : { missing_keys: [], machine_translated: [] };
  return { manifest, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: review } };
}

function loadChosenModel(a) {
  if (!a.fixture) {
    const dir = path.resolve(ROOT, a.model || 'model');
    const raw = readModelDir(dir);
    if (raw) return { model: loadModel(raw), label: path.relative(ROOT, dir) + '/' };
    if (a.model) { console.error('no compiled model in ' + dir); process.exit(2); }
    console.log('model/ is not compiled yet - using the fixture (engine/fixtures/mini-model.json)');
  }
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine', 'fixtures', 'mini-model.json'), 'utf8'));
  delete raw._fixture;
  return { model: loadModel(raw), label: 'engine/fixtures/mini-model.json' };
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.help) { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 13).join('\n')); return 0; }
  const { model, label } = loadChosenModel(a);
  let run;
  const st = realModulesStatus();
  if (a.stubs) {
    if (!a.out) { console.error('--stubs needs --out <dir>: stub plans are previews and never go to samples/plans'); return 2; }
    const stubs = await import(pathToFileURL(path.join(ROOT, 'tests', 'helpers', 'stub-modules.mjs')).href);
    run = (intake) => generateWith(stubs.STUB_DEPS, intake, model);
  } else if (!st.ready) {
    console.error('the B2 / B3 engine modules are not built yet (missing: ' + st.missing_exports.join(', ') + '). Use --stubs --out <dir> for a pipeline preview.');
    return 2;
  } else run = (intake) => generate(intake, model);

  const inDir = path.join(ROOT, 'samples', 'intakes');
  const outDir = path.resolve(ROOT, a.out || path.join('samples', 'plans'));
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(inDir).filter(f => f.endsWith('.json')).sort().filter(f => !a.only || f.startsWith(a.only));
  if (!files.length) { console.error('no intake matches ' + (a.only || '*')); return 2; }
  console.log(`model ${label} (${model.version}) · engine ${ENGINE_VERSION} · ${a.stubs ? 'STUB modules (preview only)' : 'real modules'} · ${files.length} sample(s) -> ${path.relative(ROOT, outDir) || '.'}`);

  let bad = 0;
  for (const f of files) {
    const name = f.replace(/\.json$/, '');
    const intake = JSON.parse(fs.readFileSync(path.join(inDir, f), 'utf8'));
    let plan;
    try { plan = run(intake); } catch (e) { bad++; console.log(`${name.padEnd(30)} THROW ${e.code || ''} ${e.message}`); continue; }
    fs.writeFileSync(path.join(outDir, name + '.json'), JSON.stringify(plan, null, 2) + '\n');
    const lang = plan.lang || 'en';
    fs.writeFileSync(path.join(outDir, `${name}.${lang}.md`), renderPlan(plan, model, { lang }));
    if (lang !== 'en') fs.writeFileSync(path.join(outDir, `${name}.en.md`), renderPlan(plan, model, { lang: 'en' }));
    const checks = (plan.validation && plan.validation.checks) || [];
    const errors = checks.filter(c => !c.pass && c.severity === 'error');
    const warns = checks.filter(c => !c.pass && c.severity === 'warn');
    if (plan.status !== 'ok' || errors.length) bad++;
    const m = plan.meta || {};
    const tpl = m.template ? m.template.id + (m.template.variant ? '/' + m.template.variant : '') : '-';
    const totals = plan.summary ? plan.summary.total_resistance_sets_by_week : [];
    const blocks = plan.shape ? plan.shape.training_blocks.map(t => t.type + ' ' + t.weeks.join('-')).join(' + ') : '-';
    console.log(`${name.padEnd(30)} ${plan.status.padEnd(7)} ${String(m.program_id || '-').padEnd(6)} ${tpl.padEnd(40)} ${lang} · ${blocks} · sets ${totals.length ? totals[0] + '->' + totals[totals.length - 1] : '-'}` +
      ` · errors ${errors.length ? errors.map(c => c.id + '(' + c.violations.length + ')').join(' ') : 0}` +
      ` · warn-checks ${warns.length ? warns.map(c => c.id).join(' ') : 0}` +
      ` · warnings ${(m.warnings || []).length ? [...new Set(m.warnings.map(w => w.key.replace(/^warning\./, '')))].join(',') : 0}`);
  }
  console.log(bad ? `${bad} sample(s) with errors` : 'all samples ok: zero failing error checks');
  return bad ? 1 : 0;
}

main().then(code => process.exit(code), (e) => { console.error(e); process.exit(1); });
