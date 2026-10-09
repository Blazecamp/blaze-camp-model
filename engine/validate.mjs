// engine/validate.mjs - plan validation (engine/CONTRACTS.md §4.9, §6). Owner: B4.
// Pure: reads only the plan and the model; recomputes credits, weekly sets, stairway steps and group counts on its own
// (an independent cross-check of B2 / B3, never a call into their modules). Every number / list comes from model.rules.
import { EPS, forbiddenKeys, canonicalJSON, clamp } from './util.mjs';

/** check ids in run order */
export const CHECK_IDS = Object.freeze([
  ...Array.from({ length: 29 }, (_, i) => 'V' + (i + 1)),
  ...Array.from({ length: 22 }, (_, i) => 'H' + String(i + 1).padStart(2, '0'))
]);

// Violation keys used to route sub-rules of a V-check to its H rule (CONTRACTS §6 last rows).
const K = {
  h02: 'check.h02_no_failure_heavy', h03: 'check.h03_power_before_strength', h04: 'check.h04_h_before_v',
  h05: 'check.h05_core_first', h08: 'check.h08_credits', h09: 'check.h09_athletic_no_credit', h12: 'check.h12_older_never',
  h13: 'check.h13_no_sex', h14: 'check.h14_i18n', h21: 'check.h21_stairway', h22: 'check.h22_no_checkin_no_change'
};
// V-check -> H-check routing: [source V id, violation-key filter or null for all]
const H_ROUTES = {
  H01: [['V9', null]], H02: [['V17', null]], H03: [['V12', K.h03]], H04: [['V12', K.h04]], H05: [['V12', K.h05], ['V18', K.h05]],
  H06: [['V11', null]], H07: [['V10', null]], H08: [['V14', K.h08]], H09: [['V14', K.h09]], H10: [['V15', null]], H11: [['V16', null]],
  H12: [['V5', K.h12]], H15: [['V24', null]], H16: [['V26', null]], H17: [['V22', null]], H18: [['V23', null]], H19: [['V25', null]],
  H20: [['V21', null]]
};
const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;
const VSQUAT_RE = /\bv[- ]?squat\b/i;
const RESISTANCE_KINDS = ['resistance', 'isolation', 'focus'];
const COMPOUND_CLASSES = ['BKD', 'BHD', 'HPUSH', 'VPUSH', 'HPULL', 'VPULL', 'DIPS', 'THRUSTER', 'PULLOVER'];
const UNI_COMPOUND_CLASSES = ['UKD', 'UHD'];
const BIG_ISO_CLASSES = ['GLUTE_ISO', 'LEG_EXTENSION', 'LEG_FLEXION', 'ISO_CHEST'];
const REAR_CLASSES = ['ISO_REAR', 'FACEPULL'];
const HV_PAIRS = [['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']];
// INFERRED (no rules table): implements a body-weight exercise may use besides the BODYWEIGHT kit (pull-up bar, dip bars,
// rings, suspension trainer) - for the "MAX on body-weight work" allowance of H02. Requested as rules.effort.max.bodyweight_tokens.
const BODYWEIGHT_EXTRA_TOKENS = ['pullup_bar', 'dip_bars', 'rings', 'trx'];

/**
 * @param {import('./util.mjs').Plan} plan
 * @param {import('./util.mjs').Model} model
 * @returns {{ok:boolean, checks:Array<{id:string, key:string, severity:'error'|'warn', pass:boolean,
 *            violations:Array<{where:{week?:number, weekday?:string, slot_id?:string}, key:string, args?:Object}>}>}}
 */
export function validatePlan(plan, model) {
  const c = context(plan, model);
  const out = {};
  const V = {
    V1: v1Safety, V2: v2Days, V3: v3ShortAthletes, V4: v4Youth, V5: v5Older, V6: v6Season, V7: v7NoEquipment, V8: v8Priorities,
    V9: v9Bands, V10: v10Spine, V11: v11Pairing, V12: v12Order, V13: v13Caps, V14: v14Counting, V15: v15Step, V16: v16Medball,
    V17: v17Effort, V18: v18Minimums, V19: v19Olympic, V20: v20VSquat, V21: v21Release, V22: v22Floor, V23: v23Groups,
    V24: v24Blocks, V25: v25Tests, V26: v26Inputs, V27: v27AthleticBudget, V28: v28LateralityShare, V29: v29PushPull
  };
  for (const id of Object.keys(V)) out[id] = c.ok || ['V1', 'V21', 'V26'].includes(id) ? V[id](c) : [];
  for (const [h, routes] of Object.entries(H_ROUTES)) out[h] = routes.flatMap(([v, key]) => out[v].filter(x => key === null || x.key === key));
  out.H13 = h13NoSex(c);
  out.H14 = h14I18n(c);
  out.H21 = c.ok ? h21Stairway(c) : [];
  out.H22 = c.ok ? h22NoCheckin(c) : [];

  const meta = {};
  for (const ch of model.rules.validation.checks) meta[ch.id] = { key: ch.key, severity: ch.severity };
  for (const ch of model.rules.validation.hard) meta[ch.id] = { key: ch.key, severity: 'error' };
  const checks = CHECK_IDS.map(id => {
    const violations = dedupe(out[id] || []);
    return { id, key: meta[id] ? meta[id].key : 'check.' + id.toLowerCase(), severity: meta[id] ? meta[id].severity : 'error', pass: violations.length === 0, violations };
  });
  return { ok: !checks.some(ch => ch.severity === 'error' && !ch.pass), checks };
}

/** exported for tests / tools: the planned stairway of one block (12 v1.1 §3.7.1, CONTRACTS §4.5) recomputed independently.
 * @param {{start:number, cap:number}} sc  @param {number} N  @param {{early_late:Object<string,number>, caps:number[], freeze:number, after_freeze:number|null}} o
 * @returns {{lambda:number, steps:number[], T:number[], capped:number[]}} steps[w] = planned step INTO week w (steps[1] = 0); capped = s'_w */
export function plannedStairway(sc, N, o) {
  const s = [0, 0];
  for (let w = 2; w <= N; w++) {
    let x = o.early_late[w];
    for (const cap of o.caps) x = Math.min(x, cap);
    if (o.freeze > 0 && w <= 1 + o.freeze) x = 0;
    else if (o.freeze > 0 && o.after_freeze !== null) x = Math.min(x, o.after_freeze);
    s.push(x);
  }
  const grow = (lam) => s.slice(2).reduce((acc, x) => acc * (1 + lam * x), sc.start);
  let lambda = 1;
  if (grow(1) > sc.cap + EPS) {
    let lo = 0, hi = 1;
    for (let i = 0; i < o.iterations; i++) {
      const mid = (lo + hi) / 2;
      if (grow(mid) > sc.cap) hi = mid; else lo = mid;
    }
    lambda = (lo + hi) / 2;
  }
  const steps = s.map(x => lambda * x);
  const T = [0, sc.start];
  for (let w = 2; w <= N; w++) T.push(Math.min(sc.cap, T[w - 1] * (1 + steps[w])));
  if (lambda < 1) T[N] = sc.cap;
  return { lambda, steps, T, capped: s };
}

// ---------------------------------------------------------------------------------------------------------------- context

function context(plan, model) {
  const R = model.rules;
  const meta = (plan && plan.meta) || {};
  const derived = meta.derived || {};
  const weeks = Array.isArray(plan && plan.weeks) ? plan.weeks : [];
  const exCache = new Map();
  const ex = (id) => {
    if (!id) return null;
    if (!exCache.has(id)) exCache.set(id, model.hasEx(id) ? model.ex(id) : null);
    return exCache.get(id);
  };
  const bucketDef = (b) => { try { return b ? model.bucket(b) : null; } catch { return null; } };
  const rows = [];
  const byDay = new Map();
  for (const w of weeks) for (const d of w.days || []) {
    const list = [];
    let idx = 0;
    (d.blocks || []).forEach((b, bi) => (b.items || []).forEach(it => {
      const r = { w, d, b, bi, it, idx: idx++, ex: ex(it.exercise_id), bd: bucketDef(it.bucket) };
      rows.push(r); list.push(r);
    }));
    byDay.set(w.n + '|' + d.weekday, list);
  }
  const tbs = (plan && plan.shape && plan.shape.training_blocks) || [];
  const warnings = Array.isArray(meta.warnings) ? meta.warnings : [];
  const age = typeof derived.age === 'number' ? derived.age : null;
  const prefs = derived.prefs || {};
  const c = {
    plan, model, R, meta, derived, weeks, rows, byDay, tbs, warnings, age, prefs, ex, bucketDef,
    ok: plan && plan.status === 'ok',
    targets: meta.targets || {},
    optIn: prefs.older_athletic_opt_in === true || meta.older_opt_in === true,
    family: meta.family || derived.D1_family || null,
    circuitPlan: weeks.some(w => !!w.circuit),
    hasWarning: (key, pred) => warnings.some(x => x && x.key === key && (!pred || pred(x.args || {}))),
    dayRows: (w, d) => byDay.get(w.n + '|' + d.weekday) || [],
    stairN: (w) => { const tb = tbs.find(t => t.n === w.training_block); return tb && tb.stair_N ? tb.stair_N : null; }
  };
  return c;
}

const where = (r) => ({ week: r.w.n, weekday: r.d.weekday, slot_id: r.it.slot_id });
const whereDay = (w, d) => ({ week: w.n, weekday: d.weekday });
const viol = (wh, key, args) => (args && Object.keys(args).length ? { where: wh || {}, key, args } : { where: wh || {}, key });
function dedupe(vs) {
  const seen = new Set();
  return vs.filter(v => { const k = canonicalJSON(v); if (seen.has(k)) return false; seen.add(k); return true; });
}
const isRes = (r) => !!r.ex && ((r.bd && RESISTANCE_KINDS.includes(r.bd.kind)) || r.it.origin === 'bonus');
function regionOf(r, R) {
  if (r.bd && r.bd.region) return r.bd.region;
  const m = r.ex && r.ex.primary_muscle;
  return m && R.muscles.defs[m] ? R.muscles.defs[m].region : null;
}
function groupOf(r, model) {
  if (r.it.group) return r.it.group;
  return r.ex && r.ex.primary_muscle ? model.groupOf(r.ex.primary_muscle) : null;
}
function repClassOf(r) {
  const bd = r.bd, ex = r.ex;
  if (!bd) return null;
  if (bd.kind === 'prehab') return 'prehab';
  if (ex && REAR_CLASSES.includes(ex.credit_class) && bd.kind !== 'resistance') return 'rear_delts';
  if (bd.kind === 'resistance' && ex) {
    if (ex.constraint >= 4) return 'machine_stable_compound';
    if (['unilateral', 'alternating'].includes(ex.laterality)) return 'unilateral_compound';
    return bd.rep_class;
  }
  if (bd.rep_class === 'by_exercise' || r.it.origin === 'bonus') return ex ? classFromCredit(ex) : bd.rep_class;
  return bd.rep_class;
}
function classFromCredit(ex) {
  const cc = ex.credit_class;
  if (COMPOUND_CLASSES.includes(cc)) return ex.constraint >= 4 ? 'machine_stable_compound' : (['unilateral', 'alternating'].includes(ex.laterality) ? 'unilateral_compound' : 'main_bilateral_compound');
  if (UNI_COMPOUND_CLASSES.includes(cc)) return 'unilateral_compound';
  if (BIG_ISO_CLASSES.includes(cc)) return 'big_muscle_isolation';
  if (REAR_CLASSES.includes(cc)) return 'rear_delts';
  if (cc === 'ISO_CALF') return 'calves';
  if (cc === 'CORE') return 'core';
  return 'small_muscle_isolation';
}
function isBodyweight(ex, c) {
  const tokens = [...c.R.equipment.profiles.BODYWEIGHT.kit, ...BODYWEIGHT_EXTRA_TOKENS];
  return c.model.kitAvailable(ex, { tokens, machines: [] });
}
function muscleList(v) {
  const arr = Array.isArray(v) ? v : String(v || '').split(/\s*,\s*/);
  return arr.filter(Boolean).map(x => String(x).replace(/^muscle\./, ''));
}
function stairwayWeeks(c, tb) { return c.weeks.filter(w => w.training_block === tb.n && w.block_type === 'stairway'); }

// ---------------------------------------------------------------------------------------------------------------- V-checks

function v1Safety(c) {
  const out = [], h = c.meta.health || {}, k = 'check.v1_safety';
  if (c.plan.status === 'refer') {
    if (!h.refer) out.push(viol({}, k, { rule: 'refer_status_without_health_refer' }));
    if (!c.plan.refer || !Array.isArray(c.plan.refer.reasons) || !c.plan.refer.reasons.length) out.push(viol({}, k, { rule: 'refer_without_reasons' }));
    if (c.weeks.length) out.push(viol({}, k, { rule: 'refer_plan_has_weeks' }));
  } else if (c.plan.status === 'ok') {
    if (h.refer) out.push(viol({}, k, { rule: 'health_refer_but_plan_ok' }));
    if ((h.reasons || []).length) out.push(viol({}, k, { rule: 'ok_plan_with_refer_reasons' }));
    if (h.health_route === 'coach_own_sop') {
      if (!h.bypass) out.push(viol({}, k, { rule: 'coach_own_sop_without_bypass' }));
      if (!c.hasWarning('warning.coach_bypass')) out.push(viol({}, k, { rule: 'coach_bypass_warning_missing' }));
    }
    if ((c.derived.pain || []).some(p => p && p.severity === 'severe')) out.push(viol({}, k, { rule: 'severe_pain_must_refer' }));
  }
  return out;
}

function v2Days(c) {
  const wd = c.meta.weekdays, n = c.meta.days_per_week;
  return Array.isArray(wd) && typeof n === 'number' && wd.length < n ? [viol({}, 'check.v2_days', { weekdays: wd.length, days: n })] : [];
}

function v3ShortAthletes(c) {
  return c.family === 'athletic' && c.meta.session_minutes <= 30 && !c.hasWarning('warning.v3_short_athletes')
    ? [viol({}, 'check.v3_short_athletes', { minutes: c.meta.session_minutes })] : [];
}

function v4Youth(c) {
  const R = c.R, out = [], k = 'check.v4_youth';
  if (c.age === null || c.age >= R.levels.youth_age) return out;
  const order = R.levels.ladder_order, maxIdx = order.indexOf(R.levels.youth_max_ladder);
  const count = (c.derived.previous_cycles && c.derived.previous_cycles.count) || 0;
  for (const r of c.rows) {
    if (!r.ex) continue;
    if (order.indexOf(r.ex.level) > maxIdx) out.push(viol(where(r), k, { rule: 'ladder', exercise: r.ex.id, level: r.ex.level }));
    if (r.ex.tags.includes('olympic_from_floor') && !(c.age >= R.population.youth.olympic_floor_min_age && r.ex.tags.includes('youth_floor_ok') && count >= 1)) out.push(viol(where(r), k, { rule: 'olympic_from_floor', exercise: r.ex.id }));
    const load = r.it.load;
    if (load && load.type === 'medball_lb' && r.ex.medball && R.medball.loads_lb[r.ex.medball.kind]) {
      const maxYouth = R.medball.loads_lb[r.ex.medball.kind][1] - R.medball.youth_older_minus_lb;
      if (load.max > maxYouth + EPS) out.push(viol(where(r), k, { rule: 'medball_youth_load', max: load.max, limit: maxYouth }));
    }
  }
  return out;
}

function v5Older(c) {
  const R = c.R, P = R.population.older, out = [], k = 'check.v5_older';
  const older = c.age !== null && c.age >= P.from_age;
  const injured = c.meta.constraint_band && c.meta.constraint_band.client_family === 'older_or_pain';
  if (!older && !injured) return out;
  const neverOlder = [...P.never_tags, ...P.never_tags_phase0_even_with_opt_in];
  const neverInjured = uniq([...P.never_tags, ...P.never_tags_phase0_even_with_opt_in]); // EQ-03 injured / high-volume (+ high drops, stricter)
  const checkEx = (e, wh, swap) => {
    if (!e) return;
    const tags = e.tags;
    if (older) {
      for (const t of neverOlder) if (tags.includes(t)) out.push(viol(wh, K.h12, { rule: 'older_never', tag: t, exercise: e.id, swap: swap ? 1 : 0 }));
      // C-11 / V5: landing drills stay allowed by default (the catalog marks every landing drill older_ok:false - CONTRACT_REQUESTS)
      const landing = e.athletic && e.athletic.quality === 'landing';
      if (!c.optIn && !e.older_ok && !landing) out.push(viol(wh, K.h12, { rule: 'older_default_excluded', exercise: e.id, swap: swap ? 1 : 0 }));
      if (c.optIn && !e.older_opt_in_ok) out.push(viol(wh, K.h12, { rule: 'older_opt_in_excluded', exercise: e.id, swap: swap ? 1 : 0 }));
    }
    if (injured) for (const t of neverInjured) if (tags.includes(t)) out.push(viol(wh, K.h12, { rule: 'injured_never', tag: t, exercise: e.id, swap: swap ? 1 : 0 }));
  };
  for (const r of c.rows) {
    checkEx(r.ex, where(r), false);
    for (const s of r.it.swaps || []) checkEx(c.ex(s), where(r), true);
    if (older && !c.optIn && r.ex) {
      const q = r.ex.athletic && r.ex.athletic.quality;
      if (q === 'plyometric' || q === 'olympic') out.push(viol(where(r), K.h12, { rule: 'older_no_power_without_opt_in', quality: q }));
      if (r.ex.tags.includes('loaded_jump')) out.push(viol(where(r), K.h12, { rule: 'older_no_loaded_jump' }));
      if (r.it.bucket === 'AP_PLYO' && q !== 'landing') out.push(viol(where(r), K.h12, { rule: 'older_plyo_landing_only', quality: q || 'none' }));
    }
  }
  if (older) {
    if (!c.hasWarning(P.warning_key)) out.push(viol({}, k, { rule: 'older_warning_missing' }));
    for (const w of c.weeks) for (const [m, s] of Object.entries(w.step_by_muscle || {})) if (typeof s === 'number' && s > P.step_cap + EPS) out.push(viol({ week: w.n }, k, { rule: 'older_step_cap', muscle: m, step: s }));
    for (const tb of c.tbs) {
      if (tb.type !== 'maintenance' || !tb.factor) continue;
      const f = typeof tb.factor === 'number' ? tb.factor : (typeof tb.factor.factor === 'number' ? tb.factor.factor : tb.factor.value);
      if (typeof f === 'number' && f < P.maintenance_floor - EPS) out.push(viol({}, k, { rule: 'older_maintenance_floor', factor: f }));
    }
  }
  return out;
}

function v6Season(c) {
  const out = [];
  if (c.weeks.some(w => ['pre_season', 'taper'].includes(w.block_type)) && !c.hasWarning('warning.v6_season')) out.push(viol({}, 'check.v6_season', { rule: 'pre_season_without_warning' }));
  if (c.weeks.some(w => w.block_type === 'in_season') && !c.hasWarning('warning.v6_in_season')) out.push(viol({}, 'check.v6_season', { rule: 'in_season_without_warning' }));
  return out;
}

function v7NoEquipment(c) {
  const bl = (c.meta.kit && c.meta.kit.buy_list) || [];
  return bl.length && !c.hasWarning('warning.v7_no_equipment') ? [viol({}, 'check.v7_no_equipment', { items: bl.join(',') })] : [];
}

function v8Priorities(c) {
  const pr = c.targets.priority || [];
  const max = c.R.volume.priority.max_muscles;
  const vt = c.R.volume.priority.intake_map.v_taper || [];
  // the intake choices when the plan carries them (Derived.priority_choices: v_taper = 1 choice); else infer from the muscles
  const choices = Array.isArray(c.derived.priority_choices) ? c.derived.priority_choices.length
    : (vt.length && vt.every(m => pr.includes(m)) ? pr.length - vt.length + 1 : pr.length);
  return choices > max ? [viol({}, 'check.v8_priorities', { count: choices, max })] : [];
}

function v9Bands(c) {
  const out = [], k = 'check.v9_bands', banned = c.R.equipment.banned_tokens;
  for (const r of c.rows) {
    if (r.it.exercise_id && BAND_RE.test(r.it.exercise_id)) out.push(viol(where(r), k, { id: r.it.exercise_id }));
    for (const s of r.it.swaps || []) if (BAND_RE.test(s)) out.push(viol(where(r), k, { swap: s }));
    if (r.it.name_key && BAND_RE.test(c.model.t('en', r.it.name_key))) out.push(viol(where(r), k, { name_key: r.it.name_key }));
  }
  for (const t of (c.meta.kit && c.meta.kit.tokens) || []) if (BAND_RE.test(t) || banned.includes(t)) out.push(viol({}, k, { token: t }));
  // id_aliases targets are checked at compile time (assertModel); the Model API exposes no alias table.
  return out;
}

function v10Spine(c) {
  const out = [], k = 'check.v10_spine', A = c.R.axial;
  for (const w of c.weeks) {
    const counted = { squat: [], hinge: [] };
    for (const r of c.rows.filter(x => x.w === w && x.ex && x.ex.axial)) {
      if (r.ex.tags.some(t => A.not_counted_tags.includes(t))) out.push(viol(where(r), k, { rule: 'never_counted_tag', exercise: r.ex.id }));
      else if (counted[r.ex.axial_pattern]) counted[r.ex.axial_pattern].push(r);
    }
    for (const [p, list] of Object.entries(counted)) if (list.length > (A.budget[p] ?? 1)) for (const r of list.slice(A.budget[p] ?? 1)) out.push(viol(where(r), k, { rule: 'budget', pattern: p, count: list.length }));
    if (A.never_same_day) for (const s of counted.squat) for (const h of counted.hinge) if (s.d.weekday === h.d.weekday) out.push(viol(where(h), k, { rule: 'same_day', squat: s.ex.id, hinge: h.ex.id }));
  }
  return out;
}

function v11Pairing(c) {
  const out = [], k = 'check.v11_pairing', P = c.R.pairing;
  const variant = c.meta.template && c.meta.template.variant;
  if (variant && P.not_for_variants.includes(variant)) return out;
  for (const w of c.weeks) for (const d of w.days || []) {
    if (d.kind !== 'main') continue;
    const groups = new Map();
    for (const r of c.dayRows(w, d)) if (r.it.superset && isRes(r)) {
      if (!groups.has(r.it.superset)) groups.set(r.it.superset, []);
      groups.get(r.it.superset).push(r);
    }
    for (const list of groups.values()) {
      const uppers = list.filter(r => [...P.hip_with, ...P.knee_with].includes(r.it.bucket));
      for (const L of list) {
        const need = P.hip_buckets.includes(L.it.bucket) ? P.hip_with : P.knee_buckets.includes(L.it.bucket) ? P.knee_with : null;
        if (!need) continue;
        for (const U of uppers) if (!need.includes(U.it.bucket)) out.push(viol(where(U), k, { lower: L.it.bucket, partner: U.it.bucket }));
      }
    }
  }
  return out;
}

function v12Order(c) {
  const out = [], O = c.R.ordering, order = O.block_order;
  const corePos = c.prefs.core_position || c.R.core_block.position_default;
  const priority = c.targets.priority || [];
  const isPriorityIso = (r) => !!r.ex && r.bd && ['isolation', 'focus'].includes(r.bd.kind) && priority.includes(r.ex.primary_muscle);
  for (const w of c.weeks) for (const d of w.days || []) {
    const rows = c.dayRows(w, d);
    if (!rows.length) continue;
    const blocks = d.blocks || [];
    // block order with the allowed overrides (core moved by the user, opening aerobic, priority small muscle first)
    const firstWork = blocks.findIndex(b => !['warmup', 'aerobic'].includes(b.kind));
    const seq = [];
    blocks.forEach((b, i) => {
      if (b.kind === 'core' && corePos !== 'start') return;
      if (b.kind === 'aerobic' && (firstWork === -1 || i < firstWork)) return;
      if (b.kind === 'accessories' && (b.items || []).length && rows.filter(r => r.b === b).every(isPriorityIso)) return;
      seq.push(b.kind);
    });
    let maxIdx = -1, maxKind = null;
    for (const kind of seq) {
      const i = order.indexOf(kind);
      if (i < 0) { out.push(viol(whereDay(w, d), 'check.v12_order', { rule: 'unknown_block', block: kind })); continue; }
      if (i < maxIdx) {
        const powerAfterStrength = ['athletic', 'power'].includes(kind) && order.indexOf(maxKind) >= order.indexOf('strength');
        out.push(viol(whereDay(w, d), powerAfterStrength ? K.h03 : 'check.v12_order', { rule: 'block_order', block: kind, after: maxKind }));
      }
      if (i > maxIdx) { maxIdx = i; maxKind = kind; }
    }
    // power before strength, athletic before Olympic (item level)
    const firstStrength = rows.find(r => r.b.kind === 'strength');
    if (firstStrength) for (const r of rows) if (['athletic', 'power'].includes(r.b.kind) && r.idx > firstStrength.idx) out.push(viol(where(r), K.h03, { rule: 'power_after_strength' }));
    const firstPower = rows.find(r => r.b.kind === 'power');
    if (firstPower) for (const r of rows) if (r.b.kind === 'athletic' && r.idx > firstPower.idx) out.push(viol(where(r), K.h03, { rule: 'athletic_after_olympic' }));
    // horizontal before vertical (D-30: exempt when the vertical item is the work)
    for (const [hb, vb] of HV_PAIRS) {
      const h = rows.find(r => r.it.bucket === hb), v = rows.find(r => r.it.bucket === vb);
      if (h && v && v.idx < h.idx && v.it.role !== 'work') out.push(viol(where(v), K.h04, { horizontal: hb, vertical: vb }));
    }
    // the work first (or the moved priority isolation)
    const strength = rows.filter(r => r.b.kind === 'strength');
    const conjugate = c.R.session.exercises_per_group.exempt_families.includes(c.family); // conjugate days stay as written
    if (!conjugate && strength.some(r => r.it.role === 'work') && strength[0].it.role !== 'work' && !isPriorityIso(strength[0])) out.push(viol(where(strength[0]), 'check.v12_order', { rule: 'work_first', role: strength[0].it.role || 'none' }));
    // bilateral before unilateral (lower region) unless the unilateral lift is the work; days without a work lift are
    // written in the coach's order (e.g. hybrid_crossfit.5 FRI: single-leg hinge, then a non-axial hinge)
    const bi = rows.find(r => ['RP_BKD', 'RP_BHD'].includes(r.it.bucket)), uni = rows.find(r => ['RP_UKD', 'RP_UHD'].includes(r.it.bucket));
    if (bi && uni && uni.idx < bi.idx && uni.it.role !== 'work' && strength.some(r => r.it.role === 'work')) out.push(viol(where(uni), 'check.v12_order', { rule: 'bilateral_before_unilateral' }));
    // MYO only on the day's last resistance item
    const res = rows.filter(isRes);
    const lastRes = res.length ? res[res.length - 1] : null;
    for (const r of rows) if (r.it.effort && r.it.effort.last_set === 'myo' && r !== lastRes) out.push(viol(where(r), 'check.v12_order', { rule: 'myo_not_last' }));
    // core first after the warm-up (and an opening aerobic block)
    const coreIdx = blocks.findIndex(b => b.kind === 'core');
    if (corePos === 'start' && coreIdx > 0 && blocks.slice(0, coreIdx).some(b => !['warmup', 'aerobic'].includes(b.kind))) out.push(viol(whereDay(w, d), K.h05, { rule: 'core_not_first' }));
  }
  return out;
}

function v13Caps(c) {
  const out = [], S = c.R.session, k = 'check.v13_caps';
  const capFor = (min) => {
    const keys = Object.keys(S.exercise_cap_by_minutes).map(Number).sort((a, b) => a - b);
    let key = keys[0];
    for (const x of keys) if (x <= min) key = x;
    return S.exercise_cap_by_minutes[String(key)];
  };
  for (const w of c.weeks) for (const d of w.days || []) {
    const rows = c.dayRows(w, d).filter(r => !S.outside_cap_blocks.includes(r.b.kind));
    let count = rows.length;
    if (S.small_iso_superset_counts_as_one) {
      const groups = new Map();
      for (const r of rows) if (r.it.superset && r.bd && r.bd.kind === 'isolation' && r.ex && r.ex.primary_muscle && c.R.muscles.defs[r.ex.primary_muscle] && c.R.muscles.defs[r.ex.primary_muscle].class === 'small') groups.set(r.it.superset, (groups.get(r.it.superset) || 0) + 1);
      for (const n of groups.values()) if (n >= 2) count -= n - 1;
    }
    const minutes = typeof d.minutes_limit === 'number' ? d.minutes_limit : c.meta.session_minutes;
    // D-34: when the cut order cannot go further (never below 2 per group, never-cut roles) the day is kept and carries
    // warning.long_day - an over-cap day with that warning is the contract's answer, not an error.
    const warned = ['warning.long_day', 'warning.long_day_optional'].some(key => c.hasWarning(key, a => a.day === d.weekday || a.day === 'weekday.' + d.weekday));
    if (d.full_body === false && ['main', 'optional'].includes(d.kind) && count > capFor(minutes) && !warned) out.push(viol(whereDay(w, d), k, { rule: 'split_day_cap', count, cap: capFor(minutes) }));
    if (c.family === 'athletic' && count > S.athlete_cap && !warned) out.push(viol(whereDay(w, d), k, { rule: 'athlete_cap', count, cap: S.athlete_cap }));
    if (typeof d.est_minutes === 'number' && typeof minutes === 'number' && d.est_minutes > minutes * S.long_day.warn_above_factor + EPS && !warned) out.push(viol(whereDay(w, d), k, { rule: 'long_day_without_warning', min: d.est_minutes, limit: minutes }));
  }
  return out;
}

function v14Counting(c) {
  const out = [], C = c.R.credit;
  for (const r of c.rows) {
    if (!r.ex) {
      if (r.it.credits && Object.keys(r.it.credits).length) out.push(viol(where(r), K.h08, { rule: 'credits_without_exercise' }));
      continue;
    }
    let expected = c.model.credits(r.ex, r.it.bucket);
    if (r.ex.tags.some(t => C.never_credit_tags.includes(t))) expected = {};
    const got = r.it.credits || {};
    if (canonicalJSON(got) !== canonicalJSON(expected)) out.push(viol(where(r), Object.keys(expected).length ? K.h08 : K.h09, { rule: 'credits_mismatch', exercise: r.ex.id, bucket: r.it.bucket }));
    for (const [m, v] of Object.entries(got)) {
      const ok = v === 1 || v === C.helper || (r.ex.credit_class === 'DIPS' && v === 0.5) || (r.ex.credit_class === 'THRUSTER' && m === 'front_delts' && v === 0.5);
      if (!ok) out.push(viol(where(r), K.h08, { rule: 'credit_value', muscle: m, value: v }));
    }
    if (isRes(r) && !(Number.isInteger(r.it.sets) && r.it.sets >= 1)) out.push(viol(where(r), 'check.v14_counting', { rule: 'resistance_item_without_sets' }));
  }
  for (const w of c.weeks) {
    const sum = {};
    for (const r of c.rows.filter(x => x.w === w)) for (const [m, v] of Object.entries(r.it.credits || {})) sum[m] = (sum[m] || 0) + (typeof r.it.sets === 'number' ? r.it.sets : 0) * v;
    const claimed = w.weekly_sets_by_muscle || {};
    for (const m of new Set([...Object.keys(sum), ...Object.keys(claimed)])) {
      const a = Math.round((sum[m] || 0) * 100) / 100, b = typeof claimed[m] === 'number' ? claimed[m] : 0;
      if (Math.abs(a - b) > 0.001 + EPS) out.push(viol({ week: w.n }, K.h08, { rule: 'weekly_sets_mismatch', muscle: m, recomputed: a, claimed: b }));
    }
  }
  return out;
}

function v15Step(c) {
  const out = [], k = 'check.v15_step', L = c.R.stairway.limits;
  for (const w of c.weeks) for (const [m, s] of Object.entries(w.step_by_muscle || {})) if (typeof s === 'number' && s > L.planned_step_max + EPS) out.push(viol({ week: w.n }, k, { rule: 'planned_step_max', muscle: m, step: s }));
  for (let i = 1; i < c.weeks.length; i++) {
    const a = c.weeks[i - 1], b = c.weeks[i];
    if (a.block_type !== 'stairway' || b.block_type !== 'stairway' || a.training_block !== b.training_block) continue;
    if (typeof a.total_resistance_sets !== 'number' || typeof b.total_resistance_sets !== 'number') continue;
    if (!(b.total_resistance_sets < (1 + L.total_weekly_ceiling) * a.total_resistance_sets - EPS)) out.push(viol({ week: b.n }, k, { rule: 'total_rise', from: a.total_resistance_sets, to: b.total_resistance_sets }));
  }
  return out;
}

function v16Medball(c) {
  const out = [], max = c.R.medball.max_lb;
  for (const r of c.rows) {
    if (!r.ex) continue;
    const isBall = r.ex.tags.includes('medball') || !!r.ex.medball;
    if (c.meta.goal === 'muscle' && isBall && r.b.kind !== 'warmup') out.push(viol(where(r), 'check.v16_aesthetics_medball', { rule: 'aesthetics_main_work', exercise: r.ex.id }));
    if (r.it.load && r.it.load.type === 'medball_lb' && r.it.load.max > max + EPS) out.push(viol(where(r), 'check.v16_aesthetics_medball', { rule: 'medball_load', max: r.it.load.max }));
    if (r.ex.medball && r.ex.medball.max_lb > max) out.push(viol(where(r), 'check.v16_aesthetics_medball', { rule: 'catalog_medball', max: r.ex.medball.max_lb }));
  }
  return out;
}

function v17Effort(c) {
  const out = [], E = c.R.effort, k = 'check.v17_effort';
  const band = E.rir_band, recoveryMin = c.R.recovery.rir_min;
  const strengthFamily = c.family === 'strength';
  for (const w of c.weeks) for (const d of w.days || []) {
    const rows = c.dayRows(w, d);
    const res = rows.filter(isRes);
    const lastRes = res.length ? res[res.length - 1] : null;
    for (const r of rows) {
      const e = r.it.effort;
      if (!e) continue;
      const rc = repClassOf(r);
      const neverFail = E.never_failure_rep_classes.includes(rc);
      if (neverFail && !['rir', 'intent', 'role', 'power'].includes(e.type)) out.push(viol(where(r), k, { rule: 'effort_type', type: e.type }));
      if (e.type !== 'rir') continue;
      if (neverFail && !(e.min >= E.compound_floor_rir)) out.push(viol(where(r), k, { rule: 'compound_rir_floor', min: e.min }));
      if (neverFail && e.last_set === 'max') out.push(viol(where(r), k, { rule: 'max_on_compound', rep_class: rc }));
      // MYO on a machine compound is allowed when it is the day's last machine exercise (H02 "MYO only on the day's last
      // machine or isolation exercise"); V17's never-failure clause is read as "no MYO on free-weight compounds" (CONTRACT_REQUESTS).
      if (neverFail && e.last_set === 'myo' && rc !== 'machine_stable_compound') out.push(viol(where(r), k, { rule: 'myo_on_compound', rep_class: rc }));
      if (e.last_set === 'max' && !(E.max.allowed_rep_classes.includes(rc) || (E.max.allowed_bodyweight && r.ex && isBodyweight(r.ex, c)))) out.push(viol(where(r), k, { rule: 'max_not_allowed', rep_class: rc || 'none' }));
      if (e.last_set === 'myo') {
        const isoOrMachine = (r.bd && ['isolation', 'focus'].includes(r.bd.kind)) || (r.ex && r.ex.constraint >= 4);
        const N = c.stairN(w);
        const m = r.ex && r.ex.primary_muscle;
        // the cap of the week's own training block (v1.2: each stairway block is sized to the minutes, meta.stairway[].cap)
        const blk = Array.isArray(c.meta.stairway) ? c.meta.stairway.find(s => s.training_block === w.training_block) : null;
        const capOf = (blk && blk.cap) || c.targets.cap || {};
        const atCap = !!m && typeof (w.target_by_muscle || {})[m] === 'number' && typeof capOf[m] === 'number' && w.target_by_muscle[m] >= capOf[m] - EPS;
        const when = w.block_type === 'stairway' && ((N && w.stair_week === N) || (w.phase === 'HARDEST' && atCap));
        if (r !== lastRes || !isoOrMachine || !when || E.myo.never_in_block_types.includes(w.block_type)) out.push(viol(where(r), k, { rule: 'myo_rule', last: r === lastRes ? 1 : 0, iso_or_machine: isoOrMachine ? 1 : 0, when: when ? 1 : 0 }));
      }
      if (w.block_type === 'recovery') {
        if (!(e.min >= recoveryMin)) out.push(viol(where(r), k, { rule: 'recovery_rir', min: e.min }));
        continue;
      }
      if (e.min < band[0] - EPS || e.max > band[1] + EPS) out.push(viol(where(r), k, { rule: 'rir_band', min: e.min, max: e.max }));
      if (!strengthFamily && isRes(r) && w.planned_rir) {
        const lo = Math.max(clamp(w.planned_rir.min, band[0], band[1]), neverFail ? E.compound_floor_rir : band[0]);
        const hi = Math.max(clamp(w.planned_rir.max, band[0], band[1]), lo);
        if (e.min < lo - EPS || e.min > hi + EPS || e.max > hi + EPS) out.push(viol(where(r), k, { rule: 'planned_rir', min: e.min, max: e.max, planned_min: w.planned_rir.min, planned_max: w.planned_rir.max }));
      }
    }
  }
  return out;
}

function v18Minimums(c) {
  const out = [], k = 'check.v18_minimums';
  const pain = c.targets.pain_muscles || [];
  const calvesExempt = pain.includes('calves') || (c.targets.fill || {}).calves === 'credit';
  const perLegDay = typeof c.targets.calves_per_leg_day === 'number' ? c.targets.calves_per_leg_day : c.R.volume.calves.per_leg_day.L1;
  for (const w of c.weeks) {
    if (w.block_type !== 'stairway') continue;
    let rear = 0, upper = 0;
    for (const d of w.days || []) {
      const rows = c.dayRows(w, d);
      const isCalf = (r) => r.it.bucket === 'ISO_CALF' || (r.ex && r.ex.credit_class === 'ISO_CALF');
      rear += rows.filter(r => r.ex && REAR_CLASSES.includes(r.ex.credit_class)).length;
      upper += rows.filter(r => isRes(r) && regionOf(r, c.R) === 'upper').length;
      if (d.kind !== 'main') continue;
      const lowerDay = rows.some(r => isRes(r) && regionOf(r, c.R) === 'lower' && !isCalf(r));
      if (lowerDay && !calvesExempt) {
        if (d.format === 'circuit') {
          // a calf station runs every round: one station x 3 rounds = the 3 calf sets of a leg day (VOL-17; v1.2)
          const n = rows.filter(isCalf).reduce((a, r) => a + (r.it.circuit ? r.it.circuit.rounds : (r.it.sets || 0)), 0);
          if (n < perLegDay) out.push(viol(whereDay(w, d), k, { rule: 'circuit_calf_sets', sets: n, need: perLegDay }));
        } else {
          const sets = rows.filter(isCalf).reduce((a, r) => a + (r.it.sets || 0), 0);
          if (sets < perLegDay) out.push(viol(whereDay(w, d), k, { rule: 'calves_per_leg_day', sets, need: perLegDay }));
        }
      }
      const coreItems = rows.filter(r => r.b.kind === 'core').length;
      const minutes = typeof d.minutes_limit === 'number' ? d.minutes_limit : c.meta.session_minutes;
      const need = minutes >= 45 ? c.R.core_block.exercises : 1;
      if (rows.length && coreItems < need) out.push(viol(whereDay(w, d), K.h05, { rule: 'core_block_minimum', items: coreItems, need }));
    }
    if (upper > 0 && rear === 0 && !pain.includes('rear_delts')) out.push(viol({ week: w.n }, k, { rule: 'rear_delt_weekly' }));
  }
  return out;
}

function v19Olympic(c) {
  const out = [], k = 'check.v19_olympic', O = c.R.olympic;
  if (!['athletic', 'hybrid_crossfit'].includes(c.family)) return out;
  if (c.age !== null && c.age >= c.R.population.older.from_age && !c.optIn) return out;
  const kit = c.meta.kit ? { tokens: c.meta.kit.tokens || [], machines: c.meta.kit.machines || [] } : null;
  const level = c.meta.level && c.meta.level.client;
  const L = c.R.levels, youth = c.age !== null && c.age < L.youth_age;
  const count = (c.derived.previous_cycles && c.derived.previous_cycles.count) || 0;
  const avoid = painAvoid(c);
  const famOk = (e, v) => {
    if (!v || v === 'jerk') return true;
    const fam = e.athletic && e.athletic.olympic_family;
    return !!fam && (O.day_pattern[fam] === 'either' || O.day_pattern[fam] === O.day_pattern[v]);
  };
  // The week must hold Olympic / triple-extension work only where the template asks for it (an AP_TRIPLE_EXT station kept
  // at this session length) and where some record can fill it for this person: kit, youth ladder, floor lifts, tier of the
  // week's exercise block, pain avoid-tags / axial limit, exclusions, the station's day pattern (select filters 1-6).
  const possible = (e, v, w) => (!kit || c.model.kitAvailable(e, kit))
    && (!youth || L.ladder_order.indexOf(e.level) <= L.ladder_order.indexOf(L.youth_max_ladder))
    && (!e.tags.includes('olympic_from_floor') || (youth ? (c.age >= c.R.population.youth.olympic_floor_min_age && e.tags.includes('youth_floor_ok') && count >= 1) : (!kit || kit.tokens.includes('barbell_bumpers_platform'))))
    && (!e.athletic || e.athletic.olympic_tier !== 'L2_plus' || level === 'L3' || (level === 'L2' && w.exercise_block >= 2))
    && !/proposed/.test(e.status) && !avoid.tags.some(t => e.tags.includes(t))
    && (avoid.maxAxial === null || AXIAL_ORDER.indexOf(e.axial_class) <= AXIAL_ORDER.indexOf(avoid.maxAxial))
    && famOk(e, v);
  const pool = c.model.bySlot('AP_TRIPLE_EXT');
  const ath = c.meta.athletic || {};
  for (const w of c.weeks) {
    const rows = c.rows.filter(r => r.w === w && r.it.bucket === 'AP_TRIPLE_EXT' && r.ex);
    const heavyGameWeek = w.block_type === 'in_season' && ath.game_heavy && ath.heavy_play_week;
    const asked = (w.days || []).filter(d => d.kind === 'main').flatMap(d => templateStations(c, d))
      .filter(st => st.bucket === 'AP_TRIPLE_EXT' && (st.include_from_minutes === null || st.include_from_minutes === undefined || st.include_from_minutes <= (c.meta.session_minutes || 0)));
    const needed = asked.some(st => pool.some(e => possible(e, st.variant, w)));
    if (needed && !heavyGameWeek && !rows.length) out.push(viol({ week: w.n }, k, { rule: 'olympic_every_week' }));
    const days = new Set(rows.map(r => r.d.weekday));
    if (days.size > O.per_week_max) out.push(viol({ week: w.n }, k, { rule: 'per_week_max', exposures: days.size, max: O.per_week_max }));
    for (const r of rows) {
      const tier = r.ex.athletic && r.ex.athletic.olympic_tier;
      const l2plusOk = level === 'L3' || (level === 'L2' && w.exercise_block >= 2);
      if (tier === 'L2_plus' && !l2plusOk) out.push(viol(where(r), k, { rule: 'tier', tier, level: level || 'none', exercise_block: w.exercise_block }));
      const variant = stationVariant(c, r);
      const fam = r.ex.athletic && r.ex.athletic.olympic_family;
      if (variant && fam && variant !== 'jerk') {
        const pv = O.day_pattern[variant], pf = O.day_pattern[fam];
        if (pv && pf && pf !== 'either' && pf !== pv) out.push(viol(where(r), k, { rule: 'day_pattern', station: variant, family: fam }));
      }
    }
  }
  for (const r of c.rows) if (r.it.load && r.it.load.type === 'pct_hint') out.push(viol(where(r), k, { rule: 'pct_hint' }));
  return out;
}
const AXIAL_ORDER = ['none', 'low', 'moderate', 'high'];
function painAvoid(c) {
  const P = c.R.volume.pain, tags = new Set();
  let maxAxial = null;
  const lower = (x) => { if (x && (maxAxial === null || AXIAL_ORDER.indexOf(x) < AXIAL_ORDER.indexOf(maxAxial))) maxAxial = x; };
  for (const p of c.derived.pain || []) {
    const a = P.areas[p.area];
    if (a) { (a.avoid_tags || []).forEach(t => tags.add(t)); lower(a.max_axial_class); }
    for (const ww of p.worse_with || []) { const x = P.worse_with[ww]; if (x) { (x.avoid_tags || []).forEach(t => tags.add(t)); lower(x.max_axial_class); } }
  }
  const ex = c.derived.exclusions || [];
  if (ex.includes('barbell')) tags.add('barbell');
  if (ex.includes('overhead_pressing')) tags.add('overhead');
  if (ex.includes('machines')) tags.add('machine');
  return { tags: [...tags], maxAxial };
}
/** the template stations of a plan day (base or variant template; in-season days from the in-season template) */
function templateStations(c, d) {
  const look = (id, variant) => {
    if (!id) return null;
    const [fam, days] = String(id).split('.');
    try {
      const t = c.model.template(fam, days);
      const dt = c.model.dayTypes(t, variant && t.variants[variant] ? variant : null).day_types[d.day_type];
      return dt ? dt.stations : null;
    } catch { return null; }
  };
  const tpl = c.meta.template || {}, IS = c.R.plan_types.season.in_season;
  return look(tpl.id, tpl.variant) || look(IS.template, IS.variant) || [];
}
function stationVariant(c, r) {
  const tryTemplate = (id, variant) => {
    if (!id) return null;
    const [fam, days] = String(id).split('.');
    try {
      const t = c.model.template(fam, days);
      const dts = c.model.dayTypes(t, variant && t.variants[variant] ? variant : null).day_types;
      const dt = dts[r.d.day_type];
      const st = dt && dt.stations.find(s => s.id === r.it.station_id);
      return st ? st.variant : undefined;
    } catch { return null; }
  };
  const tpl = c.meta.template || {};
  const a = tryTemplate(tpl.id, tpl.variant);
  if (a !== undefined && a !== null) return a;
  const IS = c.R.plan_types.season.in_season;
  const b = tryTemplate(IS.template, IS.variant);
  return b === undefined ? null : b;
}

function v20VSquat(c) {
  const out = [], k = 'check.v20_vsquat';
  const bad = (e, id) => (e && e.tags.includes('v_squat')) || VSQUAT_RE.test(id || '') || (e && VSQUAT_RE.test(c.model.t('en', e.name_key)));
  for (const r of c.rows) {
    if (bad(r.ex, r.it.exercise_id)) out.push(viol(where(r), k, { exercise: r.it.exercise_id }));
    for (const s of r.it.swaps || []) if (bad(c.ex(s), s)) out.push(viol(where(r), k, { swap: s }));
  }
  return out;
}

function v21Release(c) {
  if (c.plan.status !== 'ok') return [];
  const st = c.plan.release_stamp, k = 'check.v21_release';
  if (!st) return [viol({}, k, { rule: 'release_stamp_missing' })];
  const role = (c.meta.health && c.meta.health.role) || (c.derived.health && c.derived.health.role) || 'self';
  const want = c.age !== null && c.age < c.R.levels.youth_age ? 'release.minor' : role === 'client' ? 'release.coach' : 'release.client';
  const out = [];
  if (st.version !== want) out.push(viol({}, k, { rule: 'release_version', version: st.version || 'none', expected: want }));
  if (want === 'release.minor' && st.guardian !== true) out.push(viol({}, k, { rule: 'guardian_missing' }));
  return out;
}

function v22Floor(c) {
  const out = [], k = 'check.v22_floor', floor = c.R.volume.floor.value;
  const exempt = new Set();
  for (const w of c.warnings) if (w && w.key === 'warning.floor_schedule') for (const m of muscleList((w.args || {}).muscles)) exempt.add(m);
  const pain = c.targets.pain_muscles || [], credit = c.targets.credit_only || [], fill = c.targets.fill || {};
  const muscles = (c.targets.floored || []).filter(m => !pain.includes(m) && !credit.includes(m) && fill[m] !== 'own_sets' && fill[m] !== 'credit' && !exempt.has(m));
  for (const w of c.weeks) {
    if (w.block_type !== 'stairway' || w.circuit) continue;
    if ((w.days || []).some(d => d.kind === 'main' && d.format === 'circuit')) continue;
    for (const m of muscles) {
      const v = (w.weekly_sets_by_muscle || {})[m];
      if (!(typeof v === 'number' && v >= floor - EPS)) out.push(viol({ week: w.n }, k, { muscle: m, sets: typeof v === 'number' ? v : 0, floor }));
    }
  }
  return out;
}

function v23Groups(c) {
  const out = [], k = 'check.v23_exercises_per_group', G = c.R.session.exercises_per_group;
  if (G.exempt_families.includes(c.family)) return out;
  const [lo, hi] = G.full_body_day;
  for (const w of c.weeks) for (const d of w.days || []) {
    if (d.kind !== 'main') continue;
    // a circuit station is one exercise of a whole-body round: bootcamp circuits spread a group over the week (D-71, review 05)
    if (d.format === 'circuit') continue;
    const counts = {};
    for (const r of c.dayRows(w, d)) if (isRes(r)) { const g = groupOf(r, c.model); if (g) counts[g] = (counts[g] || 0) + 1; }
    for (const g of c.R.muscles.groups.order) {
      if (G.exempt_groups.includes(g) || !counts[g]) continue;
      const n = counts[g];
      if (n < lo || (d.full_body !== false && n > hi)) out.push(viol(whereDay(w, d), k, { group: g, count: n, min: lo, max: d.full_body !== false ? hi : 'none' }));
    }
  }
  return out;
}

function v24Blocks(c) {
  const out = [], k = 'check.v24_block_structure';
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const [a, b] = tb.weeks;
    if (tb.stair_N !== b - a + 1) out.push(viol({}, k, { rule: 'stair_N', block: tb.n, N: tb.stair_N, span: b - a + 1 }));
    for (let n = a; n <= b; n++) {
      const w = c.weeks.find(x => x.n === n);
      if (!w) { out.push(viol({ week: n }, k, { rule: 'week_missing', block: tb.n })); continue; }
      if (w.block_type !== 'stairway' || w.training_block !== tb.n) out.push(viol({ week: n }, k, { rule: 'other_week_inside_stairway', block_type: w.block_type }));
      else if (w.stair_week !== n - a + 1) out.push(viol({ week: n }, k, { rule: 'stair_week_gap', stair_week: w.stair_week, expected: n - a + 1 }));
    }
  }
  for (const w of c.weeks) {
    if (w.block_type !== 'recovery') continue;
    const prev = c.weeks.find(x => x.n === w.n - 1), next = c.weeks.find(x => x.n === w.n + 1);
    if (!prev || prev.block_type !== 'stairway' || !next || next.block_type !== 'stairway') out.push(viol({ week: w.n }, k, { rule: 'recovery_not_between_stairways' }));
  }
  return out;
}

function v25Tests(c) {
  const out = [], k = 'check.v25_tests';
  const cat = c.R.tests.catalogue;
  const fromZero = new Set(), after = new Set();
  for (const t of Object.values(cat)) {
    const add = (set, v) => { if (typeof v === 'string') set.add(v); else if (Array.isArray(v)) v.forEach(x => set.add(x)); else if (v && typeof v === 'object') Object.values(v).forEach(x => add(set, x)); };
    add(fromZero, t.from_zero); add(after, t.after_completed_block);
  }
  const neverFromZero = [...after].filter(x => !fromZero.has(x));
  for (const w of c.weeks) {
    const N = c.stairN(w);
    if (w.test) {
      if (w.block_type !== 'stairway') out.push(viol({ week: w.n }, k, { rule: 'test_outside_stairway', block_type: w.block_type }));
      else if (w.test.type === 'baseline' && w.stair_week !== 1) out.push(viol({ week: w.n }, k, { rule: 'baseline_not_week_1', stair_week: w.stair_week }));
      else if (w.test.type === 'end' && w.stair_week !== N) out.push(viol({ week: w.n }, k, { rule: 'end_not_last_week', stair_week: w.stair_week }));
      else if (!['baseline', 'end'].includes(w.test.type)) out.push(viol({ week: w.n }, k, { rule: 'test_type', type: String(w.test.type) }));
    }
    for (const r of c.rows.filter(x => x.w === w && x.it.test)) {
      if (!w.test) out.push(viol(where(r), k, { rule: 'item_test_outside_test_week' }));
      else if (w.test.from_zero && neverFromZero.includes(r.it.test.test)) out.push(viol(where(r), k, { rule: 'max_test_from_zero', test: r.it.test.test }));
    }
  }
  return out;
}

/**
 * V27 (v1.2, review 03 / 04 / 08): the athletic work stays near the sport profile's weekly budget. Olympic sets <= the
 * reconcile factor (1.5) x the week's target, or the smallest dose the profile's exposures allow (min sets x exposures);
 * jump / plyo / throw / COD / sprint counts <= target x (1 + tolerance) + one set's dose.
 */
function v27AthleticBudget(c) {
  const out = [];
  const RC = c.R.athletic.reconcile;
  if (!RC || !RC.enabled) return out;
  const O = c.R.olympic.sets || {};
  const D11 = c.derived.D11_athletic_budget || {};
  const exposures = Math.max(1, Math.min(D11.olympic_exposures_wk || 1, ...(Array.isArray(D11.weekly && D11.weekly.olympic_sets) ? [Math.floor(D11.weekly.olympic_sets[1] / (O.min_per_exposure || 2) + EPS) || 1] : [])));
  for (const w of c.weeks) {
    const ab = w.athletic_budget;
    if (!ab || !ab.targets || !ab.planned) continue;
    const t = ab.targets, p = ab.planned;
    if (typeof t.olympic_sets === 'number' && t.olympic_sets > 0 && typeof p.olympic_sets === 'number') {
      const per = c.family === 'hybrid_crossfit' && c.R.reps.class_levels ? c.R.reps.class_levels.power[0].sets : (O.min_per_exposure || 2);
      const limit = Math.max((RC.olympic_max_factor || 1.5) * t.olympic_sets, per * exposures);
      if (p.olympic_sets > limit + EPS) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: 'olympic_sets', planned: p.olympic_sets, target: t.olympic_sets }));
    }
    for (const k of ['plyo_contacts', 'jump_contacts', 'throws', 'cod_cuts', 'sprint_m']) {
      if (typeof t[k] !== 'number' || typeof p[k] !== 'number') continue;
      const limit = t[k] * (1 + (RC.tolerance || 0.25)) + ((RC.per_set_max || {})[k] || 0);
      if (p[k] > limit + EPS) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: k, planned: p[k], target: t[k] }));
    }
  }
  return out;
}

/** V28 (warn, v1.2, review 06 major 6): the realized bilateral share of lower-body compound sets per exercise block stays near D10 */
function v28LateralityShare(c) {
  const out = [];
  const st = c.meta.share_targets;
  if (!st || !st.lower || !Array.isArray(st.lower.by_exercise_block)) return out;
  const byEb = new Map();
  for (const r of c.rows) {
    if (!r.ex || !r.it.sets || r.w.block_type !== 'stairway') continue;
    const cc = r.ex.credit_class;
    const e = byEb.get(r.w.exercise_block) || { bi: 0, uni: 0, first: r.w };
    if (['BKD', 'BHD'].includes(cc)) e.bi += r.it.sets; else if (UNI_COMPOUND_CLASSES.includes(cc)) e.uni += r.it.sets; else continue;
    byEb.set(r.w.exercise_block, e);
  }
  const ebs = [...byEb.keys()].sort((a, b) => a - b);
  ebs.forEach((eb, i) => {
    const e = byEb.get(eb), n = e.bi + e.uni;
    const target = st.lower.by_exercise_block[Math.min(i, st.lower.by_exercise_block.length - 1)];
    if (n < 4 || typeof target !== 'number') return;
    const share = e.bi / n;
    if (Math.abs(share - target) > 0.25 + EPS) out.push(viol({ week: e.first.n }, 'check.v28_laterality_share', { exercise_block: eb, share: Math.round(share * 100) / 100, target }));
  });
  return out;
}

/** V29 (v1.2, review 04 major 3): weekly pulling sets >= 0.8 x pushing sets unless the client's priority is a pushing muscle */
function v29PushPull(c) {
  const out = [];
  const pr = (c.targets.priority || []);
  if (pr.some(m => ['chest', 'front_delts', 'triceps'].includes(m))) return out;
  for (const w of c.weeks) {
    let push = 0, pull = 0;
    for (const d of w.days || []) for (const b of d.blocks || []) for (const it of b.items || []) {
      const e = c.ex(it.exercise_id);
      if (!e || !it.sets) continue;
      if (['HPUSH', 'VPUSH', 'DIPS'].includes(e.credit_class)) push += it.sets;
      else if (['HPULL', 'VPULL'].includes(e.credit_class)) pull += it.sets;
    }
    if (push >= 4 && pull < 0.8 * push - EPS) out.push(viol({ week: w.n }, 'check.v29_push_pull', { pull, push }));
  }
  return out;
}

function v26Inputs(c) {
  const out = [], k = 'check.v26_inputs';
  if (c.plan.status === 'ok') {
    const ia = c.meta.input_audit;
    if (!ia) out.push(viol({}, k, { rule: 'input_audit_missing' }));
    else if ((ia.forbidden_found || []).length) out.push(viol({}, k, { rule: 'forbidden_input', keys: ia.forbidden_found.join(',') }));
  }
  for (const p of forbiddenKeys(c.plan)) out.push(viol({}, k, { rule: 'forbidden_key_in_plan', path: p }));
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- H-only checks

function h13NoSex(c) {
  return forbiddenKeys(c.plan).filter(p => /(^|\.)(sex|gender)$/i.test(p.replace(/\[\d+\]/g, ''))).map(p => viol({}, K.h13, { path: p }));
}

function h14I18n(c) {
  const out = [], keys = new Map();
  const add = (k, wh) => { if (typeof k === 'string' && k && !keys.has(k)) keys.set(k, wh || {}); };
  const addWhy = (arr, wh) => (arr || []).forEach(x => x && add(x.key, wh));
  const m = c.meta, p = c.plan;
  for (const r of p.refer && p.refer.reasons ? p.refer.reasons : []) add(r);
  for (const e of p.errors || []) if (e) add(e.key);
  for (const o of p.offers || []) if (o) add(o.key);
  add(m.program_name_key);
  if (m.profile) add(m.profile.name_key);
  if (m.goal) add('goal.' + m.goal);
  if (m.level && m.level.client) add('level.' + m.level.client);
  for (const rk of (m.level && m.level.reason_keys) || []) if (rk) add(rk.key);
  for (const k of m.instruction_keys || []) add(k);
  for (const k of m.locked_rule_keys || []) add(k);
  for (const x of m.warnings || []) if (x) add(x.key);
  addWhy(m.why);
  if (m.season && m.season.phase) add('season.' + m.season.phase);
  for (const t of (m.tests && m.tests.items) || []) add('tests.' + t);
  for (const tb of c.tbs) add(tb.label_key);
  for (const w of c.weeks) {
    const wh = { week: w.n };
    add(w.phase_key, wh); addWhy(w.why, wh);
    for (const ch of w.changes || []) if (ch) add(ch.key, wh);
    for (const d of w.days || []) {
      add(d.label_key, whereDay(w, d)); add('weekday.' + d.weekday); addWhy(d.why, whereDay(w, d));
      for (const b of d.blocks || []) add(b.kind === 'circuit' ? 'block.circuit' : 'block.' + b.kind);
    }
  }
  for (const r of c.rows) {
    const wh = where(r), it = r.it;
    add(it.name_key, wh); add(it.cue_key, wh); add(it.text_key, wh);
    if (it.detail) add(it.detail.key, wh);
    for (const n of it.notes || []) if (n) add(n.key, wh);
    addWhy(it.why, wh);
    for (const s of it.swaps || []) { const e = c.ex(s); if (e) add(e.name_key, wh); else out.push(viol(wh, K.h14, { rule: 'unknown_swap', id: s })); }
    if (it.reps && it.reps.bracket && c.R.reps.brackets[it.reps.bracket]) add(c.R.reps.brackets[it.reps.bracket].label_key, wh);
    if (it.effort && it.effort.key) add(it.effort.key, wh);
    if (it.exercise_id && !r.ex) out.push(viol(wh, K.h14, { rule: 'unknown_exercise', id: it.exercise_id }));
  }
  const missing = new Set((c.model.i18n.es_review && c.model.i18n.es_review.missing_keys) || []);
  for (const [k, wh] of keys) {
    if (!c.model.has('en', k)) out.push(viol(wh, K.h14, { rule: 'missing_en', key: k }));
    else if (!c.model.has('es', k) && !missing.has(k)) out.push(viol(wh, K.h14, { rule: 'missing_es', key: k }));
  }
  return out;
}

function isAdapted(w) { return (w.why || []).some(x => x && x.key === 'why.r3_pending' && x.ref === 'R3-VOL-02'); }

function h21Stairway(c) {
  const out = [];
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    if (ws.length < 2) continue;
    const N = ws.length, stair = c.model.stair(N);
    const adapted = ws.some(isAdapted);
    const fill = c.targets.fill || {};
    const muscles = Object.keys(fill).filter(m => fill[m] === 'target');
    for (const m of muscles) {
      for (let i = 1; i < ws.length; i++) {
        const t0 = (ws[i - 1].target_by_muscle || {})[m], t1 = (ws[i].target_by_muscle || {})[m];
        if (typeof t0 === 'number' && typeof t1 === 'number' && t1 < t0 - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'target_drops', muscle: m, from: t0, to: t1 }));
        const d0 = (ws[i - 1].direct_sets_by_muscle || {})[m], d1 = (ws[i].direct_sets_by_muscle || {})[m];
        if (typeof d0 === 'number' && typeof d1 === 'number' && d1 < d0 - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'sets_drop', muscle: m, from: d0, to: d1 }));
      }
      if (adapted) continue;
      const step = (w) => { const s = (ws[w - 1].step_by_muscle || {})[m]; return typeof s === 'number' ? s : null; };
      const early = [], late = [];
      for (let w = 2; w <= N; w++) { const s = step(w); if (s === null) continue; (w <= stair.halfway ? early : late).push(s); }
      if (early.length && late.length && Math.max(...early) > Math.min(...late) + EPS) out.push(viol({}, K.h21, { rule: 'early_step_larger', muscle: m, early: Math.max(...early), late: Math.min(...late) }));
    }
    // v1.2 (review 04 / 06 / 08 blockers): a stairway that never climbs fails. Each target muscle must end within 1 set of its
    // week-N target or rise by >= 1 set in the second half; the main-day total must rise; a circuit plan's total work
    // (sets x work seconds) must rise every week by no more than the 10 % ceiling
    // a muscle the minutes cannot grow is exempt once the client was told and offered the fix (start sized to the minutes +
    // offer of longer sessions / one more day, D-67) - the same contract as the floor's D-33 exemption
    const offered = (c.plan.offers || []).some(o => o && ['offer.longer_sessions', 'offer.more_days'].includes(o.key));
    const toldMuscles = new Set(c.warnings.filter(x => x && ['warning.start_lowered', 'warning.stairway_time', 'warning.floor_schedule'].includes(x.key))
      .flatMap(x => String((x.args && x.args.muscles) || '').split(',').map(t => t.trim()).filter(Boolean)));
    // the conjugate strength templates keep their written four-role days (R.session exempt_families; master 10.3) and climb by load
    const fixedTemplate = (c.R.session.exercises_per_group.exempt_families || []).includes(c.family);
    if (!adapted && !c.circuitPlan && !fixedTemplate) {
      const half = Math.max(1, Math.floor(N / 2));
      for (const m of muscles) {
        if (offered && toldMuscles.has(m)) continue;
        const p = (w) => { const v = (w.main_sets_by_muscle || w.weekly_sets_by_muscle || {})[m]; return typeof v === 'number' ? v : null; };
        const tN = (ws[N - 1].target_by_muscle || {})[m], pN = p(ws[N - 1]), pH = p(ws[half - 1]);
        if (typeof tN !== 'number' || pN === null || pH === null) continue;
        if (pN >= tN - 1 - EPS || pN - pH >= 1 - EPS) continue; // at (or above) its week-N target, or rose in the second half
        out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'stairway_flat', muscle: m, half: pH, last: pN, target: tN }));
      }
      const tm = ws.map(w => (typeof w.total_main_sets === 'number' ? w.total_main_sets : null));
      if (tm.every(t => t !== null) && tm[N - 1] <= tm[0] + EPS && !(offered && toldMuscles.size)) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'total_flat', first: tm[0], last: tm[N - 1] }));
    }
    if (!adapted && c.circuitPlan) {
      const work = ws.map(w => (w.circuit && typeof w.total_resistance_sets === 'number' ? w.total_resistance_sets * w.circuit.work_s : null));
      for (let i = 1; i < N; i++) {
        if (work[i] === null || work[i - 1] === null) continue;
        if (work[i] <= work[i - 1] + EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'circuit_flat', from: work[i - 1], to: work[i] }));
        else if (work[i] > work[i - 1] * (1 + c.R.stairway.limits.total_weekly_ceiling) + EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'circuit_step_over_ceiling', from: work[i - 1], to: work[i] }));
      }
    }
    const totals = ws.map(w => (typeof w.total_resistance_sets === 'number' ? w.total_resistance_sets : null));
    if (totals.every(t => t !== null)) {
      const last = totals[N - 1];
      if (totals.some(t => t > last + EPS)) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'last_week_not_hardest', last, max: Math.max(...totals) }));
      if (N === 12 && Math.min(...totals.slice(8)) < Math.max(...totals.slice(0, 8)) - EPS) out.push(viol({}, K.h21, { rule: 'last_four_not_hardest' }));
    }
    for (let i = 1; i < ws.length; i++) {
      const a = ws[i - 1], b = ws[i];
      if (!(typeof a.stair_level === 'number' && typeof b.stair_level === 'number' && b.stair_level > a.stair_level)) out.push(viol({ week: b.n }, K.h21, { rule: 'stair_level_not_rising', from: a.stair_level, to: b.stair_level }));
      if (a.planned_rir && b.planned_rir && (b.planned_rir.min > a.planned_rir.min + EPS || b.planned_rir.max > a.planned_rir.max + EPS)) out.push(viol({ week: b.n }, K.h21, { rule: 'planned_rir_rises' }));
    }
  }
  return out;
}

function h22NoCheckin(c) {
  const out = [], S = c.R.stairway, L = S.limits, V = c.R.volume;
  const adapted = c.weeks.some(isAdapted);
  if (adapted && c.derived.output_mode !== 'plan_only') return out; // check-ins applied: the stairway may wait (adapt, R2-VOL-01)
  if (adapted) out.push(viol({}, K.h22, { rule: 'adapted_plan_only' }));
  // a check-in offer ('the block cannot be finished') needs a check-in; schedule offers made at build time (v1.2: longer
  // sessions / one more day when the stairway had to start lower, D-67) are not adaptations
  if ((c.plan.offers || []).some(o => o && o.key === 'block.cannot_finish')) out.push(viol({}, K.h22, { rule: 'offers_without_checkin' }));
  const t = c.targets, start = t.start || {}, cap = t.cap || {}, fill = t.fill || {};
  const priority = t.priority || [], pain = t.pain_muscles || [];
  const older = c.age !== null && c.age >= c.R.population.older.from_age;
  const isYear = c.meta.plan_mode === 'year';
  const yearLayout = (c.R.plan_types.year && c.R.plan_types.year.layout) || [];
  for (const w of c.weeks) if (w.block_type !== 'stairway' || w.stair_week === 1) {
    for (const [m, s] of Object.entries(w.step_by_muscle || {})) if (typeof s === 'number' && Math.abs(s) > EPS) out.push(viol({ week: w.n }, K.h22, { rule: 'step_in_flat_or_first_week', muscle: m, step: s }));
  }
  const stairMeta = Array.isArray(c.meta.stairway) ? c.meta.stairway : [];
  c.tbs.filter(tb => tb.type === 'stairway').forEach((tb, bi) => {
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    const N = ws.length;
    if (N < 2) return;
    const stair = c.model.stair(N);
    const flat = isYear && yearLayout.some(l => l.type === 'stairway' && l.flat_sets && l.weeks[0] === tb.weeks[0]);
    const lamMeta = (stairMeta.find(s => s.training_block === tb.n) || {}).lambda || {};
    for (const m of Object.keys(start)) {
      if (typeof start[m] !== 'number' || typeof cap[m] !== 'number' || ['credit', 'core_block'].includes(fill[m])) continue;
      const caps = [L.planned_step_max];
      if (priority.length && !priority.includes(m)) caps.push(L.nonpriority_while_priority);
      if (older) caps.push(L.older_60plus);
      const painM = pain.includes(m);
      const plan = plannedStairway({ start: start[m], cap: cap[m] }, N, {
        early_late: stair.standard_steps, caps, freeze: painM ? V.pain.freeze_weeks : 0,
        after_freeze: painM ? L.pain_after_freeze : null, iterations: S.lambda.iterations
      });
      const lam = bi === 0 ? plan.lambda : (typeof lamMeta[m] === 'number' ? lamMeta[m] : plan.lambda);
      if (bi === 0 && typeof lamMeta[m] === 'number' && Math.abs(lamMeta[m] - plan.lambda) > 1e-3) out.push(viol({}, K.h22, { rule: 'lambda_mismatch', muscle: m, claimed: lamMeta[m], recomputed: Math.round(plan.lambda * 1e4) / 1e4 }));
      for (let i = 1; i < N; i++) {
        const w = ws[i], s = (w.step_by_muscle || {})[m];
        if (typeof s !== 'number') { out.push(viol({ week: w.n }, K.h22, { rule: 'step_missing', muscle: m })); continue; }
        const expected = lam * plan.capped[i + 1];
        const okFlat = flat && Math.abs(s) <= EPS;
        if (!okFlat && Math.abs(s - expected) > 5.1e-4) out.push(viol({ week: w.n }, K.h22, { rule: 'step_not_planned', muscle: m, step: s, planned: Math.round(expected * 1e4) / 1e4 }));
      }
    }
  });
  return out;
}

function uniq(a) { return [...new Set(a)]; }
