// engine/volume.mjs - the 12_volume_algorithm_v1 engine (engine/CONTRACTS.md §4.5): weekly targets (D9), the planned stairway
// (lambda), weekly set placement (VOL-07), the time check (R3-SES-02), the athletic budget and credit counting. Owner: B2;
// v0.4 (stage B1, coach_answers_round3.md): lines and groups, Focus muscles, the time check, check-ins retired.
// Pure: no I/O, no clock, no randomness. Every number comes from model.rules; literals are structural or marked INFERRED.
//
// v0.4 in one paragraph. The stairway runs on LINES (quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves;
// side + rear + front delts are one shoulders line, R3-VOL-01); a set counts at most 1.0 to a line or a group (group credit).
// The floor of 10 and the climb are read on GROUPS (hips = glutes + hamstrings, shoulders; R3-SES-01). The plan is built once
// with its planned stairway (R3-VOL-02, R3-VOL-04: no check-ins). When the chosen days x minutes cannot hold the minimums the
// time check runs in the coach's approved order (R3-SES-02): tell up front and offer another day or longer sessions; if the
// person keeps their time, train fewer groups directly (Focus and sport-pinned groups first, then hips, quads, back, chest,
// shoulders, calves, triceps, biceps), the others keep their compound credit and are listed "not trained directly (time)";
// supersets are switched on where the day needs them; every trained group climbs (never flat).
import { EngineError, WEEKDAYS, EPS, why, round2, roundHalfUp } from './util.mjs';
import { olympicSetsForIndex } from './budget.mjs';
import { athleticBudget } from './athletic.mjs';
import { linesOf, lineCredits, groupCredits, primeLines, setCost, supersetMinutes } from './timefit.mjs';
import { testPlan } from './week.mjs';

/** @typedef {import('./util.mjs').Why} Why */

const round4 = (x) => (x < 0 ? -1 : 1) * Math.floor(Math.abs(x) * 1e4 + 0.5 + EPS) / 1e4;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const RESISTANCE_KINDS = ['resistance', 'isolation', 'focus'];
const ADDED_ORIGINS = ['bonus', 'focus_added'];
const NO_SET_KINDS = ['warmup', 'aerobic', 'skill'];
const NO_SET_BUCKETS = ['COND_WOD', 'COND_AEROBIC'];
const ATHLETIC_ROOM_CUTS = ['second_plyo', 'ankle_block_extra', 'second_throw', 'olympic_extra_stay_active'];

function matchWhen(when, ctx) {
  for (const [k, v] of Object.entries(when || {})) {
    if (k.endsWith('_gte')) { const f = k.slice(0, -4); if (!(isNum(ctx[f]) && ctx[f] >= v)) return false; continue; }
    if (Array.isArray(v)) { if (!v.includes(ctx[k])) return false; continue; }
    if (typeof v === 'boolean') { if (!!ctx[k] !== v) return false; continue; }
    if (ctx[k] !== v) return false;
  }
  return true;
}

function selectModifier(derived, model) {
  const D2 = derived.D2_profile;
  const ctx = { family: derived.D1_family, competitive: D2.competitive, ath03_group: D2.ath03_group, body_weight_lb: derived.body_weight_lb, goal: derived.goal };
  const r = model.rules.volume.modifier_select.find(x => matchWhen(x.when, ctx));
  if (!r) throw new EngineError('volume.no_modifier', 'no modifier rule matched');
  return r.use;
}

function templateDays(derived, model) {
  const D6 = derived.D6_week_layout;
  const t = model.template(D6.family, D6.days);
  return model.dayTypes(t, D6.variant);
}

function stationIncluded(st, minutes, priority) {
  if (st.include_from_minutes !== null && st.include_from_minutes !== undefined && st.include_from_minutes > minutes) return false;
  const c = st.condition;
  if (c && c.startsWith('if_priority:')) return priority.includes(c.slice('if_priority:'.length));
  return true;
}

/** main (non-optional) template days with an ISO_CALF station (CONTRACTS §4.5 computeTargets step 7) */
function legDaysOf(derived, model) {
  const dt = templateDays(derived, model);
  const pr = derived.priority_muscles || [];
  let n = 0;
  for (const wd of WEEKDAYS) {
    const e = dt.week_layout[wd];
    if (!e || e.kind !== 'main' || e.optional || !e.day_type) continue;
    const day = dt.day_types[e.day_type];
    if (day && day.stations.some(s => s.bucket === 'ISO_CALF' && stationIncluded(s, derived.session_minutes, pr))) n++;
  }
  return n;
}

function legDaysOfLayout(layout) {
  let n = 0;
  for (const d of layout.days || []) {
    if (d.kind !== 'main') continue;
    if ((d.blocks || []).some(b => (b.slots || []).some(s => s.bucket === 'ISO_CALF'))) n++;
  }
  return n;
}

function isCircuitPlan(derived, model) {
  const dt = templateDays(derived, model);
  return WEEKDAYS.some(d => { const e = dt.week_layout[d]; const x = e && e.day_type && dt.day_types[e.day_type]; return !!x && e.kind === 'main' && x.format === 'circuit'; });
}

function painAreas(derived, model) {
  const out = {};
  for (const p of derived.pain || []) {
    if (p.severity === 'severe') continue;
    const def = model.rules.volume.pain.areas[p.area];
    for (const m of (def ? def.muscles : [])) if (!(m in out)) out[m] = p.area;
  }
  return out;
}

function maintFactorOf(derived, model) {
  const M = model.rules.plan_types.maintenance_4_6;
  let f = M.factor[derived.maint_reason];
  if (!isNum(f)) f = M.factor.planned_maintenance;
  if (derived.age >= model.rules.population.older.from_age) f = Math.max(f, M.older_floor);
  return f;
}

/** Focus lines of a derived object (v0.4: derived.focus_lines; older derived objects: priority muscles mapped to lines) */
function focusLinesOf(derived, model) {
  if (Array.isArray(derived.focus_lines)) return derived.focus_lines.slice();
  const X = linesOf(model);
  return X.order.filter(l => (derived.priority_muscles || []).some(m => X.lineOf[m] === l));
}

/**
 * calves: the weekly floor a plan can hold with one calf exercise per leg day (R3-SES-01) and still climb: 10 when one exercise a
 * leg day reaches it with room for the climb (3+ leg days), else the most a leg day holds minus the climb, never under 3 sets a
 * leg day (VOL-17; the weekly 10 with fewer leg days needs a 4th set and the optional-day calves slot - PROPOSED, 12 v1.2 §3.3).
 */
export function calvesFloor(model, legDays) {
  const V = model.rules.volume;
  const n = Math.max(legDays, 0);
  const climb = (model.rules.stairway.min_climb && model.rules.stairway.min_climb.calves) || 1;
  return Math.max(V.calves.per_leg_day.L1 * n, Math.min(V.calves.weekly_floor, model.rules.placement.max_sets_isolation * n - climb));
}

/**
 * Targets core (CONTRACTS §4.5 computeTargets, order of operations rules.volume.order_of_operations), per LINE (v0.4).
 * opts: {modifier_id, floor, maintenance, maintFactor, cycles, legDays, priority:false}
 */
function targetsFor(derived, model, opts = {}) {
  const R = model.rules, V = R.volume;
  const X = linesOf(model);
  const L = derived.D3_client_level.level;
  const mode = derived.D5_plan_shape.mode;
  const modifier_id = opts.modifier_id || selectModifier(derived, model);
  const mod = V.modifiers[modifier_id];
  const circuit = isCircuitPlan(derived, model);
  const maintenance = opts.maintenance !== undefined ? opts.maintenance : mode === 'maintenance_4_6';
  const applyFloor = opts.floor !== undefined ? opts.floor : (!maintenance && !(circuit && (V.floor.exempt || []).includes('format:circuit')));
  const focus = opts.priority === false ? [] : focusLinesOf(derived, model);
  const FO = V.focus || null;
  const F = FO ? FO.add_default : V.priority.add[L];
  const pain = painAreas(derived, model);
  const legDays = isNum(opts.legDays) ? opts.legDays : legDaysOf(derived, model);
  const sp = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
  const pc = derived.previous_cycles || { count: 0 };
  const stopped = pc.last_block_finished === false || pc.last_had_holds_or_pain === true;
  const cycles = isNum(opts.cycles) ? opts.cycles : (stopped ? 0 : (pc.count || 0));
  const floorV = V.floor.value;
  const carriers = (V.floor && V.floor.carriers) || null;

  const start = {}, cap = {}, fill = {}, whyBy = {};
  const floored = [], credit_only = [], pain_muscles = [], floor_groups = [];
  const add = (m, w) => { (whyBy[m] = whyBy[m] || []).push(w); };
  // credit-only lines per modifier (D-03 / D-07 narrowed): a sport profile that writes direct weekly sets for an arm muscle
  // (04 weekly_sets ISO_TRICEP / ISO_BICEP) makes it a target again
  const unless = mod.credit_only_unless_profile_sets || {};
  const creditOnlyList = (mod.credit_only || []).filter(m => !(unless[m] && sp && sp.direct_sets_wk && sp.direct_sets_wk[unless[m]] > 0));
  // the line that carries each group's floor (hips: hamstrings, or glutes when glutes is a Focus line and hamstrings is not)
  const carrierOf = {};
  for (const g of X.groups) {
    const list = (carriers && carriers[g]) || (X.linesOfGroup[g] || []);
    const fl = list.filter(l => focus.includes(l));
    carrierOf[g] = fl.length && !fl.includes(list[0]) ? fl[0] : list[0];
  }
  for (const l of X.order) {
    const def = X.defs[l];
    const calves = !!def.per_leg_day, isPri = focus.includes(l);
    const regionF = def.region === 'lower' ? mod.lower : mod.upper;
    const rawF = def.class === 'small' ? mod.small : regionF;
    const credit = !calves && (rawF === 'credit' || creditOnlyList.includes(l) || def.members.some(m => creditOnlyList.includes(m)));
    if (credit && !isPri) { fill[l] = 'credit'; start[l] = null; cap[l] = null; credit_only.push(l); continue; }
    // a credit-only line chosen as a Focus muscle takes the numeric region factor (INFERRED; 12 v1.1 §3.3 "unless it is a priority")
    const factor = isNum(rawF) ? rawF : (isNum(regionF) ? regionF : 1);
    fill[l] = 'target';
    let s, c = null, base = null;
    if (calves) {
      s = V.calves.per_leg_day[L] * legDays;
      // one calf exercise x 3 sets per leg day (R3-SES-01); the weekly 10 when one exercise a leg day can hold it (VOL-17)
      if (applyFloor) s = Math.max(s, calvesFloor(model, legDays));
      add(l, why('why.calves_leg_day', 'VOL-17'));
    } else {
      base = V.start[l][L];
      s = roundHalfUp(base * factor);
    }
    const painArea = def.members.map(m => pain[m]).find(Boolean) || null;
    const carries = carrierOf[def.group] === l;
    if (applyFloor && carries && !calves) {
      // floor_10 before pain_factor (order_of_operations): pain wins over the floor, so a pain line is not floor-protected
      if (s < floorV) { s = floorV; if (!painArea) add(l, why('why.floor_10', 'R2-VOL-06', { muscle: l })); }
      if (!painArea) { floored.push(l); floor_groups.push(def.group); }
    } else if (applyFloor && calves && !painArea) { floored.push(l); floor_groups.push(def.group); }
    if (isPri) { s += F; add(l, why('why.focus_add', 'R3-SES-01', { n: F })); }
    if (painArea) {
      s = roundHalfUp(s * V.pain.start_factor);
      pain_muscles.push(l);
      add(l, why('why.pain_cut', 'VOL-03', { muscle: l, area: painArea }));
    }
    // v0.4 fix round 1 (E-88; RECHECK 02 major: a linebacker took 18 -> 21 calf sets on 6 days, more than chest or quads): for a field /
    // court athlete the calves climb from one exercise x 3 sets per leg day by a set or two (COACH-R3 R3-SES-01; the athletic block
    // loads the calves, OBSERVED BYOP ATHLETIC)
    if (calves) c = (V.calves.athlete_cap_modifiers || []).includes(modifier_id) ? s + (V.calves.athlete_climb || 2) : V.cap.calves[L];
    else {
      const capT = V.cap[l][L];
      c = Math.max(roundHalfUp(capT * factor), (s - (isPri ? F : 0)) + roundHalfUp((capT - base) * factor)); // D-02
    }
    if (isPri) {
      const bound = (V.priority.cap[l] || V.priority.cap.default)[L];
      c = Math.min(c + F, bound); // Focus: + F on the ceiling too, bounded by 18 / 26-28 / 30 (R3-SES-01)
    }
    c = Math.min(c, V.priority.absolute_cap);
    start[l] = s; cap[l] = c;
  }
  // v0.4 fix round 1 (E-84; COACH-R3 R3-SES-01 'glutes + hamstrings as one hips group'; RECHECK 03 major: hips at 1.6-1.8 x every
  // other group): outside the physique / strength plans a FOCUS group of two lines carries ONE weekly target - its carrier line's;
  // the other line follows as credit unless the client picked it as a Focus muscle
  const OTG = V.one_target_groups || null;
  if (OTG && (OTG.modifiers || []).includes(modifier_id)) {
    for (const g of OTG.groups || []) {
      const carrier = carrierOf[g];
      for (const l of (X.linesOfGroup[g] || [])) {
        if (l === carrier || (OTG.unless_focus && focus.includes(l)) || fill[l] !== 'target') continue;
        fill[l] = 'credit'; start[l] = null; cap[l] = null; credit_only.push(l);
        for (const arr of [floored, pain_muscles]) { const i = arr.indexOf(l); if (i >= 0) arr.splice(i, 1); }
        add(l, why('why.group_one_target', 'R3-SES-01', { group: g }));
      }
    }
  }
  // member muscles follow their line in exercise selection (select / week read fill per muscle)
  for (const m of R.muscles.order) if (!(m in fill)) fill[m] = X.lineOf[m] && fill[X.lineOf[m]] && X.defs[X.lineOf[m]].members.length > 1 && R.muscles.defs[m].target === false ? fill[X.lineOf[m]] : R.muscles.defs[m].fill;
  // profile volume ratios (swimming pull >= 1.5 x push, D-09) on lines
  for (const r of (sp && sp.volume_ratios) || []) {
    if (!isNum(start[r.muscle])) continue;
    for (const what of r.applies_to || ['start']) {
      const tbl = what === 'cap' ? cap : start;
      const plus = r.plus.reduce((a, x) => a + (isNum(tbl[x]) ? tbl[x] : 0), 0);
      const over = r.over.reduce((a, x) => a + (isNum(tbl[x]) ? tbl[x] : 0), 0);
      const need = Math.ceil(r.min * over - plus - EPS);
      if (tbl[r.muscle] < need) { tbl[r.muscle] = need; add(r.muscle, why('why.volume_ratio', 'D-09', { muscle: r.muscle, ratio: r.min, over: r.over.join(', ') })); }
    }
  }
  // maintenance (flat, not floored) or completed cycles (start x 1.05, cap + 1)
  if (maintenance) {
    const f = isNum(opts.maintFactor) ? opts.maintFactor : maintFactorOf(derived, model);
    for (const m of Object.keys(start)) if (isNum(start[m])) { start[m] = roundHalfUp(start[m] * f); add(m, why('why.maintenance', 'PER-01', { pct: roundHalfUp(f * 100) })); }
  } else if (cycles > 0) {
    const C = R.cycles;
    for (const m of Object.keys(start)) {
      if (!isNum(start[m])) continue;
      for (let k = 0; k < cycles; k++) start[m] = roundHalfUp(start[m] * C.start_multiplier);
      const capMax = focus.includes(m) ? C.cap_max_priority : C.cap_max_nonpriority;
      cap[m] = Math.max(cap[m], Math.min(cap[m] + cycles * C.cap_add, capMax));
    }
  }
  // v_taper Focus: shoulders + back grow; a model that still lists rules.volume.priority.v_taper_hold holds those lines at their
  // start (VOL-18). v1.3 models retire the hold (R3-SES-01 'everything else balanced', R3-SES-02 'never flat')
  if (opts.priority !== false && (derived.priority_choices || []).includes('v_taper')) {
    for (const m of V.priority.v_taper_hold || []) if (isNum(start[m]) && !focus.includes(m)) { cap[m] = start[m]; add(m, why('why.at_cap', 'VOL-18', { muscle: m })); }
  }
  for (const m of Object.keys(start)) if (isNum(start[m])) cap[m] = Math.max(cap[m], start[m]);
  return {
    modifier_id, start, cap, fill,
    lines: X.order.filter(l => isNum(start[l])),
    priority: X.order.filter(l => focus.includes(l)), focus_add: focus.length ? F : 0,
    pain_muscles, floored, floor_groups: [...new Set(floor_groups)], credit_only,
    calves_per_leg_day: V.calves.per_leg_day[L], calves_floor: calvesFloor(model, legDays), leg_days: legDays,
    core_block: { exercises: V.core_block.exercises, sets: V.core_block.sets },
    why: whyBy
  };
}

/**
 * D9: whole weekly sets per target LINE at week 1 of the first stairway, ceilings and fill policy (CONTRACTS §4.5).
 * @param {import('./util.mjs').Derived} derived
 * @param {object} model
 * @returns {import('./util.mjs').Targets}
 */
export function computeTargets(derived, model) {
  return targetsFor(derived, model, {});
}

/** targets of one stairway block: a year-plan block one / two cycles up (rules.cycles; D-26) */
function blockTargets(targets, trainingBlock, derived, model) {
  const step = trainingBlock && trainingBlock.factor && isNum(trainingBlock.factor.cycle_step) ? trainingBlock.factor.cycle_step : 0;
  if (!step) return targets;
  const C = model.rules.cycles;
  const start = { ...targets.start }, cap = { ...targets.cap };
  for (const m of Object.keys(start)) {
    if (!isNum(start[m])) continue;
    for (let k = 0; k < step; k++) start[m] = roundHalfUp(start[m] * C.start_multiplier);
    const capMax = targets.priority.includes(m) ? C.cap_max_priority : C.cap_max_nonpriority;
    cap[m] = Math.max(cap[m], Math.min(cap[m] + step * C.cap_add, capMax), start[m]);
  }
  return { ...targets, start, cap };
}

/**
 * Planned T(w) per target line for one stairway block (12 v1.1 §3.7.1; D-11, D-18).
 * @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>}}
 */
export function stairwayPlan(targets, trainingBlock, derived, model) {
  return stairwayFrom(blockTargets(targets, trainingBlock, derived, model), trainingBlock, derived, model);
}

/** planned steps of one line before lambda (standard step, pain freeze; v0.4: Focus lines never slow the others, R3-SES-01, and
 *  the older-adult 3 % cap retires, R3-VOL-04) */
function stepsOf(m, bt, N, derived, model) {
  const st = model.stair(N);
  const lim = model.rules.stairway.limits;
  const slowOthers = !(model.rules.volume.focus && model.rules.volume.focus.slow_others === false);
  const hasPri = bt.priority.length > 0 && slowOthers;
  const older = derived.age >= model.rules.population.older.from_age && !lim.older_cap_retired;
  const freeze = model.rules.volume.pain.freeze_weeks;
  const sp = [];
  for (let w = 2; w <= N; w++) {
    let s = st.standard_steps[String(w)];
    if (hasPri && !bt.priority.includes(m)) s = Math.min(s, lim.nonpriority_while_priority);
    if (older) s = Math.min(s, lim.older_60plus);
    if ((bt.pain_muscles || []).includes(m)) s = (w - 1 <= freeze) ? 0 : Math.min(s, lim.pain_after_freeze); // D-11
    sp.push(Math.min(s, lim.planned_step_max));
  }
  return sp;
}

/** growth factor of a line's planned stairway at lambda = 1 */
export function plannedGrowth(m, bt, trainingBlock, derived, model) {
  return stepsOf(m, bt, trainingBlock.stair_N, derived, model).reduce((g, s) => g * (1 + s), 1);
}

/**
 * Planned T(w) from block targets that are already final (blockTargets applied, or the time-checked targets).
 * @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>}}
 */
export function stairwayFrom(bt, trainingBlock, derived, model) {
  const N = trainingBlock.stair_N;
  if (!isNum(N)) throw new EngineError('volume.not_stairway', `training block ${trainingBlock.n} is not a stairway`);
  const LAM = model.rules.stairway.lambda;
  const lambda = {}, steps = {}, T = {};
  const keys = Object.keys(bt.start).filter(m => isNum(bt.start[m]));
  const order = [...linesOf(model).order.filter(l => keys.includes(l)), ...keys.filter(k => !linesOf(model).order.includes(k)).sort()];
  for (const m of order) {
    const S = bt.start[m], C = bt.cap[m];
    const sp = stepsOf(m, bt, N, derived, model);
    const growth = (lam) => sp.reduce((g, s) => g * (1 + lam * s), 1);
    let lam = 1;
    if (S * growth(1) > C + EPS) {
      let lo = LAM.lo, hi = LAM.hi;
      for (let k = 0; k < LAM.iterations; k++) { const mid = (lo + hi) / 2; if (S * growth(mid) > C) hi = mid; else lo = mid; }
      lam = (lo + hi) / 2;
    }
    const tArr = [S], sArr = [0];
    for (let w = 2; w <= N; w++) { const step = lam * sp[w - 2]; sArr.push(step); tArr.push(Math.min(C, tArr[w - 2] * (1 + step))); }
    if (lam < 1 && LAM.last_week_equals_cap_when_lambda_below_1) tArr[N - 1] = C;
    lambda[m] = lam; steps[m] = sArr; T[m] = tArr;
  }
  return { lambda, steps, T };
}

// ---------------------------------------------------------------------------------------------------------------
// credits
// ---------------------------------------------------------------------------------------------------------------

function exOf(model, fill) {
  if (!fill || !fill.exercise_id || !model.hasEx(fill.exercise_id)) return null;
  return model.ex(fill.exercise_id);
}
function creditsOf(model, slot, fill) {
  if (slot && slot.counts_as_volume === false) return null;
  const ex = exOf(model, fill);
  if (!ex) return null;
  if (ex.tags.some(t => model.rules.credit.never_credit_tags.includes(t))) return {};
  return model.credits(ex, (fill && fill.bucket) || slot.bucket);
}

/**
 * Weekly credited sets (coach count) per MUSCLE from a set map (exported for validate / tests).
 * @returns {Object<string,number>} every muscle of rules.muscles.order, round2
 */
export function weeklyCredits(layout, setsBySlot, fillsBySlot, model) {
  const raw = {};
  const seen = new Set();
  const addSlot = (slot, fill) => {
    const n = setsBySlot[slot.slot_id];
    if (!isNum(n) || n <= 0) return;
    const cr = creditsOf(model, slot, fill);
    if (!cr) return;
    for (const [m, c] of Object.entries(cr)) raw[m] = (raw[m] || 0) + n * c;
  };
  for (const d of (layout && layout.days) || []) for (const b of d.blocks || []) for (const s of b.slots || []) {
    seen.add(s.slot_id); addSlot(s, fillsBySlot[s.slot_id]);
  }
  for (const id of Object.keys(fillsBySlot || {}).sort()) {
    if (seen.has(id)) continue;
    const f = fillsBySlot[id];
    addSlot({ slot_id: id, bucket: f.bucket, counts_as_volume: true }, f);
  }
  const out = {};
  for (const m of model.rules.muscles.order) out[m] = round2(raw[m] || 0);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// athletic budget
// ---------------------------------------------------------------------------------------------------------------

// v0.4 stage B2: the athletic budget moved to engine/athletic.mjs (share-based contact split, the end-test-week hold); it is
// re-exported here so the pipeline's athleticBudget dependency (CONTRACTS §4.5) keeps its module
export { athleticBudget } from './athletic.mjs';

// ---------------------------------------------------------------------------------------------------------------
// planWeeklySets
// ---------------------------------------------------------------------------------------------------------------

function flattenDay(day) {
  const out = [];
  for (const b of day.blocks || []) for (const s of b.slots || []) out.push(s);
  return out;
}

/**
 * Weekly whole sets per slot for every week of the plan (CONTRACTS §4.5 planWeeklySets).
 * ctx.estimateMinutes (week.estimateMinutes) is the shared time model; an internal estimate is used when it is not given.
 *
 * v0.4 (coach_answers_round3.md):
 *  - The stairway runs on lines (one shoulders line); the floor and the climb are read on groups with group credit (R3-VOL-01,
 *    R3-SES-01). Focus lines start and end + F sets higher (R3-SES-01).
 *  - The time check (R3-SES-02): the full plan is probed at week 1 and at the peak week inside the chosen minutes; when it does
 *    not fit, the offers are computed (another day / the session length that fits), the plan keeps the person's time and
 *    trains fewer groups directly (Focus and sport-pinned groups first, then the approved keep order) so every trained group
 *    holds its floor in week 1 and climbs at least 2 sets by the last week (calves 1); supersets switch on where needed.
 *  - Every block is verified after placement; a group that misses its floor or does not climb leaves the block (not trained
 *    directly) and the block is placed again - the plan never ships a trained group under its floor or flat.
 *  - Placement (R3-VOL-03): VOL-07 order on the main days, alternating the exposures of a day type; small-line extras become a
 *    short bonus exercise on the optional day, else on a day that already trains the line (never its only exercise there).
 * @param {{derived:import('./util.mjs').Derived, shape:import('./util.mjs').Shape, layouts:import('./util.mjs').WeekLayout[],
 *          selections:import('./util.mjs').Selection[], model:object, fillSlot:Function, estimateMinutes?:Function}} ctx
 * @returns {import('./util.mjs').VolumePlan}
 */
export function planWeeklySets(ctx) {
  const { derived, shape, layouts, selections, model } = ctx;
  if (!derived || !shape || !Array.isArray(layouts) || !model) throw new EngineError('volume.bad_ctx', 'planWeeklySets needs derived, shape, layouts and model');
  const D9 = derived.D9_start_sets;
  const plans = [];
  // block-by-block, each block run (and re-run when its verification drops a group) on a copy of the cross-block state
  const cross = { weeksOut: [], warnings: [], offers: [], blockTargetsOut: [], timeChecks: [], prevTotal: null, prevWeek: null, lastStair: null, lastBlock: null, prevCircuit: null, prevStage: null, prevMainCredits: null };
  for (const tb of shape.training_blocks) {
    const layout = layouts[tb.n - 1];
    if (!layout) throw new EngineError('volume.no_layout', `no layout for training block ${tb.n}`);
    // a group that misses its floor or does not climb after placement: first the lines it competes with for time give one set of
    // their peak (a lower peak, R3-SES-02 step 4), then - when none can give - the group leaves this block (step 2)
    const adj = { drop: new Set(), capCut: {} };
    const tries = {};
    let res = null;
    for (let attempt = 0; attempt < 40; attempt++) {
      res = runBlock(ctx, tb, layout, cloneCross(cross), adj);
      if (globalThis.__BC_RETRY) console.error('RETRY tb', tb.n, 'attempt', attempt, 'fail', JSON.stringify(res.fail), 'drop', JSON.stringify([...adj.drop]), 'capCut', JSON.stringify(adj.capCut));
      if (!res.fail) break;
      const g = res.fail.group;
      tries[g] = (tries[g] || 0) + 1;
      if (res.fail.give && tries[g] <= 3) adj.capCut[res.fail.give] = (adj.capCut[res.fail.give] || 0) + 1;
      else adj.drop.add(g);
    }
    if (res.fail) { adj.drop.add(res.fail.group); res = runBlock(ctx, tb, layout, cloneCross(cross), { ...adj, final: true }); }
    Object.assign(cross, res.cross);
    plans.push(res);
  }
  void D9;
  return { weeks: cross.weeksOut, athletic: athleticBudget(derived, shape, model), warnings: dedupeWarnings(cross.warnings), offers: dedupeOffers(cross.offers), block_targets: cross.blockTargetsOut, time_check: cross.timeChecks };
}

function cloneCross(c) {
  return { ...c, weeksOut: c.weeksOut.slice(), warnings: c.warnings.slice(), offers: c.offers.slice(), blockTargetsOut: c.blockTargetsOut.slice(), timeChecks: c.timeChecks.slice(),
    lastStair: c.lastStair ? { sets: { ...c.lastStair.sets }, weekly: c.lastStair.weekly.slice() } : null };
}

/**
 * One training block (all its weeks). `forced` = groups a previous run of this block found unable to hold their minimums.
 * @returns {{cross:object, fail:string|null}}
 */
function runBlock(ctx, tb, layout, cross, adj) {
  const forced = adj.drop;
  const { derived, shape, selections, model, fillSlot } = ctx;
  const R = model.rules, V = R.volume, P = R.placement, S = R.session, TM = R.time_model;
  const X = linesOf(model);
  const L = derived.D3_client_level.level;
  const D9 = derived.D9_start_sets;
  const prio = D9.priority || [];
  const circuitPlan = isCircuitPlan(derived, model);
  const longF = S.long_day.warn_above_factor;
  const splitF = isNum(S.long_day.split_day_factor) ? S.long_day.split_day_factor : longF;
  const floorV = V.floor.value;
  const isAthleticFamily = derived.D1_family === 'athletic';
  const PL = (R.stairway.limits && R.stairway.limits.placed) || null;
  const CAP = R.stairway.capacity || null;
  const TF = S.time_fit || null;
  const MC = R.stairway.min_climb || { group: 2, calves: 1 };
  const OPT = P.optional_days || null;
  const mainOnly = !!(P.main_days_first && OPT && OPT.stairway_sets === false);
  const GDR = P.group_day_reduction || null;
  const minutesKeys = Object.keys(S.exercise_cap_by_minutes).map(Number).sort((a, b) => a - b);
  const capKey = (min) => { let k = minutesKeys[0]; for (const x of minutesKeys) if (x <= min) k = x; return String(k); };
  const splitCap = S.exercise_cap_by_minutes[capKey(derived.session_minutes)];
  const groupMax = Math.max(S.exercises_per_group.full_body_day[1], S.exercises_per_group.split_day[1]);
  const planLines = X.order.filter(l => isNum(D9.start[l]));
  const lineDef = (l) => X.defs[l];
  const isoBucketOf = {};
  for (const id of Object.keys(model.templates.buckets).sort()) {
    const b = model.templates.buckets[id];
    if (b.kind !== 'isolation') continue;
    if (b.muscle && X.lineOf[b.muscle] && !isoBucketOf[X.lineOf[b.muscle]]) isoBucketOf[X.lineOf[b.muscle]] = { bucket: id, variant: null, muscle: b.muscle };
    if (b.muscle_by_variant) for (const [v, m] of Object.entries(b.muscle_by_variant)) {
      const l = X.lineOf[m];
      if (!l) continue;
      const want = X.defs[l].iso_variant;
      if (!isoBucketOf[l] || (want && want === v)) isoBucketOf[l] = { bucket: id, variant: v, muscle: m };
    }
  }
  const selFor = (eb) => (selections || []).find(s => s && s.exercise_block === eb) || (selections || [])[eb - 1] || null;
  const profile = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
  const { weeksOut, warnings, offers, blockTargetsOut, timeChecks } = cross;
  const athletic = athleticBudget(derived, shape, model);
  void athletic;

  // ---- block state
  const days = (layout.days || []).filter(d => (d.blocks || []).length).map(d => ({ ...d, slots: flattenDay(d), added: [] }));
  const mainDi = days.map((d, di) => di).filter(di => days[di].kind === 'main');
  const isMainDi = (di) => days[di].kind === 'main';
  let sets = {}, fills = {};
  let added = [];
  let ss = {};
  for (const d of days) ss[d.weekday] = !!d.supersets_on;
  const ssNeeded = new Set();
  let lastDay = {};
  const atCapSeen = {};
  const reduced = [];
  const wks = shape.weeks.filter(w => w.training_block === tb.n);
  const stair = tb.type === 'stairway';
  const flatSets = stair && tb.factor && tb.factor.flat_sets === true;
  const bt0 = stair ? blockTargets(D9, tb, derived, model) : null;
  let bt = bt0;
  let plan = stair ? stairwayFrom(bt0, tb, derived, model) : null;
  let flatTargets = null;
  const noSS = tb.type === 'taper' || tb.type === 'recovery';
  let curWS = wks[0] || null;
  let probing = false; // false | true (peak probe) | 'unlimited' (offer sizing: no time limit, every pair supersetted)
  const dropGroups = new Set(forced);
  // test-week minutes per weekday (the work-ups of the rep-max tests, the timed test items), sized into the test weeks
  const testExtra = new Map();
  for (const ws of wks) if (ws.test) testExtra.set(ws.n, testPlan(layout, ws, derived, model));

  const allSlots = () => { const out = []; days.forEach((d, di) => { for (const s of d.slots) out.push([s, di]); for (const s of d.added) out.push([s, di]); }); return out; };
  const daySlotsOf = (di) => [...days[di].slots, ...days[di].added];
  const kindOf = (slot) => model.bucket(slot.bucket).kind;
  const isCircuitSlot = (slot) => circuitPlan && slot.circuit !== null && slot.circuit !== undefined;
  const groupOfSlot = (slot) => {
    if (slot.group) return slot.group;
    const pl = primeOf(slot);
    return pl.length ? X.groupOfLine[pl[0]] : null;
  };
  // v0.4 B4 (integration, sample 04: a 'Squat + clean' class day with no squat): in the class model (rules.session.time_fit
  // .keep_work_lift, CrossFit-style class OT18) the day's work lift is the class's strength piece - the time check never removes
  // it; a group the time check does not train directly keeps that one lift at the class table's sets (3 x 7 -> 3 x 4, heavier by
  // the week; no set stairway) and is listed with reason 'class_lift' (PROPOSED, E-64)
  const KWL = (TF && TF.keep_work_lift) || null;
  const classLift = (slot) => !!(KWL && (KWL.families || []).includes(derived.D1_family) && (KWL.roles || []).includes(slot.role) && !ADDED_ORIGINS.includes(slot.origin));
  const classLiftSets = (KWL && isNum(KWL.sets)) ? KWL.sets : ((R.reps.class_levels && R.reps.class_levels.strength && R.reps.class_levels.strength[0].sets) || 3);
  const isDropped = (slot) => {
    if (slot.pattern_kept) return false; // v0.4 fix round 1 (E-94): an optional-day pattern station of a group not trained directly
    if (!dropGroups.size || !RESISTANCE_KINDS.includes(kindOf(slot)) && !ADDED_ORIGINS.includes(slot.origin)) return false;
    if (slot.role === 'core_block') return false;
    if (classLift(slot)) return false; // the class's strength piece stays (E-64)
    const g = groupOfSlot(slot);
    return !!g && dropGroups.has(g);
  };
  // a class lift kept for a group not trained directly (E-64) is fixed structure like the power block: no stairway sets, no trims
  const placeable = (slot) => (RESISTANCE_KINDS.includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin)) && !isCircuitSlot(slot) && slot.counts_as_volume !== false && !isDropped(slot) && !slot.pattern_kept &&
    !(classLift(slot) && dropGroups.has(groupOfSlot(slot)));
  const isResistance = (slot) => RESISTANCE_KINDS.includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin);
  const isIso = (slot) => ['isolation', 'focus'].includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin);
  const active = (slot) => isNum(sets[slot.slot_id]) && sets[slot.slot_id] > 0;
  const crOf = (slot) => creditsOf(model, slot, fills[slot.slot_id]);
  function primeOf(slot) { const cr = crOf(slot); return cr ? primeLines(model, exOf(model, fills[slot.slot_id]), cr) : []; }
  const isRearSlot = (s) => (s.bucket === 'ISO_SIDE_REAR_DELT' && s.variant === 'rear') || s.focus_muscle === 'rear_delts';

  // weekly credits per line / group / muscle, on all days or on the main days only (the floor is read on main days)
  // mo: false = every day; true = the main days; 'stair' = the main days + the exercises the plan ADDED on an optional day (a big
  // line's climb may sit there, E-86; the floor is read on the main days)
  // v0.4 fix round 2 / F1 (E-139; RECHECK v0.4 03 minor, BRAIN V5b): with fewer than rules.volume.calves.optional_slot_below_leg_days
  // main leg days the optional day's Calves slot (OBSERVED BYOP optional days) carries the calves' weekly floor and climb next to the one
  // calf exercise x 3 sets per leg day (COACH-R3 R3-SES-01) - a 4th main-day calf set is not squeezed into a full leg day
  const CALF_OPT = isNum(V.calves.optional_slot_below_leg_days) && legDaysOfLayout(layout) < V.calves.optional_slot_below_leg_days &&
    days.some(d => d.kind === 'optional' && d.slots.some(s => s.bucket === 'ISO_CALF'));
  const isCalfOpt = (s, di) => CALF_OPT && !isMainDi(di) && s.bucket === 'ISO_CALF' && s.origin !== 'pattern_kept';
  // (the main leg days keep 3 calf sets only while the optional Calves slot is live: a time check may leave the optional day empty)
  const calfOptLive = () => CALF_OPT && days.some((d, di) => !isMainDi(di) && d.slots.some(s => isCalfOpt(s, di) && isNum(sets[s.slot_id]) && sets[s.slot_id] > 0));
  const tally = (mo, kind) => {
    const w = {};
    days.forEach((d, di) => {
      if (mo && !isMainDi(di) && mo !== 'stair') return;
      for (const s of daySlotsOf(di)) {
        if (mo === 'stair' && !isMainDi(di) && !ADDED_ORIGINS.includes(s.origin) && !isCalfOpt(s, di)) continue;
        const n = sets[s.slot_id];
        if (!isNum(n) || n <= 0) continue;
        const cr = crOf(s);
        if (!cr) continue;
        const per = kind === 'line' ? lineCredits(model, cr) : kind === 'group' ? groupCredits(model, cr) : cr;
        for (const [m, c] of Object.entries(per)) w[m] = (w[m] || 0) + n * c;
      }
    });
    return w;
  };
  const directRaw = (mo) => {
    const w = {};
    days.forEach((d, di) => {
      if (mo && !isMainDi(di)) return;
      for (const s of daySlotsOf(di)) if (active(s)) {
        const cr = crOf(s) || {};
        const ex = exOf(model, fills[s.slot_id]);
        for (const [m, c] of Object.entries(cr)) if (c >= 1 - EPS || (m === 'triceps' && ex && ex.credit_class === 'DIPS')) w[m] = (w[m] || 0) + sets[s.slot_id];
      }
    });
    return w;
  };
  const stairMode = mainOnly ? 'stair' : false;
  const haveOf = (l, mo = stairMode) => tally(mo, 'line')[l] || 0;
  const haveAll = (mo = stairMode) => { const t = tally(mo, 'line'), out = {}; for (const l of planLines) out[l] = t[l] || 0; return out; };
  const totalRes = (mo = false) => allSlots().reduce((a, [s, di]) => a + (isResistance(s) && active(s) && (!mo || isMainDi(di)) ? sets[s.slot_id] : 0), 0);
  const sessionFrac = (di, l) => {
    let t = 0;
    for (const s of daySlotsOf(di)) {
      const n = sets[s.slot_id]; if (!isNum(n) || n <= 0) continue;
      const lc = lineCredits(model, crOf(s)); if (lc[l]) t += n * lc[l];
    }
    return t;
  };

  // ---- time model (the shared week.estimateMinutes; an internal estimate for stub tests)
  const estimate = (di, setsMap, ssMode, withTests = false) => {
    const d = days[di];
    const tp = curWS && withTests ? testExtra.get(curWS.n) : null;
    let extra = 0;
    if (tp) {
      extra += tp.byDay[d.weekday] || 0;
      // v0.4 fix round 1 (E-91): the rep-max work-up replaces the lift's top set (rules.tests.replaces_top_set) - one planned set less
      const RT = R.tests && R.tests.replaces_top_set;
      for (const s of d.slots) if (tp.bySlot[s.slot_id] && isNum(setsMap[s.slot_id]) && setsMap[s.slot_id] > 0) {
        extra += tp.bySlot[s.slot_id];
        if (RT && setsMap[s.slot_id] >= 2) extra -= setCost(s, fills[s.slot_id], model, derived, curWS).minutes;
      }
    }
    const mode = ssMode === 'eligible' ? 'eligible' : (ssMode ? true : false);
    if (typeof ctx.estimateMinutes === 'function') {
      const blocks = (d.blocks || []).concat(d.added.length ? [{ kind: 'accessories', movable: false, circuit: null, slots: d.added }] : []);
      return ctx.estimateMinutes({ ...d, blocks }, setsMap, fills, model, { week: curWS, derived, supersets: mode }) + extra;
    }
    let t = 0, warm = false;
    const pairs = {}, circs = {};
    for (const slot of daySlotsOf(di)) {
      const k = kindOf(slot);
      if (k === 'warmup') { if (!warm) { t += TM.minutes_per_set.warmup_session; warm = true; } continue; }
      if (k === 'aerobic') continue;
      if (slot.bucket === 'COND_WOD') { t += TM.wod_minutes[0]; continue; }
      if (k === 'skill') { t += TM.minutes_per_set.skill_block; continue; }
      const n = setsMap[slot.slot_id];
      if (!isNum(n) || n <= 0) continue;
      if (isCircuitSlot(slot) && curWS && curWS.circuit) { (circs[slot.circuit] = circs[slot.circuit] || []).push(n); continue; }
      const cost = setCost(slot, fills[slot.slot_id], model, derived, curWS);
      const id = mode === 'eligible' ? (slot.superset || slot.superset_eligible) : (mode ? slot.superset : null);
      if (id) (pairs[id] = pairs[id] || []).push({ sets: n, cost });
      else t += n * cost.minutes + TM.changeover_min_per_exercise;
    }
    for (const k of Object.keys(pairs).sort()) t += supersetMinutes(pairs[k], model);
    for (const k of Object.keys(circs).sort()) {
      const g = circs[k], rounds = Math.max(...g);
      t += rounds * g.length * (curWS.circuit.work_s + TM.circuit.transition_s) / 60 + (rounds - 1) * TM.circuit.between_rounds_s / 60;
    }
    return t + extra;
  };
  // full-body days may run "a little longer" (x 1.10, R2-SES-05); split days get no tolerance (review 07)
  const limitOf = (di) => (probing === 'unlimited' ? Infinity : (days[di].minutes_limit || derived.session_minutes) * (days[di].full_body === false && isMainDi(di) ? splitF : longF));
  const ssMode = (di, on) => (on ? 'eligible' : !!days[di].supersets_on);

  // ---- fits: per-exercise max, per-session ceiling, split-day / athlete caps, minutes (supersets first, ORD-05, R3-SES-02 step 3)
  // v0.4 fix round 1 (E-82): while the time check sizes week 1, a set must also fit the PEAK week's costs (the end of the block
  // doses heavier: more Olympic sets, strength rest on the VOL3 work lifts) - a week-1 set that only fits at week-1 costs made
  // the whole day fail at the peak (RECHECK 01 blocker: quads lost to a 1-minute overrun on Monday)
  let peakGuard = null;
  const timeOkAt = (di, m2) => {
    const wd = days[di].weekday;
    if (estimate(di, m2, ssMode(di, !noSS && ss[wd])) <= limitOf(di) + EPS) return { ok: true, ssOn: false };
    if (!noSS && !ss[wd] && estimate(di, m2, 'eligible') <= limitOf(di) + EPS) return { ok: true, ssOn: true };
    return { ok: false, ssOn: false };
  };
  const timeOk = (di, extra) => {
    const m2 = { ...sets, ...extra };
    const t = timeOkAt(di, m2);
    if (!t.ok || !peakGuard || peakGuard === curWS) return t;
    const save = curWS; curWS = peakGuard;
    const m3 = { ...m2 };
    for (const sl of daySlotsOf(di)) if (sl.bucket === 'AP_TRIPLE_EXT' && isNum(m3[sl.slot_id]) && m3[sl.slot_id] > 0) { const per = olySets(sl, peakGuard); if (isNum(per)) m3[sl.slot_id] = per; }
    const t2 = timeOkAt(di, m3);
    curWS = save;
    return t2.ok ? { ok: true, ssOn: t.ssOn || t2.ssOn } : { ok: false, ssOn: false };
  };
  // VOL-07: the day's work lift never has fewer sets than another station of its group (review 03 / 06 / 07)
  const workOk = (slot, di) => {
    if (slot.role === 'work' || !slot.group) return true;
    const w = daySlotsOf(di).find(s => s !== slot && s.role === 'work' && s.group === slot.group && active(s));
    if (!w) return true;
    const max = P.max_sets_per_exercise[L];
    return sets[slot.slot_id] + 1 <= sets[w.slot_id] || sets[w.slot_id] >= max;
  };
  const fitsSet = (slot, di, l, force) => {
    const n = sets[slot.slot_id];
    // (fix round 2 / F1, E-139: with the optional Calves slot a main leg day keeps its one calf exercise at 3 sets, R3-SES-01)
    const max = isIso(slot) ? (slot.bucket === 'ISO_CALF' && isMainDi(di) && calfOptLive() ? V.calves.per_leg_day[L] : P.max_sets_isolation) : P.max_sets_per_exercise[L];
    if (n + 1 > max) return null;
    if (!workOk(slot, di)) return null;
    const lc = lineCredits(model, crOf(slot));
    const cap = prio.includes(l) ? V.per_session.priority : V.per_session.soft;
    if (sessionFrac(di, l) + (lc[l] || 0) > cap + EPS) return null;
    const t = timeOk(di, { [slot.slot_id]: n + 1 });
    if (!t.ok && force) return { ok: true, ssOn: false, forced: true };
    return t.ok ? t : null;
  };
  const counted = (di) => daySlotsOf(di).filter(s => active(s) && !S.outside_cap_blocks.includes(s.block));
  const capOk = (di) => {
    const d = days[di];
    const live = daySlotsOf(di).filter(active);
    if (!d.full_body && live.filter(s => s.counts_in_cap !== false && !S.outside_cap_blocks.includes(s.block)).length + 1 > splitCap) return false;
    if (isAthleticFamily && counted(di).length + 1 > S.athlete_cap) return false;
    return true;
  };
  const groupCount = (di, g) => daySlotsOf(di).filter(s => active(s) && placeable(s) && groupOfSlot(s) === g).length;

  // ---- laterality share (UNI-02): which station of a line gets the set
  const shareTarget = (region, ebIdx) => {
    const D10 = derived.D10_bilateral_share;
    const r = region === 'lower' ? D10.lower : D10.upper;
    const arr = r.by_exercise_block || [];
    if (region === 'lower' && (tb.type === 'pre_season' || tb.type === 'taper') && isNum(r.PRE)) return r.PRE;
    if (region === 'lower' && tb.type === 'in_season' && isNum(r.IN)) return r.IN;
    return arr.length ? arr[Math.min(ebIdx, arr.length - 1)] : null;
  };
  const latOf = (slot) => {
    const f = fills[slot.slot_id];
    const ex = exOf(model, f);
    const lat = (f && f.laterality) || (ex && ex.laterality);
    return lat === 'alternating' ? 'unilateral' : lat;
  };
  let curEbIdx = 0;
  const latPref = (l) => {
    const def = lineDef(l);
    if (def.class !== 'big' || !['lower', 'upper'].includes(def.region)) return null;
    const regB = (R.bilateral_share.compound_only && def.region === 'lower') ? R.bilateral_share.compound_only : R.bilateral_share.regions[def.region];
    let bil = 0, tot = 0;
    for (const [s] of allSlots()) {
      if (!active(s)) continue;
      const f = fills[s.slot_id];
      if (!regB.includes((f && f.bucket) || s.bucket)) continue;
      const ex = exOf(model, f);
      if (ex && ex.credit_class === 'GLUTE_ISO') continue; // isolation credit classes never count toward the share (master 6.2)
      const lat = latOf(s);
      if (lat === 'bilateral') { bil += sets[s.slot_id]; tot += sets[s.slot_id]; } else if (lat === 'unilateral') tot += sets[s.slot_id];
    }
    const tgt = shareTarget(def.region, curEbIdx);
    if (!tot || !isNum(tgt)) return null;
    const share = bil / tot, tol = P.laterality_tolerance;
    return share < tgt - tol ? 'bilateral' : share > tgt + tol ? 'unilateral' : null;
  };

  // ---- weekly rise caps (placed sets, R2-VOL-01 / UNI-05)
  let riseOn = false;
  let riseBy = {}, riseBase = {};
  const allowRise = (l) => {
    if (!PL) return Infinity;
    const prev = riseBase[l] || 0;
    const whole = Math.max(PL.per_muscle_whole_sets, roundHalfUp(PL.per_muscle_pct * prev));
    return prev > 0 ? Math.min(whole, Math.max(PL.per_muscle_whole_sets, Math.floor(PL.ceiling_pct * prev + EPS))) : whole;
  };
  const riseOk = (l, n = 1) => !riseOn || (riseBy[l] || 0) + n <= allowRise(l) + EPS;

  // ---- placeSet(l): VOL-07 order on the main days; R3-VOL-03: the exposures of the same day type alternate (Monday's first back
  // exercise, then Thursday's); small-line extras that do not fit become a bonus exercise (optional day first)
  const dayEligible = (di) => !mainOnly || isMainDi(di);
  // v0.4 fix round 1 (E-86): on an optional day the stairway extras may climb on the exercises the plan ADDED there (a bonus /
  // Focus exercise of the line, R3-VOL-03), never on its template slots (ORD-10)
  // v0.4 fix round 2 / F1 (E-135; RECHECK v0.4 01 / 03 blockers, 06 major: the whole climb of the big lines sat on the optional
  // Saturday while the main days held flat): with rules.placement.added_slots.big_lines_on_optional_day = 'focus_only' only a Focus
  // line (the client's Focus muscle 1 / 2, ORD-11) and a small line's bonus (R3-VOL-03) climb on the optional day; every other big
  // line climbs on its main days (R3-VOL-03 'Monday's first back exercise, then Thursday's')
  const BLO = P.added_slots ? P.added_slots.big_lines_on_optional_day : false;
  const OPTF = (P.added_slots && P.added_slots.optional_focus) || null;
  const optLineOk = (l) => (BLO === 'focus_only' ? (!l || prio.includes(l) || lineDef(l).class === 'small') : !!BLO);
  const extrasOnOpt = (l) => !!(BLO && (riseOn || probing === true) && optLineOk(l));
  // a Focus line's optional-day sets stay inside the day's two Focus slots x 2-3 sets (ORD-11) and an added exercise there never
  // passes the line's main-day exercises (E-87 order)
  const optDayLineSets = (di, l) => daySlotsOf(di).reduce((a, s) => a + (active(s) && primeOf(s).includes(l) ? sets[s.slot_id] : 0), 0);
  const optFocusOk = (di, s, l, n = 1) => {
    if (isMainDi(di) || BLO !== 'focus_only' || !OPTF || lineDef(l).class === 'small') return true;
    if (optDayLineSets(di, l) + n > OPTF.slots * OPTF.sets_max + EPS) return false;
    if ((isNum(sets[s.slot_id]) ? sets[s.slot_id] : 0) + n > OPTF.sets_max + EPS) return false;
    const mains = mainDi.flatMap(m => daySlotsOf(m).filter(x => active(x) && placeable(x) && primeOf(x).includes(l)));
    return !mains.length || (isNum(sets[s.slot_id]) ? sets[s.slot_id] : 0) + n <= Math.max(...mains.map(x => sets[x.slot_id])) + EPS;
  };
  const candOn = (di, s, l) => active(s) && placeable(s) && primeOf(s).includes(l) && (isMainDi(di) || !mainOnly || (extrasOnOpt(l) && ADDED_ORIGINS.includes(s.origin) && optFocusOk(di, s, l)) || (isCalfOpt(s, di) && lineDef(l).per_leg_day));
  const daysFor = (l) => days.map((d, di) => di).filter(di => (dayEligible(di) || extrasOnOpt(l) || (CALF_OPT && lineDef(l).per_leg_day)) && daySlotsOf(di).some(s => candOn(di, s, l)))
    .sort((a, b) => (isMainDi(a) ? 0 : 1) - (isMainDi(b) ? 0 : 1) || a - b);
  let curWeekN = 1;
  let changesBuf = null;
  const placeSet = (l, budget, force = false) => {
    if (budget !== undefined && budget < 1) return { ok: false, ceiling: true };
    if (!riseOk(l)) return { ok: false, rise: true };
    const dlist = daysFor(l);
    const mains = dlist.filter(isMainDi), opts = dlist.filter(di => !isMainDi(di));
    for (const group of [mains, opts]) {
      if (!group.length) continue;
      // rotation (R3-VOL-03): the next set of a line goes to the next day that trains it, so the two exposures of a day type
      // alternate (Monday's first back exercise this time, Thursday's the next) and every day stays even
      const lastDi = lastDay[l];
      let order = group.slice();
      if (lastDi !== undefined) {
        const li = order.indexOf(lastDi);
        const start = li >= 0 ? (li + 1) % order.length : Math.max(0, order.findIndex(x => x > lastDi));
        order = [...order.slice(start), ...order.slice(0, start)];
      }
      const pref = latPref(l);
      const regB = pref ? R.bilateral_share.regions[lineDef(l).region] : null;
      // v0.4 fix round 1 (E-87; RECHECK 02 / 07 majors: steps went to isolations and calves while the work lifts stayed flat for 12
      // weeks): pass 1 gives an isolation a set only when every compound of the line that day already holds more sets (VOL-07 'adding
      // sets to the things that matter most'); pass 2 (no compound of the line can take it on any of its days) lets it catch up
      for (const strict of [true, false]) {
        for (const di of order) {
          let cands = daySlotsOf(di).filter(s => candOn(di, s, l));
          if (pref) {
            const f = cands.filter(s => regB.includes((fills[s.slot_id] && fills[s.slot_id].bucket) || s.bucket) && latOf(s) === pref);
            if (f.length) cands = f;
          }
          if (!cands.length) continue;
          const first = cands[0];
          const below = cands.filter(s => sets[s.slot_id] < sets[first.slot_id]);
          let ordered = [...below, first, ...cands.filter(s => s !== first && !below.includes(s))];
          if (strict) {
            const comps = cands.filter(s => !isIso(s));
            ordered = ordered.filter(s => !isIso(s) || comps.every(c => sets[c.slot_id] >= sets[s.slot_id] + 1));
          }
          for (const s of ordered) {
            const t = fitsSet(s, di, l, force);
            if (!t) continue;
            sets[s.slot_id] += 1;
            if (t.ssOn) { ss[days[di].weekday] = true; ssNeeded.add(days[di].weekday); }
            lastDay[l] = di;
            if (riseOn) riseBy[l] = (riseBy[l] || 0) + 1;
            if (changesBuf) changesBuf.push({ key: 'changes.set_added', args: { exercise: fills[s.slot_id].exercise_id, day: days[di].weekday, slot_id: s.slot_id } });
            return { ok: true, added: 1, slot_id: s.slot_id };
          }
        }
      }
      if (group === mains && mainOnly && !extrasOnOpt(l) && !(CALF_OPT && lineDef(l).per_leg_day)) break; // optional days never carry stairway sets on a template slot (ORD-10; the Calves slot below 4 leg days, E-139)
    }
    return tryBonus(l, budget, force);
  };
  let allRoomFn = null;
  const joinedEb = new Set(); // lines that opened an added exercise in this exercise block (the block-start pass) // the weekly steps: room under the all-days total ceiling (V15, stairway.limits.total_weekly_ceiling)
  let fitRoom = null; // fit(): the line being fitted and its room to the target (+ half a set)
  const tryBonus = (l, budget, force = false) => {
    const def = lineDef(l);
    const small = def.class === 'small';
    if (def.per_leg_day) return { ok: false }; // never a second calf exercise on a leg day (R3-SES-01)
    const nSets = small ? P.bonus.sets : P.focus.sets;
    // v0.4 fix round 1 (E-86; RECHECK 01 / 04 / 06 majors: 1-set bonus stations, new exercises mid-block): an added exercise opens at
    // 2 sets (never a 1-set station, VOL-16), in the weekly steps only in the first week of an exercise block (PER-02: exercises stay
    // fixed for the block) - the line's bank waits until then
    const AS = P.added_slots || null;
    if (AS && riseOn && AS.only_at_exercise_block_start && !(curWS && (curWS.is_exercise_block_start || curWS.is_training_block_start))) return { ok: false, rise: true };
    const entry = AS ? (AS.entry_sets || nSets) : (riseOn ? Math.min(isNum(P.added_slot_entry_sets) ? P.added_slot_entry_sets : nSets, Math.floor(allowRise(l) - (riseBy[l] || 0) + EPS)) : nSets);
    if (entry < 1) return { ok: false, rise: true };
    if (budget !== undefined && budget < entry) return { ok: false, ceiling: true };
    const g = def.group;
    if (dropGroups.has(g)) return { ok: false };
    // R3-VOL-03: a small line's extra sets go to a short bonus exercise on the optional day first, else to a main day that already
    // trains the group (1-3 exercises: the bonus keeps 2-4 per group, R2-SES-05; never the day's only exercise for it)
    // the optional-day bonus carries a small line's stairway extras (the peak probe and weekly steps), never its week-1 start, and
    // one short bonus exercise per line on that day (R3-VOL-03 'a short bonus biceps exercise on the optional day')
    // v0.4 fix round 1 (E-86; RECHECK 01 blocker: the optional Saturday used 21 of its 60 minutes while the swimmer's quads were
    // listed 'not trained (time)'): a big line's climb may open a 2-set Focus exercise on the optional day too, before a new big
    // exercise on a main day (the floor stays on the main days)
    const extrasPhase = riseOn || probing === true;
    // (fix round 2 / F1, E-135: 'focus_only' - only a Focus line opens a 2-set exercise on the optional day)
    const bigOpt = !small && AS && AS.big_lines_on_optional_day && extrasPhase && optLineOk(l);
    const optional = ((small && P.bonus.optional_day_for_small_lines && extrasPhase) || bigOpt || !mainOnly)
      ? days.map((d, di) => di).filter(di => days[di].kind === 'optional' && days[di].slots.some(s => RESISTANCE_KINDS.includes(kindOf(s)))
        && !days[di].added.some(x => (X.lineOf[x.focus_muscle] || x.focus_muscle) === l)) : [];
    // a big line opens a new main-day exercise only when every existing exercise of the line that day is at its maximum sets
    // (RECHECK 06 major: a 1-set bench press bonus after the flies while the bench and the pec deck still had room)
    const atMax = (di) => daySlotsOf(di).filter(s => active(s) && placeable(s) && primeOf(s).includes(l)).every(s => sets[s.slot_id] >= (isIso(s) ? P.max_sets_isolation : P.max_sets_per_exercise[L]));
    const mains = days.map((d, di) => di).filter(di => days[di].kind === 'main' && groupCount(di, g) >= 1 && groupCount(di, g) < groupMax && (small || !AS || atMax(di)))
      .sort((a, b) => counted(a).length - counted(b).length || a - b);
    const order = (small && P.bonus.optional_day_for_small_lines) || bigOpt ? [...optional, ...mains] : [...mains, ...optional];
    for (const di of order) {
      const d = days[di];
      if (!capOk(di)) continue;
      if (d.kind === 'optional' && groupCount(di, g) >= groupMax) continue;
      // v0.4 fix round 1 (E-92; random sweep): an optional-day exercise opens at its 2 sets and has no same-day donor (E-86), so the
      // fit never opens one that would run the line more than half a set past the target it fits to - the peak P then holds what
      // the weekly steps can reach (a ceiling of 13 is never 'held' by 12 + a 2-set station)
      if (d.kind === 'optional' && AS && fitRoom && fitRoom.l === l && entry > fitRoom.room + EPS) continue;
      // (fix round 2 / F1, E-135: a Focus line's optional-day sets stay inside its two Focus slots x 2-3 sets, ORD-11)
      if (d.kind === 'optional' && !small && BLO === 'focus_only' && OPTF && optDayLineSets(di, l) + entry > OPTF.slots * OPTF.sets_max + EPS) continue;
      const iso = isoBucketOf[l];
      const useFocus = d.kind === 'optional' && !small ? true : (!small || !iso);
      const bucket = useFocus ? 'FOCUS' : iso.bucket;
      const focusMuscle = def.focus_muscle || (iso && iso.muscle) || def.members[0];
      // engine-added ids share the `<weekday>.<day_type>.xNN` space with week.mjs (prehab): take the next free number
      const used = daySlotsOf(di).map(s => { const mm = /\.x(\d+)$/.exec(s.slot_id); return mm ? Number(mm[1]) : 0; });
      const k = Math.max(0, ...used) + 1;
      const tag = (d.day_type || 'day') + '.x' + String(k).padStart(2, '0');
      const slot = {
        slot_id: d.weekday + '.' + tag, station_id: tag, bucket, role: useFocus ? 'focus' : 'iso', block: 'accessories', group: g,
        sets_hint: null, default_sets: nSets, pair: null, superset: null, superset_eligible: null, circuit: null, axial_req: null,
        variant: useFocus ? null : iso.variant, laterality_dial: false, loading: null, focus_muscle: focusMuscle,
        time_class: model.bucket(bucket).time_class || 'isolation', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null,
        origin: small ? 'bonus' : 'focus_added',
        why: [small ? why(d.kind === 'optional' ? 'why.bonus_optional_day' : 'why.bonus', d.kind === 'optional' ? 'R3-VOL-03' : 'VOL-07') : why('why.focus', 'ORD-11')]
      };
      if (typeof fillSlot !== 'function') return { ok: false };
      const f = fillSlot(slot, curWeekN, probing ? { probe: true } : undefined);
      if (!f || !f.exercise_id) continue;
      fills[slot.slot_id] = f;
      if (!primeOf(slot).includes(l)) { delete fills[slot.slot_id]; continue; }
      d.added.push(slot);
      sets[slot.slot_id] = entry;
      const capS = prio.includes(l) ? V.per_session.priority : V.per_session.soft;
      const t = timeOk(di, {});
      if (sessionFrac(di, l) > capS + EPS || (!t.ok && !force)) { d.added.pop(); delete sets[slot.slot_id]; delete fills[slot.slot_id]; continue; }
      if (t.ssOn) { ss[d.weekday] = true; ssNeeded.add(d.weekday); }
      added.push(slot);
      lastDay[l] = di;
      if (riseOn) riseBy[l] = (riseBy[l] || 0) + entry;
      if (changesBuf) changesBuf.push({ key: 'changes.bonus_added', args: { exercise: f.exercise_id, day: d.weekday, slot_id: slot.slot_id } });
      return { ok: true, added: entry, slot_id: slot.slot_id, bonus: true };
    }
    return { ok: false };
  };

  // ---- placeInc(l): one more set for line l from the peak allocation P the time check proved (v0.4). The next exposure of the
  // line's days comes next (R3-VOL-03: Monday's first back exercise, then Thursday's), inside a day the first exercise whose sets are
  // below the day's first (VOL-07 2/2/2 -> 3/2/2 -> 3/3/2). A bonus / Focus slot of P enters at one set (placed rise <= 1 set).
  let pSets = null, pFills = {}, pSS = {}, pAddedBy = [];
  let w1Groups = null;
  // a line whose group has not climbed its minimum yet goes first in a week's placement (every trained group climbs, R3-SES-02)
  const climbOwed = (l) => {
    if (!w1Groups) return false;
    const g = X.groupOfLine[l];
    if (carrierOfGroup(g) !== l) return false;
    return (tally(false, 'group')[g] || 0) - (w1Groups[g] || 0) < climbOf(g) - EPS;
  };
  // v0.4 fix round 1 (E-95; RECHECK 06 major: shoulders 24 -> 31 sets with the presses' and rows' helper credit and the optional
  // day's side raises, past the Focus / priority ceiling of 30): a weekly step never takes any line's all-days total (helpers and
  // optional-day sets included) past the absolute ceiling (BRAIN §5.9 guardrails, rules.volume.priority.absolute_cap)
  const ABS_CAP = V.priority && isNum(V.priority.absolute_cap) ? V.priority.absolute_cap : Infinity;
  const passesAbs = (slot, f, n = 1) => {
    if (!riseOn || ABS_CAP === Infinity) return false;
    const cr = creditsOf(model, slot, f || fills[slot.slot_id]);
    if (!cr) return false;
    const all = tally(false, 'line');
    return Object.entries(lineCredits(model, cr)).some(([l2, c]) => c > 0 && (all[l2] || 0) + n * c > ABS_CAP + EPS);
  };
  const placeInc = (l, budget, iopts = {}) => {
    if (!pSets) return iopts.joinOnly ? { ok: false } : placeSet(l, budget);
    // v0.4 fix round 1 (E-86; random sweep: a back line held 5 weeks because the optional-day exercise it needed was charged to the
    // main days' 7 % ceiling): the week's total ceiling counts what it measures - the main days (totalRes(mainOnly), UNI-05) - so an
    // exercise the plan added on an optional day is outside it (the line's own rise limit still holds)
    if (budget !== undefined && budget < 1 && !mainOnly) return { ok: false, ceiling: true };
    // (every day stays inside the all-days ceiling V15 checks - below 10 %, allRoomFn - as well)
    const roomOf = (di) => {
      const main = mainOnly && !isMainDi(di) ? undefined : budget, all = allRoomFn ? allRoomFn() : undefined;
      return main === undefined ? all : (all === undefined ? main : Math.min(main, all));
    };
    let roomBlocked = false;
    if (!riseOk(l)) return { ok: false, rise: true };
    // v0.4 fix round 1 (E-91; RECHECK 02 major): a lift tested this week takes no step (the test replaces its top set)
    const tested = riseOn && curWS && curWS.test && testExtra.get(curWS.n) ? new Set(testExtra.get(curWS.n).tested) : null;
    const byDay = new Map();
    days.forEach((d, di) => {
      const pool = [...d.slots, ...((pAddedBy[di] || []).filter(x => !d.slots.includes(x)))];
      pool.forEach((s, si) => {
        const want = pSets[s.slot_id] || 0;
        const cur = isNum(sets[s.slot_id]) ? sets[s.slot_id] : 0;
        if (want - cur < 1 - EPS || isDropped(s)) return;
        const rm = roomOf(di);
        if (rm !== undefined && rm < 1 - EPS) { roomBlocked = true; return; }
        if (tested && tested.has(s.slot_id)) return;
        if (iopts.joinOnly && (d.slots.includes(s) || d.added.includes(s))) return;
        const f = fills[s.slot_id] && fills[s.slot_id].exercise_id ? fills[s.slot_id] : pFills[s.slot_id];
        const cr = creditsOf(model, s, f);
        if (!cr || !primeLines(model, exOf(model, f), cr).includes(l)) return;
        if (passesAbs(s, f, 1)) return;
        if (!byDay.has(di)) byDay.set(di, []);
        byDay.get(di).push({ s, si, cur });
      });
    });
    if (!byDay.size) return roomBlocked ? { ok: false, ceiling: true } : { ok: false, done: true };
    let order = [...byDay.keys()].sort((a, b) => (isMainDi(a) ? 0 : 1) - (isMainDi(b) ? 0 : 1) || a - b);
    const lastDi = lastDay[l];
    if (lastDi !== undefined) {
      const ring = order.filter(isMainDi);
      const start = Math.max(0, ring.findIndex(x => x > lastDi));
      const rot = ring.length ? [...ring.slice(start), ...ring.slice(0, start)] : [];
      order = [...rot, ...order.filter(di => !isMainDi(di))];
    }
    // v0.4 fix round 1 (E-86 / E-87): the existing exercises take the step first - in VOL-07 order (the lowest first, the earlier on
    // ties: 2/2/2 -> 3/2/2 -> 3/3/2), an isolation only when every compound of the line that day holds more sets - and an added
    // exercise of P joins only when no existing exercise of the line can take the step (RECHECK 06 / 07 majors)
    const isExisting = (di, s) => days[di].added.includes(s) || days[di].slots.includes(s);
    const hasExisting = order.some(di => byDay.get(di).some(({ s }) => isExisting(di, s)));
    for (const phase of ['strict', 'existing', 'join']) {
      if (phase === 'join' && iopts.existingOnly) break;
      for (const di of order) {
        const cands = byDay.get(di).slice().sort((a, b) => a.cur - b.cur || a.si - b.si);
        for (const { s } of cands) {
          const d = days[di];
          const existing = isExisting(di, s);
          if ((phase === 'join') === existing) continue;
          if (phase === 'strict' && isIso(s)) {
            const comps = daySlotsOf(di).filter(x => active(x) && !isIso(x) && placeable(x) && primeOf(x).includes(l));
            if (!comps.every(c => sets[c.slot_id] >= (isNum(sets[s.slot_id]) ? sets[s.slot_id] : 0) + 1)) continue;
          }
          if (!existing) {
            const budget = roomOf(di);
            // a bonus / Focus slot of P joins the week with its real pick (or not at all); v0.4 fix round 1 (E-86): at 2 sets, in the
            // first week of an exercise block - or later in the block only when the line has no other way to take its step (never a
            // 1-set station, PER-02 / VOL-16)
            const AS = P.added_slots || null;
            const joinN = AS ? Math.min(AS.entry_sets || 2, Math.max(1, Math.round(pSets[s.slot_id] || 0))) : 1;
            if (AS && !riseOn) continue; // never in the week-1 raise: an added exercise comes in as a step (RECHECK 01 major)
            const blockStart = !!(curWS && (curWS.is_exercise_block_start || curWS.is_training_block_start)) || !!(iopts.lateEntry && !isMainDi(di));
            if (AS && AS.only_at_exercise_block_start && !blockStart) continue; // PER-02: a new exercise only where an exercise block starts
            if (AS && joinN < (AS.entry_sets || 2)) { pSets[s.slot_id] = 0; continue; }
            // when the 2-set entry would rise the line (or the week) past its weekly limit (R2-VOL-01 'never more than 7 %', UNI-05), the
            // line's last existing exercise gives one set to it - the line rises one set, the new exercise still opens at 2
            let donor = null;
            if (riseOn && (!riseOk(l, joinN) || (budget !== undefined && budget < joinN))) {
              // (never a main-day set the group's floor needs when the new exercise sits on the optional day)
              const gl = X.groupOfLine[l], mainG = tally(true, 'group')[gl] || 0;
              const keepsFloor = (x, d2) => isMainDi(di) || !floorGroups.has(gl) || relaxed.has(gl) || mainG - (groupCredits(model, crOf(x) || {})[gl] || 0) >= groupFloorFor(gl) - EPS;
              // (the donor sits on the same day: a set never leaves a main day for the optional day)
              donor = allSlots().filter(([x, d2]) => d2 === di && isMainDi(d2) && active(x) && placeable(x) && primeOf(x).includes(l) && sets[x.slot_id] > P.min_sets && x.role !== 'work' && keepsFloor(x, d2))
                .map(([x, d2]) => ({ x, d2, iso: isIso(x) ? 0 : 1 })).sort((a, b) => a.iso - b.iso || b.d2 - a.d2)[0] || null;
              // no donor (the group's main-day floor needs every set): at an exercise-block start the new exercise may open at its 2 sets
              // inside the week's total limit (a structural change of the block, PER-02) - never mid-block
              if (!donor && !(blockStart && (budget === undefined || budget >= joinN))) continue;
              if (donor && (!riseOk(l, joinN - 1) || (budget !== undefined && budget < joinN - 1))) continue;
            } else if (budget !== undefined && budget < joinN) continue; // the week's total rise stays under its ceiling (UNI-05)
            const net = donor ? joinN - 1 : joinN;
            // the 2-set entry never runs the line past its planned stairway (the caller's limit: this week's target, or the exercise
            // block's last target for an entry in the block's first week) - a line never reaches its ceiling early and then holds
            if (isNum(iopts.joinLimit) && haveOf(l) + net > iopts.joinLimit + EPS) continue;
            const f = typeof fillSlot === 'function' ? fillSlot(s, curWeekN) : null;
            if (!f || !f.exercise_id || !primeLines(model, exOf(model, f), creditsOf(model, s, f)).includes(l)) continue; // this exercise block's pick does not drive the line: try the next block
            if (passesAbs(s, f, net)) continue;
            fills[s.slot_id] = f;
            d.added.push(s); added.push(s);
            sets[s.slot_id] = joinN;
            if (donor) sets[donor.x.slot_id] -= 1; // (the donor keeps its peak allocation: it takes its set back in a later step, VOL-07)
            if (changesBuf) changesBuf.push({ key: 'changes.bonus_added', args: { exercise: f.exercise_id, day: d.weekday, slot_id: s.slot_id } });
            lastDay[l] = di;
            if (riseOn) riseBy[l] = (riseBy[l] || 0) + net;
            return { ok: true, added: net, slot_id: s.slot_id };
          }
          sets[s.slot_id] = (isNum(sets[s.slot_id]) ? sets[s.slot_id] : 0) + 1;
          if (changesBuf) changesBuf.push({ key: 'changes.set_added', args: { exercise: fills[s.slot_id].exercise_id, day: d.weekday, slot_id: s.slot_id } });
          lastDay[l] = di;
          if (riseOn) riseBy[l] = (riseBy[l] || 0) + 1;
          return { ok: true, added: 1, slot_id: s.slot_id };
        }
      }
    }
    return { ok: false, done: true };
  };

  // ---- group-day reduction (D-68): a group whose 2-exercise minimum on every day sits above its week-1 target is trained on
  // fewer days, each keeping 2 exercises (master 10.3 PROPOSED; review 02 blocker 1)
  const reduceGroups = (targets) => {
    if (!GDR || !GDR.enabled) return;
    const rearActive = () => allSlots().filter(([s]) => active(s) && isRearSlot(s)).length;
    for (const l of planLines) {
      if (!isNum(targets[l])) continue;
      for (let guard = 0; guard < 12; guard++) {
        const have = haveOf(l, true);
        if (have <= targets[l] + P.week1_fit.trim_above + EPS) break;
        let best = null;
        for (const di of mainDi) {
          const mine = daySlotsOf(di).filter(s => active(s) && placeable(s) && primeOf(s).includes(l));
          for (const g of [...new Set(mine.map(groupOfSlot))].filter(Boolean)) {
            if (g === 'calves') continue; // calves stay on every leg day (VOL-17, V18)
            const unit = daySlotsOf(di).filter(s => active(s) && placeable(s) && groupOfSlot(s) === g);
            if (unit.some(s => GDR.keep_roles.includes(s.role))) continue;
            if (GDR.keep_pair_of_work && unit.some(s => s.pair && daySlotsOf(di).some(x => x !== s && x.role === 'work' && x.pair === s.pair && active(x)))) continue;
            const rears = unit.filter(isRearSlot).length;
            if (rears && rearActive() - rears < 1) continue;
            const cut = unit.reduce((a, s) => a + (lineCredits(model, crOf(s))[l] || 0) * sets[s.slot_id], 0);
            const after = have - cut;
            if (after < targets[l] - 2 * P.max_sets_per_exercise[L] - EPS) continue;
            // another target line of the unit must keep a way to reach its own target
            const hurts = unit.some(s => primeOf(s).some(x => x !== l && isNum(targets[x]) && haveOf(x, true) - sets[s.slot_id] < targets[x] - 1 - EPS &&
              !daySlotsOf(di).concat(...mainDi.filter(o => o !== di).map(daySlotsOf)).some(o => !unit.includes(o) && active(o) && placeable(o) && primeOf(o).includes(x))));
            if (hurts) continue;
            // a floor carrier keeps its floor
            if (floorLines.includes(l) && after < floorFor(l) - EPS) continue;
            const score = Math.abs(after - targets[l]) + (after > targets[l] + P.week1_fit.trim_above ? 0 : 0.01);
            if (!best || score < best.score - EPS || (Math.abs(score - best.score) <= EPS && di > best.di)) best = { di, g, unit, score };
          }
        }
        if (!best) break;
        for (const s of best.unit) sets[s.slot_id] = 0;
        reduced.push({ day: days[best.di].weekday, group: best.g, muscle: l });
      }
    }
  };

  // ---- v0.4 fix round 1 (E-83; RECHECK 02 major 'quads 18 = level cap in week 1, +2 sets in 12 weeks', 01 major 'back starts
  // at 12 above its target start of 10'): week 1 starts at the level start. When the template's minimum structure (every station
  // at its minimum sets) holds more of a line than its start, whole group-days leave (the D-68 reduction, now on the stairway
  // path): never the work lift's group or its pair partner, never calves, never the week's last rear-delt station; the group keeps
  // a day that can still reach its floor; on a knee day hips / push groups go first and on a hip day quads / pull groups (the
  // coach's cross pattern: knee + pull, hip + push - UNI-11, ORD-06, OBSERVED BYOP ATHLETIC A / B days), then the unit that lands
  // nearest the start, the latest day first. The cut stations stay out of the whole block (like a room cut).
  const structureCut = (startT, ws0) => {
    if (!GDR || !GDR.enabled || circuitPlan || flatSets) return;
    const save = snapshot();
    const saveWS = curWS; curWS = ws0;
    for (const [s] of allSlots()) { const v = initialSets(s, ws0); if (v !== null) sets[s.slot_id] = v; }
    const zero = {}; for (const l of planLines) zero[l] = 0;
    fit(zero, [], { reduce: false });
    const cut = new Set();
    const maxOf = (s) => (isIso(s) ? P.max_sets_isolation : P.max_sets_per_exercise[L]);
    const PATTERN_FIRST = { knee: ['hips', 'chest', 'shoulders'], hip: ['quads', 'back'] };
    for (const l of planLines) {
      if (!isNum(startT[l]) || lineDef(l).per_leg_day) continue;
      for (let guard = 0; guard < 12; guard++) {
        const have = haveOf(l, true);
        if (have <= startT[l] + P.week1_fit.trim_above + EPS) break;
        let best = null;
        for (const di of mainDi) {
          // split days (push / pull / legs) keep their skeleton: both exposures of a day type stay even (R3-VOL-03)
          if (days[di].full_body === false) continue;
          const mine = daySlotsOf(di).filter(s => active(s) && placeable(s) && !classLift(s) && primeOf(s).includes(l));
          for (const g of [...new Set(mine.map(groupOfSlot))].filter(Boolean)) {
            if (g === 'calves') continue;
            const unit = daySlotsOf(di).filter(s => active(s) && placeable(s) && groupOfSlot(s) === g);
            if (unit.some(s => GDR.keep_roles.includes(s.role))) continue;
            if (GDR.keep_pair_of_work && unit.some(s => s.pair && daySlotsOf(di).some(x => x !== s && x.role === 'work' && x.pair === s.pair && active(x)))) continue;
            const rears = unit.filter(isRearSlot).length;
            if (rears && allSlots().filter(([x]) => active(x) && isRearSlot(x)).length - rears < 1) continue;
            const cutL = unit.reduce((a, s) => a + (lineCredits(model, crOf(s))[l] || 0) * sets[s.slot_id], 0);
            const after = have - cutL;
            // the line keeps stations on its other days that can still carry its floor (and its start) at their maximum sets
            const rest = allSlots().filter(([s, d2]) => isMainDi(d2) && active(s) && placeable(s) && !unit.includes(s) && primeOf(s).includes(l));
            if (!rest.length) continue;
            const capRest = rest.reduce((a, [s]) => a + maxOf(s), 0);
            if (capRest < Math.max(startT[l], floorLines.includes(l) ? floorFor(l) : 0) - EPS) continue;
            // the group keeps 2-4 exercises on at least one other main day
            if (!mainDi.some(o => o !== di && daySlotsOf(o).filter(s => active(s) && placeable(s) && groupOfSlot(s) === g).length >= 2)) continue;
            // another target line of the unit keeps a way to reach its own start
            const hurts = unit.some(s => primeOf(s).some(x => x !== l && isNum(startT[x]) && !allSlots().some(([o, d2]) => isMainDi(d2) && !unit.includes(o) && active(o) && placeable(o) && primeOf(o).includes(x))));
            if (hurts) continue;
            const pref = (PATTERN_FIRST[days[di].lower_focus] || []).includes(g) ? 0 : 1;
            const score = Math.abs(after - startT[l]);
            if (!best || pref < best.pref || (pref === best.pref && (score < best.score - EPS || (Math.abs(score - best.score) <= EPS && di > best.di)))) best = { di, g, unit, score, pref };
          }
        }
        if (!best) break;
        for (const s of best.unit) { sets[s.slot_id] = 0; cut.add(s.slot_id); }
        reduced.push({ day: days[best.di].weekday, group: best.g, muscle: l });
      }
    }
    const red = reduced.slice();
    restore(save);
    reduced.length = 0; reduced.push(...red);
    curWS = saveWS;
    for (const id of cut) { roomCut.add(id); sets[id] = 0; }
  };

  // ---- floors (groups, R2-VOL-06 / R3-SES-01): the carrier line of each floored group holds the floor; calves by leg days
  const floorLines = (D9.floored || []).filter(l => planLines.includes(l));
  const legDaysNow = () => mainDi.filter(di => daySlotsOf(di).some(s => active(s) && placeable(s) && s.bucket === 'ISO_CALF')).length;
  const floorFor = (l) => (lineDef(l).per_leg_day ? calvesFloor(model, legDaysNow()) : floorV);
  const groupFloorFor = (g) => (g === 'calves' ? calvesFloor(model, legDaysNow()) : floorV);

  // ---- week-1 fit (12 v1.1 §4 step 3): trim above target + trim_above (latest isolation first, never below min_sets), drop
  // whole group-days still above, then add below target - add_below (Focus and sport priorities first when asked)
  const fit = (targets, floorSet, opts = {}) => {
    if (!opts.addOnly) for (const l of planLines) {
      if (!isNum(targets[l])) continue;
      let guard = 0;
      while (haveOf(l, true) > targets[l] + P.week1_fit.trim_above + EPS && guard++ < 200) {
        const cands = [];
        days.forEach((d, di) => { if (!isMainDi(di) && mainOnly) return; daySlotsOf(di).forEach((s, si) => {
          const calfMin = s.bucket === 'ISO_CALF' ? (s.calf_index === 1 ? 1 : (s.calf_alone || s.calf_index === 0 ? (S.default_sets.calves_first_when_alone || 3) : P.min_sets)) : P.min_sets;
          const workMin = derived.session_minutes >= (P.work_min_sets_from_minutes || 0) ? (P.work_min_sets || 0) : 0;
          if (active(s) && placeable(s) && sets[s.slot_id] > calfMin && primeOf(s).includes(l) && !(s.role === 'work' && sets[s.slot_id] <= workMin)) cands.push({ s, di, si, iso: isIso(s) ? 0 : 1 });
        }); });
        if (!cands.length) break;
        cands.sort((a, b) => a.iso - b.iso || b.di - a.di || b.si - a.si);
        sets[cands[0].s.slot_id] -= 1;
      }
    }
    if (opts.reduce !== false && !opts.addOnly) reduceGroups(targets);
    const stuck = {};
    // when time is short the Focus lines and the sport profile's priorities come first, then the floor carriers, then the big
    // lines, then calves, then the small lines (R3-SES-02 keep order)
    const profPrio = [...new Set(((profile && profile.priority_muscles) || []).map(m => X.lineOf[m]).filter(Boolean))].filter(l => isNum(targets[l]));
    const tier1 = [...new Set([...prio, ...profPrio])].filter(l => isNum(targets[l]));
    const tier2 = planLines.filter(l => isNum(targets[l]) && !tier1.includes(l) && floorSet.includes(l));
    const tier3 = planLines.filter(l => isNum(targets[l]) && !tier1.includes(l) && !tier2.includes(l) && (lineDef(l).class === 'big' || lineDef(l).per_leg_day));
    const passes = opts.priorityFirst ? [tier1, [...tier1, ...tier2], [...tier1, ...tier2, ...tier3], null].filter(x => x === null || x.length) : [null];
    for (const only of passes) {
      for (let guard = 0; guard < 3000; guard++) {
        const h = haveAll(mainOnly ? 'stair' : true);
        let best = null, bestD = 0;
        for (const l of (only || planLines)) {
          if (!isNum(targets[l]) || stuck[l]) continue;
          const thr = Math.max(targets[l] - (opts.exact ? 0.5 : P.week1_fit.add_below), floorSet.includes(l) ? floorFor(l) : -Infinity);
          const have = h[l] || 0;
          if (have >= thr - EPS) continue;
          const d = (thr - have) / Math.max(targets[l], 1);
          if (best === null || d > bestD + EPS) { best = l; bestD = d; }
        }
        if (best === null) break;
        fitRoom = { l: best, room: targets[best] + 0.5 - (h[best] || 0) };
        const r = placeSet(best);
        fitRoom = null;
        if (!r.ok) stuck[best] = true;
      }
    }
    return stuck;
  };

  const olyExposures = days.filter(d => d.kind === 'main').reduce((a, d) => a + d.slots.filter(s => s.bucket === 'AP_TRIPLE_EXT').length, 0);
  // stage B2: Olympic sets climb with the stairway, one more set at a time on the earliest exposures in day order (budget.mjs)
  const olyOrder = days.filter(d => d.kind === 'main').flatMap(d => d.slots.filter(s => s.bucket === 'AP_TRIPLE_EXT').map(s => s.slot_id));
  const olySets = (slot, ws) => olympicSetsForIndex(derived, model, olyExposures, ws, Math.max(0, olyOrder.indexOf(slot.slot_id)));
  let shortStart = false;
  // v0.4 B4 (integration, random sweep: floor Y / T raises alone for shoulders on a day whose side-raise station had no candidate
  // in a field kit): a template station whose same-day partners of its FOCUS group all came back empty from select (no candidate)
  // leaves that day - a group keeps 2-4 exercises on a day or leaves it (R2-SES-05, R3-SES-01 'never 1', E-12); it trains on its
  // other days. Circuits, the exempt groups (calves, core), the exempt families (strength) and added slots are not judged here.
  const G24 = S.exercises_per_group;
  const loneOnDay = (slot) => {
    if (!G24 || (G24.exempt_families || []).includes(derived.D1_family) || ADDED_ORIGINS.includes(slot.origin) || !placeable(slot) || classLift(slot)) return false;
    const g = groupOfSlot(slot);
    if (!g || (G24.exempt_groups || []).includes(g)) return false;
    const di = days.findIndex(d => d.slots.includes(slot));
    if (di < 0 || !isMainDi(di)) return false;
    const mates = days[di].slots.filter(x => x !== slot && placeable(x) && groupOfSlot(x) === g);
    return mates.length > 0 && !mates.some(x => { const fx = fills[x.slot_id]; return !!(fx && fx.exercise_id); });
  };
  const initialSets = (slot, ws) => {
    if (roomCut.has(slot.slot_id)) return 0;
    const k = kindOf(slot);
    if (NO_SET_KINDS.includes(k) || NO_SET_BUCKETS.includes(slot.bucket)) return null;
    if (isCircuitSlot(slot) && ws.circuit) return ws.circuit.rounds;
    if (slot.bucket === 'COND_CIRCUIT') return null;
    const f = fills[slot.slot_id];
    if (slot.text_key && !(f && f.exercise_id)) return null;
    if (!f || !f.exercise_id) return 0;
    if (classLift(slot) && dropGroups.has(groupOfSlot(slot))) return classLiftSets; // E-64: the class lift of a group not trained directly
    if (isDropped(slot)) return 0; // a group the time check leaves to compound credit (R3-SES-02 step 2)
    if (slot.pattern_kept) return slot.default_sets; // E-94: fixed sets, no stairway
    if (loneOnDay(slot)) return 0; // v0.4 B4: a group keeps 2-4 exercises on a day or leaves that day
    if (slot.bucket === 'AP_TRIPLE_EXT') {
      // Olympic sets follow the profile's weekly budget (2-4 a station; stay-active 2), review 01 / 03 / 04 / 08
      const per = olySets(slot, ws);
      if (isNum(per)) return per;
      const ex = exOf(model, f);
      if (ex && ex.athletic && ex.athletic.olympic_tier === 'L1' && ['clean', 'snatch', 'jerk'].includes(ex.athletic.olympic_family)) {
        const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
        const idx = Math.min(Math.max(ws.n - eb.weeks[0], 0), R.olympic.ramp.length - 1);
        return R.olympic.ramp[idx].sets; // PER-09 ramp 4 x 8 -> 4 x 4
      }
    }
    if (slot.bucket === 'ISO_CALF' && slot.calf_index === 1 && isNum(V.calves.second_station_sets)) return V.calves.second_station_sets;
    // v0.4 fix round 1 (E-88; BRAIN V13, RECHECK 02 / 06): the optional-day Calves slot only when the main leg days cannot hold the
    // calves (fewer than rules.volume.calves.optional_slot_below_leg_days main leg days)
    if (slot.bucket === 'ISO_CALF' && isNum(V.calves.optional_slot_below_leg_days)) {
      const di0 = days.findIndex(d => d.slots.includes(slot));
      if (di0 >= 0 && !isMainDi(di0) && legDaysOfLayout(layout) >= V.calves.optional_slot_below_leg_days) return 0;
    }
    let n;
    if (Array.isArray(slot.sets_hint)) n = slot.sets_hint[derived.session_minutes >= 90 ? 1 : 0];
    else if (isNum(slot.default_sets)) n = slot.default_sets;
    else {
      const D = S.default_sets;
      if (k === 'resistance') n = D.compound;
      else if (k === 'isolation' || k === 'functional') n = D.isolation;
      else if (k === 'core') n = D.core;
      else if (k === 'athletic' || k === 'power') n = derived.session_minutes >= 90 ? D.athletic_at_90 : D.athletic;
      else if (k === 'focus') n = D.focus;
      else n = D.min;
    }
    if (slot.role === 'work' && k === 'resistance' && isNum(P.work_min_sets) && derived.session_minutes >= (P.work_min_sets_from_minutes || 0)) n = Math.max(n, P.work_min_sets); // VOL-16 compounds 3
    // calves: one exercise x 3 sets per leg day (R3-SES-01, VOL-17)
    if (slot.bucket === 'ISO_CALF' && slot.calf_index === 0 && isNum(S.default_sets.calves_first_when_alone) && !(CALF_OPT && days.some(d => d.kind !== 'main' && d.slots.includes(slot))) && !days.some(d => d.slots.some(x => x !== slot && x.bucket === 'ISO_CALF' && x.calf_index === 1 && String(x.slot_id).split('.')[0] === String(slot.slot_id).split('.')[0]))) n = Math.max(n, S.default_sets.calves_first_when_alone);
    // when the minutes leave no room to climb, an isolation enters at 1 set and climbs (VOL-07 order); calves keep theirs
    if (shortStart && (k === 'isolation' || k === 'focus') && slot.bucket !== 'ISO_CALF' && isNum(CAP && CAP.short_start_iso_sets)) n = Math.min(n, CAP.short_start_iso_sets);
    return n;
  };
  const setFills = (sel) => {
    for (const d of days) for (const s of d.slots) fills[s.slot_id] = sel && sel.fills ? (sel.fills[s.slot_id] || null) : null;
  };
  const refillAdded = () => {
    for (const s of added) {
      const f = typeof fillSlot === 'function' ? fillSlot(s, curWeekN) : null;
      if (f && f.exercise_id) {
        const keep = fills[s.slot_id];
        fills[s.slot_id] = f;
        const l = X.lineOf[s.focus_muscle] || s.focus_muscle;
        if (!primeOf(s).includes(l)) fills[s.slot_id] = keep; // keep the line (H21)
      }
    }
  };
  const snapshot = () => ({ sets: { ...sets }, fills: { ...fills }, added: added.slice(), dayAdded: days.map(d => d.added.slice()), ss: { ...ss }, lastDay: { ...lastDay }, reduced: reduced.slice(), ssNeeded: [...ssNeeded] });
  const restore = (sn) => {
    sets = { ...sn.sets }; fills = { ...sn.fills }; added = sn.added.slice(); days.forEach((d, i) => { d.added = sn.dayAdded[i].slice(); });
    ss = { ...sn.ss }; lastDay = { ...sn.lastDay }; reduced.length = 0; reduced.push(...sn.reduced);
    ssNeeded.clear(); for (const x of sn.ssNeeded) ssNeeded.add(x);
  };
  const preScale = (base, factor, ws) => {
    // R2-PER-06 / D-37 v1.2 (review 03 minor): about 60 % of the last off-season week; the work and paired lifts keep 2 sets,
    // Focus (profile pre_season.focus), the second calf and duplicate isolations go first; Olympic x profile TE factor
    const pre = (profile && profile.pre_season) || {};
    const focusF = isNum(pre.focus) ? pre.focus : 1;
    const te = isNum(pre.TE) ? pre.TE : 1;
    const want = Math.round(factor * allSlots().reduce((a, [s]) => a + (isResistance(s) && !isCircuitSlot(s) && base && isNum(base[s.slot_id]) && base[s.slot_id] > 0 ? base[s.slot_id] : 0), 0));
    const isoSeen = {};
    for (const [s, di] of allSlots()) {
      const init = initialSets(s, ws);
      if (init === null) { sets[s.slot_id] = null; continue; }
      if (init === 0) { sets[s.slot_id] = 0; continue; }
      const k = kindOf(s);
      const b = base && isNum(base[s.slot_id]) && base[s.slot_id] > 0 ? base[s.slot_id] : init;
      if (base && isNum(base[s.slot_id]) && base[s.slot_id] === 0 && isResistance(s)) { sets[s.slot_id] = 0; continue; }
      if (s.bucket === 'AP_TRIPLE_EXT') { sets[s.slot_id] = Math.max(2, roundHalfUp(b * te)); continue; }
      if (!isResistance(s) || isCircuitSlot(s)) { sets[s.slot_id] = k === 'core' ? init : b; continue; }
      if (kindOf(s) === 'focus' || s.origin === 'focus_added') { sets[s.slot_id] = focusF <= 0 ? 0 : Math.max(1, roundHalfUp(b * factor * focusF)); continue; }
      if (s.bucket === 'ISO_CALF' && s.calf_index === 1) { sets[s.slot_id] = 0; continue; }
      const mus = primeOf(s).join(',');
      const key = days[di].weekday + '|' + mus;
      // a duplicate isolation goes first, but never leaves its group with a single exercise that day (R2-SES-05)
      const g = groupOfSlot(s);
      const others = daySlotsOf(di).filter(x => x !== s && placeable(x) && groupOfSlot(x) === g && isNum(base && base[x.slot_id]) && base[x.slot_id] > 0 && sets[x.slot_id] !== 0).length;
      if (isIso(s) && isoSeen[key] && others >= 2) { sets[s.slot_id] = 0; continue; }
      if (isIso(s)) isoSeen[key] = true;
      const keep = ['work', 'paired_upper'].includes(s.role) ? 2 : 1;
      sets[s.slot_id] = Math.max(keep, roundHalfUp(factor * b));
    }
    // trim isolations (latest first) until the total sits at the ~60 % reference
    for (let guard = 0; guard < 200 && totalRes() > want; guard++) {
      const c = allSlots().filter(([s]) => isResistance(s) && active(s) && isIso(s) && sets[s.slot_id] > 1 && !(s.bucket === 'ISO_CALF')).reverse();
      if (!c.length) break;
      sets[c[0][0].slot_id] -= 1;
    }
  };
  const scaleFrom = (base, factor, mode, ws) => {
    for (const [s] of allSlots()) {
      const init = initialSets(s, ws);
      if (init === null) { sets[s.slot_id] = null; continue; }
      if (init === 0) { sets[s.slot_id] = 0; continue; }
      const k = kindOf(s);
      if (s.bucket === 'COND_SPRINT_BUYOUT' && (tb.type === 'taper' || tb.type === 'recovery')) { sets[s.slot_id] = 0; continue; }
      const b = base && isNum(base[s.slot_id]) && base[s.slot_id] > 0 ? base[s.slot_id] : init;
      if (isResistance(s) && !isCircuitSlot(s)) sets[s.slot_id] = mode === 'ceil' ? Math.max(R.recovery.min_sets_per_exercise, Math.ceil(factor * b - EPS)) : Math.max(1, roundHalfUp(factor * b));
      else if ((k === 'athletic' || k === 'power' || isCircuitSlot(s)) && (tb.type === 'taper' || tb.type === 'recovery')) {
        const af = tb.type === 'recovery' ? (k === 'power' ? R.recovery.olympic.sets_factor : R.recovery.athletic_factor) : factor;
        sets[s.slot_id] = Math.max(1, Math.ceil(af * b - EPS));
      } else sets[s.slot_id] = k === 'core' ? init : b;
    }
  };

  // ---- room cuts that keep every group (v1.2 capacity order minus the athletic budget's own stations, which the athletic
  // budget sizes): the buy-out, repeated joint care, a non-priority duplicate isolation group on one day, a third exercise of a
  // group, a group's third weekly day
  const roomCut = new Set();
  let lastRoomRule = null;
  // competitive athletes keep their sport's athletic budget (the athletic stations are theirs to size, D-73); a stay-active plan
  // gives its second light Olympic piece before a muscle group leaves (R2-ATH-04 'a light piece', R3-SES-02)
  const stayActive = derived.D1_family === 'athletic' && !(derived.D2_profile && derived.D2_profile.competitive === 'competitive');
  // groups the sport keeps to compound credit (field athletes' arms, R3-VOL-01 'helper work'): their template stations are the
  // first room the time check takes (R3-SES-02 step 2 'arms ... only from compound credit')
  const creditGroups = new Set([...new Set((D9.credit_only || []).map(l => X.groupOfLine[l]))].filter(g => g && !(X.linesOfGroup[g] || []).some(l => planLines.includes(l))));
  const ROOM = [
    ...(creditGroups.size ? ['credit_only_station'] : []),
    // an aerobic add-on after lifting moves to its own session that day (any time; not session time) - the week layout's own
    // fallback when an add-on does not fit (v1.2), applied here before a group leaves (INFERRED)
    'aerobic_separate',
    // class model (CrossFit-style class, OT18 / D-78): the WOD holds its short range (10 -> 15 min) before a group leaves
    ...(derived.D1_family === 'hybrid_crossfit' ? ['wod_short', 'wod_hold'] : []),
    ...((CAP && CAP.room_cut_order) || []).filter(r => !ATHLETIC_ROOM_CUTS.includes(r) || (stayActive && r === 'olympic_extra_stay_active')),
    // v0.4 fix round 2 / F1 (E-143; RECHECK v0.4 08 blocker: a 2 x 45 racket player kept a medball throw, a clean pull and two jump
    // stations while every knee, push and pull lift left the plan): a stay-active plan keeps one athletic station a day and switches
    // its power block off before a big mover leaves - the block stays switchable (offer C, COACH-R3 R3-SES-02 'turn off that day's
    // athletic training ... and just focus on resistance')
    ...(stayActive && TF && Array.isArray(TF.stay_active_room_cuts) ? TF.stay_active_room_cuts : [])
  ];
  const ATH_KEY = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW', 'AP_COD', 'AP_SPRINT'];
  const blocksOff = new Map(); // block kind -> minutes it saved on the busiest day (offer C)
  const nextRoomCut = () => {
    const live = allSlots().filter(([s, di]) => isMainDi(di) && active(s) && !roomCut.has(s.slot_id));
    const byRule = {
      aerobic_separate: () => allSlots().filter(([s, di]) => isMainDi(di) && s.aerobic && s.aerobic.position === 'addon_after' && R.time_model.aerobic_addon_counts),
      credit_only_station: () => live.filter(([s]) => s.role !== 'work' && (RESISTANCE_KINDS.includes(kindOf(s)) || ADDED_ORIGINS.includes(s.origin)) && creditGroups.has(groupOfSlot(s))),
      second_calf: () => live.filter(([s, di]) => s.bucket === 'ISO_CALF' && s.calf_index === 1 && daySlotsOf(di).some(x => x !== s && x.bucket === 'ISO_CALF' && x.calf_index === 0 && active(x) && !roomCut.has(x.slot_id))),
      buyout: () => live.filter(([s]) => s.bucket === 'COND_SPRINT_BUYOUT'),
      wod_short: () => allSlots().filter(([s, di]) => isMainDi(di) && s.bucket === 'COND_WOD' && !s.wod_short && R.conditioning.wod.short_minutes),
      wod_hold: () => allSlots().filter(([s, di]) => isMainDi(di) && s.bucket === 'COND_WOD' && s.wod_short && !s.wod_hold),
      olympic_extra_stay_active: () => (stayActive ? live.filter(([s]) => s.bucket === 'AP_TRIPLE_EXT' && live.filter(([x]) => x.bucket === 'AP_TRIPLE_EXT').length > 1) : []),
      // (E-143) a day's athletic stations after its first (one jump / throw station a day); then the power block of every main day
      stay_active_second_athletic: () => (stayActive ? live.filter(([s, di]) => ATH_KEY.includes(s.bucket) && live.filter(([x, d2]) => d2 === di && ATH_KEY.includes(x.bucket)).indexOf(live.find(([x]) => x === s)) >= 1) : []),
      stay_active_power: () => (stayActive ? live.filter(([s]) => s.bucket === 'AP_TRIPLE_EXT') : []),
      // a repeated joint-care item (the same code on 2+ days), never the knee / Achilles care each leg day keeps (D-32)
      // (stage B2: joint care the coach wants every session - a swimmer's shoulder care, R3-ATH-01 - is never a room cut)
      prehab_extra: () => live.filter(([s]) => kindOf(s) === 'prehab' && s.bucket !== 'PREHAB_LOWER' && !s.every_session && live.filter(([x]) => kindOf(x) === 'prehab' && x.prehab_code === s.prehab_code).length > 1),
      second_iso_nonpriority: () => {
        const out = [];
        const isoGroup = (di, g) => daySlotsOf(di).filter(x => active(x) && placeable(x) && !roomCut.has(x.slot_id) && groupOfSlot(x) === g);
        for (const di of mainDi) {
          const seen = new Set();
          for (const s of daySlotsOf(di)) {
            const g = groupOfSlot(s);
            if (!g || seen.has(g) || g === 'calves' || !active(s) || roomCut.has(s.slot_id)) continue;
            seen.add(g);
            const unit = isoGroup(di, g);
            if (!unit.length || !unit.every(x => isIso(x) && x.role !== 'focus' && kindOf(x) !== 'focus' && x.origin !== 'focus_added')) continue;
            const pl = [...new Set(unit.flatMap(x => primeOf(x)))];
            if (!pl.length || pl.some(l => prio.includes(l))) continue; // a Focus line's group stays
            const otherDays = mainDi.filter(o => o !== di && daySlotsOf(o).some(x => active(x) && placeable(x) && !roomCut.has(x.slot_id) && isIso(x) && primeOf(x).some(l => pl.includes(l)))).length;
            if (otherDays >= 1) out.push([unit[unit.length - 1], di, unit]);
          }
        }
        return out;
      },
      third_of_group: () => live.filter(([s, di]) => placeable(s) && s.role !== 'work' && groupCount(di, groupOfSlot(s)) > 2 && daySlotsOf(di).filter(x => active(x) && placeable(x) && groupOfSlot(x) === groupOfSlot(s)).indexOf(s) >= 2),
      group_frequency: () => {
        // a group trained (2+ exercises) on 3+ main days leaves its least important day (never the work lift's group or pair)
        const out = [];
        for (const di of mainDi) {
          const groups = {};
          for (const s of daySlotsOf(di)) if (active(s) && placeable(s) && !roomCut.has(s.slot_id)) { const g = groupOfSlot(s); if (g) (groups[g] = groups[g] || []).push(s); }
          for (const [g, unit] of Object.entries(groups)) {
            if (g === 'calves' || unit.length < 2) continue;
            if (unit.some(s => ['work', 'core_block', 'survival'].includes(s.role) || (s.pair && daySlotsOf(di).some(x => x !== s && x.role === 'work' && x.pair === s.pair && active(x))))) continue;
            const daysWith = mainDi.filter(o => daySlotsOf(o).filter(x => active(x) && placeable(x) && !roomCut.has(x.slot_id) && groupOfSlot(x) === g).length >= 2).length;
            if (daysWith >= 3) out.push([unit[unit.length - 1], di, unit]);
          }
        }
        return out;
      }
    };
    const rearLive = allSlots().filter(([x]) => isRearSlot(x) && active(x) && !roomCut.has(x.slot_id)).length;
    const unitOf = (r, cand) => (['group_frequency', 'second_iso_nonpriority'].includes(r) && cand[2]) ? cand[2] : [cand[0]];
    // v0.4 B4 (integration, sample 07: every cut fell on the second pull day - it lost its pulldowns, rear delts and biceps and ran
    // 40 of 75 min while the first pull day kept all of them): a cut comes off the most loaded day first (the peak week's minutes),
    // so the two exposures of a day type stay even (the spirit of COACH-R3 R3-VOL-03); ties: the latest one first (v1.2). Only the
    // cuts of a group's exercises; the other room (a buy-out, a second Olympic piece, an aerobic add-on) keeps 'the latest first'
    const BALANCE_CUTS = ['credit_only_station', 'second_iso_nonpriority', 'third_of_group', 'group_frequency'];
    const loadMemo = new Map();
    const dayLoad = (di) => {
      if (!isNum(di)) return 0;
      if (!loadMemo.has(di)) { const save = curWS; curWS = wks[wks.length - 1] || curWS; loadMemo.set(di, estimate(di, sets, noSS ? false : 'eligible')); curWS = save; }
      return loadMemo.get(di);
    };
    for (const r of ROOM) {
      const c = (byRule[r] ? byRule[r]() : []).filter(cand => { const u = unitOf(r, cand); const rr = u.filter(isRearSlot).length; return !(rr && rearLive - rr < 1); });
      if (!c.length) continue;
      lastRoomRule = r;
      let pick = c.length - 1;
      if (BALANCE_CUTS.includes(r)) for (let i = c.length - 2; i >= 0; i--) if (dayLoad(c[i][1]) > dayLoad(c[pick][1]) + EPS) pick = i;
      return { victim: c[pick][0], unit: unitOf(r, c[pick]) };
    }
    return null;
  };
  const roomWhys = [];
  const applyRoomCut = (cut) => {
    if (lastRoomRule === 'aerobic_separate') { // a flag, not a cut: the session stays, at another time of the day
      cut.victim.aerobic = { ...cut.victim.aerobic, position: 'separate_session' };
      roomWhys.push(why('why.aerobic_separate', 'R2-SES-05'));
      return;
    }
    if (lastRoomRule === 'wod_short' || lastRoomRule === 'wod_hold') { // a flag, not a cut: the WOD stays, shorter (dose and the time model read it)
      if (lastRoomRule === 'wod_short') cut.victim.wod_short = true; else cut.victim.wod_hold = true;
      roomWhys.push(why('why.wod_short', 'UNI-09'));
      return;
    }
    if (lastRoomRule === 'stay_active_power') {
      // (E-143: the block's minutes on its busiest day - the offer to switch it back on)
      const di0 = days.findIndex(d => d.slots.includes(cut.victim) || d.added.includes(cut.victim));
      if (di0 >= 0) {
        const save = curWS; curWS = wks[wks.length - 1] || curWS;
        const before = estimate(di0, sets, noSS ? false : 'eligible');
        const m2 = { ...sets }; for (const x of cut.unit) m2[x.slot_id] = 0;
        const saved = before - estimate(di0, m2, noSS ? false : 'eligible');
        curWS = save;
        blocksOff.set('power', Math.max(blocksOff.get('power') || 0, saved));
      }
    }
    for (const x of cut.unit) { roomCut.add(x.slot_id); sets[x.slot_id] = 0; }
    const victim = cut.victim;
    if (victim.bucket === 'ISO_CALF' && victim.calf_index === 1) {
      const di = days.findIndex(d => d.slots.includes(victim) || d.added.includes(victim));
      for (const x of di >= 0 ? daySlotsOf(di) : []) if (x.bucket === 'ISO_CALF' && x.calf_index === 0) { x.calf_alone = true; if (active(x)) sets[x.slot_id] = Math.max(sets[x.slot_id], S.default_sets.calves_first_when_alone || 3); }
    }
    roomWhys.push(why('why.room_cut', 'R3-SES-02', { exercise: (fills[victim.slot_id] && fills[victim.slot_id].exercise_id) || victim.bucket }));
    void lastRoomRule;
  };

  // ---- the time check (R3-SES-02, 12 v1.2 §3.10.1). Probes the week-1 fit (to the starts, floors first) and the peak week (to
  // the ceilings) inside the chosen minutes for a set K of directly trained groups; returns what each line reached.
  const trainableGroups = () => X.groups.filter(g => (X.linesOfGroup[g] || []).some(l => planLines.includes(l)) &&
    mainDi.some(di => daySlotsOf(di).some(s => (RESISTANCE_KINDS.includes(kindOf(s)) || ADDED_ORIGINS.includes(s.origin)) && (!isCircuitSlot(s) || !circuitOff.has(s.slot_id)) && fills[s.slot_id] && fills[s.slot_id].exercise_id && groupOfSlot(s) === g && primeOf(s).some(l => X.groupOfLine[l] === g))));
  const groupLines = (g) => (X.linesOfGroup[g] || []).filter(l => planLines.includes(l));
  const floorGroups = new Set((D9.floor_groups || []).filter(g => groupLines(g).some(l => floorLines.includes(l))));
  // groups that hold a template work lift ('the work', ORD-07) and cannot reach the floor even alone in the chosen minutes keep
  // their work lift and climb, listed as trained below the floor (time) - never removed (E-11, flagged for the coach)
  const relaxed = new Set();
  const workGroups = () => new Set(allSlots().filter(([s, di]) => isMainDi(di) && s.role === 'work' && fills[s.slot_id] && fills[s.slot_id].exercise_id).map(([s]) => groupOfSlot(s)).filter(Boolean));
  // a year plan's flat-sets stairway (Q1 'sets stay at the starting level', COACH-R2 R2-PER-01) holds its starts: no climb, the
  // ceiling is the start; it still gets the time check (floors, groups trained directly, warnings and offers - R3-SES-02)
  const shortBlock = !!(MC.short_block && isNum(tb.stair_N) && tb.stair_N <= MC.short_block.max_N);
  // a big mover kept below its floor (E-11, its work lift heavier by the week) climbs at least one set (v0.4 fix round 1, E-81)
  const climbOf = (g) => (flatSets ? 0 : g === 'calves' || relaxed.has(g) ? MC.calves : shortBlock ? MC.short_block.group : MC.group);
  const lineClimb = flatSets ? 0 : (MC.line || 1);
  // the line of a group that carries its floor and its climb (hips: hamstrings, or glutes as a Focus line)
  const carrierOfGroup = (g) => { const lines = groupLines(g); return lines.find(l => floorLines.includes(l)) || lines.find(l => prio.includes(l)) || lines[0]; };
  // a group's climb is read on group credit in quarter sets (helpers 0.25): half a set of rounding is allowed (INFERRED)
  const CLIMB_TOL = 0.5;
  // v0.4 fix round 1 (RECHECK 01 blocker: a swimmer kept the cheap shoulder-isolation group and lost quads - the profile's
  // 'rear_delts' priority mapped to the shoulders group and jumped every big mover): the client's Focus groups first, then the
  // sport's priority BIG movers (in the profile's order), then the approved big movers (hips, quads, back, chest), then the
  // sport's small priorities, then the rest (COACH-R3 R3-SES-02 'big movers first; arms, calves and rear delts only from
  // compound credit'; E-81)
  const groupIsBig = (g) => (X.linesOfGroup[g] || []).some(l => X.defs[l].class === 'big');
  // v0.4 fix round 2 / F1 (E-140; RECHECK v0.4 08 major / 03 major): the sport pins calves ahead of the big movers for racket players
  // 50+ (COACH-R3 R3-ATH-02 'calf and Achilles work every leg day'), and a field / court athlete keeps calves (one exercise x 3 sets a
  // leg day, R3-SES-01) before the shoulder isolation (R3-SES-02 step 2: shoulder isolation to compound credit first)
  const KO = (TF && TF.keep_order_r2) || null;
  const pinFirst = KO && KO.pin_first_50_racket && profile && profile.age_rules && profile.age_rules.age_50_plus && derived.age >= (KO.pin_first_50_racket.age_gte || 50) ? KO.pin_first_50_racket.groups : [];
  const athleteOrder = KO && KO.athletic && derived.D1_family === 'athletic' ? KO.athletic : null;
  // (E-144) every main day keeps the pattern its work lift names (not the class model: its class lifts stay anyway, E-64)
  const PATTERN_DAYS = !!(TF && TF.keep_day_patterns) && !(KWL && (KWL.families || []).includes(derived.D1_family));
  const keepOrder = () => {
    const out = [];
    const push = (g) => { if (g && !out.includes(g)) out.push(g); };
    for (const g of pinFirst) push(g);
    for (const l of prio) push(X.groupOfLine[l]);
    const profG = ((profile && profile.priority_muscles) || []).map(m => X.groupOfMuscle[m]).filter(Boolean);
    for (const g of profG) if (groupIsBig(g)) push(g);
    for (const g of (TF && TF.keep_order) || X.groups) if (groupIsBig(g)) push(g);
    for (const g of profG) push(g);
    for (const g of athleteOrder || (TF && TF.keep_order) || X.groups) push(g);
    for (const g of X.groups) push(g);
    return out;
  };
  const probe = (K, ws0, lastWS, startT, capT, mode = 'min') => {
    const keep = new Set(K);
    dropGroups.clear();
    for (const g of trainableGroups()) if (!keep.has(g)) dropGroups.add(g);
    for (const g of forced) dropGroups.add(g);
    for (const [s] of allSlots()) { const v = initialSets(s, ws0); if (v !== null) sets[s.slot_id] = v; }
    // v0.4 fix round 2 / F1 (E-138; RECHECK v0.4 01: with the climb on the main days the swimmer's quads crowded the back off its
    // floor and left the plan): a big mover kept below its floor (E-11) keeps its work lift's day only - the work lift and its
    // day's partner exercise (2-4 per group that day), climbing - and leaves its other days to the groups that hold their floor
    // (not in the class model: its groups train on the class days around their class lifts, E-64)
    for (const g of relaxed) {
      if (!keep.has(g) || (KWL && (KWL.families || []).includes(derived.D1_family))) continue;
      for (const di of mainDi) {
        const mine = daySlotsOf(di).filter(sl => placeable(sl) && !classLift(sl) && groupOfSlot(sl) === g && isNum(sets[sl.slot_id]) && sets[sl.slot_id] > 0);
        if (mine.length && !mine.some(sl => sl.role === 'work')) for (const sl of mine) sets[sl.slot_id] = 0;
      }
    }
    const zero = {}; for (const l of planLines) zero[l] = 0;
    curWS = ws0;
    // a day whose fixed work alone (warm-up, athletic and power blocks, conditioning, core, joint care, the aerobic add-on) fills
    // its minutes holds no lift: the lifts leave that day and their groups train on their other days (R3-SES-02 'never squeeze
    // 2-4 exercises per muscle into a day that can't hold them'); the plan does not fit and says so
    const fixedOver = new Set(), classOver = new Set();
    for (const ws of [ws0, lastWS]) {
      const save = curWS; curWS = ws;
      for (const di of mainDi) {
        const m2 = { ...sets };
        for (const sl of daySlotsOf(di)) if (placeable(sl) && isNum(m2[sl.slot_id])) m2[sl.slot_id] = 0;
        const withLift = estimate(di, m2, noSS ? false : 'eligible'); // E-64: the fixed work with the class lift a dropped group keeps
        for (const sl of daySlotsOf(di)) if (classLift(sl) && isNum(m2[sl.slot_id])) m2[sl.slot_id] = 0;
        if (estimate(di, m2, noSS ? false : 'eligible') > limitOf(di) + EPS) fixedOver.add(di);
        else if (withLift > limitOf(di) + EPS) classOver.add(di);
      }
      curWS = save;
    }
    // E-64: a class lift leaves a day whose fixed work alone fills it, or that cannot hold it next to its fixed work (the class's
    // warm-up, skill, Olympic piece and WOD; e.g. a 30-minute class) - the day says so through the time check
    for (const di of fixedOver) for (const sl of daySlotsOf(di)) if ((placeable(sl) || classLift(sl)) && isNum(sets[sl.slot_id])) sets[sl.slot_id] = 0;
    for (const di of classOver) for (const sl of daySlotsOf(di)) if (classLift(sl) && !placeable(sl) && isNum(sets[sl.slot_id])) sets[sl.slot_id] = 0;
    fit(zero, [], { reduce: false });
    // a day the kept groups' minimum structure overfills sheds stations of the lowest group in the keep order on that day - its
    // last accessory first, its work lift last (the group trains on its other days, or misses its floor) - week 1 and the peak
    // A group keeps 2-4 exercises on a day or leaves that day (R2-SES-05 / R3-SES-02: never one lone exercise squeezed in);
    // calves stay on every leg day (VOL-17), so a leg day that cannot hold them takes calves out of the plan (time).
    const lowFirst = keepOrder().slice().reverse();
    const timeFail = new Set();
    const rearLive = () => allSlots().some(([x, di]) => isMainDi(di) && isRearSlot(x) && active(x));
    const rearBefore = rearLive();
    for (const ws of [ws0, lastWS]) {
      const save = curWS; curWS = ws;
      for (const di of mainDi) {
        for (let guard = 0; guard < 40 && estimate(di, sets, noSS ? false : 'eligible') > limitOf(di) + EPS; guard++) {
          const st = (gg) => daySlotsOf(di).filter(sl => active(sl) && placeable(sl) && groupOfSlot(sl) === gg);
          // v0.4 fix round 1 (RECHECK 01 blocker / 02 major: full-body athlete days trained every group every day, so a kept big
          // mover found no room): a group that still trains on 2+ other main days leaves this day first (its frequency stays at
          // 2+, the coach's A / B days: knee + pull, hip + push - OBSERVED BYOP ATHLETIC, COACH-R3 R3-SES-01), then the lowest
          // group in the keep order (E-82)
          const daysOf = (gg) => mainDi.filter(o => o !== di && daySlotsOf(o).filter(sl => active(sl) && placeable(sl) && groupOfSlot(sl) === gg).length >= 2).length;
          // (fix round 2 / F1, E-144; RECHECK v0.4 08 blocker: the knee day lost its squat pattern to a second hinge day): the group
          // whose work lift names the day leaves it last - the day keeps its pattern (A = knee + pull, B = hip + push; UNI-11, ORD-06)
          const g = lowFirst.filter(gg => keep.has(gg) && st(gg).length && gg !== 'calves' && daysOf(gg) >= 2 && !st(gg).some(sl => sl.role === 'work'))[0] ||
            lowFirst.find(gg => keep.has(gg) && st(gg).length && !st(gg).some(sl => sl.role === 'work')) ||
            lowFirst.find(gg => keep.has(gg) && st(gg).length);
          if (!g) break;
          const list = st(g);
          if (g === 'calves') { timeFail.add('calves'); for (const sl of list) sets[sl.slot_id] = 0; continue; }
          if (list.length <= 2 && !S.exercises_per_group.exempt_groups.includes(g)) { for (const sl of list) sets[sl.slot_id] = 0; continue; }
          const victim = list.filter(sl => sl.role !== 'work' && !isRearSlot(sl)).pop() || list.filter(sl => sl.role !== 'work').pop() || list.pop();
          sets[victim.slot_id] = 0;
        }
      }
      curWS = save;
    }
    // the week keeps a rear-delt station while shoulders are trained (R3-VOL-01 / R2-VOL-04)
    if (rearBefore && !rearLive() && keep.has('shoulders')) timeFail.add('shoulders');
    const minPlaced = haveAll(true);
    // 'full': week 1 at the level starts; 'min': the minimum plan - floors on the floored lines, the structure elsewhere (12 v1.2
    // §3.10.1 'try every group at its minimum plan, start at the floor')
    peakGuard = lastWS;
    if (mode === 'full') fit(startT, floorLines, { priorityFirst: true, reduce: false });
    else { const fl = {}; const flL = floorLines.filter(l => !relaxed.has(X.groupOfLine[l])); for (const l of planLines) fl[l] = flL.includes(l) ? floorFor(l) : 0; fit(fl, flL, { priorityFirst: true, reduce: false, addOnly: true }); }
    peakGuard = null;
    const w1 = haveAll(true), w1All = haveAll(false), w1G = tally(true, 'group'), w1GAll = tally(false, 'group');
    // v0.4 fix round 2 / F1 (E-135): the climb is read where the stairway is placed - the main days and the exercises the plan may add on
    // an optional day (a Focus line's slots, a small line's bonus) - never the optional day's fixed template slots
    const w1S = haveAll(stairMode), w1GS = tally(stairMode, 'group');
    void w1All; void w1GAll;
    // a day whose minimum structure (the kept groups' stations at their minimum sets, with the day's fixed blocks) already runs
    // past the minutes cannot hold those groups (R3-SES-02 'never squeeze 2-4 exercises per muscle into a day that can't hold
    // them'): every kept group with a station that day fails on time
    const overDays = (ws) => { const save = curWS; curWS = ws; const o = mainDi.filter(di => estimate(di, sets, noSS ? false : 'eligible') > limitOf(di) + EPS); curWS = save; return o; };
    const blame = (dis) => { for (const di of dis) for (const s of daySlotsOf(di)) if (active(s) && placeable(s)) { const g = groupOfSlot(s); if (g && keep.has(g)) timeFail.add(g); } };
    blame(overDays(ws0));
    const sn1 = snapshot();
    curWS = lastWS; probing = true;
    for (const [sl] of allSlots()) if (sl.bucket === 'AP_TRIPLE_EXT' && active(sl)) { const per = olySets(sl, lastWS); if (isNum(per)) sets[sl.slot_id] = per; }
    // pass A: every kept group's minimum climb first, shared fairly (the carrier line of each group takes it); pass B: the rest
    // of the room toward the ceilings, Focus and sport priorities first
    // (fix round 2 / F1, E-140: the minimum climbs are placed in the keep order - a pinned or higher group gets its climb before a
    // lower one takes the room, R3-SES-02 step 2)
    const climbT = {};
    for (const g of keepOrder().filter(x => K.includes(x))) {
      if (dropGroups.has(g)) continue;
      const lines = groupLines(g);
      if (!lines.length) continue;
      const carrier = daysFor(carrierOfGroup(g)).length ? carrierOfGroup(g) : (lines.find(l => daysFor(l).length) || lines[0]);
      for (const l of lines) climbT[l] = (w1S[l] || 0) + (l === carrier ? climbOf(g) : 0);
      fit(climbT, [], { reduce: false, addOnly: true, exact: true });
    }
    fit(capT, floorLines, { priorityFirst: true, reduce: false, addOnly: true, exact: true });
    const pk = haveAll(true), pkAll = haveAll(false), pkG = tally(false, 'group'), pkS = haveAll(stairMode), pkGS = tally(stairMode, 'group');
    probing = false;
    blame(overDays(lastWS));
    curWS = ws0;
    const fail = [];
    for (const g of K) {
      if (dropGroups.has(g)) continue;
      const lines = groupLines(g);
      if (!lines.length) continue;
      if (timeFail.has(g)) { fail.push({ g, why: 'time' }); continue; }
      // the full plan starts each line at its level start: its carrier must still climb from there (not from a week 1 that sits
      // up to a set below the start)
      if (mode === 'full') { const cl = carrierOfGroup(g); if (cl && (pkS[cl] || 0) - Math.max(w1S[cl] || 0, startT[cl] || 0) < climbOf(g) - CLIMB_TOL - EPS) { fail.push({ g, why: 'climb' }); continue; } }
      if (floorGroups.has(g) && !relaxed.has(g) && ((g === 'calves' && CALF_OPT ? w1GS : w1G)[g] || 0) < groupFloorFor(g) - EPS) { fail.push({ g, why: 'floor' }); continue; }
      if ((pkGS[g] || 0) - (w1GS[g] || 0) < climbOf(g) - CLIMB_TOL - EPS) fail.push({ g, why: 'climb' });
    }
    const snP = snapshot();
    if (globalThis.__BC_DBG) { // DEBUG-TC
      const save = curWS; curWS = lastWS; // DEBUG-TC
      console.error('PROBE K=' + JSON.stringify(K) + ' relaxed=' + JSON.stringify([...relaxed]) + ' mode=' + mode + ' fail=' + JSON.stringify(fail)); // DEBUG-TC
      for (const di of mainDi) console.error('  day', days[di].weekday, Math.round(estimate(di, sets, noSS ? false : 'eligible')), '/', limitOf(di), daySlotsOf(di).filter(s => active(s) && placeable(s)).map(s => s.bucket + ':' + sets[s.slot_id]).join(' ')); // DEBUG-TC
      console.error('  w1G', JSON.stringify(w1GS), 'pkG', JSON.stringify(pkGS)); // DEBUG-TC
      curWS = save; // DEBUG-TC
    } // DEBUG-TC
    return { fail, minPlaced, w1, w1S, w1All, w1G, pk, pkAll, pkG, pkS, sn1, snP, fixedOver: fixedOver.size };
  };
  // the minutes the full plan's peak week needs (no time limit, every eligible pair supersetted) - the 'longer sessions' offer
  const peakNeed = (ws0, lastWS, startT, capT) => {
    dropGroups.clear(); // the full plan: every group (the offer sizes what one more day or longer sessions would hold)
    for (const [s] of allSlots()) { const v = initialSets(s, ws0); if (v !== null) sets[s.slot_id] = v; }
    curWS = ws0;
    const zero = {}; for (const l of planLines) zero[l] = 0;
    probing = 'unlimited';
    fit(zero, [], { reduce: false });
    fit(startT, floorLines, { priorityFirst: true, reduce: false });
    curWS = lastWS;
    for (const [sl] of allSlots()) if (sl.bucket === 'AP_TRIPLE_EXT' && active(sl)) { const per = olySets(sl, lastWS); if (isNum(per)) sets[sl.slot_id] = per; }
    fit(capT, floorLines, { priorityFirst: true, reduce: false, addOnly: true });
    const mins = mainDi.map(di => estimate(di, sets, 'eligible'));
    probing = false; curWS = ws0;
    return { max: mins.length ? Math.max(...mins) : 0, total: mins.reduce((a, b) => a + b, 0) };
  };
  const timeCheck = (ws0) => {
    const N = tb.stair_N;
    const lastWS = wks[wks.length - 1];
    const startT = {}, capT = {};
    for (const l of planLines) { startT[l] = bt0.start[l]; capT[l] = flatSets ? bt0.start[l] : bt0.cap[l]; }
    structureCut(startT, ws0);
    const base = snapshot();
    const out = { fits: true, kept: [], dropped: [], lowered: [], start: { ...startT }, cap: { ...capT }, need: null, roomCuts: 0 };
    void N;
    // 0. the full plan inside the chosen days x minutes
    const all = trainableGroups().filter(g => !forced.has(g));
    let r = probe(all, ws0, lastWS, startT, capT, 'full');
    const reaches = (rr) => planLines.every(l => (dropGroups.has(X.groupOfLine[l])) || ((rr.w1[l] || 0) >= startT[l] - P.week1_fit.add_below - EPS && (rr.pkS[l] || 0) >= capT[l] - R.stairway.release.threshold - EPS));
    if (!r.fail.length && reaches(r) && !forced.size && !r.fixedOver) { restore(base); out.kept = all; return finishCheck(out, r, startT, capT, base); }
    out.fits = false;
    restore(base);
    r = probe(all, ws0, lastWS, startT, capT, 'min');
    // 1. the offers: the full plan's peak minutes (no limit, supersets on); one more day spreads the same work
    restore(base);
    out.need = peakNeed(ws0, lastWS, startT, capT);
    restore(base);
    // 2a. keep every group when they all hold their minimums (lower peaks); room cuts that keep every group go first
    for (let guard = 0; guard < 12 && r.fail.length; guard++) {
      restore(base);
      const cut = nextRoomCut();
      if (!cut) break;
      applyRoomCut(cut);
      const sn = snapshot();
      r = probe(all, ws0, lastWS, startT, capT);
      Object.assign(base, sn); // the cut stays
      out.roomCuts++;
    }
    if (!r.fail.length) { out.kept = all; restore(base); return finishCheck(out, r, startT, capT, base); }
    // 2b. keep the time: fewer groups trained directly, built in the keep order (a group stays only if every kept group still
    // holds its floor and climbs)
    const order = keepOrder().filter(g => all.includes(g));
    const wg = workGroups();
    let K = [];
    let best = null;
    // pass 1: groups that hold their floor and climb, in the keep order (R3-SES-02 step 2: fewer groups trained directly
    // instead of dropping below the floor on everything)
    // v0.4 fix round 1 (E-81; RECHECK 04 blocker: the class kept back and chest with bodybuilding accessories while quads and hips
    // got only their class lift): a big mover that holds the day's work lift and misses only its own floor is kept below the floor
    // (still climbing, E-11) in its keep-order place - before the groups after it are tried
    const isBig0 = (g) => groupLines(g).length && lineDef(groupLines(g)[0]).class === 'big';
    const wg0 = workGroups();
    for (const g of order) {
      restore(base);
      let rr = probe([...K, g], ws0, lastWS, startT, capT);
      // (fix round 2 / F1, E-138: a relaxed big mover keeps only its work lift's day, so it is tried whenever its own miss is the
      // floor - the groups it crowded may hold theirs once its other days are free)
      if (rr.fail.length && isBig0(g) && wg0.has(g) && rr.fail.some(f => f.g === g && f.why === 'floor') && rr.fail.every(f => f.g !== g || f.why === 'floor')) {
        relaxed.add(g);
        restore(base);
        rr = probe([...K, g], ws0, lastWS, startT, capT);
        if (rr.fail.length) relaxed.delete(g);
      }
      // v0.4 fix round 1 (E-82): a group whose stations crowd a kept group's day (the kept group loses its floor or climb) tries
      // again without its stations on those days, when it keeps 2+ exercises on another main day (04: chest moves off the deadlift
      // day and trains on the press day; the hips keep their climb)
      if (rr.fail.length && rr.fail.some(f => f.g !== g)) {
        const failing = new Set(rr.fail.filter(f => f.g !== g).map(f => f.g));
        const mineOn = (di) => daySlotsOf(di).filter(sl => (placeable(sl) || isDropped(sl)) && !classLift(sl) && groupOfSlot(sl) === g && fills[sl.slot_id] && fills[sl.slot_id].exercise_id && !roomCut.has(sl.slot_id));
        const contested = mainDi.filter(di => mineOn(di).length && daySlotsOf(di).some(sl => failing.has(groupOfSlot(sl)) && (placeable(sl) || isDropped(sl)) && fills[sl.slot_id] && fills[sl.slot_id].exercise_id));
        const other = mainDi.filter(di => !contested.includes(di) && mineOn(di).length >= 2);
        if (contested.length && other.length) {
          const shed = contested.flatMap(di => mineOn(di).map(sl => sl.slot_id));
          for (const id of shed) roomCut.add(id);
          restore(base);
          const r2 = probe([...K, g], ws0, lastWS, startT, capT);
          if (!r2.fail.length) { rr = r2; for (const id of shed) base.sets[id] = 0; }
          else for (const id of shed) roomCut.delete(id);
        }
      }
      if (!rr.fail.length) { K = [...K, g]; best = rr; }
    }
    // pass 2 (E-11): a big mover that holds the day's work lift and misses only its own floor stays, below the floor and still
    // climbing, when it does not cost a kept big mover its floor or its climb; big movers come first (R3-SES-02 'big movers
    // first; arms, calves and rear delts only from compound credit'), so a kept small group (shoulders, arms, calves) may give
    // way to it and is then tried again
    const isBig = (g) => lineDef(groupLines(g)[0]).class === 'big';
    for (const g of order) {
      if (K.includes(g) || !wg.has(g) || !isBig(g)) continue;
      restore(base);
      // (fix round 2 / F1, E-140: a group the sport pins first - racket players' calves, R3-ATH-02 - never gives way to a big mover)
      const alone = probe([...K.filter(x => isBig(x) || pinFirst.includes(x)), g], ws0, lastWS, startT, capT);
      if (!alone.fail.every(f => f.g === g && f.why === 'floor')) continue;
      relaxed.add(g);
      let kept = null;
      for (const cand of [[...K, g], [...K.filter(x => isBig(x) || pinFirst.includes(x)), g]]) {
        restore(base);
        const r2 = probe(cand, ws0, lastWS, startT, capT);
        if (!r2.fail.length) { kept = { K: order.filter(x => cand.includes(x)), r: r2 }; break; }
      }
      if (!kept) { relaxed.delete(g); continue; }
      K = kept.K; best = kept.r;
      for (const s2 of order) {
        if (K.includes(s2) || isBig(s2)) continue;
        restore(base);
        const r3 = probe([...K, s2], ws0, lastWS, startT, capT);
        if (!r3.fail.length) { K = order.filter(x => K.includes(x) || x === s2); best = r3; }
      }
    }
    // pass 3 (fix round 2 / F1, E-144; RECHECK v0.4 08 blocker: the 2 x 45 knee + pull day became a second hinge day): a main day whose
    // work lift names a big mover the passes left out keeps that pattern - the big mover comes back below its floor on its work lift's
    // day (E-11, climbing) and the kept groups' other stations leave that day (a kept group that then misses its floor stays below it
    // on its own work day); the day holds its pattern (A = knee + pull, B = hip + push; UNI-11, ORD-06, BRAIN 10.7)
    if (PATTERN_DAYS) for (const g of order) {
      if (K.includes(g) || !isBig(g) || !wg.has(g)) continue;
      const workDays = mainDi.filter(di => daySlotsOf(di).some(sl => sl.role === 'work' && groupOfSlot(sl) === g && fills[sl.slot_id] && fills[sl.slot_id].exercise_id && !classLift(sl) && !roomCut.has(sl.slot_id)));
      if (!workDays.length) continue;
      const shed = workDays.flatMap(di => daySlotsOf(di).filter(sl => (placeable(sl) || isDropped(sl)) && sl.role !== 'work' && !roomCut.has(sl.slot_id) && K.includes(groupOfSlot(sl)) && groupOfSlot(sl) !== g && groupOfSlot(sl) !== 'calves' && !pinFirst.includes(groupOfSlot(sl))).map(sl => sl.slot_id));
      const relaxBefore = new Set(relaxed);
      for (const id of shed) roomCut.add(id);
      relaxed.add(g);
      let ok = null;
      for (let guard = 0; guard < 3 && !ok; guard++) {
        restore(base);
        const r4 = probe([...K, g], ws0, lastWS, startT, capT);
        if (!r4.fail.length) { ok = r4; break; }
        const fl = r4.fail.filter(f => f.why === 'floor' && wg.has(f.g) && isBig(f.g) && !relaxed.has(f.g));
        if (!fl.length) break;
        for (const f of fl) relaxed.add(f.g);
      }
      if (ok) { K = order.filter(x => K.includes(x) || x === g); best = ok; for (const id of shed) base.sets[id] = 0; }
      else { for (const id of shed) roomCut.delete(id); relaxed.clear(); for (const x of relaxBefore) relaxed.add(x); }
    }
    restore(base);
    if (!best) best = probe(K, ws0, lastWS, startT, capT);
    restore(base);
    out.kept = K;
    out.below_floor = [...relaxed];
    out.dropped = all.filter(g => !K.includes(g));
    for (const g of out.dropped) dropGroups.add(g);
    return finishCheck(out, best, startT, capT, base);
  };
  // the targets of the kept lines: week 1 starts where the time holds it (never below the structure or the floor), the ceiling is
  // what the peak week holds (two passes: the stairway is re-solved so each line lands on what it reaches, 12 v1.2 §3.10.1)
  const finishCheck = (out, r, startT, capT, base) => {
    restore(base);
    dropGroups.clear();
    for (const g of forced) dropGroups.add(g);
    for (const g of out.dropped) dropGroups.add(g);
    for (const g of forced) if (!out.dropped.includes(g)) out.dropped.push(g);
    const start2 = { ...bt0.start }, cap2 = { ...bt0.cap };
    const trainable0 = new Set(trainableGroups());
    for (const l of planLines) {
      const g = X.groupOfLine[l];
      if (dropGroups.has(g) || !trainable0.has(g)) continue; // a group with no main-day station keeps its level targets (never 0 / 0)
      // v0.4 fix round 1: the ceiling is what the peak holds on the days the stairway is placed on (the main days + the exercises
      // added on an optional day) - never the optional day's template slots, which keep their own sets (ORD-10)
      const w1 = (r.w1S || r.w1)[l] || 0, pk = (r.pkS || r.pkAll)[l] || 0;
      const structure = Math.floor((r.minPlaced[l] || 0) + EPS);
      // the stairway starts from the week-1 sets when the structure already holds more than the table start (12 v1.2 §3.7.1)
      let st, c;
      if (out.fits) {
        st = Math.max(bt0.start[l], Math.floor(w1 + EPS));
        c = flatSets ? st : Math.max(bt0.cap[l], st + lineClimb);
        // v0.4 fix round 1 (E-92; random sweep: back 10 -> 12 by week 5, then held 8 weeks under a ceiling of 13 the peak never
        // held): the ceiling is what the peak allocation P holds when that is below the level's - the planned steps then spread to it
        const pkW = Math.floor(pk + EPS), climbL = carrierOfGroup(g) === l ? climbOf(g) : lineClimb;
        if (!flatSets && pkW >= st + climbL && pkW < c) { c = pkW; out.lowered.push(l); }
      } else {
        // keep-time plan (12 v1.2 §3.10.1 step 4, two passes): the ceiling is what the peak week holds; the start is sized so the
        // planned steps (3 % / 5 %) land on it (never above the level start, never below the minimum plan's week 1), keeping the
        // group's climb (the carrier line 2 sets, calves 1, another line of a two-line group 1)
        const climb = carrierOfGroup(g) === l ? climbOf(g) : lineClimb;
        const pkW = Math.floor(pk + EPS);
        const lo = Math.max(structure, Math.floor(w1 + EPS));
        const g1 = plannedGrowth(l, bt0, tb, derived, model);
        st = Math.min(bt0.start[l], Math.max(lo, Math.floor(pkW / g1 + EPS)));
        st = Math.max(lo, Math.min(st, pkW - climb));
        c = flatSets ? st : Math.max(st, Math.min(Math.max(bt0.cap[l], st + climb), pkW));
        if (st < bt0.start[l] || (!flatSets && c < bt0.cap[l])) out.lowered.push(l);
      }
      start2[l] = st; cap2[l] = Math.max(c, st);
      if (globalThis.__BC_RETRY && l === 'hamstrings') console.error('  FINISH', l, 'fits', out.fits, 'w1', w1, 'pk', pk, 'structure', structure, 'bt0', bt0.start[l] + '->' + bt0.cap[l], '=> start', st, 'cap', cap2[l]);
    }
    for (const [l, k] of Object.entries(adj.capCut || {})) {
      if (!planLines.includes(l) || dropGroups.has(X.groupOfLine[l])) continue;
      const need = carrierOfGroup(X.groupOfLine[l]) === l ? climbOf(X.groupOfLine[l]) : lineClimb;
      const c = Math.max(start2[l] + need, cap2[l] - k);
      if (c < cap2[l]) { cap2[l] = c; if (!out.lowered.includes(l)) out.lowered.push(l); }
    }
    out.start = start2; out.cap = cap2;
    out.snW1 = r.sn1; out.snP = r.snP;
    return out;
  };

  // ---- timed circuits (bootcamp, PRG-03): rounds are fixed by the minutes, so the floor is held by the stations themselves
  // (v0.4, review 05: circuits are not floor exempt). A small group short of its floor leaves the circuit - not trained directly
  // (time), its compound credit stays (R3-SES-02 step 2: arms, calves, shoulder isolation first); a big group short of its floor
  // takes a station from a group with room above its own floor; the week keeps a rear-delt station (R3-VOL-01). Same station
  // count, same minutes.
  const circuitOff = new Set();
  const circuitBelow = new Set(); // v0.4 fix round 1: big groups a circuit holds below the floor (no donor station)
  const circuitTime = { dropped: [], swapped: [] };
  const MAIN_BUCKET = { quads: 'RP_UKD', hips: 'RP_BHD', back: 'RP_HPULL', chest: 'RP_HPUSH' };
  const circuitRebalance = (ws0, whys) => {
    const live = () => allSlots().filter(([s, di]) => isMainDi(di) && isCircuitSlot(s) && active(s) && !circuitOff.has(s.slot_id));
    const gcr = () => tally(true, 'group');
    const legDays = () => mainDi.filter(di => daySlotsOf(di).some(s => isCircuitSlot(s) && active(s) && !circuitOff.has(s.slot_id) && s.bucket === 'ISO_CALF')).length;
    const need = (g) => (g === 'calves' ? V.calves.per_leg_day[L] * legDays() : floorV);
    const swapIn = (donor, di, g, bucket, variant, focusMuscle) => {
      const tag = (days[di].day_type || 'day') + '.c' + donor.station_id.replace(/[^0-9a-z]/gi, '').slice(-4);
      const slot = { ...donor, slot_id: days[di].weekday + '.' + tag, station_id: tag, bucket, variant: variant || null, group: g, role: donor.role, origin: 'circuit_swap', focus_muscle: focusMuscle, replaces: donor.slot_id,
        superset: null, superset_eligible: null, pair: null, time_class: model.bucket(bucket).time_class || donor.time_class, why: [why('why.circuit_station_swap', 'R3-SES-02', { group: g })] };
      if (typeof fillSlot !== 'function') return false;
      const f = fillSlot(slot, curWeekN);
      if (!f || !f.exercise_id) return false;
      fills[slot.slot_id] = f;
      const lines = groupLines(g);
      if (!primeOf(slot).some(l => lines.includes(l))) { delete fills[slot.slot_id]; return false; }
      days[di].added.push(slot); added.push(slot);
      sets[slot.slot_id] = sets[donor.slot_id]; sets[donor.slot_id] = 0; circuitOff.add(donor.slot_id);
      circuitTime.swapped.push({ from: fills[donor.slot_id] && fills[donor.slot_id].exercise_id, to: f.exercise_id, group: g });
      return true;
    };
    // 0. the minutes (v0.4, R3-SES-02): every circuit day must hold its peak week (the block's most rounds and longest work
    // seconds) inside the chosen minutes; while a day runs over, the lowest group in the keep order with a station that day
    // leaves the circuit (not trained directly, time) - arms first, then calves, shoulders, chest, back, quads, hips
    const tt = trimToTime(whys, { circuit: true, report: false });
    if (tt.over0) circuitTime.need = tt.need;
    circuitTime.dropped.push(...tt.dropped);
    circuitTime.over = tt.over;
    // 1. small groups short of their floor leave (keep order reversed: biceps, triceps, then shoulders isolation, calves keep 3 a leg day)
    for (const g of ['biceps', 'triceps', 'shoulders']) {
      if (!floorGroups.has(g) || prio.some(l => X.groupOfLine[l] === g)) continue;
      if ((gcr()[g] || 0) >= need(g) - EPS) continue;
      if (!live().some(([s]) => groupOfSlot(s) === g)) continue;
      dropGroups.add(g); circuitTime.dropped.push(g);
      for (const [s] of live()) if (groupOfSlot(s) === g) { sets[s.slot_id] = 0; circuitOff.add(s.slot_id); }
      whys.push(why('why.group_not_trained', 'R3-SES-02', { group: g }));
    }
    // 2. big groups short of the floor take a station from the group with the most room above its own floor
    // v0.4 fix round 1 (RECHECK 05 blocker: Wednesday's 'hinge + presses' lost its hinge to a third push-up, labelled '(bonus)'): a
    // donor is never a day's lead station (its first resistance station - the pattern the day is named for), its room is read on
    // DIRECT sets (stations whose main mover is the group, not helper credit), week duplicates (the same exercise on two days) go
    // first; the swap is never labelled a bonus (origin 'circuit_swap') and sits where the donor was. No donor: the group keeps its
    // stations below the floor and the plan says so (trained_below_floor, reason 'circuit_time') - never its day's lead lift traded
    const directSets = () => {
      const w = {};
      for (const [s] of live()) { const g2 = groupOfSlot(s); const cr = groupCredits(model, crOf(s) || {}); if (g2 && (cr[g2] || 0) >= 1 - EPS) w[g2] = (w[g2] || 0) + sets[s.slot_id]; }
      return w;
    };
    const leadOf = (di) => daySlotsOf(di).find(s => isCircuitSlot(s) && active(s) && !circuitOff.has(s.slot_id) && RESISTANCE_KINDS.includes(kindOf(s)));
    const dupe = (s) => { const id = fills[s.slot_id] && fills[s.slot_id].exercise_id; return !!id && live().some(([x]) => x !== s && fills[x.slot_id] && fills[x.slot_id].exercise_id === id); };
    for (const g of ['hips', 'quads', 'back', 'chest']) {
      if (!floorGroups.has(g) || dropGroups.has(g)) continue;
      for (let guard = 0; guard < 4 && (gcr()[g] || 0) < need(g) - EPS; guard++) {
        const ds = directSets();
        const donors = live().filter(([s, di]) => { const g2 = groupOfSlot(s); return g2 && g2 !== g && g2 !== 'calves' && s.role !== 'work' && leadOf(di) !== s && (ds[g2] || 0) - sets[s.slot_id] >= need(g2) - EPS; })
          .map(([s, di]) => ({ s, di, dupe: dupe(s) ? 0 : 1, room: (ds[groupOfSlot(s)] || 0) - need(groupOfSlot(s)) }))
          .sort((a, b) => a.dupe - b.dupe || b.room - a.room || b.di - a.di);
        let ok = false;
        for (const d of donors) if (swapIn(d.s, d.di, g, MAIN_BUCKET[g], null, null)) { ok = true; break; }
        if (!ok) break;
      }
      if ((gcr()[g] || 0) < need(g) - EPS && live().some(([s]) => groupOfSlot(s) === g)) circuitBelow.add(g);
    }
    // 3. (v0.4 fix round 1, RECHECK 05 major) the forced rear-delt swap retired: rear delts are part of the shoulders group and get
    // their work from the rows (COACH-R3 R3-VOL-01); the template's side raise (the coach's 'ABdution' slot) stays
    // groups still short (no donor): leave as well, with the offer of more time (they are not trained directly)
    for (const g of X.groups) {
      if (!floorGroups.has(g) || dropGroups.has(g) || g === 'calves' || circuitBelow.has(g)) continue;
      if ((gcr()[g] || 0) < need(g) - EPS && live().some(([s]) => groupOfSlot(s) === g)) {
        dropGroups.add(g); circuitTime.dropped.push(g);
        for (const [s] of live()) if (groupOfSlot(s) === g) { sets[s.slot_id] = 0; circuitOff.add(s.slot_id); }
      }
    }
    if (circuitTime.dropped.length || circuitTime.swapped.length || circuitTime.over || circuitBelow.size) timeResult = { fits: false, kept: X.groups.filter(g => !dropGroups.has(g)), dropped: circuitTime.dropped.slice(), lowered: [], start: bt0.start, cap: bt0.cap, need: circuitTime.need || null, circuit: true };
    else timeResult = { fits: true, kept: X.groups.filter(g => !dropGroups.has(g)), dropped: [], lowered: [], start: bt0.start, cap: bt0.cap, need: null, circuit: true };
  };

  // ---- the minutes of a block's days (R3-SES-02, v0.4). While a main day runs past its minutes (supersets allowed; a timed
  // circuit at its peak week - the block's most rounds and longest work seconds), the lowest group in the keep order with a
  // station that day leaves the block (not trained directly, time). Used by timed circuits (before their floors) and by the
  // non-stairway blocks (maintenance, in-season, pre-season; floor exempt), which also tell the client and offer more time.
  const trimToTime = (whys, opts = {}) => {
    const lastWS = wks[wks.length - 1];
    const estOf = (di) => {
      if (!opts.circuit) return estimate(di, sets, noSS ? false : 'eligible');
      const m2 = { ...sets };
      for (const sl of daySlotsOf(di)) if (isCircuitSlot(sl) && active(sl) && lastWS && lastWS.circuit) m2[sl.slot_id] = lastWS.circuit.rounds;
      const save = curWS; curWS = lastWS || curWS;
      const t = estimate(di, m2, false);
      curWS = save;
      return t;
    };
    const station = (sl) => active(sl) && (opts.circuit ? isCircuitSlot(sl) && !circuitOff.has(sl.slot_id) && !isDropped(sl) : placeable(sl) && !classLift(sl));
    const over = () => mainDi.filter(di => estOf(di) > limitOf(di) + EPS);
    const out = { over0: false, over: false, dropped: [], need: null };
    if (!over().length) return out;
    out.over0 = true;
    const full = mainDi.map(estOf);
    out.need = { max: Math.max(...full), total: full.reduce((a, b) => a + b, 0) };
    const order = keepOrder().slice().reverse();
    for (let guard = 0; guard < X.groups.length; guard++) {
      const od = over();
      if (!od.length) break;
      const g = order.find(gg => !dropGroups.has(gg) && od.some(di => daySlotsOf(di).some(sl => station(sl) && groupOfSlot(sl) === gg)));
      if (!g) break;
      for (const [sl] of allSlots()) if (station(sl) && groupOfSlot(sl) === g) { sets[sl.slot_id] = 0; if (opts.circuit) circuitOff.add(sl.slot_id); }
      dropGroups.add(g); out.dropped.push(g);
      whys.push(why('why.group_not_trained', 'R3-SES-02', { group: g }));
    }
    // E-64: a class lift that a day still cannot hold after the groups left it leaves too (a 30-minute class)
    if (!opts.circuit) for (const di of over()) for (const sl of daySlotsOf(di)) if (classLift(sl) && active(sl) && !placeable(sl)) sets[sl.slot_id] = 0;
    out.over = over().length > 0;
    if (!opts.circuit && !noSS) days.forEach((d, di) => { if (isMainDi(di) && estimate(di, sets, ssMode(di, ss[d.weekday])) > limitOf(di) + EPS) { ss[d.weekday] = true; ssNeeded.add(d.weekday); } });
    if (opts.report === false) return out;
    warnings.push({ code: 'time_check', key: 'warning.time_check', args: { days: derived.days_per_week, minutes: derived.session_minutes } });
    if (out.dropped.length) warnings.push({ code: 'not_trained_directly', key: 'warning.not_trained_directly', args: { group: X.groups.filter(g => out.dropped.includes(g)) } });
    const r5 = (x) => Math.ceil((x - EPS) / ((TF && TF.round_minutes_to) || 5)) * ((TF && TF.round_minutes_to) || 5);
    const competitive = derived.D2_profile && derived.D2_profile.competitive === 'competitive';
    const maxMin = Math.max(...S.minutes_allowed.filter(x => competitive || !S.minutes_over_90_competitive_only || x <= 90));
    const mains = Math.max(1, mainDi.length);
    const longer = r5(out.need.max);
    if (derived.days_per_week < 6) {
      const m = Math.max(derived.session_minutes, r5(out.need.total / (mains + 1)));
      offers.push(m > derived.session_minutes ? { key: 'offer.more_days_min', args: { days: derived.days_per_week + 1, min: m } } : { key: 'offer.more_days', args: { days: derived.days_per_week + 1 } });
    }
    if (longer > derived.session_minutes && longer <= maxMin) offers.push({ key: 'offer.longer_sessions', args: { min: longer } });
    offers.push({ key: out.dropped.length ? 'offer.keep_time' : 'offer.keep_time_lower_peak', args: { days: derived.days_per_week, minutes: derived.session_minutes }, chosen: true });
    return out;
  };

  // ---- v0.4 fix round 1 (E-94; RECHECK 08 blocker: a racket player trained only hamstrings and calves for 12 weeks - no row, no
  // press, no knee station; RECHECK 01: a swimmer with no horizontal push): a big mover the time check leaves untrained directly
  // keeps its movement pattern on the optional day - one exercise at fixed sets (no stairway, not counted toward the floor), the keep
  // order first (rules.volume.pattern_keep; BRAIN 10.7 'every primary pattern at least once'; COACH-R3 R3-SES-02 'they should be able
  // to get things done'). Main days are not touched: the time check's answer for them stands.
  const PK = V.pattern_keep || null;
  const addPatternKept = () => {
    if (!PK || circuitPlan || typeof fillSlot !== 'function') return;
    const opts = days.map((d, di) => di).filter(di => days[di].kind === 'optional' && days[di].slots.some(s => ['core', ...RESISTANCE_KINDS].includes(kindOf(s))));
    // the pull first, then the push, then the legs (RECHECK 08 'a row, a rear-delt / face-pull station and a push'; R3-ATH-02 racket
    // players: rotator cuff and pulling), in rules.volume.pattern_keep.order
    const want = (PK.order || keepOrder()).filter(g => dropGroups.has(g) && PK.buckets[g]);
    const lastWS = wks[wks.length - 1];
    // v0.4 fix round 2 / F1 (E-145; RECHECK v0.4 08 blocker 'knee work lift + row on day A, hinge + press on day B', 01 major 'the hip +
    // push day has no push'): the pattern station sits on the main day whose work lift it pairs with in the template (UNI-11 / ORD-06
    // knee + pull, hip + push) as a superset with that lift, when the day holds it at week 1 and at the block's peak; else on the
    // optional day (E-94)
    const fitsBoth = (di) => {
      const t1 = timeOkAt(di, sets);
      if (!t1.ok) return null;
      if (!pSets || !lastWS) return t1;
      const save = curWS; curWS = lastWS;
      const m3 = { ...sets, ...pSets };
      for (const sl of daySlotsOf(di)) if (sl.bucket === 'AP_TRIPLE_EXT' && isNum(m3[sl.slot_id]) && m3[sl.slot_id] > 0) { const per = olySets(sl, lastWS); if (isNum(per)) m3[sl.slot_id] = per; }
      const t2 = timeOkAt(di, m3);
      curWS = save;
      return t2.ok ? { ok: true, ssOn: t1.ssOn || t2.ssOn } : null;
    };
    const partnerOn = (di, bucket) => {
      for (const w of daySlotsOf(di)) {
        if (w.role !== 'work' || !active(w) || !w.pair) continue;
        const p = daySlotsOf(di).find(x => x !== w && x.pair === w.pair && x.bucket === bucket && !active(x));
        if (p) return { w, p };
      }
      return null;
    };
    let k = 0;
    for (const g of want) {
      if (k >= (PK.max_per_week || 3)) break;
      const bucket = PK.buckets[g];
      const mains = PK.main_day_pairs ? mainDi.filter(di => partnerOn(di, bucket)) : [];
      const cands = [...mains, ...(opts.length ? [opts[k % opts.length]] : [])];
      for (const di of cands) {
        const d = days[di];
        const pr = isMainDi(di) ? partnerOn(di, bucket) : null;
        // (own id space '.yNN': never the id of a bonus / Focus exercise the peak allocation added on that day, '.xNN')
        const used = daySlotsOf(di).map(s => { const mm = /\.y(\d+)$/.exec(s.slot_id); return mm ? Number(mm[1]) : 0; });
        const tag = (d.day_type || 'day') + '.y' + String(Math.max(0, ...used) + 1).padStart(2, '0');
        const slot = {
          slot_id: d.weekday + '.' + tag, station_id: tag, bucket, role: pr ? 'paired_upper' : 'secondary', block: pr ? 'strength' : 'accessories', group: g, sets_hint: null, default_sets: PK.sets || 2,
          pair: pr ? pr.w.pair : null, superset: pr ? (pr.w.superset || pr.w.pair) : null, superset_eligible: pr ? (pr.w.superset || pr.w.pair) : null, pattern_partner: pr ? pr.w.slot_id : null,
          circuit: null, axial_req: 'non_axial', variant: null, laterality_dial: false, loading: null, focus_muscle: null,
          time_class: model.bucket(bucket).time_class || 'compound_bilateral', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null,
          origin: 'pattern_kept', pattern_kept: true, why: [pr ? why('why.pattern_kept_main', 'R3-SES-02', { group: g }) : why('why.pattern_kept', 'R3-SES-02', { group: g })]
        };
        const f = fillSlot(slot, curWeekN);
        if (!f || !f.exercise_id) continue;
        fills[slot.slot_id] = f;
        d.added.push(slot);
        sets[slot.slot_id] = slot.default_sets;
        if (pSets) pSets[slot.slot_id] = slot.default_sets;
        const t = isMainDi(di) ? fitsBoth(di) : timeOk(di, {});
        if (!t || !t.ok) { d.added.pop(); delete sets[slot.slot_id]; delete fills[slot.slot_id]; if (pSets) delete pSets[slot.slot_id]; continue; }
        if (t.ssOn) { ss[d.weekday] = true; ssNeeded.add(d.weekday); if (pSS) pSS[d.weekday] = true; }
        added.push(slot);
        k++;
        break;
      }
    }
  };

  // ---- the block's weeks
  // ---- v0.4 fix round 2 / F1 (E-146; RECHECK v0.4 02 / 03 / 04 / 06 / 07 / 08: groups reached their ceiling weeks early and held it,
  // weekly steps ran the wrong way, totals held for weeks): the block's whole-set schedule, built once from the planned stairway
  // (COACH-R3 R3-VOL-04 'about 3 % a week until the halfway week and about 5 % after ... each muscle reaches its ceiling exactly in the
  // last week'; R3-SES-02 step 4 'never flat'). Each line's j-th whole set lands in the week its planned T(w) passes start + j - 0.5,
  // its last set in the last week; a week never takes more sets than the 7 % weekly limit (R2-VOL-01 / UNI-05; the excess moves a
  // week earlier) and a week without a step takes one from a neighbouring week that holds two (the total climbs every week).
  const SCHED = !!(R.stairway.release_rounding && R.stairway.release_rounding.mode === 'scheduled');
  let sched = null;
  const buildSchedule = (w0) => {
    const N = tb.stair_N, out = {};
    const tg = new Set(trainableGroups());
    const lines = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && plan.T[l] && tg.has(X.groupOfLine[l]) && daysFor(l).length);
    // (a line whose lift is tested in the end-test week takes its last set the week before: the test replaces that week's top set,
    // COACH-R2 R2-PER-07, and the tested lift holds - the 'hold' sits on the tested lifts only)
    const lastWS = wks[wks.length - 1];
    const tp = lastWS && lastWS.test ? testExtra.get(lastWS.n) : null;
    const testedL = new Set();
    if (tp) for (const id of tp.tested || []) { const sl = allSlots().find(([x]) => x.slot_id === id); if (sl) for (const l of primeOf(sl[0])) testedL.add(l); }
    const lastFor = (l) => (testedL.has(l) && N > 2 ? N - 1 : N);
    const S = {}, steps = {};
    for (const l of lines) {
      S[l] = w0[l] || 0;
      const k = Math.max(0, Math.round(bt.cap[l] - S[l] - EPS));
      const ws2 = [];
      for (let j = 1; j <= k; j++) {
        let wk = N;
        for (let w = 2; w <= N; w++) if (plan.T[l][w - 1] >= S[l] + j - 0.5 - EPS) { wk = w; break; }
        ws2.push(wk);
      }
      for (let j = 0; j < k; j++) ws2[j] = Math.min(ws2[j], lastFor(l));
      if (k) ws2[k - 1] = lastFor(l);
      if (k <= lastFor(l) - 1) { // one set a week at most: strictly increasing, the last in week N
        for (let j = k - 2; j >= 0; j--) ws2[j] = Math.min(ws2[j], ws2[j + 1] - 1);
        for (let j = 0; j < k; j++) ws2[j] = Math.max(ws2[j], 2 + j);
      }
      steps[l] = ws2;
    }
    const count = (w) => lines.reduce((a, l) => a + steps[l].filter(x => x === w).length, 0);
    const tot1 = lines.reduce((a, l) => a + S[l], 0);
    const before = (w) => tot1 + lines.reduce((a, l) => a + steps[l].filter(x => x < w).length, 0);
    const budget = (w) => (PL ? Math.max(1, Math.floor(before(w) * (1 + PL.total_pct) + EPS) - Math.floor(before(w) + EPS)) : Infinity);
    const has = (l, w) => steps[l].includes(w);
    const move = (l, from, to) => { const i = steps[l].indexOf(from); steps[l][i] = to; steps[l].sort((a, b) => a - b); };
    const ko = keepOrder();
    const rank = (l) => ko.indexOf(X.groupOfLine[l]) * 100 + X.order.indexOf(l);
    // over the weekly limit: the lowest-ranked lines' steps move a week earlier (repeat down the block)
    for (let w = N; w >= 3; w--) {
      for (let guard = 0; guard < 40 && count(w) > budget(w); guard++) {
        const l = lines.filter(x => has(x, w) && !has(x, w - 1)).sort((a, b) => rank(b) - rank(a))[0];
        if (!l) break;
        move(l, w, w - 1);
      }
    }
    // a week without a step takes one from the nearest later week that holds two - the steps between shift a week earlier (a chain:
    // each line's sets stay in order, at most one a week; a line's last set stays in its last week); else from the week before
    const canMove = (l, from, to) => has(l, from) && !has(l, to) && to >= 2 && to <= lastFor(l) && !(from === lastFor(l) && steps[l][steps[l].length - 1] === from);
    for (let pass = 0; pass < N; pass++) {
      let moved = false;
      for (let w = 2; w <= N; w++) {
        if (count(w) > 0) continue;
        let done = false;
        for (let u = w + 1; u <= N && !done; u++) {
          if (count(u) < 2) continue;
          // plan the chain u -> u-1 -> ... -> w
          const chain = [];
          const taken = new Set();
          for (let v = u; v > w; v--) {
            const l = lines.filter(x => !taken.has(x + '@' + v) && canMove(x, v, v - 1)).sort((a, b) => rank(b) - rank(a))[0];
            if (!l) { chain.length = 0; break; }
            chain.push([l, v, v - 1]); taken.add(l + '@' + (v - 1));
          }
          if (chain.length) { for (const [l, from, to] of chain) move(l, from, to); done = true; moved = true; }
        }
        if (!done && w - 1 >= 2 && count(w - 1) >= 2) {
          const l = lines.filter(x => canMove(x, w - 1, w)).sort((a, b) => rank(b) - rank(a))[0];
          if (l) { move(l, w - 1, w); moved = true; }
        }
      }
      if (!moved) break;
    }
    // when the block has fewer steps than weeks, the flat weeks are spread: a run of more than two weeks without a step takes the step
    // that follows it into its middle (the steps stay back-loaded - 3 % then 5 % - but the total never sits for three weeks)
    for (let pass = 0; pass < 2 * N; pass++) {
      let moved = false;
      for (let a = 2; a <= N && !moved; a++) {
        if (count(a) > 0) continue;
        let b = a; while (b + 1 <= N && count(b + 1) === 0) b++;
        const runLen = b - a + 1;
        if (runLen >= 3 && b + 1 <= N) {
          const target = a + Math.floor(runLen / 2);
          const l = lines.filter(x => canMove(x, b + 1, target) && steps[x].filter(y => y > target && y < b + 1).length === 0 && steps[x].filter(y => y < b + 1).every(y => y < target)).sort((p, q) => rank(q) - rank(p))[0];
          if (l) { move(l, b + 1, target); moved = true; }
        }
        a = b;
      }
      if (!moved) break;
    }
    for (const l of lines) { out[l] = []; let c = S[l]; for (let w = 1; w <= N; w++) { c += steps[l].filter(x => x === w).length; out[l].push(c); } }
    return out;
  };
  const tgtOf = (l, i) => (sched && sched[l] ? sched[l][i] : plan.T[l][i]);

  let failGroup = null;
  let timeResult = null;
  for (const ws of wks) {
    curWeekN = ws.n;
    curWS = ws;
    curEbIdx = ws.exercise_block - tb.first_exercise_block;
    const changes = [];
    const whys = [];
    const shortfalls = [];
    changesBuf = null;
    riseOn = false;
    const sel = selFor(ws.exercise_block);
    if (ws.is_training_block_start) {
      setFills(sel);
      for (const [s] of allSlots()) sets[s.slot_id] = initialSets(s, ws);
      if (stair) {
        whys.push(why('why.sets_default', 'VOL-16'));
        if (circuitPlan) circuitRebalance(ws, whys);
        if (!circuitPlan) {
          timeResult = timeCheck(ws);
          whys.push(...roomWhys);
          bt = { ...bt0, start: timeResult.start, cap: timeResult.cap };
          plan = stairwayFrom(bt, tb, derived, model);
          // the block runs between two allocations the time check proved: week 1 (W1) and the peak week (P). Every week is W1 plus
          // some of the P - W1 increments, so every week fits the minutes the peak fits (v0.4: the placed stairway is the probed one)
          restore(timeResult.snP);
          pSets = { ...sets }; pFills = { ...fills }; pSS = { ...ss };
          pAddedBy = days.map(d => d.added.slice());
          restore(timeResult.snW1);
          ss = { ...ss, ...pSS }; for (const wd of Object.keys(pSS)) if (pSS[wd]) ssNeeded.add(wd);
          for (const s of added.slice()) { // week-1 bonus / Focus slots take their real pick (the probe used probe picks)
            const f = typeof fillSlot === 'function' ? fillSlot(s, curWeekN) : null;
            const l = X.lineOf[s.focus_muscle] || s.focus_muscle;
            if (f && f.exercise_id && primeLines(model, exOf(model, f), creditsOf(model, s, f)).includes(l)) fills[s.slot_id] = f;
            else { sets[s.slot_id] = 0; pSets[s.slot_id] = 0; }
          }
          // the starts the time check sized: raise each line from W1 toward its start with P's increments (Focus first, VOL-07)
          const startT = {};
          for (const l of planLines) startT[l] = bt.start[l];
          const order1 = planLines.filter(l => !dropGroups.has(X.groupOfLine[l])).sort((a, b) => (prio.includes(a) ? 0 : 1) - (prio.includes(b) ? 0 : 1) || X.order.indexOf(a) - X.order.indexOf(b));
          for (let guard = 0; guard < 400; guard++) {
            let movedAny = false;
            for (const l of order1) if (haveOf(l) < startT[l] - 0.5 - EPS && placeInc(l).ok) movedAny = true;
            if (!movedAny) break;
          }
          addPatternKept();
          w1Groups = tally(false, 'group');
          for (const l of planLines) if (!dropGroups.has(X.groupOfLine[l]) && haveOf(l) < startT[l] - 1 - EPS) shortfalls.push({ code: 'shortfall', field: l, key: 'why.cut_time', args: { muscle: l, missing: round2(Math.max(0, startT[l] - haveOf(l))) } });
          if (reduced.length) whys.push(why('why.group_fewer_days', 'D-68'));
          if (!timeResult.fits) whys.push(why('why.time_fit', 'R3-SES-02'));
          for (const g of timeResult.dropped) whys.push(why('why.group_not_trained', 'R3-SES-02', { group: g }));
        }
        if (prio.length) whys.push(why('why.focus_add', 'R3-SES-01', { n: D9.focus_add || 0 }));
      } else if (tb.type === 'pre_season') {
        const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : V.phase_factors.pre_season.factor;
        let base = cross.lastStair ? cross.lastStair.sets : null;
        if (!base) { const t0 = {}; for (const l of planLines) t0[l] = D9.start[l]; fit(t0, []); base = { ...sets }; }
        preScale(base, f, ws);
        trimToTime(whys, { circuit: circuitPlan });
        whys.push(why('why.pre_season', 'R2-PER-06'));
      } else if (tb.type === 'taper') {
        const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : V.phase_factors.taper.factor;
        scaleFrom(cross.lastBlock ? cross.lastBlock.sets : null, f, 'half_up', ws);
        whys.push(why('why.taper', 'R2-PER-06'));
      } else if (tb.type === 'recovery') {
        scaleFrom(cross.lastStair ? cross.lastStair.sets : null, R.recovery.sets_factor, 'ceil', ws);
      } else if (tb.type === 'in_season') {
        const t = targetsFor(derived, model, { modifier_id: (tb.factor && tb.factor.modifier) || V.phase_factors.in_season.modifier, floor: false, maintenance: false, cycles: 0, legDays: legDaysOfLayout(layout) });
        flatTargets = t.start;
        fit(t.start, []);
        trimToTime(whys, { circuit: circuitPlan });
        whys.push(why('why.in_season', 'R2-ATH-07'));
      } else if (tb.type === 'maintenance') {
        let t;
        if (derived.D5_plan_shape.mode === 'maintenance_4_6' || !cross.lastStair) {
          t = derived.D5_plan_shape.mode === 'maintenance_4_6' ? { ...D9.start } : targetsFor(derived, model, { maintenance: true, maintFactor: tb.factor && tb.factor.factor }).start;
        } else {
          const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : maintFactorOf(derived, model);
          const last4 = cross.lastStair.weekly.slice(-4);
          t = {};
          for (const l of planLines) t[l] = roundHalfUp(f * last4.reduce((a, w) => a + (w[l] || 0), 0) / last4.length);
        }
        flatTargets = t;
        if (!circuitPlan) fit(t, []);
        trimToTime(whys, { circuit: circuitPlan });
        const w = tally(false, 'line');
        const want = planLines.reduce((a, l) => a + (t[l] || 0), 0);
        const got = planLines.reduce((a, l) => a + Math.min(w[l] || 0, t[l] || 0), 0);
        if (want > 0 && got < 0.9 * want - EPS) warnings.push({ code: 'maintenance_time', key: 'warning.maintenance_time', args: { pct: roundHalfUp(100 * got / want) } }); // D-18 of v1.0 kept
        if (tb.factor && isNum(tb.factor.factor)) whys.push(why('why.maintenance', 'PER-01', { pct: roundHalfUp(tb.factor.factor * 100) }));
      }
    } else {
      if (ws.is_exercise_block_start) {
        setFills(sel);
        refillAdded();
        changes.push({ key: 'changes.new_exercise_block', args: {} });
        for (const [s] of allSlots()) {
          const f = fills[s.slot_id];
          if (isNum(sets[s.slot_id]) && sets[s.slot_id] > 0 && !(f && f.exercise_id) && !s.text_key && !NO_SET_KINDS.includes(kindOf(s))) sets[s.slot_id] = 0;
        }
      }
      if (circuitPlan) for (const [s] of allSlots()) if (isCircuitSlot(s) && ws.circuit) sets[s.slot_id] = circuitOff.has(s.slot_id) || isDropped(s) ? 0 : ws.circuit.rounds;
      // Olympic sets follow the budget week by week
      for (const [s] of allSlots()) if (s.bucket === 'AP_TRIPLE_EXT' && active(s)) { const per = olySets(s, ws); if (isNum(per) && stair) sets[s.slot_id] = per; }
      // a new exercise block may move a slot's main line (e.g. a single-leg RDL becomes a single-leg glute bridge): sets of a target
      // line never drop inside a stairway (H21), so the lost direct sets are placed back first (VOL-07 order)
      const prevW = weeksOut.length ? weeksOut[weeksOut.length - 1] : null;
      if (stair && ws.is_exercise_block_start && !circuitPlan && prevW) {
        changesBuf = changes;
        const prevLines = prevW.main_sets_by_line || {};
        for (const l of planLines) {
          if (dropGroups.has(X.groupOfLine[l])) continue;
          for (let guard = 0; guard < 20 && haveOf(l, true) < (prevLines[l] || 0) - 0.5 - EPS; guard++) {
            const r = placeInc(l);
            if (!r.ok) break;
          }
        }
        changesBuf = null;
      }
    }
    if (ws.plyo_stage && cross.prevStage && ws.plyo_stage !== cross.prevStage && !ws.is_training_block_start) changes.push({ key: 'changes.stage_up', args: { stage: ws.plyo_stage } });
    if (ws.circuit && cross.prevCircuit && ws.circuit.work_s > cross.prevCircuit.work_s && !ws.is_training_block_start) changes.push({ key: 'changes.circuit_longer', args: { work_s: ws.circuit.work_s } });

    // ---- the stairway step: the planned stairway, built once (R3-VOL-02 / R3-VOL-04: no check-ins)
    const idx = stair ? ws.stair_week - 1 : null;
    let ceilingHit = false;
    const placed = [];
    if (stair) whys.push(why('why.planned_only', 'R3-VOL-04'));
    if (stair && ws.stair_week >= 2 && !circuitPlan && !flatSets) {
      changesBuf = placed;
      riseOn = true; riseBy = {}; riseBase = cross.prevMainCredits ? { ...cross.prevMainCredits } : haveAll();
      const total0 = totalRes(mainOnly);
      const prevT = cross.prevWeek ? cross.prevWeek.totalMain : total0;
      const allowedTotal = PL ? Math.max(prevT + 1, Math.floor(prevT * (1 + PL.total_pct) + EPS)) : Infinity;
      // (all days, optional included: one whole set, or below the 10 % ceiling V15 checks)
      const prevAll = cross.prevWeek && isNum(cross.prevWeek.totalAll) ? cross.prevWeek.totalAll : totalRes(false);
      const TWC = R.stairway.limits && R.stairway.limits.total_weekly_ceiling;
      const allowedAll = isNum(TWC) ? Math.max(prevAll + 1, Math.ceil(prevAll * (1 + TWC) - EPS) - 1) : Infinity;
      allRoomFn = () => allowedAll - totalRes(false);
      let total = total0;
      const w0 = haveAll();
      if (SCHED && ws.stair_week === 2) sched = buildSchedule(w0);
      if (globalThis.__BC_DBG && SCHED && ws.stair_week === 2) for (const l of Object.keys(sched)) console.error('SCHED', l, 'cap', bt.cap[l], sched[l].join(' ')); // DEBUG-TC
      // the last week lands each line on its ceiling (whole sets, half up: "each muscle reaches its ceiling exactly in the last
      // week", R3-VOL-04); earlier weeks release a set once the bank reaches 1 (VOL-06)
      // v0.4 fix round 1 (E-85; VOL-06 'you round up, you round down'): whole sets follow the planned T(w) rounded half up, so the
      // steps spread through the block (RECHECK 02 / 07: groups flat for 6-9 weeks while a full bank built up)
      const halfUp = !!(R.stairway.release_rounding && R.stairway.release_rounding.mode === 'half_up');
      // v0.4 fix round 2 / F1 (E-146; RECHECK v0.4 04 / 06 / 07 / 08 majors: groups reached their ceiling weeks early and held it through
      // the hardest weeks): 'floor_last' - a line's whole sets follow its planned T(w) rounded down and the last week lands on the
      // ceiling (COACH-R3 R3-VOL-04 'each muscle reaches its ceiling exactly in the last week'); the week's lines together still follow
      // the rounded sum of their targets (the smoothing below), never taking a line to its ceiling before the last week
      const floorLast = !!(R.stairway.release_rounding && R.stairway.release_rounding.mode === 'floor_last');
      const lastWeek = ws.stair_week === tb.stair_N;
      const thr = lastWeek || halfUp || SCHED ? 0.5 : floorLast ? 1 - 1e-6 : R.stairway.release.threshold;
      // (the week before the last lets lines reach their ceiling when the last week's 7 % cannot hold every line's final set - the
      // lines with the largest bank go first; R2-VOL-01 / UNI-05 'never more than 7 %')
      const earlyCap = new Set();
      if (floorLast && ws.stair_week === tb.stair_N - 1 && PL) {
        const hv0 = haveAll(), tNow = totalRes(mainOnly);
        const oneLeft = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && plan.T[l] && bt.cap[l] - (hv0[l] || 0) <= 1 + EPS && bt.cap[l] - (hv0[l] || 0) >= 0.5)
          .sort((a, b) => (plan.T[b][idx] - (hv0[b] || 0)) - (plan.T[a][idx] - (hv0[a] || 0)) || X.order.indexOf(a) - X.order.indexOf(b));
        const budgetN = Math.max(1, Math.floor(tNow * (1 + PL.total_pct) + EPS) - tNow);
        for (const l of oneLeft.slice(0, Math.max(0, oneLeft.length - budgetN))) earlyCap.add(l);
      }
      const beforeCap = (l, hv) => lastWeek || !floorLast || earlyCap.has(l) || (hv || 0) + 1 < bt.cap[l] - EPS;
      // v0.4 fix round 1 (E-86): an added exercise opens only in the first week of an exercise block (PER-02) - so in that week a line
      // whose remaining steps of the exercise block need more than its existing exercises can still take opens it now (2 sets)
      // (the week's total ceiling may hold an entry back: an optional-day exercise may then open later in the exercise block while it
      // still runs 2+ weeks - one new exercise per line per exercise block; RECHECK 01: three lines' entries in one week left quads flat)
      const ebNow = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
      const ebPos = ebNow ? ws.n - ebNow.weeks[0] : -1, ebLen = ebNow ? ebNow.weeks[ebNow.weeks.length - 1] - ebNow.weeks[0] + 1 : 0; // (weeks: [first, last])
      const lateEntry = !ws.is_exercise_block_start && ebPos > 0 && ebPos <= ebLen - 2; // (the new exercise still runs 2+ weeks)
      if (ws.is_exercise_block_start) joinedEb.clear();
      if (pSets && (ws.is_exercise_block_start || lateEntry) && P.added_slots && P.added_slots.only_at_exercise_block_start) {
        const eb = ebNow;
        const lastW = eb ? Math.min(...[eb.weeks[eb.weeks.length - 1], wks[wks.length - 1].n]) : ws.n;
        const endIdx = Math.min(tb.stair_N - 1, idx + (lastW - ws.n));
        const ko = keepOrder();
        const gap = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && plan.T[l]).map(l => {
          const room = days.reduce((a, d) => a + [...d.slots, ...d.added].reduce((b, sl) => {
            const want = pSets[sl.slot_id] || 0, cur = isNum(sets[sl.slot_id]) ? sets[sl.slot_id] : 0;
            return b + (want > cur && primeOf(sl).includes(l) ? want - cur : 0);
          }, 0), 0);
          return { l, short: Math.round(tgtOf(l, endIdx) + EPS) - haveOf(l) - room, ko: ko.indexOf(X.groupOfLine[l]) };
        }).filter(x => x.short > EPS && !joinedEb.has(x.l)).sort((a, b) => a.ko - b.ko || b.short - a.short || X.order.indexOf(a.l) - X.order.indexOf(b.l));
        // (an entry at the exercise block's start may run up to a set ahead of the block's last planned week; a later entry up to a set
        // ahead of next week's - so a line never reaches its ceiling early and then holds, H21)
        for (const { l } of gap) { const r = placeInc(l, allowedTotal - total, { joinOnly: true, joinLimit: tgtOf(l, lateEntry ? Math.min(idx + 1, endIdx) : endIdx) + 1, lateEntry }); if (r.ok) { total = totalRes(mainOnly); joinedEb.add(l); } }
      }
      const cands = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && plan.T[l] && tgtOf(l, idx) - (w0[l] || 0) >= thr - EPS)
        .map(l => ({ l, owe: climbOwed(l) ? 0 : 1, pri: prio.includes(l) ? 0 : 1, cls: lineDef(l).class === 'big' ? 0 : 1, bank: tgtOf(l, idx) - (w0[l] || 0), ord: X.order.indexOf(l) }))
        .sort((a, b) => a.owe - b.owe || a.pri - b.pri || a.cls - b.cls || b.bank - a.bank || a.ord - b.ord);
      for (const { l } of cands) {
        let guard = 0;
        while (guard++ < 50) {
          const have = haveOf(l);
          if (tgtOf(l, idx) - have < thr - EPS) break;
          if (have + 1 > bt.cap[l] + 0.5 + EPS) { if (!atCapSeen[l]) { atCapSeen[l] = true; changes.push({ key: bt.cap[l] < bt0.cap[l] ? 'changes.at_time_cap' : 'changes.at_cap', args: { muscle: l } }); whys.push(why('why.at_cap', 'VOL-02', { muscle: l })); } break; }
          // (a 2-set entry may run up to one and a half sets ahead of the planned stairway when it is the line's only way to climb)
          const r = placeInc(l, allowedTotal - total, { joinLimit: tgtOf(l, idx) + (SCHED ? 1 : 1.5) });
          if (!r.ok) {
            if (r.ceiling) ceilingHit = true;
            else if (!r.rise && !r.done) shortfalls.push({ code: 'shortfall', field: l, key: 'why.cut_time', args: { muscle: l, missing: round2(tgtOf(l, idx) - have) } });
            break;
          }
          total = totalRes(mainOnly);
        }
      }
      // v0.4 fix round 1 (E-85; RECHECK 02 / 07: 'week 2 adds nothing'): the week's lines together follow the planned stairway - while
      // their sum is below the rounded sum of the week's targets, the line with the largest bank (>= 0.2) takes one set early
      // (R3-VOL-04 'about 3 % a week until the halfway week, about 5 % after')
      if ((halfUp || floorLast) && !SCHED) {
        const sumT = () => planLines.reduce((a, l) => a + (!dropGroups.has(X.groupOfLine[l]) && plan.T[l] ? plan.T[l][idx] : 0), 0);
        for (let guard = 0; guard < 20; guard++) {
          const hv = haveAll();
          const have = planLines.reduce((a, l) => a + (!dropGroups.has(X.groupOfLine[l]) && plan.T[l] ? hv[l] || 0 : 0), 0);
          if (have >= Math.round(sumT()) - EPS) break;
          const early = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && plan.T[l] && plan.T[l][idx] - (hv[l] || 0) >= 0.2 - EPS && (hv[l] || 0) + 1 <= Math.min(bt.cap[l], plan.T[l][idx] + 0.8) + EPS && beforeCap(l, hv[l]))
            .map(l => ({ l, bank: plan.T[l][idx] - (hv[l] || 0), ord: X.order.indexOf(l), pri: prio.includes(l) ? 0 : 1, cls: lineDef(l).class === 'big' ? 0 : 1 }))
            .sort((a, b) => a.pri - b.pri || b.bank - a.bank || a.cls - b.cls || a.ord - b.ord);
          let moved = false;
          for (const { l } of early) { const r = placeInc(l, allowedTotal - total, { joinLimit: plan.T[l][idx] + 0.8 }); if (r.ok) { total = totalRes(mainOnly); moved = true; break; } }
          if (!moved) break;
        }
      }
      // smoothing: a week never stands still - the line with the largest bank (>= 0.4) takes one set early (R2-PER-03/04)
      if (total <= prevT && SCHED && sched && idx + 1 < tb.stair_N) {
        // (scheduled: a week whose step could not be placed takes next week's step early, so the total still climbs)
        const hv = haveAll();
        // (only from a next week that keeps a step of its own: a pulled step never leaves next week flat)
        const nextSteps = planLines.filter(l => sched[l] && sched[l][idx + 1] - sched[l][idx] >= 0.5).length;
        const next = nextSteps < 2 ? [] : planLines.filter(l => sched[l] && sched[l][idx + 1] - (hv[l] || 0) >= 0.5 - EPS && (hv[l] || 0) + 1 <= bt.cap[l] + EPS)
          .sort((a, b) => (sched[b][idx + 1] - (hv[b] || 0)) - (sched[a][idx + 1] - (hv[a] || 0)) || X.order.indexOf(a) - X.order.indexOf(b));
        for (const l of next) { const r = placeInc(l, allowedTotal - total, { joinLimit: sched[l][idx + 1] + 1 }); if (r.ok) { total = totalRes(mainOnly); break; } }
      }
      if (total <= prevT && !SCHED) {
        const w1 = haveAll();
        const early = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && plan.T[l] && plan.T[l][idx] - (w1[l] || 0) >= 0.4 - EPS && (w1[l] || 0) + 1 <= Math.min(bt.cap[l], plan.T[l][idx] + 0.6) + EPS && beforeCap(l, w1[l]))
          .map(l => ({ l, bank: plan.T[l][idx] - (w1[l] || 0), ord: X.order.indexOf(l), pri: prio.includes(l) ? 0 : 1 }))
          .sort((a, b) => a.pri - b.pri || b.bank - a.bank || a.ord - b.ord);
        for (const { l } of early) { const r = placeInc(l, allowedTotal - total, { joinLimit: plan.T[l][idx] + 0.8 }); if (r.ok) { total = totalRes(mainOnly); break; } }
      }
      riseOn = false; allRoomFn = null;
      changesBuf = null;
      if (ceilingHit) whys.push(why('why.total_ceiling', 'UNI-05'));
      if (placed.length) whys.push(why('why.set_added', 'VOL-07'));
    }
    for (const c of placed) changes.push(c);
    if (stair && ws.stair_week >= 2) {
      const w = haveAll();
      const capped = planLines.filter(l => !dropGroups.has(X.groupOfLine[l]) && (w[l] || 0) + 1 > bt.cap[l] + 0.5 + EPS);
      for (const l of capped) if (!atCapSeen[l]) { atCapSeen[l] = true; changes.push({ key: bt.cap[l] < bt0.cap[l] ? 'changes.at_time_cap' : 'changes.at_cap', args: { muscle: l } }); }
      // a week without a new set climbs by load and the planned effort (R2-PER-05)
      if (!changes.some(c => c.key === 'changes.set_added' || c.key === 'changes.bonus_added')) changes.push({ key: 'changes.load_up', args: {} });
    }

    // ---- record the week
    const wMus = tally(false, 'muscle');
    const total = totalRes();
    const weekly_sets_by_muscle = {}, direct_sets_by_muscle = {};
    const dMus = directRaw(false);
    for (const m of R.muscles.order) { weekly_sets_by_muscle[m] = round2(wMus[m] || 0); direct_sets_by_muscle[m] = dMus[m] || 0; }
    const lineAll = tally(false, 'line'), lineMain = tally(true, 'line'), grpAll = tally(false, 'group'), grpMain = tally(true, 'group'), grpStair = tally(stairMode, 'group');
    const weekly_sets_by_line = {}, main_sets_by_line = {}, weekly_sets_by_group = {}, main_sets_by_group = {};
    for (const l of X.order) { weekly_sets_by_line[l] = round2(lineAll[l] || 0); main_sets_by_line[l] = round2(lineMain[l] || 0); }
    for (const g of X.groups) { weekly_sets_by_group[g] = round2(grpAll[g] || 0); main_sets_by_group[g] = round2(grpMain[g] || 0); }
    const target_by_muscle = {}, step_by_muscle = {}, banks = {};
    for (const l of X.order) {
      if (!(l in D9.start)) continue;
      if (!isNum(D9.start[l])) { target_by_muscle[l] = null; continue; }
      if (stair && dropGroups.has(X.groupOfLine[l])) { target_by_muscle[l] = null; continue; }
      if (stair) target_by_muscle[l] = round2(plan.T[l][idx]);
      else target_by_muscle[l] = flatTargets && isNum(flatTargets[l]) ? round2(flatTargets[l]) : round2(lineAll[l] || 0);
    }
    const hv = haveAll();
    for (const l of planLines) {
      step_by_muscle[l] = stair ? plan.steps[l][idx] : 0;
      banks[l] = stair ? round2(Math.min(Math.max(plan.T[l][idx] - (hv[l] || 0), 0), R.stairway.release.bank_max_blocked)) : 0;
    }
    const sets_by_slot = {};
    const est_minutes = {}, supersets_on = {}, test_minutes = {};
    days.forEach((d, di) => {
      for (const s of daySlotsOf(di)) sets_by_slot[s.slot_id] = isNum(sets[s.slot_id]) ? sets[s.slot_id] : null;
      const on = !noSS && !!ss[d.weekday];
      supersets_on[d.weekday] = on;
      est_minutes[d.weekday] = roundHalfUp(estimate(di, sets, ssMode(di, on), true));
      const plain = roundHalfUp(estimate(di, sets, ssMode(di, on), false));
      if (est_minutes[d.weekday] > plain) test_minutes[d.weekday] = est_minutes[d.weekday] - plain;
    });
    const rise = cross.prevTotal !== null && cross.prevTotal > 0 ? round4((total - cross.prevTotal) / cross.prevTotal) : null;
    weeksOut.push({
      n: ws.n, sets_by_slot, added_slots: added.map(s => ({ ...s, why: s.why.slice() })),
      // v0.4 B4: the fill each added slot was counted with this week (generate uses the same pick, so the credits agree, V14 / H08)
      added_fills: Object.fromEntries(added.filter(s => fills[s.slot_id] && fills[s.slot_id].exercise_id).map(s => [s.slot_id, fills[s.slot_id]])), supersets_on, supersets_needed: [...ssNeeded].filter(wd => supersets_on[wd]).sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)), target_by_muscle,
      weekly_sets_by_muscle, direct_sets_by_muscle, main_sets_by_muscle: main_sets_by_line, weekly_sets_by_line, main_sets_by_line, weekly_sets_by_group, main_sets_by_group,
      step_by_muscle, total_resistance_sets: total,
      // (fix round 2 / F1, E-135: internal - the group sets where the stairway is placed, read by this block's verification)
      stair_sets_by_group: Object.fromEntries(X.groups.map(g => [g, round2(grpStair[g] || 0)])),
      total_main_sets: totalRes(true), rise_vs_prev: rise, banks, est_minutes, test_minutes, changes, shortfalls, why: whys,
      not_trained_directly: [...dropGroups].sort((a, b) => X.groups.indexOf(a) - X.groups.indexOf(b))
    });
    cross.prevTotal = total;
    cross.prevWeek = { sets: { ...sets }, totalMain: totalRes(mainOnly), totalAll: totalRes(false) };
    cross.prevMainCredits = haveAll();
    cross.prevCircuit = ws.circuit;
    cross.prevStage = ws.plyo_stage;
    if (stair) {
      if (ws.is_training_block_start) cross.lastStair = { sets: {}, weekly: [] };
      cross.lastStair.sets = { ...sets };
      cross.lastStair.weekly.push({ ...lineAll });
    }
  }
  cross.lastBlock = { sets: cross.prevWeek ? cross.prevWeek.sets : {}, type: tb.type };

  // ---- verification (v0.4): every directly trained group holds its floor on the main days every week and climbs by the last
  // week; otherwise the lowest-priority failing group leaves this block (not trained directly) and the block is placed again
  if (stair && !circuitPlan && timeResult) {
    const bw = weeksOut.slice(weeksOut.length - wks.length);
    const order = keepOrder();
    const failing = [];
    for (const g of trainableGroups()) {
      if (dropGroups.has(g)) continue;
      const lines = groupLines(g);
      if (!lines.length) continue;
      const floorOk = !floorGroups.has(g) || relaxed.has(g) || bw.every(w => ((g === 'calves' && CALF_OPT ? w.stair_sets_by_group : w.main_sets_by_group)[g] || 0) >= groupFloorFor(g) - EPS);
      // (fix round 2 / F1, E-135: the climb where the stairway is placed - main days + a Focus line's / small line's optional-day adds)
      const first = bw[0].stair_sets_by_group[g] || 0, last = bw[bw.length - 1].stair_sets_by_group[g] || 0;
      const climbOk = bw.length < 2 || last - first >= climbOf(g) - CLIMB_TOL - EPS;
      if (globalThis.__BC_RETRY && (!floorOk || !climbOk)) console.error('  VERIFY fail', g, 'floorOk', floorOk, 'climbOk', climbOk, 'main', bw.map(w => w.main_sets_by_group[g]).join(' '), 'stair', bw.map(w => w.stair_sets_by_group[g]).join(' '), 'cap', JSON.stringify(groupLines(g).map(l => l + ':' + bt.start[l] + '->' + bt.cap[l])), 'tot', bw.map(w => w.total_main_sets).join(' '));
      if (!floorOk || !climbOk) failing.push(g);
    }
    // v0.4 fix round 1 (E-86; random sweep, water polo 4 x 30 min: every step of the block sat on the optional day's added rows while
    // the main days held 10 sets for 8 weeks): the main days' total climbs too (H21 total_flat) - otherwise the trained groups whose
    // main-day sets hold fail like a group that does not climb
    const tm0 = bw[0].total_main_sets, tmN = bw[bw.length - 1].total_main_sets;
    const fixedFamily = !!(G24 && (G24.exempt_families || []).includes(derived.D1_family));
    if (!failing.length && !flatSets && !fixedFamily && bw.length >= 2 && isNum(tm0) && isNum(tmN) && tmN > EPS && tmN <= tm0 + EPS) {
      for (const g of trainableGroups()) if (!dropGroups.has(g) && groupLines(g).length && (bw[bw.length - 1].main_sets_by_group[g] || 0) <= (bw[0].main_sets_by_group[g] || 0) + EPS) failing.push(g);
    }
    if (failing.length && !adj.final) {
      failing.sort((a, b) => order.indexOf(b) - order.indexOf(a));
      failGroup = failing[0];
      // a line that shares days with the failing group and climbs more than its own minimum gives one set of its peak
      const fl = groupLines(failGroup);
      const gDays = new Set(mainDi.filter(di => daySlotsOf(di).some(s => active(s) && placeable(s) && primeOf(s).some(l => fl.includes(l)))));
      const give = planLines.filter(l => !fl.includes(l) && !dropGroups.has(X.groupOfLine[l]) && [...gDays].some(di => daySlotsOf(di).some(s => active(s) && placeable(s) && primeOf(s).includes(l))))
        .map(l => ({ l, room: bt.cap[l] - bt.start[l] - (carrierOfGroup(X.groupOfLine[l]) === l ? climbOf(X.groupOfLine[l]) : lineClimb), pri: prio.includes(l) ? 1 : 0 }))
        .filter(x => x.room >= 1 - EPS)
        .sort((a, b) => a.pri - b.pri || b.room - a.room || X.order.indexOf(a.l) - X.order.indexOf(b.l));
      return { cross, fail: { group: failGroup, give: give.length ? give[0].l : null } };
    }
  }

  // ---- the time check result: warnings and offers before week 1 (R3-SES-02 step 1)
  if (stair && timeResult) {
    // (v0.4 B4: only groups the plan trains directly - a group with no main-day station or credit-only is not 'held at a lower peak')
    const lowGroups = [...new Set(timeResult.lowered.map(l => X.groupOfLine[l]))].filter(g => !dropGroups.has(g) && trainableGroups().includes(g));
    const dropped = X.groups.filter(g => dropGroups.has(g));
    // a credit-only group (field athletes' arms, R3-VOL-01 'helper work') is listed only when no main-day station trains it
    // directly; a template arm station keeps its structure sets (no floor, no stairway target)
    const directStation = (g) => mainDi.some(di => daySlotsOf(di).some(sl => active(sl) && groupOfSlot(sl) === g && (groupCredits(model, crOf(sl) || {})[g] || 0) >= 1 - EPS));
    const credit = [...new Set((D9.credit_only || []).map(l => X.groupOfLine[l]))].filter(g => !(X.linesOfGroup[g] || []).some(l => planLines.includes(l)) && !directStation(g));
    // a floored group the template gives no main-day exercise is not trained directly either (compound credit only)
    const noStation = X.groups.filter(g => groupLines(g).length && !dropGroups.has(g) && !credit.includes(g) && !trainableGroups().includes(g));
    // E-64: a group not trained directly that keeps its class lift on a main day
    const classLiftOf = (g) => mainDi.some(di => daySlotsOf(di).some(sl => classLift(sl) && active(sl) && groupOfSlot(sl) === g));
    const r5 = (x) => Math.ceil((x - EPS) / ((TF && TF.round_minutes_to) || 5)) * ((TF && TF.round_minutes_to) || 5);
    const competitive = derived.D2_profile && derived.D2_profile.competitive === 'competitive';
    const maxMin = Math.max(...S.minutes_allowed.filter(x => competitive || !S.minutes_over_90_competitive_only || x <= 90));
    const tc = {
      training_block: tb.n, fits: !!timeResult.fits, kept_time: true,
      needed_minutes: timeResult.need ? r5(timeResult.need.max) : null,
      offered: null,
      trained_groups: X.groups.filter(g => groupLines(g).length && !dropGroups.has(g) && trainableGroups().includes(g)),
      not_trained_directly: [...dropped.map(g => ({ group: g, reason: classLiftOf(g) ? 'class_lift' : 'time' })), ...noStation.map(g => ({ group: g, reason: 'no_station' })), ...credit.map(g => ({ group: g, reason: 'credit_only' }))],
      lowered_peak: lowGroups,
      trained_below_floor: [...[...relaxed].map(g => ({ group: g, reason: 'work_lift_time' })), ...[...circuitBelow].filter(g => !dropGroups.has(g)).map(g => ({ group: g, reason: 'circuit_time' }))],
      supersets_recommended: true,
      supersets_needed: [...ssNeeded].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)),
      // (fix round 2 / F1, E-143: blocks the time check switched off for the person's minutes - switchable back on, offer C)
      blocks_off: [...blocksOff].map(([block, m]) => ({ block, minutes: Math.max(1, Math.round(m)) }))
    };
    if (!timeResult.fits) {
      const mains = Math.max(1, mainDi.length);
      let need = timeResult.need || { max: derived.session_minutes, total: derived.session_minutes * mains };
      if (timeResult.circuit && !timeResult.need) {
        // a timed circuit holds more rounds at a longer session (rules.supersets.bootcamp.stairway.rounds_max_by_minutes)
        const RB = R.supersets.bootcamp.stairway.rounds_max_by_minutes;
        const rounds = (wks[0].circuit && wks[0].circuit.rounds) || 0;
        const more = Object.keys(RB).map(Number).sort((a, b) => a - b).find(m => m > derived.session_minutes && RB[String(m)] > rounds);
        need = { max: more || derived.session_minutes, total: derived.session_minutes * mains };
      }
      const longer = r5(need.max);
      const moreDays = derived.days_per_week < 6 ? { days: derived.days_per_week + 1, minutes: Math.max(derived.session_minutes, r5(need.total / (mains + 1))) } : null;
      tc.offered = { extra_day: moreDays, session_minutes: longer <= maxMin ? longer : null };
      warnings.push({ code: 'time_check', key: 'warning.time_check', args: { days: derived.days_per_week, minutes: derived.session_minutes } });
      if (dropped.length) warnings.push({ code: 'not_trained_directly', key: 'warning.not_trained_directly', args: { group: dropped } });
      if (relaxed.size || circuitBelow.size) warnings.push({ code: 'below_floor_work_lift', key: 'warning.below_floor_work_lift', args: { group: [...relaxed, ...circuitBelow].filter(g => !dropGroups.has(g)), minutes: derived.session_minutes } });
      else if (lowGroups.length) warnings.push({ code: 'time_lower_peak', key: 'warning.time_lower_peak', args: { group: lowGroups, minutes: derived.session_minutes } });
      if (moreDays) offers.push(moreDays.minutes > derived.session_minutes ? { key: 'offer.more_days_min', args: { days: moreDays.days, min: moreDays.minutes } } : { key: 'offer.more_days', args: { days: moreDays.days } });
      if (tc.offered.session_minutes && tc.offered.session_minutes > derived.session_minutes) offers.push({ key: 'offer.longer_sessions', args: { min: tc.offered.session_minutes } });
      for (const b of tc.blocks_off) offers.push({ key: 'offer.block_on', args: { block: 'block.short.' + b.block, min: b.minutes } });
      offers.push({ key: dropped.length ? 'offer.keep_time' : 'offer.keep_time_lower_peak', args: { days: derived.days_per_week, minutes: derived.session_minutes }, chosen: true });
    }
    if (credit.length || noStation.length) warnings.push({ code: 'credit_only_groups', key: 'warning.credit_only_groups', args: { group: [...credit, ...noStation] } });
    if (tc.supersets_needed.length) warnings.push({ code: 'supersets_needed', key: 'warning.supersets_needed', args: { day: tc.supersets_needed } });
    timeChecks.push(tc);
    blockTargetsOut.push({ training_block: tb.n, start: { ...bt.start }, cap: { ...bt.cap }, lowered: timeResult.lowered.filter(l => !dropGroups.has(X.groupOfLine[l])), dropped_groups: dropped });
  } else if (stair) {
    blockTargetsOut.push({ training_block: tb.n, start: { ...bt.start }, cap: { ...bt.cap }, lowered: [], dropped_groups: [] });
  }
  return { cross, fail: null };
}

function dedupeOffers(list) {
  // the plan answers once: the first block that could not hold the full plan makes the offers (its 'keep the time' is the chosen
  // answer, last); a later block (year plan) is planned the same way and says so in its own time check (plan.time_check.by_block)
  const first = list.findIndex(o => o.chosen);
  const use = first >= 0 ? list.slice(0, first + 1) : list;
  const seen = new Set();
  return use.filter(o => { const k = o.key + JSON.stringify(o.args || {}); if (seen.has(k)) return false; seen.add(k); return true; });
}
function dedupeWarnings(list) {
  const seen = new Set();
  return list.filter(o => { const k = o.key + JSON.stringify(o.args || {}); if (seen.has(k)) return false; seen.add(k); return true; });
}
