// engine/render.mjs - plan rendering (engine/CONTRACTS.md §4.11). Owner: B4.
// Markdown (default) or plain text, English or Spanish. Every word comes from model.t; this file holds no user-facing
// words, only punctuation and layout. Phone-friendly: day cards are numbered lists, tables have at most 4 columns
// (the block view has 3). Template notes / dose_text / condition_text are internal hints and are never rendered.
import { WEEKDAYS } from './util.mjs';
import { tr, levelText, changesText, stairText, whyText } from './explain.mjs';

const YT = 'https://www.youtube.com/results?search_query=';
const INSTRUCTION_KEYS = ['instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5'];
const DASH = ' — ';
const DOT = ' · ';

/**
 * @param {import('./util.mjs').Plan} plan @param {import('./util.mjs').Model} model
 * @param {{lang?:'en'|'es', format?:'markdown'|'text', view?:'full'|'block'|'week'|'day', weeks?:'all'|number[],
 *           show_why?:boolean, show_swaps?:boolean, units?:'lb'|'kg'}} [opts]
 * @returns {string}
 */
export function renderPlan(plan, model, opts = {}) {
  const o = norm(plan, opts);
  let md;
  if (plan.status === 'refer') md = renderRefer(plan, model, o);
  else if (plan.status === 'invalid') md = renderInvalid(plan, model, o);
  else if (o.view === 'block') md = (plan.shape.training_blocks || []).map(tb => blockView(plan, tb.n, model, o)).join('\n');
  else if (o.view === 'week') md = weekNumbers(plan, o).map(n => weekSection(plan, n, model, o)).join('\n');
  else if (o.view === 'day') md = weekNumbers(plan, o).flatMap(n => dayList(plan, n).map(d => dayCard(plan, n, d.weekday, model, o))).join('\n');
  else md = fullView(plan, model, o);
  return finish(md, o);
}

/** one compact table per training day of a training block: exercises x weeks (sets per week, reps first -> last), stairway levels
 * @param {import('./util.mjs').Plan} plan @param {number} trainingBlock @returns {string} */
export function renderBlockView(plan, trainingBlock, model, opts = {}) {
  const o = norm(plan, opts);
  return finish(blockView(plan, trainingBlock, model, o), o);
}

/** @param {import('./util.mjs').Plan} plan @param {number} weekN @returns {string} */
export function renderWeek(plan, weekN, model, opts = {}) {
  const o = norm(plan, opts);
  return finish(weekSection(plan, weekN, model, o), o);
}

/** @param {import('./util.mjs').Plan} plan @param {number} weekN @param {string} weekday @returns {string} */
export function renderDay(plan, weekN, weekday, model, opts = {}) {
  const o = norm(plan, opts);
  return finish(dayCard(plan, weekN, weekday, model, o), o);
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
      return rep.min === rep.max ? t('reps.fixed', { n: rep.min }) : t('reps.fixed', { n: rep.min + '-' + rep.max });
    }
    case 'fixed': return t('reps.fixed', { n: rep.value });
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
    case 'after_pair': return t('rest.after_pair');
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
    case 'week1_tip': return t('load.week1_tip');
    case 'power': return t('load.power');
    case 'bw_pct': return t('load.bw_pct', { min: load.min, max: load.max });
    case 'medball_lb': return load.min === load.max && !load.wall_ball ? t('load.medball_one', { n: load.min }) : t(load.wall_ball ? 'load.wall_ball' : 'load.medball', { min: load.min, max: load.max });
    case 'height': return t(load.value === 'medium' ? 'load.height_medium' : 'load.height_low');
    case 'pct_hint': return t('load.pct_hint', { pct: load.pct });
    default: return '';
  }
}

// ------------------------------------------------------------------------------------------------------------- internals

function norm(plan, opts) {
  return {
    lang: opts.lang || plan.lang || 'en', format: opts.format || 'markdown', view: opts.view || 'full', weeks: opts.weeks || 'all',
    show_why: !!opts.show_why, show_swaps: opts.show_swaps !== false, units: opts.units || plan.units || 'lb'
  };
}
const esc = (s) => String(s).replace(/([\\*_`])/g, '\\$1');
const T = (model, o) => (key, args) => esc(tr(model, o.lang, key, args));
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
  if (it.name_key) {
    const n = model.t(o.lang, it.name_key);
    return it.detail && it.detail.key ? model.t(o.lang, 'ui.plan.detail', { name: n, detail: model.t(o.lang, it.detail.key) }) : n;
  }
  if (it.text_key) return model.t(o.lang, it.text_key);
  return model.t(o.lang, 'slot.' + it.bucket);
}

// ------------------------------------------------------------------------------------------------------------- full view

function fullView(plan, model, o) {
  const t = T(model, o), m = plan.meta || {};
  const L = [];
  L.push('# ' + t(m.program_name_key || 'ui.plan.title'));
  L.push('_' + t('ui.plan.title') + '_', '');
  L.push(...headerLines(plan, model, o), '');
  L.push(...noticesSection(plan, model, o));
  L.push(...instructionBlock(plan, model, o), '');
  L.push(...stairwaySection(plan, model, o), '');
  L.push(...weeklySetsSection(plan, model, o), '');
  for (const tb of plan.shape.training_blocks || []) L.push(blockView(plan, tb.n, model, o), '');
  for (const n of weekNumbers(plan, o)) L.push(weekSection(plan, n, model, o), '');
  L.push(...summarySection(plan, model, o));
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
    else L.push('- ' + p);
  }
  b(t('ui.plan.level'), esc(levelText(plan, model, o.lang)));
  if (m.plan_mode) b(t('intake.plan_mode.label'), t('intake.plan_mode.opt.' + m.plan_mode) + DOT + t('ui.plan.week', { n: '1-' + (plan.shape.weeks_total || m.weeks) }));
  if (m.start_date) b(t('intake.start.label'), m.start_date);
  if (m.weekdays) b(t('intake.days.label'), m.days_per_week + DOT + m.weekdays.map(d => t('weekday.' + d)).join(', ') + DOT + t('intake.minutes.label') + ': ' + m.session_minutes);
  if (plan.release_stamp) {
    // the version id (release.client | coach | minor) is itself the key of the full legal text: show its short label
    const rl = plan.release_stamp.lang, langKey = 'intake.lang.opt.' + rl;
    const shortKey = 'release.short.' + String(plan.release_stamp.version || '').replace(/^release\./, '');
    const version = model.has('en', shortKey) ? model.t(o.lang, shortKey) : model.t(o.lang, 'release.label');
    L.push('- ' + esc(model.t(o.lang, 'ui.plan.release_stamp', { version, lang: model.has('en', langKey) ? model.t(o.lang, langKey) : rl })));
  }
  if (m.health && m.health.bypass) L.push('- ' + t('ui.plan.coach_bypass_stamp'));
  return L;
}

/**
 * v1.2 (review 07 major 3 / 04 / 08): what the client must know before week 1 - the plan's warnings and the schedule offers -
 * comes right after the header, not after week 12.
 */
function noticesSection(plan, model, o) {
  const t = T(model, o);
  const warnings = (plan.meta && plan.meta.warnings) || [];
  const offers = plan.offers || [];
  if (!warnings.length && !offers.length) return [];
  const L = ['## ' + t('ui.plan.before_you_start'), ''];
  for (const w of warnings) L.push('- ' + t(w.key, warningArgs(w, model, o)));
  if (offers.length) {
    L.push('', '**' + t('ui.plan.offers') + '**');
    for (const of of offers) L.push('- ' + t(of.key, of.args || {}) + (of.chosen ? ' ' + t('ui.plan.offer_chosen') : ''));
  }
  L.push('');
  return L;
}

/** warning args shown to people: equipment tokens by their names (review 05 minor 18) */
function warningArgs(w, model, o) {
  const a = { ...(w.args || {}) };
  if (typeof a.items === 'string') a.items = a.items.split(',').map(x => x.trim()).filter(Boolean).map(tok => (model.has('en', 'equipment.token.' + tok) ? model.t(o.lang, 'equipment.token.' + tok) : tok)).join(', ');
  return a;
}

/** v1.2 (review 04 / 06 / 08 minors): the planned effort drift, so the basic instruction ('leave 1 in the tank') and the
 * week-by-week effort (3 -> 2 -> 1) never read as a contradiction */
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
  return t('effort.drift', { list: items.join('; ') });
}

function instructionBlock(plan, model, o) {
  const t = T(model, o), m = plan.meta || {};
  const keys = (m.instruction_keys && m.instruction_keys.length ? m.instruction_keys : ['instruction.title', ...INSTRUCTION_KEYS]);
  const L = ['## ' + t(keys[0])];
  keys.slice(1).forEach((k, i) => { if (i) L.push('>'); L.push('> ' + t(k)); });
  const drift = effortDriftLine(plan, model, o);
  if (drift) L.push('', drift);
  L.push('', t('effort.how_hard'));
  const hasOlympic = (plan.weeks || []).some(w => (w.days || []).some(d => (d.blocks || []).some(b => (b.items || []).some(it => it.bucket === 'AP_TRIPLE_EXT'))));
  if (hasOlympic) L.push('', t('effort.olympic'));
  const older = m.derived && typeof m.derived.age === 'number' && m.derived.age >= model.rules.population.older.from_age;
  if (older) L.push('', '> ⚠ ' + t(model.rules.population.older.warning_key));
  return L;
}

function stairwaySection(plan, model, o) {
  const t = T(model, o), m = plan.meta || {}, L = [];
  const tbs = plan.shape.training_blocks || [];
  if (tbs.some(x => x.type === 'stairway')) L.push(t('plan.stairway_intro'), '');
  for (const tb of tbs) {
    L.push('## ' + t(tb.label_key) + DOT + t('ui.plan.week', { n: tb.weeks[0] + '-' + tb.weeks[1] }), '');
    L.push('| ' + [t('ui.plan.view.week'), t('ui.plan.level'), t('ui.plan.phase'), t('ui.plan.tests')].join(' | ') + ' |', '|---|---|---|---|');
    for (const w of (plan.weeks || []).filter(x => x.training_block === tb.n)) {
      const lvl = typeof w.stair_level === 'number' ? w.stair_level.toFixed(1) + ' ' + '▮'.repeat(Math.max(1, Math.round(w.stair_level))) : '–';
      const tests = w.test ? (w.test.items || []).map(i => t('tests.' + i)).join(', ') : '';
      L.push('| ' + [String(w.n), lvl, t(w.phase_key), tests].join(' | ') + ' |');
    }
    const ebs = (plan.shape.exercise_blocks || []).filter(e => e.training_block === tb.n);
    if (ebs.length) L.push('');
    for (const e of ebs) L.push('- ' + t('plan.exercise_block', { n: e.n, from: e.weeks[0], to: e.weeks[1] }));
    L.push('');
  }
  const ap = m.after_plan;
  if (ap && ap.next && model.has('en', 'plan.next.' + ap.next)) L.push(t('plan.next_after_plan', { next: tr(model, o.lang, 'plan.next.' + ap.next, { weeks: ap.weeks, date: ap.date }) }));
  const tests = m.tests || {};
  if ((tests.items || []).length) {
    L.push('', '**' + t('ui.plan.tests') + ':** ' + tests.items.map(i => t('tests.' + i)).join(', '));
    if ((tests.reminders || []).length) L.push(t('ui.plan.reminder', { dates: tests.reminders.join(', ') }));
  }
  return L;
}

function weeklySetsSection(plan, model, o) {
  const t = T(model, o), L = [];
  const st = (plan.weeks || []).filter(w => w.block_type === 'stairway');
  const pool = st.length ? st : (plan.weeks || []);
  if (!pool.length) return L;
  const picks = [...new Set([pool[0], pool[Math.floor((pool.length - 1) / 2)], pool[pool.length - 1]])];
  L.push('## ' + t('ui.plan.weekly_sets'), '', '_' + t('ui.plan.weekly_sets_note') + '_', '');
  L.push('| ' + ['', ...picks.map(w => t('ui.plan.week', { n: w.n }))].join(' | ') + ' |', '|' + '---|'.repeat(picks.length + 1));
  for (const mu of model.rules.muscles.order) {
    const vals = picks.map(w => (w.weekly_sets_by_muscle || {})[mu]);
    if (!vals.some(v => typeof v === 'number' && v > 0)) continue;
    L.push('| ' + [t('muscle.' + mu), ...vals.map(fmtNum)].join(' | ') + ' |');
  }
  L.push('| **' + t('ui.plan.total') + '** | ' + picks.map(w => '**' + fmtNum(w.total_resistance_sets) + '**').join(' | ') + ' |');
  return L;
}

function summarySection(plan, model, o) {
  const t = T(model, o), L = [];
  const warnings = (plan.meta && plan.meta.warnings) || [];
  const failed = ((plan.validation && plan.validation.checks) || []).filter(c => !c.pass);
  if (failed.length) { // the warnings are shown up front (noticesSection); the notes keep the checks that did not pass
    L.push('## ' + t('ui.plan.notes'), '');
    for (const c of failed) L.push('- ⚠ ' + t(c.key) + ' (' + c.id + ', ' + c.violations.length + ')');
    L.push('');
  }
  void warnings;
  L.push('---', '', '_' + t('ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version }) + '_', '', t('ui.disclaimer'), '', t('video.note'));
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
        if (['warmup', 'cooldown', 'aerobic'].includes(b.kind) || !(it.name_key || it.wod)) continue;
        if (!rows.has(it.slot_id)) rows.set(it.slot_id, { names: [], sets: new Map(), reps: [] });
        const r = rows.get(it.slot_id);
        const nm = esc(exName(model, o, it));
        if (!r.names.includes(nm)) r.names.push(nm);
        r.sets.set(w.n, it.sets);
        const rp = esc(itemDose(model, o, it, { short: true }));
        if (rp && !r.reps.includes(rp)) r.reps.push(rp);
      }
    }
    if (!rows.size) continue;
    L.push('### ' + t('weekday.' + wd) + DOT + t(d0.label_key), '');
    L.push('| ' + t('ui.plan.exercise') + ' | ' + t('ui.plan.sets') + ' | ' + t('ui.plan.reps') + ' |', '|---|---|---|');
    for (const r of rows.values()) {
      const byEb = [];
      for (const eb of (plan.shape.exercise_blocks || []).filter(e => e.training_block === tb.n)) {
        const part = weeks.filter(w => w.n >= eb.weeks[0] && w.n <= eb.weeks[1]).map(w => (r.sets.has(w.n) && r.sets.get(w.n) !== null ? String(r.sets.get(w.n)) : '–'));
        if (part.length) byEb.push(part.join(' '));
      }
      const reps = r.reps.length > 2 ? [r.reps[0], r.reps[r.reps.length - 1]] : r.reps;
      L.push('| ' + r.names.join(' → ') + ' | ' + byEb.join(DOT) + ' | ' + reps.join(' → ') + ' |');
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
  if (w.test) L.push('**' + t(w.test.type === 'baseline' ? 'ui.plan.test_baseline' : 'ui.plan.test_end') + '** (' + (w.test.items || []).map(i => t('tests.' + i)).join(', ') + ')', '');
  if (w.planned_rir && w.planned_rir.intensifiers) L.push('_' + t('effort.intensifier') + '_', '');
  const ch = changesText(plan, n, model, o.lang);
  if (ch.length) { L.push('**' + t('ui.plan.changes') + '**'); for (const c of ch) L.push('- ' + esc(c)); L.push(''); }
  const ab = athleticLine(plan, w, model, o);
  if (ab) L.push(ab, '');
  for (const d of dayList(plan, n)) L.push(dayCard(plan, n, d.weekday, model, o), '');
  return L.join('\n');
}

function athleticLine(plan, w, model, o) {
  const t = T(model, o), a = w.athletic_budget;
  if (!a || !a.planned) return '';
  const p = a.planned, parts = [];
  const jumps = (p.plyo_contacts || 0) + (p.jump_contacts || 0) + (p.low_contacts || 0);
  if (jumps) parts.push(t('ui.plan.contacts', { n: jumps }));
  if (p.throws) parts.push(t('ui.plan.throws', { n: p.throws }));
  if (p.cod_cuts) parts.push(t('ui.plan.cuts', { n: p.cod_cuts }));
  if (p.sprint_m) parts.push(t('ui.plan.sprint_m', { n: p.sprint_m }));
  if (p.olympic_sets) parts.push(t('ui.plan.olympic_sets', { n: p.olympic_sets }));
  // v1.2 (review 08 major 6 / 02 minor 17): the share actually planned (reactive plyo contacts over all jump and throw work),
  // never the budget's target
  const work = (p.plyo_contacts || 0) + (p.jump_contacts || 0) + (p.low_contacts || 0) + (p.throws || 0);
  if (work > 0 && typeof a.plyo_share === 'number') parts.push(t('ui.plan.plyo_share', { pct: Math.round(100 * (p.plyo_contacts || 0) / work) }));
  if (a.stage) parts.push(t('plyo.stage.' + a.stage));
  return parts.length ? '**' + t('ui.plan.athletic_budget') + ':** ' + parts.join(DOT) : '';
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
    return [head + t('ui.plan.aerobic_day'), ...items.map(it => '- ' + itemLine(plan, d, it, model, o, { compact: true }))].join('\n');
  }
  const L = [head + t(d.label_key) + (d.optional ? ' ' + t('ui.plan.optional_tag') : '')];
  if (typeof d.est_minutes === 'number') L.push('_' + t('ui.plan.est_minutes', { min: d.est_minutes }) + '_');
  for (const b of d.blocks || []) {
    if (!(b.items || []).length) continue;
    L.push('', '**' + (b.kind === 'circuit' ? t('block.circuit', { n: b.circuit || 1 }) : t('block.' + b.kind)) + '**');
    const circ = (b.items || []).find(it => it.circuit);
    if (circ) L.push('_' + t('ui.plan.circuit_dose', { rounds: circ.circuit.rounds, work_s: circ.circuit.work_s, transition_s: circ.circuit.transition_s }) + '_');
    (b.items || []).forEach((it, i) => {
      L.push((i + 1) + '. ' + itemLine(plan, d, it, model, o));
      for (const s of itemDetails(plan, d, it, model, o)) L.push('   ' + s);
    });
  }
  return L.join('\n');
}

function itemDose(model, o, it, opt = {}) {
  const t = (k, a) => model.t(o.lang, k, a);
  if (it.wod) {
    const fmt = t('ui.plan.wod_format.' + it.wod.format), [a, z] = it.wod.minutes;
    return a === z ? t('ui.plan.wod_dose_fixed', { format: fmt, n: a }) : t('ui.plan.wod_dose', { format: fmt, min: a, max: z });
  }
  if (it.circuit && !opt.short) return formatReps({ type: 'rounds_work', rounds: it.circuit.rounds, work_s: it.circuit.work_s }, model, o.lang);
  if (it.bucket === 'SKILL' && it.reps && it.reps.type === 'minutes') return t('ui.plan.skill_dose', { min: it.reps.min, max: it.reps.max });
  const reps = it.set_reps ? formatSetReps(it.set_reps, model, o.lang) : formatReps(it.reps, model, o.lang);
  if (opt.short) return reps;
  if (typeof it.sets === 'number' && it.sets > 0 && reps) return it.sets + ' × ' + reps;
  if (typeof it.sets === 'number' && it.sets > 0) return String(it.sets) + ' × ';
  return reps;
}

function itemLine(plan, d, it, model, o, opt = {}) {
  const t = T(model, o);
  let name = esc(exName(model, o, it));
  if (it.origin === 'bonus') name += ' ' + t('ui.plan.bonus_tag');
  else if (it.bucket === 'FOCUS' || it.origin === 'focus_added') name += ' ' + t('ui.plan.focus_tag');
  const parts = [];
  if (it.aerobic || (it.effort && it.effort.type === 'aerobic')) {
    const colour = (it.aerobic && it.aerobic.colour) || (it.effort && it.effort.colour);
    if (colour) parts.push(t('conditioning.colour.' + colour));
    const mins = it.reps && it.reps.type === 'minutes' ? formatReps(it.reps, model, o.lang) : it.aerobic && it.aerobic.minutes ? model.t(o.lang, 'reps.minutes', { min: it.aerobic.minutes[0], max: it.aerobic.minutes[1] }) : '';
    if (mins) parts.push(esc(mins));
  } else {
    const dose = itemDose(model, o, it);
    if (dose && dose.trim() !== '×') parts.push(esc(dose));
    const eff = formatEffort(it.effort, model, o.lang);
    if (eff) parts.push(esc(eff));
    const rest = formatRest(it.rest, model, o.lang);
    if (rest) parts.push(esc(rest));
  }
  const partners = supersetPartners(d, it);
  if (partners.length && (d.supersets_on || (it.rest && it.rest.type === 'after_pair'))) parts.push(t('ui.plan.superset_with') + ' ' + partners.map(p => esc(exName(model, o, p))).join(' + '));
  const head = it.name_key || it.wod ? '**' + name + '**' : name;
  return opt.compact ? [head, ...parts].join(DOT) : head + (parts.length ? DASH + parts.join(DOT) : '');
}

function supersetPartners(d, it) {
  if (!it.superset) return [];
  const all = (d.blocks || []).flatMap(b => b.items || []);
  return all.filter(x => x !== it && x.superset === it.superset && x.slot_id !== it.slot_id);
}

function itemDetails(plan, d, it, model, o) {
  const t = T(model, o), L = [];
  if (it.test && it.test.test) L.push('- **' + t('ui.plan.test_week') + ':** ' + esc(testName(model, o.lang, it.test.test)));
  const load = formatLoad(it.load && it.load.type === 'medball_lb' ? { ...it.load, wall_ball: isWallBall(model, it) } : it.load, model, o.lang, o.units);
  if (load) L.push('- ' + esc(load));
  for (const n of it.notes || []) if (n && n.key && !(n.key === 'load.week1_tip' && it.load && it.load.type === 'week1_tip')) L.push('- ' + t(n.key, n.args));
  if (it.wod && (it.wod.stations || []).length) {
    if (it.wod.rounds) L.push('- ' + t('ui.plan.wod_rounds', { n: it.wod.rounds, min: it.wod.minutes[0] }));
    L.push('- ' + it.wod.stations.map((s, i) => {
      const nm = model.hasEx(s) ? esc(model.t(o.lang, model.ex(s).name_key)) : esc(s);
      const r = it.wod.station_reps && it.wod.station_reps[i] ? esc(formatReps(it.wod.station_reps[i], model, o.lang)) : '';
      return r ? r + ' ' + nm : nm;
    }).join(DOT));
  }
  if (it.cue_key && !it.wod) L.push('> ' + t(it.cue_key));
  if (o.show_swaps && (it.swaps || []).length) L.push('- ' + t('ui.plan.swaps') + ': ' + it.swaps.filter(s => model.hasEx(s)).map(s => esc(model.t(o.lang, model.ex(s).name_key))).join(' / '));
  if (it.name_key && !it.wod) {
    const v = it.video;
    if (v && v.url && v.kind !== 'search') L.push('- [' + t('ui.plan.video') + '](' + v.url + ')');
    else L.push('- [' + t('ui.plan.video_search') + '](' + YT + encodeURIComponent(exName(model, o, it)) + ')');
  }
  if (o.show_why && (it.why || []).length) L.push('- _' + t('ui.plan.why') + ':_ ' + it.why.map(x => esc(whyText(x, model, o.lang))).join(DOT));
  return L;
}

function isWallBall(model, it) {
  return !!it.exercise_id && model.hasEx(it.exercise_id) && model.ex(it.exercise_id).tags.includes('wall_ball');
}

// ------------------------------------------------------------------------------------------------------------- refer / invalid

function renderRefer(plan, model, o) {
  const t = T(model, o);
  const L = ['# ' + t('ui.plan.refer_title'), '', t('ui.plan.refer_body'), ''];
  for (const r of (plan.refer && plan.refer.reasons) || []) L.push('- ' + t(r));
  L.push('', t('health.refer'), '', '---', '', t('ui.disclaimer'));
  return L.join('\n');
}

function renderInvalid(plan, model, o) {
  const t = T(model, o);
  const L = ['# ' + t('ui.plan.title'), ''];
  for (const e of plan.errors || []) {
    // field errors: '{field}: what is wrong' (intake.error.<code>); other issues (release missing, banned inputs) as written
    const ek = 'intake.error.' + e.code;
    if (e.code && model.has('en', ek) && e.key && e.key.startsWith('intake.')) L.push('- ' + t(ek, { ...(e.args || {}), field: model.t(o.lang, e.key) }));
    else L.push('- ' + t(e.key, e.args));
  }
  L.push('', '---', '', t('ui.disclaimer'));
  return L.join('\n');
}
