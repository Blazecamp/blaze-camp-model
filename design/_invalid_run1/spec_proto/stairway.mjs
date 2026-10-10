// design/spec_proto/stairway.mjs - SPEC PROTOTYPE (evidence for design/PLANNER_SPEC.md section 9, not engine code).
//
// The exact stairway on the PLACED weeks (judge 2's scheduler, with the tier order the coach-fidelity judge asked for):
//   hard, by construction of every transition:
//     - a group never drops and adds at most one whole set a week
//     - the weekly total of resistance sets rises by at most the chosen limit of the week really placed before it
//       (7 %: at most floor(0.07 x last week); 10 %: strictly below +10 %); one whole set may always be added
//     - every group is on its peak in the last week
//   tiers, lexicographic (whole-number weights computed from the instance so each tier dominates the next; the order is data):
//     late   no flat week in the last third of the block, the last week first (R2-PER-04 "the last four weeks ... each week more")
//     shape  the weekly total closest to the planned 3 % / 5 % curve (R2-PER-03, R3-VOL-04)
//     land   most groups stepping onto their peak in the last week (R3-VOL-04 "reaches its ceiling exactly in the last week")
//     flat   fewest flat weeks, then  hold  fewest back-to-back flat weeks (R3-SES-02 step 4)
//   default order late > shape > land > flat > hold; the coach decision "landing first" is opt.tiers = ['late','land','shape',...]
//   then WHO steps WHEN: a transportation problem with the weekly rises as exact column sums, each set as close as possible to
//   the week its own planned curve reaches it; ties broken by one canonical key (unique optimum: a refactor cannot change a plan).
// Whole numbers in every decision (BigInt in the transportation costs). The planned curve uses + - x / only (60 bisection steps).

/** planned curve of one group: about 3 % to the halfway week, about 5 % after it, scaled by lambda to land on P in week N */
export function plannedCurve(S, P, N, early = 0.03, late = 0.05) {
  const h = Math.ceil(N / 2), steps = []; for (let w = 2; w <= N; w++) steps.push(w <= h ? early : late);
  const end = (lam) => steps.reduce((g, s) => g * (1 + lam * s), S);
  let lam = 1;
  if (end(1) > P) { let lo = 0, hi = 1; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (end(mid) > P) hi = mid; else lo = mid; } lam = (lo + hi) / 2; }
  const T = [S]; for (let w = 2; w <= N; w++) T.push(Math.min(P, T[w - 2] * (1 + lam * steps[w - 2])));
  if (end(1) >= P) T[N - 1] = P;                                       // lambda <= 1: the curve lands on the peak in the last week
  return { T, lam };
}

export const totalCap = { 7: (t) => Math.max(1, Math.floor((7 * t) / 100)), 10: (t) => Math.max(1, Math.ceil(t / 10) - 1) };

/**
 * @param groups [{id, S, P}] in priority (keep) order; S = week-1 direct sets, P = peak direct sets, P - S <= N - 1
 * @param N weeks; opt {rule: 7 | 10, base: resistance sets that never change (pattern stations, optional-day slots), lateFrom}
 * @returns {sched: [group][week] direct sets, tot, D, land, climbing, flats, lateFlats, states}
 */
export function exactStairway(groups, N, opt = {}) {
  const rule = opt.rule || 7, cap = totalCap[rule], base0 = opt.base || 0;
  const L = groups.map((g) => ({ ...g, ...plannedCurve(g.S, g.P, N) }));
  for (const l of L) if (l.P - l.S > N - 1 || l.P < l.S) throw new Error(`stairway: ${l.id} ${l.S} -> ${l.P} cannot be scheduled in ${N} weeks`);
  const base = base0 + L.reduce((a, l) => a + l.S, 0), u0 = L.map((l) => l.P - l.S), U = u0.reduce((a, b) => a + b, 0), G = L.length;
  const ideal = []; for (let w = 1; w <= N; w++) ideal.push(L.reduce((a, l) => a + (l.T[w - 1] - l.S), 0));
  const lateFrom = opt.lateFrom || N - Math.ceil(N / 3) + 1;             // first week of the last third
  // tier order (most important first) and whole-number weights: each weight exceeds the largest possible sum of all tiers below
  const order = opt.tiers || ['late', 'shape', 'land', 'flat', 'hold'];
  const tierMax = { late: 2 ** (N - lateFrom + 1) - 1, shape: 100 * (U + 1) * N, land: G + 1, flat: N, hold: N }, W = {};
  { let w = 1; for (let i = order.length - 1; i >= 0; i--) { W[order[i]] = w; w *= tierMax[order[i]] + 1; } if (w > Number.MAX_SAFE_INTEGER) throw new Error('stairway: weights exceed 2^53'); }
  for (const k of Object.keys(tierMax)) if (!(k in W)) W[k] = 0;
  let layer = new Map(); const start = u0.slice().sort((a, b) => b - a);
  layer.set(start.join(',') + '|0', { r: start, flatPrev: 0, cost: 0, prev: null, D: 0 });
  let states = 1;
  for (let w = 2; w <= N; w++) {
    const next = new Map();
    for (const st of layer.values()) {
      const left = st.r.reduce((a, b) => a + b, 0), placed = U - left, tot = base + placed;
      let nz = 0; for (const x of st.r) if (x > 0) nz++;
      const maxD = Math.min(cap(tot), nz);
      for (let D = 0; D <= maxD; D++) {
        if (w === N && D !== left) continue;                            // everything is placed by the last week
        if (left - D > (N - w) * nz) continue;                          // necessary: one set per group per week from here on
        const r = st.r.slice(); for (let i = 0; i < D; i++) r[i]--;     // largest-remaining-first (Gale-Ryser): r is sorted
        r.sort((a, b) => b - a);
        if (r[0] > N - w) continue;
        const flat = D === 0 ? 1 : 0;
        let cost = st.cost + W.flat * flat + W.hold * (flat && st.flatPrev ? 1 : 0) + W.shape * Math.round(100 * Math.abs(placed + D - ideal[w - 1]));
        if (flat && w >= lateFrom) cost += W.late * 2 ** (w - lateFrom);   // a flat week in the last third; the later, the worse (the last week first)
        if (w === N) cost += W.land * (nz0(u0) - D);                    // groups that do not step onto their peak in the last week
        const k = r.join(',') + '|' + flat, old = next.get(k);
        if (!old || cost < old.cost) next.set(k, { r, flatPrev: flat, cost, prev: st, D });
      }
    }
    layer = next; states += next.size;
    if (!layer.size) throw new Error('stairway: no schedule satisfies the hard step rules (the endpoint stage handed over an unreachable peak)');
  }
  let best = null; for (const st of layer.values()) if (!best || st.cost < best.cost) best = st;
  const D = new Array(N + 1).fill(0); for (let st = best, w = N; st.prev; st = st.prev, w--) D[w] = st.D;
  // ---- who steps when: transportation with column sums D (successive shortest paths, BigInt costs, unique optimum)
  const cross = (l, k) => { const lv = l.S + k - 0.5; for (let w = 1; w < N; w++) if (l.T[w] >= lv) return w + 1 - (l.T[w] - lv) / Math.max(1e-12, l.T[w] - l.T[w - 1]); return N; };
  const units = []; L.forEach((l, li) => { for (let k = 1; k <= l.P - l.S; k++) units.push({ li, k, t: cross(l, k) }); });
  const nU = units.length, SRC = 0, SNK = 1, uN = (i) => 2 + i, cN = (li, w) => 2 + nU + li * (N + 1) + w, wN = (w) => 2 + nU + G * (N + 1) + w;
  const f = new Flow(2 + nU + G * (N + 1) + N + 1);
  const BASE = 1n << BigInt((N - 1) * G + 2), arcs = [];
  units.forEach((un, ui) => {
    f.add(SRC, uN(ui), 1, 0n); const a = [];
    for (let w = 2; w <= N; w++) a.push([w, f.add(uN(ui), cN(un.li, w), 1, BASE * BigInt(Math.round(100 * Math.abs(w - un.t))) + (1n << BigInt((w - 2) + (N - 1) * (G - 1 - un.li))))]);
    arcs.push(a);
  });
  for (let w = 2; w <= N; w++) { for (let li = 0; li < G; li++) f.add(cN(li, w), wN(w), 1, 0n); if (D[w] > 0) f.add(wN(w), SNK, D[w], 0n); }
  if (f.run(SRC, SNK, nU) !== nU) throw new Error('stairway: a realizable total path could not be shared out (contradicts the theorem)');
  const weeksOf = L.map(() => []);
  units.forEach((un, ui) => { for (const [w, e] of arcs[ui]) if (f.flowOn(e) === 1) weeksOf[un.li].push(w); });
  const sched = L.map((l, li) => { const x = []; for (let w = 1; w <= N; w++) x.push(l.S + weeksOf[li].filter((v) => v <= w).length); return x; });
  // ---- certificate on the placed table
  const tot = []; for (let w = 0; w < N; w++) tot.push(base0 + sched.reduce((a, x) => a + x[w], 0));
  sched.forEach((x, li) => { if (x[0] !== L[li].S || x[N - 1] !== L[li].P) throw new Error('certificate: endpoints'); for (let w = 1; w < N; w++) if (x[w] < x[w - 1] || x[w] - x[w - 1] > 1) throw new Error('certificate: group step'); });
  for (let w = 1; w < N; w++) if (tot[w] - tot[w - 1] > cap(tot[w - 1])) throw new Error('certificate: total step');
  let flats = 0, lateFlats = 0, lateKey = 0; for (let w = 2; w <= N; w++) if (D[w] === 0) { flats++; if (w >= lateFrom) { lateFlats++; lateKey += 2 ** (w - lateFrom); } }
  return { sched, tot, D, land: D[N], climbing: nz0(u0), flats, lateFlats, lateKey, states, lam: L.map((l) => l.lam), T: L.map((l) => l.T) };
}
const nz0 = (u) => u.filter((x) => x > 0).length;

/** deterministic min-cost flow, successive shortest paths (Bellman-Ford with a FIFO queue), BigInt costs */
class Flow {
  constructor(n) { this.n = n; this.head = new Int32Array(n).fill(-1); this.to = []; this.cap = []; this.cost = []; this.next = []; }
  add(u, v, cap, cost) { const e = this.to.length; this.to.push(v, u); this.cap.push(cap, 0); this.cost.push(cost, -cost); this.next.push(this.head[u], this.head[v]); this.head[u] = e; this.head[v] = e + 1; return e; }
  run(s, t, want) {
    let flow = 0; const n = this.n;
    while (flow < want) {
      const dist = new Array(n).fill(null), inq = new Uint8Array(n), prev = new Int32Array(n).fill(-1); dist[s] = 0n;
      const q = [s]; inq[s] = 1;
      for (let qi = 0; qi < q.length; qi++) {
        const u = q[qi]; inq[u] = 0;
        for (let e = this.head[u]; e !== -1; e = this.next[e]) {
          if (this.cap[e] <= 0) continue;
          const v = this.to[e], nd = dist[u] + this.cost[e];
          if (dist[v] === null || nd < dist[v]) { dist[v] = nd; prev[v] = e; if (!inq[v]) { inq[v] = 1; q.push(v); } }
        }
      }
      if (dist[t] === null) break;
      for (let v = t; v !== s; v = this.to[prev[v] ^ 1]) { this.cap[prev[v]] -= 1; this.cap[prev[v] ^ 1] += 1; }
      flow++;
    }
    return flow;
  }
  flowOn(e) { return this.cap[e ^ 1]; }
}

// ------------------------------------------------------------------------------------------------- self-test
if (import.meta.url === `file://${process.argv[1]}`) {
  const mul = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; };
  // brute-force reference on small plans: every subset of groups every week, the same tier vector, compared lexicographically
  function brute(gs, N, rule, base0 = 0) {
    const cap = totalCap[rule], k = gs.length, u = gs.map((g) => g.P - g.S), U = u.reduce((a, b) => a + b, 0), base = base0 + gs.reduce((a, g) => a + g.S, 0);
    const lateFrom = N - Math.ceil(N / 3) + 1, memo = new Map();
    const better = (a, b) => !b || a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
    const rec = (w, r) => {                                      // best [late flat weeks, -landings] from week w on
      const key = w + '|' + r.join(','); if (memo.has(key)) return memo.get(key);
      const left = r.reduce((a, b) => a + b, 0), tot = base + U - left, can = []; for (let i = 0; i < k; i++) if (r[i] > 0) can.push(i);
      let best = null;
      for (let m = 0; m < (1 << can.length); m++) {
        let c = 0; const r2 = r.slice(); for (let b = 0; b < can.length; b++) if (m >> b & 1) { c++; r2[can[b]]--; }
        if (c > cap(tot)) continue;
        const late = c === 0 && w >= lateFrom ? 2 ** (w - lateFrom) : 0;
        if (w === N) { if (r2.some((x) => x)) continue; const v = [late, -c]; if (better(v, best)) best = v; continue; }
        const sub = rec(w + 1, r2); if (!sub) continue;
        const v = [late + sub[0], sub[1]]; if (better(v, best)) best = v;
      }
      memo.set(key, best); return best;
    };
    const b = rec(2, u);
    return b && { lateFlats: b[0], land: -b[1] };
  }
  for (const rule of [7, 10]) {
    const g = mul(11 + rule), rnd = (n) => g() % n; let cmp = 0, diff = 0, none = 0; const seenK = {}, seenN = {};
    for (let t = 0; t < 3000; t++) {
      const N = 4 + rnd(7), k = 1 + rnd(4), gs = []; seenK[k] = (seenK[k] || 0) + 1; seenN[N] = (seenN[N] || 0) + 1;
      for (let i = 0; i < k; i++) { const S = 6 + rnd(15); gs.push({ id: 'g' + i, S, P: S + 1 + rnd(Math.min(4, N - 1)) }); }
      let r = null; try { r = exactStairway(gs, N, { rule, tiers: ['late', 'land', 'shape', 'flat', 'hold'] }); } catch (e) { r = null; }
      const ref = brute(gs, N, rule);
      if (!ref) { none++; if (r) diff++; continue; }
      if (!r) { diff++; continue; }
      cmp++; if (r.lateKey !== ref.lateFlats || r.land !== ref.land) diff++;
    }
    if (Object.keys(seenK).length < 4 || Object.keys(seenN).length < 7) throw new Error('the random test did not draw the distribution it claims');
    console.log(`rule ${rule} %: scheduler vs brute force on ${cmp} small plans (${none} with no schedule): (late flat weeks, landings) differ in ${diff}; sizes drawn: groups ${JSON.stringify(seenK)}, weeks ${JSON.stringify(seenN)}`);
  }
  for (const [name, gs, N, base] of [
    ['pickleball 2 x 45: hips 10 -> 14, calves 6 -> 7', [{ id: 'calves', S: 6, P: 7 }, { id: 'hips', S: 10, P: 14 }], 12, 2],
    ['L2 big line alone 15 -> 22 (his approved example ends 19 20 21 22)', [{ id: 'quads', S: 15, P: 22 }], 12, 0],
    ['L1 full body: 8 groups 10 -> 14, calves 12 -> 14', [...Array.from({ length: 8 }, (_, i) => ({ id: 'g' + i, S: 10, P: 14 })), { id: 'calves', S: 12, P: 14 }], 12, 0]]) {
    for (const rule of [7, 10]) for (const tiers of [['late', 'shape', 'land', 'flat', 'hold'], ['late', 'land', 'shape', 'flat', 'hold']]) { const r = exactStairway(gs, N, { rule, base, tiers }); console.log(`${name} | rule ${rule} %, ${tiers.slice(0, 3).join(' > ')}: total ${r.tot.join(' ')} | landings ${r.land}/${r.climbing} | flat ${r.flats} (late ${r.lateFlats}) | states ${r.states}`); if (gs.length <= 2) r.sched.forEach((x, i) => console.log(`     ${gs[i].id.padEnd(7)} ${x.join(' ')}`)); }
  }
}
