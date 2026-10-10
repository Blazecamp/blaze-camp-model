// design/two-stage/proto/stairway.mjs - PROTOTYPE: the block table between the two certified endpoints.
// Each trained group g goes from S_g (week 1) to P_g (last week) in whole sets, never down, at most one set a week.
//   1. WHEN the week total rises: an exact dynamic program over (week, sorted vector of sets still to add). By the Gale-Ryser
//      theorem a sequence of weekly rises can be shared out among the groups (one set per group per week) iff taking each week's
//      sets from the groups with the most sets left never fails - so the program visits exactly the realizable total paths, and the
//      total-rise rule is checked on the week REALLY placed before it (never on the planned curve).
//   2. WHO steps in which week: a transportation problem with those rises as exact column sums (totally unimodular -> whole numbers),
//      each set as near as possible to the week its own planned curve reaches it.
// Whole numbers in every decision; the planned curve uses + - x / only.

/** planned curve of one group (DEF-10): about 3 % to the halfway week, about 5 % after it, scaled by lambda <= 1 to land on P in week N */
export function plannedCurve(S, P, N, early = 0.03, late = 0.05) {
  const h = Math.ceil(N / 2), steps = [];
  for (let w = 2; w <= N; w++) steps.push(w <= h ? early : late);
  const end = (lam) => steps.reduce((g, s) => g * (1 + lam * s), S);
  let lam = 1;
  if (end(1) > P) { let lo = 0, hi = 1; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (end(mid) > P) hi = mid; else lo = mid; } lam = (lo + hi) / 2; }
  const T = [S];
  for (let w = 2; w <= N; w++) T.push(Math.min(P, T[w - 2] * (1 + lam * steps[w - 2])));
  T[N - 1] = Math.max(T[N - 1], Math.min(P, end(1)));
  if (end(1) >= P) T[N - 1] = P;
  return { T, lam };
}

/**
 * Tier order of the schedule (data; most important first):
 *   last   the last week adds a set (the last week is the hardest: T3-STW-04)
 *   shape  the weekly total closest to the planned 3 % / 5 % curve (small steps early, bigger late: R2-PER-03, R3-VOL-04)
 *   land   most groups stepping onto their peak in the last week (R3-VOL-04)
 *   late   no flat week in the last third (R2-PER-04), later weeks first
 *   flat   fewest flat weeks;  hold  fewest back-to-back flat weeks (R3-SES-02 step 4)
 */
export const DEFAULT_TIERS = ['last', 'shape', 'land', 'late', 'flat', 'hold'];

/** largest allowed rise of the week total after a week with `t` resistance sets: rule 7 (<= 7 %) or rule 10 (strictly below 10 %); one set always */
export const riseCap = { 7: (t) => Math.max(1, Math.floor((7 * t) / 100)), 10: (t) => Math.max(1, Math.ceil(t / 10) - 1) };

/** minimal deterministic min-cost flow (successive shortest paths, SPFA; whole-number capacities and costs) - after design/research/mcf.mjs */
class Flow {
  constructor(n) { this.n = n; this.head = new Int32Array(n).fill(-1); this.to = []; this.cap = []; this.cost = []; this.next = []; }
  edge(u, v, cap, cost) { const e = this.to.length; this.to.push(v, u); this.cap.push(cap, 0); this.cost.push(cost, -cost); this.next.push(this.head[u], this.head[v]); this.head[u] = e; this.head[v] = e + 1; return e; }
  run(s, t) {
    let flow = 0, cost = 0; const n = this.n;
    for (;;) {
      const dist = new Array(n).fill(Infinity), prev = new Int32Array(n).fill(-1), inq = new Uint8Array(n); dist[s] = 0;
      const q = [s]; let qi = 0; inq[s] = 1;
      while (qi < q.length) { const u = q[qi++]; inq[u] = 0; for (let e = this.head[u]; e !== -1; e = this.next[e]) { if (this.cap[e] <= 0) continue; const v = this.to[e], nd = dist[u] + this.cost[e]; if (nd < dist[v]) { dist[v] = nd; prev[v] = e; if (!inq[v]) { inq[v] = 1; q.push(v); } } } }
      if (dist[t] === Infinity) break;
      let push = Infinity; for (let v = t; v !== s; v = this.to[prev[v] ^ 1]) push = Math.min(push, this.cap[prev[v]]);
      for (let v = t; v !== s; v = this.to[prev[v] ^ 1]) { this.cap[prev[v]] -= push; this.cap[prev[v] ^ 1] += push; }
      flow += push; cost += push * dist[t];
    }
    return { flow, cost };
  }
}

/**
 * @param groups [{id, S, P}] in keep order (S = week-1 own sets, P = peak own sets, 0 <= P - S <= N - 1)
 * @param N weeks
 * @param opt {rule: 7|10, base: constant resistance sets of the week (partners, class lifts), tiers: string[], lateFrom}
 * @returns {table:number[][] (group x week), total:number[], rises:number[], flats, lateFlats, landings, climbing, states, tiers}
 */
export function schedule(groups, N, opt = {}) {
  const rule = opt.rule || 7, cap = riseCap[rule];
  const L = groups.map((g) => ({ ...g, ...plannedCurve(g.S, g.P, N) }));
  for (const l of L) if (l.P < l.S || l.P - l.S > N - 1) throw new Error(`stairway: ${l.id} ${l.S} -> ${l.P} cannot be scheduled in ${N} weeks`);
  const u0 = L.map((l) => l.P - l.S), U = u0.reduce((a, b) => a + b, 0), G = L.length;
  const base = (opt.base || 0) + L.reduce((a, l) => a + l.S, 0);
  const ideal = []; for (let w = 1; w <= N; w++) ideal.push(L.reduce((a, l) => a + (l.T[w - 1] - l.S), 0));       // planned sets added by week w
  const lateFrom = opt.lateFrom || N - Math.ceil(N / 3) + 1;                                                    // first week of the last third
  const climbing = u0.filter((x) => x > 0).length;
  // lexicographic tiers as whole-number weights, each larger than the largest possible sum of everything below it
  const order = opt.tiers || DEFAULT_TIERS;
  const tmax = { last: 1, late: 2 ** (N - lateFrom + 1) - 1, shape: 100 * (U + 1) * N, land: G + 1, flat: N, hold: N };
  const W = {}; { let w = 1; for (let i = order.length - 1; i >= 0; i--) { W[order[i]] = w; w *= tmax[order[i]] + 1; } if (w > Number.MAX_SAFE_INTEGER) throw new Error('stairway: tier weights exceed 2^53'); }
  for (const k of Object.keys(tmax)) if (!(k in W)) W[k] = 0;
  const start = u0.slice().sort((a, b) => b - a);
  let layer = new Map([[start.join(',') + '|0', { r: start, flat: 0, cost: 0, prev: null, D: 0 }]]);
  let states = 1;
  for (let w = 2; w <= N; w++) {
    const next = new Map();
    for (const st of layer.values()) {
      const left = st.r.reduce((a, b) => a + b, 0), tot = base + (U - left);
      let nz = 0; for (const x of st.r) if (x > 0) nz++;
      const maxD = Math.min(cap(tot), nz);
      for (let D = 0; D <= maxD; D++) {
        if (w === N && D !== left) continue;                                   // every set is placed by the last week
        const r = st.r.slice(); for (let i = 0; i < D; i++) r[i]--;            // Gale-Ryser: take from the D groups with the most left
        if (r[0] > N - w) continue;                                            // a group can add at most one set a week from here on
        r.sort((a, b) => b - a);
        const placed = U - left + D;
        let c = st.cost + W.shape * Math.round(100 * Math.abs(placed - ideal[w - 1]));
        if (D === 0 && left > 0) { c += W.flat; if (st.flat) c += W.hold; if (w >= lateFrom) c += W.late * 2 ** (w - lateFrom); }
        if (D === 0 && left === 0 && w >= lateFrom) c += W.late * 2 ** (w - lateFrom);   // nothing left to add in a late week is still a flat late week
        if (w === N) { c += W.land * (climbing - D); if (D === 0 && U > 0) c += W.last; }
        const key = r.join(',') + '|' + (D === 0 ? 1 : 0);
        const old = next.get(key);
        if (!old || c < old.cost) next.set(key, { r, flat: D === 0 ? 1 : 0, cost: c, prev: st, D });
      }
    }
    layer = next; states += next.size;
    if (!layer.size) return null;                                              // no schedule under this total rule (the caller applies the one-set cut)
  }
  let best = null; for (const st of layer.values()) if (st.r[0] === 0 && (!best || st.cost < best.cost)) best = st;
  if (!best) return null;
  const rises = new Array(N + 1).fill(0); { let st = best; for (let w = N; w >= 2; w--) { rises[w] = st.D; st = st.prev; } }
  // who steps when: units (g, j) -> weeks, each group at most once a week, column sums = rises
  const units = []; L.forEach((l, g) => { for (let j = 1; j <= u0[g]; j++) { let t = N; for (let w = 2; w <= N; w++) if (l.T[w - 1] >= l.S + j - 0.5) { t = w; break; } units.push({ g, j, t }); } });
  const nU = units.length, src = 0, uB = 1, gwB = uB + nU, wB = gwB + G * (N + 1), snk = wB + N + 1;
  const F = new Flow(snk + 1), arcs = [];
  units.forEach((un, i) => {
    F.edge(src, uB + i, 1, 0);
    for (let w = 2; w <= N; w++) { if (!rises[w]) continue; arcs.push([i, w, F.edge(uB + i, gwB + un.g * (N + 1) + w, 1, 1000 * Math.abs(w - un.t) + un.g)]); }
  });
  for (let g = 0; g < G; g++) for (let w = 2; w <= N; w++) if (rises[w]) F.edge(gwB + g * (N + 1) + w, wB + w, 1, 0);
  for (let w = 2; w <= N; w++) if (rises[w]) F.edge(wB + w, snk, rises[w], 0);
  const fl = F.run(src, snk);
  if (fl.flow !== U) throw new Error('stairway: the rises could not be shared out (Gale-Ryser violated?)');
  const step = L.map(() => new Array(N + 1).fill(0));
  for (const [i, w, e] of arcs) if (F.cap[e ^ 1] > 0) step[units[i].g][w] = 1;
  const table = L.map((l, g) => { const row = [l.S]; for (let w = 2; w <= N; w++) row.push(row[w - 2] + step[g][w]); return row; });
  const total = []; for (let w = 1; w <= N; w++) total.push((opt.base || 0) + table.reduce((a, row) => a + row[w - 1], 0));
  let flats = 0, lateFlats = 0; for (let w = 2; w <= N; w++) if (!rises[w]) { flats++; if (w >= lateFrom) lateFlats++; }
  return { table, total, rises: rises.slice(1), flats, lateFlats, landings: rises[N], climbing, states, tiers: order, rule, curves: L.map((l) => l.T), lambdas: L.map((l) => l.lam) };
}

/** independent certificate of a table: never down, one set a week per group, the total rule on the placed weeks, endpoints */
export function certifyTable(groups, N, res, opt = {}) {
  const cap = riseCap[opt.rule || 7], out = [];
  res.table.forEach((row, g) => {
    if (row[0] !== groups[g].S || row[N - 1] !== groups[g].P) out.push(`${groups[g].id}: endpoints`);
    for (let w = 1; w < N; w++) { const d = row[w] - row[w - 1]; if (d < 0) out.push(`${groups[g].id}: drops in week ${w + 1}`); if (d > 1) out.push(`${groups[g].id}: +${d} in week ${w + 1}`); }
  });
  for (let w = 1; w < N; w++) { const d = res.total[w] - res.total[w - 1]; if (d > cap(res.total[w - 1])) out.push(`total: +${d} after ${res.total[w - 1]} in week ${w + 1}`); }
  return out;
}

/** brute force over every table (tiny instances): the best lexicographic tier vector, for the tests */
export function bruteBest(groups, N, opt = {}) {
  const rule = opt.rule || 7, cap = riseCap[rule], G = groups.length;
  const L = groups.map((g) => ({ ...g, ...plannedCurve(g.S, g.P, N) }));
  const u0 = L.map((l) => l.P - l.S), U = u0.reduce((a, b) => a + b, 0), base = (opt.base || 0) + L.reduce((a, l) => a + l.S, 0);
  const ideal = []; for (let w = 1; w <= N; w++) ideal.push(L.reduce((a, l) => a + (l.T[w - 1] - l.S), 0));
  const lateFrom = opt.lateFrom || N - Math.ceil(N / 3) + 1, climbing = u0.filter((x) => x > 0).length;
  let best = null;
  const cmp = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
  const rec = (w, left, placed, tot, late, shape, flat, hold, prevFlat) => {
    if (w > N) { if (left.some((x) => x > 0)) return; return; }
    const masks = 1 << G;
    for (let m = 0; m < masks; m++) {
      let ok = true, D = 0; const nl = left.slice();
      for (let g = 0; g < G; g++) if (m & (1 << g)) { if (nl[g] <= 0) { ok = false; break; } nl[g]--; D++; }
      if (!ok || D > cap(tot)) continue;
      if (Math.max(...nl) > N - w) continue;
      const rem = nl.reduce((a, b) => a + b, 0);
      const isFlat = D === 0;
      const l2 = late + (isFlat && w >= lateFrom ? 2 ** (w - lateFrom) : 0);
      const s2 = shape + Math.round(100 * Math.abs(placed + D - ideal[w - 1]));
      const f2 = flat + (isFlat && rem + D > 0 ? 1 : 0), h2 = hold + (isFlat && rem + D > 0 && prevFlat ? 1 : 0);
      if (w === N) { if (rem !== 0) continue; const vec = [D === 0 && U > 0 ? 1 : 0, s2, climbing - D, l2, f2, h2]; if (!best || cmp(vec, best) < 0) best = vec; continue; }
      rec(w + 1, nl, placed + D, tot + D, l2, s2, f2, h2, isFlat);
    }
  };
  rec(2, u0, 0, base, 0, 0, 0, 0, false);
  return best;
}
