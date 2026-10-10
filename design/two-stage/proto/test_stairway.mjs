// design/two-stage/proto/test_stairway.mjs - the exact stairway against brute force (every table) on small plans, plus certificates
// on plans of real size. Sound generator; the distribution drawn is printed and asserted.   node test_stairway.mjs [small] [large]
import { rng } from './core.mjs';
import { schedule, certifyTable, bruteBest, plannedCurve } from './stairway.mjs';
const SMALL = Number(process.argv[2] || 1500), LARGE = Number(process.argv[3] || 5000);
const R = rng(77);
const vecOf = (groups, N, res, opt) => {
  const L = groups.map((g) => plannedCurve(g.S, g.P, N).T), U = groups.reduce((a, g) => a + g.P - g.S, 0);
  const ideal = []; for (let w = 1; w <= N; w++) ideal.push(groups.reduce((a, g, i) => a + (L[i][w - 1] - g.S), 0));
  const lateFrom = N - Math.ceil(N / 3) + 1, climbing = groups.filter((g) => g.P > g.S).length;
  let late = 0, shape = 0, flat = 0, hold = 0, placed = 0, prevFlat = false;
  for (let w = 2; w <= N; w++) {
    const D = res.rises[w - 1], left = U - placed; placed += D;
    shape += Math.round(100 * Math.abs(placed - ideal[w - 1]));
    if (D === 0) { if (w >= lateFrom) late += 2 ** (w - lateFrom); if (left > 0) { flat++; if (prevFlat) hold++; } }
    prevFlat = D === 0;
  }
  return [res.rises[N - 1] === 0 && U > 0 ? 1 : 0, shape, climbing - res.rises[N - 1], late, flat, hold];
};
for (const rule of [7, 10]) {
  let diff = 0, none = 0, cert = 0; const dist = { G: {}, N: {} };
  for (let t = 0; t < SMALL; t++) {
    const G = R.range(1, 4), N = R.range(4, 9), groups = [];
    for (let g = 0; g < G; g++) { const S = R.range(3, 16); groups.push({ id: 'g' + g, S, P: S + R.range(0, Math.min(N - 1, 4)) }); }
    dist.G[G] = (dist.G[G] || 0) + 1; dist.N[N] = (dist.N[N] || 0) + 1;
    const base = R.int(3) === 0 ? R.range(2, 9) : 0;
    const res = schedule(groups, N, { rule, base }), bb = bruteBest(groups, N, { rule, base });
    if (!res) { none++; if (bb) diff++; continue; }
    if (certifyTable(groups, N, res, { rule }).length) cert++;
    const v = vecOf(groups, N, res);
    if (!bb || v.some((x, i) => x !== bb[i])) { diff++; if (diff <= 3) console.log('DIFF', JSON.stringify(groups), N, base, JSON.stringify(v), JSON.stringify(bb)); }
  }
  console.log(`rule ${rule} %: ${SMALL} small plans, no schedule ${none}; tier vectors that differ from brute force ${diff}; certificate failures ${cert}; drawn groups ${JSON.stringify(dist.G)} weeks ${JSON.stringify(dist.N)}`);
  if (diff || cert || Object.keys(dist.G).length < 4 || Object.keys(dist.N).length < 6) process.exit(1);
}
// real sizes: up to 8 groups, 6-16 weeks, level-table starts and peaks; certificate only
for (const rule of [7, 10]) {
  let cert = 0, none = 0, flatsMin = 0, lateFlat = 0, maxStates = 0, t0 = Date.now(); const dist = { G: {}, N: {} };
  for (let t = 0; t < LARGE; t++) {
    const G = R.range(1, 8), N = R.pick([6, 8, 10, 12, 16]), groups = [];
    for (let g = 0; g < G; g++) { const S = R.pick([6, 9, 10, 11, 12, 15, 17, 20, 22]); const room = Math.min(N - 1, Math.floor(S * 0.55)); groups.push({ id: 'g' + g, S, P: S + R.range(0, Math.max(1, Math.min(room, 8))) }); }
    dist.G[G] = (dist.G[G] || 0) + 1; dist.N[N] = (dist.N[N] || 0) + 1;
    const res = schedule(groups, N, { rule });
    if (!res) { none++; continue; }
    if (certifyTable(groups, N, res, { rule }).length) cert++;
    const U = groups.reduce((a, g) => a + g.P - g.S, 0);
    if (res.flats === Math.max(0, N - 1 - U)) flatsMin++;
    if (res.lateFlats) lateFlat++;
    if (res.states > maxStates) maxStates = res.states;
  }
  console.log(`rule ${rule} %: ${LARGE} plans of real size: no schedule ${none}, certificate failures ${cert}, flat weeks at the arithmetic minimum in ${flatsMin}, plans with a flat week in the last third ${lateFlat}, largest DP ${maxStates} states, ${Date.now() - t0} ms; drawn groups ${JSON.stringify(dist.G)} weeks ${JSON.stringify(dist.N)}`);
  if (cert) process.exit(1);
}
