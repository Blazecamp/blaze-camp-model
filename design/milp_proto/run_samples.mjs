// design/milp_proto/run_samples.mjs - runs the prototype planner on the three hard samples and prints the tables quoted in
// design/design_milp.md section 14.   node design/milp_proto/run_samples.mjs [pickleball|crossfit|swimmer] [key=value ...]
import { solveLexPlan, fillWeeks, weekMinutes, certify, explain, athleticKey, TU } from './planner.mjs';
import { pickleball, crossfit, swimmer } from './samples.mjs';
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, '');
const f2 = (x) => String(Math.round(x * 100) / 100);

export function report(I, opt = {}) {
  const out = []; const P = (s) => out.push(s);
  const t0 = cpu();
  const R = solveLexPlan(I, opt);
  const t1 = cpu();
  const { B, sol } = R, { V, slots } = B;
  P(`\n## ${I.name}${opt.tag ? ' - ' + opt.tag : ''}`);
  P(`chosen ${I.days.length} x ${B.mu} min; "the day holds" limit ${f1(B.LIM / TU)} min (fit factor ${B.phi}); model ${B.m.lo.length} integer variables, ${B.m.cons.length} rows; ${(t1 - t0).toFixed(0)} ms CPU`);
  for (const d of I.days) if (d.items) P(`  fixed blocks ${d.id} (${d.label}): ${d.items.map((it) => `${it.name} ${f2(it.min)}`).join(' + ')} = ${f2(d.fix1 / TU)} min`);
  if (I.fixedNote) for (const [k, a] of Object.entries(I.fixedNote)) P(`  fixed blocks ${k}: weeks 1-4 ${a[0].map((it) => `${it.name} ${f2(it.min)}`).join(' + ')} = ${f2(a[0].reduce((x, it) => x + it.min, 0))} min; weeks 5-8 ${f2(a[1].reduce((x, it) => x + it.min, 0))}; weeks 9-12 ${f2(a[2].reduce((x, it) => x + it.min, 0))}`);
  P('tiers (each frozen exactly before the next):');
  for (const r of R.report) P(`  ${r.id.padEnd(4)} ${r.name.padEnd(70)} = ${String(r.value).padStart(5)}  ${r.status.padEnd(8)} ${r.nodes} nodes${r.log ? '   [' + r.log.join(' ') + ']' : ''}`);
  if (!sol) { P('NO PLAN'); return { out, R }; }
  const on = (v) => v !== undefined && sol[v] === 1;
  const kept = I.groups.filter((g) => on(V.y[g.id]));
  const patt = slots.filter((s) => on(V.pt[s.id]));
  P(`trained directly (FULL): ${kept.map((g) => g.id).join(', ') || '-'}`);
  for (const g of kept) P(`  ${g.id.padEnd(9)} start S ${g.S}, ceiling C ${g.C}, floor ${g.F}: ` + I.days.map((d, di) => { const a = d.slots.filter((s) => s.g === g.id && sol[V.xN[s.id]] > 0); return a.length ? `${d.id} ${a.map((s) => `${s.name} ${sol[V.x1[s.id]]}->${sol[V.xN[s.id]]}`).join(', ')}` : null; }).filter(Boolean).join(' | '));
  const notKept = I.groups.filter((g) => !on(V.y[g.id]));
  P(`not trained directly: ${notKept.map((g) => { const cl = slots.filter((s) => s.g === g.id && s.classLift), pt = patt.filter((s) => s.g === g.id); return g.id + (cl.length ? ` (class lift ${cl.map((s) => s.name).join(', ')} 3 sets)` : pt.length ? ` (pattern kept: ${pt.map((s) => `${s.day} ${s.name} 2 sets`).join(', ')})` : slots.some((s) => s.g === g.id) ? ' (time)' : ' (no station; compound credit)'); }).join('; ')}`);
  if ((I.cuts || []).length) P(`room cuts taken: ${I.cuts.filter((c) => on(V.rc[c.id])).map((c) => c.label).join('; ') || 'none'}   (not needed: ${I.cuts.filter((c) => !on(V.rc[c.id])).map((c) => c.label).join('; ') || '-'})`);
  P(`supersets on (needed): ${(I.pairs || []).filter((p) => on(V.pon[p.id])).map((p) => `${B.sid[p.a].day} ${B.sid[p.a].name} + ${B.sid[p.b].name}`).join('; ') || 'none'}${(I.bonus || []).some((b, k) => on(V.bq[k])) ? '; calf raise + joint-care item' : ''}`);
  const F = fillWeeks(I, B, sol, opt.order);
  if (F.error) { P('STAIRWAY: ' + F.error); return { out, R }; }
  const t2 = cpu();
  const N = I.N, wk = (i) => F.weeks[i];
  const cred = (g, X) => slots.reduce((a, s) => a + (s.cr[g] || 0) * (X[s.id] || 0), 0) / 4;
  const dir = (g, X) => slots.filter((s) => s.g === g).reduce((a, s) => a + X[s.id], 0);
  P(`\nweekly hard sets per group, weeks 1..${N} (credited group sets on the main days: prime 1.0, helpers 0.25, at most 1.0 a set)`);
  P(`| group | state | ${Array.from({ length: N }, (_, i) => i + 1).join(' | ')} |`);
  P(`|---|---|${'---|'.repeat(N)}`);
  for (const g of I.groups) {
    const row = F.weeks.map((w) => f2(cred(g.id, w)));
    if (row.every((x) => x === '0')) { P(`| ${g.id} | - | ${row.join(' | ')} |`); continue; }
    P(`| ${g.id} | ${on(V.y[g.id]) ? 'trained' : slots.some((s) => s.g === g.id && s.classLift) ? 'class lift' : patt.some((s) => s.g === g.id) ? 'pattern' : 'credit'} | ${row.join(' | ')} |`);
  }
  const tot = F.weeks.map((w) => Object.values(w).reduce((a, b) => a + b, 0));
  P(`| total resistance sets | | ${tot.join(' | ')} |`);
  P(`| rise vs previous week | | - | ${tot.slice(1).map((t, i) => (t === tot[i] ? '0' : '+' + f1(100 * (t - tot[i]) / tot[i]) + ' %')).join(' | ')} |`);
  P(`direct sets of the trained groups: ${F.st.sched.map((l) => `${l.id} ${l.x.join(' ')} (lambda ${l.lam.toFixed(2)})`).join('; ')}`);
  P(`stairway (exact, placed weeks): lines not landing in week ${N}: ${F.st.cost.land}; flat weeks of the total: ${F.st.cost.flat} of ${N - 1} (arithmetic minimum ${Math.max(0, N - 1 - F.lines.reduce((a, l) => a + l.P - l.S, 0))}); flat weeks in a row: ${F.st.cost.flat2}; distance to the coach's rounded curve: ${F.st.cost.shape} set-weeks; ${F.st.states} DP states`);
  P(`\nminutes per day, weeks 1..${N} (supersets on where needed; chosen ${B.mu}, limit ${f1(B.LIM / TU)})`);
  P(`| day | ${Array.from({ length: N }, (_, i) => i + 1).join(' | ')} | straight sets, last week |`);
  P(`|---|${'---|'.repeat(N)}---|`);
  const mins = F.weeks.map((w, i) => weekMinutes(I, B, sol, w, i + 1));
  I.days.forEach((d, di) => P(`| ${d.id} | ${mins.map((m) => f1(m[di].min)).join(' | ')} | ${f1(mins[N - 1][di].straight)} |`));
  if (I.tests) P(`test weeks (1 and ${N}): the strength / jump test work-up adds ${Object.entries(I.tests).map(([k, v]) => `${k} +${v} min`).join(', ')} (reported apart, see design section 14)`);
  P(`exercises per day (resistance, last week): ${I.days.map((d) => `${d.id} ${d.slots.filter((s) => wk(N - 1)[s.id] > 0).length}`).join(', ')}`);
  const C = certify(I, B, sol, F);
  P(`certificate over all ${N} weeks (integers): days over the limit ${C.time}, group-weeks under the floor ${C.floor}, over the ceiling ${C.ceiling}, slots that lost a set ${C.slotDrop}, weeks outside the endpoint sandwich ${C.between}, VOL-07 breaks ${C.vol07}, group steps over 1 set ${C.step}, weekly totals rising 10 % or more ${C.total}, groups not at their peak in week ${N}: ${C.landed}  => ${C.ok ? 'PASS' : 'FAIL'}`);
  P(`last week, day by day: ${I.days.map((d) => `${d.id}: ${d.slots.filter((s) => wk(N - 1)[s.id] > 0).map((s) => `${s.name} ${wk(0)[s.id]}->${wk(N - 1)[s.id]}`).join(', ')}`).join(' || ')}`);
  P(`CPU: tiers ${(t1 - t0).toFixed(0)} ms (${R.report.reduce((a, r) => a + r.nodes + (r.partNodes || 0), 0)} nodes, ${R.report.reduce((a, r) => a + r.lpIters, 0)} LP pivots), stairway + placement + certificate ${(cpu() - t1).toFixed(0)} ms`);
  // exact reason for the first groups that are not trained directly (R3-SES-02 step 2: say why, with the rule ids)
  if (!opt.noExplain) {
    const keptIds = kept.map((g) => g.id); let shown = 0;
    for (const g of notKept) {
      if (!slots.some((s) => s.g === g.id) || shown >= (opt.explainMax ?? 2)) continue;
      const before = I.groups.slice(0, I.groups.indexOf(g)).filter((x) => keptIds.includes(x.id)).map((x) => x.id);
      const te = cpu(); const E = explain(I, opt, before, g.id); shown++;
      P(`why not ${g.id} (with ${before.join(', ') || 'nothing else'} kept): ${E.status}${E.conflict.length ? ' - minimal conflict: ' + E.conflict.join(' | ') : ''}  [${E.nodes} nodes, ${(cpu() - te).toFixed(0)} ms]`);
    }
  }
  if (I.athletic) { P('athletic budget (planned / target per week; per-set doses climb, never drop):');
    for (const k of I.athletic) { const A = athleticKey(k.stations, k.target, N); P(`  ${k.key.padEnd(15)} planned ${A.plan.join(' ')} | target ${A.target.join(' ')} | attainment ${Math.round(100 * Math.min(...A.attainment))}-${Math.round(100 * Math.max(...A.attainment))} %${Math.min(...A.attainment) < 0.85 ? '  <- told: the stations cannot hold the target (add a set or a station = minutes)' : ''}`); } }
  return { out, R, F, C, kept: kept.map((g) => g.id), patt: patt.map((s) => s.id) };
}

/** R3-SES-02 step 1: the keep vector re-solved at every legal session length (offers are re-solves, never arithmetic) */
export function offers(make, lengths = [30, 45, 60, 75, 90, 105, 120], opt = {}) {
  const rows = [];
  for (const mu of lengths) {
    const I = make({ mu });
    const t0 = cpu();
    const R = solveLexPlan(I, { ...opt, only: 'T1c' });
    const { V, slots } = R.B, sol = R.sol;
    const kept = sol ? I.groups.filter((g) => sol[V.y[g.id]] === 1).map((g) => g.id) : [];
    const pat = sol ? slots.filter((s) => V.pt[s.id] !== undefined && sol[V.pt[s.id]] === 1).map((s) => `${s.g}`) : [];
    const cuts = sol ? (I.cuts || []).filter((c) => sol[V.rc[c.id]] === 1).map((c) => c.id) : [];
    rows.push(`| ${I.days.length} x ${mu} | ${kept.join(', ') || '-'} | ${pat.join(', ') || '-'} | ${cuts.join(', ') || '-'} | ${R.report.map((r) => r.status + ' ' + r.nodes).join(' / ')} | ${(cpu() - t0).toFixed(0)} |`);
  }
  return ['| schedule | trained directly | pattern stations | room cuts | proof (T1a / T1b / T1c: status, nodes) | ms |', '|---|---|---|---|---|---|', ...rows];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const which = process.argv[2] || 'all';
  const kv = Object.fromEntries(process.argv.slice(3).map((a) => a.split('=')).map(([k, v]) => [k, isNaN(+v) ? v : +v]));
  const all = { pickleball, crossfit, swimmer };
  for (const [k, make] of Object.entries(all)) {
    if (which !== 'all' && which !== k) continue;
    const r = report(make(kv), { nodeLimit: kv.nodeLimit || 20000, flatFirst: kv.flatFirst === 1, noExplain: kv.noExplain === 1, order: kv.order === 'land' ? ['land', 'flat', 'flat2', 'shape', 'over7'] : undefined, tag: process.argv.slice(3).filter((a) => !a.startsWith('noOffers') && !a.startsWith('noExplain')).join(' ') || null });
    console.log(r.out.join('\n'));
    if (!kv.noOffers) { console.log('\noffers (keep vector re-solved at every legal length):'); console.log(offers((o) => make({ ...kv, ...o }), undefined, { nodeLimit: kv.nodeLimit || 20000 }).join('\n')); }
  }
}
