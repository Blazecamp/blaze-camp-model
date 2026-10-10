// Judge 2 probe of design_template-parametric.md lemma L3: the keep search tests ONE point (the minimum point). Is a group ever
// refused at the minimum point although some larger exact totals fit (same model, same oracle, exact-total queries)?
import { buildProblem, plan, exists } from '../sim_template-parametric/tpp.mjs';
import * as SAMPLES from '../sim_template-parametric/samples.mjs';
const cases = [];
for (const name of ['pickleball', 'crossfit', 'swimmer', 'pickleball3']) for (const m of [45, 60, 75, 90]) cases.push([name, m, {}]);
for (const m of [60, 75, 90]) { cases.push(['swimmer', m, { tests: {} }]); cases.push(['crossfit', m, { perSession: 14 }]); }
let checked = 0, viol = 0;
for (const [name, minutes, over] of cases) {
  const cfg = SAMPLES[name](minutes, over);
  let P, R;
  try { P = buildProblem(cfg); R = plan(P); } catch (e) { console.log(name, minutes, JSON.stringify(over), 'no plan:', e.message.slice(0, 60)); continue; }
  const keep = cfg.keep;
  // every group that is not FULL and has cells, in keep order: only the FIRST one is a clean lexicographic test
  const firstNon = keep.find((g) => R.S.state[g] !== 'FULL' && P.cellsOf(g).length > 0);
  if (!firstNon) { console.log(name, minutes, JSON.stringify(over), 'every group with cells is FULL'); continue; }
  const idx = keep.indexOf(firstNon);
  const state = {}; keep.forEach((g, i) => { state[g] = i < idx ? R.S.state[g] : i === idx ? 'FULL' : 'NONE'; });
  const S2 = { state, room: {}, pattern: R.S.pattern.filter((p) => keep.indexOf(p.g) < idx) };
  const full = keep.filter((g) => state[g] === 'FULL');
  const allow = new Map(); for (const g of full) for (const c of P.cellsOf(g)) allow.set(c.key, g === 'calves' || c.lead ? c.values : [0].concat(c.values));
  const caps = {}; for (const d of P.dayIds) caps[d] = P.band;
  const atMin = exists(P, S2, full, { allow, target: null, caps });
  // every exact-total vector in a window around the floors
  const ranges = full.map((g) => { const t = cfg.groups[g]; const lo = Math.max(1, t.F - 3), hi = Math.min(t.C, t.F + 6); const r = []; for (let v = lo; v <= hi; v++) r.push(v); return r; });
  let found = null, calls = 0;
  const rec = (i, tgt) => { if (found) return; if (i === full.length) { calls++; const r = exists(P, S2, full, { allow, target: { ...tgt }, caps }); if (r) found = { ...tgt }; return; } for (const v of ranges[i]) { tgt[full[i]] = v; rec(i + 1, tgt); if (found) return; } };
  if (!atMin) rec(0, {});
  checked++;
  const bad = !atMin && found;
  if (bad) viol++;
  console.log(name, minutes, JSON.stringify(over), '| first group not FULL:', firstNon, '| FULL set tested:', full.join('+'), '| minimum point:', atMin ? 'fits (!)' : 'null', '| exact totals that fit:', found ? JSON.stringify(found) : 'none in ' + calls + ' vectors', bad ? '  <== L3 VIOLATION (group refused although a plan exists)' : '');
}
console.log('cases', checked, 'violations', viol);
