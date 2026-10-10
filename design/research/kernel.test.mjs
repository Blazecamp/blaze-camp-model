// brute-force cross-check of the research kernel on random small integer programs (deterministic LCG seeds)
import { Model, solve, solveLex } from './kernel.mjs';
let seed = 12345; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
let checked = 0, mismatches = 0;
for (let trial = 0; trial < 400; trial++) {
  const n = 2 + rnd(4), m = new Model(); const xs = [];
  for (let i = 0; i < n; i++) xs.push(m.int(rnd(2), 2 + rnd(4), 'x' + i, rnd(2) ? 'up' : 'down'));
  const cons = [];
  for (let c = 0; c < 1 + rnd(4); c++) { const t = xs.map((v) => [rnd(7) - 3, v]); const op = ['<=', '>=', '='][rnd(3)]; const rhs = rnd(12) - 3; m.lin(t, op, rhs); cons.push([t, op, rhs]); }
  const obj1 = xs.map((v) => [rnd(9) - 4, v]), obj2 = xs.map((v) => [rnd(9) - 4, v]);
  // brute force lexicographic optimum
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
  const r = solveLex(m, [{ name: 'o1', terms: obj1 }, { name: 'o2', terms: obj2 }]);
  checked++;
  const got = r.sol ? [r.report[0].value, r.report[1].value] : null;
  if (JSON.stringify(got) !== JSON.stringify(best)) { mismatches++; if (mismatches < 5) console.log('MISMATCH', trial, got, best, JSON.stringify(r.report)); }
}
console.log(`kernel vs brute force: ${checked} random lexicographic IPs, ${mismatches} mismatches`);

// same brute-force cross-check for the LP-based branch-and-bound (milp.mjs)
const { solveLexMip } = await import('./milp.mjs');
seed = 999; checked = 0; mismatches = 0;
for (let trial = 0; trial < 1500; trial++) {
  const n = 2 + rnd(5), m = new Model(); const xs = [];
  for (let i = 0; i < n; i++) xs.push(m.int(rnd(2), 2 + rnd(4), 'x' + i, rnd(2) ? 'up' : 'down'));
  const cons = [];
  for (let c = 0; c < 1 + rnd(5); c++) { const t = xs.map((v) => [rnd(9) - 4, v]); const op = ['<=', '>=', '='][rnd(3)]; const rhs = rnd(14) - 3; m.lin(t, op, rhs); cons.push([t, op, rhs]); }
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
  const r = solveLexMip(m, [{ name: 'o1', terms: obj1 }, { name: 'o2', terms: obj2 }]);
  checked++;
  const got = r.sol ? [r.report[0].value, r.report[1].value] : null;
  if (JSON.stringify(got) !== JSON.stringify(best)) { mismatches++; if (mismatches < 5) console.log('MILP MISMATCH', trial, got, best, JSON.stringify(r.report)); }
}
console.log(`milp (LP-based B&B) vs brute force: ${checked} random lexicographic IPs, ${mismatches} mismatches`);
