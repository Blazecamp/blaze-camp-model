// engine/dose.mjs - owner B3 (engine/CONTRACTS.md §4.8).
// Dose of one plan item: rep class and column (muscle size x goal x preference), athlete VOL phases, pyramids
// (12/10/8 then a light 20), per-side reps, planned RIR from the stairway (min 1 on compounds; MAX only on the last set of
// small-muscle work; MYO only on the day's last machine / isolation exercise), rest, load (week-1 tip, power language,
// Olympic ramp, 3-5-rep full catches, loaded jumps, medballs <= 20 lb), athletic counts with the session contact cap,
// test items, WOD / skill / circuit / aerobic doses and notes. Pure: no I/O, no clock, no randomness.
import { why, EPS, clamp, roundHalfUp } from './util.mjs';
import { daySlots } from './week.mjs';
import { blockProgress, stayActiveOlympic, perSetFor, budgetKeyOf } from './budget.mjs';

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
  if (b.rep_class_by_variant && slot.variant && b.rep_class_by_variant[slot.variant]) rc = b.rep_class_by_variant[slot.variant];
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
function capToHint(range, ex, R) {
  const H = R.reps.rep_hint;
  if (!H || !H.honour || !range || range.min == null) return null;
  let hint = (H.ids_low_cap && H.ids_low_cap[ex.id]) || null;
  const bwPull = ex.credit_class === 'VPULL' && /pull-up|chin-up/.test(ex.id) && !/assisted|lat-pulldown|band/.test(ex.id);
  if (!hint && /weighted/.test(ex.id) && ['VPULL', 'DIPS', 'HPUSH'].includes(ex.credit_class)) hint = H.weighted;
  if (!hint && (bwPull || /l-sit/.test(ex.id))) hint = H.bodyweight_vertical_pull;
  if (!hint) {
    const h = repHintRange(ex);
    // only a hint clearly below the bracket caps it (eccentric / skill-limited work); a wide hint leaves the bracket alone
    if (h && h[1] < range.min) hint = h;
  }
  if (!hint) return null;
  if (range.min >= hint[0] && range.max <= hint[1]) return null;
  const width = Math.max(2, range.max - range.min);
  if (range.min > hint[1]) return { min: Math.max(hint[0], hint[1] - width), max: hint[1], capped: true };
  if (range.max < hint[0]) return { min: hint[0], max: Math.min(hint[1], hint[0] + width), capped: true };
  let lo = Math.min(Math.max(range.min, hint[0]), hint[1]);
  const hi = Math.max(Math.min(range.max, hint[1]), lo);
  if (hi - lo < 2) lo = Math.max(hint[0], hi - 3); // never a degenerate '8-8' range (review 01 minor 20)
  return { min: lo, max: hi, capped: true };
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
  if (slot.test) applyTest(d, input, rc);
  if (fill && fill.flags && fill.flags.includes('pain_swap')) {
    const w = (fill.why || []).find((x) => x.key === 'why.pain_swap');
    d.notes.push({ key: 'note.pain_swap', args: { area: (w && w.args && w.args.area) || 'other' } });
  }
  if (fill && fill.flags && fill.flags.includes('older_opt_in')) d.notes.push({ key: 'note.older_opt_in' });
  if (slot.origin === 'bonus') d.notes.push({ key: 'note.bonus' });
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
  if (CL && derived.D1_family === 'hybrid_crossfit' && COMPOUND_RC.includes(rc)) {
    const p = blockProgress(week);
    if (slot.role === 'work') {
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
  // heavy single-leg toggle (UNI-04)
  if (rc === 'unilateral_compound' && derived.prefs && derived.prefs.heavy_unilateral && position.is_first_unilateral_lower && cell.heavy_toggle) {
    bracket = cell.heavy_toggle;
    whys.push(why('why.unilateral_reps', 'UNI-04'));
  }
  // lifting style (VOL-12): reps move, weekly sets never change; v1.2: the heavy shift is for the day's first bilateral
  // free-weight compound only (never a single-leg or alternating lift unless heavy_unilateral is on; review 07 major)
  const pref = R.reps.preference[derived.lift_style] || {};
  const firstLift = isFirstMainCompound(day, slot, model);
  const pyr = R.reps.pyramid;
  const pyramidOk = column === 'hypertrophy' && rc === 'main_bilateral_compound' && firstLift && (LEVEL_RANK[lvl] || 1) >= (LEVEL_RANK[pyr.min_level] || 2) &&
    sets >= pyr.when_sets_gte && week.block_type === 'stairway';
  if (pref.big_compound_shift && ['main_bilateral_compound', 'machine_stable_compound'].includes(rc)) {
    bracket = shiftBracket(R, bracket, pref.big_compound_shift); whys.push(why('why.reps_preference', 'VOL-12'));
  }
  let shifted = false;
  const shiftOk = !pref.only_rep_classes || pref.only_rep_classes.includes(rc) || (rc === 'unilateral_compound' && derived.prefs && derived.prefs.heavy_unilateral);
  if (pref.first_lift_of_day_shift && (firstLift || (pref.only_rep_classes && position.is_first_bilateral_compound)) && !pyramidOk && shiftOk && fixedReps === null) {
    bracket = shiftBracket(R, bracket, pref.first_lift_of_day_shift); shifted = true; whys.push(why('why.reps_preference', 'VOL-12'));
  }
  let reps = fixedReps !== null ? { type: perSide ? 'per_side' : 'fixed', ...(perSide ? { min: fixedReps, max: fixedReps } : { value: fixedReps }) } : bracketSpec(R, bracket, perSide);
  // the exercise's own rep ceiling (rep hint): Nordics 3-8, weighted pull-ups / dips 4-8, body-weight pull-ups 5-10 (review 02 / 06 / 07)
  if (reps && reps.min != null) {
    const cap = capToHint(reps, ex, R);
    if (cap) {
      reps = perSide ? { type: 'per_side', min: cap.min, max: cap.max } : { type: 'range', min: cap.min, max: cap.max };
      notes.push({ key: 'note.rep_cap', args: { min: cap.min, max: cap.max } });
      whys.push(why('why.rep_cap', 'VOL-11'));
    }
  }
  if (perSide) { notes.push({ key: 'note.per_side' }); if (!whys.some((w) => w.key === 'why.unilateral_reps')) whys.push(why('why.unilateral_reps', 'UNI-01')); }
  // body-weight pulls: regress (assisted machine, ring / TRX row) when the reps are out of reach (GEN-04, EQ-09; review 01 minor)
  if (ex.credit_class === 'VPULL' && /pull-up|chin-up/.test(ex.id) && !/assisted|weighted/.test(ex.id)) notes.push({ key: 'note.bodyweight_regress' });
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
    if ((maxLast || (slot.role === 'nuance' && derived.D1_family === 'strength')) && stair && !never && M.allowed_rep_classes.includes(rc) && phaseOk && lastOk) {
      effort.last_set = 'max'; whys.push(why('why.max_last', 'VOL-13'));
    }
    // MYO: the day's last machine or isolation exercise (H02, VOL-15); a machine compound qualifies (matrix myo_if_last),
    // free-weight compounds never
    const machineOk = rc === 'machine_stable_compound' && !!cell.myo_if_last;
    const myoOk = stair && (!never || machineOk) && position.is_last_resistance && (ISOLATION_RC.includes(rc) || ex.constraint >= 4) &&
      !R.effort.myo.never_in_block_types.includes(week.block_type) && (week.is_last_stair_week || (at_cap && week.phase === 'HARDEST'));
    if (myoOk) { effort.last_set = 'myo'; whys.push(why('why.myo_last', 'VOL-15')); }
    whys.push(why('why.planned_rir', 'R2-PER-05', { rir: rirArg(effort.min, effort.max) }));
    if (effort.intensifier) whys.push(why('why.intensifier_last_week', 'R2-PER-05'));
  }
  // rest (VOL-14): strength rest for the work lift on a main bilateral compound, any heavy (<= 8) shifted bracket and tests
  let rest;
  const strengthRest = (R.rest.strength_for || []);
  const heavyWork = (strengthRest.includes('work_main_bilateral') && slot.role === 'work' && rc === 'main_bilateral_compound' && reps && reps.max != null && reps.max <= 8) ||
    (strengthRest.includes('reps_max_lte_8_shifted') && shifted && reps && reps.max != null && reps.max <= 8) ||
    (derived.D1_family === 'hybrid_crossfit' && slot.role === 'work');
  if (position.superset_active) rest = { type: 'after_pair' };
  else if (ISOLATION_RC.includes(rc)) rest = { type: 'seconds', min: R.rest.isolation_s[0], max: R.rest.isolation_s[1] };
  else if ((reps && reps.max != null && reps.max <= 6) || heavyWork) rest = { type: 'seconds', min: R.rest.strength_s[0], max: R.rest.strength_s[1] };
  else rest = { type: 'seconds', min: R.rest.hypertrophy_s[0], max: R.rest.hypertrophy_s[1] };
  whys.push(why('why.rest', 'VOL-14'));
  // load: week-1 tip on main compounds of a stairway's first week (R2-GEN-06); never on body-weight lifts (review 04 minor)
  let load = null;
  const bodyweightLift = ex.equipment.any_of.some((su) => su.every((t) => ['pullup_bar', 'dip_bars', 'rings', 'trx', 'floor', 'bench', 'box', 'step_low', 'wall'].includes(t))) && !ex.equipment.any_of.some((su) => su.some((t) => ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine_selectorized', 'machine_plate_loaded', 'hex_bar'].includes(t)));
  if (COMPOUND_RC.includes(rc) && week.block_type === 'stairway' && week.stair_week === 1 && model.bucket(eb).kind === 'resistance' && !bodyweightLift && !slot.test) {
    load = { type: 'week1_tip' };
    notes.push({ key: R.effort.week1_tip_key });
  }
  if (ex.medball) load = medballLoad(ex, derived, R);
  if (ex.tags.includes('fixed_grip') && (derived.pain || []).some((p) => ['shoulder', 'elbow', 'wrist_hand'].includes(p.area))) notes.push({ key: 'note.split_grip' });
  if (slot.bucket === 'ISO_CALF' && slot.calf_index === 1) notes.push({ key: 'note.second_calf_sets', args: { n: sets, total: (position.calf_sets_today || sets) } });
  notes.push(...blockNotes(week, slot));
  return mk({ reps, set_reps: setReps, effort, rest, load, notes, why: whys });
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

/** the week's athletic target and the sets of the stations that feed it (generate passes athletic.stations_sets) */
function reconcileTarget(input, key) {
  const a = input.athletic;
  if (!a || !a.targets || !key) return { target: null, sets: 0 };
  const t = a.targets[key];
  const n = a.stations_sets ? a.stations_sets[key] : 0;
  return { target: typeof t === 'number' ? t : null, sets: n || 0 };
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

function plyoDose(input, eb) {
  const { slot, exercise: ex, sets, week, day, derived, athletic, model } = input;
  const R = model.rules;
  const ath = ex.athletic || {};
  const stage = week.plyo_stage || R.athletic.stages.start_stage;
  // a drill below the week's stage (e.g. a stick-the-landing drill in RC3) keeps its own stage's contacts
  const drillStage = ath.rc_stage_default && RC_RANK[ath.rc_stage_default] < RC_RANK[stage] ? ath.rc_stage_default : stage;
  const ankle = eb === 'AP_JUMP_LIMITED_KNEE' || ex.tags.includes('ankle_hop');
  const range = ankle ? R.reps.matrix.plyo.ankle.contacts_per_set : (R.reps.matrix.plyo[drillStage] || R.reps.matrix.plyo.RC1).contacts_per_set;
  // lower bound in the stage's first week rising to the upper bound in its last week
  let frac = 1;
  const N = stairN(input);
  if (week.stair_week != null && N && drillStage === stage) {
    let rcw = null;
    try { rcw = model.stair(N).rc_weeks[stage]; } catch (e) { rcw = null; }
    if (rcw) frac = rcw[1] > rcw[0] ? clamp((week.stair_week - rcw[0]) / (rcw[1] - rcw[0]), 0, 1) : 1;
  }
  let per = roundHalfUp(range[0] + (range[1] - range[0]) * frac);
  if (isUni(ex)) per *= 2;
  const whys = [why('why.plyo_stage', 'R2-ATH-03', { stage })];
  // v1.2 (D-63 resolved): the dose lands on the sport's weekly target (contacts per set = target / the key's sets this week)
  const quality = ath.quality || 'plyometric';
  const key = budgetKeyOf(eb, quality, 'contacts');
  const rt = reconcileTarget(input, key);
  if (rt.target !== null && rt.sets > 0) { per = perSetFor(model, key, rt.target, rt.sets, per); whys.push(why('why.athletic_reconcile', 'D-63')); }
  const D11 = derived.D11_athletic_budget || {};
  let factor = athletic && athletic.factor != null ? athletic.factor : 1;
  if (!athletic && D11.heavy_play_week) factor = R.athletic.heavy_play_weeks.plyo_factor;
  if (factor !== 1 && rt.target === null) per = Math.max(1, roundHalfUp(per * factor));
  // single-leg and loaded depth work: a few contacts per leg (catalog rep hint; CAT-10 'unilateral is harder'; review 02 major 2)
  const RC = R.athletic.reconcile;
  if (isUni(ex)) {
    const hint = repHintRange(ex);
    const legMax = Math.min(RC && RC.unilateral_contacts_per_leg_max ? RC.unilateral_contacts_per_leg_max : Infinity, hint ? hint[1] : Infinity);
    if (Number.isFinite(legMax) && per > legMax * 2) per = legMax * 2;
  } else if (ex.tags.includes('depth_jump') || ex.tags.includes('loaded_jump')) {
    const hint = repHintRange(ex);
    if (hint && per > hint[1]) per = hint[1];
  }
  // session contact cap (ATH-01): share the cap across the day's contact slots
  const cap = (athletic && athletic.contacts_session_max) || D11.contacts_session_max || null;
  if (cap && sets > 0) {
    const n = day ? daySlots(day).filter((s) => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(s.bucket)).length || 1 : 1;
    const perSlotMax = Math.floor(cap / n);
    if (per * sets > perSlotMax) { per = Math.max(1, Math.floor(perSlotMax / sets)); whys.push(why('why.plyo_stage', 'ATH-01', { stage })); }
  }
  if (input.contact_scale && input.contact_scale < 1) per = Math.max(1, Math.floor(per * input.contact_scale + EPS)); // week-to-week rise cap (generate)
  // the cue follows how the drill is done: a ballistic jump is landed and reset (it cannot be repeated continuously), a
  // repeated-contact drill takes the stage's cue (R2-ATH-02 / R2-ATH-03; review 01 / 02 / 03)
  const cueStage = quality === 'ballistic' || quality === 'landing' ? 'RC1' : (ex.tags.includes('plyo_repeated') ? stage : (stage === 'RC3' ? 'RC2' : stage));
  const notes = [{ key: 'note.' + cueStage.toLowerCase() }];
  if (D11.heavy_play_week) notes.push({ key: 'note.heavy_play_week' });
  if (isUni(ex)) notes.push({ key: 'note.per_side' });
  let load = null;
  if (ath.loaded_jump || ex.tags.includes('loaded_jump')) { load = { type: 'bw_pct', min: R.athletic.loaded_jump_bw_pct[0], max: R.athletic.loaded_jump_bw_pct[1] }; whys.push(why('why.loaded_jump', 'EQ-15')); }
  else {
    const h = boxHeightOf(ex);
    if (h) load = { type: 'height', value: h === 'high' ? 'medium' : h }; // EQ-16 (a 'high' record is never prescribed above medium here)
  }
  const rest = ex.tags.includes('depth_jump') ? { type: 'seconds', min: R.rest.depth_jump_s[0], max: R.rest.depth_jump_s[1] }
    : { type: 'work_rest', min: R.rest.plyo_work_rest[0], max: R.rest.plyo_work_rest[1] };
  return mk({
    reps: { type: 'contacts', value: per }, effort: { type: 'intent', key: R.effort.athletic.key }, rest, load,
    athletic: { unit: 'contacts', per_set: per, total: (sets || 0) * per, stage, quality },
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
  const sided = ex.plane === 'transverse' || ex.laterality === 'unilateral' || ex.laterality === 'alternating' || kind === 'pass_rotation';
  if (kind === 'situp') { reps = { type: 'fixed', value: R.reps.matrix.throw.situp_reps }; per = reps.value; }
  else if (kind === 'wall_ball') { const w = R.reps.matrix.throw.wall_ball_reps; reps = { type: 'range', min: w[0], max: w[1] }; per = w[0]; }
  else {
    per = sided ? R.reps.matrix.throw.reps_per_side * 2 : R.reps.matrix.throw.reps_per_side;
    const rt = reconcileTarget(input, 'throws');
    if (rt.target !== null && rt.sets > 0) { per = perSetFor(model, 'throws', rt.target, rt.sets, per); whys.push(why('why.athletic_reconcile', 'D-63')); }
    if (sided) { const side = Math.max(1, Math.ceil(per / 2 - EPS)); per = side * 2; reps = { type: 'throws_per_side', value: side }; }
    else reps = { type: 'fixed', value: per };
  }
  let load = null;
  if (ex.medball) { load = medballLoad(ex, derived, R); whys.push(why('why.medball_load', 'EQ-06')); }
  return mk({
    reps, effort: { type: 'intent', key: R.effort.athletic.key }, rest: { type: 'seconds', min: R.rest.throw_s[0], max: R.rest.throw_s[1] }, load,
    athletic: { unit: 'throws', per_set: per, total: (sets || 0) * per, stage: null, quality: 'throw' },
    notes: [], why: whys
  });
}

function codSprintDose(input, rc) {
  const { exercise: ex, sets, week, model } = input;
  const R = model.rules;
  const p = stairProgress(week);
  let reps, unit, per;
  const whys = [];
  if (rc === 'cod') {
    const r = R.reps.matrix.cod.reps;
    per = roundHalfUp(r[0] + (r[1] - r[0]) * p);
    const rt = reconcileTarget(input, 'cod_cuts');
    if (rt.target !== null && rt.sets > 0) { per = perSetFor(model, 'cod_cuts', rt.target, rt.sets, per); whys.push(why('why.athletic_reconcile', 'D-63')); }
    reps = { type: 'cuts', value: per }; unit = 'cuts';
  } else {
    // a sprint set is reps x metres; the metres follow the drill (max velocity 20-40 m, accelerations 10-20 m; catalog hint)
    const SP = R.athletic.sprint || { reps: R.reps.matrix.sprint.reps, metres_by_drill: { default: R.reps.matrix.sprint.metres } };
    const drill = ex && /max-velocity|top-speed/.test(ex.id) ? 'max_velocity' : ex && /accel|start/.test(ex.id) ? 'acceleration' : 'default';
    const mr = SP.metres_by_drill[drill] || SP.metres_by_drill.default;
    const m = roundHalfUp(mr[0] + (mr[1] - mr[0]) * p);
    let nReps = roundHalfUp(SP.reps[0] + (SP.reps[1] - SP.reps[0]) * p);
    const rt = reconcileTarget(input, 'sprint_m');
    if (rt.target !== null && rt.sets > 0) { const perSet = perSetFor(model, 'sprint_m', rt.target, rt.sets, nReps * m); nReps = clamp(roundHalfUp(perSet / m), SP.reps[0], SP.reps[1]); whys.push(why('why.athletic_reconcile', 'D-63')); }
    per = nReps * m;
    reps = { type: 'sprint_reps', reps: nReps, metres: m }; unit = 'metres';
  }
  return mk({
    reps, effort: { type: 'intent', key: R.effort.athletic.key }, rest: { type: 'as_prescribed' }, // R.rest.athletic
    athletic: { unit, per_set: per, total: (sets || 0) * per, stage: null, quality: (ex && ex.athletic && ex.athletic.quality) || rc },
    notes: [], why: whys
  });
}

function prehabDose(input) {
  const { slot, exercise: ex, model } = input;
  const R = model.rules;
  const code = prehabCode(slot) || slot.prehab_code || null;
  const notes = code ? [{ key: model.has('en', 'prehab.label.' + code) ? 'prehab.label.' + code : 'note.prehab', args: { code } }] : [];
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
  return mk({
    reps, effort: { type: 'intent', key: 'effort.prehab' }, rest: { type: 'seconds', min: R.rest.prehab_s[0], max: R.rest.prehab_s[1] },
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
    if (/copenhagen/.test(ex.id) && R.reps.core_hold_seconds && R.reps.core_hold_seconds.copenhagen_L1_L2 && lvl !== 'L3') sec = R.reps.core_hold_seconds.copenhagen_L1_L2;
    reps = { type: 'seconds', min: sec[0], max: sec[1] };
  } else if (cell.bracket) reps = bracketSpec(R, cell.bracket, isUni(ex));
  else reps = bracketSpec(R, 'b10_15', isUni(ex));
  let effort;
  if (iso && R.effort.hold_key) effort = { type: 'intent', key: R.effort.hold_key };
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
    reps, effort, rest: input.position && input.position.superset_active ? { type: 'after_pair' } : { type: 'seconds', min: R.rest.core_s[0], max: R.rest.core_s[1] },
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
  // no superset partner (generate drops the pair), the same lift in the baseline and the end week
  d.notes = d.notes.filter((n) => n.key !== R.effort.week1_tip_key && n.key !== 'note.per_side');
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
export function doseAerobic(slot, weekShape, derived, model) {
  const R = model.rules;
  const colour = weekShape && weekShape.block_type === 'recovery' ? 'C' : ((slot.aerobic && slot.aerobic.colour) || R.conditioning.extra_colour);
  let [min, max] = R.conditioning.minutes[colour];
  if (colour === 'C') max = Math.min(max, R.conditioning.steady_max_min);
  const notes = [{ key: 'note.any_erg' }];
  if (slot.aerobic && slot.aerobic.position === 'open_day') notes.push({ key: 'note.fighter_aerobic_open' });
  if (slot.aerobic && slot.aerobic.position === 'separate_session') notes.push({ key: 'note.aerobic_separate' });
  if (slot.aerobic && slot.aerobic.required && R.conditioning.required_on_optional_note) notes.push({ key: R.conditioning.required_on_optional_note });
  const D14 = derived.D14_aerobic_sessions || {};
  if (D14.replaced_by_activity > 0) notes.push({ key: 'note.play_counts_aerobic', args: { activity: ((derived.D2_profile && derived.D2_profile.activity_ids) || [])[0] || (derived.D2_profile && derived.D2_profile.id) || '' } });
  const whys = [why('why.aerobic_colour', 'R2-SES-06')];
  if (slot.test) {
    const tn = [...notes, { key: 'note.test_day_session' }];   // an aerobic test replaces the session, not "top sets"
    const tw = [...whys, why('why.test_timing', 'R2-PER-07')];
    if (weekShape && weekShape.test && weekShape.test.from_zero && isSafeFromZeroTest(slot.test, R)) { tn.push({ key: 'note.test_from_zero', args: { test: 'tests.' + slot.test } }); tw.push(why('why.test_from_zero', 'R2-PER-07')); }
    return mk({ reps: { type: 'test', test: slot.test }, effort: { type: 'aerobic', colour }, notes: tn, why: tw });
  }
  return mk({ reps: { type: 'minutes', min, max }, effort: { type: 'aerobic', colour }, notes, why: whys });
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
    const range = wodOnly ? W.wod_only_day_minutes : (slot.wod_short && W.short_minutes ? W.short_minutes : W.minutes);
    const m = roundHalfUp(range[0] + (range[1] - range[0]) * p);
    const format = W.formats[(slot.day_index || 0) % W.formats.length];
    const all = ((fill && fill.stations) || [fill && fill.exercise_id]).filter(Boolean);
    const n = m < 15 ? W.stations[0] : W.stations[1];
    const stations = all.slice(0, n);
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
      const v = Math.max(3, roundHalfUp((row[format] || row.amrap || 10) * scaleL));
      return g === 'erg' ? { type: 'calories', n: v } : g === 'carry' ? { type: 'metres', value: v } : { type: 'fixed', value: v };
    });
    const rounds = format === 'for_time' && W.for_time_rounds ? W.for_time_rounds[lvl === 'L1' ? 0 : 1] : null;
    return mk({ reps: { type: 'minutes', min: m, max: m }, effort: { type: 'intent', key: 'effort.wod' }, load,
      wod: { format, minutes: [m, m], stations, station_reps, rounds }, notes, why: [why('why.wod', 'D-20')] });
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
    if (!metabolic && week.stair_week === 1 && week.block_type === 'stairway') notes.push({ key: R.effort.week1_tip_key });
    return mk({
      reps: { type: 'rounds_work', rounds, work_s: circ.work_s }, effort: { type: 'intent', key: ekey },
      rest: { type: 'circuit', transition_s: bc.transition_s, between_rounds_s: bc.between_rounds_s }, load,
      circuit: { rounds, work_s: circ.work_s, transition_s: bc.transition_s }, notes,
      why: [why('why.circuit_stairway', 'D-19', { from: bc.stairway.work_s_start, to: bc.stairway.work_s_max })]
    });
  }
  if (slot.bucket === 'COND_CIRCUIT') { // finisher outside the bootcamp format (PRG-11)
    const cf = R.conditioning.circuit_finisher;
    const rounds = roundHalfUp(cf.rounds[0] + (cf.rounds[1] - cf.rounds[0]) * p);
    const work = Math.round((cf.work_s[0] + (cf.work_s[1] - cf.work_s[0]) * p) / 5) * 5;
    return mk({ reps: { type: 'rounds_work', rounds, work_s: work }, effort: { type: 'intent', key: 'effort.circuit' },
      rest: { type: 'as_prescribed' }, circuit: { rounds, work_s: work, transition_s: R.supersets.bootcamp.transition_s }, notes: [], why: [] });
  }
  if (slot.bucket === 'COND_SPRINT_BUYOUT') {
    // the coach's buy-out (BASEBALL Part E): 1-3 all-out bouts of 10-20 calories or 15-30 s runs (review 02 major 1)
    const BP = R.conditioning.buyout_pool || {};
    const cal = ex && /calorie|cal-/.test(ex.id);
    const sec = BP.seconds || [15, 30];
    const reps = cal ? { type: 'bout' } : { type: 'seconds', min: sec[0], max: sec[1] };
    return mk({ reps, effort: { type: 'intent', key: 'effort.circuit_metabolic' }, rest: { type: 'as_prescribed' }, notes: [{ key: 'note.buyout' }], why: [why('why.buyout', 'OBSERVED BASEBALL Part E')] });
  }
  if (input) return doseItem({ ...input, slot: { ...slot, block: slot.block === 'circuit' ? 'strength' : slot.block } });
  return mk({});
}
