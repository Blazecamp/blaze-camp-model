// engine/generate.mjs - the orchestrator (engine/CONTRACTS.md §4.12, §5). Owner: B4 (integrated by the integrator).
// generateWith(deps, intake, model, opts) runs the fixed pipeline against injected module functions (tests use contract-
// shaped stubs); generate() = generateWith(REAL, ...). Deterministic: same intake + model -> byte-identical plan JSON.
import { ENGINE_VERSION } from './version.mjs';
import { EngineError, EPS, WEEKDAYS, canonicalJSON, hash53, makeSeed, why, round2, roundHalfUp, roundTo, uniqueSorted, addDays, forbiddenKeys } from './util.mjs';
import { validatePlan } from './validate.mjs';
import * as intakeMod from './intake.mjs';
import * as shapeMod from './shape.mjs';
import * as volumeMod from './volume.mjs';
import * as weekMod from './week.mjs';
import * as selectMod from './select.mjs';
import * as doseMod from './dose.mjs';
import { budgetKeyOf } from './budget.mjs';

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

/** @param {object} intake @param {import('./util.mjs').Model} model @param {{checkins?:object[]}} [opts] @returns {import('./util.mjs').Plan} */
export function generate(intake, model, opts = {}) {
  const st = realModulesStatus();
  if (!st.ready) throw new EngineError('generate.modules_missing', 'engine modules not built yet: ' + st.missing_exports.join(', '), st);
  return generateWith(REAL, intake, model, opts);
}

/**
 * Phase 0 adaptation per spec `adaptation` (checkin/2): re-run generate with check-ins applied in order.
 * adapt(plan, [], intake, model) is byte-identical to generate(intake, model) (H22).
 * @param {import('./util.mjs').Plan|null} plan @param {object[]} checkins @param {object} intake @param {import('./util.mjs').Model} model
 * @returns {import('./util.mjs').Plan}
 */
export function adapt(plan, checkins, intake, model) {
  const st = realModulesStatus();
  if (!st.ready) throw new EngineError('generate.modules_missing', 'engine modules not built yet: ' + st.missing_exports.join(', '), st);
  return adaptWith(REAL, plan, checkins, intake, model);
}

/**
 * @param {Object<string,Function>} deps  the B2 / B3 exports (REQUIRED_DEPS)
 * @param {object} intake @param {import('./util.mjs').Model} model @param {{checkins?:object[]}} [opts]
 * @returns {import('./util.mjs').Plan}
 */
export function generateWith(deps, intake, model, opts = {}) {
  for (const k of REQUIRED_DEPS) if (typeof deps[k] !== 'function') throw new EngineError('generate.bad_deps', 'missing dependency ' + k);
  if (opts.checkins && opts.checkins.length) return adaptWith(deps, null, opts.checkins, intake, model);
  return run(deps, intake, model, opts._adapt || null);
}

/**
 * adapt() against injected deps (tests).
 * @param {Object<string,Function>} deps @param {import('./util.mjs').Plan|null} plan @param {object[]} checkins @param {object} intake
 * @param {import('./util.mjs').Model} model @returns {import('./util.mjs').Plan}
 */
export function adaptWith(deps, plan, checkins, intake, model) {
  if (!checkins || !checkins.length) return run(deps, intake, model, null);
  const base = run(deps, intake, model, null);
  if (base.status !== 'ok' || base.meta.derived.output_mode === 'plan_only') return base;   // R2-VOL-03: plan-only ignores check-ins
  const rows = checkins.slice().sort((a, b) => a.week - b.week).map(ci => ({ week: ci.week, row: checkinRow(ci, model), ci }));
  const steps = model.rules.stairway.checkin.rows;
  const stepOf = (row) => (steps.find(r => r.id === row) || {}).step;
  // Phase 0: every "wait" row (repeat_week, hold, muscle_zero) makes the volume stairway wait one week; planned_plus is read
  // as planned (needs a volume hook - CONTRACT_REQUESTS); the calendar labels (stair level, phase, RIR) stay on the calendar.
  const holds = uniqueSorted(rows.filter(r => ['repeat_week', 'hold', 'muscle_zero'].includes(stepOf(r.row))).map(r => String(r.week + 1))).map(Number);
  const offers = offersFor(rows, holds, model);
  return run(deps, intake, model, { holds, offers });
}

/** which check-in row applies (rules.stairway.checkin.rows in `order`) @param {object} ci checkin/2 @returns {string} row id */
export function checkinRow(ci, model) {
  const C = model.rules.stairway.checkin;
  const done = (ci.sessions || []).filter(s => s && s.done);
  const efforts = done.map(s => s.effort).filter(e => typeof e === 'number').sort((a, b) => a - b);
  const median = efforts.length ? (efforts.length % 2 ? efforts[(efforts.length - 1) / 2] : (efforts[efforts.length / 2 - 1] + efforts[efforts.length / 2]) / 2) : null;
  const test = {
    sessions_done_below_half: () => (ci.sessions || []).length > 0 && done.length < (ci.sessions || []).length / 2,
    any_effort_10: () => efforts.includes(10),
    felt_pain: () => (ci.felt || []).some(f => f && f.value === 'pain') || (ci.pain_now || []).some(p => p && p.trend === 'worse'),
    median_effort_9: () => median !== null && median >= 9,
    median_effort_lte_6: () => median !== null && median <= 6,
    median_effort_7_8: () => median !== null && median > 6 && median < 9
  };
  for (const id of C.order) {
    const row = C.rows.find(r => r.id === id);
    if (row && test[row.when] && test[row.when]()) return id;
  }
  return 'on_target';
}

function offersFor(rows, holds, model) {
  const out = [];
  const when = model.rules.stairway.checkin.block_cannot_be_finished_offer_when;
  const byWeek = new Map(rows.map(r => [r.week, r]));
  for (const r of rows) {
    const prev = byWeek.get(r.week - 1);
    const pains = (r.ci.felt || []).filter(f => f && f.value === 'pain').length;
    const hit = (id, cond) => when.includes(id) && cond;
    if (hit('hold_two_weeks_in_a_row', holds.includes(r.week + 1) && holds.includes(r.week))
      || hit('sessions_below_half_two_weeks', prev && prev.row === 'repeat' && r.row === 'repeat')
      || hit('effort_9_10_two_weeks', prev && ['hard', 'ten'].includes(prev.row) && ['hard', 'ten'].includes(r.row))
      || hit('pain_2plus_exercises_in_a_week', pains >= 2)
      || hit('pain_two_weeks_or_worse', (prev && prev.row === 'pain' && r.row === 'pain') || (r.ci.pain_now || []).some(p => p && p.trend === 'worse'))
      || hit('user_taps_cannot_finish', r.ci.block_action === 'stop_block_start_maintenance')) out.push({ key: 'block.cannot_finish', week: r.week });
  }
  return out;
}

// ------------------------------------------------------------------------------------------------------------- pipeline

const NO_SET_KINDS = ['warmup', 'aerobic', 'skill'];
const RES_KINDS = ['resistance', 'isolation', 'focus'];
const INSTRUCTION_KEYS = ['instruction.title', 'instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5'];
const ADAPT_WHY = why('why.r3_pending', 'R3-VOL-02', { id: 'R3-VOL-02' });

function run(deps, intake, model, adaptCtx) {
  const v = deps.validateIntake(intake, model);
  if (!v || !v.ok) return invalidPlan(intake, v, model);
  const s = deps.safetyScreen(v.intake);
  if (s && s.refer) return referPlan(v.intake, s, model);
  const seed = makeSeed(intakeForHash(v.intake), model.version);
  const derived = deps.deriveValues(v.intake, model);
  const shape = deps.buildShape(derived, model);
  const layouts = shape.training_blocks.map(tb => deps.buildWeekLayout(derived, shape, tb, model));
  const targets = derived.D9_start_sets;
  const selections = [];
  for (const eb of shape.exercise_blocks) {
    selections.push(deps.selectBlock({ derived, shape, layout: layouts[eb.training_block - 1], targets, exerciseBlock: eb.n, prev: selections.length ? selections[selections.length - 1] : null, model, seed }));
  }
  const selFor = (ebN) => selections[ebN - 1] || null;
  const ctxFor = (n) => {
    const ws = shape.weeks[n - 1];
    return { derived, shape, layout: layouts[ws.training_block - 1], targets, exerciseBlock: ws.exercise_block, prev: selFor(ws.exercise_block - 1), model, seed };
  };
  // Slots the volume engine adds (bonus / Focus) are filled one at a time. fillSlot gets the exercise block's Selection
  // (template picks: second-exposure and spine state, CONTRACTS §4.7) and `day_used`, the exercises already on that weekday
  // (template picks + added slots filled earlier in this exercise block), so a day never holds the same exercise twice.
  const fillCache = new Map();
  const addedByBlock = new Map();   // exercise block -> Map(slot_id -> exercise_id) of filled added slots
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
    const weekUsed = new Set();
    for (const [, ex] of added) if (ex) weekUsed.add(ex);
    const fill = deps.fillSlot(slot, { ...ctx, selection: sel, day_used: [...used].sort(), week_used: [...weekUsed].sort(), ...(stage ? { stage_override: stage } : {}) });
    if (slot.origin && slot.origin !== 'template' && !probe && !stage) added.set(slot.slot_id, fill && fill.exercise_id ? fill.exercise_id : null);
    fillCache.set(key, fill);
    return fill;
  };
  let volume = deps.planWeeklySets({ derived, shape, layouts, selections, model, fillSlot: fillFor, estimateMinutes: deps.estimateMinutes });
  if (adaptCtx) volume = applyHolds(volume, shape, adaptCtx.holds);
  const athletic = deps.athleticBudget(derived, shape, model);
  const C = { deps, model, derived, shape, layouts, selections, selFor, fillFor, volume, athletic, targets, adapted: !!adaptCtx };
  const weeks = shape.weeks.map(ws => assembleWeek(C, ws.n));
  const plan = {
    schema: 'plan/2',
    status: 'ok',
    model_version: model.version, engine_version: ENGINE_VERSION, contracts_version: model.manifest.contracts_version,
    seed, intake_hash: 'c53:' + hash53(canonicalJSON(intakeForHash(v.intake))),
    lang: derived.lang, units: derived.units,
    release_stamp: releaseStamp(v.intake),
    refer: null,
    errors: [],
    offers: adaptCtx ? [...(volume.offers || []), ...adaptCtx.offers] : (volume.offers || []).map(o => ({ ...o, args: { ...(o.args || {}) } })),
    meta: buildMeta(C, v),
    shape: {
      mode: shape.mode, skeleton: shape.skeleton, weeks_total: shape.weeks_total, open_ended: !!shape.open_ended,
      training_blocks: shape.training_blocks, exercise_blocks: shape.exercise_blocks,
      level_by_week: shape.weeks.map(w => (typeof w.stair_level === 'number' ? w.stair_level : null))
    },
    weeks,
    summary: null,
    validation: null
  };
  plan.summary = buildSummary(plan, C);
  const clean = sanitize(plan);
  clean.validation = validatePlan(clean, model);
  return clean;
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
  return { version: r.version ?? null, lang: r.lang ?? intake.lang ?? null, role: intake.role ?? 'self', guardian: r.guardian ?? null };
}

function shell(model, status, intake) {
  const okIntake = intake && typeof intake === 'object';
  return {
    schema: 'plan/2', status,
    model_version: model.version, engine_version: ENGINE_VERSION, contracts_version: model.manifest.contracts_version,
    seed: null, intake_hash: okIntake ? 'c53:' + hash53(canonicalJSON(intakeForHash(intake))) : null,
    lang: okIntake && intake.lang === 'es' ? 'es' : 'en', units: okIntake && intake.units === 'kg' ? 'kg' : 'lb',
    release_stamp: null, refer: null, errors: [], offers: [], meta: {}, shape: null, weeks: [], summary: null, validation: null
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

// ------------------------------------------------------------------------------------------------------------- adapt holds

function applyHolds(volume, shape, holds) {
  if (!holds.length) return volume;
  const weeks = volume.weeks.slice();
  for (const tb of shape.training_blocks) {
    if (tb.type !== 'stairway') continue;
    const [a, b] = tb.weeks;
    let shift = 0;
    for (let w = a + 1; w <= b; w++) {
      const hold = holds.includes(w);
      if (hold) shift++;
      if (!shift) continue;
      const src = volume.weeks[w - 1 - shift];
      const prev = weeks[w - 2];
      const vw = { ...src, n: w };
      if (hold) {
        vw.step_by_muscle = Object.fromEntries(Object.keys(src.step_by_muscle || {}).map(m => [m, 0]));
        vw.changes = [{ key: 'changes.hold' }];
      }
      vw.rise_vs_prev = prev && prev.total_resistance_sets ? roundTo((vw.total_resistance_sets - prev.total_resistance_sets) / prev.total_resistance_sets, 4) : null;
      vw.why = [...(src.why || []).filter(x => x.key !== 'why.no_checkin_planned'), ADAPT_WHY];
      weeks[w - 1] = vw;
    }
  }
  return { ...volume, weeks };
}

// ------------------------------------------------------------------------------------------------------------- week assembly

function withAddedSlots(base, added, model) {
  if (!added || !added.length) return base;
  const order = model.rules.ordering.block_order;
  const days = base.days.map(d => ({ ...d, blocks: d.blocks.map(b => ({ ...b, slots: b.slots.slice() })) }));
  for (const slot of added) {
    const wd = String(slot.slot_id).split('.')[0];
    const day = days.find(d => d.weekday === wd);
    if (!day) continue;
    if (day.blocks.some(b => b.slots.some(s => s.slot_id === slot.slot_id))) continue;
    let blk = day.blocks.find(b => b.kind === slot.block);
    if (!blk) {
      blk = { kind: slot.block, movable: false, circuit: null, slots: [] };
      const at = day.blocks.findIndex(b => order.indexOf(b.kind) > order.indexOf(slot.block));
      if (at < 0) day.blocks.push(blk); else day.blocks.splice(at, 0, blk);
    }
    blk.slots.push(slot);
  }
  return { ...base, days };
}

function bucketDef(model, b) { try { return model.bucket(b); } catch { return null; } }

const SMALL_RC_BUCKETS = ['ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF'];
const ATHLETIC_KEY_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW', 'AP_COD', 'AP_SPRINT', 'AP_TRIPLE_EXT'];

function assembleWeek(C, n) {
  const { deps, model, derived, shape, volume, athletic, targets } = C;
  const R = model.rules;
  const ws = shape.weeks[n - 1];
  const vw = volume.weeks[n - 1];
  const base = C.layouts[ws.training_block - 1];
  const L = deps.layoutForWeek(withAddedSlots(base, vw.added_slots || [], model), ws, derived, model);
  const sel = C.selFor(ws.exercise_block) || { fills: {} };
  relocateStrengthTests(L, sel, model);
  const sets = vw.sets_by_slot || {};
  const fills = {};
  // the Receive-Create stage of the exercise block's first week: a plyo station is re-picked when the stage moves inside the
  // block (a stick-the-landing drill is RC1 only; RC3 takes a repeated-contact drill) - v1.2, review 01 / 02 / 03 / 08
  const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
  const ebFirst = eb ? shape.weeks[eb.weeks[0] - 1] : ws;
  const stageMoved = !!(ws.plyo_stage && ebFirst && ebFirst.plyo_stage && ws.plyo_stage !== ebFirst.plyo_stage);
  // pass 1: which slots become items (exercise + sets), every day
  const perDay = [];
  for (const day of L.days) {
    const cands = [];
    for (const blk of day.blocks || []) for (const slot of blk.slots || []) {
      const bd = bucketDef(model, slot.bucket) || {};
      let fill = sel.fills[slot.slot_id] || null;
      if (stageMoved && ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(slot.bucket) && slot.origin === 'template') {
        const f2 = C.fillFor(slot, n, { stage: ws.plyo_stage });
        if (f2 && f2.exercise_id) fill = f2;
      }
      if (!fill && slot.origin && slot.origin !== 'template' && slot.origin !== 'test' && !slot.text_key) fill = C.fillFor(slot, n);
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
      cands.push({ blk, slot, bd, fill, ex, sets: s, isRes: isRes && !!ex });
    }
    perDay.push({ day, cands });
  }
  // v1.2 (V27, review 03 / 08 majors): a week whose profile target for a key is 0 (in-season, heavy play, a sport without
  // throws) drops that key's stations; a small target trims stations (sets to 1, then the latest station) until the
  // per-set minimum dose fits target x (1 + tolerance) + one set
  const RCx = model.rules.athletic.reconcile;
  const wkT = athletic[n - 1] && athletic[n - 1].targets;
  if (RCx && RCx.enabled && wkT) {
    const feeds = {};
    perDay.forEach((pd, di) => pd.cands.forEach((x) => {
      if (!x.ex || !ATHLETIC_KEY_BUCKETS.includes(x.slot.bucket) || typeof x.sets !== 'number' || x.slot.bucket === 'AP_TRIPLE_EXT') return;
      const key = budgetKeyOf(x.slot.bucket, x.ex.athletic && x.ex.athletic.quality, null);
      if (key && typeof wkT[key] === 'number') (feeds[key] = feeds[key] || []).push({ x, di });
    }));
    for (const [key, list] of Object.entries(feeds)) {
      const t = wkT[key], lo = (RCx.per_set_min || {})[key] || 1, slack = (RCx.per_set_max || {})[key] || 0;
      const limit = t * (1 + (RCx.tolerance || 0)) + slack;
      const dose = () => list.reduce((a, e) => a + (e.x.sets || 0) * lo, 0);
      const drop = (e) => { const c = perDay[e.di].cands; c.splice(c.indexOf(e.x), 1); list.splice(list.indexOf(e), 1); };
      if (t <= 0) { for (const e of list.slice()) drop(e); continue; }
      for (const e of list.slice().reverse()) { if (dose() <= limit + EPS) break; if (e.x.sets > 1) e.x.sets = Math.max(1, Math.floor((limit - (dose() - e.x.sets * lo)) / lo + EPS)); }
      while (dose() > limit + EPS && list.length > 1) drop(list[list.length - 1]);
    }
  }
  // the week's athletic stations: sets per budget key (the dose lands each key on its weekly target, D-63 resolved)
  const stationsSets = {};
  for (const { cands } of perDay) for (const x of cands) {
    if (!x.ex || !ATHLETIC_KEY_BUCKETS.includes(x.slot.bucket) || typeof x.sets !== 'number') continue;
    const key = budgetKeyOf(x.slot.bucket, x.ex.athletic && x.ex.athletic.quality, null);
    if (key) stationsSets[key] = (stationsSets[key] || 0) + x.sets;
  }
  const aw = athletic[n - 1] ? { ...athletic[n - 1], stations_sets: stationsSets } : null;
  const days = [];
  for (const { day, cands } of perDay) {
    const res = cands.filter(x => x.isRes);
    const lastRes = res.length ? res[res.length - 1] : null;
    const smallOrMachine = res.filter(x => SMALL_RC_BUCKETS.includes((x.fill && x.fill.bucket) || x.slot.bucket) || (x.ex && (x.ex.equipment.machine || x.ex.tags.includes('machine')) && x.bd.kind !== 'resistance') ||
      (x.bd.kind === 'focus' && x.ex && x.ex.primary_muscle && model.muscle(x.ex.primary_muscle).class === 'small'));
    const lastSmall = smallOrMachine.length ? smallOrMachine[smallOrMachine.length - 1] : null;
    const firstUniLower = res.find(x => ['RP_UKD', 'RP_UHD'].includes((x.fill && x.fill.bucket) || x.slot.bucket) || (x.bd.region === 'lower' && ['unilateral', 'alternating'].includes(x.ex.laterality)));
    const firstBiCompound = res.find(x => x.bd.kind === 'resistance' && x.ex.laterality === 'bilateral' && x.ex.exercise_class === 'compound');
    const calfSets = res.filter(x => ((x.fill && x.fill.bucket) || x.slot.bucket) === 'ISO_CALF').reduce((a, x) => a + (x.sets || 0), 0);
    // a test item never runs as a superset (the partner goes straight sets, review 01 / 02 / 04)
    const testSS = new Set(cands.filter(x => x.slot.test && x.slot.superset).map(x => x.slot.superset));
    const supersetsOn = vw.supersets_on && typeof vw.supersets_on[day.weekday] === 'boolean' ? vw.supersets_on[day.weekday] : !!day.supersets_on;
    const dayCtx = { ...day, supersets_on: supersetsOn };
    // pass 2: doses + items
    const blocks = [];
    cands.forEach((x, i) => {
      const inTestPair = testSS.has(x.slot.superset);
      const item = buildItem(C, n, ws, vw, dayCtx, x, {
        index_in_day: i, is_last_resistance: x === lastRes, is_first_lift_of_day: x === res[0], is_last_small: x === lastSmall,
        is_first_unilateral_lower: x === firstUniLower, is_first_bilateral_compound: x === firstBiCompound, calf_sets_today: calfSets,
        superset_active: supersetsOn && !!(x.slot.superset || x.slot.pair) && !inTestPair
      }, aw);
      if (inTestPair) item.superset = null;
      let b = blocks.length ? blocks[blocks.length - 1] : null;
      if (!b || b.src !== x.blk) { b = { src: x.blk, kind: x.blk.kind, position: 0, movable: !!x.blk.movable, circuit: x.blk.circuit ?? null, items: [] }; blocks.push(b); }
      b.items.push(item);
    });
    blocks.forEach((b, i) => { b.position = i; delete b.src; });
    distinctDetails(blocks, model);
    const groups = {};
    for (const x of cands) if (x.isRes) { const g = itemGroup(model, x); if (g) groups[g] = (groups[g] || 0) + 1; }
    const est = vw.est_minutes && typeof vw.est_minutes[day.weekday] === 'number' ? vw.est_minutes[day.weekday] : deps.estimateMinutes(dayCtx, sets, fills, model, { week: ws });
    days.push({
      weekday: day.weekday, day_type: day.day_type ?? null, kind: day.kind, optional: !!day.optional, label_key: day.label_key,
      full_body: !!day.full_body, format: day.format || 'straight', est_minutes: typeof est === 'number' ? roundHalfUp(est) : null,
      aerobic_minutes: typeof deps.aerobicMinutes === 'function' ? deps.aerobicMinutes(day, model) : 0,
      minutes_limit: day.minutes_limit ?? derived.session_minutes, supersets_on: supersetsOn,
      groups: orderedGroups(groups, R), why: dedupeWhy(day.why), blocks
    });
  }
  days.sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday));
  const items = days.flatMap(d => d.blocks.flatMap(b => b.items));
  const weekly = C.adapted ? recomputeWeekly(items, R) : null;
  const order = R.muscles.order;
  const a = athletic[n - 1] || null;
  const adaptedWeek = (vw.why || []).some(x => x.key === ADAPT_WHY.key && x.ref === ADAPT_WHY.ref);
  return {
    n, training_block: ws.training_block, block_type: ws.block_type, exercise_block: ws.exercise_block,
    stair_week: ws.stair_week ?? null, stair_level: ws.stair_level ?? null, phase: ws.phase, phase_key: ws.phase_key,
    planned_rir: ws.planned_rir ?? null, season_phase: ws.season_phase ?? null, rep_phase: ws.rep_phase ?? null, plyo_stage: ws.plyo_stage ?? null,
    test: ws.test ?? null, circuit: ws.circuit ?? null,
    step_by_muscle: orderedMap(vw.step_by_muscle, order, x => roundTo(x, 4)),
    target_by_muscle: orderedMap(vw.target_by_muscle, order, x => (x === null ? null : round2(x))),
    weekly_sets_by_muscle: weekly ? weekly.weekly : orderedMap(vw.weekly_sets_by_muscle, order, round2),
    direct_sets_by_muscle: weekly ? weekly.direct : orderedMap(vw.direct_sets_by_muscle, order, round2),
    main_sets_by_muscle: orderedMap(vw.main_sets_by_muscle || vw.weekly_sets_by_muscle, order, round2),
    total_main_sets: typeof vw.total_main_sets === 'number' ? vw.total_main_sets : (vw.total_resistance_sets ?? null),
    group_counts_by_day: Object.fromEntries(days.filter(d => Object.keys(d.groups).length).map(d => [d.weekday, d.groups])),
    total_resistance_sets: weekly ? weekly.total : vw.total_resistance_sets ?? null,
    rise_vs_prev: typeof vw.rise_vs_prev === 'number' ? roundTo(vw.rise_vs_prev, 4) : null,
    athletic_budget: a ? {
      plyo_share: a.plyo_share ?? null, stage: a.stage ?? null, factor: a.factor ?? null, targets: a.targets ?? null,
      planned: plannedAthletic(items, model), contacts_session_max: a.contacts_session_max ?? null
    } : null,
    aerobic_sessions: items.filter(it => it.aerobic || it.bucket === 'COND_AEROBIC').length,
    changes: (vw.changes || []).map(c => ({ ...c })),
    why: dedupeWhy([...(ws.why || []).filter(x => !(adaptedWeek && x.key === 'why.no_checkin_planned')), ...(vw.why || [])]),
    days
  };
}

/**
 * Rep-max tests go on bilateral compound lifts (a 3RM on an alternating cable press or a split squat is not a useful
 * strength test). week.layoutForWeek marks the station before the pick is known; here the mark moves to another station
 * of the same bucket whose pick is bilateral (the work lift first), or is dropped for that pattern (the squat / hinge
 * tests remain). Integration decision D-46 (INFERRED).
 */
function relocateStrengthTests(L, sel, model) {
  const cat = model.rules.tests.catalogue.strength;
  const strength = new Set([...Object.values(cat.from_zero), ...Object.values(cat.after_completed_block), cat.older, cat.pro]);
  const slots = [];
  for (const d of L.days || []) for (const b of d.blocks || []) for (const sl of b.slots || []) slots.push(sl);
  const ok = (sl) => {
    const f = sel.fills ? sel.fills[sl.slot_id] : null;
    const ex = f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null;
    return !!ex && ex.laterality === 'bilateral' && ex.exercise_class === 'compound' && !ex.is_athletic;
  };
  for (const sl of slots) {
    if (!sl.test || !strength.has(sl.test) || ok(sl)) continue;
    const alts = slots.filter(x => x !== sl && !x.test && x.bucket === sl.bucket && x.block !== 'circuit' && ok(x));
    const alt = alts.find(x => x.role === 'work') || alts.find(x => x.axial_req === 'axial') || alts[0] || null;
    if (alt) alt.test = sl.test;
    sl.test = null;
  }
}

/**
 * Limited kits can leave the same exercise twice on one day (select's last resort keeps a muscle group at 2 exercises with
 * a one-detail variation, R2-LIB-01 / R2-SES-05). A repeat that ended up with the same detail as an earlier copy takes the
 * next unused axis of the exercise's `variation_axes`, so the day never lists the identical exercise twice. Same exercise,
 * bucket, sets and credits: nothing counted changes (integration decision D-48).
 */
function distinctDetails(blocks, model) {
  const used = new Map();   // exercise id -> Set of detail axes already on the day ('' = no detail)
  for (const b of blocks) for (const it of b.items) {
    if (!it.exercise_id || b.kind === 'warmup') continue;
    const axes = used.get(it.exercise_id) || new Set();
    const mine = it.detail ? it.detail.axis : '';
    if (axes.has(mine)) {
      const ex = model.ex(it.exercise_id);
      const next = (ex.variation_axes || []).find(a => !axes.has(a));
      if (next) {
        it.detail = { axis: next, key: 'detail.' + next };
        if (!it.flags.includes('detail_variation')) it.flags = [...it.flags, 'detail_variation'].sort();
        it.why = dedupeWhy([...it.why.filter(w => w.key !== 'why.detail_variation'), why('why.detail_variation', 'R2-LIB-01', { axis: next })]);
      }
    }
    axes.add(it.detail ? it.detail.axis : '');
    used.set(it.exercise_id, axes);
  }
}

function buildItem(C, n, ws, vw, day, x, position, aw) {
  const { deps, model, derived, athletic, targets } = C;
  const { slot, bd, fill, ex } = x;
  const effBucket = (fill && fill.bucket) || slot.bucket;
  let dose = null;
  if (slot.bucket === 'TEST') dose = typeof deps.doseTestItem === 'function' ? deps.doseTestItem(slot, ws, derived, model) : null;
  else if (bd.kind === 'aerobic') dose = deps.doseAerobic(slot, ws, derived, model);
  else if (slot.bucket === 'COND_WOD' || slot.bucket === 'SKILL' || slot.circuit) dose = deps.doseConditioning(slot, fill, ws, derived, model);
  else if (!['warmup'].includes(bd.kind) && slot.block !== 'cooldown' && ex) {
    const m = ex.primary_muscle;
    const bt = (C.volume.block_targets || []).find(b => b.training_block === ws.training_block);
    const capM = bt && bt.cap && typeof bt.cap[m] === 'number' ? bt.cap[m] : (targets && targets.cap ? targets.cap[m] : null);
    const tM = vw.target_by_muscle ? vw.target_by_muscle[m] : null;
    const atCap = typeof capM === 'number' && typeof tM === 'number' && tM >= capM - EPS;
    dose = deps.doseItem({ slot, fill, exercise: ex, sets: x.sets, week: ws, day, derived, athletic: aw || athletic[n - 1] || null, position, at_cap: atCap, model, contact_scale: C.contactScale || 1 });
  }
  dose = dose || {};
  const test = dose.test || (dose.reps && dose.reps.type === 'test' ? { type: 'test', test: dose.reps.test } : null) || slot.test || null;
  const credits = ex ? creditsFor(model, ex, effBucket) : {};
  return {
    slot_id: slot.slot_id, station_id: slot.station_id ?? null, bucket: effBucket, role: slot.role ?? null, origin: slot.origin || 'template',
    group: ex && x.isRes ? itemGroup(model, x) : (slot.group ?? null),
    exercise_id: ex ? ex.id : null, name_key: ex ? ex.name_key : (slot.bucket === 'TEST' && slot.test && !model.has('en', 'tests.' + slot.test) && model.hasEx(slot.test) ? model.ex(slot.test).name_key : null), detail: (fill && fill.detail) || null,
    text_key: ex ? null : (slot.text_key ?? (slot.bucket === 'TEST' && slot.test && model.has('en', 'tests.' + slot.test) ? 'tests.' + slot.test : null)), cue_key: ex ? ex.cue_key : null,
    video: ex ? (ex.video ? { kind: ex.video.kind, url: ex.video.url } : { kind: 'search', url: null }) : null,
    sets: x.sets, reps: dose.reps ?? null, set_reps: dose.set_reps ?? null, effort: dose.effort ?? null, rest: dose.rest ?? null,
    load: dose.load ?? null, tempo_key: dose.tempo_key ?? null,
    superset: slot.superset ?? slot.pair ?? null,
    laterality: (fill && fill.laterality) || (ex ? ex.laterality : null), loading: (fill && fill.loading) || null,
    credits, athletic: dose.athletic ?? null, aerobic: slot.aerobic ?? null, circuit: dose.circuit ?? null, wod: dose.wod ?? null,
    test: test ? { type: 'test', test: test.test } : null,
    notes: (dose.notes || []).map(nt => ({ ...nt })), swaps: ((fill && fill.swaps) || []).slice(), flags: ((fill && fill.flags) || []).slice(),
    why: dedupeWhy([...(slot.why || []), ...((fill && fill.why) || []), ...(dose.why || [])])
  };
}

function creditsFor(model, ex, bucket) {
  if (ex.tags.some(t => model.rules.credit.never_credit_tags.includes(t))) return {};
  return { ...model.credits(ex, bucket) };
}

function itemGroup(model, x) {
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

function recomputeWeekly(items, R) {
  const weekly = {}, direct = {};
  let total = 0;
  for (const it of items) {
    const s = typeof it.sets === 'number' ? it.sets : 0;
    for (const [m, v] of Object.entries(it.credits || {})) {
      weekly[m] = (weekly[m] || 0) + s * v;
      if (v === 1) direct[m] = (direct[m] || 0) + s;
    }
    if (it.exercise_id && Object.keys(it.credits || {}).length && it.bucket && !String(it.bucket).startsWith('CORE') && !['CT_CORE_THORAX', 'CP_CORE_PELVIS'].includes(it.bucket)) total += s;
  }
  const order = R.muscles.order;
  return { weekly: orderedMap(Object.fromEntries(order.map(m => [m, weekly[m] || 0])), order, round2), direct: orderedMap(Object.fromEntries(order.map(m => [m, direct[m] || 0])), order, round2), total };
}

function plannedAthletic(items, model) {
  const p = { plyo_contacts: 0, jump_contacts: 0, low_contacts: 0, throws: 0, cod_cuts: 0, sprint_m: 0, olympic_sets: 0 };
  for (const it of items) {
    if (it.bucket === 'AP_TRIPLE_EXT') { p.olympic_sets += typeof it.sets === 'number' ? it.sets : 0; continue; }
    const a = it.athletic;
    if (!a || typeof a.total !== 'number') continue;
    if (a.unit === 'contacts') {
      if (it.bucket === 'AP_JUMP_LIMITED_KNEE') p.low_contacts += a.total;
      else if (a.quality === 'plyometric') p.plyo_contacts += a.total;
      else p.jump_contacts += a.total;
    } else if (a.unit === 'throws') p.throws += a.total;
    else if (a.unit === 'cuts') p.cod_cuts += a.total;
    else if (a.unit === 'metres') p.sprint_m += a.total;
  }
  return p;
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

function buildMeta(C, v) {
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
  for (const L of C.layouts) (L.warnings || []).forEach(pushW);
  for (const s of selections) (s.warnings || []).forEach(pushW);
  if (buyList.length && !warnings.some(w => w.key === 'warning.v7_no_equipment')) pushW({ code: 'V7', key: 'warning.v7_no_equipment', args: { items: buyList.join(', ') } });
  // a day that runs past minutes x warn_above_factor carries warning.long_day (D-34) - added here when week / volume did not
  const factor = model.rules.session.long_day.warn_above_factor;
  for (const w of shape.weeks) {
    const vw = volume.weeks[w.n - 1] || {};
    const L = C.layouts[w.training_block - 1] || C.layouts[0];
    for (const [wd, min] of Object.entries(vw.est_minutes || {})) {
      const limit = d.session_minutes;
      const kind = L && (L.days.find(x => x.weekday === wd) || {}).kind;
      // v1.2: an optional day is long because of its aerobic session - say so (the 2-4-per-group reason is a main-day one)
      const key = kind === 'optional' ? 'warning.long_day_optional' : 'warning.long_day';
      if (typeof min === 'number' && min > limit * factor + EPS && !warnings.some(x => ['warning.long_day', 'warning.long_day_optional'].includes(x.key) && x.args && (x.args.day === wd || x.args.day === 'weekday.' + wd))) pushW({ code: 'long_day', key, args: { day: wd, min: roundHalfUp(min), limit } });
    }
  }
  stairwayTimeWarnings(C, warnings).forEach(pushW);
  // v1.2 (D-67): the stairway of each block is the one the volume engine placed (starts / caps sized to the session length)
  const blockT = (tbn) => (volume.block_targets || []).find(b => b.training_block === tbn) || null;
  const stairway = shape.training_blocks.filter(tb => tb.type === 'stairway').map(tb => {
    const b = blockT(tb.n);
    const sp = (b && typeof C.deps.stairwayFrom === 'function' ? C.deps.stairwayFrom({ ...T, start: b.start, cap: b.cap }, tb, d, model) : C.deps.stairwayPlan(T, tb, d, model)) || {};
    return { training_block: tb.n, N: tb.stair_N, lambda: orderedMap(sp.lambda || {}, model.rules.muscles.order, x => roundTo(x, 4)), lowered: b ? (b.lowered || []).slice() : [],
      start: b ? orderedMap(b.start, model.rules.muscles.order, x => x) : null, cap: b ? orderedMap(b.cap, model.rules.muscles.order, x => x) : null };
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
    days_per_week: d.days_per_week, session_minutes: d.session_minutes, weekdays: (d.weekdays || []).slice(), play_days: (d.play_days || []).slice(),
    template: { id: D6.template_id ?? null, variant: D6.variant ?? null, pairing: D6.pairing ?? null },
    kit: { profile: D8.profile ?? null, tokens: (D8.tokens || []).slice(), machines: (D8.machines || []).slice(), medball_max_lb: D8.medball_max_lb ?? null, buy_list: buyList },
    constraint_band: { client_family: D7.client_family ?? null, main: D7.main ?? null, iso: D7.iso ?? null },
    targets: { modifier_id: T.modifier_id ?? null, start: fb ? { ...T.start, ...fb.start } : (T.start || {}), cap: fb ? { ...T.cap, ...fb.cap } : (T.cap || {}), level_start: T.start || {}, level_cap: T.cap || {}, fill: T.fill || {}, priority: (T.priority || []).slice(), pain_muscles: (T.pain_muscles || []).slice(), floored: (T.floored || []).slice(), credit_only: (T.credit_only || []).slice(), calves_per_leg_day: T.calves_per_leg_day ?? null, core_block: T.core_block ?? null },
    stairway,
    share_targets: d.D10_bilateral_share ?? null,
    athletic: { enabled: !!D11.enabled, older_mode: D11.older_mode ?? null, plyo_share: D11.plyo_share ?? null, ground_contact_class: D11.ground_contact_class ?? null, contacts_session_max: D11.contacts_session_max ?? null, olympic_exposures_wk: D11.olympic_exposures_wk ?? null, game_heavy: !!D11.game_heavy, heavy_play_week: !!D11.heavy_play_week },
    aerobic: { per_week: D14.per_week ?? 0, base: D14.base ?? 0, adjust: D14.adjust ?? 0, replaced_by_activity: D14.replaced_by_activity ?? 0, walks: !!D14.walks, sport_is_aerobic: !!D14.sport_is_aerobic },
    tests,
    health: { ...(d.health || { role: v.intake.role || 'self', health_route: v.intake.health_route ?? null, refer: false, reasons: [], bypass: false }) },
    older_opt_in: d.age >= model.rules.population.older.from_age && !!(d.prefs && d.prefs.older_athletic_opt_in),
    after_plan: shape.after_plan ?? null,
    instruction_keys: INSTRUCTION_KEYS.slice(),
    locked_rule_keys: model.rules.locked.map(l => l.key),
    input_audit: inputAudit(v.intake),
    warnings: dedupeIssues(warnings),
    r3_pending: uniqueSorted([...(d.r3_pending || []), ...C.layouts.flatMap(L => L.r3_pending || [])]),
    derived: d,
    why: metaWhy
  };
}

/**
 * warning.stairway_time (integration decision D-47, B2 request): inside a stairway block the planned sets of some target
 * muscles no longer fit the chosen session length (volume shortfalls `why.cut_time`), so from that week they climb by load
 * and effort only. Muscles already named by warning.floor_schedule are left to that warning. Advice: longer sessions
 * (estimate: the last week's missing sets x minutes per compound set, spread over the main days, rounded up to 5 min,
 * capped at the longest allowed session) or one more training day. INFERRED estimate; the coach's time model is PROPOSED.
 */
function stairwayTimeWarnings(C, warnings) {
  const { model, derived: d, shape, volume } = C;
  const R = model.rules;
  const fill = (d.D9_start_sets && d.D9_start_sets.fill) || {};
  const floorNamed = new Set(warnings.filter(w => w.key === 'warning.floor_schedule').flatMap(w => String((w.args && w.args.muscles) || '').split(/\s*,\s*/)));
  const out = [];
  for (const tb of shape.training_blocks) {
    if (tb.type !== 'stairway') continue;
    const [a, z] = tb.weeks;
    const last = volume.weeks[z - 1];
    if (!last || !last.target_by_muscle) continue;
    const blockWeeks = volume.weeks.slice(a - 1, z);
    const cutWeeks = (m) => blockWeeks.filter(w => (w.shortfalls || []).some(s => s.key === 'why.cut_time' && ((s.args && s.args.muscle) || s.field) === m && (!s.args || typeof s.args.missing !== 'number' || s.args.missing >= 1 - EPS))).map(w => w.n);
    const gap = (m) => (typeof last.target_by_muscle[m] === 'number' ? last.target_by_muscle[m] - ((last.weekly_sets_by_muscle || {})[m] || 0) : 0);
    const muscles = R.muscles.order.filter(m => ['target', 'own_sets'].includes(fill[m]) && !floorNamed.has(m) && gap(m) >= 1 - EPS && cutWeeks(m).length);
    if (!muscles.length) continue;
    const week = Math.min(...muscles.flatMap(cutWeeks));
    const missing = muscles.reduce((s, m) => s + gap(m), 0);
    const L = C.layouts[tb.n - 1];
    const mains = Math.max(1, ((L && L.days) || []).filter(x => x.kind === 'main').length);
    const longest = Math.max(d.session_minutes, ...Object.values(last.est_minutes || {}).filter(x => typeof x === 'number'));
    const need = Math.ceil((longest + missing * R.time_model.minutes_per_set.compound_bilateral / mains) / 5 - EPS) * 5;
    const competitive = d.D2_profile && d.D2_profile.competitive === 'competitive';
    const maxMin = Math.max(...R.session.minutes_allowed.filter(x => competitive || !R.session.minutes_over_90_competitive_only || x <= 90));
    const moreDays = need > maxMin && d.days_per_week < 6;
    out.push({ code: 'stairway_time', key: 'warning.stairway_time', args: {
      week, muscles: muscles.join(', '), advice: moreDays ? 'ui.plan.schedule_advice.more_days' : 'ui.plan.schedule_advice.longer', min: Math.min(need, maxMin) } });
  }
  return out;
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
  const reminders = [];
  if (items.length) for (const e of ends) {
    const tb = shape.training_blocks.find(t => t.n === e.training_block);
    const blockStart = addDays(d.start_date, ((tb ? tb.weeks[0] : 1) - 1) * 7);
    const endWeekStart = addDays(d.start_date, (e.n - 1) * 7);
    reminders.push(blockStart, addDays(endWeekStart, -7), addDays(endWeekStart, -1));
  }
  return {
    items, baseline_week: baseline ? baseline.n : (items.length ? D13.baseline_week ?? null : null),
    end_weeks: ends.length ? ends.map(w => w.n) : (D13.end_weeks || []).slice(), from_zero: !!D13.from_zero, reminders: uniqueSorted(reminders)
  };
}

function buildSummary(plan, C) {
  const order = C.model.rules.muscles.order;
  const W = plan.weeks;
  const rises = W.map(w => w.rise_vs_prev).filter(x => typeof x === 'number');
  const steps = W.flatMap(w => Object.values(w.step_by_muscle || {})).filter(x => typeof x === 'number');
  const myoValue = C.model.rules.credit.myo_set_value;
  const sets = {}, tg = {};
  for (const m of order) {
    if (W.some(w => typeof (w.weekly_sets_by_muscle || {})[m] === 'number')) sets[m] = W.map(w => ((w.weekly_sets_by_muscle || {})[m] ?? 0));
    if (W.some(w => typeof (w.target_by_muscle || {})[m] === 'number')) tg[m] = W.map(w => ((w.target_by_muscle || {})[m] ?? null));
  }
  const shortfalls = dedupeIssues(C.volume.weeks.flatMap(w => (w.shortfalls || []).map(s => ({ ...s, week: s.week ?? w.n }))));
  return {
    total_resistance_sets_by_week: W.map(w => w.total_resistance_sets),
    max_weekly_rise: rises.length ? roundTo(Math.max(...rises), 4) : 0,
    planned_steps_max: steps.length ? roundTo(Math.max(...steps), 4) : 0,
    stair_levels: W.map(w => w.stair_level),
    sets_by_muscle_by_week: sets,
    target_by_muscle_by_week: tg,
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
