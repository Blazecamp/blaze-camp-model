// engine/validate.mjs - plan validation (engine/CONTRACTS.md §4.9, §6). Owner: B4; v0.4 stage B1 (round 3).
// Pure: reads only the plan and the model; recomputes credits, weekly sets, stairway steps and group counts on its own
// (an independent cross-check of B2 / B3, never a call into their modules). Every number / list comes from model.rules.
// v0.4: the floor (V22 / H17) and the climb (H21) are read on the coach's FOCUS groups with group credit (R3-VOL-01, R3-SES-01);
// a warning never exempts a trained group - a group the time check leaves to compound credit must be listed in
// plan.time_check.not_trained_directly and must not be trained directly (R3-SES-02); H22 = planned stairway only (no check-ins,
// R3-VOL-02 / R3-VOL-04); a rep-max test is a top-set item that counts no muscle sets (R2-PER-07).
import { EPS, forbiddenKeys, canonicalJSON, clamp } from './util.mjs';
import { linesOf, groupCredits } from './timefit.mjs';
import { olympicAboveCeiling, perSetBounds, olympicVariantByDay } from './athletic.mjs';

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
    stairN: (w) => { const tb = tbs.find(t => t.n === w.training_block); return tb && tb.stair_N ? tb.stair_N : null; },
    X: linesOf(model),
    // groups the time check left to compound credit (reason time) and the sport's credit-only groups; per training block when
    // the plan has several (plan.time_check.by_block), else the first block's
    notTrained: (reason, tbN) => tcList('not_trained_directly', tbN).filter(x => !reason || x.reason === reason).map(x => x.group),
    belowFloor: (tbN) => tcList('trained_below_floor', tbN).filter(x => x.reason === 'work_lift_time' || x.reason === 'circuit_time').map(x => x.group),
    // v0.4 fix round 2 / F1 (E-143): blocks the time check switched off for the minutes (a stay-active plan's power block; switchable)
    blockOff: (kind, tbN) => tcList('blocks_off', tbN).some(x => x && x.block === kind)
  };
  function tcList(key, tbN) {
    const tc = plan && plan.time_check;
    if (!tc) return [];
    const src = (tbN !== undefined && tbN !== null && Array.isArray(tc.by_block) && tc.by_block.find(b => b.training_block === tbN)) || tc;
    return Array.isArray(src[key]) ? src[key] : [];
  }
  return c;
}

const where = (r) => ({ week: r.w.n, weekday: r.d.weekday, slot_id: r.it.slot_id });
const whereDay = (w, d) => ({ week: w.n, weekday: d.weekday });
const viol = (wh, key, args) => (args && Object.keys(args).length ? { where: wh || {}, key, args } : { where: wh || {}, key });
function dedupe(vs) {
  const seen = new Set();
  return vs.filter(v => { const k = canonicalJSON(v); if (seen.has(k)) return false; seen.add(k); return true; });
}
const isTestTop = (r) => r.it.role === 'test' && !!r.it.test && r.it.bucket !== 'TEST';
/** v0.4 fix round 1 (E-91): a rep-max test that replaces the lift's top set carries the lift's credits (its back-off item follows) */
const testReplaces = (c, r) => !!(c.R.tests && c.R.tests.replaces_top_set) && isTestTop(r) && Object.keys(r.it.credits || {}).length > 0 &&
  c.dayRows(r.w, r.d).some(x => x !== r && x.it.slot_id + '.test' === r.it.slot_id && (x.it.flags || []).includes('back_off'));
const isRes = (r) => !!r.ex && !isTestTop(r) && ((r.bd && RESISTANCE_KINDS.includes(r.bd.kind)) || r.it.origin === 'bonus');
function regionOf(r, R) {
  if (r.bd && r.bd.region) return r.bd.region;
  const m = r.ex && r.ex.primary_muscle;
  return m && R.muscles.defs[m] ? R.muscles.defs[m].region : null;
}
function groupOf(r, model) {
  if (r.it.group) return r.it.group;
  return r.ex && r.ex.primary_muscle ? model.groupOf(r.ex.primary_muscle) : null;
}
/**
 * v0.4 fix round 1 / F3 (minimal; E-119, VOL-15 'MYO on the last machine / isolation exercise'): a MYO set may sit on the day's last
 * item that can carry one - every resistance item after it never takes a MYO (a free-weight compound, a glute bridge / thrust in
 * rules.effort.intensifiers.never_credit_classes, calves for an Achilles hot spot) - so a day ending on a hip thrust or a protected
 * calf raise keeps its intensifier on the exercise before
 */
function myoLastEligible(r, res, c) {
  const IN = c.R.effort.intensifiers;
  if (!IN) return false;
  const i = res.indexOf(r);
  if (i < 0) return false;
  const sport = (() => { try { return c.meta.profile && c.model.hasSport(c.meta.profile.id) ? c.model.sport(c.meta.profile.id) : null; } catch { return null; } })();
  const hot = new Set((sport && sport.injuries) || []);
  const could = (x) => {
    if (!x.ex || x.it.role === 'test' || !x.it.sets) return false;
    if (x.it.superset) return false; // (fix round 2 / F1, E-158: an item running inside a superset pair never takes the MYO)
    const rc = repClassOf(x);
    const never = c.R.effort.never_failure_rep_classes.includes(rc);
    const isoOrMachine = (x.bd && ['isolation', 'focus'].includes(x.bd.kind)) || x.ex.constraint >= 4;
    if (!isoOrMachine || (never && rc !== 'machine_stable_compound')) return false;
    if (never && rc === 'machine_stable_compound') { // the dose's rule: a machine compound takes a MYO only where its matrix cell says so
      const M = c.R.reps.matrix.machine_stable_compound || {};
      const cell = M[c.R.reps.goal_column[c.derived.goal] || 'general'] || M.general || {};
      if (!cell.myo_if_last) return false;
    }
    if ((IN.never_credit_classes || []).includes(x.ex.credit_class)) return false;
    if (x.ex.credit_class === 'ISO_CALF' && (IN.never_calves_hotspots || []).some(h => hot.has(h))) return false;
    // (fix round 2 / F3 minimal seam, E-193: dose never puts a MYO set on a barbell / axial-high lift, a Nordic curl or a sissy squat)
    if ((IN.never_tags || []).some(t => (x.ex.tags || []).includes(t))) return false;
    if (IN.never_id_re && new RegExp(IN.never_id_re).test(x.ex.id)) return false;
    return true;
  };
  return res.slice(i + 1).every(x => !could(x));
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
    if (!c.R.stairway.limits.older_cap_retired) for (const w of c.weeks) for (const [m, s] of Object.entries(w.step_by_muscle || {})) if (typeof s === 'number' && s > P.step_cap + EPS) out.push(viol({ week: w.n }, k, { rule: 'older_step_cap', muscle: m, step: s }));
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
  // Focus muscle 1 / 2 (R3-SES-01): at most 2 slots; v_taper takes both
  const FO = c.R.volume.focus || { max: c.R.volume.priority.max_muscles, uses_both_slots: [] };
  const pr = c.targets.priority || [];
  const choices = Array.isArray(c.derived.priority_choices) ? c.derived.priority_choices : pr;
  const slots = choices.reduce((a, x) => a + ((FO.uses_both_slots || []).includes(x) ? 2 : 1), 0);
  return slots > FO.max ? [viol({}, 'check.v8_priorities', { count: slots, max: FO.max })] : [];
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
    for (const r of c.rows.filter(x => x.w === w && x.ex && x.ex.axial && !isTestTop(x))) {
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
  const isPriorityIso = (r) => !!r.ex && r.bd && ['isolation', 'focus'].includes(r.bd.kind) && (priority.includes(r.ex.primary_muscle) || priority.includes(c.X.lineOf[r.ex.primary_muscle]));
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
    // v0.4 fix round 2 / F1 (E-151; RECHECK v0.4 05 major: 'max-intent' throws after a full strength circuit passed H03): a ballistic or
    // throw station of a circuit day comes before the day's circuit strength stations - it opens the first circuit
    const circRows = rows.filter(r => r.b.kind === 'circuit');
    const firstCircStrength = circRows.find(r => r.bd && RESISTANCE_KINDS.includes(r.bd.kind));
    if (firstCircStrength) for (const r of circRows) if (r.it.athletic && ['ballistic', 'throw'].includes(r.it.athletic.quality) && r.idx > firstCircStrength.idx) out.push(viol(where(r), K.h03, { rule: 'circuit_power_after_strength' }));
    // horizontal before vertical (D-30: exempt when the vertical item is the work)
    for (const [hb, vb] of HV_PAIRS) {
      const h = rows.find(r => r.it.bucket === hb), v = rows.find(r => r.it.bucket === vb);
      // (a strength test is its lift's top set: it takes the lift's role - v0.4 fix round 1, E-91: the class model tests its press)
      const roleOf = (r) => (isTestTop(r) ? ((rows.find(x => x.it.slot_id === String(r.it.slot_id).replace(/\.test$/, '')) || r).it.role) : r.it.role);
      if (h && v && v.idx < h.idx && roleOf(v) !== 'work') out.push(viol(where(v), K.h04, { horizontal: hb, vertical: vb }));
    }
    // the work first (or the moved priority isolation)
    const strength = rows.filter(r => r.b.kind === 'strength' && !isTestTop(r)); // a test top set sits right before its lift
    const conjugate = c.R.session.exercises_per_group.exempt_families.includes(c.family); // conjugate days stay as written
    if (!conjugate && strength.some(r => r.it.role === 'work') && strength[0].it.role !== 'work' && !isPriorityIso(strength[0])) out.push(viol(where(strength[0]), 'check.v12_order', { rule: 'work_first', role: strength[0].it.role || 'none' }));
    // bilateral before unilateral (lower region) unless the unilateral lift is the work; days without a work lift are
    // written in the coach's order (e.g. hybrid_crossfit.5 FRI: single-leg hinge, then a non-axial hinge)
    const bi = rows.find(r => ['RP_BKD', 'RP_BHD'].includes(r.it.bucket)), uni = rows.find(r => ['RP_UKD', 'RP_UHD'].includes(r.it.bucket));
    if (bi && uni && uni.idx < bi.idx && uni.it.role !== 'work' && strength.some(r => r.it.role === 'work')) out.push(viol(where(uni), 'check.v12_order', { rule: 'bilateral_before_unilateral' }));
    // MYO only on the day's last resistance item
    const res = rows.filter(isRes);
    const lastRes = res.length ? res[res.length - 1] : null;
    for (const r of rows) if (r.it.effort && r.it.effort.last_set === 'myo' && r !== lastRes && !myoLastEligible(r, res, c)) out.push(viol(where(r), 'check.v12_order', { rule: 'myo_not_last' }));
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
    const rows = c.dayRows(w, d).filter(r => !S.outside_cap_blocks.includes(r.b.kind) && !isTestTop(r));
    let count = rows.length;
    // v0.4 fix round 1 / F2: the low-amplitude ankle block (low contacts in the ankle bucket) is prep work outside the 12 + 2 count
    const ABk = c.R.athletic.f2 && c.R.athletic.f2.ankle_block;
    const ankleRows = ABk && ABk.outside_athlete_cap ? rows.filter(r => r.it.bucket === 'AP_JUMP_LIMITED_KNEE' && r.it.athletic && r.it.athletic.key === 'low_contacts').length : 0;
    if (S.small_iso_superset_counts_as_one) {
      const groups = new Map();
      for (const r of rows) if (r.it.superset && r.bd && r.bd.kind === 'isolation' && r.ex && r.ex.primary_muscle && c.R.muscles.defs[r.ex.primary_muscle] && c.R.muscles.defs[r.ex.primary_muscle].class === 'small') groups.set(r.it.superset, (groups.get(r.it.superset) || 0) + 1);
      for (const n of groups.values()) if (n >= 2) count -= n - 1;
    }
    const minutes = typeof d.minutes_limit === 'number' ? d.minutes_limit : c.meta.session_minutes;
    // D-34: when the cut order cannot go further (never below 2 per group, never-cut roles) the day is kept and carries
    // warning.long_day - an over-cap day with that warning is the contract's answer, not an error.
    const warned = ['warning.long_day', 'warning.long_day_optional', 'warning.test_day_long'].some(key => c.hasWarning(key, a => a.day === d.weekday || a.day === 'weekday.' + d.weekday));
    if (d.full_body === false && ['main', 'optional'].includes(d.kind) && count > capFor(minutes) && !warned) out.push(viol(whereDay(w, d), k, { rule: 'split_day_cap', count, cap: capFor(minutes) }));
    // R2-SES-04 / R3-SES-01: 12 + the 2-exercise core block for field athletes - never excused by a long-day warning (v0.4)
    if (c.family === 'athletic' && ['main', 'optional'].includes(d.kind) && count - ankleRows > S.athlete_cap && (S.athlete_cap_hard || !warned)) out.push(viol(whereDay(w, d), k, { rule: 'athlete_cap', count: count - ankleRows, cap: S.athlete_cap }));
    if (typeof d.est_minutes === 'number' && typeof minutes === 'number' && d.est_minutes > minutes * S.long_day.warn_above_factor + EPS && !warned) out.push(viol(whereDay(w, d), k, { rule: 'long_day_without_warning', min: d.est_minutes, limit: minutes }));
  }
  // v0.4 fix round 1 (E-95; RECHECK 06 major: shoulders 30.5 sets with helper credit, 'validation still passes'): no line's weekly
  // sets (every day, helper credit included) climb past the Focus / priority absolute ceiling (BRAIN §5.9 guardrails,
  // rules.volume.priority.absolute_cap 30); a week 1 whose structure already sits above it is not a climb
  const ABS = c.R.volume.priority && c.R.volume.priority.absolute_cap;
  if (typeof ABS === 'number') for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    if (!ws.length) continue;
    const w1 = ws[0].weekly_sets_by_line || {};
    for (const w of ws) for (const [l, v] of Object.entries(w.weekly_sets_by_line || {})) {
      if (typeof v === 'number' && v > ABS + EPS && v > (typeof w1[l] === 'number' ? w1[l] : 0) + EPS) out.push(viol({ week: w.n }, k, { rule: 'line_absolute_cap', muscle: l, sets: v, cap: ABS }));
    }
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
    // a test top set is not a stairway set - unless the test replaces the lift's top set (v0.4 fix round 1, E-91: it is one of the
    // lift's planned sets, the back-off sets follow)
    if (r.ex.tags.some(t => C.never_credit_tags.includes(t)) || (isTestTop(r) && !testReplaces(c, r))) expected = {};
    if (r.it.role === 'prehab' && c.R.prehab && c.R.prehab.credits === 'none') expected = {}; // joint care credits nothing (E-89)
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
    // one whole set may always be added in a week (12 v1.2 §3.7.4: a 10-set week could otherwise never climb, PROPOSED)
    if (!(b.total_resistance_sets < (1 + L.total_weekly_ceiling) * a.total_resistance_sets - EPS) && b.total_resistance_sets > a.total_resistance_sets + 1 + EPS) out.push(viol({ week: b.n }, k, { rule: 'total_rise', from: a.total_resistance_sets, to: b.total_resistance_sets }));
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
        const lastOk = r === lastRes || myoLastEligible(r, res, c);
        if (!lastOk || !isoOrMachine || !when || E.myo.never_in_block_types.includes(w.block_type)) out.push(viol(where(r), k, { rule: 'myo_rule', last: lastOk ? 1 : 0, iso_or_machine: isoOrMachine ? 1 : 0, when: when ? 1 : 0 }));
      }
      if (w.block_type === 'recovery') {
        if (!(e.min >= recoveryMin)) out.push(viol(where(r), k, { rule: 'recovery_rir', min: e.min }));
        continue;
      }
      if (e.min < band[0] - EPS || e.max > band[1] + EPS) out.push(viol(where(r), k, { rule: 'rir_band', min: e.min, max: e.max }));
      if (!strengthFamily && isRes(r) && w.planned_rir) {
        const lo = Math.max(clamp(w.planned_rir.min, band[0], band[1]), neverFail ? E.compound_floor_rir : band[0]);
        // v0.4 fix round 1 (E-91): the back-off sets after a rep-max test run a step easier (rules.tests.replaces_top_set)
        const RT = c.R.tests && c.R.tests.replaces_top_set;
        const add = (r.it.flags || []).includes('back_off') && RT ? Math.max(RT.back_off_rir_add || 1, (RT.back_off_rir_min || 2) - w.planned_rir.min) : 0;
        const hi = Math.min(band[1], Math.max(clamp(w.planned_rir.max, band[0], band[1]), lo) + add);
        if (e.min < lo - EPS || e.min > hi + EPS || e.max > hi + EPS) out.push(viol(where(r), k, { rule: 'planned_rir', min: e.min, max: e.max, planned_min: w.planned_rir.min, planned_max: w.planned_rir.max }));
      }
    }
  }
  return out;
}

function v18Minimums(c) {
  const out = [], k = 'check.v18_minimums';
  const pain = c.targets.pain_muscles || [];
  const calvesExempt0 = pain.includes('calves') || (c.targets.fill || {}).calves === 'credit';
  const perLegDay = typeof c.targets.calves_per_leg_day === 'number' ? c.targets.calves_per_leg_day : c.R.volume.calves.per_leg_day.L1;
  for (const w of c.weeks) {
    if (w.block_type !== 'stairway') continue;
    const ntd = c.notTrained(null, w.training_block);
    const calvesExempt = calvesExempt0 || ntd.includes('calves');
    let rear = 0, upper = 0, rearRows = 0;
    for (const d of w.days || []) {
      const rows = c.dayRows(w, d);
      const isCalf = (r) => r.it.bucket === 'ISO_CALF' || (r.ex && r.ex.credit_class === 'ISO_CALF');
      rear += rows.filter(r => r.ex && REAR_CLASSES.includes(r.ex.credit_class)).length;
      // v0.4 fix round 1 (COACH-R3 R3-VOL-01 'rear delts ... get worked when you do back'; RECHECK 05 major: a forced rear-delt swap
      // took the coach's side-raise slot): the week's rows count toward the rear delts too
      rearRows += rows.filter(r => r.ex && ['HPULL', 'VPULL'].includes(r.ex.credit_class)).reduce((a, r) => a + (r.it.sets || 0) * ((r.it.credits || {}).rear_delts || 0), 0);
      upper += rows.filter(r => isRes(r) && regionOf(r, c.R) === 'upper').length;
      if (d.kind !== 'main') continue;
      // v0.4 B4 (E-64): a class lift kept for a lower group not trained directly does not make a leg day (calves per leg day)
      const keptCL = c.notTrained('class_lift', w.training_block);
      const lowerDay = rows.some(r => isRes(r) && regionOf(r, c.R) === 'lower' && !isCalf(r) && !(classLiftRow(c, r) && keptCL.includes(groupOf(r, c.model))));
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
    // (v0.4 fix round 1, E-93: the rear delts are worked with the back - R3-VOL-01 -, so a week whose back the time check leaves
    // untrained directly, with no row left, is told so in time_check and not judged here; V29 warns on the push : pull balance)
    if (upper > 0 && rear === 0 && rearRows < (c.R.volume.rear_from_rows_min || 2) - EPS && !pain.includes('rear_delts') && !pain.includes('shoulders') && !ntd.includes('shoulders') && !ntd.includes('back')) out.push(viol({ week: w.n }, k, { rule: 'rear_delt_weekly' }));
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
  const sportOf = (() => { try { return c.meta.profile && c.model.hasSport(c.meta.profile.id) ? c.model.sport(c.meta.profile.id) : null; } catch { return null; } })();
  const famOk = (e, v) => {
    const fam = e.athletic && e.athletic.olympic_family;
    // v0.4 B4 (integration, random sweep): a jerk / unnamed station takes any Olympic-family lift (select.variantPool), never a
    // triple-extension record with no Olympic family (a body-weight squat to calf raise is not an Olympic lift)
    if (!v || v === 'jerk') return !!fam;
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
    && !olympicAboveCeiling(e, sportOf, c.R, c.derived) // F2: the sport's Olympic ceiling (select's filter)
    && famOk(e, v);
  const pool = c.model.bySlot('AP_TRIPLE_EXT');
  const ath = c.meta.athletic || {};
  // (a day whose lift asks for a family no record can fill for this client keeps the other family - select's relaxed step)
  const possibleFor = (r, v) => pool.some(e => possible(e, v, r.w));
  for (const w of c.weeks) {
    const rows = c.rows.filter(r => r.w === w && r.it.bucket === 'AP_TRIPLE_EXT' && r.ex);
    const heavyGameWeek = w.block_type === 'in_season' && ath.game_heavy && ath.heavy_play_week;
    const asked = (w.days || []).filter(d => d.kind === 'main').flatMap(d => templateStations(c, d))
      .filter(st => st.bucket === 'AP_TRIPLE_EXT' && (st.include_from_minutes === null || st.include_from_minutes === undefined || st.include_from_minutes <= (c.meta.session_minutes || 0)));
    const needed = asked.some(st => pool.some(e => possible(e, st.variant, w)));
    // (fix round 2 / F2, E-172: the class model's end-test week of a strength test runs no Olympic work - OBSERVED class cycle WK 8)
    const classEndTest = !!(c.R.athletic.r2 && c.R.athletic.r2.tests && c.R.athletic.r2.tests.class_end_week_olympic === 'off') && c.family === 'hybrid_crossfit' &&
      !!(w.test && w.test.type === 'end' && (w.test.items || []).includes('strength')) && !!(w.athletic_budget && w.athletic_budget.test_dose === 'class_no_power');
    if (needed && !heavyGameWeek && !rows.length && !c.blockOff('power', w.training_block) && !classEndTest) out.push(viol({ week: w.n }, k, { rule: 'olympic_every_week' }));
    const days = new Set(rows.map(r => r.d.weekday));
    if (days.size > O.per_week_max) out.push(viol({ week: w.n }, k, { rule: 'per_week_max', exposures: days.size, max: O.per_week_max }));
    for (const r of rows) {
      const tier = r.ex.athletic && r.ex.athletic.olympic_tier;
      const l2plusOk = level === 'L3' || (level === 'L2' && w.exercise_block >= 2);
      if (tier === 'L2_plus' && !l2plusOk) out.push(viol(where(r), k, { rule: 'tier', tier, level: level || 'none', exercise_block: w.exercise_block }));
      const variant0 = stationVariant(c, r);
      // v0.4 fix round 2 / F2 (R2-ATH-04 'cleans squatty, snatches hingy'; athletic.olympicVariantByDay): a clean / snatch station
      // takes the family of the day's lower-body work lift - the item says which (`clean_day` / `snatch_day`), and where the day
      // holds a lower-body work lift the family must be that lift's (`day_lift`)
      const flags = r.it.flags || [];
      const said = flags.includes('snatch_day') ? 'snatch' : flags.includes('clean_day') ? 'clean' : null;
      const byDay = !!(c.R.athletic.r2 && c.R.athletic.r2.selection && c.R.athletic.r2.selection.olympic_by_day_lift) && ['clean', 'snatch'].includes(variant0);
      const variant = byDay && said ? said : variant0;
      const fam = r.ex.athletic && r.ex.athletic.olympic_family;
      if (variant && fam && variant !== 'jerk') {
        const pv = O.day_pattern[variant], pf = O.day_pattern[fam];
        if (pv && pf && pf !== 'either' && pf !== pv) out.push(viol(where(r), k, { rule: 'day_pattern', station: variant, family: fam }));
      }
      if (byDay && said) {
        const wl = c.rows.find(x => x.w === r.w && x.d === r.d && x.it.role === 'work' && ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'].includes(x.it.bucket));
        const want = wl ? olympicVariantByDay(variant0, wl.it.bucket, c.R) : null;
        const pf = fam ? O.day_pattern[fam] : null;
        if (want && pf && pf !== 'either' && pf !== O.day_pattern[want] && possibleFor(r, want)) out.push(viol(where(r), k, { rule: 'day_lift', lift: wl.it.bucket, family: fam }));
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

/**
 * V22 / H17 (v0.4, R2-VOL-06 + R3-VOL-01 / R3-SES-01 / R3-SES-02): every directly trained FOCUS group holds the floor of 10 sets a
 * week on the main days of a stairway week, counted with group credit (a set counts at most 1.0 to a group); calves hold the
 * weekly floor one calf exercise a leg day can carry (10 from 3 leg days) and 3 sets a leg day (V18). No warning exempts a
 * trained group. A group the time check leaves to compound credit is listed in plan.time_check.not_trained_directly (reason
 * 'time') and has no direct exercise in the week; a listed group that is still trained, or an unlisted group under its floor,
 * is a violation. Exempt: pain-reduced lines, credit-only lines, maintenance / pre-season / in-season / taper / recovery weeks.
 */
function v22Floor(c) {
  const out = [], k = 'check.v22_floor', floor = c.R.volume.floor.value;
  const X = c.X;
  const T = c.targets;
  const pain = T.pain_muscles || [], credit = T.credit_only || [];
  const fg = T.floor_groups || [];
  // a big mover that holds the day's work lift and cannot hold 10 sets in the chosen minutes is listed as trained below the floor
  // (plan.time_check.trained_below_floor, reason work_lift_time; it still climbs, H21) - the only floor exemption (E-11)
  const groupsWithLines = (g) => (X.linesOfGroup[g] || []).filter(l => (T.lines || Object.keys(T.start || {})).includes(l));
  const floored = fg.filter(g => groupsWithLines(g).length && !groupsWithLines(g).some(l => pain.includes(l)) && !groupsWithLines(g).every(l => credit.includes(l)));
  const maxIso = c.R.placement.max_sets_isolation, climbC = (c.R.stairway.min_climb && c.R.stairway.min_climb.calves) || 1;
  for (const w of c.weeks) {
    if (w.block_type !== 'stairway') continue;
    const ntd = c.notTrained(null, w.training_block), below = c.belowFloor(w.training_block);
    const kept = c.notTrained('class_lift', w.training_block); // v0.4 B4 (E-64): the class lift a group not trained directly keeps
    const gc = {}, direct = {};
    let legDays = 0;
    for (const d of w.days || []) {
      const rows = c.dayRows(w, d);
      if (d.kind === 'main' && rows.some(r => isRes(r) && r.ex && r.ex.credit_class === 'ISO_CALF')) legDays++;
      if (d.kind !== 'main') continue;
      for (const r of rows) {
        // every credited set of a main day counts (joint care such as KB face pulls included, R2-LIB-04); a test top set credits nothing
        const gcr = groupCredits(c.model, r.it.credits || {});
        for (const [gg, v] of Object.entries(gcr)) gc[gg] = (gc[gg] || 0) + (typeof r.it.sets === 'number' ? r.it.sets : 0) * v;
        if (!isRes(r)) continue;
        // an exercise trains a group directly when the group is its main mover (a full set of group credit); a station that
        // credits nothing (a medball press, a skill) or only helper credit does not
        const g = groupOf(r, c.model);
        if (g && kept.includes(g) && classLiftRow(c, r)) continue;
        // (fix round 2 / F1, E-145: a pattern station of a group not trained directly - one exercise, fixed sets - is not direct training)
        if (r.it.origin === 'pattern_kept') continue;
        if (g && (gcr[g] || 0) >= 1 - EPS) direct[g] = (direct[g] || 0) + 1;
      }
    }
    for (const g of ntd) if (direct[g]) out.push(viol({ week: w.n }, k, { rule: 'listed_but_trained', group: g, exercises: direct[g] }));
    // v0.4 fix round 2 / F1 (E-139; BRAIN V5b): with fewer than rules.volume.calves.optional_slot_below_leg_days main leg days the
    // optional day's Calves slot counts toward the calves' floor (one calf exercise x 3 sets per leg day stays on the main days)
    const OSB = c.R.volume.calves.optional_slot_below_leg_days;
    if (typeof OSB === 'number' && legDays < OSB) for (const d of w.days || []) {
      if (d.kind === 'main') continue;
      for (const r of c.dayRows(w, d)) if (isRes(r) && r.ex && r.ex.credit_class === 'ISO_CALF' && r.it.origin !== 'pattern_kept') gc.calves = (gc.calves || 0) + (typeof r.it.sets === 'number' ? r.it.sets : 0) * Math.min(1, groupCredits(c.model, r.it.credits || {}).calves || 0);
    }
    for (const g of floored) {
      if (ntd.includes(g) || below.includes(g)) continue;
      // calves: 3 sets a leg day; one calf exercise a leg day reaches the weekly 10 from 3 leg days (R3-SES-01); a timed circuit's
      // calf station runs its rounds (3 a leg day)
      const need = g === 'calves' ? (w.circuit ? c.R.volume.calves.per_leg_day.L1 * legDays : Math.max(c.R.volume.calves.per_leg_day.L1 * legDays, Math.min(c.R.volume.calves.weekly_floor, maxIso * legDays - climbC))) : floor;
      const v = Math.round((gc[g] || 0) * 100) / 100;
      if (v < need - EPS) out.push(viol({ week: w.n }, k, { muscle: g, sets: v, floor: need }));
    }
  }
  return out;
}

/** v0.4 B4 (E-64): an item that is the class model's kept work lift (rules.session.time_fit.keep_work_lift) */
function classLiftRow(c, r) {
  const KWL = c.R.session.time_fit && c.R.session.time_fit.keep_work_lift;
  return !!(KWL && (KWL.families || []).includes(c.family) && (KWL.roles || []).includes(r.it.role) && r.it.origin !== 'bonus' && r.it.origin !== 'focus_added');
}

function v23Groups(c) {
  const out = [], k = 'check.v23_exercises_per_group', G = c.R.session.exercises_per_group;
  if (G.exempt_families.includes(c.family)) return out;
  const [lo, hi] = G.full_body_day;
  for (const w of c.weeks) for (const d of w.days || []) {
    if (d.kind !== 'main') continue;
    // v0.4 fix round 2 / F1 (E-150; RECHECK v0.4 05 major: Friday trained chest and shoulders with one station each while V23 skipped
    // circuit days): a circuit day trains a group with 0 or 2+ stations (COACH-R3 R3-SES-01 'never 1'); D-71's relief stays on the
    // maximum only (a whole-body round may hold more stations of a group)
    const circuitDay = d.format === 'circuit';
    const counts = {}, lone = {};
    for (const r of c.dayRows(w, d)) if (isRes(r)) { const g = groupOf(r, c.model); if (g) { counts[g] = (counts[g] || 0) + 1; lone[g] = r; } }
    for (const g of c.R.muscles.groups.order) {
      if (G.exempt_groups.includes(g) || !counts[g]) continue;
      const n = counts[g];
      // v0.4 B4 (E-64): in the class model the day's work lift may stand alone for its group - it is the day's named class lift
      // (a group the time check does not train directly keeps it; the class's strength piece, OT18)
      if (n === 1 && classLiftRow(c, lone[g])) continue;
      // (fix round 2 / F1, E-145: a group not trained directly keeps one pattern station, paired with the day's work lift)
      if (n === 1 && lone[g].it.origin === 'pattern_kept') continue;
      if (n < lo || (!circuitDay && d.full_body !== false && n > hi)) out.push(viol(whereDay(w, d), k, { group: g, count: n, min: lo, max: !circuitDay && d.full_body !== false ? hi : 'none' }));
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
  const tol = RC.tolerance || 0.25;
  const pmax = RC.per_set_max || {};
  // v0.4 stage B2: the reactive and ballistic jumps are one family (the athletic stairway moves their goals to the jump stations a
  // week holds); the families of the climb (contacts, throws, cuts, sprint metres)
  const B2 = !!c.R.athletic.split;
  const FAM = RC.climb_families || { contacts: ['plyo_contacts', 'jump_contacts', 'low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] };
  const sum = (o, keys) => keys.reduce((a, k) => a + (typeof (o || {})[k] === 'number' ? o[k] : 0), 0);
  const has = (o, keys) => keys.some(k => typeof (o || {})[k] === 'number');
  for (const w of c.weeks) {
    const ab = w.athletic_budget;
    if (!ab || !ab.targets || !ab.planned) continue;
    const t = ab.targets, p = ab.planned;
    if (typeof t.olympic_sets === 'number' && t.olympic_sets > 0 && typeof p.olympic_sets === 'number') {
      const per = c.family === 'hybrid_crossfit' && c.R.reps.class_levels ? c.R.reps.class_levels.power[0].sets : (O.min_per_exposure || 2);
      const limit = Math.max((RC.olympic_max_factor || 1.5) * t.olympic_sets, per * exposures);
      if (p.olympic_sets > limit + EPS) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: 'olympic_sets', planned: p.olympic_sets, target: t.olympic_sets }));
    }
    // over the budget (per key; B2: reactive + ballistic jumps together)
    const overKeys = B2 ? [['jumps', ['plyo_contacts', 'jump_contacts']], ['throws', ['throws']], ['cod_cuts', ['cod_cuts']], ['sprint_m', ['sprint_m']]]
      : ['plyo_contacts', 'jump_contacts', 'throws', 'cod_cuts', 'sprint_m'].map(k => [k, [k]]);
    for (const [name, keys] of overKeys) {
      if (!keys.every(k => typeof t[k] === 'number') || !has(p, keys)) continue;
      const tt = sum(t, keys), pp = sum(p, keys);
      const limit = tt * (1 + tol) + Math.max(...keys.map(k => pmax[k] || 0));
      if (pp > limit + EPS) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: name, planned: pp, target: tt }));
    }
    if (!B2) continue;
    // v0.4 fix round 1 / F2 (R2-ATH-01; RECHECK 03 blocker: 85 % plyometric against 45 %): the planned plyo share stays within the
    // tolerance of the week's target - a week over it while a planned plyometric item (ankle work, a reactive jump) still sits above
    // its minimum dose, or the ankle block runs more than one set, is a planning error (the stairway lowers those first)
    const SHR = c.R.athletic.f2 && c.R.athletic.f2.share;
    // (fix round 2 / F2, E-165: a week whose timed tests replaced stations, or whose tested days run the baseline dose, is read by its tests)
    if (SHR && SHR.enforce && !ab.test_replaced && !ab.test_dose && typeof ab.plyo_share === 'number' && typeof ab.planned_share === 'number' && ab.planned_share > ab.plyo_share + SHR.tolerance + EPS) {
      const roomy = c.rows.filter(r => r.w === w && r.ex && r.it.athletic && ['plyo_contacts', 'low_contacts'].includes(r.it.athletic.key) && typeof t[r.it.athletic.key] === 'number')
        .some(r => r.it.athletic.per_set > perSetBounds(c.model, r.it.athletic.key, r.ex, 1).lo + EPS || (r.it.athletic.key === 'low_contacts' && r.it.sets > 1));
      if (roomy) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: 'share', code: 'share_over', planned: ab.planned_share, target: ab.plyo_share }));
    }
    // B2 under the goal the athletic stairway set (the sport target, scaled to what the block's stations hold; E-29)
    const g = ab.goals || {};
    for (const [name, keys] of Object.entries(FAM)) {
      if (!has(g, keys)) continue;
      const gg = sum(g, keys), pp = sum(p, keys);
      if (gg > 0 && pp > 0 && pp < (1 - tol) * gg - Math.max(...keys.map(k => pmax[k] || 0)) - EPS) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: name, code: 'under', planned: pp, goal: gg }));
      // a goal is never above the sport target (the stairway scales down, never up)
      const tt = sum(t, keys);
      // (fix round 2 / F2, E-164: a pre-season block plans its sprint metres and cuts at or above the last off-season week, R2-PER-06)
      const PHk = c.R.athletic.r2 && c.R.athletic.r2.pre_season_hold && w.block_type === 'pre_season' ? (c.R.athletic.r2.pre_season_hold.keys || []) : [];
      if (has(t, keys) && gg > tt * (1 + EPS) + 1 && !keys.some(k => PHk.includes(k))) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { key: name, code: 'goal_over_target', goal: gg, target: tt }));
    }
  }
  if (!B2) return out;
  // B2: inside a stairway block the athletic work never drops (contacts, throws, cuts, sprint metres, Olympic sets); the block's
  // peak below 60 % of the sport target is told to the client (warning.athletic_capacity); stage-3 plyometric stations hold a
  // repeated-contact drill only; the Receive-Create stage and the jump exercises hold for the whole exercise block; sport-only
  // COD drills stay with their sport
  // v0.4 fix round 1 / F2: the jumps and the ankle work are told apart ('jumps' / 'ankle' cover the contacts family), and a family
  // that climbs across the block but not every week is told with warning.athletic_capacity_block
  const warnedFam = new Set(c.warnings.filter(x => ['warning.athletic_capacity', 'warning.athletic_capacity_block'].includes(x.key) && x.args)
    .flatMap(x => { const f = String(x.args.key).replace('athletic.key.', ''); return [f, ...(['jumps', 'ankle'].includes(f) ? ['contacts'] : []), ...(f === 'contacts' ? ['jumps', 'ankle'] : [])].map(k => k + '|' + x.args.training_block); }));
  for (const tb of c.tbs.filter(x => x.type === 'stairway')) {
    const ws = c.weeks.filter(w => w.training_block === tb.n && w.athletic_budget && w.athletic_budget.planned);
    for (let i = 1; i < ws.length; i++) {
      const a = ws[i - 1].athletic_budget, b = ws[i].athletic_budget;
      for (const [name, keys] of [...Object.entries(FAM), ['olympic_sets', ['olympic_sets']]]) {
        const pa = sum(a.planned, keys), pb = sum(b.planned, keys);
        const ta = sum(a.targets, keys), tb2 = sum(b.targets, keys);
        // v0.4 fix round 2 / F2 (E-165, R2-PER-07): the end-test week's tests replace stations and its tested days run the baseline
        // week's dose, so it may plan less than the week before - never more (`hold_over`)
        const R2t = c.R.athletic.r2 && c.R.athletic.r2.tests;
        if (R2t && b.hold) { if (pa > 0 && pb > pa + EPS && has(b.targets, keys) && tb2 > 0) out.push(viol({ week: ws[i].n }, 'check.v27_athletic_budget', { key: name, code: 'hold_over', planned: pb, prev: pa })); continue; }
        // (a week whose timed test replaced a station of the family is compared with that station counted)
        const rep = (x) => keys.reduce((acc, k) => acc + (x.test_replaced && typeof x.test_replaced[k] === 'number' ? x.test_replaced[k] : 0), 0);
        // (the plyo share is the coach's rule over the per-key doses, R2-ATH-01: a key the share moved this week - `share_moved` - in a
        // week still at or over its share target came down for the share: a new exercise block's drill with a smaller minimum dose)
        const forShare = (b.share_moved || []).some(k => keys.includes(k)) && typeof b.planned_share === 'number' && typeof b.plyo_share === 'number' && b.planned_share >= b.plyo_share - EPS;
        if (pa > 0 && pb > 0 && pb + rep(b) < pa - EPS && tb2 >= ta - EPS && !forShare) out.push(viol({ week: ws[i].n }, 'check.v27_athletic_budget', { key: name, code: 'athletic_drop', planned: pb, prev: pa }));
      }
    }
    // v0.4 fix round 2 / F2 (E-166; COACH-R3 R3-VOL-04 'natural growth throughout', R3-SES-02 step 4 'never flat'; RECHECK v0.4 01 / 02
    // majors: jumps held at 36 for six weeks, cuts at 72 for nine): a family whose stations are full at the block's peak (every dose
    // at its top) does not sit on that peak for most of the block while it is well under the sport target - the climb is spread over
    // the block (`early_peak`: the top total holds for more than half the block's weeks, plus the slack). A station a timed test
    // replaced counts as done.
    const FL = c.R.athletic.r2 && c.R.athletic.r2.flat;
    if (FL) {
      const seq = ws.filter(w => !w.athletic_budget.hold);
      for (const [name, keys] of Object.entries(FAM)) {
        const P = (w) => sum(w.athletic_budget.planned, keys) + keys.reduce((acc, k) => acc + (w.athletic_budget.test_replaced && typeof w.athletic_budget.test_replaced[k] === 'number' ? w.athletic_budget.test_replaced[k] : 0), 0);
        const Tg = (w) => sum(w.athletic_budget.targets, keys);
        const withP = seq.filter(w => P(w) > 0 && has(w.athletic_budget.targets, keys));
        if (withP.length < 4) continue;
        const last = withP[withP.length - 1];
        if (!(P(last) < Tg(last) * FL.under_target - EPS) || !(Tg(last) >= Tg(withP[0]) * (1 + FL.target_rise_min) - EPS)) continue;
        const items = c.rows.filter(r => r.w === last && r.ex && r.it.athletic && keys.includes(r.it.athletic.key) && typeof r.it.athletic.per_set === 'number');
        if (!items.length || !items.every(r => r.it.athletic.per_set >= perSetBounds(c.model, r.it.athletic.key, r.ex, 1).hi - EPS)) continue;
        const allowed = Math.ceil(withP.length / 2) + (FL.run_slack || 0);
        let run = 1;
        for (let i = withP.length - 2; i >= 0 && Math.abs(P(withP[i]) - P(last)) < EPS; i--) run++;
        // (the plyo share is the coach's rule over the per-key doses, R2-ATH-01: a peak the share moved a key of the family onto -
        // `share_moved` in any week of the run - is the share's doing, not the stairway's)
        const shareMoved = withP.slice(withP.length - run).some(w => (w.athletic_budget.share_moved || []).some(k => keys.includes(k)));
        // (a run that starts on the family's minimum doses could not have started lower: an earlier exercise block's drill whose
        // smallest set is the later drills' largest)
        const start = withP[withP.length - run];
        const startItems = c.rows.filter(r => r.w === start && r.ex && r.it.athletic && keys.includes(r.it.athletic.key) && typeof r.it.athletic.per_set === 'number');
        const atFloor = startItems.length > 0 && startItems.every(r => r.it.athletic.per_set <= perSetBounds(c.model, r.it.athletic.key, r.ex, 0).lo + EPS);
        if (run > allowed && !shareMoved && !atFloor) out.push(viol({ week: last.n }, 'check.v27_athletic_budget', { key: name, code: 'early_peak', planned: P(last), weeks: run, allowed, target: Tg(last) }));
      }
    }
    const peak = ws.filter(w => !w.athletic_budget.hold).slice(-1)[0];
    if (peak) {
      for (const [name, keys0] of Object.entries(FAM)) {
        const keys = keys0.filter(k => typeof (peak.athletic_budget.targets || {})[k] === 'number'); // keys with a sport target only
        const tt = sum(peak.athletic_budget.targets, keys), pp = sum(peak.athletic_budget.planned, keys);
        // (fix round 2 / F2, E-174: a timed circuit doses its ball station in a few full-intent throws a round - its weekly throws
        // are the rounds' doing, not a station the client could size up)
        const circuitOnly = c.rows.filter(r => r.w === peak && r.it.athletic && keys.includes(r.it.athletic.key)).every(r => r.b && r.b.kind === 'circuit');
        if (tt > 0 && pp > 0 && pp < tt * (RC.warn_below_share ?? 0.6) - EPS && !warnedFam.has(name + '|' + tb.n) && !circuitOnly) out.push(viol({ week: peak.n }, 'check.v27_athletic_budget', { key: name, code: 'capacity_not_told', planned: pp, target: tt }));
      }
    }
    // the stage and the jump exercises hold for the exercise block (PER-02, R2-ATH-03; RECHECK 01 / 02 / 08)
    const byEb = new Map();
    for (const w of c.weeks.filter(x => x.training_block === tb.n)) {
      const e = byEb.get(w.exercise_block) || { stage: w.plyo_stage, picks: new Map() };
      if (w.plyo_stage !== e.stage) out.push(viol({ week: w.n }, 'check.v27_athletic_budget', { code: 'stage_mid_block', stage: w.plyo_stage, block_stage: e.stage }));
      for (const r of c.rows.filter(x => x.w === w && ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket) && x.it.exercise_id && x.it.slot_id)) {
        const prev = e.picks.get(r.it.slot_id);
        if (prev && prev !== r.it.exercise_id) out.push(viol({ week: w.n, day: r.d.weekday, item: r.it.slot_id }, 'check.v27_athletic_budget', { code: 'jump_exercise_mid_block', from: prev, to: r.it.exercise_id }));
        e.picks.set(r.it.slot_id, r.it.exercise_id);
      }
      byEb.set(w.exercise_block, e);
    }
  }
  const sportId = (() => { try { return c.model.sport(c.meta.profile.id).sport; } catch { return null; } })();
  for (const r of c.rows) {
    const a = r.ex && r.ex.athletic;
    if (!a) continue;
    if (['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(r.it.bucket) && r.w.plyo_stage === 'RC3' && c.R.athletic.rc3_plyometric_response && a.quality === 'plyometric' && !a.upper && a.response && a.response !== c.R.athletic.rc3_plyometric_response) {
      out.push(viol({ week: r.w.n, day: r.d.weekday, item: r.it.slot_id }, 'check.v27_athletic_budget', { code: 'rc3_single_response', exercise: r.it.exercise_id }));
    }
    if (r.it.bucket === 'AP_COD' && Array.isArray(a.sport_only) && !a.sport_only.includes(sportId)) out.push(viol({ week: r.w.n, day: r.d.weekday, item: r.it.slot_id }, 'check.v27_athletic_budget', { code: 'sport_only_drill', exercise: r.it.exercise_id }));
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

/**
 * H21 (v0.4): the stairway climbs on every trained group (R2-PER-03 / R2-PER-04, R3-VOL-04, R3-SES-02 'never flat'). Per trained
 * floored group: the last week's group sets (all days, group credit) are at least the minimum climb (rules.stairway.min_climb:
 * 2 sets, 1 set in a block of 7 weeks or less, calves 1; half a set of rounding for quarter-set helper credit) above week 1,
 * and never drop week over week by a set
 * or more; per line the planned target never drops and the early steps are never larger than the late ones; the main-day total
 * rises; the last week is the hardest; the stair level rises and the planned RIR never rises. No warning exempts a group.
 */
function h21Stairway(c) {
  const out = [];
  const T = c.targets, X = c.X;
  const MC = c.R.stairway.min_climb || { group: 2, calves: 1 };
  const pain = T.pain_muscles || [];
  const fixedTemplate = (c.R.session.exercises_per_group.exempt_families || []).includes(c.family);
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    if (ws.length < 2) continue;
    const N = ws.length, stair = c.model.stair(N);
    const ntd = c.notTrained(null, tb.n);
    // a year plan's flat-sets quarter (Q1 'sets stay at the starting level', COACH-R2 R2-PER-01) holds its starts: no climb rule
    const flatSets = !!(tb.factor && tb.factor.flat_sets === true);
    const lines = (T.lines || []).filter(l => T.fill && T.fill[l] === 'target');
    for (const l of lines) {
      for (let i = 1; i < ws.length; i++) {
        const t0 = (ws[i - 1].target_by_muscle || {})[l], t1 = (ws[i].target_by_muscle || {})[l];
        if (typeof t0 === 'number' && typeof t1 === 'number' && t1 < t0 - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'target_drops', muscle: l, from: t0, to: t1 }));
      }
      const step = (w) => { const s = (ws[w - 1].step_by_muscle || {})[l]; return typeof s === 'number' ? s : null; };
      const early = [], late = [];
      for (let w = 2; w <= N; w++) { const s = step(w); if (s === null) continue; (w <= stair.halfway ? early : late).push(s); }
      if (early.length && late.length && Math.max(...early) > Math.min(...late) + EPS) out.push(viol({}, K.h21, { rule: 'early_step_larger', muscle: l, early: Math.max(...early), late: Math.min(...late) }));
    }
    if (!c.circuitPlan && !fixedTemplate) {
      const groups = (T.floor_groups || []).filter(g => !ntd.includes(g) && (X.linesOfGroup[g] || []).some(l => lines.includes(l)) && !(X.linesOfGroup[g] || []).some(l => pain.includes(l)));
      for (const g of groups) {
        const v = ws.map(w => { const x = (w.weekly_sets_by_group || {})[g]; return typeof x === 'number' ? x : null; });
        if (v.some(x => x === null)) continue;
        // a big mover kept below its floor (E-11; its work lift heavier by the week) climbs at least one set (v0.4 fix round 1, E-81)
        const need = g === 'calves' || c.belowFloor(tb.n).includes(g) ? MC.calves : (MC.short_block && N <= MC.short_block.max_N ? MC.short_block.group : MC.group);
        if (!flatSets && v[N - 1] - v[0] < need - 0.5 - EPS) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'stairway_flat', muscle: g, first: v[0], last: v[N - 1], need }));
        for (let i = 1; i < N; i++) if (v[i] < v[i - 1] - 0.5 - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'sets_drop', muscle: g, from: v[i - 1], to: v[i] }));
        // v0.4 fix round 1 (E-92; RECHECK 01 / 02 / 07 majors: groups flat for the last 6 weeks or 9 weeks in a row while the plan
        // printed 'climbing'): in a block of 8+ weeks a trained big group gains a set in the second half (COACH-R3 R3-VOL-04 'about
        // 5 % after the halfway week ... reaches its ceiling in the last week') and never holds its sets more than half the block
        // (R3-SES-02 step 4 'never flat'); the big movers only (small groups climb in 2-set bonus steps, E-86), never a group held
        // below the floor
        const HF = c.R.stairway.hold_rules || null;
        // (only for a group whose planned climb - its lines' ceiling minus start in meta.stairway - spans enough whole sets to spread)
        const blkS = Array.isArray(c.meta.stairway) ? c.meta.stairway.find(x => x.training_block === tb.n) : null;
        const w1L = ws[0].weekly_sets_by_line || {};
        const plannedClimb = blkS && blkS.start && blkS.cap ? Math.max(0, ...(X.linesOfGroup[g] || []).filter(l => typeof blkS.start[l] === 'number' && typeof blkS.cap[l] === 'number').map(l => blkS.cap[l] - Math.max(blkS.start[l], typeof w1L[l] === 'number' ? w1L[l] : 0))) : 0;
        const bigG = (X.linesOfGroup[g] || []).some(l => X.defs[l] && X.defs[l].class === 'big');
        // (a line that reaches the Focus / priority absolute ceiling holds there - BRAIN §5.9, V13 line_absolute_cap; E-95)
        const ABSC = c.R.volume.priority && c.R.volume.priority.absolute_cap;
        const atAbs = typeof ABSC === 'number' && (X.linesOfGroup[g] || []).some(l => ws.some(w => ((w.weekly_sets_by_line || {})[l] || 0) >= ABSC - 0.5 - EPS));
        // v0.4 fix round 2 / F1 (E-136; RECHECK v0.4 01 / 03 blockers: the main days held flat for 10 weeks while the climb sat on the
        // optional Saturday, and H21 passed on the all-days sets): a big group that is not a Focus muscle climbs on its MAIN days - its
        // minimum climb and the hold rules are read on main_sets_by_group too (the optional day carries a Focus muscle's slots and small
        // groups' bonuses only, COACH-ANSWER ORD-10 / ORD-11, COACH-R3 R3-VOL-03)
        const focusG = (T.priority || []).some(l => (X.linesOfGroup[g] || []).includes(l));
        const mainSeries = HF && HF.main_days && bigG && !focusG ? ws.map(w => { const x = (w.main_sets_by_group || {})[g]; return typeof x === 'number' ? x : null; }) : null;
        if (mainSeries && mainSeries.every(x => x !== null) && !flatSets && mainSeries[N - 1] - mainSeries[0] < need - 0.5 - EPS) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'main_days_flat', muscle: g, first: mainSeries[0], last: mainSeries[N - 1], need }));
        if (HF && !flatSets && N >= (HF.min_N || 8) && bigG && !atAbs && !c.belowFloor(tb.n).includes(g) && plannedClimb >= (HF.min_climb || 3) - EPS) {
          const half = Math.ceil(N / 2);
          const holdRules = (vs, tag) => {
            if (vs[N - 1] - vs[half - 1] < 0.5 - EPS) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'flat_second_half' + tag, muscle: g, from: vs[half - 1], to: vs[N - 1] }));
            // a hold = weeks whose sets stay within half a set of the run's first week (quarter-set helper drift is not a step)
            let run = 1, longest = 1, base = vs[0];
            for (let i = 1; i < N; i++) { if (Math.abs(vs[i] - base) < 0.5 - EPS) run++; else { run = 1; base = vs[i]; } longest = Math.max(longest, run); }
            const maxHold = half + (HF.hold_extra_weeks || 0);
            if (longest > maxHold) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'group_hold' + tag, muscle: g, weeks: longest, max: maxHold }));
          };
          holdRules(v, '');
          if (mainSeries && mainSeries.every(x => x !== null)) holdRules(mainSeries, '_main_days');
        }
      }
      const tm = ws.map(w => (typeof w.total_main_sets === 'number' ? w.total_main_sets : null));
      // a block that trains no group directly (every group listed in plan.time_check; the day's fixed work fills the minutes) has
      // no stairway on sets - its warning and offers say so (R3-SES-02)
      // v0.4 B4 (E-64): a class-model block whose groups are all left to their kept class lifts (3 sets, heavier by the week) trains
      // no group directly either - its main-day total is the class lifts' and holds
      const trainedAny = !c.plan.time_check || (() => { const tc = c.plan.time_check, b = (tc.by_block || []).find(x => x.training_block === tb.n) || tc; return !Array.isArray(b.trained_groups) || b.trained_groups.length > 0; })();
      if (!flatSets && trainedAny && tm.every(t => t !== null) && tm[N - 1] > EPS && tm[N - 1] <= tm[0] + EPS) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'total_flat', first: tm[0], last: tm[N - 1] }));
      // v0.4 fix round 2 / F1 (E-136): the main-day total holds (no rise over the week before) for at most half the block - or, when the
      // chosen minutes cannot hold the full plan (time_check.fits false), for the weeks its whole-set climb cannot fill (a climb of k sets
      // rises in k weeks at most); never 10 flat weeks after an early step
      const HF2 = c.R.stairway.hold_rules || null;
      if (HF2 && typeof HF2.total_hold_max_frac === 'number' && !flatSets && trainedAny && tm.every(t => t !== null) && tm[N - 1] > EPS && N >= 4) {
        let holds = 0;
        for (let i = 1; i < N; i++) if (tm[i] <= tm[i - 1] + EPS) holds++;
        const steps = Math.max(0, Math.round(tm[N - 1] - tm[0]));
        const tcB = c.plan.time_check ? ((c.plan.time_check.by_block || []).find(x => x.training_block === tb.n) || c.plan.time_check) : null;
        const limited = !!(tcB && tcB.fits === false);
        // (every trained group reaches its ceiling in the last week, R3-VOL-04: the groups' final steps share that week, so a climb of
        // k sets rises in k - (last-week groups - 1) weeks at most; random 286, three one- or two-set climbs ending together)
        const groupsUp = Object.keys(ws[N - 1].main_sets_by_group || {}).filter(g => ((ws[N - 1].main_sets_by_group || {})[g] || 0) - ((ws[N - 2].main_sets_by_group || {})[g] || 0) >= 0.5 - EPS).length;
        const together = Math.max(0, Math.min(Math.round(tm[N - 1] - tm[N - 2]), groupsUp) - 1);
        // (an added exercise opens at 2 sets in the first week of an exercise block, E-86: two of the climb's sets share that week;
        // sweep sport-rugby)
        let entries = 0;
        for (let i = 1; i < N - 1; i++) if (ws[i].exercise_block !== ws[i - 1].exercise_block) entries += Math.max(0, Math.min(2, Math.round(tm[i] - tm[i - 1])) - 1);
        const maxHolds = Math.max(Math.floor(N * HF2.total_hold_max_frac), limited ? (N - 1) - Math.max(0, steps - together - entries) : 0);
        if (holds > maxHolds) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'total_hold', holds, max: maxHolds }));
      }
    }
    if (c.circuitPlan) {
      const work = ws.map(w => (w.circuit && typeof w.total_resistance_sets === 'number' ? w.total_resistance_sets * w.circuit.work_s : null));
      // v0.4 B4 (integration, random sweep): a circuit block whose minutes hold no resistance station (every group listed in
      // plan.time_check, e.g. 3 x 30 min) has no stairway on sets, like the straight-set block above (total_flat) - its warning and
      // offers say so (R3-SES-02)
      if (work.every(x => x === null || x <= EPS)) work.fill(null);
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

/**
 * H22 (v0.4: planned stairway only - R2-VOL-03 'no check-in, no change', R3-VOL-02 / R3-VOL-04 'no check-ins ... kick out a
 * program, and that's it'): no step in a flat block or in week 1; every planned step of every stairway block equals the step
 * recomputed independently from that block's start and ceiling (meta.stairway); no check-in offer exists.
 */
function h22NoCheckin(c) {
  const out = [], S = c.R.stairway, L = S.limits, V = c.R.volume;
  if ((c.plan.offers || []).some(o => o && o.key === 'block.cannot_finish')) out.push(viol({}, K.h22, { rule: 'checkin_offer' }));
  const t = c.targets, fill = t.fill || {};
  const priority = t.priority || [], pain = t.pain_muscles || [];
  const slowOthers = !(V.focus && V.focus.slow_others === false);
  const older = c.age !== null && c.age >= c.R.population.older.from_age && !L.older_cap_retired;
  const isYear = c.meta.plan_mode === 'year';
  const yearLayout = (c.R.plan_types.year && c.R.plan_types.year.layout) || [];
  for (const w of c.weeks) if (w.block_type !== 'stairway' || w.stair_week === 1) {
    for (const [m, s] of Object.entries(w.step_by_muscle || {})) if (typeof s === 'number' && Math.abs(s) > EPS) out.push(viol({ week: w.n }, K.h22, { rule: 'step_in_flat_or_first_week', muscle: m, step: s }));
  }
  const stairMeta = Array.isArray(c.meta.stairway) ? c.meta.stairway : [];
  c.tbs.filter(tb => tb.type === 'stairway').forEach((tb) => {
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    const N = ws.length;
    if (N < 2) return;
    const stair = c.model.stair(N);
    const flat = isYear && yearLayout.some(l => l.type === 'stairway' && l.flat_sets && l.weeks[0] === tb.weeks[0]);
    const bm = stairMeta.find(x => x.training_block === tb.n) || {};
    const start = bm.start || t.start || {}, cap = bm.cap || t.cap || {};
    const lamMeta = bm.lambda || {};
    const dropped = new Set(bm.dropped_groups || []);
    for (const m of Object.keys(start)) {
      if (typeof start[m] !== 'number' || typeof cap[m] !== 'number' || ['credit', 'core_block'].includes(fill[m])) continue;
      if (dropped.has(c.X.groupOfLine[m])) continue;
      const caps = [L.planned_step_max];
      if (slowOthers && priority.length && !priority.includes(m)) caps.push(L.nonpriority_while_priority);
      if (older) caps.push(L.older_60plus);
      const painM = pain.includes(m);
      const plan = plannedStairway({ start: start[m], cap: cap[m] }, N, {
        early_late: stair.standard_steps, caps, freeze: painM ? V.pain.freeze_weeks : 0,
        after_freeze: painM ? L.pain_after_freeze : null, iterations: S.lambda.iterations
      });
      if (typeof lamMeta[m] === 'number' && Math.abs(lamMeta[m] - plan.lambda) > 1e-3) out.push(viol({}, K.h22, { rule: 'lambda_mismatch', muscle: m, claimed: lamMeta[m], recomputed: Math.round(plan.lambda * 1e4) / 1e4 }));
      for (let i = 1; i < N; i++) {
        const w = ws[i], s = (w.step_by_muscle || {})[m];
        if (typeof s !== 'number') { out.push(viol({ week: w.n }, K.h22, { rule: 'step_missing', muscle: m })); continue; }
        const expected = plan.lambda * plan.capped[i + 1];
        const okFlat = flat && Math.abs(s) <= EPS;
        if (!okFlat && Math.abs(s - expected) > 5.1e-4) out.push(viol({ week: w.n }, K.h22, { rule: 'step_not_planned', muscle: m, step: s, planned: Math.round(expected * 1e4) / 1e4 }));
      }
    }
  });
  return out;
}

function uniq(a) { return [...new Set(a)]; }
