// summary of grid*.jsonl files: node counts, statuses and CPU per tier (design_milp.md section 6)
import fs from 'node:fs';
const files = process.argv.slice(2);
const seen = new Set();
const rows = files.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))).filter((r) => { const k = [r.family, r.days, r.minutes, r.level].join('|'); if (seen.has(k)) return false; seen.add(k); return true; });
const q = (a, p) => { if (!a.length) return '-'; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const ran = rows.filter((r) => r.tiers);
console.log(`cells ${rows.length}: skipped ${rows.filter((r) => r.skip).length} (${[...new Set(rows.filter((r) => r.skip).map((r) => r.skip))].join('; ')}), errors ${rows.filter((r) => r.err).length}, solved ${ran.length}`);
console.log(`no plan at all (the fixed blocks alone do not fit): ${ran.filter((r) => !r.hasPlan && r.tiers[0].st === 'infeasible').length}; unknown (budget, nothing found): ${ran.filter((r) => r.tiers.some((t) => String(t.st).startsWith('unknown'))).length}`);
console.log(`model size: variables p50 ${q(ran.map((r) => r.vars), 0.5)} max ${Math.max(...ran.map((r) => r.vars))}; rows p50 ${q(ran.map((r) => r.rows), 0.5)} max ${Math.max(...ran.map((r) => r.rows))}`);
const ids = [...new Set(ran.flatMap((r) => r.tiers.map((t) => t.id)))];
for (const id of ids) {
  const ts = ran.flatMap((r) => r.tiers.filter((t) => t.id === id));
  const n = ts.map((t) => t.n);
  console.log(`  ${id.padEnd(4)} solved ${ts.length}; proven ${ts.filter((t) => t.st === 'optimal' || t.st === 'infeasible').length}; budget hit with a plan ${ts.filter((t) => t.st === 'feasible').length}; unknown ${ts.filter((t) => String(t.st).startsWith('unknown')).length}; nodes p50 ${q(n, 0.5)} p90 ${q(n, 0.9)} p99 ${q(n, 0.99)} max ${Math.max(...n)}; pivots per node p50 ${q(ts.filter((t) => t.n).map((t) => Math.round(t.it / t.n)), 0.5)}`);
}
const c = ran.map((r) => r.cpu);
console.log(`CPU per plan for these tiers (ms, loaded laptop): p50 ${q(c, 0.5)} p90 ${q(c, 0.9)} p99 ${q(c, 0.99)} max ${Math.max(...c)}`);
const cert = ran.filter((r) => r.cert !== undefined);
console.log(`plans carried through stairway + placement + certificate: ${cert.length}; certificate PASS ${cert.filter((r) => r.cert).length}; FAIL ${cert.filter((r) => !r.cert).length}; stairway errors ${ran.filter((r) => r.stair).length}`);
for (const r of cert.filter((x) => !x.cert).slice(0, 5)) console.log('   FAIL', r.family, r.days, r.minutes, r.level, JSON.stringify(r.certDetail));
const byFam = {}; for (const r of ran) { (byFam[r.family] = byFam[r.family] || []).push(r); }
for (const [f, a] of Object.entries(byFam)) console.log(`  ${f.padEnd(18)} cells ${a.length}; not proven on some tier ${a.filter((r) => r.tiers.some((t) => t.st === 'feasible' || String(t.st).startsWith('unknown'))).length}; max nodes in one tier ${Math.max(...a.flatMap((r) => r.tiers.map((t) => t.n)))}; CPU p50 ${q(a.map((r) => r.cpu), 0.5)} max ${Math.max(...a.map((r) => r.cpu))} ms`);
const hard = ran.filter((r) => r.tiers.some((t) => t.st === 'feasible' || String(t.st).startsWith('unknown')));
for (const r of hard.slice(0, 30)) console.log(`   not proven: ${r.family} ${r.days}x${r.minutes} ${r.level}: ${r.tiers.map((t) => `${t.id}=${t.v}${t.st === 'optimal' ? '' : '(' + t.st + ')'}/${t.n}`).join(' ')}`);
