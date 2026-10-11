// tools/fixture/fix-r1-f2.mjs - model 1.3.0, engine 0.4.0 FIX ROUND 1 / F2 (athletic work). Applied after fix-r1-f1.mjs by BOTH
// builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source: COACH-ANSWER /
// COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What F2 changes in the model (engine/DECISIONS.md section E, fix round 1 / F2; samples/REVIEW_LOG.md v0.4 fix round 1 / F2):
//   * rules.athletic.f2 - the plyo share as a per-week constraint (R2-ATH-01), the ankle block outside the day's jump / throw split,
//     the athletic tracks sized from the week's own targets (a ballistic jump track, a second throw / sprint station), the stage
//     cues of a ballistic jump (stick / land & go / repeat, R2-ATH-03), throws dosed 2-4 x 6-10 (LIB-22), COD drills dosed in reps,
//     the profile's Olympic ceiling, the pre-season stage after a single-block stairway
//   * rules.time_model - the ankle block's own time class (quick, low contacts: 0.4 min of work + 0.5 min of rest a set)
//   * rules.athletic.f2 also names the one-side medball records (left-facing / right-facing: swaps only when a both-sides record
//     passes), the athletic records the coach names for a sport that may be the pick (box / squat / broad / streamline squat jumps,
//     split-step reaction; R3-ATH-01 / 02), the cuts per rep of COD drills and the contacts per cycle of patterned hops (kept in the
//     rules so the catalog contract - closed tags and athletic keys, CONTRACTS §3.2.5 - stays as it is)
//   * profiles - the source profile's Olympic ceiling (04 triple_ext.ceiling) and reactive COD flag (04 cod.reactive)

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * F2 rule amendments (after amendRulesF1).
 * @param {object} rules @returns {object}
 */
export function amendRulesF2(rules) {
  const R = clone(rules);
  const A = R.athletic;
  A.f2 = {
    // R2-ATH-01 (the plyometric share of the jump and throw work by block end; blocks start 15 points more ballistic): the planned
    // share is held within `tolerance` of the week's target - ankle work and reactive jumps come down first, then the ballistic
    // jumps and throws go up (RECHECK 03 blocker: 85 % plyometric against 45 %)
    share: { tolerance: 0.05, enforce: true, refs: ['R2-ATH-01', 'R2-ATH-02', 'R3-ATH-01', 'R3-ATH-04'], status: 'PROPOSED (F2): tolerance 5 points' },
    // the low-amplitude ankle block (pogo / ankle hops, 2 short sets, about 3 minutes) is quick prep work like the warm-up's A-drills:
    // it does not take one of the day's two jump / throw stations of the R3-SES-01 split nor one of the 12 exercises of the 12 + 2
    // count (R2-SES-04), so it never pushes out the sport's ballistic jump or a strength group (RECHECK 01 / 03: the template's
    // 'loaded jump squats (ballistic)' station lost to the ankle block); it stays in the athletic block, so switching off the day's
    // jumps switches it off too (R3-SES-02); a sport with a bone-loading need (BONE_LOADING_NON_IMPACT) spreads it over
    // `bone_loading_days` days
    ankle_block: { outside_day_split: true, outside_athlete_cap: true, time_class: 'ankle', bone_loading_days: 2, bone_loading_min_peak: 40, bone_loading_codes: ['BONE_LOADING_NON_IMPACT'],
      keep_for_ankle_track: true, refs: ['R2-ATH-02', 'R3-SES-01', 'R3-ATH-01', 'R3-ATH-02', 'SCIENCE AQ8'], status: 'PROPOSED (F2)' },
    // the athletic tracks get the stations their week needs, read from the plan's own weekly targets (the share split, the season
    // factors) at the training block's peak: a station holds about `per_station` of a key at its usual 2 sets; at most `max_stations`
    // a week; jump / throw stations go to the main day with the fewest jump / throw stations (a day with none first: RECHECK 01
    // 'Friday has no jump or throw at all'), then the day farthest from the key's other stations
    tracks: {
      from_budget: true,
      per_station: { jumps: 16, throws: 20, low_contacts: 40, cod_cuts: 24 },
      max_stations: { jumps: 3, throws: 2, low_contacts: 2, cod_cuts: 3, sprint_m: 2 },
      sprint_second_station: true,
      refs: ['R2-ATH-01', 'R3-ATH-01', 'R3-SES-01', 'D-63', 'D-73'],
      status: 'PROPOSED (F2): station sizes and caps'
    },
    // R2-ATH-03 (Receive-Create: 1 land, 2 land & go, 3 repeat) on a single-response ballistic jump: the stage changes how the jump
    // is done (RECHECK 01 major: the same box jump and cue in 'Land', 'Land & Go' and 'Repeat')
    ballistic_stage_cues: { RC1: 'note.ballistic_stick', RC2: 'note.ballistic_land_go', RC3: 'note.ballistic_repeat', refs: ['R2-ATH-03', 'CAT-10'], status: 'PROPOSED (F2) cue words' },
    // a jump station moves to a new drill where its stage changes (another drill of the same quality, the previous block's drill
    // last); the ankle block starts in place on two feet and adds direction / one leg block by block (CAT-10 'bilateral before
    // unilateral'; RECHECK 01 / 08)
    stage_drill_change: { enabled: true, ankle_first_block_in_place: true, refs: ['R2-ATH-03', 'CAT-10', 'PER-02'], status: 'PROPOSED (F2)' },
    // LIB-22 ('1 x 10 per throw'), the coach's 2 x 8-12: a throw set is 6-10 throws (a one-side or rotational throw 6-10 a side);
    // the sit-up pass is no longer a fixed 20 (RECHECK 02 minor: 3 x 20 every Monday)
    throws: { per_set: [6, 10], per_side: [5, 10], situp_range: [6, 10], one_side_id_re: '-(left|right)-facing-', majority_plane_first: true,
      refs: ['LIB-22', 'ATH-05'], status: 'PROPOSED (F2)' },
    // COD drills are written in reps of the drill (a 5-10-5 has 2 cuts a rep, an L-drill 3); a reactive COD profile (04 cod.reactive)
    // holds one reactive drill a week (split-step reaction)
    cod: { reps_from_cuts_per_rep: true, reactive_drill_ids: ['split-step-reaction-drill'],
      // a 5-10-5 = 2 turns a rep, an L-drill = 3, a shuffle out and back = 1, a split-step reaction = 1 (PROPOSED from the drill descriptions)
      cuts_per_rep: { '5-10-5-pro-agility-shuttle': 2, 'l-test-l-drill-3-cone-inferred-from-left-test': 3, 'lateral-shuffles': 1, 'split-step-reaction-drill': 1 },
      refs: ['ATH-01', '04 cod'], status: 'PROPOSED (F2)' },
    // contacts per pattern of a patterned hop drill (right-angle hops: 5 hops a pattern): the dose is whole patterns (RECHECK 03 minor)
    contacts_per_cycle: { 'bilateral-right-angle-ankle-hops-forward-right-forward-left-forward': 5, 'single-leg-right-angle-ankle-hops': 5 },
    // sprints climb in reps a week (5-m distance steps); a profile whose focus is 'both' or names max velocity holds a max-velocity
    // station (RECHECK 03 major: 8 weeks of 10-20 m starts only)
    sprint: { max_velocity_station: true, refs: ['LIB-21', '04 sprint.focus'], status: 'PROPOSED (F2)' },
    // the profile's Olympic ceiling (04 triple_ext.ceiling: 'power clean, clean pulls'): no squat catch above it unless the coach
    // opts in; hang before floor across the exercise blocks (RECHECK 02 minor: a squat snatch for a 230-lb linebacker)
    olympic_ceiling: { enabled: true, hang_before_floor: true, refs: ['ATH-10', 'R2-ATH-04', '04 triple_ext.ceiling'], status: 'PROPOSED (F2)' },
    // a single-block stairway holds its start stage; the pre-season block after it moves one stage up (RECHECK 03 major: soccer
    // never reached 'Repeat')
    pre_season_after_single_block: 'advance_one',
    // athletic records outside the live library that the coach names for a station (BRAIN §9.11 swimming: box / squat / broad jumps,
    // streamline squat jumps; R3-ATH-02: split-step reaction) may be the pick, never a default for other sports' slots
    pick_ok_ids: ['broad-jump', 'squat-jump-high-bodyweight-or-lightly-loaded', 'streamline-squat-jump-arms-overhead', 'split-step-reaction-drill',
      'stick-the-landing-bilateral-jump-drop-and-freeze-the-landing', 'bilateral-jump-on-to-box-jump-land-softly-on-top', 'single-leg-broad-jump'],
    refs: ['R2-ATH-01', 'R2-ATH-02', 'R2-ATH-03', 'R3-ATH-01', 'R3-ATH-02', 'R3-ATH-04', 'R3-VOL-04', 'R3-SES-02'],
    status: 'PROPOSED (F2, engine/DECISIONS.md E-97 ... E-110)'
  };
  // the pre-season of a single-block stairway advances one stage (see above)
  A.stages = { ...A.stages, pre_season_after_single_block: 'advance_one' };
  // the ankle block's own time class: quick, low contacts (2 sets of 10-25 pogo / ankle hops take about a minute each with the rest)
  const T = R.time_model;
  T.work_minutes = { ...T.work_minutes, ankle: 0.4 };
  T.rest_class_minutes = { ...T.rest_class_minutes, ankle: 0.5 };
  T.rest_class_by_time_class = { ...T.rest_class_by_time_class, ankle: 'ankle' };
  if (T.minutes_per_set) T.minutes_per_set = { ...T.minutes_per_set, ankle: 0.9 };
  // per-set throw bounds follow the new dose (6-10 a set, 5-10 a side; LIB-22)
  // and an ankle set may be as short as 6 quick contacts, so a low-share sport's ankle block fits its share (RECHECK 01: 'the
  // ankle-hop block starts at 20 contacts against a week-1 target of 8'; a swimmer starts at 10 % plyometric)
  A.reconcile = { ...A.reconcile, per_set_min: { ...A.reconcile.per_set_min, throws: 6, low_contacts: 6 } };
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- profiles

/** the 04 profile's Olympic ceiling read into a class: 'pull' (pulls / shrugs only), 'power' (power / hang catches, no squat catch) */
function ceilingClass(txt) {
  if (!txt || typeof txt !== 'string') return null;
  const t = txt.toLowerCase();
  if (/squat (clean|snatch)|full/.test(t)) return null;
  if (/power|hang (clean|snatch)/.test(t)) return 'power';
  if (/pull|shrug/.test(t)) return 'pull';
  return null;
}

/**
 * F2 sport-profile amendments (after amendSportB2): the source's Olympic ceiling and reactive COD flag.
 * @param {object} s compiled sport @param {object} src the 04 source profile @returns {object}
 */
export function amendSportF2(s, src) {
  if (!s || !src) return s;
  const out = { ...s };
  const c = ceilingClass(src.triple_ext && src.triple_ext.ceiling);
  if (c) out.olympic = { ...(s.olympic || {}), ceiling: c };
  if (src.cod && typeof src.cod.reactive === 'boolean') out.cod_reactive = src.cod.reactive;
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_F2 = {
  'note.ballistic_stick': [
    'Jump, then land and stick it: hold the landing 2-3 s, reset, go again',
    'Salta, cae y congela la caída 2-3 s; reinicia y vuelve a saltar'
  ],
  'note.ballistic_land_go': [
    'Land and go: stick the landing, then jump again right away; reset between reps',
    'Cae y sal: congela la caída y salta de nuevo enseguida; reinicia entre repeticiones'
  ],
  'note.ballistic_repeat': [
    'Repeat: 2-3 big jumps in a row, resetting your arms each time; full effort on every jump',
    'Repite: 2-3 saltos grandes seguidos, reiniciando los brazos cada vez; esfuerzo total en cada salto'
  ],
  'athletic.key.jumps': ['jump contacts (box, squat, broad and reactive jumps)', 'contactos de salto (cajón, sentadilla, salto largo y reactivos)'],
  'athletic.key.ankle': ['ankle-hop contacts', 'contactos de saltos de tobillo'],
  'warning.athletic_capacity_block': [
    'Your sessions hold about {pct}% of your sport\'s weekly {key}: the work climbs across the block (not every week). Add a day or longer sessions for the full dose.',
    'Tus sesiones cubren cerca del {pct}% de los {key} semanales de tu deporte: el trabajo sube a lo largo del bloque (no cada semana). Agrega un día o sesiones más largas para la dosis completa.'
  ],
  'note.cod_reps': ['{cuts} cuts a rep', '{cuts} cambios de dirección por repetición'],
  'why.olympic_ceiling': [
    'Your sport\'s Olympic lifts stop at the {ceiling} (no full squat catch)',
    'Los levantamientos olímpicos de tu deporte llegan hasta {ceiling} (sin recepción en sentadilla completa)'
  ],
  'olympic.ceiling.power': ['power and hang versions', 'versiones de potencia y colgadas'],
  'olympic.ceiling.pull': ['pulls and shrugs', 'jalones y encogimientos']
};

/** UI_F2 keys that replace an earlier string of the same key */
export const F2_FINAL = [];
