// engine/volume.mjs - the 12_volume_algorithm_v1 v1.1 engine (engine/CONTRACTS.md §4.5): weekly targets (D9), the planned
// stairway (lambda), weekly set placement (VOL-07), the athletic budget and credit counting. Owner: B2.
// Pure: no I/O, no clock, no randomness. Every number comes from model.rules; literals are structural or marked INFERRED.
import { EngineError, WEEKDAYS, EPS, why, round2, roundHalfUp } from './util.mjs';
import { olympicSetsPerExposure } from './budget.mjs';

/** @typedef {import('./util.mjs').Why} Why */

const round4 = (x) => (x < 0 ? -1 : 1) * Math.floor(Math.abs(x) * 1e4 + 0.5 + EPS) / 1e4;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const ATHLETIC_KEYS = ['plyo_contacts', 'jump_contacts', 'low_contacts', 'throws', 'cod_cuts', 'sprint_m', 'olympic_sets'];
// athletic budget key -> 04 profile pre_season factor key (PLYO plyometric, BALL ballistic jumps, JLK low / ankle contacts,
// THROW, COD, SPRINT, TE Olympic / triple extension); INFERRED mapping of the 04 vocabulary
const PRE_KEY = { plyo_contacts: 'PLYO', jump_contacts: 'BALL', low_contacts: 'JLK', throws: 'THROW', cod_cuts: 'COD', sprint_m: 'SPRINT', olympic_sets: 'TE' };
const RESISTANCE_KINDS = ['resistance', 'isolation', 'focus'];
const ADDED_ORIGINS = ['bonus', 'focus_added'];
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

/**
 * Targets core (CONTRACTS §4.5 computeTargets, order of operations rules.volume.order_of_operations).
 * opts: {modifier_id, floor, maintenance, maintFactor, cycles, legDays, priority:false}
 */
function targetsFor(derived, model, opts = {}) {
  const R = model.rules, V = R.volume, defs = R.muscles.defs;
  const L = derived.D3_client_level.level;
  const mode = derived.D5_plan_shape.mode;
  const modifier_id = opts.modifier_id || selectModifier(derived, model);
  const mod = V.modifiers[modifier_id];
  const circuit = isCircuitPlan(derived, model);
  const maintenance = opts.maintenance !== undefined ? opts.maintenance : mode === 'maintenance_4_6';
  const applyFloor = opts.floor !== undefined ? opts.floor : (!maintenance && !(circuit && (V.floor.exempt || []).includes('format:circuit')));
  const prio = opts.priority === false ? [] : (derived.priority_muscles || []);
  const pain = painAreas(derived, model);
  const legDays = isNum(opts.legDays) ? opts.legDays : legDaysOf(derived, model);
  const sp = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
  const pc = derived.previous_cycles || { count: 0, last_had_holds_or_pain: false };
  const cycles = isNum(opts.cycles) ? opts.cycles : (pc.last_had_holds_or_pain ? 0 : pc.count);
  const floorV = V.floor.value;

  const start = {}, cap = {}, fill = {}, whyBy = {};
  const floored = [], credit_only = [], pain_muscles = [];
  const add = (m, w) => { (whyBy[m] = whyBy[m] || []).push(w); };
  // v1.2 (D-03 / D-07 narrowed, R2-VOL-06): credit-only muscles are listed per modifier; a sport profile that writes direct
  // weekly sets for an arm muscle (04 weekly_sets ISO_TRICEP / ISO_BICEP) makes it a target again
  const unless = mod.credit_only_unless_profile_sets || {};
  const creditOnlyList = (mod.credit_only || []).filter(m => !(unless[m] && sp && sp.direct_sets_wk && sp.direct_sets_wk[unless[m]] > 0));
  for (const m of R.muscles.order) {
    const def = defs[m];
    if (!def.target) { fill[m] = def.fill; continue; }
    const own = !!def.own_sets, calves = !!def.per_leg_day, isPri = prio.includes(m);
    const regionF = def.region === 'lower' ? mod.lower : mod.upper;
    const rawF = own ? 1 : (def.class === 'small' ? mod.small : regionF);
    const credit = !own && !calves && (rawF === 'credit' || creditOnlyList.includes(m) || (def.athlete_fill === 'credit' && mod.small === 'credit'));
    if (credit && !isPri) { fill[m] = 'credit'; start[m] = null; cap[m] = null; credit_only.push(m); continue; }
    // a credit-only muscle chosen as a priority takes the numeric region factor (INFERRED; 12 v1.1 §3.3 "unless it is a priority")
    const factor = isNum(rawF) ? rawF : (isNum(regionF) ? regionF : 1);
    fill[m] = own ? 'own_sets' : 'target';
    let s, c = null, base = null;
    if (calves) {
      s = V.calves.per_leg_day[L] * legDays;
      if (applyFloor && s < V.calves.weekly_floor) s = V.calves.weekly_floor;
      add(m, why('why.calves_leg_day', 'VOL-17'));
    } else {
      base = V.start[m][L];
      s = roundHalfUp(base * factor);
    }
    if (isPri) {
      s += V.priority.add[L];
      c = Math.min((V.priority.cap[m] || V.priority.cap.default)[L], V.priority.absolute_cap);
      add(m, why('why.priority_add', 'VOL-02'));
    }
    const painArea = pain[m];
    if (applyFloor && !own) {
      // floor_10 before pain_factor (order_of_operations): pain wins over the floor, so a pain muscle is not floor-protected
      if (s < floorV) { s = floorV; if (!painArea) add(m, why('why.floor_10', 'R2-VOL-06', { muscle: m })); }
      if (!painArea) floored.push(m);
    }
    if (painArea) {
      s = roundHalfUp(s * V.pain.start_factor);
      pain_muscles.push(m);
      add(m, why('why.pain_cut', 'VOL-03', { muscle: m, area: painArea }));
    }
    if (c === null) {
      if (calves) c = V.cap.calves[L];
      else if (own) { c = V.cap[m][L]; add(m, why('why.rear_delt_own', 'R2-VOL-04')); }
      else {
        const capT = V.cap[m][L];
        c = Math.max(roundHalfUp(capT * factor), s + roundHalfUp((capT - base) * factor)); // D-02
      }
      c = Math.min(c, V.priority.absolute_cap);
    }
    if (prio.length && !isPri) add(m, why('why.nonpriority_cap', 'R2-VOL-06'));
    start[m] = s; cap[m] = c;
  }
  // profile volume ratios (swimming pull >= 1.5 x push, D-09)
  for (const r of (sp && sp.volume_ratios) || []) {
    if (!isNum(start[r.muscle])) continue;
    for (const what of r.applies_to || ['start']) {
      const tbl = what === 'cap' ? cap : start;
      const plus = r.plus.reduce((a, x) => a + (tbl[x] || 0), 0);
      const over = r.over.reduce((a, x) => a + (tbl[x] || 0), 0);
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
      const capMax = prio.includes(m) ? C.cap_max_priority : C.cap_max_nonpriority;
      cap[m] = Math.max(cap[m], Math.min(cap[m] + cycles * C.cap_add, capMax));
    }
  }
  // v_taper priority: side delts + lats grow, chest is held at its start (rules.volume.priority.v_taper_hold, VOL-18)
  if (opts.priority !== false && (derived.priority_choices || []).includes('v_taper')) {
    for (const m of V.priority.v_taper_hold || []) if (isNum(start[m]) && !prio.includes(m)) { cap[m] = start[m]; add(m, why('why.at_cap', 'VOL-18', { muscle: m })); }
  }
  for (const m of Object.keys(start)) if (isNum(start[m])) cap[m] = Math.max(cap[m], start[m]);
  return {
    modifier_id, start, cap, fill,
    priority: R.muscles.order.filter(m => prio.includes(m)), pain_muscles, floored, credit_only,
    calves_per_leg_day: V.calves.per_leg_day[L], core_block: { exercises: V.core_block.exercises, sets: V.core_block.sets },
    why: whyBy
  };
}

/**
 * D9: whole weekly sets per target muscle at week 1 of the first stairway, caps and fill policy (CONTRACTS §4.5).
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
 * Planned T(w) per target muscle for one stairway block (12 v1.1 §3.7.1; D-11, D-18).
 * @param {import('./util.mjs').Targets} targets
 * @param {import('./util.mjs').TrainingBlock} trainingBlock
 * @param {import('./util.mjs').Derived} derived
 * @param {object} model
 * @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>}}
 */
export function stairwayPlan(targets, trainingBlock, derived, model) {
  return stairwayFrom(blockTargets(targets, trainingBlock, derived, model), trainingBlock, derived, model);
}

/** planned steps of one muscle before lambda (standard step, priority / older / pain caps, planned_step_max) */
function stepsOf(m, bt, N, derived, model) {
  const st = model.stair(N);
  const lim = model.rules.stairway.limits;
  const hasPri = bt.priority.length > 0;
  const older = derived.age >= model.rules.population.older.from_age;
  const freeze = model.rules.volume.pain.freeze_weeks;
  const sp = [];
  for (let w = 2; w <= N; w++) {
    let s = st.standard_steps[String(w)];
    if (hasPri && !bt.priority.includes(m)) s = Math.min(s, lim.nonpriority_while_priority);
    if (older) s = Math.min(s, lim.older_60plus); // R3-pending: R3-VOL-04 (60+ step cap PROPOSED)
    if (bt.pain_muscles.includes(m)) s = (w - 1 <= freeze) ? 0 : Math.min(s, lim.pain_after_freeze); // D-11
    sp.push(Math.min(s, lim.planned_step_max));
  }
  return sp;
}

/** growth factor of a muscle's planned stairway at lambda = 1 (v1.2 capacity sizing, D-67) */
export function plannedGrowth(m, bt, trainingBlock, derived, model) {
  return stepsOf(m, bt, trainingBlock.stair_N, derived, model).reduce((g, s) => g * (1 + s), 1);
}

/**
 * Planned T(w) from block targets that are already final (blockTargets applied, or the v1.2 capacity-sized targets).
 * @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>}}
 */
export function stairwayFrom(bt, trainingBlock, derived, model) {
  const N = trainingBlock.stair_N;
  if (!isNum(N)) throw new EngineError('volume.not_stairway', `training block ${trainingBlock.n} is not a stairway`);
  const LAM = model.rules.stairway.lambda;
  const lambda = {}, steps = {}, T = {};
  for (const m of model.rules.muscles.order) {
    if (!(m in bt.start) || !isNum(bt.start[m])) continue;
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
  return model.credits(ex, (fill && fill.bucket) || slot.bucket);
}
function primeOf(model, slot, fill) {
  const cr = creditsOf(model, slot, fill);
  if (!cr) return [];
  const ex = exOf(model, fill);
  const out = Object.keys(cr).filter(m => cr[m] === 1);
  if (ex && ex.credit_class === 'DIPS' && cr.triceps) out.push('triceps'); // LIB-16: placement treats triceps as prime
  return out;
}

/**
 * Weekly credited sets (coach count) from a set map (exported for validate / tests).
 * @param {import('./util.mjs').WeekLayout} layout
 * @param {Object<string,number|null>} setsBySlot
 * @param {Object<string,import('./util.mjs').SlotFill>} fillsBySlot
 * @param {object} model
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

/**
 * Athletic budget per week (CONTRACTS §4.5 athleticBudget; R2-ATH-01/03/07, R3-ATH-05). Never muscle sets (VOL-10).
 * @param {import('./util.mjs').Derived} derived
 * @param {import('./util.mjs').Shape} shape
 * @param {object} model
 * @returns {import('./util.mjs').AthleticBudget[]}
 */
export function athleticBudget(derived, shape, model) {
  const R = model.rules, A = R.athletic;
  const D11 = derived.D11_athletic_budget;
  const sp = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
  const enabled = !!D11.enabled && D11.older_mode !== 'default';
  const weekly = D11.weekly || {};
  const out = [];
  for (const ws of shape.weeks) {
    const tb = shape.training_blocks.find(b => b.n === ws.training_block);
    const st = ws.stair_week !== null && tb.stair_N ? tb.stair_N : null;
    const frac = st ? (st > 1 ? (ws.stair_week - 1) / (st - 1) : 1) : null;
    const baseOf = (k) => {
      const r = weekly[k];
      if (!Array.isArray(r)) return null;
      if (frac !== null) return r[0] + (r[1] - r[0]) * frac;
      if (tb.type === 'maintenance') return r[0];
      return r[1];
    };
    const f = {};
    let factor = 1;
    for (const k of ATHLETIC_KEYS) f[k] = 1;
    if (tb.type === 'pre_season' || tb.type === 'taper') {
      const pre = (sp && sp.pre_season) || {};
      for (const k of ATHLETIC_KEYS) f[k] = isNum(pre[PRE_KEY[k]]) ? pre[PRE_KEY[k]] : 1;
      factor = isNum(pre.PLYO) ? pre.PLYO : 1;
      if (tb.type === 'taper') {
        const t = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : R.volume.phase_factors.taper.factor;
        for (const k of ATHLETIC_KEYS) f[k] *= t;
        factor = t;
      }
    } else if (tb.type === 'recovery') {
      for (const k of ATHLETIC_KEYS) f[k] = R.recovery.athletic_factor;
      f.olympic_sets = R.recovery.olympic.sets_factor;
      factor = R.recovery.athletic_factor;
    } else if (tb.type === 'in_season' && D11.game_heavy) {
      const G = A.in_season_game_heavy;
      f.plyo_contacts = G.plyo_factor; f.jump_contacts = G.plyo_factor;
      if (!G.extra_cod) f.cod_cuts = 0;
      if (G.sprints === 'speed_athletes_only' && !(sp && sp.speed_athlete)) f.sprint_m = 0;
      factor = G.plyo_factor;
    }
    if (D11.heavy_play_week) { // R3-pending: R3-ATH-05
      const H = A.heavy_play_weeks;
      f.plyo_contacts *= H.plyo_factor;
      if (!H.extra_cod) f.cod_cuts = 0;
      factor = factor * H.plyo_factor;
    }
    const targets = {};
    for (const k of ATHLETIC_KEYS) {
      const b = baseOf(k);
      let v = b === null ? null : roundHalfUp(b * f[k]);
      if (tb.type === 'in_season' && k === 'olympic_sets' && v !== null && A.in_season_game_heavy && D11.game_heavy) v = Math.min(v, R.olympic.in_season.sets);
      targets[k] = v;
    }
    if (!enabled) for (const k of ATHLETIC_KEYS) if (k !== 'low_contacts') targets[k] = null;
    let plyo_share = null;
    if (enabled && D11.plyo_share) {
      const ps = D11.plyo_share;
      plyo_share = round4(frac !== null ? ps.start + (ps.end - ps.start) * frac : ps.end);
    }
    out.push({ n: ws.n, enabled, plyo_share, stage: ws.plyo_stage, factor: round4(factor), targets, contacts_session_max: D11.contacts_session_max });
  }
  return out;
}

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
 * ctx.estimateMinutes (optional, week.estimateMinutes) replaces the internal time model when given.
 *
 * v1.2 (coach-eye review of the 8 samples, every blocker): the planned stairway is the placed stairway.
 *  - The whole stairway is sized to the chosen minutes first (capacity probe, D-67): the peak week is placed on the main days;
 *    a muscle whose peak does not fit starts lower (never below its floor) so every week can still climb.
 *  - Week 1 = T(1): a group whose 2-exercise minimum on every day is above its target is trained on fewer days (D-68).
 *  - Stairway sets go to the main days in VOL-07 order (first exercise of the day first, the work lift never below another
 *    station of its group); optional days keep their template Focus slots and never carry the stairway (ORD-10).
 *  - A muscle rises at most max(1 set, 7 %) a week, the week total at most 7 % (R2-VOL-01, UNI-05); a new exercise mid-block
 *    enters at 1 set; no week is a "hold" without a check-in (R2-VOL-03).
 * @param {{derived:import('./util.mjs').Derived, shape:import('./util.mjs').Shape, layouts:import('./util.mjs').WeekLayout[],
 *          selections:import('./util.mjs').Selection[], model:object, fillSlot:Function, estimateMinutes?:Function}} ctx
 * @returns {import('./util.mjs').VolumePlan}
 */
export function planWeeklySets(ctx) {
  const { derived, shape, layouts, selections, model, fillSlot } = ctx;
  if (!derived || !shape || !Array.isArray(layouts) || !model) throw new EngineError('volume.bad_ctx', 'planWeeklySets needs derived, shape, layouts and model');
  const R = model.rules, V = R.volume, P = R.placement, S = R.session, TM = R.time_model, defs = R.muscles.defs;
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
  const OPT = P.optional_days || null;
  const mainOnly = !!(P.main_days_first && OPT && OPT.stairway_sets === false);
  const GDR = P.group_day_reduction || null;
  const minutesKeys = Object.keys(S.exercise_cap_by_minutes).map(Number).sort((a, b) => a - b);
  const capKey = (min) => { let k = minutesKeys[0]; for (const x of minutesKeys) if (x <= min) k = x; return String(k); };
  const splitCap = S.exercise_cap_by_minutes[capKey(derived.session_minutes)];
  const groupMax = Math.max(S.exercises_per_group.full_body_day[1], S.exercises_per_group.split_day[1]);
  const planMuscles = R.muscles.order.filter(m => m in D9.start && isNum(D9.start[m]));
  const targetMuscles = R.muscles.order.filter(m => m in D9.start);
  const own = (m) => D9.fill[m] === 'own_sets';
  const isoBucketOf = {};
  for (const id of Object.keys(model.templates.buckets).sort()) {
    const b = model.templates.buckets[id];
    if (b.kind !== 'isolation') continue;
    if (b.muscle && !isoBucketOf[b.muscle]) isoBucketOf[b.muscle] = { bucket: id, variant: null };
    if (b.muscle_by_variant) for (const [v, m] of Object.entries(b.muscle_by_variant)) if (!isoBucketOf[m]) isoBucketOf[m] = { bucket: id, variant: v };
  }
  const selFor = (eb) => (selections || []).find(s => s && s.exercise_block === eb) || (selections || [])[eb - 1] || null;
  const profile = model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;

  const weeksOut = [];
  const warnings = [];
  const floorMiss = [];
  const offers = [];
  const blockTargetsOut = [];
  const athletic = athleticBudget(derived, shape, model);
  let prevTotal = null, prevWeek = null;
  let lastStair = null; // {sets, weekly:[...], fills}
  let lastBlock = null; // {sets, type}
  let prevCircuit = null, prevStage = null;
  let prevMainCredits = null;

  for (const tb of shape.training_blocks) {
    const layout = layouts[tb.n - 1];
    if (!layout) throw new EngineError('volume.no_layout', `no layout for training block ${tb.n}`);
    // ---- block state
    const days = (layout.days || []).filter(d => (d.blocks || []).length).map(d => ({ ...d, slots: flattenDay(d), added: [] }));
    const mainDi = days.map((d, di) => di).filter(di => days[di].kind === 'main');
    const isMainDi = (di) => days[di].kind === 'main';
    let sets = {}, fills = {};
    let added = [];
    let ss = {};
    for (const d of days) ss[d.weekday] = !!d.supersets_on;
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
    let probing = false;

    const allSlots = () => { const out = []; days.forEach((d, di) => { for (const s of d.slots) out.push([s, di]); for (const s of d.added) out.push([s, di]); }); return out; };
    const daySlotsOf = (di) => [...days[di].slots, ...days[di].added];
    const kindOf = (slot) => model.bucket(slot.bucket).kind;
    const isCircuitSlot = (slot) => circuitPlan && slot.circuit !== null && slot.circuit !== undefined;
    const placeable = (slot) => (RESISTANCE_KINDS.includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin)) && !isCircuitSlot(slot) && slot.counts_as_volume !== false;
    const isResistance = (slot) => RESISTANCE_KINDS.includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin);
    const isIso = (slot) => ['isolation', 'focus'].includes(kindOf(slot)) || ADDED_ORIGINS.includes(slot.origin);
    const active = (slot) => isNum(sets[slot.slot_id]) && sets[slot.slot_id] > 0;
    const groupOfSlot = (slot) => {
      if (slot.group) return slot.group;
      const pm = primeOf(model, slot, fills[slot.slot_id]);
      return pm.length ? model.groupOf(pm[0]) : null;
    };
    const isRearSlot = (s) => (s.bucket === 'ISO_SIDE_REAR_DELT' && s.variant === 'rear') || s.focus_muscle === 'rear_delts';

    // weekly credits on all days or on the main days only (the stairway and the floor are read on main days, v1.2)
    const creditsRaw = (mainOnlyArg) => {
      const w = {};
      days.forEach((d, di) => {
        if (mainOnlyArg && !isMainDi(di)) return;
        for (const s of daySlotsOf(di)) {
          const n = sets[s.slot_id];
          if (!isNum(n) || n <= 0) continue;
          const cr = creditsOf(model, s, fills[s.slot_id]);
          if (!cr) continue;
          for (const [m, c] of Object.entries(cr)) w[m] = (w[m] || 0) + n * c;
        }
      });
      return w;
    };
    const directRaw = (mainOnlyArg) => {
      const w = {};
      days.forEach((d, di) => {
        if (mainOnlyArg && !isMainDi(di)) return;
        for (const s of daySlotsOf(di)) if (active(s)) for (const m of primeOf(model, s, fills[s.slot_id])) w[m] = (w[m] || 0) + sets[s.slot_id];
      });
      return w;
    };
    const weeklyRaw = () => creditsRaw(false);
    /** a target muscle's sets as the stairway reads them (own-sets muscles: direct sets only, review 05) */
    const haveOf = (m, mo = mainOnly) => (own(m) ? (directRaw(mo)[m] || 0) : (creditsRaw(mo)[m] || 0));
    const haveAll = (mo = mainOnly) => { const c = creditsRaw(mo), d = directRaw(mo), out = {}; for (const m of planMuscles) out[m] = own(m) ? (d[m] || 0) : (c[m] || 0); return out; };
    const directOf = (m) => directRaw(false)[m] || 0;
    const totalRes = (mo = false) => allSlots().reduce((a, [s, di]) => a + (isResistance(s) && active(s) && (!mo || isMainDi(di)) ? sets[s.slot_id] : 0), 0);
    const sessionFrac = (di, m) => {
      let t = 0;
      for (const s of daySlotsOf(di)) {
        const n = sets[s.slot_id]; if (!isNum(n) || n <= 0) continue;
        const cr = creditsOf(model, s, fills[s.slot_id]); if (cr && cr[m]) t += n * cr[m];
      }
      return t;
    };

    // ---- time model (INFERRED reading of rules.time_model; ctx.estimateMinutes wins when injected)
    const perSet = (slot) => {
      const mps = TM.minutes_per_set;
      let tc = slot.time_class || model.bucket(slot.bucket).time_class || 'isolation';
      const ex = exOf(model, fills[slot.slot_id]);
      const uni = ex && (ex.laterality === 'unilateral' || ex.laterality === 'alternating');
      if (uni && tc === 'compound_bilateral') tc = 'compound_unilateral';
      if (uni && tc === 'isolation') tc = 'isolation_unilateral';
      return isNum(mps[tc]) ? mps[tc] : mps.isolation;
    };
    const estimate = (di, setsMap, ssOn) => {
      const d = days[di];
      if (typeof ctx.estimateMinutes === 'function') {
        const blocks = (d.blocks || []).concat(d.added.length ? [{ kind: 'accessories', movable: false, circuit: null, slots: d.added }] : []);
        return ctx.estimateMinutes({ ...d, supersets_on: ssOn, blocks }, setsMap, fills, model, { week: curWS });
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
        const x = n * perSet(slot);
        if (ssOn && slot.superset) (pairs[slot.superset] = pairs[slot.superset] || []).push(x);
        else t += x + TM.changeover_min_per_exercise;
      }
      for (const k of Object.keys(pairs).sort()) {
        const g = pairs[k];
        t += g.length >= 2 ? g.reduce((a, b) => a + b, 0) * TM.superset_factor + g.length * TM.changeover_in_superset_pair : g[0] + TM.changeover_min_per_exercise;
      }
      for (const k of Object.keys(circs).sort()) {
        const g = circs[k], rounds = Math.max(...g);
        t += rounds * g.length * (curWS.circuit.work_s + TM.circuit.transition_s) / 60 + (rounds - 1) * TM.circuit.between_rounds_s / 60;
      }
      return t;
    };
    // full-body days may run "a little longer" (x 1.10, R2-SES-05); split days get no tolerance (review 07)
    const limitOf = (di) => (days[di].minutes_limit || derived.session_minutes) * (days[di].full_body === false && isMainDi(di) ? splitF : longF);
    const hasPairs = (di) => daySlotsOf(di).some(s => s.superset && active(s));

    // ---- fits: per-exercise max, per-session ceiling, split-day / athlete caps, minutes (supersets first, ORD-05)
    const timeOk = (di, extra) => {
      const m2 = { ...sets, ...extra };
      if (estimate(di, m2, !noSS && ss[days[di].weekday]) <= limitOf(di) + EPS) return { ok: true, ssOn: false };
      if (!noSS && !ss[days[di].weekday] && hasPairs(di) && estimate(di, m2, true) <= limitOf(di) + EPS) return { ok: true, ssOn: true };
      return { ok: false, ssOn: false };
    };
    // VOL-07: the day's work lift never has fewer sets than another station of its group (review 03 / 06 / 07)
    const workOk = (slot, di) => {
      if (slot.role === 'work' || !slot.group) return true;
      const w = daySlotsOf(di).find(s => s !== slot && s.role === 'work' && s.group === slot.group && active(s));
      if (!w) return true;
      const max = P.max_sets_per_exercise[L];
      return sets[slot.slot_id] + 1 <= sets[w.slot_id] || sets[w.slot_id] >= max;
    };
    const fitsSet = (slot, di, m, force) => {
      const n = sets[slot.slot_id];
      const max = isIso(slot) ? P.max_sets_isolation : P.max_sets_per_exercise[L];
      if (n + 1 > max) return null;
      if (!workOk(slot, di)) return null;
      const cr = creditsOf(model, slot, fills[slot.slot_id]) || {};
      const cap = prio.includes(m) ? V.per_session.priority : V.per_session.soft;
      if (sessionFrac(di, m) + (cr[m] || 0) > cap + EPS) return null;
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

    // ---- laterality share (UNI-02): which group gets the set
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
    const latPref = (m) => {
      const def = defs[m];
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

    // ---- weekly rise caps (v1.2: placed sets, R2-VOL-01 / UNI-05)
    let riseOn = false;
    let riseBy = {}, riseBase = {};
    const allowRise = (m) => {
      if (!PL) return Infinity;
      const prev = riseBase[m] || 0;
      const whole = Math.max(PL.per_muscle_whole_sets, roundHalfUp(PL.per_muscle_pct * prev));
      return prev > 0 ? Math.min(whole, Math.max(PL.per_muscle_whole_sets, Math.floor(PL.ceiling_pct * prev + EPS))) : whole;
    };
    const riseOk = (m, n = 1) => !riseOn || (riseBy[m] || 0) + n <= allowRise(m) + EPS;

    // ---- placeSet(m): VOL-07 order on the main days (alternating), then a bonus exercise on a main day
    const dayEligible = (di) => !mainOnly || isMainDi(di) || probing === 'all';
    const daysFor = (m) => days.map((d, di) => di).filter(di => dayEligible(di) && daySlotsOf(di).some(s => active(s) && placeable(s) && primeOf(model, s, fills[s.slot_id]).includes(m)))
      .sort((a, b) => (isMainDi(a) ? 0 : 1) - (isMainDi(b) ? 0 : 1) || a - b);
    let curWeekN = 1;
    let changesBuf = null;
    // force: skip the minutes check (only to put back the sets a block change moved, H21 sets never drop)
    const placeSet = (m, budget, force = false) => {
      if (budget !== undefined && budget < 1) return { ok: false, ceiling: true };
      if (!riseOk(m)) return { ok: false, rise: true };
      const dlist = daysFor(m);
      const mains = dlist.filter(isMainDi), opts = dlist.filter(di => !isMainDi(di));
      for (const group of [mains, opts]) {
        if (!group.length) continue;
        const li = lastDay[m] === undefined ? -1 : group.indexOf(lastDay[m]);
        const start = lastDay[m] === undefined ? 0 : (li >= 0 ? (li + 1) % group.length : Math.max(0, group.findIndex(x => x > lastDay[m])));
        const pref = latPref(m);
        const regB = pref ? R.bilateral_share.regions[defs[m].region] : null;
        for (let k = 0; k < group.length; k++) {
          const di = group[(start + k) % group.length];
          let cands = daySlotsOf(di).filter(s => active(s) && placeable(s) && primeOf(model, s, fills[s.slot_id]).includes(m));
          if (pref) {
            const f = cands.filter(s => regB.includes((fills[s.slot_id] && fills[s.slot_id].bucket) || s.bucket) && latOf(s) === pref);
            if (f.length) cands = f;
          }
          if (!cands.length) continue;
          const first = cands[0];
          const below = cands.filter(s => sets[s.slot_id] < sets[first.slot_id]);
          const ordered = [...below, first, ...cands.filter(s => s !== first && !below.includes(s))];
          for (const s of ordered) {
            const t = fitsSet(s, di, m, force);
            if (!t) continue;
            sets[s.slot_id] += 1;
            if (t.ssOn) ss[days[di].weekday] = true;
            lastDay[m] = di;
            if (riseOn) riseBy[m] = (riseBy[m] || 0) + 1;
            if (changesBuf) changesBuf.push({ key: 'changes.set_added', args: { exercise: fills[s.slot_id].exercise_id, day: days[di].weekday, slot_id: s.slot_id } });
            return { ok: true, added: 1, slot_id: s.slot_id };
          }
        }
        if (group === mains && mainOnly && probing !== 'all') break; // optional days never carry the stairway (v1.2, ORD-10)
      }
      return tryBonus(m, budget, force);
    };
    const tryBonus = (m, budget, force = false) => {
      const def = defs[m];
      const small = def.class === 'small';
      const nSets = small ? P.bonus.sets : P.focus.sets;
      const entry = riseOn ? Math.min(isNum(P.added_slot_entry_sets) ? P.added_slot_entry_sets : nSets, Math.floor(allowRise(m) - (riseBy[m] || 0) + EPS)) : nSets;
      if (entry < 1) return { ok: false, rise: true };
      if (budget !== undefined && budget < entry) return { ok: false, ceiling: true };
      const g = model.groupOf(m);
      // a bonus exercise goes on a main day whose group already has 1-3 exercises (2-4 per group, R2-SES-05); optional days
      // only when the plan lets them carry stairway sets (pre-v1.2 behaviour)
      const optional = mainOnly ? [] : days.map((d, di) => di).filter(di => days[di].kind === 'optional' && days[di].slots.some(s => RESISTANCE_KINDS.includes(kindOf(s))));
      const mains = days.map((d, di) => di).filter(di => days[di].kind === 'main' && groupCount(di, g) >= 1 && groupCount(di, g) < groupMax)
        .sort((a, b) => counted(a).length - counted(b).length || a - b);
      for (const di of [...mains, ...optional]) {
        const d = days[di];
        if (!capOk(di)) continue;
        if (d.kind === 'optional' && groupCount(di, g) >= groupMax) continue;
        const iso = isoBucketOf[m];
        const useFocus = d.kind === 'optional' || !small || !iso;
        const bucket = useFocus ? 'FOCUS' : iso.bucket;
        // engine-added ids share the `<weekday>.<day_type>.xNN` space with week.mjs (prehab): take the next free number
        const used = daySlotsOf(di).map(s => { const mm = /\.x(\d+)$/.exec(s.slot_id); return mm ? Number(mm[1]) : 0; });
        const k = Math.max(0, ...used) + 1;
        const tag = (d.day_type || 'day') + '.x' + String(k).padStart(2, '0');
        const slot = {
          slot_id: d.weekday + '.' + tag, station_id: tag, bucket, role: useFocus ? 'focus' : 'iso', block: 'accessories', group: g,
          sets_hint: null, default_sets: nSets, pair: null, superset: null, circuit: null, axial_req: null,
          variant: useFocus ? null : iso.variant, laterality_dial: false, loading: null, focus_muscle: m,
          time_class: model.bucket(bucket).time_class || 'isolation', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null,
          origin: small ? 'bonus' : 'focus_added',
          why: [small ? why('why.bonus', 'VOL-07') : why('why.focus', 'ORD-11')]
        };
        if (typeof fillSlot !== 'function') return { ok: false };
        const f = fillSlot(slot, curWeekN, probing ? { probe: true } : undefined);
        if (!f || !f.exercise_id || !primeOf(model, slot, f).includes(m)) continue;
        fills[slot.slot_id] = f;
        d.added.push(slot);
        sets[slot.slot_id] = entry;
        const capS = prio.includes(m) ? V.per_session.priority : V.per_session.soft;
        const t = timeOk(di, {});
        if (sessionFrac(di, m) > capS + EPS || (!t.ok && !force)) { d.added.pop(); delete sets[slot.slot_id]; delete fills[slot.slot_id]; continue; }
        if (t.ssOn) ss[d.weekday] = true;
        added.push(slot);
        lastDay[m] = di;
        if (riseOn) riseBy[m] = (riseBy[m] || 0) + entry;
        if (changesBuf) changesBuf.push({ key: 'changes.bonus_added', args: { exercise: f.exercise_id, day: d.weekday, slot_id: slot.slot_id } });
        return { ok: true, added: entry, slot_id: slot.slot_id, bonus: true };
      }
      return { ok: false };
    };

    // ---- group-day reduction (v1.2, D-68): a group whose 2-exercise minimum on every day sits above its week-1 target is
    // trained on fewer days, each keeping 2 exercises (master 10.3 PROPOSED; review 02 blocker 1)
    const reduceGroups = (targets) => {
      if (!GDR || !GDR.enabled) return;
      const rearActive = () => allSlots().filter(([s]) => active(s) && isRearSlot(s)).length;
      for (const m of targetMuscles) {
        if (!isNum(targets[m])) continue;
        for (let guard = 0; guard < 12; guard++) {
          const have = haveOf(m, true);
          if (have <= targets[m] + P.week1_fit.trim_above + EPS) break;
          let best = null;
          for (const di of mainDi) {
            const mine = daySlotsOf(di).filter(s => active(s) && placeable(s) && primeOf(model, s, fills[s.slot_id]).includes(m));
            for (const g of [...new Set(mine.map(groupOfSlot))].filter(Boolean)) {
              if (g === 'calves') continue; // calves stay on every leg day (VOL-17, V18)
              const unit = daySlotsOf(di).filter(s => active(s) && placeable(s) && groupOfSlot(s) === g);
              if (unit.some(s => GDR.keep_roles.includes(s.role))) continue;
              if (GDR.keep_pair_of_work && unit.some(s => s.pair && daySlotsOf(di).some(x => x !== s && x.role === 'work' && x.pair === s.pair && active(x)))) continue;
              const rears = unit.filter(isRearSlot).length;
              if (rears && rearActive() - rears < 1) continue;
              const cut = unit.reduce((a, s) => a + (primeOf(model, s, fills[s.slot_id]).includes(m) ? sets[s.slot_id] : 0), 0);
              const after = have - cut;
              if (after < targets[m] - 2 * P.max_sets_per_exercise[L] - EPS) continue;
              // another target muscle of the unit must keep a way to reach its own target
              const hurts = unit.some(s => primeOf(model, s, fills[s.slot_id]).some(x => x !== m && isNum(targets[x]) && haveOf(x, true) - sets[s.slot_id] < targets[x] - 1 - EPS &&
                !daySlotsOf(di).concat(...mainDi.filter(o => o !== di).map(daySlotsOf)).some(o => !unit.includes(o) && active(o) && placeable(o) && primeOf(model, o, fills[o.slot_id]).includes(x))));
              if (hurts) continue;
              const score = Math.abs(after - targets[m]) + (after > targets[m] + P.week1_fit.trim_above ? 0 : 0.01);
              if (!best || score < best.score - EPS || (Math.abs(score - best.score) <= EPS && di > best.di)) best = { di, g, unit, score };
            }
          }
          if (!best) break;
          for (const s of best.unit) sets[s.slot_id] = 0;
          reduced.push({ day: days[best.di].weekday, group: best.g, muscle: m });
        }
      }
    };

    // ---- week-1 fit (12 v1.1 §4 step 3): trim above target + trim_above (latest isolation first, never below min_sets), drop
    // whole group-days still above, then add below target - add_below (priority muscles first when asked)
    const fit = (targets, floorSet, opts = {}) => {
      for (const m of targetMuscles) {
        if (!isNum(targets[m])) continue;
        let guard = 0;
        while (haveOf(m, true) > targets[m] + P.week1_fit.trim_above + EPS && guard++ < 200) {
          const cands = [];
          days.forEach((d, di) => { if (!isMainDi(di) && mainOnly) return; daySlotsOf(di).forEach((s, si) => {
            const calfMin = s.bucket === 'ISO_CALF' ? (s.calf_index === 1 ? 1 : (s.calf_alone ? (S.default_sets.calves_first_when_alone || 3) : P.min_sets)) : P.min_sets;
            const workMin = derived.session_minutes >= (P.work_min_sets_from_minutes || 0) ? (P.work_min_sets || 0) : 0;
            if (active(s) && placeable(s) && sets[s.slot_id] > calfMin && primeOf(model, s, fills[s.slot_id]).includes(m) && !(s.role === 'work' && sets[s.slot_id] <= workMin)) cands.push({ s, di, si, iso: isIso(s) ? 0 : 1 });
          }); });
          if (!cands.length) break;
          cands.sort((a, b) => a.iso - b.iso || b.di - a.di || b.si - a.si);
          sets[cands[0].s.slot_id] -= 1;
        }
      }
      if (opts.reduce !== false) reduceGroups(targets);
      const stuck = {};
      // v1.2: when time is short, the client's priorities and the sport profile's priorities come first, then the floored big
      // muscles, then calves / own-sets muscles, then the small muscles (review 01 major 7 / 04 major 8 / 07 blocker 2)
      const profPrio = ((profile && profile.priority_muscles) || []).filter(m => isNum(targets[m]));
      const tier1 = [...new Set([...prio, ...profPrio])].filter(m => isNum(targets[m]));
      const tier2 = targetMuscles.filter(m => isNum(targets[m]) && !tier1.includes(m) && defs[m].class === 'big' && floorSet.includes(m));
      const tier3 = targetMuscles.filter(m => isNum(targets[m]) && !tier1.includes(m) && !tier2.includes(m) && (own(m) || defs[m].per_leg_day));
      const passes = opts.priorityFirst ? [tier1, [...tier1, ...tier2], [...tier1, ...tier2, ...tier3], null].filter(x => x === null || x.length) : [null];
      for (const only of passes) {
        for (let guard = 0; guard < 3000; guard++) {
          const h = haveAll(true);
          let best = null, bestD = 0;
          for (const m of (only || targetMuscles)) {
            if (!isNum(targets[m]) || stuck[m]) continue;
            const thr = Math.max(targets[m] - P.week1_fit.add_below, floorSet.includes(m) ? floorV : -Infinity);
            const have = h[m] || 0;
            if (have >= thr - EPS) continue;
            const d = (thr - have) / Math.max(targets[m], 1);
            if (best === null || d > bestD + EPS) { best = m; bestD = d; }
          }
          if (best === null) break;
          const r = placeSet(best);
          if (!r.ok) stuck[best] = true;
        }
      }
      return stuck;
    };

    const olyExposures = days.filter(d => d.kind === 'main').reduce((a, d) => a + d.slots.filter(s => s.bucket === 'AP_TRIPLE_EXT').length, 0);
    const initialSets = (slot, ws) => {
      if (roomCut.has(slot.slot_id)) return 0;
      const k = kindOf(slot);
      if (NO_SET_KINDS.includes(k) || NO_SET_BUCKETS.includes(slot.bucket)) return null;
      if (isCircuitSlot(slot) && ws.circuit) return ws.circuit.rounds;
      if (slot.bucket === 'COND_CIRCUIT') return null;
      const f = fills[slot.slot_id];
      if (slot.text_key && !(f && f.exercise_id)) return null;
      if (!f || !f.exercise_id) return 0;
      if (slot.bucket === 'AP_TRIPLE_EXT') {
        // v1.2: Olympic sets follow the profile's weekly budget (2-4 a station; stay-active 2), review 01 / 03 / 04 / 08
        const per = olympicSetsPerExposure(derived, model, olyExposures, ws);
        if (isNum(per)) return per;
        const ex = exOf(model, f);
        if (ex && ex.athletic && ex.athletic.olympic_tier === 'L1' && ['clean', 'snatch', 'jerk'].includes(ex.athletic.olympic_family)) {
          const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
          const idx = Math.min(Math.max(ws.n - eb.weeks[0], 0), R.olympic.ramp.length - 1);
          return R.olympic.ramp[idx].sets; // PER-09 ramp 4 x 8 -> 4 x 4
        }
      }
      if (slot.bucket === 'ISO_CALF' && slot.calf_index === 1 && isNum(V.calves.second_station_sets)) return V.calves.second_station_sets; // all minutes (review 02 / 07)
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
      if (slot.bucket === 'ISO_CALF' && slot.calf_index === 0 && slot.calf_alone && isNum(S.default_sets.calves_first_when_alone)) n = Math.max(n, S.default_sets.calves_first_when_alone);
      // v1.2 (review 08 blocker 2, D-67): when the minutes leave no room to climb, an isolation enters at 1 set and climbs
      // (VOL-07 2/2/2 -> 3/2/2 order still adds to the first exercise first); calves keep their per-leg-day sets
      if (shortStart && (k === 'isolation' || k === 'focus') && slot.bucket !== 'ISO_CALF' && isNum(CAP && CAP.short_start_iso_sets)) n = Math.min(n, CAP.short_start_iso_sets);
      return n;
    };
    const setFills = (sel) => {
      for (const d of days) for (const s of d.slots) fills[s.slot_id] = sel && sel.fills ? (sel.fills[s.slot_id] || null) : null;
    };
    const refillAdded = () => {
      for (const s of added) {
        const f = typeof fillSlot === 'function' ? fillSlot(s, curWeekN) : null;
        if (f && f.exercise_id && primeOf(model, s, f).includes(s.focus_muscle)) fills[s.slot_id] = f; // keep the muscle (H21)
      }
    };
    const snapshot = () => ({ sets: { ...sets }, fills: { ...fills }, added: added.slice(), dayAdded: days.map(d => d.added.slice()), ss: { ...ss }, lastDay: { ...lastDay }, reduced: reduced.slice() });
    const restore = (sn) => {
      sets = { ...sn.sets }; fills = { ...sn.fills }; added = sn.added.slice(); days.forEach((d, i) => { d.added = sn.dayAdded[i].slice(); });
      ss = { ...sn.ss }; lastDay = { ...sn.lastDay }; reduced.length = 0; reduced.push(...sn.reduced);
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
        const mus = primeOf(model, s, fills[s.slot_id]).join(',');
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

    // ---- capacity: the whole stairway must fit the chosen minutes (v1.2, D-67)
    const floorOf = (m, floorSet) => (floorSet.includes(m) ? floorV : (defs[m] && defs[m].per_leg_day && !circuitPlan ? Math.min(bt0.start[m], V.calves.weekly_floor) : 0));
    // block-level 'room cuts' (v1.2): removable items (the 1-set second calf station, a buy-out, extra joint care, a second jump
    // station, a third exercise of a group ...) leave the block when the stairway has no room to climb (R2-PER-03 every plan
    // climbs; review 01 major 3 'trim over-budget athletic sets and 1-set fillers, not the stairway')
    const roomCut = new Set();
    let lastRoomRule = null;
    const ROOM = (CAP && CAP.room_cut_order) || [];
    const nextRoomCut = (prioOnly = false) => {
      const live = allSlots().filter(([s, di]) => isMainDi(di) && active(s) && !roomCut.has(s.slot_id));
      const byRule = {
        // the 1-set second calf station, only while the day keeps its first calf station (calves every leg day, VOL-17 / V18)
        second_calf: () => live.filter(([s, di]) => s.bucket === 'ISO_CALF' && s.calf_index === 1 && daySlotsOf(di).some(x => x !== s && x.bucket === 'ISO_CALF' && x.calf_index === 0 && active(x) && !roomCut.has(x.slot_id))),
        buyout: () => live.filter(([s]) => s.bucket === 'COND_SPRINT_BUYOUT'),
        // a repeated joint-care item (the same code on 2+ days), never the knee / Achilles care each leg day keeps (D-32)
        prehab_extra: () => live.filter(([s]) => kindOf(s) === 'prehab' && s.bucket !== 'PREHAB_LOWER' && live.filter(([x]) => kindOf(x) === 'prehab' && x.prehab_code === s.prehab_code).length > 1),
        second_plyo: () => live.filter(([s, di]) => s.bucket === 'AP_PLYO' && daySlotsOf(di).filter(x => x.bucket === 'AP_PLYO' && active(x) && !roomCut.has(x.slot_id)).length > 1 && !s.track),
        ankle_block_extra: () => live.filter(([s]) => s.bucket === 'AP_JUMP_LIMITED_KNEE' && live.filter(([x]) => x.bucket === 'AP_JUMP_LIMITED_KNEE').length > 1),
        second_throw: () => live.filter(([s]) => s.bucket === 'AP_THROW' && live.filter(([x]) => x.bucket === 'AP_THROW').length > 1),
        // stay-active plans keep one light Olympic piece a week when the minutes are short (R2-ATH-04 'a light piece')
        olympic_extra_stay_active: () => (derived.D1_family === 'athletic' && derived.D2_profile.competitive !== 'competitive') ? live.filter(([s]) => s.bucket === 'AP_TRIPLE_EXT' && live.filter(([x]) => x.bucket === 'AP_TRIPLE_EXT').length > 1) : [],
        // a non-priority isolation group (two curls, two rear-delt flies, two pushdowns) leaves one of its main days when a client
        // priority or the stairway needs the minutes; the whole group goes, never one exercise of it (05 rule_v1_1, V23 2-4 per
        // group), and the muscle keeps its other day(s) (review 06 blocker: priorities first, R2-VOL-06)
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
              const pm = [...new Set(unit.flatMap(x => primeOf(model, x, fills[x.slot_id])))];
              if (!pm.length || pm.some(m => prio.includes(m)) || prio.some(m => model.groupOf(m) === g)) continue; // a priority's group stays
              const otherDays = mainDi.filter(o => o !== di && daySlotsOf(o).some(x => active(x) && placeable(x) && !roomCut.has(x.slot_id) && isIso(x) && primeOf(model, x, fills[x.slot_id]).some(m => pm.includes(m)))).length;
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
      // the week keeps one rear-delt station (V18, R2-VOL-04) and its rear-delt / calf minimums whatever the rule
      const rearLive = allSlots().filter(([x]) => isRearSlot(x) && active(x) && !roomCut.has(x.slot_id)).length;
      const unitOf = (r, cand) => (['group_frequency', 'second_iso_nonpriority'].includes(r) && cand[2]) ? cand[2] : [cand[0]];
      for (const r of ROOM) {
        if (prioOnly && !(CAP.priority_room_cuts || []).includes(r)) continue; // only cuts that never cost the stairway's structure
        const c = (byRule[r] ? byRule[r]() : []).filter(cand => { const u = unitOf(r, cand); const rr = u.filter(isRearSlot).length; return !(rr && rearLive - rr < 1); });
        if (c.length) { lastRoomRule = r; return c[c.length - 1][0]; } // the latest one first
      }
      return null;
    };
    const sizeToCapacity = (ws0, floorSet) => {
      if (!CAP || !stair || circuitPlan || flatSets) return null;
      const N = tb.stair_N;
      const lastWS = wks[wks.length - 1];
      const zero = {}; for (const m of planMuscles) zero[m] = 0;
      let lowered = [];
      for (let outer = 0; outer < 24; outer++) {
        const base = snapshot();
        bt = bt0; plan = stairwayFrom(bt0, tb, derived, model);
        // 1. the structure's own minimum (every station at its minimum sets): week 1 can never sit below it
        curWS = ws0;
        fit(zero, [], { reduce: false });
        const minPlaced = haveAll(true), minTotal = totalRes(true);
        // 2. the peak week's capacity from there (the peak week's Olympic sets, WOD minutes and circuit dose), filled by
        //    priority tiers (the client's and the sport's priorities, the floored big muscles, calves / own sets, the rest)
        const peak = {}; for (const m of planMuscles) peak[m] = plan.T[m][N - 1];
        curWS = lastWS; probing = true;
        for (const [sl] of allSlots()) if (sl.bucket === 'AP_TRIPLE_EXT' && active(sl)) { const per = olympicSetsPerExposure(derived, model, olyExposures, lastWS); if (isNum(per)) sets[sl.slot_id] = per; }
        fit(peak, floorSet, { priorityFirst: true, reduce: false });
        const got = haveAll(true), peakTotal = totalRes(true);
        probing = false; curWS = ws0;
        restore(base);
        const missed = planMuscles.filter(m => peak[m] - (got[m] || 0) >= R.stairway.release.threshold - EPS);
        const room = peakTotal - minTotal;
        const minGrowth = Math.max(mainDi.length, Math.ceil((CAP.min_growth_share || 0) * Math.max(1, minTotal)));
        // a client priority that reaches less than its share of the peak also frees room (review 06: priorities first)
        const prioShort = prio.filter(m => isNum(peak[m]) && peak[m] > 0 && (got[m] || 0) < (CAP.priority_min_share || 0) * peak[m] - EPS);
        if (missed.length && (room < minGrowth || prioShort.length)) {
          const victim = nextRoomCut(prioShort.length && room >= minGrowth);
          if (victim) { applyRoomCut(victim); continue; }
        }
        // 3. the stairway each muscle can climb inside the minutes: a muscle whose peak does not fit starts lower (never below
        //    the structure's minimum or, when the floor fits at the peak, below the floor) so every week can still climb
        const start2 = { ...bt.start }, cap2 = { ...bt.cap };
        for (const m of missed) {
          // v1.2 (review 06 blocker): a priority or own-sets muscle that cannot reach its peak also starts lower, so it climbs
          // (it still fills first: the peak probe is priority-first); own-sets muscles (rear delts, R2-VOL-04) keep their start
          if (own(m)) continue;
          const g1 = plannedGrowth(m, bt, tb, derived, model);
          const c = Math.min(bt.cap[m], Math.floor((got[m] || 0) + EPS));
          const flm = floorOf(m, floorSet);
          const floorFits = c + EPS >= flm;
          if (!floorFits && floorSet.includes(m) && !floorMissPlan.includes(m)) floorMissPlan.push(m);
          let st0 = Math.min(bt.start[m], Math.max(Math.ceil((minPlaced[m] || 0) - EPS), Math.floor(c / g1 + EPS)));
          if (floorFits) st0 = Math.max(st0, Math.min(flm, bt.start[m]));
          const c2 = Math.max(c, st0);
          if (st0 !== start2[m] || c2 !== cap2[m]) { start2[m] = st0; cap2[m] = c2; lowered.push(m); }
        }
        // the floors raised by step 3 can eat the room the stairway needs: one more room cut when the planned climb is too small
        const growth = planMuscles.reduce((a, m) => a + Math.max(0, Math.min(cap2[m] ?? 0, missed.includes(m) ? (got[m] ?? 0) : Infinity) - (start2[m] ?? 0)), 0);
        if (missed.length && growth < minGrowth && outer < 23) {
          const victim = nextRoomCut();
          if (victim) { applyRoomCut(victim); lowered = []; continue; }
          if (!shortStart && isNum(CAP.short_start_iso_sets)) {
            shortStart = true; lowered = [];
            for (const [sl] of allSlots()) { const v = initialSets(sl, ws0); if (v !== null) sets[sl.slot_id] = v; }
            roomWhys.push(why('why.short_start', 'VOL-07'));
            continue;
          }
        }
        if (lowered.length) { bt = { ...bt, start: start2, cap: cap2 }; plan = stairwayFrom(bt, tb, derived, model); }
        break;
      }
      return lowered;
    };
    const applyRoomCut = (victim) => {
      const unit = ['group_frequency', 'second_iso_nonpriority'].includes(lastRoomRule) ? (() => {
        for (const di of mainDi) { const u = daySlotsOf(di).filter(x => active(x) && placeable(x) && groupOfSlot(x) === groupOfSlot(victim)); if (u.includes(victim) && u.length >= 2) return u; }
        return [victim];
      })() : [victim];
      for (const x of unit) { roomCut.add(x.slot_id); sets[x.slot_id] = 0; }
      if (victim.bucket === 'ISO_CALF' && victim.calf_index === 1) {
        const di = days.findIndex(d => d.slots.includes(victim) || d.added.includes(victim));
        for (const x of di >= 0 ? daySlotsOf(di) : []) if (x.bucket === 'ISO_CALF' && x.calf_index === 0) { x.calf_alone = true; if (active(x)) sets[x.slot_id] = Math.max(sets[x.slot_id], S.default_sets.calves_first_when_alone || 3); }
      }
      roomWhys.push(why('why.room_cut', 'R2-PER-03', { exercise: (fills[victim.slot_id] && fills[victim.slot_id].exercise_id) || victim.bucket }));
    };
    const roomWhys = [];
    const floorMissPlan = [];
    let shortStart = false;

    // ---- weeks of this training block
    for (const ws of wks) {
      curWeekN = ws.n;
      curWS = ws;
      const eb = shape.exercise_blocks.find(e => e.n === ws.exercise_block);
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
          const floorSet = bt0.floored || D9.floored || [];
          if (!circuitPlan) {
            const lowered = sizeToCapacity(ws, floorSet) || [];
            whys.push(...roomWhys);
            if (lowered.length) {
              whys.push(why('why.capacity_start', 'D-67'));
              warnings.push({ code: 'start_lowered', key: 'warning.start_lowered', args: { muscles: R.muscles.order.filter(m => lowered.includes(m)).join(', '), minutes: derived.session_minutes } });
            }
            const startT = {};
            for (const m of planMuscles) startT[m] = bt.start[m];
            const stuck = fit(startT, floorSet.filter(m => !floorMissPlan.includes(m)), { priorityFirst: true });
            for (const m of floorMissPlan) if (!floorMiss.includes(m)) floorMiss.push(m);
            for (const m of planMuscles) if (stuck[m]) shortfalls.push({ code: 'shortfall', field: m, key: 'why.cut_time', args: { muscle: m, missing: round2(Math.max(0, startT[m] - haveOf(m))) } });
            if (reduced.length) whys.push(why('why.group_fewer_days', 'D-68'));
            if (lowered.length) {
              // what the original starts would need: the longest main day of the probe, rounded up to 5 min (offer, R2-SES-05 / UNI-09)
              const missing = lowered.reduce((a, m) => a + Math.max(0, D9.start[m] - bt.start[m]), 0);
              const mains = Math.max(1, mainDi.length);
              const need = Math.ceil((derived.session_minutes + missing * TM.minutes_per_set.compound_bilateral / mains) / 5 - EPS) * 5;
              const competitive = derived.D2_profile && derived.D2_profile.competitive === 'competitive';
              const maxMin = Math.max(...S.minutes_allowed.filter(x => competitive || !S.minutes_over_90_competitive_only || x <= 90));
              if (need > derived.session_minutes) {
                offers.push({ key: 'offer.lower_start', args: { minutes: derived.session_minutes }, chosen: true });
                if (need <= maxMin) offers.push({ key: 'offer.longer_sessions', args: { min: need } });
                if (derived.days_per_week < 6) offers.push({ key: 'offer.more_days', args: { days: derived.days_per_week + 1 } });
              }
            }
          }
          if (prio.length) whys.push(why('why.nonpriority_cap', 'R2-VOL-06'));
          if (derived.age >= R.population.older.from_age) whys.push(why('why.older_step', 'D-05'));
          blockTargetsOut.push({ training_block: tb.n, start: { ...bt.start }, cap: { ...bt.cap }, lowered: R.muscles.order.filter(m => isNum(bt.start[m]) && bt.start[m] < bt0.start[m]) });
        } else if (tb.type === 'pre_season') {
          const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : V.phase_factors.pre_season.factor;
          let base = lastStair ? lastStair.sets : null;
          if (!base) { const t0 = {}; for (const m of planMuscles) t0[m] = D9.start[m]; fit(t0, []); base = { ...sets }; }
          preScale(base, f, ws);
          whys.push(why('why.pre_season', 'R2-PER-06'));
        } else if (tb.type === 'taper') {
          const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : V.phase_factors.taper.factor;
          scaleFrom(lastBlock ? lastBlock.sets : null, f, 'half_up', ws);
          whys.push(why('why.taper', 'R2-PER-06'));
        } else if (tb.type === 'recovery') {
          scaleFrom(lastStair ? lastStair.sets : null, R.recovery.sets_factor, 'ceil', ws);
        } else if (tb.type === 'in_season') {
          const t = targetsFor(derived, model, { modifier_id: (tb.factor && tb.factor.modifier) || V.phase_factors.in_season.modifier, floor: false, maintenance: false, cycles: 0, legDays: legDaysOfLayout(layout) });
          flatTargets = t.start;
          fit(t.start, []);
          whys.push(why('why.in_season', 'R2-ATH-07'));
        } else if (tb.type === 'maintenance') {
          let t;
          if (derived.D5_plan_shape.mode === 'maintenance_4_6' || !lastStair) {
            t = derived.D5_plan_shape.mode === 'maintenance_4_6' ? { ...D9.start } : targetsFor(derived, model, { maintenance: true, maintFactor: tb.factor && tb.factor.factor }).start;
          } else {
            const f = tb.factor && isNum(tb.factor.factor) ? tb.factor.factor : maintFactorOf(derived, model);
            const last4 = lastStair.weekly.slice(-4);
            t = {};
            for (const m of planMuscles) t[m] = roundHalfUp(f * last4.reduce((a, w) => a + (w[m] || 0), 0) / last4.length);
          }
          flatTargets = t;
          if (!circuitPlan) fit(t, []);
          const w = weeklyRaw();
          const want = planMuscles.reduce((a, m) => a + (t[m] || 0), 0);
          const got = planMuscles.reduce((a, m) => a + Math.min(w[m] || 0, t[m] || 0), 0);
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
        if (circuitPlan) for (const [s] of allSlots()) if (isCircuitSlot(s) && ws.circuit) sets[s.slot_id] = ws.circuit.rounds;
        // Olympic sets follow the budget week by week (v1.2)
        for (const [s] of allSlots()) if (s.bucket === 'AP_TRIPLE_EXT' && active(s)) { const per = olympicSetsPerExposure(derived, model, olyExposures, ws); if (isNum(per) && stair) sets[s.slot_id] = per; }
        // a new exercise block may move a slot's main muscle (e.g. a single-leg RDL becomes a single-leg glute bridge): sets of a
        // target muscle never drop inside a stairway (H21), so the lost direct sets are placed back first (VOL-07 order)
        const prevW = weeksOut.length ? weeksOut[weeksOut.length - 1] : null;
        if (stair && ws.is_exercise_block_start && !circuitPlan && prevW) {
          changesBuf = changes;
          for (const m of planMuscles) {
            if (D9.fill[m] !== 'target') continue;
            for (let guard = 0; guard < 20 && directOf(m) < (prevW.direct_sets_by_muscle[m] || 0); guard++) {
              const r = placeSet(m, undefined, true);
              if (!r.ok) break;
            }
          }
          changesBuf = null;
        }
      }
      if (ws.plyo_stage && prevStage && ws.plyo_stage !== prevStage && !ws.is_training_block_start) changes.push({ key: 'changes.stage_up', args: { stage: ws.plyo_stage } });
      if (ws.circuit && prevCircuit && ws.circuit.work_s > prevCircuit.work_s && !ws.is_training_block_start) changes.push({ key: 'changes.circuit_longer', args: { work_s: ws.circuit.work_s } });

      // ---- the stairway step (no check-in = the planned stairway, H22)
      const idx = stair ? ws.stair_week - 1 : null;
      let ceilingHit = false;
      const placed = [];
      if (stair) whys.push(why('why.no_checkin_planned', 'R2-VOL-03'));
      if (stair && ws.stair_week >= 2 && !circuitPlan && !flatSets) {
        changesBuf = placed;
        riseOn = true; riseBy = {}; riseBase = prevMainCredits ? { ...prevMainCredits } : haveAll();
        const total0 = totalRes(mainOnly);
        const prevT = prevWeek ? prevWeek.totalMain : total0;
        const allowedTotal = PL ? Math.floor(prevT * (1 + PL.total_pct) + EPS) : (prevTotal !== null ? Math.ceil(prevTotal * (1 + R.stairway.limits.total_weekly_ceiling) - EPS) - 1 : Infinity);
        let total = total0;
        const w0 = haveAll();
        const cands = planMuscles.filter(m => plan.T[m] && plan.T[m][idx] - (w0[m] || 0) >= R.stairway.release.threshold - EPS)
          .map(m => ({ m, pri: prio.includes(m) ? 0 : 1, cls: defs[m].class === 'big' ? 0 : 1, bank: plan.T[m][idx] - (w0[m] || 0), ord: R.muscles.order.indexOf(m) }))
          .sort((a, b) => a.pri - b.pri || a.cls - b.cls || b.bank - a.bank || a.ord - b.ord);
        for (const { m } of cands) {
          let guard = 0;
          while (guard++ < 50) {
            const have = haveOf(m);
            if (plan.T[m][idx] - have < R.stairway.release.threshold - EPS) break;
            if (have + 1 > bt.cap[m] + EPS) { if (!atCapSeen[m]) { atCapSeen[m] = true; changes.push({ key: 'changes.at_cap', args: { muscle: m } }); whys.push(why('why.at_cap', 'VOL-02', { muscle: m })); } break; }
            const r = placeSet(m, allowedTotal - total);
            if (!r.ok) {
              if (r.ceiling) ceilingHit = true;
              else if (!r.rise) shortfalls.push({ code: 'shortfall', field: m, key: 'why.cut_time', args: { muscle: m, missing: round2(plan.T[m][idx] - have) } });
              break;
            }
            total += r.added;
          }
        }
        // smoothing: a week never stands still - the muscle with the largest bank (>= 0.4) takes one set early (R2-PER-03/04)
        if (total <= prevT && TRACK_EARLY_RELEASE) {
          const w1 = haveAll();
          const early = planMuscles.filter(m => plan.T[m] && plan.T[m][idx] - (w1[m] || 0) >= 0.4 - EPS && (w1[m] || 0) + 1 <= Math.min(bt.cap[m], plan.T[m][idx] + 0.6) + EPS)
            .map(m => ({ m, bank: plan.T[m][idx] - (w1[m] || 0), ord: R.muscles.order.indexOf(m), pri: prio.includes(m) ? 0 : 1 }))
            .sort((a, b) => a.pri - b.pri || b.bank - a.bank || a.ord - b.ord);
          for (const { m } of early) { const r = placeSet(m, allowedTotal - total); if (r.ok) { total += r.added; break; } }
        }
        riseOn = false;
        changesBuf = null;
        if (ceilingHit) whys.push(why('why.total_ceiling', 'UNI-05'));
        if (placed.length) whys.push(why('why.set_added', 'VOL-07'));
      }
      for (const c of placed) changes.push(c);
      if (stair && ws.stair_week >= 2) {
        const w = haveAll();
        const capped = planMuscles.filter(m => (w[m] || 0) + 1 > bt.cap[m] + EPS);
        for (const m of capped) if (!atCapSeen[m]) { atCapSeen[m] = true; changes.push({ key: 'changes.at_cap', args: { muscle: m } }); }
        // never a 'hold' without a check-in (R2-VOL-03): a week without a new set climbs by load (and the planned effort)
        if (capped.length || !changes.some(c => c.key === 'changes.set_added' || c.key === 'changes.bonus_added')) changes.push({ key: 'changes.load_up', args: {} });
      }

      // ---- record the week
      const w = weeklyRaw();
      const total = totalRes();
      const weekly_sets_by_muscle = {}, direct_sets_by_muscle = {}, main_sets_by_muscle = {};
      const mainC = creditsRaw(true), mainD = directRaw(true);
      for (const m of R.muscles.order) { weekly_sets_by_muscle[m] = round2(w[m] || 0); direct_sets_by_muscle[m] = 0; main_sets_by_muscle[m] = round2(own(m) ? (mainD[m] || 0) : (mainC[m] || 0)); }
      for (const [s] of allSlots()) if (active(s)) for (const m of primeOf(model, s, fills[s.slot_id])) direct_sets_by_muscle[m] += sets[s.slot_id];
      const target_by_muscle = {}, step_by_muscle = {}, banks = {};
      for (const m of targetMuscles) {
        if (!isNum(D9.start[m])) { target_by_muscle[m] = null; continue; }
        if (stair) target_by_muscle[m] = round2(plan.T[m][idx]);
        else target_by_muscle[m] = flatTargets && isNum(flatTargets[m]) ? round2(flatTargets[m]) : round2(w[m] || 0);
      }
      const hv = haveAll();
      for (const m of planMuscles) {
        step_by_muscle[m] = stair ? plan.steps[m][idx] : 0;
        banks[m] = stair ? round2(Math.min(Math.max(plan.T[m][idx] - (hv[m] || 0), 0), R.stairway.release.bank_max_blocked)) : 0;
      }
      if (stair) for (const m of (bt0.floored || [])) if ((mainOnly ? (mainC[m] || 0) : (w[m] || 0)) < floorV - EPS && !floorMiss.includes(m)) floorMiss.push(m);
      const sets_by_slot = {};
      const est_minutes = {}, supersets_on = {};
      days.forEach((d, di) => {
        for (const s of daySlotsOf(di)) sets_by_slot[s.slot_id] = isNum(sets[s.slot_id]) ? sets[s.slot_id] : null;
        const on = !noSS && !!ss[d.weekday];
        supersets_on[d.weekday] = on;
        est_minutes[d.weekday] = roundHalfUp(estimate(di, sets, on));
      });
      const rise = prevTotal !== null && prevTotal > 0 ? round4((total - prevTotal) / prevTotal) : null;
      weeksOut.push({
        n: ws.n, sets_by_slot, added_slots: added.map(s => ({ ...s, why: s.why.slice() })), supersets_on, target_by_muscle,
        weekly_sets_by_muscle, direct_sets_by_muscle, main_sets_by_muscle, step_by_muscle, total_resistance_sets: total,
        total_main_sets: totalRes(true), rise_vs_prev: rise, banks, est_minutes, changes, shortfalls, why: whys
      });
      prevTotal = total;
      prevWeek = { sets: { ...sets }, totalMain: totalRes(mainOnly) };
      prevMainCredits = haveAll();
      prevCircuit = ws.circuit;
      prevStage = ws.plyo_stage;
      if (stair) {
        if (ws.is_training_block_start) lastStair = { sets: {}, weekly: [] };
        lastStair.sets = { ...sets };
        lastStair.weekly.push({ ...w });
      }
    }
    lastBlock = { sets: prevWeek ? prevWeek.sets : {}, type: tb.type };
  }
  if (floorMiss.length) {
    const muscles = R.muscles.order.filter(m => floorMiss.includes(m));
    const mainDays = derived.days_per_week;
    const missing = muscles.length * floorV;
    const extra = Math.ceil(missing * TM.minutes_per_set.compound_bilateral / Math.max(mainDays, 1) / 5) * 5; // INFERRED advice size
    const MAX_DAYS = 6; // INFERRED: the top of F22 (2-6 days); below it the first advice is one more training day (D-33)
    const advice = derived.days_per_week < MAX_DAYS ? 'ui.plan.schedule_advice.more_days' : 'ui.plan.schedule_advice.longer';
    warnings.unshift({ code: 'floor_schedule', key: 'warning.floor_schedule', args: { muscles: muscles.join(', '), advice, min: derived.session_minutes + Math.min(extra, 30) } });
    if (!offers.some(o => o.key === 'offer.more_days') && derived.days_per_week < MAX_DAYS) offers.push({ key: 'offer.more_days', args: { days: derived.days_per_week + 1 } });
  }
  return { weeks: weeksOut, athletic, warnings, offers: dedupeOffers(offers), block_targets: blockTargetsOut };
}

const TRACK_EARLY_RELEASE = true; // v1.2 (R2-PER-03): some dial moves every stairway week

function dedupeOffers(list) {
  const seen = new Set();
  return list.filter(o => { const k = o.key + JSON.stringify(o.args || {}); if (seen.has(k)) return false; seen.add(k); return true; });
}
