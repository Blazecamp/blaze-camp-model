// design/spec_proto/crosscheck.mjs - the reduced integer-only oracle (reduced.mjs, portfolio search) against the stored kept lists of
// the LP-based reference oracle (ref_lp.jsonl; regenerate with: CANON=1 NOTWIN=1 HALL=1 REF=1 REFLIMIT=60000 OUT=grid_ref.jsonl node grid.mjs)
// Same feasible set on both sides: research time arithmetic (pairs x 0.65), fit 1.10, balanced staircase, no twin rows.
import fs from 'node:fs';
import { buildInstance } from './canon_endpoint.mjs';
import { prep, select } from './reduced.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const ref = fs.readFileSync(new URL('./ref_lp.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
let same = 0, diff = 0, unknown = 0; const nodes = [], maxCall = [], ms = [], feas = [], infe = [];
for (const r of ref) {
  if (r.skip || !r.ref) continue;
  const keepOrder = r.family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  const I = buildInstance({ family: r.family, days: r.days, minutes: r.minutes, level: r.level, keepOrder, athleticPeak: r.family === 'athletic' ? 1.3 : 1 });
  const P = prep(I, { hall: true }); const t = cpu(); const s = select(P, 250000); ms.push(cpu() - t);
  nodes.push(s.nodes); maxCall.push(s.maxNodes); unknown += s.unknown;
  for (const l of s.log) (l.status === 'feasible' ? feas : infe).push(l.nodes);
  if (s.kept.join() === r.ref.join()) same++; else { diff++; console.log('DIFF', r.family, r.days, r.minutes, r.level, 'reduced', s.kept.join(','), '| LP reference', r.ref.join(',')); }
}
const q = (a, p) => { a = a.slice().sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; };
console.log(`cells compared ${same + diff}: identical kept lists ${same}, different ${diff}; unknown oracle calls ${unknown}`);
console.log(`reduced oracle, nodes per plan (all calls): median ${q(nodes, 0.5)}, p90 ${q(nodes, 0.9)}, p99 ${q(nodes, 0.99)}, max ${Math.max(...nodes)}; largest single call: p99 ${q(maxCall, 0.99)}, max ${Math.max(...maxCall)}`);
console.log(`calls: 'fits' ${feas.length} (nodes median ${q(feas, 0.5)}, p99 ${q(feas, 0.99)}, max ${Math.max(...feas)}); 'proven not to fit' ${infe.length} (nodes median ${q(infe, 0.5)}, p99 ${q(infe, 0.99)}, max ${Math.max(...infe)})`);
console.log(`CPU ms per plan: median ${q(ms, 0.5).toFixed(2)}, p90 ${q(ms, 0.9).toFixed(1)}, p99 ${q(ms, 0.99).toFixed(0)}, max ${Math.max(...ms).toFixed(0)}`);
const rm = ref.filter((r) => r.ref).map((r) => r.refMs), rn = ref.filter((r) => r.ref).map((r) => r.refNodes);
console.log(`LP reference (stored run): CPU ms per plan median ${q(rm, 0.5)}, p99 ${q(rm, 0.99)}, max ${Math.max(...rm)}; nodes max ${Math.max(...rn)}`);
