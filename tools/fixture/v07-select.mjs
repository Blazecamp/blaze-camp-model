// tools/fixture/v07-select.mjs - engine 0.7 work package "templates, selection, athletic progression, WODs" (coach answers round 5,
// coach_answers_round5.md, ids R5-*). Applied after the v0.6 layers (v06-volume.mjs, v06-select.mjs, v06-words.mjs) by BOTH builds
// (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/*.json keeps deep-equalling the fixture
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock), idempotent. Every value names its source:
// COACH-R5 (coach_answers_round5.md), an earlier coach answer, OBSERVED (dumps/), INFERRED or PROPOSED. Decisions:
// engine/DECISIONS.md section G (G-250 ... G-269). Tests: tests/v07-select.test.mjs.
//
// What this layer changes in the model:
//   * R5-GEN-01  2 training days = two FULL-BODY days built from his slots (templates: the 2-day A / B day types of the aesthetics,
//                athletic, bootcamp-family and no-equipment templates; skeletons gym_FB1 / gym_FB2, athletic_FB1 / athletic_FB2).
//   * R5-ATH-04  incline before overhead pressing for throwers and volleyball too, and overhead pressing kept for shoulder health
//                (rules.selection.v7.incline_overhead), the swimmer included.
//   * R5-GRD-03  jumps progress from two-leg, symmetrical and low to single-leg and higher (rules.selection.v7.jumps).
//   * R5-GRD-08  knee pain: jumps start assisted (new records, never a band - H01) and a pain-scale warning (rules.selection.v7.
//                assisted_jumps, rules.selection.v7.jump_pain_warning).
//   * R5-GRD-04  named CrossFit benchmark workouts in the class workout (rules.conditioning.v7.named_wods; PROPOSED data where not his).
//   * R5-GRD-05  the bootcamp varies its format: station by station or in rounds (rules.supersets.v7.bootcamp_format).
//   * R5-ATH-02  athletic doses may hold up to 2 weeks and reach the block's final number (rules.athletic.v7.hold).
//   * R5-CLS-02, R5-LIB-02, R5-ATH-08, R5-CLS-04: confirmations written into the data they confirm.

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniqSorted = (a) => [...new Set(a)].sort();

// ---------------------------------------------------------------------------------------------------------------------------
// exercises
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * v0.7 record amendments (after amendExerciseS6). No changes to existing records.
 * @param {object} ex0 @returns {object}
 */
export function amendExerciseV07(ex0) {
  return clone(ex0);
}

/** the assisted-jump records (COACH-R5 R5-GRD-08: 'you can start them assisted plyos'), the WOD run station (R5-GRD-04) */
export const ADDED_V07 = ['assisted-lateral-hops-holding-a-support', 'assisted-pogo-hops-holding-a-support', 'assisted-squat-jump-holding-a-support',
  'run-wod-station', 'suspension-trainer-assisted-jump-squat', 'two-foot-lateral-jump'];

/**
 * New records (R5-GRD-08 assisted jumps, approved by that answer: regular picks for a client with knee pain; R5-GRD-04 the WOD's run
 * station). Built from a record of the same kind; never a band, chain or weight releaser (H01): the support is a rack upright, a rail,
 * a counter or a suspension trainer.
 * @param {object[]} exercises @returns {object[]}
 */
export function addedExercisesV07(exercises) {
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const out = [];
  const make = (id, protoId, patch) => {
    const p = byId.get(protoId);
    if (!p || byId.has(id)) return;
    const e = clone(p);
    const ath = patch.athletic ? { ...clone(p.athletic || {}), ...patch.athletic } : (p.athletic ? clone(p.athletic) : null);
    Object.assign(e, { id, source_id: id, name_key: `exercise.${id}.name`, cue_key: null, video: null, sport_use: [], default_in_slots: [],
      status: 'live_library_selectable', rule_refs: ['R5-GRD-08'], ...patch, athletic: ath });
    e.tags = uniqSorted(patch.tags || e.tags || []);
    e.slots = uniqSorted(e.slots);
    out.push(e);
  };
  // two-leg ballistic: a squat jump holding a support (the hands take part of the landing)
  make('assisted-squat-jump-holding-a-support', 'squat-jump-high-bodyweight-or-lightly-loaded', {
    slots: ['AP_PLYO'], equipment: { any_of: [[]], machine: null }, impact: 'low', skill: 'low', older_ok: false, older_opt_in_ok: true, youth_ok: true,
    tags: ['assisted', 'pain_friendly'], variation_axes: ['range'], rep_hint: { text: '5-8 jumps', unit: 'contacts' },
    athletic: { quality: 'ballistic', contact_class: 'ballistic', rc_stage_default: 'RC1', response: 'single', low_amplitude: false, upper: false }
  });
  // two-leg low pogo hops holding a support (the ankle block's assisted start)
  make('assisted-pogo-hops-holding-a-support', 'ankle-hops-bilateral-in-place', {
    slots: ['AP_JUMP_LIMITED_KNEE', 'AP_PLYO'], equipment: { any_of: [[]], machine: null }, impact: 'low', skill: 'low',
    tags: ['ankle_hop', 'assisted', 'pain_friendly', 'plyo_repeated'], variation_axes: ['range'], rep_hint: { text: '10-20 contacts', unit: 'contacts' },
    athletic: { quality: 'plyometric', contact_class: 'plyometric', rc_stage_default: 'RC1', response: 'repeat', low_amplitude: true, upper: false }
  });
  // two-leg low side-to-side hops holding a support (a lateral sport's first jumps, R5-ATH-10 two-foot lateral)
  make('assisted-lateral-hops-holding-a-support', 'ankle-hops-bilateral-in-place', {
    slots: ['AP_JUMP_LIMITED_KNEE', 'AP_PLYO'], plane: 'frontal', equipment: { any_of: [[]], machine: null }, impact: 'low', skill: 'low',
    tags: ['ankle_hop', 'assisted', 'pain_friendly', 'plyo_repeated'], variation_axes: ['range'], rep_hint: { text: '10-20 contacts', unit: 'contacts' },
    athletic: { quality: 'plyometric', contact_class: 'plyometric', rc_stage_default: 'RC1', response: 'repeat', low_amplitude: true, upper: false }
  });
  // a jump squat holding the handles of a suspension trainer
  make('suspension-trainer-assisted-jump-squat', 'squat-jump-high-bodyweight-or-lightly-loaded', {
    slots: ['AP_PLYO'], equipment: { any_of: [['trx']], machine: null }, impact: 'low', skill: 'low', older_ok: false, older_opt_in_ok: true, youth_ok: true,
    tags: ['assisted', 'pain_friendly'], variation_axes: ['range'], rep_hint: { text: '5-8 jumps', unit: 'contacts' },
    athletic: { quality: 'ballistic', contact_class: 'ballistic', rc_stage_default: 'RC1', response: 'single', low_amplitude: false, upper: false }
  });
  // R5-ATH-10 ('in the very first weeks (landing on two feet), a two-foot lateral jump instead' - confirmed): a two-foot lateral jump for
  // a cutting sport's first exercise block (the library held two-foot lateral hops and hurdle hops, no single-response lateral jump)
  make('two-foot-lateral-jump', 'squat-jump-high-bodyweight-or-lightly-loaded', {
    slots: ['AP_PLYO'], plane: 'frontal', equipment: { any_of: [[]], machine: null }, impact: 'moderate', skill: 'low', older_ok: false, older_opt_in_ok: true, youth_ok: true,
    tags: [], variation_axes: ['range', 'stance'], rep_hint: { text: '4-8 jumps', unit: 'contacts' }, rule_refs: ['R5-ATH-10', 'R5-GRD-03'],
    athletic: { quality: 'ballistic', contact_class: 'ballistic', rc_stage_default: 'RC1', response: 'single', low_amplitude: false, upper: false }
  });
  // R5-GRD-04: the run of a named workout (Helen, Kelly, Nancy, Murph, Michael) - a WOD station only, picked by no slot
  make('run-wod-station', 'distance-repeat-400-m', {
    slots: ['COND_AEROBIC'], default_in_slots: [], equipment: { any_of: [['open_space_long'], ['treadmill']], machine: null }, tags: [], status: 'reference_only', conditioning: null,
    rep_hint: { text: '200-1600 m', unit: 'metres' }, rule_refs: ['R5-GRD-04'], older_ok: true, youth_ok: true
  });
  return out.sort((a, b) => (a.id < b.id ? -1 : 1));
}

// ---------------------------------------------------------------------------------------------------------------------------
// the named benchmark workouts (COACH-R5 R5-GRD-04: 'use the WODs that are popular in the crossfit community, girl wods once a week
// and hero wods only 1 a block, popular benchmar wods every 2-4 weeks, keep it varied')
// The standard prescriptions are the CrossFit community's published benchmark workouts; the scaling by level (L1 / L2 / L3 = scaled /
// intermediate / Rx) and the loads by level (never by sex - H13) are PROPOSED, for the coach to approve.
// A movement: ids = the Rx movement first, then its scaled options; scaled_first = the levels that take a scaled option first.
// reps / metres / calories by level; load = {unit, L1, L2, L3} in lb.
// ---------------------------------------------------------------------------------------------------------------------------
const BAR = (l1, l2, l3) => ({ unit: 'barbell', L1: l1, L2: l2, L3: l3 });
const DB = (l1, l2, l3) => ({ unit: 'dumbbells', L1: l1, L2: l2, L3: l3 });
const KB = (l1, l2, l3) => ({ unit: 'kettlebell', L1: l1, L2: l2, L3: l3 });
const MB = (l1, l2, l3) => ({ unit: 'medball', L1: l1, L2: l2, L3: l3 });
const R = (l1, l2, l3) => ({ L1: l1, L2: l2, L3: l3 });
const PULL = ['pull-up-grip-not-stated', 'jumping-pull-up', 'inverted-row'];
const PUSHUP = ['push-up', 'kneeling-push-up'];
const SQUAT = ['bodyweight-squat-air-squat'];
const RUN = ['run-wod-station', 'calorie-effort-15-cal-bike-rower-ski'];
const SCALED = ['L1', 'L2'];
const NAMED_WODS = [
  // ---- "Girl" benchmark workouts
  { id: 'fran', kind: 'girl', format: 'for_time', cap: R(10, 10, 10), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['barbell-thruster', 'db-thruster-front-squat-into-overhead-press'], scaled_first: ['L1'], reps: R('15-12-9', '21-15-9', '21-15-9'), load: BAR([35, 45], [45, 65], [65, 95]), load_scaled: DB([15, 20], [20, 30], [30, 40]) },
    { ids: PULL, scaled_first: SCALED, reps: R('15-12-9', '21-15-9', '21-15-9') }] },
  { id: 'grace', kind: 'girl', format: 'for_time', cap: R(10, 8, 8), levels: ['L2', 'L3'], movements: [
    { ids: ['power-clean-and-jerk'], reps: R(20, 30, 30), load: BAR([45, 65], [65, 95], [95, 135]) }] },
  { id: 'helen', kind: 'girl', format: 'for_time', rounds: R(2, 3, 3), cap: R(14, 15, 15), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: RUN, metres: R(200, 400, 400), calories: R(10, 20, 20) },
    { ids: ['kettlebell-swing-russian'], reps: R(15, 21, 21), load: KB([18, 26], [26, 35], [35, 53]) },
    { ids: PULL, scaled_first: SCALED, reps: R(9, 12, 12) }] },
  { id: 'cindy', kind: 'girl', format: 'amrap', cap: R(15, 20, 20), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: PULL, scaled_first: SCALED, reps: R(5, 5, 5) }, { ids: PUSHUP, scaled_first: ['L1'], reps: R(10, 10, 10) }, { ids: SQUAT, reps: R(15, 15, 15) }] },
  { id: 'annie', kind: 'girl', format: 'for_time', cap: R(12, 12, 12), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['double-unders-jump-rope', 'jump-rope'], scaled_first: ['L1'], reps: R('50-40-30-20-10', '50-40-30-20-10', '50-40-30-20-10') },
    { ids: ['sit-up'], reps: R('25-20-15-10-5', '50-40-30-20-10', '50-40-30-20-10') }] },
  { id: 'diane', kind: 'girl', format: 'for_time', cap: R(12, 10, 10), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['barbell-deadlift-conventional', 'dumbbell-deadlift'], reps: R('15-12-9', '21-15-9', '21-15-9'), load: BAR([65, 95], [95, 135], [135, 225]), load_scaled: DB([20, 30], [30, 45], [45, 60]) },
    { ids: ['handstand-push-up-wall-supported', 'pike-push-up', 'push-up', 'kneeling-push-up'], scaled_first: SCALED, reps: R('15-12-9', '21-15-9', '21-15-9') }] },
  { id: 'elizabeth', kind: 'girl', format: 'for_time', cap: R(12, 12, 12), levels: ['L2', 'L3'], movements: [
    { ids: ['clean-squat-clean', 'hang-power-clean-hang-height-not-stated'], scaled_first: ['L2'], reps: R('15-12-9', '21-15-9', '21-15-9'), load: BAR([45, 65], [65, 95], [95, 135]) },
    { ids: ['parallel-bar-dip', 'bench-dip'], scaled_first: SCALED, reps: R('15-12-9', '21-15-9', '21-15-9') }] },
  { id: 'isabel', kind: 'girl', format: 'for_time', cap: R(10, 10, 10), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['hang-power-snatch-from-the-high-hang', 'single-arm-db-snatch'], scaled_first: SCALED, reps: R(20, 30, 30), load: BAR([45, 65], [65, 95], [95, 135]), load_scaled: DB([15, 25], [25, 35], [35, 50]) }] },
  { id: 'jackie', kind: 'girl', format: 'for_time', cap: R(14, 14, 14), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['calorie-effort-15-cal-bike-rower-ski'], calories: R(30, 50, 60) },
    { ids: ['barbell-thruster', 'db-thruster-front-squat-into-overhead-press'], scaled_first: ['L1'], reps: R(30, 50, 50), load: BAR([35, 45], [45, 45], [45, 45]), load_scaled: DB([10, 15], [15, 20], [20, 25]) },
    { ids: PULL, scaled_first: SCALED, reps: R(20, 30, 30) }] },
  { id: 'karen', kind: 'girl', format: 'for_time', cap: R(10, 12, 12), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['wall-ball-medball-squat-to-target'], reps: R(75, 100, 150), load: MB([10, 14], [14, 20], [14, 20]) }] },
  { id: 'nancy', kind: 'girl', format: 'for_time', rounds: R(3, 4, 5), cap: R(18, 20, 20), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: RUN, metres: R(400, 400, 400), calories: R(20, 20, 20) },
    { ids: ['barbell-overhead-squat', 'goblet-squat-kb-db'], scaled_first: ['L1'], reps: R(15, 15, 15), load: BAR([35, 45], [45, 65], [65, 95]), load_scaled: DB([20, 30], [30, 40], [40, 50]) }] },
  { id: 'kelly', kind: 'girl', format: 'for_time', rounds: R(3, 4, 5), cap: R(25, 30, 30), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: RUN, metres: R(400, 400, 400), calories: R(20, 20, 20) },
    { ids: ['mid-box-jump-knee-height', 'step-up-forward-and-lateral'], scaled_first: ['L1'], reps: R(15, 30, 30) },
    { ids: ['wall-ball-medball-squat-to-target'], reps: R(15, 30, 30), load: MB([10, 14], [14, 20], [14, 20]) }] },
  { id: 'chelsea', kind: 'girl', format: 'emom', cap: R(15, 20, 30), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: PULL, scaled_first: SCALED, reps: R(5, 5, 5) }, { ids: PUSHUP, scaled_first: ['L1'], reps: R(10, 10, 10) }, { ids: SQUAT, reps: R(15, 15, 15) }] },
  // ---- "Hero" workouts (one a block)
  { id: 'murph', kind: 'hero', format: 'for_time', cap: R(30, 45, 60), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: RUN, metres: R(400, 800, 1600), calories: R(20, 40, 80) },
    { ids: PULL, scaled_first: SCALED, reps: R(25, 50, 100) }, { ids: PUSHUP, scaled_first: ['L1'], reps: R(50, 100, 200) }, { ids: SQUAT, reps: R(75, 150, 300) },
    { ids: RUN, metres: R(400, 800, 1600), calories: R(20, 40, 80) }] },
  { id: 'dt', kind: 'hero', format: 'for_time', rounds: R(3, 5, 5), cap: R(15, 15, 15), levels: ['L2', 'L3'], movements: [
    { ids: ['barbell-deadlift-conventional', 'dumbbell-deadlift'], reps: R(12, 12, 12), load: BAR([65, 85], [85, 115], [115, 155]), load_scaled: DB([20, 30], [30, 45], [45, 60]) },
    { ids: ['hang-power-clean-hang-height-not-stated'], reps: R(9, 9, 9), load: BAR([65, 85], [85, 115], [115, 155]) },
    { ids: ['barbell-push-jerk', 'barbell-push-press'], scaled_first: SCALED, reps: R(6, 6, 6), load: BAR([65, 85], [85, 115], [115, 155]) }] },
  { id: 'michael', kind: 'hero', format: 'for_time', rounds: R(2, 3, 3), cap: R(30, 35, 40), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: RUN, metres: R(400, 800, 800), calories: R(20, 40, 40) },
    { ids: ['45-degree-hyperextension-back-hip-extension'], reps: R(25, 50, 50) }, { ids: ['sit-up'], reps: R(25, 50, 50) }] },
  { id: 'jt', kind: 'hero', format: 'for_time', cap: R(15, 15, 15), levels: ['L2', 'L3'], movements: [
    { ids: ['handstand-push-up-wall-supported', 'pike-push-up'], scaled_first: SCALED, reps: R('15-12-9', '21-15-9', '21-15-9') },
    { ids: ['parallel-bar-dip', 'bench-dip'], scaled_first: SCALED, reps: R('15-12-9', '21-15-9', '21-15-9') },
    { ids: PUSHUP, reps: R('15-12-9', '21-15-9', '21-15-9') }] },
  // ---- other popular benchmarks (every 2-4 weeks)
  { id: 'filthy_fifty', kind: 'benchmark', format: 'for_time', cap: R(25, 30, 35), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['mid-box-jump-knee-height', 'step-up-forward-and-lateral'], scaled_first: ['L1'], reps: R(25, 50, 50) },
    { ids: ['jumping-pull-up', 'inverted-row'], reps: R(25, 50, 50) },
    { ids: ['kettlebell-swing-russian'], reps: R(25, 50, 50), load: KB([18, 26], [26, 35], [35, 53]) },
    { ids: ['walking-lunge'], reps: R(25, 50, 50) },
    { ids: ['knees-to-chest-hanging', 'sit-up'], scaled_first: ['L1'], reps: R(25, 50, 50) },
    { ids: ['barbell-push-press', 'db-push-press'], scaled_first: ['L1'], reps: R(25, 50, 50), load: BAR([35, 45], [45, 45], [45, 45]), load_scaled: DB([10, 15], [15, 20], [20, 25]) },
    { ids: ['45-degree-hyperextension-back-hip-extension'], reps: R(25, 50, 50) },
    { ids: ['wall-ball-medball-squat-to-target'], reps: R(25, 50, 50), load: MB([10, 14], [14, 20], [14, 20]) },
    { ids: ['burpees'], reps: R(25, 50, 50) },
    { ids: ['double-unders-jump-rope', 'jump-rope'], scaled_first: ['L1'], reps: R(50, 50, 50) }] },
  { id: 'the_chief', kind: 'benchmark', format: 'amrap', cap: R(11, 19, 19), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['power-clean', 'kb-squat-clean'], scaled_first: SCALED, reps: R(3, 3, 3), load: BAR([45, 65], [65, 95], [95, 135]), load_scaled: KB([18, 26], [26, 35], [35, 53]) },
    { ids: PUSHUP, scaled_first: ['L1'], reps: R(6, 6, 6) }, { ids: SQUAT, reps: R(9, 9, 9) }] },
  { id: 'death_by_burpees', kind: 'benchmark', format: 'emom', cap: R(10, 12, 15), levels: ['L1', 'L2', 'L3'], movements: [
    { ids: ['burpees'], reps: R('1, 2, 3 ...', '1, 2, 3 ...', '1, 2, 3 ...') }] }
];

/** the workouts' own names (proper names: the same in English and Spanish) */
const WOD_NAMES = { fran: 'Fran', grace: 'Grace', helen: 'Helen', cindy: 'Cindy', annie: 'Annie', diane: 'Diane', elizabeth: 'Elizabeth', isabel: 'Isabel',
  jackie: 'Jackie', karen: 'Karen', nancy: 'Nancy', kelly: 'Kelly', chelsea: 'Chelsea', murph: 'Murph', dt: 'DT', michael: 'Michael', jt: 'JT',
  filthy_fifty: 'Filthy Fifty', the_chief: 'The Chief', death_by_burpees: 'Death by Burpees' };

// ---------------------------------------------------------------------------------------------------------------------------
// rules
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * v0.7 rule amendments (after amendRulesS6).
 * @param {object} rules @returns {object}
 */
export function amendRulesV07(rules) {
  const R0 = clone(rules);
  R0.selection.v7 = {
    // R5-GEN-01 (2 days a week = two full-body days): the templates carry it (amendTemplatesV07); the skeleton ids it adds
    two_day_full_body: {
      skeletons: { gym_FB1: 'gym_A', gym_FB2: 'gym_B', athletic_FB1: 'athletic_A', athletic_FB2: 'athletic_B' },
      day1: ['RP_HPULL', 'RP_BKD', 'RP_VPUSH', 'RP_UHD'], day2: ['RP_HPUSH', 'RP_BHD', 'RP_VPULL', 'RP_UKD'],
      refs: ['R5-GEN-01', 'R4-SES-05', 'R4-SES-03', 'CH5-02', 'UNI-11'],
      status: 'approved (COACH-R5 R5-GEN-01 "two full-body days would be more beneficial"); PROPOSED: which slots go to which day (each day a knee lift with a pull and a hip lift with a push; both upper vectors and both lower patterns over the two days)'
    },
    // R5-ATH-04: incline before overhead pressing for throwers and volleyball, overhead kept for shoulder health and range
    incline_overhead: {
      profile_re: '^(baseball_|softball|rec_softball$|track_javelin$|volleyball|rec_volleyball$)',
      // the swimmer's hot spot already takes the incline press (rules.selection.x2.incline_first_hotspot_codes); the overhead keeper
      // holds for every client this rule names and for the swimmer
      keep_overhead_hotspot_codes: ['SHOULDER_SWIMMER'],
      keep_overhead: { per_week_min: 1, one_slot: 'last_exercise_block_of_the_training_block', weight: 8, not_tags: ['mid_range_push', 'push_press', 'push_jerk'], tag: 'overhead' },
      refs: ['R5-ATH-04', 'R4-LIB-03', 'R3-ATH-01'],
      status: 'approved (COACH-R5 R5-ATH-04 "we bias incline pressing for strength, but overhead pressing should be included for health"); PROPOSED: one overhead press a week (the last vertical-push slot of the week; with one such slot a week, the last exercise block of the training block) and the profiles read as throwers and volleyball'
    },
    // R5-GRD-03 (with R5-ATH-10): jumps progress from two-leg, symmetrical and low to single-leg and higher across the plan
    jumps: {
      buckets: ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'],
      // the level of a lower-body jump record (read on its laterality, tags and id):
      //   1 two-leg, low: jump rope, pogo / ankle hops, landings, low box and squat jumps
      //   2 two-leg, higher: hurdle hops, tuck jumps, depth drops and jumps, broad jumps, knee-high boxes, repeated full jumps
      //   3 easy single-leg hops (and split-stance / alternating jumps): plate hops, ankle hops, step-up jumps, single-leg box jumps
      //   4 single-leg and higher: single-leg hurdle hops, bounds, skater jumps, single-leg depth work
      high_tags: ['hurdle_hop', 'depth_jump', 'high_depth_drop', 'high_impact', 'bound'],
      high_id_re: '(^|-)(tuck|broad|mid-box|high-box|squirrel|repeat-jumps|bounding|skater|right-angle-hurdle)(-|$)',
      // the highest level an exercise block of the plan may pick: its number in the plan + 1 (block 1: two-leg; block 2: easy
      // single-leg; block 3 on: single-leg and higher); a level above it costs `over_penalty` a level
      cap_offset: 1, max_level: 4, over_penalty: -10,
      // 'single-leg hurdle hops are never a first-block pick' (hard rule)
      never_first_block_re: 'hurdle', never_first_block_tags: ['hurdle_hop'],
      refs: ['R5-GRD-03', 'R5-ATH-10', 'CAT-10', 'R2-ATH-03'],
      status: 'approved (COACH-R5 R5-GRD-03 "start with jump rope then bilateral high hops, then unilateral easy hops to then hurdle hop overs"); PROPOSED: the four levels read on the records, one level a block, the penalty weight'
    },
    // R5-GRD-08: with knee pain the jumps start assisted (holding a rail, rack or suspension trainer; never a band - H01)
    assisted_jumps: {
      pain_areas: ['knee'], tag: 'assisted', only_with_pain: true,
      // the first exercise block takes assisted jumps; the progression above then starts one block later (level 1 in block 2)
      assisted_blocks: 1, level_shift: 1, bonus: 30, other_penalty: -30,
      refs: ['R5-GRD-08', 'EQ-01', 'VOL-03'],
      status: 'approved (COACH-R5 R5-GRD-08 "when knee pain, don\'t start with bodyweight plyos, you can start them assisted plyos"); PROPOSED: one exercise block assisted, the records'
    },
    // R5-GRD-08: 'warn against plyos if pain is more than a 6 on a scale 1-10 (10 being you need a hospital)'
    jump_pain_warning: { pain_areas: ['knee', 'ankle_foot', 'hip_groin', 'lower_back'], above: 6, scale_max: 10, key: 'warning.jump_pain_scale', refs: ['R5-GRD-08'],
      status: 'approved (COACH-R5 R5-GRD-08); PROPOSED: the pain areas that read it (the ones a landing loads)' },
    refs: ['R5-GEN-01', 'R5-ATH-04', 'R5-GRD-03', 'R5-GRD-08', 'R5-ATH-10'],
    status: 'engine 0.7 selection package (coach answers round 5)'
  };
  // R5-GEN-01: the full-body skeletons are skeleton days like gym_A / gym_B (his pairing per day; the A day's first row two-arm)
  const SL = R0.selection.skeleton_laterality;
  if (SL && SL.lead_row && Array.isArray(SL.lead_row.skeletons)) SL.lead_row.skeletons = uniqSorted([...SL.lead_row.skeletons, 'gym_FB1', 'athletic_FB1']);
  const PT = R0.validation && R0.validation.v05 && R0.validation.v05.skeleton && R0.validation.v05.skeleton.partner;
  if (PT && Array.isArray(PT.skeleton_prefixes)) PT.skeleton_prefixes = uniqSorted([...PT.skeleton_prefixes, 'gym_FB1', 'gym_FB2', 'athletic_FB1', 'athletic_FB2']);
  // R5-CLS-02 (bootcamp with no pull-up bar: 'a hip thrust or bridge (hips get more work; pressing then leads pulling by one station)'):
  // the free vertical-pull station of a circuit takes a glute-dominant hip lift, on every circuit day that loses its pull-up
  const CX = R0.selection.x2 && R0.selection.x2.circuit && R0.selection.x2.circuit.stand_in;
  if (CX) CX.RP_VPULL = { bucket: 'RP_BHD', classes: ['GLUTE_ISO'], also_buckets: ['RP_UHD'], id_re: '(hip-thrust|glute-bridge|bridge)', why: 'why.circuit_free_station_hips', when: 'no_vertical_pull', not_own: true,
    refs: ['R5-CLS-02', 'OT06'], status: 'approved (COACH-R5 R5-CLS-02)' };
  // R5-LIB-02: the low-back anti-movement picks are dead bugs, bird dogs, side planks and the half-kneeling cable press-out (Pallof)
  const CP = R0.selection.x2 && R0.selection.x2.core_primary;
  if (CP && Array.isArray(CP.low_back_allow_ids)) { CP.low_back_allow_ids = uniqSorted([...CP.low_back_allow_ids, 'side-plank-elbow', 'pallof-press']); CP.low_back_status = 'approved (COACH-R5 R5-LIB-02)'; }
  // R5-ATH-08 ('only when they report low-back pain. Otherwise normal core, including rotation'): the 50+ hot-spot list is retired
  const S6C = R0.selection.s6 && R0.selection.s6.core;
  if (S6C) { S6C.hotspot_list_from_age = null; S6C.hotspot_status = 'COACH-R5 R5-ATH-08: the low-back list only with reported low-back pain, at any age (the 50+ reading of G-131 is retired)'; }
  // R5-CLS-04 (wall balls and sled pushes in the class workout, with a switch): approved
  const PE = R0.selection.addons && R0.selection.addons.primary_exceptions;
  if (Array.isArray(PE)) for (const x of PE) if (x.bucket === 'COND_WOD') { x.status = 'approved (COACH-R5 R5-CLS-04): on in the class workout; set enabled false to switch them off'; x.refs = uniqSorted([...(x.refs || []), 'R5-CLS-04']); }
  // R5-ATH-02: athletic doses may hold up to 2 weeks, as long as they reach the block's final number
  R0.athletic.v7 = {
    hold: { max_hold_weeks: 2, families: { jumps: ['plyo_contacts', 'jump_contacts'], throws: ['throws'], cuts: ['cod_cuts'], sprint: ['sprint_m'] },
      refs: ['R5-ATH-02', 'R3-VOL-04'], status: 'approved (COACH-R5 R5-ATH-02 "they may hold for up to 2 weeks, as long as they reach the block\'s final number")' },
    refs: ['R5-ATH-02']
  };
  // R5-GRD-05: the bootcamp varies its format (station by station = his 'horizontal', in rounds = his 'vertical' circuits)
  R0.supersets.v7 = {
    bootcamp_format: { families: ['fat_loss_bootcamp'], formats: ['rounds', 'stations'], split: 'alternate_days_flip_each_block',
      refs: ['R5-GRD-05', 'PRG-03'], status: 'approved (COACH-R5 R5-GRD-05 "vary bootcamp into circuit training not just horizontal set by set per muscle"); PROPOSED: the split - the week\'s circuit days alternate the two formats, and each exercise block swaps them' },
    refs: ['R5-GRD-05']
  };
  // R5-GRD-04: the class workout uses the named benchmark workouts
  R0.conditioning.v7 = {
    named_wods: {
      families: ['hybrid_crossfit'], not_variant_re: 'hyrox',
      girl_per_week: 1, hero_per_block: 1, hero_at: 0.75, benchmark_every_weeks: 3,
      // a movement the week's spine budget counts (H07: one heavy squat and one heavy hinge a week) or an Olympic lift above the
      // client's level (ATH-10) takes its scaled option, or the workout is not offered
      never_spine_classes: ['counted'], l2_plus_levels: ['L3'],
      library: NAMED_WODS.map((w) => ({ ...w, name: WOD_NAMES[w.id] })),
      refs: ['R5-GRD-04', 'PRG-10'],
      status: 'approved rule (COACH-R5 R5-GRD-04); PROPOSED: the library (standard CrossFit community prescriptions), the scaling by level, the week a Hero workout falls on (three quarters into the block) and a benchmark every 3 weeks'
    },
    refs: ['R5-GRD-04']
  };
  return R0;
}

// ---------------------------------------------------------------------------------------------------------------------------
// templates
// ---------------------------------------------------------------------------------------------------------------------------

/** the 2-day full-body skeletons (R5-GEN-01) */
const FB = { gym_A: 'gym_FB1', gym_B: 'gym_FB2', athletic_A: 'athletic_FB1', athletic_B: 'athletic_FB2' };
const FB_FAMILIES = ['aesthetics', 'athletic', 'fat_loss_bootcamp', 'no_equipment'];
const DAY1_SWAP = { RP_VPULL: 'RP_VPUSH', RP_UKD: 'RP_UHD' };
const DAY2_SWAP = { RP_VPUSH: 'RP_VPULL', RP_UHD: 'RP_UKD' };
const SLOT_NOTE = {
  RP_VPUSH: 'slot 3 of full-body day 1: a vertical push or an incline press (COACH-R5 R5-GEN-01; R4-SES-05 Day B slot 3)',
  RP_UHD: 'slot 4 of full-body day 1: a single-leg hip-dominant lift (COACH-R5 R5-GEN-01; R4-SES-05 Day B slot 4)',
  RP_VPULL: 'slot 3 of full-body day 2: a vertical pull, like a lat pulldown (COACH-R5 R5-GEN-01; R4-SES-05 Day A slot 3)',
  RP_UKD: 'slot 4 of full-body day 2: a single-leg knee-dominant lift, like a lunge (COACH-R5 R5-GEN-01; R4-SES-05 Day A slot 4)'
};

/**
 * COACH-R5 R5-GEN-01 ('Two full-body days would be more beneficial'): the 2-day templates of the families that use his A / B days are
 * two full-body days built from his slots. Day 1 keeps the A day's horizontal pull + squat pair (knee + pull) and takes the B day's
 * vertical / incline push + single-leg hinge (hip + push); day 2 keeps the B day's horizontal push + hinge pair (hip + push) and takes
 * the A day's vertical pull + lunge (knee + pull). Over the two days: both pull and both push vectors, a two-leg and a single-leg knee
 * lift and a two-leg and a single-leg hip lift. Slot 5 stays one arm exercise each day (biceps day 1, triceps day 2; CH5-02), slot 6
 * the leg extension / leg curl, the small slots as his days hold them. Station ids, ranks, pairs and the athletic block are kept.
 * @param {object} families @returns {object}
 */
export function amendTemplatesV07(families) {
  const F = clone(families);
  for (const fam of FB_FAMILIES) {
    const t = F[fam] && F[fam].days && F[fam].days['2'];
    if (!t) continue;
    const lists = [t.day_types, ...Object.values(t.variants || {}).map((v) => v.day_types)];
    for (const dts of lists) {
      const entries = Object.entries(dts || {});
      const a = entries.find(([, d]) => d.skeleton === 'gym_A' || d.skeleton === 'athletic_A');
      const b = entries.find(([, d]) => d.skeleton === 'gym_B' || d.skeleton === 'athletic_B');
      if (!a || !b) continue;
      const [an, A] = a, [bn, B] = b;
      const srcA = clone(A.stations), srcB = clone(B.stations);
      const swapIn = (own, other, swap) => own.map((st) => {
        const want = swap[st.bucket];
        if (!want) return st;
        const from = other.find((x) => x.bucket === want);
        if (!from) return st;
        return { ...clone(from), id: st.id, pair: st.pair, superset: st.superset, circuit: st.circuit, rank: st.rank, block: st.block,
          note: SLOT_NOTE[want] || from.note };
      });
      A.stations = swapIn(srcA, srcB, DAY1_SWAP);
      B.stations = swapIn(srcB, srcA, DAY2_SWAP);
      for (const [d, name] of [[A, an], [B, bn]]) {
        d.skeleton = FB[d.skeleton];
        d.full_body = true;
        d.groups = uniqSorted(d.stations.filter((s) => s.group && (/^RP_|^ISO_/.test(s.bucket))).map((s) => s.group));
        d.label = (d === A ? 'Full body 1 - squat + pull, single-leg hinge + press' : 'Full body 2 - hinge + push, lunge + pull') + (/_BW$/.test(name) ? ' (bodyweight)' : '');
      }
    }
  }
  return F;
}

/**
 * v0.7 sport-profile amendments (after amendSportS6). No profile changes.
 * @param {object} sport @returns {object}
 */
export function amendSportV07(sport) {
  return clone(sport);
}

// ---------------------------------------------------------------------------------------------------------------------------
// words (EN + ES; PROPOSED wording, neutral Latin American Spanish with the gym term in brackets - R2-GEN-08)
// ---------------------------------------------------------------------------------------------------------------------------
const FB1_EN = 'Full body 1 - squat + pull, single-leg hinge + press', FB1_ES = 'Cuerpo completo 1 - sentadilla + tirón, bisagra a una pierna + press';
const FB2_EN = 'Full body 2 - hinge + push, lunge + pull', FB2_ES = 'Cuerpo completo 2 - bisagra + empuje, zancada + tirón';
const NW = (id, name, std, stdEs) => ({ [`wod.named.${id}.std`]: [`${name}: ${std}`, `${name}: ${stdEs}`] });

/** v0.7 words: key -> [EN, ES]. Every key wins over the earlier layers. */
export const UI_V07 = {
  // R5-GEN-01 day titles
  'day.aesthetics.2.A': [FB1_EN, FB1_ES], 'day.aesthetics.2.B': [FB2_EN, FB2_ES],
  'day.athletic.2.A': [FB1_EN, FB1_ES], 'day.athletic.2.B': [FB2_EN, FB2_ES],
  'day.athletic.2.in_season.IS_A': ['In-season full body 1 - sprint / jumps + squat + pull, single-leg hinge + press', 'Cuerpo completo 1 en temporada - sprint / saltos + sentadilla + tirón, bisagra a una pierna + press'],
  'day.athletic.2.in_season.IS_B': ['In-season full body 2 - jumps + light hinge + push, lunge + pull', 'Cuerpo completo 2 en temporada - saltos + bisagra ligera + empuje, zancada + tirón'],
  'day.fat_loss_bootcamp.2.A': [FB1_EN, FB1_ES], 'day.fat_loss_bootcamp.2.B': [FB2_EN, FB2_ES],
  'day.no_equipment.2.A_BW': [FB1_EN + ' (bodyweight)', FB1_ES + ' (peso corporal)'], 'day.no_equipment.2.B_BW': [FB2_EN + ' (bodyweight)', FB2_ES + ' (peso corporal)'],
  'why.two_day_full_body': ['Two training days a week: each day trains your whole body (a squat with a pull, a hinge with a press)', 'Dos días de entrenamiento por semana: cada día entrena todo el cuerpo (una sentadilla con un tirón, una bisagra con un press)'],
  // R5-ATH-04
  'why.overhead_for_health': ['One overhead press a week stays in your plan: incline pressing builds the strength, overhead pressing keeps your reach and shoulder range', 'Un press por encima de la cabeza a la semana se queda en tu plan: el press inclinado construye la fuerza y el press por encima de la cabeza mantiene tu alcance y el rango del hombro'],
  // R5-GRD-03
  'why.jump_progression': ['Jumps build up across the plan: two feet and low first, then higher, then one leg', 'Los saltos progresan a lo largo del plan: primero con dos pies y bajos, luego más altos y después a una pierna'],
  // R5-GRD-08
  'why.assisted_jump': ['Knee pain: your jumps start assisted, holding a support, before body-weight jumps', 'Dolor de rodilla: tus saltos empiezan asistidos, sujetándote de un apoyo, antes de los saltos con tu peso corporal'],
  'warning.jump_pain_scale': ['Jumps and pain: skip the jumps on any day your pain is above 6 on a scale of 1 to 10 (10 = you need a hospital), and see a professional if it stays there.', 'Saltos y dolor: no hagas los saltos ningún día en que tu dolor esté por encima de 6 en una escala del 1 al 10 (10 = necesitas ir al hospital), y consulta a un profesional si se mantiene así.'],
  'exercise.assisted-squat-jump-holding-a-support.name': ['Assisted Squat Jump (holding a rack, rail or counter)', 'Salto en sentadilla asistido, sujetándote de un rack, barandal o mueble (Assisted Squat Jump)'],
  'exercise.assisted-pogo-hops-holding-a-support.name': ['Assisted Pogo Hops (holding a rack, rail or counter)', 'Saltos de tobillo asistidos, sujetándote de un rack, barandal o mueble (Assisted Pogo Hops)'],
  'exercise.assisted-lateral-hops-holding-a-support.name': ['Assisted Side-to-Side Hops (holding a rack, rail or counter)', 'Saltos laterales asistidos, sujetándote de un rack, barandal o mueble (Assisted Lateral Hops)'],
  'exercise.suspension-trainer-assisted-jump-squat.name': ['Suspension Trainer Assisted Jump Squat', 'Salto en sentadilla asistido con suspensión (TRX Assisted Jump Squat)'],
  'exercise.run-wod-station.name': ['Run', 'Carrera (Run)'],
  'exercise.two-foot-lateral-jump.name': ['Two-Foot Lateral Jump (side to side over a line or a low hurdle)', 'Salto lateral con dos pies, de lado a lado sobre una línea o una valla baja (Lateral Jump)'],
  // R5-CLS-02
  'why.circuit_free_station_hips': ['No pull-up bar: this station is a hip thrust or glute bridge, so your hips get more work and pressing leads pulling by one station today', 'Sin barra de dominadas: esta estación es un empuje de cadera o un puente de glúteo, así tus caderas trabajan más y el empuje lleva una estación más que el tirón hoy'],
  // R5-GRD-05
  'ui.plan.circuit_dose_rounds': ['In rounds: go through every station once, rest, and repeat - {rounds} rounds · {work_s} s work · {transition_s} s to change', 'En vueltas: pasa por todas las estaciones una vez, descansa y repite - {rounds} vueltas · {work_s} s de trabajo · {transition_s} s para cambiar'],
  'ui.plan.circuit_dose_stations': ['Station by station: do all {rounds} sets of a station ({work_s} s work, {transition_s} s rest between sets), then move to the next one', 'Estación por estación: haz las {rounds} series de una estación ({work_s} s de trabajo, {transition_s} s de descanso entre series) y luego pasa a la siguiente'],
  'note.circuit_stations': ['Station by station: {rounds} sets of {work_s} s with {transition_s} s of rest between sets, then the next station', 'Estación por estación: {rounds} series de {work_s} s con {transition_s} s de descanso entre series, luego la siguiente estación'],
  'why.bootcamp_format': ['Your bootcamp mixes two formats: some days in rounds through all the stations, some days station by station', 'Tu bootcamp mezcla dos formatos: algunos días en vueltas por todas las estaciones y otros estación por estación'],
  // R5-GRD-04
  'note.wod_named_girl': ['Today\'s WOD is "{name}", a "Girl" benchmark workout from the CrossFit community, scaled for you. Write down your time or rounds: you will meet it again.', 'El WOD de hoy es "{name}", un entrenamiento de referencia "Girl" de la comunidad CrossFit, adaptado para ti. Anota tu tiempo o tus rondas: lo volverás a hacer.'],
  'note.wod_named_hero': ['Today\'s WOD is "{name}", a "Hero" workout from the CrossFit community (one a block), scaled for you. Pace it; split the reps as you need.', 'El WOD de hoy es "{name}", un entrenamiento "Hero" de la comunidad CrossFit (uno por bloque), adaptado para ti. Dosifícalo y divide las repeticiones como necesites.'],
  'note.wod_named_benchmark': ['Today\'s WOD is "{name}", a popular benchmark workout from the CrossFit community, scaled for you. Write down your result.', 'El WOD de hoy es "{name}", un entrenamiento de referencia popular de la comunidad CrossFit, adaptado para ti. Anota tu resultado.'],
  'note.wod_named_scaled': ['Scaled for a class member: the reps, the loads and the movement options are set for your level; choose the harder version when it is easy.', 'Adaptado para alguien de la clase: las repeticiones, los pesos y las opciones de movimiento están ajustados a tu nivel; elige la versión más difícil cuando te resulte fácil.'],
  'why.wod_named': ['A named benchmark workout (Girl once a week, Hero once a block, another benchmark every few weeks)', 'Un entrenamiento de referencia con nombre (Girl una vez por semana, Hero una vez por bloque, otro de referencia cada pocas semanas)'],
  ...NW('fran', 'Fran', 'the standard is 21-15-9 reps of barbell thrusters and pull-ups, for time.', 'el estándar es 21-15-9 repeticiones de thrusters con barra y dominadas, por tiempo.'),
  ...NW('grace', 'Grace', 'the standard is 30 clean and jerks, for time.', 'el estándar es 30 cargadas y envión (clean and jerk), por tiempo.'),
  ...NW('helen', 'Helen', 'the standard is 3 rounds of a 400 m run, 21 kettlebell swings and 12 pull-ups, for time.', 'el estándar es 3 rondas de 400 m de carrera, 21 swings con kettlebell y 12 dominadas, por tiempo.'),
  ...NW('cindy', 'Cindy', 'the standard is as many rounds as possible in 20 minutes of 5 pull-ups, 10 push-ups and 15 air squats.', 'el estándar es tantas rondas como puedas en 20 minutos de 5 dominadas, 10 lagartijas y 15 sentadillas.'),
  ...NW('annie', 'Annie', 'the standard is 50-40-30-20-10 reps of double-unders and sit-ups, for time.', 'el estándar es 50-40-30-20-10 repeticiones de dobles con cuerda y abdominales, por tiempo.'),
  ...NW('diane', 'Diane', 'the standard is 21-15-9 reps of deadlifts and handstand push-ups, for time.', 'el estándar es 21-15-9 repeticiones de peso muerto y flexiones en parada de manos, por tiempo.'),
  ...NW('elizabeth', 'Elizabeth', 'the standard is 21-15-9 reps of squat cleans and ring dips, for time.', 'el estándar es 21-15-9 repeticiones de cargadas con sentadilla y fondos, por tiempo.'),
  ...NW('isabel', 'Isabel', 'the standard is 30 barbell snatches, for time.', 'el estándar es 30 arranques con barra, por tiempo.'),
  ...NW('jackie', 'Jackie', 'the standard is a 1000 m row, 50 thrusters with an empty bar and 30 pull-ups, for time.', 'el estándar es 1000 m de remo, 50 thrusters con la barra sola y 30 dominadas, por tiempo.'),
  ...NW('karen', 'Karen', 'the standard is 150 wall-ball shots, for time.', 'el estándar es 150 lanzamientos de balón a la pared (wall balls), por tiempo.'),
  ...NW('nancy', 'Nancy', 'the standard is 5 rounds of a 400 m run and 15 overhead squats, for time.', 'el estándar es 5 rondas de 400 m de carrera y 15 sentadillas por encima de la cabeza, por tiempo.'),
  ...NW('kelly', 'Kelly', 'the standard is 5 rounds of a 400 m run, 30 box jumps and 30 wall-ball shots, for time.', 'el estándar es 5 rondas de 400 m de carrera, 30 saltos al cajón y 30 wall balls, por tiempo.'),
  ...NW('chelsea', 'Chelsea', 'the standard is 5 pull-ups, 10 push-ups and 15 air squats every minute on the minute for 30 minutes.', 'el estándar es 5 dominadas, 10 lagartijas y 15 sentadillas cada minuto durante 30 minutos.'),
  ...NW('murph', 'Murph', 'the standard is a 1-mile run, 100 pull-ups, 200 push-ups, 300 air squats and another 1-mile run, for time (split the reps as you need).', 'el estándar es 1 milla de carrera, 100 dominadas, 200 lagartijas, 300 sentadillas y otra milla de carrera, por tiempo (divide las repeticiones como necesites).'),
  ...NW('dt', 'DT', 'the standard is 5 rounds of 12 deadlifts, 9 hang power cleans and 6 push jerks with one barbell, for time.', 'el estándar es 5 rondas de 12 pesos muertos, 9 cargadas de potencia colgantes y 6 envíos (push jerk) con una barra, por tiempo.'),
  ...NW('michael', 'Michael', 'the standard is 3 rounds of an 800 m run, 50 back extensions and 50 sit-ups, for time.', 'el estándar es 3 rondas de 800 m de carrera, 50 extensiones de espalda y 50 abdominales, por tiempo.'),
  ...NW('jt', 'JT', 'the standard is 21-15-9 reps of handstand push-ups, ring dips and push-ups, for time.', 'el estándar es 21-15-9 repeticiones de flexiones en parada de manos, fondos en anillas y lagartijas, por tiempo.'),
  ...NW('filthy_fifty', 'Filthy Fifty', 'the standard is 50 reps each of box jumps, jumping pull-ups, kettlebell swings, walking lunges, knees-to-elbows, push presses, back extensions, wall balls, burpees and double-unders, for time.', 'el estándar es 50 repeticiones de cada uno: saltos al cajón, dominadas con salto, swings con kettlebell, zancadas caminando, rodillas a los codos, push press, extensiones de espalda, wall balls, burpees y dobles con cuerda, por tiempo.'),
  ...NW('the_chief', 'The Chief', 'the standard is 5 cycles of a 3-minute AMRAP of 3 power cleans, 6 push-ups and 9 air squats, with 1 minute of rest between cycles.', 'el estándar es 5 ciclos de un AMRAP de 3 minutos de 3 cargadas de potencia, 6 lagartijas y 9 sentadillas, con 1 minuto de descanso entre ciclos.'),
  ...NW('death_by_burpees', 'Death by Burpees', 'the standard is 1 burpee in minute 1, 2 in minute 2, 3 in minute 3 ... until you cannot finish the minute\'s reps.', 'el estándar es 1 burpee en el minuto 1, 2 en el minuto 2, 3 en el minuto 3 ... hasta que no completes las repeticiones del minuto.')
};
