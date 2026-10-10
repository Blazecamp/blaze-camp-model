// Summary of ladder_probe.jsonl: the two solver-free constructions against the research MILP on the same instance + structure.
import fs from 'node:fs';
const rows = fs.readFileSync(new URL('./ladder_probe.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const ran = rows.filter((r) => !r.note);
const out = [];
out.push(`instances ${rows.length} (aesthetics + athletic, 2-4 days, 30-120 min, L1-L3); no group fits ${rows.length - ran.length}; compared ${ran.length}`);
for (const [name, key, cpuKey] of [['function P(D) (strict even exposures)', 'ladder', 'ladderCpuMs'], ['sequential, minutes-aware', 'seq', 'seqCpuMs']]) {
  const ok = ran.filter((r) => !r[key].fail), fail = ran.filter((r) => r[key].fail);
  const proven = ok.filter((r) => r.milp.proven[0]);                  // T1 proven by the MILP
  const provenAll = ok.filter((r) => r.milp.proven.every(Boolean));
  const d1 = proven.map((r) => r[key].T1 - r.milp.tiers[0]);
  const d2 = provenAll.map((r) => r[key].T2 - r.milp.tiers[1]);
  const hist = (xs) => { const h = {}; for (const x of xs) h[x] = (h[x] || 0) + 1; return Object.entries(h).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k >= 0 ? '+' : ''}${k}: ${v}`).join(', '); };
  const cpu = ok.map((r) => r[cpuKey]).sort((a, b) => a - b);
  out.push(`\n${name}`);
  out.push(`  builds a plan in ${ok.length}/${ran.length}; cannot place the kept set in ${fail.length} (${[...new Set(fail.map((r) => r[key].fail.replace(/ (Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/, '')))].join('; ') || '-'})`);
  out.push(`  worst peak shortfall minus the MILP's proven T1 (sets; ${proven.length} cells): ${hist(d1)}`);
  out.push(`  total peak shortfall minus the MILP's proven T2 (sets; ${provenAll.length} cells with all tiers proven): ${hist(d2)}`);
  const beat = ok.filter((r) => !r.milp.proven.every(Boolean));
  out.push(`  cells where the MILP did NOT finish its proof in 2,000 nodes per tier: ${beat.length}; there, T1 vs the MILP's best found: ${hist(beat.filter((r) => r.milp.tiers[0] != null).map((r) => r[key].T1 - r.milp.tiers[0]))}; T2: ${hist(beat.filter((r) => r.milp.tiers[1] != null).map((r) => r[key].T2 - r.milp.tiers[1]))}`);
  out.push(`  every week checked (minutes, floors, VOL-07, twin days, session ceiling): violations ${ok.reduce((a, r) => a + r[key].weekViol, 0)}; slots that lost a set ${ok.reduce((a, r) => a + r[key].slotDrops, 0)}; stairway errors ${ok.filter((r) => r[key].weeksErr).length}`);
  out.push(`  CPU per plan: median ${cpu[Math.floor(cpu.length / 2)]} ms, max ${cpu[cpu.length - 1]} ms`);
}
const mc = ran.map((r) => r.milpCpuMs).sort((a, b) => a - b), mn = ran.map((r) => r.milp.nodes).sort((a, b) => a - b);
out.push(`\nresearch MILP endpoint dosing on the same cells (2,000 nodes per tier): nodes median ${mn[Math.floor(mn.length / 2)]}, p90 ${mn[Math.floor(mn.length * 0.9)]}, max ${mn[mn.length - 1]}; CPU median ${mc[Math.floor(mc.length / 2)]} ms, p90 ${mc[Math.floor(mc.length * 0.9)]} ms, max ${mc[mc.length - 1]} ms; all tiers proven in ${ran.filter((r) => r.milp.proven.length === 3 && r.milp.proven.every(Boolean)).length}/${ran.length}`);
out.push('\ncells where the sequential construction is more than 1 set from the proven T1, or fails:');
for (const r of ran) { const s = r.seq; if (s.fail || (r.milp.proven[0] && s.T1 - r.milp.tiers[0] > 1)) out.push(`  ${r.family} ${r.days}x${r.minutes} ${r.level} kept ${r.kept}/${r.present}: sequential ${s.fail ? 'FAIL ' + s.fail : [s.T1, s.T2, s.T3].join('/')} vs MILP ${r.milp.tiers.join('/')} (${r.milp.status})`); }
console.log(out.join('\n'));
