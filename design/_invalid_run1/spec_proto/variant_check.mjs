// design/spec_proto/variant_check.mjs - independent check of the oracle WITH exercise-count variants ("a group-day runs its first
// K candidate exercises, K = 2..4") on small instances. Reference = the LP-based branch and bound of the research prototype
// (canon_endpoint.mjs, CANON=1 NOTWIN=1 NOSINGLE=1), asked once per explicit choice of K for every group-day: the reduced oracle
// must say "fits" exactly when some choice of K fits in the reference. The keep vector is then built the same way on both sides.
import fs from 'node:fs';
import { buildInstance, buildModel } from './canon_endpoint.mjs';
import { solveMip } from '../research/milp.mjs';
import { extend } from './examples.mjs';
import { prep, fit } from './reduced.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const KO = R.session.time_fit.keep_order;
const mul = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; };
const g = mul(2026), rnd = (n) => g() % n;

/** reference: does a plan exist with these group states, for SOME exercise count per group-day */
function refFit(I, states, groups) {
  const fams = [];
  I.days.forEach((d, di) => { for (const gname of groups) { const ss = d.slots.filter((s) => s.group === gname); if (gname !== 'calves' && ss.length >= 2) fams.push({ di, g: gname, m: Math.min(4, ss.length) }); } });
  const choice = fams.map(() => 2); let unknown = false, solves = 0;
  for (;;) {
    const J = { ...I, days: I.days.map((d, di) => ({ ...d, slots: d.slots.filter((s) => { const f = fams.findIndex((x) => x.di === di && x.g === s.group); if (f < 0) return true; return d.slots.filter((t) => t.group === s.group).indexOf(s) < choice[f]; }) })) };
    J.days.forEach((d) => { d.twin = null; });
    const { m, V, keep } = buildModel(J, { mode: 'select' });
    for (const x of keep) m.pref[V.z[x]] = 'down';
    for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
    const fix = []; keep.forEach((x) => { const st = states[groups.indexOf(x)]; if (st === 'on') fix.push([V.z[x], 1, 1]); else if (st === 'off') fix.push([V.z[x], 0, 0]); });
    const r = solveMip(m, null, { fix, nodeLimit: 20000 }); solves++;
    if (r.sol) return { status: 'feasible', solves };
    if (r.status === 'limit') unknown = true;
    let k = 0; while (k < fams.length && choice[k] === fams[k].m) { choice[k] = 2; k++; }
    if (k === fams.length) break; choice[k]++;
  }
  return { status: unknown ? 'unknown' : 'infeasible', solves };
}

let cases = 0, same = 0, diff = 0, refUnknown = 0, calls = 0, solves = 0, verdictDiff = 0; const seen = { days: {}, minutes: {}, level: {}, groups: {} };
const N = +(process.argv[2] || 40);
while (cases < N) {
  const family = ['aesthetics', 'athletic'][rnd(2)], days = 2 + rnd(2), minutes = [30, 45, 60, 75][rnd(4)], level = ['L1', 'L2'][rnd(2)];
  const all = ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves'], keepN = 2 + rnd(3);
  const keepG = []; while (keepG.length < keepN) { const x = all[rnd(all.length)]; if (!keepG.includes(x)) keepG.push(x); }
  let I; try { I = extend(buildInstance({ family, days, minutes, level, keepOrder: KO, exclude: all.filter((x) => !keepG.includes(x)) })); } catch (e) { continue; }
  if (I.present.length < 2) continue;
  const P = prep(I, { kChoice: true, noSingle: true, hall: true });           // research time arithmetic (pairs x 0.65), fit 1.10
  if (P.fam.length > 7) continue;
  cases++; seen.days[days] = (seen.days[days] || 0) + 1; seen.minutes[minutes] = (seen.minutes[minutes] || 0) + 1; seen.level[level] = (seen.level[level] || 0) + 1; seen.groups[P.G] = (seen.groups[P.G] || 0) + 1;
  const st = P.groups.map(() => 'free'), stR = st.slice(); const kept = [], keptR = []; let bad = false;
  for (let h = 0; h < P.G; h++) {
    st[h] = 'on'; stR[h] = 'on';
    const a = fit(P, st, 200000), b = refFit(I, stR, P.groups); calls++; solves += b.solves;
    if (b.status === 'unknown') { refUnknown++; bad = true; }
    else if (a.status !== b.status) verdictDiff++;
    if (a.status === 'feasible') kept.push(P.groups[h]); else st[h] = 'off';
    if (b.status === 'feasible') keptR.push(P.groups[h]); else stR[h] = 'off';
  }
  if (bad) continue;
  if (kept.join() === keptR.join()) same++; else { diff++; console.log('DIFF', family, days, minutes, level, P.groups.join(','), '| reduced', kept.join(','), '| reference', keptR.join(',')); }
}
if (Object.keys(seen.days).length < 2 || Object.keys(seen.minutes).length < 4 || Object.keys(seen.groups).length < 2) throw new Error('the random test did not draw the distribution it claims');
console.log(`small instances with exercise-count variants: ${cases}; oracle questions ${calls} (reference LP solves ${solves}); verdicts that differ ${verdictDiff}; keep vectors: same ${same}, different ${diff}, skipped (reference unknown) ${refUnknown}`);
console.log(`drawn: days ${JSON.stringify(seen.days)}, minutes ${JSON.stringify(seen.minutes)}, level ${JSON.stringify(seen.level)}, groups present ${JSON.stringify(seen.groups)}`);
