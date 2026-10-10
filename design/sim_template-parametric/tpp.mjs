// Template-Parametric Planner (TPP) - design-study prototype for design/design_template-parametric.md.
// NOT engine code. Reads model/rules.json and model/templates.json (read-only); writes nothing.
// It implements the core of the design on the coach's real templates:
//   skeleton from the template + explicit edit rules  ->  T1 lexicographic keep search (exact oracle)
//   ->  T4 smallest overrun  ->  exposures  ->  T5 leximin peak  ->  starts  ->  stairway (min-cost flow, design/research)
//   ->  closed-form weekly realization (R3-VOL-03 water-filling across days, VOL-07 inside a day)  ->  minutes per day.
// Units: time in TU = 1/20 min (integers), credit in quarter sets (integers). No clock, no randomness.
import fs from 'node:fs';
import { MinCostFlow } from '../research/mcf.mjs';
import { lambdaCurve } from '../research/proto_stairway_flow.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
export const rules = JSON.parse(fs.readFileSync(ROOT + 'model/rules.json', 'utf8'));
export const templates = JSON.parse(fs.readFileSync(ROOT + 'model/templates.json', 'utf8'));

// ------------------------------------------------------------------------------------------------ time model (DEF-09)
export const TU = 20;
export const tu = (m) => Math.round(m * TU);
export const mins = (t) => Math.round((t / TU) * 100) / 100;
const TM = rules.time_model;
const CO = tu(TM.changeover_min_per_exercise), COP = tu(TM.changeover_in_superset_pair);
export function setCost(tc, heavy = false) {
  const rc = heavy ? 'strength' : (TM.rest_class_by_time_class[tc] || 'hypertrophy');
  return { w: tu(TM.work_minutes[tc]), r: tu(TM.rest_class_minutes[rc]) };
}
const straight = (n, c) => (n > 0 ? n * (c.w + c.r) + CO : 0);
/** engine/timefit.mjs supersetMinutes: round k = the partners that still have a k-th set: their work + the longest rest */
function superset(members) {
  const act = members.filter((m) => m.n > 0);
  if (act.length < 2) return act.length ? straight(act[0].n, act[0].c) : 0;
  const rounds = Math.max(...act.map((m) => m.n));
  let t = 0;
  for (let k = 1; k <= rounds; k++) { const a = act.filter((m) => m.n >= k); t += a.reduce((s, m) => s + m.c.w, 0) + Math.max(...a.map((m) => m.c.r)); }
  return t + COP * act.length;
}

// ------------------------------------------------------------------------------------------------ credit (DEF-02, DEF-04)
const CREDIT_CLASS = { RP_BKD: 'BKD', RP_UKD: 'UKD', RP_BHD: 'BHD', RP_UHD: 'UHD', RP_HPUSH: 'HPUSH', RP_VPUSH: 'VPUSH', RP_HPULL: 'HPULL', RP_VPULL: 'VPULL',
  ISO_QUAD: 'LEG_EXTENSION', ISO_LEG_FLEXION: 'LEG_FLEXION', ISO_CHEST: 'ISO_CHEST', ISO_BICEP: 'ISO_BICEPS', ISO_TRICEP: 'ISO_TRICEPS', ISO_CALF: 'ISO_CALF' };
const GROUPS = rules.muscles.groups.order.filter((g) => g !== 'core');
function creditQ(bucket, variant) {
  const cls = bucket === 'ISO_SIDE_REAR_DELT' ? (variant === 'rear' ? 'ISO_REAR' : 'ISO_SIDE') : CREDIT_CLASS[bucket];
  const cr = rules.credit.classes[cls] || {};
  const out = {};
  for (const g of GROUPS) { let s = 0; for (const m of rules.muscles.groups.members[g]) s += cr[m] || 0; if (s > 0) out[g] = Math.min(4, Math.round(s * 4)); }
  return out;
}
const PCLASS = { RP_BKD: 'knee', RP_UKD: 'knee', ISO_QUAD: 'knee', RP_BHD: 'hip', RP_UHD: 'hip', ISO_LEG_FLEXION: 'hip', RP_HPULL: 'pull', RP_VPULL: 'pull',
  RP_HPUSH: 'push', RP_VPUSH: 'push', ISO_CHEST: 'push', ISO_BICEP: 'bicep', ISO_TRICEP: 'tricep', ISO_CALF: 'calf' };
const pclass = (bucket, variant) => (bucket === 'ISO_SIDE_REAR_DELT' ? (variant === 'rear' ? 'rear' : 'side') : PCLASS[bucket]);
const LEGAL = [['knee', 'pull'], ['hip', 'push'], ['bicep', 'rear'], ['tricep', 'side'], ['calf', 'rear'], ['calf', 'side'], ['rear', 'side']]; // rules.supersets.recommend.pairs
const legal = (a, b) => LEGAL.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const COMPOUND = new Set(['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD', 'RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL']);
// explicit add rule A-DEPTH: the 3rd / 4th exercise of a group on a day, in this order (first bucket not yet in the cell)
const EXPANSION = { quads: [['RP_UKD'], ['ISO_QUAD'], ['RP_BKD']], hips: [['RP_UHD'], ['ISO_LEG_FLEXION'], ['RP_BHD']], back: [['RP_VPULL'], ['RP_HPULL']],
  chest: [['ISO_CHEST'], ['RP_HPUSH']], shoulders: [['ISO_SIDE_REAR_DELT', 'side'], ['ISO_SIDE_REAR_DELT', 'rear'], ['RP_VPUSH']], biceps: [['ISO_BICEP']], triceps: [['ISO_TRICEP']], calves: [] };

// ------------------------------------------------------------------------------------------------ problem from a template
/**
 * cfg: { name, family, days, variant, weekdays:{dayType:weekday}, minutes, phi, level, N, blocks, G (growth of N),
 *        classModel, vol3Heavy, groups:{g:{F,S,C,mc}}, keep:[g], pattern:{enabled,buckets,max}, fixed:{weekday:[items]},
 *        room:[{id,day,label,items}], tests:{weekday:{week:minutes}}, athleteCap }
 */
export function buildProblem(cfg) {
  let tpl = templates.families[cfg.family].days[String(cfg.days)];
  if (cfg.variant) tpl = tpl.variants[cfg.variant];
  const maxC = rules.placement.max_sets_per_exercise[cfg.level], maxI = rules.placement.max_sets_isolation;
  const days = [], cells = new Map();
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (const wd of order) {
    const lay = tpl.week_layout[wd];
    if (!lay || lay.kind !== 'main') continue;
    const dt = tpl.day_types[lay.day_type];
    days.push({ id: wd, type: lay.day_type, label: dt.label });
    dt.stations.forEach((s, idx) => {
      if (!s.group || !['strength', 'accessories'].includes(s.block)) return;
      const b = templates.buckets[s.bucket];
      const gated = s.include_from_minutes != null && s.include_from_minutes > cfg.minutes;
      const key = s.group + '@' + wd;
      if (!cells.has(key)) cells.set(key, { key, g: s.group, day: wd, slots: [], gatedSlots: [] });
      const isCalf = s.bucket === 'ISO_CALF', comp = COMPOUND.has(s.bucket);
      const classLift = !!cfg.classModel && s.role === 'work';
      const workMin = s.role === 'work' && cfg.minutes >= rules.placement.work_min_sets_from_minutes ? rules.placement.work_min_sets : 2;
      const slot = { id: s.id, day: wd, g: s.group, bucket: s.bucket, variant: s.variant || null, role: s.role, tc: b.time_class, ord: idx,
        min: classLift ? s.sets_hint[0] : isCalf ? rules.volume.calves.per_leg_day[cfg.level] : workMin, max: classLift ? s.sets_hint[0] : isCalf ? maxI : comp ? maxC : maxI,
        fixed: classLift, tag: s.pair || s.superset || null, cq: creditQ(s.bucket, s.variant), pc: pclass(s.bucket, s.variant), expansion: false };
      (gated ? cells.get(key).gatedSlots : cells.get(key).slots).push(slot);
    });
  }
  for (const c of cells.values()) {
    const isCalf = c.g === 'calves';
    c.kmin = isCalf ? 1 : 2;                                       // never 1 exercise (T0-SES-10); a template's 3rd / 4th station of a group opens by need (A-DEPTH)
    c.kmax = isCalf ? 1 : 4;
    let j = 0;
    const lastOrd = Math.max(...c.slots.concat(c.gatedSlots).map((s) => s.ord));
    for (const s of c.gatedSlots) { if (c.slots.length >= c.kmax) break; c.slots.push({ ...s, expansion: true }); }
    while (c.slots.length < c.kmax) {                                // A-DEPTH expansion slots
      const ex = EXPANSION[c.g]; if (!ex.length) break;
      const pick = ex.find(([b, v]) => !c.slots.some((s) => s.bucket === b && (s.variant || null) === (v || null))) || ex[ex.length > 1 ? 1 : 0];
      const [bucket, variant] = pick; const b = templates.buckets[bucket]; const comp = COMPOUND.has(bucket);
      c.slots.push({ id: `${c.key}.x${++j}`, day: c.day, g: c.g, bucket, variant: variant || null, role: 'added', tc: b.time_class, ord: lastOrd + 0.1 * j,
        min: 2, max: comp ? maxC : maxI, fixed: false, tag: null, cq: creditQ(bucket, variant), pc: pclass(bucket, variant), expansion: true });
    }
    delete c.gatedSlots;
    c.lo = (k) => c.slots.slice(0, k).reduce((a, s) => a + s.min, 0);
    c.hi = (k) => Math.min(cfg.perSession || rules.volume.per_session.soft, c.slots.slice(0, k).reduce((a, s) => a + s.max, 0));   // T5-CAP-05: 11 sets of a group in a session
    c.values = []; for (let n = c.lo(c.kmin); n <= c.hi(c.kmax); n++) c.values.push(n);
    c.classSlot = c.slots.find((s) => s.fixed) || null;
    const dt = tpl.day_types[days.find((d) => d.id === c.day).type];
    c.lead = c.slots[0].role === 'work';                                                           // the day is this group's work-lift day
    const w = dt.stations.find((x) => x.role === 'work' && x.pair && x.pair === c.slots[0].tag && x.group !== c.g);
    c.pairedTo = w ? w.group : null;                                                               // the lift paired with the day's work lift (UNI-11)
  }
  const P = { cfg, tpl, days, cells, dayIds: days.map((d) => d.id) };
  P.cellsOf = (g) => [...cells.values()].filter((c) => c.g === g).sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));
  P.cellsByDay = {}; for (const d of days) P.cellsByDay[d.id] = [...cells.values()].filter((c) => c.day === d.id).sort((a, b) => cfg.keep.indexOf(a.g) - cfg.keep.indexOf(b.g));
  // "a day fits L minutes" is read on the printed whole minutes: round(minutes) <= L, i.e. minutes < L + 0.5 (9 TU = 0.45 min)
  P.mu = tu(cfg.minutes) + 9; P.band = tu(Math.floor(cfg.minutes * cfg.phi + 1e-9)) + 9;
  P.stats = { evals: 0, nodes: 0, searches: 0 };
  return P;
}
export const depthFor = (c, n) => { for (let k = c.kmin; k <= c.kmax; k++) if (c.hi(k) >= n) return k; return null; };
/** VOL-07 inside a day: the first exercise (session order) below the first one's sets takes the next set, else the first */
export function realizeCell(c, n, k) {
  const sl = c.slots.slice(0, k), x = sl.map((s) => s.min);
  let r = n - x.reduce((a, b) => a + b, 0);
  if (r < 0) return null;
  const adj = sl.map((s, i) => i).filter((i) => !sl[i].fixed);
  while (r > 0) {
    const first = adj.find((i) => x[i] < sl[i].max); if (first === undefined) return null;
    const ref = x[adj[0]];
    let i = adj.find((j) => x[j] < ref && x[j] < sl[j].max);
    if (i === undefined) i = first;
    x[i]++; r--;
  }
  return sl.map((s, i) => ({ slot: s, n: x[i] }));
}

// ------------------------------------------------------------------------------------------------ evaluation (one function for solver and scorer)
/**
 * Minutes of the fixed blocks of a day. Test-week swap rule: on a test day in a test week the test minutes are added (a quality test
 * already replaces the station of that quality) and the day's room items are skipped that week. regular = true: the same week without its tests.
 */
function fixedTU(P, day, week, S, regular = false) {
  let t = 0;
  for (const it of P.cfg.fixed[day] || []) t += itemTU(it);
  const tst = !regular && (P.cfg.tests || {})[day] && P.cfg.tests[day][week] ? tu(P.cfg.tests[day][week]) : 0;
  if (!tst) for (const r of P.cfg.room || []) if (r.day === day && S.room[r.id]) for (const it of r.items) t += itemTU(it);
  return t + tst;
}
function itemTU(it) {
  if (it.minutes != null) return tu(it.minutes);
  if (it.pair) return superset(it.pair.map((m) => ({ n: m.sets, c: setCost(m.tc) })));   // e.g. the core opener: 2 exercises x 2 sets, back to back
  if (it.inRest) return it.sets * setCost(it.tc).w;                                       // joint care inside the rests (rules.prehab r2_status, E-175)
  return straight(it.sets, setCost(it.tc));
}
/** minutes of one day. cellVal(key) -> {n, k} | undefined;  opts.ss: 'all' | Set of pair keys */
export function evalDay(P, S, d, cellVal, week, opts = {}) {
  P.stats.evals++;
  const heavy = (s) => (P.cfg.heavy ? P.cfg.heavy(s, week) : false);
  const act = [];
  for (const c of P.cellsByDay[d]) {
    const v = cellVal(c.key);
    if (v && v.n > 0) for (const a of realizeCell(c, v.n, v.k)) act.push(a);
    else if (c.classSlot) act.push({ slot: c.classSlot, n: c.classSlot.min });        // the class lift stays (T1-POL-08)
  }
  for (const p of S.pattern || []) if (p.day === d) act.push({ slot: p.slot, n: p.slot.min, pattern: true });
  act.sort((a, b) => a.slot.ord - b.slot.ord);
  const fx = fixedTU(P, d, week, S, !!opts.regular); let t = fx;
  // pairs: template tags first, then the legal-pair matcher in session order (knee + pull, hip + push, small isolations)
  const used = new Set(), pairs = [];
  const tags = {}; for (const a of act) if (a.slot.tag) (tags[a.slot.tag] = tags[a.slot.tag] || []).push(a);
  for (const m of Object.values(tags)) if (m.length >= 2) { pairs.push(m); m.forEach((a) => used.add(a)); }
  for (const a of act) { if (used.has(a)) continue; const b = act.find((x) => x !== a && !used.has(x) && legal(a.slot.pc, x.slot.pc)); if (b) { pairs.push([a, b]); used.add(a); used.add(b); } }
  const outPairs = pairs.map((m) => ({ key: m.map((a) => a.slot.id).join('+'), members: m }));
  for (const p of outPairs) {
    const on = opts.ss === undefined || opts.ss === 'all' || opts.ss.has(p.key);
    const mem = p.members.map((a) => ({ n: a.n, c: setCost(a.slot.tc, heavy(a.slot)) }));
    t += on ? superset(mem) : mem.reduce((x, m) => x + straight(m.n, m.c), 0);
  }
  for (const a of act) if (!used.has(a)) t += straight(a.n, setCost(a.slot.tc, heavy(a.slot)));
  return { t, r: t - fx, act, pairs: outPairs };
}
/** minutes of every main day and credited sets per group.  dist: Map cellKey -> {n, k} (k = the block's depth, fixed by the peak) */
export function evaluate(P, S, dist, week, opts = {}) {
  const out = { min: {}, Q: {}, direct: {}, slots: {}, pairs: {}, exercises: {} };
  for (const g of GROUPS) { out.Q[g] = 0; out.direct[g] = 0; }
  for (const [key, v] of dist) if (v.n > 0) out.direct[P.cells.get(key).g] += v.n;
  for (const d of P.dayIds) {
    const r = evalDay(P, S, d, (k) => dist.get(k), week, opts);
    out.min[d] = r.t; out.slots[d] = r.act; out.pairs[d] = r.pairs; out.exercises[d] = r.act.length;
    for (const a of r.act) for (const [g, q] of Object.entries(a.slot.cq)) out.Q[g] += q * a.n;
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ week 1 of a peak distribution
const DONOR_ORDER = ['quads', 'back', 'chest', 'hips', 'shoulders', 'calves', 'biceps', 'triceps'];
function waterFill(P, g, from, caps, total) {      // R3-VOL-03: the exposure that is behind takes the set; ties: the earlier day
  const cs = P.cellsOf(g).filter((c) => caps.get(c.key) && caps.get(c.key).n > 0);
  const cur = new Map(cs.map((c) => [c.key, from.get(c.key)]));
  let have = [...cur.values()].reduce((a, b) => a + b, 0);
  while (have < total) {
    let best = null;
    for (const c of cs) if (cur.get(c.key) < caps.get(c.key).n && (best === null || cur.get(c.key) - from.get(c.key) < cur.get(best.key) - from.get(best.key))) best = c;
    if (!best) return null;
    cur.set(best.key, cur.get(best.key) + 1); have++;
  }
  return cur;
}
/** every exercise of the block at its minimum, then the floors by credited sets (donors first): the lowest week 1 the peak allows */
function weekOne(P, S, peak, full) {
  const lo = new Map(), d1 = new Map();
  for (const [key, v] of peak) if (v.n > 0) { const c = P.cells.get(key); lo.set(key, c.lo(v.k)); d1.set(key, { n: c.lo(v.k), k: v.k }); }
  const tot = (g) => P.cellsOf(g).reduce((a, c) => a + (d1.get(c.key) ? d1.get(c.key).n : 0), 0);
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (const g of DONOR_ORDER) {
      if (!full.includes(g)) continue;
      const F = P.cfg.groups[g].F * 4;
      for (;;) {
        const ev = evaluate(P, S, d1, 1);
        if (ev.Q[g] >= F) break;
        const nx = waterFill(P, g, lo, peak, tot(g) + 1);          // always dealt from the minimums: a function of the total only
        if (!nx) return null;
        for (const [k, n] of nx) d1.set(k, { n, k: d1.get(k).k });
        changed = true;
      }
    }
    if (!changed) break;
  }
  const a = {}; for (const g of full) a[g] = tot(g);
  return { d1, a, lo };
}
export const athleticCounted = (P, d, S) => ((P.cfg.athleticCountedBase || {})[d] || 0) + (P.cfg.room || []).filter((r) => r.day === d && S.room[r.id]).reduce((a, r) => a + (r.counted || 0), 0);

// ------------------------------------------------------------------------------------------------ the oracle: does a peak point exist?
const maxHelperQ = (P, g) => { // optimistic helper credit a group can receive from the others (bounds only)
  let x = 0; for (const c of P.cells.values()) if (c.g !== g) for (const s of c.slots) if (s.cq[g]) x += s.cq[g] * s.max; return x;
};
/** quarter-set credit to g that is in the week whatever happens: the class lifts of the other groups and the minimum sets of the cells that are on */
function guaranteedQ(P, S, full, isOn /* (cell) -> true | false | null (free) */) {
  const out = {};
  for (const g of full) {
    let x = 0;
    for (const pt of S.pattern || []) if (pt.g !== g && pt.slot.cq[g]) x += pt.slot.cq[g] * pt.slot.min;                       // kept movement stations
    for (const c of P.cells.values()) if (c.g !== g && c.classSlot && c.classSlot.cq[g]) x += c.classSlot.cq[g] * c.classSlot.min;
    for (const h of full) {
      if (h === g) continue;
      let sure = 0, least = Infinity;
      for (const c of P.cellsOf(h)) {
        const on = isOn(c); if (on === false) continue;
        let y = 0; for (const sl of c.slots.slice(0, c.kmin)) if (!sl.fixed && sl.cq[g]) y += sl.cq[g] * sl.min;
        if (on === true) sure += y; else least = Math.min(least, y);
      }
      x += sure > 0 ? sure : least < Infinity ? least : 0;       // a trained donor is on at least one of its days
    }
    out[g] = x;
  }
  return out;
}
/**
 * Exact day-layered search (a dynamic programme over the days with memoised partial sums).
 * q.allow: Map cellKey -> allowed values, ascending ([0] = the group is not on that day; no 0 = it must be on that day);
 * q.target: null = the minimum point (each group at max(direct floor, base) + minimum climb for its exposure) | {g: total} exact totals;
 * q.caps[d]: the day limit in the peak week, every eligible pair supersetted;  q.Gq: guaranteed helper credit (quarters) or null.
 * A point is accepted when every FULL group has: its total;  total - base >= minimum climb (base = every exercise of the block at its
 * minimum sets);  (total - climb) + guaranteed credit >= floor;  and every day fits its limit and the 12 + 2 cap.
 * Returns Map cellKey -> {n, k} or null. null is a proof: the search is exhaustive (no budget is read as "does not fit").
 */
export function exists(P, S, full, q) {
  P.stats.searches++;
  const N = P.cfg.N, D = P.dayIds.length, n = full.length, gi = new Map(full.map((g, i) => [g, i]));
  const allowOf = (c) => q.allow.get(c.key) || [0];
  const dayCells = P.dayIds.map((d) => P.cellsByDay[d].filter((c) => gi.has(c.g)));
  const lastIdx = full.map(() => -1);
  dayCells.forEach((cs, i) => cs.forEach((c) => { if (allowOf(c).some((v) => v > 0)) lastIdx[gi.get(c.g)] = i; }));
  if (lastIdx.some((x) => x < 0)) return null;
  const G0 = q.Gq || guaranteedQ(P, S, full, (c) => { const a = allowOf(c); return a.length === 1 && a[0] === 0 ? false : a[0] > 0 ? true : null; });
  const Gq = full.map((g) => (G0[g] || 0) + (q.optimistic ? maxHelperQ(P, g) : 0));
  const own = full.map((g) => { const c = P.cellsOf(g).find((x) => x.classSlot); return c ? (c.classSlot.cq[g] || 0) * c.classSlot.min : 0; });   // the group's own class lift when its cell is off
  const mc = full.map((g) => P.cfg.groups[g].mc), F4 = full.map((g) => P.cfg.groups[g].F * 4);
  const z = new Array(n).fill(0), base = new Array(n).fill(0), con = new Array(n).fill(0);
  const needOf = (j) => Math.max(Math.ceil((F4[j] - Gq[j] - (con[j] ? 0 : own[j])) / 4), base[j]) + mc[j];
  const Cmax = full.map((g) => P.cfg.groups[g].C);                                                   // T5-CAP-01: direct sets never above the ceiling
  const done = (j) => { const T = q.target ? q.target[full[j]] : needOf(j); return z[j] > 0 && z[j] === T && z[j] <= Cmax[j] && z[j] - base[j] >= mc[j] && 4 * (z[j] - mc[j]) + Gq[j] + (con[j] ? 0 : own[j]) >= F4[j]; };
  const upper = full.map((g, j) => Math.min(Cmax[j], q.target ? q.target[g] : Math.max(Math.ceil((F4[j] - Gq[j]) / 4), P.cellsOf(g).reduce((a, c) => a + (allowOf(c).some((v) => v > 0) ? c.lo(c.kmax) : 0), 0)) + mc[j]));
  const heavy = (sl) => (P.cfg.heavy ? P.cfg.heavy(sl, N) : false);
  // a valid lower bound of a slot's minutes whatever it is paired with: its work, a pair changeover and half of its rest (a pair shares one rest)
  const partnerable = new Map();
  const canPair = (sl) => {
    let r = partnerable.get(sl.id); if (r !== undefined) return r;
    const others = [];
    for (const c of P.cellsByDay[sl.day]) { if (gi.has(c.g) ? allowOf(c).some((v) => v > 0) : false) others.push(...c.slots); if (c.classSlot) others.push(c.classSlot); }
    for (const x of S.pattern || []) if (x.day === sl.day) others.push(x.slot);
    r = others.some((o) => o !== sl && o.id !== sl.id && ((sl.tag && o.tag === sl.tag) || legal(sl.pc, o.pc)));
    partnerable.set(sl.id, r); return r;
  };
  const lbSlot = (sl, k) => { const co = setCost(sl.tc, heavy(sl)); return canPair(sl) ? k * co.w + COP + Math.floor((k * co.r) / 2) : k * (co.w + co.r) + CO; };
  const infoCache = new Map();
  const info = (c, v) => {
    const key = c.key + '#' + v; let r = infoCache.get(key); if (r) return r;
    if (v === 0) r = { k: c.classSlot ? 1 : 0, base: 0, lb: c.classSlot ? lbSlot(c.classSlot, c.classSlot.min) : 0 };
    else { const k = depthFor(c, v); r = { k, base: c.lo(k), lb: realizeCell(c, v, k).reduce((t, a) => t + lbSlot(a.slot, a.n), 0) }; }
    infoCache.set(key, r); return r;
  };
  { // quick proof of "does not fit": the sets every group needs cost more minutes than the week has (SF-6)
    let room = 0; for (const d of P.dayIds) room += Math.max(0, q.caps[d] - fixedTU(P, d, N, S, true));
    let need = 0;
    for (let j = 0; j < n; j++) {
      const cs = P.cellsOf(full[j]).filter((c) => allowOf(c).some((v) => v > 0));
      const per = Math.min(...cs.flatMap((c) => c.slots.filter((sl) => !sl.fixed).map((sl) => lbSlot(sl, 1) - COP)));
      const T = q.target ? q.target[full[j]] : Math.max(Math.ceil((F4[j] - Gq[j] - own[j]) / 4), 0) + mc[j];
      need += Math.max(0, T) * per;
    }
    if (need > room) return null;
  }
  // value order of a cell: the even share of the group's target first, then outwards; "not on this day" last
  const share = full.map((g, j) => { const cs = P.cellsOf(g).filter((c) => allowOf(c).some((v) => v > 0)).length; return Math.round(upper[j] / Math.max(1, cs)); });
  const ordCache = new Map();
  const ordered = (c, j) => { let o = ordCache.get(c.key); if (!o) { o = allowOf(c).slice().sort((x, y) => (x === 0) - (y === 0) || Math.abs(x - share[j]) - Math.abs(y - share[j]) || x - y); ordCache.set(c.key, o); } return o; };
  const pick = new Map(), dead = new Set();
  const sig = full.join(',') + '/' + Object.keys(S.room || {}).filter((k) => S.room[k]).join(',') + '/' + (S.pattern || []).map((x) => x.slot.id).join(',') + '/';
  P._dayCache ??= new Map();
  // remaining reach of a group over the later days (largest / smallest values its later cells can add)
  const remHi = full.map(() => new Array(D + 2).fill(0)), remLo = full.map(() => new Array(D + 2).fill(0));
  for (let i = D - 1; i >= 0; i--) for (let j = 0; j < n; j++) {
    const c = dayCells[i].find((x) => x.g === full[j]); const a = c ? allowOf(c) : [0];
    remHi[j][i] = remHi[j][i + 1] + Math.max(...a); remLo[j][i] = remLo[j][i + 1] + Math.min(...a);
  }
  const perSet = full.map((g) => Math.min(...P.cellsOf(g).filter((c) => allowOf(c).some((v) => v > 0)).flatMap((c) => c.slots.filter((sl) => !sl.fixed).map((sl) => lbSlot(sl, 1) - (canPair(sl) ? COP : CO)))));
  const roomFrom = new Array(D + 1).fill(0); for (let i = D - 1; i >= 0; i--) roomFrom[i] = roomFrom[i + 1] + Math.max(0, q.caps[P.dayIds[i]] - fixedTU(P, P.dayIds[i], N, S, true));
  const dfsDay = (i) => {
    if (i === D) return true;
    if (q.target) { let need = 0; for (let j = 0; j < n; j++) need += Math.max(0, q.target[full[j]] - z[j]) * perSet[j]; if (need > roomFrom[i]) return false; }
    let key = String(i); for (let j = 0; j < n; j++) if (lastIdx[j] >= i) key += '|' + z[j] + ',' + base[j] + ',' + con[j];
    if (dead.has(key)) return false;
    const d = P.dayIds[i], cells = dayCells[i], fxR = fixedTU(P, d, N, S, true), fxT = fixedTU(P, d, N, S), cap = q.caps[d], fx = Math.max(fxR, fxT - (P.band - cap));
    const exCap = P.cfg.athleteCap ? P.cfg.athleteCap - athleticCounted(P, d, S) - (S.pattern || []).filter((x) => x.day === d).length : Infinity;
    const rec = (ci, lb, nex) => {
      P.stats.nodes++;
      if (ci === cells.length) {
        const ck = sig + d + ':' + cells.map((c) => (pick.get(c.key) ? pick.get(c.key).n : 0)).join(',');
        let e = P._dayCache.get(ck); if (!e) { e = evalDay(P, S, d, (k) => pick.get(k), N, { regular: true }); e = { t: e.t, r: e.r }; P._dayCache.set(ck, e); }
        return e.t <= cap && e.r + fxT <= P.band && dfsDay(i + 1);
      }
      const c = cells[ci], j = gi.get(c.g), last = lastIdx[j] === i;
      for (const v of ordered(c, j)) {
        const inf = info(c, v);
        if (z[j] + v > upper[j]) continue;
        if (q.target && (z[j] + v + remHi[j][i + 1] < q.target[full[j]] || z[j] + v + remLo[j][i + 1] > q.target[full[j]])) continue;   // the later days cannot close the gap
        if (fx + lb + inf.lb > cap) continue;
        if (nex + inf.k > exCap) continue;
        z[j] += v; base[j] += inf.base; if (v > 0 && c.classSlot) con[j] = 1;
        let ok = !last || done(j);
        if (ok) { if (v > 0) pick.set(c.key, { n: v, k: inf.k }); else pick.delete(c.key); ok = rec(ci + 1, lb + inf.lb, nex + inf.k); }
        z[j] -= v; base[j] -= inf.base; if (v > 0 && c.classSlot) con[j] = 0;
        if (ok) return true;
      }
      pick.delete(c.key);
      return false;
    };
    const ok = rec(0, 0, 0);
    if (!ok) dead.add(key);
    return ok;
  };
  return dfsDay(0) ? new Map(pick) : null;
}

// ------------------------------------------------------------------------------------------------ the stairway over the weeks
/**
 * Which week each added whole set lands in: a min-cost flow (integral, exact), after design/research/proto_stairway_flow.mjs.
 * Hard: every line monotone and on its peak in week N; a line rises at most max(1, floor(7 %)) a week (T0-STW-02);
 *       the weekly total rises by at most max(1, ceil(10 % of the week-1 total) - 1) sets: strictly below +10 % of any earlier week,
 *       because totals only grow (T0-STW-03; tot1 counts every resistance set of week 1, fixed class lifts and kept stations included).
 * Lexicographic by cost size (landing = 'first', the default): (1) each line's last set lands in the last week (R3-VOL-04),
 *       (2) no flat week in the total, (3) weekly steps follow the 3 % / 5 % stairway, (4) each set lands near the week its planned
 *       curve reaches it. landing = 'after_never_flat' swaps 1 and 2: a line lands early only when that removes a flat week.
 */
export function stairway(lines, N, tot1, landing = 'first') {
  const MISS = landing === 'first' ? 20000 : 6000;
  const L = lines.map((l) => ({ ...l, ...lambdaCurve(l.S, l.C, N) }));
  const crossing = (T, S0, k) => { const lv = S0 + k; for (let w = 1; w < T.length; w++) if (T[w] >= lv - 1e-9) return w + (lv - T[w - 1]) / Math.max(1e-9, T[w] - T[w - 1]); return T.length; };
  const units = [];
  L.forEach((l, li) => { for (let k = 1; k <= l.P - l.S; k++) units.push({ li, k, t: crossing(l.T, l.S, k), last: k === l.P - l.S }); });
  const cumIdeal = (w) => L.reduce((x, l) => x + (l.T[w - 1] - l.S), 0);
  const Dw = [0, 0]; for (let w = 2; w <= N; w++) Dw.push(Math.floor(cumIdeal(w) + 0.5) - Math.floor(cumIdeal(w - 1) + 0.5));
  const tcap = Math.max(1, Math.ceil(0.10 * tot1 - 1e-9) - 1);
  let id = 0; const SRC = id++, SNK = id++;
  const U = units.map(() => id++);
  const Gn = L.map(() => { const x = []; for (let w = 0; w <= N; w++) x.push(id++); return x; });
  const Wn = []; for (let w = 0; w <= N; w++) Wn.push(id++);
  const f = new MinCostFlow(id), arcs = [];
  units.forEach((u, ui) => {
    f.addEdge(SRC, U[ui], 1, 0);
    const x = [];
    for (let w = 2; w <= N; w++) x.push([w, f.addEdge(U[ui], Gn[u.li][w], 1, (u.last && w !== N ? MISS + 50 * (N - w) : 0) + Math.round(100 * Math.abs(w - u.t)))]);
    arcs.push(x);
  });
  for (let w = 2; w <= N; w++) {
    L.forEach((l, li) => f.addEdge(Gn[li][w], Wn[w], Math.max(1, Math.floor(0.07 * l.T[w - 2] + 1e-9)), 0));
    f.addEdge(Wn[w], SNK, 1, -10000);                                              // never flat
    const free = Math.min(tcap, Math.max(1, Dw[w])) - 1;
    if (free > 0) f.addEdge(Wn[w], SNK, free, 0);                                  // the planned 3 % / 5 % step
    if (tcap - 1 - free > 0) f.addEdge(Wn[w], SNK, tcap - 1 - free, 300);          // past the planned step, never past the limit
  }
  const res = f.run(SRC, SNK, units.length);
  if (res.flow !== units.length) throw new Error(`stairway: placed ${res.flow} of ${units.length} sets`);
  const weeksOf = L.map(() => []);
  units.forEach((u, ui) => { for (const [w, e] of arcs[ui]) if (f.flowOn(e) === 1) weeksOf[u.li].push(w); });
  return { sched: L.map((l, li) => { const x = []; for (let w = 1; w <= N; w++) x.push(l.S + weeksOf[li].filter((v) => v <= w).length); return x; }) };
}

// ------------------------------------------------------------------------------------------------ the planner
export function plan(P, log = () => {}) {
  const cfg = P.cfg, N = cfg.N;
  const hasCells = (g) => P.cellsOf(g).length > 0;
  const patOK = (g) => cfg.pattern && cfg.pattern.enabled && cfg.pattern.buckets[g] && !cfg.classModel;
  // keep list: groups in the coach's keep order (levels FULL > PATTERN > NONE); then the overrun; then the room items in keep priority
  const keepables = cfg.keep.map((g) => ({ kind: 'group', g }));          // room items come after the overrun (below): they may never add overrun
  // the fit band (the coach's "a little longer day", R2-SES-05) is spent on group states only: FULL minimums and kept movement
  // patterns (cfg.patternInBand, default true = T1-POL-02 as filed). Room items and every set above the minimum must fit the chosen minutes.
  const patBand = cfg.patternInBand !== false;
  const capsFor = (S) => { const c = {}; for (const d of P.dayIds) { const optional = (cfg.room || []).some((r) => r.day === d && S.room[r.id]) || (!patBand && (S.pattern || []).some((p) => p.day === d)); c[d] = optional ? P.mu : P.band; } return c; };
  const testTU = (d, week) => ((cfg.tests || {})[d] && cfg.tests[d][week] ? tu(cfg.tests[d][week]) : 0);
  // tests are T0: on a test day the regular content keeps its cap and the test minutes ride on top, never past the band
  const testCaps = (c, week) => { const o = { ...c }; for (const d of P.dayIds) o[d] = Math.min(P.band, c[d] + testTU(d, week)); return o; };
  const fullOf = (S) => cfg.keep.filter((g) => S.state[g] === 'FULL');
  // explicit rule R-LEAD: a trained group stays on its work-lift day(s); calves are on every leg day (T0-SES-11); other days are free
  const freeAllow = (full) => { const m = new Map(); for (const g of full) for (const c of P.cellsOf(g)) m.set(c.key, g === 'calves' || c.lead ? c.values : [0].concat(c.values)); return m; };
  const memo = new Map();
  const feasible = (S, optimistic) => {
    const full = fullOf(S);
    const key = JSON.stringify([S.state, S.room, (S.pattern || []).map((p) => p.g + p.day), !!optimistic]);
    if (memo.has(key)) return memo.get(key);
    const r = exists(P, S, full, { allow: freeAllow(full), target: null, caps: capsFor(S), optimistic });
    memo.set(key, r); return r;
  };
  const patternSlots = (g) => {           // one 2-set station of the group's movement: its own work lift (the day keeps its identity), else the rule bucket
    const out = [];
    for (const d of P.days) {
      const dt = P.tpl.day_types[d.type];
      const own = dt.stations.find((x) => x.group === g && x.role === 'work');
      const st = own || dt.stations.find((x) => x.bucket === cfg.pattern.buckets[g]);
      if (!st) continue;
      const b = templates.buckets[st.bucket];
      const paired = !!dt.stations.find((x) => x.role === 'work' && x.pair && x.pair === st.pair && x !== st);
      out.push({ g, day: d.id, rank: own ? 0 : paired ? 1 : 2, slot: { id: 'pat.' + st.id, day: d.id, g, bucket: st.bucket, variant: null, role: 'pattern', tc: b.time_class, ord: dt.stations.indexOf(st) + 0.05, min: cfg.pattern.sets, max: cfg.pattern.sets, fixed: true, tag: st.pair || null, cq: creditQ(st.bucket, st.variant), pc: pclass(st.bucket, null) } });
    }
    return out.sort((x, y) => x.rank - y.rank);
  };
  // ---- phase 1 (T1): lexicographic maximum of the keep vector: best-first depth-first search, exact oracle at the leaves,
  //      an optimistic oracle (maximum helper credit, later keepables absent) as the bound inside the tree
  const cmp = (a, b) => { for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; };
  const rank = { FULL: 3, PATTERN: 1, NONE: 0 };
  const assignedStates = (st, i) => { const o = {}; keepables.slice(0, i + 1).forEach((k) => { if (k.kind === 'group' && st[k.g]) o[k.g] = st[k.g]; }); return o; };
  const best1 = (i, S, key) => {
    if (i === keepables.length) { const r = feasible(S, false); return r ? { key: key.slice(), state: { ...S.state }, room: { ...S.room }, pattern: S.pattern.slice() } : null; }
    const kp = keepables[i];
    const g = kp.g;
    const levels = !hasCells(g) ? ['NONE'] : patOK(g) ? ['FULL', 'PATTERN', 'NONE'] : ['FULL', 'NONE'];
    for (const lv of levels) {
      S.state[g] = lv;
      if (lv === 'PATTERN') {
        if (S.pattern.length >= cfg.pattern.max) continue;
        let bestR = null;
        for (const ps of patternSlots(g)) {
          S.pattern.push(ps);
          if (feasible({ state: assignedStates(S.state, i), room: {}, pattern: S.pattern }, true)) { key.push(rank[lv]); const r = best1(i + 1, S, key); key.pop(); if (r && (!bestR || cmp(r.key, bestR.key) > 0)) bestR = r; }
          S.pattern.pop();
        }
        if (bestR) return bestR; continue;
      }
      if (lv === 'FULL' && !feasible({ state: assignedStates(S.state, i), room: {}, pattern: S.pattern }, true)) continue;
      key.push(rank[lv]); const r = best1(i + 1, S, key); key.pop(); if (r) return r;
    }
    delete S.state[g]; return null;
  };
  const t1 = best1(0, { state: {}, room: {}, pattern: [] }, []);
  if (!t1) throw new Error('no plan satisfies T0 (refer / remove a block)');
  const S = { state: t1.state, room: t1.room, pattern: t1.pattern };
  const full = fullOf(S);
  log(`T1 keep vector: ${cfg.keep.map((g) => g + '=' + S.state[g]).join(', ')}; kept movement stations: ${S.pattern.map((p) => p.g + '@' + p.day).join(', ') || '-'}`);

  // ---- phase 2 (T4): the smallest uniform overrun delta the group states need; then the room items in keep priority: a room item
  //      stays only if its day fits the chosen minutes and no day needs more than delta (room never adds overrun); then the exposures
  const allow = freeAllow(full);
  let target = null, GqX = null, capsNow = null;
  const ask = (caps) => exists(P, S, full, { allow, target, caps, Gq: GqX });
  const withDelta = (dl) => { const c0 = capsFor(S), c = {}; for (const d of P.dayIds) c[d] = Math.min(c0[d], P.mu + dl); return c; };
  let lo = 0, hi = P.band - P.mu;
  if (ask(withDelta(0))) hi = 0; else { while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ask(withDelta(mid))) hi = mid; else lo = mid; } }
  const delta = hi;
  for (const r of cfg.room || []) { S.room[r.id] = 1; if (!ask(withDelta(delta))) S.room[r.id] = 0; }
  const capsMin = withDelta(delta);
  log(`room items: ${(cfg.room || []).map((r) => r.id + '=' + (S.room[r.id] ? 'on' : 'off')).join(', ') || '-'}`);
  // exposures, in keep order: first the lifts paired with an active work lift (the day keeps its pair, UNI-11), then the other days
  const active = (h) => S.state[h] === 'FULL' || !!cfg.classModel || S.pattern.some((x) => x.g === h);
  const cellOrder = [];
  for (const pass of [0, 1]) for (const g of full) for (const c of P.cellsOf(g)) { if (g === 'calves' || c.lead) continue; const paired = c.pairedTo && active(c.pairedTo); if ((pass === 0) === !!paired) cellOrder.push({ c }); }
  for (const { c } of cellOrder) { allow.set(c.key, c.values); if (!ask(capsMin)) allow.set(c.key, [0]); }
  const cellsOn = {}; for (const g of full) cellsOn[g] = P.cellsOf(g).filter((c) => allow.get(c.key)[0] !== 0);
  GqX = guaranteedQ(P, S, full, (c) => allow.get(c.key)[0] !== 0);            // the exposures are known: the guaranteed credit is now exact
  const canonical = (caps, totals) => {   // pins the distributions in keep order (fewest exercises, most even, the earlier day takes the odd set); one oracle call a pin
    target = totals;
    const saveAll = new Map(allow);
    for (const g of full) {
      const cs = cellsOn[g], opts = [];
      const rec = (i, cur, sum) => { if (i === cs.length) { if (sum === totals[g]) opts.push(cur.slice()); return; } for (const v of cs[i].values) { if (sum + v > totals[g]) break; cur.push(v); rec(i + 1, cur, sum + v); cur.pop(); } };
      rec(0, [], 0);
      const score = (v) => ({ nEx: v.reduce((a, x, i) => a + depthFor(cs[i], x), 0), imb: Math.max(...v) - Math.min(...v), early: v.map((x) => String(99 - x).padStart(2, '0')).join('') });
      opts.sort((x, y) => { const a = score(x), b = score(y); return a.nEx - b.nEx || a.imb - b.imb || (a.early < b.early ? -1 : a.early > b.early ? 1 : 0); });
      for (const v of opts) { const save = cs.map((c) => allow.get(c.key)); cs.forEach((c, i) => allow.set(c.key, [v[i]])); if (ask(caps)) break; cs.forEach((c, i) => allow.set(c.key, save[i])); }
    }
    const r = ask(caps);
    allow.clear(); for (const [k, v] of saveAll) allow.set(k, v);
    target = null;
    return r;
  };
  const totalsOf = (dist) => { const t = {}; for (const g of full) t[g] = P.cellsOf(g).reduce((a, c) => a + (dist.get(c.key) ? dist.get(c.key).n : 0), 0); return t; };
  const zmin = totalsOf(ask(capsMin));
  const minDist = canonical(capsMin, zmin);
  const mMin = evaluate(P, S, minDist, N, { regular: true }).min;        // the peak week without its tests
  log(`T4 smallest overrun at the minimum point: ${mins(delta)} min; minimum-point minutes ${P.dayIds.map((d) => d + ' ' + mins(mMin[d])).join(', ')}`);
  log(`exposures: ${full.map((g) => g + ' {' + cellsOn[g].map((c) => c.day).join(',') + '}').join('  ')};  minimum point (direct sets): ${full.map((g) => g + ' ' + zmin[g]).join(', ')}`);

  // ---- phase 3 (T5): leximin of the peak shortfall on the fixed skeleton; sets above the minimum never add overrun
  const capsA = {}; for (const d of P.dayIds) capsA[d] = Math.max(P.mu, mMin[d]);
  const capsAN = capsA;
  const w1min = weekOne(P, S, minDist, full);
  const helper1 = {}; { const e1 = evaluate(P, S, w1min.d1, 1); for (const g of full) helper1[g] = Math.floor((e1.Q[g] - e1.direct[g] * 4) / 4); }
  const ceil = {};
  for (const g of full) { const t = cfg.groups[g]; ceil[g] = Math.max(zmin[g], Math.min(t.C, Math.floor(Math.max(t.S, w1min.a[g] + helper1[g]) * cfg.G + 1e-9)) - helper1[g]); }
  const atLeast = (need) => { target = need; const r = ask(capsAN); target = null; return r; };
  const needAt = (lv, fixed) => { const x = {}; for (const g of full) x[g] = g in fixed ? fixed[g] : Math.max(zmin[g], ceil[g] - lv[g]); return x; };
  let t = 0; const tmax = Math.max(0, ...full.map((g) => ceil[g] - zmin[g]));
  const uni = (v) => Object.fromEntries(full.map((g) => [g, v]));
  while (t < tmax && !atLeast(needAt(uni(t), {}))) t++;
  const fixed = {};
  for (let tau = t; tau >= 1; tau--) {
    const R = full.filter((g) => !(g in fixed) && ceil[g] - tau >= zmin[g]);        // groups that could still improve at this level
    // the smallest set of groups that stays at shortfall tau; among equals the lowest-priority groups stay (priority-refined leximin)
    const subsets = []; for (let m = 0; m < (1 << R.length); m++) subsets.push(R.filter((_, i) => m & (1 << i)));
    subsets.sort((a, b) => a.length - b.length || cmp(a.map((g) => -cfg.keep.indexOf(g)), b.map((g) => -cfg.keep.indexOf(g))));
    for (const sub of subsets) {
      const lv = {}; for (const g of full) lv[g] = sub.includes(g) ? tau : tau - 1;
      if (atLeast(needAt(lv, fixed))) { for (const g of sub) fixed[g] = Math.max(zmin[g], ceil[g] - tau); break; }
    }
  }
  const z = {}; for (const g of full) z[g] = g in fixed ? fixed[g] : Math.max(zmin[g], ceil[g]);
  const peakDist = canonical(capsAN, z);
  const w1 = weekOne(P, S, peakDist, full);
  const peak = { dist: peakDist, w1 };
  log(`T5 peak (direct sets): ${full.map((g) => `${g} ${z[g]} of ${ceil[g]}${helper1[g] ? ' (+' + helper1[g] + ' credited from other lifts)' : ''}`).join(', ')}`);

  // ---- phase 4: starts. The level start, lowered only for the minimum climb and lambda <= 1, and then to give the weekly total
  //      a step in every week it can have one (T3 "never flat" above "week 1 at the level start")
  const a = {}, alo = w1.a;
  const floorA = (g) => Math.max(alo[g], Math.ceil(z[g] / cfg.G - 1e-9));
  for (const g of full) { const tg = cfg.groups[g]; const sd = Math.max(alo[g], tg.S - helper1[g]); a[g] = Math.max(floorA(g), Math.min(sd, z[g] - tg.mc)); }
  for (let guard = 0, i = 0; guard < 400; guard++, i++) {      // round robin in keep order
    const K = full.reduce((s, g) => s + z[g] - a[g], 0); if (K >= N - 1) break;
    if (!full.some((x) => a[x] > floorA(x))) break;
    const g = full[i % full.length]; if (a[g] > floorA(g)) a[g]--;
  }
  const d1 = new Map(); for (const [k, v] of w1.d1) d1.set(k, { ...v });
  for (const g of full) { const nx = waterFill(P, g, w1.lo, peakDist, a[g]); for (const [k, n] of nx) d1.set(k, { n, k: d1.get(k).k }); }
  for (let guard = 0; guard < 50; guard++) {                     // the floors are read on credited sets: verify week 1 on the evaluator
    const e1 = evaluate(P, S, d1, 1); const g = full.find((x) => e1.Q[x] < cfg.groups[x].F * 4); if (!g) break;
    a[g]++; const nx = waterFill(P, g, w1.lo, peakDist, a[g]); for (const [k, n] of nx) d1.set(k, { n, k: d1.get(k).k });
  }

  // ---- phase 5: stairway (min-cost flow of design/research) on the group totals, then the closed-form weekly realization
  const climbing = full.filter((g) => z[g] > a[g]);
  const tot1 = Object.values(evaluate(P, S, d1, 1).slots).flat().reduce((x, y) => x + y.n, 0);                 // every resistance set of week 1
  const fl = climbing.length ? stairway(climbing.map((g) => ({ n: g, S: a[g], C: z[g] })), N, tot1, cfg.landing) : { sched: [] };
  const v = {}; full.forEach((g) => { const i = climbing.indexOf(g); v[g] = i >= 0 ? fl.sched[i] : Array(N).fill(a[g]); });
  const weeks = [];
  const from1 = new Map([...d1].map(([k, x]) => [k, x.n]));
  for (let w = 1; w <= N; w++) {
    const dw = new Map(); for (const [k, x] of d1) dw.set(k, { ...x });
    for (const g of full) { const nx = waterFill(P, g, from1, peakDist, v[g][w - 1]); if (!nx) throw new Error('realization failed ' + g + ' w' + w); for (const [k, n] of nx) dw.set(k, { n, k: dw.get(k).k }); }
    weeks.push(dw);
  }
  // supersets "needed": per exercise block, the fewest pairs that keep the block's last week inside its limit (T7-PAIR-03)
  const ssByBlock = cfg.blocks.map(([b0, b1]) => {
    const on = new Set(), needed = {};
    for (const d of P.dayIds) {
      needed[d] = [];
      for (const w of [b0, b1]) {                                             // tests sit in the first and the last week
        const allEv = evalDay(P, S, d, (k) => weeks[w - 1].get(k), w, { ss: 'all' });
        const cap = Math.max(testTU(d, w) ? P.band : P.mu, allEv.t), pairs = allEv.pairs;   // the fewest pairs that reach the lowest overrun
        const subs = []; for (let m = 0; m < (1 << pairs.length); m++) subs.push(pairs.filter((_, i) => m & (1 << i)));
        subs.sort((x, y) => x.length - y.length);
        let pick = pairs;
        for (const sset of subs) { const set = new Set(sset.map((p) => p.key).concat(needed[d])); if (evalDay(P, S, d, (k) => weeks[w - 1].get(k), w, { ss: set }).t <= cap) { pick = sset; break; } }
        for (const p of pick) if (!needed[d].includes(p.key)) needed[d].push(p.key);
      }
      needed[d].forEach((k) => on.add(k));
    }
    return { b0, b1, on, needed };
  });
  const rows = [];
  for (let w = 1; w <= N; w++) {
    const blk = ssByBlock.find((b) => w >= b.b0 && w <= b.b1);
    rows.push({ w, ev: evaluate(P, S, weeks[w - 1], w, { ss: blk.on }), evAll: evaluate(P, S, weeks[w - 1], w, { ss: 'all' }), evNone: evaluate(P, S, weeks[w - 1], w, { ss: new Set() }) });
  }
  return { S, full, cellsOn, delta, mMin, zmin, z, a, alo, ceil, helper1, v, weeks, rows, ssByBlock, peak, d1, capsA, limit: (d, w) => (testTU(d, w) ? P.band : capsA[d]), stats: { ...P.stats } };
}

// ------------------------------------------------------------------------------------------------ checks (the scorer's rows, on the result)
export function certify(P, R) {
  const cfg = P.cfg, N = cfg.N, out = [];
  const bad = (id, msg) => out.push(id + ': ' + msg);
  let prevTot = null, prevSlots = null;
  for (const row of R.rows) {
    const { w, ev } = row;
    for (const g of R.full) {
      if (ev.Q[g] < cfg.groups[g].F * 4) bad('T2-FLR-01', `week ${w} ${g} credited ${ev.Q[g] / 4} < ${cfg.groups[g].F}`);
      if (w > 1 && R.v[g][w - 1] < R.v[g][w - 2]) bad('T3-STW-01', `week ${w} ${g} drops`);
      if (w > 1 && R.v[g][w - 1] - R.v[g][w - 2] > Math.max(1, Math.floor(0.07 * R.v[g][w - 2]))) bad('T0-STW-03', `week ${w} ${g} step > max(1, 7 %)`);
    }
    for (const d of P.dayIds) {
      const lim = R.limit(d, w);
      if (ev.min[d] > lim) bad('T1-POL-02 / T4', `week ${w} ${d} ${mins(ev.min[d])} > ${mins(lim)}`);
      const cnt = {}; for (const a of ev.slots[d]) if (!a.pattern && !(a.slot.fixed && R.S.state[a.slot.g] !== 'FULL')) cnt[a.slot.g] = (cnt[a.slot.g] || 0) + 1;
      for (const [g, n] of Object.entries(cnt)) if (g !== 'calves' && (n < 2 || n > 4)) bad('T0-SES-10', `week ${w} ${d} ${g} has ${n} exercise(s)`);
      for (const a of ev.slots[d]) if (!a.pattern && (a.n < a.slot.min || a.n > a.slot.max)) bad('T0-SES-15', `week ${w} ${d} ${a.slot.id} sets ${a.n}`);
    }
    const tot = Object.values(ev.slots).flat().reduce((s, x) => s + x.n, 0);        // Tot_w: every resistance set of the week
    if (prevTot !== null && tot - prevTot > 1 && tot - prevTot >= 0.1 * prevTot) bad('T0-STW-03', `week ${w} total +${tot - prevTot} >= 10 %`);
    const flat = {}; for (const d of P.dayIds) for (const a of ev.slots[d]) flat[a.slot.id] = a.n;
    if (prevSlots) for (const [id, n] of Object.entries(prevSlots)) if ((flat[id] || 0) < n) bad('house-monotone', `week ${w} ${id} lost a set`);
    prevTot = tot; prevSlots = flat;
  }
  for (const g of R.full) if (R.z[g] - R.a[g] < cfg.groups[g].mc) bad('T3-STW-02', `${g} climbs ${R.z[g] - R.a[g]} < ${cfg.groups[g].mc}`);
  return out;
}
