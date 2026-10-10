// design/two-stage/proto/detail.mjs - sets per exercise per week of one planned sample (the placement of stage 2, week by week)
//   node detail.mjs pickleball '{"care":"one"}'
import * as S from './samples.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from './stage2.mjs';
const name = process.argv[2] || 'pickleball', o = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const I = S[name](o), s1 = planEndpoints(I, {}), s2 = placeBlock(I, s1, {});
const N = I.N, plan = s1.plan;
console.log(`### ${I.name}: sets per exercise, week 1 -> ${N}`);
I.days.forEach((day, d) => {
  console.log(`${day.id} (${day.label})`);
  I.gds.forEach((gd, gi) => { if (gd.d !== d || !plan.K[gi]) return; for (let i = 0; i < plan.K[gi]; i++) console.log(`   ${(I.groups[gd.g].id + ' ' + gd.cands[i].cls + ' [' + gd.cands[i].sid + ']').padEnd(28)} ${s2.weeks.map((w) => w.sets[gi][i]).join(' ')}`); });
  I.partners.forEach((pt, pi) => { if (pt.d === d && plan.y[pi]) console.log(`   ${('pattern ' + pt.cls + ' (' + I.groups[pt.g].id + ')').padEnd(28)} ${s2.weeks.map(() => pt.sets).join(' ')}`); });
});
console.log('add sequences (which day takes each added set, in order):');
s1.kept.forEach((g, k) => console.log(`   ${I.groups[g].id.padEnd(10)} ${s2.seqs[k].map((gi) => I.days[I.gds[gi].d].id).join(' -> ') || '-'}   | steps in weeks ${s2.table[k].map((v, i) => (i > 0 && v > s2.table[k][i - 1] ? i + 1 : null)).filter(Boolean).join(', ') || '-'}`));
console.log(`weekly rises of all resistance sets: ${s2.stair.rises.join(' ')}  (planned curve by group: ${s2.stair.curves.map((c, k) => I.groups[s1.kept[k]].id + ' ' + c.map((x) => x.toFixed(1)).join(' ')).join(' | ')})`);
