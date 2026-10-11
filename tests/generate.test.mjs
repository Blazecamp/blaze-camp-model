// tests/generate.test.mjs - engine/generate.mjs (CONTRACTS §4.12, §5): pipeline, plan/2 assembly, refer / invalid plans.
// v0.4 (R3-VOL-02 / R3-VOL-04): check-ins and adapt() are retired - the plan is the planned stairway only. Runs against the contract-shaped stubs always and against the real B2 / B3 modules when they exist. Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as GEN from '../engine/generate.mjs';
import { generateWith, generate, realModulesStatus, REQUIRED_DEPS, ENGINE_VERSION } from '../engine/generate.mjs';
import { STUB_DEPS } from './helpers/stub-modules.mjs';
import { loadFixtureModel, allSamples, loadSample } from './helpers/models.mjs';

const model = loadFixtureModel();
const REAL = realModulesStatus().ready;

// v0.5 (CT-01): no `offers`, no `time_check`, no session minutes; `edited` says whether the person changed the plan (CX-04);
// meta: session_size / two_day / time; week: target_by_group / acceleration / credit_only_groups; day: exercise_count /
// easy_to_remove (no minutes_limit / supersets_needed); item: progression
// engine 0.5.0 / V2 (converted; DECISIONS G): meta.addons (the optional add-ons a plan offers, COACH-R4 R4-LIB-01); item.swap_notes and
// item.instead_of (what a swap keeps and loses, R4-LIB-04); item.video = {kind, url, copy_name} (R4-LIB-05)
const KEYS = {
  top: ['schema', 'status', 'model_version', 'engine_version', 'contracts_version', 'seed', 'intake_hash', 'lang', 'units', 'release_stamp', 'refer', 'errors', 'edited', 'meta', 'shape', 'weeks', 'summary', 'validation'],
  meta: ['program_id', 'program_name_key', 'goal', 'family', 'format', 'profile', 'level', 'season', 'plan_mode', 'skeleton', 'weeks', 'start_date', 'days_per_week', 'weekdays', 'play_days', 'session_size', 'two_day', 'time', 'template', 'kit', 'constraint_band', 'targets', 'stairway', 'share_targets', 'athletic', 'aerobic', 'tests', 'addons', 'health', 'older_opt_in', 'after_plan', 'instruction_keys', 'locked_rule_keys', 'input_audit', 'warnings', 'r3_pending', 'derived', 'why'],
  shape: ['mode', 'skeleton', 'weeks_total', 'open_ended', 'training_blocks', 'exercise_blocks', 'level_by_week'],
  week: ['n', 'training_block', 'block_type', 'exercise_block', 'stair_week', 'stair_level', 'phase', 'phase_key', 'planned_rir', 'season_phase', 'rep_phase', 'plyo_stage', 'test', 'circuit', 'step_by_muscle', 'target_by_muscle', 'weekly_sets_by_muscle', 'direct_sets_by_muscle', 'main_sets_by_muscle', 'weekly_sets_by_line', 'weekly_sets_by_group', 'main_sets_by_group', 'target_by_group', 'acceleration', 'credit_only_groups', 'total_main_sets', 'group_counts_by_day', 'total_resistance_sets', 'rise_vs_prev', 'athletic_budget', 'aerobic_sessions', 'changes', 'why', 'days'],
  day: ['weekday', 'day_type', 'kind', 'optional', 'label_key', 'full_body', 'format', 'est_minutes', 'aerobic_minutes', 'exercise_count', 'skeleton', 'easy_to_remove', 'supersets_on', 'superset_recommendations', 'toggle_blocks', 'toggle_items', 'groups', 'why', 'blocks'],
  block: ['kind', 'position', 'movable', 'circuit', 'items', 'id', 'toggle', 'removable'],
  item: ['slot_id', 'station_id', 'bucket', 'role', 'origin', 'group', 'exercise_id', 'name_key', 'detail', 'text_key', 'cue_key', 'video', 'sets', 'reps', 'set_reps', 'effort', 'rest', 'load', 'tempo_key', 'superset', 'laterality', 'loading', 'credits', 'athletic', 'aerobic', 'circuit', 'wod', 'test', 'progression', 'notes', 'swaps', 'swap_notes', 'instead_of', 'flags', 'why', 'superset_suggested'],
  summary: ['total_resistance_sets_by_week', 'max_weekly_rise', 'planned_steps_max', 'stair_levels', 'sets_by_muscle_by_week', 'sets_by_line_by_week', 'sets_by_group_by_week', 'target_by_muscle_by_week', 'target_by_group_by_week', 'acceleration', 'myo_equivalent_sets_by_week', 'shortfalls']
};

function assertPlanShape(p) {
  assert.deepEqual(Object.keys(p), KEYS.top);
  assert.equal(p.schema, 'plan/2');
  assert.equal(p.engine_version, ENGINE_VERSION);
  assert.equal(p.edited, false, 'a generated plan is not an edited plan (CX-04)');
  assert.equal(p.meta.time, 'estimate_only');
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
  assert.equal(p.validation.checks.length, 59); // v1.2: V27-V29; engine 0.5.0 / V3 (converted, DECISIONS G): V30-V37, the v0.5 check list
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
      // the stub dose never reconciles the athletic budget, so V27 fires on it by design; every other error check must pass
      // (v0.5: the stub volume planner places the template's sets and the real stairway schedule; the real modules are held to
      // every check below)
      const failing = p.validation.checks.filter(c => !c.pass && c.severity === 'error');
      assert.deepEqual(failing.filter(c => !['V27'].includes(c.id)).map(c => c.id), []);
      assert.equal(deepFind(p, v => v === undefined), null);
      assert.deepEqual(p.meta.instruction_keys, ['instruction.title', 'instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5']);
      assert.equal(p.meta.locked_rule_keys.length, model.rules.locked.length);
      assert.deepEqual(p.meta.input_audit.forbidden_found, []);
      // v0.5 (R4-SES-01): the intake no longer has session minutes
      assert.ok(!p.meta.input_audit.keys.includes('schedule.session_minutes'));
      assert.ok(p.meta.input_audit.keys.includes('schedule.days_per_week'));
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

  test('check-ins are retired (R3-VOL-02 / R3-VOL-04): no adapt export, a check-in output mode plans the same weeks and says so', () => {
    for (const k of ['adapt', 'adaptWith', 'checkinRow']) assert.equal(GEN[k], undefined, k + ' is retired');
    const intake = loadSample('08');
    const a = generateWith(STUB_DEPS, intake, model);
    const b = generateWith(STUB_DEPS, { ...intake, output_mode: 'checkin' }, model);
    assert.equal(JSON.stringify(b.weeks), JSON.stringify(a.weeks), 'the planned stairway is the same');
    assert.ok(!(b.offers || []).some(o => o.key === 'block.cannot_finish'));
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

  test('check-ins are retired: a check-in output mode is planned as plan-only and the client is told (R3-VOL-02)', () => {
    const intake = loadSample('02');
    const a = generate(intake, model);
    const b = generate({ ...intake, output_mode: 'checkin' }, model);
    assert.equal(JSON.stringify(b.weeks), JSON.stringify(a.weeks));
    assert.ok(b.meta.warnings.some(w => w.key === 'warning.checkin_retired'));
    assert.ok(!a.meta.warnings.some(w => w.key === 'warning.checkin_retired'));
    assert.equal(b.validation.checks.find(c => c.id === 'H22').pass, true);
  });

  // (converted in v0.5 from '07 PPL: the time check warns up front, keeps the 75 min with a lower peak, every group trained and
  // climbing (R3-SES-02)': there is no time check - the template comes out complete and the plan says what it cannot hold)
  test('07 PPL (CT-01 / R4-SES-04): no time check and no offers; every trained group reaches its final sets or the plan says the template caps it', () => {
    const p = generate(loadSample('07'), model);
    assert.equal('time_check' in p, false);
    assert.equal('offers' in p, false);
    assert.ok(!p.meta.warnings.some(w => /^warning\.(time_|long_day|supersets_needed)/.test(w.key)), JSON.stringify(p.meta.warnings.map(w => w.key)));
    const st = p.meta.stairway[0];
    const N = st.N;
    for (const g of st.groups) {
      const real = p.summary.sets_by_group_by_week[g];
      assert.ok(real[N - 1] >= st.group_top[g], `${g}: ${real[N - 1]} of ${st.group_top[g]}`);
      const cap = st.capped.find(c => c.group === g);
      if (st.group_top[g] < st.planned_top[g]) {
        assert.ok(cap && cap.held === st.group_top[g] && cap.planned === st.planned_top[g], g + ': a lower top is said (capped)');
        // (v0.5 fix round 1, CX-04: the up-front notice is for a Focus group, a group under its level's start and a big group under
        // 80 % - capped[].notice; the week-by-week table names every capped group)
        assert.ok(cap.notice === false || p.meta.warnings.some(w => w.key === 'warning.capped_by_template' && w.args.group === g), g);
      } else assert.equal(cap, undefined, g);
    }
    for (const l of ['chest', 'lats_upper_back']) {
      const s2 = p.summary.sets_by_line_by_week[l];
      assert.ok(s2[s2.length - 1] > s2[0], l + ' (Focus) climbs');
    }
  });

  test('volume and week share one time model: est_minutes per day == week.estimateMinutes of the planned sets', () => {
    const p = generate(loadSample('06'), model);
    for (const d of p.weeks[0].days.filter(x => x.kind === 'main')) assert.ok(typeof d.est_minutes === 'number' && d.est_minutes > 0);
  });

  test('Focus slots: "for your priority muscle" only for a priority; other Focus slots say why they exist', () => {
    const swim = generate(loadSample('01'), model);   // no priorities: every Focus slot is engine-placed volume
    const notes = swim.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.filter(it => it.bucket === 'FOCUS').flatMap(it => it.notes.map(n => n.key)))));
    assert.ok(notes.length && !notes.includes('note.focus') && notes.includes('note.focus_added'));
    const aes = generate(loadSample('06'), model);    // Focus glutes + side delts (shoulders line, R3-VOL-01; side delts steer the pick)
    const prio = aes.weeks[0].days.flatMap(d => d.blocks.flatMap(b => b.items.filter(it => it.bucket === 'FOCUS' && it.notes.some(n => n.key === 'note.focus'))));
    assert.ok(prio.length && prio.every(it => ['glutes', 'side_delts', 'rear_delts'].includes(model.ex(it.exercise_id).primary_muscle)));
  });

  test('an under-60 older opt-in gets its own warning, never the 60+ rule text', () => {
    const intake = structuredClone(loadSample('08'));
    intake.prefs.older_athletic_opt_in = true;
    const p = generate(intake, model);
    assert.ok(p.meta.warnings.some(w => w.key === 'warning.older_opt_in_ignored'));
    assert.ok(!p.meta.warnings.some(w => w.key === 'warning.older_athletic'));
  });
});
