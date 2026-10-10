// Judge 3 probe (engineering lens): one cell of the template grid through the template-parametric prototype.
// Reads only; prints one JSON line.  node probe_tpp_cell.mjs <family> <days> <variant|-> <minutes> <level>
// Generic client: warm-up + core opener as the only fixed blocks, level starts / ceilings of rules.volume, the model's keep order,
// pattern stations on, no tests, no athletic room items. This is a SIZE probe of the oracle on real templates, not a fidelity run.
import { buildProblem, plan, certify, rules } from '../sim_template-parametric/tpp.mjs';
const [fam, days, variant, minutes, level] = process.argv.slice(2);
const warm = { label: 'warm-up', minutes: rules.time_model.minutes_per_set.warmup_session };
const core = { label: 'core opener', pair: [{ sets: 2, tc: 'core_set' }, { sets: 2, tc: 'core_set' }] };
const N = 12, st = rules.volume.start, cp = rules.volume.cap;
const big = { F: 10, S: st.quads[level], C: cp.quads[level], mc: 2 }, small = { F: 10, S: st.shoulders[level], C: cp.shoulders[level], mc: 2 };
const cfg0 = { name: `${fam}.${days}${variant !== '-' ? '/' + variant : ''} ${minutes} ${level}`, family: fam, days: Number(days), variant: variant === '-' ? null : variant,
  minutes: Number(minutes), phi: rules.session.time_fit.fit_factor, level, N, blocks: rules.stairway.exercise_blocks_by_N[String(N)], G: rules.stairway.by_N[String(N)].growth,
  groups: { hips: { ...big }, quads: { ...big }, back: { ...big }, chest: { ...big }, shoulders: { ...small }, calves: { F: 7, S: 7, C: 8, mc: 1 }, triceps: { ...small }, biceps: { ...small } },
  keep: rules.session.time_fit.keep_order.slice(),
  pattern: { enabled: true, buckets: rules.volume.pattern_keep.buckets, sets: rules.volume.pattern_keep.sets, max: rules.volume.pattern_keep.max_per_week },
  fixed: {}, room: [], athletic: [] };
let P = buildProblem(cfg0);
for (const d of P.dayIds) cfg0.fixed[d] = [warm, core];
// calves floor by the number of leg days of this template (3 sets a leg day, 4 at most)
const legDays = P.cellsOf('calves').length; if (legDays) cfg0.groups.calves = { F: 3 * legDays, S: 3 * legDays, C: 4 * legDays, mc: 1 };
P = buildProblem(cfg0);
const t0 = process.hrtime.bigint();
let out;
try {
  const R = plan(P);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  let viol = null; try { const c = certify(P, R); viol = Array.isArray(c) ? c.length : (c && c.violations ? c.violations.length : c); } catch (e) { viol = 'certify threw: ' + e.message; }
  out = { cell: cfg0.name, mainDays: P.dayIds.length, cells: P.cells.size, ok: true, ms: Math.round(ms), searches: R.stats.searches, nodes: R.stats.nodes, evals: R.stats.evals, full: R.full, viol };
} catch (e) { out = { cell: cfg0.name, mainDays: P.dayIds.length, cells: P.cells.size, ok: false, ms: Math.round(Number(process.hrtime.bigint() - t0) / 1e6), err: String(e.message).slice(0, 160) }; }
console.log(JSON.stringify(out));
