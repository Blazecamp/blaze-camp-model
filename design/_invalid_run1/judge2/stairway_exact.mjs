// Judge 2 (mathematical rigor) - a stairway scheduler whose hard rules hold on the REALIZED weeks by construction.
// Proposed graft for the planner spec; not engine code. Integer arithmetic only in every decision.
//
// Why: the research flow (design/research/proto_stairway_flow.mjs) takes its hard capacities from the PLANNED curve.
// The coach rules are stated on the realized previous week, so the flow breaks them in tiny and small plans
// (design/judge2/flow_audit.out.txt, prng_audit.out.txt). The weekly-total rule "rise < 10 % of last week" is not a flow
// constraint at all (it couples consecutive cumulative totals with coefficients 10 and 11).
//
// Method (exact, two steps):
//  1. TOTAL PATH by dynamic programming. State after week w = the sorted vector of sets each line still has to add.
//     A weekly rise of D sets is always taken from the D lines with the most sets left (one set per line per week).
//     Theorem used (Gale-Ryser / Havel-Hakimi for bipartite degree sequences): a sequence of weekly rises can be shared
//     out among the lines iff this "largest remaining first" rule never gets stuck. So the DP visits exactly the
//     realizable total paths, and the realized total rule is checked on the true previous total in every transition.
//     Lexicographic objective, exact integer weights that provably dominate: (a) most lines landing in week N,
//     (b) fewest flat weeks, (c) fewest back-to-back flat weeks, (d) closest to the planned 3 % / 5 % total curve.
//  2. WHO STEPS WHEN, by min-cost flow with the weekly rises of step 1 as exact column sums (transportation problem,
//     totally unimodular, integral): each set as close as possible to the week its own planned curve reaches it.
//     A set placed in week N is always a different line (one set per line per week), so landings = the week-N rise.
//  3. CERTIFICATE: every realized rule is re-checked on the final table; a failure throws (it cannot happen if 1-2 hold).
// Run: node design/judge2/stairway_exact.mjs
import { MinCostFlow } from '../research/mcf.mjs';
import { lambdaCurve, flowSchedule } from '../research/proto_stairway_flow.mjs';

export const totalCap = { 10: (t) => Math.max(1, Math.ceil(0.10 * t - 1e-9) - 1), 7: (t) => Math.max(1, Math.floor(0.07 * t + 1e-9)) };

/** @param lines [{S, C}] ; @param rule 10 (hard UNI-05: strictly below +10 %) or 7 (placed.total_pct: at most +7 %) */
export function exactStairway(lines, N, rule = 10) {
  const cap = totalCap[rule];
  const L = lines.map((l) => { const c = lambdaCurve(l.S, l.C, N); return { ...l, ...c, P: Math.min(c.P, l.S + (N - 1)) }; });   // one set per line per week
  const base = L.reduce((a, l) => a + l.S, 0), u0 = L.map((l) => l.P - l.S), U = u0.reduce((a, b) => a + b, 0);
  const ideal = []; for (let w = 1; w <= N; w++) ideal.push(L.reduce((a, l) => a + (Math.min(l.T[w - 1], l.P) - l.S), 0));
  // ---- step 1: DP over weeks; state = sorted remaining vector (descending)
  const W_SHAPE = 1, W_HOLD = 100 * N * (U + 1) + 1, W_FLAT = W_HOLD * (N + 1), W_LAND = W_FLAT * (N + 1);
  const key = (r) => r.join(',');
  let layer = new Map(); const start = u0.slice().sort((a, b) => b - a);
  layer.set(key(start) + '|0', { r: start, flatPrev: 0, cost: 0, prev: null, D: 0 });
  let states = 1;
  for (let w = 2; w <= N; w++) {
    const next = new Map();
    for (const st of layer.values()) {
      const left = st.r.reduce((a, b) => a + b, 0), placed = U - left, tot = base + placed;
      const nz = st.r.filter((x) => x > 0).length;
      const maxD = Math.min(cap(tot), nz);
      for (let D = 0; D <= maxD; D++) {
        if (w === N && D !== left) continue;                     // everything must be placed by the last week
        if (left - D > (N - w) * nz) continue;                   // cheap necessary bound
        const r = st.r.slice(); for (let i = 0; i < D; i++) r[i]--;   // the D largest (r is sorted descending)
        r.sort((a, b) => b - a);
        if (w === N && r[0] !== 0) continue;
        const flat = D === 0 ? 1 : 0;
        let cost = st.cost + W_FLAT * flat + W_HOLD * (flat && st.flatPrev ? 1 : 0) + W_SHAPE * Math.round(100 * Math.abs(placed + D - ideal[w - 1]));
        if (w === N) cost -= W_LAND * D;
        const k = key(r) + '|' + flat;
        const old = next.get(k);
        if (!old || cost < old.cost) next.set(k, { r, flatPrev: flat, cost, prev: st, D });
      }
    }
    layer = next; states += next.size;
    if (!layer.size) throw new Error('no schedule satisfies the hard step rules: lower a peak (stage C must not hand over an unreachable peak)');
  }
  let best = null; for (const st of layer.values()) if (!best || st.cost < best.cost) best = st;
  const D = new Array(N + 1).fill(0); for (let st = best, w = N; st.prev; st = st.prev, w--) D[w] = st.D;
  // ---- step 2: transportation of the sets to lines with the column sums D (min-cost flow, integral)
  const crossing = (T, S, k) => { const lv = S + k; for (let w = 1; w < T.length; w++) if (T[w] >= lv - 1e-9) return w + (lv - T[w - 1]) / Math.max(1e-9, T[w] - T[w - 1]); return T.length; };
  let id = 0; const SRC = id++, SNK = id++; const units = [];
  L.forEach((l, li) => { for (let k = 1; k <= l.P - l.S; k++) units.push({ li, k, t: crossing(l.T, l.S, k), node: id++ }); });
  const cell = L.map(() => { const a = []; for (let w = 0; w <= N; w++) a.push(id++); return a; });
  const week = []; for (let w = 0; w <= N; w++) week.push(id++);
  const f = new MinCostFlow(id); const arcs = [];
  for (const un of units) { f.addEdge(SRC, un.node, 1, 0); const a = []; for (let w = 2; w <= N; w++) a.push([w, f.addEdge(un.node, cell[un.li][w], 1, Math.round(100 * Math.abs(w - un.t)))]); arcs.push(a); }
  for (let w = 2; w <= N; w++) { L.forEach((l, li) => f.addEdge(cell[li][w], week[w], 1, 0)); if (D[w] > 0) f.addEdge(week[w], SNK, D[w], 0); }
  const res = f.run(SRC, SNK, units.length);
  if (res.flow !== units.length) throw new Error('internal: realizable total path could not be shared out (contradicts the theorem)');
  const weeksOf = L.map(() => []);
  units.forEach((un, ui) => { for (const [w, e] of arcs[ui]) if (f.flowOn(e) === 1) weeksOf[un.li].push(w); });
  const sched = L.map((l, li) => { const x = []; for (let w = 1; w <= N; w++) x.push(l.S + weeksOf[li].filter((v) => v <= w).length); return x; });
  // ---- step 3: certificate on the realized table
  const tot = []; for (let w = 0; w < N; w++) tot.push(sched.reduce((a, x) => a + x[w], 0));
  sched.forEach((x, li) => { if (x[0] !== L[li].S || x[N - 1] !== L[li].P) throw new Error('certificate: endpoints'); for (let w = 1; w < N; w++) if (x[w] < x[w - 1] || x[w] - x[w - 1] > 1) throw new Error('certificate: line step'); });
  for (let w = 1; w < N; w++) if (tot[w] - tot[w - 1] > cap(tot[w - 1])) throw new Error('certificate: total step');
  const climbing = L.filter((l) => l.P > l.S).length;
  return { L, sched, tot, D, land: D[N], climbing, flats: D.slice(2).filter((d) => d === 0).length, states };
}

// ------------------------------------------------------------------------------------------------- self-test
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0); }; }
  // exact reference on small plans: DP over weeks on the UNSORTED remaining vector and every subset of lines
  function reference(S, P, N, cap) {
    const k = S.length, u = S.map((s, i) => P[i] - s), base = S.reduce((a, b) => a + b, 0), U = u.reduce((a, b) => a + b, 0);
    const mult = []; let m = 1; for (let i = 0; i < k; i++) { mult.push(m); m *= u[i] + 1; }
    const dec = (code) => u.map((ui, i) => Math.floor(code / mult[i]) % (ui + 1));
    const BIG = 1000;
    let cur = new Map([[u.reduce((a, ui, i) => a + ui * mult[i], 0), 0]]);
    for (let w = 2; w <= N; w++) {
      const nxt = new Map();
      for (const [code, cost] of cur) {
        const r = dec(code), tot = base + U - r.reduce((a, b) => a + b, 0), c = cap(tot);
        const can = []; for (let i = 0; i < k; i++) if (r[i] > 0) can.push(i);
        for (let mask = 0; mask < (1 << can.length); mask++) {
          let cnt = 0, nc = code; for (let b = 0; b < can.length; b++) if (mask >> b & 1) { cnt++; nc -= mult[can[b]]; }
          if (cnt > c) continue;
          let v = cost + (cnt === 0 ? 1 : 0);
          if (w === N) { if (nc !== 0) continue; v -= BIG * cnt; }
          const old = nxt.get(nc); if (old === undefined || v < old) nxt.set(nc, v);
        }
      }
      cur = nxt;
    }
    const best = cur.get(0); if (best === undefined) return null;
    const land = Math.max(0, Math.ceil(-best / BIG - 1e-9)); return { land, flats: best + BIG * land };
  }
  for (const rule of [10, 7]) {
    const g = mulberry32(99 + rule), rnd = (k) => g() % k;
    let cmp = 0, diff = 0, refNone = 0, thrown = 0; const ex = [];
    for (let t = 0; t < 4000; t++) {
      const N = 4 + rnd(8), k = 1 + rnd(5); const lines = [];
      for (let i = 0; i < k; i++) { const S = 6 + rnd(15); lines.push({ n: 'l' + i, S, C: S + 1 + rnd(4) }); }
      let r; try { r = exactStairway(lines, N, rule); } catch (e) { thrown++; r = null; }
      const Lc = (r ? r.L : lines.map((l) => { const c = lambdaCurve(l.S, l.C, N); return { ...l, P: Math.min(c.P, l.S + N - 1) }; }));
      const ref = reference(Lc.map((l) => l.S), Lc.map((l) => l.P), N, totalCap[rule]);
      if (!ref) { refNone++; if (r) { diff++; ex.push('scheduler returned a plan where none exists'); } continue; }
      if (!r) { diff++; if (ex.length < 3) ex.push(`scheduler threw but a schedule exists: N ${N} ${Lc.map((l) => `${l.S}->${l.P}`).join(' ')}`); continue; }
      cmp++;
      if (r.land !== ref.land || r.flats !== ref.flats) { diff++; if (ex.length < 3) ex.push(JSON.stringify({ N, lines: Lc.map((l) => `${l.S}->${l.P}`).join(' '), got: [r.land, r.flats], ref })); }
    }
    console.log(`rule ${rule} %: exact scheduler vs brute-force reference on ${cmp} small plans (+ ${refNone} with no schedule at all, ${thrown} thrown): (landings, flat weeks) differ in ${diff}`);
    for (const e of ex) console.log('   ' + e);
  }
  // the intended research distribution: hard rules by construction (the certificate throws otherwise) + speed + comparison
  const LV = [[10, 14], [15, 22], [20, 25], [12, 22], [15, 25], [6, 7], [9, 22], [12, 14]];
  for (const rule of [10, 7]) {
    const g = mulberry32(3), rnd = (k) => g() % k;
    let plans = 0, thrown = 0, maxMs = 0, sumMs = 0, maxStates = 0, landAll = 0, climbingPlans = 0, flatPlans = 0, flowFlatPlans = 0, flowViol = 0, flatsSum = 0, flowFlatsSum = 0, landSum = 0, climbSum = 0;
    for (let t = 0; t < 20000; t++) {
      const N = 4 + rnd(13), k = 1 + rnd(12); const lines = [];
      for (let i = 0; i < k; i++) { const [S, C] = LV[rnd(LV.length)]; const f = rnd(4) === 0 ? 1 + rnd(3) : 0; lines.push({ n: 'l' + i, S: S + f, C: C + f }); }
      const t0 = process.hrtime.bigint(); let r;
      try { r = exactStairway(lines, N, rule); } catch (e) { thrown++; continue; }
      const ms = Number(process.hrtime.bigint() - t0) / 1e6; maxMs = Math.max(maxMs, ms); sumMs += ms; maxStates = Math.max(maxStates, r.states); plans++;
      if (r.climbing) { climbingPlans++; if (r.land === r.climbing) landAll++; landSum += r.land; climbSum += r.climbing; }
      if (r.flats) flatPlans++; flatsSum += r.flats;
      const fl = flowSchedule(lines, N); const ft = []; for (let w = 0; w < N; w++) ft.push(fl.sched.reduce((a, x) => a + x[w], 0));
      let ff = 0, bad = false; for (let w = 1; w < N; w++) { if (ft[w] === ft[w - 1]) ff++; if (ft[w] - ft[w - 1] > totalCap[rule](ft[w - 1])) bad = true; }
      if (ff) flowFlatPlans++; flowFlatsSum += ff; if (bad) flowViol++;
    }
    console.log(`\nrule ${rule} %, intended distribution: ${plans} plans scheduled, ${thrown} thrown; realized-rule violations 0 by certificate (research flow on the same plans: ${flowViol} plans break the rule)`);
    console.log(`   every climbing line lands in week N: ${landAll}/${climbingPlans} plans; lines landing ${landSum}/${climbSum}`);
    console.log(`   plans with a flat week: ${flatPlans} (research flow: ${flowFlatPlans}); flat weeks in all ${flatsSum} (research flow: ${flowFlatsSum})`);
    console.log(`   time: mean ${(sumMs / plans).toFixed(2)} ms, max ${maxMs.toFixed(1)} ms; most DP states in one plan ${maxStates}`);
  }
  // the coach's own shapes
  for (const [name, lines, N] of [['pickleball 2 x 45 (hips 10->14, calves 6->7)', [{ S: 10, C: 14 }, { S: 6, C: 7 }], 12], ['hips 12->14 + calves 6->7, 14 wk (the flow breaks 10 % here)', [{ S: 12, C: 14 }, { S: 6, C: 7 }], 14],
    ['L1 full body (8 x 10->14, calves 12->14)', [...Array(8).fill({ S: 10, C: 14 }), { S: 12, C: 14 }], 12]]) {
    for (const rule of [10, 7]) { const r = exactStairway(lines, N, rule); console.log(`\n${name}, rule ${rule} %: totals ${r.tot.join(' ')} | landings ${r.land}/${r.climbing} | flat weeks ${r.flats}`); if (lines.length <= 3) r.sched.forEach((x) => console.log('     ' + x.join(' '))); }
  }
}
