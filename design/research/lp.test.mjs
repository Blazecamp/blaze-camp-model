// checks lp.mjs: feasibility of every optimum, LP bound <= brute-force integer optimum, exact 2-variable optima by vertex
// enumeration, and infeasibility agreement. Deterministic LCG.
import { lpSolve } from './lp.mjs';
let seed = 777; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
let n2 = 0, bad = 0, nInt = 0, inf = 0;
for (let trial = 0; trial < 3000; trial++) {
  const n = trial % 3 === 0 ? 2 : 2 + rnd(4);
  const lo = [], hi = []; for (let j = 0; j < n; j++) { lo.push(rnd(3) - 1); hi.push(lo[j] + 1 + rnd(4)); }
  const rows = []; for (let k = 0; k < 1 + rnd(5); k++) { const idx = [], val = []; for (let j = 0; j < n; j++) { const a = rnd(9) - 4; if (a) { idx.push(j); val.push(a); } } rows.push({ idx, val, b: rnd(14) - 4 }); }
  const c = []; for (let j = 0; j < n; j++) c.push(rnd(11) - 5);
  const r = lpSolve(n, rows, c, lo, hi);
  // integer brute force
  let ipBest = Infinity;
  const rec = (j, v) => { if (j === n) { for (const { idx, val, b } of rows) { let s = 0; for (let k = 0; k < idx.length; k++) s += val[k] * v[idx[k]]; if (s > b) return; } ipBest = Math.min(ipBest, c.reduce((a, cc, jj) => a + cc * v[jj], 0)); return; } for (let t = lo[j]; t <= hi[j]; t++) { v[j] = t; rec(j + 1, v); } };
  rec(0, []);
  if (r.status === 'optimal') {
    for (let j = 0; j < n; j++) if (r.x[j] < lo[j] - 1e-7 || r.x[j] > hi[j] + 1e-7) { bad++; console.log('bound viol', trial); }
    for (const { idx, val, b } of rows) { let s = 0; for (let k = 0; k < idx.length; k++) s += val[k] * r.x[idx[k]]; if (s > b + 1e-7) { bad++; console.log('row viol', trial); } }
    if (ipBest < Infinity) { nInt++; if (r.obj > ipBest + 1e-7) { bad++; console.log('LP above IP', trial, r.obj, ipBest); } }
    if (n === 2) { // vertex enumeration: all intersections of 2 lines among rows and bounds
      const lines = rows.map(({ idx, val, b }) => { const a = [0, 0]; idx.forEach((j, k) => (a[j] += val[k])); return [a[0], a[1], b]; });
      lines.push([1, 0, lo[0]], [1, 0, hi[0]], [0, 1, lo[1]], [0, 1, hi[1]]);
      let vbest = Infinity;
      for (let i = 0; i < lines.length; i++) for (let k = i + 1; k < lines.length; k++) {
        const [a1, b1, c1] = lines[i], [a2, b2, c2] = lines[k]; const det = a1 * b2 - a2 * b1; if (Math.abs(det) < 1e-12) continue;
        const px = (c1 * b2 - c2 * b1) / det, py = (a1 * c2 - a2 * c1) / det;
        if (px < lo[0] - 1e-9 || px > hi[0] + 1e-9 || py < lo[1] - 1e-9 || py > hi[1] + 1e-9) continue;
        if (rows.some(({ idx, val, b }) => { let s = 0; idx.forEach((j, kk) => (s += val[kk] * (j ? py : px))); return s > b + 1e-9; })) continue;
        vbest = Math.min(vbest, c[0] * px + c[1] * py);
      }
      n2++; if (Math.abs(vbest - r.obj) > 1e-6) { bad++; console.log('2D mismatch', trial, vbest, r.obj); }
    }
  } else if (r.status === 'infeasible') { inf++; if (ipBest < Infinity) { bad++; console.log('LP says infeasible but integer point exists', trial); } }
  else { bad++; console.log('status', r.status); }
}
console.log(`lp.mjs: 3000 random boxed LPs; ${n2} 2-variable exact checks, ${nInt} LP<=IP checks, ${inf} infeasible; problems: ${bad}`);
