// tests/review-b4.test.mjs - engine 0.4.0 stage B4 (integration) regression tests. Stage B4 ran the whole pipeline from clean
// (fixture, compile, tests, the 8 samples) plus a sweep of 1,500 random intakes + every sport + every activity on the fixture and on
// model/, and read the 8 regenerated plans end to end. One test per fixed issue: R<sample>-<slug> for an issue found reading a
// sample plan (samples/RECHECK_v0.3.md numbering), B4-sweep-random-<n>-<slug> for an intake of the sweep that failed an error
// check (tests/helpers/random-intake.mjs, index n). samples/REVIEW_LOG.md (v0.4, stage B4) and engine/DECISIONS.md (E-64 ...) list
// them. Plans are built on the compiled model (model/) unless the test says the fixture.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { olympicSetsForIndex } from '../engine/budget.mjs';
import { groupCredits } from '../engine/timefit.mjs';
import { loadCompiledModel, loadFixtureModel, INTAKE_DIR } from './helpers/models.mjs';
import { randomIntake } from './helpers/random-intake.mjs';

const model = loadCompiledModel();
const fixture = loadFixtureModel();
const R = model ? model.rules : null;
const NAMES = { '01': '01-swimming', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const rcache = {};
const rnd = (i, m = model) => { const k = (m === model ? 'm' : 'f') + i; if (!rcache[k]) rcache[k] = generate(randomIntake(i, m), m); return rcache[k]; };
const md = (n) => renderPlan(plan(n), model, { lang: plan(n).lang });
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const passes = (p, ids) => { for (const id of ids) assert.ok(check(p, id).pass, `${id}: ${JSON.stringify(check(p, id).violations.slice(0, 2))}`); };
const stairWeeks = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const g = (p, gs) => gs.map(x => model.t(p.lang, 'group.' + x)).join(', ');

describe('stage B4: integration (whole-pipeline sweep + the 8 sample plans read end to end)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------------ 04 crossfit class
  test('R04-class-lifts-stay: the Squat + clean day holds its squat, the Press day its press, the Deadlift day its deadlift and the Pull day its row; a group the time check does not train directly keeps only its class lift at 3 sets (E-64)', () => {
    const p = plan('04');
    const kept = p.time_check.not_trained_directly.filter(x => x.reason === 'class_lift').map(x => x.group);
    // v0.4 fix round 1 (E-81, RECHECK 04 blocker): a big lower mover with a class lift is trained directly (below its floor when the
    // class day cannot hold 10 sets) ahead of back / chest accessories; the groups left to their class lift keep only that lift
    assert.ok(p.time_check.trained_groups.includes('quads') || p.time_check.trained_groups.includes('hips'), JSON.stringify(p.time_check));
    assert.ok(kept.length > 0, JSON.stringify(p.time_check.not_trained_directly));
    const want = { Mon: 'RP_BKD', Tue: 'RP_VPUSH', Thu: 'RP_BHD', Fri: 'RP_HPULL' };
    for (const w of stairWeeks(p)) {
      for (const [wd, bucket] of Object.entries(want)) {
        const d = w.days.find(x => x.weekday === wd);
        assert.ok(d && d.blocks.some(b => b.items.some(it => it.role === 'work' && it.bucket === bucket && it.sets > 0)), `w${w.n} ${wd} has no ${bucket} work lift`);
      }
      for (const x of items(w).filter(r => r.d.kind === 'main' && kept.includes(r.it.group) && r.it.role !== 'test')) {
        assert.equal(x.it.role, 'work', `w${w.n} ${x.d.weekday} ${x.it.exercise_id}: a class-lift group holds its work lift only`);
        // (v0.4 fix round 1, E-91: in a test week the rep-max test replaces one of the lift's sets - its back-off sets follow)
        assert.equal(x.it.sets + ((x.it.flags || []).includes('back_off') ? 1 : 0), R.session.time_fit.keep_work_lift.sets, `w${w.n} ${x.it.exercise_id} sets`);
      }
    }
    passes(p, ['V22', 'V23', 'H17', 'H18', 'H21']);
  });
  test('R04-class-lift-printed: the schedule names the groups that keep their class lift (EN), and the days stay inside minutes x 1.1 outside the test weeks', () => {
    const p = plan('04'), s = unesc(md('04'));
    const kept = p.time_check.not_trained_directly.filter(x => x.reason === 'class_lift').map(x => x.group);
    assert.ok(s.includes(model.t('en', 'ui.plan.not_trained_class_lift', { groups: g(p, kept) })), 'class-lift line');
    assert.ok(model.has('es', 'ui.plan.not_trained_class_lift'), 'Spanish class-lift line');
    for (const w of p.weeks.filter(x => !x.test)) for (const d of w.days.filter(x => x.kind === 'main')) assert.ok(d.est_minutes <= d.minutes_limit * R.session.long_day.warn_above_factor + 1e-9, `w${w.n} ${d.weekday} ${d.est_minutes}`);
  });
  test('R04-lower-peak-trained-only: "a lower peak for ..." names only groups the plan trains directly (never a group with no station, all samples)', () => {
    for (const n of Object.keys(NAMES)) {
      const tc = plan(n).time_check;
      for (const gr of tc.lowered_peak || []) assert.ok(tc.trained_groups.includes(gr), `${n}: ${gr} lowered but not trained`);
    }
  });

  // (fix round 2 / F1, E-141: the class days follow the coach's class split - squat day, press + snatch day, deadlift + push day, clean +
  // pull day; a day whose Olympic piece the budget trims is still titled from its own lifts)
  test('R04-class-day-title: a class day is titled from its own lifts - the Olympic piece named only where the day holds it, never "Pull + push press day" without a push press; the class split titles (E-141)', () => {
    const p = plan('04');
    const s = unesc(md('04'));
    const olyOn = (wd) => p.weeks[1].days.find(d => d.weekday === wd).blocks.some(b => b.items.some(it => it.bucket === 'AP_TRIPLE_EXT'));
    assert.ok(!s.includes('Pull + push press day'), 'no push press in the title');
    assert.ok(s.includes('### Monday · Squat day'), 'squat day');
    if (olyOn('Fri')) assert.ok(s.includes('### Friday · Clean + pull day'), 'clean day');
    else assert.ok(!/### Friday · [^\n]*Clean/.test(s), 'no clean in a Friday title without one');
    if (olyOn('Tue')) assert.ok(s.includes('### Tuesday · Press + snatch day'), 'press + snatch day');
    const thu = p.weeks[1].days.find(d => d.weekday === 'Thu');
    if (!thu.blocks.some(b => b.items.some(it => ['RP_HPUSH', 'RP_VPUSH'].includes(it.bucket)))) assert.ok(!/### Thursday · [^\n]*push/i.test(s), 'no push in a Thursday title without a push');
    const es = unesc(renderPlan(p, model, { lang: 'es' }));
    assert.ok(es.includes('Día de sentadilla'), 'Spanish title');
  });

  // ------------------------------------------------------------------------------------------------------ 02 football
  test('R02-tests-spread: the jump test goes to a jump day without a strength test, so the end-test Monday no longer stacks the squat test, the sprint, the 5-10-5 and the jump test (R2-PER-07)', () => {
    const p = generate(JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, '02-football.json'), 'utf8')), model);
    for (const w of p.weeks.filter(x => x.test)) {
      const testsOf = (d) => d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'TEST' || it.role === 'test').map(it => (it.test || {}).test);
      const cmjDay = w.days.find(d => testsOf(d).includes('cmj'));
      assert.ok(cmjDay, `w${w.n} cmj`);
      assert.ok(!testsOf(cmjDay).some(t => /^rm_/.test(t)), `w${w.n} cmj on a rep-max test day (${cmjDay.weekday})`);
    }
  });

  // ------------------------------------------------------------------------------------------------------ 05 bootcamp
  test('R05-circuit-throws-week-target: the ball station shares the week\'s throw target (ramping 20 -> 40), never more than the target, and climbs', () => {
    const p = plan('05');
    let prev = 0;
    for (const w of stairWeeks(p)) {
      const ab = w.athletic_budget;
      assert.ok(ab.planned.throws <= ab.targets.throws, `w${w.n} ${ab.planned.throws} > ${ab.targets.throws}`);
      assert.ok(ab.planned.throws >= prev, `w${w.n} drops ${prev} -> ${ab.planned.throws}`);
      prev = ab.planned.throws;
    }
    assert.ok(stairWeeks(p)[0].athletic_budget.planned.throws < stairWeeks(p).slice(-1)[0].athletic_budget.planned.throws);
    passes(p, ['V27']);
  });

  // ------------------------------------------------------------------------------------------------------ 07 push / pull / legs
  test('R07-pull-days-even: the two Pull days (and the two Push days) hold the same structure - the time check\'s room cuts come off the most loaded day, so the second exposure keeps its pulldowns (R3-VOL-03 "both days stay even")', () => {
    const p = plan('07');
    for (const w of stairWeeks(p)) {
      for (const type of ['Pull', 'Push']) {
        const ds = w.days.filter(d => d.day_type === type);
        assert.equal(ds.length, 2, type);
        const n = ds.map(d => d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items).filter(it => it.exercise_id && it.role !== 'test').length);
        assert.ok(Math.abs(n[0] - n[1]) <= 1 && Math.min(...n) >= 5, `w${w.n} ${type}: ${n.join(' vs ')}`);
        const vpull = ds.map(d => d.blocks.some(b => b.items.some(it => it.bucket === 'RP_VPULL')));
        if (type === 'Pull') assert.ok(vpull.every(Boolean), `w${w.n} a pull day without a vertical pull`);
      }
    }
  });

  // ------------------------------------------------------------------------------------------------------ 08 pickleball
  test('R08-rotator-cuff-care: the 52-year-old racket player gets rotator-cuff care (COACH-R3 R3-ATH-02) and racket-elbow wrist work every week - one code no longer takes every joint-care slot', () => {
    const p = plan('08');
    for (const w of p.weeks) {
      const codes = items(w).filter(x => x.b.kind === 'prehab').map(x => ((x.it.why || []).find(y => y.key === 'why.prehab') || { args: {} }).args.code);
      assert.ok(codes.includes('SHOULDER_THROWER'), `w${w.n} no shoulder care: ${codes.join(',')}`);
      assert.ok(codes.includes('ELBOW_LATERAL_RACKET'), `w${w.n} no elbow care`);
    }
    const er = items(p.weeks[0]).find(x => x.b.kind === 'prehab' && /external-rotation|face-pull|y-t/.test(x.it.exercise_id));
    assert.ok(er, 'an external-rotation / face-pull / Y-T pick');
  });
  // (fix round 2 / F1, E-145: the 2 x 45 plan keeps a row and a press - paired with a main day's work lift or on the optional day - so
  // back and chest now get credited sets: they are 'not trained directly' and the compound-lift line is true for them)
  test('R08-not-trained-copy: groups the 2 x 45 plan gives no credited set are named "not trained in this plan"; groups that keep a pattern station get the compound-lift line, never the other way round', () => {
    const p = plan('08'), s = unesc(md('08'));
    const time = p.time_check.not_trained_directly.filter(x => x.reason === 'time').map(x => x.group);
    assert.ok(time.length >= 2, JSON.stringify(time));
    const none = time.filter(gr => stairWeeks(p).every(w => !(w.weekly_sets_by_group[gr] > 0)));
    const some = time.filter(gr => !none.includes(gr));
    if (none.length) assert.ok(s.includes(model.t('en', 'ui.plan.not_trained_time_none', { groups: g(p, none) })), 'not-trained-in-this-plan line');
    // (fix round 2 / F3, E-196; RECHECK v0.4 08 minor: 'they still get work from your compound lifts' while only one kept station trains
    // them) a group that keeps a pattern station is named with that exercise and its day; never 'not trained in this plan'
    for (const gr of some) {
      const kept = p.weeks[0].days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ it, d })))).find(x => x.it.group === gr && x.it.origin === 'pattern_kept');
      const line = s.split('\n').find(l => l.startsWith('- ' + model.t('en', 'group.' + gr) + ':'));
      if (kept) assert.ok(line && line.includes(model.t('en', kept.it.name_key)) && line.includes(model.t('en', 'weekday.' + kept.d.weekday)), `kept-exercise line ${gr}: ${line}`);
    }
    for (const gr of ['back', 'chest']) assert.ok(some.includes(gr) && stairWeeks(p).every(w => w.days.some(d => d.blocks.some(b => b.items.some(it => it.origin === 'pattern_kept' && it.group === gr)))), gr);
  });

  // ------------------------------------------------------------------------------------------------------ 01 swimming
  test('R01-test-week-day: the end-test Friday (78 min with the deadlift work-up) is told as a test day, not as "the minimum work of that day does not fit"', () => {
    const p = plan('01');
    const ws = p.meta.warnings;
    assert.ok(ws.some(x => x.key === 'warning.test_day_long' && x.args.day === 'Fri' && x.args.week === 12), JSON.stringify(ws.filter(x => /long/.test(x.key))));
    assert.ok(!ws.some(x => x.key === 'warning.long_day' && x.args.day === 'Fri'), 'no long_day for Friday');
  });

  // ------------------------------------------------------------------------------------------------------ the random sweep
  test('B4-sweep-random-1223-medball-load-no-throws: a medball held as the load of a press is a resistance station, never counted as throws; the week\'s throws stay under the target (V27)', () => {
    for (const i of [1223, 789]) {
      const p = rnd(i);
      for (const x of p.weeks.flatMap(items)) if (x.it.athletic && x.it.athletic.key === 'throws' && x.b.circuit !== undefined && x.it.bucket !== 'COND_CIRCUIT') {
        const e = model.ex(x.it.exercise_id);
        assert.ok(e.is_athletic || e.conditioning, `random-${i} w${x.w.n} ${x.it.exercise_id} counted as throws`);
      }
      passes(p, ['V27']);
    }
  });
  test('B4-sweep-random-971-ball-stations-share-target: two ball stations in one week share the week\'s throw target (V27)', () => {
    for (const i of [971, 803, 824]) {
      const p = rnd(i);
      for (const w of p.weeks) { const ab = w.athletic_budget; if (ab && typeof ab.targets.throws === 'number' && ab.targets.throws > 0) assert.ok(ab.planned.throws <= ab.targets.throws * (1 + R.athletic.reconcile.tolerance) + R.athletic.reconcile.per_set_max.throws, `random-${i} w${w.n} ${ab.planned.throws} vs ${ab.targets.throws}`); }
      passes(p, ['V27']);
    }
  });
  test('B4-sweep-random-765-in-season-olympic: a game-heavy in-season block holds the light Olympic piece - 2 sets of 3, once a week (rules.olympic.in_season, R2-ATH-04) - the number the athletic budget targets', () => {
    for (const i of [765, 793, 1024]) {
      const p = rnd(i);
      for (const w of p.weeks.filter(x => x.block_type === 'in_season')) {
        const oly = items(w).filter(x => x.it.bucket === 'AP_TRIPLE_EXT');
        assert.ok(oly.reduce((a, x) => a + x.it.sets, 0) <= R.olympic.in_season.sets * R.olympic.in_season.per_week, `random-${i} w${w.n}`);
        assert.ok(new Set(oly.map(x => x.d.weekday)).size <= R.olympic.in_season.per_week, `random-${i} w${w.n} exposures`);
      }
      passes(p, ['V27', 'V19']);
    }
    const d = { D1_family: 'athletic', D2_profile: { competitive: 'competitive' }, D11_athletic_budget: { game_heavy: true, weekly: { olympic_sets: [4.5, 7.5] } } };
    const wk = { block_type: 'in_season', stair_week: null };
    assert.deepEqual([0, 1].map(k => olympicSetsForIndex(d, model, 2, wk, k)), [R.olympic.in_season.sets, 0]);
  });
  test('B4-sweep-random-412-v19-jerk-family: V19 asks for Olympic work only where an Olympic-family record could fill the station (a body-weight squat to calf raise is not one) - a field kit class passes', () => {
    for (const i of [412, 1322]) passes(rnd(i), ['V19']);
  });
  test('B4-sweep-random-381-olympic-fillable-kept: the budget trim of Olympic exposures removes the station nobody can fill first (knee pain: no clean) and keeps the DB snatch, so the week holds its Olympic lift (R2-ATH-04)', () => {
    const p = rnd(381);
    // (fix round 2 / F1, E-143: a stay-active plan switches its power block off only when that keeps a day's work-lift pattern; it says so)
    const off = (n) => ((p.time_check.by_block || []).find(b => b.training_block === n) || p.time_check).blocks_off || [];
    for (const w of stairWeeks(p)) if (!off(w.training_block).some(b => b.block === 'power')) assert.ok(items(w).some(x => x.it.bucket === 'AP_TRIPLE_EXT' && x.it.sets > 0), `w${w.n} no Olympic lift`);
    passes(p, ['V19']);
  });
  test('B4-sweep-random-1386-lone-station: when the kit leaves a group\'s other stations of the day empty, the lone exercise leaves that day - never 1 exercise of a group (V23 / H18)', () => {
    for (const i of [1386, 412]) passes(rnd(i), ['V23', 'H18']);
  });
  test('B4-sweep-random-676-added-fill-credits: an added circuit station is printed with the pick the volume engine counted (V14 / H08 credits agree)', () => {
    passes(rnd(676), ['V14', 'H08']);
  });
  test('B4-sweep-random-318-athletic-raise-limit (fixture): the athletic stairway\'s "never drop" raise stops at the V27 budget limit (70-year-old opt-in, small jump target)', () => {
    passes(rnd(318, fixture), ['V27']);
  });
  test('B4-sweep-random-396-circuit-no-work: a 3 x 30 min body-weight circuit that holds no resistance station is told so (every group listed) and has no set stairway to check (H21, like the straight-set block)', () => {
    const p = rnd(396);
    // v0.4 fix round 1 (E-93): a big group whose circuit stations cannot reach the floor keeps them, listed below the floor
    const below = (p.time_check.trained_below_floor || []).map(x => x.group);
    assert.ok(p.time_check.trained_groups.every(g => below.includes(g)), JSON.stringify(p.time_check));
    assert.ok(p.meta.warnings.some(x => x.key === 'warning.time_check'));
    passes(p, ['H21', 'V22']);
  });
  test('B4-sweep-random-13-class-lift-short-day: a 30-minute class day whose fixed class work (warm-up, skill, Olympic piece, WOD) leaves no room drops its class lift too - no 30-minute day planned at 49 minutes (E-64)', () => {
    for (const i of [13, 188, 1042]) {
      const p = rnd(i);
      for (const w of p.weeks.filter(x => !x.test)) for (const d of w.days.filter(x => x.kind === 'main')) {
        const lift = d.blocks.some(b => b.items.some(it => it.role === 'work' && it.sets > 0));
        if (lift) assert.ok(d.est_minutes <= d.minutes_limit * R.session.time_fit.fit_factor + 1, `random-${i} w${w.n} ${d.weekday} ${d.est_minutes}`);
      }
      passes(p, ['V18', 'V22', 'V23', 'H17', 'H18', 'H21']);
    }
  });
  test('B4-sweep-random-1322-class-lifts-45-min: a 4 x 45 min class keeps its class lift on every lift day (E-64)', () => {
    const p = rnd(1322);
    for (const w of stairWeeks(p)) for (const d of w.days.filter(x => x.kind === 'main' && x.day_type !== 'aerobic')) assert.ok(d.blocks.some(b => b.items.some(it => it.role === 'work' && it.sets > 0)), `w${w.n} ${d.weekday}`);
    passes(p, ['V22', 'V23', 'H17', 'H18']);
  });
  test('B4-class-lift-validators: a class lift a group not trained directly keeps is not "listed but trained" (V22) and may stand alone on its day (V23); outside the class model a lone exercise still fails', () => {
    const p = plan('04');
    const kept = p.time_check.not_trained_directly.filter(x => x.reason === 'class_lift').map(x => x.group);
    const w = stairWeeks(p)[1];
    const lone = items(w).filter(x => x.d.kind === 'main' && kept.includes(x.it.group));
    assert.ok(lone.length > 0 && lone.every(x => x.it.role === 'work' && (groupCredits(model, x.it.credits)[x.it.group] || 0) >= 1 - 1e-9));
    passes(p, ['V22', 'V23']);
  });
});
