// tests/model.test.mjs - engine/model.mjs: loadModel members and assertModel (CONTRACTS §3, §4.2). Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadModel, assertModel } from '../engine/model.mjs';
import { EngineError } from '../engine/util.mjs';
import { loadFixtureModel, readFixtureRaw, cloneFixtureRaw, readModelDir } from './helpers/models.mjs';

const model = loadFixtureModel();

describe('assertModel', () => {
  test('the fixture honours every §3 shape', () => {
    assert.deepEqual(assertModel(readFixtureRaw()), []);
  });

  test('the compiled model/ honours every §3 shape (skipped until B1 compiles it)', (t) => {
    const raw = readModelDir();
    if (!raw) return t.skip('model/ not compiled yet');
    assert.deepEqual(assertModel(raw), []);
  });

  const mutations = [
    ['band word in an exercise id', (r) => { r.catalog.exercises[0].id = 'cable-row-band'; }, /band word in id/],
    ['credits differ from the class map', (r) => { r.catalog.exercises.find(e => e.credit_class === 'BKD').credits = { quads: 1 }; }, /credits != class map/],
    ['KB swing in a resistance slot', (r) => { const e = r.catalog.exercises.find(x => x.tags.includes('kb_swing')); e.slots = [...e.slots, 'RP_BHD'].sort(); }, /KB swing in a resistance slot/],
    ['KB swing crediting glutes', (r) => { const e = r.catalog.exercises.find(x => x.tags.includes('kb_swing')); e.credit_class = 'GLUTE_ISO'; e.credits = { ...r.rules.credit.classes.GLUTE_ISO }; }, /kb_swing credits muscles/],
    ['medball above 20 lb', (r) => { r.catalog.exercises.find(x => x.medball).medball.max_lb = 25; }, /medball > 20 lb/],
    ['banned kit token', (r) => { r.catalog.exercises[1].equipment.any_of = [['bands']]; }, /banned token/],
    ['missing EN exercise name', (r) => { delete r.i18n.en[r.catalog.exercises[2].name_key]; }, /missing EN exercise\./],
    ['older never-list leak', (r) => { const e = r.catalog.exercises.find(x => x.tags.includes('overhead_squat')); e.older_ok = true; }, /older never-list leak/],
    ['V-squat record', (r) => { r.catalog.exercises[3].tags = [...r.catalog.exercises[3].tags, 'v_squat'].sort(); }, /V-squat present|not in the closed list/],
    ['thruster credit split', (r) => { const e = r.catalog.exercises.find(x => x.credit_class === 'THRUSTER'); r.rules.credit.classes.THRUSTER = { quads: 1, front_delts: 0.5 }; e.credits = { quads: 1, front_delts: 0.5 }; }, /thruster credits/],
    ['sex key anywhere', (r) => { r.profiles.goals.muscle.sex = 'm'; }, /sex\/gender key present/],
    ['lifestyle input in rules', (r) => { r.rules.volume.sleep_lt6 = 0.5; }, /lifestyle input in rules/],
    ['stairway early step above a late step', (r) => { r.rules.stairway.by_N['12'].standard_steps['2'] = 0.06; }, /early step > late step/],
    ['validation ids out of order', (r) => { r.rules.validation.checks.reverse(); }, /V1\.\.Vn \(n >= 26\) in order/],
    ['ES placeholder mismatch', (r) => { const k = Object.keys(r.i18n.es).find(x => /\{n\}/.test(r.i18n.es[x])); r.i18n.es[k] = r.i18n.es[k].replace('{n}', '{m}'); }, /ES placeholders differ/],
    ['EN key with neither ES nor review entry', (r) => { r.i18n.en['ui.plan.new_thing'] = 'New'; }, /ES missing and not in es_review/],
    ['missing rules section', (r) => { delete r.rules.tests; }, /rules\.tests missing/],
    ['unresolved [PLACEHOLDER] in a client string (review 04 / 05 minors)', (r) => { r.i18n.en['video.note'] = 'Send it to [VIDEO_CONTACT].'; r.i18n.es['video.note'] = 'Envíalo a [VIDEO_CONTACT].'; }, /unresolved placeholder in EN video\.note/],
    ['template station with an unknown bucket', (r) => { r.templates.families.athletic.days['3'].day_types.S1.stations[5].bucket = 'RP_NOPE'; }, /unknown bucket RP_NOPE/]
  ];
  for (const [name, mutate, re] of mutations) {
    test('catches: ' + name, () => {
      const raw = cloneFixtureRaw();
      mutate(raw);
      const errs = assertModel(raw);
      assert.ok(errs.some(e => re.test(e)), `expected ${re} in:\n${errs.slice(0, 10).join('\n')}`);
    });
  }
});

describe('Model API (CONTRACTS §4.2)', () => {
  test('version and frozen raw objects', () => {
    assert.equal(model.version, readFixtureRaw().manifest.model_version);
    assert.ok(Object.isFrozen(model.rules) && Object.isFrozen(model.rules.volume));
  });

  test('ex / hasEx / exercises (aliases resolved, unknown throws EngineError)', () => {
    const e = model.ex('front-squat-barbell');
    assert.equal(e.credit_class, 'BKD');
    assert.equal(model.hasEx('front-squat-barbell'), true);
    assert.equal(model.hasEx('no-such-thing'), false);
    assert.throws(() => model.ex('no-such-thing'), (err) => err instanceof EngineError && err.code === 'model.unknown_exercise');
    const aliases = readFixtureRaw().catalog.id_aliases;
    const [src, tgt] = Object.entries(aliases)[0] || [];
    if (src) assert.equal(model.ex(src).id, tgt);
    const ids = model.exercises().map(x => x.id);
    assert.deepEqual(ids, ids.slice().sort());
  });

  test('bySlot resolves retired / pooled buckets', () => {
    assert.deepEqual(model.bySlot('ISO_HAM').map(e => e.id), model.bySlot('ISO_LEG_FLEXION').map(e => e.id));
    assert.deepEqual(model.bySlot('CORE_OTHER').map(e => e.id), model.bySlot('CORE_ANY').map(e => e.id));
    assert.ok(model.bySlot('RP_BKD').length > 0);
  });

  test('credits: athletic buckets credit nothing (H09); KB swing 0; thruster 1 / 0.5 / 0.25; dips 0.5 / 0.5 (H08)', () => {
    const push = model.ex('barbell-push-press');
    assert.deepEqual(model.credits(push, 'AP_TRIPLE_EXT'), {});
    assert.ok(Object.keys(model.credits(push, 'RP_VPUSH')).length > 0);
    for (const e of model.exercises().filter(x => x.tags.includes('kb_swing'))) assert.deepEqual(model.credits(e, 'COND_WOD'), {}) ;
    for (const e of model.exercises().filter(x => x.tags.includes('kb_swing'))) assert.deepEqual(e.credits, {});
    const th = model.exercises().find(x => x.credit_class === 'THRUSTER');
    assert.deepEqual({ ...th.credits }, { quads: 1, front_delts: 0.5, glutes: 0.25 });
    const dips = model.exercises().find(x => x.credit_class === 'DIPS');
    assert.deepEqual({ ...dips.credits }, { triceps: 0.5, chest: 0.5 });
  });

  test('t(): ES -> EN fallback, missing key -> key, placeholders filled, unknown placeholders verbatim', () => {
    const missing = readFixtureRaw().i18n.es_review.missing_keys[0];
    assert.equal(model.t('es', missing), model.t('en', missing));
    assert.equal(model.t('en', 'no.such.key'), 'no.such.key');
    assert.equal(model.t('en', 'reps.fixed', { n: 8 }), '8 Reps');
    assert.equal(model.t('en', 'changes.set_added', { exercise: 'X' }), '+1 set on X ({day})');
    assert.equal(model.has('es', missing), false);
    assert.equal(model.has('en', 'reps.fixed'), true);
  });

  test('stair(N), template / dayTypes / templateFor (D-22)', () => {
    const s = model.stair(12);
    assert.equal(s.N, 12);
    assert.equal(s.display_level[1], 2);
    assert.equal(s.display_level[12], 11);
    assert.deepEqual(s.rc_weeks.RC1, [1, 3]);
    assert.throws(() => model.stair(1), (err) => err.code === 'model.no_stairway');
    const t = model.templateFor('hybrid_crossfit', 4, null);
    assert.equal(t.variant, 'crossfit_style_bootcamp');
    const dt = model.dayTypes(model.template('aesthetics', 6), 'ppl_x2');
    assert.ok(Object.keys(dt.day_types).includes('Push'));
    assert.throws(() => model.template('nope', 3), (err) => err.code === 'model.unknown_template');
  });

  test('kitAvailable: any setup inside the kit and the machine when one is needed', () => {
    const fs = model.ex('front-squat-barbell');
    assert.equal(model.kitAvailable(fs, { tokens: ['barbell'], machines: [] }), true);
    assert.equal(model.kitAvailable(fs, { tokens: new Set(['dumbbell']), machines: [] }), false);
    const leg = model.exercises().find(e => e.equipment.machine);
    assert.equal(model.kitAvailable(leg, { tokens: leg.equipment.any_of[0], machines: [] }), false);
    assert.equal(model.kitAvailable(leg, { tokens: leg.equipment.any_of[0], machines: [leg.equipment.machine] }), true);
  });

  test('muscles and groups (R2-SES-05)', () => {
    assert.equal(model.groupOf('glutes'), 'hips');
    assert.equal(model.groupOf('rear_delts'), 'shoulders');
    assert.deepEqual(model.groupMembers('hips'), ['glutes', 'hamstrings']);
    assert.ok(model.muscleIds({ target: true }).includes('calves'));
    assert.ok(!model.muscleIds({ target: true }).includes('abs_obliques'));
  });

  test('loadModel rejects an incomplete raw model', () => {
    assert.throws(() => loadModel({ manifest: {} }), (err) => err.code === 'model.bad_raw');
  });
});
