// Blaze Camp engine 0.7 - fix round on the round-9 coach-eye reviews (reviews/coach-eye-r9/*.md): one describe per rule, named with the
// coach answer it reads. Every plan here is generated in the test - no stored plan is read. Decisions: engine/DECISIONS.md G-291 ... G-299.
//   VOL-07     the day's first lift of a group takes its first added set in a block; a later lift (the dip's half chest set) waits behind
//              it (07 M1; G-291, G-292)
//   R5-GRD-04  the class's own WODs change every week; the Girl and the Hero on main training days (04 M1, m1; G-293)
//   R5-CLS-05  a class member's small-muscle work at 10-12 reps (04 M2; G-294)
//   R5-ATH-08  no reported low-back pain: normal core with a weekly rotational drill, changed by block (08 M1, 02 m14; G-295, G-296)
//   R2-PER-07  a test week whose athletic work is lighter says why (02 m2; G-297)
//   R5-ATH-10  a cutting sport's lateral jump on the first block's days (02 m1; G-298)
//   R5-ATH-04  overhead pressing kept for health: one light overhead press a week for incline-first general / physique plans (G-299)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw } from './helpers/models.mjs';
import { loadModel } from '../engine/model.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { makeContext, scorePlan, SCORER_VERSION } from '../design/bench/score.mjs';

const clone = (x) => JSON.parse(JSON.stringify(x));
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const model = loadCompiledModel() || loadFixtureModel();
const rawOf = () => clone(loadCompiledModel() ? readModelDir() : readFixtureRaw());
const R = model.rules;
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(itemsOf);
const series = (p, slotId) => p.weeks.map(w => { const x = itemsOf(w).find(y => y.it.slot_id === slotId); return x ? x.it.sets : null; });
const withTest = (p, slotId) => p.weeks.map(w => itemsOf(w).filter(y => y.it.slot_id === slotId || y.it.slot_id === slotId + '.test').reduce((a, y) => a + (y.it.sets || 0), 0));
const validOk = (p) => p.status === 'ok' && p.validation.ok;
const modelWith = (fn) => { const raw = rawOf(); fn(raw.rules); return loadModel(raw); };

describe('VOL-07 (G-291, G-292): the first press takes the group\'s first added set; a dip never runs ahead of it (review r9 07 M1)', () => {
  it('the rules carry both readings with their coach ids', () => {
    assert.equal(R.placement.x7.lead_first_step.enabled, true);
    assert.ok(R.placement.x7.lead_first_step.refs.includes('VOL-07'));
    assert.equal(R.placement.x7.later_not_above_lead.min_credit, 0.5);
  });
  it('07: both push days\' first press climbs 3 -> 4 inside the block (the version he graded A: weeks 7 / 8)', () => {
    const p = planOf('07');
    assert.ok(validOk(p));
    const mon = withTest(p, 'Mon.Push.s05'), thu = series(p, 'Thu.Push.s05');
    assert.ok(mon.slice(1, 11).some(n => n >= 4), 'Monday bench ' + mon.join(' '));
    assert.ok(thu.slice(1, 11).some(n => n >= 4), 'Thursday DB bench ' + thu.join(' '));
    assert.ok(Math.max(...mon.slice(1, 11)) >= 4 && Math.max(...thu.slice(1, 11)) >= 4);
  });
  it('07: a dip holds no more than its day\'s first press until the triceps have no other lift left, never more than one set above it', () => {
    const p = planOf('07');
    for (const [dip, press] of [['Mon.Push.s09', 'Mon.Push.s05'], ['Thu.Push.s09', 'Thu.Push.s05']]) {
      const d = series(p, dip), b = withTest(p, press);
      d.forEach((n, i) => assert.ok(n <= b[i] + 1, `${dip} week ${i + 1}: ${n} vs ${b[i]}`));
      // (the first 8 weeks: never above the press)
      d.slice(0, 8).forEach((n, i) => assert.ok(n <= b[i], `${dip} week ${i + 1}: ${n} vs ${b[i]}`));
    }
  });
  it('07: every group still reaches its planned final sets (no group capped by the rule)', () => {
    const p = planOf('07');
    assert.deepEqual((p.meta.stairway[0].capped || []).map(c => c.group), []);
  });
  it('without the rule the Monday bench holds 3 for 12 weeks (the regression the review found)', () => {
    const m = modelWith(r => { r.placement.x7.lead_first_step.enabled = false; r.placement.x7.later_not_above_lead.enabled = false; });
    const p = generate(loadSample(NAMES['07']), m);
    assert.ok(withTest(p, 'Mon.Push.s05').slice(1, 11).every(n => n <= 3));
  });
  it('02 m3: the linebacker\'s counted front squat takes a set past 3 (VOL-07 first lift first)', () => {
    const p = planOf('02');
    assert.ok(validOk(p));
    assert.ok(series(p, 'Mon.A1.s09').slice(1, 11).some(n => n >= 4));
  });
});

describe('R5-GRD-04 "keep it varied" (G-293): the class\'s own WODs change every week; the Girl and the Hero on training days (review r9 04)', () => {
  const p = planOf('04');
  const wods = allItems(p).filter(x => x.it.wod);
  it('the plan is valid', () => assert.ok(validOk(p)));
  it('no WOD slot runs the same format and stations two weeks in a row', () => {
    const bySlot = new Map();
    for (const x of wods) { if (!bySlot.has(x.it.slot_id)) bySlot.set(x.it.slot_id, []); bySlot.get(x.it.slot_id).push(x); }
    for (const [id, list] of bySlot) {
      list.sort((a, b) => a.w.n - b.w.n);
      for (let i = 1; i < list.length; i++) {
        const a = list[i - 1], b = list[i];
        if (b.w.n !== a.w.n + 1 || a.it.wod.named || b.it.wod.named) continue;
        const same = a.it.wod.format === b.it.wod.format && a.it.wod.stations.join() === b.it.wod.stations.join();
        assert.ok(!same, `${id} weeks ${a.w.n}-${b.w.n}: ${a.it.wod.format} ${a.it.wod.stations.join(',')}`);
      }
    }
  });
  it('the engine\'s own WODs change their format week to week and at least one station', () => {
    const own = wods.filter(x => !x.it.wod.named);
    const mon = own.filter(x => x.d.weekday === 'Mon').sort((a, b) => a.w.n - b.w.n);
    assert.ok(new Set(mon.map(x => x.it.wod.format)).size >= 2);
    for (let i = 1; i < mon.length; i++) if (mon[i].w.n === mon[i - 1].w.n + 1) assert.notDeepEqual(mon[i].it.wod.stations, mon[i - 1].it.wod.stations);
  });
  it('the weekly Girl and the block\'s Hero sit on main training days; the named schedule is kept', () => {
    const named = wods.filter(x => x.it.wod.named);
    const girls = named.filter(x => x.it.wod.named.kind === 'girl'), heroes = named.filter(x => x.it.wod.named.kind === 'hero');
    assert.equal(new Set(girls.map(x => x.w.n)).size, p.weeks.length, 'a Girl every week');
    assert.equal(heroes.length, 1);
    for (const x of [...girls, ...heroes]) assert.equal(x.d.kind, 'main', `${x.it.wod.named.name} week ${x.w.n} on ${x.d.weekday}`);
    assert.ok(named.some(x => x.it.wod.named.kind === 'benchmark'));
  });
  it('a WOD of the engine\'s own never repeats a station inside itself', () => {
    for (const x of wods.filter(y => !y.it.wod.named)) assert.equal(new Set(x.it.wod.stations).size, x.it.wod.stations.length, `${x.it.slot_id} week ${x.w.n}`);
  });
  it('rule off: the Monday WOD repeats unchanged (the regression the review found)', () => {
    const m = modelWith(r => { r.conditioning.v7.vary.enabled = false; });
    const q = generate(loadSample(NAMES['04']), m);
    const mon = allItems(q).filter(x => x.it.wod && !x.it.wod.named && x.d.weekday === 'Mon');
    assert.ok(new Set(mon.map(x => x.it.wod.format + x.it.wod.stations.join())).size < mon.length);
  });
});

describe('R5-CLS-05 (G-294): a class member\'s small-muscle work runs 10-12 reps (review r9 04 M2)', () => {
  it('04: every isolation item is 10-12, never 15-20', () => {
    const p = planOf('04');
    const iso = allItems(p).filter(x => x.b.kind === 'accessories' && ex(x.it.exercise_id) && ex(x.it.exercise_id).exercise_class === 'isolation');
    assert.ok(iso.length > 10);
    for (const x of iso) assert.ok(x.it.reps && x.it.reps.min === 10 && x.it.reps.max === 12, `${x.it.exercise_id} ${JSON.stringify(x.it.reps)}`);
  });
  it('a physique plan keeps its own small-muscle brackets (the rule is the class member\'s)', () => {
    const p = planOf('07');
    assert.ok(allItems(p).some(x => x.it.reps && x.it.reps.min >= 12 && ex(x.it.exercise_id) && ex(x.it.exercise_id).exercise_class === 'isolation'));
  });
});

describe('R5-ATH-08 (G-295, G-296): no reported low-back pain - normal core, including rotation, changed by block (review r9 08 M1, 02 m14)', () => {
  const LOW_BACK = ['bird-dogs', 'dead-bugs', 'pallof-press', 'side-plank-elbow', 'plank-forearm-low-plank'];
  const rotational = (id) => (R.selection.v7.core_rotation.ids || []).includes(id) || (!!ex(id) && ex(id).plane === 'transverse' && !/(plank|hold|pallof|carry|bird|dead-bug)/.test(id) && ex(id).status === 'live_library_selectable');
  const coreOf = (p) => allItems(p).filter(x => x.b.kind === 'core');
  it('08 (52, knee pain, low-back hot spot in the profile): every week holds a rotational core drill; the core is not only the low-back list', () => {
    const p = planOf('08');
    assert.ok(validOk(p));
    for (const w of p.weeks) {
      const ids = itemsOf(w).filter(x => x.b.kind === 'core').map(x => x.it.exercise_id);
      assert.ok(ids.some(rotational), `week ${w.n}: ${ids.join(', ')}`);
      assert.ok(!ids.every(id => LOW_BACK.includes(id)), `week ${w.n}: ${ids.join(', ')}`);
    }
  });
  it('08: the core changes at an exercise-block boundary on both training days', () => {
    const p = planOf('08');
    for (const wd of ['Mon', 'Thu']) {
      const by = (n) => itemsOf(p.weeks[n]).filter(x => x.b.kind === 'core' && x.d.weekday === wd).map(x => x.it.exercise_id).join();
      assert.ok(by(0) !== by(4) || by(4) !== by(8), wd);
    }
  });
  it('with reported low-back pain the low-back list comes back and no rotational drill is dealt', () => {
    const i = loadSample(NAMES['08']);
    i.pain = [...(i.pain || []), { area: 'lower_back', severity: 'mild' }];
    const p = generate(i, model);
    assert.equal(p.status, 'ok');
    const ids = coreOf(p).filter(x => x.d.kind === 'main').map(x => x.it.exercise_id);
    assert.ok(!ids.some(id => (R.selection.v7.core_rotation.ids || []).includes(id)), ids.join(', '));
  });
  it('the hot-spot lean of G-131 stays (holds a little up); the rotational drill is never a loaded one for a hot-spot client', () => {
    assert.equal(R.selection.s6.core.hotspot_anti_bonus, 2);
    assert.equal(R.selection.v7.core_rotation.loaded_re, 'weighted');
    for (const x of allItems(planOf('08'))) if (x.b.kind === 'core') assert.ok(!/weighted/.test(x.it.exercise_id), x.it.exercise_id);
    assert.equal(R.selection.v7.core_rotation.enabled, true);
    assert.ok(R.selection.v7.core_rotation.refs.includes('R5-ATH-08'));
  });
  it('words: the why reads in English and Spanish', () => {
    assert.ok(model.has('en', 'why.core_rotation') && model.has('es', 'why.core_rotation'));
  });
});

describe('R2-PER-07 / R5-ATH-02 (G-297): a test week whose athletic work is lighter says why (review r9 02 m2)', () => {
  it('02 week 12 says it in English and Spanish; week 11 does not', () => {
    const p = planOf('02');
    const en = renderPlan(p, model, { lang: 'en', view: 'week', weeks: [12] });
    const es = renderPlan(p, model, { lang: 'es', view: 'week', weeks: [12] });
    assert.ok(en.includes(model.t('en', 'ui.plan.athletic_test_lighter')));
    assert.ok(es.includes(model.t('es', 'ui.plan.athletic_test_lighter')));
    assert.ok(!renderPlan(p, model, { lang: 'en', view: 'week', weeks: [11] }).includes(model.t('en', 'ui.plan.athletic_test_lighter')));
  });
});

describe('R5-ATH-10 / R2-ATH-03 (G-298): the cutting sport\'s Land-stage lateral jump is a two-foot ballistic one (review r9 02 m1, open)', () => {
  it('02 week 1 (the Land stage) holds no reactive jump contacts, and its lateral jumps are two-foot ballistic records', () => {
    const p = planOf('02');
    assert.equal(p.weeks[0].athletic_budget.planned.plyo_contacts, 0);
    const lat = p.weeks.slice(0, 4).flatMap(itemsOf).filter(x => x.it.bucket === 'AP_PLYO' && /(^|-)lateral(-|$)/.test(x.it.exercise_id) && x.w.athletic_budget && x.w.athletic_budget.planned.plyo_contacts === 0);
    assert.ok(lat.length >= 1);
    for (const x of lat) assert.equal(ex(x.it.exercise_id).athletic.quality, 'ballistic', x.it.exercise_id);
  });
});

describe('R5-ATH-04 (G-299): overhead pressing kept for health - one light overhead press a week for incline-first general / physique plans', () => {
  const ohp = (p) => allItems(p).filter(x => x.it.role === 'prehab' && /overhead|z-press|shoulder-press|landmine-press|pike/.test(x.it.exercise_id));
  for (const n of ['06', '07']) it(`${n}: one joint-care overhead press a week, 2 sets, no muscle-set credit; the incline presses keep their slots`, () => {
    const p = planOf(n);
    assert.ok(validOk(p));
    for (const w of p.weeks) {
      const list = ohp({ weeks: [w] });
      assert.equal(list.length, 1, `week ${w.n}`);
      assert.equal(list[0].it.sets, 2);
    }
  });
  it('the rule names its reading as PROPOSED', () => {
    assert.match(R.selection.v7.incline_overhead.general_care.status, /PROPOSED/);
  });
});

describe('VOL-07 (G-300): benchmark scorer 2.7 reads the first lift\'s first added set of a block as the coach\'s staircase', () => {
  it('07: the leads\' steps are no staircase deviation with the rule; without the key the scorer reads as 2.6 and counts them', () => {
    assert.equal(SCORER_VERSION, '2.7');
    const raw = rawOf();
    const hits = (rules) => { const r = scorePlan(planOf('07'), makeContext({ rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles })); return ((r.metrics || {}).staircase_deviation || {}).value || 0; };
    const off = clone(raw.rules); delete off.placement.x7.lead_first_step;
    assert.ok(hits(raw.rules) < hits(off), `${hits(raw.rules)} vs ${hits(off)}`);
  });
});
