// tools/fixture/render-b3.mjs - model 1.3.0, engine stage B3 (exercise selection, variation and rendering). Applied after the
// v1.2 review amendments (review-v12.mjs), the round-3 rule amendments (round3.mjs) and the stage-B2 athletic amendments
// (athletic-b2.mjs) by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps
// deep-equalling the fixture rules (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value
// names its source: COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What B3 changes in the model (engine/DECISIONS.md section E, stage B3 E-46 ... ; samples/REVIEW_LOG.md v0.4 stage B3):
//   * rules.selection.variations - the one-detail block-to-block variations written out with their concrete value ('Reverse
//     lunge - dumbbell in the opposite hand', COACH-R2 R2-LIB-01 / COACH-ANSWER PER-02), never 'different grip'
//   * rules.selection near-duplicates (one session never holds two versions of the same exercise), the lead chest press, the
//     powerlifting-style bilateral presses, home substitutes only when nothing better passes the kit, generic records swap-only,
//     core uniqueness and same-plane core swaps, the low-back-rotation hot spot, the racket-elbow wrist work
//   * rules.effort.intensifiers - one intensifier per training day, last stairway week only (COACH-R3 R3-VOL-04)
//   * rules.conditioning.aerobic_b3 - aerobic sessions by the client's own cardio tools, level and exercise block
//   * rules.legal - the use-at-your-own-risk line links DISCLAIMER.md / DISCLAIMER.es.md (COACH-R3 R3-GEN-01)
//   * words: the client copy of the time check, block switches, supersets, the macro tables, tests, effort drift; check-in words
//     retired (COACH-R3 R3-VOL-02); Spanish fixes (neutral Latin American Spanish, English gym term in brackets, COACH-R2 R2-GEN-08)

const clone = (o) => JSON.parse(JSON.stringify(o));

// ---------------------------------------------------------------------------------------------------------------- catalog

// the lunge / split-squat family loads a deeply bent knee (RECHECK 08 minor: the knee-pain step-up swapped to split squats and
// lunges); joined to the 'deep_knee_flexion' records of review-v12.mjs (INFERRED)
const DEEP_KNEE_B3 = ['forward-lunge', 'reverse-lunge', 'walking-lunge', 'stationary-lunge-split-squat', 'rear-foot-against-wall-split-squat'];

/**
 * B3 catalog amendments (after amendExerciseB2). Shapes unchanged (tags only).
 * @param {object} ex ExerciseRecord @returns {object}
 */
export function amendExerciseB3(ex) {
  if (!ex) return ex;
  // a full squat catch (squat clean / snatch, KB squat clean) is a deep knee bend too (RECHECK 08 minor: the knee-pain clean pull
  // offered a KB squat clean as its swap)
  const deep = DEEP_KNEE_B3.includes(ex.id) || !!(ex.athletic && ex.athletic.full_catch);
  if (!deep || (ex.tags || []).includes('deep_knee_flexion')) return ex;
  const e = clone(ex);
  e.tags = [...new Set([...(e.tags || []), 'deep_knee_flexion'])].sort();
  return e;
}

// ---------------------------------------------------------------------------------------------------------------- rules

/**
 * The concrete one-detail variations (COACH-R2 R2-LIB-01: 'change one detail - which hand holds the weight, grip, stance,
 * implement, range - and show it as "Reverse lunge - dumbbell in opposite hand"'; COACH-ANSWER PER-02 'change one or two of grip,
 * stance, implement, range of motion or rep range'). A value applies when every `when` field matches the record: `cc` credit
 * class, `impl` implement class (engine select.implementOf), `lat` laterality, `re` / `not_re` id patterns, `kit` one token the
 * kit holds, `not_pain` pain areas that rule it out. The list order is the preference order (a real change of grip / stance /
 * hand / implement first, a range or pause last). Values PROPOSED (B3).
 */
const VARIATIONS = [
  // which hand holds the weight (single-leg work)
  { id: 'opposite_hand', axis: 'hand', when: { cc: ['UKD', 'UHD'], impl: ['dumbbell', 'kettlebell'], lat: ['unilateral', 'alternating'], not_re: 'kickstand|staggered|alternating' } },
  { id: 'both_hands', axis: 'hand', when: { cc: ['UKD'], impl: ['dumbbell', 'kettlebell'], lat: ['unilateral', 'alternating'], re: 'lunge|split-squat|step-up' } },
  // grip
  { id: 'neutral_grip', axis: 'grip', when: { cc: ['HPUSH', 'VPUSH'], impl: ['dumbbell'], lat: ['bilateral'], not_re: 'neutral|hammer|landmine|push-press|push-jerk' } },
  { id: 'close_grip', axis: 'grip', when: { cc: ['HPUSH'], impl: ['barbell'], re: 'bench', not_re: 'close' } },
  { id: 'underhand_grip', axis: 'grip', when: { cc: ['HPULL'], impl: ['barbell', 'dumbbell', 'cable', 'machine'], lat: ['bilateral'], not_re: 'supinated|underhand|yates' } },
  { id: 'neutral_grip_pull', axis: 'grip', when: { cc: ['VPULL'], impl: ['cable', 'machine'], not_re: 'neutral|close|rope|single-arm|assisted', kit: ['cable_attachments'] } },
  { id: 'chin_grip', axis: 'grip', when: { cc: ['VPULL'], impl: ['bodyweight'], re: 'pull-up', not_re: 'chin|supinated|assisted|feet|ring|trx|l-sit' } },
  { id: 'hammer_grip', axis: 'grip', when: { cc: ['ISO_BICEPS'], impl: ['dumbbell'], not_re: 'hammer|cross-body|zottman' } },
  { id: 'rope_attachment', axis: 'implement', when: { cc: ['ISO_TRICEPS'], impl: ['cable'], not_re: 'rope|overhead', kit: ['cable_attachments'] } },
  // stance
  { id: 'heels_elevated', axis: 'stance', when: { cc: ['BKD'], impl: ['dumbbell', 'kettlebell', 'barbell'], not_re: 'heels|box|zercher|sumo|hex|belt|safety', kit: ['weight_plate', 'step_low', 'plate_low_target'] } },
  { id: 'feet_high', axis: 'stance', when: { cc: ['BKD'], impl: ['machine'], re: 'leg-press|hack|pendulum' } },
  { id: 'feet_elevated_pushup', axis: 'stance', when: { cc: ['HPUSH'], impl: ['bodyweight'], re: 'push-up', not_re: 'decline|feet|incline|wall|kneeling', kit: ['bench', 'box', 'weight_bench'] } },
  { id: 'feet_elevated_row', axis: 'stance', when: { cc: ['HPULL', 'VPULL'], impl: ['bodyweight'], re: 'inverted-row|table-row|ring-row|trx-row', not_re: 'feet' } },
  { id: 'incline_bench', axis: 'stance', when: { cc: ['ISO_CHEST'], impl: ['dumbbell'], not_re: 'incline|decline', kit: ['weight_bench', 'bench'] } },
  // one limb at a time (machines and cables)
  { id: 'one_leg', axis: 'stance', when: { cc: ['LEG_EXTENSION', 'LEG_FLEXION', 'ISO_CALF'], impl: ['machine'], not_re: 'single-leg|seated-or-lying' } },
  { id: 'one_arm', axis: 'hand', when: { cc: ['ISO_TRICEPS', 'ISO_SIDE', 'ISO_BICEPS'], impl: ['cable'], lat: ['bilateral'], not_re: 'single-arm|one-arm|overhead' } },
  // implement
  { id: 'kettlebell', axis: 'implement', when: { cc: ['HPULL', 'BKD', 'BHD', 'UHD', 'UKD'], impl: ['dumbbell'], not_re: 'kettlebell|kb-|floor|seal|renegade|bench', kit: ['kettlebell'] } },
  { id: 'db_between_feet', axis: 'implement', when: { cc: ['DIPS'], re: 'weighted-dip' } },
  { id: 'plate_at_chest', axis: 'implement', when: { cc: ['BKD', 'LEG_EXTENSION'], impl: ['bodyweight'], re: 'sissy', kit: ['weight_plate', 'dumbbell'] } },
  // range of motion
  { id: 'front_foot_raised', axis: 'range', when: { cc: ['UKD'], re: 'split-squat|lunge', not_re: 'elevated|deficit|rfe|ffe|bulgarian|walking|lateral|side|cossack|curtsy|wall', kit: ['weight_plate', 'step_low', 'plate_low_target', 'box'], not_pain: ['knee'] } },
  { id: 'higher_box', axis: 'range', when: { cc: ['UKD'], re: 'step-up', not_pain: ['knee'] } },
  { id: 'deficit', axis: 'range', when: { cc: ['BHD', 'UHD'], re: 'deadlift|rdl', not_re: 'deficit|kickstand|staggered|alternating|good-morning|hyper', kit: ['weight_plate', 'step_low', 'plate_low_target'], not_pain: ['lower_back'] } },
  { id: 'deficit_calf', axis: 'range', when: { cc: ['ISO_CALF'], not_re: 'deficit|seated|bent-knee', kit: ['weight_plate', 'step_low', 'plate_low_target', 'box'] } },
  { id: 'hands_on_dbs', axis: 'range', when: { cc: ['HPUSH'], impl: ['bodyweight'], re: 'push-up', not_re: 'deficit|hands-elevated|incline|wall|kneeling|offset|diamond', kit: ['dumbbell', 'weight_plate'] } },
  { id: 'behind_head', axis: 'range', when: { cc: ['ISO_TRICEPS'], re: 'skullcrusher' } },
  { id: 'pause_bottom', axis: 'range', when: { cc: ['BKD', 'HPUSH', 'VPUSH', 'DIPS', 'UKD'], not_re: 'push-press|push-jerk|thruster|jump|box-squat|pause' } },
  { id: 'pause_top', axis: 'range', when: { cc: ['HPULL', 'VPULL', 'GLUTE_ISO', 'LEG_EXTENSION', 'LEG_FLEXION', 'ISO_BICEPS', 'ISO_REAR', 'FACEPULL', 'ISO_SIDE', 'ISO_FRONT', 'ISO_CHEST', 'ISO_TRICEPS', 'ISO_CALF', 'BHD', 'UHD'], not_re: 'nordic|good-morning|pause|deadlift' } },
  { id: 'pause_knee', axis: 'range', when: { cc: ['BHD', 'UHD'], re: 'deadlift|rdl', not_re: 'pause|good-morning' } }
];

/**
 * B3 rule amendments (after amendRulesB2 in both builds).
 * @param {object} rules @returns {object}
 */
export function amendRulesB3(rules) {
  const R = clone(rules);
  const S = R.selection;

  // ---- records that name no implement or two exercises are swaps, never the pick (FIX-03 / FIX-04; RECHECK 01 / 06 / 08):
  // 'Hip Thrust or Glute Bridge (either)', 'Box Squat - any variation ... (Deload ...)', the inferred barbell alternating deadlift,
  // the 'seated or lying' leg curl that duplicates both real records
  S.generic_id_patterns = [...S.generic_id_patterns, '-either$', 'any-variation', 'barbell-deadlift-alternate-lead-leg-meaning-inferred$', 'seated-or-lying$', '-verify$', 'typo-ambiguous'];

  // ---- block-to-block changes (COACH-R2 R2-LIB-01, COACH-ANSWER PER-02; RECHECK 05 / 06 / 07 majors 'different implement /
  // grip / stance' placeholders, 02 minor 'weighted pull-up -> close-grip pulldown', 06 major 'strict press -> push jerk')
  S.block_change = {
    ...S.block_change,
    one_detail: true,                 // a library alternative that differs in one detail (implement, grip, position, laterality)
    max_distance: 2,                  // ... or two at most (PER-02 'one or two ... never all at once')
    no_return_to_earlier_pick: true,  // block 3 never goes back to block 1's pick (RECHECK 07 / 08 minors 'A-B-A')
    never_olympic_tag: true,          // an Olympic-tagged lift (push press, jerk) is never a strength-slot change (RECHECK 06 major)
    constraint_up_max_l2_l3: 1,       // L2 / L3: never a step down to a much more guided machine (RECHECK 02 minor)
    week_unique: true,                // a changed pick never repeats an exercise the week already holds (RECHECK 03 / 05 / 06 minors)
    concrete_detail_only: true,       // a detail variation always names its value; no value -> the exercise stays as it is
    status: 'one-detail rule COACH-R2 R2-LIB-01 / COACH-ANSWER PER-02; distance scoring and vocabulary PROPOSED (B3)'
  };
  S.variations = { values: VARIATIONS, refs: ['R2-LIB-01', 'PER-02'], status: 'PROPOSED vocabulary (B3): the coach approved the rule, not each value' };

  // ---- one session never holds two versions of the same exercise (RECHECK 01 / 03 majors: seated + bent-over reverse fly
  // supersetted, DB floor press + alternating DB floor press). Same movement, same implement, same credit class, differing only
  // in a trivial position / grip token = one exercise (INFERRED from R2-SES-05 '2-4 different exercises')
  S.near_duplicate = {
    scope: 'day', week_scope_kinds: ['isolation', 'focus'],
    trivial_tokens: ['seated', 'standing', 'bent-over', 'chest-to-thighs', 'alternating', 'single-arm', 'one-arm', 'kneeling', 'half-kneeling', 'tall-kneeling', 'seesaw', 'supinated', 'pronated', 'palms-up', 'overhand', 'underhand', 'neutral', 'hammer', 'wide', 'close', 'mag', 'grip'],
    refs: ['R2-SES-05', 'PER-04'], status: 'INFERRED (B3)'
  };

  // ---- the day's lead chest press is a two-arm bench (or floor) press, never alternating / one-arm / a push-up while a bench press
  // passes the kit; a floor press only when no bench press does (RECHECK 03 / 04 / 05 / 06: alternating DB floor press as the
  // lead chest lift); powerlifting-style clients press with both arms (RECHECK 07 major, VOL-12)
  S.lead_press = { buckets: ['RP_HPUSH'], avoid_re: 'alternating|seesaw|single-arm|one-arm|offset|staggered', floor_re: 'floor-press|push-up', penalty: -6, floor_penalty: -4, refs: ['ORD-07', 'CAT-13'], status: 'INFERRED (B3)' };
  S.powerlifting_presses = { lift_style: 'heavy_powerlifting', buckets: ['RP_HPUSH', 'RP_VPUSH'], avoid_re: 'alternating|seesaw|single-arm|one-arm|offset', penalty: -4, refs: ['VOL-12', 'UNI-02'], status: 'INFERRED (B3)' };
  // L1, 50+ and pain clients collect volume with dumbbells, kettlebells and machines first (EQ-03 / EQ-09; RECHECK 08 major:
  // a barbell alternating deadlift for a 52-year-old L1 with knee pain)
  S.barbell_l1_50_pain = { penalty: -4, from_age: 50, levels: ['L1'], refs: ['EQ-03', 'EQ-09', 'UNI-08'], status: 'INFERRED (B3)' };
  // home substitutes (floor Y / T, table row, bodyweight calf raise, DB leg extension on a box) only when no loaded or machine
  // version of the slot passes the kit (R2-LIB-07 'for home clients'; RECHECK 02 / 03 / 05 / 06 / 07 minors)
  S.home_substitute_only_when_needed = true;
  // feet-supported / assisted pull-ups are regressions, not the pick for a trained lifter (RECHECK 01 minor)
  S.assisted_id_re = 'assisted|feet-supported|feet-on-the-floor';
  // core: every core exercise once a week (main + optional days), swaps in the same plane (RECHECK 02 / 06 / 08)
  S.core_week_unique = true;
  S.core_swaps_same_plane = true;
  // the low-back rotation hot spot (racket players): no loaded flexion-rotation, anti-rotation first (RECHECK 08 major)
  S.hotspots = { ...S.hotspots, LOW_BACK_ROTATIONAL: { avoid_tags: [], avoid_id_patterns: ['russian-twist', 'sit-up', 'v-up', 'woodchop', 'oblique-rotation'], prefer_tags: [], prefer_id_patterns: ['pallof', 'suitcase', 'side-plank', 'dead-bug', 'bird-dog', 'plank'] } };
  // pain-area id penalties: the long-lever Copenhagen plank loads the inside of the knee (RECHECK 08 major)
  S.pain_avoid_id_patterns = { knee: ['^copenhagen-plank$'] };
  // the canonical work lift on the axial station for class-model, strength and physique clients: a front / high-bar back squat and a
  // conventional / sumo / hex-bar deadlift (the Zercher, box squats and RDL variants are swaps or second lifts; RECHECK 04 minor
  // 'Zercher as the class's work squat', 06 major 'box squat - any variation', 07 minor 'a max test on a stiff-leg deadlift')
  S.class_work_prefer_id_patterns = { RP_BKD: ['^front-squat-barbell$', '^high-bar-back-squat$'], RP_BHD: ['^barbell-deadlift-conventional$', '^sumo-deadlift$', '^hex-trap-bar-deadlift$'] };
  // the class-model skill station rotates (RECHECK 04 minor: toes-to-bar 6 times a week for 8 weeks)
  S.skill_rotate = true;

  // ---- the racket elbow's wrist-extensor work: the catalog id of the wrist extension (the v1.2 list named ids that do not exist;
  // RECHECK 08 major 'the elbow pick is a scapular Y / T raise')
  if (R.prehab && R.prehab.preferred_by_code) R.prehab.preferred_by_code = { ...R.prehab.preferred_by_code, ELBOW_LATERAL_RACKET: ['db-wrist-extension-slow-lowering', ...(R.prehab.preferred_by_code.ELBOW_LATERAL_RACKET || [])] };

  // ---- effort (COACH-R3 R3-VOL-04: 3 RIR -> 2 -> 1-2 -> 1 + intensifiers in the last week, always inside 1-3 RIR): one intensifier
  // per training day, only in the last stairway week, on the day's last small-muscle or machine isolation exercise; never a
  // free-weight compound or a glute bridge / thrust, never calves for an Achilles hot spot (RECHECK 01 / 02 / 04 / 06 / 07 / 08)
  R.effort.intensifiers = {
    last_week_only: true, per_day: 1, kind: 'myo', also_max: false,
    eligible: 'last small-muscle (side / rear delts, biceps, triceps, calves) or machine isolation exercise of the day',
    never_credit_classes: ['GLUTE_ISO', 'BKD', 'BHD', 'UKD', 'UHD', 'HPUSH', 'VPUSH', 'HPULL', 'VPULL'],
    never_calves_hotspots: ['ACHILLES_CALF'],
    refs: ['R3-VOL-04', 'VOL-13', 'VOL-15'], status: 'COACH-R3 R3-VOL-04 (last week); one per day PROPOSED'
  };
  // circuits follow the planned effort too: 'about {rir} reps left at the bell' (RECHECK 05 major)
  R.effort.circuit_rir = { key: 'effort.circuit_rir', bodyweight_key: 'effort.circuit_rir_bw', refs: ['R2-PER-05', 'R3-VOL-04'], status: 'INFERRED (B3)' };

  // ---- reps: the pyramid is decided for the whole exercise block and never for powerlifting-style clients (RECHECK 07 major:
  // the bench flips to 12/10/8/20 the week it gets its 4th set)
  R.reps.pyramid = { ...R.reps.pyramid, never_lift_styles: ['heavy_powerlifting'], decide: 'exercise_block_peak_sets', refs: [...(R.reps.pyramid.refs || []), 'VOL-12', 'PER-02'] };
  // a pair that holds the day's work lift keeps the strength rest after the pair (RECHECK 02 / 04 minors)
  R.rest.pair_with_work_lift = 'strength';

  // ---- aerobic sessions by the client's own cardio tools, level and exercise block (RECHECK 03 / 04 majors: beginner run-walks for
  // a semi-pro, '2 Mile Run' with no running space; 08 minor: run-walk with knee pain and a bike)
  R.conditioning.aerobic_b3 = {
    // easiest -> hardest per colour (the coach's aerobic sheet, OBSERVED names; order INFERRED)
    ladder: {
      A: ['aerobic-a-blue-10x10m-sprints', 'aerobic-a-blue-15-sec-run-45-sec-walk', 'aerobic-a-blue-20-sec-run-40-sec-walk', 'aerobic-a-blue-30-sec-run-30-sec-walk', 'aerobic-a-blue-40-sec-run-20-sec-walk'],
      B: ['aerobic-b-green-1-minute-run-3-min-walk', 'aerobic-b-green-2-minute-run-4-min-walk', 'aerobic-b-green-3-minute-run-3-min-walk'],
      C: ['aerobic-c-orange-5-minute-run-30-sec-walk', 'aerobic-c-orange-8-minute-run-1-minute-walk', 'aerobic-c-orange-11-minute-run-2-min-walk', 'aerobic-c-orange-2-mile-run']
    },
    level_start: { L1: 0, L2: 1, L3: 2 },
    climb_per_exercise_block: 1,
    // the session pattern of each record (work / easy seconds, continuous, short sprints), so any cardio tool can do it
    patterns: {
      'aerobic-a-blue-10x10m-sprints': { kind: 'sprints', n: 10, m: 10, s: 8 },
      'aerobic-a-blue-15-sec-run-45-sec-walk': { kind: 'intervals', work_s: 15, easy_s: 45 },
      'aerobic-a-blue-20-sec-run-40-sec-walk': { kind: 'intervals', work_s: 20, easy_s: 40 },
      'aerobic-a-blue-30-sec-run-30-sec-walk': { kind: 'intervals', work_s: 30, easy_s: 30 },
      'aerobic-a-blue-40-sec-run-20-sec-walk': { kind: 'intervals', work_s: 40, easy_s: 20 },
      'aerobic-b-green-1-minute-run-3-min-walk': { kind: 'intervals', work_s: 60, easy_s: 180 },
      'aerobic-b-green-2-minute-run-4-min-walk': { kind: 'intervals', work_s: 120, easy_s: 240 },
      'aerobic-b-green-3-minute-run-3-min-walk': { kind: 'intervals', work_s: 180, easy_s: 180 },
      'aerobic-c-orange-5-minute-run-30-sec-walk': { kind: 'intervals', work_s: 300, easy_s: 30 },
      'aerobic-c-orange-8-minute-run-1-minute-walk': { kind: 'intervals', work_s: 480, easy_s: 60 },
      'aerobic-c-orange-11-minute-run-2-min-walk': { kind: 'intervals', work_s: 660, easy_s: 120 },
      'aerobic-c-orange-2-mile-run': { kind: 'steady' }
    },
    // the client's cardio tools (intake equipment.detail.cardio_options) name the session; lower-limb pain moves the low-impact tools
    // first and drops running when another tool exists (EQ-14 'any erg'; RECHECK 08 minor)
    modalities: ['run', 'treadmill', 'bike', 'rower', 'ski_erg'],
    impact_free: ['bike', 'rower', 'ski_erg'],
    impact_free_first_for_pain: ['knee', 'ankle_foot', 'hip_groin'],
    running: ['run', 'treadmill'],
    refs: ['ATH-07', 'EQ-14', 'R2-SES-06'], status: 'colours / minutes COACH-R2; ladder, level start, climb and modality naming PROPOSED (B3)'
  };
  // WOD stations carry a load and the format's rotation words (RECHECK 04 major 'no station has a load', 'EMOMs never say how
  // to rotate'); loads per hand / per bell by level, PROPOSED
  R.conditioning.wod = {
    ...R.conditioning.wod,
    station_loads_lb: { thruster: { L1: [15, 25], L2: [25, 35], L3: [35, 50], unit: 'dumbbells' }, swing: { L1: [18, 26], L2: [26, 35], L3: [35, 53], unit: 'kettlebell' }, carry: { L1: [25, 35], L2: [35, 50], L3: [50, 70], unit: 'dumbbells' } },
    calorie_station_generic: true
  };

  // ---- the use-at-your-own-risk line at the top of every plan links the release (COACH-R3 R3-GEN-01: 'a "use at your own risk"
  // checkbox ... terms and conditions and liability releases'; DISCLAIMER.md / DISCLAIMER.es.md are drafts for attorney review)
  R.legal = {
    disclaimer_url: { en: 'https://github.com/Blazecamp/blaze-camp-model/blob/main/DISCLAIMER.md', es: 'https://github.com/Blazecamp/blaze-camp-model/blob/main/DISCLAIMER.es.md' },
    owner: 'Lalo Vera / Blaze Camp / BFit Studios Corp.', nothing_stored: true,
    refs: ['R3-GEN-01'], status: 'COACH-R3 R3-GEN-01 approved; release text DRAFT for attorney review'
  };
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** detail words of every variation value (EN + ES PROPOSED) */
const DETAIL_WORDS = {
  opposite_hand: ['weight in the opposite hand', 'peso en la mano contraria'],
  both_hands: ['a dumbbell in each hand', 'una mancuerna en cada mano'],
  neutral_grip: ['palms facing each other (neutral grip)', 'palmas enfrentadas (agarre neutro)'],
  close_grip: ['close grip (hands shoulder-width)', 'agarre cerrado (manos al ancho de los hombros)'],
  underhand_grip: ['underhand grip (palms up)', 'agarre supino (palmas hacia arriba)'],
  neutral_grip_pull: ['close neutral grip (V-handle)', 'agarre neutro cerrado (maneral en V)'],
  chin_grip: ['palms facing you (chin-up grip)', 'palmas hacia ti (agarre de dominada supina)'],
  hammer_grip: ['palms facing each other (hammer grip)', 'palmas enfrentadas (agarre martillo)'],
  rope_attachment: ['rope attachment', 'con cuerda'],
  heels_elevated: ['heels on a small plate', 'talones sobre un disco pequeño'],
  incline_bench: ['on an incline bench', 'en banco inclinado'],
  feet_high: ['feet high on the platform', 'pies arriba en la plataforma'],
  feet_elevated_pushup: ['feet on a bench', 'pies sobre un banco'],
  feet_elevated_row: ['feet up on a box (harder)', 'pies sobre un cajón (más difícil)'],
  one_leg: ['one leg at a time', 'una pierna a la vez'],
  one_arm: ['one arm at a time', 'un brazo a la vez'],
  kettlebell: ['with kettlebells', 'con kettlebells'],
  db_between_feet: ['dumbbell held between the feet', 'mancuerna sostenida entre los pies'],
  plate_at_chest: ['holding a plate at the chest', 'sosteniendo un disco en el pecho'],
  front_foot_raised: ['front foot on a low step (more range)', 'pie delantero sobre un escalón bajo (más rango)'],
  higher_box: ['higher box (knee height)', 'cajón más alto (a la altura de la rodilla)'],
  deficit: ['standing on a plate (1-2 in deficit)', 'parado sobre un disco (déficit de 2-5 cm)'],
  deficit_calf: ['from a step (full stretch at the bottom)', 'desde un escalón (estiramiento completo abajo)'],
  hands_on_dbs: ['hands on dumbbells (deeper range)', 'manos sobre mancuernas (más rango)'],
  behind_head: ['lower to behind the head (more stretch)', 'baja detrás de la cabeza (más estiramiento)'],
  pause_bottom: ['1-second pause at the bottom', 'pausa de 1 segundo abajo'],
  pause_top: ['1-second squeeze at the top', 'aprieta 1 segundo arriba'],
  pause_knee: ['1-second pause just below the knee', 'pausa de 1 segundo justo debajo de la rodilla']
};

/** B3 words (EN + ES PROPOSED, neutral Latin American Spanish, gym term in brackets). [key]: [en, es] */
export const UI_B3 = {
  ...Object.fromEntries(Object.entries(DETAIL_WORDS).map(([id, w]) => ['detail.v.' + id, w])),
  // ---- legal line (R3-GEN-01)
  'ui.plan.own_risk_label': ['Use at your own risk.', 'Uso bajo tu propio riesgo.'],
  'ui.plan.own_risk': ['This plan is general fitness information, not medical advice. You follow it entirely at your own expense and risk, and you release Lalo Vera, Blaze Camp and BFit Studios Corp. from all liability. Stop and see a professional if something hurts.', 'Este plan es información general de acondicionamiento físico, no un consejo médico. Lo sigues por completo por tu propia cuenta y riesgo, y liberas a Lalo Vera, Blaze Camp y BFit Studios Corp. de toda responsabilidad. Detente y consulta a un profesional si algo te duele.'],
  'ui.plan.own_risk_link': ['Read the full disclaimer and release', 'Lee el aviso legal y la liberación de responsabilidad completos'],
  'ui.plan.own_risk_short': ['Use at your own risk: general fitness information, not medical advice.', 'Uso bajo tu propio riesgo: información general de acondicionamiento físico, no un consejo médico.'],
  // ---- the time check (R3-SES-02)
  'ui.plan.schedule': ['Your schedule', 'Tu horario'],
  'ui.plan.schedule_fits': ['Your {days} x {minutes}-minute schedule holds the full plan: every muscle group trained directly, 10+ weekly sets, climbing every week.', 'Tu horario de {days} x {minutes} minutos alcanza para el plan completo: cada grupo muscular entrenado directamente, 10+ series por semana, subiendo cada semana.'],
  'ui.plan.trained_directly': ['Trained directly (10+ sets a week, climbing): {groups}', 'Se entrenan directamente (10+ series por semana, subiendo): {groups}'],
  'ui.plan.not_trained_time': ['Not trained directly because of time: {groups}. They still get work from your compound lifts.', 'No se entrenan directamente por falta de tiempo: {groups}. Igual trabajan con tus ejercicios compuestos.'],
  'ui.plan.not_trained_credit': ['Trained through your compound lifts and sport work (no extra sets): {groups}', 'Se entrenan con tus ejercicios compuestos y el trabajo de tu deporte (sin series extra): {groups}'],
  'ui.plan.not_trained_station': ['Your main training days hold no exercise for them: {groups}', 'Tus días principales de entrenamiento no tienen un ejercicio para ellos: {groups}'],
  'ui.plan.below_floor': ['Held below 10 sets by your time (the main lift stays and climbs): {groups}', 'Se quedan por debajo de 10 series por tu tiempo (el ejercicio principal se queda y sube): {groups}'],
  'ui.plan.schedule_block': ['{block} (weeks {from}-{to})', '{block} (semanas {from}-{to})'],
  // ---- day cards (R3-SES-02: switch blocks off, add or remove exercises, supersets)
  'ui.plan.edit_day': ['You can switch off these blocks today: {blocks}. You can also add or remove exercises.', 'Hoy puedes apagar estos bloques: {blocks}. También puedes agregar o quitar ejercicios.'],
  'ui.plan.superset_suggest_line': ['Superset to save time: {pair} (about {min} min saved)', 'Superserie para ahorrar tiempo: {pair} (ahorras unos {min} min)'],
  'ui.plan.supersets_today': ['Supersets marked today keep you inside {min} min.', 'Las superseries marcadas hoy te mantienen dentro de {min} min.'],
  'rest.after_pair_minutes': ['rest {min}-{max} min after the pair', 'descansa {min}-{max} min después del par'],
  'block.short.athletic': ['jumps, throws and speed', 'saltos, lanzamientos y velocidad'],
  'block.short.power': ['power / Olympic lifts', 'potencia / olímpicos'],
  'block.short.core': ['core', 'core (abdomen)'],
  'block.short.skill': ['skill', 'técnica'],
  'block.short.conditioning': ['conditioning', 'acondicionamiento'],
  'block.short.aerobic': ['cardio', 'cardio'],
  'block.short.prehab': ['joint care', 'cuidado articular'],
  'block.short.accessories': ['accessories', 'accesorios'],
  // ---- macro views (screenshots; R2-GEN-02 'macro view')
  'ui.plan.at_a_glance': ['Your plan at a glance', 'Tu plan de un vistazo'],
  'ui.plan.col.week': ['Week', 'Semana'],
  'ui.plan.col.effort': ['Effort', 'Esfuerzo'],
  'ui.plan.col.sets': ['Sets', 'Series'],
  'ui.plan.col.work': ['Work', 'Trabajo'],
  'ui.plan.col.day': ['Day', 'Día'],
  'ui.plan.col.session': ['Session', 'Sesión'],
  'ui.plan.col.time': ['Time', 'Tiempo'],
  'ui.plan.col.groups': ['Muscle groups (exercises)', 'Grupos musculares (ejercicios)'],
  'ui.plan.col.exercise': ['Exercise', 'Ejercicio'],
  'ui.plan.col.dose': ['Sets x reps', 'Series x reps'],
  'ui.plan.rir_short': ['{rir} in the tank', '{rir} en reserva'],
  'ui.plan.plus_intensifier': ['+ intensifier', '+ intensificador'],
  'ui.plan.test_mark': ['test', 'prueba'],
  'ui.plan.phase_span': ['weeks {from}-{to}: {phase}', 'semanas {from}-{to}: {phase}'],
  'ui.plan.phase_span_one': ['week {from}: {phase}', 'semana {from}: {phase}'],
  'ui.plan.weekly_sets_groups': ['Weekly sets per muscle group', 'Series semanales por grupo muscular'],
  'ui.plan.weekly_sets_groups_note': ['Counted the coach\'s way: a set counts once for its group (hips = glutes + hamstrings; shoulders = front, side and rear delts); helpers 1/4 set; jumps, throws, sprints, swings and Olympic lifts never count. "-" = not trained directly.', 'Contado a la manera del coach: una serie cuenta una vez para su grupo (cadera = glúteos + isquiotibiales; hombros = deltoides anterior, lateral y posterior); ayudantes 1/4 de serie; saltos, lanzamientos, sprints, swings y olímpicos nunca cuentan. "-" = no se entrena directamente.'],
  'ui.plan.week_glance': ['Week {n} at a glance', 'Semana {n} de un vistazo'],
  'ui.plan.day_glance': ['{day} at a glance', '{day} de un vistazo'],
  'ui.plan.work_seconds_row': ['Work per station', 'Trabajo por estación'],
  'ui.plan.circuit_climb_note': ['Your circuit sets stay the same; the work time per station climbs every week.', 'Tus series del circuito se mantienen; el tiempo de trabajo por estación sube cada semana.'],
  'ui.plan.seconds': ['{n} s', '{n} s'],
  'ui.plan.optional_short': ['optional', 'opcional'],
  // ---- effort words (COACH-R3 R3-VOL-04)
  'plan.stair_level': ['Week level: {level} of 11 (2 = the start, 11 = a little past your limits)', 'Nivel de la semana: {level} de 11 (2 = el inicio, 11 = un poco más allá de tus límites)'],
  'effort.drift': ['Planned effort across the stairway: {list}.', 'Esfuerzo planeado en la escalera: {list}.'],
  'effort.drift_intensifier': ['Week {week}: one intensifier per training day, a MYO set on the day\'s last small-muscle or machine exercise.', 'Semana {week}: un intensificador por día de entrenamiento, una serie MYO en el último ejercicio de músculo pequeño o de máquina del día.'],
  'effort.intensifier': ['Last week: one intensifier per training day (a MYO set on the day\'s last small-muscle or machine exercise)', 'Última semana: un intensificador por día de entrenamiento (una serie MYO en el último ejercicio de músculo pequeño o de máquina del día)'],
  'effort.circuit_rir': ['pick a weight you could keep moving with about {rir} reps left at the bell', 'elige un peso con el que podrías seguir con unas {rir} repeticiones de sobra al sonar la alarma'],
  'effort.circuit_rir_bw': ['pick a version (or a tempo) you could keep going with about {rir} reps left at the bell', 'elige una versión (o un ritmo) con la que podrías seguir con unas {rir} repeticiones de sobra al sonar la alarma'],
  'effort.ten': ['10 - I\'m done: the most I could do, and I made it.', '10 - Ya no puedo más: lo máximo que podía hacer, y lo logré.'],
  'load.week1_tip_circuit': ['Week 1: start a little lighter than you think', 'Semana 1: empieza un poco más ligero de lo que crees'],
  // ---- circuits
  'note.circuit_unilateral': ['One side at a time: switch sides at half time', 'Un lado a la vez: cambia de lado a la mitad del tiempo'],
  // ---- aerobic sessions named by the client's own cardio tools (EQ-14)
  'cardio.modality.run': ['run', 'carrera'],
  'cardio.modality.treadmill': ['treadmill', 'caminadora (treadmill)'],
  'cardio.modality.bike': ['bike', 'bicicleta (bike)'],
  'cardio.modality.rower': ['rower', 'remo (rower)'],
  'cardio.modality.ski_erg': ['SkiErg', 'SkiErg'],
  'cardio.modality.any': ['any cardio machine or a brisk walk', 'cualquier máquina de cardio o una caminata rápida'],
  'aerobic.session': ['{colour} · {modality}', '{colour} · {modality}'],
  'aerobic.pattern.intervals': ['{work} hard / {easy} easy, repeat', '{work} fuerte / {easy} suave, repite'],
  'aerobic.pattern.intervals_A': ['{work} fast / {easy} easy, repeat', '{work} rápido / {easy} suave, repite'],
  'aerobic.pattern.intervals_C': ['{work} steady / {easy} easy, repeat', '{work} constante / {easy} suave, repite'],
  'aerobic.pattern.run_walk': ['{work} run / {easy} walk, repeat', '{work} corriendo / {easy} caminando, repite'],
  'aerobic.pattern.steady': ['steady pace: you can still talk', 'ritmo constante: todavía puedes hablar'],
  'aerobic.pattern.sprints_run': ['{n} x {m} m sprints, walk back between them', '{n} x {m} m de sprint, regresa caminando entre cada uno'],
  'aerobic.pattern.sprints_machine': ['{n} x {s} s all-out, easy pace for about a minute between them', '{n} x {s} s a tope, ritmo suave por un minuto entre cada uno'],
  'aerobic.time_min': ['{n} min', '{n} min'],
  'aerobic.time_s': ['{n} s', '{n} s'],
  'note.cardio_options': ['Or use another of your cardio tools ({list}). Go by time, not distance.', 'O usa otra de tus opciones de cardio ({list}). Guíate por el tiempo, no por la distancia.'],
  'note.cardio_any': ['Any cardio tool works. Go by time, not distance.', 'Sirve cualquier opción de cardio. Guíate por el tiempo, no por la distancia.'],
  'ui.plan.aerobic_test': ['Test this session instead: {test}. Write down your time.', 'Haz la prueba en esta sesión: {test}. Anota tu tiempo.'],
  // ---- WODs (RECHECK 04 major)
  'wod.station.calories': ['{n} cal on the bike, rower or SkiErg', '{n} cal en bici, remo o SkiErg'],
  'wod.load.dumbbells': ['{min}-{max} lb dumbbells', 'mancuernas de {min}-{max} lb'],
  'wod.load.kettlebell': ['{min}-{max} lb kettlebell', 'kettlebell de {min}-{max} lb'],
  'wod.rotation.emom': ['One station per minute, in order; keep going round until the time is up.', 'Una estación por minuto, en orden; sigue rotando hasta que se acabe el tiempo.'],
  'wod.rotation.amrap': ['As many rounds as you can of the stations in order.', 'Tantas rondas como puedas de las estaciones en orden.'],
  'wod.rotation.for_time': ['Do the rounds as fast as you can with clean movement.', 'Haz las rondas lo más rápido que puedas con buena técnica.'],
  // ---- tests (RECHECK 01 / 02 / 03 / 04 / 05 minors)
  'ui.plan.test_item': ['Test: {test}', 'Prueba: {test}'],
  'ui.plan.test_end_body': ['End test this week: weigh in and measure on the first morning, before training', 'Prueba final esta semana: pésate y mídete la primera mañana, antes de entrenar'],
  'ui.plan.test_end_strength': ['End test this week: work up to one top set on the tested lifts, then do the planned sets', 'Prueba final esta semana: sube hasta una serie máxima en los ejercicios de prueba y luego haz las series planeadas'],
  // ---- validation notes in the client's words (RECHECK 03 / 06 / 07 minors: 'V28 ... follows the plan')
  'ui.plan.check_failed': ['Not met this time: {check}', 'No se cumple esta vez: {check}'],
  'check.failed.V28': ['Your two-leg / single-leg mix is {share}% two-leg, against about {target}% for your goal: swap a single-leg exercise for a two-leg one if you want to match it.', 'Tu mezcla de ejercicios a dos piernas / una pierna es {share}% a dos piernas, frente a cerca de {target}% para tu objetivo: cambia un ejercicio a una pierna por uno a dos piernas si quieres igualarlo.'],
  'check.failed.V29': ['Pulling sets are below pressing sets this week: add a row set if you want more balance.', 'Las series de tirón están por debajo de las de empuje esta semana: agrega una serie de remo si quieres más equilibrio.'],
  // ---- day titles built from the day's own lifts (RECHECK 02 minor 'A2 - leg press / belt squat + pull')
  'ui.plan.label_part.single_leg_squat': ['single-leg squat', 'sentadilla a una pierna'],
  'ui.plan.label_part.single_leg_hinge': ['single-leg hinge', 'bisagra a una pierna'],
  'ui.plan.day_title': ['{code} - {label}', '{code} - {label}'],
  'ui.plan.label_part.jump': ['jump', 'salto'],
  'ui.plan.label_part.medball': ['medball', 'balón medicinal'],
  'ui.plan.label_part.olympic': ['Olympic', 'olímpicos'],
  // ---- body-weight pulls without an assisted machine (RECHECK 04 minor)
  'note.bodyweight_regress_no_machine': ['Body-weight lift: if you cannot reach the reps, put your feet on a box to help, or do a ring / TRX row.', 'Ejercicio con peso corporal: si no llegas a las repeticiones, apoya los pies en un cajón para ayudarte o haz un remo en anillas / TRX.'],
  // ---- level reasons with one year (RECHECK 05 minor '1 years')
  'level.reason.exp_years_one': ['1 year of consistent training', '1 año de entrenamiento constante'],
  // ---- the coach's cardio line when the plan has no aerobic session (the sport is the cardio; RECHECK 01 minor)
  'instruction.2_sport_cardio': ['**Do steady cardio whenever you want, just don\'t overdo it... Your sport practice already counts as your cardio; max 40 min of steady on top.', '**Haz cardio continuo cuando quieras, solo no te excedas... La práctica de tu deporte ya cuenta como tu cardio; máximo 40 min continuos extra.'],
  // ---- reasons (why codes) of the B3 choices
  'why.aerobic_level': ['Aerobic session by your level, one step harder each exercise block', 'Sesión aeróbica según tu nivel, un paso más difícil en cada bloque de ejercicios'],
  'why.aerobic_low_impact': ['Low-impact cardio first because of your pain', 'Primero cardio de bajo impacto por tu dolor'],
  'why.lead_press': ['The day\'s first chest press is a two-arm press', 'El primer press de pecho del día es a dos brazos'],
  // ---- check-ins retired (COACH-R3 R3-VOL-02 'I want to take away all check-in info')
  'why.no_checkin_planned': ['The planned stairway week', 'La semana planificada de la escalera'],
  'why.pro_setting': ['Pro setting: one muscle above 30 sets', 'Ajuste Pro: un músculo por encima de 30 series'],
  // ---- season notice (RECHECK 03 minor: 'pre-season 2 weeks before the first game' was wrong)
  'warning.v6_season': ['Your season is close: the last {weeks} weeks of this plan are pre-season (more speed and power, fewer sets).', 'Tu temporada está cerca: las últimas {weeks} semanas de este plan son de pretemporada (más velocidad y potencia, menos series).'],
  // ---- WOD and equipment notices in plain words (RECHECK 04 minor: thrusters missing from the 'never counts' note; 05 minor: the
  // buy list read as if the plan held slots the client cannot do)
  'note.wod': ['WOD: nothing in the WOD counts as muscle sets (thrusters, swings, jumps, throws, wall balls)', 'WOD: nada del WOD cuenta como series musculares (thrusters, swings, saltos, lanzamientos, wall balls)'],
  'warning.v7_no_equipment': ['Optional upgrade: {items} would add more exercise options; the plan already uses what you have.', 'Mejora opcional: {items} agregaría más opciones de ejercicios; el plan ya usa lo que tienes.'],
  // ---- holidays (R2-PER-02 / COACH-R3 R3-PER-01 'holidays planned between blocks'; RECHECK 01 / 07 minors: hardest weeks and max
  // tests on Christmas / New Year with no notice)
  'ui.plan.holiday_weeks': ['Weeks {weeks} include Christmas / New Year: move a session (or a test day) by a day or two if you need to; plan longer holidays between blocks.', 'Las semanas {weeks} incluyen Navidad / Año Nuevo: mueve una sesión (o un día de prueba) uno o dos días si lo necesitas; planifica las vacaciones largas entre bloques.'],
  // ---- a superset of three (RECHECK 04 minor: a tri-set was called a 'pair')
  'rest.after_group': ['rest after the last exercise of the group', 'descansa después del último ejercicio del grupo'],
  // ---- Spanish wording of the B2 capacity notice ('del contactos de salto' did not agree; R2-GEN-08)
  'warning.athletic_capacity': ['Your sessions hold about {pct}% of your sport\'s weekly {key}: the work still climbs every week. Add a day or longer sessions for the full dose.', 'Tus sesiones permiten cerca del {pct}% del volumen semanal de tu deporte en {key}: igual sube cada semana. Agrega un día o sesiones más largas para la dosis completa.'],
  // ---- Spanish fixes (R2-GEN-08; RECHECK 03 minor: 'jalón' is the lat pulldown, a generic pull is a 'tirón')
  'ui.plan.label_part.pull': ['pull', 'tirón'],
  'program.OT03.name': ['Push / Pull / Legs', 'Empuje / Tirón / Piernas'],
  'slot.RP_HPULL': ['Horizontal pull', 'Tirón horizontal (remo)'],
  'slot.RP_VPULL': ['Vertical pull', 'Tirón vertical']
};

/** UI_B3 keys that replace an earlier string of the same key (spec copy, v1.2 or round-3 lists) */
export const B3_FINAL = ['warning.athletic_capacity', 'note.wod', 'warning.v7_no_equipment', 'plan.stair_level', 'effort.drift', 'effort.intensifier', 'effort.ten', 'why.no_checkin_planned', 'why.pro_setting', 'warning.v6_season', 'ui.plan.label_part.pull', 'program.OT03.name', 'slot.RP_HPULL', 'slot.RP_VPULL'];

/** check-in words with no use left (COACH-R3 R3-VOL-02): removed from both languages */
export const REMOVED_B3 = ['felt.couldnt', 'felt.pain', 'felt.right', 'felt.wrong', 'intake.error.week_by_week_needs_checkin'];

/**
 * Exercise names / cues the B3 review rewrites (applied after the catalog names and cues in both builds): coach-to-coach notes and
 * kit-specific clauses out of the client's cue (RECHECK 02 / 03 / 05 minors), 'Deload' out of a name (RECHECK 06 major), Spanish
 * names that used 'jalón' for an Olympic pull or 'pájaros' for a reverse fly (RECHECK 03 minor). [key]: [en | null, es | null]
 */
export const EXERCISE_TEXT_B3 = {
  'exercise.box-squat-any-variation-dead-stop-deload-sit-and-unload-on-the-box.name': ['Box Squat (dead stop on the box)', 'Sentadilla al cajón con pausa (Box Squat)'],
  'exercise.alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer.cue': ['Hold the dumbbells, take a half step back into a staggered stance and deadlift on the front leg; switch legs and keep alternating every rep. Saves time compared with finishing one side first.', 'Sostén las mancuernas, da medio paso atrás a una postura escalonada y haz el peso muerto con la pierna de adelante; cambia de pierna y alterna en cada repetición. Ahorra tiempo comparado con terminar un lado primero.'],
  'exercise.alternating-barbell-deadlift-alternate-lead-leg-meaning-inferred.cue': ['Hold the barbell, take a half step back into a staggered stance and deadlift on the front leg; switch legs and keep alternating every rep.', 'Sostén la barra, da medio paso atrás a una postura escalonada y haz el peso muerto con la pierna de adelante; cambia de pierna y alterna en cada repetición.'],
  'exercise.belt-squat-machine.cue': ['No load on your spine: a good pick on a day your back is already tired or sore.', 'Sin carga en la columna: buena opción en un día en que tu espalda ya está cansada o adolorida.'],
  'exercise.cable-lat-pullover.cue': ['Lat pull-over on a cable: arms long, pull the bar down to your thighs.', 'Pullover de dorsales en polea: brazos largos, baja la barra hasta los muslos.'],
  'exercise.fake-medball-slam-and-return-any-way-possible-upper-body-trunk-amortization-dril.cue': ['No ball needed: mimic the slam and the catch / return any way you can.', 'No necesitas balón: imita el azote y la recepción / el regreso como puedas.'],
  'exercise.ghd-glute-ham-developer-hip-extension-glute-ham-raise.cue': ['Use it if your gym has one and you feel your hamstrings and glutes doing the work.', 'Úsalo si tu gimnasio tiene uno y sientes que trabajan los isquiotibiales y los glúteos.'],
  'exercise.reverse-hyperextension.cue': ['Use it if your gym has one and you feel your glutes and hamstrings doing the work.', 'Úsalo si tu gimnasio tiene uno y sientes que trabajan los glúteos y los isquiotibiales.'],
  'exercise.high-hang-clean-pull.name': [null, 'Tirón de cargada desde colgado alto (High-Hang Clean Pull)'],
  'exercise.high-hang-snatch-pull.name': [null, 'Tirón de arranque desde colgado alto (High-Hang Snatch Pull)'],
  'exercise.mid-hang-clean-pull.name': [null, 'Tirón de cargada desde colgado medio (Mid-Hang Clean Pull)'],
  'exercise.mid-hang-snatch-pull.name': [null, 'Tirón de arranque desde colgado medio (Mid-Hang Snatch Pull)'],
  'exercise.low-hang-clean-pull.name': [null, 'Tirón de cargada desde colgado bajo (Low-Hang Clean Pull)'],
  'exercise.low-hang-snatch-pull.name': [null, 'Tirón de arranque desde colgado bajo (Low-Hang Snatch Pull)'],
  'exercise.clean-pull-start-position-not-stated.name': [null, 'Tirón de cargada (Clean Pull)'],
  'exercise.snatch-pull-start-position-not-stated.name': [null, 'Tirón de arranque (Snatch Pull)'],
  'exercise.db-kb-high-pull.name': [null, 'Tirón alto con mancuerna o kettlebell (High Pull)'],
  'exercise.cable-pull-through.name': [null, 'Extensión de cadera en polea entre las piernas (Cable Pull-Through)'],
  'exercise.sled-rope-pull-hand-over-hand.name': [null, 'Arrastre de trineo con cuerda mano sobre mano, estilo HYROX (Sled Rope Pull)'],
  'exercise.bent-over-db-reverse-fly.name': [null, 'Aperturas posteriores inclinado con mancuernas (Bent-Over Reverse Fly)'],
  'exercise.seated-chest-to-thighs-db-reverse-fly.name': [null, 'Aperturas posteriores sentado, pecho sobre los muslos (Seated Reverse Fly)']
};

/** ES day labels: a generic 'pull' is a 'tirón' (the 'jalón' is the lat pulldown); applied to every ES day.* label */
export function esDayLabelB3(s) {
  return typeof s === 'string' ? s.replace(/\bjalón\b/g, 'tirón').replace(/\bJalón\b/g, 'Tirón') : s;
}
