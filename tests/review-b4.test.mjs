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
import { groupCredits } from '../engine/lines.mjs';
import { ballisticCircuitModel } from './helpers/v06.mjs';
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
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R04-lower-peak-trained-only: "a lower peak for ..." names only groups the plan trains directly (never a group …'
  //   'a lower peak for ...' was a time-check notice (CT-01); a lower top is now said per group by warning.capped_by_template

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
    // (engine 0.6 selection, converted - DECISIONS G-135: the bootcamp's cardio station is cardio now; the B2 ballistic station is read on the model with the cardio-first rule off)
    const p = generate(intakeOf('05'), ballisticCircuitModel());
    let prev = 0;
    for (const w of stairWeeks(p)) {
      const ab = w.athletic_budget;
      // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): a week that runs one more round throws whole balls a round -
      // never fewer than the week before, so at most rounds - 1 above the week's target)
      assert.ok(ab.planned.throws <= ab.targets.throws + w.circuit.rounds - 1, `w${w.n} ${ab.planned.throws} > ${ab.targets.throws}`);
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
      // (v0.5 fix round 1, R4-SES-02 / sample 08 major: the care lives in the template's own lift where the day holds one - the item
      // carries the flag 'joint_care' and the code in its why line; rules.prehab.x1.in_template_slot)
      const codes = items(w).filter(x => x.b.kind === 'prehab' || (x.it.flags || []).includes('joint_care')).map(x => ((x.it.why || []).find(y => y.key === 'why.prehab') || { args: {} }).args.code);
      assert.ok(codes.includes('SHOULDER_THROWER'), `w${w.n} no shoulder care: ${codes.join(',')}`);
      // engine 0.5.0 / V2 (converted; DECISIONS G): the racket elbow's only exercise (wrist extension) is an optional add-on
      // (COACH-R4 R4-LIB-01), so the elbow code holds no station - the plan offers it as an add-on
      assert.ok(!codes.includes('ELBOW_LATERAL_RACKET'), `w${w.n}: an elbow station with no live exercise`);
    }
    assert.ok(p.meta.addons.some(a => a.code === 'ELBOW_LATERAL_RACKET' && /wrist/.test(a.exercise_id)), 'the wrist work is offered');
    const er = items(p.weeks[0]).find(x => (x.b.kind === 'prehab' || (x.it.flags || []).includes('joint_care')) && /external-rotation|face-pull|y-t/.test(x.it.exercise_id));
    assert.ok(er, 'an external-rotation / face-pull / Y-T pick');
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R08-not-trained-copy: groups the 2 x 45 plan gives no credited set are named "not trained in this plan"; group…'
  //   the 'not trained in this plan' copy belonged to the time check (CT-01); a 2-day plan follows the 2-day rule (R4-SES-03) and credit-only groups are named by warning.credit_only_groups

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R01-test-week-day: the end-test Friday (78 min with the deadlift work-up) is told as a test day, not as "the m…'
  //   no day is judged against minutes, so there is no 'test day is long' notice to word (CT-01)

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
    // (v0.5: no block is ever switched off for time - CT-01 - so every stairway week holds its Olympic lift)
    for (const w of stairWeeks(p)) assert.ok(items(w).some(x => x.it.bucket === 'AP_TRIPLE_EXT' && x.it.sets > 0), `w${w.n} no Olympic lift`);
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
  // RETIRED in engine 0.5.0 (DECISIONS G): 'B4-sweep-random-13-class-lift-short-day: a 30-minute class day whose fixed class work (warm-up, skill, Olympic…'
  //   a 30-minute class day no longer exists (R4-SES-01): the class lift is never dropped for time
  test('B4-sweep-random-1322-class-lifts-45-min: a 4 x 45 min class keeps its class lift on every lift day (E-64)', () => {
    const p = rnd(1322);
    for (const w of stairWeeks(p)) for (const d of w.days.filter(x => x.kind === 'main' && x.day_type !== 'aerobic')) assert.ok(d.blocks.some(b => b.items.some(it => it.role === 'work' && it.sets > 0)), `w${w.n} ${d.weekday}`);
    passes(p, ['V22', 'V23', 'H17', 'H18']);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'B4-class-lift-validators: a class lift a group not trained directly keeps is not "listed but trained" (V22) an…'
  //   V22 no longer reads a time-check list and V23 allows one exercise for a group on a full-body day (R4-SES-05)
});
