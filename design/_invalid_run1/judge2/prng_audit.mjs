// Judge 2 (mathematical rigor) - audit of the EVIDENCE behind the research claims.
// Every research test (kernel.test.mjs, lp.test.mjs, proto_stairway_stress.mjs, bench_runtime.mjs) draws its "random"
// instances from   seed = (seed * 1103515245 + 12345) % 2147483648   computed in IEEE doubles. seed * 1103515245 reaches
// 2^61, far above 2^53, so the low bits of the product are rounded away: the generator's low bits are (almost always) zero.
// Part 1 measures what that does to the test distributions. Parts 2-4 repeat the same tests with a sound generator
// (mulberry32, exact 32-bit integer arithmetic through Math.imul).
// Run: node design/judge2/prng_audit.mjs
import { Model, solveLex } from '../research/kernel.mjs';
import { solveLexMip } from '../research/milp.mjs';
import { lpSolve } from '../research/lp.mjs';
import { flowSchedule } from '../research/proto_stairway_flow.mjs';

// ---------------------------------------------------------------- 1. what the research generator really produces
{
  let seed = 4242; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
  const LV = [[10, 14], [15, 22], [20, 25], [12, 22], [15, 25], [6, 7], [9, 22], [12, 14]];
  const hN = {}, hK = {}, hLV = {}, hF = {}; let plans = 0, lines = 0;
  for (let t = 0; t < 2000; t++) {
    const N = 4 + rnd(13), k = 1 + rnd(12); hN[N] = (hN[N] || 0) + 1; hK[k] = (hK[k] || 0) + 1; plans++;
    for (let i = 0; i < k; i++) { const li = rnd(LV.length); hLV[li] = (hLV[li] || 0) + 1; const f = rnd(4) === 0 ? 1 + rnd(3) : 0; hF[f] = (hF[f] || 0) + 1; lines++; }
  }
  console.log('1. proto_stairway_stress.mjs, as written (seed 4242, 2000 plans):');
  console.log('   number of lines k:', JSON.stringify(hK), ' (intended: 1..12 uniform)');
  console.log('   level-table row drawn:', JSON.stringify(hLV), ` of ${lines} lines (intended: 8 rows uniform)`);
  console.log('   Focus add f:', JSON.stringify(hF), ' (intended: 0 in 3 of 4 lines)');
  let s2 = 12345; const r2 = (k) => { s2 = (s2 * 1103515245 + 12345) % 2147483648; return s2 % k; };
  const h2 = {}, h4 = {}, h12 = {}; for (let i = 0; i < 20000; i++) { const a = r2(2), b = r2(4), c = r2(12); h2[a] = (h2[a] || 0) + 1; h4[b] = (h4[b] || 0) + 1; h12[c] = (h12[c] || 0) + 1; }
  console.log('   kernel.test.mjs generator (seed 12345): rnd(2)', JSON.stringify(h2), ' rnd(4)', JSON.stringify(h4), ' rnd(12)', JSON.stringify(h12));
  console.log('   => variable lower bounds rnd(2) and branching preference rnd(2) are (almost) constant; domains 2 + rnd(4) are (almost) always 0..2');
}

// ---------------------------------------------------------------- sound generator
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0); }; }
const mk = (s) => { const g = mulberry32(s); return (k) => g() % k; };

// ---------------------------------------------------------------- 2. kernel / milp vs brute force, sound generator
{
  const rnd = mk(1);
  let checked = 0, mism = 0, limit = 0; const ex = [];
  for (let trial = 0; trial < 6000; trial++) {
    const n = 2 + rnd(5), m = new Model(); const xs = [];
    for (let i = 0; i < n; i++) { const lo = rnd(3) - 1; xs.push(m.int(lo, lo + 1 + rnd(5), 'x' + i, rnd(2) ? 'up' : 'down')); }
    const cons = [];
    const nc = 1 + rnd(6);
    for (let c = 0; c < nc; c++) {
      const wide = rnd(4) === 0;                                   // one row in four mixes small and large coefficients (1 ... 6000)
      const t = xs.map((v) => [wide ? (rnd(3) === 0 ? (rnd(2) ? 1 : -1) * (1 + rnd(6000)) : rnd(9) - 4) : rnd(9) - 4, v]);
      const op = ['<=', '>=', '='][rnd(3)]; const rhs = wide ? rnd(12001) - 3000 : rnd(18) - 5; m.lin(t, op, rhs); cons.push([t, op, rhs]);
    }
    const obj1 = xs.map((v) => [rnd(9) - 4, v]), obj2 = xs.map((v) => [rnd(9) - 4, v]);
    let best = null;
    const rec = (i, vals) => {
      if (i === n) {
        for (const [t, op, rhs] of cons) { const s = t.reduce((a, [c, v]) => a + c * vals[v], 0); if ((op === '<=' && s > rhs) || (op === '>=' && s < rhs) || (op === '=' && s !== rhs)) return; }
        const k1 = obj1.reduce((a, [c, v]) => a + c * vals[v], 0), k2 = obj2.reduce((a, [c, v]) => a + c * vals[v], 0);
        if (!best || k1 < best[0] || (k1 === best[0] && k2 < best[1])) best = [k1, k2];
        return;
      }
      for (let d = m.lo[xs[i]]; d <= m.hi[xs[i]]; d++) { vals[xs[i]] = d; rec(i + 1, vals); }
    };
    rec(0, []);
    for (const [name, fn] of [['kernel', solveLex], ['milp', solveLexMip]]) {
      const r = fn(m, [{ name: 'o1', terms: obj1 }, { name: 'o2', terms: obj2 }]);
      if (r.status === 'limit') { limit++; continue; }
      checked++;
      const got = r.sol ? [r.report[0].value, r.report[1].value] : null;
      if (JSON.stringify(got) !== JSON.stringify(best)) { mism++; if (ex.length < 6) ex.push({ solver: name, trial, got, brute: best, status: r.report.map((x) => x.status).join('/') }); }
    }
  }
  console.log(`\n2. kernel.mjs and milp.mjs vs brute force, sound generator, varied domains, 1 row in 4 with coefficients up to 6000: ${checked} solves, ${mism} mismatches, ${limit} budget stops`);
  for (const e of ex) console.log('   example:', JSON.stringify(e));
}

// ---------------------------------------------------------------- 3. lp.mjs, sound generator
{
  const rnd = mk(2);
  let bad = 0, inf = 0, falseInf = 0, above = 0, opt = 0, other = 0; const ex = [];
  for (let trial = 0; trial < 20000; trial++) {
    const n = 2 + rnd(5);
    const lo = [], hi = []; for (let j = 0; j < n; j++) { lo.push(rnd(3) - 1); hi.push(lo[j] + 1 + rnd(5)); }
    const rows = []; const nr = 1 + rnd(6);
    for (let k = 0; k < nr; k++) {
      const wide = rnd(4) === 0; const idx = [], val = [];
      for (let j = 0; j < n; j++) { const a = wide && rnd(3) === 0 ? (rnd(2) ? 1 : -1) * (1 + rnd(6000)) : rnd(9) - 4; if (a) { idx.push(j); val.push(a); } }
      rows.push({ idx, val, b: wide ? rnd(12001) - 3000 : rnd(18) - 5 });
    }
    const c = []; for (let j = 0; j < n; j++) c.push(rnd(11) - 5);
    const r = lpSolve(n, rows, c, lo, hi);
    let ipBest = Infinity;
    const rec = (j, v) => { if (j === n) { for (const { idx, val, b } of rows) { let s = 0; for (let k = 0; k < idx.length; k++) s += val[k] * v[idx[k]]; if (s > b) return; } ipBest = Math.min(ipBest, c.reduce((a, cc, jj) => a + cc * v[jj], 0)); return; } for (let t = lo[j]; t <= hi[j]; t++) { v[j] = t; rec(j + 1, v); } };
    rec(0, []);
    if (r.status === 'optimal') {
      opt++;
      for (const { idx, val, b } of rows) { let s = 0, sc = 1; for (let k = 0; k < idx.length; k++) { s += val[k] * r.x[idx[k]]; sc = Math.max(sc, Math.abs(val[k])); } if (s > b + 1e-6 * sc) { bad++; if (ex.length < 4) ex.push({ kind: 'row violated at the LP optimum', trial, by: s - b }); } }
      if (ipBest < Infinity && r.obj > ipBest + 1e-6) { above++; if (ex.length < 4) ex.push({ kind: 'LP bound ABOVE an integer solution (would prune the optimum)', trial, lp: r.obj, ip: ipBest }); }
    } else if (r.status === 'infeasible') { inf++; if (ipBest < Infinity) { falseInf++; if (ex.length < 4) ex.push({ kind: 'LP says infeasible but an integer point exists (would drop a group)', trial }); } }
    else other++;
  }
  console.log(`\n3. lp.mjs, sound generator, 20000 boxed LPs (1 row in 4 with coefficients up to 6000): optimal ${opt}, infeasible ${inf}, other ${other}`);
  console.log(`   FALSE infeasible: ${falseInf}; LP bound above an integer optimum: ${above}; row violations at the optimum: ${bad}`);
  for (const e of ex) console.log('   example:', JSON.stringify(e));
}

// ---------------------------------------------------------------- 4. stairway stress with the intended distribution
{
  const rnd = mk(3);
  const LV = [[10, 14], [15, 22], [20, 25], [12, 22], [15, 25], [6, 7], [9, 22], [12, 14]];
  const lineCap = (x) => Math.max(1, Math.floor(0.07 * x + 1e-9));
  const tot10 = (t) => Math.max(1, Math.ceil(0.10 * t - 1e-9) - 1);
  const tot7 = (t) => Math.max(1, Math.floor(0.07 * t + 1e-9));
  let plans = 0, thrown = 0, mono = 0, step7 = 0, step10 = 0, plans10 = 0, tot7w = 0, tot7plans = 0, land = 0, landPossible = 0, flats2 = 0, avoid2 = 0, notPeak = 0, maxMs = 0;
  const ex = [];
  for (let t = 0; t < 20000; t++) {
    const N = 4 + rnd(13), k = 1 + rnd(12); const lines = [];
    for (let i = 0; i < k; i++) { const [S, C] = LV[rnd(LV.length)]; const f = rnd(4) === 0 ? 1 + rnd(3) : 0; lines.push({ n: 'l' + i, S: S + f, C: C + f }); }
    let r; const t0 = process.hrtime.bigint();
    try { r = flowSchedule(lines, N); } catch (e) { thrown++; if (ex.length < 3) ex.push({ kind: 'flow threw: ' + e.message, N, lines: lines.map((l) => `${l.S}->${l.C}`).join(' ') }); continue; }
    maxMs = Math.max(maxMs, Number(process.hrtime.bigint() - t0) / 1e6);
    plans++;
    const { L, sched, units } = r;
    const tot = []; for (let w = 0; w < N; w++) tot.push(sched.reduce((a, x) => a + x[w], 0));
    sched.forEach((x, i) => { for (let w = 1; w < N; w++) { if (x[w] < x[w - 1]) mono++; if (x[w] - x[w - 1] > lineCap(x[w - 1])) { step7++; if (ex.length < 6) ex.push({ kind: 'line step over max(1, 7 % of the realized week)', N, x: x.join(' ') }); } } if (x[N - 1] !== L[i].P) notPeak++; });
    let b10 = false, b7 = false;
    for (let w = 1; w < N; w++) { const rise = tot[w] - tot[w - 1]; if (rise > tot10(tot[w - 1])) { step10++; b10 = true; if (ex.length < 9) ex.push({ kind: 'total rise >= 10 % of the realized week', N, tot: tot.join(' '), lines: L.map((l) => `${l.S}->${l.P}`).join(' ') }); } if (rise > tot7(tot[w - 1])) { tot7w++; b7 = true; } }
    if (b10) plans10++; if (b7) tot7plans++;
    const climbing = L.filter((l) => l.P > l.S).length;
    if (climbing <= tot10(tot[N - 2])) { landPossible++; if (sched.every((x, i) => L[i].P === L[i].S || x[N - 1] > x[N - 2])) land++; }
    if (units - climbing >= N - 2) { avoid2++; for (let w = 1; w < N; w++) if (tot[w] === tot[w - 1]) { flats2++; break; } }
  }
  console.log(`\n4. stairway flow stress, sound generator, the INTENDED distribution (1-12 lines, all 8 level rows, Focus on 1 line in 4): ${plans} plans, ${thrown} thrown`);
  console.log(`   line decreases ${mono}; lines not on their peak in week N ${notPeak}; realized line steps over max(1, 7 %) ${step7}`);
  console.log(`   realized weekly total rises >= 10 %: ${step10} weeks in ${plans10} plans (hard rule T0-STW-03)`);
  console.log(`   weekly total rises above max(1, 7 %) [placed.total_pct]: ${tot7w} weeks in ${tot7plans} plans`);
  console.log(`   every climbing line lands in week N: ${land}/${landPossible} plans where the 10 % rule allows it`);
  console.log(`   plans with >= N-2 non-final sets that still have a flat week: ${flats2}/${avoid2}`);
  console.log(`   max solve time ${maxMs.toFixed(1)} ms`);
  for (const e of ex) console.log('   example:', JSON.stringify(e));
}
