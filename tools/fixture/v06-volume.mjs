// tools/fixture/v06-volume.mjs - engine 0.6 work package "volume targets and set placement" (the round-4 coach-eye reviews of the
// 8 sample plans, reviews/coach-eye-r4/0*.md). Applied after v05-fix2.mjs by BOTH builds (tools/fixture/build-fixture.mjs and
// tools/compile-model.mjs), so model/*.json keeps deep-equalling the fixture (tests/compile.test.mjs). Pure functions of their input
// (deterministic, no clock). Every value names its source: COACH-R4 (coach_answers_round4.md), CT-01, CX-01..04, an earlier coach
// answer, OBSERVED (dumps/), INFERRED or PROPOSED. Decisions: engine/DECISIONS.md section G (G-100 ... G-129).

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * v0.6 volume rule amendments (after amendRulesX2).
 * @param {object} rules @returns {object}
 */
export function amendRulesV06(rules) {
  const R = clone(rules);

  // ---- where the sets go (engine/volume.mjs addSet / planStairs / runBlock)
  R.placement.x3 = {
    // G-100 (VOL-07 'if I need to add an extra set of volume, then I add it to the first exercise on the list ... 3, 3, 3 ... 4, 3,
    // 3'; R3-VOL-03; reviews 01 / 02 / 03 M2: the day's main two-leg lift sat at 2-3 sets for 6-12 weeks while later lifts climbed):
    // the training day whose first lift of a group is the template's main two-leg lift (its 'work' slot) takes the group's next set
    // first, on the exercise of that day that holds the fewest sets - so the day climbs the coach's own staircase 2/2/2 -> 3/2/2 ->
    // 3/3/2 -> 3/3/3 -> 4/3/3 and its main lift leads it, at most max_ahead sets above the group's least-loaded exercise of another
    // day. The two exposures of one day type keep alternating (R3-VOL-03); inside a day the first exercise leads (session order).
    lead_first: { enabled: true, max_ahead: 2, refs: ['VOL-07', 'R3-VOL-03', 'R4-SES-05'], status: 'approved rule (VOL-07) read across the days of the week; max_ahead PROPOSED' },
    // G-101 (reviews 02 / 03 M2: a flat dumbbell bench at 4-5 sets while the athlete's main leg lift held 2-3): a flat press of an
    // athlete's template holds at most 4 sets; the chest group is held at what that gives and the plan says so
    // (while the group keeps at least 3 exercises of its own in the week to carry its sets - a pitcher's one chest press is not held)
    athlete_press_max: { families: ['athletic'], credit_classes: ['HPUSH'], not_tags: ['mid_range_push'], max: 4, min_group_exercises: 3,
      refs: ['VOL-07', 'UNI-02', 'R4-SES-05'], status: 'PROPOSED number (4 sets); review 03 M2 hint' },
    // G-102 (R3-VOL-03 'extra SMALL-muscle sets become a short bonus exercise on the optional day'; ORD-10 'optional days are
    // bonuses'; reviews 04 / 06 / 01 M2): a big group (quads, hips, back, chest) never takes the optional day's bonus exercise. Its
    // final sets are held on the training days, else it is capped and the plan says so.
    bonus_small_only: { line_classes: ['small'], refs: ['R3-VOL-03', 'ORD-10', 'R4-PRG-01'], status: 'approved rule (R3-VOL-03)' },
    // G-103 (same answers; review 01 M2: a sport-priority split squat and seated row on the swimmer's optional day): an optional-day
    // Focus slot of a big group that is not the person's own Focus closes when the training days alone hold the group's final sets
    big_optional_focus_close: { enabled: true, always: true, refs: ['R3-VOL-03', 'ORD-10', 'ORD-11', 'R4-SES-04'], status: 'PROPOSED reading (the main days hold the plan; the optional day stays a bonus)' },
    // G-104 (review 01 M2 'never put a pattern on the optional day that the previous main day already trained'): a bonus exercise
    // whose movement pattern (a compound pattern: squat, hinge, lunge, single-leg hinge, row, press, pull-down) the day before
    // trained is not placed on that optional day
    bonus_no_repeat_previous_day: { enabled: true, compound_patterns: ['BKD', 'BHD', 'UKD', 'UHD', 'HPULL', 'MRPULL', 'VPULL', 'HPUSH', 'MRPUSH', 'VPUSH'],
      refs: ['R3-VOL-03', 'PER-04'], status: 'PROPOSED (review 01 M2)' },
    // G-105 (R3-VOL-03 'with no optional day, on a day that already trains biceps'; R4-SES-05 'the days that they do 8 exercises ...
    // an extra small muscle exercise at the end'; review 07 M1: biceps capped at 22 of 25 in silence): with no optional day for it,
    // a small group's bonus exercise goes to the training day that trains the group with the fewest exercises, inside the session size
    bonus_main_day_fallback: { groups: ['biceps', 'triceps', 'shoulders'], family_groups: { hybrid_crossfit: ['quads'] },
      refs: ['R3-VOL-03', 'R4-SES-05', 'R4-SES-02', 'CX-01'], status: 'approved rule (R3-VOL-03); the class family\'s second knee lift is PROPOSED (review 04 M1 hint)' },
    // G-106 (R4-SES-03 'every big muscle group ... about 6-8'; review 08 M2: the shoulders reached 6-8 only with the optional day's
    // fly): on a 2-day plan the training days hold the low end of the 2-day band for every trained group before the optional day
    two_day_main_floor: { enabled: true, refs: ['R4-SES-03', 'ORD-10'], status: 'approved rule (R4-SES-03) read on the training days' },
    // G-107 (CX-04; H10 / H17 'a group the template cannot take that far is held at what the slots hold, and the plan says so';
    // review 07 M1): every capped group carries the notice and a summary shortfall
    capped_notice_all: true,
    capped_shortfalls: true,
    // G-114 (reviews 02 / 03 M2: 'for a midfielder the order of priority should be the reverse' - the hex-bar deadlift at 2 sets and
    // the front squat at 3 while the bench climbed to 5; R4-SES-05 slot 2 is the day's main lower lift): on a competitive athlete's
    // day whose paired upper lift holds more sets than the main two-leg lift, that lift takes its group's next set first (among the
    // exercises at the group's fewest sets; the two exposures of a day type still alternate)
    work_over_paired: { families: ['athletic'], modifiers: ['field_off', 'strength_athlete_off'], refs: ['R4-SES-05', 'VOL-07', 'UNI-02'], status: 'PROPOSED (reviews 02 / 03 M2 hints)' },
    // G-115 (VOL-18 'we need to balance this out'): with the back held at what the training days take (G-102), the presses take no set
    // that would put the week's pulling sets under 0.8 x its pressing sets (the pull : push floor the benchmark scorer reads, T8-BAL-03)
    press_hold: { min_pull_per_push: 0.8, refs: ['VOL-18', 'R3-VOL-03'], status: 'PROPOSED number (0.8)' },
    // G-108 (VOL-01 'advanced 20+ for PRIORITY muscles'; OBSERVED MASTER MODEL 4 TRACKS 'AESTHETICS' row 31: 3, 3, 3, 4, 4, 4 ... 5
    // sets an exercise; review 06 M1): in the first week of a physique block a compound lift holds at most 4 sets and an isolation
    // exercise 3, so the first lift has a step left; a Focus group keeps its numbers
    start_max_sets: { families: ['aesthetics'], compound: 4, isolation: 3, focus_exempt: true,
      refs: ['VOL-01', 'VOL-07', 'VOL-16', 'OBSERVED MASTER_MODEL 4 TRACKS AESTHETICS R31'], status: 'PROPOSED numbers (review 06 M1 hint)' },
    // G-109 (review 04 M2: a fly went 2 -> 4 in one week and the plan printed '+1 set'): an exercise takes one more set a week unless
    // its group's schedule needs more, and the week's change lines name the real difference
    one_step_per_exercise: true,
    // G-116 (fix round 2, 03 minor 'never print an exercise at 1 set'; R4-SES-04 nothing dropped on a training day): a training day's
    // lift keeps 2 sets in the pre-season block (it is never dropped there, so it never runs at 1)
    pre_season_main_min: true,
    // G-110 (CX-03 / R4-PRG-04 'never above the level's top'; H10 / H17 'said, never hidden'; review 05 M3): a timed circuit whose
    // uniform rounds take a group above its top number says so (meta.stairway[].over_top, warning.circuit_over_top)
    circuit_over_top: { enabled: true, margin: 0, refs: ['CX-03', 'R4-PRG-04', 'R4-SES-04'], status: 'approved rule; the circuit keeps one round count for every station (OBSERVED BYOP BOOTCAMP)' },
    refs: ['VOL-07', 'R3-VOL-03', 'R4-SES-03', 'R4-SES-05', 'CX-01', 'CX-03', 'CX-04', 'VOL-01'],
    status: 'engine 0.6 volume package (round-4 coach-eye reviews); readings of approved answers, the numbers PROPOSED'
  };

  // ---- weekly targets (engine/volume.mjs targetsFor)
  R.volume.x3 = {
    // G-111 (VOL-01 'beginner about 10-12, intermediate 15-20, advanced 20+ for PRIORITY muscles'; review 06 M1: every big group of an
    // advanced physique plan started at 20 - 5-set first lifts from week 1): an advanced physique client's big groups that are not a
    // Focus muscle start at 16 (the top of the 15-20 band's lower half); Focus groups keep 20 + the Focus add; the final sets stay
    nonfocus_start: { modifiers: ['aesthetics'], levels: ['L3'], line_classes: ['big'], max_days: 4, start: 16,
      refs: ['VOL-01', 'R3-SES-01', 'OBSERVED MASTER_MODEL 4 TRACKS AESTHETICS R31'], status: 'PROPOSED number (16)' },
    // G-112 (soccer / sprinters / ultimate profile resistance.avoid 'upper-body hypertrophy volume beyond maintenance', INFERRED
    // profile data; UNI-02 'field athletes don't need to get bigger'; review 03 M2): for an off-season field athlete whose profile
    // keeps the upper body at maintenance, chest and shoulders end one set above the floor
    upper_maintenance: { modifiers: ['field_off', 'strength_athlete_off'], lines: ['chest', 'shoulders'], over_floor: 1,
      refs: ['UNI-02', 'R2-VOL-06', 'R3-VOL-01'], status: 'PROPOSED (review 03 M2 hint: chest and shoulders about 10-11)' },
    // G-113 (OBSERVED MASTER MODEL CrossFit split: RESISTANCE L1-2 = 2-3 x 10; 04 crossfit_class resistance emphasis strength 50 /
    // hypertrophy 30 / power 20; R4-SES-02 'as long as it's logical'; review 04 M1): the class member's arms and shoulders end two sets
    // above the floor, chest and back at 15 (at most what the training days hold - no bonus exercise for them); the legs keep their
    // final sets. The 'hybrid' goal profile carries the same 50 / 30 / 20 emphasis (04 hybrid) and takes the same tops (competitive
    // 'none'); a competitive CrossFit athlete keeps the level's numbers
    class_tops: { families: ['hybrid_crossfit'], competitive: ['recreational', 'none'], lines: { shoulders: { over_floor: 2 }, biceps: { over_floor: 2 }, triceps: { over_floor: 2 }, chest: { value: 15 }, lats_upper_back: { value: 15 } },
      refs: ['R4-SES-02', 'R2-VOL-06', 'OBSERVED prog_mm_crossfit_tracks'], status: 'PROPOSED numbers (review 04 M1 hint: arms and shoulders about 12, chest and back 14-16)' },
    refs: ['VOL-01', 'UNI-02', 'R4-SES-02'],
    status: 'engine 0.6 volume package; PROPOSED numbers'
  };
  return R;
}

/**
 * v0.6 sport-profile amendments (after amendSportX2): the profile's own 'upper body at maintenance' note as a flag (G-112).
 * @param {object} sport compiled profile @param {object} [src] the source profile (synthesis/04_profiles.json) @returns {object}
 */
export function amendSportV06(sport, src) {
  const s = clone(sport);
  const avoid = src && src.resistance && Array.isArray(src.resistance.avoid) ? src.resistance.avoid : [];
  if (avoid.some(a => typeof a === 'string' && /upper-body hypertrophy/i.test(a) && /(maintenance|need)/i.test(a))) s.upper_maintenance = true;
  return s;
}

/** v0.6 volume words: key -> [EN, ES]. Every key wins over the earlier layers. Spanish PROPOSED (R2-GEN-08). */
export const UI_V06 = {
  'changes.sets_added_n': ['+{n} sets on {exercise} ({day})', '+{n} series en {exercise} ({day})'],
  'why.bonus_main_day': ['Extra {group} sets: a short bonus exercise at the end of a training day that already trains it (no optional day can take it)', 'Series extra de {group}: un ejercicio extra corto al final de un día de entrenamiento que ya lo trabaja (ningún día opcional puede llevarlo)'],
  'warning.circuit_over_top': ['{group}: every station runs the same rounds, so this group reaches {held} weekly sets, above its usual top of {top}. If you want to stay at the top, skip one {group} station in the extra round.', '{group}: todas las estaciones hacen las mismas rondas, así que este grupo llega a {held} series por semana, por encima de su tope habitual de {top}. Si quieres quedarte en el tope, salta una estación de {group} en la ronda extra.']
};
