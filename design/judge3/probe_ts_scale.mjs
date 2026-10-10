// Judge 3 probe (engineering lens): the two-stage prototype on random instances LARGER than its own tests drew
// (design_two-stage.md tested 2-5 groups x 2-4 days; real templates go to 8 groups x 4-6 main days).
// Same generator as two-stage/proto/test_link.mjs with the size as parameters; node budget = the document's proposed
// runtime budget (20,000 per question). Reads only; prints one line per instance and a summary.
//   node probe_ts_scale.mjs <minGroups> <maxGroups> <minDays> <maxDays> [count=40] [seed=4242] [budget=20000]
import { rng, buildTables, growth10k } from '../two-stage/proto/core.mjs';
import { planEndpoints } from '../two-stage/proto/stage1.mjs';
import { placeBlock } from '../two-stage/proto/stage2.mjs';
const [g0, g1, d0, d1] = process.argv.slice(2, 6).map(Number);
const COUNT = Number(process.argv[6] || 40), SEED = Number(process.argv[7] || 4242), BUDGET = Number(process.argv[8] || 20000);
const R = rng(SEED);
const KINDS = [[45, 90], [90, 90], [36, 75], [72, 75]];
function randomInstance() {
  const NG = R.range(g0, g1), ND = R.range(d0, d1), N = R.pick([6, 8, 12]);
  const exBlocks = N === 12 ? [[1, 4], [5, 8], [9, 12]] : N === 8 ? [[1, 4], [5, 8]] : [[1, 6]];
  const NB = exBlocks.length;
  const groups = [];
  for (let g = 0; g < NG; g++) { const calves = g === NG - 1 && R.int(3) === 0; const F = calves ? 3 : R.pick([8, 10]); groups.push({ id: 'g' + g, S: F + R.int(3), C: F + R.range(3, 8), F, mc: calves ? 1 : N <= 7 ? 1 : 2, calves, session4: 44 }); }
  const days = [];
  for (let d = 0; d < ND; d++) {
    const lim = R.pick([45, 60, 75, 90]) * 60, base = R.range(8, 22) * 60, fixedW = [];
    for (let w = 0; w < N; w++) fixedW.push(base + R.int(3) * 60 * (R.int(2) ? 1 : 0) + (w === 0 || w === N - 1 ? R.int(2) * 180 : 0));
    days.push({ id: 'd' + d, main: true, limit: [lim, lim], fixedW, fixed: [fixedW[0], Math.max(...fixedW.slice(1))], exBudget: null, cap12: R.int(4) === 0 ? R.range(6, 10) : null });
  }
  const gds = []; let calfDays = 0;
  for (let g = 0; g < NG; g++) for (let d = 0; d < ND; d++) {
    // a group sits on about half of the days once it has one (templates: 2-3 exposure days per group)
    if (!groups[g].calves && R.int(2) === 0 && gds.some((x) => x.g === g)) continue;
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
  for (let t = 0; t < 4; t++) { const a = R.int(gds.length), b = R.int(gds.length); if (a !== b && gds[a].d === gds[b].d && gds[a].g !== gds[b].g && !groups[gds[a].g].calves && !groups[gds[b].g].calves && !I.pairs.some((p) => [p.s1.gd, p.s2.gd].some((x) => x === a || x === b))) I.pairs.push({ d: gds[a].d, s1: { t: 'c', gd: a, ci: 0 }, s2: { t: 'c', gd: b, ci: 0 }, tag: 'P' + t }); }
  return { I: buildTables(I), NG, ND, ngd: gds.length };
}
const rows = [];
for (let t = 0; t < COUNT; t++) {
  const { I, NG, ND, ngd } = randomInstance();
  const t0 = process.hrtime.bigint();
  const s1 = planEndpoints(I, { budget: BUDGET });
  let viol = 0, kept = s1.kept.length;
  if (s1.plan) { const s2 = placeBlock(I, s1, {}); viol = s2.violations.length; }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const row = { t, NG, ND, ngd, kept, ms: Math.round(ms), nodes: s1.audit.nodes, maxQ: s1.audit.maxNodes, unknown: s1.audit.unknown, viol };
  rows.push(row); console.log(JSON.stringify(row));
}
const ms = rows.map((r) => r.ms).sort((a, b) => a - b), q = (p) => ms[Math.min(ms.length - 1, Math.floor(p * ms.length))];
console.log(`SUMMARY groups ${g0}-${g1} x days ${d0}-${d1}, budget ${BUDGET}: instances ${rows.length}; ms p50 ${q(0.5)} p90 ${q(0.9)} max ${ms[ms.length - 1]}; over 1 s ${rows.filter((r) => r.ms > 1000).length}; plans with an 'unknown' verdict ${rows.filter((r) => r.unknown > 0).length}; hard-row violations ${rows.reduce((a, r) => a + r.viol, 0)}; kept groups p50 ${rows.map((r) => r.kept).sort((a, b) => a - b)[rows.length >> 1]}; group-days p50 ${rows.map((r) => r.ngd).sort((a, b) => a - b)[rows.length >> 1]}`);
