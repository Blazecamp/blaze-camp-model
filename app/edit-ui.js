// app/edit-ui.js - the plan screen's editing: which edits a tap makes (swap, sets - / +, remove, add an exercise, a block on or off),
// the library search for "Add exercise", the undo history and the short info lines for what an edit changed against the plan.
// The edits themselves are the engine's (engine/edit.mjs > applyPlanEdits): the plan is an editable template (COACH-CX CX-02 /
// CX-04: "it should be all editable as they need to"; COACH-R4 R4-SES-04: the person picks what to keep or take away). Conflicts
// are information only: the edit still applies (CX-04). Pure (no DOM, no storage): edits live in page memory only (R3-GEN-01).
import { NOT_SHOWN_STATUS } from '../engine/library.mjs';

/** the day kinds the person edits from the day card (an aerobic, play or sport day has no exercise lines to tune) */
export const EDIT_DAY_KINDS = ['main', 'optional'];
/** blocks that fold into one line on the card (warm-up, cool-down): their rows are edited, the block has no switch */
const LINE_BLOCKS = ['warmup', 'cooldown'];
/** blocks an added exercise never goes into (a test, a circuit, the warm-up / cool-down lines) */
const NO_ADD_BLOCKS = ['warmup', 'cooldown', 'test', 'circuit', 'aerobic'];
/** library statuses the add search never lists: proposed records (neck work) and rows the coach marked not selectable (R4-LIB-01) */
const NO_ADD_STATUS = [...NOT_SHOWN_STATUS, 'live_library_not_selectable'];
/** H01: never a band, chain or weight releaser (also checked on the name, the safe side) */
const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- ]releasers?)\b/i;

const isNum = (v) => typeof v === 'number' && isFinite(v);
const weekOf = (plan, n) => (plan.weeks || []).find(w => w.n === n) || null;
const dayOf = (w, wd) => (w && (w.days || []).find(d => d.weekday === wd)) || null;
const itemsOf = (d) => (d ? (d.blocks || []).flatMap(b => b.items || []) : []);

/** the item of a slot on one day of one week, or null */
export function itemAt(plan, n, weekday, slotId) {
  return itemsOf(dayOf(weekOf(plan, n), weekday)).find(it => it.slot_id === slotId) || null;
}

/** the block an item sits in on one day of one week, or null */
export function blockOf(plan, n, weekday, slotId) {
  const d = dayOf(weekOf(plan, n), weekday);
  return d ? (d.blocks || []).find(b => (b.items || []).some(it => it.slot_id === slotId)) || null : null;
}

/** an exercise line the person can edit (not a test, not a WOD or a cardio colour) */
export function canEdit(it) { return !!(it && it.slot_id && it.exercise_id && it.role !== 'test' && !it.wod && !it.aerobic); }
/** sets - / + apply to a line with a set count of its own (a circuit station runs on the circuit's rounds) */
export function canTune(it) { return canEdit(it) && isNum(it.sets) && !it.circuit; }

/**
 * The weeks (from `fromWeek` on) whose `weekday` holds `slotId` with the same exercise: "this exercise in this line". A later
 * exercise block that put another exercise in the same line is left alone.
 */
export function sameLineWeeks(plan, weekday, slotId, exerciseId, fromWeek) {
  const out = [];
  for (const w of plan.weeks || []) {
    if (fromWeek && w.n < fromWeek) continue;
    const it = itemsOf(dayOf(w, weekday)).find(x => x.slot_id === slotId);
    if (it && it.exercise_id === exerciseId) out.push(w.n);
  }
  return out;
}

/** Swap: the new exercise in this line, in every week that holds the same exercise there (sets, position and block kept; G-312) */
export function swapEdits(plan, n, weekday, slotId, exerciseId) {
  const it = itemAt(plan, n, weekday, slotId);
  if (!canEdit(it) || it.exercise_id === exerciseId) return [];
  const weeks = sameLineWeeks(plan, weekday, slotId, it.exercise_id);
  return weeks.length ? [{ op: 'swap_exercise', weekday, slot_id: slotId, exercise_id: exerciseId, weeks }] : [];
}

/**
 * Sets - / + ("tune down / up"): one set less or more in the shown week and every later week of the same exercise in this line,
 * each week from its own number (the stairway keeps its shape), never under 1 set. Weeks that land on the same number share one
 * set_sets edit.
 */
export function tuneEdits(plan, n, weekday, slotId, delta) {
  const it = itemAt(plan, n, weekday, slotId);
  if (!canTune(it) || !delta) return [];
  const byValue = new Map();
  for (const wn of sameLineWeeks(plan, weekday, slotId, it.exercise_id, n)) {
    const x = itemAt(plan, wn, weekday, slotId);
    if (!x || !isNum(x.sets)) continue;
    const v = Math.max(1, x.sets + delta);
    if (v === x.sets) continue;
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(wn);
  }
  return [...byValue.entries()].sort((a, b) => a[1][0] - b[1][0]).map(([sets, weeks]) => ({ op: 'set_sets', weekday, slot_id: slotId, sets, weeks }));
}

/** Remove: the exercise leaves this day in every week that holds it in this line (the person owns the plan, R4-SES-04) */
export function removeEdits(plan, n, weekday, slotId) {
  const it = itemAt(plan, n, weekday, slotId);
  if (!canEdit(it)) return [];
  const weeks = sameLineWeeks(plan, weekday, slotId, it.exercise_id);
  return weeks.length ? [{ op: 'remove_exercise', weekday, slot_id: slotId, weeks }] : [];
}

/** the weeks whose `weekday` is a day the person edits (the same template day all plan long) */
export function editableWeeks(plan, weekday) {
  return (plan.weeks || []).filter(w => { const d = dayOf(w, weekday); return d && EDIT_DAY_KINDS.includes(d.kind); }).map(w => w.n);
}

/** Add exercise: a library exercise on this day, in every week of the plan, in the chosen block (engine/edit.mjs add_exercise) */
export function addEdits(plan, weekday, exerciseId, block, sets) {
  const weeks = editableWeeks(plan, weekday);
  if (!weeks.length || !exerciseId) return [];
  const e = { op: 'add_exercise', weekday, exercise_id: exerciseId, sets: Math.max(1, Math.round(sets || 3)), weeks };
  if (block) e.block = block;
  return [e];
}

/** Block switch: a block of this day off or back on, in every week (the engine's set_block; R3-SES-02, R5-GRD-06) */
export function blockEdits(plan, weekday, kind, on) {
  const weeks = (plan.weeks || []).filter(w => (dayOf(w, weekday) || { blocks: [] }).blocks.some(b => b.kind === kind && (b.on !== false) !== on)).map(w => w.n);
  return weeks.length ? [{ op: 'set_block', weekday, block: kind, on, weeks }] : [];
}

/** the blocks of a day the person may switch off and on: the engine marks them (block.toggle), the warm-up / cool-down lines aside */
export function blockSwitches(plan, n, weekday) {
  const d = dayOf(weekOf(plan, n), weekday);
  if (!d || !EDIT_DAY_KINDS.includes(d.kind)) return [];
  const out = [];
  for (const b of d.blocks || []) {
    if (!b.toggle || LINE_BLOCKS.includes(b.kind) || !(b.items || []).length || out.some(x => x.kind === b.kind)) continue;
    out.push({ kind: b.kind, on: b.on !== false });
  }
  return out;
}

/** the blocks an added exercise can go into on this day, in the day's order, and the one the exercise itself belongs to */
export function addBlocks(plan, n, weekday, model, exerciseId) {
  const d = dayOf(weekOf(plan, n), weekday);
  if (!d) return { kinds: [], def: null };
  const kinds = [];
  for (const b of d.blocks || []) if (!NO_ADD_BLOCKS.includes(b.kind) && b.circuit == null && !kinds.includes(b.kind)) kinds.push(b.kind);
  if (!kinds.includes('accessories')) kinds.push('accessories');
  let own = null;
  if (exerciseId && model.hasEx(exerciseId)) {
    const ex = model.ex(exerciseId);
    const bucket = (ex.default_in_slots || []).find(x => x !== 'FOCUS') || (ex.slots || []).find(x => x !== 'FOCUS') || (ex.slots || [])[0];
    try { own = bucket ? model.bucket(bucket).block : null; } catch (e) { own = null; }
  }
  return { kinds, def: own && kinds.includes(own) ? own : 'accessories' };
}

const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** does an exercise's equipment fit the plan's kit (one of its set-ups is all in the kit, and its machine is there)? */
export function fitsKit(ex, kit) {
  if (!kit || !Array.isArray(kit.tokens)) return true;
  const toks = new Set(kit.tokens);
  const eq = ex.equipment || { any_of: [[]], machine: null };
  if (eq.machine && !(kit.machines || []).includes(eq.machine)) return false;
  const setups = eq.any_of && eq.any_of.length ? eq.any_of : [[]];
  return setups.some(su => su.every(tk => toks.has(tk)));
}

/**
 * The library the "Add exercise" search lists for this plan: catalog exercises that fit the plan's equipment and the person's age
 * (60+: never the never-list, H12; under 18: youth-suitable), optional add-ons included (R4-LIB-01), never a proposed record
 * (neck work), never a band, chain or releaser (H01), never a test, a cardio colour or a medball in a physique plan (H11).
 * @returns {Array<{id, name, addon}>}
 */
export function libraryPool(plan, model, lang) {
  const R = model.rules;
  const D = (plan.meta && plan.meta.derived) || {};
  const kit = D.D8_kit || null;
  const age = isNum(D.age) ? D.age : null;
  const older = age !== null && R.population && R.population.older && age >= R.population.older.from_age;
  const youth = age !== null && R.levels && isNum(R.levels.youth_age) && age < R.levels.youth_age;
  const neverTags = (older && R.population.older.never_tags) || [];
  const banned = (R.equipment && R.equipment.banned_tokens) || [];
  const physique = (plan.meta && plan.meta.goal) === 'muscle';
  const out = [];
  for (const ex of model.exercises()) {
    if (NO_ADD_STATUS.includes(ex.status) || !['exercise', 'drill'].includes(ex.kind) || !(ex.slots || []).length) continue;
    if (ex.primary_muscle === 'neck') continue;
    const name = model.has(lang, ex.name_key) ? model.t(lang, ex.name_key) : model.t('en', ex.name_key);
    if (BAND_RE.test(ex.id) || BAND_RE.test(model.t('en', ex.name_key))) continue;
    if ((ex.equipment && ex.equipment.any_of || []).some(su => su.some(tk => banned.includes(tk)))) continue;
    if (!fitsKit(ex, kit)) continue;
    if (older && (ex.older_ok === false || (ex.tags || []).some(tg => neverTags.includes(tg)))) continue;
    if (youth && ex.youth_ok === false) continue;
    if (physique && ex.medball) continue;
    out.push({ id: ex.id, name, addon: ex.status === 'optional_addon', key: fold(name) });
  }
  out.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return out;
}

/**
 * The search over that pool: every word of the query in the name (accents ignored), names that start with the query first. With
 * no query: the plan's own offered add-ons (meta.addons), then nothing more (the list stays short).
 */
export function searchLibrary(pool, query, plan, limit) {
  const max = limit || 12;
  const q = fold(query).trim();
  if (!q) {
    const offered = ((plan && plan.meta && plan.meta.addons) || []).map(a => a && a.exercise_id);
    return pool.filter(x => offered.includes(x.id)).slice(0, max);
  }
  const words = q.split(/\s+/).filter(Boolean);
  const hits = pool.filter(x => words.every(wd => x.key.includes(wd)));
  const starts = hits.filter(x => x.key.startsWith(q)), rest = hits.filter(x => !x.key.startsWith(q));
  return [...starts, ...rest].slice(0, max);
}

// ------------------------------------------------------------------------------------------------- undo history

/** a fresh history for a generated plan: edits live in page memory only, never stored or sent (R3-GEN-01) */
export function newHistory(base) { return { base, steps: [] }; }
/** the plan the page shows now */
export function current(h) { return h.steps.length ? h.steps[h.steps.length - 1].plan : h.base; }
/** one tap's result: {plan, conflicts, edits} */
export function pushStep(h, step) { return { base: h.base, steps: [...h.steps, step] }; }
/** Undo last */
export function undoLast(h) { return { base: h.base, steps: h.steps.slice(0, -1) }; }
/** Undo all: back to the generated plan */
export function undoAll(h) { return { base: h.base, steps: [] }; }

// ------------------------------------------------------------------------------------------------- what an edit changed

export const conflictKey = (c) => [c.code, c.week, c.weekday || '', c.slot_id || '', c.group || ''].join('|');

/** the conflicts an edit made: those the generated plan did not already have (engine/edit.mjs conflictsOf) */
export function newConflicts(conflicts, baseKeys) {
  const seen = new Set(baseKeys || []);
  return (conflicts || []).filter(c => !seen.has(conflictKey(c)));
}

/** '3-8' / '3, 5, 9-12': a list of week numbers, runs joined */
export function weekList(ns) {
  const xs = [...new Set(ns)].sort((a, b) => a - b), out = [];
  for (let i = 0; i < xs.length; i++) {
    let j = i;
    while (j + 1 < xs.length && xs[j + 1] === xs[j] + 1) j++;
    out.push(j > i ? xs[i] + '-' + xs[j] : String(xs[i]));
    i = j;
  }
  return out.join(', ');
}

/**
 * Short, friendly info lines ("This week: Back: 14 sets (plan: 15) · also weeks 2-4"), information only (CX-04). One line per group
 * or exercise: the shown week's numbers when it is concerned (those lines first), else the first week's ("Week 9: ..."), and the
 * other weeks it applies to. At most `max` lines; `other` counts the rest. `t` gives the app's words (app/i18n.js), the model the
 * group, day and exercise names.
 * @returns {{lines:string[], other:number}}
 */
export function conflictLines(conflicts, plan, model, lang, t, week, max) {
  const has = (k) => model.has('en', k);
  const mt = (k) => (has(k) ? model.t(lang, k) : k);
  const fmt = (v) => (isNum(v) ? String(Math.round(v * 100) / 100) : String(v));
  const nameOf = (c) => { const it = itemAt(plan, c.week, c.weekday, c.slot_id); return it && it.name_key && has(it.name_key) ? model.t(lang, it.name_key) : ''; };
  const msg = (c) => {
    const a = { actual: fmt(c.actual), limit: fmt(c.limit) };
    if (c.code === 'group_below_target') return t('edit.c.below_target', { group: mt('group.' + c.group), ...a });
    if (c.code === 'group_below_floor') return t('edit.c.below_floor', { group: mt('group.' + c.group), ...a });
    if (c.code === 'group_sets_decreased') return t('edit.c.decreased', { group: mt('group.' + c.group), ...a });
    if (c.code === 'sets_above_max') return t('edit.c.above_max', { name: nameOf(c), ...a });
    if (c.code === 'sets_below_min') return t('edit.c.below_min', { name: nameOf(c), ...a });
    if (c.code === 'session_size_above_range') return t('edit.c.size', { day: mt('weekday.' + c.weekday), ...a });
    return '';
  };
  const groups = new Map();
  for (const c of conflicts || []) {
    const k = [c.code, c.group || '', c.weekday || '', c.slot_id || ''].join('|');
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }
  const rows = [];
  for (const list of groups.values()) {
    const here = list.find(c => c.week === week);
    const c = here || list.slice().sort((a, b) => a.week - b.week)[0];
    const m = msg(c);
    if (!m) continue;
    // 'This week: Back: 12 sets (plan: 16) · also weeks 2-4' / 'Week 9: Back: 7 sets (plan: 8) · also weeks 10-12'
    const label = here ? t('edit.c.this_week') : t('edit.c.week_one', { n: c.week });
    const rest = list.map(x => x.week).filter(n => n !== c.week);
    const also = rest.length ? ' · ' + t(rest.length === 1 ? 'edit.c.also_one' : 'edit.c.also_many', { list: weekList(rest) }) : '';
    rows.push({ here: !!here, first: Math.min(c.week, ...rest), text: label + ': ' + m + also });
  }
  rows.sort((a, b) => (a.here === b.here ? a.first - b.first : a.here ? -1 : 1));
  const lim = max || 5;
  return { lines: rows.slice(0, lim).map(r => r.text), other: Math.max(0, rows.length - lim) };
}
