// tools/fixture/fix-r2-f3.mjs - model 1.3.0, engine 0.4.0 FIX ROUND 2 / F3 (selection, dosing and the printed plan). Applied after
// fix-r2-f2.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps
// deep-equalling the fixture rules (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value
// names its source: COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What fix round 2 / F3 changes in the model (engine/DECISIONS.md section E, fix round 2 / F3, E-178 ...; samples/REVIEW_LOG.md v0.4
// fix round 2 / F3):
//   * rules.selection.r2 - the selection weights of round 2 (every weight PROPOSED): the upper-body laterality dial (UNI-02 / UNI-03),
//     block changes that never step down (PER-02, CAT-05), week-wide movement families with a weekly cap and a day gap (PER-04), a
//     glute-dominant hip pick (R3-SES-01), the core plane mix of the sport (CAT-08), swaps inside the slot's own category and through
//     the client's filters (GEN-04), a stated implement for a trained lifter's work lifts (R2-GEN-06), calves that differ across the
//     week, skill picks that are not the day's core, the class's standing strict press
//   * rules.reps / rules.rest / rules.effort additions - single-leg / single-arm lifts never under 8 per side by default (UNI-04), a
//     rep floor for back extensions, rep ranges that never get lighter from block to block (PER-11), 2-3 min for a heavy two-arm /
//     two-leg compound (VOL-14), the MYO set on a machine or cable isolation first, never on a barbell or axial-high lift (VOL-15)
//   * rules.conditioning.aerobic_b3 - the colour ladder climbs inside a stairway and field-sport athletes start a rung higher
//     (EQ-14, R2-PER-03)
//   * words: the printed plan in the client's words (EN / ES) - the adjust line from the plan's own blocks, the Focus muscles the
//     client picked, test days by weekday, kept movements named, coach-only notes out of client text, neutral Spanish

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * Fix round 2 / F3 rule amendments (after amendRulesR2F2).
 * @param {object} rules @returns {object}
 */
export function amendRulesR2F3(rules) {
  const R = clone(rules);
  // ------------------------------------------------------------------------------------------------ selection (E-178 ... E-19x)
  R.selection.r2 = {
    // E-178 (RECHECK v0.4 08 major 'the plan says each new block brings a small change and nothing changes'; 01 / 03 'the dial has too few
    // stations'): the picks are made a second time on the stations the time check keeps (generate hands `live` to selectBlock), so the
    // one-change-a-day rule, the laterality dials and the week's variety read the plan's real stations, not the template's dropped ones
    second_pass: { enabled: true, refs: ['PER-02', 'UNI-02', 'R3-SES-02'], status: 'PROPOSED (fix round 2 / F3): one extra select + volume pass' },
    // the second pass keeps the first pass's pick unless a rule of the round speaks against it (less churn), and an exercise the week
    // already holds costs a little more each time it comes back
    base_pick_bonus: 2, repeat_in_week: -1.5,
    // E-179 (COACH-ANSWER UNI-02 / UNI-03 'field athletes up to 80-90 % single-leg / single-arm; bodybuilders 80/20-90/10'; UNI-07
    // 'alternating counts as one side'; RECHECK v0.4 02 major, 03 minor, 06 major: upper-body compound sets 56-65 % two-arm against 20-30 %,
    // and 55 % against 80-90 % for a physique client): the dial runs on the upper paired stations too. Each exercise block marks which
    // stations are two-arm and which one-arm from the block's share target; the stations stay two-arm in a fixed order (tested / work
    // lifts, then the week's first press, pull-up, row, overhead press, then the second exposures), so a station never flips one way and
    // back; a bucket only asks for as many one-arm stations as the kit holds different one-arm lifts
    upper_dial: {
      enabled: true, weight: 5, min_stations: 2, bucket_priority: ['RP_HPUSH', 'RP_VPULL', 'RP_HPULL', 'RP_VPUSH'],
      floor_press_when_bench: -4, keep_lead_press: true, refs: ['UNI-02', 'UNI-03', 'UNI-07'], status: 'PROPOSED (fix round 2 / F3): weight, station order; the day\'s first chest press stays two-arm (selection.lead_press)'
    },
    // E-180 (COACH-ANSWER UNI-06 'athletes pair squat + single-leg RDL'; RECHECK v0.4 01 minor 'Monday becomes two bilateral squats'): an
    // athlete's dial never turns a two-legged station single-leg on a day that already holds a single-leg lift of the same pattern
    lower_dial: { no_same_pattern_single_leg_pair: false, status: 'PROPOSED (fix round 2 / F3): built, off - the second single-leg hinge of a day becomes a knee-flexion exercise instead (second_hip_knee_flexion)' },
    // E-181 (COACH-ANSWER PER-02 'change one or two small variables', CAT-05 level ladder, EQ-03 'machines for people going up in volume',
    // UNI-02 stance swap 'Bulgarian split squat -> hack squat'; RECHECK v0.4 07 major, 06 / 01 minors: the hardest block got the easiest
    // lifts - a single-kettlebell deadlift, a standing cable press, a goblet squat at 6-8 reps): a block change never lowers the
    // exercise level (as far as the client's ladder goes) or the load ceiling; a station the dial turns two-legged takes a lift that
    // can be loaded heavy (machine / barbell, non-axial) before a weight held in the hands, for trained lifters; an engine-added
    // exercise keeps its exercise across exercise blocks
    no_step_down: {
      level: true, levels: ['L2', 'L3'], flip_load_high: 3, flip_machine: 0,
      hand_held_re: 'goblet|high-zercher-db|low-hold-db|sumo-squat-db|box-goblet|kettlebell-deadlift|^dumbbell-deadlift$|^landmine-squat$', hand_held: -3,
      flip_hinge_prefer_re: 'hyperextension|back-extension|glute-ham', flip_hinge_prefer: 1.5,
      added_keep_across_blocks: true, focus_bodyweight_big: -4, odd_implement_re: 'sandbag', focus_odd_implement_full_gym: -3,
      refs: ['PER-02', 'CAT-05', 'EQ-03', 'EQ-09', 'UNI-02'], status: 'PROPOSED (fix round 2 / F3): weights'
    },
    // E-182 (COACH-ANSWER PER-04 'second time a slot comes up = a different exercise from the category', PER-03 'athletes like variety';
    // RECHECK v0.4 02 / 03 / 06 / 07: seesaw + alternating DB overhead press, weighted + strict pull-up, five hip-thrust / bridge variants a
    // week on back-to-back days, two overhead triceps extensions on one day, upright rows on consecutive days, two front-loaded DB squats,
    // two cable pulldowns on one day): movement families with a weekly cap, a per-day cap and a day gap (soft: the family comes back
    // only when the pool holds nothing else)
    families: [
      { id: 'hip_thrust_bridge', re: 'hip-thrust|glute-bridge', week_max: 2, day_max: 1 },
      { id: 'db_overhead_alt', re: 'seesaw-db-press|alternating-db-overhead-press|seesaw-db-push-press', week_max: 1 },
      { id: 'pull_up_bar', re: '^(strict-pull-up|pull-up-|wide-grip-pull-up|weighted-pull-up|l-sit-pull-up|close-grip-pull-up)', week_max: 1 },
      { id: 'lat_pulldown', re: 'lat-pulldown', day_max: 1 },
      { id: 'overhead_triceps', re: 'overhead-.*triceps-extension', day_max: 1 },
      { id: 'upright_row', re: 'upright-row', week_max: 1, min_day_gap: 2 },
      { id: 'front_loaded_squat', re: 'goblet-squat|high-zercher-db-squat|box-goblet|double-kb-front-rack|low-hold-db-squat', week_max: 1 },
      { id: 'db_staggered_hinge', re: 'kickstand|staggered-stance|rear-foot-on-wall|alternating-db-deadlift|alternating-barbell-deadlift|single-leg-rdl', week_max: 1, day_max: 1 },
      { id: 'leg_curl_machine', re: '(seated|lying)-leg-curl-machine|machine-leg-curl', day_max: 1 }
    ],
    family_over_week: -4, family_over_day: -8, family_day_gap: -4, family_day_counts_pending_one_arm: true,
    families_status: 'PROPOSED (fix round 2 / F3): the lists and the weights; INFERRED from the catalog ids',
    // E-183 (COACH-R3 R3-SES-01 'hips = glutes + hamstrings, e.g. RDL + hip thrust + leg curl'; RECHECK v0.4 03 major: two staggered DB
    // deadlifts as the hip day's two hip exercises; 05 / 08 minors): when a day's first hips pick is a hinge, its second, non-work hip
    // station takes a glute-dominant lift (hip thrust / bridge) - not in a timed circuit (the stations' rounds are fixed), and only in
    // plans whose glutes are a target line
    glute_second_hip: { enabled: true, weight: 6, only_when_glutes_target: true, refs: ['R3-SES-01', 'R2-SES-05', 'PER-04'], status: 'PROPOSED (fix round 2 / F3): only where the glutes are a target line - elsewhere the hips target is counted on the hamstrings line (E-84) and a hip thrust would cost the group its floor; open for the volume engine' },
    // E-183 (the same review; OBSERVED BYOP ATHLETIC hip day 'bilateral HD + unilateral HD + leg curls'; COACH-ANSWER CAT-09): a day's second
    // single-leg hinge that could only be another version of its first one (the library's single-leg hinges are one family) becomes a
    // leg curl - the same hamstrings line, so the hips keep their weekly sets
    second_hip_knee_flexion: { enabled: true, family: 'db_staggered_hinge', refs: ['R3-SES-01', 'CAT-09', 'PER-04'], status: 'PROPOSED (fix round 2 / F3)' },
    // E-184 (04 core.plane_pct per profile, CAT-08 'planes rotate across the week', R2-SES-03 'light opener'; RECHECK v0.4 01 / 02 / 08: one
    // transverse pick in six against a 40 % share, two frontal holds as a pair, an advanced L-sit hold as a 230-lb athlete's warm-up, leg
    // raises and crunches for a rotational low-back hot spot): the week's main-day core picks follow the profile's plane shares (whole
    // picks per plane), a day's two core exercises differ in plane, at most one trunk-flexion exercise a day, no advanced hanging / L-sit
    // hold as the opener of a heavy athlete
    core: {
      plane_under: 3, plane_over: -3, pair_same_plane: -2.5, flexion_second: -3, flexion_on_hinge_day: -1.5,
      heavy_avoid_re: 'l-sit|toes-to-bar|hanging|windshield|dragon-flag', heavy_avoid: -5,
      refs: ['CAT-08', 'R2-SES-03', 'ATH-11'], status: 'PROPOSED (fix round 2 / F3): weights'
    },
    // E-185 (COACH-ANSWER GEN-04 'a swap is a same-category dropdown', CAT-09 'leg curls are their own bucket', CAT-04 / EQ-09; RECHECK v0.4
    // 01 / 03 / 04 / 08: a lat pulldown offered for a row, deadlifts for a leg curl, a barbell hinge for an L1, hanging toes-to-bar for a
    // low-back beginner, four Zercher variants for a front squat, pull-ups for double-unders): a swap shares the pick's credit class
    // (two-legged / single-leg first), passes the client's hot-spot, pain, level and implement leans, repeats a variant family at most
    // twice, and a skill swaps to its own skill family
    swaps: {
      same_category: true, client_filter: true, max_per_stem: 2,
      stem_re: ['zercher', 'goblet', 'pull-up', 'lat-pulldown', 'push-up', 'hip-thrust', 'glute-bridge', 'leg-curl', 'calf-raise', 'floor-press', 'plank'],
      skill_families: [['double-unders-jump-rope', 'jump-rope'], ['toes-to-bar-hanging', 'knees-to-chest-hanging', 'hollow-rocks'], ['pull-up-grip-not-stated', 'dead-hang-pull-up-bar']],
      refs: ['GEN-04', 'CAT-09', 'CAT-04', 'EQ-09'], status: 'PROPOSED (fix round 2 / F3)'
    },
    // E-186 (COACH-ANSWER PER-02 / COACH-R2 R2-LIB-01 'one detail between blocks, shown as "name - detail"'; RECHECK v0.4 02 / 05 / 06 / 07 /
    // 08: details that flip back (plain -> pause -> plain; deficit -> one leg -> deficit), a detail taken away at the block change, the
    // same exercise with the same detail on two days, days where nothing changed): a slot's detail never returns to an earlier block's
    // value and is never taken away when nothing new is left; two exposures of one exercise in a week never carry the same detail; a
    // day whose lifts cannot change changes one core exercise inside its plane; a dial flip is the day's change
    block_change: {
      keep_detail_when_stuck: true, week_distinct_details: true, core_backup: true, flip_is_the_change: true,
      refs: ['PER-02', 'R2-LIB-01'], status: 'PROPOSED (fix round 2 / F3)'
    },
    // E-189 (COACH-ANSWER CAT-05 level ladder; RECHECK v0.4 05 major: an offset push-up - harder than a push-up - on Wednesday and a kneeling
    // push-up - a regression - on Friday for one client): the week's push-up versions stay within one step of each other
    push_up_band: {
      ladder: ['wall|incline-push-up|hands-elevated-for|incline|bench-push-up-hands', 'kneeling', '^push-up$', 'offset|hand-switch|diamond|scapular', 'decline|deficit|feet-on|feet-elevated|bench-push-up-feet|handstand|pike'],
      default_rank: 2, max_gap: 1, penalty: -3, refs: ['CAT-05'], status: 'PROPOSED (fix round 2 / F3): INFERRED ladder from the catalog names'
    },
    // E-187 (COACH-R2 R2-GEN-06 'RIR plus a week-1 weight tip'; RECHECK v0.4 02 minor: 'Stationary Lunge' and 'Step-Up' as a 230-lb L3's work
    // lifts with no implement named): a trained lifter's work / secondary lift whose record names no implement says what to hold
    // (dose: note.hold_weights)
    implement_note: { levels: ['L2', 'L3'], classes: ['UKD', 'UHD', 'BKD', 'BHD'], refs: ['R2-GEN-06'], status: 'PROPOSED (fix round 2 / F3)' },
    // E-188 (OBSERVED class split 'PRESS'; RECHECK v0.4 04 minor: a seated high-incline press as the class's press and tested max): the
    // class's press is the standing strict press (the class's own lift: no above-level cost)
    class_press: { bucket: 'RP_VPUSH', id: 'standing-barbell-overhead-press-strict', weight: 6, families: ['hybrid_crossfit'], refs: ['OBSERVED HALF TIME class split'], status: 'PROPOSED (fix round 2 / F3)' },
    refs: ['PER-02', 'PER-04', 'UNI-02', 'UNI-03', 'GEN-04', 'CAT-05', 'CAT-08', 'R3-SES-01'],
    status: 'PROPOSED (fix round 2 / F3): selection weights of fix round 2'
  };
  // ------------------------------------------------------------------------------------------------ dosing (E-190 ... E-193)
  // E-190 (COACH-ANSWER UNI-04 'unilateral moderate-to-high reps by default; heavy low reps optional'; BRAIN B10 / T6; RECHECK v0.4 02 minor)
  R.reps.unilateral_floor = { min: 8, top_at_least: 10, unless_pref: 'heavy_unilateral', refs: ['UNI-04'], status: 'PROPOSED (fix round 2 / F3): 8 per side (the VOL3 block reads 8-10)' };
  // E-191 (BRAIN 7.3 'athletic accessory hinge 8-12'; RECHECK v0.4 01 minor): back extensions / reverse hypers never under 10 reps; a
  // rep-capped lift takes the top of its own range in the first phase and steps down, never up, from block to block (PER-11)
  R.reps.rep_floor_ids = [{ re: 'hyperextension|back-extension|reverse-hyper|glute-ham', min: 10, top_at_least: 12, refs: ['BRAIN 7.3'], status: 'PROPOSED (fix round 2 / F3)' }];
  R.reps.rep_hint = { ...R.reps.rep_hint, monotone_cap: { span: 2, step: 1, floor_min: 6 }, monotone_status: 'PROPOSED (fix round 2 / F3): capped lifts 8-10 -> 7-9 -> 6-8' };
  // E-192 (COACH-ANSWER VOL-14 'hypertrophy 1-2 (to 3) min, strength 3-6 min'; RECHECK v0.4 02 minor)
  R.rest = { ...R.rest, heavy_compound: { max_reps: 8, max_rir: 2, s: [120, 180], rep_classes: ['main_bilateral_compound', 'machine_stable_compound'], refs: ['VOL-14'], status: 'PROPOSED (fix round 2 / F3): the time model still counts these sets at the hypertrophy rest (about 1 min a set short) - open for the time model' } };
  // E-193 (COACH-ANSWER VOL-15; OBSERVED BYOP MYO on the leg extension; RECHECK v0.4 02 minor)
  R.effort.intensifiers = { ...R.effort.intensifiers, never_tags: ['barbell', 'axial_high'], never_id_re: 'nordic|sissy|copenhagen', r2_status: 'PROPOSED (fix round 2 / F3)' };
  // EQ-09 (RECHECK v0.4 04 / 05 minors): lifts whose load is the body - no 'pick a weight' tip
  R.effort.bodyweight_moved_re = 'push-up|pull-up|chin-up|inverted-row|table-row|ring-row|trx-row|hamstring-curl-medball|ball-hamstring-curl|slider-hamstring|nordic|^glute-bridge$|sissy-squat|-dip$|^parallel-bar-dip';
  R.effort.circuit_alternating_note = 'note.circuit_alternating';
  // E-187 (COACH-R2 R2-GEN-06; RECHECK v0.4 02 minor): a trained lifter's lower-body lift whose record names no implement (split squat,
  // lunges, step-up: equipment none / a bench / a box) says what to hold and takes the week-1 tip
  R.effort.implement_note = { key: 'note.hold_weights', levels: ['L2', 'L3'], classes: ['UKD', 'UHD', 'BKD', 'BHD'], prop_tokens: ['floor', 'bench', 'box', 'step_low', 'wall', 'weight_plate', 'plate_low_target'], refs: ['R2-GEN-06', 'EQ-09'], status: 'PROPOSED (fix round 2 / F3)' };
  // E-195 (PER-02; RECHECK v0.4 01 minor): core holds get 5 s longer with each exercise block (20-40 -> 25-45 -> 30-50 s), never past 60 s
  R.reps.core_hold_seconds = { ...R.reps.core_hold_seconds, block_step: { s: 5, max_steps: 2, cap_s: 60 }, block_step_status: 'PROPOSED (fix round 2 / F3)' };
  // E-194 (COACH-ANSWER ATH-07; RECHECK v0.4 03 major / 04 minor): the aerobic ladder climbs with the plan's exercise blocks (a pre-season
  // block does not start over), a competitive athlete of L2+ starts one rung higher, a long exercise block climbs one rung at its
  // halfway week, and the minutes climb inside the exercise block from the low end of the colour's range to its top
  R.conditioning.aerobic_b3 = { ...R.conditioning.aerobic_b3, r2: { plan_wide_block_index: true, competitive_bump: { levels: ['L2', 'L3'], by: 1, families: ['athletic'] }, long_block_weeks: 6, minutes_climb: true, refs: ['ATH-07', 'R2-SES-06'], status: 'PROPOSED (fix round 2 / F3): bump, mid-block rung, minutes climb' } };
  // ------------------------------------------------------------------------------------------------ the printed plan (E-196 ... E-203)
  // E-200 (OBSERVED 'EXAMPLE CROSSFIT SPLIT' A4:A7; RECHECK v0.4 04 minor): the class model prints the CrossFit sheet's own Basic
  // Instruction; E-199 (RECHECK v0.4 06 minor): a day's title follows its lead lower-body lift; R2-GEN-08 (RECHECK v0.4 03 minor): the
  // video search of a translated plan uses the English gym name
  R.render = {
    instruction_keys_by_family: { hybrid_crossfit: ['instruction.cf.1', 'instruction.cf.2', 'instruction.cf.3', 'instruction.5'] },
    day_title_from_lead_lift: true, video_search_english: true,
    refs: ['R2-GEN-08', 'R3-SES-02', 'OBSERVED MASTER_MODEL EXAMPLE CROSSFIT SPLIT A4:A7'], status: 'PROPOSED (fix round 2 / F3): wording of the new lines'
  };
  // E-204 (ORD-08 A-drills; RECHECK v0.4 05 minor): the warm-up's running drill steps up its list at each exercise block (march -> skip ->
  // run) for an L2 / L3 client under 50 with no lower-limb or low-back pain
  R.warmup = { ...R.warmup, progress_by_exercise_block: { levels: ['L2', 'L3'], max_age: 49, not_pain: ['knee', 'ankle_foot', 'hip_groin', 'lower_back'], refs: ['ORD-08'], status: 'PROPOSED (fix round 2 / F3)' } };
  // RECHECK v0.4 08 minor: a tibialis raise is joint care for the shins and ankles, whatever hot spot placed it
  R.prehab = { ...R.prehab, label_by_exercise: [{ re: 'tibialis', key: 'prehab.label_ex.shins_ankles' }] };
  // the rotational low-back hot spot of court players (04 LOW_BACK_ROTATIONAL; RECHECK v0.4 08 major: leg raises, crunches and reverse
  // crunches opened a 52-year-old pickleball player's days): the same core lean as the other low-back hot spots (E-129)
  if (R.selection.f3 && R.selection.f3.core_low_back) R.selection.f3.core_low_back = { ...R.selection.f3.core_low_back, hotspots: [...new Set([...(R.selection.f3.core_low_back.hotspots || []), 'LOW_BACK_ROTATIONAL'])], avoid_re: R.selection.f3.core_low_back.avoid_re + '|hanging|reverse-crunch' };
  return R;
}

/**
 * Fix round 2 / F3 exercise amendments (after amendExerciseR2F2).
 * @param {object} ex @returns {object}
 */
export function amendExerciseR2F3(ex) {
  return ex;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_R2F3 = {
  // dosing (E-190 ... E-193)
  'why.unilateral_floor': ['One-side lifts stay at {min} reps or more per side (heavy single-leg work is a switch you can turn on)', 'Los ejercicios a un lado se mantienen en {min} repeticiones o más por lado (el trabajo pesado a una pierna es una opción que puedes activar)'],
  'note.hold_weights': ['Hold dumbbells at your sides (or a barbell on your back) once your body weight is easy at this effort', 'Sostén mancuernas a los lados (o una barra en la espalda) cuando tu peso corporal resulte fácil a este esfuerzo'],
  'load.week1_tip_rir': ['Week 1: pick a weight you could lift about {rir} more times', 'Semana 1: elige un peso que podrías levantar unas {rir} veces más'],
  'why.aerobic_rung': ['From the halfway week of a long exercise block the session moves one step up its ladder', 'Desde la semana media de un bloque de ejercicios largo la sesión sube un paso en su escalera'],
  'why.rep_floor': ['This exercise stays at {min} reps or more', 'Este ejercicio se mantiene en {min} repeticiones o más'],
  'note.circuit_alternating': ['Alternate sides every rep for the whole station', 'Alterna los lados en cada repetición durante toda la estación'],
  'load.week1_tip': ['Week 1: pick a weight you could lift about 3 more times', 'Semana 1: elige un peso que podrías levantar unas 3 veces más'],
  'effort.how_hard': [
    'How heavy? Each exercise tells you how many reps to leave in the tank: "leave 2 in the tank" means you could do 2 more reps at the end of the set (about RPE 8; 3 left = RPE 7, 1 left = RPE 9). Your plan starts with 3 in the tank, then 2, then 1-2, and in the last week 1 with a few extra-hard sets. Week 1: start a little lighter, with a weight you could lift about {rir} more times.',
    '¿Cuánto peso? Cada ejercicio te dice cuántas repeticiones dejar en reserva: "deja 2 en reserva" significa que podrías hacer 2 repeticiones más al final de la serie (aproximadamente RPE 8; 3 en reserva = RPE 7, 1 en reserva = RPE 9). Tu plan empieza con 3 en reserva, luego 2, luego 1-2, y en la última semana 1 con algunas series extra duras. Semana 1: empieza un poco más ligero, con un peso que podrías levantar unas {rir} veces más.'
  ],
  'effort.how_hard_no_int': [
    'How heavy? Each exercise tells you how many reps to leave in the tank: "leave 2 in the tank" means you could do 2 more reps at the end of the set (about RPE 8; 3 left = RPE 7, 1 left = RPE 9). Your plan starts with 3 in the tank, then 2, then 1-2, and ends at 1 in the last week. Week 1: start a little lighter, with a weight you could lift about {rir} more times.',
    '¿Cuánto peso? Cada ejercicio te dice cuántas repeticiones dejar en reserva: "deja 2 en reserva" significa que podrías hacer 2 repeticiones más al final de la serie (aproximadamente RPE 8; 3 en reserva = RPE 7, 1 en reserva = RPE 9). Tu plan empieza con 3 en reserva, luego 2, luego 1-2, y termina con 1 en la última semana. Semana 1: empieza un poco más ligero, con un peso que podrías levantar unas {rir} veces más.'
  ],
  // the printed plan (E-196 ... E-203)
  'reps.fixed_one': ['{n} Rep', '{n} rep'],
  'list.and': ['and', 'y'],
  'date.dmy': ['{d} {mon} {y}', '{d} {mon} {y}'],
  'date.month_short.1': ['Jan', 'ene'],
  'date.month_short.2': ['Feb', 'feb'],
  'date.month_short.3': ['Mar', 'mar'],
  'date.month_short.4': ['Apr', 'abr'],
  'date.month_short.5': ['May', 'may'],
  'date.month_short.6': ['Jun', 'jun'],
  'date.month_short.7': ['Jul', 'jul'],
  'date.month_short.8': ['Aug', 'ago'],
  'date.month_short.9': ['Sep', 'sep'],
  'date.month_short.10': ['Oct', 'oct'],
  'date.month_short.11': ['Nov', 'nov'],
  'date.month_short.12': ['Dec', 'dic'],
  'ui.plan.test_days': ['Test days (mark your calendar; the plan sends no reminders): {list}', 'Días de prueba (anótalos en tu calendario; el plan no envía recordatorios): {list}'],
  'ui.plan.test_days_week': ['week {n}: {days}', 'semana {n}: {days}'],
  'ui.plan.holiday_weeks_no_test': ['Weeks {weeks} include Christmas / New Year: move a session by a day or two if you need to; plan longer holidays between blocks.', 'Las semanas {weeks} incluyen Navidad / Año Nuevo: mueve una sesión uno o dos días si lo necesitas; planifica las vacaciones largas entre bloques.'],
  'ui.plan.days_over': ['These days run over your {min} min even with the marked supersets: {list}. Each of them shows what else saves time; or plan the extra minutes.', 'Estos días pasan de tus {min} min incluso con las superseries marcadas: {list}. Cada uno muestra qué más ahorra tiempo; o planea los minutos extra.'],
  'ui.plan.days_over_mixed': ['These days run over their minutes even with the marked supersets: {list}. Each of them shows what else saves time; or plan the extra minutes.', 'Estos días pasan de sus minutos incluso con las superseries marcadas: {list}. Cada uno muestra qué más ahorra tiempo; o planea los minutos extra.'],
  'ui.plan.days_over_item': ['{day} in weeks {weeks} (about {min} min)', '{day} en las semanas {weeks} (unos {min} min)'],
  'ui.plan.days_over_item_one': ['{day} in week {weeks} (about {min} min)', '{day} en la semana {weeks} (unos {min} min)'],
  'ui.plan.days_over_item_all': ['{day} every week (about {min} min)', '{day} todas las semanas (unos {min} min)'],
  'warning.supersets_needed_save': ['Do the marked supersets on {day} to save time.', 'Haz las superseries marcadas el {day} para ahorrar tiempo.'],
  'warning.athletic_capacity_activity': ["Your sessions hold about {pct}% of this plan's weekly {key}: the work still climbs every week. Add a day or longer sessions for the full dose.", 'Tus sesiones permiten cerca del {pct}% de los {key} semanales de este plan: el trabajo igual sube cada semana. Agrega un día o sesiones más largas para la dosis completa.'],
  'warning.athletic_capacity_block_activity': ["Your sessions hold about {pct}% of this plan's weekly {key}: the work climbs across the block (not every week). Add a day or longer sessions for the full dose.", 'Tus sesiones cubren cerca del {pct}% de los {key} semanales de este plan: el trabajo sube a lo largo del bloque (no cada semana). Agrega un día o sesiones más largas para la dosis completa.'],
  'ui.plan.kept_exercise': ['{group}: not trained directly because of time. It keeps {list}, with no climb.', '{group}: no se entrena directamente por falta de tiempo. Conserva {list}, sin subir series.'],
  'ui.plan.kept_exercise_item': ['{exercise} on {day} ({n} sets)', '{exercise} el {day} ({n} series)'],
  'ui.plan.not_trained_credit_all': ['No direct exercise in this plan - they work inside your other lifts: {groups}', 'Sin ejercicio directo en este plan - trabajan dentro de tus otros ejercicios: {groups}'],
  'ui.plan.not_trained_credit': ['Trained through your compound lifts (no direct sets): {groups}', 'Se entrenan con tus ejercicios compuestos (sin series directas): {groups}'],
  'ui.plan.below_floor_circuit': ['Held below 10 sets by your time: {groups}', 'Se quedan por debajo de 10 series por tu tiempo: {groups}'],
  'ui.plan.below_floor_class': ['Held below 10 sets by your time (the class lift keeps its sets and gets heavier): {groups}', 'Se quedan por debajo de 10 series por tu tiempo (el levantamiento de la clase mantiene sus series y sube de peso): {groups}'],
  'ui.plan.below_floor_hold': ['Held below 10 sets by your time (the main lift stays): {groups}', 'Se quedan por debajo de 10 series por tu tiempo (el ejercicio principal se queda): {groups}'],
  'ui.plan.calves_line': ['Calves: below 10 sets - the rule is one exercise each leg day ({from} to {to} sets a week). Add a calf raise on another day if you want more.', 'Pantorrillas: por debajo de 10 series - la regla es un ejercicio cada día de pierna (de {from} a {to} series por semana). Agrega una elevación de talones otro día si quieres más.'],
  'ui.plan.calves_line_flat': ['Calves: below 10 sets - the rule is one exercise each leg day ({n} sets a week). Add a calf raise on another day if you want more.', 'Pantorrillas: por debajo de 10 series - la regla es un ejercicio cada día de pierna ({n} series por semana). Agrega una elevación de talones otro día si quieres más.'],
  'ui.plan.ankle_contacts': ['{n} ankle-hop contacts', '{n} contactos de saltos de tobillo'],
  'ui.plan.focus_row': ['↳ {muscle} (Focus)', '↳ {muscle} (Enfoque)'],
  'ui.plan.test_end_stations': ["End test this week: each test takes the place of that day's sprint, change-of-direction or jump station", 'Prueba final esta semana: cada prueba toma el lugar de la estación de sprint, cambio de dirección o salto de ese día'],
  'ui.plan.day_title_cardio': ['{title} + cardio', '{title} + cardio'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.WOD.with_cardio': ['WOD class + cardio', 'Clase de WOD + cardio'],
  'ui.plan.day_over_circuit': ['This day runs about {est} min, over your {min}: take a shorter rest between rounds, or switch off the core block.', 'Este día dura unos {est} min, más que tus {min}: descansa menos entre rondas o desactiva el bloque de core.'],
  'plan.stairway_intro_plain': ['Your plan climbs like a stairway: the effort goes up through the block and sets are added where your time allows, the hardest weeks at the end.', 'Tu plan sube como una escalera: el esfuerzo sube a lo largo del bloque y se agregan series donde tu tiempo lo permite, con las semanas más duras al final.'],
  'guide.adjust.edit_blocks': ['You (or your coach) can switch off these blocks on any day: {blocks}. You can also add or remove exercises (more rear-delt work, for example).', 'Tú (o tu entrenador) puedes desactivar estos bloques cualquier día: {blocks}. También puedes agregar o quitar ejercicios (por ejemplo, más trabajo de deltoides posterior).'],
  'guide.adjust.edit_none': ['You (or your coach) can add or remove exercises (more rear-delt work, for example).', 'Tú (o tu entrenador) puedes agregar o quitar ejercicios (por ejemplo, más trabajo de deltoides posterior).'],
  'guide.adjust.edit_supersets': ['Use the suggested supersets to save time.', 'Usa las superseries sugeridas para ahorrar tiempo.'],
  'guide.adjust.accessories': ['Switching off the accessories block takes away every direct set for {groups}.', 'Desactivar el bloque de accesorios quita todas las series directas de {groups}.'],
  'guide.adjust.edit_stations': ['In a circuit you can skip the jump, throw or cardio station, or remove a small-muscle station: the rounds stay the same.', 'En un circuito puedes saltarte la estación de salto, lanzamiento o cardio, o quitar una estación de músculo pequeño: las rondas siguen igual.'],
  'guide.adjust.swim': ["Swimmers: keep the gym at least 4 hours away from a hard pool session when you can. After a hard pool week, switch off that day's jumps, remove an exercise or repeat the week. Before your main meet, taper the gym for 2 weeks in line with your swim coach's taper (1 week or none before smaller meets).", 'Nadadores: deja al menos 4 horas entre el gimnasio y una sesión dura de piscina cuando puedas. Después de una semana dura de piscina, desactiva los saltos de ese día, quita un ejercicio o repite la semana. Antes de tu competencia principal, reduce el gimnasio durante 2 semanas siguiendo la puesta a punto de tu entrenador de natación (1 semana o ninguna antes de competencias menores).'],
  'instruction.2_bridge': ['In this plan your cardio sessions sit on lifting days: do each one as its own session that day, or move it to any free day.', 'En este plan tus sesiones de cardio caen en días de pesas: haz cada una como una sesión aparte ese día, o pásala a cualquier día libre.'],
  // OBSERVED MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A4:A6 (his words; capitals and the 'CROSFFIT' typo normalised)
  'instruction.cf.1': ['*Instead of working to failure, push your limits over the course of time.', '*En lugar de trabajar hasta el fallo, empuja tus límites a lo largo del tiempo.'],
  'instruction.cf.2': ['**CrossFit has its hybrid style of performance, so to be competitive, you MUST be able to be as good as possible in EACH modality. Train accordingly.', '**CrossFit tiene su estilo híbrido de rendimiento, así que para ser competitivo DEBES ser lo mejor posible en CADA modalidad. Entrena en consecuencia.'],
  'instruction.cf.3': ["***WODs will be prescribed by your box or program; yes, they might interfere with recovery / performance, but that's part of CrossFit.", '***Los WODs los prescribe tu box o tu programa; sí, pueden interferir con la recuperación o el rendimiento, pero eso es parte de CrossFit.'],
  'changes.new_exercise_block_n': ['New exercise block: {n} exercises change a little (another version or one new detail); the rest stay', 'Nuevo bloque de ejercicios: {n} ejercicios cambian un poco (otra versión o un detalle nuevo); el resto se queda'],
  'changes.new_exercise_block_one': ['New exercise block: 1 exercise changes a little (another version or one new detail); the rest stay', 'Nuevo bloque de ejercicios: 1 ejercicio cambia un poco (otra versión o un detalle nuevo); el resto se queda'],
  'changes.new_exercise_block_same': ['New exercise block: the exercises stay this time', 'Nuevo bloque de ejercicios: esta vez los ejercicios se quedan'],
  'changes.load_up_circuit': ['Keep your weights this week (the stations got longer); add load only where you finish a station with more than {rir} reps left', 'Mantén tus pesos esta semana (las estaciones duran más); agrega peso solo donde termines una estación con más de {rir} repeticiones en reserva'],
  'changes.load_up_circuit_same': ['Same work time this week: add a little load where you finish a station with more than {rir} reps left', 'Mismo tiempo de trabajo esta semana: agrega un poco de peso donde termines una estación con más de {rir} repeticiones en reserva'],
  'prehab.label_ex.shins_ankles': ['Joint care for the shins and ankles', 'Cuidado articular de espinillas y tobillos'],
  'plan.next.pre_season': ['your pre-season block ({weeks} weeks) before the season starts on {date}; its first week can be the recommended easy week (optional)', 'tu bloque de pretemporada ({weeks} semanas) antes de que empiece la temporada el {date}; su primera semana puede ser la semana suave recomendada (opcional)'],
  // selection why-codes (E-179, E-183)
  'why.laterality_share_upper': ['One-arm and alternating upper-body lifts for your goal: about {pct}% of your pressing and pulling sets are two-arm', 'Ejercicios de tren superior a un brazo y alternados para tu objetivo: cerca del {pct}% de tus series de empuje y tirón son a dos brazos'],
  'why.second_hip_knee_flexion': ['The hip day pairs its single-leg hinge with a leg curl, not a second version of the same hinge (hips = glutes + hamstrings)', 'El día de cadera combina su bisagra a una pierna con un curl de pierna, no con otra versión de la misma bisagra (cadera = glúteos + isquiotibiales)'],
  'why.glute_second_hip': ['The hip day pairs a hinge with a glute-dominant lift (hips = glutes + hamstrings)', 'El día de cadera combina una bisagra con un ejercicio dominante de glúteo (cadera = glúteos + isquiotibiales)']
};

/** UI_R2F3 keys that replace an earlier string of the same key */
export const R2F3_FINAL = ['load.week1_tip', 'effort.how_hard', 'effort.how_hard_no_int', 'ui.plan.not_trained_credit', 'ui.plan.calves_line', 'ui.plan.calves_line_flat', 'plan.next.pre_season'];

/** names / cues / labels fix round 2 / F3 rewrites (applied after the exercise, profile and day names, like TEXT_F3): [en|null, es|null] */
export const TEXT_R2F3 = {
  // RECHECK v0.4 06 / 07 minors: programmer notes and rule ids in client cues ('program it on a push day', '(PER-04)', 'No ranking:');
  // RECHECK v0.4 03 minor (R2-GEN-08 neutral Latin American Spanish): 'lagartija' -> 'flexión de brazos', 'remo foca' -> 'remo con pecho
  // apoyado (Seal Row)', 'congela la caída' -> 'aterriza y quédate firme', 'Plan atlético de fuera de temporada'
  "exercise.assisted-dips-machine.cue": ["Works your chest and your triceps about equally ('more tricep than chest but still .5 and .5').", "Trabaja el pecho y los tríceps más o menos por igual ('más tríceps que pecho, pero igual .5 y .5')."],
  "exercise.machine-dip.cue": ["Works your chest and your triceps about equally ('more tricep than chest but still .5 and .5').", "Trabaja el pecho y los tríceps más o menos por igual ('más tríceps que pecho, pero igual .5 y .5')."],
  "exercise.parallel-bar-dip.cue": ["Works your chest and your triceps about equally ('more tricep than chest but still .5 and .5').", "Trabaja el pecho y los tríceps más o menos por igual ('más tríceps que pecho, pero igual .5 y .5')."],
  "exercise.weighted-dip.cue": ["Works your chest and your triceps about equally ('more tricep than chest but still .5 and .5').", "Trabaja el pecho y los tríceps más o menos por igual ('más tríceps que pecho, pero igual .5 y .5')."],
  "exercise.hack-squat-machine.cue": ["'If the hack squat that you have in your gym works and you feel it is good, then that's great.' More constrained than a Smith machine.", "'Si la sentadilla hack de tu gimnasio funciona y la sientes bien, perfecto.' Más guiada que una máquina Smith."],
  "exercise.leg-press-machine.cue": ["Constrained, no axial (spinal) load: a good second squat-pattern lift of the week.", "Guiado, sin carga axial (en la columna): un buen segundo ejercicio de sentadilla de la semana."],
  "exercise.smith-machine-squat.cue": ["Less constrained than a hack squat or leg press.", "Menos guiada que una sentadilla hack o una prensa de piernas."],
  "equipment.token.seal_bench": [null, "banco para remo con pecho apoyado (seal row)"],
  "exercise.bench-push-up-feet-on-bench.name": [null, "Flexión de brazos con pies en el banco, declinada (Decline Push-Up)"],
  "exercise.bench-push-up-hands-or-feet-on-bench-not-stated.name": [null, "Flexión de brazos con manos en el banco, inclinada (Incline Push-Up)"],
  "exercise.decline-push-up-feet-elevated.name": [null, "Flexión de brazos declinada con pies elevados (Decline Push-Up)"],
  "exercise.deficit-push-up-hands-elevated-for-full-rom.name": [null, "Flexión de brazos en déficit con manos elevadas, rango completo (Deficit Push-Up)"],
  "exercise.diamond-close-hand-push-up.name": [null, "Flexión de brazos diamante, manos juntas (Diamond Push-Up)"],
  "exercise.hand-switch-push-up.name": [null, "Flexión de brazos con cambio de manos (Hand-Switch Push-Up)"],
  "exercise.handstand-push-up-wall-supported.name": [null, "Flexión de brazos en parada de manos contra la pared (Handstand Push-Up)"],
  "exercise.incline-push-up-hands-elevated.name": [null, "Flexión de brazos inclinada con manos elevadas (Incline Push-Up)"],
  "exercise.kneeling-push-up-one-hand-higher-offset.name": [null, "Flexión de brazos con rodillas apoyadas y una mano más alta (Offset Kneeling Push-Up)"],
  "exercise.kneeling-push-up.name": [null, "Flexión de brazos con rodillas apoyadas (Kneeling Push-Up)"],
  "exercise.offset-push-up-one-hand-elevated.name": [null, "Flexión de brazos asimétrica con una mano elevada (Offset Push-Up)"],
  "exercise.pike-push-up.name": [null, "Flexión de brazos en pica (Pike Push-Up)"],
  "exercise.plyometric-push-ups.name": [null, "Flexiones de brazos pliométricas (Plyo Push-Ups)"],
  "exercise.push-up-box-jump.name": [null, "Flexión de brazos con salto de manos al cajón (Push-Up Box Jump)"],
  "exercise.push-up-feet-on-wall-feet-elevated.name": [null, "Flexión de brazos con pies en la pared / elevados (Feet-Elevated Push-Up)"],
  "exercise.push-up-stick-the-landing.name": [null, "Flexión de brazos con aterrizaje controlado: manos desde el cajón al piso (Push-Up Stick the Landing)"],
  "exercise.push-up.name": [null, "Flexión de brazos (Push-Up)"],
  "exercise.scapular-push-up-push-up-plus.name": [null, "Flexión de brazos escapular (Push-Up Plus)"],
  "exercise.seal-cable-row-prone-chest-supported-or-seated-cable-row-typo-ambiguous.name": [null, "Remo en polea boca abajo con pecho apoyado, o remo sentado en polea (Seal Cable Row)"],
  "exercise.seal-db-row-grip-not-stated.name": [null, "Remo con pecho apoyado con mancuernas (Seal DB Row)"],
  "exercise.seal-row-barbell-pronated-grip.name": [null, "Remo con pecho apoyado con barra, agarre prono (Seal Row)"],
  "exercise.seal-row-barbell-supinated-grip.name": [null, "Remo con pecho apoyado con barra, agarre supino (Seal Row)"],
  "exercise.seal-row-db-pronated-grip.name": [null, "Remo con pecho apoyado con mancuernas, agarre prono (Seal DB Row)"],
  "exercise.seal-row-db-supinated-grip.name": [null, "Remo con pecho apoyado con mancuernas, agarre supino (Seal DB Row)"],
  "exercise.seal-row-implement-grip-not-stated.name": [null, "Remo con pecho apoyado (Seal Row)"],
  "exercise.push-up-stick-the-landing.cue": [null, "Las manos empiezan sobre un cajón; empuja, aterriza con las manos en el piso y quédate firme."],
  "exercise.stick-the-landing-bilateral-jump-drop-and-freeze-the-landing.name": [null, "Aterrizaje controlado con dos pies: salta o cae y quédate firme (Stick the Landing)"],
  "exercise.stick-the-landing-unilateral-single-leg-landing-freeze.name": [null, "Aterrizaje controlado a una pierna: aterriza y quédate firme (Single-Leg Stick)"],
  "note.ballistic_land_go": [null, "Cae y sal: aterriza firme y salta de nuevo enseguida; reinicia entre repeticiones"],
  "note.ballistic_stick": [null, "Salta, aterriza y quédate firme 2-3 s; reinicia y vuelve a saltar"],
  "note.rc1": [null, "Aterriza y quédate firme: sostén 3 s"],
  "program.OT11.name": [null, "Plan atlético de fuera de temporada"],
};

/** ES lines the coach should review first (es_review.priority_review; RECHECK v0.4 03 / 05 minors) */
export const ES_PRIORITY_R2F3 = ["equipment.token.seal_bench", "exercise.bench-push-up-feet-on-bench.name", "exercise.bench-push-up-hands-or-feet-on-bench-not-stated.name", "exercise.decline-push-up-feet-elevated.name", "exercise.deficit-push-up-hands-elevated-for-full-rom.name", "exercise.diamond-close-hand-push-up.name", "exercise.hand-switch-push-up.name", "exercise.handstand-push-up-wall-supported.name", "exercise.incline-push-up-hands-elevated.name", "exercise.kneeling-push-up-one-hand-higher-offset.name", "exercise.kneeling-push-up.name", "exercise.offset-push-up-one-hand-elevated.name", "exercise.pike-push-up.name", "exercise.plyometric-push-ups.name", "exercise.push-up-box-jump.name", "exercise.push-up-feet-on-wall-feet-elevated.name", "exercise.push-up-stick-the-landing.name", "exercise.push-up.name", "exercise.scapular-push-up-push-up-plus.name", "exercise.seal-cable-row-prone-chest-supported-or-seated-cable-row-typo-ambiguous.name", "exercise.seal-db-row-grip-not-stated.name", "exercise.seal-row-barbell-pronated-grip.name", "exercise.seal-row-barbell-supinated-grip.name", "exercise.seal-row-db-pronated-grip.name", "exercise.seal-row-db-supinated-grip.name", "exercise.seal-row-implement-grip-not-stated.name", "exercise.push-up-stick-the-landing.cue", "exercise.stick-the-landing-bilateral-jump-drop-and-freeze-the-landing.name", "exercise.stick-the-landing-unilateral-single-leg-landing-freeze.name", "note.ballistic_land_go", "note.ballistic_stick", "note.rc1", "program.OT11.name", "guide.adjust.swim", "guide.adjust.edit_blocks", "guide.adjust.accessories", "ui.plan.kept_exercise", "ui.plan.days_over", "instruction.cf.1", "instruction.cf.2", "instruction.cf.3", "instruction.2_bridge", "note.hold_weights", "ui.plan.calves_line", "plan.next.pre_season"];
