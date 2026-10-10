// design/spec_proto/grid.mjs - the reduced exact oracle on the whole template grid (family x 2-6 days x 30-120 min x L1-L3),
// optionally against the LP-based reference oracle (canon_endpoint.mjs with CANON=1 NOTWIN=1, same feasible set).
// env: REF=1 run the reference too (slow) ; HALL=1 day-subset cuts ; BUDGET nodes per oracle call ; OUT file name ; NOSINGLE=1
import fs from 'node:fs';
import { buildInstance, selectGroups } from './canon_endpoint.mjs';
import { prep, select } from './reduced.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const REF = process.env.REF === '1', HALL = process.env.HALL === '1', BUDGET = +(process.env.BUDGET || 200000);
const OUT = new URL('./' + (process.env.OUT || 'grid.jsonl'), import.meta.url);
fs.writeFileSync(OUT, '');
const FAMS = (process.env.FAMS || Object.keys(TPL.families).join(',')).split(',');
for (const family of FAMS) for (const days of [2, 3, 4, 5, 6]) for (const minutes of [30, 45, 60, 75, 90, 105, 120]) for (const level of ['L1', 'L2', 'L3']) {
  const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  const o = { family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 };
  const row = { family, days, minutes, level };
  const emit = () => fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
  let I; try { I = buildInstance(o); } catch (e) { row.skip = 'build'; emit(); continue; }
  if (!I.present.length) { row.skip = 'no slots'; emit(); continue; }
  const P = prep(I, { hall: HALL, noSingle: process.env.NOSINGLE === '1', pairMode: process.env.PAIR || 'factor', ...(process.env.FIT ? { fit: +process.env.FIT } : {}) });
  row.gd = P.GD.length; row.groups = P.G;
  let t = cpu(); let s; try { s = select(P, BUDGET); } catch (e) { row.err = e.message.slice(0, 80); emit(); continue; }
  row.ms = +(cpu() - t).toFixed(2); row.kept = s.kept; row.nodes = s.nodes; row.maxNodes = s.maxNodes; row.unknown = s.unknown;
  row.paths = s.log.filter((l) => l.status).map((l) => l.path[0] + ':' + l.status[0] + l.nodes).join(' ');
  if (REF) {
    t = cpu(); try { const ref = selectGroups(I, { nodeLimit: +(process.env.REFLIMIT || 20000) }); row.ref = ref.kept; row.refNodes = ref.log.reduce((a, l) => a + l.nodes, 0); } catch (e) { row.ref = null; row.refErr = 'unknown'; }
    row.refMs = Math.round(cpu() - t);
    row.same = row.ref ? row.ref.join() === row.kept.join() : null;
  }
  emit();
}
console.log('done');
