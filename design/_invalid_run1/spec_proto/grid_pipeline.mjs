// design/spec_proto/grid_pipeline.mjs - the whole spec chain on every cell of the template grid: does it always answer, does every
// week pass every row, how much work is it. env FIT (default 1), OUT.
import fs from 'node:fs';
import { buildInstance } from './canon_endpoint.mjs';
import { extend } from './examples.mjs';
import { plan } from './pipeline.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const FIT = +(process.env.FIT || 1), OUT = new URL('./' + (process.env.OUT || 'grid_pipeline.jsonl'), import.meta.url);
fs.writeFileSync(OUT, '');
for (const family of Object.keys(TPL.families)) for (const days of [2, 3, 4, 5, 6]) for (const minutes of [30, 45, 60, 75, 90, 105, 120]) for (const level of ['L1', 'L2', 'L3']) {
  const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  const row = { family, days, minutes, level };
  let I; try { I = extend(buildInstance({ family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 })); } catch (e) { row.skip = 'build'; fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); continue; }
  if (!I.present.length) { row.skip = 'no slots'; fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); continue; }
  const t = cpu();
  try {
    const r = plan(I, { fit: FIT });
    row.ms = +(cpu() - t).toFixed(1); row.kept = r.kept; row.present = I.present.length; row.calls = r.calls; row.nodes = r.nodes; row.unknown = r.sel.unknown;
    if (r.weeks) {
      row.chk = r.chk; row.viol = Object.values(r.chk).reduce((a, b) => a + b, 0); row.flats = r.st.flats; row.lateFlats = r.st.lateFlats; row.land = r.st.land; row.climbing = r.st.climbing; row.states = r.st.states;
      row.steps = r.st.tot[r.st.tot.length - 1] - r.st.tot[0]; row.minFlats = Math.max(0, 11 - row.steps); row.ladder = r.ladderSteps; row.opened = r.opened; row.notes = r.notes.length;
      row.maxMin = Math.max(...r.minutes.flat()); row.w1over = r.keptIdx.filter((h) => r.credit(r.weeks[0], h) > 4 * r.S[h] + 3).length;
      row.blockedTime = [...r.blocked.values()].filter((v) => /minutes/.test(v)).length;
    }
  } catch (e) { row.ms = +(cpu() - t).toFixed(1); row.err = e.message.slice(0, 120); }
  fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
}
const rows = fs.readFileSync(OUT, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const run = rows.filter((r) => !r.skip), ok = run.filter((r) => r.chk), q = (a, p) => { a = a.slice().sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : '-'; };
console.log(`cells ${rows.length}; skipped ${rows.length - run.length}; errors ${run.filter((r) => r.err).length}; no group kept ${run.filter((r) => !r.err && !r.chk).length}; planned ${ok.length} (${ok.length * 12} plan-weeks)`);
for (const e of run.filter((r) => r.err).slice(0, 8)) console.log('  ERROR', e.family, e.days, e.minutes, e.level, e.err);
const sum = {}; for (const r of ok) for (const [k, v] of Object.entries(r.chk)) sum[k] = (sum[k] || 0) + v;
console.log('violations over all planned weeks:', JSON.stringify(sum));
console.log(`unknown oracle calls: ${ok.reduce((a, r) => a + r.unknown, 0)}; plans with an 'unreachable peak' cut or a structure note: ${ok.filter((r) => r.notes).length}`);
console.log(`CPU ms per plan: median ${q(ok.map((r) => r.ms), 0.5)}, p90 ${q(ok.map((r) => r.ms), 0.9)}, p99 ${q(ok.map((r) => r.ms), 0.99)}, max ${Math.max(...ok.map((r) => r.ms))}; oracle nodes per plan: median ${q(ok.map((r) => r.nodes), 0.5)}, p99 ${q(ok.map((r) => r.nodes), 0.99)}, max ${Math.max(...ok.map((r) => r.nodes))}; oracle calls per plan: median ${q(ok.map((r) => r.calls), 0.5)}, max ${Math.max(...ok.map((r) => r.calls))}; stairway DP states: p99 ${q(ok.map((r) => r.states), 0.99)}, max ${Math.max(...ok.map((r) => r.states))}`);
console.log(`flat weeks of the weekly total: equal to the arithmetic minimum (11 - steps) in ${ok.filter((r) => r.flats === r.minFlats).length} of ${ok.length} plans; plans with a flat week in the last third ${ok.filter((r) => r.lateFlats).length} (of which with fewer than 4 steps in all: ${ok.filter((r) => r.lateFlats && r.steps < 4).length})`);
console.log(`plans where a kept group starts week 1 a set or more above its level start: ${ok.filter((r) => r.w1over).length}; longest day over the chosen minutes: ${ok.filter((r) => r.maxMin > r.minutes * FIT + 0.05).length}`);
