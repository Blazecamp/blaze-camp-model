// Research prototype (design/algorithm_research.md, section 6.4): a tiny exact integer solver for small planning models.
// Bounded integer variables, linear constraints with INTEGER coefficients, bounds-consistency propagation (as in CP
// solvers), depth-first branch-and-bound, lexicographic (preemptive) objectives solved tier by tier, and a deterministic
// node budget instead of a wall-clock limit. No floating point in any decision: identical results on every JS engine.
// Not engine code; the point is to measure whether a dependency-free exact kernel is fast enough at our sizes.

export class Model {
  constructor() { this.lo = []; this.hi = []; this.name = []; this.pref = []; this.cons = []; this.watch = []; this.order = []; }
  /** @param pref 'up' = try the largest value first, 'down' = smallest first */
  int(lo, hi, name, pref = 'down') {
    const i = this.lo.length; this.lo.push(lo); this.hi.push(hi); this.name.push(name); this.pref.push(pref); this.watch.push([]); return i;
  }
  bool(name, pref = 'up') { return this.int(0, 1, name, pref); }
  /** sum(coef * var) (<=|>=|=) rhs ; terms: [[coef, var], ...] with integer coefs */
  lin(terms, op, rhs, tag = '') {
    const merged = new Map();
    for (const [c, v] of terms) { if (!Number.isInteger(c)) throw new Error(`non-integer coefficient in ${tag}`); if (c) merged.set(v, (merged.get(v) || 0) + c); }
    const t = [...merged].filter(([, c]) => c !== 0).map(([v, c]) => [c, v]);
    let added = 0;
    if (op === '<=' || op === '=') { this.add(t, rhs, tag); added++; }
    if (op === '>=' || op === '=') { this.add(t.map(([c, v]) => [-c, v]), -rhs, tag); added++; }
    return added;
  }
  add(terms, rhs, tag) {
    const merged = new Map();
    for (const [c, v] of terms) if (c) merged.set(v, (merged.get(v) || 0) + c);
    const t = [...merged].filter(([, c]) => c !== 0).map(([v, c]) => [c, v]); // zero coefficients would divide by zero
    const k = this.cons.length; this.cons.push({ a: t.map((x) => x[0]), v: t.map((x) => x[1]), b: rhs, tag });
    for (const [, v] of t) this.watch[v].push(k);
    return k;
  }
  pop(count) { for (let i = 0; i < count; i++) { const c = this.cons.pop(); for (const v of c.v) this.watch[v].pop(); } }
}

/**
 * Bounds consistency to a fixpoint. Tightening a variable only moves the bound that the constraint's minimum activity
 * does not use, so one pass per dequeued constraint is exact; constraints watching a changed variable are re-queued.
 * trail receives [var, oldLo, oldHi] triples for undo. Returns false on a domain wipe-out.
 */
export function propagate(m, lo, hi, queue, inq, trail) {
  const fail = () => { for (const k of queue) inq[k] = 0; queue.length = 0; return false; }; // keep inq in sync with the queue
  while (queue.length) {
    const k = queue.pop(); inq[k] = 0;
    const { a, v, b } = m.cons[k];
    if (b === Infinity) continue;
    let minSum = 0;
    for (let i = 0; i < a.length; i++) minSum += a[i] > 0 ? a[i] * lo[v[i]] : a[i] * hi[v[i]];
    if (minSum > b) return fail();
    for (let i = 0; i < a.length; i++) {
      const x = v[i], ai = a[i];
      const slack = b - minSum + (ai > 0 ? ai * lo[x] : ai * hi[x]);
      if (ai > 0) {
        const nh = Math.floor(slack / ai);
        if (nh < hi[x]) { if (nh < lo[x]) return fail(); trail.push(x, lo[x], hi[x]); hi[x] = nh; for (const kk of m.watch[x]) if (!inq[kk]) { inq[kk] = 1; queue.push(kk); } }
      } else {
        const nl = Math.ceil(slack / ai);
        if (nl > lo[x]) { if (nl > hi[x]) return fail(); trail.push(x, lo[x], hi[x]); lo[x] = nl; for (const kk of m.watch[x]) if (!inq[kk]) { inq[kk] = 1; queue.push(kk); } }
      }
    }
  }
  return true;
}

/**
 * Minimize sum(coef*var) (or find any solution when objective is null) under the model's current bounds.
 * Branching: the first unfixed variable in `order` (then model order), values in the variable's preferred direction.
 * @returns {{status:'optimal'|'infeasible'|'limit', value:number|null, sol:number[]|null, nodes:number}}
 */
export function solve(m, objective, { nodeLimit = 2e6, order = null, fix = null } = {}) {
  const n = m.lo.length;
  const lo = m.lo.slice(), hi = m.hi.slice();
  if (fix) for (const [v, l, h] of fix) { lo[v] = Math.max(lo[v], l); hi[v] = Math.min(hi[v], h); if (lo[v] > hi[v]) return { status: 'infeasible', value: null, sol: null, nodes: 0 }; }
  const objK = objective ? m.add(objective, Infinity, 'objective') : -1;
  const done = (r) => { if (objective) m.pop(1); return r; };
  const nc = m.cons.length, inq = new Uint8Array(nc), queue = [];
  for (let k = nc - 1; k >= 0; k--) { queue.push(k); inq[k] = 1; }
  const trail = [];
  if (!propagate(m, lo, hi, queue, inq, trail)) return done({ status: 'infeasible', value: null, sol: null, nodes: 0 });
  const ord = order || (m.order.length ? m.order : [...Array(n).keys()]);
  let best = null, bestVal = Infinity, nodes = 0, hitLimit = false;
  const undo = (mark) => { while (trail.length > mark) { const h = trail.pop(), l = trail.pop(), x = trail.pop(); lo[x] = l; hi[x] = h; } };
  function dfs() {
    if (++nodes > nodeLimit) { hitLimit = true; return; }
    let x = -1;
    for (const i of ord) if (lo[i] < hi[i]) { x = i; break; }
    if (x === -1) for (let i = 0; i < n; i++) if (lo[i] < hi[i]) { x = i; break; }
    if (x === -1) {
      const val = objective ? objective.reduce((acc, [c, v]) => acc + c * lo[v], 0) : 0;
      if (val < bestVal) { bestVal = val; best = lo.slice(); if (objective) m.cons[objK].b = val - 1; }
      return;
    }
    const L = lo[x], H = hi[x];
    for (let s = 0; s <= H - L; s++) {
      if (!objective && best) return;
      const d = m.pref[x] === 'up' ? H - s : L + s;
      if (d < lo[x] || d > hi[x]) continue;
      const mark = trail.length;
      trail.push(x, lo[x], hi[x]); lo[x] = d; hi[x] = d;
      for (const kk of m.watch[x]) if (!inq[kk]) { inq[kk] = 1; queue.push(kk); }
      if (objective && !inq[objK]) { inq[objK] = 1; queue.push(objK); }
      if (propagate(m, lo, hi, queue, inq, trail)) dfs();
      undo(mark);
      if (hitLimit) return;
    }
  }
  dfs();
  if (!best) return done({ status: hitLimit ? 'limit' : 'infeasible', value: null, sol: null, nodes });
  return done({ status: hitLimit ? 'limit' : 'optimal', value: objective ? bestVal : 0, sol: best, nodes });
}

/**
 * Lexicographic (preemptive) goal programming: solve tier 1, freeze its optimum as a constraint, solve tier 2, ...
 * Integer objectives make the freeze exact (no degradation tolerance needed, unlike floating-point solvers).
 */
export function solveLex(m, tiers, opts = {}) {
  const report = []; let last = null, added = 0;
  for (const t of tiers) {
    const r = solve(m, t.terms, opts);
    report.push({ tier: t.name, status: r.status, value: r.value, nodes: r.nodes });
    if (!r.sol) { m.pop(added); return { status: r.status, report, sol: last }; }
    last = r.sol;
    added += m.lin(t.terms, '<=', r.value, `freeze:${t.name}`);
  }
  m.pop(added);
  return { status: report.every((r) => r.status === 'optimal') ? 'optimal' : 'limit', report, sol: last };
}
