// Judge 3 (engineering) feasibility probe - NOT a design, NOT engine code.
// Question: once the structure is fixed (which groups are trained on which days), does the endpoint dosing need a MILP at all?
// The coach's own placement rules (R3-VOL-03: the exposure that is behind gets the set; VOL-07: 2/2/2 -> 3/2/2 -> 3/3/2 ...)
// make the slot vector a deterministic, house-monotone FUNCTION P of the weekly direct sets per group D. Then
//   * "does this target vector fit the minutes?" is ONE evaluation of P (no search),
//   * the feasible set in D-space is down-closed for the minutes, so the smallest worst shortfall is a threshold scan,
//   * the weeks in between are P(D_w): no slot ever loses a set, and every week sits between the two proven endpoints.
// This script measures what that restriction costs against the research prototype's proven MILP optimum on the same
// instance and the same structure, and what it saves in runtime.
// Reads design/research/*.mjs and model/*.json (read-only). Run: node design/judge3/ladder_probe.mjs
import fs from 'node:fs';
const RESEARCH = new URL('../research/', import.meta.url);
const { buildInstance, selectGroups, dose } = await import(new URL('proto_endpoint.mjs', RESEARCH));
const { flowSchedule } = await import(new URL('proto_stairway_flow.mjs', RESEARCH));
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
const Q = 2000, FIT = R.session.time_fit.fit_factor;

/** the planner-as-functions core for one instance with a fixed structure */
export function ladder(I, sel, N = 12) {
  const kept = sel.kept, focus = I.o.focus || [];
  const trained = (g, di) => kept.includes(g) && sel.days[`${g}|${di}`] === 1;
  const slotsOf = {}, daysOf = {};
  for (const g of kept) { slotsOf[g] = {}; daysOf[g] = []; I.days.forEach((d, di) => { if (!trained(g, di)) return; const ss = d.slots.filter((s) => s.group === g); if (ss.length) { slotsOf[g][di] = ss; daysOf[g].push(di); } }); }
  const pairs = I.days.map((d, di) => (d.pairs || []).filter((p) => trained(p.a.group, di) && trained(p.b.group, di)));
  const inPair = new Set(pairs.flatMap((ps) => ps.flatMap((p) => [p.a.id, p.b.id])));
  const active = I.days.map((d, di) => d.slots.filter((s) => trained(s.group, di)));
  const structMin = {}, structMax = {};
  for (const g of kept) { structMin[g] = 0; structMax[g] = 0; for (const di of daysOf[g]) for (const s of slotsOf[g][di]) { structMin[g] += s.min; structMax[g] += s.max; } }
  const climb = (g) => (g === 'calves' ? 1 : 2);
  let evals = 0;

  /** P for one group: weekly direct sets -> sets per slot (R3-VOL-03 across days, VOL-07 inside the day); null = does not exist */
  const memo = new Map();
  function place(g, total) {
    const key = g + '|' + total; if (memo.has(key)) return memo.get(key);
    let out = null;
    if (total >= structMin[g] && total <= structMax[g]) {
      const cur = {}; for (const di of daysOf[g]) for (const s of slotsOf[g][di]) cur[s.id] = s.min;
      const dayTot = (di) => slotsOf[g][di].reduce((a, s) => a + cur[s.id], 0);
      let last = -1, ok = true;
      for (let k = structMin[g]; k < total && ok; k++) {
        const ds = daysOf[g].filter((di) => slotsOf[g][di].some((s) => cur[s.id] < s.max));
        if (!ds.length) { ok = false; break; }
        const low = Math.min(...ds.map(dayTot)); const cand = ds.filter((di) => dayTot(di) === low);
        const di = cand.find((x) => x > last) ?? cand[0]; last = di;
        const ss = slotsOf[g][di].filter((s) => cur[s.id] < s.max), first = slotsOf[g][di][0];
        const s = ss.find((x) => cur[x.id] < cur[first.id]) || ss[0]; cur[s.id]++;
      }
      if (ok) out = cur;
    }
    memo.set(key, out); return out;
  }
  const sets = (D) => { const x = {}; for (const g of kept) { const p = place(g, D[g]); if (!p) return null; Object.assign(x, p); } return x; };
  const athOf = (d, w) => d.athMin * (1 + ((I.o.athleticPeak || 1) - 1) * (w - 1) / Math.max(1, N - 1));
  /** integer day time, the same arithmetic as the research MILP rows */
  function dayUnits(di, x) { let t = 0; for (const s of active[di]) { t += Math.round(Q * s.cost) * x[s.id]; if (inPair.has(s.id)) t -= Math.round(Q * 0.35 * s.cost) * x[s.id]; } return t + Q * (active[di].length - pairs[di].length); }
  const dayCap = (di, w, minutes = I.o.minutes) => Math.floor(Q * (minutes * FIT - I.days[di].fixed - athOf(I.days[di], w)));
  const credit4 = (g, x) => I.days.reduce((a, d, di) => a + active[di].reduce((b, s) => b + (s.cr[g] ? s.cr[g] * x[s.id] : 0), 0), 0);
  function shapeOk(x) {
    for (let di = 0; di < I.days.length; di++) {
      const d = I.days[di], byG = {};
      for (const s of active[di]) (byG[s.group] = byG[s.group] || []).push(s);
      for (const [g, ss] of Object.entries(byG)) {
        for (let i = 0; i + 1 < ss.length; i++) { if (ss[i].bucket === 'ISO_CALF' || ss[i + 1].bucket === 'ISO_CALF') continue; const a = x[ss[i].id], b = x[ss[i + 1].id]; if (a < b || a > b + 1) return 'VOL-07'; }
        if (active[di].reduce((a, s) => a + (s.cr[g] ? s.cr[g] * x[s.id] : 0), 0) > (focus.includes(g) ? 56 : 44)) return 'session ceiling';
      }
      if (d.twin) { const ei = I.days.indexOf(d.twin); if (ei > di) for (let k = 0; k < d.slots.length; k++) { const a = x[d.slots[k].id], b = x[d.twin.slots[k].id]; if (a !== undefined && b !== undefined && Math.abs(a - b) > 1) return 'twin'; } }
    }
    return null;
  }
  const D1of = (DN) => { const D1 = {}; for (const g of kept) D1[g] = Math.min(Math.max(I.S[g], structMin[g]), DN[g] - climb(g)); return D1; };
  /** the whole feasibility test of an endpoint pair: a handful of sums, no search */
  function check(DN, minutes) {
    evals++;
    // floors: credits only grow with sets, so they hold for some week 1 iff they hold at the largest one (peak - climb)
    const D1 = {}; for (const g of kept) D1[g] = DN[g] - climb(g);
    for (const g of kept) if (D1[g] < structMin[g] || DN[g] > I.C[g]) return 'range';
    const x1 = sets(D1), xN = sets(DN); if (!x1 || !xN) return 'range';
    for (const g of kept) if (credit4(g, x1) < 4 * I.floor(g)) return 'floor ' + g;
    const sh = shapeOk(x1) || shapeOk(xN); if (sh) return sh;
    for (let di = 0; di < I.days.length; di++) { if (dayUnits(di, x1) > dayCap(di, 1, minutes)) return 'time w1 ' + I.days[di].wd; if (dayUnits(di, xN) > dayCap(di, N, minutes)) return 'time wN ' + I.days[di].wd; }
    return null;
  }
  // 1. the smallest endpoint: every kept group at its structural minimum + climb, raised only as far as its own floor needs
  const lowDN = {}; for (const g of kept) lowDN[g] = structMin[g] + climb(g);
  // a floor that fails: the group itself gets the set; when it is full, the first group (keep order) whose sets credit it (helper credit)
  const helpers = (g) => kept.filter((h) => h !== g && I.days.some((d, di) => active[di].some((s) => s.group === h && s.cr[g])));
  for (let guard = 0; guard < 400; guard++) {
    const why = check(lowDN); if (!why || !why.startsWith('floor ')) break;
    const g = why.slice(6); const room = (h) => lowDN[h] < Math.min(I.C[h], structMax[h]);
    const h = room(g) ? g : helpers(g).find(room);
    if (!h) return { ok: false, why, evals };
    lowDN[h]++;
  }
  const base = check(lowDN); if (base) return { ok: false, why: base, evals };
  // 2. smallest worst shortfall: threshold scan (the minutes are monotone in D, so the first level that fits is the optimum)
  const at = (L) => { const DN = {}; for (const g of kept) DN[g] = Math.max(lowDN[g], Math.min(I.C[g], I.C[g] - L)); return DN; };
  let L = 0; while (check(at(L))) L++;
  const DN = at(L);
  // 3. water-filling inside that level: the group furthest from its ceiling first, ties by the coach's keep order
  for (;;) {
    const order = kept.map((g, i) => ({ g, i, short: I.C[g] - DN[g] })).filter((o) => o.short > 0).sort((a, b) => b.short - a.short || a.i - b.i);
    let moved = false;
    for (const o of order) { DN[o.g]++; if (!check(DN)) { moved = true; break; } DN[o.g]--; }
    if (!moved) break;
  }
  // week 1: the level start where the peak allows it, raised only as far as the floors need (own sets first, then a helper's)
  const D1 = D1of(DN);
  for (let guard = 0; guard < 400; guard++) {
    const x1 = sets(D1); const g = kept.find((h) => credit4(h, x1) < 4 * I.floor(h)); if (!g) break;
    const room = (h) => D1[h] < DN[h] - climb(h); const h = room(g) ? g : helpers(g).find(room);
    if (!h) return { ok: false, why: 'floor ' + g + ' (week 1 repair)', evals };
    D1[h]++;
  }
  const short = kept.map((g) => I.C[g] - DN[g]);
  // 4. the weeks in between: the flow stairway on the group totals, then P again (house-monotone: no slot ever loses a set)
  const lines = kept.map((g) => ({ n: g, S: D1[g], C: DN[g] })).filter((l) => l.C > l.S);
  let weekViol = 0, slotDrops = 0, flat = 0, weeksErr = null; const totals = [];
  try {
    const { sched } = flowSchedule(lines, N); let prev = null;
    for (let w = 1; w <= N; w++) {
      const D = {}; for (const g of kept) { const li = lines.findIndex((l) => l.n === g); D[g] = li < 0 ? D1[g] : sched[li][w - 1]; }
      const x = sets(D);
      for (let di = 0; di < I.days.length; di++) if (dayUnits(di, x) > dayCap(di, w)) weekViol++;
      for (const g of kept) if (credit4(g, x) < 4 * I.floor(g)) weekViol++;
      if (shapeOk(x)) weekViol++;
      const tot = Object.values(x).reduce((a, b) => a + b, 0); totals.push(tot);
      if (prev) { for (const id of Object.keys(x)) if (x[id] < prev[id]) slotDrops++; if (tot === totals[w - 2]) flat++; }
      prev = x;
    }
  } catch (e) { weeksErr = e.message.slice(0, 60); }
  return { ok: true, T1: Math.max(...short), T2: short.reduce((a, b) => a + b, 0), T3: kept.reduce((a, g) => a + Math.abs(D1[g] - I.S[g]), 0), DN, D1, evals, weekViol, slotDrops, flat, totals, weeksErr, check };
}


/**
 * Variant 2: the same idea as a sequential construction that looks at the minutes while it places. One set is added at a
 * time: to the group furthest from its ceiling (ties: the coach's keep order), on the exposure that is behind UNLESS that
 * day is full (then the next one), inside the day by VOL-07. Each group's sets are remembered in the order they were added,
 * so week w is a prefix of that order: no slot ever loses a set and every week sits under the peak week's minutes.
 */
export function ladderSeq(I, sel, N = 12) {
  const kept = sel.kept, focus = I.o.focus || [];
  const trained = (g, di) => kept.includes(g) && sel.days[`${g}|${di}`] === 1;
  const slotsOf = {}, daysOf = {};
  for (const g of kept) { slotsOf[g] = {}; daysOf[g] = []; I.days.forEach((d, di) => { if (!trained(g, di)) return; const ss = d.slots.filter((s) => s.group === g); if (ss.length) { slotsOf[g][di] = ss; daysOf[g].push(di); } }); }
  const pairs = I.days.map((d, di) => (d.pairs || []).filter((p) => trained(p.a.group, di) && trained(p.b.group, di)));
  const inPair = new Set(pairs.flatMap((ps) => ps.flatMap((p) => [p.a.id, p.b.id])));
  const active = I.days.map((d, di) => d.slots.filter((s) => trained(s.group, di)));
  const climb = (g) => (g === 'calves' ? 1 : 2);
  const athOf = (d, w) => d.athMin * (1 + ((I.o.athleticPeak || 1) - 1) * (w - 1) / Math.max(1, N - 1));
  const dayUnits = (di, x) => { let t = 0; for (const s of active[di]) { t += Math.round(Q * s.cost) * x[s.id]; if (inPair.has(s.id)) t -= Math.round(Q * 0.35 * s.cost) * x[s.id]; } return t + Q * (active[di].length - pairs[di].length); };
  const dayCap = (di, w) => Math.floor(Q * (I.o.minutes * FIT - I.days[di].fixed - athOf(I.days[di], w)));
  const credit4 = (g, x) => I.days.reduce((a, d, di) => a + active[di].reduce((b, s) => b + (s.cr[g] ? s.cr[g] * x[s.id] : 0), 0), 0);
  function shapeOk(x) {
    for (let di = 0; di < I.days.length; di++) {
      const d = I.days[di], byG = {};
      for (const s of active[di]) (byG[s.group] = byG[s.group] || []).push(s);
      for (const [g, ss] of Object.entries(byG)) {
        for (let i = 0; i + 1 < ss.length; i++) { if (ss[i].bucket === 'ISO_CALF' || ss[i + 1].bucket === 'ISO_CALF') continue; const a = x[ss[i].id], b = x[ss[i + 1].id]; if (a < b || a > b + 1) return 'VOL-07'; }
        if (active[di].reduce((a, s) => a + (s.cr[g] ? s.cr[g] * x[s.id] : 0), 0) > (focus.includes(g) ? 56 : 44)) return 'session ceiling';
      }
      if (d.twin) { const ei = I.days.indexOf(d.twin); if (ei > di) for (let k = 0; k < d.slots.length; k++) { const a = x[d.slots[k].id], b = x[d.twin.slots[k].id]; if (a !== undefined && b !== undefined && Math.abs(a - b) > 1) return 'twin'; } }
    }
    return null;
  }
  const x = {}, base = {}, seq = {}, D = {}, structMin = {}, last = {};
  for (const g of kept) { seq[g] = []; structMin[g] = 0; for (const di of daysOf[g]) for (const s of slotsOf[g][di]) { x[s.id] = s.min; base[s.id] = s.min; structMin[g] += s.min; } D[g] = structMin[g]; }
  let steps = 0;
  for (let di = 0; di < I.days.length; di++) if (dayUnits(di, x) > dayCap(di, N)) return { ok: false, why: 'the minimum structure does not fit ' + I.days[di].wd, steps };
  const dayTot = (g, di) => slotsOf[g][di].reduce((a, s) => a + x[s.id], 0);
  function inc(g) {
    if (D[g] >= I.C[g]) return false;
    const after = last[g] ?? -1;
    const ds = daysOf[g].filter((di) => slotsOf[g][di].some((s) => x[s.id] < s.max))
      .sort((a, b) => dayTot(g, a) - dayTot(g, b) || (a > after ? 0 : 1) - (b > after ? 0 : 1) || a - b);
    for (const di of ds) {
      steps++;
      const ss = slotsOf[g][di].filter((s) => x[s.id] < s.max), first = slotsOf[g][di][0];
      const s = ss.find((z) => x[z.id] < x[first.id]) || ss[0];
      x[s.id]++;
      if (dayUnits(di, x) <= dayCap(di, N) && !shapeOk(x)) { last[g] = di; seq[g].push(s.id); D[g]++; return true; }
      x[s.id]--;
    }
    return false;
  }
  const prefix = (Dw) => { const y = { ...base }; for (const g of kept) for (let k = 0; k < Dw[g] - structMin[g]; k++) y[seq[g][k]]++; return y; };
  const D1of = () => { const D1 = {}; for (const g of kept) D1[g] = Math.min(Math.max(I.S[g], structMin[g]), D[g] - climb(g)); return D1; };
  // the minimums of a trained group first: the climb, then its own floor in week 1
  const helpers = (g) => kept.filter((h) => h !== g && I.days.some((d, di) => active[di].some((s) => s.group === h && s.cr[g])));
  const D1max = () => { const D1 = {}; for (const g of kept) D1[g] = D[g] - climb(g); return D1; };
  for (const g of kept) while (D[g] < structMin[g] + climb(g)) if (!inc(g)) return { ok: false, why: 'no room for the climb of ' + g, steps };
  // floors at the largest allowed week 1: the group itself gets the set, else the first group whose sets credit it
  for (let guard = 0; guard < 400; guard++) {
    const x1 = prefix(D1max()); const g = kept.find((h) => credit4(h, x1) < 4 * I.floor(h));
    if (!g) break;
    if (!inc(g) && !helpers(g).some((h) => inc(h))) return { ok: false, why: 'no room for the floor of ' + g, steps };
  }
  // then every group toward its ceiling, the one furthest from it first
  for (;;) {
    const order = kept.map((g, i) => ({ g, i, short: I.C[g] - D[g] })).filter((o) => o.short > 0).sort((a, b) => b.short - a.short || a.i - b.i);
    if (!order.some((o) => inc(o.g))) break;
  }
  const D1 = D1of(), short = kept.map((g) => I.C[g] - D[g]);
  for (let guard = 0; guard < 400; guard++) {
    const x1 = prefix(D1); const g = kept.find((h) => credit4(h, x1) < 4 * I.floor(h)); if (!g) break;
    const room = (h) => D1[h] < D[h] - climb(h); const h = room(g) ? g : helpers(g).find(room);
    if (!h) return { ok: false, why: 'floor ' + g + ' (week 1 repair)', steps };
    D1[h]++;
  }
  const lines = kept.map((g) => ({ n: g, S: D1[g], C: D[g] })).filter((l) => l.C > l.S);
  let weekViol = 0, slotDrops = 0, flat = 0, weeksErr = null; const totals = [], weeks = [];
  try {
    const { sched } = flowSchedule(lines, N); let prev = null;
    for (let w = 1; w <= N; w++) {
      const Dw = {}; for (const g of kept) { const li = lines.findIndex((l) => l.n === g); Dw[g] = li < 0 ? D1[g] : sched[li][w - 1]; }
      const y = prefix(Dw); weeks.push(y);
      for (let di = 0; di < I.days.length; di++) if (dayUnits(di, y) > dayCap(di, w)) weekViol++;
      for (const g of kept) if (credit4(g, y) < 4 * I.floor(g)) weekViol++;
      if (shapeOk(y)) weekViol++;
      const tot = Object.values(y).reduce((a, b) => a + b, 0); totals.push(tot);
      if (prev) { for (const id of Object.keys(y)) if (y[id] < prev[id]) slotDrops++; if (tot === totals[w - 2]) flat++; }
      prev = y;
    }
  } catch (e) { weeksErr = e.message.slice(0, 60); }
  return { ok: true, T1: Math.max(...short), T2: short.reduce((a, b) => a + b, 0), T3: kept.reduce((a, g) => a + Math.abs(D1[g] - I.S[g]), 0), DN: { ...D }, D1, steps, weekViol, slotDrops, flat, totals, weeks, weeksErr };
}

// ----------------------------------------------------------------------------------------------- the comparison
if (import.meta.url === `file://${process.argv[1]}`) {
  const FAMS = (process.env.FAMS || 'aesthetics,athletic').split(','), DAYS = (process.env.DAYS || '2,3,4').split(',').map(Number);
  const LIMIT = +(process.env.LIMIT || 3000);
  const OUT = new URL('./ladder_probe.jsonl', import.meta.url); fs.writeFileSync(OUT, '');
  for (const family of FAMS) for (const days of DAYS) for (const minutes of [30, 45, 60, 75, 90, 105, 120]) for (const level of ['L1', 'L2', 'L3']) {
    const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
    const row = { family, days, minutes, level };
    const I = buildInstance({ family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 });
    if (!I.present.length) continue;
    const sel = selectGroups(I); row.kept = sel.kept.length; row.present = I.present.length;
    if (!sel.kept.length) { row.note = 'no group fits'; fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); continue; }
    let t = cpu(); const lad = ladder(I, sel); row.ladderCpuMs = +(cpu() - t).toFixed(2);
    row.ladder = lad.ok ? { T1: lad.T1, T2: lad.T2, T3: lad.T3, evals: lad.evals, weekViol: lad.weekViol, slotDrops: lad.slotDrops, flat: lad.flat, weeksErr: lad.weeksErr } : { fail: lad.why, evals: lad.evals };
    t = cpu(); const seqr = ladderSeq(I, sel); row.seqCpuMs = +(cpu() - t).toFixed(2);
    row.seq = seqr.ok ? { T1: seqr.T1, T2: seqr.T2, T3: seqr.T3, steps: seqr.steps, weekViol: seqr.weekViol, slotDrops: seqr.slotDrops, flat: seqr.flat, weeksErr: seqr.weeksErr } : { fail: seqr.why, steps: seqr.steps };
    t = cpu(); const { r } = dose(I, sel, { nodeLimit: LIMIT }); row.milpCpuMs = Math.round(cpu() - t);
    row.milp = { status: r.status, tiers: r.report.map((x) => x.value), proven: r.report.map((x) => x.status === 'optimal'), nodes: r.report.reduce((a, x) => a + x.nodes, 0) };
    fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
  }
  console.log('done');
}
