// tools/fixture/athletic-b2.mjs - model 1.3.0, engine stage B2 (athletic work). Applied after the v1.2 review amendments
// (review-v12.mjs) and the round-3 rule amendments (round3.mjs) by BOTH builds (tools/fixture/build-fixture.mjs and
// tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules (tests/compile.test.mjs). Pure functions
// of their input (deterministic, no clock). Every value names its source: COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED,
// INFERRED or PROPOSED.
//
// What B2 changes in the model (engine/DECISIONS.md section E, E-26 ... ; samples/REVIEW_LOG.md v0.4 stage B2):
//   * catalog: every contact drill says how it is done - `athletic.response` landing | single | repeat (R2-ATH-02, R2-ATH-03:
//     a depth jump is ONE reactive rebound, never a 'repeat' drill); upper-body plyos and low-amplitude ankle work are named;
//     American-football route drills are football-only (`athletic.sport_only`); sprint drills carry their kind (acceleration /
//     max velocity / technique drill, LIB-21)
//   * profiles: the sprint focus of the 04 profile (accelerations / max velocity / both)
//   * rules: Receive-Create stages snap to exercise blocks, the share-based contact split, the capacity-scaled athletic stairway,
//     first reactive exposures, Olympic climb, sport-only COD drills, sprint distances, R3-ATH-01 / 02 / 05 defaults

const clone = (o) => JSON.parse(JSON.stringify(o));

// ---------------------------------------------------------------------------------------------------------------- catalog

// 'land & go' drills: one landing, one rebound per rep (R2-ATH-03 stage 2 'Land & Go'); never a continuous 'repeat'
const LAND_AND_GO_RE = /^(depth-drop-to-box-jump|drop-bilateral-and-hop|drop-and-double-bounce|double-bounce-|hurdle-hops-into-box-jump|single-leg-hops-into-single-leg-box-jump|bilateral-weighted-drop|unilateral-weighted-drop|weighted-depth-jump)/;
// ballistic drills done as a continuous series (switch / repeated loaded jumps), INFERRED from the record names
const REPEAT_BALLISTIC_IDS = ['db-repeated-squat-jumps', 'db-staggered-stance-switch-jump', 'rfe-lunge-jumps-suitcase-db'];
const UPPER_PLYO_RE = /(push-up|pushup|clap|medball-slam)/;
const LOW_AMPLITUDE_RE = /(pogo|jump-rope|double-unders|quick-feet|toe-taps)/;
// American-football receiver routes (dig / out, slant, post / corner, fade, flat, comeback / curl, route tree): football drills
// (RECHECK 03 major 'football routes for a soccer midfielder'); a fade is a straight release with no cut (no COD cuts)
const ROUTE_RE = /(^|-)(route|route-tree)(-|$)/;
export const ROUTE_SPORTS = ['american_football', 'flag_football'];

/**
 * B2 catalog amendments (after amendExercise of review-v12.mjs).
 * @param {object} ex ExerciseRecord @returns {object}
 */
export function amendExerciseB2(ex) {
  if (!ex || !ex.athletic) return ex;
  const e = clone(ex);
  const a = { ...e.athletic };
  const tags = new Set(e.tags || []);
  const slots = e.slots || [];
  // every athletic record carries the same six B2 fields, in this order (tools/check-model.mjs ATH_KEYS, CONTRACTS §3.2)
  const b2 = { response: null, upper: false, low_amplitude: false, sport_only: null, no_cuts: false, sprint_kind: null };
  const contact = a.count_unit === 'contacts' || slots.some(s => s === 'AP_PLYO' || s === 'AP_JUMP_LIMITED_KNEE');
  if (contact) {
    let response;
    if (a.quality === 'landing') response = 'landing';
    else if (tags.has('depth_jump') || LAND_AND_GO_RE.test(e.id)) response = 'single';
    else if (a.quality === 'ballistic') response = REPEAT_BALLISTIC_IDS.includes(e.id) ? 'repeat' : 'single';
    else response = tags.has('plyo_repeated') ? 'repeat' : 'single';
    b2.response = response;
    // a depth jump / drop-and-go is a single-response plyometric (R2-ATH-02 / R2-ATH-03; RECHECK 02 major 'single-response depth
    // jumps carry the RC3 repeat cue'): Receive-Create stage 2, never the stage-3 'repeat' drill
    if (response === 'single' && a.quality === 'plyometric') { tags.delete('plyo_repeated'); a.rc_stage_default = 'RC2'; }
    b2.upper = tags.has('push_up_floor') || UPPER_PLYO_RE.test(e.id);
    // low-amplitude, in-place ankle / pogo work (bone loading, Achilles; the 'JUMPING ANKLE' track): plyometric (R2-ATH-02
    // 'pogo and ankle hops') at every stage, cued as quick continuous contacts
    b2.low_amplitude = response === 'repeat' && (tags.has('ankle_hop') || LOW_AMPLITUDE_RE.test(e.id));
  }
  if (slots.includes('AP_COD')) {
    if (ROUTE_RE.test(e.id)) b2.sport_only = ROUTE_SPORTS.slice();
    if (e.id === 'fade-route') b2.no_cuts = true;
  }
  if (slots.includes('AP_SPRINT')) {
    b2.sprint_kind = /accel|falling-start/.test(e.id) ? 'acceleration'
      : /max-velocity|top-speed/.test(e.id) ? 'max_velocity'
        : /a-march|a-skip|a-runs|mach-|high-knee/.test(e.id) ? 'drill' : 'run';
  }
  e.athletic = { ...a, ...b2 };
  e.tags = [...tags].sort();
  return e;
}

// ---------------------------------------------------------------------------------------------------------------- profiles

/**
 * B2 profile amendments (after amendSport of review-v12.mjs): the sprint focus of the 04 profile (`sprint.focus` text).
 * @param {object} norm SportDef @param {object} src the 04 v1.1 profile @returns {object}
 */
export function amendSportB2(norm, src) {
  const s = clone(norm);
  const f = String((src && src.sprint && src.sprint.focus) || '').toLowerCase();
  const accel = /accel|start|first step|burst|get-off|off the line|0-\d+ ?(yd|m)|home-to-first|escape/.test(f);
  const maxv = /max velocity|max-velocity|flying|top speed|breakaway|scramble|20-40/.test(f);
  s.sprint_focus = accel && maxv ? 'both' : accel ? 'acceleration' : maxv ? 'max_velocity' : null;
  // COACH-R3 R3-ATH-03 (approved): the HYROX plan (athletic.4 variant hyrox)
  if (s.sport === 'hyrox') s.template_hint = { family: 'athletic', variant: 'hyrox' };
  // COACH-R3 R3-ATH-02 (approved): the profile's 50+ note ('no depth jumps, hurdle hops or bounds by default at 50-59') applies
  // from 50 only and lifts with the racket impact switch (prefs.racket_50_impact_opt_in) - v1.2 read it into the profile's own
  // exclusions for every age
  if (s.plyo_rules && src) {
    const plyo = src.plyo || {};
    const tagsOf = (txt) => {
      const out = [];
      if (/no depth jumps/i.test(txt)) out.push('depth_jump', 'high_depth_drop');
      if (/hurdle hops/i.test(txt) && /no [^.;]*hurdle hops/i.test(txt)) out.push('hurdle_hop');
      if (/no [^.;]*bounds/i.test(txt)) out.push('bound');
      return out;
    };
    const base = tagsOf([plyo.v1_1_verification_note, plyo.notes].filter(Boolean).join(' '));
    const age = tagsOf(String((src.age_50_plus && src.age_50_plus.plyo) || '')).filter(t => !base.includes(t));
    s.plyo_rules = { ...s.plyo_rules, exclude_tags: [...new Set(base)].sort(), exclude_tags_age_50: [...new Set(age)].sort() };
  }
  return s;
}

// ---------------------------------------------------------------------------------------------------------------- templates

/** HYROX stations (COACH-R3 R3-ATH-03: sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) */
export const HYROX_STATION_IDS = ['sled-push', 'sled-rope-pull-hand-over-hand', 'sled-drag-forward', 'burpee-broad-jump', 'wall-ball-medball-squat-to-target',
  'farmer-carry', 'sandbag-walking-lunge-bag-on-shoulders', 'skierg-calorie-sprint', 'rower-calorie-sprint', 'burpees'];

function stationFrom(base, over) {
  const out = {};
  for (const k of Object.keys(base)) out[k] = Object.prototype.hasOwnProperty.call(over, k) ? over[k] : base[k];
  return out;
}

/**
 * COACH-R3 R3-ATH-03 (approved) HYROX plan as a 4-day variant of the athletic template (`athletic.4` variant `hyrox`, picked by
 * the HYROX profiles' template hint): 2 strength days - S1 squat + pull and S2 deadlift + push (the coach's A1 / B2 athletic days)
 * each ending in a short HYROX station circuit (finisher, never a muscle set) - and 2 hybrid days - H1 run intervals (Blue) and
 * H2 a 1 km run + one station, repeated (Green). The other two of the 4 cardio sessions (Orange x 2) go on free days.
 * @param {object} families templates.families (after amendTemplates of review-v12.mjs) @returns {object}
 */
export function amendTemplatesB2(families) {
  const F = clone(families);
  const t = F.athletic && F.athletic.days && F.athletic.days['4'];
  if (!t || !t.day_types || !t.day_types.A1 || !t.day_types.B2) return F;
  const proto = t.day_types.A1.stations[0];
  const aerobicProto = (t.day_types.OPT && t.day_types.OPT.stations.find(x => x.bucket === 'COND_AEROBIC')) || proto;
  const blank = (id, bucket, role, block, extra = {}) => stationFrom(proto, { id, bucket, role, block, group: null, sets_hint: null, sets_text: null, dose_text: null, pair: null, superset: null,
    superset_below_minutes: null, circuit: null, include_from_minutes: null, axial: null, variant: null, variant_text: null, laterality_dial: false, loading: null, movable: false,
    counts_as_volume: true, condition: null, condition_text: null, older_default_excluded: false, older_default_text: null, group_label: null, pool_filter: null, rir: null, note: null, ...extra });
  const finisher = (day, n, k, variant = 'hyrox_station') => blank(`${day}.f0${k}`, 'COND_CIRCUIT', 'conditioning', 'conditioning', { sets_hint: [3, 4], variant, counts_as_volume: false,
    group_label: 'HYROX station circuit', note: `HYROX station ${k} of ${n}: short circuit finisher, not counted as muscle sets (R3-ATH-03); 40-rep / AMRAP efforts live here only` });
  const strengthDay = (src, id, label, lowerFocus, axial) => {
    const stations = src.stations.filter(x => x.bucket !== 'COND_SPRINT_BUYOUT' && x.bucket !== 'AP_COD').map(x => stationFrom(x, { id: x.id.replace(/^[A-Z0-9]+\./, id + '.') }));
    stations.push(finisher(id, 2, 1), finisher(id, 2, 2));
    return { label, label_key: `day.athletic.4.hyrox.${id}`, kind: 'main', format: 'straight', dose_text: null, lower_focus: lowerFocus, full_body: true, groups: src.groups.slice(), axial, stations };
  };
  // the hybrid days keep the legs fresh for the run: their lifting is upper body only, two exercises per group (R3-SES-01), so
  // the floor of 10 can hold on 4 days (PROPOSED: R3-ATH-03 names the run work of the hybrid days, not their lifting)
  const upper = (id, list) => list.map(([k, bucket, group, role, variant], i) => blank(`${id}.u0${i + 1}`, bucket, role, role === 'iso' ? 'accessories' : 'strength',
    { group, variant: variant || null, sets_hint: [2, 2], group_label: 'resistance', note: 'upper body on the run day (legs stay fresh)' }));
  const hybridDay = (id, label, colour, withStation, lifts, groups) => {
    const stations = [
      blank(`${id}.s01`, 'WARMUP_GENERAL', 'warmup', 'warmup', { dose_text: '5 min any cardio', counts_as_volume: false }),
      blank(`${id}.s02`, 'WARMUP_PREP', 'warmup', 'warmup', { dose_text: 'running warm-up (A march, A skip, A run)', counts_as_volume: false }),
      blank(`${id}.s03`, 'CT_CORE_THORAX', 'core_block', 'core', { sets_hint: [2, 2], movable: true }),
      blank(`${id}.s04`, 'CP_CORE_PELVIS', 'core_block', 'core', { sets_hint: [2, 2], movable: true, include_from_minutes: 45 })
    ];
    if (!withStation) stations.push(blank(`${id}.s05`, 'AP_JUMP_LIMITED_KNEE', 'athletic', 'athletic', { sets_hint: [2, 2], note: 'ankle / pogo hops: running is half the race (Achilles, calves)' }));
    stations.push(...upper(id, lifts));
    stations.push(stationFrom(aerobicProto, { id: `${id}.s06`, variant: colour, note: withStation ? 'HYROX run: 1 km run, then one station, repeated (R3-ATH-03)' : 'HYROX run intervals (R3-ATH-03)' }));
    if (withStation) stations.push(finisher(id, 1, 1, 'hyrox_run_station'));
    return { label, label_key: `day.athletic.4.hyrox.${id}`, kind: 'main', format: 'straight', dose_text: null, lower_focus: null, full_body: false, groups, axial: { squat: false, hinge: false }, stations };
  };
  t.variants = { ...t.variants, hyrox: {
    week_layout: {
      Mon: { day_type: 'S1', kind: 'main', optional: false, note: null }, Tue: { day_type: 'H1', kind: 'main', optional: false, note: null },
      Wed: { day_type: null, kind: 'off', optional: false, note: null }, Thu: { day_type: 'S2', kind: 'main', optional: false, note: null },
      Fri: { day_type: 'H2', kind: 'main', optional: false, note: null }, Sat: { day_type: null, kind: 'off', optional: false, note: null },
      Sun: { day_type: null, kind: 'off', optional: false, note: null }
    },
    day_types: {
      S1: strengthDay(t.day_types.A1, 'S1', 'S1 - squat + pull + HYROX stations', 'knee', { squat: true, hinge: false }),
      H1: hybridDay('H1', 'H1 - run intervals + upper body', 'A', false,
        [['p', 'RP_HPULL', 'back', 'paired_upper'], ['p', 'RP_VPULL', 'back', 'paired_upper'], ['p', 'RP_HPUSH', 'chest', 'paired_upper'], ['i', 'ISO_CHEST', 'chest', 'iso']], ['back', 'chest']),
      S2: strengthDay(t.day_types.B2, 'S2', 'S2 - deadlift + push + HYROX stations', 'hip', { squat: false, hinge: true }),
      H2: hybridDay('H2', 'H2 - 1 km run + station, repeated + upper body', 'B', true,
        [['p', 'RP_VPULL', 'back', 'paired_upper'], ['p', 'RP_HPULL', 'back', 'paired_upper'], ['p', 'RP_VPUSH', 'shoulders', 'paired_upper'], ['i', 'ISO_SIDE_REAR_DELT', 'shoulders', 'iso', 'side']], ['back', 'shoulders'])
    },
    evidence: 'COACH-R3 R3-ATH-03 (approved HYROX plan); strength days from the coach athletic A1 / B2 (cross pattern); station list R3-ATH-03',
    use_when: 'HYROX profiles (template hint), 4 days a week'
  } };
  return F;
}

/** the HYROX program name (templates.program_names, first match wins) */
export function amendProgramNamesB2(list) {
  return [{ when: { variant: ['hyrox'] }, id: 'OTHYX' }, ...list.filter(x => x.id !== 'OTHYX')];
}

// ---------------------------------------------------------------------------------------------------------------- rules

/**
 * B2 rule amendments (applied after amendRulesR3 in both builds).
 * @param {object} rules @returns {object}
 */
export function amendRulesB2(rules) {
  const R = clone(rules);
  const A = R.athletic;

  // ---- Receive-Create stages change only at an exercise-block boundary (PER-02 'the exercises stay for the block' +
  // R2-ATH-03 stages; RECHECK 01 / 02 / 03 / 08 majors 'jump exercises change mid-block, single-week exercises'). Each exercise
  // block takes the stage the approved week table gives most of its weeks (ties to the lower stage), one stage at a time; a
  // stairway with a single exercise block (6-7 weeks) holds its start stage, RC2 for intermediate / advanced athletes (R2-ATH-03
  // 'intermediate and advanced athletes may start at stage 2'). INFERRED (snapping), coach to confirm.
  A.stages.align_to_exercise_blocks = { rule: 'majority_of_weeks_ties_lower_one_step_at_a_time', single_block_start: { L1: 'RC1', L2: 'RC2', L3: 'RC2' },
    refs: ['R2-ATH-03', 'PER-02', 'CAT-10'], status: 'INFERRED (B2): the approved stage weeks snapped to the exercise blocks' };

  // ---- how a contact drill is cued (R2-ATH-02 / R2-ATH-03; RECHECK 01 / 02 / 03 / 08): landing = stick it (stage 1); a
  // single-response ballistic jump = one big effort, reset; a single-response plyometric (depth jump, drop & go) = land & go;
  // a low-amplitude repeat drill (ankle / pogo hops) = quick continuous contacts at every stage; a high-amplitude repeat drill =
  // stage-3 'repeat'
  A.response_cues = { landing: 'note.rc1', single_ballistic: 'note.ballistic_single', single_plyometric: 'note.rc2', repeat_low: 'note.repeat_low', repeat: 'note.rc3',
    refs: ['R2-ATH-02', 'R2-ATH-03'], status: 'PROPOSED (B2 cue words)' };
  // in stage 3 a plyometric station takes a repeated-contact drill only (never a single-response depth jump)
  A.rc3_plyometric_response = 'repeat';

  // ---- the share-based contact split (COACH-R2 R2-ATH-01 'share of jump and throw work that is plyometric by the end of a block',
  // R2-ATH-02 'pogo and ankle hops are plyometric'; COACH-R3 R3-ATH-01 swimmers 'mostly ballistic, 25 %'). The 04 weekly numbers
  // (INFERRED) give the volume: high contacts (all jumps), low contacts (ankle work) and throws; the share decides how much of it
  // is plyometric. plyometric = ankle work + reactive jumps; ballistic = the other jumps + throws. Stage 1 has no reactive jumps.
  A.split = {
    share_counts: { plyometric: ['plyo_contacts', 'low_contacts'], over: ['plyo_contacts', 'jump_contacts', 'low_contacts', 'throws'] },
    high_contacts_include_plyo: true, low_capped_by_share: true, stage1_reactive_jumps: 0,
    refs: ['R2-ATH-01', 'R2-ATH-02', 'R3-ATH-01'], status: 'INFERRED reading of the 04 numbers (B2)'
  };
  // ---- the athletic stairway (COACH-R3 R3-VOL-04 'natural algorithm recommendation of growth'; R3-SES-02 step 4 'never flat'):
  // the week's doses land on the sport targets; when the stations cannot hold a key's peak, the whole block is scaled by the same
  // factor so the work still climbs week by week; the contact / throw / cut / sprint / Olympic totals never drop inside a stairway
  // block; the end-test week holds the week before (RECHECK 02 'hold Olympic and athletic doses flat in the test week')
  A.reconcile = { ...A.reconcile, scale_to_capacity: true, climb: true, hold_end_test_week: true, unilateral_counts_both_legs: true,
    unilateral_contacts_per_leg_max_low: 15, upper_contacts_key: 'upper_contacts', climb_families: { contacts: ['plyo_contacts', 'jump_contacts', 'low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] },
    status: 'PROPOSED (v1.2 review; B2: capacity scaling, climb, test-week hold, both legs counted)' };

  // ---- first reactive exposures (CAT-10 'start ballistic, then slowly and gradually more plyometric; unilateral is harder';
  // R2-ATH-03; RECHECK 02 major 'a single-leg depth jump as the first reactive rep for a 230-lb linebacker'): the first stage-2
  // exercise block takes bilateral, unloaded, low-box land & go only; heavy athletes (>= 220 lb) and beginners hold one
  // depth-jump station a week, others two; single-leg reactive work only after one bilateral stage-2 block; the first exercise
  // block of a training block lands on two feet (RECHECK 01 minor 'single-leg / weighted depth drop in week 1')
  A.first_reactive = { bilateral_first_stage_block: true, unloaded_first_stage_block: true, drop_height_first: 'low', heavy_bw_lb: 220,
    depth_jump_max_wk: 2, depth_jump_max_wk_heavy_or_l1: 1, single_leg_reactive_after_bilateral_block: true, first_block_bilateral_landing: true,
    refs: ['CAT-10', 'R2-ATH-03'], status: 'INFERRED thresholds (B2), coach to confirm' };

  // ---- general-population timed circuits stay athletic (RECHECK 05 major: 'zero ballistic, throw or jump work although the client
  // owns medballs, a slam ball and kettlebells'; the general_population profile asks for 20-40 medball throws a week): up to two
  // metabolic circuit stations a week become ballistic stations - a medball slam / throw or a KB swing (never a muscle set,
  // R2-VOL-05; ball <= 20 lb); a timed throw station counts one throw per `throw_seconds` of work
  A.circuit_ballistic = { enabled: true, families: ['fat_loss_bootcamp'], per_week: 2, throw_kinds: ['slam', 'overhead', 'wall_ball'], swing: true, throw_seconds: 3,
    refs: ['ATH-05', 'R2-VOL-05', '04 general_population medball'], status: 'INFERRED (B2), coach to confirm' };

  // ---- COACH-R3 R3-ATH-03 (approved) HYROX: station circuits as finishers (never muscle sets), wall balls with the race ball
  // (<= 20 lb), 40-rep / AMRAP efforts only inside them, jumps 50 % plyometric (profile)
  A.hyrox = { station_ids: HYROX_STATION_IDS.slice(), station_variants: ['hyrox_station', 'hyrox_run_station'], run_station_note: 'note.hyrox_run_station', wall_ball_max_lb: 20,
    // 'short station circuits' (R3-ATH-03): 2 -> 3 rounds of 30 -> 45 s by the stairway (PROPOSED)
    finisher: { rounds: [2, 3], work_s: [30, 45] },
    refs: ['R3-ATH-03'], status: 'approved (R3-ATH-03); station list order and finisher dose PROPOSED' };

  // ---- COD drills that belong to one sport (RECHECK 03 major: football receiver routes for a soccer midfielder); a drill with no
  // cut (a fade) never feeds the cut count
  A.cod = { sport_only_field: 'athletic.sport_only', no_cuts_field: 'athletic.no_cuts', route_sports: ROUTE_SPORTS.slice(),
    refs: ['ATH-01', '04 cod_sport'], status: 'INFERRED (B2)' };

  // ---- sprint drills (LIB-21 speed order: squirrel jumps -> accelerations -> max velocity; RECHECK 02 / 03 minors 'max velocity
  // dosed at 20-26 m', 'no acceleration station', '31 m / 33 m'): accelerations 10-20 m, max velocity 30-40 m after a build-up,
  // distances in 5-m steps; the profile's sprint focus picks the drill (accelerations for '0-20 yd' profiles)
  A.sprint = { ...A.sprint, metres_by_drill: { acceleration: [10, 20], max_velocity: [30, 40], default: [10, 30] }, round_m: 5,
    focus_from_profile: 'sprint_focus', refs: ['LIB-21', 'ATH-01'], status: 'PROPOSED (B2 distances)' };

  // ---- Olympic sets climb with the stairway (RECHECK 02 major 'flat line plus a cliff': 8 x 11 weeks then 12 in the test week):
  // the weekly sets ramp low -> high across the block, one more set at a time on the earliest exposures (day order, VOL-07), the
  // end-test week holds the week before
  R.olympic.sets = { ...R.olympic.sets, climb: true, distribute: 'day_order', hold_end_test_week: true,
    refs: [...new Set([...(R.olympic.sets.refs || []), 'R3-VOL-04'])] };
  // an Olympic / power-tagged lift never fills a resistance slot (RECHECK 06 major 'strict press -> push jerk at the block change';
  // 02 minor): it is power work (ORD-03) and never a muscle set (VOL-10)
  // a jerk is a catch lift (power, 3-5 reps), never a hypertrophy press; a push press stays an overhead press for athletes and
  // class-model clients only (LIB-13 'push press is foundational')
  R.selection.olympic_never_in_resistance = { tags: ['push_jerk'], push_press_families: ['athletic', 'hybrid_crossfit'], refs: ['ORD-03', 'VOL-10', 'PER-02', 'LIB-13'], status: 'INFERRED (B2)' };
  // the no-medball substitute (fake slam) only when the client owns no medball or slam ball (EQ-07; RECHECK 01 major)
  R.medball.no_ball_only_ids = ['fake-medball-slam-and-return-any-way-possible-upper-body-trunk-amortization-dril'];
  // a sprint set of 6 x 40 m (max velocity, full recovery) is 240 m (RC sprint per-set max; LIB-21 distances)
  A.reconcile.per_set_max = { ...A.reconcile.per_set_max, sprint_m: 240, upper_contacts: 10 };
  // upper-body plyos (push-up plyos, 5-10 a set, catalog hints) are dosed by the matrix, outside the budget
  A.reconcile.per_set_min = { ...A.reconcile.per_set_min, upper_contacts: 3 };
  // a single-leg drill holds at least 2 contacts a leg per set (INFERRED)
  A.reconcile.unilateral_contacts_per_leg_min = 2;

  // ---- COACH-R3 R3-ATH-01 swimming dryland: shoulder care every session (external rotation, floor Y / T, KB face pull; never
  // bands); a 2-week dryland taper before the main championship (competition date), 1 week or none before smaller meets
  if (R.prehab && R.prehab.by_injury_code && R.prehab.by_injury_code.SHOULDER_SWIMMER) {
    // every session at 1 set (3 sets a week on 3 days, about the 2 x 2 of v1.2; INFERRED dose) so the care fits next to the lifts
    // (R3-ATH-01 is the swimming answer: other SHOULDER_SWIMMER sports such as water polo keep 2 sessions a week)
    R.prehab.by_injury_code.SHOULDER_SWIMMER = { ...R.prehab.by_injury_code.SHOULDER_SWIMMER, each_session: true, each_session_sets: 1, each_session_sports: ['swimming'], refs: ['R3-ATH-01'] };
  }
  R.plan_types.prep = { ...R.plan_types.prep, taper_weeks_by_sport: { swimming: 2 }, taper_by_sport_refs: ['R3-ATH-01'] };

  // ---- COACH-R3 R3-ATH-02 (approved): from 60 the default is landing drills (step down and stick, no bounce), balance, quick
  // stepping without a hop, light medball throws and fast machine work; jumps, ankle hops, Olympic lifts and depth jumps are
  // off unless switched on with the warning; overhead and low-bar squats stay out. Racket players 50-59: low-impact jumps only
  // unless switched on (prefs.racket_50_impact_opt_in).
  R.population.older = { ...R.population.older, r3_status: 'approved (R3-ATH-02)',
    default_on: { landing: true, balance_warmup: true, quick_stepping: true, light_throws: true, fast_machine_intent: true },
    quick_stepping_ids: ['lateral-shuffles', 'split-step-reaction-drill', 'quick-feet-toe-taps-on-step', 'hops-in-place-foot-speed-reactive-hops'],
    quick_stepping_no_hop: ['lateral-shuffles', 'split-step-reaction-drill'], fast_intent_note: 'note.fast_machine_intent' };
  // (the `r3` ids stay: meta.r3_pending lists the round-3 defaults a plan uses, README §7)
  R.population.active_aging_50 = { ...R.population.active_aging_50, opt_in_field: 'prefs.racket_50_impact_opt_in', status: 'approved (R3-ATH-02)' };

  // ---- R3-ATH-05 (approved) heavy play weeks / event dates stay as round 3 placed them; the status moves to approved
  if (A.heavy_play_weeks) { A.heavy_play_weeks = { ...A.heavy_play_weeks, status: 'approved (R3-ATH-05)' }; }

  // ---- V27 reads the athletic stairway too (RECHECK 01 / 03 majors: 'V27 only checks for going over the budget')
  for (const c of R.validation.checks || []) if (c.id === 'V27') c.b2 = 'over / under (capacity-scaled) / drop inside a stairway block / RC3 single-response / sport-only drills';
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** B2 words (EN + ES PROPOSED, neutral Latin American Spanish, gym term in brackets). [key]: [en, es] */
export const UI_B2 = {
  'note.ballistic_single': ['One big effort each rep: land soft, reset, go again', 'Un esfuerzo grande por repetición: cae suave, reacomódate y vuelve a saltar'],
  'note.repeat_low': ['Quick, continuous contacts: stay springy on the balls of your feet', 'Contactos rápidos y continuos: rebota sobre la punta de los pies'],
  'note.circuit_ballistic_ball': ['About {n} hard throws each round: the ball does not count as a muscle set', 'Unos {n} lanzamientos fuertes por ronda: el balón no cuenta como serie muscular'],
  'note.hyrox_station': ['HYROX station: steady race pace for the work time; not counted as muscle sets', 'Estación HYROX: ritmo de carrera constante durante el tiempo de trabajo; no cuenta como series musculares'],
  'note.hyrox_run_station': ['After each 1 km run, do this station, then run again', 'Después de cada 1 km de carrera, haz esta estación y vuelve a correr'],
  'why.hyrox_station': ['HYROX station circuit: race stations as a finisher, not muscle sets', 'Circuito de estaciones HYROX: estaciones de carrera como cierre, no son series musculares'],
  'program.OTHYX.name': ['HYROX: strength + engine', 'HYROX: fuerza + motor'],
  'day.athletic.4.hyrox.S1': ['S1 - squat + pull + HYROX stations', 'S1 - sentadilla + tirón + estaciones HYROX'],
  'day.athletic.4.hyrox.H1': ['H1 - run intervals + upper body', 'H1 - intervalos de carrera + tren superior'],
  'day.athletic.4.hyrox.S2': ['S2 - deadlift + push + HYROX stations', 'S2 - peso muerto + empuje + estaciones HYROX'],
  'day.athletic.4.hyrox.H2': ['H2 - 1 km run + station, repeated + upper body', 'H2 - 1 km de carrera + estación, repetido + tren superior'],
  'note.fast_machine_intent': ['Move the weight up fast, then lower it with control', 'Sube el peso rápido y bájalo con control'],
  'note.first_reactive': ['First reactive jumps: two feet, low box, quality over height', 'Primeros saltos reactivos: con los dos pies, cajón bajo, calidad antes que altura'],
  'why.stage_block': ['Jump stage {stage} for this whole exercise block', 'Etapa de saltos {stage} durante todo este bloque de ejercicios'],
  'why.first_reactive': ['First reactive block: two-foot, low-box jumps before single-leg work', 'Primer bloque reactivo: saltos con dos pies y cajón bajo antes del trabajo a una pierna'],
  'why.route_sport_only': ['Route drills are for football; your sport gets general change-of-direction drills', 'Las rutas son de fútbol americano; tu deporte usa ejercicios generales de cambio de dirección'],
  'why.sprint_focus': ['Sprint drill for your sport: {kind}', 'Sprint para tu deporte: {kind}'],
  'why.athletic_climb': ['Athletic work climbs with the stairway', 'El trabajo atlético sube con la escalera'],
  'why.athletic_capacity': ['Your stations hold {pct}% of the sport\'s weekly {key}; it still climbs every week', 'Tus estaciones permiten el {pct}% del {key} semanal del deporte; igual sube cada semana'],
  'why.olympic_climb': ['Olympic sets climb with the stairway (one more set at a time)', 'Las series olímpicas suben con la escalera (una serie más a la vez)'],
  'why.test_week_hold': ['Test week: the athletic work holds last week\'s dose', 'Semana de prueba: el trabajo atlético se queda como la semana pasada'],
  'why.shoulder_care_each_session': ['Swimmers: shoulder care every session', 'Nadadores: cuidado del hombro en cada sesión'],
  'warning.athletic_capacity': ['Your sessions hold about {pct}% of your sport\'s weekly {key}: the work still climbs every week. Add a day or longer sessions for the full dose.', 'Tus sesiones permiten cerca del {pct}% del {key} semanal de tu deporte: igual sube cada semana. Agrega un día o sesiones más largas para la dosis completa.'],
  'athletic.key.contacts': ['jump contacts', 'contactos de salto'],
  'athletic.key.plyo_contacts': ['reactive jumps', 'saltos reactivos'],
  'athletic.key.jump_contacts': ['jumps', 'saltos'],
  'athletic.key.low_contacts': ['ankle hops', 'saltos de tobillo'],
  'athletic.key.throws': ['medball throws', 'lanzamientos de balón medicinal'],
  'athletic.key.cod_cuts': ['change-of-direction cuts', 'cambios de dirección'],
  'athletic.key.sprint_m': ['sprint metres', 'metros de sprint'],
  'athletic.key.olympic_sets': ['Olympic sets', 'series olímpicas'],
  'sprint.kind.acceleration': ['accelerations', 'aceleraciones'],
  'sprint.kind.max_velocity': ['max velocity', 'velocidad máxima'],
  'check.v27_athletic_budget': ['Athletic work follows the sport budget and climbs with the stairway', 'El trabajo atlético sigue el presupuesto del deporte y sube con la escalera'],
  'ui.plan.upper_contacts': ['{n} upper-body plyo contacts', '{n} contactos pliométricos de tren superior']
};

/** UI_B2 keys that replace an earlier string of the same key */
export const B2_FINAL = ['check.v27_athletic_budget'];
