// quick variant table: node variants.mjs <sample> '<json opts>' ...
import * as S from './samples.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from './stage2.mjs';
const name = process.argv[2];
for (const arg of process.argv.slice(3)) {
  const o = JSON.parse(arg); const t0 = process.hrtime.bigint();
  const I = S[name](o); const s1 = planEndpoints(I, {});
  let line = `${arg.padEnd(34)} `;
  if (!s1.plan) { console.log(line + 'no group fits'); continue; }
  const s2 = placeBlock(I, s1, {});
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const N = I.N;
  line += s1.kept.map((g) => `${I.groups[g].id} ${s2.weeks[0].Qmain[g] / 4}->${s2.weeks[N - 1].Qmain[g] / 4}`).join(', ');
  const pat = I.groups.map((grp, g) => (s1.states[g] === 'PATTERN' ? grp.id : null)).filter(Boolean);
  line += ` | pattern: ${pat.join(',') || '-'} | sets ${s2.weeks[0].total}->${s2.weeks[N - 1].total} | max min/day ${I.days.map((d, di) => (Math.max(...s2.weeks.map((w) => w.seconds[di])) / 60).toFixed(1)).join('/')} | flats ${s2.stair.flats} | q ${s1.audit.calls} nodes ${s1.audit.nodes} max ${s1.audit.maxNodes} unk ${s1.audit.unknown} | ${ms.toFixed(0)} ms${s2.violations.length ? ' | VIOL ' + s2.violations.length : ''}`;
  console.log(line);
}
