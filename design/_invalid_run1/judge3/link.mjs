// Judge 3 (engineering): two questions on the prototype models, over the template grid.
//  (A) TWO-STAGE LINK: if stage 1 checks time against a WEEKLY capacity (sum of the days) instead of per-day capacities,
//      how often does it keep a group that the exact per-day oracle proves cannot be packed?  (-> stage 2 would have to repair)
//  (B) TEMPLATE-PARAMETRIC: with the template skeleton fixed (every template group trained on every template day), how often
//      is there NO set vector that holds floors + 2-set climb + the minutes?  (-> the 'explicit add / remove rules' fire)
const RESEARCH = new URL('../research/', import.meta.url).href;
const { buildInstance, buildModel, selectGroups } = await import(RESEARCH + 'proto_endpoint.mjs');
const { solveMip } = await import(RESEARCH + 'milp.mjs');
const fs = await import('node:fs');
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const OUT = new URL('./link.jsonl', import.meta.url); fs.writeFileSync(OUT, '');

function selectWith(I, mutate) {
  const { m, V, keep } = buildModel(I, { mode: 'select' });
  if (mutate) mutate(m);
  for (const g of keep) m.pref[V.z[g]] = 'down';
  for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
  const fix = [], kept = []; let nodes = 0, unknown = 0;
  for (const g of keep) {
    const r = solveMip(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: 2e4 }); nodes += r.nodes;
    if (r.status === 'limit') { unknown++; fix.push([V.z[g], 0, 0]); continue; }
    if (r.sol) { fix.push([V.z[g], 1, 1]); kept.push(g); } else fix.push([V.z[g], 0, 0]);
  }
  return { kept, nodes, unknown };
}
// merge the per-day time rows into one weekly row per endpoint week (the first row tagged 'time <wd>' is week 1, the second the peak)
function aggregateTime(m) {
  const seen = new Map(); const agg = [{ t: [], b: 0 }, { t: [], b: 0 }];
  m.cons.forEach((c) => { if (!c.tag.startsWith('time ')) return; const k = seen.get(c.tag) || 0; seen.set(c.tag, k + 1); c.a.forEach((a, i) => agg[k].t.push([a, c.v[i]])); agg[k].b += c.b; c.b = Infinity; });
  for (const g of agg) m.add(g.t, g.b, 'weekly time (aggregate)');
}
function fullTemplateFeasible(I) {
  const { m, V, keep } = buildModel(I, { mode: 'select' });
  const fix = [...keep.map((g) => [V.z[g], 1, 1]), ...Object.values(V.t).map((t) => [t, 1, 1])];
  const r = solveMip(m, null, { fix, nodeLimit: 2e4 });
  return { status: r.status === 'limit' ? 'unknown' : r.sol ? 'feasible' : 'infeasible', nodes: r.nodes };
}
const FAMS = (process.env.FAMS || 'aesthetics,athletic,strength').split(','), LEVELS = (process.env.LEVELS || 'L2').split(',');
for (const family of FAMS) for (const days of [2, 3, 4, 5, 6]) for (const minutes of [30, 45, 60, 75, 90, 105, 120]) for (const level of LEVELS) {
  const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  const row = { family, days, minutes, level };
  let I; try { I = buildInstance({ family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 }); } catch (e) { row.skip = e.message.slice(0, 50); fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); continue; }
  if (!I.present.length) { row.skip = 'no slots'; fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); continue; }
  row.present = I.present.length;
  let t = cpu(); const ex = selectWith(I, null); row.exact = ex.kept; row.exactNodes = ex.nodes; row.exactUnknown = ex.unknown; row.exactCpu = Math.round(cpu() - t);
  t = cpu(); const ag = selectWith(I, aggregateTime); row.agg = ag.kept; row.aggNodes = ag.nodes; row.aggUnknown = ag.unknown; row.aggCpu = Math.round(cpu() - t);
  row.overPromised = ag.kept.filter((g) => !ex.kept.includes(g)); row.lost = ex.kept.filter((g) => !ag.kept.includes(g));
  t = cpu(); const ft = fullTemplateFeasible(I); row.fullTemplate = ft.status; row.fullNodes = ft.nodes; row.fullCpu = Math.round(cpu() - t);
  fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
}
console.log('done');
