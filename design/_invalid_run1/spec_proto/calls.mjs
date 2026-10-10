import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
  const rows = fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.kept);
  const calls = { f: [], i: [], u: [] };
  for (const r of rows) for (const t of (r.paths || '').split(' ').filter(Boolean)) { const m = /^(\w):(\w)(\d+)$/.exec(t); if (m) calls[m[2]].push(+m[3]); }
  const q = (a, p) => { a = a.slice().sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : '-'; };
  console.log(f);
  for (const k of ['f', 'i', 'u']) console.log(`  ${{ f: 'feasible  ', i: 'infeasible', u: 'unknown   ' }[k]} calls ${String(calls[k].length).padStart(5)}  nodes median ${q(calls[k], 0.5)}  p90 ${q(calls[k], 0.9)}  p99 ${q(calls[k], 0.99)}  p99.9 ${q(calls[k], 0.999)}  max ${calls[k].length ? Math.max(...calls[k]) : '-'}`);
  for (const B of [1000, 5000, 20000, 50000]) console.log(`  budget ${String(B).padStart(6)} per call: feasible verdicts lost ${calls.f.filter((n) => n > B).length} of ${calls.f.length} (${(100 * calls.f.filter((n) => n > B).length / calls.f.length).toFixed(2)} %), infeasible verdicts unproven ${calls.i.filter((n) => n > B).length} of ${calls.i.length}; cells touched ${rows.filter((r) => r.maxNodes > B).length} of ${rows.length}`);
}
