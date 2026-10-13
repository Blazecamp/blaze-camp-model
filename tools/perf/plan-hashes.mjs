#!/usr/bin/env node
// tools/perf/plan-hashes.mjs - time generate() and hash every plan, for refactors that must not change output (DECISIONS G-311).
//   node tools/perf/plan-hashes.mjs --write base.json      record per-intake SHA-256 of the plan JSON and the rendered text
//   node tools/perf/plan-hashes.mjs --compare base.json    the same, then compare with a recorded run (exit 1 on any difference)
// Options: --fixture (also the reference fixture model), --filter <s>, --no-render. Reads samples/intakes and design/bench/intakes,
// generates each intake in English and in Spanish, and renders each plan's full view in both languages.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadModel } from '../../engine/model.mjs';
import { generate } from '../../engine/generate.mjs';
import { renderPlan } from '../../engine/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : null; };
const flag = (n) => argv.includes('--' + n);
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

function readModelDir(dir) {
  const manifest = readJSON(path.join(dir, 'manifest.json')), f = manifest.files, rd = (r) => readJSON(path.join(dir, r));
  return { manifest, catalog: rd(f.catalog), rules: rd(f.rules), templates: rd(f.templates), profiles: rd(f.profiles),
    i18n: { en: rd(f.i18n.en), es: rd(f.i18n.es), es_review: f.i18n.es_review && fs.existsSync(path.join(dir, f.i18n.es_review)) ? rd(f.i18n.es_review) : { missing_keys: [], machine_translated: [] } } };
}
const models = [['model', loadModel(readModelDir(path.join(ROOT, 'model')))]];
if (flag('fixture')) { const raw = readJSON(path.join(ROOT, 'engine', 'fixtures', 'mini-model.json')); delete raw._fixture; models.push(['fixture', loadModel(raw)]); }

const files = [];
for (const d of ['samples/intakes', 'design/bench/intakes'])
  for (const f of fs.readdirSync(path.join(ROOT, d)).sort()) if (f.endsWith('.json')) files.push(path.join(d, f));
const filt = opt('filter');
const out = {}, times = [];
for (const [mname, model] of models) for (const rel of files) {
  if (filt && !rel.includes(filt)) continue;
  const intake = readJSON(path.join(ROOT, rel));
  for (const lang of ['en', 'es']) {
    const ik = { ...intake, lang };
    const t0 = process.hrtime.bigint();
    const plan = generate(ik, model);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    const key = `${mname}|${rel}|${lang}`;
    const rec = { plan: sha(JSON.stringify(plan)) };
    if (!flag('no-render') && plan.status === 'ok') {
      rec.en = sha(renderPlan(plan, model, { lang: 'en', view: 'full' }));
      rec.es = sha(renderPlan(plan, model, { lang: 'es', view: 'full' }));
    }
    out[key] = rec; times.push([key, ms]);
    console.error(`${ms.toFixed(0).padStart(7)} ms  ${key}`);
  }
}
const byKey = Object.fromEntries(times);
times.sort((a, b) => b[1] - a[1]);
const total = times.reduce((s, t) => s + t[1], 0);
console.log(`plans ${times.length}, total ${(total / 1000).toFixed(1)} s, slowest:`);
for (const [k, ms] of times.slice(0, 12)) console.log(`  ${ms.toFixed(0).padStart(7)} ms  ${k}`);
if (opt('write')) fs.writeFileSync(opt('write'), JSON.stringify({ hashes: out, times: byKey }, null, 1));
if (opt('compare')) {
  const base = readJSON(opt('compare')).hashes; let same = 0, diff = 0;
  for (const [k, v] of Object.entries(out)) {
    if (JSON.stringify(base[k]) === JSON.stringify(v)) same++; else { diff++; console.log('DIFF', k); }
  }
  console.log(`hash check: ${same} identical, ${diff} different`);
  if (diff) process.exit(1);
}
