// design/two-stage/proto/run.mjs - run the two-stage prototype on one sample:  node run.mjs pickleball '{"minutes":45}'
import * as S from './samples.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock, report } from './stage2.mjs';
const name = process.argv[2] || 'pickleball';
const o = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const t0 = process.hrtime.bigint();
const I = S[name](o);
const s1 = planEndpoints(I, { trace: !!process.env.TRACE, noPartners: !!o.noPartners });
if (!s1.plan) { console.log(`### ${I.name}\nno group fits`); process.exit(0); }
const s2 = placeBlock(I, s1, { rule: o.rule || 7 });
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
console.log(report(I, s1, s2));
console.log(`fixed minutes per day (week 1 / later max): ${I.days.map((d) => `${d.id} ${(d.fixed[0] / 60).toFixed(1)} / ${(d.fixed[1] / 60).toFixed(1)}`).join(', ')}`);
console.log(`stopped: ${JSON.stringify(Object.fromEntries(Object.entries(s1.stopped).map(([g, r]) => [I.groups[g].id, r])))}`);
console.log(`time ${ms.toFixed(0)} ms`);
if (process.env.TRACE) console.log(s1.audit.log.join('\n'));
