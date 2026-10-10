// Judge 2 - certified pruning (milp_cert.mjs) on the real template models: same verdicts and tier optima as the research
// solver? what share of the floating-point prunes can be re-proved in exact integers? what does it cost?
// Run: node design/judge2/cert_audit.mjs
import { CASES, buildInstance, buildModel } from '../research/proto_endpoint.mjs';
import * as plain from '../research/milp.mjs';
import * as cert from './milp_cert.mjs';

function run(S, c) {
  const I = buildInstance(c.o);
  let t0 = process.hrtime.bigint();
  const { m, V, keep } = buildModel(I, { mode: 'select' });
  for (const g of keep) m.pref[V.z[g]] = 'down';
  for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
  const fix = [], kept = []; let witness = null, nodes = 0, unknown = 0;
  for (const g of keep) {
    const r = S.solveMip(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: 2e4 }); nodes += r.nodes;
    if (r.status === 'limit') { unknown++; fix.push([V.z[g], 0, 0]); continue; }
    if (r.sol) { fix.push([V.z[g], 1, 1]); kept.push(g); witness = r.sol; } else fix.push([V.z[g], 0, 0]);
  }
  const tSel = Number(process.hrtime.bigint() - t0) / 1e6;
  const days = {}; if (witness) for (const [k, v] of Object.entries(V.t)) days[k] = witness[v];
  t0 = process.hrtime.bigint();
  const B = buildModel(I, { mode: 'dose' });
  const fixB = (v, val) => { B.m.lo[v] = val; B.m.hi[v] = val; };
  for (const g of B.keep) fixB(B.V.z[g], kept.includes(g) ? 1 : 0);
  for (const [k, v] of Object.entries(B.V.t)) fixB(v, days[k] ? 1 : 0);
  I.days.forEach((d, di) => { let any = 0; d.pairs.forEach((p) => { const on = days[`${p.a.group}|${di}`] && days[`${p.b.group}|${di}`] ? 1 : 0; fixB(B.V.pa[`${di}|${p.tag}`], on); any |= on; }); fixB(B.V.u[di], any); });
  const tiers = [{ name: 'T1', terms: [[1, B.Mx]] }, { name: 'T2', terms: B.keep.map((g) => [1, B.short[g]]) }, { name: 'T3', terms: B.keep.map((g) => [1, B.dev[g]]) }];
  const r = S.solveLexMip(B.m, tiers, { nodeLimit: 5e4 });
  const tDose = Number(process.hrtime.bigint() - t0) / 1e6;
  return { kept: kept.join(','), unknown, tiers: r.report.map((x) => `${x.value}${x.status === 'optimal' ? '' : '?'}`).join('/'), nodes: nodes + r.report.reduce((a, x) => a + x.nodes, 0), ms: tSel + tDose };
}
const variants = CASES.map((c) => ({ name: c.name.slice(0, 3), o: c.o }));
variants.push({ name: 'E2/3d@60', o: { ...CASES[1].o, days: 3, minutes: 60 } }, { name: 'E5@60', o: { ...CASES[4].o, minutes: 60 } }, { name: 'E5@45', o: { ...CASES[4].o, minutes: 45 } }, { name: 'E1@45', o: { ...CASES[0].o, minutes: 45 } }, { name: 'E1/2d@45', o: { ...CASES[0].o, days: 2, minutes: 45 } });
let same = 0, total = 0, msA = 0, msB = 0;
for (const v of variants) {
  const a = run(plain, v), b = run(cert, v); total++;
  const eq = a.kept === b.kept && a.tiers === b.tiers; if (eq) same++;
  msA += a.ms; msB += b.ms;
  console.log(`${v.name.padEnd(9)} research: kept [${a.kept}] tiers ${a.tiers} (${a.nodes} nodes, ${a.ms.toFixed(0)} ms) | certified: kept [${b.kept}] tiers ${b.tiers} (${b.nodes} nodes, ${b.ms.toFixed(0)} ms) ${eq ? 'SAME' : 'DIFFERENT'}${a.unknown || b.unknown ? ` unknown ${a.unknown}/${b.unknown}` : ''}`);
}
const s = cert.stats;
console.log(`\n${same}/${total} intakes: same kept groups and tier optima. Total time research ${msA.toFixed(0)} ms, certified ${msB.toFixed(0)} ms.`);
console.log(`floating-point prunes in the certified runs: LP-infeasible ${s.lpInfeasible} (re-proved in exact integers: ${s.certInfeasible}), bound ${s.boundPrunes} (re-proved: ${s.certBound}); not re-proved, so branched instead of pruned: ${s.uncertified}`);
