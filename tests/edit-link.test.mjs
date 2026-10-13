// tests/edit-link.test.mjs - engine/edit.mjs link_exercises / unlink_exercises (engine/DECISIONS.md G-314) and the app's Link /
// Unlink (app/edit-ui.js). The coach in chat, 2026-10-13 (CH7 build conversation): "I should be able to link two exercises during a
// session or more, and create my own supersets if I want." COACH-CX CX-02 / CX-04: everything is editable and an edit always
// applies; where it leaves one of his order rules (H03 power before strength, H05 core first, H06 hip + push / knee + pull) the
// `conflicts` say so, as information. A linked group has the engine's own superset form, so the plan, the app and the PDF show it
// like a generated superset; generated plans are unchanged.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCompiledModel } from './helpers/models.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import * as E from '../app/edit-ui.js';
import * as V from '../app/plan-view.js';
import * as B from '../app/intake-builder.js';
import { STRINGS, ui } from '../app/i18n.js';
import * as C from '../agent/core.mjs';

const model = loadCompiledModel();
const sample = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'plans', name + '.json'), 'utf8'));
const dayOf = (p, n, wd) => p.weeks[n - 1].days.find(d => d.weekday === wd);
const itemsOf = (d) => (d ? d.blocks.flatMap(b => b.items || []) : []);
const find = (p, n, wd, id) => itemsOf(dayOf(p, n, wd)).find(it => it.slot_id === id);
const blockKind = (p, n, wd, id) => (dayOf(p, n, wd).blocks.find(b => b.items.some(x => x.slot_id === id)) || {}).kind;
const order = (p, n, wd) => dayOf(p, n, wd).blocks.flatMap(b => b.items.map(x => x.slot_id));
const P06 = sample('06-full-body-aesthetics');
const link = (p, ids, weeks) => applyPlanEdits(p, [{ op: 'link_exercises', weekday: 'Mon', slot_ids: ids, ...(weeks ? { weeks } : {}) }], model);
const unlink = (p, id, weeks) => applyPlanEdits(p, [{ op: 'unlink_exercises', weekday: 'Mon', slot_id: id, ...(weeks ? { weeks } : {}) }], model);

describe('CH7 / CX-02: link_exercises makes the person\'s own superset, triset or giant set (G-314)', () => {
  it('CX-02: two lines of one block become a superset in the engine\'s own form; sets, reps and effort are kept; the rest is the longest', () => {
    const before = JSON.stringify(P06);
    const r = link(P06, ['Mon.A1.s09', 'Mon.A1.s10']);
    assert.equal(JSON.stringify(P06), before, 'the generated plan is never mutated');
    assert.equal(r.plan.edited, true);
    for (const w of r.plan.weeks) {
      const a = find(r.plan, w.n, 'Mon', 'Mon.A1.s09'), b = find(r.plan, w.n, 'Mon', 'Mon.A1.s10');
      if (!a || !b) continue;
      assert.ok(a.superset && a.superset === b.superset && /^link\d+$/.test(a.superset), `week ${w.n}: one new group id`);
      for (const [x, id] of [[a, 'Mon.A1.s09'], [b, 'Mon.A1.s10']]) {
        const o = find(P06, w.n, 'Mon', id);
        for (const k of ['sets', 'reps', 'effort', 'exercise_id', 'credits', 'progression']) assert.deepEqual(x[k], o[k], `week ${w.n}: ${k} kept`);
        assert.deepEqual(x.rest_solo, o.rest, 'its own rest is kept for an unlink');
        assert.equal(x.rest.type, 'after_pair');
      }
      const solo = [find(P06, w.n, 'Mon', 'Mon.A1.s09').rest, find(P06, w.n, 'Mon', 'Mon.A1.s10').rest];
      assert.equal(a.rest.max, Math.max(...solo.map(x => x.max)), 'the group rests the longest rest of its lines');
      assert.deepEqual(a.rest, b.rest);
      assert.equal(dayOf(r.plan, w.n, 'Mon').supersets_on, true);
      // the weekly totals do not change: the same sets, done in another order
      assert.deepEqual(w.weekly_sets_by_group, P06.weeks[w.n - 1].weekly_sets_by_group);
      assert.equal(w.total_resistance_sets, P06.weeks[w.n - 1].total_resistance_sets);
    }
    assert.ok(r.plan.validation && r.plan.validation.edited, 'a fresh validation, stamped edited');
  });

  it('CH7: 3 lines from different blocks move next to each other, in the order chosen, at the first one\'s place and block (a triset)', () => {
    const ids = ['Mon.A1.s09', 'Mon.A1.s06', 'Mon.A1.s11'];
    const r = link(P06, ids, [1]);
    const o = order(r.plan, 1, 'Mon');
    const at = o.indexOf(ids[0]);
    assert.deepEqual(o.slice(at, at + 3), ids, 'next to each other, in the order chosen');
    for (const id of ids) assert.equal(blockKind(r.plan, 1, 'Mon', id), 'accessories', 'in the first line\'s block');
    assert.equal(blockKind(r.plan, 2, 'Mon', 'Mon.A1.s06'), 'strength', 'a week not chosen is left alone');
    const moved = r.conflicts.filter(c => c.code === 'link_moved_block');
    assert.deepEqual(moved.map(c => c.slot_id), ['Mon.A1.s06'], 'information: a line moved to another block');
    // the app's day card shows one TRISET A1 → A2 → A3 with one rest
    const card = V.dayCard(r.plan, model, 'en', 1, 'Mon');
    const g = card.blocks.flatMap(b => b.groups || []).find(x => x.kind === 'triset');
    assert.ok(g, 'a triset group');
    assert.deepEqual(g.rows.map(x => x.slot_id), ids);
    const hd = V.groupHeader(g, (k, a) => ui('en', k, a));
    assert.equal(hd.kind, 'TRISET');
    assert.match(hd.line, /^do A1 → A2 → A3, rest .+, repeat ×\d+$/);
    // the engine's own Markdown tags them [A1] [A2] [A3]
    const md = renderPlan(r.plan, model, { lang: 'en', view: 'day', weeks: [1] });
    for (const tag of ['[A1]', '[A2]', '[A3]']) assert.ok(md.includes(tag), tag);
  });

  it('CH7: 4 or more lines are a giant set; a line already in a group leaves it (the group left with one line is straight again)', () => {
    const r1 = link(P06, ['Mon.A1.s09', 'Mon.A1.s10'], [1]);
    const r2 = link(r1.plan, ['Mon.A1.s10', 'Mon.A1.s11'], [1]);
    const a = find(r2.plan, 1, 'Mon', 'Mon.A1.s09');
    assert.equal(a.superset, null, 'the old pair, left with one line, is a straight exercise');
    assert.deepEqual(a.rest, find(P06, 1, 'Mon', 'Mon.A1.s09').rest, 'with its own rest back');
    assert.ok(!('rest_solo' in a));
    const r3 = link(P06, ['Mon.A1.s09', 'Mon.A1.s10', 'Mon.A1.s11', 'Mon.A1.x01'], [1]);
    const card = V.dayCard(r3.plan, model, 'es', 1, 'Mon');
    const g = card.blocks.flatMap(b => b.groups || []).find(x => x.kind === 'giant');
    assert.ok(g && g.rows.length === 4);
    assert.equal(V.groupHeader(g, (k, x) => ui('es', k, x)).kind, 'SERIE GIGANTE');
  });

  it('CX-02: unlink_exercises takes one line out (it goes right after the group); unlinking down to one line restores straight sets', () => {
    const ids = ['Mon.A1.s09', 'Mon.A1.s10', 'Mon.A1.s11'];
    const r = link(P06, ids);
    const u = unlink(r.plan, 'Mon.A1.s10');
    for (const w of u.plan.weeks) {
      const x = find(u.plan, w.n, 'Mon', 'Mon.A1.s10');
      if (!x) continue;
      assert.equal(x.superset, null);
      assert.deepEqual(x.rest, find(P06, w.n, 'Mon', 'Mon.A1.s10').rest, `week ${w.n}: its own rest back`);
      const o = order(u.plan, w.n, 'Mon');
      assert.ok(o.indexOf('Mon.A1.s10') === o.indexOf('Mon.A1.s11') + 1, 'right after the group');
      assert.equal(find(u.plan, w.n, 'Mon', 'Mon.A1.s09').superset, find(u.plan, w.n, 'Mon', 'Mon.A1.s11').superset, 'the other two stay a pair');
    }
    const u2 = unlink(u.plan, 'Mon.A1.s09');
    for (const w of u2.plan.weeks) for (const id of ids) {
      const x = find(u2.plan, w.n, 'Mon', id);
      if (!x) continue;
      assert.equal(x.superset, null, `week ${w.n} ${id}: straight`);
      assert.deepEqual(x.rest, find(P06, w.n, 'Mon', id).rest);
    }
    assert.equal(dayOf(u2.plan, 1, 'Mon').supersets_on, false);
    assert.deepEqual([...order(u2.plan, 1, 'Mon')].sort(), [...order(P06, 1, 'Mon')].sort(), 'nothing added or lost');
    for (const id of ids) assert.equal(blockKind(u2.plan, 1, 'Mon', id), 'accessories', 'each stays in its block');
  });

  it('CX-04: unlink works on the engine\'s own supersets ("More supersets", CH7-07); the suggestion comes back as a suggestion', () => {
    const p = generate(B.buildIntake({ ...B.defaultAnswers('2026-10-13'), goal: 'muscle', days: 4, weekdays: B.DEFAULT_WEEKDAYS[4].slice(), years: 2, accepted: true, health: 'none', supersets: 'more' }, { lang: 'en' }), model);
    const d = dayOf(p, 1, 'Mon');
    const pair = itemsOf(d).filter(x => x.superset && x.superset === itemsOf(d).find(y => y.superset && y.bucket !== 'CT_CORE_THORAX' && y.bucket !== 'CP_CORE_PELVIS').superset);
    assert.equal(pair.length, 2);
    const ed = E.unlinkEdits(p, 1, 'Mon', pair[0].slot_id);
    assert.equal(ed.length, 1);
    assert.equal(ed[0].op, 'unlink_exercises');
    const r = applyPlanEdits(p, ed, model);
    for (const x of pair) {
      const y = find(r.plan, 1, 'Mon', x.slot_id);
      assert.equal(y.superset, null, 'both lines straight');
      assert.equal(y.rest.type, 'seconds');
      assert.equal(y.rest.max, x.rest.max, 'the same rest numbers, said per set');
    }
    const rec = dayOf(r.plan, 1, 'Mon').superset_recommendations.find(x => x.items.includes(pair[0].slot_id));
    if (rec) assert.equal(rec.on, false, 'a suggestion again');
  });

  it('CX-04 / H03 / H05 / H06: a link that leaves an order rule is applied, and the conflicts say which rule', () => {
    // H05: a core line linked with an accessory moves the accessory into the core block
    const core = link(P06, ['Mon.A1.s03', 'Mon.A1.s09'], [1]);
    assert.ok(core.conflicts.some(c => c.code === 'link_core_block' && c.rule === 'H05' && c.slot_id === 'Mon.A1.s09'));
    assert.equal(blockKind(core.plan, 1, 'Mon', 'Mon.A1.s09'), 'core', 'applied anyway');
    // H06: a squat (knee-dominant) linked with a press (the coach pairs it with a pull)
    const pair = link(P06, ['Mon.A1.s06', 'Mon.A1.p01'], [1]);
    assert.ok(pair.conflicts.some(c => c.code === 'link_pairing' && c.rule === 'H06'));
    // H03: a jump linked after a strength lift (swimming dryland, sample 01)
    const P01 = sample('01-swimming');
    const d1 = dayOf(P01, 1, 'Mon');
    const lift = d1.blocks.find(b => b.kind === 'strength').items.find(x => x.role !== 'test' && !/\.test$/.test(x.slot_id));
    const jump = d1.blocks.find(b => b.kind === 'athletic').items.find(x => typeof x.sets === 'number');
    const h03 = applyPlanEdits(P01, [{ op: 'link_exercises', weekday: 'Mon', slot_ids: [lift.slot_id, jump.slot_id], weeks: [1] }], model);
    assert.ok(h03.conflicts.some(c => c.code === 'link_power_after_strength' && c.rule === 'H03' && c.slot_id === jump.slot_id));
    assert.equal(find(h03.plan, 1, 'Mon', jump.slot_id).superset, find(h03.plan, 1, 'Mon', lift.slot_id).superset, 'applied anyway');
    // the app says it in plain words
    const lines = E.conflictLines(E.newConflicts(h03.conflicts, []), h03.plan, model, 'en', (k, a) => ui('en', k, a), 1).lines;
    assert.ok(lines.some(x => /Fast moves are best done first/.test(x)), lines.join(' / '));
    // a jump linked BEFORE the lift (a contrast pair) is not a conflict
    const ok = applyPlanEdits(P01, [{ op: 'link_exercises', weekday: 'Mon', slot_ids: [jump.slot_id, lift.slot_id], weeks: [1] }], model);
    assert.ok(!ok.conflicts.some(c => c.code === 'link_power_after_strength' && c.slot_id === jump.slot_id));
  });

  it('a test, a WOD, a circuit station, cardio or a warm-up line is never linked; bad input is refused', () => {
    assert.throws(() => link(P06, ['Mon.A1.s01', 'Mon.A1.s09'], [1]), /cannot be linked/);
    assert.throws(() => link(P06, ['Mon.A1.s09'], [1]), /2 or more/);
    assert.throws(() => link(P06, ['Mon.A1.s09', 'Mon.A1.s09'], [1]), /twice/);
    assert.throws(() => link(P06, ['Mon.A1.s09', 'Mon.nope'], [1]), /nothing matches/);
    assert.equal(E.canLink(P06, 1, 'Mon', 'Mon.A1.s01'), false);
    assert.equal(E.canLink(P06, 1, 'Mon', 'Mon.A1.s09'), true);
    const P05 = sample('05-bootcamp');
    for (const w of P05.weeks.slice(0, 1)) for (const d of w.days) for (const b of d.blocks) if (b.kind === 'circuit') for (const x of b.items) assert.equal(E.canLink(P05, 1, d.weekday, x.slot_id), false, 'a circuit station');
  });
});

describe('CH7: the app\'s Link / Unlink (app/edit-ui.js)', () => {
  it('Link covers the shown week and every later week that holds the same exercises in those lines; Undo goes back', () => {
    const ed = E.linkEdits(P06, 3, 'Mon', ['Mon.A1.s09', 'Mon.A1.s10']);
    assert.equal(ed.length, 1);
    assert.deepEqual(ed[0].slot_ids, ['Mon.A1.s09', 'Mon.A1.s10']);
    assert.ok(ed[0].weeks.every(n => n >= 3) && ed[0].weeks[0] === 3);
    const a = E.sameLineWeeks(P06, 'Mon', 'Mon.A1.s09', find(P06, 3, 'Mon', 'Mon.A1.s09').exercise_id, 3);
    const b = E.sameLineWeeks(P06, 'Mon', 'Mon.A1.s10', find(P06, 3, 'Mon', 'Mon.A1.s10').exercise_id, 3);
    assert.deepEqual(ed[0].weeks, a.filter(n => b.includes(n)));
    assert.deepEqual(E.linkEdits(P06, 1, 'Mon', ['Mon.A1.s09']), [], 'one line is not a link');
    const r = applyPlanEdits(P06, ed, model);
    let h = E.pushStep(E.newHistory(P06), { plan: r.plan, conflicts: r.conflicts, edits: ed, kind: 'link' });
    assert.ok(find(E.current(h), 3, 'Mon', 'Mon.A1.s09').superset);
    assert.equal(find(E.current(h), 2, 'Mon', 'Mon.A1.s09').superset, null, 'an earlier week is left alone');
    h = E.undoLast(h);
    assert.equal(E.current(h), P06);
    // a line already in a group starts the pick with its whole group; Unlink is offered on each line of a group
    assert.deepEqual(E.linkStart(r.plan, 3, 'Mon', 'Mon.A1.s10'), ['Mon.A1.s09', 'Mon.A1.s10']);
    assert.deepEqual(E.linkStart(r.plan, 3, 'Mon', 'Mon.A1.s11'), ['Mon.A1.s11']);
    const un = E.unlinkEdits(r.plan, 3, 'Mon', 'Mon.A1.s10');
    assert.equal(un[0].op, 'unlink_exercises');
    assert.deepEqual(un[0].weeks, ed[0].weeks);
    assert.deepEqual(E.unlinkEdits(P06, 3, 'Mon', 'Mon.A1.s10'), [], 'a straight line has nothing to unlink');
  });

  it('H14: the Link words in English and Spanish, with the same placeholders', () => {
    const keys = Object.keys(STRINGS.en).filter(k => k.startsWith('link.'));
    assert.ok(keys.length >= 10);
    for (const k of keys) {
      assert.ok(typeof STRINGS.es[k] === 'string' && STRINGS.es[k].length, k);
      const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
      assert.equal(ph(STRINGS.es[k]), ph(STRINGS.en[k]), k);
    }
    assert.equal(ui('en', 'link.btn'), '🔗 Link');
    assert.equal(ui('es', 'link.btn'), '🔗 Unir');
    assert.equal(ui('es', 'link.unlink'), 'Separar');
  });

  it('agents: edit_plan takes link_exercises / unlink_exercises, and plan_slots says which lines are linked', () => {
    assert.ok(C.EDIT_OPS.link_exercises && C.EDIT_OPS.unlink_exercises && C.EDIT_OPS.swap_exercise);
    const r = C.editPlan(P06, [{ op: 'link_exercises', weekday: 'Mon', slot_ids: ['Mon.A1.s09', 'Mon.A1.s10'] }], model);
    const mon = C.planSlots(r.plan, model, 'en', 1).find(d => d.weekday === 'Mon');
    const its = mon.blocks.flatMap(b => b.items);
    const a = its.find(x => x.slot_id === 'Mon.A1.s09'), b = its.find(x => x.slot_id === 'Mon.A1.s10');
    assert.ok(a.linked_with && a.linked_with === b.linked_with);
    assert.equal(its.find(x => x.slot_id === 'Mon.A1.s11').linked_with, null);
  });
});
