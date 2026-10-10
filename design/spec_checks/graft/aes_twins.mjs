// design/spec_checks/graft/aes_twins.mjs - sample 06 with the twin days tied (A1 = A2, B1 = B2: same exercises, sets differ by 0 or
// 1, the earlier day takes the odd set) against the untied model, same per-question budget. Measures what the TIED-FIRST question
// protocol of PLANNER_SPEC.md 7.5 can save; in the tied model a 'no' is not a proof, so this run shows the saving on 'fits' answers
// and the plan the tied model alone would give.
import { aesthetics } from './aesthetics.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from '../../two-stage/proto/stage2.mjs';
const budget = Number(process.argv[2] || 2000);
for (const tie of [false, true]) {
  const t0 = process.hrtime.bigint();
  const I = aesthetics({ minutes: 75 });
  I.twins = []; for (const [d1, d2] of [['Mon', 'Thu'], ['Tue', 'Fri']]) for (const g of I.groups) { const a = I.gdIx[`${g.id}@${d1}`], b = I.gdIx[`${g.id}@${d2}`]; if (a != null && b != null) I.twins.push([a, b]); }
  I.tieTwins = tie;
  const s1 = planEndpoints(I, { budget, trace: true });
  const s2 = placeBlock(I, s1, { tiers: ['last', 'flat', 'hold', 'late', 'shape', 'land'] });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6, N = I.N;
  const fits = s1.audit.log.filter((l) => l.includes(': fits')).map((l) => Number(l.match(/\((\d+) nodes\)/)[1])), nos = s1.audit.log.filter((l) => l.includes(': no')).map((l) => Number(l.match(/\((\d+) nodes\)/)[1]));
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  console.log(`${tie ? 'twins TIED' : 'twins free'} (budget ${budget} per question): ${s1.kept.length} groups kept; ${s1.kept.map((g) => `${I.groups[g].id} ${s2.weeks[0].Qmain[g] / 4}->${s2.weeks[N - 1].Qmain[g] / 4}`).join(', ')}`);
  console.log(`   total ${s2.weeks[0].total} -> ${s2.weeks[N - 1].total}; ${s1.audit.calls} questions, ${s1.audit.nodes} nodes ('fits' ${fits.length} answers ${sum(fits)} nodes; 'no' ${nos.length} answers ${sum(nos)} nodes; unknown ${s1.audit.unknown}), ${ms.toFixed(0)} ms; violations ${s2.violations.length}; longest day ${(Math.max(...s2.weeks.flatMap((w) => w.seconds)) / 60).toFixed(1)} min`);
}
