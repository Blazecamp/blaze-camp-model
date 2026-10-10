// Judge 2 - are the LP-based oracle's INFEASIBLE verdicts on the real template models right?
// A feasible verdict carries a witness that is re-checked in integers (sound). An infeasible verdict carries nothing: it
// rests on floating-point LP pruning. Cross-check each one with the integer-only kernel (exact by construction) under a
// node budget: confirmed / contradicted (= a group would be dropped although it fits) / undecided.
import { CASES, buildInstance, buildModel } from '../research/proto_endpoint.mjs';
import { solveMip } from '../research/milp.mjs';
import { solve } from '../research/kernel.mjs';
const variants = [];
const base = CASES[4].o, r2 = CASES[1].o, a1 = CASES[0].o;
for (const [name, o] of [['E1', a1], ['E1/2d', { ...a1, days: 2 }], ['E1/3d', { ...a1, days: 3 }], ['E2', r2], ['E2/3d', { ...r2, days: 3 }], ['E5', base], ['E5/2d', { ...base, days: 2 }], ['E5/4d', { ...base, days: 4 }]])
  for (const minutes of [30, 40, 45, 50, 60]) variants.push({ name: `${name}@${minutes}`, o: { ...o, minutes } });
let inf = 0, confirmed = 0, contradicted = 0, undecided = 0, feas = 0, unknownLp = 0; const ex = [];
const BUDGET = +(process.argv[2] || 1.5e6);
for (const v of variants) {
  const I = buildInstance(v.o);
  const { m, V, keep } = buildModel(I, { mode: 'select' });
  for (const g of keep) m.pref[V.z[g]] = 'down';
  for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
  const fix = [];
  for (const g of keep) {
    const r = solveMip(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: 2e4 });
    if (r.status === 'limit') { unknownLp++; fix.push([V.z[g], 0, 0]); continue; }
    if (r.sol) { feas++; fix.push([V.z[g], 1, 1]); continue; }
    inf++;
    // exact cross-check; try the sets 'up' first so a feasible plan, if any, is found fast
    const pref = m.pref.slice(); for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'up';
    const e = solve(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: BUDGET });
    m.pref = pref;
    if (e.status === 'limit') undecided++; else if (e.sol) { contradicted++; if (ex.length < 5) ex.push(`${v.name}: LP oracle says ${g} cannot be trained with ${fix.filter((f) => f[1] === 1).length} kept groups; the exact kernel found a plan`); } else confirmed++;
    fix.push([V.z[g], 0, 0]);
  }
}
console.log(`real template models (${variants.length} intakes): LP-based oracle verdicts: feasible ${feas} (witness re-checked in integers), infeasible ${inf}, unknown ${unknownLp}`);
console.log(`  infeasible verdicts cross-checked by the integer-only kernel (budget ${BUDGET} nodes): confirmed ${confirmed}, CONTRADICTED ${contradicted}, undecided ${undecided}`);
for (const e of ex) console.log('   ' + e);
