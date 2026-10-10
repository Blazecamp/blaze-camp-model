// Judge 2 (mathematical rigor) - audit of the research chain (design/research/proto_endpoint.mjs) on its own cases.
//  A. The rules are stated on CREDITED group sets (helpers 0.25); the stairway flow moves DIRECT sets only. Are the
//     credited-set rules (step <= max(1, 7 %) + 0.5 helper slack; credited <= ceiling + 1) kept on the prototype's weeks?
//  B. The chosen minutes: every "0 time violations" in the research is measured against minutes x 1.10 with supersets
//     on. How many day-weeks are over the CHOSEN minutes?
//  C. DR-4 monotonicity with an EXACT oracle: sweep the allowed session lengths. Does more time ever untrain a group?
//     (Set inclusion is not implied by a lexicographic keep order; only the lexicographic order of the keep vector is.)
// Run: node design/judge2/endpoint_audit.mjs
import { CASES, buildInstance, selectGroups, dose, fillWeeks, dayMinutes } from '../research/proto_endpoint.mjs';

const N = 12;
console.log('A / B. credited-set rules and chosen minutes on the research cases (12 weeks)');
for (const c of CASES) {
  const I = buildInstance(c.o);
  const sel = selectGroups(I);
  const { r, B } = dose(I, sel);
  if (!r.sol) { console.log(`  ${c.name.slice(0, 3)}: no solution`); continue; }
  const { weeks } = fillWeeks(I, B, r.sol, N);
  const { V } = B, sol = r.sol;
  const groups = I.present.filter((g) => sol[V.z[g]] === 1);
  const credit = (g, sets) => I.days.reduce((a, d) => a + d.slots.reduce((b, s) => b + (s.cr[g] ? s.cr[g] * (sets[s.id] || 0) : 0), 0), 0) / 4;
  const direct = (g, sets) => I.days.reduce((a, d) => a + d.slots.filter((s) => s.prime === g).reduce((b, s) => b + (sets[s.id] || 0), 0), 0);
  let stepOver = 0, capOver = 0, over30 = 0, worstStep = 0; const notes = [];
  for (const g of groups) {
    for (let w = 1; w < N; w++) {
      const a = credit(g, weeks[w - 1]), b = credit(g, weeks[w]);
      const lim = Math.max(1, 0.07 * a) + 0.5;
      if (b - a > lim + 1e-9) { stepOver++; worstStep = Math.max(worstStep, b - a); if (notes.length < 2) notes.push(`${g} week ${w + 1}: credited ${a} -> ${b} (limit +${lim.toFixed(2)})`); }
    }
    const peak = credit(g, weeks[N - 1]);
    if (peak > I.C[g] + 1 + 1e-9) { capOver++; notes.push(`${g}: credited peak ${peak} vs ceiling ${I.C[g]} + 1 (direct ${direct(g, weeks[N - 1])})`); }
    if (peak > 30 + 1e-9) over30++;
  }
  // minutes against the CHOSEN minutes (not x 1.10), supersets on wherever the pair is on
  let over = 0, dayWeeks = 0, worst = 0;
  I.days.forEach((d, di) => weeks.forEach((wk, wi) => { const t = dayMinutes(I, B, sol, wk, di, wi + 1, N, true); dayWeeks++; if (t > c.o.minutes + 1e-9) { over++; worst = Math.max(worst, t - c.o.minutes); } }));
  console.log(`  ${c.name.slice(0, 3)}: credited steps over max(1, 7 %) + 0.5: ${stepOver}${stepOver ? ` (worst +${worstStep})` : ''}; groups with credited peak over ceiling + 1: ${capOver}; over 30: ${over30}; day-weeks over the CHOSEN ${c.o.minutes} min with every pair supersetted: ${over}/${dayWeeks} (worst +${worst.toFixed(1)} min)`);
  for (const n of notes.slice(0, 4)) console.log('       ' + n);
}

console.log('\nC. keep vector over the allowed session lengths (exact oracle; "kept" = trained directly)');
const MIN = [30, 45, 60, 75, 90, 105, 120];
for (const c of CASES) {
  let prev = null, prevM = 0; const row = []; let setViol = 0, lexViol = 0;
  for (const mnt of MIN) {
    let kept;
    try { kept = selectGroups(buildInstance({ ...c.o, minutes: mnt })).kept; } catch (e) { row.push(`${mnt}: ? (${e.message.slice(0, 40)})`); prev = null; continue; }
    const order = c.o.keepOrder;
    const vec = order.map((g) => (kept.includes(g) ? 1 : 0)).join('');
    if (prev) {
      const lost = prev.kept.filter((g) => !kept.includes(g));
      if (lost.length) { setViol++; row.push(`${mnt}: ${vec} LOST ${lost.join('+')} (had at ${prevM})`); } else row.push(`${mnt}: ${vec}`);
      if (vec < prev.vec) lexViol++;
    } else row.push(`${mnt}: ${vec}`);
    prev = { kept, vec }; prevM = mnt;
  }
  console.log(`  ${c.name.slice(0, 3)} keep order ${c.o.keepOrder.filter((g, i, a) => a.indexOf(g) === i).join(',')}`);
  console.log(`      ${row.join(' | ')}`);
  console.log(`      more minutes untrains a group (set inclusion broken): ${setViol}; keep vector lexicographically worse with more minutes: ${lexViol}`);
}
