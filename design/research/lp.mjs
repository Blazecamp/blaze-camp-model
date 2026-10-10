// Research prototype (design/algorithm_research.md, section 6.4): a dense bounded DUAL simplex for small LPs, used as the
// bound inside branch-and-bound (milp.mjs). Every structural variable is boxed (finite lo / hi), so the slack basis is
// dual feasible once each nonbasic variable sits at the bound its cost prefers: no phase 1 is needed, and the dual
// simplex runs straight to optimality or proves infeasibility.
// Numerics (lessons from the real planning model, whose rows mix coefficients 1 ... 6000): rows are equilibrated, pivots
// use a relative tolerance, the ratio test is a two-pass Harris test that prefers large pivots, and after a run of
// degenerate pivots the rule falls back to Bland's lowest-index rule (no cycling).
// Deterministic: fixed rules with lowest-index tie-breaks and plain IEEE-754 + - * / only.

const PTOL = 1e-9, DTOL = 1e-9, PIV = 1e-7;

/**
 * minimize c.x  s.t.  rows: sum(val*x[idx]) <= b ,  lo <= x <= hi (finite)
 * @returns {{status:'optimal'|'infeasible'|'iterlimit', x:Float64Array|null, obj:number, iters:number}}
 */
export function lpSolve(n, rowsIn, c, lo, hi, maxIter = 50000) {
  const rows = rowsIn.map(({ idx, val, b }) => { let s = 0; for (const v of val) s = Math.max(s, Math.abs(v)); s = s || 1; return { idx, val: val.map((v) => v / s), b: b / s }; });
  const m = rows.length, N = n + m;
  const T = new Float64Array(m * N);
  const L = new Float64Array(N), U = new Float64Array(N), d = new Float64Array(N), x = new Float64Array(N);
  const atUpper = new Uint8Array(N), basic = new Int32Array(m), isBasic = new Uint8Array(N);
  for (let j = 0; j < n; j++) { L[j] = lo[j]; U[j] = hi[j]; d[j] = c[j]; }
  for (let r = 0; r < m; r++) { const j = n + r; L[j] = 0; U[j] = Infinity; d[j] = 0; basic[r] = j; isBasic[j] = 1; }
  for (let j = 0; j < n; j++) { atUpper[j] = d[j] < 0 ? 1 : 0; x[j] = atUpper[j] ? U[j] : L[j]; }
  const xB = new Float64Array(m);
  for (let r = 0; r < m; r++) {
    const { idx, val, b } = rows[r]; let s = b;
    for (let k = 0; k < idx.length; k++) { T[r * N + idx[k]] += val[k]; s -= val[k] * x[idx[k]]; }
    T[r * N + n + r] = 1; xB[r] = s;
  }
  let iters = 0, degenerate = 0;
  for (; iters < maxIter; iters++) {
    const bland = degenerate > 50;
    let r = -1, worst = PTOL, below = false;
    for (let i = 0; i < m; i++) {
      const j = basic[i];
      const vl = L[j] - xB[i], vu = xB[i] - U[j];
      if (bland) { if (vl > PTOL || vu > PTOL) { if (r === -1 || j < basic[r]) { r = i; below = vl > PTOL; } } continue; }
      if (vl > worst) { worst = vl; r = i; below = true; } else if (vu > worst) { worst = vu; r = i; below = false; }
    }
    if (r === -1) break;
    const row = r * N;
    let rowMax = 0; for (let j = 0; j < N; j++) if (!isBasic[j]) rowMax = Math.max(rowMax, Math.abs(T[row + j]));
    const piv = PIV * Math.max(1, rowMax);
    const eligible = (j) => {
      if (isBasic[j] || U[j] - L[j] <= PTOL) return 0;
      const a = T[row + j]; if (a > -piv && a < piv) return 0;
      return (below ? (atUpper[j] ? a > 0 : a < 0) : (atUpper[j] ? a < 0 : a > 0)) ? a : 0;
    };
    // Harris pass 1: the relaxed bound; pass 2: the largest pivot under it (lowest index on ties; Bland: lowest index)
    let bound = Infinity;
    for (let j = 0; j < N; j++) { const a = eligible(j); if (a) bound = Math.min(bound, (Math.abs(d[j]) + DTOL) / Math.abs(a)); }
    if (bound === Infinity) return { status: 'infeasible', x: null, obj: Infinity, iters };
    let q = -1, qa = 0;
    for (let j = 0; j < N; j++) {
      const a = eligible(j); if (!a) continue;
      if (Math.abs(d[j]) / Math.abs(a) > bound) continue;
      if (bland) { q = j; qa = a; break; }
      if (Math.abs(a) > Math.abs(qa)) { q = j; qa = a; }
    }
    const leave = basic[r], target = below ? L[leave] : U[leave];
    const delta = (xB[r] - target) / qa;
    degenerate = Math.abs(delta) < 1e-12 ? degenerate + 1 : 0;
    for (let i = 0; i < m; i++) if (i !== r) xB[i] -= T[i * N + q] * delta;
    const enterVal = x[q] + delta;
    const inv = 1 / qa;
    for (let j = 0; j < N; j++) T[row + j] *= inv;
    for (let i = 0; i < m; i++) {
      if (i === r) continue; const f = T[i * N + q]; if (f === 0) continue;
      const ri = i * N; for (let j = 0; j < N; j++) T[ri + j] -= f * T[row + j];
      T[ri + q] = 0;
    }
    const dq = d[q];
    if (dq !== 0) for (let j = 0; j < N; j++) d[j] -= dq * T[row + j];
    d[q] = 0;
    // Harris may leave tiny wrong-signed reduced costs: clamp them (bounded shift, standard practice)
    for (let j = 0; j < N; j++) if (!isBasic[j] && j !== leave) { if (atUpper[j] ? d[j] > 0 : d[j] < 0) if (Math.abs(d[j]) <= DTOL) d[j] = 0; }
    isBasic[leave] = 0; atUpper[leave] = below ? 0 : 1; x[leave] = target;
    isBasic[q] = 1; basic[r] = q; xB[r] = enterVal; x[q] = enterVal;
  }
  if (iters >= maxIter) return { status: 'iterlimit', x: null, obj: NaN, iters };
  for (let i = 0; i < m; i++) x[basic[i]] = xB[i];
  let obj = 0; for (let j = 0; j < n; j++) obj += c[j] * x[j];
  return { status: 'optimal', x: x.subarray(0, n), obj, iters };
}
