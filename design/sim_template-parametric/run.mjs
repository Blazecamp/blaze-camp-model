// Runs the Template-Parametric Planner prototype on the three hardest samples and prints the tables quoted in
// design/design_template-parametric.md (section 14).  node design/sim_template-parametric/run.mjs [pickleball|crossfit|swimmer] [minutes]
import { buildProblem, plan, certify, mins, rules } from './tpp.mjs';
import * as SAMPLES from './samples.mjs';

const pad = (s, n) => String(s).padEnd(n), lp = (s, n) => String(s).padStart(n);
const GROUPS = ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves'];

export function report(cfg, { verbose = true } = {}) {
  const out = [], log = (s) => out.push(s);
  const P = buildProblem(cfg);
  const t0 = process.hrtime.bigint();
  const R = plan(P, log);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const N = cfg.N;
  const head = [`\n## ${cfg.name}  (template ${P.tpl.id || cfg.family + '.' + cfg.days}${cfg.variant ? ' / ' + cfg.variant : ''}, level ${cfg.level}, ${N} weeks, chosen ${cfg.minutes} min, fit band ${Math.floor(cfg.minutes * cfg.phi + 1e-9)} min)`];
  const res = head.concat(out);
  res.push(`starts -> peaks (direct sets): ${R.full.map((g) => `${g} ${R.a[g]} -> ${R.z[g]}`).join(', ')}`);
  res.push(`solve: ${ms.toFixed(1)} ms, ${R.stats.searches} oracle searches, ${R.stats.nodes} search nodes, ${R.stats.evals} day evaluations`);
  // weekly credited sets per group
  res.push('\nWeekly sets per group (credited: prime 1.0, helpers 0.25, at most 1.0 a set; * = trained directly, floor ' + R.full.map((g) => g + ' ' + cfg.groups[g].F).join(' / ') + ')');
  res.push(pad('group', 12) + Array.from({ length: N }, (_, i) => lp('w' + (i + 1), 6)).join(''));
  for (const g of GROUPS) {
    const row = R.rows.map((r) => r.ev.Q[g] / 4);
    if (!row.some((x) => x > 0)) continue;
    const tag = R.full.includes(g) ? '*' : R.S.state[g] === 'PATTERN' ? '~' : ' ';
    res.push(pad(tag + g, 12) + row.map((x) => lp(x, 6)).join(''));
  }
  res.push('  (* trained directly; ~ movement kept: one 2-set station, not counted as trained; blank: credit from other lifts' + (cfg.classModel ? ' and the class lift' : '') + ')');
  res.push(pad(' direct sets', 12));
  for (const g of R.full) res.push(pad('  ' + g, 12) + R.v[g].map((x) => lp(x, 6)).join(''));
  const tot = R.rows.map((r) => Object.values(r.ev.slots).flat().reduce((a, x) => a + x.n, 0));
  res.push(pad(' total sets', 12) + tot.map((x) => lp(x, 6)).join('') + `   flat weeks ${tot.slice(1).filter((x, i) => x === tot[i]).length} of ${N - 1}; largest rise ${Math.max(...tot.slice(1).map((x, i) => (100 * (x - tot[i])) / tot[i])).toFixed(1)} %`);
  res.push('\nMinutes per day (the supersets the plan marks as needed are on)');
  res.push(pad('day', 12) + Array.from({ length: N }, (_, i) => lp('w' + (i + 1), 6)).join(''));
  for (const d of P.dayIds) res.push(pad(d, 12) + R.rows.map((r) => lp(mins(r.ev.min[d]).toFixed(1), 6)).join(''));
  res.push(pad(' all pairs on', 12)); for (const d of P.dayIds) res.push(pad('  ' + d, 12) + R.rows.map((r) => lp(mins(r.evAll.min[d]).toFixed(1), 6)).join(''));
  res.push(pad(' straight sets', 12)); for (const d of P.dayIds) res.push(pad('  ' + d, 12) + R.rows.map((r) => lp(mins(r.evNone.min[d]).toFixed(1), 6)).join(''));
  if (verbose) {
    for (const w of [1, N]) {
      res.push(`\nWeek ${w}:`);
      const r = R.rows[w - 1];
      for (const d of P.dayIds) {
        const day = P.days.find((x) => x.id === d);
        const fx = (cfg.fixed[d] || []).map((x) => x.label).concat((cfg.room || []).filter((x) => x.day === d && R.S.room[x.id]).map((x) => x.items[0].label)).join(' / ');
        const blk = R.ssByBlock.find((b) => w >= b.b0 && w <= b.b1);
        const pk = new Map(); for (const p of r.ev.pairs[d] || []) if (blk.on.has(p.key)) p.members.forEach((m) => pk.set(m, p.key));
        const items = r.ev.slots[d].map((a) => `${a.slot.bucket.replace('RP_', '').replace('ISO_', 'iso ')}${a.slot.variant ? ':' + a.slot.variant : ''}${a.pattern ? ' (pattern)' : a.slot.fixed ? ' (class lift)' : ''} ${a.n}${pk.has(a) ? '^' : ''}`).join(', ');
        res.push(`  ${d} ${day.label} | ${mins(r.ev.min[d]).toFixed(1)} min | ${fx} | ${items}`);
      }
    }
    res.push('  (^ = done as a superset with its partner; the superset is needed for the day to fit)');
  }
  if (cfg.athletic) {
    // athletic doses: per-set dose first, inside its bounds (rules.athletic.reconcile.per_set_min / max); one scale factor for the block when the
    // stations cannot hold the sport's target (T5-ATH-02); never down (T3-ATH-01)
    const rc = rules.athletic.reconcile, lvl = rules.stairway.by_N[String(N)].display_level;
    res.push('\nAthletic work a week (planned / the sport target; scale = the share of the target the kept stations can hold)');
    for (const k of cfg.athletic) {
      const on = k.stations.filter((st) => !st.room || R.S.room[st.room]);
      const sets = on.reduce((a, st) => a + st.sets, 0);
      const tgt = (w) => k.target[0] + ((k.target[1] - k.target[0]) * (lvl[String(w)] - 2)) / 9;
      if (k.key === 'olympic_sets') { res.push(`  ${pad(k.key, 15)} ${sets} sets every week / ${k.target[0]} -> ${k.target[1]}${sets === 0 ? '  (block switched off for the minutes: offered back)' : ''}`); continue; }
      if (!sets) { res.push(`  ${pad(k.key, 15)} 0 / ${Math.round(tgt(1))} -> ${Math.round(tgt(N))}  (station left out for the minutes: offered back)`); continue; }
      const mn = rc.per_set_min[k.key], mx = rc.per_set_max[k.key], cap = sets * mx, scale = Math.min(1, cap / tgt(N));
      let prev = 0; const row = [];
      for (let w = 1; w <= N; w++) { const q = Math.max(mn, Math.min(mx, Math.round((tgt(w) * scale) / sets))); prev = Math.max(prev, q * sets); row.push(prev); }
      res.push(`  ${pad(k.key, 15)} ${row.join(' ')}  / ${Math.round(tgt(1))} -> ${Math.round(tgt(N))}  (${sets} sets, ${mn}-${mx} a set; scale ${scale.toFixed(2)})`);
    }
  }
  const viol = certify(P, R);
  res.push(`\ncertify: ${viol.length ? viol.length + ' violation(s): ' + viol.slice(0, 6).join(' | ') : '0 violations (floors every week, 2-4 exercises per trained group per day, set bounds, never down, step <= max(1, 7 %), total < +10 % or +1 set, every day inside its limit, no slot ever loses a set)'}`);
  return { text: res.join('\n'), R, P, ms };
}

const which = process.argv[2], minutes = process.argv[3] ? Number(process.argv[3]) : undefined;
if (process.argv[1] && process.argv[1].endsWith('run.mjs')) {
  for (const k of ['pickleball', 'crossfit', 'swimmer']) {
    if (which && which !== k && which !== 'all') continue;
    console.log(report(SAMPLES[k](minutes)).text);
  }
}
