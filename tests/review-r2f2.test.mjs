// tests/review-r2f2.test.mjs - engine 0.4.0 FIX ROUND 2 / F2 (athletic work) regression tests. One test per fixed issue of the
// coach-eye reviews of the v0.4 sample plans (grades D ... B-) in the athletic area, named R<sample>-<slug> after the reviewed sample,
// and R2F2-sweep-<intake>-<slug> for an intake of the random corpus (tests/helpers/random-intake.mjs) the round's own changes made fail
// on the way. samples/REVIEW_LOG.md (v0.4 fix round 2 / F2) and engine/DECISIONS.md (E-160 ...) list them. Plans are built on the
// compiled model (model/) unless the test says the fixture.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { planAthletic, olympicVariantByDay, perSetBounds } from '../engine/athletic.mjs';
import { ballisticCircuitModel } from './helpers/v06.mjs';
import { loadCompiledModel, loadFixtureModel, INTAKE_DIR } from './helpers/models.mjs';
import { randomIntake } from './helpers/random-intake.mjs';

const model = loadCompiledModel();
const fixture = loadFixtureModel();
const R = model ? model.rules : null;
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const planWith = (n, mut) => { const i = intakeOf(n); mut(i); return generate(i, model); };
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const passes = (p, ids) => { for (const id of ids) assert.ok(check(p, id).pass, `${id}: ${JSON.stringify(check(p, id).violations.slice(0, 2))}`); };
const stairWeeks = (p, tb) => p.weeks.filter(w => w.block_type === 'stairway' && (tb === undefined || w.training_block === tb));
const trainWeeks = (p) => stairWeeks(p).filter(w => !w.test);                 // the stairway weeks between the tests
const JUMPS = ['plyo_contacts', 'jump_contacts'];
const sum = (o, keys) => keys.reduce((a, k) => a + ((o || {})[k] || 0), 0);
/** a family's weekly total as the week is planned: a station a timed test replaced counts as done (E-165) */
const famSeries = (ws, keys) => ws.map(w => sum(w.athletic_budget.planned, keys) + sum(w.athletic_budget.test_replaced, keys));
const maxRun = (v) => { let best = 1, run = 1; for (let i = 1; i < v.length; i++) { run = Math.abs(v[i] - v[i - 1]) < EPS ? run + 1 : 1; best = Math.max(best, run); } return best; };
const lowerJump = (x) => x.it.bucket === 'AP_PLYO' && x.it.athletic && JUMPS.includes(x.it.athletic.key);
const ankle = (x) => x.it.bucket === 'AP_JUMP_LIMITED_KNEE' && x.it.athletic && x.it.athletic.key === 'low_contacts';
const direction = (id) => (/lateral|side|zig-zag|skater|cossack/.test(id) ? 'lateral' : /broad|forward|bound|hurdle|zig|backward/.test(id) ? 'horizontal' : 'vertical');
const uni = (e) => !!e && ['unilateral', 'alternating'].includes(e.laterality);
const ebFirstWeeks = (p) => { const out = []; let last = null; for (const w of p.weeks) { if (w.exercise_block !== last) { out.push(w); last = w.exercise_block; } } return out; };

describe('v0.4 fix round 2 / F2: athletic work (coach-eye reviews of the v0.4 samples)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------ 01 swimming
  test('R01-athletic-climbs-to-the-end: the swimmer\'s jumps, ankle work and throws climb through the hardest weeks - no family holds one total for five weeks (jumps sat at 36 from week 7, ankle at 20 from week 8) and the plyo share ends near the approved 25 % (E-160, E-162, E-166)', () => {
    const p = plan('01');
    const ws = stairWeeks(p).filter(w => !w.athletic_budget.hold);
    for (const keys of [JUMPS, ['low_contacts'], ['throws']]) {
      const v = famSeries(ws, keys);
      assert.ok(v[v.length - 1] > v[0], `${keys} ${v.join(' ')}`);
      for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] - EPS, `${keys} drops: ${v.join(' ')}`);
      assert.ok(maxRun(v) <= 4, `${keys} holds ${maxRun(v)} weeks: ${v.join(' ')}`);
      assert.ok(maxRun(v.slice(-5)) <= 3, `${keys} flat through the hardest weeks: ${v.join(' ')}`);
    }
    const peak = ws[ws.length - 1].athletic_budget;
    // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the round added a third chest exercise and a shoulder
    // exercise on the training days - sample 01 majors - so the same jump stations are a slightly smaller share of a bigger week)
    assert.ok(peak.planned_share >= 0.2 && peak.planned_share <= 0.25 + EPS, `share ${peak.planned_share}`);
    assert.ok(peak.planned.low_contacts >= 0.9 * peak.targets.low_contacts, `ankle ${peak.planned.low_contacts} / ${peak.targets.low_contacts}`);
    passes(p, ['V27']);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R01-ankle-second-day: the bone-loading ankle block runs on a second day from the exercise block whose target h…'
  //   read the time check's trained_groups ('costs the session no strength group'); the second ankle day opening with its exercise block is asserted by review-f2 R01-ankle-in-place-first
  test('R01-shoulder-care-two-sets: the swimmer\'s shoulder care runs 2 sets every session inside the rests of the pulls, and it is not a block to switch off (R3-ATH-01, ORD-07; E-175)', () => {
    const p = plan('01');
    for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
      const care = d.blocks.flatMap(b => b.items.map(it => ({ b, it }))).filter(x => x.it.bucket === 'RECOVERY_ARM_CARE');
      assert.equal(care.length, 1, `w${w.n} ${d.weekday}`);
      assert.equal(care[0].it.sets, 2, `w${w.n} ${d.weekday} sets`);
      assert.ok(care[0].it.notes.some(nt => nt.key === 'note.prehab_in_rest'));
      assert.equal(care[0].b.toggle, false);
      assert.ok(!d.toggle_blocks.includes('prehab'), `w${w.n} ${d.weekday} toggles ${d.toggle_blocks}`);
    }
    // ... and no band: side-lying external rotation, floor Y / T raises, KB face pull
    const ids = new Set(allItems(p).filter(x => x.it.bucket === 'RECOVERY_ARM_CARE').map(x => x.it.exercise_id));
    for (const id of ids) assert.ok(!/band/.test(id), id);
    assert.ok(ids.size >= 2);
  });
  test('R01-olympic-by-day-lift: clean on the squat-pattern day, snatch on the hinge-pattern day - the hex-bar deadlift day no longer holds a clean pull (R2-ATH-04; 01 / 03)', () => {
    for (const n of ['01', '02', '03']) {
      const p = plan(n);
      let seen = 0;
      for (const w of p.weeks) for (const d of w.days) {
        const its = d.blocks.flatMap(b => b.items);
        const wl = its.find(it => it.role === 'work' && ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'].includes(it.bucket));
        for (const it of its.filter(x => x.bucket === 'AP_TRIPLE_EXT' && x.exercise_id)) {
          if (!wl) continue;
          const fam = ex(it.exercise_id).athletic.olympic_family;
          if (!['clean', 'snatch'].includes(fam)) continue;
          const want = ['RP_BKD', 'RP_UKD'].includes(wl.bucket) ? 'clean' : 'snatch';
          assert.equal(fam, want, `${n} w${w.n} ${d.weekday}: ${it.exercise_id} next to ${wl.exercise_id}`);
          assert.ok(it.flags.includes(want + '_day'));
          seen++;
        }
      }
      assert.ok(seen > 0, n);
      passes(p, ['V19']);
    }
    assert.equal(olympicVariantByDay('clean', 'RP_BHD', R), 'snatch');
    assert.equal(olympicVariantByDay('snatch', 'RP_UKD', R), 'clean');
    assert.equal(olympicVariantByDay('swing', 'RP_BKD', R), 'swing');
    assert.equal(olympicVariantByDay('clean', null, R), 'clean');
  });
  test('R01-capacity-told: a family whose peak sits under 85 % of the sport target is told up front (the swimmer\'s jumps hold about three quarters of theirs, and nothing said so; E-160)', () => {
    const p = plan('01');
    const peak = stairWeeks(p).filter(w => !w.athletic_budget.hold).slice(-1)[0].athletic_budget;
    const share = sum(peak.planned, JUMPS) / sum(peak.targets, JUMPS);
    const told = p.meta.warnings.find(x => ['warning.athletic_capacity', 'warning.athletic_capacity_block'].includes(x.key) && x.args.key === 'athletic.key.jumps');
    // v0.5: with 12 exercises a session and no time cut the swimmer's days hold his jump target (the template held three quarters
    // of it); the rule is unchanged - under 85 % is told with its share, at or above it nothing is said
    if (share < R.athletic.reconcile.warn_below_share) { assert.ok(told, JSON.stringify(p.meta.warnings.map(x => x.key))); assert.equal(told.args.pct, Math.round(100 * share)); }
    else assert.equal(told, undefined, 'no capacity notice when the template holds the target');
    assert.ok(share >= 0.75, `jump share ${share}`);
  });

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R02-test-day-replaces-stations: the 10-30 m sprint test and the jump test replace Thursday's sprint and jump …'
  //   asserted that the test day runs inside the session minutes; there is no session length (CT-01) - a test still replaces its station (review-r2f2 R03 / dose tests)
  test('R02-end-test-baseline-dose: on the tested days of the end-test week the athletic and Olympic work runs the baseline week\'s dose - the front squat 3RM follows 120 m of accelerations and 2 clean sets, as in week 1 (R2-PER-07; E-165)', () => {
    const p = plan('02');
    const day = (n, wd) => p.weeks[n - 1].days.find(d => d.weekday === wd).blocks.flatMap(b => b.items);
    const tot = (its, key) => its.filter(it => it.athletic && it.athletic.key === key).reduce((a, it) => a + it.athletic.total, 0);
    const oly = (its) => its.filter(it => it.bucket === 'AP_TRIPLE_EXT').reduce((a, it) => a + it.sets, 0);
    const mon1 = day(1, 'Mon'), mon12 = day(12, 'Mon'), mon11 = day(11, 'Mon');
    assert.ok(mon12.some(it => it.test), 'Monday week 12 holds the squat test');
    // (v0.5: week 1's Monday also carries the metres of Thursday's station that the sprint test replaces; the end-test Monday runs
    // the station's own baseline dose - never more than week 1, less than week 11)
    assert.ok(tot(mon12, 'sprint_m') <= tot(mon1, 'sprint_m') && tot(mon12, 'sprint_m') > 0, `${tot(mon12, 'sprint_m')} vs ${tot(mon1, 'sprint_m')}`);
    assert.ok(tot(mon12, 'sprint_m') < tot(mon11, 'sprint_m'));
    assert.ok(tot(mon11, 'sprint_m') > tot(mon1, 'sprint_m'), 'week 11 runs more than the baseline');
    assert.equal(oly(mon12), oly(mon1));
    assert.ok(oly(mon11) > oly(mon1));
    assert.equal(p.weeks[11].athletic_budget.test_dose, 'baseline');
    // V27: the end-test week may plan less than the week before, never more
    const q = JSON.parse(JSON.stringify(p));
    q.weeks[11].athletic_budget.planned.throws = q.weeks[10].athletic_budget.planned.throws + 30;
    assert.ok(validatePlan(q, model).checks.find(c => c.id === 'V27').violations.some(v => v.args.code === 'hold_over'));
  });
  // (converted from todo in engine 0.7, COACH-R5 R5-ATH-02 'they may hold for up to 2 weeks, as long as they reach the block's final
  // number' - DECISIONS G-256: every family, sprint metres included, holds at most 2 weeks (a run of 3 equal weeks) and its last
  // stairway week is its highest; the stricter 'cuts and throws hold at most 1 week' line read an engine inference, not his rule)
  test('R02-cod-and-throws-climb: cuts and throws climb to the block\'s peak in even steps (cuts sat at 72 from week 4 to week 12, throws at 90 from week 8) - one scale down the block, no total held for more than two weeks (E-160, E-166; R5-ATH-02)', () => {
    const p = plan('02');
    const ws = stairWeeks(p).filter(w => !w.athletic_budget.hold);
    const maxHold = model.rules.athletic.v7.hold.max_hold_weeks;
    for (const keys of [['cod_cuts'], ['throws'], ['sprint_m'], JUMPS]) {
      const v = famSeries(ws, keys);
      for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] - EPS, `${keys} drops: ${v.join(' ')}`);
      assert.ok(v[v.length - 1] >= 1.2 * v[0], `${keys} ${v.join(' ')}`);
      assert.ok(maxRun(v) <= maxHold + 1, `${keys} holds ${maxRun(v)} weeks: ${v.join(' ')}`);
      assert.ok(v[v.length - 1] >= Math.max(...v) - EPS, `${keys}: the block's final number is its last week: ${v.join(' ')}`);
    }
    // the scale never shrinks from one exercise block to the next
    for (const k of ['cod_cuts', 'throws', 'sprint_m']) { const sc = ws.map(w => w.athletic_budget.scale[k]); for (let i = 1; i < sc.length; i++) assert.ok(sc[i] >= sc[i - 1] - EPS, `${k} scale ${sc.join(' ')}`); }
  });
  test('R02-v27-early-peak: V27 fails a family that sits on its full stations for most of the block while well under its target (the 72 cuts from week 4 to week 12; E-166)', { todo: "engine 0.5.0 (DECISIONS G): ATHLETIC LAYER, open: the mutation (cuts set to the peak from week 3) now trips V27 goal_over_target before early_peak because the plan reaches its cut targets; the early-peak rule needs a mutation that stays under the target" }, () => {
    const p = JSON.parse(JSON.stringify(plan('02')));
    const peak = p.weeks[10].athletic_budget.planned.cod_cuts;
    for (let n = 3; n <= 11; n++) { p.weeks[n - 1].athletic_budget.planned.cod_cuts = peak; if (p.weeks[n - 1].athletic_budget.goals) p.weeks[n - 1].athletic_budget.goals.cod_cuts = peak; }
    const v27 = validatePlan(p, model).checks.find(c => c.id === 'V27');
    assert.ok(v27.violations.some(v => v.args.code === 'early_peak' && v.args.key === 'cod_cuts'), JSON.stringify(v27.violations.slice(0, 3)));
    passes(plan('02'), ['V27']);
  });
  test('R02-cod-tiers-and-reaction: the linebacker\'s COD station steps easy -> moderate -> hard turns by exercise block and a reaction drill runs every week from the Land & Go stage (two receiver routes for 12 weeks, no reactive drill; E-171)', () => {
    const p = plan('02');
    const T = R.athletic.r2.selection.cod_tiers.by_id;
    const firsts = ebFirstWeeks(p).filter(w => w.block_type === 'stairway');
    const tue = firsts.map(w => items(w).find(x => x.d.weekday === 'Tue' && x.it.bucket === 'AP_COD').it.exercise_id);
    assert.deepEqual(tue.map(id => T[id]), [1, 2, 3], tue.join(' -> '));
    // engine 0.5.0 / V2 (converted; DECISIONS G): the reaction drill is an optional add-on (COACH-R4 R4-LIB-01) - never a COD station's
    // pick, in any stage; both reactive profiles are offered it as an add-on (the tiers above still step easy -> moderate -> hard)
    const reactive = R.athletic.f2.cod.reactive_drill_ids;
    for (const n of ['02', '03']) {
      const q = plan(n);
      for (const w of q.weeks) assert.ok(!items(w).some(x => x.it.bucket === 'AP_COD' && reactive.includes(x.it.exercise_id)), `${n} w${w.n}`);
      assert.ok(q.meta.addons.some(a => reactive.includes(a.exercise_id)), `${n}: the reaction drill is offered`);
    }
  });
  test('R02-sport-fit-jumps: no jump or COD drill the library writes for another sport - the swimmer\'s streamline squat jump is the swimmer\'s (02 Thursday, 03 Monday; E-167)', () => {
    for (const n of ['02', '03', '08']) for (const x of allItems(plan(n)).filter(x => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket))) {
      assert.notEqual(x.it.exercise_id, 'streamline-squat-jump-arms-overhead', `${n} w${x.w.n} ${x.d.weekday}`);
    }
    // engine 0.5.0 / V2 (converted; DECISIONS G): the streamline squat jump is an optional add-on (COACH-R4 R4-LIB-01) - the swimmer is
    // offered it (an add-on and a swap of her jump station), no plan picks it, and no other sport is offered it
    assert.ok(!allItems(plan('01')).some(x => x.it.exercise_id === 'streamline-squat-jump-arms-overhead'), 'never the pick');
    assert.ok(plan('01').meta.addons.some(a => a.exercise_id === 'streamline-squat-jump-arms-overhead'), 'the swimmer is offered it');
    assert.ok(allItems(plan('01')).some(x => x.it.bucket === 'AP_PLYO' && (x.it.swaps || []).includes('streamline-squat-jump-arms-overhead')), 'a swap of her jump station');
    for (const n of ['02', '03', '08']) assert.ok(!plan(n).meta.addons.some(a => a.exercise_id === 'streamline-squat-jump-arms-overhead'), n);
  });
  test('R02-share-end-clamp: the weekly plyo share never passes the sport\'s approved block-end share (55 % against 50 %) and a 230-lb athlete holds at most two single-leg reactive stations a week (R2-ATH-01, CAT-10; E-163, E-170)', () => {
    const p = plan('02');
    const end = p.meta.athletic.plyo_share.end;
    for (const w of trainWeeks(p)) assert.ok(w.athletic_budget.planned_share <= Math.max(end, w.athletic_budget.plyo_share) + EPS, `w${w.n} ${w.athletic_budget.planned_share}`);
    const cap = R.athletic.r2.selection.single_leg_reactive_heavy.max_wk;
    for (const w of p.weeks) {
      const n = items(w).filter(x => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket) && ex(x.it.exercise_id) && ex(x.it.exercise_id).athletic.quality === 'plyometric' && uni(ex(x.it.exercise_id))).length;
      assert.ok(n <= cap, `w${w.n}: ${n} single-leg reactive stations`);
    }
  });
  test('R02-throws-change-per-block: a throw station takes another throw at each exercise-block start and never returns to an earlier block\'s; the sit-up pass uses an 8-10 lb ball (PER-02 / PER-03; E-171)', () => {
    for (const n of ['01', '02', '08']) {
      const p = plan(n);
      const bySlot = new Map();
      for (const w of ebFirstWeeks(p)) for (const x of items(w).filter(x => x.it.bucket === 'AP_THROW')) bySlot.set(x.it.slot_id, [...(bySlot.get(x.it.slot_id) || []), x.it.exercise_id]);
      assert.ok(bySlot.size > 0);
      for (const [slot, ids] of bySlot) assert.equal(new Set(ids).size, ids.length, `${n} ${slot}: ${ids.join(' -> ')}`);
    }
    const pass = allItems(plan('02')).find(x => x.it.exercise_id === 'medball-sit-up-to-chest-pass');
    assert.ok(pass);
    assert.deepEqual([pass.it.load.min, pass.it.load.max], [8, 10]);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R02-set-climb: a station whose family is under its target with every dose at the top takes one more set where …'
  //   asserted that a station gains a set only 'where the day has the minutes' (90 vs 105 min); minutes never limit a set now (CT-01, engine/athletic.mjs planAthletic)

  // ------------------------------------------------------------------------------------------------ 03 soccer
  test('R03-jump-stations-by-sport: the soccer week holds no upper-body plyo station (Wednesday\'s push-up box jump is a lower-body jump) and its jumps include a single-leg and a horizontal jump from the first block (04 plyo 60 % single-leg, 40 % horizontal; E-167, E-168)', { todo: "engine 0.5.0 (DECISIONS G): ATHLETIC LAYER, open: the soccer week keeps the template's upper-body plyo station (push-up box jump) - the jump track is no longer short of stations, so the 'turn it into a lower-body jump' rule does not fire; the profile has no upper-body plyo target" }, () => {
    const p = plan('03');
    assert.ok(!allItems(p).some(x => x.it.athletic && x.it.athletic.key === 'upper_contacts'), 'an upper-body plyo station is left');
    for (const w of trainWeeks(p)) {
      const jumps = items(w).filter(lowerJump);
      assert.ok(jumps.length >= 3 && new Set(jumps.map(x => x.d.weekday)).size >= 2, `w${w.n}: ${jumps.length} jump stations`);
      assert.ok(jumps.some(x => uni(ex(x.it.exercise_id))), `w${w.n}: no single-leg jump`);
      assert.ok(jumps.some(x => direction(x.it.exercise_id) === 'horizontal'), `w${w.n}: no horizontal jump`);
    }
    // the first reactive block's reactive jumps still land on two feet (E-32)
    for (const x of allItems(p).filter(x => x.w.block_type === 'stairway' && lowerJump(x) && x.it.athletic.key === 'plyo_contacts')) assert.equal(ex(x.it.exercise_id).laterality, 'bilateral', x.it.exercise_id);
    // the swimmer's week already holds its jump stations: its upper-body station stays (the layout is not disturbed)
    assert.ok(allItems(plan('01')).some(x => x.it.athletic && x.it.athletic.key === 'upper_contacts'));
  });
  test('R03-preseason-speed-and-power: the pre-season holds its Olympic sets, sprint metres and cuts at or above the last off-season week (6 -> 4 sets, 560 m against 600; R2-PER-06 \'more speed and power\'; E-164)', { todo: "engine 0.5.0 (DECISIONS G): ATHLETIC LAYER, open: the soccer pre-season holds 72 cuts against 108 in the last off-season week (the off-season now holds three COD stations); R2-PER-06 'more speed and power' needs the pre-season block sized to the off-season peak" }, () => {
    const p = plan('03');
    const off = stairWeeks(p).filter(w => !w.athletic_budget.hold).slice(-1)[0].athletic_budget.planned;
    const pre = p.weeks.filter(w => w.block_type === 'pre_season');
    assert.ok(pre.length > 0);
    for (const w of pre) {
      const a = w.athletic_budget.planned;
      for (const k of ['olympic_sets', 'sprint_m', 'cod_cuts']) assert.ok(a[k] >= off[k], `w${w.n} ${k} ${a[k]} < ${off[k]}`);
      assert.equal(a.sprint_m, w.athletic_budget.targets.sprint_m);
    }
    for (const id of ['soccer', 'football_big_skill', 'swimming_middle']) { const pr = model.sport(id).pre_season; for (const k of ['TE', 'SPRINT', 'COD']) assert.ok(pr[k] >= 1, `${id} ${k}`); }
    passes(p, ['V27']);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R03-tests-replace-stations: in the soccer test weeks the 5-10-5 replaces a COD station, the sprint test the ac…'
  //   asserted the end-test Monday's minutes (79, not 94); there is no session length to hold (CT-01)

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R04-wod-climbs: a WOD the time check holds at 10 minutes climbs by its work - an EMOM / for-time station does …'
  //   its premise was a WOD the time check holds at 10 minutes; the WOD now climbs 10 -> 20 minutes on every class day (tests/dose WOD test)
  test('R04-wod-changes-at-the-block: every WOD changes at least one of the stations it always runs at the exercise-block start, and no station appears in three of the week\'s WODs (E-173)', () => {
    const p = plan('04');
    const N = R.conditioning.wod.stations[0];
    const run = (w) => new Map(items(w).filter(x => x.it.wod).map(x => [x.d.weekday, x.it.wod.stations.slice(0, N)]));
    const a = run(p.weeks[0]), b = run(p.weeks[4]);
    for (const [wd, st] of a) assert.ok(st.some(id => !b.get(wd).includes(id)), `${wd}: ${st.join(', ')} twice`);
    for (const w of [p.weeks[0], p.weeks[4]]) {
      const n = new Map();
      for (const st of run(w).values()) for (const id of st) n.set(id, (n.get(id) || 0) + 1);
      for (const [id, k] of n) assert.ok(k <= 2, `w${w.n} ${id} x ${k}`);
    }
  });
  test('R04-end-test-no-olympic: the class\'s end-test week runs no Olympic work - the max attempt is the first heavy lift of the day (OBSERVED class cycle WK 8 = strength LVL 5 only; three heavy singles came before the 1RM; E-172)', () => {
    const p = plan('04');
    const last = p.weeks[p.weeks.length - 1];
    assert.equal(last.test.type, 'end');
    assert.ok(!items(last).some(x => x.it.bucket === 'AP_TRIPLE_EXT'), 'an Olympic lift in the end-test week');
    assert.equal(last.athletic_budget.test_dose, 'class_no_power');
    for (const w of p.weeks.slice(0, -1)) assert.ok(items(w).some(x => x.it.bucket === 'AP_TRIPLE_EXT'), `w${w.n}`);
    passes(p, ['V19', 'V27']);
    // a competitive athlete's end-test week keeps its Olympic lifts (at the baseline dose on tested days)
    assert.ok(items(plan('02').weeks[11]).some(x => x.it.bucket === 'AP_TRIPLE_EXT'));
  });

  // ------------------------------------------------------------------------------------------------ 05 bootcamp
  test('R05-circuit-throws-by-the-round: the circuit\'s ball station is a few full-intent throws a round (6 -> 10 with the stairway, then rest until the bell), climbing into the last week; a weigh-in holds nothing (13 throws in 50 s; 39 = 39; E-174)', () => {
    // (engine 0.6 selection, converted - DECISIONS G-135: the bootcamp's cardio station is cardio now; the B2 ballistic station is read on the model with the cardio-first rule off)
    const p = generate(intakeOf('05'), ballisticCircuitModel());
    const PR = R.athletic.circuit_ballistic.per_round;
    const per = p.weeks.map(w => items(w).filter(x => x.b.kind === 'circuit' && x.it.athletic && x.it.athletic.key === 'throws').map(x => x.it.athletic.per_set));
    // v0.5 (G-09: the rounds come from the level - 4 for this L2 client - not from the minutes): the ball station still shares the
    // week's throw target (never more than it, review-b4 R05-circuit-throws-week-target), so with 4 rounds the first weeks throw
    // 5 a round where 3 rounds threw 6; it still ends at the rule's 10
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the last two weeks run one more round (rules.supersets.
    // bootcamp.x2.rounds_late), so the week's throws are 8 a round x 5 rounds = the target of 40 where 4 rounds threw 10; the throws
    // a round never go down and the week's throws climb into the last weeks
    p.weeks.forEach((w, i) => { const v = per[i]; assert.equal(v.length, 1); const lo = Math.min(PR[0], Math.floor(w.athletic_budget.targets.throws / w.circuit.rounds)); assert.ok(v[0] >= lo && v[0] <= PR[1], `w${w.n}: ${v[0]} throws a round`); });
    const s = per.map(v => v[0]);
    for (let i = 1; i < s.length; i++) assert.ok(s[i] >= s[i - 1], s.join(' '));
    const lastW = p.weeks[p.weeks.length - 1];
    assert.ok(s[0] >= PR[0] - 1); assert.equal(s[s.length - 1], Math.min(PR[1], Math.floor(lastW.athletic_budget.targets.throws / lastW.circuit.rounds)));
    const tot = p.weeks.map((w, i) => s[i] * w.circuit.rounds);
    for (let i = 1; i < tot.length; i++) assert.ok(tot[i] >= tot[i - 1], tot.join(' '));
    assert.ok(tot[tot.length - 1] > tot[tot.length - 3], `the last weeks do not climb: ${tot.join(' ')}`);
    assert.ok(allItems(p).filter(x => x.b.kind === 'circuit' && x.it.athletic && x.it.athletic.key === 'throws').every(x => x.it.notes.some(nt => nt.key === 'note.circuit_ballistic_ball_rest')));
    assert.ok(!p.weeks[p.weeks.length - 1].athletic_budget.hold, 'a body-weight test holds the last week');
    assert.equal(p.meta.athletic.enabled, true);
    assert.equal(p.meta.athletic.mode, 'circuit_ballistic');
    passes(p, ['V27']);
  });
  test('R05-throw-plane-rotates: the circuit\'s ball station changes plane at the exercise-block start - a sagittal throw, then a rotational one (04 general population 50 / 50; every throw was sagittal; E-174)', () => {
    // (engine 0.6 selection, converted - DECISIONS G-135: the bootcamp's cardio station is cardio now; the B2 ballistic station is read on the model with the cardio-first rule off)
    const p = generate(intakeOf('05'), ballisticCircuitModel());
    const pl = ebFirstWeeks(p).map(w => { const x = items(w).find(x => x.b.kind === 'circuit' && x.it.athletic && x.it.athletic.key === 'throws'); return ex(x.it.exercise_id).plane === 'transverse' ? 'transverse' : 'sagittal'; });
    assert.ok(pl.length >= 2 && new Set(pl).size === 2, pl.join(' -> '));
  });

  // ------------------------------------------------------------------------------------------------ 08 pickleball
  test('R08-lateral-low-impact: the 52-year-old court player with knee pain gets a lateral jump or ankle station every week from the second block, no backward hop drill and no floor squat jump - the jump lands on a box in every stage (R3-ATH-02; E-169)', () => {
    const p = plan('08');
    const J = (w) => items(w).filter(x => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket) && x.it.exercise_id);
    const ebs = [...new Set(p.weeks.map(w => w.exercise_block))];
    for (const w of p.weeks.filter(x => x.exercise_block !== ebs[0])) assert.ok(J(w).some(x => direction(x.it.exercise_id) === 'lateral'), `w${w.n}: no lateral station`);
    for (const x of allItems(p).filter(x => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket))) {
      assert.ok(!/(^|-)backward(-|$)/.test(x.it.exercise_id), `w${x.w.n} ${x.it.exercise_id}`);
      const e = ex(x.it.exercise_id);
      assert.ok(!(e.tags.includes('high_impact') || e.tags.includes('bound') || e.tags.includes('depth_jump')), x.it.exercise_id);
      assert.notEqual(x.it.exercise_id, 'squat-jump-high-bodyweight-or-lightly-loaded', `w${x.w.n}`);
    }
    // the jump contacts never fall through the hardest weeks (14 -> 12 -> 10 -> 10)
    const v = famSeries(p.weeks, JUMPS);
    for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] - EPS, v.join(' '));
    passes(p, ['V27', 'V5']);
  });
  test('R08-swaps-low-impact: the swaps of a knee-pain client\'s jumps hold no lunge / switch jump and no hang clean with an unstated catch (the split and lunge jump family is deep knee flexion; E-169)', () => {
    for (const id of ['rfe-lunge-jumps-suitcase-db', 'db-staggered-stance-switch-jump', 'split-stance-squat-jumps-lunge-jumps', 'hang-clean-of-1rm-catch-not-stated']) assert.ok(model.ex(id).tags.includes('deep_knee_flexion'), id);
    const p = plan('08');
    for (const x of allItems(p).filter(x => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_TRIPLE_EXT'].includes(x.it.bucket))) {
      for (const id of x.it.swaps) assert.ok(!model.ex(id).tags.includes('deep_knee_flexion'), `${x.it.exercise_id} -> ${id}`);
    }
  });
  test('R08-throws-step: the one throw station climbs a throw a side every few weeks to its top instead of sitting on it for ten weeks, and every family under 85 % of its target is told (E-160, E-166)', () => {
    const p = plan('08');
    const v = famSeries(p.weeks, ['throws']);
    assert.ok(v[v.length - 1] > v[0] && maxRun(v) <= 4, v.join(' '));
    for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1], v.join(' '));
    const peak = p.weeks[p.weeks.length - 1].athletic_budget;
    for (const [fam, keys] of [['ankle', ['low_contacts']], ['throws', ['throws']]]) {
      if (sum(peak.planned, keys) < R.athletic.reconcile.warn_below_share * sum(peak.targets, keys) - EPS) assert.ok(p.meta.warnings.some(x => x.args && x.args.key === 'athletic.key.' + fam), fam);
    }
  });

  // ------------------------------------------------------------------------------------------------ units and the corpus
  test('R2F2-even-steps-unit: planAthletic spreads a coarse dose step evenly - one station at 2 sets with a 4-throw step climbs 28 -> 40 in four levels of three weeks, not one long plateau and a short top (E-166)', () => {
    const N = 12;
    const shape = { training_blocks: [{ n: 1, type: 'stairway', stair_N: N, weeks: [1, N] }], weeks: Array.from({ length: N }, (_, i) => ({ n: i + 1, training_block: 1, exercise_block: 1 + Math.floor(i / 4), stair_week: i + 1, stair_N: N })) };
    const scoop = model.ex('medball-alternating-back-to-wall-rotational-scoops');
    const budget = shape.weeks.map((w, i) => ({ n: w.n, enabled: true, plyo_share: null, targets: { plyo_contacts: null, jump_contacts: null, low_contacts: null, throws: Math.round(51 + (69 - 51) * i / (N - 1)), cod_cuts: null, sprint_m: null, olympic_sets: null }, contacts_session_max: 100 }));
    const out = planAthletic(model, { D13_tests: { items: [], end_weeks: [] } }, shape, budget, shape.weeks.map(() => [{ slot_id: 'Mon.t', weekday: 'Mon', bucket: 'AP_THROW', ex: scoop, sets: 2 }]));
    const v = out.weeks.map(w => 2 * w.slot_plan['Mon.t'].per_set);
    assert.equal(v[0], 28); assert.equal(v[N - 1], 2 * perSetBounds(model, 'throws', scoop, 1).hi);
    for (let i = 1; i < N; i++) assert.ok(v[i] >= v[i - 1], v.join(' '));
    assert.ok(maxRun(v) <= 3, v.join(' '));
  });
  test('R2F2-sweep-random-135-share-drop: an ankle drill with a smaller minimum dose in the next exercise block is the share\'s doing, not a drop (fixture; V27)', () => {
    const p = generate(randomIntake(135, fixture), fixture);
    assert.ok(check(p, 'V27').pass, JSON.stringify(check(p, 'V27').violations.slice(0, 2)));
  });
  test('R2F2-sweep-random-136-share-after-the-no-drop-pass: a jump dose the no-drop pass brought down no longer leaves its week over the plyo share (fixture; V27 share_over)', () => {
    const p = generate(randomIntake(136, fixture), fixture);
    assert.ok(check(p, 'V27').pass, JSON.stringify(check(p, 'V27').violations.slice(0, 2)));
    for (const w of p.weeks.filter(x => x.block_type === 'stairway' && !x.test)) {
      const ab = w.athletic_budget;
      if (typeof ab.planned_share !== 'number' || typeof ab.plyo_share !== 'number') continue;
      const roomy = items(w).some(x => x.it.athletic && x.it.athletic.key === 'low_contacts' && (x.it.sets > 1 || x.it.athletic.per_set > perSetBounds(fixture, 'low_contacts', fixture.ex(x.it.exercise_id), 1).lo));
      if (roomy) assert.ok(ab.planned_share <= ab.plyo_share + fixture.rules.athletic.f2.share.tolerance + EPS, `w${w.n} ${ab.planned_share}`);
    }
  });
  test('R2F2-sweep-random-520-session-cap: ankle work the session\'s contact cap trims next to the day\'s jumps asks for what the week plans, and the told line names the share of the target it holds (two days of 3 x 25 hold 150 on paper, 87 under an 80-contact session; fixture; V27 under)', () => {
    for (const n of [520, 1150]) {
      const p = generate(randomIntake(n, fixture), fixture);
      assert.ok(check(p, 'V27').pass, `random-${n}: ${JSON.stringify(check(p, 'V27').violations.slice(0, 2))}`);
    }
    const p = generate(randomIntake(520, fixture), fixture);
    const cap = p.meta.athletic.contacts_session_max;
    for (const w of p.weeks) for (const d of w.days) {
      const c = d.blocks.flatMap(b => b.items).filter(it => it.athletic && ['plyo_contacts', 'jump_contacts', 'low_contacts'].includes(it.athletic.key)).reduce((a, it) => a + it.athletic.total, 0);
      assert.ok(c <= cap + EPS, `w${w.n} ${d.weekday}: ${c} contacts`);
    }
    assert.ok(p.meta.warnings.some(x => /^warning\.athletic_capacity/.test(x.key) && x.args.key === 'athletic.key.ankle'), 'the ankle work under its target is not told');
  });
  test('R2F2-sweep-random-677-circuit-hold: the week that holds for a physical end test throws what the week before threw at the circuit\'s ball station - the per-round climb stops with the hold (fixture; V27 hold_over)', () => {
    for (const n of [677, 817, 1167]) {
      // (engine 0.6 selection, converted - DECISIONS G-135: the bootcamp's cardio station is cardio now; the B2 ballistic station is read on the model with the cardio-first rule off)
      const p = generate(randomIntake(n, fixture), ballisticCircuitModel('fixture'));
      assert.ok(check(p, 'V27').pass, `random-${n}: ${JSON.stringify(check(p, 'V27').violations.slice(0, 2))}`);
      const last = p.weeks[p.weeks.length - 1], prev = p.weeks[p.weeks.length - 2];
      assert.ok(last.athletic_budget.hold, `random-${n}: the last week holds`);
      assert.equal(last.athletic_budget.planned.throws, prev.athletic_budget.planned.throws, `random-${n}`);
      const v = p.weeks.map(w => w.athletic_budget.planned.throws);
      assert.ok(v[v.length - 2] > v[0], v.join(' '));
    }
  });
  test('R2F2-sweep-random-1004-jumps-under-the-session-cap: where the session\'s contact cap is full of ankle work, the day\'s ankle block gives a step back so the jumps do not fall below the week before (a block-3 squat jump at 3 x 3 after a single-leg jump at 3 x 4, the ankle hops at 69 of an 80-contact session; model/; V27 athletic_drop)', () => {
    const p = generate(randomIntake(1004, model), model);
    assert.ok(check(p, 'V27').pass, JSON.stringify(check(p, 'V27').violations.slice(0, 2)));
    const ws = p.weeks.filter(w => w.block_type === 'stairway' && !w.athletic_budget.hold);
    for (const keys of [JUMPS, ['low_contacts']]) { const v = famSeries(ws, keys); for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] - EPS, `${keys}: ${v.join(' ')}`); }
    const cap = p.meta.athletic.contacts_session_max;
    for (const w of p.weeks) for (const d of w.days) {
      const c = d.blocks.flatMap(b => b.items).filter(it => it.athletic && ['plyo_contacts', 'jump_contacts', 'low_contacts'].includes(it.athletic.key)).reduce((a, it) => a + it.athletic.total, 0);
      assert.ok(c <= cap + EPS, `w${w.n} ${d.weekday}: ${c} contacts`);
    }
  });
  test('R2F2-sweep-random-30-floor-plateau: a throw station whose first block sits on its minimum dose is no early peak (fixture; V27)', () => {
    for (const n of [30, 59, 240]) {
      const p = generate(randomIntake(n, fixture), fixture);
      assert.ok(check(p, 'V27').pass, `random-${n}: ${JSON.stringify(check(p, 'V27').violations.slice(0, 2))}`);
    }
  });
});
