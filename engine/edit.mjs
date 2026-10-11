// engine/edit.mjs - plan edits (engine 0.5.0). The plan is an editable template (COACH-CX CX-04: "it should be all editable as
// they need to"; CX-02 / CX-03: "they should be able to edit accordingly ... on that week or that day doesn't matter";
// COACH-R4 R4-SES-02 / R4-SES-04: the user adds or removes exercises and picks what to keep).
//
//   applyPlanEdits(plan, edits, model) -> { plan, edited: true, applied, conflicts, priorValidationDiscarded: true }
//
// Edit operations (every `weeks` is a week number, a list of week numbers or 'all'; default 'all'):
//   { op: 'set_sets',        weekday, slot_id, sets, weeks }                 sets of one exercise on one day, in one or more weeks
//   { op: 'remove_exercise', weekday, slot_id, weeks }                       take an exercise off a day
//   { op: 'add_exercise',    weekday, exercise_id, sets, weeks, block?, after_slot_id? }   add a catalog exercise to a day
//   { op: 'set_block',       weekday, block, on, weeks }                     switch a block of a day off or back on (core, athletic ...)
//
// After the edits (reviews/claude-codex-audit.md MEDIUM-1 / L3 / L4, coach_answers_codex engineering requirement 3):
//   * every touched week's totals are RECOMPUTED from its items: weekly sets per muscle / line / group (helpers 0.25, a set counts
//     at most 1.0 to a group), main-day sets, direct sets, total sets, the rise against the week before, exercises per day, the
//     day's estimated minutes (an estimate, CT-01), and the plan summary;
//   * the plan says so itself: plan.edited = true, plan.edits = the applied operations, meta.warnings carries warning.plan_edited;
//   * NO stale validation survives: plan.validation is recomputed on the edited plan and stamped { edited: true }; the checks
//     that describe the GENERATED template (session size, target reached, never-drop) do not judge an edited plan (validate.mjs);
//   * `conflicts` lists where the edited plan leaves the template's own rules, each with a class - 'bound' (sets per exercise),
//     'plan_shape' (a group under its floor or its planned target, sets that drop) or 'info' (session size). They are information:
//     an edit is never refused or silently repaired, and other sets are never moved.
// The input plan is never mutated. Pure: no I/O, no clock, no randomness. Nothing is stored (R3-GEN-01).
import { EngineError, EPS, WEEKDAYS, round2, roundHalfUp } from './util.mjs';
import { linesOf, lineCredits, groupCredits } from './lines.mjs';
import { setCost } from './estimate.mjs';
import { validatePlan } from './validate.mjs';
import { videoOf, isCarry, carryReps } from './library.mjs';

const OPS = ['set_sets', 'remove_exercise', 'add_exercise', 'set_block'];
const RES_KINDS = ['resistance', 'isolation', 'focus'];
const clone = (o) => JSON.parse(JSON.stringify(o));
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const round4 = (x) => (x < 0 ? -1 : 1) * Math.floor(Math.abs(x) * 1e4 + 0.5 + EPS) / 1e4;

function bad(code, message, details) { throw new EngineError('edit.' + code, message, details); }

function weeksOf(plan, sel) {
  const all = plan.weeks.map(w => w.n);
  if (sel === undefined || sel === null || sel === 'all') return all;
  const list = Array.isArray(sel) ? sel : [sel];
  for (const n of list) if (!Number.isSafeInteger(n) || !all.includes(n)) bad('week', `unknown week ${n}`, { week: n });
  return [...new Set(list)].sort((a, b) => a - b);
}

function kindOf(model, bucket) { try { return model.bucket(bucket).kind; } catch { return null; } }
function isResItem(model, it) { return RES_KINDS.includes(kindOf(model, it.bucket)) && it.role !== 'test' && !it.circuit; }
function onBlocks(day) { return (day.blocks || []).filter(b => b.on !== false); }
function countsNow(it) { return isNum(it.sets) && it.sets > 0; }

/** the minutes one set of an item is estimated at (estimate.mjs; information only) */
function itemMinutes(it, model, derived, week) {
  if (!it.exercise_id || !isNum(it.sets)) return 0;
  try { return setCost({ slot_id: it.slot_id, bucket: it.bucket, role: it.role, time_class: null }, { laterality: it.laterality, bucket: it.bucket }, model, derived, week).minutes; } catch { return 0; }
}

/**
 * Apply edits to a generated plan and recompute everything that depends on them.
 * @param {import('./util.mjs').Plan} plan a plan/2 with status 'ok' (generated or already edited)
 * @param {Array<object>} edits edit operations (see the file header)
 * @param {import('./util.mjs').Model} model
 * @returns {{plan:object, edited:true, applied:Array<object>, conflicts:Array<object>, priorValidationDiscarded:true}}
 */
export function applyPlanEdits(plan, edits, model) {
  if (!plan || plan.schema !== 'plan/2' || plan.status !== 'ok' || !Array.isArray(plan.weeks)) bad('plan', 'applyPlanEdits needs a plan/2 with status ok');
  if (!Array.isArray(edits)) bad('edits', 'edits must be an array');
  const R = model.rules;
  const next = clone(plan);
  // MEDIUM-1: the generated plan's validation result never survives an edit; it is recomputed below
  next.validation = null;
  const derived = (next.meta && next.meta.derived) || {};
  const changedDays = new Map();   // 'week|weekday' -> minutes delta
  const touch = (n, wd, dMin) => { const k = n + '|' + wd; changedDays.set(k, (changedDays.get(k) || 0) + dMin); };
  const applied = [];
  const dayOf = (w, wd) => (w.days || []).find(d => d.weekday === wd) || null;
  const findItem = (day, slotId) => { for (const b of day.blocks || []) { const i = (b.items || []).findIndex(it => it.slot_id === slotId); if (i >= 0) return { b, i, it: b.items[i] }; } return null; };
  const changeover = isNum(R.time_model.changeover_min_per_exercise) ? R.time_model.changeover_min_per_exercise : 0;

  edits.forEach((e, k) => {
    if (!e || typeof e !== 'object' || !OPS.includes(e.op)) bad('op', `edit ${k}: unknown op`, { edit: k });
    if (!WEEKDAYS.includes(e.weekday)) bad('weekday', `edit ${k}: unknown weekday`, { edit: k });
    const ws = weeksOf(next, e.weeks);
    let hits = 0;
    for (const n of ws) {
      const w = next.weeks[n - 1];
      const day = dayOf(w, e.weekday);
      if (!day) continue;
      if (e.op === 'set_sets') {
        if (!Number.isSafeInteger(e.sets) || e.sets < 0) bad('sets', `edit ${k}: sets must be a whole number >= 0`, { edit: k });
        const f = findItem(day, e.slot_id);
        if (!f || !isNum(f.it.sets)) continue;
        const d = e.sets - f.it.sets;
        touch(n, e.weekday, d * itemMinutes(f.it, model, derived, w) + (f.it.sets > 0 && e.sets === 0 ? -changeover : f.it.sets === 0 && e.sets > 0 ? changeover : 0));
        if (e.sets === 0) {
          // no sets left: the exercise leaves that week's day (the same as remove_exercise)
          f.b.items.splice(f.i, 1);
          day.easy_to_remove = (day.easy_to_remove || []).filter(x => x.slot_id !== e.slot_id);
          day.superset_recommendations = (day.superset_recommendations || []).filter(r => !(r.items || []).includes(e.slot_id));
        } else { f.it.sets = e.sets; f.it.edited = true; }
        hits++;
      } else if (e.op === 'remove_exercise') {
        const f = findItem(day, e.slot_id);
        if (!f) continue;
        touch(n, e.weekday, -(countsNow(f.it) ? f.it.sets * itemMinutes(f.it, model, derived, w) + changeover : 0));
        f.b.items.splice(f.i, 1);
        day.easy_to_remove = (day.easy_to_remove || []).filter(x => x.slot_id !== e.slot_id);
        day.superset_recommendations = (day.superset_recommendations || []).filter(r => !(r.items || []).includes(e.slot_id));
        hits++;
      } else if (e.op === 'add_exercise') {
        if (!model.hasEx(e.exercise_id)) bad('exercise', `edit ${k}: unknown exercise ${e.exercise_id}`, { edit: k });
        if (!Number.isSafeInteger(e.sets) || e.sets < 1) bad('sets', `edit ${k}: an added exercise needs 1 set or more`, { edit: k });
        const ex = model.ex(e.exercise_id);
        const bucket = (ex.default_in_slots && ex.default_in_slots.find(b => b !== 'FOCUS')) || (ex.slots || []).find(b => b !== 'FOCUS') || (ex.slots || [])[0];
        if (!bucket) bad('exercise', `edit ${k}: ${e.exercise_id} has no slot`, { edit: k });
        const bd = model.bucket(bucket);
        const blockKind = e.block || bd.block || 'accessories';
        let blk = (day.blocks || []).find(b => b.kind === blockKind && b.circuit == null);
        if (!blk) {
          const order = R.ordering.block_order;
          blk = { kind: blockKind, position: 0, movable: false, circuit: null, id: `blk.${String(e.weekday).toLowerCase()}-edit.${blockKind}.1`, toggle: true, removable: true, items: [] };
          const at = day.blocks.findIndex(b => order.indexOf(b.kind) > order.indexOf(blockKind));
          if (at < 0) day.blocks.push(blk); else day.blocks.splice(at, 0, blk);
          day.blocks.forEach((b, i) => { b.position = i; });
        }
        const used = (day.blocks || []).flatMap(b => b.items || []).map(it => { const m = /\.edit\.e(\d+)$/.exec(it.slot_id || ''); return m ? Number(m[1]) : 0; });
        const slotId = `${e.weekday}.edit.e${String(Math.max(0, ...used) + 1).padStart(2, '0')}`;
        // the dose of an added exercise is borrowed from the day's (else the week's) first exercise of the same kind: the same
        // rep range, effort and rest the plan already uses there - the person edits it like any other line
        const sameKind = (it) => it.exercise_id && it.reps && kindOf(model, it.bucket) === bd.kind && it.role !== 'test';
        const donor = (day.blocks || []).flatMap(b => b.items || []).find(sameKind) || (w.days || []).flatMap(d => (d.blocks || []).flatMap(b => b.items || [])).find(sameKind) || null;
        const carry = isCarry(ex, R);
        // (v0.5 / V2, R4-LIB-01: an add-on the plan offered keeps the dose it was offered with, and is no longer offered once added)
        const offered = ((next.meta && next.meta.addons) || []).find(a => a && a.exercise_id === ex.id) || null;
        const credits = carry || ex.tags.some(t => R.credit.never_credit_tags.includes(t)) ? {} : model.credits(ex, bucket);
        const item = {
          slot_id: slotId, station_id: null, bucket, role: 'added', origin: 'edit', group: ex.primary_muscle ? model.groupOf(ex.primary_muscle) : null,
          exercise_id: ex.id, name_key: ex.name_key, detail: null, text_key: null, cue_key: ex.cue_key || null,
          video: videoOf(model, ex),
          // v0.5 / V2 (COACH-R4 R4-LIB-02): an added carry or sled exercise is written by distance or time, never by borrowed reps
          sets: e.sets, reps: carry ? carryReps(ex, R) : (offered && offered.reps ? clone(offered.reps) : (donor ? clone(donor.reps) : null)), set_reps: null,
          effort: carry ? { type: 'intent', key: R.conditioning.carry.effort_key } : (donor && donor.effort ? { ...clone(donor.effort), last_set: null, intensifier: false } : null),
          rest: donor ? clone(donor.rest) : (carry && R.rest && Array.isArray(R.rest.core_s) ? { type: 'seconds', min: R.rest.core_s[0], max: R.rest.core_s[1] } : null), load: null, tempo_key: null, superset: null, laterality: ex.laterality || null, loading: null,
          credits, athletic: null, aerobic: null, circuit: null, wod: null, test: null, progression: !carry && donor && donor.progression ? clone(donor.progression) : null,
          notes: [], swaps: [], swap_notes: [], instead_of: null, flags: [], why: [], edited: true
        };
        const at = e.after_slot_id ? blk.items.findIndex(it => it.slot_id === e.after_slot_id) : -1;
        if (at >= 0) blk.items.splice(at + 1, 0, item); else blk.items.push(item);
        if (offered && next.meta && Array.isArray(next.meta.addons)) next.meta.addons = next.meta.addons.filter(a => a.exercise_id !== ex.id);
        touch(n, e.weekday, e.sets * itemMinutes(item, model, derived, w) + changeover);
        hits++;
      } else if (e.op === 'set_block') {
        if (typeof e.on !== 'boolean') bad('on', `edit ${k}: set_block needs on true or false`, { edit: k });
        const blocks = (day.blocks || []).filter(b => b.kind === e.block || b.id === e.block);
        for (const b of blocks) {
          const was = b.on !== false;
          if (was === e.on) continue;
          const min = (b.items || []).reduce((a, it) => a + (countsNow(it) ? it.sets * itemMinutes(it, model, derived, w) + changeover : 0), 0);
          touch(n, e.weekday, e.on ? min : -min);
          b.on = e.on;
          hits++;
        }
      }
    }
    if (!hits) bad('target', `edit ${k}: nothing matches (weekday / slot / block)`, { edit: k });
    applied.push({ ...clone(e), weeks: ws });
  });

  // ---- recompute the touched weeks from their items
  const AB = R.athletic.f2 && R.athletic.f2.ankle_block;
  // (the quick ankle prep block is outside the day's exercise count, as in engine/generate.mjs)
  const anklePrep = (it) => !!(AB && AB.outside_athlete_cap && it.bucket === 'AP_JUMP_LIMITED_KNEE' && ((it.flags || []).includes('ankle_block') || (it.athletic && it.athletic.key === 'low_contacts')));
  const X = linesOf(model);
  const touchedWeeks = new Set([...changedDays.keys()].map(k => Number(k.split('|')[0])));
  const before = new Map(plan.weeks.map(w => [w.n, w]));
  for (const n of [...touchedWeeks].sort((a, b) => a - b)) {
    const w = next.weeks[n - 1];
    const mus = {}, line = {}, grp = {}, lineMain = {}, grpMain = {}, direct = {};
    let total = 0, totalMain = 0;
    const groupCounts = {};
    for (const d of w.days || []) {
      const gc = {};
      let count = 0;
      for (const b of onBlocks(d)) for (const it of b.items || []) {
        if (!countsNow(it)) continue;
        if (!R.session.outside_cap_blocks.includes(b.kind) && it.role !== 'test' && !anklePrep(it)) count++;
        const cr = it.credits || {};
        for (const [m, c] of Object.entries(cr)) { mus[m] = (mus[m] || 0) + it.sets * c; if (c >= 1 - EPS) direct[m] = (direct[m] || 0) + it.sets; }
        for (const [l, c] of Object.entries(lineCredits(model, cr))) { line[l] = (line[l] || 0) + it.sets * c; if (d.kind === 'main') lineMain[l] = (lineMain[l] || 0) + it.sets * c; }
        for (const [g, c] of Object.entries(groupCredits(model, cr))) { grp[g] = (grp[g] || 0) + it.sets * c; if (d.kind === 'main') grpMain[g] = (grpMain[g] || 0) + it.sets * c; }
        if (isResItem(model, it)) { total += it.sets; if (d.kind === 'main') totalMain += it.sets; if (it.group && it.group !== 'core') gc[it.group] = (gc[it.group] || 0) + 1; }
      }
      // the unedited part of the week keeps the engine's own count of its sets: only the difference is applied below
      d.exercise_count = count;
      if (Object.keys(gc).length) groupCounts[d.weekday] = Object.fromEntries(R.muscles.groups.order.filter(g => gc[g]).map(g => [g, gc[g]]));
      const dm = changedDays.get(n + '|' + d.weekday);
      if (dm !== undefined && isNum(d.est_minutes)) { d.est_minutes = Math.max(0, roundHalfUp(d.est_minutes + dm)); d.est_minutes_edited = true; }
    }
    const old = before.get(n);
    // total sets: the generated week's number plus the difference the edits make to its set-and-rep exercises
    const sumRes = (wk) => (wk.days || []).reduce((a, d) => a + onBlocks(d).reduce((x, b) => x + (b.items || []).reduce((y, it) => y + (countsNow(it) && isResItem(model, it) ? it.sets : 0), 0), 0), 0);
    const sumResMain = (wk) => (wk.days || []).filter(d => d.kind === 'main').reduce((a, d) => a + onBlocks(d).reduce((x, b) => x + (b.items || []).reduce((y, it) => y + (countsNow(it) && isResItem(model, it) ? it.sets : 0), 0), 0), 0);
    w.total_resistance_sets = isNum(old.total_resistance_sets) ? old.total_resistance_sets + (total - sumRes(old)) : total;
    w.total_main_sets = isNum(old.total_main_sets) ? old.total_main_sets + (totalMain - sumResMain(old)) : totalMain;
    w.weekly_sets_by_muscle = Object.fromEntries(R.muscles.order.map(m => [m, round2(mus[m] || 0)]));
    w.direct_sets_by_muscle = Object.fromEntries(R.muscles.order.map(m => [m, round2(direct[m] || 0)]));
    w.weekly_sets_by_line = Object.fromEntries(X.order.map(l => [l, round2(line[l] || 0)]));
    w.main_sets_by_muscle = Object.fromEntries(X.order.map(l => [l, round2(lineMain[l] || 0)]));
    w.weekly_sets_by_group = Object.fromEntries(X.groups.map(g => [g, round2(grp[g] || 0)]));
    w.main_sets_by_group = Object.fromEntries(X.groups.map(g => [g, round2(grpMain[g] || 0)]));
    w.group_counts_by_day = groupCounts;
    w.edited = true;
  }
  // the rise against the week before, for every week (an edit moves its own week's rise and the next one's)
  for (let i = 0; i < next.weeks.length; i++) {
    const w = next.weeks[i], p = i ? next.weeks[i - 1] : null;
    w.rise_vs_prev = p && isNum(p.total_resistance_sets) && p.total_resistance_sets > 0 && isNum(w.total_resistance_sets) ? round4((w.total_resistance_sets - p.total_resistance_sets) / p.total_resistance_sets) : null;
  }

  // ---- the summary, recomputed
  const W = next.weeks;
  const S = next.summary || {};
  const rises = W.map(w => w.rise_vs_prev).filter(isNum);
  S.total_resistance_sets_by_week = W.map(w => w.total_resistance_sets);
  S.max_weekly_rise = rises.length ? round4(Math.max(...rises)) : 0;
  const series = (key, order) => { const out = {}; for (const m of order) if (W.some(w => isNum((w[key] || {})[m]))) out[m] = W.map(w => ((w[key] || {})[m] ?? 0)); return out; };
  S.sets_by_muscle_by_week = series('weekly_sets_by_muscle', R.muscles.order);
  S.sets_by_line_by_week = series('weekly_sets_by_line', X.order);
  S.sets_by_group_by_week = series('weekly_sets_by_group', R.muscles.groups.order);
  S.edited = true;
  next.summary = S;

  // ---- the plan says it was edited; where it leaves the template's own rules is listed, never repaired
  next.edited = true;
  next.edits = [...(Array.isArray(plan.edits) ? clone(plan.edits) : []), ...applied];
  next.meta = next.meta || {};
  next.meta.warnings = (next.meta.warnings || []).filter(x => x && x.key !== 'warning.plan_edited');
  next.meta.warnings.unshift({ code: 'plan_edited', key: 'warning.plan_edited' });
  const conflicts = conflictsOf(next, model);
  next.validation = { ...validatePlan(next, model), edited: true, generated_checks: 'not_applied_to_an_edited_plan' };
  return { plan: next, edited: true, applied, conflicts, priorValidationDiscarded: true };
}

/**
 * Where an edited plan leaves the template's own rules (information for the person; audit L4 classes).
 * @returns {Array<{code:string, class:'bound'|'plan_shape'|'info', week:number, weekday?:string, slot_id?:string, group?:string, actual:number, limit:number}>}
 */
function conflictsOf(plan, model) {
  const R = model.rules, out = [];
  const derived = (plan.meta && plan.meta.derived) || {};
  const L = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const maxEx = R.placement.max_sets_per_exercise[L], minEx = R.placement.min_sets;
  const size = plan.meta && plan.meta.session_size;
  const floorV = R.volume.floor.value;
  const days = plan.meta && plan.meta.days_per_week;
  const stair = new Map(((plan.meta && plan.meta.stairway) || []).map(b => [b.training_block, b]));
  for (let i = 0; i < plan.weeks.length; i++) {
    const w = plan.weeks[i], prev = i ? plan.weeks[i - 1] : null;
    for (const d of w.days || []) {
      for (const b of onBlocks(d)) for (const it of b.items || []) {
        if (!isResItem(model, it) || !isNum(it.sets) || it.sets === 0) continue;
        const where = { week: w.n, weekday: d.weekday, slot_id: it.slot_id };
        if (it.sets > maxEx) out.push({ code: 'sets_above_max', class: 'bound', ...where, actual: it.sets, limit: maxEx });
        if (it.sets < minEx) out.push({ code: 'sets_below_min', class: 'bound', ...where, actual: it.sets, limit: minEx });
      }
      if (size && ['main', 'optional'].includes(d.kind) && isNum(d.exercise_count) && d.exercise_count > size.range[1]) out.push({ code: 'session_size_above_range', class: 'info', week: w.n, weekday: d.weekday, actual: d.exercise_count, limit: size.range[1] });
    }
    if (w.block_type !== 'stairway') continue;
    const b = stair.get(w.training_block);
    for (const g of (b && b.groups) || []) {
      const v = (w.weekly_sets_by_group || {})[g] || 0;
      const t = (w.target_by_group || {})[g];
      if (isNum(t) && v < t - EPS) out.push({ code: 'group_below_target', class: 'plan_shape', week: w.n, group: g, actual: v, limit: t });
      if (isNum(days) && days >= (R.volume.floor.applies_from_days || 0) && g !== 'calves' && !(b.below_floor || []).includes(g) && v < floorV - EPS && (!isNum(t) || t >= floorV)) out.push({ code: 'group_below_floor', class: 'plan_shape', week: w.n, group: g, actual: v, limit: floorV });
      const pv = prev && prev.training_block === w.training_block ? ((prev.weekly_sets_by_group || {})[g] || 0) : null;
      if (pv !== null && v < pv - 0.5 - EPS) out.push({ code: 'group_sets_decreased', class: 'plan_shape', week: w.n, group: g, actual: v, limit: pv });
    }
  }
  return out;
}
