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
    // G-209 (VOL-07 '4, 3, 3'; placement.order_rule first_below_first; review r6 02 M1: the incline DB press, exempt by its
    // mid_range_push tag, took 5 sets over the day's bench at 4): later_capped - a later lift of the group on a day whose first lift is
    // held at max is held there too; the group's last sets go to a bonus exercise (CH5-03) or it is capped and said (G-107)
    athlete_press_max: { families: ['athletic'], credit_classes: ['HPUSH'], not_tags: ['mid_range_push'], max: 4, min_group_exercises: 3, later_capped: true,
      refs: ['VOL-07', 'UNI-02', 'R4-SES-05', 'CH5-03'], status: 'PROPOSED number (4 sets); review 03 M2 hint; later_capped reads VOL-07 (review r6 02 M1)' },
    // G-102 (R3-VOL-03 'extra SMALL-muscle sets become a short bonus exercise on the optional day'; ORD-10 'optional days are
    // bonuses'; reviews 04 / 06 / 01 M2): a big group (quads, hips, back, chest) never takes the optional day's bonus exercise. Its
    // final sets are held on the training days, else it is capped and the plan says so.
    // COACH-CH5 CH5-03 (2026-10-11, 'they should reach more if needed, no cap until 35'): a big group that the training days cannot
    // take to its planned final sets MAY take a bonus exercise (on the optional day, or on a training day when there is none); the
    // bonus still never repeats a pattern the day before trained (G-104). big_when_needed retires the small-groups-only limit for them;
    // the training-day place (no optional day can take it) is read for the physique and athletic families (big_main_day_families,
    // PROPOSED: the class member keeps his tops, G-113, where a third hinge on the deadlift day broke the coach's staircase)
    // (G-209, review r6 02 M1: main_day_template_first - such a training-day bonus takes a set only when the group's template lifts
    // can take no more; VOL-07 'add it to the first exercise on the list')
    bonus_small_only: { line_classes: ['small'], big_when_needed: true, big_main_day_families: ['aesthetics', 'athletic'], main_day_template_first: true, refs: ['CH5-03', 'R3-VOL-03', 'ORD-10', 'R4-PRG-01'], status: 'approved rule (R3-VOL-03); big groups when needed (COACH-CH5 CH5-03)' },
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
    // COACH-CH5 CH5-03 ('they should reach more if needed, no cap until 35'): a group one bonus exercise cannot take to its planned
    // final sets takes another one on another optional-day place (never a pattern the day before trained, G-104)
    reach_planned: { max_bonus_per_group: 3, refs: ['CH5-03', 'R3-VOL-03'], status: 'approved (COACH-CH5 CH5-03); up to 3 bonus exercises a group PROPOSED (an optional day keeps its 2 places, placement.bonus)' },
    // G-106 (R4-SES-03 'every big muscle group ... about 6-8'; review 08 M2: the shoulders reached 6-8 only with the optional day's
    // fly): on a 2-day plan the training days hold the low end of the 2-day band for every trained group before the optional day
    // G-207 (R4-SES-03 / H17 'every big muscle group ... about 6-8' with the shoulders counted as a group with a floor, R3-VOL-01;
    // CH5-03; review r6 08 M1: G-200 read the band on the big line classes only, so the shoulders held 4.25-6 on the training days and
    // reached the band only with the optional day's fly, unsaid): the training days also hold the band's low end for the groups named
    // here; the optional day's bonus stays extra. The arms (slot 5, two_day_arm_slot) and the calves stay outside.
    two_day_main_floor: { enabled: true, also_groups: ['shoulders'], refs: ['R4-SES-03', 'ORD-10', 'R3-VOL-01', 'CH5-03'], status: 'approved rule (R4-SES-03) read on the training days; the shoulders with it (H17: shoulders counted as a group)' },
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
    // G-200 (R4-SES-03 'every BIG muscle group ... about 6-8'; R4-SES-05 slot 5 = one biceps / triceps exercise; CH5-02; OBSERVED BYOP
    // AESTHETICS Day 1 'Bicep' 2 x '20 Reps'; review r5 08 M1: 4-set curls and an arm day on a 2-day plan, the arms above their own
    // final sets while the shoulders sat at 7 of 8): on a 2-day plan the training days' 6-set band is not asked of the arms; their slot-5
    // exercise holds 2-3 sets, they take no bonus exercise, and their final sets are what that slot and the helper credit hold. The
    // optional day's places go to the groups that need them (the shoulders first).
    two_day_arm_slot: { groups: ['biceps', 'triceps'], sets: [2, 3],
      refs: ['R4-SES-03', 'R4-SES-05', 'CH5-02', 'CH5-03', 'OBSERVED BYOP AESTHETICS Day 1 Bicep 2 x 20'], status: 'approved rule (R4-SES-03: the band is for big groups); 2-3 sets PROPOSED (review r5 08 M1)' },
    // G-202 (CH5-02; reviews r5 01 / 02 M1): a credit-only group that holds an exercise of its own (the arm slot) is said as held at
    // its slot's sets (warning.slot_held_groups), never as 'no exercise of its own' (warning.credit_only_groups: no direct set at all)
    held_groups_notice: true,
    // G-201 (VOL-07 'add it to the first exercise on the list'; R3-VOL-03 'alternate between the two exposures'; R4-SES-05 slot 2 = the
    // day's main lower lift; review r5 06 m10: the hex-bar deadlift flat at 3 for 12 weeks while the hip thrust took every step): the
    // two main two-leg lifts of one day type alternate their steps - the one that holds fewer sets goes first, whatever a Focus bias
    // prefers inside the group - while the step keeps its day's staircase (at most one set above the day's other compound lifts of
    // the group). Review r5 02 M1's 'the DB bench never ahead of the RDL' is not done here: G-205.
    work_lead: { twins_alternate: true,
      refs: ['VOL-07', 'R3-VOL-03', 'R4-SES-05'], status: 'approved rules (VOL-07, R3-VOL-03) read on the main lifts' },
    refs: ['VOL-07', 'R3-VOL-03', 'R4-SES-03', 'R4-SES-05', 'CX-01', 'CX-03', 'CX-04', 'VOL-01'],
    status: 'engine 0.6 volume package (round-4 coach-eye reviews); readings of approved answers, the numbers PROPOSED'
  };

  // G-214 (R2-PER-07 'the test replaces that week's top set' - the test is the day's focus; R3-VOL-04; reviews r6 02 m18 and r5 01 m8:
  // every week-12 test day also carried a MYO set): a training day that holds a test carries no intensifier
  if (R.effort && R.effort.intensifiers) R.effort.intensifiers = { ...R.effort.intensifiers, no_test_day: true, no_test_day_refs: ['R2-PER-07', 'R3-VOL-04'] };

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
    // COACH-CH5 CH5-03 ('no cap until 35'): the absolute weekly ceiling of any group
    group_max: { sets: 35, refs: ['CH5-03'], status: 'approved (COACH-CH5 CH5-03)' },
    refs: ['VOL-01', 'UNI-02', 'R4-SES-02', 'CH5-03'],
    status: 'engine 0.6 volume package; PROPOSED numbers; group_max approved (CH5-03)'
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
  // (engine 0.6 integration, G-190: the line names the sets before and after, as the words package prints it, G-164; the plain line
  // without them is kept for a week next to a test week, where the test takes the place of the tested lift's top set)
  'changes.sets_added_n': ['+{n} sets on {exercise} ({day}): {from} → {to} sets', '+{n} series en {exercise} ({day}): {from} → {to} series'],
  'changes.sets_added_n_plain': ['+{n} sets on {exercise} ({day})', '+{n} series en {exercise} ({day})'],
  'why.bonus_main_day': ['Extra {group} sets: a short bonus exercise at the end of a training day that already trains it (no optional day can take it)', 'Series extra de {group}: un ejercicio extra corto al final de un día de entrenamiento que ya lo trabaja (ningún día opcional puede llevarlo)'],
  'warning.circuit_over_top': ['{group}: every station runs the same rounds, so this group reaches {held} weekly sets, above its usual top of {top}. If you want to stay at the top, skip one {group} station in the extra round.', '{group}: todas las estaciones hacen las mismas rondas, así que este grupo llega a {held} series por semana, por encima de su tope habitual de {top}. Si quieres quedarte en el tope, salta una estación de {group} en la ronda extra.']
};
