// design/milp_proto/kern.mjs - prototype kernel for design/design_milp.md (NOT engine code).
// LP-based branch-and-bound over the research Model class (design/research/kernel.mjs), with the hardening the design asks for:
//   1. local Chvatal-Gomory rounding cuts on every non-unit row, recomputed from the node's bounds (closes the "leftover minutes"
//      gap of the day-time knapsacks, which is what made the research kernel's optimality proofs slow);
//   2. a start solution (incumbent) so a solve never comes back empty and prunes from node 1;
//   3. four verdicts: optimal | infeasible | feasible (budget hit, incumbent kept) | unknown (budget hit, nothing found);
//   4. deterministic budgets in nodes, never a clock; integer objectives, exact freezes, exact integer re-check of incumbents.
// Reuses the research LP (bounded dual simplex) and bounds propagation unchanged.
import { propagate } from '../research/kernel.mjs';
import { lpSolve } from '../research/lp.mjs';

const FR = 1e-6;

export function solveMip(m, objective, { nodeLimit = 1e5, fix = null, start = null, cuts = true, stats = null } = {}) {
  const n = m.lo.length;
  const lo = m.lo.slice(), hi = m.hi.slice();
  const empty = (status) => ({ status, value: null, sol: null, nodes: 0, lpIters: 0, cutsAdded: 0 });
  if (fix) for (const [v, l, h] of fix) { lo[v] = Math.max(lo[v], l); hi[v] = Math.min(hi[v], h); if (lo[v] > hi[v]) return empty('infeasible'); }
  const exactCheck = (sol) => {
    for (let j = 0; j < n; j++) if (sol[j] < lo[j] || sol[j] > hi[j] || !Number.isInteger(sol[j])) return false;
    return m.cons.every(({ a, v, b }) => { if (b === Infinity) return true; let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * sol[v[i]]; return s <= b; });
  };
  let best = null, bestVal = Infinity;
  if (start && exactCheck(start)) { best = start.slice(); bestVal = objective ? objective.reduce((acc, [c, v]) => acc + c * start[v], 0) : 0; }
  const objK = objective ? m.add(objective, best ? bestVal - 1 : Infinity, 'objective') : -1;
  const done = (r) => { if (objective) m.pop(1); return r; };
  if (!objective && best) return done({ status: 'optimal', value: 0, sol: best, nodes: 0, lpIters: 0, cutsAdded: 0 });
  const nc = m.cons.length, inq = new Uint8Array(nc), queue = [], trail = [];
  for (let k = nc - 1; k >= 0; k--) { queue.push(k); inq[k] = 1; }
  let nodes = 0, hitLimit = false, lpIters = 0, cutsAdded = 0;
  const fin = () => {
    const status = best ? (hitLimit ? 'feasible' : 'optimal') : (hitLimit ? 'unknown' : 'infeasible');
    return done({ status, value: best ? bestVal : null, sol: best, nodes, lpIters, cutsAdded });
  };
  if (!propagate(m, lo, hi, queue, inq, trail)) return fin();
  const rank = new Int32Array(n).fill(1 << 30); (m.order || []).forEach((v, i) => { if (rank[v] === 1 << 30) rank[v] = i; });
  const objC = new Float64Array(n); if (objective) for (const [c, v] of objective) objC[v] += c;
  const undo = (mark) => { while (trail.length > mark) { const h = trail.pop(), l = trail.pop(), x = trail.pop(); lo[x] = l; hi[x] = h; } };

  function relax() {
    const map = new Int32Array(n).fill(-1), free = [];
    for (let j = 0; j < n; j++) if (lo[j] < hi[j]) { map[j] = free.length; free.push(j); }
    const rows = [];
    for (let k = 0; k < m.cons.length; k++) {
      const { a, v, b } = m.cons[k]; if (b === Infinity) continue;
      let fixedSum = 0, maxAct = 0, minAct = 0, nonUnit = false; const idx = [], val = [], org = [];
      for (let i = 0; i < a.length; i++) {
        const x = v[i];
        if (map[x] < 0) fixedSum += a[i] * lo[x];
        else { idx.push(map[x]); val.push(a[i]); org.push(x); maxAct += a[i] > 0 ? a[i] * hi[x] : a[i] * lo[x]; minAct += a[i] > 0 ? a[i] * lo[x] : a[i] * hi[x]; if (a[i] !== 1 && a[i] !== -1) nonUnit = true; }
      }
      if (fixedSum + maxAct <= b) continue;           // can no longer be violated at this node
      rows.push({ idx, val, b: b - fixedSum });
      if (!cuts || !nonUnit || idx.length < 2 || k === objK) continue;
      // local Chvatal-Gomory rounding cuts. Shift every variable to its node bound (x' = x - lo for a > 0, x' = hi - x for a < 0):
      //   sum |a_j| x'_j <= beta,  beta = b - fixedSum - minAct >= 0,  x' >= 0 integer
      // dividing by u and rounding down gives  sum floor(|a_j|/u) x'_j <= floor(beta/u)  (valid for every integer point of the node).
      const beta = b - fixedSum - minAct;
      const seen = new Set();
      for (let t = 0; t < val.length; t++) {
        const u = Math.abs(val[t]); if (u < 2 || seen.has(u)) continue; seen.add(u);
        const rhs0 = Math.floor(beta / u + 1e-9);
        let lhsMax = 0, shift = 0; const ci = [], cv = [];
        for (let i = 0; i < val.length; i++) {
          const f = Math.floor(Math.abs(val[i]) / u + 1e-9); if (!f) continue;
          const x = org[i]; lhsMax += f * (hi[x] - lo[x]);
          if (val[i] > 0) { ci.push(idx[i]); cv.push(f); shift += f * lo[x]; } else { ci.push(idx[i]); cv.push(-f); shift -= f * hi[x]; }
        }
        if (lhsMax <= rhs0 || !ci.length) continue;   // cannot cut anything
        rows.push({ idx: ci, val: cv, b: rhs0 + shift }); cutsAdded++;
      }
    }
    const c = new Float64Array(free.length), l = new Float64Array(free.length), u = new Float64Array(free.length);
    let constant = 0;
    for (let j = 0; j < n; j++) if (map[j] < 0) constant += objC[j] * lo[j];
    free.forEach((j, i) => { c[i] = objC[j]; l[i] = lo[j]; u[i] = hi[j]; });
    const r = lpSolve(free.length, rows, c, l, u);
    lpIters += r.iters;
    return { r, free, constant };
  }

  function dfs() {
    if (++nodes > nodeLimit) { hitLimit = true; return; }
    const { r, free, constant } = relax();
    if (r.status === 'infeasible') return;
    if (r.status !== 'optimal') { hitLimit = true; return; }
    if (objective && Math.ceil(r.obj + constant - FR) >= bestVal) return;
    let bj = -1, bv = 0;
    free.forEach((j, i) => { const x = r.x[i]; if (Math.abs(x - Math.round(x)) > FR && (bj === -1 || rank[j] < rank[bj] || (rank[j] === rank[bj] && j < bj))) { bj = j; bv = x; } });
    if (bj === -1) {
      const sol = lo.slice(); free.forEach((j, i) => { sol[j] = Math.round(r.x[i]); });
      if (exactCheck(sol)) {
        const val = objective ? objective.reduce((acc, [c, v]) => acc + c * sol[v], 0) : 0;
        if (val < bestVal) { bestVal = val; best = sol; if (objective) m.cons[objK].b = val - 1; }
        return;
      }
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
  if (stats) { stats.nodes = (stats.nodes || 0) + nodes; stats.lpIters = (stats.lpIters || 0) + lpIters; stats.calls = (stats.calls || 0) + 1; }
  return fin();
}

/**
 * Lexicographic goal programming: one integer objective per tier, each optimum frozen as an exact row before the next tier.
 * The previous tier's solution is the start solution of the next (never empty, prunes from node 1).
 * tier = { name, terms:[[coef,var],...], sense:'min' }   (maximize = minimize the negated terms)
 */
export function solveLex(m, tiers, opts = {}) {
  const report = []; let last = opts.start || null, added = 0, allProven = true;
  for (const t of tiers) {
    const r = solveMip(m, t.terms, { ...opts, nodeLimit: t.nodeLimit || opts.nodeLimit, start: last });
    report.push({ tier: t.name, status: r.status, value: r.value, nodes: r.nodes, lpIters: r.lpIters, cuts: r.cutsAdded });
    if (!r.sol) { m.pop(added); return { status: r.status, report, sol: last }; }
    if (r.status !== 'optimal') allProven = false;
    last = r.sol;
    added += m.lin(t.terms, '<=', r.value, `freeze:${t.name}`);
  }
  if (!opts.keepFreezes) m.pop(added);
  return { status: allProven ? 'optimal' : 'feasible', report, sol: last, added };
}
