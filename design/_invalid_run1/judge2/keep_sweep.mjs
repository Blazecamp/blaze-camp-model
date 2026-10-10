// Judge 2 - does an EXACT lexicographic keep order ever untrain a group when minutes grow? 5-minute grid, research cases
// plus variants (other keep orders / levels). Set inclusion is not a theorem; the lexicographic order of the vector is
// (when the feasible set grows with the minutes).
import { CASES, buildInstance, selectGroups } from '../research/proto_endpoint.mjs';
const variants = [];
for (const c of CASES) variants.push({ name: c.name.slice(0, 3), o: c.o });
const base = CASES[4].o, r2 = CASES[1].o;
variants.push({ name: 'E5/L1', o: { ...base, level: 'L1' } }, { name: 'E5/L3', o: { ...base, level: 'L3' } }, { name: 'E5/2d', o: { ...base, days: 2 } }, { name: 'E5/4d', o: { ...base, days: 4 } },
  { name: 'E2/ath', o: { ...r2, noAthletic: [] } }, { name: 'E2/3d', o: { ...r2, days: 3 } }, { name: 'E2/L1', o: { ...r2, level: 'L1' } },
  { name: 'E1/3d', o: { ...CASES[0].o, days: 3 } }, { name: 'E1/5d', o: { ...CASES[0].o, days: 5 } }, { name: 'E1/2d', o: { ...CASES[0].o, days: 2 } });
let breaks = 0, lexBreaks = 0, steps = 0;
for (const v of variants) {
  let prev = null; const out = [];
  for (let mnt = 30; mnt <= 120; mnt += 5) {
    let kept; try { kept = selectGroups(buildInstance({ ...v.o, minutes: mnt })).kept; } catch (e) { out.push(`${mnt}:?`); prev = null; continue; }
    const vec = v.o.keepOrder.map((g) => (kept.includes(g) ? 1 : 0)).join('');
    if (prev) { steps++; const lost = prev.kept.filter((g) => !kept.includes(g)); if (lost.length) { breaks++; out.push(`${mnt}:${vec} <-- LOST ${lost.join('+')}`); } else if (vec !== prev.vec) out.push(`${mnt}:${vec}`); if (vec < prev.vec) lexBreaks++; }
    else out.push(`${mnt}:${vec}`);
    prev = { kept, vec };
  }
  console.log(`${v.name.padEnd(7)} [${v.o.keepOrder.join(',')}]  ${out.join('  ')}`);
}
console.log(`\n${steps} five-minute steps: more minutes untrains a group in ${breaks}; keep vector lexicographically worse in ${lexBreaks}`);
