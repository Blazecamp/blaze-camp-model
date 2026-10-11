// tools/fixture/v05-fix2.mjs - engine 0.5.0, fix round 2 (the second coach-eye reviews of the 8 sample plans). Applied after
// v05-fix1.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/*.json keeps deep-equalling
// the fixture (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source:
// COACH-R4 (coach_answers_round4.md), CT-01, CX-01..04, an earlier coach answer, OBSERVED (dumps/), INFERRED or PROPOSED.
// Binding plan: design/ENGINE_V05_PLAN.md; decisions: engine/DECISIONS.md section G (G-76 ...); status: samples/STATUS_v0.5.md.

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniq = (a) => [...new Set(a)];

/**
 * fix round 2 record amendments (after amendExerciseX1).
 * @param {object} ex0 @returns {object}
 */
export function amendExerciseX2(ex0) {
  const ex = clone(ex0);
  const refs = new Set(ex.rule_refs || []);
  const tags = new Set(ex.tags || []);
  // 01 major (COACH-R4 R4-LIB-01: the question names 'farmer and suitcase carries'; 'not primary ones that the program is going to
  // throw at you as part of the template'): the suitcase carry is an optional add-on like the farmer carry
  if (ex.id === 'single-side-suitcase-carry') { ex.status = 'optional_addon'; ex.default_in_slots = []; refs.add('R4-LIB-01'); refs.add('R4-LIB-02'); }
  // 08 minor (CAT-05): the 'Side Plank Press (advanced: star side plank press)' is a one-side exercise of the advanced tier
  if (ex.id === 'side-plank-press-advanced-star-side-plank-press') { ex.level = 'advanced'; ex.laterality = 'unilateral'; refs.add('CAT-05'); }
  // 08 major (rules.volume.pain.worse_with.deep_knee_bend avoids deep_knee_flexion): lunges and a rear-foot-elevated split-squat
  // hold are deep single-leg knee bends - they came back as swaps of the knee-protected slot
  if (['rfe-split-squat-isometric-hold-suitcase-db', 'lunge-variation-not-stated', 'medball-rotational-alternating-ffe-reverse-lunge'].includes(ex.id)) tags.add('deep_knee_flexion');
  ex.tags = [...tags].sort();
  ex.rule_refs = [...refs].sort();
  return ex;
}

/**
 * fix round 2 rule amendments (after amendRulesX1).
 * @param {object} rules @returns {object}
 */
export function amendRulesX2(rules) {
  const R = clone(rules);

  // ---- selection rules of fix round 2 (engine/select.mjs x2Score and the x2 guards; every weight PROPOSED)
  R.selection.x2 = {
    // 01 major (R4-LIB-01 'farmer and suitcase carries ... not primary ones that the program is going to throw at you'; R4-LIB-02
    // carries sit with core / conditioning as add-ons; docs/02-model/exercise-library.md 3.2 'reference_only / program_only = swap
    // only'): a core slot takes a live-library exercise. The low-back opener (F3, E-129) keeps two basic floor drills of his
    // reference tab - the dead bug and the bird dog (04 LOW_BACK_EXTENSION 'core first as anti-extension / anti-rotation (dead bug,
    // plank, hollow hold)') - and nothing else that is not live. A carry is never a template pick.
    core_primary: {
      live_only: true,
      low_back_allow_ids: ['dead-bugs', 'bird-dogs'],
      // (the live library holds 3 anti-movement drills + these 2: a low-back client's 6th core slot repeats a plank on a far day
      // before it takes a crunch, a leg raise or a hanging raise - 04 LOW_BACK_*, RECHECK 01 minor)
      low_back_repeat_first: true,
      never_tags: ['carry_sled'],
      // 04 major / 05 minor (CAT-05; R2-SES-03 'the core opener stays light, as a warm-up'): an exercise above the client's level is
      // a fallback only; the side plank on the elbow is the one frontal-plane hold every level uses (the library files it one step up)
      in_level_first: true, in_level_exempt_ids: ['side-plank-elbow'],
      // 03 minor (strict toes-to-bar for 10-15 is no light opener for a 2-year lifter)
      min_level_ids: { 'toes-to-bar-hanging': 'L3' },
      // 04 major (a loaded sit-up and an L-sit before the heavy deadlift): on the day of the week's counted squat or deadlift the
      // opener is unloaded
      weighted_re: 'weighted|decline-sit-up', weighted_on_axial_day: -6,
      // 04 major (the class day whose skill practice is itself core work - toes-to-bar): the opener is two floor anti-movement drills
      skill_day_flexion: -4, skill_day_anti: 2,
      // 05 minor (a Copenhagen plank as the day-1 opener of a general-population bootcamp client): the side plank first
      genpop_families: ['fat_loss_bootcamp', 'no_equipment'], genpop_goals: ['general', 'fat_loss', 'active'], genpop_copenhagen: -3,
      // 07 minor (two hanging rotational raises on back-to-back days, a third hanging exercise the next day; grip before rows)
      hanging_re: 'hanging|toes-to-bar', hanging_week_max: 1, hanging_over_week: -5,
      refs: ['R4-LIB-01', 'R4-LIB-02', 'R2-SES-03', 'CAT-05'],
      status: 'approved rule (R4-LIB-01: his live exercises are the template picks); PROPOSED: the two reference drills kept for the low-back opener, the exempt side plank, the weights'
    },
    // 01 major (04 swimming_middle resistance.avoid 'high-volume overhead pressing'; R4-LIB-03 incline before overhead; his Basic
    // Instruction on split grips for joints): the swimmer's shoulder takes the incline / mid-range press in slot 3 like the
    // general population, and its presses are split-grip or machine. Named by hot-spot code: the other shoulder hot spots
    // (throwers, volleyball) keep their own one-arm overhead press until he reviews one of those plans.
    incline_first_hotspot_codes: ['SHOULDER_SWIMMER'],
    shoulder_press: { codes: ['SHOULDER_SWIMMER'], buckets: ['RP_HPUSH', 'RP_VPUSH'], fixed_grip: -6, refs: ['R3-ATH-01', 'R4-LIB-03'], status: 'PROPOSED weight' },
    // 01 / 03 major (R4-SES-05 B day slot 3 'vertical push ... or an incline press'; VOL-16; R2-SES-05 never 1 exercise per group
    // a day): a week with a single B day and at most this many pressing days takes the 30-45 degree incline press in that slot,
    // so chest holds its floor on three lifts instead of two at 5 sets
    chest_shoulders_single_b: { max_press_days: 2, refs: ['R4-SES-05', 'VOL-16', 'R2-SES-05'], status: 'PROPOSED reading (fix round 2): G-59 extended to the one B day of a 3-day athletic week' },
    // 06 major (chest started 3 sets under the advanced start and was capped at 20 of 25): when the week's chest exercises at
    // their most sets cannot hold the level's start, every B day takes the incline press in slot 3 (R4-LIB-03 'for bodybuilders I
    // would rather focus more on incline pressing than on overhead pressing')
    chest_shoulders_all_b: { families: ['aesthetics'], when: 'chest_capacity_under_start', refs: ['R4-LIB-03', 'R4-SES-05', 'VOL-01'], status: 'PROPOSED (fix round 2)' },
    // (CAT-05 'levels are soft'; samples 01: a 16-year-old lost the flat dumbbell and barbell bench to the youth level filter and
    // was left with an incline barbell press) the horizontal-push staples of his sheets are open to every level
    youth_level_exempt_re: '^(flat-db-bench-press|incline-db-bench-press|barbell-bench-press|machine-bench-press)$',
    refs: ['R4-LIB-01', 'R4-SES-05', 'R4-LIB-03', 'CAT-05'],
    status: 'PROPOSED (fix round 2): selection rules from the second coach-eye reviews of the 8 samples'
  };

  // ---- conditioning (sample 02 major; OBSERVED dumps/MASTER_MODEL/02_BASEBALL Part E: 10-20 cal sprints, 1-3 bouts)
  R.conditioning.buyout_pool = { ...R.conditioning.buyout_pool,
    x2: { enforce_calories: true, bouts_by_block: [1, 2, 3], calories_by_bouts: { 1: 20, 2: 15, 3: 10 }, max_total_cal: 30, match_weight: 6, effort_key: 'effort.buyout_sprint', not_with_aerobic_addon: true,
      refs: ['OBSERVED BASEBALL Part E', 'R2-PER-03', 'ORD-03'], status: 'OBSERVED sheet doses (1 x 20 cal, 2 x 15 cal, 3 x 10 cal); PROPOSED: one more bout with each exercise block' } };
  R.conditioning.x2 = { addon_easy_colour: R.conditioning.extra_colour, refs: ['ORD-10', 'ATH-06'], status: 'PROPOSED (fix round 2): an aerobic session that rides on a training day is the easy steady one' };

  // ---- athletic rules of fix round 2
  R.athletic.x2 = {
    // 01 / 02 (EQ-15 loaded jumps 10-20 % of body weight; CAT-10 / R2-ATH-03 receive first, simple first; EQ-06 youth lighter): a
    // jump loaded by an implement heavier than 20 % of the client's body weight is not picked; a loaded jump never opens the plan
    // (not in the Land stage, not in the first exercise block); the load prints in lb / kg
    // (stage_exempt_tags: a medicine ball is a few pounds - the stage rule is about bars and dumbbells; without the exemption a
    // 66-year-old's limited-knee jump slot fell back to a single-leg box jump)
    loaded_jump: { implement_min_lb: { 'hex-bar-jump-squat': 45 }, max_bw_share: 0.2, never_stages: ['RC1'], never_first_block: true, stage_exempt_tags: ['medball'], round_lb: 5,
      refs: ['EQ-15', 'CAT-10', 'R2-ATH-03', 'EQ-06'], status: 'approved rule (EQ-15); the 45 lb empty hex bar is OBSERVED equipment, the stage rule a PROPOSED reading of CAT-10' },
    // 01 minor (R3-ATH-01 jumps for starts and turns; a hot shoulder): no upper-body plyo for a swimmer's shoulder - the slot is a leg jump
    upper_plyo_not_for_codes: ['SHOULDER_SWIMMER'],
    refs: ['EQ-15', 'CAT-10', 'R3-ATH-01'],
    status: 'PROPOSED (fix round 2)'
  };
  // ---- placement rules of fix round 2 (engine/volume.mjs; every number PROPOSED unless an answer is named)
  R.placement.x2 = {
    // samples 06 / 07 major: the printed schedule is the one the weeks follow (R4-PRG-01 'reach the top in the last week ... never
    // earlier'; R2-PER-03): a block whose first week holds more than a group's planned start, or whose exercises end under its
    // planned final sets, is planned again from what the weeks hold
    honest_schedule: { enabled: true, passes: 3, refs: ['R4-PRG-01', 'R2-PER-03', 'CX-01'] },
    // who takes a group's next set (VOL-07 'first exercise first'; VOL-16 '3 sets on compounds, 2 on isolation'; R4-SES-05 the
    // extra exercise is the small one at the end)
    order: {
      template_first: true,
      compound_min: { sets: 3, levels: ['L2', 'L3'], not_families: ['athletic'] },
      lead_first: true,
      iso_after_compound: true,
      no_spill: true,
      refs: ['VOL-07', 'VOL-16', 'R4-SES-05'],
      status: 'approved rules (VOL-07, VOL-16) read as an order; the athletic templates keep 2 sets a slot (VOL-16)'
    },
    // samples 04 / 06: the 4th set of an isolation exercise opens in the second half of the stairway (it was the hardest weeks only)
    iso_fourth_from_share: 0.5,
    // samples 01 / 04 major: a second small exercise at the end of a training day before an isolation exercise holds its 4th set
    // from week 1, and before a floor rests on the optional day (R4-SES-05; R2-VOL-06; ORD-10)
    extra_for_start: true,
    // (one set of the ceiling is kept free for the helper credit that climbs with the other groups' stairways)
    extra_ceiling_margin: 1,
    // sample 04 minor: a block that ends with a strength-test week reaches its final sets the week before and holds them
    end_test_week_hold: true,
    // samples 01 / 03 major: the floor of the training days is filled before the optional day's bonus exercise takes a set
    floor_first: true,
    // sample 06 major: the A day's own rear-delt station (the template's 8th exercise) before any other extra exercise
    template_extra: { families: ['aesthetics'], group: 'shoulders', muscle: 'rear_delts', bucket: 'ISO_SIDE_REAR_DELT', variant: 'rear', direct_by_level: { L1: 0, L2: 2, L3: 4 },
      refs: ['R4-SES-05', 'VOL-17', 'R2-VOL-04', 'R3-VOL-01'], status: 'PROPOSED numbers: R2-VOL-04 approved 4 / 6 / 8 own rear-delt sets and R3-VOL-01 then said rear delts are part of the shoulders and also work with the back - half of it is held as direct sets' },
    // samples 04 / 06 major: the bonus exercises go where the largest share of the planned final sets is missing
    bonus_order: { by: 'missing_share', skip_focus_owner: 2, not_for: { modifiers: ['field_off', 'strength_athlete_off', 'athlete_in'], groups: ['shoulders'] }, refs: ['R3-VOL-03', 'ORD-11', 'R3-SES-01', 'R3-VOL-01'] },
    // sample 01 major: a profile that pulls 1.5 x its pressing takes a rear-delt exercise as its extra shoulder exercise
    pull_profile_muscle: { min_pull_per_push: 1.5, by_group: { shoulders: 'rear_delts' }, refs: ['R3-ATH-01', 'D-09'] },
    refs: ['VOL-07', 'VOL-16', 'R4-SES-05', 'R4-PRG-01', 'R3-VOL-03'],
    status: 'PROPOSED (fix round 2): readings of approved answers; the numbers are the engine\'s'
  };
  // ---- the class skeletons (sample 04 majors): pinned laterality, a two-arm lead row, the day's partner pattern, the hang power lifts
  {
    const SL = R.selection.skeleton_laterality;
    SL.skeleton_prefixes = uniq([...(SL.skeleton_prefixes || []), 'class_']);
    SL.lead_row = { ...SL.lead_row, skeletons: uniq([...(SL.lead_row.skeletons || []), 'class_squat', 'class_pull']) };
    // sample 03 major: R4-SES-05 names the A day's row and squat and the B day's hinge as two-sided; the third day's second knee lift
    // (the engine's addition from his 3-day builder) follows the dial for a change-of-direction sport
    SL.x2_free = { skeletons: ['athletic_C'], buckets: ['RP_BKD'], when: 'cod_sport', refs: ['UNI-02', 'UNI-03', 'UNI-12', 'R4-SES-05'] };
    SL.x2_status = 'fix round 2 (sample 04 majors): the class days keep each slot\'s laterality too - the lunge and the single-leg hinge stay single-leg in every exercise block - and their first row is a two-arm row';
    const SK = R.validation.v05.skeleton;
    SK.laterality_skeleton_prefixes = uniq([...(SK.laterality_skeleton_prefixes || []), 'class_']);
    // a knee-dominant lift needs a pull on its day, a hip-dominant lift a push (UNI-11 / ORD-06, R4-SES-05 A = pull + knee, B = push + hip)
    SK.partner = { skeleton_prefixes: ['class_', 'gym_A', 'gym_B', 'athletic_A', 'athletic_B'], knee: ['RP_BKD', 'RP_UKD'], hip: ['RP_BHD', 'RP_UHD'], pull: ['RP_HPULL', 'RP_VPULL'], push: ['RP_HPUSH', 'RP_VPUSH'],
      refs: ['UNI-11', 'ORD-06', 'R4-SES-05'], status: 'approved rule (R4-SES-05), checked on the days that name a skeleton (fix round 2)' };
  }
  R.selection.slot_variants = { ...R.selection.slot_variants, RP_HPUSH: { ...((R.selection.slot_variants || {}).RP_HPUSH || {}), incline: { id_re: '^(incline-db-bench-press|incline-barbell-bench-press|alternating-incline-db-bench-press)', weight: 8 } } };
  // ATH-10 / R2-LIB-07 (04 olympic_by_level: hang pulls are the L1 list; L2 'power and hang variants with the barbell'; sample 04
  // major: 4 weeks of pulls with no catch, then the full lift from the floor): an L2 lifter's first exercise block takes the hang
  // power lifts, the next block the power lifts from the floor - one detail changes (hang to floor, PER-02)
  R.olympic.x2 = { l2_block1: { levels: ['L2'], ids: ['hang-power-clean-from-the-high-hang-hip-crease', 'hang-power-snatch-from-the-high-hang'], weight: 6, pull: -3 },
    refs: ['ATH-10', 'R2-LIB-07', 'PER-02'], status: 'approved ladder (ATH-10); the two hang power records are his reference-tab lifts, made selectable for this step (PROPOSED)' };
  // R2-SES-03 (sample 04 major, 02 minor): the core opener is light in every week - an effort cue, never the week's reps in the tank
  R.core_block = { ...R.core_block, x2: { opener_effort_key: 'effort.core_opener', refs: ['R2-SES-03', 'ATH-11'], status: 'approved rule (R2-SES-03: 2 exercises x 2 sets, short of failure, as a warm-up)' } };

  // ---- small rules from the minors
  // 03 minor (calves on four days a week at their top number from week 1; VOL-17 '3 sets of calves every time they do legs'): the
  // optional-day Calves slot is used below 3 main leg days; from 3 leg days the calves climb on the leg days
  R.volume.calves = { ...R.volume.calves, optional_slot_below_leg_days: 3, x2_status: 'fix round 2 (sample 03 minor): the optional-day Calves slot only below 3 main leg days (it was 4)' };
  // 03 minor (VOL-11 small muscles 12-30 reps; the 8-12 calf bracket was the team's): an athlete's calf raises run 12-15
  if (R.reps.matrix.calves && R.reps.matrix.calves.athletic) R.reps.matrix.calves.athletic = { ...R.reps.matrix.calves.athletic, bracket: 'b12_15' };
  // 03 minor ('never print an exercise at 1 set: drop it instead'): a pre-season optional-day exercise under 2 sets leaves the day
  R.placement.x2.pre_season_optional_min_sets = 2;
  // 02 / 03 / 04 minors: the plain pull-up record ('Pull-up', grip not stated in his list) is the library's basic pull-up, not a placeholder
  R.selection.generic_id_patterns = (R.selection.generic_id_patterns || []).map(x => (x === '-not-stated' ? '(?<!^pull-up-grip)-not-stated' : x));

  // ---- bootcamp circuits (sample 05 majors)
  // (the 'table row' is a home exercise - R2-LIB-08 never infer equipment: it stays the last resort of a kit with no other pull; a
  // field kit with dumbbells or kettlebells takes its rows from the library - select.mjs home_substitute_only_when_needed and the
  // small-kit rows below. The 'household' token stays in FIELD_TRACK_KIT: without it a kit-only field plan has no pull at all.)
  R.session.x2 = {
    // a circuit station the engine added (not one of the coach's own slots) that the kit cannot fill with a library exercise at
    // the client's level gives its place to the template's next station (R4-LIB-01 his live exercises are the picks; OT06 drops
    // the leg extension when there is no machine)
    circuit_kit_aware: { enabled: true, stand_in_buckets: ['ISO_QUAD', 'ISO_LEG_FLEXION'], stand_in_buckets_not_home: ['ISO_CHEST'], hand_over_buckets: ['RP_VPULL'], not_home_profiles: ['FIELD_TRACK_KIT', 'FULL_GYM', 'FULL_FACILITY', 'BASIC_GYM', 'HOTEL_GYM'],
      // OBSERVED dumps/BYOP/06_BOOTCAMP_OPTION_2: 1A two-leg knee lift, horizontal pull, single-leg hinge, (core,) cardio; 2A two-leg
      // hinge, horizontal push, biceps, vertical push, cardio; 3A vertical pull, single-leg knee lift, cardio, triceps, side raise
      own_slots: { day_re: '^BC([123])(_BW)?$', by_session: { 1: ['RP_BKD', 'RP_HPULL', 'RP_UHD', 'COND_CIRCUIT'], 2: ['RP_BHD', 'RP_HPUSH', 'ISO_BICEP', 'RP_VPUSH', 'COND_CIRCUIT'], 3: ['RP_VPULL', 'RP_UKD', 'COND_CIRCUIT', 'ISO_TRICEP', 'ISO_SIDE_REAR_DELT'] } } },
    refs: ['R4-LIB-01', 'R4-SES-04', 'OT06'], status: 'PROPOSED (fix round 2)'
  };
  R.selection.x2.circuit = {
    // no machine: the quad station is a live single-leg knee lift, the second hips station a live glute bridge / hip thrust
    stand_in: {
      ISO_QUAD: { bucket: 'RP_UKD', id_re: '^(front-foot-elevated-split-squat-lunge-ffe|stationary-lunge-split-squat|step-up-forward-and-lateral|reverse-lunge)$', why: 'why.circuit_stand_in' },
      ISO_LEG_FLEXION: { bucket: 'RP_BHD', classes: ['GLUTE_ISO'], also_buckets: ['RP_UHD'], why: 'why.circuit_stand_in' },
      // (the second chest station - the template's own note: 'second push-up variant' - in a kit with no fly: a push-up variant,
      // so the chest keeps its floor of 10 without a reference-only record, RECHECK v0.4 05 major)
      // (not in a home / body-weight kit: its one push-up at the client's level would only run twice in the session)
      ISO_CHEST: { bucket: 'RP_HPUSH', id_re: '(^|-)push-up', why: 'why.circuit_stand_in', when: 'no_candidate', not_home: true },
      // (a second back station that is a vertical pull, in a kit with no vertical pull and two or more rows: a rear-delt fly - it
      // stays on the pulling side, so the week keeps as many pulling as pressing stations, and it is no third copy of a row.
      // OPEN for the coach: the 05 reviewer would hand this station to the hips - a hip thrust -; with the chest's floor of 10
      // that leaves 3 pulling stations against 4 presses.)
      RP_VPULL: { bucket: 'ISO_SIDE_REAR_DELT', classes: ['ISO_REAR'], why: 'why.circuit_hand_over', when: 'no_vertical_pull', not_own: true }
    },
    // a session's first row is a two-arm row (R4-SES-05 Day A slot 1; sample 05 major)
    lead_row_two_arm: -6,
    // a vertical-pull slot the kit cannot fill takes a row of another family than the week's rows and says it loses the vertical pull
    vpull_stand_in_loses: 'swap.loses.vertical_pull',
    // (CAT-07 default pick first; sample 05 minor: the palms-up raise before the standard one) the plain record first
    refs: ['R4-SES-05', 'R4-LIB-01', 'R4-LIB-04', 'OT06'], status: 'PROPOSED (fix round 2)'
  };
  // R4-LIB-04 'one short line on what the swap keeps and loses' - the second reviews listed lines that were not true ('keeps the
  // jump' for a KB swing, 'same movement' for a sit-up and a superman, 'loses the feel of the original implement' for a weighted
  // pull-up against a pull-up): the notes read the pick's own quality, the load, the range and the trunk action
  R.selection.x2.swap_notes = { enabled: true, core_same_function: true, refs: ['R4-LIB-04'], status: 'approved rule (R4-LIB-04); the wording table is PROPOSED' };
  // sample 03 major: one press may be the alternating incline press for a profile whose two-arm target is 30 % or lower
  R.selection.x2.chest_slot_uni = { max_upper_target: 0.3, id_re: '^alternating-incline-db-bench-press', refs: ['UNI-02', 'UNI-03'], status: 'PROPOSED (fix round 2)' };
  // samples 02 / 03 / 04 minors: the weighted pull-up is an L3 pick (and not for a heavy athlete); the progression rule adds the load
  R.selection.x2.weighted_pull = { re: '^weighted-pull-up$', from_levels: ['L3'], not_heavy: true, penalty: -8, refs: ['CAT-05', 'R4-PRG-03', 'OBSERVED JUSTICE LEAGUE (strict pull-ups)'], status: 'PROPOSED weight' };
  // sample 08 majors (R2-LIB-03, VOL-03, R3-ATH-02): 'Swapped to protect your knee' only where a lift was swapped, naming it; the
  // swaps of a pain slot pass the same filters; a knee lift says where to stop
  R.selection.x2.pain_swap = { only_when_changed: true, refs: ['R2-LIB-03', 'VOL-03'] };
  R.selection.x2.swaps = { no_generic: true, pain_no_axial_high_levels: ['L1'], pain_prefer_first: true, refs: ['R4-LIB-04', 'R3-ATH-02', 'EQ-09'] };
  R.volume.pain = { ...R.volume.pain, x2: { depth_note: { area: 'knee', worse_with: 'deep_knee_bend', classes: ['BKD', 'UKD', 'LEG_EXTENSION'], note: 'note.pain_free_depth' }, said_up_front: true,
    refs: ['R3-ATH-02', 'VOL-03', 'R2-GEN-08'], status: 'approved rules (VOL-03 pain: cut, do not push it); the words are PROPOSED' } };
  // STATUS open question 8 (still open): the two-arm dumbbell rows of his reference tab are used as picks ONLY in a kit that holds no
  // library two-arm row - so a dumbbell / kettlebell kit does not repeat one row four times a week (sample 05 major)
  R.selection.x2.small_kit_rows = { ids: ['bent-over-db-or-kb-row-two-arm', 'chest-supported-row'], refs: ['R4-LIB-01', 'PER-04'], status: 'PROPOSED pending the coach\'s answer (STATUS open question 8): reference-tab rows as picks only when the kit holds no library two-arm row' };
  // the order of a circuit (OT06 2A: hinge, press, curl, press, cardio - the curl between the presses; ORD-04; UNI-11)
  R.supersets.bootcamp.x2 = {
    order: { spine: true, same_group: 3, shared_helper: 1.5, iso_before_its_compound: 4, added_before_own_same_group: 5, compound_after_iso: 0.5, h_before_v: 10 },
    // PRG-03 '3-5 rounds, 30-50 s'; OBSERVED FAT BURN ramp 3 x 30 s, 4 x 35 s, 4 x 40 s, 5 x 50 s: the work time moves in 5-s
    // steps and holds between them (the held week adds load), and one more round comes in the last weeks
    work_s_values: [35, 40, 45, 50], rounds_late: { add: 1, last_weeks: 2 },
    refs: ['PRG-03', 'OT06', 'ORD-04', 'UNI-11', 'CX-02', 'R4-PRG-01'], status: 'PROPOSED (fix round 2): the order weights and the two-week round step'
  };

  // sample 03 major: the back keeps its sport-scaled final sets (never lifted for the balance); a rear-delt exercise counts on the pull side
  // (capped_slack: while the back sits on its number for the week a press may lead the pulls by this many sets - 'balance this
  // out' is not 'never one set apart'; without it a libero's overhead press sat at 2 sets for 12 weeks under a 3-set face pull,
  // or the back was pulled to its final sets three weeks early. PROPOSED.)
  R.volume.push_pull = { ...R.volume.push_pull, back_cap: 'planned', capped_slack: 1, pull_classes: uniq([...(R.volume.push_pull.pull_classes || []), 'ISO_REAR', 'FACEPULL']),
    x2_status: 'fix round 2 (sample 03 major): VOL-18 only says \'balance this out\' - the balance is met by holding the presses, the back is never raised above its sport-scaled final sets unless it is a Focus muscle; reverse flies and face pulls count as pulling' };
  void uniq;
  return R;
}

/**
 * fix round 2 template amendments (after amendTemplatesX1).
 * @param {object} families @returns {object}
 */
export function amendTemplatesX2(families) {
  const F = clone(families);
  const eachDay = (fn) => {
    for (const [fam, f] of Object.entries(F)) for (const [d, t] of Object.entries(f.days || {})) {
      for (const [name, def] of Object.entries(t.day_types || {})) fn(def, { fam, days: d, variant: null, name, template: t });
      for (const [vn, v] of Object.entries(t.variants || {})) for (const [name, def] of Object.entries((v && v.day_types) || {})) fn(def, { fam, days: d, variant: vn, name, template: t, vdef: v });
    }
  };
  const isCounted = (s) => typeof s.rank === 'number' && s.rank < 99;
  const reRank = (order) => { order.forEach((s, i) => { s.rank = i + 1; }); };

  // ---- the CrossFit-style class (sample 04 majors)
  // (a) the class days name their skeleton, so the validator and the benchmark judge them against the template and the lunge and the
  //     single-leg hinge stay single-leg lifts in every exercise block (R4-SES-05; ENGINE_V05_PLAN 'his templates are the skeleton')
  eachDay((def, at) => {
    if (at.fam !== 'hybrid_crossfit') return;
    const id = CLASS_SKELETONS[at.name];
    if (id && !def.skeleton) def.skeleton = id;
  });
  // (b) the single-leg knee lift of fix round 1 sat on the deadlift + push day with no pull partner (UNI-11 / ORD-06, R4-SES-05:
  //     knee-dominant goes with pull, hip-dominant with push; R2-ATH-04 the clean day is the squat-pattern day). It moves to the
  //     clean + pull day and pairs with that day's row; quads then train Monday and Friday and Thursday is his B day again.
  //     OPEN QUESTION for the coach (STATUS): this, or a lunge + row tri-set on the deadlift day as in his HYBRID sheet.
  eachDay((def, at) => {
    if (at.fam !== 'hybrid_crossfit' || at.variant !== 'crossfit_style_bootcamp') return;
    const st = def.stations;
    if (at.name === 'DEADLIFT') {
      const i = st.findIndex(x => x.bucket === 'RP_UKD');
      if (i >= 0) st.splice(i, 1);
      // (04 minor: all three chest lifts of the class week were flat; R4-LIB-03 incline first, his HYBRID bench slot alternates flat
      // and incline) the deadlift day's press is the week's incline press
      const press = st.find(x => x.bucket === 'RP_HPUSH');
      if (press) { press.variant = 'incline'; press.variant_text = 'incline'; press.note = 'hip + push (ORD-06): the week\'s incline press - the press day holds the flat one (R4-LIB-03; OBSERVED HYBRID bench slot: flat and incline alternate)'; }
      reRank(st.filter(isCounted));
    }
    if (at.name === 'CLEAN/PUSH' && !st.some(x => x.bucket === 'RP_UKD')) {
      const row = st.find(x => x.bucket === 'RP_HPULL'), pull = st.find(x => x.bucket === 'RP_VPULL');
      if (!row || !pull) return;
      const n = Math.max(...st.map(x => Number((/\.s(\d+)$/.exec(x.id) || [0, 0])[1]))) + 1;
      const lunge = { ...clone(pull), id: `${at.name}.s${String(n).padStart(2, '0')}`, bucket: 'RP_UKD', role: 'secondary', block: 'strength', group: 'quads', sets_hint: [2, 2], variant: null, variant_text: null,
        pair: 'P1', superset: row.superset || null,
        note: 'quads a second time in the week: a single-leg knee-dominant lift on the clean + pull day, paired with the row (knee + pull, UNI-11 / ORD-06 / R4-SES-05; R2-ATH-04 the clean day is the squat-pattern day; fix round 2 - PROPOSED, open question for the coach)' };
      row.pair = 'P1';
      st.splice(st.indexOf(row) + 1, 0, lunge);
      reRank(st.filter(isCounted));
    }
  });
  // ---- the 3-session bootcamp rotation (sample 05 majors; OBSERVED dumps/BYOP/06_BOOTCAMP_OPTION_2)
  // (a) the coach's own slots of each session are named in rules.session.x2.circuit_kit_aware.own_slots: a slot of his that the kit
  //     cannot fill keeps its place with the nearest pattern and says what it loses; a station the ENGINE added that the kit cannot
  //     fill with a library exercise gives its place to the template's next station (engine/week.mjs)
  // (b) session 1 (squat + pulls): its second back station is a vertical pull. A kit that holds none (no bar, no cable) and two
  //     or more rows makes that station a rear-delt fly (rules.selection.x2.circuit.stand_in.RP_VPULL; sample 05 major: the same
  //     two rows four times a week, back 16 sets). Session 2 keeps its ranks: with 7 stations it holds the second chest station,
  //     so the chest keeps its floor of 10 (RECHECK v0.4 05 major) - no template data changes for it.
  return F;
}

/** the skeleton ids of the CrossFit-style class days (OBSERVED 'CLASS PROGRAMMING SPLIT': squat, press + snatch, deadlift, clean) */
export const CLASS_SKELETONS = { SQUAT: 'class_squat', PRESS: 'class_press', DEADLIFT: 'class_deadlift', 'CLEAN/PUSH': 'class_pull' };

/**
 * fix round 2 sport-profile amendments (after amendSportX1).
 * @param {object} sport @returns {object}
 */
export function amendSportX2(sport) {
  return clone(sport);
}

/** fix round 2 words: key -> [EN, ES]. Every key wins over the earlier layers. */
export const UI_X2 = {
  'exercise.side-plank-press-advanced-star-side-plank-press.name': ['Side Plank Press', 'Plancha lateral con press (Side Plank Press)'],
  'warning.laterality_capped': ['Two-leg lifts are about {share} % of your lower-body lifting sets (your sport\'s guide is about {target} %): the coach\'s A and B days keep a two-leg squat and a two-leg hinge. If you want more single-leg work, use the single-leg swap of one of them.', 'Los ejercicios a dos piernas son cerca del {share} % de tus series de tren inferior (la guía de tu deporte es cerca del {target} %): los días A y B del entrenador mantienen una sentadilla y una bisagra a dos piernas. Si quieres más trabajo a una pierna, usa el cambio a una pierna de uno de ellos.'],
  'note.pain_instead_of': ['Instead of {instead}, to protect your {area}.', 'En lugar de {instead}, para cuidar tu {area}.'],
  'note.pain_free_depth': ['Stop at the depth that stays pain-free: set the stops or use a box.', 'Baja solo hasta donde no duela: pon los topes o usa un cajón.'],
  'note.pain_swap': ['Chosen to protect your {area}', 'Elegido para cuidar tu {area}'],
  'pain.area.knee': ['knee', 'rodilla'], 'pain.area.shoulder': ['shoulder', 'hombro'], 'pain.area.lower_back': ['lower back', 'espalda baja'], 'pain.area.upper_back': ['upper back', 'espalda alta'],
  'pain.area.hip_groin': ['hip or groin', 'cadera o ingle'], 'pain.area.ankle_foot': ['ankle or foot', 'tobillo o pie'], 'pain.area.elbow': ['elbow', 'codo'], 'pain.area.wrist_hand': ['wrist or hand', 'muñeca o mano'],
  'pain.area.neck': ['neck', 'cuello'], 'pain.area.other': ['sore area', 'zona adolorida'],
  'warning.pain_plan': ['You told us about pain in your {area} ({trigger}). What this plan does about it: it leaves out the lifts that load it hardest and says so on the lift, it holds {groups} at the same sets instead of adding more (progress with reps and load), and it tells you where to stop on the lifts that bend it. If the pain grows, stop and see a professional.', 'Nos dijiste que tienes dolor en {area} ({trigger}). Lo que hace este plan: deja fuera los ejercicios que más cargan esa zona y lo dice en el ejercicio, mantiene {groups} en las mismas series en lugar de sumar más (progresa con repeticiones y carga) y te dice dónde parar en los ejercicios que la doblan. Si el dolor aumenta, detente y consulta a un profesional.'],
  'warning.pain_plan_plain': ['You told us about pain in your {area}. What this plan does about it: it leaves out the lifts that load it hardest and says so on the lift, and it holds {groups} at the same sets instead of adding more (progress with reps and load). If the pain grows, stop and see a professional.', 'Nos dijiste que tienes dolor en {area}. Lo que hace este plan: deja fuera los ejercicios que más cargan esa zona y lo dice en el ejercicio, y mantiene {groups} en las mismas series en lugar de sumar más (progresa con repeticiones y carga). Si el dolor aumenta, detente y consulta a un profesional.'],
  'pain.trigger.deep_knee_bend': ['worse with deep knee bends', 'peor con flexiones profundas de rodilla'], 'pain.trigger.overhead': ['worse overhead', 'peor por encima de la cabeza'], 'pain.trigger.impact': ['worse with impact', 'peor con impacto'], 'pain.trigger.twisting': ['worse with twisting', 'peor con giros'],
  'swap.loses.isolation': ['the isolation - this one brings other muscles in', 'el aislamiento: este suma otros músculos'],
  'swap.loses.core_action': ['the same trunk action - this one trains the core another way', 'la misma acción del tronco: este trabaja el core de otra forma'],
  'swap.loses.external_load': ['the added load', 'la carga extra'],
  'why.circuit_hand_over': ['Your kit holds no vertical pull: this station is a rear-delt fly instead of one more row', 'Tu equipo no tiene tirón vertical: esta estación es una apertura posterior en lugar de un remo más'],
  'why.circuit_stand_in': ['No machine for this station in your kit: a library lift for the same muscle takes its place', 'Sin máquina para esta estación en tu equipo: un ejercicio de la biblioteca para el mismo músculo toma su lugar'],
  'swap.loses.vertical_pull': ['the vertical pull (a pull-up bar, a cable or a TRX would bring it back)', 'el jalón vertical (una barra de dominadas, una polea o un TRX lo devolverían)'],
  'warning.no_vertical_pull': ['With this equipment the plan has no vertical pull (pull-up or pulldown): its place is taken by a row or a rear-delt fly. A pull-up bar, a cable or a TRX would add it.', 'Con este equipo el plan no tiene jalón vertical (dominada o jalón en polea): un remo o una apertura posterior ocupa su lugar. Una barra de dominadas, una polea o un TRX lo agregarían.'],
  'effort.core_opener': ['easy and controlled: stop well before it gets hard', 'fácil y controlado: detente mucho antes de que se ponga difícil'],
  'effort.buyout_sprint': ['all-out sprint', 'sprint a tope'],
  'note.buyout': ['Buy-out: a short all-out sprint to finish the session. With more than one bout, rest until you can go all-out again.', 'Cierre: un sprint corto a tope para terminar la sesión. Con más de una repetición, descansa hasta poder ir a tope otra vez.'],
  'why.template_extra_station': ['The template\'s own extra exercise at the end of the day: a small-muscle exercise for {group}', 'El ejercicio extra de la propia plantilla al final del día: un ejercicio de músculo pequeño para {group}']
};
