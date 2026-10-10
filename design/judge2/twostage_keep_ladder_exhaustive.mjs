// Judge 2 check: two-stage stage 1 (keep vector T2 incl. reduction (ii); ladder T3) against exhaustive enumeration.
import { rng, buildTables, growth10k, checkEndpoints, setsAt, directs } from '../two-stage/proto/core.mjs';
import { planEndpoints } from '../two-stage/proto/stage1.mjs';
const COUNT = Number(process.argv[2] || 300), SEED = Number(process.argv[3] || 11), HOSTCRED = process.argv[4] !== '0';
const R = rng(SEED);
const KINDS = [[45, 90], [90, 90], [36, 75], [72, 75], [45, 270]];
function randomInstance() {
  const NG = R.range(2, 3), ND = R.range(1, 2), N = R.pick([4, 6, 8, 12]);
  const groups = [];
  for (let g = 0; g < NG; g++) { const calves = g === NG - 1 && R.int(4) === 0; const F = calves ? 3 * ND : R.range(4, 7); groups.push({ id: 'g' + g, S: F + R.int(2), C: F + R.range(2, 5), F, mc: calves ? 1 : R.pick([1, 2]), calves, session4: 400 }); }
  const days = [];
  for (let d = 0; d < ND; d++) { const lim = R.range(16, 70) * 60; const fx = R.range(0, 6) * 60; days.push({ id: 'd' + d, main: true, limit: [lim, lim - R.int(2) * R.int(3) * 60], fixed: [fx + R.int(3) * 60, fx], exBudget: R.int(3) === 0 ? R.range(3, 6) : null, cap12: null }); }
  const gds = [];
  for (let g = 0; g < NG; g++) for (let d = 0; d < ND; d++) {
    if (!groups[g].calves && ND > 1 && R.int(4) === 0) continue;
    const nc = groups[g].calves ? 1 : R.range(2, 3), cands = [];
    for (let i = 0; i < nc; i++) {
      const k = R.pick(KINDS), cred = new Array(NG).fill(0); cred[g] = 4; if (R.int(3) === 0) cred[(g + 1) % NG] = R.pick([1, 2]);
      cands.push({ sid: `s${g}${d}${i}`, cls: 'X', lo: groups[g].calves ? 3 : 2, hi: groups[g].calves ? 4 : R.range(2, 4), cred, work: [k[0], k[0]], rest: [k[1], R.int(4) === 0 ? 270 : k[1]] });
    }
    gds.push({ id: `g${g}@d${d}`, g, d, Ks: groups[g].calves ? [1] : nc === 3 ? R.pick([[2], [2, 3]]) : [2], cands, home: !groups[g].calves && R.int(5) === 0 });
  }
  const I = { name: 'rnd', N, exBlocks: [[1, N]], G10k: growth10k(N), spill4: 4, maxPartners: 3, sessionHard4: 44, groups, days, gds, pairs: [], partners: [], fixedSets: 0, patternOrder: groups.map((g) => g.id) };
  if (R.int(4) !== 0 && gds.length) { const host = R.int(gds.length); const cred = new Array(NG).fill(0); const pg = R.int(NG); cred[pg] = 4; if (HOSTCRED) cred[(pg + 1 + R.int(NG - 1)) % NG] = R.pick([1, 2, 2]); I.partners.push({ id: 'p0', d: gds[host].d, g: pg, host: R.int(3) ? [host, 0] : null, sets: 2, cls: 'P', cred, work: [45, 45], rest: [90, 90] }); }
  return buildTables(I);
}
// all legal plans for a fixed z vector (and optional partner pins): callback per plan
function enumerate(I, z, yFix, cb) {
  const NGD = I.gds.length, NP = I.partners.length;
  const plan = { z: z.slice(), K: new Array(NGD).fill(0), n1: new Array(NGD).fill(0), nN: new Array(NGD).fill(0), y: new Array(NP).fill(false) };
  let stop = false;
  const recY = (pi) => { if (stop) return; if (pi === NP) { if (!checkEndpoints(I, plan).length) { if (cb(plan)) stop = true; } return; } for (const y of (yFix ? [yFix[pi]] : [false, true])) { plan.y[pi] = y; recY(pi + 1); } };
  const recG = (gi) => { if (stop) return; if (gi === NGD) { recY(0); return; } for (const s of I.gds[gi].states) { if (s.K && !plan.z[I.gds[gi].g]) continue; plan.K[gi] = s.K; plan.n1[gi] = s.n1; plan.nN[gi] = s.nN; recG(gi + 1); } };
  recG(0);
}
const exists = (I, z) => { let f = false; enumerate(I, z, null, () => (f = true)); return f; };
let keepDiff = 0, ladderDiff = 0, plans = 0, none = 0, unknown = 0, ladderChecked = 0, hostCases = 0;
for (let t = 0; t < COUNT; t++) {
  const I = randomInstance();
  const NG = I.groups.length;
  if (I.partners.length && I.partners[0].host) hostCases++;
  const s1 = planEndpoints(I, { budget: 200000 });
  if (s1.audit.unknown) { unknown++; continue; }
  // brute-force lexicographic maximum of z in keep order (= group index order)
  let best = null;
  for (let m = (1 << NG) - 1; m >= 0 && !best; m--) {
    // lex-descending in keep order: bit for group 0 is the most significant
    const z = []; for (let g = 0; g < NG; g++) z.push(!!(m & (1 << (NG - 1 - g))));
    if (z.some((on, g) => on && !I.gds.some((gd) => gd.g === g))) continue;
    if (exists(I, z)) best = z;
  }
  const mine = I.groups.map((_, g) => s1.kept.includes(g));
  if (JSON.stringify(mine) !== JSON.stringify(best)) { keepDiff++; if (keepDiff <= 5) console.log('KEEP DIFF: stage1', JSON.stringify(mine), 'brute', JSON.stringify(best), 'partner', JSON.stringify(I.partners.map((p) => ({ g: p.g, host: p.host, cred: p.cred }))), 'reasons', JSON.stringify(s1.reasons)); continue; }
  if (!s1.kept.length) { none++; continue; }
  plans++;
  // ladder: exhaustive set of legal peak vectors for this keep vector and these partner pins
  const kept = s1.kept, yFix = s1.plan.y.slice();
  const helperQ = s1.helperQ;
  const num = (g, x) => 4 * x + helperQ[g] - 4 * I.groups[g].S, den = (g) => Math.max(4, 4 * I.groups[g].C - 4 * I.groups[g].S);
  const keyCmp = (a, xa, b, xb) => { const l = num(a, xa) * den(b), r = num(b, xb) * den(a); return l !== r ? (l < r ? -1 : 1) : (a - b); };
  const top = (g) => { const c4 = Math.min(4 * I.groups[g].C, Math.floor((4 * I.groups[g].S * I.G10k) / 10000)); return Math.floor((c4 - helperQ[g]) / 4); };
  const seen = new Map();
  enumerate(I, mine, yFix, (plan) => { const DN = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.nN[gi])), true); const key = kept.map((g) => DN[g]).join(','); if (!seen.has(key)) seen.set(key, kept.map((g) => DN[g])); return false; });
  // the ladder never raises a group above top(g) (it freezes on 'ceiling'): compare inside the down-closure capped at max(top, start)
  // better(x, y): at the differing group with the smallest min key, x is higher
  const better = (x, y) => { let m = -1, mk = null; for (let i = 0; i < kept.length; i++) { if (x[i] === y[i]) continue; const g = kept[i]; const lo = Math.min(x[i], y[i]); if (m < 0 || keyCmp(g, lo, kept[m], mk) < 0) { m = i; mk = lo; } } return m >= 0 && x[m] > y[m]; };
  const mineV = kept.map((g) => s1.peaks[g]);
  // cap every legal vector at the ladder's ceiling (down-closure): a vector above top counts as top
  const capV = (x) => x.map((v, i) => Math.min(v, Math.max(top(kept[i]), 0)));
  let worse = null, aboveTop = false;
  for (const x of seen.values()) {
    const inside = x.every((v, i) => v <= Math.max(top(kept[i]), mineV[i]));
    if (inside) { if (better(x, mineV)) { worse = x; break; } }
    else if (better(capV(x), mineV)) aboveTop = true;
  }
  if (aboveTop) globalThis.__above = (globalThis.__above || 0) + 1;
  ladderChecked++;
  if (worse) { ladderDiff++; if (ladderDiff <= 5) console.log('LADDER DIFF: ladder', JSON.stringify(mineV), 'a legal plan has', JSON.stringify(worse), 'tops', JSON.stringify(kept.map(top)), 'stopped', JSON.stringify(s1.stopped), 'notes', JSON.stringify(s1.notes)); }
  if (!seen.has(mineV.join(','))) { console.log('LADDER VECTOR NOT LEGAL?', JSON.stringify(mineV)); ladderDiff++; }
}
console.log('plans where a legal plan beats the ladder only by passing the ladder ceiling (level start x G(N)):', globalThis.__above || 0);
console.log(`instances ${COUNT} (host partner in ${hostCases}); unknown ${unknown}; keep vector differs from exhaustive lexicographic maximum: ${keepDiff}; plans with a kept group ${plans}; ladder checked ${ladderChecked}, ladder not the tie-broken leximin optimum: ${ladderDiff}; no group ${none}`);
