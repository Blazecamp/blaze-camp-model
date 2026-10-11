// engine/dose.mjs - owner B3 (engine/CONTRACTS.md §4.8).
// Dose of one plan item: rep class and column (muscle size x goal x preference), athlete VOL phases, pyramids
// (12/10/8 then a light 20), per-side reps, planned RIR from the stairway (min 1 on compounds; MAX only on the last set of
// small-muscle work; MYO only on the day's last machine / isolation exercise), rest, load (week-1 tip, power language,
// Olympic ramp, 3-5-rep full catches, loaded jumps, medballs <= 20 lb), athletic counts with the session contact cap,
// test items, WOD / skill / circuit / aerobic doses and notes. Pure: no I/O, no clock, no randomness.
import { why, EPS, clamp, roundHalfUp } from './util.mjs';
import { daySlots } from './week.mjs';
import { blockProgress, stayActiveOlympic } from './budget.mjs';
import { athleticKeyOf, perSetBounds, cueKeyFor, responseOf, sprintMetres, rampProgress, throwSided } from './athletic.mjs';
import { isCarry, carryReps } from './library.mjs';

const COMPOUND_RC = ['main_bilateral_compound', 'machine_stable_compound', 'unilateral_compound'];
const ISOLATION_RC = ['big_muscle_isolation', 'small_muscle_isolation', 'rear_delts', 'calves'];
const LEVEL_RANK = { L1: 1, L2: 2, L3: 3 };
const RC_RANK = { RC1: 1, RC2: 2, RC3: 3 };
const ISOMETRIC_RE = /(plank|hold|hollow|dead-hang|wall-sit|isometric)/; // INFERRED: timed core records

// ------------------------------------------------------------------------------------------------------------------
// rep class
// ------------------------------------------------------------------------------------------------------------------

/**
 * Rep class of a slot + exercise (§4.8): bucket rep_class; FOCUS by exercise; RP_* with constraint >= 4 ->
 * machine_stable_compound; unilateral / alternating -> unilateral_compound; rear-delt work -> rear_delts; prehab -> prehab.
 * @param {object} slot SlotDef (bucket may be the effective bucket) @param {object|null} exercise @param {object} model
 * @returns {string}
 */
export function repClassFor(slot, exercise, model) {
  const b = model.bucket(slot.bucket);
  if (b.kind === 'prehab') return 'prehab';
  let rc = b.rep_class;
  // F3: a delt station's reps follow the exercise it holds (a side raise in a rear-delt station, select's delt variants, R3-VOL-01)
  let variant = slot.variant;
  if (exercise && b.muscle_by_variant) { const cv = { ISO_SIDE: 'side', ISO_REAR: 'rear', FACEPULL: 'rear', ISO_FRONT: 'front' }[exercise.credit_class]; if (cv) variant = cv; }
  if (b.rep_class_by_variant && variant && b.rep_class_by_variant[variant]) rc = b.rep_class_by_variant[variant];
  if (!exercise) return rc === 'by_exercise' ? 'small_muscle_isolation' : rc;
  if (rc === 'by_exercise' || rc == null) rc = classFromExercise(exercise, model);
  if (['ISO_REAR', 'FACEPULL'].includes(exercise.credit_class) && b.kind !== 'resistance') rc = 'rear_delts';
  if (b.kind === 'resistance') {
    if (exercise.constraint >= 4) rc = 'machine_stable_compound';
    else if (exercise.laterality === 'unilateral' || exercise.laterality === 'alternating') rc = 'unilateral_compound';
    else rc = 'main_bilateral_compound';
  }
  return rc;
}

function classFromExercise(ex, model) {
  if (ex.is_athletic && ex.athletic) {
    const q = ex.athletic.quality;
    if (q === 'olympic' || ex.athletic.olympic_family) return 'olympic';
    if (q === 'throw') return 'throw';
    if (q === 'cod') return 'cod';
    if (q === 'sprint') return 'sprint';
    return 'plyo';
  }
  switch (ex.credit_class) {
    case 'UKD': case 'UHD': return 'unilateral_compound';
    case 'BKD': case 'BHD': case 'HPUSH': case 'VPUSH': case 'HPULL': case 'VPULL': case 'THRUSTER': case 'DIPS': case 'PULLOVER':
      if (ex.constraint >= 4) return 'machine_stable_compound';
      return ex.laterality === 'unilateral' || ex.laterality === 'alternating' ? 'unilateral_compound' : 'main_bilateral_compound';
    case 'GLUTE_ISO': case 'LEG_FLEXION': case 'LEG_EXTENSION': case 'ISO_CHEST': return 'big_muscle_isolation';
    case 'ISO_REAR': case 'FACEPULL': return 'rear_delts';
    case 'ISO_CALF': return 'calves';
    case 'CORE': return 'core';
    case 'NONE': return 'prehab';
    default: return model && ex.primary_muscle && model.muscle(ex.primary_muscle).class === 'big' ? 'big_muscle_isolation' : 'small_muscle_isolation';
  }
}

// ------------------------------------------------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------------------------------------------------

function bracketSpec(R, id, perSide) {
  const b = R.reps.brackets[id];
  if (!b) return null;
  if (perSide) return { type: 'per_side', min: b.min, max: b.max };
  return { type: 'range', min: b.min, max: b.max, bracket: id };
}

function shiftBracket(R, id, shift) {
  const ladder = R.reps.ladder;
  let idx = ladder.indexOf(id);
  if (idx < 0) {
    const b = R.reps.brackets[id];
    const mid = (b.min + b.max) / 2;
    let best = 0, bestD = Infinity;
    ladder.forEach((l, i) => { const x = R.reps.brackets[l]; const d = Math.abs((x.min + x.max) / 2 - mid); if (d < bestD - EPS) { best = i; bestD = d; } });
    idx = best;
  }
  return ladder[clamp(idx + shift, 0, ladder.length - 1)];
}

function isUni(ex) { return !!ex && (ex.laterality === 'unilateral' || ex.laterality === 'alternating'); }

// B3: a record with no load in any of its set-ups (push-ups, table rows, sissy squats, body-weight calf raises)
const LOAD_TOKENS = ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine_selectorized', 'machine_plate_loaded', 'hex_bar', 'ez_bar', 'medball', 'weight_plate', 'sandbag', 'landmine', 'smith', 'slam_ball', 'sled'];
function isBodyweightRecord(ex) {
  return !!ex && !ex.equipment.machine && !ex.equipment.any_of.some((su) => su.some((t) => LOAD_TOKENS.includes(t)));
}
/** v0.4 fix round 2 / F3 (EQ-09; RECHECK v0.4 04 / 05 minors: 'Week 1: pick a weight' on an inverted row, an offset push-up and a ball
 *  hamstring curl): a lift whose load is the body - a bar, a plate or a ball in its set-up is a prop, not the load
 *  (rules.effort.bodyweight_moved_re) */
function isBodyweightMoved(ex, R) {
  const re = R.effort && R.effort.bodyweight_moved_re;
  return !!ex && !!re && new RegExp(re).test(ex.id) && !/weighted|loaded/.test(ex.id);
}

function stairProgress(week) {
  if (week && week.stair_level != null) return clamp((week.stair_level - 2) / 9, 0, 1);
  return 1; // flat blocks hold the top of the range
}

/** stairway length of a week: WeekShape.stair_N (CONTRACT_REQUESTS B3), else inferred from the stair level table */
function inferN(week, model) {
  if (week.stair_N) return week.stair_N;
  if (week.stair_week == null) return null;
  if (week.is_last_stair_week) return week.stair_week;
  const by = model.rules.stairway.by_N;
  const hits = Object.keys(by).map(Number).filter((N) => N > week.stair_week && by[String(N)].display_level &&
    Math.abs(by[String(N)].display_level[String(week.stair_week)] - week.stair_level) < 1e-6);
  return hits.length ? Math.min(...hits) : null;
}

function exerciseBlockWeek(input) {
  const w = input.week || {};
  if (input.exercise_block_week != null) return input.exercise_block_week;
  if (w.exercise_block_week != null) return w.exercise_block_week;
  if (w.stair_week != null) {
    const N = stairN(input);
    const ranges = N && input.model.rules.stairway.exercise_blocks_by_N[String(N)];
    const r = ranges && ranges.find((x) => w.stair_week >= x[0] && w.stair_week <= x[1]);
    if (r) return w.stair_week - r[0] + 1;
    return ((w.stair_week - 1) % 4) + 1; // INFERRED fallback (12 / 8-week exercise blocks are 4 weeks)
  }
  return w.is_exercise_block_start === false ? 2 : 1; // flat blocks: INFERRED (no week index in WeekShape)
}

/** the length in weeks of a stairway week's exercise block (rules.stairway.exercise_blocks_by_N), or null */
function exerciseBlockLength(week, model) {
  const N = week && (week.stair_N || inferN(week, model));
  const ranges = N && model.rules.stairway.exercise_blocks_by_N && model.rules.stairway.exercise_blocks_by_N[String(N)];
  const r = ranges && week.stair_week != null ? ranges.find((x) => week.stair_week >= x[0] && week.stair_week <= x[1]) : null;
  return r ? r[1] - r[0] + 1 : null;
}

function exerciseBlockIndex(input) {
  if (input.exercise_block_index != null) return input.exercise_block_index;
  const w = input.week || {};
  return Math.max(0, (w.exercise_block || 1) - 1);
}

function stairN(input) {
  const w = input.week || {};
  return w.stair_N || input.stair_N || (input.model && inferN(w, input.model)) || null;
}

function rirArg(min, max) { return min === max ? String(min) : `${min}-${max}`; }


/** the exercise's own rep range from its catalog rep hint ('3-8', '4-6 each leg', '5-10 contacts'), or null */
export function repHintRange(ex) {
  const t = ex && ex.rep_hint && ex.rep_hint.text;
  if (!t || /yard|min|\bs\b|sec|metre|meter|\bm\b|pattern|cal/i.test(t)) return null;
  const m = /(\d+)\s*-\s*(\d+)/.exec(t);
  if (m) return [Number(m[1]), Number(m[2])];
  const one = /^(\d+)\b/.exec(t.trim());
  return one ? [Number(one[1]), Number(one[1])] : null;
}

/**
 * v1.2 (review 02 / 06 / 07 majors): the VOL phase / matrix bracket meets the exercise's own rep hint. Eccentric, body-weight
 * loaded and 'weighted' body-weight lifts (Nordic curls, weighted pull-ups / dips, L-sit pull-ups) never get 12-15 or 15-20:
 * the range moves to the nearest end of the hint (rules.reps.rep_hint). Returns {min, max, capped} or null (no change).
 */
function capToHint(range, ex, R, opts = {}) {
  const H = R.reps.rep_hint;
  if (!H || !H.honour || !range || range.min == null) return null;
  // v0.5 fix round 1 (rules.reps.rep_hint.x1; samples 02 / 03 / 06: a Zercher squat at 12-15 against its own 6-12, a standing cable
  // press at 6-8 against its 10-15, '7-9' and '5-8' - ranges that are not on his REPS menu): a compound lift whose bracket runs
  // past its own range - above or below - takes the nearest range of his menu inside it, and every capped range is one of his
  const HX = H.x1 || null;
  if (HX) {
    const r1 = capToHintMenu(range, ex, R, opts, HX);
    if (r1 !== undefined) return r1;
  }
  let hint = (H.ids_low_cap && H.ids_low_cap[ex.id]) || null;
  const bwPull = ex.credit_class === 'VPULL' && /pull-up|chin-up/.test(ex.id) && !/assisted|lat-pulldown|band/.test(ex.id);
  if (!hint && /weighted/.test(ex.id) && ['VPULL', 'DIPS', 'HPUSH'].includes(ex.credit_class)) hint = H.weighted;
  if (!hint && (bwPull || /l-sit/.test(ex.id))) hint = H.bodyweight_vertical_pull;
  if (!hint) {
    const h = repHintRange(ex);
    // only a hint clearly below the bracket caps it (eccentric / skill-limited work); a wide hint leaves the bracket alone.
    // v0.4 fix round 1 / F3 (RECHECK 02 minor: front squat 7-10 in block 1, then 8-12 in block 2 under 'Reps capped (7-10)'): a heavy
    // two-legged compound whose own range tops out low (rules.reps.rep_hint.cap_max_compound_lte, e.g. 5-10) keeps its top in every block
    const CM = H.cap_max_compound_lte;
    if (h && (h[1] < range.min || (typeof CM === 'number' && opts && opts.compound && h[1] <= CM && h[1] < range.max))) hint = h;
  }
  if (!hint) return null;
  if (range.min >= hint[0] && range.max <= hint[1]) return null;
  const width = Math.max(2, range.max - range.min);
  // v0.4 fix round 2 / F3 (E-191; COACH-ANSWER PER-11 'VOL 1 -> 2 -> 3 gets heavier by block'; RECHECK v0.4 01 minor: a hex-bar deadlift at
  // 7-10, then 8-10, then 6-8 - the second block no heavier than the first): a capped lift takes the top three reps of its own range
  // in the first phase and one step down in the second when that still sits above the third phase's range
  // (rules.reps.rep_hint.monotone_cap), so the low end never rises from one exercise block to the next
  const MC = H.monotone_cap ? H.monotone_cap : null;
  if (range.min > hint[1]) return { min: Math.max(hint[0], hint[1] - (MC ? MC.span : width)), max: hint[1], capped: true };
  if (range.max < hint[0]) return { min: hint[0], max: Math.min(hint[1], hint[0] + width), capped: true };
  let lo = Math.min(Math.max(range.min, hint[0]), hint[1]);
  let hi = Math.max(Math.min(range.max, hint[1]), lo);
  if (hi - lo < 2) lo = Math.max(hint[0], hi - 3); // never a degenerate '8-8' range (review 01 minor 20)
  if (MC && opts.phase_index === 1 && hi === hint[1] && range.max > hint[1]) {
    const top = Math.max(hint[0], hint[1] - MC.span);
    if (top - MC.step >= (MC.floor_min || 0) && top - MC.step >= hint[0]) { lo = top - MC.step; hi = hint[1] - MC.step; }
    else { lo = top; hi = hint[1]; }
  }
  return { min: lo, max: hi, capped: true };
}

/**
 * v0.5 fix round 1: the rep range of a lift whose bracket does not sit inside the exercise's own range, taken from the coach's REPS
 * menu (OBSERVED BYOP REPS menu 4-6, 6-8, 8-12, 10-15; PER-11 12-15 / 8-12 / 6-8). Returns undefined when the rule does not speak
 * (capToHint's older rules decide), null for 'no change', else {min, max, capped}.
 */
function capToHintMenu(range, ex, R, opts, HX) {
  const H = R.reps.rep_hint;
  let h = (H.ids_low_cap && H.ids_low_cap[ex.id]) || null;
  const bwPull = ex.credit_class === 'VPULL' && /pull-up|chin-up/.test(ex.id) && !/assisted|lat-pulldown|band/.test(ex.id);
  if (!h && /weighted/.test(ex.id) && ['VPULL', 'DIPS', 'HPUSH'].includes(ex.credit_class)) h = H.weighted;
  if (!h && (bwPull || /l-sit/.test(ex.id))) h = H.bodyweight_vertical_pull;
  const named = !!h;
  if (!h) h = repHintRange(ex);
  if (!h) return undefined;
  if (range.min >= h[0] && range.max <= h[1]) return null;
  const above = range.max > h[1], below = range.min < h[0];
  // (the client's own heavy choice - the 'heavy single-leg' switch, UNI-04, or the heavy lifting style, VOL-12 - is never lifted
  // back to the lift's usual range)
  if (below && !above && opts.no_raise) return undefined;
  // an isolation lift keeps the older rule (only a hint clearly under the bracket caps it): his small-muscle ranges run 12-30
  if (!named && !opts.compound_any && !(h[1] < range.min)) return undefined;
  // (a hint that only tops out a few reps under a wide bracket and still holds its low end leaves the bracket: 8-12 on a 6-12 lift)
  const menu = (HX.menu || []).filter(([a, b]) => a >= h[0] && b <= h[1]).sort((x, y) => y[1] - x[1] || y[0] - x[0]);
  if (!menu.length) return undefined;
  let pick;
  if (above) {
    // the top range of the lift's own menu; one step down in the second phase while that stays at or above the floor (PER-11:
    // heavier by block), so the low end never rises from one exercise block to the next
    const MC = H.monotone_cap || null;
    pick = menu[0];
    if (opts.phase_index >= 1 && menu[1] && (!MC || menu[1][0] >= (MC.floor_min || 0))) pick = menu[1];
  } else if (below) {
    pick = menu[menu.length - 1];
  } else return null;
  return { min: pick[0], max: pick[1], capped: true };
}

/** WOD movement group of a station (reps table key) */
function wodGroupOf(ex) {
  if (ex.tags.includes('kb_swing')) return 'swing';
  if (ex.tags.includes('thruster')) return 'thruster';
  if (ex.tags.includes('wall_ball') || ex.tags.includes('medball')) return 'ball';
  if (ex.conditioning || /calorie|bike|rower|skierg|erg/.test(ex.id)) return 'erg';
  if (/rope|double-under/.test(ex.id)) return 'rope';
  if (/burpee|jumping-jack/.test(ex.id)) return 'burpee';
  if (/carry|sled/.test(ex.id)) return 'carry';
  if (/jump|step-up/.test(ex.id)) return 'jump';
  return 'default';
}

/** RIR effort from the planned stairway week (R2-PER-05), clamped to the RIR band, min 1 on never-failure classes (H02) */
function rirEffort(week, rc, R) {
  const bt = week.block_type;
  let min, max;
  if (bt === 'recovery') ({ min, max } = R.effort.by_block_type.recovery); // R3-pending: R3-PER-01
  // R3-pending: R3-VOL-04 (planned 3 -> 1 RIR drift)
  else if (week.planned_rir) ({ min, max } = week.planned_rir);
  else if (R.effort.by_block_type[bt]) ({ min, max } = R.effort.by_block_type[bt]);
  else [min, max] = R.effort.rir_band;
  if (bt !== 'recovery') { min = clamp(min, R.effort.rir_band[0], R.effort.rir_band[1]); max = clamp(max, R.effort.rir_band[0], R.effort.rir_band[1]); }
  if (R.effort.never_failure_rep_classes.includes(rc)) min = Math.max(min, R.effort.compound_floor_rir);
  if (max < min) max = min;
  const rpe = (r) => R.effort.rpe_for_rir[String(r)];
  return { type: 'rir', min, max, rpe_min: rpe(max), rpe_max: rpe(min), last_set: null,
    intensifier: !!(bt === 'stairway' && week.is_last_stair_week && week.planned_rir && week.planned_rir.intensifiers) && !R.effort.never_failure_rep_classes.includes(rc) };
}

function medballLoad(ex, derived, R) {
  const mb = ex.medball;
  const kind = ex.tags.includes('wall_ball') ? 'wall_ball' : mb.kind;
  const base = R.medball.loads_lb[kind] || [mb.min_lb, mb.max_lb];
  let lo = base[0], hi = base[1];
  const age = derived.age || 0;
  if (age < R.levels.youth_age || age >= R.population.older.from_age) { lo -= R.medball.youth_older_minus_lb; hi -= R.medball.youth_older_minus_lb; }
  lo = Math.max(lo, R.medball.min_lb);
  hi = Math.max(hi, lo);
  const owned = derived.D8_kit && derived.D8_kit.medball_max_lb != null ? derived.D8_kit.medball_max_lb : R.medball.max_lb;
  const cap = Math.min(R.medball.max_lb, owned);
  hi = Math.min(hi, cap);
  lo = Math.min(lo, hi);
  return { type: 'medball_lb', min: lo, max: hi };
}

function prehabCode(slot) {
  const w = (slot.why || []).find((x) => (x.key === 'why.prehab' || x.key === 'why.age_50_racket') && x.args && x.args.code);
  return w ? w.args.code : null;
}

function isFirstMainCompound(day, slot, model) {
  if (!day) return false;
  const first = daySlots(day).find((s) => s.block !== 'circuit' && model.bucket(s.bucket).kind === 'resistance');
  return !!first && first.slot_id === slot.slot_id;
}

function blockNotes(week, slot) {
  const n = [];
  if (slot.role !== 'work') return n;
  if (week.block_type === 'pre_season') n.push({ key: 'note.pre_season' });
  if (week.block_type === 'taper') n.push({ key: 'note.taper' });
  if (week.block_type === 'recovery') n.push({ key: 'note.recovery' });
  return n;
}

function mk(parts) {
  return {
    reps: parts.reps || null,
    set_reps: parts.set_reps || null,
    effort: parts.effort || null,
    rest: parts.rest || null,
    load: parts.load || null,
    tempo_key: null,
    athletic: parts.athletic || null,
    circuit: parts.circuit || null,
    wod: parts.wod || null,
    notes: parts.notes || [],
    why: parts.why || []
  };
}

// ------------------------------------------------------------------------------------------------------------------
// position helper (exported for the orchestrator)
// ------------------------------------------------------------------------------------------------------------------

/**
 * Position flags of a slot inside its day (input.position of doseItem).
 * @param {object} day DayLayout @param {string} slotId @param {Object<string,object>} [fillsBySlot] @param {Object<string,number>} [setsBySlot] @param {object} model
 * @returns {{index_in_day:number, is_last_resistance:boolean, is_first_lift_of_day:boolean, is_first_unilateral_lower:boolean, superset_active:boolean}}
 */
const SMALL_RC_BUCKETS = ['ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF'];

export function positionFor(day, slotId, fillsBySlot, setsBySlot, model) {
  const flat = daySlots(day);
  const used = (s) => !setsBySlot || !Object.prototype.hasOwnProperty.call(setsBySlot, s.slot_id) || setsBySlot[s.slot_id] > 0;
  const kind = (s) => model.bucket(s.bucket).kind;
  const res = flat.filter((s) => used(s) && s.block !== 'circuit' && (['resistance', 'isolation', 'focus'].includes(kind(s)) || s.origin === 'bonus'));
  const lifts = flat.filter((s) => used(s) && s.block !== 'circuit' && kind(s) === 'resistance');
  const effBucket = (s) => (fillsBySlot && fillsBySlot[s.slot_id] && fillsBySlot[s.slot_id].bucket) || s.bucket;
  const uniLower = flat.find((s) => used(s) && ['RP_UKD', 'RP_UHD'].includes(effBucket(s)));
  const slot = flat.find((s) => s.slot_id === slotId) || null;
  const mates = slot && slot.superset ? flat.filter((s) => s.superset === slot.superset && used(s)) : [];
  // the day's last small-muscle or machine isolation item (MAX, VOL-13 / VOL-15; the same rule generate.mjs applies)
  const exOf = (s) => { const f = fillsBySlot && fillsBySlot[s.slot_id]; return f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; };
  const small = res.filter((s) => {
    const e = exOf(s);
    return SMALL_RC_BUCKETS.includes(effBucket(s)) || (e && (e.equipment.machine || e.tags.includes('machine')) && kind(s) !== 'resistance') ||
      (kind(s) === 'focus' && e && e.primary_muscle && model.muscle(e.primary_muscle).class === 'small');
  });
  return {
    is_last_small: small.length > 0 && small[small.length - 1].slot_id === slotId,
    index_in_day: flat.findIndex((s) => s.slot_id === slotId),
    is_last_resistance: res.length > 0 && res[res.length - 1].slot_id === slotId,
    is_first_lift_of_day: lifts.length > 0 && lifts[0].slot_id === slotId,
    is_first_unilateral_lower: !!uniLower && uniLower.slot_id === slotId,
    superset_active: !!(slot && slot.superset && day.supersets_on !== false && mates.length >= 2)
  };
}

// ------------------------------------------------------------------------------------------------------------------
// doseItem
// ------------------------------------------------------------------------------------------------------------------

/**
 * Dose of one item.
 * @param {{slot:object, fill:object, exercise:object|null, sets:number, week:object, day:object, derived:object,
 *          athletic:object|null, position:object, at_cap:boolean, model:object}} input
 * @returns {object} Dose
 */
export function doseItem(input) {
  const { slot, fill, exercise, week, derived, model } = input;
  const R = model.rules;
  if (slot.aerobic) return doseAerobic(slot, week, derived, model);
  if (slot.role === 'cooldown' || (!exercise && slot.text_key)) return textDose(slot, R);
  if (slot.block === 'circuit' || ['COND_WOD', 'SKILL', 'COND_CIRCUIT', 'COND_SPRINT_BUYOUT'].includes(slot.bucket)) {
    return doseConditioning(slot, fill, week, derived, model, input);
  }
  const b = model.bucket(slot.bucket);
  if (b.kind === 'warmup') return mk({ notes: [], why: [why('why.warmup', 'ORD-08')] });
  if (!exercise) return mk({ why: [why('why.kit', 'EQ-09')] });
  const eb = (fill && fill.bucket) || slot.bucket;
  const rc = repClassFor({ ...slot, bucket: eb }, exercise, model);
  let d;
  if (rc === 'olympic') d = olympicDose(input, rc);
  else if (rc === 'plyo') d = plyoDose(input, eb);
  else if (rc === 'throw') d = throwDose(input);
  else if (rc === 'cod' || rc === 'sprint') d = codSprintDose(input, rc);
  else if (rc === 'prehab') d = prehabDose(input);
  else if (rc === 'core') d = coreDose(input);
  else d = resistanceDose(input, rc, eb);
  // v0.5 / V2 (COACH-R4 R4-LIB-02): a carry or a sled exercise is written by distance or time - 2-4 trips of 20-40 m (or 20-40 s) -
  // never by reps, whatever slot holds it (a suitcase carry in the core block, a carry a person added)
  if (isCarry(exercise, R) && !slot.test) {
    d.reps = carryReps(exercise, R);
    d.set_reps = null;
    d.effort = { type: 'intent', key: R.conditioning.carry.effort_key };
    d.load = null;
    d.notes = (d.notes || []).filter((n) => n && n.key !== 'note.per_side' && n.key !== 'load.week1_tip');
    if (model.has('en', 'note.carry_dose')) d.notes.push({ key: 'note.carry_dose' });
    d.why = [...(d.why || []), why('why.carry_dose', 'R4-LIB-02')];
  }
  if (slot.test) applyTest(d, input, rc);
  if (fill && fill.flags && fill.flags.includes('pain_swap')) {
    const w = (fill.why || []).find((x) => x.key === 'why.pain_swap');
    const area = (w && w.args && w.args.area) || 'other';
    // (fix round 2, sample 08 major: the note names the lift it replaced - 'Instead of X, to protect your knee')
    const pio = fill.pain_instead_of && model.hasEx(fill.pain_instead_of.exercise_id) && model.has('en', 'note.pain_instead_of') ? fill.pain_instead_of : null;
    const areaKey = model.has('en', 'pain.area.' + area) ? 'pain.area.' + area : area;
    d.notes.push(pio ? { key: 'note.pain_instead_of', args: { instead: model.ex(pio.exercise_id).name_key, area: areaKey } } : { key: 'note.pain_swap', args: { area: areaKey } });
  }
  // (fix round 2, sample 08 major: 'the one lift where depth matters has no depth cue') a knee-dominant lift of a client whose knee
  // hurts more with deep knee bends says where to stop
  {
    const PD = R.volume.pain.x2 && R.volume.pain.x2.depth_note;
    if (PD && exercise && !slot.test && (derived.pain || []).some((p) => p.area === PD.area && (p.worse_with || []).includes(PD.worse_with)) &&
        (PD.classes || []).includes(exercise.credit_class) && model.has('en', PD.note)) d.notes.push({ key: PD.note });
  }
  if (fill && fill.flags && fill.flags.includes('older_opt_in')) d.notes.push({ key: 'note.older_opt_in' });
  // COACH-R3 R3-ATH-02 (approved, stage B2): from 60, fast machine work - move the weight up fast, lower it with control
  const OLD = R.population.older;
  if (OLD && OLD.default_on && OLD.default_on.fast_machine_intent && (derived.age || 0) >= OLD.from_age && ['resistance', 'isolation', 'focus'].includes(b.kind) &&
      (exercise.equipment.machine || exercise.tags.includes('machine') || exercise.tags.includes('cable')) && !slot.test) d.notes.push({ key: OLD.fast_intent_note || 'note.fast_machine_intent' });
  if (slot.origin === 'bonus') d.notes.push({ key: 'note.bonus' });
  // v0.4 fix round 1 / F3 (RECHECK 01 / 08: a kept pattern station read 'Extra exercise to reach your weekly sets' or nothing): what it is
  else if (slot.origin === 'pattern_kept' && model.has('en', 'note.pattern_kept')) d.notes.push({ key: 'note.pattern_kept' });
  else if (b.kind === 'focus' || slot.origin === 'focus_added') {
    // "Focus slot for your priority muscle" only when the slot's muscle is one of the person's priorities (ORD-11);
    // otherwise the Focus slot carries sets the stairway needs (VOL-07 placement): note.focus_added (integration fix)
    const m = slot.focus_muscle || (input.exercise && input.exercise.primary_muscle) || null;
    const prio = (input.derived && input.derived.priority_muscles) || [];
    d.notes.push({ key: m && prio.includes(m) ? 'note.focus' : 'note.focus_added' });
  }
  return d;
}

function textDose(slot, R) {
  if (slot.role === 'cooldown') {
    const wm = R.conditioning.walks.minutes;
    return mk({ reps: { type: 'minutes', min: wm[0], max: wm[1] }, notes: [{ key: 'note.walk_after' }], why: [why('why.walks', 'ATH-07')] });
  }
  if (slot.bucket === 'WARMUP_GENERAL') {
    const m = R.warmup.general.minutes;
    return mk({ reps: { type: 'minutes', min: m, max: m }, why: [why('why.warmup', 'ORD-08')] });
  }
  return mk({ why: [why('why.warmup', 'ORD-08')] });
}

function resistanceDose(input, rc, eb) {
  const { slot, exercise: ex, sets, week, day, derived, position = {}, at_cap, model } = input;
  const R = model.rules;
  const column = R.reps.goal_column[derived.goal] || 'general';
  const cell = (R.reps.matrix[rc] && R.reps.matrix[rc][column]) || (R.reps.matrix[rc] && R.reps.matrix[rc].general) || {};
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const whys = [];
  const notes = [];
  let bracket = null;
  let maxLast = false;
  let fixedReps = null;
  // class model (CrossFit-style class, HALF TIME table OT17 / OT18): the work lift climbs 3x7 -> 3x6 -> 3x5 -> 3x4 by the stair
  // level, resistance 2x10 -> 3x10 (review 04 major 2)
  const CL = R.reps.class_levels;
  // v0.4 fix round 1 / F3 (OBSERVED class split: STRENGTH = squat / press / deadlift, Friday = clean; RECHECK 04 minor: a Yates row run
  // on the class strength table, 3 x 7 -> 4 x 4 at 1 RIR, the day after the deadlift): the strength table is the class lifts' only
  const classLift = slot.role === 'work' && (!CL || !Array.isArray(CL.strength_buckets) || CL.strength_buckets.includes((input.fill && input.fill.bucket) || slot.bucket));
  if (CL && derived.D1_family === 'hybrid_crossfit' && COMPOUND_RC.includes(rc)) {
    const p = blockProgress(week);
    if (classLift) {
      const step = CL.strength[clamp(Math.floor(p * CL.strength.length - EPS), 0, CL.strength.length - 1)];
      fixedReps = step.reps;
      whys.push(why('why.class_level', 'OT18'));
    } else {
      const step = CL.resistance[clamp(Math.floor(p * CL.resistance.length - EPS), 0, CL.resistance.length - 1)];
      fixedReps = step.reps;
      whys.push(why('why.class_level', 'OT18'));
    }
  }
  // athletes: compound / isolation brackets by the VOL phase of the exercise block (PER-11)
  const vp = column === 'athletic' && week.rep_phase ? R.reps.athlete_vol_phases[week.rep_phase] : null;
  if (vp && fixedReps === null) {
    if (COMPOUND_RC.includes(rc)) bracket = vp.compound;
    else if (rc === 'big_muscle_isolation' || rc === 'small_muscle_isolation') {
      if (vp.isolation === 'max') { bracket = cell.bracket; maxLast = R.effort.max.allowed_rep_classes.includes(rc); } // VOL3 isolation = MAX (last set, H02)
      else bracket = vp.isolation;
    }
    if (bracket) whys.push(why('why.reps_vol_phase', 'PER-11', { phase: week.rep_phase }));
  }
  // stay-active athletes (review 08 minor 12, PER-11 / 04 rec_* rep_zone 12-15 -> 8-12): compounds move from 12-15 to 8-12 at the
  // second exercise block instead of holding 10-15 for 12 weeks
  const SAC = R.reps.stay_active_compound_by_block;
  if (!bracket && fixedReps === null && Array.isArray(SAC) && COMPOUND_RC.includes(rc) && derived.D1_family === 'athletic' && derived.D2_profile && derived.D2_profile.competitive !== 'competitive' && week.block_type === 'stairway') {
    bracket = SAC[Math.min(exerciseBlockIndex(input), SAC.length - 1)];
    whys.push(why('why.reps_vol_phase', 'PER-11', { phase: 'VOL' + (Math.min(exerciseBlockIndex(input), SAC.length - 1) + 1) }));
  }
  if (!bracket && fixedReps === null) {
    if (cell.by_exercise_block) bracket = cell.by_exercise_block[Math.min(exerciseBlockIndex(input), cell.by_exercise_block.length - 1)];
    else if (cell.template === 'strength_pct') bracket = slot.role === 'work' ? 'b3_5' : slot.role === 'accessory' ? 'b6_8' : 'b8_12'; // INFERRED (no % in Phase 0, D-29)
    else bracket = lvl === 'L1' && cell.L1 ? cell.L1 : cell.bracket;
    if (cell.last_set === 'max') maxLast = true;
    whys.push(why('why.reps_matrix', 'VOL-11'));
  }
  if (!bracket) bracket = 'b8_12';
  const perSide = isUni(ex);
  let heavyChoice = false;   // the client's own 'heavy single-leg' switch or heavy lifting style moved this lift's reps down
  // heavy single-leg toggle (UNI-04)
  if (rc === 'unilateral_compound' && derived.prefs && derived.prefs.heavy_unilateral && position.is_first_unilateral_lower && cell.heavy_toggle) {
    bracket = cell.heavy_toggle;
    heavyChoice = true;
    whys.push(why('why.unilateral_reps', 'UNI-04'));
  }
  // lifting style (VOL-12): reps move, weekly sets never change; v1.2: the heavy shift is for the day's first bilateral
  // free-weight compound only (never a single-leg or alternating lift unless heavy_unilateral is on; review 07 major)
  const pref = R.reps.preference[derived.lift_style] || {};
  const firstLift = isFirstMainCompound(day, slot, model);
  const pyr = R.reps.pyramid;
  // B3 (RECHECK 07 major: the bench flipped to the 12/10/8 -20 pyramid the week it got its 4th set): the pyramid is decided for the
  // whole exercise block (the slot's sets in the block's first week, `input.block_first_sets`) and never for powerlifting-style clients
  const pyrSets = pyr.decide && typeof input.block_first_sets === 'number' ? input.block_first_sets : sets;
  const pyramidOk = column === 'hypertrophy' && rc === 'main_bilateral_compound' && firstLift && (LEVEL_RANK[lvl] || 1) >= (LEVEL_RANK[pyr.min_level] || 2) &&
    pyrSets >= pyr.when_sets_gte && week.block_type === 'stairway' && !(pyr.never_lift_styles || []).includes(derived.lift_style);
  if (pref.big_compound_shift && ['main_bilateral_compound', 'machine_stable_compound'].includes(rc)) {
    bracket = shiftBracket(R, bracket, pref.big_compound_shift); whys.push(why('why.reps_preference', 'VOL-12'));
  }
  let shifted = false;
  const shiftOk = !pref.only_rep_classes || pref.only_rep_classes.includes(rc) || (rc === 'unilateral_compound' && derived.prefs && derived.prefs.heavy_unilateral);
  if (pref.first_lift_of_day_shift && (firstLift || (pref.only_rep_classes && position.is_first_bilateral_compound)) && !pyramidOk && shiftOk && fixedReps === null) {
    bracket = shiftBracket(R, bracket, pref.first_lift_of_day_shift); shifted = true; whys.push(why('why.reps_preference', 'VOL-12'));
  }
  let reps = fixedReps !== null ? { type: perSide ? 'per_side' : 'fixed', ...(perSide ? { min: fixedReps, max: fixedReps } : { value: fixedReps }) } : bracketSpec(R, bracket, perSide);
  // the exercise's own rep ceiling (rep hint): Nordics 3-8, weighted pull-ups / dips 4-8, body-weight pull-ups 5-10 (review 02 / 06 / 07);
  // B3 (RECHECK 04 major: a weighted pull-up at the class model's fixed 10 reps): fixed reps meet the ceiling too
  const repsForCap = reps && reps.type === 'fixed' ? { min: reps.value, max: reps.value } : reps;
  if (repsForCap && repsForCap.min != null) {
    // (F3: the athletes' VOL phases move the bracket block by block, so their heavy compounds keep the hint's top in every block)
    const phaseIdx = vp && week.rep_phase ? ['VOL1', 'VOL2', 'VOL3'].indexOf(week.rep_phase) : -1;
    const cap = capToHint(repsForCap, ex, R, { compound: !!vp && rc === 'main_bilateral_compound' && ex.laterality === 'bilateral' && ex.exercise_class === 'compound', phase_index: phaseIdx,
      compound_any: COMPOUND_RC.includes(rc) && fixedReps === null, no_raise: heavyChoice || shifted || (perSide && !!(derived.prefs && derived.prefs.heavy_unilateral)) });
    if (cap) {
      reps = perSide ? { type: 'per_side', min: cap.min, max: cap.max } : { type: 'range', min: cap.min, max: cap.max };
      notes.push({ key: 'note.rep_cap', args: { min: cap.min, max: cap.max } });
      whys.push(why('why.rep_cap', 'VOL-11'));
    }
  }
  // v0.4 fix round 2 / F3 (E-190; COACH-ANSWER UNI-04 'unilateral: moderate-to-high reps by default, heavy low reps optional'; BRAIN B10 / T6;
  // RECHECK v0.4 02 minor: single-leg and single-arm lifts at 6-8 per side at 1 RIR in the hardest block with prefs.heavy_unilateral
  // off): a one-side or alternating compound never runs under rules.reps.unilateral_floor.min reps per side unless the client switched
  // heavy single-leg work on
  const UF = R.reps.unilateral_floor || null;
  if (UF && perSide && COMPOUND_RC.includes(rc) && fixedReps === null && reps && reps.type === 'per_side' && reps.min < UF.min && !(derived.prefs && derived.prefs[UF.unless_pref])) {
    reps = { type: 'per_side', min: UF.min, max: Math.max(reps.max, UF.top_at_least) };
    for (let i = notes.length - 1; i >= 0; i--) if (notes[i].key === 'note.rep_cap') notes.splice(i, 1);
    whys.push(why('why.unilateral_floor', 'UNI-04', { min: UF.min }));
  }
  // E-191 (BRAIN 7.3 'athletic accessory hinge 8-12'; RECHECK v0.4 01 minor: a loaded 45-degree back extension - picked as the low-back-
  // friendly hinge - driven to a 6-8RM at 1 RIR): a back extension / reverse hyper never runs under its rep floor
  for (const rf of R.reps.rep_floor_ids || []) {
    if (!new RegExp(rf.re).test(ex.id) || fixedReps !== null || !reps || reps.min == null || reps.min >= rf.min) continue;
    reps = { ...reps, min: rf.min, max: Math.max(reps.max, rf.top_at_least) };
    delete reps.bracket;
    for (let i = notes.length - 1; i >= 0; i--) if (notes[i].key === 'note.rep_cap') notes.splice(i, 1);
    whys.push(why('why.rep_floor', 'VOL-11', { min: rf.min }));
  }
  if (perSide) { notes.push({ key: 'note.per_side' }); if (!whys.some((w) => w.key === 'why.unilateral_reps')) whys.push(why('why.unilateral_reps', 'UNI-01')); }
  // body-weight pulls: regress (assisted machine, ring / TRX row) when the reps are out of reach (GEN-04, EQ-09; review 01 minor);
  // B3: never on a record that is already the regression (feet-supported, RECHECK 01 minor), and only the kit's own regression
  // (no assisted machine without machines, RECHECK 04 minor)
  const assistedRe = R.selection.assisted_id_re ? new RegExp(R.selection.assisted_id_re) : /assisted/;
  if (ex.credit_class === 'VPULL' && /pull-up|chin-up/.test(ex.id) && !/weighted/.test(ex.id) && !assistedRe.test(ex.id)) {
    const kitD = derived.D8_kit || { tokens: [], machines: [] };
    const machine = (kitD.machines || []).includes('assisted_pullup') || (kitD.tokens || []).includes('machine_selectorized');
    notes.push({ key: machine || !model.has('en', 'note.bodyweight_regress_no_machine') ? 'note.bodyweight_regress' : 'note.bodyweight_regress_no_machine' });
  }
  let setReps = null;
  if (pyramidOk) { // 12/10/8 then a light 20 (PRG-07)
    const heavy = pyr.sets.slice(0, -1);
    const light = pyr.sets[pyr.sets.length - 1];
    setReps = [];
    for (let i = 0; i < sets - 1; i++) setReps.push({ type: 'fixed', value: heavy[Math.min(i, heavy.length - 1)].reps });
    setReps.push({ type: 'fixed', value: light.reps });
    whys.push(why('why.pyramid', 'PRG-07'));
  }
  // effort (H02, R2-PER-05)
  let effort;
  if (slot.role === 'survival' && derived.D1_family === 'strength') effort = { type: 'role', role: 'survival' };
  else {
    effort = rirEffort(week, rc, R);
    const stair = week.block_type === 'stairway';
    const never = R.effort.never_failure_rep_classes.includes(rc);
    // MAX: the day's last small-muscle (or machine) exercise only, and only once the planned effort is 1-2 in the tank
    // (VOL-13 / VOL-15, R2-PER-05 'start at a 2'; review 01 / 06 / 07)
    const M = R.effort.max;
    // (the phase AND the planned effort: an L3 'DRIVE' week still planned at 3 in the tank gets no MAX - review 06 / 07)
    const rirOk = !week.planned_rir || (week.planned_rir.min <= 2 && week.planned_rir.max <= 2);
    const phaseOk = (!M.phases || M.phases.includes(week.phase) || rirOk) && rirOk;
    const lastOk = !M.only_last_small_item || position.is_last_small;
    // B3 (COACH-R3 R3-VOL-04 'to 1 + intensifiers in the last week, always inside your 1-3'; RECHECK 01 / 02 / 04 / 06 / 07 / 08):
    // the intensifiers live in the last stairway week only - one per training day, a MYO set on the day's last small-muscle or
    // machine isolation exercise; never a MAX set before it, never a glute bridge / thrust or a free-weight compound, never calves
    // for an Achilles hot spot
    const IN = R.effort.intensifiers || null;
    const machineOk = rc === 'machine_stable_compound' && !!cell.myo_if_last;
    if (IN) {
      effort.intensifier = false;
      const lastWeek = stair && !!(week.planned_rir && week.planned_rir.intensifiers) && !R.effort.myo.never_in_block_types.includes(week.block_type);
      // v0.4 fix round 1 / F3 (COACH-R3 R3-VOL-04 '1 + intensifiers in the last week'; VOL-15 'MYO on the last machine / isolation
      // exercise'; RECHECK 06 / 08 minors: Tue / Thu and both pickleball days had none because their last item was a glute bridge or
      // an Achilles-protected calf raise): the day's last ELIGIBLE item carries it (generate passes position.is_last_intensifier)
      const lastOk = typeof position.is_last_intensifier === 'boolean' ? position.is_last_intensifier : position.is_last_resistance;
      const eligible = lastWeek && lastOk && intensifierEligibleRc(rc, ex, cell, derived, model);
      if (eligible) { effort.last_set = IN.kind || 'myo'; effort.intensifier = true; whys.push(why('why.myo_last', 'VOL-15'), why('why.intensifier_last_week', 'R3-VOL-04')); }
    } else {
      if ((maxLast || (slot.role === 'nuance' && derived.D1_family === 'strength')) && stair && !never && M.allowed_rep_classes.includes(rc) && phaseOk && lastOk) {
        effort.last_set = 'max'; whys.push(why('why.max_last', 'VOL-13'));
      }
      // MYO: the day's last machine or isolation exercise (H02, VOL-15); a machine compound qualifies (matrix myo_if_last),
      // free-weight compounds never
      const myoOk = stair && (!never || machineOk) && position.is_last_resistance && (ISOLATION_RC.includes(rc) || ex.constraint >= 4) &&
        !R.effort.myo.never_in_block_types.includes(week.block_type) && (week.is_last_stair_week || (at_cap && week.phase === 'HARDEST'));
      if (myoOk) { effort.last_set = 'myo'; whys.push(why('why.myo_last', 'VOL-15')); }
    }
    whys.push(why('why.planned_rir', 'R2-PER-05', { rir: rirArg(effort.min, effort.max) }));
    if (effort.intensifier && !IN) whys.push(why('why.intensifier_last_week', 'R2-PER-05'));
  }
  // rest (VOL-14): strength rest for the work lift on a main bilateral compound, any heavy (<= 8) shifted bracket and tests
  let rest;
  const strengthRest = (R.rest.strength_for || []);
  const heavyWork = (strengthRest.includes('work_main_bilateral') && slot.role === 'work' && rc === 'main_bilateral_compound' && reps && reps.max != null && reps.max <= 8) ||
    (strengthRest.includes('reps_max_lte_8_shifted') && shifted && reps && reps.max != null && reps.max <= 8) ||
    (derived.D1_family === 'hybrid_crossfit' && slot.role === 'work' && classLift);
  // B3 (RECHECK 02 / 04 minors: a supersetted work lift lost its 3-6 min rest): a pair that holds the work lift rests the strength
  // minutes after the pair
  if (position.superset_active && R.rest.pair_with_work_lift === 'strength' && (heavyWork || (reps && reps.max != null && reps.max <= 6))) rest = { type: 'after_pair', min: R.rest.strength_s[0], max: R.rest.strength_s[1] };
  // v0.4 fix round 1 / F3 (VOL-14 'rest stated for every set'; RECHECK 02 / 06 minors: 'rest after the pair' with no time): a pair rests
  // in numbers - the item's own class rest (the render prints the longest of the pair)
  else if (position.superset_active && R.rest.after_pair_numbers) rest = ISOLATION_RC.includes(rc) ? { type: 'after_pair', min: R.rest.isolation_s[0], max: R.rest.isolation_s[1] } : { type: 'after_pair', min: R.rest.hypertrophy_s[0], max: R.rest.hypertrophy_s[1] };
  else if (position.superset_active) rest = { type: 'after_pair' };
  else if (ISOLATION_RC.includes(rc)) rest = { type: 'seconds', min: R.rest.isolation_s[0], max: R.rest.isolation_s[1] };
  else if ((reps && reps.max != null && reps.max <= 6) || heavyWork) rest = { type: 'seconds', min: R.rest.strength_s[0], max: R.rest.strength_s[1] };
  else rest = { type: 'seconds', min: R.rest.hypertrophy_s[0], max: R.rest.hypertrophy_s[1] };
  // v0.4 fix round 2 / F3 (E-192; COACH-ANSWER VOL-14 'hypertrophy 1-2 (to 3) min, strength 3-6 min'; RECHECK v0.4 02 minor: a 6-8-rep bench at
  // 1-2 RIR rested 60-120 s next to a front squat at 3-6 min): a two-arm / two-leg compound at 8 reps or fewer and 2 in the tank or
  // fewer that does not already take the strength rest takes the top of the hypertrophy band, 2-3 min (rules.rest.heavy_compound)
  const HC = R.rest.heavy_compound || null;
  if (HC && !perSide && HC.rep_classes.includes(rc) && reps && reps.max != null && reps.max <= HC.max_reps && effort && effort.type === 'rir' && effort.max <= HC.max_rir &&
      rest && typeof rest.max === 'number' && rest.max < HC.s[1]) rest = { ...rest, min: HC.s[0], max: HC.s[1], heavy: true };
  whys.push(why('why.rest', 'VOL-14'));
  // load: week-1 tip on main compounds of a stairway's first week (R2-GEN-06); never on body-weight lifts (review 04 minor)
  let load = null;
  const bodyweightLift = ex.equipment.any_of.some((su) => su.every((t) => ['pullup_bar', 'dip_bars', 'rings', 'trx', 'floor', 'bench', 'box', 'step_low', 'wall'].includes(t))) && !ex.equipment.any_of.some((su) => su.some((t) => ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine_selectorized', 'machine_plate_loaded', 'hex_bar'].includes(t)));
  const bwMoved = isBodyweightMoved(ex, R);
  // v0.4 fix round 2 / F3 (E-187; COACH-R2 R2-GEN-06 'RIR plus a week-1 weight tip'; RECHECK v0.4 02 minor: 'Stationary Lunge (Split Squat)'
  // and 'Step-Up' as a 230-lb L3's lifts with no implement and no loading word): a trained lifter's lower-body lift whose record
  // names no implement says what to hold, and takes the week-1 tip like any loaded lift
  const IMPN = R.effort.implement_note || null;
  const lvlI = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const holdNote = !!IMPN && COMPOUND_RC.includes(rc) && model.bucket(eb).kind === 'resistance' && !slot.test && !bwMoved && IMPN.levels.includes(lvlI) && IMPN.classes.includes(ex.credit_class) &&
    isBodyweightRecord(ex) && ex.load_ceiling !== 'low' && ex.equipment.any_of.every((su) => su.every((t) => IMPN.prop_tokens.includes(t))) && model.has('en', IMPN.key);
  if (COMPOUND_RC.includes(rc) && week.block_type === 'stairway' && week.stair_week === 1 && model.bucket(eb).kind === 'resistance' && (!bodyweightLift || holdNote) && !bwMoved && !slot.test) {
    // (RECHECK v0.4 05 / 08 minors: 'a weight you could lift 2-3 more times' next to '3 in the tank') the tip names the week's own effort
    const pr = week.planned_rir || null;
    load = pr ? { type: 'week1_tip', rir: pr.max } : { type: 'week1_tip' };
    notes.push({ key: R.effort.week1_tip_key });
  }
  if (holdNote) notes.push({ key: IMPN.key });
  if (ex.medball) load = medballLoad(ex, derived, R);
  if (ex.tags.includes('fixed_grip') && (derived.pain || []).some((p) => ['shoulder', 'elbow', 'wrist_hand'].includes(p.area))) notes.push({ key: 'note.split_grip' });
  if (slot.bucket === 'ISO_CALF' && slot.calf_index === 1) notes.push({ key: 'note.second_calf_sets', args: { n: sets, total: (position.calf_sets_today || sets) } });
  notes.push(...blockNotes(week, slot));
  return mk({ reps, set_reps: setReps, effort, rest, load, notes, why: whys });
}

/** can this item carry the last week's intensifier (a MYO set): an isolation / machine exercise, not a free-weight compound, not a
 *  glute bridge / thrust, not calves for an Achilles hot spot (E-53; F3 export for generate's 'last eligible item of the day') */
function intensifierEligibleRc(rc, ex, cell, derived, model) {
  const R = model.rules;
  const IN = R.effort.intensifiers || null;
  if (!IN || !ex) return false;
  const never = R.effort.never_failure_rep_classes.includes(rc);
  const machineOk = rc === 'machine_stable_compound' && !!(cell && cell.myo_if_last);
  const hot = new Set(((derived.D2_profile && derived.D2_profile.id && model.hasSport && model.hasSport(derived.D2_profile.id)) ? model.sport(derived.D2_profile.id).injuries || [] : []));
  const calvesHot = ex.credit_class === 'ISO_CALF' && (IN.never_calves_hotspots || []).some((c) => hot.has(c));
  // v0.4 fix round 2 / F3 (E-193; COACH-ANSWER VOL-15 'myo only last, on machines / isolation'; OBSERVED BYOP 'MYO SET' on the leg extension;
  // RECHECK v0.4 02 minor: a MYO set on a barbell calf raise with the bar on the back, right after heavy RDLs): never on a barbell or
  // axial-high lift, a Nordic curl or a sissy squat (rules.effort.intensifiers.never_tags / never_id_re; validate reads the same lists)
  const tagNo = (IN.never_tags || []).some((t) => (ex.tags || []).includes(t));
  const idNo = !!IN.never_id_re && new RegExp(IN.never_id_re).test(ex.id);
  // v0.5 fix round 1 (VOL-03 'pain: cut, keep it moving, do not push it'; sample 08 major: the last week's MYO set landed on the leg
  // extension of a client with knee pain): never on an exercise whose main mover is a muscle the plan cut for pain
  const painLines = new Set((derived.D9_start_sets && derived.D9_start_sets.pain_muscles) || []);
  const painNo = !!IN.never_pain_muscle && painLines.size > 0 && Object.entries(ex.credits || {}).some(([m, c]) => c >= 1 && painLines.has((model.rules.muscles.defs[m] && model.rules.muscles.defs[m].line) || m));
  return (ISOLATION_RC.includes(rc) || ex.constraint >= 4) && (!never || machineOk) && !(IN.never_credit_classes || []).includes(ex.credit_class) && !calvesHot && !tagNo && !idNo && !painNo;
}

/**
 * Whether a resistance item could carry the last week's intensifier (generate marks the day's last such item; v0.4 fix round 1 / F3).
 * @param {object} slot @param {object|null} fill @param {object|null} exercise @param {object} derived @param {object} model @returns {boolean}
 */
export function intensifierEligible(slot, fill, exercise, derived, model) {
  if (!exercise || slot.test || slot.role === 'prehab') return false;
  let b;
  try { b = model.bucket((fill && fill.bucket) || slot.bucket); } catch { return false; }
  if (!['resistance', 'isolation', 'focus'].includes(b.kind) && slot.origin !== 'bonus') return false;
  const rc = repClassFor({ ...slot, bucket: (fill && fill.bucket) || slot.bucket }, exercise, model);
  if (!COMPOUND_RC.includes(rc) && !ISOLATION_RC.includes(rc)) return false;
  const R = model.rules;
  const column = R.reps.goal_column[derived.goal] || 'general';
  const cell = (R.reps.matrix[rc] && R.reps.matrix[rc][column]) || (R.reps.matrix[rc] && R.reps.matrix[rc].general) || {};
  return intensifierEligibleRc(rc, exercise, cell, derived, model);
}

/** implement class of an Olympic / power record for its rep scheme and its words (bar / dumbbell / kettlebell) */
function olyImplement(ex) {
  const setups = ex.equipment.any_of;
  const noBar = setups.every((su) => !su.includes('barbell') && !su.includes('hex_bar'));
  if (noBar && setups.some((su) => su.includes('kettlebell')) && !setups.some((su) => su.includes('dumbbell'))) return 'kb';
  if (noBar && setups.some((su) => su.includes('dumbbell') || su.includes('kettlebell'))) return 'db';
  if (setups.some((su) => su.includes('hex_bar')) && noBar === false && setups.every((su) => su.includes('hex_bar'))) return 'hex';
  return 'bar';
}

function olympicDose(input) {
  const { slot, exercise: ex, sets, week, derived, model, fill } = input;
  const R = model.rules;
  const ath = ex.athletic || {};
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const impl = olyImplement(ex);
  const notes = [];
  const whys = [];
  let reps;
  let load = { type: 'power' };
  let effortKey = R.effort.olympic.key;
  const id = ex.id;
  const OS = R.olympic.sets || null;
  const scheme = R.olympic.rep_scheme || null;
  const isPull = /pull/.test(id);
  // v1.2 (R2-ATH-05; review 01 minor): the rep scheme follows the implement and the catch, never the name - DB / KB and pull
  // variants keep the 4 x 8 -> 4 x 4 ramp; barbell power and squat catches use 3-5 reps
  const rampOk = scheme ? ((scheme.ramp.includes('db_kb') && (impl === 'db' || impl === 'kb')) || (scheme.ramp.includes('pull') && isPull))
    : ((R.olympic.ramp_applies_to.includes('db_kb') && (impl === 'db' || impl === 'kb')) || (R.olympic.ramp_applies_to.includes('pulls') && isPull) || (R.olympic.ramp_applies_to.includes('hang_variants') && /hang/.test(id)));
  const D11 = derived.D11_athletic_budget || {};
  if (week.block_type === 'in_season') {
    reps = { type: 'fixed', value: R.olympic.in_season.reps };
  } else if (ath.olympic_family === 'swing') {
    reps = bracketSpec(R, 'b10_15', false); // INFERRED: swings 10-20 fast (catalog rep hint), ballistic power
    notes.push({ key: 'note.kb_swing_power' }); // a kettlebell, never 'the bar' (review 03 major)
    effortKey = 'effort.olympic_power_kb';
    whys.push(why('why.kb_swing_power', 'R2-VOL-05'));
  } else if (ath.loaded_jump) {
    reps = bracketSpec(R, 'b3_5', false); // INFERRED (EQ-15)
    load = { type: 'bw_pct', min: R.athletic.loaded_jump_bw_pct[0], max: R.athletic.loaded_jump_bw_pct[1] };
    whys.push(why('why.loaded_jump', 'EQ-15'));
  } else if (OS && OS.stay_active && stayActiveOlympic(derived)) {
    // stay-active plans: one light power piece, 2 sets of 3-6 (2 x 3 in heavy-play weeks) - 04 olympic_policy (review 08 major 3)
    const hp = D11.heavy_play_week && OS.stay_active.heavy_play;
    reps = hp ? { type: 'fixed', value: OS.stay_active.heavy_play.reps } : { type: 'range', min: OS.stay_active.reps[0], max: OS.stay_active.reps[1] };
    whys.push(why('why.olympic_stay_active', 'R2-ATH-04'));
  } else if (derived.D1_family === 'hybrid_crossfit' && R.reps.class_levels) {
    const P = R.reps.class_levels.power;
    const step = P[clamp(Math.floor(blockProgress(week) * P.length - EPS), 0, P.length - 1)];
    reps = { type: 'fixed', value: step.reps };
    whys.push(why('why.class_level', 'OT18'));
  } else if (rampOk) {
    // one ramp across the training block (R2-PER-03): 8 -> 6 -> 6 -> 4; pre-season continues from the last off-season step
    const ramp = R.olympic.ramp;
    const flat = week.block_type !== 'stairway';
    const k = flat ? ramp.length - 1 : (R.olympic.ramp_carries_across_blocks ? clamp(Math.floor(blockProgress(week) * ramp.length - EPS), 0, ramp.length - 1) : clamp(exerciseBlockWeek(input), 1, ramp.length) - 1);
    reps = { type: 'fixed', value: ramp[Math.max(0, k)].reps };
    whys.push(why('why.olympic_ramp', 'PER-09'));
  } else if (ath.full_catch || impl === 'bar') {
    reps = { type: 'range', min: R.olympic.full_catch_reps[0], max: R.olympic.full_catch_reps[1] };
    if (ath.full_catch) notes.push({ key: 'note.olympic_full_catch' });
  } else {
    const cell = R.reps.matrix.olympic[lvl] || R.reps.matrix.olympic.L2;
    reps = bracketSpec(R, cell.bracket, false);
  }
  if (ath.olympic_family !== 'swing') {
    if (impl === 'db') { notes.push({ key: 'note.olympic_power_db' }); effortKey = 'effort.olympic_power_db'; }
    else if (impl === 'kb') { notes.push({ key: 'note.olympic_power_kb' }); effortKey = 'effort.olympic_power_kb'; }
    else notes.push({ key: 'note.olympic_power' });
  }
  const kitTokens = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  if (ex.tags.includes('barbell') && !kitTokens.has('barbell_bumpers_platform')) notes.push({ key: 'note.olympic_no_bumpers' });
  if (fill && fill.flags && fill.flags.includes('older_opt_in')) notes.push({ key: 'note.older_opt_in' });
  // v0.4 fix round 1 / F3 (UNI-01 '10/10 = 1 set'; RECHECK 01 minor: 'Single-Arm DB Snatch - 2 x 8 Reps' with no 'per side'): a one-arm
  // Olympic lift is written per side
  if (isUni(ex) && reps && (reps.type === 'fixed' || reps.type === 'range')) {
    const lo = reps.type === 'fixed' ? reps.value : reps.min, hi = reps.type === 'fixed' ? reps.value : reps.max;
    reps = { type: 'per_side', min: lo, max: hi };
    notes.push({ key: 'note.per_side' });
  }
  const per = reps.type === 'fixed' ? reps.value : reps.min;
  whys.push(why('why.olympic_level', 'ATH-10'));
  // power language (R2-GEN-06): no percentages in Phase 0 (D-29)
  return mk({
    reps, effort: { type: 'power', key: effortKey },
    rest: { type: 'seconds', min: R.rest.olympic_s[0], max: R.rest.olympic_s[1] }, load,
    athletic: { unit: 'reps', per_set: per, total: (sets || 0) * per, stage: null, quality: ath.quality || 'olympic' },
    notes: [...notes, ...blockNotes(week, slot)], why: whys
  });
}

/** box height from the record itself (EQ-16: 'half-shin' / 'low' = low, 'medium' / 'knee' = medium, 'high' = high); null when
 *  the drill uses no box (plate hops, floor hops) - review 01 / 02 / 03 minors */
function boxHeightOf(ex) {
  const boxy = ex.equipment.any_of.some((su) => su.includes('box') || su.includes('step_low') || su.includes('plyo_box_high')) || ex.tags.includes('depth_jump');
  if (!boxy || ex.equipment.any_of.some((su) => su.includes('plate_low_target')) && !/box/.test(ex.id)) return null;
  if (/high|above-hip/.test(ex.id) || ex.equipment.any_of.some((su) => su.includes('plyo_box_high'))) return 'high';
  if (/medium|knee-height|mid-box/.test(ex.id)) return 'medium';
  if (/low|half-shin|step|plate/.test(ex.id)) return 'low';
  return ex.equipment.any_of.some((su) => su.includes('step_low')) ? 'low' : 'medium';
}

/** the athletic stairway's dose for this slot (generate passes athletic.slot_plan from athletic.planAthletic; stage B2) */
function planFor(input) {
  const a = input.athletic;
  const p = a && a.slot_plan ? a.slot_plan[input.slot.slot_id] : null;
  return p && typeof p.per_set === 'number' ? p : null;
}

function plyoDose(input, eb) {
  const { slot, exercise: ex, sets, week, day, derived, athletic, model, fill } = input;
  const R = model.rules;
  const ath = ex.athletic || {};
  const stage = week.plyo_stage || R.athletic.stages.start_stage;
  const quality = ath.quality || 'plyometric';
  const key = athleticKeyOf(eb, ex) || 'jump_contacts';
  const RCr = R.athletic.reconcile || {};
  // a single-leg drill counts both legs: per_set = 2 x the per-leg contacts written (RECHECK 01 major; stage B2)
  const uni = isUni(ex) && !!RCr.unilateral_counts_both_legs;
  const whys = [why('why.plyo_stage', 'R2-ATH-03', { stage })];
  const plan = planFor(input);
  let per;
  if (plan) {
    // stage B2: the athletic stairway's dose (sport target, capacity-scaled, climbing; athletic.planAthletic)
    per = plan.per_set;
    whys.push(why('why.athletic_reconcile', 'D-63'));
  } else {
    // no sport target: the stage's contacts per set, lower bound in the stage's first week rising to the upper bound
    const drillStage = ath.rc_stage_default && RC_RANK[ath.rc_stage_default] < RC_RANK[stage] ? ath.rc_stage_default : stage;
    const ankle = eb === 'AP_JUMP_LIMITED_KNEE' || ex.tags.includes('ankle_hop');
    const range = ankle ? R.reps.matrix.plyo.ankle.contacts_per_set : (R.reps.matrix.plyo[drillStage] || R.reps.matrix.plyo.RC1).contacts_per_set;
    let frac = 1;
    const N = stairN(input);
    if (week.stair_week != null && N && drillStage === stage) {
      let rcw = null;
      try { rcw = model.stair(N).rc_weeks[stage]; } catch (e) { rcw = null; }
      if (rcw) frac = rcw[1] > rcw[0] ? clamp((week.stair_week - rcw[0]) / (rcw[1] - rcw[0]), 0, 1) : 1;
    }
    let v = roundHalfUp(range[0] + (range[1] - range[0]) * frac);
    const D11 = derived.D11_athletic_budget || {};
    let factor = athletic && athletic.factor != null ? athletic.factor : 1;
    if (!athletic && D11.heavy_play_week) factor = R.athletic.heavy_play_weeks.plyo_factor;
    if (factor !== 1) v = Math.max(1, roundHalfUp(v * factor));
    per = uni ? 2 * v : (isUni(ex) ? 2 * v : v);
    const b = perSetBounds(model, key, ex, 1);
    per = clamp(per, b.lo, b.hi);
    if (b.step > 1) per = Math.max(b.lo, Math.floor(per / b.step + EPS) * b.step);
    // session contact cap (ATH-01): share the cap across the day's contact slots
    const cap = (athletic && athletic.contacts_session_max) || D11.contacts_session_max || null;
    if (cap && sets > 0) {
      const n = day ? daySlots(day).filter((s) => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(s.bucket)).length || 1 : 1;
      const perSlotMax = Math.floor(cap / n);
      if (per * sets > perSlotMax) { per = Math.max(b.step, Math.floor(perSlotMax / sets / b.step + EPS) * b.step); whys.push(why('why.plyo_stage', 'ATH-01', { stage })); }
    }
  }
  // the cue follows how the drill is done (stage B2, athletic.cueKeyFor): stick a landing, reset a single ballistic jump, land &
  // go off a depth jump, quick continuous contacts on ankle / pogo work, 'repeat' on stage-3 repeated drills (R2-ATH-02 / 03)
  const notes = [{ key: cueKeyFor(ex, stage, model) }];
  const D11b = derived.D11_athletic_budget || {};
  if (D11b.heavy_play_week) notes.push({ key: 'note.heavy_play_week' });
  if (isUni(ex)) notes.push({ key: 'note.per_side' });
  const first = !!(fill && fill.flags && fill.flags.includes('first_reactive'));
  if (first) { notes.push({ key: 'note.first_reactive' }); whys.push(why('why.first_reactive', 'CAT-10')); }
  let load = null;
  if (ath.loaded_jump || ex.tags.includes('loaded_jump')) { load = { type: 'bw_pct', min: R.athletic.loaded_jump_bw_pct[0], max: R.athletic.loaded_jump_bw_pct[1] }; whys.push(why('why.loaded_jump', 'EQ-15')); }
  else {
    const h = boxHeightOf(ex);
    // EQ-16 (a 'high' record is never prescribed above medium here); the first reactive block drops from a low box (B2)
    // v0.5 fix round 1 (R3-ATH-02 '50+ racket players: only low-impact jumps'; sample 08: a 12-18 in box in week 1 for a 52-year-old
    // with knee pain): a 50+ court player, an older adult or a painful knee / ankle jumps from and onto the low box in every stage
    const A50 = R.population.active_aging_50;
    const lowOnly = !!(R.athletic.x1 && R.athletic.x1.low_impact_low_box) && ((A50 && (derived.age || 0) >= A50.from_age) || (derived.pain || []).some((p) => ['knee', 'ankle_foot'].includes(p.area)));
    if (h) load = { type: 'height', value: (first && ex.tags.includes('depth_jump')) || lowOnly ? 'low' : (h === 'high' ? 'medium' : h) };
  }
  const rest = ex.tags.includes('depth_jump') ? { type: 'seconds', min: R.rest.depth_jump_s[0], max: R.rest.depth_jump_s[1] }
    : { type: 'work_rest', min: R.rest.plyo_work_rest[0], max: R.rest.plyo_work_rest[1] };
  const written = isUni(ex) ? Math.max(1, roundHalfUp(per / 2)) : per;
  return mk({
    reps: { type: 'contacts', value: written }, effort: { type: 'intent', key: R.effort.athletic.key }, rest, load,
    athletic: { unit: 'contacts', per_set: per, total: (sets || 0) * per, stage, quality, key, response: responseOf(ex) },
    notes, why: whys
  });
}

function throwDose(input) {
  const { exercise: ex, sets, derived, model } = input;
  const R = model.rules;
  const kind = ex.tags.includes('wall_ball') ? 'wall_ball' : ex.medball ? ex.medball.kind : null;
  let reps, per;
  const whys = [];
  // per side only for rotational / single-side throws; an overhead or chest pass is counted as written (review 02 minor)
  const sided = throwSided(ex);
  const plan = planFor(input);
  // v0.4 fix round 1 / F2 (LIB-22; RECHECK 02 minor '3 x 20 every Monday'): the sit-up pass is dosed like the other throws (6-10 a
  // set, climbing with the athletic stairway) when the rules give its range
  const FT = R.athletic.f2 && R.athletic.f2.throws;
  if (kind === 'situp' && !(FT && FT.situp_range)) { reps = { type: 'fixed', value: R.reps.matrix.throw.situp_reps }; per = reps.value; }
  else if (kind === 'wall_ball') { const w = R.reps.matrix.throw.wall_ball_reps; reps = { type: 'range', min: w[0], max: w[1] }; per = w[0]; }
  else {
    per = sided ? R.reps.matrix.throw.reps_per_side * 2 : (kind === 'situp' ? FT.situp_range[1] : R.reps.matrix.throw.reps_per_side);
    if (plan) { per = plan.per_set; whys.push(why('why.athletic_reconcile', 'D-63')); }
    if (sided) { const side = Math.max(1, Math.ceil(per / 2 - EPS)); per = side * 2; reps = { type: 'throws_per_side', value: side }; }
    else reps = { type: 'fixed', value: per };
  }
  let load = null;
  if (ex.medball) { load = medballLoad(ex, derived, R); whys.push(why('why.medball_load', 'EQ-06')); }
  return mk({
    reps, effort: { type: 'intent', key: R.effort.athletic.key }, rest: { type: 'seconds', min: R.rest.throw_s[0], max: R.rest.throw_s[1] }, load,
    athletic: { unit: 'throws', per_set: per, total: (sets || 0) * per, stage: null, quality: 'throw', key: 'throws', response: null },
    notes: [], why: whys
  });
}

function codSprintDose(input, rc) {
  const { exercise: ex, sets, week, model, derived } = input;
  const R = model.rules;
  const p = stairProgress(week);
  let reps, unit, per;
  let codNote = null;
  const whys = [];
  const plan = planFor(input);
  if (rc === 'cod') {
    const r = R.reps.matrix.cod.reps;
    per = roundHalfUp(r[0] + (r[1] - r[0]) * p);
    if (plan) { per = plan.per_set; whys.push(why('why.athletic_reconcile', 'D-63')); }
    reps = { type: 'cuts', value: per }; unit = 'cuts';
    if (ex && ex.athletic && ex.athletic.no_cuts) { per = 0; } // a straight release (fade) has no cut to count (B2)
    // v0.4 fix round 1 / F2 (RECHECK 03 minor: '5-10-5 2 x 9 cuts' = 4.5 reps): a drill with several cuts a rep is written in whole
    // reps of the drill (the athletic stairway doses it in steps of its cuts per rep)
    const CF = R.athletic.f2 && R.athletic.f2.cod;
    const cpr = CF && CF.reps_from_cuts_per_rep && ex && CF.cuts_per_rep ? CF.cuts_per_rep[ex.id] : null;
    if (typeof cpr === 'number' && cpr > 1 && per > 0) {
      const nReps = Math.max(1, roundHalfUp(per / cpr));
      per = nReps * cpr;
      reps = { type: 'fixed', value: nReps };
      codNote = { key: 'note.cod_reps', args: { cuts: cpr } };
    }
  } else {
    // a sprint set is reps x metres; the metres follow the drill (accelerations 10-20 m, max velocity 30-40 m after a build-up,
    // in 5-m steps; LIB-21, stage B2) and climb with the ramp the athletic stairway uses
    const SP = R.athletic.sprint || { reps: R.reps.matrix.sprint.reps };
    const prog = rampProgress(derived, model, week);
    const m = sprintMetres(model, ex, prog === null ? 1 : prog);
    let nReps = roundHalfUp(SP.reps[0] + (SP.reps[1] - SP.reps[0]) * p);
    if (plan) { nReps = clamp(roundHalfUp(plan.per_set / m), SP.reps[0], SP.reps[1]); whys.push(why('why.athletic_reconcile', 'D-63')); }
    per = nReps * m;
    reps = { type: 'sprint_reps', reps: nReps, metres: m }; unit = 'metres';
    const kind = ex && ex.athletic && ex.athletic.sprint_kind;
    if (kind === 'acceleration' || kind === 'max_velocity') whys.push(why('why.sprint_focus', 'LIB-21', { kind: 'sprint.kind.' + kind }));
  }
  return mk({
    reps, effort: { type: 'intent', key: R.effort.athletic.key }, rest: { type: 'as_prescribed' }, // R.rest.athletic
    athletic: { unit, per_set: per, total: (sets || 0) * per, stage: null, quality: (ex && ex.athletic && ex.athletic.quality) || rc, key: unit === 'cuts' ? (per > 0 ? 'cod_cuts' : null) : 'sprint_m', response: null },
    notes: codNote ? [codNote] : [], why: whys
  });
}

function prehabDose(input) {
  const { slot, exercise: ex, model } = input;
  const R = model.rules;
  const code = prehabCode(slot) || slot.prehab_code || null;
  // v0.4 fix round 2 / F3 (RECHECK v0.4 08 minor: a tibialis raise labelled 'Joint care for the Achilles and calves'): the label follows the
  // exercise when the rules name one for it (rules.prehab.label_by_exercise), else the slot's joint-care code
  const LBE = (R.prehab.label_by_exercise || []).find((x) => new RegExp(x.re).test(ex.id) && model.has('en', x.key));
  const notes = LBE ? [{ key: LBE.key }] : code ? [{ key: model.has('en', 'prehab.label.' + code) ? 'prehab.label.' + code : 'note.prehab', args: { code } }] : [];
  // the catalog's own unit: a hold in seconds (Copenhagen plank 20-60 s, a balance reach), else reps (review 08 major 5)
  let reps;
  const hold = ex.rep_hint && ex.rep_hint.unit === 'seconds' || ISOMETRIC_RE.test(ex.id);
  if (R.prehab.unit_from_rep_hint && hold) {
    const h = (R.reps.core_hold_seconds && R.reps.core_hold_seconds.default) || [20, 40];
    reps = { type: 'seconds', min: h[0], max: h[1] };
    if (isUni(ex)) notes.push({ key: 'note.per_side' });
  } else {
    reps = bracketSpec(R, R.reps.matrix.prehab.bracket, isUni(ex));
    if (reps && reps.type === 'per_side') notes.push({ key: 'note.per_side' });
  }
  // v0.4 fix round 2 / F2 (E-175, R3-ATH-01): every-session shoulder care done inside the rests of the day's pulls says so
  const inRest = slot.time_class === 'prehab_in_rest' && model.has('en', 'note.prehab_in_rest');
  if (inRest) notes.push({ key: 'note.prehab_in_rest' });
  return mk({
    reps, effort: { type: 'intent', key: 'effort.prehab' }, rest: inRest ? { type: 'as_prescribed' } : { type: 'seconds', min: R.rest.prehab_s[0], max: R.rest.prehab_s[1] },
    notes, why: code ? [why('why.prehab', 'D-23', { code })] : []
  });
}

function coreDose(input) {
  const { slot, exercise: ex, week, derived, model } = input;
  const R = model.rules;
  const column = R.reps.goal_column[derived.goal] || 'general';
  const cell = R.reps.matrix.core[column] || R.reps.matrix.core.general;
  const iso = (ex.rep_hint && ex.rep_hint.unit === 'seconds') || ISOMETRIC_RE.test(ex.id);
  let reps;
  // v1.2 (R2-SES-03; review 01 / 03 / 05 minors): holds get seconds (per side when one-sided) and a hold cue, never 'leave 3 in
  // the tank'; rep-based core gets reps, never seconds; the Copenhagen plank stays short below L3
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  if (iso) {
    let sec = cell.or_seconds || cell.seconds || (R.reps.core_hold_seconds && R.reps.core_hold_seconds.default) || [20, 40];
    const CH = R.reps.core_hold_seconds || null;
    if (/copenhagen/.test(ex.id) && CH && CH.copenhagen_L1_L2 && lvl !== 'L3') sec = CH.copenhagen_L1_L2;
    // v0.4 fix round 2 / F3 (E-195; PER-02 'one small change at the exercise-block start'; RECHECK v0.4 01 minor: the same holds at 2 x 20-40 s
    // through three exercise blocks): a hold gets a little longer with each exercise block (rules.reps.core_hold_seconds.block_step)
    else if (CH && CH.block_step && week.block_type === 'stairway') {
      const k = Math.min(CH.block_step.max_steps, exerciseBlockIndex(input));
      if (k > 0) sec = [sec[0] + k * CH.block_step.s, Math.min(CH.block_step.cap_s, sec[1] + k * CH.block_step.s)];
    }
    reps = { type: 'seconds', min: sec[0], max: sec[1] };
  } else if (cell.bracket) reps = bracketSpec(R, cell.bracket, isUni(ex));
  else reps = bracketSpec(R, 'b10_15', isUni(ex));
  let effort;
  // v0.5 fix round 2 (sample 04 major, 02 minor; R2-SES-03 'core first stays light, 2 exercises x 2 sets, short of failure, as a
  // warm-up'): the opener's effort is the same light cue in every week - never the week's reps in the tank, which got harder as
  // the plan did (rules.core_block.x2.opener_effort_key); a core block moved to the end keeps the planned effort
  const openerKey = R.core_block.x2 && R.core_block.x2.opener_effort_key;
  const opener = !derived.prefs || !derived.prefs.core_position || derived.prefs.core_position === 'start';
  if (iso && R.effort.hold_key) effort = { type: 'intent', key: R.effort.hold_key };
  else if (openerKey && opener && slot.block !== 'circuit' && model.has('en', openerKey)) effort = { type: 'intent', key: openerKey };
  else {
    effort = rirEffort(week, 'core', R);
    // light opener when the core block is first: short of failure (R2-SES-03, ATH-11)
    const first0 = !derived.prefs || !derived.prefs.core_position || derived.prefs.core_position === 'start';
    if (first0 && R.core_block.submaximal_when_first && effort.min < 2) {
      effort.min = 2; effort.max = Math.max(effort.max, 2);
      effort.rpe_min = R.effort.rpe_for_rir[String(effort.max)]; effort.rpe_max = R.effort.rpe_for_rir[String(effort.min)];
    }
    effort.intensifier = false;
  }
  const first = !derived.prefs || !derived.prefs.core_position || derived.prefs.core_position === 'start';
  const notes = [];
  if ((reps && reps.type === 'per_side') || (iso && isUni(ex))) notes.push({ key: 'note.per_side' });
  // once per plan: the first core item of the plan's first training day (R2-SES-03)
  if (week.n === 1 && slot.day_index === 0 && input.day) {
    const firstCore = daySlots(input.day).find((s) => model.bucket(s.bucket).kind === 'core');
    if (firstCore && firstCore.slot_id === slot.slot_id) notes.push({ key: 'note.core_supersets_optional' });
  }
  return mk({
    reps, effort, rest: input.position && input.position.superset_active ? (R.rest.after_pair_numbers ? { type: 'after_pair', min: R.rest.core_s[0], max: R.rest.core_s[1] } : { type: 'after_pair' }) : { type: 'seconds', min: R.rest.core_s[0], max: R.rest.core_s[1] },
    notes, why: [why(first ? 'why.core_first' : 'why.core_moved', first ? 'ATH-11' : 'R2-SES-03')]
  });
}

function applyTest(d, input, rc) {
  const { slot, week, derived, model } = input;
  const R = model.rules;
  let test = slot.test;
  const fromZero = !!(week.test && week.test.from_zero);
  if (fromZero) { // never a 1RM or max-effort mile / time trial without a completed block (H19, R2-PER-07)
    const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
    const after = R.tests.catalogue.strength.after_completed_block;
    if (Object.values(after).includes(test) && !Object.values(R.tests.catalogue.strength.from_zero).includes(test)) test = R.tests.catalogue.strength.from_zero[lvl];
    if ((R.tests.catalogue.cardio.after_completed_block || []).includes(test)) test = R.tests.catalogue.cardio.from_zero;
  }
  d.reps = { type: 'test', test };
  d.set_reps = null;
  if (rc !== 'olympic') d.effort = { type: 'intent', key: R.effort.athletic.key };
  // v1.2 (review 01 / 02 / 04): a test item is written as a test - work up to one top set, warm-up sets first, no week-1 tip,
  // no superset partner (generate drops the pair), the same lift in the baseline and the end week; B3: no training rep cap on a
  // rep-max test (RECHECK 01 / 02 minors)
  d.notes = d.notes.filter((n) => n.key !== R.effort.week1_tip_key && n.key !== 'note.per_side' && n.key !== 'note.rep_cap' && n.key !== 'note.bodyweight_regress' && n.key !== 'note.bodyweight_regress_no_machine');
  if (d.load && d.load.type === 'week1_tip') d.load = null;
  const strengthIds = new Set([...Object.values(R.tests.catalogue.strength.from_zero), ...Object.values(R.tests.catalogue.strength.after_completed_block), R.tests.catalogue.strength.older]);
  if (strengthIds.has(test) && R.tests.test_item && R.tests.test_item.strength_wording) d.notes.push({ key: 'note.test_rep_max_work_up', args: { test: 'tests.' + test } });
  d.notes.push({ key: week.test && week.test.type === 'baseline' ? 'note.test_baseline' : 'note.test_day' });
  d.rest = { type: 'seconds', min: R.rest.strength_s[0], max: R.rest.strength_s[1] };
  d.why.push(why('why.test_timing', 'R2-PER-07'));
  if (fromZero && isSafeFromZeroTest(test, R)) { d.notes.push({ key: 'note.test_from_zero', args: { test: 'tests.' + test } }); d.why.push(why('why.test_from_zero', 'R2-PER-07')); }
}

/**
 * A test item of its own (jumps, speed / agility, cardio on a lifting day): the protocol and what to record (R2-PER-07; v1.2).
 * @param {object} slot the TEST slot (slot.test = test id) @param {object} weekShape @param {object} derived @param {object} model
 * @returns {object} Dose
 */
export function doseTestItem(slot, weekShape, derived, model) {
  const R = model.rules;
  const test = slot.test;
  const notes = [];
  if (/cmj|jump/.test(test)) notes.push({ key: 'note.test_jump' });
  else if (/sprint|shuttle|l-test|5-10-5/.test(test)) notes.push({ key: 'note.test_sprint' });
  if (weekShape && weekShape.test && weekShape.test.type === 'baseline') notes.push({ key: 'note.test_baseline' });
  const whys = [why('why.test_timing', 'R2-PER-07')];
  if (weekShape && weekShape.test && weekShape.test.from_zero && isSafeFromZeroTest(test, R)) { notes.push({ key: 'note.test_from_zero', args: { test: 'tests.' + test } }); whys.push(why('why.test_from_zero', 'R2-PER-07')); }
  return mk({ reps: { type: 'test', test }, effort: { type: 'intent', key: R.effort.athletic.key }, rest: { type: 'as_prescribed' }, notes, why: whys });
}

/** "No max test from zero: X instead" only when X is the safe stand-in for a max test (strength rep max, 80-90 % effort);
 *  a countermovement jump or a sprint is not a max test (integration fix) */
function isSafeFromZeroTest(test, R) {
  const c = R.tests.catalogue;
  return Object.values(c.strength.from_zero).includes(test) || test === c.cardio.from_zero || test === c.speed_agility.from_zero;
}

// ------------------------------------------------------------------------------------------------------------------
// aerobic / conditioning
// ------------------------------------------------------------------------------------------------------------------

/**
 * Aerobic slot dose: colour, minutes, any erg (EQ-14); recovery weeks Orange only.
 * @param {object} slot SlotDef with `aerobic` @param {object} weekShape @param {object} derived @param {object} model
 * @returns {object} Dose
 */
export function doseAerobic(slot, weekShape, derived, model, fill) {
  const R = model.rules;
  const colour = weekShape && weekShape.block_type === 'recovery' ? 'C' : ((slot.aerobic && slot.aerobic.colour) || R.conditioning.extra_colour);
  let [min, max] = R.conditioning.minutes[colour];
  if (colour === 'C') max = Math.min(max, R.conditioning.steady_max_min);
  // v0.4 stage B3 (EQ-14 'any erg'; RECHECK 03 / 07 / 08: '2 Mile Run' / run-walks for a client with a bike, no running space or
  // knee pain): the session is done on the client's own cardio tool, its pattern (work / easy times, steady, short sprints) read
  // from the coach's record; the other tools are listed as options
  const AB = R.conditioning.aerobic_b3;
  const mod = AB ? aerobicModality(slot, derived, AB) : null;
  const notes = [];
  if (AB) {
    const others = mod.options.filter((m) => m !== mod.modality);
    notes.push(others.length ? { key: 'note.cardio_options', args: { list: others.map((m) => 'cardio.modality.' + m) } } : { key: 'note.cardio_any' });
  } else notes.push({ key: 'note.any_erg' });
  let exId = fill && fill.exercise_id;
  // v0.4 fix round 2 / F3 (E-194; COACH-ANSWER ATH-07 colours by level; RECHECK v0.4 03 major / 04 minor: the same run-walk and the same
  // 30-40 min for six and eight weeks): inside a stairway's exercise block the minutes climb from the low end of the colour's range to
  // its top, and an exercise block of rules.conditioning.aerobic_b3.r2.long_block_weeks or more climbs one rung of the colour's ladder
  // at its halfway week (effort.rung names the record whose pattern the week runs)
  const A2 = AB && AB.r2 ? AB.r2 : null;
  let rung = null;
  const ebw = weekShape && weekShape.block_type === 'stairway' && typeof weekShape.exercise_block_week === 'number' ? weekShape.exercise_block_week : null;
  const ebLen = ebw !== null ? exerciseBlockLength(weekShape, model) : null;
  if (A2 && ebw !== null && ebLen && !slot.test) {
    if (A2.minutes_climb && ebLen > 1 && colour !== 'LC') {
      const m = Math.round(min + (max - min) * clamp((ebw - 1) / (ebLen - 1), 0, 1));
      min = m; max = m;
    }
    const ladder = (AB.ladder && AB.ladder[colour]) || [];
    const at = ladder.indexOf(exId);
    if (A2.long_block_weeks && ebLen >= A2.long_block_weeks && ebw > Math.ceil(ebLen / 2) && at >= 0 && at + 1 < ladder.length && model.hasEx(ladder[at + 1])) { exId = ladder[at + 1]; rung = exId; }
  }
  const pattern = AB && exId && AB.patterns && AB.patterns[exId] ? { ...AB.patterns[exId] } : null;
  if (slot.aerobic && slot.aerobic.position === 'open_day') notes.push({ key: 'note.fighter_aerobic_open' });
  if (slot.aerobic && slot.aerobic.position === 'separate_session') notes.push({ key: 'note.aerobic_separate' });
  if (slot.aerobic && slot.aerobic.required && R.conditioning.required_on_optional_note) notes.push({ key: R.conditioning.required_on_optional_note });
  const D14 = derived.D14_aerobic_sessions || {};
  if (D14.replaced_by_activity > 0) notes.push({ key: 'note.play_counts_aerobic', args: { activity: ((derived.D2_profile && derived.D2_profile.activity_ids) || [])[0] || (derived.D2_profile && derived.D2_profile.id) || '' } });
  const whys = [why('why.aerobic_colour', 'R2-SES-06')];
  const effort = AB ? { type: 'aerobic', colour, modality: mod.modality, pattern, ...(rung ? { rung } : {}) } : { type: 'aerobic', colour };
  if (rung) whys.push(why('why.aerobic_rung', 'ATH-07'));
  if (mod && mod.pain) whys.push(why('why.aerobic_low_impact', 'EQ-14'));
  if (slot.test) {
    const tn = [...notes, { key: 'note.test_day_session' }];   // an aerobic test replaces the session, not "top sets"
    const tw = [...whys, why('why.test_timing', 'R2-PER-07')];
    if (weekShape && weekShape.test && weekShape.test.from_zero && isSafeFromZeroTest(slot.test, R)) { tn.push({ key: 'note.test_from_zero', args: { test: 'tests.' + slot.test } }); tw.push(why('why.test_from_zero', 'R2-PER-07')); }
    return mk({ reps: { type: 'test', test: slot.test }, effort, notes: tn, why: tw });
  }
  return mk({ reps: { type: 'minutes', min, max }, effort, notes, why: whys });
}

/**
 * The cardio tool of an aerobic session (stage B3): the client's own options (intake equipment.detail.cardio_options, in the
 * order given; 'run' only with running space or when the client chose it), low-impact tools first and running dropped for lower-
 * limb pain when another tool exists; the colour takes its own tool from the list so the week mixes them (A the first, B the
 * second, C the third ...). No options -> 'any'.
 * @returns {{modality:string, options:string[], pain:boolean}}
 */
function aerobicModality(slot, derived, AB) {
  const kit = derived.D8_kit || {};
  let opts = (kit.cardio_options || []).filter((m) => AB.modalities.includes(m));
  const painAreas = (derived.pain || []).map((p) => p.area);
  const pain = painAreas.some((a) => (AB.impact_free_first_for_pain || []).includes(a));
  if (pain && opts.some((m) => AB.impact_free.includes(m))) opts = opts.filter((m) => !AB.running.includes(m));
  if (!opts.length) return { modality: 'any', options: [], pain };
  const colours = ['A', 'B', 'C', 'LC'];
  const i = Math.max(0, colours.indexOf((slot.aerobic && slot.aerobic.colour) || 'C'));
  return { modality: opts[i % opts.length], options: opts, pain };
}

/** the day's first isolation station in a circuit block, calves last (the last week's circuit intensifier, F3; never a compound,
 *  H02 'never to failure on heavy compounds') */
function circuitIntensifierSlot(day, model) {
  let calf = null;
  for (const b of day.blocks || []) {
    if (b.kind !== 'circuit') continue;
    for (const s of b.slots || []) {
      let k = null;
      try { k = model.bucket(s.bucket).kind; } catch { k = null; }
      if (k !== 'isolation') continue;
      if (s.bucket === 'ISO_CALF') { if (!calf) calf = s.slot_id; continue; }
      return s.slot_id;
    }
  }
  return calf;
}

/**
 * WOD / skill / circuit-station / buy-out doses (class model, bootcamp).
 * @param {object} slot @param {object} fill @param {object} weekShape @param {object} derived @param {object} model
 * @param {object} [input] the doseItem input when called from doseItem (sets, day, exercise)
 * @returns {object} Dose
 */
export function doseConditioning(slot, fill, weekShape, derived, model, input) {
  const R = model.rules;
  const week = weekShape || {};
  const ex = fill && fill.exercise_id && model.hasEx(fill.exercise_id) ? model.ex(fill.exercise_id) : (input && input.exercise) || null;
  const p = stairProgress(week);
  if (slot.bucket === 'COND_WOD') {
    const W = R.conditioning.wod;
    const wodOnly = /^WOD\./.test(slot.station_id || ''); // the WOD-only class day (OT18)
    // v0.5 (CT-01): the WOD keeps its own range - it is never shortened or held for the session's time
    const range = wodOnly ? W.wod_only_day_minutes : W.minutes;
    let m = roundHalfUp(range[0] + (range[1] - range[0]) * p);
    const format = W.formats[(slot.day_index || 0) % W.formats.length];
    const all = ((fill && fill.stations) || [fill && fill.exercise_id]).filter(Boolean);
    const n = m < 15 ? W.stations[0] : W.stations[1];
    const stations = all.slice(0, n);
    // v0.4 fix round 2 / F2 (E-173; COACH-R3 R3-VOL-04 / R3-SES-02 step 4 'the stairway climbs'; OBSERVED CrossFit tab: WOD levels ramp
    // inside every block; RECHECK v0.4 04 major: the four main-day WODs ran the same 10 minutes, stations and reps for 8 weeks, and the
    // EMOM lengths 21 / 22 / 23 / 25 / 27 did not divide by its 4 stations): a WOD climbs by its work - an EMOM runs whole rounds of
    // its stations (minutes = rounds x stations) and what the minutes cannot show goes into the reps a station does (`density`); a WOD
    // the time check holds at its short end climbs by density alone (rules.conditioning.wod.density)
    const DN = W.density || null;
    let density = 1;
    if (DN && DN.enabled && week.block_type === 'stairway') {
      const want = range[0] + (range[1] - range[0]) * p;
      if (format === 'emom' && stations.length > 0 && DN.emom_whole_rounds) {
        // (whole rounds inside the WOD's own range: the largest multiple of the stations at or under the week's minutes, else the
        // smallest one inside the range; a WOD pinned to minutes that hold no whole round keeps them)
        const k = stations.length;
        let mm = Math.floor(want / k + EPS) * k;
        if (mm < range[0] - EPS) mm = Math.ceil(range[0] / k - EPS) * k;
        if (mm >= range[0] - EPS && mm <= range[1] + EPS) m = mm;
      }
      density = m > 0 ? Math.max(1, want / m) : 1;
      if (range[1] - range[0] < EPS) density = Math.max(density, 1 + (DN.hold_total || 0) * p);
      if (format === 'amrap') density = 1; // (an AMRAP round keeps its reps: its density is the rounds done in the time, told by the note)
      if (format === 'for_time' && W.for_time_progress) density = 1; // (fix round 1: a for-time WOD climbs by its rounds, below)
    }
    const notes = [{ key: 'note.wod' }];
    let load = null;
    const ball = stations.map((id) => (model.hasEx(id) ? model.ex(id) : null)).find((e) => e && e.medball);
    if (ball) load = medballLoad(ball, derived, R); // wall balls 10-20 lb, never > 20
    // v1.2 (review 04 major 7): every station gets its reps (or calories) for the format - an EMOM minute holds ~35-45 s of
    // work, AMRAP / for-time use a rep scheme with the minutes as the cap; scaled down for L1
    const RB = W.reps_by_group || {};
    const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
    const scaleL = lvl === 'L1' ? 0.75 : 1;
    const station_reps = stations.map((id) => {
      const e = model.hasEx(id) ? model.ex(id) : null;
      const g = e ? wodGroupOf(e) : 'default';
      const row = RB[g] || RB.default || { emom: 10, amrap: 12, for_time: 15 };
      const v = Math.max(3, roundHalfUp((row[format] || row.amrap || 10) * scaleL * density));
      return g === 'erg' ? { type: 'calories', n: v } : g === 'carry' ? { type: 'metres', value: v } : { type: 'fixed', value: v };
    });
    if (DN && DN.enabled && week.block_type === 'stairway' && format === 'amrap' && (range[1] - range[0] < EPS) && model.has('en', 'note.wod_amrap_density')) notes.push({ key: 'note.wod_amrap_density' });
    let rounds = format === 'for_time' && W.for_time_rounds ? W.for_time_rounds[lvl === 'L1' ? 0 : 1] : null;
    // v0.5 fix round 1 (sample 04 major: the 'for time' workout kept 4 rounds of the same reps while only its time cap grew - a cap
    // that grows makes it easier; R2-PER-03 'the plan climbs'): a for-time WOD climbs by its work - one more round as the stairway
    // climbs - and its cap is derived from the work (the minutes a round took at the start), inside the WOD's own range
    const FT = W.for_time_progress || null;
    if (FT && format === 'for_time' && rounds !== null && week.block_type === 'stairway') {
      const base = rounds;
      rounds = base + Math.min(FT.rounds_add || 0, Math.floor((FT.rounds_add || 0) * p + 0.5 + EPS));
      m = Math.min(range[1], Math.max(range[0], roundHalfUp(range[0] * rounds / base)));
      if (model.has('en', 'note.wod_for_time_work')) notes.push({ key: 'note.wod_for_time_work' });
    }
    // B3 (RECHECK 04 major: 'no station has a load', 'EMOMs never say how to rotate'): a load per loaded station by level
    // (dumbbells per hand, the kettlebell) and the format's rotation words
    const SL = W.station_loads_lb || null;
    // (fix round 1, sample 04 major: 'Barbell Thruster (25-35 lb dumbbells)' - the load is the load of the station's own
    // implement: a barbell station takes the bar's row, rules.conditioning.wod.station_loads_lb.barbell)
    const station_loads = SL ? stations.map((id) => {
      const e = model.hasEx(id) ? model.ex(id) : null;
      const g = e ? wodGroupOf(e) : null;
      const bar = !!e && e.tags.includes('barbell') && SL.barbell && SL.barbell[g];
      const row = e ? (bar ? SL.barbell[g] : SL[g]) : null;
      return row && row[lvl] && !(e.tags.includes('barbell') && !bar) ? { type: 'lb_range', unit: row.unit, min: row[lvl][0], max: row[lvl][1] } : null;
    }) : null;
    if (model.has('en', 'wod.rotation.' + format)) notes.push({ key: 'wod.rotation.' + format });
    return mk({ reps: { type: 'minutes', min: m, max: m }, effort: { type: 'intent', key: 'effort.wod' }, load,
      wod: { format, minutes: [m, m], stations, station_reps, rounds, ...(station_loads ? { station_loads } : {}), ...(density > 1 + EPS ? { density: Math.round(density * 100) / 100 } : {}) }, notes,
      why: [why('why.wod', 'D-20'), ...(density > 1 + EPS ? [why('why.wod_density', 'R3-VOL-04')] : [])] });
  }
  if (slot.bucket === 'SKILL') {
    const s = R.reps.matrix.skill.minutes;
    return mk({ reps: { type: 'minutes', min: s[0], max: s[1] }, notes: [], why: [why('why.wod', 'D-20')] });
  }
  if (slot.block === 'circuit') {
    const bc = R.supersets.bootcamp;
    const circ = week.circuit || { rounds: bc.stairway.rounds_start, work_s: bc.stairway.work_s_start };
    const rounds = (input && input.sets) || circ.rounds;
    const notes = [{ key: 'note.circuit', args: { rounds, work_s: circ.work_s, transition_s: bc.transition_s, between_s: bc.between_rounds_s } }];
    let load = null;
    if (ex && ex.medball) load = medballLoad(ex, derived, R);
    // the effort words follow the station: a weight you could keep moving with ~2 left at the bell, or a hard steady pace for
    // the cardio stations (R2-GEN-06; review 05 minor)
    const metabolic = slot.bucket === 'COND_CIRCUIT' || (ex && (ex.is_athletic || ex.conditioning));
    const EK = R.effort.circuit_keys || {};
    const ekey = metabolic ? (EK.metabolic || 'effort.circuit') : (EK.resistance || 'effort.circuit');
    // B3 (RECHECK 05 major: the circuit cue never changed, 'about 2 reps left' for 8 weeks): a resistance station follows the planned
    // effort of the stairway week ('about {rir} reps left at the bell'); a body-weight station picks a version or tempo, never 'a
    // weight' (RECHECK 05 minor); a single-side station switches sides at half time (RECHECK 05 minor)
    const CR = R.effort.circuit_rir;
    const bw = !!ex && (isBodyweightRecord(ex) || isBodyweightMoved(ex, R));
    let effort = { type: 'intent', key: ekey };
    if (CR && !metabolic && ex) {
      const rr = rirEffort(week, classFromExercise(ex, model), R);
      effort = { ...rr, intensifier: false, circuit: true, key: bw ? CR.bodyweight_key : CR.key };
      // v0.4 fix round 1 / F3 (COACH-R3 R3-VOL-04 '1 + intensifiers in the last week'; RECHECK 05 major: promised, carried by no station):
      // in the last stairway week the day's first isolation station ends its last round with a 10-s hold at the hardest point
      // (rules.effort.circuit_intensifier; inside 1-3 RIR, never to failure, never on a compound - H02)
      const CI = R.effort.circuit_intensifier;
      const lastWeek = week.block_type === 'stairway' && !!(week.planned_rir && week.planned_rir.intensifiers);
      const pos = input && input.position;
      const mark = pos && typeof pos.is_last_intensifier === 'boolean' ? pos.is_last_intensifier : !!(input && input.day && circuitIntensifierSlot(input.day, model) === slot.slot_id);
      // (fix round 2: never on a compound lift standing in on an isolation station - the step-up of a kit with no leg extension)
      if (CI && CI.enabled && lastWeek && mark && ex.exercise_class === 'isolation') {
        effort.last_set = CI.kind || 'hold'; effort.intensifier = true;
      }
    }
    if (!metabolic && week.stair_week === 1 && week.block_type === 'stairway' && !bw) notes.push({ key: CR && model.has('en', 'load.week1_tip_circuit') ? 'load.week1_tip_circuit' : R.effort.week1_tip_key });
    // (fix round 2 / F3, UNI-09; RECHECK v0.4 05 minor: 'switch sides at half time' next to a cue that says 'keep alternating every rep')
    const altNote = !!(R.effort.circuit_alternating_note) && model.has('en', R.effort.circuit_alternating_note);
    if (ex && !metabolic && ex.laterality === 'unilateral' && model.has('en', 'note.circuit_unilateral')) notes.push({ key: 'note.circuit_unilateral' });
    else if (ex && !metabolic && ex.laterality === 'alternating' && !altNote && model.has('en', 'note.circuit_unilateral')) notes.push({ key: 'note.circuit_unilateral' });
    else if (ex && !metabolic && ex.laterality === 'alternating' && altNote) notes.push({ key: R.effort.circuit_alternating_note });
    // B2 (RECHECK 05 major): a ballistic circuit station counts its throws (one per rules.athletic.circuit_ballistic.throw_seconds
    // of work) toward the weekly medball budget; a KB swing is power work that counts nowhere (R2-VOL-05)
    const CB = R.athletic.circuit_ballistic;
    let athletic = null;
    if (ex && ex.medball && CB && metabolic) {
      // about one throw per throw_seconds of work, never more a week than the profile's weekly throws (one ball station a week)
      // v0.4 B4 (integration, random sweep: 99 / 80 / 66 throws against a week-1 target of 20): only a metabolic (ballistic)
      // station counts throws - a medball held as the load of a press or a squat is a resistance station; the station's throws
      // share the WEEK's throw target (it ramps low -> high across the stairway, athletic.athleticBudget) with the week's other
      // ball rounds (generate passes week.athletic_week = {targets, circuit_ball_sets}), never the range's high end per station
      const wk = derived.D11_athletic_budget && derived.D11_athletic_budget.weekly && derived.D11_athletic_budget.weekly.throws;
      const aw = week.athletic_week || null;
      const wkT = aw && aw.targets && typeof aw.targets.throws === 'number' && aw.targets.throws > 0 ? aw.targets.throws : (Array.isArray(wk) && wk[1] > 0 ? wk[1] : null);
      const ballSets = aw && aw.circuit_ball_sets > 0 ? aw.circuit_ball_sets : rounds;
      let cap = wkT !== null ? Math.max(1, Math.floor(wkT / Math.max(1, ballSets) + EPS)) : Infinity;
      // (fix round 2: a week that runs one more round - rules.supersets.bootcamp.x2.rounds_late - never throws fewer balls than the
      // same week would at the block's own rounds: the throws a round are rounded up for it)
      {
        const lvlC = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
        const baseR = (bc.stairway.rounds_by_level || {})[lvlC];
        if (wkT !== null && typeof baseR === 'number' && rounds > baseR && bc.x2 && bc.x2.rounds_late) {
          const baseSets = Math.max(1, ballSets * baseR / rounds);
          const baseTotal = Math.max(1, Math.floor(wkT / baseSets + EPS)) * baseSets;
          if (cap * ballSets < baseTotal - EPS) cap = Math.ceil(baseTotal / ballSets - EPS);
        }
      }
      let per = Math.max(1, Math.min(cap, Math.floor(circ.work_s / (CB.throw_seconds || 3) + EPS)));
      // v0.4 fix round 2 / F2 (E-174; COACH-ANSWER ORD-03 / LIB-06 'no levels, just do them right'; RECHECK v0.4 05 major: 13 'max-intent'
      // overhead throws in a 50-s station is conditioning, not power): the ball station is dosed in throws a round - a few full-intent
      // throws climbing with the stairway (rules.athletic.circuit_ballistic.per_round), then rest out the station
      const PR = Array.isArray(CB.per_round) && week.block_type === 'stairway' ? CB.per_round : null;
      // (sweep random-677 / 817: the week that holds for a physical end test throws what the week before threw - V27 hold_over)
      const pHold = aw && aw.hold && typeof aw.prev_stair_level === 'number' ? stairProgress({ stair_level: aw.prev_stair_level }) : p;
      if (PR) per = Math.max(1, Math.min(per, roundHalfUp(PR[0] + (PR[1] - PR[0]) * pHold)));
      athletic = { unit: 'throws', per_set: per, total: rounds * per, stage: null, quality: 'throw', key: 'throws', response: null };
      notes.push({ key: PR && model.has('en', 'note.circuit_ballistic_ball_rest') ? 'note.circuit_ballistic_ball_rest' : 'note.circuit_ballistic_ball', args: { n: per } });
    } else if (ex && ex.tags.includes('kb_swing')) {
      athletic = { unit: 'reps', per_set: null, total: null, stage: null, quality: 'ballistic', key: null, response: null };
      notes.push({ key: 'note.kb_swing_power' });
    }
    // v0.4 fix round 1 / F2 (R2-ATH-02: medball throws and KB swings are ballistic; RECHECK 05 major 'conditioning, not quality
    // power'): a ballistic circuit station is done with full intent, not at a steady pace (it opens its circuit, generate.mjs)
    if (athletic && R.athletic.f2 && R.effort.athletic && R.effort.athletic.key) effort = { type: 'intent', key: R.effort.athletic.key };
    return mk({
      reps: { type: 'rounds_work', rounds, work_s: circ.work_s }, effort,
      rest: { type: 'circuit', transition_s: bc.transition_s, between_rounds_s: bc.between_rounds_s }, load, athletic,
      circuit: { rounds, work_s: circ.work_s, transition_s: bc.transition_s }, notes,
      why: [why('why.circuit_stairway', 'D-19', { from: circ.from_s || bc.stairway.work_s_start, to: circ.to_s || bc.stairway.work_s_max }), ...(effort.type === 'rir' ? [why('why.planned_rir', 'R2-PER-05', { rir: rirArg(effort.min, effort.max) })] : []),
        ...(effort.intensifier ? [why('why.intensifier_last_week', 'R3-VOL-04')] : [])]
    });
  }
  if (slot.bucket === 'COND_CIRCUIT') { // finisher outside the bootcamp format (PRG-11)
    const Hx = R.athletic.hyrox;
    const cf = Hx && Hx.finisher && (Hx.station_variants || []).includes(slot.variant) ? Hx.finisher : R.conditioning.circuit_finisher;
    const rounds = roundHalfUp(cf.rounds[0] + (cf.rounds[1] - cf.rounds[0]) * p);
    const work = Math.round((cf.work_s[0] + (cf.work_s[1] - cf.work_s[0]) * p) / 5) * 5;
    // COACH-R3 R3-ATH-03 (B2): a HYROX station circuit (finisher, never a muscle set; 40-rep / AMRAP efforts live here only)
    const H = R.athletic.hyrox;
    const notes = [], whys = [];
    if (H && (H.station_variants || []).includes(slot.variant)) {
      notes.push({ key: 'note.hyrox_station' });
      if (slot.variant === 'hyrox_run_station') notes.push({ key: H.run_station_note || 'note.hyrox_run_station' });
      whys.push(why('why.hyrox_station', 'R3-ATH-03'));
      let load = null;
      if (ex && ex.medball) load = medballLoad(ex, derived, R); // the race wall ball, never over 20 lb
      return mk({ reps: { type: 'rounds_work', rounds, work_s: work }, effort: { type: 'intent', key: 'effort.circuit_metabolic' }, load,
        rest: { type: 'as_prescribed' }, circuit: { rounds, work_s: work, transition_s: R.supersets.bootcamp.transition_s }, notes, why: whys });
    }
    return mk({ reps: { type: 'rounds_work', rounds, work_s: work }, effort: { type: 'intent', key: 'effort.circuit' },
      rest: { type: 'as_prescribed' }, circuit: { rounds, work_s: work, transition_s: R.supersets.bootcamp.transition_s }, notes, why: whys });
  }
  if (slot.bucket === 'COND_SPRINT_BUYOUT') {
    // the coach's buy-out (BASEBALL Part E): 1-3 all-out bouts of 10-20 calories or 15-30 s runs (review 02 major 1)
    const BP = R.conditioning.buyout_pool || {};
    const cal = ex && /calorie|cal-/.test(ex.id);
    const sec = BP.seconds || [15, 30];
    // v0.5 fix round 2 (sample 02 major: '1 x 1 all-out bout ... hard but steady pace ... full recovery between sets' on one bout):
    // the dose is his own notation - bouts x calories -, the effort an all-out sprint, a rest only between bouts
    const BX = BP.x2 || null;
    const mcal = ex ? /calorie-effort-(\d+)-cal/.exec(ex.id) : null;
    const bouts = (input && typeof input.sets === 'number' && input.sets > 0) ? input.sets : 1;
    const reps = cal ? (BX && mcal ? { type: 'calories', n: Number(mcal[1]) } : { type: 'bout' }) : { type: 'seconds', min: sec[0], max: sec[1] };
    return mk({ reps, effort: { type: 'intent', key: BX ? BX.effort_key : 'effort.circuit_metabolic' }, rest: BX && bouts <= 1 ? null : { type: 'as_prescribed' }, notes: [{ key: 'note.buyout' }], why: [why('why.buyout', 'OBSERVED BASEBALL Part E')] });
  }
  if (input && input.week) return doseItem({ ...input, slot: { ...slot, block: slot.block === 'circuit' ? 'strength' : slot.block } });
  return mk({});
}
