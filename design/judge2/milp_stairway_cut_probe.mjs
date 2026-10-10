// Judge 2: design_milp.md 3.3 adds the cut "total added sets <= D - 1" when the stairway finds no schedule for an endpoint.
// Is "no schedule" a property of D (and the week-1 total) alone? Search for two climb vectors with the same D and the same
// week-1 total where one has a schedule and the other has none, using the prototype's own stairway().
import { stairway } from '../milp_proto/planner.mjs';
let found = 0, tried = 0;
for (const N of [4, 6, 8]) for (let tot1 = 8; tot1 <= 44 && found < 6; tot1 += 2) {
  const byD = new Map();
  const rec = (u, minNext) => {
    if (u.length >= 2) {
      const D = u.reduce((a, b) => a + b, 0);
      const lines = u.map((x, i) => ({ id: 'g' + i, S: 6, P: 6 + x }));          // S only shapes the soft costs; the hard rules read tot1
      const ok = !!stairway(lines, N, tot1); tried++;
      if (!byD.has(D)) byD.set(D, { yes: null, no: null });
      const e = byD.get(D); if (ok && !e.yes) e.yes = u.slice(); if (!ok && !e.no) e.no = u.slice();
    }
    if (u.length === 4) return;
    for (let x = minNext; x <= N - 1; x++) { u.push(x); rec(u, x); u.pop(); }
  };
  rec([], 1);
  for (const [D, e] of byD) if (e.yes && e.no && found < 6) { found++; console.log(`N ${N}, week-1 total ${tot1}, D ${D}: climbs ${JSON.stringify(e.no)} have NO schedule; climbs ${JSON.stringify(e.yes)} (same D) have one`); }
}
console.log(`climb vectors tried ${tried}; pairs with the same D and week-1 total but different verdicts: ${found}${found >= 6 ? '+' : ''}`);
