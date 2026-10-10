// design/two-stage/proto/sweep.mjs - the three samples at the seven legal session lengths (and a few switches):
// keep vector, peaks, minutes, oracle work, per-week certificate, and the monotonicity that is true (keep vector never
// lexicographically worse with more minutes).   node sweep.mjs
import * as S from './samples.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from './stage2.mjs';
const MIN = [30, 45, 60, 75, 90, 105, 120];
const cases = [
  ['pickleball', { care: 'one' }], ['pickleball', { care: 'engine' }], ['pickleball', { care: 'warmup' }], ['pickleball', { care: 'one', factor: 1.1 }],
  ['swimmer', {}], ['swimmer', { vol3Strength: false }], ['swimmer', { factor: 1.1 }], ['swimmer', { oly: false }],
  ['crossfit', {}], ['crossfit', { classRest: 180 }], ['crossfit', { skill: false }], ['crossfit', { factor: 1.1 }],
];
const all = { plans: 0, weeks: 0, viol: 0, calls: 0, reused: 0, nodes: [], maxNodes: [], ms: [], unknown: 0, lexWorse: 0, subsetLost: 0, steps: 0, fits: [], no: [] };
const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
for (const [name, o] of cases) {
  let prev = null; const rows = [];
  for (const minutes of MIN) {
    const t0 = process.hrtime.bigint();
    const I = S[name]({ ...o, minutes });
    const s1 = planEndpoints(I, {});
    const keepVec = I.groups.map((_, g) => (s1.kept.includes(g) ? 1 : 0));
    let line = `${String(minutes).padStart(4)}  `;
    if (s1.plan) {
      const s2 = placeBlock(I, s1, {});
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      all.plans++; all.weeks += I.N; all.viol += s2.violations.length; all.ms.push(ms); if (s2.stair.rule !== 7) all.rule10 = (all.rule10 || 0) + 1; if (s2.needed.some(Boolean)) all.ss = (all.ss || 0) + 1; all.over = Math.max(all.over || 0, ...s2.weeks.flatMap((w) => w.seconds.map((x, d) => x - I.days[d].limit[1])));
      line += s1.kept.map((g) => `${I.groups[g].id} ${s2.weeks[0].Qmain[g] / 4}->${s2.weeks[I.N - 1].Qmain[g] / 4}`).join(', ');
      const pat = I.groups.map((grp, g) => (s1.states[g] === 'PATTERN' ? grp.id : null)).filter(Boolean);
      line += `${pat.length ? ' | pattern ' + pat.join(',') : ''} | sets ${s2.weeks[0].total}->${s2.weeks[I.N - 1].total} | longest day ${(Math.max(...s2.weeks.flatMap((w) => w.seconds)) / 60).toFixed(1)} | flat ${s2.stair.flats} | nodes ${s1.audit.nodes} (max ${s1.audit.maxNodes}) | ${ms.toFixed(0)} ms${s2.violations.length ? ' | VIOLATIONS ' + s2.violations.length : ''}`;
    } else line += 'no group fits';
    all.fits.push(...s1.audit.fits); all.no.push(...s1.audit.no);
    all.calls += s1.audit.calls; all.reused += s1.audit.reused; all.nodes.push(s1.audit.nodes); all.maxNodes.push(s1.audit.maxNodes); all.unknown += s1.audit.unknown;
    if (prev) {
      all.steps++;
      let cmp = 0; for (let g = 0; g < keepVec.length && !cmp; g++) cmp = keepVec[g] - prev[g];
      if (cmp < 0) { all.lexWorse++; line += ' | LEX WORSE'; }
      if (prev.some((x, g) => x && !keepVec[g])) { all.subsetLost++; line += ' | (a kept group left for a higher-priority one)'; }
    }
    prev = keepVec; rows.push(line);
  }
  console.log(`\n## ${name} ${JSON.stringify(o)}`); console.log(rows.join('\n'));
}
console.log(`\nSUMMARY: ${all.plans} plans, ${all.weeks} plan-weeks, per-week certificate violations ${all.viol}; oracle questions ${all.calls} (+${all.reused} answered by a known witness), unknown ${all.unknown}`);
console.log(`nodes per plan: median ${pct(all.nodes, 0.5)}, p90 ${pct(all.nodes, 0.9)}, max ${Math.max(...all.nodes)}; largest single question: median ${pct(all.maxNodes, 0.5)}, max ${Math.max(...all.maxNodes)}; ms per plan: median ${pct(all.ms, 0.5).toFixed(0)}, p90 ${pct(all.ms, 0.9).toFixed(0)}, max ${Math.max(...all.ms).toFixed(0)}`);
for (const k of ['fits', 'no']) console.log(`'${k}' answers ${all[k].length}: nodes median ${pct(all[k], 0.5)}, p90 ${pct(all[k], 0.9)}, p99 ${pct(all[k], 0.99)}, max ${Math.max(...all[k])}; answered within 50 nodes ${Math.round((100 * all[k].filter((x) => x <= 50).length) / all[k].length)} %; a budget of 20,000 nodes would leave ${all[k].filter((x) => x > 20000).length} unproven`);
console.log(`stairway: plans that needed the 10 % fallback ${all.rule10 || 0}; plans with a needed superset ${all.ss || 0}; largest (day seconds - limit) over all plan-weeks ${all.over}`);
console.log(`minute steps ${all.steps}: keep vector lexicographically worse ${all.lexWorse}; steps where a kept group left ${all.subsetLost}`);
