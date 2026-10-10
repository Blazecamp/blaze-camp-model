// Judge 2: the MILP prototype's keep-vector verdicts (floating-point LP inside branch-and-bound) against a pure-integer search
// (design/research/kernel.mjs solve(): bounds propagation + depth-first search, no floating point) on the same compact model.
import { buildModel } from '../milp_proto/planner.mjs';
import { solveMip } from '../milp_proto/kern.mjs';
import { solve } from '../research/kernel.mjs';
import { pickleball, crossfit, swimmer } from '../milp_proto/samples.mjs';
const LIMIT = Number(process.argv[2] || 3e6);
const cases = [['pickleball', pickleball()], ['pickleball phi=1', pickleball(), { phi: 1 }], ['crossfit', crossfit()], ['crossfit phi=1', crossfit(), { phi: 1 }], ['swimmer', swimmer()], ['swimmer phi=1', swimmer(), { phi: 1 }]];
for (const [name, I, opt] of cases) {
  const B = buildModel(I, opt || {}); const { m, V } = B;
  for (const g of I.groups) m.pref[V.y[g.id]] = 'down';
  const fix = []; const log = []; let differ = 0, undecided = 0;
  const t0 = process.cpuUsage();
  for (const g of I.groups) {
    const q = [...fix, [V.y[g.id], 1, 1]];
    const lp = solveMip(m, null, { fix: q, nodeLimit: 20000 });
    const cp = solve(m, null, { fix: q, nodeLimit: LIMIT });
    const a = lp.sol ? 'fits' : lp.status, b = cp.sol ? 'fits' : cp.status === 'infeasible' ? 'infeasible' : 'limit';
    if (b === 'limit') undecided++; else if (a !== b) differ++;
    log.push(`${g.id}: LP ${a}/${lp.nodes} | integers ${b}/${cp.nodes}`);
    fix.push([V.y[g.id], lp.sol ? 1 : 0, lp.sol ? 1 : 0]);
  }
  const t1 = process.cpuUsage(t0);
  console.log(`${name}: verdicts that differ ${differ}, not decided by the integer search within ${LIMIT} nodes: ${undecided}  (${Math.round((t1.user + t1.system) / 1000)} ms)`);
  console.log('   ' + log.join('\n   '));
}
