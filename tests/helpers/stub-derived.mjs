import { circuitWorkSeconds } from '../../engine/shape.mjs';
// tests/helpers/stub-derived.mjs - owner B3 (engine/BUILD_PLAN.md §2).
// Contract-shaped stand-ins for B2's Derived (intake.deriveValues) and Shape (shape.buildShape), hand-built from the
// sample intake + the CONTRACTS §9 acceptance table, so week / select / dose can be tested before (and next to) B2's
// real modules. Mechanical parts (kit tokens, shares, stairway week fields) are computed from the model rules.
import fs from 'node:fs';
import { loadModel } from '../../engine/model.mjs';
import { makeSeed, WEEKDAYS } from '../../engine/util.mjs';

let _fixture = null;
/** @returns {object} Model loaded from engine/fixtures/mini-model.json (cached) */
export function fixtureModel() {
  if (_fixture) return _fixture;
  const raw = JSON.parse(fs.readFileSync(new URL('../../engine/fixtures/mini-model.json', import.meta.url), 'utf8'));
  delete raw._fixture;
  _fixture = loadModel(raw);
  return _fixture;
}

export const SAMPLES = ['01-swimming', '02-football', '03-soccer', '04-crossfit-style-bootcamp', '05-bootcamp',
  '06-full-body-aesthetics', '07-push-pull-legs', '08-pickleball-genpop'];

/** @param {string} name e.g. '01-swimming' @returns {object} intake/2 */
export function loadIntake(name) {
  return JSON.parse(fs.readFileSync(new URL(`../../samples/intakes/${name}.json`, import.meta.url), 'utf8'));
}

/** seed exactly as CONTRACTS §1.3 (intakeForHash = intake without id, email, release.accepted_at / signer_name, _keys) */
export function stubSeed(intake, model) {
  const strip = (o) => {
    if (Array.isArray(o)) return o.map(strip);
    if (o && typeof o === 'object') {
      const r = {};
      for (const k of Object.keys(o)) if (!k.startsWith('_') && k !== 'id' && k !== 'email' && k !== 'accepted_at' && k !== 'signer_name') r[k] = strip(o[k]);
      return r;
    }
    return o;
  };
  return makeSeed(strip(intake), model.version);
}

// --- §9 acceptance table (the parts that need B2 logic) -------------------------------------------------------------
const athleteFill = { glutes: 'credit', side_delts: 'credit', biceps: 'credit', triceps: 'credit', rear_delts: 'own_sets' };
const T = {
  '01-swimming': {
    profile: { id: 'swimming_middle', variant: 'stroke_free', overlays: ['youth_athlete'] }, level: 'L2', ladder: 'intermediate',
    season: { phase: 'OFF_BUILD', weeks_to_season: 16, season_date: '2027-02-01', season_type: 'C' },
    D5: { mode: 'fixed_12', overlay: 'season', skeleton: 'ATHLETE_OFF_C12', weeks: 12 },
    D6: { template_id: 'athletic.3', family: 'athletic', days: 3, variant: null, pairing: 'cross_pattern', format: 'gym' },
    client_family: 'athlete', modifier: 'field_off', fill: athleteFill,
    start: { quads: 11, hamstrings: 11, chest: 10, lats_upper_back: 10, rear_delts: 6, calves: 10 },
    cap: { quads: 16, hamstrings: 16, chest: 14, lats_upper_back: 14, rear_delts: 12, calves: 22 },
    D14: { per_week: 0, base: 0, colours: [], sport_is_aerobic: true }, tests: { end_weeks: [12] },
    blocks: [{ type: 'stairway', weeks: [1, 12] }]
  },
  '02-football': {
    profile: { id: 'football_big_skill', variant: null, overlays: [] }, level: 'L3', ladder: 'advanced',
    season: { phase: 'OFF_EARLY', weeks_to_season: 32, season_date: '2027-08-28', season_type: 'A' },
    D5: { mode: 'fixed_12', overlay: 'season', skeleton: 'ATHLETE_OFF_C12', weeks: 12 },
    D6: { template_id: 'athletic.4', family: 'athletic', days: 4, variant: null, pairing: 'cross_pattern', format: 'gym' },
    client_family: 'athlete', modifier: 'field_off', fill: athleteFill,
    start: { quads: 14, hamstrings: 14, chest: 10, lats_upper_back: 10, rear_delts: 8, calves: 12 },
    cap: { quads: 18, hamstrings: 18, chest: 13, lats_upper_back: 13, rear_delts: 16, calves: 25 },
    D14: { per_week: 3, base: 3, colours: ['C', 'B', 'A'] }, tests: { end_weeks: [12] },
    blocks: [{ type: 'stairway', weeks: [1, 12] }]
  },
  '03-soccer': {
    profile: { id: 'soccer', variant: null, overlays: [] }, level: 'L2', ladder: 'intermediate',
    season: { phase: 'OFF_LATE', weeks_to_season: 10, season_date: '2026-12-21', season_type: 'A' },
    D5: { mode: 'fixed_8', overlay: 'season', skeleton: 'ATHLETE_OFF_C8', weeks: 8 },
    D6: { template_id: 'athletic.3', family: 'athletic', days: 3, variant: null, pairing: 'cross_pattern', format: 'gym' },
    client_family: 'athlete', modifier: 'field_off', fill: athleteFill,
    start: { quads: 11, hamstrings: 11, chest: 10, lats_upper_back: 10, rear_delts: 6, calves: 10 },
    cap: { quads: 16, hamstrings: 16, chest: 14, lats_upper_back: 14, rear_delts: 12, calves: 22 },
    D14: { per_week: 4, base: 4, colours: ['C', 'B', 'A', 'C'] }, tests: { end_weeks: [6] },
    blocks: [{ type: 'stairway', weeks: [1, 6] }, { type: 'pre_season', weeks: [7, 8] }]
  },
  '04-crossfit-style-bootcamp': {
    profile: { id: 'crossfit_class', variant: null, overlays: [] }, level: 'L2', ladder: 'intermediate',
    season: null, D5: { mode: 'fixed_8', overlay: null, skeleton: 'C8_GENERAL', weeks: 8 },
    D6: { template_id: 'hybrid_crossfit.4', family: 'hybrid_crossfit', days: 4, variant: 'crossfit_style_bootcamp', pairing: 'cross_pattern', format: 'gym' },
    client_family: 'general', modifier: 'stay_active', fill: athleteFill,
    start: { quads: 12, hamstrings: 12, chest: 12, lats_upper_back: 12, rear_delts: 6, calves: 10 },
    cap: { quads: 18, hamstrings: 18, chest: 18, lats_upper_back: 18, rear_delts: 12, calves: 22 },
    D14: { per_week: 2, base: 2, colours: ['C', 'B'] }, tests: { end_weeks: [8] },
    blocks: [{ type: 'stairway', weeks: [1, 8] }]
  },
  '05-bootcamp': {
    profile: { id: 'general_population', variant: null, overlays: [] }, level: 'L2', ladder: 'intermediate',
    season: null, D5: { mode: 'fixed_8', overlay: null, skeleton: 'C8_GENERAL', weeks: 8 },
    D6: { template_id: 'fat_loss_bootcamp.3', family: 'fat_loss_bootcamp', days: 3, variant: null, pairing: 'cross_pattern', format: 'bootcamp' },
    client_family: 'general', modifier: 'general', fill: { rear_delts: 'own_sets' },
    start: { quads: 12, hamstrings: 12, glutes: 12, chest: 12, lats_upper_back: 12, side_delts: 10, biceps: 10, triceps: 10, rear_delts: 6, calves: 10 },
    cap: { quads: 18, hamstrings: 18, glutes: 18, chest: 18, lats_upper_back: 18, side_delts: 18, biceps: 18, triceps: 18, rear_delts: 12, calves: 22 },
    D14: { per_week: 3, base: 3, colours: ['C', 'B', 'A'] }, tests: { end_weeks: [8] },
    blocks: [{ type: 'stairway', weeks: [1, 8] }]
  },
  '06-full-body-aesthetics': {
    profile: { id: 'bodybuilding_aesthetics', variant: null, overlays: [] }, level: 'L3', ladder: 'advanced',
    season: null, D5: { mode: 'fixed_12', overlay: null, skeleton: 'C12_HYPERTROPHY', weeks: 12 },
    D6: { template_id: 'aesthetics.4', family: 'aesthetics', days: 4, variant: null, pairing: 'same_pattern', format: 'gym' },
    client_family: 'hypertrophy', modifier: 'aesthetics', fill: { rear_delts: 'own_sets' }, priority: ['glutes', 'side_delts'],
    start: { quads: 20, hamstrings: 20, glutes: 26, chest: 20, lats_upper_back: 20, side_delts: 21, biceps: 15, triceps: 15, rear_delts: 8, calves: 12 },
    cap: { quads: 25, hamstrings: 25, glutes: 30, chest: 25, lats_upper_back: 25, side_delts: 30, biceps: 25, triceps: 25, rear_delts: 16, calves: 25 },
    D14: { per_week: 4, base: 4, colours: ['C', 'B', 'A', 'C'], walks: true }, tests: { end_weeks: [] },
    blocks: [{ type: 'stairway', weeks: [1, 12] }]
  },
  '07-push-pull-legs': {
    profile: { id: 'bodybuilding_aesthetics', variant: null, overlays: [] }, level: 'L3', ladder: 'advanced',
    season: null, D5: { mode: 'fixed_12', overlay: null, skeleton: 'C12_HYPERTROPHY', weeks: 12 },
    D6: { template_id: 'aesthetics.6', family: 'aesthetics', days: 6, variant: 'ppl_x2', pairing: 'same_pattern', format: 'gym' },
    client_family: 'hypertrophy', modifier: 'aesthetics', fill: { rear_delts: 'own_sets' }, priority: ['chest', 'lats_upper_back'],
    start: { quads: 20, hamstrings: 20, glutes: 20, chest: 26, lats_upper_back: 26, side_delts: 15, biceps: 15, triceps: 15, rear_delts: 8, calves: 10 },
    cap: { quads: 25, hamstrings: 25, glutes: 25, chest: 30, lats_upper_back: 30, side_delts: 25, biceps: 25, triceps: 25, rear_delts: 16, calves: 25 },
    D14: { per_week: 4, base: 4, colours: ['C', 'B', 'A', 'C'], walks: true }, tests: { end_weeks: [12] },
    blocks: [{ type: 'stairway', weeks: [1, 12] }]
  },
  '08-pickleball-genpop': {
    profile: { id: 'rec_pickleball', variant: null, overlays: ['active_aging_50plus'] }, level: 'L1', ladder: 'foundational',
    season: null, D5: { mode: 'fixed_12', overlay: null, skeleton: 'C12_GENERAL', weeks: 12 },
    D6: { template_id: 'athletic.2', family: 'athletic', days: 2, variant: null, pairing: 'cross_pattern', format: 'gym' },
    client_family: 'general', modifier: 'stay_active', fill: athleteFill, pain_muscles: ['quads'],
    start: { quads: 6, hamstrings: 10, chest: 10, lats_upper_back: 10, rear_delts: 4, calves: 10 },
    cap: { quads: 11, hamstrings: 13, chest: 13, lats_upper_back: 13, rear_delts: 8, calves: 14 },
    D14: { per_week: 1, base: 3, colours: ['C'], replaced_by_activity: 2 }, tests: { end_weeks: [] },
    blocks: [{ type: 'stairway', weeks: [1, 12] }]
  }
};

function kitOf(intake, R) {
  const e = intake.equipment;
  const tokens = new Set(R.equipment.profiles[e.profile].kit);
  for (const t of e.extras || []) tokens.add(t);
  for (const m of e.machines || []) tokens.add(R.equipment.machines[m]);
  const cardio = (e.detail && e.detail.cardio_options) || [];
  for (const c of cardio) if (R.equipment.cardio_tokens[c]) tokens.add(R.equipment.cardio_tokens[c]);
  const rs = R.equipment.running_space[e.detail && e.detail.running_space];
  if (rs) {
    for (const t of rs.drop || []) if (!(t === 'open_space_long' && rs.unless_cardio_run && cardio.includes('run'))) tokens.delete(t);
    for (const t of rs.add || []) tokens.add(t);
  }
  for (const t of R.equipment.banned_tokens) tokens.delete(t);
  const toks = [...tokens].sort();
  const machines = (e.machines && e.machines.length) ? e.machines.slice().sort()
    : Object.keys(R.equipment.machines).filter((m) => tokens.has(R.equipment.machines[m])).sort();
  const owned = (e.detail && e.detail.medball_lb_owned) || [];
  return { profile: e.profile, tokens: toks, machines, medball_max_lb: owned.length ? Math.min(R.medball.max_lb, Math.max(...owned)) : null,
    heaviest_db_pair: (e.detail && e.detail.heaviest_db_pair) || null, box_height_in: (e.detail && e.detail.box_height_in) || null, buy_list: [] };
}

/**
 * Hand-built Derived for a sample (CONTRACTS §4.0 shape; values from §9).
 * @param {string} name sample name  @param {object} model  @param {object} [patch] shallow overrides (top-level keys)
 * @returns {object} Derived
 */
export function stubDerived(name, model, patch = {}) {
  const intake = patch.intake || loadIntake(name);
  const t = T[name];
  if (!t) throw new Error('no stub for ' + name);
  const R = model.rules;
  const sd = model.sport(t.profile.id);
  const age = patch.age != null ? patch.age : intake.age;
  const lvl = t.level;
  const sport = intake.sport || {};
  const comp = intake.goal === 'athletic' ? (sport.competitive || 'none') : (intake.goal === 'active' ? 'recreational' : 'none');
  const D10share = (() => {
    const lower = sd.share.lower.by_exercise_block.slice();
    const out = { profile_id: 'sport', lower: { by_exercise_block: lower, PRE: sd.share.lower.PRE, IN: sd.share.lower.IN }, upper: { by_exercise_block: lower.slice() }, pain_shift: 0 };
    for (const p of intake.pain || []) {
      const a = R.volume.pain.areas[p.area];
      if (a && a.share_shift_to) {
        const d = a.share_shift_to === 'bilateral' ? R.bilateral_share.pain_shift : -R.bilateral_share.pain_shift;
        out.pain_shift += d;
        out.lower.by_exercise_block = out.lower.by_exercise_block.map((x) => Math.round(Math.min(R.bilateral_share.slider_range[1], Math.max(R.bilateral_share.slider_range[0], x + d)) * 100) / 100);
      }
    }
    return out;
  })();
  const fill = {};
  for (const m of R.muscles.order) {
    const def = R.muscles.defs[m];
    fill[m] = t.fill[m] || (def.fill === 'core_block' ? 'core_block' : def.fill === 'floor' ? 'floor' : 'target');
  }
  const start = {}, cap = {};
  for (const m of R.muscles.order) {
    start[m] = fill[m] === 'credit' || fill[m] === 'floor' || fill[m] === 'core_block' ? null : (t.start[m] != null ? t.start[m] : null);
    cap[m] = start[m] == null ? null : (t.cap[m] != null ? t.cap[m] : start[m]);
  }
  const plyoOn = !!(R && model.goal(intake.goal).plyo_block) || t.D6.family === 'athletic';
  const D11 = {
    enabled: plyoOn,
    older_mode: age >= R.population.older.from_age ? (intake.prefs.older_athletic_opt_in ? 'opt_in' : 'default') : null,
    plyo_share: sd.plyo_share, ground_contact_class: sd.ground_contact_class,
    contacts_session_max: R.athletic.contacts_per_session_max[lvl],
    weekly: { ...sd.athletic_weekly },
    olympic_exposures_wk: sd.olympic ? sd.olympic.exposures_wk : null,
    medball_main: model.goal(intake.goal).medball_main,
    cod_sport: !!sd.cod_sport,
    game_heavy: !!(sd.in_season && sd.in_season.game_heavy),
    heavy_play_week: ((intake.activity && intake.activity.play_days) || []).length >= R.athletic.heavy_play_weeks.min_play_sessions
  };
  const tests = intake.plan.tests.filter((x) => x !== 'none');
  const d = {
    D1_family: t.D6.family,
    D2_profile: { id: t.profile.id, variant: t.profile.variant, sport_id: sport.sport || null, position: sport.position || null,
      position_detail: sport.position_detail || null, activity_ids: (intake.activity && intake.activity.ids) || [], overlays: t.profile.overlays,
      competitive: comp, ath03_group: sd.ath03_group, ground_contact_class: sd.ground_contact_class, season_type: sd.season_type, name_key: sd.name_key },
    D3_client_level: { level: lvl, reason_keys: [], exercise_ladder: t.ladder, replace_after_block: null },
    D4_season_phase: t.season ? { phase: t.season.phase, weeks_to_season: t.season.weeks_to_season, season_date: t.season.season_date, competition_date: null,
      season_type: t.season.season_type, practice_days: sport.practice ? sport.practice.practice_days_per_week : null, game_days: (sport.practice && sport.practice.game_days) || [] }
      : { phase: null, weeks_to_season: null, season_date: null, competition_date: null, season_type: null, practice_days: null, game_days: [] },
    D5_plan_shape: { ...t.D5 },
    D6_week_layout: { ...t.D6 },
    D7_constraint_band: { client_family: t.client_family, ...pick(R.equipment.client_families[t.client_family], ['main', 'iso', 'machine_pen', 'skill_pen']) },
    D8_kit: kitOf(intake, R),
    D9_start_sets: { modifier_id: t.modifier, start, cap, fill, priority: t.priority || [], pain_muscles: t.pain_muscles || [], floored: [],
      credit_only: R.muscles.order.filter((m) => fill[m] === 'credit'), calves_per_leg_day: 3, core_block: { exercises: 2, sets: 2 }, why: {} },
    D10_bilateral_share: D10share,
    D11_athletic_budget: D11,
    D12_planned_step: { early: 0.03, late: 0.05, caps: { nonpriority_while_priority: (t.priority || []).length ? 0.03 : null, older: age >= 60 ? 0.03 : null }, source: 'planned_stairway' },
    D13_tests: { items: tests, baseline_week: tests.length ? 1 : null, end_weeks: tests.length ? t.tests.end_weeks : [], from_zero: true },
    D14_aerobic_sessions: { per_week: t.D14.per_week, base: t.D14.base, adjust: intake.prefs.cardio_adjust || 0, replaced_by_activity: t.D14.replaced_by_activity || 0,
      walks: !!t.D14.walks, colours: t.D14.colours.slice(), fighter_open: false, sport_is_aerobic: !!t.D14.sport_is_aerobic },
    goal: intake.goal, format: intake.format || 'gym', lang: intake.lang, units: intake.units,
    age, age_group: age < 18 ? 'youth' : age >= 60 ? 'older' : age >= 50 ? 'active_aging_50' : 'adult',
    body_weight_lb: intake.body_weight.unit === 'kg' ? Math.round(intake.body_weight.value * 2.20462 * 100) / 100 : intake.body_weight.value,
    days_per_week: intake.schedule.days_per_week, weekdays: intake.schedule.weekdays.slice(), session_minutes: intake.schedule.session_minutes,
    start_date: intake.schedule.start_date, play_days: (intake.activity && intake.activity.play_days) || [], event_date: (intake.activity && intake.activity.event_date) || null,
    priority_muscles: t.priority || [], pain: (intake.pain || []).map((p) => ({ ...p, worse_with: (p.worse_with || []).slice() })),
    exclusions: (intake.exclusions || []).slice(), lift_style: intake.lift_style, output_mode: intake.output_mode,
    prefs: { ...intake.prefs }, previous_cycles: { ...intake.plan.previous_cycles }, just_finished_block: !!intake.plan.just_finished_block,
    maint_reason: intake.plan.maint_reason, maint_weeks: intake.plan.maint_weeks,
    health: { role: intake.role, health_route: intake.health_route, refer: false, reasons: [], bypass: false },
    release: { accepted: true, version: intake.release.version, lang: intake.release.lang, guardian: intake.release.guardian },
    equipment_preference: intake.equipment.preference, modifier_id: t.modifier, r3_pending: [], warnings: [], why: []
  };
  for (const [k, v] of Object.entries(patch)) if (k !== 'intake') d[k] = v;
  if (patch.age != null) d.D11_athletic_budget.older_mode = patch.age >= 60 ? (d.prefs.older_athletic_opt_in ? 'opt_in' : 'default') : null;
  return d;
}

function pick(o, keys) { const r = {}; for (const k of keys) r[k] = Array.isArray(o[k]) ? o[k].slice() : o[k]; return r; }

/**
 * Hand-built Shape (CONTRACTS §4.4): the §9 training blocks with stair(N) week fields.
 * Extra WeekShape keys `stair_N` and `exercise_block_week` (CONTRACT_REQUESTS B3) are filled.
 * @param {string} name @param {object} model @param {object} [derived] @returns {object} Shape
 */
export function stubShape(name, model, derived) {
  const t = T[name];
  const R = model.rules;
  const lvl = (derived && derived.D3_client_level.level) || t.level;
  const athlete = t.D6.family === 'athletic';
  const d = derived || stubDerived(name, model);
  const items = d.D13_tests.items;
  const training_blocks = [];
  const exercise_blocks = [];
  const weeks = [];
  let ebN = 0;
  let lastStage = 'RC1';
  t.blocks.forEach((b, i) => {
    const n = i + 1;
    const N = b.weeks[1] - b.weeks[0] + 1;
    const isStair = b.type === 'stairway';
    training_blocks.push({ n, type: b.type, weeks: b.weeks.slice(), stair_N: isStair ? N : null, first_exercise_block: ebN + 1,
      label_key: 'plan.block_type.' + b.type, factor: null });
    const ranges = isStair ? model.stair(N).exercise_blocks : [[1, N]];
    const firstEb = ebN + 1;
    for (const r of ranges) { ebN++; exercise_blocks.push({ n: ebN, training_block: n, weeks: [b.weeks[0] + r[0] - 1, b.weeks[0] + r[1] - 1] }); }
    for (let w = 1; w <= N; w++) {
      const planN = b.weeks[0] + w - 1;
      const ebIdx = ranges.findIndex((r) => w >= r[0] && w <= r[1]);
      const eb = firstEb + ebIdx;
      const ebWeek = w - ranges[ebIdx][0] + 1;
      let ws;
      if (isStair) {
        const st = model.stair(N);
        const phase = Object.entries(st.phases[lvl]).find(([, r]) => w >= r[0] && w <= r[1])[0];
        const pe = R.effort.planned_map[st.planned_effort[String(w)]];
        let stage = null;
        if (athlete) for (const [k, r] of Object.entries(st.rc_weeks)) if (r && w >= r[0] && w <= r[1]) stage = k;
        if (stage) lastStage = stage;
        const test = items.length && (w === 1 || w === N) ? { type: w === 1 ? 'baseline' : 'end', items: items.slice(), from_zero: w === 1 } : null;
        ws = { n: planN, training_block: n, block_type: 'stairway', exercise_block: eb, stair_week: w, stair_level: st.display_level[String(w)],
          standard_step: w === 1 ? null : { early: R.stairway.standard_steps.early, late: R.stairway.standard_steps.late, this_week: st.standard_steps[String(w)] },
          phase, phase_key: 'plan.phase.' + phase, planned_rir: { min: pe.min, max: pe.max, intensifiers: !!pe.intensifiers },
          season_phase: d.D4_season_phase.phase, rep_phase: athlete ? R.reps.athlete_vol_phases.by_exercise_block[Math.min(ebIdx, 2)] : null,
          plyo_stage: stage, test, circuit: null,
          is_exercise_block_start: ebWeek === 1, is_training_block_start: w === 1, is_last_stair_week: w === N, why: [],
          stair_N: N, exercise_block_week: ebWeek };
        if (d.D6_week_layout.format === 'bootcamp') {
          const sb = R.supersets.bootcamp.stairway;
          const rounds = Math.min(sb.rounds_max_by_minutes[String(d.session_minutes)] || sb.rounds_start, d.session_minutes <= 45 ? sb.rounds_start : 99);
          if (sb.by_planned_steps) {
            // v1.2 (D-19 revised): the planned steps on the work seconds, lambda-scaled to the top, 1-s steps
            ws.circuit = { rounds, work_s: circuitWorkSeconds(N, st.standard_steps, sb)[w - 1] };
          } else {
            const raw = sb.work_s_start + ((sb.work_s_max - sb.work_s_start) * (ws.stair_level - 2)) / 9;
            ws.circuit = { rounds, work_s: Math.round(raw / sb.work_s_step) * sb.work_s_step };
          }
        }
      } else {
        const phase = { pre_season: 'PRE_SEASON', taper: 'TAPER', in_season: 'IN_SEASON', maintenance: 'MAINTENANCE', recovery: 'RECOVERY' }[b.type];
        const pr = R.effort.by_block_type[b.type];
        ws = { n: planN, training_block: n, block_type: b.type, exercise_block: eb, stair_week: null, stair_level: null, standard_step: null,
          phase, phase_key: 'plan.phase.' + phase, planned_rir: { min: pr.min, max: pr.max, intensifiers: false },
          season_phase: b.type === 'pre_season' ? 'PRE' : b.type === 'in_season' ? 'IN' : null,
          rep_phase: athlete ? 'VOL3' : null, plyo_stage: athlete ? lastStage : null, test: null, circuit: null,
          is_exercise_block_start: ebWeek === 1, is_training_block_start: w === 1, is_last_stair_week: false, why: [],
          stair_N: null, exercise_block_week: ebWeek };
      }
      weeks.push(ws);
    }
  });
  const total = t.blocks[t.blocks.length - 1].weeks[1];
  return { mode: t.D5.mode, skeleton: t.D5.skeleton, weeks_total: total, open_ended: false, training_blocks, exercise_blocks, weeks,
    after_plan: { next: 'block_choice', weeks: null, date: null } };
}

export { WEEKDAYS };

/**
 * Contexts for every sample: the stub (always) and B2's real deriveValues / buildShape when engine/intake.mjs and
 * engine/shape.mjs exist (BUILD_PLAN §3 B3 DoD: tests pass with both).
 * @param {object} model @param {{only?:string[], patch?:object}} [opts]
 * @returns {Promise<Array<{name:string, source:'stub'|'real', intake:object, derived:object, shape:object, seed:string}>>}
 */
export async function sampleContexts(model, opts = {}) {
  const names = opts.only || SAMPLES;
  const out = [];
  let real = null;
  try {
    const I = await import('../../engine/intake.mjs');
    const S = await import('../../engine/shape.mjs');
    if (typeof I.validateIntake === 'function' && typeof I.deriveValues === 'function' && typeof S.buildShape === 'function') real = { I, S };
  } catch (e) { real = null; }
  for (const name of names) {
    const intake = loadIntake(name);
    const derived = stubDerived(name, model, opts.patch || {});
    out.push({ name, source: 'stub', intake, derived, shape: stubShape(name, model, derived), seed: stubSeed(intake, model) });
    if (real && !opts.patch) {
      try {
        const v = real.I.validateIntake(intake, model);
        if (v && v.ok) {
          const d = real.I.deriveValues(v.intake, model);
          out.push({ name, source: 'real', intake, derived: d, shape: real.S.buildShape(d, model), seed: stubSeed(intake, model) });
        }
      } catch (e) { /* B2 module not ready: stub only */ }
    }
  }
  return out;
}

/**
 * Layout per training block + selection per exercise block (the generate pipeline up to select).
 * @returns {{layouts:object[], selections:object[]}}
 */
export async function buildSelections(ctx, model) {
  const { buildWeekLayout } = await import('../../engine/week.mjs');
  const { selectBlock } = await import('../../engine/select.mjs');
  const layouts = ctx.shape.training_blocks.map((tb) => buildWeekLayout(ctx.derived, ctx.shape, tb, model));
  const selections = [];
  for (const eb of ctx.shape.exercise_blocks) {
    selections.push(selectBlock({ derived: ctx.derived, shape: ctx.shape, layout: layouts[eb.training_block - 1], targets: ctx.derived.D9_start_sets,
      exerciseBlock: eb.n, prev: selections.length ? selections[selections.length - 1] : null, model, seed: ctx.seed }));
  }
  return { layouts, selections };
}
