// design/milp_proto/planner.mjs - prototype of the exact planner specified in design/design_milp.md (NOT engine code).
// One stairway block:  compact epoch MILP (structure + sets in the first and the peak week, lexicographic tiers)
//                   -> exact stairway on the placed weeks (dynamic program)  -> coach-order placement -> certificate.
// Units: time in 1/20 minute (3 s; every time parameter of model/rules.json is a multiple), credit in quarter sets.
// Everything a decision rests on is an integer; the LP inside the kernel only orders the search, and every incumbent is
// re-checked in integers (kern.mjs).
import { Model } from '../research/kernel.mjs';
import { solveMip } from './kern.mjs';

export const TU = 20;                                   // time units per minute
export const tu = (min) => Math.round(min * TU);
const CO = tu(1), CO_PAIR_SAVE = tu(1);                 // changeover 1 min per exercise; a pair saves 2 x (1 - 0.5) = 1 min
const BIG = 8;

/**
 * Build the compact epoch model of one stairway block.
 * I = { N, mu, phi, athlete, groups:[{id,S,C,F,mc,pinned}], days:[{id,fix1,fixN,counted,slots:[...]}], pairs:[{day,a,b}],
 *       cuts:[{id,save:{dayId:[u1,uN]}}], bonus:[{day,slot,units,unlessCut}], maxPattern }
 * slot = { id, g, c1, cN (time units per set in week 1 / in the peak week), r1, rN (rest part, for pair savings), min, max,
 *          cr:{group:quarters}, optional, pattern, classLift }
 */
export function buildModel(I, opt = {}) {
  const m = new Model();
  const mu = opt.mu ?? I.mu, phi = opt.phi ?? I.phi;
  const LIM = Math.floor(tu(mu) * phi + 1e-9), MU = tu(mu);
  const G = I.groups, gi = Object.fromEntries(G.map((g, i) => [g.id, i]));
  const V = { y: {}, t: {}, u: {}, pt: {}, x1: {}, xN: {}, pon: {}, r1: {}, rN: {}, rc: {}, bq: {}, ov1: {}, ovN: {}, short: {}, dev: {}, M: null, odd: {}, sess: {} };
  const slots = I.days.flatMap((d, di) => d.slots.map((s) => ({ ...s, di, day: d.id })));
  const sid = Object.fromEntries(slots.map((s) => [s.id, s]));
  for (const g of G) V.y[g.id] = m.bool(`y.${g.id}`, 'up');
  for (const c of I.cuts || []) V.rc[c.id] = m.bool(`cut.${c.id}`, 'down');
  (I.cuts || []).forEach((c, i, a) => { if (i) m.lin([[1, V.rc[c.id]], [-1, V.rc[a[i - 1].id]]], '<=', 0, 'cut order'); });
  for (const s of slots) if (s.pattern) V.pt[s.id] = m.bool(`pat.${s.id}`, 'up');
  I.days.forEach((d, di) => { for (const g of G) if (d.slots.some((s) => s.g === g.id && !s.classLift) || d.slots.some((s) => s.g === g.id && s.classLift && d.slots.filter((x) => x.g === g.id).length > 1)) V.t[`${g.id}|${di}`] = m.bool(`t.${g.id}.${d.id}`, 'up'); });
  for (const s of slots) { if (!s.classLift) V.u[s.id] = m.bool(`u.${s.id}`, 'up'); V.x1[s.id] = m.int(0, s.max, `x1.${s.id}`, 'down'); V.xN[s.id] = m.int(0, s.max, `xN.${s.id}`, 'down'); }
  const act = (s) => (s.classLift ? [] : [[1, V.u[s.id]]]).concat(V.pt[s.id] !== undefined ? [[1, V.pt[s.id]]] : []);   // + constant 1 for a class lift
  // ---- structure -----------------------------------------------------------------------------------------------
  for (const g of G) {
    const ts = Object.keys(V.t).filter((k) => k.startsWith(g.id + '|')).map((k) => V.t[k]);
    for (const t of ts) m.lin([[1, t], [-1, V.y[g.id]]], '<=', 0, `T1-POL-01 trained day needs a trained group ${g.id}`);
    m.lin([[1, V.y[g.id]], ...ts.map((t) => [-1, t])], '<=', 0, `T1-POL-01 a trained group has a day ${g.id}`);
    if (g.pinned === 'allLegDays') I.days.forEach((d, di) => { const t = V.t[`${g.id}|${di}`]; if (t !== undefined) m.lin([[1, t], [-1, V.y[g.id]]], '=', 0, 'T0-SES-11 calves on every leg day'); });
    // pattern stations: only for a group that is not trained directly, at most one per group
    const ps = slots.filter((s) => s.g === g.id && s.pattern);
    if (ps.length) { m.lin([...ps.map((s) => [1, V.pt[s.id]]), [1, V.y[g.id]]], '<=', 1, `T1-POL-07 one pattern station ${g.id}`); }
  }
  const allPat = slots.filter((s) => s.pattern).map((s) => [1, V.pt[s.id]]);
  if (allPat.length) m.lin(allPat, '<=', I.maxPattern ?? 3, 'T1-POL-07 at most 3 pattern stations');
  I.days.forEach((d, di) => {
    for (const g of G) {
      const all = d.slots.filter((s) => s.g === g.id), cl = all.filter((s) => s.classLift), L = all.filter((s) => !s.classLift);
      const t = V.t[`${g.id}|${di}`];
      for (const s of cl) {             // a class lift is always in the class: 3 sets alone, more only as part of a trained group-day
        m.lin([[1, V.x1[s.id]]], '>=', s.min, 'class lift'); m.lin([[1, V.xN[s.id]], ...(t !== undefined ? [[-(s.max - s.min), t]] : [])], '<=', s.min, 'class lift climbs only in a trained group-day');
      }
      if (t === undefined) continue;
      for (const s of L) { m.lin([[1, V.u[s.id]], [-1, t]], '<=', 0, 'slot needs its group-day'); if (V.pt[s.id] !== undefined) m.lin([[1, V.u[s.id]], [1, V.pt[s.id]]], '<=', 1, 'slot is trained or pattern'); }
      // the work lift of a trained group is never cut (rules.cut_order.never_cut.roles; T0-SES-06): its day trains the group
      if (all.some((s) => s.must)) m.lin([[1, t], [-1, V.y[g.id]]], '=', 0, `T0-SES-06 work lift day of a trained group ${g.id}`);
      const req = L.filter((s) => !s.optional);
      for (const s of req) m.lin([[1, V.u[s.id]], [-1, t]], '=', 0, 'T0-SES-10 required slot of a trained group-day');
      const optl = L.filter((s) => s.optional);
      optl.forEach((s, i) => { if (i) m.lin([[1, V.u[s.id]], [-1, V.u[optl[i - 1].id]]], '<=', 0, 'T6-CNT-03 exercises open in session order'); });
      const single = g.single;        // calves: exactly one exercise
      const kLo = single ? 1 : 2, kHi = single ? 1 : 4;
      m.lin([...L.map((s) => [1, V.u[s.id]]), [cl.length - kLo, t]], '>=', 0, `T0-SES-10 at least ${kLo} exercises`);
      m.lin([...L.map((s) => [1, V.u[s.id]]), [cl.length - kHi, t]], '<=', 0, `T0-SES-10 at most ${kHi} exercises`);
      // VOL-07 staircase over the day's exercises of the group, session order (class lift first)
      const ord = [...cl, ...L];
      // n_1 >= n_2 >= ... >= n_k >= n_1 - 1 : exactly the states of the coach's sequence 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3
      for (let i = 0; i + 1 < ord.length; i++) for (const X of [V.x1, V.xN]) {
        const a = ord[i], b = ord[i + 1], f = ord[0];
        m.lin([[1, X[a.id]], [-1, X[b.id]], ...(V.pt[b.id] !== undefined ? [[BIG, V.pt[b.id]]] : [])], '>=', 0, 'T7-PLC-01 VOL-07 order');
        m.lin([[1, X[f.id]], [-1, X[b.id]], [BIG, V.u[b.id]]], '<=', 1 + BIG, 'T7-PLC-01 VOL-07 at most one below the first');
      }
    }
    for (const s of d.slots) {
      const lo = [[1, V.x1[s.id]]], hiN = [[1, V.xN[s.id]]];
      if (!s.classLift) {
        m.lin([...lo, [-s.min, V.u[s.id]], ...(V.pt[s.id] !== undefined ? [[-2, V.pt[s.id]]] : [])], '>=', 0, 'T0-SES-15 min sets');
        m.lin([...hiN, [-s.max, V.u[s.id]], ...(V.pt[s.id] !== undefined ? [[-2, V.pt[s.id]]] : [])], '<=', 0, 'T0-SES-15 max sets');
      }
      m.lin([[1, V.x1[s.id]], [-1, V.xN[s.id]]], '<=', 0, 'T3-STW-01 sets never drop');
    }
  });
  // ---- pairs (DEF-09: a pair shares one rest; shared rounds r <= both set counts) ---------------------------------
  (I.pairs || []).forEach((p, k) => {
    const a = sid[p.a], b = sid[p.b]; const id = `${p.a}+${p.b}`;
    V.pon[id] = m.bool(`pair.${id}`, 'up'); V.r1[id] = m.int(0, Math.min(a.max, b.max), `r1.${id}`, 'up'); V.rN[id] = m.int(0, Math.min(a.max, b.max), `rN.${id}`, 'up');
    for (const s of [a, b]) {
      const A = act(s);
      if (!s.classLift) m.lin([[1, V.pon[id]], ...A.map(([c, v]) => [-c, v])], '<=', 0, 'T0-SES-16 pair needs both exercises');
      m.lin([[1, V.r1[id]], [-1, V.x1[s.id]]], '<=', 0, 'shared rounds'); m.lin([[1, V.rN[id]], [-1, V.xN[s.id]]], '<=', 0, 'shared rounds');
    }
    m.lin([[1, V.r1[id]], [-Math.min(a.max, b.max), V.pon[id]]], '<=', 0, 'rounds need the pair'); m.lin([[1, V.rN[id]], [-Math.min(a.max, b.max), V.pon[id]]], '<=', 0, 'rounds need the pair');
    p.id = id; p.s1 = Math.min(a.r1, b.r1); p.sN = Math.min(a.rN, b.rN); p.di = a.di;
    // T0-SES-08 (hip + push, knee + pull; rules.cut_order.keep_work_pair): a lower-body work lift that is on keeps its upper partner
    if (a.role === 'work' && b.role === 'paired_upper') { const A = act(a), Bq = act(b); m.lin([...Bq, ...A.map(([c, v]) => [-c, v])], '>=', a.classLift ? 1 : 0, 'T0-SES-08 work lift keeps its paired upper lift'); }
  });
  (I.bonus || []).forEach((bn, k) => {     // a fixed saving while a slot is on and a cut is not taken (calf raise paired with the joint-care item)
    const s = sid[bn.slot]; V.bq[k] = m.bool(`bonus.${bn.slot}`, 'up');
    m.lin([[1, V.bq[k]], ...act(s).map(([c, v]) => [-c, v])], '<=', 0, 'bonus pair needs the slot');
    if (bn.unlessCut) m.lin([[1, V.bq[k]], [1, V.rc[bn.unlessCut]]], '<=', 1, 'bonus pair needs the joint-care item');
    bn.di = s.di;
  });
  // ---- time: "the day holds" (T1-POL-02) at both epochs; overrun over the chosen minutes (T4-TIME-01) -----------------
  const timeTerms = (di, e) => {
    const d = I.days[di], X = e === 1 ? V.x1 : V.xN, Rr = e === 1 ? V.r1 : V.rN;
    const terms = []; let konst = e === 1 ? d.fix1 : d.fixN;
    for (const s of d.slots) { terms.push([e === 1 ? s.c1 : s.cN, X[s.id]]); if (s.classLift) konst += CO; else terms.push([CO, V.u[s.id]]); if (V.pt[s.id] !== undefined) terms.push([CO, V.pt[s.id]]); }
    for (const p of I.pairs || []) if (p.di === di) { terms.push([-(e === 1 ? p.s1 : p.sN), Rr[p.id]]); terms.push([-CO_PAIR_SAVE, V.pon[p.id]]); }
    (I.bonus || []).forEach((bn, k) => { if (bn.di === di) terms.push([-bn.units, V.bq[k]]); });
    for (const c of I.cuts || []) { const sv = c.save[d.id]; if (sv) terms.push([-(e === 1 ? sv[0] : sv[1]), V.rc[c.id]]); }
    return { terms, konst };
  };
  I.days.forEach((d, di) => {
    for (const e of [1, 2]) {
      const { terms, konst } = timeTerms(di, e);
      m.lin(terms, '<=', LIM - konst, `T1-POL-02 day holds ${d.id} ${e === 1 ? 'week 1' : 'peak'}`);
      const ov = m.int(0, Math.max(0, LIM - MU), `over.${d.id}.${e}`, 'down'); (e === 1 ? V.ov1 : V.ovN)[di] = ov;
      m.lin([...terms, [-1, ov]], '<=', MU - konst, `T1-POL-02 day holds ${d.id} ${e === 1 ? 'week 1' : 'peak'}`);   // overrun over the chosen minutes (T4-TIME-01); same family as the limit row
    }
    if (I.athlete) m.lin(d.slots.flatMap((s) => act(s)), '<=', (I.athleteCap ?? 12) - d.counted - d.slots.filter((s) => s.classLift).length, 'T0-SES-13 12 + 2 core');
  });
  // ---- groups: floor, climb, ceilings, reachability of the stairway -------------------------------------------------
  const credit = (g, X) => slots.filter((s) => s.cr[g]).map((s) => [s.cr[g], X[s.id]]);
  const direct = (g, X) => slots.filter((s) => s.g === g).map((s) => [1, X[s.id]]);
  const GN = I.growth;                                         // planned growth G(N) at lambda = 1 (rules.stairway.by_N[N].growth)
  V.M = m.int(0, 40, 'worst shortfall', 'down');
  for (const g of G) {
    const y = V.y[g.id], d1 = direct(g.id, V.x1), dN = direct(g.id, V.xN);
    if (!d1.length) { m.lin([[1, y]], '=', 0, 'no station'); continue; }
    if (g.F != null) m.lin([...credit(g.id, V.x1), [-4 * g.F, y]], '>=', 0, `T2-FLR-01 floor ${g.id}`);
    m.lin([...dN, ...d1.map(([c, v]) => [-c, v]), [-g.mc, y]], '>=', 0, `T3-STW-02 minimum climb ${g.id}`);
    m.lin([...dN, ...d1.map(([c, v]) => [-c, v])], '<=', I.N - 1, `stairway reach: one set a week ${g.id}`);
    // lambda <= 1 (T3-STW-06): whole-set peak <= round_half_up(week-1 sets x G(N)), written in integers
    m.lin([...dN.map(([c, v]) => [20000 * c, v]), ...d1.map(([c, v]) => [-Math.round(20000 * GN) * c, v]), [40 * 20000, y]], '<=', 10000 + 40 * 20000, `T3-STW-06 lambda <= 1 ${g.id}`);
    m.lin([...dN, [40, y]], '<=', g.C + 40, `T5-CAP-01 ceiling ${g.id}`);
    m.lin([...credit(g.id, V.xN), [4 * 40, y]], '<=', 4 * (g.C + 1) + 4 * 40, `T5-CAP-01 credited ceiling + 1 ${g.id}`);
    I.days.forEach((d, di) => { const tt = d.slots.filter((s) => s.cr[g.id]).map((s) => [s.cr[g.id], V.xN[s.id]]); const cap = 4 * (g.focus ? 14 : 11);
      if (tt.length && tt.reduce((a, [c, v]) => a + c * m.hi[v], 0) > cap) { const e = m.int(0, 80, `sess.${g.id}.${d.id}`, 'down'); V.sess[`${g.id}|${di}`] = e; m.lin([...tt, [-1, e]], '<=', cap, `T5-CAP-05 per session (soft) ${g.id}`); } });
    V.short[g.id] = m.int(0, 40, `short.${g.id}`, 'down');
    m.lin([[1, V.short[g.id]], ...dN, [-g.C, y]], '>=', 0, `T5-CAP-04 shortfall ${g.id}`);
    m.lin([[1, V.M], [-1, V.short[g.id]]], '>=', 0, 'worst shortfall');
    V.dev[g.id] = m.int(0, 60, `dev.${g.id}`, 'down');
    m.lin([[1, V.dev[g.id]], ...d1.map(([c, v]) => [-c, v]), [-60, y]], '>=', -g.S - 60, `week 1 near the start (+) ${g.id}`);   // dev >= d1 - S when trained
    m.lin([[1, V.dev[g.id]], ...d1, [-g.S, y]], '>=', 0, `week 1 near the start (-) ${g.id}`);                                     // dev >= S - d1 when trained
  }
  // optional reading (design_milp.md 15, decision D3): "never flat" on the weekly total ranks above the chosen minutes -
  // flat weeks of the total >= (N - 1) - number of whole sets added over the block
  if (opt.flatFirst) {
    V.flat = m.int(0, I.N - 1, 'flat weeks (lower bound)', 'down');
    m.lin([[1, V.flat], ...slots.flatMap((s) => [[1, V.xN[s.id]], [-1, V.x1[s.id]]])], '>=', I.N - 1, 'T3-STW-03 flat weeks of the total');
  }
  // ---- R3-VOL-03: the exposures of one group stay even (soft, T7): odd >= |added(d) - added(d')| - 1 --------------------
  for (const g of opt.noEven ? [] : G) {
    const ds = I.days.map((d, di) => di).filter((di) => V.t[`${g.id}|${di}`] !== undefined);
    for (let a = 0; a < ds.length; a++) for (let b = a + 1; b < ds.length; b++) {
      const add = (di) => I.days[di].slots.filter((s) => s.g === g.id).flatMap((s) => [[1, V.xN[s.id]], [-1, V.x1[s.id]]]);
      const o = m.int(0, 12, `odd.${g.id}.${ds[a]}.${ds[b]}`, 'down'); V.odd[`${g.id}|${ds[a]}|${ds[b]}`] = o;
      const ta = V.t[`${g.id}|${ds[a]}`], tb = V.t[`${g.id}|${ds[b]}`];
      // later exposure never ahead of the earlier one; earlier at most one ahead (only when both days train the group)
      m.lin([[1, o], ...add(ds[a]), ...add(ds[b]).map(([c, v]) => [-c, v]), [-12, ta], [-12, tb]], '>=', -24, 'T7-PLC-02 later exposure not ahead');
      m.lin([[1, o], ...add(ds[b]), ...add(ds[a]).map(([c, v]) => [-c, v]), [-12, ta], [-12, tb]], '>=', -1 - 24, 'T7-PLC-02 earlier exposure at most one ahead');
      // week 1 is shared out the same way (VOL-07 order across the week's exposures): |week-1 sets(d) - week-1 sets(d')| <= 1 + odd1
      const w1 = (di) => I.days[di].slots.filter((s) => s.g === g.id).map((s) => [1, V.x1[s.id]]);
      const o1 = m.int(0, 12, `odd1.${g.id}.${ds[a]}.${ds[b]}`, 'down'); V.odd[`1|${g.id}|${ds[a]}|${ds[b]}`] = o1;
      m.lin([[1, o1], ...w1(ds[a]), ...w1(ds[b]).map(([c, v]) => [-c, v]), [-12, ta], [-12, tb]], '>=', -1 - 24, 'T7-PLC-02 week 1 even (a)');
      m.lin([[1, o1], ...w1(ds[b]), ...w1(ds[a]).map(([c, v]) => [-c, v]), [-12, ta], [-12, tb]], '>=', -1 - 24, 'T7-PLC-02 week 1 even (b)');
    }
  }
  // ---- branching priority: who is trained, pattern stations, cuts, days, exercises, then the sets ---------------------
  m.order = [...G.map((g) => V.y[g.id]), ...Object.values(V.pt), ...Object.values(V.rc), ...Object.values(V.t), ...Object.values(V.u), ...Object.values(V.pon),
    ...G.flatMap((g) => slots.filter((s) => s.g === g.id).flatMap((s) => [V.xN[s.id], V.x1[s.id]]))];
  return { m, V, slots, sid, LIM, MU, credit, direct, timeTerms, mu, phi };
}

/** the lexicographic tiers of design_milp.md section 2.4, in order; every objective is an integer */
export function tiers(I, B, opt = {}) {
  const { V, slots } = B, G = I.groups, n = G.length;
  const W = (i) => 2 ** (n - 1 - i);                       // each weight exceeds the sum of all later ones: the sum IS the lexicographic order
  const full = G.map((g, i) => [-W(i), V.y[g.id]]);
  // pattern stations rank after the trained groups and after the room cuts (design_milp.md 2.4): the coach's pattern order, then keep order
  const pOrder = [...(I.patternOrder || ['back', 'chest', 'quads', 'hips']), ...G.map((g) => g.id)].filter((g, i, a) => a.indexOf(g) === i).filter((g) => slots.some((s) => s.g === g && s.pattern));
  const pat = pOrder.flatMap((g, i) => slots.filter((s) => s.g === g && s.pattern).map((s) => [-(2 ** (pOrder.length - 1 - i)), V.pt[s.id]]));
  const T = [
    { id: 'T1a', name: 'T1-POL-05 groups trained directly (lexicographic, keep order)', terms: full },
    { id: 'T1b', name: 'T1-POL-06 fewest room cuts', terms: Object.values(V.rc).map((v) => [1, v]) },
    { id: 'T1c', name: 'T1-POL-07 pattern stations in the room that is left', terms: pat },
    ...(opt.flatFirst ? [{ id: 'T3f', name: 'T3-STW-03 flat weeks of the weekly total (optional reading: above the minutes)', terms: [[1, V.flat]] }] : []),
    { id: 'T4', name: 'T4-TIME-01 minutes over the chosen length (week 1 + peak week)', terms: [...Object.values(V.ov1), ...Object.values(V.ovN)].map((v) => [1, v]),
      parts: () => [...Object.values(V.ov1), ...Object.values(V.ovN)].map((v) => [[1, v]]) },
    { id: 'T5s', name: 'T5-CAP-05 sets over 11 a session (quarter sets)', terms: Object.values(V.sess).map((v) => [1, v]) },
    { id: 'T5a', name: 'T5-CAP-04 worst peak shortfall', terms: [[1, V.M]] },
    { id: 'T5b', name: 'T5-CAP-04 total peak shortfall', terms: Object.values(V.short).map((v) => [1, v]),
      // total shortfall = constant - sum of the peak sets of the trained groups: bound it day by day and group by group
      parts: (sol) => [...I.days.map((d, di) => slots.filter((s) => s.di === di && sol[V.y[s.g]] === 1).map((s) => [-1, V.xN[s.id]])), ...Object.values(V.short).map((v) => [[1, v]])] },
    { id: 'T5c', name: 'T3-STW-08 week 1 nearest the level start', terms: Object.values(V.dev).map((v) => [1, v]), parts: () => Object.values(V.dev).map((v) => [[1, v]]) },
    { id: 'T6', name: 'T6-CNT-03 fewest exercises', terms: Object.values(V.u).map((v) => [1, v]) },
    { id: 'T7a', name: 'T7-PLC-02 uneven exposures', terms: Object.values(V.odd).map((v) => [1, v]) },
    { id: 'T7b', name: 'T7-PAIR-03 fewest supersets switched on', terms: Object.values(V.pon).map((v) => [1, v]) },
    { id: 'T9', name: 'canonical tie-break (earliest slots first)', terms: slots.flatMap((s, k) => [[k + 1, V.xN[s.id]], [k + 1, V.x1[s.id]]]) },
  ];
  return T.filter((t) => t.terms.length && !(opt.skip || []).includes(t.id));
}

/**
 * Lexicographic solve with exact freezes; returns the solution, the per-tier report and the frozen model.
 * Part bounds (design_milp.md 4.4): a tier whose objective is a sum of separable parts (per day, per group) first minimizes
 * every part alone - a much easier problem - and adds "part >= its own minimum" as a valid row. The tier's LP bound is then
 * at least the sum of the part minima, which is what closes the "which group gets the last set" plateaus.
 */
export function solveLexPlan(I, opt = {}) {
  const B = buildModel(I, opt);
  const { m } = B; const T = tiers(I, B, opt);
  const report = []; let last = null; let proven = true;
  const limit = opt.nodeLimit || 20000;
  // T1a, the keep vector, as the coach states it (R3-SES-02 step 2): one exact feasibility question per group in keep order -
  // "every group kept so far + this one, the rest free". Keeping a group iff the answer is yes IS the lexicographic maximum.
  // Each question is a pure feasibility problem (other groups tried "off" first), which the measurements show is far more robust
  // than one weighted objective. "unknown" (budget) is never read as "does not fit": the group is left out AND the plan is flagged.
  let t1 = null;
  if (opt.t1 !== 'weighted') {
    const { V } = B; const fix = [], log = []; let nodes = 0, lpIters = 0, unknown = [];
    for (const g of I.groups) m.pref[V.y[g.id]] = 'down';
    for (const g of I.groups) {
      const r = solveMip(m, null, { fix: [...fix, [V.y[g.id], 1, 1]], nodeLimit: limit });
      nodes += r.nodes; lpIters += r.lpIters; log.push(`${g.id}:${r.sol ? 'fits' : r.status}/${r.nodes}`);
      if (r.sol) { fix.push([V.y[g.id], 1, 1]); last = r.sol; } else { fix.push([V.y[g.id], 0, 0]); if (r.status !== 'infeasible') unknown.push(g.id); }
    }
    if (!last) { const r = solveMip(m, null, { fix, nodeLimit: limit }); nodes += r.nodes; last = r.sol; if (!last) return { B, report: [{ id: 'T1a', name: 'no plan: the fixed blocks alone do not fit', status: r.status, value: null, nodes, lpIters }], sol: null, status: r.status, proven: false }; }
    for (const [v, l, h] of fix) { m.lo[v] = l; m.hi[v] = h; }
    for (const g of I.groups) m.pref[V.y[g.id]] = 'up';
    if (unknown.length) proven = false;
    t1 = { id: 'T1a', name: 'T1-POL-05 groups trained directly (keep order, one exact question each)', status: unknown.length ? 'unknown:' + unknown.join(',') : 'optimal', value: fix.filter((f) => f[1] === 1).length, nodes, lpIters, log };
    report.push(t1);
  }
  for (const t of T) {
    if (t1 && t.id === 'T1a') continue;
    if (opt.only === 'T1a' && t1) break;
    let partNodes = 0, partCuts = 0;
    if (t.parts && opt.partBounds === true && last) {
      for (const part of t.parts(last)) {
        if (!part.length) continue;
        const pr = solveMip(m, part, { nodeLimit: Math.min(limit, opt.partLimit || 2000), start: last });
        partNodes += pr.nodes;
        if (pr.status === 'optimal') { m.lin(part, '>=', pr.value, `part bound ${t.id}`); partCuts++; }
      }
    }
    const r = solveMip(m, t.terms, { nodeLimit: limit, start: last, cuts: opt.cuts ?? false });
    report.push({ id: t.id, name: t.name, status: r.status, value: r.value, nodes: r.nodes, lpIters: r.lpIters, partNodes, partCuts });
    if (!r.sol) return { B, report, sol: last, status: r.status, proven: false };
    if (r.status !== 'optimal') proven = false;
    last = r.sol; m.lin(t.terms, '<=', r.value, `freeze ${t.id}`);
    if (opt.only && t.id === opt.only) break;
  }
  return { B, report, sol: last, status: proven ? 'optimal' : 'feasible', proven };
}

// ----------------------------------------------------------------------------------------------------- the stairway
/** the coach's planned curve (DEF-10) from S to P over N weeks: lambda by bisection (multiplication only), T(w), ideal weeks */
export function plannedCurve(S, P, N, steps = { early: 0.03, late: 0.05 }) {
  const h = Math.ceil(N / 2);
  const grow = (lam) => { let t = S; for (let w = 2; w <= N; w++) t *= 1 + lam * (w <= h ? steps.early : steps.late); return t; };
  let lo = 0, hi = 1;
  if (grow(1) <= P) lo = hi = 1; else for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (grow(mid) < P) lo = mid; else hi = mid; }
  const lam = (lo + hi) / 2; const T = [S];
  for (let w = 2; w <= N; w++) T.push(Math.min(P, T[w - 2] * (1 + lam * (w <= h ? steps.early : steps.late))));
  T[N - 1] = Math.max(T[N - 1], Math.min(P, grow(lam) + 1e-9 >= P ? P : T[N - 1]));
  const ideal = []; for (let k = 1; k <= P - S; k++) { let w = 2; while (w < N && Math.floor(T[w - 1] + 0.5 + 1e-9) < S + k) w++; ideal.push(k === P - S ? N : w); }
  return { lam, T, ideal };
}
/** total rule on the placed weeks (T0-STW-03): rise < 10 % of the previous placed total, one set always allowed */
export const maxRise = (tot, pct = 0.10) => Math.max(1, Math.ceil(tot * pct - 1e-9) - 1);

/**
 * Exact stairway. lines = [{id, S, P}] ; tot1 = all resistance sets of week 1. Lexicographic cost (configurable order):
 *   land: lines that do not take their last set in week N;  flat: weeks whose total does not rise;  flat2: flat weeks in a row;
 *   shape: sum |week - week of the coach's rounded curve|;  over7: weeks whose total rises above 7 % (and more than 1 set).
 * Hard: one set a week per line, the 10 % rule on the placed total, every line lands by week N.
 */
export function stairway(lines, N, tot1, order = ['flat', 'land', 'flat2', 'shape', 'over7']) {
  const L = lines.map((l) => ({ ...l, u: l.P - l.S, curve: plannedCurve(l.S, l.P, N) }));
  const D = L.reduce((a, l) => a + l.u, 0), n = L.length;
  const memo = new Map();
  const better = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };
  const idx = { land: 0, flat: 1, flat2: 2, shape: 3, over7: 4 };
  const pack = (c) => order.map((k) => c[idx[k]]);
  function go(w, rem, prevFlat) {                       // weeks w..N still to place; returns { cost (packed), pick }
    const left = rem.reduce((a, b) => a + b, 0);
    if (w > N) return left === 0 ? { cost: pack([0, 0, 0, 0, 0]), pick: null } : null;
    for (let i = 0; i < n; i++) if (rem[i] > N - w + 1) return null;
    const key = w + '|' + rem.join(',') + '|' + (prevFlat ? 1 : 0);
    if (memo.has(key)) return memo.get(key);
    const tot = tot1 + (D - left), cap = maxRise(tot), cap7 = Math.max(1, Math.floor(tot * 0.07 + 1e-9));
    const cand = []; for (let i = 0; i < n; i++) if (rem[i] > 0) cand.push(i);
    let best = null;
    const subsets = 1 << cand.length;
    for (let mask = 0; mask < subsets; mask++) {
      let size = 0, shape = 0; for (let b = 0; b < cand.length; b++) if (mask >> b & 1) size++;
      if (size > cap) continue;
      const nr = rem.slice(); let land = 0;
      for (let b = 0; b < cand.length; b++) if (mask >> b & 1) { const i = cand[b]; const k = L[i].u - rem[i]; shape += Math.abs(w - L[i].curve.ideal[k]); nr[i]--; }
      if (w === N) for (let i = 0; i < n; i++) if (L[i].u > 0 && !(cand.includes(i) && (mask >> cand.indexOf(i) & 1))) land++;
      const flat = size === 0 ? 1 : 0;
      const sub = go(w + 1, nr, !!flat);
      if (!sub) continue;
      const own = pack([land, flat, flat && prevFlat ? 1 : 0, shape, size > cap7 ? 1 : 0]);
      const cost = own.map((v, i) => v + sub.cost[i]);
      if (!best || better(cost, best.cost)) best = { cost, pick: mask, cand };
    }
    memo.set(key, best); return best;
  }
  const root = go(2, L.map((l) => l.u), false);
  if (!root) return null;
  const sched = L.map((l) => [l.S]); let rem = L.map((l) => l.u), prevFlat = false;
  for (let w = 2; w <= N; w++) {
    const r = go(w, rem, prevFlat); const nr = rem.slice(); let size = 0;
    r.cand.forEach((i, b) => { if (r.pick >> b & 1) { nr[i]--; size++; } });
    L.forEach((l, i) => sched[i].push(l.P - nr[i])); rem = nr; prevFlat = size === 0;
  }
  const cost = {}; order.forEach((k, i) => { cost[k] = root.cost[i]; });
  return { sched: L.map((l, i) => ({ id: l.id, x: sched[i], lam: l.curve.lam, T: l.curve.T, ideal: l.curve.ideal })), cost, states: memo.size };
}

// --------------------------------------------------------------------------------------------- placement + minutes
/** exact minutes of every day for one week's slot-set vector (DEF-09; a pair that is on shares one rest) */
export function weekMinutes(I, B, sol, sets, w) {
  const { V } = B; const out = [];
  const late = I.heavyFrom ? w >= I.heavyFrom : w === I.N;          // which per-set costs apply this week (peak costs from heavyFrom)
  I.days.forEach((d, di) => {
    let t = d.fixW ? d.fixW[w - 1] : (w === I.N ? d.fixN : d.fix1);
    for (const c of I.cuts || []) if (sol[V.rc[c.id]] === 1 && c.save[d.id]) t -= late ? c.save[d.id][1] : c.save[d.id][0];
    for (const s of d.slots) { const x = sets[s.id] || 0; if (x) t += x * (late ? s.cN : s.c1) + CO; }
    const straight = t; let solved = t, all = t;
    for (const p of I.pairs || []) if (p.di === di) {
      const a = sets[p.a] || 0, b = sets[p.b] || 0; if (!a || !b) continue;
      const save = Math.min(a, b) * (late ? p.sN : p.s1) + CO_PAIR_SAVE; all -= save; if (sol[V.pon[p.id]] === 1) solved -= save;
    }
    (I.bonus || []).forEach((bn, k) => { if (bn.di === di && sol[V.bq[k]] === 1) { solved -= bn.units; all -= bn.units; } });
    out.push({ day: d.id, min: solved / TU, straight: straight / TU, allPairs: all / TU, units: solved });
  });
  return out;
}

/** weeks 1..N: stairway on the group totals, then the coach's order (R3-VOL-03 exposure that is behind, VOL-07 inside the day) */
export function fillWeeks(I, B, sol, order) {
  const { V, slots } = B, N = I.N;
  const x1 = {}, xN = {}; for (const s of slots) { x1[s.id] = sol[V.x1[s.id]]; xN[s.id] = sol[V.xN[s.id]]; }
  const kept = I.groups.filter((g) => sol[V.y[g.id]] === 1);
  const dir = (g, X) => slots.filter((s) => s.g === g).reduce((a, s) => a + X[s.id], 0);
  const lines = kept.map((g) => ({ id: g.id, S: dir(g.id, x1), P: dir(g.id, xN) }));
  const tot1 = slots.reduce((a, s) => a + x1[s.id], 0);
  const st = stairway(lines, N, tot1, order);
  if (!st) return { error: 'stairway infeasible', lines };
  const cur = { ...x1 }, weeks = [{ ...cur }], lastDay = {}, why = [];
  for (let w = 2; w <= N; w++) {
    for (const l of st.sched) {
      let need = l.x[w - 1] - dir(l.id, cur);
      while (need-- > 0) {
        const open = slots.filter((s) => s.g === l.id && cur[s.id] < xN[s.id]);
        const days = [...new Set(open.map((s) => s.di))];
        const added = (di) => slots.filter((s) => s.g === l.id && s.di === di).reduce((a, s) => a + cur[s.id] - x1[s.id], 0);
        const low = Math.min(...days.map(added)); const cand = days.filter((di) => added(di) === low);
        const di = cand[0];                                           // the exposure that is behind; ties: the earlier day (Monday first)
        const dslots = slots.filter((s) => s.g === l.id && s.di === di && (sol[V.u[s.id]] === 1 || s.classLift));
        const first = dslots[0];
        // VOL-07: the first exercise below the first one's sets, else the first - among the slots still below their peak
        const pick = dslots.find((s) => cur[s.id] < xN[s.id] && cur[s.id] < cur[first.id]) || dslots.find((s) => cur[s.id] < xN[s.id]);
        cur[pick.id]++; why.push({ w, group: l.id, day: I.days[di].id, slot: pick.id });
      }
    }
    weeks.push({ ...cur });
  }
  return { weeks, st, lines, tot1, why };
}

/** the certificate: every catalogue row that the reductions rely on, re-evaluated on every week in integers */
export function certify(I, B, sol, F) {
  const { V, slots } = B, N = I.N, out = { time: 0, floor: 0, slotDrop: 0, between: 0, vol07: 0, step: 0, total: 0, landed: 0, ceiling: 0 };
  const kept = I.groups.filter((g) => sol[V.y[g.id]] === 1);
  const cred = (g, X) => slots.reduce((a, s) => a + (s.cr[g] || 0) * (X[s.id] || 0), 0);
  const dir = (g, X) => slots.filter((s) => s.g === g).reduce((a, s) => a + X[s.id], 0);
  const tot = F.weeks.map((wk) => Object.values(wk).reduce((a, b) => a + b, 0));
  F.weeks.forEach((wk, wi) => {
    weekMinutes(I, B, sol, wk, wi + 1).forEach((r) => { if (r.units > B.LIM) out.time++; });
    for (const g of kept) { if (g.F != null && cred(g.id, wk) < 4 * g.F) out.floor++; if (dir(g.id, wk) > g.C) out.ceiling++; }
    for (const s of slots) { if (wk[s.id] < sol[V.x1[s.id]] || wk[s.id] > sol[V.xN[s.id]]) out.between++; if (wi && wk[s.id] < F.weeks[wi - 1][s.id]) out.slotDrop++; }
    I.days.forEach((d, di) => { for (const g of kept) { const a = d.slots.filter((s) => s.g === g.id && wk[s.id] > 0).map((s) => wk[s.id]); for (let i = 0; i + 1 < a.length; i++) if (a[i] < a[i + 1] || a[i] > a[i + 1] + 1) out.vol07++; } });
    if (wi) { for (const g of kept) if (dir(g.id, wk) - dir(g.id, F.weeks[wi - 1]) > 1) out.step++; if (tot[wi] - tot[wi - 1] > maxRise(tot[wi - 1])) out.total++; }
  });
  for (const g of kept) if (dir(g.id, F.weeks[N - 1]) !== dir(g.id, Object.fromEntries(slots.map((s) => [s.id, sol[V.xN[s.id]]])))) out.landed++;
  out.ok = Object.entries(out).every(([k, v]) => k === 'ok' || v === 0);
  return out;
}

// ------------------------------------------------------------------------------------------- exact infeasibility report
/**
 * Why is `target` not trained directly? Fix every group the plan keeps plus the target to "trained" and look for a minimal
 * set of coach-rule rows that cannot hold together (deletion filter over rule families, the catalogue ids in the row tags).
 * Definitional rows (what a set, a pair, a trained day is) are background and never relaxed. Each test is one exact
 * feasibility question; "unknown" (budget) never counts as "infeasible".
 */
export function explain(I, opt, keptIds, target) {
  const B = buildModel(I, opt), { m, V } = B;
  const fix = [...keptIds, target].map((g) => [V.y[g], 1, 1]);
  const RULES = ['T1-POL-02', 'T2-FLR-01', 'T3-STW-02', 'T3-STW-06', 'T0-SES-06', 'T0-SES-08', 'T0-SES-11', 'T0-SES-10 at least', 'T0-SES-13', 'T0-SES-15 max', 'T5-CAP-01', 'T1-POL-07 at most'];
  const fam = new Map();
  m.cons.forEach((c, k) => { if (RULES.some((r) => c.tag.startsWith(r))) { if (!fam.has(c.tag)) fam.set(c.tag, []); fam.get(c.tag).push(k); } });
  const saved = new Map(); const relax = (tag) => { for (const k of fam.get(tag)) { saved.set(k, m.cons[k].b); m.cons[k].b = Infinity; } };
  const restore = (tag) => { for (const k of fam.get(tag)) m.cons[k].b = saved.get(k); };
  const test = () => solveMip(m, null, { fix, nodeLimit: opt.nodeLimit || 20000 });
  let nodes = 0; const first = test(); nodes += first.nodes;
  if (first.status !== 'infeasible') return { status: first.status === 'optimal' ? 'fits' : 'unknown', conflict: [], nodes };
  // delete in a fixed order: rules a person cannot change first, so that the minutes, floors and climbs stay in the answer when they can
  const order = [...fam.keys()].sort((a, b) => RULES.findIndex((r) => b.startsWith(r)) - RULES.findIndex((r) => a.startsWith(r)) || (a < b ? -1 : 1));
  const conflict = [];
  for (const tag of order) {
    relax(tag); const r = test(); nodes += r.nodes;
    if (r.status === 'infeasible') continue;          // still impossible without it: not part of this conflict
    restore(tag); conflict.push(tag);                  // needed for the contradiction (or unknown: kept, to stay on the safe side)
  }
  return { status: 'infeasible', conflict, nodes };
}

// ------------------------------------------------------------------------------------------------- athletic budget
/**
 * One athletic key over a block (design_milp.md section 9). stations = [{ name, sets:[per week], min, max }] (per-set dose
 * bounds), target = [low, high] weekly dose climbing with the block. Returns the weekly dose and per-set doses:
 * the planned dose follows the target where the stations can hold it, never drops, never passes 1.25 x target + one set.
 */
export function athleticKey(stations, target, N) {
  const tgt = Array.from({ length: N }, (_, i) => Math.round(target[0] + (target[1] - target[0]) * (N === 1 ? 1 : i / (N - 1))));
  const cap = Array.from({ length: N }, (_, w) => stations.reduce((a, s) => a + s.sets[w] * s.max, 0));
  const lo = Array.from({ length: N }, (_, w) => stations.reduce((a, s) => a + s.sets[w] * s.min, 0));
  // upper envelope: a week never plans more than a later week can hold (isotonic: suffix minimum of the caps)
  const env = cap.slice(); for (let w = N - 2; w >= 0; w--) env[w] = Math.min(env[w], env[w + 1]);
  const plan = []; let prev = 0;
  for (let w = 0; w < N; w++) { let a = Math.min(env[w], Math.max(lo[w], tgt[w])); a = Math.max(a, prev); a = Math.min(a, cap[w]); plan.push(a); prev = a; }
  // per-set doses: share the week's dose over the stations' sets, the station that is behind first (house-monotone)
  const per = plan.map((a, w) => { const d = stations.map((s) => s.min); let left = a - stations.reduce((x, s) => x + s.sets[w] * s.min, 0); let guard = 0;
    while (left > 0 && guard++ < 1000) { let k = -1; stations.forEach((s, i) => { if (d[i] < s.max && s.sets[w] > 0 && s.sets[w] <= left && (k === -1 || d[i] / s.max < d[k] / stations[k].max)) k = i; }); if (k === -1) break; d[k]++; left -= stations[k].sets[w]; }
    return d; });
  return { target: tgt, plan, per, attainment: plan.map((a, w) => (tgt[w] ? Math.min(1, a / tgt[w]) : 1)) };
}
