// engine/intake.mjs - intake/2 validation + normalization, health screen, release check and the derived values D1-D14
// (engine/CONTRACTS.md §2.1, §4.3; generator_spec_v1.json > derived_values). Owner: B2 (v0.4 round-3 changes: stage B1).
// v0.4 (coach_answers_round3.md): no check-ins, no tracking, no adaptive inputs (R3-VOL-02, R3-VOL-04) - output_mode and the
// week-by-week check-in mode are retired (accepted for old intakes, never read); Focus muscle 1 / 2 (R3-SES-01, focus_muscles,
// priority_muscles is its alias); play minutes for the activity cardio credit (R3-ATH-05).
// Pure: no I/O, no clock, no randomness. Every number / list comes from the model (rules, templates, profiles).
import { EngineError, WEEKDAYS, why, forbiddenKeys, round2, clamp, weeksBetween } from './util.mjs';
import { computeTargets } from './volume.mjs';
import { planTrainingBlocks } from './shape.mjs';

/** @typedef {import('./util.mjs').Issue} Issue */
/** @typedef {import('./util.mjs').Why} Why */

const SAFETY_KEYS = ['heart', 'surgery_6mo', 'pregnant_postpartum_6mo', 'injury_in_treatment', 'doctor_said_no'];
// Vocabularies that have no table in the model (CONTRACTS §1.4 / spec inputs_schema): structural ids only.
const LANGS = ['en', 'es'];
const UNITS = ['lb', 'kg'];
const ROLES = ['self', 'client'];
const HEALTH_ROUTES = ['coach_screen', 'coach_own_sop'];
const RELEASE_VERSIONS = ['release.client', 'release.coach', 'release.minor'];
const FORMATS = ['gym', 'bootcamp'];
const FORMAT_GOALS = ['fat_loss', 'general'];
const COMPETITIVE = ['competitive', 'recreational', 'none'];
const LEVELS_OF_PLAY = ['youth_club', 'high_school', 'college', 'pro', 'masters', 'amateur'];
const SEASON_TYPES = ['next_season_start', 'in_season_until', 'competition_date', 'no_season'];
const LIFT_STYLES = ['volume_lighter', 'balanced', 'heavy_powerlifting'];
const PLAN_MODES = ['fixed_12', 'fixed_8', 'maintenance_4_6', 'week_by_week', 'year'];
const PREFERENCES = ['machines', 'free_weights', 'dumbbells', 'none'];
const SIDES = ['left', 'right', 'both'];
const SEVERITIES = ['mild', 'moderate', 'severe'];
const EXCLUSIONS = ['running', 'jumping', 'barbell', 'lunges', 'overhead_pressing', 'floor_work', 'machines', 'other'];
const OUTPUT_MODES = ['plan_only', 'checkin', 'logbook']; // RETIRED (R3-VOL-02): accepted for old intakes, never read
const PLAY_MINUTES = ['under_45', '45_60', '60_plus']; // F11r play_minutes (R3-ATH-05)
const SUPERSET_RECS = ['show', 'hide']; // F44 superset_recommendations (R3-SES-02)
const CORE_POSITIONS = ['start', 'after_plyos', 'after_strength', 'end'];
const OPTIONAL_DAYS = ['separate', 'add_on'];
const SPLIT_STYLES = ['default', 'upper_lower', 'ppl'];
const GROWTH_STAGES = ['pre_phv', 'circa_phv', 'post_phv', 'not_sure'];
const DAYS_RANGE = [2, 6];
const AGE_RANGE = [10, 90];
const YEARS_RANGE = [0, 30];
const MONTHS_OFF_RANGE = [0, 24];
const PRACTICE_RANGE = [0, 7];
const CYCLES_RANGE = [0, 3];
const MAX_ACTIVITIES = 2;
const ATHLETIC_GOALS = ['athletic', 'active'];

// Known intake/2 key tree (CONTRACTS §2.1). 1 = leaf. Keys starting with '_' are comments and always allowed.
const SHAPE = {
  schema: 1, id: 1, lang: 1, units: 1, role: 1, health_route: 1,
  safety: { heart: 1, surgery_6mo: 1, pregnant_postpartum_6mo: 1, injury_in_treatment: 1, doctor_said_no: 1 },
  release: { accepted: 1, version: 1, lang: 1, guardian: 1, accepted_at: 1, signer_name: 1 },
  age: 1, body_weight: { value: 1, unit: 1 },
  experience: { years_consistent: 1, months_off_last_2y: 1, former_competitor: 1 },
  goal: 1, format: 1,
  sport: { competitive: 1, sport: 1, position: 1, position_detail: 1, level_of_play: 1, season: { type: 1, date: 1 },
    practice: { practice_days_per_week: 1, game_days: 1 } },
  activity: { ids: 1, play_days: 1, event_date: 1, league_sport: 1, style: 1, play_minutes: 1 },
  focus_muscles: 1, priority_muscles: 1, lift_style: 1,
  schedule: { days_per_week: 1, weekdays: 1, session_minutes: 1 /* retired in v0.5 (R4-SES-01): accepted, ignored, warned */, start_date: 1 },
  plan: { mode: 1, maint_reason: 1, maint_weeks: 1, previous_cycles: { count: 1, last_block_finished: 1, last_had_holds_or_pain: 1 }, tests: 1, just_finished_block: 1, view: 1 },
  equipment: { profile: 1, extras: 1, machines: 1, preference: 1,
    detail: { heaviest_db_pair: 1, medball_lb_owned: 1, box_height_in: 1, running_space: 1, cardio_options: 1 } },
  pain: [{ area: 1, side: 1, severity: 1, worse_with: 1 }],
  exclusions: 1, output_mode: 1,
  prefs: { core_position: 1, optional_days: 1, variety_ab: 1, heavy_unilateral: 1, supersets_for_fatigue: 1, cardio_adjust: 1,
    older_athletic_opt_in: 1, split_style: 1, superset_recommendations: 1, racket_50_impact_opt_in: 1 },
  growth_stage: 1, email: 1, coach_rule_pack_ids: 1
};

// i18n label keys used as the `key` of field errors (the fixture has no dedicated error strings; see CONTRACT_REQUESTS).
const LABEL = {
  lang: 'intake.lang.label', units: 'intake.units.label', role: 'intake.role.label', health_route: 'intake.health_route.label',
  safety: 'intake.safety.label', release: 'warning.release_missing', age: 'intake.age.label', body_weight: 'intake.body_weight.label',
  experience: 'intake.experience.label', goal: 'intake.goal.label', format: 'intake.format.label',
  'sport.competitive': 'intake.competitive.label', 'sport.sport': 'intake.sport.label', 'sport.position': 'intake.position.label',
  'sport.position_detail': 'intake.position.label', 'sport.level_of_play': 'intake.level_of_play.label',
  'sport.season': 'intake.season.label', 'sport.practice': 'intake.practice.label', sport: 'intake.sport.label',
  activity: 'intake.activity.label', priority_muscles: 'intake.priority.label', focus_muscles: 'intake.focus.label', lift_style: 'intake.lift_style.label',
  'schedule.days_per_week': 'intake.days.label', 'schedule.weekdays': 'intake.weekdays.label',
  'schedule.start_date': 'intake.start.label', schedule: 'intake.days.label',
  'plan.mode': 'intake.plan_mode.label', 'plan.maint_reason': 'intake.maint_reason.label', 'plan.maint_weeks': 'intake.maint_weeks.label',
  'plan.previous_cycles': 'intake.previous_cycles.label', 'plan.tests': 'intake.tests.label', plan: 'intake.plan_mode.label',
  'equipment.profile': 'intake.equipment.label', 'equipment.extras': 'intake.extras.label', 'equipment.machines': 'intake.machines.label',
  'equipment.preference': 'intake.preference.label', 'equipment.detail': 'intake.kit_detail.label', equipment: 'intake.equipment.label',
  pain: 'intake.pain.label', exclusions: 'intake.exclusions.label', output_mode: 'intake.output_mode.label', prefs: 'intake.prefs.label',
  growth_stage: 'intake.growth_stage.label', email: 'intake.email.label'
};
function labelFor(field) {
  const f = String(field).replace(/\[\d+\]/g, '');
  const parts = f.split('.');
  for (let i = parts.length; i > 0; i--) { const k = parts.slice(0, i).join('.'); if (LABEL[k]) return LABEL[k]; }
  return 'check.v26_inputs';
}

/** @returns {Issue} */
function issue(code, field, key, args) {
  const o = { code };
  if (field !== undefined && field !== null) o.field = field;
  o.key = key;
  if (args && Object.keys(args).length) o.args = { ...args };
  return o;
}

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isInt = (v) => typeof v === 'number' && Number.isInteger(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
function isIsoDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}
const sortWeekdays = (arr) => WEEKDAYS.filter(d => arr.includes(d));
const uniqSorted = (arr) => Array.from(new Set(arr)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

function unknownKeys(obj, shape, prefix, out) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(shape)) {
    if (Array.isArray(obj)) obj.forEach((v, i) => unknownKeys(v, shape[0], `${prefix}[${i}]`, out));
    return;
  }
  if (Array.isArray(obj)) return;
  for (const k of Object.keys(obj)) {
    if (k.startsWith('_')) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    if (!Object.prototype.hasOwnProperty.call(shape, k)) { out.push(p); continue; }
    if (shape[k] !== 1) unknownKeys(obj[k], shape[k], p, out);
  }
}

/**
 * Focus slots (R3-SES-01): at most `max` slots; a choice in `uses_both_slots` (v_taper) takes two. Keeps the first that fit.
 * @param {string[]} choices @param {{max:number, uses_both_slots?:string[]}} FO @returns {string[]}
 */
function trimFocus(choices, FO) {
  const out = [];
  let used = 0;
  for (const c of choices) {
    const n = (FO.uses_both_slots || []).includes(c) ? 2 : 1;
    if (used + n > FO.max) continue;
    out.push(c); used += n;
  }
  return out;
}

/** first rule whose `when` matches (shared table format of modifier_select / family_select / bilateral_share.select) */
function matchWhen(when, ctx) {
  for (const [k, v] of Object.entries(when || {})) {
    if (k.endsWith('_gte')) { const f = k.slice(0, -4); if (!(isNum(ctx[f]) && ctx[f] >= v)) return false; continue; }
    if (Array.isArray(v)) { if (!v.includes(ctx[k])) return false; continue; }
    if (typeof v === 'boolean') { if (!!ctx[k] !== v) return false; continue; }
    if (ctx[k] !== v) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------------------------------------------
// validateIntake
// ---------------------------------------------------------------------------------------------------------------

/**
 * Validate and normalize an intake/2 object (CONTRACTS §2.1). Defaults are filled; nothing the person chose is dropped
 * (priority trim and the under-60 opt-in are applied in deriveValues and reported here as warnings).
 * @param {object} intake
 * @param {object} model
 * @returns {{ok:boolean, errors:Issue[], warnings:Issue[], intake:object|null}}
 */
export function validateIntake(intake, model) {
  const errors = [], warnings = [];
  const err = (code, field, args, key) => errors.push(issue(code, field, key || labelFor(field), args));
  const warn = (code, key, args, field) => warnings.push(issue(code, field, key, args));
  if (!isObj(intake)) {
    errors.push(issue('not_object', null, 'check.v26_inputs'));
    return { ok: false, errors, warnings, intake: null };
  }
  const R = model.rules, P = model.profiles;

  // forbidden keys (H13 sex / gender, H16 lifestyle) and unknown keys
  const forbidden = forbiddenKeys(intake);
  for (const p of forbidden) {
    const leaf = p.split('.').pop().replace(/\[\d+\]$/, '');
    errors.push(issue('forbidden_key', p, /^(sex|gender)$/i.test(leaf) ? 'check.h13_no_sex' : 'check.h16_no_lifestyle', { key: leaf }));
  }
  const unknown = [];
  unknownKeys(intake, SHAPE, '', unknown);
  for (const p of unknown) if (!forbidden.includes(p)) errors.push(issue('unknown_key', p, 'check.v26_inputs', { key: p.split('.').pop() }));

  if (intake.schema !== undefined && intake.schema !== 'intake/2') err('enum', 'schema', { value: String(intake.schema) }, 'check.v26_inputs');

  const enumOf = (field, value, allowed, def, { required = false, nullable = false } = {}) => {
    if (value === undefined || value === null) {
      if (required && def === undefined) { err('required', field); return null; }
      if (def !== undefined) return def;
      if (!nullable && required) err('required', field);
      return null;
    }
    if (!allowed.includes(value)) { err('enum', field, { value: String(value) }); return def === undefined ? null : def; }
    return value;
  };
  const listOf = (field, value, allowed, { max = Infinity } = {}) => {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) { err('type', field); return []; }
    const out = [];
    value.forEach((v, i) => {
      if (allowed && !allowed.includes(v)) err('enum', `${field}[${i}]`, { value: String(v) });
      else if (!out.includes(v)) out.push(v);
    });
    if (out.length > max) err('too_many', field, { max });
    return out;
  };
  const intIn = (field, value, [lo, hi], { required = true, def } = {}) => {
    if (value === undefined || value === null) { if (def !== undefined) return def; if (required) err('required', field); return null; }
    if (!isInt(value)) { err('type', field); return def !== undefined ? def : null; }
    if (value < lo || value > hi) { err('range', field, { min: lo, max: hi }); return def !== undefined ? def : null; }
    return value;
  };
  const numIn = (field, value, [lo, hi], { required = true, def } = {}) => {
    if (value === undefined || value === null) { if (def !== undefined) return def; if (required) err('required', field); return null; }
    if (!isNum(value)) { err('type', field); return def !== undefined ? def : null; }
    if (value < lo || value > hi) { err('range', field, { min: lo, max: hi }); return def !== undefined ? def : null; }
    return value;
  };
  const boolOf = (field, value, def) => {
    if (value === undefined || value === null) return def;
    if (typeof value !== 'boolean') { err('type', field); return def; }
    return value;
  };
  const dateOf = (field, value, { required = true } = {}) => {
    if (value === undefined || value === null) { if (required) err('required', field); return null; }
    if (!isIsoDate(value)) { err('date', field, { value: String(value) }); return null; }
    return value;
  };

  const lang = enumOf('lang', intake.lang, LANGS, 'en');
  const units = enumOf('units', intake.units, UNITS, 'lb');
  const role = enumOf('role', intake.role, ROLES, undefined, { required: true });
  let health_route = null;
  if (role === 'client') {
    if (intake.health_route === undefined || intake.health_route === null) errors.push(issue('health_route_required', 'health_route', 'intake.health_route.label'));
    else health_route = enumOf('health_route', intake.health_route, HEALTH_ROUTES, undefined, { required: true });
  }
  if (health_route === 'coach_own_sop') warn('coach_bypass', 'warning.coach_bypass', undefined, 'health_route');

  // F01 health screen (not read with the coach bypass)
  let safety = null;
  if (health_route === 'coach_own_sop') {
    if (isObj(intake.safety)) { safety = {}; for (const k of SAFETY_KEYS) safety[k] = intake.safety[k] === true; }
  } else if (role) {
    if (!isObj(intake.safety)) err('required', 'safety');
    else {
      safety = {};
      for (const k of SAFETY_KEYS) {
        const v = intake.safety[k];
        if (typeof v !== 'boolean') { err(v === undefined || v === null ? 'required' : 'type', `safety.${k}`, undefined, 'intake.safety.label'); safety[k] = false; }
        else safety[k] = v;
      }
    }
  }

  const age = intIn('age', intake.age, AGE_RANGE);
  let body_weight = null;
  if (!isObj(intake.body_weight)) err('required', 'body_weight');
  else {
    const value = numIn('body_weight.value', intake.body_weight.value, [1, 1000]);
    const unit = enumOf('body_weight.unit', intake.body_weight.unit, UNITS, units);
    body_weight = { value, unit };
  }
  let experience = null;
  if (!isObj(intake.experience)) err('required', 'experience');
  else {
    experience = {
      years_consistent: numIn('experience.years_consistent', intake.experience.years_consistent, YEARS_RANGE),
      months_off_last_2y: numIn('experience.months_off_last_2y', intake.experience.months_off_last_2y, MONTHS_OFF_RANGE, { required: false, def: 0 }),
      former_competitor: boolOf('experience.former_competitor', intake.experience.former_competitor, false)
    };
  }
  const goal = enumOf('goal', intake.goal, Object.keys(P.goals), undefined, { required: true });
  const format = FORMAT_GOALS.includes(goal) ? enumOf('format', intake.format, FORMATS, 'gym') : null;

  // F11a-F15 sport (goal athletic only)
  let sport = null;
  if (goal === 'athletic') {
    if (!isObj(intake.sport)) err('required', 'sport');
    else {
      const s = intake.sport;
      const competitive = enumOf('sport.competitive', s.competitive, COMPETITIVE, undefined, { required: true });
      sport = { competitive, sport: null, position: null, position_detail: null, level_of_play: null, season: null, practice: null };
      if (competitive === 'competitive') {
        let ps = null;
        if (s.sport === undefined || s.sport === null) err('required', 'sport.sport');
        else {
          try { ps = model.pickerSport(s.sport); sport.sport = ps.id; } catch (e) { err('enum', 'sport.sport', { value: String(s.sport) }); }
        }
        if (ps) {
          if (s.position !== undefined && s.position !== null) {
            if (!ps.positions.some(p => p.value === s.position)) err('enum', 'sport.position', { value: String(s.position) });
            else sport.position = s.position;
          }
          if (s.position_detail !== undefined && s.position_detail !== null) {
            const opts = ps.second_choice ? ps.second_choice.options.map(o => o.value) : [];
            if (!opts.includes(s.position_detail)) err('enum', 'sport.position_detail', { value: String(s.position_detail) });
            else sport.position_detail = s.position_detail;
          }
        }
        sport.level_of_play = enumOf('sport.level_of_play', s.level_of_play, LEVELS_OF_PLAY, null, { nullable: true });
        if (!isObj(s.season)) err('required', 'sport.season');
        else {
          const type = enumOf('sport.season.type', s.season.type, SEASON_TYPES, undefined, { required: true });
          const date = type === 'no_season' ? null : dateOf('sport.season.date', s.season.date);
          sport.season = { type, date };
        }
        if (!isObj(s.practice)) err('required', 'sport.practice');
        else {
          sport.practice = {
            practice_days_per_week: intIn('sport.practice.practice_days_per_week', s.practice.practice_days_per_week, PRACTICE_RANGE, { required: false, def: 0 }),
            game_days: (() => { const g = listOf('sport.practice.game_days', s.practice.game_days, [...WEEKDAYS, 'varies']); return [...sortWeekdays(g), ...(g.includes('varies') ? ['varies'] : [])]; })()
          };
        }
      }
    }
  }

  // F11r activity
  const needActivity = goal === 'active' || (sport && sport.competitive === 'recreational');
  const allowActivity = needActivity || FORMAT_GOALS.includes(goal) || (goal && !ATHLETIC_GOALS.includes(goal));
  let activity = null;
  if (intake.activity !== undefined && intake.activity !== null && allowActivity) {
    if (!isObj(intake.activity)) err('type', 'activity');
    else {
      const a = intake.activity;
      const ids = [];
      if (!Array.isArray(a.ids) || !a.ids.length) err('required', 'activity.ids', undefined, 'intake.activity.label');
      else {
        a.ids.forEach((id, i) => {
          try { model.activity(id); if (!ids.includes(id)) ids.push(id); } catch (e) { err('enum', `activity.ids[${i}]`, { value: String(id) }, 'intake.activity.label'); }
        });
        if (ids.length > MAX_ACTIVITIES) err('too_many', 'activity.ids', { max: MAX_ACTIVITIES }, 'intake.activity.label');
      }
      const play_days = sortWeekdays(listOf('activity.play_days', a.play_days, WEEKDAYS));
      const event_date = a.event_date === undefined || a.event_date === null ? null : dateOf('activity.event_date', a.event_date);
      let league_sport = null, style = null;
      const first = ids.length ? model.activity(ids[0]) : null;
      if (a.league_sport !== undefined && a.league_sport !== null) {
        if (!first || !first.league_sport.some(x => x.value === a.league_sport)) err('enum', 'activity.league_sport', { value: String(a.league_sport) }, 'intake.activity.label');
        else league_sport = a.league_sport;
      }
      if (a.style !== undefined && a.style !== null) {
        if (!first || !first.style.some(x => x.value === a.style)) err('enum', 'activity.style', { value: String(a.style) }, 'intake.activity.label');
        else style = a.style;
      }
      // R3-ATH-05: a 45-60+ minute session of the activity counts as one cardio session (up to 2); under 45 min it does not
      const play_minutes = enumOf('activity.play_minutes', a.play_minutes, PLAY_MINUTES, '45_60');
      activity = { ids, play_days, event_date, league_sport, style, play_minutes };
    }
  } else if (needActivity) err('required', 'activity');

  // F09 Focus muscle 1 / 2 (R3-SES-01; focus_muscles, priority_muscles = its intake/2 alias). More than 2 slots (v_taper uses
  // both): kept in the normalized intake, trimmed in deriveValues + V8 warning. Retired values side_delts / rear_delts -> shoulders.
  const FO = R.volume.focus || { intake_map: R.volume.priority.intake_map, max: R.volume.priority.max_muscles, uses_both_slots: [] };
  const focusField = intake.focus_muscles !== undefined && intake.focus_muscles !== null ? 'focus_muscles' : 'priority_muscles';
  const priority_muscles = listOf(focusField, intake[focusField], Object.keys(FO.intake_map));
  const kept = trimFocus(priority_muscles, FO);
  if (kept.length < priority_muscles.length) warn('v8_priorities', 'warning.v8_priorities', { kept: kept.join(', ') }, focusField);
  const lift_style = enumOf('lift_style', intake.lift_style, LIFT_STYLES, 'balanced');

  // F25 plan
  const pl = isObj(intake.plan) ? intake.plan : {};
  if (intake.plan !== undefined && intake.plan !== null && !isObj(intake.plan)) err('type', 'plan');
  const modeIn = enumOf('plan.mode', pl.mode, PLAN_MODES, 'fixed_12');
  // week_by_week retired as a check-in mode (R3-VOL-02): an alias of the 12-week plan that opens on the Week view
  const WBW = R.plan_types.week_by_week || {};
  const mode = modeIn === 'week_by_week' && WBW.alias_of ? WBW.alias_of : modeIn;
  const view = modeIn === 'week_by_week' ? (WBW.view || 'week') : null;
  const maintCfg = R.plan_types.maintenance_4_6;
  let maint_reason = null, maint_weeks = null;
  if (mode === 'maintenance_4_6') {
    maint_reason = enumOf('plan.maint_reason', pl.maint_reason, Object.keys(maintCfg.factor), undefined, { required: true });
    maint_weeks = intIn('plan.maint_weeks', pl.maint_weeks, maintCfg.weeks_range, { required: false, def: maintCfg.weeks_default });
  }
  const pc = isObj(pl.previous_cycles) ? pl.previous_cycles : {};
  // F25c: last_block_finished (the person says it); last_had_holds_or_pain came from check-ins (retired) and is read as its alias
  const holds = boolOf('plan.previous_cycles.last_had_holds_or_pain', pc.last_had_holds_or_pain, false);
  const previous_cycles = {
    count: intIn('plan.previous_cycles.count', pc.count, CYCLES_RANGE, { required: false, def: 0 }),
    last_block_finished: boolOf('plan.previous_cycles.last_block_finished', pc.last_block_finished, !holds)
  };
  let tests = listOf('plan.tests', pl.tests, [...Object.keys(R.tests.catalogue), 'none']);
  tests = tests.filter(t => t !== 'none');
  tests = tests.length ? Object.keys(R.tests.catalogue).filter(t => tests.includes(t)) : ['none'];
  const just_finished_block = boolOf('plan.just_finished_block', pl.just_finished_block, false);

  // F43 output mode: RETIRED (R3-VOL-02 'I want to take away all check-in info. We're only doing outputs'). An old intake may
  // still carry it; the plan is always the whole plan, built once (plan_only)
  const outputIn = enumOf('output_mode', intake.output_mode, OUTPUT_MODES, 'plan_only');
  if (outputIn !== 'plan_only') warn('checkin_retired', 'warning.checkin_retired', undefined, 'output_mode');
  const output_mode = 'plan_only';
  if (mode === 'year' && sport && sport.competitive === 'competitive' && R.plan_types.year.non_competitive_only) {
    errors.push(issue('year_not_for_competitive', 'plan.mode', 'intake.plan_mode.label'));
  }

  // F27-F34 equipment
  let equipment = null;
  if (!isObj(intake.equipment)) err('required', 'equipment');
  else {
    const e = intake.equipment;
    const profile = enumOf('equipment.profile', e.profile, R.equipment.intake_profiles, undefined, { required: true });
    const extras = [];
    if (e.extras !== undefined && e.extras !== null) {
      if (!Array.isArray(e.extras)) err('type', 'equipment.extras');
      else e.extras.forEach((t, i) => {
        if (typeof t !== 'string') err('type', `equipment.extras[${i}]`);
        else if (R.equipment.banned_tokens.includes(t)) errors.push(issue('banned_token', `equipment.extras[${i}]`, 'check.h01_no_bands', { token: t }));
        else if (!extras.includes(t)) extras.push(t);
      });
    }
    const machines = listOf('equipment.machines', e.machines, Object.keys(R.equipment.machines));
    const preference = enumOf('equipment.preference', e.preference, PREFERENCES, 'none');
    const d = isObj(e.detail) ? e.detail : {};
    const owned = [];
    if (d.medball_lb_owned !== undefined && d.medball_lb_owned !== null) {
      if (!Array.isArray(d.medball_lb_owned)) err('type', 'equipment.detail.medball_lb_owned');
      else d.medball_lb_owned.forEach((v, i) => { if (!isNum(v) || v <= 0) err('type', `equipment.detail.medball_lb_owned[${i}]`); else if (!owned.includes(v)) owned.push(v); });
    }
    const cardioAllowed = [...Object.keys(R.equipment.cardio_tokens), 'none'];
    const cardio = listOf('equipment.detail.cardio_options', d.cardio_options, cardioAllowed);
    equipment = {
      profile, extras: uniqSorted(extras), machines: Object.keys(R.equipment.machines).filter(m => machines.includes(m)), preference,
      detail: {
        heaviest_db_pair: d.heaviest_db_pair === undefined || d.heaviest_db_pair === null ? null : numIn('equipment.detail.heaviest_db_pair', d.heaviest_db_pair, [0, 500]),
        medball_lb_owned: owned.slice().sort((a, b) => a - b),
        box_height_in: d.box_height_in === undefined || d.box_height_in === null ? null : numIn('equipment.detail.box_height_in', d.box_height_in, [0, 72]),
        running_space: enumOf('equipment.detail.running_space', d.running_space, Object.keys(R.equipment.running_space), null, { nullable: true }),
        cardio_options: cardioAllowed.filter(c => cardio.includes(c))
      }
    };
  }

  // F35 / F36 pain
  const pain = [];
  if (intake.pain !== undefined && intake.pain !== null) {
    if (!Array.isArray(intake.pain)) err('type', 'pain');
    else intake.pain.forEach((p, i) => {
      if (!isObj(p)) { err('type', `pain[${i}]`); return; }
      const area = enumOf(`pain[${i}].area`, p.area, Object.keys(R.volume.pain.areas), undefined, { required: true });
      const side = enumOf(`pain[${i}].side`, p.side, SIDES, null, { nullable: true });
      const severity = enumOf(`pain[${i}].severity`, p.severity, SEVERITIES, undefined, { required: true });
      const worse_with = listOf(`pain[${i}].worse_with`, p.worse_with, Object.keys(R.volume.pain.worse_with));
      if (area && severity) pain.push({ area, side, severity, worse_with: Object.keys(R.volume.pain.worse_with).filter(w => worse_with.includes(w)) });
    });
  }
  const exclGiven = listOf('exclusions', intake.exclusions, EXCLUSIONS);
  const exclusions = EXCLUSIONS.filter(x => exclGiven.includes(x));

  // F44 preferences
  const pr = isObj(intake.prefs) ? intake.prefs : {};
  const ca = R.conditioning.cardio_adjust;
  const prefs = {
    core_position: enumOf('prefs.core_position', pr.core_position, CORE_POSITIONS, 'start'),
    optional_days: enumOf('prefs.optional_days', pr.optional_days, OPTIONAL_DAYS, 'separate'),
    variety_ab: boolOf('prefs.variety_ab', pr.variety_ab, false),
    heavy_unilateral: boolOf('prefs.heavy_unilateral', pr.heavy_unilateral, false),
    supersets_for_fatigue: boolOf('prefs.supersets_for_fatigue', pr.supersets_for_fatigue, false),
    cardio_adjust: intIn('prefs.cardio_adjust', pr.cardio_adjust, [ca.min, ca.max], { required: false, def: 0 }),
    older_athletic_opt_in: boolOf('prefs.older_athletic_opt_in', pr.older_athletic_opt_in, false),
    split_style: enumOf('prefs.split_style', pr.split_style, SPLIT_STYLES, 'default'),
    superset_recommendations: enumOf('prefs.superset_recommendations', pr.superset_recommendations, SUPERSET_RECS, 'show'), // R3-SES-02
    racket_50_impact_opt_in: boolOf('prefs.racket_50_impact_opt_in', pr.racket_50_impact_opt_in, false) // R3-ATH-02 (50-59 racket players)
  };
  if (prefs.older_athletic_opt_in && isInt(age) && age < R.population.older.from_age) {
    // ignored below 60 (CONTRACTS §2.1); dedicated key added in the integration step (contracts/1.1.1)
    warn('older_opt_in_ignored', 'warning.older_opt_in_ignored', { age }, 'prefs.older_athletic_opt_in');
  }
  const growth_stage = enumOf('growth_stage', intake.growth_stage, GROWTH_STAGES, null, { nullable: true });
  const email = intake.email === undefined || intake.email === null ? null : (typeof intake.email === 'string' ? intake.email : (err('type', 'email'), null));
  let coach_rule_pack_ids = [];
  if (intake.coach_rule_pack_ids !== undefined && intake.coach_rule_pack_ids !== null) {
    if (!Array.isArray(intake.coach_rule_pack_ids)) err('type', 'coach_rule_pack_ids', undefined, 'check.v26_inputs');
    else if (intake.coach_rule_pack_ids.length) errors.push(issue('coach_rule_packs_phase1', 'coach_rule_pack_ids', 'check.v26_inputs'));
  }

  // F22-F24, F26 schedule
  let schedule = null;
  if (!isObj(intake.schedule)) err('required', 'schedule');
  else {
    const s = intake.schedule;
    const days_per_week = intIn('schedule.days_per_week', s.days_per_week, DAYS_RANGE);
    let weekdays = null;
    if (s.weekdays !== undefined && s.weekdays !== null) {
      const w = listOf('schedule.weekdays', s.weekdays, WEEKDAYS);
      weekdays = sortWeekdays(w);
    }
    // v0.5 (COACH-R4 R4-SES-01 'Drop it. We don't need it.'; COACH-CT CT-01): session length is not an input. An intake that still
    // carries it is accepted and the field is ignored with a warning (like the retired check-in mode) - it changes nothing.
    if (s.session_minutes !== undefined && s.session_minutes !== null) warn('session_minutes_retired', 'warning.session_minutes_retired', undefined, 'schedule.session_minutes');
    const start_date = dateOf('schedule.start_date', s.start_date);
    schedule = { days_per_week, weekdays, start_date };
  }

  // release (F46) - checked for this build
  let release = null;
  if (!isObj(intake.release)) errors.push(issue('release_missing', 'release', 'warning.release_missing'));
  else {
    const r = intake.release;
    release = {
      accepted: r.accepted === true,
      version: RELEASE_VERSIONS.includes(r.version) ? r.version : null,
      lang: LANGS.includes(r.lang) ? r.lang : lang,
      guardian: typeof r.guardian === 'boolean' ? r.guardian : null
    };
  }

  const normalized = {
    schema: 'intake/2', id: intake.id === undefined ? null : intake.id, lang, units, role, health_route, safety, release, age, body_weight,
    experience, goal, format, sport, activity, priority_muscles, lift_style, schedule,
    plan: { mode, maint_reason, maint_weeks, previous_cycles, tests, just_finished_block, view },
    equipment, pain, exclusions, output_mode, prefs, growth_stage, email, coach_rule_pack_ids
  };

  if (release) {
    const rc = checkRelease(normalized);
    for (const x of rc.issues) errors.push(x);
  }

  // defaults that need the profile / template (only when the rest is valid)
  if (!errors.length) {
    const prof = resolveProfile(normalized, model);
    const sp = model.sport(prof.id);
    const family = familyOf(normalized, sp, model);
    const lvl = clientLevel(normalized, prof, sp, model);
    const tsel = selectTemplate(normalized, family, prof, sp, model);
    if (tsel.warning) warnings.push(tsel.warning);
    if (normalized.schedule.weekdays === null) normalized.schedule.weekdays = templateWeekdays(tsel, model);
    if (normalized.schedule.weekdays.length < normalized.schedule.days_per_week) {
      warn('v2_days', 'warning.v2_days', { days: normalized.schedule.days_per_week, weekdays: normalized.schedule.weekdays.length }, 'schedule.weekdays');
    }
  }

  return { ok: errors.length === 0, errors, warnings, intake: normalized };
}

// ---------------------------------------------------------------------------------------------------------------
// safetyScreen / checkRelease
// ---------------------------------------------------------------------------------------------------------------

/**
 * F01 health screen with the coach bypass (V1; R2-GEN-03). Severe pain is always read, even with the coach bypass.
 * engine 0.7 (COACH-R5 R5-GEN-02 'It doesn't stop because we're not taking on any liability, but it should warn them'; DECISIONS
 * G-270 ... G-273): with a model whose rules.legal.health_flag.on_flag is 'warn', a flag no longer refers - the plan is built and
 * carries the health warning (`warn: true`; the reasons say 'a yes on the health check' and / or 'severe pain', never which health
 * question was a yes, G-274). Without a model (or with on_flag 'refer') the
 * retired stop of engine 0.6 is returned: `refer: true` on any reason.
 * @param {object} intake (normalized or raw intake/2)
 * @param {object} [model] the loaded model (reads rules.legal.health_flag)
 * @returns {{refer:boolean, warn:boolean, reasons:string[], bypass:boolean}}
 */
export function safetyScreen(intake, model) {
  const reasons = [];
  const bypass = !!intake && intake.role === 'client' && intake.health_route === 'coach_own_sop';
  if (intake && !bypass && isObj(intake.safety)) {
    for (const k of SAFETY_KEYS) if (intake.safety[k] === true) reasons.push(`refer.reason.${k}`);
  }
  if (intake && Array.isArray(intake.pain) && intake.pain.some(p => p && p.severity === 'severe')) reasons.push('refer.reason.severe_pain');
  const warnMode = healthFlagMode(model) === 'warn';
  if (warnMode) {
    // G-274 (spec legal_and_privacy.no_data_kept.health_answers 'never in the plan', R3-GEN-01): the plan that is built never says
    // which health question was a yes - every yes is the one reason rules.legal.health_flag.answer_reason_key; severe pain is named
    const HF = model.rules.legal.health_flag;
    const named = reasons.filter(r => !SAFETY_KEYS.some(k => r === `refer.reason.${k}`));
    const anyYes = named.length < reasons.length;
    const out = [...(anyYes && HF.answer_reason_key ? [HF.answer_reason_key] : anyYes ? reasons.filter(r => !named.includes(r)) : []), ...named];
    return { refer: false, warn: out.length > 0, reasons: out, bypass };
  }
  return { refer: reasons.length > 0, warn: false, reasons, bypass };
}

/** 'warn' (R5-GEN-02: build the plan with the warning) or 'refer' (the retired stop) - rules.legal.health_flag.on_flag */
export function healthFlagMode(model) {
  const HF = model && model.rules && model.rules.legal && model.rules.legal.health_flag;
  return HF && HF.on_flag === 'warn' ? 'warn' : 'refer';
}

/**
 * V21 / H20: the release for THIS build is accepted and its version matches role and age.
 * @param {object} intake
 * @returns {{ok:boolean, issues:Issue[]}}
 */
export function checkRelease(intake) {
  const issues = [];
  const r = intake && intake.release;
  const expected = expectedRelease(intake);
  if (!isObj(r) || r.accepted !== true) issues.push(issue('release_missing', 'release.accepted', 'warning.release_missing', { expected }));
  else if (r.version !== expected) issues.push(issue('release_missing', 'release.version', 'warning.release_missing', { expected, got: String(r.version) }));
  else if (expected === 'release.minor' && r.guardian !== true) issues.push(issue('release_missing', 'release.guardian', 'warning.release_missing', { expected }));
  return { ok: issues.length === 0, issues };
}

// youth age = rules.levels.youth_age (18); the function has no model, so the vocabulary value is mirrored here.
const YOUTH_AGE_FOR_RELEASE = 18; // INFERRED: equals rules.levels.youth_age / population.youth.below_age (asserted in tests)
function expectedRelease(intake) {
  if (intake && isNum(intake.age) && intake.age < YOUTH_AGE_FOR_RELEASE) return 'release.minor';
  if (intake && intake.role === 'client') return 'release.coach';
  return 'release.client';
}

// ---------------------------------------------------------------------------------------------------------------
// D2 profile, D1 family, D3 level, D6 template (shared by validateIntake defaults and deriveValues)
// ---------------------------------------------------------------------------------------------------------------

function activityProfile(model, actId, act) {
  const a = model.activity(actId);
  let pid = a.profile, variant = a.variant || null;
  if (act && act.league_sport && a.league_sport.length) { const ls = a.league_sport.find(x => x.value === act.league_sport); if (ls) pid = ls.profile; }
  if (act && act.style && a.style.length) { const st = a.style.find(x => x.value === act.style); if (st) { pid = st.profile; variant = st.variant || null; } }
  return { pid, variant };
}

/** D2 (spec derived_values.D2_profile, 7 steps; CONTRACTS §4.3) */
function resolveProfile(i, model) {
  const P = model.profiles, R = model.rules;
  const goal = i.goal;
  const actIds = i.activity ? i.activity.ids.slice() : [];
  let pid, variant = null, competitive = 'none', sport_id = null, position = null, position_detail = null;
  const why_ = [];
  if (!ATHLETIC_GOALS.includes(goal)) {
    // step 2: goal profile leads; an activity leads only when its profile lists the goal in lead_for_goals
    pid = P.goal_defaults[goal];
    if (actIds.length) {
      const ap = activityProfile(model, actIds[0], i.activity);
      const asp = model.sport(ap.pid);
      if ((asp.lead_for_goals || []).includes(goal)) { pid = asp.id; variant = ap.variant; competitive = 'recreational'; }
    }
  } else if (goal === 'athletic' && i.sport && i.sport.competitive === 'competitive') {
    // step 3
    const ps = model.pickerSport(i.sport.sport);
    sport_id = ps.id; position = i.sport.position; position_detail = i.sport.position_detail; competitive = 'competitive';
    const pos = position ? ps.positions.find(p => p.value === position) : null;
    if (pos) pid = pos.profile || (pos.profile_by_choice ? (pos.profile_by_choice[position_detail] || null) : null);
    if (!pid) pid = ps.default_profile;
    const sc = ps.second_choice && position_detail ? ps.second_choice.options.find(o => o.value === position_detail) : null;
    variant = (pos && pos.variant) || (sc && sc.variant) || ps.default_variant || null;
    if (sc && sc.profile) pid = sc.profile;
    if (ps.age_variant && isNum(i.age) && i.age >= R.levels.older_age) {
      const v60 = ps.age_variant['60_plus'];
      if (v60 && model.hasSport(pid) && model.sport(pid).variants && model.sport(pid).variants[v60]) variant = v60;
    }
  } else if (goal === 'active' || (i.sport && i.sport.competitive === 'recreational')) {
    // step 4
    const ap = activityProfile(model, actIds[0], i.activity);
    pid = ap.pid; variant = ap.variant; competitive = 'recreational';
  } else {
    // step 5
    pid = P.recreational_profile;
  }
  let sp = model.sport(pid);
  pid = sp.id;
  if (variant && !(sp.variants && sp.variants[variant])) variant = null;

  // step 6: age overlays
  const overlays = [];
  const isRecDefault = pid === P.recreational_profile;
  let lead = null;
  const addOverlay = (id, leads) => { if (model.hasSport(id)) { overlays.push(id); if (leads && !lead) lead = id; } };
  if (isNum(i.age)) {
    if (i.age >= R.levels.older_age) addOverlay('active_aging_60plus', isRecDefault);
    else if (i.age >= R.levels.active_aging_age && competitive !== 'competitive') addOverlay('active_aging_50plus', isRecDefault);
    else if (i.age < R.levels.youth_age) {
      if (competitive === 'competitive') addOverlay('youth_athlete', false);
      else addOverlay('youth_general_athletic', isRecDefault);
    }
  }
  if (lead) { pid = lead; sp = model.sport(lead); variant = null; why_.push(why('why.profile', 'COACH-CHAT 2026-10-08', { profile: lead })); }
  return {
    id: pid, variant, sport_id, position, position_detail, activity_ids: actIds, overlays, competitive,
    ath03_group: sp.ath03_group || null, ground_contact_class: isNum(sp.ground_contact_class) ? sp.ground_contact_class : null,
    season_type: sp.season_type || 'I', name_key: sp.name_key
  };
}

/** D1 */
function familyOf(i, sp, model) {
  const T = model.templates;
  let family = sp.template_hint && sp.template_hint.family ? sp.template_hint.family : T.goal_to_family[i.goal];
  const o = T.kit_family_override;
  if (i.equipment && o.profiles.includes(i.equipment.profile) && !o.except_goals.includes(i.goal)) family = o.family;
  return family;
}

/** D3 */
function clientLevel(i, prof, sp, model) {
  const LV = model.rules.levels, C = LV.client;
  const years = i.experience.years_consistent, days = i.schedule.days_per_week;
  const months = i.experience.months_off_last_2y || 0;
  const reason_keys = [{ key: 'level.reason.exp_years', args: { years } }];
  let yearsLevel = years < C.L1_below_years ? 'L1' : 'L2';
  let l3 = false;
  if (yearsLevel === 'L2' && years >= C.L3_min_years && days >= C.L3_min_days) {
    yearsLevel = 'L3'; l3 = true; reason_keys.push({ key: 'level.reason.days_now', args: { days } });
  } else if (yearsLevel === 'L2' && C.L3_competitive_physique_strength && prof.competitive === 'competitive' && ['physique', 'strength'].includes(sp.family)) {
    yearsLevel = 'L3'; l3 = true; // D-01 (competitive physique / strength athlete)
  }
  let level = yearsLevel, replace_after_block = null;
  if (months >= C.layoff_months_body_L1) { level = 'L1'; reason_keys.push({ key: 'level.reason.layoff', args: { months } }); }
  if (i.experience.former_competitor && C.former_competitor_first_block_L1) {
    level = 'L1'; replace_after_block = 1; reason_keys.push({ key: 'level.reason.former_pro', args: {} });
  }
  let ladder = LV.exercise_ladder[yearsLevel];
  if (isNum(i.age) && i.age < LV.youth_age) {
    const order = LV.ladder_order;
    if (order.indexOf(ladder) > order.indexOf(LV.youth_max_ladder)) ladder = LV.youth_max_ladder;
  }
  return { level, reason_keys, exercise_ladder: ladder, replace_after_block, l3 };
}

/**
 * The session size (COACH-R4 R4-SES-02): how many exercises a session holds for this client type - not counting the warm-up or
 * the 2 core exercises. A recommendation in a template: the user adds or removes. Older adults (60+) take their own range
 * whatever the template; a timed circuit counts stations; a non-competitive athletic plan takes the stay-active size (PROPOSED).
 * @returns {{type:string, range:number[], default:number, refs:string[]}}
 */
export function sessionSize(i, family, prof, tsel, model) {
  const Z = model.rules.session.size;
  const dt = tsel && tsel.template ? model.dayTypes(tsel.template, tsel.variant) : null;
  const circuit = !!dt && Object.values(dt.day_types || {}).some(d => d.kind === 'main' && d.format === 'circuit');
  let type = Z.by_family[family] || 'general';
  if (circuit) type = Z.circuit_type;
  if (family === 'athletic' && !(prof && prof.competitive === 'competitive')) type = Z.stay_active_type;
  if (isNum(i.age) && i.age >= model.rules.population.older.from_age) type = Z.older_type;
  const def = Z.by_type[type];
  return { type, range: def.range.slice(), default: def.default, refs: (def.refs || Z.refs).slice() };
}

/** D6 variant choice (rules.template_select.variant_order; in_season variants are chosen per block by week.mjs) */
function selectTemplate(i, family, prof, sp, model) {
  const R = model.rules;
  const days = i.schedule.days_per_week;
  const t = model.template(family, days);
  const has = (v) => !!(t.variants && t.variants[v]);
  let variant = null, warning = null, reason = null;
  for (const step of R.template_select.variant_order) {
    if (variant) break;
    if (step === 'split_style') {
      const s = i.prefs.split_style;
      if (s && s !== 'default') {
        const v = R.template_select.split_style_variants[s];
        if (v && has(v)) { variant = v; reason = 'split_style'; }
        else warning = issue('split_style_unavailable', 'prefs.split_style', 'warning.split_style_unavailable', { days, style: s });
      }
    } else if (step === 'profile_template_hint') {
      const h = sp.template_hint;
      if (h && h.variant && h.family === family && has(h.variant)) { variant = h.variant; reason = 'profile_template_hint'; }
    } else if (step === 'unbuilt_main_fallback') {
      if (t.status === 'unbuilt' || !Object.keys(t.day_types).length) {
        const r = model.templateFor(family, days, null);
        if (r.variant) { variant = r.variant; reason = 'unbuilt_main_fallback'; }
      }
    } else if (step === 'same_pattern') {
      if (family === 'athletic' && R.pairing.same_pattern.ath03_groups.includes(prof.ath03_group) && has('same_pattern')) { variant = 'same_pattern'; reason = 'same_pattern'; }
    } else if (step === 'format_circuit') {
      if (family === 'fat_loss_bootcamp' && i.format === 'bootcamp') {
        const mainCircuit = Object.values(t.day_types).some(d => d.kind === 'main' && d.format === 'circuit');
        if (!mainCircuit && has('bootcamp_circuit')) { variant = 'bootcamp_circuit'; reason = 'format_circuit'; }
      }
    }
  }
  const r = model.templateFor(family, days, variant);
  const fam = model.templates.families[family];
  const finalVariant = r.variant || null;
  const pairing = finalVariant === 'same_pattern' || String(fam.pairing || '').startsWith('same_pattern') ? 'same_pattern' : 'cross_pattern';
  return { template: r.template, variant: finalVariant, fallback_days: r.fallback_days || null, pairing, warning, reason };
}

function templateWeekdays(tsel, model) {
  const dt = model.dayTypes(tsel.template, tsel.variant);
  return WEEKDAYS.filter(d => { const e = dt.week_layout[d]; return e && e.kind === 'main' && !e.optional && e.day_type; });
}

// ---------------------------------------------------------------------------------------------------------------
// deriveValues
// ---------------------------------------------------------------------------------------------------------------

/**
 * D1-D14 + helpers (CONTRACTS §4.0 Derived, §4.3). Accepts a raw or normalized intake (normalizes it again; idempotent).
 * Throws EngineError('intake.invalid') when the intake does not validate (generate checks validateIntake first).
 * @param {object} intake
 * @param {object} model
 * @returns {import('./util.mjs').Derived}
 */
export function deriveValues(intake, model) {
  const v = validateIntake(intake, model);
  if (!v.ok) throw new EngineError('intake.invalid', 'deriveValues needs a valid intake', { errors: v.errors });
  const i = v.intake;
  const R = model.rules, P = model.profiles;
  const warnings = v.warnings.slice();
  const whys = [];
  const r3 = [];

  const age = i.age;
  const older = age >= R.population.older.from_age;
  const age_group = age < R.levels.youth_age ? 'youth' : older ? 'older' : age >= R.levels.active_aging_age ? 'active_aging_50' : 'adult';
  const body_weight_lb = round2(i.body_weight.unit === 'kg' ? i.body_weight.value * 2.20462 : i.body_weight.value);

  // D2 / D1 / D3
  const D2 = resolveProfile(i, model);
  const sp = model.sport(D2.id);
  whys.push(why('why.profile', 'COACH-CHAT 2026-10-08', { profile: D2.id }));
  const D1 = familyOf(i, sp, model);
  const lvl = clientLevel(i, D2, sp, model);
  const D3 = { level: lvl.level, reason_keys: lvl.reason_keys, exercise_ladder: lvl.exercise_ladder, replace_after_block: lvl.replace_after_block };
  whys.push(why('why.level', 'PRG-05', { level: lvl.level, reason: lvl.reason_keys[lvl.reason_keys.length - 1].key, years: i.experience.years_consistent }));
  if (lvl.l3) whys.push(why('why.level_reason_l3', 'D-01'));

  // schedule
  const competitive = D2.competitive === 'competitive';
  const weekdays = i.schedule.weekdays.slice();
  const days_per_week = i.schedule.days_per_week;
  const play_days = i.activity ? i.activity.play_days.slice() : [];
  const event_date = i.activity ? i.activity.event_date : null;

  // prefs (older opt-in only from 60; cardio adjust clamped)
  const ca = R.conditioning.cardio_adjust;
  const prefs = { ...i.prefs, cardio_adjust: clamp(i.prefs.cardio_adjust, ca.min, ca.max), older_athletic_opt_in: older && i.prefs.older_athletic_opt_in };

  // Focus muscle 1 / 2 (R3-SES-01): the volume engine reads lines (focus_lines: shoulders = one line, R3-VOL-01); exercise
  // selection and ordering read muscle ids (priority_muscles: the muscles a Focus line steers, e.g. shoulders -> side + rear delts)
  const FO = R.volume.focus || { intake_map: R.volume.priority.intake_map, max: R.volume.priority.max_muscles, steer_muscles: {} };
  const choices = trimFocus(i.priority_muscles, FO);
  const lineOrder = (R.muscles.lines && R.muscles.lines.order) || R.muscles.order;
  const focus_lines = lineOrder.filter(l => choices.some(c => (FO.intake_map[c] || []).includes(l)));
  const steer = new Set();
  for (const c of choices) for (const l of FO.intake_map[c] || []) for (const m of ((FO.steer_muscles || {})[l] || (R.muscles.defs[l] ? [l] : []))) steer.add(m);
  if (choices.includes('core')) steer.add('abs_obliques');
  const priority_muscles = R.muscles.order.filter(m => steer.has(m));

  // D4 season
  const D4 = seasonPhase(i, D2, model);

  // D5 plan shape
  const mode = i.plan.mode;
  const PT = R.plan_types;
  const weeksByMode = { fixed_12: PT.fixed_12.weeks, fixed_8: PT.fixed_8.weeks, maintenance_4_6: i.plan.maint_weeks, week_by_week: PT.week_by_week.generate_weeks, year: PT.year.weeks };
  let overlay = null;
  if (['fixed_12', 'fixed_8', 'week_by_week'].includes(mode)) {
    if (competitive && i.sport.season && ['next_season_start', 'in_season_until'].includes(i.sport.season.type)) overlay = 'season';
    else if (competitive && i.sport.season && i.sport.season.type === 'competition_date') overlay = 'prep';
    else if (!competitive && event_date) overlay = 'prep';
  }
  const skel = PT.skeleton_ids;
  const D5 = { mode, overlay, skeleton: (skel[i.goal] && skel[i.goal][mode]) || skel.any[mode] || null, weeks: weeksByMode[mode] };

  // D6 template
  const tsel = selectTemplate(i, D1, D2, sp, model);
  const D6 = { template_id: tsel.template.id, family: tsel.template.family, days: tsel.template.days, variant: tsel.variant, pairing: tsel.pairing, format: i.format || 'gym' };
  whys.push(why('why.template', 'VOL-08', { template: D6.template_id }));
  // v0.5 (R4-SES-02): the session is sized by exercise count, never by minutes (CT-01)
  D6.session_size = sessionSize(i, D1, D2, tsel, model);
  whys.push(why('why.session_size', 'R4-SES-02', { n: D6.session_size.default }));
  if (D6.variant) whys.push(why('why.template_variant', tsel.reason === 'split_style' ? 'D-15' : 'R2-GEN-07', { variant: D6.variant }));

  // D7 constraint band
  // engine 0.7 (G-271, PROPOSED; R5-GEN-02): with the health warning on, severe pain no longer stops the plan - it is built with the
  // pain rules of rules.legal.health_flag.severe_pain.build_as (moderate) and the warning; the reported severity is kept
  const HFs = healthFlagMode(model) === 'warn' ? (R.legal.health_flag.severe_pain || null) : null;
  const pain = i.pain.map(p => (p.severity === 'severe' && HFs && HFs.build_as
    ? { area: p.area, side: p.side, severity: HFs.build_as, worse_with: p.worse_with.slice(), reported_severity: 'severe' }
    : { area: p.area, side: p.side, severity: p.severity, worse_with: p.worse_with.slice() }));
  const fctx = { older, pain_moderate: pain.some(p => p.severity === 'moderate'), family: D1, competitive: D2.competitive, goal: i.goal, level: D3.level };
  const famRule = R.equipment.family_select.find(r => matchWhen(r.when, fctx));
  const cf = R.equipment.client_families[famRule.use];
  const D7 = { client_family: famRule.use, main: cf.main.slice(), iso: cf.iso.slice(), machine_pen: cf.machine_pen, skill_pen: cf.skill_pen };

  // D8 kit (never inferred from a template or program name, R2-LIB-08)
  const D8 = kitOf(i, model);

  // D10 bilateral share
  const D10 = shareOf(i, D1, D2, D3, sp, older, pain, model);

  // D11 athletic budget
  const D11 = athleticOf(i, D1, D2, D3, sp, older, prefs, play_days, model);
  if (older) {
    warnings.push(issue('older_athletic', null, R.population.older.warning_key));
    whys.push(why(prefs.older_athletic_opt_in ? 'why.older_opt_in' : 'why.older_default', 'R2-ATH-08'));
    r3.push(R.population.older.r3);
  }
  if (age_group === 'active_aging_50' && R.population.active_aging_50.racket_profiles.includes(D2.id)) {
    whys.push(why('why.age_50_racket', 'R3-ATH-02'));
    r3.push(R.population.active_aging_50.r3);
  }

  // D12 planned step (no intake input decides it; R3-VOL-04 approved): the default pattern - about 3 % a week to the halfway week,
  // about 5 % after it. v0.5 (COACH-CX CX-01, R4-PRG-01 / 02): it is the stairway's SHAPE, not a limit - the planned final sets are
  // reached in the last week and a week may add more when the block needs it (noted above about 15 %). No cap exists.
  const PGR = R.stairway.progression;
  const D12 = {
    early: R.stairway.standard_steps.early, late: R.stairway.standard_steps.late,
    caps: { nonpriority_while_priority: null, older: null },
    target_reached: true, note_above: PGR.note_above, arrival_weeks_early_max: PGR.arrival_weeks_early_max,
    source: 'planned_stairway'
  };

  // D14 aerobic sessions
  const D14 = aerobicOf(i, D1, D2, D3, sp, prefs, play_days, model, whys, r3);

  // assemble the derived object (key order = CONTRACTS §4.0)
  const derived = {
    D1_family: D1, D2_profile: D2, D3_client_level: D3, D4_season_phase: D4, D5_plan_shape: D5, D6_week_layout: D6,
    D7_constraint_band: D7, D8_kit: D8, D9_start_sets: null, D10_bilateral_share: D10, D11_athletic_budget: D11,
    D12_planned_step: D12, D13_tests: null, D14_aerobic_sessions: D14,
    goal: i.goal, format: i.format || 'gym', lang: i.lang, units: i.units, age, age_group, body_weight_lb,
    days_per_week, weekdays, start_date: i.schedule.start_date, play_days, event_date,
    priority_muscles, priority_choices: choices.slice(), focus_lines, pain, exclusions: i.exclusions.slice(), lift_style: i.lift_style, output_mode: 'plan_only', prefs,
    previous_cycles: { ...i.plan.previous_cycles }, just_finished_block: i.plan.just_finished_block, view: i.plan.view || null,
    maint_reason: i.plan.maint_reason, maint_weeks: i.plan.maint_weeks,
    health: null, release: { accepted: i.release.accepted, version: i.release.version, lang: i.release.lang, guardian: i.release.guardian },
    equipment_preference: i.equipment.preference, modifier_id: null, r3_pending: [], warnings: [], why: []
  };
  const scr = safetyScreen(i, model);
  derived.health = { role: i.role, health_route: i.health_route, refer: scr.refer, warn: scr.warn, reasons: scr.reasons, bypass: scr.bypass };
  // engine 0.7 (R5-GEN-02, G-270): the plan is built and says so up front (the line itself is printed by render.mjs)
  if (scr.warn) {
    const HF = R.legal.health_flag;
    warnings.push(issue(HF.warning_code, null, HF.warning_key));
    whys.push(why('why.health_flag', 'R5-GEN-02'));
  }

  // D13 tests + training-block layout (shared with shape.mjs)
  const blocks = planTrainingBlocks({ ...derived, D13_tests: { items: [], baseline_week: null, end_weeks: [], from_zero: false } }, model);
  const items = i.plan.tests.filter(t => t !== 'none');
  // v1.2 (review 02 major 6 / 03 major 9): 'from zero' means untrained - L1, a long layoff or under a year of consistent
  // training (rules.tests.from_zero_if) - not 'no previous Blaze Camp cycle'; a 3-year athlete tests for real
  const FZ = R.tests.from_zero_if;
  const from_zero = Array.isArray(FZ)
    ? ((FZ.includes('level_L1') && D3.level === 'L1') || (FZ.includes('layoff') && (i.experience.months_off_last_2y || 0) >= R.levels.client.layoff_months_body_L1) ||
       (FZ.includes('years_consistent_lt_1') && (i.experience.years_consistent || 0) < 1) ||
       (FZ.includes('youth') && typeof derived.age === 'number' && derived.age < R.levels.youth_age))
    : ((i.plan.previous_cycles.count === 0 && !i.plan.just_finished_block) || D3.level === 'L1' || (i.experience.months_off_last_2y || 0) >= R.levels.client.layoff_months_body_L1);
  const stairs = blocks.training_blocks.filter(b => b.type === 'stairway');
  let end_weeks = [];
  if (items.length) {
    end_weeks = stairs.map(b => b.weeks[1]);
    if (mode === 'year') end_weeks = end_weeks.filter(w => PT.year.test_weeks.includes(w));
  }
  derived.D13_tests = { items, baseline_week: items.length && stairs.length ? stairs[0].weeks[0] : null, end_weeks, from_zero };
  if (items.length) whys.push(why('why.test_timing', 'R2-PER-07'));

  // V3 / V6 warnings
  const preWeeks = blocks.training_blocks.filter(b => b.type === 'pre_season' || b.type === 'taper');
  if (D5.overlay === 'season' && preWeeks.length) {
    const n = preWeeks.reduce((a, b) => a + (b.weeks[1] - b.weeks[0] + 1), 0);
    warnings.push(issue('v6_season', 'sport.season', 'warning.v6_season', { weeks: n }));
  }
  if (D5.overlay === 'season' && blocks.training_blocks.some(b => b.type === 'in_season')) warnings.push(issue('v6_in_season', 'sport.season', 'warning.v6_in_season'));
  if (D5.overlay === 'season' && D4.weeks_to_season !== null) whys.push(why('why.season_plan', 'D-10', { weeks: D4.weeks_to_season }));

  // D9 start sets (volume.computeTargets)
  const D9 = computeTargets(derived, model);
  derived.D9_start_sets = D9;
  derived.modifier_id = D9.modifier_id;

  // round-3 questions are answered (coach_answers_round3.md): only values still tagged `r3` in rules (other owners' tables)
  // are listed; the volume, time and placement rules of stage B1 carry their COACH-R3 refs instead (D-43 closed for them)
  if (D11.heavy_play_week && R.athletic.heavy_play_weeks.r3) r3.push(R.athletic.heavy_play_weeks.r3);
  // (fix round 2 / F1, E-157; RECHECK v0.4 08 minor: derived.r3_pending still listed R3-ATH-02 / R3-ATH-05 after meta.r3_pending was
  // cleared): the answers the coach approved (rules.r3_approved) are not pending - the same list generate.mjs reads for meta
  const r3Approved = Array.isArray(R.r3_approved) ? R.r3_approved : [];
  derived.r3_pending = uniqSorted(r3.filter(Boolean).flatMap(x => String(x).split(',').map(s => s.trim())).filter(x => /^R3-[A-Z]+-\d+$/.test(x) && !r3Approved.includes(x)));
  derived.warnings = warnings;
  derived.why = whys;
  return derived;
}

// ---------------------------------------------------------------------------------------------------------------
// D4, D8, D10, D11, D14 helpers
// ---------------------------------------------------------------------------------------------------------------

function phaseForWeeks(W, model) {
  const th = Object.entries(model.rules.plan_types.season.weeks_to_season).sort((a, b) => b[1] - a[1]);
  if (W < 0) return 'IN';
  for (const [phase, min] of th) if (W >= min) return phase;
  return th[th.length - 1][0];
}

function seasonPhase(i, D2, model) {
  const none = { phase: null, weeks_to_season: null, season_date: null, competition_date: null, season_type: null, practice_days: null, game_days: [], in_season_until: null };
  if (D2.competitive !== 'competitive' || !i.sport || !i.sport.season) return none;
  const S = i.sport.season, start = i.schedule.start_date;
  const out = { phase: null, weeks_to_season: null, season_date: null, competition_date: null, season_type: D2.season_type,
    practice_days: i.sport.practice ? i.sport.practice.practice_days_per_week : null,
    game_days: i.sport.practice ? i.sport.practice.game_days.slice() : [], in_season_until: null };
  if (S.type === 'next_season_start') {
    const W = weeksBetween(start, S.date);
    out.weeks_to_season = W; out.season_date = S.date; out.phase = phaseForWeeks(W, model);
  } else if (S.type === 'in_season_until') {
    out.phase = 'IN'; out.in_season_until = S.date;
  } else if (S.type === 'competition_date') {
    const W = weeksBetween(start, S.date);
    out.weeks_to_season = W; out.competition_date = S.date; out.phase = phaseForWeeks(W, model);
  } else {
    out.phase = 'OFF_BUILD'; // INFERRED (CONTRACTS §4.3 D4: no_season)
  }
  return out;
}

function kitOf(i, model) {
  const E = model.rules.equipment;
  const e = i.equipment;
  const tokens = new Set(E.profiles[e.profile] ? E.profiles[e.profile].kit : []);
  for (const t of e.extras) tokens.add(t);
  for (const m of e.machines) tokens.add(E.machines[m]);
  const cardio = e.detail.cardio_options.filter(c => c !== 'none');
  for (const c of cardio) tokens.add(E.cardio_tokens[c]);
  const rs = e.detail.running_space ? E.running_space[e.detail.running_space] : null;
  if (rs) {
    for (const t of rs.drop || []) tokens.delete(t);
    for (const t of rs.add || []) tokens.add(t);
    if (rs.unless_cardio_run && cardio.includes('run')) tokens.add(E.cardio_tokens.run);
  }
  for (const t of E.banned_tokens) tokens.delete(t);
  const kit = uniqSorted(Array.from(tokens));
  const machines = e.machines.length ? e.machines.slice() : Object.keys(E.machines).filter(m => kit.includes(E.machines[m]));
  const owned = e.detail.medball_lb_owned;
  return {
    profile: e.profile, tokens: kit, machines,
    medball_max_lb: owned.length ? Math.min(model.rules.medball.max_lb, Math.max(...owned)) : null,
    heaviest_db_pair: e.detail.heaviest_db_pair, box_height_in: e.detail.box_height_in, buy_list: [],
    // v0.4 stage B3 (minimal, additive): the client's own cardio tools and running space name the aerobic sessions (EQ-14;
    // RECHECK 03 / 07 / 08: 'run' sessions for a client with a bike and no running space)
    cardio_options: cardio.slice(), running_space: e.detail.running_space || null
  };
}

function shareOf(i, D1, D2, D3, sp, older, pain, model) {
  const B = model.rules.bilateral_share;
  const ctx = { older, sport_share: !!(sp.share && sp.share.lower), family: D1, competitive: D2.competitive, format: i.format || 'gym', goal: i.goal, level: D3.level };
  const rule = B.select.find(r => matchWhen(r.when, ctx));
  let profile_id = rule.use, lower, upper;
  if (rule.use === 'sport') {
    lower = { by_exercise_block: sp.share.lower.by_exercise_block.slice(), PRE: sp.share.lower.PRE ?? null, IN: sp.share.lower.IN ?? null };
    upper = sp.share.upper && Array.isArray(sp.share.upper.by_exercise_block) ? { by_exercise_block: sp.share.upper.by_exercise_block.slice() }
      : { by_exercise_block: lower.by_exercise_block.slice() }; // upper.same_logic: the same block targets (UNI-03)
  } else {
    const p = B.profiles[rule.use];
    lower = { by_exercise_block: p.lower.by_exercise_block.slice(), PRE: p.lower.PRE ?? null, IN: p.lower.IN ?? null };
    upper = { by_exercise_block: p.upper.by_exercise_block.slice() };
  }
  // pain shift (lower body areas with share_shift_to)
  let shift = 0;
  const areas = uniqSorted(pain.filter(p => p.severity !== 'severe').map(p => p.area));
  for (const a of areas) {
    const def = model.rules.volume.pain.areas[a];
    if (def && def.share_shift_to === 'unilateral') shift -= B.pain_shift;
    if (def && def.share_shift_to === 'bilateral') shift += B.pain_shift;
  }
  shift = round2(clamp(shift, -B.pain_shift, B.pain_shift));
  const [lo, hi] = B.slider_range;
  const sh = (x) => (x === null || x === undefined ? null : round2(clamp(x + shift, lo, hi)));
  if (shift) lower = { by_exercise_block: lower.by_exercise_block.map(sh), PRE: sh(lower.PRE), IN: sh(lower.IN) };
  return { profile_id, lower, upper, pain_shift: shift };
}

function athleticOf(i, D1, D2, D3, sp, older, prefs, play_days, model) {
  const A = model.rules.athletic;
  const goalDef = model.goal(i.goal);
  const enabled = !!goalDef.plyo_block || D1 === 'athletic';
  let plyo_share = sp.plyo_share ? { start: sp.plyo_share.start, end: sp.plyo_share.end } : null;
  if (!plyo_share && isNum(sp.ground_contact_class) && A.ground_contact_classes[String(sp.ground_contact_class)]) {
    const end = A.ground_contact_classes[String(sp.ground_contact_class)].end;
    plyo_share = { start: round2(Math.max(A.share_floor, end + A.block_start_offset)), end };
  }
  const aw = sp.athletic_weekly || {};
  // v0.5 fix round 1 (sample 03 major: a 3-day soccer plan printed 'holds about 53 % of your sport's weekly jump contacts' three
  // times): the weekly athletic numbers of a profile the coach has not confirmed are written for the four training days of his
  // athletic sheet (OBSERVED BYOP ATHLETIC - FULL BODY - 4 DAYS); a plan with fewer training days takes that share of them
  // (rules.athletic.x1.scale_by_days). His own confirmed profiles keep their numbers.
  const SBD = A.x1 && A.x1.scale_by_days;
  const tdays = i.schedule && isNum(i.schedule.days_per_week) ? i.schedule.days_per_week : null;
  const dayScale = SBD && tdays && (SBD.confidences || []).includes(sp.confidence) ? Math.min(1, Math.max(SBD.floor, tdays / SBD.reference_days)) : 1;
  const stepOf = (k) => (SBD && SBD.step && isNum(SBD.step[k]) ? SBD.step[k] : 5);
  const pick = (k) => (Array.isArray(aw[k]) ? aw[k].map(v => (dayScale < 1 && (SBD.keys || []).includes(k) ? Math.max(0, Math.round(v * dayScale / stepOf(k)) * stepOf(k)) : v)) : null);
  const ol = sp.olympic || {};
  const ishg = A.in_season_game_heavy;
  return {
    enabled,
    older_mode: older ? (prefs.older_athletic_opt_in ? 'opt_in' : 'default') : null,
    plyo_share: enabled ? plyo_share : null,
    ground_contact_class: isNum(sp.ground_contact_class) ? sp.ground_contact_class : null,
    contacts_session_max: A.contacts_per_session_max[D3.level],
    weekly: { plyo_contacts: pick('plyo_contacts'), jump_contacts: pick('jump_contacts'), low_contacts: pick('low_contacts'), throws: pick('throws'),
      cod_cuts: pick('cod_cuts'), sprint_m: pick('sprint_m'), olympic_sets: pick('olympic_sets') },
    olympic_exposures_wk: ol.none_by_default ? null : (isNum(ol.exposures_wk) ? ol.exposures_wk : null),
    medball_main: !!goalDef.medball_main && !!(!sp.medball || sp.medball.main_workout),
    cod_sport: !!sp.cod_sport,
    day_scale: dayScale,
    game_heavy: !!((sp.in_season && sp.in_season.game_heavy) || (sp.sport && ishg.sports.includes(sp.sport))),
    heavy_play_week: play_days.length >= A.heavy_play_weeks.min_play_sessions
  };
}

function aerobicOf(i, D1, D2, D3, sp, prefs, play_days, model, whys, r3) {
  const C = model.rules.conditioning;
  const goalDef = model.goal(i.goal);
  const POP = { muscle: 'aesthetics', strength: 'powerlifter', hybrid: 'hybrid' }; // goal -> rules.conditioning.sessions key (CONTRACTS §4.3 D14)
  const aer = sp.aerobic || {};
  const sport_is_aerobic = !!aer.sport_is_aerobic;
  let base;
  if (sport_is_aerobic) base = isNum(aer.off) ? aer.off : C.sessions.sport_is_aerobic;
  else if (goalDef.aerobic === 'by_profile' && isNum(aer.off)) base = aer.off;
  else base = C.sessions[POP[i.goal] || i.goal];
  if (!isNum(base)) base = 0;
  // activity sessions count as aerobic work (R3-ATH-05, D-24)
  let replaced = 0;
  const actSp = D2.activity_ids.length ? model.sport(activityProfile(model, D2.activity_ids[0], i.activity).pid) : null;
  const counts = !!(aer.activity_counts || (actSp && actSp.aerobic && actSp.aerobic.activity_counts));
  const ACA = C.activity_counts_as_aerobic;
  const longEnough = !(i.activity && i.activity.play_minutes === 'under_45'); // R3-ATH-05: a 45-60+ minute session counts
  if (ACA.enabled && counts && longEnough && play_days.length && base >= 1) {
    replaced = Math.max(0, Math.min(play_days.length, ACA.max_replaced, base - ACA.keep_gym_led_min));
    if (replaced) { whys.push(why('why.activity_counts', 'R3-ATH-05', { activity: D2.activity_ids[0] || D2.id, n: replaced })); r3.push(ACA.r3); }
  }
  // v0.6 (G-136, 03 M1; R3-ATH-05 'a 45-60+ min session of the activity counts as one of the cardio sessions (up to 2)', PROPOSED for a
  // competitive athlete's team practices): practices count as aerobic sessions the same way, the gym keeping at least one of its own
  const practiceN = practiceCount(i, model);
  let replaced_by_practice = 0;
  const PRc = C.s6 && C.s6.practice;
  if (practiceN > 0 && base >= 1) {
    replaced_by_practice = Math.max(0, Math.min(practiceN, PRc.max_replaced - replaced, base - replaced - PRc.keep_gym_led_min));
    if (replaced_by_practice) whys.push(why('why.practice_counts', 'R3-ATH-05', { n: practiceN }));
  }
  const adjust = prefs.cardio_adjust;
  const per_week = Math.max(C.cardio_adjust.floor_total, base - replaced - replaced_by_practice + adjust);
  const unlock = C.unlock && C.unlock[D1] ? C.unlock[D1][D3.level] : null;
  const order = unlock ? C.fill_order.filter(c => unlock.includes(c)) : C.fill_order.slice();
  const colours = [];
  for (let k = 0; k < per_week; k++) colours.push(k < order.length ? order[k] : C.extra_colour);
  const walks = C.walks.goals.includes(i.goal);
  const fighter_open = sp.family === 'combat';
  whys.push(why('why.aerobic_count', 'ATH-07', { n: per_week }));
  if (sport_is_aerobic) { whys.push(why('why.sport_is_aerobic', 'R3-ATH-01')); r3.push('R3-ATH-01'); }
  if (adjust) whys.push(why('why.cardio_adjust', 'R2-SES-06', { delta: adjust }));
  if (walks) whys.push(why('why.walks', 'ATH-07'));
  if (fighter_open) whys.push(why('why.aerobic_fighter_open', 'ORD-09'));
  return { per_week, base, adjust, replaced_by_activity: replaced, walks, colours, fighter_open, sport_is_aerobic, ...(PRc ? { practice_days: practiceN, replaced_by_practice } : {}) };
}

/** v0.6 (G-136): the team practices a week that count for a competitive athlete (rules.conditioning.s6.practice); 0 when the rule is off */
export function practiceCount(i, model) {
  const PR = model.rules.conditioning.s6 && model.rules.conditioning.s6.practice;
  if (!PR || !PR.counts_as_aerobic || !i.sport || !i.sport.practice) return 0;
  if (PR.competitive_only && i.sport.competitive !== 'competitive') return 0;
  const n = i.sport.practice.practice_days_per_week;
  return typeof n === 'number' && n > 0 ? n : 0;
}

