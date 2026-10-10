// per-item comparison: the engine's planning cost (work_minutes[time class] + rest_class_minutes) vs the printed dose
// (reps x 3 s, both sides when per-side / unilateral, + printed rest midpoint). Read-only.
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL, fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const SNAP = path.join(HERE, 'snap');
const { loadModel } = await import(pathToFileURL(path.join(SNAP, 'engine', 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(SNAP, 'engine', 'generate.mjs')).href);
const dir = path.join(SNAP, 'model'); const mf = JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')); const f = mf.files; const read=(r)=>JSON.parse(fs.readFileSync(path.join(dir,r),'utf8'));
const model = loadModel({ manifest: mf, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } });
const T = model.rules.time_model;
const SPR = Number(process.env.SPR || 3);
const [,, name, wk, wd] = process.argv;
const intake = JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', name + '.json'), 'utf8'));
const p = generate(intake, model);
const w = p.weeks[Number(wk) - 1]; const d = w.days.find(x => x.weekday === wd);
const mid = (a, b) => (a + b) / 2;
let sumE = 0, sumP = 0;
for (const b of d.blocks) for (const it of b.items) {
  if (!it.exercise_id || typeof it.sets !== 'number' || it.role === 'warmup' || it.circuit) continue;
  let tc;
  try { tc = model.bucket(it.bucket).time_class; } catch { tc = null; }
  const uni = it.laterality === 'unilateral' || it.laterality === 'alternating';
  if (uni && tc === 'compound_bilateral') tc = 'compound_unilateral'; else if (uni && tc === 'isolation') tc = 'isolation_unilateral';
  tc = tc || 'isolation';
  const rc = it.role === 'work' && it.rest && it.rest.type === 'seconds' && it.rest.min >= 180 ? 'strength' : T.rest_class_by_time_class[tc];
  const eng = T.work_minutes[tc] + T.rest_class_minutes[rc];
  const r = it.reps || {};
  let work = null;
  if (r.type === 'range' || r.type === 'fixed') work = (r.type === 'range' ? mid(r.min, r.max) : r.value) * SPR * (uni ? 2 : 1) / 60;
  else if (r.type === 'per_side') work = mid(r.min, r.max) * SPR * 2 / 60;
  else if (r.type === 'seconds') work = mid(r.min, r.max) * (uni ? 2 : 1) / 60;
  const rest = it.rest && (it.rest.type === 'seconds' || it.rest.type === 'after_pair') ? mid(it.rest.min, it.rest.max) / 60 : null;
  const pr = work !== null && rest !== null ? work + rest : null;
  sumE += it.sets * eng; if (pr !== null) sumP += it.sets * pr; else sumP += it.sets * eng;
  console.log(`${(it.exercise_id).slice(0, 34).padEnd(34)} ${String(it.sets).padStart(2)} x  engine ${eng.toFixed(2)} min/set (${tc}/${rc})  printed ${pr === null ? '  -  ' : pr.toFixed(2)} min/set  reps ${JSON.stringify(r).slice(0, 40)} rest ${it.rest ? it.rest.min + '-' + it.rest.max : '-'}${it.superset ? ' [' + it.superset + ']' : ''}`);
}
console.log(`set-minutes (before pairing / changeovers): engine ${sumE.toFixed(1)}  printed ${sumP.toFixed(1)}  day est ${d.est_minutes} / ${d.minutes_limit}`);
