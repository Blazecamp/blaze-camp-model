// design/spec_checks/graft/eval.mjs - the INDEPENDENT evaluator of the grafted endpoint model (a copy of core.checkEndpoints of the
// two-stage prototype, with the three grafts of ./oracle.mjs written out from their definitions: pattern-station kinds, R-PARTNER,
// and the two day limits). It shares the time function and the credit tally with the prototype and no search or pruning code.
import { setsAt, daySeconds, credits, directs } from '../../two-stage/proto/core.mjs';

/** is the lead of a partner rule active in this plan? */
export function leadActive(I, pr, plan) {
  if (pr.leadFixed) return true;
  return (pr.leadGds || []).some((gi) => plan.K[gi] > 0) || (pr.leadStations || []).some((pi) => plan.y[pi]);
}

/**
 * @param I instance (+ days[].band seconds, partners[].kind, partnerRules)   @param plan {z, K, n1, nN, y}
 * @param opt {session4: {g: quarter sets}, band: number[] (seconds per day; default I.days[d].band)}
 * @returns {string[]} violations (empty = the two endpoint weeks are legal)
 */
export function checkEndpointsGraft(I, plan, opt = {}) {
  const v = [];
  const NG = I.groups.length;
  const bandOf = (d) => (opt.band ? (opt.band[d] || 0) : (I.days[d].band || 0));
  const s1 = I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.n1[gi]));
  const sN = I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], plan.nN[gi]));
  I.gds.forEach((gd, gi) => {
    const K = plan.K[gi];
    if (!K) { if (plan.n1[gi] || plan.nN[gi]) v.push(`sets on an inactive group-day ${gd.id}`); return; }
    if (!plan.z[gd.g]) v.push(`${gd.id} is active but ${I.groups[gd.g].id} is not trained directly`);
    if (!gd.Ks.includes(K)) v.push(`COUNT ${gd.id}: ${K} exercises is not allowed (${gd.Ks.join('/')})`);
    if (!s1[gi] || !sN[gi]) v.push(`STAIRCASE ${gd.id}: ${plan.n1[gi]} / ${plan.nN[gi]} sets do not fit ${K} exercises`);
    if (plan.nN[gi] < plan.n1[gi]) v.push(`MONO ${gd.id}`);
  });
  // pattern stations: never for a group that is trained directly; optional kinds one per group and at most maxPartners a week
  let nOpt = 0; const perG = new Array(NG).fill(0);
  I.partners.forEach((pt, pi) => {
    if (!plan.y[pi]) return;
    if (plan.z[pt.g]) v.push(`STATION ${pt.id}: its group is trained directly`);
    if (pt.host && !(plan.K[pt.host[0]] > pt.host[1])) v.push(`STATION ${pt.id}: host exercise is not active`);
    if (pt.kind !== 'partner') { nOpt++; perG[pt.g]++; }
  });
  if (nOpt > (I.maxPartners ?? 3)) v.push('STATION: more optional pattern stations than the weekly maximum');
  perG.forEach((c, g) => { if (c > 1) v.push(`STATION: two optional pattern stations for ${I.groups[g].id}`); });
  for (const [a, b] of I.exclusive || []) if (plan.y[a] && plan.y[b]) v.push(`STATION ${I.partners[a].id}: on twice (as partner and as keep station)`);
  // R-PARTNER: an active lower work lift keeps a partner of its class on that day; a partner station exists only beside an active lead
  for (const pr of I.partnerRules || []) {
    const lead = leadActive(I, pr, plan);
    const sat = (pr.satGds || []).some((gi) => plan.K[gi] > 0) || (pr.satStations || []).some((pi) => plan.y[pi]);
    if (lead && !sat) v.push(`PARTNER ${pr.id}: the work lift has no ${pr.cls} beside it`);
    if (!lead) for (const pi of pr.satStations || []) if (plan.y[pi]) v.push(`PARTNER ${pr.id}: partner station ${I.partners[pi].id} without its work lift`);
  }
  // time: FULL (everything, every pair supersetted) inside the minutes + the band; CORE (no pattern stations) inside the minutes
  const none = I.partners.map(() => false);
  I.days.forEach((day, d) => {
    for (let p = 0; p < 2; p++) {
      const full = daySeconds(I, d, p, p === 0 ? s1 : sN, plan.y), core = daySeconds(I, d, p, p === 0 ? s1 : sN, none);
      if (full > day.limit[p] + bandOf(d)) v.push(`TIME ${day.id} epoch ${p}: ${full} s > ${day.limit[p]} + ${bandOf(d)} s`);
      if (I.coreRow && core > day.limit[p]) v.push(`TIME-CORE ${day.id} epoch ${p}: ${core} s > ${day.limit[p]} s without the pattern stations`);
    }
    let ex = 0; I.gds.forEach((gd, gi) => { if (gd.d === d) ex += plan.K[gi]; });
    I.partners.forEach((pt, pi) => { if (pt.d === d && plan.y[pi]) ex++; });
    if (day.exBudget != null && ex > day.exBudget) v.push(`EXBUDGET ${day.id}: ${ex} > ${day.exBudget}`);
    if (day.cap12 != null && ex > day.cap12) v.push(`ATHLETE12 ${day.id}: ${ex} > ${day.cap12}`);
  });
  const q1m = credits(I, s1, plan.y, true), q1 = credits(I, s1, plan.y, false), qN = credits(I, sN, plan.y, false);
  const D1 = directs(I, s1, true), DN = directs(I, sN, true), DNall = directs(I, sN, false);
  I.groups.forEach((grp, g) => {
    const own = I.gds.map((gd, gi) => (gd.g === g ? gi : -1)).filter((i) => i >= 0);
    const act = own.filter((gi) => plan.K[gi] > 0);
    if (!plan.z[g]) { if (act.length) v.push(`${grp.id}: active without being trained directly`); return; }
    if (grp.calves) { for (const gi of own) if (I.days[I.gds[gi].d].main && !plan.K[gi]) v.push(`CALF ${grp.id}: no calf exercise on leg day ${I.days[I.gds[gi].d].id}`); }
    else if (!act.some((gi) => I.days[I.gds[gi].d].main)) v.push(`${grp.id}: trained directly but on no main day`);
    for (const gi of own) if (I.gds[gi].home && I.days[I.gds[gi].d].main && !plan.K[gi]) v.push(`WORK ${grp.id}: not trained on ${I.days[I.gds[gi].d].id}, where it holds the day's work lift`);
    if (q1m[g] < 4 * grp.F) v.push(`FLOOR ${grp.id}: ${q1m[g] / 4} < ${grp.F} in week 1`);
    if (DN[g] - D1[g] < grp.mc) v.push(`CLIMB ${grp.id}: ${D1[g]} -> ${DN[g]} is less than +${grp.mc}`);
    if (DN[g] - D1[g] > I.N - 1) v.push(`REACH ${grp.id}: more than one set a week`);
    if (!opt.noLambda && 10000 * qN[g] > I.G10k * q1[g]) v.push(`LAMBDA ${grp.id}: ${q1[g] / 4} -> ${qN[g] / 4} is above the planned growth`);
    if (qN[g] > 4 * grp.C + (I.spill4 ?? 4)) v.push(`CEIL ${grp.id}: ${qN[g] / 4} > ${grp.C} + spill`);
    if (DNall[g] > grp.C) v.push(`CEIL-DIRECT ${grp.id}: ${DNall[g]} > ${grp.C}`);
  });
  I.days.forEach((day, d) => {
    const q = new Array(NG).fill(0);
    I.gds.forEach((gd, gi) => { if (gd.d !== d) return; const x = sN[gi] || []; for (let i = 0; i < x.length; i++) for (let h = 0; h < NG; h++) q[h] += x[i] * (gd.cands[i].cred[h] || 0); });
    I.partners.forEach((pt, pi) => { if (pt.d === d && plan.y[pi]) for (let h = 0; h < NG; h++) q[h] += pt.sets * (pt.cred[h] || 0); });
    if (I.fixedCredDay && I.fixedCredDay[d]) for (let h = 0; h < NG; h++) q[h] += I.fixedCredDay[d][h] || 0;
    I.groups.forEach((grp, g) => { if (plan.z[g] && q[g] > ((opt.session4 && opt.session4[g]) || grp.session4 || 44)) v.push(`SESSION ${grp.id} ${day.id}: ${q[g] / 4} credited sets`); });
  });
  return v;
}
