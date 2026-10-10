// design/two-stage/proto/athlevel.mjs - PROTOTYPE of one step of tier G4a (competitive athletes: the highest athletic level that keeps
// G1 and G3) on the swimmer. Level 0 = the sample as planned. Level 1 = a third set on both jump stations (jump capacity 32 -> 48, the
// profile's target is 46): Monday + 99 s (one more set of the box jump), Friday + 129 s (one more round of the jump + throw pair).
//   node athlevel.mjs
import * as S from './samples.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from './stage2.mjs';
import { summarize } from './offers.mjs';

function solveLevel(extra) {
  const I = S.swimmer({ minutes: 60 });
  I.days.forEach((d) => { const x = extra[d.id] || 0; d.fixedW = d.fixedW.map((s) => s + x); d.fixed = [d.fixedW[0], Math.max(...d.fixedW.slice(1))]; });
  const s1 = planEndpoints(I, {});
  if (!s1.plan) return { I, sum: null };
  const s2 = placeBlock(I, s1, {});
  return { I, s1, s2, sum: summarize(I, s1, s2) };
}
const show = (name, r) => console.log(`${name}: ${r.sum ? `${r.sum.lines.join(', ')}${r.sum.pattern.length ? ' | pattern ' + r.sum.pattern.join(',') : ''} | sets ${r.sum.sets[0]} -> ${r.sum.sets[1]} | longest day ${r.sum.longest.toFixed(1)} | unknown ${r.s1.audit.unknown}` : 'no group fits'}`);
const L0 = solveLevel({}), L1 = solveLevel({ Mon: 99, Fri: 129 });
show('athletic level 0 (jumps 26 -> 32 a week, 70 % of the target)', L0);
show('athletic level 1 (third set on both jump stations: jumps to 100 %)', L1);
const same = L1.sum && L0.sum.kept.join() === L1.sum.kept.join() && L0.sum.pattern.join() === L1.sum.pattern.join();
console.log(`G4a verdict: level 1 ${same ? 'keeps' : 'does NOT keep'} the kept groups and the pattern stations of level 0 -> ${same ? 'taken before the peaks (default order for competitive athletes)' : 'not taken'}`);
