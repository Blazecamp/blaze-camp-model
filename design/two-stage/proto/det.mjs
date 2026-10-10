// design/two-stage/proto/det.mjs - determinism: the same plans, byte for byte, in Node (V8) and in the JavaScriptCore shell.
//   node det.mjs      /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -m det.mjs
import * as S from './samples.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from './stage2.mjs';
const out = typeof print === 'function' ? print : console.log;
let h = 2166136261 >>> 0;
const mix = (s) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } };
const cases = [['pickleball', { care: 'one' }], ['pickleball', { care: 'one', minutes: 75 }], ['swimmer', {}], ['swimmer', { minutes: 90 }], ['crossfit', {}], ['crossfit', { minutes: 90 }]];
for (const [name, o] of cases) {
  const I = S[name](o), s1 = planEndpoints(I, {}), s2 = placeBlock(I, s1, {});
  const txt = JSON.stringify({ kept: s1.kept, K: s1.plan.K, n1: s1.plan.n1, nN: s1.plan.nN, y: s1.plan.y, weeks: s2.weeks.map((w) => [w.n, w.seconds, w.total]), nodes: s1.audit.nodes, calls: s1.audit.calls, rises: s2.stair.rises });
  mix(txt);
  out(`${name} ${JSON.stringify(o)}: kept ${s1.kept.map((g) => I.groups[g].id).join(',')} | nodes ${s1.audit.nodes} | totals ${s2.weeks.map((w) => w.total).join(' ')}`);
}
out('checksum ' + h.toString(16));
