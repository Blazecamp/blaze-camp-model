// engine/volume.mjs - weekly targets (D9), the planned stairway and the weekly set allocation (engine/CONTRACTS.md §4.5).
// Pure: no I/O, no clock, no randomness. Every number comes from model.rules; literals are structural or marked INFERRED.
//
// v0.5 in one paragraph (design/ENGINE_V05_PLAN.md "How volume is allocated"; COACH-CT CT-01, COACH-CX CX-01..04, COACH-R4):
// template-first, no time-fitting. (1) Each trained GROUP (quads, hips = glutes + hamstrings, back, chest, shoulders, biceps,
// triceps, calves) has one weekly target that follows the stairway from its start to its planned final sets - the kernel is
// engine/progression (the final target is reached, in the last week; faster steps are allowed and noted above about 15 %).
// (2) The weekly sets are split over the template slots that train the group, first exercise first (VOL-07), the exposures of a
// day type alternating (R3-VOL-03). (3) An exercise holds 2-5 sets (2-4 for L1); a group the template's slots cannot hold gets the
// coach's bonus exercise on the optional day; with no optional day the group is capped at what the slots hold and the plan says
// so. (4) Credits are recomputed from the actual exercises (helpers 0.25; athletic work never counts) and reported per group.
// Nothing is dropped, cut or lowered for time: session minutes are neither an input nor a constraint. est_minutes is an estimate.
import { EngineError, WEEKDAYS, EPS, why, round2, roundHalfUp } from './util.mjs';
import { olympicSetsForIndex } from './budget.mjs';
import { athleticBudget } from './athletic.mjs';
import { linesOf, lineCredits, groupCredits } from './lines.mjs';
import { testPlan, strengthTestSlots } from './week.mjs';
import { planStairway, stairwayProgress, staggerStairways, accelerationReport } from './progression/stairway.mjs';
import { nextBlockStart } from './progression/prescription.mjs';

/** @typedef {import('./util.mjs').Why} Why */

const round4 = (x) => (x < 0 ? -1 : 1) * Math.floor(Math.abs(x) * 1e4 + 0.5 + EPS) / 1e4;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const RESISTANCE_KINDS = ['resistance', 'isolation', 'focus'];
const ADDED_ORIGINS = ['bonus'];
const NO_SET_KINDS = ['warmup', 'aerobic', 'skill'];
const NO_SET_BUCKETS = ['COND_WOD', 'COND_AEROBIC'];

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

/** the day's exercise count (R4-SES-02): the template day's own size, else the client type's default, inside the type's range */
function countOf(def, derived) {
  const size = derived.D6_week_layout && derived.D6_week_layout.session_size;
  if (!size) return Infinity;
  const want = def && isNum(def.count) ? def.count : size.default;
  return Math.min(size.range[1], Math.max(size.range[0], want));
}

function stationIncluded(st, count, priority) {
  if (isNum(st.rank) && st.rank > count) return false;
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
    if (day && day.stations.some(s => s.bucket === 'ISO_CALF' && stationIncluded(s, countOf(day, derived), pr))) n++;
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
 * calves: the weekly floor a plan holds with one calf exercise x 3 sets per leg day (VOL-17, R3-SES-01) plus the optional-day
 * Calves slots of the coach's sheets: 10 where those hold it, else what they hold (v0.5: no 4th set is squeezed into a leg day).
 * @param {object} model @param {number} legDays main days with a calves slot @param {number} [optionalSlots] optional-day calves slots
 */
export function calvesFloor(model, legDays, optionalSlots = 0) {
  const V = model.rules.volume;
  const per = V.calves.per_leg_day.L1;
  const optMax = Array.isArray(V.calves.optional_slot_sets) ? V.calves.optional_slot_sets[1] : per;
  return Math.min(V.calves.weekly_floor, per * Math.max(legDays, 0) + optMax * Math.max(optionalSlots, 0));
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
  // v0.5: the floor of 10 applies from 3 training days (ENGINE_V05_PLAN; 2 days: the 2-day rule, R4-SES-03)
  const fromDays = isNum(V.floor.applies_from_days) ? V.floor.applies_from_days : 0;
  const TD = V.two_day || null;
  // (a 2-day maintenance plan keeps its maintenance sets, never above the 2-day rule's 8 - `twoDayPlan`)
  const twoDayPlan = !!(TD && opts.floor === undefined && isNum(derived.days_per_week) && derived.days_per_week <= TD.days_max);
  const twoDay = twoDayPlan && !maintenance;
  const applyFloor = opts.floor !== undefined ? opts.floor : (!maintenance && !twoDay && !(isNum(derived.days_per_week) && derived.days_per_week < fromDays) && !(circuit && (V.floor.exempt || []).includes('format:circuit')));
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
  const x3_lowered = [];      // v0.6: lines whose final sets a profile rule lowered (rules.volume.x3)
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
    // v0.5 fix round 1 (R3-VOL-01 'field athletes: side delts and arms stay helper work; shoulders counted as one group'; sample 03
    // major: shoulders were a soccer player's biggest upper-body group): a competitive athlete's shoulders line takes the upper-body
    // factor and never ends above the back (rules.volume.x1.shoulders_athlete)
    const SA = V.x1 && V.x1.shoulders_athlete;
    const upperLine = !!SA && l === 'shoulders' && (SA.modifiers || []).includes(modifier_id) && !isPri;
    const rawF = def.class === 'small' && !upperLine ? mod.small : regionF;
    const credit = !calves && (rawF === 'credit' || creditOnlyList.includes(l) || def.members.some(m => creditOnlyList.includes(m)));
    if (credit && !isPri) { fill[l] = 'credit'; start[l] = null; cap[l] = null; credit_only.push(l); continue; }
    // a credit-only line chosen as a Focus muscle takes the numeric region factor (INFERRED; 12 v1.1 §3.3 "unless it is a priority")
    const factor = isNum(rawF) ? rawF : (isNum(regionF) ? regionF : 1);
    fill[l] = 'target';
    let s, c = null, base = null;
    if (calves) {
      // one calf exercise x 3 sets per leg day (R3-SES-01, VOL-17); the optional-day Calves slots carry the rest (the allocation)
      s = V.calves.per_leg_day[L] * legDays;
      add(l, why('why.calves_leg_day', 'VOL-17'));
    } else {
      base = V.start[l][L];
      // v0.6 (G-111; VOL-01 'advanced 20+ for PRIORITY muscles'; review 06 M1): an advanced physique client's big groups that are
      // not a Focus muscle start lower, so the first lift has steps left; the final sets stay (rules.volume.x3.nonfocus_start)
      const NF = V.x3 && V.x3.nonfocus_start;
      // (a full-body A / B week of up to rules.volume.x3.nonfocus_start.max_days days: the template gives a big group 2 lifts a day there)
      // (a maintenance block keeps its share of the level's own start, PER-01)
      if (NF && !isPri && !maintenance && (NF.modifiers || []).includes(modifier_id) && (NF.levels || []).includes(L) && (NF.line_classes || []).includes(def.class) && isNum(NF.start) && !(isNum(NF.max_days) && isNum(derived.days_per_week) && derived.days_per_week > NF.max_days)) base = Math.min(base, NF.start);
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
    // the 2-day rule (COACH-R4 R4-SES-03): every big muscle group is trained with about 6-8 weekly sets instead of 10; the plan
    // says so and suggests a third day. Never fewer groups, never more exercises. The small groups take the same numbers at most.
    if (twoDay && !calves) {
      const big = (TD.big_classes || ['big']).includes(def.class);
      const lo = TD.weekly_sets[0] + (isPri ? F : 0);
      s = big ? lo : Math.min(s, lo);
      add(l, why('why.two_day_rule', 'R4-SES-03'));
    }
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
    if (upperLine && isNum(cap[SA.cap_line])) c = Math.max(s, Math.min(c, cap[SA.cap_line]));
    if (twoDay && !calves) c = Math.min(c, TD.weekly_sets[1] + (isPri ? F : 0)); // R4-SES-03: about 6-8
    // v0.6 (rules.volume.x3): the final sets a profile asks for. G-112: an off-season field athlete whose profile keeps the upper
    // body at maintenance ends chest and shoulders one set above the floor (review 03 M2). G-113: a CrossFit-style class member's
    // arms and shoulders end two sets above the floor, chest and back at 15 (review 04 M1). Never under the start; a Focus line keeps
    // its own numbers.
    const VX3 = V.x3 || null;
    const c0 = c;
    if (VX3 && !calves && !isPri) {
      const lowOf = () => (applyFloor ? floorV : s);
      const UM = VX3.upper_maintenance;
      if (UM && sp && sp.upper_maintenance === true && (UM.modifiers || []).includes(modifier_id) && (UM.lines || []).includes(l)) c = Math.max(s, Math.min(c, lowOf() + (UM.over_floor || 0)));
      const CT = VX3.class_tops;
      const ct = CT && CT.lines ? CT.lines[l] : null;
      if (ct && (CT.families || []).includes(derived.D1_family) && (CT.competitive || []).includes(derived.D2_profile.competitive)) c = Math.max(s, Math.min(c, isNum(ct.value) ? ct.value : lowOf() + (ct.over_floor || 0)));
      if (c < c0) x3_lowered.push(l);
    }
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
  // maintenance (flat, not floored) or completed blocks. v0.5 (COACH-R4 R4-PRG-04): the next block starts a little above where
  // the last one started (about 5 %, whole sets), never above the level's top; at the top the sets stay and load and reps progress.
  if (maintenance) {
    const f = isNum(opts.maintFactor) ? opts.maintFactor : maintFactorOf(derived, model);
    for (const m of Object.keys(start)) if (isNum(start[m])) { start[m] = roundHalfUp(start[m] * f); add(m, why('why.maintenance', 'PER-01', { pct: roundHalfUp(f * 100) })); }
    // the 2-day rule holds in maintenance too (R4-SES-03 'about 6-8', never more exercises): no line above 8 weekly sets (+ Focus)
    if (twoDayPlan) for (const m of Object.keys(start)) {
      if (!isNum(start[m]) || X.defs[m].per_leg_day) continue;
      const hi = TD.weekly_sets[1] + (focus.includes(m) ? F : 0);
      if (start[m] > hi) { start[m] = hi; add(m, why('why.two_day_rule', 'R4-SES-03')); }
    }
  } else if (cycles > 0) {
    for (const m of Object.keys(start)) {
      if (!isNum(start[m])) continue;
      const before = start[m];
      start[m] = nextStart(start[m], cap[m], cycles, model);
      if (start[m] !== before) add(m, why('why.next_block_start', 'R4-PRG-04', { muscle: m, from: before, to: start[m] }));
    }
  }
  // v_taper Focus: shoulders + back grow; a model that still lists rules.volume.priority.v_taper_hold holds those lines at their
  // start (VOL-18). v1.3 models retire the hold (R3-SES-01 'everything else balanced', R3-SES-02 'never flat')
  if (opts.priority !== false && (derived.priority_choices || []).includes('v_taper')) {
    for (const m of V.priority.v_taper_hold || []) if (isNum(start[m]) && !focus.includes(m)) { cap[m] = start[m]; add(m, why('why.at_cap', 'VOL-18', { muscle: m })); }
  }
  for (const m of Object.keys(start)) if (isNum(start[m])) cap[m] = Math.max(cap[m], start[m]);
  return {
    modifier_id, start, cap, fill, two_day: twoDayPlan,
    lines: X.order.filter(l => isNum(start[l])),
    priority: X.order.filter(l => focus.includes(l)), focus_add: focus.length ? F : 0,
    pain_muscles, floored, floor_groups: [...new Set(floor_groups)], credit_only, x3_lowered,
    calves_per_leg_day: V.calves.per_leg_day[L], calves_floor: calvesFloor(model, legDays), leg_days: legDays, carriers: carrierOf,
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
  const start = { ...targets.start }, cap = { ...targets.cap };
  for (const m of Object.keys(start)) if (isNum(start[m])) start[m] = nextStart(start[m], cap[m], step, model);
  return { ...targets, start, cap };
}

/** R4-PRG-04: the start of a block `blocks` blocks later (engine/progression nextBlockStart; never above the top) */
function nextStart(start, top, blocks, model) {
  const NB = model.rules.cycles.next_block;
  if (!NB || !blocks || !Number.isSafeInteger(start) || !Number.isSafeInteger(top) || top < start) return start;
  return nextBlockStart({ start, top, multiplier: NB.multiplier, blocks }).start;
}

/** the default pattern's rise for each transition of an N-week stairway (3 % to the halfway week, 5 % after; R3-VOL-04) */
function standardRates(N, model) {
  const st = model.stair(N);
  const out = [];
  for (let w = 2; w <= N; w++) out.push(st.standard_steps[String(w)]);
  return out;
}

/** the reference rates of one line: the standard steps; a pain area holds for its freeze weeks, then climbs slowly (VOL-03, D-11) */
function ratesOf(m, bt, N, model) {
  const base = standardRates(N, model);
  if (!(bt.pain_muscles || []).includes(m)) return base;
  const freeze = model.rules.volume.pain.freeze_weeks;
  const slow = model.rules.stairway.limits.pain_after_freeze;
  return base.map((s, i) => ((i + 1) <= freeze ? 0 : Math.min(s, slow)));
}

/** the planned final sets of a line: its ceiling; a pain area ends where its slow steps take it (never above the ceiling) */
function plannedTop(m, bt, N, model) {
  const S = bt.start[m], C = bt.cap[m];
  if (!(bt.pain_muscles || []).includes(m)) return C;
  const g = ratesOf(m, bt, N, model).reduce((a, r) => a * (1 + r), 1);
  return Math.max(S, Math.min(C, roundHalfUp(S * g)));
}

/** growth factor of a line's default pattern (lambda = 1) */
export function plannedGrowth(m, bt, trainingBlock, derived, model) {
  return ratesOf(m, bt, trainingBlock.stair_N, model).reduce((g, s) => g * (1 + s), 1);
}

/** one whole-set stairway from the kernel (engine/progression): start -> peak over the block's weeks */
function stairOf(start, peak, rates, model) {
  const PG = model.rules.stairway.progression;
  return planStairway({ start, peak, rates, weeksEarly: PG.arrival_weeks_early, noteAbove: PG.note_above, minWholeSets: PG.note_min_whole_sets, numerics: PG.numerics });
}

/**
 * The planned whole-set stairway T(w) per target line for one stairway block, start -> planned final sets (v0.5: the kernel is
 * engine/progression; CX-01 the final target is reached - lambda may pass 1; R4-PRG-01 reached in the last week).
 * @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>, noted:Object<string,number[]>, top:Object<string,number>}}
 */
export function stairwayPlan(targets, trainingBlock, derived, model) {
  return stairwayFrom(blockTargets(targets, trainingBlock, derived, model), trainingBlock, derived, model);
}

/** the same from block targets that are already final (blockTargets applied) */
export function stairwayFrom(bt, trainingBlock, derived, model) {
  const N = trainingBlock.stair_N;
  if (!isNum(N)) throw new EngineError('volume.not_stairway', `training block ${trainingBlock.n} is not a stairway`);
  const lambda = {}, steps = {}, T = {}, noted = {}, top = {};
  const keys = Object.keys(bt.start).filter(m => isNum(bt.start[m]));
  const order = [...linesOf(model).order.filter(l => keys.includes(l)), ...keys.filter(k => !linesOf(model).order.includes(k)).sort()];
  for (const m of order) {
    const peak = Math.max(bt.start[m], plannedTop(m, bt, N, model));
    const sp = stairOf(bt.start[m], peak, ratesOf(m, bt, N, model), model);
    lambda[m] = sp.lambda === null ? 0 : sp.lambda;
    T[m] = sp.sets.slice();
    steps[m] = [0, ...sp.report.weeks.map(w => (w.rise === null ? 0 : w.rise))];
    noted[m] = sp.report.noted.slice();
    top[m] = peak;
  }
  return { lambda, steps, T, noted, top };
}

// ---------------------------------------------------------------------------------------------------------------
// credits
// ---------------------------------------------------------------------------------------------------------------

function exOf(model, fill) {
  if (!fill || !fill.exercise_id || !model.hasEx(fill.exercise_id)) return null;
  return model.ex(fill.exercise_id);
}
// engine 0.7.1 (DECISIONS G-311, performance only): the credits of an (exercise, bucket) pair and their group / line sums are read
// tens of millions of times by the set placement; they depend only on the frozen model, so they are memoised per model object.
// The derived maps (the empty map, the group and line sums) are frozen; the catalog's own credit map is returned as before. The engine
// never mutates the model it is given (pure functions), which is what makes the memo safe.
const CREDIT_CACHE = new WeakMap();
const EMPTY_CREDITS = Object.freeze({});
function creditCacheOf(model) {
  if (!model || typeof model !== 'object') return null;
  let c = CREDIT_CACHE.get(model);
  if (!c) { c = { credits: new Map(), known: new WeakSet([EMPTY_CREDITS]), group: new WeakMap(), line: new WeakMap() }; CREDIT_CACHE.set(model, c); }
  return c;
}
function creditsOf(model, slot, fill) {
  if (slot && slot.counts_as_volume === false) return null;
  if (!fill || !fill.exercise_id) return null;
  const cache = creditCacheOf(model);
  const key = fill.exercise_id + '\u0000' + (fill.bucket || (slot ? slot.bucket : undefined));
  if (cache.credits.has(key)) return cache.credits.get(key);
  const ex = exOf(model, fill);
  let out;
  if (!ex) out = null;
  else if (ex.tags.some(t => model.rules.credit.never_credit_tags.includes(t))) out = EMPTY_CREDITS;
  else { out = model.credits(ex, fill.bucket || slot.bucket); if (out && Object.keys(out).length === 0) out = EMPTY_CREDITS; }
  cache.credits.set(key, out);
  if (out) cache.known.add(out);
  return out;
}
/** groupCredits(model, cr), memoised for a credit map creditsOf handed out (G-311) */
function groupCreditsC(model, cr) {
  const cache = creditCacheOf(model);
  if (!cr || !cache.known.has(cr)) return groupCredits(model, cr);
  let out = cache.group.get(cr);
  if (!out) { out = Object.freeze(groupCredits(model, cr)); cache.group.set(cr, out); }
  return out;
}
/** lineCredits(model, cr), memoised for a credit map creditsOf handed out (G-311) */
function lineCreditsC(model, cr) {
  const cache = creditCacheOf(model);
  if (!cr || !cache.known.has(cr)) return lineCredits(model, cr);
  let out = cache.line.get(cr);
  if (!out) { out = Object.freeze(lineCredits(model, cr)); cache.line.set(cr, out); }
  return out;
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

/** the order groups are allocated in: a group that hands helper credit to another comes first (quads -> hips, back -> biceps ...) */
function groupOrder(model) {
  return linesOf(model).groups.slice();
}

/**
 * Weekly whole sets per slot for every week of the plan (CONTRACTS §4.5 planWeeklySets). v0.5: template-first.
 *  1. Targets: one weekly target per trained GROUP, from the stairway (start -> planned final sets; engine/progression).
 *  2. Slots: every template slot that trains the group takes sets in session order - the exercise with the fewest sets first, the
 *     earlier one on a tie (VOL-07: 2/2/2 -> 3/2/2 -> 3/3/2), the exposures of a day type alternating (R3-VOL-03).
 *  3. Bounds: 2-5 sets an exercise (2-4 for L1); calves 3 on a leg day. A group the slots cannot hold opens the coach's bonus
 *     exercise on the optional day at the start of the exercise block that needs it; with no optional day the group is capped at
 *     what the slots hold and the plan says so (block_targets[].capped, warning.capped_by_template).
 *  4. Credits: recomputed from the actual exercises each week (helpers 0.25; a set counts at most 1.0 to a group).
 * Nothing is dropped, cut or lowered for time. ctx.estimateMinutes gives est_minutes (information only, CT-01).
 * @param {{derived:import('./util.mjs').Derived, shape:import('./util.mjs').Shape, layouts:import('./util.mjs').WeekLayout[],
 *          selections:import('./util.mjs').Selection[], model:object, fillSlot:Function, estimateMinutes?:Function}} ctx
 * @returns {import('./util.mjs').VolumePlan}
 */
export function planWeeklySets(ctx) {
  const { derived, shape, layouts, model } = ctx;
  if (!derived || !shape || !Array.isArray(layouts) || !model) throw new EngineError('volume.bad_ctx', 'planWeeklySets needs derived, shape, layouts and model');
  const cross = { weeksOut: [], warnings: [], blockTargetsOut: [], prevTotal: null, prevCircuit: null, prevStage: null, lastStair: null, lastBlock: null };
  // v0.5 fix round 2 (rules.placement.x2.honest_schedule; samples 06 / 07 majors: chest 'ran ahead of its own weekly schedule' and
  // arrived in week 8, the shoulders' printed stairway said 16 -> 25 while the weeks held 23 -> 25.5): a block is planned, and where
  // its weeks did not hold the planned start or the planned final sets of a group (the first week already holds more than the start;
  // the exercises cannot reach the top) the block is planned again from what the weeks really hold - so the schedule a plan prints
  // is the one its weeks follow and the final sets arrive in the last week (R4-PRG-01)
  const HS = model.rules.placement.x2 && model.rules.placement.x2.honest_schedule;
  for (const tb of shape.training_blocks) {
    const layout = layouts[tb.n - 1];
    if (!layout) throw new EngineError('volume.no_layout', `no layout for training block ${tb.n}`);
    const snap = { weeks: cross.weeksOut.length, warnings: cross.warnings.length, blocks: cross.blockTargetsOut.length, prevTotal: cross.prevTotal, prevCircuit: cross.prevCircuit, prevStage: cross.prevStage, lastStair: cross.lastStair, lastBlock: cross.lastBlock };
    let hints = null;
    const passes = HS && HS.enabled ? Math.max(1, HS.passes || 3) : 1;
    for (let pass = 0; pass < passes; pass++) {
      const found = runBlock(ctx, tb, layout, cross, hints);
      if (!found || pass === passes - 1) break;
      const next = { start: { ...((hints && hints.start) || {}) }, top: { ...((hints && hints.top) || {}) }, two_day_top: { ...((hints && hints.two_day_top) || {}) } };
      let changed = false;
      // (v0.6 G-207: a 2-day group whose optional-day bonus passed its limit is planned one set lower - the run starts again clean)
      for (const [g, v] of Object.entries(found.two_day_top || {})) if (!(g in next.two_day_top) || next.two_day_top[g] > v) { next.two_day_top[g] = v; next.start = {}; next.top = {}; changed = true; }
      for (const [g, v] of Object.entries(found.start || {})) if (!(g in next.start) || next.start[g] < v) { next.start[g] = v; changed = true; }
      for (const [g, v] of Object.entries(found.top || {})) if (!(g in next.top) || next.top[g] > v) { next.top[g] = v; changed = true; }
      if (!changed) break;
      cross.weeksOut.length = snap.weeks; cross.warnings.length = snap.warnings; cross.blockTargetsOut.length = snap.blocks;
      cross.prevTotal = snap.prevTotal; cross.prevCircuit = snap.prevCircuit; cross.prevStage = snap.prevStage; cross.lastStair = snap.lastStair; cross.lastBlock = snap.lastBlock;
      hints = next;
    }
  }
  // the 2-day rule is said once, up front (R4-SES-03)
  const D9 = derived.D9_start_sets || {};
  const TD = model.rules.volume.two_day;
  if (D9.two_day && TD) cross.warnings.unshift({ code: 'two_day_rule', key: 'warning.two_day_rule', args: { days: derived.days_per_week, low: TD.weekly_sets[0], high: TD.weekly_sets[1], suggest: TD.suggest_days } });
  return { weeks: cross.weeksOut, athletic: athleticBudget(derived, shape, model), warnings: dedupeWarnings(cross.warnings), block_targets: cross.blockTargetsOut };
}

/**
 * One training block (all its weeks). Appends to cross.weeksOut / warnings / blockTargetsOut.
 * `hints` (fix round 2): {start: {group: sets}, top: {group: sets}} from an earlier run of the same block - what its weeks really
 * held. Returns the hints this run found ({start, top}), or null when its weeks kept the schedule.
 */
function runBlock(ctx, tb, layout, cross, hints = null) {
  const { derived, shape, selections, model, fillSlot } = ctx;
  const R = model.rules, V = R.volume, P = R.placement, S = R.session, PG = R.stairway.progression;
  const X = linesOf(model);
  const L = derived.D3_client_level.level;
  const D9 = derived.D9_start_sets;
  const prio = D9.priority || [];
  const GROUPS = groupOrder(model);
  const circuitPlan = isCircuitPlan(derived, model);
  const { weeksOut, warnings, blockTargetsOut } = cross;
  const selFor = (eb) => (selections || []).find(s => s && s.exercise_block === eb) || (selections || [])[eb - 1] || null;
  const profile = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;

  // ---- block state
  const days = (layout.days || []).filter(d => (d.blocks || []).length).map(d => ({ ...d, slots: flattenDay(d), added: [] }));
  const isMainDi = (di) => days[di].kind === 'main';
  const mainDi = days.map((d, di) => di).filter(isMainDi);
  const optDi = days.map((d, di) => di).filter(di => days[di].kind === 'optional');
  const wks = shape.weeks.filter(w => w.training_block === tb.n);
  const stair = tb.type === 'stairway';
  const flatSets = stair && tb.factor && tb.factor.flat_sets === true;
  const N = stair ? tb.stair_N : null;
  let sets = {}, fills = {};
  // (G-311: memo of a pure key read while a candidate list is sorted - by candidate object, or by day index)
  // (a candidate carries its index `_i` in the list being sorted; a day is its index in `days`)
  const memoC = (fn) => { const a = []; return (c) => { let v = a[c._i]; if (v === undefined) { v = fn(c); a[c._i] = v; } return v; }; };
  const memoDi = (fn) => { const a = []; return (di) => { let v = a[di]; if (v === undefined) { v = fn(di); a[di] = v; } return v; }; };
  // (G-311, performance only: every write to `sets` or `fills` goes through these four, which bump `stateVer`; the credit tallies are
  // kept per version and read again only after a write - see tally)
  let stateVer = 0;
  // (G-311: `live` - running sums of the week's credited sets per group (all days / training days) and of its pressing and pulling sets,
  // kept up to date on every write while they match the state; every credit is 1, 0.5 or 0.25 and every set count a whole number, so
  // these sums are exact and equal, value for value, to a tally read from scratch. They are read only for values (groupSum, the spill
  // check, pushPull); a tally handed out is still read from scratch, in its own key order.)
  let live = null;
  const liveOn = () => !!live && live.ver === stateVer && listsFresh();
  const liveMove = (id, sign) => {
    const refs = live.byId.get(id);
    if (!refs) return;
    for (const [slot, di] of refs) liveAdd(slot, di, sign);
  };
  const write = (id, fn) => {
    const on = liveOn();
    if (on) liveMove(id, -1);
    fn();
    stateVer++;
    if (on) { liveMove(id, 1); live.ver = stateVer; }
  };
  const setS = (id, v) => write(id, () => { sets[id] = v; });
  const delS = (id) => write(id, () => { delete sets[id]; });
  const setF = (id, f) => write(id, () => { fills[id] = f; });
  const delF = (id) => write(id, () => { delete fills[id]; });
  const added = [];
  // (G-311, performance only: the day lists and the [slot, day] pairs are rebuilt only when a day's slots or added list changes - a
  // push, or a new array; the lists handed out are frozen snapshots in the same order as before)
  let dayLists = null, allPairs = null;
  const listsFresh = () => {
    if (!dayLists) return false;
    for (let i = 0; i < days.length; i++) {
      const c = dayLists[i], d = days[i];
      if (c.slots !== d.slots || c.slotsLen !== d.slots.length || c.added !== d.added || c.addedLen !== d.added.length) return false;
    }
    return true;
  };
  const syncLists = () => {
    if (listsFresh()) return;
    stateVer++;
    dayLists = days.map(d => ({ slots: d.slots, slotsLen: d.slots.length, added: d.added, addedLen: d.added.length, list: Object.freeze([...d.slots, ...d.added]) }));
    const pairs = [];
    dayLists.forEach((c, di) => { for (const s of c.list) pairs.push(Object.freeze([s, di])); });
    allPairs = Object.freeze(pairs);
  };
  const daySlotsOf = (di) => { syncLists(); return dayLists[di].list; };
  // (G-311: a slot's place in its day's list - the first place, as indexOf reads it)
  const posInDay = (di, s) => {
    syncLists();
    const c = dayLists[di];
    if (!c.pos) { c.pos = new Map(); c.list.forEach((x, i) => { if (!c.pos.has(x)) c.pos.set(x, i); }); }
    const v = c.pos.get(s);
    return v === undefined ? -1 : v;
  };
  const allSlots = () => { syncLists(); return allPairs; };
  const kindCache = new Map();
  const kindOf = (slot) => { const b = slot.bucket; let k = kindCache.get(b); if (k === undefined && !kindCache.has(b)) { k = model.bucket(b).kind; kindCache.set(b, k); } return k; };
  const isCircuitSlot = (slot) => circuitPlan && slot.circuit !== null && slot.circuit !== undefined;
  // (engine 0.7, G-252: a joint-care slot that holds a lifting pattern - the shoulder-health overhead press - is joint care, not a
  // resistance set, like every other joint-care slot)
  const isResistance = (slot) => slot.role !== 'prehab' && (RESISTANCE_KINDS.includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin));
  const active = (slot) => isNum(sets[slot.slot_id]) && sets[slot.slot_id] > 0;
  // (G-311: the credits of a slot are kept with the fill they were read for and read again only when the fill changes)
  const crMemo = new WeakMap();
  const crEntry = (slot) => {
    const f = fills[slot.slot_id];
    let e = crMemo.get(slot);
    if (e && e.f === f && e.id === (f ? f.exercise_id : undefined) && e.fb === (f ? f.bucket : undefined) && e.b === slot.bucket && e.cv === slot.counts_as_volume) return e;
    e = { f, id: f ? f.exercise_id : undefined, fb: f ? f.bucket : undefined, b: slot.bucket, cv: slot.counts_as_volume, cr: creditsOf(model, slot, f), g: null, l: null };
    crMemo.set(slot, e);
    return e;
  };
  const crOf = (slot) => crEntry(slot).cr;
  const gcOf = (slot) => groupCreditsC(model, crOf(slot) || EMPTY_CREDITS);
  const hasPick = (slot) => !!(fills[slot.slot_id] && fills[slot.slot_id].exercise_id);

  // ---- the group a slot's sets belong to: the group its exercise trains as a main mover (the template's group first)
  let owner = {};
  const ownerOfSlot = (slot) => {
    if (!isResistance(slot) || isCircuitSlot(slot) || slot.counts_as_volume === false || !hasPick(slot)) return null;
    const gc = gcOf(slot);
    const full = GROUPS.filter(g => (gc[g] || 0) >= 1 - EPS);
    if (slot.group && full.includes(slot.group)) return slot.group;
    if (full.length) return full[0];
    if (slot.group && (gc[slot.group] || 0) > EPS) return slot.group; // dips: 0.5 triceps / 0.5 chest, placed as a triceps exercise (LIB-16)
    const best = GROUPS.filter(g => (gc[g] || 0) > EPS).sort((a, b) => gc[b] - gc[a] || GROUPS.indexOf(a) - GROUPS.indexOf(b))[0];
    return best || null;
  };
  let ownerVer = 0; // (G-311: bumped on every write to `owner`)
  const refreshOwners = () => { owner = {}; ownerVer++; for (const [s] of allSlots()) owner[s.slot_id] = ownerOfSlot(s); ownerVer++; };
  const groupSlotsMemo = new Map();
  const slotsOfGroup = (g) => {
    const all = allSlots();
    const e = groupSlotsMemo.get(g);
    if (e && e.all === all && e.ver === ownerVer) return e.list;
    const list = Object.freeze(all.filter(([s]) => owner[s.slot_id] === g));
    groupSlotsMemo.set(g, { all, ver: ownerVer, list });
    return list;
  };

  // ---- per-exercise bounds (allocation step 3): 2-5 sets (2-4 for L1); calves 3 on a leg day; Focus / bonus / optional-day
  // calves 2-3 (OBSERVED BYOP optional days, ORD-11)
  const maxEx = P.max_sets_per_exercise[L];
  const OF = P.optional_focus || { sets: [2, 3] };
  const BN = P.bonus || { sets: [2, 3], max_added_per_optional_day: 2, order: GROUPS };
  const calfPer = V.calves.per_leg_day[L];
  const calfOpt = V.calves.optional_slot_sets || [2, 3];
  // v0.5 fix round 1 (rules.placement.x1; the coach-eye reviews of samples 04 / 06 / 07):
  //  - an isolation exercise at the end of a training day holds 2-3 sets and takes a 4th in the hardest weeks only (VOL-16 '3 sets
  //    on compounds, 2 on isolation'; VOL-07 more of a small muscle comes 'as a bonus exercise'); what is left goes to the bonus
  //    exercise of the optional day, which may run to rules.placement.bonus.sets[1]
  //  - a class lift (the day's 'work' lift of the CrossFit-style class) never starts under its sheet's sets (OT17 / OT18: 3 sets)
  //  - calves with no optional-day Calves slot climb on the leg days to the weekly floor (VOL-17 'treated like any other muscle')
  const PX = P.x1 || {};
  // v0.5 fix round 2 (rules.placement.x2; the second coach-eye reviews of the 8 samples)
  const PX2 = P.x2 || {};
  let boundWeek = null; // the week the bounds are read for
  // (fix round 2, samples 04 / 06: 'arms sit flat for 8 weeks and take all their steps in weeks 9-10' - the 4th set of an isolation
  // exercise is open from the second half of the stairway, so a small group's steps are spread over the block; R2-PER-03)
  const isoFourthOpen = () => {
    const M = PX.iso_main_day_max;
    if (!boundWeek) return false;
    if (boundWeek.phase === M.phase) return true;
    const sh = PX2.iso_fourth_from_share;
    return isNum(sh) && isNum(boundWeek.stair_week) && isNum(N) && N > 1 && boundWeek.stair_week > N * sh + EPS;
  };
  const isoMainMax = () => { const M = PX.iso_main_day_max; if (!M) return maxEx; return Math.min(maxEx, isoFourthOpen() ? M.hardest : M.default); };
  const workMin = (slot) => (slot.role === 'work' && (PX.work_min_from_hint_families || []).includes(layout.family) && Array.isArray(slot.sets_hint) ? Math.min(maxEx, Math.max(P.min_sets, slot.sets_hint[0])) : P.min_sets);

  let calfMainMax = calfPer; // set once the block knows whether an optional-day Calves slot carries the rest (below)
  const boundsOf0 = (slot, di) => {
    if (slot.origin === 'bonus') return isMainDi(di) && PX.main_day_extra ? [PX.main_day_extra.sets[0], Math.min(isoMainMax(), PX.main_day_extra.sets[1])] : [BN.sets[0], Math.min(maxEx, BN.sets[1])];
    if (slot.bucket === 'ISO_CALF') return isMainDi(di) ? [calfPer, (prio.includes('calves') ? Math.max(calfPer, P.min_sets + 2, calfMainMax) : calfMainMax)] : [calfOpt[0], calfOpt[1]];
    if (kindOf(slot) === 'focus') return [OF.sets[0], OF.sets[1]];
    if (kindOf(slot) === 'isolation' && isMainDi(di) && !isCircuitSlot(slot)) return [P.min_sets, isoMainMax()];
    return [workMin(slot), maxEx];
  };
  // v0.6 (rules.placement.x3; the round-4 coach-eye reviews)
  //  - G-101: a flat press of an athlete's template holds at most 4 sets (reviews 02 / 03 M2: a dumbbell bench at 5 sets while the
  //    day's main leg lift held 2-3)
  //  - G-108: in the first week of a physique block a compound lift holds at most 4 sets and an isolation exercise 3, so the first
  //    lift has a step left (VOL-01, VOL-07; OBSERVED 4 TRACKS AESTHETICS 3 -> 4 -> 5 sets; review 06 M1); a Focus group keeps its numbers
  const PX3 = P.x3 || {};
  // v0.7 (rules.placement.x7; COACH-R5, coach_answers_round5.md)
  const PX7 = P.x7 || {};
  // COACH-CH5 CH5-03 ('they should reach more if needed, no cap until 35'): a big group the training days cannot take to its planned
  // final sets may take a bonus exercise (the optional day; a training day when there is none); the absolute weekly ceiling
  const BIGNEED = !!(PX3.bonus_small_only && PX3.bonus_small_only.big_when_needed);
  const GMAX = V.x3 && V.x3.group_max && isNum(V.x3.group_max.sets) ? V.x3.group_max.sets : null;
  const focusGroup = (g) => !!g && (X.linesOfGroup[g] || []).some(l => prio.includes(l));
  const bigGroup = (g) => !!g && (X.linesOfGroup[g] || []).some(l => ((X.defs[l] || {}).class) === 'big');
  // v0.6 G-200: the arms of a 2-day plan are dosed in their slot (rules.placement.x3.two_day_arm_slot)
  const ARM2 = D9.two_day && !circuitPlan && PX3.two_day_arm_slot && Array.isArray(PX3.two_day_arm_slot.sets) ? PX3.two_day_arm_slot : null;
  const armSlotGroup = (g) => !!ARM2 && !!g && (ARM2.groups || []).includes(g) && !focusGroup(g);
  // v0.6 G-207: the groups a 2-day plan's training days hold at the band besides the big ones (the shoulders), not a Focus group
  const twoDayAlso = (g) => !!g && !!D9.two_day && !circuitPlan && !!PX3.two_day_main_floor && (PX3.two_day_main_floor.also_groups || []).includes(g) && !focusGroup(g);
  const WL = PX3.work_lead || null;
  // v0.6 G-217..G-222 (VOL-07 '... I add it to the first exercise on the list'; CH5-03 'if needed'; R3-VOL-03; R4-SES-03; reviews r7
  // 02 / 08 M1): one rule for every bonus exercise of a group - rules.placement.x3.bonus_last. The template's own extra station (the A
  // day's rear-delt exercise, R4-SES-05) and a muscle's direct-minimum exercise (side delts, R2-VOL-04) are template work, not a bonus.
  const BL = PX3.bonus_last && PX3.bonus_last.enabled ? PX3.bonus_last : null;
  const tplExtraIds = new Set();
  const isGroupBonus = (s) => !!s && s.origin === 'bonus' && !tplExtraIds.has(s.slot_id);
  const dormant = new Map();   // slot_id -> the exercise block a training day's bonus opens with (G-217: not before it is needed)
  const gbWeek = new Map();    // v0.7 G-238: bonus key -> the stair week index it comes in (planStairs)
  const dormantWk = new Map(); // v0.7 G-238: slot_id -> the stair week index a bonus waits for, at 0 sets
  const bonusGroupsAll = new Set(); // the groups that hold a bonus exercise in this block (open, waiting or scratch)
  const wpOn = () => { const W = PX3.work_over_paired; return !!W && (W.families || []).includes(layout.family) && (!W.modifiers || W.modifiers.includes(D9.modifier_id)); };
  // v0.7 G-236 (COACH-R5 R5-ATH-12 'Start the heavy deadlift at 3 sets and give it the next added set ahead of the other hip lifts'):
  // the week's counted heavy hinge - the main two-leg hinge of an athletic B day (rules.placement.x7.heavy_hinge_lead)
  const HH = PX7.heavy_hinge_lead && PX7.heavy_hinge_lead.enabled ? PX7.heavy_hinge_lead : null;
  const extraTop = new Map(); // v0.7 G-235: slot_id -> {eb, add, group} - the one-set shortfall's lift (set by planStairs)
  const hingeOff = new Set(); // (a heavy hinge whose start of 3 would take its group above its final sets keeps its fewest sets - planStairs)
  // v0.7 G-291 / G-292 (VOL-07; rules.placement.x7.lead_first_step, later_not_above_lead; review r9 07 M1)
  const LFS = PX7.lead_first_step && PX7.lead_first_step.enabled ? PX7.lead_first_step : null;
  const LNA = PX7.later_not_above_lead && PX7.later_not_above_lead.enabled ? PX7.later_not_above_lead : null;
  let leadBase = null;
  // (G-292: would `n` sets put this later lift of a training day above the day's first lift of a group it credits with min_credit+)
  const aboveLead = (slot, di, n) => {
    if (!LNA || !isMainDi(di) || slot.origin === 'bonus' || isCircuitSlot(slot) || !hasPick(slot)) return false;
    const gc = gcOf(slot), list = daySlotsOf(di), at = list.indexOf(slot);
    for (const g2 of GROUPS) {
      // (a group the lift trains as its prime mover keeps its own staircase - only a group it half-credits, the dip's chest, is read here)
      if ((gc[g2] || 0) < (LNA.min_credit || 0.5) - EPS || (gc[g2] || 0) >= 1 - EPS || owner[slot.slot_id] === g2) continue;
      const lead = leadSlotOf(di, g2);
      if (lead && lead !== slot && list.indexOf(lead) < at && n > (sets[lead.slot_id] || 0)) return true;
    }
    return false;
  }; // the sets at the end of the block's first week: a lead lift above them has taken its first step (G-291)
  const heavyHinge = (slot, di) => !!HH && !hingeOff.has(slot.slot_id) && (HH.families || []).includes(layout.family) && isMainDi(di) && slot.origin !== 'bonus' && !isCircuitSlot(slot) &&
    slot.role === HH.role && slot.bucket === HH.bucket && !!fills[slot.slot_id] && (fills[slot.slot_id].flags || []).includes(HH.flag);
  // (G-311: how many exercises of a group hold a pick and are not switched off - kept per state: sets, picks and lists by stateVer,
  // owners by ownerVer)
  let gpcMemo = null;
  const groupPickCount = (g0) => {
    const all = allSlots();
    if (!gpcMemo || gpcMemo.ver !== stateVer || gpcMemo.over !== ownerVer) gpcMemo = { ver: stateVer, over: ownerVer, m: new Map() };
    let v = gpcMemo.m.get(g0);
    if (v === undefined) { v = all.filter(([s2]) => owner[s2.slot_id] === g0 && hasPick(s2) && sets[s2.slot_id] !== 0).length; gpcMemo.m.set(g0, v); }
    return v;
  };
  const boundsOf = (slot, di) => {
    const b0 = boundsOf0(slot, di);
    const b = HH && heavyHinge(slot, di) ? [Math.max(b0[0], Math.min(maxEx, HH.start_sets)), Math.max(b0[1], Math.min(maxEx, HH.start_sets))] : b0;
    if (slot.bucket === 'ISO_CALF' || isCircuitSlot(slot)) return b;
    let hi = b[1];
    const AP = PX3.athlete_press_max;
    // v0.7 G-232 (COACH-R5 R5-VOL-09 'It can go up more as well depends on focus and goals'): the athlete's press cap is the default;
    // with the group a Focus muscle of the person the press may go to the level's per-exercise top (rules.placement.x7.athlete_press_focus)
    const apFocusFree = !!(PX7.athlete_press_focus && PX7.athlete_press_focus.enabled) && focusGroup(owner[slot.slot_id]);
    if (AP && (AP.families || []).includes(layout.family) && isNum(AP.max) && !apFocusFree) {
      // (only while the group keeps other exercises to carry its sets: a pitcher's one chest press is not held under the floor)
      const g0 = owner[slot.slot_id];
      const many = !!g0 && groupPickCount(g0) >= (AP.min_group_exercises || 0);
      const apHeld = (s2) => { const e2 = exOf(model, fills[s2.slot_id]); return !!e2 && (AP.credit_classes || []).includes(e2.credit_class) && !(e2.tags || []).some(t => (AP.not_tags || []).includes(t)); };
      if (many && apHeld(slot)) hi = Math.min(hi, AP.max);
      // v0.6 G-209 (VOL-07 'add it to the first exercise on the list ... 4, 3, 3'; rules.placement.order_rule first_below_first; review
      // r6 02 M1: Tuesday's incline DB press at 5 sets over the bench press at 4 in weeks 11-12): a later lift of the group on the same
      // training day never holds more than the day's first lift of the group, which the athlete's press cap holds - the group's last
      // sets go to a bonus exercise (CH5-03) or it is capped and said (G-107)
      if (many && AP.later_capped && isMainDi(di) && slot.origin !== 'bonus' && !isCircuitSlot(slot)) {
        const lead = daySlotsOf(di).find(s2 => owner[s2.slot_id] === g0 && hasPick(s2) && s2.origin !== 'bonus' && kindOf(s2) === 'resistance' && !isCircuitSlot(s2));
        if (lead && lead !== slot && daySlotsOf(di).indexOf(lead) < daySlotsOf(di).indexOf(slot) && apHeld(lead)) hi = Math.min(hi, AP.max);
      }
    }
    // v0.6 G-200 (R4-SES-03 the 6-8 band is for the big groups; R4-SES-05 slot 5; review r5 08 M1): on a 2-day plan an arm's exercise
    // of a training day holds rules.placement.x3.two_day_arm_slot.sets (2-3)
    if (armSlotGroup(owner[slot.slot_id]) && isMainDi(di) && slot.origin !== 'bonus') return [Math.min(b[0], ARM2.sets[0]), Math.min(Math.max(b[0], hi), ARM2.sets[1])];
    // v0.6 G-207 (review r6 08 M1): on a 2-day plan the optional-day bonus of a group the training days hold at the band
    // (rules.placement.x3.two_day_main_floor.also_groups) is a fixed extra at its fewest sets
    if (slot.origin === 'bonus' && !isMainDi(di) && twoDayAlso(owner[slot.slot_id])) return [b[0], b[0]];
    // v0.7 G-235 (COACH-R5 R5-VOL-11 'Give the day's first press a 5th set in the last block, so it reaches 13'): the lift planStairs
    // named for a group a whole bonus exercise would overshoot takes its extra set in the block's last exercise block, never above the
    // level's per-exercise top
    const xt = extraTop.get(slot.slot_id);
    if (xt && boundWeek && isNum(boundWeek.exercise_block) && boundWeek.exercise_block >= xt.eb) hi = Math.min(maxEx, hi + xt.add);
    const SM = PX3.start_max_sets;
    if (SM && boundWeek && boundWeek.stair_week === 1 && stair && !flatSets && (SM.families || []).includes(layout.family) && !(SM.focus_exempt && focusGroup(owner[slot.slot_id]))) {
      const k = kindOf(slot);
      hi = Math.min(hi, (k === 'isolation' || k === 'focus' || slot.origin === 'bonus') ? SM.isolation : SM.compound);
    }
    return [b[0], Math.max(b[0], hi)];
  };

  // ---- credits
  // (G-311: a tally is kept with the state version it was read at - stateVer moves on every write to sets / fills and on every change
  // of the day lists - and handed out as a copy, in the same key order)
  const tallyMemo = new Map();
  const tallyOf = (mo, kind) => {
    syncLists();
    const key = (mo ? '1' : '0') + kind;
    const e = tallyMemo.get(key);
    if (e && e.ver === stateVer) return e.w;
    const w = {};
    for (let di = 0; di < days.length; di++) {
      if (mo && !isMainDi(di)) continue;
      const list = dayLists[di].list;
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        const n = sets[s.slot_id];
        if (!isNum(n) || n <= 0) continue;
        const e = crEntry(s);
        const cr = e.cr;
        if (!cr) continue;
        const per = kind === 'line' ? (e.l || (e.l = lineCreditsC(model, cr))) : kind === 'group' ? (e.g || (e.g = groupCreditsC(model, cr))) : cr;
        for (const m in per) w[m] = (w[m] || 0) + n * per[m];
      }
    }
    tallyMemo.set(key, { ver: stateVer, w });
    return w;
  };
  const tally = (mo, kind) => ({ ...tallyOf(mo, kind) });
  const directRaw = () => {
    const w = {};
    for (const [s] of allSlots()) if (active(s)) {
      const cr = crOf(s) || {};
      const ex = exOf(model, fills[s.slot_id]);
      for (const [m, c] of Object.entries(cr)) if (c >= 1 - EPS || (m === 'triceps' && ex && ex.credit_class === 'DIPS')) w[m] = (w[m] || 0) + sets[s.slot_id];
    }
    return w;
  };
  // (G-311: one group's credited sets without building the whole tally - the same additions in the same order; kept per state version)
  const groupSum = (mo, g) => { const L0 = liveNow(); return (mo ? L0.main : L0.all)[g] || 0; };
  const credited = (g) => groupSum(false, g);
  const liveAdd = (slot, di, sign) => {
    const n = sets[slot.slot_id];
    if (!isNum(n) || n <= 0) return;
    const e = crEntry(slot);
    if (e.cr) {
      const per = e.g || (e.g = groupCreditsC(model, e.cr));
      const main = isMainDi(di);
      for (const m in per) {
        live.all[m] = (live.all[m] || 0) + sign * n * per[m];
        if (main) live.main[m] = (live.main[m] || 0) + sign * n * per[m];
      }
    }
    if (!isCircuitSlot(slot)) { if (isPress(slot)) live.push += sign * n; else if (isPull(slot)) live.pull += sign * n; }
  };
  const liveBuild = () => {
    syncLists();
    live = { ver: stateVer, all: {}, main: {}, push: 0, pull: 0, byId: new Map() };
    for (const pr of allPairs) {
      const id = pr[0].slot_id;
      if (!live.byId.has(id)) live.byId.set(id, []);
      live.byId.get(id).push(pr);
      liveAdd(pr[0], pr[1], 1);
    }
  };
  const liveNow = () => { syncLists(); if (!(live && live.ver === stateVer)) liveBuild(); return live; };
  const totalRes = (mo = false) => allSlots().reduce((a, [s, di]) => a + (isResistance(s) && active(s) && (!mo || isMainDi(di)) ? sets[s.slot_id] : 0), 0);

  // ---- fixed sets: everything the group stairway does not size (core, athletic, Olympic by the budget, circuits by rounds)
  const olyOrder = days.filter(d => d.kind === 'main').flatMap(d => d.slots.filter(s => s.bucket === 'AP_TRIPLE_EXT').map(s => s.slot_id));
  const olySets = (slot, ws) => olympicSetsForIndex(derived, model, olyOrder.length, ws, Math.max(0, olyOrder.indexOf(slot.slot_id)));
  // the optional-day Calves slot (OBSERVED BYOP optional days) is used while the main leg days hold fewer than
  // rules.volume.calves.optional_slot_below_leg_days calf exercises, or calves are a Focus muscle
  const calfOptOn = !isNum(V.calves.optional_slot_below_leg_days) || legDaysOfLayout(layout) < V.calves.optional_slot_below_leg_days || prio.includes('calves');
  // v0.5 fix round 1 (sample 07 major: a 6-day push / pull / legs plan held 6 calf sets for 12 weeks; VOL-17 'they should be treated
  // like any other muscle'): with no optional-day Calves slot to carry the rest, the leg days' calf exercise climbs to the weekly floor
  {
    const legN = legDaysOfLayout(layout);
    const optCalfSlot = optDi.some(di => days[di].slots.some(s => s.bucket === 'ISO_CALF'));
    if (V.calves.climb_without_optional && !circuitPlan && !(optCalfSlot && calfOptOn) && legN > 0 && calfPer * legN < V.calves.weekly_floor) {
      calfMainMax = Math.min(maxEx, Math.max(calfPer, Math.ceil(V.calves.weekly_floor / legN - EPS)));
    }
  }
  // v0.5 / V4: optional-day Focus slots that are closed for this training block (see closeSurplusFocus)
  const closedFocus = new Set();
  const fixedSets = (slot, ws, di) => {
    const k = kindOf(slot);
    if (NO_SET_KINDS.includes(k) || NO_SET_BUCKETS.includes(slot.bucket)) return null;
    if (closedFocus.has(slot.slot_id)) return 0;
    // a circuit station runs the week's rounds; a station with no exercise for this kit is not in the circuit (0 sets, from week 1)
    if (isCircuitSlot(slot) && ws.circuit) return hasPick(slot) || slot.bucket === 'COND_CIRCUIT' ? ws.circuit.rounds : 0;
    if (slot.bucket === 'COND_CIRCUIT') return null;
    if (slot.text_key && !hasPick(slot)) return null;
    if (!hasPick(slot)) return 0;
    if (slot.bucket === 'COND_SPRINT_BUYOUT' && buyoutBouts(slot, ws) !== null) return buyoutBouts(slot, ws);
    if (slot.bucket === 'ISO_CALF' && !isMainDi(di) && !calfOptOn) return 0;
    if (slot.bucket === 'AP_TRIPLE_EXT') {
      const per = olySets(slot, ws);
      if (isNum(per)) return per;
      const ex = exOf(model, fills[slot.slot_id]);
      if (ex && ex.athletic && ex.athletic.olympic_tier === 'L1' && ['clean', 'snatch', 'jerk'].includes(ex.athletic.olympic_family)) {
        const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
        const idx = Math.min(Math.max(ws.n - eb.weeks[0], 0), R.olympic.ramp.length - 1);
        return R.olympic.ramp[idx].sets; // PER-09 ramp 4 x 8 -> 4 x 4
      }
    }
    if (owner[slot.slot_id]) return boundsOf(slot, di)[0];
    if (Array.isArray(slot.sets_hint)) return slot.sets_hint[0];
    if (isNum(slot.default_sets)) return slot.default_sets;
    const D = S.default_sets;
    if (k === 'resistance') return D.compound;
    if (k === 'isolation' || k === 'functional') return D.isolation;
    if (k === 'core') return D.core;
    if (k === 'athletic' || k === 'power') return D.athletic;
    if (k === 'focus') return D.focus;
    return D.min;
  };
  // v0.5 fix round 2 (sample 02 major; OBSERVED BASEBALL Part E: 1-3 bouts of 10-20 cal; R2-PER-03 everything climbs): a buy-out
  // runs 1, then 2, then 3 bouts by exercise block, never more total work than his biggest sheet line
  function buyoutBouts(slot, ws) {
    const BP = R.conditioning.buyout_pool, BX = BP && BP.x2;
    if (!BX || !stair) return null;
    const ebI = Math.max(0, (ws.exercise_block || tb.first_exercise_block) - tb.first_exercise_block);
    let bouts = BX.bouts_by_block[Math.min(ebI, BX.bouts_by_block.length - 1)];
    const f = fills[slot.slot_id];
    const m = f && f.exercise_id ? /calorie-effort-(\d+)-cal/.exec(f.exercise_id) : null;
    if (m && isNum(BX.max_total_cal)) bouts = Math.max(1, Math.min(bouts, Math.floor(BX.max_total_cal / Number(m[1]) + EPS)));
    return Math.max(BP.bouts[0], Math.min(BP.bouts[1], bouts));
  }
  const setFills = (sel) => { for (const d of days) for (const s of d.slots) setF(s.slot_id, sel && sel.fills ? (sel.fills[s.slot_id] || null) : null); };
  const refillAdded = (n) => {
    for (const s of added) {
      const f = typeof fillSlot === 'function' ? fillSlot(s, n) : null;
      if (!f || !f.exercise_id) continue;
      const keep = fills[s.slot_id];
      setF(s.slot_id, f);
      if (ownerOfSlot(s) !== s.group) setF(s.slot_id, keep); // the bonus exercise keeps training its group
    }
  };

  // ---- one more set for group g: the exercise with the fewest sets, the earlier one on a tie (VOL-07); the day after the one
  // used last (R3-VOL-03); the main days before the optional day
  let lastDay = {};
  // v0.5 fix round 1 - who takes a group's NEXT set (the steps of the stairway; the first week's split stays fewest-first):
  //  - inside a group with a Focus muscle (hips with glutes, shoulders with side delts) the exercises that train the Focus muscle
  //    as a main mover step first (R3-SES-01 'the program should bias more toward glutes ... an extra set or two or three'; sample
  //    06 major: every hips step went to the hamstring lifts); on a physique plan the shoulders' steps go to the side raises
  //    first (R2-VOL-04 side delts are a small muscle with their own sets; sample 07 major)
  //  - in a test week the tested lift takes no step: the test replaces its top set, it never adds to it (R2-PER-07; samples 01 / 07)
  //  - pressing never runs ahead of pulling for a sport profile that asks for it (VOL-18 'we need to balance this out'; samples
  //    02 / 03 major): a press takes no set that would put the week's pressing sets above its pulling sets
  const stepFirstOf = (g) => {
    const SF = PX.step_first;
    if (!SF) return null;
    const lines = (X.linesOfGroup[g] || []);
    const multi = (X.groups.includes(g) ? ((R.muscles.groups.members[g] || []).length > 1) : false);
    // (a client's own Focus picks name the muscle - 'side_delts', 'glutes'; a Focus line of one muscle steers nothing inside its group)
    const own = [...new Set([...(derived.priority_choices || []), ...(derived.priority_muscles || [])])].filter(m => (R.muscles.groups.members[g] || []).includes(m));
    if (SF.focus && multi && own.length && lines.some(l => prio.includes(l))) return own;
    const gm = SF.group_muscle && SF.group_muscle[g];
    if (gm && (gm.families || []).includes(layout.family)) return [gm.muscle];
    return null;
  };
  const trainsFirst = (slot, muscles) => { const cr = crOf(slot) || {}; return muscles.some(m => (cr[m] || 0) >= 1 - EPS); };
  let stepWeek = null;        // the week whose steps are being placed (null: the first week's split and scratch runs)
  let testedSlots = new Set(); // the tested lifts of `stepWeek`
  const PPB = V.push_pull || null;
  let ppRatio = (() => {
    if (!PPB || circuitPlan || !profile || !isNum(profile.pull_per_push) || profile.pull_per_push < PPB.applies_from) return null;
    if ((PPB.exempt_focus_lines || []).some(l => prio.includes(l))) return null;
    return { want: Math.min(PPB.max, Math.max(PPB.min, profile.pull_per_push)), hard: PPB.hard };
  })();
  const classMemo = new WeakMap(); // (G-311: a slot's credit class, kept with the pick it was read for)
  const classOfSlot = (slot) => {
    const f = fills[slot.slot_id];
    const e = classMemo.get(slot);
    if (e && e.f === f && e.id === (f ? f.exercise_id : undefined)) return e.c;
    const ex = exOf(model, f);
    const c = ex ? ex.credit_class : null;
    classMemo.set(slot, { f, id: f ? f.exercise_id : undefined, c });
    return c;
  };
  // (joint care is not training volume - rules.prehab.credits 'none': a prone Y-T raise in the arm-care block is no pulling set)
  const careSlot = (slot) => slot.role === 'prehab' || kindOf(slot) === 'prehab';
  const isPress = (slot) => !!PPB && !careSlot(slot) && PPB.push_classes.includes(classOfSlot(slot));
  const isPull = (slot) => !!PPB && !careSlot(slot) && PPB.pull_classes.includes(classOfSlot(slot));
  const pushPull = () => { const L0 = liveNow(); return { push: L0.push, pull: L0.pull }; };
  // v0.6: the two exposures of one day type (A1 / A2, 'Legs 1' / 'Legs 2', the same day type twice) alternate their steps (R3-VOL-03);
  // the v0.6 day preferences below never choose between them
  const stemMemo = days.map(d => String(d.day_type || d.weekday).replace(/[ ]?[12]$/, '')); // (G-311: a day's type never changes in a block)
  const stemOf = (di) => stemMemo[di];
  const twinDays = (a, b) => a !== b && stemOf(a) === stemOf(b);
  // (G-220: a template station's place in its day type - 'B1.s08' and 'B2.s08' are the same station on the two exposures - and which
  // exposure of its day type a training day is, in the week's order)
  const stationPos = (s) => (s.origin === 'template' && s.station_id ? String(s.station_id).split('.').slice(1).join('.') : '#' + s.slot_id);
  const expMemo = days.map((d0, di) => days.map((d, dj) => dj).filter(dj => stemOf(dj) === stemOf(di)).indexOf(di));
  const exposureOf = (di) => expMemo[di];
  // v0.6 G-100: the first lift of group g on a training day (its main lift)
  const leadSlotOf0 = (di, g) => (isMainDi(di) ? daySlotsOf(di).find(s => owner[s.slot_id] === g && active(s) && s.origin !== 'bonus' && kindOf(s) === 'resistance' && !isCircuitSlot(s)) || null : null);
  // (G-311: kept per state - sets, picks and day lists by stateVer, owners by ownerVer)
  let leadMemo = null;
  const leadSlotOf = (di, g) => {
    syncLists();
    if (!leadMemo || leadMemo.ver !== stateVer || leadMemo.over !== ownerVer) leadMemo = { ver: stateVer, over: ownerVer, m: new Map() };
    const k = di + '|' + g;
    let v = leadMemo.m.get(k);
    if (v === undefined) { v = leadSlotOf0(di, g); leadMemo.m.set(k, v); }
    return v;
  };
  let prevWeekSets = null;    // v0.6 G-109: the sets of the week before the one whose steps are being placed
  let balanceOn = true;
  let noRelax = false;        // true in a scratch run that asks what the exercises hold at their default bounds (fix round 2)
  let curTargets = null;      // the group numbers the running allocation works to (fix round 2: addSet reads them)
  let balanceWant = false;    // true while the block's final sets are sized (planStairs)
  let blockedByBalance = false;
  let backRoomNow = null;     // set by the running allocation: () => the back may still take a pulling set (fix round 2)
  const addSet = (g, opts = {}) => {
    blockedByBalance = false;
    // (the floor of 10 is the higher rule: an isolation exercise takes its 4th set before a trained group sits under the floor)
    const isoRelax = (s, di) => (opts.forFloor && PX.iso_main_day_max && kindOf(s) === 'isolation' && isMainDi(di) && s.bucket !== 'ISO_CALF' && !isCircuitSlot(s) && s.origin !== 'bonus' ? Math.min(maxEx, PX.iso_main_day_max.hardest) : 0);
    let cands = slotsOfGroup(g).map(([s, di]) => ({ s, di, n: sets[s.slot_id] || 0, max: Math.max(boundsOf(s, di)[1], isoRelax(s, di)), opt: isMainDi(di) ? 0 : 1, pos: posInDay(di, s) }))
      .filter(c => active(c.s) && c.n + 1 <= c.max && !(opts.mainOnly && c.opt) && !(opts.pullOnly && !isPull(c.s)) && !(opts.muscle && !(((crOf(c.s) || {})[opts.muscle] || 0) >= 1 - EPS)));
    // (the group's final sets are still reached, CX-01: with no other exercise left the tested lift takes the set)
    if (stepWeek && PX.test_week_no_step_on_tested && testedSlots.size && !(PX2.order && PX2.order.lead_first)) { const rest = cands.filter(c => !testedSlots.has(c.s.slot_id)); if (rest.length) cands = rest; }
    // v0.6 G-218 (VOL-07 'add it to the first exercise on the list'; CH5-03 'if needed'; review r7 02 M1: Tuesday's fly took chest's
    // week-9 set while the bench sat at 3 under its cap of 4): a group's bonus exercise never takes a set while a template lift of the
    // group still has room under its own top - the template's lifts fill first, whatever day they are on
    // (VOL-18 'balance this out'; rules.placement.x3.press_hold: for a group that has a bonus exercise, a press whose next set would put the
    // week's pulling under min_pull_per_push of its pressing is at its top - the bonus, not a press, takes the set; the scorer's T8-BAL-03)
    if (BL && BL.template_first && PX3.press_hold && PPB && !ppRatio && bonusGroupsAll.has(g)) {
      const pp = pushPull();
      if (pp.pull < PX3.press_hold.min_pull_per_push * (pp.push + 1) - EPS) cands = cands.filter(c => !isPress(c.s));
    }
    if (BL && BL.template_first) { const tpl = cands.filter(c => !isGroupBonus(c.s)); if (tpl.length && tpl.length < cands.length) cands = tpl; }
    // the order the candidates take the set in (a function: the balance gate below reads it twice)
    const inOrder = (cands) => {
      // (G-311: a list of one or none is never compared - nothing below has an effect but its order)
      if (cands.length < 2) return cands;
      const ring = [...new Set(cands.map(c => c.di))].sort((a, b) => a - b);
      const last = lastDay[g];
      const dist = (di) => { if (last === undefined) return ring.indexOf(di); const start = ring.findIndex(x => x > last); const at = ring.indexOf(di); return (at - (start < 0 ? 0 : start) + ring.length) % ring.length; };
      const first = stepWeek ? stepFirstOf(g) : null;
      const pri = (c) => (first && trainsFirst(c.s, first) ? 0 : 1);
      // v0.5 fix round 2 (rules.placement.x2.order; VOL-07 'first exercise first', VOL-16 '3 sets on compounds, 2 on isolation';
      // samples 01 / 06 / 07): a template exercise before the engine's extra one; a compound lift to 3 sets before anything else of
      // its group takes a set; a later exercise of a day never above an earlier one of the same group; an isolation exercise never
      // to its 4th set while a compound lift of its day still holds 2
      const OX = PX2.order || null;
      const cmp3 = OX && OX.compound_min && (OX.compound_min.levels || []).includes(L) && !(OX.compound_min.not_families || []).includes(layout.family) ? OX.compound_min.sets : 0;
      const isCompound = (s) => kindOf(s) === 'resistance' && s.origin !== 'bonus' && !isCircuitSlot(s);
      const kBonus = (c) => (OX && OX.template_first && c.s.origin === 'bonus' ? 1 : 0);
      const kCmp = (c) => (cmp3 && isCompound(c.s) && c.n < cmp3 ? 0 : 1);
      // (an earlier exercise that may not take a set now - a press held by the pull : push balance - holds nothing back: a libero's
      // Friday face pull waited 12 weeks behind an overhead press the balance never released)
      const candIds = new Set(cands.map((c) => c.s.slot_id));
      const kLead = (c) => {
        if (!OX || !OX.lead_first) return 0;
        const list = daySlotsOf(c.di);
        // (v0.7 G-292: an earlier lift that waits behind its own day's first lift of another group - a dip behind the bench - holds nothing back)
        for (let i = 0; i < c.pos; i++) { const s2 = list[i]; if (owner[s2.slot_id] === g && active(s2) && candIds.has(s2.slot_id) && sets[s2.slot_id] < c.n + 1 && sets[s2.slot_id] < boundsOf(s2, c.di)[1] && !aboveLead(s2, c.di, sets[s2.slot_id] + 1)) return 1; }
        return 0;
      };
      const kIso = (c) => {
        if (!OX || !OX.iso_after_compound || !cmp3 || !isMainDi(c.di) || !['isolation', 'focus'].includes(kindOf(c.s)) || c.n + 1 <= cmp3) return 0;
        return daySlotsOf(c.di).some((s2) => isCompound(s2) && active(s2) && owner[s2.slot_id] && sets[s2.slot_id] < cmp3) ? 1 : 0;
      };
      // (a step that would hand another group half a set or more above its number for the week waits: dips for the triceps push the
      // chest ahead of its schedule, a high-incline press for the shoulders does the same - sample 07)
      const credNow = OX && OX.no_spill && curTargets ? liveNow().all : null;
      const kSpill = (c) => {
        if (!credNow) return 0;
        const gc = gcOf(c.s);
        for (const h of GROUPS) if (h !== g && (gc[h] || 0) >= 0.5 - EPS && isNum(curTargets[h]) && (credNow[h] || 0) + gc[h] > curTargets[h] + 0.5 + EPS) return 1;
        return 0;
      };
      // (in a test week a tested lift takes the set only when every other choice would put a later exercise above an earlier one)
      const kTest = (c) => (testedSlots.has(c.s.slot_id) ? 1 : 0);
      // v0.6 G-109 (review 04 M2: a fly 2 -> 4 in one week): an exercise that already took a set this week waits behind one that did not
      const kStep = (c) => (PX3.one_step_per_exercise && stepWeek && prevWeekSets && isNum(prevWeekSets[c.s.slot_id]) && c.n >= prevWeekSets[c.s.slot_id] + 1 ? 1 : 0);
      // (G-114: an athlete's main leg lift whose day's paired upper lift holds more sets takes its group's set first)
      const WPo = PX3.work_over_paired;
      const kPair = (c) => {
        if (!WPo || !wpOn() || c.s.role !== 'work' || !isMainDi(c.di)) return 1;
        return daySlotsOf(c.di).some(s2 => s2.role === 'paired_upper' && active(s2) && sets[s2.slot_id] > c.n) ? 0 : 1;
      };
      // v0.6 G-100 (VOL-07 'add it to the first exercise on the list ... 3, 3, 3 ... 4, 3, 3'; reviews 01 / 02 / 03 M2): among the
      // exercises that hold the group's fewest sets, the day whose first lift of the group is its main two-leg lift (the template's
      // 'work' slot) takes the step first, so its staircase - and with it the main lift - climbs first; inside a day the first exercise
      // leads (the session order). The two exposures of one day type still alternate (R3-VOL-03).
      // (the step stays inside the day's staircase: it goes to an exercise of the work day that holds the fewest sets there - VOL-07)
      // (and never more than rules.placement.x3.lead_first.max_ahead sets above the group's least-loaded exercise of another day)
      const LF = PX3.lead_first || {};
      // (G-311: read when the sort first asks, once per candidate - the same value)
      const kWorkMap = { get: memoC((c) => {
        if (!LF.enabled || !isMainDi(c.di) || (leadSlotOf(c.di, g) || {}).role !== 'work') return 1;
        const mine = cands.filter(c2 => c2.di === c.di), others = cands.filter(c2 => c2.di !== c.di && !twinDays(c2.di, c.di));
        const ahead = others.length && isNum(LF.max_ahead) ? c.n + 1 - Math.min(...others.map(c2 => c2.n)) : 0;
        return c.n <= Math.min(...mine.map(c2 => c2.n)) && ahead <= (LF.max_ahead || 0) ? 0 : 1;
      }) };
      const kWork = (c) => kWorkMap.get(c);
      // v0.6 G-201 (VOL-07; R3-VOL-03 'alternate between the two exposures'; review r5 06 m10: the hex-bar deadlift flat at 3 while the
      // hip thrust took every step): read per candidate, so the order stays transitive - the main two-leg lift whose twin (the same day
      // type's other exposure, also in line for the set) holds more sets goes first, whatever a Focus bias prefers inside the group; a
      // step that would put it more than one set above another compound lift of its group on its own day waits (the staircase, VOL-07)
      const isWorkLift = (c) => !!WL && isMainDi(c.di) && c.s.role === 'work' && c.s.origin !== 'bonus' && kindOf(c.s) === 'resistance' && !isCircuitSlot(c.s);
      const kTwinGo = (c) => {
        if (!WL || !WL.twins_alternate || !isWorkLift(c)) return 1;
        const tw = cands.find(c2 => c2 !== c && isWorkLift(c2) && twinDays(c2.di, c.di));
        if (!tw || !(c.n < tw.n)) return 1;
        const rest = daySlotsOf(c.di).filter(s2 => s2 !== c.s && owner[s2.slot_id] === g && active(s2) && kindOf(s2) === 'resistance' && s2.origin !== 'bonus' && !isCircuitSlot(s2)).map(s2 => sets[s2.slot_id]);
        return rest.length && c.n + 1 - Math.min(...rest) > 1 ? 1 : 0;
      };
      // v0.6 G-209 (VOL-07 'add it to the first exercise on the list'; review r6 02 M1): a big group's bonus exercise on a training day
      // (CH5-03) takes a set only when the group's template lifts can take no more - the day's first lift leads, the bonus is the extra
      const BSO = PX3.bonus_small_only || {};
      // (it never falls more than one set under the day's template lifts of its group - the day keeps its staircase, VOL-07: a bonus
      // under every template lift of its day takes its turn as the fewest)
      // (G-218 retires this reading: a bonus takes a set only when every template lift of its group is at its top - addSet filters it)
      const kMainBig = (c) => {
        if (BL && BL.template_first) return 0;
        if (!(BIGNEED && BSO.main_day_template_first && c.s.origin === 'bonus' && isMainDi(c.di) && bigGroup(g))) return 0;
        const tpl = daySlotsOf(c.di).filter(s2 => s2 !== c.s && owner[s2.slot_id] === g && active(s2) && s2.origin !== 'bonus').map(s2 => sets[s2.slot_id]);
        return tpl.length && c.n < Math.min(...tpl) ? 0 : 1;
      };
      // v0.6 G-220 (R3-VOL-03 'Monday's first back exercise, then Thursday's'; VOL-07; review r7 02 M1: Friday's DB bench took chest's
      // week-11 set before Tuesday's bench): the same template station on the two exposures of one day type, at the same sets - the
      // first exposure steps first; the twin that holds fewer sets goes next (the fewest-first order above), so they alternate
      // (read on the two days' template lifts of the group: the day whose lifts hold fewer sets on average steps first - the exposures
      // alternate, R3-VOL-03 - and at the same sets the first exposure of the day type goes first)
      const dayAvg = memoDi((di) => { const list = daySlotsOf(di); let sum = 0, k = 0; for (let i = 0; i < list.length; i++) { const s2 = list[i]; if (owner[s2.slot_id] === g && active(s2) && !isGroupBonus(s2)) { sum = sum + sets[s2.slot_id]; k++; } } return k ? sum / k : 0; });
      const kExp = (a, b) => {
        if (!(BL && BL.first_exposure_first && twinDays(a.di, b.di))) return 0;
        const d = dayAvg(a.di) - dayAvg(b.di);
        return Math.abs(d) > EPS ? d : exposureOf(a.di) - exposureOf(b.di);
      };
      // v0.7 G-236 (R5-ATH-12 'give it the next added set ahead of the other hip lifts, even if that breaks the even 3/3/3 pattern'):
      // the week's heavy hinge takes its group's next `steps_ahead` set(s) over its start first (never in a week that tests it)
      const kHinge = (c) => (HH && stepWeek && heavyHinge(c.s, c.di) && !testedSlots.has(c.s.slot_id) && c.n < Math.min(maxEx, HH.start_sets) + (HH.steps_ahead || 1) ? 0 : 1);
      // v0.7 G-291 (VOL-07 'I add it to the first exercise on the list'; review r9 07 M1): the day's first lift of the group takes the
      // group's first added set on that day in the training block (not in a week that tests it)
      // (R3-VOL-03 'alternate between the two exposures': the lead of a day that holds more of the group's sets than its twin waits)
      const daySum = memoDi((di) => daySlotsOf(di).reduce((a, s2) => a + (owner[s2.slot_id] === g && active(s2) && !isGroupBonus(s2) ? sets[s2.slot_id] : 0), 0));
      // (read on a day type's two exposures whose first lift of the group is the same template station - A1 / A2, 'Legs 1' / 'Legs 2' -
      // not on days of one stem that lead the group with different lifts, a swimmer's S1 / S2)
      const leadG = memoDi((di) => leadSlotOf(di, g));
      const sameLead = (a, b) => { const la = leadG(a), lb = leadG(b); return !!la && !!lb && stationPos(la) === stationPos(lb); };
      const notAhead = (c) => days.every((d, dj) => !twinDays(c.di, dj) || !isMainDi(dj) || !sameLead(c.di, dj) || daySum(c.di) <= daySum(dj));
      const kFirst = (c) => (LFS && stepWeek && leadBase && !testedSlots.has(c.s.slot_id) && leadG(c.di) === c.s && c.n <= (leadBase[c.s.slot_id] || 0) && notAhead(c) ? 0 : 1);
      // (two leads in line on the two exposures of one day type: the first exposure first - R3-VOL-03 'Monday's first ..., then Thursday's')
      const kFirstExp = (a, b) => (kFirst(a) === 0 && kFirst(b) === 0 && twinDays(a.di, b.di) ? exposureOf(a.di) - exposureOf(b.di) : 0);
      // v0.7 G-292 (VOL-07; rules.placement.x7.later_not_above_lead; review r9 07 M1: the weighted dip - 0.5 chest - climbed to 5 sets
      // while the day's bench held 3): a later lift of a training day whose step would put it above the day's first lift of a group it
      // credits with at least min_credit sets waits behind every other choice (its group still reaches its final sets, H10)
      const kAbove = (c) => (aboveLead(c.s, c.di, c.n + 1) ? 1 : 0);
      // (G-311, performance only: every key below reads the state only - nothing changes while the candidates are sorted - so each is
      // read once per candidate; the order is the same)
      for (let i = 0; i < cands.length; i++) cands[i]._i = i;
      const kAboveM = memoC(kAbove), kHingeM = memoC(kHinge), kFirstM = memoC(kFirst), kCmpM = memoC(kCmp), kMainBigM = memoC(kMainBig), kTwinGoM = memoC(kTwinGo), priM = memoC(pri),
        kLeadM = memoC(kLead), kTestM = memoC(kTest), kSpillM = memoC(kSpill), kIsoM = memoC(kIso), kStepM = memoC(kStep), kPairM = memoC(kPair), kBonusM = memoC(kBonus), distM = memoDi(dist);
      const kFirstExpM = (a, b) => (kFirstM(a) === 0 && kFirstM(b) === 0 && twinDays(a.di, b.di) ? exposureOf(a.di) - exposureOf(b.di) : 0);
      cands.sort((a, b) => a.opt - b.opt || kAboveM(a) - kAboveM(b) || kHingeM(a) - kHingeM(b) || kFirstM(a) - kFirstM(b) || kFirstExpM(a, b) || kCmpM(a) - kCmpM(b) || kMainBigM(a) - kMainBigM(b) || kTwinGoM(a) - kTwinGoM(b) || priM(a) - priM(b) || kLeadM(a) - kLeadM(b) || kTestM(a) - kTestM(b) || kSpillM(a) - kSpillM(b) || kIsoM(a) - kIsoM(b) || (twinDays(a.di, b.di) ? 0 : kWork(a) - kWork(b)) || a.n - b.n || kStepM(a) - kStepM(b) || (twinDays(a.di, b.di) ? 0 : kPairM(a) - kPairM(b)) || kBonusM(a) - kBonusM(b) || kExp(a, b) || distM(a.di) - distM(b.di) || a.pos - b.pos);
      return cands;
    };
    if (ppRatio && balanceOn && cands.some(c => isPress(c.s))) {
      const pp = pushPull();
      // (rules.volume.push_pull.capped_slack: while the back sits on its number for the week a press may lead the pulls by one set
      // - the back is not pulled ahead of its stairway for it, CX-01, and the day's first exercise still leads, VOL-07)
      const slack = isNum(PPB.capped_slack) && !ppRatio.held && backRoomNow && !backRoomNow() ? PPB.capped_slack : 0;
      if (pp.push + 1 > pp.pull / ppRatio.hard + slack + EPS) {
        const rest = cands.filter(c => !isPress(c.s));
        if (!rest.length) { blockedByBalance = true; return null; }
        cands = rest;
      }
    }
    if (!cands.length) return null;
    inOrder(cands);
    const c = cands[0];
    setS(c.s.slot_id, sets[c.s.slot_id] + 1);
    // (COACH-CH5 CH5-03: a big group's bonus exercise is not one of the day type's two exposures - a step on it leaves the A / B rotation
    // of the template lifts where it was, R3-VOL-03)
    if (!(BIGNEED && c.s.origin === 'bonus' && bigGroup(g))) lastDay[g] = c.di;
    return c;
  };
  // the floor of 10 is held on the TRAINING days (R2-VOL-06; ORD-10 / R4-SES-05 'optional days are bonuses'; sample 01 major: a
  // swimmer who trained his 3 days sat at 8 chest sets because the optional day's fly was counted): rules.volume.floor.counted_on
  const floorMain = (() => {
    const FL = V.floor || {};
    if (FL.counted_on !== 'main_days' || circuitPlan) return null;
    const out = {};
    if (D9.two_day) {
      // v0.6 G-106 (R4-SES-03 'every big muscle group ... about 6-8'; review 08 M2: the shoulders reached the band only with the
      // optional day's fly): on 2 training days the training days hold the band's low end for every trained group first
      const T2 = PX3.two_day_main_floor;
      if (!(T2 && T2.enabled && V.two_day)) return null;
      // (G-200, review r5 08 M1: R4-SES-03 asks the band of the BIG groups - the line classes rules.volume.two_day.big_classes names,
      // as the floor check reads it; slot 5 doses the arms, and the shoulders climb to their final sets with the optional day's place)
      const bigLine = (l) => (V.two_day.big_classes || ['big']).includes((X.defs[l] || {}).class);
      // (G-207, review r6 08 M1: the groups rules.placement.x3.two_day_main_floor.also_groups names - the shoulders, a counted group with
      // a floor, H17 / R3-VOL-01 - hold the band on the training days too; the optional day's bonus is extra)
      const alsoG = (g) => (T2.also_groups || []).includes(g);
      for (const l of D9.lines || []) { const g = X.groupOfLine[l]; if (g && g !== 'calves' && !(ARM2 && !bigLine(l) && !alsoG(g)) && !armSlotGroup(g) && !(D9.credit_only || []).includes(l) && D9.carriers && D9.carriers[g] === l) out[g] = V.two_day.weekly_sets[0]; }
      return Object.keys(out).length ? out : null;
    }
    for (const g of D9.floor_groups || []) if (g !== 'calves') out[g] = FL.value;
    return Object.keys(out).length ? out : null;
  })();
  const creditedMain = (g) => groupSum(true, g);
  // (the most an isolation exercise of a training day holds when the floor asks for it)
  const isoRelaxTop = (s, di) => (PX.iso_main_day_max && kindOf(s) === 'isolation' && isMainDi(di) && s.bucket !== 'ISO_CALF' && !isCircuitSlot(s) && s.origin !== 'bonus' ? Math.min(maxEx, PX.iso_main_day_max.hardest) : 0);
  const capOfGroup = {};      // group -> the most its credited sets may reach in this block (set by planStairs; flat blocks: none)
  // every group up to its target, in the order that lets helper credit count first; a group never loses a set
  const allocateOnce = (targets, eff, log, ownAdded) => {
    curTargets = targets;
    const note = (c, g) => { ownAdded[g] = (ownAdded[g] || 0) + 1; if (log) log.push({ key: 'changes.set_added', args: { exercise: fills[c.s.slot_id].exercise_id, day: days[c.di].weekday, slot_id: c.s.slot_id } }); };
    const backG = PPB ? PPB.pull_group : null;
    const backRoom = () => !!backG && isNum(targets[backG]) && credited(backG) + 1 <= (isNum(capOfGroup[backG]) ? capOfGroup[backG] : Infinity) + EPS;
    backRoomNow = () => !!backG && isNum(targets[backG]) && credited(backG) + 1 <= targets[backG] + EPS;
    for (let pass = 0; pass < 3; pass++) {
      let moved = false;
      for (const g of GROUPS) {
        if (!isNum(targets[g])) continue;
        // the floor on the training days: the group's main-day exercises hold it where they can, whatever the optional day adds
        // (fix round 2: read BEFORE the group's number for the week - the bonus exercise of the optional day used to fill first and
        // the floor then came on top, so week 1 held 2-4 sets more than the group's start; samples 01 / 03 major)
        const floorLoop = () => {
          if (!(floorMain && isNum(floorMain[g]))) return;
          const need = Math.min(floorMain[g], targets[g]);
          for (let guard = 0; guard < 60 && creditedMain(g) < need - EPS; guard++) {
            const c = addSet(g, { mainOnly: true }) || (noRelax ? null : addSet(g, { mainOnly: true, forFloor: true }));
            if (!c) break;
            moved = true;
            note(c, g);
          }
        };
        if (PX2.floor_first) floorLoop();
        for (let guard = 0; guard < 400 && credited(g) < eff[g] - EPS; guard++) {
          let c = addSet(g);
          // a press held back by the balance: a pulling set first (inside the back's final sets), then the press
          if (!c && blockedByBalance && backRoom()) { const b = addSet(backG, { pullOnly: true }); if (b) { note(b, backG); moved = true; c = addSet(g); } }
          if (!c) break;
          moved = true;
          note(c, g);
        }
        floorLoop();
      }
      // a muscle's own direct sets (side delts on a physique plan), on the exercises that train it as a main mover
      for (const [m, def] of Object.entries(directMinOf)) {
        if (!isNum(targets[def.group])) continue;
        for (let guard = 0; guard < 30 && directOf(m) < def.min - EPS; guard++) {
          const c = addSet(def.group, { muscle: m });
          if (!c) break;
          moved = true;
          note(c, def.group);
        }
      }
      // the balance the profile asks for (pull_per_push): pulling sets up to the ratio, inside the back's final sets
      if (ppRatio && balanceOn && backG && isNum(targets[backG])) {
        for (let guard = 0; guard < 60; guard++) {
          const pp = pushPull();
          // (week by week the pulling sets never fall under the pressing sets - `hard`; the profile's own ratio - `want` - sizes the
          // back's final sets, so the back still climbs to it instead of sitting on it from week 1: sample 08, back flat at 8)
          // (fix round 2: while the back sits on its number for the week the presses may lead by rules.volume.push_pull.capped_slack
          // - the back is not pulled ahead of its stairway to close a one-set gap, CX-01)
          const lag = !balanceWant && isNum(PPB.capped_slack) && !ppRatio.held && backRoomNow && !backRoomNow() ? PPB.capped_slack : 0;
          if (pp.pull >= (balanceWant ? ppRatio.want : ppRatio.hard) * pp.push - lag - EPS || !backRoom()) break;
          const b = addSet(backG, { pullOnly: true });
          if (!b) break;
          moved = true;
          note(b, backG);
        }
      }
      if (!moved) break;
    }
  };
  // v0.5 fix round 1 (bench 33; R2-ATH-07 in season, the engine's own day rule 'hard day >= 48 h before a game'): when the client's
  // days put a session on the eve of a game, that session is the week's lighter one. Its sets above a group's in-season number go
  // first (the pulling sets the balance added), then one set off its biggest lifts - never under an exercise's own minimum, and
  // the pulling sets never under the pressing sets. The group's number for the week follows what the week keeps.
  const eveOfGame = (targets) => {
    const EG = PX.eve_of_game;
    const games = new Set(((derived.D4_season_phase && derived.D4_season_phase.game_days) || []).filter(d => WEEKDAYS.includes(d)));
    if (!EG || !games.size) return false;
    const eve = mainDi.filter(di => games.has(WEEKDAYS[(WEEKDAYS.indexOf(days[di].weekday) + 1) % 7]));
    const far = mainDi.filter(di => !eve.includes(di));
    if (!eve.length || !far.length) return false;
    const total = (di) => daySlotsOf(di).reduce((a, sl) => a + (isResistance(sl) && !isCircuitSlot(sl) && active(sl) ? sets[sl.slot_id] : 0), 0);
    let trimmed = false;
    for (const di of eve) {
      for (let guard = 0; guard < 24; guard++) {
        const top = Math.max(...far.map(total));
        if (total(di) <= top - EG.lighter_by + EPS) break;
        const pp = ppRatio ? pushPull() : null;
        const cands = daySlotsOf(di).filter(sl => owner[sl.slot_id] && active(sl) && sets[sl.slot_id] > boundsOf(sl, di)[0])
          .filter(sl => !(pp && isPull(sl) && pp.pull - 1 < ppRatio.hard * pp.push - EPS))
          .map((sl, i) => { const g = owner[sl.slot_id]; return { sl, g, i, over: isNum(targets[g]) ? credited(g) - targets[g] : 0 }; })
          .sort((a, b) => (b.over >= 1 - EPS ? 1 : 0) - (a.over >= 1 - EPS ? 1 : 0) || sets[b.sl.slot_id] - sets[a.sl.slot_id] || b.i - a.i);
        const c = cands[0];
        if (!c || (c.over < 1 - EPS && sets[c.sl.slot_id] <= EG.keep_sets)) break;
        setS(c.sl.slot_id, sets[c.sl.slot_id] - 1);
        if (c.over < 1 - EPS && isNum(targets[c.g])) targets[c.g] = Math.max(0, Math.floor(credited(c.g) + EPS));
        trimmed = true;
      }
    }
    return trimmed;
  };
  // v0.5 fix round 1: a group filled first may end above its number once a later group's sets hand it credit (a high-incline press
  // of the shoulders counts half a set for chest; a row a quarter for biceps). The split is then made again with that group asking
  // for fewer sets of its own, so the week lands on its targets instead of above them (the sets a week adds are always whole and a
  // group never loses a set it held before this week)
  const allocate = (targets, log) => {
    const sn = snapshot();
    const at = log ? log.length : 0;
    const eff = { ...targets };
    const cut = {};
    for (let iter = 0; iter < 4; iter++) {
      restore(sn);
      if (log) log.length = at;
      const ownAdded = {};
      allocateOnce(targets, eff, log, ownAdded);
      let again = false;
      for (const g of GROUPS) {
        if (!isNum(targets[g]) || !(ownAdded[g] > 0)) continue;
        const over = Math.floor(credited(g) - targets[g] + EPS);
        const mainNeed = floorMain && isNum(floorMain[g]) ? Math.min(floorMain[g], targets[g]) : null;
        // (never under the floor of the training days, never more than the sets this run gave the group)
        if (over >= 1 && !(mainNeed !== null && creditedMain(g) - over < mainNeed - EPS)) { const k = Math.min(over, ownAdded[g]); eff[g] -= k; cut[g] = (cut[g] || 0) + k; again = true; }
      }
      if (!again) break;
    }
    // (a correction that left a group under its target is undone: the last word is always 'the target is reached', CX-01)
    if (Object.keys(cut).length && GROUPS.some(g => isNum(targets[g]) && credited(g) < targets[g] - EPS)) {
      const ownAdded = {};
      allocateOnce(targets, targets, log, ownAdded);
    }
  };
  const snapshot = () => ({ sets: { ...sets }, lastDay: { ...lastDay } });
  const restore = (sn) => { sets = { ...sn.sets }; lastDay = { ...sn.lastDay }; stateVer++; };
  /** what the block's slots hold for each group when every target is asked for (a scratch run; nothing is kept) */
  // (G-311, performance only: a scratch run is a pure function of the block's state - the sets, the last days, the owners, the picks,
  // the day lists, the week the bounds are read for and every switch and table the allocation reads - and of the targets it is asked
  // for. The planning loops ask the same question many times; the answer, and the three things a run leaves behind (the targets the
  // allocation read, the back's room check and the balance flag), are kept by a key of all of it. Same answers, same order.)
  const reachMemo = new Map();
  const objIds = new WeakMap();
  let objNext = 0;
  const idOf = (o) => { let v = objIds.get(o); if (v === undefined) { v = ++objNext; objIds.set(o, v); } return v; };
  const ser = (v) => {
    if (v === null) return 'n';
    if (v === undefined) return 'u';
    const t = typeof v;
    if (t === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (t === 'string') return JSON.stringify(v);
    if (t === 'boolean') return v ? 'T' : 'F';
    if (t === 'function') return 'f' + idOf(v);
    if (Array.isArray(v)) { let out = '['; for (let i = 0; i < v.length; i++) out += (i ? ',' : '') + ser(v[i]); return out + ']'; }
    if (v instanceof Set) { let out = 'S['; for (const x of v) out += ser(x) + ','; return out + ']'; }
    if (v instanceof Map) { let out = 'M['; for (const [k, x] of v) out += ser(k) + ':' + ser(x) + ','; return out + ']'; }
    let out = '{';
    for (const k of Object.keys(v)) out += JSON.stringify(k) + ':' + ser(v[k]) + ',';
    return out + '}';
  };
  const reachKey = (targets) => {
    syncLists();
    let fl = '';
    for (const [s0, di] of allPairs) { const f = fills[s0.slot_id]; fl += idOf(s0) + '@' + di + '=' + (f ? idOf(f) + ':' + ser(f.exercise_id) : ser(f)) + ';'; }
    return [ser(targets), ser(sets), ser(lastDay), ser(owner), fl, boundWeek ? idOf(boundWeek) : ser(boundWeek), stepWeek ? idOf(stepWeek) : ser(stepWeek),
      ser(noRelax), ser(balanceOn), ser(balanceWant), ser(ppRatio), ser(capOfGroup), ser(extraTop), ser(hingeOff), ser(leadBase), ser(closedFocus),
      ser(tplExtraIds), ser(bonusGroupsAll), ser(testedSlots), ser(prevWeekSets), ser(calfMainMax), ser(dormant), ser(dormantWk), ser(gbWeek),
      ser(twoDayLim), ser(noBonus2)].join('|');
  };
  const reachable = (targets) => {
    const key = reachKey(targets);
    const hit = reachMemo.get(key);
    if (hit) {
      // (what the run would leave behind: allocateOnce's targets and back-room check for these targets, and the last balance flag)
      curTargets = targets;
      const backG = PPB ? PPB.pull_group : null;
      backRoomNow = () => !!backG && isNum(targets[backG]) && credited(backG) + 1 <= targets[backG] + EPS;
      blockedByBalance = hit.blocked;
      if (globalThis.__VERIFY_REACH) {
        const before = ser(sets) + '|' + ser(lastDay);
        const sn = snapshot(); allocate(targets, null); const t2 = tally(false, 'group'); restore(sn);
        const after = ser(sets) + '|' + ser(lastDay);
        globalThis.__VR = globalThis.__VR || { hit: 0, bad: 0 }; globalThis.__VR.hit++;
        if (ser(t2) !== ser(hit.t) || blockedByBalance !== hit.blocked || before !== after || curTargets !== targets) { globalThis.__VR.bad++; }
      }
      return { ...hit.t };
    }
    const sn = snapshot();
    allocate(targets, null);
    const t = tally(false, 'group');
    restore(sn);
    reachMemo.set(key, { t: { ...t }, blocked: blockedByBalance });
    return t;
  };
  /** the same on the training days only, with every exercise inside its default bounds (no 4th isolation set for the floor) */
  const reachableDefault = (targets) => {
    const sn = snapshot();
    noRelax = true;
    allocate(targets, null);
    noRelax = false;
    const t = { all: tally(false, 'group'), main: tally(true, 'group') };
    restore(sn);
    return t;
  };

  // v0.5 fix round 2 (sample 01 major: a swimmer's bonus exercises were a chest fly and a lateral raise; 04 swimming_middle
  // priority muscles 'lats, rear shoulder'): for a profile that pulls well more than it presses, the extra shoulder exercise is a
  // rear-delt one (rules.placement.x2.pull_profile_muscle)
  const extraMuscleOf = (g) => {
    const PM = PX2.pull_profile_muscle;
    if (!PM || !profile || !isNum(profile.pull_per_push) || profile.pull_per_push < PM.min_pull_per_push) return null;
    const m = (PM.by_group || {})[g];
    return m && (X.linesOfGroup[g] || []).some(l => (X.defs[l].members || []).includes(m)) && !prio.some(l => (X.linesOfGroup[g] || []).includes(l)) ? m : null;
  };
  // v0.6 G-104: the compound movement patterns the calendar day before an optional day trains (rules.placement.x3.bonus_no_repeat_previous_day)
  const repeatsPreviousDay = (f, di) => {
    const NR = PX3.bonus_no_repeat_previous_day;
    if (!NR || !NR.enabled || !f || !f.exercise_id || !model.hasEx(f.exercise_id)) return false;
    const pat = model.ex(f.exercise_id).pattern;
    if (!(NR.compound_patterns || []).includes(pat)) return false;
    const prevWd = WEEKDAYS[(WEEKDAYS.indexOf(days[di].weekday) + 6) % 7];
    const pd = days.findIndex(d => d.weekday === prevWd);
    if (pd < 0 || !isMainDi(pd)) return false;
    return daySlotsOf(pd).some(s => active(s) && isResistance(s) && hasPick(s) && model.hasEx(fills[s.slot_id].exercise_id) && model.ex(fills[s.slot_id].exercise_id).pattern === pat);
  };
  // v0.7 G-231 (R5-VOL-07; rules.placement.x7.light_chest_optional): a light chest exercise - a fly, or a machine press - may follow a
  // press day on the optional day
  const LCO = PX7.light_chest_optional && PX7.light_chest_optional.enabled ? PX7.light_chest_optional : null;
  const lightChestOk = (g) => !!LCO && (LCO.groups || []).includes(g);
  const isLightChest = (f) => {
    if (!LCO || !f || !f.exercise_id || !model.hasEx(f.exercise_id)) return false;
    const e = model.ex(f.exercise_id), MP = LCO.machine_press || {};
    return (LCO.credit_classes || []).includes(e.credit_class) || ((MP.credit_classes || []).includes(e.credit_class) && (e.tags || []).some(t => (MP.tags || []).includes(t)));
  };
  // ---- the bonus exercise on the optional day (allocation step 3)
  const bonusOpen = new Map(); // group -> slot
  const addedOn = (di) => days[di].added.filter(s => s.origin === 'bonus').length;
  // (COACH-CH5 CH5-03: a group may take a second bonus exercise - key 'group#2' - when one cannot take it to its planned final sets)
  const openBonus = (g, n, log, probe = false, key = g, wide = false) => {
    if (bonusOpen.has(key) || typeof fillSlot !== 'function' || g === 'calves') return null;
    // (CH5-03: a second bonus exercise may use one more place on an optional day - rules.placement.x3.reach_planned.optional_day_max)
    const dayMax0 = (wide || key !== g) && PX3.reach_planned && isNum(PX3.reach_planned.optional_day_max) ? PX3.reach_planned.optional_day_max : (BN.max_added_per_optional_day || 2);
    // v0.7 G-231 (COACH-R5 R5-VOL-07: the question's premise 'the training days are full at 8 exercises'): a light chest exercise may
    // take one more place on an optional day (rules.placement.x7.light_chest_optional.optional_day_max) - only a fly or a machine press
    // (the question's premise is a physique week - rules.placement.x7.light_chest_optional.optional_day_max_families)
    const lcoFam = !!LCO && (!Array.isArray(LCO.optional_day_max_families) || LCO.optional_day_max_families.includes(layout.family));
    const lcoMax = (wide || key !== g) && lightChestOk(g) && lcoFam && isNum(LCO.optional_day_max) ? Math.max(dayMax0, LCO.optional_day_max) : dayMax0;
    const dayMax = lcoMax;
    const cands = optDi.filter(di => addedOn(di) < dayMax && daySlotsOf(di).some(s => ['core', ...RESISTANCE_KINDS].includes(kindOf(s))))
      .filter(di => key === g || !days[di].added.some(s => s.origin === 'bonus' && s.group === g))
      .sort((a, b) => addedOn(a) - addedOn(b) || a - b);
    const lines = (X.linesOfGroup[g] || []);
    const line = lines.find(l => prio.includes(l)) || lines.find(l => isNum(D9.start[l])) || lines[0];
    const def = line ? X.defs[line] : null;
    if (!def) return null;
    for (const di of cands) {
      const d = days[di];
      const used = daySlotsOf(di).map(s => { const mm = /\.x(\d+)$/.exec(s.slot_id); return mm ? Number(mm[1]) : 0; });
      const tag = (d.day_type || 'day') + '.x' + String(Math.max(0, ...used) + 1).padStart(2, '0');
      const slot = {
        slot_id: d.weekday + '.' + tag, station_id: tag, bucket: 'FOCUS', role: 'focus', block: 'accessories', group: g,
        sets_hint: BN.sets.slice(), default_sets: BN.sets[0], pair: null, superset: null, superset_eligible: null, circuit: null, axial_req: null,
        variant: null, laterality_dial: false, loading: null, focus_muscle: extraMuscleOf(g) || def.focus_muscle || def.members[0],
        time_class: model.bucket('FOCUS').time_class || 'isolation', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null,
        origin: 'bonus', why: [why('why.bonus_optional_day', 'R3-VOL-03', { group: g })]
      };
      let f = fillSlot(slot, n, probe ? { probe: true } : undefined);
      if (!f || !f.exercise_id) continue;
      // v0.6 G-104 (review 01 M2): never a compound pattern the day before already trained
      // v0.7 G-231 (COACH-R5 R5-VOL-07 'Allow a light chest exercise (fly or machine press) on the optional day even after a press day'):
      // a chest bonus on an optional day may follow a press day when it is a fly or a machine press - the day's pick, or else a fly
      const extraPlace = addedOn(di) >= dayMax0; // (the light chest exercise's own place, G-231)
      if (repeatsPreviousDay(f, di) || extraPlace) {
        if (!lightChestOk(g)) continue;
        if (!isLightChest(f)) {
          const alt = { ...slot, bucket: LCO.bucket || slot.bucket, why: [...slot.why, why('why.light_chest_optional', 'R5-VOL-07')] };
          const f2 = alt.bucket !== slot.bucket ? fillSlot(alt, n, probe ? { probe: true } : undefined) : null;
          if (!f2 || !f2.exercise_id || !isLightChest(f2)) continue;
          Object.assign(slot, { bucket: alt.bucket, why: alt.why });
          f = f2;
        } else slot.why.push(why('why.light_chest_optional', 'R5-VOL-07'));
      }
      setF(slot.slot_id, f);
      if (ownerOfSlot(slot) !== g) { delF(slot.slot_id); continue; }
      d.added.push(slot); added.push(slot);
      owner[slot.slot_id] = g; ownerVer++;
      setS(slot.slot_id, BN.sets[0]);
      bonusOpen.set(key, slot);
      if (log) log.push({ key: 'changes.bonus_added', args: { exercise: f.exercise_id, day: d.weekday, slot_id: slot.slot_id } });
      return slot;
    }
    return null;
  };

  // ---- the 8th exercise of a training day (fix round 1; COACH-R4 R4-SES-05 'the days that they do 8 exercises, they're just going
  // to be adding an extra small muscle exercise at the end'; VOL-07 more of a small muscle comes 'as a bonus exercise'; samples
  // 06 / 07 major): a small group its exercises cannot take to its level's start (or a Focus group to its final sets) with the
  // optional day's bonus exercise takes a second exercise at the end of a training day that already trains it, while that day
  // is under the top of the session size
  const EXS = PX.main_day_extra || null;
  const sizeMax = derived.D6_week_layout && derived.D6_week_layout.session_size && Array.isArray(derived.D6_week_layout.session_size.range) ? derived.D6_week_layout.session_size.range[1] : Infinity;
  const countedOn0 = (di) => daySlotsOf(di).filter(s => s.counts_in_cap !== false && hasPick(s) && sets[s.slot_id] !== 0 && !isCircuitSlot(s)).length;
  // (engine 0.6.0 integration, with COACH-CH5 CH5-02's arm slot on the athletic days: an athletic or power slot of the day with no pick
  // in this exercise block that a later exercise block fills keeps its place - an extra exercise placed now never runs the day over
  // its session size when it comes back, R4-SES-02 / V13)
  const pendingAthletic = (di) => {
    if (!PX3.reach_planned) return 0;
    // (a slot of the day with no pick in this exercise block that another exercise block's selection fills - a power slot the
    // stage fills later)
    const later = (sl) => (selections || []).some(se => se && se.fills && se.fills[sl.slot_id] && se.fills[sl.slot_id].exercise_id);
    return daySlotsOf(di).filter(sl => !hasPick(sl) && sl.counts_in_cap !== false && ['athletic', 'power'].includes(sl.block) && later(sl)).length;
  };
  const countedOn = (di) => countedOn0(di) + (isMainDi(di) ? pendingAthletic(di) : 0);
  const extraOpen = new Map(); // group -> slot
  // (fix round 2, sample 01: two reverse flies on one day) a line of several muscles takes, as its second exercise of the day, a
  // muscle the day does not already train directly - a side raise next to the day's reverse fly
  const otherMuscleOf = (def, di) => {
    const ms = [def.focus_muscle, ...(def.members || [])].filter(Boolean);
    if (ms.length < 2) return null;
    const has = (m) => daySlotsOf(di).some(sl => active(sl) && ((crOf(sl) || {})[m] || 0) >= 1 - EPS);
    return ms.find(m => !has(m)) || null;
  };
  const openExtra = (g, n, muscle = null, onDays = null, whyKey = null, extraGroups = null) => {
    if (!EXS || circuitPlan || (extraOpen.has(g) && !onDays) || !(EXS.groups || []).concat(extraGroups || []).includes(g) || typeof fillSlot !== 'function') return null;
    // (v0.6 G-102: the extra exercise at the end of a day is a SMALL-muscle one - R4-SES-05, R3-VOL-03 - unless a rule names the group)
    if (PX3.bonus_small_only && bigGroup(g) && !(extraGroups || []).includes(g)) return null;
    // (fix round 2: the profile's own muscle - a swimmer's rear delts - only on a day that does not already train it directly)
    const pm = muscle ? null : extraMuscleOf(g);
    const dayHas = (di, m) => daySlotsOf(di).some(sl => active(sl) && ((crOf(sl) || {})[m] || 0) >= 1 - EPS);
    const cands = (onDays || mainDi.filter(di => slotsOfGroup(g).some(([s, dj]) => dj === di && active(s)))).filter(di => addedOn(di) < (EXS.per_day || 1) && countedOn(di) < sizeMax)
      .sort((a, b) => countedOn(a) - countedOn(b) || a - b);
    const lines = (X.linesOfGroup[g] || []);
    const line = lines.find(l => prio.includes(l)) || lines.find(l => isNum(D9.start[l])) || lines[0];
    const def = line ? X.defs[line] : null;
    if (!def) return null;
    for (const di of cands) {
      const d = days[di];
      const used = daySlotsOf(di).map(s => { const mm = /\.x(\d+)$/.exec(s.slot_id); return mm ? Number(mm[1]) : 0; });
      const tag = (d.day_type || 'day') + '.x' + String(Math.max(0, ...used) + 1).padStart(2, '0');
      const slot = {
        slot_id: d.weekday + '.' + tag, station_id: tag, bucket: 'FOCUS', role: 'focus', block: 'accessories', group: g,
        sets_hint: EXS.sets.slice(), default_sets: EXS.sets[0], pair: null, superset: null, superset_eligible: null, circuit: null, axial_req: null,
        variant: null, laterality_dial: false, loading: null, focus_muscle: muscle || (pm && !dayHas(di, pm) ? pm : null) || otherMuscleOf(def, di) || def.focus_muscle || def.members[0],
        time_class: model.bucket('FOCUS').time_class || 'isolation', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null,
        origin: 'bonus', why: [why(whyKey || 'why.extra_small_exercise', 'R4-SES-05', { group: g })]
      };
      const f = fillSlot(slot, n);
      if (!f || !f.exercise_id) continue;
      // (v0.6 G-209, CH5-03 'the bonus still never repeats a pattern trained the day before': a training day's bonus exercise too, G-104)
      if (repeatsPreviousDay(f, di)) continue;
      setF(slot.slot_id, f);
      if (ownerOfSlot(slot) !== g) { delF(slot.slot_id); continue; }
      d.added.push(slot); added.push(slot);
      owner[slot.slot_id] = g; ownerVer++;
      setS(slot.slot_id, EXS.sets[0]);
      if (!onDays) extraOpen.set(g, slot);
      return slot;
    }
    return null;
  };
  // (sample 07 major: an advanced physique plan held 4 direct side-delt sets a week - the shoulders line was filled by the quarter
  // credits of presses and rows, R2-VOL-04 'side delts are a small muscle') the direct sets a muscle holds whatever its group's credit
  const DM = (V.x1 && V.x1.direct_min) || null;
  const directMinOf = (() => {
    const out = {};
    if (DM && !circuitPlan && !D9.two_day) for (const [m, def] of Object.entries(DM)) if ((def.families || []).includes(layout.family) && isNum(def.by_level[L])) out[m] = { group: def.group, min: def.by_level[L] };
    return out;
  })();
  const directOf = (m) => allSlots().reduce((a, [s2]) => a + (active(s2) && ((crOf(s2) || {})[m] || 0) >= 1 - EPS ? sets[s2.slot_id] : 0), 0);

  // ---- group targets of the block
  const bt0 = stair ? blockTargets(D9, tb, derived, model) : null;
  const carrierOf = (g, t) => { const ls = (X.linesOfGroup[g] || []).filter(l => isNum(t.start[l])); return ls.find(l => prio.includes(l)) || ((D9.carriers && ls.includes(D9.carriers[g])) ? D9.carriers[g] : ls[0]) || null; };
  let schedule = null;          // group -> whole sets per stairway week
  let schedule0 = null;         // the same, as planned before the block's weeks ran (fix round 2: what the weeks are compared with)
  let blockInfo = null;
  let flatTargets = null;       // group -> target of a flat block
  const flatCapped = new Map(); // group -> {group, planned, held}: flat-block sets the template's exercises cannot hold
  const groupTargetsOf = (t) => { const out = {}; for (const g of GROUPS) { const c = carrierOf(g, t); if (c) out[g] = t.start[c]; } return out; };

  const focusClosed = [];       // [{group, slot_id}]: optional-day Focus slots closed because the group was over its final sets
  // v0.5 fix round 2 (sample 04 major: triceps at 11 of 18 and biceps at 12 of 18 while both bonus slots went to hips and quads at
  // 83-87 %; sample 06: a fifth lateral raise as the bonus of a muscle that owns both Focus slots): the bonus exercises go to the
  // groups that miss the largest share of their planned final sets; a group that already owns `skip_focus_owner` optional-day
  // Focus slots waits behind the others (rules.placement.x2.bonus_order)
  const bonusOrder = (reach, planned, trained) => {
    const base = (BN.order || GROUPS).filter(x => trained.includes(x));
    const BO = PX2.bonus_order;
    if (!BO || BO.by !== 'missing_share') return base;
    const share = (g) => (planned[g] > 0 ? Math.min(1, (reach[g] || 0) / planned[g]) : 1);
    const owns = (g) => slotsOfGroup(g).filter(([sl, di]) => !isMainDi(di) && kindOf(sl) === 'focus' && sl.origin !== 'bonus' && active(sl)).length;
    const late = (g) => (isNum(BO.skip_focus_owner) && owns(g) >= BO.skip_focus_owner ? 1 : 0);
    return base.slice().sort((a, b) => late(a) - late(b) || share(a) - share(b) || base.indexOf(a) - base.indexOf(b));
  };
  // (fix round 2, samples 01 / 03; COACH-R3 R3-VOL-01 'field athletes: side delts and arms stay helper work'): a competitive
  // athlete's shoulders take no bonus exercise on the optional day unless they are a Focus muscle
  // v0.6 G-113 (review 04 M1 'no bonus isolation once a group meets its floor on main days'): the class member's arms, shoulders, chest
  // and back end at most at their class top (rules.volume.x3.class_tops) - what the training days hold, never a bonus exercise
  const classSoft = (g) => {
    const CT = V.x3 && V.x3.class_tops;
    if (!CT || !(CT.families || []).includes(derived.D1_family) || !(CT.competitive || []).includes(derived.D2_profile.competitive) || focusGroup(g)) return false;
    return (X.linesOfGroup[g] || []).some(l => !!(CT.lines || {})[l]);
  };
  const noBonus2 = new Set(); // v0.6 G-207: 2-day groups the training days carry alone (a bonus would pass the level's top)
  const twoDayLim = {};       // v0.6 G-207: group -> the most its credited sets may reach with the optional-day bonus
  const noBonusFor = (g) => {
    if (classSoft(g) || armSlotGroup(g) || noBonus2.has(g)) return true;
    const NB = PX2.bonus_order && PX2.bonus_order.not_for;
    return !!NB && (NB.modifiers || []).includes(D9.modifier_id) && (NB.groups || []).includes(g) && !(X.linesOfGroup[g] || []).some(l => prio.includes(l));
  };
  const planStairs = (ws0) => {
    const start = {}, planned = {}, rates = {}, carrier = {};
    const lowered = [];           // [{group, start, planned_start}]: capped groups that start lower so they still climb (fix round 1)
    const balanced = {};          // {start?, top?}: the back's sets lifted to the pressing sets (pull_per_push, fix round 1)
    for (const g of GROUPS) {
      const c = carrierOf(g, bt0);
      if (!c) continue;
      carrier[g] = c;
      start[g] = bt0.start[c];
      planned[g] = Math.max(bt0.start[c], plannedTop(c, bt0, N, model));
      // COACH-CH5 CH5-03 ('no cap until 35'): no group is planned above the absolute weekly ceiling (rules.volume.x3.group_max)
      if (GMAX !== null && planned[g] > GMAX) { planned[g] = GMAX; start[g] = Math.min(start[g], GMAX); }
      rates[g] = ratesOf(c, bt0, N, model);
    }
    const trained = GROUPS.filter(g => isNum(start[g]) && slotsOfGroup(g).length > 0);
    // credit only: a group the plan gives no exercise of its own - its template has no slot for it, or the client type leaves
    // its lines to the compound lifts (targets.credit_only: a swimmer's biceps and triceps). The plan names them.
    const creditOnly = GROUPS.filter(g => !trained.includes(g) && (isNum(start[g]) || (X.linesOfGroup[g] || []).some(l => (D9.credit_only || []).includes(l))));
    // v0.5 / V4 (COACH-R4 R4-PRG-04 'never above the level's top number'; ORD-11 'Focus ... used to bring a priority muscle up to its
    // weekly target'; the 94-intake benchmark: a 16-year-old guard's hips sat at 22 weekly sets from week 1 against a final 16 because
    // four optional-day Focus slots were filled for the sport's priority group): where a group's exercises at their fewest sets
    // already hold more than its planned final sets, the optional day's Focus slots for that group close - the last one of the week
    // first - while the group still starts at or above its level's start. The main days' template lifts never close (R4-SES-04) and a
    // bonus exercise is not a Focus slot. The group then climbs on its main-day lifts (main days before the optional day, G-12).
    if (OF.close_when_over_top) {
      for (const g of trained) {
        const focusOpen = () => slotsOfGroup(g).filter(([s, di]) => !isMainDi(di) && kindOf(s) === 'focus' && s.origin !== 'bonus' && active(s));
        // v0.5 fix round 1 (bench 88: biceps at 14.5 weekly sets from week 1 against a final 13): the floor is held on the training
        // days, so the sets those days must add count here too - where the training days' floor and the optional day's Focus slots
        // together pass the group's final sets, a Focus slot closes (the last one of the week first; main days before the optional day)
        const mainShort = () => {
          if (!floorMain || !isNum(floorMain[g])) return 0;
          const need = Math.min(floorMain[g], planned[g]);
          const room = slotsOfGroup(g).filter(([s, di]) => isMainDi(di) && active(s)).reduce((a, [s, di]) => a + Math.max(0, Math.max(boundsOf(s, di)[1], isoRelaxTop(s, di)) - sets[s.slot_id]), 0);
          return Math.min(room, Math.max(0, Math.ceil(need - creditedMain(g) - EPS)));
        };
        if (!(credited(g) > planned[g] + EPS) && mainShort() > 0 && credited(g) + mainShort() > planned[g] + EPS) {
          for (let guard = 0; guard < 12 && credited(g) + mainShort() > planned[g] + EPS; guard++) {
            const open = focusOpen();
            if (!open.length) break;
            const [slot] = open[open.length - 1];
            const before = sets[slot.slot_id];
            setS(slot.slot_id, 0);
            if (credited(g) + mainShort() < start[g] - EPS) { setS(slot.slot_id, before); break; }
            closedFocus.add(slot.slot_id);
            focusClosed.push({ group: g, slot_id: slot.slot_id });
          }
          continue;
        }
        if (!(credited(g) > planned[g] + EPS)) continue;
        // (the person's own Focus muscle keeps the Focus slots that fit under its final sets; a sport profile's or a fallback
        // Focus group gives all of them back while it still starts at its level's start - main days before the optional day)
        const own = (X.linesOfGroup[g] || []).some(l => prio.includes(l));
        for (let guard = 0; guard < 12; guard++) {
          if (own && !(credited(g) > planned[g] + EPS)) break;
          const open = focusOpen();
          if (!open.length) break;
          const [slot] = open[open.length - 1];
          const before = sets[slot.slot_id];
          setS(slot.slot_id, 0);
          if (credited(g) < start[g] - EPS) { setS(slot.slot_id, before); break; }
          closedFocus.add(slot.slot_id);
          focusClosed.push({ group: g, slot_id: slot.slot_id });
        }
      }
    }
    // v0.6 G-103 (R3-VOL-03 'extra SMALL-muscle sets' go to the optional day; ORD-10 'optional days are bonuses'; review 01 M2: a
    // sport-priority split squat and seated row on the swimmer's optional day while the main lower lifts sat at 3 sets): the optional
    // day's Focus slots of a big group that is not the person's own Focus close when the training days alone hold its final sets
    const BOC = PX3.big_optional_focus_close;
    if (BOC && BOC.enabled && !flatSets) {
      const wantAll = {}; for (const g of trained) wantAll[g] = planned[g];
      for (const g of trained) {
        if (!bigGroup(g) || focusGroup(g)) continue;
        const open = slotsOfGroup(g).filter(([s, di]) => !isMainDi(di) && kindOf(s) === 'focus' && s.origin !== 'bonus' && active(s));
        if (!open.length) continue;
        const before = open.map(([s]) => sets[s.slot_id]);
        for (const [s] of open) setS(s.slot_id, 0);
        const bw0 = boundWeek;
        boundWeek = wks[wks.length - 1];
        const r = reachable(wantAll);
        boundWeek = bw0;
        // (BOC.always: the slots close whatever the training days hold - a group they cannot take to its final sets is capped and said)
        if (BOC.always || (r[g] || 0) >= planned[g] - EPS) for (const [s] of open) { closedFocus.add(s.slot_id); focusClosed.push({ group: g, slot_id: s.slot_id }); }
        else open.forEach(([s], i) => { setS(s.slot_id, before[i]); });
      }
    }
    // v0.7 G-236 (R5-ATH-12): the heavy hinge's start of 3 comes out of its group's numbers - where it would leave the group's fewest
    // sets no room under its final sets to climb (R5-CLS-07: a 2-day band, a pitcher's hips), the hinge keeps its fewest sets
    const mcH = V.x7 && V.x7.start_below_top && isNum(V.x7.start_below_top.min_climb) ? V.x7.start_below_top.min_climb : 1;
    if (HH) for (const [s, di] of allSlots()) {
      if (!heavyHinge(s, di)) continue;
      const g = owner[s.slot_id], t = tally(false, 'group');
      if (g && isNum(planned[g]) && (t[g] || 0) > planned[g] - mcH + EPS) { hingeOff.add(s.slot_id); if (isNum(sets[s.slot_id]) && sets[s.slot_id] > 0) setS(s.slot_id, boundsOf(s, di)[0]); }
    }
    // what the minimum structure already holds (every exercise at its fewest sets)
    const struct = tally(false, 'group');
    // (the bounds of the planning runs are the last week's: an isolation exercise may hold its 4th set by then)
    boundWeek = wks[wks.length - 1];
    // calves that climb on the leg days (no optional-day Calves slot): their final sets are what the leg days hold
    // v0.5 fix round 1 (VOL-18 'we need to balance this out'; profile pull_per_push; samples 02 / 03 major): the pulling sets follow
    // the pressing sets. The back may pass its sport-scaled final sets for that, never the level's own top number (R4-PRG-04).
    const backG = ppRatio && PPB ? PPB.pull_group : null;
    if (backG && trained.includes(backG)) {
      const line = carrier[backG];
      const levelTop = line && V.cap[line] && isNum(V.cap[line][L]) ? V.cap[line][L] : planned[backG];
      // v0.5 fix round 2 (sample 03 major: back was a soccer midfielder's biggest group - 19 sets against quads and hips at 16 and
      // its own sport-scaled 14; UNI-02 'field athletes don't need to get bigger and stronger that much'): the back keeps its
      // sport-scaled final sets unless it is a Focus muscle - the balance is met from the press side (a press takes no set that
      // would put pressing above pulling) and the plan says what the template then holds
      const backFocus = (X.linesOfGroup[backG] || []).some(l => prio.includes(l));
      // (a template whose pulls at their fewest sets already hold more than that - his HYROX week: 8 pulls - keeps them, R4-SES-04)
      capOfGroup[backG] = PPB.back_cap === 'planned' && !backFocus ? Math.max(planned[backG], Math.floor((struct[backG] || 0) + EPS)) : Math.max(planned[backG], levelTop);
      const atStart = {}; for (const g of trained) atStart[g] = start[g];
      boundWeek = wks[0];
      const needStart = Math.floor((reachable(atStart)[backG] || 0) + EPS);
      boundWeek = wks[wks.length - 1];
      const atTop = {}; for (const g of trained) atTop[g] = planned[g];
      balanceWant = true;
      const needTop = Math.floor((reachable(atTop)[backG] || 0) + EPS);
      balanceWant = false;
      if (needTop > planned[backG]) { planned[backG] = Math.min(capOfGroup[backG], needTop); balanced.top = planned[backG]; }
      if (needStart > start[backG]) { start[backG] = Math.min(planned[backG], needStart); balanced.start = start[backG]; }
      capOfGroup[backG] = planned[backG];
    }
    // what the slots hold at most, opening the bonus exercises a group needs (scratch: the real ones open with their exercise block)
    const want = {}; for (const g of trained) want[g] = planned[g];
    let reach = reachable(want);
    // v0.6 G-200 (R4-SES-03; R4-SES-05 slot 5; review r5 08 M1): a 2-day plan's arms start at what their slot holds at its fewest sets
    // and end at what it holds at its most (with the helper credit of the other lifts) - their own final sets, never a bonus exercise
    if (ARM2 && !flatSets) {
      let moved = false;
      for (const g of trained) {
        if (!armSlotGroup(g)) continue;
        const lo = Math.floor((struct[g] || 0) + EPS), hi = Math.max(lo, Math.floor((reach[g] || 0) + EPS));
        if (start[g] > lo) start[g] = lo;
        if (planned[g] !== hi) { planned[g] = hi; want[g] = hi; moved = true; }
      }
      if (moved) reach = reachable(want);
    }
    // the 8th exercise of a training day (opened for real: it is part of the block from its first week)
    if (EXS && !flatSets) {
      // v0.5 fix round 2 (sample 06 major; COACH-R4 R4-SES-05 'the days that they do 8 exercises, they're just going to be adding an
      // extra small muscle exercise at the end'; VOL-17 'rear delts ... need to get their own sets'): the template's own next
      // station - the A day's rear-delt exercise - opens before any other extra exercise, while the week holds fewer direct
      // rear-delt sets than rules.placement.x2.template_extra asks for
      const TX = PX2.template_extra || null;
      if (TX && (TX.families || []).includes(layout.family) && trained.includes(TX.group)) {
        const want0 = isNum((TX.direct_by_level || {})[L]) ? TX.direct_by_level[L] : 0;
        const dts = templateDays(derived, model).day_types || {};
        for (const di of mainDi) {
          if (directOf(TX.muscle) >= want0 - EPS) break;
          const def = dts[days[di].day_type];
          if (!def) continue;
          const st = (def.stations || []).find(x => x.bucket === TX.bucket && x.variant === TX.variant && isNum(x.rank) && x.rank > countOf(def, derived) && !days[di].slots.some(sl => sl.station_id === x.id));
          if (!st) continue;
          const slot = openExtra(TX.group, ws0.n, TX.muscle, [di], 'why.template_extra_station');
          if (slot) tplExtraIds.add(slot.slot_id);
          if (slot) { setS(slot.slot_id, Math.max(sets[slot.slot_id], Math.min(EXS.sets[1], Math.max(EXS.sets[0], want0 - directOf(TX.muscle) + sets[slot.slot_id])))); }
        }
        reach = reachable(want);
      }
      const places = optDi.reduce((a, di) => a + Math.max(0, (BN.max_added_per_optional_day || 2) - addedOn(di)), 0);
      const short = bonusOrder(reach, planned, trained).filter(x => x !== 'calves' && (reach[x] || 0) < planned[x] - EPS);
      // (fix round 2, samples 01 / 04: a floor held by isolation exercises at their 4th set from week 1, or only with the optional
      // day) what the training days hold in week 1 with every exercise inside its default bounds
      let def1 = null;
      if (PX2.extra_for_start) { const atStart = {}; for (const x of trained) atStart[x] = start[x]; boundWeek = wks[0]; def1 = reachableDefault(atStart); boundWeek = wks[wks.length - 1]; }
      for (const g of (EXS.groups || []).filter(x => trained.includes(x))) {
        // (what the optional day's bonus exercise would add, when the group is in line for one)
        const inLine = short.indexOf(g) >= 0 && short.indexOf(g) < places;
        const bonusAdd = inLine ? Math.min(maxEx, BN.sets[1]) : 0;
        const focusG = (X.linesOfGroup[g] || []).some(l => prio.includes(l));
        const need = focusG ? planned[g] : Math.min(planned[g], start[g]);
        const floorNeed = floorMain && isNum(floorMain[g]) ? Math.min(floorMain[g], start[g]) : null;
        const shortStart = !!def1 && ((floorNeed !== null && (def1.main[g] || 0) < floorNeed - EPS) || (def1.all[g] || 0) + (inLine ? BN.sets[0] : 0) < Math.min(planned[g], start[g]) - EPS);
        // (never an extra exercise that would itself put the group above its planned final sets - R4-PRG-04)
        // (read on the whole week at its week-1 sets: a group whose optional-day stations already hold all but one exercise of
        // its ceiling - the arms day of a 6-day strength week - takes no extra exercise for the training-day floor)
        const floorGap = floorNeed !== null && def1 ? Math.max(0, floorNeed - (def1.main[g] || 0)) : 0;
        const roomForExtra = Math.max(credited(g), (def1 && def1.all[g]) || 0) + Math.max(EXS.sets[1], floorGap) + (PX2.extra_ceiling_margin || 0) <= planned[g] + EPS;
        if (((reach[g] || 0) + bonusAdd < need - EPS || (shortStart && roomForExtra)) && openExtra(g, ws0.n)) reach = reachable(want);
      }
      for (const [m, def] of Object.entries(directMinOf)) {
        if (!trained.includes(def.group)) continue;
        // (read on the first week's bounds: the direct sets are held from week 1, before an isolation exercise may take its 4th set)
        boundWeek = wks[0];
        const room = slotsOfGroup(def.group).filter(([s]) => active(s) && ((crOf(s) || {})[m] || 0) >= 1 - EPS).reduce((a, [s, di]) => a + boundsOf(s, di)[1], 0);
        boundWeek = wks[wks.length - 1];
        const dm = room < def.min ? openExtra(def.group, ws0.n, m, null, BL && model.has('en', 'why.muscle_direct_exercise') ? 'why.muscle_direct_exercise' : null) : null;
        if (dm) { tplExtraIds.add(dm.slot_id); reach = reachable(want); }
      }
    }
    // v0.6 G-207 (R4-SES-03 / H17; CH5-03; review r6 08 M1): on a 2-day plan a group rules.placement.x3.two_day_main_floor.also_groups
    // names (the shoulders) holds the band on the training days; when those days cannot take it to its planned final sets the optional
    // day's bonus exercise is EXTRA on top of what they hold - its final sets are the training days' top plus the bonus exercise's
    // fewest sets, so the stairway still climbs to them (the plan says where it ends without the optional day, G-204 / G-208)
    const T2a = D9.two_day && floorMain && PX3.two_day_main_floor ? (PX3.two_day_main_floor.also_groups || []) : [];
    // v0.6 G-221 (R4-SES-03 'about 6-8'; CH5-03 a bonus only 'if needed'; review r7 08 M1: the shoulders held the band on Monday +
    // Thursday and a Friday rear-delt fly still came on top, 8-9 sets, above every big group): a group the training days already hold
    // inside the band takes no bonus exercise - its final sets are what the training days hold (retires G-207's 'the bonus is extra')
    if (T2a.length && !flatSets && BL && BL.two_day_no_extra) {
      const sn = snapshot();
      allocate(want, null);
      const rm = tally(true, 'group');
      restore(sn);
      for (const g of trained) if (T2a.includes(g) && isNum(floorMain[g]) && !noBonusFor(g) && (rm[g] || 0) >= floorMain[g] - EPS) noBonus2.add(g);
    } else if (T2a.length && !flatSets) {
      let moved = false;
      for (const g of trained) {
        if (!T2a.includes(g) || !isNum(floorMain[g]) || noBonusFor(g) || (reach[g] || 0) >= planned[g] - EPS) continue;
        const extra = Math.floor((reach[g] || 0) + EPS) + BN.sets[0];
        // (the plan's own top for the line, R4-PRG-04 - its direct sets never above it, its credited sets less than one set above it, as
        // the ceiling check reads it: when the training days plus the bonus would pass that, the training days carry the group alone -
        // no bonus exercise - and its final sets are what they hold)
        const line = carrier[g];
        const top0 = line && bt0.cap && isNum(bt0.cap[line]) ? bt0.cap[line] : (line && V.cap && V.cap[line] && isNum(V.cap[line][L]) ? V.cap[line][L] : Infinity);
        const lim = Math.min(top0 + 1, GMAX !== null ? GMAX : Infinity);
        if ((reach[g] || 0) + BN.sets[0] > lim + EPS) { noBonus2.add(g); continue; }
        twoDayLim[g] = lim;
        // (an earlier run of this block whose weeks still passed it - helper credit that climbs with the other groups' steps - plans the
        // group one set lower, so no own step is asked on top of that credit: hints.two_day_top)
        const lim2 = hints && hints.two_day_top && isNum(hints.two_day_top[g]) ? hints.two_day_top[g] : lim;
        const fin = Math.min(Math.max(extra, planned[g]), lim2);
        if (fin !== planned[g]) { planned[g] = fin; want[g] = fin; moved = true; }
      }
      if (moved) reach = reachable(want);
    }
    const bonusFor = [];
    const sn0 = snapshot();
    const scratchBonus = [];
    const FB = PX3.bonus_main_day_fallback || null;
    const mainBonus = []; // the training-day bonus exercises opened here (for real: part of the block from week 1)
    const famGroups = FB && FB.family_groups ? (FB.family_groups[layout.family] || []) : [];
    for (const g of bonusOrder(reach, planned, trained)) {
      if ((reach[g] || 0) >= planned[g] - EPS) continue;
      if (noBonusFor(g)) continue;
      // v0.6 G-102 (R3-VOL-03 'extra SMALL-muscle sets'): a big group never takes the optional day's bonus exercise
      const smallOnly = !!PX3.bonus_small_only && bigGroup(g) && !BIGNEED;
      // (a big group takes a training day's bonus exercise only for a whole set or more it cannot reach - a quarter-set helper shortfall
      // is the template's own climb; CH5-03)
      // (and only in the families rules.placement.x3.bonus_small_only.big_main_day_families names - the physique plans of CH5-03's
      // question; a field athlete's and a class member's big groups keep G-105 / G-113, UNI-02)
      const BMF = PX3.bonus_small_only && PX3.bonus_small_only.big_main_day_families;
      const bigExtra = BIGNEED && bigGroup(g) && (!BMF || BMF.includes(layout.family)) && (planned[g] - (reach[g] || 0)) >= 1 - EPS ? [g] : [];
      // v0.6 G-106 (R4-SES-03; review 08 M2 'put the face pull / rear-delt work on the main days'): on 2 training days a small group's
      // bonus exercise goes to a training day that already works the group (its lifts credit it), inside the session size, before
      // the optional day
      if (D9.two_day && PX3.two_day_main_floor && FB && !flatSets && (FB.groups || []).includes(g) && !smallOnly) {
        // (R3-VOL-03 'on a day that already trains biceps, never as the only biceps exercise of that day')
        const sl = openExtra(g, ws0.n, null, null, 'why.bonus_main_day');
        if (sl) { mainBonus.push(sl); reach = reachable(want); continue; }
      }
      const slot = smallOnly ? null : openBonus(g, ws0.n, null, true);
      if (!slot) {
        // v0.6 G-105 (R3-VOL-03 'with no optional day, on a day that already trains biceps'; review 07 M1): no optional day can take
        // it - the bonus exercise goes at the end of the training day that trains the group with the fewest exercises (inside the
        // session size); the class family's squat day takes a second knee lift (review 04 M1)
        if (FB && !flatSets && ((FB.groups || []).includes(g) || famGroups.includes(g) || bigExtra.length) && openExtra(g, ws0.n, null, null, 'why.bonus_main_day', [...famGroups, ...bigExtra])) { mainBonus.push(extraOpen.get(g)); reach = reachable(want); }
        continue;
      }
      scratchBonus.push([g, slot]);
      bonusFor.push(g);
      reach = reachable(want);
      // (COACH-CH5 CH5-03, the big groups first: a big group one bonus exercise cannot take to its planned final sets takes its next
      // one before the small groups take the optional day's places)
      if (BIGNEED && bigGroup(g) && PX3.reach_planned) for (let k = 2; k <= (PX3.reach_planned.max_bonus_per_group || 1) && (reach[g] || 0) < planned[g] - EPS; k++) {
        const key = g + '#' + k;
        const sl = openBonus(g, ws0.n, null, true, key, true);
        if (!sl) break;
        scratchBonus.push([key, sl]); bonusFor.push(key); reach = reachable(want);
      }
    }
    // COACH-CH5 CH5-03 ('they should reach more if needed, no cap until 35'): a group one bonus exercise cannot take to its planned
    // final sets takes another one (another optional-day place; never a pattern the day before trained, G-104), up to
    // rules.placement.x3.reach_planned.max_bonus_per_group exercises
    const RP = PX3.reach_planned || null;
    if (RP && !flatSets) for (let k = 2; k <= (RP.max_bonus_per_group || 1); k++) {
      for (const g of bonusOrder(reach, planned, trained)) {
        if ((reach[g] || 0) >= planned[g] - EPS || noBonusFor(g) || g === 'calves') continue;
        // (a group with no bonus exercise yet takes its first one here, on the optional day's wider place count)
        const key = bonusFor.includes(g) || extraOpen.has(g) ? g + '#' + k : g;
        if (bonusFor.includes(key) || bonusOpen.has(key)) continue;
        const slot = openBonus(g, ws0.n, null, true, key, true);
        if (!slot) continue;
        scratchBonus.push([key, slot]);
        bonusFor.push(key);
        reach = reachable(want);
      }
    }
    // v0.6 G-115 (VOL-18 'we need to balance this out'; G-102 left the back without the optional day's bonus row): where the training
    // days cannot take the back to its final sets and no profile ratio holds the balance already, the presses take no set that
    // would put the week's pulling sets under rules.placement.x3.press_hold.min_pull_per_push of its pressing sets - the chest is then
    // held where the pulls allow, and the plan says so
    const PH = PX3.press_hold;
    if (PH && PPB && !ppRatio && !circuitPlan && trained.includes(PPB.pull_group) && (reach[PPB.pull_group] || 0) < planned[PPB.pull_group] - EPS && !(PPB.exempt_focus_lines || []).some(l => prio.includes(l))) {
      ppRatio = { want: PH.min_pull_per_push, hard: PH.min_pull_per_push, held: true };
      capOfGroup[PPB.pull_group] = planned[PPB.pull_group];
      reach = reachable(want);
    }
    // ---- v0.6 G-217 / G-219 (rules.placement.x3.bonus_last): every bonus exercise of a group - the optional day's (scratch here) and
    // a training day's (open here) - in the order it was opened; the template's own station and a muscle's direct minimum are not
    const floorOfGroup = (g) => (g === 'calves' ? 0 : D9.two_day && V.two_day ? ((X.linesOfGroup[g] || []).some(l => (V.two_day.big_classes || ['big']).includes((X.defs[l] || {}).class)) ? V.two_day.weekly_sets[0] : 0) : ((D9.floor_groups || []).includes(g) ? V.floor.value : 0));
    let gb = null;
    const dayOfSlot = (sl) => days.findIndex(d => d.added.includes(sl));
    const droppedIds = new Set();
    const dropBonus = (e) => {
      droppedIds.add(e.slot.slot_id);
      const di = dayOfSlot(e.slot);
      if (di >= 0) days[di].added = days[di].added.filter(s => s !== e.slot);
      const ai = added.indexOf(e.slot); if (ai >= 0) added.splice(ai, 1);
      delS(e.slot.slot_id); delF(e.slot.slot_id); delete owner[e.slot.slot_id]; ownerVer++;
      if (e.kind === 'opt') {
        bonusOpen.delete(e.key);
        const i = scratchBonus.findIndex(([k]) => k === e.key); if (i >= 0) scratchBonus.splice(i, 1);
        const j = bonusFor.indexOf(e.key); if (j >= 0) bonusFor.splice(j, 1);
      } else {
        if (extraOpen.get(e.g) === e.slot) extraOpen.delete(e.g);
        const i = mainBonus.indexOf(e.slot); if (i >= 0) mainBonus.splice(i, 1);
      }
      gb = gb.filter(x => x !== e);
    };
    // (the sets each bonus holds switched off while fn runs: what the template's lifts hold without them)
    const without = (list, fn) => {
      const keep = list.map(e => sets[e.slot.slot_id]);
      for (const e of list) setS(e.slot.slot_id, 0);
      try { return fn(); } finally { list.forEach((e, j) => { setS(e.slot.slot_id, keep[j]); }); }
    };
    const fewestOf = (e) => boundsOf(e.slot, dayOfSlot(e.slot))[0];
    if (BL && !flatSets) {
      gb = [];
      for (const sl of added) {
        if (!isGroupBonus(sl) || !owner[sl.slot_id]) continue;
        const sc = scratchBonus.find(([, s2]) => s2 === sl);
        gb.push({ key: sc ? sc[0] : 'main:' + sl.slot_id, g: owner[sl.slot_id], slot: sl, kind: sc ? 'opt' : 'main' });
        bonusGroupsAll.add(owner[sl.slot_id]);
      }
      // G-219 (VOL-07 'add it to the first exercise'; CH5-03 'if needed'; R4-PRG-04 'never above the top'; review r7 02 M1: chest 12 of
      // 13 with every press at 4 - a 2-set fly takes it to 14 or holds a press under its cap): a group's bonus exercises are kept only
      // while the template's lifts at their tops plus every bonus's fewest sets stay inside the group's final sets - a shortfall
      // smaller than a bonus exercise is held at what the slots give, and said (H10, G-107). A bonus the first week's floor or start
      // needs is kept (the floor of 10 is the higher rule, H17).
      if (BL.whole_bonus_only && gb.length) {
        const r0 = without(gb, () => reachable(want));
        const bw0 = boundWeek; boundWeek = wks[0];
        for (const g of [...new Set(gb.map(e => e.g))]) {
          const es = gb.filter(e => e.g === g);
          // (the first week: the group's own lifts at their week-1 tops, every other group at its fewest sets - the helper credit it is
          // sure of; a start or floor they cannot hold keeps the bonus)
          const floorNeed = Math.min(start[g], floorOfGroup(g) || start[g]);
          boundWeek = wks[0];
          const r1 = without(gb, () => reachable({ [g]: start[g] }));
          boundWeek = bw0;
          if ((r1[g] || 0) < floorNeed - EPS) { for (const e of es) e.startNeed = true; continue; }
          let k = es.length;
          while (k > 0 && Math.floor((r0[g] || 0) + es.slice(0, k).reduce((a, e) => a + fewestOf(e), 0) + EPS) > planned[g]) k--;
          for (const e of es.slice(k)) dropBonus(e);
        }
        boundWeek = bw0;
        reach = reachable(want);
      }
    }
    // v0.7 G-235 (COACH-R5 R5-VOL-11: 'A muscle is 1 set short of its target and an extra exercise would add 2 ... Give the day's first
    // press a 5th set in the last block, so it reaches 13'): a group the template's lifts at their tops leave short of its final sets
    // by less than a whole bonus exercise (rules.placement.x7.one_set_shortfall.sets) - its first lift of the week (the first training
    // day that trains it) takes that set over its own top in the block's last exercise block, never above the level's per-exercise
    // top. Read on the last week's bounds; kept only when it closes the gap.
    const OSS = PX7.one_set_shortfall && PX7.one_set_shortfall.enabled && !flatSets && !circuitPlan ? PX7.one_set_shortfall : null;
    extraTop.clear();
    if (OSS) {
      const ebLast = wks[wks.length - 1].exercise_block;
      // (what the template's lifts hold without the bonus exercises: a bonus kept only for the first week's start or floor - H17 -
      // does not close the gap at the top)
      const tplOnly = () => (gb && gb.length ? without(gb, () => reachable(want)) : reachable(want));
      let r0 = tplOnly();
      for (const g of trained) {
        if (g === 'calves' || noBonusFor(g)) continue;
        // (a group a whole bonus exercise takes to its final sets keeps it, G-219)
        if (gb && gb.some(e => e.g === g && !e.startNeed)) continue;
        const gap = planned[g] - Math.floor((r0[g] || 0) + EPS);
        if (!(gap > 0 && gap <= OSS.sets)) continue;
        const di = mainDi.find(dj => !!leadSlotOf(dj, g));
        const lead = di === undefined ? null : leadSlotOf(di, g);
        if (!lead || boundsOf(lead, di)[1] >= maxEx) continue;
        extraTop.set(lead.slot_id, { eb: ebLast, add: OSS.sets, group: g });
        const r2 = tplOnly();
        if (Math.floor((r2[g] || 0) + EPS) > Math.floor((r0[g] || 0) + EPS)) r0 = r2;
        else extraTop.delete(lead.slot_id);
      }
      if (extraTop.size) reach = reachable(want);
    }
    const S0 = {}, top = {}, sched = {}, lambda = {}, noted = {}, capped = [];
    for (const g of trained) {
      // the stairway starts at the level's start, or at what the template's minimum structure already gives the group
      // (a group the slots cannot even hold at its start begins - and stays - at what they hold; the plan says so)
      const floorStruct = Math.floor((struct[g] || 0) + EPS);
      const held = Math.max(floorStruct, Math.floor((reach[g] || 0) + EPS));
      S0[g] = Math.min(Math.max(start[g], floorStruct), held);
      // a block that holds its sets (the year plan's cut quarter, rules.plan.year: flat_sets) has no climb: its top is its start
      top[g] = flatSets ? S0[g] : Math.max(S0[g], Math.min(planned[g], held));
      // v0.5 fix round 1 (R2-PER-03 'every plan climbs like a stairway'; samples 04 / 06: chest and quads started at everything
      // their exercises hold and sat flat for the whole block): a group its template cannot take to the planned final sets still
      // climbs - it starts one set an exercise under what the template holds (never under its floor, never more than the planned
      // climb), so every exercise has a step left
      if (PX.keep_climb_when_capped && !flatSets && g !== 'calves' && top[g] < planned[g] && !(bt0.pain_muscles || []).includes(carrier[g])) {
        const climb = Math.min(planned[g] - start[g], slotsOfGroup(g).filter(([s]) => active(s)).length);
        const low = Math.max(floorStruct, floorOfGroup(g), top[g] - Math.max(0, climb));
        if (low < S0[g]) { S0[g] = low; lowered.push({ group: g, start: low, planned_start: start[g] }); }
      }
      // (fix round 2: what an earlier run of this block really held - the first week's sets, the final sets its exercises reach)
      if (hints && !flatSets) {
        if (isNum(hints.top && hints.top[g])) top[g] = Math.max(S0[g], Math.min(top[g], hints.top[g]));
        if (isNum(hints.start && hints.start[g])) { S0[g] = Math.max(S0[g], hints.start[g]); top[g] = Math.max(top[g], S0[g]); const i = lowered.findIndex(x => x.group === g); if (i >= 0 && S0[g] >= start[g]) lowered.splice(i, 1); else if (i >= 0) lowered[i].start = S0[g]; }
      }
    }
    // v0.7 G-237 (COACH-R5 R5-CLS-07 'Nothing should start at their top number. It should all be gradual, and whatever the focus is,
    // that should be a little bit higher to start'; rules.volume.x7.start_below_top): a group whose start sits at its top climbs at least
    // min_climb sets - its start comes down first (never under what its exercises hold at their fewest sets, never under its floor),
    // else its top goes up (inside the level's top, the absolute weekly ceiling and what its exercises hold). Calves keep their own dose
    // (R3-SES-01), a pain-held group its pain numbers; a Focus group already starts higher (R3-SES-01).
    const SBT = V.x7 && V.x7.start_below_top && V.x7.start_below_top.enabled && !flatSets ? V.x7.start_below_top : null;
    if (SBT) {
      const mc = isNum(SBT.min_climb) ? SBT.min_climb : 1;
      for (const g of trained) {
        if ((SBT.exempt_groups || []).includes(g) || top[g] > S0[g] || noBonus2.has(g) || armSlotGroup(g)) continue;
        if (SBT.exempt_pain && (bt0.pain_muscles || []).includes(carrier[g])) continue;
        const floorStruct = Math.floor((struct[g] || 0) + EPS);
        const low = Math.max(floorStruct, floorOfGroup(g), top[g] - mc);
        if (low < S0[g]) { S0[g] = low; continue; }
        const line = carrier[g];
        const levelTop = line && V.cap[line] && isNum(V.cap[line][L]) ? V.cap[line][L] : planned[g];
        // (never above the block's own top for the line - the sport's or the class's scaled top, R4-PRG-04 'never above the level's top':
        // a group whose fewest sets already sit at that top stays there, as it must)
        const blockTop = line && bt0 && bt0.cap && isNum(bt0.cap[line]) ? bt0.cap[line] : Infinity;
        const want2 = Math.min(S0[g] + mc, levelTop, blockTop, GMAX !== null ? GMAX : Infinity);
        if (!(want2 > S0[g])) continue;
        const wt = {}; for (const g2 of trained) wt[g2] = planned[g2];
        wt[g] = want2;
        const can = Math.floor((reachable(wt)[g] || 0) + EPS);
        if (can >= want2) { top[g] = want2; planned[g] = Math.max(planned[g], want2); }
      }
    }
    // every week must be holdable: a group's sets that week are its own exercises (2-5 sets each) plus the helper credit the
    // other groups' sets give THAT week. Where the fitted curve asks for more than the slots hold in a week, that week's number
    // is what they hold (still whole sets, never down); a start or a top the slots cannot hold moves the same way.
    // (the bonus exercises a group needs are open in this scratch state, as they will be from their exercise block on)
    const weekCap = {}; for (const g of trained) weekCap[g] = Array(N).fill(Infinity);
    // v0.5 fix round 1 (R3-VOL-04, R2-PER-03 / R2-PER-04, R4-PRG-01; samples 01 / 02 / 03 / 06 / 08): the groups' whole-set steps are
    // fitted TOGETHER (engine/progression staggerStairways) - the week's total follows the sum of the curves and the groups take
    // turns, so the plan climbs a set or two most weeks instead of sitting flat and jumping, and the last steps are shared between
    // the last two weeks (one week early is fine, never earlier)
    const ST = PG.stagger || null;
    // v0.5 fix round 2 (sample 04 minor 'the end-test week is also the biggest week'; R2-PER-07 the test replaces the top sets;
    // R4-PRG-01 'arriving one week early and holding is fine'): a block that ends with a strength-test week reaches its final
    // sets in the week before and holds them in the test week (rules.placement.x2.end_test_week_hold)
    const lastW = wks[wks.length - 1];
    const endHold = !!PX2.end_test_week_hold && !flatSets && N >= 4 && !!(lastW && lastW.test && lastW.test.type === 'end' && (lastW.test.items || []).includes('strength'));
    const NE = endHold ? N - 1 : N;
    const fit = () => {
      const curve = {};
      for (const g of trained) {
        const grows = !flatSets && top[g] > S0[g];
        curve[g] = grows ? stairwayProgress({ start: S0[g], peak: top[g], rates: rates[g].slice(0, NE - 1), numerics: PG.numerics }) : null;
        lambda[g] = curve[g] && curve[g].lambda !== null ? curve[g].lambda : 0;
      }
      let joint = null;
      if (ST && ST.enabled) {
        joint = staggerStairways({
          weeks: NE, weeksEarly: NE >= 3 && !endHold ? ST.weeks_early : 0,
          groups: trained.map(g => ({ id: g, start: S0[g], peak: Math.max(S0[g], flatSets ? S0[g] : top[g]), progress: curve[g] ? curve[g].progress : null, cap: weekCap[g].slice(0, NE).map(v => (Number.isFinite(v) ? v : Number.MAX_SAFE_INTEGER)) }))
        }).sets;
        if (endHold) { const held = {}; for (const g of trained) held[g] = [...joint[g], joint[g][NE - 1]]; joint = held; }
      }
      for (const g of trained) {
        const sp = joint || flatSets || top[g] <= S0[g] ? null : stairOf(S0[g], top[g], rates[g].slice(0, NE - 1), model);
        const base = joint ? joint[g].slice() : sp ? (endHold ? [...sp.sets, sp.sets[sp.sets.length - 1]] : sp.sets.slice()) : Array(N).fill(S0[g]);
        const sc = base.map((v, i) => Math.min(v, weekCap[g][i]));
        for (let i = N - 2; i >= 0; i--) sc[i] = Math.min(sc[i], sc[i + 1]);
        sched[g] = sc;
        noted[g] = N > 1 ? accelerationReport({ sets: sc, referenceRates: rates[g], noteAbove: PG.note_above, minWholeSets: PG.note_min_whole_sets }).noted.slice() : [];
      }
    };
    // v0.6 G-217 (rules.placement.x3.bonus_last.open_when_needed; VOL-07; CH5-03 'if needed'; review r7 02 M1: a Tuesday fly from week 1
    // for a 13th chest set the template's presses could not hold only from week 9): each bonus exercise of a group opens with the
    // exercise block whose weeks its template lifts - every one at its own top that week - cannot take to the group's number, never
    // before. The weeks before it are what the template's lifts hold, and the week it opens leaves room for its fewest sets, so the
    // group never runs ahead of its schedule there.
    const ebOfI = (i) => wks[Math.min(i, wks.length - 1)].exercise_block;
    const ebList = [...new Set(wks.map(w => w.exercise_block))];
    const gbOpen = new Map();   // key -> the exercise block the bonus opens with (Infinity: never needed)
    const whenOpen = !!(gb && gb.length && BL.open_when_needed);
    if (whenOpen) for (const e of gb) gbOpen.set(e.key, ebList[0]);
    const offIn = (i) => (whenOpen ? gb.filter(e => !(gbOpen.get(e.key) <= ebOfI(i))) : []);
    // (G-219: the last week of the block a bonus opens with holds every template lift of its group at its top plus the bonus's fewest
    // sets - that week is raised to it when the final sets allow, else the bonus waits)
    const earlyMax0 = isNum(PG.arrival_weeks_early_max) ? PG.arrival_weeks_early_max : 1;
    const weekMin = {}; for (const g of trained) weekMin[g] = Array(N).fill(0);
    // (the joint fit of every group's steps reads the caps with every bonus open, as it always did; the weeks before a bonus opens are
    // then held, for its own group only, to what that group's lifts hold without it - no other group's steps move for it)
    const gCap = {}; for (const g of trained) gCap[g] = Array(N).fill(Infinity);
    const bonusGroups = [...new Set(gb ? gb.map(e => e.g) : [])].filter(g => trained.includes(g));
    const capAt = (g, i) => Math.min(weekCap[g][i], gCap[g][i]);
    const fitM = () => {
      fit();
      if (!whenOpen) return;
      for (const g of bonusGroups) {
        const sc = sched[g];
        for (let i = 0; i < N; i++) sc[i] = Math.min(sc[i], gCap[g][i]);
        for (let i = N - 2; i >= 0; i--) sc[i] = Math.min(sc[i], sc[i + 1]);
        // (v0.7 G-301, H21: a week the bonus raises is never raised above what any later week can hold - a raise set when the final
        // sets still allowed it is not kept once a later round lowers the later weeks' caps; the stairway never steps down)
        const capFrom = Array(N).fill(Infinity);
        for (let i = N - 1; i >= 0; i--) capFrom[i] = Math.min(capAt(g, i), i < N - 1 ? capFrom[i + 1] : Infinity);
        let m = 0;
        for (let i = 0; i < N; i++) { m = Math.max(m, weekMin[g][i]); if (sc[i] < m) sc[i] = Math.max(sc[i], Math.min(m, capFrom[i])); }
      }
    };
    const keyG = (k) => (gb.find(x => x.key === k) || {}).g;
    for (let outer = 0; outer < (whenOpen ? 8 : 1); outer++) {
      for (let pass = 0; pass < 5; pass++) {
        fitM();
        let changed = false;
        for (let i = 0; i < N; i++) {
          const t = {}; for (const g of trained) t[g] = sched[g][i];
          boundWeek = wks[Math.min(i, wks.length - 1)];
          const r = reachable(t);
          for (const g of trained) {
            const can = Math.max(0, Math.floor((r[g] || 0) + EPS));
            if (can >= sched[g][i]) continue;
            weekCap[g][i] = can; changed = true;
            if (i === 0) S0[g] = Math.min(S0[g], can);
            if (i === N - 1) top[g] = Math.max(S0[g], Math.min(top[g], can));
          }
          const off = offIn(i);
          if (!off.length) continue;
          const r2 = without(off, () => reachable(t));
          for (const g of bonusGroups) {
            const can = Math.max(0, Math.floor((r2[g] || 0) + EPS));
            if (can >= sched[g][i] || gCap[g][i] <= can) continue;
            gCap[g][i] = can; changed = true;
          }
        }
        if (!changed) break;
      }
      fitM();
      if (!whenOpen) break;
      // which exercise block each bonus opens with, read on this schedule at each block's last week: a group whose template lifts (and
      // the bonuses already open), every one at its top that week, cannot hold its number opens its next bonus - when every template
      // lift at its top plus the fewest sets of its open bonuses stays inside the block's ceiling (the final sets; one under them
      // before the last two weeks, R4-PRG-01)
      const next = new Map(), on = new Set();
      let moved = false;
      const holdAt = (g, iL, t, keys) => { boundWeek = wks[Math.min(iL, wks.length - 1)]; return without(gb.filter(e => !keys.has(e.key)), () => reachable({ ...t, [g]: (GMAX || 99) + 99 }))[g] || 0; };
      for (const eb of ebList) {
        const iL = [...Array(N).keys()].filter(i => ebOfI(i) === eb).pop();
        for (let guard = 0; guard < 12; guard++) {
          let opened = false;
          const t = {}; for (const g2 of trained) t[g2] = sched[g2][iL];
          const idxs = [...Array(N).keys()].filter(i => ebOfI(i) === eb);
          for (const g of [...new Set(gb.map(e => e.g))]) {
            const e = gb.find(x => x.g === g && !on.has(x.key));
            if (!e || !isNum(t[g])) continue;
            // (needed: some week of the block - the first week's floor or start too - is more than the lifts open can hold that week)
            if (!idxs.some(i => { const ti = {}; for (const g2 of trained) ti[g2] = sched[g2][i]; return holdAt(g, i, ti, on) < ti[g] - EPS; })) continue;
            const mineOff = new Set([...on].filter(k => keyG(k) !== g));
            const fewOn = [...on].filter(k => keyG(k) === g).reduce((a, k) => a + fewestOf(gb.find(x => x.key === k)), 0);
            const need = Math.floor(holdAt(g, iL, t, mineOff) + fewOn + fewestOf(e) + EPS);
            const ceil = iL < N - 1 - earlyMax0 ? sched[g][N - 1] - 1 : sched[g][N - 1];
            // (a bonus the first week's start or floor needs opens with the first block whatever the template's lifts then hold - the
            // floor is the higher rule, H17)
            if (need > ceil && !(e.startNeed && eb === ebList[0])) continue;
            // (the block's last week is raised by one set at most, PROPOSED - a bigger jump waits for the next block)
            if (need > t[g] + 1 && !(e.startNeed && eb === ebList[0])) continue;
            // (R4-PRG-01: the week it opens with holds at least the group's start plus the fewest sets of what opens then - a bonus that would
            // take the group to its final sets before the last two weeks waits for a later block, or never opens)
            const s0 = [...Array(N).keys()].find(i => ebOfI(i) === eb);
            const fewHere = fewestOf(e) + [...on].filter(k => keyG(k) === g && next.get(k) === eb).reduce((a, k) => a + fewestOf(gb.find(x => x.key === k)), 0);
            if (s0 > 0 && sched[g][0] + fewHere > (s0 < N - 1 - earlyMax0 ? sched[g][N - 1] - 1 : sched[g][N - 1])) continue;
            if (need > t[g] && need <= ceil && weekMin[g][iL] < need) { weekMin[g][iL] = need; moved = true; }
            on.add(e.key); next.set(e.key, eb); opened = true;
          }
          if (!opened) break;
        }
      }
      for (const e of gb) { const v = next.has(e.key) ? next.get(e.key) : Infinity; if (gbOpen.get(e.key) !== v) moved = true; gbOpen.set(e.key, v); }
      if (!moved) break;
    }
    if (whenOpen) {
      fitM();
      // (the week a bonus opens with holds the template's sets of the week before plus the bonus's fewest sets: that week's number takes
      // the step - inside its own week's cap and, before the last two weeks, under the final sets (R4-PRG-01) - else the weeks before
      // it hold that much less; never under the group's start)
      const earlyMax = earlyMax0;
      for (const g of trained) for (const eb of ebList.slice(1)) {
        const opening = gb.filter(e => e.g === g && gbOpen.get(e.key) === eb);
        const s = [...Array(N).keys()].find(i => ebOfI(i) === eb);
        if (!opening.length || !(s > 0)) continue;
        const b = opening.reduce((a, e) => a + fewestOf(e), 0);
        const sc = sched[g];
        if (sc[s] >= sc[s - 1] + b) continue;
        const most = Math.min(capAt(g, s), s < N - 1 - earlyMax ? sc[N - 1] - 1 : sc[N - 1]);
        const want = Math.max(sc[s - 1] + b, sc[s]);
        if (want <= most) { for (let i = s; i < N; i++) sc[i] = Math.max(sc[i], Math.min(want, capAt(g, i))); continue; }
        const low = Math.max(sc[0], most - b);
        for (let i = 0; i < s; i++) sc[i] = Math.min(sc[i], low);
        for (let i = s; i < N; i++) sc[i] = Math.max(sc[i], Math.min(low + b, capAt(g, i)));
      }
      for (const g of trained) noted[g] = N > 1 ? accelerationReport({ sets: sched[g], referenceRates: rates[g], noteAbove: PG.note_above, minWholeSets: PG.note_min_whole_sets }).noted.slice() : [];
    }
    // v0.7 G-238 (round-8 coach-eye minors 01 m2 / 06 m1: 'open a bonus in the WEEK its group's template lifts all reach their tops, not
    // at the start of its exercise block'; VOL-07; CH5-03 'if needed'; G-218; rules.placement.x7.bonus_open_week): inside the exercise
    // block a bonus opens with, it comes in the first week whose number its group's template lifts - every one at its own top that week -
    // and the bonuses already in cannot hold; the weeks before hold what the template lifts hold (they take those steps), and the week it
    // comes in holds the week before plus its fewest sets (inside the week's cap and, before the last two weeks, under the final sets,
    // R4-PRG-01) - else it comes in a later week; when no week allows that, it keeps its exercise block's first week (as G-217)
    gbWeek.clear(); dormantWk.clear();
    const BOW = whenOpen && PX7.bonus_open_week && PX7.bonus_open_week.enabled ? PX7.bonus_open_week : null;
    if (BOW) {
      const firstI = (eb) => [...Array(N).keys()].find(i => ebOfI(i) === eb);
      const order = gb.filter(e => Number.isFinite(gbOpen.get(e.key))).sort((a, b) => gbOpen.get(a.key) - gbOpen.get(b.key));
      const done = new Set();
      for (const e of order) {
        const g = e.g, eb = gbOpen.get(e.key), s = firstI(eb);
        done.add(e.key);
        if (s === undefined || (e.startNeed && eb === ebList[0])) { if (s !== undefined) gbWeek.set(e.key, s); continue; }
        // (the bonuses in at week i: the other groups' by their exercise block, this group's own by the week they came in)
        const inAt = (i) => new Set(gb.filter(x => x.key !== e.key && (x.g !== g ? gbOpen.get(x.key) <= ebOfI(i) : done.has(x.key) && gbWeek.has(x.key) && gbWeek.get(x.key) <= i)).map(x => x.key));
        const holdOf = (i) => {
          const t = {}; for (const g2 of trained) t[g2] = sched[g2][i];
          t[g] = (GMAX || 99) + 99;
          boundWeek = wks[Math.min(i, wks.length - 1)];
          const keys = inAt(i);
          return Math.floor((without(gb.filter(x => !keys.has(x.key)), () => reachable(t))[g] || 0) + EPS);
        };
        const sc = sched[g];
        let w0 = -1;
        for (let i = s; i < N; i++) if (holdOf(i) < sc[i]) { w0 = i; break; }
        // (no week needs it, or the first week does: it keeps its exercise block's first week)
        if (w0 <= 0) { gbWeek.set(e.key, s); continue; }
        const b = fewestOf(e);
        const mostAt = (i) => Math.min(capAt(g, i), i < N - 1 - earlyMax0 ? sc[N - 1] - 1 : sc[N - 1]);
        // (the week before it comes in, every template lift of the group at its top: what they hold, inside that week's ceiling)
        const fullAt = (i) => Math.max(sc[w0 - 1], Math.min(holdOf(i), mostAt(i)));
        // (PER-02 / E-86, 'if compatible': a new exercise comes in where an exercise block starts, or - on an optional day - while 2+
        // weeks of its exercise block remain. A week that does not allow it moves the bonus to the nearest week that does: earlier,
        // when its group's template lifts are already at their tops that week; or later, the weeks between holding what the template
        // lifts hold; at the same distance the earlier week)
        const ixOf = (i) => [...Array(N).keys()].filter(j => ebOfI(j) === ebOfI(i));
        const allowed = (i) => { const ix = ixOf(i), pos = ix.indexOf(i); return pos === 0 || (e.kind === 'opt' && pos <= ix.length - 2); };
        const fitsFwd = (i) => fullAt(i - 1) + b <= mostAt(i);
        let at = -1, early = false;
        if (allowed(w0) && fitsFwd(w0)) at = w0;
        if (at < 0) {
          let back = -1, fwd = -1;
          for (let i = w0 - 1; i >= Math.max(s, 1); i--) {
            if (!allowed(i)) continue;
            const lv = Math.floor(sc[i] + EPS);
            if (holdOf(i) <= lv && lv + b <= mostAt(i)) back = i;
            break;
          }
          for (let i = w0 + 1; i < N; i++) if (allowed(i) && fitsFwd(i)) { fwd = i; break; }
          if (back >= 0 && (fwd < 0 || w0 - back <= fwd - w0)) { at = back; early = true; } else at = fwd;
        }
        if (at < 0) { gbWeek.set(e.key, s); continue; }
        if (early) {
          // (its template lifts already at their tops that week: the bonus's step comes on top of the week's number)
          const want = Math.floor(sc[at] + EPS) + b;
          for (let k = at; k < N; k++) sc[k] = Math.max(sc[k], Math.min(want, capAt(g, k)));
        } else {
          // (the weeks before it hold what the template lifts hold - they take those steps; the week it comes in takes the bonus's step)
          const want = fullAt(at - 1) + b;
          for (let j = w0; j < at; j++) sc[j] = Math.max(sc[j - 1], fullAt(j));
          // (the template lifts take their last step the week before, not with the bonus in one jump)
          if (sc[at - 1] < want - b && (at - 1 < 1 || sc[at - 2] <= want - b)) sc[at - 1] = want - b;
          for (let k = at; k < N; k++) sc[k] = Math.max(sc[k], Math.min(want, capAt(g, k)));
          // (the week it comes in takes its fewest sets' step, not the whole climb the bonuses give: the next steps come in the
          // following weeks - another bonus of the group, if needed, in its own week)
          if (at < N - 1) sc[at] = Math.max(sc[at - 1], Math.min(sc[at], want));
        }
        for (let k = 1; k < N; k++) if (sc[k] < sc[k - 1]) sc[k] = sc[k - 1];
        gbWeek.set(e.key, at);        if (ebOfI(at) > eb) gbOpen.set(e.key, ebOfI(at));
      }
      for (const g of trained) noted[g] = N > 1 ? accelerationReport({ sets: sched[g], referenceRates: rates[g], noteAbove: PG.note_above, minWholeSets: PG.note_min_whole_sets }).noted.slice() : [];
    }
    boundWeek = null;
    for (const g of trained) {
      S0[g] = sched[g][0]; top[g] = sched[g][N - 1];
      // (an athlete's shoulders take no bonus exercise: their final sets are what the training days hold - not a capped group)
      if (!flatSets && top[g] < planned[g] && noBonusFor(g)) planned[g] = top[g];
      if (!flatSets && top[g] < planned[g] && g !== 'calves') capped.push({ group: g, planned: planned[g], held: top[g] });
    }
    if (backG && trained.includes(backG)) capOfGroup[backG] = Math.max(top[backG], planned[backG]);
    // (G-217: a bonus no week needs is never opened; a training day's bonus that a later exercise block needs waits there, at 0 sets)
    const mainBonusOut = [];
    if (whenOpen) {
      for (const e of gb.slice()) if (gbOpen.get(e.key) === Infinity) dropBonus(e);
      for (const e of gb) if (e.kind === 'main') {
        const wk = gbWeek.has(e.key) ? gbWeek.get(e.key) : null;
        mainBonusOut.push({ group: e.g, slot_id: e.slot.slot_id, exercise_block: gbOpen.get(e.key), ...(wk !== null ? { week: wks[wk].n } : {}) });
        // (v0.7 G-238: a bonus that comes in after its exercise block's first week waits for its week, at 0 sets)
        if (wk !== null && wk > 0 && wk > [...Array(N).keys()].find(i => ebOfI(i) === gbOpen.get(e.key))) dormantWk.set(e.slot.slot_id, wk);
        else if (gbOpen.get(e.key) > ebList[0]) dormant.set(e.slot.slot_id, gbOpen.get(e.key));
      }
    } else if (gb) for (const e of gb) if (e.kind === 'main') mainBonusOut.push({ group: e.g, slot_id: e.slot.slot_id, exercise_block: ebList[0] });
    // (the scratch bonus slots close again; each one opens for real at the exercise block that first needs it)
    for (const [g, slot] of scratchBonus) {
      const di = days.findIndex(d => d.added.includes(slot));
      days[di].added = days[di].added.filter(s => s !== slot);
      added.splice(added.indexOf(slot), 1);
      delS(slot.slot_id); delF(slot.slot_id); delete owner[slot.slot_id]; ownerVer++;
      bonusOpen.delete(g);   // (the key: the group, or 'group#2' for a second bonus exercise)
    }
    restore(sn0);
    for (const sl of mainBonus) if (sl && !isNum(sets[sl.slot_id])) setS(sl.slot_id, EXS.sets[0]);
    for (const id of dormant.keys()) setS(id, 0);
    for (const id of dormantWk.keys()) setS(id, 0);
    for (const id of droppedIds) delS(id);
    // (engine 0.6.0 integration: a group the template caps - with COACH-CH5 CH5-02 the arms of every athletic day are trained groups -
    // arrives at what its slots hold in the last week, one week early at most, like every group (R4-PRG-01): a step the stagger gave
    // it earlier waits; its helper credit may still run ahead of the schedule, never under it)
    if (PX3.reach_planned && !flatSets) {
      const earlyMax = isNum(PG.arrival_weeks_early_max) ? PG.arrival_weeks_early_max : 1;
      for (const g of trained) {
        const sc = sched[g];
        if (!Array.isArray(sc) || !(top[g] < planned[g]) || !(top[g] > S0[g]) || sc.length < 3) continue;
        const last = sc.length - 1 - earlyMax;
        for (let i = 0; i < last; i++) if (sc[i] >= top[g]) sc[i] = Math.max(S0[g], top[g] - 1, i ? sc[i - 1] : S0[g]) >= top[g] ? sc[i] : Math.max(S0[g], top[g] - 1, i ? sc[i - 1] : S0[g]);
      }
    }
    schedule = sched;
    schedule0 = Object.fromEntries(Object.entries(sched).map(([g, a]) => [g, a.slice()]));
    // calves follow their own rule - 3 sets on every leg day that holds a calf exercise, 2-3 on an optional day (VOL-17) - not the
    // level's stairway numbers: the planned top the plan reports for them is what that rule gives
    const plannedOut = { ...planned };
    if (trained.includes('calves')) plannedOut.calves = top.calves;
    if (flatSets) for (const g of trained) plannedOut[g] = top[g];
    blockInfo = { carrier, trained, creditOnly, planned_start: start, planned_top: plannedOut, start: S0, top, lambda, noted, capped, bonus_for: bonusFor, bonus_open: Object.fromEntries(gbOpen), bonus_week: Object.fromEntries(gbWeek), main_bonus: mainBonusOut, struct, rates, focus_closed: focusClosed.slice(),
      lowered_start: lowered.slice(), balanced: balanced.start !== undefined || balanced.top !== undefined ? { group: backG, ...balanced, ratio: ppRatio ? ppRatio.want : null } : null };
  };

  // ---- flat blocks: scaled copies of the last stairway week (pre-season, taper, recovery)
  const preScale = (base, factor, ws) => {
    // R2-PER-06 / D-37: about 60 % of the last off-season week; the work and paired lifts keep 2 sets; Focus by the profile's
    // pre_season.focus factor; Olympic x the profile's TE factor
    const pre = (profile && profile.pre_season) || {};
    const focusF = isNum(pre.focus) ? pre.focus : 1;
    const te = isNum(pre.TE) ? pre.TE : 1;
    for (const [s, di] of allSlots()) {
      const init = fixedSets(s, ws, di);
      if (init === null) { setS(s.slot_id, null); continue; }
      if (init === 0) { setS(s.slot_id, 0); continue; }
      const b = base && isNum(base[s.slot_id]) && base[s.slot_id] > 0 ? base[s.slot_id] : init;
      if (s.bucket === 'AP_TRIPLE_EXT') { setS(s.slot_id, Math.max(2, roundHalfUp(b * te))); continue; }
      if (!isResistance(s) || isCircuitSlot(s)) { setS(s.slot_id, kindOf(s) === 'core' ? init : b); continue; }
      // (fix round 2, sample 03 minor 'the pre-season optional day prescribes a single set of calf raises': an optional-day exercise
      // that would run under rules.placement.x2.pre_season_optional_min_sets leaves the day instead)
      const optMin = !isMainDi(di) && isNum(PX2.pre_season_optional_min_sets) ? PX2.pre_season_optional_min_sets : 0;
      if (kindOf(s) === 'focus' || s.origin === 'bonus') { const v = focusF <= 0 ? 0 : Math.max(1, roundHalfUp(b * factor * focusF)); setS(s.slot_id, v < optMin ? 0 : v); continue; }
      // (v0.6 G-116, 03 minor of fix round 2 'never print an exercise at 1 set': a training day's lift keeps rules.placement.min_sets)
      const keep = ['work', 'paired_upper'].includes(s.role) || (PX3.pre_season_main_min && isMainDi(di)) ? 2 : 1;
      const v2 = Math.max(keep, roundHalfUp(factor * b));
      setS(s.slot_id, v2 < optMin ? 0 : v2);
    }
  };
  const scaleFrom = (base, factor, mode, ws) => {
    for (const [s, di] of allSlots()) {
      const init = fixedSets(s, ws, di);
      if (init === null) { setS(s.slot_id, null); continue; }
      if (init === 0) { setS(s.slot_id, 0); continue; }
      const k = kindOf(s);
      if (s.bucket === 'COND_SPRINT_BUYOUT' && (tb.type === 'taper' || tb.type === 'recovery')) { setS(s.slot_id, 0); continue; }
      const b = base && isNum(base[s.slot_id]) && base[s.slot_id] > 0 ? base[s.slot_id] : init;
      if (isResistance(s) && !isCircuitSlot(s)) setS(s.slot_id, mode === 'ceil' ? Math.max(R.recovery.min_sets_per_exercise, Math.ceil(factor * b - EPS)) : Math.max(1, roundHalfUp(factor * b)));
      else if ((k === 'athletic' || k === 'power' || isCircuitSlot(s)) && (tb.type === 'taper' || tb.type === 'recovery')) {
        const af = tb.type === 'recovery' ? (k === 'power' ? R.recovery.olympic.sets_factor : R.recovery.athletic_factor) : factor;
        setS(s.slot_id, Math.max(1, Math.ceil(af * b - EPS)));
      } else setS(s.slot_id, k === 'core' ? init : b);
    }
  };

  // ---- estimate (information only)
  const testExtra = new Map();
  for (const ws of wks) if (ws.test) testExtra.set(ws.n, testPlan(layout, ws, derived, model));
  const estimate = (di, ws, withTests) => {
    if (typeof ctx.estimateMinutes !== 'function') return null;
    const d = days[di];
    const blocks = (d.blocks || []).concat(d.added.length ? [{ kind: 'accessories', movable: false, circuit: null, slots: d.added }] : []);
    let t = ctx.estimateMinutes({ ...d, blocks }, sets, fills, model, { week: ws, derived, supersets: !!d.supersets_on });
    const tp = withTests ? testExtra.get(ws.n) : null;
    if (tp) {
      t += tp.byDay[d.weekday] || 0;
      for (const s of d.slots) if (tp.bySlot[s.slot_id] && active(s)) t += tp.bySlot[s.slot_id];
    }
    return t;
  };

  // ---- the block's weeks
  for (const ws of wks) {
    const changes = [], whys = [], notes = [];
    const sel = selFor(ws.exercise_block);
    const placed = [];
    boundWeek = ws;
    if (ws.is_training_block_start) {
      setFills(sel);
      refreshOwners();
      for (const [s, di] of allSlots()) setS(s.slot_id, fixedSets(s, ws, di));
      if (stair) {
        whys.push(why('why.sets_default', 'VOL-16'));
        if (!circuitPlan) {
          planStairs(ws);
          whys.push(why('why.stairway_target', 'CX-01'));
          if (blockInfo.capped.length) whys.push(why('why.capped_by_template', 'R4-SES-04'));
        }
        if (prio.length) whys.push(why('why.focus_add', 'R3-SES-01', { n: D9.focus_add || 0 }));
        if (D9.two_day) whys.push(why('why.two_day_rule', 'R4-SES-03'));
      } else if (tb.type === 'pre_season') {
        const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : V.phase_factors.pre_season.factor;
        let base = cross.lastStair ? cross.lastStair.sets : null;
        if (!base && !circuitPlan) { allocate(groupTargetsOf(D9), null); base = { ...sets }; }
        preScale(base, f, ws);
        whys.push(why('why.pre_season', 'R2-PER-06'));
      } else if (tb.type === 'taper') {
        const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : V.phase_factors.taper.factor;
        scaleFrom(cross.lastBlock ? cross.lastBlock.sets : null, f, 'half_up', ws);
        whys.push(why('why.taper', 'R2-PER-06'));
      } else if (tb.type === 'recovery') {
        scaleFrom(cross.lastStair ? cross.lastStair.sets : null, R.recovery.sets_factor, 'ceil', ws);
      } else if (tb.type === 'in_season') {
        const t = targetsFor(derived, model, { modifier_id: (tb.factor && tb.factor.modifier) || V.phase_factors.in_season.modifier, floor: false, maintenance: false, cycles: 0, legDays: legDaysOfLayout(layout) });
        flatTargets = groupTargetsOf(t);
        if (!circuitPlan) allocate(flatTargets, null);
        whys.push(why('why.in_season', 'R2-ATH-07'));
        if (!circuitPlan && eveOfGame(flatTargets)) whys.push(why('why.eve_of_game', 'R2-ATH-07'));
      } else if (tb.type === 'maintenance') {
        let t;
        if (derived.D5_plan_shape.mode === 'maintenance_4_6' || !cross.lastStair) {
          t = groupTargetsOf(derived.D5_plan_shape.mode === 'maintenance_4_6' ? D9 : targetsFor(derived, model, { maintenance: true, maintFactor: tb.factor && tb.factor.factor }));
        } else {
          const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : maintFactorOf(derived, model);
          const last4 = cross.lastStair.weekly.slice(-4);
          t = {};
          for (const g of GROUPS) { const m = last4.reduce((a, w) => a + (w[g] || 0), 0) / last4.length; if (m > 0 && slotsOfGroup(g).length) t[g] = roundHalfUp(f * m); }
        }
        flatTargets = t;
        if (!circuitPlan) allocate(t, null);
        if (tb.factor && isNum(tb.factor.factor)) whys.push(why('why.maintenance', 'PER-01', { pct: roundHalfUp(tb.factor.factor * 100) }));
      }
    } else {
      if (ws.is_exercise_block_start) {
        setFills(sel);
        refillAdded(ws.n);
        refreshOwners();
        changes.push({ key: 'changes.new_exercise_block', args: {} });
        // a station whose new exercise block has no pick leaves; one that has a pick again comes back at its fewest sets
        for (const [s, di] of allSlots()) {
          if (dormant.has(s.slot_id) || dormantWk.has(s.slot_id)) { setS(s.slot_id, 0); continue; }   // (G-217 / G-238: a bonus waits for the exercise block / week that needs it)
          const init = fixedSets(s, ws, di);
          if (init === null || init === 0) { if (init === 0 || !isNum(sets[s.slot_id])) setS(s.slot_id, init); continue; }
          if (!isNum(sets[s.slot_id]) || sets[s.slot_id] <= 0) setS(s.slot_id, init);
        }
      }
      // circuits follow the week's rounds, Olympic sets the week's budget
      for (const [s, di] of allSlots()) {
        if (isCircuitSlot(s) && ws.circuit && isNum(sets[s.slot_id])) setS(s.slot_id, hasPick(s) || s.bucket === 'COND_CIRCUIT' ? ws.circuit.rounds : 0);
        if (s.bucket === 'AP_TRIPLE_EXT' && active(s) && stair) { const per = olySets(s, ws); if (isNum(per)) setS(s.slot_id, per); }
        if (s.bucket === 'COND_SPRINT_BUYOUT' && active(s) && buyoutBouts(s, ws) !== null) setS(s.slot_id, buyoutBouts(s, ws));
        void di;
      }
    }
    if (ws.plyo_stage && cross.prevStage && ws.plyo_stage !== cross.prevStage && !ws.is_training_block_start) changes.push({ key: 'changes.stage_up', args: { stage: ws.plyo_stage } });
    if (ws.circuit && cross.prevCircuit && ws.circuit.work_s > cross.prevCircuit.work_s && !ws.is_training_block_start) changes.push({ key: 'changes.circuit_longer', args: { work_s: ws.circuit.work_s } });

    // ---- the stairway week: every trained group to this week's whole-set target
    const idx = stair ? ws.stair_week - 1 : null;
    const targets = {};
    if (stair && schedule) {
      whys.push(why('why.planned_only', 'R3-VOL-04'));
      // (a group below its final sets never asks for fewer sets than it held last week: the next exercise block's exercises may
      // give it less helper credit than the first block's did)
      const heldLast = idx > 0 && weeksOut.length ? weeksOut[weeksOut.length - 1].weekly_sets_by_group : null;
      for (const g of blockInfo.trained) {
        const kept = heldLast ? Math.min(blockInfo.top[g], Math.floor((heldLast[g] || 0) + EPS)) : 0;
        targets[g] = Math.max(schedule[g][idx], kept);
      }
      // the bonus exercise opens with the exercise block that first needs it (exercises stay fixed inside an exercise block, PER-02)
      // v0.6 G-217 (rules.placement.x3.bonus_last.open_when_needed): each bonus opens with the exercise block planStairs found needs it
      if (BL && BL.open_when_needed && Object.keys(blockInfo.bonus_open || {}).length && (ws.is_training_block_start || ws.is_exercise_block_start)) {
        for (const key of blockInfo.bonus_for) {
          if (bonusOpen.has(key) || blockInfo.bonus_open[key] !== ws.exercise_block) continue;
          // (v0.7 G-238: a bonus that comes in after this week waits for its week, at 0 sets)
          const wk = blockInfo.bonus_week && isNum(blockInfo.bonus_week[key]) ? blockInfo.bonus_week[key] : null;
          const later = wk !== null && wk > idx;
          const sl = openBonus(key.split('#')[0], ws.n, ws.is_training_block_start || later ? null : placed, false, key, !!PX3.reach_planned);
          if (sl && later) { setS(sl.slot_id, 0); dormantWk.set(sl.slot_id, wk); }
        }
        for (const [id, eb] of [...dormant]) {
          if (eb !== ws.exercise_block) continue;
          dormant.delete(id);
          const hit = allSlots().find(([s2]) => s2.slot_id === id);
          if (!hit || !hasPick(hit[0])) continue;
          setS(id, boundsOf(hit[0], hit[1])[0]);
          if (!ws.is_training_block_start) placed.push({ key: 'changes.bonus_added', args: { exercise: fills[id].exercise_id, day: days[hit[1]].weekday, slot_id: id } });
        }
      } else if ((ws.is_training_block_start || ws.is_exercise_block_start) && blockInfo.bonus_for.length) {
        const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
        const lastN = eb ? Math.min(eb.weeks[eb.weeks.length - 1], wks[wks.length - 1].n) : ws.n;
        // v0.5 fix round 1 (samples 01 / 03 / 04: a bonus exercise that opened with a later exercise block added 2 sets in one week -
        // '+17 % in week 9 from a new bonus raise'): the bonus exercise a group needs is part of the block from its first week, so
        // the main-day lifts start lower and the group climbs a set at a time (rules.placement.x1.bonus_from_block_start)
        const endIdx = PX.bonus_from_block_start ? N - 1 : Math.min(N - 1, idx + (lastN - ws.n));
        const endT = {}; for (const g of blockInfo.trained) endT[g] = schedule[g][endIdx];
        // (COACH-CH5 CH5-03: a group's second or third bonus exercise opens with the exercise block whose own last week needs it - not
        // from the block's first week - so the first weeks keep their sets on the training days' lifts)
        const endIdxLate = Math.min(N - 1, idx + (lastN - ws.n));
        const endTL = {}; for (const g of blockInfo.trained) endTL[g] = schedule[g][endIdxLate];
        for (const key of blockInfo.bonus_for) {
          if (bonusOpen.has(key)) continue;
          const g = key.split('#')[0];
          const tgt = key.includes('#') ? endTL : endT;
          const reach = reachable(tgt);
          if ((reach[g] || 0) < tgt[g] - EPS) openBonus(g, ws.n, ws.is_training_block_start ? null : placed, false, key, !!PX3.reach_planned);
        }
      }
      // v0.7 G-238 (rules.placement.x7.bonus_open_week): a bonus that waited inside its exercise block comes in this week at its fewest sets
      for (const [id, wk] of [...dormantWk]) {
        if (wk !== idx) continue;
        dormantWk.delete(id);
        const hit = allSlots().find(([s2]) => s2.slot_id === id);
        if (!hit || !hasPick(hit[0])) continue;
        setS(id, boundsOf(hit[0], hit[1])[0]);
        if (!ws.is_training_block_start) placed.push({ key: 'changes.bonus_added', args: { exercise: fills[id].exercise_id, day: days[hit[1]].weekday, slot_id: id } });
      }
      // (the steps of this week: a Focus muscle's exercises first, never on a lift this week tests)
      stepWeek = ws.is_training_block_start ? null : ws;
      // (v0.7 G-291: the sets the block's first week holds - a lead lift above them has taken its first step of the block)
      if (stepWeek && !leadBase) leadBase = { ...sets };
      // (v0.6 G-108: the first week's own bounds hold for its allocation too - planStairs leaves them unset)
      if (PX3.start_max_sets && ws.is_training_block_start) boundWeek = ws;
      testedSlots = stepWeek && ws.test ? new Set(strengthTestSlots(layout, ws, derived, model, fills)) : new Set();
      prevWeekSets = stepWeek ? { ...sets } : null;
      allocate(targets, ws.is_training_block_start ? null : placed);
      // (engine 0.6.0 integration: a group whose helper credit fell at an exercise-block change - a bonus press that became a fly for
      // COACH-CH5 CH5-03's chest - takes a whole set of its own so its weekly sets never drop, H21; inside its planned final sets)
      if (PX3.reach_planned && !ws.is_training_block_start && ws.is_exercise_block_start) {
        const heldPrev = weeksOut.length ? weeksOut[weeksOut.length - 1].weekly_sets_by_group : null;
        if (heldPrev) for (const g of blockInfo.trained) {
          if (!isNum(heldPrev[g]) || credited(g) >= heldPrev[g] - EPS || credited(g) + 1 > Math.max(blockInfo.top[g], heldPrev[g]) + 1 + EPS) continue;
          const c = addSet(g);
          if (c) placed.push({ key: 'changes.set_added', args: { exercise: fills[c.s.slot_id].exercise_id, day: days[c.di].weekday, slot_id: c.s.slot_id } });
        }
      }
      stepWeek = null; testedSlots = new Set();
      // v0.6 G-109 (review 04 M2: 'a fly went 2 -> 4 and the plan printed +1'): one change line per exercise, with the real difference
      if (prevWeekSets && PX3.one_step_per_exercise) {
        const merged = [], at = new Map();
        for (const c of placed) {
          if (c.key !== 'changes.set_added' || !c.args || !c.args.slot_id) { merged.push(c); continue; }
          if (at.has(c.args.slot_id)) continue;
          const id = c.args.slot_id, from = prevWeekSets[id], to = sets[id];
          const n = isNum(from) && isNum(to) ? to - from : 1;
          if (n <= 0) continue;
          // (engine 0.6 integration, G-190: the planned sets before and after ride along, so the line's {from} / {to} are always filled)
          const e = n > 1 ? { key: 'changes.sets_added_n', args: { ...c.args, n, from, to } } : c;
          at.set(id, e); merged.push(e);
        }
        placed.splice(0, placed.length, ...merged);
      }
      prevWeekSets = null;
      if (placed.length) whys.push(why('why.set_added', 'VOL-07'));
    }
    for (const c of placed) changes.push(c);
    if (stair && ws.stair_week >= 2 && !changes.some(c => c.key === 'changes.set_added' || c.key === 'changes.sets_added_n' || c.key === 'changes.bonus_added')) {
      // a week that keeps its sets progresses by reps or load (CX-02 / CX-03; the rule is the person's, R4-PRG-03)
      changes.push({ key: 'changes.load_up', args: {} });
      whys.push(why('why.sets_hold', 'CX-02'));
    }

    // ---- record the week
    const wMus = tally(false, 'muscle');
    const total = totalRes();
    const weekly_sets_by_muscle = {}, direct_sets_by_muscle = {};
    const dMus = directRaw();
    for (const m of R.muscles.order) { weekly_sets_by_muscle[m] = round2(wMus[m] || 0); direct_sets_by_muscle[m] = dMus[m] || 0; }
    const lineAll = tally(false, 'line'), lineMain = tally(true, 'line'), grpAll = tally(false, 'group'), grpMain = tally(true, 'group');
    const weekly_sets_by_line = {}, main_sets_by_line = {}, weekly_sets_by_group = {}, main_sets_by_group = {};
    for (const l of X.order) { weekly_sets_by_line[l] = round2(lineAll[l] || 0); main_sets_by_line[l] = round2(lineMain[l] || 0); }
    for (const g of X.groups) { weekly_sets_by_group[g] = round2(grpAll[g] || 0); main_sets_by_group[g] = round2(grpMain[g] || 0); }
    // v0.5 fix round 1 (the random corpus: a year plan's cut quarter - a block that holds its sets - took a set in week 9, when an
    // isolation exercise may hold its 4th, and 'arrived' three weeks early): what the first week of such a block does not hold is
    // not added later - the block's number is what its first week keeps
    if (stair && flatSets && schedule && idx === 0) {
      for (const g of blockInfo.trained) {
        const held = Math.floor((weekly_sets_by_group[g] || 0) + EPS);
        if (held < schedule[g][0]) { schedule[g].fill(held); blockInfo.top[g] = Math.min(blockInfo.top[g], held); }
      }
    }
    const target_by_group = {}, target_by_muscle = {}, step_by_muscle = {};
    for (const g of X.groups) {
      let t = stair && schedule ? (blockInfo.trained.includes(g) ? schedule[g][idx] : null) : (flatTargets && isNum(flatTargets[g]) ? flatTargets[g] : null);
      // a flat block (maintenance, in-season): a group the template's exercises cannot hold at its sets keeps what they hold, and
      // the plan says so (R4-SES-04) - the target the plan prints is always one the week keeps
      if (!stair && isNum(t) && !circuitPlan && (weekly_sets_by_group[g] || 0) < t - EPS) {
        const held = Math.floor((weekly_sets_by_group[g] || 0) + EPS);
        const c = flatCapped.get(g);
        flatCapped.set(g, { group: g, planned: c ? Math.max(c.planned, t) : t, held: c ? Math.min(c.held, held) : held });
        t = held;
      }
      target_by_group[g] = isNum(t) ? t : null;
    }
    for (const l of X.order) {
      if (!(l in D9.start)) continue;
      const g = X.groupOfLine[l];
      const isCarrier = stair && blockInfo ? blockInfo.carrier[g] === l : carrierOf(g, D9) === l;
      target_by_muscle[l] = isCarrier && isNum(target_by_group[g]) ? target_by_group[g] : null;
      if (isNum(D9.start[l])) {
        const sc = stair && schedule && isCarrier ? schedule[g] : null;
        step_by_muscle[l] = sc && idx > 0 && sc[idx - 1] > 0 ? round4((sc[idx] - sc[idx - 1]) / sc[idx - 1]) : 0;
      }
    }
    const sets_by_slot = {};
    const est_minutes = {}, supersets_on = {}, test_minutes = {};
    days.forEach((d, di) => {
      for (const s of daySlotsOf(di)) sets_by_slot[s.slot_id] = isNum(sets[s.slot_id]) ? sets[s.slot_id] : null;
      supersets_on[d.weekday] = !!d.supersets_on && tb.type !== 'taper' && tb.type !== 'recovery';
      const withT = estimate(di, ws, true), plain = estimate(di, ws, false);
      if (withT !== null) {
        est_minutes[d.weekday] = roundHalfUp(withT);
        if (roundHalfUp(withT) > roundHalfUp(plain)) test_minutes[d.weekday] = roundHalfUp(withT) - roundHalfUp(plain);
      }
    });
    const rise = cross.prevTotal !== null && cross.prevTotal > 0 ? round4((total - cross.prevTotal) / cross.prevTotal) : null;
    // the acceleration note (R4-PRG-02): a week that adds more than about 15 % - a group by 2 or more whole sets, or the week's total
    const acceleration = [];
    const prevW = weeksOut.length ? weeksOut[weeksOut.length - 1] : null;
    if (stair && ws.stair_week >= 2 && prevW) {
      for (const g of X.groups) {
        const from = prevW.weekly_sets_by_group[g] || 0, to = weekly_sets_by_group[g] || 0;
        if (from > 0 && to - from >= PG.note_min_whole_sets - EPS && (to - from) / from > PG.note_above + EPS) acceleration.push({ group: g, from, to, pct: roundHalfUp(100 * (to - from) / from) });
      }
      if (isNum(rise) && rise > PG.note_above + EPS) acceleration.push({ total: true, from: cross.prevTotal, to: total, pct: roundHalfUp(100 * rise) });
    }
    // (fix round 2: a circuit's extra round raises every group at once - one line up front names the week, not one per group)
    const oneLine = circuitPlan && acceleration.some(a => a.total);
    for (const a of acceleration) {
      if (a.total || !oneLine) warnings.push(a.total ? { code: 'acceleration', key: 'warning.acceleration_total', args: { week: ws.n, pct: a.pct } } : { code: 'acceleration', key: 'warning.acceleration', args: { week: ws.n, pct: a.pct, group: a.group } });
      notes.push(a);
    }
    weeksOut.push({
      n: ws.n, sets_by_slot, added_slots: added.map(s => ({ ...s, why: s.why.slice() })),
      added_fills: Object.fromEntries(added.filter(s => fills[s.slot_id] && fills[s.slot_id].exercise_id).map(s => [s.slot_id, fills[s.slot_id]])),
      supersets_on, target_by_muscle, target_by_group,
      weekly_sets_by_muscle, direct_sets_by_muscle, main_sets_by_muscle: main_sets_by_line, weekly_sets_by_line, main_sets_by_line, weekly_sets_by_group, main_sets_by_group,
      step_by_muscle, total_resistance_sets: total, total_main_sets: totalRes(true), rise_vs_prev: rise,
      est_minutes, test_minutes, changes, shortfalls: [], why: whys, acceleration: notes,
      credit_only_groups: stair && blockInfo ? blockInfo.creditOnly.slice() : []
    });
    cross.prevTotal = total;
    cross.prevCircuit = ws.circuit;
    cross.prevStage = ws.plyo_stage;
    if (stair) {
      if (ws.is_training_block_start) cross.lastStair = { sets: {}, weekly: [] };
      cross.lastStair.sets = { ...sets };
      cross.lastStair.weekly.push({ ...grpAll });
    }
  }
  cross.lastBlock = { sets: { ...sets }, type: tb.type };

  // ---- what the block says about itself (the plan prints it; nothing here is a failure)
  let found = null;
  if (stair && blockInfo && schedule0 && !flatSets) {
    // (fix round 2: where the weeks left the planned schedule by a whole set or more - the first week above its start, the last
    // week under its final sets, or the final sets held two or more weeks before the end)
    const bw0 = weeksOut.slice(weeksOut.length - wks.length);
    const st0 = {}, tp0 = {};
    for (const g of blockInfo.trained) {
      const sc = schedule0[g], r = bw0.map(w => w.weekly_sets_by_group[g] || 0);
      if (!sc || !sc.length || !r.length) continue;
      const first = Math.floor(r[0] + EPS), last = Math.floor(r[r.length - 1] + EPS);
      if (first > sc[0]) st0[g] = first;
      if (last < sc[sc.length - 1] && g !== 'calves') tp0[g] = Math.max(first, last);
    }
    // (v0.6 G-207: a 2-day group whose optional-day bonus took it above its limit in a week is carried by the training days alone)
    const tdt = {};
    for (const g of Object.keys(twoDayLim)) if ((blockInfo.bonus_for || []).some(k => k.split('#')[0] === g) && bw0.some(w => (w.weekly_sets_by_group[g] || 0) > twoDayLim[g] + EPS) && isNum(blockInfo.top[g])) tdt[g] = blockInfo.top[g] - 1;
    if (Object.keys(st0).length || Object.keys(tp0).length || Object.keys(tdt).length) found = { start: st0, top: tp0, two_day_top: tdt };
  }
  if (stair && blockInfo) {
    const bw = weeksOut.slice(weeksOut.length - wks.length);
    // what was really held: a later exercise block may change an exercise for one that gives a group less helper credit. A week
    // whose credited sets end under the schedule lowers the schedule to what that week holds (whole sets, never down), and the
    // plan says the template caps the group - the schedule the plan prints is always one the weeks keep
    let reconciled = false;
    for (const g of blockInfo.trained) {
      const sc = schedule[g];
      let lowered = false;
      for (let i = 0; i < sc.length; i++) {
        const r = bw[i] ? (bw[i].weekly_sets_by_group[g] || 0) : sc[i];
        if (r < sc[i] - EPS) { sc[i] = Math.max(0, Math.floor(r + EPS)); reconciled = true; lowered = true; }
      }
      // (v0.7 G-302, H21 / H22: a step this levelling takes back is a change to the schedule too - the weeks' targets are written again)
      for (let i = sc.length - 2; i >= 0; i--) if (sc[i] > sc[i + 1]) { sc[i] = sc[i + 1]; reconciled = true; }
      // a start or a top the weeks could not hold (a bonus exercise that opens with a later exercise block, an exercise that
      // changes): the schedule is fitted again between what the first and the last week hold, so it still arrives in the last
      // week (R4-PRG-01) - every week held at least the higher curve, so it holds this one
      if (lowered && sc[sc.length - 1] > sc[0] && !flatSets && blockInfo.rates && blockInfo.rates[g]) {
        const sp = stairOf(sc[0], sc[sc.length - 1], blockInfo.rates[g], model);
        if (sp) {
          const fitted = sp.sets.map((v, i) => Math.min(v, sc[i]));
          for (let i = fitted.length - 2; i >= 0; i--) fitted[i] = Math.min(fitted[i], fitted[i + 1]);
          if (fitted[0] === sc[0] && fitted[fitted.length - 1] === sc[sc.length - 1]) { sc.splice(0, sc.length, ...fitted); reconciled = true; }
        }
      }
      blockInfo.start[g] = sc[0];
      if (sc[sc.length - 1] < blockInfo.top[g]) {
        blockInfo.top[g] = sc[sc.length - 1];
        if (g !== 'calves' && !flatSets && blockInfo.top[g] < blockInfo.planned_top[g]) {
          const c = blockInfo.capped.find(x => x.group === g);
          if (c) c.held = blockInfo.top[g]; else blockInfo.capped.push({ group: g, planned: blockInfo.planned_top[g], held: blockInfo.top[g] });
        }
      }
    }
    if (reconciled) bw.forEach((w, i) => {
      for (const g of blockInfo.trained) {
        const sc = schedule[g];
        w.target_by_group[g] = sc[i];
        const l = blockInfo.carrier[g];
        if (l && l in w.target_by_muscle) { w.target_by_muscle[l] = sc[i]; if (l in w.step_by_muscle) w.step_by_muscle[l] = i > 0 && sc[i - 1] > 0 ? round4((sc[i] - sc[i - 1]) / sc[i - 1]) : 0; }
      }
    });
    // the arrival week (R4-PRG-01) is read on the planned whole-set schedule; the credited sets sit at or above it (a group that
    // also earns helper credit may run a fraction ahead - realized_arrival_week says when its credited sets first reach the top)
    const arrival = {}, realized_arrival = {}, realized_top = {};
    for (const g of blockInfo.trained) {
      const series = bw.map(w => w.weekly_sets_by_group[g] || 0);
      realized_top[g] = series[series.length - 1];
      const grows = blockInfo.top[g] > blockInfo.start[g];
      const hitS = schedule[g].findIndex(x => x >= blockInfo.top[g]);
      const hit = series.findIndex(x => x >= blockInfo.top[g] - EPS);
      arrival[g] = grows ? (hitS < 0 ? null : hitS + 1) : null;
      realized_arrival[g] = grows ? (hit < 0 ? null : hit + 1) : null;
    }
    // the floor a trained group is held to: 10 from 3 training days (R3-SES-01), 6 for a big group on 2 days (R4-SES-03); a group
    // the template's exercises cannot hold there is said (block_targets[].below_floor, warning.below_floor_template)
    const floorV = V.floor.value;
    const TD2 = D9.two_day && V.two_day ? V.two_day : null;
    const bigGroup = (g) => (X.linesOfGroup[g] || []).some(l => (TD2.big_classes || ['big']).includes((X.defs[l] || {}).class));
    const needOf = (g) => (g === 'calves' ? null : TD2 ? (bigGroup(g) ? TD2.weekly_sets[0] : null) : ((D9.floor_groups || []).includes(g) ? floorV : null));
    const below = blockInfo.trained.filter(g => needOf(g) !== null && bw.some(w => (w.weekly_sets_by_group[g] || 0) < needOf(g) - EPS));
    // v0.5 fix round 1 (R2-VOL-06; ORD-10 'optional days ... bonuses'; R4-SES-04 'say what the template does not hold'; sample 01
    // major): the floor is read on the training days. A group that holds it only with the optional day is said up front.
    const floorOnOptional = floorMain ? blockInfo.trained.filter(g => !below.includes(g) && isNum(floorMain[g]) && needOf(g) !== null && bw.some(w => (w.main_sets_by_group[g] || 0) < needOf(g) - EPS)) : [];
    // (sample 06 minor: four 'below the planned 25' lines opened a plan whose groups all sat inside the coach's ranges; CX-04) the
    // up-front notice is kept for a Focus group, a group held under its level's start, and a big group held well under its final
    // sets (rules.placement.x1.capped_notice); every capped group keeps its 'x of y' in the week-by-week table (block_targets[].capped)
    const CN = PX.capped_notice || null;
    const bigG = (g) => (X.linesOfGroup[g] || []).some(l => ((X.defs[l] || {}).class) === 'big');
    for (const c of blockInfo.capped) {
      const focusG = (X.linesOfGroup[c.group] || []).some(l => prio.includes(l));
      const pStart = blockInfo.planned_start[c.group];
      c.notice = !CN || !!PX3.capped_notice_all || (CN.focus && focusG) || (CN.below_start && isNum(pStart) && c.held < pStart) || (isNum(CN.big_below_share) && bigG(c.group) && c.held < CN.big_below_share * c.planned - EPS);
      // v0.6 G-107 (CX-04; H10 / H17 'said, never hidden'; review 07 M1: biceps capped at 22 of 25 with no notice and no shortfall):
      // every capped group is a shortfall of the block's last week, and its notice is printed once up front
      if (PX3.capped_shortfalls && bw.length) bw[bw.length - 1].shortfalls.push({ code: 'capped_by_template', key: 'warning.capped_by_template', args: { group: c.group, held: c.held, planned: c.planned } });
      if (below.includes(c.group) || !c.notice) continue;
      warnings.push({ code: 'capped_by_template', key: 'warning.capped_by_template', args: { group: c.group, held: c.held, planned: c.planned } });
    }
    for (const g of below) warnings.push({ code: 'below_floor_template', key: 'warning.below_floor_template', args: { group: g, held: round2(Math.min(...bw.map(w => w.weekly_sets_by_group[g] || 0))), floor: needOf(g) } });
    for (const g of floorOnOptional) warnings.push({ code: 'floor_needs_optional_day', key: 'warning.floor_needs_optional_day', args: { group: g, held: round2(Math.min(...bw.map(w => w.main_sets_by_group[g] || 0))), floor: needOf(g) } });
    // v0.6 G-202 (CH5-02 every athletic A / B day holds slot 5; reviews r5 01 / 02 M1, 03 m1: 'no exercise of its own' printed over a
    // curl and a Tate press): a group the stairway leaves to the helper credit is credit-only only while it has no direct set in the
    // block; a group with an exercise of its own (the arm slot) is said as held at its slot's sets, not stepped
    const directOfGroup = (w, g) => (R.muscles.groups.members[g] || [g]).reduce((a, m) => a + ((w.direct_sets_by_muscle || {})[m] || 0), 0);
    blockInfo.held = blockInfo.creditOnly.filter(g => bw.some(w => directOfGroup(w, g) > EPS));
    const noDirect = blockInfo.creditOnly.filter(g => !blockInfo.held.includes(g));
    if (noDirect.length) warnings.push({ code: 'credit_only_groups', key: 'warning.credit_only_groups', args: { group: noDirect } });
    if (blockInfo.held.length && PX3.held_groups_notice) warnings.push({ code: 'slot_held_groups', key: 'warning.slot_held_groups', args: { group: blockInfo.held.slice() } });
    // (the back's final sets lifted for the balance are its ceiling in this block - the level's own top number still bounds them)
    const capOut = { ...bt0.cap };
    // v0.6 (G-112 / G-113): a final-sets number a profile rule lowered is never under what the template's lifts credit the line at
    // their fewest sets (a group whose own exercises cannot give back helper credit, R4-SES-04): the ceiling reads at least the
    // line's credited sets (whole sets)
    for (const l of D9.x3_lowered || []) {
      if (!isNum(capOut[l])) continue;
      const most = Math.max(0, ...bw.map(w => (w.weekly_sets_by_line || {})[l] || 0));
      capOut[l] = Math.max(capOut[l], Math.ceil(most - EPS));
    }
    if (blockInfo.balanced && blockInfo.balanced.group && isNum(blockInfo.balanced.top)) { const l = blockInfo.carrier[blockInfo.balanced.group]; if (l && isNum(capOut[l])) capOut[l] = Math.max(capOut[l], blockInfo.balanced.top); }
    blockTargetsOut.push({
      training_block: tb.n, N, start: { ...bt0.start }, cap: capOut,
      groups: blockInfo.trained.slice(), credit_only_groups: blockInfo.creditOnly.slice(), held_groups: (blockInfo.held || []).slice(), carrier: { ...blockInfo.carrier },
      group_start: { ...blockInfo.start }, group_top: { ...blockInfo.top }, planned_start: { ...blockInfo.planned_start }, planned_top: { ...blockInfo.planned_top },
      schedule: Object.fromEntries(blockInfo.trained.map(g => [g, schedule[g].slice()])),
      lambda: Object.fromEntries(blockInfo.trained.map(g => [g, round4(blockInfo.lambda[g])])),
      arrival_week: arrival, realized_arrival_week: realized_arrival, realized_top, capped: blockInfo.capped.map(c => ({ ...c })), below_floor: below,
      floor_counted_on: floorMain ? 'main_days' : 'all_days', floor_on_optional: floorOnOptional.slice(),
      bonus: [...bonusOpen.entries()].map(([k, s]) => ({ group: k.split('#')[0], slot_id: s.slot_id })),
      main_bonus: (blockInfo.main_bonus || []).filter(x => allSlots().some(([s2]) => s2.slot_id === x.slot_id)).map(x => ({ ...x })),
      // v0.7 G-235 (R5-VOL-11): the lift that takes a one-set shortfall's extra set, and the exercise block it takes it in
      one_set_shortfall: [...extraTop.entries()].map(([id, x]) => ({ group: x.group, slot_id: id, exercise_block: x.eb, sets: x.add })),
      focus_closed: (blockInfo.focus_closed || []).map(c => ({ ...c })),
      lowered_start: (blockInfo.lowered_start || []).map(c => ({ ...c })), balanced: blockInfo.balanced ? { ...blockInfo.balanced } : null,
      push_pull: ppRatio ? { pull_per_push: ppRatio.want, hard: ppRatio.hard } : null,
      lowered: [], dropped_groups: []
    });
  } else if (!stair && flatCapped.size) {
    for (const c of flatCapped.values()) {
      if (c.held <= 0 || warnings.some(x => ['capped_by_template', 'below_floor_template'].includes(x.code) && x.args && x.args.group === c.group)) continue;
      warnings.push({ code: 'capped_by_template', key: 'warning.capped_by_template', args: { group: c.group, held: c.held, planned: c.planned } });
    }
  } else if (stair) {
    // a timed circuit: the stairway is in rounds and seconds (shape); the groups are reported, not driven
    const bw = weeksOut.slice(weeksOut.length - wks.length);
    const floorV = V.floor.value;
    const below = (D9.floor_groups || []).filter(g => g !== 'calves' && bw.some(w => (w.weekly_sets_by_group[g] || 0) > EPS) && bw.some(w => (w.weekly_sets_by_group[g] || 0) < floorV - EPS));
    // v0.7 G-234 (COACH-R5 R5-CLS-03 '3 rounds the first 4 weeks'; H17 'named in the plan, never hidden'): a group under the floor only
    // in the first third's rounds is said once, with the week its rounds take it to the floor - not as a template that holds less
    const RT0 = R.supersets && R.supersets.bootcamp && R.supersets.bootcamp.x7 && R.supersets.bootcamp.x7.rounds_by_third;
    const earlyOnly = (g) => !!RT0 && bw[bw.length - 1] && (bw[bw.length - 1].weekly_sets_by_group[g] || 0) >= floorV - EPS;
    const early = below.filter(earlyOnly);
    for (const g of below) if (!early.includes(g)) warnings.push({ code: 'below_floor_template', key: 'warning.below_floor_template', args: { group: g, held: round2(Math.min(...bw.map(w => w.weekly_sets_by_group[g] || 0))), floor: floorV } });
    if (early.length) {
      const iOk = bw.findIndex(w => early.every(g => (w.weekly_sets_by_group[g] || 0) >= floorV - EPS));
      const wk = iOk >= 0 ? wks[Math.min(iOk, wks.length - 1)] : null;
      const r0 = wks[0] && wks[0].circuit ? wks[0].circuit.rounds : null;
      if (wk && isNum(r0)) warnings.push({ code: 'circuit_rounds_floor', key: RT0.floor_key || 'warning.circuit_rounds_floor', args: { group: early.slice(), floor: floorV, rounds: r0, week: wk.n, last: wk.n - 1 } });
    }
    // v0.6 G-110 (CX-03 / R4-PRG-04 'never above the level's top'; H10 / H17 'said, never hidden'; review 05 M3: bootcamp shoulders at
    // 18 = their top in week 1 and 22.5 by week 7, unflagged): every station of a timed circuit runs the same rounds (OBSERVED BYOP
    // BOOTCAMP), so a group the extra round takes above its top number is named, with what to do about it
    // v0.7 G-234 (COACH-R5 R5-CLS-03 'and then people can adjust as they need to'): the rounds climb in thirds, and the plan says the
    // person adjusts them
    const RT = R.supersets && R.supersets.bootcamp && R.supersets.bootcamp.x7 && R.supersets.bootcamp.x7.rounds_by_third;
    const rw = wks.map(w => (w.circuit && isNum(w.circuit.rounds) ? w.circuit.rounds : null)).filter(isNum);
    if (RT && RT.warning_key && rw.length > 1 && rw[rw.length - 1] > rw[0]) warnings.push({ code: 'circuit_rounds_thirds', key: RT.warning_key, args: { from: rw[0], to: rw[rw.length - 1] } });
    const overTop = [];
    const CO = PX3.circuit_over_top;
    if (CO && CO.enabled) for (const g of GROUPS) {
      if (g === 'calves') continue;
      const l = carrierOf(g, bt0);
      const top = l && isNum(bt0.cap[l]) ? bt0.cap[l] : null;
      if (top === null) continue;
      const held = Math.max(0, ...bw.map(w => w.weekly_sets_by_group[g] || 0));
      if (held > top + (CO.margin || 0) + EPS) {
        overTop.push({ group: g, top, held: round2(held) });
        // v0.7 G-234 (R5-CLS-03): with the rounds in thirds there is no single 'extra round' - the line names the most rounds that keep
        // the group at its top (rules.supersets.bootcamp.x7.rounds_by_third.over_top_key)
        const atTop = RT && RT.over_top_key ? bw.map((w, i) => ({ w, r: wks[Math.min(i, wks.length - 1)] && wks[Math.min(i, wks.length - 1)].circuit ? wks[Math.min(i, wks.length - 1)].circuit.rounds : null }))
          .filter(x => isNum(x.r) && (x.w.weekly_sets_by_group[g] || 0) <= top + (CO.margin || 0) + EPS).map(x => x.r) : [];
        if (atTop.length) warnings.push({ code: 'circuit_over_top', key: RT.over_top_key, args: { group: g, held: round2(held), top, rounds: Math.max(...atTop) } });
        else warnings.push({ code: 'circuit_over_top', key: 'warning.circuit_over_top', args: { group: g, held: round2(held), top } });
      }
    }
    blockTargetsOut.push({ training_block: tb.n, N, start: { ...bt0.start }, cap: { ...bt0.cap }, groups: [], credit_only_groups: [], carrier: {}, group_start: {}, group_top: {}, planned_start: {}, planned_top: {},
      schedule: {}, lambda: {}, arrival_week: {}, realized_arrival_week: {}, realized_top: {}, capped: [], below_floor: below, bonus: [], lowered: [], dropped_groups: [], circuit: true, over_top: overTop });
  }
  return found;
}

function dedupeWarnings(list) {
  const seen = new Set();
  return list.filter(o => { const k = o.key + JSON.stringify(o.args || {}); if (seen.has(k)) return false; seen.add(k); return true; });
}
