// engine/generate.mjs - the orchestrator (engine/CONTRACTS.md §4.12, §5). Owner: B4 (integrated by the integrator); v0.4 stage B1.
// generateWith(deps, intake, model, opts) runs the fixed pipeline against injected module functions (tests use contract-
// shaped stubs); generate() = generateWith(REAL, ...). Deterministic: same intake + model -> byte-identical plan JSON.
// v0.4 (coach_answers_round3.md): the plan is built once with its planned stairway - no check-ins, no adapt(), no tracking, no
// data kept (R3-VOL-02, R3-VOL-04, R3-GEN-01; adapt / adaptWith / checkinRow are RETIRED). The plan carries stable block ids
// with on / off switches and the superset recommendations, and a rep-max test is its own top-set item before the planned sets
// (R2-PER-07: tests are not stairway sets).
// v0.5 (design/ENGINE_V05_PLAN.md; COACH-CT CT-01, COACH-R4, COACH-CX): template-first. The plan is the coach's template, sized
// by exercise count, complete - nothing is cut, dropped or flagged for time (plan.time_check and plan.offers are gone; a day's
// est_minutes is an estimate). Weekly sets per group follow the stairway to the planned final sets (meta.stairway). The plan is
// an editable template (engine/edit.mjs; plan.edited).
import { ENGINE_VERSION } from './version.mjs';
import { EngineError, EPS, WEEKDAYS, canonicalJSON, hash53, makeSeed, why, round2, roundHalfUp, roundTo, uniqueSorted, addDays, weekdayOf, forbiddenKeys } from './util.mjs';
import { validatePlan } from './validate.mjs';
import * as intakeMod from './intake.mjs';
import * as shapeMod from './shape.mjs';
import * as volumeMod from './volume.mjs';
import * as weekMod from './week.mjs';
import * as selectMod from './select.mjs';
import * as doseMod from './dose.mjs';
import { athleticKeyOf, planAthletic, plannedAthletic as plannedAthleticOf, plannedShare, perSetBounds, circuitBallistic } from './athletic.mjs';
import { setCost, supersetMinutes } from './estimate.mjs';
import { progressionRule } from './progression/prescription.mjs';
import { videoOf, swapNotes, isCarry, carryReps, neverPick } from './library.mjs';

export { ENGINE_VERSION } from './version.mjs';

/** the B2 / B3 exports the pipeline calls (CONTRACTS §4.3-§4.8) */
export const REQUIRED_DEPS = Object.freeze(['validateIntake', 'safetyScreen', 'deriveValues', 'buildShape', 'stairwayPlan', 'planWeeklySets',
  'athleticBudget', 'buildWeekLayout', 'layoutForWeek', 'estimateMinutes', 'selectBlock', 'fillSlot', 'doseItem', 'doseAerobic', 'doseConditioning']);

const REAL = Object.freeze({ ...intakeMod, ...shapeMod, ...volumeMod, ...weekMod, ...selectMod, ...doseMod });

/** @returns {{ready:boolean, missing_files:string[], missing_exports:string[]}} whether generate() can run on the real B2 / B3 modules */
export function realModulesStatus() {
  const missing_exports = REQUIRED_DEPS.filter(k => typeof REAL[k] !== 'function');
  return { ready: missing_exports.length === 0, missing_files: [], missing_exports };
}

/** @param {object} intake @param {import('./util.mjs').Model} model @param {object} [opts] @returns {import('./util.mjs').Plan} */
export function generate(intake, model, opts = {}) {
  const st = realModulesStatus();
  if (!st.ready) throw new EngineError('generate.modules_missing', 'engine modules not built yet: ' + st.missing_exports.join(', '), st);
  return generateWith(REAL, intake, model, opts);
}

/**
 * @param {Object<string,Function>} deps  the B2 / B3 exports (REQUIRED_DEPS)
 * @param {object} intake @param {import('./util.mjs').Model} model @param {object} [opts] (no options read in v0.4)
 * @returns {import('./util.mjs').Plan}
 */
export function generateWith(deps, intake, model, opts = {}) {
  for (const k of REQUIRED_DEPS) if (typeof deps[k] !== 'function') throw new EngineError('generate.bad_deps', 'missing dependency ' + k);
  void opts;
  return run(deps, intake, model);
}

// RETIRED in v0.4 (COACH-R3 R3-VOL-02 'we're not going to have check-ins ... We're only doing outputs', R3-VOL-04 'kick out a
// program, and that's it'): adapt(), adaptWith(), checkinRow() and the check-in offers. The plan is built once with its planned
// stairway; people and coaches adjust it themselves. Nothing is read back and nothing is kept (R3-GEN-01).

// ------------------------------------------------------------------------------------------------------------- pipeline

const NO_SET_KINDS = ['warmup', 'aerobic', 'skill'];
const RES_KINDS = ['resistance', 'isolation', 'focus'];
const INSTRUCTION_KEYS = ['instruction.title', 'instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5'];

// true when a circuit plan runs more rounds in its last weeks than in its first and the validator's absolute-cap rule fails
function lateRoundsOverCap(plan, shape) {
  const rs = (shape.weeks || []).filter(w => w.circuit && typeof w.circuit.rounds === 'number' && w.block_type === 'stairway').map(w => w.circuit.rounds);
  if (rs.length < 2 || Math.max(...rs) <= rs[0]) return false;
  const v13 = ((plan.validation && plan.validation.checks) || []).find(c => c.id === 'V13');
  return !!v13 && !v13.pass && (v13.violations || []).some(x => x.args && x.args.rule === 'line_absolute_cap');
}

function run(deps, intake, model, ropts = {}) {
  const v = deps.validateIntake(intake, model);
  if (!v || !v.ok) return invalidPlan(intake, v, model);
  const s = deps.safetyScreen(v.intake);
  if (s && s.refer) return referPlan(v.intake, s, model);
  const seed = makeSeed(intakeForHash(v.intake), model.version);
  const derived = deps.deriveValues(v.intake, model);
  // warnings raised while normalizing the raw intake (e.g. warning.checkin_retired: the normalized intake no longer carries the
  // retired field, so deriveValues cannot see it again)
  if (Array.isArray(derived.warnings)) for (const w of v.warnings || []) if (w && w.key && !derived.warnings.some(x => x.key === w.key && x.field === w.field)) derived.warnings.push(w);
  const shape = deps.buildShape(derived, model, { noLateRounds: !!ropts.noLateRounds });
  // (the volume engine marks its room cuts on the layout's slots - a WOD held short -, so every selection + volume pass runs on a
  // fresh layout)
  const mkLayouts = () => shape.training_blocks.map(tb => deps.buildWeekLayout(derived, shape, tb, model));
  let layouts = mkLayouts();
  const targets = derived.D9_start_sets;
  // v0.4 fix round 2 / F3 (minimal seam, DECISIONS E-178): the picks are made twice. The first pass picks every template station; the
  // volume engine then says which stations hold sets (`liveBy`: exercise block -> slot ids with sets - v0.5: every template station
  // with a pick, plus the bonus exercises), and the second pass picks again knowing them, so the one-change-a-day rule (PER-02), the
  // laterality dials (UNI-02) and the week's variety (PER-04) read the plan's real stations.
  let liveBy = null;
  let liveSetsBy = null;   // v0.5 fix round 1: exercise block -> {slot_id: the sets the first pass gave the station across the block}
  let frozen = !!ropts.frozen;
  let flipsUsed = false;
  const selectAll = (base) => {
    const out = [];
    for (const eb of shape.exercise_blocks) {
      out.push(deps.selectBlock({ derived, shape, layout: layouts[eb.training_block - 1], targets, exerciseBlock: eb.n, prev: out.length ? out[out.length - 1] : null, model, seed, ...(liveBy ? { live: liveBy.get(eb.n) || new Set(), base: (base && base[eb.n - 1]) || null, frozen, ...(liveSetsBy ? { live_sets: liveSetsBy.get(eb.n) || {}, live_weeks: eb.weeks[1] - eb.weeks[0] + 1 } : {}) } : {}) }));
    }
    return out;
  };
  let selections = selectAll(null);
  const selFor = (ebN) => selections[ebN - 1] || null;
  const ctxFor = (n) => {
    const ws = shape.weeks[n - 1];
    return { derived, shape, layout: layouts[ws.training_block - 1], targets, exerciseBlock: ws.exercise_block, prev: selFor(ws.exercise_block - 1), model, seed, ...(liveBy ? { live: liveBy.get(ws.exercise_block) || new Set(), frozen } : {}) };
  };
  // Slots the volume engine adds (bonus / Focus) are filled one at a time. fillSlot gets the exercise block's Selection
  // (template picks: second-exposure and spine state, CONTRACTS §4.7) and `day_used`, the exercises already on that weekday
  // (template picks + added slots filled earlier in this exercise block), so a day never holds the same exercise twice.
  const fillCache = new Map();
  const addedByBlock = new Map();   // exercise block -> Map(slot_id -> exercise_id) of filled added slots
  // (fix round 2 / F3, E-181: the same, keyed by slot + bucket + muscle - an added exercise keeps its exercise in the next exercise block)
  const addedKeyed = new Map();
  const addedKey = (slot) => slot.slot_id + '|' + slot.bucket + '|' + (slot.focus_muscle || '');
  // (E-178: the first pass's fills of the added slots - the second pass stays inside their time and credit profile - and the cache
  // keys of the probe / stage fills, which the second pass keeps)
  const addedFills = new Map();
  let baseAdded = null;
  const keepKeys = new Set();
  const fillFor = (slot, n, fopts) => {
    const eb = shape.weeks[n - 1].exercise_block;
    const probe = !!(fopts && fopts.probe);
    // the key names the muscle and bucket too: the volume engine's capacity probe and the real placement may add different
    // slots under the same id (v1.2); probe fills never count as 'used on that day'
    const stage = (fopts && fopts.stage) || '';
    const key = (probe ? 'probe|' : '') + eb + '|' + slot.slot_id + '|' + slot.bucket + '|' + (slot.focus_muscle || '') + '|' + stage;
    if (fillCache.has(key)) return fillCache.get(key);
    const ctx = ctxFor(n);
    const sel = selFor(eb);
    const wd = String(slot.slot_id).split('.')[0];
    const used = new Set();
    if (sel && sel.fills) for (const d of ctx.layout ? ctx.layout.days : []) {
      if (d.weekday !== wd) continue;
      for (const b of d.blocks || []) for (const s of b.slots || []) { const f = sel.fills[s.slot_id]; if (f && f.exercise_id && s.slot_id !== slot.slot_id) used.add(f.exercise_id); }
    }
    if (!addedByBlock.has(eb)) addedByBlock.set(eb, new Map());
    const added = addedByBlock.get(eb);
    for (const [id, ex] of added) if (id !== slot.slot_id && String(id).split('.')[0] === wd && ex) used.add(ex);
    const weekUsed = [];
    // (fix round 2 / F3, E-178: in the second pass only the added slots the first pass kept count as the week's exercises - a slot the
    // volume engine tried and gave up no longer takes an exercise away from a kept one; the day-level check above still reads them all)
    const liveNow = liveBy ? liveBy.get(eb) || null : null;
    for (const [id, ex] of added) if (ex && (!liveBy || (id !== slot.slot_id && (!liveNow || liveNow.has(id))))) weekUsed.push(ex);
    // v0.4 fix round 2 / F1 (E-135): an engine-added slot is picked as part of its day (select reads the day's slots, e.g. the day's
    // lead chest press - a pattern-kept press on the optional day is that day's first press, R3-SES-02 / ORD-07)
    const inLayout = !!(ctx.layout && ctx.layout.days.some(d => (d.blocks || []).some(b => (b.slots || []).some(s => s.slot_id === slot.slot_id))));
    const lay = !inLayout && slot.origin && slot.origin !== 'template' && ctx.layout ? withAddedSlots(ctx.layout, [slot], model) : ctx.layout;
    const real = !probe && !stage && slot.origin && slot.origin !== 'template';
    const prevAdded = real && addedKeyed.has(eb - 1) ? addedKeyed.get(eb - 1).get(addedKey(slot)) : null;
    const base1 = real && baseAdded && baseAdded.has(eb) ? baseAdded.get(eb).get(addedKey(slot)) : null;
    const fill = deps.fillSlot(slot, { ...ctx, layout: lay, selection: sel, day_used: [...used].sort(), week_used: weekUsed.slice().sort(), ...(stage ? { stage_override: stage } : {}), ...(prevAdded ? { prev_added: prevAdded } : {}), ...(base1 ? { base_added: base1 } : {}),
      ...(real && addedByBlock.has(eb - 1) ? { prev_week_added: [...addedByBlock.get(eb - 1).values()].filter(Boolean).sort() } : {}) });
    if (real) {
      added.set(slot.slot_id, fill && fill.exercise_id ? fill.exercise_id : null);
      if (!addedKeyed.has(eb)) { addedKeyed.set(eb, new Map()); addedFills.set(eb, new Map()); }
      if (fill && fill.exercise_id) { addedKeyed.get(eb).set(addedKey(slot), fill.exercise_id); addedFills.get(eb).set(addedKey(slot), fill); }
    } else keepKeys.add(key);
    fillCache.set(key, fill);
    return fill;
  };
  let volume = deps.planWeeklySets({ derived, shape, layouts, selections, model, fillSlot: fillFor, estimateMinutes: deps.estimateMinutes });
  // (fix round 2 / F3, E-178: the second pass on the stations the first pass kept)
  const SP2 = model.rules.selection && model.rules.selection.r2 && model.rules.selection.r2.second_pass;
  if (SP2 && SP2.enabled && deps.SECOND_PASS === true && volume && Array.isArray(volume.weeks) && volume.weeks.length === shape.weeks.length && volume.weeks.every(w => w && w.sets_by_slot)) {
    const first = { selections, volume };
    liveBy = liveStations(volume, shape);
    liveSetsBy = liveSetsOf(volume, shape);
    baseAdded = new Map([...addedFills].map(([e, m]) => [e, new Map(m)]));
    const second = () => {
      layouts = mkLayouts();
      selections = selectAll(first.selections);
      for (const k of [...fillCache.keys()]) if (!keepKeys.has(k)) fillCache.delete(k);
      addedByBlock.clear(); addedKeyed.clear(); addedFills.clear();
      volume = deps.planWeeklySets({ derived, shape, layouts, selections, model, fillSlot: fillFor, estimateMinutes: deps.estimateMinutes });
    };
    second();
    // the dials' flips may change a station's credit profile: when that costs the plan a group the first pass trained (or pushes one
    // under its floor), the second pass runs again without them - the same stations, the same credit profile
    const X1S = model.rules.selection.x1 || {};
    if (!frozen && !keepsGroups(first.volume, volume, typeof X1S.second_pass_top_tolerance === 'number' ? X1S.second_pass_top_tolerance : 0)) { frozen = true; second(); }
    flipsUsed = !frozen;
  }
  const athletic = deps.athleticBudget(derived, shape, model);
  const C = { deps, model, derived, shape, layouts, selections, selFor, fillFor, volume, athletic, targets };
  // v0.4 stage B2: every week's items are collected first, then the athletic stairway doses the whole block at once (capacity
  // scaling, the climb, the end-test-week hold; athletic.planAthletic), then each week is dosed and assembled
  const collected = shape.weeks.map(ws => collectWeek(C, ws.n));
  C.athleticPlan = planAthletic(model, derived, shape, athletic, collected.map(col => athleticItemsOf(col, model)));
  const weeks = shape.weeks.map(ws => finishWeek(C, ws.n, collected[ws.n - 1]));
  const plan = {
    schema: 'plan/2',
    status: 'ok',
    model_version: model.version, engine_version: ENGINE_VERSION, contracts_version: model.manifest.contracts_version,
    seed, intake_hash: 'c53:' + hash53(canonicalJSON(intakeForHash(v.intake))),
    lang: derived.lang, units: derived.units,
    release_stamp: releaseStamp(v.intake),
    refer: null,
    errors: [],
    // v0.5 (CX-04): the plan is an editable template; engine/edit.mjs sets this and recomputes the totals
    edited: false,
    meta: buildMeta(C, v, weeks),
    shape: {
      mode: shape.mode, skeleton: shape.skeleton, weeks_total: shape.weeks_total, open_ended: !!shape.open_ended,
      training_blocks: shape.training_blocks, exercise_blocks: shape.exercise_blocks,
      level_by_week: shape.weeks.map(w => (typeof w.stair_level === 'number' ? w.stair_level : null))
    },
    weeks,
    summary: null,
    validation: null
  };
  // v0.4 fix round 2 / F1 (E-147; RECHECK v0.4 01 / 02 / 03 / 04 / 05 / 07: the printed 'test dates' were the retired reminder dates - the
  // block start, 7 days and 1 day before the end-test week): the calendar date of every day that holds a test item (R2-PER-07); the
  // plan sends no reminders (R3-VOL-02 / R3-GEN-01), so the printed dates are the real test days
  const td = testDaysOf(weeks, derived.start_date);
  plan.meta.tests = { ...plan.meta.tests, test_days: td, test_dates: uniqueSorted(td.map(x => x.date)) };
  plan.summary = buildSummary(plan, C);
  const clean = sanitize(plan);
  clean.validation = validatePlan(clean, model);
  // (v0.5 fix round 2: the extra circuit round of the last weeks - rules.supersets.bootcamp.x2.rounds_late - never takes a muscle
  // past the absolute weekly cap, VOL-06: such a plan - a 5-day circuit week - is built again without it)
  if (!ropts.noLateRounds && lateRoundsOverCap(clean, shape)) return run(deps, intake, model, { ...ropts, noLateRounds: true });
  // (fix round 2 / F3, E-178: a plan whose dial flips leave it failing an error check is built again without them)
  if (flipsUsed && failingErrors(clean) > 0) {
    const alt = run(deps, intake, model, { ...ropts, frozen: true });
    if (alt && alt.status === 'ok' && failingErrors(alt) < failingErrors(clean)) return alt;
  }
  return clean;
}

function failingErrors(plan) {
  return ((plan.validation && plan.validation.checks) || []).filter(c => !c.pass && c.severity === 'error').length;
}

/** does the second pass train every group the first pass trained, with no new group under its floor or newly capped? */
function keepsGroups(v1, v2, tol = 0) {
  const a = (v1 && v1.block_targets) || [], b = (v2 && v2.block_targets) || [];
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const t2 = new Set(b[i].groups || []), below1 = new Set(a[i].below_floor || []);
    if ((a[i].groups || []).some(g => !t2.has(g))) return false;
    if ((b[i].below_floor || []).some(g => !below1.has(g))) return false;
    // (v0.5 fix round 1: a group's final sets may end a set lower when the second pass's pick gives it less helper credit - a
    // high-incline press turned into an overhead press takes half a set per set from chest. With no minutes to hold, CT-01, that is
    // no reason to drop every dial flip and every second-pass rule: bench 09 kept a one-arm lead row, sample 04 lost its lower share)
    for (const g of a[i].groups || []) if (((b[i].group_top || {})[g] || 0) < ((a[i].group_top || {})[g] || 0) - tol) return false;
  }
  return true;
}

/** the stations that hold sets in each exercise block (a station with no set count - warm-up, cardio, skill - is always live) */
function liveStations(volume, shape) {
  const out = new Map();
  for (const eb of shape.exercise_blocks) {
    const set = new Set();
    for (let n = eb.weeks[0]; n <= eb.weeks[1]; n++) {
      const w = volume.weeks[n - 1];
      if (!w || !w.sets_by_slot) continue;
      for (const [id, v] of Object.entries(w.sets_by_slot)) if (v === null || (typeof v === 'number' && v > 0)) set.add(id);
    }
    out.set(eb.n, set);
  }
  return out;
}

/** v0.5 fix round 1: exercise block -> {slot_id: sets across the block's weeks} of the first pass (the laterality dials' weights) */
function liveSetsOf(volume, shape) {
  const out = new Map();
  for (const eb of shape.exercise_blocks) {
    const sums = {};
    for (let n = eb.weeks[0]; n <= eb.weeks[1]; n++) {
      const w = volume.weeks[n - 1];
      if (!w || !w.sets_by_slot) continue;
      for (const [id, v] of Object.entries(w.sets_by_slot)) if (typeof v === 'number' && v > 0) sums[id] = (sums[id] || 0) + v;
    }
    out.set(eb.n, sums);
  }
  return out;
}

function intakeForHash(intake) {
  const strip = (o, path) => {
    if (Array.isArray(o)) return o.map(x => strip(x, path));
    if (!o || typeof o !== 'object') return o;
    const out = {};
    for (const k of Object.keys(o)) {
      if (k.startsWith('_')) continue;
      if (!path && (k === 'id' || k === 'email')) continue;
      if (path === 'release' && (k === 'accepted_at' || k === 'signer_name')) continue;
      out[k] = strip(o[k], path ? path + '.' + k : k);
    }
    return out;
  };
  return strip(intake, '');
}

function releaseStamp(intake) {
  const r = intake.release || {};
  // v0.5 / V3 (COACH-R4 R4-SCP-02 'they need to click it before the plan shows'): the stamp says the terms and the release were
  // accepted - generate reaches this line only for an intake whose release.accepted is true (validateIntake / checkRelease)
  return { version: r.version ?? null, lang: r.lang ?? intake.lang ?? null, role: intake.role ?? 'self', guardian: r.guardian ?? null, accepted: r.accepted === true };
}

function shell(model, status, intake) {
  const okIntake = intake && typeof intake === 'object';
  return {
    schema: 'plan/2', status,
    model_version: model.version, engine_version: ENGINE_VERSION, contracts_version: model.manifest.contracts_version,
    seed: null, intake_hash: okIntake ? 'c53:' + hash53(canonicalJSON(intakeForHash(intake))) : null,
    lang: okIntake && intake.lang === 'es' ? 'es' : 'en', units: okIntake && intake.units === 'kg' ? 'kg' : 'lb',
    release_stamp: null, refer: null, errors: [], edited: false, meta: {}, shape: null, weeks: [], summary: null, validation: null
  };
}

function invalidPlan(intake, v, model) {
  const p = shell(model, 'invalid', intake);
  p.errors = (v && v.errors && v.errors.length ? v.errors : [{ code: 'invalid', key: 'warning.release_missing' }]).map(e => ({ ...e }));
  p.meta = { input_audit: inputAudit(intake), instruction_keys: INSTRUCTION_KEYS.slice() };
  const out = sanitize(p);
  out.validation = validatePlan(out, model);
  return out;
}

function referPlan(intake, s, model) {
  const p = shell(model, 'refer', intake);
  p.refer = { reasons: (s.reasons || []).slice() };
  p.meta = {
    health: { role: intake.role || 'self', health_route: intake.health_route ?? null, refer: true, reasons: (s.reasons || []).slice(), bypass: !!s.bypass },
    instruction_keys: INSTRUCTION_KEYS.slice()
  };
  const out = sanitize(p);
  out.validation = validatePlan(out, model);
  return out;
}

function inputAudit(intake) {
  const keys = [];
  const walk = (o, prefix) => {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return;
    for (const k of Object.keys(o)) {
      if (k.startsWith('_')) continue;
      const p = prefix ? prefix + '.' + k : k;
      keys.push(p);
      walk(o[k], p);
    }
  };
  walk(intake, '');
  return { keys: uniqueSorted(keys), forbidden_found: intake && typeof intake === 'object' ? forbiddenKeys(intake) : [] };
}

// ------------------------------------------------------------------------------------------------------------- week assembly

function withAddedSlots(base, added, model, addedFills = {}) {
  if (!added || !added.length) return base;
  const order = model.rules.ordering.block_order;
  // v0.4 fix round 1 (E-87; RECHECK 06 major: an added seal row / machine bench press printed last, after the flies and the calf
  // raise): an added compound sits before its block's isolations, and a horizontal pull / push before the block's vertical one
  // (ORD-01 / ORD-02 'big before small', H before V)
  const exOfAdded = (s) => { const f = addedFills[s.slot_id]; return f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; };
  const kindOfB = (b) => { try { return model.bucket(b).kind; } catch { return null; } };
  const smallAfter = (slot, ex, s) => {
    const e2 = exOfAdded(s);
    if (e2 ? e2.exercise_class !== 'compound' : ['isolation', 'focus'].includes(kindOfB(s.bucket))) return true;
    return (ex.pattern === 'HPULL' && (s.bucket === 'RP_VPULL' || (e2 && e2.pattern === 'VPULL'))) || (ex.pattern === 'HPUSH' && (s.bucket === 'RP_VPUSH' || (e2 && e2.pattern === 'VPUSH')));
  };
  const days = base.days.map(d => ({ ...d, blocks: d.blocks.map(b => ({ ...b, slots: b.slots.slice() })) }));
  for (const slot of added) {
    const wd = String(slot.slot_id).split('.')[0];
    const day = days.find(d => d.weekday === wd);
    if (!day) continue;
    if (day.blocks.some(b => b.slots.some(s => s.slot_id === slot.slot_id))) continue;
    // a circuit station that takes over another station's place (v0.4 circuit rebalance) sits where that station was
    if (slot.replaces) {
      const host = day.blocks.find(b => b.slots.some(s => s.slot_id === slot.replaces));
      if (host) { host.slots.splice(host.slots.findIndex(s => s.slot_id === slot.replaces) + 1, 0, slot); continue; }
    }
    // v0.4 fix round 2 / F1 (E-145): a pattern station paired with the day's work lift sits right after it (the superset partner)
    if (slot.pattern_partner) {
      const host = day.blocks.find(b => b.slots.some(s => s.slot_id === slot.pattern_partner));
      if (host) { host.slots.splice(host.slots.findIndex(s => s.slot_id === slot.pattern_partner) + 1, 0, slot); continue; }
    }
    let blk = day.blocks.find(b => b.kind === slot.block && (slot.block !== 'circuit' || b.circuit === slot.circuit));
    if (!blk) {
      blk = { kind: slot.block, movable: false, circuit: null, slots: [] };
      const at = day.blocks.findIndex(b => order.indexOf(b.kind) > order.indexOf(slot.block));
      if (at < 0) day.blocks.push(blk); else day.blocks.splice(at, 0, blk);
    }
    const ex = slot.block !== 'circuit' ? exOfAdded(slot) : null;
    const at = ex && ex.exercise_class === 'compound' ? blk.slots.findIndex(s => smallAfter(slot, ex, s)) : -1;
    if (at >= 0) blk.slots.splice(at, 0, slot); else blk.slots.push(slot);
  }
  return { ...base, days };
}

function bucketDef(model, b) { try { return model.bucket(b); } catch { return null; } }

/**
 * v0.4 fix round 2 / F1 (E-151; RECHECK v0.4 05 majors: the KB swing and the overhead throw came after a full strength circuit, and the
 * reorder put three hamstring / shoulder stations back to back): on a circuit day the ballistic station (medball throw / slam, KB
 * swing) opens the day's FIRST circuit - done fresh, power before strength (ORD-03 / GEN-08) - and one station of that circuit moves
 * to the next so both keep their size (same rounds, same minutes); then each circuit alternates lower / upper / conditioning and
 * never puts two stations of the same group back to back (OBSERVED BYOP Bootcamp 1 lower / upper / lower / upper; UNI-11).
 */
function sequenceCircuits(blocks, model, ownIds = new Set()) {
  const circ = blocks.filter(b => b.kind === 'circuit' && (b.items || []).length);
  if (!circ.length) return;
  const exOf = (it) => (it.exercise_id && model.hasEx(it.exercise_id) ? model.ex(it.exercise_id) : null);
  const ballistic = (it) => { const ex = exOf(it); return it.bucket === 'COND_CIRCUIT' && !!ex && (!!ex.medball || ex.tags.includes('kb_swing')); };
  // v0.5 fix round 2 (sample 05 major: floor press -> curl -> skullcrusher -> offset push-up -> overhead press - 'the triceps isolation
  // sits directly before two more presses'; OBSERVED OT06 2A: hinge, horizontal push, biceps, vertical push, cardio - the curl sits
  // between the presses as the rest station; ORD-04; UNI-11): the coach's own slots keep his order as the spine of the circuit and
  // the stations the engine added are placed around them - never an isolation exercise before a compound lift that uses its
  // muscle, never two stations of one group back to back where another place is free (rules.supersets.bootcamp.x2.order)
  const OX = model.rules.supersets.bootcamp.x2 && model.rules.supersets.bootcamp.x2.order;
  if (OX && OX.spine && circ.some(b => b.items.some(it => ownIds.has(it.slot_id)))) {
    const HVx = [['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']];
    const credOf = (it) => (it.credits && Object.keys(it.credits).length ? it.credits : ((exOf(it) || {}).credits || {}));
    const primeOf = (it) => { const ex = exOf(it); return ex ? ex.primary_muscle : null; };
    const isIso = (it) => { const ex = exOf(it); return !!ex && ex.exercise_class === 'isolation'; };
    const isCompound = (it) => { const ex = exOf(it); return !!ex && !ex.is_athletic && ex.exercise_class !== 'isolation' && it.bucket !== 'COND_CIRCUIT'; };
    const groupX = (it) => (it.bucket === 'COND_CIRCUIT' ? null : it.group || null);
    const helpers = (it) => Object.entries(credOf(it)).filter(([, c]) => c > 0 && c < 1).map(([m]) => m);
    const cost = (seq) => {
      let c = 0;
      for (let i = 0; i < seq.length; i++) {
        const a = seq[i];
        if (i > 0) {
          const p = seq[i - 1];
          if (groupX(a) && groupX(a) === groupX(p)) c += OX.same_group;
          else if (helpers(a).some(m => helpers(p).includes(m) || primeOf(p) === m) || helpers(p).some(m => primeOf(a) === m)) c += OX.shared_helper;
        }
        // an isolation exercise before a compound lift that uses its muscle
        if (isIso(a)) { const m = primeOf(a); for (let j = i + 1; j < seq.length; j++) if (isCompound(seq[j]) && m && (credOf(seq[j])[m] || 0) > 0) c += OX.iso_before_its_compound; }
        // a compound lift after any isolation exercise (small cost: compounds first)
        if (isCompound(a) && seq.slice(0, i).some(isIso)) c += OX.compound_after_iso;
        for (const [h, v] of HVx) if (a.bucket === v && seq.slice(i + 1).some(x => x.bucket === h)) c += OX.h_before_v;
      }
      return c;
    };
    for (const b of circ) {
      const lead = b.items.filter(ballistic);
      const own = b.items.filter(it => !ballistic(it) && ownIds.has(it.slot_id));
      const addedC = b.items.filter(it => !ballistic(it) && !ownIds.has(it.slot_id) && isCompound(it));
      const addedR = b.items.filter(it => !ballistic(it) && !ownIds.has(it.slot_id) && !isCompound(it));
      let seq = [...lead, ...own];
      for (const it of [...addedC, ...addedR]) {
        let best = null, bestCost = Infinity;
        for (let at = lead.length; at <= seq.length; at++) {
          const trial = [...seq.slice(0, at), it, ...seq.slice(at)];
          // (the coach's own station leads its group: an added second chest station never runs before his floor press, VOL-07)
          const lead0 = OX.added_before_own_same_group && groupX(it) && seq.slice(at).some(x => ownIds.has(x.slot_id) && groupX(x) === groupX(it)) ? OX.added_before_own_same_group : 0;
          const cst = cost(trial) + lead0;
          if (cst <= bestCost + 1e-9) { bestCost = cst; best = trial; } // (ties: the later place)
        }
        seq = best || [...seq, it];
      }
      b.items = seq;
    }
    return;
  }
  const MD = model.rules.muscles.defs;
  const regionOf = (it) => { if (it.bucket === 'COND_CIRCUIT' || !it.group) return 'cond'; const ex = exOf(it); const m = ex && ex.primary_muscle; return m && MD[m] ? MD[m].region : 'cond'; };
  const groupOfIt = (it) => (ballistic(it) ? (/swing/.test(it.exercise_id || '') ? 'hips' : 'shoulders') : it.group || null);
  // (H04: a horizontal push / pull comes before its vertical partner - a vertical station waits while its horizontal is unplaced)
  const HV = [['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']];
  const waits = (it, rest) => HV.some(([h, v]) => it.bucket === v && rest.some(x => x !== it && x.bucket === h));
  const order = (items) => {
    const lead = items.filter(ballistic);
    const rest = items.filter(it => !ballistic(it));
    const out = lead.slice();
    while (rest.length) {
      const prev = out[out.length - 1];
      const score = (it) => (waits(it, rest) ? 10 : 0) + (prev && groupOfIt(prev) && groupOfIt(prev) === groupOfIt(it) ? 2 : 0) + (prev && regionOf(prev) === regionOf(it) && regionOf(it) !== 'cond' ? 1 : 0);
      let best = 0;
      for (let i = 1; i < rest.length; i++) if (score(rest[i]) < score(rest[best])) best = i;
      out.push(rest.splice(best, 1)[0]);
    }
    return out;
  };
  // a horizontal station moved to the second circuit would follow its vertical partner left in the first one
  const hvBreak = (it, stay) => HV.some(([h, v]) => it.bucket === h && stay.some(x => x.bucket === v));
  const conflicts = (items) => { let n = 0; for (let i = 1; i < items.length; i++) if (groupOfIt(items[i]) && groupOfIt(items[i]) === groupOfIt(items[i - 1])) n++; return n; };
  // the ballistic station opens the first circuit; the first circuit gives one station back so both keep their size
  if (circ.length >= 2) {
    const c1 = circ[0], c2 = circ[1];
    const bal = c2.items.find(ballistic);
    if (bal && !c1.items.some(ballistic)) {
      c2.items = c2.items.filter(it => it !== bal);
      const cands = c1.items.filter(it => it.role !== 'work');
      let pick = null, bestScore = Infinity;
      cands.forEach((it, i) => {
        if (hvBreak(it, c1.items.filter(x => x !== it))) return;
        const a = order([bal, ...c1.items.filter(x => x !== it)]), b = order([...c2.items, it]);
        const sc = conflicts(a) + conflicts(b) + (i === 0 ? 0.5 : 0); // (the circuit's first strength station - its lead lift - stays)
        if (sc < bestScore - 1e-9) { bestScore = sc; pick = it; }
      });
      if (pick) { c1.items = [bal, ...c1.items.filter(x => x !== pick)]; c2.items = [...c2.items, pick]; }
      else c2.items = [bal, ...c2.items];
      bal.why = dedupeWhy([...(bal.why || []), why('why.power_before_strength', 'ORD-03')]);
    }
  }
  for (const b of circ) b.items = order(b.items);
}

const SMALL_RC_BUCKETS = ['ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF'];
const ATHLETIC_KEY_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW', 'AP_COD', 'AP_SPRINT', 'AP_TRIPLE_EXT'];

function collectWeek(C, n) {
  const { deps, model, derived, shape, volume, athletic } = C;
  const ws = shape.weeks[n - 1];
  const vw = volume.weeks[n - 1];
  const base = C.layouts[ws.training_block - 1];
  const L = deps.layoutForWeek(withAddedSlots(base, vw.added_slots || [], model, vw.added_fills || {}), ws, derived, model);
  const sel = C.selFor(ws.exercise_block) || { fills: {} };
  weekMod.relocateStrengthTests(L, sel.fills || {}, model);
  weekMod.testedLiftFirst(L, model);
  const sets = vw.sets_by_slot || {};
  const fills = {};
  // v0.4 stage B2: the Receive-Create stage changes only at an exercise-block boundary (shape.mjs, athletic.stagesForStairway),
  // so the block's picks hold all its weeks; the v1.2 mid-block re-pick only runs for a stage that still moves inside a block
  // (rules without athletic.stages.align_to_exercise_blocks)
  const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
  const ebFirst = eb ? shape.weeks[eb.weeks[0] - 1] : ws;
  const stageMoved = !!(ws.plyo_stage && ebFirst && ebFirst.plyo_stage && ws.plyo_stage !== ebFirst.plyo_stage);
  // pass 1: which slots become items (exercise + sets), every day
  const perDay = [];
  const replaced = [];
  for (const day of L.days) {
    const cands = [];
    // v0.4 fix round 2 / F2 (E-165): the stations this week's timed tests replace on this day (week.markTests); the jump test takes
    // a ballistic jump station when the marked one holds a reactive drill (the CMJ is a ballistic jump) and both run the same sets
    const repl = new Set();
    {
      const all = (day.blocks || []).flatMap(b2 => b2.slots || []);
      for (const sl of all) if (sl.test_replaced) repl.add(sl.slot_id);
      const exOfSlot = (sl) => { const f = sel.fills[sl.slot_id]; return f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; };
      const setsOfSlot = (sl) => (Object.prototype.hasOwnProperty.call(sets, sl.slot_id) ? sets[sl.slot_id] : (sl.default_sets ?? null));
      for (const m of all.filter(sl => sl.test_replaced && sl.bucket === 'AP_PLYO')) {
        const exm = exOfSlot(m);
        if (!exm || !exm.athletic || exm.athletic.quality !== 'plyometric') continue;
        const alt = all.find(sl => sl !== m && sl.bucket === 'AP_PLYO' && sl.variant !== 'upper' && !sl.ankle_block && !repl.has(sl.slot_id) && setsOfSlot(sl) === setsOfSlot(m) &&
          (() => { const e = exOfSlot(sl); return !!e && !!e.athletic && e.athletic.quality === 'ballistic' && !e.athletic.upper; })());
        if (alt) { repl.delete(m.slot_id); repl.add(alt.slot_id); }
      }
    }
    for (const blk of day.blocks || []) for (const slot of blk.slots || []) {
      const bd = bucketDef(model, slot.bucket) || {};
      let fill = sel.fills[slot.slot_id] || null;
      if (stageMoved && ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(slot.bucket) && slot.origin === 'template') {
        const f2 = C.fillFor(slot, n, { stage: ws.plyo_stage });
        if (f2 && f2.exercise_id) fill = f2;
      }
      // v0.4 B4 (integration, random sweep V14 / H08: a circuit swap station counted as a floor press while the plan printed
      // assisted dips): an added slot takes the fill the volume engine counted this week, else its own pick
      if (!fill && slot.origin && slot.origin !== 'template' && slot.origin !== 'test' && !slot.text_key) fill = (vw.added_fills && vw.added_fills[slot.slot_id]) || C.fillFor(slot, n);
      // v0.4 fix round 1 (RECHECK 08 major: a soleus raise next to the day's calf raise = two calf exercises on a leg day): the
      // Achilles / shin joint care of a day that already holds its calf exercise takes the code's non-calf pick (a tibialis raise)
      if (fill && fill.exercise_id && slot.role === 'prehab' && slot.bucket === 'PREHAB_LOWER') {
        const isCalf = (id) => model.hasEx(id) && (model.ex(id).credit_class === 'ISO_CALF' || model.ex(id).primary_muscle === 'calves');
        const dayCalf = (day.blocks || []).some(b2 => (b2.slots || []).some(x => x.bucket === 'ISO_CALF' && (sets[x.slot_id] || 0) > 0));
        if (dayCalf && isCalf(fill.exercise_id)) {
          // (v0.5 / V2, COACH-R4 R4-LIB-01: the non-calf pick is never an optional add-on - the tibialis raise is one; a day that
          // already holds its calf exercise then needs no second calf station: that exercise is the day's calf and Achilles work)
          const alt = (fill.swaps || []).find(id => !isCalf(id) && model.hasEx(id) && !neverPick(model.ex(id)));
          if (alt) fill = { ...fill, exercise_id: alt, laterality: model.ex(alt).laterality === 'n/a' ? null : model.ex(alt).laterality, swaps: [fill.exercise_id, ...(fill.swaps || []).filter(id => id !== alt)], why: [...(fill.why || []), why('why.prehab_not_calf', 'R3-SES-01')] };
          else continue;
        }
      }
      if (fill) fills[slot.slot_id] = fill;
      const exId = fill && fill.exercise_id;
      const ex = exId && model.hasEx(exId) ? model.ex(exId) : null;
      const isTest = slot.bucket === 'TEST';
      const isText = (!!slot.text_key && !ex) || isTest;
      const noSets = isText || NO_SET_KINDS.includes(bd.kind) || slot.bucket === 'COND_WOD' || blk.kind === 'cooldown';
      const isRes = RES_KINDS.includes(bd.kind) || slot.origin === 'bonus';
      let s = null;
      if (!noSets) s = Object.prototype.hasOwnProperty.call(sets, slot.slot_id) ? sets[slot.slot_id] : (isRes ? null : (slot.default_sets ?? null));
      if (s === 0) continue;
      if (!ex && !isText && !['aerobic'].includes(bd.kind) && slot.bucket !== 'COND_WOD') continue;   // dropped slot (buy list / no candidate)
      // v0.4 fix round 2 / F2 (E-165, R2-PER-07): a station this week's timed test replaces (week.markTests) is not done - it is kept
      // aside so the athletic stairway doses the week as written and leaves it out
      if (repl.has(slot.slot_id)) { if (ex && typeof s === 'number' && s > 0) replaced.push({ day, slot, fill, ex, sets: s }); continue; }
      cands.push({ blk, slot, bd, fill, ex, sets: s, isRes: isRes && !!ex });
    }
    perDay.push({ day, cands });
  }
  // v1.2 (V27, review 03 / 08 majors): a week whose profile target for a key is 0 (in-season, heavy play, a sport without
  // throws) drops that key's stations; a small target trims stations (sets to 1, then the latest station) until the
  // per-set minimum dose fits target x (1 + tolerance) + one set
  const RCx = model.rules.athletic.reconcile;
  const wkT0 = athletic[n - 1] && athletic[n - 1].targets;
  // stage B2: the ballistic and reactive jumps are one family here (athletic.planAthletic moves their goals to the stations the
  // week holds), so a jump station is never dropped because its own key's target is 0 in the Receive stage
  const wkT = wkT0 && typeof wkT0.plyo_contacts === 'number' && typeof wkT0.jump_contacts === 'number'
    ? { ...wkT0, plyo_contacts: wkT0.plyo_contacts + wkT0.jump_contacts, jump_contacts: wkT0.plyo_contacts + wkT0.jump_contacts } : wkT0;
  if (RCx && RCx.enabled && wkT) {
    const feeds = {};
    perDay.forEach((pd, di) => pd.cands.forEach((x) => {
      if (!x.ex || !ATHLETIC_KEY_BUCKETS.includes(x.slot.bucket) || typeof x.sets !== 'number' || x.slot.bucket === 'AP_TRIPLE_EXT') return;
      const key0 = athleticKeyOf((x.fill && x.fill.bucket) || x.slot.bucket, x.ex);
      const key = key0 === 'plyo_contacts' || key0 === 'jump_contacts' ? 'jumps' : key0;
      const t = key === 'jumps' ? wkT.plyo_contacts : (key ? wkT[key] : null);
      // B2: each station's own minimum per-set dose (fixed sit-up / wall-ball throws, both legs of a single-leg drill)
      const lo = key0 ? perSetBounds(model, key0, x.ex, 1).lo : 1;
      if (key && typeof t === 'number') (feeds[key] = feeds[key] || []).push({ x, di, t, k: key0, lo });
    }));
    for (const [key, list] of Object.entries(feeds)) {
      const k0 = list[0].k;
      const t = list[0].t, slack = Math.max(...list.map(e => (RCx.per_set_max || {})[e.k] || 0));
      const limit = t * (1 + (RCx.tolerance || 0)) + slack;
      // v0.4 fix round 1 (sweep sport-bowling, V27: 28 jumps against 14): the reactive stations are dosed toward their own goal by the
      // athletic stairway (not their minimum), so the jump family's dose counts them at max(their minimum, the reactive target + one
      // contact a set) before the ballistic stations are trimmed
      const plyoT = key === 'jumps' && typeof wkT0.plyo_contacts === 'number' ? wkT0.plyo_contacts : null;
      const dose = () => {
        if (plyoT === null) return list.reduce((a, e) => a + (e.x.sets || 0) * e.lo, 0);
        const re = list.filter(e => e.k === 'plyo_contacts'), ba = list.filter(e => e.k !== 'plyo_contacts');
        const reMin = re.reduce((a, e) => a + (e.x.sets || 0) * e.lo, 0), reSets = re.reduce((a, e) => a + (e.x.sets || 0), 0);
        return ba.reduce((a, e) => a + (e.x.sets || 0) * e.lo, 0) + (re.length ? Math.max(reMin, plyoT + reSets) : 0);
      };
      const drop = (e) => { const c = perDay[e.di].cands; c.splice(c.indexOf(e.x), 1); list.splice(list.indexOf(e), 1); };
      if (t <= 0) { for (const e of list.slice()) drop(e); continue; }
      void k0;
      for (const e of list.slice().reverse()) { if (dose() <= limit + EPS) break; if (e.x.sets > 1) { while (e.x.sets > 1 && dose() > limit + EPS) e.x.sets--; } }
      while (dose() > limit + EPS && list.length > 1) drop(list[list.length - 1]);
    }
  }
  return { ws, vw, L, sel, sets, fills, perDay, replaced };
}

/** the athletic items of a collected week (athletic.planAthletic input): slot, weekday, effective bucket, record, sets */
function athleticItemsOf(col, model) {
  const out = [];
  // (fix round 2 / F2: the slot's time class and place in its track, whether the day holds a test, and the stations a timed test replaces)
  const testDays = new Set();
  for (const { day, cands } of col.perDay) if (cands.some(x => x.slot.test || x.slot.bucket === 'TEST')) testDays.add(day.weekday);
  const push = (day, x, replaced) => {
    if (!x.ex || !ATHLETIC_KEY_BUCKETS.includes(x.slot.bucket) || typeof x.sets !== 'number' || x.sets <= 0) return;
    out.push({ slot_id: x.slot.slot_id, weekday: day.weekday, bucket: (x.fill && x.fill.bucket) || x.slot.bucket, ex: x.ex, sets: x.sets,
      time_class: x.slot.time_class || null, order: typeof x.slot.track_index === 'number' ? x.slot.track_index : null, main: day.kind === 'main', free: !!x.slot.prep_in_warmup,
      replaced, test_day: testDays.has(day.weekday) });
  };
  for (const { day, cands } of col.perDay) for (const x of cands) push(day, x, false);
  for (const x of col.replaced || []) push(x.day, x, true);
  void model;
  return out;
}

function finishWeek(C, n, col) {
  const { deps, model, derived, athletic } = C;
  const R = model.rules;
  const { ws, vw, sets, fills, perDay } = col;
  // v0.4 fix round 1 / F2: the athletic stairway may run the ankle block at fewer sets to hold the week's plyo share (R2-ATH-01;
  // athletic.planAthletic `slot_plan[].sets`)
  const apF2 = C.athleticPlan && C.athleticPlan.weeks ? C.athleticPlan.weeks[n - 1] : null;
  // v0.4 fix round 2 / F2 (E-161 / E-162 / E-165): the plan's sets for an athletic station - one more set where the day has the minutes,
  // a second ankle day that waits for its exercise block (0 sets: no item), the end-test week's baseline dose on a tested day
  if (apF2) for (const pd of perDay) {
    for (const x of pd.cands) { const sp = apF2.slot_plan[x.slot.slot_id]; if (sp && typeof sp.sets === 'number' && typeof x.sets === 'number' && sp.sets >= 0 && sp.sets !== x.sets) x.sets = sp.sets; }
    pd.cands = pd.cands.filter(x => !(typeof x.sets === 'number' && x.sets === 0 && apF2.slot_plan[x.slot.slot_id] && apF2.slot_plan[x.slot.slot_id].sets === 0));
  }
  // ... and the minutes those set changes add to or take off the day (the volume engine's estimate read the layout's sets)
  if (apF2 && apF2.minutes_delta && vw.est_minutes) {
    vw.est_minutes = { ...vw.est_minutes };
    for (const [wd, m] of Object.entries(apF2.minutes_delta)) if (typeof vw.est_minutes[wd] === 'number') vw.est_minutes[wd] = Math.max(0, roundHalfUp(vw.est_minutes[wd] + m));
  }
  // the week's athletic stations: sets per budget key, and the athletic stairway's per-slot doses (stage B2, athletic.planAthletic)
  const stationsSets = {};
  for (const { cands } of perDay) for (const x of cands) {
    if (!x.ex || !ATHLETIC_KEY_BUCKETS.includes(x.slot.bucket) || typeof x.sets !== 'number') continue;
    const key = athleticKeyOf((x.fill && x.fill.bucket) || x.slot.bucket, x.ex);
    if (key) stationsSets[key] = (stationsSets[key] || 0) + x.sets;
  }
  const ap = C.athleticPlan && C.athleticPlan.weeks ? C.athleticPlan.weeks[n - 1] : null;
  // v0.4 B4: the rounds of the week's ballistic ball stations in a timed circuit (they share the week's throw target, dose.mjs)
  let circuitBallSets = 0;
  for (const { cands } of perDay) for (const x of cands) {
    if (!x.ex || !x.ex.medball || x.slot.block !== 'circuit' || !(x.slot.bucket === 'COND_CIRCUIT' || x.ex.is_athletic || x.ex.conditioning)) continue;
    circuitBallSets += (ws.circuit && ws.circuit.rounds) || (typeof x.sets === 'number' ? x.sets : 0);
  }
  // (fix round 2 / F2, sweep random-677: a hold week's circuit ball station is dosed at the stair level of the week before)
  const prevWs = n > 1 ? C.shape.weeks[n - 2] : null;
  const aw = athletic[n - 1] ? { ...athletic[n - 1], stations_sets: stationsSets, circuit_ball_sets: circuitBallSets, slot_plan: ap ? ap.slot_plan : {}, prev_stair_level: prevWs && prevWs.block_type === ws.block_type && prevWs.training_block === ws.training_block ? prevWs.stair_level ?? null : null } : null;
  const days = [];
  for (const { day, cands } of perDay) {
    const res = cands.filter(x => x.isRes);
    const lastRes = res.length ? res[res.length - 1] : null;
    // v0.4 fix round 1 / F3 (minimal seam; E-119, VOL-15 'MYO on the last machine / isolation exercise'): the day's last item that can
    // carry the last week's intensifier (a glute bridge or an Achilles-protected calf raise at the end hands it to the item before)
    const ie = typeof deps.intensifierEligible === 'function' ? deps.intensifierEligible : null;
    const eligRes = ie ? res.filter(x => !x.slot.test && typeof x.sets === 'number' && x.sets > 0 && ie(x.slot, x.fill, x.ex, derived, model)) : [];
    const smallOrMachine = res.filter(x => SMALL_RC_BUCKETS.includes((x.fill && x.fill.bucket) || x.slot.bucket) || (x.ex && (x.ex.equipment.machine || x.ex.tags.includes('machine')) && x.bd.kind !== 'resistance') ||
      (x.bd.kind === 'focus' && x.ex && x.ex.primary_muscle && model.muscle(x.ex.primary_muscle).class === 'small'));
    const lastSmall = smallOrMachine.length ? smallOrMachine[smallOrMachine.length - 1] : null;
    const firstUniLower = res.find(x => ['RP_UKD', 'RP_UHD'].includes((x.fill && x.fill.bucket) || x.slot.bucket) || (x.bd.region === 'lower' && ['unilateral', 'alternating'].includes(x.ex.laterality)));
    const firstBiCompound = res.find(x => x.bd.kind === 'resistance' && x.ex.laterality === 'bilateral' && x.ex.exercise_class === 'compound');
    const calfSets = res.filter(x => ((x.fill && x.fill.bucket) || x.slot.bucket) === 'ISO_CALF').reduce((a, x) => a + (x.sets || 0), 0);
    // a test item never runs as a superset (the partner goes straight sets, review 01 / 02 / 04)
    const supersetsOn = vw.supersets_on && typeof vw.supersets_on[day.weekday] === 'boolean' ? vw.supersets_on[day.weekday] : !!day.supersets_on;
    const dayCtx = { ...day, supersets_on: supersetsOn };
    // superset ids of the day (R3-SES-02 step 3): an eligible template pair is a superset on a day the plan runs supersets; a pair
    // needs both partners on the day, and a tested lift never runs in a superset (review 01 / 02 / 04)
    const ssIdOf = (x) => (x.slot.test ? null : (x.slot.superset || x.slot.superset_eligible || null));
    const idCount = new Map();
    for (const x of cands) { const id = ssIdOf(x); if (id && x.sets !== 0) idCount.set(id, (idCount.get(id) || 0) + 1); }
    const pairId = (x) => { const id = ssIdOf(x); return id && idCount.get(id) >= 2 ? id : null; };
    // v0.4 fix round 2 / F1 (E-158; RECHECK v0.4 01 / 02 minors: the week-12 MYO landed on a leg extension in the middle of a superset
    // while the day's real last machine item, the leg curl, followed it): the MYO goes to the day's last eligible item that does not
    // run inside a superset pair (VOL-15 'MYO only on the last exercise'); only when every eligible item is paired, to the last one
    const eligAlone = eligRes.filter(x => !(supersetsOn && pairId(x)));
    let lastInt = ie ? (eligAlone.length ? eligAlone[eligAlone.length - 1] : (eligRes.length ? eligRes[eligRes.length - 1] : null)) : undefined;
    // v0.5 fix round 1 (VOL-15 'MYO on the last machine or isolation exercise'; OBSERVED BYOP ATHLETIC G12 'MYO SET' on the leg
    // extension; samples 01 / 02 / 03 / 06: three of five MYO sets on calf raises, two before the week's sprint and jump tests, one
    // on the optional day's bonus raise): the day's leg-extension or leg-curl machine first, a calf raise only when the day holds no
    // other exercise that may carry it - never in a week with a sprint or jump test -, a two-sided exercise before a one-side one,
    // and the optional day carries none while a training day does (rules.effort.intensifiers.x1). Among those it is the LAST one.
    const IX = R.effort.intensifiers && R.effort.intensifiers.x1;
    if (ie && IX) {
      const pool = eligAlone.length ? eligAlone : eligRes;
      const bOf = (x) => (x.fill && x.fill.bucket) || x.slot.bucket;
      const isCalf = (x) => bOf(x) === 'ISO_CALF' || (x.ex && x.ex.credit_class === 'ISO_CALF');
      const oneSide = (x) => !!x.ex && ['unilateral', 'alternating'].includes(x.ex.laterality);
      const fieldTest = !!(ws.test && Array.isArray(ws.test.items) && ws.test.items.some(t => (IX.no_calves_with_tests || []).includes(t)));
      const nonCalf = pool.filter(x => !isCalf(x));
      const p1 = nonCalf.length ? nonCalf : (fieldTest ? [] : pool);
      const two = p1.filter(x => !oneSide(x));
      const p2 = two.length ? two : p1;
      lastInt = p2.length ? p2[p2.length - 1] : null;
      if (IX.main_days_only && day.kind !== 'main' && perDay.some(pd => pd.day.kind === 'main')) lastInt = null;
    }
    // v0.5 fix round 2 (H02 'never to failure on compounds'; sample 05: the quad station of a kit with no machine is a step-up - a
    // compound lift - and carried the last week's 10-s hold): in a timed circuit the hold goes to the day's first station whose
    // EXERCISE is an isolation exercise, a calf raise only when there is no other
    if (cands.some(x => x.slot.block === 'circuit' || x.slot.circuit)) {
      const circ = cands.filter(x => (x.slot.block === 'circuit' || x.slot.circuit) && x.ex && !x.ex.is_athletic && typeof x.sets === 'number' && x.sets > 0 && x.ex.exercise_class === 'isolation');
      const notCalf = circ.filter(x => x.ex.credit_class !== 'ISO_CALF');
      lastInt = notCalf[0] || circ[0] || null;
    }
    // v0.6 G-214 (R2-PER-07 the test is the session's focus; R3-VOL-04; reviews r6 02 m18, r5 01 m8: the front squat / bench 3RM days
    // and the sprint / jump test day also carried the week's MYO set): a day that holds a test carries no intensifier
    // (rules.effort.intensifiers.no_test_day)
    if (lastInt !== undefined && R.effort.intensifiers && R.effort.intensifiers.no_test_day && cands.some(x => x.slot.test || x.slot.bucket === 'TEST')) lastInt = null;
    // pass 2: doses + items
    const blocks = [];
    const testWhy = why('why.test_top_set', 'R2-PER-07');
    cands.forEach((x, i) => {
      const pid = pairId(x);
      const on = supersetsOn && !!pid;
      const position = {
        index_in_day: i, is_last_resistance: x === lastRes, is_first_lift_of_day: x === res[0], is_last_small: x === lastSmall,
        ...(lastInt === undefined ? {} : { is_last_intensifier: x === lastInt }),
        is_first_unilateral_lower: x === firstUniLower, is_first_bilateral_compound: x === firstBiCompound, calf_sets_today: calfSets,
        superset_active: on
      };
      let b = blocks.length ? blocks[blocks.length - 1] : null;
      if (!b || b.src !== x.blk) { b = { src: x.blk, kind: x.blk.kind, position: 0, movable: !!x.blk.movable, circuit: x.blk.circuit ?? null, items: [] }; blocks.push(b); }
      // a rep-max test is its own top-set item before the planned sets: the work-up to one top set (not a stairway set, no muscle
      // credit), then the lift's planned sets at the planned effort (R2-PER-07 'the test replaces that week's top set'; review
      // 01 / 02 / 07: '5 x 3 rep max', tests counted as stairway sets)
      if (x.slot.test && x.ex && x.slot.bucket !== 'TEST' && typeof x.sets === 'number' && x.sets > 0 && !x.slot.aerobic) {
        // v0.4 fix round 1 (E-91; COACH-R2 R2-PER-07 'tested ... instead of that week's top sets'; RECHECK 01 / 02 / 03 / 04 / 07 majors:
        // the 3RM / 1RM work-up came on top of the full 3 x 6-8 at 1 RIR): the test IS the lift's top set - it counts as one of the
        // lift's planned sets (its credits) and the rest are back-off sets a step easier (rules.tests.replaces_top_set)
        const RT = R.tests && R.tests.replaces_top_set;
        const replaces = !!(RT && x.sets >= 2);
        const t = buildItem(C, n, ws, vw, dayCtx, { ...x, sets: 1 }, { ...position, superset_active: false, is_last_resistance: false, is_last_small: false }, aw);
        t.slot_id = x.slot.slot_id + '.test'; t.station_id = x.slot.station_id ? x.slot.station_id + '.test' : null;
        t.role = 'test'; t.origin = 'test'; t.sets = 1; t.superset = null; t.swaps = []; t.swap_notes = []; t.instead_of = null; t.group = null;
        t.credits = replaces ? creditsFor(model, x.ex, (x.fill && x.fill.bucket) || x.slot.bucket) : {};
        // (fix round 1, samples 01 / 02: the note said 'Test first' under a lift that came after 4-5 sets of rows - the tested lift now
        // opens the day's lifts, week.testedLiftFirst, and the note says 'first' only when it is the first lift of the day)
        const firstLift = !cands.slice(0, i).some(y => y.isRes && !(y.slot.test && y.slot.bucket !== 'TEST'));
        const topKey = replaces ? (firstLift || !model.i18n.en['note.test_top_set_replaces_later'] ? 'note.test_top_set_replaces' : 'note.test_top_set_replaces_later') : 'note.test_top_set';
        t.notes = [{ key: topKey, args: { test: 'tests.' + (t.test ? t.test.test : x.slot.test) } }, ...t.notes.filter(nt => nt.key !== 'note.test_rep_max_work_up' && nt.key !== insteadNoteKey(model))];
        t.why = dedupeWhy([...t.why, replaces ? why('why.test_replaces_top_set', 'R2-PER-07') : testWhy]);
        t.superset_suggested = null;
        b.items.push(t);
        const plain = { ...x, sets: replaces ? x.sets - 1 : x.sets, slot: { ...x.slot, test: null } };
        const item = buildItem(C, n, ws, vw, dayCtx, plain, position, aw);
        item.superset = null;
        item.why = dedupeWhy([...item.why, replaces ? why('why.test_replaces_top_set', 'R2-PER-07') : testWhy]);
        item.superset_suggested = null;
        if (replaces) {
          // back-off sets: the planned effort plus the rule's extra reps in the tank (never under 2, inside the coach's 1-3)
          const e = item.effort && item.effort.type === 'rir' ? item.effort : null;
          if (e) {
            const lo = Math.min(3, Math.max(RT.back_off_rir_min || 2, (e.min || 1) + (RT.back_off_rir_add || 1)));
            const hi = Math.min(3, Math.max(lo, (e.max || lo) + (RT.back_off_rir_add || 1)));
            item.effort = { ...e, min: lo, max: hi, rpe_min: 10 - hi, rpe_max: 10 - lo, last_set: null, intensifier: false };
          }
          if (!item.flags.includes('back_off')) item.flags = [...item.flags, 'back_off'].sort();
          item.notes = [{ key: plain.sets === 1 && model.i18n.en['note.test_back_off_one'] ? 'note.test_back_off_one' : 'note.test_back_off', args: { n: plain.sets, rir: item.effort && item.effort.type === 'rir' ? (item.effort.min === item.effort.max ? String(item.effort.min) : item.effort.min + '-' + item.effort.max) : '2-3' } }, ...item.notes];
        }
        b.items.push(item);
        return;
      }
      const item = buildItem(C, n, ws, vw, dayCtx, x, position, aw);
      item.superset = on ? pid : null;
      item.superset_suggested = pid; // R3-SES-02: the pair the plan recommends (the person may switch it on or off)
      b.items.push(item);
    });
    blocks.forEach((b, i) => { b.position = i; delete b.src; });
    // v0.4 fix round 1 / F2 (COACH-ANSWER ORD-03 / GEN-08 'power before strength'; RECHECK 05 major: the KB swing after two hamstring
    // stations, the medball throw as the day's last station): a ballistic circuit station (medball throw / slam, KB swing) opens its
    // circuit, done fresh
    if (R.athletic.f2 && R.athletic.circuit_ballistic) for (const b of blocks) {
      if (b.kind !== 'circuit' || b.items.length < 2) continue;
      const ballistic = (it) => it.bucket === 'COND_CIRCUIT' && !!it.exercise_id && model.hasEx(it.exercise_id) && (!!model.ex(it.exercise_id).medball || model.ex(it.exercise_id).tags.includes('kb_swing'));
      const first = b.items.filter(ballistic);
      if (first.length && !ballistic(b.items[0])) {
        b.items = [...first, ...b.items.filter(it => !ballistic(it))];
        for (const it of first) it.why = dedupeWhy([...(it.why || []), why('why.power_before_strength', 'ORD-03')]);
      }
    }
    // (fix round 2: the coach's own slots of a circuit - `own` on the layout slot - keep his order; the added stations are placed around them)
    const ownIds = new Set((day.blocks || []).flatMap(b2 => b2.slots || []).filter(sl => sl.own).map(sl => sl.slot_id));
    sequenceCircuits(blocks, model, ownIds);
    pairLeftovers(blocks, model, supersetsOn);
    // v0.6 (G-117; PER-04, E-131 'a swap never repeats an exercise of the day'): the volume engine's added exercise is placed after
    // the template's swap lists were made - a swap that names an exercise the day already holds leaves the list (and its note)
    {
      const dayIds = new Set(blocks.flatMap(b => b.items.map(it => it.exercise_id)).filter(Boolean));
      for (const b of blocks) for (const it of b.items) {
        if (!(it.swaps || []).length) continue;
        const keep = (id) => id === it.exercise_id || !dayIds.has(id);
        if (it.swaps.every(keep)) continue;
        it.swaps = it.swaps.filter(keep);
        it.swap_notes = (it.swap_notes || []).filter(n => !n || keep(n.id));
      }
    }
    distinctDetails(blocks, model, derived);
    // stable block ids and on / off switches (R3-SES-02 'turn off that day's athletic training or that day's core training';
    // spec plan_editing.block_ids: blk.<day_type>.<kind>.<n>, the same id every week of the block)
    const BE = R.ordering.block_editing || null;
    const kindN = {};
    for (const b of blocks) {
      kindN[b.kind] = (kindN[b.kind] || 0) + 1;
      // v0.4 fix round 1 (RECHECK 03 / 07 minors: 'blk.Push.core.1' on Monday and Thursday, 'blk.Legs 1.core.1' with a space, one
      // aerobic id on two days): weekday + day-type slug, so an edit to one day never hits another day of the same type
      const slug = String(day.day_type || 'day').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'day';
      b.id = 'blk.' + day.weekday.toLowerCase() + '-' + slug + '.' + b.kind + '.' + kindN[b.kind];
      b.toggle = !!(BE && BE.toggle && BE.toggle[b.kind]);
      b.removable = !!(BE && BE.removable && BE.removable[b.kind]);
      // (fix round 2 / F2 minimal seam, E-175: joint care the coach wants every session - a swimmer's shoulder care, R3-ATH-01, ORD-07
      // survival work - is not a block to switch off)
      if (b.kind === 'prehab' && b.items.some(it => (it.why || []).some(w => w.key === 'why.shoulder_care_each_session')) &&
          Object.values(R.prehab.by_injury_code || {}).some(x => x.each_session_keep)) { b.toggle = false; b.removable = false; }
    }
    // v0.4 fix round 2 / F1 (E-152; RECHECK v0.4 05 major: the KB swing, the throws and the calf / isolation stations sat inside circuit
    // blocks that could be neither switched off nor removed): a circuit's athletic / cardio station can be switched off and its
    // isolation and calf stations removed one by one (COACH-R3 R3-SES-02 'turn off that day's athletic training ... delete certain
    // exercises'); a switched-off station keeps the circuit's rounds
    const toggleItems = [];
    for (const b of blocks) if (b.kind === 'circuit') for (const it of b.items) {
      const bd = bucketDef(model, it.bucket) || {};
      const ath = it.bucket === 'COND_CIRCUIT' || !!it.athletic;
      const acc = bd.kind === 'isolation' || it.bucket === 'ISO_CALF';
      if (ath || acc) toggleItems.push({ slot_id: it.slot_id, block_id: b.id, kind: ath ? 'athletic' : 'accessory', toggle: ath, removable: true });
    }
    const supersetRecs = supersetRecommendations(blocks, fills, model, derived, ws, supersetsOn);
    const groups = {};
    for (const x of cands) if (x.isRes) { const g = itemGroup(model, x); if (g) groups[g] = (groups[g] || 0) + 1; }
    const est = vw.est_minutes && typeof vw.est_minutes[day.weekday] === 'number' ? vw.est_minutes[day.weekday] : deps.estimateMinutes(dayCtx, sets, fills, model, { week: ws });
    days.push({
      weekday: day.weekday, day_type: day.day_type ?? null, kind: day.kind, optional: !!day.optional, label_key: day.label_key,
      full_body: !!day.full_body, format: day.format || 'straight', est_minutes: typeof est === 'number' ? roundHalfUp(est) : null,
      aerobic_minutes: typeof deps.aerobicMinutes === 'function' ? deps.aerobicMinutes(day, model) : 0,
      // v0.5 (R4-SES-02 / R4-SES-04): the day's exercise count (the warm-up, the 2 core exercises, joint care, conditioning, cardio,
      // a test's own top set and the quick ankle prep block are outside it) and what is easiest to remove if the person wants a shorter day - never removed for them
      exercise_count: blocks.reduce((a, b) => a + (R.session.outside_cap_blocks.includes(b.kind) ? 0 : b.items.filter(it => it.role !== 'test' && !isAnklePrep(it, R) && (typeof it.sets !== 'number' || it.sets > 0)).length), 0),
      // v0.5 / V3 (R4-SES-05): the coach's skeleton the day follows (gym_A = pull + knee dominant, gym_B = push + hip dominant ...;
      // null for a day type with no skeleton); the validator holds the day to it (V30)
      skeleton: ['main', 'optional'].includes(day.kind) ? (day.skeleton ?? null) : null,
      easy_to_remove: easyToRemove(blocks, model),
      supersets_on: supersetsOn,
      superset_recommendations: supersetRecs,
      toggle_blocks: blocks.filter(b => b.toggle).map(b => b.kind).filter((k, i, a) => a.indexOf(k) === i),
      toggle_items: toggleItems,
      groups: orderedGroups(groups, R), why: dedupeWhy(day.why), blocks
    });
  }
  days.sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday));
  const items = days.flatMap(d => d.blocks.flatMap(b => b.items));
  const order = R.muscles.order;
  const lineOrder = (R.muscles.lines && R.muscles.lines.order) || order;
  const groupOrder = R.muscles.groups.order.filter(g => g !== 'core');
  const a = athletic[n - 1] || null;
  return {
    n, training_block: ws.training_block, block_type: ws.block_type, exercise_block: ws.exercise_block,
    stair_week: ws.stair_week ?? null, stair_level: ws.stair_level ?? null, phase: ws.phase, phase_key: ws.phase_key,
    planned_rir: ws.planned_rir ?? null, season_phase: ws.season_phase ?? null, rep_phase: ws.rep_phase ?? null, plyo_stage: ws.plyo_stage ?? null,
    test: ws.test ?? null, circuit: ws.circuit ?? null,
    // v0.4: step / target are per LINE (one shoulders line, R3-VOL-01); weekly / direct sets per muscle for display and V14;
    // the line and group tallies (group credit) carry the floor and the climb (R3-SES-01)
    step_by_muscle: orderedMap(vw.step_by_muscle, lineOrder, x => roundTo(x, 4)),
    target_by_muscle: orderedMap(vw.target_by_muscle, lineOrder, x => (x === null ? null : round2(x))),
    weekly_sets_by_muscle: orderedMap(vw.weekly_sets_by_muscle, order, round2),
    direct_sets_by_muscle: orderedMap(vw.direct_sets_by_muscle, order, round2),
    main_sets_by_muscle: orderedMap(vw.main_sets_by_line || vw.main_sets_by_muscle || vw.weekly_sets_by_muscle, lineOrder, round2),
    weekly_sets_by_line: orderedMap(vw.weekly_sets_by_line || {}, lineOrder, round2),
    weekly_sets_by_group: orderedMap(vw.weekly_sets_by_group || {}, groupOrder, round2),
    main_sets_by_group: orderedMap(vw.main_sets_by_group || {}, groupOrder, round2),
    // v0.5: the week's whole-set target per trained group (the stairway), and the weeks that add more than about 15 % (R4-PRG-02)
    target_by_group: orderedMap(vw.target_by_group || {}, groupOrder, x => (x === null ? null : round2(x))),
    acceleration: (vw.acceleration || []).map(a => ({ ...a })),
    credit_only_groups: (vw.credit_only_groups || []).slice(),
    total_main_sets: typeof vw.total_main_sets === 'number' ? vw.total_main_sets : (vw.total_resistance_sets ?? null),
    group_counts_by_day: Object.fromEntries(days.filter(d => Object.keys(d.groups).length).map(d => [d.weekday, d.groups])),
    total_resistance_sets: vw.total_resistance_sets ?? null,
    rise_vs_prev: typeof vw.rise_vs_prev === 'number' ? roundTo(vw.rise_vs_prev, 4) : null,
    athletic_budget: a ? athleticBudgetOut(a, items, ap) : null,
    aerobic_sessions: items.filter(it => it.aerobic || it.bucket === 'COND_AEROBIC').length,
    changes: (vw.changes || []).map(c => ({ ...c })),
    why: dedupeWhy([...(ws.why || []), ...(vw.why || [])]),
    days
  };
}

/**
 * Superset recommendations of a day (R3-SES-02 'supersets are recommended as a way to save time', kept by CT-01): every eligible
 * pair of the day with the minutes it saves (an estimate); `on` when the day runs it as a superset (the client's preference), else
 * a suggestion the person may switch on. Never a requirement: no day 'needs' a superset (v0.5).
 * @returns {Array<{pair_id:string, items:string[], minutes_saved:number, on:boolean}>}
 */
function supersetRecommendations(blocks, fills, model, derived, ws, on) {
  const T = model.rules.time_model;
  const byId = new Map();
  for (const b of blocks) for (const it of b.items) if (it.superset_suggested && typeof it.sets === 'number' && it.sets > 0) {
    if (!byId.has(it.superset_suggested)) byId.set(it.superset_suggested, []);
    byId.get(it.superset_suggested).push(it);
  }
  const out = [];
  for (const [id, list] of byId) {
    if (list.length < 2) continue;
    const members = list.map(it => ({ sets: it.sets, cost: setCost({ slot_id: it.slot_id, bucket: it.bucket, role: it.role, time_class: null }, fills[it.slot_id] || { laterality: it.laterality, bucket: it.bucket }, model, derived, ws) }));
    const straight = members.reduce((a, x) => a + x.sets * x.cost.minutes + T.changeover_min_per_exercise, 0);
    const saved = Math.max(0, Math.round((straight - supersetMinutes(members, model)) * 2) / 2);
    out.push({ pair_id: id, items: list.map(it => it.slot_id), minutes_saved: saved, on: !!on });
  }
  return out;
}

/**
 * v0.5 (COACH-R4 R4-SES-04): nothing is dropped automatically - the person picks. The plan only names what is easiest to remove,
 * in the order of rules.session.easy_to_remove: conditioning finishers, the athletic stations after the day's first, the
 * small-muscle accessories (latest first), the bonus exercises. The core block, the main lifts and the day's first athletic
 * station are never listed.
 * @returns {Array<{slot_id:string, kind:string}>}
 */
/** the quick ankle prep block (rules.athletic.f2.ankle_block.outside_athlete_cap): outside the day's exercise count */
function isAnklePrep(it, R) {
  const AB = R.athletic.f2 && R.athletic.f2.ankle_block;
  if (!AB || !AB.outside_athlete_cap || it.bucket !== 'AP_JUMP_LIMITED_KNEE') return false;
  return (it.flags || []).includes('ankle_block') || !!(it.athletic && it.athletic.key === 'low_contacts');
}

function easyToRemove(blocks, model) {
  const E = model.rules.session.easy_to_remove;
  if (!E) return [];
  const keep = new Set(E.always_keep || []);
  const items = blocks.flatMap(b => b.items.map(it => ({ it, b }))).filter(({ it }) => typeof it.sets !== 'number' || it.sets > 0);
  const firstAth = items.find(({ b }) => b.kind === 'athletic');
  const kindOf = ({ it, b }) => {
    if (keep.has(it.role)) return null;
    if (it.origin === 'bonus') return 'bonus_exercise';
    if (b.kind === 'conditioning') return 'conditioning_finisher';
    if (b.kind === 'athletic') return firstAth && firstAth.it === it ? null : 'extra_athletic_station';
    const bd = bucketDef(model, it.bucket) || {};
    if (b.kind === 'accessories' && (bd.kind === 'isolation' || bd.kind === 'focus')) return 'small_muscle_accessory';
    return null;
  };
  const out = [];
  for (const kind of E.order || []) {
    const hit = items.filter(x => kindOf(x) === kind).reverse();
    for (const { it } of hit) out.push({ slot_id: it.slot_id, kind });
  }
  return out;
}

/**
 * Limited kits can leave the same exercise twice on one day (select's last resort keeps a muscle group at 2 exercises with
 * a one-detail variation, R2-LIB-01 / R2-SES-05). A repeat that ended up with the same detail as an earlier copy takes the
 * next unused axis of the exercise's `variation_axes`, so the day never lists the identical exercise twice. Same exercise,
 * bucket, sets and credits: nothing counted changes (integration decision D-48).
 */
/**
 * v0.4 fix round 1 (E-90; RECHECK 07 / 08 majors: only the core pair was recommended on most days, 'Supersets marked today keep you
 * inside 45 min' with no pair marked): an isolation or joint-care exercise the week keeps whose layout partner was cut (or that had
 * none) pairs with a compatible neighbour - the next exercise in the same block, or the head of the next block (an isolation, then
 * the joint care: the partner moves to the head of the joint-care block, which has no order rule). Same pairing rules as
 * week.pairRemaining (never one group or two lower isolations, except quad + leg-curl; never two joint-care items). A recommendation
 * the person may switch on (R3-SES-02 step 3); on a day that runs its pairs, it runs too.
 */
function pairLeftovers(blocks, model, on) {
  const live = (it) => typeof it.sets === 'number' && it.sets > 0;
  const count = new Map();
  for (const b of blocks) for (const it of b.items) if (it.superset_suggested && live(it)) count.set(it.superset_suggested, (count.get(it.superset_suggested) || 0) + 1);
  const lone = (it) => !it.superset_suggested || (count.get(it.superset_suggested) || 0) < 2;
  const bd = (it) => { try { return model.bucket(it.bucket); } catch { return null; } };
  const kind = (it) => (bd(it) || {}).kind || null;
  const MD = model.rules.muscles.defs;
  const lower = (it) => { const ex = it.exercise_id && model.hasEx(it.exercise_id) ? model.ex(it.exercise_id) : null; const m = ex && ex.primary_muscle; return (m && MD[m] ? MD[m].region === 'lower' : false) || /LOWER|CALF|QUAD|LEG_|HIP|GLUTE/.test(it.bucket || ''); };
  // (fix round 2 / F1, E-158: the item that carries the last week's MYO set stays out of a suggested pair - a MYO never runs inside a
  // superset, VOL-15)
  const eligible = (it) => live(it) && lone(it) && !it.test && !(it.effort && it.effort.last_set === 'myo') && !['work', 'test', 'core_block', 'warmup'].includes(it.role) && (['isolation', 'focus', 'prehab'].includes(kind(it)) || it.role === 'prehab');
  const compatible = (a, b) => {
    if (a.role === 'prehab' && b.role === 'prehab') return false;
    if (a.bucket === b.bucket || (a.group && a.group === b.group)) return false;
    if (lower(a) && lower(b)) return (a.bucket === 'ISO_QUAD' && b.bucket === 'ISO_LEG_FLEXION') || (a.bucket === 'ISO_LEG_FLEXION' && b.bucket === 'ISO_QUAD');
    return true;
  };
  let k = 0;
  for (const b of blocks) for (const it of b.items) { const m = /^X(\d+)$/.exec(it.superset_suggested || ''); if (m) k = Math.max(k, Number(m[1])); }
  const pair = (a, b) => { const id = 'X' + (++k); for (const it of [a, b]) { it.superset_suggested = id; it.superset = on ? id : null; } count.set(id, 2); };
  const WORK = ['strength', 'accessories', 'prehab'];
  for (let bi = 0; bi < blocks.length; bi++) {
    const B = blocks[bi];
    if (!WORK.includes(B.kind)) continue;
    for (let i = 0; i + 1 < B.items.length; i++) if (eligible(B.items[i]) && eligible(B.items[i + 1]) && compatible(B.items[i], B.items[i + 1])) { pair(B.items[i], B.items[i + 1]); i++; }
    const next = blocks[bi + 1];
    const a = B.items[B.items.length - 1];
    if (!next || !WORK.includes(next.kind) || !a || !eligible(a)) continue;
    const j = next.items.findIndex(x => eligible(x) && compatible(a, x));
    if (j < 0 || (j > 0 && next.kind !== 'prehab')) continue;
    const [b] = next.items.splice(j, 1);
    next.items.unshift(b);
    pair(a, b);
  }
}

function distinctDetails(blocks, model, derived) {
  const used = new Map();   // exercise id -> Set of detail values already on the day ('' = no detail)
  // v0.4 stage B3 (minimal): a rep-max test item and its planned sets are the same lift (never a 'different grip' copy, RECHECK
  // 01 / 02 / 07: 'Hex Bar Deadlift - different grip' in week 1); a repeat takes the next concrete variation of the record
  // (select.variationValues), never the axis alone
  const kit = new Set(((derived && derived.D8_kit) || {}).tokens || []);
  const pain = ((derived && derived.pain) || []).map(p => p.area);
  for (const b of blocks) for (const it of b.items) {
    if (!it.exercise_id || b.kind === 'warmup' || it.role === 'test') continue;
    const axes = used.get(it.exercise_id) || new Set();
    const mine = it.detail ? (it.detail.value || it.detail.axis) : '';
    if (axes.has(mine)) {
      const ex = model.ex(it.exercise_id);
      const next = selectMod.variationValues(model, ex, kit, pain).find(v => !axes.has(v.value));
      if (next) {
        it.detail = { axis: next.axis, key: next.key, value: next.value };
        if (!it.flags.includes('detail_variation')) it.flags = [...it.flags, 'detail_variation'].sort();
        it.why = dedupeWhy([...it.why.filter(w => w.key !== 'why.detail_variation'), why('why.detail_variation', 'R2-LIB-01', { axis: next.axis })]);
      }
    }
    axes.add(it.detail ? (it.detail.value || it.detail.axis) : '');
    used.set(it.exercise_id, axes);
  }
}

function buildItem(C, n, ws, vw, day, x, position, aw) {
  const { deps, model, derived, athletic, targets } = C;
  const { slot, bd, fill, ex } = x;
  const effBucket = (fill && fill.bucket) || slot.bucket;
  let dose = null;
  if (slot.bucket === 'TEST') dose = typeof deps.doseTestItem === 'function' ? deps.doseTestItem(slot, ws, derived, model) : null;
  else if (bd.kind === 'aerobic') dose = deps.doseAerobic(slot, ws, derived, model, fill);   // B3: the fill names the session's pattern
  // (F3 minimal seam: a circuit station is dosed with its day and position, so the last week's circuit intensifier lands on the day's last eligible station)
  else if (slot.bucket === 'COND_WOD' || slot.bucket === 'SKILL' || slot.circuit) dose = deps.doseConditioning(slot, fill, aw ? { ...ws, athletic_week: aw } : ws, derived, model, slot.circuit ? { day, position } : undefined);
  else if (!['warmup'].includes(bd.kind) && slot.block !== 'cooldown' && ex) {
    const m = ex.primary_muscle;
    const bt = (C.volume.block_targets || []).find(b => b.training_block === ws.training_block);
    const capM = bt && bt.cap && typeof bt.cap[m] === 'number' ? bt.cap[m] : (targets && targets.cap ? targets.cap[m] : null);
    const tM = vw.target_by_muscle ? vw.target_by_muscle[m] : null;
    const atCap = typeof capM === 'number' && typeof tM === 'number' && tM >= capM - EPS;
    // B3 (minimal): the slot's sets in its exercise block's first week (the pyramid is decided for the whole block, PER-02)
    const ebDef = C.shape.exercise_blocks.find(e => e.n === ws.exercise_block);
    const firstVw = ebDef ? C.volume.weeks[ebDef.weeks[0] - 1] : null;
    const block_first_sets = firstVw && firstVw.sets_by_slot && typeof firstVw.sets_by_slot[slot.slot_id] === 'number' ? firstVw.sets_by_slot[slot.slot_id] : x.sets;
    dose = deps.doseItem({ slot, fill, exercise: ex, sets: x.sets, week: ws, day, derived, athletic: aw || athletic[n - 1] || null, position, at_cap: atCap, model, contact_scale: C.contactScale || 1, block_first_sets });
  }
  dose = dose || {};
  const test = dose.test || (dose.reps && dose.reps.type === 'test' ? { type: 'test', test: dose.reps.test } : null) || slot.test || null;
  // v0.4 fix round 1 (E-89): joint care credits no muscle when rules.prehab.credits is 'none' (survival work, ORD-07)
  const credits = ex && !(slot.role === 'prehab' && model.rules.prehab && model.rules.prehab.credits === 'none') ? creditsFor(model, ex, effBucket) : {};
  return {
    slot_id: slot.slot_id, station_id: slot.station_id ?? null, bucket: effBucket, role: slot.role ?? null, origin: slot.origin || 'template',
    group: ex && x.isRes ? itemGroup(model, x) : (slot.group ?? null),
    exercise_id: ex ? ex.id : null, name_key: ex ? ex.name_key : (slot.bucket === 'TEST' && slot.test && !model.has('en', 'tests.' + slot.test) && model.hasEx(slot.test) ? model.ex(slot.test).name_key : null), detail: (fill && fill.detail) || null,
    text_key: ex ? null : (slot.text_key ?? (slot.bucket === 'TEST' && slot.test && model.has('en', 'tests.' + slot.test) ? 'tests.' + slot.test : null)), cue_key: ex ? ex.cue_key : null,
    // v0.5 / V2 (COACH-R4 R4-LIB-05): a YouTube search link built from the exercise name, and the exact name to copy
    video: ex ? videoOf(model, ex) : null,
    sets: x.sets, reps: dose.reps ?? null, set_reps: dose.set_reps ?? null, effort: dose.effort ?? null, rest: dose.rest ?? null,
    load: dose.load ?? null, tempo_key: dose.tempo_key ?? null,
    superset: slot.superset ?? slot.pair ?? null,
    laterality: (fill && fill.laterality) || (ex ? ex.laterality : null), loading: (fill && fill.loading) || null,
    credits, athletic: dose.athletic ?? null, aerobic: slot.aerobic ?? null, circuit: dose.circuit ?? null, wod: dose.wod ?? null,
    test: test ? { type: 'test', test: test.test } : null,
    // v0.5 (R4-PRG-03, CX-02): how this exercise progresses, as a rule the person applies - never a promised number per week
    progression: progressionOf(dose, x, bd),
    notes: [...(dose.notes || []).map(nt => ({ ...nt })),
      // v0.5 fix round 1 (sample 08): the template's own lift that is also the day's joint care says so (no extra item is added)
      ...(slot.care_code && ex && model.has('en', 'note.joint_care_slot') ? [{ key: model.has('en', 'prehab.label.' + slot.care_code) ? 'prehab.label.' + slot.care_code : 'note.prehab', args: { code: slot.care_code } }, { key: 'note.joint_care_slot' }] : []),
      // v0.5 / V2 (COACH-R4 R4-LIB-04): an equipment stand-in says what it stands in for, what it keeps and what it loses
      ...(ex && fill && fill.instead_of && model.hasEx(fill.instead_of.exercise_id) && insteadNoteKey(model)
        ? [{ key: insteadNoteKey(model), args: { pick: ex.name_key, instead: model.ex(fill.instead_of.exercise_id).name_key, keeps: fill.instead_of.keeps, loses: fill.instead_of.loses } }] : [])],
    swaps: ((fill && fill.swaps) || []).slice(),
    // v0.5 / V2 (R4-LIB-04): one line per swap - what it keeps and what it loses
    swap_notes: ex ? swapNotes(model, ex.id, (fill && fill.swaps) || []) : [],
    instead_of: fill && fill.instead_of ? { ...fill.instead_of } : null,
    // (a station the layout placed as the quick ankle prep block says so on the item: it is outside the day's exercise count
    // whatever drill fills it - an ankle-pain swap can put a low jump there)
    flags: [...((fill && fill.flags) || []), ...(slot.ankle_block && !((fill && fill.flags) || []).includes('ankle_block') ? ['ankle_block'] : []),
      // (fix round 1: a template lift that is also the day's joint care - the calf raise for the Achilles, the leg extension for the knee)
      ...(slot.care_code ? ['joint_care'] : [])],
    why: dedupeWhy([...(slot.why || []), ...((fill && fill.why) || []), ...(dose.why || [])])
  };
}

/** v0.5 / V2 (R4-LIB-04): the note key of an equipment stand-in (rules.selection.swap_notes.instead_of_note), or null */
function insteadNoteKey(model) {
  const SN = model.rules.selection && model.rules.selection.swap_notes;
  const k = SN && SN.enabled ? SN.instead_of_note : null;
  return k && model.has('en', k) ? k : null;
}

/** the progression rule of a set-and-rep item (R4-PRG-03): the rep range, when to add load, else repeat */
function progressionOf(dose, x, bd) {
  if (!x.isRes || !bd || !['resistance', 'isolation', 'focus'].includes(bd.kind) || typeof x.sets !== 'number' || x.sets <= 0) return null;
  const r = dose && dose.reps;
  if (!r || r.type === 'test') return null;
  const lo = typeof r.min === 'number' ? r.min : (typeof r.value === 'number' ? r.value : null);
  const hi = typeof r.max === 'number' ? r.max : lo;
  if (!Number.isSafeInteger(lo) || !Number.isSafeInteger(hi) || lo < 1 || hi < lo) return null;
  return progressionRule({ repMin: lo, repMax: hi, allowLoadProgression: true });
}

function creditsFor(model, ex, bucket) {
  if (ex.tags.some(t => model.rules.credit.never_credit_tags.includes(t))) return {};
  return { ...model.credits(ex, bucket) };
}

function itemGroup(model, x) {
  // v0.6 G-213 (H08 counting; review r6 02 m17: Tuesday read 'Chest 1, Shoulders 2' while the bench and the incline press are both
  // chest by the plan's own credits): with rules.render.v6.glance_by_credits the group is the one the exercise trains as a prime mover
  // (credit 1), the template's group first when it is one of them - as the volume engine counts it
  const RV = model.rules.render && model.rules.render.v6;
  if (RV && RV.glance_by_credits && x.ex && x.ex.credits) {
    const full = [];
    for (const [m, c] of Object.entries(x.ex.credits)) if (c >= 1 - 1e-9) { let g = null; try { g = model.groupOf(m); } catch { g = null; } if (g && !full.includes(g)) full.push(g); }
    if (x.slot.group && full.includes(x.slot.group)) return x.slot.group;
    const ord = model.rules.muscles.groups.order;
    full.sort((a, b) => ord.indexOf(a) - ord.indexOf(b));
    if (full.length) return full[0];
  }
  if (x.slot.group) return x.slot.group;
  if (x.slot.focus_muscle) return model.groupOf(x.slot.focus_muscle);
  return x.ex && x.ex.primary_muscle ? model.groupOf(x.ex.primary_muscle) : null;
}

function orderedGroups(groups, R) {
  const out = {};
  for (const g of R.muscles.groups.order) if (groups[g]) out[g] = groups[g];
  for (const g of Object.keys(groups).sort()) if (!(g in out)) out[g] = groups[g];
  return out;
}

function orderedMap(obj, order, fn) {
  const out = {};
  if (!obj) return out;
  for (const m of order) if (m in obj) out[m] = obj[m] === null || obj[m] === undefined ? null : fn(obj[m]);
  for (const m of Object.keys(obj).sort()) if (!(m in out)) out[m] = obj[m] === null || obj[m] === undefined ? null : fn(obj[m]);
  return out;
}

/**
 * plan.weeks[].athletic_budget (CONTRACTS §5): the budget's targets, what the week plans (planned; v0.4 B2 adds upper_contacts -
 * push-up plyos, outside the lower-body budget), the plyo share actually planned (R2-ATH-01: reactive jumps + ankle work over all
 * jump and throw work), the goals the athletic stairway dosed toward (capacity-scaled) and the per-key scale.
 */
function athleticBudgetOut(a, items, ap) {
  const planned = plannedAthleticOf(items);
  return {
    plyo_share: a.plyo_share ?? null, stage: a.stage ?? null, factor: a.factor ?? null, targets: a.targets ?? null,
    planned, planned_share: plannedShare(planned), goals: ap && ap.goals ? { ...ap.goals } : null, scale: ap && ap.scale ? { ...ap.scale } : null,
    hold: !!(a.hold), contacts_session_max: a.contacts_session_max ?? null,
    // fix round 2 / F2 (E-165): what this week's timed tests replaced (per key), and the end-test week's baseline dose on tested days
    ...(ap && ap.replaced ? { test_replaced: { ...ap.replaced } } : {}), ...(ap && ap.test_dose ? { test_dose: ap.test_dose } : {}),
    // ... and the keys the plyo share moved this week (R2-ATH-01: the share is the rule over the per-key doses)
    ...(ap && ap.share && Array.isArray(ap.share.moved) && ap.share.moved.length ? { share_moved: ap.share.moved.slice() } : {})
  };
}

function dedupeWhy(list) {
  const seen = new Set(), out = [];
  for (const w of list || []) {
    if (!w || !w.key) continue;
    const k = canonicalJSON(w);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(w.args && Object.keys(w.args).length ? { key: w.key, ref: w.ref, args: { ...w.args } } : { key: w.key, ref: w.ref });
  }
  return out;
}

// ------------------------------------------------------------------------------------------------------------- meta / summary

function programId(C) {
  const fromLayout = C.layouts[0] && C.layouts[0].program_id;
  if (fromLayout) return fromLayout;
  const d = C.derived, D6 = d.D6_week_layout || {};
  let profileFamily = null;
  try { profileFamily = C.model.sport(d.D2_profile.id).family; } catch { profileFamily = null; }
  const ctx = { family: D6.family, days: D6.days, variant: D6.variant, goal: d.goal, format: d.format, competitive: d.D2_profile && d.D2_profile.competitive, profile_family: profileFamily };
  const hit = C.model.templates.program_names.find(p => Object.entries(p.when).every(([k, vals]) => vals.includes(ctx[k])));
  return hit ? hit.id : null;
}

/**
 * v0.5 / V2 (COACH-R4 R4-LIB-01): the optional add-ons this plan offers. Never part of the template: the person chooses and adds
 * them (engine/edit.mjs add_exercise). Each carries its own dose - carries and sled work by distance or time (R4-LIB-02), the
 * others from the library's own range - and the search link with the name to copy (R4-LIB-05).
 */
function buildAddons(C, weeks) {
  const { deps, model, derived, shape } = C;
  const R = model.rules;
  const A = R.selection && R.selection.addons;
  if (!A || !A.offer || typeof deps.offeredAddons !== 'function') return [];
  const held = new Set(weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.flatMap(it => [it.exercise_id, ...((it.wod && it.wod.stations) || [])])))).filter(Boolean));
  const list = deps.offeredAddons({ derived, shape, layout: C.layouts[0] || null, model, seed: C.seed, exclude_ids: [...held].sort() });
  const out = [];
  for (const a of list) {
    if (!model.hasEx(a.exercise_id)) continue;
    const ex = model.ex(a.exercise_id);
    const carry = isCarry(ex, R);
    const dose = carry ? { sets: R.conditioning.carry.trips.slice(), reps: carryReps(ex, R) } : hintDose(ex, A.offer);
    if (!dose) continue;
    out.push({
      exercise_id: ex.id, name_key: ex.name_key, kind: a.kind, code: a.code, bucket: a.bucket,
      block: carry ? 'conditioning' : model.bucket(a.bucket).block,
      sets: dose.sets, reps: dose.reps,
      counts_as_muscle_sets: !carry && !ex.is_athletic && Object.keys(creditsFor(model, ex, a.bucket)).length > 0 && !(a.kind === 'joint_care' && R.prehab && R.prehab.credits === 'none'),
      video: videoOf(model, ex),
      why: [why('why.addon_offered', 'R4-LIB-01')]
    });
  }
  return out;
}

/** the dose of an offered add-on from the library's own range ('12-20 each arm', '20-45 s', '3-5 x 3-5 jumps'), or null */
function hintDose(ex, O) {
  const t = String((ex.rep_hint && ex.rep_hint.text) || '');
  const unit = ex.rep_hint && ex.rep_hint.unit;
  let sets = (O.sets || [2, 3]).slice(), lo, hi;
  const m2 = /(\d+)\s*-\s*(\d+)\s*(?:x|bouts of|holds of|trips of)\s*(\d+)\s*-\s*(\d+)/.exec(t);
  if (m2) { sets = [Number(m2[1]), Number(m2[2])]; lo = Number(m2[3]); hi = Number(m2[4]); }
  else { const m1 = /(\d+)\s*-\s*(\d+)/.exec(t); if (!m1) return null; lo = Number(m1[1]); hi = Number(m1[2]); }
  if (!(lo >= 1 && hi >= lo)) return null;
  if (unit === 'seconds') return { sets, reps: { type: 'seconds', min: lo, max: hi } };
  const sided = ['unilateral', 'alternating'].includes(ex.laterality) || /each (arm|leg|side)/.test(t);
  return { sets, reps: { type: sided ? 'per_side' : 'range', min: lo, max: hi } };
}

function buildMeta(C, v, weeks = []) {
  const { model, derived: d, shape, selections, volume } = C;
  const D2 = d.D2_profile || {}, D3 = d.D3_client_level || {}, D4 = d.D4_season_phase || {}, D5 = d.D5_plan_shape || {};
  const D6 = d.D6_week_layout || {}, D7 = d.D7_constraint_band || {}, D8 = d.D8_kit || {}, T = d.D9_start_sets || {};
  const D11 = d.D11_athletic_budget || {}, D13 = d.D13_tests || {}, D14 = d.D14_aerobic_sessions || {};
  const pid = programId(C);
  const buyList = uniqueSorted([...(D8.buy_list || []), ...selections.flatMap(s => s.buy_list || [])]);
  const warnings = [];
  const pushW = (w) => { if (w && w.key) warnings.push(w.args && Object.keys(w.args).length ? { ...w, args: { ...w.args } } : { ...w }); };
  (d.warnings || []).forEach(pushW);
  (volume.warnings || []).forEach(pushW);
  // v0.4 stage B2: a sport key the stations hold well below its weekly target (the athletic stairway still climbs; E-29)
  ((C.athleticPlan && C.athleticPlan.warnings) || []).forEach(pushW);
  for (const L of C.layouts) (L.warnings || []).forEach(pushW);
  for (const s of selections) (s.warnings || []).forEach(pushW);
  if (buyList.length && !warnings.some(w => w.key === 'warning.v7_no_equipment')) pushW({ code: 'V7', key: 'warning.v7_no_equipment', args: { items: buyList.join(', ') } });
  // v0.5 fix round 2 (sample 05 major; R4-SES-04 'what a template cannot hold is named in the plan'): a plan whose vertical-pull
  // slot is filled by a row says up front that this kit has no vertical pull
  if (model.has('en', 'warning.no_vertical_pull') && selections.some(sel => Object.values((sel && sel.fills) || {}).some(f => f && (f.flags || []).includes('no_vertical_pull')))) pushW({ code: 'no_vertical_pull', key: 'warning.no_vertical_pull' });
  // v0.5 fix round 2 (sample 08 major: 'the plan never says this at the top'; VOL-03, R3-ATH-02): the pain the client entered and
  // what the plan did about it, once, up front
  {
    const PX2 = model.rules.volume.pain.x2;
    if (PX2 && PX2.said_up_front && model.has('en', 'warning.pain_plan')) {
      const X = model.rules.muscles;
      for (const pn of (d.pain || []).filter(x => x && x.area && !(model.rules.volume.pain.refer_if_severity || []).includes(x.severity))) {
        const def = model.rules.volume.pain.areas[pn.area];
        const groups = [...new Set(((def && def.muscles) || []).map(m => { try { return model.groupOf(m); } catch { return null; } }).filter(Boolean))].filter(g => g !== 'core');
        const trig = (pn.worse_with || []).find(t => model.has('en', 'pain.trigger.' + t));
        const area = 'pain.area.' + (model.has('en', 'pain.area.' + pn.area) ? pn.area : 'other');
        if (groups.length) pushW(trig ? { code: 'pain_plan', key: 'warning.pain_plan', args: { area, trigger: 'pain.trigger.' + trig, groups: groups.map(g => 'group.' + g) } } : { code: 'pain_plan', key: 'warning.pain_plan_plain', args: { area, groups: groups.map(g => 'group.' + g) } });
      }
      void X;
    }
  }
  // v0.5 fix round 2 (samples 02 / 03; UNI-02 / UNI-03 against R4-SES-05 - 'the plan never says the dial was missed'): one line when
  // the two-leg share of the lower-body lifting sets ends more than 10 points above the sport's guide
  {
    const D10 = d.D10_bilateral_share;
    const tgt = D10 && D10.lower && Array.isArray(D10.lower.by_exercise_block) ? D10.lower.by_exercise_block[0] : null;
    if (typeof tgt === 'number' && model.has('en', 'warning.laterality_capped') && D2.competitive === 'competitive') {
      let bi = 0, uni = 0;
      for (const w of weeks) { if (w.block_type !== 'stairway') continue; for (const dd of w.days || []) for (const b of dd.blocks || []) for (const it of b.items || []) {
        const e = it.exercise_id && model.hasEx(it.exercise_id) ? model.ex(it.exercise_id) : null;
        if (!e || !it.sets || it.role === 'test') continue;
        if (['BKD', 'BHD'].includes(e.credit_class)) bi += it.sets; else if (['UKD', 'UHD'].includes(e.credit_class)) uni += it.sets;
      } }
      const share = bi + uni > 0 ? bi / (bi + uni) : null;
      if (share !== null && share - tgt > 0.10 + EPS) pushW({ code: 'laterality_capped', key: 'warning.laterality_capped', args: { share: roundHalfUp(share * 100), target: roundHalfUp(tgt * 100) } });
    }
  }
  // v0.5: no long-day / time warnings exist (CT-01). The stairway of each block is the one the volume engine planned and placed:
  // per trained group the whole-set schedule from its start to its planned final sets, what the template holds, the bonus
  // exercises, the week the top number arrives (R4-PRG-01) and the weeks that add more than about 15 % (R4-PRG-02).
  const lineOrder = (model.rules.muscles.lines && model.rules.muscles.lines.order) || model.rules.muscles.order;
  const groupOrder = model.rules.muscles.groups.order.filter(g => g !== 'core');
  const blockT = (tbn) => (volume.block_targets || []).find(b => b.training_block === tbn) || null;
  const stairway = shape.training_blocks.filter(tb => tb.type === 'stairway').map(tb => {
    const b = blockT(tb.n);
    const wkN = shape.weeks.filter(w => w.training_block === tb.n).map(w => w.n);
    const acc = wkN.flatMap(n => ((volume.weeks[n - 1] || {}).acceleration || []).map(a => ({ week: n, ...a })));
    const lineLambda = {};
    if (b) for (const g of b.groups || []) if (b.carrier && b.carrier[g]) lineLambda[b.carrier[g]] = b.lambda[g];
    return { training_block: tb.n, N: tb.stair_N, lambda: orderedMap(lineLambda, lineOrder, x => roundTo(x, 4)),
      lowered: [], dropped_groups: [],
      start: b ? orderedMap(b.start, lineOrder, x => x) : null, cap: b ? orderedMap(b.cap, lineOrder, x => x) : null,
      groups: b ? (b.groups || []).slice() : [], credit_only_groups: b ? (b.credit_only_groups || []).slice() : [],
      // v0.6 G-202 (CH5-02): the credit-only groups that still hold an exercise of their own (the arm slot), held at its sets
      held_groups: b ? (b.held_groups || []).slice() : [],
      group_start: b ? orderedMap(b.group_start || {}, groupOrder, x => x) : {}, group_top: b ? orderedMap(b.group_top || {}, groupOrder, x => x) : {},
      planned_top: b ? orderedMap(b.planned_top || {}, groupOrder, x => x) : {},
      schedule: b ? orderedMap(b.schedule || {}, groupOrder, x => x.slice()) : {},
      group_lambda: b ? orderedMap(b.lambda || {}, groupOrder, x => roundTo(x, 4)) : {},
      arrival_week: b ? orderedMap(b.arrival_week || {}, groupOrder, x => x) : {},
      realized_arrival_week: b ? orderedMap(b.realized_arrival_week || {}, groupOrder, x => x) : {}, realized_top: b ? orderedMap(b.realized_top || {}, groupOrder, x => x) : {},
      capped: b ? (b.capped || []).map(c => ({ ...c })) : [], below_floor: b ? (b.below_floor || []).slice() : [],
      bonus: b ? (b.bonus || []).map(x => ({ ...x })) : [], focus_closed: b ? (b.focus_closed || []).map(x => ({ ...x })) : [], acceleration: acc, circuit: !!(b && b.circuit),
      // v0.6 G-110: a timed circuit's groups that the uniform rounds take above their top number (said up front)
      over_top: b ? (b.over_top || []).map(x => ({ ...x })) : [],
      // v0.5 fix round 1: where the floor is read (the training days), the groups that hold it only with the optional day, the groups
      // that start under their level's start so they still climb, and the pull : push balance the block keeps (null: none)
      floor_counted_on: b ? (b.floor_counted_on || 'all_days') : 'all_days', floor_on_optional: b ? (b.floor_on_optional || []).slice() : [],
      lowered_start: b ? (b.lowered_start || []).map(c => ({ ...c })) : [], balanced: b && b.balanced ? { ...b.balanced } : null,
      push_pull: b && b.push_pull ? { ...b.push_pull } : null };
  });
  const firstStair = shape.training_blocks.find(tb => tb.type === 'stairway');
  const fb = firstStair ? blockT(firstStair.n) : null;
  const tests = testsMeta(d, shape);
  const metaWhy = dedupeWhy([...(d.why || []), ...C.layouts.flatMap(L => L.why || []),
    ...model.rules.muscles.order.flatMap(m => ((T.why || {})[m] || []).map(w => ({ key: w.key, ref: w.ref, args: { ...(w.args || {}), muscle: (w.args && w.args.muscle) || m } })))]);
  return {
    program_id: pid, program_name_key: pid ? 'program.' + pid + '.name' : 'ui.plan.title',
    goal: d.goal, family: d.D1_family, format: d.format,
    profile: { id: D2.id ?? null, variant: D2.variant ?? null, sport_id: D2.sport_id ?? null, position: D2.position ?? null, activity_ids: (D2.activity_ids || []).slice(), overlays: (D2.overlays || []).slice(), competitive: D2.competitive ?? null, season_type: D2.season_type ?? null, name_key: D2.name_key ?? null },
    level: { client: D3.level ?? null, exercise_ladder: D3.exercise_ladder ?? null, reason_keys: (D3.reason_keys || []).map(r => ({ ...r })) },
    season: { phase: D4.phase ?? null, weeks_to_season: D4.weeks_to_season ?? null, season_date: D4.season_date ?? null, practice_days: D4.practice_days ?? null, game_days: (D4.game_days || []).slice() },
    plan_mode: D5.mode ?? shape.mode, skeleton: D5.skeleton ?? shape.skeleton, weeks: shape.weeks_total, start_date: d.start_date,
    days_per_week: d.days_per_week, weekdays: (d.weekdays || []).slice(), play_days: (d.play_days || []).slice(),
    // v0.5 (R4-SES-02): the session is sized by exercise count; (R4-SES-03) the 2-day rule when it applies
    session_size: D6.session_size ? { type: D6.session_size.type, range: D6.session_size.range.slice(), default: D6.session_size.default } : null,
    two_day: T.two_day ? { weekly_sets: model.rules.volume.two_day.weekly_sets.slice(), suggest_days: model.rules.volume.two_day.suggest_days } : null,
    time: 'estimate_only',
    template: { id: D6.template_id ?? null, variant: D6.variant ?? null, pairing: D6.pairing ?? null },
    kit: { profile: D8.profile ?? null, tokens: (D8.tokens || []).slice(), machines: (D8.machines || []).slice(), medball_max_lb: D8.medball_max_lb ?? null, buy_list: buyList },
    constraint_band: { client_family: D7.client_family ?? null, main: D7.main ?? null, iso: D7.iso ?? null },
    targets: { modifier_id: T.modifier_id ?? null, start: fb ? { ...T.start, ...fb.start } : (T.start || {}), cap: fb ? { ...T.cap, ...fb.cap } : (T.cap || {}), level_start: T.start || {}, level_cap: T.cap || {}, fill: T.fill || {}, lines: (T.lines || []).slice(), priority: (T.priority || []).slice(), focus_add: T.focus_add ?? 0, pain_muscles: (T.pain_muscles || []).slice(), floored: (T.floored || []).slice(), floor_groups: (T.floor_groups || []).slice(), credit_only: (T.credit_only || []).slice(), calves_per_leg_day: T.calves_per_leg_day ?? null, calves_floor: T.calves_floor ?? null, core_block: T.core_block ?? null },
    stairway,
    share_targets: d.D10_bilateral_share ?? null,
    // (fix round 2 / F2, E-174: a general-population circuit that keeps its throws and swings plans athletic work too - `mode` says which)
    athletic: { enabled: !!D11.enabled || circuitBallistic(d, model), mode: D11.enabled ? 'sport' : (circuitBallistic(d, model) ? 'circuit_ballistic' : 'off'), older_mode: D11.older_mode ?? null, plyo_share: D11.plyo_share ?? null, ground_contact_class: D11.ground_contact_class ?? null, contacts_session_max: D11.contacts_session_max ?? null, olympic_exposures_wk: D11.olympic_exposures_wk ?? null, game_heavy: !!D11.game_heavy, heavy_play_week: !!D11.heavy_play_week },
    aerobic: { per_week: D14.per_week ?? 0, base: D14.base ?? 0, adjust: D14.adjust ?? 0, replaced_by_activity: D14.replaced_by_activity ?? 0, walks: !!D14.walks, sport_is_aerobic: !!D14.sport_is_aerobic },
    tests,
    // v0.5 / V2 (COACH-R4 R4-LIB-01): the optional add-ons this plan offers - the person chooses; never part of the template
    addons: buildAddons(C, weeks),
    health: { ...(d.health || { role: v.intake.role || 'self', health_route: v.intake.health_route ?? null, refer: false, reasons: [], bypass: false }) },
    older_opt_in: d.age >= model.rules.population.older.from_age && !!(d.prefs && d.prefs.older_athletic_opt_in),
    after_plan: shape.after_plan ?? null,
    instruction_keys: INSTRUCTION_KEYS.slice(),
    locked_rule_keys: model.rules.locked.map(l => l.key),
    input_audit: inputAudit(v.intake),
    warnings: dedupeIssues(warnings),
    // v0.4 fix round 1 (RECHECK 08 minor): the round-3 answers are approved (coach_answers_round3.md) - none is pending any more
    r3_pending: uniqueSorted([...(d.r3_pending || []), ...C.layouts.flatMap(L => L.r3_pending || [])]).filter(id => !(model.rules.r3_approved || []).includes(id)),
    derived: d,
    why: metaWhy
  };
}

function dedupeIssues(list) {
  const seen = new Set();
  return list.filter(w => { const k = canonicalJSON(w); if (seen.has(k)) return false; seen.add(k); return true; });
}

function testsMeta(d, shape) {
  const D13 = d.D13_tests || {};
  const items = (D13.items || []).filter(x => x !== 'none');
  const baseline = shape.weeks.find(w => w.test && w.test.type === 'baseline');
  const ends = shape.weeks.filter(w => w.test && w.test.type === 'end');
  // (fix round 2 / F1, E-147: the retired reminder schedule - block start, 7 days and 1 day before - is gone; run() adds test_days /
  // test_dates from the built weeks)
  return {
    items, baseline_week: baseline ? baseline.n : (items.length ? D13.baseline_week ?? null : null),
    end_weeks: ends.length ? ends.map(w => w.n) : (D13.end_weeks || []).slice(), from_zero: !!D13.from_zero
  };
}

/** the calendar days that hold a test item (week 1 starts on the start date): [{week, weekday, date, tests}] (E-147) */
function testDaysOf(weeks, start) {
  const out = [];
  if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return out;
  const s0 = WEEKDAYS.indexOf(weekdayOf(start));
  for (const w of weeks) for (const d of w.days || []) {
    const tests = uniqueSorted((d.blocks || []).flatMap(b => b.items || []).filter(it => it.test && it.test.test).map(it => it.test.test));
    if (!tests.length) continue;
    const off = (WEEKDAYS.indexOf(d.weekday) - s0 + 7) % 7;
    out.push({ week: w.n, weekday: d.weekday, date: addDays(start, (w.n - 1) * 7 + off), tests });
  }
  return out;
}

function buildSummary(plan, C) {
  const order = C.model.rules.muscles.order;
  const W = plan.weeks;
  const rises = W.map(w => w.rise_vs_prev).filter(x => typeof x === 'number');
  const steps = W.flatMap(w => Object.values(w.step_by_muscle || {})).filter(x => typeof x === 'number');
  const myoValue = C.model.rules.credit.myo_set_value;
  const sets = {}, tg = {}, byLine = {}, byGroup = {};
  const lineOrder = (C.model.rules.muscles.lines && C.model.rules.muscles.lines.order) || order;
  for (const m of order) if (W.some(w => typeof (w.weekly_sets_by_muscle || {})[m] === 'number')) sets[m] = W.map(w => ((w.weekly_sets_by_muscle || {})[m] ?? 0));
  for (const l of lineOrder) {
    if (W.some(w => typeof (w.target_by_muscle || {})[l] === 'number')) tg[l] = W.map(w => ((w.target_by_muscle || {})[l] ?? null));
    if (W.some(w => typeof (w.weekly_sets_by_line || {})[l] === 'number')) byLine[l] = W.map(w => ((w.weekly_sets_by_line || {})[l] ?? 0));
  }
  for (const g of C.model.rules.muscles.groups.order) if (W.some(w => typeof (w.weekly_sets_by_group || {})[g] === 'number')) byGroup[g] = W.map(w => ((w.weekly_sets_by_group || {})[g] ?? 0));
  const shortfalls = dedupeIssues(C.volume.weeks.flatMap(w => (w.shortfalls || []).map(s => ({ ...s, week: s.week ?? w.n }))));
  const tgGroup = {};
  for (const g of C.model.rules.muscles.groups.order) if (W.some(w => typeof (w.target_by_group || {})[g] === 'number')) tgGroup[g] = W.map(w => ((w.target_by_group || {})[g] ?? null));
  return {
    total_resistance_sets_by_week: W.map(w => w.total_resistance_sets),
    max_weekly_rise: rises.length ? roundTo(Math.max(...rises), 4) : 0,
    planned_steps_max: steps.length ? roundTo(Math.max(...steps), 4) : 0,
    stair_levels: W.map(w => w.stair_level),
    sets_by_muscle_by_week: sets,
    sets_by_line_by_week: byLine,
    sets_by_group_by_week: byGroup,
    target_by_muscle_by_week: tg,
    target_by_group_by_week: tgGroup,
    acceleration: W.flatMap(w => (w.acceleration || []).map(a => ({ week: w.n, ...a }))),
    // D-13: a MYO set counts as `myo_set_value` sets; the extra (value - 1) per MYO item is reported here and never added to sets
    myo_equivalent_sets_by_week: W.map(w => w.days.reduce((a, d) => a + d.blocks.reduce((b, bl) => b + bl.items.filter(it => it.effort && it.effort.last_set === 'myo').length * (myoValue - 1), 0), 0)),
    shortfalls
  };
}

/** undefined -> null, NaN / Infinity -> null, frozen inputs copied (CONTRACTS §1.3) */
function sanitize(o) {
  if (o === undefined) return null;
  if (typeof o === 'number') return Number.isFinite(o) ? o : null;
  if (o === null || typeof o !== 'object') return o;
  if (Array.isArray(o)) return o.map(sanitize);
  const out = {};
  for (const k of Object.keys(o)) out[k] = sanitize(o[k]);
  return out;
}
