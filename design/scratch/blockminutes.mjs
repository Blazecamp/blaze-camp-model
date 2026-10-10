// minutes per block kind on main days (engine time-model constants per set, as the volume engine costs them; pairs share rest)
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL, fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const SNAP = path.join(HERE, 'snap');
const { loadModel } = await import(pathToFileURL(path.join(SNAP, 'engine', 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(SNAP, 'engine', 'generate.mjs')).href);
const dir = path.join(SNAP, 'model'); const mf = JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')); const f = mf.files; const read=(r)=>JSON.parse(fs.readFileSync(path.join(dir,r),'utf8'));
const model = loadModel({ manifest: mf, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } });
const T = model.rules.time_model;
const TCB = { AP_PLYO: 'plyo_or_ballistic', AP_JUMP_LIMITED_KNEE: 'ankle', AP_THROW: 'throw', AP_COD: 'cod', AP_SPRINT: 'sprint', AP_TRIPLE_EXT: 'olympic' };
function costOf(it) {
  let tc; try { tc = model.bucket(it.bucket).time_class; } catch { tc = null; }
  if (TCB[it.bucket]) tc = TCB[it.bucket];
  if (it.role === 'prehab') tc = 'prehab';
  if (it.role === 'core_block') tc = 'core_set';
  const uni = it.laterality === 'unilateral' || it.laterality === 'alternating';
  if (uni && tc === 'compound_bilateral') tc = 'compound_unilateral'; else if (uni && tc === 'isolation') tc = 'isolation_unilateral';
  tc = tc && T.work_minutes[tc] !== undefined ? tc : 'isolation';
  const rc = it.rest && it.rest.type === 'seconds' && it.rest.min >= 180 ? 'strength' : T.rest_class_by_time_class[tc];
  return { work: T.work_minutes[tc], rest: T.rest_class_minutes[rc] };
}
const files = fs.readdirSync(path.join(SNAP, 'intakes')).filter(x => x.endsWith('.json')).sort();
console.log('| Sample | Limit | Week | Warm-up | Core | Athletic | Power | Prehab | Skill / WOD / circuit / aerobic | Resistance | Total (est.) | Resistance share |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const file of files) {
  const p = generate(JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', file), 'utf8')), model);
  const st = p.weeks.filter(w => w.block_type === 'stairway' && w.training_block === 1);
  const pick = st.length ? [st[0], st[st.length - 2] || st[st.length - 1]] : [p.weeks[0]];
  for (const w of pick) {
    const mains = w.days.filter(d => d.kind === 'main');
    const acc = {};
    for (const d of mains) {
      const add = (k, v) => { acc[k] = (acc[k] || 0) + v / mains.length; };
      const pairs = new Map();
      for (const b of d.blocks) for (const it of b.items) {
        const kind = ['warmup'].includes(b.kind) ? 'warmup' : b.kind === 'core' ? 'core' : b.kind === 'athletic' ? 'athletic' : b.kind === 'power' ? 'power' : b.kind === 'prehab' || it.role === 'prehab' ? 'prehab' : ['strength', 'accessories', 'focus'].includes(b.kind) ? 'res' : 'other';
        if (it.role === 'warmup') { if (it.bucket === 'WARMUP_GENERAL') add('warmup', T.minutes_per_set.warmup_session); continue; }
        if (it.role === 'skill') { add('other', it.reps && it.reps.type === 'minutes' ? it.reps.min : 6); continue; }
        if (it.aerobic) { if (it.aerobic.position !== 'separate_session') add('other', T.aerobic_addon_minutes[it.aerobic.colour] || 0); continue; }
        if (it.wod) { add('other', it.wod.minutes ? (it.wod.minutes[0] + it.wod.minutes[1]) / 2 : 15); continue; }
        if (it.circuit) { add('other', it.sets * (it.circuit.work_s + it.circuit.transition_s) / 60); continue; }
        if (it.role === 'test') { add(kind, T.test_workup_minutes); continue; }
        if (typeof it.sets !== 'number' || it.sets <= 0) continue;
        const c = costOf(it);
        if (it.superset) { if (!pairs.has(it.superset)) pairs.set(it.superset, []); pairs.get(it.superset).push({ ...c, sets: it.sets, kind }); continue; }
        add(kind, it.sets * (c.work + c.rest) + T.changeover_min_per_exercise);
      }
      for (const ms of pairs.values()) {
        const rounds = Math.max(...ms.map(m => m.sets)); let t = 0;
        for (let k = 1; k <= rounds; k++) { const a = ms.filter(m => m.sets >= k); t += a.reduce((x, m) => x + m.work, 0) + Math.max(...a.map(m => m.rest)); }
        t += T.changeover_in_superset_pair * ms.length;
        const tot = ms.reduce((x, m) => x + m.sets, 0);
        for (const m of ms) add(m.kind, t * m.sets / tot);
      }
    }
    const tot = Object.values(acc).reduce((a, b) => a + b, 0);
    const r = (k) => (acc[k] || 0).toFixed(1);
    console.log(`| ${file.replace('.json', '')} | ${p.meta.session_minutes} | ${w.n}${w.test ? ' (test)' : ''} | ${r('warmup')} | ${r('core')} | ${r('athletic')} | ${r('power')} | ${r('prehab')} | ${r('other')} | ${r('res')} | ${tot.toFixed(1)} | ${Math.round(100 * (acc.res || 0) / tot)}% |`);
  }
}
