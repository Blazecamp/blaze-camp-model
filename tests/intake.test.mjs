// tests/intake.test.mjs - engine/intake.mjs (CONTRACTS §2.1, §4.3, §9). Owner: B2. Runs on the fixture and on model/ when present.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { validateIntake, safetyScreen, checkRelease, deriveValues } from '../engine/intake.mjs';
import { forbiddenKeys, canonicalJSON } from '../engine/util.mjs';

const MODELS = [['fixture', loadFixtureModel()]];
try { const c = loadCompiledModel(); if (c) MODELS.push(['model', c]); } catch (e) { /* model/ mid-compile: fixture only */ }

const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n, mut) => { const i = clone(loadSample(n)); if (mut) mut(i); return i; };
const codes = (r) => r.errors.map(e => e.code);
const shuffleKeys = (o) => {
  if (Array.isArray(o)) return o.map(shuffleKeys);
  if (o && typeof o === 'object') { const out = {}; for (const k of Object.keys(o).reverse()) out[k] = shuffleKeys(o[k]); return out; }
  return o;
};

for (const [mname, model] of MODELS) {
  describe(`intake.validateIntake (${mname})`, () => {
    it('accepts all 8 sample intakes and fills defaults (idempotent)', () => {
      for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) {
        const r = validateIntake(sample(n), model);
        assert.equal(r.ok, true, n + ' ' + JSON.stringify(r.errors));
        assert.deepEqual(r.errors, []);
        const again = validateIntake(r.intake, model);
        assert.equal(again.ok, true);
        assert.equal(canonicalJSON(again.intake), canonicalJSON(r.intake), n + ' normalization is idempotent');
        assert.equal(r.intake.schema, 'intake/2');
      }
    });

    it('fills defaults: lang, units, lift style, plan mode, tests, output mode, prefs, weekdays and minutes', () => {
      const i = sample('06');
      for (const k of ['lang', 'units', 'lift_style', 'output_mode', 'prefs']) delete i[k];
      delete i.schedule.weekdays; delete i.schedule.session_minutes; i.plan = {};
      const r = validateIntake(i, model);
      assert.equal(r.ok, true, JSON.stringify(r.errors));
      assert.equal(r.intake.lang, 'en'); assert.equal(r.intake.units, 'lb'); assert.equal(r.intake.lift_style, 'balanced');
      assert.equal(r.intake.output_mode, 'plan_only'); assert.equal(r.intake.plan.mode, 'fixed_12'); assert.deepEqual(r.intake.plan.tests, ['none']);
      assert.deepEqual(r.intake.plan.previous_cycles, { count: 0, last_had_holds_or_pain: false });
      assert.deepEqual(r.intake.prefs, { core_position: 'start', optional_days: 'separate', variety_ab: false, heavy_unilateral: false,
        supersets_for_fatigue: false, cardio_adjust: 0, older_athletic_opt_in: false, split_style: 'default' });
      assert.deepEqual(r.intake.schedule.weekdays, ['Mon', 'Tue', 'Thu', 'Fri'], 'aesthetics.4 planned days');
      assert.equal(r.intake.schedule.session_minutes, model.goal('muscle').default_minutes_L3, 'L3 bodybuilder default');
      const m = sample('08', x => { x.plan = { mode: 'maintenance_4_6', maint_reason: 'planned_maintenance' }; });
      assert.equal(validateIntake(m, model).intake.plan.maint_weeks, model.rules.plan_types.maintenance_4_6.weeks_default);
    });

    it('rejects every sex / gender / lifestyle key at any depth (H13, H16, V26)', () => {
      const cases = [
        [(i) => { i.sleep = 6; }, 'check.h16_no_lifestyle'], [(i) => { i.stress = 'high'; }, 'check.h16_no_lifestyle'],
        [(i) => { i.sex = 'f'; }, 'check.h13_no_sex'], [(i) => { i.gender = 'm'; }, 'check.h13_no_sex'],
        [(i) => { i.experience.job = 'hard'; }, 'check.h16_no_lifestyle'], [(i) => { i.prefs.Recovery = 'low'; }, 'check.h16_no_lifestyle'],
        [(i) => { i.schedule.hard_job_or_other_sport = true; }, 'check.h16_no_lifestyle'], [(i) => { i.energy = 3; }, 'check.h16_no_lifestyle'],
        [(i) => { i.pain = [{ area: 'knee', side: 'left', severity: 'mild', worse_with: [], life: 'busy' }]; }, 'check.h16_no_lifestyle']
      ];
      for (const [mut, key] of cases) {
        const r = validateIntake(sample('06', mut), model);
        assert.equal(r.ok, false);
        const e = r.errors.find(x => x.code === 'forbidden_key');
        assert.ok(e, 'forbidden key reported');
        assert.equal(e.key, key);
      }
    });

    it('rejects unknown keys but accepts _comment keys and id', () => {
      assert.equal(validateIntake(sample('06', i => { i._note = 'x'; i.equipment._why = 'y'; }), model).ok, true);
      const r = validateIntake(sample('06', i => { i.favourite_color = 'red'; }), model);
      assert.equal(r.ok, false); assert.ok(codes(r).includes('unknown_key'));
    });

    it('release for this build: accepted, version by role and age (V21, H20)', () => {
      let r = validateIntake(sample('06', i => { delete i.release; }), model);
      assert.equal(r.ok, false); assert.ok(r.errors.some(e => e.code === 'release_missing' && e.key === 'warning.release_missing'));
      r = validateIntake(sample('06', i => { i.release.accepted = false; }), model);
      assert.equal(r.ok, false); assert.ok(codes(r).includes('release_missing'));
      r = validateIntake(sample('06', i => { i.release.version = 'release.minor'; }), model);
      assert.equal(r.ok, false, 'adult with the minor release');
      r = validateIntake(sample('01', i => { i.release.version = 'release.client'; }), model);
      assert.equal(r.ok, false, '16-year-old needs release.minor');
      r = validateIntake(sample('01', i => { i.release.guardian = false; }), model);
      assert.equal(r.ok, false, 'minor without guardian');
      r = validateIntake(sample('06', i => { i.role = 'client'; i.health_route = 'coach_screen'; }), model);
      assert.equal(r.ok, false, 'a coach build needs release.coach');
      r = validateIntake(sample('06', i => { i.role = 'client'; i.health_route = 'coach_screen'; i.release.version = 'release.coach'; }), model);
      assert.equal(r.ok, true, JSON.stringify(r.errors));
    });

    it('role client needs a health route; the coach bypass skips the health screen with a warning', () => {
      let r = validateIntake(sample('06', i => { i.role = 'client'; i.release.version = 'release.coach'; }), model);
      assert.equal(r.ok, false); assert.ok(codes(r).includes('health_route_required'));
      r = validateIntake(sample('06', i => { i.role = 'client'; i.health_route = 'coach_own_sop'; i.release.version = 'release.coach'; i.safety = null; }), model);
      assert.equal(r.ok, true, JSON.stringify(r.errors));
      assert.ok(r.warnings.some(w => w.key === 'warning.coach_bypass'));
    });

    it('week_by_week needs check-ins; year is not for competitive athletes; banned kit tokens are errors', () => {
      assert.ok(codes(validateIntake(sample('06', i => { i.plan.mode = 'week_by_week'; }), model)).includes('week_by_week_needs_checkin'));
      assert.equal(validateIntake(sample('06', i => { i.plan.mode = 'week_by_week'; i.output_mode = 'checkin'; }), model).ok, true);
      assert.ok(codes(validateIntake(sample('02', i => { i.plan.mode = 'year'; }), model)).includes('year_not_for_competitive'));
      for (const t of ['band', 'bands', 'chains', 'weight_releaser']) {
        const r = validateIntake(sample('06', i => { i.equipment.extras = ['dumbbell', t]; }), model);
        assert.equal(r.ok, false); assert.ok(r.errors.some(e => e.code === 'banned_token' && e.key === 'check.h01_no_bands'));
      }
      assert.equal(validateIntake(sample('06', i => { i.coach_rule_pack_ids = ['pack1']; }), model).ok, false, 'rule packs are Phase 1');
    });

    it('warnings, not errors: 60+ opt-in under 60, 105 min non-competitive, > 2 priorities, split style unavailable, V2', () => {
      let r = validateIntake(sample('06', i => { i.prefs.older_athletic_opt_in = true; }), model);
      assert.equal(r.ok, true); assert.ok(r.warnings.some(w => w.code === 'older_opt_in_ignored'));
      assert.equal(deriveValues(sample('06', i => { i.prefs.older_athletic_opt_in = true; }), model).prefs.older_athletic_opt_in, false);
      r = validateIntake(sample('06', i => { i.schedule.session_minutes = 105; }), model);
      assert.equal(r.ok, true); assert.ok(r.warnings.some(w => w.key === 'warning.minutes_competitive_only'));
      assert.equal(deriveValues(sample('06', i => { i.schedule.session_minutes = 105; }), model).session_minutes, 90);
      const d2 = deriveValues(sample('02', i => { i.schedule.session_minutes = 105; }), model);
      assert.equal(d2.session_minutes, 105, 'competitive athletes may train 105 min');
      r = validateIntake(sample('06', i => { i.priority_muscles = ['glutes', 'side_delts', 'chest']; }), model);
      assert.equal(r.ok, true); assert.ok(r.warnings.some(w => w.key === 'warning.v8_priorities'));
      assert.deepEqual(deriveValues(sample('06', i => { i.priority_muscles = ['glutes', 'side_delts', 'chest']; }), model).priority_muscles, ['glutes', 'side_delts']);
      r = validateIntake(sample('08', i => { i.prefs.split_style = 'ppl'; }), model);
      assert.equal(r.ok, true); assert.ok(r.warnings.some(w => w.key === 'warning.split_style_unavailable'));
      r = validateIntake(sample('06', i => { i.schedule.weekdays = ['Mon', 'Tue']; }), model);
      assert.ok(r.warnings.some(w => w.key === 'warning.v2_days'));
    });

    it('field errors: enums, ranges, required fields', () => {
      assert.equal(validateIntake(sample('06', i => { i.goal = 'yoga'; }), model).ok, false);
      assert.equal(validateIntake(sample('06', i => { i.age = 9; }), model).ok, false);
      assert.equal(validateIntake(sample('06', i => { delete i.body_weight; }), model).ok, false);
      assert.equal(validateIntake(sample('06', i => { i.schedule.days_per_week = 7; }), model).ok, false);
      assert.equal(validateIntake(sample('06', i => { i.schedule.session_minutes = 50; }), model).ok, false);
      assert.equal(validateIntake(sample('06', i => { i.schedule.start_date = '2026-02-30'; }), model).ok, false);
      assert.equal(validateIntake(sample('08', i => { i.activity = null; }), model).ok, false, 'goal active needs an activity');
      assert.equal(validateIntake(sample('01', i => { i.sport.sport = 'quidditch'; }), model).ok, false);
      assert.equal(validateIntake(sample('06', i => { i.plan.mode = 'maintenance_4_6'; }), model).ok, false, 'maintenance needs a reason');
      assert.equal(validateIntake(null, model).ok, false);
    });
  });

  describe(`intake.safetyScreen / checkRelease (${mname})`, () => {
    it('refers on any safety item for self and coach_screen; never reads it with coach_own_sop; severe pain always refers', () => {
      const self = sample('06', i => { i.safety.heart = true; });
      assert.deepEqual(safetyScreen(self), { refer: true, reasons: ['refer.reason.heart'], bypass: false });
      const screen = sample('06', i => { i.role = 'client'; i.health_route = 'coach_screen'; i.safety.doctor_said_no = true; });
      assert.deepEqual(safetyScreen(screen).reasons, ['refer.reason.doctor_said_no']);
      const bypass = sample('06', i => { i.role = 'client'; i.health_route = 'coach_own_sop'; i.safety.heart = true; });
      assert.deepEqual(safetyScreen(bypass), { refer: false, reasons: [], bypass: true });
      const severe = sample('06', i => { i.role = 'client'; i.health_route = 'coach_own_sop'; i.pain = [{ area: 'knee', side: 'left', severity: 'severe', worse_with: [] }]; });
      assert.deepEqual(safetyScreen(severe), { refer: true, reasons: ['refer.reason.severe_pain'], bypass: true });
      assert.deepEqual(safetyScreen(sample('06')), { refer: false, reasons: [], bypass: false });
    });

    it('checkRelease: minor / coach / client versions', () => {
      assert.equal(checkRelease(sample('01')).ok, true);
      assert.equal(checkRelease(sample('06')).ok, true);
      assert.equal(checkRelease(sample('06', i => { i.role = 'client'; })).ok, false);
      assert.equal(checkRelease(sample('06', i => { i.role = 'client'; i.release.version = 'release.coach'; })).ok, true);
      assert.equal(checkRelease(sample('06', i => { i.release = null; })).ok, false);
      assert.equal(18, model.rules.levels.youth_age, 'the release age mirrors rules.levels.youth_age');
    });
  });

  describe(`intake.deriveValues (${mname})`, () => {
    const D = {};
    for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) D[n] = deriveValues(sample(n), model);

    it('D2 profile / D1 family / D3 level for the 8 samples (CONTRACTS §9)', () => {
      const exp = {
        '01': ['swimming_middle', 'stroke_free', ['youth_athlete'], 'competitive', 'C', 'athletic', 'L2', 'intermediate'],
        '02': ['football_big_skill', null, [], 'competitive', 'A', 'athletic', 'L3', 'advanced'],
        '03': ['soccer', null, [], 'competitive', 'A', 'athletic', 'L2', 'intermediate'],
        '04': ['crossfit_class', null, [], 'recreational', 'I', 'hybrid_crossfit', 'L2', 'intermediate'],
        '05': ['general_population', null, [], 'none', 'I', 'fat_loss_bootcamp', 'L2', 'intermediate'],
        '06': ['bodybuilding_aesthetics', null, [], 'none', 'G', 'aesthetics', 'L3', 'advanced'],
        '07': ['bodybuilding_aesthetics', null, [], 'none', 'G', 'aesthetics', 'L3', 'advanced'],
        '08': ['rec_pickleball', null, ['active_aging_50plus'], 'recreational', 'I', 'athletic', 'L1', 'foundational']
      };
      for (const [n, [id, variant, overlays, comp, st, fam, lvl, ladder]] of Object.entries(exp)) {
        const d = D[n];
        assert.equal(d.D2_profile.id, id, n); assert.equal(d.D2_profile.variant, variant, n); assert.deepEqual(d.D2_profile.overlays, overlays, n);
        assert.equal(d.D2_profile.competitive, comp, n); assert.equal(d.D2_profile.season_type, st, n);
        assert.equal(d.D1_family, fam, n); assert.equal(d.D3_client_level.level, lvl, n); assert.equal(d.D3_client_level.exercise_ladder, ladder, n);
      }
      assert.equal(D['05'].format, 'bootcamp');
      assert.equal(D['01'].D2_profile.position, 'middle'); assert.equal(D['01'].D2_profile.position_detail, 'free');
      assert.deepEqual(D['04'].D2_profile.activity_ids, ['crossfit_class']);
      assert.ok(D['02'].why.some(w => w.key === 'why.level_reason_l3' && w.ref === 'D-01'));
    });

    it('D4 season, D5 plan shape, D6 template and weekdays (CONTRACTS §9)', () => {
      assert.deepEqual([D['01'].D4_season_phase.phase, D['01'].D4_season_phase.weeks_to_season], ['OFF_BUILD', 16]);
      assert.deepEqual([D['02'].D4_season_phase.phase, D['02'].D4_season_phase.weeks_to_season], ['OFF_EARLY', 32]);
      assert.deepEqual([D['03'].D4_season_phase.phase, D['03'].D4_season_phase.weeks_to_season], ['OFF_LATE', 10]);
      assert.equal(D['06'].D4_season_phase.phase, null);
      assert.deepEqual(D['01'].D5_plan_shape, { mode: 'fixed_12', overlay: 'season', skeleton: 'ATHLETE_OFF_C12', weeks: 12 });
      assert.deepEqual(D['03'].D5_plan_shape, { mode: 'fixed_8', overlay: 'season', skeleton: 'ATHLETE_OFF_C8', weeks: 8 });
      assert.deepEqual(D['04'].D5_plan_shape, { mode: 'fixed_8', overlay: null, skeleton: 'C8_GENERAL', weeks: 8 });
      assert.equal(D['06'].D5_plan_shape.skeleton, 'C12_HYPERTROPHY'); assert.equal(D['08'].D5_plan_shape.skeleton, 'C12_GENERAL');
      const t = (n) => [D[n].D6_week_layout.template_id, D[n].D6_week_layout.variant, D[n].D6_week_layout.pairing];
      assert.deepEqual(t('01'), ['athletic.3', null, 'cross_pattern']);
      assert.deepEqual(t('02'), ['athletic.4', null, 'cross_pattern']);
      assert.deepEqual(t('04'), ['hybrid_crossfit.4', 'crossfit_style_bootcamp', 'cross_pattern']);
      assert.deepEqual(t('05'), ['fat_loss_bootcamp.3', null, 'cross_pattern']);
      assert.deepEqual(t('06'), ['aesthetics.4', null, 'same_pattern']);
      assert.deepEqual(t('07'), ['aesthetics.6', 'ppl_x2', 'same_pattern']);
      assert.deepEqual(t('08'), ['athletic.2', null, 'cross_pattern']);
      assert.deepEqual(D['08'].weekdays, ['Mon', 'Thu']); assert.deepEqual(D['08'].play_days, ['Wed', 'Sat', 'Sun']);
    });

    it('D7 constraint band and D8 kit (CONTRACTS §9)', () => {
      assert.equal(D['01'].D7_constraint_band.client_family, 'athlete');
      assert.deepEqual(D['04'].D7_constraint_band.main, [2, 3]); assert.equal(D['04'].D7_constraint_band.client_family, 'general');
      assert.equal(D['06'].D7_constraint_band.client_family, 'hypertrophy');
      assert.equal(D['08'].D7_constraint_band.client_family, 'general', 'mild pain is not moderate');
      const k = (n) => D[n].D8_kit;
      assert.ok(!k('01').tokens.includes('open_space_long'), '10-20 m running space'); assert.equal(k('01').medball_max_lb, 10);
      assert.ok(!k('01').tokens.includes('barbell_bumpers_platform'));
      assert.ok(['barbell_bumpers_platform', 'hurdles', 'open_space_long'].every(t => k('02').tokens.includes(t))); assert.equal(k('02').medball_max_lb, 20);
      assert.ok(!k('04').tokens.includes('cable') && k('04').machines.length === 0 && k('04').medball_max_lb === 20);
      assert.ok(!k('05').tokens.includes('barbell') && k('05').tokens.includes('dumbbell') && k('05').medball_max_lb === 14);
      assert.ok(!k('08').tokens.includes('machine_specialty') && !k('08').tokens.includes('sled') && k('08').medball_max_lb === 8);
      for (const n of Object.keys(D)) for (const t of model.rules.equipment.banned_tokens) assert.ok(!k(n).tokens.includes(t));
      assert.deepEqual(k('01').tokens, k('01').tokens.slice().sort());
    });

    it('D10 bilateral share, D11 athletic budget, D12 planned step (CONTRACTS §9)', () => {
      assert.deepEqual(D['01'].D10_bilateral_share.lower.by_exercise_block, [0.5, 0.5, 0.55]);
      assert.deepEqual(D['02'].D10_bilateral_share.lower.by_exercise_block, [0.3, 0.25, 0.2]);
      assert.deepEqual([D['03'].D10_bilateral_share.lower.by_exercise_block[0], D['03'].D10_bilateral_share.lower.PRE], [0.2, 0.1]);
      assert.deepEqual(D['04'].D10_bilateral_share.lower.by_exercise_block.slice(0, 2), [0.5, 0.55]);
      assert.deepEqual(D['06'].D10_bilateral_share.lower.by_exercise_block, [0.5, 0.8, 0.9], 'v1.2: physique keys on the bb_pl row (review 06 major 6)');
      // v1.2 (review 08 major 5, coach's own note: 'with joint pains, going unilateral ... helps'): the knee-pain shift goes
      // toward unilateral - pickleball 0.3/0.25/0.2 - 0.2, floored at the minimum bilateral share
      assert.deepEqual(D['08'].D10_bilateral_share.lower.by_exercise_block, [0.1, 0.1, 0.1], 'pickleball 0.3/0.25/0.2 - 0.2 knee shift (unilateral)');
      assert.equal(D['08'].D10_bilateral_share.pain_shift, -0.2, 'negative = toward unilateral');
      const a = (n) => D[n].D11_athletic_budget;
      assert.deepEqual(a('01').plyo_share, { start: 0.1, end: 0.25 }); assert.equal(a('01').contacts_session_max, 100);
      assert.deepEqual(a('01').weekly.plyo_contacts, [6, 8]); assert.equal(a('01').olympic_exposures_wk, 3);
      assert.deepEqual(a('02').plyo_share, { start: 0.35, end: 0.5 }); assert.equal(a('02').contacts_session_max, 120); assert.equal(a('02').olympic_exposures_wk, 4);
      assert.deepEqual(a('03').plyo_share, { start: 0.45, end: 0.6 }); assert.equal(a('03').olympic_exposures_wk, 2);
      assert.equal(a('04').plyo_share, null, 'class model: no plyo share');
      assert.equal(a('05').enabled, false); assert.equal(a('06').enabled, false); assert.equal(a('06').medball_main, false);
      assert.deepEqual(a('08').plyo_share, { start: 0.35, end: 0.5 }); assert.equal(a('08').contacts_session_max, 80); assert.equal(a('08').heavy_play_week, true);
      assert.deepEqual(D['06'].D12_planned_step, { early: 0.03, late: 0.05, caps: { nonpriority_while_priority: 0.03, older: null }, source: 'planned_stairway' });
      assert.deepEqual(D['01'].D12_planned_step.caps, { nonpriority_while_priority: null, older: null });
    });

    it('D13 tests and D14 aerobic sessions (CONTRACTS §9)', () => {
      // v1.2 (review 02 major 6 / 03 major 9): 'from zero' = untrained (L1, layoff, < 1 year consistent), not 'no previous cycle'
      assert.deepEqual(D['01'].D13_tests, { items: ['strength', 'jumps'], baseline_week: 1, end_weeks: [12], from_zero: true }, 'a 16-year-old: never a 1RM baseline (youth)');
      assert.equal(D['02'].D13_tests.from_zero, false, 'a 3-year college athlete tests for real');
      assert.deepEqual(D['03'].D13_tests.end_weeks, [6], 'soccer: end test closes the 6-week stairway');
      assert.deepEqual(D['06'].D13_tests.items, []); assert.equal(D['06'].D13_tests.baseline_week, null);
      assert.equal(D['07'].D13_tests.from_zero, false);
      assert.equal(deriveValues(sample('07', i => { i.experience.years_consistent = 0.5; }), model).D13_tests.from_zero, true, '< 1 year consistent = from zero');
      const aer = (n) => [D[n].D14_aerobic_sessions.per_week, D[n].D14_aerobic_sessions.colours.join('')];
      assert.deepEqual(aer('01'), [0, '']); assert.equal(D['01'].D14_aerobic_sessions.sport_is_aerobic, true);
      assert.deepEqual(aer('02'), [3, 'CBA']); assert.deepEqual(aer('03'), [4, 'CBAC']); assert.deepEqual(aer('04'), [2, 'CB']);
      assert.deepEqual(aer('05'), [3, 'CBA']); assert.deepEqual(aer('06'), [4, 'CBAC']); assert.equal(D['06'].D14_aerobic_sessions.walks, true);
      const p = D['08'].D14_aerobic_sessions;
      assert.deepEqual([p.base, p.replaced_by_activity, p.per_week, p.colours.join('')], [3, 2, 1, 'C'], 'two pickleball sessions replace two aerobic sessions');
      const more = deriveValues(sample('06', i => { i.prefs.cardio_adjust = 2; }), model).D14_aerobic_sessions;
      assert.deepEqual([more.per_week, more.colours.join('')], [6, 'CBACCC'], 'extra sessions are Orange');
      const less = deriveValues(sample('04', i => { i.prefs.cardio_adjust = -3; }), model).D14_aerobic_sessions;
      assert.equal(less.per_week, 0, 'never below 0');
    });

    it('warnings, r3 ids and the derived object carry no sex / lifestyle keys', () => {
      assert.ok(D['03'].warnings.some(w => w.key === 'warning.v6_season'));
      assert.deepEqual(D['01'].r3_pending, ['R3-ATH-01', 'R3-SES-01', 'R3-VOL-01', 'R3-VOL-03', 'R3-VOL-04']);
      assert.ok(D['08'].r3_pending.includes('R3-ATH-05') && D['08'].r3_pending.includes('R3-ATH-02'));
      for (const d of Object.values(D)) assert.deepEqual(forbiddenKeys(d), []);
      const old = deriveValues(sample('08', i => { i.age = 64; i.release.version = 'release.client'; }), model);
      assert.ok(old.warnings.some(w => w.key === 'warning.older_athletic'));
      assert.equal(old.D11_athletic_budget.older_mode, 'default'); assert.equal(old.age_group, 'older');
      assert.deepEqual(old.D12_planned_step.caps.older, 0.03);
      assert.ok(old.D2_profile.overlays.includes('active_aging_60plus'));
      const short = deriveValues(sample('01', i => { i.schedule.session_minutes = 30; }), model);
      assert.ok(short.warnings.some(w => w.key === 'warning.v3_short_athletes'));
    });

    it('D2 mapping examples from the spec (every popular US sport, swimming, pickleball, HYROX, rec leagues)', () => {
      const comp = (sport, position, detail, extra) => sample('01', i => { i.sport.sport = sport; i.sport.position = position; i.sport.position_detail = detail; if (extra) extra(i); });
      const act = (ids, extra) => sample('08', i => { i.activity = { ids, play_days: [], event_date: null }; if (extra) extra(i); });
      const p = (i) => deriveValues(i, model).D2_profile;
      assert.deepEqual([p(comp('swimming', 'sprint', 'fly')).id, p(comp('swimming', 'sprint', 'fly')).variant], ['swimming_sprint', 'stroke_fly']);
      assert.equal(p(comp('american_football', 'WR', null)).id, 'football_skill');
      assert.equal(p(comp('soccer', null, null)).id, 'soccer');
      assert.equal(p(comp('lacrosse', 'defense', 'w')).id, 'lacrosse_w_defense');
      const padel = p(comp('padel', null, null)); assert.deepEqual([padel.id, padel.variant], ['tennis', 'padel_competitive']);
      const senior = p(comp('pickleball', 'doubles', null, i => { i.age = 66; i.release.version = 'release.client'; i.release.guardian = null; }));
      assert.deepEqual([senior.id, senior.variant], ['pickleball_competitive', 'pickleball_senior_60_plus']);
      const pb64 = p(act(['rec_pickleball'], i => { i.age = 64; })); assert.equal(pb64.id, 'rec_pickleball'); assert.deepEqual(pb64.overlays, ['active_aging_60plus']);
      assert.equal(p(act(['hyrox_fitness'])).id, 'hyrox_fitness');
      assert.equal(p(act(['rec_league'], i => { i.activity.league_sport = 'kickball'; })).id, 'rec_kickball');
      const bjj = p(act(['rec_combat_fitness'], i => { i.activity.style = 'grappling'; })); assert.deepEqual([bjj.id, bjj.variant], ['rec_combat_fitness', 'combat_fitness_grappling']);
      assert.equal(p(act(['rec_ocr'])).id, 'rec_ocr');
      const fl = p(sample('06', i => { i.goal = 'fat_loss'; i.priority_muscles = []; i.activity = { ids: ['rec_pickleball'], play_days: ['Sat'], event_date: null }; }));
      assert.deepEqual([fl.id, fl.activity_ids], ['fat_loss', ['rec_pickleball']]);
      const ww = p(sample('08', i => { i.goal = 'athletic'; i.activity = null; i.sport = { competitive: 'none' }; i.age = 66; i.pain = []; }));
      assert.equal(ww.id, 'active_aging_60plus', '60+ weekend warrior: the overlay leads');
      for (const s of model.profiles.picker.sports) {
        const d = deriveValues(comp(s.id, null, null, i => { i.age = 25; i.release.version = 'release.client'; i.release.guardian = null; }), model);
        assert.ok(model.hasSport(d.D2_profile.id), s.id + ' -> ' + d.D2_profile.id);
      }
      for (const a of model.profiles.picker.activities) assert.ok(model.hasSport(p(act([a.id])).id), a.id);
    });

    it('D3 levels: L1 / L2 / L3 (PROPOSED 3 y + 4 days), layoff, former competitor, youth ladder', () => {
      const lv = (mut) => deriveValues(sample('06', mut), model).D3_client_level;
      assert.equal(lv(i => { i.experience.years_consistent = 0.5; }).level, 'L1');
      assert.equal(lv(i => { i.experience.years_consistent = 3; i.schedule.days_per_week = 3; i.schedule.weekdays = ['Mon', 'Wed', 'Fri']; }).level, 'L2');
      assert.equal(lv(i => { i.experience.years_consistent = 3; }).level, 'L3');
      const lay = lv(i => { i.experience.years_consistent = 5; i.experience.months_off_last_2y = 8; });
      assert.deepEqual([lay.level, lay.exercise_ladder], ['L1', 'advanced']); assert.ok(lay.reason_keys.some(r => r.key === 'level.reason.layoff'));
      const pro = lv(i => { i.experience.former_competitor = true; });
      assert.deepEqual([pro.level, pro.replace_after_block], ['L1', 1]);
      const youth = deriveValues(sample('01', i => { i.experience.years_consistent = 5; i.schedule.days_per_week = 4; i.schedule.weekdays = ['Mon', 'Tue', 'Thu', 'Fri']; }), model).D3_client_level;
      assert.deepEqual([youth.level, youth.exercise_ladder], ['L3', 'intermediate'], 'youth ladder capped at intermediate');
      assert.equal(deriveValues(sample('06', i => { i.body_weight = { value: 70, unit: 'kg' }; }), model).body_weight_lb, 154.32);
    });

    it('is deterministic and independent of key order', () => {
      for (const n of ['01', '04', '08']) {
        const a = JSON.stringify(deriveValues(sample(n), model));
        const b = JSON.stringify(deriveValues(sample(n), model));
        const c = JSON.stringify(deriveValues(shuffleKeys(sample(n)), model));
        assert.equal(a, b); assert.equal(a, c);
      }
    });

    it('throws a coded EngineError on an invalid intake', () => {
      assert.throws(() => deriveValues(sample('06', i => { i.sleep = 7; }), model), e => e.code === 'intake.invalid');
    });
  });
}
