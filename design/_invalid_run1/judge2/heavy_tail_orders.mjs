// Judge 2 - the heavy-tail case (E2 template, 3 days x 80 min, "does shoulders fit with the 5 kept groups?", answer: yes).
// Same model, same exact solver, different deterministic value orders. Shows that the 190k-node search is a search-order
// artifact: a feasibility question needs a portfolio of dives (and a primal heuristic) before any budget is spent.
import { CASES, buildInstance, buildModel } from '../research/proto_endpoint.mjs';
import { solveMip } from '../research/milp.mjs';
import { solve } from '../research/kernel.mjs';
const o = { ...CASES[1].o, days: 3, minutes: 80 };
const I = buildInstance(o);
const { m, V, keep } = buildModel(I, { mode: 'select' });
const fix = keep.map((g) => [V.z[g], 1, 1]);     // calves, hips, quads, back, chest (kept) + shoulders
const isX1 = (n) => /^x1\./.test(n), isXN = (n) => /^xN\./.test(n);
const orders = {
  'research order: days on first, supersets off first, sets at minimum first': (n) => (/^t\./.test(n) || /^z\./.test(n) ? 'up' : 'down'),
  'days off first, supersets off first, sets at minimum first': (n) => 'down',
  'days off first, peak sets up, week-1 sets down': (n) => (isXN(n) ? 'up' : 'down'),
  'days off first, all sets up': (n) => (isX1(n) || isXN(n) ? 'up' : 'down'),
  'days on first, supersets ON first, sets at minimum first': (n) => (/^(t|z|ss|pair)\./.test(n) ? 'up' : 'down'),
  'days on first, supersets ON first, peak sets up': (n) => (/^(t|z|ss|pair)\./.test(n) || isXN(n) ? 'up' : 'down'),
};
for (const [name, f] of Object.entries(orders)) {
  for (let i = 0; i < m.name.length; i++) m.pref[i] = f(m.name[i]);
  let t0 = process.hrtime.bigint();
  const a = solveMip(m, null, { fix, nodeLimit: 3e5 });
  const msA = Number(process.hrtime.bigint() - t0) / 1e6;
  t0 = process.hrtime.bigint();
  const b = solve(m, null, { fix, nodeLimit: 3e6 });
  const msB = Number(process.hrtime.bigint() - t0) / 1e6;
  const s = (r) => (r.status === 'limit' ? 'UNKNOWN' : r.sol ? 'feasible' : 'infeasible');
  console.log(`${name.padEnd(74)} LP B&B: ${s(a)} ${a.nodes} nodes ${msA.toFixed(0)} ms | integer-only DFS: ${s(b)} ${b.nodes} nodes ${msB.toFixed(0)} ms`);
}
