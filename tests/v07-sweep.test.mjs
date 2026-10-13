// Blaze Camp engine 0.7 - the four random intakes of `node tools/sweep.mjs 1500` that failed an error check after the 0.7.0 merge
// (tests/helpers/random-intake.mjs, index n; generated on both models). One describe per rule id, each test re-reads the plan
// independently of engine/validate.mjs as well as through it. Decisions: engine/DECISIONS.md G-301 ... G-304.
//   H21 / H22  random-1332: a bonus week raised above what the later weeks can hold left the chest target 12 -> 11 inside the block,
//              and the printed weekly targets were not the schedule the block kept (G-301, G-302)
//   V27        random-878, random-940: the R5-ATH-02 hold pass raised reactive / ankle work in a week already over its plyo share
//              (share_over; G-303); random-451: the hold pass split one plateau by lengthening the block's peak to 9 weeks
//              (early_peak; G-304)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { randomIntake } from './helpers/random-intake.mjs';

const models = [['fixture', loadFixtureModel()], ...(loadCompiledModel() ? [['model/', loadCompiledModel()]] : [])];
const cache = new Map();
const rnd = (i, label, m) => { const k = label + i; if (!cache.has(k)) cache.set(k, generate(randomIntake(i, m), m)); return cache.get(k); };
const failing = (p, id) => p.validation.checks.filter(c => c.id === id && !c.pass);
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const EPS = 1e-9;

describe('H21 / H22 (G-301, G-302): a group\'s weekly target never drops inside a block and is the schedule the block keeps (random-1332)', () => {
  for (const [label, m] of models) {
    it(`${label}: random-1332 passes H21 and H22`, () => {
      const p = rnd(1332, label, m);
      assert.equal(p.status, 'ok');
      assert.deepEqual(failing(p, 'H21'), []);
      assert.deepEqual(failing(p, 'H22'), []);
    });
    it(`${label}: random-1332 - every group's target is non-decreasing week to week and equals the block's printed schedule`, () => {
      const p = rnd(1332, label, m);
      for (const b of p.meta.stairway.filter(x => !x.circuit && x.schedule)) {
        const ws = p.weeks.filter(w => w.training_block === b.training_block);
        for (const g of Object.keys(b.group_top || {})) {
          const t = ws.map(w => (w.target_by_group || {})[g]).filter(x => typeof x === 'number');
          for (let i = 1; i < t.length; i++) assert.ok(t[i] >= t[i - 1], `${g} target drops ${t[i - 1]} -> ${t[i]} in block ${b.training_block}`);
        }
        // the chest schedule the block prints is the one its weeks carry
        if (Array.isArray(b.schedule) && ws.every(w => typeof (w.target_by_group || {}).chest === 'number')) assert.deepEqual(ws.map(w => w.target_by_group.chest), b.schedule);
      }
    });
  }
});

describe('V27 (G-303): a week over its plyo share holds its reactive jumps and ankle work at their minimum dose (R2-ATH-01; random-878, random-940)', () => {
  for (const [label, m] of models) for (const n of [878, 940]) {
    it(`${label}: random-${n} passes V27`, () => {
      const p = rnd(n, label, m);
      assert.equal(p.status, 'ok');
      assert.deepEqual(failing(p, 'V27'), []);
    });
    it(`${label}: random-${n} - no plyometric station climbs in a week that sits over its share band`, () => {
      const p = rnd(n, label, m);
      const tol = m.rules.athletic.f2.share.tolerance;
      // the reading: a stage-3 week of repeated-contact drills is 100 % plyometric by design - its stations then stay where the week
      // before left them or at the drill's smallest dose; none of them is raised for the hold rule (R5-ATH-02)
      const ws = p.weeks.filter(w => w.athletic_budget && typeof w.athletic_budget.plyo_share === 'number' && typeof w.athletic_budget.planned_share === 'number' && !w.athletic_budget.test_dose && !w.athletic_budget.test_replaced);
      for (const w of ws) {
        const ab = w.athletic_budget;
        if (!(ab.planned_share > ab.plyo_share + tol + EPS)) continue;
        const prev = p.weeks.find(x => x.n === w.n - 1 && x.exercise_block === w.exercise_block);
        if (!prev) continue;
        for (const r of itemsOf(w).filter(x => x.it.athletic && ['plyo_contacts', 'low_contacts'].includes(x.it.athletic.key))) {
          const q = itemsOf(prev).find(x => x.it.slot_id === r.it.slot_id && x.it.exercise_id === r.it.exercise_id);
          if (q && q.it.athletic) assert.ok(r.it.athletic.per_set <= q.it.athletic.per_set + EPS, `week ${w.n} ${r.it.slot_id} ${r.it.exercise_id} climbs ${q.it.athletic.per_set} -> ${r.it.athletic.per_set} over its share (${ab.planned_share} vs ${ab.plyo_share})`);
        }
      }
    });
  }
});

describe('V27 (G-304): the hold rule splits a plateau without lengthening the block\'s peak (R5-ATH-02, R3-VOL-04; random-451)', () => {
  for (const [label, m] of models) {
    it(`${label}: random-451 passes V27`, () => {
      const p = rnd(451, label, m);
      assert.equal(p.status, 'ok');
      assert.deepEqual(failing(p, 'V27'), []);
    });
    it(`${label}: random-451 - the jumps' peak total holds no more than half the block's weeks plus the slack`, () => {
      const p = rnd(451, label, m);
      const slack = m.rules.athletic.r2.flat.run_slack || 0;
      const tbs = [...new Set(p.weeks.filter(w => w.athletic_budget && w.athletic_budget.planned).map(w => w.training_block))];
      for (const tb of tbs) {
        const ws = p.weeks.filter(w => w.training_block === tb && w.athletic_budget && w.athletic_budget.planned && !w.athletic_budget.hold);
        const ws2 = ws.filter(w => (w.athletic_budget.planned.plyo_contacts || 0) + (w.athletic_budget.planned.jump_contacts || 0) > 0);
        const tot = ws2.map(w => (w.athletic_budget.planned.plyo_contacts || 0) + (w.athletic_budget.planned.jump_contacts || 0));
        const tgt = ws2.map(w => (w.athletic_budget.targets.plyo_contacts || 0) + (w.athletic_budget.targets.jump_contacts || 0));
        if (tot.length < 4) continue;
        // (a block whose sport target climbs and whose peak sits under it - the climb is the block's to spread, R3-VOL-04)
        if (!(tgt[tgt.length - 1] >= tgt[0] * 1.1) || !(tot[tot.length - 1] < 0.9 * tgt[tgt.length - 1])) continue;
        let run = 1;
        for (let i = tot.length - 2; i >= 0 && tot[i] === tot[tot.length - 1]; i--) run++;
        assert.ok(run <= Math.ceil(tot.length / 2) + slack, `block ${tb}: the peak ${tot[tot.length - 1]} holds ${run} of ${tot.length} weeks (${tot.join(' ')})`);
      }
    });
  }
});
