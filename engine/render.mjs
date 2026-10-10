// engine/render.mjs - plan rendering (engine/CONTRACTS.md §4.11). Owner: B4; v0.4 stage B3 (rendering).
// Markdown (default) or plain text, English or Spanish. Every word comes from model.t; this file holds no user-facing
// words, only punctuation and layout. Phone-friendly: day cards are numbered lists, tables have at most 4 columns
// (the block view has 3). Template notes / dose_text / condition_text are internal hints and are never rendered.
// v0.4 stage B3 (coach_answers_round3.md): every plan opens with the use-at-your-own-risk line linking the release (R3-GEN-01);
// the time check is shown up front - what is trained directly, what is not (time), the offers (R3-SES-02); each day says which
// blocks can be switched off and which supersets save time (R3-SES-02); macro tables (block / week / day) for screenshots
// (R2-GEN-02); nothing about check-ins (R3-VOL-02).
import { WEEKDAYS, addDays } from './util.mjs';
import { tr, levelText, changesText, stairText, whyText, listAnd } from './explain.mjs';

const YT = 'https://www.youtube.com/results?search_query=';
const INSTRUCTION_KEYS = ['instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5'];
const DASH = ' — ';
const DOT = ' · ';
// warnings the schedule section already says in full (R3-SES-02 time check)
const SCHEDULE_WARNINGS = ['warning.time_check', 'warning.not_trained_directly', 'warning.credit_only_groups', 'warning.time_lower_peak', 'warning.below_floor_work_lift'];
// blocks the day card offers to switch off (they add no stairway sets; COACH-R3 R3-SES-02 'turn off that day's athletic training or
// that day's core training'); v0.4 fix round 1 / F3 (RECHECK 01 / 02 / 03 / 04 / 06 / 07 minors: the JSON let the person switch off
// the accessories and the cool-down, the card never said so): every switchable kind the day's toggle_blocks names
const SWITCH_KINDS = ['athletic', 'power', 'core', 'skill', 'conditioning', 'aerobic', 'prehab', 'accessories', 'cooldown'];
const SS_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// notes the plan prints once (F3: 'Lots of play this week' on every jump of every week, RECHECK 08 minor; the core-superset option
// printed once by accident on one item, RECHECK 07 minor)
const ONCE_NOTES = ['note.heavy_play_week', 'note.core_supersets_optional'];
const ONCE_LINE = { 'note.heavy_play_week': 'ui.plan.heavy_play_plan', 'note.core_supersets_optional': 'ui.plan.core_supersets_line' };

/**
 * @param {import('./util.mjs').Plan} plan @param {import('./util.mjs').Model} model
 * @param {{lang?:'en'|'es', format?:'markdown'|'text', view?:'full'|'overview'|'block'|'week'|'day', weeks?:'all'|number[],
 *           show_why?:boolean, show_swaps?:boolean, units?:'lb'|'kg'}} [opts]
 * @returns {string}
 */
export function renderPlan(plan, model, opts = {}) {
  const o = norm(plan, opts);
  let md;
  if (plan.status === 'refer') md = renderRefer(plan, model, o);
  else if (plan.status === 'invalid') md = renderInvalid(plan, model, o);
  else if (o.view === 'block') md = [ownRiskShort(model, o), ...(plan.shape.training_blocks || []).map(tb => blockView(plan, tb.n, model, o))].join('\n\n');
  else if (o.view === 'week') md = [ownRiskShort(model, o), ...weekNumbers(plan, o).map(n => weekSection(plan, n, model, o))].join('\n\n');
  else if (o.view === 'day') md = [ownRiskShort(model, o), ...weekNumbers(plan, o).flatMap(n => dayList(plan, n).map(d => dayCard(plan, n, d.weekday, model, o)))].join('\n\n');
  else if (o.view === 'overview') md = overviewView(plan, model, o);
  else md = fullView(plan, model, o);
  return finish(md, o);
}

/** one compact table per training day of a training block: exercises x weeks (sets per week, reps first -> last), stairway levels
 * @param {import('./util.mjs').Plan} plan @param {number} trainingBlock @returns {string} */
export function renderBlockView(plan, trainingBlock, model, opts = {}) {
  const o = norm(plan, opts);
  return finish(blockView(plan, trainingBlock, model, o) + '\n\n' + ownRiskShort(model, o), o);
}

/** @param {import('./util.mjs').Plan} plan @param {number} weekN @returns {string} */
export function renderWeek(plan, weekN, model, opts = {}) {
  const o = norm(plan, opts);
  return finish(weekSection(plan, weekN, model, o) + '\n\n' + ownRiskShort(model, o), o);
}

/** @param {import('./util.mjs').Plan} plan @param {number} weekN @param {string} weekday @returns {string} */
export function renderDay(plan, weekN, weekday, model, opts = {}) {
  const o = norm(plan, opts);
  const card = dayCard(plan, weekN, weekday, model, o);
  return finish(card ? card + '\n\n' + ownRiskShort(model, o) : '', o);
}

/** '8 to 12 Reps', '10/10', '12/10/8 -20', 'MAX', '3 rounds x 40 s' @param {import('./util.mjs').RepSpec|import('./util.mjs').RepSpec[]|null} rep @returns {string} */
export function formatReps(rep, model, lang) {
  if (!rep) return '';
  if (Array.isArray(rep)) return formatSetReps(rep, model, lang);
  const t = (k, a) => model.t(lang, k, a);
  switch (rep.type) {
    case 'range': {
      const br = model.rules.reps.brackets;
      const b = (rep.bracket && br[rep.bracket]) || Object.values(br).find(x => x.min === rep.min && x.max === rep.max);
      if (b) return t(b.label_key);
      return rep.min === rep.max ? t(repKey(model, rep.min), { n: rep.min }) : t('reps.fixed', { n: rep.min + '-' + rep.max });
    }
    case 'fixed': return t(repKey(model, rep.value), { n: rep.value });
    case 'per_side': return rep.min === rep.max ? t('reps.per_side_fixed', { n: rep.min }) : t('reps.per_side', { min: rep.min, max: rep.max });
    case 'max': return t('reps.max');
    case 'myo': return t('reps.myo');
    case 'seconds': return t('reps.seconds', { min: rep.min, max: rep.max });
    case 'contacts': return t('reps.contacts', { n: rep.value });
    case 'throws_per_side': return t('reps.throws_per_side', { n: rep.value });
    case 'metres': return t('reps.metres', { n: rep.value });
    case 'minutes': return rep.min === rep.max ? t('reps.minutes_fixed', { n: rep.min }) : t('reps.minutes', { min: rep.min, max: rep.max });
    case 'rounds_work': return t('reps.rounds_work', { rounds: rep.rounds, work_s: rep.work_s });
    case 'cuts': return t('reps.cuts', { n: rep.value });
    case 'bout': return t('reps.bout');
    case 'calories': return t('reps.calories', { n: rep.n });
    case 'sprint_reps': return t('reps.sprint_reps', { reps: rep.reps, m: rep.metres });
    case 'test': return testName(model, lang, rep.test);
    default: return '';
  }
}

/** '1 Rep', never '1 Reps' (fix round 2 / F3; RECHECK v0.4 04 minor: '3 x 1 Reps', '4 Reps -> 1 Reps') */
function repKey(model, n) { return n === 1 && model.has('en', 'reps.fixed_one') ? 'reps.fixed_one' : 'reps.fixed'; }

/** a test id is a `tests.*` key, or a catalogue exercise id (speed / agility drills such as the 5-10-5 shuttle) */
function testName(model, lang, id) {
  if (!model.has('en', 'tests.' + id) && model.hasEx(id)) return model.t(lang, model.ex(id).name_key);
  return model.t(lang, 'tests.' + id);
}

function formatSetReps(list, model, lang) {
  const P = model.rules.reps.pyramid;
  if (list.length === P.sets.length && list.every((r, i) => r && r.type === 'fixed' && r.value === P.sets[i].reps)) return P.notation;
  if (list.every(r => r && r.type === 'fixed')) return list.map(r => r.value).join('/');
  return list.map(r => formatReps(r, model, lang)).join(' / ');
}

/** 'leave 2 in the tank (2 RIR, RPE 8)' @param {import('./util.mjs').Effort|null} effort @returns {string} */
export function formatEffort(effort, model, lang) {
  if (!effort) return '';
  const t = (k, a) => model.t(lang, k, a);
  const rpe = (rir) => model.rules.effort.rpe_for_rir[String(rir)];
  switch (effort.type) {
    case 'rir': {
      // B3: a circuit station follows the planned effort in its own words ('about {rir} reps left at the bell', RECHECK 05 major)
      if (effort.circuit && effort.key && model.has('en', effort.key)) {
        // F3 (RECHECK 05 minor: 'about 1 reps left' / 'unas 1 repeticiones'): the singular line for one rep
        const one = effort.min === 1 && effort.max === 1 && model.has('en', effort.key + '_one');
        let c = t(one ? effort.key + '_one' : effort.key, { rir: effort.min === effort.max ? effort.min : effort.min + '-' + effort.max });
        if (effort.last_set === 'myo') c += DOT + t('effort.myo');
        else if (effort.last_set && model.has('en', 'effort.last_set.' + effort.last_set)) c += DOT + t('effort.last_set.' + effort.last_set);
        return c;
      }
      let s;
      if (effort.min === effort.max) s = t('effort.rir_single', { n: effort.min, rpe: effort.rpe_min ?? rpe(effort.min) });
      else s = t('effort.rir', { min: effort.min, max: effort.max, rpe_low: effort.rpe_min ?? rpe(effort.max), rpe_high: effort.rpe_max ?? rpe(effort.min) });
      if (effort.last_set === 'max') s += DOT + t('effort.max_last_set');
      if (effort.last_set === 'myo') s += DOT + t('effort.myo');
      return s;
    }
    case 'intent': case 'power': return effort.key ? t(effort.key) : '';
    case 'role': return effort.role === 'survival' ? t('effort.done') : '';
    case 'aerobic': return t('effort.aerobic');
    default: return effort.key ? t(effort.key) : '';
  }
}

/** @param {import('./util.mjs').Rest|null} rest @returns {string} */
export function formatRest(rest, model, lang) {
  if (!rest) return '';
  const t = (k, a) => model.t(lang, k, a);
  switch (rest.type) {
    case 'seconds':
      if (rest.min >= 120 && rest.max >= 180 && rest.min % 60 === 0 && rest.max % 60 === 0) return t('rest.minutes', { min: rest.min / 60, max: rest.max / 60 });
      return t('rest.seconds', { min: rest.min, max: rest.max });
    case 'after_pair':
      // B3: a pair that holds the day's work lift keeps the strength rest after the pair (RECHECK 02 / 04 minors); F3 (VOL-14 'rest
      // stated for every set'; RECHECK 02 / 06 minors: 'rest after the pair' with no time): every pair rests in numbers - minutes
      // for whole minutes from 2 min, else seconds
      if (typeof rest.min === 'number' && typeof rest.max === 'number') {
        if (rest.min >= 60 && rest.max >= 120 && rest.min % 60 === 0 && rest.max % 60 === 0 && model.has('en', 'rest.after_pair_minutes')) return t('rest.after_pair_minutes', { min: rest.min / 60, max: rest.max / 60 });
        if (model.has('en', 'rest.after_pair_seconds')) return t('rest.after_pair_seconds', { min: rest.min, max: rest.max });
        if (model.has('en', 'rest.after_pair_minutes')) return t('rest.after_pair_minutes', { min: Math.round(rest.min / 60), max: Math.round(rest.max / 60) });
      }
      return t('rest.after_pair');
    case 'work_rest': return t('rest.work_rest', { min: rest.min, max: rest.max });
    case 'as_prescribed': return t('rest.as_prescribed');
    case 'circuit': return '';   // shown once per circuit block (ui.plan.circuit_dose / note.circuit)
    default: return '';
  }
}

/** @param {import('./util.mjs').Load|null} load @param {'lb'|'kg'} [units] medball loads stay in lb (the balls are sold in lb) @returns {string} */
export function formatLoad(load, model, lang, units) {
  if (!load) return '';
  const t = (k, a) => model.t(lang, k, a);
  switch (load.type) {
    // (fix round 2 / F3: the tip names the week's own planned effort - 'about 3 more times' next to '3 in the tank')
    case 'week1_tip': return typeof load.rir === 'number' && model.has('en', 'load.week1_tip_rir') ? t('load.week1_tip_rir', { rir: load.rir }) : t('load.week1_tip');
    case 'power': return t('load.power');
    case 'bw_pct': return t('load.bw_pct', { min: load.min, max: load.max });
    case 'medball_lb': return load.min === load.max && !load.wall_ball ? t('load.medball_one', { n: load.min }) : t(load.wall_ball ? 'load.wall_ball' : 'load.medball', { min: load.min, max: load.max });
    case 'height': return t(load.value === 'medium' ? 'load.height_medium' : 'load.height_low');
    case 'pct_hint': return t('load.pct_hint', { pct: load.pct });
    case 'lb_range': return t(load.unit === 'kettlebell' ? 'wod.load.kettlebell' : 'wod.load.dumbbells', { min: load.min, max: load.max });
    default: return '';
  }
}

// ------------------------------------------------------------------------------------------------------------- internals

function norm(plan, opts) {
  return {
    lang: opts.lang || plan.lang || 'en', format: opts.format || 'markdown', view: opts.view || 'full', weeks: opts.weeks || 'all',
    show_why: !!opts.show_why, show_swaps: opts.show_swaps !== false, units: opts.units || plan.units || 'lb',
    show_supersets: !(plan.meta && plan.meta.derived && plan.meta.derived.prefs && plan.meta.derived.prefs.superset_recommendations === 'hide')
  };
}
const esc = (s) => String(s).replace(/([\\*_`])/g, '\\$1');
const T = (model, o) => (key, args) => esc(tr(model, o.lang, key, args));
const has = (model, key) => model.has('en', key);
function weekNumbers(plan, o) {
  const all = (plan.weeks || []).map(w => w.n);
  return o.weeks === 'all' ? all : all.filter(n => o.weeks.includes(n));
}
const weekOf = (plan, n) => (plan.weeks || []).find(w => w.n === n);
function dayList(plan, n) {
  const w = weekOf(plan, n);
  return w ? (w.days || []).slice().sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday)) : [];
}
function fmtNum(x) { return typeof x === 'number' ? String(Math.round(x * 100) / 100) : '–'; }
/** '12 Oct 2026' / '12 oct 2026' from an ISO date (fix round 2 / F3; R2-GEN-08; RECHECK v0.4 05 minor: machine dates in client copy) */
function fmtDate(model, lang, iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m || !model.has('en', 'date.dmy') || !model.has('en', 'date.month_short.' + Number(m[2]))) return iso || '';
  return model.t(lang, 'date.dmy', { d: Number(m[3]), mon: model.t(lang, 'date.month_short.' + Number(m[2])), y: m[1] });
}
/** a weekday inside a line: lower case in Spanish (R2-GEN-08; RECHECK v0.4 05 minor 'Lunes, Miércoles, Viernes' mid-line) */
function weekdayIn(model, lang, wd) { const w = model.t(lang, 'weekday.' + wd); return lang === 'es' ? w.toLowerCase() : w; }
/** 'a, b and c' / 'a, b y c' (the words already in `lang`); a plain comma list when the model has no conjunction */
function andList(model, lang, items) { return listAnd(model, lang, items); }
/** runs of week numbers as '1-4, 7, 9-12' */
function weekRuns(ns) {
  const out = [];
  for (const n of ns.slice().sort((a, b) => a - b)) { const last = out[out.length - 1]; if (last && last[1] === n - 1) last[1] = n; else out.push([n, n]); }
  return out.map(([a, b]) => (a === b ? String(a) : a + '-' + b)).join(', ');
}
function finish(md, o) {
  const s = md.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return o.format === 'text' ? toText(s) : s;
}

function toText(md) {
  return md.split('\n').filter(l => !/^\|?\s*:?-{3,}/.test(l.trim())).map(l => {
    let s = l;
    if (/^\s*\|.*\|\s*$/.test(s)) s = s.trim().replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*/).filter(Boolean).join(DOT);
    s = s.replace(/^#{1,6}\s+/, '').replace(/^(\s*)>\s?/, '$1');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2');
    s = s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|\s)_([^_]+)_(?=\s|$|[.,:;])/g, '$1$2');
    return s.replace(/\\([\\*_`])/g, '$1');
  }).join('\n');
}

function exName(model, o, it) {
  if (it.wod) return model.t(o.lang, 'slot.COND_WOD');   // a WOD is named as a WOD; its stations are listed under it
  if (aerobicOf(it) && it.effort && it.effort.modality) {
    // B3: an aerobic session is named by its colour and the client's own cardio tool (EQ-14; RECHECK 03 / 07 / 08)
    return tr(model, o.lang, 'aerobic.session', { colour: 'conditioning.colour.' + it.effort.colour, modality: 'cardio.modality.' + it.effort.modality });
  }
  // F3 (RECHECK 02 minor: '5-10-5 Pro-Agility Shuttle' had no 'Test:' label next to 'Test: 10-30 m sprint'): every test item
  // reads 'Test: ...', also when the test is a catalogue drill
  if (it.bucket === 'TEST' && it.test && it.test.test) return model.t(o.lang, 'ui.plan.test_item', { test: testName(model, o.lang, it.test.test) });
  if (it.name_key) {
    const n = model.t(o.lang, it.name_key);
    return it.detail && it.detail.key && model.has('en', it.detail.key) ? model.t(o.lang, 'ui.plan.detail', { name: n, detail: model.t(o.lang, it.detail.key) }) : n;
  }
  if (it.text_key) return model.t(o.lang, it.text_key);
  return model.t(o.lang, 'slot.' + it.bucket);
}
const aerobicOf = (it) => !!(it.aerobic || (it.effort && it.effort.type === 'aerobic'));

// ------------------------------------------------------------------------------------------------------------- legal line

/** COACH-R3 R3-GEN-01: 'use at your own risk', the release, the link to DISCLAIMER.md / DISCLAIMER.es.md (drafts for attorney review) */
function ownRisk(model, o) {
  const t = T(model, o);
  if (!has(model, 'ui.plan.own_risk')) return '';
  const url = disclaimerUrl(model, o);
  return '> **' + t('ui.plan.own_risk_label') + '** ' + t('ui.plan.own_risk') + (url ? ' [' + t('ui.plan.own_risk_link') + '](' + url + ')' : '');
}
function ownRiskShort(model, o) {
  if (!has(model, 'ui.plan.own_risk_short')) return '';
  const url = disclaimerUrl(model, o);
  return '_' + T(model, o)('ui.plan.own_risk_short') + '_' + (url ? ' [' + T(model, o)('ui.plan.own_risk_link') + '](' + url + ')' : '');
}
function disclaimerUrl(model, o) {
  const L = model.rules.legal;
  return L && L.disclaimer_url ? (L.disclaimer_url[o.lang] || L.disclaimer_url.en) : null;
}

// ------------------------------------------------------------------------------------------------------------- full view

function fullView(plan, model, o) {
  const t = T(model, o), m = plan.meta || {};
  const L = [];
  L.push('# ' + t(m.program_name_key || 'ui.plan.title'));
  L.push('_' + t('ui.plan.title') + '_', '');
  const risk = ownRisk(model, o);
  if (risk) L.push(risk, '');
  L.push(...headerLines(plan, model, o), '');
  L.push(...noticesSection(plan, model, o));
  L.push(...instructionBlock(plan, model, o), '');
  L.push(...adjustGuide(plan, model, o));
  L.push(...stairwaySection(plan, model, o), '');
  L.push(...weeklySetsSection(plan, model, o), '');
  const first = weekNumbers(plan, o)[0];
  if (first) L.push(...weekGlance(plan, first, model, o), '');
  for (const tb of plan.shape.training_blocks || []) L.push(blockView(plan, tb.n, model, o), '');
  for (const n of weekNumbers(plan, o)) L.push(weekSection(plan, n, model, o), '');
  L.push(...summarySection(plan, model, o));
  return L.join('\n');
}

/**
 * B3 macro view for screenshots (R2-GEN-02 'macro view'): the legal line, header, notices and schedule, the stairway table, the
 * weekly sets per muscle group, the first week at a glance and its day tables (exercise | sets x reps | effort).
 */
function overviewView(plan, model, o) {
  const t = T(model, o), m = plan.meta || {};
  const L = ['# ' + t(m.program_name_key || 'ui.plan.title'), '_' + t('ui.plan.at_a_glance') + '_', ''];
  const risk = ownRisk(model, o);
  if (risk) L.push(risk, '');
  L.push(...headerLines(plan, model, o), '');
  L.push(...noticesSection(plan, model, o));
  L.push(...adjustGuide(plan, model, o));
  L.push(...stairwaySection(plan, model, o), '');
  L.push(...weeklySetsSection(plan, model, o), '');
  for (const n of weekNumbers(plan, o).slice(0, 1)) {
    L.push(...weekGlance(plan, n, model, o), '');
    for (const d of dayList(plan, n)) { const tbl = dayTable(plan, n, d, model, o); if (tbl.length) L.push(...tbl, ''); }
  }
  L.push('---', '', '_' + t('ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version }) + '_');
  return L.join('\n');
}

function headerLines(plan, model, o) {
  const t = T(model, o), m = plan.meta || {}, L = [];
  const b = (label, value) => L.push('- **' + label + (/[?:¿]$/.test(label) ? '' : ':') + '** ' + value);
  if (m.goal) b(t('intake.goal.label'), t('goal.' + m.goal));
  if (m.profile) {
    // a non-competitive client never reads a competitive profile name (review 06 minor 13 / 07 minor 22, GEN-02)
    const recKey = m.profile.name_key ? m.profile.name_key + '_recreational' : null;
    let p = t(m.profile.competitive !== 'competitive' && recKey && model.has('en', recKey) ? recKey : m.profile.name_key);
    const acts = (m.profile.activity_ids || []).slice(1).map(a => t('activity.' + a + '.name'));
    if (acts.length) p += DOT + acts.join(', ');
    if (m.season && m.season.phase) p += DOT + t('season.' + m.season.phase);
    if (m.profile.competitive === 'competitive') b(t('intake.sport.label'), p);
    else if ((m.profile.activity_ids || []).length) b(t('intake.activity.label'), p);
    // F3 (RECHECK 06 minor: '- Muscle & physique' with no label): the profile line has its label
    else if (has(model, 'ui.plan.profile_label')) b(t('ui.plan.profile_label'), p);
    else L.push('- ' + p);
  }
  // F3 (RECHECK 07 major: the plan never named the client's Focus muscles): 'Focus muscles: Chest, Back (+2 sets a week ...)'
  const fm = focusMusclesLine(plan, model, o);
  if (fm) b(t('intake.focus.label').replace(/\s*\([^)]*\)\s*$/, ''), fm);
  b(t('ui.plan.level'), esc(levelText(plan, model, o.lang)));
  if (m.plan_mode) b(t('intake.plan_mode.label'), t('intake.plan_mode.opt.' + m.plan_mode) + DOT + t('ui.plan.week', { n: '1-' + (plan.shape.weeks_total || m.weeks) }));
  if (m.start_date) b(t('intake.start.label'), esc(fmtDate(model, o.lang, m.start_date)));
  if (m.weekdays) b(t('intake.days.label'), m.days_per_week + DOT + m.weekdays.map(d => esc(weekdayIn(model, o.lang, d))).join(', ') + DOT + t('intake.minutes.label') + ': ' + m.session_minutes);
  if (plan.release_stamp) {
    // the version id (release.client | coach | minor) is itself the key of the full legal text: show its short label
    const rl = plan.release_stamp.lang, langKey = 'intake.lang.opt.' + rl;
    const who = String(plan.release_stamp.version || '').replace(/^release\./, '');
    const langName = model.has('en', langKey) ? model.t(o.lang, langKey) : rl;
    // F3 (COACH-R3 R3-GEN-01 'use at your own risk' + terms + release in one tick; RECHECK 01 / 03 / 05 / 08 minors: 'Release accepted
    // (Liability release (client), English)' named only the release, with nested brackets): one flat line for the one box
    if (has(model, 'ui.plan.release_stamp_flat') && has(model, 'release.who.' + who)) {
      L.push('- ' + esc(model.t(o.lang, 'ui.plan.release_stamp_flat', { who: model.t(o.lang, 'release.who.' + who), lang: o.lang === 'es' ? langName.toLowerCase() : langName })));
    } else {
      const shortKey = 'release.short.' + who;
      const version = model.has('en', shortKey) ? model.t(o.lang, shortKey) : model.t(o.lang, 'release.label');
      L.push('- ' + esc(model.t(o.lang, 'ui.plan.release_stamp', { version, lang: langName })));
    }
  }
  if (m.health && m.health.bypass) L.push('- ' + t('ui.plan.coach_bypass_stamp'));
  else if (m.health && has(model, 'ui.plan.health_check_ok')) {
    // F3 (COACH-R3 R3-GEN-01: our short health check with a link to the official PAR-Q+; RECHECK 08 minor: nothing said the health
    // check was answered): the health check line with the PAR-Q+ link
    const pq = model.rules.legal && model.rules.legal.parq_url;
    L.push('- ' + t('ui.plan.health_check_ok') + (pq && has(model, 'ui.plan.parq_link') ? ' [' + t('ui.plan.parq_link') + '](' + pq + ')' : ''));
  }
  return L;
}

/** the client's own Focus picks (meta.derived.priority_choices, at most 2), else the plan's priority list */
function focusChoices(plan) {
  const m = plan.meta || {};
  const ch = m.derived && Array.isArray(m.derived.priority_choices) ? m.derived.priority_choices.filter(Boolean) : [];
  if (ch.length) return ch.slice(0, 2);
  return (m.derived && m.derived.priority_muscles) || (m.targets && m.targets.priority) || [];
}

/** the client's Focus muscles and the extra sets they get (COACH-R3 R3-SES-01 'Focus muscle 1 and 2'; RECHECK 07 major) */
function focusMusclesLine(plan, model, o) {
  const m = plan.meta || {};
  // fix round 2 / F3 (COACH-R3 R3-SES-01 'Focus muscle 1 and Focus muscle 2', max 2; RECHECK v0.4 06 major: 'Glutes, Side delts, Rear delts' -
  // the steering list the intake expands a pick into - printed as three Focus muscles): the client's own picks
  const pr = focusChoices(plan);
  if (!pr.length || !has(model, 'ui.plan.focus_add')) return '';
  const names = [];
  for (const mu of pr) {
    const k = model.has('en', 'muscle.' + mu) ? 'muscle.' + mu : model.has('en', 'group.' + mu) ? 'group.' + mu : null;
    if (k && !names.includes(k)) names.push(k);
  }
  if (!names.length) return '';
  const add = m.targets && typeof m.targets.focus_add === 'number' ? m.targets.focus_add : null;
  const list = names.map(k => model.t(o.lang, k)).join(', ');
  return esc(add ? list + ' ' + model.t(o.lang, 'ui.plan.focus_add', { n: add }) : list);
}

/**
 * v1.2 (review 07 major 3 / 04 / 08): what the client must know before week 1 - the plan's warnings and the schedule offers -
 * comes right after the header, not after week 12. B3: the time check is its own 'Your schedule' section (trained directly / not
 * trained directly because of time / through compound lifts, then the offers in numbers; COACH-R3 R3-SES-02).
 */
function noticesSection(plan, model, o) {
  const t = T(model, o);
  const warnings = (plan.meta && plan.meta.warnings) || [];
  const offers = plan.offers || [];
  const tc = plan.time_check || null;
  const sched = tc && has(model, 'ui.plan.schedule') ? scheduleLines(plan, tc, model, o) : [];
  const shown = warnings.filter(w => !(sched.length && SCHEDULE_WARNINGS.includes(w.key)));
  const hol = holidayWeeks(plan);
  // F3 (RECHECK 08 minor: 'Lots of play this week' printed on every jump of every week): said once, up front
  const heavyPlay = has(model, 'ui.plan.heavy_play_plan') && planHasNote(plan, 'note.heavy_play_week');
  if (!shown.length && !offers.length && !sched.length && !hol.length && !heavyPlay && !daysOverLine(plan, model, o)) return [];
  const L = [];
  if (shown.length || hol.length || heavyPlay || daysOverLine(plan, model, o)) {
    L.push('## ' + t('ui.plan.before_you_start'), '');
    // fix round 2 / F3 (COACH-R3 R3-SES-02 step 1 'tell the user up front'; RECHECK v0.4 02 / 05 / 08 minors: 'some weeks still run a few
    // minutes over' for a Monday that runs over in all 12 weeks; four over-time days never named): every day over the limit, by weekday
    const overLine = daysOverLine(plan, model, o);
    for (const w of shown) {
      L.push('- ' + t(warningKey(plan, w, model, !!overLine), warningArgs(w, model, o)));
      if (w.key === 'warning.supersets_needed' && overLine) L.push('- ' + overLine);
    }
    if (overLine && !shown.some(w => w.key === 'warning.supersets_needed')) L.push('- ' + overLine);
    // (RECHECK v0.4 06 / 08 minors: '(or a test day)' in a plan with no tests)
    const testInHol = ((plan.meta && plan.meta.tests && plan.meta.tests.test_days) || []).some(x => hol.includes(x.week)) || (plan.weeks || []).some(w => hol.includes(w.n) && w.test);
    if (hol.length && has(model, 'ui.plan.holiday_weeks')) L.push('- ' + t(!testInHol && has(model, 'ui.plan.holiday_weeks_no_test') ? 'ui.plan.holiday_weeks_no_test' : 'ui.plan.holiday_weeks', { weeks: hol.join(', ') }));
    if (heavyPlay) L.push('- ' + t('ui.plan.heavy_play_plan'));
    L.push('');
  }
  if (sched.length || offers.length) {
    L.push('## ' + t(sched.length ? 'ui.plan.schedule' : 'ui.plan.before_you_start'), '');
    L.push(...sched);
    if (offers.length) {
      L.push('', '**' + t('ui.plan.offers') + '**');
      for (const of of offers) L.push('- ' + t(of.key, of.args || {}) + (of.chosen ? ' ' + t('ui.plan.offer_chosen') : ''));
    }
    L.push('');
  }
  return L;
}

/**
 * 'Days over your 60 min even with the marked supersets: Monday in weeks 9-12 (62-66 min); Friday in every week (63-71 min)' - every
 * main / optional day whose minutes pass its limit, test days with their own warning line left out (fix round 2 / F3)
 */
function daysOverLine(plan, model, o) {
  if (!has(model, 'ui.plan.days_over') || plan.status !== 'ok') return '';
  const t = T(model, o);
  const tested = new Set(((plan.meta && plan.meta.warnings) || []).filter(w => w.key === 'warning.test_day_long' && w.args).map(w => w.args.week + ':' + w.args.day));
  const by = new Map();
  let limit = null, total = 0;
  for (const w of plan.weeks || []) for (const d of w.days || []) {
    if (!['main', 'optional'].includes(d.kind) || typeof d.est_minutes !== 'number' || typeof d.minutes_limit !== 'number') continue;
    if (d.kind === 'main') total++;
    if (d.est_minutes <= d.minutes_limit || tested.has(w.n + ':' + d.weekday)) continue;
    if (!by.has(d.weekday)) by.set(d.weekday, { weeks: [], lo: d.est_minutes, hi: d.est_minutes, limit: d.minutes_limit });
    const r = by.get(d.weekday);
    r.weeks.push(w.n); r.lo = Math.min(r.lo, d.est_minutes); r.hi = Math.max(r.hi, d.est_minutes);
    limit = limit === null ? d.minutes_limit : limit;
  }
  if (!by.size) return '';
  const nWeeks = (plan.weeks || []).length;
  const parts = WEEKDAYS.filter(wd => by.has(wd)).map(wd => {
    const r = by.get(wd);
    const mins = r.lo === r.hi ? String(r.lo) : r.lo + '-' + r.hi;
    const all = r.weeks.length === (plan.weeks || []).filter(w => (w.days || []).some(d => d.weekday === wd && ['main', 'optional'].includes(d.kind))).length && nWeeks > 1;
    const key = all && has(model, 'ui.plan.days_over_item_all') ? 'ui.plan.days_over_item_all' : r.weeks.length === 1 && has(model, 'ui.plan.days_over_item_one') ? 'ui.plan.days_over_item_one' : 'ui.plan.days_over_item';
    return model.t(o.lang, key, { day: weekdayIn(model, o.lang, wd), weeks: weekRuns(r.weeks), min: mins });
  });
  const sameLimit = [...by.values()].every(r => r.limit === limit);
  return esc(model.t(o.lang, sameLimit ? 'ui.plan.days_over' : 'ui.plan.days_over_mixed', { min: limit, list: parts.join('; ') }));
}

/** the plan weeks that hold Christmas (Dec 24-26) or New Year (Dec 31 - Jan 1), from the start date (R2-PER-02, R3-PER-01; RECHECK
 *  01 / 07 minors: the hardest weeks and the max tests landed on the holidays with no notice) */
function holidayWeeks(plan) {
  const start = plan.meta && plan.meta.start_date;
  if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return [];
  const out = [];
  for (const w of plan.weeks || []) {
    if (!(w.days || []).some(d => ['main', 'optional'].includes(d.kind))) continue;
    for (let i = 0; i < 7; i++) {
      const md = addDays(start, (w.n - 1) * 7 + i).slice(5);
      if (['12-24', '12-25', '12-26', '12-31', '01-01'].includes(md)) { out.push(w.n); break; }
    }
  }
  return out;
}

/** the time check in the client's words: per training block when blocks differ (R3-SES-02) */
function scheduleLines(plan, tc, model, o) {
  const t = T(model, o), m = plan.meta || {};
  const L = [];
  const blocks = Array.isArray(tc.by_block) && tc.by_block.length ? tc.by_block : [tc];
  const sameAll = blocks.every(b => JSON.stringify([b.trained_groups, b.not_trained_directly, b.trained_below_floor]) === JSON.stringify([blocks[0].trained_groups, blocks[0].not_trained_directly, blocks[0].trained_below_floor]));
  const list = sameAll ? [blocks[0]] : blocks;
  const grp = (gs) => gs.map(g => 'group.' + g);
  for (const b of list) {
    const tb = (plan.shape.training_blocks || []).find(x => x.n === b.training_block);
    if (!sameAll && tb) L.push('**' + t('ui.plan.schedule_block', { block: tb.label_key, from: tb.weeks[0], to: tb.weeks[1] }) + '**');
    const nt = b.not_trained_directly || [];
    const bw = (plan.weeks || []).filter(w => w.training_block === b.training_block);
    // F3 (COACH-R3 R3-SES-01 'calves one exercise x 3 sets per leg day'; RECHECK 05 / 07 / 08 minors: 'Calves' in the '10+ sets a
    // week, climbing' list at 7-9 flat sets): a trained group under the floor of 10 in some stairway week (calves) gets its own line;
    // 'climbing every week' only when every listed group gains sets every week (COACH-R3 R3-VOL-04; RECHECK 01 / 04 / 07 / 08)
    const F0 = model.rules.volume.floor;
    const floorN = typeof F0 === 'number' ? F0 : (F0 && typeof F0.value === 'number' ? F0.value : 10);
    const stairW = bw.filter(w => w.block_type === 'stairway');
    const underFloor = (g) => stairW.some(w => ((w.weekly_sets_by_group || {})[g] || 0) < floorN - 1e-9);
    // (a group held below the floor has its own line: never in the '10+ sets' list too - RECHECK 05 minor)
    const below = new Set((b.trained_below_floor || []).map(x => x.group || x));
    const trained = (b.trained_groups || []).filter(g => !below.has(g) && !(g === 'calves' && has(model, 'ui.plan.calves_line') && underFloor(g)));
    const calvesOwn = (b.trained_groups || []).includes('calves') && !trained.includes('calves');
    if (b.fits && !nt.length && !calvesOwn) { L.push('- ' + t(climbsEveryWeek(stairW, b.trained_groups || []) || !has(model, 'ui.plan.schedule_fits_block') ? 'ui.plan.schedule_fits' : 'ui.plan.schedule_fits_block', { days: m.days_per_week, minutes: m.session_minutes })); continue; }
    // (a timed circuit climbs in work seconds, not sets: RECHECK 05 minor)
    const circuitPlan = stairW.some(w => w.circuit && typeof w.circuit.work_s === 'number') && has(model, 'ui.plan.trained_directly_circuit');
    if (trained.length) L.push('- ' + t(circuitPlan ? 'ui.plan.trained_directly_circuit' : climbsEveryWeek(stairW, trained) || !has(model, 'ui.plan.trained_directly_block') ? 'ui.plan.trained_directly' : 'ui.plan.trained_directly_block', { groups: grp(trained) }));
    if (calvesOwn) {
      const cs = stairW.map(w => (w.weekly_sets_by_group || {}).calves || 0);
      const c0 = cs.length ? cs[0] : 0, c1 = cs.length ? cs[cs.length - 1] : 0;
      L.push('- ' + (Math.abs(c1 - c0) < 1e-9 && has(model, 'ui.plan.calves_line_flat') ? t('ui.plan.calves_line_flat', { n: fmtNum(c0) }) : t('ui.plan.calves_line', { from: fmtNum(c0), to: fmtNum(c1) })));
    }
    const by = (r) => nt.filter(x => x.reason === r).map(x => x.group);
    // fix round 2 / F3 (COACH-R3 R3-SES-02 'tell the user up front'; RECHECK v0.4 01 major / 04 / 08 minors: 'they still get work from your
    // compound lifts' for a chest whose only work is one kept press; five 'not trained' categories; 'no exercise for them' next to a
    // credited row): three lines - a group that keeps one exercise is named with it and its day; the groups that work only inside other
    // lifts share one line; a group with no work at all is 'not trained in this plan'
    if (has(model, 'ui.plan.kept_exercise') && has(model, 'ui.plan.not_trained_credit_all')) {
      const first = stairW[0] || bw[0] || null;
      const keptOf = (g) => {
        const out = [];
        for (const d of (first ? first.days || [] : []).slice().sort((a, b2) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b2.weekday))) for (const blk of d.blocks || []) for (const it of blk.items || []) {
          if (it.group === g && it.exercise_id && it.role !== 'test' && typeof it.sets === 'number' && it.sets > 0 && !['warmup', 'cooldown', 'prehab', 'core', 'aerobic'].includes(blk.kind) && !aerobicOf(it)) out.push({ it, d });
        }
        return out;
      };
      const someWork0 = (g) => !bw.length || bw.some(w => ((w.weekly_sets_by_group || {})[g] || 0) > 0);
      const kept = [], credit = [], none = [];
      for (const x of nt) {
        if (x.reason === 'class_lift') continue;
        const k = keptOf(x.group);
        if (k.length) kept.push({ g: x.group, k });
        else if (someWork0(x.group)) credit.push(x.group);
        else none.push(x.group);
      }
      for (const x of kept) {
        const names = x.k.map(y => model.t(o.lang, 'ui.plan.kept_exercise_item', { exercise: exName(model, o, y.it), day: weekdayIn(model, o.lang, y.d.weekday), n: y.it.sets }));
        L.push('- ' + esc(model.t(o.lang, 'ui.plan.kept_exercise', { group: model.t(o.lang, 'group.' + x.g), list: names.join('; ') })));
      }
      if (credit.length) L.push('- ' + t('ui.plan.not_trained_credit_all', { groups: grp(credit) }));
      if (none.length) L.push('- ' + t('ui.plan.not_trained_time_none', { groups: grp(none) }));
      if (by('class_lift').length) L.push('- ' + t(has(model, 'ui.plan.not_trained_class_lift') ? 'ui.plan.not_trained_class_lift' : 'ui.plan.not_trained_time', { groups: grp(by('class_lift')) }));
      if ((b.trained_below_floor || []).length) {
        // (RECHECK v0.4 04 / 05 minors: '(the main lift stays and climbs)' for a class lift held at 3 sets and for a circuit station)
        const bg = b.trained_below_floor.map(x => x.group);
        const rises = (g) => { const v = stairW.map(w => (w.weekly_sets_by_group || {})[g] || 0); return v.length > 1 && v[v.length - 1] > v[0] + 1e-9; };
        const KWL0 = model.rules.session.time_fit && model.rules.session.time_fit.keep_work_lift;
        const classPlan = !!(KWL0 && (KWL0.families || []).includes(m.family));
        const key = circuitPlan && has(model, 'ui.plan.below_floor_circuit') ? 'ui.plan.below_floor_circuit' : classPlan && has(model, 'ui.plan.below_floor_class') ? 'ui.plan.below_floor_class'
          : !bg.every(rises) && has(model, 'ui.plan.below_floor_hold') ? 'ui.plan.below_floor_hold' : 'ui.plan.below_floor';
        L.push('- ' + t(key, { groups: grp(bg) }));
      }
      continue;
    }
    // v0.4 B4 (sample 08: 'they still get work from your compound lifts' for back, chest and shoulders with no row or press left in
    // the plan): a group the block gives no credited set at all is named as not trained in this plan
    const someWork = (g) => !bw.length || bw.some(w => ((w.weekly_sets_by_group || {})[g] || 0) > 0);
    const timeAll = by('time'), timeNone = has(model, 'ui.plan.not_trained_time_none') ? timeAll.filter(g => !someWork(g)) : [];
    const timeSome = timeAll.filter(g => !timeNone.includes(g));
    if (timeSome.length) L.push('- ' + t('ui.plan.not_trained_time', { groups: grp(timeSome) }));
    if (timeNone.length) L.push('- ' + t('ui.plan.not_trained_time_none', { groups: grp(timeNone) }));
    // v0.4 B4 (E-64): class-model groups not trained directly that keep the day's class lift
    if (by('class_lift').length) L.push('- ' + t(has(model, 'ui.plan.not_trained_class_lift') ? 'ui.plan.not_trained_class_lift' : 'ui.plan.not_trained_time', { groups: grp(by('class_lift')) }));
    if ((b.trained_below_floor || []).length) L.push('- ' + t('ui.plan.below_floor', { groups: grp(b.trained_below_floor.map(x => x.group)) }));
    if (by('credit_only').length) L.push('- ' + t('ui.plan.not_trained_credit', { groups: grp(by('credit_only')) }));
    if (by('no_station').length) L.push('- ' + t('ui.plan.not_trained_station', { groups: grp(by('no_station')) }));
  }
  const tw = ((plan.meta && plan.meta.warnings) || []).find(w => w.key === 'warning.time_check');
  if (tw) L.unshift('- ' + t(tw.key, warningArgs(tw, model, o)));
  const lp = ((plan.meta && plan.meta.warnings) || []).find(w => w.key === 'warning.time_lower_peak');
  if (lp) L.push('- ' + t(warningKey(plan, lp, model), warningArgs(lp, model, o)));
  return L;
}

/** every group gains sets in every week of the stairway (after week 1), ignoring the end-test week (F3: 'climbs every week' only
 *  when it is true; COACH-R3 R3-VOL-04 / R3-SES-02 step 4; RECHECK 01 / 04 / 07 / 08) */
function climbsEveryWeek(stairWeeks, groups) {
  if (!stairWeeks.length || !groups.length) return false;
  for (const g of groups) {
    for (let i = 1; i < stairWeeks.length; i++) {
      const a = (stairWeeks[i - 1].weekly_sets_by_group || {})[g] || 0, b = (stairWeeks[i].weekly_sets_by_group || {})[g] || 0;
      if (b <= a + 1e-9) return false;
    }
  }
  return true;
}

/** the groups a warning names (args.group / groups: 'group.x' keys, ids or a comma list) */
function warnGroups(w) {
  const a = (w && w.args) || {};
  const raw = a.group != null ? a.group : a.groups;
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : [];
  return list.map(x => String(x).trim().replace(/^group\./, '')).filter(Boolean);
}

/** a warning's key as printed: 'they still climb every week' becomes 'through the block' unless every named group climbs every week;
 *  'the marked supersets ... to finish on time' only when the days fit with them; a test day that holds only speed / jump tests says
 *  'the tests', not 'work-up to your top sets' (F3; RECHECK 01 / 02 / 03 / 06 minors) */
function warningKey(plan, w, model, overListed = false) {
  // fix round 2 / F3 (RECHECK v0.4 08 minor: 'your sport's weekly medball throws' for a recreational player): a non-competitive profile
  // reads 'this plan's weekly ...'
  if (/^warning\.athletic_capacity(_block)?$/.test(w.key) && plan.meta && plan.meta.profile && plan.meta.profile.competitive !== 'competitive' && has(model, w.key + '_activity')) return w.key + '_activity';
  if (w.key === 'warning.supersets_needed' && overListed && has(model, 'warning.supersets_needed_save')) return 'warning.supersets_needed_save';
  if (w.key === 'warning.time_lower_peak' && has(model, 'warning.time_lower_peak_block')) {
    const st = (plan.weeks || []).filter(x => x.block_type === 'stairway');
    const gs = warnGroups(w);
    if (!gs.length || !climbsEveryWeek(st, gs)) return 'warning.time_lower_peak_block';
  }
  if (w.key === 'warning.supersets_needed' && has(model, 'warning.supersets_needed_over')) {
    const days = [].concat((w.args && w.args.day) || []);
    const over = (plan.weeks || []).some(wk => !wk.test && (wk.days || []).some(d => days.includes(d.weekday) && typeof d.est_minutes === 'number' && typeof d.minutes_limit === 'number' && d.est_minutes > d.minutes_limit));
    if (over) return 'warning.supersets_needed_over';
  }
  if (w.key === 'warning.test_day_long' && has(model, 'warning.test_day_long_tests') && w.args) {
    const wk = (plan.weeks || []).find(x => x.n === w.args.week);
    const d = wk && (wk.days || []).find(x => x.weekday === w.args.day);
    const strengthTest = !!d && (d.blocks || []).some(b => (b.items || []).some(it => it.role === 'test' && it.bucket !== 'TEST'));
    if (d && !strengthTest) return 'warning.test_day_long_tests';
  }
  return w.key;
}

/** does any item of the plan carry this note key */
function planHasNote(plan, key) {
  return (plan.weeks || []).some(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => (it.notes || []).some(n => n && n.key === key)))));
}

/** warning args shown to people: equipment tokens by their names (review 05 minor 18) */
function warningArgs(w, model, o) {
  const a = { ...(w.args || {}) };
  if (typeof a.items === 'string') a.items = a.items.split(',').map(x => x.trim()).filter(Boolean).map(tok => (model.has('en', 'equipment.token.' + tok) ? model.t(o.lang, 'equipment.token.' + tok) : tok)).join(', ');
  return a;
}

/** the weeks of the plan whose items carry an intensifier (MYO / MAX), so the copy says only what the plan does */
function intensifierWeeks(plan) {
  return (plan.weeks || []).filter(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => it.effort && it.effort.last_set)))).map(w => w.n);
}

/** v1.2 (review 04 / 06 / 08 minors): the planned effort drift, so the basic instruction ('leave 1 in the tank') and the
 * week-by-week effort (3 -> 2 -> 1) never read as a contradiction; B3: the intensifier line only for the weeks that carry one */
function effortDriftLine(plan, model, o) {
  const t = T(model, o);
  const ws = (plan.weeks || []).filter(w => w.block_type === 'stairway' && w.planned_rir);
  if (!ws.length) return '';
  const runs = [];
  for (const w of ws) {
    const rir = w.planned_rir.min === w.planned_rir.max ? String(w.planned_rir.min) : w.planned_rir.min + '-' + w.planned_rir.max;
    const last = runs[runs.length - 1];
    if (last && last.rir === rir && last.to === w.n - 1) last.to = w.n; else runs.push({ rir, from: w.n, to: w.n });
  }
  const items = runs.map(r => t(r.from === r.to ? 'effort.drift_item_one' : 'effort.drift_item', { from: r.from, to: r.to, rir: r.rir }));
  let s = t('effort.drift', { list: items.join('; ') });
  const iw = intensifierWeeks(plan);
  // F3 (RECHECK 04 / 05 / 06 / 08 minors: 'one intensifier per training day' while some days had none): the line names the days that
  // carry one, and says what it is (a MYO set; a held last rep in a circuit)
  const days = intensifierDays(plan, iw[iw.length - 1]);
  if (iw.length && days.length && has(model, 'effort.drift_intensifier_days')) s += ' ' + t(days.circuit ? 'effort.drift_intensifier_days_circuit' : 'effort.drift_intensifier_days', { week: iw.join(', '), days: days.slice() });
  else if (iw.length && has(model, 'effort.drift_intensifier')) s += ' ' + t('effort.drift_intensifier', { week: iw.join(', ') });
  return s;
}

/** the weekdays of week n whose items carry an intensifier (array with .circuit = true when they are circuit stations) */
function intensifierDays(plan, n) {
  const w = weekOf(plan, n);
  const out = [];
  let circuit = false;
  if (!w) return out;
  for (const d of (w.days || []).slice().sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday))) {
    const its = (d.blocks || []).flatMap(b => b.items || []).filter(it => it.effort && it.effort.last_set);
    if (its.length) { out.push(d.weekday); if (its.some(it => it.effort.circuit)) circuit = true; }
  }
  out.circuit = circuit;
  return out;
}

/** the first and last planned effort of the stairway ('3' / '1') for the bridge under the coach's instruction */
function driftEnds(plan) {
  const ws = (plan.weeks || []).filter(w => w.block_type === 'stairway' && w.planned_rir);
  if (!ws.length) return null;
  const f = (w) => (w.planned_rir.min === w.planned_rir.max ? String(w.planned_rir.min) : w.planned_rir.min + '-' + w.planned_rir.max);
  return { start: f(ws[0]), end: f(ws[ws.length - 1]) };
}

function instructionBlock(plan, model, o) {
  const t = T(model, o), m = plan.meta || {};
  let keys = (m.instruction_keys && m.instruction_keys.length ? m.instruction_keys : ['instruction.title', ...INSTRUCTION_KEYS]);
  // fix round 2 / F3 (OBSERVED 'EXAMPLE CROSSFIT SPLIT' A4:A7 Basic Instruction; RECHECK v0.4 04 minor: the BYOP lines printed for the class
  // model): a family with its own instruction lines (rules.render.instruction_keys_by_family) prints those
  const IKF = model.rules.render && model.rules.render.instruction_keys_by_family;
  const famKeys = IKF && Array.isArray(IKF[m.family]) && IKF[m.family].every(k => has(model, k)) ? IKF[m.family] : null;
  if (famKeys) keys = [keys[0], ...famKeys];
  // B3 (RECHECK 01 minor: 'I recommend doing it on your aerobic days' with no aerobic session in the plan): the sport is the cardio
  const aerobicItems = (plan.weeks || []).some(w => (w.aerobic_sessions || 0) > 0);
  if (!aerobicItems && has(model, 'instruction.2_sport_cardio')) keys = keys.map(k => (k === 'instruction.2' ? 'instruction.2_sport_cardio' : k));
  const L = ['## ' + t(keys[0])];
  keys.slice(1).forEach((k, i) => { if (i) L.push('>'); L.push('> ' + t(k)); });
  // F3 (COACH-R3 R3-VOL-04 '3 reps in the tank early ... to 1 + intensifiers in the last week'; RECHECK 01 / 02 / 03 / 05 / 06 / 07 / 08
  // minors: the coach's verbatim 'Always leave 1 rep in the tank' sat above weeks of 3 in the tank with no bridge): his words stay,
  // one line under them says where the plan starts and ends
  const ends = driftEnds(plan);
  if (!famKeys && ends && ends.start !== ends.end && has(model, 'instruction.1_bridge')) L.push('', '_' + t('instruction.1_bridge', ends) + '_');
  // (RECHECK v0.4 07 minor: 'do it on your aerobic days' in a 6-day week whose cardio sessions all sit on lifting days)
  const aerobicOnly = (plan.weeks || []).some(w => (w.days || []).some(d => d.kind === 'aerobic'));
  if (!famKeys && aerobicItems && !aerobicOnly && has(model, 'instruction.2_bridge')) L.push('', '_' + t('instruction.2_bridge') + '_');
  const drift = effortDriftLine(plan, model, o);
  if (drift) L.push('', drift);
  // F3 (RECHECK 04 / 05 minors: 'in the last week 1 with a few extra-hard sets' in a plan whose last week carries none)
  // (fix round 2 / F3: the week-1 tip names the plan's own first effort - RECHECK v0.4 05 / 08 minors '2-3 more times' next to '3 in the tank')
  L.push('', t(intensifierWeeks(plan).length || !has(model, 'effort.how_hard_no_int') ? 'effort.how_hard' : 'effort.how_hard_no_int', { rir: ends ? ends.start : 3 }));
  const hasOlympic = (plan.weeks || []).some(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => it.bucket === 'AP_TRIPLE_EXT'))));
  if (hasOlympic) L.push('', t('effort.olympic'));
  // F3 (R2-SES-03 'core supersets optional anywhere'; RECHECK 07 minor: printed once, on one plank): said once for the whole plan
  if (has(model, 'ui.plan.core_supersets_line') && planHasNote(plan, 'note.core_supersets_optional')) L.push('', t('ui.plan.core_supersets_line'));
  const older = m.derived && typeof m.derived.age === 'number' && m.derived.age >= model.rules.population.older.from_age;
  if (older) L.push('', '> ⚠ ' + t(model.rules.population.older.warning_key));
  return L;
}

/**
 * F3 (COACH-R3 R3-VOL-02 / R3-VOL-04 'the program will tell you to adjust accordingly'; BRAIN §5.4c / §5.7; RECHECK 03 / 06 majors: no
 * check-ins and no guide): 'How to adjust this plan' - a missed week, a set at a true max, everything easy, pain (swap -> cut -> drop),
 * life in the way, and what the person can change (blocks off, exercises in / out, rear delts, supersets). Wording PROPOSED.
 */
function adjustGuide(plan, model, o) {
  const t = T(model, o);
  const keys = ['guide.adjust.missed', 'guide.adjust.max', 'guide.adjust.easy', 'guide.adjust.pain', 'guide.adjust.life'];
  if (!has(model, 'guide.adjust.title') || plan.status !== 'ok') return [];
  const L = ['## ' + t('guide.adjust.title'), '', ...keys.filter(k => has(model, k)).map(k => '- ' + t(k))];
  // fix round 2 / F3 (COACH-R3 R3-SES-02 'rendering tells the reader what they can switch off'; RECHECK v0.4 02 / 06 / 07 / 08 minors: 'switch
  // off a day's jumps, core or joint care' in plans with no jumps and no joint care): the sentence names the blocks this plan's days
  // can switch off; what the accessories block carries; the circuit stations; the swimmer's pool lines
  const kinds = planToggleKinds(plan);
  if (has(model, 'guide.adjust.edit_blocks')) {
    const names = kinds.map(k => (has(model, 'block.short.' + k) ? model.t(o.lang, 'block.short.' + k) : model.t(o.lang, 'block.' + k)));
    const sup = o.show_supersets && (plan.weeks || []).some(w => (w.days || []).some(d => (d.superset_recommendations || []).length || d.supersets_needed || d.supersets_on));
    const tail = has(model, 'guide.adjust.edit_supersets') && sup ? ' ' + t('guide.adjust.edit_supersets') : '';
    // (a block name with a comma inside - 'jumps, throws and speed' - keeps the list readable with semicolons)
    const blocks = names.some(x => x.includes(',')) ? names.join('; ') : andList(model, o.lang, names);
    L.push('- ' + (names.length ? esc(model.t(o.lang, 'guide.adjust.edit_blocks', { blocks })) : t('guide.adjust.edit_none')) + tail);
    const acc = kinds.includes('accessories') ? accessoryOnlyGroups(plan, model) : [];
    if (acc.length && has(model, 'guide.adjust.accessories')) L.push('- ' + esc(model.t(o.lang, 'guide.adjust.accessories', { groups: andList(model, o.lang, acc.map(g => model.t(o.lang, 'group.' + g))) })));
    if ((plan.weeks || []).some(w => (w.days || []).some(d => (d.toggle_items || []).length)) && has(model, 'guide.adjust.edit_stations')) L.push('- ' + t('guide.adjust.edit_stations'));
  } else if (has(model, 'guide.adjust.edit')) L.push('- ' + t('guide.adjust.edit'));
  // (COACH-R3 R3-ATH-01 'a 2-week dryland taper lined up with the swim coach's taper'; BRAIN 9.11; RECHECK v0.4 01 minor)
  const prof = plan.meta && plan.meta.profile;
  let aquatic = false;
  try { aquatic = !!(prof && prof.id && model.hasSport && model.hasSport(prof.id) && model.sport(prof.id).family === 'aquatic' && prof.competitive === 'competitive'); } catch { aquatic = false; }
  if (aquatic && has(model, 'guide.adjust.swim')) L.push('- ' + t('guide.adjust.swim'));
  L.push('');
  return L;
}

/** the block kinds this plan's days can switch off, in reading order (day.toggle_blocks with items) */
function planToggleKinds(plan) {
  const seen = new Set();
  for (const w of plan.weeks || []) for (const d of w.days || []) {
    for (const k of d.toggle_blocks || []) if (SWITCH_KINDS.includes(k) && ((d.blocks || []).some(b => b.kind === k && (b.items || []).length) || (k === 'aerobic' && d.kind === 'aerobic'))) seen.add(k);
  }
  return SWITCH_KINDS.filter(k => seen.has(k));
}

/** the FOCUS groups whose direct sets all sit in accessories blocks (the first stairway week): switching the block off takes them */
function accessoryOnlyGroups(plan, model) {
  const w = (plan.weeks || []).find(x => x.block_type === 'stairway') || (plan.weeks || [])[0];
  if (!w) return [];
  const where = new Map();
  for (const d of w.days || []) for (const b of d.blocks || []) for (const it of b.items || []) {
    if (!it.group || !it.exercise_id || !(typeof it.sets === 'number' && it.sets > 0) || ['warmup', 'cooldown', 'aerobic', 'prehab', 'core'].includes(b.kind)) continue;
    if (!where.has(it.group)) where.set(it.group, new Set());
    where.get(it.group).add(b.kind);
  }
  return model.rules.muscles.groups.order.filter(g => where.has(g) && [...where.get(g)].every(k => k === 'accessories'));
}

/**
 * The stairway (macro view): one table per training block - week (and test), stair level bar, planned effort, the week's sets
 * (a circuit plan: the work seconds) - then the phases, the exercise blocks, what comes after the plan and the test dates.
 */
function stairwaySection(plan, model, o) {
  const t = T(model, o), m = plan.meta || {}, L = [];
  const tbs = plan.shape.training_blocks || [];
  // F3 (COACH-R3 R3-VOL-04 'about 3 % a week until the halfway week and about 5 % after it'; RECHECK 02 / 05 / 06 minors: 'weeks 3-8:
  // Driving it (steps get a bit bigger)' against 'bigger after the halfway week'): the intro names the halfway week
  const stb = tbs.find(x => x.type === 'stairway' && x.stair_N);
  let half = null;
  try { half = stb ? model.stair(stb.stair_N).halfway : null; } catch { half = null; }
  // fix round 2 / F3 (COACH-R3 R3-VOL-04; RECHECK v0.4 04 major: 'small steps up to week 4, a bit bigger from week 5' over sets that moved in
  // weeks 3, 4 and 7 only): the sentence about step sizes only when the plan's own weekly numbers step that way
  if (stb && typeof half === 'number' && half < stb.stair_N && has(model, 'plan.stairway_intro_plain') && !stepsGetBigger(plan, stb, half)) L.push(t('plan.stairway_intro_plain'), '');
  else if (stb && typeof half === 'number' && half < stb.stair_N && has(model, 'plan.stairway_intro_half')) L.push(t('plan.stairway_intro_half', { half: stb.weeks[0] + half - 1, next: stb.weeks[0] + half }), '');
  else if (tbs.some(x => x.type === 'stairway')) L.push(t('plan.stairway_intro'), '');
  const circuit = (plan.weeks || []).some(w => w.circuit && typeof w.circuit.work_s === 'number');
  for (const tb of tbs) {
    L.push('## ' + t(tb.label_key) + DOT + t('ui.plan.week', { n: tb.weeks[0] + '-' + tb.weeks[1] }), '');
    const ws = (plan.weeks || []).filter(x => x.training_block === tb.n);
    L.push('| ' + [t('ui.plan.col.week'), t('ui.plan.level'), t('ui.plan.col.effort'), t(circuit ? 'ui.plan.col.work' : 'ui.plan.col.sets')].join(' | ') + ' |', '|---|---|---|---|');
    const iw = new Set(intensifierWeeks(plan));
    for (const w of ws) {
      const lvl = typeof w.stair_level === 'number' ? w.stair_level.toFixed(1) + ' ' + '▮'.repeat(Math.max(1, Math.round(w.stair_level))) : '–';
      const wk = String(w.n) + (w.test ? DOT + t('ui.plan.test_mark') : '');
      const rir = w.planned_rir ? (w.planned_rir.min === w.planned_rir.max ? String(w.planned_rir.min) : w.planned_rir.min + '-' + w.planned_rir.max) : null;
      const eff = rir ? t('ui.plan.rir_short', { rir }) + (iw.has(w.n) ? ' ' + t('ui.plan.plus_intensifier') : '') : '–';
      // the week's sets as the weekly sets table counts them (main and optional days)
      const sets = circuit && w.circuit ? t('ui.plan.seconds', { n: w.circuit.work_s }) : fmtNum(w.total_resistance_sets);
      L.push('| ' + [wk, lvl, eff, sets].join(' | ') + ' |');
    }
    // phases as week spans (the label of each run of weeks)
    const spans = [];
    for (const w of ws) { const last = spans[spans.length - 1]; if (last && last.key === w.phase_key && last.to === w.n - 1) last.to = w.n; else spans.push({ key: w.phase_key, from: w.n, to: w.n }); }
    if (spans.length) L.push('', spans.map(s => t(s.from === s.to ? 'ui.plan.phase_span_one' : 'ui.plan.phase_span', { from: s.from, to: s.to, phase: s.key })).join(DOT));
    const ebs = (plan.shape.exercise_blocks || []).filter(e => e.training_block === tb.n);
    if (ebs.length) L.push('');
    for (const e of ebs) L.push('- ' + t('plan.exercise_block', { n: e.n, from: e.weeks[0], to: e.weeks[1] }));
    L.push('');
  }
  const ap = m.after_plan;
  if (ap && ap.next && model.has('en', 'plan.next.' + ap.next)) L.push(t('plan.next_after_plan', { next: tr(model, o.lang, 'plan.next.' + ap.next, { weeks: ap.weeks, date: ap.date ? fmtDate(model, o.lang, ap.date) : ap.date }) }));
  const tests = m.tests || {};
  if ((tests.items || []).length) {
    L.push('', '**' + t('ui.plan.tests') + ':** ' + tests.items.map(i => t('tests.' + i)).join(', '));
    // (fix round 2 / F1 minimal seam, E-147: the real test days from generate - meta.tests.test_dates - replace the retired reminders)
    const tDates = tests.test_dates || tests.reminders || [];
    // fix round 2 / F3 (RECHECK v0.4 05 / 07 minors: machine dates, no weekday): 'Test days: week 1: Monday 12 Oct 2026, ...'
    const td = Array.isArray(tests.test_days) ? tests.test_days.filter(x => x && x.date && x.weekday) : [];
    if (td.length && has(model, 'ui.plan.test_days')) {
      const byWeek = new Map();
      for (const x of td) { if (!byWeek.has(x.week)) byWeek.set(x.week, []); byWeek.get(x.week).push(weekdayIn(model, o.lang, x.weekday) + ' ' + fmtDate(model, o.lang, x.date)); }
      const list = [...byWeek].map(([wk, ds]) => model.t(o.lang, 'ui.plan.test_days_week', { n: wk, days: ds.join(', ') })).join('; ');
      L.push(esc(model.t(o.lang, 'ui.plan.test_days', { list })));
    } else if (tDates.length) L.push(t('ui.plan.reminder', { dates: tDates.join(', ') }));
  }
  return L;
}

/** the weekly numbers of a stairway (sets; a circuit plan: work seconds) step up by more after the halfway week than before it */
function stepsGetBigger(plan, stb, half) {
  const ws = (plan.weeks || []).filter(w => w.training_block === stb.n && w.block_type === 'stairway');
  if (ws.length < 4) return true;
  const circuit = ws.some(w => w.circuit && typeof w.circuit.work_s === 'number');
  const v = ws.map(w => (circuit && w.circuit ? w.circuit.work_s : w.total_resistance_sets));
  if (v.some(x => typeof x !== 'number')) return true;
  const steps = v.slice(1).map((x, i) => x - v[i]);
  const a = steps.slice(0, Math.max(1, half - 1)), b = steps.slice(Math.max(1, half - 1));
  const mean = (xs) => (xs.length ? xs.reduce((p, c) => p + c, 0) / xs.length : 0);
  return b.length > 0 && mean(b) > 0 && mean(b) >= mean(a) - 1e-9;
}

/**
 * Weekly sets (first, middle and last stairway week). v0.4 B3: per FOCUS group when the plan has the group tallies (COACH-R3
 * R3-SES-01; a group not trained directly shows '-'), with the work seconds of a circuit plan (RECHECK 05 minor); else per muscle.
 */
function weeklySetsSection(plan, model, o) {
  const t = T(model, o), L = [];
  const st = (plan.weeks || []).filter(w => w.block_type === 'stairway');
  const pool = st.length ? st : (plan.weeks || []);
  if (!pool.length) return L;
  const picks = [...new Set([pool[0], pool[Math.floor((pool.length - 1) / 2)], pool[pool.length - 1]])];
  const byGroup = pool.some(w => w.weekly_sets_by_group && Object.keys(w.weekly_sets_by_group).length) && has(model, 'ui.plan.weekly_sets_groups');
  L.push('## ' + t(byGroup ? 'ui.plan.weekly_sets_groups' : 'ui.plan.weekly_sets'), '', '_' + t(byGroup ? 'ui.plan.weekly_sets_groups_note' : 'ui.plan.weekly_sets_note') + '_', '');
  L.push('| ' + ['', ...picks.map(w => t('ui.plan.week', { n: w.n }))].join(' | ') + ' |', '|' + '---|'.repeat(picks.length + 1));
  if (byGroup) {
    // F3 (RECHECK 01 / 04 / 08 minors: the legend promised '-' rows the table never printed; a credit-only group showed sets next to
    // '-' for the others; the class lifts' sets appeared in no row): every FOCUS group has a row - trained directly: its sets; not
    // trained directly: '-' (with the sets it still gets from other lifts or a kept pattern in brackets); a class lift: '3 (class lift)'
    const allRows = has(model, 'ui.plan.sets_not_direct');
    for (const g of model.rules.muscles.groups.order.filter(x => x !== 'core')) {
      const vals = picks.map(w => (w.weekly_sets_by_group || {})[g]);
      const ntOf = (w) => {
        const tc = plan.time_check || {};
        const blk = (Array.isArray(tc.by_block) ? tc.by_block.find(b => b.training_block === w.training_block) : null) || tc;
        const hit = (blk.not_trained_directly || []).find(x => (x.group || x) === g);
        if (hit) return typeof hit === 'string' ? { group: hit, reason: 'time' } : hit;
        const wk = (w.not_trained_directly || []).find(x => (x.group || x) === g);
        return wk ? (typeof wk === 'string' ? { group: wk, reason: 'time' } : wk) : null;
      };
      if (!vals.some(v => typeof v === 'number' && v > 0) && !(allRows && picks.some(w => ntOf(w)))) continue;
      const cell = (w, v) => {
        const nt = ntOf(w);
        if (!nt) return fmtNum(v);
        if (!allRows) return '-';
        if (!(typeof v === 'number' && v > 0)) return '-';
        return nt.reason === 'class_lift' && has(model, 'ui.plan.sets_class_lift') ? t('ui.plan.sets_class_lift', { n: fmtNum(v) }) : t('ui.plan.sets_not_direct', { n: fmtNum(v) });
      };
      // fix round 2 / F3 (COACH-R3 R3-SES-01 Focus muscle 1 / 2; RECHECK v0.4 06 major: no row showed a Focus muscle's own sets): a Focus
      // pick that is the whole group is tagged on its row; a pick inside a group (glutes in hips, side delts in shoulders) has its own
      // row under it
      const fc = focusChoices(plan);
      const whole = fc.some(c => c === g || (groupOfSafe(model, c) === g && (model.rules.muscles.groups.members[g] || []).length === 1));
      L.push('| ' + [t('group.' + g) + (whole && has(model, 'ui.plan.focus_tag') ? ' ' + t('ui.plan.focus_tag') : ''), ...picks.map((w, i) => cell(w, vals[i]))].join(' | ') + ' |');
      if (has(model, 'ui.plan.focus_row')) for (const c of fc) {
        if (c === g || groupOfSafe(model, c) !== g || (model.rules.muscles.groups.members[g] || []).length === 1 || !model.has('en', 'muscle.' + c)) continue;
        const mv = picks.map(w => (w.weekly_sets_by_muscle || {})[c]);
        if (mv.some(v => typeof v === 'number')) L.push('| ' + [t('ui.plan.focus_row', { muscle: 'muscle.' + c }), ...mv.map(fmtNum)].join(' | ') + ' |');
      }
    }
  } else {
    for (const mu of model.rules.muscles.order) {
      const vals = picks.map(w => (w.weekly_sets_by_muscle || {})[mu]);
      if (!vals.some(v => typeof v === 'number' && v > 0)) continue;
      L.push('| ' + [t('muscle.' + mu), ...vals.map(fmtNum)].join(' | ') + ' |');
    }
  }
  L.push('| **' + t('ui.plan.total') + '** | ' + picks.map(w => '**' + fmtNum(w.total_resistance_sets) + '**').join(' | ') + ' |');
  if (picks.some(w => w.circuit && typeof w.circuit.work_s === 'number') && has(model, 'ui.plan.work_seconds_row')) {
    L.push('| ' + [t('ui.plan.work_seconds_row'), ...picks.map(w => (w.circuit ? t('ui.plan.seconds', { n: w.circuit.work_s }) : '–'))].join(' | ') + ' |');
    L.push('', '_' + t('ui.plan.circuit_climb_note') + '_');
  }
  return L;
}

function groupOfSafe(model, mu) { try { return model.groupOf(mu); } catch { return null; } }

/** the failed (warn) checks in the client's words, never the internal id (RECHECK 03 / 06 / 07 minors 'V28 ... follows the plan') */
function summarySection(plan, model, o) {
  const t = T(model, o), L = [];
  const failed = ((plan.validation && plan.validation.checks) || []).filter(c => !c.pass);
  if (failed.length) { // the warnings are shown up front (noticesSection); the notes keep the checks that did not pass
    L.push('## ' + t('ui.plan.notes'), '');
    for (const c of failed) L.push('- ⚠ ' + checkLine(c, model, o));
    L.push('');
  }
  // F3 (RECHECK 08 minor: 'Full terms: Disclaimer and Release of Liability.' with no link): the footer links the full text
  const url = disclaimerUrl(model, o);
  L.push('---', '', '_' + t('ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version }) + '_', '', t('ui.disclaimer') + (url ? ' [' + t('ui.plan.own_risk_link') + '](' + url + ')' : ''), '', t('video.note'));
  return L;
}

function checkLine(c, model, o) {
  const t = T(model, o);
  let fk = 'check.failed.' + c.id;
  const a0 = (c.violations[0] && c.violations[0].args) || {};
  // F3 (RECHECK 01 / 02 / 03 / 04 / 07 majors: 'Your mix is 76 % two-leg, against about 50 %: swap a single-leg exercise for a two-leg
  // one' told a client who was already too two-legged to add more two-leg work): the advice follows the sign of share - target
  if (c.id === 'V28' && typeof a0.share === 'number' && typeof a0.target === 'number') {
    const dir = a0.share > a0.target ? 'check.failed.V28_more_single' : 'check.failed.V28_more_two';
    if (has(model, dir)) fk = dir;
  }
  if (has(model, fk)) {
    const a = { ...a0 };
    for (const k of ['share', 'target']) if (typeof a[k] === 'number' && a[k] <= 1) a[k] = Math.round(a[k] * 100);
    return t(fk, a);
  }
  return has(model, 'ui.plan.check_failed') ? t('ui.plan.check_failed', { check: c.key }) : t(c.key);
}

// ------------------------------------------------------------------------------------------------------------- macro tables

/** the week at a glance: day | session | time | muscle groups (exercises) (R2-GEN-02 macro view; screenshots) */
function weekGlance(plan, n, model, o) {
  const t = T(model, o), w = weekOf(plan, n);
  if (!w || !has(model, 'ui.plan.week_glance')) return [];
  const days = dayList(plan, n).filter(d => ['main', 'optional', 'aerobic'].includes(d.kind));
  if (!days.length) return [];
  const L = ['### ' + t('ui.plan.week_glance', { n }), ''];
  L.push('| ' + [t('ui.plan.col.day'), t('ui.plan.col.session'), t('ui.plan.col.time'), t('ui.plan.col.groups')].join(' | ') + ' |', '|---|---|---|---|');
  for (const d of days) {
    const g = Object.entries(d.groups || {}).map(([k, v]) => t('group.' + k) + ' ' + v).join(', ');
    const label = d.kind === 'aerobic' ? t('ui.plan.aerobic_day') : esc(dayTitle(plan, d, model, o)) + optionalTag(plan, d, model, o);
    const mins = typeof d.est_minutes === 'number' ? t('ui.plan.est_minutes', { min: d.est_minutes }) : '–';
    L.push('| ' + [t('weekday.' + d.weekday), label, mins, g || '–'].join(' | ') + ' |');
  }
  return L;
}

/** a day as one table: exercise | sets x reps | effort (screenshots) */
function dayTable(plan, n, d, model, o) {
  const t = T(model, o);
  if (!['main', 'optional'].includes(d.kind)) return [];
  const rows = [];
  const shown = displayBlocks(d);
  for (const b of d.blocks || []) for (const it of shown.get(b) || []) {
    if (['warmup', 'cooldown'].includes(b.kind) || !(it.name_key || it.wod || it.bucket === 'TEST')) continue;
    const dose = aerobicOf(it) ? aerobicDose(it, model, o) : itemDose(model, o, it);
    rows.push([esc(exName(model, o, it)) + supersetTag(d, it), esc(dose), esc(formatEffort(it.effort, model, o.lang))]);
  }
  if (!rows.length) return [];
  const L = ['### ' + t('ui.plan.day_glance', { day: 'weekday.' + d.weekday }) + DOT + esc(dayTitle(plan, d, model, o)), ''];
  L.push('| ' + ['#', t('ui.plan.col.exercise'), t('ui.plan.col.dose'), t('ui.plan.col.effort')].join(' | ') + ' |', '|---|---|---|---|');
  rows.forEach((r, i) => L.push('| ' + [String(i + 1), ...r.map(x => x || '–')].join(' | ') + ' |'));
  return L;
}

// ------------------------------------------------------------------------------------------------------------- block view

function blockView(plan, trainingBlock, model, o) {
  const t = T(model, o);
  const tb = (plan.shape.training_blocks || []).find(x => x.n === trainingBlock);
  if (!tb) return '';
  const weeks = (plan.weeks || []).filter(w => w.training_block === tb.n);
  const L = ['## ' + t('ui.plan.view.block') + DOT + t(tb.label_key) + DOT + t('ui.plan.week', { n: tb.weeks[0] + '-' + tb.weeks[1] }), ''];
  const levels = weeks.filter(w => typeof w.stair_level === 'number');
  if (levels.length) L.push('**' + t('ui.plan.level') + ':** ' + levels.map(w => w.stair_level.toFixed(1)).join(DOT), '');
  const days = new Map();
  for (const w of weeks) for (const d of w.days || []) {
    if (!['main', 'optional'].includes(d.kind)) continue;
    if (!days.has(d.weekday)) days.set(d.weekday, d);
  }
  for (const wd of WEEKDAYS.filter(x => days.has(x))) {
    const d0 = days.get(wd);
    const rows = new Map();
    for (const w of weeks) {
      const d = (w.days || []).find(x => x.weekday === wd);
      if (!d) continue;
      for (const b of d.blocks || []) for (const it of b.items || []) {
        // B3 (RECHECK 03 major: a test-only row with dashes): tests are not stairway sets, they are written in their weeks
        if (['warmup', 'cooldown', 'aerobic'].includes(b.kind) || !(it.name_key || it.wod) || it.role === 'test' || it.bucket === 'TEST') continue;
        if (!rows.has(it.slot_id)) rows.set(it.slot_id, { names: [], sets: new Map(), reps: [], byEb: new Map() });
        const r = rows.get(it.slot_id);
        const nm = esc(exName(model, o, it));
        if (!r.names.includes(nm)) r.names.push(nm);
        r.sets.set(w.n, it.sets);
        const rp = esc(itemDose(model, o, it, { short: true }));
        if (rp && !r.reps.includes(rp)) r.reps.push(rp);
        // (fix round 2 / F3; RECHECK v0.4 06 / 07 minors: 'A -> B' hid a slot that went A, B, A or A, A-detail, A): the name and the reps
        // of each exercise block, in order
        if (!r.byEb.has(w.exercise_block)) r.byEb.set(w.exercise_block, { name: nm, reps: rp });
      }
    }
    if (!rows.size) continue;
    L.push('### ' + t('weekday.' + wd) + DOT + esc(dayTitle(plan, d0, model, o)), '');
    L.push('| ' + t('ui.plan.exercise') + ' | ' + t('ui.plan.sets') + ' | ' + t('ui.plan.reps') + ' |', '|---|---|---|');
    for (const r of rows.values()) {
      const byEb = [];
      for (const eb of (plan.shape.exercise_blocks || []).filter(e => e.training_block === tb.n)) {
        const part = weeks.filter(w => w.n >= eb.weeks[0] && w.n <= eb.weeks[1]).map(w => (r.sets.has(w.n) && r.sets.get(w.n) !== null ? String(r.sets.get(w.n)) : '–'));
        if (part.length) byEb.push(part.join(' '));
      }
      const seq = (list) => list.filter((x, i) => x && (i === 0 || x !== list[i - 1]));
      const ebSeq = [...r.byEb.keys()].sort((a, b) => a - b).map(k => r.byEb.get(k));
      const names = ebSeq.length ? seq(ebSeq.map(x => x.name)) : r.names;
      const reps = ebSeq.length ? seq(ebSeq.map(x => x.reps)) : (r.reps.length > 2 ? [r.reps[0], r.reps[r.reps.length - 1]] : r.reps);
      L.push('| ' + names.join(' → ') + ' | ' + byEb.join(DOT) + ' | ' + reps.join(' → ') + ' |');
    }
    L.push('');
  }
  return L.join('\n');
}

// ------------------------------------------------------------------------------------------------------------- week / day

function weekSection(plan, n, model, o) {
  const t = T(model, o), w = weekOf(plan, n);
  if (!w) return '';
  const L = ['## ' + t('ui.plan.week', { n }) + DASH + t(w.phase_key), ''];
  const st = stairText(plan, n, model, o.lang);
  if (st) L.push('_' + esc(st) + '_', '');
  if (w.test) L.push('**' + t(testHeaderKey(w, model)) + '** (' + (w.test.items || []).map(i => t('tests.' + i)).join(', ') + ')', '');
  // B3: the intensifier line only in a week whose items carry one (RECHECK 05 minor: announced, but no item had it)
  if (w.planned_rir && w.planned_rir.intensifiers && intensifierWeeks(plan).includes(n)) {
    // F3: the days that carry one (RECHECK 04 / 06 / 08 minors: 'one intensifier per training day' with days that had none)
    const days = intensifierDays(plan, n);
    if (days.length && has(model, 'effort.intensifier_days')) L.push('_' + t(days.circuit ? 'effort.intensifier_days_circuit' : 'effort.intensifier_days', { days: days.slice() }) + '_', '');
    else L.push('_' + t('effort.intensifier') + '_', '');
  }
  const ch = changesText(plan, n, model, o.lang);
  if (ch.length) { L.push('**' + t('ui.plan.changes') + '**'); for (const c of ch) L.push('- ' + esc(c)); L.push(''); }
  const ab = athleticLine(plan, w, model, o);
  if (ab) L.push(ab, '');
  for (const d of dayList(plan, n)) L.push(dayCard(plan, n, d.weekday, model, o), '');
  return L.join('\n');
}

/** the test header by test type: a body test or a strength test do not 'replace top sets' the same way (RECHECK 05 minor) */
function testHeaderKey(w, model) {
  if (w.test.type === 'baseline') return 'ui.plan.test_baseline';
  const items = w.test.items || [];
  if (items.length && items.every(i => i === 'body') && has(model, 'ui.plan.test_end_body')) return 'ui.plan.test_end_body';
  if (items.includes('strength') && has(model, 'ui.plan.test_end_strength')) return 'ui.plan.test_end_strength';
  // (fix round 2 / F3; RECHECK v0.4 03 major: 'replaces this week's top sets' over a sprint, a shuttle and a jump test - E-165 lets each
  // test take its own station's place)
  if (items.length && items.every(i => ['speed_agility', 'jumps'].includes(i)) && has(model, 'ui.plan.test_end_stations')) return 'ui.plan.test_end_stations';
  return 'ui.plan.test_end';
}

function athleticLine(plan, w, model, o) {
  const t = T(model, o), a = w.athletic_budget;
  if (!a || !a.planned) return '';
  const p = a.planned, parts = [];
  // fix round 2 / F3 (RECHECK v0.4 03 minor: '48 jump contacts' with the ankle hops inside next to 'about 20 % of your weekly jump
  // contacts'): jumps and ankle hops are two numbers, like the capacity lines
  const split = has(model, 'ui.plan.ankle_contacts');
  const jumps = (p.plyo_contacts || 0) + (p.jump_contacts || 0) + (split ? 0 : (p.low_contacts || 0));
  if (jumps) parts.push(t('ui.plan.contacts', { n: jumps }));
  if (split && p.low_contacts) parts.push(t('ui.plan.ankle_contacts', { n: p.low_contacts }));
  if (p.throws) parts.push(t('ui.plan.throws', { n: p.throws }));
  if (p.cod_cuts) parts.push(t('ui.plan.cuts', { n: p.cod_cuts }));
  if (p.sprint_m) parts.push(t('ui.plan.sprint_m', { n: p.sprint_m }));
  if (p.olympic_sets) parts.push(t('ui.plan.olympic_sets', { n: p.olympic_sets }));
  // v1.2 (review 08 major 6 / 02 minor 17): the share actually planned (reactive plyo contacts over all jump and throw work),
  // never the budget's target
  const work = (p.plyo_contacts || 0) + (p.jump_contacts || 0) + (p.low_contacts || 0) + (p.throws || 0);
  // v0.4 stage B2 (minimal): the plan's own planned share - reactive jumps + ankle work over all jump and throw work (R2-ATH-01 /
  // R2-ATH-02: pogo and ankle hops are plyometric); older plans without it keep the v1.2 reading
  const share = typeof a.planned_share === 'number' ? a.planned_share : (work > 0 ? (p.plyo_contacts || 0) / work : null);
  if (work > 0 && typeof a.plyo_share === 'number' && share !== null) parts.push(t('ui.plan.plyo_share', { pct: Math.round(100 * share) }));
  if (a.stage) parts.push(t('plyo.stage.' + a.stage));
  return parts.length ? '**' + t('ui.plan.athletic_budget') + ':** ' + parts.join(DOT) : '';
}

/**
 * The day's title: the template's label, unless the day's own lifts no longer match it (a laterality flip or a kit gap swapped
 * the station: 'A2 - leg press / belt squat + pull' with step-ups and lunges, RECHECK 02 minor) - then '<code> - <lower> + <upper>'
 * from the day's first lower and upper lifts (R2-SES-01 plain day names).
 */
/** ' (optional)' after an optional day's title, unless the title already says it ('Optional day (optional)', RECHECK 01 / 06 / 08) */
function optionalTag(plan, d, model, o) {
  if (!d.optional) return '';
  const tag = model.t(o.lang, 'ui.plan.optional_tag');
  const word = String(tag).replace(/[()]/g, '').trim().toLowerCase();
  return word && String(dayTitle(plan, d, model, o)).toLowerCase().includes(word) ? '' : ' ' + esc(tag);
}

function dayTitle(plan, d, model, o) {
  let t0 = dayTitle0(plan, d, model, o);
  // fix round 2 / F3 (RECHECK v0.4 04 minor: 'WOD-only class' over a day that also holds a 20-30 min bike session): a day named '... only'
  // that carries a cardio add-on says so
  if (has(model, 'ui.plan.day_title_cardio') && /\bonly\b/i.test(String(model.t('en', d.label_key))) && (d.blocks || []).some(b => b.kind === 'aerobic' && (b.items || []).length)) {
    const alt = d.label_key + '.with_cardio';
    t0 = has(model, alt) ? model.t(o.lang, alt) : model.t(o.lang, 'ui.plan.day_title_cardio', { title: t0 });
  }
  // F3 (RECHECK 05 minor: 'Bootcamp 3 - single-leg squat + pulls + arms' with no arm exercise in the plan): a title drops its
  // '+ arms' part when the day holds no biceps or triceps exercise
  if (has(model, 'ui.plan.label_part.arms')) {
    const arms = ' + ' + model.t(o.lang, 'ui.plan.label_part.arms');
    const armItems = (d.blocks || []).some(b => (b.items || []).some(it => ['ISO_BICEP', 'ISO_TRICEP'].includes(it.bucket) || (it.group && ['biceps', 'triceps'].includes(it.group))));
    const i = t0.indexOf(arms);
    if (i >= 0 && !armItems) return t0.slice(0, i) + t0.slice(i + arms.length);
  }
  return t0;
}

function dayTitle0(plan, d, model, o) {
  const base = model.t(o.lang, d.label_key);
  const items = (d.blocks || []).flatMap(b => b.items || []).filter(it => it.exercise_id && it.role !== 'test');
  const lower = items.find(it => ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'].includes(it.bucket));
  // fix round 2 / F3 (RECHECK v0.4 06 minor: 'B1 - hip thrust + push' became 'B1 - hinge + push' in week 5 while the hip thrust still led the
  // day - a secondary station had flipped): the title follows the day's lead lower-body lift (its work lift, else its first), never a
  // later station
  const LOWER4 = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'];
  const lead = model.rules.render && model.rules.render.day_title_from_lead_lift ? (items.find(it => LOWER4.includes(it.bucket) && it.role === 'work') || lower) : null;
  const swapped = (lead ? [lead] : items).some(it => LOWER4.includes(it.bucket) && ((it.flags || []).some(f => ['laterality_flip', 'pattern_gap'].includes(f)) || (it.why || []).some(w => w.key === 'why.laterality_share')));
  const enLabel = String(model.t('en', d.label_key));
  const m = /^([A-Z][0-9A-Za-z]{0,3}) - /.exec(enLabel);
  // the template names a pattern the day no longer holds (the time check left a group out: 'A - squat + pull' with a hinge only)
  const holds = (bs) => items.some(it => bs.includes(it.bucket));
  const missing = (/squat|knee|leg press|lunge/i.test(enLabel) && !holds(['RP_BKD', 'RP_UKD'])) || (/hinge|deadlift|\bhip\b/i.test(enLabel) && !holds(['RP_BHD', 'RP_UHD'])) ||
    (/pull/i.test(enLabel) && !holds(['RP_HPULL', 'RP_VPULL'])) || (/push|(?<!leg )press/i.test(enLabel) && !holds(['RP_HPUSH', 'RP_VPUSH']));
  // v0.4 B4 (sample 04: 'Pull + push press day' after the Olympic budget trimmed the push press): a title with no day code (the
  // class model's own lift names) is rebuilt as '<lifts> day' when it names a lift or Olympic piece the day no longer holds
  const KWL = model.rules.session.time_fit && model.rules.session.time_fit.keep_work_lift;
  const classModel = !!(KWL && (KWL.families || []).includes(plan.meta && plan.meta.family));
  const missingOly = /clean|snatch|push press|jerk/i.test(enLabel) && !holds(['AP_TRIPLE_EXT']);
  if (!m && classModel && (missing || missingOly) && has(model, 'ui.plan.day_title_plain')) {
    const partOf0 = { RP_BKD: 'squat', RP_BHD: 'hinge', RP_UKD: 'single_leg_squat', RP_UHD: 'single_leg_hinge' };
    const lower0 = items.find(it => ['RP_BKD', 'RP_BHD', 'RP_UKD', 'RP_UHD'].includes(it.bucket) && it.role === 'work') || lower;
    const upper0 = items.find(it => ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'].includes(it.bucket) && it.role === 'work') || items.find(it => ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'].includes(it.bucket));
    const parts0 = [];
    if (lower0) parts0.push(model.t(o.lang, 'ui.plan.label_part.' + partOf0[lower0.bucket]));
    if (upper0) parts0.push(model.t(o.lang, 'ui.plan.label_part.' + (/PUSH/.test(upper0.bucket) ? 'push' : 'pull')));
    if (holds(['AP_TRIPLE_EXT']) && has(model, 'ui.plan.label_part.olympic')) parts0.push(model.t(o.lang, 'ui.plan.label_part.olympic'));
    if (parts0.length) { const s0 = model.t(o.lang, 'ui.plan.day_title_plain', { label: parts0.join(' + ') }); return s0.charAt(0).toUpperCase() + s0.slice(1); }
  }
  if (!(swapped || missing) || !m || !has(model, 'ui.plan.day_title')) return base;
  const partOf = { RP_BKD: 'squat', RP_BHD: 'hinge', RP_UKD: 'single_leg_squat', RP_UHD: 'single_leg_hinge' };
  const upper = items.find(it => ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'].includes(it.bucket));
  const P = (k) => model.t(o.lang, 'ui.plan.label_part.' + k);
  const parts = [];
  if (/jump/i.test(enLabel) && holds(['AP_PLYO', 'AP_JUMP_LIMITED_KNEE']) && has(model, 'ui.plan.label_part.jump')) parts.push(P('jump'));
  if (/medball/i.test(enLabel) && holds(['AP_THROW']) && has(model, 'ui.plan.label_part.medball')) parts.push(P('medball'));
  if (/olympic/i.test(enLabel) && holds(['AP_TRIPLE_EXT']) && has(model, 'ui.plan.label_part.olympic')) parts.push(P('olympic'));
  if (lower) parts.push(P(partOf[lower.bucket]));
  if (upper) parts.push(P(/PUSH/.test(upper.bucket) ? 'push' : 'pull'));
  if (!parts.length) return base;
  const label = parts.join(' + ');
  return model.t(o.lang, 'ui.plan.day_title', { code: m[1], label });
}

function dayCard(plan, n, weekday, model, o) {
  const t = T(model, o), w = weekOf(plan, n);
  const d = w && (w.days || []).find(x => x.weekday === weekday);
  if (!d) return '';
  const head = '### ' + t('weekday.' + d.weekday) + DOT;
  if (d.kind === 'play') {
    const act = (plan.meta && plan.meta.profile && plan.meta.profile.activity_ids && plan.meta.profile.activity_ids[0]) || (plan.meta && plan.meta.profile && plan.meta.profile.sport_id) || '';
    return head + t('ui.plan.play_day', { activity: act });
  }
  if (d.kind === 'sport') return head + t('ui.plan.sport_day');
  const items = (d.blocks || []).flatMap(b => b.items || []);
  if (d.kind === 'aerobic') {
    // B3 (RECHECK 04 major: a cardio test hung on the JSON only): an aerobic test is written on the card
    const L = [head + t('ui.plan.aerobic_day')];
    // F3 (COACH-R3 R3-SES-02; RECHECK 05 minor: three cardio days on top of the chosen days, never shown as something to switch off)
    if ((d.toggle_blocks || []).includes('aerobic') && has(model, 'ui.plan.edit_aerobic_day')) L.push('_' + t('ui.plan.edit_aerobic_day') + '_');
    for (const it of items) {
      L.push('- ' + itemLine(plan, d, it, model, o, { compact: true }));
      for (const s of aerobicDetails(it, model, o)) L.push('  ' + s);
    }
    return L.join('\n');
  }
  const L = [head + esc(dayTitle(plan, d, model, o)) + optionalTag(plan, d, model, o)];
  if (typeof d.est_minutes === 'number') L.push('_' + t('ui.plan.est_minutes', { min: d.est_minutes }) + '_');
  // B3 (COACH-R3 R3-SES-02): what can be switched off today, and the supersets that save time
  const sw = switchLine(d, model, o);
  if (sw) L.push('_' + sw + '_');
  // F3 (COACH-R3 R3-SES-02 'tell them up front'; RECHECK 01 / 02 / 03 / 04 / 06 / 08: 'Supersets marked today keep you inside 60 min'
  // above a 66-minute day): the promise only when the day's minutes hold it; otherwise the real minutes and what saves more time
  const over = typeof d.est_minutes === 'number' && typeof d.minutes_limit === 'number' && d.est_minutes > d.minutes_limit;
  if (d.supersets_needed && has(model, 'ui.plan.supersets_today') && typeof d.minutes_limit === 'number' && !over) L.push('_' + t('ui.plan.supersets_today', { min: d.minutes_limit }) + '_');
  const sugg = supersetSuggestions(d, model, o);
  // (fix round 2 / F3; RECHECK v0.4 05 minor: a circuit day told to use supersets it does not have)
  const circuitDay = (d.blocks || []).some(b => b.kind === 'circuit' && (b.items || []).length);
  if (over && circuitDay && !sugg.length && has(model, 'ui.plan.day_over_circuit')) L.push('_' + t('ui.plan.day_over_circuit', { est: d.est_minutes, min: d.minutes_limit }) + '_');
  else if (over && has(model, 'ui.plan.supersets_today_over')) {
    const k = (d.supersets_needed || d.supersets_on ? 'ui.plan.supersets_today_over' : 'ui.plan.day_over') + (sugg.length ? '' : '_none');
    L.push('_' + t(has(model, k) ? k : 'ui.plan.supersets_today_over', { est: d.est_minutes, min: d.minutes_limit }) + '_');
  }
  for (const s of sugg) L.push('_' + s + '_');
  const shown = displayBlocks(d);
  for (const b of d.blocks || []) {
    const list = shown.get(b) || [];
    if (!list.length) continue;
    L.push('', '**' + (b.kind === 'circuit' ? t('block.circuit', { n: b.circuit || 1 }) : t('block.' + b.kind)) + '**');
    const circ = (b.items || []).find(it => it.circuit);
    if (circ) L.push('_' + t('ui.plan.circuit_dose', { rounds: circ.circuit.rounds, work_s: circ.circuit.work_s, transition_s: circ.circuit.transition_s }) + '_');
    list.forEach((it, i) => {
      L.push((i + 1) + '. ' + itemLine(plan, d, it, model, o));
      for (const s of itemDetails(plan, d, it, model, o)) L.push('   ' + s);
    });
  }
  return L.join('\n');
}

/** each block's items in reading order: superset partners next to each other, and a partner that sits in a later block is printed right
 *  after its mate (F3; RECHECK 03 minor / 06 major: '[D1]' in Strength, '[D2]' after the next pair in Accessories) */
function displayBlocks(d) {
  const out = new Map(), moved = new Set();
  const blocks = d.blocks || [];
  blocks.forEach((b, bi) => {
    const list = [];
    for (const it of pairOrder(b.items || [])) {
      if (moved.has(it)) continue;
      list.push(it);
      if (!it.superset) continue;
      for (const b2 of blocks.slice(bi + 1)) for (const x of b2.items || []) if (x !== it && x.superset === it.superset && !moved.has(x)) { list.push(x); moved.add(x); }
    }
    out.set(b, list);
  });
  return out;
}

/** a block's items in reading order with each superset's partners next to each other (F3; RECHECK 03 minor: 'Nordic [D1], Cable Fly
 *  [D2], Leg Extension [C2]' - the reader had to hunt for the chin-up's partner) */
function pairOrder(items) {
  const out = [], done = new Set();
  for (const it of items) {
    if (done.has(it)) continue;
    out.push(it); done.add(it);
    if (it.superset) for (const x of items) if (!done.has(x) && x.superset === it.superset) { out.push(x); done.add(x); }
  }
  return out;
}

/** 'You can switch off these blocks today: core, jumps, throws and speed. You can also add or remove exercises.' */
function switchLine(d, model, o) {
  if (!has(model, 'ui.plan.edit_day')) return '';
  const kinds = (d.toggle_blocks || (d.blocks || []).filter(b => b.toggle).map(b => b.kind)).filter((k, i, a) => SWITCH_KINDS.includes(k) && a.indexOf(k) === i && (d.blocks || []).some(b => b.kind === k && (b.items || []).length));
  // (fix round 2 / F1 minimal seam, E-152: a circuit's switchable athletic / cardio station, by name)
  const all = (d.blocks || []).flatMap(b => b.items || []);
  const stations = (d.toggle_items || []).filter(x => x.toggle).map(x => all.find(it => it.slot_id === x.slot_id)).filter(Boolean)
    .map(it => exName(model, o, it) + ' (' + model.t(o.lang, 'block.short.athletic') + ')');
  if (!kinds.length && !stations.length) return '';
  return T(model, o)('ui.plan.edit_day', { blocks: [...kinds.map(k => (has(model, 'block.short.' + k) ? model.t(o.lang, 'block.short.' + k) : model.t(o.lang, 'block.' + k))), ...stations].join(', ') });
}

/** the eligible pairs the day does not run as supersets yet, with the minutes they save (R3-SES-02 step 3; prefs.superset_recommendations) */
function supersetSuggestions(d, model, o) {
  if (!o.show_supersets || !has(model, 'ui.plan.superset_suggest_line')) return [];
  const all = (d.blocks || []).flatMap(b => b.items || []);
  const out = [];
  for (const r of d.superset_recommendations || []) {
    if (r.on || !(r.minutes_saved > 0)) continue;
    const its = (r.items || []).map(id => all.find(x => x.slot_id === id)).filter(Boolean);
    if (its.length < 2) continue;
    out.push(T(model, o)('ui.plan.superset_suggest_line', { pair: its.map(x => exName(model, o, x)).join(' + '), min: r.minutes_saved }));
  }
  return out;
}

function itemDose(model, o, it, opt = {}) {
  const t = (k, a) => model.t(o.lang, k, a);
  if (it.wod) {
    const fmt = t('ui.plan.wod_format.' + it.wod.format), [a, z] = it.wod.minutes;
    return a === z ? t('ui.plan.wod_dose_fixed', { format: fmt, n: a }) : t('ui.plan.wod_dose', { format: fmt, min: a, max: z });
  }
  if (it.circuit && !opt.short) return formatReps({ type: 'rounds_work', rounds: it.circuit.rounds, work_s: it.circuit.work_s }, model, o.lang);
  if (it.bucket === 'SKILL' && it.reps && it.reps.type === 'minutes') return t('ui.plan.skill_dose', { min: it.reps.min, max: it.reps.max });
  // B3 (RECHECK 01 / 02 / 03 minors: 'countermovement jump — countermovement jump'): a test item's name is its test; no dose repeat
  if (it.bucket === 'TEST') return '';
  const reps = it.set_reps ? formatSetReps(it.set_reps, model, o.lang) : formatReps(it.reps, model, o.lang);
  if (opt.short) return reps;
  if (typeof it.sets === 'number' && it.sets > 0 && reps) return it.sets + ' × ' + reps;
  if (typeof it.sets === 'number' && it.sets > 0) return String(it.sets) + ' × ';
  return reps;
}

/** an aerobic session's dose on the client's own tool: minutes and the pattern ('3 min hard / 3 min easy, repeat') */
function aerobicDose(it, model, o) {
  const parts = [];
  const mins = it.reps && it.reps.type === 'minutes' ? formatReps(it.reps, model, o.lang) : it.aerobic && it.aerobic.minutes ? model.t(o.lang, 'reps.minutes', { min: it.aerobic.minutes[0], max: it.aerobic.minutes[1] }) : '';
  if (mins) parts.push(mins);
  const pat = aerobicPattern(it, model, o);
  if (pat) parts.push(pat);
  return parts.join(DOT);
}

function aerobicPattern(it, model, o) {
  const e = it.effort || {};
  const p = e.pattern;
  if (!p || !has(model, 'aerobic.pattern.steady')) return '';
  const t = (k, a) => tr(model, o.lang, k, a);
  const time = (s) => (s >= 60 && s % 60 === 0 ? t('aerobic.time_min', { n: s / 60 }) : t('aerobic.time_s', { n: s }));
  const run = ['run', 'treadmill'].includes(e.modality);
  if (p.kind === 'steady') return t('aerobic.pattern.steady');
  if (p.kind === 'sprints') return run ? t('aerobic.pattern.sprints_run', { n: p.n, m: p.m }) : t('aerobic.pattern.sprints_machine', { n: p.n, s: p.s });
  if (p.kind === 'intervals') {
    const byColour = 'aerobic.pattern.intervals_' + e.colour;
    return t(run ? 'aerobic.pattern.run_walk' : (has(model, byColour) ? byColour : 'aerobic.pattern.intervals'), { work: time(p.work_s), easy: time(p.easy_s) });
  }
  return '';
}

function aerobicDetails(it, model, o) {
  const t = T(model, o), L = [];
  if (it.test && it.test.test && has(model, 'ui.plan.aerobic_test')) L.push('- **' + t('ui.plan.aerobic_test', { test: 'tests.' + it.test.test }) + '**');
  for (const n of it.notes || []) if (n && n.key) L.push('- ' + t(n.key, n.args));
  return L;
}

/** superset pair tags of a day ('A1', 'A2' ...), in reading order, so a pair split by a block is still clear (RECHECK 01 minor) */
function supersetTag(d, it) {
  if (!it.superset) return '';
  const ids = [];
  for (const b of d.blocks || []) for (const x of b.items || []) if (x.superset && !ids.includes(x.superset) && (d.blocks || []).flatMap(bb => bb.items || []).filter(y => y.superset === x.superset).length >= 2) ids.push(x.superset);
  const i = ids.indexOf(it.superset);
  if (i < 0) return '';
  const mates = (d.blocks || []).flatMap(b => b.items || []).filter(x => x.superset === it.superset);
  return ' [' + SS_LETTERS[i % SS_LETTERS.length] + (mates.indexOf(it) + 1) + ']';
}

function itemLine(plan, d, it, model, o, opt = {}) {
  const t = T(model, o);
  let name = esc(exName(model, o, it));
  // F3 (COACH-R3 R3-SES-01: Focus muscle 1 / 2 are the person's own pick; RECHECK 01 / 02 / 03 / 08: '(Focus)' on optional-day
  // exercises of a client who picked no Focus muscle): '(Focus)' only for an exercise of a Focus muscle, every other added slot
  // '(bonus)'
  if (it.origin === 'bonus') name += ' ' + t('ui.plan.bonus_tag');
  else if (it.bucket === 'FOCUS' || it.origin === 'focus_added') name += ' ' + t(isFocusMuscleItem(plan, it, model) ? 'ui.plan.focus_tag' : 'ui.plan.bonus_tag');
  const parts = [];
  if (aerobicOf(it)) {
    if (!(it.effort && it.effort.modality)) {
      const colour = (it.aerobic && it.aerobic.colour) || (it.effort && it.effort.colour);
      if (colour) parts.push(t('conditioning.colour.' + colour));
    }
    const dose = aerobicDose(it, model, o);
    if (dose) parts.push(esc(dose));
  } else {
    const dose = itemDose(model, o, it);
    if (dose && dose.trim() !== '×') parts.push(esc(dose));
    const eff = formatEffort(it.effort, model, o.lang);
    if (eff) parts.push(esc(eff));
    const pr = pairRest(d, it);
    // three or more in a superset rest after the last exercise of the group, not 'after the pair' (RECHECK 04 minor)
    const rest = pr && pr.type === 'after_pair' && typeof pr.max !== 'number' && supersetPartners(d, it).length >= 2 && has(model, 'rest.after_group') ? model.t(o.lang, 'rest.after_group') : formatRest(pr, model, o.lang);
    if (rest) parts.push(esc(rest));
  }
  const partners = supersetPartners(d, it);
  if (partners.length && (d.supersets_on || (it.rest && it.rest.type === 'after_pair'))) parts.push(t('ui.plan.superset_with') + ' ' + partners.map(p => esc(exName(model, o, p))).join(' + '));
  const head = (it.name_key || it.wod || it.bucket === 'TEST' || aerobicOf(it) ? '**' + name + '**' : name) + supersetTag(d, it);
  return opt.compact ? [head, ...parts].join(DOT) : head + (parts.length ? DASH + parts.join(DOT) : '');
}

/** the item trains one of the client's Focus muscles (meta.derived.priority_muscles, or its FOCUS group) */
function isFocusMuscleItem(plan, it, model) {
  const m = plan.meta || {};
  const pr = (m.derived && m.derived.priority_muscles) || (m.targets && m.targets.priority) || [];
  if (!pr.length || !it.exercise_id || !model.hasEx(it.exercise_id)) return false;
  const pm = model.ex(it.exercise_id).primary_muscle;
  if (!pm) return false;
  if (pr.includes(pm)) return true;
  // shoulders are one group (front + side + rear delts, R3-VOL-01); hips stay two muscles here (a leg curl is not a glute Focus)
  const g = (mu) => { try { return model.groupOf(mu); } catch { return null; } };
  return g(pm) === 'shoulders' && pr.some(x => g(x) === 'shoulders');
}

/** a pair rests after both: the longest rest of the pair (a pair holding the work lift keeps its strength rest) */
function pairRest(d, it) {
  if (!it.rest || it.rest.type !== 'after_pair') return it.rest;
  const mates = supersetPartners(d, it).concat([it]).map(x => x.rest).filter(r => r && r.type === 'after_pair' && typeof r.max === 'number');
  return mates.length ? mates.sort((a, b) => b.max - a.max)[0] : it.rest;
}

function supersetPartners(d, it) {
  if (!it.superset) return [];
  const all = (d.blocks || []).flatMap(b => b.items || []);
  return all.filter(x => x !== it && x.superset === it.superset && x.slot_id !== it.slot_id);
}

function itemDetails(plan, d, it, model, o) {
  const t = T(model, o), L = [];
  if (it.test && it.test.test && it.bucket !== 'TEST') L.push('- **' + t('ui.plan.test_week') + ':** ' + esc(testName(model, o.lang, it.test.test)));
  const load = formatLoad(it.load && it.load.type === 'medball_lb' ? { ...it.load, wall_ball: isWallBall(model, it) } : it.load, model, o.lang, o.units);
  if (load) L.push('- ' + esc(load));
  // F3: one instruction per test (RECHECK 01 / 04 / 07 majors: 'it replaces this lift's top set' next to 'Test day: replaces this week's
  // top sets'); the once-a-plan notes are said up front (ONCE_NOTES)
  const replaces = (it.notes || []).some(n => n && n.key === 'note.test_top_set_replaces');
  for (const n of it.notes || []) {
    if (!n || !n.key || (n.key === 'load.week1_tip' && it.load && it.load.type === 'week1_tip')) continue;
    if (ONCE_NOTES.includes(n.key) && has(model, ONCE_LINE[n.key])) continue;
    if (replaces && n.key === 'note.test_day') continue;
    L.push('- ' + t(n.key, n.args));
  }
  // F3 (ORD-05; RECHECK 06 minor: partners with unequal sets and no word on the leftover sets): the extra sets of the longer
  // partner are done on their own
  const mates = supersetPartners(d, it);
  if (mates.length && typeof it.sets === 'number' && has(model, 'ui.plan.superset_leftover') && (d.supersets_on || (it.rest && it.rest.type === 'after_pair'))) {
    const most = Math.max(...mates.map(x => (typeof x.sets === 'number' ? x.sets : 0)));
    const extra = it.sets - most;
    if (most > 0 && extra > 0) L.push('- ' + t(extra === 1 ? 'ui.plan.superset_leftover_one' : 'ui.plan.superset_leftover', { n: extra }));
  }
  if (it.wod && (it.wod.stations || []).length) {
    if (it.wod.rounds) L.push('- ' + t('ui.plan.wod_rounds', { n: it.wod.rounds, min: it.wod.minutes[0] }));
    L.push('- ' + it.wod.stations.map((s, i) => wodStation(model, o, it.wod, s, i)).join(DOT));
  }
  if (it.cue_key && !it.wod) L.push('> ' + t(it.cue_key));
  if (o.show_swaps && (it.swaps || []).length) L.push('- ' + t('ui.plan.swaps') + ': ' + it.swaps.filter(s => model.hasEx(s)).map(s => esc(model.t(o.lang, model.ex(s).name_key))).join(' / '));
  if (it.name_key && !it.wod) {
    const v = it.video;
    if (v && v.url && v.kind !== 'search') L.push('- [' + t('ui.plan.video') + '](' + v.url + ')');
    // (fix round 2 / F3; R2-GEN-08; RECHECK v0.4 03 minor: the long Spanish names find few videos) the search uses the English gym name
    else L.push('- [' + t('ui.plan.video_search') + '](' + YT + encodeURIComponent(o.lang !== 'en' && model.rules.render && model.rules.render.video_search_english ? model.t('en', it.name_key) : (it.bucket === 'TEST' ? model.t(o.lang, it.name_key) : exName(model, o, it))) + ')');
  }
  if (o.show_why && (it.why || []).length) L.push('- _' + t('ui.plan.why') + ':_ ' + it.why.map(x => esc(whyText(x, model, o.lang))).join(DOT));
  return L;
}

/** one WOD station: its reps (or calories, written once: '15 cal on the bike, rower or SkiErg', RECHECK 04 major) and its load */
function wodStation(model, o, wod, s, i) {
  const r = wod.station_reps && wod.station_reps[i] ? wod.station_reps[i] : null;
  const ld = wod.station_loads && wod.station_loads[i] ? ' (' + esc(formatLoad(wod.station_loads[i], model, o.lang, o.units)) + ')' : '';
  if (r && r.type === 'calories' && has(model, 'wod.station.calories') && model.rules.conditioning.wod && model.rules.conditioning.wod.calorie_station_generic) return esc(model.t(o.lang, 'wod.station.calories', { n: r.n })) + ld;
  const nm = model.hasEx(s) ? esc(model.t(o.lang, model.ex(s).name_key)) : esc(s);
  const rr = r ? esc(formatReps(r, model, o.lang)) : '';
  return (rr ? rr + ' ' + nm : nm) + ld;
}

function isWallBall(model, it) {
  return !!it.exercise_id && model.hasEx(it.exercise_id) && model.ex(it.exercise_id).tags.includes('wall_ball');
}

// ------------------------------------------------------------------------------------------------------------- refer / invalid

function renderRefer(plan, model, o) {
  const t = T(model, o);
  const L = ['# ' + t('ui.plan.refer_title'), ''];
  const risk = ownRisk(model, o);
  if (risk) L.push(risk, '');
  L.push(t('ui.plan.refer_body'), '');
  for (const r of (plan.refer && plan.refer.reasons) || []) L.push('- ' + t(r));
  L.push('', t('health.refer'), '', '---', '', t('ui.disclaimer'));
  return L.join('\n');
}

function renderInvalid(plan, model, o) {
  const t = T(model, o);
  const L = ['# ' + t('ui.plan.title'), ''];
  const risk = ownRisk(model, o);
  if (risk) L.push(risk, '');
  for (const e of plan.errors || []) {
    // field errors: '{field}: what is wrong' (intake.error.<code>); other issues (release missing, banned inputs) as written
    const ek = 'intake.error.' + e.code;
    if (e.code && model.has('en', ek) && e.key && e.key.startsWith('intake.')) L.push('- ' + t(ek, { ...(e.args || {}), field: model.t(o.lang, e.key) }));
    else L.push('- ' + t(e.key, e.args));
  }
  L.push('', '---', '', t('ui.disclaimer'));
  return L.join('\n');
}
