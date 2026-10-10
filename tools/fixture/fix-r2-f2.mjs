// tools/fixture/fix-r2-f2.mjs - model 1.3.0, engine 0.4.0 FIX ROUND 2 / F2 (athletic work). Applied after fix-r2-f1.mjs by BOTH
// builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source: COACH-ANSWER /
// COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What fix round 2 / F2 changes in the model (engine/DECISIONS.md section E, fix round 2 / F2, E-160 ... ; samples/REVIEW_LOG.md
// v0.4 fix round 2 / F2):
//   * rules.athletic.reconcile.climb_families - the jumps (reactive + ballistic) and the ankle work never drop on their own (they
//     were one 'contacts' family: the jumps could fall while the ankle hops rose); warn_below_share 0.85
//   * rules.athletic.r2 - the athletic stairway of round 2: one scale down the training block (never a smaller share of the target in
//     a later exercise block), a jump / throw / COD / sprint station takes one more set when its per-set dose is at the top and the
//     day has the minutes, a bone-loading sport's second ankle day from the exercise block whose target holds it, the plyo share
//     never over the block-end share, pre-season speed and power at or above the last off-season week (R2-PER-06), a speed / agility
//     / jump test replaces its station and the end-test week's tested days run the baseline week's athletic dose (R2-PER-07),
//     athletic picks by sport (direction and single-leg quotas from the first block for L2+, a drill written for another sport
//     waits, no upper-body plyo station without an upper-body need, low-impact stage drills and no backward hops for 50+ court
//     players and knee pain, a reactive COD drill and turn tiers, the throw changes with the exercise block), the Olympic lift by the
//     day's lift (clean on the squat day, snatch on the hinge day, R2-ATH-04), WODs that climb by density, circuit throws by the round
//   * rules.prehab - a swimmer's shoulder care 2 sets every session (R3-ATH-01)
//   * rules.olympic.sets - no Olympic work in the class model's end-test week (OBSERVED class cycle WK 8 = strength LVL 5 only)
//   * profiles - pre-season Olympic / sprint / COD factors never under 1 (R2-PER-06 'about 60 % of off-season sets with more speed and
//     power')
//   * catalog - deep knee flexion tags on the split / lunge jump family and the full-catch hang cleans (a knee-pain client's swaps)

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * Fix round 2 / F2 rule amendments (after amendRulesR2F1).
 * @param {object} rules @returns {object}
 */
export function amendRulesR2F2(rules) {
  const R = clone(rules);
  const A = R.athletic;
  // RECHECK v0.4 03 minor / 08 major ('non-ankle jump contacts dip in week 3', 'squat-jump contacts fall through the hardest weeks'):
  // the jump work (reactive + ballistic) and the ankle work are two families of the never-drop rule and of V27
  A.reconcile = {
    ...A.reconcile,
    climb_families: { jumps: ['plyo_contacts', 'jump_contacts'], ankle: ['low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] },
    // RECHECK v0.4 01 major ('jumps reach about 78 % of the target, and nothing tells the client'): told from 85 % down
    warn_below_share: 0.85,
    r2_status: 'PROPOSED (fix round 2 / F2, E-160): families, the 85 % line'
  };
  A.r2 = {
    // E-160 (COACH-R3 R3-VOL-04 'natural growth throughout', R3-SES-02 step 4 'never flat'; RECHECK v0.4 01 / 02 majors: jumps held at
    // 36 from week 7, cuts at 72 from week 4): one scale down the training block - a later exercise block never plans a smaller share
    // of its target than an earlier one, so the work climbs to what the hardest weeks' stations hold; inside a family the key whose
    // stations are full hands its rest to the family's other stations (reactive <-> ballistic jumps)
    scale: { monotone_across_exercise_blocks: true, family_spill: true, refs: ['R3-VOL-04', 'R3-SES-02'], status: 'PROPOSED (fix round 2 / F2)' },
    // E-161 (RECHECK v0.4 01 major 'add a 3rd set to the ballistic station instead of holding'; 02 major 'let the station's sets climb
    // 3 -> 4'): a station whose key is still under its week's target with every per-set dose at the top takes one more set - on the
    // day with the most minutes left, only while that day stays inside its minutes (x room_factor) in every later week of the block;
    // the set stays to the end of the training block (sets never drop)
    set_climb: {
      enabled: true, max_extra_per_station: 1,
      sets_max: { jump_contacts: 4, plyo_contacts: 4, low_contacts: 3, throws: 4, cod_cuts: 4, sprint_m: 3 },
      room_factor: 1,
      refs: ['R3-VOL-04', 'R3-SES-02', 'VOL-07'], status: 'PROPOSED (fix round 2 / F2): one extra set, the set caps, only inside the day\'s minutes'
    },
    // E-162 (RECHECK v0.4 01 major: the bone-loading ankle block ran once a week for 12 weeks): the second ankle day opens with the
    // exercise block whose first week's ankle target holds a minimum set on each day (never mid-block, PER-02)
    ankle_second_day: { opens_when_target_holds_min: true, in_warmup_window: true, refs: ['R3-ATH-01', 'PER-02', 'SCIENCE AQ8'], status: 'PROPOSED (fix round 2 / F2)' },
    // E-163 (RECHECK v0.4 02 minor: 55 % plyometric against the approved 50 % by block end): the top of the weekly share band never
    // passes the sport's block-end share
    share_end_clamp: { enabled: true, balance_parts: true, refs: ['R2-ATH-01', 'R3-ATH-04'], status: 'PROPOSED (fix round 2 / F2)' },
    // E-166 (COACH-R3 R3-VOL-04 'natural growth throughout', R3-SES-02 step 4 'never flat'): down a stairway a family climbs in even
    // steps from its first week's dose to the dose of its last stairway week - as many levels as whole dose steps fit between the
    // two, each held for the same number of weeks
    even_steps: { enabled: true, refs: ['R3-VOL-04', 'R3-SES-02'], status: 'PROPOSED (fix round 2 / F2)' },
    // V27 `early_peak` (E-166): a family whose stations are full at the block's peak (every dose at its top) and that sits under
    // `under_target` of a target rising by `target_rise_min` does not hold that peak for more than half the block's weeks plus
    // `run_slack`
    flat: { run_slack: 1, target_rise_min: 0.1, under_target: 0.9, refs: ['R3-VOL-04', 'R3-SES-02'], status: 'PROPOSED (fix round 2 / F2): the lines' },
    // E-164 (COACH-R2 R2-PER-06 'about 60 % of off-season sets with more speed and power'; RECHECK v0.4 03 major: the pre-season held
    // less speed and power than the last off-season week): sprint metres and cuts plan at least the last off-season week
    pre_season_hold: { keys: ['sprint_m', 'cod_cuts'], refs: ['R2-PER-06'], status: 'PROPOSED (fix round 2 / F2)' },
    // E-165 (COACH-R2 R2-PER-07 'tested ... instead of that week's top sets'; RECHECK v0.4 02 / 03 majors: the sprint, 5-10-5 and jump
    // tests came on top of the full day; the end test ran after more athletic work than the baseline): a timed test replaces its
    // station on its day; on the tested days of the end-test week the athletic and Olympic work runs the baseline week's dose
    tests: {
      replace_station: { sprint: ['AP_SPRINT'], cod: ['AP_COD'], jumps: ['AP_PLYO'] },
      end_week_test_days: 'baseline_dose',
      // E-172 (OBSERVED class cycle WK 8 = strength LVL 5 only): no Olympic work in the class model's end-test week
      class_end_week_olympic: 'off',
      // E-174: only a physical test holds the athletic dose of the last week (a weigh-in / photo does not)
      hold_for: ['strength', 'speed_agility', 'jumps', 'cardio'],
      refs: ['R2-PER-07', 'R3-SES-02'], status: 'PROPOSED (fix round 2 / F2)'
    },
    // E-167 ... E-171: the athletic picks by sport, stage and client (select.mjs; every weight PROPOSED)
    selection: {
      // a jump or COD drill the library writes for other sports waits (RECHECK v0.4 02 / 03: a swimmer's streamline squat jump for a
      // linebacker and a midfielder); drills written for many sports as general agility work are not sport drills
      other_sport: { buckets: ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_COD'], penalty: -5, generic_ids: ['split-step-reaction-drill', 'lateral-shuffles', 'jump-rope', 'double-unders-jump-rope'] },
      // a trained athlete of a mostly single-leg sport takes single-leg and directional ballistic jumps / landings from the first block
      // (04 plyo.unilateral_pct / direction_pct; RECHECK v0.4 03 major); single-leg REACTIVE drills still wait for a two-foot block (E-32)
      first_block_single_leg: { levels: ['L2', 'L3'], min_unilateral_pct: 50, qualities: ['ballistic', 'landing'] },
      // a mostly lateral sport (04 plyo.direction_pct lateral >= 50: court sports) holds a lateral jump or ankle station every week
      lateral_quota: { min_pct: 50, bonus: 5 },
      // low-impact clients (court 50+, 60+, knee or ankle pain; R3-ATH-02): the box jump stays in every stage, no floor jumps
      low_impact: { floor_jump: -6, box_jump: 2 },
      // no backward hop drill for a court-fall hot spot or a 50+ court / 60+ client (04 'fast backpedal drills (fall mechanism)')
      backward_hops_avoid: { id_re: '(^|-)backward(-|$)', codes: ['FALLS_COURT'] },
      // a heavy athlete (rules.athletic.first_reactive.heavy_bw_lb) holds at most 2 single-leg reactive stations a week (CAT-10)
      single_leg_reactive_heavy: { max_wk: 2, penalty: -8 },
      // a throw station changes its throw at each exercise-block start (PER-02 / PER-03), never back to an earlier block's
      throw_change_per_block: { same_as_previous: -5, earlier_block: -4 },
      // COD drills by turn angle (05 template note 'EASY -> MOD. -> HARD TURN', ATH-06): tier 1 shallow cuts and shuffles, tier 2
      // 45-90 degree cuts, tier 3 180-degree cuts; the station takes the tier of its Receive-Create stage; a reactive-COD profile's
      // reaction drill comes in from the Land & Go stage (INFERRED tiers from the drill descriptions)
      cod_tiers: {
        by_id: { 'slant-route': 1, 'flat-route': 1, 'lateral-shuffles': 1, 'dig-out-route': 2, 'post-corner-route': 2, 'l-test-l-drill-3-cone-inferred-from-left-test': 2,
          'comeback-curl-route': 3, '5-10-5-pro-agility-shuttle': 3 },
        match: 2, above: -2, below: -0.5, reactive_before_rc2: -6, reactive_from_rc2: 6
      },
      // a general-population circuit's ball station changes plane at the exercise-block start (04 throw_plane_pct both >= 40)
      circuit_throw_plane_rotate: { min_pct: 40, other_plane: 5, same_plane: -3 },
      // the template's upper-body plyo station becomes a lower-body jump station while the sport's jump track is short of stations
      upper_plyo_to_jump_when_short: true,
      // E-176: clean on the squat-pattern day, snatch on the hinge-pattern day (R2-ATH-04): the day's lower-body work lift decides
      olympic_by_day_lift: true,
      refs: ['R2-ATH-03', 'R2-ATH-04', 'R3-ATH-02', 'ATH-06', 'CAT-10', 'PER-02', '04 plyo / cod'],
      status: 'PROPOSED (fix round 2 / F2): every weight and list'
    },
    refs: ['R2-ATH-01', 'R2-ATH-03', 'R2-ATH-04', 'R2-PER-06', 'R2-PER-07', 'R3-ATH-01', 'R3-ATH-02', 'R3-VOL-04', 'R3-SES-02'],
    status: 'PROPOSED (fix round 2 / F2, engine/DECISIONS.md E-160 ...)'
  };
  // records the coach's programs / reference lists hold that the round-2 picks need as the pick (not only a swap): the lateral box
  // step-up jump and the single-leg stick for court / field athletes, skater jumps for lateral sports under 50 (PROPOSED)
  A.f2 = { ...A.f2, pick_ok_ids: [...new Set([...(A.f2.pick_ok_ids || []), 'lateral-box-step-up-jump', 'stick-the-landing-unilateral-single-leg-landing-freeze', 'skater-jumps-lateral-bounds'])] };
  // E-173 (COACH-R3 R3-VOL-04 / R3-SES-02 step 4; OBSERVED CrossFit tab: WOD levels ramp inside every block; RECHECK v0.4 04 major): a
  // WOD climbs by its work - an EMOM runs whole rounds of its stations and the rest of the week's step goes into the reps; a WOD the
  // time check holds at its short end takes about 30 % more reps across the stairway (EMOM / for time; an AMRAP is told to beat its
  // rounds); a WOD changes at least a movement group at the exercise-block start and a station used earlier in the week waits
  R.conditioning.wod = {
    ...R.conditioning.wod,
    density: { enabled: true, emom_whole_rounds: true, hold_total: 0.3, refs: ['R3-VOL-04', 'R3-SES-02', 'OBSERVED CrossFit tab'], status: 'PROPOSED (fix round 2 / F2): the 30 %' },
    rotate_r2: { previous_block_group: 5, same_exercise_week: 3, refs: ['PER-02', 'E-39'], status: 'PROPOSED (fix round 2 / F2)' }
  };
  // E-174 (ORD-03 power before strength, LIB-06 medball work 'just do them right'; RECHECK v0.4 05 major): a circuit's ball station is
  // a few full-intent throws a round (6 -> 10 with the stairway), then rest until the bell - not as many as fit in the seconds; the
  // rotational slams join the circuit's throws (04 general population 50 / 50 sagittal / transverse)
  A.circuit_ballistic = { ...A.circuit_ballistic, per_round: [6, 10], per_round_status: 'PROPOSED (fix round 2 / F2)' };
  // E-175 (COACH-R3 R3-ATH-01 'shoulder care every session', approved; COACH-ANSWER ORD-07 survival work; OBSERVED face-pull dosing 3-5
  // sets; RECHECK v0.4 01 major: one easy set a session, less than a thrower's 2 x 2): a swimmer's shoulder care runs 2 sets every
  // session, done inside the rests of the day's pulls (its own time class: the work only, no rest of its own - so the second set
  // costs the session no strength group) and it is not a block to switch off
  R.prehab = {
    ...R.prehab,
    by_injury_code: { ...R.prehab.by_injury_code, SHOULDER_SWIMMER: { ...R.prehab.by_injury_code.SHOULDER_SWIMMER, each_session_sets: 2, each_session_time_class: 'prehab_in_rest', each_session_keep: true } },
    r2_status: 'PROPOSED (fix round 2 / F2, E-175): 2 sets, inside the rests'
  };
  {
    const T = R.time_model;
    T.work_minutes = { ...T.work_minutes, prehab_in_rest: T.work_minutes.prehab };
    T.rest_class_minutes = { ...T.rest_class_minutes, prehab_in_rest: 0 };
    T.rest_class_by_time_class = { ...T.rest_class_by_time_class, prehab_in_rest: 'prehab_in_rest' };
    if (T.minutes_per_set) T.minutes_per_set = { ...T.minutes_per_set, prehab_in_rest: T.work_minutes.prehab };
  }
  // RECHECK v0.4 02 minor (coach_answers.md load-velocity: medball passes 8-10 lb): the sit-up-to-chest pass is a pass - 8-10 lb
  R.medball = { ...R.medball, loads_lb: { ...R.medball.loads_lb, situp: [8, 10] } };
  // E-162: a bone-loading sport spreads its ankle block over two days from a 20-contact peak (was 40: the swimmer's 27-contact peak
  // kept one day)
  A.f2 = { ...A.f2, ankle_block: { ...A.f2.ankle_block, bone_loading_min_peak: 20 } };
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- profiles

/**
 * Fix round 2 / F2 sport-profile amendments (after amendSportF2): the pre-season keeps its speed and power - the Olympic (TE),
 * sprint and COD factors of the 04 profile (INFERRED numbers) never fall under 1 (COACH-R2 R2-PER-06, approved: 'about 60 % of
 * off-season sets with more speed and power').
 * @param {object} s compiled sport @returns {object}
 */
export function amendSportR2F2(s) {
  if (!s || !s.pre_season) return s;
  const pre = { ...s.pre_season };
  for (const k of ['TE', 'SPRINT', 'COD']) if (typeof pre[k] === 'number' && pre[k] < 1) pre[k] = 1;
  return { ...s, pre_season: pre };
}

// ---------------------------------------------------------------------------------------------------------------- catalog

/**
 * Fix round 2 / F2 catalog amendments (after amendExerciseF3): tags only, inside the closed tag list (CONTRACTS §3.2.5).
 * @param {object} ex ExerciseRecord @returns {object}
 */
export function amendExerciseR2F2(ex) {
  if (!ex || !DEEP_KNEE_R2F2.includes(ex.id) || (ex.tags || []).includes('deep_knee_flexion')) return ex;
  return { ...ex, tags: [...ex.tags, 'deep_knee_flexion'].sort() };
}

// RECHECK v0.4 08 major (a knee-pain client's squat jump offered loaded lunge / switch jumps as swaps, the 'protect your knee' clean
// pull a hang clean with no catch depth stated): the split / lunge jump family and the hang lifts whose catch depth is not stated are
// deep knee flexion (INFERRED tag list, as DEEP_KNEE_IDS in review-v12.mjs)
const DEEP_KNEE_R2F2 = ['rfe-lunge-jumps-suitcase-db', 'db-staggered-stance-switch-jump', 'split-stance-squat-jumps-lunge-jumps', 'alternating-split-stance-jumps-front-foot-on-box',
  'front-foot-elevated-lunge-jumps-bodyweight', 'bulgarian-rear-foot-elevated-split-jumps', 'hang-clean-of-1rm-catch-not-stated', 'hang-snatch-of-1rm-catch-not-stated'];

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_R2F2 = {
  'note.wod_amrap_density': [
    'Same clock every week: count your rounds and beat last week\'s count',
    'El mismo tiempo cada semana: cuenta tus rondas y supera las de la semana pasada'
  ],
  'note.circuit_ballistic_ball_rest': [
    '{n} throws each round with full intent, then rest until the bell: the ball does not count as a muscle set',
    '{n} lanzamientos por ronda con toda la intención y descansa hasta la señal: el balón no cuenta como serie muscular'
  ],
  'note.prehab_in_rest': [
    'Do these sets inside the rests of your rows or pulldowns: no extra time. Keep this one every session',
    'Haz estas series dentro de los descansos de tus remos o jalones: sin tiempo extra. Mantén este ejercicio en cada sesión'
  ],
  'why.wod_density': [
    'The WOD climbs with the stairway: more reps in the same time',
    'El WOD sube con la escalera: más repeticiones en el mismo tiempo'
  ],
  // RECHECK v0.4 08 major ('7 contacts per set does not match the 2-3 jumps in a row cue'): the set's jumps are done in runs of 2-3
  'note.ballistic_repeat': [
    'Repeat: do the set in runs of 2-3 big jumps in a row (for 7 jumps: 3 + 2 + 2), resetting your arms between runs; full effort on every jump',
    'Repite: haz la serie en tandas de 2-3 saltos grandes seguidos (para 7 saltos: 3 + 2 + 2), reiniciando los brazos entre tandas; esfuerzo total en cada salto'
  ]
};

/** UI_R2F2 keys that replace an earlier string of the same key */
export const R2F2_FINAL = ['note.ballistic_repeat'];
