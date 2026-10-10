import fs from 'node:fs';
const f = process.argv[2];
const rows = fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const ok = rows.filter((r) => r.kept);
const q = (a, p) => { a = a.slice().sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : null; };
console.log(`${f}: cells ${rows.length}, skipped ${rows.filter((r) => r.skip).length}, errors ${rows.filter((r) => r.err).length}, run ${ok.length}`);
console.log(`  cells with an UNKNOWN oracle call: ${ok.filter((r) => r.unknown).length}`);
for (const k of ['nodes', 'maxNodes', 'ms']) console.log(`  ${k.padEnd(9)} median ${q(ok.map((r) => r[k]), 0.5)}  p90 ${q(ok.map((r) => r[k]), 0.9)}  p99 ${q(ok.map((r) => r[k]), 0.99)}  max ${Math.max(...ok.map((r) => r[k]))}`);
const paths = { w: 0, e: 0, x: 0 }; let calls = 0;
for (const r of ok) for (const t of (r.paths || '').split(' ').filter(Boolean)) { calls++; const k = t[0] === 'w' ? 'w' : t[0] === 'e' && t.slice(0, 2) === 'e:' && /^e:f/.test(t) && r.paths ? 'e' : 'x'; paths[k]++; }
console.log(`  oracle calls ${calls}`);
if (ok.some((r) => 'same' in r)) {
  const ref = ok.filter((r) => r.ref);
  console.log(`  reference decided ${ref.length} cells (unknown ${ok.filter((r) => r.ref === null).length}); same kept list ${ref.filter((r) => r.same).length}; different ${ref.filter((r) => !r.same).length}`);
  for (const r of ref.filter((x) => !x.same).slice(0, 20)) console.log('    DIFF', r.family, r.days, r.minutes, r.level, 'reduced', r.kept.join(','), '| ref', r.ref.join(','));
  console.log(`  reference CPU ms: median ${q(ref.map((r) => r.refMs), 0.5)} p99 ${q(ref.map((r) => r.refMs), 0.99)} max ${Math.max(...ref.map((r) => r.refMs))}; nodes max ${Math.max(...ref.map((r) => r.refNodes))}`);
}
console.log('  worst cells by nodes in one call:');
for (const r of ok.slice().sort((a, b) => b.maxNodes - a.maxNodes).slice(0, +(process.argv[3] || 8))) console.log('   ', r.family, r.days + 'x' + r.minutes, r.level, `kept ${r.kept.length}/${r.groups}`, `nodes ${r.nodes} (max ${r.maxNodes})`, r.ms + ' ms', r.paths);
