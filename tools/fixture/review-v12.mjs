// tools/fixture/review-v12.mjs - model v1.2: the amendments that came out of the coach-eye review of the 8 sample plans
// (Phase 0 fix round, samples/REVIEW_LOG.md). Shared by the reference fixture build (tools/fixture/build-fixture.mjs) and the
// model compiler (tools/compile-model.mjs), so model/rules.json, templates.json and profiles.json keep deep-equalling the
// fixture (tests/compile.test.mjs). Every change names the review issue and the coach answer behind it. Authority:
// coach_answers_round2.md > coach_answers_full.md > spec > synthesis (a conflict with round 2 is decided in engine/DECISIONS.md).
// Pure functions of their input (deterministic, no clock).

export const REVIEW_VERSION = '1.2.0';

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniqSorted = (a) => [...new Set(a)].sort();

// ---------------------------------------------------------------------------------------------------------------- catalog

// R2-SES-02: "barbell or trap-bar deadlifts and RDLs count; single-leg DB work does not". A hinge whose every setup needs a
// barbell or a hex bar loads the spine like a deadlift, staggered / kickstand / alternating stances included (review 01 / 03 /
// 06 / 07: a barbell kickstand deadlift was classed 'second_day' and loaded the spine on the non-axial hinge day).
const HINGE_CLASSES = ['BHD', 'UHD'];
const SPINE_BARS = ['barbell', 'hex_bar'];

// KNEE_DEGENERATIVE_COURT / pain area knee: full-depth squats, deep split squats, lateral / cossack lunges and the depth-drop
// family are deep knee flexion (review 08: a Zercher squat and a lateral lunge were labelled "swapped to protect your knee").
// INFERRED tag list (02 v1.1 tagged only 5 records); listed in engine/DECISIONS.md D-70.
const DEEP_KNEE_IDS = [
  'back-squat-bar-position-not-stated', 'high-bar-back-squat', 'low-bar-back-squat', 'front-squat-barbell', 'zercher-squat-barbell',
  'high-zercher-barbell-squat', 'high-zercher-db-squat-db-hugged-high-at-chest', 'goblet-squat-kb-db', 'goblet-squat-heels-elevated',
  'double-kb-front-rack-squat', 'safety-squat-bar-ssb-squat', 'squat-any-loading-whatever-squat', 'low-hold-db-squat-single-db-hanging-between-the-legs',
  'sumo-squat-db-or-kb', 'flipped-hex-bar-squat-low-handles-longer-range', 'barbell-overhead-squat', 'side-lateral-lunge', 'curtsy-lunge',
  'rear-foot-elevated-lunge-rfe-bulgarian-split-squat', 'front-and-rear-foot-elevated-split-squat-ffe-and-rfe', 'front-foot-elevated-split-squat-lunge-ffe',
  'deficit-reverse-lunge-standing-on-plate-step', 'medium-depth-drop', 'low-depth-drop', 'low-depth-drop-single-leg-or-weighted',
  'single-leg-depth-drop', 'high-depth-drop-above-hip-height', 'depth-drop-height-not-stated', 'jefferson-lunge', 'landmine-hack-squat'
];

// Swaps that exist for home kits (R2-LIB-07 home additions; review 07: floor Y / T raises, a prone DB hamstring curl and a body-
// weight calf raise were picked in a full gym that has the machines). Penalised in select when the kit holds the real thing.
const HOME_SUBSTITUTES = {
  'floor-prone-y-t-raises': ['cable', 'machine_selectorized'],
  'prone-dumbbell-hamstring-curl-db-between-feet': ['machine_selectorized'],
  'standing-calf-raise-bodyweight-from-a-deficit-step': ['machine_selectorized', 'machine_plate_loaded'],
  'table-row-inverted-row-under-a-sturdy-table': ['cable', 'pullup_bar'],
  'kb-curl': ['dumbbell', 'cable'],
  'db-leg-extension-seated-on-box': ['machine_selectorized'],
  'supine-slider-hamstring-curl': ['machine_selectorized'],
  'ball-hamstring-curl-medball-or-stability-ball': ['machine_selectorized']
};

/**
 * Catalog record amendments (applied after normalize / coach patches in both builds).
 * @param {object} ex normalized exercise record (mutated copy returned)
 * @returns {object}
 */
export function amendExercise(ex) {
  const e = clone(ex);
  const tags = new Set(e.tags || []);
  const setups = (e.equipment && e.equipment.any_of) || [];
  // spine class from implement + pattern (review 01 major 6, 03 major 6, 06 major 8, 07 major 11)
  if (HINGE_CLASSES.includes(e.credit_class) && setups.length && setups.every(su => su.some(t => SPINE_BARS.includes(t))) &&
      !tags.has('olympic') && !tags.has('loaded_jump') && !tags.has('kb_swing')) {
    e.spine_class = 'counted';
    e.axial = true;
    e.axial_pattern = 'hinge';
    if (e.axial_class === 'none' || e.axial_class === 'low') e.axial_class = 'moderate';
    tags.add('spine_counted');
    e.rule_refs = [...new Set([...(e.rule_refs || []), 'R2-SES-02'])]; // 'barbell deadlifts count' (R2-SES-02)
  }
  // a record named 'barbell' needs the barbell (review 05 major: 'Bent-Over Barbell Row' passed a DB-only kit)
  if (/(^|-)barbell(-|$)/.test(e.id) && !/(^|-)(db|dumbbell|kb|kettlebell|ez)(-|$)/.test(e.id)) {
    const withBar = setups.filter(su => su.includes('barbell') || su.includes('ez_bar') || su.includes('hex_bar') || su.includes('landmine'));
    if (withBar.length && withBar.length < setups.length) e.equipment = { ...e.equipment, any_of: withBar };
  }
  if (DEEP_KNEE_IDS.includes(e.id)) tags.add('deep_knee_flexion');
  // assisted variants (review 07 major: assisted dips for a 4-year lifter) - penalised for L2-L3 in select
  if (/(^|-)assisted(-|$)/.test(e.id)) tags.add('assisted');
  if (HOME_SUBSTITUTES[e.id]) tags.add('home_substitute');
  e.tags = [...tags].sort();
  return e;
}

/** kit tokens that make a home substitute unnecessary (select penalty) */
export const HOME_SUBSTITUTE_KIT = HOME_SUBSTITUTES;

// ---------------------------------------------------------------------------------------------------------------- rules

/**
 * Rules v1.2 (every table the review fixes read; numbers marked PROPOSED / INFERRED are listed in engine/DECISIONS.md).
 * @param {object} rules rules/2 from buildRules (v1.1)
 * @returns {object} amended copy
 */
export function amendRules(rules) {
  const R = clone(rules);
  R.rules_version = REVIEW_VERSION;

  // ---- locked: no new lock ids; the existing ones are now enforced on the placed sets too

  // ---- volume: D-03 / D-07 narrowed (R2-VOL-06 "I don't think anybody needs less than 10 sets a week per muscle")
  // stay-active and class-model plans: every target muscle floored (small muscles 0.8 x start, then floor 10 - master stay-active row);
  // competitive field athletes: glutes and side delts targeted and floored; biceps / triceps credit-only (UNI-02 + R3-VOL-01 pending)
  // unless the sport profile lists direct arm sets (04 weekly_sets ISO_TRICEP / ISO_BICEP); in-season keeps every small muscle credit-only
  R.volume.modifiers.stay_active = { lower: 0.8, upper: 0.8, small: 0.8, credit_only: [], refs: ['ATH-13', 'R2-VOL-06', 'R2-VOL-04'], status: 'D-07 retired (v1.2 review): small muscles 0.8 x start then floor 10', r3: 'R3-VOL-01' };
  R.volume.modifiers.field_off = { lower: 0.7, upper: 0.5, small: 0.6, credit_only: ['biceps', 'triceps'], refs: ['VOL-08', 'VOL-17', 'UNI-02', 'R2-VOL-06'], status: 'D-03 narrowed (v1.2 review): glutes + side delts floored for athletes', r3: 'R3-VOL-01' };
  R.volume.modifiers.athlete_in = { ...R.volume.modifiers.athlete_in, credit_only: ['glutes', 'side_delts', 'biceps', 'triceps'] };
  for (const m of Object.keys(R.muscles.defs)) if (R.muscles.defs[m].athlete_fill) delete R.muscles.defs[m].athlete_fill;
  // floor read on MAIN training days only; optional days are extra (review 06 major 2, 02 major 6: "never count optional days")
  R.volume.floor.counted_on = 'main_days';
  R.volume.floor.exempt = R.volume.floor.exempt.filter(x => x !== 'format:circuit' && x !== 'credit_only');
  R.volume.floor.exempt.push('credit_only (in-season; competitive-athlete biceps / triceps)');
  // calves: one exercise x 3 sets per leg day by default; the second calf station is the first cut (review 02 / 06 / 07)
  R.volume.calves.second_station_sets = 1;
  R.volume.calves.second_station = 'cut_first';
  // knee pain moves the share toward single-leg work (coach note printed at the top of every plan, UNI-02; review 08 major)
  R.volume.pain.areas.knee.share_shift_to = 'unilateral';
  R.volume.pain.areas.knee.prefer_tags = ['machine', 'axial_unload'];
  R.volume.pain.constraint_bump = 1; // pain region: +1 on the constraint band of the slots it touches (master 8.3 pain flag)

  // ---- stairway: the planned stairway must be the placed one (review blockers, all 8 plans)
  R.stairway.limits.placed = {
    per_muscle_whole_sets: 1, per_muscle_pct: 0.07, ceiling_pct: 0.10, helper_slack: 0.5, total_pct: 0.07,
    refs: ['R2-VOL-01', 'UNI-05', 'VOL-04'],
    note: 'a muscle rises at most max(1 set, 7 %) a week (whole sets, helpers may add 0.5); the week total at most 7 %; 10 % is never reached'
  };
  R.stairway.track = {
    week1_above_target_max: 1, behind_target_max: 1, flat_total_steps_max: 1, last4_growth_share_min: 0.5,
    refs: ['R2-PER-03', 'R2-PER-04', 'R2-VOL-03'],
    note: 'placed sets follow the planned T(w): never more than 1 set above in week 1, never 1 or more behind (unless a schedule warning names the muscle); the week total never stays flat two weeks in a row; no "hold" without a check-in'
  };
  R.stairway.capacity = {
    probe: 'peak_week_first', iterations: 3, priority_first: true, min_growth_share: 0.1,
    room_cut_order: ['second_calf', 'buyout', 'prehab_extra', 'second_plyo', 'ankle_block_extra', 'second_throw', 'olympic_extra_stay_active', 'second_iso_nonpriority', 'third_of_group', 'group_frequency'],
    short_start_iso_sets: 1, // no room left to climb: isolations enter at 1 set in week 1 and climb (VOL-07, review 08)
    priority_room_cuts: ['second_calf', 'second_iso_nonpriority'], // cuts made for a short client priority (review 06)
    priority_min_share: 0.6, // a priority below 60 % of its peak target frees room first
    refs: ['R2-PER-03', 'R2-SES-05', 'UNI-09'],
    note: 'the whole stairway must fit the chosen minutes: the peak week is placed first; muscles whose peak does not fit start lower (never below the floor) so every week can still climb (D-67)'
  };

  // ---- placement
  R.placement.main_days_first = true;
  R.placement.optional_days = { stairway_sets: false, focus_slots_max: 2, focus_sets: [2, 3], focus_only_for: ['priority', 'floor_lifted_small'], refs: ['ORD-10', 'ORD-11', 'VOL-02'] };
  R.placement.added_slot_entry_sets = 1; // a new bonus exercise mid-block enters at 1 set (placed rise <= 1 set a week)
  R.placement.group_day_reduction = { enabled: true, keep_roles: ['work', 'core_block', 'survival'], keep_pair_of_work: true, refs: ['R2-SES-05', 'VOL-07', 'R2-PER-03'], note: 'a group whose 2 x 2 minimum on every day is above its week-1 target is trained on fewer days, each with 2 exercises' };
  R.placement.work_min_sets_from_minutes = 60; // below 60 min the work starts at 2 sets and climbs (VOL-07 2/2/2 -> 3/2/2)
  R.placement.work_min_sets = 3; // VOL-16: compounds 3; the day's work lift never has fewer sets than another station of its group (VOL-07)

  // ---- session / time
  R.session.long_day.split_day_factor = 1.0; // split days: no tolerance (review 07)
  R.session.long_day.error_above_factor = 1.25; // over this a main day is an error (review 08), whatever the family
  R.session.long_day.error_when_cuttable = true; // over 1.10 with a cuttable item left is an error (review 01)
  R.session.long_day.count_aerobic_addon = true; // add-on cardio counts (review 02 / 03 / 06 / 07)
  R.time_model.between_circuits_s = 60; // 05 v1.1 5.3 '1 min between circuits' (review 05)
  R.time_model.wod_minutes_from_dose = true;
  R.time_model.skill_extra_min = 3; // OT18 class order WARMUP/SKILL: skill practice lives in the warm-up (review 04)
  R.time_model.aerobic_addon_counts = true;
  R.session.default_sets.calves_first_when_alone = 3;

  // ---- cut order: data-driven chain per family (review 01 major 3, 04 majors 7 / 8, 05 major 8, 06 major 1, 08 blocker 1)
  const common = [
    { id: 'second_calf', match: { second_calf: true } },
    { id: 'second_isolation_same_muscle', match: { duplicate_isolation: true } },
    { id: 'aquatic_chest_fly', match: { bucket: ['ISO_CHEST'], profile_pull_ratio_gte: 1.5 } },
    { id: 'third_of_group', match: { third_of_group: true } }
  ];
  R.cut_order.athletic = [
    { id: 'olympic_over_budget', match: { olympic_over_budget: true } },
    { id: 'second_plyo_or_sprint', match: { bucket: ['AP_JUMP_LIMITED_KNEE', 'AP_SPRINT'], keep_profile_tracks: true } },
    { id: 'second_jump_low_contact_sport', match: { bucket: ['AP_PLYO'], keep_one_per_day: true, profile_ground_class_gte: 4 } },
    { id: 'cod_non_cod_sport', match: { bucket: ['AP_COD'], unless_profile_cod: true } },
    { id: 'buyout', match: { bucket: ['COND_SPRINT_BUYOUT'] } },
    { id: 'second_throw', match: { bucket: ['AP_THROW'], keep_one: true } },
    ...common,
    { id: 'group_to_optional', match: { group_to_optional: true } }
  ];
  // stay-active / gen-pop athletic plans: strength first - joint care moves to the optional day, the ankle block and second
  // jump / throw stations go before a muscle group does (review 08 blocker 1: 'make prehab movable', 'sets drop to 2')
  R.cut_order.athletic_stay_active = [
    { id: 'olympic_over_budget', match: { olympic_over_budget: true } },
    { id: 'prehab_to_optional', match: { prehab_to_optional: true } },
    { id: 'ankle_block', match: { bucket: ['AP_JUMP_LIMITED_KNEE'] } },
    { id: 'one_athletic_per_day', match: { athletic_per_day_gt: 1 } },
    { id: 'second_jump', match: { bucket: ['AP_PLYO'], keep_one_per_day: true } },
    { id: 'second_throw', match: { bucket: ['AP_THROW'], keep_one: true } },
    { id: 'cod', match: { bucket: ['AP_COD', 'AP_SPRINT'] } },
    { id: 'buyout', match: { bucket: ['COND_SPRINT_BUYOUT'] } },
    ...common,
    { id: 'group_to_optional', match: { group_to_optional: true } }
  ];
  R.cut_order.track_protection = 'competitive_only';
  // review 05 blocker 1: the circuit's work seconds climb by the planned steps in 1-s steps (D-19 revised)
  R.supersets.bootcamp.stairway.by_planned_steps = true;
  R.supersets.bootcamp.stairway.work_s_fine_step = 1;
  R.cut_order.keep_work_pair = true;
  R.reps.stay_active_compound_by_block = ['b12_15', 'b8_12', 'b8_12']; // stay-active compounds VOL1 -> VOL2 (PER-11, review 08 minor 12)
  // a test is its own short item in a 'test' block (v1.2): it never counts toward the exercise cap (V13)
  if (!R.session.outside_cap_blocks.includes('test')) R.session.outside_cap_blocks.push('test');
  // review 05 major 8: a bootcamp day keeps one metabolic station; the 1-set second calf and duplicate isolations go first
  R.cut_order.fat_loss_bootcamp = [{ id: 'focus', match: { role: ['focus'] } }, { id: 'second_calf', match: { second_calf: true } },
    { id: 'second_isolation_same_muscle', match: { duplicate_isolation: true } }, { id: 'rounds', match: { circuit_rounds_down: true } },
    { id: 'sixth_station', match: { circuit_station_index_gte: 6, except_bucket: ['COND_CIRCUIT'] } }]; // a group move never takes the work lift's paired upper group (ORD-06)
  R.supersets.core_supersets_optional.when_over_time = true; // the core pair alternates on an over-time day (R2-SES-03, review 08)
  R.cut_order.aesthetics = [{ id: 'focus', match: { role: ['focus'] } }, ...common, R.cut_order.aesthetics.find(x => x.id === 'second_non_axial_bilateral'), { id: 'group_to_optional', match: { group_to_optional: true } }];
  // review 04 blocker 1: the floored lifts keep their time; skill folds into the warm-up (OT18 'WARMUP/SKILL') and the WOD
  // holds its shorter range before a group leaves a day
  R.cut_order.hybrid_crossfit = [{ id: 'aerobic_addon', match: { bucket: ['COND_AEROBIC'] } }, { id: 'focus', match: { role: ['focus'] } }, ...common,
    { id: 'skill_to_warmup', match: { skill_to_warmup: true } }, { id: 'wod_short', match: { wod_short: true } }, { id: 'group_to_optional', match: { group_to_optional: true } }];
  R.conditioning.wod.short_minutes = [10, 15]; // a WOD on an over-time day climbs 10 -> 15 min instead of 10 -> 20 (PROPOSED)
  R.cut_order.no_equipment = [...common, { id: 'group_to_optional', match: { group_to_optional: true } }];
  R.cut_order.strength = [...R.cut_order.strength, { id: 'second_calf', match: { second_calf: true } }];
  R.cut_order.never_cut.buckets = ['ISO_CALF']; // AP_TRIPLE_EXT now cut to its budget, not removed (step 'olympic_over_budget')
  R.cut_order.never_cut.first_calf_station = true;
  R.cut_order.status = 'PROPOSED (v1.2 review: Olympic sets above the budget, 1-set fillers and duplicate isolations go before any target muscle)';

  // ---- reps / effort / rest
  // accessory brackets follow the phase in one direction (review 01 minor: 10-12 -> fixed 15 -> 8-12 zig-zag)
  R.reps.athlete_vol_phases.VOL1 = { compound: 'b12_15', isolation: 'b12_15' };
  R.reps.athlete_vol_phases.VOL2 = { compound: 'b8_12', isolation: 'b10_12' };
  R.reps.athlete_vol_phases.VOL3 = { compound: 'b6_8', isolation: 'max' };
  // season phase -> VOL phase (review 03 major 4: OFF_LATE ran VOL1 for 6 weeks, then VOL3)
  R.reps.athlete_vol_phases.by_season_phase = { OFF_EARLY: ['VOL1', 'VOL2', 'VOL3'], OFF_BUILD: ['VOL1', 'VOL2', 'VOL3'], OFF_LATE: ['VOL2', 'VOL3', 'VOL3'], PRE: ['VOL3'], IN: ['VOL3'] };
  // the exercise's own rep hint caps the phase bracket (review 02 major 2, 06 major 3, 07 major 12): eccentric / body-weight
  // loaded / loaded-jump classes and any record whose hint is lower than the phase bracket
  R.reps.rep_hint = { honour: true, classes: ['bodyweight_loaded', 'eccentric', 'plyo_unilateral'], ids_low_cap: { 'nordic-hamstring-curl': [3, 8] }, bodyweight_vertical_pull: [5, 10], weighted: [4, 8], refs: ['VOL-11', 'CAT-09', 'GEN-04'] };
  R.reps.matrix.core.athletic = { bracket: 'b10_15', or_seconds: [20, 40] };
  R.reps.matrix.core.fat_loss = { bracket: 'b10_15', or_seconds: [20, 40] };
  R.reps.core_hold_seconds = { default: [20, 40], copenhagen_L1_L2: [10, 30] };
  // class-model (CrossFit-style class) strength / power tables, HALF TIME (OT17 / OT18; review 04 major 2)
  R.reps.class_levels = {
    strength: [{ sets: 3, reps: 7 }, { sets: 3, reps: 6 }, { sets: 3, reps: 5 }, { sets: 3, reps: 4 }],
    strength_end: 'work_up_to_1rm',
    power: [{ sets: 3, reps: 4 }, { sets: 3, reps: 3 }, { sets: 3, reps: 2 }, { sets: 3, reps: 1 }],
    resistance: [{ sets: 2, reps: 10 }, { sets: 3, reps: 10 }],
    bodyweight_pull: [5, 8],
    refs: ['OT17', 'OT18', 'ORD-07', 'VOL-12'], status: 'OBSERVED (HALF TIME class table)'
  };
  R.reps.preference.heavy_powerlifting = { first_lift_of_day_shift: -1, only_rep_classes: ['main_bilateral_compound'], refs: ['VOL-12', 'UNI-04'] };
  R.effort.max.only_last_small_item = true; // VOL-15 / hard rule: MAX only on the day's last small-muscle or machine exercise
  R.effort.max.phases = ['DRIVE', 'HARDEST']; // never in the acclimation weeks (R2-PER-05 'start at a 2'; review 06 / 07)
  R.effort.hold_key = 'effort.hold_quality';
  R.effort.circuit_keys = { resistance: 'effort.circuit_resistance', metabolic: 'effort.circuit_metabolic' };
  R.rest.strength_for = ['test', 'work_main_bilateral', 'reps_max_lte_8_shifted'];

  // ---- Olympic (review 01 major 3, 03 major 5, 04 major 6, 08 major 3)
  R.olympic.sets = {
    from_budget: true, min_per_exposure: 2, max_per_exposure: 4,
    stay_active: { sets: 2, reps: [3, 6], heavy_play: { sets: 2, reps: 3 } },
    ramp_for: ['competitive', 'strength'],
    refs: ['R2-ATH-04', 'R2-ATH-05', 'PER-09', 'VOL-16']
  };
  R.olympic.rep_scheme = { ramp: ['db_kb', 'pull'], three_to_five: ['barbell_power_catch', 'barbell_squat_catch'], by: 'implement_and_catch', refs: ['R2-ATH-05'] };
  R.olympic.ramp_carries_across_blocks = true; // one ramp across the block; pre-season continues from the last off-season reps
  R.olympic.max_exposures_from_profile = true;

  // ---- athletic budget reconcile (D-63 resolved, review 02 / 03 / 01): planned within 25 % of the 04 weekly targets
  R.athletic.reconcile = {
    enabled: true, tolerance: 0.25, olympic_max_factor: 1.5, contact_rise_max: 0.2,
    per_set_max: { plyo_contacts: 10, jump_contacts: 8, low_contacts: 25, throws: 20, cod_cuts: 12, sprint_m: 180 },
    per_set_min: { plyo_contacts: 3, jump_contacts: 3, low_contacts: 10, throws: 8, cod_cuts: 4, sprint_m: 40 },
    stations_per_day_max: { AP_COD: 2, AP_SPRINT: 1, AP_THROW: 2, AP_JUMP_LIMITED_KNEE: 1 },
    unilateral_contacts_per_leg_max: 6,
    refs: ['R2-ATH-01', 'ATH-01', 'ATH-06', 'D-63'], status: 'PROPOSED (v1.2 review)'
  };
  R.athletic.sprint = { reps: [3, 6], metres_by_drill: { acceleration: [10, 20], max_velocity: [20, 40], default: [10, 30] } };
  R.athletic.plyo_exclusions_by_profile = true;
  R.athletic.landing_rc1_only = true;
  R.athletic.box_height_from_record = { low: /low|half-shin|step/.source, medium: /medium|knee/.source, high: /high|hip/.source };

  // ---- conditioning: buy-out pool = conditioning records only (review 02 major 1)
  R.conditioning.buyout_pool = { include_ids_re: 'calorie|buy-out|fast-run', exclude_ids_re: 'max-velocity|acceleration|falling-start|a-march|a-skip|a-runs|mach-sprint|high-knee', bouts: [1, 3], calories: [10, 20], seconds: [15, 30], refs: ['ORD-03', 'LIB-21', 'OBSERVED BASEBALL Part E'] };
  R.ordering.block_order = R.ordering.block_order.includes('test') ? R.ordering.block_order : [...R.ordering.block_order.slice(0, R.ordering.block_order.indexOf('core') + 1), 'test', ...R.ordering.block_order.slice(R.ordering.block_order.indexOf('core') + 1)];
  R.conditioning.wod.reps_by_group = {
    erg: { emom: 10, amrap: 12, for_time: 15 }, swing: { emom: 12, amrap: 15, for_time: 15 }, thruster: { emom: 8, amrap: 10, for_time: 12 },
    ball: { emom: 10, amrap: 15, for_time: 15 }, rope: { emom: 30, amrap: 40, for_time: 50 }, burpee: { emom: 8, amrap: 10, for_time: 10 },
    carry: { emom: 20, amrap: 40, for_time: 40 }, jump: { emom: 8, amrap: 10, for_time: 10 }, default: { emom: 8, amrap: 10, for_time: 12 },
    refs: ['PRG-10', 'VOL-11'], status: 'PROPOSED (an EMOM minute holds ~35-45 s of work)'
  };
  R.conditioning.wod.for_time_rounds = [3, 4];
  R.conditioning.wod.rotate_stations_week = true;
  R.conditioning.wod.exclude_day_pattern = true;
  R.conditioning.wod.weekly_must_have = ['jump', 'ball_or_kb'];
  R.conditioning.circuit_pool_extra = ['kettlebell-swing-russian', 'medball-chest-pass', 'medball-rotational-downward-slam', 'lateral-shuffles', 'skater-jumps-lateral-bounds', 'jumping-jacks'];
  R.conditioning.circuit_pool_exclude_re = 'interval|min-walk|20-s-fast';
  R.conditioning.sessions.crossfit_class = 3; // ATH-07: 3 for general clients, one of each colour (review 04 minor)
  R.conditioning.addon_placement = ['aerobic_day', 'optional_day', 'separate_free_day', 'optional_day_any', 'addon_after_if_fits', 'separate_session'];
  R.conditioning.required_on_optional_note = 'note.aerobic_required';

  // ---- tests (review 01 / 02 / 03 / 04 majors)
  R.tests.from_zero_if = ['level_L1', 'layoff', 'years_consistent_lt_1', 'youth']; // a minor's baseline is never a 1RM (INFERRED, conservative)
  R.tests.catalogue.speed_agility.from_zero = 'sprint_10_30m_80_90';
  R.tests.catalogue.speed_agility.items_by_profile = { sprint: 'sprint_10_30m', cod: '5-10-5-pro-agility-shuttle' };
  R.tests.catalogue.cardio.from_zero = 'mile_or_erg_80_90';
  R.tests.lock_tested_exercise = true;
  R.tests.test_item = { own_item: true, no_superset: true, no_week1_tip: true, strength_wording: 'work_up_to_top_set' };
  R.tests.cardio_day = 'lightest_or_aerobic_day';

  // ---- selection (review majors in 01 / 02 / 03 / 05 / 06 / 07 / 08)
  R.selection.weights.live_library = 2.5; // R2-LIB-01: library exercises are the main pick (program-only / reference-only are swaps)
  R.selection.weights.not_stated_or_any = -4; // FIX-03: 'Calf Raise - any', 'Bent-Over Row' (implement not stated) are swaps
  R.selection.weights.assisted_l2_l3 = -4;
  R.selection.weights.home_substitute = -3;
  R.selection.weights.implement_ladder = 1;
  R.selection.weights.above_level = -2.5;
  R.selection.weights.hotspot_avoid = -6;
  R.selection.weights.hotspot_prefer = 1.5;
  R.selection.weights.bent_over_barbell_on_axial_day = -4;
  R.selection.weights.uni_as_work_bb = -6;
  R.selection.weights.frontal_quota = 2;
  R.selection.weights.direction_match = 1.5;
  R.selection.weights.station_note = 2;
  R.selection.weights.load_ceiling_drop = -3;
  R.selection.swap_only_statuses = ['program_only', 'reference_only'];
  R.selection.home_substitute_kit = clone(HOME_SUBSTITUTES);
  R.selection.generic_id_patterns = ['-not-stated', '-any-kind', '^calf-raise-any$', '^row-any', '-any-loading', '^squat-any'];
  R.selection.implement_ladder_by_level = { L1: ['bodyweight', 'dumbbell', 'kettlebell', 'machine'], L2: ['dumbbell', 'kettlebell', 'barbell', 'machine', 'cable'], L3: ['barbell', 'dumbbell', 'machine', 'cable'] };
  R.selection.second_exposure_scope = 'week_all_slots'; // PER-04 incl. ISO and Focus (review 02 / 06 / 07 minors)
  R.selection.block_change.keep_roles = ['work', 'core_block', 'tested'];
  R.selection.block_change.include_circuits = true;
  R.selection.block_change.forbid_load_downgrade = true;
  R.selection.block_change.full_kit_real_alternative = true;
  R.selection.athlete_opposite_pattern = { hip_day_unilateral: 'RP_UKD', knee_day_unilateral: 'RP_UHD', refs: ['UNI-06', 'OBSERVED BASEBALL Part C/D'] };
  R.selection.work_bilateral_canonical = { families: ['hybrid_crossfit', 'strength'], goals: ['muscle', 'strength'], refs: ['ORD-02', 'ORD-07', 'CAT-13'] };
  R.selection.athlete_press_band = { buckets: ['RP_HPUSH', 'RP_HPULL'], band: [1, 3], refs: ['ATH-03', 'EQ-13'] };
  R.selection.squat_implement_differs_from_hinge = true;
  R.selection.chest_iso_to_press_when_pull_ratio_gte = 1.5; // aquatic: chest reaches its floor through presses, never flies (review 01)
  R.selection.group_second_differs = ['pattern', 'implement', 'grip', 'laterality'];

  // ---- profile injury hotspots as default avoid / prefer tags (review 01 major 8)
  R.selection.hotspots = {
    SHOULDER_SWIMMER: { avoid_tags: ['upright_row', 'overhead_barbell', 'push_press', 'push_jerk'], avoid_id_patterns: ['upright-row', 'standing.*overhead-press', '^alternating-db-overhead-press', 'military-press', 'push-press', 'jerk', 'seesaw-db-press'], prefer_tags: ['machine', 'split_grip'], prefer_id_patterns: ['landmine', 'seated-machine-shoulder-press', 'neutral'] },
    SHOULDER_THROWER: { avoid_tags: ['overhead_barbell', 'upright_row'], avoid_id_patterns: ['military-press'], prefer_tags: ['split_grip'], prefer_id_patterns: ['landmine'] },
    SHOULDER_CONTACT: { avoid_tags: [], avoid_id_patterns: [], prefer_tags: [], prefer_id_patterns: [] },
    LOW_BACK_EXTENSION: { avoid_tags: ['good_morning'], avoid_id_patterns: [], prefer_tags: ['chest_supported'], prefer_id_patterns: [] },
    KNEE_DEGENERATIVE_COURT: { avoid_tags: ['deep_knee_flexion', 'depth_jump', 'hurdle_hop', 'bound'], avoid_id_patterns: [], prefer_tags: ['machine', 'axial_unload'], prefer_id_patterns: ['leg-press', 'box-squat', 'step-up'] }
  };

  // ---- prehab: a preferred pick per injury code + the label from the code (review 08 major 5)
  R.prehab.by_injury_code.ELBOW_LATERAL_RACKET = { bucket: 'RECOVERY_ARM_CARE', per_week: 2, days: 'any', sets: 2 };
  R.prehab.preferred_by_code = {
    ACHILLES_CALF: ['seated-bent-knee-calf-raise-soleus', 'tibialis-raise-back-against-a-wall'],
    KNEE_DEGENERATIVE_COURT: ['leg-extension-machine', 'wall-sit-isometric-squat-hold', 'db-leg-extension-seated-on-box'],
    ELBOW_LATERAL_RACKET: ['db-wrist-extension', 'wrist-extension-db', 'reverse-wrist-curl'],
    FALLS_COURT: ['single-leg-balance-reach-front-side-back'],
    SHOULDER_SWIMMER: ['kb-face-pull', 'side-lying-db-external-rotation', 'floor-prone-y-t-raises'],
    SHOULDER_THROWER: ['side-lying-db-external-rotation', 'kb-face-pull', 'floor-prone-y-t-raises'],
    NECK: []
  };
  R.prehab.preferred_status_ok = ['proposed_v1_1', 'proposed_v1']; // the coach's own approved additions may be the prehab pick
  R.prehab.credits = 'by_catalog'; // rear-delt / face-pull prehab sets count as rear-delt own sets (review 08 minor, 01 major 7)
  R.prehab.skip_if_week_has_same = true;
  R.prehab.per_day_max = 2;
  // prehab sets count by the catalog (a KB face pull is rear-delt work, R2-LIB-04): the prehab buckets leave the zero-credit list
  R.credit.athletic_slot_buckets = R.credit.athletic_slot_buckets.filter(b => !['PREHAB_LOWER', 'PREHAB_NECK', 'RECOVERY_ARM_CARE'].includes(b));
  R.prehab.unit_from_rep_hint = true;

  // ---- warm-up by profile (review 01 minor, 08 minor)
  R.warmup.prep_by_profile = { mobility_when: ['sprint_tier_T0', 'injury:SHOULDER_SWIMMER', 'injury:SHOULDER_THROWER', 'running_space_none', 'lower_limb_pain'], drills_when: ['running_sport'], mobility_ids: ['kb-book-opener'], balance_ids: ['single-leg-balance-reach-front-side-back'], refs: ['ORD-08'] };

  // ---- bilateral share: bb_pl before the sport row for muscle / strength L2-L3 (review 06 / 07 majors)
  const sel = R.bilateral_share.select;
  const bb = sel.findIndex(r => r.use === 'bb_pl');
  const sp = sel.findIndex(r => r.use === 'sport');
  if (bb > sp && sp >= 0) { const [row] = sel.splice(bb, 1); sel.splice(sp, 0, row); }
  R.bilateral_share.selection_enforced = true;
  R.bilateral_share.block_swap = true; // 6.5 stance swap at exercise-block boundaries
  R.bilateral_share.compound_only = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'];
  R.bilateral_share.validate_tolerance = 0.12;

  // ---- frontal / transverse quota on single-leg picks (review 02 major 7)
  R.frontal_transverse.quota_from_profile = true;
  R.frontal_transverse.min_share_to_apply = 0.2;

  // ---- validation: new checks (V27 athletic budget, V28 laterality share, V29 push : pull)
  const v = R.validation.checks;
  if (!v.some(c => c.id === 'V27')) v.push({ id: 'V27', key: 'check.v27_athletic_budget', severity: 'error' });
  if (!v.some(c => c.id === 'V28')) v.push({ id: 'V28', key: 'check.v28_laterality_share', severity: 'warn' });
  // V29 warns: the 8 samples hold pull >= 0.8 x push, but several other templates are written push-heavy (review 04 asks for
  // a template fix; deferred in samples/REVIEW_LOG.md)
  if (!v.some(c => c.id === 'V29')) v.push({ id: 'V29', key: 'check.v29_push_pull', severity: 'warn' });
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- templates

/**
 * Template amendments (review 04 major 1: the class grid is knee / PULL / hip / PUSH, ORD-06 hip + push and knee + pull;
 * the clean sits on the squat day, the snatch on the deadlift day, R2-ATH-04).
 * @param {object} families templates.families (amended copy returned)
 */
export function amendTemplates(families) {
  const F = clone(families);
  const hc = F.hybrid_crossfit && F.hybrid_crossfit.days['4'];
  const v = hc && hc.variants && hc.variants.crossfit_style_bootcamp;
  if (v && v.day_types) {
    const DL = v.day_types.DEADLIFT, CP = v.day_types['CLEAN/PUSH'], SQ = v.day_types.SQUAT, PR = v.day_types.PRESS;
    // squat day: the clean (cleans are squatty), DUBS skill stays
    if (SQ && !SQ.stations.some(s => s.bucket === 'AP_TRIPLE_EXT')) {
      const at = SQ.stations.findIndex(s => s.bucket === 'RP_BKD');
      SQ.stations.splice(at, 0, { ...stationLike(SQ.stations[at], 'SQUAT.s16'), bucket: 'AP_TRIPLE_EXT', role: 'power', block: 'power', group: null, variant: 'clean', axial: null, pair: null, superset: null, sets_hint: [3, 4], laterality_dial: false, note: "'CLEAN' (cleans are squatty, R2-ATH-04; v1.2 review)" });
    }
    // press day keeps the push (vertical press is the work) - its snatch moves to the deadlift day (snatches are hingy)
    if (PR) {
      const sn = PR.stations.find(s => s.bucket === 'AP_TRIPLE_EXT');
      if (sn) PR.stations.splice(PR.stations.indexOf(sn), 1);
    }
    if (DL) {
      const cl = DL.stations.find(s => s.bucket === 'AP_TRIPLE_EXT');
      if (cl) { cl.variant = 'snatch'; cl.note = "'SNATCH' (snatches are hingy, R2-ATH-04; v1.2 review)"; }
      // the hip-dominant day gets its push partner (ORD-06: hip-dominant with pushing)
      const work = DL.stations.find(s => s.role === 'work');
      if (work && !DL.stations.some(s => s.bucket === 'RP_HPUSH')) {
        work.pair = 'P1'; work.superset = 'P1';
        const at = DL.stations.indexOf(work) + 1;
        DL.stations.splice(at, 0, { ...stationLike(work, 'DEADLIFT.s14'), bucket: 'RP_HPUSH', role: 'paired_upper', block: 'strength', group: 'chest', axial: null, pair: 'P1', superset: 'P1', sets_hint: [2, 3], laterality_dial: false, note: 'hip + push (ORD-06; v1.2 review)' });
        const uhd = DL.stations.find(s => s.bucket === 'RP_UHD');
        if (uhd) { uhd.pair = 'P2'; uhd.superset = 'P2'; DL.stations.splice(DL.stations.indexOf(uhd) + 1, 0, { ...stationLike(uhd, 'DEADLIFT.s15'), bucket: 'ISO_CHEST', role: 'iso', block: 'accessories', group: 'chest', axial: null, pair: 'P2', superset: 'P2', sets_hint: [2, 2], laterality_dial: false, note: 'chest exercise 2 (dips / push-up variant)' }); }
      }
      DL.label = 'Deadlift + push + snatch day';
      if (SQ) SQ.label = 'Squat + clean day';
      if (PR) PR.label = 'Press day';
    }
    if (CP) {
      // Friday becomes CLEAN + PULL: the horizontal and vertical pulls (the class grid's PULL day, OT17)
      for (const s of CP.stations) {
        if (s.bucket === 'RP_HPUSH') { s.bucket = 'RP_HPULL'; s.group = 'back'; s.note = 'back exercise 1 (row before the pull-up, ORD-01; v1.2 review)'; }
        else if (s.bucket === 'ISO_CHEST') { s.bucket = 'RP_VPULL'; s.role = 'secondary_upper'; s.block = 'strength'; s.group = 'back'; s.note = 'back exercise 2'; }
        else if (s.bucket === 'RP_VPUSH') { s.bucket = 'ISO_BICEP'; s.role = 'iso'; s.block = 'accessories'; s.group = 'biceps'; s.note = 'biceps exercise 1'; }
      }
      // the shoulders station leaves Friday (a group of 1 is never written, R2-SES-05); Monday keeps rear + side delts
      CP.stations = CP.stations.filter(s => s.bucket !== 'ISO_SIDE_REAR_DELT');
      const iso = CP.stations.find(s => s.bucket === 'ISO_BICEP');
      if (iso) CP.stations.splice(CP.stations.indexOf(iso) + 1, 0, { ...stationLike(iso, 'CLEAN/PUSH.s12'), note: 'biceps exercise 2' });
      CP.label = 'Pull + push press day';
      // the clean moves to the squat day: Friday keeps a jerk / push press (either pattern, R2-ATH-04 'jerk either')
      const cl = CP.stations.find(s => s.bucket === 'AP_TRIPLE_EXT');
      if (cl) { cl.variant = 'jerk'; cl.note = "'PUSH PRESS / JERK' (v1.2 review: clean on the squat day, snatch on the deadlift day)"; }
    }
    if (SQ) {
      // the squat day's second rear-delt fly becomes a triceps / side-delt pair (the push : pull balance moved to Friday)
      const rears = SQ.stations.filter(s => s.bucket === 'ISO_SIDE_REAR_DELT');
      if (rears.length === 2) { rears[1].variant = 'side'; rears[1].note = 'side delts (shoulders exercise 2)'; }
    }
  }
  // fat_loss_bootcamp.3: chest gets a station on Mon and Fri (review 05 blocker 2: chest 6 sets with both chest stations on
  // Wednesday): BC1's second calf station becomes a press (05 5.3 circuit 2 = [single-leg hinge | press]), BC3's rear-delt
  // station a push-up variant, and BC2's second calf station takes the rear-delt station. Calves keep 4 stations a week.
  const bc = F.fat_loss_bootcamp && F.fat_loss_bootcamp.days['3'];
  if (bc && bc.day_types) {
    const BC1 = bc.day_types.BC1, BC3 = bc.day_types.BC3, BC2 = bc.day_types.BC2;
    const calf2 = (d) => d && d.stations.filter(s => s.bucket === 'ISO_CALF')[1];
    const c1 = calf2(BC1); if (c1) { c1.bucket = 'RP_HPUSH'; c1.group = 'chest'; c1.note = 'press station (05 5.3 circuit 2 = single-leg hinge | press; v1.2 review)'; }
    const r3 = BC3 && BC3.stations.find(s => s.bucket === 'ISO_SIDE_REAR_DELT' && s.variant === 'rear');
    if (r3) { r3.bucket = 'ISO_CHEST'; r3.variant = null; r3.group = 'chest'; r3.note = 'chest station (push-up variant; the rear-delt station moved to BC2; v1.2 review)'; }
    const c2 = calf2(BC2); if (c2) { c2.bucket = 'ISO_SIDE_REAR_DELT'; c2.variant = 'rear'; c2.group = 'shoulders'; c2.note = 'rear delts (KB face pull, R2-LIB-04; v1.2 review)'; }
    // interleave circuit 2 of BC1 so the two posterior-chain stations are not back to back (UNI-11 bleed-over)
    if (BC1) {
      const i9 = BC1.stations.findIndex(s => s.bucket === 'RP_UHD'), i10 = BC1.stations.findIndex(s => s.bucket === 'ISO_LEG_FLEXION' && s.circuit === 2);
      const ip = BC1.stations.findIndex(s => s.bucket === 'RP_HPUSH');
      if (i9 >= 0 && i10 === i9 + 1 && ip > i10) { const [press] = BC1.stations.splice(ip, 1); BC1.stations.splice(i9 + 1, 0, press); }
    }
  }
  return F;
}

function stationLike(base, id) {
  const s = clone(base);
  s.id = id;
  s.pair = null; s.superset = null; s.include_from_minutes = null; s.axial = null; s.variant = null; s.variant_text = null;
  s.laterality_dial = false; s.loading = null; s.condition = null; s.condition_text = null; s.pool_filter = null; s.note = null;
  return s;
}

// ---------------------------------------------------------------------------------------------------------------- profiles

const PRIORITY_WORDS = [
  [/lats|upper back/i, 'lats_upper_back'], [/posterior cuff|rear delt|scapular/i, 'rear_delts'], [/glute/i, 'glutes'], [/quad/i, 'quads'],
  [/hamstring/i, 'hamstrings'], [/calf|soleus|achilles/i, 'calves'], [/chest|pec/i, 'chest'], [/side delt|lateral delt|shoulder/i, 'side_delts'],
  [/tricep/i, 'triceps'], [/bicep/i, 'biceps']
];

/**
 * Sport-profile fields the review fixes read from 04 v1.1 (plyo exclusions and directions, throw / core planes, resistance
 * priorities, push : pull, weekly direct arm sets, warm-up hints, Olympic policy for stay-active plans).
 * @param {object} norm normalized SportDef (normSport output) @param {object} src the 04 v1.1 profile
 * @returns {object} amended copy
 */
export function amendSport(norm, src) {
  const s = clone(norm);
  const plyo = src.plyo || {};
  const notes = [plyo.v1_1_verification_note, src.age_50_plus && src.age_50_plus.plyo, plyo.notes].filter(Boolean).join(' ');
  const excl = [];
  if (/no depth jumps/i.test(notes)) excl.push('depth_jump', 'high_depth_drop');
  if (/hurdle hops/i.test(notes) && /no [^.;]*hurdle hops/i.test(notes)) excl.push('hurdle_hop');
  if (/no [^.;]*bounds/i.test(notes)) excl.push('bound');
  s.plyo_rules = {
    exclude_tags: uniqSorted(excl),
    direction_pct: plyo.direction_pct || null,
    unilateral_pct: typeof plyo.unilateral_pct === 'number' ? plyo.unilateral_pct : null,
    tracks: Array.isArray(plyo.tracks) ? plyo.tracks.slice() : [],
    ankle_track: Array.isArray(plyo.tracks) && plyo.tracks.some(t => /ankle/i.test(t))
  };
  const th = src.throwing || {};
  s.throw_plane_pct = th.plane_pct || null;
  const core = src.core || {};
  s.core_rules = { plane_pct: core.plane_pct || null, anti_first: /anti-?(extension|rotation)/i.test(String(core.mode || '')) };
  const res = src.resistance || {};
  const pr = [];
  for (const p of res.priorities || []) for (const [re, m] of PRIORITY_WORDS) if (re.test(p) && !pr.includes(m)) pr.push(m);
  s.priority_muscles = pr;
  const ppm = /1\s*:\s*([0-9.]+)/.exec(String(res.push_pull || ''));
  s.pull_per_push = ppm ? Number(ppm[1]) : null;
  if (/target 1\s*:\s*([0-9.]+)/.test(String(res.push_pull || ''))) s.pull_per_push = Number(/target 1\s*:\s*([0-9.]+)/.exec(String(res.push_pull))[1]);
  const ws = src.weekly_sets || {};
  s.direct_sets_wk = { ISO_TRICEP: ws.ISO_TRICEP || 0, ISO_BICEP: ws.ISO_BICEP || 0, ISO_GRIP: ws.ISO_GRIP || 0 };
  s.sprint_tier = (src.sprint && src.sprint.tier) || null;
  s.running_sport = !!(src.sprint && src.sprint.tier && src.sprint.tier !== 'T0') || !!(src.cod && ['T2', 'T3', 'T4', 'T5'].includes(src.cod.tier));
  const op = src.olympic_policy || {};
  s.olympic.max_exposures_wk = typeof op.max_exposures_wk === 'number' ? op.max_exposures_wk : null;
  s.olympic.stay_active_two_sets = /one Olympic station per gym day \(2 sets\)/i.test(String(op.note || ''));
  s.age_50_plus_plyo = src.age_50_plus ? String(src.age_50_plus.plyo || '') : null;
  s.cod_tier = (src.cod && src.cod.tier) || null;
  return s;
}

// ---------------------------------------------------------------------------------------------------------------- i18n

/** EN canonical + ES PROPOSED (neutral Latin American, gym word in brackets, R2-GEN-08) */
/**
 * v1.2 (review 08 minor 16, 02 minor 12): client-facing day titles keep the pattern words and drop coach jargon ('axial',
 * 'clean day', 'snatch day'); the why[] keeps the reasons. Applied to the compiled and the fixture i18n alike.
 * @param {string} label @param {'en'|'es'} lang @returns {string}
 */
export function plainDayLabel(label, lang) {
  if (typeof label !== 'string') return label;
  const jargon = lang === 'es' ? /carga axial|d[ií]a de cargada|d[ií]a de arranque/i : /axial|clean day|snatch day/i;
  let out = label.replace(/\s*\(([^)]*)\)/g, (m, inner) => {
    const keep = inner.split(/[;,]/).map(x => x.trim()).filter(x => x && !jargon.test(x));
    return keep.length ? ' (' + keep.join(', ') + ')' : '';
  });
  out = lang === 'es' ? out.replace(/bisagra sin carga axial/gi, 'bisagra de cadera') : out.replace(/non-axial hinge/gi, 'hip hinge');
  return out.replace(/\s{2,}/g, ' ').trim();
}

/** UI_V12 keys that also replace a v1 spec copy string put later in the i18n build */
export const V12_FINAL = ['video.note'];

export const UI_V12 = {
  'note.buyout': ['Buy-out: 1-3 all-out bouts to finish the session', 'Buy-out: 1-3 esfuerzos a tope para cerrar la sesión'],
  'why.buyout': ['The buy-out is a short conditioning finisher, never a sprint after heavy lifting', 'El buy-out es un cierre corto de acondicionamiento, nunca un sprint después de pesas pesadas'],
  'reps.bout': ['1 all-out bout', '1 esfuerzo a tope'],
  'reps.calories': ['{n} cal', '{n} cal'],
  'reps.sprint_reps': ['{reps} x {m} m', '{reps} x {m} m'],
  'why.class_level': ['Class strength / power table (HALF TIME): the level climbs week by week', 'Tabla de fuerza / potencia de la clase (HALF TIME): el nivel sube semana a semana'],
  'why.rep_cap': ['This exercise has its own rep ceiling', 'Este ejercicio tiene su propio límite de repeticiones'],
  'why.olympic_stay_active': ['One light power piece: 2 sets of 3-6 fast reps', 'Una pieza ligera de potencia: 2 series de 3-6 repeticiones rápidas'],
  'why.station_note': ["The coach's template names this kind of exercise here", 'La plantilla del coach indica este tipo de ejercicio aquí'],
  'effort.olympic_power_db': ['move it fast: if the dumbbell slows down or your technique breaks, it is too heavy', 'muévela rápido: si la mancuerna se frena o la técnica se rompe, es demasiado peso'],
  'effort.olympic_power_kb': ['move it fast: if the kettlebell slows down or your technique breaks, it is too heavy', 'muévela rápido: si la kettlebell se frena o la técnica se rompe, es demasiado peso'],
  'block.test': ['Test', 'Prueba'],
  'ui.plan.wod_rounds': ['{n} rounds for time (cap {min} min)', '{n} vueltas por tiempo (límite {min} min)'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.SQUAT': ['Squat + clean day', 'Día de sentadilla + cargada'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.PRESS': ['Press day', 'Día de press'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.DEADLIFT': ['Deadlift + push + snatch day', 'Día de peso muerto + empuje + arranque'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.CLEAN/PUSH': ['Pull + push press day', 'Día de jalón + push press'],
  'day.fat_loss_bootcamp.3.BC3': ['Bootcamp 3 - single-leg squat + pulls + arms', 'Bootcamp 3 - sentadilla a una pierna + remos + brazos'],
  'check.v27_athletic_budget': ['Athletic work matches the sport profile (contacts, throws, cuts, sprint metres, Olympic sets)', 'El trabajo atlético coincide con el perfil del deporte (contactos, lanzamientos, cambios de dirección, metros de sprint, series olímpicas)'],
  'check.v28_laterality_share': ['Two-leg / single-leg share follows the plan', 'La proporción de trabajo a dos piernas / a una pierna sigue el plan'],
  'check.v29_push_pull': ['Pulling at least matches pressing (more for overhead sports)', 'El trabajo de jalón al menos iguala al de empuje (más en deportes por encima de la cabeza)'],
  'warning.offer_longer_sessions': ['To climb the whole stairway with every muscle at its starting sets, this plan needs about {min}-minute sessions (or one more training day). It now starts lower so every week still climbs.', 'Para subir toda la escalera con cada músculo en sus series iniciales, este plan necesita sesiones de unos {min} minutos (o un día más de entrenamiento). Ahora empieza más bajo para que cada semana siga subiendo.'],
  'warning.start_lowered': ['Starting sets were lowered for {muscles} so the stairway fits your {minutes}-minute sessions.', 'Las series iniciales de {muscles} se bajaron para que la escalera quepa en tus sesiones de {minutes} minutos.'],
  'offer.longer_sessions': ['Longer sessions ({min} min) with the full starting sets', 'Sesiones más largas ({min} min) con las series iniciales completas'],
  'offer.more_days': ['One more training day ({days} days)', 'Un día más de entrenamiento ({days} días)'],
  'offer.lower_start': ['Keep {minutes} minutes: lower starting sets, same stairway', 'Mantener {minutes} minutos: series iniciales más bajas, la misma escalera'],
  'changes.load_up_at_cap': ['At the planned sets for this week: add a little load or a rep', 'En las series planeadas de esta semana: agrega un poco de peso o una repetición'],
  'note.aerobic_required': ['This cardio session is part of the plan even if you skip the optional lifting.', 'Esta sesión de cardio es parte del plan aunque te saltes las pesas opcionales.'],
  'note.aerobic_separate': ['Separate session: any time of day (not added to your lifting time).', 'Sesión aparte: a cualquier hora del día (no se suma a tu tiempo de pesas).'],
  'note.test_rep_max_work_up': ['Test: work up to one top set of {test} (warm-up sets first), then record the weight.', 'Prueba: sube hasta una serie máxima de {test} (primero series de calentamiento) y anota el peso.'],
  'note.test_jump': ['Test: 3 attempts, record the best.', 'Prueba: 3 intentos, anota el mejor.'],
  'note.test_sprint': ['Test: 2-3 timed runs with full rest, record the best.', 'Prueba: 2-3 carreras cronometradas con descanso completo, anota la mejor.'],
  'note.test_baseline': ['Baseline test this week: it sets your starting numbers.', 'Prueba inicial esta semana: marca tus números de partida.'],
  'note.second_calf_sets': ['Second calf exercise: {n} set(s) ({total} calf sets today in total)', 'Segundo ejercicio de pantorrilla: {n} serie(s) ({total} series de pantorrilla hoy en total)'],
  'note.olympic_power_db': ['Power work: move the dumbbell fast; stop the set if it slows down.', 'Trabajo de potencia: mueve la mancuerna rápido; termina la serie si se frena.'],
  'note.olympic_power_kb': ['Power work: move the kettlebell fast; stop the set if it slows down.', 'Trabajo de potencia: mueve la kettlebell rápido; termina la serie si se frena.'],
  'note.kb_swing_power': ['Ballistic power: snap the hips, let the kettlebell float. Not counted as glute sets.', 'Potencia balística: extiende la cadera con fuerza y deja flotar la kettlebell. No cuenta como series de glúteo.'],
  'note.rep_cap': ['Reps capped for this exercise ({min}-{max}): it is harder than its group.', 'Repeticiones limitadas para este ejercicio ({min}-{max}): es más difícil que su grupo.'],
  'note.bodyweight_regress': ['Body-weight lift: if you cannot reach the reps, use the assisted machine or a band-free regression (feet on the floor, ring or TRX row).', 'Ejercicio con peso corporal: si no llegas a las repeticiones, usa la máquina asistida o una regresión sin ligas (pies en el piso, anillas o TRX).'],
  'note.box_low': ['Low box (6-12 in)', 'Cajón bajo (15-30 cm)'],
  'note.box_medium': ['Medium box (12-18 in)', 'Cajón mediano (30-45 cm)'],
  'note.credit_only': ['Trained through presses and rows', 'Se trabaja con los empujes y los remos'],
  'effort.hold_quality': ['hold with good form, stop before it breaks', 'mantén con buena técnica, detente antes de perderla'],
  'effort.circuit_resistance': ['pick a weight you could keep moving with about 2 reps left at the bell', 'elige un peso con el que podrías seguir moviéndote con unas 2 repeticiones de sobra al sonar la alarma'],
  'effort.circuit_metabolic': ['hard but steady pace', 'ritmo fuerte pero constante'],
  'ui.plan.circuit_work': ['Circuit work: {rounds} rounds x {stations} stations x {work_s} s = {minutes} min of work', 'Trabajo en circuito: {rounds} vueltas x {stations} estaciones x {work_s} s = {minutes} min de trabajo'],
  'ui.plan.est_minutes_cardio': ['about {min} min + {cardio} min cardio', 'aprox. {min} min + {cardio} min de cardio'],
  'ui.plan.plyo_share_planned': ['Plyo share {pct}% (target {target}%)', 'Proporción pliométrica {pct}% (meta {target}%)'],
  'ui.plan.warnings_first': ['Read this first', 'Lee esto primero'],
  'ui.plan.test_week_body': ['Body test this week: weigh in and measure on the first morning, before training.', 'Prueba corporal esta semana: pésate y mídete la primera mañana, antes de entrenar.'],
  'ui.plan.rir_drift': ['Effort climbs with the stairway: weeks {a} leave about 3 reps in the tank, the middle weeks 2, the hardest weeks 1-2.', 'El esfuerzo sube con la escalera: las semanas {a} deja unas 3 repeticiones en reserva, las semanas del medio 2, y las más duras 1-2.'],
  'ui.plan.trained_through': ['trained through presses and rows', 'se trabaja con empujes y remos'],
  'ui.plan.years': ['{n} year(s)', '{n} año(s)'],
  'ui.plan.optional_cardio_counts': ['optional lifting; the cardio counts', 'pesas opcionales; el cardio cuenta'],
  'ui.plan.day_label_generic': ['{lower} + {upper}', '{lower} + {upper}'],
  'ui.plan.label_part.squat': ['squat', 'sentadilla'], 'ui.plan.label_part.hinge': ['hinge', 'bisagra'], 'ui.plan.label_part.single_leg': ['single-leg', 'una pierna'],
  'ui.plan.label_part.push': ['push', 'empuje'], 'ui.plan.label_part.pull': ['pull', 'jalón'], 'ui.plan.label_part.legs': ['legs', 'piernas'],
  'warmup.mobility_prep': ['Mobility: KB book openers, thoracic rotations and pec-minor openers (5 min)', 'Movilidad: aperturas de libro con kettlebell, rotaciones torácicas y aperturas de pectoral menor (5 min)'],
  'warmup.balance_prep': ['Balance and reactive stepping: single-leg balance reach, split-step and first-step reactions (5 min)', 'Equilibrio y pasos reactivos: alcance a una pierna, split step y reacción de primer paso (5 min)'],
  'warmup.drills_or_mobility': ['A march, A skip, A run (or KB book openers for mobility)', 'Marcha A, skip A, carrera A (o aperturas de libro con kettlebell para movilidad)'],
  'prehab.label.ACHILLES_CALF': ['Joint care for the Achilles and calves', 'Cuidado articular del tendón de Aquiles y pantorrillas'],
  'prehab.label.KNEE_DEGENERATIVE_COURT': ['Joint care for the knees', 'Cuidado articular de rodillas'],
  'prehab.label.ELBOW_LATERAL_RACKET': ['Joint care for the paddle / racket elbow', 'Cuidado articular del codo de pala / raqueta'],
  'prehab.label.FALLS_COURT': ['Balance and reactive stepping', 'Equilibrio y pasos reactivos'],
  'prehab.label.SHOULDER_SWIMMER': ["Joint care for swimmer's shoulders", 'Cuidado articular de hombros de nadador'],
  'prehab.label.SHOULDER_THROWER': ['Joint care for overhead / racket shoulders', 'Cuidado articular de hombros por encima de la cabeza / raqueta'],
  'prehab.label.NECK': ['Neck care', 'Cuidado del cuello'],
  'why.play_spacing': ['Lower-body work stays off the day before play (48 h)', 'El trabajo de piernas no va el día antes de jugar (48 h)'],
  'why.group_moved': ['A whole muscle group moved to the optional day so the session fits', 'Un grupo muscular completo pasó al día opcional para que la sesión quepa'],
  'why.room_cut': ['Left out this block so the stairway has room to climb: {exercise}', 'Fuera en este bloque para que la escalera tenga espacio para subir: {exercise}'],
  'why.skill_in_warmup': ['Skill practice is done inside the warm-up today to fit your session length', 'La práctica de habilidad se hace dentro del calentamiento hoy para encajar en la duración de tu sesión'],
  'why.wod_short': ['The workout of the day stays shorter (10 to 15 minutes) so your strength sets can climb', 'El entrenamiento del día se mantiene más corto (10 a 15 minutos) para que tus series de fuerza puedan subir'],
  'why.short_start': ['Your session length leaves little room, so some accessory exercises start at 1 set and build up', 'La duración de tu sesión deja poco espacio, así que algunos accesorios empiezan con 1 serie y van subiendo'],
  'why.olympic_budget': ['Olympic lifts stay within your weekly budget of {sets} sets, so fewer days carry one', 'Los levantamientos olímpicos se mantienen dentro de tu presupuesto semanal de {sets} series, así que menos días llevan uno'],
  'plan.stair_level': ['Effort level this week: {level} (2 = start, 11 = a little past your limits)', 'Nivel de esfuerzo esta semana: {level} (2 = inicio, 11 = un poco más allá de tus límites)'],
  'video.note': ['Videos open on YouTube and are not made by Blaze Camp. We\'re building our own library. Have a great video of this exercise? Send it to @BLAZECAMP on Instagram.', 'Los videos se abren en YouTube y no son de Blaze Camp. Estamos creando nuestra propia biblioteca. ¿Tienes un buen video de este ejercicio? Envíalo a @BLAZECAMP en Instagram.'],
  'load.medball_one': ['{n} lb ball', 'balón de {n} lb'],
  'effort.drift': ['Planned effort across the stairway: {list}. The last week may add one intensifier on a small-muscle exercise.', 'Esfuerzo planeado en la escalera: {list}. La última semana puede añadir un intensificador en un ejercicio de músculo pequeño.'],
  'effort.drift_item': ['weeks {from}-{to}: leave {rir} in the tank', 'semanas {from}-{to}: deja {rir} en reserva'],
  'effort.drift_item_one': ['week {from}: leave {rir} in the tank', 'semana {from}: deja {rir} en reserva'],
  'ui.plan.before_you_start': ['Before you start', 'Antes de empezar'],
  'ui.plan.offers': ['Your schedule options', 'Tus opciones de horario'],
  'ui.plan.offer_chosen': ['(this plan)', '(este plan)'],
  'equipment.token.anchor_point': ['anchor point', 'punto de anclaje'],
  'equipment.token.barbell': ['barbell', 'barra (barbell)'],
  'equipment.token.belt_squat': ['belt squat machine', 'máquina de sentadilla con cinturón (belt squat)'],
  'equipment.token.bench': ['bench', 'banco'],
  'equipment.token.box': ['box', 'cajón'],
  'equipment.token.cable': ['cable station', 'estación de poleas (cable)'],
  'equipment.token.cardio_machine_cal': ['cardio machine with a calorie display', 'máquina de cardio con contador de calorías'],
  'equipment.token.cones': ['cones', 'conos'],
  'equipment.token.dip_bars': ['dip bars', 'barras paralelas (dip bars)'],
  'equipment.token.dip_belt': ['dip belt', 'cinturón de lastre (dip belt)'],
  'equipment.token.dumbbell': ['dumbbells', 'mancuernas (dumbbells)'],
  'equipment.token.ez_bar': ['EZ bar', 'barra Z (EZ bar)'],
  'equipment.token.farmer_handles': ['farmer handles', 'agarres de granjero (farmer handles)'],
  'equipment.token.foam_roller': ['foam roller', 'rodillo de espuma (foam roller)'],
  'equipment.token.ghd': ['GHD', 'GHD'],
  'equipment.token.hex_bar': ['hex (trap) bar', 'barra hexagonal (trap bar)'],
  'equipment.token.household': ['household items', 'objetos de casa'],
  'equipment.token.hurdles': ['mini hurdles', 'mini vallas'],
  'equipment.token.hyper_bench': ['hyperextension bench', 'banco de hiperextensiones'],
  'equipment.token.jump_rope': ['jump rope', 'cuerda para saltar'],
  'equipment.token.kettlebell': ['kettlebells', 'pesas rusas (kettlebells)'],
  'equipment.token.landmine': ['landmine', 'landmine'],
  'equipment.token.machine_plate_loaded': ['plate-loaded machines', 'máquinas de discos'],
  'equipment.token.machine_selectorized': ['selectorized machines', 'máquinas de selector'],
  'equipment.token.machine_specialty': ['specialty machines', 'máquinas especiales'],
  'equipment.token.medball': ['medicine ball', 'balón medicinal (medball)'],
  'equipment.token.open_space_long': ['open space (20 m or more)', 'espacio abierto (20 m o más)'],
  'equipment.token.open_space_short': ['open space (10 m)', 'espacio abierto (10 m)'],
  'equipment.token.plate_low_target': ['low target plate', 'disco de objetivo bajo'],
  'equipment.token.plyo_box_high': ['high plyo box', 'cajón pliométrico alto'],
  'equipment.token.pullup_bar': ['pull-up bar', 'barra de dominadas (pull-up bar)'],
  'equipment.token.rack': ['squat rack', 'rack de sentadillas'],
  'equipment.token.reverse_hyper': ['reverse hyper machine', 'máquina de hiperextensión inversa (reverse hyper)'],
  'equipment.token.sandbag': ['sandbag', 'saco de arena (sandbag)'],
  'equipment.token.seal_bench': ['seal row bench', 'banco para remo foca (seal row)'],
  'equipment.token.sled': ['sled', 'trineo (sled)'],
  'equipment.token.slider': ['sliders', 'deslizadores (sliders)'],
  'equipment.token.smith': ['Smith machine', 'máquina Smith'],
  'equipment.token.ssb': ['safety squat bar', 'barra de seguridad (safety squat bar)'],
  'equipment.token.stability_ball': ['stability ball', 'pelota de estabilidad'],
  'equipment.token.step_low': ['low step', 'escalón bajo'],
  'equipment.token.treadmill': ['treadmill', 'caminadora (treadmill)'],
  'equipment.token.trx': ['suspension trainer (TRX)', 'entrenador de suspensión (TRX)'],
  'equipment.token.wall': ['wall', 'pared'],
  'equipment.token.weight_bench': ['weight bench', 'banco de pesas'],
  'equipment.token.weight_plate': ['weight plates', 'discos de peso'],
  'warning.long_day': ['{day} runs about {min} min (you picked {limit}): the minimum work of that day (2-4 exercises per muscle group, core, the athletic pieces) does not fit; see your schedule options', '{day} dura aprox. {min} min (elegiste {limit}): el trabajo mínimo de ese día (2-4 ejercicios por grupo muscular, core, el trabajo atlético) no cabe; mira tus opciones de horario'],
  'warning.long_day_optional': ['Your optional {day} runs about {min} min with its aerobic session (you picked {limit}): do the aerobic part at another time if you are short on time', 'Tu {day} opcional dura unos {min} min con su sesión aeróbica (elegiste {limit}): haz la parte aeróbica en otro momento si te falta tiempo'],
  'profile.bodybuilding_aesthetics.name_recreational': ['Muscle & physique', 'Músculo y físico'],
  'why.core_superset': ['Your two core exercises alternate as a pair to fit your session length', 'Tus dos ejercicios de core se alternan en pareja para encajar en la duración de tu sesión'],
  'why.capacity_start': ['The whole stairway was sized to your session length first, so every week can climb', 'Toda la escalera se ajustó primero a la duración de tu sesión, para que cada semana pueda subir'],
  'why.group_fewer_days': ['This group is trained on fewer days with 2 exercises each, so week 1 starts at its target', 'Este grupo se entrena en menos días con 2 ejercicios cada uno, para que la semana 1 empiece en su meta'],
  'why.hotspot': ['Chosen around the sport\'s injury hot spot', 'Elegido por el punto de riesgo de lesión del deporte'],
  'why.opposite_pattern': ['Athletes pair the two-leg lift with the opposite single-leg pattern', 'Los atletas combinan el ejercicio a dos piernas con el patrón contrario a una pierna'],
  'why.athletic_reconcile': ['Dose sized to the sport\'s weekly target', 'Dosis ajustada a la meta semanal del deporte'],
  'why.tested_locked': ['Same exercise in the baseline and end test', 'El mismo ejercicio en la prueba inicial y en la final'],
  'why.placed_rise_cap': ['At most one more set a week for a muscle (never above 7 %)', 'Como máximo una serie más por semana para un músculo (nunca más del 7 %)'],
  'detail.box': ['box height', 'altura del cajón'],
  'tests.sprint_10_30m_80_90': ['10-30 m sprint at 80-90 % effort (baseline, not all-out)', 'Sprint de 10-30 m al 80-90 % (prueba inicial, sin ir al máximo)'],
  'tests.mile_or_erg_80_90': ['1-mile run or 2k erg at 80-90 % effort (baseline, not all-out)', '1 milla corriendo o 2 km en ergómetro al 80-90 % (prueba inicial, sin ir al máximo)']
};
