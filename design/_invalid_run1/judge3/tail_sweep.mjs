// Judge 3 (engineering): heavy-tail sweep of the research prototype's layered chain, CPU time + deterministic node counts.
// node design/judge3/tail_sweep.mjs  (env DOSE_LIMIT nodes per tier, default 2000; SEL_LIMIT nodes per oracle call, default 20000)
const RESEARCH = new URL('../research/', import.meta.url).href;
const { buildInstance, selectGroups, dose, fillWeeks } = await import(RESEARCH + 'proto_endpoint.mjs');
const fs = await import('node:fs');
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const SEL_LIMIT = +(process.env.SEL_LIMIT || 2e4), DOSE_LIMIT = +(process.env.DOSE_LIMIT || 2000);
const OUT = new URL(`./tail_sweep.${DOSE_LIMIT}.jsonl`, import.meta.url);
fs.writeFileSync(OUT, '');
const FAMS = (process.env.FAMS || Object.keys(TPL.families).join(',')).split(',');
for (const family of FAMS) for (const days of [2, 3, 4, 5, 6]) for (const minutes of [30, 45, 60, 75, 90, 105, 120]) for (const level of ['L1', 'L2', 'L3']) {
  const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  const o = { family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 };
  const row = { family, days, minutes, level };
  const emit = () => fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
  let I;
  try { I = buildInstance(o); } catch (e) { row.skip = 'build: ' + e.message.slice(0, 60); emit(); continue; }
  row.slots = I.days.reduce((a, d) => a + d.slots.length, 0); row.present = I.present.length;
  if (!row.slots || !I.present.length) { row.skip = 'no resistance slots'; emit(); continue; }
  let sel, t0 = cpu();
  try { sel = selectGroups(I, { nodeLimit: SEL_LIMIT }); row.selCpu = cpu() - t0; row.selNodes = sel.log.reduce((a, l) => a + l.nodes, 0); row.selMaxNodes = Math.max(...sel.log.map((l) => l.nodes)); row.selLp = sel.log.reduce((a, l) => a + l.lpIters, 0); row.kept = sel.kept.length; row.dropped = sel.dropped.length; }
  catch (e) { row.selCpu = cpu() - t0; row.selStatus = 'UNKNOWN(budget)'; emit(); continue; }
  if (!sel.kept.length) { row.note = 'no group fits'; emit(); continue; }
  t0 = cpu();
  try {
    const { r, B } = dose(I, sel, { nodeLimit: DOSE_LIMIT });
    row.doseCpu = cpu() - t0; row.vars = B.m.lo.length; row.cons = B.m.cons.length;
    row.doseStatus = r.status; row.doseNodes = r.report.reduce((a, x) => a + x.nodes, 0); row.doseLp = r.report.reduce((a, x) => a + x.lpIters, 0);
    row.tiers = r.report.map((x) => `${x.value}${x.status === 'optimal' ? '' : '?'}`).join('/');
    row.hasSol = !!r.sol;
    if (r.sol) { const t1 = cpu(); try { fillWeeks(I, B, r.sol, 12); row.weeksCpu = cpu() - t1; } catch (e) { row.weeksErr = e.message.slice(0, 50); } }
  } catch (e) { row.doseCpu = cpu() - t0; row.doseStatus = 'throw: ' + e.message.slice(0, 60); }
  emit();
}
console.log('done');
