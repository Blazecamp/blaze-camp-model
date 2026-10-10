// Judge 2: a hand-built instance for the reduction (ii) of theorem T2 in design_two-stage.md (stage1.mjs "free" set).
import { buildTables, growth10k, checkEndpoints } from '../two-stage/proto/core.mjs';
import { planEndpoints } from '../two-stage/proto/stage1.mjs';
import { ask } from '../two-stage/proto/oracle.mjs';
const N = 6, NG = 3;
const cand = (g, hi) => { const cred = [0, 0, 0]; cred[g] = 4; return { sid: 's', cls: 'X', lo: 2, hi, cred, work: [45, 45], rest: [90, 90] }; };
const I = buildTables({
  name: 'T2 counterexample', N, exBlocks: [[1, N]], G10k: growth10k(N), spill4: 4, maxPartners: 3, sessionHard4: 44,
  groups: [
    { id: 'g0 (first in keep order, e.g. a Focus group)', S: 5, C: 7, F: 5, mc: 1, session4: 400 },
    { id: 'g1 (later, hosts the pattern station)', S: 4, C: 6, F: 4, mc: 1, session4: 400 },
    { id: 'g2 (not trainable; owns the pattern station)', S: 4, C: 6, F: 4, mc: 1, session4: 400 },
  ],
  days: [{ id: 'd0', main: true, limit: [3600, 3600], fixed: [0, 0], exBudget: null, cap12: null }],
  gds: [
    { id: 'g0@d0', g: 0, d: 0, Ks: [2], cands: [cand(0, 3), cand(0, 2)], home: false },
    { id: 'g1@d0', g: 1, d: 0, Ks: [2], cands: [cand(1, 3), cand(1, 3)], home: false },
  ],
  pairs: [], fixedSets: 0, patternOrder: ['g2'],
  // pattern station of g2, hosted by g1's first exercise (its pair partner), 2 sets, credits g0 with 0.5 a set
  partners: [{ id: 'p0', d: 0, g: 2, host: [1, 0], sets: 2, cls: 'P', cred: [2, 0, 4], work: [45, 45], rest: [90, 90] }],
});
const s1 = planEndpoints(I, { budget: 200000, trace: true });
console.log('stage 1 keeps:', JSON.stringify(s1.kept), 'reasons', JSON.stringify(s1.reasons));
console.log(s1.audit.log.slice(0, 6).join('\n'));
const full = ask(I, { must: [0] });              // the same question with every later group left free
console.log('question "g0 trained, every other group free":', full.status, full.plan ? JSON.stringify(full.plan) : '', 'evaluator:', full.plan ? JSON.stringify(checkEndpoints(I, full.plan)) : '');
