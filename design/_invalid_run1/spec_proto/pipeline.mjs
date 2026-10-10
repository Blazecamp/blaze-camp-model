// design/spec_proto/pipeline.mjs - SPEC PROTOTYPE (evidence for design/PLANNER_SPEC.md, not engine code).
//
// The planner chain of the spec on the research instances (design/research/proto_endpoint.mjs buildInstance):
//   S1   who is trained         select(): lexicographic keep order with the exact reduced oracle (reduced.mjs)
//   S1b  structure              per kept group, in keep order: the most preferred days x exercises that still lets every kept group
//                               hold its minimums (preference: week 1 can start at the level start > more exposures > fewer
//                               exercises); each test is one exact oracle call with the earlier choices pinned
//   S2   block-table endpoints  the priority water-filling LADDER on the peak week: the next set goes to the kept group with the
//                               lowest relative progress (level start -> ceiling, credited sets; ties: keep order), on the day
//                               of that group that is behind unless that day is full; an exercise is opened only when the
//                               day's exercises are at their maximum; the per-session ceiling is relaxed 11 -> 14 only for a
//                               group that could not otherwise go on; then the evening pass; then week 1 ("keep the level's climb")
//   S3   stairway               exactStairway(): placed-week rules by construction (stairway.mjs)
//   S4   placement              every group has ONE add sequence; week w is a prefix of it (no slot ever loses a set); inside
//                               a day the balanced VOL-07 staircase
//   check                       every week re-checked against every row in whole numbers (the sandwich property in practice)
// Options mirror the coach decisions of the spec: fit (1.00 once the person keeps their time), total rule 7 %, pair accounting.
import fs from 'node:fs';
import { prep, select, fit, Q } from './reduced.mjs';
import { exactStairway } from './stairway.mjs';

const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));

/** exact minutes units of day d for sets n (object GD id -> sets; absent = not trained) */
export function dayUnits(P, d, n) {
  let t = 0;
  for (const i of P.byDay[d]) {
    if (n[i] === undefined) continue;
    const a = P.GD[i]; t += a.cost[n[i]];
    for (const l of a.links) {
      const o = l.others.find((k) => n[k] !== undefined); if (o === undefined) continue;
      if (P.pairMode === 'factor') t -= Q / 2 + l.save * a.x[n[i]][l.me];
      else if (i < o) t -= Q + l.save * Math.min(a.x[n[i]][l.me], P.GD[o].x[n[o]][l.otherSlot]);
    }
  }
  return t;
}
const credit = (P, n, h) => { let c = 0; for (const a of P.GD) if (n[a.id] !== undefined) c += a.cred[n[a.id]][h]; return c; };
const direct = (P, n, h) => { let c = 0; for (const i of P.cands[h]) if (n[i] !== undefined) c += n[i]; return c; };

export function plan(I, o = {}) {
  const opt = { fit: 1.0, pairMode: 'rest', noSingle: true, kChoice: true, rule: 7, N: 12, spill: 4, budget: 100000, callBudget: 20000, sessRelax: 56, ...o };
  const N = opt.N, growth = Math.round(R.stairway.by_N[N].growth * 10000);
  const P = prep(I, { fit: opt.fit, pairMode: opt.pairMode, noSingle: opt.noSingle, kChoice: opt.kChoice, hall: true });
  const sel = select(P, opt.budget);
  const out = { P, opt, sel, kept: sel.kept, dropped: sel.dropped, notes: [], calls: sel.log.filter((l) => l.status).length, nodes: sel.nodes };
  if (!sel.kept.length) return out;
  const S = P.groups.map((g) => I.S[g]), C = P.groups.map((g) => I.C[g]);
  let W = sel.witness; const kept = [...W.on].sort((a, b) => a - b);
  const states = P.groups.map((_, h) => (kept.includes(h) ? 'on' : 'off'));
  // ---- S1b: structure by preference, verified by the exact oracle (earlier groups pinned, later groups free in structure)
  const pin = new Map();
  for (const h of kept) {
    const fams = P.fam.filter((f) => P.GD[f[0]].gi === h);
    const options = [];
    // helper credit this group already receives in week 1 from the other groups of the current witness (quarter sets)
    let help = 0; for (const a of P.GD) if (a.gi !== h && W.n1[a.id] !== undefined) help += a.cred[W.n1[a.id]][h];
    for (let m = 1; m < (1 << fams.length); m++) { const days = fams.filter((_, i) => m >> i & 1); const min = days.reduce((a, f) => a + P.GD[f[0]].lo, 0); options.push({ days, over: Math.max(0, Math.ceil((4 * min + help - 4 * S[h]) / 4)), key: days.map((f) => P.GD[f[0]].di) }); }
    options.sort((a, b) => a.over - b.over || b.days.length - a.days.length || (a.key.join() < b.key.join() ? -1 : 1));
    let chosen = null;
    for (const op of options) {
      const p2 = new Map(pin); for (const f of fams) f.forEach((id, k) => p2.set(id, op.days.includes(f) && k === 0 ? 1 : 0));
      const r = fit(P, states, opt.callBudget, p2); out.calls++; out.nodes += r.nodes;
      if (r.status === 'feasible') { chosen = p2; W = r.witness; break; }
    }
    if (chosen) for (const [k, v] of chosen) pin.set(k, v);
    else { for (const f of fams) for (const id of f) pin.set(id, W.nN[id] !== undefined ? 1 : 0); out.notes.push(`${P.groups[h]}: no preferred structure holds the minimums; the witness structure is kept`); }
  }
  // the ceiling this plan can plan to: the level ceiling, what the planned curve reaches from the level start, one set a week
  const Ceff = P.groups.map((g, h) => Math.max(S[h], Math.min(C[h], Math.floor((S[h] * growth) / 10000), S[h] + N - 1)));
  const capN = (d) => P.days[d].cap[1], cap1 = (d) => P.days[d].cap[0];
  const lo = (i) => P.GD[i].lo;
  const relaxed = new Set(), sessCap = (h) => (relaxed.has(h) ? Math.max(P.sess[h], opt.sessRelax) : P.sess[h]);
  /** packing rows of one day at one endpoint: minutes and the per-session ceilings; returns the broken row or null */
  const dayBroken = (n, d, capOf) => {
    if (dayUnits(P, d, n) > capOf(d)) return `no minutes left on ${P.days[d].wd}`;
    for (const h of P.days[d].groupsOnDay) { let c = 0; for (const i of P.byDay[d]) if (n[i] !== undefined) c += P.GD[i].cred[n[i]][h]; if (c > sessCap(h)) return `${P.groups[h]} at its per-session ceiling on ${P.days[d].wd}`; }
    return null;
  };
  const anyBroken = (n, capOf) => { for (let d = 0; d < P.days.length; d++) { const b = dayBroken(n, d, capOf); if (b) return b; } return null; };
  // ---- S2a: the ladder on the peak week, from the witness of the minimums
  const nN = { ...W.nN }, n1w = { ...W.n1 };
  const active = (h) => P.cands[h].filter((i) => nN[i] !== undefined);
  const last = {}, blocked = new Map();
  const rho = (h) => [credit(P, nN, h) - 4 * S[h], 4 * Math.max(1, Ceff[h] - S[h])];
  const order = (h, n) => { const after = last[h] ?? -1; return active(h).sort((a, b) => (n[a] - lo(a)) - (n[b] - lo(b)) || (P.GD[a].di > after ? 0 : 1) - (P.GD[b].di > after ? 0 : 1) || P.GD[a].di - P.GD[b].di); };
  let ladderSteps = 0, opened = 0;
  const tryAdd = (h) => {
    const why = [], before = kept.map((k) => credit(P, nN, k));
    const others = () => { for (let q = 0; q < kept.length; q++) { const k = kept[q]; if (k === h) continue; const c = credit(P, nN, k); if (c > before[q] && c > 4 * C[k] + opt.spill) return `${P.groups[k]} would pass its ceiling through helper credit`; } return null; };
    for (const i of order(h, nN)) {
      const a = P.GD[i], d = a.di;
      if (nN[i] < a.hi) {
        nN[i]++; ladderSteps++;
        const bad = dayBroken(nN, d, capN) || others();
        if (!bad) { last[h] = d; return null; }
        nN[i]--; why.push(bad); continue;
      }
      // every exercise of the day is at its maximum: open the next candidate exercise (same sets + 1, re-formed staircase)
      const f = P.fam[a.fam], j = f[f.indexOf(i) + 1];
      if (j === undefined) { why.push(`every ${P.groups[h]} exercise at its maximum on ${P.days[d].wd}`); continue; }
      const b = P.GD[j], newN = nN[i] + 1, new1 = Math.max(n1w[i], b.lo);
      if (newN > b.hi || new1 > newN) { why.push(`every ${P.groups[h]} exercise at its maximum on ${P.days[d].wd}`); continue; }
      const oldN = nN[i], old1 = n1w[i]; delete nN[i]; delete n1w[i]; nN[j] = newN; n1w[j] = new1; ladderSteps++;
      const bad = dayBroken(nN, d, capN) || dayBroken(n1w, d, cap1) || others() || (direct(P, nN, h) - direct(P, n1w, h) < P.mc[h] ? 'the climb' : null)
        || (kept.some((g) => credit(P, n1w, g) < P.floor4[g]) ? 'a week-1 floor' : null);
      if (!bad) { opened++; last[h] = d; for (const k of kept) if (blocked.has(k) && active(k).some((x) => P.GD[x].di === d)) blocked.delete(k); return null; }
      delete nN[j]; delete n1w[j]; nN[i] = oldN; n1w[i] = old1; why.push(`no room for another ${P.groups[h]} exercise on ${P.days[d].wd} (${bad})`);
    }
    return why.join('; ');
  };
  const runLadder = () => {
    for (;;) {
      const cand = kept.filter((h) => !blocked.has(h));
      if (!cand.length) break;
      cand.sort((a, b) => { const [x, y] = rho(a), [u, v] = rho(b); return x * v - u * y || a - b; });
      const h = cand[0];
      if (credit(P, nN, h) + 4 > 4 * Ceff[h]) { blocked.set(h, 'at its ceiling'); continue; }
      if (direct(P, nN, h) + 1 > C[h]) { blocked.set(h, 'at its ceiling (direct sets)'); continue; }
      const why = tryAdd(h); if (why) blocked.set(h, why);
    }
  };
  runLadder();
  // second pass: a group stopped only by its own per-session ceiling may use the Focus value (soft row T5-CAP-05)
  for (const h of kept) if (blocked.has(h) && blocked.get(h).includes(`${P.groups[h]} at its per-session ceiling`) && sessCap(h) < opt.sessRelax) { relaxed.add(h); blocked.delete(h); }
  if (relaxed.size) { runLadder(); out.notes.push(`per-session ceiling relaxed to ${opt.sessRelax / 4} for: ${[...relaxed].map((h) => P.groups[h]).join(', ')}`); }
  // ---- S2b: evening pass (R3-VOL-03 as far as the hard rows allow)
  const even = (n, capOf, lower, upper, floors) => {
    let moves = 0;
    for (let guard = 0; guard < 1000; guard++) {
      let moved = false;
      for (const h of kept) {
        const ds = active(h);
        for (const i of ds) for (const j of ds) {
          if (i === j) continue;
          const ai = n[i] - lo(i), aj = n[j] - lo(j), earlier = P.GD[i].di < P.GD[j].di;
          if (!(aj >= ai + 2 || (aj === ai + 1 && earlier))) continue;        // j is ahead of i: move one set j -> i
          if (n[i] >= P.GD[i].hi || n[j] - 1 < P.GD[j].lo || (lower && n[j] - 1 < lower[j]) || (upper && n[i] + 1 > upper[i])) continue;
          const was = kept.map((g) => credit(P, n, g));
          n[i]++; n[j]--;
          const bad = dayBroken(n, P.GD[i].di, capOf) || kept.some((g, q) => { const c = credit(P, n, g); return (c > was[q] && c > 4 * C[g] + opt.spill) || (floors && c < P.floor4[g]); });
          if (bad) { n[i]--; n[j]++; continue; }
          moved = true; moves++;
        }
      }
      if (!moved) return moves;
    }
    throw new Error('evening pass did not settle');
  };
  out.evenPeak = even(nN, capN, n1w, null, false);
  // ---- S2c: week 1 from the witness (floors and week-1 minutes certified), evened, then raised toward its target:
  //      credited start = peak - (ceiling - start) ("keep the level's climb"), never under the floor, never above the level start;
  //      and what the stairway needs to reach the peak (one set a week; the planned curve at lambda <= 1)
  // canonical week 1: every exercise at its minimum, then each group lifts ITS OWN sets until its floor holds (own sets first,
  // the day that is behind first). If that cannot be done (a floor that hangs on helper credit), the certified witness is used.
  let n1 = {}; for (const h of kept) for (const i of active(h)) n1[i] = lo(i);
  let canon = !anyBroken(n1, cap1);
  for (let guard = 0; canon && guard < 500; guard++) {
    const h = kept.find((g) => credit(P, n1, g) < P.floor4[g]); if (h === undefined) break;
    const ds = active(h).filter((i) => n1[i] < nN[i]).sort((a, b) => (n1[a] - lo(a)) - (n1[b] - lo(b)) || P.GD[a].di - P.GD[b].di);
    let done = false;
    if (direct(P, nN, h) - (direct(P, n1, h) + 1) >= P.mc[h]) for (const i of ds) { n1[i]++; if (!dayBroken(n1, P.GD[i].di, cap1)) { done = true; break; } n1[i]--; }
    if (!done) {                                       // own sets cannot lift the floor: a helper set (most credit per set first)
      const helpers = []; for (const k of kept) if (k !== h) for (const i of active(k)) if (n1[i] < nN[i] && P.GD[i].cred[nN[i]][h] > P.GD[i].cred[n1[i]][h] && direct(P, nN, k) - (direct(P, n1, k) + 1) >= P.mc[k]) helpers.push(i);
      const gain = (i) => { for (let n = n1[i] + 1; n <= nN[i]; n++) if (P.GD[i].cred[n][h] > P.GD[i].cred[n1[i]][h]) return (4 * (P.GD[i].cred[n][h] - P.GD[i].cred[n1[i]][h])) / (n - n1[i]); return 0; };
      helpers.sort((a, b) => gain(b) - gain(a) || P.GD[a].gi - P.GD[b].gi || (n1[a] - lo(a)) - (n1[b] - lo(b)) || a - b);
      for (const i of helpers) { n1[i]++; if (!dayBroken(n1, P.GD[i].di, cap1)) { done = true; out.helperLifts = (out.helperLifts || 0) + 1; break; } n1[i]--; }
    }
    if (!done) canon = false;
  }
  if (!canon) { n1 = { ...n1w }; out.notes.push('week 1 from the witness (a floor could not be rebuilt set by set)'); }
  out.evenWeek1 = even(n1, cap1, null, nN, true);
  const target1 = (h) => Math.max(P.floor4[h], Math.min(4 * S[h], credit(P, nN, h) - 4 * (Ceff[h] - S[h])));
  const reach = (h) => { const p = direct(P, nN, h); return Math.max(p - (N - 1), Math.ceil((p * 10000) / growth)); };
  for (let pass = 0; pass < 50; pass++) {
    let any = false;
    for (const h of kept) for (;;) {
      const d1 = direct(P, n1, h), pN = direct(P, nN, h);
      if (!(credit(P, n1, h) < target1(h) || d1 < reach(h)) || pN - (d1 + 1) < P.mc[h]) break;
      const ds = active(h).filter((i) => n1[i] < nN[i]).sort((a, b) => (n1[a] - lo(a)) - (n1[b] - lo(b)) || P.GD[a].di - P.GD[b].di);
      let done = false;
      for (const i of ds) { n1[i]++; if (!dayBroken(n1, P.GD[i].di, cap1)) { done = true; any = true; break; } n1[i]--; }
      if (!done) break;
    }
    if (!any) break;
  }
  for (const h of kept) while (direct(P, n1, h) < reach(h)) {       // unreachable peak: one deterministic cut
    const ds = active(h).filter((i) => nN[i] > n1[i]).sort((a, b) => (nN[b] - lo(b)) - (nN[a] - lo(a)) || P.GD[b].di - P.GD[a].di);
    if (!ds.length || direct(P, nN, h) - 1 - direct(P, n1, h) < P.mc[h]) throw new Error('unreachable peak could not be cut: ' + P.groups[h]);
    nN[ds[0]]--; out.notes.push(`peak of ${P.groups[h]} lowered by one set: the stairway could not reach it from week 1`);
  }
  for (let guard = 0; guard < 100; guard++) { const m = even(nN, capN, n1, null, false) + even(n1, cap1, null, nN, true); out.evenPeak += m; if (!m) break; }
  // ---- S3: the stairway on direct group sets
  const gs = kept.map((h) => ({ id: P.groups[h], S: direct(P, n1, h), P: direct(P, nN, h) }));
  const st = exactStairway(gs, N, { rule: opt.rule, tiers: opt.tiers });
  // ---- S4: one add sequence per group from week 1 to the peak (the day that is behind first; ties: the earlier day, rotating)
  const seq = kept.map((h) => {
    const cnt = Object.fromEntries(active(h).map((i) => [i, n1[i]])), s = []; let lastDay = -1;
    for (;;) {
      const open = active(h).filter((i) => cnt[i] < nN[i]); if (!open.length) break;
      open.sort((a, b) => (cnt[a] - lo(a)) - (cnt[b] - lo(b)) || (P.GD[a].di > lastDay ? 0 : 1) - (P.GD[b].di > lastDay ? 0 : 1) || P.GD[a].di - P.GD[b].di);
      s.push(open[0]); cnt[open[0]]++; lastDay = P.GD[open[0]].di;
    }
    return s;
  });
  const weeks = [];
  for (let w = 1; w <= N; w++) { const n = { ...n1 }; kept.forEach((h, k) => { const adds = st.sched[k][w - 1] - gs[k].S; for (let t = 0; t < adds; t++) n[seq[k][t]]++; }); weeks.push(n); }
  // ---- check every week against every row (whole numbers); the middle weeks were never searched: they are prefixes
  const ath = (d, w) => I.days[d].athMin * (1 + ((I.o.athleticPeak || 1) - 1) * (w - 1) / Math.max(1, N - 1));
  const capW = (w) => (d) => Math.floor(Q * (I.o.minutes * opt.fit - I.days[d].fixed - ath(d, w)));
  const chk = { minutes: 0, session: 0, floor: 0, ceiling: 0, spill: 0, slotDrop: 0, shape: 0, groupStep: 0, creditedStep: 0, totalStep: 0, uneven: 0, lastNotHardest: 0 };
  const slots = (n) => { const x = {}; for (const a of P.GD) if (n[a.id] !== undefined) a.ss.forEach((s, k) => { x[s.id] = a.x[n[a.id]][k]; }); return x; };
  const inflow = P.groups.map((g, h) => kept.reduce((a, k) => a + (k !== h ? Math.max(0, ...active(k).map((i) => Math.max(...P.GD[i].ss.map((s) => s.cr[g] || 0)))) : 0), 0));
  let prevSlots = null, prevTot = null, prevCred = null;
  out.minutes = P.days.map(() => []); out.exercises = P.days.map((d, di) => P.byDay[di].filter((i) => nN[i] !== undefined).reduce((a, i) => a + P.GD[i].K, 0));
  weeks.forEach((n, wi) => {
    const bad = anyBroken(n, capW(wi + 1)); if (bad) { if (/minutes/.test(bad)) chk.minutes++; else chk.session++; }
    P.days.forEach((d, di) => out.minutes[di].push(+((dayUnits(P, di, n) / Q) + I.days[di].fixed + ath(di, wi + 1)).toFixed(1)));
    for (const h of kept) { if (credit(P, n, h) < P.floor4[h]) chk.floor++; if (direct(P, n, h) > C[h]) chk.ceiling++; if (credit(P, n, h) > 4 * C[h] + opt.spill) chk.spill++; }
    const x = slots(n), tot = Object.values(x).reduce((a, b) => a + b, 0), cr = kept.map((h) => credit(P, n, h));
    for (const a of P.GD) if (n[a.id] !== undefined) { const v = a.x[n[a.id]]; for (let k = 0; k + 1 < v.length; k++) if (v[k] < v[k + 1] || v[0] - v[v.length - 1] > 1) chk.shape++; }
    if (prevSlots) {
      for (const id of Object.keys(x)) if (x[id] < prevSlots[id]) chk.slotDrop++;
      kept.forEach((h, k) => { const ds = st.sched[k][wi] - st.sched[k][wi - 1]; if (ds > 1 || ds < 0) chk.groupStep++; const cs = cr[k] - prevCred[k]; if (cs > Math.max(4, Math.floor((7 * prevCred[k]) / 100)) + Math.max(2, inflow[h]) || cs < 0) chk.creditedStep++; });
      if (tot - prevTot > Math.max(1, Math.floor((opt.rule === 7 ? 7 * prevTot : 10 * prevTot - 1) / 100))) chk.totalStep++;
      if (wi === N - 1 && tot < Math.max(...st.tot)) chk.lastNotHardest++;
    }
    prevSlots = x; prevTot = tot; prevCred = cr;
  });
  chk.uneven += even({ ...nN }, capN, n1, null, false) + even({ ...n1 }, cap1, null, nN, true);
  Object.assign(out, { kept: kept.map((h) => P.groups[h]), keptIdx: kept, S, C, Ceff, n1, nN, st, seq, weeks, chk, blocked, ladderSteps, opened, active, direct: (n, h) => direct(P, n, h), credit: (n, h) => credit(P, n, h) });
  return out;
}

export function report(name, I, r, N = 12) {
  const P = r.P, L = [];
  L.push(`\n## ${name}`);
  L.push(`kept (keep order): ${r.kept.join(', ') || '-'}; not trained directly: ${r.dropped.join(', ') || '-'}; exact oracle: ${r.calls} calls, ${r.nodes} nodes in all (largest selection call ${r.sel.maxNodes}), unknown ${r.sel.unknown}`);
  if (!r.weeks) return L;
  L.push('  group     start/ceiling  days x exercises      credited weekly sets, week 1..' + N + '                                           direct    stops because');
  r.keptIdx.forEach((h, k) => {
    const str = r.active(h).map((i) => `${P.days[P.GD[i].di].wd} ${P.GD[i].K}`).join(', ');
    L.push(`  ${P.groups[h].padEnd(9)} ${String(r.S[h]).padStart(2)}/${String(r.C[h]).padStart(2)}${r.Ceff[h] !== r.C[h] ? `(${r.Ceff[h]})` : '    '}     ${str.padEnd(20)}  ${r.weeks.map((n) => (r.credit(n, h) / 4).toFixed(2).replace(/\.00$/, '').padStart(5)).join(' ')}   ${String(r.st.sched[k][0]).padStart(2)} -> ${String(r.st.sched[k][N - 1]).padStart(2)}  ${r.blocked.get(h) || ''}`);
  });
  for (const g of P.groups) if (!r.kept.includes(g)) L.push(`  ${g.padEnd(9)} not trained directly; compound credit week 1 ${(r.credit(r.weeks[0], P.gidx[g]) / 4).toFixed(2)} -> week ${N} ${(r.credit(r.weeks[N - 1], P.gidx[g]) / 4).toFixed(2)}`);
  L.push(`  total direct sets: ${r.st.tot.join(' ')}`);
  L.push(`  weekly rise %:     ${r.st.tot.slice(1).map((t, i) => ((100 * (t - r.st.tot[i])) / r.st.tot[i]).toFixed(1)).join(' ')}`);
  L.push(`  stairway: groups stepping onto their peak in week ${N}: ${r.st.land} of ${r.st.climbing}; flat weeks ${r.st.flats} (in the last third ${r.st.lateFlats}); DP states ${r.st.states}`);
  L.push(`  minutes per day with every pair supersetted, week 1 -> ${N} (chosen ${I.o.minutes}): ${P.days.map((d, di) => `${d.wd} ${r.minutes[di][0]} -> ${r.minutes[di][N - 1]}`).join(', ')}; resistance exercises per day ${r.exercises.join(' / ')}`);
  const c = r.chk;
  L.push(`  checks on all ${N} weeks: days over the minutes ${c.minutes}, over a session ceiling ${c.session}, group-weeks under the floor ${c.floor}, over the ceiling ${c.ceiling}, helper spill over 1 set ${c.spill}, slots that lost a set ${c.slotDrop}, staircase breaks ${c.shape}, group steps over 1 set ${c.groupStep}, credited steps over the limit ${c.creditedStep}, total rises over the limit ${c.totalStep}, last week not the hardest ${c.lastNotHardest}, evening moves still possible ${c.uneven}`);
  L.push(`  work: ladder steps ${r.ladderSteps}, exercises opened ${r.opened}, evening moves ${r.evenPeak} + ${r.evenWeek1}`);
  for (const n of r.notes) L.push('  note: ' + n);
  return L;
}
