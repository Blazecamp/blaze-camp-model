import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL, fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const SNAP = path.join(HERE, 'snap');
const { loadModel } = await import(pathToFileURL(path.join(SNAP, 'engine', 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(SNAP, 'engine', 'generate.mjs')).href);
const dir = path.join(SNAP, 'model'); const mf = JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')); const f = mf.files; const read=(r)=>JSON.parse(fs.readFileSync(path.join(dir,r),'utf8'));
const model = loadModel({ manifest: mf, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } });
const files = fs.readdirSync(path.join(SNAP, 'intakes')).filter(x => x.endsWith('.json')).sort();
console.log('| Sample | Line | Planned T wk1 -> last | Placed main days wk1 -> last | Placed all days wk1 -> last | Max |T - placed(main)| over the block | Weeks where placed(main) is >= 1 set below T |');
console.log('|---|---|---|---|---|---|---|');
for (const file of files) {
  const p = generate(JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', file), 'utf8')), model);
  const ws = p.weeks.filter(w => w.block_type === 'stairway' && w.training_block === 1);
  if (!ws.length) continue;
  const lines = Object.keys(ws[0].target_by_muscle).filter(l => ws.every(w => typeof w.target_by_muscle[l] === 'number'));
  for (const l of lines) {
    const T = ws.map(w => w.target_by_muscle[l]), M = ws.map(w => w.main_sets_by_muscle[l] || 0), A = ws.map(w => w.weekly_sets_by_line[l] || 0);
    const gap = Math.max(...T.map((t, i) => Math.abs(t - M[i])));
    const below = T.filter((t, i) => M[i] <= t - 1).length;
    if (gap < 1) continue;
    console.log(`| ${file.replace('.json', '')} | ${l} | ${T[0]} -> ${T[T.length - 1]} | ${M[0]} -> ${M[M.length - 1]} | ${A[0]} -> ${A[A.length - 1]} | ${gap.toFixed(2)} | ${below} / ${T.length} |`);
  }
}
