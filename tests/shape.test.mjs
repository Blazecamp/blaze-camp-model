// tests/shape.test.mjs - engine/shape.mjs (CONTRACTS §4.4, §9; D-10, D-19, D-25, D-26, H15, H19, H21). Owner: B2.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { deriveValues } from '../engine/intake.mjs';
import { buildShape } from '../engine/shape.mjs';

const MODELS = [['fixture', loadFixtureModel()]];
try { const c = loadCompiledModel(); if (c) MODELS.push(['model', c]); } catch (e) { /* fixture only */ }

const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n, mut) => { const i = clone(loadSample(n)); if (mut) mut(i); return i; };
const blocks = (sh) => sh.training_blocks.map(b => `${b.type}[${b.weeks[0]}-${b.weeks[1]}]`).join(' ');
const ebs = (sh) => sh.exercise_blocks.map(e => `${e.weeks[0]}-${e.weeks[1]}`).join(' ');
const season = (date, type = 'next_season_start') => (i) => { i.sport.season = { type, date }; };

for (const [mname, model] of MODELS) {
  const shapeOf = (n, mut) => { const d = deriveValues(sample(n, mut), model); return [buildShape(d, model), d]; };

  describe(`shape.buildShape (${mname})`, () => {
    it('training blocks, exercise blocks and after-plan for the 8 samples (CONTRACTS §9)', () => {
      const exp = {
        '01': ['stairway[1-12]', '1-4 5-8 9-12', { next: 'pre_season', weeks: 4, date: '2027-02-01' }],
        '02': ['stairway[1-12]', '1-4 5-8 9-12', { next: 'block_choice', weeks: null, date: '2027-08-28' }],
        '03': ['stairway[1-6] pre_season[7-8]', '1-6 7-8', { next: 'pre_season_rest', weeks: 2, date: '2026-12-21' }],
        '04': ['stairway[1-8]', '1-4 5-8', { next: 'block_choice', weeks: null, date: null }],
        '05': ['stairway[1-8]', '1-4 5-8', null], '06': ['stairway[1-12]', '1-4 5-8 9-12', null],
        '07': ['stairway[1-12]', '1-4 5-8 9-12', null], '08': ['stairway[1-12]', '1-4 5-8 9-12', null]
      };
      for (const [n, [b, e, after]] of Object.entries(exp)) {
        const [sh] = shapeOf(n);
        assert.equal(blocks(sh), b, n); assert.equal(ebs(sh), e, n);
        if (after) assert.deepEqual(sh.after_plan, after, n);
        assert.equal(sh.weeks.length, sh.weeks_total);
        assert.equal(sh.training_blocks[0].label_key, 'plan.block_type.' + sh.training_blocks[0].type);
      }
    });

    it('soccer (D-10): stairway 1-6 + pre-season 7-8, PRE season phase, VOL3, RC stage held, no tests in pre-season', () => {
      const [sh] = shapeOf('03');
      const w = sh.weeks;
      assert.deepEqual(w.map(x => x.block_type), ['stairway', 'stairway', 'stairway', 'stairway', 'stairway', 'stairway', 'pre_season', 'pre_season']);
      assert.deepEqual(w.map(x => x.stair_week), [1, 2, 3, 4, 5, 6, null, null]);
      assert.deepEqual(w.map(x => x.plyo_stage), ['RC1', 'RC1', 'RC2', 'RC2', 'RC3', 'RC3', 'RC3', 'RC3']);
      assert.deepEqual(w.map(x => x.rep_phase), ['VOL1', 'VOL1', 'VOL1', 'VOL1', 'VOL1', 'VOL1', 'VOL3', 'VOL3']);
      assert.deepEqual(w.slice(6).map(x => x.season_phase), ['PRE', 'PRE']);
      assert.ok(w.slice(0, 6).every(x => x.season_phase.startsWith('OFF_')));
      assert.deepEqual(w.map(x => (x.test ? x.test.type : null)), ['baseline', null, null, null, null, 'end', null, null]);
      assert.deepEqual(w[6].planned_rir, { min: 2, max: 2, intensifiers: false });
      assert.equal(w[6].phase_key, 'plan.phase.PRE_SEASON');
      assert.ok(w[6].is_training_block_start && w[6].is_exercise_block_start);
      assert.ok(w[5].is_last_stair_week);
      assert.deepEqual(sh.training_blocks[1].factor, { of: 'last_offseason_week_sets', factor: 0.6 });
    });

    it('12-week stairway fields: levels 2 -> 11, planned RIR 3 -> 1+, phases by level, standard steps, RC weeks, rep phases', () => {
      const [sh] = shapeOf('01');
      const w = sh.weeks;
      assert.deepEqual(w.map(x => x.stair_level), [2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11]);
      assert.deepEqual(w.map(x => `${x.planned_rir.min}-${x.planned_rir.max}${x.planned_rir.intensifiers ? '+' : ''}`),
        ['3-3', '3-3', '3-3', '3-3', '3-3', '3-3', '2-2', '2-2', '2-2', '1-2', '1-2', '1-1+']);
      assert.deepEqual(w.map(x => x.phase), ['ACCLIMATION', 'ACCLIMATION', 'ACCLIMATION', 'DRIVE', 'DRIVE', 'DRIVE', 'DRIVE', 'DRIVE', 'HARDEST', 'HARDEST', 'HARDEST', 'HARDEST']);
      assert.equal(w[0].standard_step, null);
      assert.deepEqual(w.slice(1).map(x => x.standard_step.this_week), [0.03, 0.03, 0.03, 0.03, 0.03, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05]);
      assert.deepEqual(w.map(x => x.plyo_stage), ['RC1', 'RC1', 'RC1', 'RC2', 'RC2', 'RC2', 'RC2', 'RC3', 'RC3', 'RC3', 'RC3', 'RC3']);
      assert.deepEqual(w.map(x => x.rep_phase), ['VOL1', 'VOL1', 'VOL1', 'VOL1', 'VOL2', 'VOL2', 'VOL2', 'VOL2', 'VOL3', 'VOL3', 'VOL3', 'VOL3']);
      for (let k = 1; k < w.length; k++) {
        assert.ok(w[k].stair_level > w[k - 1].stair_level, 'H21: stair level strictly rises');
        assert.ok(w[k].planned_rir.min <= w[k - 1].planned_rir.min && w[k].planned_rir.max <= w[k - 1].planned_rir.max, 'H21: planned RIR never rises');
      }
      const [l1] = shapeOf('08');
      assert.deepEqual(l1.weeks.map(x => x.phase).slice(0, 5), ['ACCLIMATION', 'ACCLIMATION', 'ACCLIMATION', 'ACCLIMATION', 'DRIVE'], 'L1: 4 acclimation weeks');
      const [l3] = shapeOf('06');
      assert.deepEqual(l3.weeks.map(x => x.phase).slice(0, 3), ['ACCLIMATION', 'ACCLIMATION', 'DRIVE'], 'L3: 2 acclimation weeks');
      assert.ok(l3.weeks.every(x => x.rep_phase === null && x.plyo_stage === null && x.season_phase === null), 'aesthetics: no athlete fields');
    });

    it('tests only in week 1 (baseline) and the last stairway week (end); never from zero at the end (H19, D-40)', () => {
      const [sh] = shapeOf('07');
      const t = sh.weeks.filter(x => x.test);
      assert.deepEqual(t.map(x => [x.n, x.test.type, x.test.from_zero]), [[1, 'baseline', false], [12, 'end', false]], 'v1.2: a 4-year lifter is not from zero');
      const [novice] = shapeOf('07', i => { i.experience.years_consistent = 0.5; });
      assert.equal(novice.weeks[0].test.from_zero, true, 'under a year of consistent training: from zero');
      assert.deepEqual(t[0].test.items, ['strength']);
      const [none] = shapeOf('06');
      assert.ok(none.weeks.every(x => x.test === null));
      const [again] = shapeOf('07', i => { i.plan.previous_cycles = { count: 1, last_had_holds_or_pain: false }; });
      assert.equal(again.weeks[0].test.from_zero, false, 'coming off a completed block');
    });

    it('bootcamp circuit (D-19 v1.2, review 05 blocker 1): 3 rounds at 45 min, work seconds climb every week by the planned steps', () => {
      const [sh] = shapeOf('05');
      // 3 % steps early, 5 % after halfway, 1-s granularity: never a flat week, never more than the 7 % step
      assert.deepEqual(sh.weeks.map(x => x.circuit.work_s), [35, 36, 37, 38, 40, 42, 44, 46]);
      for (let i = 1; i < sh.weeks.length; i++) { const a = sh.weeks[i - 1].circuit.work_s, z = sh.weeks[i].circuit.work_s; assert.ok(z > a && (z - a) / a <= 0.07 + 1e-9); }
      assert.ok(sh.weeks.every(x => x.circuit.rounds === 3), 'rounds never rise inside a 45-min block');
      const [s60] = shapeOf('05', i => { i.schedule.session_minutes = 60; });
      assert.ok(s60.weeks.every(x => x.circuit.rounds === model.rules.supersets.bootcamp.stairway.rounds_max_by_minutes['60']));
      const [gym] = shapeOf('06');
      assert.ok(gym.weeks.every(x => x.circuit === null));
    });

    it('maintenance mode: one flat maintenance block of the chosen weeks; older floor 0.7 (H15)', () => {
      const [sh] = shapeOf('06', i => { i.plan.mode = 'maintenance_4_6'; i.plan.maint_reason = 'vacation_limited_kit'; i.plan.maint_weeks = 6; });
      assert.equal(blocks(sh), 'maintenance[1-6]');
      assert.deepEqual(sh.training_blocks[0].factor, { factor: 0.5, reason: 'vacation_limited_kit' });
      assert.ok(sh.weeks.every(x => x.phase === 'MAINTENANCE' && x.stair_week === null && x.test === null && x.standard_step === null));
      assert.deepEqual(sh.weeks[0].planned_rir, { min: 2, max: 3, intensifiers: false });
      assert.deepEqual(sh.after_plan, { next: 'maintenance_end', weeks: null, date: null });
      const [old] = shapeOf('06', i => { i.age = 66; i.plan.mode = 'maintenance_4_6'; i.plan.maint_reason = 'vacation_limited_kit'; });
      assert.equal(old.training_blocks[0].factor.factor, 0.7);
    });

    it('year plan (D-26): Q1 flat stairway, recovery only between two stairways, Q3 maintenance replaces the next recovery', () => {
      const [sh] = shapeOf('06', i => { i.goal = 'general'; i.priority_muscles = []; i.plan.mode = 'year'; i.plan.tests = ['body']; });
      assert.equal(blocks(sh), 'stairway[1-12] recovery[13-13] stairway[14-25] maintenance[26-39] stairway[40-50] maintenance[51-52]');
      assert.equal(sh.weeks_total, 52);
      assert.equal(sh.training_blocks[0].factor.flat_sets, true);
      assert.equal(sh.training_blocks[2].factor.cycle_step, 1); assert.equal(sh.training_blocks[4].factor.cycle_step, 2);
      sh.training_blocks.forEach((b, k) => {
        if (b.type === 'recovery') { assert.equal(sh.training_blocks[k - 1].type, 'stairway'); assert.equal(sh.training_blocks[k + 1].type, 'stairway'); }
      });
      assert.deepEqual(sh.weeks.filter(x => x.test).map(x => [x.n, x.test.type]), [[1, 'baseline'], [12, 'end'], [25, 'end'], [50, 'end']]);
      assert.equal(sh.weeks[39].stair_level, 2); assert.equal(sh.weeks[49].stair_level, 11, 'Q4 11-week stairway ends at 11');
      assert.deepEqual(sh.exercise_blocks.filter(e => e.training_block === 5).map(e => e.weeks), [[40, 45], [46, 50]]);
    });

    it('season overlay variants: in season now, short lead-in, meet sports (no taper), in-season end inside the plan', () => {
      const s0 = shapeOf('02', season('2027-01-12'))[0];
      assert.equal(blocks(s0), 'in_season[1-12]', 'season starts in week 1');
      assert.ok(s0.weeks.every(x => x.season_phase === 'IN' && x.rep_phase === 'VOL3'));
      const s6 = shapeOf('03', season('2026-11-23'))[0];
      assert.equal(blocks(s6), 'pre_season[1-4] taper[5-6] in_season[7-8]', 'W = 6: lead-in all pre-season, 2 taper weeks (6-week pre-season, D-10), then in-season');
      const swimC = shapeOf('01', season('2026-12-21'))[0];
      assert.equal(blocks(swimC), 'stairway[1-6] pre_season[7-10] in_season[11-12]', 'season type C: no taper before the first meet');
      const ins = shapeOf('02', season('2027-02-15', 'in_season_until'))[0];
      assert.equal(blocks(ins), 'in_season[1-5] stairway[6-12]');
      const noS = shapeOf('02', i => { i.sport.season = { type: 'no_season', date: null }; })[0];
      assert.equal(blocks(noS), 'stairway[1-12]');
      assert.ok(noS.weeks.every(x => x.season_phase === 'OFF_BUILD'));
      for (const sh of [s0, s6, swimC, ins]) for (const w of sh.weeks) if (w.test) assert.ok(w.block_type === 'stairway' && (w.stair_week === 1 || w.is_last_stair_week));
    });

    it('prep overlay: an event inside the plan ends the stairway the week before and tapers in the event week', () => {
      const [sh] = shapeOf('08', i => { i.activity.event_date = '2026-11-25'; });
      assert.equal(blocks(sh), 'stairway[1-6] taper[7-7]');
      assert.equal(sh.weeks_total, 7);
      assert.deepEqual(sh.after_plan, { next: 'block_choice', weeks: null, date: '2026-11-25' });
      const [far] = shapeOf('08', i => { i.activity.event_date = '2027-06-01'; });
      assert.equal(blocks(far), 'stairway[1-12]');
    });

    it('week by week: one open-ended 12-week stairway (D-27)', () => {
      const [sh] = shapeOf('06', i => { i.plan.mode = 'week_by_week'; i.output_mode = 'checkin'; });
      assert.equal(blocks(sh), 'stairway[1-12]'); assert.equal(sh.open_ended, true); assert.equal(sh.mode, 'week_by_week');
    });

    it('no deload or maintenance week inside any stairway; stair weeks run 1..N (H15, V24) across modes and seasons', () => {
      const muts = [];
      for (const mode of ['fixed_12', 'fixed_8', 'week_by_week']) for (const d of ['2026-10-19', '2026-11-16', '2026-12-14', '2027-01-25', '2027-04-05', null]) {
        muts.push(['02', i => { i.plan.mode = mode; if (mode === 'week_by_week') i.output_mode = 'checkin'; if (d) i.sport.season = { type: 'next_season_start', date: d }; else i.sport.season = { type: 'no_season', date: null }; }]);
      }
      for (const [n, mut] of muts) {
        const [sh] = shapeOf(n, mut);
        for (const b of sh.training_blocks.filter(x => x.type === 'stairway')) {
          const ws = sh.weeks.filter(w => w.training_block === b.n);
          assert.deepEqual(ws.map(w => w.stair_week), Array.from({ length: b.stair_N }, (_, k) => k + 1));
          assert.ok(ws.every(w => w.block_type === 'stairway'));
          assert.ok(b.stair_N >= 2);
        }
        let prev = 0;
        for (const b of sh.training_blocks) { assert.equal(b.weeks[0], prev + 1); prev = b.weeks[1]; }
        assert.equal(prev, sh.weeks_total);
      }
    });

    it('is deterministic', () => {
      for (const n of ['01', '03', '05']) {
        const d = deriveValues(sample(n), model);
        assert.equal(JSON.stringify(buildShape(d, model)), JSON.stringify(buildShape(d, model)));
      }
    });
  });
}
