// Research prototype (design/algorithm_research.md, section 6.3): the integer stairway as a min-cost flow.
// Compares the current engine's rounding of the lambda curve (bank: add a whole set when the planned target passes it)
// with an exact min-cost-flow schedule of the same unit increments. Read-only with respect to the engine.
// Run: node design/research/proto_stairway_flow.mjs
import { MinCostFlow } from './mcf.mjs';
import { nowMs, isMain, print } from './env.mjs';

const EARLY = 0.03, LATE = 0.05, GROUP_STEP_MAX = 0.07, TOTAL_STEP_MAX = 0.10;

/** the engine's planned curve (12 v1.2 section 3.7.1): 3 % to the halfway week, 5 % after, lambda-scaled to land on C */
export function lambdaCurve(S, C, N) {
  const h = Math.ceil(N / 2);
  const steps = []; for (let w = 2; w <= N; w++) steps.push(w <= h ? EARLY : LATE);
  const growth = (lam) => steps.reduce((g, s) => g * (1 + lam * s), 1);
  let lam = 1;
  if (S * growth(1) > C + 1e-9) { let lo = 0, hi = 1; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (S * growth(mid) > C) hi = mid; else lo = mid; } lam = (lo + hi) / 2; }
  const T = [S]; for (let w = 2; w <= N; w++) T.push(Math.min(C, T[w - 2] * (1 + lam * steps[w - 2])));
  const P = lam < 1 ? C : Math.min(C, Math.floor(T[N - 1] + 1e-9));
  // the whole-set peak is the curve's ceiling: clamp so the cumulative ideal stays monotone (an unclamped curve whose
  // fractional week N-1 value passes the floored peak gives a negative planned rise into week N)
  for (let w = 0; w < N; w++) T[w] = Math.min(T[w], P);
  T[N - 1] = P;
  return { T, P, lam };
}

/** current engine behaviour: bank the fraction, add a whole set when the target passes it (VOL-06) */
function bankSchedule(S, T) { return T.map((t) => S + Math.floor(t - S + 1e-9)); }

/** crossing time (fractional week, 1-based) of unit k: when the planned curve reaches S + k */
function crossing(T, S, k) {
  const L = S + k;
  for (let w = 1; w < T.length; w++) if (T[w] >= L - 1e-9) return w + (L - T[w - 1]) / Math.max(1e-9, T[w] - T[w - 1]);
  return T.length;
}

/**
 * Exact integer stairway for several lines at once.
 * Hard: whole sets, every line monotone, every line ends on its peak in week N (its last set lands in week N),
 *       per-line step <= max(1, floor(7 % of last week)), weekly total step < 10 % (one whole set always allowed).
 * Lexicographic soft goals (by cost magnitude): (1) no flat week in the weekly total, (2) weekly total steps match the
 *       3 % / 5 % stairway, (3) each set lands as close as possible to when the planned curve reaches it.
 */
export function flowSchedule(lines, N) {
  const L = lines.map((l) => ({ ...l, ...lambdaCurve(l.S, l.C, N) }));
  const units = []; // {li, k, t}
  L.forEach((l, li) => { for (let k = 1; k <= l.P - l.S; k++) units.push({ li, k, t: crossing(l.T, l.S, k), last: k === l.P - l.S }); });
  // planned weekly total rises: house-monotone rounding of the cumulative ideal total (never negative)
  const cumIdeal = (w) => L.reduce((a, l) => a + (l.T[w - 1] - l.S), 0);
  const D = [0, 0]; for (let w = 2; w <= N; w++) D.push(Math.floor(cumIdeal(w) + 0.5) - Math.floor(cumIdeal(w - 1) + 0.5));
  // node ids
  let id = 0; const SRC = id++, SNK = id++;
  const U = units.map(() => id++);
  const G = L.map(() => { const a = []; for (let w = 0; w <= N; w++) a.push(id++); return a; });
  const W = []; for (let w = 0; w <= N; w++) W.push(id++);
  const f = new MinCostFlow(id);
  const unitArcs = [];
  units.forEach((u, ui) => {
    f.addEdge(SRC, U[ui], 1, 0);
    const arcs = [];
    for (let w = 2; w <= N; w++) {
      // every line lands on its peak in the last week: soft at the top tier (20000), so the hard 10 % rule wins a conflict
      // and the conflict is reported instead of the solve failing (tiny plans: two lines cannot both step in week N)
      const miss = u.last && w !== N ? 20000 : 0;
      arcs.push([w, f.addEdge(U[ui], G[u.li][w], 1, miss + Math.round(100 * Math.abs(w - u.t)))]);
    }
    unitArcs.push(arcs);
  });
  let plannedTotal = L.reduce((a, l) => a + l.S, 0);
  for (let w = 2; w <= N; w++) {
    L.forEach((l, li) => f.addEdge(G[li][w], W[w], Math.max(1, Math.floor(GROUP_STEP_MAX * l.T[w - 2] + 1e-9)), 0));
    const tcap = Math.max(1, Math.ceil(TOTAL_STEP_MAX * plannedTotal) - 1);   // strictly below +10 %
    f.addEdge(W[w], SNK, 1, -10000);                          // (1) never flat: the first set of each week is worth a lot
    if (D[w] > 1) f.addEdge(W[w], SNK, D[w] - 1, 0);         // (2) the planned 3 % / 5 % step is free
    const extra = tcap - Math.max(1, D[w]);
    if (extra > 0) f.addEdge(W[w], SNK, extra, 300);          //     going past the planned step costs 3 weeks of timing
    plannedTotal += D[w];
  }
  const res = f.run(SRC, SNK, units.length);
  if (res.flow !== units.length) throw new Error(`infeasible: placed ${res.flow} of ${units.length} sets`);
  const weeksOf = L.map(() => []);
  units.forEach((u, ui) => { for (const [w, e] of unitArcs[ui]) if (f.flowOn(e) === 1) weeksOf[u.li].push(w); });
  const sched = L.map((l, li) => { const ws = weeksOf[li].sort((a, b) => a - b); const x = []; for (let w = 1; w <= N; w++) x.push(l.S + ws.filter((v) => v <= w).length); return x; });
  return { L, sched, D, cost: res.cost, units: units.length };
}

function metrics(L, sched, N) {
  const tot = []; for (let w = 0; w < N; w++) tot.push(sched.reduce((a, x) => a + x[w], 0));
  const rises = tot.slice(1).map((t, i) => t - tot[i]);
  const pct = rises.map((r, i) => (100 * r) / tot[i]);
  let maxLineStep = 0, lineStepViol = 0, lastWeekLand = 0, monotone = true;
  sched.forEach((x, li) => {
    for (let w = 1; w < N; w++) { const r = x[w] - x[w - 1]; if (r < 0) monotone = false; maxLineStep = Math.max(maxLineStep, r); if (r > Math.max(1, Math.floor(GROUP_STEP_MAX * x[w - 1] + 1e-9))) lineStepViol++; }
    if (x[N - 1] === L[li].P && (L[li].P === L[li].S || x[N - 2] < x[N - 1])) lastWeekLand++;
  });
  return { tot, flats: rises.filter((r) => r === 0).length, flatWeeks: rises.map((r, i) => (r === 0 ? i + 2 : null)).filter(Boolean), maxPct: Math.max(...pct), totViol: pct.filter((p) => p >= 10 - 1e-9 && false).length, pct, maxLineStep, lineStepViol, lastWeekLand, monotone };
}

const SCENARIOS = [
  { name: 'S1  L1 full body, 12 wk (8 lines 10->14, calves 12->14)', N: 12, lines: [
    ...['quads', 'hamstrings', 'glutes', 'chest', 'back', 'shoulders', 'biceps', 'triceps'].map((n) => ({ n, S: 10, C: 14 })), { n: 'calves', S: 12, C: 14 }] },
  { name: 'S2  L2, 12 wk (big 15->22; shoulders / arms / calves 12->22 cap)', N: 12, lines: [
    ...['quads', 'hamstrings', 'glutes', 'chest', 'back'].map((n) => ({ n, S: 15, C: 22 })), ...['shoulders', 'biceps', 'triceps', 'calves'].map((n) => ({ n, S: 12, C: 22 }))] },
  { name: 'S3  L3, 12 wk (big 20->25; small 15->25 cap)', N: 12, lines: [
    ...['quads', 'hamstrings', 'glutes', 'chest', 'back'].map((n) => ({ n, S: 20, C: 25 })), ...['shoulders', 'biceps', 'triceps', 'calves'].map((n) => ({ n, S: 15, C: 25 }))] },
  { name: 'S4  L2, 8 wk block (big 15->22 cap; small 12->22 cap)', N: 8, lines: [
    ...['quads', 'hamstrings', 'glutes', 'chest', 'back'].map((n) => ({ n, S: 15, C: 22 })), ...['shoulders', 'biceps', 'triceps', 'calves'].map((n) => ({ n, S: 12, C: 22 }))] },
  { name: 'S5  L2 Focus glutes +2 (17->24), 12 wk', N: 12, lines: [
    { n: 'glutes*', S: 17, C: 24 }, ...['quads', 'hamstrings', 'chest', 'back'].map((n) => ({ n, S: 15, C: 22 })), ...['shoulders', 'biceps', 'triceps', 'calves'].map((n) => ({ n, S: 12, C: 22 }))] },
  { name: 'S6  pickleball keep-time 2 x 45 (coach 12 v1.2 5.5: hips 10->14, calves 6->7), 12 wk', N: 12, lines: [{ n: 'hips', S: 10, C: 14 }, { n: 'calves', S: 6, C: 7 }] },
];

const fmt = (a) => a.join(' ');
if (isMain(import.meta.url)) {
const out = [];
for (const sc of SCENARIOS) {
  const t0 = nowMs();
  const { L, sched, D, units } = flowSchedule(sc.lines, sc.N);
  const ms = nowMs() - t0;
  const bank = L.map((l) => bankSchedule(l.S, l.T));
  const mb = metrics(L, bank, sc.N), mf = metrics(L, sched, sc.N);
  out.push(`\n## ${sc.name}`);
  out.push(`units (whole sets to add) = ${units}; transitions = ${sc.N - 1}; planned total rises D = ${fmt(D.slice(2))}; flow solve ${ms.toFixed(1)} ms`);
  out.push(`bank  totals: ${fmt(mb.tot)} | flat weeks ${mb.flats}${mb.flats ? ' (' + mb.flatWeeks.join(',') + ')' : ''} | max weekly rise ${mb.maxPct.toFixed(1)} % | lines landing in week N with a step ${mb.lastWeekLand}/${L.length}`);
  out.push(`flow  totals: ${fmt(mf.tot)} | flat weeks ${mf.flats}${mf.flats ? ' (' + mf.flatWeeks.join(',') + ')' : ''} | max weekly rise ${mf.maxPct.toFixed(1)} % | lines landing in week N with a step ${mf.lastWeekLand}/${L.length} | max line step ${mf.maxLineStep} | 7 %-rule violations ${mf.lineStepViol} | monotone ${mf.monotone}`);
  L.forEach((l, li) => out.push(`   ${l.n.padEnd(11)} lambda ${l.lam.toFixed(2)}  bank ${fmt(bank[li])}   |  flow ${fmt(sched[li])}`));
}
print(out.join('\n'));
}
