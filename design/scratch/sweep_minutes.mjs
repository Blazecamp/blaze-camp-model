// design/scratch/sweep_minutes.mjs - monotonicity probe (read-only): the same intake with more minutes (and more days) should never
// train fewer groups directly, hold a trained group below its floor more often, or plan a lower peak. Runs the snapshot engine in memory.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SNAP = path.join(HERE, 'snap');
const { loadModel } = await import(pathToFileURL(path.join(SNAP, 'engine', 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(SNAP, 'engine', 'generate.mjs')).href);
const dir = path.join(SNAP, 'model'); const mf = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')); const f = mf.files; const read = (r) => JSON.parse(fs.readFileSync(path.join(dir, r), 'utf8'));
const model = loadModel({ manifest: mf, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } });
const GROUPS = ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves'];
const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYSETS = { 2: ['Mon', 'Thu'], 3: ['Mon', 'Wed', 'Fri'], 4: ['Mon', 'Tue', 'Thu', 'Fri'], 5: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 6: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

function run(intake) {
  const p = generate(intake, model);
  if (p.status !== 'ok') return { status: p.status, err: (p.errors || []).map(e => e.key).join(',') };
  const tc = p.time_check || {};
  const st = p.weeks.filter(w => w.block_type === 'stairway' && w.training_block === (p.shape.training_blocks.find(b => b.type === 'stairway') || {}).n);
  const trained = (tc.trained_groups || []).filter(g => GROUPS.includes(g));
  const below = (tc.trained_below_floor || []).map(x => x.group);
  const first = st[0], last = st[st.length - 1];
  const sum = (w) => trained.reduce((a, g) => a + (w ? w.main_sets_by_group[g] || 0 : 0), 0);
  let flat = 0, tr = 0;
  for (const g of trained) for (let i = 1; i < st.length; i++) { tr++; if ((st[i].main_sets_by_group[g] || 0) - (st[i - 1].main_sets_by_group[g] || 0) < 0.5) flat++; }
  const mains = p.weeks.filter(w => !w.test).flatMap(w => w.days.filter(d => d.kind === 'main'));
  const over = mains.filter(d => d.est_minutes > d.minutes_limit).length;
  const maxRatio = Math.max(...mains.map(d => d.est_minutes / d.minutes_limit));
  return { trained: trained.length, trainedList: trained.join(','), below: below.join(',') || '-', w1: Math.round(sum(first)), peak: Math.round(sum(last)), flatPct: tr ? Math.round(100 * flat / tr) : null, over, maxRatio: maxRatio.toFixed(2), fits: tc.fits };
}

const files = fs.readdirSync(path.join(SNAP, 'intakes')).filter(x => x.endsWith('.json')).sort();
const rows = [];
for (const file of files) {
  const base = JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', file), 'utf8'));
  const name = file.replace('.json', '');
  const d0 = base.schedule.days_per_week;
  for (const days of [d0, d0 + 1].filter(d => d <= 6)) {
    for (const minutes of [30, 45, 60, 75, 90, 105, 120]) {
      const intake = JSON.parse(JSON.stringify(base));
      intake.schedule.session_minutes = minutes;
      if (days !== d0) {
        intake.schedule.days_per_week = days;
        const play = new Set(((intake.activity && intake.activity.play_days) || []).concat((intake.sport && intake.sport.play_days) || []));
        const cand = (DAYSETS[days] || WD.slice(0, days)).filter(x => !play.has(x));
        const fill = WD.filter(x => !play.has(x) && !cand.includes(x));
        intake.schedule.weekdays = [...cand, ...fill].slice(0, days).sort((a, b) => WD.indexOf(a) - WD.indexOf(b));
      }
      let r;
      try { r = run(intake); } catch (e) { r = { status: 'throw', err: String(e.message || e).slice(0, 80) }; }
      rows.push({ name, days, minutes, ...r });
    }
  }
}
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
fs.writeFileSync(path.join(HERE, 'out', 'sweep_minutes.json'), JSON.stringify(rows, null, 1));
// print and flag non-monotone steps (same days, minutes up)
let prev = null;
console.log('| Sample | Days x min | Trained groups | Trained list | Below floor | Sets wk1 -> peak (trained) | Flat % | Days over limit | Max day / limit |');
console.log('|---|---|---|---|---|---|---|---|---|');
const flags = [];
for (const r of rows) {
  if (r.status) { console.log(`| ${r.name} | ${r.days} x ${r.minutes} | ${r.status} ${r.err || ''} | | | | | | |`); prev = null; continue; }
  if (prev && prev.name === r.name && prev.days === r.days && !prev.status) {
    if (r.trained < prev.trained) flags.push(`${r.name} ${r.days}d: ${prev.minutes} -> ${r.minutes} min trains FEWER groups (${prev.trainedList} -> ${r.trainedList})`);
    else if (r.peak < prev.peak) flags.push(`${r.name} ${r.days}d: ${prev.minutes} -> ${r.minutes} min plans a LOWER peak (${prev.peak} -> ${r.peak}) with ${prev.trained} -> ${r.trained} groups`);
    if (r.below.split(',').filter(x => x !== '-').length > prev.below.split(',').filter(x => x !== '-').length) flags.push(`${r.name} ${r.days}d: ${prev.minutes} -> ${r.minutes} min leaves MORE groups below the floor (${prev.below} -> ${r.below})`);
  }
  console.log(`| ${r.name} | ${r.days} x ${r.minutes} | ${r.trained} | ${r.trainedList} | ${r.below} | ${r.w1} -> ${r.peak} | ${r.flatPct}% | ${r.over} | ${r.maxRatio} |`);
  prev = r;
}
console.log('\nNon-monotone steps:\n' + flags.map(x => '- ' + x).join('\n'));
