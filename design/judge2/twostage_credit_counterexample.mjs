// Judge 2: the two-stage oracle's "implied" peak-floor row (credited peak >= 4 F + 4 mc) assumes every exercise of a group credits
// that group with a full set. The coach's credit table has exercises that do not (dips 0.5 / 0.5, KB swing 0).
import { buildTables, growth10k, checkEndpoints } from '../two-stage/proto/core.mjs';
import { ask } from '../two-stage/proto/oracle.mjs';
const N = 12;
const I = buildTables({
  name: 'half-credit exercise', N, exBlocks: [[1, N]], G10k: growth10k(N), spill4: 4, maxPartners: 3, sessionHard4: 56,
  groups: [{ id: 'chest', S: 3, C: 6, F: 3, mc: 2, session4: 400 }],
  days: [{ id: 'd0', main: true, limit: [7200, 7200], fixed: [0, 0], exBudget: null, cap12: null }],
  gds: [{ id: 'chest@d0', g: 0, d: 0, Ks: [2], home: false, cands: [
    { sid: 'press', cls: 'HPUSH', lo: 2, hi: 4, cred: [4], work: [45, 45], rest: [90, 90] },
    { sid: 'dips (0.5 chest / 0.5 triceps)', cls: 'DIPS', lo: 2, hi: 4, cred: [2], work: [45, 45], rest: [90, 90] }] }],
  pairs: [], partners: [], fixedSets: 0,
});
const r = ask(I, { must: [0] });
console.log('oracle: "chest trained directly" ->', r.status, '(' + r.nodes + ' nodes)');
const plan = { z: [true], K: [2], n1: [4], nN: [6], y: [] };
console.log('hand plan: press 2 -> 3, dips 2 -> 3 (credited 3 -> 4.5 sets, floor 3, climb 2 own sets); evaluator violations:', JSON.stringify(checkEndpoints(I, plan)));
