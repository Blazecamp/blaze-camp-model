// Summary of link.jsonl (see link.mjs)
import fs from 'node:fs';
const rows = fs.readFileSync(new URL('./link.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => !r.skip);
const out = [];
for (const scope of ['all days 2-6', 'days 2-4 only (the 5- and 6-day aesthetics / athletic / strength templates reuse the 4 main days)']) {
  const rs = scope.startsWith('all') ? rows : rows.filter((r) => r.days <= 4);
  out.push(`\n${scope}: ${rs.length} cells (L2, 30-120 min)`);
  for (const f of [...new Set(rs.map((r) => r.family))].concat(['TOTAL'])) {
    const x = f === 'TOTAL' ? rs : rs.filter((r) => r.family === f);
    out.push(`  ${f.padEnd(11)} cells ${String(x.length).padStart(3)} | weekly-capacity stage 1 keeps a group the exact per-day oracle rejects: ${x.filter((r) => r.overPromised.length).length} | ... and loses a group the exact oracle keeps: ${x.filter((r) => r.lost.length).length} | full template skeleton cannot hold floors + climb + minutes: ${x.filter((r) => r.fullTemplate === 'infeasible').length} (unknown ${x.filter((r) => r.fullTemplate === 'unknown').length}) | oracle 'unknown': exact ${x.reduce((a, r) => a + r.exactUnknown, 0)}, weekly ${x.reduce((a, r) => a + r.aggUnknown, 0)}`);
  }
}
out.push('\ncells where the two oracles disagree:');
for (const r of rows.filter((r) => r.overPromised.length || r.lost.length)) out.push(`  ${r.family} ${r.days}x${r.minutes}: exact keeps [${r.exact.join(', ')}]; weekly capacity adds [${r.overPromised.join(', ')}]${r.lost.length ? ' and loses [' + r.lost.join(', ') + ']' : ''}`);
const feas = rows.filter((r) => r.fullTemplate === 'feasible');
out.push(`\nfull template feasible in ${feas.length}/${rows.length} cells; shortest feasible session by family and days: ` + [...new Set(rows.map((r) => r.family + ' ' + r.days))].map((k) => { const [f, d] = k.split(' '); const m = feas.filter((r) => r.family === f && r.days === +d).map((r) => r.minutes); return `${f} ${d}d: ${m.length ? Math.min(...m) : 'never'}`; }).join('; '));
console.log(out.join('\n'));
