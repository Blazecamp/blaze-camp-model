// design/spec_proto/reduced.mjs - SPEC PROTOTYPE (evidence for design/PLANNER_SPEC.md, not engine code).
//
// The "reduced model" of the planner spec. Once the coach's VOL-07 staircase is taken as the definition of how a group's sets sit
// on a day (the balanced vector 2/2/2 -> 3/2/2 -> 3/3/2 ...), the unknowns of the dosing problem are, per candidate group-day,
//   act  - is the group trained on that day (0 / 1)
//   n1   - its whole sets on that day in the first week          (lo .. hi when act = 1)
//   nN   - its whole sets on that day in the peak week           (n1 <= nN)
// and every rule is a MONOTONE row on those numbers:
//   packing rows (never more than): day minutes at each endpoint week, per-session credited ceiling, group ceiling, athlete 12
//   covering rows (at least):       credited floor in the first week, minimum climb, "a trained group trains on a day"
// This file implements
//   prep(I, opt)             instance (design/research/proto_endpoint.mjs buildInstance) -> whole-number tables
//   fit(P, states, budget)   the exact three-valued feasibility oracle: integer-only bounds propagation on the monotone rows,
//                            day-subset ("Hall") cuts, depth-first search; feasible (witness + certificate) / infeasible / unknown
//   select(P, budget)        R3-SES-02 step 2: lexicographic keep order; "construct first" (extend the last witness), then prove
// Integer arithmetic only. No clock, no randomness. Node counts are deterministic.
import fs from 'node:fs';

const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TM = R.time_model;
export const Q = 2000;                               // time unit = 1/2000 min (the research prototype's unit); Q / 2 is whole

const balanced = (n, K) => { const q = Math.floor(n / K), r = n - q * K; const x = new Array(K); for (let i = 0; i < K; i++) x[i] = q + (i < r ? 1 : 0); return x; };

/**
 * @param I   instance from buildInstance (days, slots with cost / credit / min / max / ss tag, S, C, floor, keepOrder)
 * @param opt {pairMode: 'factor' (research: a paired set costs x 0.65) | 'rest' (DEF-09: a pair shares the shorter rest),
 *             fit: day fit factor, minutes, noSingle: a trained group-day needs 2+ exercises (calves 1), hall: day-subset cuts,
 *             credCeil: extra quarter sets the credited peak may sit above the ceiling (null = direct ceiling only, as the research)}
 */
export function prep(I, opt = {}) {
  const pairMode = opt.pairMode || 'factor';
  const fit = opt.fit ?? R.session.time_fit.fit_factor;
  const minutes = opt.minutes ?? I.o.minutes;
  const groups = I.o.keepOrder.filter((g) => I.present.includes(g));
  const G = groups.length, gidx = Object.fromEntries(groups.map((g, i) => [g, i]));
  const focus = I.o.focus || [];
  const days = I.days.map((d, di) => ({ di, wd: d.wd, athCount: d.athCount,
    cap: [Math.floor(Q * (minutes * fit - d.fixed - d.athMin)), Math.floor(Q * (minutes * fit - d.fixed - d.athMin * (I.o.athleticPeak || 1)))],
    groupsOnDay: groups.filter((g) => d.slots.some((s) => s.group === g)).map((g) => gidx[g]) }));
  const GD = [];                                     // candidate group-days (with opt.kChoice: one variant per exercise count K)
  const fam = [];                                    // variants of the same group-day: at most one is on
  for (const g of groups) I.days.forEach((d, di) => {
    const all = d.slots.filter((s) => s.group === g);
    if (!all.length) return;
    if (opt.noSingle && g !== 'calves' && all.length < 2) return;
    const calf = all.every((s) => s.bucket === 'ISO_CALF');
    const Ks = opt.kChoice && !calf ? Array.from({ length: Math.min(4, all.length) - (opt.noSingle ? 2 : 1) + 1 }, (_, k) => k + (opt.noSingle ? 2 : 1)) : [all.length];
    const family = [];
    for (const K of Ks) {
      const ss = all.slice(0, K), lo = ss.reduce((a, s) => a + s.min, 0), top = ss.reduce((a, s) => a + s.max, 0);
      const x = [], cost = [], cred = []; let hi = lo - 1;
      for (let n = lo; n <= top; n++) {
        const v = balanced(n, K);
        if (!v.every((u, i) => u >= ss[i].min && u <= ss[i].max)) break;
        x[n] = v; hi = n;
        cost[n] = v.reduce((a, u, i) => a + Math.round(Q * ss[i].cost) * u, 0) + Q * K;      // sets + one changeover per exercise
        const c = new Array(G).fill(0); v.forEach((u, i) => { for (const [h, q] of Object.entries(ss[i].cr)) if (gidx[h] !== undefined) c[gidx[h]] += q * u; });
        cred[n] = c;
      }
      if (hi < lo) continue;
      const rest = ss.map((s) => Math.round(Q * TM.rest_class_minutes[TM.rest_class_by_time_class[s.tc]]));
      GD.push({ id: GD.length, g, gi: gidx[g], di, ss, K, lo, hi, x, cost, cred, rest, links: [], fam: fam.length });
      family.push(GD.length - 1);
    }
    if (family.length) fam.push(family);
  });
  const variantsOf = (g, di) => GD.filter((a) => a.g === g && a.di === di);
  const gdOf = (g, di) => variantsOf(g, di)[0];
  // superset pairs of a day: two slots with the same tag in different groups (the research rule)
  I.days.forEach((d, di) => {
    const tags = {}; d.slots.forEach((s) => { if (s.ss) (tags[s.ss] = tags[s.ss] || []).push(s); });
    for (const a of Object.values(tags)) {
      if (a.length !== 2 || a[0].group === a[1].group) continue;
      const VA = variantsOf(a[0].group, di).filter((v) => v.ss.includes(a[0])), VB = variantsOf(a[1].group, di).filter((v) => v.ss.includes(a[1]));
      if (!VA.length || !VB.length) continue;
      for (const [V, W, sa, sb] of [[VA, VB, a[0], a[1]], [VB, VA, a[1], a[0]]]) for (const v of V) {
        const ia = v.ss.indexOf(sa), ib = W[0].ss.indexOf(sb), shared = Math.min(v.rest[ia], W[0].rest[ib]);
        v.links.push({ me: ia, others: W.map((w) => w.id), otherSlot: ib, save: pairMode === 'factor' ? Math.round(Q * 0.35 * sa.cost) : shared });
      }
    }
  });
  const cands = groups.map((g, h) => GD.filter((a) => a.gi === h).map((a) => a.id));
  const byDay = days.map((d) => GD.filter((a) => a.di === d.di).map((a) => a.id));
  const mc = groups.map((g) => (g === 'calves' ? 1 : 2));
  const floor4 = groups.map((g) => 4 * I.floor(g));
  const ceil = groups.map((g) => I.C[g]);
  const sess = groups.map((g) => (focus.includes(g) ? 56 : 44));
  const helps = groups.map((_, k) => groups.map((_, h) => k !== h && cands[k].some((id) => GD[id].cred[GD[id].hi][h] > 0)));
  // interchangeable day pairs: identical slot lists (bucket, group, bounds, cost, tag) and identical capacity and athletic count
  const sig = I.days.map((d, di) => JSON.stringify([d.slots.map((s) => [s.bucket, s.group, s.min, s.max, s.cost, s.ss]), days[di].cap, d.athCount]));
  const sym = [], symFam = [], used = new Set();
  for (let a = 0; a < days.length; a++) for (let b = a + 1; b < days.length; b++) {
    if (used.has(a) || used.has(b) || sig[a] !== sig[b]) continue;
    const first = GD.find((x) => x.di === a && gdOf(x.g, b)); if (!first) continue;
    sym.push([first.id, gdOf(first.g, b).id]); used.add(a); used.add(b);                   // (only used without K variants)
    symFam.push([first.fam, gdOf(first.g, b).fam]);
  }
  return { I, opt, pairMode, groups, G, gidx, days, GD, fam, gdOf, variantsOf, cands, byDay, mc, floor4, ceil, sess, helps, sym: opt.symmetry === false || opt.kChoice ? [] : sym, symFam: opt.symmetry === false || !opt.kChoice ? [] : symFam, athleteCap: I.athlete ? R.session.athlete_cap : null };
}

// ----------------------------------------------------------------------------------------------- state
// act: 0 off, 1 on, 2 undecided. gs (group state): 0 off, 1 on (must hold its minimums), 2 free (later in the keep order).
function newState(P, gs) {
  const m = P.GD.length;
  const s = { act: new Int8Array(m).fill(2), lo1: new Int16Array(m), hi1: new Int16Array(m), loN: new Int16Array(m), hiN: new Int16Array(m), gs: Int8Array.from(gs) };
  P.GD.forEach((a, i) => { s.lo1[i] = s.loN[i] = a.lo; s.hi1[i] = s.hiN[i] = a.hi; if (gs[a.gi] === 0) s.act[i] = 0; });
  return s;
}
const clone = (s) => ({ act: s.act.slice(), lo1: s.lo1.slice(), hi1: s.hi1.slice(), loN: s.loN.slice(), hiN: s.hiN.slice(), gs: s.gs.slice(), sym: s.sym });

/** lowest possible minutes units of group-day i at n sets (a pair counts as running whenever the partner may still be on) */
function netLow(P, s, i, n) {
  const a = P.GD[i]; let t = a.cost[n];
  for (const l of a.links) {
    let top = -1; for (const o of l.others) if (s.act[o] !== 0) top = Math.max(top, P.GD[o].x[Math.max(s.hiN[o], P.GD[o].lo)][l.otherSlot]);
    if (top < 0) continue;                                                // no partner variant can still be on
    if (P.pairMode === 'factor') t -= Q / 2 + l.save * a.x[n][l.me];
    // 'rest': the pair saves one shared rest per shared round = save x min(sets a, sets b) <= save x (a + b) / 2, and never more
    // than the partner can still reach; each partner carries half of the bound (whole numbers: rests are multiples of 2 units)
    else t -= Q / 2 + (l.save / 2) * Math.min(a.x[n][l.me], top);
  }
  return t;
}
/** exact minutes units of a day for fixed sets (act in {0,1} everywhere on that day) at endpoint e (0 = week 1, 1 = peak) */
function dayExact(P, s, d, e) {
  let t = 0;
  for (const i of P.byDay[d]) {
    if (s.act[i] !== 1) continue;
    const a = P.GD[i], n = e ? s.loN[i] : s.lo1[i]; t += a.cost[n];
    for (const l of a.links) {
      const o = l.others.find((k) => s.act[k] === 1); if (o === undefined) continue;
      const b = P.GD[o], nb = e ? s.loN[o] : s.lo1[o];
      if (P.pairMode === 'factor') t -= Q / 2 + l.save * a.x[n][l.me];
      else if (i < o) t -= Q + l.save * Math.min(a.x[n][l.me], b.x[nb][l.otherSlot]);      // one shared rest per shared round
    }
  }
  return t;
}

/**
 * Bounds propagation to a fixpoint on the monotone rows. Returns false on a proven conflict (never a guess: every test is a
 * comparison of whole numbers that holds for EVERY completion of the current bounds).
 */
function propagate(P, s, stats) {
  const { GD, G } = P, m = GD.length;
  for (let guard = 0; guard < 100000; guard++) {
    let ch = false;
    // a free group with a group-day forced on is on; an off group has no group-day
    for (let i = 0; i < m; i++) {
      const h = GD[i].gi;
      if (s.gs[h] === 0 && s.act[i] !== 0) { if (s.act[i] === 1) return false; s.act[i] = 0; ch = true; }
      if (s.act[i] === 1 && s.gs[h] === 2) { s.gs[h] = 1; ch = true; }
      if (s.act[i] !== 0) {
        if (s.loN[i] < s.lo1[i]) { s.loN[i] = s.lo1[i]; ch = true; }
        if (s.hi1[i] > s.hiN[i]) { s.hi1[i] = s.hiN[i]; ch = true; }
        if (s.lo1[i] > s.hi1[i] || s.loN[i] > s.hiN[i]) { if (s.act[i] === 1) return false; s.act[i] = 0; ch = true; }
      }
    }
    // a group-day runs with one exercise count: one variant on switches its siblings off
    if (P.opt.kChoice) for (const f of P.fam) {
      if (f.length < 2) continue;
      let on = -1; for (const i of f) if (s.act[i] === 1) { if (on >= 0) return false; on = i; }
      if (on >= 0) for (const i of f) if (i !== on && s.act[i] === 2) { s.act[i] = 0; ch = true; }
    }
    // symmetry: two interchangeable days (same slots, same capacity) - the earlier one carries at least as much of the
    // designated group in week 1 (any plan can be mirrored, so nothing is lost; off when group-days are pinned)
    if (s.sym) for (const [i, j] of P.sym) {
      if (s.act[j] === 1 && s.act[i] === 2) { s.act[i] = 1; ch = true; }
      if (s.act[i] === 0 && s.act[j] === 2) { s.act[j] = 0; ch = true; }
      if (s.act[i] === 0 && s.act[j] === 1) return false;
      if (s.act[i] !== 0 && s.act[j] !== 0) {
        if (s.act[j] === 1 && s.lo1[i] < s.lo1[j]) { s.lo1[i] = s.lo1[j]; ch = true; }
        if (s.act[i] === 1 && s.hi1[j] > s.hi1[i]) { s.hi1[j] = s.hi1[i]; ch = true; }
      }
    }
    // the same symmetry with exercise-count variants, on the week-1 sets of the designated group-day (0 when it is off)
    if (s.sym) for (const [fa, fb] of P.symFam) {
      let ubA = 0, anyA = false, onB = -1; for (const i of P.fam[fa]) if (s.act[i] !== 0) { anyA = true; ubA = Math.max(ubA, s.hi1[i]); }
      for (const j of P.fam[fb]) {
        if (s.act[j] === 0) continue;
        if (!anyA || s.lo1[j] > ubA) { if (s.act[j] === 1) return false; s.act[j] = 0; ch = true; continue; }
        if (s.hi1[j] > ubA) { s.hi1[j] = ubA; ch = true; }
        if (s.act[j] === 1) onB = j;
      }
      if (onB >= 0) {                                                     // the later day is on with at least lo1 sets: so is the earlier
        const alive = P.fam[fa].filter((i) => s.act[i] !== 0 && s.hi1[i] >= s.lo1[onB]);
        for (const i of P.fam[fa]) if (s.act[i] !== 0 && !alive.includes(i)) { if (s.act[i] === 1) return false; s.act[i] = 0; ch = true; }
        if (!alive.length) return false;
        if (alive.length === 1 && s.act[alive[0]] === 2) { s.act[alive[0]] = 1; ch = true; }
        for (const i of alive) if (s.lo1[i] < s.lo1[onB] && alive.length === 1) { s.lo1[i] = s.lo1[onB]; ch = true; }
      }
    }
    for (let d = 0; d < P.days.length; d++) {
      const idx = P.byDay[d]; if (!idx.length) continue;
      // packing: athlete cap on the exercises of the day
      if (P.athleteCap !== null) {
        const capK = P.athleteCap - P.days[d].athCount; let k = 0; for (const i of idx) if (s.act[i] === 1) k += GD[i].K;
        if (k > capK) return false;
        for (const i of idx) if (s.act[i] === 2 && GD[i].K > capK - k) { s.act[i] = 0; ch = true; }
      }
      for (let e = 0; e < 2; e++) {
        const lo = e ? s.loN : s.lo1, hi = e ? s.hiN : s.hi1, cap = P.days[d].cap[e];
        // packing: day minutes (lower bounds: undecided group-days cost nothing, pairs run whenever they still can)
        let minSum = 0; for (const i of idx) if (s.act[i] === 1) minSum += netLow(P, s, i, lo[i]);
        if (minSum > cap) return false;
        for (const i of idx) {
          if (s.act[i] === 1) { const slack = cap - (minSum - netLow(P, s, i, lo[i])); while (hi[i] > lo[i] && netLow(P, s, i, hi[i]) > slack) { hi[i]--; ch = true; } }
          else if (s.act[i] === 2 && netLow(P, s, i, lo[i]) > cap - minSum) { s.act[i] = 0; ch = true; }
        }
        // packing: per-session credited ceiling for every group with slots on this day
        for (const h of P.days[d].groupsOnDay) {
          const capS = P.sess[h]; let c = 0; for (const i of idx) if (s.act[i] === 1) c += GD[i].cred[lo[i]][h];
          if (c > capS) return false;
          for (const i of idx) {
            if (s.act[i] === 0 || !GD[i].cred[hi[i]][h]) continue;
            if (s.act[i] === 1) { const slack = capS - (c - GD[i].cred[lo[i]][h]); while (hi[i] > lo[i] && GD[i].cred[hi[i]][h] > slack) { hi[i]--; ch = true; } }
            else if (GD[i].cred[lo[i]][h] > capS - c) { s.act[i] = 0; ch = true; }
          }
        }
      }
    }
    for (let h = 0; h < G; h++) {
      const own = P.cands[h];
      // packing: group ceiling on direct peak sets (and, when asked, on credited peak sets)
      let sN = 0; for (const i of own) if (s.act[i] === 1) sN += s.loN[i];
      if (sN > P.ceil[h]) return false;
      for (const i of own) {
        if (s.act[i] === 1) { const cap = P.ceil[h] - (sN - s.loN[i]); if (s.hiN[i] > cap) { s.hiN[i] = cap; ch = true; if (s.hiN[i] < s.loN[i]) return false; } }
        else if (s.act[i] === 2 && s.loN[i] > P.ceil[h] - sN) { s.act[i] = 0; ch = true; }
      }
      if (P.opt.credCeil != null && s.gs[h] === 1) {
        const capC = 4 * P.ceil[h] + P.opt.credCeil; let c = 0; for (let i = 0; i < m; i++) if (s.act[i] === 1) c += GD[i].cred[s.loN[i]][h];
        if (c > capC) return false;
        for (let i = 0; i < m; i++) {
          if (s.act[i] === 0 || !GD[i].cred[s.hiN[i]][h]) continue;
          if (s.act[i] === 1) { const slack = capC - (c - GD[i].cred[s.loN[i]][h]); while (s.hiN[i] > s.loN[i] && GD[i].cred[s.hiN[i]][h] > slack) { s.hiN[i]--; ch = true; } }
          else if (GD[i].cred[s.loN[i]][h] > capC - c) { s.act[i] = 0; ch = true; }
        }
      }
      if (s.gs[h] !== 1) continue;
      // covering: credited floor in the first week (every group-day that may still be on counts at its upper bound)
      let mx = 0; for (let i = 0; i < m; i++) if (s.act[i] !== 0) mx += GD[i].cred[s.hi1[i]][h];
      if (mx < P.floor4[h]) return false;
      for (let i = 0; i < m; i++) {
        if (s.act[i] === 0) continue;
        const c = GD[i].cred, top = c[s.hi1[i]][h]; if (!top) continue;
        const need = P.floor4[h] - (mx - top); if (need <= 0) continue;
        if (s.act[i] === 2) { s.act[i] = 1; ch = true; }
        while (s.lo1[i] < s.hi1[i] && c[s.lo1[i]][h] < need) { s.lo1[i]++; ch = true; }
        if (c[s.lo1[i]][h] < need) return false;
      }
      // covering: minimum climb on direct sets, summed over the group's days
      let tot = 0; for (const i of own) if (s.act[i] !== 0) tot += s.hiN[i] - s.lo1[i];
      if (tot < P.mc[h]) return false;
      for (const i of own) {
        if (s.act[i] === 0) continue;
        const need = P.mc[h] - (tot - (s.hiN[i] - s.lo1[i])); if (need <= 0) continue;
        if (s.act[i] === 2) { s.act[i] = 1; ch = true; }
        if (s.loN[i] < s.lo1[i] + need) { s.loN[i] = s.lo1[i] + need; ch = true; if (s.loN[i] > s.hiN[i]) return false; }
        if (s.hi1[i] > s.hiN[i] - need) { s.hi1[i] = s.hiN[i] - need; ch = true; if (s.hi1[i] < s.lo1[i]) return false; }
      }
      // dominance (exact for a yes / no question): a plan that exists also exists with the peak exactly `min climb` above week 1,
      // because taking a peak set away keeps every packing row and no covering row reads the peak beyond the climb
      if (P.opt.dominance !== false) {
        let minD = 0; for (const i of own) if (s.act[i] === 1) minD += Math.max(0, s.loN[i] - s.hi1[i]);
        if (minD > P.mc[h]) return false;
        for (const i of own) {
          if (s.act[i] === 0) continue;
          const capD = P.mc[h] - (minD - (s.act[i] === 1 ? Math.max(0, s.loN[i] - s.hi1[i]) : 0));
          if (s.hiN[i] > s.hi1[i] + capD) { s.hiN[i] = s.hi1[i] + capD; ch = true; if (s.hiN[i] < s.loN[i]) { if (s.act[i] === 1) return false; s.act[i] = 0; } }
          if (s.act[i] !== 0 && s.lo1[i] < s.loN[i] - capD) { s.lo1[i] = s.loN[i] - capD; ch = true; if (s.lo1[i] > s.hi1[i]) { if (s.act[i] === 1) return false; s.act[i] = 0; } }
        }
      }
    }
    if (!ch) {
      if (P.opt.hall && !hallOk(P, s)) { if (stats) stats.hall++; return false; }
      return true;
    }
  }
  throw new Error('propagate: no fixpoint');
}

/**
 * Day-subset cuts (a Hall-type necessary condition in whole numbers). For every set D' of days: the minutes D' must hold at the
 * least = the lower-bound minutes of what is already on in D' + for every group that can only train inside D' the sets it still
 * owes (floor, climb) at its cheapest marginal minutes. More than the capacity of D' means no completion exists.
 */
function hallOk(P, s) {
  const { GD, G } = P, nd = P.days.length; if (nd > 6) return true;
  const owe1 = new Int32Array(G), oweN = new Int32Array(G), mask = new Int32Array(G), extra = [new Float64Array(G), new Float64Array(G)];
  for (let h = 0; h < G; h++) {
    if (s.gs[h] !== 1) continue;
    let help = 0, ownLo = 0, lo1 = 0, loN = 0, perSet = 1;
    for (let i = 0; i < GD.length; i++) {
      if (s.act[i] === 0) continue;
      const a = GD[i];
      if (a.gi !== h) { help += a.cred[s.hi1[i]][h]; continue; }
      mask[h] |= 1 << a.di;
      if (s.act[i] === 1) { ownLo += a.cred[s.lo1[i]][h]; lo1 += s.lo1[i]; loN += s.loN[i]; }
      for (let n = a.lo; n < a.hi; n++) perSet = Math.max(perSet, a.cred[n + 1][h] - a.cred[n][h]);
      perSet = Math.max(perSet, Math.ceil(a.cred[a.lo][h] / a.lo));
    }
    owe1[h] = Math.max(0, Math.ceil((P.floor4[h] - help - ownLo) / perSet));
    oweN[h] = Math.max(0, lo1 + owe1[h] + P.mc[h] - loN);
    // the cheapest minutes at which this group can add k more sets on the days it may still use (exact small knapsack)
    for (let e = 0; e < 2; e++) {
      const k = e ? oweN[h] : owe1[h]; if (!k) { extra[e][h] = 0; continue; }
      let dp = new Array(k + 1).fill(Infinity); dp[0] = 0;
      for (const i of P.cands[h]) {
        if (s.act[i] === 0) continue;
        const a = GD[i], base = s.act[i] === 1 ? (e ? s.loN[i] : s.lo1[i]) : 0, hiI = e ? s.hiN[i] : s.hi1[i];
        const b0 = base ? netLow(P, s, i, base) : 0, nd2 = dp.slice();
        for (let n = Math.max(base + 1, a.lo); n <= hiI; n++) { const add = n - base, c = netLow(P, s, i, n) - b0; for (let t = 0; t <= k; t++) { if (dp[t] === Infinity) continue; const u = Math.min(k, t + add); if (dp[t] + c < nd2[u]) nd2[u] = dp[t] + c; } }
        dp = nd2;
      }
      if (dp[k] === Infinity) return false;                      // the group cannot add the sets it owes at all
      extra[e][h] = dp[k];
    }
  }
  const use = [new Int32Array(nd), new Int32Array(nd)];
  for (let d = 0; d < nd; d++) for (let e = 0; e < 2; e++) { let t = 0; for (const i of P.byDay[d]) if (s.act[i] === 1) t += netLow(P, s, i, e ? s.loN[i] : s.lo1[i]); use[e][d] = t; }
  for (let S = 1; S < (1 << nd); S++) {
    let c1 = 0, cN = 0, u1 = 0, uN = 0;
    for (let d = 0; d < nd; d++) if (S >> d & 1) { c1 += P.days[d].cap[0]; cN += P.days[d].cap[1]; u1 += use[0][d]; uN += use[1][d]; }
    for (let h = 0; h < G; h++) if (mask[h] && (mask[h] & ~S) === 0) { u1 += extra[0][h]; uN += extra[1][h]; }
    if (u1 > c1 || uN > cN) return false;
  }
  return true;
}

/** exact check of a complete assignment: the certificate of a 'feasible' verdict (independent of the propagation code path) */
export function certify(P, w) {
  const { GD, G } = P, s = { act: Int8Array.from(GD.map((a) => (w.n1[a.id] !== undefined ? 1 : 0))), lo1: Int16Array.from(GD.map((a) => w.n1[a.id] ?? 0)), loN: Int16Array.from(GD.map((a) => w.nN[a.id] ?? 0)) };
  for (let i = 0; i < GD.length; i++) if (s.act[i] && !(s.lo1[i] >= GD[i].lo && s.loN[i] <= GD[i].hi && s.lo1[i] <= s.loN[i])) return 'bounds';
  for (let d = 0; d < P.days.length; d++) {
    for (let e = 0; e < 2; e++) {
      if (dayExact(P, s, d, e) > P.days[d].cap[e]) return `time ${e ? 'peak' : 'week 1'} ${P.days[d].wd}`;
      for (const h of P.days[d].groupsOnDay) { let c = 0; for (const i of P.byDay[d]) if (s.act[i]) c += GD[i].cred[e ? s.loN[i] : s.lo1[i]][h]; if (c > P.sess[h]) return 'session ' + P.groups[h]; }
    }
    if (P.athleteCap !== null && P.byDay[d].reduce((a, i) => a + (s.act[i] ? GD[i].K : 0), 0) > P.athleteCap - P.days[d].athCount) return 'athlete cap';
  }
  for (let h = 0; h < G; h++) {
    let sN = 0, s1 = 0, any = false; for (const i of P.cands[h]) if (s.act[i]) { sN += s.loN[i]; s1 += s.lo1[i]; any = true; }
    if (sN > P.ceil[h]) return 'ceiling ' + P.groups[h];
    if (any !== w.on.has(h)) return 'state ' + P.groups[h];
    if (!any) continue;
    let c1 = 0, cN = 0; for (let i = 0; i < GD.length; i++) if (s.act[i]) { c1 += GD[i].cred[s.lo1[i]][h]; cN += GD[i].cred[s.loN[i]][h]; }
    if (c1 < P.floor4[h]) return 'floor ' + P.groups[h];
    if (P.opt.credCeil != null && cN > 4 * P.ceil[h] + P.opt.credCeil) return 'credited ceiling ' + P.groups[h];
    if (sN - s1 < P.mc[h]) return 'climb ' + P.groups[h];
  }
  return null;
}

/**
 * The exact oracle. states[h] in {'on','off','free'} per group in the keep order. 'free' groups (later in the keep order) may be
 * trained or not ("others free": helper credit from a later group may be what lets an earlier one hold its floor).
 * pin: optional Map GD id -> 0 | 1 (group-days taken as given: the "extend the last witness" question).
 */
export function fit(P, states, budget = 200000, pin = null, strategy = null) {
  const ctx = { nodes: 0, budget, out: false, hall: 0 };
  // "others free", made cheap and kept exact: a free group can only help a mandatory group through helper credit (its own sets
  // cost minutes, and a pair partner saves less than that group's own minimum sets cost). A free group that cannot credit a
  // mandatory group - directly or through other free groups - is switched off for this question.
  const st = states.slice();
  const useful = new Set(st.map((x, h) => (x === 'on' ? h : -1)).filter((h) => h >= 0));
  for (let grew = true; grew;) { grew = false; for (let k = 0; k < P.G; k++) if (st[k] === 'free' && !useful.has(k) && [...useful].some((h) => P.helps[k][h])) { useful.add(k); grew = true; } }
  const s0 = newState(P, st.map((x, k) => (x === 'on' ? 1 : x === 'free' && useful.has(k) ? 2 : 0)));
  if (pin) for (const [id, v] of pin) s0.act[id] = v;
  s0.sym = !pin;
  // Strategy S ("structure first"): free groups, then every group's days in keep order (on first), then week-1 sets, then peak
  // sets, each value from the smallest up. Strong on "the minutes cannot hold it" proofs (the day-subset cuts see the whole
  // structure early).
  const recStruct = (s) => {
    if (++ctx.nodes > ctx.budget) { ctx.out = true; return null; }
    if (!propagate(P, s, ctx)) return null;
    for (let h = 0; h < P.G; h++) if (s.gs[h] === 2) {
      for (const v of [0, 1]) { const c = clone(s); c.gs[h] = v; if (v === 0) for (const i of P.cands[h]) c.act[i] = 0; const r = recStruct(c); if (r || ctx.out) return r; }
      return null;
    }
    for (let h = 0; h < P.G; h++) {
      if (s.gs[h] !== 1) continue;
      for (const i of P.cands[h]) if (s.act[i] === 2) { for (const v of [1, 0]) { const c = clone(s); c.act[i] = v; const r = recStruct(c); if (r || ctx.out) return r; } return null; }
    }
    for (const [lo, hi, k] of [[s.lo1, s.hi1, 1], [s.loN, s.hiN, 2]]) for (let h = 0; h < P.G; h++) {
      if (s.gs[h] !== 1) continue;
      for (const i of P.cands[h]) if (s.act[i] === 1 && lo[i] < hi[i]) {
        for (let v = lo[i]; v <= hi[i]; v++) { const c = clone(s); if (k === 1) c.lo1[i] = c.hi1[i] = v; else c.loN[i] = c.hiN[i] = v; const r = recStruct(c); if (r || ctx.out) return r; }
        return null;
      }
    }
    for (let d = 0; d < P.days.length; d++) for (let e = 0; e < 2; e++) if (dayExact(P, s, d, e) > P.days[d].cap[e]) return null;
    return s;
  };
  // Strategy R below ("repair from the least vector") is strong where a floor hangs on helper credit.
  // Search = "repair from the least vector". After propagation the vector of lower bounds (undecided group-days off) satisfies
  // every packing row that can be satisfied at all (minutes are monotone in every set count). If it also satisfies every covering
  // row it IS a plan. Otherwise one covering row is short: branch on one variable that can lift it (raise it by one set / switch
  // the group-day on) against "this variable stays where it is". Variables that no short row needs are never branched on, and
  // the first dive is a greedy construction (own sets first, the day that is behind first).
  const recRepair = (s) => {
    if (++ctx.nodes > ctx.budget) { ctx.out = true; return null; }
    if (!propagate(P, s, ctx)) return null;
    for (let h = 0; h < P.G; h++) if (s.gs[h] === 2) {
      for (const v of [0, 1]) { const c = clone(s); c.gs[h] = v; if (v === 0) for (const i of P.cands[h]) c.act[i] = 0; const r = recRepair(c); if (r || ctx.out) return r; }
      return null;
    }
    const split = (i, kind) => {                     // kind: 'act' | 1 (week-1 sets) | 2 (peak sets)
      const alts = [];
      if (kind === 'act') { for (const v of [1, 0]) { const c = clone(s); c.act[i] = v; alts.push(c); } }
      else if (kind === 1) { const c = clone(s); c.lo1[i]++; alts.push(c); const e = clone(s); e.hi1[i] = e.lo1[i]; alts.push(e); }
      else { const c = clone(s); c.loN[i]++; alts.push(c); const e = clone(s); e.hiN[i] = e.loN[i]; alts.push(e); }
      for (const c of alts) { const r = recRepair(c); if (r || ctx.out) return r; }
      return null;
    };
    // exact minutes of the least vector (pairs with an undecided partner do not run)
    const t = { act: Int8Array.from(s.act, (v) => (v === 1 ? 1 : 0)), lo1: s.lo1, loN: s.loN };
    for (let d = 0; d < P.days.length; d++) for (let e = 0; e < 2; e++) if (dayExact(P, t, d, e) > P.days[d].cap[e]) {
      // only an undecided pair partner could still bring this day under its minutes
      for (const i of P.byDay[d]) if (s.act[i] === 1) for (const l of P.GD[i].links) for (const o of l.others) if (s.act[o] === 2) return split(o, 'act');
      return null;
    }
    // short covering rows at the least vector; the tightest one first (first-fail: smallest room between what the row can
    // still reach and what it needs; ties: keep order) so that a row that cannot be repaired fails before unrelated choices are made
    let pick = null;
    for (let h = 0; h < P.G; h++) {
      if (s.gs[h] !== 1) continue;
      let c = 0, mx = 0; for (let i = 0; i < P.GD.length; i++) { if (s.act[i] === 1) c += P.GD[i].cred[s.lo1[i]][h]; if (s.act[i] !== 0) mx += P.GD[i].cred[s.hi1[i]][h]; }
      if (c < P.floor4[h]) { const room = mx - P.floor4[h]; if (!pick || room < pick.room) pick = { h, kind: 'floor', room }; continue; }
      let dN = 0, any = false, tot = 0; for (const i of P.cands[h]) { if (s.act[i] === 1) { dN += s.loN[i] - s.lo1[i]; any = true; } if (s.act[i] !== 0) tot += s.hiN[i] - s.lo1[i]; }
      if (!any || dN < P.mc[h]) { const room = 4 * (tot - P.mc[h]); if (!pick || room < pick.room) pick = { h, kind: 'climb', room, any }; }
    }
    if (pick) {
      const h = pick.h, own = P.cands[h], behind = (lo) => (x, y) => (lo[x] - P.GD[x].lo) - (lo[y] - P.GD[y].lo) || P.GD[x].di - P.GD[y].di || x - y;
      if (pick.kind === 'floor') {
        const up = (i) => s.act[i] === 1 && s.lo1[i] < s.hi1[i] && P.GD[i].cred[s.lo1[i] + 1][h] > P.GD[i].cred[s.lo1[i]][h];
        const ownUp = own.filter(up).sort(behind(s.lo1)); if (ownUp.length) return split(ownUp[0], 1);
        const ownOn = own.filter((i) => s.act[i] === 2); if (ownOn.length) return split(ownOn[0], 'act');
        const help = []; for (let i = 0; i < P.GD.length; i++) if (P.GD[i].gi !== h && (up(i) || (s.act[i] === 2 && P.GD[i].cred[s.lo1[i]][h] > 0))) help.push(i);
        if (!help.length) return null;
        help.sort((x, y) => P.GD[y].cred[P.GD[y].hi][h] - P.GD[x].cred[P.GD[x].hi][h] || x - y);
        return split(help[0], s.act[help[0]] === 2 ? 'act' : 1);
      }
      const upN = own.filter((i) => s.act[i] === 1 && s.loN[i] < s.hiN[i]).sort(behind(s.loN)); if (pick.any && upN.length) return split(upN[0], 2);
      const ownOn = own.filter((i) => s.act[i] === 2); if (ownOn.length) return split(ownOn[0], 'act');
      return null;
    }
    // the least vector is a plan: everything undecided stays off, every set at its lower bound
    const r = clone(s); for (let i = 0; i < P.GD.length; i++) { if (r.act[i] === 2) r.act[i] = 0; r.hi1[i] = r.lo1[i]; r.hiN[i] = r.loN[i]; }
    return r;
  };
  // A fixed, ordered portfolio with growing node budgets (deterministic: counts, never a clock). The two strategies have their
  // heavy tails on different instances; a verdict of either one is exact, so the first verdict wins.
  let sol = null;
  if (strategy) { sol = (strategy === 'S' ? recStruct : recRepair)(clone(s0)); }
  else {
    let spent = 0, slice = Math.min(budget, P.opt.slice || 1000), k = 0; ctx.out = true;
    while (ctx.out && spent < budget) {
      ctx.out = false; ctx.nodes = 0; ctx.budget = Math.min(slice, budget - spent);
      sol = (k % 2 === 0 ? recStruct : recRepair)(clone(s0)); spent += Math.min(ctx.nodes, ctx.budget);
      if (k % 2 === 1) slice *= 4; k++;
    }
    ctx.nodes = spent;
  }
  if (sol) {
    const w = { n1: {}, nN: {}, on: new Set() };
    P.GD.forEach((a, i) => { if (sol.act[i] === 1) { w.n1[a.id] = sol.lo1[i]; w.nN[a.id] = sol.loN[i]; w.on.add(a.gi); } });
    const bad = certify(P, w);
    if (bad) throw new Error('witness failed its certificate: ' + bad);
    return { status: 'feasible', witness: w, nodes: ctx.nodes, hall: ctx.hall };
  }
  return { status: ctx.out ? 'unknown' : 'infeasible', nodes: ctx.nodes, hall: ctx.hall };
}

/**
 * R3-SES-02 step 2: lexicographic selection in the keep order. "Construct first": try to extend the last witness by the new
 * group only (the days of the kept groups stay as they are); only when that fails is the full exact question asked.
 */
export function select(P, budget = 200000, { constructFirst = true, extendBudget = 5000 } = {}) {
  const states = P.groups.map(() => 'free');
  const kept = [], dropped = [], log = [];
  let witness = null;
  for (let h = 0; h < P.G; h++) {
    const g = P.groups[h];
    states[h] = 'on';
    let r = null, path = 'exact';
    if (witness && witness.on.has(h)) { r = { status: 'feasible', witness, nodes: 0 }; path = 'witness'; }
    let extra = 0;
    if (!r && constructFirst && witness) {
      const pin = new Map(); for (const a of P.GD) if (a.gi !== h) pin.set(a.id, witness.n1[a.id] !== undefined ? 1 : 0);
      const q = fit(P, states.map((x, k) => (k === h || witness.on.has(k) ? 'on' : 'off')), extendBudget, pin);
      if (q.status === 'feasible') { r = q; path = 'extend'; } else extra = q.nodes;
    }
    if (!r) { r = fit(P, states, budget); r.nodes += extra; }
    log.push({ g, path, status: r.status, nodes: r.nodes });
    if (r.status === 'feasible') { kept.push(g); witness = r.witness; }
    else { states[h] = 'off'; dropped.push(r.status === 'infeasible' ? g : g + '(unknown)'); }
  }
  return { kept, dropped, log, witness, nodes: log.reduce((a, l) => a + l.nodes, 0), maxNodes: Math.max(0, ...log.map((l) => l.nodes)), unknown: log.filter((l) => l.status === 'unknown').length };
}
