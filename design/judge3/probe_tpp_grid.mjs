// Judge 3 probe: the template-parametric prototype over a slice of the real template grid, one child process per cell with a
// wall-clock limit (the prototype's oracle has no node budget).  node probe_tpp_grid.mjs [timeoutSeconds=20] > probe_tpp_grid.out.txt
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const TO = Number(process.argv[2] || 20) * 1000;
const cell = fileURLToPath(new URL('./probe_tpp_cell.mjs', import.meta.url));
const TPL = [['aesthetics', 2, '-'], ['aesthetics', 3, '-'], ['aesthetics', 4, '-'], ['aesthetics', 4, 'upper_lower'], ['aesthetics', 6, 'ppl_x2'],
  ['athletic', 2, '-'], ['athletic', 3, '-'], ['athletic', 4, '-'], ['no_equipment', 4, '-']];
const rows = [];
for (const [f, d, v] of TPL) for (const m of [45, 60, 75, 90]) for (const L of ['L1', 'L2']) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [cell, f, String(d), v, String(m), L], { timeout: TO, encoding: 'utf8' });
  let row;
  if (r.error || r.status !== 0 || !r.stdout.trim()) row = { cell: `${f}.${d}${v !== '-' ? '/' + v : ''} ${m} ${L}`, ok: false, timeout: !!(r.error && r.error.code === 'ETIMEDOUT') || r.signal === 'SIGTERM', wall: Date.now() - t0, err: (r.stderr || '').split('\n').find((x) => /Error/.test(x)) || null };
  else row = JSON.parse(r.stdout.trim().split('\n').pop());
  rows.push(row); console.log(JSON.stringify(row));
}
const ok = rows.filter((r) => r.ok), ms = ok.map((r) => r.ms).sort((a, b) => a - b), q = (p) => ms[Math.min(ms.length - 1, Math.floor(p * ms.length))];
console.log(`SUMMARY cells ${rows.length}: solved ${ok.length}, timed out (> ${TO / 1000} s) ${rows.filter((r) => r.timeout).length}, errors ${rows.filter((r) => !r.ok && !r.timeout).length}`);
console.log(`solved cells: ms p50 ${q(0.5)} p90 ${q(0.9)} max ${ms[ms.length - 1]}; over 1 s: ${ok.filter((r) => r.ms > 1000).length}; certify violations > 0 in ${ok.filter((r) => r.viol && r.viol !== 0).length}`);
