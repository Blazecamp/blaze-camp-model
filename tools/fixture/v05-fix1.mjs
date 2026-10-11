// tools/fixture/v05-fix1.mjs - engine 0.5.0, fix round 1 (the coach-eye reviews of the 8 sample plans). Applied after
// v05-integrate.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/*.json keeps deep-equalling
// the fixture (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source:
// COACH-R4 (coach_answers_round4.md), CT-01, CX-01..04, an earlier coach answer, OBSERVED (dumps/BYOP), INFERRED or PROPOSED.
// Binding plan: design/ENGINE_V05_PLAN.md; decisions: engine/DECISIONS.md section G (G-58 ...); status: samples/STATUS_v0.5.md.
//
// What fix round 1 changes in the model (each item is a finding of a coach-eye review of a regenerated sample):
//   * THE ATHLETIC A / B / C DAYS KEEP EACH SLOT'S LATERALITY TOO (R4-SES-05 slot 2 'knee-dominant movement, bilateral ... a squat',
//     'bilateral, symmetrical hip-dominant movement'; R2-SES-01, PER-04): the athlete dial acts on the slots the skeleton leaves open.
//   * THE 'CHEST / SHOULDERS' SLOT (OBSERVED BYOP label of the B day's slot 3; R4-SES-05 'shoulder press or an incline press'): a
//     high-incline press also counts half a set for chest, and one B day a week takes a 30-45 degree incline press.
//   * THE FLOOR OF 10 IS HELD ON THE TRAINING DAYS (R2-VOL-06; ORD-10 / R4-SES-05 'optional days are bonuses').
//   * ... (see each block below)

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniq = (a) => [...new Set(a)];

/** the skeletons whose slots name their laterality (R4-SES-05): the gym days, push / pull / legs and - fix round 1 - the athletic days */
export const PINNED_SKELETON_PREFIXES_X1 = ['gym_', 'ppl_', 'athletic_'];

/** the high-incline presses of the vertical / mid-range push slot (the coach's 'more vertical than horizontal' incline) */
export const HIGH_INCLINE_PRESSES = ['high-incline-db-press', 'high-incline-seated-barbell-press', 'high-incline-seated-db-press'];

/**
 * fix round 1 record amendments (after amendExerciseV4).
 * @param {object} ex0 @returns {object}
 */
export function amendExerciseX1(ex0) {
  const ex = clone(ex0);
  const refs = new Set(ex.rule_refs || []);
  const tags = new Set(ex.tags || []);
  // the 'Chest / Shoulders' slot: a high-incline press is a shoulder press that counts half a set for chest (rules.credit.classes.MRPUSH)
  if (HIGH_INCLINE_PRESSES.includes(ex.id)) { ex.credit_class = 'MRPUSH'; ex.credits = { front_delts: 1, chest: 0.5, triceps: 0.25 }; refs.add('R4-SES-05'); refs.add('R4-LIB-03'); }
  // a single-leg sit-to-stand from a bench is a deep one-leg knee bend under full body weight (sample 08 major: picked 'to protect
  // the knee' of a 52-year-old whose pain is worse with deep knee bends)
  if (/^single-leg-get-up/.test(ex.id)) tags.add('deep_knee_flexion');
  // a barbell lift has no 'each hand moves on its own' (the swap line said a hex-bar deadlift 'loses each hand moving on its own')
  if (['stiff-leg-deadlift-rdl', 'bent-over-barbell-row'].includes(ex.id)) { tags.delete('split_grip'); tags.add('fixed_grip'); }
  // a fly is an isolation exercise (credit class ISO_CHEST): the library row said 'compound', so a fly took a compound's reps and
  // was no candidate for the day's MYO set in a reader that asks the exercise (bench 58)
  if (ex.credit_class === 'ISO_CHEST' && ex.exercise_class === 'compound') ex.exercise_class = 'isolation';
  ex.tags = [...tags].sort();
  ex.rule_refs = [...refs].sort();
  return ex;
}

/**
 * fix round 1 rule amendments (after amendRulesV4).
 * @param {object} rules @returns {object}
 */
export function amendRulesX1(rules) {
  const R = clone(rules);

  // ---- the athletic A / B / C days keep each slot's laterality (R4-SES-05; 02 major, 08 major, 03 minor, 01 minor)
  const SL = R.selection.skeleton_laterality;
  SL.skeleton_prefixes = PINNED_SKELETON_PREFIXES_X1.slice();
  SL.lead_row = { ...SL.lead_row, skeletons: uniq([...(SL.lead_row.skeletons || []), 'athletic_A']) };
  SL.refs = uniq([...(SL.refs || []), 'R2-SES-01', 'PER-04', 'UNI-10']);
  SL.status = 'approved rule (R4-SES-05: his template names each slot\'s laterality; OBSERVED BYOP categories and JUSTICE LEAGUE \'Bilateral KD\' / \'Unilateral KD\'); fix round 1: the athletic A / B / C days keep it too - his newest answer wins over the dial (UNI-02 / UNI-03), which now acts on the slots the skeleton leaves open (the vertical pull, S3\'s row, the isolation details, the jump stations); the penalty weight is PROPOSED';
  const V5 = R.validation.v05;
  V5.skeleton = { ...V5.skeleton, laterality_skeleton_prefixes: PINNED_SKELETON_PREFIXES_X1.slice() };

  // ---- the 'Chest / Shoulders' slot (OBSERVED BYOP label of the B day's slot 3; R4-SES-05 'vertical push, like shoulder press or an
  // incline press'; samples 01 / 02 / 06 / 08): a high-incline press is a shoulder press that also counts half a set for chest
  R.credit.classes.MRPUSH = { front_delts: 1, chest: 0.5, triceps: 0.25 };
  R.credit.exceptions = { ...(R.credit.exceptions || {}), MRPUSH: 'fix round 1: a high-incline (mid-range) press 1.0 front delts + 0.5 chest - a shoulder press that also trains the upper chest, like the thruster\'s 1.0 + 0.5 (PROPOSED; OBSERVED BYOP slot label \'Chest/Shoulders\'; open question for the coach)' };
  R.credit.refs = uniq([...(R.credit.refs || []), 'R4-SES-05', 'R4-LIB-03']);

  // ---- volume: the floor on the training days, pulling against pressing, calves with no optional day
  R.volume.floor = {
    ...R.volume.floor,
    counted_on: 'main_days',
    counted_on_refs: ['R2-VOL-06', 'ORD-10', 'R4-SES-05', 'R4-SES-04'],
    x1_status: 'fix round 1 (sample 01 major): the floor of 10 is held by the training days\' own exercises; the optional day adds on top (ORD-10 / R4-SES-05 \'optional days are bonuses\'); a group that reaches it only with the optional day is said up front (warning.floor_needs_optional_day)'
  };
  R.volume.push_pull = {
    applies_from: 1,                 // a sport profile whose pull_per_push is 1 or more
    min: 1, max: 1.25,               // the ratio the allocation aims for: the profile's own, held inside 1 ... 1.25
    hard: 1,                         // a press never takes a set that would put the week's pressing sets above its pulling sets
    push_classes: ['HPUSH', 'VPUSH', 'MRPUSH', 'DIPS'],
    pull_classes: ['HPULL', 'VPULL'],
    pull_group: 'back',
    exempt_focus_lines: ['chest', 'shoulders', 'triceps'],
    refs: ['VOL-18', 'R3-VOL-01', 'OBSERVED BYOP ATHLETIC (4 pull slots : 4 push slots)'],
    status: 'fix round 1 (samples 02 / 03 major): VOL-18 \'we need to balance this out\'; the profile ratios are 04 values (many proposed), so the allocation holds them inside 1 ... 1.25 (PROPOSED bound); the back may pass its sport-scaled final sets for the balance, never the level\'s own top number (R4-PRG-04)'
  };
  R.volume.calves = {
    ...R.volume.calves,
    climb_without_optional: true,
    x1_status: 'fix round 1 (sample 07 major): with no optional-day Calves slot the leg days\' calf exercise climbs 3 -> 4 -> 5 to the weekly floor (VOL-17 \'treated like any other muscle\')'
  };
  // field / court athletes: shoulders are one group with the upper factor, never above the back (R3-VOL-01; sample 03 major)
  R.volume.x1 = {
    shoulders_athlete: { modifiers: ['field_off', 'strength_athlete_off'], factor: 'upper', cap_line: 'lats_upper_back' },
    // the direct sets a muscle holds whatever its group's credit: side delts on a physique plan (R2-VOL-04 'side delts are a small
    // muscle with biceps and triceps ... 8 sets a week is probably just barely maintenance'; sample 07 major)
    direct_min: { side_delts: { group: 'shoulders', families: ['aesthetics'], by_level: { L1: 4, L2: 6, L3: 8 } } },
    refs: ['R3-VOL-01', 'UNI-02', 'VOL-17'],
    status: 'fix round 1 (samples 01 / 03): for a competitive athlete the shoulders line takes the upper-body factor (it was classed small and kept more growth room than chest or back) and its final sets never pass the back\'s (PROPOSED reading of R3-VOL-01 \'field athletes: side delts and arms stay helper work\')'
  };

  // ---- placement: who takes a group's sets
  R.placement.bonus = { ...R.placement.bonus, sets: [2, 4], x1_status: 'fix round 1 (samples 04 / 06): the bonus exercise may run 2 -> 4 sets (VOL-07 \'more of a muscle comes as a bonus exercise\'); 4 is PROPOSED' };
  R.placement.x1 = {
    // an isolation exercise at the end of a training day: 2-3 sets, a 4th in the hardest weeks only
    iso_main_day_max: { default: 3, hardest: 4, phase: 'HARDEST' },
    // the class lift (the day's 'work' lift of the CrossFit-style class) never starts under its sheet's sets
    work_min_from_hint_families: ['hybrid_crossfit'],
    // the steps of the stairway: a Focus muscle's own exercises first; on a physique plan the shoulders' steps go to the side raises
    step_first: { focus: true, group_muscle: { shoulders: { families: ['aesthetics'], muscle: 'side_delts' } } },
    test_week_no_step_on_tested: true,
    // in season, a session the client's days put on the eve of a game is the week's lighter one (the engine's day rule 'hard day
    // >= 48 h before a game', R2-ATH-07; bench 33): at least `lighter_by` set under the week's other training day, no lift under
    // `keep_sets`
    eve_of_game: { lighter_by: 1, keep_sets: 2, refs: ['R2-ATH-07'], status: 'PROPOSED (fix round 1)' },
    keep_climb_when_capped: true,
    // the bonus exercise a group needs is open from the block's first week (no '+2 sets' when a later exercise block starts)
    bonus_from_block_start: true,
    // the 8th exercise of a training day: a second small-muscle exercise at the end of a day that already trains the group
    main_day_extra: { groups: ['biceps', 'triceps', 'shoulders', 'chest'], sets: [2, 3], per_day: 1 },
    capped_notice: { focus: true, below_start: true, big_below_share: 0.8 },
    refs: ['VOL-16', 'VOL-07', 'R3-SES-01', 'R2-VOL-04', 'R2-PER-07', 'R2-PER-03', 'CX-04', 'OT17', 'OT18'],
    status: 'fix round 1 (the coach-eye reviews of samples 01 / 04 / 06 / 07): VOL-16 \'3 sets on compounds, 2 on isolation\' and VOL-07 read as an isolation ceiling of 3 (4 in the hardest weeks) - the numbers are PROPOSED; R3-SES-01 \'bias more toward glutes ... an extra set or two or three\'; R2-PER-07 the test replaces the top set; a capped group still climbs (R2-PER-03) - PROPOSED; the up-front notice only for a Focus group, a group under its level\'s start or a big group under 80 % of its final sets (CX-04) - PROPOSED'
  };

  // ---- the stairway: the groups' steps are fitted together
  R.stairway.progression = {
    ...R.stairway.progression,
    stagger: { enabled: true, weeks_early: 1 },
    stagger_refs: ['R3-VOL-04', 'R2-PER-03', 'R2-PER-04', 'R4-PRG-01'],
    stagger_status: 'fix round 1 (samples 01 / 02 / 03 / 06 / 08): the week\'s total follows the sum of the groups\' curves and the groups take turns (largest remainder), so the plan climbs a set or two most weeks; the last steps are shared between the last two weeks (R4-PRG-01: one week early is fine)'
  };

  // ---- selection weights of fix round 1 (engine/select.mjs x1Score; every weight PROPOSED)
  R.selection.x1 = {
    // the athlete's heavy squat and hinge (OBSERVED BYOP JUSTICE LEAGUE E8 'Front Squats', E35 'Low Bar Back Squat'; sample 02 major)
    work_prefer: {
      families: ['athletic'], levels: ['L2', 'L3'], weight: 4, step: 0.5,
      patterns: {
        RP_BKD: ['^front-squat-barbell$', '^low-bar-back-squat$', '^high-bar-back-squat$'],
        RP_BHD: ['^hex-trap-bar-deadlift$', '^barbell-deadlift-conventional$', '^stiff-leg-deadlift-rdl$']
      }
    },
    // the laterality dials weigh a station by the sets the plan gives it (second pass), not by its template minimum (sample 04:
    // the lower share landed 15 points under its target)
    // the Kong row is for a client with shoulder or back pain (LIB-09); for anyone else it is the last choice of its slot
    pain_only: { re: '^kong-row', areas: ['shoulder', 'lower_back', 'upper_back', 'neck'], penalty: -12, refs: ['LIB-09', 'R4-LIB-01'] },
    // a nearest-pattern stand-in is a library lift (used again in the week if need be) before a reference-only or program-only record
    stand_in_library_first: true,
    // a template lift keeps its credit class into the next exercise block while a lift of that class passes (PER-02; H21)
    keep_class_at_block_change: true,
    dial_reads_plan_sets: true,
    // the second pass keeps its picks while no group is lost, none falls under its floor and none ends more than this many sets
    // under the first pass's final sets (a pick with less helper credit; CT-01: there are no minutes to hold)
    second_pass_top_tolerance: 1,
    // the class's strict press (rules.selection.r2.class_press) is picked in both passes
    class_press_both_passes: true,
    // the second squat / hinge day of an athletic week (R2-SES-01 approved; PER-04 'one day of squatting and the other day of leg
    // pressing'; R4-SES-05 slot 2 'a deadlift, a hip extension, or ... a hip thrust')
    second_day_prefer: {
      skeleton_prefixes: ['athletic_'], weight: 7,
      patterns: {
        RP_BKD: ['^leg-press-machine$', '^hack-squat-machine$', '^belt-squat-machine$', '^pendulum-squat-machine$'],
        RP_BHD: ['^barbell-hip-thrust$', '^hip-thrust-machine$', '^45-degree-hyperextension-back-hip-extension$', '^reverse-hyperextension$']
      }
    },
    // pain: the supported lift (rules.volume.pain.areas[].prefer_tags) on the day's work slot (VOL-03, EQ-03 / EQ-04)
    pain_work: { weight: 6 },
    // a step under the client's level (CAT-04): the heavy lift of the day; a trained lifter's core
    below_ladder: { work_levels: ['L2', 'L3'], work_per_step: -1.5, core_levels: ['L3'], core_per_step: -1.5 },
    // the lead chest press (R4-SES-05 'horizontal pushing, like bench press or machine chest press'; OBSERVED BYOP HORIZONTAL PUSH)
    lead_press: {
      staples_re: '^(flat-db-bench-press|barbell-bench-press|machine-bench-press)$', staple_weight: 2, staples_no_above_level: true,
      unstable_re: '^(standing-cable-chest-press|alternating-standing-cable-press-one-forward-one-back)$', unstable_penalty: -4,
      incline_re: 'incline', incline_penalty: -6
    },
    // the 'Chest / Shoulders' slot (OBSERVED BYOP label; R4-SES-05 'shoulder press or an incline press'): the week's first B day
    // takes a 30-45 degree incline press
    chest_shoulders: {
      bucket: 'RP_VPUSH', lead_bucket: 'RP_HPUSH', skeleton_re: '^(gym|athletic)_B$', per_week: 1, min_b_days: 2, two_day_plan: true,
      incline_re: '^(incline-db-bench-press|incline-barbell-bench-press)$', weight: 10,
      not_families: [], not_lift_styles: []
    },
    // the gym's own machine keeps the leg-extension and leg-curl slots (EQ-08: sissy squats and Nordics are the no-machine swap);
    // athletes keep the Nordic curl (hamstring care)
    iso_machine_first: {
      not_families: ['athletic'], penalty: -8,
      buckets: {
        ISO_QUAD: { machine_ids: ['leg-extension-machine'], avoid_re: '^(sissy-squat|db-leg-extension-seated-on-box)$' },
        ISO_LEG_FLEXION: { machine_ids: ['seated-leg-curl-machine', 'lying-leg-curl-machine'], avoid_re: 'nordic|slider|ball-hamstring|prone-dumbbell' }
      }
    },
    // a core family once a week (PER-04 'the second time ... a different exercise')
    core_families: [
      { id: 'front_plank', re: '^(plank-forearm|high-plank|plank-with|plank-shoulder|plank-db|plank$)', week_max: 1 },
      { id: 'side_plank', re: 'side-plank|star-side', week_max: 1 },
      { id: 'twist', re: 'russian-twist', week_max: 1 },
      { id: 'leg_raise', re: 'leg-raise|reverse-crunch|v-up|knees-to-chest', week_max: 1 }
    ],
    core_family_over_week: -5,
    // an exercise the week already holds in another slot kind (the incline press of the 'Chest / Shoulders' slot) is not picked again
    cross_bucket_repeat: -6,
    refs: ['R4-SES-05', 'R2-SES-01', 'PER-04', 'VOL-03', 'EQ-03', 'EQ-08', 'CAT-04', 'R4-LIB-03'],
    status: 'PROPOSED (fix round 1): selection weights from the coach-eye reviews of the 8 samples; the lists are INFERRED from the catalog ids and his sheets'
  };
  // (sample 07 minor: his push day's second triceps slot is 'Tricep - Overhead' - an overhead extension, not a second lying one;
  // OBSERVED BYOP PUSHPULLLEGS, MASTER_MODEL 'Overhead DB Tricep Ext.')
  if (R.selection.slot_variants && R.selection.slot_variants.ISO_TRICEP) R.selection.slot_variants.ISO_TRICEP.overhead = { ...R.selection.slot_variants.ISO_TRICEP.overhead, id_re: 'overhead', strict: true };
  // (sample 07 minor: both pull days led with a bent-over barbell row, each the day before a heavy squat or deadlift - PER-04 'the
  // second time ... a different exercise', his reason: not loading the lower back twice a week) one bent-over barbell row a week
  if (R.selection.r2 && Array.isArray(R.selection.r2.families) && !R.selection.r2.families.some(f => f.id === 'bent_over_barbell_row')) {
    R.selection.r2.families.push({ id: 'bent_over_barbell_row', re: '^bent-over-barbell-row', week_max: 1 });
  }
  // (sample 07 minor: the tested deadlift of a powerlifting-style plan was a sumo deadlift because the catalog files it one level
  // above the conventional one - stance is a build and preference choice, EQ-09 / EQ-10)
  if (R.selection.f3 && R.selection.f3.powerlifting_canonical) R.selection.f3.powerlifting_canonical.prefer = { ...R.selection.f3.powerlifting_canonical.prefer, RP_BHD: '^barbell-deadlift-conventional$' };

  // ---- late off-season: the 6-8 phase (PER-11 'VOL 1 early, VOL 2 mid, VOL 3 late off-season / pre-season', coach RIGHT; sample 03
  // major: a late off-season stairway of one exercise block held 8-12 for all six weeks). The step was built in fix round 1 / F3 and
  // left off with an open question about minutes, which CT-01 removed.
  if (R.reps.athlete_vol_phases && R.reps.athlete_vol_phases.off_late_single_block_step) {
    R.reps.athlete_vol_phases.off_late_single_block_step = { ...R.reps.athlete_vol_phases.off_late_single_block_step, enabled: true,
      status: 'approved rule (PER-11); switched on in v0.5 fix round 1: a single-block late off-season stairway steps to the 6-8 phase after its halfway week (the open question was about minutes - CT-01 removed it)' };
  }

  // ---- the class WOD (sample 04 major): a barbell station prints a bar load; a for-time WOD climbs by its work
  const W = R.conditioning.wod;
  W.station_loads_lb = { ...W.station_loads_lb, barbell: { thruster: { L1: [35, 45], L2: [45, 65], L3: [65, 95], unit: 'barbell' } } };
  W.for_time_progress = { rounds_add: 2, refs: ['R2-PER-03', 'PRG-10'], status: 'PROPOSED (fix round 1): a for-time WOD adds up to 2 rounds over the stairway and its cap follows the work; the bar loads are PROPOSED (the class scales them)' };
  // (sample 04 minor: an EMOM minute of 8 jumping jacks; no pulling station although the rig is in the kit) jumping jacks are a
  // warm-up for a trained class member; the week's WODs hold one pulling or gymnastics station; one WOD movement at most twice a week
  W.x1 = { not_above_l1_re: 'jumping-jack', weekly_must_have_pull: true, pull_re: '^(pull-up|chin-up-supinated|inverted-row|toes-to-bar-hanging|knees-to-chest-hanging|ring-row)', group_week_max: 2,
    refs: ['PRG-10', 'OBSERVED CrossFit sheet (T2B, gymnastics)'], status: 'PROPOSED (fix round 1)' };

  // ---- the athletic layer (samples 03 / 08 majors)
  R.athletic.x1 = {
    // the weekly athletic numbers of a profile the coach has not confirmed are written for his 4-day athletic sheet
    scale_by_days: { reference_days: 4, floor: 0.75, confidences: ['proposed', 'similar_sport'], keys: ['plyo_contacts', 'jump_contacts', 'low_contacts', 'throws', 'cod_cuts', 'sprint_m'], step: { sprint_m: 50 } },
    // a pre-season block keeps the set each athletic station took down the off-season stairway (R2-PER-06 'more speed and power')
    pre_season_keep_sets: true,
    // a change-of-direction sport jumps on every day that has a Plyo slot (OBSERVED BYOP ATHLETIC: every quality on every day)
    cod_sport_jump_every_day: true,
    // heavy-play weeks (R3-ATH-05 'half the jumps'): one jump station a day, a throw where the cuts were dropped (ATH-05)
    heavy_play: { one_jump_station_a_day: true, throw_replaces_cuts: true },
    // 50+ court players, older adults, a painful knee or ankle: the low box in every stage (R3-ATH-02, EQ-16)
    low_impact_low_box: true,
    refs: ['R2-PER-06', 'R3-ATH-02', 'R3-ATH-05', 'ATH-05', 'EQ-16', 'R4-SCP-03', 'OBSERVED BYOP ATHLETIC - FULL BODY - 4 DAYS'],
    status: 'PROPOSED (fix round 1): the 4-day reference and the 0.5 floor of the day scale; the rest are readings of approved answers'
  };
  if (R.athletic.r2 && R.athletic.r2.pre_season_hold) {
    R.athletic.r2.pre_season_hold = { ...R.athletic.r2.pre_season_hold, keys: uniq([...(R.athletic.r2.pre_season_hold.keys || []), 'plyo_contacts', 'jump_contacts']),
      x1_status: 'fix round 1 (sample 03 major): the jumps hold too - a pre-season block plans at least the last off-season week\'s jump contacts where its stations hold them' };
  }
  R.selection.x1.care_slot_prefer = 4;
  R.selection.x1.olympic_split_grip = { from_age: 50, barbell: -3, split: 2 };
  R.selection.x1.low_impact_heights = { prefer_re: 'low-box|stick-the-landing|hop-on', avoid_re: 'mid-box|high-box|knee-height|depth-jump', prefer: 3, avoid: -6 };
  R.warmup.x1 = { balance_from_older_only: true, refs: ['R3-ATH-02', 'ORD-08', 'R4-LIB-01'], status: 'fix round 1 (sample 08 minor): the balance and reactive-stepping warm-up is the 60+ default; a 50-59 court player keeps the mobility / drills prep' };

  // ---- joint care lives inside the template's own slots (sample 08 majors; R4-SES-02 the count excludes only the warm-up and the
  // 2 core exercises): the calf raise is the Achilles care, the leg extension the knee care, the rear-delt slot the shoulder care
  R.prehab.x1 = {
    in_template_slot: {
      ACHILLES_CALF: [{ bucket: 'ISO_CALF' }],
      KNEE_DEGENERATIVE_COURT: [{ bucket: 'ISO_QUAD' }],
      'AGE_50_RACKET:PREHAB_LOWER': [{ bucket: 'ISO_CALF' }],
      'AGE_50_RACKET:RECOVERY_ARM_CARE': [{ bucket: 'ISO_SIDE_REAR_DELT', variant: 'rear' }],
      SHOULDER_THROWER: [{ bucket: 'ISO_SIDE_REAR_DELT', variant: 'rear' }]
    },
    never_status: ['reference_only', 'program_only'],
    refs: ['R4-SES-02', 'R3-ATH-02', 'VOL-17', 'R4-LIB-01'],
    status: 'PROPOSED (fix round 1): which template slot serves which joint-care code'
  };
  // the non-competitive athletic adult: his own sheet's size (OBSERVED dumps/BYOP/04_JUSTICE_LEAGUE: 10 slots a day)
  R.session.size.by_type.stay_active = { ...R.session.size.by_type.stay_active, range: [5, 10], default: 10,
    status: 'fix round 1 (sample 08 major): OBSERVED BYOP JUSTICE LEAGUE - 10 slots a day; the count now holds every exercise outside the warm-up and the 2 core exercises (R4-SES-02)' };

  // ---- the last week's intensifier (VOL-15; OBSERVED BYOP ATHLETIC G12 'MYO SET' on the leg extension; VOL-03 never on a painful muscle)
  R.effort.intensifiers = { ...R.effort.intensifiers, never_pain_muscle: true,
    x1: { no_calves_with_tests: ['speed_agility', 'jumps'], calves_last_resort: true, two_sided_first: true, main_days_only: true,
      refs: ['VOL-15', 'VOL-03', 'R2-PER-07', 'OBSERVED BYOP ATHLETIC G12'], status: 'PROPOSED (fix round 1): the order of the items that may carry it' } };

  // ---- rep ranges come from his menu (OBSERVED BYOP REPS menu; PER-11): a compound whose bracket runs past its own range takes the
  // nearest menu range inside it
  R.reps.rep_hint = { ...R.reps.rep_hint, x1: { menu: [[4, 6], [6, 8], [8, 10], [10, 12], [12, 15], [15, 20]], refs: ['PER-11', 'VOL-11', 'OBSERVED BYOP REPS menu'], status: 'PROPOSED (fix round 1): 8-10 and 10-12 as the capped steps between his 6-8, 8-12 and 12-15' } };

  // ---- tests: the tested lift opens the day's lifts; a squat / hinge test needs a lift that loads heavy
  R.tests.x1 = {
    tested_lift_first: true,
    lower_test_needs: { buckets: ['RP_BKD', 'RP_BHD'], load_ceilings: ['high'] },
    refs: ['R2-PER-07', 'ORD-02', 'R2-SES-01'],
    status: 'fix round 1 (samples 01 / 02): R2-PER-07 the test replaces the top set and is done fresh (tested lift first in the strength block, PROPOSED order); a rep max is taken on the week\'s counted spine lift or a lift with a high load ceiling, never on a back extension (PROPOSED)'
  };

  return R;
}

/**
 * fix round 1 template amendments (after amendTemplatesV4).
 * @param {object} families @returns {object}
 */
export function amendTemplatesX1(families) {
  const F = clone(families);
  const eachDay = (fn) => {
    for (const [fam, f] of Object.entries(F)) for (const [d, t] of Object.entries(f.days || {})) {
      for (const [name, def] of Object.entries(t.day_types || {})) fn(def, { fam, days: d, variant: null, name, template: t });
      for (const [vn, v] of Object.entries(t.variants || {})) for (const [name, def] of Object.entries((v && v.day_types) || {})) fn(def, { fam, days: d, variant: vn, name, template: t, vdef: v });
    }
  };
  const isCounted = (s) => typeof s.rank === 'number' && s.rank < 99;
  const station = (proto, over) => ({ ...clone(proto), ...over });
  const reRank = (def, order) => { order.forEach((s, i) => { s.rank = i + 1; }); };

  // ---- the third day of a 3-day athletic week is his 3-day builder's day 3 (OBSERVED dumps/BYOP/01_3_DAY_BUILDER day 3: two-leg
  // knee lift, two-leg hinge, horizontal pull, horizontal push, single-leg knee lift; sample 01 minor: the two-leg knee lift was
  // dropped and a vertical pull added). Pairs as on his A / B days: hip + push, knee + pull. The second knee exposure is non-axial
  // (leg press, belt squat, goblet: R2-SES-01, PER-04) because the day already holds the week's heavy hinge. The vertical pull stays
  // as the extra slot after the builder's five.
  eachDay((def, at) => {
    if (def.skeleton !== 'athletic_C') return;
    const st = def.stations;
    if (st.some(x => x.bucket === 'RP_BKD')) return;
    const row = st.find(x => x.bucket === 'RP_HPULL'), lunge = st.find(x => x.bucket === 'RP_UKD'), hinge = st.find(x => x.bucket === 'RP_BHD');
    if (!row || !lunge || !hinge) return;
    const ids = st.map(x => Number((/\.s(\d+)$/.exec(x.id) || [0, 0])[1]));
    const knee = station(lunge, {
      id: `${at.name}.s${String(Math.max(...ids) + 1).padStart(2, '0')}`, bucket: 'RP_BKD', role: 'secondary', group: 'quads', axial: 'non_axial', pair: row.pair, superset: row.superset,
      note: 'day 3: two-leg knee-dominant lift - the week\'s second knee exposure, non-axial: leg press, belt squat or goblet squat (OBSERVED BYOP 3 DAY BUILDER day 3; R2-SES-01, PER-04)'
    });
    lunge.pair = null; lunge.superset = null;
    st.splice(st.indexOf(row) + 1, 0, knee);
    for (const x of st) if (x.bucket === 'RP_VPULL') x.note = 'day 3: vertical pull - the extra slot after the builder\'s five (PROPOSED, V1 G-05: back twice a week)';
    // ranks: the first power piece, the builder's five lifts, the other athletic stations, then the extra pull and the calf raise
    const counted = st.filter(isCounted);
    const power = counted.filter(x => /^AP_/.test(x.bucket));
    const five = ['RP_HPUSH', 'RP_BHD', 'RP_HPULL', 'RP_BKD', 'RP_UKD'].map(b => counted.find(x => x.bucket === b)).filter(Boolean);
    const rest = counted.filter(x => !power.includes(x) && !five.includes(x));
    reRank(def, [...power.slice(0, 1), ...five, ...power.slice(1), ...rest]);
  });

  // ---- athletic B days: rear delts get their own sets (VOL-17 'Rear delts and calves need to get their own sets and reps'; R3-VOL-01
  // 'field athletes: side delts ... stay helper work'; samples 02 / 03 minor): a week with two B days keeps the side raise on the
  // first and takes a rear-delt exercise on the second; a week with one B day takes the rear-delt exercise
  for (const [, f] of Object.entries(F)) for (const [, t] of Object.entries(f.days || {})) {
    if (t.family !== 'athletic') continue;
    const sets = [[t.day_types, t.week_layout], ...Object.values(t.variants || {}).map(v => [v.day_types || {}, v.week_layout || t.week_layout])];
    for (const [dts, wl] of sets) {
      const order = Object.values(wl || {}).map(e => e && e.day_type).filter(n => n && dts[n] && dts[n].skeleton === 'athletic_B');
      const bDays = [...new Set(order)];
      bDays.forEach((name, i) => {
        const s = dts[name].stations.find(x => x.bucket === 'ISO_SIDE_REAR_DELT');
        if (!s) return;
        const rear = bDays.length === 1 || i % 2 === 1;
        s.variant = rear ? 'rear' : 'side'; s.variant_text = rear ? 'rear' : 'side';
        if (rear) s.note = 'shoulders: the week\'s rear-delt exercise (VOL-17 rear delts get their own sets; OBSERVED BYOP \'Shoulders/Traps\' slot of the B day)';
      });
    }
  }

  // ---- the CrossFit-style class (sample 04 majors): triceps get their own slots (R4-SES-05 Day B slot 5; his push / pull / legs
  // push day), the delt raises move from the squat day to the pull day (his push / pull / legs sheet has side raise and reverse fly on
  // the pull day), each arm has one slot on two days, and the deadlift day takes a single-leg knee lift so quads are trained twice
  // (OBSERVED his HYBRID sheet: deadlift day + lunge - PROPOSED for the class split, open question for the coach)
  eachDay((def, at) => {
    if (at.fam !== 'hybrid_crossfit' || at.variant !== 'crossfit_style_bootcamp') return;
    const st = def.stations;
    const byId = (id) => st.find(x => x.id === `${at.name}.${id}`);
    const nextId = () => `${at.name}.s${String(Math.max(...st.map(x => Number((/\.s(\d+)$/.exec(x.id) || [0, 0])[1]))) + 1).padStart(2, '0')}`;
    const iso = st.find(x => x.role === 'iso' && x.block === 'accessories');
    const mk = (bucket, group, over) => station(iso, { id: nextId(), bucket, group, variant: null, variant_text: null, sets_hint: [2, 2], note: null, ...over });
    const insertBefore = (ref, s) => { st.splice(st.indexOf(ref), 0, s); };
    if (at.name === 'PRESS' && !st.some(x => x.bucket === 'ISO_TRICEP')) {
      const side = st.find(x => x.bucket === 'ISO_SIDE_REAR_DELT');
      const tri = mk('ISO_TRICEP', 'triceps', { note: 'triceps exercise 1 (R4-SES-05 Day B slot 5: triceps on the push day; fix round 1)' });
      if (side) insertBefore(side, tri); else st.push(tri);
    }
    if (at.name === 'DEADLIFT') {
      const fly = st.find(x => x.bucket === 'ISO_CHEST');
      if (fly) { fly.bucket = 'ISO_TRICEP'; fly.group = 'triceps'; fly.note = 'triceps exercise 2 (the push partner of the deadlift day; it was a second fly - fix round 1)'; }
      if (!st.some(x => x.bucket === 'RP_UKD')) {
        const hinge2 = st.find(x => x.bucket === 'RP_UHD');
        const lunge = station(hinge2 || iso, { id: nextId(), bucket: 'RP_UKD', role: 'secondary', block: 'strength', group: 'quads', sets_hint: [2, 2], pair: null, superset: null,
          note: 'quads a second time in the week: a single-leg knee-dominant lift on the deadlift day (OBSERVED his HYBRID sheet: deadlift day + lunge; PROPOSED for the class split, fix round 1)' });
        if (hinge2) st.splice(st.indexOf(hinge2) + 1, 0, lunge); else st.push(lunge);
      }
    }
    if (at.name === 'SQUAT') {
      for (const x of st.filter(y => y.bucket === 'ISO_SIDE_REAR_DELT')) st.splice(st.indexOf(x), 1);
      if (!st.some(x => x.bucket === 'ISO_BICEP')) {
        const wod = st.find(x => x.bucket === 'COND_WOD');
        const curl = mk('ISO_BICEP', 'biceps', { note: 'biceps exercise 1 (R4-SES-05 Day A slot 5: biceps with the pulls and the squat; fix round 1)' });
        if (wod) insertBefore(wod, curl); else st.push(curl);
      }
    }
    if (at.name === 'CLEAN/PUSH') {
      const curls = st.filter(x => x.bucket === 'ISO_BICEP');
      if (curls.length > 1) st.splice(st.indexOf(curls[1]), 1);
      if (!st.some(x => x.bucket === 'ISO_SIDE_REAR_DELT')) {
        const wod = st.find(x => x.bucket === 'COND_WOD');
        const rear = mk('ISO_SIDE_REAR_DELT', 'shoulders', { variant: 'rear', variant_text: 'rear', note: 'rear delts on the pull day (his push / pull / legs sheet: reverse fly on the pull day; fix round 1)' });
        const side = mk('ISO_SIDE_REAR_DELT', 'shoulders', { variant: 'side', variant_text: 'side', note: 'side delts on the pull day (his push / pull / legs sheet: side raise on the pull day; fix round 1)' });
        side.id = side.id.replace(/s(\d+)$/, (m, n) => 's' + String(Number(n) + 1).padStart(2, '0'));
        if (wod) { insertBefore(wod, rear); insertBefore(wod, side); } else { st.push(rear, side); }
      }
    }
    // ranks: the template's own order (the power piece and the lifts first, then the accessories)
    reRank(def, st.filter(isCounted).concat(st.filter(x => typeof x.rank !== 'number' && ['strength', 'accessories', 'power'].includes(x.block) && /^(RP_|ISO_|AP_)/.test(x.bucket))));
  });

  // ---- the 3-session bootcamp rotation (OBSERVED dumps/BYOP/06_BOOTCAMP_OPTION_2: 1A two-leg knee lift, horizontal pull, single-
  // leg hinge, core, cardio; 2A two-leg hinge, horizontal push, biceps, vertical push, cardio; 3A vertical pull, single-leg knee
  // lift, cardio, triceps, side raise; sample 05 majors): the coach's own slots of each session take the first ranks, so the
  // station count never cuts one of them; the engine's additions fill the count where a floor is short - biceps with the pulls on
  // session 1 (R4-SES-05 Day A), triceps and a second chest station with the presses on session 2, a third press and a row on session 3.
  // A day of 7 stations or fewer is ONE circuit, as he runs it (PRG-03 '5-7 stations x 3-5 rounds').
  const BC_PREF = {
    1: ['RP_BKD', 'RP_HPULL', 'RP_UHD', 'COND_CIRCUIT', 'RP_VPULL', 'ISO_QUAD', 'ISO_BICEP'],
    2: ['RP_BHD', 'RP_HPUSH', 'ISO_BICEP', 'RP_VPUSH', 'COND_CIRCUIT', 'ISO_TRICEP', 'ISO_CHEST', 'ISO_LEG_FLEXION'],
    3: ['RP_VPULL', 'RP_UKD', 'COND_CIRCUIT', 'ISO_TRICEP', 'ISO_SIDE_REAR_DELT', 'RP_HPUSH', 'RP_HPULL', 'ISO_TRICEP']
  };
  eachDay((def, at) => {
    const m = /^BC([123])(_BW)?$/.exec(at.name);
    if (!m || def.format !== 'circuit') return;
    const n = Number(m[1]);
    const st = def.stations;
    const circ = st.filter(x => x.block === 'circuit');
    if (at.days === '3') {
      if (n === 1) { const x = circ.find(y => y.bucket === 'ISO_LEG_FLEXION'); if (x && !circ.some(y => y.bucket === 'ISO_BICEP')) { x.bucket = 'ISO_BICEP'; x.group = 'biceps'; x.note = 'biceps with the pulls (R4-SES-05 Day A: back, quads and biceps); it was a second hips station - fix round 1'; } }
      // session 2 (the hinge and the presses): the week's second triceps station rides with the presses, and session 3 keeps a
      // row beside the coach's vertical pull - the week then pulls as much as it pushes (VOL-18) and trains the rear delts every
      // week (two rows); the hips hold their floor on the two hinges and the knee lifts, so the leg curl waits behind the count
      if (n === 2 && !circ.some(y => y.bucket === 'ISO_TRICEP')) { const bi = circ.filter(y => y.bucket === 'ISO_BICEP'); const x = bi.length > 1 ? bi[bi.length - 1] : null; if (x) { x.bucket = 'ISO_TRICEP'; x.group = 'triceps'; x.note = 'triceps with the presses (R4-SES-05 Day B: hips, chest, shoulders and triceps); it was a second biceps station behind the count - fix round 1'; } }
      if (n === 3) {
        if (!circ.some(y => y.bucket === 'ISO_SIDE_REAR_DELT')) { const x = circ.find(y => y.bucket === 'ISO_CHEST'); if (x) { x.bucket = 'ISO_SIDE_REAR_DELT'; x.group = 'shoulders'; x.variant = 'side'; x.variant_text = 'side'; x.note = 'OBSERVED OT06 3A slot 5: Shoulders / Traps - ABduction (the side raise is his own slot - fix round 1)'; } }
        if (!circ.some(y => y.bucket === 'RP_HPUSH')) { const x = circ.find(y => y.bucket === 'ISO_SIDE_REAR_DELT' && y.variant === 'rear'); if (x) { x.bucket = 'RP_HPUSH'; x.group = 'chest'; x.variant = null; x.variant_text = null; x.note = 'chest a third time in the week (the floor of 10): a push-up or press station - fix round 1'; } }
        for (const x of circ) if (x.bucket === 'RP_HPUSH') x.variant_text = null;
      }
    }
    const left = circ.slice();
    const order = [];
    for (const b of BC_PREF[n]) { const i = left.findIndex(x => x.bucket === b); if (i >= 0) order.push(left.splice(i, 1)[0]); }
    left.sort((a, b) => (a.rank || 99) - (b.rank || 99));
    reRank(def, [...order, ...left]);
    for (const x of circ) x.circuit = 1;
    // the day prints in the order of his slots
    const others = st.filter(x => x.block !== 'circuit');
    const firstCirc = st.findIndex(x => x.block === 'circuit');
    const head = others.filter(x => st.indexOf(x) < firstCirc), tail = others.filter(x => st.indexOf(x) > firstCirc);
    const seq = [...order, ...left];
    // horizontal before vertical (ORD-01): the row of a session prints ahead of its vertical pull; the ranks (who survives the
    // station count) stay the coach's
    const iv = seq.findIndex(x => x.bucket === 'RP_VPULL'), ih = seq.findIndex(x => x.bucket === 'RP_HPULL');
    if (iv >= 0 && ih > iv) { const [row] = seq.splice(ih, 1); seq.splice(iv, 0, row); }
    def.stations = [...head, ...seq, ...tail];
    if (typeof def.dose_text === 'string') def.dose_text = 'one circuit of 5-7 stations, 3-5 rounds x 30-50 s per station (15 s transition, about 1.5 min between rounds); the coach\'s own slots of the session come first (OBSERVED BYOP BOOTCAMP - OPTION 2), then the stations the weekly floor needs (PRG-03, R4-SES-02)';
  });
  return F;
}

/**
 * fix round 1 sport-profile amendments (after amendSportV2).
 * @param {object} sport @returns {object}
 */
export function amendSportX1(sport) {
  const s = clone(sport);
  return s;
}

/** fix round 1 words: key -> [EN, ES]. Every key wins over the earlier layers. */
export const UI_X1 = {
  'note.wod_for_time_work': ['One more round than the block started with: the time cap follows the work. Beat your time, not the cap.', 'Una ronda más que al inicio del bloque: el límite de tiempo sigue al trabajo. Supera tu tiempo, no el límite.'],
  'wod.load.barbell': ['{min}-{max} lb on the bar', 'barra con {min}-{max} lb en total'],
  'note.joint_care_slot': ['This lift is also your joint care: lower slowly and stay in a pain-free range.', 'Este ejercicio también es tu cuidado articular: baja lento y quédate en un rango sin dolor.'],
  'effort.myo': ['MYO set on the last set: about 15 reps, then 5 mini-sets of 5 reps with a short pause (about 5 breaths) between, same weight', 'Serie MYO en la última serie: unas 15 repeticiones, luego 5 miniseries de 5 repeticiones con una pausa corta (unas 5 respiraciones) entre ellas, mismo peso'],
  'warning.athletic_capacity_list': ['This template holds part of your sport\'s weekly athletic work ({list}): the work still climbs across the block. Add a station or a day if you want the full dose.', 'Esta plantilla cubre una parte del trabajo atlético semanal de tu deporte ({list}): el trabajo igual sube a lo largo del bloque. Agrega una estación o un día si quieres la dosis completa.'],
  'warning.athletic_capacity_list_activity': ['This template holds part of this plan\'s weekly athletic work ({list}): the work still climbs across the block. Add a station or a day if you want the full dose.', 'Esta plantilla cubre una parte del trabajo atlético semanal de este plan ({list}): el trabajo igual sube a lo largo del bloque. Agrega una estación o un día si quieres la dosis completa.'],
  'swap.keeps.MRPUSH': ['the shoulder press with some chest', 'el empuje de hombros con algo de pecho'],
  'why.eve_of_game': ['The session the day before a game is the lighter one of the week', 'La sesión del día antes de un partido es la más ligera de la semana'],
  'why.extra_small_exercise': ['An extra small-muscle exercise at the end of the day: this group\'s other exercises cannot hold its weekly sets', 'Un ejercicio extra para un músculo pequeño al final del día: los otros ejercicios de este grupo no alcanzan para sus series semanales'],
  'warning.floor_needs_optional_day': ['{group}: your training days hold {held} weekly sets; the optional day takes it to {floor} or more. Do the optional day, or add a set to a training day.', '{group}: tus días de entrenamiento alcanzan {held} series semanales; el día opcional las lleva a {floor} o más. Haz el día opcional o agrega una serie en un día de entrenamiento.'],
  'note.test_top_set_replaces': ['Test first: warm up and work up to one top set ({test}). It replaces this lift\'s top set this week.', 'Primero la prueba: calienta y sube hasta una serie máxima ({test}). Reemplaza la serie más pesada de este ejercicio esta semana.'],
  'note.test_top_set_replaces_later': ['Warm up and work up to one top set ({test}). It replaces this lift\'s top set this week.', 'Calienta y sube hasta una serie máxima ({test}). Reemplaza la serie más pesada de este ejercicio esta semana.'],
  'note.test_back_off': ['These {n} sets are your back-off sets after the test: about {rir} reps in the tank.', 'Estas {n} series son tus series de descarga después de la prueba: deja unas {rir} repeticiones en reserva.'],
  'note.test_back_off_one': ['This set is your back-off set after the test: about {rir} reps in the tank.', 'Esta serie es tu serie de descarga después de la prueba: deja unas {rir} repeticiones en reserva.']
};
