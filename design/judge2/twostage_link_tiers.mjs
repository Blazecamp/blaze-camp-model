// Judge 2 copy of design/two-stage/proto/test_link.mjs with one change: an optional 4th argument sets the stairway tier order.
// design/two-stage/proto/test_link.mjs - the LINK between the stages as a property test.
// Random instances with several exercise blocks (per-set costs change by block, fixed seconds change by week, not monotone):
// stage 1 (keep vector, peaks, week 1, structure) -> stairway -> stage 2 (placement). Every week of every plan must pass every
// hard row re-computed from the definitions with that week's OWN costs; stage 2 must never fail and never change the table.
//   node test_link.mjs [count] [seed]
import { rng, buildTables, growth10k } from '../two-stage/proto/core.mjs';
import { planEndpoints } from '../two-stage/proto/stage1.mjs';
import { placeBlock } from '../two-stage/proto/stage2.mjs';
const COUNT = Number(process.argv[2] || 300), SEED = Number(process.argv[3] || 4242);
const R = rng(SEED);
const KINDS = [[45, 90], [90, 90], [36, 75], [72, 75]];
function randomInstance() {
  const NG = R.range(2, 5), ND = R.range(2, 4), N = R.pick([6, 8, 12]);
  const exBlocks = N === 12 ? [[1, 4], [5, 8], [9, 12]] : N === 8 ? [[1, 4], [5, 8]] : [[1, 6]];
  const NB = exBlocks.length;
  const groups = [];
  for (let g = 0; g < NG; g++) { const calves = g === NG - 1 && R.int(3) === 0; const F = calves ? 3 : R.pick([8, 10]); groups.push({ id: 'g' + g, S: F + R.int(3), C: F + R.range(3, 8), F, mc: calves ? 1 : N <= 7 ? 1 : 2, calves, session4: 44 }); }
  const days = [];
  for (let d = 0; d < ND; d++) {
    const lim = R.pick([30, 45, 60, 75]) * 60, base = R.range(8, 22) * 60, fixedW = [];
    for (let w = 0; w < N; w++) fixedW.push(base + R.int(3) * 60 * (R.int(2) ? 1 : 0) + (w === 0 || w === N - 1 ? R.int(2) * 180 : 0));
    days.push({ id: 'd' + d, main: true, limit: [lim, lim], fixedW, fixed: [fixedW[0], Math.max(...fixedW.slice(1))], exBudget: null, cap12: R.int(4) === 0 ? R.range(6, 10) : null });
  }
  const gds = []; let calfDays = 0;
  for (let g = 0; g < NG; g++) for (let d = 0; d < ND; d++) {
    if (!groups[g].calves && R.int(3) === 0 && gds.some((x) => x.g === g)) continue;
    const nc = groups[g].calves ? 1 : R.range(2, 4), cands = [];
    for (let i = 0; i < nc; i++) {
      const k = R.pick(KINDS), cred = new Array(NG).fill(0); cred[g] = 4; if (R.int(3) === 0) cred[(g + 1) % NG] = 1;
      const blocks = []; for (let e = 0; e < NB; e++) { const kk = R.int(4) === 0 ? R.pick(KINDS) : k; blocks.push({ work: kk[0], rest: i === 0 && R.int(5) === 0 && e === NB - 1 ? 270 : kk[1] }); }
      cands.push({ sid: `s${g}${d}${i}`, cls: 'X', lo: groups[g].calves ? 3 : 2, hi: groups[g].calves ? 4 : R.pick([4, 5]), cred, blocks, work: [blocks[0].work, Math.max(...blocks.map((b) => b.work))], rest: [blocks[0].rest, Math.max(...blocks.map((b) => b.rest))] });
    }
    gds.push({ id: `g${g}@d${d}`, g, d, Ks: groups[g].calves ? [1] : nc >= 3 ? [2, 3] : [2], cands, home: !groups[g].calves && R.int(6) === 0 });
    if (groups[g].calves) calfDays++;
  }
  for (const grp of groups) if (grp.calves) { grp.F = 3 * calfDays; grp.S = grp.F; grp.C = 4 * calfDays; }
  const I = { name: 'rnd', N, exBlocks, G10k: growth10k(N), spill4: 4, maxPartners: 3, groups, days, gds, pairs: [], partners: [], fixedSets: 0, patternOrder: groups.map((g) => g.id) };
  for (let t = 0; t < 3; t++) { const a = R.int(gds.length), b = R.int(gds.length); if (a !== b && gds[a].d === gds[b].d && gds[a].g !== gds[b].g && !groups[gds[a].g].calves && !groups[gds[b].g].calves) I.pairs.push({ d: gds[a].d, s1: { t: 'c', gd: a, ci: 0 }, s2: { t: 'c', gd: b, ci: 0 }, tag: 'P' + t }); }
  if (R.int(2) === 0) { const pg = R.int(NG); if (!groups[pg].calves) { const cred = new Array(NG).fill(0); cred[pg] = 4; const b = [45, 90]; I.partners.push({ id: 'p0', d: R.int(ND), g: pg, host: null, sets: 2, cls: 'P', cred, blocks: exBlocks.map(() => ({ work: b[0], rest: b[1] })), work: [45, 45], rest: [90, 90] }); } }
  return buildTables(I);
}
const tot = { plans: 0, weeks: 0, none: 0, viol: 0, unknown: 0, kept: {}, nodes: 0, maxNodes: 0, flats: 0, pairsNeeded: 0, strength: 0, rule10: 0, flatMin: 0, lateFlat: 0 };
for (let t = 0; t < COUNT; t++) {
  const I = randomInstance();
  if (I.gds.some((gd) => gd.cands.some((c) => c.rest[1] === 270))) tot.strength++;
  const s1 = planEndpoints(I, { budget: 100000 });
  tot.unknown += s1.audit.unknown; tot.nodes += s1.audit.nodes; if (s1.audit.maxNodes > tot.maxNodes) tot.maxNodes = s1.audit.maxNodes;
  tot.kept[s1.kept.length] = (tot.kept[s1.kept.length] || 0) + 1;
  if (!s1.plan) { tot.none++; continue; }
  const s2 = placeBlock(I, s1, process.argv[4] ? { tiers: process.argv[4].split(',') } : {});
  tot.plans++; tot.weeks += I.N; tot.viol += s2.violations.length; tot.flats += s2.stair.flats; if (s2.needed.some(Boolean)) tot.pairsNeeded++;
  if (s2.stair.rule !== 7) tot.rule10++;
  { const U = s2.groups.reduce((a, g) => a + g.P - g.S, 0); if (s2.stair.flats === Math.max(0, I.N - 1 - U)) tot.flatMin++; if (s2.stair.lateFlats) tot.lateFlat++; }
  if (s2.violations.length && tot.viol <= 6) console.log('VIOLATION', s2.violations.slice(0, 3).join(' | '));
  // the table is exactly what stage 1 certified at both ends
  s1.kept.forEach((g, k) => { if (s2.table[k][0] !== s2.weeks[0].D[g] || s2.table[k][I.N - 1] !== s2.weeks[I.N - 1].D[g]) { tot.viol++; console.log('TABLE MISMATCH'); } });
}
console.log(`instances ${COUNT}: plans ${tot.plans} (${tot.weeks} plan-weeks), no group fits ${tot.none}; violations of any hard row in any week ${tot.viol}; oracle unknown ${tot.unknown}`);
console.log(`kept groups per plan ${JSON.stringify(tot.kept)}; instances with a strength-rest block ${tot.strength}; plans that need a superset ${tot.pairsNeeded}; oracle nodes total ${tot.nodes}, largest question ${tot.maxNodes}`);
console.log(`stairway: plans that needed the 10 % fallback ${tot.rule10}; flat weeks of the total at the arithmetic minimum in ${tot.flatMin} of ${tot.plans}; plans with a flat week in the last third ${tot.lateFlat}`);
if (tot.viol || tot.plans < COUNT / 3) process.exit(1);
