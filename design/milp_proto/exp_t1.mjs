// Experiment: the keep vector (T1a) two ways on the cells where one weighted solve hit its budget:
//  (W) one solve of the weighted objective, depth-first, "trained" tried first;  (S) the keep order as a sequence of pure
//  feasibility questions ("everything kept so far + this group; the rest free, tried off first"), each with its own budget.
import fs from 'node:fs';
import { buildInstance } from '../research/proto_endpoint.mjs';
import { buildModel, tiers } from './planner.mjs';
import { solveMip } from './kern.mjs';
import { adapt } from './grid.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const LIMIT = +(process.env.LIMIT || 3000);
export function sequentialKeep(I, opt = {}) {
  const B = buildModel(I, { noEven: true, ...opt }), { m, V } = B;
  for (const g of I.groups) m.pref[V.y[g.id]] = 'down';
  const fix = [], kept = [], log = []; let witness = null, unknown = 0;
  for (const g of I.groups) {
    if (m.hi[V.y[g.id]] === 0) continue;
    const r = solveMip(m, null, { fix: [...fix, [V.y[g.id], 1, 1]], nodeLimit: opt.nodeLimit || LIMIT });
    log.push({ g: g.id, st: r.status, n: r.nodes });
    if (r.sol) { fix.push([V.y[g.id], 1, 1]); kept.push(g.id); witness = r.sol; } else if (r.status === 'infeasible') fix.push([V.y[g.id], 0, 0]); else { unknown++; fix.push([V.y[g.id], 0, 0]); }
  }
  return { kept, log, unknown, witness, B };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const cells = (process.argv[2] || 'athletic:3:75:L3,fat_loss_bootcamp:6:45:L3,hybrid_crossfit:5:45:L1,fat_loss_bootcamp:6:45:L2,fat_loss_bootcamp:6:60:L3').split(',');
  for (const cell of cells) {
    const [family, days, minutes, level] = cell.split(':');
    const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
    const I = adapt(buildInstance({ family, days: +days, minutes: +minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 }));
    let t0 = cpu();
    const B = buildModel(I, { noEven: true }); const T = tiers(I, B, {})[0];
    const w = solveMip(B.m, T.terms, { nodeLimit: LIMIT });
    const keptW = w.sol ? I.groups.filter((g) => w.sol[B.V.y[g.id]] === 1).map((g) => g.id) : null;
    console.log(`${cell.padEnd(28)} W: ${w.status} ${w.nodes} nodes kept ${keptW ? keptW.join(',') : '-'} ${(cpu() - t0).toFixed(0)} ms`);
    t0 = cpu();
    const s = sequentialKeep(I);
    console.log(`${''.padEnd(28)} S: kept ${s.kept.join(',')} | ${s.log.map((l) => `${l.g}:${l.st === 'optimal' ? 'fits' : l.st}/${l.n}`).join(' ')} ${(cpu() - t0).toFixed(0)} ms`);
  }
}
