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

/** 'a, b and c' / 'a, b y c' (v0.4 fix round 2 / F3; R2-GEN-08; RECHECK v0.4 03 / 08 minors: 'El lunes, miércoles, viernes', 'Monday,
 *  Thursday'); Spanish 'e' before a word that starts with i / hi; a plain comma list when the model has no 'list.and' */
export function listAnd(model, lang, items) {
  const xs = (items || []).filter(x => x !== null && x !== undefined && x !== '').map(String);
  if (xs.length < 2 || !model.has('en', 'list.and')) return xs.join(', ');
  let and = model.t(lang, 'list.and');
  const last = xs[xs.length - 1];
  if (lang === 'es' && and === 'y' && /^(i|hi)(?!e)/i.test(last)) and = 'e';
  return xs.slice(0, -1).join(', ') + ' ' + and + ' ' + last;
}
/** 'a, b or c' / 'a, b o c' (v0.6 words, sample 05 minor: 'pull-up bar, suspension trainer (TRX) would add'); Spanish 'u' before a word that
 *  starts with o / ho; a plain comma list when the model has no 'list.or' */
export function listOr(model, lang, items) {
  const xs = (items || []).filter(x => x !== null && x !== undefined && x !== '').map(String);
  if (xs.length < 2 || !model.has('en', 'list.or')) return xs.join(', ');
  let or = model.t(lang, 'list.or');
  const last = xs[xs.length - 1];
  if (lang === 'es' && or === 'o' && /^(o|ho)/i.test(last)) or = 'u';
  return xs.slice(0, -1).join(', ') + ' ' + or + ' ' + last;
}

/** the v0.6 words rules (rules.render.v6), or {} */
function V6(model) { return (model.rules.render && model.rules.render.v6) || {}; }

/**
 * v0.6 words (sample 05 major: 'Circuits: the rounds stay and the work time per station climbs week by week' over a plan that adds a 5th round
 * in week 7 and raises the time every second week; R4-PRG-03 the rule the person applies must be the real one): the circuit's rounds and
 * work seconds told from the weeks themselves (the first training block that holds a circuit).
 * @returns {{rounds:string, when:string, from:number, to:number, flat:boolean, rounds_change:boolean}|null}
 */
export function circuitStory(plan, model, lang) {
  const all = (plan.weeks || []).filter(w => w.circuit && typeof w.circuit.work_s === 'number' && typeof w.circuit.rounds === 'number');
  if (!all.length) return null;
  const tb = all[0].training_block;
  const ws = all.filter(w => w.training_block === tb).sort((a, b) => a.n - b.n);
  const t = (k, a) => model.t(lang, k, a);
  const r0 = ws[0].circuit.rounds;
  const steps = [];
  for (let i = 1; i < ws.length; i++) if (ws[i].circuit.rounds > ws[i - 1].circuit.rounds) steps.push({ to: ws[i].circuit.rounds, week: ws[i].n });
  const rounds = steps.length ? t('circuit.rounds_up', { from: r0, steps: listAnd(model, lang, steps.map(x => t('circuit.rounds_step', x))) }) : t('circuit.rounds_stay', { n: r0 });
  const up = [];
  for (let i = 1; i < ws.length; i++) if (ws[i].circuit.work_s > ws[i - 1].circuit.work_s) up.push(ws[i].n);
  const from = ws[0].circuit.work_s, to = ws[ws.length - 1].circuit.work_s;
  if (!up.length) return { rounds, when: '', from, to, flat: true, rounds_change: steps.length > 0 };
  const gaps = up.map((n, i) => n - (i ? up[i - 1] : ws[0].n));
  let when;
  if (gaps.every(g => g === gaps[0]) && up.length > 1) when = gaps[0] === 1 ? t('circuit.time_every_week') : t('circuit.time_every_n', { n: gaps[0] });
  else when = t(up.length === 1 ? 'circuit.time_week_one' : 'circuit.time_weeks', { weeks: listAnd(model, lang, up.map(String)) });
  return { rounds, when, from, to, flat: false, rounds_change: steps.length > 0 };
}

// arguments that are read inside a sentence ('on Monday, Wednesday and Friday'): arrays are joined with 'and'
const AND_ARGS = ['day', 'days', 'weekday'];

function resolveValue(name, value, model, lang, all) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    const parts = value.map(v => resolveValue(name, v, model, lang, all));
    return AND_ARGS.includes(name) ? listAnd(model, lang, parts) : parts.join(', ');
  }
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
  const grouped = model.has('en', 'changes.at_target_group');
  const gained = grouped ? groupsGaining(plan, w, model) : new Set();
  const heldSeen = new Set();
  // v0.6 words (sample 04 major: a fly went 2 -> 4 sets in one week and the line said '+1 set'; R4-PRG-03): a set change is said once per
  // exercise, from the real sets of the week before to this week's
  const X = V6(model);
  const pw = (plan.weeks || []).find(x => x.n === weekN - 1) || null;
  const slotSets = (wk, id) => { if (!wk) return null; for (const d of wk.days || []) for (const b of d.blocks || []) for (const it of b.items || []) if (it.slot_id === id && it.role !== 'test') return it; return null; };
  const slotDone = new Set();
  let blockLines = [];
  // engine 0.6 integration (G-190): the volume package records one change per exercise with its planned step ('changes.set_added', or
  // 'changes.sets_added_n' with n, G-109); the words package prints that step with the sets the week before and this week (G-164).
  // Both keys are read here. The printed 'from -> to' is the item's real sets; next to a test week, where the test takes the place of
  // the tested lift's top set and the printed sets differ from the planned step, the plain line with the planned step is kept.
  const testNext = !!(w.test || (pw && pw.test));
  for (const ch of w.changes || []) {
    if (!ch || !ch.key) continue;
    const args = { ...(ch.args || {}) };
    for (const k of Object.keys(args)) if (/pct|percent|rate/i.test(k)) delete args[k];
    let key = ch.key;
    if (X.changes_from_sets && ['changes.set_added', 'changes.sets_added_n', 'changes.bonus_added'].includes(key) && args.slot_id) {
      if (slotDone.has(args.slot_id)) continue;
      slotDone.add(args.slot_id);
      const now = slotSets(w, args.slot_id), before = slotSets(pw, args.slot_id);
      const a = now && typeof now.sets === 'number' ? now.sets : null;
      const b = before && typeof before.sets === 'number' ? before.sets : 0;
      const planned = key === 'changes.sets_added_n' && typeof args.n === 'number' ? args.n : 1;
      if (key !== 'changes.bonus_added') {
        if (a !== null && b > 0 && a - b >= 1 && (!testNext || a - b === planned) && model.has('en', 'changes.sets_added_n')) {
          key = a - b === 1 && model.has('en', 'changes.set_added_ft') ? 'changes.set_added_ft' : 'changes.sets_added_n'; args.n = a - b; args.from = b; args.to = a;
        } else if (planned > 1 && model.has('en', 'changes.sets_added_n_plain')) {
          key = 'changes.sets_added_n_plain'; args.n = planned;
        } else key = planned > 1 ? key : 'changes.set_added';
      }
    }
    // (the circuit wording in the singular: 'more than 1 rep left', sample 05 minor)
    // v0.4 fix round 2 / F3 (PER-02; RECHECK v0.4 08 major / 02, 04 minors: 'New exercise block: one small change on some exercises' in weeks
    // where nothing changed): the line counts what changes; with no change it says the exercises stay
    if (key === 'changes.new_exercise_block' && model.has('en', 'changes.new_exercise_block_n')) {
      const n = blockChangeCount(plan, w);
      if (n !== null) { key = n === 0 ? 'changes.new_exercise_block_same' : n === 1 ? 'changes.new_exercise_block_one' : 'changes.new_exercise_block_n'; args.n = n; }
      // v0.6 words (sample 07 minor: '11 exercises change a little' did not name them): what changes, day by day
      if (n && X.block_changes_by_day && model.has('en', 'changes.block_swaps_day')) blockLines = blockChangeLines(plan, w, model, lang);
    }
    // (RECHECK v0.4 05 minor: 'add a little load or reps' in a circuit whose work time and effort already climb that week)
    if (key === 'changes.load_up' && w.circuit && typeof w.circuit.work_s === 'number' && model.has('en', 'changes.load_up_circuit')) {
      const pw = (plan.weeks || []).find(x => x.n === w.n - 1);
      const longer = !!(pw && pw.circuit && typeof pw.circuit.work_s === 'number' && w.circuit.work_s > pw.circuit.work_s);
      key = longer ? 'changes.load_up_circuit' : 'changes.load_up_circuit_same';
      args.s = w.circuit.work_s;
      args.rir = w.planned_rir ? (w.planned_rir.min === w.planned_rir.max ? String(w.planned_rir.min) : w.planned_rir.min + '-' + w.planned_rir.max) : '';
      if (args.rir === '1' && model.has('en', key + '_one')) key += '_one';
    }
    // (v0.6 words, sample 01 minor: 'Same sets: add a little load or reps' printed over a week of rep-max tests)
    if (key === 'changes.load_up' && w.test && (w.test.items || []).includes('strength') && model.has('en', 'changes.load_up_test')) key = 'changes.load_up_test';
    if (grouped && key === 'changes.at_cap' && typeof args.muscle === 'string') {
      const g = groupOfLine(model, args.muscle);
      if (g) {
        if (gained.has(g) || heldSeen.has(g)) continue;
        heldSeen.add(g);
        key = 'changes.at_target_group';
        for (const k of Object.keys(args)) delete args[k];
        args.group = 'group.' + g;
      }
    }
    const s = tr(model, lang, key, args);
    if (!seen.has(s)) { seen.add(s); out.push(s); }
    if (blockLines.length) { for (const l of blockLines) if (!seen.has(l)) { seen.add(l); out.push(l); } blockLines = []; }
  }
  // v0.6 words (sample 05 major: week 7's list never said that a 5th round came in): a circuit week that adds a round says so, next to
  // its work time
  if (w.circuit && pw && pw.circuit && typeof w.circuit.rounds === 'number' && typeof pw.circuit.rounds === 'number' && w.circuit.rounds > pw.circuit.rounds && model.has('en', 'changes.circuit_rounds_up')) {
    const k = w.circuit.rounds - pw.circuit.rounds === 1 ? 'changes.circuit_rounds_up' : 'changes.circuit_rounds_up_n';
    const line = tr(model, lang, k, { from: pw.circuit.rounds, to: w.circuit.rounds });
    const i = out.findIndex(x => x === tr(model, lang, 'changes.circuit_longer', { work_s: w.circuit.work_s }));
    out.splice(i >= 0 ? i + 1 : 0, 0, line);
  }
  return out;
}

/** 'Tuesday: Single-Arm DB Row → Seal Row - DB; Lat Pulldown → Lat Pulldown - overhand grip' - one line per day, in weekday order */
function blockChangeLines(plan, w, model, lang) {
  const pw = (plan.weeks || []).find(x => x.n === w.n - 1);
  if (!pw) return [];
  const name = (it) => {
    const n = model.t(lang, it.name_key);
    return it.detail && it.detail.key && model.has('en', it.detail.key) && model.has('en', 'ui.plan.detail') ? model.t(lang, 'ui.plan.detail', { name: n, detail: model.t(lang, it.detail.key) }) : n;
  };
  const items = (wk) => {
    const m = new Map();
    for (const d of wk.days || []) for (const b of d.blocks || []) for (const it of b.items || []) {
      if (!it.exercise_id || !it.name_key || it.role === 'test' || it.bucket === 'TEST' || ['warmup', 'cooldown', 'aerobic'].includes(b.kind)) continue;
      m.set(it.slot_id, { it, weekday: d.weekday });
    }
    return m;
  };
  const a = items(pw), b = items(w);
  const byDay = new Map();
  for (const [id, x] of b) {
    const y = a.get(id);
    if (!y || (y.it.exercise_id === x.it.exercise_id && ((y.it.detail && y.it.detail.key) || '') === ((x.it.detail && x.it.detail.key) || ''))) continue;
    if (!byDay.has(x.weekday)) byDay.set(x.weekday, []);
    byDay.get(x.weekday).push(name(y.it) + ' → ' + name(x.it));
  }
  return WEEKDAYS.filter(d => byDay.has(d)).map(d => model.t(lang, 'changes.block_swaps_day', { dayname: model.t(lang, 'weekday.' + d), list: byDay.get(d).join('; ') }));
}

/** how many exercises of week w differ from the week before (another exercise or another detail in the same slot; tests, warm-ups and
 *  cardio aside), or null when there is no week before */
function blockChangeCount(plan, w) {
  const pw = (plan.weeks || []).find(x => x.n === w.n - 1);
  if (!pw) return null;
  const sig = (wk) => {
    const m = new Map();
    for (const d of wk.days || []) for (const b of d.blocks || []) for (const it of b.items || []) {
      if (!it.exercise_id || it.role === 'test' || it.bucket === 'TEST' || ['warmup', 'cooldown', 'aerobic'].includes(b.kind)) continue;
      m.set(it.slot_id, it.exercise_id + '|' + ((it.detail && it.detail.key) || ''));
    }
    return m;
  };
  const a = sig(pw), b = sig(w);
  let n = 0;
  for (const [id, v] of b) if (a.has(id) && a.get(id) !== v) n++;
  return n;
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
    if (!ch || !['changes.set_added', 'changes.sets_added_n', 'changes.bonus_added'].includes(ch.key) || !ch.args) continue;
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
