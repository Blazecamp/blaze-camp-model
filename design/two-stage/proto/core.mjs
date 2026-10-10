// design/two-stage/proto/core.mjs - PROTOTYPE for design/design_two-stage.md (evidence, not engine code).
// The shared definitions of the two-stage planner: units, the staircase (VOL-07), group-day tables, the ONE time function,
// credited tallies, and an evaluator that re-checks every hard row from these definitions (never from the oracle's rows).
// Whole numbers only: time in seconds, credit in quarter sets. No clock, no randomness. Plain JS (Node 22 / browsers).

export const CHANGE = 60;        // changeover per straight exercise, seconds (rules.time_model.changeover_min_per_exercise = 1)
export const CHANGE_PAIR = 30;   // changeover per exercise inside a superset pair (changeover_in_superset_pair = 0.5)

/** sound deterministic generator for the tests (Math.imul: no low bits lost in doubles) */
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0); };
  return { u32: next, int: (n) => next() % n, range: (lo, hi) => lo + (next() % (hi - lo + 1)), pick: (arr) => arr[next() % arr.length] };
}

/**
 * The coach's staircase inside one group-day (VOL-07: 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3): start every exercise at its
 * minimum; each further set goes to the EARLIEST exercise among those with the FEWEST sets that still has room.
 * @param {{lo:number,hi:number}[]} cands exercises in session order  @param {number} K exercises used  @param {number} n sets of the day
 * @returns {number[]|null} sets per exercise (null when n is outside [sum lo, sum hi])
 */
export function staircase(cands, K, n) {
  const x = []; let tot = 0;
  for (let i = 0; i < K; i++) { x.push(cands[i].lo); tot += cands[i].lo; }
  if (n < tot) return null;
  while (tot < n) {
    let best = -1;
    for (let i = 0; i < K; i++) if (x[i] < cands[i].hi && (best < 0 || x[i] < x[best])) best = i;
    if (best < 0) return null;
    x[best]++; tot++;
  }
  return x;
}

/**
 * Build the group-day tables and the state lists of an instance (in place).
 * A group-day state is (K, n1, nN): K exercises (0 = the group does not train that day), n1 sets in week 1, nN sets in the peak week.
 * Epoch 0 = week 1 (its own fixed seconds and exercise-block-1 costs); epoch 1 = every later week (largest fixed seconds of weeks
 * 2..N, RESERVED per-set costs = the largest over the exercise blocks) - see the design, section "epochs".
 */
export function buildTables(I) {
  const NG = I.groups.length;
  for (const gd of I.gds) {
    const grp = I.groups[gd.g];
    const capDay = Math.floor((I.sessionHard4 ?? 56) / 4);        // own sets of a group in one session can never pass the hard limit (14)
    gd.tab = new Map();
    gd.states = [{ K: 0, n1: 0, nN: 0, sec: [0, 0], cred1: new Int16Array(NG), credN: new Int16Array(NG), x1: [], xN: [] }];
    for (const K of gd.Ks) {
      const c = gd.cands.slice(0, K);
      const lo = c.reduce((a, s) => a + s.lo, 0), hi = Math.min(c.reduce((a, s) => a + s.hi, 0), capDay);
      const rows = [];
      for (let n = lo; n <= hi; n++) {
        const x = staircase(gd.cands, K, n);
        const sec = [0, 0], cred = new Int16Array(NG);
        for (let i = 0; i < K; i++) {
          for (let p = 0; p < 2; p++) sec[p] += x[i] * (c[i].work[p] + c[i].rest[p]);
          for (let h = 0; h < NG; h++) cred[h] += x[i] * (c[i].cred[h] || 0);
        }
        sec[0] += K * CHANGE; sec[1] += K * CHANGE;
        rows.push({ n, x, sec, cred });
      }
      gd.tab.set(K, { lo, hi, rows });
      const maxClimb = I.N - 1;
      for (const a of rows) for (const b of rows) {
        if (b.n < a.n || b.n - a.n > maxClimb) continue;
        gd.states.push({ K, n1: a.n, nN: b.n, sec: [a.sec[0], b.sec[1]], cred1: a.cred, credN: b.cred, x1: a.x, xN: b.x });
      }
    }
  }
  return I;
}

/** state of a group-day for given (K, n1, nN) */
export function stateOf(gd, K, n1, nN) {
  if (!K) return gd.states[0];
  for (const s of gd.states) if (s.K === K && s.n1 === n1 && s.nN === nN) return s;
  return null;
}

/** sets per exercise of a group-day at a given total (the staircase), or [] when off */
export function setsAt(gd, K, n) { return K ? staircase(gd.cands, K, n) : []; }

/** cost selectors: epoch p (0 = week 1, 1 = later weeks, reserved costs) or the exercise block of a week */
export const epochSel = (p) => (o) => [o.work[p], o.rest[p]];
export const blockSel = (e) => (o) => (o.blocks ? [o.blocks[Math.min(e, o.blocks.length - 1)].work, o.blocks[Math.min(e, o.blocks.length - 1)].rest] : [o.work[1], o.rest[1]]);
/** exercise block (0-based) of week w (1-based) */
export function blockOfWeek(I, w) { for (let e = 0; e < I.exBlocks.length; e++) if (w >= I.exBlocks[e][0] && w <= I.exBlocks[e][1]) return e; return I.exBlocks.length - 1; }

/**
 * THE time function of one day (seconds), for explicit sets per exercise (DEF-09, one function for every stage).
 * @param I instance  @param d day index  @param sel cost selector (epochSel(p) or blockSel(e))  @param fixedSec fixed seconds of the day
 * @param sets sets[gdIndex] = number[] (sets per active exercise, session order; [] = off)
 * @param partnersOn boolean[] per partner  @param pairsOn boolean[]|null (null = every eligible pair runs as a superset)
 */
export function dayTime(I, d, sel, fixedSec, sets, partnersOn, pairsOn = null) {
  let t = fixedSec;
  I.gds.forEach((gd, gi) => {
    if (gd.d !== d) return;
    const x = sets[gi] || [];
    for (let i = 0; i < x.length; i++) { const [w, r] = sel(gd.cands[i]); t += x[i] * (w + r) + CHANGE; }
  });
  I.partners.forEach((pt, pi) => { if (pt.d === d && partnersOn[pi]) { const [w, r] = sel(pt); t += pt.sets * (w + r) + CHANGE; } });
  I.pairs.forEach((pr, qi) => {
    if (pr.d !== d) return;
    if (pairsOn && !pairsOn[qi]) return;
    t -= pairSaving(I, pr, sel, sets, partnersOn);
  });
  return t;
}
export function daySeconds(I, d, p, sets, partnersOn, pairsOn = null, fixedSec = null) {
  return dayTime(I, d, epochSel(p), fixedSec == null ? I.days[d].fixed[p] : fixedSec, sets, partnersOn, pairsOn);
}

/**
 * Seconds a superset pair saves against two straight exercises (DEF-09 exactly: every round both partners still have, the pair works
 * back to back and rests once, the longer rest; the changeover inside a pair is half): min(sets) x min(rest) + 2 x 30.
 * A pair side is {t:'c', gd, ci} (a candidate exercise), {t:'p', pi} (a pattern partner) or {t:'m', sets, work, rest} (a fixed mate:
 * a class lift or a joint-care item whose own seconds are inside the day's fixed seconds).
 */
export function sideSets(I, sd, sets, partnersOn) {
  if (sd.t === 'c') return (sets[sd.gd] || [])[sd.ci] || 0;
  if (sd.t === 'p') return partnersOn[sd.pi] ? I.partners[sd.pi].sets : 0;
  return sd.sets;
}
export function sideObj(I, sd) { return sd.t === 'c' ? I.gds[sd.gd].cands[sd.ci] : sd.t === 'p' ? I.partners[sd.pi] : sd; }
export function pairSaving(I, pr, sel, sets, partnersOn) {
  const xa = sideSets(I, pr.s1, sets, partnersOn); if (!xa) return 0;
  const xb = sideSets(I, pr.s2, sets, partnersOn); if (!xb) return 0;
  return Math.min(xa, xb) * Math.min(sel(sideObj(I, pr.s1))[1], sel(sideObj(I, pr.s2))[1]) + 2 * (CHANGE - CHANGE_PAIR);
}

/** credited quarter sets of every group for explicit sets (all days, or main days only) */
export function credits(I, sets, partnersOn, mainOnly = false, fixedCred = null) {
  const NG = I.groups.length, q = new Array(NG).fill(0);
  I.gds.forEach((gd, gi) => {
    if (mainOnly && !I.days[gd.d].main) return;
    const x = sets[gi] || [];
    for (let i = 0; i < x.length; i++) for (let h = 0; h < NG; h++) q[h] += x[i] * (gd.cands[i].cred[h] || 0);
  });
  I.partners.forEach((pt, pi) => { if (partnersOn[pi] && (!mainOnly || I.days[pt.d].main)) for (let h = 0; h < NG; h++) q[h] += pt.sets * (pt.cred[h] || 0); });
  const fc = fixedCred || I.fixedCred || null;                       // class lifts and other fixed resistance items (main days)
  if (fc) for (let h = 0; h < NG; h++) q[h] += fc[h] || 0;
  return q;
}

/** direct sets of every group (sets of its own exercises) for explicit sets */
export function directs(I, sets, mainOnly = false) {
  const D = new Array(I.groups.length).fill(0);
  I.gds.forEach((gd, gi) => { if (mainOnly && !I.days[gd.d].main) return; for (const v of (sets[gi] || [])) D[gd.g] += v; });
  return D;
}

/** total resistance sets of a week for explicit sets (constant partner and fixed sets included) */
export function totalSets(I, sets, partnersOn) {
  let t = I.fixedSets || 0;
  for (const x of sets) if (x) for (const v of x) t += v;
  I.partners.forEach((pt, pi) => { if (partnersOn[pi]) t += pt.sets; });
  return t;
}

/** planned growth G(N) in ten-thousandths: 3 % a week to the halfway week, 5 % after it (DEF-10); multiplication only */
export function growth10k(N, early = 300, late = 500) {
  const h = Math.ceil(N / 2); let num = 1;
  for (let w = 2; w <= N; w++) num *= (1 + (w <= h ? early : late) / 10000);
  return Math.floor(num * 10000 + 1e-6);
}

/**
 * Evaluator: every hard row of the ENDPOINT model, re-computed from the definitions.
 * plan = { z: boolean[] (group trained directly), K: number[] per group-day, n1: number[], nN: number[], y: boolean[] per partner }
 * @returns {string[]} violations (empty = the two endpoint weeks are legal)
 */
export function checkEndpoints(I, plan, opt = {}) {
  const v = [];
  const NG = I.groups.length;
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
  // partners: only beside an active host exercise, only for a group that is not trained directly, at most one per group, 3 a week
  let np = 0; const perG = new Array(NG).fill(0);
  I.partners.forEach((pt, pi) => {
    if (!plan.y[pi]) return; np++; perG[pt.g]++;
    if (plan.z[pt.g]) v.push(`PARTNER ${pt.id}: its group is trained directly`);
    if (pt.host && !(plan.K[pt.host[0]] > pt.host[1])) v.push(`PARTNER ${pt.id}: host exercise is not active`);
  });
  if (np > (I.maxPartners ?? 3)) v.push('PARTNER: more than the weekly maximum');
  perG.forEach((c, g) => { if (c > 1) v.push(`PARTNER: two pattern exercises for ${I.groups[g].id}`); });
  // time: both epochs, every pair supersetted
  I.days.forEach((day, d) => {
    for (let p = 0; p < 2; p++) {
      const t = daySeconds(I, d, p, p === 0 ? s1 : sN, plan.y);
      if (t > day.limit[p]) v.push(`TIME ${day.id} epoch ${p}: ${t} s > ${day.limit[p]} s`);
    }
    let ex = 0; I.gds.forEach((gd, gi) => { if (gd.d === d) ex += plan.K[gi]; });
    I.partners.forEach((pt, pi) => { if (pt.d === d && plan.y[pi]) ex++; });
    if (day.exBudget != null && ex > day.exBudget) v.push(`EXBUDGET ${day.id}: ${ex} > ${day.exBudget}`);
    if (day.cap12 != null && ex > day.cap12) v.push(`ATHLETE12 ${day.id}: ${ex} > ${day.cap12}`);
  });
  const q1m = credits(I, s1, plan.y, true), qNm = credits(I, sN, plan.y, true);
  const q1 = credits(I, s1, plan.y, false), qN = credits(I, sN, plan.y, false);
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
  // per-session credited ceiling (11; Focus 14) at the peak
  I.days.forEach((day, d) => {
    const q = new Array(NG).fill(0);
    I.gds.forEach((gd, gi) => { if (gd.d !== d) return; const x = sN[gi] || []; for (let i = 0; i < x.length; i++) for (let h = 0; h < NG; h++) q[h] += x[i] * (gd.cands[i].cred[h] || 0); });
    I.partners.forEach((pt, pi) => { if (pt.d === d && plan.y[pi]) for (let h = 0; h < NG; h++) q[h] += pt.sets * (pt.cred[h] || 0); });
    if (I.fixedCredDay && I.fixedCredDay[d]) for (let h = 0; h < NG; h++) q[h] += I.fixedCredDay[d][h] || 0;
    I.groups.forEach((grp, g) => { if (plan.z[g] && q[g] > ((opt.session4 && opt.session4[g]) || grp.session4 || 44)) v.push(`SESSION ${grp.id} ${day.id}: ${q[g] / 4} credited sets`); });
  });
  return v;
}
