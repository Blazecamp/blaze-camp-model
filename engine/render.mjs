// engine/render.mjs - plan rendering (engine/CONTRACTS.md §4.11). Owner: B4; v0.4 stage B3 (rendering).
// Markdown (default) or plain text, English or Spanish. Every word comes from model.t; this file holds no user-facing
// words, only punctuation and layout. Phone-friendly: day cards are numbered lists, tables have at most 4 columns
// (the block view has 3). Template notes / dose_text / condition_text are internal hints and are never rendered.
// v0.4 stage B3 (coach_answers_round3.md): every plan opens with the use-at-your-own-risk line linking the release (R3-GEN-01);
// each day says which blocks can be switched off and which supersets save time (R3-SES-02); macro tables (block / week / day)
// for screenshots (R2-GEN-02); nothing about check-ins (R3-VOL-02).
// v0.5 (COACH-CT CT-01, COACH-R4 R4-SES-01): no time check, no schedule offers, no 'over your minutes' lines - a day shows its
// exercise count's result and an estimated time as information only.
// v0.5 / V3 (design/ENGINE_V05_PLAN.md "V3 words and checks"): the release line on every plan and view (COACH-R4 R4-SCP-01 /
// R4-SCP-02); reps and load as a rule the person applies, on every lift and in 'How you progress' (R4-PRG-03); the note on a week
// that adds more than about 15 % (R4-PRG-02); the average time as a range, information only (CT-01, R4-SES-01); what is easiest to
// remove on each day (R4-SES-04); the weekly sets per group week by week; block / week / day macro views (R2-GEN-02).
import { WEEKDAYS, addDays } from './util.mjs';
import { tr, levelText, changesText, stairText, whyText, listAnd, listOr, circuitStory } from './explain.mjs';

const YT = 'https://www.youtube.com/results?search_query=';
const INSTRUCTION_KEYS = ['instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5'];
const DASH = ' — ';
const DOT = ' · ';
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
 *           macro?:boolean, show_why?:boolean, show_swaps?:boolean, units?:'lb'|'kg'}} [opts]
 * @returns {string}
 */
export function renderPlan(plan, model, opts = {}) {
  const o = norm(plan, opts);
  let md;
  if (plan.status === 'refer') md = renderRefer(plan, model, o);
  else if (plan.status === 'invalid') md = renderInvalid(plan, model, o);
  else if (o.view === 'block') md = [ownRiskShort(plan, model, o), ...(plan.shape.training_blocks || []).map(tb => blockView(plan, tb.n, model, o))].join('\n\n');
  // (v0.5 / V3: `macro: true` gives the compact week / day - tables for a screenshot - instead of the full cards, R2-GEN-02)
  else if (o.view === 'week') md = [ownRiskShort(plan, model, o), ...weekNumbers(plan, o).map(n => (o.macro ? weekMacro(plan, n, model, o) : weekSection(plan, n, model, o)))].join('\n\n');
  else if (o.view === 'day') md = [ownRiskShort(plan, model, o), ...weekNumbers(plan, o).flatMap(n => dayList(plan, n).map(d => (o.macro ? dayMacro(plan, n, d, model, o) : dayCard(plan, n, d.weekday, model, o))))].join('\n\n');
  else if (o.view === 'overview') md = overviewView(plan, model, o);
  else md = fullView(plan, model, o);
  return finish(md, o);
}

/** one compact table per training day of a training block: exercises x weeks (sets per week, reps first -> last), stairway levels
 * @param {import('./util.mjs').Plan} plan @param {number} trainingBlock @returns {string} */
export function renderBlockView(plan, trainingBlock, model, opts = {}) {
  const o = norm(plan, opts);
  return finish(blockView(plan, trainingBlock, model, o) + '\n\n' + ownRiskShort(plan, model, o), o);
}

/** @param {import('./util.mjs').Plan} plan @param {number} weekN @returns {string} */
export function renderWeek(plan, weekN, model, opts = {}) {
  const o = norm(plan, opts);
  return finish((o.macro ? weekMacro(plan, weekN, model, o) : weekSection(plan, weekN, model, o)) + '\n\n' + ownRiskShort(plan, model, o), o);
}

/** @param {import('./util.mjs').Plan} plan @param {number} weekN @param {string} weekday @returns {string} */
export function renderDay(plan, weekN, weekday, model, opts = {}) {
  const o = norm(plan, opts);
  const d = o.macro ? dayList(plan, weekN).find(x => x.weekday === weekday) : null;
  const card = o.macro ? (d ? dayMacro(plan, weekN, d, model, o) : '') : dayCard(plan, weekN, weekday, model, o);
  return finish(card ? card + '\n\n' + ownRiskShort(plan, model, o) : '', o);
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
    // v0.5 / V2 (COACH-R4 R4-LIB-02): carries and sled work - by distance or time, never reps
    case 'distance_or_time': return t(rep.per_side ? 'reps.distance_or_time_per_side' : 'reps.distance_or_time', { m_min: rep.metres[0], m_max: rep.metres[1], s_min: rep.seconds[0], s_max: rep.seconds[1] });
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

/** per-set reps that end in the pyramid's light set (rules.reps.pyramid, PRG-07) and the v0.6 words that write it out */
function isPyramid(list, model) {
  const P = model.rules.reps.pyramid;
  const light = P && P.sets && P.sets.length ? P.sets[P.sets.length - 1].reps : null;
  return !!(V6(model).pyramid && Array.isArray(list) && list.length >= 2 && list.every(r => r && r.type === 'fixed') && list[list.length - 1].value === light &&
    model.has('en', 'reps.pyramid_sets') && model.has('en', 'reps.pyramid_short'));
}

function formatSetReps(list, model, lang, sets) {
  const P = model.rules.reps.pyramid;
  // v0.6 words (sample 06 major: '5 x 12/10/8/8/20', '4 x 12/10/8 -20' printed raw; COACH-ANSWER PRG-07 '12, 10, 8, and then 20 ... You
  // drop back to the 20 for a light-weight, high-rep set'): the pyramid written out - '12, 10, 8, then a light back-off set of 20'
  if (isPyramid(list, model)) {
    const light = list[list.length - 1].value;
    const head = list.slice(0, -1).map(r => r.value).join(', ');
    return typeof sets === 'number' ? model.t(lang, 'reps.pyramid_sets', { sets, list: head, last: light }) : model.t(lang, 'reps.pyramid_short', { list: head, last: light });
  }
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
    case 'lb_range': return t(load.unit === 'kettlebell' ? 'wod.load.kettlebell' : load.unit === 'barbell' && model.has('en', 'wod.load.barbell') ? 'wod.load.barbell' : 'wod.load.dumbbells', { min: load.min, max: load.max });
    default: return '';
  }
}

// ------------------------------------------------------------------------------------------------------------- internals

function norm(plan, opts) {
  return {
    lang: opts.lang || plan.lang || 'en', format: opts.format || 'markdown', view: opts.view || 'full', weeks: opts.weeks || 'all',
    macro: !!opts.macro, show_why: !!opts.show_why, show_swaps: opts.show_swaps !== false, units: opts.units || plan.units || 'lb',
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
/** v0.6 words (sample 05 minor: '13.75 / 22.5 sets'): weekly set numbers print as whole sets when rules.render.v6.sets_display says so;
 *  the plan JSON keeps the exact quarter credits */
function fmtSets(model, x) {
  if (typeof x !== 'number') return '–';
  return V6(model).sets_display === 'whole' ? String(Math.round(x)) : fmtNum(x);
}
/** v0.6 G-203 (R4-PRG-04; review r5 07 m11): a group's weekly number as printed - helper credit that takes it less than one set above
 *  the group's final sets of its training block prints as the final sets, so a whole-set table never reads above its 'Final sets' */
function fmtGroupSets(plan, model, w, g, x) {
  if (typeof x !== 'number' || !V6(model).sets_display_cap_final || V6(model).sets_display !== 'whole') return fmtSets(model, x);
  const fin = groupFinalOf(plan, w && w.training_block, g);
  // (v0.6 G-212, review r6 02 m16: a week still under its final sets never prints them - 12.5 of a final 13 prints 12, so the group
  // does not seem to arrive weeks before it does)
  if (V6(model).sets_display_before_final && typeof fin === 'number' && x < fin - 1e-9 && Math.round(x) >= fin) return String(fin - 1);
  return typeof fin === 'number' && x > fin && x - fin < 1 - 1e-9 && Math.round(x) > fin ? String(fin) : fmtSets(model, x);
}
/** the final sets a block prints for a group (what the template holds when it is capped), or null */
function groupFinalOf(plan, tbn, g) {
  const rec = Array.isArray(plan.meta && plan.meta.stairway) ? plan.meta.stairway.find(x => x && x.training_block === tbn) : null;
  if (!rec || (rec.credit_only_groups || []).includes(g)) return null;
  const cap = (rec.capped || []).find(x => x && x.group === g);
  if (cap && typeof cap.held === 'number') return cap.held;
  if (typeof (rec.group_top || {})[g] !== 'number') return null;
  // (a group whose helper credit from lifts that never close - R4-SES-04 - holds a whole set or more above its lowered top prints
  // what the plan really reaches, in whole sets: the class member's shoulders, G-113)
  const real = (rec.realized_top || {})[g];
  return typeof real === 'number' ? Math.max(rec.group_top[g], Math.floor(real + 1e-9)) : rec.group_top[g];
}
/** v0.6 G-202 (CH5-02): a credit-only group that holds an exercise of its own in this week's block (meta.stairway[].held_groups) */
function heldGroup(plan, w, g) {
  const rec = Array.isArray(plan.meta && plan.meta.stairway) ? plan.meta.stairway.find(x => x && w && x.training_block === w.training_block) : null;
  return !!rec && (rec.held_groups || []).includes(g);
}
/** the direct sets a week gives a group (its members' sets as a main mover) */
function directOfGroup(model, w, g) {
  const ms = (model.rules.muscles.groups.members || {})[g] || [g];
  return ms.reduce((a, m) => a + (((w && w.direct_sets_by_muscle) || {})[m] || 0), 0);
}
/** the v0.6 words rules (rules.render.v6), or {} */
function V6(model) { return (model.rules.render && model.rules.render.v6) || {}; }
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

/**
 * The release line (COACH-R3 R3-GEN-01 'use at your own risk'; COACH-R4 R4-SCP-01 'all the plans should release liability before
 * and after it gets kicked out'; R4-SCP-02 'outputted in their program somewhere at the bottom or at the top: you've released
 * liability'): every plan and every view says the terms and the release were accepted before the plan was built, with the link to
 * DISCLAIMER.md / DISCLAIMER.es.md (drafts for attorney review). A refer or invalid result - no plan was built - carries the plain
 * use-at-your-own-risk line. rules.legal.release_line names the keys.
 */
function releaseKeys(plan, model) {
  const RL = (model.rules.legal && model.rules.legal.release_line) || null;
  const st = plan && plan.release_stamp;
  if (!RL || !st || plan.status !== 'ok' || st.accepted !== true) return null;
  const line = (RL.by_version || {})[st.version] || (RL.by_version || {})['release.client'];
  return line && has(model, line) ? { line, short: RL.short_key, footer: RL.footer_key } : null;
}
function legalLink(model, o) {
  const url = disclaimerUrl(model, o);
  return url ? ' [' + T(model, o)('ui.plan.own_risk_link') + '](' + url + ')' : '';
}
function ownRisk(plan, model, o) {
  const t = T(model, o);
  const k = releaseKeys(plan, model);
  if (!k && !has(model, 'ui.plan.own_risk')) return '';
  return '> **' + t('ui.plan.own_risk_label') + '** ' + t(k ? k.line : 'ui.plan.own_risk') + legalLink(model, o);
}
function ownRiskShort(plan, model, o) {
  const k = releaseKeys(plan, model);
  const key = k && has(model, k.short) ? k.short : 'ui.plan.own_risk_short';
  if (!has(model, key)) return '';
  return '_' + T(model, o)(key) + '_' + legalLink(model, o);
}
/** the footer of a full plan: 'Liability released ...' + the standing disclaimer + the link to the full text */
function releaseFooter(plan, model, o) {
  const t = T(model, o);
  const k = releaseKeys(plan, model);
  return (k && has(model, k.footer) ? t(k.footer) + ' ' : '') + t('ui.disclaimer') + legalLink(model, o);
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
  L.push('_' + t('ui.plan.title') + editedTag(plan, model, o) + '_', '');
  const risk = ownRisk(plan, model, o);
  if (risk) L.push(risk, '');
  L.push(...headerLines(plan, model, o), '');
  L.push(...noticesSection(plan, model, o));
  L.push(...instructionBlock(plan, model, o), '');
  L.push(...progressSection(plan, model, o));
  L.push(...adjustGuide(plan, model, o));
  L.push(...addonsSection(plan, model, o));
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
  const L = ['# ' + t(m.program_name_key || 'ui.plan.title'), '_' + t('ui.plan.at_a_glance') + editedTag(plan, model, o) + '_', ''];
  const risk = ownRisk(plan, model, o);
  if (risk) L.push(risk, '');
  L.push(...headerLines(plan, model, o), '');
  L.push(...noticesSection(plan, model, o));
  L.push(...progressSection(plan, model, o));
  L.push(...adjustGuide(plan, model, o));
  L.push(...stairwaySection(plan, model, o), '');
  L.push(...weeklySetsSection(plan, model, o), '');
  // v0.5 / V3: the weekly sets per group, week by week, for every training block (the block macro view)
  for (const tb of plan.shape.training_blocks || []) { const tbl = setsByWeekTable(plan, tb, model, o); if (tbl.length) L.push(...tbl, ''); }
  for (const n of weekNumbers(plan, o).slice(0, 1)) {
    L.push(...weekGlance(plan, n, model, o), '');
    for (const d of dayList(plan, n)) { const tbl = dayTable(plan, n, d, model, o); if (tbl.length) L.push(...tbl, ''); }
  }
  L.push('---', '', '_' + t('ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version }) + '_', '', releaseFooter(plan, model, o));
  return L.join('\n');
}

/** ' · Edited plan' next to the title of a plan the person edited (CX-04; engine/edit.mjs) */
function editedTag(plan, model, o) {
  return plan.edited && has(model, 'ui.plan.edited') ? DOT + T(model, o)('ui.plan.edited') : '';
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
  if (m.weekdays) b(t('intake.days.label'), m.days_per_week + DOT + m.weekdays.map(d => esc(weekdayIn(model, o.lang, d))).join(', ') +
    (m.session_size && has(model, 'ui.plan.session_size') ? DOT + sessionSizeText(plan, model, o) : ''));
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

/**
 * 'about 7 exercises a session' (R4-SES-02). v0.6 words (samples 02 / 03 / 06 minors: 'about 12' over days of 10-11, 'about 7' over days
 * of 8): the real range of the main days' exercise counts (day.exercise_count, every week), else the size the plan was built to
 */
function sessionSizeText(plan, model, o) {
  const t = T(model, o), m = plan.meta || {};
  const counts = [];
  if (V6(model).session_size_from_days) for (const w of plan.weeks || []) for (const d of w.days || []) if (d.kind === 'main' && typeof d.exercise_count === 'number' && d.exercise_count > 0) counts.push(d.exercise_count);
  if (counts.length) {
    const low = Math.min(...counts), high = Math.max(...counts);
    if (low === high || !has(model, 'ui.plan.session_size_range')) return t('ui.plan.session_size', { n: low === high ? low : Math.round((low + high) / 2) });
    return t('ui.plan.session_size_range', { low, high });
  }
  return t('ui.plan.session_size', { n: m.session_size.default, low: m.session_size.range[0], high: m.session_size.range[1] });
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
 * v1.2 (review 07 major 3 / 04 / 08): what the client must know before week 1 - the plan's warnings - comes right after the
 * header, not after week 12. v0.5: the time check, its 'Your schedule' section and the schedule offers are gone (CT-01).
 */
function noticesSection(plan, model, o) {
  const t = T(model, o);
  const shown = (plan.meta && plan.meta.warnings) || [];
  const hol = holidayWeeks(plan);
  // F3 (RECHECK 08 minor: 'Lots of play this week' printed on every jump of every week): said once, up front
  const heavyPlay = has(model, 'ui.plan.heavy_play_plan') && planHasNote(plan, 'note.heavy_play_week');
  // engine 0.6 (COACH-CH5 CH5-01 'team practice doesnt matter, just have the athlete take into account and they handle that'): the plan
  // does not build team practices into the week; a competitive athlete with practice days reads one line to account for them
  const TP = V6(model).team_practice_line;
  const m0 = plan.meta || {};
  const teamPractice = !!(TP && has(model, TP.key) && m0.profile && m0.profile.competitive === 'competitive' && m0.season && typeof m0.season.practice_days === 'number' && m0.season.practice_days > 0);
  const optBonus = optionalBonusLines(plan, model, o);
  if (!shown.length && !hol.length && !heavyPlay && !teamPractice && !optBonus.length) return [];
  const L = [];
  L.push('## ' + t('ui.plan.before_you_start'), '');
  // v0.5 fix round 1 (sample 03 major: the same sentence three times - jumps, ankle hops, cuts): the athletic shortfalls are one line
  const isCap = (w) => /^warning\.athletic_capacity(_block)?$/.test(w.key);
  const caps = shown.filter(isCap);
  const merge = caps.length > 1 && has(model, 'warning.athletic_capacity_list');
  let capDone = false;
  for (const w of shown) {
    if (merge && isCap(w)) {
      if (capDone) continue;
      capDone = true;
      const list = caps.map(c => t((c.args && c.args.key) || 'athletic.key.contacts') + ' ' + (c.args && c.args.pct) + '%').join(', ');
      const act = plan.meta && plan.meta.profile && plan.meta.profile.competitive !== 'competitive' && has(model, 'warning.athletic_capacity_list_activity');
      L.push('- ' + t(act ? 'warning.athletic_capacity_list_activity' : 'warning.athletic_capacity_list', { list }));
      continue;
    }
    const wk = warningKey(plan, w, model);
    L.push('- ' + t(wk, warningArgs(w, model, o, wk)));
  }
  // (RECHECK v0.4 06 / 08 minors: '(or a test day)' in a plan with no tests)
  const testInHol = ((plan.meta && plan.meta.tests && plan.meta.tests.test_days) || []).some(x => hol.includes(x.week)) || (plan.weeks || []).some(w => hol.includes(w.n) && w.test);
  // (v0.6 words, sample 08 minor: 'Las semanas 11, 12 incluyen' - 'weeks 11 and 12' / 'semanas 11 y 12')
  if (hol.length && has(model, 'ui.plan.holiday_weeks')) L.push('- ' + t(!testInHol && has(model, 'ui.plan.holiday_weeks_no_test') ? 'ui.plan.holiday_weeks_no_test' : 'ui.plan.holiday_weeks', { weeks: andList(model, o.lang, hol.map(String)) }));
  if (heavyPlay) L.push('- ' + t('ui.plan.heavy_play_plan'));
  if (teamPractice) L.push('- ' + t(m0.season.practice_days === 1 && has(model, TP.key + '_one') ? TP.key + '_one' : TP.key, { n: m0.season.practice_days }));
  for (const x of optBonus) L.push('- ' + x);
  L.push('');
  return L;
}

/**
 * v0.6 G-204 (COACH-CH5 CH5-03 'they should reach more if needed, no cap until 35'; H10 'said plainly'; review r5 06 m1): a big group
 * whose final sets need the optional days' bonus exercises says so once: how many of its final sets sit there, on which exercises,
 * and where it ends without them. Read on the last week of each stairway block.
 */
function optionalBonusLines(plan, model, o) {
  const OB = V6(model).optional_bonus_line;
  if (!OB || !has(model, OB.key) || plan.status !== 'ok') return [];
  const X = model.rules.muscles;
  const big = (g) => Object.entries((X.lines && X.lines.defs) || {}).some(([, d]) => d && d.group === g && d.class === 'big');
  // v0.6 G-222 (rules.placement.x3.bonus_last; CH5-03; H10 'said plainly'; review r7 02 m16: a Tuesday fly held 3 of chest's 13 final
  // sets and nothing up front said so): a training day's bonus exercise of a group is said the same way, with the week it comes in
  const BLr = model.rules.placement.x3 && model.rules.placement.x3.bonus_last;
  const mainKey = BLr && BLr.enabled && BLr.line_key && has(model, BLr.line_key) ? BLr.line_key : null;
  const out = [];
  for (const rec of (Array.isArray(plan.meta && plan.meta.stairway) ? plan.meta.stairway : [])) {
    const ws = (plan.weeks || []).filter(w => w.training_block === rec.training_block && w.block_type === 'stairway');
    const last = ws[ws.length - 1];
    if (!last) continue;
    const optIds = new Set((rec.bonus || []).map(b => b.slot_id));
    const mainIds = new Set(mainKey ? (rec.main_bonus || []).map(b => b.slot_id) : []);
    for (const g of [...new Set([...(rec.bonus || []), ...(mainKey ? rec.main_bonus || [] : [])].map(b => b.group))]) {
      // (G-208, review r6 08 M1: with rules.render.v6.optional_bonus_line.all_groups every group whose final sets hold an optional day's
      // bonus exercise says so - the shoulders of a 2-day plan too - not only the big groups)
      if (!(OB.all_groups || big(g)) || typeof (rec.group_top || {})[g] !== 'number') continue;
      const its = [];
      for (const d of last.days || []) {
        for (const b of d.blocks || []) for (const it of b.items || []) {
          if (it.origin !== 'bonus' || it.group !== g || typeof it.sets !== 'number' || it.sets <= 0) continue;
          if (d.kind === 'optional' ? optIds.has(it.slot_id) || !mainKey : mainIds.has(it.slot_id)) its.push({ d, it });
        }
      }
      const n = its.reduce((a, x) => a + x.it.sets, 0);
      if (!n) continue;
      const top = rec.group_top[g];
      // (G-217: a bonus that comes in with a later exercise block says from which week)
      const fromOf = (id) => ws.find(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => it.slot_id === id && typeof it.sets === 'number' && it.sets > 0))));
      const exercises = its.map(x => { const f = mainKey && has(model, 'ui.plan.bonus_from_week') ? fromOf(x.it.slot_id) : null; return model.t(o.lang, x.it.name_key || ('exercise.' + x.it.exercise_id + '.name')) + ', ' + weekdayIn(model, o.lang, x.d.weekday) + (f && f !== ws[0] ? model.t(o.lang, 'ui.plan.bonus_from_week', { week: f.n }) : ''); }).join('; ');
      const name = model.t(o.lang, 'group.' + g);
      const onMain = its.some(x => x.d.kind !== 'optional');
      // (G-208: every bonus exercise of the group on one optional day - 'skip that day')
      const oneDay = new Set(its.map(x => x.d.weekday)).size === 1 && has(model, 'ui.plan.optional_bonus_one_day');
      const key = onMain && mainKey ? (its.length > 1 && has(model, mainKey + '_n') ? mainKey + '_n' : mainKey) : oneDay ? 'ui.plan.optional_bonus_one_day' : OB.key;
      out.push(esc(model.t(o.lang, key, { group: name, group_lc: name.charAt(0).toLowerCase() + name.slice(1), n: fmtSets(model, n), top: fmtSets(model, top), exercises, main: fmtSets(model, Math.max(0, Math.min(top, (last.weekly_sets_by_group || {})[g] || top) - n)) })));
    }
  }
  return out;
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

/** a warning's key as printed: a non-competitive profile reads 'this plan's weekly ...' (RECHECK v0.4 08 minor) */
function warningKey(plan, w, model) {
  if (/^warning\.athletic_capacity(_block)?$/.test(w.key) && plan.meta && plan.meta.profile && plan.meta.profile.competitive !== 'competitive' && has(model, w.key + '_activity')) return w.key + '_activity';
  const X = V6(model);
  // v0.6 words (samples 02 / 08 minors: 'trained through your sport work' for an athlete with 0 practice days, and for a pickleball player's
  // biceps): the sport is named only when the client has sport practice days; else the compound lifts
  if (w.key === 'warning.credit_only_groups' && X.credit_only_lifts_key && has(model, X.credit_only_lifts_key)) {
    const m = plan.meta || {};
    const practice = m.season && typeof m.season.practice_days === 'number' ? m.season.practice_days : 0;
    if (!(m.profile && m.profile.competitive === 'competitive' && practice > 0)) return X.credit_only_lifts_key;
  }
  // v0.6 words (sample 08 minor: the pain line promised a note 'on the lift' that no lift carried): the promise only when a lift says so
  if (/^warning\.pain_plan(_plain)?$/.test(w.key) && X.pain_line_no_lift_suffix && has(model, w.key + X.pain_line_no_lift_suffix) &&
      !(X.pain_lift_notes || []).some(k => planHasNote(plan, k))) return w.key + X.pain_line_no_lift_suffix;
  return w.key;
}

/** does any item of the plan carry this note key */
function planHasNote(plan, key) {
  return (plan.weeks || []).some(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => (it.notes || []).some(n => n && n.key === key)))));
}

/** warning args shown to people: equipment tokens by their names (review 05 minor 18) */
function warningArgs(w, model, o, key) {
  const a = { ...(w.args || {}) };
  // (v0.6 words, sample 05 minor: 'pull-up bar, suspension trainer (TRX) would add' / 'agregaría': the options are joined with 'or')
  if (typeof a.items === 'string') a.items = listOr(model, o.lang, a.items.split(',').map(x => x.trim()).filter(Boolean).map(tok => (model.has('en', 'equipment.token.' + tok) ? model.t(o.lang, 'equipment.token.' + tok) : tok)));
  // (v0.6 words, sample 08 minor, R2-GEN-08: 'dolor en rodilla', 'mantiene Cuádriceps' - Spanish takes the area with its article and the
  // muscle groups in lower case inside a sentence)
  if (o.lang === 'es') {
    if (typeof a.area === 'string') { const k = a.area.replace(/^pain\.area\./, 'pain.area_def.'); if (k !== a.area && has(model, k)) a.area = k; }
    for (const name of ['group', 'groups']) {
      if (a[name] === undefined || a[name] === null) continue;
      const ids = (Array.isArray(a[name]) ? a[name] : [a[name]]).map(x => String(x).replace(/^group\./, ''));
      if (!ids.every(g => has(model, 'group.' + g))) continue;
      const lead = key && String(model.t(o.lang, key)).startsWith('{' + name + '}');
      const words = ids.map((g, i) => { const s0 = model.t(o.lang, 'group.' + g); return lead && i === 0 ? s0 : s0.charAt(0).toLowerCase() + s0.slice(1); });
      a[name] = andList(model, o.lang, words);
    }
  }
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
  const one = days.length === 1 && !days.circuit && has(model, 'effort.drift_intensifier_days_one');
  if (iw.length && days.length && has(model, 'effort.drift_intensifier_days')) s += ' ' + t(one ? 'effort.drift_intensifier_days_one' : days.circuit ? 'effort.drift_intensifier_days_circuit' : 'effort.drift_intensifier_days', { week: iw.join(', '), days: days.slice() });
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
  // v0.6 words (sample 04 minor: 'WODs will be prescribed by your box' - his competitor copy - printed for a class member whose plan writes its
  // own WODs): a client who does not compete reads the class-member line (rules.render.v6.class_member_instruction; PROPOSED wording)
  const CMI = V6(model).class_member_instruction;
  if (famKeys && CMI && CMI.family === m.family && !(CMI.unless_competitive && m.profile && m.profile.competitive === 'competitive')) keys = keys.map(k => (CMI.replace[k] && has(model, CMI.replace[k]) ? CMI.replace[k] : k));
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
  // (v0.6 words, sample 08 minor: 'your cardio sessions sit on lifting days' when the only cardio sits on the optional day)
  const cardioDays = (kind) => [...new Set((plan.weeks || []).flatMap(w => (w.days || []).filter(d => d.kind === kind && (d.blocks || []).some(b => b.kind === 'aerobic' && (b.items || []).length)).map(d => d.weekday)))];
  const onMain = cardioDays('main'), onOptional = cardioDays('optional');
  if (!famKeys && aerobicItems && !aerobicOnly && !onMain.length && onOptional.length && has(model, 'instruction.2_bridge_optional')) {
    L.push('', '_' + esc(tr(model, o.lang, 'instruction.2_bridge_optional', { days: WEEKDAYS.filter(x => onOptional.includes(x)) })) + '_');
  } else if (!famKeys && aerobicItems && !aerobicOnly && has(model, 'instruction.2_bridge')) L.push('', '_' + t('instruction.2_bridge') + '_');
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
    const sup = o.show_supersets && (plan.weeks || []).some(w => (w.days || []).some(d => (d.superset_recommendations || []).length || d.supersets_on));
    const tail = has(model, 'guide.adjust.edit_supersets') && sup ? ' ' + t('guide.adjust.edit_supersets') : '';
    // (a block name with a comma inside - 'jumps, throws and speed' - keeps the list readable with semicolons)
    const blocks = names.some(x => x.includes(',')) ? names.join('; ') : andList(model, o.lang, names);
    L.push('- ' + (names.length ? esc(model.t(o.lang, 'guide.adjust.edit_blocks', { blocks })) : t('guide.adjust.edit_none')) + tail);
    const acc = kinds.includes('accessories') ? accessoryOnlyGroups(plan, model) : [];
    // (v0.6, review r5 08 m15 / R2-GEN-08: Spanish group names in lower case inside the sentence)
    const accName = (g) => { const w = model.t(o.lang, 'group.' + g); return o.lang === 'es' ? w.charAt(0).toLowerCase() + w.slice(1) : w; };
    if (acc.length && has(model, 'guide.adjust.accessories')) L.push('- ' + esc(model.t(o.lang, 'guide.adjust.accessories', { groups: andList(model, o.lang, acc.map(accName)) })));
    if ((plan.weeks || []).some(w => (w.days || []).some(d => (d.toggle_items || []).length)) && has(model, 'guide.adjust.edit_stations')) L.push('- ' + t('guide.adjust.edit_stations'));
  } else if (has(model, 'guide.adjust.edit')) L.push('- ' + t('guide.adjust.edit'));
  // v0.5 / V3 (COACH-CX CX-02 / CX-04 'they should be able to edit ... on that week or that day'): the sets are editable too; and
  // the time on each day is an average estimate, information only (COACH-CT CT-01, COACH-R4 R4-SES-01)
  if (has(model, 'guide.adjust.sets')) L.push('- ' + t('guide.adjust.sets'));
  const anyEst = (plan.weeks || []).some(w => (w.days || []).some(d => typeof d.est_minutes === 'number' && ['main', 'optional'].includes(d.kind)));
  const anyEasy = (plan.weeks || []).some(w => (w.days || []).some(d => (d.easy_to_remove || []).length));
  if (anyEst && has(model, 'guide.adjust.time')) L.push('- ' + t(anyEasy || !has(model, 'guide.adjust.time_no_list') ? 'guide.adjust.time' : 'guide.adjust.time_no_list'));
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
      // v0.5 / V3 (COACH-R4 R4-PRG-02): a week that adds more than about 15 % is marked
      const wk = String(w.n) + (accelOf(w).length && accelMark(model) ? ' ' + accelMark(model) : '') + (w.test ? DOT + t('ui.plan.test_mark') : '');
      const rir = w.planned_rir ? (w.planned_rir.min === w.planned_rir.max ? String(w.planned_rir.min) : w.planned_rir.min + '-' + w.planned_rir.max) : null;
      const eff = rir ? t('ui.plan.rir_short', { rir }) + (iw.has(w.n) ? ' ' + t('ui.plan.plus_intensifier') : '') : '–';
      // the week's sets as the weekly sets table counts them (main and optional days)
      const sets = circuit && w.circuit ? t('ui.plan.seconds', { n: w.circuit.work_s }) : fmtSets(model, w.total_resistance_sets);
      L.push('| ' + [wk, lvl, eff, sets].join(' | ') + ' |');
    }
    if (ws.some(w => accelOf(w).length) && accelMark(model) && has(model, 'ui.plan.accel_legend')) L.push('', '_' + t('ui.plan.accel_legend', { mark: accelMark(model) }) + '_');
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
  L.push('## ' + t(byGroup ? 'ui.plan.weekly_sets_groups' : 'ui.plan.weekly_sets'), '', '_' + t(byGroup ? 'ui.plan.weekly_sets_groups_note' : 'ui.plan.weekly_sets_note') + roundedNote(model, o, picks) + '_', '');
  // v0.6 G-211 (review r6 02 m15): the legend of a '-' cell and of a '(n direct)' cell, added to the note only when the table prints one
  const noteAt = L.length - 2;
  const SL = byGroup ? V6(model).sets_legend : null;
  let dashUsed = false, directUsed = false;
  L.push('| ' + ['', ...picks.map(w => t('ui.plan.week', { n: w.n }))].join(' | ') + ' |', '|' + '---|'.repeat(picks.length + 1));
  if (byGroup) {
    // F3 (RECHECK 01 / 04 / 08 minors: the legend promised '-' rows the table never printed; a credit-only group showed sets next to
    // '-' for the others; the class lifts' sets appeared in no row): every FOCUS group has a row - trained directly: its sets; not
    // trained directly: '-' (with the sets it still gets from other lifts or a kept pattern in brackets); a class lift: '3 (class lift)'
    const allRows = has(model, 'ui.plan.sets_not_direct');
    for (const g of model.rules.muscles.groups.order.filter(x => x !== 'core')) {
      const vals = picks.map(w => (w.weekly_sets_by_group || {})[g]);
      // v0.5: a group with no exercise of its own in the template gets its work from the other lifts (credit only)
      // (v0.6 G-202, CH5-02: a group with an exercise of its own - the arm slot - is not 'no exercise of its own': its sets, with its
      // direct sets)
      const HG = V6(model).held_groups;
      const held = (w) => !!HG && heldGroup(plan, w, g) && directOfGroup(model, w, g) > 0;
      const ntOf = (w) => ((w.credit_only_groups || []).includes(g) && !held(w) ? { group: g, reason: 'credit_only' } : null);
      if (!vals.some(v => typeof v === 'number' && v > 0) && !(allRows && picks.some(w => ntOf(w)))) continue;
      const cell = (w, v) => {
        const nt = ntOf(w);
        if (!nt && held(w) && has(model, HG.cell_key)) {
          const a = { n: fmtGroupSets(plan, model, w, g, v), direct: fmtSets(model, directOfGroup(model, w, g)) };
          if (!directUsed) directUsed = { ...a, cell: t(HG.cell_key, a) };
          return a.cell || t(HG.cell_key, a);
        }
        if (!nt) return fmtGroupSets(plan, model, w, g, v);
        dashUsed = true;
        if (!allRows) return '-';
        if (!(typeof v === 'number' && v > 0)) return '-';
        return nt.reason === 'class_lift' && has(model, 'ui.plan.sets_class_lift') ? t('ui.plan.sets_class_lift', { n: fmtSets(model, v) }) : t('ui.plan.sets_not_direct', { n: fmtSets(model, v) });
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
        if (mv.some(v => typeof v === 'number')) L.push('| ' + [t('ui.plan.focus_row', { muscle: 'muscle.' + c }), ...mv.map(v => fmtSets(model, v))].join(' | ') + ' |');
      }
    }
  } else {
    for (const mu of model.rules.muscles.order) {
      const vals = picks.map(w => (w.weekly_sets_by_muscle || {})[mu]);
      if (!vals.some(v => typeof v === 'number' && v > 0)) continue;
      L.push('| ' + [t('muscle.' + mu), ...vals.map(v => fmtSets(model, v))].join(' | ') + ' |');
    }
  }
  if (SL) {
    const add = [dashUsed && has(model, SL.dash_key) ? t(SL.dash_key) : null, directUsed && has(model, SL.direct_key) ? t(SL.direct_key, directUsed) : null].filter(Boolean);
    if (add.length) L[noteAt] = L[noteAt].replace(/_$/, ' ' + add.join(' ') + '_');
  }
  L.push('| **' + t('ui.plan.total') + '** | ' + picks.map(w => '**' + fmtSets(model, w.total_resistance_sets) + '**').join(' | ') + ' |');
  if (picks.some(w => w.circuit && typeof w.circuit.work_s === 'number') && has(model, 'ui.plan.work_seconds_row')) {
    L.push('| ' + [t('ui.plan.work_seconds_row'), ...picks.map(w => (w.circuit ? t('ui.plan.seconds', { n: w.circuit.work_s }) : '–'))].join(' | ') + ' |');
    const cs = V6(model).circuit_from_weeks ? circuitStory(plan, model, o.lang) : null;
    if (cs && has(model, 'ui.plan.circuit_climb_note_v6')) L.push('', '_' + esc(cs.flat ? model.t(o.lang, 'ui.plan.circuit_climb_note_v6_flat', { rounds: cs.rounds, s: cs.from }) : model.t(o.lang, 'ui.plan.circuit_climb_note_v6', { rounds: cs.rounds, when: cs.when })) + '_');
    else L.push('', '_' + t('ui.plan.circuit_climb_note') + '_');
  }
  return L;
}

/** ' Numbers are rounded to whole sets.' when the table prints whole sets and a week holds a quarter or half set (v0.6 words) */
function roundedNote(model, o, weeks) {
  if (V6(model).sets_display !== 'whole' || !has(model, 'ui.plan.sets_rounded')) return '';
  const frac = (x) => typeof x === 'number' && Math.abs(x - Math.round(x)) > 1e-9;
  const any = (weeks || []).some(w => frac(w.total_resistance_sets) || Object.values(w.weekly_sets_by_group || {}).some(frac) || Object.values(w.weekly_sets_by_muscle || {}).some(frac));
  return any ? ' ' + T(model, o)('ui.plan.sets_rounded') : '';
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
  // F3 (RECHECK 08 minor: 'Full terms: Disclaimer and Release of Liability.' with no link): the footer links the full text;
  // v0.5 / V3 (R4-SCP-02): and says the liability was released before the plan was built
  L.push('---', '', '_' + t('ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version }) + '_', '', releaseFooter(plan, model, o), '', t('video.note'));
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

// ------------------------------------------------------------------------------------------------------------- v0.5 / V3 lines

/** the mark of a week that adds more than about 15 % (rules.render.acceleration.mark), or '' */
function accelMark(model) {
  const A = model.rules.render && model.rules.render.acceleration;
  return A && typeof A.mark === 'string' ? A.mark : '';
}
/** the acceleration entries of a week (COACH-R4 R4-PRG-02; volume engine: {group, from, to, pct} or {total: true, pct}) */
function accelOf(w) { return Array.isArray(w && w.acceleration) ? w.acceleration.filter(Boolean) : []; }
/** 'This week jumps more than usual (17 % more sets for Shoulders): adjust if needed.' - one line per entry */
function accelLines(w, model, o, plan) {
  const t = T(model, o), out = [];
  // v0.6 words (sample 05 minor: eight near-identical 'This week jumps more than usual' lines in one week; R4-PRG-02 'a clear note'): one
  // line per week and step size, the groups listed; a circuit week that added a round says so
  if (V6(model).accel_one_line && has(model, 'ui.plan.accel_week_groups')) {
    const groups = accelOf(w).filter(a => a.group);
    const totals = accelOf(w).filter(a => a.total);
    if (groups.length) {
      // engine 0.6 integration (G-191): one line for the whole week, whatever the step of each group; groups with different steps
      // print the range ('17-25 % more sets for Quads, Back and Shoulders')
      const gs = [...new Set(groups.map(a => a.group))];
      const pcts = groups.map(a => a.pct).filter(x => typeof x === 'number');
      const lo = Math.min(...pcts), hi = Math.max(...pcts);
      const pct = !pcts.length ? '' : lo === hi ? lo : lo + '-' + hi;
      const pw = plan ? weekOf(plan, w.n - 1) : null;
      const roundUp = !!(w.circuit && pw && pw.circuit && typeof w.circuit.rounds === 'number' && w.circuit.rounds > pw.circuit.rounds);
      const trained = Object.entries(w.weekly_sets_by_group || {}).filter(([g, v]) => g !== 'core' && typeof v === 'number' && v > 0).map(([g]) => g);
      if (lo === hi && roundUp && trained.every(g => gs.includes(g)) && has(model, 'ui.plan.accel_week_all_round')) { out.push(t('ui.plan.accel_week_all_round', { pct })); return out; }
      const names = gs.map(g => { const s0 = model.t(o.lang, 'group.' + g); return o.lang === 'es' ? s0.charAt(0).toLowerCase() + s0.slice(1) : s0; });
      out.push(esc(model.t(o.lang, 'ui.plan.accel_week_groups', { pct, groups: andList(model, o.lang, names) })));
      return out;
    }
    for (const a of totals) if (has(model, 'ui.plan.accel_week_total')) out.push(t('ui.plan.accel_week_total', { pct: a.pct }));
    return out;
  }
  for (const a of accelOf(w)) {
    if (a.total && has(model, 'ui.plan.accel_week_total')) out.push(t('ui.plan.accel_week_total', { pct: a.pct }));
    else if (a.group && has(model, 'ui.plan.accel_week')) out.push(t('ui.plan.accel_week', { pct: a.pct, group: 'group.' + a.group }));
  }
  return out;
}

/**
 * The average time of a day as words (COACH-CT CT-01 'we can give an average recommendation of what it should take, but we will
 * never know'; COACH-R4 R4-SES-01 'an estimate like about 60-75 minutes ... as information only'): a range around the estimate
 * (rules.render.estimate: 10 % each way, rounded to 5 min). `line` = the day card's sentence, else the table cell.
 */
function estRange(model, min) {
  const E = model.rules.render && model.rules.render.estimate;
  if (!E || !Array.isArray(E.range_factor) || !(E.round_to_min > 0)) return null;
  const r = E.round_to_min;
  const low = Math.max(r, Math.round(min * E.range_factor[0] / r) * r), high = Math.round(min * E.range_factor[1] / r) * r;
  return high > low ? { low, high } : null;
}
function estText(model, o, min, line) {
  const t = T(model, o), r = estRange(model, min);
  if (r && has(model, line ? 'ui.plan.est_line' : 'ui.plan.est_range')) return t(line ? 'ui.plan.est_line' : 'ui.plan.est_range', r);
  return line && has(model, 'ui.plan.est_line_one') ? t('ui.plan.est_line_one', { min }) : t('ui.plan.est_minutes', { min });
}

/**
 * 'Easiest to remove if you want a shorter day (your choice): finisher: X · small-muscle accessories: A, B' (COACH-R4 R4-SES-04).
 * The day's own list (day.easy_to_remove, in the order of rules.session.easy_to_remove), by kind; nothing is removed for the person.
 */
function easyToRemoveLine(d, model, o) {
  const E = model.rules.render && model.rules.render.easy_to_remove;
  const list = (d.easy_to_remove || []).filter(x => x && x.slot_id);
  if (!E || !list.length || !has(model, 'ui.plan.easy_to_remove_line')) return '';
  const all = (d.blocks || []).flatMap(b => (b.on === false ? [] : (b.items || [])));
  const shown = [];
  for (const x of list) { const it = all.find(i => i.slot_id === x.slot_id); if (it) shown.push({ kind: x.kind, name: exName(model, o, it) }); }
  if (!shown.length) return '';
  const max = typeof E.max_listed === 'number' ? E.max_listed : shown.length;
  const kinds = [];
  for (const x of shown.slice(0, max)) { let k = kinds.find(y => y.kind === x.kind); if (!k) { k = { kind: x.kind, names: [] }; kinds.push(k); } if (!k.names.includes(x.name)) k.names.push(x.name); }
  const parts = kinds.map(k => { const key = (E.kind_keys || {})[k.kind]; return (key && has(model, key) ? model.t(o.lang, key) + ': ' : '') + k.names.join(', '); });
  if (shown.length > max && has(model, 'ui.plan.easy_more')) parts.push(model.t(o.lang, 'ui.plan.easy_more', { n: shown.length - max }));
  return esc(model.t(o.lang, 'ui.plan.easy_to_remove_line', { list: parts.join(DOT) }));
}

/** the planned reps in the tank of an item as words ('3', '1-2'): its own effort, else the week's planned effort, else the rule's default */
function rirWords(it, w, model) {
  const e = it.effort;
  if (e && e.type === 'rir' && typeof e.min === 'number') return e.min === e.max ? String(e.min) : e.min + '-' + e.max;
  const p = w && w.planned_rir;
  if (p && typeof p.min === 'number') return p.min === p.max ? String(p.min) : p.min + '-' + p.max;
  const P = model.rules.render && model.rules.render.progression;
  return (P && P.rir_default) || '1-2';
}

/**
 * How a lift progresses, as the rule the person applies (COACH-R4 R4-PRG-03: '3 sets of 8-12. When you hit 12 on every set with
 * 1-2 reps left in the tank, add weight next time and start again at 8.' - never a promise like 'week 3: 12 reps'). Written from
 * item.progression (engine/progression/prescription.mjs progressionRule); a lift with its reps written per set (the pyramid) reads
 * 'the written reps'.
 */
function progressionLine(it, w, model, o) {
  const P = model.rules.render && model.rules.render.progression;
  const pr = it.progression;
  if (!P || !P.per_item || !pr || pr.promised_numbers !== false || !Array.isArray(pr.rep_range)) return '';
  const base = it.set_reps ? P.keys.written_reps : P.keys[pr.kind];
  if (!base) return '';
  const side = !it.set_reps && it.reps && it.reps.type === 'per_side' && has(model, base + (P.per_side_suffix || '_side'));
  const key = side ? base + (P.per_side_suffix || '_side') : base;
  if (!has(model, key)) return '';
  return T(model, o)(key, { low: pr.rep_range[0], high: pr.rep_range[1], rir: rirWords(it, w, model) });
}

/**
 * 'How you progress' (COACH-R4 R4-PRG-03 / R4-PRG-02 / R4-PRG-04, COACH-CX CX-02 .. CX-04): the rule for reps and weight with an
 * example from the plan, what the sets do, the weeks that add more than usual, where the next block starts, and that the plan is
 * an editable template.
 */
function progressSection(plan, model, o) {
  const t = T(model, o);
  const P = model.rules.render && model.rules.render.progression;
  if (!P || !P.section || plan.status !== 'ok' || !has(model, 'ui.plan.progress_title')) return [];
  const weeks = plan.weeks || [];
  const stair = weeks.filter(w => w.block_type === 'stairway');
  const L = ['## ' + t('ui.plan.progress_title'), ''];
  // the example: the first lift of the plan with a rep range (a main lift first)
  let ex = null;
  // (v0.6 words, sample 01 minor: 'Front Squat (barbell), 1 sets of 8-10' - a test week's back-off set): the example comes from a week with no
  // test and has 2 or more sets; the old pick is the fallback
  const pick = (ws, minSets) => {
    for (const w of ws) {
      if (minSets > 1 && w.test) continue;
      const its = dayListOf(w).flatMap(d => (d.blocks || []).flatMap(b => (b.on === false ? [] : (b.items || []))));
      const ok = (it) => it.progression && it.progression.kind === 'double_progression' && !it.set_reps && it.name_key && typeof it.sets === 'number' && it.sets >= minSets && !(minSets > 1 && it.test);
      const found = its.find(it => ok(it) && it.role === 'work') || its.find(ok) || null;
      if (found) return found;
    }
    return null;
  };
  const pool = stair.length ? stair : weeks;
  ex = pick(pool, 3) || pick(pool, 2) || pick(pool, 1);
  const anyRule = weeks.some(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => it.progression))));
  if (ex && has(model, 'ui.plan.progress_rule')) L.push('- ' + esc(model.t(o.lang, 'ui.plan.progress_rule', { exercise: exName(model, o, ex), sets: ex.sets, low: ex.progression.rep_range[0], high: ex.progression.rep_range[1] })));
  else if (anyRule && has(model, 'ui.plan.progress_rule_plain')) L.push('- ' + t('ui.plan.progress_rule_plain'));
  const circuit = weeks.some(w => w.circuit && typeof w.circuit.work_s === 'number');
  // v0.6 words (sample 05 major: 'the rounds stay and the work time climbs week by week' over a plan that adds a round in week 7 and steps
  // the time every second week): the line is built from the weeks' own rounds and work seconds (explain.circuitStory)
  const cs = circuit && V6(model).circuit_from_weeks ? circuitStory(plan, model, o.lang) : null;
  if (cs && has(model, 'ui.plan.progress_circuit_v6')) L.push('- ' + esc(cs.flat ? model.t(o.lang, 'ui.plan.progress_circuit_v6_flat', { rounds: cs.rounds, s: cs.from }) : model.t(o.lang, 'ui.plan.progress_circuit_v6', { rounds: cs.rounds, from: cs.from, to: cs.to, when: cs.when })));
  else if (circuit && has(model, 'ui.plan.progress_circuit')) L.push('- ' + t('ui.plan.progress_circuit'));
  const climbs = stair.length > 1 && stair.some(w => typeof w.total_resistance_sets === 'number' && w.total_resistance_sets !== stair[0].total_resistance_sets);
  if (!circuit) L.push('- ' + t(climbs || !has(model, 'ui.plan.progress_sets_flat') ? 'ui.plan.progress_sets' : 'ui.plan.progress_sets_flat'));
  const fast = weeks.filter(w => accelOf(w).length).map(w => w.n);
  const A = model.rules.render.acceleration;
  if (fast.length && A && has(model, 'ui.plan.progress_accel')) L.push('- ' + t(fast.length === 1 && has(model, 'ui.plan.progress_accel_one') ? 'ui.plan.progress_accel_one' : 'ui.plan.progress_accel', { mark: A.mark, pct: Math.round(100 * A.above), weeks: weekRuns(fast) }));
  const NB = model.rules.cycles && model.rules.cycles.next_block;
  if (stair.length && !circuit && NB && NB.multiplier && has(model, 'ui.plan.progress_next')) L.push('- ' + t('ui.plan.progress_next', { pct: Math.round(100 * (NB.multiplier.numerator / NB.multiplier.denominator - 1)) }));
  if (has(model, 'ui.plan.progress_edit')) L.push('- ' + t('ui.plan.progress_edit'));
  L.push('');
  return L.length > 3 ? L : [];
}
function dayListOf(w) { return (w.days || []).slice().sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday)); }

/**
 * The weekly sets per muscle group of one training block, week by week (design/ENGINE_V05_PLAN.md 'How volume is allocated' step 4:
 * 'the plan prints weekly sets per group'): group | the sets of each week, counted from the plan's own exercises (a dot between
 * exercise blocks) | the final sets the stairway is planned to reach. A group the template cannot take to the planned number reads
 * '23 of 25' (R4-SES-04: said, never hidden); a group with no exercise of its own says so. Three columns: phone-friendly.
 */
function setsByWeekTable(plan, tb, model, o) {
  const t = T(model, o);
  if (!has(model, 'ui.plan.sets_by_week_title')) return [];
  const weeks = (plan.weeks || []).filter(w => w.training_block === tb.n);
  if (weeks.length < 2 || !weeks.some(w => w.weekly_sets_by_group && Object.keys(w.weekly_sets_by_group).length)) return [];
  const rec = (Array.isArray(plan.meta && plan.meta.stairway) ? plan.meta.stairway.find(x => x && x.training_block === tb.n) : null) || null;
  const ebs = (plan.shape.exercise_blocks || []).filter(e => e.training_block === tb.n);
  const chunks = ebs.length ? ebs.map(e => weeks.filter(w => w.n >= e.weeks[0] && w.n <= e.weeks[1])).filter(c => c.length) : [weeks];
  const row = (get, g) => chunks.map(c => c.map(w => (g ? fmtGroupSets(plan, model, w, g, get(w)) : fmtSets(model, get(w)))).join(' ')).join(DOT);
  const rows = [];
  let example = null;
  for (const g of model.rules.muscles.groups.order.filter(x => x !== 'core')) {
    const vals = weeks.map(w => (w.weekly_sets_by_group || {})[g]);
    if (!vals.some(v => typeof v === 'number' && v > 0)) continue;
    let fin = '–';
    if (rec) {
      const cap = (rec.capped || []).find(x => x && x.group === g);
      const HG = V6(model).held_groups;
      const last = weeks[weeks.length - 1];
      // (v0.6 G-202, CH5-02: a credit-only group that holds the arm slot reads 'held: n direct sets a week', not 'no exercise of its own')
      if (HG && (rec.held_groups || []).includes(g) && has(model, HG.final_key)) fin = t(HG.final_key, { direct: fmtSets(model, directOfGroup(model, last, g)) });
      else if ((rec.credit_only_groups || []).includes(g)) fin = has(model, 'ui.plan.final_credit_only') ? t('ui.plan.final_credit_only') : '–';
      else if (cap && has(model, 'ui.plan.final_capped')) { fin = t('ui.plan.final_capped', { held: fmtSets(model, cap.held), planned: fmtSets(model, cap.planned) }); if (!example) example = cap; }
      else if (typeof (rec.group_top || {})[g] === 'number') fin = fmtSets(model, V6(model).sets_display_cap_final ? groupFinalOf(plan, tb.n, g) : rec.group_top[g]);
    }
    rows.push([t('group.' + g), row(w => (w.weekly_sets_by_group || {})[g], g), fin]);
  }
  if (!rows.length) return [];
  // a block with no stairway of sets (a timed circuit, a maintenance or pre-season block) has no final sets to show: two columns
  const finals = rows.some(r => r[2] !== '–') || !has(model, 'ui.plan.sets_by_week_note_flat');
  const L = ['### ' + t('ui.plan.sets_by_week_title') + DOT + t('ui.plan.week', { n: tb.weeks[0] + '-' + tb.weeks[1] }), ''];
  L.push('_' + (!finals ? t('ui.plan.sets_by_week_note_flat') : example ? t('ui.plan.sets_by_week_note', { held: fmtSets(model, example.held), planned: fmtSets(model, example.planned) }) : t('ui.plan.sets_by_week_note_plain')) + roundedNote(model, o, weeks) + '_', '');
  const head = [t('ui.plan.col.group'), t('ui.plan.col.sets_by_week', { from: tb.weeks[0], to: tb.weeks[1] }), ...(finals ? [t('ui.plan.col.final_sets')] : [])];
  L.push('| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|');
  for (const r of rows) L.push('| ' + (finals ? r : r.slice(0, 2)).join(' | ') + ' |');
  L.push('| **' + t('ui.plan.total') + '** | ' + row(w => w.total_resistance_sets) + (finals ? ' | ' + fmtSets(model, weeks[weeks.length - 1].total_resistance_sets) : '') + ' |');
  return L;
}

/**
 * The week macro view (COACH-R2 R2-GEN-02 'the macro view of the week ... they can screenshot 1 week and send it over'): the week's
 * level and notes, its sets per muscle group in one line, the days at a glance and one compact table per training day.
 */
function weekMacro(plan, n, model, o) {
  const t = T(model, o), w = weekOf(plan, n);
  if (!w) return '';
  const L = ['## ' + t(has(model, 'ui.plan.week_macro') ? 'ui.plan.week_macro' : 'ui.plan.week', { n }) + DASH + t(w.phase_key), ''];
  const st = stairText(plan, n, model, o.lang);
  if (st) L.push('_' + esc(st) + '_', '');
  if (w.test) L.push('**' + t(testHeaderKey(w, model)) + '** (' + (w.test.items || []).map(i => t('tests.' + i)).join(', ') + ')', '');
  for (const a of accelLines(w, model, o, plan)) L.push('_' + a + '_', '');
  const sets = model.rules.muscles.groups.order.filter(g => g !== 'core' && typeof (w.weekly_sets_by_group || {})[g] === 'number' && w.weekly_sets_by_group[g] > 0)
    .map(g => t('group.' + g) + ' ' + fmtGroupSets(plan, model, w, g, w.weekly_sets_by_group[g]));
  if (sets.length && has(model, 'ui.plan.sets_this_week')) L.push('**' + t('ui.plan.sets_this_week') + ':** ' + [...sets, t('ui.plan.total') + ' ' + fmtSets(model, w.total_resistance_sets)].join(DOT), '');
  const ab = athleticLine(plan, w, model, o);
  if (ab) L.push(ab, '');
  const glance = weekGlance(plan, n, model, o);
  if (glance.length) L.push(...glance, '');
  for (const d of dayList(plan, n)) { const tbl = dayTable(plan, n, d, model, o); if (tbl.length) L.push(...tbl, ''); }
  return L.join('\n');
}

/** the day macro view: the day's compact table (exercise | sets x reps | effort) with its average time */
function dayMacro(plan, n, d, model, o) {
  const tbl = dayTable(plan, n, d, model, o);
  if (!tbl.length) return '';
  const L = [tbl[0]];
  if (typeof d.est_minutes === 'number') L.push('_' + T(model, o)('ui.plan.week', { n }) + DOT + estText(model, o, d.est_minutes, true) + '_');
  L.push(...tbl.slice(1));
  return L.join('\n');
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
    const mins = typeof d.est_minutes === 'number' ? estText(model, o, d.est_minutes, false) : '–';
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
  // (v0.6 words, sample 03 minor: 'Block · Training block' - the label already says it is a block)
  const viewWord = t('ui.plan.view.block'), label = t(tb.label_key);
  const wks = t('ui.plan.week', { n: tb.weeks[0] + '-' + tb.weeks[1] });
  const dup = label.toLowerCase().includes(viewWord.toLowerCase());
  const L = ['## ' + (dup && has(model, 'ui.plan.block_view_title') ? model.t(o.lang, 'ui.plan.block_view_title', { label, weeks: wks }) : (dup ? '' : viewWord + DOT) + label + DOT + wks), ''];
  const levels = weeks.filter(w => typeof w.stair_level === 'number');
  if (levels.length) L.push('**' + t('ui.plan.level') + ':** ' + levels.map(w => w.stair_level.toFixed(1)).join(DOT), '');
  // v0.5 / V3: the block's weekly sets per muscle group, week by week (design/ENGINE_V05_PLAN.md 'the plan prints weekly sets per group')
  const byWeek = setsByWeekTable(plan, tb, model, o);
  if (byWeek.length) L.push(...byWeek, '');
  const days = new Map();
  for (const w of weeks) for (const d of w.days || []) {
    if (!['main', 'optional'].includes(d.kind)) continue;
    if (!days.has(d.weekday)) days.set(d.weekday, d);
  }
  for (const wd of WEEKDAYS.filter(x => days.has(x))) {
    const d0 = days.get(wd);
    const rows = new Map();
    // v0.5 / V4: the rows stand in session order. A station that first appears in a later week (a jump station a baseline test
    // replaced in week 1, an ankle day that opens with its exercise block) is listed where it sits in the session - after the
    // station that precedes it that week - never at the bottom of the table, where it read as work done after the lifts
    const order = [];
    for (const w of weeks) {
      const d = (w.days || []).find(x => x.weekday === wd);
      if (!d) continue;
      let prev = null;
      for (const b of d.blocks || []) for (const it of b.items || []) {
        // B3 (RECHECK 03 major: a test-only row with dashes): tests are not stairway sets, they are written in their weeks
        if (['warmup', 'cooldown', 'aerobic'].includes(b.kind) || !(it.name_key || it.wod) || it.role === 'test' || it.bucket === 'TEST') continue;
        if (!rows.has(it.slot_id)) {
          rows.set(it.slot_id, { names: [], sets: new Map(), reps: [], byEb: new Map(), circuit: [] });
          order.splice(prev === null ? 0 : order.indexOf(prev) + 1, 0, it.slot_id);
        }
        prev = it.slot_id;
        const r = rows.get(it.slot_id);
        const nm = esc(exName(model, o, it));
        if (!r.names.includes(nm)) r.names.push(nm);
        r.sets.set(w.n, it.sets);
        const rp = esc(itemDose(model, o, it, { short: true }));
        if (rp && !r.reps.includes(rp)) r.reps.push(rp);
        // (fix round 2 / F3; RECHECK v0.4 06 / 07 minors: 'A -> B' hid a slot that went A, B, A or A, A-detail, A): the name and the reps
        // of each exercise block, in order
        if (!r.byEb.has(w.exercise_block)) r.byEb.set(w.exercise_block, { name: nm, reps: rp });
        // (v0.6 words, sample 05 major: '4 rounds x 35 s -> 4 rounds x 45 s' over a block that ends at 5 rounds x 50 s): a circuit station's
        // dose reads from its first week to its last
        if (it.circuit && V6(model).circuit_from_weeks) r.circuit.push(esc(formatReps({ type: 'rounds_work', rounds: it.circuit.rounds, work_s: it.circuit.work_s }, model, o.lang)));
      }
    }
    if (!rows.size) continue;
    L.push('### ' + t('weekday.' + wd) + DOT + esc(dayTitle(plan, d0, model, o)), '');
    L.push('| ' + t('ui.plan.exercise') + ' | ' + t('ui.plan.sets') + ' | ' + t('ui.plan.reps') + ' |', '|---|---|---|');
    for (const r of order.map(id => rows.get(id))) {
      const byEb = [];
      for (const eb of (plan.shape.exercise_blocks || []).filter(e => e.training_block === tb.n)) {
        const part = weeks.filter(w => w.n >= eb.weeks[0] && w.n <= eb.weeks[1]).map(w => (r.sets.has(w.n) && r.sets.get(w.n) !== null ? String(r.sets.get(w.n)) : '–'));
        if (part.length) byEb.push(part.join(' '));
      }
      const seq = (list) => list.filter((x, i) => x && (i === 0 || x !== list[i - 1]));
      const ebSeq = [...r.byEb.keys()].sort((a, b) => a - b).map(k => r.byEb.get(k));
      const names = ebSeq.length ? seq(ebSeq.map(x => x.name)) : r.names;
      const reps = r.circuit.length ? seq([r.circuit[0], r.circuit[r.circuit.length - 1]]) : ebSeq.length ? seq(ebSeq.map(x => x.reps)) : (r.reps.length > 2 ? [r.reps[0], r.reps[r.reps.length - 1]] : r.reps);
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
  for (const a of accelLines(w, model, o, plan)) L.push('_' + a + '_', '');
  // B3: the intensifier line only in a week whose items carry one (RECHECK 05 minor: announced, but no item had it)
  if (w.planned_rir && w.planned_rir.intensifiers && intensifierWeeks(plan).includes(n)) {
    // F3: the days that carry one (RECHECK 04 / 06 / 08 minors: 'one intensifier per training day' with days that had none)
    const days = intensifierDays(plan, n);
    // (v0.6 words, sample 08 minor: 'one intensifier on each of these days (Thursday)' for a single day)
    const one = days.length === 1 && !days.circuit && has(model, 'effort.intensifier_days_one');
    if (days.length && has(model, 'effort.intensifier_days')) L.push('_' + t(one ? 'effort.intensifier_days_one' : days.circuit ? 'effort.intensifier_days_circuit' : 'effort.intensifier_days', { days: days.slice() }) + '_', '');
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
  // v0.6 words (samples 05 / 08 minors: 'Athletic work this week: 20 throws' in a general-population bootcamp; 'Plyo share 37 % · Receive-Create
  // 1: Land' for a 52-year-old recreational player): no athlete line for the families the rules name, no share or stage for a client who
  // does not compete
  const AL = V6(model).athletic_line || null;
  const m = plan.meta || {};
  if (AL && (AL.hide_families || []).includes(m.family)) return '';
  const athleteWords = !(AL && AL.hide_share_stage_unless) || (m.profile && m.profile.competitive === AL.hide_share_stage_unless);
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
  if (athleteWords && work > 0 && typeof a.plyo_share === 'number' && share !== null) parts.push(t('ui.plan.plyo_share', { pct: Math.round(100 * share) }));
  if (athleteWords && a.stage) parts.push(t('plyo.stage.' + a.stage));
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
  // the template names a pattern the day does not hold (a kit gap, pain or an exclusion left a slot empty: 'A - squat + pull' with
  // no squat)
  const holds = (bs) => items.some(it => bs.includes(it.bucket));
  const missing = (/squat|knee|leg press|lunge/i.test(enLabel) && !holds(['RP_BKD', 'RP_UKD'])) || (/hinge|deadlift|\bhip\b/i.test(enLabel) && !holds(['RP_BHD', 'RP_UHD'])) ||
    (/pull/i.test(enLabel) && !holds(['RP_HPULL', 'RP_VPULL'])) || (/push|(?<!leg )press/i.test(enLabel) && !holds(['RP_HPUSH', 'RP_VPUSH']));
  // v0.4 B4 (sample 04: 'Pull + push press day' after the Olympic budget trimmed the push press): a title with no day code (the
  // class model's own lift names) is rebuilt as '<lifts> day' when it names a lift or Olympic piece the day no longer holds
  const KWL = model.rules.session.class_lift;
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
  // v0.5 / V3 (COACH-CT CT-01, COACH-R4 R4-SES-01): the average time, as a range - information only, never a limit
  if (typeof d.est_minutes === 'number') L.push('_' + estText(model, o, d.est_minutes, true) + '_');
  // B3 (COACH-R3 R3-SES-02): what can be switched off today, and the supersets that save time
  const sw = switchLine(d, model, o, plan);
  if (sw) L.push('_' + sw + '_');
  // v0.5 (CT-01): no 'over your minutes' lines - the estimate above is information; the supersets below are suggestions
  const sugg = supersetSuggestions(d, model, o);
  for (const s of sugg) L.push('_' + s + '_');
  // v0.5 / V3 (COACH-R4 R4-SES-04 'they get to pick what they want to keep or what they want to take away'): what is easiest to
  // remove today - named, never removed for the person
  const easy = easyToRemoveLine(d, model, o);
  if (easy) L.push('_' + easy + '_');
  const shown = displayBlocks(d);
  for (const b of d.blocks || []) {
    const list = shown.get(b) || [];
    if (!list.length) continue;
    L.push('', '**' + (b.kind === 'circuit' ? t('block.circuit', { n: b.circuit || 1 }) : t('block.' + b.kind)) + (b.on === false && has(model, 'edit.block_off') ? ' ' + t('edit.block_off') : '') + '**');
    const circ = (b.items || []).find(it => it.circuit);
    if (circ) L.push('_' + t('ui.plan.circuit_dose', { rounds: circ.circuit.rounds, work_s: circ.circuit.work_s, transition_s: circ.circuit.transition_s }) + '_');
    list.forEach((it, i) => {
      L.push((i + 1) + '. ' + itemLine(plan, d, it, model, o));
      for (const s of itemDetails(plan, d, it, model, o, w)) L.push('   ' + s);
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
function switchLine(d, model, o, plan) {
  if (!has(model, 'ui.plan.edit_day')) return '';
  const kinds = (d.toggle_blocks || (d.blocks || []).filter(b => b.toggle).map(b => b.kind)).filter((k, i, a) => SWITCH_KINDS.includes(k) && a.indexOf(k) === i && (d.blocks || []).some(b => b.kind === k && (b.items || []).length));
  // (fix round 2 / F1 minimal seam, E-152: a circuit's switchable athletic / cardio station, by name)
  const all = (d.blocks || []).flatMap(b => b.items || []);
  // (v0.6 words, sample 05 minor: a jump rope listed as '(jumps, throws and speed)' in a general-population bootcamp)
  const CSL = V6(model).circuit_station_label;
  const stLabel = CSL && (CSL.families || []).includes(plan && plan.meta && plan.meta.family) && has(model, CSL.key) ? CSL.key : 'block.short.athletic';
  const stations = (d.toggle_items || []).filter(x => x.toggle).map(x => all.find(it => it.slot_id === x.slot_id)).filter(Boolean)
    .map(it => exName(model, o, it) + ' (' + model.t(o.lang, stLabel) + ')');
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
  // (v0.6 words: the written-out pyramid carries its own set count - '5 sets: 12, 10, 8, 8, then a light back-off set of 20')
  if (it.set_reps && isPyramid(it.set_reps, model)) return formatSetReps(it.set_reps, model, o.lang, opt.short ? undefined : it.sets);
  // (v0.6 words, sample 03 minor: 'single-leg broad jump 3 x 5 contacts' with no 'per leg')
  const perLeg = it.reps && it.reps.type === 'contacts' && it.laterality === 'unilateral' && V6(model).contacts_per_leg_key && has(model, V6(model).contacts_per_leg_key);
  const reps = it.set_reps ? formatSetReps(it.set_reps, model, o.lang) : perLeg ? t(V6(model).contacts_per_leg_key, { n: it.reps.value }) : formatReps(it.reps, model, o.lang);
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
  // v0.6 words (sample 06 minor: 'Orange (C): long / easy · rower - 30 min · 11 min steady / 2 min easy, repeat'): a long / easy colour on a
  // machine is steady work; the run / walk split of his sheet is for running
  if (p.kind === 'intervals' && !run && (V6(model).aerobic_steady_off_feet || []).includes(e.colour)) return t('aerobic.pattern.steady');
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

function itemDetails(plan, d, it, model, o, w) {
  const t = T(model, o), L = [];
  if (it.test && it.test.test && it.bucket !== 'TEST') L.push('- **' + t('ui.plan.test_week') + ':** ' + esc(testName(model, o.lang, it.test.test)));
  const load = formatLoad(it.load && it.load.type === 'medball_lb' ? { ...it.load, wall_ball: isWallBall(model, it) } : it.load, model, o.lang, o.units);
  if (load) L.push('- ' + esc(load));
  // v0.5 / V3 (COACH-R4 R4-PRG-03): how this lift progresses - a rule the person applies, never a promised number
  const prog = progressionLine(it, w, model, o);
  if (prog) L.push('- ' + prog);
  // F3: one instruction per test (RECHECK 01 / 04 / 07 majors: 'it replaces this lift's top set' next to 'Test day: replaces this week's
  // top sets'); the once-a-plan notes are said up front (ONCE_NOTES)
  const replaces = (it.notes || []).some(n => n && n.key === 'note.test_top_set_replaces');
  for (const n of it.notes || []) {
    if (!n || !n.key || (n.key === 'load.week1_tip' && it.load && it.load.type === 'week1_tip')) continue;
    if (ONCE_NOTES.includes(n.key) && has(model, ONCE_LINE[n.key])) continue;
    if (replaces && n.key === 'note.test_day') continue;
    // (v0.6 words, sample 06 major: 'Keep this lift at 8-10 reps' under per-set reps of 12 and 20)
    if (n.key === 'note.rep_cap' && it.set_reps && V6(model).pyramid && V6(model).pyramid.drop_rep_cap) continue;
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
  if (o.show_swaps && (it.swaps || []).length) L.push('- ' + t('ui.plan.swaps') + ': ' + it.swaps.filter(s => model.hasEx(s)).map(s => swapText(model, o, it, s)).join(' / '));
  // v0.6 words (samples 03 / 07 minors; R4-LIB-05): no 'Watch how' search on an aerobic colour session - a search for 'Blue (A): short /
  // high intensity' finds nothing useful, and the session is written out on the card
  const noAerobicVideo = aerobicOf(it) && V6(model).aerobic_video === 'none';
  if (it.name_key && !it.wod && !noAerobicVideo) {
    const v = it.video;
    // v0.5 / V2 (COACH-R4 R4-LIB-05): a YouTube search built from the exercise's English name - no third-party video link - and
    // that exact name to copy and paste (the coach's own videos, kind 'coach', can be added later)
    if (v && v.url && v.kind === 'coach') L.push('- [' + t('ui.plan.video') + '](' + v.url + ')');
    // (a cardio session is named by its colour and the client's own cardio tool, not by the library's run-walk record: its search
    // uses that session name and there is no record name to copy)
    else if (v && v.url && !aerobicOf(it)) L.push('- [' + t('ui.plan.video_search') + '](' + v.url + ')' + (v.copy_name && has(model, 'ui.plan.copy_name') ? DOT + copyNameText(model, o, v.copy_name) : ''));
    // (a test row, a cardio session, or a plan written before the catalog carried its links: the search is built from the name here)
    else L.push('- [' + t('ui.plan.video_search') + '](' + YT + encodeURIComponent(aerobicOf(it) ? exName(model, { ...o, lang: 'en' }, it) : (o.lang !== 'en' && model.rules.render && model.rules.render.video_search_english ? model.t('en', it.name_key) : model.t(o.lang, it.name_key))) + ')');
  }
  if (o.show_why && (it.why || []).length) L.push('- _' + t('ui.plan.why') + ':_ ' + it.why.map(x => esc(whyText(x, model, o.lang))).join(DOT));
  return L;
}

/** v0.5 / V2 (COACH-R4 R4-LIB-04): a swap with its one line - what it keeps and what it loses (item.swap_notes) */
function swapText(model, o, it, id) {
  const name = esc(model.t(o.lang, model.ex(id).name_key));
  const n = (it.swap_notes || []).find(x => x && x.id === id);
  if (!n || !has(model, 'ui.plan.swap_note') || !has(model, n.keeps)) return name;
  const keeps = esc(model.t(o.lang, n.keeps));
  if (!n.loses || !has(model, n.loses)) return esc(model.t(o.lang, 'ui.plan.swap_note_keeps', { name: '\u0001', keeps: '\u0002' })).replace('\u0001', name).replace('\u0002', keeps);
  return esc(model.t(o.lang, 'ui.plan.swap_note', { name: '\u0001', keeps: '\u0002', loses: '\u0003' })).replace('\u0001', name).replace('\u0002', keeps).replace('\u0003', esc(model.t(o.lang, n.loses)));
}

/** v0.5 / V2 (R4-LIB-05): 'Name to copy into YouTube: `Farmer Carry (bilateral)`' - the exact name in a code span, easy to select */
function copyNameText(model, o, name) {
  return esc(model.t(o.lang, 'ui.plan.copy_name', { name: '\u0001' })).replace('\u0001', '`' + String(name).replace(/`/g, "'") + '`');
}

/**
 * v0.5 / V2 (COACH-R4 R4-LIB-01): the optional add-ons the plan offers - never part of the template ('they can be chosen and added,
 * but not primary ones'); each with its dose, what it is for and its search link.
 */
function addonsSection(plan, model, o) {
  const t = T(model, o);
  const list = (plan.meta && plan.meta.addons) || [];
  if (!list.length || !has(model, 'ui.plan.addons_title') || plan.status !== 'ok') return [];
  const L = ['## ' + t('ui.plan.addons_title'), '', '_' + t('ui.plan.addons_intro') + '_', ''];
  for (const a of list) {
    if (!a || !model.hasEx(a.exercise_id)) continue;
    const sets = Array.isArray(a.sets) ? (a.sets[0] === a.sets[1] ? String(a.sets[0]) : a.sets[0] + '-' + a.sets[1]) : String(a.sets || '');
    const dose = sets + ' × ' + esc(formatReps(a.reps, model, o.lang));
    let purpose = '';
    if (a.kind === 'joint_care') {
      // the label follows the exercise when the rules name one for it (a tibialis raise is care for the shins and ankles), else the code
      const LBE = ((model.rules.prehab && model.rules.prehab.label_by_exercise) || []).find(x => new RegExp(x.re).test(a.exercise_id) && has(model, x.key));
      purpose = LBE ? t(LBE.key) : has(model, 'prehab.label.' + a.code) ? t('prehab.label.' + a.code) : (has(model, 'addon.purpose.sport') ? t('addon.purpose.sport') : '');
    } else if (has(model, 'addon.purpose.' + a.kind)) purpose = t('addon.purpose.' + a.kind);
    L.push('- **' + esc(model.t(o.lang, a.name_key)) + '** ' + DASH.trim() + ' ' + dose + (purpose ? DOT + purpose : ''));
    if (a.video && a.video.url) L.push('   - [' + t('ui.plan.video_search') + '](' + a.video.url + ')' + (a.video.copy_name && has(model, 'ui.plan.copy_name') ? DOT + copyNameText(model, o, a.video.copy_name) : ''));
  }
  L.push('');
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
  const risk = ownRisk(plan, model, o);
  if (risk) L.push(risk, '');
  L.push(t('ui.plan.refer_body'), '');
  for (const r of (plan.refer && plan.refer.reasons) || []) L.push('- ' + t(r));
  L.push('', t('health.refer'), '', '---', '', t('ui.disclaimer') + legalLink(model, o));
  return L.join('\n');
}

function renderInvalid(plan, model, o) {
  const t = T(model, o);
  const L = ['# ' + t('ui.plan.title'), ''];
  const risk = ownRisk(plan, model, o);
  if (risk) L.push(risk, '');
  for (const e of plan.errors || []) {
    // field errors: '{field}: what is wrong' (intake.error.<code>); other issues (release missing, banned inputs) as written
    const ek = 'intake.error.' + e.code;
    if (e.code && model.has('en', ek) && e.key && e.key.startsWith('intake.')) L.push('- ' + t(ek, { ...(e.args || {}), field: model.t(o.lang, e.key) }));
    else L.push('- ' + t(e.key, e.args));
  }
  L.push('', '---', '', t('ui.disclaimer') + legalLink(model, o));
  return L.join('\n');
}
