// Judge 2 - same intake as dose_tail.mjs. Is the dosing model really feasible, and does a feasibility-first order find a
// plan? (The selection witness is a feasible dosing point; the research dose() does not start from it.)
import { CASES, buildInstance, selectGroups, buildModel } from '../research/proto_endpoint.mjs';
import { solveLexMip, solveMip } from '../research/milp.mjs';
const I = buildInstance({ ...CASES[1].o, days: 3, minutes: 60 });
const sel = selectGroups(I);
const B = buildModel(I, { mode: 'dose' });
const { m, V, keep, short, dev, Mx } = B;
const fixB = (v, val) => { m.lo[v] = val; m.hi[v] = val; };
for (const g of keep) fixB(V.z[g], sel.kept.includes(g) ? 1 : 0);
for (const [k, v] of Object.entries(V.t)) fixB(v, sel.days[k] ? 1 : 0);
I.days.forEach((d, di) => { let any = 0; d.pairs.forEach((p) => { const on = sel.days[`${p.a.group}|${di}`] && sel.days[`${p.b.group}|${di}`] ? 1 : 0; fixB(V.pa[`${di}|${p.tag}`], on); any |= on; }); fixB(V.u[di], any); });
const tiers = [{ name: 'T1', terms: [[1, Mx]] }, { name: 'T2', terms: keep.map((g) => [1, short[g]]) }, { name: 'T3', terms: keep.map((g) => [1, dev[g]]) }];
// (a) any feasible point, sets at their minimum first
for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
let t0 = process.hrtime.bigint();
const f = solveMip(m, null, { nodeLimit: 5e4 });
console.log(`feasibility first (sets at minimum first): ${f.status === 'limit' ? 'UNKNOWN' : f.sol ? 'feasible' : 'infeasible'} in ${f.nodes} nodes, ${(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(0)} ms`);
// (b) the three tiers with the same value order
t0 = process.hrtime.bigint();
const r = solveLexMip(m, tiers, { nodeLimit: 5e4 });
console.log(`tiers with that order: ${r.report.map((x) => `${x.tier}=${x.value} (${x.status}, ${x.nodes} nodes)`).join('; ')}; ${(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(0)} ms`);
