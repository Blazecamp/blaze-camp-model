// design/two-stage/proto/test_oracle.mjs - the oracle against brute force over the INDEPENDENT evaluator (core.checkEndpoints).
// Random small instances (sound generator, distribution asserted): every question's verdict must equal exhaustive enumeration,
// and every 'fits' witness must pass the evaluator.   node test_oracle.mjs [count] [seed]
import { rng, buildTables, growth10k, checkEndpoints, setsAt, directs } from './core.mjs';
import { ask } from './oracle.mjs';

const COUNT = Number(process.argv[2] || 400), SEED = Number(process.argv[3] || 20261010);
const R = rng(SEED);
const KINDS = [[45, 90], [90, 90], [36, 75], [72, 75], [45, 270]];
function randomInstance() {
  const NG = R.range(2, 3), ND = R.range(1, 2), N = R.pick([4, 6, 8, 12]);
  const groups = [];
  for (let g = 0; g < NG; g++) { const calves = g === NG - 1 && R.int(4) === 0; const F = calves ? 3 * ND : R.range(4, 7); groups.push({ id: 'g' + g, S: F + R.int(2), C: F + R.range(2, 5), F, mc: calves ? 1 : R.pick([1, 2]), calves, session4: R.pick([28, 36, 44]) }); }
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
  const I = { name: 'rnd', N, exBlocks: [[1, N]], G10k: growth10k(N), spill4: 4, maxPartners: 3, sessionHard4: 44, groups, days, gds, pairs: [], partners: [], fixedSets: 0 };
  // a pattern partner and pairs
  if (R.int(2) === 0 && gds.length) { const host = R.int(gds.length); const cred = new Array(NG).fill(0); const pg = R.int(NG); cred[pg] = 4; I.partners.push({ id: 'p0', d: gds[host].d, g: pg, host: R.int(2) ? [host, 0] : null, sets: 2, cls: 'P', cred, work: [45, 45], rest: [90, 90] }); }
  // superset pairs: an exercise is a side of at most one pair that can be active (the model's invariant; alternatives must exclude each other)
  const used = new Set(); const key = (gi, ci) => gi + ':' + ci;
  for (let t = 0; t < 2 && gds.length; t++) { const a = R.int(gds.length), b = R.int(gds.length); const cb = R.int(gds[b].cands.length); if (a !== b && gds[a].d === gds[b].d && gds[a].g !== gds[b].g && !used.has(key(a, 0)) && !used.has(key(b, cb))) { used.add(key(a, 0)); used.add(key(b, cb)); I.pairs.push({ d: gds[a].d, s1: { t: 'c', gd: a, ci: 0 }, s2: { t: 'c', gd: b, ci: cb } }); } }
  if (I.partners.length && I.partners[0].host && !used.has(key(I.partners[0].host[0], 0)) && gds[I.partners[0].host[0]].g !== I.partners[0].g) { used.add(key(I.partners[0].host[0], 0)); I.pairs.push({ d: I.partners[0].d, s1: { t: 'c', gd: I.partners[0].host[0], ci: 0 }, s2: { t: 'p', pi: 0 } }); }
  if (R.int(3) === 0 && gds.length) { const a = R.int(gds.length); if (!used.has(key(a, 0))) { used.add(key(a, 0)); I.pairs.push({ d: gds[a].d, s1: { t: 'c', gd: a, ci: 0 }, s2: { t: 'm', sets: 3, work: [45, 45], rest: [270, 270] } }); } }
  if (R.int(4) === 0) { I.fixedCredDay = days.map(() => new Array(NG).fill(0)); I.fixedCred = new Array(NG).fill(0); const g = R.int(NG), d = R.int(ND); I.fixedCredDay[d][g] = 8; I.fixedCred[g] = 8; }
  return buildTables(I);
}
function brute(I, q) {
  const NG = I.groups.length, NGD = I.gds.length, NP = I.partners.length;
  const must = new Set(q.must || []), not = new Set(q.not || []);
  const zOpts = I.groups.map((_, g) => (must.has(g) ? [true] : not.has(g) ? [false] : [false, true]));
  const st = I.gds.map((gd) => gd.states);
  const plan = { z: [], K: new Array(NGD).fill(0), n1: new Array(NGD).fill(0), nN: new Array(NGD).fill(0), y: new Array(NP).fill(false) };
  let found = null;
  const okQ = () => {
    const D1 = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.n1[gi])), true), DN = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.nN[gi])), true);
    for (const [g, v] of Object.entries(q.peakMin || {})) if (DN[g] < v) return false;
    for (const [g, v] of Object.entries(q.peakMax || {})) if (DN[g] > v) return false;
    for (const [g, v] of Object.entries(q.w1Min || {})) if (D1[g] < v) return false;
    for (const [g, v] of Object.entries(q.w1Max || {})) if (D1[g] > v) return false;
    return true;
  };
  const recY = (pi) => { if (found) return; if (pi === NP) { if (okQ() && !checkEndpoints(I, plan).length) found = JSON.parse(JSON.stringify(plan)); return; } for (const y of q.noPartners ? [false] : [false, true]) { plan.y[pi] = y; recY(pi + 1); } };
  const recG = (gi) => { if (found) return; if (gi === NGD) { recY(0); return; } for (const s of st[gi]) { if (s.K && !plan.z[I.gds[gi].g]) continue; plan.K[gi] = s.K; plan.n1[gi] = s.n1; plan.nN[gi] = s.nN; recG(gi + 1); } };
  const recZ = (g) => { if (found) return; if (g === NG) { recG(0); return; } for (const z of zOpts[g]) { plan.z[g] = z; recZ(g + 1); } };
  recZ(0);
  return found;
}
let fits = 0, no = 0, mism = 0, bad = 0, unknown = 0, nodes = 0, maxNodes = 0;
const dist = { groups: {}, days: {}, N: {}, withPairs: 0, withPartner: 0, withFixed: 0, strength: 0 };
for (let t = 0; t < COUNT; t++) {
  const I = randomInstance();
  dist.groups[I.groups.length] = (dist.groups[I.groups.length] || 0) + 1; dist.days[I.days.length] = (dist.days[I.days.length] || 0) + 1; dist.N[I.N] = (dist.N[I.N] || 0) + 1;
  if (I.pairs.length) dist.withPairs++; if (I.partners.length) dist.withPartner++; if (I.fixedCred) dist.withFixed++; if (I.gds.some((gd) => gd.cands.some((c) => c.rest[1] === 270))) dist.strength++;
  const NG = I.groups.length;
  for (let k = 0; k < 4; k++) {
    const must = [], not = [];
    for (let g = 0; g < NG; g++) { const r = R.int(4); if (r <= 1) must.push(g); else if (r === 2) not.push(g); }
    const q = { must, not };
    if (k === 1 && must.length) q.peakMin = { [must[0]]: I.groups[must[0]].F + R.range(0, 4) };
    if (k === 2 && must.length) { const v = I.groups[must[0]].F + R.range(-2, 2); q.w1Min = { [must[0]]: v }; q.w1Max = { [must[0]]: v }; }
    if (k === 3) q.noPartners = true;
    const r = ask(I, q, 200000);
    nodes += r.nodes; if (r.nodes > maxNodes) maxNodes = r.nodes;
    if (r.status === 'unknown') { unknown++; continue; }
    const b = brute(I, q);
    if (r.status === 'fits') { fits++; if (!b) mism++; if (checkEndpoints(I, r.plan).length) bad++; if (!must.every((g) => r.plan.z[g]) || not.some((g) => r.plan.z[g])) bad++; }
    else { no++; if (b) { mism++; if (mism <= 3) console.log('MISMATCH: oracle no, brute force found', JSON.stringify(q), JSON.stringify(b)); } }
  }
}
console.log(`instances ${COUNT}, questions ${COUNT * 4}: fits ${fits}, no ${no}, unknown ${unknown}; verdicts that differ from brute force ${mism}; witnesses the evaluator rejects ${bad}`);
console.log(`nodes: total ${nodes}, largest ${maxNodes}`);
console.log('drawn:', JSON.stringify(dist));
if (Object.keys(dist.groups).length < 2 || Object.keys(dist.days).length < 2 || Object.keys(dist.N).length < 3 || !dist.withPairs || !dist.withPartner || fits < COUNT / 2 || no < COUNT / 2) { console.log('DISTRIBUTION ASSERTION FAILED'); process.exit(1); }
if (mism || bad) process.exit(1);
