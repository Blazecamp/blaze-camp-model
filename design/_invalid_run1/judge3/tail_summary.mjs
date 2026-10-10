import fs from 'node:fs';
const rows = fs.readFileSync(new URL('./tail_sweep.2000.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const q = (xs, p) => { const s = xs.slice().sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null; };
const byFam = {};
for (const r of rows) (byFam[r.family] = byFam[r.family] || []).push(r);
for (const [f, rs] of Object.entries(byFam)) {
  const ran = rs.filter((r) => !r.skip && r.kept > 0);
  const notProven = ran.filter((r) => r.doseStatus !== 'optimal');
  const noSol = ran.filter((r) => r.hasSol === false);
  const selN = ran.map((r) => r.selNodes), doseN = ran.map((r) => r.doseNodes || 0);
  console.log(`${f}: ${rs.length} instances, skipped ${rs.filter((r) => r.skip).length}, no group fits ${rs.filter((r) => r.note).length}, selection unknown ${rs.filter((r) => r.selStatus).length}, ran ${ran.length}`);
  console.log(`   selection nodes p50 ${q(selN, 0.5)} p90 ${q(selN, 0.9)} max ${Math.max(...selN)} | dose nodes (cap 2000/tier) p50 ${q(doseN, 0.5)} p90 ${q(doseN, 0.9)} max ${Math.max(...doseN)}`);
  console.log(`   dosing NOT proven optimal within 2000 nodes/tier: ${notProven.length}/${ran.length}; of those with no incumbent at all: ${noSol.length}; weeks errors ${ran.filter((r) => r.weeksErr).length}`);
  console.log(`   dose over 300 nodes total: ${ran.filter((r) => r.doseNodes > 300).length}; over 1000: ${ran.filter((r) => r.doseNodes > 1000).length}; selection over 300: ${ran.filter((r) => r.selNodes > 300).length}; over 1000: ${ran.filter((r) => r.selNodes > 1000).length}`);
  for (const r of notProven) console.log(`     not proven: ${r.days}x${r.minutes} ${r.level} kept ${r.kept}/${r.present} tiers ${r.tiers} nodes ${r.doseNodes} sol=${r.hasSol} ${r.vars}v/${r.cons}c ${r.weeksErr || ''}`);
  for (const r of ran.filter((x) => x.weeksErr && x.doseStatus === 'optimal')) console.log(`     weeksErr: ${r.days}x${r.minutes} ${r.level} ${r.weeksErr}`);
}
