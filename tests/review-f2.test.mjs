// tests/review-f2.test.mjs - engine 0.4.0 FIX ROUND 1 / F2 (athletic work) regression tests. One test per fixed issue of the coach-eye
// reviews of the 8 sample plans (grades C- ... D), named R<sample>-<slug> after the reviewed sample, and F2-sweep-<intake>-<slug> for an
// intake of the random corpus (tests/helpers/random-intake.mjs) that the fix round's own changes made fail an error check on the way.
// samples/REVIEW_LOG.md (v0.4 fix round 1 / F2) and engine/DECISIONS.md (E-97 ...) list them. Plans are built on the compiled model
// (model/) unless the test says the fixture.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { isFloorJump, perSetBounds, planAthletic } from '../engine/athletic.mjs';
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
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const passes = (p, ids) => { for (const id of ids) assert.ok(check(p, id).pass, `${id}: ${JSON.stringify(check(p, id).violations.slice(0, 2))}`); };
const stairWeeks = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const exOf = (m, id) => (id && m.hasEx(id) ? m.ex(id) : null);
const lowerJump = (x) => x.it.bucket === 'AP_PLYO' && x.it.athletic && !['upper_contacts'].includes(x.it.athletic.key) && ['jump_contacts', 'plyo_contacts'].includes(x.it.athletic.key);
const ballistic = (x) => lowerJump(x) && x.it.athletic.key === 'jump_contacts';
const ankle = (x) => x.it.bucket === 'AP_JUMP_LIMITED_KNEE' && x.it.athletic && x.it.athletic.key === 'low_contacts';
const sum = (o, keys) => keys.reduce((a, k) => a + (o[k] || 0), 0);
// fix round 2 / F2 (E-165): in a test week a timed test replaces its station (a sprint, a jump, a COD drill) and the end-test week's
// tested days run the baseline dose, so the per-week station and share rules below are read on the weeks between the tests
const trainWeeks = (p) => p.weeks.filter(w => !w.test);
const shareHeld = (p) => {
  const tol = R.athletic.f2.share.tolerance;
  for (const w of trainWeeks(p)) {
    const ab = w.athletic_budget;
    if (!ab || typeof ab.plyo_share !== 'number' || typeof ab.planned_share !== 'number') continue;
    assert.ok(Math.abs(ab.planned_share - ab.plyo_share) <= tol + EPS, `w${w.n}: planned ${ab.planned_share} vs target ${ab.plyo_share}`);
  }
};

describe('v0.4 fix round 1 / F2: athletic work (coach-eye reviews of the 8 samples)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------------ 01 swimming
  test('R01-ballistic-before-ankle: the swimmer\'s ballistic jumps (starts and turns) keep two stations on two days a week and hold 60 %+ of the jump target; the ankle block no longer takes the template\'s ballistic jump station (E-97, E-98)', () => {
    const p = plan('01');
    // (fix round 2 / F2: the weeks between the tests - in a test week the jump test replaces Monday's jump station, E-165)
    for (const w of stairWeeks(p).filter(x => !x.test)) {
      const b = items(w).filter(ballistic);
      assert.ok(b.length >= 2 && new Set(b.map(x => x.d.weekday)).size >= 2, `w${w.n}: ${b.length} ballistic stations`);
    }
    const peak = stairWeeks(p).filter(w => !w.athletic_budget.hold).slice(-1)[0].athletic_budget;
    assert.ok(sum(peak.planned, ['jump_contacts', 'plyo_contacts']) >= 0.6 * sum(peak.targets, ['jump_contacts', 'plyo_contacts']) - EPS, JSON.stringify(peak.planned));
    // (fix round 2 / F2, E-160: the client is told from 85 % down - the swimmer's two jump stations hold about 73 % of the target)
    assert.ok(p.meta.warnings.some(x => x.args && x.args.key === 'athletic.key.jumps') === (sum(peak.planned, ['jump_contacts', 'plyo_contacts']) < R.athletic.reconcile.warn_below_share * sum(peak.targets, ['jump_contacts', 'plyo_contacts']) - EPS));
  });
  test('R01-friday-jump-throw: Friday ("C full") holds a jump and a medball throw - it had no jump or throw at all (E-98)', () => {
    const p = plan('01');
    for (const w of stairWeeks(p)) {
      const fri = items(w).filter(x => x.d.weekday === 'Fri');
      assert.ok(fri.some(ballistic) && fri.some(x => x.it.bucket === 'AP_THROW'), `w${w.n}`);
    }
  });
  test('R01-share-held: the swimmer\'s planned plyo share stays within 5 points of 10 % -> 25 % every week (was 29 % in the Land stage); the ankle block is sized to it (E-97)', () => {
    const p = plan('01');
    shareHeld(p);
    for (const x of allItems(p).filter(ankle)) assert.ok(x.it.sets >= 1 && x.it.sets <= 2, `${x.w.n} ${x.it.sets}`);
    assert.ok(stairWeeks(p)[0].athletic_budget.planned.low_contacts <= 12, 'week 1 ankle work near its 8-contact target');
    passes(p, ['V27']);
  });
  test('R01-overhead-throw-first: the 65 % sagittal swimmer gets an overhead throw as its first throw and a rotational one second; the throws climb across the block (E-101)', () => {
    const p = plan('01');
    const w1 = items(stairWeeks(p)[0]).filter(x => x.it.bucket === 'AP_THROW').map(x => exOf(model, x.it.exercise_id));
    assert.ok(w1.some(e => e.plane === 'sagittal') && w1.some(e => e.plane === 'transverse'), w1.map(e => e.id).join(','));
    const t = stairWeeks(p).map(w => w.athletic_budget.planned.throws);
    assert.ok(t[t.length - 2] > t[0], t.join(' '));
  });
  test('R01-rc-stage-drills: the jump stations change with the Receive-Create stage - a box jump stuck in stage 1, a floor jump done land & go in stage 2 and repeated in stage 3 (E-99)', () => {
    const p = plan('01');
    const SC = R.athletic.f2.ballistic_stage_cues;
    const byStage = { RC1: new Set(), RC2: new Set(), RC3: new Set() };
    for (const x of allItems(p).filter(ballistic)) {
      byStage[x.w.plyo_stage].add(x.it.exercise_id);
      const e = exOf(model, x.it.exercise_id);
      const cue = x.it.notes.map(n => n.key);
      if (x.w.plyo_stage === 'RC1') assert.ok(cue.includes(SC.RC1), `${x.w.n} ${e.id}`);
      else if (isFloorJump(e)) assert.ok(cue.includes(SC[x.w.plyo_stage]), `${x.w.n} ${e.id} ${cue}`);
    }
    assert.ok([...byStage.RC2].some(id => !byStage.RC1.has(id)), 'a new drill in stage 2');
    assert.ok([...byStage.RC2, ...byStage.RC3].some(id => isFloorJump(exOf(model, id))), 'a floor jump from stage 2');
  });
  test('R01-ankle-in-place-first: the ankle block starts in place on two feet and takes a direction / one leg in later blocks (CAT-10; E-99)', () => {
    const p = plan('01');
    const ids = stairWeeks(p).map(w => (items(w).find(ankle) || {}).it).filter(Boolean).map(it => [it.exercise_id, items(p.weeks[0]).length && it]);
    const first = items(stairWeeks(p)[0]).find(ankle);
    assert.ok(first && first.it.exercise_id === 'ankle-hops-bilateral-in-place', first && first.it.exercise_id);
    assert.ok(new Set(ids.map(x => x[0])).size >= 2, 'the ankle drill progresses');
  });

  // ------------------------------------------------------------------------------------------------------ 02 football
  test('R02-second-sprint: the linebacker sprints on two days; the metres climb from week 1 and reach 90 %+ of the 300 -> 400 m target at the peak (was 120-240 m, Monday only; E-98)', () => {
    const p = plan('02');
    // (fix round 2 / F2, E-165: the weeks between the tests - the sprint test replaces Thursday's acceleration station in a test week)
    for (const w of stairWeeks(p).filter(x => !x.test)) assert.ok(new Set(items(w).filter(x => x.it.bucket === 'AP_SPRINT').map(x => x.d.weekday)).size >= 2, `w${w.n}`);
    const m = stairWeeks(p).map(w => w.athletic_budget.planned.sprint_m);
    assert.ok(m[m.length - 2] > m[1], m.join(' '));
    const peak = stairWeeks(p).filter(w => !w.athletic_budget.hold).slice(-1)[0].athletic_budget;
    assert.ok(peak.planned.sprint_m >= 0.9 * peak.targets.sprint_m, `${peak.planned.sprint_m} / ${peak.targets.sprint_m}`);
  });
  test('R02-medball-dose: throws are 6-10 a set (5-10 a side), never a fixed 3 x 20 sit-up pass; the throws climb (LIB-22; E-101)', () => {
    const p = plan('02');
    for (const x of allItems(p).filter(x => x.it.bucket === 'AP_THROW' && x.it.athletic && x.it.athletic.key === 'throws')) {
      const b = perSetBounds(model, 'throws', exOf(model, x.it.exercise_id), 1);
      assert.ok(x.it.athletic.per_set >= b.lo && x.it.athletic.per_set <= b.hi && b.hi <= 20, `${x.it.exercise_id} ${x.it.athletic.per_set}`);
      if (/sit-up/.test(x.it.exercise_id)) assert.ok(x.it.athletic.per_set <= 10, `${x.it.exercise_id} ${x.it.athletic.per_set}`);
    }
    const t = stairWeeks(p).map(w => w.athletic_budget.planned.throws);
    assert.ok(t[t.length - 2] > t[0], t.join(' '));
  });
  test('R02-olympic-ceiling: no full squat catch for the 230-lb linebacker whose profile stops at "power clean, clean pulls" (04 triple_ext.ceiling; E-103)', () => {
    const p = plan('02');
    assert.equal(model.sport('football_big_skill').olympic.ceiling, 'power');
    for (const x of allItems(p).filter(x => x.it.bucket === 'AP_TRIPLE_EXT')) assert.ok(!exOf(model, x.it.exercise_id).athletic.full_catch, x.it.exercise_id);
    passes(p, ['V19']);
  });
  test('R02-jump-ladder: a jump station moves up its ladder - no station keeps its stage-1 drill into stage 3 (the 6-12 in box jump for 12 weeks; E-99)', () => {
    const p = plan('02');
    const bySlot = new Map();
    for (const x of allItems(p).filter(lowerJump)) {
      const k = x.it.slot_id;
      if (!bySlot.has(k)) bySlot.set(k, {});
      (bySlot.get(k)[x.w.plyo_stage] = bySlot.get(k)[x.w.plyo_stage] || new Set()).add(x.it.exercise_id);
    }
    for (const [k, s] of bySlot) if (s.RC1 && s.RC3) for (const id of s.RC3) assert.ok(!s.RC1.has(id), `${k}: ${id} in stage 1 and stage 3`);
  });
  test('R02-ankle-outside-split: the ankle block takes no place in the day\'s two jump / throw stations (cross pattern) nor in the 12 + 2 count; V13 passes (E-98)', () => {
    const p = plan('02');
    for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
      const jt = d.blocks.flatMap(b => b.items).filter(it => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW'].includes(it.bucket) && !(it.bucket === 'AP_JUMP_LIMITED_KNEE' && it.athletic && it.athletic.key === 'low_contacts'));
      assert.ok(jt.length <= 2, `w${w.n} ${d.weekday}: ${jt.length}`);
    }
    passes(p, ['V13', 'V27']);
  });

  // ------------------------------------------------------------------------------------------------------ 03 soccer
  test('R03-share-held: the soccer plan is 45 % -> 60 % plyometric within 5 points every week (was 85 %) with a ballistic jump station every week (E-97)', () => {
    const p = plan('03');
    shareHeld(p);
    for (const w of trainWeeks(p)) assert.ok(items(w).some(ballistic), `w${w.n}: no ballistic jump`);
    passes(p, ['V27']);
  });
  test('R03-max-velocity: the midfielder holds a max-velocity sprint every week next to the accelerations (04 sprint.focus "both"; E-102)', () => {
    const p = plan('03');
    for (const w of p.weeks) {
      const kinds = new Set(items(w).filter(x => x.it.bucket === 'AP_SPRINT').map(x => exOf(model, x.it.exercise_id).athletic.sprint_kind));
      // (fix round 2 / F2, E-165: in a test week the 10-30 m sprint test replaces the acceleration station; max velocity stays)
      assert.ok(kinds.has('max_velocity') && (kinds.has('acceleration') || !!w.test), `w${w.n}: ${[...kinds]}`);
    }
  });
  test('R03-throw-both-sides: no sample picks a one-side (left- / right-facing) throw record; the soccer throw station runs 2 sets and the throws climb to the target (E-101)', () => {
    const re = new RegExp(R.athletic.f2.throws.one_side_id_re);
    for (const n of Object.keys(NAMES)) for (const x of allItems(plan(n)).filter(x => x.it.bucket === 'AP_THROW')) assert.ok(!re.test(x.it.exercise_id), `${n} ${x.it.exercise_id}`);
    const p = plan('03');
    for (const x of allItems(p).filter(x => x.it.bucket === 'AP_THROW')) assert.ok(x.it.sets >= 2, `${x.w.n} ${x.it.sets}`);
    const t = stairWeeks(p).map(w => w.athletic_budget.planned.throws);
    assert.ok(t[t.length - 2] > t[0], t.join(' '));
  });
  test('R03-cod-reps: a COD drill with several cuts a rep is written in whole reps of the drill (L-drill 3 cuts a rep, 5-10-5 2) with the cuts named (E-104)', () => {
    const CPR = R.athletic.f2.cod.cuts_per_rep;
    let n = 0;
    for (const nn of ['02', '03']) for (const x of allItems(plan(nn)).filter(x => x.it.bucket === 'AP_COD' && CPR[x.it.exercise_id] > 1)) {
      n++;
      assert.equal(x.it.athletic.per_set % CPR[x.it.exercise_id], 0, `${x.it.exercise_id} ${x.it.athletic.per_set}`);
      assert.equal(x.it.reps.type, 'fixed');
      assert.ok(x.it.notes.some(nt => nt.key === 'note.cod_reps'));
    }
    assert.ok(n > 0);
  });
  test('R03-reactive-cod: a reactive COD profile (04 cod.reactive) holds a reactive drill every week (split-step reaction; E-104)', () => {
    const p = plan('03');
    assert.equal(model.sport('soccer').cod_reactive, true);
    for (const w of p.weeks) assert.ok(items(w).some(x => R.athletic.f2.cod.reactive_drill_ids.includes(x.it.exercise_id)), `w${w.n}`);
  });
  test('R03-preseason-repeat: after the single-block stairway (Land & Go) the pre-season reaches stage 3 "Repeat" (E-100)', () => {
    const p = plan('03');
    const pre = p.weeks.filter(w => w.block_type === 'pre_season');
    assert.ok(pre.length > 0 && pre.every(w => w.plyo_stage === 'RC3'), pre.map(w => w.plyo_stage).join(','));
    for (const x of pre.flatMap(items).filter(lowerJump)) {
      const e = exOf(model, x.it.exercise_id);
      if (e.athletic.quality === 'plyometric') assert.equal(e.athletic.response, 'repeat', e.id);
    }
  });
  test('R03-capacity-told-apart: the jumps and the ankle work are told apart, and "climbs every week" is printed only for a family that rises every week (E-105)', () => {
    for (const n of ['01', '02', '03', '08']) {
      const p = plan(n);
      for (const wn of p.meta.warnings.filter(x => x.code === 'athletic_capacity')) {
        assert.notEqual(wn.args.key, 'athletic.key.contacts', `${n}: told apart`); // (contacts only when neither part has a station of its own under the line)
        if (wn.key !== 'warning.athletic_capacity') continue;
        const fam = { jumps: ['plyo_contacts', 'jump_contacts'], ankle: ['low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] }[wn.args.key.replace('athletic.key.', '')];
        const s = stairWeeks(p).filter(w => w.training_block === wn.args.training_block && !w.athletic_budget.hold).map(w => sum(w.athletic_budget.planned, fam));
        for (let i = 1; i < s.length; i++) assert.ok(s[i] > s[i - 1], `${n} ${wn.args.key}: ${s.join(' ')}`);
      }
    }
  });

  // ------------------------------------------------------------------------------------------------------ 05 bootcamp
  test('R05-power-first-in-circuit: a ballistic circuit station (KB swing, medball throw) opens its circuit with full intent - never after two hamstring stations or as the day\'s last station (ORD-03; E-106)', () => {
    const p = plan('05');
    let n = 0;
    for (const w of p.weeks) for (const d of w.days) for (const b of d.blocks.filter(b => b.kind === 'circuit')) {
      const i = b.items.findIndex(it => it.bucket === 'COND_CIRCUIT' && it.exercise_id && (exOf(model, it.exercise_id).medball || exOf(model, it.exercise_id).tags.includes('kb_swing')));
      if (i < 0) continue;
      n++;
      assert.equal(i, 0, `w${w.n} ${d.weekday} ${b.id}`);
      assert.equal(b.items[0].effort.key, R.effort.athletic.key);
    }
    assert.ok(n > 0);
  });

  // ------------------------------------------------------------------------------------------------------ 08 pickleball
  test('R08-ankle-track-kept: the racket player\'s split-step / ankle track is planned every week on a main day (was 0 contacts) and the share holds near 35 % -> 50 % (R3-ATH-02; E-98)', () => {
    const p = plan('08');
    for (const w of stairWeeks(p)) {
      assert.ok(w.athletic_budget.planned.low_contacts > 0, `w${w.n}`);
      assert.ok(items(w).some(x => ankle(x) && x.d.kind === 'main'));
    }
    shareHeld(p);
  });
  test('R08-jump-by-stage: the low-impact jump station sticks the landing in stage 1 and moves to a new drill when the stage moves (the same low box jump and cue in every stage; R3-ATH-02, R2-ATH-03; E-99)', () => {
    const p = plan('08');
    const st = new Map();
    for (const x of allItems(p).filter(lowerJump)) {
      if (x.w.plyo_stage === 'RC1') assert.ok(x.it.notes.some(nt => nt.key === R.athletic.f2.ballistic_stage_cues.RC1 || nt.key === R.athletic.response_cues.landing), x.it.exercise_id);
      (st.get(x.w.plyo_stage) || st.set(x.w.plyo_stage, new Set()).get(x.w.plyo_stage)).add(x.it.exercise_id);
    }
    assert.ok(st.get('RC2') && [...st.get('RC2')].some(id => !st.get('RC1').has(id)), 'a new drill in stage 2');
    for (const x of allItems(p).filter(x => x.it.bucket === 'AP_PLYO' && x.it.exercise_id)) {
      const tags = exOf(model, x.it.exercise_id).tags;
      assert.ok(!['depth_jump', 'hurdle_hop', 'bound'].some(t => tags.includes(t)), x.it.exercise_id);
    }
  });

  // ------------------------------------------------------------------------------------------------------ sweep (fixture)
  test('F2-sweep-random-59-share-without-throws: a client with no medball holds the share over the jump work only, and the contacts never drop at the stage change (V27; fixture)', () => {
    const p = generate(randomIntake(59, fixture), fixture);
    assert.equal(p.status, 'ok');
    assert.ok(check(p, 'V27').pass, JSON.stringify(check(p, 'V27').violations.slice(0, 2)));
  });
  test('F2-sweep-random-136-ankle-set-cut: an ankle block the share cut to one set brings the earlier weeks down with it - no drop at the next stage (V27; fixture)', () => {
    const p = generate(randomIntake(136, fixture), fixture);
    assert.ok(check(p, 'V27').pass, JSON.stringify(check(p, 'V27').violations.slice(0, 2)));
  });
  test('F2-sweep-random-170-olympic-ceiling-l1: the Olympic ceiling binds the L2+ barbell lifts only - an L2 cyclist keeps the L1 KB squat clean (V19; fixture)', () => {
    const p = generate(randomIntake(170, fixture), fixture);
    assert.ok(check(p, 'V19').pass, JSON.stringify(check(p, 'V19').violations.slice(0, 2)));
    assert.ok(allItems(p).some(x => x.it.bucket === 'AP_TRIPLE_EXT'));
  });
  test('F2-sweep-random-309-no-stage-no-drill-change: with no Receive-Create stage the jump drill holds (no dose drop from a forced drill change; V27; fixture)', () => {
    const p = generate(randomIntake(309, fixture), fixture);
    assert.ok(check(p, 'V27').pass, JSON.stringify(check(p, 'V27').violations.slice(0, 2)));
  });
  test('F2-sweep-random-58-ankle-cap: V13 reads the ankle block outside the 12 + 2 count like the layout does (fixture)', () => {
    const p = generate(randomIntake(58, fixture), fixture);
    assert.ok(check(p, 'V13').pass, JSON.stringify(check(p, 'V13').violations.slice(0, 2)));
  });

  // ------------------------------------------------------------------------------------------------------ the share check
  test('F2-share-validator: V27 fails a week over its plyo share while an ankle item still sits above its minimum dose (share_over)', () => {
    const p = JSON.parse(JSON.stringify(plan('03')));
    const w = p.weeks[1]; // (fix round 2 / F2: week 2 - a test week is read by its tests, E-165)
    const it = w.days.flatMap(d => d.blocks.flatMap(b => b.items)).find(x => x.bucket === 'AP_JUMP_LIMITED_KNEE' && x.athletic && x.athletic.key === 'low_contacts');
    assert.ok(it);
    it.athletic.per_set = perSetBounds(model, 'low_contacts', exOf(model, it.exercise_id), 1).hi;
    w.athletic_budget.planned_share = w.athletic_budget.plyo_share + 0.2;
    const v27 = validatePlan(p, model).checks.find(c => c.id === 'V27');
    assert.ok(v27.violations.some(v => v.args && v.args.code === 'share_over'), JSON.stringify(v27.violations.slice(0, 2)));
  });
  test('F2-plan-athletic-unit: planAthletic holds a week\'s share - a lone ankle station over a small ballistic dose comes down to its minimum and to one set', () => {
    const shape = { training_blocks: [{ n: 1, type: 'flat' }], weeks: [{ n: 1, training_block: 1, exercise_block: 1 }] };
    const box = model.ex('mid-box-jump-knee-height'), hop = model.ex('ankle-hops-bilateral-in-place');
    const budget = [{ n: 1, enabled: true, plyo_share: 0.2, targets: { plyo_contacts: 0, jump_contacts: 16, low_contacts: 40, throws: null, cod_cuts: null, sprint_m: null, olympic_sets: null }, contacts_session_max: 100 }];
    const out = planAthletic(model, {}, shape, budget, [[{ slot_id: 'Mon.a', weekday: 'Mon', bucket: 'AP_PLYO', ex: box, sets: 2 }, { slot_id: 'Mon.b', weekday: 'Mon', bucket: 'AP_JUMP_LIMITED_KNEE', ex: hop, sets: 2 }]]);
    const sp = out.weeks[0].slot_plan;
    assert.equal(sp['Mon.b'].sets, 1);
    assert.equal(sp['Mon.b'].per_set, perSetBounds(model, 'low_contacts', hop, 1).lo);
  });
});
