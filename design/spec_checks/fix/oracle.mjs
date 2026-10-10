// design/spec_checks/fix/oracle.mjs - COPY of design/two-stage/proto/oracle.mjs with the two changes of PLANNER_SPEC.md 7.5 (judge 2, D2):
//   the implied peak-floor row and the day-subset bound are built from the CREDIT TABLE (smallest / largest own credit of the group's
//   candidates), never from 'one own set = one credited set'. Everything else is the prototype, unchanged.
// (original header) PROTOTYPE: the exact three-valued feasibility oracle on the reduced (group-day) model.
// "Is there a legal pair of endpoint weeks (week 1, peak week) for this question?"  ->  fits (with a witness) | no (search exhausted,
// every pruning step a whole-number inequality valid for all completions) | unknown (node budget reached; never read as 'no').
// Unknowns per candidate group-day: A = (exercise count K, sets in the peak week) and B = (K, sets in week 1); per group z (trained
// directly); per pattern partner y. Every rule is a sum of per-variable table values (<= or >=), plus the pair savings of the time rows.
// Whole numbers only. Deterministic: fixed tie-breaks, node budget (never a clock).
import { CHANGE, CHANGE_PAIR } from '../../two-stage/proto/core.mjs';

const BIG = 1 << 20;

/**
 * @param I instance with tables (core.buildTables)
 * @param q question:
 *   must: number[] groups that must be trained directly; not: number[] groups that must not; every other group is free
 *   peakMin / peakMax / w1Min / w1Max: {g: own sets on the main days}
 *   expMin / expMax: {g: number of exposure days (main days that train the group)}
 *   allowA: (gdIndex, {K, n}) => boolean, allowB: same for week 1      (structure pins)
 *   partnerMust / partnerNot: number[]; noPartners: boolean
 *   extraSec: seconds added to every day's limit ("how many more minutes would it need?")
 *   session4: {g: quarter sets} per-session credited limit override (44 usual, 56 hard); noTime: drop the time rows (template capacity question)
 * @param budget node budget
 * @returns {{status:'fits'|'no'|'unknown', plan?:object, nodes:number}}
 */
function askOnce(I, q, budget, strategy) {
  const NG = I.groups.length, NGD = I.gds.length, NP = I.partners.length;
  const zV = (g) => g, aV = (gi) => NG + gi, bV = (gi) => NG + NGD + gi, yV = (pi) => NG + 2 * NGD + pi;
  const nVars = NG + 2 * NGD + NP;
  // endpoint states of a group-day: index 0 = off, then (K, n) for every K and every n the staircase holds
  const ST = I.gds.map((gd) => {
    const st = [{ K: 0, n: 0, sec: [0, 0], cred: new Int16Array(NG), x: [] }];
    for (const K of gd.Ks) for (const r of gd.tab.get(K).rows) st.push({ K, n: r.n, sec: r.sec, cred: r.cred, x: r.x });
    return st;
  });
  // optimistic doubled seconds of a state (a valid lower bound of 2 x the day's seconds, with no pair term):
  //   two exercises paired with each other save min(xa, xb) x m + 60 <= (xa + xb) x m / 2 + 60: each side is charged (2 tau - m) per
  //   set and half a changeover less; an exercise paired with a FIXED mate (a class lift, a joint-care item) saves at most
  //   xa x m + 60 on its own: it is charged (2 tau - 2 m) per set and no changeover. m = the pair's shorter rest.
  const pairR = I.gds.map((gd) => gd.cands.map(() => [0, 0]));                 // doubled reduction per set, per epoch
  const pairC = I.gds.map((gd) => gd.cands.map(() => 2 * CHANGE));             // doubled changeover charged
  const partR = I.partners.map(() => [0, 0]), partC = I.partners.map(() => 2 * CHANGE);
  const restSide = (sd, p) => (sd.t === 'c' ? I.gds[sd.gd].cands[sd.ci].rest[p] : sd.t === 'p' ? I.partners[sd.pi].rest[p] : sd.rest[p]);
  for (const pr of I.pairs) {
    const fixedMate = pr.s1.t === 'm' || pr.s2.t === 'm';
    for (let p = 0; p < 2; p++) {
      const m = Math.min(restSide(pr.s1, p), restSide(pr.s2, p)), red = fixedMate ? 2 * m : m;
      for (const sd of [pr.s1, pr.s2]) {
        if (sd.t === 'c') { if (red > pairR[sd.gd][sd.ci][p]) pairR[sd.gd][sd.ci][p] = red; pairC[sd.gd][sd.ci] = Math.min(pairC[sd.gd][sd.ci], fixedMate ? 0 : CHANGE); }
        else if (sd.t === 'p') { if (red > partR[sd.pi][p]) partR[sd.pi][p] = red; partC[sd.pi] = Math.min(partC[sd.pi], fixedMate ? 0 : CHANGE); }
      }
    }
  }
  ST.forEach((st, gi) => { const gd = I.gds[gi]; for (const s of st) { s.opt = [0, 0]; for (let p = 0; p < 2; p++) { let t = 0; for (let i = 0; i < s.x.length; i++) { const c = gd.cands[i]; t += s.x[i] * (2 * (c.work[p] + c.rest[p]) - pairR[gi][i][p]) + pairC[gi][i]; } s.opt[p] = t; } } });
  const partOpt = (pi, p) => { const pt = I.partners[pi]; return pt.sets * (2 * (pt.work[p] + pt.rest[p]) - partR[pi][p]) + partC[pi]; };
  const must = new Set(q.must || []), not = new Set(q.not || []);
  const dom = new Array(nVars);
  for (let g = 0; g < NG; g++) dom[zV(g)] = must.has(g) ? [1] : (not.has(g) || I.groups[g].never) ? [0] : [0, 1];
  I.gds.forEach((gd, gi) => {
    const a = [], b = [];
    ST[gi].forEach((s, i) => { if (!q.allowA || q.allowA(gi, s)) a.push(i); if (!q.allowB || q.allowB(gi, s)) b.push(i); });
    dom[aV(gi)] = a; dom[bV(gi)] = b;
  });
  const pMust = new Set(q.partnerMust || []), pNot = new Set(q.partnerNot || []);
  for (let pi = 0; pi < NP; pi++) dom[yV(pi)] = q.noPartners || pNot.has(pi) ? [0] : pMust.has(pi) ? [1] : [0, 1];

  const XS = q.extraSec || 0;                                                  // seconds added to every day's limit (explanations and offers)
  const XD = (d) => (q.extraByDay && q.extraByDay[d]) || 0;                    // seconds added to one day's limit ("which day refuses it?")
  const rows = [];
  const add = (le, rhs, cols, extra = null) => { if (cols.length) rows.push({ le, rhs, vars: cols.map((c) => c[0]), vals: cols.map((c) => c[1]), ...(extra || {}) }); };
  const z01 = (a, b) => Int32Array.of(a, b);
  const tv = (gi, f) => Int32Array.from(ST[gi], f);
  const A = (gi, f) => [aV(gi), tv(gi, f)], B = (gi, f) => [bV(gi), tv(gi, f)];
  // channel rows: same exercise count at both ends; week 1 never above the peak
  I.gds.forEach((gd, gi) => {
    add(true, 0, [A(gi, (s) => s.K), B(gi, (s) => -s.K)]); add(false, 0, [A(gi, (s) => s.K), B(gi, (s) => -s.K)]);
    add(true, 0, [B(gi, (s) => s.n), A(gi, (s) => -s.n)]);
  });
  I.days.forEach((day, d) => {
    for (let p = 0; p < 2; p++) {
      const cols = [];
      I.gds.forEach((gd, gi) => { if (gd.d === d) cols.push(p === 0 ? B(gi, (s) => s.sec[0]) : A(gi, (s) => s.sec[1])); });
      I.partners.forEach((pt, pi) => { if (pt.d === d) cols.push([yV(pi), z01(0, pt.sets * (pt.work[p] + pt.rest[p]) + CHANGE)]); });
      if (!q.noTime) rows.push({ le: true, rhs: day.limit[p] + XS + XD(d) - day.fixed[p], vars: cols.map((c) => c[0]), vals: cols.map((c) => c[1]), pairs: I.pairs.filter((pr) => pr.d === d), epoch: p });
      // the same row with the optimistic doubled seconds (implied; no pair term, so it filters well)
      if (!q.noTime) { const oc = []; I.gds.forEach((gd, gi) => { if (gd.d === d) oc.push(p === 0 ? B(gi, (s) => s.opt[0]) : A(gi, (s) => s.opt[1])); }); I.partners.forEach((pt, pi) => { if (pt.d === d) oc.push([yV(pi), z01(0, partOpt(pi, p))]); }); add(true, 2 * (day.limit[p] + XS + XD(d) - day.fixed[p]), oc); }
    }
    const cnt = [];
    I.gds.forEach((gd, gi) => { if (gd.d === d) cnt.push(A(gi, (s) => s.K)); });
    I.partners.forEach((pt, pi) => { if (pt.d === d) cnt.push([yV(pi), z01(0, 1)]); });
    if (day.exBudget != null) add(true, day.exBudget, cnt);
    if (day.cap12 != null) add(true, day.cap12, cnt);
    I.groups.forEach((grp, g) => {
      const cols = [];
      I.gds.forEach((gd, gi) => { if (gd.d === d && gd.cands.some((c) => c.cred[g])) cols.push(A(gi, (s) => s.cred[g])); });
      I.partners.forEach((pt, pi) => { if (pt.d === d && pt.cred[g]) cols.push([yV(pi), z01(0, pt.sets * pt.cred[g])]); });
      if (cols.length) { cols.push([zV(g), z01(-BIG, 0)]); add(true, ((q.session4 && q.session4[g]) || grp.session4 || 44) - ((I.fixedCredDay && I.fixedCredDay[d] && I.fixedCredDay[d][g]) || 0), cols); }
    });
  });
  I.groups.forEach((grp, g) => {
    const own = []; I.gds.forEach((gd, gi) => { if (gd.g === g) own.push(gi); });
    const ownMain = own.filter((gi) => I.days[I.gds[gi].d].main);
    const fc = (I.fixedCred && I.fixedCred[g]) || 0;
    if (!own.length) { add(true, 0, [[zV(g), z01(0, 1)]]); return; }
    for (const gi of own) {
      add(true, 0, [A(gi, (s) => (s.K ? 1 : 0)), [zV(g), z01(0, -1)]]);
      // calves: the one calf exercise on every leg day; any group: it trains on the days where it holds the day's work lift ("the work first")
      if ((grp.calves || I.gds[gi].home) && I.days[I.gds[gi].d].main) add(false, 0, [A(gi, (s) => (s.K ? 1 : 0)), [zV(g), z01(0, -1)]]);
    }
    if (!grp.calves) add(false, 0, [...ownMain.map((gi) => A(gi, (s) => (s.K ? 1 : 0))), [zV(g), z01(0, -1)]]);
    // floor in week 1 (credited quarter sets on the main days); the same row at the peak with the minimum climb added (implied, speeds the proof)
    const fl = [], pk = [];
    I.gds.forEach((gd, gi) => { if (I.days[gd.d].main && gd.cands.some((c) => c.cred[g])) { fl.push(B(gi, (s) => s.cred[g])); pk.push(A(gi, (s) => s.cred[g])); } });
    I.partners.forEach((pt, pi) => { if (I.days[pt.d].main && pt.cred[g]) { const col = [yV(pi), z01(0, pt.sets * pt.cred[g])]; fl.push(col); pk.push(col); } });
    add(false, 4 * grp.F - fc, [...fl, [zV(g), z01(4 * grp.F, 0)]]);
    // FIX (D2): the climb adds at least mc own sets, each worth at least the smallest own credit of the group's candidates (0, 2 or 4 q)
    const cmin = ownMain.length ? Math.min(...ownMain.flatMap((gi) => I.gds[gi].cands.map((c) => c.cred[g] || 0))) : 0;
    add(false, 4 * grp.F + cmin * grp.mc - fc, [...pk, [zV(g), z01(4 * grp.F + cmin * grp.mc, 0)]]);
    // climb and reach (own sets on the main days)
    add(false, 0, [...ownMain.map((gi) => A(gi, (s) => s.n)), ...ownMain.map((gi) => B(gi, (s) => -s.n)), [zV(g), z01(0, -grp.mc)]]);
    add(true, I.N - 1, [...ownMain.map((gi) => A(gi, (s) => s.n)), ...ownMain.map((gi) => B(gi, (s) => -s.n))]);
    // planned growth: credited peak <= credited week 1 x G(N)   (lambda <= 1)
    if (!I.noLambda) {
      const lam = [];
      I.gds.forEach((gd, gi) => { if (gd.cands.some((c) => c.cred[g])) { lam.push(A(gi, (s) => 10000 * s.cred[g])); lam.push(B(gi, (s) => -I.G10k * s.cred[g])); } });
      I.partners.forEach((pt, pi) => { if (pt.cred[g]) lam.push([yV(pi), z01(0, pt.sets * pt.cred[g] * (10000 - I.G10k))]); });
      lam.push([zV(g), z01(-BIG * 64, 0)]);
      add(true, fc * (I.G10k - 10000), lam);
    }
    // ceilings: credited (with the helper spill) and own sets
    const ce = [];
    I.gds.forEach((gd, gi) => { if (gd.cands.some((c) => c.cred[g])) ce.push(A(gi, (s) => s.cred[g])); });
    I.partners.forEach((pt, pi) => { if (pt.cred[g]) ce.push([yV(pi), z01(0, pt.sets * pt.cred[g])]); });
    add(true, 4 * grp.C + (I.spill4 ?? 4) - fc, [...ce, [zV(g), z01(-BIG, 0)]]);
    add(true, grp.C, own.map((gi) => A(gi, (s) => s.n)));
    // question rows
    if (q.peakMin && q.peakMin[g] != null) add(false, q.peakMin[g], ownMain.map((gi) => A(gi, (s) => s.n)));
    if (q.peakMax && q.peakMax[g] != null) add(true, q.peakMax[g], ownMain.map((gi) => A(gi, (s) => s.n)));
    if (q.w1Min && q.w1Min[g] != null) add(false, q.w1Min[g], ownMain.map((gi) => B(gi, (s) => s.n)));
    if (q.w1Max && q.w1Max[g] != null) add(true, q.w1Max[g], ownMain.map((gi) => B(gi, (s) => s.n)));
    if (q.expMin && q.expMin[g] != null) add(false, q.expMin[g], ownMain.map((gi) => A(gi, (s) => (s.K ? 1 : 0))));
    if (q.expMax && q.expMax[g] != null) add(true, q.expMax[g], ownMain.map((gi) => A(gi, (s) => (s.K ? 1 : 0))));
  });
  I.partners.forEach((pt, pi) => {
    if (pt.host) add(true, 0, [[yV(pi), z01(0, 1)], A(pt.host[0], (s) => (s.K > pt.host[1] ? -1 : 0))]);
    add(true, 1, [[yV(pi), z01(0, 1)], [zV(pt.g), z01(0, 1)]]);
  });
  for (let g = 0; g < NG; g++) { const ps = I.partners.map((pt, pi) => (pt.g === g ? pi : -1)).filter((i) => i >= 0); if (ps.length > 1) add(true, 1, ps.map((pi) => [yV(pi), z01(0, 1)])); }
  if (NP) add(true, I.maxPartners ?? 3, I.partners.map((_, pi) => [yV(pi), z01(0, 1)]));

  // pair saving upper bound for the current domains (epoch p: 0 reads the week-1 variables, 1 the peak variables)
  const maxSide = (dm, sd, p) => {
    if (sd.t === 'm') return sd.sets;
    if (sd.t === 'p') { const d = dm[yV(sd.pi)]; return d[d.length - 1] === 1 ? I.partners[sd.pi].sets : 0; }
    let m = 0; const st = ST[sd.gd];
    for (const s of dm[p === 0 ? bV(sd.gd) : aV(sd.gd)]) { const x = st[s].x[sd.ci] || 0; if (x > m) m = x; }
    return m;
  };
  const restOf = (sd, p) => (sd.t === 'c' ? I.gds[sd.gd].cands[sd.ci].rest[p] : sd.t === 'p' ? I.partners[sd.pi].rest[p] : sd.rest[p]);
  const saveUB = (dm, pr, p) => {
    const xa = maxSide(dm, pr.s1, p); if (!xa) return 0;
    const xb = maxSide(dm, pr.s2, p); if (!xb) return 0;
    return Math.min(xa, xb) * Math.min(restOf(pr.s1, p), restOf(pr.s2, p)) + 2 * (CHANGE - CHANGE_PAIR);
  };

  // rows of each variable (for the propagation queue)
  const rowsOf = Array.from({ length: nVars }, () => []);
  rows.forEach((r, ri) => { for (const v of r.vars) rowsOf[v].push(ri); if (r.pairs) for (const pr of r.pairs) for (const sd of [pr.s1, pr.s2]) { if (sd.t === 'c') rowsOf[r.epoch === 0 ? bV(sd.gd) : aV(sd.gd)].push(ri); else if (sd.t === 'p') rowsOf[yV(sd.pi)].push(ri); } });
  const mn = [], mx = [];
  /** propagate the rows in `queue` to a fixpoint; false = proven contradiction */
  function propagate(dm, queue) {
    const inQ = new Uint8Array(rows.length); for (const ri of queue) inQ[ri] = 1;
    while (queue.length) {
      const ri = queue.pop(); inQ[ri] = 0;
      const r = rows[ri], k = r.vars.length; let sMin = 0, sMax = 0;
      for (let j = 0; j < k; j++) {
        const d = dm[r.vars[j]], vals = r.vals[j]; let a = Infinity, b = -Infinity;
        for (let t = 0; t < d.length; t++) { const v = vals[d[t]]; if (v < a) a = v; if (v > b) b = v; }
        mn[j] = a; mx[j] = b; sMin += a; sMax += b;
      }
      if (r.le) {
        if (r.pairs) for (const pr of r.pairs) sMin -= saveUB(dm, pr, r.epoch);
        if (sMin > r.rhs) return false;
        for (let j = 0; j < k; j++) {
          if (sMin - mn[j] + mx[j] <= r.rhs) continue;
          const v = r.vars[j], d = dm[v], vals = r.vals[j], nd = [];
          for (let t = 0; t < d.length; t++) if (sMin - mn[j] + vals[d[t]] <= r.rhs) nd.push(d[t]);
          if (!nd.length) return false;
          if (nd.length !== d.length) { dm[v] = nd; for (const rj of rowsOf[v]) if (!inQ[rj]) { inQ[rj] = 1; queue.push(rj); } }
        }
      } else {
        if (sMax < r.rhs) return false;
        for (let j = 0; j < k; j++) {
          if (sMax - mx[j] + mn[j] >= r.rhs) continue;
          const v = r.vars[j], d = dm[v], vals = r.vals[j], nd = [];
          for (let t = 0; t < d.length; t++) if (sMax - mx[j] + vals[d[t]] >= r.rhs) nd.push(d[t]);
          if (!nd.length) return false;
          if (nd.length !== d.length) { dm[v] = nd; for (const rj of rowsOf[v]) if (!inQ[rj]) { inQ[rj] = 1; queue.push(rj); } }
        }
      }
    }
    return true;
  }

  // day-subset bound (implied by the day rows; the Hall-type cut of the packing): for every set S of main days, every group that is
  // trained directly must spend, INSIDE S, at least the cheapest seconds of any way to hold its smallest possible peak when its
  // exercises on the other days are free. The sum over the groups must fit the free seconds of S. Whole numbers (doubled seconds).
  const ownMainOf = I.groups.map((_, g) => I.gds.map((gd, gi) => (gd.g === g && I.days[gd.d].main ? gi : -1)).filter((i) => i >= 0));
  const mainDays = I.days.map((day, d) => (day.main ? d : -1)).filter((d) => d >= 0);
  const cntCap = (d) => { const day = I.days[d]; return day.cap12 != null && day.exBudget != null ? Math.min(day.cap12, day.exBudget) : day.cap12 != null ? day.cap12 : day.exBudget; };
  const subsets = []; for (let m = 1; m < (1 << mainDays.length); m++) {
    const set = new Set(); mainDays.forEach((d, i) => { if (m & (1 << i)) set.add(d); });
    const ds = [...set];
    subsets.push({ set, cap: q.noTime ? null : 2 * ds.reduce((a, d) => a + (I.days[d].limit[1] + XS + XD(d) - I.days[d].fixed[1]), 0), cnt: ds.every((d) => cntCap(d) != null) ? ds.reduce((a, d) => a + cntCap(d), 0) : null });
  }
  const INF = 1e9;
  function weekBound(dm) {
    const needs = [];
    for (let g = 0; g < NG; g++) {
      if (dm[zV(g)].length !== 1 || dm[zV(g)][0] !== 1) continue;
      const grp = I.groups[g];
      // smallest own peak: the larger of the question's bound and floor + climb minus the most helper credit the others can still give
      let helpUB = (I.fixedCred && I.fixedCred[g]) || 0;
      I.gds.forEach((gd, gi) => { if (gd.g === g || !I.days[gd.d].main || !gd.cands.some((c) => c.cred[g])) return; let m = 0; for (const s of dm[aV(gi)]) if (ST[gi][s].cred[g] > m) m = ST[gi][s].cred[g]; helpUB += m; });
      I.partners.forEach((pt, pi) => { if (pt.cred[g] && I.days[pt.d].main) { const d = dm[yV(pi)]; if (d[d.length - 1] === 1) helpUB += pt.sets * pt.cred[g]; } });
      // FIX (D2): own sets needed at the peak, from the credit table: at least (floor + climb x smallest own credit - helper credit) / largest own credit
      const ownC = ownMainOf[g].flatMap((gi) => I.gds[gi].cands.map((c) => c.cred[g] || 0));
      const cmn = ownC.length ? Math.min(...ownC) : 0, cmx = ownC.length ? Math.max(...ownC) : 0;
      let k = cmx > 0 ? Math.max(0, Math.ceil((4 * grp.F + cmn * grp.mc - helpUB) / cmx)) : 0;
      if (q.peakMin && q.peakMin[g] != null && q.peakMin[g] > k) k = q.peakMin[g];
      needs.push([g, k]);
    }
    for (const S of subsets) for (let res = 0; res < 2; res++) {                 // resource 0: seconds (optimistic, doubled); 1: exercise count
      const capS = res === 0 ? S.cap : S.cnt;
      if (capS == null) continue;
      let need = 0;
      for (const [g, k] of needs) {
        let f = new Array(k + 1).fill(INF); f[0] = 0;
        for (const gi of ownMainOf[g]) {
          const nf = new Array(k + 1).fill(INF), st = ST[gi], inside = S.set.has(I.gds[gi].d);
          for (const s of dm[aV(gi)]) { const n = st[s].n, c = !inside ? 0 : res === 0 ? st[s].opt[1] : st[s].K; for (let j = 0; j <= k; j++) { if (f[j] >= INF) continue; const t = Math.min(k, j + n); if (f[j] + c < nf[t]) nf[t] = f[j] + c; } }
          f = nf;
        }
        if (f[k] >= INF) return false;
        need += f[k];
        if (need > capS) return false;
      }
      for (let pi = 0; pi < NP; pi++) if (S.set.has(I.partners[pi].d) && dm[yV(pi)].length === 1 && dm[yV(pi)][0] === 1) need += res === 0 ? partOpt(pi, 1) : 1;
      if (need > capS) return false;
    }
    return true;
  }

  // search: z in keep order, then the peak variables (smallest domain first, ties in keep order), then partners, then week 1
  const zs = []; for (let g = 0; g < NG; g++) zs.push(zV(g));
  const gdOrder = I.gds.map((_, gi) => gi).sort((a, b) => (I.gds[a].g - I.gds[b].g) || (I.gds[a].d - I.gds[b].d));
  const As = gdOrder.map(aV), Bs = gdOrder.map(bV), ys = []; for (let pi = 0; pi < NP; pi++) ys.push(yV(pi));
  const pickVar = (dm) => {
    for (const v of zs) if (dm[v].length > 1) return v;
    let best = -1; for (const v of As) if (dm[v].length > 1 && (best < 0 || dm[v].length < dm[best].length)) best = v;
    if (best >= 0) return best;
    for (const v of ys) if (dm[v].length > 1) return v;
    for (const v of Bs) if (dm[v].length > 1 && (best < 0 || dm[v].length < dm[best].length)) best = v;
    return best;
  };
  let nodes = 0, out = false;
  function dfs(dm, queue) {
    if (++nodes > budget) { out = true; return null; }
    if (!propagate(dm, queue)) return null;
    if (!weekBound(dm)) return null;
    const v = pickVar(dm);
    if (v < 0) return dm;
    // value order: off first for z and y; peak variables cheapest first (off, fewer exercises, fewer sets); week-1 variables
    // LARGEST first (week 1 as close to the peak as the climb row allows: the floors are covering rows)
    const isB = v >= NG + NGD && v < NG + 2 * NGD, isA = v >= NG && v < NG + NGD;
    const vals = isB ? dm[v].slice().reverse() : (isA && strategy === 1) ? [...dm[v].filter((x) => x > 0).reverse(), ...dm[v].filter((x) => x === 0)] : dm[v];
    for (const s of vals) {
      const child = dm.slice(); child[v] = [s];
      const r = dfs(child, rowsOf[v].slice());
      if (r) return r;
      if (out) return null;
    }
    return null;
  }
  const res = dfs(dom, rows.map((_, i) => i));
  const size = { vars: nVars, rows: rows.length, states: Math.max(...dom.map((d) => d.length)) };
  if (!res) return { status: out ? 'unknown' : 'no', nodes, size };
  const plan = { z: [], K: [], n1: [], nN: [], y: [] };
  for (let g = 0; g < NG; g++) plan.z.push(res[zV(g)][0] === 1);
  I.gds.forEach((gd, gi) => { const a = ST[gi][res[aV(gi)][0]], b = ST[gi][res[bV(gi)][0]]; plan.K.push(a.K); plan.nN.push(a.n); plan.n1.push(b.n); });
  for (let pi = 0; pi < NP; pi++) plan.y.push(res[yV(pi)][0] === 1);
  return { status: 'fits', plan, nodes, size };
}

/**
 * The oracle as the planner calls it: a fixed, ordered portfolio of two value orders with doubling node budgets. Any strategy's
 * 'fits' (a witness) or 'no' (a complete proof) is final; 'unknown' only when the whole budget is spent. Deterministic.
 */
export function ask(I, q = {}, budget = 200000) {
  let nodes = 0;
  for (let b = Math.min(2000, budget); ; b = Math.min(budget, b * 8)) {
    for (const strategy of [0, 1]) {
      const r = askOnce(I, q, b, strategy);
      nodes += r.nodes;
      if (r.status !== 'unknown') return { ...r, nodes };
    }
    if (b >= budget) return { status: 'unknown', nodes };
  }
}
