// Judge 3 (engineering): is a node-budgeted (anytime) endpoint dosing good enough? Tier values at several budgets vs the proven optimum.
const RESEARCH = new URL('../research/', import.meta.url).href;
const { buildInstance, selectGroups, dose } = await import(RESEARCH + 'proto_endpoint.mjs');
const fs = await import('node:fs');
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const CASES = [['aesthetics', 4, 45, 'L2'], ['aesthetics', 3, 60, 'L2'], ['aesthetics', 3, 60, 'L3'], ['aesthetics', 2, 90, 'L2'], ['aesthetics', 3, 45, 'L2'], ['aesthetics', 4, 60, 'L1']];
const BUDGETS = (process.env.BUDGETS || '100,300,1000,3000').split(',').map(Number);
for (const [family, days, minutes, level] of CASES) {
  const I = buildInstance({ family, days, minutes, level, keepOrder: R.session.time_fit.keep_order });
  const t0 = cpu(); const sel = selectGroups(I); const selCpu = cpu() - t0;
  console.log(`${family} ${days}x${minutes} ${level}: select kept ${sel.kept.length} dropped ${sel.dropped.length}, ${sel.log.reduce((a, l) => a + l.nodes, 0)} nodes, ${selCpu.toFixed(0)} ms CPU`);
  for (const b of BUDGETS) {
    const t1 = cpu(); const { r } = dose(I, sel, { nodeLimit: b }); const c = cpu() - t1;
    console.log(`   budget ${String(b).padStart(6)} nodes/tier: tiers ${r.report.map((x) => `${x.value}${x.status === 'optimal' ? '' : '?'}`).join(' / ')}  nodes ${r.report.map((x) => x.nodes).join('/')}  ${c.toFixed(0)} ms CPU  sol=${!!r.sol}`);
  }
}
