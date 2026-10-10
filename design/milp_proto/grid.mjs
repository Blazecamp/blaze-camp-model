// design/milp_proto/grid.mjs - robustness sweep for design_milp.md section 6: the compact epoch model + kernel on the same
// template grid the earlier audits used (design/research/proto_endpoint.mjs buildInstance: 6 families x 2-6 days x 7 lengths x L1-L3).
// Records deterministic node counts, statuses and CPU time per tier. Writes grid.jsonl next to this file.
//   node design/milp_proto/grid.mjs [FAMS=a,b] [LIMIT=20000]
import fs from 'node:fs';
import { buildInstance } from '../research/proto_endpoint.mjs';
import { solveLexPlan, fillWeeks, certify, tu } from './planner.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const TM = R.time_model;
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const env = Object.fromEntries(process.argv.slice(2).map((a) => a.split('=')));
const LIMIT = +(env.LIMIT || 20000), FAMS = (env.FAMS || Object.keys(TPL.families).join(',')).split(','), OUT = new URL(env.OUT || './grid.jsonl', import.meta.url);
const DAYS = (env.DAYS || '2,3,4,5,6').split(',').map(Number), MINS = (env.MINS || '30,45,60,75,90,105,120').split(',').map(Number), LEVELS = (env.LEVELS || 'L1,L2,L3').split(',');
const restOf = (tc) => TM.rest_class_minutes[TM.rest_class_by_time_class[tc]];

/** research instance -> planner instance (same slots, minutes, starts, ceilings and floors; pairs = the template's superset tags) */
export function adapt(J, N = 12) {
  const peak = J.o.athleticPeak || 1;
  const I = { name: `${J.o.family} ${J.o.days}x${J.o.minutes} ${J.o.level}`, N, mu: J.o.minutes, phi: R.session.time_fit.fit_factor, growth: R.stairway.by_N[String(N)].growth, athlete: J.athlete, athleteCap: R.session.athlete_cap,
    groups: J.o.keepOrder.filter((g) => J.present.includes(g)).map((g) => ({ id: g, S: J.S[g], C: J.C[g], F: J.floor(g), mc: g === 'calves' ? 1 : 2, single: g === 'calves', pinned: g === 'calves' ? 'allLegDays' : null })),
    days: J.days.map((d) => ({ id: d.wd, label: d.label, fix1: tu(d.fixed + d.athMin), fixN: tu(d.fixed + d.athMin * peak), counted: d.athCount,
      slots: d.slots.map((s, k, arr) => ({ id: s.id, g: s.group, bucket: s.bucket, name: s.bucket, tc: s.tc, c1: tu(s.cost), cN: tu(s.cost), r1: tu(restOf(s.tc)), rN: tu(restOf(s.tc)), min: s.min, max: s.max, cr: s.cr,
        optional: arr.filter((x) => x.group === s.group).indexOf(s) >= 2, pattern: false, classLift: false, role: null, must: false, ss: s.ss })) })),
    pairs: [], cuts: [], bonus: [] };
  for (const d of I.days) { const tags = {}; d.slots.forEach((s) => { if (s.ss) (tags[s.ss] = tags[s.ss] || []).push(s); }); for (const a of Object.values(tags)) if (a.length === 2 && a[0].g !== a[1].g) I.pairs.push({ a: a[0].id, b: a[1].id }); }
  // calves leg days: only days that hold a calf slot
  return I;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.writeFileSync(OUT, '');
  for (const family of FAMS) for (const days of DAYS) for (const minutes of MINS) for (const level of LEVELS) {
    const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
    const row = { family, days, minutes, level };
    const emit = () => fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
    let J; try { J = buildInstance({ family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 }); } catch (e) { row.skip = 'build'; emit(); continue; }
    if (!J.present.length || !J.days.some((d) => d.slots.length)) { row.skip = 'no resistance slots'; emit(); continue; }
    const I = adapt(J);
    const t0 = cpu();
    let res; try { res = solveLexPlan(I, { nodeLimit: LIMIT, noEven: true, skip: (env.SKIP || 'T1b,T1c,T6,T7a,T7b,T9').split(','), partBounds: env.PARTS === '1' }); } catch (e) { row.err = String(e.message).slice(0, 80); emit(); continue; }
    row.cpu = Math.round(cpu() - t0); row.vars = res.B.m.lo.length; row.rows = res.B.m.cons.length;
    row.tiers = res.report.map((r) => ({ id: r.id, st: r.status, v: r.value, n: r.nodes, it: r.lpIters }));
    row.status = res.status; row.hasPlan = !!res.sol;
    if (res.sol) {
      const { V } = res.B; row.kept = I.groups.filter((g) => res.sol[V.y[g.id]] === 1).map((g) => g.id); row.present = I.groups.length;
      if (row.kept.length) { const t1 = cpu(); const F = fillWeeks(I, res.B, res.sol); if (F.error) row.stair = F.error; else { const C = certify(I, res.B, res.sol, F); row.cert = C.ok; if (!C.ok) row.certDetail = C; row.flat = F.st.cost.flat; row.land = F.st.cost.land; row.dpStates = F.st.states; } row.weeksCpu = Math.round(cpu() - t1); }
    }
    emit();
  }
  console.log('done');
}
