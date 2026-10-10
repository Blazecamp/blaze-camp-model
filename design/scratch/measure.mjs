// design/scratch/measure.mjs - dosing diagnosis harness (read-only on the engine).
// Generates the 8 sample plans IN MEMORY from a frozen snapshot of engine/ + model/ (design/scratch/snap, copied 2026-10-09 20:33
// while another workflow was editing engine/) and measures what the coach reviews grade: weekly sets per group, floor misses, flat
// weeks, ceilings, weekly rises, minutes per day vs the chosen minutes (engine estimate AND an independent re-estimate from the
// printed doses), exercises per day, the 2-4 rule, athletic budget vs delivered. Never writes outside design/.
//
//   node design/scratch/measure.mjs [--live]      (--live: import the live engine/ + model/ instead of the snapshot)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LIVE = process.argv.includes('--live');
const SNAP = path.join(HERE, 'snap');
const ENG = LIVE ? path.join(ROOT, 'engine') : path.join(SNAP, 'engine');
const MOD = LIVE ? path.join(ROOT, 'model') : path.join(SNAP, 'model');
const INT = LIVE ? path.join(ROOT, 'samples', 'intakes') : path.join(SNAP, 'intakes');
const OUT = path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });

const { loadModel } = await import(pathToFileURL(path.join(ENG, 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(ENG, 'generate.mjs')).href);

function readModelDir(dir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  const f = manifest.files;
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
  const review = f.i18n.es_review && fs.existsSync(path.join(dir, f.i18n.es_review)) ? read(f.i18n.es_review) : { missing_keys: [], machine_translated: [] };
  return { manifest, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: review } };
}
const model = loadModel(readModelDir(MOD));
const R = model.rules;

const GROUPS = ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves'];
const LEVEL_CAP = { L1: 14, L2: 22, L3: 25 };
const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const mid = (a, b) => (a + b) / 2;

// ------------------------------------------------------------------ independent minutes from the PRINTED doses
// Coach model: sets x (work + rest) + changeovers (05 §7.4 / 12 §3.10). Work per set from the printed reps (3.5 s a rep, both sides
// for per-side / unilateral sets), rest = the printed rest midpoint (seconds) - so a mismatch with the engine's own estimate shows
// where the planning time model and the dose disagree. Athletic / Olympic / throw / sprint stations use the engine's time-model
// constants (their printed 'rest' is a work:rest ratio or 'as prescribed'). Warm-up 8 min; changeover 1 min an exercise (0.5 in a pair).
const TM = R.time_model;
const SEC_PER_REP = Number(process.env.SPR || 3.5);
function workSecOf(it) {
  const r = it.reps || {};
  const uni = it.laterality === 'unilateral' || it.laterality === 'alternating';
  switch (r.type) {
    case 'range': case 'fixed': { const reps = r.type === 'range' ? mid(r.min, r.max) : r.value; return reps * SEC_PER_REP * (uni ? 2 : 1); }
    case 'per_side': return mid(r.min, r.max) * SEC_PER_REP * 2;
    case 'seconds': return mid(r.min, r.max) * (uni ? 2 : 1);
    case 'test': return null;
    default: return null;
  }
}
function restSecOf(it) {
  const r = it.rest || {};
  if (r.type === 'seconds' || r.type === 'after_pair') return mid(r.min, r.max);
  return null;
}
const TC_BY_BUCKET = { AP_PLYO: 'plyo_or_ballistic', AP_JUMP_LIMITED_KNEE: 'ankle', AP_THROW: 'throw', AP_COD: 'cod', AP_SPRINT: 'sprint', AP_TRIPLE_EXT: 'olympic' };
function engineSetMin(it) {
  const tc = TC_BY_BUCKET[it.bucket] || (it.role === 'prehab' ? 'prehab' : 'isolation');
  return TM.work_minutes[tc] + TM.rest_class_minutes[TM.rest_class_by_time_class[tc]];
}
function independentMinutes(day, ws) {
  let t = 0;
  const items = day.blocks.flatMap(b => b.items.map(it => ({ it, bk: b.kind })));
  if (items.some(x => x.it.role === 'warmup')) t += TM.minutes_per_set.warmup_session;
  const pairs = new Map();
  for (const { it, bk } of items) {
    if (it.role === 'warmup') continue;
    if (it.role === 'skill') { t += it.reps && it.reps.type === 'minutes' ? it.reps.min : 6; continue; }
    if (it.aerobic || it.bucket === 'COND_AEROBIC') {
      const pos = it.aerobic && it.aerobic.position;
      if (day.kind === 'aerobic' || pos !== 'separate_session') t += it.reps && it.reps.type === 'minutes' ? mid(it.reps.min, it.reps.max) : 20;
      continue;
    }
    if (it.wod) { t += Array.isArray(it.wod.minutes) ? mid(it.wod.minutes[0], it.wod.minutes[1]) : 15; continue; }
    if (it.circuit) continue; // circuits below
    if (it.role === 'test' || (it.test && it.reps && it.reps.type === 'test')) { t += TM.test_workup_minutes; continue; }
    if (it.bucket === 'TEST') { t += 8; continue; }
    if (typeof it.sets !== 'number' || it.sets <= 0) continue;
    let w = workSecOf(it), rest = restSecOf(it);
    let setMin;
    if (TC_BY_BUCKET[it.bucket] || w === null || rest === null) { setMin = engineSetMin(it); w = null; }
    const id = it.superset;
    if (id) { if (!pairs.has(id)) pairs.set(id, []); pairs.get(id).push({ sets: it.sets, w: w !== null ? w / 60 : setMin * 0.3, rest: rest !== null ? rest / 60 : setMin * 0.7 }); continue; }
    t += it.sets * (w !== null ? (w + rest) / 60 : setMin) + TM.changeover_min_per_exercise;
  }
  for (const ms of pairs.values()) {
    if (ms.length === 1) { const m = ms[0]; t += m.sets * (m.w + m.rest) + TM.changeover_min_per_exercise; continue; }
    const rounds = Math.max(...ms.map(m => m.sets));
    for (let k = 1; k <= rounds; k++) { const act = ms.filter(m => m.sets >= k); t += act.reduce((a, m) => a + m.w, 0) + Math.max(...act.map(m => m.rest)); }
    t += TM.changeover_in_superset_pair * ms.length;
  }
  // circuits: rounds x stations x (work + transition) + rest between rounds; 1 min between circuits
  const circBlocks = day.blocks.filter(b => b.kind === 'circuit');
  for (const b of circBlocks) {
    const st = b.items.filter(it => it.circuit);
    if (!st.length) continue;
    const c = st[0].circuit;
    const between = (st[0].rest && st[0].rest.between_rounds_s) || TM.circuit.between_rounds_s;
    t += c.rounds * st.length * (c.work_s + (c.transition_s || 15)) / 60 + (c.rounds - 1) * between / 60;
  }
  if (circBlocks.length > 1) t += (circBlocks.length - 1) * (TM.between_circuits_s || 60) / 60;
  void ws;
  return t;
}

// ------------------------------------------------------------------ per-plan measurement
const RES_ROLES = new Set(['work', 'paired_upper', 'iso', 'focus', 'secondary', 'bonus', 'circuit_station']);
function measure(name, intake) {
  const t0 = process.hrtime.bigint();
  const plan = generate(intake, model);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const meta = plan.meta || {};
  const tc = plan.time_check || {};
  const level = meta.level && meta.level.client;
  const out = {
    name, status: plan.status, ms: Math.round(ms),
    days: meta.days_per_week, minutes: meta.session_minutes, level, family: meta.family, template: meta.template && meta.template.id,
    weeks_total: plan.weeks.length,
    blocks: (plan.shape.training_blocks || []).map(b => ({ n: b.n, type: b.type, weeks: b.weeks, stair_N: b.stair_N })),
    time_check: { fits: tc.fits, trained: tc.trained_groups, not_trained: tc.not_trained_directly, below_floor: tc.trained_below_floor, lowered_peak: tc.lowered_peak, needed_minutes: tc.needed_minutes, offered: tc.offered, blocks_off: tc.blocks_off },
    offers: plan.offers,
    stairway_meta: meta.stairway,
    validation_failed: (plan.validation.checks || []).filter(c => !c.pass).map(c => ({ id: c.id, severity: c.severity, n: (c.violations || []).length, first: (c.violations || []).slice(0, 3) })),
    warnings: (meta.warnings || []).map(w => w.key)
  };
  // ---- the stairway weeks (per training block)
  const byBlock = {};
  for (const w of plan.weeks) if (w.block_type === 'stairway') (byBlock[w.training_block] = byBlock[w.training_block] || []).push(w);
  const tcBy = new Map(((tc.by_block) || []).map(b => [b.training_block, b]));
  out.stair = [];
  for (const [tbN, ws] of Object.entries(byBlock)) {
    const tcb = tcBy.get(Number(tbN)) || tc;
    const trained = (tcb.trained_groups || tc.trained_groups || []).filter(g => GROUPS.includes(g));
    const belowAllowed = new Set((tcb.trained_below_floor || []).map(x => x.group));
    const testWeeks = ws.filter(w => w.test).map(w => w.n);
    const grp = {}; const grpAll = {};
    for (const g of GROUPS) { grp[g] = ws.map(w => r2(w.main_sets_by_group[g] || 0)); grpAll[g] = ws.map(w => r2(w.weekly_sets_by_group[g] || 0)); }
    const totalMain = ws.map(w => w.total_main_sets);
    const totalAll = ws.map(w => w.total_resistance_sets);
    const rises = totalMain.slice(1).map((v, i) => r2(100 * (v - totalMain[i]) / totalMain[i]));
    const legDays = (w) => w.days.filter(d => d.kind === 'main' && d.blocks.some(b => b.items.some(it => it.bucket === 'ISO_CALF' && it.sets > 0))).length;
    const perGroup = {};
    for (const g of trained) {
      const s = grp[g];
      const floor = g === 'calves' ? Math.min(10, 3 * legDays(ws[0])) : 10;
      const floorMiss = s.filter(v => v < floor - 1e-6).length;
      let flat = 0, drops = 0, longest = 0, run = 0;
      for (let i = 1; i < s.length; i++) {
        const d = s[i] - s[i - 1];
        if (d < -1e-6) drops++;
        if (d < 0.5 - 1e-6) { flat++; run++; longest = Math.max(longest, run); } else run = 0;
      }
      const first = s[0], last = s[s.length - 1];
      const peakWeek = s.indexOf(Math.max(...s)) + 1;
      const firstAtLast = s.findIndex(v => v >= last - 1e-6) + 1;
      perGroup[g] = { sets: s, all_days: grpAll[g], floor, floor_miss_weeks: floorMiss, below_floor_declared: belowAllowed.has(g), flat_transitions: flat, transitions: s.length - 1, longest_flat_run: longest, drops, first, last, growth: r2(last / Math.max(first, 1e-9)), reaches_last_value_in_week: firstAtLast, peak_week: peakWeek };
    }
    out.stair.push({ training_block: Number(tbN), weeks: ws.map(w => w.n), test_weeks: testWeeks, trained, total_main: totalMain, total_all: totalAll, rise_pct: rises, groups: perGroup, untrained_sets_main: Object.fromEntries(GROUPS.filter(g => !trained.includes(g)).map(g => [g, grp[g]])) });
  }
  // ---- days: minutes, exercises, groups per day
  out.days_report = [];
  for (const w of plan.weeks) {
    for (const d of w.days) {
      const items = d.blocks.flatMap(b => b.items.map(it => ({ ...it, _bk: b.kind })));
      const ex = items.filter(it => it.exercise_id && it.role !== 'warmup' && it.role !== 'test' && !it.aerobic && it.bucket !== 'COND_AEROBIC' && it.role !== 'skill');
      const core = ex.filter(it => it.role === 'core_block').length;
      const athletic = ex.filter(it => ['athletic', 'power'].includes(it._bk) || TC_BY_BUCKET[it.bucket]).length;
      const res = ex.filter(it => RES_ROLES.has(it.role) || ['strength', 'accessories', 'focus'].includes(it._bk) && it.role !== 'prehab' && !TC_BY_BUCKET[it.bucket] && it.role !== 'core_block').length;
      const prehab = ex.filter(it => it.role === 'prehab').length;
      const nonCore = ex.length - core;
      const groups = d.groups || {};
      const ones = Object.entries(groups).filter(([g, n]) => n === 1 && g !== 'calves').map(([g]) => g);
      const overFour = Object.entries(groups).filter(([g, n]) => n > 4).map(([g]) => g);
      const ind = independentMinutes(d, w);
      out.days_report.push({ week: w.n, test: !!w.test, block_type: w.block_type, weekday: d.weekday, kind: d.kind, optional: d.optional, limit: d.minutes_limit, est: d.est_minutes, indep: r1(ind), exercises_total: nonCore, core, athletic, resistance: res, prehab, groups, one_exercise_groups: ones, over_four_groups: overFour });
    }
  }
  // ---- athletic budget vs delivered (stairway + all weeks)
  out.athletic = plan.weeks.map(w => {
    const a = w.athletic_budget;
    if (!a || !a.targets) return null;
    const keys = Object.keys(a.targets).filter(k => (a.targets[k] || 0) > 0 || (a.planned && a.planned[k] > 0));
    const row = { week: w.n, block_type: w.block_type, test: !!w.test };
    for (const k of keys) row[k] = { target: a.targets[k], planned: a.planned ? a.planned[k] : null, goal: a.goals ? a.goals[k] ?? null : null };
    row.planned_share = a.planned_share; row.share_target = a.plyo_share;
    return row;
  }).filter(Boolean);
  // ---- exercise churn inside an exercise block (slot -> exercise ids)
  const churn = [];
  const ebOf = new Map(plan.weeks.map(w => [w.n, w.exercise_block]));
  const seen = new Map();
  for (const w of plan.weeks) for (const d of w.days) for (const b of d.blocks) for (const it of b.items) {
    if (!it.exercise_id || it.role === 'test' || it.role === 'warmup') continue;
    const k = ebOf.get(w.n) + '|' + it.slot_id;
    if (!seen.has(k)) seen.set(k, { ids: new Set(), weeks: new Set() });
    seen.get(k).ids.add(it.exercise_id); seen.get(k).weeks.add(w.n);
  }
  for (const [k, v] of seen) if (v.ids.size > 1) churn.push({ key: k, ids: [...v.ids] });
  out.exercise_changes_inside_block = churn.length;
  out.exercise_changes_examples = churn.slice(0, 5);
  // presence of slots for only part of an exercise block (added mid block or removed mid block)
  const ebWeeks = {};
  for (const w of plan.weeks) (ebWeeks[w.exercise_block] = ebWeeks[w.exercise_block] || []).push(w.n);
  let partial = 0; const partialEx = [];
  for (const [k, v] of seen) { const eb = Number(k.split('|')[0]); if (v.weeks.size < ebWeeks[eb].length) { partial++; if (partialEx.length < 6) partialEx.push({ slot: k, weeks: [...v.weeks].sort((a, b) => a - b), block_weeks: ebWeeks[eb] }); } }
  out.slots_partial_in_block = partial;
  out.slots_partial_examples = partialEx;
  return { out, plan };
}

const files = fs.readdirSync(INT).filter(f => f.endsWith('.json')).sort();
const all = [];
for (const f of files) {
  const intake = JSON.parse(fs.readFileSync(path.join(INT, f), 'utf8'));
  try {
    const { out } = measure(f.replace(/\.json$/, ''), intake);
    all.push(out);
  } catch (e) {
    all.push({ name: f, error: String(e && e.stack || e) });
  }
}
fs.writeFileSync(path.join(OUT, (LIVE ? 'measure.live' : 'measure') + (process.env.SPR ? '.spr' + process.env.SPR : '') + '.json'), JSON.stringify(all, null, 1));
console.log('model', model.version, 'engine', LIVE ? 'live' : 'snapshot', 'plans', all.length);
for (const o of all) {
  if (o.error) { console.log(o.name, 'ERROR', o.error.split('\n')[0]); continue; }
  console.log(`${o.name}: ${o.days}x${o.minutes} ${o.level} ${o.family} ${o.ms}ms fits=${o.time_check.fits} trained=${(o.time_check.trained || []).join(',')} failed=${o.validation_failed.map(v => v.id + ':' + v.severity).join(',')}`);
}
