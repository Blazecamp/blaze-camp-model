// Same-code timing of the research prototypes in two JS engines:
//   node design/research/bench_runtime.mjs
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -m design/research/bench_runtime.mjs
import { runtime, nowMs, print } from './env.mjs';
import { CASES, buildInstance, selectGroups, dose, fillWeeks } from './proto_endpoint.mjs';
import { flowSchedule } from './proto_stairway_flow.mjs';
const lines = [`runtime: ${runtime}`];
const REPS = 3;
for (const c of CASES) {
  const t = { select: [], dose: [], weeks: [] };
  let sig = '';
  for (let k = 0; k < REPS; k++) {
    let a = nowMs(); const I = buildInstance(c.o); const sel = selectGroups(I); let b = nowMs(); t.select.push(b - a);
    a = nowMs(); const { r, B } = dose(I, sel); b = nowMs(); t.dose.push(b - a);
    a = nowMs(); const { weeks } = fillWeeks(I, B, r.sol, 12); b = nowMs(); t.weeks.push(b - a);
    sig = `${sel.kept.join(',')} | tiers ${r.report.map((x) => x.value).join('/')} | week12 total ${Object.values(weeks[11]).reduce((p, q) => p + q, 0)}`;
  }
  const best = (xs) => Math.min(...xs).toFixed(0);
  lines.push(`${c.name.slice(0, 3)}: select ${best(t.select)} ms, dose ${best(t.dose)} ms, weeks ${best(t.weeks)} ms (best of ${REPS})  ->  ${sig}`);
}
// stairway flow on 500 random plans
let seed = 4242; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
const LV = [[10, 14], [15, 22], [20, 25], [12, 22], [15, 25], [6, 7], [9, 22], [12, 14]];
let s0 = nowMs(), check = 0;
for (let i = 0; i < 500; i++) { const N = 4 + rnd(13), k = 1 + rnd(12); const L = []; for (let j = 0; j < k; j++) { const [S, C] = LV[rnd(LV.length)]; L.push({ n: 'l' + j, S, C }); } const { sched } = flowSchedule(L, N); check += sched.reduce((p, x) => p + x[N - 1], 0); }
lines.push(`stairway flow: 500 random plans in ${(nowMs() - s0).toFixed(0)} ms (checksum ${check})`);
print(lines.join('\n'));
