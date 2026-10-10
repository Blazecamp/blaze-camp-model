// engine/explain.mjs - human explanations of plan decisions (engine/CONTRACTS.md §4.10). Owner: B4.
// Every word comes from model.t (EN default, full ES twin). Pure: plan + model in, strings out.
import { WEEKDAYS } from './util.mjs';

// Argument names whose values are ids that have their own i18n namespace. Values are resolved before they fill
// a {placeholder}, so "{day}" shows "Monday" / "lunes" instead of "Mon" and "{exercise}" the exercise name.
const ARG_NAMESPACES = {
  day: 'weekday', weekday: 'weekday', days: 'weekday', muscle: 'muscle', muscles: 'muscle', over: 'muscle', plus: 'muscle', group: 'group',
  goal: 'goal', stage: 'plyo.stage', test: 'tests', area: 'intake.pain.opt', colour: 'conditioning.colour', axis: 'detail',
  level: 'level', phase: 'plan.phase', season: 'season', format: 'ui.plan.wod_format'
};
const NAME_ARGS = ['exercise', 'from', 'to', 'name']; // exercise ids -> exercise name
const NO_RESOLVE = ['version', 'lang', 'id', 'template', 'variant', 'code', 'ref'];

/**
 * Resolve placeholder arguments to words in `lang` (ids -> names; values that are i18n keys -> their text; arrays joined).
 * Exported for render.mjs.
 * @param {Object<string,*>|undefined} args @param {import('./util.mjs').Model} model @param {string} lang @returns {Object<string,string|number>}
 */
export function resolveArgs(args, model, lang) {
  if (!args) return args;
  const out = {};
  for (const [name, value] of Object.entries(args)) out[name] = resolveValue(name, value, model, lang, args);
  return out;
}

function resolveValue(name, value, model, lang, all) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(v => resolveValue(name, v, model, lang, all)).join(', ');
  if (typeof value !== 'string') return value;
  if (name === 'code' && model.has('en', 'prehab.code.' + value)) return model.t(lang, 'prehab.code.' + value);   // joint-care codes
  if (NO_RESOLVE.includes(name)) return value;
  if (name === 'muscles' && value.includes(',')) return value.split(/\s*,\s*/).map(v => resolveValue(name, v, model, lang, all)).join(', ');
  if (model.has('en', value)) return model.t(lang, value, all);              // the value is itself a key (e.g. advice)
  if (NAME_ARGS.includes(name) && model.hasEx(value)) return model.t(lang, model.ex(value).name_key);
  // v0.4 B3 (R2-GEN-08 natural Spanish): a weekday inside a sentence is lower case in Spanish ('el lunes'); headings keep 'Lunes'
  if ((name === 'day' || name === 'weekday' || name === 'days') && WEEKDAYS.includes(value)) { const d = model.t(lang, 'weekday.' + value); return lang === 'es' ? d.toLowerCase() : d; }
  const ns = ARG_NAMESPACES[name];
  if (ns) {
    const v = value.replace(/^muscle\./, '');
    if (model.has('en', ns + '.' + v)) return model.t(lang, ns + '.' + v);
  }
  if (name === 'activity' || name === 'profile' || name === 'sport') {
    for (const k of ['activity.' + value + '.name', 'sport.' + value + '.name', 'profile.' + value + '.name']) if (model.has('en', k)) return model.t(lang, k);
  }
  return value;
}

/** translated text of a key with resolved args @param {string} key @param {Object} [args] @param {import('./util.mjs').Model} model @param {string} lang @returns {string} */
export function tr(model, lang, key, args) {
  return model.t(lang, key, resolveArgs(args, model, lang));
}

/** @param {import('./util.mjs').Why} why @param {import('./util.mjs').Model} model @param {string} lang @returns {string} "text [REF]" */
export function whyText(why, model, lang) {
  if (!why || !why.key) return '';
  return tr(model, lang, why.key, why.args) + ' [' + why.ref + ']';
}

function findItem(plan, ref) {
  const w = (plan.weeks || []).find(x => x.n === ref.week);
  const d = w && (w.days || []).find(x => x.weekday === ref.weekday);
  if (!d) return null;
  for (const b of d.blocks || []) for (const it of b.items || []) if (it.slot_id === ref.slot_id) return { w, d, b, it };
  return null;
}

/**
 * Every reason behind one item (item why, then the day's and the week's reasons that shaped it), deduplicated.
 * @param {import('./util.mjs').Plan} plan @param {{week:number, weekday:string, slot_id:string}} ref
 * @param {import('./util.mjs').Model} model @param {string} lang @returns {string[]}
 */
export function explainItem(plan, ref, model, lang) {
  const f = findItem(plan, ref);
  if (!f) return [];
  const lines = [];
  const seen = new Set();
  for (const w of [...(f.it.why || []), ...(f.d.why || []), ...(f.w.why || [])]) {
    const s = whyText(w, model, lang);
    if (s && !seen.has(s)) { seen.add(s); lines.push(s); }
  }
  return lines;
}

/** "Intermediate (L2): 2 years of consistent training" (PRG-05) @param {import('./util.mjs').Plan} plan @returns {string} */
export function levelText(plan, model, lang) {
  const lv = plan.meta && plan.meta.level;
  if (!lv || !lv.client) return '';
  // v0.4 stage B3 (RECHECK 05 minor '1 years' / '1 años'): a reason with a count of 1 takes its singular line when the model has one
  const one = (r) => r.args && Object.values(r.args).some(v => v === 1 || v === '1') && model.has('en', r.key + '_one');
  const reasons = (lv.reason_keys || []).map(r => tr(model, lang, one(r) ? r.key + '_one' : r.key, r.args)).filter(Boolean);
  return model.t(lang, 'level.' + lv.client) + (reasons.length ? ': ' + reasons.join(', ') : '');
}

/** what changes in week n ("+1 set on Back Squat (Monday)"); never percentages (VOL-06) @returns {string[]} */
export function changesText(plan, weekN, model, lang) {
  const w = (plan.weeks || []).find(x => x.n === weekN);
  if (!w) return [];
  const seen = new Set();
  const out = [];
  // v0.4 fix round 1 / F3 (COACH-R3 R3-SES-01 counts FOCUS groups; RECHECK 01 / 02 / 04 / 07 / 08 minors: '+1 set on Lying Leg Curl'
  // next to 'Hamstrings stays at these sets', 'Glutes stays', a plan cap called a 'ceiling'): a 'stays at these sets' line is said per
  // FOCUS group, never for a group that gains a set the same week, and a reached target is 'this plan's set target'
  const grouped = model.has('en', 'changes.held_group') && model.has('en', 'changes.at_target_group');
  const gained = grouped ? groupsGaining(plan, w, model) : new Set();
  const heldSeen = new Set();
  for (const ch of w.changes || []) {
    if (!ch || !ch.key) continue;
    const args = { ...(ch.args || {}) };
    for (const k of Object.keys(args)) if (/pct|percent|rate/i.test(k)) delete args[k];
    let key = ch.key;
    if (grouped && (key === 'changes.at_time_cap' || key === 'changes.at_cap') && typeof args.muscle === 'string') {
      const g = groupOfLine(model, args.muscle);
      if (g) {
        if (gained.has(g) || heldSeen.has(g)) continue;
        heldSeen.add(g);
        key = key === 'changes.at_time_cap' ? 'changes.held_group' : 'changes.at_target_group';
        for (const k of Object.keys(args)) delete args[k];
        args.group = 'group.' + g;
      }
    }
    const s = tr(model, lang, key, args);
    if (!seen.has(s)) { seen.add(s); out.push(s); }
  }
  return out;
}

/** the FOCUS group of a stairway line ('hamstrings' -> 'hips', 'lats_upper_back' -> 'back'), or null */
function groupOfLine(model, line) {
  const LX = model.rules.muscles && model.rules.muscles.lines;
  if (LX && LX.defs && LX.defs[line] && LX.defs[line].group) return LX.defs[line].group;
  try { return model.groupOf(line); } catch { return null; }
}

/** the FOCUS groups a week's set_added / bonus_added changes give a set to (the item's group, else its exercise's prime mover) */
function groupsGaining(plan, w, model) {
  const out = new Set();
  const items = (w.days || []).flatMap(d => (d.blocks || []).flatMap(b => b.items || []));
  for (const ch of w.changes || []) {
    if (!ch || !['changes.set_added', 'changes.bonus_added'].includes(ch.key) || !ch.args) continue;
    const it = items.find(x => x.slot_id === ch.args.slot_id) || null;
    let g = it && it.group ? it.group : null;
    const exId = (it && it.exercise_id) || ch.args.exercise;
    if (!g && exId && model.hasEx(exId)) {
      const pm = model.ex(exId).primary_muscle;
      try { g = pm ? model.groupOf(pm) : null; } catch { g = null; }
    }
    if (g) out.add(g);
  }
  return out;
}

/** "Week feels like a 6.0 (2 = start, 11 = a little past your limits)" @returns {string} '' for weeks without a stair level */
export function stairText(plan, weekN, model, lang) {
  const w = (plan.weeks || []).find(x => x.n === weekN);
  if (!w || typeof w.stair_level !== 'number') return '';
  // v1.2 (review 08 minor 16): '2' / '2.6', never 'a 2.0' / 'a 11.0'
  const lv = Math.round(w.stair_level * 10) / 10;
  return model.t(lang, 'plan.stair_level', { level: Number.isInteger(lv) ? String(lv) : lv.toFixed(1) });
}
