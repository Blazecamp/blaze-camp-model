// Judge 2 (mathematical rigor) - is "proven optimal / proven infeasible" from the LP-based branch-and-bound trustworthy?
// The research tests (kernel.test.mjs) use 2-6 variables with coefficients in -4..4. The real endpoint model has 100-210
// variables and rows mixing coefficients 1 ... 6000 (minutes scaled by 2000, quarter credits, big-M links).
// Here: random models with the REAL structure (days as time knapsacks with scaled minutes, group floors with quarter
// credits, big-M links t -> x, VOL-07 difference rows, shortfall tiers), small enough for an exact reference.
// Reference = kernel.mjs solve / solveLex (pure integer arithmetic, propagation + DFS: exact by construction).
// A mismatch = the floating-point LP pruned something it must not (false infeasible / false bound) or kept a wrong optimum.
// Run: node design/judge2/kernel_fuzz.mjs [trials]
import { Model, solve, solveLex } from '../research/kernel.mjs';
import { solveMip, solveLexMip } from '../research/milp.mjs';

// sound generator (mulberry32, exact 32-bit arithmetic; the research LCG loses its low bits in doubles - see prng_audit.mjs)
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0); }; }
const gen = mulberry32(4711); const rnd = (k) => gen() % k;
const Q = 2000;
const COST = [2.25, 3.0, 1.85, 2.45, 5.25];   // per-set minutes incl. rest (bilateral, unilateral, isolation, unilateral isolation, strength rest)

function build() {
  const m = new Model();
  const nd = 1 + rnd(4), ng = 2 + rnd(4);
  const z = [], t = [], x = [], slots = [];
  for (let g = 0; g < ng; g++) z.push(m.bool('z' + g));
  for (let d = 0; d < nd; d++) {
    t.push([]);
    for (let g = 0; g < ng; g++) t[d].push(rnd(4) ? m.bool(`t${d}.${g}`) : -1);
  }
  for (let d = 0; d < nd; d++) for (let g = 0; g < ng; g++) {
    if (t[d][g] < 0) continue;
    const k = 1 + rnd(2);
    const ss = [];
    for (let i = 0; i < k; i++) {
      const max = 3 + rnd(3), cost = COST[rnd(COST.length)];
      const v = m.int(0, max, `x${d}.${g}.${i}`, rnd(2) ? 'up' : 'down');
      const helper = rnd(3) === 0 ? (g + 1 + rnd(ng - 1)) % ng : -1;      // quarter credit to another group
      ss.push({ v, d, g, max, cost, helper, hc: rnd(2) ? 1 : 2 });
      m.lin([[1, v], [-2, t[d][g]]], '>=', 0, 'min sets'); m.lin([[1, v], [-max, t[d][g]]], '<=', 0, 'max sets');
    }
    for (let i = 0; i + 1 < ss.length; i++) { m.lin([[1, ss[i].v], [-1, ss[i + 1].v]], '>=', 0, 'VOL-07'); m.lin([[1, ss[i].v], [-1, ss[i + 1].v]], '<=', 1, 'VOL-07'); }
    slots.push(...ss);
    m.lin([[1, t[d][g]], [-1, z[g]]], '<=', 0, 't<=z');
  }
  for (let g = 0; g < ng; g++) {
    const ts = t.map((row) => row[g]).filter((v) => v >= 0);
    if (!ts.length) { m.lin([[1, z[g]]], '=', 0, 'no station'); continue; }
    m.lin([[1, z[g]], ...ts.map((v) => [-1, v])], '<=', 0, 'z needs a day');
  }
  // time knapsack per day, in 1/2000 minute, with changeovers on the group-day binaries
  for (let d = 0; d < nd; d++) {
    const terms = [];
    for (const s of slots) if (s.d === d) terms.push([Math.round(Q * s.cost), s.v]);
    for (let g = 0; g < ng; g++) if (t[d][g] >= 0) terms.push([Q * slots.filter((s) => s.d === d && s.g === g).length, t[d][g]]);
    const capMin = 6 + rnd(45) + rnd(100) / 100;
    if (terms.length) m.lin(terms, '<=', Math.floor(Q * capMin), 'time');
  }
  // floors with quarter credits (x4), shortfall to a ceiling
  const short = []; const floors = [];
  for (let g = 0; g < ng; g++) {
    const F = 4 + rnd(8), C = F + rnd(6);
    const cr = [];
    for (const s of slots) { if (s.g === g) cr.push([4, s.v]); else if (s.helper === g) cr.push([s.hc, s.v]); }
    m.lin([...cr, [-4 * F, z[g]]], '>=', 0, 'floor');
    const direct = slots.filter((s) => s.g === g).map((s) => [1, s.v]);
    if (direct.length) m.lin(direct, '<=', C, 'ceiling');
    const sh = m.int(0, 40, 'short' + g, 'down'); short.push(sh);
    m.lin([[1, sh], ...direct, [-C, z[g]]], '>=', 0, 'shortfall');
    floors.push(F);
  }
  m.order = [...z, ...t.flat().filter((v) => v >= 0), ...slots.map((s) => s.v), ...short];
  return { m, z, short, slots, ng };
}

const trials = +(process.argv[2] || 3000);
let feasMismatch = 0, lexMismatch = 0, limits = 0, checked = 0, refLimit = 0, falseInf = 0, falseFeas = 0, nvars = 0;
const ex = [];
for (let trial = 0; trial < trials; trial++) {
  const { m, z, short, ng } = build();
  nvars += m.lo.length;
  // (1) the selection oracle: can groups 0..k all be trained? (feasibility, as in selectGroups)
  for (let k = 0; k < ng; k++) {
    const fix = []; for (let g = 0; g <= k; g++) fix.push([z[g], 1, 1]);
    const ref = solve(m, null, { fix, nodeLimit: 3e5 });
    if (ref.status === 'limit') { refLimit++; continue; }
    const got = solveMip(m, null, { fix, nodeLimit: 2e4 });
    if (got.status === 'limit') { limits++; continue; }
    checked++;
    const a = ref.sol ? 'feasible' : 'infeasible', b = got.sol ? 'feasible' : 'infeasible';
    if (a !== b) { feasMismatch++; if (a === 'feasible') falseInf++; else falseFeas++; if (ex.length < 5) ex.push({ trial, k, exact: a, lp: b, vars: m.lo.length, rows: m.cons.length }); }
  }
  // (2) lexicographic dosing tiers: max groups trained (weighted), then total shortfall
  const tiers = [
    { name: 'T1 keep groups by priority', terms: z.map((v, g) => [-(1 << (ng - 1 - g)), v]) },
    { name: 'T2 total shortfall', terms: short.map((v) => [1, v]) },
  ];
  const ref = solveLex(m, tiers, { nodeLimit: 3e5 });
  if (ref.status !== 'optimal') { refLimit++; continue; }
  const got = solveLexMip(m, tiers, { nodeLimit: 2e4 });
  if (got.status === 'limit') { limits++; continue; }
  checked++;
  const va = ref.report.map((r) => r.value).join('/'), vb = got.report.map((r) => r.value).join('/');
  if (va !== vb || got.status !== 'optimal') { lexMismatch++; if (ex.length < 10) ex.push({ trial, exact: va, lp: vb, lpStatus: got.status, vars: m.lo.length, rows: m.cons.length }); }
}
console.log(`structured fuzz: ${trials} models (mean ${(nvars / trials).toFixed(1)} variables), ${checked} verdicts cross-checked against the exact integer kernel`);
console.log(`  feasibility-oracle mismatches: ${feasMismatch} (LP says infeasible but a plan exists: ${falseInf}; LP says feasible but none exists: ${falseFeas})`);
console.log(`  lexicographic-optimum mismatches: ${lexMismatch}`);
console.log(`  budget exhausted: LP-based ${limits}, exact reference ${refLimit} (skipped)`);
for (const e of ex) console.log('   example:', JSON.stringify(e));
