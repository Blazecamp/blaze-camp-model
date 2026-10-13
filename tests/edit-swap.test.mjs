// tests/edit-swap.test.mjs - engine/edit.mjs swap_exercise (engine/DECISIONS.md G-312): the person puts one of a line's library swaps
// (or any catalog exercise) in its place, in the weeks they choose. COACH-CX CX-02 / CX-04 ("it should be all editable as they need
// to"), COACH-R4 R4-LIB-04 (a swap says what it keeps and what it loses). The line keeps its slot, block, position, sets, reps, effort,
// rest and progression rule; the exercise's own fields, credits and swap list are the new exercise's; the totals are recomputed.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCompiledModel } from './helpers/models.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { swapNotes } from '../engine/library.mjs';
import { renderDay } from '../engine/render.mjs';

const model = loadCompiledModel();
const sample = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'plans', name + '.json'), 'utf8'));
const itemsOf = (d) => (d ? d.blocks.flatMap(b => b.items || []) : []);
const dayOf = (p, n, wd) => p.weeks[n - 1].days.find(d => d.weekday === wd);
const find = (p, n, wd, id) => itemsOf(dayOf(p, n, wd)).find(it => it.slot_id === id);
const posOf = (p, n, wd, id) => { const d = dayOf(p, n, wd); for (const [bi, b] of d.blocks.entries()) { const i = b.items.findIndex(x => x.slot_id === id); if (i >= 0) return [bi, b.kind, i]; } return null; };

describe('CX-02 / R4-LIB-04: swap_exercise (G-312)', () => {
  const p = sample('06-full-body-aesthetics');
  const first = dayOf(p, 1, 'Mon').blocks.find(b => b.kind === 'strength').items[0];
  const slot = first.slot_id, was = first.exercise_id;
  const weeks = p.weeks.filter(w => (find(p, w.n, 'Mon', slot) || {}).exercise_id === was).map(w => w.n);
  const to = first.swaps.find(id => JSON.stringify(model.credits(model.ex(id), first.bucket)) !== JSON.stringify(first.credits)) || first.swaps[0];

  it('CX-02: the line keeps its slot, block, position, sets, reps, effort, rest and progression in every chosen week', () => {
    const before = JSON.stringify(p);
    const r = applyPlanEdits(p, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: to, weeks }], model);
    assert.equal(JSON.stringify(p), before, 'the generated plan is never mutated');
    for (const n of weeks) {
      const a = find(p, n, 'Mon', slot), b = find(r.plan, n, 'Mon', slot);
      assert.equal(b.exercise_id, to);
      assert.deepEqual(posOf(r.plan, n, 'Mon', slot), posOf(p, n, 'Mon', slot), `week ${n}: same block and position`);
      for (const k of ['sets', 'reps', 'effort', 'rest', 'progression', 'bucket', 'role', 'superset', 'station_id']) assert.deepEqual(b[k], a[k], `week ${n}: ${k} kept`);
      assert.equal(b.name_key, model.ex(to).name_key);
      assert.equal(b.edited, true);
      assert.equal(b.swapped_from, was);
      assert.ok(b.video && b.video.kind === 'search' && /youtube\.com\/results\?search_query=/.test(b.video.url), 'R4-LIB-05: a search link, never a third-party video');
    }
    assert.deepEqual(r.applied, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: to, weeks }]);
    assert.equal(r.plan.edited, true);
    assert.equal(r.plan.validation.edited, true, 'no stale validation (audit MEDIUM-1)');
  });

  it('R4-LIB-04: the swap list now offers the replaced exercise first, never the new one, each with its keeps / loses note', () => {
    const r = applyPlanEdits(p, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: to, weeks: [1] }], model);
    const b = find(r.plan, 1, 'Mon', slot);
    assert.equal(b.swaps[0], was);
    assert.ok(!b.swaps.includes(to));
    assert.equal(new Set(b.swaps).size, b.swaps.length);
    for (const id of first.swaps) if (id !== to) assert.ok(b.swaps.includes(id), id);
    assert.deepEqual(b.swap_notes, swapNotes(model, to, b.swaps), 'the notes say what each swap keeps and loses against the new pick');
    assert.ok(b.swap_notes.every(s => model.has('en', s.keeps) && model.has('es', s.keeps)));
    const md = renderDay(r.plan, 1, 'Mon', model, { lang: 'es' });
    assert.ok(md.includes(model.t('es', model.ex(to).name_key)), 'the rendered day names the new exercise');
  });

  it('H08 / CX-04: the credits are the new exercise\'s in the line\'s bucket, and every total is recomputed', () => {
    const r = applyPlanEdits(p, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: to, weeks }], model);
    const b = find(r.plan, 1, 'Mon', slot);
    assert.deepEqual(b.credits, model.credits(model.ex(to), first.bucket));
    for (const n of weeks) {
      const old = p.weeks[n - 1], neu = r.plan.weeks[n - 1], sets = find(p, n, 'Mon', slot).sets;
      assert.equal(neu.total_resistance_sets, old.total_resistance_sets, 'a swap moves no set');
      for (const m of model.rules.muscles.order) {
        const d = sets * (((b.credits || {})[m] || 0) - ((first.credits || {})[m] || 0));
        assert.ok(Math.abs(neu.weekly_sets_by_muscle[m] - (old.weekly_sets_by_muscle[m] + d)) < 0.011, `week ${n} ${m}`);
      }
    }
    // swapped back: the plan's numbers are the generated ones again
    const back = applyPlanEdits(r.plan, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: was, weeks }], model).plan;
    const c = find(back, 1, 'Mon', slot);
    assert.equal(c.exercise_id, was); assert.equal('swapped_from' in c, false); assert.deepEqual(c.credits, first.credits);
    assert.deepEqual(new Set(c.swaps), new Set(first.swaps));
    for (const n of weeks) assert.deepEqual(back.weeks[n - 1].weekly_sets_by_group, p.weeks[n - 1].weekly_sets_by_group);
    assert.deepEqual(back.summary.sets_by_group_by_week, p.summary.sets_by_group_by_week);
  });

  it('H09: athletic work stays uncounted after a swap', () => {
    const q = sample('02-football');
    const d = q.weeks[0].days.find(x => x.kind === 'main');
    const ath = d.blocks.filter(b => b.kind === 'athletic' || b.kind === 'power').flatMap(b => b.items).find(x => x.exercise_id && x.swaps && x.swaps.length);
    assert.ok(ath, 'an athletic line with swaps');
    const r = applyPlanEdits(q, [{ op: 'swap_exercise', weekday: d.weekday, slot_id: ath.slot_id, exercise_id: ath.swaps[0], weeks: [1] }], model);
    const b = find(r.plan, 1, d.weekday, ath.slot_id);
    assert.equal(b.exercise_id, ath.swaps[0]);
    assert.deepEqual(b.credits, {});
    assert.deepEqual(r.plan.weeks[0].weekly_sets_by_group, q.weeks[0].weekly_sets_by_group);
  });

  it('CX-04: refused only when nothing matches or the exercise is unknown; a swap to the same exercise changes nothing', () => {
    assert.throws(() => applyPlanEdits(p, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: 'banded-squat' }], model), /unknown exercise/);
    assert.throws(() => applyPlanEdits(p, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: 'Mon.nope', exercise_id: to }], model), /nothing matches/);
    const same = applyPlanEdits(p, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: slot, exercise_id: was, weeks: [1] }], model).plan;
    assert.deepEqual(find(same, 1, 'Mon', slot), first);
  });
});
