// tools/fixture/v05-structure.mjs - engine 0.5.0, work package V1 (structure and volume). Applied after fix-r2-f3.mjs by BOTH
// builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source: COACH-R4
// (coach_answers_round4.md), COACH-CT (coach_answers_time_2026-10-10.md), COACH-CX (coach_answers_codex_2026-10-10.md), an earlier
// coach answer, OBSERVED (his sheets, dumps/BYOP), INFERRED or PROPOSED. Binding plan: design/ENGINE_V05_PLAN.md.
//
// What V1 changes in the model (engine/DECISIONS.md section G "v0.5"):
//   * NO TIME-FITTING (COACH-CT CT-01, COACH-R4 R4-SES-01). Session minutes are not an input and not a constraint. Every rule that
//     sized, cut or judged a plan by minutes is deleted: rules.session.exercise_cap_by_minutes / minutes_default / minutes_allowed /
//     minutes_over_90_competitive_only / long_day / time_fit, rules.cut_order (the time cut chains), rules.stairway.capacity / track /
//     release / release_rounding / hold_rules / min_climb and the 7 % / 10 % limits, rules.volume.pattern_keep / per_session,
//     rules.placement (the v0.4 bank / entry / reduction machinery), station fields include_from_minutes / superset_below_minutes.
//     rules.time_model stays as an ESTIMATE (information only, 'use: estimate_only').
//   * SESSIONS ARE SIZED BY EXERCISE COUNT (R4-SES-02): rules.session.size. Every counted station carries a `rank`; a day holds the
//     stations whose rank is within the day's count (the template's own size inside the client type's range). Nothing is dropped
//     automatically (R4-SES-04): the template comes out complete and rules.session.easy_to_remove names what is easiest to remove.
//   * THE COACH'S TEMPLATES ARE THE SKELETON (R4-SES-05): the A / B full-body days (A = pull + knee dominant, B = push + hip
//     dominant) slot for slot, his push / pull / legs days (OBSERVED BYOP 'PUSHPULLLEGS'), his 3-day builder's third day (OBSERVED
//     BYOP '3 DAY BUILDER'), his athletic days (athletic block, then the same A / B lifts; OBSERVED BYOP 'ATHLETIC - FULL BODY') and
//     the optional days of his general-population sheet (OBSERVED BYOP 'BOOTCAMP - OPTION 1' Wednesday / Saturday blocks).
//   * THE 2-DAY RULE (R4-SES-03): rules.volume.two_day - every big group is trained at about 6-8 weekly sets, the floor of 10
//     applies from 3 training days (rules.volume.floor.applies_from_days).
//   * PROGRESSION (COACH-CX CX-01..03, R4-PRG-01 / 02 / 04): rules.stairway.progression (engine/progression is the kernel: the final
//     target is reached, arrival in the last week, a note above about 15 %), rules.cycles.next_block (about 5 % above the last
//     start, whole sets, never above the level's top).
//   * ALLOCATION (ENGINE_V05_PLAN "How volume is allocated"): rules.placement - groups, 2-5 sets an exercise (2-4 for L1), first
//     exercise first, the two exposures of a day type alternate, the bonus exercise on the optional day.

const clone = (o) => JSON.parse(JSON.stringify(o));

// ---------------------------------------------------------------------------------------------------------------------------
// rules
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * v0.5 / V1 rule amendments (after amendRulesR2F3).
 * @param {object} rules @returns {object}
 */
export function amendRulesV05(rules) {
  const R = clone(rules);
  const S = R.session;

  // ---- session size by exercise count (R4-SES-02; counts exclude the warm-up and the 2 core exercises)
  S.size = {
    by_type: {
      general: { range: [5, 7], default: 7, refs: ['R4-SES-02', 'VOL-08'] },        // general fitness / fat loss ("you can probably go from 5 to 7"; VOL-08 "it's usually 7")
      aesthetics: { range: [6, 8], default: 7, refs: ['R4-SES-02', 'R4-SES-05'] },  // aesthetics / bodybuilding (his A / B sheet: 7 rows a day)
      strength: { range: [5, 6], default: 6, refs: ['R4-SES-02'] },
      bootcamp: { range: [5, 7], default: 7, refs: ['R4-SES-02', 'PRG-03'] },       // stations
      athletic: { range: [6, 12], default: 12, refs: ['R4-SES-02', 'VOL-08', 'R2-SES-04'] }, // field athletes, off-season: up to 12 (jumps / throws + Olympic + lifts)
      stay_active: { range: [5, 8], default: 8, refs: ['R4-SES-02', 'R2-ATH-04'], status: 'PROPOSED (V1, G-07): one jump or throw station + one light power piece + the lifts; the coach gave no number for the non-competitive athletic adult' },
      class: { range: [5, 7], default: 7, refs: ['R4-SES-02', 'OT18'], status: 'PROPOSED (V1, G-07): the CrossFit-style class takes the general-population count; the WOD and the skill are outside the count' },
      older: { range: [5, 6], default: 6, refs: ['R4-SES-02'] }                     // older adults 60+ (the range wins over every other type)
    },
    by_family: { aesthetics: 'aesthetics', strength: 'strength', athletic: 'athletic', fat_loss_bootcamp: 'general', hybrid_crossfit: 'class', no_equipment: 'general' },
    circuit_type: 'bootcamp',
    finisher_types: ['athletic', 'class'],
    stay_active_type: 'stay_active',
    older_type: 'older',
    counts: 'exercises of a session, not counting the warm-up, the 2 core exercises, joint care, skill practice, conditioning, cardio, the cool-down or tests (rules.session.outside_cap_blocks)',
    recommendation_only: true,
    refs: ['R4-SES-02', 'CT-01', 'R4-SES-01'],
    status: 'approved (R4-SES-02): recommendations in a template; the user adds or removes'
  };
  // ---- nothing is dropped automatically (R4-SES-04): what the plan names as easiest to remove, in order; what always stays
  S.easy_to_remove = {
    order: ['conditioning_finisher', 'extra_athletic_station', 'small_muscle_accessory', 'bonus_exercise'],
    always_keep: ['core_block', 'work', 'paired_upper', 'first_athletic_station'],
    automatic: false,
    refs: ['R4-SES-04'],
    status: 'approved (R4-SES-04): the person picks what to keep or take away; the plan only names the easiest'
  };
  // the class model's work lifts (was rules.session.time_fit.keep_work_lift): the class's strength piece is the day's work lift
  S.class_lift = { families: ['hybrid_crossfit'], roles: ['work'], refs: ['OT18', 'ORD-07'] };
  delete S.exercise_cap_by_minutes; delete S.exercise_cap_applies_to; delete S.minutes_default; delete S.minutes_allowed;
  delete S.minutes_over_90_competitive_only; delete S.long_day; delete S.time_fit; delete S.athlete_cap_hard;
  delete S.default_sets.athletic_at_90;
  S.full_body_days = { rule: 'a full-body day is the coach\'s A day (pull + knee dominant) or B day (push + hip dominant): about 6 exercises, up to 8 (R4-SES-05)', refs: ['R4-SES-05', 'R4-SES-02'] };
  // 2-4 exercises per group per day holds on SPLIT days (push / pull / legs); on the full-body A / B days a group has the
  // exercises the coach's template gives it (R4-SES-05 supersedes the round-2 reading for full-body days)
  S.exercises_per_group = { ...S.exercises_per_group, full_body_day: [1, 4], full_body_refs: ['R4-SES-05'], r4_status: 'R4-SES-05: full-body days follow the A / B template (about 6 exercises); split days keep 2-4 per group' };
  S.refs = [...new Set([...(S.refs || []), 'CT-01', 'R4-SES-01', 'R4-SES-02', 'R4-SES-04', 'R4-SES-05'])];

  // ---- the time model is an estimate, never a limit (CT-01)
  R.time_model = { ...R.time_model, use: 'estimate_only', status: 'information only (COACH-CT CT-01, R4-SES-01): an average estimate per day; nothing is ever cut, reshaped or flagged because of it; numbers PROPOSED' };
  delete R.time_model.skill_in_warmup_short;
  // the short WOD (10-15 min) was the cut step of an over-time class day: gone with the time fitting
  if (R.conditioning && R.conditioning.wod) delete R.conditioning.wod.short_minutes;
  delete R.cut_order;

  // ---- volume: the floor from 3 training days, the 2-day rule, one target per group
  const V = R.volume;
  V.floor = { ...V.floor, applies_from_days: 3, counted_on: 'all_days', exempt: (V.floor.exempt || []).filter(x => x !== 'not_trained_directly_time'),
    r4_status: 'floor of 10 weekly sets per trained group when there are 3 or more training days (ENGINE_V05_PLAN; R4-SES-03 for 2 days)' };
  V.two_day = {
    days_max: 2, weekly_sets: [6, 8], big_classes: ['big'], suggest_days: 3,
    never: ['drop_whole_muscle_groups', 'pile_on_more_exercises'],
    refs: ['R4-SES-03'],
    status: 'approved (R4-SES-03): every big muscle group is trained at about 6-8 weekly sets, the plan says so and suggests a third day'
  };
  // every plan runs ONE weekly target per group (hips = glutes + hamstrings; ENGINE_V05_PLAN allocation step 1; R3-SES-01)
  if (V.one_target_groups) V.one_target_groups = { ...V.one_target_groups, modifiers: Object.keys(V.modifiers).sort(), v05: 'every modifier (V1): the stairway runs on groups' };
  delete V.pattern_keep; delete V.per_session;
  V.calves = { ...V.calves, optional_slot_sets: [2, 3], per_leg_day_fixed: true,
    v05_status: 'V1: one calf exercise x 3 sets on a leg day with a calves slot (VOL-17, R3-SES-01); the optional-day Calves slots (OBSERVED BYOP optional days) carry the rest; no 4th set is squeezed into a leg day' };
  delete V.calves.second_station_sets; delete V.calves.second_station;

  // ---- the stairway: the kernel is engine/progression (CX-01..03, R4-PRG-01 / 02)
  const ST = R.stairway;
  ST.progression = {
    kernel: 'engine/progression/stairway.mjs',
    target_reached: true,
    rounding: 'arrival',
    arrival_weeks_early: 0,
    arrival_weeks_early_max: 1,
    note_above: 0.15,
    note_min_whole_sets: 2,
    flat_weeks_ok: true,
    numerics: { logTolerance: 1e-12, maxIterations: 200, maxBracketDoublings: 80 },
    refs: ['CX-01', 'CX-02', 'CX-03', 'R4-PRG-01', 'R4-PRG-02', 'R3-VOL-04'],
    status: 'approved: the final target is reached, faster steps allowed (CX-01); reached in the last week, one week early at most (R4-PRG-01); a note when a week adds more than about 15 % (R4-PRG-02); the same sets may hold while reps or load progress (CX-02 / CX-03). PROPOSED detail: a single whole set is never noted (note_min_whole_sets 2) - it is the smallest step a group can take'
  };
  ST.limits = { pain_after_freeze: ST.limits.pain_after_freeze, note: 'v0.5: no rate limit (CX-01, R4-PRG-02); a pain area keeps its slow steps (VOL-03)' };
  delete ST.lambda; delete ST.capacity; delete ST.track; delete ST.release; delete ST.release_rounding; delete ST.hold_rules; delete ST.min_climb;
  ST.principle = 'every training block climbs like a stairway: small steps to the halfway week, slightly bigger after it, the hardest weeks last; the planned final sets are reached in the last week';
  ST.refs = [...new Set([...(ST.refs || []), 'CX-01', 'CX-02', 'CX-03', 'R4-PRG-01', 'R4-PRG-02'])];

  // ---- the next block (R4-PRG-04)
  R.cycles = {
    start_multiplier: R.cycles.start_multiplier, rounding: 'half_up',
    next_block: { multiplier: { numerator: 105, denominator: 100 }, min_whole_sets: 1, never_above_top: true, at_top: 'sets_stay_load_and_reps_progress',
      refs: ['R4-PRG-04', 'CX-03'], status: 'approved (R4-PRG-04): about 5 % above the last block\'s start, whole sets, never above the level\'s top; PROPOSED detail: at least one whole set while below the top' },
    same_start_if: R.cycles.same_start_if,
    refs: ['R4-PRG-04', 'R2-VOL-06']
  };

  // ---- placement = the plan's "How volume is allocated"
  const P0 = R.placement;
  R.placement = {
    on: 'groups',
    order_rule: 'first_below_first',
    day_rotation: 'alternate_same_day_type',
    min_sets: 2,
    max_sets_per_exercise: P0.max_sets_per_exercise,
    laterality_tolerance: P0.laterality_tolerance,
    bonus: { sets: [2, 3], where: 'optional_day', max_added_per_optional_day: 2, order: ['hips', 'quads', 'back', 'chest', 'shoulders', 'triceps', 'biceps'],
      no_optional_day: 'cap_and_say_so', refs: ['R3-VOL-03', 'ORD-10', 'ORD-11'], status: 'allocation step 3 (ENGINE_V05_PLAN); the 2 added exercises a day and the order are PROPOSED' },
    optional_focus: { slots: 2, sets: [2, 3], refs: ['ORD-10', 'ORD-11'] },
    refs: ['VOL-07', 'R3-VOL-03', 'VOL-16', 'ORD-10', 'ORD-11'],
    status: 'ENGINE_V05_PLAN "How volume is allocated": 1 weekly sets per group from the stairway; 2 split over the template slots that train the group, first exercise first, the exposures of a day type alternating; 3 2-5 sets an exercise (2-4 for L1), then the bonus exercise on the optional day, else capped and said; 4 credits recomputed from the actual exercises'
  };

  // ---- timed circuits: rounds by level instead of by minutes (PRG-03 "3 to 5 rounds"; PROPOSED)
  const BC = R.supersets.bootcamp;
  BC.stairway = { ...BC.stairway, rounds_by_level: { L1: 3, L2: 4, L3: 5 }, rounds_status: 'PROPOSED (V1, G-09): 3 / 4 / 5 rounds by level (PRG-03 "3 to 5 rounds"); was by session minutes' };
  delete BC.stairway.rounds_max_by_minutes; delete BC.session_min;
  BC.stations = [3, 6];
  // the day's two core exercises may always be paired; "when over time" is gone with the time check
  if (R.supersets.core_supersets_optional) delete R.supersets.core_supersets_optional.when_over_time;

  // ---- supersets: a recommendation the person switches on; no session length triggers them (CT-01; R3-SES-02 'I recommend')
  if (R.supersets) {
    if (R.supersets.triggers) delete R.supersets.triggers.short_session;
    if (R.supersets.recommend) { R.supersets.recommend.on_when = 'person_choice'; R.supersets.recommend.refs = [...new Set([...(R.supersets.recommend.refs || []), 'CT-01'])]; }
  }

  // ---- validation: the checks that read the retired time fitting now read the v0.5 rules (engine/validate.mjs)
  for (const c of (R.validation && R.validation.checks) || []) {
    if (c.id === 'V3') { c.severity = 'error'; c.v05 = 'no time fitting in the plan: no session length, no minute limit, no time check, no time offers (CT-01, R4-SES-01)'; }
    if (c.id === 'V13') c.v05 = 'session size by exercise count: a generated day holds at most the range maximum (R4-SES-02); the minutes are an estimate';
    if (c.id === 'V15') c.v05 = 'every trained group reaches its final sets in the last week, at most one week early, and never sits under its weekly schedule (CX-01, R4-PRG-01)';
    if (c.id === 'V22') c.v05 = 'floor of 10 from 3 training days, counted on all days; on 2 days every big group at 6 or more (R4-SES-03); a group the template cannot hold is said';
    if (c.id === 'V23') c.v05 = '1-4 exercises per muscle group on a full-body day (R4-SES-05: the template gives each group its exercises)';
  }

  return R;
}

// ---------------------------------------------------------------------------------------------------------------------------
// templates
// ---------------------------------------------------------------------------------------------------------------------------

const OUTSIDE_COUNT = ['warmup', 'core', 'skill', 'prehab', 'conditioning', 'aerobic', 'cooldown', 'test'];
const isCounted = (st) => !OUTSIDE_COUNT.includes(st.block);
/** rank of a template extra: a station outside the default session (no count reaches it); engine/week.mjs keepStation */
export const EXTRA_RANK = 99;
// the session length v0.4 assumed per family (rules.session.minutes_default, retired): only used here, once, to tell a template's
// base stations from the ones it added to a longer session
const USUAL_MINUTES_V04 = { athletic: 90, aesthetics: 90, strength: 90, hybrid_crossfit: 60, fat_loss_bootcamp: 45, no_equipment: 60 };
// the 2 core exercises (core block rule) and the sprint buy-out (rules.session.size.finisher_types decides) are never extras
const ALWAYS_IN_BUCKETS = ['CT_CORE_THORAX', 'CP_CORE_PELVIS', 'CORE_ANY', 'COND_SPRINT_BUYOUT'];
const ATH_BUCKETS = ['AP_SPRINT', 'AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW', 'AP_COD', 'AP_TRIPLE_EXT'];

// the coach's lift skeletons (R4-SES-05). [bucket, role, pair, extras]
const A_LIFTS = [
  ['RP_HPULL', 'paired_upper', 'P1', { note: 'slot 1: horizontal pull, both arms (R4-SES-05)' }],
  ['RP_BKD', 'work', 'P1', { note: 'slot 2: two-leg knee-dominant lift - a squat (R4-SES-05)' }],
  ['RP_VPULL', 'paired_upper', 'P2', { note: 'slot 3: vertical pull, like a lat pulldown (R4-SES-05)' }],
  ['RP_UKD', 'secondary', 'P2', { note: 'slot 4: single-leg knee-dominant lift, like a lunge (R4-SES-05)' }],
  ['ISO_BICEP', 'iso', null, { note: 'slot 5: biceps curl (R4-SES-05)' }],
  ['ISO_QUAD', 'iso', null, { note: 'slot 6: leg extension (R4-SES-05)' }]
];
const B_LIFTS = [
  ['RP_HPUSH', 'paired_upper', 'P1', { note: 'slot 1: horizontal push, like a bench press or machine chest press (R4-SES-05)' }],
  ['RP_BHD', 'work', 'P1', { note: 'slot 2: two-leg hip-dominant lift - a deadlift, a hip extension or a hip thrust (R4-SES-05)' }],
  ['RP_VPUSH', 'paired_upper', 'P2', { variant_text: 'vertical push or incline press', note: 'slot 3: vertical push, like a shoulder press, or an incline press - "more vertical than horizontal" (R4-SES-05); incline is preferred for bodybuilders and the general population (R4-LIB-03)' }],
  ['RP_UHD', 'secondary', 'P2', { note: 'slot 4: single-leg hip-dominant lift, like a staggered-stance deadlift, a single-leg hip extension or a glute bridge (R4-SES-05)' }],
  ['ISO_TRICEP', 'iso', null, { note: 'slot 5: triceps extension (R4-SES-05)' }],
  ['ISO_LEG_FLEXION', 'iso', null, { note: 'slot 6: leg curl (R4-SES-05)' }]
];
const CALF = ['ISO_CALF', 'iso', null, { note: 'calves: one exercise x 3 sets on the leg day (VOL-17; OBSERVED BYOP A day)' }];
const SIDE = ['ISO_SIDE_REAR_DELT', 'iso', null, { variant: 'side', variant_text: 'side', note: 'shoulders: the side raise of the B day (OBSERVED BYOP \'Shoulders/Traps - ABdution\')' }];
const REAR = ['ISO_SIDE_REAR_DELT', 'iso', null, { variant: 'rear', variant_text: 'rear', note: 'the 8th exercise: a small-muscle exercise at the end (R4-SES-05) - the week\'s rear-delt exercise on the pull day' }];
// gym A / B days: 6 + the 7th of his sheets; the 8th only where the count reaches 8
const GYM_A = [...A_LIFTS, CALF, REAR];
const GYM_B = [...B_LIFTS, SIDE, CALF];
// his 3-day builder's third day (OBSERVED BYOP '3 DAY BUILDER' day 3: squat, hinge, row, press, lunge), upper first like the A / B
// days, then one fly and one curl so chest and arms are trained twice a week (PROPOSED fill of slots 6-7)
const GYM_C = [
  ['RP_HPULL', 'paired_upper', 'P1', { note: 'day 3: horizontal pull (OBSERVED BYOP 3 DAY BUILDER)' }],
  ['RP_BKD', 'work', 'P1', { note: 'day 3: two-leg knee-dominant lift (OBSERVED BYOP 3 DAY BUILDER)' }],
  ['RP_HPUSH', 'paired_upper', 'P2', { note: 'day 3: horizontal push (OBSERVED BYOP 3 DAY BUILDER)' }],
  ['RP_BHD', 'secondary', 'P2', { note: 'day 3: two-leg hip-dominant lift (OBSERVED BYOP 3 DAY BUILDER)' }],
  ['RP_UKD', 'secondary', null, { note: 'day 3: single-leg knee-dominant lift (OBSERVED BYOP 3 DAY BUILDER)' }],
  ['ISO_CHEST', 'iso', null, { note: 'day 3 slot 6: chest a second time in the week (PROPOSED, V1 G-05)' }],
  ['ISO_TRICEP', 'iso', null, { note: 'day 3 slot 7: a small-muscle exercise at the end (R4-SES-05; PROPOSED pick)' }],
  ['ISO_BICEP', 'iso', null, { note: 'day 3 slot 8 (PROPOSED pick)' }]
];
// his athletic days: the athletic block, then the same A / B lifts (OBSERVED BYOP 'ATHLETIC - FULL BODY - 4 DAYS': A = quads, back,
// quads / glutes, back, leg extension; B = hamstring, chest, hamstring / glutes, chest / shoulders, leg curl, side raise)
// (no arm isolation: his athletic sheet has none - field athletes' arms are helper work, R3-VOL-01; the leg day's calf exercise
// stays, VOL-17 / R3-SES-01, ranked after the athletic block's stations)
const ATH_A = [A_LIFTS[0], A_LIFTS[1], A_LIFTS[2], A_LIFTS[3], A_LIFTS[5], CALF];
const ATH_B = [B_LIFTS[0], B_LIFTS[1], B_LIFTS[2], B_LIFTS[3], B_LIFTS[5], SIDE, CALF];
// the third day of a 3-day athletic week: like his 3-day builder's day 3 (squat / hinge / row / press / lunge) on the heavy-hinge
// day - hip + push, knee + pull, then the second pull (PROPOSED fill; the week then trains every big group twice)
const ATH_C = [
  ['RP_HPUSH', 'paired_upper', 'P1', { note: 'day 3: horizontal push with the hinge (hip + push; OBSERVED BYOP 3 DAY BUILDER day 3)' }],
  ['RP_BHD', 'work', 'P1', { note: 'day 3: two-leg hip-dominant lift (OBSERVED BYOP 3 DAY BUILDER day 3)' }],
  ['RP_HPULL', 'paired_upper', 'P2', { note: 'day 3: horizontal pull with the single-leg squat (knee + pull)' }],
  ['RP_UKD', 'secondary', 'P2', { note: 'day 3: single-leg knee-dominant lift (OBSERVED BYOP 3 DAY BUILDER day 3)' }],
  ['RP_VPULL', 'secondary', null, { note: 'day 3: vertical pull (PROPOSED, V1 G-05: back twice a week)' }],
  CALF
];
// his push / pull / legs days (OBSERVED BYOP 'PUSHPULLLEGS - 3 or 6 DAYS A WK'), slot for slot
const PPL_PUSH = [
  ['RP_HPUSH', 'work', null, { note: 'Chest - Horizontal Push (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_VPUSH', 'secondary', null, { note: 'Chest / Shoulders - Vertical Push (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_HPUSH', 'secondary', null, { variant_text: 'incline', note: 'Chest - Incline (OBSERVED BYOP PUSHPULLLEGS)', tokens: 'incline' }],
  ['ISO_CHEST', 'iso', null, { note: 'Chest - Flies (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_HPUSH', 'secondary', null, { group: 'triceps', variant_text: 'dips', note: 'Chest - Dips (OBSERVED BYOP PUSHPULLLEGS); dips credit 0.5 triceps / 0.5 chest (LIB-16)' }],
  ['ISO_TRICEP', 'iso', null, { variant_text: 'push-down', note: 'Tricep - Push (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_TRICEP', 'iso', null, { variant_text: 'overhead', note: 'Tricep - Overhead (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_SIDE_REAR_DELT', 'iso', null, { variant: 'side', variant_text: 'side', note: 'the 8th exercise: a small-muscle exercise at the end (R4-SES-05)' }]
];
const PPL_PULL = [
  ['RP_HPULL', 'work', null, { note: 'Back - Horizontal Pull (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_HPULL', 'secondary', null, { note: 'Back - Horizontal Pull 2 (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_VPULL', 'secondary', null, { note: 'Back - Vertical Pull (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_SIDE_REAR_DELT', 'iso', null, { variant: 'side', variant_text: 'side', note: 'Shoulders / Traps - ABdution (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_SIDE_REAR_DELT', 'iso', null, { variant: 'rear', variant_text: 'rear', note: 'Shoulders / Traps - Reverse Flies (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_BICEP', 'iso', null, { note: 'Bicep 1 (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_BICEP', 'iso', null, { note: 'Bicep 2 (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_VPULL', 'secondary', null, { note: 'the 8th exercise (R4-SES-05; PROPOSED pick: a second vertical pull)' }]
];
const pplLegs = (work) => [
  work === 'knee' ? ['RP_BKD', 'work', null, { note: 'Quads - Bilateral KD (OBSERVED BYOP PUSHPULLLEGS)' }] : ['RP_BHD', 'work', null, { note: 'Hamstring - Bilateral HD (OBSERVED BYOP PUSHPULLLEGS)' }],
  work === 'knee' ? ['RP_BHD', 'secondary', null, { note: 'Hamstring - Bilateral HD (OBSERVED BYOP PUSHPULLLEGS)' }] : ['RP_BKD', 'secondary', null, { note: 'Quads - Bilateral KD (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_UKD', 'secondary', null, { note: 'Quads / Glutes - Unilateral KD (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_QUAD', 'iso', null, { note: 'Quads - Leg Extensions (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_LEG_FLEXION', 'iso', null, { note: 'Hamstrings - Leg Curls (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['RP_UHD', 'secondary', null, { note: 'Hamstring / Glutes - Unilateral HD (OBSERVED BYOP PUSHPULLLEGS)' }],
  ['ISO_CALF', 'iso', null, { note: 'calves: one exercise x 3 sets on the leg day (VOL-17)' }],
  ['FOCUS', 'focus', null, { note: 'Focus 1 (OBSERVED BYOP PUSHPULLLEGS legs day)' }]
];

const GROUP_OF = { RP_BKD: 'quads', RP_UKD: 'quads', ISO_QUAD: 'quads', RP_BHD: 'hips', RP_UHD: 'hips', ISO_LEG_FLEXION: 'hips', RP_HPULL: 'back', RP_VPULL: 'back',
  RP_HPUSH: 'chest', ISO_CHEST: 'chest', RP_VPUSH: 'shoulders', ISO_SIDE_REAR_DELT: 'shoulders', ISO_BICEP: 'biceps', ISO_TRICEP: 'triceps', ISO_CALF: 'calves' };
const BLOCK_OF = (bucket) => (/^RP_/.test(bucket) ? 'strength' : 'accessories');

/** every station of every day type of every template and variant */
function eachDayType(F, fn) {
  for (const [fam, f] of Object.entries(F)) for (const [d, t] of Object.entries(f.days || {})) {
    for (const [name, def] of Object.entries(t.day_types || {})) fn(def, { fam, days: d, variant: null, name, template: t });
    for (const [vn, v] of Object.entries(t.variants || {})) for (const [name, def] of Object.entries((v && v.day_types) || {})) fn(def, { fam, days: d, variant: vn, name, template: t, variantDef: v });
  }
}

/** a prototype station of a bucket (+ variant): the day's own first, then any day of the same template, then any template */
function protoFinder(F) {
  const all = [];
  eachDayType(F, (def, at) => { for (const st of def.stations || []) all.push({ st, at }); });
  return (bucket, variant, own, at) => {
    const ok = (st) => st.bucket === bucket && (variant ? st.variant === variant : true);
    const hit = (own || []).find(ok) || (all.find(x => x.at.fam === at.fam && x.at.days === at.days && ok(x.st)) || {}).st || (all.find(x => ok(x.st)) || {}).st || null;
    return hit ? clone(hit) : null;
  };
}

/**
 * Rebuild one day type from the coach's skeleton: the day's own warm-up and core stations (both core exercises, always), its
 * athletic / power / skill stations when `keepAthletic`, the lifts of `spec` in order, then its conditioning and aerobic stations.
 * Stations of the old day that the skeleton does not name leave the template. Counted stations get rank 1 ... n.
 */
function rebuildDay(def, spec, find, at, opts = {}) {
  const old = def.stations || [];
  const used = new Set();
  const take = (pred) => old.filter(pred).map(clone);
  const warm = take(s => s.block === 'warmup');
  let core = take(s => s.block === 'core');
  if (core.length < 2 && def.kind === 'main') {
    const want = ['CT_CORE_THORAX', 'CP_CORE_PELVIS'].filter(b => !core.some(s => s.bucket === b));
    for (const b of want.slice(0, 2 - core.length)) { const p = find(b, null, [], at); if (p) core.push(p); }
  }
  const ath = opts.keepAthletic ? take(s => ATH_BUCKETS.includes(s.bucket) || s.block === 'skill') : [];
  const tail = take(s => ['conditioning', 'aerobic', 'cooldown'].includes(s.block));
  const lifts = [];
  for (const [bucket, role, pair, extra] of spec) {
    const x = extra || {};
    const own = old.filter(s => !used.has(s));
    let st = own.find(s => s.bucket === bucket && (x.variant ? s.variant === x.variant : true) && (bucket !== 'ISO_SIDE_REAR_DELT' || s.variant === x.variant));
    const fromOwn = !!st;
    if (st) used.add(st);
    st = st ? clone(st) : find(bucket, x.variant || null, [], at);
    if (!st) continue;
    // the week's counted squat and hinge stay where the template had them (two spine days, R2-SES-01): a day's own station keeps
    // its axial mark; a station borrowed from another day is never a second heavy exposure
    const heavy = bucket === 'RP_BKD' || bucket === 'RP_BHD';
    const keepAxial = fromOwn ? st.axial : (heavy ? 'non_axial' : (st.axial === 'axial' ? null : st.axial));
    Object.assign(st, {
      bucket, role, block: bucket === 'FOCUS' ? 'accessories' : BLOCK_OF(bucket), group: x.group || GROUP_OF[bucket] || null,
      pair: pair || null, superset: pair || null, circuit: null, axial: keepAxial || null,
      variant: x.variant || null, variant_text: x.variant_text || null, condition: null, condition_text: null,
      sets_hint: bucket === 'ISO_CALF' ? [3, 3] : (/^RP_/.test(bucket) ? [2, 3] : [2, 2]),
      note: x.note || null
    });
    lifts.push(st);
  }
  // the athletic stations keep their own order; their rank comes after the lifts (the lifts and the first athletic pieces are the
  // day's skeleton, the extra athletic stations are "extra stations", R4-SES-04) - see rankDay
  const stations = [...warm, ...core, ...ath, ...lifts, ...tail];
  stations.forEach((s, i) => { s.id = `${at.name}.s${String(i + 1).padStart(2, '0')}`; });
  def.stations = stations;
  def.groups = [...new Set(lifts.map(s => s.group).filter(Boolean))];
  def.count = opts.count || null;
  def.skeleton = opts.skeleton || null;
}

/** an optional day as in his sheets: (calves), cardio, core, Focus 1, Focus 2 - cloned from the aesthetics optional day */
function optionalDay(F, labelKey) {
  const src = F.aesthetics.days['4'].day_types.OPT;
  const def = clone(src);
  def.label_key = labelKey;
  return def;
}

/**
 * Ranks: every counted station gets `rank` (1 = the first to stay). Skeleton days: the first athletic station, the first power
 * piece, the lifts in order, then the other athletic stations. Other days (strength, circuits, class, HYROX, baseball): the
 * template's own order, the stations a longer session used to add (v0.4 include_from_minutes) after the base ones; in a timed
 * circuit the compound lifts come first, then the conditioning station, then the isolations (5-7 stations, R4-SES-02).
 */
function rankDay(def, fam) {
  const usual = USUAL_MINUTES_V04[fam] || 60;
  if (!('count' in def)) def.count = null;       // the day's own exercise count (null = the client type's default)
  if (!('skeleton' in def)) def.skeleton = null; // which of the coach's skeletons the day was rebuilt on (null = as written in 05)
  const st = def.stations || [];
  const counted = st.filter(isCounted);
  let order;
  if (def.skeleton) {
    const ath = counted.filter(s => ATH_BUCKETS.includes(s.bucket));
    const firstJump = ath.find(s => s.bucket !== 'AP_TRIPLE_EXT') || null;
    const firstPower = ath.find(s => s.bucket === 'AP_TRIPLE_EXT') || null;
    const lead = [firstJump, firstPower].filter(Boolean);
    const lifts = counted.filter(s => !ATH_BUCKETS.includes(s.bucket));
    // an athletic day's lifts: the five (A) or six (B) of his athletic sheet, then the rest of the block's stations, then the
    // lifts his athletic sheet does not hold (calves, the 8th exercise, the arm isolation)
    const n = def.skeleton === 'athletic_A' || def.skeleton === 'athletic_C' ? 5 : def.skeleton === 'athletic_B' ? 6 : lifts.length;
    order = [...lead, ...lifts.slice(0, n), ...ath.filter(s => !lead.includes(s)), ...lifts.slice(n)];
  } else if (def.format === 'circuit') {
    const isRP = (s) => /^RP_/.test(s.bucket);
    order = [...counted.filter(isRP), ...counted.filter(s => s.bucket === 'COND_CIRCUIT'), ...counted.filter(s => !isRP(s) && s.bucket !== 'COND_CIRCUIT')];
  } else {
    order = counted.map((s, i) => ({ s, i, m: s.include_from_minutes || 0 })).sort((a, b) => a.m - b.m || a.i - b.i).map(x => x.s);
  }
  order.forEach((s, i) => { s.rank = i + 1; });
  for (const s of st) {
    // a station outside the count (skill practice, a cardio station, an extra core piece) that v0.4 added only to a session
    // longer than the family's usual one is an EXTRA of the template: there to add, not part of the default session
    // (EXTRA_RANK is above every count; PROPOSED, G-08) - the others have no rank (always in)
    if (!isCounted(s)) s.rank = (s.include_from_minutes || 0) > usual && !ALWAYS_IN_BUCKETS.includes(s.bucket) ? EXTRA_RANK : null;
    delete s.include_from_minutes; delete s.superset_below_minutes;
  }
}

/**
 * v0.5 / V1 template amendments (after amendTemplatesR2F1).
 * @param {object} families @returns {object}
 */
export function amendTemplatesV05(families) {
  const F = clone(families);
  const find = protoFinder(F);
  const days = (fam, d) => (F[fam] && F[fam].days && F[fam].days[d]) || null;
  const rb = (t, variant, name, spec, opts, fam, d) => {
    const holder = variant ? (t.variants && t.variants[variant]) : t;
    const def = holder && holder.day_types && holder.day_types[name];
    if (def) rebuildDay(def, spec, find, { fam, days: d, variant, name }, opts);
  };
  const evid = (t, text) => { t.evidence = [t.evidence, text].filter(Boolean).join('; v0.5: '); };

  // ---- aesthetics: the A / B full-body days (R4-SES-05), the 3-day builder, push / pull / legs
  for (const d of ['2', '3', '4', '5', '6']) {
    const t = days('aesthetics', d);
    if (!t) continue;
    for (const [name, def] of Object.entries(t.day_types)) {
      if (def.kind !== 'main') continue;
      if (d === '3' && name === 'C') { rb(t, null, name, GYM_C, { skeleton: 'gym_C' }, 'aesthetics', d); continue; }
      if (def.lower_focus === 'knee') rb(t, null, name, GYM_A, { skeleton: 'gym_A' }, 'aesthetics', d);
      else if (def.lower_focus === 'hip') rb(t, null, name, GYM_B, { skeleton: 'gym_B' }, 'aesthetics', d);
    }
    evid(t, 'main days rebuilt on the coach\'s A / B template (COACH-R4 R4-SES-05; OBSERVED BYOP AESTHETICS - FULL BODY - 4 DAYS, 3 DAY BUILDER)');
  }
  const ppl = days('aesthetics', '6') && days('aesthetics', '6').variants && days('aesthetics', '6').variants.ppl_x2;
  if (ppl) {
    const t6 = days('aesthetics', '6');
    rb(t6, 'ppl_x2', 'Push', PPL_PUSH, { skeleton: 'ppl_push' }, 'aesthetics', '6');
    rb(t6, 'ppl_x2', 'Pull', PPL_PULL, { skeleton: 'ppl_pull' }, 'aesthetics', '6');
    // the legs day of his sheet is 6 lifts + Focus 1; with the leg day's calves it is an 8-exercise day (inside 6-8, R4-SES-02)
    rb(t6, 'ppl_x2', 'Legs 1', pplLegs('knee'), { skeleton: 'ppl_legs', count: 8 }, 'aesthetics', '6');
    rb(t6, 'ppl_x2', 'Legs 2', pplLegs('hip'), { skeleton: 'ppl_legs', count: 8 }, 'aesthetics', '6');
    ppl.evidence = [ppl.evidence, 'v0.5: slot for slot his push / pull / legs sheet (COACH-R4 R4-SES-05; OBSERVED BYOP PUSHPULLLEGS - 3 or 6 DAYS A WK)'].filter(Boolean).join('; ');
  }

  // ---- general population (gym, straight sets) and no equipment: the same A / B days; the two aerobic days of the 4-day week
  // become his optional days (calves, cardio, core, Focus 1, Focus 2 - OBSERVED BYOP 'BOOTCAMP - OPTION 1' Wednesday / Saturday),
  // so a group the main days cannot hold has its bonus exercise there (allocation step 3)
  for (const fam of ['fat_loss_bootcamp', 'no_equipment']) for (const d of ['2', '4']) {
    const t = days(fam, d);
    if (!t) continue;
    for (const [name, def] of Object.entries(t.day_types)) {
      if (def.kind !== 'main' || def.format === 'circuit') continue;
      if (def.lower_focus === 'knee') rb(t, null, name, GYM_A, { skeleton: 'gym_A' }, fam, d);
      else if (def.lower_focus === 'hip') rb(t, null, name, GYM_B, { skeleton: 'gym_B' }, fam, d);
    }
    if (!t.day_types.OPT) {
      t.day_types.OPT = optionalDay(F, `day.${fam}.${d}.OPT`);
      // 4 days: both aerobic days (his Wednesday / Saturday blocks); 2 days: the last one (as the aesthetics 2-day week)
      const aer = Object.entries(t.week_layout).filter(([, e]) => e && e.kind === 'aerobic');
      for (const [wd] of (d === '4' ? aer : aer.slice(-1))) t.week_layout[wd] = { day_type: 'OPT', kind: 'optional', optional: true, note: null };
    }
    evid(t, 'main days on the coach\'s A / B template (COACH-R4 R4-SES-05); optional days as in OBSERVED BYOP BOOTCAMP - OPTION 1 (Wednesday / Saturday blocks)');
  }

  // ---- athletic: the athletic block, then the same A / B lifts (R4-SES-05; OBSERVED BYOP ATHLETIC - FULL BODY - 4 DAYS)
  const athDay = (t, variant, name, def, d) => {
    if (def.kind !== 'main' || def.format === 'circuit') return;
    if (d === '3' && name === 'S3') { rb(t, variant, name, ATH_C, { skeleton: 'athletic_C', keepAthletic: true }, 'athletic', d); return; }
    if (def.lower_focus === 'knee') rb(t, variant, name, ATH_A, { skeleton: 'athletic_A', keepAthletic: true }, 'athletic', d);
    else if (def.lower_focus === 'hip') rb(t, variant, name, ATH_B, { skeleton: 'athletic_B', keepAthletic: true }, 'athletic', d);
  };
  for (const d of ['2', '3', '4', '5', '6']) {
    const t = days('athletic', d);
    if (!t) continue;
    for (const [name, def] of Object.entries(t.day_types)) athDay(t, null, name, def, d);
    for (const [vn, v] of Object.entries(t.variants || {})) {
      if (['baseball_parts', 'hyrox'].includes(vn)) continue; // his own baseball week and the HYROX hybrid week stay as written
      for (const [name, def] of Object.entries((v && v.day_types) || {})) athDay(t, vn, name, def, d);
    }
    evid(t, 'athletic block, then the coach\'s A / B lifts (COACH-R4 R4-SES-05; OBSERVED BYOP ATHLETIC - FULL BODY - 4 DAYS A WEEK)');
  }

  // ---- every day type: both core exercises always (the count excludes "the 2 core exercises", R4-SES-02), ranks, no minutes
  eachDayType(F, (def) => { rankDay(def); });
  for (const f of Object.values(F)) { delete f.default_minutes; }
  return F;
}

// ---------------------------------------------------------------------------------------------------------------------------
// words (EN, ES). V3 owns the printed wording; these are the keys V1's data needs so no plan carries an unresolved key.
// ---------------------------------------------------------------------------------------------------------------------------

export const UI_V05 = {
  'day.fat_loss_bootcamp.2.OPT': ['Optional day', 'Día opcional'],
  'day.fat_loss_bootcamp.4.OPT': ['Optional day', 'Día opcional'],
  'day.no_equipment.2.OPT': ['Optional day', 'Día opcional'],
  'day.no_equipment.4.OPT': ['Optional day', 'Día opcional'],
  'warning.session_minutes_retired': ['Session length is no longer asked: the plan is sized by exercises, and how long a session takes is up to you. The time shown on each day is only an estimate.', 'Ya no se pregunta la duración de la sesión: el plan se arma por número de ejercicios, y cuánto dura cada sesión depende de ti. El tiempo que aparece en cada día es solo un estimado.'],
  'warning.two_day_rule': ['With {days} training days a week every big muscle group is trained with about {low}-{high} weekly sets instead of 10 or more. A third training day would let every group reach 10.', 'Con {days} días de entrenamiento a la semana, cada grupo muscular grande se entrena con unas {low}-{high} series semanales en lugar de 10 o más. Un tercer día de entrenamiento permitiría que cada grupo llegue a 10.'],
  'warning.acceleration': ['Week {week} jumps more than usual ({pct} % more sets for {group}): adjust if needed.', 'La semana {week} sube más de lo habitual ({pct} % más series para {group}): ajusta si hace falta.'],
  'warning.acceleration_total': ['Week {week} jumps more than usual ({pct} % more sets in total): adjust if needed.', 'La semana {week} sube más de lo habitual ({pct} % más series en total): ajusta si hace falta.'],
  'warning.capped_by_template': ['{group}: this template holds {held} weekly sets, below the planned {planned}. Add an exercise if you want more.', '{group}: esta plantilla alcanza {held} series semanales, menos que las {planned} planeadas. Agrega un ejercicio si quieres más.'],
  'warning.below_floor_template': ['{group}: this template holds {held} weekly sets, below {floor}. Add an exercise or a training day if you want more.', '{group}: esta plantilla alcanza {held} series semanales, menos de {floor}. Agrega un ejercicio o un día de entrenamiento si quieres más.'],
  'warning.plan_edited': ['This plan was edited after it was generated. The totals were recomputed; the original checks no longer apply.', 'Este plan se editó después de generarse. Los totales se recalcularon; las revisiones originales ya no aplican.'],
  'why.two_day_rule': ['Two training days: every big group at about 6-8 weekly sets', 'Dos días de entrenamiento: cada grupo grande con unas 6-8 series semanales'],
  'why.template_slot': ['The coach\'s template slot', 'Posición de la plantilla del coach'],
  'why.session_size': ['Session sized by exercise count ({n})', 'Sesión armada por número de ejercicios ({n})'],
  'why.bonus_optional_day': ['Bonus exercise on the optional day: the main days cannot hold all of this group\'s weekly sets', 'Ejercicio extra en el día opcional: los días principales no alcanzan para todas las series semanales de este grupo'],
  'why.stairway_target': ['Weekly sets follow the stairway to the planned final target', 'Las series semanales siguen la escalera hasta el objetivo final planeado'],
  'why.sets_hold': ['Same sets this week: progress with reps or load', 'Mismas series esta semana: progresa con repeticiones o carga'],
  'why.capped_by_template': ['The template\'s exercises hold fewer weekly sets than planned for this group', 'Los ejercicios de la plantilla alcanzan menos series semanales que las planeadas para este grupo'],
  'why.next_block_start': ['Starts a little above the last block', 'Empieza un poco arriba del bloque anterior'],
  'changes.sets_hold': ['Same sets as last week: add reps or load when every set reaches the top of its range', 'Mismas series que la semana pasada: agrega repeticiones o carga cuando todas las series lleguen al tope de su rango'],
  'ui.plan.estimate_minutes': ['About {min} min (an estimate; your pace decides)', 'Unos {min} min (un estimado; tu ritmo decide)'],
  'ui.plan.easy_to_remove': ['Easiest to remove if you need a shorter day', 'Lo más fácil de quitar si necesitas un día más corto'],
  'ui.plan.edited': ['Edited plan', 'Plan editado'],
  'why.left_out_exclusion': ['Left out: you asked for no {reason}', 'Se omite: pediste sin {reason}'],
  'why.superset_short': ['Superset: the pair is done back to back (your choice; it saves time)', 'Superserie: el par se hace seguido (tu elección; ahorra tiempo)'],
  'plan.stairway_intro_plain': ['Your plan climbs like a stairway: the effort goes up through the block and sets are added toward each muscle group\'s target, the hardest weeks at the end.', 'Tu plan sube como una escalera: el esfuerzo sube a lo largo del bloque y se agregan series hacia el objetivo de cada grupo muscular, con las semanas más duras al final.'],
  'warning.athletic_capacity': ['This template holds about {pct}% of your sport\'s weekly {key}: the work still climbs every week. Add a station or a day if you want the full dose.', 'Esta plantilla cubre cerca del {pct}% del volumen semanal de tu deporte en {key}: igual sube cada semana. Agrega una estación o un día si quieres la dosis completa.'],
  'warning.athletic_capacity_activity': ['This template holds about {pct}% of this plan\'s weekly {key}: the work still climbs every week. Add a station or a day if you want the full dose.', 'Esta plantilla cubre cerca del {pct}% de los {key} semanales de este plan: el trabajo igual sube cada semana. Agrega una estación o un día si quieres la dosis completa.'],
  'warning.athletic_capacity_block': ['This template holds about {pct}% of your sport\'s weekly {key}: the work climbs across the block (not every week). Add a station or a day if you want the full dose.', 'Esta plantilla cubre cerca del {pct}% de los {key} semanales de tu deporte: el trabajo sube a lo largo del bloque (no cada semana). Agrega una estación o un día si quieres la dosis completa.'],
  'warning.athletic_capacity_block_activity': ['This template holds about {pct}% of this plan\'s weekly {key}: the work climbs across the block (not every week). Add a station or a day if you want the full dose.', 'Esta plantilla cubre cerca del {pct}% de los {key} semanales de este plan: el trabajo sube a lo largo del bloque (no cada semana). Agrega una estación o un día si quieres la dosis completa.'],
  'check.v3_short_athletes': ['No time fitting: the plan carries no session length or minute limit', 'Sin ajuste por tiempo: el plan no lleva duración de sesión ni límite de minutos'],
  'check.v13_caps': ['Session size (exercises per session) and the absolute set cap', 'Tamaño de la sesión (ejercicios por sesión) y el tope absoluto de series'],
  'check.v15_step': ['Final sets reached in the last week, not early', 'Las series finales se alcanzan en la última semana, no antes'],
  'check.h10_step_cap': ['Final sets reached in the last week', 'Las series finales se alcanzan en la última semana'],
  'check.v22_floor': ['Every trained muscle group gets at least 10 sets a week from 3 training days (about 6-8 on 2 days)', 'Cada grupo muscular entrenado recibe al menos 10 series por semana desde 3 días de entrenamiento (unas 6-8 con 2 días)'],
  'check.h17_floor_10': ['Floor of 10 sets (from 3 training days)', 'Mínimo de 10 series (desde 3 días de entrenamiento)'],
  'check.v23_exercises_per_group': ['1-4 exercises per muscle group per day', '1-4 ejercicios por grupo muscular por día'],
  'check.h18_two_to_four': ['1-4 exercises per group', '1-4 ejercicios por grupo'],
  'check.h21_stairway': ['Stairway shape: sets never drop, the hardest week last', 'Forma de escalera: las series nunca bajan, la semana más dura al final'],
  'check.h22_no_checkin_no_change': ['Planned stairway only: every week follows the planned schedule (no check-ins)', 'Solo la escalera planificada: cada semana sigue el calendario planificado (sin chequeos)'],
  'ui.plan.session_size': ['about {n} exercises a session (plus the warm-up and the 2 core exercises)', 'unos {n} ejercicios por sesión (más el calentamiento y los 2 ejercicios de core)']
};

/** UI_V05 keys that replace an earlier string of the same key */
export const V05_FINAL = ['why.bonus_optional_day', 'why.superset_short', 'plan.stairway_intro_plain',
  'check.v3_short_athletes', 'check.v13_caps', 'check.v15_step', 'check.h10_step_cap', 'check.v22_floor', 'check.h17_floor_10', 'check.v23_exercises_per_group',
  'check.h18_two_to_four', 'check.h21_stairway', 'check.h22_no_checkin_no_change',
  'warning.athletic_capacity', 'warning.athletic_capacity_activity', 'warning.athletic_capacity_block', 'warning.athletic_capacity_block_activity'];

/**
 * Words retired with the time check (COACH-CT CT-01, COACH-R4 R4-SES-01): the schedule offers, 'your minutes cannot hold ...',
 * 'not trained directly (time)', 'over your minutes', the session-length label. Exact keys; a trailing '*' is a prefix.
 * Deleted from both languages by both builds (tools/fixture/build-fixture.mjs, tools/compile/i18n.mjs).
 */
export const REMOVED_V05 = ['offer.*', 'time.too_short', 'intake.minutes.label',
  'ui.plan.schedule', 'ui.plan.schedule_*', 'ui.plan.offers', 'ui.plan.offer_chosen', 'ui.plan.days_over*', 'ui.plan.day_over*', 'ui.plan.supersets_today*',
  'ui.plan.below_floor*', 'ui.plan.not_trained_time*', 'ui.plan.not_trained_class_lift', 'ui.plan.kept_exercise*',
  'warning.time_check', 'warning.time_lower_peak*', 'warning.not_trained_directly', 'warning.below_floor_work_lift', 'warning.start_lowered',
  'warning.supersets_needed*', 'warning.long_day*', 'warning.test_day_long*', 'warning.minutes_competitive_only', 'warning.v3_short_athletes',
  'warning.maintenance_time', 'warning.stairway_time', 'warning.floor_schedule',
  'changes.at_time_cap', 'changes.held_group',
  'why.aerobic_separate', 'why.capacity_start', 'why.core_superset', 'why.cut_time', 'why.group_not_trained', 'why.short_start', 'why.skill_in_warmup',
  'why.time_fit', 'why.room_cut', 'why.wod_short', 'why.group_fewer_days', 'why.group_moved', 'why.pattern_kept*', 'why.athlete_cap', 'why.total_ceiling',
  'why.group_two_to_four', 'why.rear_delt_own', 'note.supersets_on'];

/** is this i18n key one of the retired time-fitting words? */
export function isRemovedV05(key) {
  return REMOVED_V05.some(p => (p.endsWith('*') ? key.startsWith(p.slice(0, -1)) : key === p));
}
