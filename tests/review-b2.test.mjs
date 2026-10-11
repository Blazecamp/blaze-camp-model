// tests/review-b2.test.mjs - engine 0.4.0 stage B2 (athletic work) regression tests for the coach-eye re-check of the v0.3 sample
// plans (samples/RECHECK_v0.3.md) and the round-3 athletic answers (coach_answers_round3.md R3-ATH-01 .. 05). One test per fixed
// issue, named R<sample>-<slug> after its RECHECK sample (R3-<slug> for a round-3 feature); samples/REVIEW_LOG.md (v0.4, stage B2)
// lists them. Plans are built from samples/intakes/<sample>.json on the compiled model (model/).
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { passesHardFilters } from '../engine/select.mjs';
import { stagesForStairway, splitContacts, responseOf, athleticKeyOf, perSetBounds } from '../engine/athletic.mjs';
import { olympicSetsForIndex } from '../engine/budget.mjs';
import { loadCompiledModel, INTAKE_DIR } from './helpers/models.mjs';

const model = loadCompiledModel();
const R = model ? model.rules : null;
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const planWith = (n, mut) => { const i = intakeOf(n); mut(i); return generate(i, model); };
const stairWeeks = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const mains = (w) => w.days.filter(d => d.kind === 'main');
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const CONTACTS = ['plyo_contacts', 'jump_contacts', 'low_contacts'];
const fam = (p, keys) => keys.reduce((a, k) => a + (p[k] || 0), 0);
const PLYO = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'];

/**
 * inside every stairway block the athletic families never drop. Fix round 2 / F2 (E-165): a station a timed test replaced counts as
 * done (`test_replaced`), and the end-test week runs the baseline week's dose on its tested days - never more than the week before
 */
function athleticClimbs(p, label) {
  for (const tb of p.shape.training_blocks.filter(t => t.type === 'stairway')) {
    const ws = p.weeks.filter(w => w.training_block === tb.n && w.athletic_budget);
    for (const [name, keys] of [['contacts', CONTACTS], ['throws', ['throws']], ['cod', ['cod_cuts']], ['sprint', ['sprint_m']], ['olympic', ['olympic_sets']]]) {
      const v = ws.map(w => fam(w.athletic_budget.planned, keys) + fam(w.athletic_budget.test_replaced || {}, keys));
      for (let i = 1; i < v.length; i++) {
        if (ws[i].athletic_budget.hold) assert.ok(v[i] <= v[i - 1] + EPS, `${label} ${name}: the end-test week plans more than the week before: ${v.join(' ')}`);
        else assert.ok(v[i] >= v[i - 1] - EPS, `${label} ${name} drops at week ${ws[i].n}: ${v.join(' ')}`);
      }
    }
  }
}

describe('stage B2: athletic work (RECHECK_v0.3 + R3-ATH-01 .. 05)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------ 01 swimming
  test('R01-athletic-climb: the swimmer\'s jump contacts and Olympic sets climb with the stairway (no stage-change drops, no cliff)', () => {
    const p = plan('01');
    athleticClimbs(p, '01');
    const o = stairWeeks(p).map(w => w.athletic_budget.planned.olympic_sets);
    // (v0.5: the swimmer's three strength tests now sit on his three days - the A / B / C lifts of R4-SES-05 - so every day of the
    // end-test week is a tested day and runs the baseline week's athletic dose, R2-PER-07; the climb is read up to the week before)
    const N = o.length;
    assert.ok(o[N - 2] > o[0] && o[N - 2] === Math.max(...o), `Olympic sets flat ${o.join(' ')}`);
    for (let i = 1; i < N - 1; i++) assert.ok(o[i] >= o[i - 1] && o[i] - o[i - 1] <= 1, `Olympic step at week ${i + 1}: ${o.join(' ')}`);
    assert.ok(o[N - 1] >= o[0], `the end-test week never under the baseline week ${o.join(' ')}`);
    assert.ok(check(p, 'V27').pass);
  });
  test('R01-per-side-contacts: a single-leg drill counts both legs (per_set = 2 x the per-leg contacts written)', () => {
    let seen = 0;
    for (const n of ['01', '02', '03', '08']) for (const x of allItems(plan(n))) {
      if (!PLYO.includes(x.it.bucket) || !x.it.athletic || !['unilateral', 'alternating'].includes(ex(x.it.exercise_id).laterality)) continue;
      assert.equal(x.it.athletic.per_set, 2 * x.it.reps.value, `${n} ${x.it.exercise_id}`);
      assert.equal(x.it.athletic.total, x.it.sets * x.it.athletic.per_set);
      assert.ok(x.it.notes.some(nt => nt.key === 'note.per_side'));
      seen++;
    }
    assert.ok(seen > 0);
  });
  test('R01-mid-block-swap: the Receive-Create stage and every jump exercise hold for the whole exercise block (all samples)', () => {
    for (const n of Object.keys(NAMES)) {
      const p = plan(n);
      for (const eb of p.shape.exercise_blocks) {
        const ws = p.weeks.filter(w => w.exercise_block === eb.n);
        assert.equal(new Set(ws.map(w => w.plyo_stage)).size, 1, `${n} eb${eb.n} stage changes`);
        const picks = new Map();
        for (const w of ws) for (const x of items(w)) if (PLYO.includes(x.it.bucket) && x.it.exercise_id) {
          if (picks.has(x.it.slot_id)) assert.equal(x.it.exercise_id, picks.get(x.it.slot_id), `${n} w${w.n} ${x.it.slot_id}`);
          picks.set(x.it.slot_id, x.it.exercise_id);
        }
      }
    }
  });
  test('R01-fake-slam: the no-medball substitute (fake slam) never shows up when the athlete owns medballs (EQ-07)', () => {
    for (const n of ['01', '02', '03']) for (const x of allItems(plan(n))) assert.ok(!(R.medball.no_ball_only_ids || []).includes(x.it.exercise_id), `${n} ${x.it.exercise_id}`);
    const slam = ex(R.medball.no_ball_only_ids[0]);
    const p = plan('01');
    const slot = { slot_id: 'Wed.A2.s05', station_id: 'A2.s05', bucket: 'AP_PLYO', role: 'athletic', block: 'athletic', variant: 'upper', group: null };
    assert.equal(passesHardFilters(slam, slot, { derived: p.meta.derived, model }), false);
  });
  test('R01-first-block-bilateral: the swimmer\'s first jump block lands on two feet, unloaded (CAT-10)', () => {
    const p = plan('01');
    for (const x of items(p.weeks[0])) if (x.it.bucket === 'AP_PLYO' && x.it.athletic) {
      const e = ex(x.it.exercise_id);
      assert.equal(e.laterality, 'bilateral', x.it.exercise_id);
      assert.ok(!e.tags.includes('split_grip'), x.it.exercise_id);
    }
  });
  test('R01-ankle-hop-cue: ankle / pogo hops are quick continuous contacts at every stage (never a stick cue) and count as plyometric work', () => {
    let seen = 0;
    for (const n of ['01', '02', '03']) for (const x of allItems(plan(n))) {
      const e = ex(x.it.exercise_id);
      if (!e || !PLYO.includes(x.it.bucket) || !e.athletic.low_amplitude) continue;
      assert.ok(x.it.notes.some(nt => nt.key === R.athletic.response_cues.repeat_low), `${n} w${x.w.n} ${e.id}`);
      assert.ok(!x.it.notes.some(nt => nt.key === 'note.rc1'));
      seen++;
    }
    assert.ok(seen > 0);
    const a = plan('01').weeks[11].athletic_budget;
    const p = a.planned;
    assert.equal(a.planned_share, Math.round(1e4 * (p.plyo_contacts + p.low_contacts) / (p.plyo_contacts + p.jump_contacts + p.low_contacts + p.throws)) / 1e4);
  });
  test('R3-ATH-01 swimming dryland: shoulder care every session (no bands), no extra cardio, a 2-week taper before the championship', () => {
    const p = plan('01');
    for (const w of stairWeeks(p)) for (const d of mains(w)) {
      const care = d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'RECOVERY_ARM_CARE');
      assert.ok(care.length >= 1, `w${w.n} ${d.weekday} no shoulder care`);
      for (const it of care) assert.ok(!/band/.test(it.exercise_id));
    }
    assert.equal(p.meta.aerobic.per_week, 0);
    assert.equal(p.meta.athletic.plyo_share.end, 0.25);
    assert.ok(p.meta.athletic.olympic_exposures_wk >= 2 && p.meta.athletic.olympic_exposures_wk <= 3);
    const champ = planWith('01', i => { i.sport.season = { type: 'competition_date', date: '2026-12-21' }; });
    assert.equal(champ.status, 'ok');
    const taper = champ.shape.training_blocks.filter(t => t.type === 'taper');
    assert.equal(taper.length, 1);
    assert.equal(taper[0].weeks[1] - taper[0].weeks[0] + 1, R.plan_types.prep.taper_weeks_by_sport.swimming);
  });

  // ------------------------------------------------------------------------------------------------ 02 football
  test('R02-rc-stage-blocks: Receive-Create stages snap to the exercise blocks (12 weeks: RC1 / RC2 / RC3 = blocks 1 / 2 / 3)', () => {
    const p = plan('02');
    for (const eb of p.shape.exercise_blocks) {
      const s = new Set(p.weeks.filter(w => w.exercise_block === eb.n).map(w => w.plyo_stage));
      assert.deepEqual([...s], [['RC1', 'RC2', 'RC3'][eb.n - 1]]);
    }
    // 8 weeks (two blocks): one stage at a time, never skipping (RC1 -> RC2); 16 weeks: RC1 RC2 RC3 RC3
    assert.deepEqual(stagesForStairway(model, model.stair(8), 'L2'), ['RC1', 'RC1', 'RC1', 'RC1', 'RC2', 'RC2', 'RC2', 'RC2']);
    assert.deepEqual([...new Set(stagesForStairway(model, model.stair(16), 'L2'))], ['RC1', 'RC2', 'RC3']);
    assert.deepEqual([...new Set(stagesForStairway(model, model.stair(6), 'L2'))], ['RC2'], 'one block: L2 starts at stage 2 (R2-ATH-03)');
    assert.deepEqual([...new Set(stagesForStairway(model, model.stair(6), 'L1'))], ['RC1']);
  });
  test('R02-depth-jump-single-response: depth jumps are single-response (land & go), never a stage-3 repeat drill or repeat cue', () => {
    for (const e of model.exercises()) if (e.tags.includes('depth_jump') && e.athletic && e.athletic.quality === 'plyometric') {
      assert.equal(e.athletic.response, 'single', e.id);
      assert.ok(!e.tags.includes('plyo_repeated'), e.id);
    }
    for (const n of Object.keys(NAMES)) for (const x of allItems(plan(n))) {
      const e = ex(x.it.exercise_id);
      if (!e || !PLYO.includes(x.it.bucket) || !e.athletic) continue;
      if (x.w.plyo_stage === 'RC3' && e.athletic.quality === 'plyometric' && !e.athletic.upper) assert.equal(responseOf(e), 'repeat', `${n} w${x.w.n} ${e.id}`);
      if (responseOf(e) === 'single') assert.ok(!x.it.notes.some(nt => nt.key === 'note.rc3'), `${n} ${e.id} repeat cue`);
    }
  });
  test('R02-first-reactive-heavy: the 230-lb linebacker\'s first reactive block is two-foot, unloaded, one low-box depth jump a week', () => {
    const p = plan('02');
    const ws = p.weeks.filter(w => w.plyo_stage === 'RC2');
    assert.ok(ws.length > 0);
    for (const w of ws) {
      const reactive = items(w).filter(x => PLYO.includes(x.it.bucket) && ex(x.it.exercise_id) && ex(x.it.exercise_id).athletic.quality === 'plyometric' && !ex(x.it.exercise_id).athletic.upper);
      for (const x of reactive) {
        const e = ex(x.it.exercise_id);
        assert.equal(e.laterality, 'bilateral', `w${w.n} ${e.id}`);
        assert.ok(!e.tags.includes('split_grip'), `w${w.n} ${e.id} loaded`);
      }
      const depth = items(w).filter(x => PLYO.includes(x.it.bucket) && ex(x.it.exercise_id) && ex(x.it.exercise_id).tags.includes('depth_jump'));
      assert.ok(depth.length <= R.athletic.first_reactive.depth_jump_max_wk_heavy_or_l1, `w${w.n} ${depth.length} depth-jump stations`);
      for (const x of depth) { assert.deepEqual(x.it.load, { type: 'height', value: 'low' }); assert.ok(x.it.notes.some(nt => nt.key === 'note.first_reactive')); }
    }
  });
  // (fix round 2 / F2, E-165: the end-test week runs the baseline week's Olympic sets on its tested days - 2 a lift, as in week 1 -
  // so it no longer equals the week before; the climb is read up to the week before the test)
  test('R02-olympic-climb: Olympic sets climb 8 -> 12 one set at a time; the end-test week never plans more than the week before (no +50 % cliff)', () => {
    const p = plan('02');
    const o = stairWeeks(p).map(w => w.athletic_budget.planned.olympic_sets);
    assert.equal(o[0], 8); assert.equal(o[o.length - 2], 12);
    for (let i = 1; i < o.length - 1; i++) assert.ok(o[i] >= o[i - 1] && o[i] - o[i - 1] <= 1, o.join(' '));
    assert.ok(o[o.length - 1] <= o[o.length - 2] && o[o.length - 1] >= o[0], 'the test week: between the baseline week and the week before');
    // the extra sets go to the earliest exposures in day order (VOL-07)
    const d = p.meta.derived;
    const ws = p.shape.training_blocks[0];
    const mid = { ...p.weeks[4], stair_N: ws.stair_N };
    const per = [0, 1, 2, 3].map(i => olympicSetsForIndex(d, model, 4, mid, i));
    for (let i = 1; i < 4; i++) assert.ok(per[i] <= per[i - 1], per.join(' '));
  });
  // (fix round 2 / F2, E-165: was 'runs last week's athletic dose'. The end test now runs under the baseline week's conditions on its
  // tested days - RECHECK v0.4 02 major - so the week plans no more than the week before and, on a tested day, no more than week 1)
  test('R02-test-week-hold: the end-test week never plans more than the week before, and its tested days run the baseline week\'s athletic dose', () => {
    const p = plan('02');
    const a = p.weeks[10].athletic_budget.planned, b = p.weeks[11].athletic_budget.planned;
    for (const k of [...CONTACTS, 'throws', 'cod_cuts', 'sprint_m', 'olympic_sets']) assert.ok(b[k] <= a[k], k);
    assert.ok(p.weeks[11].athletic_budget.hold);
    assert.equal(p.weeks[11].athletic_budget.test_dose, 'baseline');
    const dayTot = (w, d, keys) => d.blocks.flatMap(x => x.items).filter(it => it.athletic && keys.includes(it.athletic.key)).reduce((s, it) => s + (it.athletic.total || 0), 0);
    let tested = 0;
    for (const d of mains(p.weeks[11])) {
      if (!d.blocks.some(x => x.items.some(it => it.test))) continue;
      tested++;
      const d0 = p.weeks[0].days.find(x => x.weekday === d.weekday);
      for (const keys of [['plyo_contacts', 'jump_contacts'], ['low_contacts'], ['throws'], ['cod_cuts'], ['sprint_m']]) assert.ok(dayTot(p.weeks[11], d, keys) <= dayTot(p.weeks[0], d0, keys) + EPS, `${d.weekday} ${keys.join('+')}`);
      const oly = (dd) => dd.blocks.flatMap(x => x.items).filter(it => it.bucket === 'AP_TRIPLE_EXT').reduce((s, it) => s + it.sets, 0);
      assert.ok(oly(d) <= oly(d0), `${d.weekday} Olympic sets`);
    }
    assert.ok(tested >= 2);
  });
  test('R02-sprint-focus: the linebacker sprints accelerations (0-20 yd focus) at 10-20 m in 5-m steps, climbing (LIB-21)', () => {
    const p = plan('02');
    const sp = allItems(p).filter(x => x.it.bucket === 'AP_SPRINT');
    assert.ok(sp.length > 0);
    for (const x of sp) {
      assert.equal(ex(x.it.exercise_id).athletic.sprint_kind, 'acceleration', x.it.exercise_id);
      assert.equal(x.it.reps.metres % R.athletic.sprint.round_m, 0);
      assert.ok(x.it.reps.metres >= 10 && x.it.reps.metres <= 20, `${x.it.reps.metres} m`);
    }
    // (fix round 2 / F2, E-165: the sprint test replaces Thursday's acceleration station in weeks 1 and 12 - the climb is read on the
    // weeks between the tests)
    const m = stairWeeks(p).map(w => w.athletic_budget.planned.sprint_m);
    assert.ok(m[m.length - 2] > m[1], m.join(' '));
  });
  test('R02-push-jerk-never-a-press: a jerk never fills a resistance slot; a push press only for athletes / class model (06 / 02)', () => {
    for (const n of Object.keys(NAMES)) for (const x of allItems(plan(n))) {
      const e = ex(x.it.exercise_id);
      if (!e || !/^(RP_|ISO_|FOCUS)/.test(x.it.bucket)) continue;
      assert.ok(!e.tags.includes('push_jerk'), `${n} ${e.id} in ${x.it.bucket}`);
      if (['06', '07'].includes(n)) assert.ok(!e.tags.includes('push_press'), `${n} ${e.id}`);
    }
  });
  test('R02-plyo-share: the football block ends near its 50 % plyo share (reactive jumps + ankle work over all jump and throw work)', () => {
    const p = plan('02');
    const last = p.weeks[10].athletic_budget;
    assert.ok(Math.abs(last.planned_share - 0.5) <= 0.1, `share ${last.planned_share}`);
    assert.ok(p.weeks[0].athletic_budget.planned.plyo_contacts === 0, 'stage 1: no reactive jumps');
  });

  // ------------------------------------------------------------------------------------------------ 03 soccer
  test('R03-football-routes: a soccer midfielder gets no American-football routes; drills with no cut never fill a COD station', () => {
    const p = plan('03');
    const cod = allItems(p).filter(x => x.it.bucket === 'AP_COD');
    assert.ok(cod.length > 0);
    for (const x of cod) {
      const a = ex(x.it.exercise_id).athletic;
      assert.ok(!a.sport_only || a.sport_only.includes('soccer'), x.it.exercise_id);
      assert.ok(!a.no_cuts, x.it.exercise_id);
    }
    for (const id of ['slant-route', 'dig-out-route', 'fade-route']) assert.ok(ex(id).athletic.sport_only.includes('american_football'));
    // the football linebacker keeps his routes
    assert.ok(allItems(plan('02')).some(x => x.it.bucket === 'AP_COD' && ex(x.it.exercise_id).athletic.sport_only));
  });
  test('R03-athletic-budget-climb: soccer work climbs to the block peak, lands on the stairway goal and tells the client what the stations cannot hold', () => {
    const p = plan('03');
    athleticClimbs(p, '03');
    for (const w of stairWeeks(p)) {
      const a = w.athletic_budget;
      for (const k of Object.keys(a.goals || {})) assert.ok(a.goals[k] <= a.targets[k] + 1 || ['plyo_contacts', 'jump_contacts'].includes(k), `w${w.n} ${k} goal over target`);
    }
    // (v0.5 fix round 1: a 3-day week asks for three quarters of the sport's 4-day athletic dose - rules.athletic.x1.scale_by_days,
    // PROPOSED - so the stations now hold the week's targets; the notice is owed for a family whose block peak sits under the told share)
    const SH = (R.athletic.reconcile || {}).warn_below_share ?? 0.6;
    const peakW = stairWeeks(p).filter(w => !w.athletic_budget.hold).slice(-1)[0].athletic_budget;
    const short = ['throws', 'cod_cuts', 'sprint_m'].filter(k => peakW.targets[k] > 0 && peakW.planned[k] < SH * peakW.targets[k]);
    if (short.length) assert.ok(p.meta.warnings.some(x => x.key === 'warning.athletic_capacity'));
    else assert.ok(!p.meta.warnings.some(x => x.key === 'warning.athletic_capacity'), 'a capacity notice with every family above the told share');
    assert.ok(check(p, 'V27').pass);
  });
  test('R03-upper-plyo-out: push-up plyos are upper-body contacts, outside the lower-body budget and the share', () => {
    let seen = 0;
    for (const n of ['01', '02', '03']) for (const x of allItems(plan(n))) {
      const e = ex(x.it.exercise_id);
      if (!e || x.it.bucket !== 'AP_PLYO' || !e.athletic.upper) continue;
      assert.equal(x.it.athletic.key, 'upper_contacts');
      assert.equal(athleticKeyOf('AP_PLYO', e), 'upper_contacts');
      seen++;
    }
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the swimmer's upper-body plyo slot is a leg jump now (sample 01
    // minor: no push-up plyo on a swimmer's shoulder - rules.athletic.x2.upper_plyo_not_for_codes), so none of the three plans
    // holds one; the mapping itself is held on the library records
    assert.equal(seen, 0);
    const uppers = model.bySlot('AP_PLYO').filter(e => e.athletic && e.athletic.upper);
    assert.ok(uppers.length > 0);
    for (const e of uppers) assert.equal(athleticKeyOf('AP_PLYO', e), 'upper_contacts');
    assert.deepEqual(R.athletic.x2.upper_plyo_not_for_codes, ['SHOULDER_SWIMMER']);
  });
  test('R03-preseason-stage-held: the pre-season keeps the stage reached; no stick cue on a jump that is not a landing drill', () => {
    const p = plan('03');
    const off = stairWeeks(p).slice(-1)[0].plyo_stage;
    // (v0.4 fix round 1 / F2: after a single-exercise-block stairway the pre-season moves one stage up - soccer RC2 -> RC3; the
    // stage still holds for the whole pre-season block)
    const NEXT = { RC1: 'RC2', RC2: 'RC3', RC3: 'RC3' };
    const ebs = new Set(stairWeeks(p).map(w => w.exercise_block));
    const want = R.athletic.stages.pre_season_after_single_block === 'advance_one' && ebs.size === 1 ? NEXT[off] : off;
    for (const w of p.weeks.filter(x => x.block_type === 'pre_season')) {
      assert.equal(w.plyo_stage, want);
      for (const x of items(w)) if (PLYO.includes(x.it.bucket) && ex(x.it.exercise_id) && ex(x.it.exercise_id).athletic.quality !== 'landing') assert.ok(!x.it.notes.some(nt => nt.key === 'note.rc1'), x.it.exercise_id);
    }
  });

  // ------------------------------------------------------------------------------------------------ 04 CrossFit-style class
  test('R04-wod-variety: the week\'s WODs rotate (no two the same), keep the day\'s lift pattern out and hold a jump and a ball / KB station', () => {
    const p = plan('04');
    const T = R.conditioning.wod;
    for (const w of stairWeeks(p)) {
      const wods = items(w).filter(x => x.it.bucket === 'COND_WOD').map(x => ({ d: x.d, st: x.it.wod.stations }));
      assert.ok(wods.length >= 4);
      const keys = wods.map(x => x.st.slice().sort().join('|'));
      assert.equal(new Set(keys).size, keys.length, `w${w.n} identical WODs`);
      const grp = (id) => { const e = ex(id); return e.tags.includes('kb_swing') ? 'swing' : e.tags.includes('thruster') ? 'thruster' : (e.medball ? 'ball' : (e.athletic && e.athletic.count_unit === 'contacts' ? 'jump' : 'other')); };
      for (const x of wods) {
        if (x.d.day_type === 'SQUAT') assert.ok(!x.st.some(id => grp(id) === 'thruster'), 'thruster on the squat day');
        if (x.d.day_type === 'DEADLIFT') assert.ok(!x.st.some(id => grp(id) === 'swing'), 'swing on the deadlift day');
      }
      const all = wods.flatMap(x => x.st).map(grp);
      if (T.weekly_must_have.includes('jump')) assert.ok(all.includes('jump'), `w${w.n} no jump`);
      if (T.weekly_must_have.includes('ball_or_kb')) assert.ok(all.includes('ball') || all.includes('swing'), `w${w.n} no ball / KB`);
      for (const x of items(w).filter(y => y.it.bucket === 'COND_WOD')) assert.deepEqual(x.it.credits, {});
    }
  });

  // ------------------------------------------------------------------------------------------------ 05 bootcamp
  test('R05-bootcamp-ballistic: a general-population circuit keeps a medball throw and a KB swing station, never a muscle set, inside the throw budget', () => {
    const p = plan('05');
    for (const w of stairWeeks(p)) {
      const st = items(w).filter(x => x.it.bucket === 'COND_CIRCUIT' && ex(x.it.exercise_id) && (ex(x.it.exercise_id).medball || ex(x.it.exercise_id).tags.includes('kb_swing')));
      assert.ok(st.some(x => ex(x.it.exercise_id).medball), `w${w.n} no medball station`);
      assert.ok(st.some(x => ex(x.it.exercise_id).tags.includes('kb_swing')), `w${w.n} no KB swing`);
      for (const x of st) assert.deepEqual(x.it.credits, {});
      const a = w.athletic_budget;
      assert.ok(a.planned.throws > 0 && a.planned.throws <= a.targets.throws * (1 + R.athletic.reconcile.tolerance) + R.athletic.reconcile.per_set_max.throws, `w${w.n} throws ${a.planned.throws}`);
      for (const x of st) if (ex(x.it.exercise_id).medball) assert.ok(x.it.load && x.it.load.type === 'medball_lb' && x.it.load.max <= R.medball.max_lb, JSON.stringify(x.it.load));
    }
    athleticClimbs(p, '05');
  });

  // ------------------------------------------------------------------------------------------------ 08 pickleball
  test('R08-pickleball-jumps-climb: jump contacts never fall in the hardest weeks; 50+ racket default keeps depth jumps, hurdle hops and bounds out', () => {
    const p = plan('08');
    athleticClimbs(p, '08');
    for (const x of allItems(p)) {
      const e = ex(x.it.exercise_id);
      if (!e || !PLYO.includes(x.it.bucket)) continue;
      for (const t of R.population.active_aging_50.avoid_tags_unless_opt_in) assert.ok(!e.tags.includes(t), `${e.id} ${t}`);
    }
    // the racket impact switch (R3-ATH-02, prefs.racket_50_impact_opt_in) unlocks them
    const dj = ex('depth-jump');
    const slot = { slot_id: 'Thu.A2.s05', station_id: 'A2.s05', bucket: 'AP_PLYO', role: 'athletic', block: 'athletic', variant: null, group: null };
    const d0 = plan('08').meta.derived;
    const base = { ...d0, pain: [] };
    assert.equal(passesHardFilters(dj, slot, { derived: base, model, shape: null, stage_override: 'RC2' }), false);
    assert.equal(passesHardFilters(dj, slot, { derived: { ...base, prefs: { ...base.prefs, racket_50_impact_opt_in: true } }, model, shape: null, stage_override: 'RC2' }), true);
    assert.equal(passesHardFilters(dj, slot, { derived: { ...base, age: 35 }, model, shape: null, stage_override: 'RC2' }), true, 'a 35-year-old pickleball player is not under the 50+ rule');
  });

  // ------------------------------------------------------------------------------------------------ round 3 athletic defaults
  test('R3-ATH-02 older 60+: landings, light throws, balance and fast machine work by default; jumps / Olympic off; the opt-in never unlocks depth jumps', () => {
    const p = planWith('08', i => { i.age = 66; i.activity = { ids: ['weekend_warrior'], play_days: [], event_date: null }; i.pain = []; i.schedule.days_per_week = 3; i.schedule.weekdays = ['Mon', 'Wed', 'Fri']; i.schedule.session_minutes = 60; });
    assert.equal(p.status, 'ok');
    const its = allItems(p);
    for (const x of its) {
      const e = ex(x.it.exercise_id);
      if (!e || !e.athletic) continue;
      assert.ok(x.it.bucket !== 'AP_TRIPLE_EXT', 'no Olympic lift by default');
      if (PLYO.includes(x.it.bucket)) assert.equal(e.athletic.quality, 'landing', e.id);
    }
    assert.ok(its.some(x => x.it.bucket === 'AP_THROW'), 'light medball throws');
    assert.ok(its.some(x => x.it.text_key === 'warmup.balance_prep'), 'balance and reactive stepping warm-up');
    assert.ok(its.some(x => x.it.notes.some(nt => nt.key === 'note.fast_machine_intent')), 'fast machine work');
    assert.ok(p.meta.warnings.some(w => w.key === 'warning.older_athletic'));
    const opt = planWith('08', i => { i.age = 66; i.activity = { ids: ['weekend_warrior'], play_days: [], event_date: null }; i.pain = []; i.prefs.older_athletic_opt_in = true; });
    for (const x of allItems(opt)) { const e = ex(x.it.exercise_id); if (e) for (const t of R.population.older.never_tags_phase0_even_with_opt_in) assert.ok(!e.tags.includes(t), `${e.id} ${t}`); }
  });
  test('R3-ATH-03 HYROX: 2 strength days + 2 hybrid days (Blue intervals, Green 1 km + station), 4 cardio sessions, station circuits that are never muscle sets', () => {
    const p = planWith('08', i => {
      i.age = 35; i.activity = { ids: ['hyrox_fitness'], play_days: [], event_date: null }; i.pain = []; i.experience.years_consistent = 2;
      i.schedule.days_per_week = 4; i.schedule.weekdays = ['Mon', 'Tue', 'Thu', 'Fri']; i.schedule.session_minutes = 60;
      i.equipment.profile = 'FULL_GYM'; i.equipment.extras = ['sled', 'open_space_short', 'open_space_long']; i.equipment.detail.medball_lb_owned = [10, 14, 20];
    });
    assert.equal(p.status, 'ok');
    assert.equal(p.meta.template.variant, 'hyrox'); assert.equal(p.meta.program_id, 'OTHYX');
    assert.ok(p.validation.ok);
    const w = p.weeks[1];
    const types = mains(w).map(d => d.day_type).sort();
    assert.deepEqual(types, ['H1', 'H2', 'S1', 'S2']);
    const colourOf = (dt) => items(w).filter(x => x.d.day_type === dt && x.it.aerobic).map(x => x.it.aerobic.colour);
    assert.deepEqual(colourOf('H1'), ['A']); assert.deepEqual(colourOf('H2'), ['B']);
    assert.equal(p.meta.aerobic.per_week, 4);
    assert.equal(w.aerobic_sessions, 4);
    const stations = items(w).filter(x => x.it.bucket === 'COND_CIRCUIT');
    assert.ok(stations.filter(x => ['S1', 'S2'].includes(x.d.day_type)).length >= 2, 'station circuits on the strength days');
    for (const x of stations) {
      assert.ok(R.athletic.hyrox.station_ids.includes(x.it.exercise_id), x.it.exercise_id);
      assert.deepEqual(x.it.credits, {});
      assert.ok(x.it.notes.some(nt => nt.key === 'note.hyrox_station'));
      if (x.d.day_type === 'H2') assert.ok(x.it.notes.some(nt => nt.key === 'note.hyrox_run_station'));
      if (ex(x.it.exercise_id).medball) assert.ok(ex(x.it.exercise_id).medball.max_lb <= 20);
    }
    assert.equal(p.meta.athletic.plyo_share.end, 0.5);
  });
  test('R3-ATH-04 sport shares and cardio: the coach\'s plyo shares, 0 extra cardio for swimmers / runners / rowers / endurance cyclists, game-heavy sports', () => {
    const share = (id) => model.sport(id).plyo_share.end;
    assert.equal(share('distance_runner'), 0.75); assert.equal(share('lacrosse_m_midfield'), 0.6); assert.equal(share('volleyball_beach'), 0.5);
    assert.equal(share('rugby_forwards'), 0.4); assert.equal(share('judo'), 0.25); assert.equal(share('rec_golf'), 0.25); assert.equal(share('weekend_warrior'), 0.5);
    for (const id of ['swimming_middle', 'distance_runner', 'rowing', 'cycling_endurance']) assert.equal(model.sport(id).aerobic.off, 0, id);
    for (const s of ['lacrosse', 'field_hockey', 'rugby', 'ultimate', 'flag_football', 'beach_volleyball']) assert.ok(R.athletic.in_season_game_heavy.sports.includes(s), s);
  });
  test('R3-ATH-05 stay active: 3+ play days halve the jumps and drop the extra agility; an event ends the hard weeks a week before', () => {
    const p = plan('08');
    assert.ok(p.meta.athletic.heavy_play_week);
    for (const w of p.weeks) assert.equal(w.athletic_budget.targets.cod_cuts, 0);
    assert.ok(!allItems(p).some(x => x.it.bucket === 'AP_COD'));
    const ev = planWith('08', i => { i.activity.event_date = '2026-11-25'; });
    const taper = ev.shape.training_blocks.find(t => t.type === 'taper');
    assert.ok(taper && taper.weeks[1] - taper.weeks[0] + 1 === R.plan_types.prep.gen_pop_event.taper_weeks);
    assert.ok(ev.meta.aerobic.replaced_by_activity <= R.conditioning.activity_counts_as_aerobic.max_replaced);
  });
  test('R3-athletic-toggle: every athletic / power block can be switched off per day, and switching it off changes no muscle set', () => {
    for (const n of ['01', '02', '03', '08']) {
      const p = plan(n);
      for (const w of p.weeks) for (const d of w.days) for (const b of d.blocks) {
        if (!['athletic', 'power'].includes(b.kind)) continue;
        assert.ok(b.toggle && d.toggle_blocks.includes(b.kind), `${n} w${w.n} ${d.weekday} ${b.id}`);
        for (const it of b.items) assert.deepEqual(it.credits, {}, `${n} ${it.exercise_id}`);
      }
    }
  });

  // ------------------------------------------------------------------------------------------------ validator
  test('R01-v27-under-and-drop: V27 fails a plan whose athletic work drops inside a block, sits under its goal, changes stage mid-block or holds a stage-3 depth jump', () => {
    const base = plan('02');
    const mut = (fn) => { const p = structuredClone(base); fn(p); return validatePlan(p, model).checks.find(c => c.id === 'V27'); };
    const codes = (c) => c.violations.map(v => v.args && v.args.code).filter(Boolean);
    assert.ok(check(base, 'V27').pass);
    let c = mut(p => { p.weeks[9].athletic_budget.planned.throws = 40; });
    assert.ok(!c.pass && codes(c).includes('athletic_drop'));
    c = mut(p => { p.weeks[5].athletic_budget.planned.cod_cuts = 10; p.weeks[4].athletic_budget.planned.cod_cuts = 10; p.weeks[3].athletic_budget.planned.cod_cuts = 10; p.weeks[2].athletic_budget.planned.cod_cuts = 10; p.weeks[1].athletic_budget.planned.cod_cuts = 10; p.weeks[0].athletic_budget.planned.cod_cuts = 10; });
    assert.ok(!c.pass && codes(c).includes('under'));
    c = mut(p => { p.weeks[5].plyo_stage = 'RC3'; });
    assert.ok(!c.pass && codes(c).includes('stage_mid_block'));
    c = mut(p => { const x = items(p.weeks[9]).find(y => y.it.bucket === 'AP_PLYO' && ex(y.it.exercise_id).athletic.quality === 'plyometric'); x.it.exercise_id = 'depth-jump'; });
    assert.ok(!c.pass && codes(c).includes('rc3_single_response'));
    const soccer = structuredClone(plan('03'));
    const cod = items(soccer.weeks[0]).find(y => y.it.bucket === 'AP_COD');
    cod.it.exercise_id = 'slant-route';
    assert.ok(codes(validatePlan(soccer, model).checks.find(x => x.id === 'V27')).includes('sport_only_drill'));
  });
  test('R3-split-and-bounds: the share split and the per-set bounds behave as documented (E-28, E-29)', () => {
    // stage 1: no reactive jumps; the ankle work carries the plyometric part up to the profile's ankle work
    assert.deepEqual(splitContacts(100, 60, 50, 50, 0.4, 'RC1'), { plyo: 0, jump: 100, low: 50 });
    const s3 = splitContacts(145, 90, 100, 110, 0.5, 'RC3');
    assert.ok(Math.abs((s3.plyo + s3.low) / (145 + s3.low + 110) - 0.5) < 1e-6);
    const uni = perSetBounds(model, 'plyo_contacts', ex('single-leg-depth-jump'), 1);
    assert.ok(uni.uni && uni.step === 2 && uni.hi <= 2 * R.athletic.reconcile.unilateral_contacts_per_leg_max);
    const sit = perSetBounds(model, 'throws', ex('medball-sit-up-to-chest-pass'), 1);
    // (v0.4 fix round 1 / F2, LIB-22: the sit-up pass climbs inside 6-10 a set like the other throws, no longer a fixed 20)
    const FT = R.athletic.f2 && R.athletic.f2.throws;
    if (FT && FT.situp_range) assert.ok(!sit.fixed && sit.lo === FT.situp_range[0] && sit.hi === FT.situp_range[1]);
    else assert.ok(sit.fixed && sit.lo === sit.hi);
  });
});
