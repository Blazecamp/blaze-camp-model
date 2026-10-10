// Judge 2 copy of design/research/milp.mjs with CERTIFIED pruning (safe dual bounds, Neumaier & Shcherbina 2004).
// The research code prunes a node when the floating-point LP says "infeasible" or "bound >= incumbent". Here a node is
// pruned only when that claim is re-proved in exact integer arithmetic (BigInt) from the LP's row multipliers:
//   for ANY y >= 0 and every x in the box with A x <= b:   c.x >= sum_j min over [lo_j, hi_j] of (c + A'y)_j x_j - y.b
// (weak duality; it holds for whatever y the simplex returns, however inexact). With c = 0 and a positive right-hand
// side this proves infeasibility. If the proof fails, the node is NOT pruned: the search branches on. Domains are finite
// and integer propagation decides every fully fixed node, so the search still terminates and every "infeasible" /
// "optimal" verdict is a theorem, not a floating-point opinion.
// Research prototype (design/algorithm_research.md, section 6.4): LP-based branch-and-bound over the kernel's Model.
// Each node: bounds propagation (kernel.propagate) -> presolve (drop rows that can no longer be violated, substitute
// fixed variables) -> LP relaxation (lp.mjs bounded dual simplex) -> prune by infeasibility or bound -> branch on the
// fractional variable that comes first in the model's priority order. Integer objectives: a node is pruned when
// ceil(LP bound) >= incumbent, so proofs are exact. A deterministic node budget replaces any wall-clock limit.
import { propagate } from '../research/kernel.mjs';
import { lpSolve } from './lp_cert.mjs';

const K = 1 << 24;   // multipliers are rounded to multiples of 2^-24: still valid, because ANY y >= 0 is
export const stats = { lpInfeasible: 0, certInfeasible: 0, boundPrunes: 0, certBound: 0, uncertified: 0 };
/** exact lower bound numerator: K * (c.x) >= returned BigInt, for every x in the box that satisfies the rows */
function safeBound(rows, c, l, u, y) {
  const n = l.length, r = new Array(n).fill(0n); let rhs = 0n;
  for (let j = 0; j < n; j++) r[j] = BigInt(K) * BigInt(Math.round(c[j]));
  for (let i = 0; i < rows.length; i++) {
    const yi = y[i] > 0 && Number.isFinite(y[i]) ? BigInt(Math.round(y[i] * K)) : 0n; if (yi === 0n) continue;
    const { idx, val, b } = rows[i]; rhs += yi * BigInt(b);
    for (let k = 0; k < idx.length; k++) r[idx[k]] += yi * BigInt(val[k]);
  }
  let s = -rhs; for (let j = 0; j < n; j++) s += r[j] > 0n ? r[j] * BigInt(l[j]) : r[j] * BigInt(u[j]);
  return s;
}

const FR = 1e-6;

export function solveMip(m, objective, { nodeLimit = 1e5, fix = null } = {}) {
  const n = m.lo.length;
  const lo = m.lo.slice(), hi = m.hi.slice();
  if (fix) for (const [v, l, h] of fix) { lo[v] = Math.max(lo[v], l); hi[v] = Math.min(hi[v], h); if (lo[v] > hi[v]) return { status: 'infeasible', value: null, sol: null, nodes: 0, lpIters: 0 }; }
  const objK = objective ? m.add(objective, Infinity, 'objective') : -1;
  const done = (r) => { if (objective) m.pop(1); return r; };
  const nc = m.cons.length, inq = new Uint8Array(nc), queue = [], trail = [];
  for (let k = nc - 1; k >= 0; k--) { queue.push(k); inq[k] = 1; }
  if (!propagate(m, lo, hi, queue, inq, trail)) return done({ status: 'infeasible', value: null, sol: null, nodes: 0, lpIters: 0 });
  const rank = new Int32Array(n).fill(1 << 30); (m.order || []).forEach((v, i) => { if (rank[v] === 1 << 30) rank[v] = i; });
  const objC = new Float64Array(n); if (objective) for (const [c, v] of objective) objC[v] += c;
  let best = null, bestVal = Infinity, nodes = 0, hitLimit = false, lpIters = 0;
  const undo = (mark) => { while (trail.length > mark) { const h = trail.pop(), l = trail.pop(), x = trail.pop(); lo[x] = l; hi[x] = h; } };

  function relax() {
    const map = new Int32Array(n).fill(-1), free = [];
    for (let j = 0; j < n; j++) if (lo[j] < hi[j]) { map[j] = free.length; free.push(j); }
    const rows = [];
    for (let k = 0; k < m.cons.length; k++) {
      const { a, v, b } = m.cons[k]; if (b === Infinity) continue;
      let fixedSum = 0, maxAct = 0; const idx = [], val = [];
      for (let i = 0; i < a.length; i++) {
        const x = v[i];
        if (map[x] < 0) fixedSum += a[i] * lo[x];
        else { idx.push(map[x]); val.push(a[i]); maxAct += a[i] > 0 ? a[i] * hi[x] : a[i] * lo[x]; }
      }
      if (fixedSum + maxAct <= b) continue;           // can no longer be violated: not a row of this node's LP
      rows.push({ idx, val, b: b - fixedSum });
    }
    const c = new Float64Array(free.length), l = new Float64Array(free.length), u = new Float64Array(free.length);
    let constant = 0;
    for (let j = 0; j < n; j++) if (map[j] < 0) constant += objC[j] * lo[j];
    free.forEach((j, i) => { c[i] = objC[j]; l[i] = lo[j]; u[i] = hi[j]; });
    const r = lpSolve(free.length, rows, c, l, u);
    lpIters += r.iters;
    return { r, free, constant, rows: rows.length, lp: { rows, c, l, u } };
  }
  const exactCheck = (sol) => m.cons.every(({ a, v, b }) => { if (b === Infinity) return true; let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * sol[v[i]]; return s <= b; });

  function dfs() {
    if (++nodes > nodeLimit) { hitLimit = true; return; }
    const { r, free, constant, lp } = relax();
    let forceBranch = false;
    if (r.status === 'infeasible') {
      stats.lpInfeasible++;
      // certificate: with c = 0, a positive safe bound means no x in the box satisfies the rows
      if (safeBound(lp.rows, new Float64Array(free.length), lp.l, lp.u, r.y) > 0n) { stats.certInfeasible++; return; }
      stats.uncertified++; forceBranch = true;
    } else if (r.status !== 'optimal') { hitLimit = true; return; }
    else if (objective && Math.ceil(r.obj + constant - FR) >= bestVal) {
      stats.boundPrunes++;
      // certificate: K * (objective - constant) >= sb  =>  objective >= constant + sb / K ; prune iff that is > bestVal - 1
      const sb = safeBound(lp.rows, lp.c, lp.l, lp.u, r.y);
      if (sb > BigInt(K) * BigInt(bestVal - 1 - constant)) { stats.certBound++; return; }
      stats.uncertified++;
    }
    if (forceBranch) {
      const bj0 = free.reduce((a, j) => (a === -1 || rank[j] < rank[a] ? j : a), -1);
      if (bj0 === -1) return;                                   // nothing free: propagation already proved this node consistent, cannot happen
      const mid = (lo[bj0] + hi[bj0]) / 2;
      for (const [x, l2, h2] of [[bj0, lo[bj0], Math.floor(mid)], [bj0, Math.floor(mid) + 1, hi[bj0]]]) {
        if (!objective && best) return;
        const mark = trail.length;
        trail.push(x, lo[x], hi[x]); lo[x] = Math.max(lo[x], l2); hi[x] = Math.min(hi[x], h2);
        for (const kk of m.watch[x]) if (!inq[kk]) { inq[kk] = 1; queue.push(kk); }
        if (objective && !inq[objK]) { inq[objK] = 1; queue.push(objK); }
        if (propagate(m, lo, hi, queue, inq, trail)) dfs();
        undo(mark);
        if (hitLimit) return;
      }
      return;
    }
    // branching variable: fractional in the LP, first in priority order
    let bj = -1, bv = 0;
    free.forEach((j, i) => { const x = r.x[i]; if (Math.abs(x - Math.round(x)) > FR && (bj === -1 || rank[j] < rank[bj] || (rank[j] === rank[bj] && j < bj))) { bj = j; bv = x; } });
    if (bj === -1) {
      const sol = lo.slice(); free.forEach((j, i) => { sol[j] = Math.round(r.x[i]); });
      if (exactCheck(sol)) {
        const val = objective ? objective.reduce((acc, [c, v]) => acc + c * sol[v], 0) : 0;
        if (val < bestVal) { bestVal = val; best = sol; if (objective) m.cons[objK].b = val - 1; }
        return;
      }
      // rounding broke a row (numerics): branch on the first free variable instead
      bj = free.reduce((a, j) => (a === -1 || rank[j] < rank[a] ? j : a), -1); bv = (lo[bj] + hi[bj]) / 2;
    }
    const down = [bj, lo[bj], Math.floor(bv)], up = [bj, Math.ceil(bv), hi[bj]];
    const kids = m.pref[bj] === 'up' ? [up, down] : [down, up];
    for (const [x, l, h] of kids) {
      if (!objective && best) return;
      if (l > h) continue;
      const mark = trail.length;
      trail.push(x, lo[x], hi[x]); lo[x] = Math.max(lo[x], l); hi[x] = Math.min(hi[x], h);
      for (const kk of m.watch[x]) if (!inq[kk]) { inq[kk] = 1; queue.push(kk); }
      if (objective && !inq[objK]) { inq[objK] = 1; queue.push(objK); }
      if (propagate(m, lo, hi, queue, inq, trail)) dfs();
      undo(mark);
      if (hitLimit) return;
    }
  }
  dfs();
  const status = best ? (hitLimit ? 'limit' : 'optimal') : (hitLimit ? 'limit' : 'infeasible');
  return done({ status, value: best ? bestVal : null, sol: best, nodes, lpIters });
}

/** lexicographic tiers with LP-based B&B; each tier's optimum is frozen exactly (integer objectives) */
export function solveLexMip(m, tiers, opts = {}) {
  const report = []; let last = null, added = 0;
  for (const t of tiers) {
    const r = solveMip(m, t.terms, opts);
    report.push({ tier: t.name, status: r.status, value: r.value, nodes: r.nodes, lpIters: r.lpIters });
    if (!r.sol) { m.pop(added); return { status: r.status, report, sol: last }; }
    last = r.sol;
    added += m.lin(t.terms, '<=', r.value, `freeze:${t.name}`);
  }
  m.pop(added);
  return { status: report.every((x) => x.status === 'optimal') ? 'optimal' : 'limit', report, sol: last };
}
