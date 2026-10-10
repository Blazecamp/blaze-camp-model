// design/spec_checks/stairway_v2.mjs - evidence for PLANNER_SPEC.md 7.7 (the stairway scheduler as specified).
// A copy of the two-stage prototype scheduler (design/two-stage/proto/stairway.mjs, read-only source) with the three changes the
// spec makes:
//   1. the tier order is data; the spec default is  last, flat, hold, late, shape, land  (judge 2: flat weeks ahead of the curve)
//   2. the transportation step ("who steps when") puts every group's FINAL set as late as the weekly rises allow, before it looks
//      at the curve timing (review finding R0x-ceiling: groups at their ceiling weeks early)
//   3. existsSchedule(): a greedy yes / no test "is there any schedule under the total-rise rule?" used by the peak ladder
// It prints the coach's lines under four orders and compares, on random tables of real size, (a) the greedy existence test with
// the dynamic program, (b) flat weeks against the arithmetic minimum, (c) how early groups reach their peak.
//   node design/spec_checks/stairway_v2.mjs [tables] [seed]
import { plannedCurve, riseCap, certifyTable } from '../two-stage/proto/stairway.mjs';
import { rng } from '../two-stage/proto/core.mjs';

class Flow {
  constructor(n) { this.n = n; this.head = new Int32Array(n).fill(-1); this.to = []; this.cap = []; this.cost = []; this.next = []; }
  edge(u, v, cap, cost) { const e = this.to.length; this.to.push(v, u); this.cap.push(cap, 0); this.cost.push(cost, -cost); this.next.push(this.head[u], this.head[v]); this.head[u] = e; this.head[v] = e + 1; return e; }
  run(s, t) {
    let flow = 0; const n = this.n;
    for (;;) {
      const dist = new Array(n).fill(Infinity), prev = new Int32Array(n).fill(-1), inq = new Uint8Array(n); dist[s] = 0;
      const q = [s]; let qi = 0; inq[s] = 1;
      while (qi < q.length) { const u = q[qi++]; inq[u] = 0; for (let e = this.head[u]; e !== -1; e = this.next[e]) { if (this.cap[e] <= 0) continue; const v = this.to[e], nd = dist[u] + this.cost[e]; if (nd < dist[v]) { dist[v] = nd; prev[v] = e; if (!inq[v]) { inq[v] = 1; q.push(v); } } } }
      if (dist[t] === Infinity) break;
      let push = Infinity; for (let v = t; v !== s; v = this.to[prev[v] ^ 1]) push = Math.min(push, this.cap[prev[v]]);
      for (let v = t; v !== s; v = this.to[prev[v] ^ 1]) { this.cap[prev[v]] -= push; this.cap[prev[v] ^ 1] += push; }
      flow += push;
    }
    return flow;
  }
}

/** greedy existence test: every week take as many sets as the rule allows, from the groups with the most sets left */
export function existsSchedule(groups, N, opt = {}) {
  const cap = riseCap[opt.rule || 7];
  const left = groups.map((g) => g.P - g.S).sort((a, b) => b - a);
  if (left.some((x) => x < 0 || x > N - 1)) return false;
  let tot = (opt.base || 0) + groups.reduce((a, g) => a + g.S, 0);
  for (let w = 2; w <= N; w++) {
    const D = Math.min(cap(tot), left.filter((x) => x > 0).length);
    for (let i = 0; i < D; i++) left[i]--;
    left.sort((a, b) => b - a); tot += D;
    if (left[0] > N - w) return false;
  }
  return left[0] === 0;
}

export function schedule(groups, N, opt = {}) {
  const rule = opt.rule || 7, cap = riseCap[rule];
  const L = groups.map((g) => ({ ...g, ...plannedCurve(g.S, g.P, N) }));
  for (const l of L) if (l.P < l.S || l.P - l.S > N - 1) return null;
  const u0 = L.map((l) => l.P - l.S), U = u0.reduce((a, b) => a + b, 0), G = L.length;
  const base = (opt.base || 0) + L.reduce((a, l) => a + l.S, 0);
  const ideal = []; for (let w = 1; w <= N; w++) ideal.push(L.reduce((a, l) => a + (l.T[w - 1] - l.S), 0));
  const lateFrom = opt.lateFrom || N - Math.ceil(N / 3) + 1;
  const climbing = u0.filter((x) => x > 0).length;
  const order = opt.tiers;
  const tmax = { last: 1, late: 2 ** (N - lateFrom + 1) - 1, shape: 100 * (U + 1) * N, land: G + 1, flat: N, hold: N };
  const W = {}; { let w = 1; for (let i = order.length - 1; i >= 0; i--) { W[order[i]] = w; w *= tmax[order[i]] + 1; } if (w > Number.MAX_SAFE_INTEGER) throw new Error('tier weights exceed 2^53'); }
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
        if (w === N && D !== left) continue;
        const r = st.r.slice(); for (let i = 0; i < D; i++) r[i]--;
        if (r[0] > N - w) continue;
        r.sort((a, b) => b - a);
        const placed = U - left + D;
        let c = st.cost + W.shape * Math.round(100 * Math.abs(placed - ideal[w - 1]));
        if (D === 0 && left > 0) { c += W.flat; if (st.flat) c += W.hold; if (w >= lateFrom) c += W.late * 2 ** (w - lateFrom); }
        if (D === 0 && left === 0 && w >= lateFrom) c += W.late * 2 ** (w - lateFrom);
        if (w === N) { c += W.land * (climbing - D); if (D === 0 && U > 0) c += W.last; }
        const key = r.join(',') + '|' + (D === 0 ? 1 : 0);
        const old = next.get(key);
        if (!old || c < old.cost) next.set(key, { r, flat: D === 0 ? 1 : 0, cost: c, prev: st, D });
      }
    }
    layer = next; states += next.size;
    if (!layer.size) return null;
  }
  let best = null; for (const st of layer.values()) if (st.r[0] === 0 && (!best || st.cost < best.cost)) best = st;
  if (!best) return null;
  const rises = new Array(N + 1).fill(0); { let st = best; for (let w = N; w >= 2; w--) { rises[w] = st.D; st = st.prev; } }
  const units = []; L.forEach((l, g) => { for (let j = 1; j <= u0[g]; j++) { let t = N; for (let w = 2; w <= N; w++) if (l.T[w - 1] >= l.S + j - 0.5) { t = w; break; } units.push({ g, j, t, final: j === u0[g] }); } });
  const nU = units.length, src = 0, uB = 1, gwB = uB + nU, wB = gwB + G * (N + 1), snk = wB + N + 1;
  const F = new Flow(snk + 1), arcs = [];
  // cost of putting unit (g, j) into week w: [final set as late as possible] >> [distance to the week its own curve reaches it] >> keep order
  const BIG = 1000 * N * (nU + 1) * 2;
  units.forEach((un, i) => {
    F.edge(src, uB + i, 1, 0);
    for (let w = 2; w <= N; w++) { if (!rises[w]) continue; arcs.push([i, w, F.edge(uB + i, gwB + un.g * (N + 1) + w, 1, (opt.finalLate && un.final ? BIG * (N - w) : 0) + 1000 * Math.abs(w - un.t) + un.g)]); }
  });
  for (let g = 0; g < G; g++) for (let w = 2; w <= N; w++) if (rises[w]) F.edge(gwB + g * (N + 1) + w, wB + w, 1, 0);
  for (let w = 2; w <= N; w++) if (rises[w]) F.edge(wB + w, snk, rises[w], 0);
  if (F.run(src, snk) !== U) throw new Error('the rises could not be shared out');
  const stepW = L.map(() => []);
  for (const [i, w, e] of arcs) if (F.cap[e ^ 1] > 0) stepW[units[i].g].push(w);
  const table = L.map((l, g) => { const ws = new Set(stepW[g]); const row = [l.S]; for (let w = 2; w <= N; w++) row.push(row[w - 2] + (ws.has(w) ? 1 : 0)); return row; });
  const total = []; for (let w = 1; w <= N; w++) total.push((opt.base || 0) + table.reduce((a, row) => a + row[w - 1], 0));
  let flats = 0, lateFlats = 0, holds = 0; for (let w = 2; w <= N; w++) if (!rises[w]) { flats++; if (w >= lateFrom) lateFlats++; if (w > 2 && !rises[w - 1]) holds++; }
  const lastStep = table.map((row) => { let w = 1; for (let i = 1; i < row.length; i++) if (row[i] > row[i - 1]) w = i + 1; return w; });
  const shapeDev = total.reduce((a, t, i) => a + Math.abs(t - (opt.base || 0) - L.reduce((x, l) => x + l.S, 0) - ideal[i]), 0);
  return { table, total, rises: rises.slice(1), flats, lateFlats, holds, landings: rises[N], climbing, states, rule, lastStep, shapeDev, lateFrom };
}

const ORDERS = {
  'P prototype default (last, shape, land, late, flat, hold)': ['last', 'shape', 'land', 'late', 'flat', 'hold'],
  'A judge 2 (last, flat, hold, late, land, shape)': ['last', 'flat', 'hold', 'late', 'land', 'shape'],
  'B spec default (last, flat, hold, late, shape, land)': ['last', 'flat', 'hold', 'late', 'shape', 'land'],
};
if (import.meta.url === `file://${process.argv[1]}`) {
  const CASES = [
    { name: "coach's L2 line 15 -> 22 (R3-VOL-04: 'the last four weeks 19, 20, 21, 22')", N: 12, base: 0, groups: [{ id: 'big', S: 15, P: 22 }] },
    { name: '2 x 45 example (12 section 5.5): calves 6 -> 7, hips 10 -> 14, 2 constant sets', N: 12, base: 2, groups: [{ id: 'calves', S: 6, P: 7 }, { id: 'hips', S: 10, P: 14 }] },
    { name: 'pickleball sample: calves 6 -> 7, hips 10 -> 12, 2 constant sets', N: 12, base: 2, groups: [{ id: 'calves', S: 6, P: 7 }, { id: 'hips', S: 10, P: 12 }] },
    { name: 'swimmer sample: back 10 -> 15, hips 10 -> 12, 2 constant sets', N: 12, base: 2, groups: [{ id: 'back', S: 10, P: 15 }, { id: 'hips', S: 10, P: 12 }] },
    { name: 'L1 full body: eight groups 10 -> 14, calves 12 -> 14', N: 12, base: 0, groups: [...Array.from({ length: 8 }, (_, i) => ({ id: 'g' + i, S: 10, P: 14 })), { id: 'calves', S: 12, P: 14 }] },
    { name: 'L2 full plan: five big 15 -> 22, three small 12 -> 18, calves 12 -> 16', N: 12, base: 0, groups: [...Array.from({ length: 5 }, (_, i) => ({ id: 'b' + i, S: 15, P: 22 })), ...Array.from({ length: 3 }, (_, i) => ({ id: 's' + i, S: 12, P: 18 })), { id: 'calves', S: 12, P: 16 }] },
  ];
  for (const c of CASES) {
    console.log('\n## ' + c.name);
    for (const [label, tiers] of Object.entries(ORDERS)) for (const finalLate of label[0] === 'B' ? [false, true] : [false]) {
      const r = schedule(c.groups, c.N, { rule: 7, base: c.base, tiers, finalLate });
      const cert = certifyTable(c.groups, c.N, r, { rule: 7 });
      const maxRise = Math.max(...r.total.slice(1).map((t, i) => (100 * (t - r.total[i])) / r.total[i]));
      console.log(`  ${label}${finalLate ? ' + final set late' : ''}\n     total ${r.total.join(' ')} | flat ${r.flats}, late flat ${r.lateFlats}, largest rise ${maxRise.toFixed(1)} %, last step in weeks ${r.lastStep.join(',')}${cert.length ? ' CERT ' + cert.join(';') : ''}`);
      if (c.groups.length <= 2 && label[0] === 'B' && finalLate) for (const [g, row] of r.table.entries()) console.log(`     ${c.groups[g].id}: ${row.join(' ')}`);
    }
  }
  // random tables of real size
  const COUNT = Number(process.argv[2] || 4000), R = rng(Number(process.argv[3] || 20261010));
  const stat = {}; let exDiff = 0, exNo7 = 0, exNo10 = 0, drawn = 0, minUnreach = 0;
  const hist = { groups: {}, N: {} };
  for (let t = 0; t < COUNT; t++) {
    const N = R.pick([6, 8, 12, 16]), G = R.range(1, 8), groups = [];
    for (let g = 0; g < G; g++) { const S = R.range(6, 20); groups.push({ id: 'g' + g, S, P: S + R.range(1, Math.min(N - 1, 8)) }); }
    const base = R.int(3) === 0 ? R.range(2, 12) : 0;
    drawn++; hist.groups[G] = (hist.groups[G] || 0) + 1; hist.N[N] = (hist.N[N] || 0) + 1;
    for (const rule of [7, 10]) {
      const dp = schedule(groups, N, { rule, base, tiers: ORDERS['B spec default (last, flat, hold, late, shape, land)'] });
      const gr = existsSchedule(groups, N, { rule, base });
      if (!!dp !== gr) exDiff++;
      if (!dp) { if (rule === 7) exNo7++; else exNo10++; }
    }
    const U = groups.reduce((a, g) => a + g.P - g.S, 0), minFlat = Math.max(0, N - 1 - U);
    let anyMin = false; const res = {};
    for (const [label, tiers] of Object.entries(ORDERS)) for (const finalLate of [false, true]) {
      const key = label[0] + (finalLate ? '+late' : '');
      const r = schedule(groups, N, { rule: 7, base, tiers, finalLate });
      if (!r) continue;
      res[key] = r;
      const s = (stat[key] = stat[key] || { plans: 0, flatMin: 0, lateFlat: 0, holds: 0, early: 0, earlyGroups: 0, gap: 0, shape: 0, maxRise: 0, cert: 0, weekBeforeLastSmall: 0 });
      s.plans++; if (r.flats === minFlat) { s.flatMin++; anyMin = true; } if (r.lateFlats) s.lateFlat++; s.holds += r.holds; s.shape += r.shapeDev;
      const early = r.lastStep.filter((w, g) => groups[g].P - groups[g].S >= 3 && w < N - 1).length; if (early) s.early++; s.earlyGroups += early;
      s.gap += r.lastStep.reduce((a, w) => a + (N - w), 0);
      const mr = Math.max(...r.total.slice(1).map((x, i) => (x - r.total[i]) / r.total[i])); if (mr > s.maxRise) s.maxRise = mr;
      if (certifyTable(groups, N, r, { rule: 7 }).length) s.cert++;
      if (r.rises[N - 1] >= 3 && r.rises[N - 2] * 3 <= r.rises[N - 1]) s.weekBeforeLastSmall++;
    }
    if (Object.keys(res).length && !anyMin) minUnreach++;
  }
  console.log(`\n## random tables: ${drawn} drawn; groups ${JSON.stringify(hist.groups)}; weeks ${JSON.stringify(hist.N)}`);
  console.log(`greedy existence test against the dynamic program (rules 7 and 10): ${exDiff} verdicts differ in ${2 * drawn}; no schedule under 7 %: ${exNo7}; none under 10 %: ${exNo10}`);
  console.log(`tables where NO order reaches the arithmetic minimum of flat weeks (the weekly cap forbids it): ${minUnreach}`);
  console.log('| order | plans | flat weeks at the arithmetic minimum | plans with a flat week in the last third | back-to-back flat weeks | plans with a group (climb >= 3) at its peak before week N-1 | such groups | sum of (N - last step week) | total distance to the planned curve | largest weekly rise | week N-1 rise <= a third of week N rise | certificate failures |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const [k, s] of Object.entries(stat)) console.log(`| ${k} | ${s.plans} | ${s.flatMin} | ${s.lateFlat} | ${s.holds} | ${s.early} | ${s.earlyGroups} | ${s.gap} | ${Math.round(s.shape)} | ${(100 * s.maxRise).toFixed(1)} % | ${s.weekBeforeLastSmall} | ${s.cert} |`);
}
