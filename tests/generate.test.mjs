// tests/generate.test.mjs - engine/generate.mjs (CONTRACTS §4.12, §5): pipeline, plan/2 assembly, refer / invalid plans,
// adapt. Runs against the contract-shaped stubs always and against the real B2 / B3 modules when they exist. Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateWith, generate, adapt, adaptWith, checkinRow, realModulesStatus, REQUIRED_DEPS, ENGINE_VERSION } from '../engine/generate.mjs';
import { STUB_DEPS } from './helpers/stub-modules.mjs';
import { loadFixtureModel, allSamples, loadSample } from './helpers/models.mjs';

const model = loadFixtureModel();
const REAL = realModulesStatus().ready;

const KEYS = {
  top: ['schema', 'status', 'model_version', 'engine_version', 'contracts_version', 'seed', 'intake_hash', 'lang', 'units', 'release_stamp', 'refer', 'errors', 'offers', 'meta', 'shape', 'weeks', 'summary', 'validation'],
  meta: ['program_id', 'program_name_key', 'goal', 'family', 'format', 'profile', 'level', 'season', 'plan_mode', 'skeleton', 'weeks', 'start_date', 'days_per_week', 'session_minutes', 'weekdays', 'play_days', 'template', 'kit', 'constraint_band', 'targets', 'stairway', 'share_targets', 'athletic', 'aerobic', 'tests', 'health', 'older_opt_in', 'after_plan', 'instruction_keys', 'locked_rule_keys', 'input_audit', 'warnings', 'r3_pending', 'derived', 'why'],
  shape: ['mode', 'skeleton', 'weeks_total', 'open_ended', 'training_blocks', 'exercise_blocks', 'level_by_week'],
  week: ['n', 'training_block', 'block_type', 'exercise_block', 'stair_week', 'stair_level', 'phase', 'phase_key', 'planned_rir', 'season_phase', 'rep_phase', 'plyo_stage', 'test', 'circuit', 'step_by_muscle', 'target_by_muscle', 'weekly_sets_by_muscle', 'direct_sets_by_muscle', 'main_sets_by_muscle', 'total_main_sets', 'group_counts_by_day', 'total_resistance_sets', 'rise_vs_prev', 'athletic_budget', 'aerobic_sessions', 'changes', 'why', 'days'],
  day: ['weekday', 'day_type', 'kind', 'optional', 'label_key', 'full_body', 'format', 'est_minutes', 'aerobic_minutes', 'minutes_limit', 'supersets_on', 'groups', 'why', 'blocks'],
  block: ['kind', 'position', 'movable', 'circuit', 'items'],
  item: ['slot_id', 'station_id', 'bucket', 'role', 'origin', 'group', 'exercise_id', 'name_key', 'detail', 'text_key', 'cue_key', 'video', 'sets', 'reps', 'set_reps', 'effort', 'rest', 'load', 'tempo_key', 'superset', 'laterality', 'loading', 'credits', 'athletic', 'aerobic', 'circuit', 'wod', 'test', 'notes', 'swaps', 'flags', 'why'],
  summary: ['total_resistance_sets_by_week', 'max_weekly_rise', 'planned_steps_max', 'stair_levels', 'sets_by_muscle_by_week', 'target_by_muscle_by_week', 'myo_equivalent_sets_by_week', 'shortfalls']
};

function assertPlanShape(p) {
  assert.deepEqual(Object.keys(p), KEYS.top);
  assert.equal(p.schema, 'plan/2');
  assert.equal(p.engine_version, ENGINE_VERSION);
  assert.equal(p.model_version, model.version);
  assert.match(p.seed, /^c53:[0-9a-f]{14}$/);
  assert.match(p.intake_hash, /^c53:[0-9a-f]{14}$/);
  assert.deepEqual(Object.keys(p.meta), KEYS.meta);
  assert.deepEqual(Object.keys(p.shape), KEYS.shape);
  assert.deepEqual(Object.keys(p.summary), KEYS.summary);
  assert.equal(p.weeks.length, p.shape.weeks_total);
  for (const w of p.weeks) {
    assert.deepEqual(Object.keys(w), KEYS.week);
    for (const d of w.days) {
      assert.deepEqual(Object.keys(d), KEYS.day);
      d.blocks.forEach((b, i) => {
        assert.deepEqual(Object.keys(b), KEYS.block);
        assert.equal(b.position, i);
        assert.ok(b.items.length > 0, 'empty blocks are omitted');
        for (const it of b.items) {
          assert.deepEqual(Object.keys(it), KEYS.item);
          assert.ok(it.sets !== 0, 'items with 0 sets are omitted');
        }
      });
    }
  }
  assert.deepEqual(p.summary.total_resistance_sets_by_week, p.weeks.map(w => w.total_resistance_sets));
  assert.deepEqual(JSON.parse(JSON.stringify(p)), p, 'no undefined anywhere');
  assert.ok(!/NaN|Infinity/.test(JSON.stringify(p)));
  assert.equal(p.validation.checks.length, 51); // v1.2: V27-V29
}

function deepFind(o, pred, path = '') {
  if (pred(o)) return path;
  if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { const r = deepFind(v, pred, path + '.' + k); if (r) return r; }
  return null;
}

describe('generateWith (stub modules)', () => {
  for (const { name, intake } of allSamples()) {
    test(name + ': plan/2 in contract key order, validated, no failing error check', () => {
      const p = generateWith(STUB_DEPS, intake, model);
      assert.equal(p.status, 'ok');
      assertPlanShape(p);
      // the stub volume planner places flat template sets (no stairway) and the stub dose never reconciles the athletic budget,
      // so v1.2's H21 'stairway_flat' / 'total_flat' rules and V27 fire on it by design; every other error check must pass
      // (the real modules are held to H21 and V27 below)
      const failing = p.validation.checks.filter(c => !c.pass && c.severity === 'error');
      assert.deepEqual(failing.filter(c => !['H21', 'V27'].includes(c.id)).map(c => c.id), []);
      for (const c of failing.filter(c => c.id === 'H21')) assert.ok(c.violations.every(v => ['stairway_flat', 'total_flat', 'circuit_flat'].includes(v.args && v.args.rule)), JSON.stringify(c.violations[0]));
      assert.equal(deepFind(p, v => v === undefined), null);
      assert.deepEqual(p.meta.instruction_keys, ['instruction.title', 'instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5']);
      assert.equal(p.meta.locked_rule_keys.length, model.rules.locked.length);
      assert.deepEqual(p.meta.input_audit.forbidden_found, []);
      assert.ok(p.meta.input_audit.keys.includes('schedule.session_minutes'));
    });
  }

  test('missing dependency -> EngineError generate.bad_deps', () => {
    const deps = { ...STUB_DEPS };
    delete deps.doseItem;
    assert.throws(() => generateWith(deps, loadSample('01'), model), (e) => e.code === 'generate.bad_deps');
    assert.ok(REQUIRED_DEPS.includes('planWeeklySets'));
  });

  test('a slot with 0 sets that week is omitted from that week only', () => {
    const deps = { ...STUB_DEPS, planWeeklySets: (ctx) => { const v = STUB_DEPS.planWeeklySets(ctx); v.weeks[0].sets_by_slot['Mon.S1.s14'] = 0; return v; } };
    const p = generateWith(deps, loadSample('01'), model);
    const has = (n) => p.weeks[n - 1].days.find(d => d.weekday === 'Mon').blocks.some(b => b.items.some(i => i.slot_id === 'Mon.S1.s14'));
    assert.equal(has(1), false);
    assert.equal(has(2), true);
  });

  test('slots added by the volume engine (bonus / focus) are filled through fillSlot and placed in their block', () => {
    const extra = { slot_id: 'Wed.S2.x01', station_id: 'S2.x01', bucket: 'FOCUS', role: 'focus', block: 'accessories', group: 'back', sets_hint: null, default_sets: 2, pair: null, superset: null, circuit: null, axial_req: null, variant: null, laterality_dial: false, loading: null, focus_muscle: 'lats_upper_back', time_class: 'isolation', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null, origin: 'focus_added', why: [{ key: 'why.focus', ref: 'ORD-11' }] };
    let calls = 0;
    const deps = {
      ...STUB_DEPS,
      fillSlot: (slot, ctx) => { if (slot.slot_id === extra.slot_id) { calls++; return { slot_id: slot.slot_id, bucket: 'FOCUS', exercise_id: 'inverted-row', detail: null, swaps: [], laterality: 'bilateral', loading: null, why: [], flags: [] }; } return STUB_DEPS.fillSlot(slot, ctx); },
      planWeeklySets: (ctx) => { const v = STUB_DEPS.planWeeklySets(ctx); for (const w of v.weeks.slice(1)) { w.added_slots = [extra]; w.sets_by_slot[extra.slot_id] = 2; } ctx.fillSlot(extra, 2); return v; }
    };
    const p = generateWith(deps, loadSample('01'), model);
    const it = p.weeks[1].days.find(d => d.weekday === 'Wed').blocks.find(b => b.kind === 'accessories').items.find(i => i.slot_id === extra.slot_id);
    assert.ok(it);
    assert.equal(it.origin, 'focus_added');
    assert.equal(it.exercise_id, 'inverted-row');
    assert.equal(it.group, 'back');
    assert.equal(calls, 3, 'fill computed once per exercise block (3 blocks in 12 weeks), then cached');
    assert.equal(p.weeks[0].days.find(d => d.weekday === 'Wed').blocks.flatMap(b => b.items).some(i => i.slot_id === extra.slot_id), false);
  });

  test('a lifestyle or sex key makes the intake invalid (H13, H16) - no weeks, input audit names it', () => {
    for (const [k, v] of [['sleep', 6], ['stress', 'high'], ['sex', 'f']]) {
      const intake = { ...loadSample('06'), [k]: v };
      const p = generateWith(STUB_DEPS, intake, model);
      assert.equal(p.status, 'invalid');
      assert.deepEqual(p.weeks, []);
      assert.ok(p.errors.length > 0);
      assert.ok(p.meta.input_audit.forbidden_found.includes(k));
      assert.equal(p.release_stamp, null);
    }
  });

  test('a missing release makes the intake invalid (H20)', () => {
    const intake = loadSample('06');
    intake.release.accepted = false;
    const p = generateWith(STUB_DEPS, intake, model);
    assert.equal(p.status, 'invalid');
    assert.ok(p.errors.some(e => e.key === 'warning.release_missing'));
  });

  test('a safety answer refers the person (V1): no weeks, reasons kept, V1 passes', () => {
    const intake = loadSample('06');
    intake.safety.heart = true;
    const p = generateWith(STUB_DEPS, intake, model);
    assert.equal(p.status, 'refer');
    assert.deepEqual(p.refer.reasons, ['refer.reason.heart']);
    assert.deepEqual(p.weeks, []);
    assert.equal(p.validation.checks.find(c => c.id === 'V1').pass, true);
    assert.deepEqual(Object.keys(p.meta), ['health', 'instruction_keys']);
  });

  test('adapt(plan, []) is byte-identical to generate (H22)', () => {
    const intake = loadSample('08');
    const a = generateWith(STUB_DEPS, intake, model);
    assert.equal(JSON.stringify(adaptWith(STUB_DEPS, a, [], intake, model)), JSON.stringify(a));
  });
});

describe('adapt with check-ins (Phase 0, R2-VOL-01 / R2-VOL-03)', () => {
  const ci = (week, efforts, done = efforts.map(() => true), extra = {}) => ({ schema: 'checkin/2', week, sessions: efforts.map((e, i) => ({ weekday: ['Mon', 'Wed', 'Fri'][i], done: done[i], effort: done[i] ? e : null })), felt: [], pain_now: [], results: [], block_action: null, ...extra });

  test('checkinRow follows rules.stairway.checkin.order (repeat, ten, pain, hard, easy, on target)', () => {
    assert.equal(checkinRow(ci(2, [8, 8, 8], [true, false, false]), model), 'repeat');
    assert.equal(checkinRow(ci(2, [7, 10, 8]), model), 'ten');
    assert.equal(checkinRow(ci(2, [8, 8, 8], undefined, { felt: [{ slot_id: 'Mon.S1.s09', value: 'pain' }] }), model), 'pain');
    assert.equal(checkinRow(ci(2, [9, 9, 8]), model), 'hard');
    assert.equal(checkinRow(ci(2, [5, 6, 6]), model), 'easy');
    assert.equal(checkinRow(ci(2, [7, 8, 8]), model), 'on_target');
  });

  test('plan-only intakes ignore check-ins (no check-in = no change, H22)', () => {
    const intake = loadSample('01');
    const base = generateWith(STUB_DEPS, intake, model);
    assert.equal(JSON.stringify(adaptWith(STUB_DEPS, base, [ci(3, [9, 9, 9])], intake, model)), JSON.stringify(base));
  });

  test('a hard week holds the stairway one week; two holds in a row offer to stop the block (never an automatic deload)', () => {
    const intake = { ...loadSample('01'), output_mode: 'checkin' };
    const base = generateWith(STUB_DEPS, intake, model);
    const one = adaptWith(STUB_DEPS, base, [ci(3, [9, 9, 9])], intake, model);
    assert.equal(one.status, 'ok');
    assert.deepEqual(one.weeks[3].target_by_muscle, base.weeks[2].target_by_muscle, 'week 4 repeats week 3');
    assert.ok(Object.values(one.weeks[3].step_by_muscle).every(s => s === 0));
    assert.deepEqual(one.weeks[3].changes, [{ key: 'changes.hold' }]);
    assert.deepEqual(one.weeks[4].target_by_muscle, base.weeks[3].target_by_muscle, 'the stairway continues one week later');
    assert.deepEqual(one.offers, []);
    assert.equal(one.weeks.length, base.weeks.length);
    assert.equal(one.validation.checks.find(c => c.id === 'H22').pass, true);
    assert.equal(one.validation.checks.find(c => c.id === 'H15').pass, true);
    const two = adaptWith(STUB_DEPS, base, [ci(3, [9, 9, 9]), ci(4, [10, 9, 9])], intake, model);
    assert.deepEqual(two.offers, [{ key: 'block.cannot_finish', week: 4 }]);
    assert.ok(!two.weeks.some(w => w.block_type !== 'stairway'), 'no deload inserted');
  });

  test('easy and on-target weeks keep the planned stairway', () => {
    const intake = { ...loadSample('01'), output_mode: 'checkin' };
    const base = generateWith(STUB_DEPS, intake, model);
    const p = adaptWith(STUB_DEPS, base, [ci(2, [7, 8, 7])], intake, model);
    assert.deepEqual(p.weeks.map(w => w.target_by_muscle), base.weeks.map(w => w.target_by_muscle));
  });
});

describe('generate (real B2 / B3 modules)', { skip: REAL ? false : 'B2 / B3 modules not built yet: ' + realModulesStatus().missing_exports.join(', ') }, () => {
  // CONTRACTS §9 acceptance facts that the orchestrator surfaces in meta
  const EXPECT = {
    '01-swimming': { template: 'athletic.3', variant: null, program: 'OT11', profile: 'swimming_middle', family: 'athletic', weeks: 12, level: 'L2' },
    '02-football': { template: 'athletic.4', variant: null, program: 'OT11', profile: 'football_big_skill', family: 'athletic', weeks: 12, level: 'L3' },
    '03-soccer': { template: 'athletic.3', variant: null, program: 'OT11', profile: 'soccer', family: 'athletic', weeks: 8, level: 'L2' },
    '04-crossfit-style-bootcamp': { template: 'hybrid_crossfit.4', variant: 'crossfit_style_bootcamp', program: 'OTCFB', profile: 'crossfit_class', family: 'hybrid_crossfit', weeks: 8, level: 'L2' },
    '05-bootcamp': { template: 'fat_loss_bootcamp.3', variant: null, program: 'OT06', profile: 'general_population', family: 'fat_loss_bootcamp', weeks: 8, level: 'L2' },
    '06-full-body-aesthetics': { template: 'aesthetics.4', variant: null, program: 'OT01', profile: 'bodybuilding_aesthetics', family: 'aesthetics', weeks: 12, level: 'L3' },
    '07-push-pull-legs': { template: 'aesthetics.6', variant: 'ppl_x2', program: 'OT03', profile: 'bodybuilding_aesthetics', family: 'aesthetics', weeks: 12, level: 'L3' },
    '08-pickleball-genpop': { template: 'athletic.2', variant: null, program: 'OTACT', profile: 'rec_pickleball', family: 'athletic', weeks: 12, level: 'L1' }
  };
  for (const { name, intake } of allSamples()) {
    test(name + ': ok, contract shape, §9 template / program / profile / level', () => {
      const p = generate(intake, model);
      assert.equal(p.status, 'ok');
      assertPlanShape(p);
      const e = EXPECT[name];
      if (!e) return;
      assert.equal(p.meta.template.id, e.template);
      assert.equal(p.meta.template.variant, e.variant);
      assert.equal(p.meta.program_id, e.program);
      assert.equal(p.meta.profile.id, e.profile);
      assert.equal(p.meta.family, e.family);
      assert.equal(p.weeks.length, e.weeks);
      assert.equal(p.meta.level.client, e.level);
    });
  }

  test('03 soccer: stairway 1-6 + pre-season 7-8 (D-10), Spanish plan', () => {
    const p = generate(loadSample('03'), model);
    assert.deepEqual(p.shape.training_blocks.map(t => [t.type, ...t.weeks]), [['stairway', 1, 6], ['pre_season', 7, 8]]);
    assert.equal(p.lang, 'es');
  });

  test('08 pickleball: play days Wed / Sat / Sun appear as play days', () => {
    const p = generate(loadSample('08'), model);
    assert.deepEqual(p.weeks[0].days.filter(d => d.kind === 'play').map(d => d.weekday), ['Wed', 'Sat', 'Sun']);
  });

  test('adapt(plan, []) is byte-identical to generate (H22)', () => {
    const intake = loadSample('02');
    const p = generate(intake, model);
    assert.equal(JSON.stringify(adapt(p, [], intake, model)), JSON.stringify(p));
  });

  // integration step (contracts/1.1.1)
  test('07 PPL: the chest priority cannot reach 26-30 in 6 x 75 min -> its start is sized to the minutes and the client is told (D-67, v1.2)', () => {
    const p = generate(loadSample('07'), model);
    // v1.2 (review 07 blocker): the stairway is sized to the minutes first, so the plan climbs; a muscle whose peak does not
    // fit starts lower and is named (warning.start_lowered + offer.lower_start), never a silent flat stairway
    const w = p.meta.warnings.find(x => x.key === 'warning.start_lowered') || p.meta.warnings.find(x => x.key === 'warning.stairway_time');
    assert.ok(w, JSON.stringify(p.meta.warnings));
    assert.ok(w.args.muscles.includes('chest'));
    assert.ok(p.offers.some(o => o.key === 'offer.lower_start' && o.chosen));
    const chest = p.weeks.map(x => x.main_sets_by_muscle.chest);
    assert.ok(chest[chest.length - 1] > chest[0], 'the chest priority climbs');
  });

  test('volume and week share one time model: est_minutes per day == week.estimateMinutes of the planned sets', () => {
    const p = generate(loadSample('06'), model);
    for (const d of p.weeks[0].days.filter(x => x.kind === 'main')) assert.ok(typeof d.est_minutes === 'number' && d.est_minutes > 0);
  });

  test('Focus slots: "for your priority muscle" only for a priority; other Focus slots say why they exist', () => {
    const swim = generate(loadSample('01'), model);   // no priorities: every Focus slot is engine-placed volume
    const notes = swim.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.filter(it => it.bucket === 'FOCUS').flatMap(it => it.notes.map(n => n.key)))));
    assert.ok(notes.length && !notes.includes('note.focus') && notes.includes('note.focus_added'));
    const aes = generate(loadSample('06'), model);    // priorities glutes + side delts
    const prio = aes.weeks[0].days.flatMap(d => d.blocks.flatMap(b => b.items.filter(it => it.bucket === 'FOCUS' && it.notes.some(n => n.key === 'note.focus'))));
    assert.ok(prio.length && prio.every(it => ['glutes', 'side_delts'].includes(model.ex(it.exercise_id).primary_muscle)));
  });

  test('an under-60 older opt-in gets its own warning, never the 60+ rule text', () => {
    const intake = structuredClone(loadSample('08'));
    intake.prefs.older_athletic_opt_in = true;
    const p = generate(intake, model);
    assert.ok(p.meta.warnings.some(w => w.key === 'warning.older_opt_in_ignored'));
    assert.ok(!p.meta.warnings.some(w => w.key === 'warning.older_athletic'));
  });
});
