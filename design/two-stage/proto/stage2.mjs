// design/two-stage/proto/stage2.mjs - PROTOTYPE: stage 2 of the two-stage planner (placement) and the per-week certificate.
// Input: the certificate of stage 1 (structure, week-1 and peak sets per group-day) and the block table (own sets per group per week).
// Every group has ONE add sequence from its week-1 vector to its peak vector: the next set goes to the exposure that is behind
// (fewest sets added so far; ties: the day after the one used last, so Monday this time and Thursday the next - R3-VOL-03); inside
// the day the coach's staircase (VOL-07) says which exercise takes it. Week w is the prefix of length table[g][w] - table[g][1].
// Nothing is searched here and nothing can fail: see the link theorem in the design.
import { setsAt, dayTime, blockSel, blockOfWeek, credits, directs, totalSets, epochSel, pairSaving } from './core.mjs';
import { schedule, certifyTable } from './stairway.mjs';

/** add sequence of one group: the list of group-day indices that receive the 1st, 2nd, ... added set */
export function addSequence(I, plan, g) {
  const gds = I.gds.map((gd, gi) => (gd.g === g && plan.K[gi] > 0 && I.days[gd.d].main ? gi : -1)).filter((i) => i >= 0);
  const added = new Map(gds.map((gi) => [gi, 0])), room = new Map(gds.map((gi) => [gi, plan.nN[gi] - plan.n1[gi]]));
  const seq = []; let last = -1;
  const total = gds.reduce((a, gi) => a + room.get(gi), 0);
  for (let k = 0; k < total; k++) {
    let best = -1;
    // rotation order: start after the day used last
    const order = gds.slice().sort((a, b) => I.gds[a].d - I.gds[b].d); const startAt = order.findIndex((gi) => I.gds[gi].d > last);
    const rot = startAt < 0 ? order : [...order.slice(startAt), ...order.slice(0, startAt)];
    for (const gi of rot) { if (added.get(gi) >= room.get(gi)) continue; if (best < 0 || added.get(gi) < added.get(best)) best = gi; }
    seq.push(best); added.set(best, added.get(best) + 1); last = I.gds[best].d;
  }
  return seq;
}

/**
 * Build every week of the block from the stage-1 certificate.
 * @returns {weeks:[{w, n:number[] (sets per group-day), sets:number[][] (per exercise), minutes:number[], seconds:number[], Q:number[], D:number[], total}], table, stair, pairsOn, violations}
 */
export function placeBlock(I, s1, opt = {}) {
  const plan = s1.plan, N = I.N, NG = I.groups.length;
  const kept = s1.kept;
  const D1 = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.n1[gi])), true);
  const DN = directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.nN[gi])), true);
  const groups = kept.map((g) => ({ id: I.groups[g].id, S: D1[g], P: DN[g] }));
  const constSets = (I.fixedSets || 0) + plan.y.reduce((a, on, pi) => a + (on ? I.partners[pi].sets : 0), 0);
  let stair = schedule(groups, N, { rule: opt.rule || 7, base: constSets, tiers: opt.tiers });
  const notes = [];
  if (!stair) { stair = schedule(groups, N, { rule: 10, base: constSets, tiers: opt.tiers }); notes.push('no schedule under the 7 % total rule: the 10 % rule was used (tiny plan)'); }
  if (!stair) throw new Error('no stairway schedule');
  const cert = certifyTable(groups, N, stair, { rule: stair.rule });
  const seqs = kept.map((g) => addSequence(I, plan, g));
  const weeks = [];
  for (let w = 1; w <= N; w++) {
    const n = plan.n1.slice();
    kept.forEach((g, k) => { const m = stair.table[k][w - 1] - stair.table[k][0]; for (let i = 0; i < m; i++) n[seqs[k][i]]++; });
    const sets = I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], n[gi]));
    weeks.push({ w, n, sets });
  }
  // supersets: every eligible pair may run as a superset; switch on only the pairs a day needs (largest saving first), over all weeks
  const pairsOn = I.pairs.map(() => false), needed = I.days.map(() => false);
  const secOf = (wk, d, on) => dayTime(I, d, blockSel(blockOfWeek(I, wk.w)), I.days[d].fixedW[wk.w - 1], wk.sets, plan.y, on);
  I.days.forEach((day, d) => {
    const mine = I.pairs.map((pr, qi) => (pr.d === d ? qi : -1)).filter((qi) => qi >= 0);
    const worst = () => Math.max(...weeks.map((wk) => secOf(wk, d, pairsOn) - day.limit[wk.w === 1 ? 0 : 1]));
    let guard = 0;
    while (worst() > 0 && guard++ < 20) {
      // the pair with the largest saving in the peak week among those still off
      let best = -1, bs = 0;
      for (const qi of mine) { if (pairsOn[qi]) continue; const sv = pairSaving(I, I.pairs[qi], blockSel(blockOfWeek(I, N)), weeks[N - 1].sets, plan.y); if (sv > bs) { bs = sv; best = qi; } }
      if (best < 0) break;
      pairsOn[best] = true; needed[d] = true;
    }
  });
  const viol = [...cert];
  weeks.forEach((wk, i) => {
    wk.seconds = I.days.map((_, d) => secOf(wk, d, pairsOn));
    wk.secondsAllPairs = I.days.map((_, d) => secOf(wk, d, null));
    wk.minutes = wk.seconds.map((s) => Math.ceil(s / 60));
    wk.Qmain = credits(I, wk.sets, plan.y, true); wk.Q = credits(I, wk.sets, plan.y, false); wk.D = directs(I, wk.sets, true);
    wk.total = totalSets(I, wk.sets, plan.y);
    wk.exercises = I.days.map((_, d) => I.gds.reduce((a, gd, gi) => a + (gd.d === d ? plan.K[gi] : 0), 0) + I.partners.reduce((a, pt, pi) => a + (pt.d === d && plan.y[pi] ? 1 : 0), 0));
    // the per-week certificate: every hard row, re-computed from the definitions with this week's own costs and fixed seconds
    I.days.forEach((day, d) => { if (wk.seconds[d] > day.limit[wk.w === 1 ? 0 : 1]) viol.push(`week ${wk.w} ${day.id}: ${wk.seconds[d]} s > ${day.limit[1]} s`); });
    for (const g of kept) {
      if (wk.Qmain[g] < 4 * I.groups[g].F) viol.push(`week ${wk.w} ${I.groups[g].id}: ${wk.Qmain[g] / 4} under the floor`);
      if (wk.Q[g] > 4 * I.groups[g].C + (I.spill4 ?? 4)) viol.push(`week ${wk.w} ${I.groups[g].id}: over the ceiling`);
    }
    if (i > 0) {
      const pv = weeks[i - 1];
      wk.sets.forEach((x, gi) => x.forEach((v, j) => { if (v < pv.sets[gi][j]) viol.push(`week ${wk.w} ${I.gds[gi].id} exercise ${j + 1}: lost a set`); }));
      for (const g of kept) { const stepQ = wk.Q[g] - pv.Q[g]; if (stepQ < 0) viol.push(`week ${wk.w} ${I.groups[g].id}: credited sets dropped`); }
      wk.n.forEach((v, gi) => { if (v < plan.n1[gi] || v > plan.nN[gi]) viol.push(`week ${wk.w} ${I.gds[gi].id}: outside the certified endpoints`); });
    }
    // the staircase inside every group-day: non-increasing in session order among exercises with room, at most one set apart
    wk.sets.forEach((x, gi) => { for (let j = 1; j < x.length; j++) { const a = x[j - 1], b = x[j], c0 = I.gds[gi].cands[j - 1], c1 = I.gds[gi].cands[j]; if (b > a && a < c0.hi) viol.push(`week ${wk.w} ${I.gds[gi].id}: staircase order`); if (a - b > 1 && b < c1.hi) viol.push(`week ${wk.w} ${I.gds[gi].id}: staircase gap`); } });
  });
  return { weeks, table: stair.table, stair, groups, pairsOn, needed, violations: viol, notes, seqs };
}

const pad = (s, n) => String(s).padStart(n);
/** printable report of a planned block */
export function report(I, s1, s2, opt = {}) {
  const out = [], N = I.N, plan = s1.plan;
  out.push(`### ${I.name}`);
  out.push(`trained directly: ${s1.kept.map((g) => I.groups[g].id).join(', ') || '-'}`);
  out.push(`not trained directly: ${I.groups.map((grp, g) => (s1.kept.includes(g) ? null : `${grp.id} (${s1.states[g] === 'PATTERN' ? 'pattern partner kept; ' : ''}${s1.reasons[g] || 'time'})`)).filter(Boolean).join(', ') || '-'}`);
  out.push(`oracle: ${s1.audit.calls} questions, ${s1.audit.nodes} nodes in all, largest ${s1.audit.maxNodes}, unknown ${s1.audit.unknown}`);
  out.push(`stairway: rule ${s2.stair.rule} %, DP states ${s2.stair.states}, flat weeks ${s2.stair.flats} (late third ${s2.stair.lateFlats}), groups stepping onto their peak in the last week ${s2.stair.landings}/${s2.stair.climbing}`);
  out.push('');
  out.push('structure (exercises / sets in week 1 -> sets in the last week):');
  I.days.forEach((day, d) => {
    const parts = [];
    I.gds.forEach((gd, gi) => { if (gd.d === d && plan.K[gi]) parts.push(`${I.groups[gd.g].id} ${gd.cands.slice(0, plan.K[gi]).map((c2) => c2.cls).join('+')} ${setsAt(gd, plan.K[gi], plan.n1[gi]).join('/')} -> ${setsAt(gd, plan.K[gi], plan.nN[gi]).join('/')}`); });
    I.partners.forEach((pt, pi) => { if (pt.d === d && plan.y[pi]) parts.push(`[partner ${pt.cls} 2 sets]`); });
    out.push(`  ${day.id} (${day.label}): ${parts.join('; ') || '-'}`);
  });
  out.push('');
  const head = `| group | ${Array.from({ length: N }, (_, i) => 'w' + (i + 1)).join(' | ')} |`;
  out.push('weekly credited sets per group (main days):'); out.push(head); out.push('|' + '---|'.repeat(N + 1));
  I.groups.forEach((grp, g) => {
    const tag = s1.kept.includes(g) ? '' : s1.states[g] === 'PATTERN' ? ' (pattern)' : ' (credit)';
    const row = s2.weeks.map((wk) => (wk.Qmain[g] / 4).toString());
    if (row.every((x) => x === '0')) return;
    out.push(`| ${grp.id}${tag} | ${row.join(' | ')} |`);
  });
  out.push(`| **all resistance sets** | ${s2.weeks.map((wk) => wk.total).join(' | ')} |`);
  out.push('');
  out.push('minutes per day (supersets only where needed):'); out.push(`| day | limit | ${Array.from({ length: N }, (_, i) => 'w' + (i + 1)).join(' | ')} | exercises | supersets |`); out.push('|' + '---|'.repeat(N + 4));
  I.days.forEach((day, d) => out.push(`| ${day.id} | ${Math.round(day.limit[1] / 6) / 10} | ${s2.weeks.map((wk) => (Math.round(wk.seconds[d] / 6) / 10).toFixed(1)).join(' | ')} | ${s2.weeks[0].exercises[d]} | ${s2.needed[d] ? 'needed: ' + I.pairs.map((pr, qi) => (pr.d === d && s2.pairsOn[qi] ? pr.tag : null)).filter(Boolean).join(',') : 'recommended'} |`));
  if (s2.violations.length) { out.push(''); out.push('VIOLATIONS: ' + s2.violations.join('; ')); }
  if (s2.notes.length) out.push('notes: ' + s2.notes.join('; '));
  return out.join('\n');
}
