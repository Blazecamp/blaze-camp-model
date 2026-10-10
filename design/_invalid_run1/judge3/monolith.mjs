// Judge 3 (engineering): what does the WHOLE-BLOCK monolithic MILP (every week x every slot in one model) cost on the
// research prototype's pure-JS kernel?  Best case for the monolith: structure (groups, days, superset pairs) already fixed.
// Simplified on purpose (lower bound on the real model): no athletic co-planning, no optional days, one exercise block.
const RESEARCH = new URL('../research/', import.meta.url).href;
const { buildInstance, selectGroups, buildModel } = await import(RESEARCH + 'proto_endpoint.mjs');
const { Model } = await import(RESEARCH + 'kernel.mjs');
const { solveMip, solveLexMip } = await import(RESEARCH + 'milp.mjs');
const fs = await import('node:fs');
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const Q = 2000, fit = R.session.time_fit.fit_factor;

function monolith(I, sel, N) {
  // structure from the exact selection: which days train each kept group
  const B0 = buildModel(I, { mode: 'select' });   // only to compute d.pairs on the instance
  const m = new Model(); const X = [];             // X[w][slotId]
  const trained = (g, di) => sel.kept.includes(g) && sel.days[`${g}|${di}`] === 1;
  const active = I.days.map((d, di) => d.slots.filter((s) => trained(s.group, di)));
  for (let w = 0; w < N; w++) { X.push({}); active.forEach((ss) => ss.forEach((s) => { X[w][s.id] = m.int(s.min, s.max, `x${w + 1}.${s.id}`, w === N - 1 ? 'up' : 'down'); })); }
  const direct = (g, w) => active.flatMap((ss) => ss.filter((s) => s.prime === g).map((s) => [1, X[w][s.id]]));
  const credit = (g, w) => active.flatMap((ss) => ss.filter((s) => s.cr[g]).map((s) => [s.cr[g], X[w][s.id]]));
  const total = (w) => active.flatMap((ss) => ss.map((s) => [1, X[w][s.id]]));
  for (let w = 0; w < N; w++) I.days.forEach((d, di) => {
    const ss = active[di]; if (!ss.length) return;
    const byG = {}; ss.forEach((s) => (byG[s.group] = byG[s.group] || []).push(s));
    for (const [g, a] of Object.entries(byG)) {
      for (let i = 0; i + 1 < a.length; i++) { if (a[i].bucket === 'ISO_CALF' || a[i + 1].bucket === 'ISO_CALF') continue; m.lin([[1, X[w][a[i].id]], [-1, X[w][a[i + 1].id]]], '>=', 0, 'VOL-07'); m.lin([[1, X[w][a[i].id]], [-1, X[w][a[i + 1].id]]], '<=', 1, 'VOL-07'); }
      m.lin(ss.filter((s) => s.cr[g]).map((s) => [s.cr[g], X[w][s.id]]), '<=', (I.o.focus || []).includes(g) ? 56 : 44, 'session ceiling');
    }
    if (d.twin) { const ei = I.days.indexOf(d.twin); if (ei > di) d.slots.forEach((s, k) => { const s2 = d.twin.slots[k]; if (X[w][s.id] !== undefined && X[w][s2.id] !== undefined) { m.lin([[1, X[w][s.id]], [-1, X[w][s2.id]]], '<=', 1, 'twin'); m.lin([[1, X[w][s.id]], [-1, X[w][s2.id]]], '>=', -1, 'twin'); } }); }
    const pairs = (d.pairs || []).filter((p) => trained(p.a.group, di) && trained(p.b.group, di));
    const inPair = new Set(pairs.flatMap((p) => [p.a.id, p.b.id]));
    const ath = d.athMin * (1 + ((I.o.athleticPeak || 1) - 1) * w / Math.max(1, N - 1));
    const terms = ss.map((s) => [Math.round(Q * s.cost * (inPair.has(s.id) ? 0.65 : 1)), X[w][s.id]]);
    m.lin(terms, '<=', Math.floor(Q * (I.o.minutes * fit - d.fixed - ath)) - Q * (ss.length - pairs.length), `time ${d.wd} w${w + 1}`);
  });
  for (let w = 0; w + 1 < N; w++) active.forEach((ss) => ss.forEach((s) => m.lin([[1, X[w][s.id]], [-1, X[w + 1][s.id]]], '<=', 0, 'monotone')));
  const short = {}, dev = {}; const Mx = m.int(0, 40, 'max shortfall', 'down'); const flats = [];
  for (const g of sel.kept) {
    m.lin(credit(g, 0), '>=', 4 * I.floor(g), `floor ${g}`);
    m.lin([...direct(g, N - 1), ...direct(g, 0).map(([c, v]) => [-c, v])], '>=', g === 'calves' ? 1 : 2, `climb ${g}`);
    m.lin(direct(g, N - 1), '<=', I.C[g], `ceiling ${g}`);
    for (let w = 0; w + 1 < N; w++) m.lin([...direct(g, w + 1), ...direct(g, w).map(([c, v]) => [-c, v])], '<=', 1, `step ${g}`);   // max(1, 7 %) = 1 below 29 sets
    short[g] = m.int(0, 40, `short.${g}`, 'down'); m.lin([[1, short[g]], ...direct(g, N - 1)], '>=', I.C[g], `shortfall ${g}`); m.lin([[1, Mx], [-1, short[g]]], '>=', 0, 'max shortfall');
    dev[g] = m.int(0, 60, `dev.${g}`, 'down'); m.lin([[1, dev[g]], ...direct(g, 0).map(([c, v]) => [-c, v])], '>=', -I.S[g], `dev+ ${g}`); m.lin([[1, dev[g]], ...direct(g, 0)], '>=', I.S[g], `dev- ${g}`);
  }
  for (let w = 0; w + 1 < N; w++) {
    m.lin([...total(w + 1).map(([c, v]) => [10 * c, v]), ...total(w).map(([c, v]) => [-11 * c, v])], '<=', -1, 'total < +10 %');
    const f = m.bool(`flat.${w + 1}`, 'down'); flats.push(f);
    m.lin([...total(w + 1), ...total(w).map(([c, v]) => [-c, v]), [1, f]], '>=', 1, 'never flat (soft)');
  }
  m.order = [Mx, ...sel.kept.map((g) => short[g]), ...X[N - 1] ? Object.values(X[N - 1]) : [], ...Object.values(X[0]), ...flats];
  const tiers = [
    { name: 'T1 worst peak shortfall', terms: [[1, Mx]] },
    { name: 'T2 total peak shortfall', terms: sel.kept.map((g) => [1, short[g]]) },
    { name: 'T3 week 1 nearest the start', terms: sel.kept.map((g) => [1, dev[g]]) },
    { name: 'T4 flat weeks in the total', terms: flats.map((f) => [1, f]) },
  ];
  return { m, tiers, nSlots: active.reduce((a, ss) => a + ss.length, 0) };
}

const CASES = [
  ['E2 racket 2x45 L2', { family: 'athletic', days: 2, minutes: 45, level: 'L2', keepOrder: ['calves', ...R.session.time_fit.keep_order_r2.athletic.filter((g) => g !== 'calves')], noAthletic: ['AP_TRIPLE_EXT', 'AP_THROW'], athleticPeak: 1.0 }],
  ['E5 athlete 3x90 L2', { family: 'athletic', days: 3, minutes: 90, level: 'L2', keepOrder: R.session.time_fit.keep_order_r2.athletic, athleticPeak: 1.3 }],
  ['E1 aesthetics 4x60 L1', { family: 'aesthetics', days: 4, minutes: 60, level: 'L1', keepOrder: R.session.time_fit.keep_order }],
  ['E3 aesthetics 4x75 L2', { family: 'aesthetics', days: 4, minutes: 75, level: 'L2', keepOrder: R.session.time_fit.keep_order }],
];
const NS = (process.env.NS || '4,6,12').split(',').map(Number), LIMIT = +(process.env.LIMIT || 40);
// sanity: is the monolith model feasible at all? Plug in the plan of the solver-free sequential construction (ladder_probe.mjs)
const { ladderSeq } = await import(new URL('./ladder_probe.mjs', import.meta.url));
function witnessOk(I, sel, N, m) {
  const r = ladderSeq(I, sel, N); if (!r.ok || r.weeksErr || r.weeks.length !== N) return 'no witness (' + (r.why || r.weeksErr) + ')';
  const val = new Array(m.lo.length).fill(0); const direct = (g, w) => I.days.reduce((a, d) => a + d.slots.filter((s) => s.prime === g).reduce((b, s) => b + (r.weeks[w][s.id] || 0), 0), 0);
  const tot = r.weeks.map((wk) => Object.values(wk).reduce((a, b) => a + b, 0)); let mx = 0;
  m.name.forEach((nm, i) => {
    let k;
    if ((k = /^x(\d+)\.(.+)$/.exec(nm))) val[i] = r.weeks[+k[1] - 1][k[2]];
    else if ((k = /^short\.(.+)$/.exec(nm))) { val[i] = I.C[k[1]] - direct(k[1], N - 1); mx = Math.max(mx, val[i]); }
    else if ((k = /^dev\.(.+)$/.exec(nm))) val[i] = Math.abs(direct(k[1], 0) - I.S[k[1]]);
    else if ((k = /^flat\.(\d+)$/.exec(nm))) val[i] = tot[+k[1]] === tot[+k[1] - 1] ? 1 : 0;
  });
  val[m.name.indexOf('max shortfall')] = mx;
  const bad = m.cons.filter(({ a, v, b }) => b !== Infinity && a.reduce((acc, c, i) => acc + c * val[v[i]], 0) > b).map((c) => c.tag);
  const bounds = val.some((x, i) => x < m.lo[i] || x > m.hi[i]);
  return bad.length || bounds ? `witness breaks ${bad.length} rows (${[...new Set(bad)].slice(0, 4).join(', ')})${bounds ? ' + bounds' : ''}` : `feasible (witness from the sequential construction: worst shortfall ${mx}, flat weeks ${tot.filter((t, i) => i && t === tot[i - 1]).length})`;
}
for (const [name, o] of CASES) {
  const I = buildInstance(o); const sel = selectGroups(I);
  for (const N of NS) {
    const { m, tiers, nSlots } = monolith(I, sel, N);
    const n = m.lo.length, rows = m.cons.length;
    const wit = witnessOk(I, sel, N, m);
    const tabMB = (rows * (n + rows) * 8 / 1e6).toFixed(0);
    let t0 = cpu(); const root = solveMip(m, tiers[0].terms, { nodeLimit: 1 }); const rootCpu = cpu() - t0;
    t0 = cpu(); const r = solveLexMip(m, tiers, { nodeLimit: LIMIT }); const c = cpu() - t0;
    console.log(`${name}  N=${N}: ${nSlots} active slots, ${n} vars, ${rows} rows (dense tableau <= ${tabMB} MB/node) | root LP: ${root.lpIters} pivots, ${rootCpu.toFixed(0)} ms CPU | ${LIMIT} nodes/tier: ${r.report.map((x) => `${x.tier.split(' ')[0]}=${x.value}${x.status === 'optimal' ? '' : '?'}(${x.nodes}n,${x.lpIters}piv)`).join(' ')}  ${c.toFixed(0)} ms CPU, status ${r.status} | model: ${wit}`);
  }
}
