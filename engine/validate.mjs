// engine/validate.mjs - plan validation (engine/CONTRACTS.md §4.9, §6). Owner: B4; v0.4 stage B1 (round 3).
// Pure: reads only the plan and the model; recomputes credits, weekly sets, stairway steps and group counts on its own
// (an independent cross-check of B2 / B3, never a call into their modules). Every number / list comes from model.rules.
// v0.4: the floor (V22 / H17) is read on the coach's FOCUS groups with group credit (R3-VOL-01, R3-SES-01); H22 = planned
// stairway only (no check-ins, R3-VOL-02 / R3-VOL-04); a rep-max test is a top-set item that counts no muscle sets (R2-PER-07).
// v0.5 (design/ENGINE_V05_PLAN.md; COACH-CT CT-01, COACH-CX, COACH-R4): NO check reads minutes. V3 fails a plan that still carries
// a session length, a minute limit, a time check or a time offer; V13 reads the session's exercise count (R4-SES-02), V15 the
// final target and its arrival week (CX-01, R4-PRG-01), V22 the floor from 3 training days and the 2-day rule (R4-SES-03), H21
// that sets never drop inside a stairway (the same sets may hold while reps or load progress, CX-02 / CX-03), H22 that every
// week's group target is the planned schedule's.
// v0.5 / V3 ("words and checks"): the v0.5 check list is complete - V21 is the liability gate (R4-SCP-01 / R4-SCP-02), V30 the
// coach's template skeleton and 'nothing dropped' (R4-SES-05, R4-SES-04), V31 optional add-ons (R4-LIB-01), V32 incline first
// (R4-LIB-03, warn), V33 no third-party video links (R4-LIB-05), V34 the progression rule (R4-PRG-03), V35 the acceleration note
// (R4-PRG-02), V36 the easy-to-remove list (R4-SES-04), V37 carries by distance or time (R4-LIB-02). rules.validation.v05.by_rule
// maps each v0.5 rule to its check.
import { EPS, forbiddenKeys, canonicalJSON, clamp } from './util.mjs';
import { linesOf, groupCredits } from './lines.mjs';
import { olympicAboveCeiling, perSetBounds, olympicVariantByDay } from './athletic.mjs';

/** check ids in run order */
export const CHECK_IDS = Object.freeze([
  ...Array.from({ length: 37 }, (_, i) => 'V' + (i + 1)),
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
// warning codes of the retired time fitting (CT-01): a plan that still carries one was not built by the v0.5 rules
const TIME_FIT_CODES = ['time_check', 'time_lower_peak', 'long_day', 'test_day_long', 'supersets_needed', 'start_lowered', 'not_trained_directly', 'below_floor_work_lift', 'floor', 'v3_short_athletes', 'minutes_competitive_only', 'stairway_time', 'maintenance_time'];
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
    V24: v24Blocks, V25: v25Tests, V26: v26Inputs, V27: v27AthleticBudget, V28: v28LateralityShare, V29: v29PushPull,
    V30: v30Skeleton, V31: v31Addons, V32: v32InclineFirst, V33: v33Video, V34: v34Progression, V35: v35Acceleration,
    V36: v36EasyToRemove, V37: v37CarryDose
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
    // (v0.5: a block the person switched off - engine/edit.mjs set_block - is not part of the plan's work)
    (d.blocks || []).forEach((b, bi) => (b.on === false ? [] : (b.items || [])).forEach(it => {
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
    edited: !!(plan && plan.edited),
    // v0.5: what the volume engine planned for a stairway block (meta.stairway): trained groups, the whole-set schedule, the
    // groups the template cannot hold at the floor (said so), the credit-only groups
    stairOf: (tbN) => (Array.isArray(meta.stairway) ? meta.stairway.find(x => x && x.training_block === tbN) : null) || null,
    creditOnly: (tbN) => { const b = (Array.isArray(meta.stairway) ? meta.stairway.find(x => x && x.training_block === tbN) : null); return (b && b.credit_only_groups) || []; },
    saidBelowFloor: (tbN) => { const b = (Array.isArray(meta.stairway) ? meta.stairway.find(x => x && x.training_block === tbN) : null); return (b && b.below_floor) || []; }
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
  const painLines = new Set((c.targets && c.targets.pain_muscles) || []);
  const defs = c.R.muscles.defs || {};
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
    // (v0.5 fix round 1, VOL-03: never on an exercise whose main mover is a muscle the plan cut for pain - dose's rule)
    if (IN.never_pain_muscle && painLines.size && Object.entries(x.ex.credits || {}).some(([m, cr]) => cr >= 1 && painLines.has((defs[m] && defs[m].line) || m))) return false;
    return true;
  };
  // v0.5 fix round 1 (rules.effort.intensifiers.x1; VOL-15, OBSERVED BYOP ATHLETIC G12 'MYO SET' on the leg extension): a calf raise
  // carries it only when the day holds no other exercise that may, and a one-side exercise gives way to a two-sided one - so the
  // last eligible item is read on the exercises the rule leaves
  const IX = IN.x1 || null;
  if (IX) {
    const isCalf = (x) => x.it.bucket === 'ISO_CALF' || (x.ex && x.ex.credit_class === 'ISO_CALF');
    const oneSide = (x) => !!x.ex && ['unilateral', 'alternating'].includes(x.ex.laterality);
    // (the item that carries the set is read with the others: no exercise the rule leaves may come after it)
    let pool = res.filter(x => x === r || could(x));
    const nonCalf = pool.filter(x => !isCalf(x));
    if (nonCalf.length) pool = nonCalf;
    const two = pool.filter(x => !oneSide(x));
    if (two.length) pool = two;
    return pool.length > 0 && pool[pool.length - 1] === r;
  }
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

/**
 * V3 (v0.5, CT-01 / COACH-R4 R4-SES-01): no time fitting. The plan carries no session length, no per-day minute limit, no time
 * check and no time offers - a session is sized by its exercise count (R4-SES-02) and the minutes are an estimate only.
 * (Until v0.4 this check was 'athlete session length'; the 30- and 45-minute rules went with the time check.)
 */
function v3ShortAthletes(c) {
  const out = [], k = 'check.v3_short_athletes';
  const p = c.plan || {};
  if (p.time_check !== undefined && p.time_check !== null) out.push(viol({}, k, { rule: 'time_check' }));
  if ((p.offers || []).some(o => o && typeof o.key === 'string' && o.key.startsWith('offer.'))) out.push(viol({}, k, { rule: 'time_offer' }));
  if (c.meta.session_minutes !== undefined && c.meta.session_minutes !== null) out.push(viol({}, k, { rule: 'session_minutes' }));
  if (c.derived.session_minutes !== undefined && c.derived.session_minutes !== null) out.push(viol({}, k, { rule: 'session_minutes' }));
  for (const w of c.weeks) for (const d of w.days || []) if (d.minutes_limit !== undefined && d.minutes_limit !== null) out.push(viol(whereDay(w, d), k, { rule: 'minutes_limit' }));
  for (const x of c.warnings) if (x && TIME_FIT_CODES.includes(x.code)) out.push(viol({}, k, { rule: 'time_warning', code: x.code }));
  return out;
}

function v4Youth(c) {
  const R = c.R, out = [], k = 'check.v4_youth';
  if (c.age === null || c.age >= R.levels.youth_age) return out;
  const order = R.levels.ladder_order, maxIdx = order.indexOf(R.levels.youth_max_ladder);
  const count = (c.derived.previous_cycles && c.derived.previous_cycles.count) || 0;
  for (const r of c.rows) {
    if (!r.ex) continue;
    // (fix round 2, rules.selection.x2.youth_level_exempt_re: the horizontal-push staples of his sheets are open to every level)
    const yx = R.selection.x2 && R.selection.x2.youth_level_exempt_re;
    if (order.indexOf(r.ex.level) > maxIdx && !(yx && new RegExp(yx).test(r.ex.id))) out.push(viol(where(r), k, { rule: 'ladder', exercise: r.ex.id, level: r.ex.level }));
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
    // v0.5 (COACH-R4 R4-SES-05): the coach's A / B day opens with the upper lift of the first pair (horizontal pull + squat,
    // horizontal push + hinge) - the work lift is in the day's first pair
    // (read on the order itself: the pair ids are not printed on a tested lift's day)
    const inWorkPair = (r) => r === strength[0] && r.it.role === 'paired_upper' && !!strength[1] && strength[1].it.role === 'work';
    // (v0.5 fix round 1, R2-PER-07: in a test week the tested lift opens the day's lifts - rules.tests.x1.tested_lift_first)
    const testFirst = !!(c.R.tests && c.R.tests.x1 && c.R.tests.x1.tested_lift_first) && strength.length > 0 && (isTestTop(strength[0]) || (strength[0].it.flags || []).includes('back_off'));
    if (!conjugate && !testFirst && strength.some(r => r.it.role === 'work') && strength[0].it.role !== 'work' && !isPriorityIso(strength[0]) && !inWorkPair(strength[0])) out.push(viol(where(strength[0]), 'check.v12_order', { rule: 'work_first', role: strength[0].it.role || 'none' }));
    // bilateral before unilateral (lower region) unless the unilateral lift is the work; days without a work lift are
    // written in the coach's order (e.g. hybrid_crossfit.5 FRI: single-leg hinge, then a non-axial hinge)
    const bi = rows.find(r => ['RP_BKD', 'RP_BHD'].includes(r.it.bucket)), uni = rows.find(r => ['RP_UKD', 'RP_UHD'].includes(r.it.bucket));
    if (bi && uni && uni.idx < bi.idx && uni.it.role !== 'work' && strength.some(r => r.it.role === 'work')) out.push(viol(where(uni), 'check.v12_order', { rule: 'bilateral_before_unilateral' }));
    // MYO only on the day's last resistance item
    const res = rows.filter(isRes);
    const lastRes = res.length ? res[res.length - 1] : null;
    // (an edited day may hold an exercise the person added after the intensifier's item, CX-04: the order of the generated day is not judged)
    for (const r of rows) if (!c.edited && r.it.effort && r.it.effort.last_set === 'myo' && r !== lastRes && !myoLastEligible(r, res, c)) out.push(viol(where(r), 'check.v12_order', { rule: 'myo_not_last' }));
    // core first after the warm-up (and an opening aerobic block)
    const coreIdx = blocks.findIndex(b => b.kind === 'core');
    if (corePos === 'start' && coreIdx > 0 && blocks.slice(0, coreIdx).some(b => !['warmup', 'aerobic'].includes(b.kind))) out.push(viol(whereDay(w, d), K.h05, { rule: 'core_not_first' }));
  }
  return out;
}

/**
 * V13 (v0.5, COACH-R4 R4-SES-02): a generated session holds no more exercises than its client type's range allows - not counting
 * the warm-up, the 2 core exercises, joint care, skill, conditioning, cardio or tests (and the quick ankle prep block). The count is
 * a recommendation: an EDITED plan is not judged here (the person adds or removes, CX-04). No minutes are read anywhere.
 * Also: no line's weekly sets climb past the Focus / priority absolute ceiling (E-95).
 */
function v13Caps(c) {
  const out = [], S = c.R.session, k = 'check.v13_caps';
  const size = c.meta.session_size || null;
  if (size && Array.isArray(size.range) && !c.edited) for (const w of c.weeks) for (const d of w.days || []) {
    if (!['main', 'optional'].includes(d.kind)) continue;
    const rows = c.dayRows(w, d).filter(r => !S.outside_cap_blocks.includes(r.b.kind) && !isTestTop(r) && !(typeof r.it.sets === 'number' && r.it.sets === 0));
    const ABk = c.R.athletic.f2 && c.R.athletic.f2.ankle_block;
    const ankleRows = ABk && ABk.outside_athlete_cap ? rows.filter(r => r.it.bucket === 'AP_JUMP_LIMITED_KNEE' && ((r.it.flags || []).includes('ankle_block') || (r.it.athletic && r.it.athletic.key === 'low_contacts'))).length : 0;
    const count = rows.length - ankleRows;
    if (count > size.range[1]) out.push(viol(whereDay(w, d), k, { rule: 'session_size', count, max: size.range[1], type: size.type }));
  }
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
      // (v0.5 fix round 1: the high-incline press of the 'Chest / Shoulders' slot, MRPUSH 1.0 front delts + 0.5 chest - a credit is
      // right when it is its class's own number, rules.credit.classes)
      const cls = (C.classes || {})[r.ex.credit_class] || {};
      const ok = v === 1 || v === C.helper || (r.ex.credit_class === 'DIPS' && v === 0.5) || (r.ex.credit_class === 'THRUSTER' && m === 'front_delts' && v === 0.5) || (r.ex.credit_class === 'MRPUSH' && cls[m] === v);
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

/**
 * V15 (v0.5; COACH-CX CX-01, COACH-R4 R4-PRG-01): the planned final sets are REACHED - every trained group of a stairway block
 * holds its final target in the block's last week (credits recomputed from the items) - and the top number arrives in the last
 * week or one week early, never earlier. No rate limit exists (CX-01 / R4-PRG-02: faster steps are allowed and noted).
 * An edited plan is not judged here (CX-04: the person may change any week's sets).
 */
function v15Step(c) {
  const out = [], k = 'check.v15_step';
  if (c.edited || c.circuitPlan) return out;
  const early = (c.R.stairway.progression && c.R.stairway.progression.arrival_weeks_early_max) ?? 1;
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const b = c.stairOf(tb.n);
    if (!b || !Array.isArray(b.groups)) continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b2) => a.n - b2.n);
    const N = ws.length;
    if (!N) continue;
    const sets = groupSetsByWeek(c, ws);
    for (const g of b.groups) {
      const top = (b.group_top || {})[g], start = (b.group_start || {})[g];
      if (typeof top !== 'number' || typeof start !== 'number') continue;
      const series = sets.map(x => x[g] || 0);
      if (series[N - 1] < top - EPS) out.push(viol({ week: ws[N - 1].n }, k, { rule: 'target_not_reached', group: g, sets: Math.round(series[N - 1] * 100) / 100, target: top }));
      // the arrival week is read on the planned whole-set schedule (H22 ties every week's target to it); the credited sets sit at
      // or above it - a group that also earns helper credit (triceps from presses, biceps from rows) may run a fraction ahead
      const sc = (b.schedule || {})[g];
      if (Array.isArray(sc) && top > start + EPS && N >= 3) {
        const first = sc.findIndex(x => x >= top - EPS);
        if (first >= 0 && first < N - 1 - early) out.push(viol({ week: ws[first].n }, k, { rule: 'arrival_early', group: g, week: first + 1, weeks: N, target: top }));
      }
      if (Array.isArray(sc)) for (let i = 0; i < N; i++) if (series[i] < sc[i] - EPS) out.push(viol({ week: ws[i].n }, k, { rule: 'below_schedule', group: g, sets: Math.round(series[i] * 100) / 100, target: sc[i] }));
    }
  }
  return out;
}

/** weekly group sets recomputed from the items of the given weeks (all days, group credit: a set counts at most 1.0 to a group) */
function groupSetsByWeek(c, ws) {
  return ws.map(w => {
    const gc = {};
    for (const d of w.days || []) for (const r of c.dayRows(w, d)) {
      const gcr = groupCredits(c.model, r.it.credits || {});
      for (const [g, v] of Object.entries(gcr)) gc[g] = (gc[g] || 0) + (typeof r.it.sets === 'number' ? r.it.sets : 0) * v;
    }
    return gc;
  });
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
        // the final sets of the week's own training block (meta.stairway[].cap)
        const blk = Array.isArray(c.meta.stairway) ? c.meta.stairway.find(s => s.training_block === w.training_block) : null;
        const capOf = (blk && blk.cap) || c.targets.cap || {};
        const atCap = !!m && typeof (w.target_by_muscle || {})[m] === 'number' && typeof capOf[m] === 'number' && w.target_by_muscle[m] >= capOf[m] - EPS;
        const when = w.block_type === 'stairway' && ((N && w.stair_week === N) || (w.phase === 'HARDEST' && atCap));
        const lastOk = r === lastRes || myoLastEligible(r, res, c);
        if ((!lastOk && !c.edited) || !isoOrMachine || !when || E.myo.never_in_block_types.includes(w.block_type)) out.push(viol(where(r), k, { rule: 'myo_rule', last: lastOk ? 1 : 0, iso_or_machine: isoOrMachine ? 1 : 0, when: when ? 1 : 0 }));
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
    const calvesExempt = calvesExempt0;
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
      // v0.5 (R4-SES-05; OBSERVED BYOP): the template says which leg days hold the calf exercise (the A day; the B day holds the
      // side raise) - a day that has one runs it at 3 sets or more (VOL-17)
      const lowerDay = rows.some(r => isRes(r) && isCalf(r)) && !c.edited;
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
      const need = c.R.core_block.exercises;
      if (rows.length && coreItems < need && !c.edited) out.push(viol(whereDay(w, d), K.h05, { rule: 'core_block_minimum', items: coreItems, need }));
    }
    // (the rear delts are worked with the back - R3-VOL-01; a week with upper work and neither a rear-delt exercise nor rows is judged)
    if (upper > 0 && rear === 0 && rearRows <= EPS && !pain.includes('rear_delts') && !pain.includes('shoulders') && !c.edited) out.push(viol({ week: w.n }, k, { rule: 'rear_delt_weekly' }));
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
  // The week must hold Olympic / triple-extension work only where the template asks for it (an AP_TRIPLE_EXT station inside
  // the session's exercise count) and where some record can fill it for this person: kit, youth ladder, floor lifts, tier of the
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
  // v0.6 (G-133): the client the selection keeps away from the snatch family and from barbell power lifts (rules.selection.s6.olympic_safe)
  const S6O = c.R.selection && c.R.selection.s6 && c.R.selection.s6.olympic_safe;
  const A50 = c.R.population.active_aging_50;
  const racket50 = !!A50 && c.age !== null && c.age >= A50.from_age && c.age <= A50.to_age && (A50.racket_profiles || []).includes(c.meta.profile && c.meta.profile.id);
  const olySafe = !!S6O && ((S6O.when_pain && (c.derived.pain || []).length > 0) || (typeof S6O.when_play_days_min === 'number' && (c.meta.play_days || c.derived.play_days || []).length >= S6O.when_play_days_min) || (S6O.when_racket50 && racket50));
  for (const w of c.weeks) {
    const rows = c.rows.filter(r => r.w === w && r.it.bucket === 'AP_TRIPLE_EXT' && r.ex);
    const heavyGameWeek = w.block_type === 'in_season' && ath.game_heavy && ath.heavy_play_week;
    const asked = (w.days || []).filter(d => d.kind === 'main').flatMap(d => templateStations(c, d))
      .filter(st => st.bucket === 'AP_TRIPLE_EXT' && (typeof st.rank !== 'number' || !c.meta.session_size || st.rank <= c.meta.session_size.range[1]));
    const needed = asked.some(st => pool.some(e => possible(e, st.variant, w)));
    // (fix round 2 / F2, E-172: the class model's end-test week of a strength test runs no Olympic work - OBSERVED class cycle WK 8)
    const classEndTest = !!(c.R.athletic.r2 && c.R.athletic.r2.tests && c.R.athletic.r2.tests.class_end_week_olympic === 'off') && c.family === 'hybrid_crossfit' &&
      !!(w.test && w.test.type === 'end' && (w.test.items || []).includes('strength')) && !!(w.athletic_budget && w.athletic_budget.test_dose === 'class_no_power');
    if (needed && !heavyGameWeek && !rows.length && !classEndTest && !c.edited) out.push(viol({ week: w.n }, k, { rule: 'olympic_every_week' }));
    const days = new Set(rows.map(r => r.d.weekday));
    if (days.size > O.per_week_max) out.push(viol({ week: w.n }, k, { rule: 'per_week_max', exposures: days.size, max: O.per_week_max }));
    for (const r of rows) {
      const tier = r.ex.athletic && r.ex.athletic.olympic_tier;
      // (fix round 2, rules.olympic.x2.l2_block1 - ATH-10 'L2: power and hang variants with the barbell': the hang power lifts are an
      // L2 lifter's first exercise block)
      const LBv = c.R.olympic.x2 && c.R.olympic.x2.l2_block1;
      const l2plusOk = level === 'L3' || (level === 'L2' && w.exercise_block >= 2) || (!!LBv && (LBv.levels || []).includes(level) && (LBv.ids || []).includes(r.ex.id));
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
      // v0.6 (G-133, EQ-03 / ATH-10): an 'olympic safe' client's clean-day station may hold the KB swing or the DB / KB high pull the
      // selection relaxes to (no clean, loaded jump or jerk is safe for him) - the day pattern is not read on it
      if (olySafe && (r.it.flags || []).includes('olympic_safe') && ['swing', 'snatch'].includes(fam)) continue;
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
/** the template day type of a plan day (base or variant template; in-season days from the in-season template), or null */
function templateDay(c, d) {
  const look = (id, variant) => {
    if (!id) return null;
    const [fam, days] = String(id).split('.');
    try {
      const t = c.model.template(fam, days);
      return c.model.dayTypes(t, variant && t.variants[variant] ? variant : null).day_types[d.day_type] || null;
    } catch { return null; }
  };
  const tpl = c.meta.template || {}, IS = c.R.plan_types.season.in_season;
  return look(tpl.id, tpl.variant) || look(IS.template, IS.variant) || null;
}
/** the template stations of a plan day */
function templateStations(c, d) {
  const dt = templateDay(c, d);
  return dt ? dt.stations : [];
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

/**
 * V21 / H20 - the liability gate (COACH-R4 R4-SCP-02 'they need to click it before the plan shows'; R4-SCP-01 'all the plans
 * should release liability before and after it gets kicked out'; R3-GEN-01). A plan with weeks exists only with an accepted
 * release: the stamp says so (`accepted: true`), names the version its role and age ask for (a guardian for a minor), and the
 * release line the plan prints exists in English and Spanish with its link (rules.legal.release_line, DISCLAIMER.md / .es.md).
 * A result that is not a plan (refer, invalid) holds no weeks.
 */
function v21Release(c) {
  const k = 'check.v21_release';
  if (c.plan.status !== 'ok') return c.weeks.length ? [viol({}, k, { rule: 'weeks_without_a_plan', status: String(c.plan.status) })] : [];
  const st = c.plan.release_stamp;
  if (!st) return [viol({}, k, { rule: 'release_stamp_missing' })];
  const role = (c.meta.health && c.meta.health.role) || (c.derived.health && c.derived.health.role) || 'self';
  const want = c.age !== null && c.age < c.R.levels.youth_age ? 'release.minor' : role === 'client' ? 'release.coach' : 'release.client';
  const out = [];
  if (st.accepted !== true) out.push(viol({}, k, { rule: 'release_not_accepted' }));
  if (st.version !== want) out.push(viol({}, k, { rule: 'release_version', version: st.version || 'none', expected: want }));
  if (want === 'release.minor' && st.guardian !== true) out.push(viol({}, k, { rule: 'guardian_missing' }));
  // the printed release line: its words and its link in both languages
  const L = c.R.legal || {}, RL = L.release_line || null;
  if (RL) {
    const keys = [RL.label_key, RL.link_key, (RL.by_version || {})[want], RL.short_key, RL.footer_key].filter(x => typeof x === 'string');
    if (!(RL.by_version || {})[want]) out.push(viol({}, k, { rule: 'release_line_missing', version: want }));
    for (const lang of RL.langs || ['en', 'es']) {
      for (const key of keys) if (!c.model.has(lang, key)) out.push(viol({}, k, { rule: 'release_line_words', lang, key }));
      if (!(L.disclaimer_url && typeof L.disclaimer_url[lang] === 'string' && /^https?:\/\//.test(L.disclaimer_url[lang]))) out.push(viol({}, k, { rule: 'release_link', lang }));
    }
  }
  return out;
}

/**
 * V22 / H17 (v0.5; R2-VOL-06, R3-VOL-01 / R3-SES-01, COACH-R4 R4-SES-03, design/ENGINE_V05_PLAN.md): with 3 or more training days
 * every trained FOCUS group holds the floor of 10 sets in every week of a stairway block, counted on all the plan's days with
 * group credit (a set counts at most 1.0 to a group; the bonus exercise on the optional day counts). With 2 training days the
 * 2-day rule holds instead: every big group at 6 sets or more (about 6-8). Calves hold what one exercise x 3 sets a leg day and
 * the optional-day Calves slots give (10 where those hold it). A group the template's slots cannot hold at the floor is capped
 * and SAID (meta.stairway[].below_floor + warning.below_floor_template); an unsaid group under its floor is a violation.
 * Exempt: pain-reduced lines, credit-only groups, maintenance / pre-season / in-season / taper / recovery weeks, timed circuits'
 * said groups.
 */
function v22Floor(c) {
  const out = [], k = 'check.v22_floor', V = c.R.volume, floor = V.floor.value;
  const X = c.X;
  const T = c.targets;
  const pain = T.pain_muscles || [], credit = T.credit_only || [];
  const TD = V.two_day || null;
  // (the plan says the 2-day rule applies in meta.two_day - R4-SES-03)
  const twoDay = !!(c.meta.two_day && TD);
  const linesOf2 = (g) => (X.linesOfGroup[g] || []).filter(l => (T.lines || Object.keys(T.start || {})).includes(l));
  const eligible = (g) => linesOf2(g).length && !linesOf2(g).some(l => pain.includes(l)) && !linesOf2(g).every(l => credit.includes(l));
  const floored = twoDay
    ? X.groups.filter(g => g !== 'calves' && eligible(g) && linesOf2(g).some(l => (TD.big_classes || ['big']).includes((X.defs[l] || {}).class)))
    : (T.floor_groups || []).filter(eligible);
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    if (!ws.length) continue;
    const b = c.stairOf(tb.n);
    const trained = b && Array.isArray(b.groups) && !b.circuit ? b.groups : null;
    const said = c.saidBelowFloor(tb.n);
    const sets = groupSetsByWeek(c, ws);
    ws.forEach((w, i) => {
      let legDays = 0, optCalf = 0;
      for (const d of w.days || []) {
        const calf = c.dayRows(w, d).some(r => isRes(r) && r.ex && r.ex.credit_class === 'ISO_CALF' && (r.it.sets || 0) > 0);
        if (calf && d.kind === 'main') legDays++; else if (calf) optCalf++;
      }
      for (const g of floored) {
        if (said.includes(g)) continue;
        // a group with no exercise of its own in the template is credit-only for this plan (said: warning.credit_only_groups)
        if (trained ? !trained.includes(g) : !(sets[i][g] > EPS)) continue;
        const need = g === 'calves'
          ? Math.min(V.calves.weekly_floor, V.calves.per_leg_day.L1 * legDays + ((V.calves.optional_slot_sets || [0, 0])[0]) * optCalf)
          : (twoDay ? TD.weekly_sets[0] : floor);
        const v = Math.round((sets[i][g] || 0) * 100) / 100;
        if (v < need - EPS) out.push(viol({ week: w.n }, k, { muscle: g, sets: v, floor: need, ...(twoDay ? { rule: 'two_day_rule' } : {}) }));
      }
    });
  }
  return out;
}

/** an item that is the class model's work lift (rules.session.class_lift) */
function classLiftRow(c, r) {
  const KWL = c.R.session.class_lift;
  return !!(KWL && (KWL.families || []).includes(c.family) && (KWL.roles || []).includes(r.it.role) && r.it.origin !== 'bonus');
}

function v23Groups(c) {
  const out = [], k = 'check.v23_exercises_per_group', G = c.R.session.exercises_per_group;
  if (G.exempt_families.includes(c.family)) return out;
  const [lo, hi] = G.full_body_day;
  for (const w of c.weeks) for (const d of w.days || []) {
    if (d.kind !== 'main') continue;
    // v0.5 (COACH-R4 R4-SES-05): a day holds the exercises the coach's template gives each group (rules.session
    // .exercises_per_group.full_body_day = [1, 4]); the maximum stays on full-body days
    const circuitDay = d.format === 'circuit';
    const counts = {}, lone = {};
    for (const r of c.dayRows(w, d)) if (isRes(r)) { const g = groupOf(r, c.model); if (g) { counts[g] = (counts[g] || 0) + 1; lone[g] = r; } }
    for (const g of c.R.muscles.groups.order) {
      if (G.exempt_groups.includes(g) || !counts[g]) continue;
      const n = counts[g];
      // v0.4 B4 (E-64): in the class model the day's work lift may stand alone for its group - it is the day's named class lift
      // (the class's strength piece, OT18)
      if (n === 1 && classLiftRow(c, lone[g])) continue;
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
      let limit = tt * (1 + tol) + Math.max(...keys.map(k => pmax[k] || 0));
      // (v0.5 fix round 1, R2-PER-06 'about 60 % of off-season sets with more speed and power': a pre-season week may hold the
      // athletic work of the off-season block before it - rules.athletic.r2.pre_season_hold.keys - never more than that block held)
      const PHo = c.R.athletic.r2 && c.R.athletic.r2.pre_season_hold && w.block_type === 'pre_season' ? (c.R.athletic.r2.pre_season_hold.keys || []) : [];
      if (keys.some(k => PHo.includes(k))) {
        const before = c.weeks.filter(x => x.n < w.n && x.block_type === 'stairway' && x.athletic_budget && x.athletic_budget.planned);
        const held = before.length ? Math.max(...before.map(x => sum(x.athletic_budget.planned, keys))) : 0;
        limit = Math.max(limit, held);
      }
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
  // v0.5 / V4 (R4-SES-05): the share is read on the stations the laterality dial may move - a lower slot of a gym A / B / C or push /
  // pull / legs day keeps the laterality the coach's template names (V30 holds that), so it is no part of the dial's share
  const SK = c.R.validation.v05 && c.R.validation.v05.skeleton;
  const pinned = (r) => !!(SK && SK.laterality_of_bucket && r.d && r.d.skeleton && (SK.laterality_skeleton_prefixes || []).some(p => String(r.d.skeleton).startsWith(p)) &&
    r.it.origin === 'template' && SK.laterality_of_bucket[templateBucketOf(c, r)]);
  // (a plan whose lower compound stations are all the template's own has no dial to judge)
  if (SK && SK.laterality_of_bucket && !c.rows.some(r => r.w.block_type === 'stairway' && r.it.origin === 'template' && SK.laterality_of_bucket[templateBucketOf(c, r)] && !pinned(r))) return out;
  for (const r of c.rows) {
    if (!r.ex || !r.it.sets || r.w.block_type !== 'stairway' || pinned(r)) continue;
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

/** the bucket of the template station an item was placed on (the item's own bucket when the station is not the template's) */
function templateBucketOf(c, r) {
  const dt = templateDay(c, r.d);
  const st = dt && (dt.stations || []).find(x => x.id === String(r.it.station_id || '').replace(/\.test$/, ''));
  return (st && st.bucket) || r.it.bucket;
}

/** V29 (v1.2, review 04 major 3): weekly pulling sets >= 0.8 x pushing sets unless the client's priority is a pushing muscle */
function v29PushPull(c) {
  const out = [];
  const pr = (c.targets.priority || []);
  if (pr.some(m => ['chest', 'front_delts', 'triceps'].includes(m))) return out;
  // v0.5 fix round 2: a press and a pull are what the model's own balance rule names (rules.volume.push_pull - a high-incline
  // press is a press, a reverse fly and a face pull are pulling, VOL-18); joint-care sets are no training volume. Older models
  // without the rule keep the v1.2 lists.
  const PP = c.R.volume && c.R.volume.push_pull;
  const pushC = PP && Array.isArray(PP.push_classes) ? PP.push_classes : ['HPUSH', 'VPUSH', 'DIPS'];
  const pullC = PP && Array.isArray(PP.pull_classes) ? PP.pull_classes : ['HPULL', 'VPULL'];
  for (const w of c.weeks) {
    let push = 0, pull = 0;
    for (const d of w.days || []) for (const b of d.blocks || []) for (const it of b.items || []) {
      const e = c.ex(it.exercise_id);
      if (!e || !it.sets || it.role === 'prehab') continue;
      if (pushC.includes(e.credit_class)) push += it.sets;
      else if (pullC.includes(e.credit_class)) pull += it.sets;
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

// ---------------------------------------------------------------------------------------------------------------- v0.5 checks (V3)

/**
 * V30 (COACH-R4 R4-SES-05 'the template needs to be sound ... Day A: horizontal pull, squat, vertical pull, lunge, biceps, leg
 * extension; Day B: horizontal push, hinge, vertical or incline push, unilateral hinge, triceps, leg curl'; R4-SES-04 'the template
 * comes out complete'). A generated day that says it follows one of the coach's skeletons (`day.skeleton`, copied from the
 * template day type by engine/generate.mjs):
 *   - names the skeleton of its own template day type;
 *   - fills every lift from that template's stations, each pick inside the pattern its slot names (knee / hip / pull / push: the
 *     laterality dial or a kit stand-in may change the bucket inside the pattern, never the pattern);
 *   - keeps the compound lifts in the coach's order;
 *   - holds every counted lift of the template in a stairway week - nothing is dropped - unless the day says why (an exclusion,
 *     pain, play spacing, the 60+ default: rules.validation.v05.skeleton.absent_ok_whys).
 * An edited plan is not judged (the person adds and removes, CX-04).
 */
function v30Skeleton(c) {
  const out = [], k = 'check.v30_template_skeleton';
  const SK = c.R.validation.v05 && c.R.validation.v05.skeleton;
  if (!SK || c.edited) return out;
  const pattern = (b) => SK.pattern_of_bucket[b] || b;
  const size = c.meta.session_size || null;
  for (const w of c.weeks) for (const d of w.days || []) {
    if (d.kind !== 'main' || !d.skeleton) continue;
    const dt = templateDay(c, d);
    if (!dt || dt.skeleton !== d.skeleton) { out.push(viol(whereDay(w, d), k, { rule: 'skeleton_not_the_templates', skeleton: String(d.skeleton), template: (dt && dt.skeleton) || 'none' })); continue; }
    const st = new Map(dt.stations.map((x, i) => [x.id, { x, i }]));
    const rows = c.dayRows(w, d);
    const pinnedSk = (SK.laterality_skeleton_prefixes || []).some(p => String(d.skeleton).startsWith(p));
    let last = -1;
    for (const r of rows) {
      if (!SK.lift_blocks.includes(r.b.kind) || r.it.origin !== 'template' || r.it.role === 'test') continue;
      const hit = st.get(r.it.station_id);
      if (!hit) { out.push(viol(where(r), k, { rule: 'lift_not_in_template', station: r.it.station_id || 'none' })); continue; }
      if (pattern(r.it.bucket) !== pattern(hit.x.bucket)) out.push(viol(where(r), k, { rule: 'slot_pattern', slot: hit.x.bucket, pick: r.it.bucket }));
      // v0.5 / V4 (R4-SES-05 'knee-dominant movement, bilateral ... knee-dominant movement, unilateral'; OBSERVED BYOP 'Bilateral KD' /
      // 'Unilateral KD' / 'Bilateral HD' / 'Unilateral HD'): on a gym A / B / C or push / pull / legs day a two-leg slot holds a
      // two-leg lift and a single-leg slot a single-leg lift, in every exercise block (a pain swap or a kit stand-in is not judged)
      // (fix round 2: for a change-of-direction sport the third day's non-axial two-leg knee slot is the dial's -
      // rules.selection.skeleton_laterality.x2_free)
      const FRv = c.R.selection.skeleton_laterality && c.R.selection.skeleton_laterality.x2_free;
      const profV = c.meta.profile && c.model.hasSport(c.meta.profile.id) ? c.model.sport(c.meta.profile.id) : null;
      const freeV = !!FRv && !!profV && !!profV.cod_sport && (FRv.skeletons || []).includes(d.skeleton) && (FRv.buckets || []).includes(hit.x.bucket) && hit.x.role !== 'work' && hit.x.axial !== 'axial';
      const wantLat = pinnedSk && SK.laterality_of_bucket && !freeV ? SK.laterality_of_bucket[hit.x.bucket] : null;
      if (wantLat && r.ex && !(r.it.flags || []).some(f => (SK.laterality_exempt_flags || []).includes(f))) {
        const uni = (SK.unilateral_lateralities || ['unilateral', 'alternating']).includes(r.ex.laterality);
        if (wantLat === 'unilateral' ? !uni : r.ex.laterality !== 'bilateral') out.push(viol(where(r), k, { rule: 'slot_laterality', slot: hit.x.bucket, pick: r.ex.laterality }));
      }
      if (String(hit.x.bucket).startsWith(SK.ordered_bucket_prefix)) {
        // (v0.5 fix round 1, R2-PER-07: in a test week the tested lift opens the day's lifts - its back-off sets come with it and
        // are outside the order of the slots)
        if (c.R.tests.x1 && c.R.tests.x1.tested_lift_first && (r.it.flags || []).includes('back_off')) continue;
        if (hit.i < last) out.push(viol(where(r), k, { rule: 'slot_order', slot: hit.x.bucket }));
        else last = hit.i;
      }
    }
    // v0.5 fix round 2 (UNI-11 / ORD-06, R4-SES-05 'Day A: pull- and knee-dominant ... Day B: push with hip-dominant'; sample 04 major:
    // a lunge on the deadlift + push day passed every check): on a day that names a skeleton, a knee-dominant lift needs a pull
    // lift on the day and a hip-dominant lift a push lift (rules.validation.v05.skeleton.partner)
    const PT = SK.partner;
    if (PT && (PT.skeleton_prefixes || []).some(p => String(d.skeleton).startsWith(p))) {
      const lifts = rows.filter(r => SK.lift_blocks.includes(r.b.kind) && r.ex && r.it.origin === 'template' && r.it.role !== 'test');
      const has = (list) => lifts.some(r => list.includes(r.it.bucket));
      const tplHas = (list) => dt.stations.some(x => list.includes(x.bucket));
      // (a day whose template names no upper partner at all - the deadlift day of his 3-day hybrid week - is a lift day of its own,
      // not an A / B pairing: the rule holds a partner the template names and the plan lost)
      if (has(PT.knee) && tplHas(PT.pull) && !has(PT.pull) && !has(PT.hip)) out.push(viol(whereDay(w, d), k, { rule: 'partner_missing', lift: 'knee', partner: 'pull' }));
      if (has(PT.hip) && tplHas(PT.push) && !has(PT.push) && !has(PT.knee)) out.push(viol(whereDay(w, d), k, { rule: 'partner_missing', lift: 'hip', partner: 'push' }));
      // a knee-dominant lift on a day whose template is hip + push (or the other way round) is a template error
      if (tplHas(PT.hip) && tplHas(PT.push) && !tplHas(PT.pull) && tplHas(PT.knee)) out.push(viol(whereDay(w, d), k, { rule: 'partner_missing', lift: 'knee', partner: 'pull' }));
      if (tplHas(PT.knee) && tplHas(PT.pull) && !tplHas(PT.push) && tplHas(PT.hip)) out.push(viol(whereDay(w, d), k, { rule: 'partner_missing', lift: 'hip', partner: 'push' }));
    }
    if (!SK.complete_in_block_types.includes(w.block_type) || !size || !Array.isArray(size.range)) continue;
    const planned = clamp(typeof dt.count === 'number' ? dt.count : size.default, size.range[0], size.range[1]);
    if ((d.why || []).some(y => y && SK.absent_ok_whys.includes(y.key))) continue;
    const have = new Set(rows.map(r => String(r.it.station_id || '').replace(/\.test$/, '')));
    const creditOnly = c.creditOnly(w.training_block);
    for (const x of dt.stations) {
      if (!SK.lift_blocks.includes(x.block) || typeof x.rank !== 'number' || x.rank > planned || SK.not_required_buckets.includes(x.bucket) || x.condition) continue;
      if (have.has(x.id)) continue;
      // a slot no exercise of the client's kit can fill stays empty, and the plan says its group gets its work from the other lifts
      // (warning.credit_only_groups: a curl with no dumbbell, bar or cable)
      if ((x.group && creditOnly.includes(x.group)) || !slotFillable(c, x.bucket, x.variant)) continue;
      out.push(viol(whereDay(w, d), k, { rule: 'template_lift_missing', slot: x.bucket, station: x.id }));
    }
  }
  return out;
}

/** does the client's kit hold any exercise the template may pick for this bucket? (the pool of the bucket, never-pick statuses aside) */
function slotFillable(c, bucket, variant = null) {
  const kit = c.meta.kit ? { tokens: c.meta.kit.tokens || [], machines: c.meta.kit.machines || [] } : null;
  const never = (c.R.selection && c.R.selection.addons && c.R.selection.addons.never_pick_statuses) || [];
  let pool = [];
  try { pool = c.model.bySlot(bucket); } catch { pool = []; }
  // (v0.5 fix round 2: a shoulder station that names its head - 'side', 'rear', 'front' - is fillable only by that head's
  // exercises, as selection reads it; a field kit with no dumbbell holds a rear-delt floor raise and no side raise. The class
  // days are judged since they name a skeleton.)
  const DELT = { side: ['ISO_SIDE'], rear: ['ISO_REAR', 'FACEPULL'], front: ['ISO_FRONT'] };
  if (bucket === 'ISO_SIDE_REAR_DELT' && variant && DELT[variant]) pool = pool.filter(e => DELT[variant].includes(e.credit_class));
  return pool.some(e => !never.includes(e.status) && (!kit || c.model.kitAvailable(e, kit)));
}

/**
 * V31 (COACH-R4 R4-LIB-01 'they can be optional, and they can be chosen and added, but not primary ones that the program is
 * going to throw at you as part of the template ... wall balls and sled pushes ... in the HYROX program ... maybe in the CrossFit
 * program'). No item the engine placed is an optional add-on or a proposed record, except the two approved primaries where
 * rules.selection.addons.primary_exceptions allows them (a HYROX station circuit, the class WOD); a WOD's stations follow the same
 * rule; a record no plan shows (still proposed: neck work) is never a pick, a swap or an offered add-on; the offered add-ons
 * (meta.addons) are add-ons. An exercise the person added by an edit is theirs to choose.
 */
function v31Addons(c) {
  const out = [], k = 'check.v31_addons_optional';
  const A = c.R.selection && c.R.selection.addons;
  if (!A) return out;
  const never = A.never_pick_statuses || [], hidden = A.not_shown_statuses || [];
  const allowed = (e, bucket, variant) => e.status === A.addon_status && (A.primary_exceptions || []).some(x => x.enabled !== false && x.ids.includes(e.id) && x.bucket === bucket &&
    (!x.variants || x.variants.includes(variant)) && (!x.families || x.families.includes(c.family)));
  for (const r of c.rows) {
    if (r.it.origin === 'edit' || r.it.edited === true) continue;
    if (r.ex && never.includes(r.ex.status) && !allowed(r.ex, r.it.bucket, stationVariant(c, r))) out.push(viol(where(r), k, { rule: 'addon_as_pick', exercise: r.ex.id, status: r.ex.status }));
    for (const id of (r.it.wod && r.it.wod.stations) || []) {
      const e = c.ex(id);
      if (e && never.includes(e.status) && !allowed(e, r.it.bucket, stationVariant(c, r))) out.push(viol(where(r), k, { rule: 'addon_in_wod', exercise: id, status: e.status }));
    }
    for (const id of r.it.swaps || []) { const e = c.ex(id); if (e && hidden.includes(e.status)) out.push(viol(where(r), k, { rule: 'not_shown_as_swap', exercise: id })); }
  }
  for (const a of Array.isArray(c.meta.addons) ? c.meta.addons : []) {
    const e = a && c.ex(a.exercise_id);
    if (!e) { out.push(viol({}, k, { rule: 'offered_unknown', exercise: String(a && a.exercise_id) })); continue; }
    if (e.status !== A.addon_status || hidden.includes(e.status)) out.push(viol({}, k, { rule: 'offered_not_an_addon', exercise: e.id, status: e.status }));
    if (a.counts_as_muscle_sets === true && isCarryEx(c, e)) out.push(viol({}, k, { rule: 'offered_carry_credits', exercise: e.id }));
  }
  return out;
}

/**
 * V32 (warn; COACH-R4 R4-LIB-03 'for bodybuilders ... and for the general population I would rather focus more on incline pressing
 * and bias incline pressing instead of overhead pressing ... they're part of the program, and we should have that variability').
 * For the clients rules.selection.incline_first names, in every training block at least half of the picks of the vertical /
 * mid-range push slot are incline or mid-range presses - when the client's kit holds an incline press at all. The class model's
 * work press, circuit stations and picks swapped for a pain area are not read (rules.validation.v05.incline).
 */
function v32InclineFirst(c) {
  const out = [], k = 'check.v32_incline_first';
  const IF = c.R.selection && c.R.selection.incline_first, V = c.R.validation.v05 && c.R.validation.v05.incline;
  if (!IF || !V || c.edited) return out;
  const competitive = !!(c.meta.profile && c.meta.profile.competitive === 'competitive');
  if (!(IF.goals || []).includes(c.meta.goal) || (IF.not_competitive && competitive)) return out;
  const re = new RegExp(IF.incline_re || 'incline');
  const kit = c.meta.kit ? { tokens: c.meta.kit.tokens || [], machines: c.meta.kit.machines || [] } : null;
  const never = (c.R.selection.addons && c.R.selection.addons.never_pick_statuses) || [];
  const inKit = c.model.bySlot(IF.bucket).some(e => re.test(e.id) && !never.includes(e.status) && (!kit || c.model.kitAvailable(e, kit)));
  if (!inKit) return out;
  for (const tb of c.tbs) {
    const picks = c.rows.filter(r => r.w.training_block === tb.n && r.d.kind === 'main' && r.it.bucket === IF.bucket && r.ex && r.it.origin === 'template' &&
      !(V.not_roles || []).includes(r.it.role) && r.it.role !== 'test' && !(V.not_block_kinds || []).includes(r.b.kind) &&
      // (a pick swapped to protect a pain area is the pain rule's, VOL-03: a neck that takes a machine press is not an incline miss)
      !(r.it.flags || []).some(fl => (V.not_flags || []).includes(fl)));
    if (!picks.length) continue;
    const incline = picks.filter(r => re.test(r.ex.id) || (r.ex.tags || []).includes(IF.tag)).length;
    if (incline < picks.length * V.majority - EPS) out.push(viol({ week: tb.weeks[0] }, k, { rule: 'incline_share', share: Math.round(100 * incline / picks.length) / 100, target: V.majority, block: tb.n }));
  }
  return out;
}

/**
 * V33 (COACH-R4 R4-LIB-05 'remove them from the public data. Each exercise gets a "search this exercise on YouTube" link'): an
 * item's video (and an offered add-on's) is null, the coach's own (`kind: coach`) or a search link built on
 * rules.render.video.search_url; and nothing in the plan carries a link to somebody's video (rules.validation.v05.video.forbidden_re).
 */
function v33Video(c) {
  const out = [], k = 'check.v33_video_search';
  const RV = c.R.render && c.R.render.video, V = c.R.validation.v05 && c.R.validation.v05.video;
  if (!RV) return out;
  const bad = (v) => !!v && !(v.kind === 'coach' || (v.kind === 'search' && typeof v.url === 'string' && v.url.startsWith(RV.search_url)));
  for (const r of c.rows) if (bad(r.it.video)) out.push(viol(where(r), k, { rule: 'video_not_a_search_link', kind: String(r.it.video.kind) }));
  for (const a of Array.isArray(c.meta.addons) ? c.meta.addons : []) if (a && bad(a.video)) out.push(viol({}, k, { rule: 'addon_video_not_a_search_link', exercise: String(a.exercise_id) }));
  if (V && V.forbidden_re) {
    const re = new RegExp(V.forbidden_re, 'i');
    const walk = (o, path, depth) => {
      if (typeof o === 'string') { if (re.test(o)) out.push(viol({}, k, { rule: 'third_party_link', path })); return; }
      if (!o || typeof o !== 'object' || depth > 12) return;
      if (Array.isArray(o)) o.forEach((x, i) => walk(x, path + '[' + i + ']', depth + 1));
      else for (const key of Object.keys(o)) { if (key !== 'validation') walk(o[key], path ? path + '.' + key : key, depth + 1); }
    };
    walk(c.plan, '', 0);
  }
  return out;
}

const REP_RULE_TYPES = ['range', 'fixed', 'per_side'];
/**
 * V34 (COACH-R4 R4-PRG-03 'as a rule the person applies themselves ... not as a promise like "week 3: 12 reps"'; CX-02 / CX-03).
 * Every set-and-rep lift (a resistance, isolation or Focus exercise dosed in reps) carries its progression rule: the rep range of
 * its own dose, a kind the plan can word (rules.render.progression.keys) and `promised_numbers: false`. No item carries a number
 * promised for a week.
 */
function v34Progression(c) {
  const out = [], k = 'check.v34_progression_rule';
  const P = c.R.render && c.R.render.progression;
  if (!P) return out;
  for (const r of c.rows) {
    const pr = r.it.progression;
    if (pr !== null && pr !== undefined) {
      if (pr.promised_numbers !== false || 'weeks' in pr || 'by_week' in pr || 'targets' in pr) out.push(viol(where(r), k, { rule: 'promised_numbers' }));
      if (!Array.isArray(pr.rep_range) || !(pr.kind in (P.keys || {}))) out.push(viol(where(r), k, { rule: 'rule_shape', kind: String(pr.kind) }));
    }
    if (r.it.origin === 'edit' || r.it.edited === true) continue;
    const reps = r.it.reps;
    const expected = isRes(r) && r.bd && RESISTANCE_KINDS.includes(r.bd.kind) && typeof r.it.sets === 'number' && r.it.sets > 0 && !r.it.circuit && !!reps && REP_RULE_TYPES.includes(reps.type);
    if (!expected) continue;
    if (!pr) { out.push(viol(where(r), k, { rule: 'rule_missing' })); continue; }
    const lo = typeof reps.min === 'number' ? reps.min : reps.value, hi = typeof reps.max === 'number' ? reps.max : lo;
    if (Array.isArray(pr.rep_range) && (pr.rep_range[0] !== lo || pr.rep_range[1] !== hi)) out.push(viol(where(r), k, { rule: 'rule_not_the_items_reps', low: pr.rep_range[0], high: pr.rep_range[1] }));
  }
  return out;
}

/**
 * V35 (COACH-R4 R4-PRG-02 'no hard limit, but the plan prints a clear note when any week adds more than about 15 %'). In a
 * stairway block a week whose group sets (recomputed from the items) rise by more than rules.stairway.progression.note_above - and
 * by at least note_min_whole_sets - carries the acceleration entry for that group, and the plan its warning. An edited plan is not
 * judged.
 */
function v35Acceleration(c) {
  const out = [], k = 'check.v35_acceleration_note';
  const PG = c.R.stairway && c.R.stairway.progression;
  if (!PG || typeof PG.note_above !== 'number' || c.edited) return out;
  const minSets = typeof PG.note_min_whole_sets === 'number' ? PG.note_min_whole_sets : 1;
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    if (ws.length < 2) continue;
    const sets = groupSetsByWeek(c, ws);
    for (let i = 1; i < ws.length; i++) for (const g of c.X.groups) {
      const from = Math.round((sets[i - 1][g] || 0) * 100) / 100, to = Math.round((sets[i][g] || 0) * 100) / 100;
      if (!(from > 0 && to - from >= minSets - EPS && (to - from) / from > PG.note_above + EPS)) continue;
      if (!(ws[i].acceleration || []).some(a => a && a.group === g)) out.push(viol({ week: ws[i].n }, k, { rule: 'week_not_noted', group: g, from, to }));
      else if (!c.warnings.some(x => x && x.code === 'acceleration' && x.args && x.args.week === ws[i].n)) out.push(viol({ week: ws[i].n }, k, { rule: 'warning_missing', group: g }));
    }
  }
  return out;
}

/**
 * V36 (COACH-R4 R4-SES-04 'that's something for the athlete to adjust ... they get to pick'). The day's easy-to-remove list is a
 * hint: every entry names an item of that day, of a kind rules.session.easy_to_remove orders, and never something the rule always
 * keeps - a core exercise, a main lift (work / paired upper) or the day's first athletic station. Nothing on the list has been
 * removed (the item is in the day with its sets).
 */
function v36EasyToRemove(c) {
  const out = [], k = 'check.v36_easy_to_remove';
  const E = c.R.session && c.R.session.easy_to_remove;
  if (!E) return out;
  if (E.automatic !== false) out.push(viol({}, k, { rule: 'automatic_removal_on' }));
  const keep = E.always_keep || [];
  for (const w of c.weeks) for (const d of w.days || []) {
    const list = d.easy_to_remove;
    if (list === undefined || list === null) continue;
    if (!Array.isArray(list)) { out.push(viol(whereDay(w, d), k, { rule: 'list_shape' })); continue; }
    const rows = c.dayRows(w, d);
    const firstAth = rows.find(r => r.b.kind === 'athletic');
    for (const x of list) {
      const r = x && rows.find(y => y.it.slot_id === x.slot_id);
      if (!r) { if (!c.edited) out.push(viol(whereDay(w, d), k, { rule: 'listed_item_not_in_the_day', slot: String(x && x.slot_id) })); continue; }
      if (!(E.order || []).includes(x.kind)) out.push(viol(where(r), k, { rule: 'kind', kind: String(x.kind) }));
      if (r.b.kind === 'core' || keep.includes(r.it.role) || (firstAth && firstAth === r)) out.push(viol(where(r), k, { rule: 'always_keep_listed', role: String(r.it.role) }));
    }
  }
  return out;
}

/** a carry / sled record (rules.conditioning.carry: the tag or the CARRY / DRAG pattern) */
function isCarryEx(c, e) {
  const C = c.R.conditioning && c.R.conditioning.carry;
  return !!C && !!e && ((e.tags || []).includes(C.tag) || (C.patterns || []).includes(e.pattern));
}
const REP_COUNT_TYPES = ['range', 'fixed', 'per_side', 'max', 'myo'];
/**
 * V37 (COACH-R4 R4-LIB-02 'by distance or time, not reps: 2-4 trips of 20-40 meters (or 20-40 seconds). They don't count as muscle
 * sets. They sit with core / conditioning'). A carry or sled item never counts reps and never credits a muscle; on its own (not a
 * station of a timed circuit or a WOD, whose clock doses it) it runs 2-4 trips at the rule's metres / seconds, in a core,
 * conditioning or circuit block.
 */
function v37CarryDose(c) {
  const out = [], k = 'check.v37_carry_dose';
  const C = c.R.conditioning && c.R.conditioning.carry;
  if (!C) return out;
  for (const r of c.rows) {
    if (!r.ex || !isCarryEx(c, r.ex)) continue;
    const reps = r.it.reps;
    if (Object.keys(r.it.credits || {}).length) out.push(viol(where(r), k, { rule: 'carry_credits' }));
    if (reps && REP_COUNT_TYPES.includes(reps.type)) out.push(viol(where(r), k, { rule: 'carry_in_reps', type: reps.type }));
    if (r.it.circuit || r.it.wod || (reps && ['rounds_work', 'minutes'].includes(reps.type))) continue;
    if (reps && reps.type === 'distance_or_time') {
      if (!(Array.isArray(reps.metres) && reps.metres[0] >= C.metres[0] && reps.metres[1] <= C.metres[1] && Array.isArray(reps.seconds) && reps.seconds[0] >= C.seconds[0] && reps.seconds[1] <= C.seconds[1])) out.push(viol(where(r), k, { rule: 'carry_distance_or_time' }));
    } else if (reps && reps.type === 'seconds') {
      if (!(reps.min >= C.seconds[0] && reps.max <= C.seconds[1])) out.push(viol(where(r), k, { rule: 'carry_seconds' }));
    } else if (!c.edited) out.push(viol(where(r), k, { rule: 'carry_dose_missing' }));
    if (typeof r.it.sets === 'number' && !c.edited && (r.it.sets < C.trips[0] || r.it.sets > C.trips[1])) out.push(viol(where(r), k, { rule: 'carry_trips', trips: r.it.sets }));
    if (!c.edited && ![...(C.sits_with || []), 'circuit'].includes(r.b.kind)) out.push(viol(where(r), k, { rule: 'carry_block', block: r.b.kind }));
  }
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
 * H21 (v0.5; R2-PER-03 / R2-PER-04, COACH-CX CX-01..03): inside a stairway block nothing goes backwards - a trained group's
 * weekly sets never drop by a set or more week over week, its planned target never drops, the last week is the hardest, the stair
 * level rises and the planned RIR never rises. The same sets MAY hold while reps or load progress (CX-02), also at the top
 * (CX-03): a flat week or a flat block is not a violation. A timed circuit's work (sets x seconds) rises every week.
 * An edited plan is judged on its targets, level and effort only (the person may lower any week's sets, CX-04).
 */
function h21Stairway(c) {
  const out = [];
  for (const tb of c.tbs) {
    if (tb.type !== 'stairway') continue;
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    if (ws.length < 2) continue;
    const N = ws.length;
    const b = c.stairOf(tb.n);
    for (const g of c.X.groups) {
      for (let i = 1; i < N; i++) {
        const t0 = (ws[i - 1].target_by_group || {})[g], t1 = (ws[i].target_by_group || {})[g];
        if (typeof t0 === 'number' && typeof t1 === 'number' && t1 < t0 - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'target_drops', muscle: g, from: t0, to: t1 }));
      }
    }
    if (!c.circuitPlan && !c.edited && b && Array.isArray(b.groups)) {
      const sets = groupSetsByWeek(c, ws);
      for (const g of b.groups) for (let i = 1; i < N; i++) {
        const a = sets[i - 1][g] || 0, z = sets[i][g] || 0;
        if (z < a - 0.5 - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'sets_drop', muscle: g, from: Math.round(a * 100) / 100, to: Math.round(z * 100) / 100 }));
      }
    }
    if (c.circuitPlan && !c.edited) {
      const work = ws.map(w => (w.circuit && typeof w.total_resistance_sets === 'number' ? w.total_resistance_sets * w.circuit.work_s : null));
      if (work.every(x => x === null || x <= EPS)) work.fill(null);
      // v0.5 fix round 2 (rules.supersets.bootcamp.x2; PRG-03 '30-50 s', CX-02 'a week may keep the same sets when reps or load
      // progress'): the work time moves in 5-s steps and holds between them - a week never drops, never holds for more than the
      // step pattern allows, and the block ends above where it started
      const BX2 = c.R.supersets.bootcamp.x2 || null;
      if (BX2 && Array.isArray(BX2.work_s_values)) {
        const maxHold = Math.max(1, Math.ceil(N / BX2.work_s_values.length));
        let held = 0;
        for (let i = 1; i < N; i++) {
          if (work[i] === null || work[i - 1] === null) continue;
          if (work[i] < work[i - 1] - EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'circuit_flat', from: work[i - 1], to: work[i] }));
          held = work[i] <= work[i - 1] + EPS ? held + 1 : 0;
          if (held > maxHold) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'circuit_flat', from: work[i - 1], to: work[i], held }));
        }
        const firstW = work.find(x => x !== null), lastW = work[N - 1];
        if (N >= BX2.work_s_values.length && firstW !== undefined && lastW !== null && lastW <= firstW + EPS) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'circuit_flat', from: firstW, to: lastW }));
      } else for (let i = 1; i < N; i++) {
        if (work[i] === null || work[i - 1] === null) continue;
        if (work[i] <= work[i - 1] + EPS) out.push(viol({ week: ws[i].n }, K.h21, { rule: 'circuit_flat', from: work[i - 1], to: work[i] }));
      }
    }
    const totals = ws.map(w => (typeof w.total_resistance_sets === 'number' ? w.total_resistance_sets : null));
    if (totals.every(t => t !== null) && !c.edited) {
      const last = totals[N - 1];
      if (totals.some(t => t > last + EPS)) out.push(viol({ week: ws[N - 1].n }, K.h21, { rule: 'last_week_not_hardest', last, max: Math.max(...totals) }));
    }
    for (let i = 1; i < ws.length; i++) {
      const a = ws[i - 1], z = ws[i];
      if (!(typeof a.stair_level === 'number' && typeof z.stair_level === 'number' && z.stair_level > a.stair_level)) out.push(viol({ week: z.n }, K.h21, { rule: 'stair_level_not_rising', from: a.stair_level, to: z.stair_level }));
      if (a.planned_rir && z.planned_rir && (z.planned_rir.min > a.planned_rir.min + EPS || z.planned_rir.max > a.planned_rir.max + EPS)) out.push(viol({ week: z.n }, K.h21, { rule: 'planned_rir_rises' }));
    }
  }
  return out;
}

/**
 * H22 (planned stairway only - R2-VOL-03 'no check-in, no change', R3-VOL-02 / R3-VOL-04 'kick out a program, and that's it'):
 * no step in a flat block or in week 1; in every stairway block each week's group target IS the planned whole-set schedule
 * (meta.stairway[].schedule: from the group's start to its final sets, never down); no check-in offer exists.
 */
function h22NoCheckin(c) {
  const out = [];
  if ((c.plan.offers || []).some(o => o && o.key === 'block.cannot_finish')) out.push(viol({}, K.h22, { rule: 'checkin_offer' }));
  for (const w of c.weeks) if (w.block_type !== 'stairway' || w.stair_week === 1) {
    for (const [m, s] of Object.entries(w.step_by_muscle || {})) if (typeof s === 'number' && Math.abs(s) > EPS) out.push(viol({ week: w.n }, K.h22, { rule: 'step_in_flat_or_first_week', muscle: m, step: s }));
  }
  c.tbs.filter(tb => tb.type === 'stairway').forEach((tb) => {
    const ws = stairwayWeeks(c, tb).slice().sort((a, b) => a.n - b.n);
    const N = ws.length;
    const b = c.stairOf(tb.n);
    if (N < 1 || !b || !Array.isArray(b.groups)) return;
    for (const g of b.groups) {
      const sc = (b.schedule || {})[g];
      if (!Array.isArray(sc) || sc.length !== N) { out.push(viol({}, K.h22, { rule: 'schedule_missing', muscle: g })); continue; }
      if (sc[0] !== (b.group_start || {})[g] || sc[N - 1] !== (b.group_top || {})[g]) out.push(viol({}, K.h22, { rule: 'schedule_endpoints', muscle: g, first: sc[0], last: sc[N - 1] }));
      for (let i = 0; i < N; i++) {
        if (!Number.isInteger(sc[i]) || (i && sc[i] < sc[i - 1])) out.push(viol({ week: ws[i].n }, K.h22, { rule: 'schedule_not_whole_or_drops', muscle: g, value: sc[i] }));
        const t = (ws[i].target_by_group || {})[g];
        if (t !== sc[i]) out.push(viol({ week: ws[i].n }, K.h22, { rule: 'target_not_planned', muscle: g, target: t ?? null, planned: sc[i] }));
      }
    }
  });
  return out;
}

function uniq(a) { return [...new Set(a)]; }
