// Experiment for design_milp.md section 5: do local Chvatal-Gomory cuts + a start solution tame the dosing tails that the
// earlier audit measured on the research model (aesthetics 4x45 L2: 28,427 nodes to prove; 3x60 L2: 4,093; 3x60 L3: 7,959)?
// Same instances and the same integer model as design/research/proto_endpoint.mjs (buildInstance / buildModel), new kernel.
import fs from 'node:fs';
import { buildInstance, buildModel, selectGroups } from '../research/proto_endpoint.mjs';
import { solveLex } from './kern.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const cells = (process.argv[2] || 'aesthetics:4:45:L2,aesthetics:3:60:L2,aesthetics:3:60:L3,aesthetics:4:60:L2,aesthetics:4:60:L3,aesthetics:2:90:L2,athletic:4:75:L3,fat_loss_bootcamp:6:60:L3,aesthetics:4:60:L1').split(',');
const LIMIT = +(process.env.LIMIT || 30000);
for (const cell of cells) {
  const [family, days, minutes, level] = cell.split(':');
  const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  const I = buildInstance({ family, days: +days, minutes: +minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 });
  const sel = selectGroups(I, { nodeLimit: 2e5 });
  for (const cuts of [false, true]) {
    const B = buildModel(I, { mode: 'dose' }); const { m, V, keep, short, dev, Mx } = B;
    const fixB = (v, val) => { m.lo[v] = val; m.hi[v] = val; };
    for (const g of keep) fixB(V.z[g], sel.kept.includes(g) ? 1 : 0);
    for (const [k, v] of Object.entries(V.t)) fixB(v, sel.days[k] ? 1 : 0);
    I.days.forEach((d, di) => { let any = 0; d.pairs.forEach((p) => { const on = sel.days[`${p.a.group}|${di}`] && sel.days[`${p.b.group}|${di}`] ? 1 : 0; fixB(V.pa[`${di}|${p.tag}`], on); any |= on; }); fixB(V.u[di], any); });
    const tiers = [{ name: 'T1 worst shortfall', terms: [[1, Mx]] }, { name: 'T2 total shortfall', terms: keep.map((g) => [1, short[g]]) }, { name: 'T3 week-1 distance', terms: keep.map((g) => [1, dev[g]]) }];
    const t0 = cpu();
    const r = solveLex(m, tiers, { nodeLimit: LIMIT, cuts });
    console.log(`${cell.padEnd(26)} cuts=${cuts ? 'on ' : 'off'} kept ${sel.kept.length}/${keep.length} vars ${m.lo.length} tiers ${r.report.map((x) => `${x.value}${x.status === 'optimal' ? '' : '?'}`).join('/')} nodes ${r.report.map((x) => x.nodes).join('/')} cpu ${(cpu() - t0).toFixed(0)} ms`);
  }
}
