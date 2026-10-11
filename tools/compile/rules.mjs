// tools/compile/rules.mjs - B1 (model compiler): the runtime rules.json (rules/2, engine/CONTRACTS.md §3.3), v1.1.
// Ported verbatim from the architect's normative reading tools/fixture/rules.mjs (model/rules.json must deep-equal the
// fixture's rules: tests/compile.test.mjs). Values = generator_spec_v1.json 1.1.0 rule_tables + 12_volume_algorithm_v1.json
// (content v1.1) + 05 / 06 / 04 v1.1, with coach_answers_round2.md applied (newest authority). Every value a round-3
// question still owns carries "r3". The compiler cross-checks the key numbers against the sources (tools/compile/crosscheck.mjs)
// instead of re-deriving them, so a drift in either direction shows up in model/COMPILE_REPORT.json.
import { CREDIT_MAP } from './catalog.mjs';

const L = (a, b, c) => ({ L1: a, L2: b, L3: c });
const ALL_TARGET = ['quads', 'hamstrings', 'glutes', 'chest', 'lats_upper_back', 'side_delts', 'biceps', 'triceps', 'calves'];

// ---------------------------------------------------------------- stairway tables (12 v1.1 §3.7.1; computed, PROPOSED numbers)
function stairTable(N) {
  const h = Math.ceil(N / 2);
  const steps = {};
  let A = 0; const Aw = { 1: 0 };
  for (let w = 2; w <= N; w++) { const early = w <= h; steps[w] = early ? 0.03 : 0.05; A += early ? 1 : 5 / 3; Aw[w] = A; }
  const level = {}; const effort = {};
  for (let w = 1; w <= N; w++) {
    const lv = N === 1 ? 11 : Math.round((2 + 9 * Aw[w] / A) * 10) / 10;
    level[w] = lv;
    effort[w] = w === N ? '1+' : (lv <= 5 ? '3' : lv <= 8 ? '2' : '1-2');
  }
  let growth = 1; for (let w = 2; w <= N; w++) growth *= 1 + steps[w];
  return { halfway: h, standard_steps: steps, growth: Math.round(growth * 10000) / 10000, display_level: level, planned_effort: effort };
}
function phasesFor(N) {
  const hardest = Math.ceil(N / 3);
  const accL2 = Math.max(1, Math.round(N / 4));
  const out = {};
  for (const [lvl, acc] of [['L1', accL2 + 1], ['L2', accL2], ['L3', Math.max(1, accL2 - 1)]]) {
    const hStart = N - hardest + 1;
    const a = Math.min(acc, hStart - 1);
    out[lvl] = { ACCLIMATION: [1, Math.max(1, a)], DRIVE: a + 1 <= hStart - 1 ? [a + 1, hStart - 1] : null, HARDEST: [hStart, N] };
  }
  return out;
}
function rcWeeks(N) {
  const a = Math.max(1, Math.round(N / 4)), b = Math.max(1, Math.round(N / 3));
  const r1 = [1, a], r2 = [a + 1, Math.min(N, a + b)], r3 = a + b + 1 <= N ? [a + b + 1, N] : null;
  return { RC1: r1, RC2: r2[0] <= N ? r2 : null, RC3: r3 };
}
function exerciseBlocks(N) {
  const k = Math.max(1, Math.floor(N / 4));
  const base = Math.floor(N / k), extra = N % k; const out = []; let s = 1;
  for (let i = 0; i < k; i++) { const len = base + (i < extra ? 1 : 0); out.push([s, s + len - 1]); s += len; }
  return out;
}
const RANGE_N = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export function buildRules(equipmentModel) {
  const prof = (id) => equipmentModel.access_profiles[id].kit.slice().sort();
  const stairByN = {}, phasesByN = {}, rcByN = {}, exBlocksByN = {};
  for (const N of RANGE_N) { stairByN[N] = stairTable(N); phasesByN[N] = phasesFor(N); rcByN[N] = rcWeeks(N); exBlocksByN[N] = exerciseBlocks(N); }
  return {
    schema: 'rules/2',
    rules_version: '1.1.0',
    locked: [
      { id: 'LK01', key: 'locked.no_failure_heavy_compounds', refs: ['GEN-08', 'VOL-13'] },
      { id: 'LK02', key: 'locked.no_v_squat', refs: ['GEN-08'] },
      { id: 'LK03', key: 'locked.power_before_strength', refs: ['GEN-08', 'ORD-03'] },
      { id: 'LK04', key: 'locked.horizontal_before_vertical', refs: ['GEN-08', 'ORD-01'] },
      { id: 'LK05', key: 'locked.core_never_skipped', refs: ['GEN-08', 'ATH-11'] },
      { id: 'LK06', key: 'locked.no_variable_resistance', refs: ['EQ-01', 'EQ-12'] },
      { id: 'LK07', key: 'locked.athletic_never_counts', refs: ['VOL-10', 'R2-VOL-05'] },
      { id: 'LK09', key: 'locked.older_injured_never_list', refs: ['EQ-03', 'R2-ATH-08'] },
      { id: 'LK10', key: 'locked.no_sex_rules', refs: ['ATH-09', 'GEN-02'] },
      { id: 'LK11', key: 'locked.two_spine_days', refs: ['PER-04', 'EQ-11', 'R2-SES-01', 'R2-SES-02'] },
      { id: 'LK12', key: 'locked.medball_max_20lb', refs: ['EQ-06'] },
      { id: 'LK13', key: 'locked.no_deload_inside_block', refs: ['R2-VOL-07'] },
      { id: 'LK14', key: 'locked.no_max_test_from_zero', refs: ['R2-PER-07'] },
      { id: 'LK15', key: 'locked.older_power_opt_in', refs: ['R2-ATH-08'] },
      { id: 'LK16', key: 'locked.no_lifestyle_inputs', refs: ['R2-GEN-04'] },
      { id: 'LK17', key: 'locked.release_every_build', refs: ['R2-GEN-03'] },
      { id: 'LK18', key: 'locked.no_checkin_no_change', refs: ['R2-VOL-03'] }
    ],
    muscles: {
      order: ['quads', 'hamstrings', 'glutes', 'chest', 'lats_upper_back', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'calves', 'abs_obliques', 'forearms', 'front_delts', 'traps', 'adductors', 'neck'],
      defs: {
        quads: { class: 'big', region: 'lower', fill: 'target', target: true, group: 'quads' },
        hamstrings: { class: 'big', region: 'lower', fill: 'target', target: true, group: 'hips' },
        glutes: { class: 'big', region: 'lower', fill: 'target', target: true, group: 'hips', athlete_fill: 'credit' },
        chest: { class: 'big', region: 'upper', fill: 'target', target: true, group: 'chest' },
        lats_upper_back: { class: 'big', region: 'upper', fill: 'target', target: true, group: 'back' },
        side_delts: { class: 'small', region: 'upper', fill: 'target', target: true, group: 'shoulders', athlete_fill: 'credit' },
        rear_delts: { class: 'small', region: 'upper', fill: 'target', target: true, group: 'shoulders', own_sets: true, floor_on_group: true },
        biceps: { class: 'small', region: 'upper', fill: 'target', target: true, group: 'biceps', athlete_fill: 'credit' },
        triceps: { class: 'small', region: 'upper', fill: 'target', target: true, group: 'triceps', athlete_fill: 'credit' },
        calves: { class: 'small', region: 'lower', fill: 'target', target: true, group: 'calves', per_leg_day: true },
        abs_obliques: { class: 'small', region: 'core', fill: 'core_block', target: false, group: 'core' },
        forearms: { class: 'small', region: 'upper', fill: 'floor', target: false, group: null },
        front_delts: { class: 'unplaced', region: 'upper', fill: 'floor', target: false, group: 'shoulders' },
        traps: { class: 'unplaced', region: 'upper', fill: 'floor', target: false, group: 'shoulders' },
        adductors: { class: 'unplaced', region: 'lower', fill: 'floor', target: false, group: null },
        neck: { class: 'unplaced', region: 'upper', fill: 'floor', target: false, group: null }
      },
      groups: {
        order: ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves', 'core'],
        members: { quads: ['quads'], hips: ['glutes', 'hamstrings'], back: ['lats_upper_back'], chest: ['chest'], shoulders: ['side_delts', 'rear_delts', 'front_delts', 'traps'], biceps: ['biceps'], triceps: ['triceps'], calves: ['calves'], core: ['abs_obliques'] },
        r3: 'R3-SES-01', refs: ['R2-SES-05']
      },
      refs: ['CAT-02', 'R2-SES-05']
    },
    credit: {
      helper: 0.25,
      unilateral_set: 1,
      myo_set_value: 2,
      athletic_slot_zero: true,
      athletic_slot_buckets: ['SKILL', 'AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_SPRINT', 'AP_THROW', 'AP_COD', 'AP_TRIPLE_EXT', 'COND_AEROBIC', 'COND_SPRINT_BUYOUT', 'COND_CIRCUIT', 'COND_WOD', 'WARMUP_GENERAL', 'WARMUP_PREP', 'FUNCTIONAL', 'RECOVERY_ARM_CARE', 'PREHAB_LOWER', 'PREHAB_NECK'],
      classes: CREDIT_MAP,
      never_credit_tags: ['kb_swing', 'wall_ball'],
      exceptions: { DIPS: 'R2-VOL-05 / LIB-16: 0.5 triceps + 0.5 chest', THRUSTER: 'R2-VOL-05: 1.0 quads + 0.5 shoulders + 0.25 glutes', FACEPULL: 'R2-LIB-04, LIB-10 (split PROPOSED)' },
      refs: ['VOL-09', 'VOL-10', 'UNI-01', 'LIB-14', 'LIB-16', 'R2-VOL-05', 'R2-LIB-04']
    },
    levels: {
      client: { L1_below_years: 1, L3_min_years: 3, L3_min_days: 4, L3_competitive_physique_strength: true, layoff_months_body_L1: 6, former_competitor_first_block_L1: true, refs: ['PRG-05'], status: 'L3 PROPOSED' },
      exercise_ladder: { L1: 'foundational', L2: 'intermediate', L3: 'advanced' },
      ladder_order: ['foundational', 'intermediate', 'advanced'],
      youth_max_ladder: 'intermediate',
      older_age: 60, active_aging_age: 50, youth_age: 18,
      over_ladder_penalty: 1.5,
      pro_setting: { enabled_by_default: false, min_level: 'L3', muscles_max: 1, cap_max: 35, requires_output_mode: ['checkin', 'logbook'], refs: ['R2-VOL-06'], status: 'PROPOSED' },
      refs: ['CAT-04', 'CAT-05', 'CAT-06', 'PRG-05', 'R2-ATH-08']
    },
    volume: {
      start: {
        quads: L(10, 15, 20), hamstrings: L(10, 15, 20), glutes: L(10, 15, 20), chest: L(10, 15, 20), lats_upper_back: L(10, 15, 20),
        side_delts: L(10, 12, 15), biceps: L(10, 12, 15), triceps: L(10, 12, 15), rear_delts: L(4, 6, 8)
      },
      start_refs: ['VOL-01', 'R2-VOL-04', 'R2-VOL-06'],
      cap: {
        quads: L(14, 22, 25), hamstrings: L(14, 22, 25), glutes: L(14, 22, 25), chest: L(14, 22, 25), lats_upper_back: L(14, 22, 25),
        side_delts: L(14, 22, 25), biceps: L(14, 22, 25), triceps: L(14, 22, 25), calves: L(14, 22, 25), rear_delts: L(8, 12, 16), abs_obliques: L(16, 20, 20)
      },
      cap_refs: ['R2-VOL-06'],
      cap_scales_with_modifier: true,
      cap_rule: 'cap = max(round_half_up(cap[m][L] x factor), start + round_half_up((cap[m][L] - start[m][L]) x factor)); priority caps and own-sets caps unscaled; never above priority.absolute_cap (Pro setting excepted); finally cap >= start',
      cap_keeps_growth_room: true,
      calves: { per_leg_day: L(3, 3, 3), per_leg_day_max_L3: 4, weekly_floor: 10, second_station_sets: 1, refs: ['VOL-17', 'R2-VOL-06'], status: 'weekly floor PROPOSED' },
      core_block: { exercises: 2, sets: 2, refs: ['VOL-17', 'ATH-11', 'R2-SES-03'] },
      floor: {
        value: 10,
        applies_to: 'target_muscles_in_training_blocks',
        exempt: ['block_types:pre_season,in_season,maintenance,taper,recovery', 'pain_reduced', 'credit_only', 'own_sets(rear_delts: read on the shoulders group)', 'format:circuit'],
        schedule_shortfall: 'warn',
        refs: ['R2-VOL-06'], r3: 'R3-VOL-01'
      },
      priority: {
        max_muscles: 2,
        add: L(4, 4, 6),
        cap: { default: L(18, 26, 30), chest: L(18, 28, 30), rear_delts: L(12, 16, 20) },
        absolute_cap: 30,
        nonpriority_step_cap: 0.03,
        per_session_cap: 14,
        first_in_session: true,
        intake_map: { quads: ['quads'], glutes: ['glutes'], hamstrings: ['hamstrings'], back: ['lats_upper_back'], chest: ['chest'], side_delts: ['side_delts'], rear_delts: ['rear_delts'], biceps: ['biceps'], triceps: ['triceps'], calves: ['calves'], core: ['abs_obliques'], v_taper: ['side_delts', 'lats_upper_back'] },
        v_taper_hold: ['chest'],
        refs: ['VOL-02', 'VOL-18', 'ORD-04', 'ORD-11', 'R2-VOL-06'], status: 'add split +4/+4/+6 PROPOSED; caps approved R2-VOL-06'
      },
      per_session: { soft: 11, priority: 14 },
      rounding: 'half_up',
      order_of_operations: ['base', 'modifier', 'round_half_up', 'priority_add', 'floor_10', 'pain_factor', 'profile_ratios', 'phase_factor(maintenance|pre_season|in_season)', 'cycles', 'cap_at_least_start'],
      modifiers: {
        aesthetics: { lower: 1, upper: 1, small: 1, refs: ['VOL-01', 'UNI-06'] },
        strength: { lower: 1, upper: 1, small: 0.75, refs: ['VOL-12'] },
        general: { lower: 0.8, upper: 0.8, small: 0.8, refs: ['UNI-09', 'UNI-06', 'ATH-13'] },
        fat_loss: { lower: 0.8, upper: 0.8, small: 0.8, refs: ['ATH-07'] },
        stay_active: { lower: 0.8, upper: 0.8, small: 'credit', refs: ['ATH-13', 'COACH-CHAT 2026-10-08'], status: 'small = credit INFERRED (athletic templates carry no arm stations), D-07', r3: 'R3-VOL-01' },
        field_off: { lower: 0.7, upper: 0.5, small: 'credit', refs: ['VOL-08', 'VOL-17', 'UNI-02'] },
        strength_athlete_off: { lower: 0.9, upper: 0.8, small: 0.6, refs: ['ATH-03'] },
        athlete_in: { lower: 0.45, upper: 0.35, small: 'credit', refs: ['PER-08', 'UNI-10'] }
      },
      modifier_select: [
        { when: { family: ['athletic', 'hybrid_crossfit'], competitive: ['competitive'], ath03_group: ['resistance'] }, use: 'strength_athlete_off' },
        { when: { family: ['athletic'], competitive: ['competitive'], ath03_group: ['combat'], body_weight_lb_gte: 200 }, use: 'strength_athlete_off' },
        { when: { family: ['athletic', 'hybrid_crossfit'], competitive: ['competitive'] }, use: 'field_off' },
        { when: { family: ['athletic', 'hybrid_crossfit'] }, use: 'stay_active' },
        { when: { goal: ['muscle'] }, use: 'aesthetics' },
        { when: { goal: ['strength'] }, use: 'strength' },
        { when: { goal: ['fat_loss'] }, use: 'fat_loss' },
        { when: {}, use: 'general' }
      ],
      phase_factors: {
        pre_season: { of: 'last_offseason_week_sets', factor: 0.6, floor: false, step: 0, refs: ['R2-PER-06'] },
        in_season: { modifier: 'athlete_in', step: 0, floor: false, refs: ['PER-08', 'UNI-10', 'R2-ATH-07'] },
        taper: { of: 'pre_season_sets', factor: 0.5, refs: ['R2-PER-06'], status: 'factor inside the approved -40-60 %' },
        maintenance: { refs: ['PER-01', 'R2-PER-06'], see: 'plan_types.maintenance_4_6' }
      },
      striker: { factor: 0.6, range: [0.5, 0.7], applies_to_buckets: ['RP_HPUSH', 'RP_VPUSH', 'RP_VPULL', 'ISO_BICEP', 'ISO_TRICEP'], when_season_phase: ['PRE', 'IN'], when_plan_mode: ['prep'], profiles: ['boxing', 'kickboxing_muay_thai', 'karate_taekwondo', 'taekwondo', 'mma'], never_zero: true, refs: ['ATH-04'], status: 'factor PROPOSED; off-season build not reduced (INFERRED)' },
      pitcher: { vpush_factor: 0.5, rear_delt_add: 2, variants: ['baseball_pitcher', 'softball_pitcher'], refs: ['ATH-08'] },
      older: { step_cap: 0.03, maintenance_floor: 0.7, constraint_band: [4, 5], refs: ['EQ-03', 'R2-ATH-08'], status: 'step cap PROPOSED' },
      pain: {
        start_factor: 0.6, start_factor_range: [0.5, 0.7], freeze_weeks: 2, after_freeze_step_cap: 0.03, share_shift: 0.2, constraint_bias: [4, 5], refer_if_severity: ['severe'],
        areas: {
          neck: { muscles: [], avoid_tags: ['overhead_barbell', 'bent_over'], prefer_tags: ['machine', 'chest_supported'] },
          shoulder: { muscles: ['chest', 'side_delts', 'front_delts'], avoid_tags: ['overhead_barbell', 'dips', 'upright_row', 'fixed_grip'], prefer_tags: ['split_grip', 'machine'] },
          elbow: { muscles: ['biceps', 'triceps'], avoid_tags: ['skullcrusher', 'fixed_grip', 'dips'], prefer_tags: ['cable', 'split_grip'] },
          wrist_hand: { muscles: [], avoid_tags: ['fixed_grip', 'front_rack', 'push_up_floor'], prefer_tags: ['machine', 'split_grip'] },
          upper_back: { muscles: ['lats_upper_back'], avoid_tags: ['bent_over'], prefer_tags: ['chest_supported', 'machine'] },
          lower_back: { muscles: [], max_axial_class: 'low', avoid_tags: ['good_morning', 'bent_over', 'axial_high', 'spine_counted'], prefer_tags: ['machine', 'chest_supported', 'glute_iso', 'belt_squat'], share_shift_to: 'unilateral' },
          hip_groin: { muscles: ['adductors'], avoid_tags: ['cossack', 'sumo', 'deep_knee_flexion'], prefer_tags: ['machine'], share_shift_to: 'bilateral' },
          knee: { muscles: ['quads'], avoid_tags: ['deep_knee_flexion', 'depth_jump', 'high_impact', 'hurdle_hop', 'bound'], prefer_tags: ['machine'], share_shift_to: 'bilateral' },
          ankle_foot: { muscles: ['calves'], avoid_tags: ['high_impact', 'plyo_repeated'], prefer_tags: ['machine'] },
          other: { muscles: [], avoid_tags: [], prefer_tags: [] }
        },
        worse_with: {
          overhead: { avoid_tags: ['overhead'] }, deep_knee_bend: { avoid_tags: ['deep_knee_flexion'] }, impact: { avoid_tags: ['high_impact', 'plyo_repeated'] },
          twisting: { avoid_planes_in_core_and_throws: ['transverse'] }, bending_forward: { avoid_tags: ['bent_over', 'good_morning'], max_axial_class: 'low' },
          gripping: { avoid_tags: ['fixed_grip'] }, running: { avoid_buckets: ['AP_SPRINT', 'AP_COD', 'COND_SPRINT_BUYOUT'] }
        },
        refs: ['VOL-03', 'UNI-02', 'UNI-08', 'EQ-03', 'R2-LIB-03'], status: 'area map, factor 0.6, freeze handling PROPOSED'
      },
      refs: ['VOL-01', 'VOL-02', 'VOL-03', 'R2-VOL-04', 'R2-VOL-05', 'R2-VOL-06']
    },
    stairway: {
      principle: 'every training block climbs like a stairway: small steps to the halfway week, slightly bigger after it, the hardest weeks last; one rule for every person',
      standard_steps: { early: 0.03, late: 0.05 },
      halfway: 'ceil(N/2)',
      lambda: { solve: 'bisection', lo: 0, hi: 1, iterations: 60, display_round_to: 4, last_week_equals_cap_when_lambda_below_1: true },
      by_N: stairByN,
      phases_by_N: phasesByN,
      phases_by_N_note: 'labels only (ACCLIMATION / DRIVE / HARDEST); 12 and 8 equal generator_spec plan_types phases_by_level',
      exercise_blocks_by_N: exBlocksByN,
      limits: { planned_step_max: 0.07, nonpriority_while_priority: 0.03, older_60plus: 0.03, pain_after_freeze: 0.03, total_weekly_ceiling: 0.10, total_ceiling_strict: true, hand_set_max: 0.07, exempt_from_total_ceiling: ['first_week_after_recovery_or_maintenance', 'block_boundary_swap_no_added_sets'] },
      release: { threshold: 1, epsilon: 1e-9, bank_max_blocked: 1.99, staggering: 'smallest_bank_waits', order: ['priority', 'big', 'small', 'muscles.order'], at_cap: 'hold' },
      continues_across_exercise_blocks: true,
      no_checkin: 'planned',
      checkin: {
        read_against_stairway: true,
        rows: [
          { id: 'easy', when: 'median_effort_lte_6', step: 'planned_plus', plus: 0.02, max: 0.07 },
          { id: 'on_target', when: 'median_effort_7_8', step: 'planned' },
          { id: 'hard', when: 'median_effort_9', step: 'hold' },
          { id: 'ten', when: 'any_effort_10', step: 'hold', minus_one_set: 'that_day_last_added', target_minus: 1 },
          { id: 'repeat', when: 'sessions_done_below_half', step: 'repeat_week' },
          { id: 'pain', when: 'felt_pain', step: 'muscle_zero', protocol: 'volume.pain' }
        ],
        order: ['repeat', 'ten', 'pain', 'hard', 'easy', 'on_target'],
        effort_10_meaning: 'the max I could do, and I made it (successful, 0 RIR)',
        couldnt_do_it: 'one level down or assisted next week, sets unchanged',
        block_cannot_be_finished_offer_when: ['hold_two_weeks_in_a_row', 'effort_9_10_two_weeks', 'sessions_below_half_two_weeks', 'pain_2plus_exercises_in_a_week', 'pain_two_weeks_or_worse', 'user_taps_cannot_finish'],
        no_life_question: true,
        refs: ['R2-VOL-01', 'R2-VOL-02', 'R2-VOL-03', 'R2-GEN-04', 'R2-VOL-07'], r3: 'R3-VOL-02, R3-VOL-04, R3-PER-01'
      },
      refs: ['R2-PER-03', 'R2-PER-04', 'R2-PER-05', 'R2-VOL-01', 'R2-VOL-03', 'UNI-05', 'VOL-05', 'VOL-06'], status: '3 % / 5 %, lambda, display, RIR drift PROPOSED', r3: 'R3-VOL-04'
    },
    placement: {
      day_rotation: 'alternate', day_rotation_r3: 'R3-VOL-03',
      laterality_tolerance: 0.03,
      order_rule: 'first_below_first',
      max_sets_per_exercise: L(4, 5, 5), max_sets_isolation: 4, min_sets: 2,
      bonus: { sets: 2, for: 'small', prefer: ['optional_day_focus', 'day_training_group_fewest_exercises'], never_only_exercise_of_group: true, r3: 'R3-VOL-03' },
      focus: { sets: 2, for: 'big', prefer: ['optional_day', 'day_training_region'] },
      week1_fit: { trim_above: 1, add_below: 1, trim_order: 'latest_isolation_first' },
      refs: ['VOL-07', 'VOL-16', 'ORD-10', 'ORD-11', 'R2-SES-05']
    },
    session: {
      exercise_cap_by_minutes: { 30: 4, 45: 5, 60: 7, 75: 9, 90: 9, 105: 9, 120: 9 },
      exercise_cap_applies_to: 'split_days_only',
      full_body_days: { rule: 'every muscle group trained that day gets 2-4 exercises, never 1', cap: null, refs: ['R2-SES-05'] },
      athlete_cap: 12, athlete_cap_counts_core: false, athlete_cap_counts_warmup: false, small_iso_superset_counts_as_one: true, athlete_cap_refs: ['R2-SES-04'],
      outside_cap_blocks: ['warmup', 'core', 'skill', 'prehab', 'conditioning', 'aerobic', 'cooldown'],
      exercises_per_group: { full_body_day: [2, 4], split_day: [3, 4], exempt_groups: ['calves', 'core'], exempt_families: ['strength'], exempt_note: 'conjugate four-role days stay as written (flagged, master 10.3)', refs: ['R2-SES-05', 'VOL-07'], r3: 'R3-SES-01' },
      default_sets: { compound: 3, isolation: 2, calves_first: 2, calves_second: 1, core: 2, athletic: 2, athletic_at_90: 3, focus: 2, min: 2, refs: ['VOL-16', 'VOL-17'] },
      minutes_default: { athletes_bodybuilders_powerlifters: 90, general_fat_loss: 60, bootcamp: 45, non_competitive_athletic: 60, older_injured: 60 },
      minutes_allowed: [30, 45, 60, 75, 90, 105, 120],
      minutes_over_90_competitive_only: true,
      long_day: { warn_above_factor: 1.10, refs: ['R2-SES-05'], note: 'full-body days may run a little longer (warning, not an error)' },
      off_days_min: 1,
      refs: ['VOL-08', 'VOL-16', 'VOL-17', 'UNI-09', 'R2-SES-04', 'R2-SES-05']
    },
    time_model: {
      minutes_per_set: { warmup_session: 8, core_set: 1.5, compound_bilateral: 2.5, compound_unilateral: 3.75, isolation: 1.75, isolation_unilateral: 2.5, plyo_or_ballistic: 1.5, olympic: 3, throw: 1.25, cod: 1.5, sprint: 2, skill_block: 8, prehab: 1.5 },
      changeover_min_per_exercise: 1.0, changeover_in_superset_pair: 0.5,
      superset_factor: 0.65,
      aerobic_addon_minutes: { A: 15, B: 20, C: 30, LC: 20 },
      wod_minutes: [10, 20], walk_minutes: [20, 30],
      circuit: { transition_s: 15, between_rounds_s: 90 },
      unilateral_factor: 1.5,
      refs: ['ORD-08', 'VOL-14', 'UNI-09', 'R2-SES-05'], status: 'PROPOSED'
    },
    cut_order: {
      aesthetics: [{ id: 'focus', match: { role: ['focus'] } }, { id: 'third_of_group', match: { third_of_group: true } }, { id: 'second_non_axial_bilateral', match: { role: ['secondary'], axial: ['non_axial'] } }],
      athletic: [{ id: 'second_plyo_or_sprint', match: { bucket: ['AP_JUMP_LIMITED_KNEE', 'AP_SPRINT'] } }, { id: 'cod_non_cod_sport', match: { bucket: ['AP_COD'], unless_profile_cod: true } }, { id: 'buyout', match: { bucket: ['COND_SPRINT_BUYOUT'] } }, { id: 'second_throw', match: { bucket: ['AP_THROW'], keep_one: true } }],
      strength: [{ id: 'nuance', match: { role: ['nuance'] } }, { id: 'accessory', match: { role: ['accessory'] } }],
      fat_loss_bootcamp: [{ id: 'focus', match: { role: ['focus'] } }, { id: 'rounds', match: { circuit_rounds_down: true } }, { id: 'sixth_station', match: { circuit_station_index_gte: 6 } }],
      hybrid_crossfit: [{ id: 'aerobic_addon', match: { bucket: ['COND_AEROBIC'] } }, { id: 'focus', match: { role: ['focus'] } }],
      no_equipment: [{ id: 'third_of_group', match: { third_of_group: true } }],
      never_cut: { roles: ['core_block', 'work', 'paired_upper', 'survival'], buckets: ['ISO_CALF', 'AP_TRIPLE_EXT'], group_min_exercises: 2, rear_delt_station_per_week_min: 1, athletic_min_plyo_or_ballistic: 1 },
      superset_first: true,
      when_nothing_left: 'warn_long_day',
      refs: ['ORD-05', 'VOL-17', 'ORD-07', 'R2-SES-05'], status: 'PROPOSED'
    },
    bilateral_share: {
      regions: { lower: ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'], upper: ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'] },
      tolerance: 0.03,
      siblings: { RP_BKD: 'RP_UKD', RP_UKD: 'RP_BKD', RP_BHD: 'RP_UHD', RP_UHD: 'RP_BHD' },
      profiles: {
        bb_pl: { lower: { by_exercise_block: [0.5, 0.8, 0.9] }, upper: { by_exercise_block: [0.5, 0.8, 0.9] }, refs: ['UNI-02', 'UNI-03', 'CAT-13'] },
        beginner_general: { lower: { by_exercise_block: [0.5], later_cycles: 0.6 }, upper: { by_exercise_block: [0.7] }, refs: ['PROPOSED'] },
        weekend_bootcamp: { lower: { by_exercise_block: [0.5, 0.45, 0.4] }, upper: { by_exercise_block: [0.6] }, refs: ['UNI-06', 'PROPOSED'] },
        rec_cod: { lower: { by_exercise_block: [0.3, 0.25, 0.2] }, upper: { by_exercise_block: [0.3] }, refs: ['UNI-02', 'PROPOSED'] },
        field_cod: { lower: { by_exercise_block: [0.2, 0.15], PRE: 0.15, IN: 0.1 }, upper: { by_exercise_block: [0.2] }, refs: ['UNI-02', 'UNI-10'] },
        sprinters: { lower: { by_exercise_block: [0.4, 0.3], PRE: 0.3, IN: 0.2 }, upper: { by_exercise_block: [0.4] }, refs: ['PROPOSED'] },
        strength_athletes: { lower: { by_exercise_block: [0.6, 0.5], PRE: 0.4, IN: 0.25 }, upper: { by_exercise_block: [0.6] }, refs: ['ATH-03', 'PROPOSED'] },
        baseball_softball: { lower: { by_exercise_block: [0.5, 0.4], PRE: 0.35, IN: 0.2 }, upper: { by_exercise_block: [0.3] }, refs: ['ATH-08', 'UNI-10'] },
        combat: { lower: { by_exercise_block: [0.4, 0.3], PRE: 0.3, IN: 0.2 }, upper: { by_exercise_block: [0.3] }, refs: ['PROPOSED'] },
        older_injured: { lower: { by_exercise_block: [0.6] }, upper: { by_exercise_block: [0.7] }, refs: ['EQ-03'] }
      },
      select: [
        { when: { older: true }, use: 'older_injured' },
        { when: { sport_share: true }, use: 'sport' },
        { when: { family: ['athletic'], competitive: ['competitive'] }, use: 'field_cod' },
        { when: { family: ['athletic', 'hybrid_crossfit'] }, use: 'weekend_bootcamp' },
        { when: { format: ['bootcamp'] }, use: 'weekend_bootcamp' },
        { when: { goal: ['muscle', 'strength'], level: ['L2', 'L3'] }, use: 'bb_pl' },
        { when: {}, use: 'beginner_general' }
      ],
      sport_share_note: "'sport' = SportDef.share (from 04 v1.1 profiles[].bilateral_unilateral; block_start -> block_end over the exercise blocks; PRE / IN from pre_season / in_season)",
      pain_shift: 0.2, slider_range: [0.1, 0.9],
      refs: ['UNI-02', 'UNI-03', 'UNI-07', 'UNI-10', 'CAT-09', 'R2-SES-01']
    },
    contra_ipsi: { cod_contralateral_share: 0.7, sprinter_ipsilateral_share: 0.6, split_stance: 'contralateral', bb_pl_health_accessory_weeks: [1, 4], general_older: 'alternate_by_exercise_block', refs: ['CAT-13', 'UNI-12'], status: 'shares PROPOSED' },
    frontal_transverse: { default_share_from_profile: true, court_combat_share: [0.45, 0.5], aesthetics_share: 0.1, refs: ['UNI-12', 'LIB-20'] },
    pairing: {
      hip_with: ['RP_HPUSH', 'RP_VPUSH'], knee_with: ['RP_HPULL', 'RP_VPULL'], hip_buckets: ['RP_BHD', 'RP_UHD'], knee_buckets: ['RP_BKD', 'RP_UKD'],
      not_for_variants: ['upper_lower', 'ppl_x2'],
      same_pattern: { goals: ['muscle', 'strength'], ath03_groups: ['size_strength', 'resistance'], r3: 'R3-SES-01' },
      cross_pattern: { goals: ['fat_loss', 'general', 'athletic', 'active', 'hybrid'], formats: ['bootcamp'], season_phases: ['IN'] },
      refs: ['UNI-11', 'ORD-06', 'UNI-06']
    },
    axial: {
      budget: { squat: 1, hinge: 1 },
      never_same_day: true,
      counted: 'catalog.axial (02 v1.1 spine_day_v1_1.counts_as_heavy_spine_lift)',
      second_day_classes: ['second_day', 'not_counted'],
      second_day_if_sore_ok: ['goblet', 'hack', 'pendulum'],
      not_counted_tags: ['olympic', 'loaded_jump', 'kb_swing', 'thruster'],
      powerlifter_light_extra: { enabled: true, profiles: ['powerlifting_strength'] },
      home_second_squat: 'unilateral',
      spacing: { squat_day_types: ['A1', 'A', 'S1', 'Legs 1', 'SQUAT', 'BC1'], hinge_day_types: ['B2', 'B', 'S3', 'Legs 2', 'DEADLIFT'] },
      refs: ['PER-04', 'EQ-11', 'R2-SES-01', 'R2-SES-02']
    },
    reps: {
      brackets: { b1_3: { min: 1, max: 3, label_key: 'reps.1_3' }, b3_5: { min: 3, max: 5, label_key: 'reps.3_5' }, b4_6: { min: 4, max: 6, label_key: 'reps.4_6' }, b6_8: { min: 6, max: 8, label_key: 'reps.6_8' }, b8_12: { min: 8, max: 12, label_key: 'reps.8_12' }, b10_12: { min: 10, max: 12, label_key: 'reps.10_12' }, b10_15: { min: 10, max: 15, label_key: 'reps.10_15' }, b12_15: { min: 12, max: 15, label_key: 'reps.12_15' }, b15: { min: 15, max: 15, label_key: 'reps.15' }, b15_20: { min: 15, max: 20, label_key: 'reps.15_20' }, b20: { min: 20, max: 20, label_key: 'reps.20' }, b20_30: { min: 20, max: 30, label_key: 'reps.20_30' }, b25_30: { min: 25, max: 30, label_key: 'reps.25_30' } },
      ladder: ['b1_3', 'b3_5', 'b4_6', 'b6_8', 'b8_12', 'b10_15', 'b15', 'b15_20', 'b20_30'],
      matrix: {
        main_bilateral_compound: { hypertrophy: { bracket: 'b8_12', L1: 'b10_15', pyramid_from: 'L2' }, strength: { template: 'strength_pct' }, athletic: { vol_phase: true }, fat_loss: { by_exercise_block: ['b10_15', 'b8_12'] }, general: { bracket: 'b10_15' } },
        machine_stable_compound: { hypertrophy: { bracket: 'b10_15', myo_if_last: true }, strength: { bracket: 'b6_8', rir: [2, 2] }, athletic: { bracket: 'b8_12' }, fat_loss: { bracket: 'b15' }, general: { bracket: 'b15' } },
        unilateral_compound: { hypertrophy: { bracket: 'b8_12', per_side: true, heavy_toggle: 'b4_6' }, strength: { bracket: 'b8_12', per_side: true }, athletic: { bracket: 'b6_8', per_side: true }, fat_loss: { bracket: 'b8_12', per_side: true }, general: { bracket: 'b10_15', per_side: true } },
        big_muscle_isolation: { hypertrophy: { bracket: 'b15_20', myo_if_last: true }, strength: { bracket: 'b8_12' }, athletic: { bracket: 'b8_12', myo_if_last: true }, fat_loss: { by_exercise_block: ['b15', 'b15_20'] }, general: { bracket: 'b15' } },
        small_muscle_isolation: { hypertrophy: { bracket: 'b15_20', last_set: 'max' }, strength: { bracket: 'b8_12' }, athletic: { bracket: 'b10_15' }, fat_loss: { bracket: 'b15_20' }, general: { bracket: 'b15_20' } },
        rear_delts: { hypertrophy: { bracket: 'b20_30', last_set: 'max' }, strength: { bracket: 'b15_20' }, athletic: { bracket: 'b15_20' }, fat_loss: { bracket: 'b15_20' }, general: { bracket: 'b15_20' } },
        calves: { hypertrophy: { bracket: 'b15_20', last_set: 'max' }, strength: { bracket: 'b10_15' }, athletic: { bracket: 'b8_12', per_side: true }, fat_loss: { bracket: 'b15_20' }, general: { bracket: 'b15_20' } },
        core: { hypertrophy: { bracket: 'b10_15', or_seconds: [20, 60] }, strength: { bracket: 'b8_12' }, athletic: { seconds: [20, 50] }, fat_loss: { seconds: [30, 50] }, general: { bracket: 'b10_15', or_seconds: [20, 60] } },
        olympic: { L1: { bracket: 'b6_8' }, L2: { bracket: 'b3_5' }, L3: { bracket: 'b3_5' }, full_catch: 'b3_5', ramp: 'olympic.ramp' },
        plyo: { RC1: { contacts_per_set: [6, 8], hold_s: 3 }, RC2: { contacts_per_set: [5, 8] }, RC3: { contacts_per_set: [10, 20] }, ankle: { contacts_per_set: [20, 40] } },
        throw: { reps_per_side: 10, situp_reps: 20, wall_ball_reps: [10, 20] },
        cod: { reps: [3, 6] },
        sprint: { reps: [3, 6], metres: [10, 30] },
        skill: { minutes: [6, 10] },
        prehab: { bracket: 'b12_15' }
      },
      goal_column: { muscle: 'hypertrophy', strength: 'strength', athletic: 'athletic', active: 'general', fat_loss: 'fat_loss', general: 'general', hybrid: 'general' },
      athlete_vol_phases: { by_exercise_block: ['VOL1', 'VOL2', 'VOL3'], pre_season: 'VOL3', in_season: 'VOL3', VOL1: { compound: 'b12_15', isolation: 'b10_12' }, VOL2: { compound: 'b8_12', isolation: 'b15' }, VOL3: { compound: 'b6_8', isolation: 'max' }, refs: ['PER-11'] },
      preference: { volume_lighter: { big_compound_shift: 1 }, balanced: { big_compound_shift: 0 }, heavy_powerlifting: { first_lift_of_day_shift: -1 }, weekly_sets_unchanged: true, refs: ['VOL-12'] },
      pyramid: { notation: '12/10/8 -20', sets: [{ reps: 12, load: 'mid' }, { reps: 10, load: 'heavier' }, { reps: 8, load: 'heaviest' }, { reps: 20, load: 'light' }], min_level: 'L2', on: 'first_main_bilateral_compound', when_sets_gte: 4, refs: ['PRG-07'] },
      notation: { per_side: '{n}/{n}', refs: ['PRG-07', 'UNI-01'] },
      refs: ['VOL-11', 'VOL-12', 'UNI-04', 'PER-11', 'PRG-06']
    },
    effort: {
      rir_band: [1, 3],
      planned_from_stairway: true,
      planned_map: { '3': { min: 3, max: 3 }, '2': { min: 2, max: 2 }, '1-2': { min: 1, max: 2 }, '1+': { min: 1, max: 1, intensifiers: true } },
      compound_floor_rir: 1,
      by_block_type: { maintenance: { min: 2, max: 3 }, pre_season: { min: 2, max: 2 }, taper: { min: 2, max: 3 }, in_season: { min: 2, max: 3 }, recovery: { min: 3, max: 4 } },
      rpe_for_rir: { 0: 10, 1: 9, 2: 8, 3: 7, 4: 6 },
      max: { allowed_rep_classes: ['small_muscle_isolation', 'rear_delts', 'calves'], allowed_bodyweight: true, last_set_only: true },
      myo: { last_item_of_day_only: true, requires: ['isolation_or_constraint_gte_4'], when: ['last_week_of_stairway', 'muscle_at_cap_in_HARDEST'], counts_as: 2, never_in_block_types: ['recovery', 'maintenance', 'taper', 'pre_season', 'in_season'] },
      never_failure_rep_classes: ['main_bilateral_compound', 'unilateral_compound', 'machine_stable_compound', 'olympic'],
      strength_roles: { work: [1, 1], accessory: [2, 2], nuance: 'max', survival: 'done' },
      speed_work: { key: 'effort.fast_rpe6' },
      athletic: { key: 'effort.max_intent' },
      olympic: { key: 'effort.olympic_power', pct: 'never_by_default', pct_requires: ['tested_best_same_lift', 'coach_opt_in'] },
      week1_tip_key: 'load.week1_tip',
      refs: ['VOL-13', 'VOL-15', 'GEN-08', 'ORD-07', 'R2-VOL-02', 'R2-PER-05', 'R2-GEN-06', 'R2-ATH-05'], status: 'planned 3 -> 1 RIR drift PROPOSED (flagged vs VOL-13)', r3: 'R3-VOL-04'
    },
    rest: { hypertrophy_s: [60, 120], hypertrophy_max_s: 180, isolation_s: [60, 90], strength_s: [180, 360], core_s: [30, 60], olympic_s: [120, 180], plyo_work_rest: [5, 10], depth_jump_s: [120, 180], throw_s: [45, 90], prehab_s: [30, 60], superset: 'after_pair', athletic: 'as_prescribed', refs: ['VOL-14'] },
    athletic: {
      ground_contact_classes: { 1: { end: 0.75 }, 2: { end: 0.6 }, 3: { end: 0.5 }, 4: { end: 0.4 }, 5: { end: 0.25 } },
      block_start_offset: -0.15,
      share_floor: 0, share_ceiling: 0.8,
      share_counted_over: ['plyometric', 'ballistic', 'throw'],
      throws_count_as: 'ballistic',
      classification: { ballistic: ['squat jumps', 'box jumps', 'broad jumps', 'loaded / hex-bar jumps', 'medball throws', 'KB swings'], plyometric: ['pogo / ankle hops', 'hurdle hops', 'depth jumps', 'bounds', 'squirrel jumps', 'repeated jumps'], receive: ['stick-the-landing drills'] },
      stages: { ids: ['RC1', 'RC2', 'RC3'], weeks_by_N: rcByN, start_stage: 'RC1', may_start_RC2_levels: ['L2', 'L3'], start_RC2_default: false, maintenance: 'hold', pre_season: 'hold', restart_each_off_season: true, within_stage: ['bilateral_before_unilateral', 'unloaded_before_loaded'], stage_qualities: { RC1: ['landing', 'ballistic'], RC2: ['landing', 'ballistic', 'plyometric'], RC3: ['ballistic', 'plyometric'] }, refs: ['R2-ATH-03', 'CAT-10', 'CAT-11'] },
      contacts_per_session_max: L(80, 100, 120),
      plyo_sessions_per_week: [2, 3], same_area_gap_h: [48, 72], masters_gap_days: [3, 4],
      loaded_jump_bw_pct: [10, 20],
      heights: { depth_drop: { low: '6-12 in', medium: '12-18 in', high: 'above hip' }, hurdles: { moderate: '6 in', advanced: '12 in+' } },
      contrast: { min_level: 'L2', season: ['OFF_EARLY', 'OFF_BUILD', 'OFF_LATE'], heavy_pct: [78, 85], rest_inside: 0, enabled_phase0: false },
      speed_session_order: ['squirrel_jumps', 'mach_acceleration', 'max_velocity'],
      tiers: { plyometric_contacts_wk: { T1: [1, 25], T2: [26, 50], T3: [51, 80], T4: [81, 110], T5: [111, 150] }, throws_wk: { T1: [1, 60], T2: [61, 120], T3: [121, 240], T4: [241, 420], T5: [421, 600] }, cuts_wk: { T1: [1, 30], T2: [31, 70], T3: [71, 120], T4: [121, 180], T5: [181, 260] } },
      in_season_game_heavy: { sports: ['basketball', 'volleyball', 'soccer', 'american_football', 'flag_football', 'ice_hockey', 'lacrosse', 'field_hockey', 'rugby', 'ultimate', 'beach_volleyball'], plyo_factor: 0.5, extra_cod: false, sprints: 'speed_athletes_only', hard_day_gap_h: 48, olympic: { sets: 2, reps: 3, dropped_heavy_game_weeks: true }, refs: ['R2-ATH-07'], r3: 'R3-ATH-04 (sports he did not name)' },
      heavy_play_weeks: { min_play_sessions: 3, plyo_factor: 0.5, extra_cod: false, olympic: 'light_2x3', hard_day_gap_h: 48, refs: ['R2-ATH-07'], r3: 'R3-ATH-05', status: 'PROPOSED' },
      never_counts_to_muscles: true,
      refs: ['ATH-01', 'ATH-02', 'CAT-10', 'CAT-11', 'VOL-10', 'EQ-15', 'EQ-16', 'R2-ATH-01', 'R2-ATH-02']
    },
    olympic: {
      everyone_athletic: true,
      families: ['clean', 'snatch', 'jerk', 'loaded_jump', 'swing'],
      day_pattern: { clean: 'knee', loaded_jump: 'knee', snatch: 'hip', swing: 'hip', jerk: 'either' },
      per_week_max: 4,
      tiers: { L1: { applies: ['L1', 'L2_block_1'], examples: ['single-arm-db-snatch', 'kb-squat-clean', 'db-kb-high-pull', 'hex-bar-jump-squat', 'high-hang-clean-pull', 'high-hang-snatch-pull', 'hang-power-clean-from-the-high-hang-hip-crease', 'db-push-press', 'barbell-push-press', 'kettlebell-swing-russian'] }, L2_plus: { applies: ['L2_block_2_plus', 'L3'], examples: ['power-clean', 'power-snatch', 'power-clean-and-jerk', 'barbell-push-jerk', 'clean-squat-clean', 'snatch-squat-snatch'] } },
      ramp: [{ pct: 75, sets: 4, reps: 8 }, { pct: 80, sets: 4, reps: 6 }, { pct: 85, sets: 4, reps: 6 }, { pct: 90, sets: 4, reps: 4 }],
      ramp_applies_to: ['db_kb', 'pulls', 'hang_variants'],
      full_catch_reps: [3, 5], full_catch_same_weekly_reps: true,
      power_language: true,
      pct: { shown: false, requires: ['tested_best_same_lift', 'coach_opt_in'], competitive_weightlifting: 'own_program_v2' },
      no_bumpers: 'hang_variants',
      older: { default: false, opt_in: true, opt_in_excludes_tags: ['snatch'] },
      youth_floor_min_age: 14, youth_floor_after_hang_block: true,
      in_season: { sets: 2, reps: 3, per_week: 1, dropped_heavy_game_weeks: true },
      endurance_profiles_small_dose: { sets: [2, 3], exposures: [1, 2] },
      refs: ['ATH-10', 'ATH-09', 'LIB-07', 'LIB-13', 'PER-09', 'R2-ATH-04', 'R2-ATH-05', 'R2-ATH-08', 'R2-GEN-06']
    },
    medball: {
      max_lb: 20,
      loads_lb: { pass_rotation: [8, 10], overhead: [6, 10], situp: [6, 8], slam: [10, 20], warmup: [6, 10], wall_ball: [10, 20] },
      youth_older_minus_lb: 2, min_lb: 4,
      dose: { reps_per_side: 10, all_list_throws: 19 },
      aesthetics_main: false, aesthetics_warmup_only: true,
      no_ball_substitutes: ['plyometric-push-ups', 'cable-oblique-rotation-cable-rotational-twist', 'fake-medball-slam-and-return-any-way-possible-upper-body-trunk-amortization-dril'],
      refs: ['ATH-05', 'EQ-06', 'EQ-07', 'LIB-06', 'LIB-22']
    },
    conditioning: {
      sessions: { fat_loss: 3, general: 3, active: 3, aesthetics: 4, athlete_in: 2, athlete_pre: 2, powerlifter: 2, hybrid: 2, sport_is_aerobic: 0 },
      from_profile: true,
      cardio_adjust: { min: -3, max: 3, floor_total: 0, extra_colour: 'C' },
      activity_counts_as_aerobic: { enabled: true, max_replaced: 2, min_minutes: 45, keep_gym_led_min: 1, r3: 'R3-ATH-05', status: 'PROPOSED' },
      walks: { goals: ['muscle'], minutes: [20, 30] },
      colours: ['A', 'B', 'C', 'LC'], fill_order: ['C', 'B', 'A'], extra_colour: 'C',
      unlock: { hybrid_crossfit: { L1: ['C', 'B'], L2: ['C', 'B', 'A'], L3: ['C', 'B', 'A', 'LC'] } },
      minutes: { A: [15, 20], B: [20, 30], C: [30, 40], LC: [20, 30] },
      steady_max_min: 40,
      placement: ['aerobic_day', 'optional_day', 'separate_free_day', 'addon_after'], fighter_addon: 'open_day', keep_off_days_min: 1,
      recovery_week: 'C_only',
      wod: { minutes: [10, 20], wod_only_day_minutes: [20, 30], formats: ['amrap', 'emom', 'for_time'], stations: [3, 4], ballistic_only_in_wod: ['kb_swing', 'wall_ball'], rep_40_amrap_only_here: true, refs: ['VOL-11', 'PRG-10'], status: 'PROPOSED' },
      circuit_finisher: { rounds: [3, 5], work_s: [30, 50], refs: ['PRG-11'] },
      refs: ['ATH-07', 'ORD-09', 'ORD-10', 'EQ-14', 'PRG-11', 'R2-SES-06', 'R2-ATH-06']
    },
    equipment: {
      profiles: Object.fromEntries(['FULL_GYM', 'BASIC_GYM', 'HOME_BARBELL', 'HOME_DB_BENCH', 'KB_ONLY', 'BODYWEIGHT', 'HOTEL_GYM', 'FIELD_TRACK_KIT', 'FULL_FACILITY', 'FIELD_TRACK_NO_KIT'].map(id => [id, { kit: prof(id) }])),
      intake_profiles: ['FULL_GYM', 'BASIC_GYM', 'HOME_BARBELL', 'HOME_DB_BENCH', 'KB_ONLY', 'BODYWEIGHT', 'HOTEL_GYM', 'FIELD_TRACK_KIT'],
      machines: { leg_press: 'machine_plate_loaded', hack_squat: 'machine_plate_loaded', pendulum: 'machine_specialty', belt_squat: 'belt_squat', leg_extension: 'machine_selectorized', leg_curl_seated: 'machine_selectorized', leg_curl_lying: 'machine_selectorized', lat_pulldown: 'cable', assisted_pullup: 'machine_selectorized', row_machine: 'machine_selectorized', chest_press: 'machine_selectorized', shoulder_press_machine: 'machine_selectorized', cable_stack: 'cable', smith: 'smith', ghd_or_45deg: 'hyper_bench', reverse_hyper: 'reverse_hyper', hip_thrust_machine: 'machine_specialty' },
      cardio_tokens: { run: 'open_space_long', treadmill: 'treadmill', bike: 'cardio_machine_cal', rower: 'cardio_machine_cal', ski_erg: 'cardio_machine_cal' },
      running_space: { none: { drop: ['open_space_short', 'open_space_long'], unless_cardio_run: true }, '10_20m': { drop: ['open_space_long'], unless_cardio_run: true }, '40_60m_or_track': { add: ['open_space_short', 'open_space_long'] } },
      banned_tokens: ['band', 'bands', 'band_anchor', 'chains', 'weight_releaser'],
      client_families: {
        athlete: { main: [1, 2], iso: [2, 4], machine_pen: 2, skill_pen: 0 },
        hypertrophy: { main: [2, 5], iso: [3, 5], machine_pen: 0, skill_pen: 0 },
        strength: { main: [2, 3], iso: [3, 5], machine_pen: 0.5, skill_pen: 0 },
        beginner: { main: [2, 4], iso: [3, 5], machine_pen: 0.5, skill_pen: 2 },
        older_or_pain: { main: [4, 5], iso: [4, 5], machine_pen: 0, skill_pen: 3 },
        general: { main: [2, 3], iso: [2, 4], machine_pen: 0.5, skill_pen: 1 }
      },
      family_select: [
        { when: { older: true }, use: 'older_or_pain' },
        { when: { pain_moderate: true }, use: 'older_or_pain' },
        { when: { family: ['athletic'], competitive: ['competitive'] }, use: 'athlete' },
        { when: { goal: ['strength'] }, use: 'strength' },
        { when: { goal: ['fat_loss', 'general', 'active'] }, use: 'general' },
        { when: { level: ['L1'] }, use: 'beginner' },
        { when: { goal: ['muscle', 'hybrid'] }, use: 'hypertrophy' },
        { when: {}, use: 'hypertrophy' }
      ],
      substitution_order: ['pool_filtered', 'coach_alternates', 'same_pattern_other_implement', 'machine_isolation_swap', 'nearest_pattern_buy_list'],
      implement_ladder: ['machine', 'cable', 'dumbbell', 'kettlebell', 'bodyweight'],
      machine_isolation_swaps: { ISO_QUAD: ['sissy-squat', 'db-leg-extension-seated-on-box'], ISO_LEG_FLEXION: ['nordic-hamstring-curl', 'supine-slider-hamstring-curl', 'ball-hamstring-curl-medball-or-stability-ball'] },
      fallback_extra_sets_to_paired_compound: 2,
      never_exercise_tags: ['v_squat'],
      buy_list: { RP_VPULL: ['pullup_bar', 'trx'], AP_THROW: ['medball'], ISO_QUAD: ['machine_selectorized'], ISO_BICEP: ['dumbbell', 'kettlebell'] },
      crossfit_box_note: 'a CrossFit box = HOME_BARBELL + extras (bumpers, KBs, medballs, boxes, rings, rower / bike / ski erg); no separate profile in Phase 0 (D-16)',
      refs: ['EQ-01', 'EQ-03', 'EQ-04', 'EQ-08', 'EQ-09', 'EQ-10', 'EQ-11', 'EQ-12', 'EQ-13', 'R2-LIB-08']
    },
    population: {
      older: {
        from_age: 60,
        default_excluded_qualities: ['plyometric', 'olympic', 'ballistic_jump'],
        default_allowed_athletic: ['landing', 'throw_light', 'cod_easy', 'machine_fast_intent'],
        opt_in_field: 'prefs.older_athletic_opt_in',
        opt_in_unlocks: ['olympic (no snatch)', 'ballistic jumps', 'low ankle hops', 'RC2-RC3 plyos (no depth jumps)'],
        never_tags: ['overhead_squat', 'low_bar'],
        never_tags_phase0_even_with_opt_in: ['depth_jump', 'high_depth_drop', 'snatch'],
        warning_key: 'warning.older_athletic',
        constraint_band: [4, 5], step_cap: 0.03, maintenance_floor: 0.7, tests: 'submax_only',
        refs: ['EQ-03', 'EQ-04', 'R2-ATH-08', 'R2-ATH-02'], r3: 'R3-ATH-02'
      },
      active_aging_50: {
        from_age: 50, to_age: 59,
        racket_profiles: ['rec_pickleball', 'pickleball_competitive', 'rec_padel', 'rec_tennis', 'tennis'],
        avoid_tags_unless_opt_in: ['depth_jump', 'high_depth_drop', 'hurdle_hop', 'bound'],
        prehab_each_leg_day: ['PREHAB_LOWER'], prehab_weekly: ['RECOVERY_ARM_CARE'],
        refs: ['COACH-CHAT 2026-10-08'], r3: 'R3-ATH-02', status: 'PROPOSED'
      },
      youth: { below_age: 18, max_ladder: 'intermediate', olympic_floor_min_age: 14, medball_minus_lb: 2, refs: ['R2-ATH-08', 'EQ-06'] }
    },
    prehab: {
      by_injury_code: {
        SHOULDER_SWIMMER: { bucket: 'RECOVERY_ARM_CARE', per_week: 2, days: 'pull_or_upper', sets: 2 },
        SHOULDER_THROWER: { bucket: 'RECOVERY_ARM_CARE', per_week: 2, days: 'pull_or_upper', sets: 2 },
        ACHILLES_CALF: { bucket: 'PREHAB_LOWER', per_week: 2, days: 'lower', sets: 2 },
        KNEE_DEGENERATIVE_COURT: { bucket: 'PREHAB_LOWER', per_week: 1, days: 'lower', sets: 2 },
        NECK: { bucket: 'PREHAB_NECK', per_week: 2, days: 'any', sets: 2 }
      },
      block: 'prehab', counts_in_cap: false, credits: 'none',
      refs: ['EQ-01', 'R2-LIB-04', 'R2-LIB-07'], status: 'mapping INFERRED from 04 injury_prehab'
    },
    selection: {
      weights: { default_in_slot: 3, preference_match: 1.5, constraint_in_band: 2, constraint_distance: -1, over_ladder_step: -1.5, pain_prefer_tag: 1, continuity: 2, machine_pen_scale: -1, skill_pen_scale: -0.5, sport_use_match: 1, older_preferred: 1 },
      swaps: { min: 2, max: 4, same_slot: true },
      block_change: { max_share_of_slots: 0.34, keep_roles: ['work', 'core_block'], prefer_same: ['pattern', 'laterality'], allow_detail_variation: true, never_invent: true, refs: ['PER-02', 'R2-LIB-01'] },
      variety_ab: { lead_lift_alternates: true, refs: ['PER-03'] },
      second_exposure_different: true,
      proposed_records_swap_only: true,
      kb_swing_never_resistance_slot: true,
      refs: ['GEN-04', 'EQ-10', 'CAT-07', 'PER-02', 'PER-04', 'R2-LIB-01', 'R2-VOL-05']
    },
    ordering: {
      block_order: ['warmup', 'core', 'skill', 'athletic', 'power', 'strength', 'accessories', 'prehab', 'circuit', 'conditioning', 'aerobic', 'cooldown'],
      core_positions: { start: 'after_warmup', after_plyos: 'after_athletic', after_strength: 'after_strength', end: 'end' },
      athletic_bucket_order: ['AP_SPRINT', 'AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW', 'AP_COD'],
      role_to_block: { warmup: 'warmup', core_block: 'core', skill: 'skill', athletic: 'athletic', power: 'power', work: 'strength', paired_upper: 'strength', secondary: 'strength', secondary_upper: 'strength', accessory: 'strength', nuance: 'accessories', survival: 'accessories', iso: 'accessories', focus: 'accessories', conditioning: 'conditioning', aerobic_block: 'aerobic', circuit_station: 'circuit', prehab: 'prehab', cooldown: 'cooldown' },
      hard: ['H_PULL_BEFORE_V_PULL', 'H_PUSH_BEFORE_V_PUSH', 'POWER_BEFORE_STRENGTH', 'WORK_FIRST', 'BILATERAL_BEFORE_UNILATERAL', 'MYO_LAST', 'ATHLETIC_BEFORE_OLYMPIC', 'SPEED_SESSION_ORDER'],
      h_before_v_exempt_when_vertical_is: 'work',
      allowed_overrides: ['contrast_station', 'priority_small_muscle_first', 'core_moved_by_user', 'bootcamp_cardio_station', 'fighter_opening_aerobic', 'work_first_vertical'],
      refs: ['ORD-01', 'ORD-02', 'ORD-03', 'ORD-04', 'ORD-09', 'ATH-11', 'LIB-21', 'VOL-15', 'R2-SES-03']
    },
    supersets: {
      triggers: { short_session: true, l3_preference: true, athlete_off_season: true, l1_preference: true },
      pairs: [['knee', 'pull'], ['hip', 'push'], ['ISO_BICEP', 'rear'], ['ISO_TRICEP', 'side'], ['ISO_CALF', 'delts']],
      never: ['two_lower_compounds', 'heavy_and_fatiguing_same_muscle'],
      default: 'straight_sets',
      core_supersets_optional: { anywhere: true, by: ['coach_rule_pack', 'user'], refs: ['R2-SES-03'] },
      bootcamp: { circuits: 2, stations: [4, 6], rounds: [3, 5], work_s: [30, 50], transition_s: 15, between_rounds_s: 90, session_min: [35, 45], round_counts_as_set: true, stairway: { work_s_start: 35, work_s_max: 50, work_s_step: 5, rounds_start: 3, rounds_max_by_minutes: { 30: 3, 45: 3, 60: 4, 75: 5, 90: 5 } }, refs: ['PRG-03', 'R2-SES-05', 'R2-PER-03'], status: 'stairway in rounds and seconds PROPOSED' },
      refs: ['ORD-05', 'PRG-03']
    },
    plan_types: {
      fixed_12: { weeks: 12, training_blocks: [{ type: 'stairway', weeks: [1, 12] }], test_weeks: [1, 12], recovery_after_if_next: true, refs: ['PER-01', 'R2-PER-04'] },
      fixed_8: { weeks: 8, training_blocks: [{ type: 'stairway', weeks: [1, 8] }], test_weeks: [1, 8], recovery_after_if_next: true, refs: ['R2-PER-03'] },
      short_block: { weeks_range: [4, 6], refs: ['R2-PER-03'], status: 'coach / year only' },
      maintenance_4_6: { weeks_default: 4, weeks_range: [1, 8], extendable: true, factor: { vacation_limited_kit: 0.5, travel_moving_season_change: 0.6, planned_maintenance: 0.7 }, older_floor: 0.7, base: 'level_start', step: 0, effort: { min: 2, max: 3 }, intensifiers: false, floor_10: false, end_prompt: ['keep_maintaining', 'change_plan', 'new_block'], refs: ['PER-01', 'R2-PER-06', 'R2-VOL-07'] },
      week_by_week: { stairway_weeks: 12, recovery_week_after: true, generate_weeks: 12, requires_output_mode: ['checkin', 'logbook'], refs: ['PER-01', 'R2-GEN-01'], status: 'rolling 12 PROPOSED' },
      year: {
        weeks: 52,
        layout: [
          { type: 'stairway', weeks: [1, 12], quarter: 'Q1', theme: 'cut', flat_sets: true, aerobic_delta: 1 },
          { type: 'recovery', weeks: [13, 13] },
          { type: 'stairway', weeks: [14, 25], quarter: 'Q2', theme: 'summer', cycle_step: 1, aerobic_delta: 0 },
          { type: 'recovery', weeks: [26, 26] },
          { type: 'maintenance', weeks: [27, 39], quarter: 'Q3', factor: 0.7, of: 'last_stairway_final_4_avg' },
          { type: 'stairway', weeks: [40, 50], quarter: 'Q4', theme: 'build', cycle_step: 2, aerobic_delta: -1, aerobic_min: 2 },
          { type: 'maintenance', weeks: [51, 52], quarter: 'HOLIDAYS', factor: 0.6, of: 'last_stairway_final_4_avg' }
        ],
        test_weeks: [1, 12, 25, 50], non_competitive_only: true, calendar_alignment: 'phase1', refs: ['R2-PER-01', 'R2-PER-02'], r3: 'R3-PER-01', status: 'layout PROPOSED'
      },
      prep: { step_every_weeks: 2, taper_weeks: [1, 2], taper_volume_cut: [0.4, 0.6], gen_pop_event: { hardest_ends_weeks_before: 1, taper_weeks: 1, taper_factor: 0.5, r3: 'R3-ATH-05' }, refs: ['PER-10'] },
      season: {
        weeks_to_season: { OFF_EARLY: 20, OFF_BUILD: 12, OFF_LATE: 6, PRE: 0 },
        pre_weeks_default: 4, pre_weeks_range: [4, 6], min_offseason_stairway_weeks: 4,
        taper_weeks_by_pre_len: { 1: 0, 2: 1, 3: 1, 4: 1, 5: 1, 6: 2, 7: 2 },
        no_taper_before_first_meet_season_types: ['C'],
        in_season: { template: 'athletic.2', variant: 'in_season', days: 2 },
        phase_labels: { PRE: 'pre_season', TAPER: 'taper', IN: 'in_season' },
        refs: ['PER-08', 'R2-PER-06', 'R2-GEN-05', 'R2-ATH-07'], status: 'thresholds and placement INFERRED (D-10)'
      },
      skeleton_ids: { muscle: { fixed_12: 'C12_HYPERTROPHY', fixed_8: 'C8_HYPERTROPHY' }, strength: { fixed_12: 'C12_STRENGTH', fixed_8: 'C8_STRENGTH' }, fat_loss: { fixed_12: 'C12_FAT_LOSS', fixed_8: 'C8_FAT_LOSS' }, general: { fixed_12: 'C12_GENERAL', fixed_8: 'C8_GENERAL' }, active: { fixed_12: 'C12_GENERAL', fixed_8: 'C8_GENERAL' }, hybrid: { fixed_12: 'C12_HYBRID', fixed_8: 'C8_HYBRID' }, athletic: { fixed_12: 'ATHLETE_OFF_C12', fixed_8: 'ATHLETE_OFF_C8' }, any: { maintenance_4_6: 'MAINT_4', week_by_week: 'WBW_12', year: 'YEAR_GENPOP' } },
      refs: ['PER-01', 'PER-08', 'PER-10', 'R2-PER-01', 'R2-PER-02', 'R2-PER-03', 'R2-PER-04', 'R2-PER-06']
    },
    recovery: { sets_factor: 0.5, of: 'hardest_week', round: 'up', min_sets_per_exercise: 1, rir_min: 3, remove: ['buyout', 'finisher', 'myo', 'superset'], olympic: { sets_factor: 0.5, load: 'light_technique' }, athletic_factor: 0.5, athletic_mode: 'landings_low_amplitude', conditioning: 'C_only', only_between_blocks: true, extra_week: true, skip_when_maintenance_adjacent: true, refs: ['PER-05', 'R2-VOL-07'], r3: 'R3-PER-01' },
    cycles: { start_multiplier: 1.05, rounding: 'half_up', cap_add: 1, cap_max_nonpriority: 25, cap_max_priority: 30, same_start_if: ['last_had_holds_or_pain'], refs: ['R2-VOL-06'] },
    tests: {
      catalogue: { strength: { from_zero: { L1: 'rm_5_8', L2: 'rm_3_or_5', L3: 'rm_3_or_5' }, after_completed_block: { L1: 'rm_5_8', L2: 'rm_3_or_work_up_to_1', L3: 'rm_3_or_work_up_to_1' }, pro: 'no_true_1rm', older: 'submax' }, cardio: { from_zero: 'effort_80_90', after_completed_block: ['1_mile', 'erg_time_trial'] }, speed_agility: { from_zero: 'effort_80_90', items: ['sprint_10_30m', '5-10-5-pro-agility-shuttle', 'l-test-l-drill-3-cone-inferred-from-left-test'] }, jumps: { items: ['cmj', 'broad-jump'], older_default: false }, body: { items: ['body_weight', 'photos_girths'] } },
      when: { baseline: 'week_1_of_each_stairway', end: 'last_week_of_each_stairway', never_mid_block: true, not_in_block_types: ['pre_season', 'in_season', 'taper', 'recovery', 'maintenance'] },
      from_zero_if: ['previous_cycles_count_0_and_not_just_finished_block', 'level_L1', 'layoff'],
      end_test_counts_as_completed_block: true,
      other_sets_factor: 1.0,
      test_replaces: 'top_sets_of_tested_lifts_only',
      test_week_note: 'the rest of the test week stays as planned so the last week stays the hardest (D-17; 06 proposed 50-70 %)',
      reminders: ['block_start', 'days_before_7', 'days_before_1'],
      excluded: ['21.6 mile run'],
      refs: ['PER-07', 'LIB-18', 'R2-PER-07', 'R2-LIB-06']
    },
    warmup: { general: { text_key: 'warmup.any_cardio_5min', minutes: 5 }, lower_or_athletic_drills: ['a-march-running-drill', 'a-skip-running-drill', 'a-runs-high-knee-running-drill'], press_day_mobility: ['kb-book-opener'], before_sprints: 'warmup.running_warmup', aesthetics_medball_warmup_allowed: true, counts_as_volume: false, refs: ['ORD-08', 'ATH-05'] },
    core_block: { position_default: 'start', positions: ['start', 'after_plyos', 'after_strength', 'end'], exercises: 2, sets_when_first: 2, submaximal_when_first: true, harder_only_when_moved_to_end: true, thorax_and_pelvis: true, plane_rotation: ['sagittal', 'frontal', 'transverse'], rotational_profiles_groups: ['rotational_power', 'combat'], never_skipped: true, counts_to_abs: true, refs: ['ATH-11', 'VOL-17', 'CAT-08', 'GEN-08', 'R2-SES-03'] },
    template_select: {
      variant_order: ['in_season_week', 'split_style', 'profile_template_hint', 'unbuilt_main_fallback', 'same_pattern', 'format_circuit'],
      split_style_variants: { ppl: 'ppl_x2', upper_lower: 'upper_lower' },
      unbuilt_fallback: 'first_built_alternative_else_family_days_minus_1',
      weekday_mapping: 'template_planned_days_onto_intake_weekdays_in_order',
      optional_days: 'free_weekdays_nearest_template_day_skipping_play_and_game_days',
      refs: ['VOL-08', 'ORD-06', 'PRG-02', 'R2-GEN-07']
    },
    validation: {
      checks: [
        ['V1', 'check.v1_safety', 'error'], ['V2', 'check.v2_days', 'warn'], ['V3', 'check.v3_short_athletes', 'warn'], ['V4', 'check.v4_youth', 'error'], ['V5', 'check.v5_older', 'error'],
        ['V6', 'check.v6_season', 'warn'], ['V7', 'check.v7_no_equipment', 'warn'], ['V8', 'check.v8_priorities', 'error'], ['V9', 'check.v9_bands', 'error'], ['V10', 'check.v10_spine', 'error'],
        ['V11', 'check.v11_pairing', 'error'], ['V12', 'check.v12_order', 'error'], ['V13', 'check.v13_caps', 'error'], ['V14', 'check.v14_counting', 'error'], ['V15', 'check.v15_step', 'error'],
        ['V16', 'check.v16_aesthetics_medball', 'error'], ['V17', 'check.v17_effort', 'error'], ['V18', 'check.v18_minimums', 'error'], ['V19', 'check.v19_olympic', 'error'], ['V20', 'check.v20_vsquat', 'error'],
        ['V21', 'check.v21_release', 'error'], ['V22', 'check.v22_floor', 'error'], ['V23', 'check.v23_exercises_per_group', 'error'], ['V24', 'check.v24_block_structure', 'error'], ['V25', 'check.v25_tests', 'error'], ['V26', 'check.v26_inputs', 'error']
      ].map(([id, key, severity]) => ({ id, key, severity })),
      hard: [
        ['H01', 'check.h01_no_bands'], ['H02', 'check.h02_no_failure_heavy'], ['H03', 'check.h03_power_before_strength'], ['H04', 'check.h04_h_before_v'], ['H05', 'check.h05_core_first'],
        ['H06', 'check.h06_pairing'], ['H07', 'check.h07_two_spine_days'], ['H08', 'check.h08_credits'], ['H09', 'check.h09_athletic_no_credit'], ['H10', 'check.h10_step_cap'],
        ['H11', 'check.h11_medball'], ['H12', 'check.h12_older_never'], ['H13', 'check.h13_no_sex'], ['H14', 'check.h14_i18n'], ['H15', 'check.h15_no_deload_inside'],
        ['H16', 'check.h16_no_lifestyle'], ['H17', 'check.h17_floor_10'], ['H18', 'check.h18_two_to_four'], ['H19', 'check.h19_tests'], ['H20', 'check.h20_release'],
        ['H21', 'check.h21_stairway'], ['H22', 'check.h22_no_checkin_no_change']
      ].map(([id, key]) => ({ id, key }))
    }
  };
}
