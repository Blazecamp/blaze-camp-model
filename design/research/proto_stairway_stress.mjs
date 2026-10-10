// Stress test of the min-cost-flow stairway (proto_stairway_flow.mjs) on 2000 random plans: lines 1-12, N 4-16, level
// starts / ceilings from the coach's tables, Focus +1..+3. Checks the guarantees the research report relies on.
import { flowSchedule } from './proto_stairway_flow.mjs';
let seed = 4242; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
const LV = [[10, 14], [15, 22], [20, 25], [12, 22], [15, 25], [6, 7], [9, 22], [12, 14]];
let avoid2 = 0, flats2 = 0, plans = 0, mono = 0, land = 0, landPossible = 0, flatsWhenAvoidable = 0, avoidable = 0, step7 = 0, step10 = 0, maxMs = 0, sumMs = 0;
for (let t = 0; t < 2000; t++) {
  const N = 4 + rnd(13), k = 1 + rnd(12);
  const lines = []; for (let i = 0; i < k; i++) { const [S, C] = LV[rnd(LV.length)]; const f = rnd(4) === 0 ? 1 + rnd(3) : 0; lines.push({ n: 'l' + i, S: S + f, C: C + f }); }
  const t0 = process.hrtime.bigint();
  const { L, sched, units } = flowSchedule(lines, N);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6; maxMs = Math.max(maxMs, ms); sumMs += ms; plans++;
  const tot = []; for (let w = 0; w < N; w++) tot.push(sched.reduce((a, x) => a + x[w], 0));
  for (const x of sched) for (let w = 1; w < N; w++) { if (x[w] < x[w - 1]) mono++; if (x[w] - x[w - 1] > Math.max(1, Math.floor(0.07 * x[w - 1] + 1e-9))) step7++; }
  for (let w = 1; w < N; w++) if (tot[w] - tot[w - 1] > Math.max(1, Math.ceil(0.1 * tot[w - 1]) - 1)) step10++;
  // landing: all climbing lines step in week N is possible when their count fits the week-N total cap
  const climbing = L.filter((l) => l.P > l.S).length;
  const capN = Math.max(1, Math.ceil(0.1 * tot[N - 2]) - 1);
  if (climbing <= capN) { landPossible++; if (sched.every((x, i) => L[i].P === L[i].S || x[N - 1] > x[N - 2])) land++; }
  // never flat is possible when there are at least N-1 whole sets to add
  if (units >= N - 1) { avoidable++; for (let w = 1; w < N; w++) if (tot[w] === tot[w - 1]) { flatsWhenAvoidable++; break; } }
  // with every line landing in week N, weeks 2..N-1 can only be fed by the non-final sets
  if (units - climbing >= N - 2) { avoid2++; for (let w = 1; w < N; w++) if (tot[w] === tot[w - 1]) { flats2++; break; } }
}
console.log(`stairway flow stress: ${plans} random plans; slot/line decreases ${mono}; line steps over max(1, 7 %) ${step7}; weekly total rises >= 10 % ${step10}`);
console.log(`  every climbing line lands in week N: ${land}/${landPossible} plans where the 10 % rule allows it`);
console.log(`  plans with >= N-1 sets to add that still have a flat week: ${flatsWhenAvoidable}/${avoidable}`);
console.log(`  plans with >= N-2 NON-final sets to add (landing rule kept) that still have a flat week: ${flats2}/${avoid2}`);
console.log(`  solve time: mean ${(sumMs / plans).toFixed(2)} ms, max ${maxMs.toFixed(1)} ms (Node ${process.version})`);
