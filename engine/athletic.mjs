// engine/athletic.mjs - the athletic work of a plan (engine stage B2, v0.4.0): Receive-Create stages per exercise block, how a
// contact drill is done and cued, the weekly athletic targets (the sport profile's budget split by the coach's plyo share) and
// the athletic stairway (doses that land on the targets, scaled to what the stations hold, climbing week by week).
// Owner: B2. Pure: no I/O, no clock, no randomness; every number comes from model.rules or the sport profile.
//
// Sources: COACH-R2 R2-ATH-01 (plyo share by the end of a block, blocks start 15 points more ballistic), R2-ATH-02 (what is
// ballistic / plyometric: pogo and ankle hops are plyometric), R2-ATH-03 (Receive-Create stages), R2-ATH-04 / R2-ATH-05 (Olympic),
// R2-ATH-07 (in-season), COACH-R3 R3-ATH-01 / 02 / 04 / 05 (swimming, 60+, sport shares, play weeks), R3-VOL-04 (the stairway
// grows by itself), R3-SES-02 step 4 (never flat); PER-02 (exercises stay for an exercise block); INFERRED rules are named in
// engine/DECISIONS.md E-26 ... E-45.
import { clamp, roundHalfUp, EPS, why } from './util.mjs';
import { setCost } from './timefit.mjs';

export const CONTACT_KEYS = Object.freeze(['plyo_contacts', 'jump_contacts', 'low_contacts']);
export const ATHLETIC_KEYS = Object.freeze(['plyo_contacts', 'jump_contacts', 'low_contacts', 'throws', 'cod_cuts', 'sprint_m', 'olympic_sets']);
export const PLANNED_KEYS = Object.freeze([...ATHLETIC_KEYS, 'upper_contacts']);
const STAGES = ['RC1', 'RC2', 'RC3'];
const RANK = { RC1: 1, RC2: 2, RC3: 3 };
// athletic budget key -> 04 profile pre_season factor key (PLYO plyometric, BALL ballistic jumps, JLK low / ankle contacts,
// THROW, COD, SPRINT, TE Olympic / triple extension); INFERRED mapping of the 04 vocabulary
const PRE_KEY = { plyo_contacts: 'PLYO', jump_contacts: 'BALL', low_contacts: 'JLK', throws: 'THROW', cod_cuts: 'COD', sprint_m: 'SPRINT', olympic_sets: 'TE' };
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const round4 = (x) => (x < 0 ? -1 : 1) * Math.floor(Math.abs(x) * 1e4 + 0.5 + EPS) / 1e4;

// ------------------------------------------------------------------------------------------------------------- stages

/**
 * Receive-Create stage of every week of a stairway block (R2-ATH-03 stages, PER-02 'the exercises stay for the block'): the
 * stage changes only where an exercise block starts, so no jump exercise changes mid-block (RECHECK 01 / 02 / 03 / 08).
 * Each exercise block takes the stage the approved week table gives most of its weeks (ties to the lower stage), one stage at
 * a time and never back down; a stairway with one exercise block holds its start stage (RC1, or RC2 for L2 / L3 athletes,
 * R2-ATH-03 'intermediate and advanced athletes may start at stage 2'). Rules without `align_to_exercise_blocks` keep the week
 * table. INFERRED (E-26).
 * @param {object} model @param {object} st model.stair(N) @param {'L1'|'L2'|'L3'} level
 * @returns {string[]} stage of week 1..N
 */
export function stagesForStairway(model, st, level) {
  const S = model.rules.athletic.stages;
  const N = st.N;
  const table = (w) => STAGES.find((s) => st.rc_weeks && st.rc_weeks[s] && w >= st.rc_weeks[s][0] && w <= st.rc_weeks[s][1]) || null;
  const start = S.start_stage || 'RC1';
  if (!S.align_to_exercise_blocks) {
    const out = []; let last = start;
    for (let w = 1; w <= N; w++) { last = table(w) || last; out.push(last); }
    return out;
  }
  const A = S.align_to_exercise_blocks;
  const ebs = (st.exercise_blocks && st.exercise_blocks.length ? st.exercise_blocks : [[1, N]]);
  const out = new Array(N).fill(start);
  if (ebs.length === 1) {
    const s0 = (A.single_block_start && A.single_block_start[level]) || start;
    return out.fill(s0);
  }
  let prev = null;
  for (const [a, z] of ebs) {
    const count = { RC1: 0, RC2: 0, RC3: 0 };
    for (let w = a; w <= z; w++) { const s = table(w); if (s) count[s]++; }
    let best = start;
    for (const s of STAGES) if (count[s] > count[best]) best = s; // ties keep the lower stage
    if (prev === null) best = RANK[best] > RANK[start] ? start : best; // a block opens on its start stage
    else {
      if (RANK[best] < RANK[prev]) best = prev; // never back down
      if (RANK[best] > RANK[prev] + 1) best = STAGES[RANK[prev]]; // one stage at a time
    }
    for (let w = a; w <= z; w++) out[w - 1] = best;
    prev = best;
  }
  return out;
}

// ------------------------------------------------------------------------------------------------------------- drills

/** how a contact drill is done (catalog `athletic.response`, B2): landing | single | repeat; null for non-contact records */
export function responseOf(ex) {
  const a = ex && ex.athletic;
  if (!a) return null;
  if (a.response) return a.response;
  if (a.quality === 'landing') return 'landing';
  return (ex.tags || []).includes('plyo_repeated') ? 'repeat' : 'single';
}

/** upper-body plyometric (push-up plyos, clap push-ups): never a lower-body contact or part of the share (RECHECK 03 major) */
export function isUpperPlyo(ex) {
  return !!(ex && ex.athletic && (ex.athletic.upper || (ex.tags || []).includes('push_up_floor')));
}

export function isUnilateral(ex) { return !!ex && (ex.laterality === 'unilateral' || ex.laterality === 'alternating'); }

/**
 * The planned-athletic key an item feeds (athletic_budget.planned; V27). Low-amplitude ankle work in the ankle slot is
 * `low_contacts`; a reactive (plyometric) jump `plyo_contacts`; a ballistic or landing jump `jump_contacts`; push-up plyos
 * `upper_contacts` (outside the lower-body budget and the share); a COD drill with no cut (a fade route) feeds nothing.
 * @param {string} bucket the effective bucket @param {object|null} ex @returns {string|null}
 */
export function athleticKeyOf(bucket, ex) {
  const q = ex && ex.athletic ? ex.athletic.quality : null;
  if (bucket === 'AP_TRIPLE_EXT') return 'olympic_sets';
  if (bucket === 'AP_PLYO' || bucket === 'AP_JUMP_LIMITED_KNEE') {
    if (isUpperPlyo(ex)) return 'upper_contacts';
    if (bucket === 'AP_JUMP_LIMITED_KNEE') return q === 'plyometric' ? 'low_contacts' : 'jump_contacts';
    return q === 'plyometric' ? 'plyo_contacts' : 'jump_contacts';
  }
  if (bucket === 'AP_THROW') return 'throws';
  if (bucket === 'AP_COD') return ex && ex.athletic && ex.athletic.no_cuts ? null : 'cod_cuts';
  if (bucket === 'AP_SPRINT') return 'sprint_m';
  return null;
}

/**
 * The cue a contact drill takes (rules.athletic.response_cues; R2-ATH-02 / R2-ATH-03): a landing drill is stuck (stage 1), a
 * single-response ballistic jump is one big effort and a reset, a single-response plyometric (depth jump, drop & go) is land &
 * go, low-amplitude ankle / pogo work is quick continuous contacts at every stage, a high-amplitude repeat drill is the stage-3
 * 'repeat'. A single-response drill never gets the repeat cue (RECHECK 02 major).
 * @returns {string} i18n note key
 */
export function cueKeyFor(ex, stage, model) {
  const C = model.rules.athletic.response_cues;
  const r = responseOf(ex);
  const q = ex.athletic ? ex.athletic.quality : null;
  if (!C) { // pre-B2 rules: the stage cue
    if (q === 'ballistic' || q === 'landing') return 'note.rc1';
    return 'note.' + String((ex.tags || []).includes('plyo_repeated') ? stage : (stage === 'RC3' ? 'RC2' : stage)).toLowerCase();
  }
  if (r === 'landing') return C.landing;
  if (r === 'repeat') return ex.athletic.low_amplitude ? C.repeat_low : (RANK[stage] >= 3 || q !== 'plyometric' ? C.repeat : C.repeat_low);
  // v0.4 fix round 1 / F2 (RECHECK 01 major: the same box jump and the same cue in 'Land', 'Land & Go' and 'Repeat'): a single
  // ballistic jump is done by the stage - stick the landing (1), stick then jump again (2), 2-3 jumps in a row (3); a box jump or a
  // loaded jump keeps 'one big effort, reset' after stage 1 (it lands on the box / carries a load)
  const SC = model.rules.athletic.f2 && model.rules.athletic.f2.ballistic_stage_cues;
  if (SC && q === 'ballistic' && !(ex.athletic && (ex.athletic.upper || ex.athletic.low_amplitude))) {
    if (stage === 'RC1') return SC.RC1;
    if (isFloorJump(ex) && SC[stage]) return SC[stage];
  }
  return q === 'plyometric' ? C.single_plyometric : C.single_ballistic;
}

/** F2: is an L2+ Olympic lift above the sport's Olympic ceiling (04 triple_ext.ceiling; no squat catch / pulls only)? shared with V19 */
export function olympicAboveCeiling(ex, sport, R, derived) {
  const OC = R.athletic.f2 && R.athletic.f2.olympic_ceiling;
  const ceil = sport && sport.olympic && sport.olympic.ceiling;
  if (!OC || !OC.enabled || !ceil || !ex || !ex.athletic || ex.athletic.olympic_tier !== 'L2_plus') return false;
  if (derived && derived.prefs && derived.prefs.olympic_full_lifts_opt_in) return false;
  if (ex.athletic.full_catch) return true;
  return ceil === 'pull' && !/pull|shrug/.test(ex.id);
}

/**
 * v0.4 fix round 2 / F2 (E-176; COACH-R2 R2-ATH-04 'some days are about cleans, and some days are about snatches ... I take snatches a little
 * bit more hingy than squatty'; RECHECK v0.4 01 / 03 minors: a clean pull on the deadlift day): the Olympic family of a clean / snatch
 * station follows the day's lower-body work lift - a knee-dominant work lift takes the clean family, a hip-dominant one the snatch
 * family; a day with no lower work lift (and a swing / jerk station) keeps the template's word. Shared by select and V19.
 * @param {string|null} variant the template station's variant @param {string|null} lowerBucket the day's lower work lift bucket
 */
export function olympicVariantByDay(variant, lowerBucket, R) {
  const S = R.athletic.r2 && R.athletic.r2.selection;
  if (!S || !S.olympic_by_day_lift || !['clean', 'snatch'].includes(variant) || !lowerBucket) return variant;
  if (['RP_BKD', 'RP_UKD'].includes(lowerBucket)) return 'clean';
  if (['RP_BHD', 'RP_UHD'].includes(lowerBucket)) return 'snatch';
  return variant;
}

/** a ballistic jump from the floor (squat / broad / streamline jumps): no box, step or plate to land on, no load (F2) */
export function isFloorJump(ex) {
  if (!ex || !ex.athletic || ex.athletic.quality !== 'ballistic' || ex.athletic.upper || ex.athletic.loaded_jump || (ex.tags || []).includes('loaded_jump')) return false;
  const setups = (ex.equipment && ex.equipment.any_of) || [];
  const LAND = ['box', 'step_low', 'plate_low_target', 'plyo_box_high', 'bench'];
  return setups.length > 0 && setups.some((su) => !su.some((t) => LAND.includes(t)));
}

function repHint(ex) {
  const t = ex && ex.rep_hint && ex.rep_hint.text;
  if (!t || /yard|min|\bs\b|sec|metre|meter|\bm\b|pattern|cal/i.test(t)) return null;
  const m = /(\d+)\s*-\s*(\d+)/.exec(t);
  if (m) return [Number(m[1]), Number(m[2])];
  const one = /^(\d+)\b/.exec(String(t).trim());
  return one ? [Number(one[1]), Number(one[1])] : null;
}

/** sprint metres for a drill (rules.athletic.sprint.metres_by_drill; LIB-21), rounded to rules.athletic.sprint.round_m */
export function sprintMetres(model, ex, progress) {
  const SP = model.rules.athletic.sprint || {};
  const kind = (ex && ex.athletic && ex.athletic.sprint_kind) || (ex && /max-velocity|top-speed/.test(ex.id) ? 'max_velocity' : ex && /accel|start/.test(ex.id) ? 'acceleration' : 'default');
  const table = SP.metres_by_drill || { default: model.rules.reps.matrix.sprint.metres };
  const mr = table[kind] || table.default || [10, 30];
  const step = SP.round_m || 1;
  const m = mr[0] + (mr[1] - mr[0]) * clamp(progress, 0, 1);
  return Math.max(step, Math.round(m / step + EPS) * step);
}

/**
 * Per-set dose bounds of an athletic item (rules.athletic.reconcile per_set_min / per_set_max, the record's rep hint, the
 * single-leg caps). A single-leg drill counts both legs (RECHECK 01 major 'per side contacts counted once'): its bounds step by
 * 2 and its per-leg dose is per_set / 2.
 * @returns {{lo:number, hi:number, step:number, uni:boolean, fixed:boolean}}
 */
export function perSetBounds(model, key, ex, progress = 0) {
  const R = model.rules;
  const RC = R.athletic.reconcile || {};
  let lo = (RC.per_set_min || {})[key] ?? 1, hi = (RC.per_set_max || {})[key] ?? Math.max(lo, 10);
  let step = 1, uni = false, fixed = false;
  const F2 = R.athletic.f2 || null;
  if (CONTACT_KEYS.includes(key) || key === 'upper_contacts') {
    const hint = repHint(ex);
    const tags = ex.tags || [];
    const singlePlyo = responseOf(ex) === 'single' && ex.athletic && ex.athletic.quality === 'plyometric';
    if ((tags.includes('depth_jump') || tags.includes('loaded_jump') || singlePlyo) && hint) hi = Math.min(hi, hint[1]);
    if (isUnilateral(ex) && RC.unilateral_counts_both_legs) {
      const low = key === 'low_contacts' || (ex.athletic && ex.athletic.low_amplitude);
      const legCap = low ? (RC.unilateral_contacts_per_leg_max_low || hi) : (RC.unilateral_contacts_per_leg_max || hi);
      const legHi = Math.max(1, Math.min(legCap, hint ? hint[1] : legCap, hi));
      const legLo = Math.min(legHi, Math.max(RC.unilateral_contacts_per_leg_min || 1, Math.ceil(lo / 2)));
      lo = 2 * legLo; hi = 2 * legHi; step = 2; uni = true;
    }
    // F2 (RECHECK 03 minor: 'right-angle ankle hops 2 x 12 contacts' = 2.4 patterns): a patterned drill is dosed in whole patterns
    const cyc = F2 && F2.contacts_per_cycle ? F2.contacts_per_cycle[ex.id] : null;
    if (isNum(cyc) && cyc > 1) {
      const c = uni ? 2 * cyc : cyc;
      step = c; lo = Math.max(c, Math.ceil(lo / c - EPS) * c); hi = Math.max(lo, Math.floor(hi / c + EPS) * c);
    }
  } else if (key === 'throws') {
    const kind = (ex.tags || []).includes('wall_ball') ? 'wall_ball' : ex.medball ? ex.medball.kind : null;
    const FT = F2 && F2.throws;
    // F2 (LIB-22 '1 x 10 per throw', the coach's 2 x 8-12; RECHECK 02 minor '3 x 20 every Monday'): a throw set is 6-10 throws,
    // a rotational / one-side throw 5-10 a side; the sit-up pass climbs inside its range instead of a fixed 20
    if (kind === 'situp' && FT && FT.situp_range) { lo = FT.situp_range[0]; hi = FT.situp_range[1]; }
    else if (kind === 'situp') { lo = hi = R.reps.matrix.throw.situp_reps; fixed = true; }
    else if (kind === 'wall_ball') { const w = R.reps.matrix.throw.wall_ball_reps; lo = w[0]; hi = w[0]; fixed = true; }
    else if (throwSided(ex)) { step = 2; if (FT && FT.per_side) { lo = 2 * FT.per_side[0]; hi = 2 * FT.per_side[1]; } else { lo = 2 * Math.ceil(lo / 2); hi = 2 * Math.floor(hi / 2); } }
    else if (FT && FT.per_set) { lo = FT.per_set[0]; hi = FT.per_set[1]; }
  } else if (key === 'cod_cuts') {
    // F2 (RECHECK 03 minor: '5-10-5 2 x 9 cuts' = 4.5 reps): a COD drill is dosed in whole reps of the drill (its cuts per rep)
    const cpr = F2 && F2.cod && F2.cod.cuts_per_rep ? F2.cod.cuts_per_rep[ex.id] : null;
    if (isNum(cpr) && cpr > 1) { step = cpr; lo = Math.max(cpr, Math.ceil(lo / cpr - EPS) * cpr); hi = Math.max(lo, Math.floor(hi / cpr + EPS) * cpr); }
  } else if (key === 'sprint_m') {
    const SP = R.athletic.sprint || { reps: R.reps.matrix.sprint.reps };
    const m = sprintMetres(model, ex, progress);
    lo = Math.max(lo, SP.reps[0] * m); hi = Math.max(lo, Math.min(hi, SP.reps[1] * m)); step = m;
    lo = Math.ceil(lo / m - EPS) * m; hi = Math.max(lo, Math.floor(hi / m + EPS) * m);
  }
  if (lo > hi) lo = hi;
  return { lo, hi, step, uni, fixed };
}

/** per side only for rotational / single-side throws (review 02 minor); an overhead or chest pass is counted as written */
export function throwSided(ex) {
  const kind = ex.medball ? ex.medball.kind : null;
  // F2 (RECHECK 03: a squat-to-chest pass dosed 'per side'): a straight sagittal chest pass is counted as written unless the
  // record names both sides ('R & L')
  if (kind === 'pass_rotation' && ex.plane === 'sagittal' && ex.laterality === 'bilateral' && !/r-and-l/.test(ex.id)) return false;
  return ex.plane === 'transverse' || ex.laterality === 'unilateral' || ex.laterality === 'alternating' || kind === 'pass_rotation';
}

/**
 * General-population timed circuits that keep their athletic work (rules.athletic.circuit_ballistic, B2): a circuit-format plan
 * of a listed family whose profile asks for medball throws, with a medball, a slam ball or a kettlebell in the kit.
 */
export function circuitBallistic(derived, model) {
  const CB = model.rules.athletic.circuit_ballistic;
  if (!CB || !CB.enabled || derived.goal === 'muscle') return false;
  const D6 = derived.D6_week_layout || {};
  if (!CB.families.includes(D6.family)) return false;
  let circuit = false;
  try {
    const dt = model.dayTypes(model.template(D6.family, D6.days), D6.variant);
    circuit = Object.values(dt.week_layout).some((e) => e && e.day_type && e.kind === 'main' && dt.day_types[e.day_type] && dt.day_types[e.day_type].format === 'circuit');
  } catch { circuit = false; }
  if (!circuit) return false;
  const w = (derived.D11_athletic_budget && derived.D11_athletic_budget.weekly) || {};
  if (!(Array.isArray(w.throws) && w.throws[1] > 0)) return false;
  const tok = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  return tok.has('medball') || tok.has('slam_ball') || tok.has('kettlebell');
}

// ------------------------------------------------------------------------------------------------------------- targets

/** does the training block that holds this week end with an end-test week (the test week holds the week before, B2) */
export function endTestHold(derived, model, week) {
  const R = model.rules;
  if (!R.athletic.reconcile || !R.athletic.reconcile.hold_end_test_week) return false;
  if (!week || week.stair_week == null || !week.stair_N || week.stair_N < 3) return false;
  const end = week.n + (week.stair_N - week.stair_week);
  const D13 = derived.D13_tests || {};
  // (fix round 2 / F2, E-174: a weigh-in or photo is no reason to hold the last week - only a physical test is; RECHECK v0.4 05 minor:
  // the bootcamp's throws held 39 = 39 in its last week)
  const TH = R.athletic.r2 && R.athletic.r2.tests && R.athletic.r2.tests.hold_for;
  const items = (D13.items || []).filter((x) => !Array.isArray(TH) || TH.includes(x));
  return items.length > 0 && (D13.end_weeks || []).includes(end);
}

/** stairway progress 0..1 of a week; with an end-test hold the ramp tops out the week before the test week */
export function rampProgress(derived, model, week) {
  if (!week || week.stair_week == null || !week.stair_N) return null;
  const N = week.stair_N;
  if (N <= 1) return 1;
  if (endTestHold(derived, model, week)) return clamp((week.stair_week - 1) / (N - 2), 0, 1);
  return clamp((week.stair_week - 1) / (N - 1), 0, 1);
}

/**
 * Split the week's high contacts H (all jumps), low contacts Lo (ankle work) and throws T by the plyo share s (R2-ATH-01:
 * plyometric share of all jump and throw work; R2-ATH-02: ankle / pogo hops are plyometric): plyometric X = reactive jumps Pj +
 * ankle work L', ballistic = the other jumps + throws, X = s (H + L' + T). The reactive : ankle split follows the profile's
 * own numbers (alpha = Ppro / (Ppro + Lo)); stage 1 (Receive) has no reactive jumps, so its plyometric part is ankle work
 * only (capped at Lo). INFERRED (E-28).
 * @returns {{plyo:number, jump:number, low:number}}
 */
export function splitContacts(H, Ppro, Lo, T, s, stage) {
  H = Math.max(0, H || 0); Lo = Math.max(0, Lo || 0); T = Math.max(0, T || 0); Ppro = Math.max(0, Ppro || 0);
  if (s === null || s === undefined) return { plyo: Math.min(H, Ppro), jump: Math.max(0, H - Math.min(H, Ppro)), low: Lo };
  s = clamp(s, 0, 0.95);
  if (stage === 'RC1') {
    const low = Math.min(Lo, (s * (H + T)) / (1 - s));
    return { plyo: 0, jump: H, low };
  }
  const alpha = Ppro + Lo > 0 ? Ppro / (Ppro + Lo) : 1;
  const X = (s * (H + T)) / (1 - s * (1 - alpha));
  let low = Math.min(Lo, (1 - alpha) * X);
  let plyo = Math.min(H, X - low);
  if (plyo < 0) plyo = 0;
  // when the jumps cannot hold the reactive part, the ankle work takes the rest (up to the profile's ankle work)
  if (low + plyo < X - EPS) low = Math.min(Lo, X - plyo);
  return { plyo, jump: Math.max(0, H - plyo), low };
}

/**
 * Athletic budget per week (CONTRACTS §4.5 athleticBudget; R2-ATH-01/03/07, R3-ATH-01/05). Never muscle sets (VOL-10). The
 * 04 weekly ranges ramp low -> high across a stairway (the end-test week holds the week before); pre-season / taper /
 * recovery / in-season / heavy-play factors as before (D-37, D-57, R2-ATH-07, R3-ATH-05); B2: the contact targets are the
 * share split (splitContacts) - `jump_contacts` = ballistic / landing jumps, `plyo_contacts` = reactive jumps, `low_contacts`
 * = ankle work.
 * @returns {Array<{n:number, enabled:boolean, plyo_share:number|null, stage:string|null, factor:number, targets:object, contacts_session_max:number, hold:boolean}>}
 */
export function athleticBudget(derived, shape, model) {
  const R = model.rules, A = R.athletic;
  const D11 = derived.D11_athletic_budget;
  const sp = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
  const enabled = !!D11.enabled && D11.older_mode !== 'default';
  const weekly = D11.weekly || {};
  const split = !!(A.split && D11.plyo_share);
  const cb = circuitBallistic(derived, model);
  const tokB = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  const canThrow = !(A.f2 && A.f2.share) || tokB.has('medball') || tokB.has('slam_ball');
  const out = [];
  for (const ws of shape.weeks) {
    const tb = shape.training_blocks.find(b => b.n === ws.training_block);
    const stair = ws.stair_week !== null && ws.stair_week !== undefined && tb.stair_N;
    const frac = stair ? rampProgress(derived, model, { ...ws, stair_N: tb.stair_N }) : null;
    const baseOf = (k) => {
      const r = weekly[k];
      if (!Array.isArray(r)) return null;
      if (frac !== null) return r[0] + (r[1] - r[0]) * frac;
      if (tb.type === 'maintenance') return r[0];
      return r[1];
    };
    const f = {};
    let factor = 1;
    for (const k of ATHLETIC_KEYS) f[k] = 1;
    if (tb.type === 'pre_season' || tb.type === 'taper') {
      const pre = (sp && sp.pre_season) || {};
      for (const k of ATHLETIC_KEYS) f[k] = isNum(pre[PRE_KEY[k]]) ? pre[PRE_KEY[k]] : 1;
      factor = isNum(pre.PLYO) ? pre.PLYO : 1;
      if (tb.type === 'taper') {
        const t = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : R.volume.phase_factors.taper.factor;
        for (const k of ATHLETIC_KEYS) f[k] *= t;
        factor = t;
      }
    } else if (tb.type === 'recovery') {
      for (const k of ATHLETIC_KEYS) f[k] = R.recovery.athletic_factor;
      f.olympic_sets = R.recovery.olympic.sets_factor;
      factor = R.recovery.athletic_factor;
    } else if (tb.type === 'in_season' && D11.game_heavy) {
      const G = A.in_season_game_heavy;
      f.plyo_contacts = G.plyo_factor; f.jump_contacts = G.plyo_factor;
      if (!G.extra_cod) f.cod_cuts = 0;
      if (G.sprints === 'speed_athletes_only' && !(sp && sp.speed_athlete)) f.sprint_m = 0;
      factor = G.plyo_factor;
    }
    if (D11.heavy_play_week) { // R3-ATH-05 (approved): weeks with 3+ play sessions drop extra agility and half the jumps
      const H = A.heavy_play_weeks;
      f.plyo_contacts *= H.plyo_factor; f.jump_contacts *= H.plyo_factor;
      if (!H.extra_cod) f.cod_cuts = 0;
      factor = factor * H.plyo_factor;
    }
    let plyo_share = null;
    if (enabled && D11.plyo_share) {
      const ps = D11.plyo_share;
      plyo_share = round4(frac !== null ? ps.start + (ps.end - ps.start) * frac : ps.end);
    }
    const raw = {};
    for (const k of ATHLETIC_KEYS) raw[k] = baseOf(k);
    const targets = {};
    if (split && raw.jump_contacts !== null) {
      // F2: a client who cannot throw (no medball or slam ball, or throws cut for pain) holds the share over the jump work only
      const sc = splitContacts(raw.jump_contacts, raw.plyo_contacts, raw.low_contacts, canThrow ? raw.throws : 0, plyo_share, ws.plyo_stage);
      targets.plyo_contacts = roundHalfUp(sc.plyo * f.plyo_contacts);
      targets.jump_contacts = roundHalfUp(sc.jump * f.jump_contacts);
      targets.low_contacts = raw.low_contacts === null ? null : roundHalfUp(sc.low * f.low_contacts);
    } else {
      // no share: the jumps of the profile are ballistic / landing work, its plyometric number the reactive part
      const H = raw.jump_contacts, P = raw.plyo_contacts;
      targets.plyo_contacts = P === null ? null : roundHalfUp(Math.min(P, H === null ? P : H) * f.plyo_contacts);
      targets.jump_contacts = H === null ? null : roundHalfUp(Math.max(0, H - (P || 0)) * f.jump_contacts);
      targets.low_contacts = raw.low_contacts === null ? null : roundHalfUp(raw.low_contacts * f.low_contacts);
    }
    for (const k of ['throws', 'cod_cuts', 'sprint_m', 'olympic_sets']) targets[k] = raw[k] === null ? null : roundHalfUp(raw[k] * f[k]);
    if (tb.type === 'in_season' && targets.olympic_sets !== null && A.in_season_game_heavy && D11.game_heavy) targets.olympic_sets = Math.min(targets.olympic_sets, R.olympic.in_season.sets);
    // R3-ATH-02 (approved, B2): the 60+ default doses landings (jump contacts), light throws and quick stepping (COD) toward the
    // profile; reactive jumps, ankle hops, sprints and Olympic lifts are off unless switched on
    const olderDefault = !!D11.enabled && D11.older_mode === 'default' && R.population.older && R.population.older.default_on;
    if (olderDefault) {
      for (const k of ['plyo_contacts', 'low_contacts', 'sprint_m', 'olympic_sets']) targets[k] = null;
      if (raw.jump_contacts !== null) targets.jump_contacts = roundHalfUp(raw.jump_contacts * f.jump_contacts);
    } else if (!enabled) {
      for (const k of ATHLETIC_KEYS) if (k !== 'low_contacts') targets[k] = null;
      // a general-population circuit keeps its medball throws (RECHECK 05 major; B2)
      if (cb && raw.throws !== null) targets.throws = roundHalfUp(raw.throws * f.throws);
    }
    const hold = !!(stair && endTestHold(derived, model, { ...ws, stair_N: tb.stair_N }) && ws.stair_week === tb.stair_N);
    out.push({ n: ws.n, enabled, plyo_share, stage: ws.plyo_stage, factor: round4(factor), targets, contacts_session_max: D11.contacts_session_max, hold });
  }
  return out;
}

// ------------------------------------------------------------------------------------------------------------- stations (F2)

/**
 * v0.4 fix round 1 / F2 (RECHECK 01 / 02 / 03 / 08: one jump station for a swimmer whose main quality is jumping, no ballistic jump
 * for a soccer player, one sprint station for a linebacker, one 1-set throw station, Friday with no jump or throw): the sport's
 * athletic tracks get the stations their week needs, read from the plan's own weekly targets (athleticBudget: the share split, the
 * season factors) at the training block's peak - a station holds about rules.athletic.f2.tracks.per_station of its key at 2 sets,
 * at most max_stations a week. Jump / throw stations go to the main day with the fewest jump / throw stations, inside the
 * R3-SES-01 day split (cross pattern 2, same pattern 4), then to the day farthest from the track's other stations. The low-amplitude
 * ankle block (pogo / ankle hops) is quick prep work: outside the day split and the 12 + 2 count, its own time class, spread over 2
 * days for a bone-loading sport (BONE_LOADING_NON_IMPACT) and kept for a profile with an ankle track (R3-ATH-02). A stay-active
 * plan adds only the first station of a track (its minutes go to strength first). Mutates the days' `_slots`.
 * @param {Array} mains the week's main days (week.mjs) @param {object} ctx week.mjs context @param {Set<string>} kit tokens
 * @param {boolean} olderDefault 60+ without the opt-in @param {object} H week.mjs helpers {slotFromStation, keepStationIgnoringMinutes, daySlotsOf, weekdayIndex}
 */
export function ensureAthleticStations(mains, ctx, kit, olderDefault, H) {
  const { R, derived, model } = ctx;
  const F2 = R.athletic.f2, T = F2.tracks, AB = F2.ankle_block || {};
  const RC = R.athletic.reconcile;
  let bud = [];
  try {
    const all = athleticBudget(derived, ctx.shape, model);
    bud = all.filter((b, i) => ctx.shape.weeks[i] && ctx.shape.weeks[i].training_block === ctx.tb.n);
  } catch { bud = []; }
  const peakOf = (keys) => bud.reduce((m, b) => Math.max(m, keys.reduce((a, k) => a + (isNum(b.targets[k]) ? b.targets[k] : 0), 0)), 0);
  const competitive = !!(derived.D2_profile && derived.D2_profile.competitive === 'competitive');
  const stayActive = derived.D1_family === 'athletic' && !competitive;
  const prof = ctx.profile || null;
  const SP = R.athletic.sprint || { reps: R.reps.matrix.sprint.reps };
  const focus = prof ? prof.sprint_focus || null : null;
  const mByKind = (SP.metres_by_drill || {});
  const sprintStation = 2 * (SP.reps ? SP.reps[1] : 6) * ((mByKind[focus === 'max_velocity' ? 'max_velocity' : 'acceleration'] || mByKind.default || [10, 30])[1]);
  const injuries = new Set((prof && prof.injuries) || []);
  const bone = (AB.bone_loading_codes || []).some((c) => injuries.has(c));
  const ankleTrack = !!(prof && prof.plyo_rules && prof.plyo_rules.ankle_track);
  const isJump = (s) => s.bucket === 'AP_PLYO' && s.variant !== 'upper';
  const JT = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW'];
  const slotsOf = H.daySlotsOf;
  const jtCount = (d) => slotsOf(d).filter((s) => JT.includes(s.bucket) && !s.ankle_block).length;
  const splitMax = AB.outside_day_split ? (ctx.variant === 'same_pattern' ? 4 : 2) : Infinity;
  const WDI = H.weekdayIndex;
  const gapTo = (d, isSt) => {
    const others = mains.filter((x) => x !== d && slotsOf(x).some(isSt)).map((x) => WDI[x.weekday]);
    if (!others.length) return 7;
    return Math.min(...others.map((i) => { const g = Math.abs(WDI[d.weekday] - i); return Math.min(g, 7 - g); }));
  };
  const capN = R.session.athlete_cap || Infinity;
  const roomOf = (d) => capN - slotsOf(d).filter((s) => s.counts_in_cap).length;
  const tierOf = (k) => { const v = prof && prof.tiers ? prof.tiers[k] : null; const m = /T(\d)/.exec(String(v || '')); return m ? Number(m[1]) : 0; };
  const topTier = Math.max(0, ...['plyo', 'throws', 'cod', 'sprint'].map(tierOf));
  const markAnkle = (s, first) => {
    s.ankle_block = true;
    if (AB.outside_athlete_cap) s.counts_in_cap = false;
    if (AB.time_class) s.time_class = AB.time_class;
    if (first && AB.keep_for_ankle_track && ankleTrack && (derived.session_minutes || 60) >= (AB.keep_from_minutes || 0)) s.ankle_keep = true;
  };
  const tracks = [
    { key: 'jump_contacts', keys: ['plyo_contacts', 'jump_contacts'], bucket: 'AP_PLYO', isSt: isJump, ok: !olderDefault && !ctx.dropped.has('AP_PLYO'), per: T.per_station.jumps, max: T.max_stations.jumps, jt: true, dayMax: 1, tier: tierOf('plyo') },
    { key: 'throws', keys: ['throws'], bucket: 'AP_THROW', isSt: (s) => s.bucket === 'AP_THROW', ok: (kit.has('medball') || kit.has('slam_ball')) && !olderDefault && !ctx.dropped.has('AP_THROW'), per: T.per_station.throws, max: T.max_stations.throws, jt: true, dayMax: (RC.stations_per_day_max || {}).AP_THROW || 1, tier: tierOf('throws') },
    // (a bone-loading sport spreads the ankle block over 2 days when its peak target holds a full block on each of them)
    { key: 'low_contacts', keys: ['low_contacts'], bucket: 'AP_JUMP_LIMITED_KNEE', isSt: (s) => s.bucket === 'AP_JUMP_LIMITED_KNEE', ok: !olderDefault && !ctx.dropped.has('AP_JUMP_LIMITED_KNEE'), per: T.per_station.low_contacts, max: T.max_stations.low_contacts,
      min: bone && peakOf(['low_contacts']) >= (AB.bone_loading_min_peak || 0) - EPS ? (AB.bone_loading_days || 1) : 1, ankle: true, dayMax: 1 },
    { key: 'cod_cuts', keys: ['cod_cuts'], bucket: 'AP_COD', isSt: (s) => s.bucket === 'AP_COD', ok: !ctx.dropped.has('AP_COD'), per: T.per_station.cod_cuts, max: T.max_stations.cod_cuts, dayMax: (RC.stations_per_day_max || {}).AP_COD || 1, tier: tierOf('cod') },
    { key: 'sprint_m', keys: ['sprint_m'], bucket: 'AP_SPRINT', isSt: (s) => s.bucket === 'AP_SPRINT', ok: !olderDefault && !ctx.dropped.has('AP_SPRINT') && (kit.has('open_space_long') || kit.has('open_space_short')), per: sprintStation, max: T.max_stations.sprint_m,
      min: T.sprint_second_station && F2.sprint && F2.sprint.max_velocity_station && focus === 'both' ? 2 : 1, dayMax: 1, tier: tierOf('sprint') }
  ];
  // the sport's higher-tier tracks place their stations first (04 tiers: a linebacker's sprints before his throws)
  const ordered = tracks.map((t, i) => ({ t, i })).sort((a, b) => (b.t.tier || 0) - (a.t.tier || 0) || a.i - b.i).map((x) => x.t);
  for (const t of ordered) {
    if (!t.ok) continue;
    const pk = peakOf(t.keys);
    if (!(pk > 0)) continue;
    let need = Math.min(t.max, Math.max(t.min || 1, Math.ceil(pk / t.per - EPS)));
    const have = () => mains.reduce((a, d) => a + slotsOf(d).filter(t.isSt).length, 0);
    if (stayActive && !t.ankle) need = Math.min(need, Math.max(1, have())); // a stay-active plan: the track's first station only
    // a short session (under add_from_minutes) keeps its minutes for the strength work: the track's first station only (E-80:
    // the fixed blocks already fill a 30-minute session)
    if ((derived.session_minutes || 60) < (T.add_from_minutes || 0)) need = Math.min(need, Math.max(1, have()));
    if (t.ankle) need = Math.max(need, Math.min(t.max, t.min || 1));
    // a single existing station written at 1 set takes 2 (e.g. the swimmer's throw)
    for (const d of mains) for (const sl of slotsOf(d)) if (t.isSt(sl) && Array.isArray(sl.sets_hint) && sl.sets_hint[0] < 2) sl.sets_hint = [2, Math.max(2, sl.sets_hint[1])];
    const existing = mains.flatMap((d) => slotsOf(d).filter(t.isSt));
    if (t.ankle) existing.forEach((s, i) => { markAnkle(s, i === 0); s.track_index = i; });
    if (existing[0] && t.key !== 'jump_contacts') existing[0].track = t.key; // the first station of the track is protected from the time cut
    for (let guard = 0; have() < need && guard < 12; guard++) {
      // an added station keeps a day inside the 12 + 2 count (R2-SES-04 / R3-SES-01: the strength groups keep their 2-4 exercises);
      // only the sport's top-tier track (04 tiers, T3+) may take a full day's place, on the day with the most room
      const over = (t.tier || 0) >= 3 && (t.tier || 0) >= topTier;
      const cands = mains.filter((d) => slotsOf(d).filter(t.isSt).length < t.dayMax && (!t.jt || jtCount(d) < splitMax) && (roomOf(d) >= 1 || over || !have() || (t.ankle && AB.outside_athlete_cap)))
        .map((d) => ({ d, jt: jtCount(d), n: slotsOf(d).filter(t.isSt).length, gap: gapTo(d, t.isSt), room: roomOf(d) }))
        .sort((a, b) => b.room - a.room || (t.jt ? a.jt - b.jt : a.n - b.n) || b.gap - a.gap || a.d._day_index - b.d._day_index);
      const d = cands[0] && cands[0].d;
      if (!d) break;
      const tpl = (d._def.stations || []).find((x) => x.bucket === t.bucket && (t.bucket !== 'AP_PLYO' || x.variant !== 'upper') && !slotsOf(d).some((s) => s.station_id === x.id) && H.keepStationIgnoringMinutes(x, ctx));
      const k = slotsOf(d).filter((s) => /\.t\d+$/.test(s.station_id)).length + 1;
      const st = tpl || { id: `${d.day_type}.t0${k}`, bucket: t.bucket, role: 'athletic', block: 'athletic', group: null, sets_hint: [2, 2], pair: null,
        superset: null, superset_below_minutes: null, circuit: null, include_from_minutes: null, axial: null, variant: null, laterality_dial: false, loading: null,
        movable: false, counts_as_volume: true, condition: null, older_default_excluded: false, note: null, pool_filter: null };
      const slot = H.slotFromStation(d.weekday, st, d._def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex: d._day_index });
      slot.why.push(why('why.athletic_reconcile', 'D-63'));
      if (t.ankle) {
        markAnkle(slot, !existing.length && have() === 0);
        // fix round 2 / F2 (E-162): the order the ankle days open in; a bone-loading sport's extra ankle day is quick prep done in the
        // warm-up window (1-2 short sets after the cardio, like the A-drills; ORD-08): no session minutes of its own, so it never
        // costs a strength group in the time check
        slot.track_index = have();
        const A2 = R.athletic.r2 && R.athletic.r2.ankle_second_day;
        // (only the day the bone-loading rule adds beyond what the contacts need by size: a field sport's second ankle block is a full
        // block with its own minutes)
        if (A2 && A2.in_warmup_window && have() >= Math.max(1, Math.ceil(pk / t.per - EPS))) slot.prep_in_warmup = true;
      }
      // a station the week's targets need is part of the track: protected from the time cut and the athlete-cap trim like the
      // track's first station (the strength work gives the minutes, R3-SES-01 'athletes: jump / throw stations + 1 Olympic lift')
      slot.track = t.key;
      slot.track_added = true;
      const at = d._slots.findIndex((s) => s.block === 'power' || s.block === 'strength' || s.block === 'accessories');
      d._slots.splice(at < 0 ? d._slots.length : at, 0, slot);
    }
    // v0.4 fix round 2 / F2 (E-168; RECHECK v0.4 03 major: Wednesday's jump slot went to an upper-body push-up jump for 8 weeks while the
    // week held 16-27 % of the soccer jump targets): a sport whose jump track is short of stations turns the template's upper-body plyo
    // station into a lower-body jump station (the profiles carry no upper-body plyo target) - only for the stations the track could
    // not add within the 12 + 2 count, so a week that already holds its jump stations keeps its layout
    const R2S = R.athletic.r2 && R.athletic.r2.selection;
    if (t.key === 'jump_contacts' && R2S && R2S.upper_plyo_to_jump_when_short) {
      for (const d of mains) for (const sl of slotsOf(d)) {
        if (have() >= need) break;
        if (sl.bucket !== 'AP_PLYO' || sl.variant !== 'upper' || slotsOf(d).filter(t.isSt).length >= t.dayMax) continue;
        sl.variant = null; sl.note_tokens = []; sl.from_upper = true; sl.track = t.key;
        sl.why = [...(sl.why || []), why('why.athletic_reconcile', 'D-63')];
      }
    }
  }
}

/**
 * v0.4 fix round 1 / F2 (COACH-R3 R3-SES-02 'recommend supersets so that it's a faster workout'): a day's lower-body jump and its
 * medball throw are a recommended contrast pair (they do not compete: legs, then trunk and arms) - done back to back, they share
 * the rest. A recommendation (superset_eligible), switched on only when the time needs it, like the strength pairs (E-90).
 * @param {object} day a finalized week.mjs day (blocks / slots)
 */
export function pairAthleticBlock(day) {
  const blk = (day.blocks || []).find((b) => b.kind === 'athletic');
  if (!blk) return;
  const free = (s) => !s.superset && !s.superset_eligible && !s.test;
  const jump = blk.slots.find((s) => s.bucket === 'AP_PLYO' && s.variant !== 'upper' && free(s));
  const thr = blk.slots.find((s) => s.bucket === 'AP_THROW' && free(s));
  if (!jump || !thr) return;
  jump.superset_eligible = 'AJ1'; thr.superset_eligible = 'AJ1';
  blk.slots.splice(blk.slots.indexOf(thr), 1);
  blk.slots.splice(blk.slots.indexOf(jump) + 1, 0, thr);
}

// ------------------------------------------------------------------------------------------------------------- the athletic stairway

const ORDER_KEYS = ['plyo_contacts', 'jump_contacts', 'low_contacts', 'throws', 'cod_cuts', 'sprint_m'];

function stepRound(x, step) { return step > 1 ? Math.round(x / step + EPS) * step : roundHalfUp(x); }

/**
 * Dose every athletic item of a week so each budget key lands on its goal: per-set = goal / the key's sets, in the item's
 * bounds and steps, the remainder handed out in slot order. Mutates `items[i].per`.
 */
function distribute(items, goal) {
  if (!items.length) return;
  const sets = items.reduce((a, it) => a + it.sets, 0);
  const p = sets > 0 ? goal / sets : 0;
  for (const it of items) it.per = clamp(stepRound(p, it.b.step), it.b.lo, it.b.hi);
  const total = () => items.reduce((a, it) => a + it.sets * it.per, 0);
  for (let guard = 0; guard < 400; guard++) {
    const diff = goal - total();
    let moved = false;
    if (diff > EPS) {
      for (const it of items) { if (it.b.fixed || it.per + it.b.step > it.b.hi + EPS) continue; if (it.sets * it.b.step > diff + it.sets * it.b.step / 2 + EPS) continue; it.per += it.b.step; moved = true; break; }
    } else if (diff < -EPS) {
      // (fix round 2 / F2: a dose exactly half a step over its goal stays - the same half step up and down made the loop end on
      // whichever side its guard ran out, e.g. 560 m of sprints against a 600 m goal)
      for (const it of items.slice().reverse()) { if (it.b.fixed || it.per - it.b.step < it.b.lo - EPS) continue; if (it.sets * it.b.step >= -diff + it.sets * it.b.step / 2 - EPS) continue; it.per -= it.b.step; moved = true; break; }
    }
    if (!moved) break;
  }
}

/** contacts per day stay under the session cap (ATH-01, rules.athletic.contacts_per_session_max) */
function capDays(items, cap) {
  if (!cap) return;
  const byDay = new Map();
  for (const it of items) if (CONTACT_KEYS.includes(it.key)) { if (!byDay.has(it.weekday)) byDay.set(it.weekday, []); byDay.get(it.weekday).push(it); }
  for (const list of byDay.values()) {
    for (let guard = 0; guard < 200; guard++) {
      const tot = list.reduce((a, it) => a + it.sets * it.per, 0);
      if (tot <= cap + EPS) break;
      const c = list.filter(it => !it.b.fixed && it.per - it.b.step >= it.b.lo - EPS).sort((a, b) => b.sets * b.per - a.sets * a.per)[0];
      if (!c) break;
      c.per -= c.b.step;
    }
  }
}

function dayRoom(items, it, cap) {
  if (!cap || !CONTACT_KEYS.includes(it.key)) return Infinity;
  return cap - items.filter(x => x.weekday === it.weekday && CONTACT_KEYS.includes(x.key)).reduce((a, x) => a + x.sets * x.per, 0);
}

/**
 * The athletic stairway of a plan (B2, E-29): per training block and key, the goal of each week is the budget target (the
 * ballistic / reactive jump goals move to the jump stations the week holds and share one budget); when a key's stations cannot
 * hold its goal, its exercise block is scaled by one factor, so the work keeps the shape of the target and still climbs (R3-SES-02
 * step 4 'never flat', R3-VOL-04); a week never plans more than a later week of the block can hold; contacts per day stay under
 * the session cap; inside a stairway block the contact / throw / cut / sprint totals never drop (RECHECK 01 / 08 'the hardest
 * weeks get the fewest contacts'); the end-test week holds the week before; a stairway peak under the told share of the sport
 * target is told (`warning.athletic_capacity`).
 *
 * v0.4 fix round 2 / F2 (rules.athletic.r2, DECISIONS E-160 ... E-166): the jumps and the ankle work are two never-drop families;
 * one scale down the training block (a later exercise block never plans a smaller share of its target than an earlier one, so the
 * work climbs to what the hardest weeks hold instead of holding flat for weeks) with the full key of a family handing its rest to
 * the family's other stations; a station whose family is under its target with every dose at the top takes one more set where the
 * day has the minutes (`opts.rooms`); a bone-loading sport's second ankle day opens with the exercise block whose target holds it;
 * the weekly plyo share never passes the block-end share; a pre-season block plans its sprint metres and cuts at or above the last
 * off-season week (R2-PER-06); a station a timed test replaces is dosed with its week and left out (`replaced`); on the tested days
 * of the end-test week the athletic and Olympic work runs the baseline week's dose (R2-PER-07).
 * @param {object} model @param {object} derived @param {object} shape @param {Array} budget athleticBudget()
 * @param {Array<Array<{slot_id:string, weekday:string, bucket:string, ex:object, sets:number, time_class?:string, order?:number, replaced?:boolean, test_day?:boolean}>>} weeksItems athletic items per week
 * @param {{rooms?:Array<Object<string,number>>}} [opts] rooms: per week, the minutes each weekday has left inside its session length
 * @returns {{weeks: Array<{slot_plan:Object<string,{per_set?:number, per_leg?:number|null, key:string, sets?:number}>, goals:object, scale:object, hold?:boolean, replaced?:object, minutes_delta?:object}>, warnings:Array}}
 */
export function planAthletic(model, derived, shape, budget, weeksItems, opts = {}) {
  const R = model.rules, RC = R.athletic.reconcile || {};
  const R2 = R.athletic.r2 || null;
  const outWeeks = shape.weeks.map(() => ({ slot_plan: {}, goals: {}, scale: {} }));
  const warnings = [];
  if (!RC.enabled) return { weeks: outWeeks, warnings };
  const cap = (budget[0] && budget[0].contacts_session_max) || null;
  const fams = RC.climb_families || { contacts: CONTACT_KEYS, throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] };
  const D11 = derived.D11_athletic_budget || {};
  const rooms = Array.isArray(opts.rooms) ? opts.rooms : null;
  const T = R.time_model || {};
  const changeover = isNum(T.changeover_min_per_exercise) ? T.changeover_min_per_exercise : 0;
  const costOf = (it, ws) => (it.free ? 0 : setCost({ slot_id: it.slot_id, bucket: it.bucket, role: 'athletic', time_class: it.time_class || null }, { laterality: it.ex && it.ex.laterality, bucket: it.bucket }, model, derived, ws).minutes);
  let prevPeak = null; // the planned totals per key of the last stairway's peak week (the pre-season holds its speed work, E-164)
  for (const tb of shape.training_blocks) {
    const wks = shape.weeks.filter(w => w.training_block === tb.n);
    const stair = tb.type === 'stairway';
    // items with keys and bounds
    const data = wks.map((ws) => {
      const prog = ws.stair_week != null && tb.stair_N ? rampProgress(derived, model, { ...ws, stair_N: tb.stair_N }) : 1;
      const olympic = [];
      const items = (weeksItems[ws.n - 1] || []).map((x) => {
        const key = athleticKeyOf(x.bucket, x.ex);
        if (key === 'olympic_sets' && x.sets > 0) olympic.push({ ...x, key, sets0: x.sets });
        if (!key || key === 'olympic_sets' || !(x.sets > 0)) return null;
        // per = null: no plan (the dose matrix; e.g. upper-body plyos, a key without a sport target)
        return { ...x, key, b: perSetBounds(model, key, x.ex, prog ?? 1), per: null, sets0: x.sets, replaced: !!x.replaced };
      }).filter(Boolean);
      const t = (budget[ws.n - 1] && budget[ws.n - 1].targets) || {};
      const goals = {};
      for (const k of ORDER_KEYS) goals[k] = isNum(t[k]) ? t[k] : null;
      // the jumps of the week land on its jump stations: a reactive goal with no reactive station (stage 1, or a kit / pain
      // filter) goes to the ballistic jumps and back (the total jump volume of the profile stays)
      const has = (k) => items.some(it => it.key === k);
      for (const it of items) it.dkey = it.key; // the key the dose is distributed on (reactive / ballistic jumps may share one pool)
      if (isNum(goals.plyo_contacts) && isNum(goals.jump_contacts)) {
        if (!has('plyo_contacts') && has('jump_contacts')) { goals.jump_contacts += goals.plyo_contacts; goals.plyo_contacts = 0; }
        else if (!has('jump_contacts') && has('plyo_contacts')) { goals.plyo_contacts += goals.jump_contacts; goals.jump_contacts = 0; }
        else if (has('plyo_contacts') && has('jump_contacts') && (goals.plyo_contacts <= 0 || goals.jump_contacts <= 0)) {
          // a key with stations but no goal of its own (e.g. a repeat drill in the Receive stage): the jumps share one goal
          goals.jump_contacts += goals.plyo_contacts; goals.plyo_contacts = 0;
          for (const it of items) if (it.key === 'plyo_contacts') it.dkey = 'jump_contacts';
        }
      }
      return { ws, items, olympic, dormant: [], goals, hold: !!(budget[ws.n - 1] && budget[ws.n - 1].hold) };
    });
    const ebsOf = [...new Set(data.map(d => d.ws.exercise_block))];
    // E-164 (R2-PER-06 'more speed and power'): a pre-season block plans its sprint metres and cuts at or above the last off-season
    // week's (what the stations hold still bounds it)
    const PH = R2 && R2.pre_season_hold;
    if (PH && tb.type === 'pre_season' && prevPeak) {
      for (const d of data) for (const k of PH.keys || []) if (isNum(d.goals[k]) && isNum(prevPeak[k]) && d.items.some(it => it.dkey === k)) d.goals[k] = Math.max(d.goals[k], prevPeak[k]);
    }
    // E-162: a second ankle day waits for the exercise block whose first week's ankle target holds a minimum set on every open day
    // (bone loading twice a week from there; never opened mid-block, PER-02)
    const AS = R2 && R2.ankle_second_day;
    if (stair && AS && AS.opens_when_target_holds_min) {
      const slots = new Map();
      for (const d of data) for (const it of d.items) if (it.key === 'low_contacts' && it.dkey === 'low_contacts' && !slots.has(it.slot_id)) slots.set(it.slot_id, { order: isNum(it.order) ? it.order : 99, lo: it.b.lo });
      const ordered = [...slots.entries()].sort((a, b) => a[1].order - b[1].order || (a[0] < b[0] ? -1 : 1)).map(([id]) => id);
      if (ordered.length > 1) {
        let open = 1;
        for (const eb of ebsOf) {
          const dws = data.filter(d => d.ws.exercise_block === eb);
          const g = dws[0].goals.low_contacts;
          if (isNum(g)) {
            let n = 0, need = 0;
            for (const id of ordered) { const it = dws[0].items.find(x => x.slot_id === id); if (!it) break; need += it.b.lo; if (need <= g + EPS) n++; else break; }
            open = Math.max(open, Math.min(ordered.length, Math.max(1, n)));
          }
          const waiting = new Set(ordered.slice(open));
          for (const d of dws) {
            for (const it of d.items.filter(x => waiting.has(x.slot_id))) d.dormant.push(it);
            d.items = d.items.filter(x => !waiting.has(x.slot_id));
          }
        }
      }
    }
    const famKeys = Object.values(fams);
    const famGoal = (d, keys) => keys.reduce((a, k) => a + (isNum(d.goals[k]) && d.goals[k] > 0 && d.items.some(it => it.dkey === k) ? d.goals[k] : 0), 0);
    const famCap = (d, keys) => d.items.filter(it => keys.includes(it.dkey) && isNum(d.goals[it.dkey]) && d.goals[it.dkey] > 0).reduce((a, it) => a + it.sets * it.b.hi, 0);
    // E-161: one more set on a station whose family is under its week's target with every per-set dose at the top - on the day with
    // the most minutes left, only while that day stays inside its minutes in every later week of the block; the set stays (VOL-07)
    const SC = R2 && R2.set_climb;
    if (stair && SC && SC.enabled && rooms) {
      const left = data.map(d => ({ ...(rooms[d.ws.n - 1] || {}) }));
      // (a waiting ankle day gives its minutes back)
      for (let i = 0; i < data.length; i++) for (const it of data[i].dormant) if (!it.replaced && !it.free && isNum(left[i][it.weekday])) left[i][it.weekday] += it.sets0 * costOf(it, data[i].ws) + changeover;
      const extra = new Map();
      for (const keys of famKeys) {
        for (let i = 0; i < data.length; i++) {
          const d = data[i];
          for (const it of d.items) if (keys.includes(it.dkey)) it.sets = it.sets0 + (extra.get(it.slot_id) || 0);
          if (d.hold) continue;
          const G = famGoal(d, keys);
          for (let guard = 0; guard < 12 && famCap(d, keys) < G - EPS; guard++) {
            const fits = (it) => {
              for (let j = i; j < data.length; j++) {
                const x = data[j].items.find(y => y.slot_id === it.slot_id);
                if (!x) continue;
                if (!isNum(left[j][x.weekday]) || left[j][x.weekday] < costOf(x, data[j].ws) - EPS) return false;
              }
              return true;
            };
            const cands = d.items.filter(it => keys.includes(it.dkey) && isNum(d.goals[it.dkey]) && d.goals[it.dkey] > 0 && !it.b.fixed && isNum((SC.sets_max || {})[it.key]) && it.sets < SC.sets_max[it.key] &&
              (extra.get(it.slot_id) || 0) < (SC.max_extra_per_station || 1) && fits(it))
              .sort((a, b) => (left[i][b.weekday] - left[i][a.weekday]) || a.sets - b.sets || (a.slot_id < b.slot_id ? -1 : 1));
            const c = cands[0];
            if (!c) break;
            extra.set(c.slot_id, (extra.get(c.slot_id) || 0) + 1);
            c.sets += 1;
            for (let j = i; j < data.length; j++) {
              const x = data[j].items.find(y => y.slot_id === c.slot_id);
              if (!x) continue;
              left[j][x.weekday] -= costOf(x, data[j].ws);
            }
          }
        }
      }
      for (const d of data) for (const it of d.items) it.sets = it.sets0 + (extra.get(it.slot_id) || 0);
    }
    // scale per family and exercise block: inside an exercise block the stations are the same every week, so a family whose
    // stations cannot hold its goal keeps the shape of its targets (the same factor every week of the block) and still climbs.
    // E-160: down a stairway the factor never shrinks from one exercise block to the next (an earlier block takes the later one's)
    const MONO = !!(R2 && R2.scale && R2.scale.monotone_across_exercise_blocks);
    const SPILL = !!(R2 && R2.scale && R2.scale.family_spill);
    const scaleOf = new Map(); // `${eb}|${key}` -> factor
    if (R2 && R2.scale) {
      for (const keys of famKeys) {
        const byEb = new Map();
        for (const eb of ebsOf) {
          let r = 1, any = false;
          for (const d of data.filter(x => x.ws.exercise_block === eb)) {
            const G = famGoal(d, keys);
            if (!(G > 0)) continue;
            any = true;
            const C = famCap(d, keys);
            if (C < G) r = Math.min(r, C / G);
          }
          byEb.set(eb, any ? r : null);
        }
        if (stair && MONO) {
          let next = null;
          for (const eb of ebsOf.slice().reverse()) { const r = byEb.get(eb); if (r === null) continue; if (next !== null && r > next) byEb.set(eb, next); next = byEb.get(eb); }
        }
        for (const eb of ebsOf) for (const k of keys) scaleOf.set(eb + '|' + k, byEb.get(eb) ?? 1);
      }
    } else {
      for (const k of ORDER_KEYS) {
        for (const eb of ebsOf) {
          let r = 1;
          for (const d of data.filter(x => x.ws.exercise_block === eb)) {
            const g = d.goals[k];
            const its = d.items.filter(it => it.dkey === k);
            if (!isNum(g) || g <= 0 || !its.length) continue;
            const capK = its.reduce((a, it) => a + it.sets * it.b.hi, 0);
            if (capK < g) r = Math.min(r, capK / g);
          }
          scaleOf.set(eb + '|' + k, r); // a flat block (pre-season, maintenance, in-season) holds what its stations hold
        }
      }
    }
    // E-166 (COACH-R3 R3-VOL-04 'natural growth throughout', R3-SES-02 step 4 'never flat'; RECHECK v0.4 01 / 02 majors: a family held
    // one total for five to nine weeks): down a stairway a family climbs in even steps from its first week's dose to the dose of its
    // last stairway week - as many levels as whole dose steps fit between the two, each held for the same number of weeks (a coarse
    // dose step no longer leaves one long plateau and a short top) - never above the week's own target
    const ES = R2 && R2.even_steps;
    if (stair && ES && ES.enabled && R2.scale) {
      famKeys.forEach((keys, fi) => {
        const seq = data.filter(d => famGoal(d, keys) > 0);
        const live = seq.filter(d => !d.hold);
        if (live.length < 2) return;
        const sOf = (d) => { const k = keys.find(x => isNum(d.goals[x]) && d.goals[x] > 0 && d.items.some(it => it.dkey === x)); return k ? (scaleOf.get(d.ws.exercise_block + '|' + k) ?? 1) : 1; };
        const first = live[0], last = live[live.length - 1];
        const L1 = famGoal(first, keys) * sOf(first), Ln = famGoal(last, keys) * sOf(last);
        if (!(Ln > L1 + EPS)) return;
        const uOf = (d) => { const st = d.items.filter(it => keys.includes(it.dkey) && !it.b.fixed).map(it => it.sets * it.b.step); return st.length ? Math.min(...st) : null; };
        const us = live.map(uOf).filter(isNum);
        if (!us.length) return;
        const K = Math.max(1, Math.round((Ln - L1) / Math.max(...us) + EPS));
        live.forEach((d, i) => {
          const j = Math.min(K, Math.floor((i / (live.length - 1)) * (K + 1) + EPS));
          d.even = d.even || {};
          d.even[fi] = Math.min(famGoal(d, keys), L1 + (Ln - L1) * (j / K));
        });
        for (const d of seq.filter(x => x.hold)) { d.even = d.even || {}; d.even[fi] = Math.min(famGoal(d, keys), Ln); }
      });
    }
    // 1. dose each week on its goals (per key), inside the day's contact cap
    for (const d of data) {
      // the week's wanted dose per key: the goal x the block's factor; a key whose stations are full hands its rest to the other
      // stations of its family (E-160: reactive <-> ballistic jumps)
      const want = {};
      for (const k of ORDER_KEYS) {
        const its = d.items.filter(it => it.dkey === k);
        const g = d.goals[k];
        if (!its.length || !isNum(g)) continue;
        want[k] = g <= 0 ? its.reduce((a, it) => a + it.sets * it.b.lo, 0) : g * (scaleOf.get(d.ws.exercise_block + '|' + k) ?? 1);
      }
      // (E-166: the family's even step of the week, shared by its keys in proportion to their own goals)
      if (d.even) famKeys.forEach((keys, fi) => {
        if (!isNum(d.even[fi])) return;
        const live = keys.filter(k => isNum(want[k]) && isNum(d.goals[k]) && d.goals[k] > 0);
        const G = live.reduce((a, k) => a + d.goals[k], 0);
        if (G > 0) for (const k of live) want[k] = d.even[fi] * (d.goals[k] / G);
      });
      if (SPILL) for (const keys of famKeys) {
        const live = keys.filter(k => isNum(want[k]) && isNum(d.goals[k]) && d.goals[k] > 0);
        if (live.length < 2) continue;
        const capK = (k) => d.items.filter(it => it.dkey === k).reduce((a, it) => a + it.sets * it.b.hi, 0);
        let over = 0;
        for (const k of live) { const c = capK(k); if (want[k] > c) { over += want[k] - c; want[k] = c; } }
        for (const k of live) { if (over <= EPS) break; const room = capK(k) - want[k]; if (room > EPS) { const add = Math.min(room, over); want[k] += add; over -= add; } }
      }
      d.want = want;
      let reactiveOver = 0; // the reactive jumps' minimum dose above their goal comes off the ballistic jumps (one jump budget)
      for (const k of ORDER_KEYS) {
        const its = d.items.filter(it => it.dkey === k);
        if (!its.length) continue;
        const g = d.goals[k];
        if (!isNum(g)) { for (const it of its) it.per = null; continue; } // no target: the dose matrix (dose.mjs)
        let w = want[k];
        if (k === 'jump_contacts' && reactiveOver > 0) w = Math.max(0, w - reactiveOver);
        distribute(its, w);
        if (k === 'plyo_contacts') reactiveOver = Math.max(0, its.reduce((a, it) => a + it.sets * it.per, 0) - w);
      }
      // (fix round 2 / F2, sweep random-520: a key the session's contact cap trims asks for what the week plans - two ankle days of
      // 3 x 25 hold 150 contacts on paper and 87 next to the day's jumps under an 80-contact session; the told line says so)
      const dosed = d.items.filter(it => it.per !== null && !it.replaced);
      const before = new Map(dosed.map(it => [it, it.per]));
      capDays(dosed, cap);
      for (const it of dosed) if (it.per < before.get(it) - EPS) { d.lowered = d.lowered || new Set(); d.lowered.add(it.key); }
    }
    // the plyo share of the week (F2, see holdShare below)
    const SH = R.athletic.f2 && R.athletic.f2.share && R.athletic.f2.share.enforce ? R.athletic.f2.share : null;
    const shareTarget = (d) => { const b = budget[d.ws.n - 1]; return SH && b && b.enabled !== false && isNum(b.plyo_share) ? b.plyo_share : null; };
    // E-163: in a stairway the top of the share band never passes the sport's block-end share
    const shareEnd = stair && R2 && R2.share_end_clamp && R2.share_end_clamp.enabled && D11.plyo_share && isNum(D11.plyo_share.end) ? D11.plyo_share.end : null;
    const shareTop = (s) => (shareEnd === null ? s + SH.tolerance : Math.max(s, Math.min(s + SH.tolerance, shareEnd)));
    const BALANCE = !!(R2 && R2.share_end_clamp && R2.share_end_clamp.balance_parts);
    const famItems = (d, keys) => d.items.filter(it => keys.includes(it.key) && it.per !== null);
    const tot = (d, keys) => famItems(d, keys).reduce((a, it) => a + it.sets * it.per, 0);
    if (stair && RC.climb) {
      // 2. a week never plans more than a later week of the block can hold (the suffix minimum of what each week's stations hold),
      // so a stage change that brings smaller per-set doses (a depth jump's 3-6 contacts) is not a drop
      // (F2: the ankle work a week can hold under its plyo share - the share's allowance over its ballistic jumps and throws)
      const capOf = (d, keys) => d.items.filter(it => keys.includes(it.key) && it.per !== null).reduce((a, it) => a + it.sets * it.b.hi, 0);
      const shareCap = (d, keys) => {
        const s = SH ? shareTarget(d) : null;
        if (s === null || shareTop(s) >= 1) return null;
        const top = shareTop(s), r = top / (1 - top), B = capOf(d, ['jump_contacts']);
        const ply = r * (B + capOf(d, ['throws']));
        // (one 'contacts' family: the ballistic jumps plus the plyometric work the share allows; an ankle family: that allowance)
        return keys.includes('jump_contacts') ? B + Math.min(capOf(d, ['plyo_contacts', 'low_contacts']), ply) : Math.min(capOf(d, keys), ply);
      };
      for (const keys of famKeys) {
        const byShare = data.map(() => false);
        const capF = data.map((d, i) => { const its = famItems(d, keys); if (!its.length) return null; const raw = its.reduce((a, it) => a + it.sets * it.b.hi, 0); const sc = keys.includes('low_contacts') ? shareCap(d, keys) : null; byShare[i] = sc !== null && sc < raw - EPS; return sc === null ? raw : Math.min(raw, sc); });
        let suffix = Infinity, shareMade = false;
        for (let i = data.length - 1; i >= 0; i--) {
          if (capF[i] === null) continue;
          if (capF[i] < suffix) { suffix = capF[i]; shareMade = byShare[i]; }
          for (let guard = 0; guard < 400 && tot(data[i], keys) > suffix + EPS; guard++) {
            const c = famItems(data[i], keys).filter(it => !it.b.fixed && it.per - it.b.step >= it.b.lo - EPS).sort((a, b) => b.per / b.b.hi - a.per / a.b.hi)[0];
            if (!c) break;
            c.per -= c.b.step;
            // (fix round 2 / F2, sweep random-520: ankle work the plyo share's allowance holds down is the share's doing - the week
            // asks for what it plans, as where holdShare lowers it)
            if (shareMade) { const d = data[i]; d.shareHeld = true; d.shareMoved = d.shareMoved || new Set(); d.shareMoved.add(c.key); }
          }
        }
      }
    }
    // 3. the end-test week holds the week before (same stations: same doses); 4. never a drop inside a stairway block: a family
    // total below last week's is raised, in slot order, inside the bounds and the day cap (the composition of the jumps may change
    // at a stage change, the total does not fall)
    // v0.4 B4 (integration, random sweep: a 70-year-old's jumps raised to 22 against a target of 9 when the new exercise block's
    // single-leg hops replaced ankle work): the raise never takes a key over its V27 budget limit (reactive + ballistic jumps as one
    // budget; target x (1 + tolerance) + one set's maximum dose)
    const OVER = { plyo_contacts: ['plyo_contacts', 'jump_contacts'], jump_contacts: ['plyo_contacts', 'jump_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] };
    const overRoom = (d, it) => {
      const keys = OVER[it.key];
      const T0 = (budget[d.ws.n - 1] && budget[d.ws.n - 1].targets) || {};
      if (!keys || !keys.every(k => isNum(T0[k]))) return Infinity;
      const limit = keys.reduce((a, k) => a + T0[k], 0) * (1 + (RC.tolerance || 0)) + Math.max(...keys.map(k => (RC.per_set_max || {})[k] || 0));
      return limit - d.items.filter(x => keys.includes(x.key) && x.per !== null).reduce((a, x) => a + x.sets * x.per, 0);
    };
    // v0.4 fix round 1 / F2 (RECHECK 03 blocker: 85 % plyometric against a 45 % target; 01: 29 % against 10 %): the week's planned
    // plyo share (reactive jumps + ankle work over all jump and throw work, R2-ATH-01 / R2-ATH-02) stays within the tolerance of its
    // target - over it, ankle work and reactive jumps come down to their minimum dose (then the ankle block to one set), then the
    // ballistic jumps and throws go up inside their bounds; under it, ankle work and reactive jumps go up inside theirs (the
    // ballistic jumps and throws are never cut to raise the share: the Receive stage is more ballistic by design)
    const PLY = ['plyo_contacts', 'low_contacts'], BAL = ['jump_contacts', 'throws'];
    const sumK = (d, keys) => d.items.filter(it => keys.includes(it.key) && it.per !== null).reduce((a, it) => a + it.sets * it.per, 0);
    const shareOf = (d) => { const x = sumK(d, PLY), w = x + sumK(d, BAL); return w > 0 ? x / w : null; };
    const liveDay = (d) => d.items.filter(x => !x.replaced);
    const canUp = (d, it) => !it.b.fixed && it.per !== null && it.per + it.b.step <= it.b.hi + EPS && dayRoom(liveDay(d), it, cap) >= it.sets * it.b.step - EPS && overRoom(d, it) >= it.sets * it.b.step - EPS;
    const canDown = (it) => !it.b.fixed && it.per !== null && it.per - it.b.step >= it.b.lo - EPS;
    // (the keys the share moved this week - `athletic_budget.share_moved`; V27 reads a plateau the share made as the share's)
    const mark = (d, k) => { d.shareMoved = d.shareMoved || new Set(); d.shareMoved.add(k); };
    const holdShare = (d, o = {}) => {
      const s = shareTarget(d);
      if (s === null) return;
      const hi = shareTop(s), lo = s - SH.tolerance;
      for (let guard = 0; guard < 400; guard++) {
        const sh = shareOf(d);
        if (sh === null || sh <= hi + EPS) break;
        // over: ballistic / throws up first when the week must not drop, else ankle, then reactive, down
        const lowC = o.noDown ? null : d.items.filter(it => it.key === 'low_contacts' && canDown(it)).sort((a, b) => b.per / b.b.hi - a.per / a.b.hi)[0] || null;
        const plyC = o.noDown ? null : d.items.filter(it => it.key === 'plyo_contacts' && canDown(it)).sort((a, b) => b.per / b.b.hi - a.per / a.b.hi)[0] || null;
        // (E-163: of the two, the part that sits higher against its own week target comes down first - the ankle work is not cut to
        // its minimum while the reactive jumps stay at theirs)
        const Tw = (budget[d.ws.n - 1] && budget[d.ws.n - 1].targets) || {};
        const ratioOf = (k) => (isNum(Tw[k]) && Tw[k] > 0 ? sumK(d, [k]) / Tw[k] : Infinity);
        const down = lowC && plyC && BALANCE ? (ratioOf('plyo_contacts') > ratioOf('low_contacts') + EPS ? plyC : lowC) : (lowC || plyC);
        if (down) { down.per -= down.b.step; d.shareHeld = true; mark(d, down.key); continue; }
        const lowSet = o.noDown ? null : d.items.filter(it => it.key === 'low_contacts' && it.per !== null && it.sets > 1).sort((a, b) => b.sets - a.sets)[0];
        if (lowSet) { lowSet.sets -= 1; lowSet.sets_cut = (lowSet.sets_cut || 0) + 1; d.shareHeld = true; mark(d, lowSet.key); continue; }
        // (never past the week's own target of the key: the share is not met by over-dosing throws)
        const T0 = (budget[d.ws.n - 1] && budget[d.ws.n - 1].targets) || {};
        const room = (it) => { const keys = it.key === 'throws' ? ['throws'] : ['plyo_contacts', 'jump_contacts']; const tt = keys.reduce((a, k) => a + (isNum(T0[k]) ? T0[k] : 0), 0); return tt - sumK(d, it.key === 'throws' ? ['throws'] : ['jump_contacts', 'plyo_contacts']) >= it.sets * it.b.step - EPS; };
        const up = o.noBal ? null : d.items.filter(it => BAL.includes(it.key) && canUp(d, it) && room(it)).sort((a, b) => a.per / a.b.hi - b.per / b.b.hi)[0];
        if (up) { up.per += up.b.step; mark(d, up.key); continue; }
        break;
      }
      for (let guard = 0; guard < 400 && !o.noUp; guard++) {
        const sh = shareOf(d);
        if (sh === null || sh >= lo - EPS) break;
        const up = d.items.filter(it => it.key === 'low_contacts' && canUp(d, it)).sort((a, b) => a.per / a.b.hi - b.per / b.b.hi)[0] ||
          d.items.filter(it => it.key === 'plyo_contacts' && canUp(d, it)).sort((a, b) => a.per / a.b.hi - b.per / b.b.hi)[0];
        if (!up) break;
        up.per += up.b.step;
        if (shareOf(d) > hi + EPS) { up.per -= up.b.step; break; }
        mark(d, up.key);
      }
    };
    if (SH) for (const d of data) holdShare(d);
    // the family raise of step 4 keeps the share: a plyometric item goes up only while the share stays under its top, a ballistic
    // one first when the share is at or over its target
    const raiseOrder = (d, list) => {
      const s = shareTarget(d);
      if (s === null) return list.sort((a, b) => (a.per / a.b.hi) - (b.per / b.b.hi));
      const sh = shareOf(d);
      const ok = list.filter(it => {
        if (!PLY.includes(it.key)) return true;
        it.per += it.b.step; const after = shareOf(d); it.per -= it.b.step;
        return after <= shareTop(s) + EPS;
      });
      const plyFirst = sh !== null && sh < s;
      return ok.sort((a, b) => ((PLY.includes(a.key) === plyFirst ? 0 : 1) - (PLY.includes(b.key) === plyFirst ? 0 : 1)) || (a.per / a.b.hi) - (b.per / b.b.hi));
    };
    let prev = null;
    for (const d of data) {
      if (d.hold && prev) {
        for (const it of d.items) { const p = prev.items.find(x => x.slot_id === it.slot_id && x.ex.id === it.ex.id); if (p && p.per !== null && it.per !== null) { it.per = clamp(p.per, it.b.lo, it.b.hi); if (p.sets_cut) { it.sets = p.sets; it.sets_cut = p.sets_cut; } } }
        if (prev.shareHeld) d.shareHeld = true;
      }
      if (stair && prev && RC.climb) {
        for (const keys of famKeys) {
          const prevTot = tot(prev, keys);
          if (!famItems(d, keys).length) continue;
          for (let guard = 0; guard < 400 && tot(d, keys) < prevTot - EPS; guard++) {
            let c = raiseOrder(d, famItems(d, keys).filter(it => canUp(d, it)))[0];
            // (fix round 2 / F2, sweep random-1004 on model/: the jumps are their own family now, E-160 - where the session's contact
            // cap is full of ankle work, the day's ankle block gives a step back so the jumps do not fall below the week before;
            // ballistic jumps come before the ankle prep work, fix round 1 / F2)
            if (!c && keys.includes('jump_contacts')) {
              const blocked = famItems(d, keys).filter(it => !it.b.fixed && !it.replaced && it.per + it.b.step <= it.b.hi + EPS && overRoom(d, it) >= it.sets * it.b.step - EPS &&
                dayRoom(liveDay(d), it, cap) < it.sets * it.b.step - EPS);
              for (const it of blocked) {
                const giver = d.items.filter(x => x.key === 'low_contacts' && x.weekday === it.weekday && x.per !== null && !x.replaced && canDown(x)).sort((a, b) => b.sets * b.per - a.sets * a.per)[0];
                if (!giver) continue;
                const per0 = giver.per;
                for (let g2 = 0; g2 < 50 && canDown(giver) && dayRoom(liveDay(d), it, cap) < it.sets * it.b.step - EPS; g2++) giver.per -= giver.b.step;
                if (!canUp(d, it)) { giver.per = per0; continue; }
                d.lowered = d.lowered || new Set(); d.lowered.add('low_contacts');
                c = it;
                break;
              }
            }
            if (!c) break;
            c.per += c.b.step;
          }
        }
        if (SH) holdShare(d, { noDown: true, noUp: true });
      }
      prev = d;
    }
    // F2: a week the share or a coarse dose step kept below the week before brings the earlier weeks down to it (never a drop
    // inside a stairway block, V27): from the end, a week above the next one lowers its doses, the plyometric work first while
    // the week sits over its share target, else the ballistic work
    const backward = () => {
      const lowerOrder = (d, list) => {
        const s = SH ? shareTarget(d) : null, sh = s === null ? null : shareOf(d);
        const plyFirst = sh !== null && sh > s;
        return list.sort((a, b) => ((PLY.includes(a.key) === plyFirst ? 0 : 1) - (PLY.includes(b.key) === plyFirst ? 0 : 1)) || (b.per / b.b.hi) - (a.per / a.b.hi));
      };
      for (const keys of famKeys) {
        for (let i = data.length - 2; i >= 0; i--) {
          const d = data[i], nx = data[i + 1];
          if (!famItems(d, keys).length || !famItems(nx, keys).length) continue;
          const limit = tot(nx, keys);
          for (let guard = 0; guard < 400 && tot(d, keys) > limit + EPS; guard++) {
            const s0 = SH ? shareTarget(d) : null, sh0 = s0 === null ? null : shareOf(d);
            const over = sh0 !== null && sh0 > s0;
            const down = famItems(d, keys).filter(canDown);
            const plyDown = lowerOrder(d, down.filter(it => PLY.includes(it.key)))[0] || null;
            const balDown = lowerOrder(d, down.filter(it => !PLY.includes(it.key)))[0] || null;
            // (an ankle block already at its minimum dose runs one set fewer, as the share pass does - before a ballistic dose comes
            // down on a week over its share)
            const cs = famItems(d, keys).filter(it => it.key === 'low_contacts' && it.sets > 1).sort((a, b) => b.sets - a.sets)[0] || null;
            const pick = over ? (plyDown ? ['per', plyDown] : cs ? ['set', cs] : balDown ? ['per', balDown] : null)
              : (balDown ? ['per', balDown] : plyDown ? ['per', plyDown] : cs ? ['set', cs] : null);
            if (!pick) break;
            if (pick[0] === 'per') pick[1].per -= pick[1].b.step; else { pick[1].sets -= 1; pick[1].sets_cut = (pick[1].sets_cut || 0) + 1; }
            d.lowered = d.lowered || new Set(); for (const k of keys) d.lowered.add(k);
          }
        }
      }
    };
    if (stair && RC.climb) {
      backward();
      // (fix round 2 / F2: a ballistic dose the pass brought down can leave its week over the share - the plyometric work of that
      // week comes down too, and the weeks before follow it; sweep random-136)
      if (SH) for (let round = 0; round < 3; round++) {
        let moved = false;
        for (const d of data) { const before = sumK(d, PLY); holdShare(d, { noUp: true, noBal: true }); if (Math.abs(sumK(d, PLY) - before) > EPS) moved = true; }
        if (!moved) break;
        backward();
      }
    }
    // the peak week's planned totals (as the week is dosed, before the end-test week's own rule) for the next block's pre-season
    const peakD = stair ? data.filter(d => !d.hold).slice(-1)[0] : null;
    if (peakD) { prevPeak = {}; for (const k of ORDER_KEYS) prevPeak[k] = sumK(peakD, [k]); }
    // E-165 (R2-PER-07; RECHECK v0.4 02 major: the end test ran after 200 m of accelerations, single-leg hurdle hops and 3 power-clean
    // sets against 120 m, low box jumps and 2 sets in the baseline): on the tested days of the end-test week the athletic and Olympic
    // work runs the baseline week's dose - per day and family never more than the baseline week planned there
    const ET = R2 && R2.tests && R2.tests.end_week_test_days === 'baseline_dose';
    const base = data[0] && data[0].ws.test && data[0].ws.test.type === 'baseline' ? data[0] : null;
    if (stair && ET && base) for (const d of data.filter(x => x.hold && x !== base)) {
      const days = [...new Set([...d.items, ...d.olympic].filter(it => it.test_day).map(it => it.weekday))];
      for (const wd of days) {
        for (const keys of famKeys) {
          const cur = () => d.items.filter(it => it.weekday === wd && keys.includes(it.key) && it.per !== null && !it.replaced);
          const B = base.items.filter(it => it.weekday === wd && keys.includes(it.key) && it.per !== null && !it.replaced).reduce((a, it) => a + it.sets * it.per, 0);
          const sum = () => cur().reduce((a, it) => a + it.sets * it.per, 0);
          for (let guard = 0; guard < 400 && sum() > B + EPS; guard++) {
            const c = cur().filter(canDown).sort((a, b) => b.per / b.b.hi - a.per / a.b.hi || b.sets * b.per - a.sets * a.per)[0];
            if (c) { c.per -= c.b.step; d.testDose = true; continue; }
            const cs = cur().filter(it => it.sets > 1).sort((a, b) => b.sets - a.sets)[0];
            if (!cs) break;
            cs.sets -= 1; d.testDose = true;
          }
        }
        for (const o of d.olympic.filter(x => x.weekday === wd)) {
          const b0 = base.olympic.find(x => x.slot_id === o.slot_id);
          if (b0 && b0.sets0 < o.sets) { o.sets = b0.sets0; d.testDose = true; }
        }
      }
    }
    // E-172 (OBSERVED HALF TIME class cycle: WK 8 = strength LVL 5 'work up to 1RM', no power level 5; RECHECK v0.4 04 major: the
    // end-test max attempts came after three heavy Olympic singles): in the class model the end-test week of a strength test runs no
    // Olympic work - the max is the first heavy work of the day
    const CE = R2 && R2.tests && R2.tests.class_end_week_olympic === 'off' && derived.D1_family === 'hybrid_crossfit' && !!(R.reps && R.reps.class_levels);
    if (stair && CE) for (const d of data.filter(x => x.hold && x.ws.test && (x.ws.test.items || []).includes('strength'))) {
      for (const o of d.olympic) o.sets = 0;
      d.testDose = d.testDose || d.olympic.length > 0;
      d.classNoPower = d.olympic.length > 0;
    }
    for (const d of data) {
      const out = outWeeks[d.ws.n - 1];
      const replaced = {};
      for (const it of d.items) {
        if (it.replaced) { if (it.per !== null) replaced[it.key] = (replaced[it.key] || 0) + it.sets * it.per; continue; }
        if (it.per !== null) out.slot_plan[it.slot_id] = { per_set: it.per, per_leg: it.b.uni ? it.per / 2 : null, key: it.key, ...(it.sets !== it.sets0 ? { sets: it.sets } : {}) };
      }
      for (const it of d.dormant) out.slot_plan[it.slot_id] = { key: it.key, sets: 0 };
      for (const o of d.olympic) if (o.sets !== o.sets0) out.slot_plan[o.slot_id] = { key: 'olympic_sets', sets: o.sets };
      // the minutes the set changes add to (or take off) each day: one more set of a station, a waiting ankle day, the share's
      // ankle set, the end-test week's baseline dose
      const md = {};
      const addMin = (wd, m) => { md[wd] = (md[wd] || 0) + m; };
      for (const it of d.items) if (!it.replaced && it.sets !== it.sets0) addMin(it.weekday, (it.sets - it.sets0) * costOf(it, d.ws));
      for (const it of d.dormant) if (!it.replaced && !it.free) addMin(it.weekday, -(it.sets0 * costOf(it, d.ws) + changeover));
      for (const o of d.olympic) if (o.sets !== o.sets0) addMin(o.weekday, (o.sets - o.sets0) * costOf(o, d.ws) - (o.sets === 0 ? changeover : 0));
      const mdOut = {};
      for (const [wd, m] of Object.entries(md)) if (Math.abs(m) > EPS) mdOut[wd] = Math.round(m * 100) / 100;
      if (Object.keys(mdOut).length) out.minutes_delta = mdOut;
      if (Object.keys(replaced).length) out.replaced = replaced;
      if (SH && shareTarget(d) !== null && shareOf(d) !== null) out.share = { target: round4(shareTarget(d)), planned: round4(shareOf(d)), ...(d.shareMoved ? { moved: ORDER_KEYS.filter(k => d.shareMoved.has(k)) } : {}) };
      out.scale = {};
      for (const k of ORDER_KEYS) {
        // a goal only where the week holds a station for the key (the jump goals already moved to the stations it holds)
        if (!isNum(d.goals[k]) || !d.items.some(it => it.dkey === k && it.per !== null)) continue;
        const f = scaleOf.get(d.ws.exercise_block + '|' + k) ?? 1;
        out.goals[k] = roundHalfUp(isNum(d.want && d.want[k]) && d.goals[k] > 0 ? d.want[k] : d.goals[k] * f);
        // F2: the plyo share is the coach's rule over the per-key goals - an ankle / reactive goal it lowered is what the week plans
        if (d.shareHeld && PLY.includes(k)) out.goals[k] = Math.min(out.goals[k], roundHalfUp(sumK(d, [k])));
        // ... and a family the no-drop pass brought down to the next week is what the week plans
        if (d.lowered && d.lowered.has(k)) out.goals[k] = Math.min(out.goals[k], roundHalfUp(sumK(d, [k])));
        // ... and what a timed test replaced or the end-test week's baseline dose took off is not asked of the week
        const live = roundHalfUp(d.items.filter(it => it.key === k && it.per !== null && !it.replaced).reduce((a, it) => a + it.sets * it.per, 0));
        if (replaced[k] || d.testDose) out.goals[k] = Math.min(out.goals[k], live);
        out.scale[k] = round4(f);
      }
      if (d.hold) out.hold = true;
      if (d.testDose) out.test_dose = d.classNoPower ? 'class_no_power' : 'baseline';
    }
    // the client is told when the stations hold well under the sport's weekly dose at the peak (the work still climbs; E-29).
    // v0.4 fix round 1 / F2 (RECHECK 01 major: 'about 58 % of your jump contacts' hid a ballistic jump dose at 35 % behind the ankle
    // hops; 'the work still climbs every week' while it held flat for weeks): the jumps (ballistic + reactive) and the ankle work
    // are told apart, and 'climbs every week' is printed only when the family's planned total rises every week of the stairway (the
    // end-test week holds), else 'climbs across the block'
    const peak = stair ? data.filter(d => !d.hold).slice(-1)[0] : null;
    if (peak) {
      const T0 = (budget[peak.ws.n - 1] && budget[peak.ws.n - 1].targets) || {};
      const split = !!(R.athletic.f2 && R.athletic.f2.share);
      const wfams = split ? { jumps: ['plyo_contacts', 'jump_contacts'], ankle: ['low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] }
        : { contacts: CONTACT_KEYS, throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] };
      const told = new Set();
      const tell = (fam, keys) => {
        const tgt = keys.reduce((a, k) => a + (isNum(T0[k]) ? T0[k] : 0), 0);
        const its = peak.items.filter(it => keys.includes(it.key) && it.per !== null);
        if (!(tgt > 0) || !its.length) return;
        const got = its.reduce((a, it) => a + it.sets * it.per, 0);
        if (got < tgt * (RC.warn_below_share ?? 0.6) - EPS) {
          const series = data.filter(d => !d.hold).map(d => d.items.filter(it => keys.includes(it.key) && it.per !== null).reduce((a, it) => a + it.sets * it.per, 0));
          const climbs = series.length < 2 || series.every((v, i) => i === 0 || v > series[i - 1] + EPS);
          warnings.push({ code: 'athletic_capacity', key: climbs || !split ? 'warning.athletic_capacity' : 'warning.athletic_capacity_block', args: { key: 'athletic.key.' + fam, pct: Math.round(100 * got / tgt), training_block: tb.n } });
          told.add(fam);
        }
      };
      for (const [fam, keys] of Object.entries(wfams)) tell(fam, keys);
      // a contact family under the line whose parts each pass (or have no station of their own) is told as one family
      if (split && !told.has('jumps') && !told.has('ankle')) tell('contacts', CONTACT_KEYS);
    }
  }
  return { weeks: outWeeks, warnings };
}

/** the week's planned athletic totals from its items (plan.weeks[].athletic_budget.planned) */
export function plannedAthletic(items) {
  const p = { plyo_contacts: 0, jump_contacts: 0, low_contacts: 0, throws: 0, cod_cuts: 0, sprint_m: 0, olympic_sets: 0, upper_contacts: 0 };
  for (const it of items) {
    if (it.bucket === 'AP_TRIPLE_EXT') { p.olympic_sets += typeof it.sets === 'number' ? it.sets : 0; continue; }
    const a = it.athletic;
    if (!a || typeof a.total !== 'number') continue;
    const k = a.key || null;
    if (k && k in p) { p[k] += a.total; continue; }
    if (a.unit === 'contacts') {
      if (it.bucket === 'AP_JUMP_LIMITED_KNEE') p.low_contacts += a.total;
      else if (a.quality === 'plyometric') p.plyo_contacts += a.total;
      else p.jump_contacts += a.total;
    } else if (a.unit === 'throws') p.throws += a.total;
    else if (a.unit === 'cuts') p.cod_cuts += a.total;
    else if (a.unit === 'metres') p.sprint_m += a.total;
  }
  return p;
}

/** the plyo share actually planned (R2-ATH-01: plyometric = reactive jumps + ankle work, over all jump and throw work) */
export function plannedShare(p) {
  const work = (p.plyo_contacts || 0) + (p.jump_contacts || 0) + (p.low_contacts || 0) + (p.throws || 0);
  return work > 0 ? round4(((p.plyo_contacts || 0) + (p.low_contacts || 0)) / work) : null;
}

/** a why for the stage of an exercise block (B2) */
export function stageWhy(stage) { return why('why.stage_block', 'R2-ATH-03', { stage }); }
