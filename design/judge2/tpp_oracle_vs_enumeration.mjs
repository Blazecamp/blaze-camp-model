// Judge 2: the template-parametric oracle EXISTS (exact-total queries) against an independent forward enumeration over the days
// (no pruning, no failure memo, no lower bounds): every reachable (totals, bases) state, then the same acceptance rules.
import { buildProblem, exists, evalDay, depthFor, athleticCounted } from '../sim_template-parametric/tpp.mjs';
import * as SAMPLES from '../sim_template-parametric/samples.mjs';
const runs = [
  ['pickleball', 45, {}, ['calves', 'hips']], ['pickleball', 45, {}, ['calves', 'hips', 'quads']], ['pickleball', 60, {}, ['calves', 'hips', 'quads']], ['pickleball', 60, {}, ['calves', 'hips', 'quads', 'back']],
  ['swimmer', 60, {}, ['back', 'hips']], ['swimmer', 60, {}, ['back', 'hips', 'quads']], ['swimmer', 60, {}, ['back', 'hips', 'chest']], ['swimmer', 75, {}, ['back', 'hips', 'quads']], ['swimmer', 60, { tests: {} }, ['back', 'hips', 'quads']],
  ['pickleball3', 45, {}, ['calves', 'hips', 'quads']],
];
let total = 0, mism = 0;
for (const [name, minutes, over, full] of runs) {
  const cfg = SAMPLES[name](minutes, over); const P = buildProblem(cfg); const N = cfg.N;
  const S = { state: Object.fromEntries(full.map((g) => [g, 'FULL'])), room: {}, pattern: [] };
  const allow = new Map(); for (const g of full) for (const c of P.cellsOf(g)) allow.set(c.key, g === 'calves' || c.lead ? c.values : [0].concat(c.values));
  const caps = {}; for (const d of P.dayIds) caps[d] = P.band;
  const Gq = Object.fromEntries(full.map((g) => [g, 0]));          // the same guaranteed credit on both sides
  // forward enumeration
  let states = new Map([[full.map(() => '0,0').join('|'), full.map(() => [0, 0])]]);
  for (const d of P.dayIds) {
    const cells = P.cellsByDay[d].filter((c) => full.includes(c.g));
    const exCap = cfg.athleteCap ? cfg.athleteCap - athleticCounted(P, d, S) : Infinity;
    const vecs = [];
    const rec = (i, cur) => { if (i === cells.length) { const pick = new Map(); let nex = 0; cells.forEach((c, k) => { if (cur[k] > 0) { const kk = depthFor(c, cur[k]); pick.set(c.key, { n: cur[k], k: kk }); nex += kk; } }); if (nex > exCap) return; const a = evalDay(P, S, d, (k) => pick.get(k), N, { regular: true }), b = evalDay(P, S, d, (k) => pick.get(k), N, {}); if (a.t <= caps[d] && b.t <= P.band) vecs.push(cur.slice()); return; } for (const v of allow.get(cells[i].key)) { cur.push(v); rec(i + 1, cur); cur.pop(); } };
    rec(0, []);
    const next = new Map();
    for (const st of states.values()) for (const v of vecs) {
      const ns = st.map((x) => x.slice());
      cells.forEach((c, k) => { const j = full.indexOf(c.g); ns[j][0] += v[k]; if (v[k] > 0) ns[j][1] += c.lo(depthFor(c, v[k])); });
      if (ns.some((x, j) => x[0] > cfg.groups[full[j]].C)) continue;
      const key = ns.map((x) => x.join(',')).join('|'); if (!next.has(key)) next.set(key, ns);
    }
    states = next;
  }
  const ok = new Set();
  for (const st of states.values()) { if (st.every((x, j) => { const t = cfg.groups[full[j]]; return x[0] > 0 && x[0] - x[1] >= t.mc && 4 * (x[0] - t.mc) + 0 >= 4 * t.F; })) ok.add(st.map((x) => x[0]).join(',')); }
  // every exact-total vector in the box [1 .. C]
  const ranges = full.map((g) => { const r = []; for (let v = Math.max(1, cfg.groups[g].F - 2); v <= cfg.groups[g].C; v++) r.push(v); return r; });
  let n = 0, bad = 0, fits = 0;
  const go = (i, tgt) => { if (i === full.length) { n++; const r = exists(P, S, full, { allow, target: { ...tgt }, caps, Gq }); const key = full.map((g) => tgt[g]).join(','); if (r) fits++; if (!!r !== ok.has(key)) { bad++; if (bad <= 3) console.log('   MISMATCH', key, 'oracle', !!r, 'enumeration', ok.has(key)); } return; } for (const v of ranges[i]) { tgt[full[i]] = v; go(i + 1, tgt); } };
  go(0, {});
  total += n; mism += bad;
  console.log(`${name} ${minutes} ${JSON.stringify(over)} FULL ${full.join('+')}: ${n} exact-total questions (${fits} fit), enumeration states ${states.size}, verdicts that differ ${bad}`);
}
console.log('questions', total, 'verdicts that differ from the independent enumeration', mism);
