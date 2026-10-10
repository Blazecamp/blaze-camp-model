// engine/timefit.mjs - lines and groups (COACH-R3 R3-VOL-01, R3-SES-01) and the v0.4 time model (R3-SES-02). Owner: stage B1
// (engine 0.4.0). Shared by volume.mjs (placement, the time check), week.mjs (estimateMinutes, cuts) and validate.mjs.
// Pure: no I/O, no clock, no randomness. Every number comes from model.rules.
//
// Lines: the stairway runs on lines (quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves). Side, rear and
// front delts are one shoulders line (R3-VOL-01 "I wouldn't categorize the rear delt as an individual muscle").
// Groups: the floor of 10, the 2-4-exercises rule and the time check read the coach's FOCUS groups (hips = glutes + hamstrings,
// shoulders = front + side + rear delts; R3-SES-01). A set counts at most 1.0 to a line or a group (group credit, 12 v1.2 §3.3,
// PROPOSED): credit = min(1, sum of the member muscles' credits).
import { EPS } from './util.mjs';

const CACHE = new WeakMap();

/**
 * Lines and groups of a model (cached per model object).
 * @param {object} model
 * @returns {{order:string[], defs:Object<string,object>, lineOf:Object<string,string>, groupOfLine:Object<string,string>,
 *            groups:string[], groupMembers:Object<string,string[]>, groupOfMuscle:Object<string,string>, linesOfGroup:Object<string,string[]>}}
 */
export function linesOf(model) {
  if (CACHE.has(model)) return CACHE.get(model);
  const R = model.rules;
  const LX = R.muscles.lines;
  let order, defs;
  if (LX && Array.isArray(LX.order)) { order = LX.order.slice(); defs = LX.defs; }
  else { // pre-v1.3 models: every target muscle is its own line
    order = R.muscles.order.filter(m => R.muscles.defs[m].target);
    defs = Object.fromEntries(order.map(m => [m, { members: [m], class: R.muscles.defs[m].class, region: R.muscles.defs[m].region, group: R.muscles.defs[m].group, per_leg_day: !!R.muscles.defs[m].per_leg_day }]));
  }
  const lineOf = {};
  for (const l of order) for (const m of defs[l].members) lineOf[m] = l;
  const groupOfLine = Object.fromEntries(order.map(l => [l, defs[l].group]));
  const groups = R.muscles.groups.order.filter(g => g !== 'core');
  const groupMembers = R.muscles.groups.members;
  const groupOfMuscle = {};
  for (const g of R.muscles.groups.order) for (const m of groupMembers[g] || []) groupOfMuscle[m] = g;
  const linesOfGroup = {};
  for (const l of order) (linesOfGroup[groupOfLine[l]] = linesOfGroup[groupOfLine[l]] || []).push(l);
  const out = Object.freeze({ order, defs, lineOf, groupOfLine, groups, groupMembers, groupOfMuscle, linesOfGroup });
  CACHE.set(model, out);
  return out;
}

/** per-set line credits of a muscle-credit map: min(1, sum of member credits) @returns {Object<string,number>} */
export function lineCredits(model, cr) {
  const X = linesOf(model);
  const out = {};
  if (!cr) return out;
  for (const [m, v] of Object.entries(cr)) { const l = X.lineOf[m]; if (l) out[l] = (out[l] || 0) + v; }
  for (const l of Object.keys(out)) out[l] = Math.min(1, out[l]);
  return out;
}

/** per-set group credits of a muscle-credit map: min(1, sum of member credits) (core excluded) @returns {Object<string,number>} */
export function groupCredits(model, cr) {
  const X = linesOf(model);
  const out = {};
  if (!cr) return out;
  for (const [m, v] of Object.entries(cr)) { const g = X.groupOfMuscle[m]; if (g && g !== 'core') out[g] = (out[g] || 0) + v; }
  for (const g of Object.keys(out)) out[g] = Math.min(1, out[g]);
  return out;
}

/**
 * Lines an exercise drives as a main mover (a member credit of 1.0; dips drive triceps, LIB-16).
 * @param {object} model @param {object|null} ex catalog record @param {Object<string,number>|null} cr its credits in the slot
 * @returns {string[]}
 */
export function primeLines(model, ex, cr) {
  if (!cr) return [];
  const X = linesOf(model);
  const out = [];
  for (const [m, v] of Object.entries(cr)) { const l = X.lineOf[m]; if (l && v >= 1 - EPS && !out.includes(l)) out.push(l); }
  if (ex && ex.credit_class === 'DIPS' && cr.triceps && !out.includes('triceps')) out.push('triceps');
  return X.order.filter(l => out.includes(l));
}

// ------------------------------------------------------------------------------------------------------------- time model

const MAIN_COMPOUND_BUCKETS = ['RP_BKD', 'RP_BHD', 'RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'];

/** time class of a slot with its pick (a unilateral pick costs about 1.5 x; the laterality dial may flip the bucket) */
export function timeClassOf(slot, fill, model) {
  let tc = slot.time_class;
  if (!tc) { try { tc = model.bucket(slot.bucket).time_class; } catch { tc = null; } }
  const lat = fill && fill.laterality;
  if (lat === 'unilateral' || lat === 'alternating') {
    if (tc === 'compound_bilateral') tc = 'compound_unilateral';
    else if (tc === 'isolation') tc = 'isolation_unilateral';
  } else if (fill && fill.bucket && fill.bucket !== slot.bucket) {
    try { tc = model.bucket(fill.bucket).time_class || tc; } catch { /* unknown bucket: keep */ }
  }
  return tc || 'isolation';
}

/**
 * The rest a slot is dosed with (VOL-14), predicted before dosing: strength rest (3-6 min) for a heavy work lift (athletes'
 * VOL3 block, the heavy powerlifting-style preference, the strength family, the class model's work lift), else by its time class.
 * Mirrors dose.mjs (heavyWork / reps <= 6) closely enough for planning; the plan's minutes are re-read from the dosed items.
 * INFERRED reading of VOL-14, PROPOSED numbers (rules.time_model.rest_class_minutes).
 */
export function restClassOf(slot, fill, tc, model, derived, week) {
  const T = model.rules.time_model;
  const by = T.rest_class_by_time_class || {};
  const base = by[tc] || 'hypertrophy';
  if (!derived || slot.role !== 'work') return base;
  let kind = null;
  try { kind = model.bucket(slot.bucket).kind; } catch { kind = null; }
  if (kind !== 'resistance') return base;
  const fam = derived.D1_family;
  if (fam === 'hybrid_crossfit' || fam === 'strength') return 'strength';
  const lat = fill && fill.laterality;
  const bilateral = !lat || lat === 'bilateral';
  if (!MAIN_COMPOUND_BUCKETS.includes(slot.bucket) || !bilateral) return base;
  if (derived.lift_style === 'heavy_powerlifting') return 'strength';
  if (fam === 'athletic' && week && week.rep_phase === 'VOL3') return 'strength';
  return base;
}

/**
 * Minutes one working set of a slot takes: its work time plus the rest it is dosed with (v1.3 time model); legacy models fall
 * back to rules.time_model.minutes_per_set.
 * @returns {{minutes:number, work:number, rest:number, rest_class:string, time_class:string}}
 */
export function setCost(slot, fill, model, derived, week) {
  const T = model.rules.time_model;
  const tc = timeClassOf(slot, fill, model);
  if (!T.work_minutes || !T.rest_class_minutes) {
    const m = T.minutes_per_set[tc] !== undefined ? T.minutes_per_set[tc] : T.minutes_per_set.isolation;
    return { minutes: m, work: m, rest: 0, rest_class: 'legacy', time_class: tc };
  }
  const work = T.work_minutes[tc] !== undefined ? T.work_minutes[tc] : T.work_minutes.isolation;
  const rc = restClassOf(slot, fill, tc, model, derived, week);
  const rest = T.rest_class_minutes[rc] !== undefined ? T.rest_class_minutes[rc] : T.rest_class_minutes.hypertrophy;
  return { minutes: work + rest, work, rest, rest_class: rc, time_class: tc };
}

/**
 * Minutes of a superset group: the pair works back to back and rests once after the pair (ORD-05, VOL-14 'rest after the pair'):
 * max sets x (sum of the work times + the longest rest) + a short changeover per exercise.
 * @param {Array<{sets:number, cost:{work:number, rest:number, minutes:number}}>} members
 */
export function supersetMinutes(members, model) {
  const T = model.rules.time_model;
  if (members.length < 2) return members.length ? members[0].sets * members[0].cost.minutes + T.changeover_min_per_exercise : 0;
  if (T.superset_rule !== 'pair_shares_rest') return members.reduce((a, x) => a + x.sets * x.cost.minutes, 0) * T.superset_factor + T.changeover_in_superset_pair * members.length;
  // v0.4 fix round 2 / F1 (E-142; RECHECK v0.4 04 blocker: a 4th row set in the squat's superset was costed with the squat's 4.5-min
  // strength rest): round k holds the partners that still have a k-th set - their work, then the longest rest among them; a partner's
  // extra sets rest like a straight set of that exercise (equal sets: the v1.3 formula, sets x (sum of work + the longest rest))
  const rounds = Math.ceil(Math.max(...members.map(x => x.sets)) - EPS);
  let t = 0;
  for (let k = 1; k <= rounds; k++) {
    const act = members.filter(x => x.sets >= k - EPS);
    if (!act.length) continue;
    t += act.reduce((a, x) => a + x.cost.work, 0) + Math.max(...act.map(x => x.cost.rest));
  }
  return t + T.changeover_in_superset_pair * members.length;
}

/** minutes a test adds (rules.time_model.test_workup_minutes for a rep-max work-up; timed protocols by kind) */
export function testMinutes(slot, model) {
  const T = model.rules.time_model;
  if (!slot || !slot.test) return 0;
  if (slot.bucket === 'TEST') {
    const k = /cmj|jump/.test(slot.test) ? 'jumps' : /sprint/.test(slot.test) ? 'sprint' : /shuttle|5-10-5|l-test|agility/.test(slot.test) ? 'cod' : /mile|erg|trial|cardio/.test(slot.test) ? 'cardio' : 'jumps';
    return (T.test_item_minutes && T.test_item_minutes[k]) || 0;
  }
  if (slot.aerobic) return 0; // a cardio test replaces the session (its minutes are the session's)
  return T.test_workup_minutes || 0;
}
