// design/spec_checks/graft/aes_budget.mjs - sample 06 at several per-question node budgets: what the plan loses when the budget is small.
import { aesthetics } from './aesthetics.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from '../../two-stage/proto/stage2.mjs';
for (const budget of [500, 2000, 20000]) {
  const t0 = process.hrtime.bigint();
  const I = aesthetics({ minutes: Number(process.argv[2] || 75) });
  const s1 = planEndpoints(I, { budget, trace: true });
  const s2 = placeBlock(I, s1, { tiers: ['last', 'flat', 'hold', 'late', 'shape', 'land'] });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const tier = {};
  for (const l of s1.audit.log) { const k = l.startsWith('keep') || l.startsWith('capacity') ? 'G1 keep' : l.startsWith('pattern') || l.startsWith('partner') || l === 'base' || l.startsWith('base') ? 'G3 stations' : l.startsWith('overrun') || l.includes('overrun') ? 'G3b overrun' : l.startsWith('usual') ? 'G5s session' : l.startsWith('raise') || l.startsWith('ladder') || l.startsWith('pin peaks') ? 'G5 peaks' : l.startsWith('week 1') ? 'G6 week 1' : 'G7 structure'; const n = Number((l.match(/\((\d+) nodes\)/) || [0, 0])[1]); (tier[k] = tier[k] || { q: 0, nodes: 0, unknown: 0 }); tier[k].q++; tier[k].nodes += n; if (l.includes('unknown')) tier[k].unknown++; }
  const N = I.N;
  console.log(`budget ${budget} per question: ${s1.kept.length} groups kept; peaks ${s1.kept.map((g) => `${I.groups[g].id} ${s2.weeks[0].Qmain[g] / 4}->${s2.weeks[N - 1].Qmain[g] / 4} (${s1.stopped[g]})`).join(', ')}`);
  console.log(`   total ${s2.weeks[0].total} -> ${s2.weeks[N - 1].total}; ${s1.audit.calls} questions, ${s1.audit.nodes} nodes, unknown ${s1.audit.unknown}, ${ms.toFixed(0)} ms (${(1000 * ms / s1.audit.nodes).toFixed(0)} microseconds a node); violations ${s2.violations.length}`);
  console.log('   by tier: ' + Object.entries(tier).map(([k, v]) => `${k}: ${v.q} questions, ${v.nodes} nodes${v.unknown ? ', ' + v.unknown + ' unknown' : ''}`).join(' | '));
}
