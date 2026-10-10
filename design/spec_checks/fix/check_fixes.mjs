// design/spec_checks/fix/check_fixes.mjs - evidence for PLANNER_SPEC.md (must-fix items 1 and 2 of judge 2).
// Runs the two patched prototype modules beside this file (oracle.mjs: rows from the credit table; stage1.mjs: later groups free):
//   1. judge 2's two constructed counterexamples                        (expected: g0 kept; 'fits')
//   2. the oracle against brute force over the independent evaluator, with a WIDENED generator: an own exercise credits its group
//      with 0, 2 or 4 quarter sets (KB swing, dips, a full set), pattern stations hosted by another group's exercise that credit a
//      third group                                                       (expected: 0 verdicts differ)
//   3. the keep vector of stage 1 against the exhaustive lexicographic maximum on the same generator   (expected: 0 differ)
//   4. the three hard samples: same plans as the unpatched prototype, node counts side by side
//   node design/spec_checks/fix/check_fixes.mjs [instances] [seed]
import { rng, buildTables, growth10k, checkEndpoints, setsAt, directs } from '../../two-stage/proto/core.mjs';
import { ask as askFixed } from './oracle.mjs';
import { ask as askProto } from '../../two-stage/proto/oracle.mjs';
import { planEndpoints as planFixed } from './stage1.mjs';
import { planEndpoints as planProto } from '../../two-stage/proto/stage1.mjs';
import { placeBlock } from '../../two-stage/proto/stage2.mjs';
import * as S from '../../two-stage/proto/samples.mjs';

const COUNT = Number(process.argv[2] || 600), SEED = Number(process.argv[3] || 20261010);
// SESS (4th argument): one per-session limit (quarter sets) for every group. Stage 1 lifts the usual 11 sets a session to the hard 14
// before it gives a group up, so check 3 compares like with like only when the brute force uses one limit: pass 400 (no limit).
const SESS = Number(process.argv[4] || 0);

// ---- 1. the counterexamples
{
  const N = 6;
  const cand = (g, hi) => { const cred = [0, 0, 0]; cred[g] = 4; return { sid: 's', cls: 'X', lo: 2, hi, cred, work: [45, 45], rest: [90, 90] }; };
  const mkI = () => buildTables({
    name: 'T2 counterexample', N, exBlocks: [[1, N]], G10k: growth10k(N), spill4: 4, maxPartners: 3, sessionHard4: 44,
    groups: [{ id: 'g0', S: 5, C: 7, F: 5, mc: 1, session4: 400 }, { id: 'g1', S: 4, C: 6, F: 4, mc: 1, session4: 400 }, { id: 'g2', S: 4, C: 6, F: 4, mc: 1, session4: 400 }],
    days: [{ id: 'd0', main: true, limit: [3600, 3600], fixed: [0, 0], exBudget: null, cap12: null }],
    gds: [{ id: 'g0@d0', g: 0, d: 0, Ks: [2], cands: [cand(0, 3), cand(0, 2)], home: false }, { id: 'g1@d0', g: 1, d: 0, Ks: [2], cands: [cand(1, 3), cand(1, 3)], home: false }],
    pairs: [], fixedSets: 0, patternOrder: ['g2'],
    partners: [{ id: 'p0', d: 0, g: 2, host: [1, 0], sets: 2, cls: 'P', cred: [2, 0, 4], work: [45, 45], rest: [90, 90] }],
  });
  const a = planProto(mkI(), { budget: 200000 }), b = planFixed(mkI(), { budget: 200000 });
  console.log(`1a. hosted pattern station that credits a higher-priority group (judge 2, D1): prototype keeps ${JSON.stringify(a.kept)}; fixed stage 1 keeps ${JSON.stringify(b.kept)} (certificate violations: ${b.plan ? checkEndpoints(mkI(), b.plan).length : 'no plan'})`);
  const I2 = () => buildTables({
    name: 'half-credit exercise', N: 12, exBlocks: [[1, 12]], G10k: growth10k(12), spill4: 4, maxPartners: 3, sessionHard4: 56,
    groups: [{ id: 'chest', S: 3, C: 6, F: 3, mc: 2, session4: 400 }],
    days: [{ id: 'd0', main: true, limit: [7200, 7200], fixed: [0, 0], exBudget: null, cap12: null }],
    gds: [{ id: 'chest@d0', g: 0, d: 0, Ks: [2], home: false, cands: [{ sid: 'press', cls: 'HPUSH', lo: 2, hi: 4, cred: [4], work: [45, 45], rest: [90, 90] }, { sid: 'dips', cls: 'DIPS', lo: 2, hi: 4, cred: [2], work: [45, 45], rest: [90, 90] }] }],
    pairs: [], partners: [], fixedSets: 0,
  });
  console.log(`1b. an own exercise with half a set of own credit (dips; judge 2, D2): prototype oracle '${askProto(I2(), { must: [0] }).status}'; fixed oracle '${askFixed(I2(), { must: [0] }).status}'`);
}

// ---- 2 and 3. widened generator
const R = rng(SEED);
const KINDS = [[45, 90], [90, 90], [36, 75], [72, 75], [45, 270]];
const drawn = { own: { 0: 0, 2: 0, 4: 0 }, hosted: 0, hostedCrediting: 0, pairs: 0, fixed: 0, groups: {}, days: {} };
function randomInstance() {
  const NG = R.range(2, 3), ND = R.range(1, 2), N = R.pick([4, 6, 8, 12]);
  const groups = [];
  for (let g = 0; g < NG; g++) { const calves = g === NG - 1 && R.int(4) === 0; const F = calves ? 3 * ND : R.range(4, 7); groups.push({ id: 'g' + g, S: F + R.int(2), C: F + R.range(2, 5), F, mc: calves ? 1 : R.pick([1, 2]), calves, session4: SESS || R.pick([28, 36, 44, 400]) }); }
  const days = [];
  for (let d = 0; d < ND; d++) { const lim = R.range(16, 70) * 60; const fx = R.range(0, 6) * 60; days.push({ id: 'd' + d, main: true, limit: [lim, lim - R.int(2) * R.int(3) * 60], fixed: [fx + R.int(3) * 60, fx], exBudget: R.int(3) === 0 ? R.range(3, 6) : null, cap12: null }); }
  const gds = [];
  for (let g = 0; g < NG; g++) for (let d = 0; d < ND; d++) {
    if (!groups[g].calves && ND > 1 && R.int(4) === 0) continue;
    const nc = groups[g].calves ? 1 : R.range(2, 3), cands = [];
    for (let i = 0; i < nc; i++) {
      const k = R.pick(KINDS), cred = new Array(NG).fill(0);
      const own = groups[g].calves ? 4 : R.pick([4, 4, 4, 2, 2, 0]);                  // WIDENED: a full set, dips (half), KB swing (none)
      cred[g] = own; drawn.own[own]++;
      if (R.int(3) === 0) cred[(g + 1) % NG] = R.pick([1, 2]);
      cands.push({ sid: `s${g}${d}${i}`, cls: 'X', lo: groups[g].calves ? 3 : 2, hi: groups[g].calves ? 4 : R.range(2, 4), cred, work: [k[0], k[0]], rest: [k[1], R.int(4) === 0 ? 270 : k[1]] });
    }
    gds.push({ id: `g${g}@d${d}`, g, d, Ks: groups[g].calves ? [1] : nc === 3 ? R.pick([[2], [2, 3]]) : [2], cands, home: !groups[g].calves && R.int(5) === 0 });
  }
  const I = { name: 'rnd', N, exBlocks: [[1, N]], G10k: growth10k(N), spill4: 4, maxPartners: 3, sessionHard4: 44, groups, days, gds, pairs: [], partners: [], fixedSets: 0, patternOrder: groups.map((g) => g.id) };
  if (R.int(4) !== 0 && gds.length) {
    const host = R.int(gds.length); const cred = new Array(NG).fill(0); const pg = R.int(NG); cred[pg] = 4;
    const hosted = R.int(3) !== 0; if (hosted) drawn.hosted++;
    if (R.int(2) === 0) { cred[(pg + 1 + R.int(NG - 1)) % NG] = R.pick([1, 2, 2]); if (hosted) drawn.hostedCrediting++; }
    I.partners.push({ id: 'p0', d: gds[host].d, g: pg, host: hosted ? [host, 0] : null, sets: 2, cls: 'P', cred, work: [45, 45], rest: [90, 90] });
  }
  const used = new Set(); const key = (gi, ci) => gi + ':' + ci;
  for (let t = 0; t < 2 && gds.length; t++) { const a = R.int(gds.length), b = R.int(gds.length); const cb = R.int(gds[b].cands.length); if (a !== b && gds[a].d === gds[b].d && gds[a].g !== gds[b].g && !used.has(key(a, 0)) && !used.has(key(b, cb))) { used.add(key(a, 0)); used.add(key(b, cb)); I.pairs.push({ d: gds[a].d, s1: { t: 'c', gd: a, ci: 0 }, s2: { t: 'c', gd: b, ci: cb } }); } }
  if (I.partners.length && I.partners[0].host && !used.has(key(I.partners[0].host[0], 0)) && gds[I.partners[0].host[0]].g !== I.partners[0].g) { used.add(key(I.partners[0].host[0], 0)); I.pairs.push({ d: I.partners[0].d, s1: { t: 'c', gd: I.partners[0].host[0], ci: 0 }, s2: { t: 'p', pi: 0 } }); }
  if (R.int(3) === 0 && gds.length) { const a = R.int(gds.length); if (!used.has(key(a, 0))) { used.add(key(a, 0)); I.pairs.push({ d: gds[a].d, s1: { t: 'c', gd: a, ci: 0 }, s2: { t: 'm', sets: 3, work: [45, 45], rest: [270, 270] } }); } }
  if (R.int(4) === 0) { I.fixedCredDay = days.map(() => new Array(NG).fill(0)); I.fixedCred = new Array(NG).fill(0); const g = R.int(NG), d = R.int(ND); I.fixedCredDay[d][g] = 8; I.fixedCred[g] = 8; drawn.fixed++; }
  if (I.pairs.length) drawn.pairs++;
  drawn.groups[NG] = (drawn.groups[NG] || 0) + 1; drawn.days[ND] = (drawn.days[ND] || 0) + 1;
  return buildTables(I);
}
function enumerate(I, zOpts, q, cb) {
  const NG = I.groups.length, NGD = I.gds.length, NP = I.partners.length;
  const plan = { z: [], K: new Array(NGD).fill(0), n1: new Array(NGD).fill(0), nN: new Array(NGD).fill(0), y: new Array(NP).fill(false) };
  let stop = false;
  const okQ = () => {
    if (!q) return true;
    const D1 = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.n1[gi])), true), DN = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.nN[gi])), true);
    for (const [g, v] of Object.entries(q.peakMin || {})) if (DN[g] < v) return false;
    for (const [g, v] of Object.entries(q.w1Min || {})) if (D1[g] < v) return false;
    for (const [g, v] of Object.entries(q.w1Max || {})) if (D1[g] > v) return false;
    return true;
  };
  const recY = (pi) => { if (stop) return; if (pi === NP) { if (okQ() && !checkEndpoints(I, plan).length) stop = !!cb(plan); return; } for (const y of q && q.noPartners ? [false] : [false, true]) { plan.y[pi] = y; recY(pi + 1); } };
  const recG = (gi) => { if (stop) return; if (gi === NGD) { recY(0); return; } for (const s of I.gds[gi].states) { if (s.K && !plan.z[I.gds[gi].g]) continue; plan.K[gi] = s.K; plan.n1[gi] = s.n1; plan.nN[gi] = s.nN; recG(gi + 1); } };
  const recZ = (g) => { if (stop) return; if (g === NG) { recG(0); return; } for (const z of zOpts[g]) { plan.z[g] = z; recZ(g + 1); } };
  recZ(0);
  return stop;
}
const tally = { q: 0, fits: 0, no: 0, unknown: 0, diffFixed: 0, diffProto: 0, bad: 0, keepDiffFixed: 0, keepDiffProto: 0, keepChecked: 0, protoFalseNo: 0 };
for (let t = 0; t < COUNT; t++) {
  const I = randomInstance(), NG = I.groups.length;
  for (let k = 0; k < 4; k++) {
    const must = [], not = [];
    for (let g = 0; g < NG; g++) { const r = R.int(4); if (r <= 1) must.push(g); else if (r === 2) not.push(g); }
    const q = { must, not };
    if (k === 1 && must.length) q.peakMin = { [must[0]]: I.groups[must[0]].F + R.range(0, 4) };
    if (k === 2 && must.length) { const v = I.groups[must[0]].F + R.range(-2, 2); q.w1Min = { [must[0]]: v }; q.w1Max = { [must[0]]: v }; }
    if (k === 3) q.noPartners = true;
    const zOpts = I.groups.map((_, g) => (must.includes(g) ? [true] : not.includes(g) ? [false] : [false, true]));
    const truth = enumerate(I, zOpts, q, () => true);
    const rf = askFixed(I, q, 200000), rp = askProto(I, q, 200000);
    tally.q++;
    if (rf.status === 'unknown') { tally.unknown++; continue; }
    if (rf.status === 'fits') { tally.fits++; if (checkEndpoints(I, rf.plan).length) tally.bad++; } else tally.no++;
    if ((rf.status === 'fits') !== truth) tally.diffFixed++;
    if (rp.status !== 'unknown' && (rp.status === 'fits') !== truth) { tally.diffProto++; if (rp.status === 'no') tally.protoFalseNo++; }
  }
  // keep vector against the exhaustive lexicographic maximum (keep order = group index)
  let best = null;
  for (let m = (1 << NG) - 1; m >= 0 && !best; m--) {
    const z = []; for (let g = 0; g < NG; g++) z.push(!!(m & (1 << (NG - 1 - g))));
    if (z.some((on, g) => on && !I.gds.some((gd) => gd.g === g))) continue;
    if (enumerate(I, z.map((v) => [v]), null, () => true)) best = z;
  }
  const kf = planFixed(I, { budget: 200000 }), kp = planProto(I, { budget: 200000 });
  tally.keepChecked++;
  if (JSON.stringify(I.groups.map((_, g) => kf.kept.includes(g))) !== JSON.stringify(best)) tally.keepDiffFixed++;
  if (JSON.stringify(I.groups.map((_, g) => kp.kept.includes(g))) !== JSON.stringify(best)) tally.keepDiffProto++;
}
console.log(`2. oracle against brute force, widened generator (${COUNT} instances, ${tally.q} questions; drawn: own credit ${JSON.stringify(drawn.own)}, hosted pattern stations ${drawn.hosted} (${drawn.hostedCrediting} credit another group), instances with pairs ${drawn.pairs}, with fixed credit ${drawn.fixed}, groups ${JSON.stringify(drawn.groups)}, days ${JSON.stringify(drawn.days)})`);
console.log(`   fixed oracle: fits ${tally.fits}, no ${tally.no}, unknown ${tally.unknown}; verdicts that differ from brute force ${tally.diffFixed}; witnesses the evaluator rejects ${tally.bad}`);
console.log(`   unpatched prototype oracle on the same questions: verdicts that differ ${tally.diffProto} (false 'no': ${tally.protoFalseNo})`);
console.log(`3. keep vector against the exhaustive lexicographic maximum (${tally.keepChecked} instances, per-session limit ${SESS ? SESS / 4 + ' sets for every group' : 'drawn per group: differences here are the 11 -> 14 rule of stage 1, see the header'}): fixed stage 1 differs in ${tally.keepDiffFixed}; unpatched prototype differs in ${tally.keepDiffProto}`);

// ---- 4. the three samples
console.log('4. the three hard samples (keep-time branch, 100 % of the minutes):');
for (const [name, make] of [['08 pickleball 2 x 45', () => S.pickleball({ care: 'one' })], ['04 CrossFit class 4 x 60', () => S.crossfit({})], ['01 swimmer 3 x 60', () => S.swimmer({})]]) {
  const row = [];
  for (const [label, plan] of [['prototype', planProto], ['fixed', planFixed]]) {
    const I = make(), s1 = plan(I, {});
    const s2 = s1.plan ? placeBlock(I, s1, {}) : null;
    row.push(`${label}: ${s1.kept.map((g) => `${I.groups[g].id} ${s2.weeks[0].Qmain[g] / 4} -> ${s2.weeks[I.N - 1].Qmain[g] / 4}`).join(', ')}; pattern ${I.groups.filter((_, g) => s1.states[g] === 'PATTERN').map((g) => g.id).join(',') || '-'}; ${s1.audit.calls} questions, ${s1.audit.nodes} nodes (largest ${s1.audit.maxNodes}), unknown ${s1.audit.unknown}; violations ${s2.violations.length}`);
  }
  console.log(`   ${name}\n      ${row.join('\n      ')}`);
}
if (tally.diffFixed || tally.bad || (SESS && tally.keepDiffFixed)) process.exit(1);
