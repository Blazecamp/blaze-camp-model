// Independent audit checks for the CX progression kernel (engine/progression/*; moved from design/progression/ in engine 0.5.0).
// Written for reviews/claude-codex-audit.md. Oracles here are re-derived from the spec text and
// elementary arithmetic; they do not call any helper from the module under test except the API itself.
// engine 0.5.0: the three defects this file documented as { todo } (MEDIUM-2, MEDIUM-1, HIGH-2) are fixed and their tests run
// as normal tests. AT-5 (MEDIUM-5) and AT-6 (HIGH-1) were converted: the first asserts the fix, the second asserts CT-01 (no
// session-time limit exists any more; the per-week seconds are an estimate). See engine/DECISIONS.md section G.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveEndpointCurve, scheduleNestedSets, scheduleGroupPrefixes, planStairway } from '../../engine/progression/stairway.mjs';
import { applySetEdits, evaluatePrescription, planProgression } from '../../engine/progression/prescription.mjs';

const NUM = Object.freeze({ logTolerance: 1e-12, maxIterations: 200, maxBracketDoublings: 80 });

// ---------------------------------------------------------------------------------------------
// 1. Endpoint curve against a closed form (equal transition weights): (1 + lambda r)^n = P / S.
test('audit: equal-weight curve matches the closed-form root', () => {
  for (const [s, p, n, r] of [[12, 22, 11, 0.04], [3, 4, 5, 0.05], [10, 30, 3, 0.03], [15, 22, 11, 0.01], [1, 1e6, 4, 0.5]]) {
    const out = solveEndpointCurve({ start: s, peak: p, rates: Array(n).fill(r), numerics: NUM });
    assert.equal(out.status, 'ok');
    const lambda = (Math.pow(p / s, 1 / n) - 1) / r;
    assert.ok(Math.abs(out.lambda - lambda) <= 1e-9 * lambda, `${out.lambda} vs ${lambda}`);
    assert.equal(out.values.at(-1), p);
    for (let i = 1; i < out.values.length - 1; i++) {
      const ideal = s * Math.pow(1 + lambda * r, i);
      assert.ok(Math.abs(out.values[i] - ideal) <= 1e-9 * ideal);
    }
  }
});

// ---------------------------------------------------------------------------------------------
// 2. Integer quantizer against exact dyadic rationals (BigInt), independent of the module's
//    float-decomposition code: p = k / 2^20 is exactly representable.
test('audit: nested quantizer equals exact floor / half-up of h * k / 2^20', () => {
  let seed = 0x5eed;
  const next = () => (seed = (Math.imul(seed, 1103515245) + 12345) >>> 0);
  const D = 1n << 20n;
  for (let trial = 0; trial < 300; trial++) {
    const h = [0, 1, 2, 7, 1000, 2 ** 40, Number.MAX_SAFE_INTEGER - 3][next() % 7];
    const ks = [0, ...Array.from({ length: 4 }, () => next() % (1 << 20))].sort((a, b) => a - b);
    const progress = [...ks.map(k => k / 2 ** 20), 1];
    for (const rounding of ['floor', 'half_up']) {
      const out = scheduleNestedSets({ startSets: [3], peakSets: [3 + h], progress, rounding });
      if (!Number.isSafeInteger(3 + h)) continue;
      assert.equal(out.status, 'ok');
      ks.forEach((k, w) => {
        const exact = rounding === 'floor' ? (BigInt(h) * BigInt(k)) / D : (2n * BigInt(h) * BigInt(k) + D) / (2n * D);
        assert.equal(out.weeks[w][0], 3 + Number(exact));
      });
      assert.equal(out.weeks.at(-1)[0], 3 + h);
    }
  }
});

// ---------------------------------------------------------------------------------------------
// 3. Group-day add sequence against an independent reading of PLANNER_SPEC 5.2(c), exhaustively
//    over small instances: fewest additions in this segment among days with room; main before
//    optional; ties go to the first day at or after the cursor (the day after the one used last).
function referenceSequence(room, optional, cursor) {
  const added = room.map(() => 0);
  const seq = [];
  const total = room.reduce((a, b) => a + b, 0);
  for (let step = 0; step < total; step++) {
    const open = room.map((r, d) => d).filter(d => added[d] < room[d]);
    const fewest = Math.min(...open.map(d => added[d]));
    let pool = open.filter(d => added[d] === fewest);
    if (pool.some(d => !optional[d])) pool = pool.filter(d => !optional[d]);
    const order = d => (d - cursor + room.length) % room.length;
    const day = pool.sort((a, b) => order(a) - order(b))[0];
    added[day]++;
    seq.push(day);
    cursor = (day + 1) % room.length;
  }
  return { seq, cursor };
}

test('audit: group prefix add sequence equals an independent 5.2(c) reference (exhaustive, width <= 3, room <= 2)', () => {
  let cases = 0;
  for (let width = 1; width <= 3; width++) {
    const rooms = [[]];
    for (let d = 0; d < width; d++) rooms.splice(0, rooms.length, ...rooms.flatMap(r => [0, 1, 2].map(x => [...r, x])));
    for (const room of rooms) for (let mask = 0; mask < 1 << width; mask++) for (let cursor = 0; cursor < width; cursor++) {
      const optional = room.map((_, d) => Boolean(mask & (1 << d)));
      const start = room.map((_, d) => d % 2);
      const H = room.reduce((a, b) => a + b, 0);
      const progress = H ? [0, 0.25, 0.5, 0.75, 1] : [0, 0, 0, 0, 0];
      const out = scheduleGroupPrefixes({ groups: [{ id: 'g', startSets: start, peakSets: start.map((s, d) => s + room[d]),
        progress, optionalDays: optional, nextDayIndex: cursor }], rounding: 'floor', maxAdditions: 100 });
      const ref = referenceSequence(room, optional, cursor);
      assert.deepEqual([...out.groups[0].addSequence], ref.seq, JSON.stringify({ room, optional, cursor }));
      if (H) assert.equal(out.groups[0].finalNextDayIndex, ref.cursor);
      // week vectors are prefixes of the reference sequence of length floor(H * p)
      progress.forEach((p, w) => {
        const v = [...start];
        for (const d of ref.seq.slice(0, Math.floor(H * p))) v[d]++;
        assert.deepEqual([...out.weeks[w]], v);
      });
      cases++;
    }
  }
  assert.ok(cases > 500);
});

// ---------------------------------------------------------------------------------------------
// 4. Pair time against a round-by-round simulation of a superset (round k: every partner that
//    still has a k-th set works, then the longest rest among them), the semantics of
//    engine/timefit.mjs supersetMinutes and PLANNER_SPEC 5.2(b).
const item = (id, extra = {}) => ({ id, sets: 3, minSets: 0, maxSets: 8, reps: 1, minReps: 1, maxReps: 20, secondsPerRep: 10,
  restSeconds: 60, changeoverSeconds: 0, rir: 2, credits: { g: 4 }, ...extra });
const onePlan = (weeks, groups = [{ id: 'g', minCredits: 0, maxCredits: 1000 }]) => ({ groups,
  weeks: weeks.map(([items, pairs, fixedSeconds = 0]) => ({ days: [{ id: 'd', fixedSeconds, items, pairs }] })) });

test('audit: paired time equals a round-by-round superset simulation (exhaustive small grid)', () => {
  for (let xa = 0; xa <= 4; xa++) for (let xb = 0; xb <= 4; xb++) for (const [ra, rb] of [[30, 90], [90, 30], [60, 60], [0, 120]]) {
    const a = item('a', { sets: xa, restSeconds: ra, secondsPerRep: 7 });
    const b = item('b', { sets: xb, restSeconds: rb, secondsPerRep: 11 });
    let sim = 0;
    for (let k = 1; k <= Math.max(xa, xb); k++) {
      const act = [a, b].filter(x => x.sets >= k);
      sim += act.reduce((t, x) => t + x.reps * x.secondsPerRep, 0) + Math.max(...act.map(x => x.restSeconds));
    }
    const got = evaluatePrescription(onePlan([[[a, b], [{ a: 'a', b: 'b', changeoverSavingSeconds: 0 }]]])).totals[0].days[0].seconds;
    assert.equal(got, sim, JSON.stringify({ xa, xb, ra, rb }));
  }
});

// ---------------------------------------------------------------------------------------------
// 5. P4 / P5 scope (MEDIUM-5, FIXED in engine 0.5.0): a pair's changeover saving may not exceed the smaller of its two
//    changeovers, so activating a pair (a slot going from 0 to 1 set) can no longer REDUCE the estimated time. The audit's
//    counterexample (saving 60 with changeovers 0 and 60) is now rejected, and inside the bound activation never lowers time.
test('audit MEDIUM-5 (fixed): a pair saving above the smaller changeover is rejected, and activation never lowers the estimate', () => {
  const b = item('b', { sets: 3, restSeconds: 90, changeoverSeconds: 60 });
  assert.throws(() => evaluatePrescription(onePlan([[[item('a', { sets: 0, restSeconds: 90 }), b], [{ a: 'a', b: 'b', changeoverSavingSeconds: 60 }]]])));
  for (const ca of [0, 30, 60]) for (const saving of [0, Math.min(ca, 60)]) for (const work of [0, 5]) {
    const pairs = [{ a: 'a', b: 'b', changeoverSavingSeconds: saving }];
    const before = evaluatePrescription(onePlan([[[item('a', { sets: 0, restSeconds: 90, changeoverSeconds: ca }), b], pairs]]));
    const after = evaluatePrescription(onePlan([[[item('a', { sets: 1, restSeconds: 90, secondsPerRep: work, changeoverSeconds: ca }), b], pairs]]));
    assert.ok(after.totals[0].days[0].seconds >= before.totals[0].days[0].seconds, JSON.stringify({ ca, saving, work }));
  }
});

// ---------------------------------------------------------------------------------------------
// 6. Time (HIGH-1, CLOSED by CT-01 in engine 0.5.0): session minutes are neither an input nor a constraint, so no time
//    certification or covering envelope exists. Every week's estimate is computed directly from that week's reps and rests, and
//    a flat-set rep-progression week that takes longer is only a bigger estimate - never an issue.
test('audit HIGH-1 (closed by CT-01): each week is estimated directly; a longer rep-progression week raises no issue', () => {
  const prog = planProgression({ sets: [4, 4, 4, 5], repMin: 6, repMax: 12, startReps: 6, repStep: 6, allowLoadProgression: true, rir: [3, 2, 2, 1] });
  assert.equal(prog.status, 'ok');
  const weeks = prog.weeks.map(w => [[item('a', { sets: w.sets, reps: w.reps, minReps: 6, maxReps: 12, secondsPerRep: 4, restSeconds: 20 })], []]);
  const out = evaluatePrescription(onePlan(weeks));
  assert.deepEqual(out.totals.map(t => t.days[0].seconds), [176, 272, 176, 220]);
  assert.equal(out.time, 'estimate_only');
  assert.deepEqual(out.issues.filter(i => /time/.test(i.code)), []);
  assert.equal(out.status, 'valid_subset');
});

// ---------------------------------------------------------------------------------------------
// 7. Acceleration reporting (MEDIUM-3 / MEDIUM-4, FIXED in engine 0.5.0): the curve-level signal (lambda > 1) can say "not
//    accelerated" while the integer schedule rises 10 % in one week; the engine now reports acceleration from the integer
//    schedule (accelerationReport) and its default rounding reaches the ceiling in the last week (arrivalSchedule, R4-PRG-01).
test('audit MEDIUM-3 / MEDIUM-4 (fixed): the integer schedule reports its own acceleration and arrives in the last week', () => {
  const rates = Array.from({ length: 11 }, (_, i) => (i + 2 <= 6 ? 0.03 : 0.05));
  const c = solveEndpointCurve({ start: 10, peak: 11, rates, numerics: NUM });
  assert.equal(c.accelerated, false);
  // evidence kept: plain half-up (still an explicit option) rises 10 % in one week and reaches the ceiling in week 8 of 12
  const s = scheduleNestedSets({ startSets: [10], peakSets: [11], progress: c.progress, rounding: 'half_up' });
  assert.equal(Math.max(...s.riseFractions.map(r => r[0])), 0.1);
  assert.equal(s.weeks.findIndex(w => w[0] === 11) + 1, 8);
  // the engine's schedule: the ceiling in week 12, and the 10 % week is reported as above the default 5 %
  const plan = planStairway({ start: 10, peak: 11, rates, noteAbove: 0.15, minWholeSets: 2 });
  assert.equal(plan.sets.indexOf(11) + 1, 12);
  assert.equal(plan.curveAccelerated, false);
  assert.equal(plan.report.accelerated, true);
  assert.deepEqual(plan.report.weeks.filter(w => w.aboveDefault).map(w => [w.week, w.rise, w.defaultRise]), [[12, 0.1, 0.05]]);
});

// ---------------------------------------------------------------------------------------------
// The three confirmed defects (todo until engine 0.5.0; fixed, now normal tests).

test('defect (fixed, MEDIUM-2): a loose logTolerance no longer returns status ok with most of the growth unrealized', () => {
  const out = solveEndpointCurve({ start: 10, peak: 20, rates: [0.01, 0.01, 0.01], numerics: { logTolerance: 0.9, maxIterations: 0, maxBracketDoublings: 10 } });
  // Before the fix: status 'ok', week-3 value 10.82, then a pinned jump to 20 in the last transition.
  assert.notEqual(out.status, 'ok');
});

test('defect (fixed, MEDIUM-1): applySetEdits rebuilds the plan from an allowlist - no approval-like metadata survives an edit', () => {
  const plan = onePlan([[[item('a', { approval: 'coach' })], []], [[item('a', { sets: 4 })], []]],
    [{ id: 'g', minCredits: 0, maxCredits: 1000, certified: true }]);
  Object.assign(plan, { approved: true, fingerprint: 'abc', summary: { setsByWeek: [3, 4] }, meta: { validation: { ok: true } } });
  const { plan: edited } = applySetEdits(plan, [{ week: 2, dayId: 'd', itemId: 'a', sets: 6 }]);
  assert.equal(edited.approved, undefined);
  assert.equal(edited.fingerprint, undefined);
  assert.equal(edited.meta?.validation, undefined);
  assert.equal(edited.groups[0].certified, undefined);
  assert.notDeepEqual(edited.summary, { setsByWeek: [3, 4] });
  assert.deepEqual(edited.summary.setsByWeek, [3, 6]);   // recomputed from the edited weeks
  assert.equal(edited.edited, true);
  assert.equal(edited.weeks[0].days[0].items[0].approval, undefined);
});

test('defect (fixed, HIGH-2): same-load rep increases are conditional (double progression), never a presumed strength gain', () => {
  const out = planProgression({ sets: [3, 3, 3], repMin: 8, repMax: 12, startReps: 8, repStep: 2, allowLoadProgression: true, rir: [3, 3, 3] });
  // Before the fix: 3x8 @3 RIR -> 3x10 @3 RIR -> 3x12 @3 RIR at the same load (an implied 11RM -> 15RM) with conditional=false.
  for (const week of out.weeks.slice(1)) assert.equal(week.conditional, true);
});
