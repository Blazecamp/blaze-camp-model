// Judge 2 - heavy tails of the LP-based oracle: the case the 5-minute sweep could not decide (E2 template, 3 days, 80 min).
import { CASES, buildInstance, buildModel } from '../research/proto_endpoint.mjs';
import { solveMip } from '../research/milp.mjs';
import { solve } from '../research/kernel.mjs';
const o = { ...CASES[1].o, days: 3, minutes: +(process.argv[2] || 80) };
const I = buildInstance(o);
const { m, V, keep } = buildModel(I, { mode: 'select' });
for (const g of keep) m.pref[V.z[g]] = 'down';
for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
console.log(`E2 template, 3 days x ${o.minutes} min: ${m.lo.length} variables, ${m.cons.length} rows; keep order ${keep.join(',')}`);
const fix = [];
for (const g of keep) {
  let line = `  ${g.padEnd(9)}`; let decided = null;
  for (const limit of [2e4, 2e5, 2e6]) {
    const t0 = process.hrtime.bigint();
    const r = solveMip(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: limit });
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    line += ` | LP B&B budget ${limit}: ${r.status === 'limit' ? 'UNKNOWN' : r.sol ? 'feasible' : 'infeasible'} (${r.nodes} nodes, ${ms.toFixed(0)} ms)`;
    if (r.status !== 'limit') { decided = !!r.sol; break; }
  }
  if (decided === null) {
    const t0 = process.hrtime.bigint();
    const r = solve(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: 5e6 });
    line += ` | integer-only DFS 5e6: ${r.status === 'limit' ? 'UNKNOWN' : r.sol ? 'feasible' : 'infeasible'} (${r.nodes} nodes, ${(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(0)} ms)`;
    if (r.status !== 'limit') decided = !!r.sol;
  }
  console.log(line);
  if (decided === null) { console.log('  -> undecided: stop'); break; }
  fix.push([V.z[g], decided ? 1 : 0, decided ? 1 : 0]);
}
