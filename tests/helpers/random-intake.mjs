// tests/helpers/random-intake.mjs - deterministic generator of valid intake/2 objects (engine/CONTRACTS.md §2.1, §8). Owner: B4.
// randomIntake(i, model) is a pure function of (i, model): the same index always gives the same intake. The main axes are
// cycled (not drawn) so that any 300 consecutive indexes cover every goal (incl. `active`) x days 2-6 x
// all 8 equipment profiles x the listed ages x pain areas x every picker sport (incl. swimming) x every activity (incl.
// pickleball and HYROX) x plan modes fixed_12 / fixed_8 / maintenance / week_by_week / year (non-competitive) x older opt-in
// on / off. v0.4: check-ins are retired (R3-VOL-02); old intakes still carry output_mode 'checkin' / 'logbook', so the corpus
// keeps sending them to prove they are planned exactly like plan_only (warning.checkin_retired). No safety flag is ever set
// and pain is never severe (the invariants want status ok).
import { hash53, addDays, WEEKDAYS } from '../../engine/util.mjs';

const GOALS = ['muscle', 'strength', 'athletic', 'active', 'fat_loss', 'general', 'hybrid'];
const AGES = [15, 16, 22, 29, 35, 44, 52, 57, 61, 66, 70];
const PAIN_AREAS = ['neck', 'shoulder', 'elbow', 'wrist_hand', 'upper_back', 'lower_back', 'hip_groin', 'knee', 'ankle_foot', 'other'];
const WORSE_WITH = { shoulder: ['overhead'], knee: ['deep_knee_bend'], lower_back: ['bending_forward'], ankle_foot: ['impact'], wrist_hand: ['gripping'], hip_groin: ['twisting'] };
const MODES = ['fixed_12', 'fixed_8', 'maintenance_4_6', 'week_by_week', 'year'];
const MAINT_REASONS = ['vacation_limited_kit', 'travel_moving_season_change', 'planned_maintenance'];
const PRIORITY = ['quads', 'glutes', 'hamstrings', 'back', 'chest', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'calves', 'core', 'v_taper'];
const TESTS = ['strength', 'cardio', 'speed_agility', 'jumps', 'body'];
const LEVELS_OF_PLAY = ['youth_club', 'high_school', 'college', 'pro', 'masters', 'amateur'];
const CARDIO = ['run', 'treadmill', 'bike', 'rower', 'ski_erg'];
const SPACE = ['none', '10_20m', '40_60m_or_track'];
const EXTRA_TOKENS = ['medball', 'kettlebell', 'dumbbell', 'jump_rope', 'plyo_box_high', 'hurdles', 'cardio_machine_cal'];
const DAY_PATTERNS = {
  2: [['Mon', 'Thu'], ['Tue', 'Fri'], ['Mon', 'Wed']],
  3: [['Mon', 'Wed', 'Fri'], ['Tue', 'Thu', 'Sat'], ['Mon', 'Tue', 'Thu']],
  4: [['Mon', 'Tue', 'Thu', 'Fri'], ['Mon', 'Wed', 'Fri', 'Sat'], ['Tue', 'Wed', 'Fri', 'Sun']],
  5: [['Mon', 'Tue', 'Wed', 'Fri', 'Sat'], ['Mon', 'Tue', 'Thu', 'Fri', 'Sat']],
  6: [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']]
};

/** mulberry32 seeded from hash53 @param {string} s @returns {() => number} */
function rng(s) {
  let a = parseInt(hash53(s).slice(0, 8), 16) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {number} i index (0, 1, 2 …)  @param {object} model a loaded Model (picker sports, activities, kit profiles)
 * @param {{seed?:string}} [opts]
 * @returns {object} a valid intake/2
 */
export function randomIntake(i, model, opts = {}) {
  const r = rng((opts.seed || 'b4-invariants') + '|' + i);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const R = model.rules;
  const picker = model.profiles.picker;
  const kitProfiles = R.equipment.intake_profiles;

  const goal = GOALS[i % GOALS.length];
  const days = 2 + (i % 5);
  const age = AGES[(i * 7 + Math.floor(i / 11)) % AGES.length];
  const profile = kitProfiles[(i + Math.floor(i / 8)) % kitProfiles.length];
  const youth = age < R.levels.youth_age;
  const older = age >= R.population.older.from_age;

  let competitive = 'none';
  if (goal === 'athletic') competitive = i % 3 === 2 ? 'recreational' : i % 3 === 1 ? 'competitive' : (i % 6 === 0 ? 'none' : 'competitive');
  let mode = MODES[Math.floor(i / 7) % MODES.length];
  if (mode === 'year' && competitive === 'competitive') mode = 'fixed_12';
  const output_mode = mode === 'week_by_week' ? (i % 2 ? 'checkin' : 'logbook') : pick(['plan_only', 'plan_only', 'checkin']);
  // (v0.5: session minutes are no longer an input, R4-SES-01)

  const weekdays = DAY_PATTERNS[days][Math.floor(r() * DAY_PATTERNS[days].length)];
  const start_date = addDays('2026-10-12', 7 * (i % 9));

  let sport = null;
  if (goal === 'athletic') {
    if (competitive === 'competitive') {
      const forceSwim = i % 17 === 1;
      const ps = forceSwim ? picker.sports.find(s => s.id === 'swimming') : picker.sports[(Math.floor(i / 3) * 5 + i) % picker.sports.length];
      const pos = ps.positions.length ? (r() < 0.8 ? pick(ps.positions) : null) : null;
      const sc = ps.second_choice && ps.second_choice.options && ps.second_choice.options.length ? pick(ps.second_choice.options).value : null;
      const weeksOut = 6 + Math.floor(r() * 36);
      const stype = pick(['next_season_start', 'next_season_start', 'next_season_start', 'no_season', 'in_season_until', 'competition_date']);
      sport = {
        competitive: 'competitive', sport: ps.id, position: pos ? pos.value : null,
        position_detail: sc,
        level_of_play: youth ? pick(['youth_club', 'high_school']) : pick(LEVELS_OF_PLAY),
        season: stype === 'no_season' ? { type: 'no_season', date: null } : { type: stype, date: addDays(start_date, 7 * weeksOut) },
        practice: { practice_days_per_week: Math.floor(r() * 6), game_days: r() < 0.3 ? [pick(['Sat', 'Sun'])] : [] }
      };
    } else {
      sport = { competitive, sport: null, position: null, position_detail: null, level_of_play: null, season: null, practice: null };
    }
  }

  let activity = null;
  const acts = picker.activities;
  const needActivity = goal === 'active' || competitive === 'recreational';
  if (needActivity || ((goal === 'fat_loss' || goal === 'general') && i % 4 === 0)) {
    const forced = i % 19 === 3 ? 'rec_pickleball' : i % 19 === 7 ? 'hyrox_fitness' : null;
    const a = forced ? acts.find(x => x.id === forced) : acts[(Math.floor(i / 7) * 3 + i) % acts.length];
    const free = WEEKDAYS.filter(d => !weekdays.includes(d));
    const play = free.filter(() => r() < 0.4).slice(0, 3);
    activity = { ids: [a.id], play_days: play, event_date: null };
    if (a.league_sport && a.league_sport.length) activity.league_sport = pick(a.league_sport).value;
    if (a.style && a.style.length) activity.style = pick(a.style).value;
    if (i % 23 === 5) { const b = acts[(i * 5) % acts.length]; if (b.id !== a.id) activity.ids.push(b.id); }
  }

  const pain = [];
  if (i % 3 === 0) {
    const area = PAIN_AREAS[Math.floor(i / 3) % PAIN_AREAS.length];
    pain.push({ area, side: pick(['left', 'right', 'both']), severity: i % 2 ? 'mild' : 'moderate', worse_with: WORSE_WITH[area] || [] });
  }

  const role = i % 6 === 5 ? 'client' : 'self';
  const health_route = role === 'client' ? (i % 12 === 11 ? 'coach_own_sop' : 'coach_screen') : null;
  const version = youth ? 'release.minor' : role === 'client' ? 'release.coach' : 'release.client';
  const lang = i % 4 === 1 ? 'es' : 'en';
  const units = i % 5 === 2 ? 'kg' : 'lb';
  const bw = 110 + Math.floor(r() * 150);

  const priority = [];
  if ((goal === 'muscle' || goal === 'strength' || goal === 'fat_loss') && r() < 0.5) {
    priority.push(pick(PRIORITY));
    if (r() < 0.5) { const p2 = pick(PRIORITY); if (p2 !== priority[0]) priority.push(p2); }
  }
  let split = 'default';
  if (goal === 'muscle' && days === 6 && i % 2) split = 'ppl';
  if (goal === 'muscle' && days === 4 && i % 2) split = 'upper_lower';

  const tests = r() < 0.3 ? ['none'] : TESTS.filter(() => r() < 0.4);
  const owned = r() < 0.6 ? [6, 8, 10, 14, 20].filter(() => r() < 0.6) : [];
  const extras = EXTRA_TOKENS.filter(() => r() < 0.15);

  return {
    schema: 'intake/2', _comment: 'random intake ' + i, id: 'random-' + i, lang, units, role, health_route,
    safety: health_route === 'coach_own_sop' ? null : { heart: false, surgery_6mo: false, pregnant_postpartum_6mo: false, injury_in_treatment: false, doctor_said_no: false },
    release: { accepted: true, version, lang, guardian: youth ? true : null },
    age,
    body_weight: units === 'kg' ? { value: Math.round(bw / 2.20462), unit: 'kg' } : { value: bw, unit: 'lb' },
    experience: { years_consistent: pick([0, 0.5, 1, 2, 3, 4, 6, 10]), months_off_last_2y: r() < 0.15 ? 7 : 0, former_competitor: r() < 0.05 },
    goal,
    format: goal === 'fat_loss' || goal === 'general' ? (i % 2 ? 'bootcamp' : 'gym') : null,
    sport, activity,
    priority_muscles: priority,
    lift_style: pick(['volume_lighter', 'balanced', 'balanced', 'heavy_powerlifting']),
    schedule: { days_per_week: days, weekdays: weekdays.slice(), start_date },
    plan: {
      mode, maint_reason: mode === 'maintenance_4_6' ? pick(MAINT_REASONS) : null, maint_weeks: mode === 'maintenance_4_6' ? 1 + Math.floor(r() * 8) : null,
      previous_cycles: { count: r() < 0.25 ? 1 + Math.floor(r() * 2) : 0, last_had_holds_or_pain: r() < 0.1 },
      tests: tests.length ? tests : ['none'], just_finished_block: r() < 0.1
    },
    equipment: {
      profile, extras, machines: [], preference: pick(['none', 'none', 'machines', 'free_weights', 'dumbbells']),
      detail: { heaviest_db_pair: r() < 0.5 ? 50 : null, medball_lb_owned: owned, box_height_in: r() < 0.5 ? 20 : null, running_space: pick(SPACE), cardio_options: CARDIO.filter(() => r() < 0.4) }
    },
    pain,
    exclusions: r() < 0.1 ? [pick(['running', 'jumping', 'barbell', 'lunges', 'overhead_pressing', 'floor_work', 'machines'])] : [],
    output_mode,
    prefs: {
      core_position: r() < 0.85 ? 'start' : pick(['after_plyos', 'after_strength', 'end']), optional_days: 'separate', variety_ab: false,
      heavy_unilateral: r() < 0.1, supersets_for_fatigue: r() < 0.15, cardio_adjust: pick([0, 0, 0, -1, 1, 2]),
      older_athletic_opt_in: older ? i % 2 === 0 : false, split_style: split
    },
    growth_stage: youth && goal === 'athletic' ? pick(['pre_phv', 'circa_phv', 'post_phv', 'not_sure']) : null,
    email: null,
    coach_rule_pack_ids: []
  };
}

/** a competitive athlete for picker sport k (every sport incl. swimming once per sweep) @returns {object} intake/2 */
export function sportIntake(k, model) {
  const ps = model.profiles.picker.sports[k % model.profiles.picker.sports.length];
  const it = randomIntake(10000 + k, model, { seed: 'b4-sport-sweep' });
  const r = rng('b4-sport|' + k);
  it.id = 'sport-' + ps.id;
  it.goal = 'athletic';
  it.format = null;
  it.activity = null;
  it.priority_muscles = [];
  if (it.plan.mode === 'year') it.plan.mode = 'fixed_12';
  const pos = ps.positions.length ? ps.positions[Math.floor(r() * ps.positions.length)] : null;
  const sc = ps.second_choice && ps.second_choice.options && ps.second_choice.options.length ? ps.second_choice.options[Math.floor(r() * ps.second_choice.options.length)].value : null;
  it.sport = {
    competitive: 'competitive', sport: ps.id, position: pos ? pos.value : null, position_detail: sc,
    level_of_play: it.age < 18 ? 'high_school' : 'amateur',
    season: { type: 'next_season_start', date: addDays(it.schedule.start_date, 7 * (8 + (k % 24))) },
    practice: { practice_days_per_week: k % 5, game_days: [] }
  };
  it.growth_stage = it.age < 18 ? 'post_phv' : null;
  return it;
}

/** a "stay athletic and active" client for activity k (every activity incl. pickleball and HYROX once per sweep) @returns {object} intake/2 */
export function activityIntake(k, model) {
  const a = model.profiles.picker.activities[k % model.profiles.picker.activities.length];
  const it = randomIntake(20000 + k, model, { seed: 'b4-activity-sweep' });
  const r = rng('b4-activity|' + k);
  it.id = 'activity-' + a.id;
  it.goal = 'active';
  it.format = null;
  it.sport = null;
  it.priority_muscles = [];
  const free = WEEKDAYS.filter(d => !it.schedule.weekdays.includes(d));
  it.activity = { ids: [a.id], play_days: free.filter(() => r() < 0.5).slice(0, 3), event_date: null };
  if (a.league_sport && a.league_sport.length) it.activity.league_sport = a.league_sport[Math.floor(r() * a.league_sport.length)].value;
  if (a.style && a.style.length) it.activity.style = a.style[Math.floor(r() * a.style.length)].value;
  it.growth_stage = null;
  return it;
}

/** @param {number} n @param {object} model @param {{seed?:string, from?:number}} [opts] @returns {object[]} */
export function randomIntakes(n, model, opts = {}) {
  const from = opts.from || 0;
  return Array.from({ length: n }, (_, k) => randomIntake(from + k, model, opts));
}
