// SPEC PROTOTYPE COPY of design/research/proto_endpoint.mjs (unchanged except three switches, all marked SPEC-PROTO):
//   CANON=1  adds the balanced-staircase row x_first - x_last <= 1 per group-day (the coach's VOL-07 staircase is the
//            balanced vector 2/2/2 -> 3/2/2 -> 3/3/2 ...; the research rows also admit 4/3/2)
//   NOTWIN=1 removes the twin-day rows (same structure on both exposures; per-slot sets within 1)
//   NOSINGLE=1 forbids a trained group-day with one exercise (calves excepted) - the 'never 1 exercise' rule
// Used only as an independent LP-based reference oracle for design/spec_proto/reduced.mjs. Not engine code.
// Research prototype (design/algorithm_research.md, section 6.4 / 7): the whole dosing chain on real templates.
//   1. R3-SES-02 step 2 as lexicographic group selection with an EXACT feasibility oracle (kernel.mjs)
//   2. endpoint dosing: week-1 and peak-week sets per slot as one lexicographic integer program
//   3. the weeks in between: min-cost-flow stairway on the group totals + house-monotone VOL-07 placement
//   4. a check of every week (time, floors, monotone, VOL-07 shape) - the "sandwich" guarantee in practice
//   5. R3-SES-02 step 1 offers computed exactly (the shortest session that trains every group / reaches every ceiling)
// Reads model/templates.json and model/rules.json (read-only). Simplifications are listed in SIMPLIFICATIONS below.
// Run: node design/research/proto_endpoint.mjs
import { readText, nowMs, env, isMain, print, repoFile } from '../research/env.mjs';
import { Model, solve, solveLex } from '../research/kernel.mjs';
import { solveMip, solveLexMip } from '../research/milp.mjs';
const SP_CANON = env.CANON === '1', SP_NOTWIN = env.NOTWIN === '1', SP_NOSINGLE = env.NOSINGLE === '1';   // SPEC-PROTO switches
const ENGINE = env.ENGINE || 'lp';   // 'lp' = LP-based B&B (milp.mjs), 'cp' = propagation-only DFS (kernel.mjs)
import { flowSchedule } from '../research/proto_stairway_flow.mjs';

const R = JSON.parse(readText(repoFile('model/rules.json')));
const TPL = JSON.parse(readText(repoFile('model/templates.json')));

export const SIMPLIFICATIONS = [
  'groups are dosed as group lines (hips = one line with the line start / cap; the engine keeps glutes and hamstrings lines)',
  'optional days, FOCUS slots, conditioning and tests are left out (the optional day would add room, not remove it)',
  'athletic stations hold their template sets; their peak-week minutes = week-1 minutes x athleticPeak (the real planner takes them from the athletic budget)',
  'calves: one exercise x 3-4 sets per leg day, floor = min(10, 3 x leg days) on the main days (the optional-day calves slot is left out)',
];

const GROUPS = ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves'];
const BUCKET_CLASS = { RP_BKD: 'BKD', RP_UKD: 'UKD', RP_BHD: 'BHD', RP_UHD: 'UHD', RP_HPUSH: 'HPUSH', RP_VPUSH: 'VPUSH', RP_HPULL: 'HPULL', RP_VPULL: 'VPULL',
  ISO_QUAD: 'LEG_EXTENSION', ISO_LEG_FLEXION: 'LEG_FLEXION', ISO_CHEST: 'ISO_CHEST', ISO_SIDE_REAR_DELT: 'ISO_SIDE', ISO_BICEP: 'ISO_BICEPS', ISO_TRICEP: 'ISO_TRICEPS', ISO_CALF: 'ISO_CALF' };
const ATH_CLASS = { AP_PLYO: 'plyo_or_ballistic', AP_JUMP_LIMITED_KNEE: 'plyo_or_ballistic', AP_THROW: 'throw', AP_TRIPLE_EXT: 'olympic', AP_COD: 'cod', AP_SPRINT: 'sprint' };
const TM = R.time_model;
const perSet = (tc) => TM.work_minutes[tc] + TM.rest_class_minutes[TM.rest_class_by_time_class[tc]];   // minutes per set incl. rest
const Q = 2000;                                     // time unit = 1/2000 min: every coefficient below is an exact integer
const groupOfMuscle = Object.fromEntries(Object.entries(R.muscles.groups.members).flatMap(([g, ms]) => ms.map((m) => [m, g])));

/** quarter-set group credits of one set (group credit capped at one set, R3-VOL-01) */
function groupCredits(bucket) {
  const cls = R.credit.classes[BUCKET_CLASS[bucket]] || {};
  const out = {};
  for (const [mus, c] of Object.entries(cls)) { const g = groupOfMuscle[mus]; if (g && GROUPS.includes(g)) out[g] = Math.min(4, (out[g] || 0) + Math.round(4 * c)); }
  return out;
}

export function buildInstance(o) {
  const fam = TPL.families[o.family], tpl = fam.days[String(o.days)];
  const lvl = o.level;
  const start = (g) => g === 'hips' ? R.volume.start.hamstrings[lvl] : g === 'back' ? R.volume.start.lats_upper_back[lvl] : g === 'calves' ? null : R.volume.start[g][lvl];
  const cap = (g) => g === 'hips' ? R.volume.cap.hamstrings[lvl] : g === 'back' ? R.volume.cap.lats_upper_back[lvl] : R.volume.cap[g][lvl];
  const maxSets = lvl === 'L1' ? 4 : 5;
  const days = [];
  for (const [wd, e] of Object.entries(tpl.week_layout)) {
    if (e.kind !== 'main') continue;
    const dt = tpl.day_types[e.day_type];
    const st = dt.stations.filter((s) => s.role !== 'warmup' && (s.include_from_minutes == null || s.include_from_minutes <= o.minutes));
    const core = st.filter((s) => s.block === 'core');
    const ath = st.filter((s) => ATH_CLASS[s.bucket] && !(o.noAthletic || []).includes(s.bucket));
    const slots = st.filter((s) => BUCKET_CLASS[s.bucket] && GROUPS.includes(s.group) && !(o.exclude || []).includes(s.group)).map((s) => {
      const b = TPL.buckets[s.bucket];
      const iso = b.kind === 'isolation';
      return { id: `${wd}.${s.id}`, bucket: s.bucket, group: s.group, tc: b.time_class, cost: perSet(b.time_class), cr: groupCredits(s.bucket), prime: s.group, ss: s.superset || null,
        min: s.bucket === 'ISO_CALF' ? 3 : 2, max: s.bucket === 'ISO_CALF' ? 4 : iso ? Math.min(4, maxSets) : maxSets };
    });
    const athMin = ath.reduce((a, s) => a + (s.sets_hint ? s.sets_hint[0] : 2) * perSet(ATH_CLASS[s.bucket]) + TM.changeover_min_per_exercise, 0);
    const fixed = TM.minutes_per_set.warmup_session + core.length * (2 * perSet('core_set') + TM.changeover_min_per_exercise);
    days.push({ wd, type: e.day_type, label: dt.label, slots, fixed, athMin, athCount: ath.length, sig: slots.map((s) => s.bucket).join(',') });
  }
  // twin days: identical resistance skeletons (Day A Monday / Day A Thursday) - R3-VOL-03 keeps them even
  days.forEach((d) => { d.twin = days.find((e) => e !== d && e.sig === d.sig && e.type[0] === d.type[0]) || null; });
  const legDays = days.filter((d) => d.slots.some((s) => s.bucket === 'ISO_CALF')).length;
  const present = GROUPS.filter((g) => days.some((d) => d.slots.some((s) => s.group === g)));
  const F = new Set(o.focus || []);
  const S = {}, C = {};
  for (const g of present) {
    if (g === 'calves') { S[g] = 3 * legDays; C[g] = Math.max(S[g] + 1, cap(g)); }
    else { S[g] = start(g) + (F.has(g) ? 2 : 0); C[g] = cap(g) + (F.has(g) ? 2 : 0); }
  }
  const floor = (g) => (g === 'calves' ? Math.min(10, 3 * legDays) : R.volume.floor.value);
  return { o, days, present, S, C, floor, legDays, athlete: o.family === 'athletic' };
}

/** the integer program; fixZ = {group: 0|1} decided so far */
export function buildModel(I, { minutes = I.o.minutes, mode = "dose" } = {}) {
  const m = new Model();
  const V = { z: {}, t: {}, x1: {}, xN: {}, pa: {}, u: {}, v1: {}, vN: {} };
  const keep = I.o.keepOrder.filter((g) => I.present.includes(g));
  for (const g of keep) V.z[g] = m.bool(`z.${g}`);
  I.days.forEach((d, di) => { V.u[di] = m.bool(`ss.${d.wd}`, 'down'); });
  for (const g of keep) I.days.forEach((d, di) => { if (d.slots.some((s) => s.group === g)) V.t[`${g}|${di}`] = m.bool(`t.${g}.${d.wd}`); });
  I.days.forEach((d, di) => {
    const tags = {}; d.slots.forEach((s) => { if (s.ss) (tags[s.ss] = tags[s.ss] || []).push(s); });
    d.pairs = Object.entries(tags).filter(([, a]) => a.length === 2 && a[0].group !== a[1].group).map(([tag, a]) => ({ tag, a: a[0], b: a[1] }));
    d.pairs.forEach((p) => { V.pa[`${di}|${p.tag}`] = m.bool(`pair.${d.wd}.${p.tag}`, 'down'); });
  });
  for (const g of keep) I.days.forEach((d, di) => d.slots.filter((s) => s.group === g).forEach((s) => {
    V.xN[s.id] = m.int(0, s.max, `xN.${s.id}`, 'up'); V.x1[s.id] = m.int(0, s.max, `x1.${s.id}`, 'down');
  }));
  I.days.forEach((d, di) => d.pairs.forEach((p) => [p.a, p.b].forEach((s) => { V.v1[s.id] = m.int(0, s.max, `v1.${s.id}`); V.vN[s.id] = m.int(0, s.max, `vN.${s.id}`); })));
  const big = 1000;
  // structure: a group trained directly is trained on >= 1 day; a day that trains it holds all its template slots (2-4)
  for (const g of keep) {
    const ts = Object.keys(V.t).filter((k) => k.startsWith(g + '|')).map((k) => V.t[k]);
    for (const t of ts) m.lin([[1, t], [-1, V.z[g]]], '<=', 0, 'trained day -> trained group');
    m.lin([[1, V.z[g]], ...ts.map((t) => [-1, t])], '<=', 0, 'trained group -> a day');
  }
  I.days.forEach((d, di) => {
    if (d.twin && !SP_NOTWIN) { const ei = I.days.indexOf(d.twin); if (ei > di) for (const g of keep) { const a = V.t[`${g}|${di}`], b = V.t[`${g}|${ei}`]; if (a !== undefined && b !== undefined) m.lin([[1, a], [-1, b]], '=', 0, 'twin days even'); } }
    const byG = {};
    d.slots.forEach((s) => (byG[s.group] = byG[s.group] || []).push(s));
    for (const [g, ss] of Object.entries(byG)) {
      if (V.z[g] === undefined) continue;   // (a variable index can be 0: never test it for truthiness)
      const t = V.t[`${g}|${di}`];
      for (const s of ss) for (const X of [V.x1, V.xN]) { m.lin([[1, X[s.id]], [-s.min, t]], '>=', 0, 'min sets'); m.lin([[1, X[s.id]], [-s.max, t]], '<=', 0, 'max sets'); }
      for (const s of ss) m.lin([[1, V.x1[s.id]], [-1, V.xN[s.id]]], '<=', 0, 'monotone in the block');
      // VOL-07: earlier exercise of the group that day >= later, at most one set apart (2/2/2 -> 3/2/2 -> 3/3/2 ...)
      for (let i = 0; i + 1 < ss.length; i++) for (const X of [V.x1, V.xN]) {
        if (ss[i].bucket === 'ISO_CALF' || ss[i + 1].bucket === 'ISO_CALF') continue;
        m.lin([[1, X[ss[i].id]], [-1, X[ss[i + 1].id]]], '>=', 0, 'VOL-07 order'); m.lin([[1, X[ss[i].id]], [-1, X[ss[i + 1].id]]], '<=', 1, 'VOL-07 order');
      }
      // SPEC-PROTO: balanced staircase (first - last <= 1) and never-1-exercise
      if (SP_CANON) { const nc = ss.filter((s) => s.bucket !== 'ISO_CALF'); if (nc.length > 2) for (const X of [V.x1, V.xN]) m.lin([[1, X[nc[0].id]], [-1, X[nc[nc.length - 1].id]]], '<=', 1, 'VOL-07 balanced'); }
      if (SP_NOSINGLE && g !== 'calves' && ss.length < 2) m.lin([[1, t]], '=', 0, 'never 1 exercise');
      // per-session ceiling 11 credited sets for the group (14 for a Focus group)
      const cap11 = (I.o.focus || []).includes(g) ? 56 : 44;
      for (const X of [V.x1, V.xN]) m.lin(d.slots.filter((s) => s.cr[g] && V.z[s.group] !== undefined).map((s) => [s.cr[g], X[s.id]]), '<=', cap11, 'session ceiling');
    }
    if (d.twin && !SP_NOTWIN) { const ei = I.days.indexOf(d.twin); if (ei > di) d.slots.forEach((s, k) => { const s2 = d.twin.slots[k]; if (V.z[s.group] !== undefined) for (const X of [V.x1, V.xN]) { m.lin([[1, X[s.id]], [-1, X[s2.id]]], '<=', 1, 'twin even'); m.lin([[1, X[s.id]], [-1, X[s2.id]]], '>=', -1, 'twin even'); } }); }
    // supersets (R3-SES-02 step 3): a pair runs as a superset only when both groups are trained that day and the day uses supersets
    d.pairs.forEach((p) => {
      const pa = V.pa[`${di}|${p.tag}`];
      for (const s of [p.a, p.b]) { const t = V.t[`${s.group}|${di}`]; if (t === undefined) m.lin([[1, pa]], '=', 0, 'pair off'); else m.lin([[1, pa], [-1, t]], '<=', 0, 'pair needs both'); }
      m.lin([[1, pa], [-1, V.u[di]]], '<=', 0, 'supersets only on days that use them');
      for (const s of [p.a, p.b]) for (const [X, Y] of [[V.x1, V.v1], [V.xN, V.vN]]) {
        if (X[s.id] === undefined) { m.lin([[1, Y[s.id]]], '=', 0, 'v off'); continue; }
        m.lin([[1, Y[s.id]], [-1, X[s.id]]], '<=', 0, 'v<=x'); m.lin([[1, Y[s.id]], [-s.max, pa]], '<=', 0, 'v<=pa'); m.lin([[1, Y[s.id]], [-1, X[s.id]], [-s.max, pa]], '>=', -s.max, 'v>=x if pa');
      }
    });
    // time (work + dosed rest per set, 1 min changeover per exercise, superset pair x 0.65 and 0.5 min changeovers)
    const fit = R.session.time_fit.fit_factor;
    for (const [X, Y, ath] of [[V.x1, V.v1, d.athMin], [V.xN, V.vN, d.athMin * (I.o.athleticPeak || 1)]]) {
      const terms = [];
      for (const s of d.slots) if (X[s.id] !== undefined) {
        terms.push([Math.round(Q * s.cost), X[s.id]]);
        if (Y[s.id] !== undefined) terms.push([-Math.round(Q * 0.35 * s.cost), Y[s.id]]);
      }
      for (const [k, t] of Object.entries(V.t)) { const [g, dj] = k.split('|'); if (+dj === di) terms.push([Q * d.slots.filter((s) => s.group === g).length, t]); }
      d.pairs.forEach((p) => terms.push([-Q, V.pa[`${di}|${p.tag}`]]));
      m.lin(terms, '<=', Math.floor(Q * (minutes * fit - d.fixed - ath)), `time ${d.wd}`);
    }
    // field athletes: at most 12 exercises (athletic stations + resistance), core and warm-up outside the cap (R2-SES-04)
    if (I.athlete) m.lin(Object.entries(V.t).filter(([k]) => +k.split('|')[1] === di).map(([k, t]) => [d.slots.filter((s) => s.group === k.split('|')[0]).length, t]), '<=', R.session.athlete_cap - d.athCount, 'athlete cap 12');
  });
  // weekly group targets (main days): floor in week 1, climb to the peak, peak <= ceiling (direct sets)
  const credit = (g, X) => I.days.flatMap((d) => d.slots.filter((s) => s.cr[g] && X[s.id] !== undefined).map((s) => [s.cr[g], X[s.id]]));
  const direct = (g, X) => I.days.flatMap((d) => d.slots.filter((s) => s.prime === g && X[s.id] !== undefined).map((s) => [1, X[s.id]]));
  const short = {}, dev = {};
  let Mx = null;
  if (mode === 'dose') Mx = m.int(0, 40, 'max shortfall', 'down');
  for (const g of keep) {
    m.lin([...credit(g, V.x1), [-4 * I.floor(g), V.z[g]]], '>=', 0, `floor ${g}`);
    m.lin([...direct(g, V.xN), ...direct(g, V.x1).map(([c, v]) => [-c, v]), [-(g === 'calves' ? 1 : 2), V.z[g]]], '>=', 0, `climb ${g}`);
    m.lin(direct(g, V.xN), '<=', I.C[g], `ceiling ${g}`);
    if (mode === 'dose') {
      short[g] = m.int(0, 40, `short.${g}`, 'down');
      m.lin([[1, short[g]], ...direct(g, V.xN), [-I.C[g], V.z[g]]], '>=', 0, `shortfall ${g}`);
      m.lin([[1, Mx], [-1, short[g]]], '>=', 0, 'max shortfall');
      dev[g] = m.int(0, 60, `dev.${g}`, 'down');
      m.lin([[1, dev[g]], ...direct(g, V.x1).map(([c, v]) => [-c, v]), [I.S[g], V.z[g]]], '>=', 0, `start dev+ ${g}`);
      m.lin([[1, dev[g]], ...direct(g, V.x1), [-I.S[g], V.z[g]]], '>=', 0, `start dev- ${g}`);
    }
  }
  // branching order: structure first (by priority), then the peak / week-1 sets of the groups in priority order
  m.order = [...keep.map((g) => V.z[g]), ...keep.flatMap((g) => Object.entries(V.t).filter(([k]) => k.startsWith(g + '|')).map(([, v]) => v)),
    ...Object.values(V.u), ...Object.values(V.pa),
    ...keep.flatMap((g) => I.days.flatMap((d) => d.slots.filter((s) => s.group === g).flatMap((s) => [V.xN[s.id], V.x1[s.id]]))), ...(Mx !== null ? [Mx] : [])];
  return { m, V, keep, short, dev, Mx, credit, direct };
}

/** R3-SES-02 step 2: keep groups in priority order; a group is kept iff some plan trains it (with all groups kept so far) */
export function selectGroups(I, opts = {}) {
  const { m, V, keep } = buildModel(I, { ...opts, mode: 'select' });
  // feasibility search: an undecided group is tried 'off' first, sets are tried at their minimum first (a witness, not an optimum)
  for (const g of keep) m.pref[V.z[g]] = 'down';
  for (let i = 0; i < m.name.length; i++) if (/^x[1N]\./.test(m.name[i])) m.pref[i] = 'down';
  const fix = [], kept = [], dropped = [], log = [];
  let witness = null;
  for (const g of keep) {
    const r = ENGINE === 'cp' ? solve(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: opts.nodeLimit || 2e5 }) : solveMip(m, null, { fix: [...fix, [V.z[g], 1, 1]], nodeLimit: opts.nodeLimit || 2e4 });
    log.push({ g, status: r.status, nodes: r.nodes, lpIters: r.lpIters || 0 });
    if (r.status === 'limit') { if (env.ON_LIMIT === 'drop') { fix.push([V.z[g], 0, 0]); dropped.push(g + '(budget)'); continue; } throw new Error(`oracle budget exhausted for ${g}: never read 'unknown' as 'infeasible'`); }
    if (r.sol) { fix.push([V.z[g], 1, 1]); kept.push(g); witness = r.sol; } else { fix.push([V.z[g], 0, 0]); dropped.push(g); }
  }
  // the structure of the last feasible witness: which days train each kept group
  const days = {}; if (witness) for (const [k, v] of Object.entries(V.t)) days[k] = witness[v];
  return { kept, dropped, fix, log, days };
}

export function dose(I, sel, opts = {}) {
  const B = buildModel(I, { ...opts, mode: 'dose' });
  const { m, V, keep, short, dev, Mx } = B;
  const fixB = (v, val) => { m.lo[v] = val; m.hi[v] = val; };
  // decomposition: the structure is decided (groups kept, the days that train them); every eligible superset pair is
  // allowed while dosing (supersets only save time), and which days truly NEED them is read off the final sets
  for (const g of keep) fixB(V.z[g], sel.kept.includes(g) ? 1 : 0);
  for (const [k, v] of Object.entries(V.t)) fixB(v, sel.days[k] ? 1 : 0);
  I.days.forEach((d, di) => { let any = 0; d.pairs.forEach((p) => { const on = sel.days[`${p.a.group}|${di}`] && sel.days[`${p.b.group}|${di}`] ? 1 : 0; fixB(V.pa[`${di}|${p.tag}`], on); any |= on; }); fixB(V.u[di], any); });
  const tiers = [
    { name: 'T1 smallest worst peak shortfall (every trained group as close to its ceiling as the time allows)', terms: [[1, Mx]] },
    { name: 'T2 smallest total peak shortfall', terms: keep.map((g) => [1, short[g]]) },
    { name: 'T3 week 1 closest to the level start', terms: keep.map((g) => [1, dev[g]]) },
  ];
  const r = ENGINE === 'cp' ? solveLex(m, tiers, { nodeLimit: opts.nodeLimit || 2e6 }) : solveLexMip(m, tiers, { nodeLimit: opts.nodeLimit || 5e4 });
  return { r, B };
}

/** weeks 2..N-1: stairway on the group totals (min-cost flow), then house-monotone VOL-07 placement on the slots */
export function fillWeeks(I, B, sol, N) {
  const { V } = B;
  const groups = I.present.filter((g) => B.keep.includes(g) && sol[V.z[g]] === 1);
  const dir = (g, X) => I.days.reduce((a, d) => a + d.slots.filter((s) => s.prime === g && X[s.id] !== undefined).reduce((b, s) => b + sol[X[s.id]], 0), 0);
  const lines = groups.map((g) => ({ n: g, S: dir(g, V.x1), C: dir(g, V.xN) }));
  const { sched } = flowSchedule(lines.filter((l) => l.C > l.S), N);
  const climbing = lines.filter((l) => l.C > l.S);
  const weeks = [];
  const cur = {}; for (const d of I.days) for (const s of d.slots) cur[s.id] = V.x1[s.id] !== undefined ? sol[V.x1[s.id]] : 0;
  const lastDay = {};
  for (let w = 1; w <= N; w++) {
    for (const [li, l] of climbing.entries()) {
      let need = sched[li][w - 1] - dir2(l.n);
      while (need-- > 0) placeOne(l.n);
    }
    weeks.push({ ...cur });
  }
  return { weeks, lines, sched: climbing.map((l, li) => ({ g: l.n, x: sched[li] })) };
  function dir2(g) { return I.days.reduce((a, d) => a + d.slots.filter((s) => s.prime === g).reduce((b, s) => b + cur[s.id], 0), 0); }
  function placeOne(g) {
    // R3-VOL-03: rotate through the days that train the group; inside the day the first exercise below the first one's sets
    const ds = I.days.map((d, di) => di).filter((di) => I.days[di].slots.some((s) => s.prime === g && V.xN[s.id] !== undefined && cur[s.id] < sol[V.xN[s.id]]));
    if (!ds.length) throw new Error(`no room for ${g}`);
    // the exposure that is behind gets the set ("both days stay even"); ties rotate after the last day used
    const dayTot = (x) => I.days[x].slots.filter((s) => s.prime === g).reduce((a, s) => a + cur[s.id], 0);
    const low = Math.min(...ds.map(dayTot));
    const cand = ds.filter((x) => dayTot(x) === low);
    const after = lastDay[g] ?? -1;
    const di = cand.find((x) => x > after) ?? cand[0];
    lastDay[g] = di;
    const ss = I.days[di].slots.filter((s) => s.prime === g && V.xN[s.id] !== undefined && cur[s.id] < sol[V.xN[s.id]]);
    const first = I.days[di].slots.find((s) => s.prime === g);
    const s = ss.find((x) => cur[x.id] < cur[first.id]) || ss[0];
    cur[s.id]++;
  }
}

export function dayMinutes(I, B, sol, sets, di, week, N, useSS = true) {
  const d = I.days[di], { V } = B;
  let t = d.fixed + d.athMin * (week === N ? (I.o.athleticPeak || 1) : 1 + ((I.o.athleticPeak || 1) - 1) * (week - 1) / Math.max(1, N - 1));
  for (const s of d.slots) {
    const x = sets[s.id] || 0; if (!x) continue;
    const pa = useSS && d.pairs.find((p) => (p.a === s || p.b === s) && sol[V.pa[`${di}|${p.tag}`]] === 1);
    t += x * s.cost * (pa ? 0.65 : 1) + (pa ? 0.5 : 1);
  }
  return t;
}

/** the exact R3-SES-02 step-1 offer: the shortest session (5-min grid) for which a predicate holds */
export function minutesOffer(I, pred, from, to = 150) {
  for (let mnt = from; mnt <= to; mnt += 5) { const J = buildInstance({ ...I.o, minutes: mnt }); if (pred(J)) return mnt; }
  return null;
}

// ------------------------------------------------------------------------------------------------- the runs
export const CASES = [
  { name: 'E1  coach example 12 v1.2 5.1: L1 aesthetics, 4 days x 60 min', o: { family: 'aesthetics', days: 4, minutes: 60, level: 'L1', keepOrder: R.session.time_fit.keep_order } },
  { name: 'E2  coach example 12 v1.2 5.5: L2 stay-active racket player 55 y, 2 days x 45 min (calves pinned first)', o: { family: 'athletic', days: 2, minutes: 45, level: 'L2', keepOrder: ['calves', ...R.session.time_fit.keep_order_r2.athletic.filter((g) => g !== 'calves')], noAthletic: ['AP_TRIPLE_EXT', 'AP_THROW'], athleticPeak: 1.0 } },
  { name: 'E3  L2 aesthetics, 4 days x 75 min, Focus glutes -> hips', o: { family: 'aesthetics', days: 4, minutes: 75, level: 'L2', focus: ['hips'], keepOrder: ['hips', ...R.session.time_fit.keep_order.filter((g) => g !== 'hips')] } },
  { name: 'E4  L3 aesthetics, 4 days x 90 min', o: { family: 'aesthetics', days: 4, minutes: 90, level: 'L3', keepOrder: R.session.time_fit.keep_order } },
  { name: 'E5  L2 field athlete (swimmer-like), 3 days x 90 min, athletic minutes +30 % by the peak', o: { family: 'athletic', days: 3, minutes: 90, level: 'L2', keepOrder: R.session.time_fit.keep_order_r2.athletic, athleticPeak: 1.3 } },
];

export function runCase(c, N = 12) {
  const out = [];
  const t0 = nowMs();
  const I = buildInstance(c.o);
  const sel = selectGroups(I);
  const t1 = nowMs();
  const { r, B } = dose(I, sel);
  const t2 = nowMs();
  out.push(`\n## ${c.name}`);
  out.push(`main days: ${I.days.map((d) => `${d.wd} ${d.type} (${d.slots.length} resistance slots, fixed ${d.fixed.toFixed(1)} min${d.athMin ? `, athletic ${d.athMin.toFixed(1)} min` : ''}${d.twin ? `, twin ${d.twin.wd}` : ''})`).join('; ')}`);
  out.push(`variables ${B.m.lo.length}, constraints ${B.m.cons.length}`);
  out.push(`group selection (R3-SES-02 step 2, exact oracle): kept ${sel.kept.join(', ') || '-'}; not trained directly ${sel.dropped.join(', ') || '-'}; oracle calls ${sel.log.length}, nodes ${sel.log.map((l) => l.nodes).join('/')}; ${(t1 - t0).toFixed(0)} ms`);
  out.push(`dosing tiers: ${r.report.map((x) => `${x.tier.split(' ')[0]}=${x.value} (${x.status}, ${x.nodes} nodes)`).join('; ')}; ${(t2 - t1).toFixed(0)} ms`);
  if (!r.sol) { out.push('NO SOLUTION'); return out; }
  const sol = r.sol, { V } = B;
  const { weeks, sched } = fillWeeks(I, B, sol, N);
  const t3 = nowMs();
  out.push(`weeks 2..${N - 1} (flow stairway + VOL-07 placement): ${(t3 - t2).toFixed(1)} ms`);
  // per-group table
  const groups = I.present.filter((g) => sol[V.z[g]] === 1);
  const credit = (g, sets, main = true) => I.days.reduce((a, d) => a + d.slots.reduce((b, s) => b + (s.cr[g] ? s.cr[g] * (sets[s.id] || 0) : 0), 0), 0) / 4;
  const direct = (g, sets) => I.days.reduce((a, d) => a + d.slots.filter((s) => s.prime === g).reduce((b, s) => b + (sets[s.id] || 0), 0), 0);
  out.push(`group (start S / ceiling C): direct sets week 1..${N}  [credited sets week 1 -> ${N}]`);
  for (const g of I.present) {
    if (sol[V.z[g]] !== 1) { out.push(`  ${g.padEnd(9)} not trained directly; compound credit week 1 ${credit(g, weeks[0]).toFixed(2)} -> week ${N} ${credit(g, weeks[N - 1]).toFixed(2)}`); continue; }
    out.push(`  ${g.padEnd(9)} (${I.S[g]}/${I.C[g]}): ${weeks.map((wk) => direct(g, wk)).join(' ')}  [${credit(g, weeks[0]).toFixed(2)} -> ${credit(g, weeks[N - 1]).toFixed(2)}]`);
  }
  const tot = weeks.map((wk) => Object.values(wk).reduce((a, b) => a + b, 0));
  out.push(`  total resistance sets: ${tot.join(' ')}`);
  // checks
  const fit = R.session.time_fit.fit_factor;
  // T4, read off the final sets: a day needs its supersets only if some week does not fit without them
  const need = I.days.map((d, di) => weeks.some((wk, wi) => dayMinutes(I, B, sol, wk, di, wi + 1, N, false) > c.o.minutes * fit + 1e-9));
  const mins = I.days.map((d, di) => weeks.map((wk, wi) => dayMinutes(I, B, sol, wk, di, wi + 1, N, need[di])));
  const ssDays = I.days.filter((d, di) => need[di]).map((d) => d.wd);
  out.push(`  minutes per day (week 1 -> ${N}; limit ${c.o.minutes} x ${fit} = ${(c.o.minutes * fit).toFixed(0)}): ${I.days.map((d, di) => `${d.wd} ${mins[di][0].toFixed(0)}->${mins[di][N - 1].toFixed(0)}`).join(', ')}; supersets needed on: ${ssDays.join(', ') || 'none'}`);
  let timeViol = 0, floorViol = 0, monoViol = 0, flat = 0;
  for (let wi = 0; wi < N; wi++) {
    I.days.forEach((d, di) => { if (mins[di][wi] > c.o.minutes * fit + 1e-9) timeViol++; });
    for (const g of groups) if (credit(g, weeks[wi]) < I.floor(g) - 1e-9) floorViol++;
    if (wi) { for (const id of Object.keys(weeks[wi])) if (weeks[wi][id] < weeks[wi - 1][id]) monoViol++; if (tot[wi] === tot[wi - 1]) flat++; }
  }
  // coach-rule checks on every week: VOL-07 shape inside each group-day, twin days even, step caps (R2-VOL-01, UNI-05)
  let vol07 = 0, twin = 0, stepViol = 0, totViol = 0;
  for (let wi = 0; wi < N; wi++) {
    const wk = weeks[wi];
    I.days.forEach((d) => {
      const byG = {}; d.slots.forEach((s) => { if (s.bucket !== 'ISO_CALF') (byG[s.group] = byG[s.group] || []).push(wk[s.id] || 0); });
      for (const a of Object.values(byG)) for (let i = 0; i + 1 < a.length; i++) if (a[i] < a[i + 1] || a[i] > a[i + 1] + 1) vol07++;
      if (d.twin && I.days.indexOf(d.twin) > I.days.indexOf(d)) d.slots.forEach((s, k) => { if (Math.abs((wk[s.id] || 0) - (wk[d.twin.slots[k].id] || 0)) > 1) twin++; });
    });
    if (wi) {
      for (const g of groups) { const a = direct(g, weeks[wi - 1]), b = direct(g, wk); if (b - a > Math.max(1, Math.floor(0.07 * a + 1e-9))) stepViol++; }
      if (tot[wi] - tot[wi - 1] >= Math.max(1, 0.1 * tot[wi - 1]) && tot[wi] - tot[wi - 1] > 1) totViol++;
    }
  }
  out.push(`  checks over all ${N} weeks: time violations ${timeViol}, floor violations ${floorViol}, slot decreases ${monoViol}, flat weeks in the total ${flat}, VOL-07 shape breaks ${vol07}, uneven twin days ${twin}, group steps over 7 % ${stepViol}, weekly total rises >= 10 % ${totViol}`);
  // offers (R3-SES-02 step 1), exact: shortest session for (a) no group dropped, (b) every group at its ceiling
  if (c.offers !== false && env.OFFERS !== '0') {
    const t4 = nowMs();
    const allKept = (J) => selectGroups(J).dropped.length === 0;
    const allAtCeiling = (J) => { const s2 = selectGroups(J); if (s2.dropped.length) return false; const d2 = dose(J, s2, { nodeLimit: ENGINE === 'cp' ? 3e5 : 2e4 }); return d2.r.report[0].value === 0; };
    const a = sel.dropped.length ? minutesOffer(I, allKept, c.o.minutes + 5) : c.o.minutes;
    const b = r.report[0].value === 0 ? c.o.minutes : minutesOffer(I, allAtCeiling, a || c.o.minutes);
    out.push(`  offer (exact, 5-min grid): every group trained directly from ${a ?? '>150'} min; every group reaching its ceiling from ${b ?? '>150'} min  (${(nowMs() - t4).toFixed(0)} ms)`);
  }
  return out;
}

if (isMain(import.meta.url)) {
  const all = [`Simplifications: ${SIMPLIFICATIONS.map((s, i) => `(${i + 1}) ${s}`).join(' ')}`];
  for (const c of CASES) all.push(...runCase(c));
  print(all.join('\n'));
}
