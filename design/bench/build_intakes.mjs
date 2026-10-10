// design/bench/build_intakes.mjs - writes the benchmark corpus C2 (PLANNER_SPEC.md 13.1) to design/bench/intakes/*.json.
// Deterministic: no clock, no randomness; running it twice gives the same bytes. It writes ONLY inside design/bench/intakes/.
// Every intake is a valid intake/2 (engine/CONTRACTS.md 2.1); `node design/bench/run.mjs --check-intakes` proves it against the
// live validateIntake. Keys starting with '_' are comments (the engine skips them): `_comment` says who the client is and
// `_bench` holds the coverage tags the summary table groups by.
//
// Usage: node design/bench/build_intakes.mjs            (rewrites every file)
//        node design/bench/build_intakes.mjs --list     (prints the corpus, writes nothing)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'intakes');

const DAYS = {
  2: ['Mon', 'Thu'], 3: ['Mon', 'Wed', 'Fri'], 4: ['Mon', 'Tue', 'Thu', 'Fri'], 5: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
  6: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function merge(a, b) {
  if (!isObj(b)) return b;
  const out = isObj(a) ? { ...a } : {};
  for (const [k, v] of Object.entries(b)) out[k] = isObj(v) && isObj(out[k]) ? merge(out[k], v) : (isObj(v) ? merge({}, v) : v);
  return out;
}

/** the neutral client every spec starts from (a 30-year-old with 2 years of training, 3 x 60, full gym, 12 weeks) */
function base() {
  return {
    schema: 'intake/2', lang: 'en', units: 'lb', role: 'self', health_route: null,
    safety: { heart: false, surgery_6mo: false, pregnant_postpartum_6mo: false, injury_in_treatment: false, doctor_said_no: false },
    release: { accepted: true, version: 'release.client', lang: 'en', guardian: null },
    age: 30, body_weight: { value: 170, unit: 'lb' },
    experience: { years_consistent: 2, months_off_last_2y: 0, former_competitor: false },
    goal: 'general', format: null, sport: null, activity: null, priority_muscles: [], lift_style: 'balanced',
    schedule: { days_per_week: 3, weekdays: DAYS[3].slice(), session_minutes: 60, start_date: '2026-10-12' },
    plan: { mode: 'fixed_12', maint_reason: null, maint_weeks: null, previous_cycles: { count: 0, last_had_holds_or_pain: false }, tests: ['none'], just_finished_block: false },
    equipment: { profile: 'FULL_GYM', extras: [], machines: [], preference: 'none',
      detail: { heaviest_db_pair: null, medball_lb_owned: [6, 8, 10], box_height_in: 24, running_space: '10_20m', cardio_options: ['treadmill', 'bike', 'rower'] } },
    pain: [], exclusions: [], output_mode: 'plan_only',
    prefs: { core_position: 'start', optional_days: 'separate', variety_ab: false, heavy_unilateral: false, supersets_for_fatigue: false,
      cardio_adjust: 0, older_athletic_opt_in: false, split_style: 'default' },
    growth_stage: null, email: null, coach_rule_pack_ids: []
  };
}

// ---- small builders -----------------------------------------------------------------------------------------------
const sched = (days, minutes, weekdays, start) => ({ schedule: { days_per_week: days, weekdays: (weekdays || DAYS[days]).slice(), session_minutes: minutes, start_date: start || '2026-10-12' } });
const exp = (years, off = 0, former = false) => ({ experience: { years_consistent: years, months_off_last_2y: off, former_competitor: former } });
const who = (age, lb) => ({ age, body_weight: { value: lb, unit: 'lb' } });
const youth = (stage = 'post_phv') => ({ release: { accepted: true, version: 'release.minor', lang: 'en', guardian: true }, growth_stage: stage });
const kit = (profile, extras = [], detail = {}, machines = [], preference = 'none') => ({ equipment: { profile, extras, machines, preference, detail } });
const FIELD = ['hurdles', 'open_space_long'];
const PLATFORM = ['hurdles', 'open_space_long', 'barbell_bumpers_platform'];
const BOX = ['barbell_bumpers_platform', 'kettlebell', 'medball', 'slam_ball', 'plyo_box_high', 'two_boxes', 'rings', 'jump_rope', 'cardio_machine_cal'];
const BIG_SPACE = { running_space: '40_60m_or_track', cardio_options: ['run', 'bike'] };
const NO_BALL = { medball_lb_owned: [], box_height_in: null, running_space: 'none' };
const pain = (...items) => ({ pain: items.map(([area, severity, worse_with = [], side = 'both']) => ({ area, side, severity, worse_with })) });
const plan = (mode, tests = ['none'], more = {}) => ({ plan: { mode, tests, ...more } });
const comp = (sport, position, level, season, practice = 3, game_days = [], detail = null) => ({
  goal: 'athletic', sport: { competitive: 'competitive', sport, position, position_detail: detail, level_of_play: level, season, practice: { practice_days_per_week: practice, game_days } }
});
const off = (date) => ({ type: 'next_season_start', date });
const inSeason = (date) => ({ type: 'in_season_until', date });
const meet = (date) => ({ type: 'competition_date', date });
const NO_SEASON = { type: 'no_season', date: null };
const act = (ids, play_days = [], more = {}) => ({ goal: 'active', activity: { ids: [].concat(ids), play_days, event_date: null, ...more } });
const prefs = (p) => ({ prefs: p });

// ---- the corpus ---------------------------------------------------------------------------------------------------
// [slug, comment, tags, ...overrides]. Tags: the goal family, then what the intake is in the corpus for; 'edge' = a
// deliberately hard case (the summary table lists them apart).
const SPECS = [
  // ---------------------------------------------------------------- muscle / aesthetics
  ['muscle-l1-4x60-worked-example', 'Aesthetics beginner, 4 x 60, full gym: the worked example 12 v1.2 5.1 (expected trained: quads, hips, back, chest, shoulders, biceps).', ['muscle', 'L1', 'golden'],
    { goal: 'muscle' }, who(23, 150), exp(0.5), sched(4, 60)],
  ['muscle-l1-3x60-basic-gym', 'Aesthetics beginner, 3 x 60 full body, basic commercial gym.', ['muscle', 'L1'],
    { goal: 'muscle' }, who(27, 185), exp(0.3), sched(3, 60), kit('BASIC_GYM', [], NO_BALL)],
  ['muscle-l2-4x75-upper-lower-focus-chest', 'Aesthetics L2, 4 x 75 upper / lower split, Focus chest.', ['muscle', 'L2', 'split', 'focus'],
    { goal: 'muscle', priority_muscles: ['chest'] }, who(31, 180), exp(2), sched(4, 75), prefs({ split_style: 'upper_lower' })],
  ['muscle-l3-5x90-focus-glutes-hams', 'Aesthetics L3, 5 x 90, Focus glutes + hamstrings (two lines of one group: the per-group ceiling question D7).', ['muscle', 'L3', 'focus'],
    { goal: 'muscle', priority_muscles: ['glutes', 'hamstrings'] }, who(28, 140), exp(5), sched(5, 90)],
  ['muscle-l3-6x90-ppl-v-taper', 'Aesthetics L3, 6 x 90 push / pull / legs, Focus V-taper (uses both Focus slots), 2 completed blocks.', ['muscle', 'L3', 'split', 'focus'],
    { goal: 'muscle', priority_muscles: ['v_taper'], lift_style: 'volume_lighter' }, who(26, 190), exp(6), sched(6, 90), prefs({ split_style: 'ppl' }),
    plan('fixed_12', ['body'], { previous_cycles: { count: 2, last_had_holds_or_pain: false }, just_finished_block: true })],
  ['muscle-l3-6x120-goal-muscle-edge', 'EDGE: 6 x 120 with goal muscle (not a competitive athlete: over 90 min is clamped and warned). Focus quads + calves.', ['muscle', 'L3', 'edge', 'focus'],
    { goal: 'muscle', priority_muscles: ['quads', 'calves'] }, who(33, 205), exp(8), sched(6, 120)],
  ['muscle-l2-2x45-edge', 'EDGE: aesthetics L2 on 2 x 45: eight groups cannot fit; the policy must pick by priority.', ['muscle', 'L2', 'edge'],
    { goal: 'muscle' }, who(36, 160), exp(2), sched(2, 45)],
  ['muscle-l2-3x30-edge', 'EDGE: aesthetics L2 on 3 x 30 minutes, Focus biceps.', ['muscle', 'L2', 'edge', 'focus'],
    { goal: 'muscle', priority_muscles: ['biceps'] }, who(29, 175), exp(1.5), sched(3, 30)],
  ['muscle-l2-4x45-home-db-focus-arms', 'Aesthetics L2 at home: dumbbells + bench only, 4 x 45, Focus biceps + triceps.', ['muscle', 'L2', 'home', 'focus'],
    { goal: 'muscle', priority_muscles: ['biceps', 'triceps'] }, who(34, 165), exp(2), sched(4, 45), kit('HOME_DB_BENCH', [], { heaviest_db_pair: 50, ...NO_BALL })],
  ['muscle-older-62-3x60-machines-shoulder', 'Aesthetics at 62, 3 x 60, machines preferred, mild shoulder pain (overhead).', ['muscle', 'older', 'pain'],
    { goal: 'muscle' }, who(62, 172), exp(4), sched(3, 60), kit('FULL_GYM', [], NO_BALL, [], 'machines'), pain(['shoulder', 'mild', ['overhead'], 'right'])],
  ['muscle-l3-4x90-heavy-style-focus-back', 'Aesthetics L3, 4 x 90 full body, heavier powerlifting-style compounds (strength rest on the work lifts), Focus back, strength tests.', ['muscle', 'L3', 'focus', 'tests'],
    { goal: 'muscle', priority_muscles: ['back'], lift_style: 'heavy_powerlifting' }, who(30, 200), exp(4), sched(4, 90), plan('fixed_12', ['strength'])],
  ['muscle-l2-3x45-hotel-maintenance', 'Maintenance block (vacation, limited kit): hotel gym, 3 x 45, 3 weeks. Flat block: no steps, floors exempt.', ['muscle', 'L2', 'maintenance', 'flat'],
    { goal: 'muscle' }, who(41, 178), exp(3), sched(3, 45), kit('HOTEL_GYM', [], { heaviest_db_pair: 50, ...NO_BALL }),
    plan('maintenance_4_6', ['none'], { maint_reason: 'vacation_limited_kit', maint_weeks: 3 })],
  ['muscle-l2-4x60-year-plan', 'Aesthetics L2, 4 x 60, the year plan (several stairway blocks, recovery weeks between them).', ['muscle', 'L2', 'year'],
    { goal: 'muscle' }, who(25, 155), exp(1.5), sched(4, 60), plan('year')],
  ['muscle-l2-5x60-fixed-8-kg-es', 'Aesthetics L2, 5 x 60, 8 weeks, Spanish output, kilograms, Focus shoulders.', ['muscle', 'L2', 'focus', 'es'],
    { goal: 'muscle', lang: 'es', units: 'kg', body_weight: { value: 68, unit: 'kg' }, release: { accepted: true, version: 'release.client', lang: 'es', guardian: null }, priority_muscles: ['shoulders'] },
    { age: 32 }, exp(2), sched(5, 60), plan('fixed_8')],

  // ---------------------------------------------------------------- strength
  ['strength-l2-3x90-home-barbell', 'Strength L2, 3 x 90, home barbell + rack.', ['strength', 'L2', 'home'],
    { goal: 'strength' }, who(35, 198), exp(2), sched(3, 90), kit('HOME_BARBELL', [], { heaviest_db_pair: 60, ...NO_BALL })],
  ['strength-l3-4x90-tests', 'Strength L3, 4 x 90 conjugate four-role days, rep-max tests in week 1 and the last week.', ['strength', 'L3', 'tests'],
    { goal: 'strength', lift_style: 'heavy_powerlifting' }, who(29, 215), exp(5), sched(4, 90), plan('fixed_12', ['strength'])],
  ['strength-l1-2x60-55-low-back', 'Strength beginner at 55, 2 x 60, mild low-back pain (bending forward).', ['strength', 'L1', 'pain'],
    { goal: 'strength' }, who(55, 190), exp(0.4), sched(2, 60), pain(['lower_back', 'mild', ['bending_forward']])],
  ['strength-l3-5x75', 'Strength L3, 5 x 75.', ['strength', 'L3'],
    { goal: 'strength' }, who(27, 180), exp(4), sched(5, 75)],
  ['strength-l2-6x60-fixed-8', 'Strength L2, 6 x 60, 8 weeks.', ['strength', 'L2'],
    { goal: 'strength' }, who(24, 175), exp(2), sched(6, 60), plan('fixed_8', ['strength'])],
  ['powerlifter-raw-4x120-meet', 'Competitive raw powerlifter, 4 x 120, meet in 14 weeks (competition date).', ['athletic', 'strength-sport', 'L3', 'competitive', 'long'],
    comp('powerlifting', 'raw', 'amateur', meet('2027-01-23'), 0), who(31, 220), exp(6), sched(4, 120), kit('FULL_GYM', ['barbell_bumpers_platform'], NO_BALL), plan('fixed_12', ['strength'])],
  ['weightlifter-5x90', 'Competitive Olympic weightlifter, 5 x 90, no season date.', ['athletic', 'strength-sport', 'L3', 'competitive'],
    comp('olympic_weightlifting', null, 'amateur', NO_SEASON, 0), who(24, 181), exp(4), sched(5, 90), kit('FULL_GYM', ['barbell_bumpers_platform'])],
  ['bodybuilder-6x120-edge', 'EDGE: competitive bodybuilder (classic physique), 6 x 120, show in 20 weeks, Focus chest + back.', ['athletic', 'physique-sport', 'L3', 'competitive', 'edge', 'long', 'focus'],
    comp('bodybuilding_physique', 'classic', 'amateur', meet('2027-03-06'), 0), { priority_muscles: ['chest', 'back'] }, who(28, 198), exp(7), sched(6, 120), kit('FULL_GYM', [], NO_BALL)],

  // ---------------------------------------------------------------- competitive athletes
  ['swim-sprint-free-15-4x75', 'High-school sprint freestyler, 15, 4 x 75 dryland, season in 18 weeks.', ['athletic', 'swimming', 'youth', 'competitive'],
    comp('swimming', 'sprint', 'high_school', off('2027-02-15'), 6, [], 'free'), who(15, 132), youth('post_phv'), exp(1.5), sched(4, 75), plan('fixed_12', ['strength', 'jumps'])],
  ['swim-distance-im-2x45-edge', 'EDGE: college distance / IM swimmer with only 2 x 45 of dryland beside 8 pool sessions.', ['athletic', 'swimming', 'competitive', 'edge'],
    comp('swimming', 'distance', 'college', off('2027-01-18'), 7, [], 'im'), who(20, 160), exp(3), sched(2, 45)],
  ['football-qb-4x75', 'High-school quarterback, 17, 4 x 75, off-season.', ['athletic', 'football', 'youth', 'competitive'],
    comp('american_football', 'QB', 'high_school', off('2027-08-20'), 1), who(17, 185), youth('post_phv'), exp(2), sched(4, 75, null, '2027-01-11'), kit('FULL_GYM', FIELD, BIG_SPACE), plan('fixed_12', ['strength', 'speed_agility'])],
  ['football-wr-5x90', 'College wide receiver, 5 x 90, field kit, speed and jump tests.', ['athletic', 'football', 'L3', 'competitive'],
    comp('american_football', 'WR', 'college', off('2027-08-28'), 0), who(21, 195), exp(4), sched(5, 90, null, '2027-01-11'), kit('FULL_GYM', PLATFORM, BIG_SPACE), plan('fixed_12', ['strength', 'speed_agility', 'jumps'])],
  ['football-ol-4x105', 'College offensive lineman, 310 lb, 4 x 105 (over 90 min: competitive only).', ['athletic', 'football', 'L3', 'competitive', 'long'],
    comp('american_football', 'OL', 'college', off('2027-08-28'), 0), who(21, 310), exp(3), sched(4, 105, null, '2027-01-11'), kit('FULL_GYM', PLATFORM, BIG_SPACE)],
  ['football-kp-3x60', 'High-school kicker / punter, 16, 3 x 60.', ['athletic', 'football', 'youth', 'competitive'],
    comp('american_football', 'KP', 'high_school', off('2027-08-20'), 1), who(16, 165), youth('post_phv'), exp(1), sched(3, 60, null, '2027-02-01'), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['soccer-goalkeeper-3x60', 'Amateur goalkeeper, 3 x 60, season in 14 weeks.', ['athletic', 'soccer', 'competitive'],
    comp('soccer', 'goalkeeper', 'amateur', off('2027-01-18'), 2), who(26, 185), exp(2), sched(3, 60), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['soccer-forward-in-season-2x45-games-edge', 'EDGE: in-season forward, games on Saturday, 2 x 45 (Mon, Wed): flat in-season block, the hard day 48 h before the game.', ['athletic', 'soccer', 'competitive', 'in-season', 'edge', 'flat'],
    comp('soccer', 'forward', 'college', inSeason('2026-12-12'), 5, ['Sat']), who(20, 160), exp(3), sched(2, 45, ['Mon', 'Wed']), kit('FULL_GYM', FIELD, BIG_SPACE), plan('fixed_8')],
  ['basketball-guard-16-4x60', 'High-school guard, 16, 4 x 60, off-season.', ['athletic', 'basketball', 'youth', 'competitive'],
    comp('basketball', 'guard', 'high_school', off('2027-03-29'), 2), who(16, 150), youth('post_phv'), exp(1), sched(4, 60), plan('fixed_12', ['jumps', 'speed_agility'])],
  ['basketball-wing-2x30-edge', 'EDGE: college wing with 2 x 30 minutes: an athlete session shorter than its own fixed blocks.', ['athletic', 'basketball', 'competitive', 'edge'],
    comp('basketball', 'wing', 'college', off('2027-03-29'), 3), who(21, 205), exp(3), sched(2, 30)],
  ['basketball-big-in-season-2x60-games', 'In-season big, games Tuesday and Friday, 2 x 60 (Mon, Wed).', ['athletic', 'basketball', 'competitive', 'in-season', 'flat'],
    comp('basketball', 'big', 'college', inSeason('2027-03-06'), 5, ['Tue', 'Fri']), who(22, 240), exp(4), sched(2, 60, ['Mon', 'Wed'], '2026-11-30')],
  ['baseball-pitcher-4x75', 'College pitcher, 4 x 75, off-season (throwing-arm care, the pitcher volume reductions).', ['athletic', 'baseball', 'competitive'],
    comp('baseball', 'pitcher', 'college', off('2027-02-13'), 2), who(20, 200), exp(3), sched(4, 75), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['softball-catcher-3x60', 'High-school catcher, 17, 3 x 60, mild knee pain (deep knee bend).', ['athletic', 'softball', 'youth', 'competitive', 'pain'],
    comp('softball', 'catcher', 'high_school', off('2027-02-22'), 2), who(17, 150), youth('post_phv'), exp(1.5), sched(3, 60), pain(['knee', 'mild', ['deep_knee_bend'], 'left'])],
  ['hockey-forward-4x90', 'Junior hockey forward, 4 x 90, off-season.', ['athletic', 'hockey', 'L3', 'competitive'],
    comp('ice_hockey', 'forward', 'amateur', off('2027-09-13'), 1), who(19, 190), exp(3), sched(4, 90, null, '2027-04-12'), kit('FULL_GYM', PLATFORM, BIG_SPACE), plan('fixed_12', ['strength', 'jumps'])],
  ['hockey-goalie-3x45', 'Hockey goalie, 3 x 45, mild hip / groin pain (twisting).', ['athletic', 'hockey', 'competitive', 'pain'],
    comp('ice_hockey', 'goalie', 'amateur', off('2027-09-13'), 2), who(24, 185), exp(2), sched(3, 45, null, '2027-04-12'), pain(['hip_groin', 'mild', ['twisting']])],
  ['tennis-singles-3x75', 'College singles player, 3 x 75, off-season.', ['athletic', 'tennis', 'competitive'],
    comp('tennis', 'singles', 'college', off('2027-01-25'), 4), who(19, 155), exp(2), sched(3, 75), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['volleyball-outside-3x90-knee', 'Club outside hitter, 3 x 90, moderate knee pain (impact, deep knee bend).', ['athletic', 'volleyball', 'competitive', 'pain'],
    comp('volleyball', 'outside_opposite', 'college', off('2027-01-11'), 3), who(20, 165), exp(3), sched(3, 90), pain(['knee', 'moderate', ['impact', 'deep_knee_bend']])],
  ['volleyball-libero-15-4x45', 'Youth libero, 15, around peak growth, 4 x 45.', ['athletic', 'volleyball', 'youth', 'competitive'],
    comp('volleyball', 'libero', 'youth_club', off('2027-03-01'), 3), who(15, 120), youth('circa_phv'), exp(0.5), sched(4, 45)],
  ['wrestling-middle-3x60-meet', 'High-school wrestler, 17, 3 x 60, tournament in 10 weeks (competition date).', ['athletic', 'wrestling', 'youth', 'competitive'],
    comp('wrestling', 'middle', 'high_school', meet('2026-12-19'), 4), who(17, 152), youth('post_phv'), exp(2), sched(3, 60), plan('fixed_8')],
  ['mma-light-4x75', 'Amateur MMA fighter, 4 x 75, no fight scheduled.', ['athletic', 'mma', 'competitive'],
    comp('mma', 'light', 'amateur', NO_SEASON, 5), who(27, 155), exp(3), sched(4, 75)],
  ['bjj-masters-3x45', 'Masters no-gi grappler, 41, 3 x 45, mild neck pain.', ['athletic', 'bjj', 'competitive', 'pain'],
    comp('bjj', 'nogi', 'masters', NO_SEASON, 3), who(41, 180), exp(2), sched(3, 45), pain(['neck', 'mild'])],
  ['sprinter-100m-4x90', 'College 100 / 200 m sprinter, 4 x 90, track available, speed and jump tests.', ['athletic', 'sprinter', 'L3', 'competitive'],
    comp('track_and_field', 'sprints', 'college', off('2027-03-13'), 4), who(21, 170), exp(4), sched(4, 90), kit('FULL_GYM', PLATFORM, BIG_SPACE), plan('fixed_12', ['speed_agility', 'jumps'])],
  ['sprinter-field-kit-only-3x60', 'Club sprinter with a field kit only (no weights): the no-equipment template for a competitive athlete.', ['athletic', 'sprinter', 'competitive', 'no-equipment'],
    comp('track_and_field', 'sprints', 'amateur', off('2027-04-03'), 3), who(23, 160), exp(1.5), sched(3, 60), kit('FIELD_TRACK_KIT', [], { ...BIG_SPACE, medball_lb_owned: [6, 8], box_height_in: 20 })],
  ['thrower-4x120', 'College thrower (shot / discus), 4 x 120.', ['athletic', 'throws', 'L3', 'competitive', 'long'],
    comp('track_and_field', 'throws', 'college', off('2027-03-13'), 4), who(22, 250), exp(5), sched(4, 120), kit('FULL_GYM', PLATFORM, { ...BIG_SPACE, medball_lb_owned: [8, 10, 14, 20] })],
  ['marathoner-2x60', 'Marathon runner, 38, 2 x 60 of strength beside 5 runs, race in 16 weeks.', ['athletic', 'distance-runner', 'competitive'],
    comp('distance_running', 'marathon', 'amateur', meet('2027-02-07'), 5), who(38, 150), exp(1.5), sched(2, 60, ['Tue', 'Fri'])],
  ['cross-country-14-3x45-bodyweight', 'Cross-country runner, 14, before peak growth, 3 x 45 with no equipment.', ['athletic', 'distance-runner', 'youth', 'competitive', 'no-equipment'],
    comp('distance_running', 'cross_country', 'youth_club', off('2027-08-23'), 4), who(14, 105), youth('pre_phv'), exp(0), sched(3, 45, null, '2027-03-01'), kit('BODYWEIGHT', [], { ...NO_BALL, running_space: '40_60m_or_track', cardio_options: ['run'] })],
  ['hyrox-open-4x75', 'Competitive HYROX open, 4 x 75 (2 strength + 2 hybrid days), race in 12 weeks.', ['athletic', 'hyrox', 'competitive'],
    comp('hyrox', 'open', 'amateur', meet('2027-01-09'), 2), who(34, 175), exp(3), sched(4, 75), kit('FULL_GYM', ['sled', 'open_space_long'], { ...BIG_SPACE, cardio_options: ['run', 'rower', 'ski_erg', 'bike'], medball_lb_owned: [14, 20] })],
  ['lacrosse-midfield-3x75', 'College lacrosse midfielder (women), 3 x 75.', ['athletic', 'lacrosse', 'competitive'],
    comp('lacrosse', 'midfield', 'college', off('2027-02-06'), 2, [], 'w'), who(20, 140), exp(2), sched(3, 75), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['rugby-forwards-4x90', 'Club rugby forward, 4 x 90, heavier powerlifting-style lifts.', ['athletic', 'rugby', 'L3', 'competitive'],
    comp('rugby', 'forwards', 'amateur', off('2027-03-06'), 2), { lift_style: 'heavy_powerlifting' }, who(26, 235), exp(4), sched(4, 90), kit('FULL_GYM', PLATFORM, BIG_SPACE)],
  ['golf-masters-58-2x45', 'Competitive masters golfer, 58, 2 x 45, mild low-back pain (twisting).', ['athletic', 'golf', 'competitive', 'active-aging', 'pain'],
    comp('golf', null, 'masters', NO_SEASON, 2), who(58, 185), exp(1), sched(2, 45), pain(['lower_back', 'mild', ['twisting']])],
  ['gymnast-13-3x60', 'Club gymnast (women), 13, around peak growth, 3 x 60.', ['athletic', 'gymnastics', 'youth', 'competitive'],
    comp('gymnastics', 'womens', 'youth_club', NO_SEASON, 5), who(13, 95), youth('circa_phv'), exp(1), sched(3, 60)],
  ['cyclist-road-3x45', 'Road cyclist, 3 x 45 of strength, event in 15 weeks.', ['athletic', 'cycling', 'competitive'],
    comp('cycling', 'road', 'amateur', meet('2027-01-30'), 5), who(36, 158), exp(1), sched(3, 45)],
  ['triathlete-70-3-2x45', 'Half-distance triathlete, 44, 2 x 45, kettlebells only.', ['athletic', 'triathlon', 'competitive', 'home'],
    comp('triathlon', '70_3', 'amateur', meet('2027-04-10'), 6), who(44, 165), exp(1), sched(2, 45), kit('KB_ONLY', [], { ...NO_BALL, cardio_options: ['run', 'bike'] })],
  ['climber-boulder-3x60-elbow', 'Competitive boulderer, 3 x 60, mild elbow pain (gripping).', ['athletic', 'climbing', 'competitive', 'pain'],
    comp('climbing', 'bouldering', 'amateur', NO_SEASON, 4), who(25, 145), exp(2), sched(3, 60), pain(['elbow', 'mild', ['gripping'], 'right'])],
  ['rower-sweep-4x60', 'College sweep rower, 4 x 60.', ['athletic', 'rowing', 'L3', 'competitive'],
    comp('rowing', 'sweep', 'college', off('2027-03-06'), 5), who(20, 195), exp(3), sched(4, 60)],
  ['crossfit-individual-5x90', 'Competitive CrossFit individual, 5 x 90, box kit.', ['athletic', 'crossfit', 'L3', 'competitive'],
    comp('crossfit', 'individual', 'amateur', meet('2027-02-27'), 0), who(27, 185), exp(5), sched(5, 90), kit('HOME_BARBELL', BOX, { heaviest_db_pair: 70, medball_lb_owned: [10, 14, 20], box_height_in: 24, running_space: '40_60m_or_track', cardio_options: ['run', 'rower', 'bike', 'ski_erg'] })],
  ['cheer-flyer-15-3x45', 'Cheer flyer, 15, 3 x 45.', ['athletic', 'cheer', 'youth', 'competitive'],
    comp('cheerleading', 'flyer', 'high_school', off('2027-08-16'), 3), who(15, 105), youth('post_phv'), exp(0.5), sched(3, 45, null, '2027-03-01')],

  // ---------------------------------------------------------------- stay athletic and active / recreational
  ['pickleball-57-3x45', 'Pickleball player, 57, 3 x 45, plays Tue / Sat (the 3 x 45 case of diagnosis 1.8: "trains only chest and calves").', ['active', 'pickleball', 'active-aging', 'L1'],
    act('rec_pickleball', ['Tue', 'Sat']), who(57, 172), exp(0.5), sched(3, 45), kit('BASIC_GYM', [], { heaviest_db_pair: 40, medball_lb_owned: [6, 8], box_height_in: 12, running_space: 'none', cardio_options: ['treadmill', 'bike'] })],
  ['pickleball-66-2x60-opt-in', 'Pickleball player, 66, 2 x 60, older athletic opt-in ON, mild ankle pain (impact).', ['active', 'pickleball', 'older', 'pain'],
    act('rec_pickleball', ['Wed', 'Sat', 'Sun']), who(66, 160), exp(3), sched(2, 60), kit('BASIC_GYM', [], { heaviest_db_pair: 35, medball_lb_owned: [6], box_height_in: 12, running_space: 'none', cardio_options: ['bike'] }),
    pain(['ankle_foot', 'mild', ['impact'], 'left']), prefs({ older_athletic_opt_in: true })],
  ['pickleball-52-2x45-no-core-edge', 'EDGE: the D1 client (pickleball, 52, 2 x 45, mild knee) with the core opener moved to the end.', ['active', 'pickleball', 'active-aging', 'L1', 'edge', 'pain'],
    act('rec_pickleball', ['Wed', 'Sat', 'Sun']), who(52, 180), exp(0.5), sched(2, 45), kit('BASIC_GYM', [], { heaviest_db_pair: 50, medball_lb_owned: [6, 8], box_height_in: 18, running_space: 'none', cardio_options: ['treadmill', 'bike'] }),
    pain(['knee', 'mild', ['deep_knee_bend'], 'right']), prefs({ core_position: 'end' })],
  ['hyrox-fitness-4x60', 'HYROX for fitness (stay active), 4 x 60.', ['active', 'hyrox', 'L2'],
    act('hyrox_fitness'), who(39, 168), exp(2), sched(4, 60), kit('FULL_GYM', ['sled', 'open_space_long'], { ...BIG_SPACE, cardio_options: ['run', 'rower', 'ski_erg'], medball_lb_owned: [14, 20] })],
  ['crossfit-class-3x60', 'CrossFit-style class member, 3 x 60, box kit.', ['active', 'crossfit-class', 'L2', 'class'],
    act('crossfit_class'), who(33, 150), exp(1.5), sched(3, 60), kit('HOME_BARBELL', BOX, { heaviest_db_pair: 50, medball_lb_owned: [10, 14, 20], box_height_in: 20, running_space: '40_60m_or_track', cardio_options: ['run', 'rower', 'bike'] }), plan('fixed_8', ['strength'])],
  ['crossfit-class-5x60', 'CrossFit-style class member, 5 x 60, 12 weeks, Focus none.', ['active', 'crossfit-class', 'L3', 'class'],
    act('crossfit_class'), who(30, 178), exp(4), sched(5, 60), kit('HOME_BARBELL', BOX, { heaviest_db_pair: 70, medball_lb_owned: [10, 14, 20], box_height_in: 24, running_space: '40_60m_or_track', cardio_options: ['run', 'rower', 'bike', 'ski_erg'] })],
  ['tennis-rec-62-2x45-elbow', 'Recreational tennis, 62, 2 x 45, moderate elbow pain (gripping).', ['active', 'tennis', 'older', 'pain'],
    act('rec_tennis', ['Tue', 'Sat']), who(62, 158), exp(1), sched(2, 45, ['Mon', 'Thu']), kit('BASIC_GYM', [], { heaviest_db_pair: 30, medball_lb_owned: [6], box_height_in: 12, running_space: 'none', cardio_options: ['bike'] }), pain(['elbow', 'moderate', ['gripping'], 'right'])],
  ['rec-league-soccer-3x60', 'Adult-league soccer, 3 x 60, plays Sunday.', ['active', 'soccer', 'L2'],
    act('rec_league', ['Sun'], { league_sport: 'soccer' }), who(34, 175), exp(1.5), sched(3, 60, ['Mon', 'Wed', 'Fri']), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['run-fitness-2x45-kb-only', 'Runs for fitness, 2 x 45 at home with kettlebells.', ['active', 'runner', 'home'],
    act('run_fitness', ['Sat']), who(45, 150), exp(1), sched(2, 45, ['Tue', 'Thu']), kit('KB_ONLY', [], { ...NO_BALL, cardio_options: ['run'] })],
  ['hike-ruck-68-3x45-knee-back', 'Hiker, 68, 3 x 45, dumbbells + bench, mild knee and low-back pain.', ['active', 'hiking', 'older', 'pain', 'home'],
    act('hike_ruck', ['Sun']), who(68, 165), exp(2), sched(3, 45), kit('HOME_DB_BENCH', [], { heaviest_db_pair: 25, ...NO_BALL }), pain(['knee', 'mild', ['deep_knee_bend']], ['lower_back', 'mild', ['bending_forward']])],
  ['weekend-warrior-3x60-event', 'Weekend warrior, 3 x 60, an event in 10 weeks (prep overlay: the hardest weeks end 1 week before).', ['active', 'weekend-warrior', 'event'],
    act('weekend_warrior', ['Sat'], { event_date: '2026-12-19' }), who(37, 190), exp(2), sched(3, 60), plan('fixed_12', ['cardio'])],
  ['golf-rec-72-2x30-bodyweight-edge', 'EDGE: recreational golfer, 72, 2 x 30, no equipment.', ['active', 'golf', 'older', 'edge', 'no-equipment'],
    act('rec_golf', ['Wed', 'Sat']), who(72, 180), exp(0), sched(2, 30), kit('BODYWEIGHT', [], NO_BALL)],
  ['combat-fitness-striking-4x60', 'Boxing for fitness (striking), 4 x 60.', ['active', 'combat', 'L2'],
    act('rec_combat_fitness', ['Wed'], { style: 'striking' }), who(29, 165), exp(2), sched(4, 60, ['Mon', 'Tue', 'Thu', 'Fri'])],
  ['lap-swim-59-3x60', 'Lap swimmer, 59, 3 x 60, mild shoulder pain.', ['active', 'swimming', 'active-aging', 'pain'],
    act('lap_swim', ['Tue', 'Thu']), who(59, 170), exp(3), sched(3, 60), pain(['shoulder', 'mild', ['overhead'], 'left'])],
  ['ski-prep-3x60-fixed-8', 'Ski-season prep, 3 x 60, 8 weeks.', ['active', 'ski', 'L2'],
    act('ski_snow_prep'), who(42, 185), exp(2), sched(3, 60), plan('fixed_8', ['jumps'])],
  ['athletic-no-sport-3x60', 'Goal "athletic" with no sport (general athletic profile), 3 x 60.', ['athletic', 'no-sport', 'L2'],
    { goal: 'athletic', sport: { competitive: 'none', sport: null, position: null, position_detail: null, level_of_play: null, season: null, practice: null } }, who(28, 175), exp(2), sched(3, 60), kit('FULL_GYM', FIELD, BIG_SPACE)],
  ['athletic-rec-league-basketball-2x60', 'Goal "athletic", recreational: league basketball twice a week, 2 x 60.', ['athletic', 'basketball', 'recreational'],
    { goal: 'athletic', sport: { competitive: 'recreational', sport: null, position: null, position_detail: null, level_of_play: null, season: null, practice: null },
      activity: { ids: ['rec_league'], play_days: ['Wed', 'Sun'], event_date: null, league_sport: 'basketball' } }, who(31, 195), exp(3), sched(2, 60, ['Mon', 'Fri'])],

  // ---------------------------------------------------------------- fat loss / general (gym and bootcamp)
  ['fat-loss-gym-l1-4x60-focus-glutes', 'Fat loss in the gym, beginner, 4 x 60, Focus glutes.', ['fat_loss', 'L1', 'focus'],
    { goal: 'fat_loss', format: 'gym', priority_muscles: ['glutes'] }, who(38, 190), exp(0.2), sched(4, 60)],
  ['fat-loss-bootcamp-l1-3x45', 'Fat-loss bootcamp circuits, beginner, 3 x 45, field kit + dumbbells.', ['fat_loss', 'bootcamp', 'L1', 'circuit'],
    { goal: 'fat_loss', format: 'bootcamp' }, who(44, 210), exp(0), sched(3, 45), kit('FIELD_TRACK_KIT', ['dumbbell', 'kettlebell'], { heaviest_db_pair: 30, medball_lb_owned: [6, 8, 10], box_height_in: 16, running_space: '10_20m', cardio_options: ['run'] })],
  ['fat-loss-bootcamp-l2-5x45', 'Fat-loss bootcamp, L2, 5 x 45.', ['fat_loss', 'bootcamp', 'L2', 'circuit'],
    { goal: 'fat_loss', format: 'bootcamp' }, who(36, 175), exp(2), sched(5, 45), kit('FIELD_TRACK_KIT', ['dumbbell', 'kettlebell'], { heaviest_db_pair: 40, medball_lb_owned: [8, 10, 14], box_height_in: 20, running_space: '10_20m', cardio_options: ['run'] })],
  ['fat-loss-gym-l2-6x60', 'Fat loss in the gym, L2, 6 x 60, extra cardio (+2).', ['fat_loss', 'L2'],
    { goal: 'fat_loss', format: 'gym' }, who(33, 200), exp(2), sched(6, 60), prefs({ cardio_adjust: 2 })],
  ['general-gym-l2-3x60', 'General fitness in the gym, 47, 3 x 60.', ['general', 'L2'],
    { goal: 'general', format: 'gym' }, who(47, 182), exp(2), sched(3, 60)],
  ['general-gym-l1-2x30-edge', 'EDGE: general fitness beginner on 2 x 30.', ['general', 'L1', 'edge'],
    { goal: 'general', format: 'gym' }, who(33, 165), exp(0.1), sched(2, 30)],
  ['general-bootcamp-l2-4x45', 'General-fitness bootcamp, 4 x 45 (circuit variant).', ['general', 'bootcamp', 'L2', 'circuit'],
    { goal: 'general', format: 'bootcamp' }, who(40, 170), exp(1.5), sched(4, 45), kit('FIELD_TRACK_KIT', ['dumbbell', 'kettlebell'], { heaviest_db_pair: 35, medball_lb_owned: [6, 8, 10], box_height_in: 20, running_space: '10_20m', cardio_options: ['run'] })],
  ['general-bodyweight-74-3x45-edge', 'EDGE: no-equipment older adult: 74, 3 x 45, bodyweight only, mild knee pain, no floor work.', ['general', 'older', 'edge', 'no-equipment', 'pain'],
    { goal: 'general', format: 'gym', exclusions: ['floor_work'] }, who(74, 155), exp(0), sched(3, 45), kit('BODYWEIGHT', [], NO_BALL), pain(['knee', 'mild', ['deep_knee_bend']])],
  ['general-kb-only-4x45', 'General fitness with kettlebells only, 4 x 45.', ['general', 'L2', 'home'],
    { goal: 'general', format: 'gym' }, who(35, 160), exp(1.2), sched(4, 45), kit('KB_ONLY', [], { ...NO_BALL, cardio_options: ['run'] })],
  ['general-gym-l2-5x75-second-cycle', 'General fitness, 5 x 75, one completed block (+1 on the ceilings), all supersets for fatigue.', ['general', 'L2'],
    { goal: 'general', format: 'gym' }, who(29, 150), exp(2.5), sched(5, 75), prefs({ supersets_for_fatigue: true }), plan('fixed_12', ['strength', 'body'], { previous_cycles: { count: 1, last_had_holds_or_pain: false }, just_finished_block: true })],
  ['general-coach-client-81-2x45-hip', 'A coach\'s client, 81, 2 x 45, machines preferred, moderate hip pain; coach screen.', ['general', 'older', 'pain', 'coach'],
    { goal: 'general', format: 'gym', role: 'client', health_route: 'coach_screen', release: { accepted: true, version: 'release.coach', lang: 'en', guardian: null } },
    who(81, 150), exp(0.5), sched(2, 45), kit('BASIC_GYM', [], NO_BALL, [], 'machines'), pain(['hip_groin', 'moderate', ['twisting'], 'left'])],
  ['general-layoff-l1-4x60', 'Back after 8 months off (body treated as a beginner, L1), 4 x 60, no barbell, no jumping.', ['general', 'L1', 'layoff'],
    { goal: 'general', format: 'gym', exclusions: ['barbell', 'jumping'] }, who(43, 215), exp(6, 8), sched(4, 60)],
  ['general-maintenance-3x60-6wk', 'Planned maintenance, 3 x 60, 6 weeks (flat block, floors exempt).', ['general', 'L2', 'maintenance', 'flat'],
    { goal: 'general', format: 'gym' }, who(50, 176), exp(4), sched(3, 60), plan('maintenance_4_6', ['none'], { maint_reason: 'planned_maintenance', maint_weeks: 6 })],

  // ---------------------------------------------------------------- hybrid (CrossFit-style class model)
  ['hybrid-4x60', 'Hybrid (CrossFit-style class model), 4 x 60, box kit.', ['hybrid', 'L2', 'class'],
    { goal: 'hybrid' }, who(32, 172), exp(2), sched(4, 60), kit('HOME_BARBELL', BOX, { heaviest_db_pair: 60, medball_lb_owned: [10, 14, 20], box_height_in: 24, running_space: '40_60m_or_track', cardio_options: ['run', 'rower', 'bike'] })],
  ['hybrid-3x75-full-gym', 'Hybrid, 3 x 75, full gym, strength + cardio tests.', ['hybrid', 'L2', 'class', 'tests'],
    { goal: 'hybrid' }, who(28, 165), exp(1.5), sched(3, 75), kit('FULL_GYM', ['barbell_bumpers_platform', 'rings'], { ...BIG_SPACE, cardio_options: ['run', 'rower', 'bike', 'ski_erg'], medball_lb_owned: [10, 14, 20] }), plan('fixed_12', ['strength', 'cardio'])],
  ['hybrid-l3-5x90', 'Hybrid L3, 5 x 90.', ['hybrid', 'L3', 'class'],
    { goal: 'hybrid' }, who(30, 190), exp(5), sched(5, 90), kit('FULL_GYM', ['barbell_bumpers_platform', 'rings'], { ...BIG_SPACE, cardio_options: ['run', 'rower', 'bike', 'ski_erg'], medball_lb_owned: [10, 14, 20] })],
  ['hybrid-2x45-edge', 'EDGE: hybrid on 2 x 45: the class lift, the skill and the WOD leave little room.', ['hybrid', 'L2', 'class', 'edge'],
    { goal: 'hybrid' }, who(37, 180), exp(1), sched(2, 45), kit('HOME_BARBELL', BOX, { heaviest_db_pair: 50, medball_lb_owned: [10, 14], box_height_in: 20, running_space: '10_20m', cardio_options: ['rower'] })],
  ['hybrid-6x60', 'Hybrid, 6 x 60, 8 weeks.', ['hybrid', 'L2', 'class'],
    { goal: 'hybrid' }, who(26, 160), exp(2), sched(6, 60), kit('HOME_BARBELL', BOX, { heaviest_db_pair: 60, medball_lb_owned: [10, 14, 20], box_height_in: 24, running_space: '40_60m_or_track', cardio_options: ['run', 'rower', 'bike'] }), plan('fixed_8')]
];

export function buildIntakes() {
  const seen = new Set();
  return SPECS.map(([slug, comment, tags, ...overrides], k) => {
    if (seen.has(slug)) throw new Error('duplicate slug ' + slug);
    seen.add(slug);
    const n = String(k + 1).padStart(2, '0');
    let it = base();
    for (const o of overrides) it = merge(it, o);
    // a minor needs the guardian release; a spec that forgot it is a corpus bug, not an engine failure
    if (it.age < 18 && it.release.version !== 'release.minor') throw new Error(slug + ': age < 18 needs youth()');
    const out = { schema: it.schema, _comment: comment, _bench: { n: k + 1, tags, edge: tags.includes('edge') }, id: 'bench-' + n + '-' + slug };
    for (const [key, v] of Object.entries(it)) if (key !== 'schema') out[key] = v;
    return { file: n + '-' + slug + '.json', intake: out };
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const all = buildIntakes();
  if (process.argv.includes('--list')) {
    for (const { file, intake } of all) console.log(file.padEnd(52), intake.goal.padEnd(9), intake.schedule.days_per_week + ' x ' + intake.schedule.session_minutes, ' ', intake._bench.tags.join(', '));
  } else {
    fs.mkdirSync(OUT, { recursive: true });
    const keep = new Set(all.map(x => x.file));
    for (const f of fs.readdirSync(OUT)) if (f.endsWith('.json') && !keep.has(f)) fs.unlinkSync(path.join(OUT, f));
    for (const { file, intake } of all) fs.writeFileSync(path.join(OUT, file), JSON.stringify(intake, null, 2) + '\n');
    console.log('wrote ' + all.length + ' intakes to ' + path.relative(process.cwd(), OUT));
  }
}
