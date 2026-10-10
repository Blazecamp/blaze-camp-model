// prints one day's items with the engine's per-set cost and the printed dose (debug aid)
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL, fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SNAP = path.join(HERE, 'snap');
const { loadModel } = await import(pathToFileURL(path.join(SNAP, 'engine', 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(SNAP, 'engine', 'generate.mjs')).href);
const dir = path.join(SNAP, 'model'); const mf = JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')); const f = mf.files; const read=(r)=>JSON.parse(fs.readFileSync(path.join(dir,r),'utf8'));
const model = loadModel({ manifest: mf, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } });
const [,, name, wk, wd] = process.argv;
const intake = JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', name + '.json'), 'utf8'));
const plan = generate(intake, model);
globalThis.__plan = plan;
const w = plan.weeks[Number(wk) - 1];
for (const d of w.days) {
  if (wd && d.weekday !== wd) continue;
  console.log('==', d.weekday, d.kind, 'est', d.est_minutes, 'limit', d.minutes_limit, 'ss_on', d.supersets_on, 'groups', JSON.stringify(d.groups));
  for (const b of d.blocks) for (const it of b.items) console.log('  ', b.kind.padEnd(11), (it.role||'').padEnd(12), (it.bucket||'').padEnd(18), String(it.exercise_id || it.text_key).slice(0,38).padEnd(38), 'sets', it.sets, 'reps', JSON.stringify(it.reps), 'rest', JSON.stringify(it.rest), 'ss', it.superset, 'lat', it.laterality);
}
if (process.argv[5] === 'aer') for (const d of w.days) for (const b of d.blocks) for (const it of b.items) if (it.bucket === 'COND_AEROBIC' || it.aerobic) console.log('AER', d.weekday, JSON.stringify(it.aerobic), JSON.stringify(it.reps), 'aerobic_minutes', d.aerobic_minutes);
