// Judge 2 (mathematical rigor) - audit of the research stairway flow (design/research/proto_stairway_flow.mjs).
// Read-only with respect to everything outside design/judge2/. Run: node design/judge2/flow_audit.mjs
//
// Questions:
//  A. The flow's hard capacities are computed from the PLANNED curve (static). The coach rules are stated on the REALIZED
//     previous week (state-dependent). Do realized schedules ever break the realized rules?
//  B. model/rules.json stairway.limits.placed.total_pct = 0.07 ("the week total at most 7 %; 10 % is never reached").
//     The research stress test only checks "< 10 %". How often does the flow break the 7 % placed-total rule, and how often
//     is "every line lands in week N" impossible under it?
//  C. Tier order by weights (landing 20000 > never-flat 10000 > shape 300 > timing 100/week): is the flow's
//     (landings, flat weeks) the true lexicographic optimum under the realized rules? Exact DP comparator on small plans.
import { flowSchedule } from '../research/proto_stairway_flow.mjs';

// sound generator (mulberry32, exact 32-bit arithmetic; the research LCG loses its low bits in doubles - see prng_audit.mjs)
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0); }; }
let gen = mulberry32(20261009);
const rnd = (k) => gen() % k;

const lineCap = (x) => Math.max(1, Math.floor(0.07 * x + 1e-9));            // realized per-line rule
const tot10 = (t) => Math.max(1, Math.ceil(0.10 * t - 1e-9) - 1);            // strictly below +10 %, one set always allowed
const tot7 = (t) => Math.max(1, Math.floor(0.07 * t + 1e-9));                // placed total rule: at most 7 %, one set always allowed

function audit(name, gen, trials) {
  let plans = 0, thrown = 0, v7line = 0, v10 = 0, v7tot = 0, v7totPlans = 0, landImpossible7 = 0, landAll = 0, climbingPlans = 0;
  const ex = [];
  for (let t = 0; t < trials; t++) {
    const { lines, N } = gen();
    let r;
    try { r = flowSchedule(lines, N); } catch (e) { thrown++; continue; }
    plans++;
    const { L, sched } = r;
    const tot = []; for (let w = 0; w < N; w++) tot.push(sched.reduce((a, x) => a + x[w], 0));
    let bad7 = false;
    for (const x of sched) for (let w = 1; w < N; w++) if (x[w] - x[w - 1] > lineCap(x[w - 1])) { v7line++; if (ex.length < 3) ex.push({ kind: 'line step over max(1, 7 % of the realized week)', N, x: x.join(' ') }); }
    for (let w = 1; w < N; w++) {
      const rise = tot[w] - tot[w - 1];
      if (rise > tot10(tot[w - 1])) { v10++; if (ex.length < 6) ex.push({ kind: 'total rise >= 10 % of the realized week', N, tot: tot.join(' '), lines: L.map((l) => `${l.S}->${l.P}`).join(' ') }); }
      if (rise > tot7(tot[w - 1])) { v7tot++; bad7 = true; }
    }
    if (bad7) v7totPlans++;
    const climbing = L.filter((l) => l.P > l.S).length;
    if (climbing) {
      climbingPlans++;
      if (sched.every((x, i) => L[i].P === L[i].S || x[N - 1] > x[N - 2])) landAll++;
      // under the 7 % placed-total rule all climbing lines can step in week N only if their count fits the week-N cap
      if (climbing > tot7(tot[N - 2])) landImpossible7++;
    }
  }
  console.log(`\n[${name}] ${plans} plans (${thrown} thrown as infeasible by the flow)`);
  console.log(`  A. realized per-line step over max(1, floor(7 %)): ${v7line} line-weeks; realized total rise >= 10 %: ${v10} weeks`);
  console.log(`  B. weeks whose total rises more than max(1, floor(7 %)) [rules.stairway.limits.placed.total_pct]: ${v7tot} weeks in ${v7totPlans}/${plans} plans`);
  console.log(`     plans where every climbing line lands in week N: ${landAll}/${climbingPlans}; plans where that is arithmetically impossible under the 7 % total rule: ${landImpossible7}/${climbingPlans}`);
  for (const e of ex) console.log('     example:', JSON.stringify(e));
}

// the research stress distribution (same table of starts / ceilings)
const LV = [[10, 14], [15, 22], [20, 25], [12, 22], [15, 25], [6, 7], [9, 22], [12, 14]];
audit('research distribution (1-12 lines, N 4-16)', () => {
  const N = 4 + rnd(13), k = 1 + rnd(12); const lines = [];
  for (let i = 0; i < k; i++) { const [S, C] = LV[rnd(LV.length)]; const f = rnd(4) === 0 ? 1 + rnd(3) : 0; lines.push({ n: 'l' + i, S: S + f, C: C + f }); }
  return { lines, N };
}, 20000);

// small plans (the pickleball / swimmer / class cases: 1-4 trained groups, time-lowered ranges)
audit('small plans (1-4 lines, S 6-12, climb 1-6, N 4-12)', () => {
  const N = 4 + rnd(9), k = 1 + rnd(4); const lines = [];
  for (let i = 0; i < k; i++) { const S = 6 + rnd(7); lines.push({ n: 'l' + i, S, C: S + 1 + rnd(6) }); }
  return { lines, N };
}, 20000);

// the coach's level table exactly: full plans of 8-9 lines at one level (L1 10->14, L2 15->22 / 12->22, L3 20->25 / 15->25)
audit('full level plans (8-9 lines of one level, N 8-12, Focus +1..+3 on 0-2 lines)', () => {
  const N = 8 + rnd(5), lvl = rnd(3); const lines = [];
  const big = [[10, 14], [15, 22], [20, 25]][lvl], small = [[10, 14], [12, 22], [15, 25]][lvl];
  for (let i = 0; i < 5; i++) lines.push({ n: 'big' + i, S: big[0], C: big[1] });
  for (let i = 0; i < 3 + rnd(2); i++) lines.push({ n: 'small' + i, S: small[0], C: small[1] });
  for (let f = rnd(3); f > 0; f--) { const i = rnd(lines.length), add = 1 + rnd(3); lines[i] = { ...lines[i], S: lines[i].S + add, C: lines[i].C + add }; }
  return { lines, N };
}, 5000);

// parameter robustness (DR-23): groups dosed as ONE line (hips = glutes + hamstrings), ceilings up to the absolute 30 / Pro 35
audit('group-level lines with high ceilings (S 20-28, C up to 35, N 8-16)', () => {
  const N = 8 + rnd(9), k = 1 + rnd(8); const lines = [];
  for (let i = 0; i < k; i++) { const S = 20 + rnd(9); lines.push({ n: 'l' + i, S, C: Math.min(35, S + 2 + rnd(10)) }); }
  return { lines, N };
}, 20000);

// ------------------------------------------------------------------------------------------------------------------
// C. exact comparator: DP over weeks, state = remaining units per line; realized rules; lexicographic (landings, flats)
function exactBest(S, P, N) {
  const k = S.length, u = S.map((s, i) => P[i] - s), base = S.reduce((a, b) => a + b, 0), U = u.reduce((a, b) => a + b, 0);
  const mult = []; let m = 1; for (let i = 0; i < k; i++) { mult.push(m); m *= u[i] + 1; }
  const dec = (code) => u.map((ui, i) => Math.floor(code / mult[i]) % (ui + 1));
  const BIG = 1000;
  let cur = new Map([[u.reduce((a, ui, i) => a + ui * mult[i], 0), 0]]);   // remaining code -> best cost
  for (let w = 2; w <= N; w++) {
    const nxt = new Map();
    for (const [code, cost] of cur) {
      const r = dec(code), placed = U - r.reduce((a, b) => a + b, 0), tot = base + placed;
      const cap = tot10(tot);
      const can = []; for (let i = 0; i < k; i++) if (r[i] > 0 && 1 <= lineCap(P[i] - r[i])) can.push(i);
      for (let mask = 0; mask < (1 << can.length); mask++) {
        let cnt = 0, nc = code; for (let b = 0; b < can.length; b++) if (mask >> b & 1) { cnt++; nc -= mult[can[b]]; }
        if (cnt > cap) continue;
        let c = cost + (cnt === 0 ? 1 : 0);
        if (w === N) { if (nc !== 0) continue; c -= BIG * cnt; }
        const old = nxt.get(nc); if (old === undefined || c < old) nxt.set(nc, c);
      }
    }
    cur = nxt;
  }
  const best = cur.get(0);
  if (best === undefined) return null;
  const land = Math.ceil(-best / BIG - 1e-9), flats = best + BIG * land;
  return { land: land < 0 ? 0 : land, flats };
}

let cmp = 0, worse = 0, better = 0, infeasibleFlow = 0, exactInfeasible = 0; const exC = [];
gen = mulberry32(777);
for (let t = 0; t < 6000; t++) {
  const N = 4 + rnd(8), k = 1 + rnd(5); const lines = [];
  for (let i = 0; i < k; i++) { const S = 6 + rnd(15); lines.push({ n: 'l' + i, S, C: S + 1 + rnd(4) }); }
  let r; try { r = flowSchedule(lines, N); } catch { infeasibleFlow++; continue; }
  const { L, sched } = r;
  const S = L.map((l) => l.S), P = L.map((l) => l.P);
  const idx = L.map((l, i) => i).filter((i) => P[i] > S[i]);
  if (!idx.length) continue;
  const ex = exactBest(idx.map((i) => S[i]), idx.map((i) => P[i]), N);
  // note: the exact comparator only moves the climbing lines; flat lines add a constant to the total
  const constTot = L.reduce((a, l, i) => a + (P[i] > S[i] ? 0 : l.S), 0);
  const ex2 = constTot ? exactBestWithConst(idx.map((i) => S[i]), idx.map((i) => P[i]), N, constTot) : ex;
  if (!ex2) { exactInfeasible++; continue; }
  const tot = []; for (let w = 0; w < N; w++) tot.push(sched.reduce((a, x) => a + x[w], 0));
  const land = idx.filter((i) => sched[i][N - 1] > sched[i][N - 2]).length;
  let flats = 0; for (let w = 1; w < N; w++) if (tot[w] === tot[w - 1]) flats++;
  cmp++;
  if (land < ex2.land || (land === ex2.land && flats > ex2.flats)) { worse++; if (exC.length < 4) exC.push({ N, lines: L.map((l) => `${l.S}->${l.P}`).join(' '), flow: { land, flats, tot: tot.join(' ') }, exact: ex2 }); }
  if (land > ex2.land || (land === ex2.land && flats < ex2.flats)) better++;   // "better" than the exact optimum = the flow broke a realized rule
}
function exactBestWithConst(S, P, N, c) { return exactBest([...S, c], [...P, c], N); }
console.log(`\n[C. flow vs exact lexicographic optimum (landings first, then flat weeks), realized rules, small plans]`);
console.log(`  compared ${cmp} plans (${infeasibleFlow} thrown by the flow, ${exactInfeasible} with no schedule at all): flow lexicographically WORSE than the optimum in ${worse}; flow "better" than the optimum (= it broke a realized rule) in ${better}`);
for (const e of exC) console.log('     example:', JSON.stringify(e));
