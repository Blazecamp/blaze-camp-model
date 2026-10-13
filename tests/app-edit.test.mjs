// tests/app-edit.test.mjs - the plan screen's editing (app/edit-ui.js): which engine edits a tap makes (Swap, Sets - / +, Remove,
// Add exercise, a block on / off), the library the Add search lists, the undo history and the info lines. COACH-CX CX-02 / CX-04
// (everything editable; conflicts are information, the edit still applies), R4-SES-04 (the person removes what they want),
// R4-LIB-01 / R4-LIB-04 (add-ons selectable, never proposed or neck work; a swap says what it keeps and loses), H01 (no bands),
// H12 (60+ never-list), R3-GEN-01 (nothing stored). The browser run is tools/app-qa/edit.mjs.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCompiledModel } from './helpers/models.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { STRINGS, ui } from '../app/i18n.js';
import * as E from '../app/edit-ui.js';
import * as V from '../app/plan-view.js';

const model = loadCompiledModel();
const sample = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'plans', name + '.json'), 'utf8'));
const itemsOf = (d) => (d ? d.blocks.flatMap(b => b.items || []) : []);
const P06 = sample('06-full-body-aesthetics');
const strengthFirst = (p, wd) => p.weeks[0].days.find(d => d.weekday === wd).blocks.find(b => b.kind === 'strength').items[0];

describe('app editing: the edits a tap makes (app/edit-ui.js)', () => {
  it('CX-02: Sets + in week n changes that week and every later week of the same exercise, each from its own number', () => {
    const it0 = strengthFirst(P06, 'Mon');
    const n = 3;
    const ed = E.tuneEdits(P06, n, 'Mon', it0.slot_id, 1);
    assert.ok(ed.length >= 1 && ed.every(e => e.op === 'set_sets' && e.weekday === 'Mon' && e.slot_id === it0.slot_id));
    const touched = ed.flatMap(e => e.weeks).sort((a, b) => a - b);
    assert.deepEqual(touched, E.sameLineWeeks(P06, 'Mon', it0.slot_id, E.itemAt(P06, n, 'Mon', it0.slot_id).exercise_id, n));
    assert.ok(touched.every(w => w >= n), 'never an earlier week');
    const q = applyPlanEdits(P06, ed, model).plan;
    for (const w of P06.weeks) {
      const a = E.itemAt(P06, w.n, 'Mon', it0.slot_id), b = E.itemAt(q, w.n, 'Mon', it0.slot_id);
      if (!a) continue;
      assert.equal(b.sets, touched.includes(w.n) ? a.sets + 1 : a.sets, `week ${w.n}`);
    }
    assert.equal(q.weeks[n - 1].total_resistance_sets, P06.weeks[n - 1].total_resistance_sets + 1, 'the week\'s total follows');
  });

  it('CX-02: Sets - never goes under 1 set (a line already at 1 makes no edit)', () => {
    const it0 = strengthFirst(P06, 'Mon');
    const one = applyPlanEdits(P06, [{ op: 'set_sets', weekday: 'Mon', slot_id: it0.slot_id, sets: 1 }], model).plan;
    assert.deepEqual(E.tuneEdits(one, 1, 'Mon', it0.slot_id, -1), []);
    const two = E.tuneEdits(P06, 1, 'Mon', it0.slot_id, -1);
    assert.ok(two.every(e => e.sets >= 1));
  });

  it('CX-04: a set above the per-exercise top is allowed and shows as a friendly info line, never refused', () => {
    const it0 = strengthFirst(P06, 'Mon');
    let p = P06;
    for (let k = 0; k < 4; k++) p = applyPlanEdits(p, E.tuneEdits(p, 1, 'Mon', it0.slot_id, 1), model).plan;
    const res = applyPlanEdits(p, [], model);
    const base = applyPlanEdits(P06, [], model).conflicts.map(E.conflictKey);
    const fresh = E.newConflicts(res.conflicts, base);
    assert.ok(fresh.some(c => c.code === 'sets_above_max'));
    for (const lang of ['en', 'es']) {
      const c = E.conflictLines(fresh, p, model, lang, (k, a) => ui(lang, k, a), 1);
      assert.ok(c.lines.length >= 1);
      const name = model.t(lang, it0.name_key);
      assert.ok(c.lines.some(l => l.includes(name)), c.lines.join(' | '));
      for (const l of c.lines) assert.doesNotMatch(l, /\{\w+\}|undefined|NaN|edit\.c\./);
    }
  });

  it('CX-04: removing a line shows "This week: Back: 3 sets (plan: ...) · also weeks 2-4" lines, the shown week first, other weeks grouped', () => {
    const it0 = strengthFirst(P06, 'Mon');
    const ed = E.removeEdits(P06, 1, 'Mon', it0.slot_id);
    assert.deepEqual(ed, [{ op: 'remove_exercise', weekday: 'Mon', slot_id: it0.slot_id, weeks: E.sameLineWeeks(P06, 'Mon', it0.slot_id, it0.exercise_id) }]);
    const r = applyPlanEdits(P06, ed, model);
    for (const n of ed[0].weeks) assert.equal(E.itemAt(r.plan, n, 'Mon', it0.slot_id), null);
    const fresh = E.newConflicts(r.conflicts, applyPlanEdits(P06, [], model).conflicts.map(E.conflictKey));
    const c = E.conflictLines(fresh, r.plan, model, 'en', (k, a) => ui('en', k, a), 1, 3);
    const g = model.t('en', 'group.' + it0.group);
    assert.ok(c.lines[0].startsWith('This week: ' + g + ': '), c.lines[0]);
    assert.match(c.lines[0], /sets \(plan: \d+(\.\d+)?\)( · also weeks? [0-9, -]+)?$/);
    assert.ok(c.lines.length <= 3);
    assert.equal(E.weekList([3, 4, 5, 9, 11, 12]), '3-5, 9, 11-12');
  });

  it('R4-LIB-04 / G-312: Swap makes one swap_exercise for every week that holds the same exercise in that line', () => {
    const it0 = strengthFirst(P06, 'Mon');
    const ed = E.swapEdits(P06, 1, 'Mon', it0.slot_id, it0.swaps[0]);
    assert.deepEqual(ed, [{ op: 'swap_exercise', weekday: 'Mon', slot_id: it0.slot_id, exercise_id: it0.swaps[0], weeks: E.sameLineWeeks(P06, 'Mon', it0.slot_id, it0.exercise_id) }]);
    assert.deepEqual(E.swapEdits(P06, 1, 'Mon', it0.slot_id, it0.exercise_id), [], 'the same exercise is no edit');
    // the day card row carries the line's slot, so the page can find it again (plan-view.js)
    const card = V.dayCard(P06, model, 'en', 1, 'Mon');
    const row = card.blocks.flatMap(b => b.items).find(r => r.slot_id === it0.slot_id);
    assert.ok(row && row.swaps.length === it0.swaps.filter(id => model.hasEx(id)).length && row.swaps[0].keeps);
  });

  it('R4-SES-04 / R3-SES-02: Add puts a library exercise on that day in every week; a block switch covers every week', () => {
    const add = E.addEdits(P06, 'Tue', 'cable-fly', 'accessories', 3);
    assert.equal(add.length, 1);
    assert.deepEqual(add[0].weeks, E.editableWeeks(P06, 'Tue'));
    const q = applyPlanEdits(P06, add, model).plan;
    for (const n of add[0].weeks) assert.ok(itemsOf(q.weeks[n - 1].days.find(d => d.weekday === 'Tue')).some(x => x.exercise_id === 'cable-fly' && x.sets === 3 && x.origin === 'edit'));
    const { kinds, def } = E.addBlocks(P06, 1, 'Tue', model, 'cable-fly');
    assert.ok(kinds.includes('accessories') && !kinds.includes('warmup') && !kinds.includes('cooldown'));
    assert.ok(kinds.includes(def));
    const sw = E.blockSwitches(P06, 1, 'Mon');
    assert.ok(sw.some(s => s.kind === 'core' && s.on), 'the core block can be switched off (H05: the person switches it, never the engine)');
    const off = E.blockEdits(P06, 'Mon', 'core', false);
    const r = applyPlanEdits(P06, off, model).plan;
    assert.ok(r.weeks.every(w => { const d = w.days.find(x => x.weekday === 'Mon'); return !d || d.blocks.filter(b => b.kind === 'core').every(b => b.on === false); }));
    assert.deepEqual(E.blockEdits(P06, 'Mon', 'core', true), [], 'already on: no edit');
    assert.deepEqual(E.blockSwitches(r, 1, 'Mon').find(s => s.kind === 'core'), { kind: 'core', on: false });
  });

  it('R4-LIB-05: every exercise row carries its YouTube search (the ▶ button); after a swap or an add it is the new exercise\'s', () => {
    const SEARCH = model.rules.render.video.search_url;
    for (const lang of ['en', 'es']) {
      const card = V.dayCard(P06, model, lang, 1, 'Mon');
      const rows = card.blocks.flatMap(b => b.items).filter(r => r.exercise_id);
      assert.ok(rows.length > 5);
      for (const r of rows) {
        const it = E.itemAt(P06, 1, 'Mon', r.slot_id);
        if (!it || !it.video || !it.video.url) continue;
        assert.ok(r.video && r.video.startsWith(SEARCH), `${r.slot_id}: ${r.video}`);
        assert.equal(r.video, SEARCH + encodeURIComponent(model.t('en', model.ex(r.exercise_id).name_key)));
      }
      assert.ok(ui(lang, 'plan.play', { name: 'X' }).includes('X'));
    }
    assert.equal(ui('es', 'plan.play', { name: 'Remo' }), 'Ver videos de Remo');
    const it0 = strengthFirst(P06, 'Mon');
    const sw = applyPlanEdits(P06, E.swapEdits(P06, 1, 'Mon', it0.slot_id, it0.swaps[0]), model).plan;
    const row = V.dayCard(sw, model, 'en', 1, 'Mon').blocks.flatMap(b => b.items).find(r => r.slot_id === it0.slot_id);
    assert.equal(row.video, SEARCH + encodeURIComponent(model.t('en', model.ex(it0.swaps[0]).name_key)));
    const ad = applyPlanEdits(P06, E.addEdits(P06, 'Mon', 'cable-fly', 'accessories', 3), model).plan;
    const added = V.dayCard(ad, model, 'en', 1, 'Mon').blocks.flatMap(b => b.items).find(r => r.exercise_id === 'cable-fly');
    assert.equal(added.video, SEARCH + encodeURIComponent(model.t('en', model.ex('cable-fly').name_key)));
  });

  it('a test, a WOD or a cardio line is not edited from the card', () => {
    assert.equal(E.canEdit({ slot_id: 'x', exercise_id: 'y', role: 'test' }), false);
    assert.equal(E.canEdit({ slot_id: 'x', exercise_id: 'y', wod: {} }), false);
    assert.equal(E.canTune({ slot_id: 'x', exercise_id: 'y', sets: 3, circuit: { rounds: 3 } }), false);
    assert.equal(E.canTune({ slot_id: 'x', exercise_id: 'y', sets: 3 }), true);
  });
});

describe('app editing: the Add exercise library (app/edit-ui.js libraryPool / searchLibrary)', () => {
  const pool = E.libraryPool(P06, model, 'en');
  const ids = new Set(pool.map(x => x.id));

  it('R4-LIB-01 / H01: optional add-ons yes; proposed records, neck work, not-selectable rows, tests, cardio colours and bands never', () => {
    assert.ok(pool.length > 150, String(pool.length));
    assert.ok(pool.some(x => x.addon), 'optional add-ons are listed');
    for (const ex of model.exercises()) {
      if (!ids.has(ex.id)) continue;
      assert.ok(!['proposed_v1', 'proposed_v1_1', 'live_library_not_selectable'].includes(ex.status), ex.id);
      assert.notEqual(ex.primary_muscle, 'neck');
      assert.ok(['exercise', 'drill'].includes(ex.kind), ex.id);
      assert.doesNotMatch(ex.id + ' ' + model.t('en', ex.name_key), /\bband(s|ed)?\b|\bchains?\b|releaser/i);
      assert.ok(ex.equipment.any_of.some(su => su.every(tk => P06.meta.derived.D8_kit.tokens.includes(tk))), `${ex.id} fits the kit`);
    }
    assert.ok(!pool.some(x => /neck/.test(x.id)));
  });

  it('EQ: a home plan lists no machine and no barbell-only exercise; H12: a 60+ plan never lists the never-list', () => {
    const home = JSON.parse(JSON.stringify(P06));
    home.meta.derived.D8_kit = { profile: 'HOME_DB', tokens: ['dumbbell', 'floor', 'bench', 'weight_bench'], machines: [] };
    const hp = E.libraryPool(home, model, 'en');
    assert.ok(hp.length > 20 && hp.length < pool.length);
    for (const x of hp) { const ex = model.ex(x.id); assert.equal(ex.equipment.machine, null, x.id); }
    const old = JSON.parse(JSON.stringify(P06));
    old.meta.derived.age = 67;
    const op = E.libraryPool(old, model, 'en');
    for (const x of op) { const ex = model.ex(x.id); assert.notEqual(ex.older_ok, false, x.id); assert.ok(!(ex.tags || []).some(tg => model.rules.population.older.never_tags.includes(tg)), x.id); }
    assert.ok(op.length < pool.length);
  });

  it('the search: every word, accents ignored, names that start with it first; empty shows the plan\'s offered add-ons', () => {
    const r = E.searchLibrary(pool, 'curl', P06, 12);
    assert.ok(r.length > 3 && r.length <= 12 && r.every(x => /curl/i.test(x.name)));
    const es = E.libraryPool(P06, model, 'es');
    const sr = E.searchLibrary(es, 'bíceps', P06, 50), sr2 = E.searchLibrary(es, 'biceps', P06, 50);
    assert.deepEqual(sr.map(x => x.id), sr2.map(x => x.id));
    assert.ok(sr.length > 0);
    const two = E.searchLibrary(pool, 'cable row', P06, 50);
    assert.ok(two.length && two.every(x => /cable/i.test(x.name) && /row/i.test(x.name)));
    const offered = (P06.meta.addons || []).map(a => a.exercise_id);
    assert.deepEqual(E.searchLibrary(pool, '', P06, 50).map(x => x.id).sort(), offered.filter(id => ids.has(id)).sort());
  });
});

describe('app editing: history, words and product rules', () => {
  it('Undo last / Undo all go back step by step and to the generated plan', () => {
    let h = E.newHistory(P06);
    assert.equal(E.current(h), P06);
    const a = applyPlanEdits(P06, E.tuneEdits(P06, 1, 'Mon', strengthFirst(P06, 'Mon').slot_id, 1), model);
    h = E.pushStep(h, { plan: a.plan, conflicts: a.conflicts });
    const b = applyPlanEdits(a.plan, E.removeEdits(a.plan, 1, 'Mon', strengthFirst(a.plan, 'Mon').slot_id), model);
    h = E.pushStep(h, { plan: b.plan, conflicts: b.conflicts });
    assert.equal(E.current(h), b.plan);
    assert.equal(E.current(E.undoLast(h)), a.plan);
    assert.equal(E.current(E.undoAll(h)), P06);
    assert.equal(E.current(E.undoLast(E.undoLast(E.undoLast(h)))), P06);
  });

  it('H14: every edit word in English and Spanish, the same placeholders; the page uses no missing key', () => {
    const keys = Object.keys(STRINGS.en).filter(k => k.startsWith('edit.'));
    assert.ok(keys.length >= 40);
    for (const k of keys) assert.ok(STRINGS.es[k] && STRINGS.es[k] !== STRINGS.en[k], `${k}: Spanish words of its own`);
    const src = ['main.js', 'edit-ui.js'].map(f => fs.readFileSync(path.join(ROOT, 'app', f), 'utf8')).join('\n');
    for (const m of src.matchAll(/\bt\('(edit\.[a-z_.]+)'/g)) assert.ok(STRINGS.en[m[1]] && STRINGS.es[m[1]], m[1]);
    for (const m of src.matchAll(/'(edit\.c\.[a-z_]+)'/g)) assert.ok(STRINGS.en[m[1]] && STRINGS.es[m[1]], m[1]);
    for (const k of ['block.core', 'block.accessories', 'block.short.core', 'group.back']) for (const l of ['en', 'es']) assert.ok(model.has(l, k), k);
  });

  it('R3-GEN-01: edits live in page memory only - no storage, no network in the editing code; Safari 15 safe', () => {
    const src = fs.readFileSync(path.join(ROOT, 'app', 'edit-ui.js'), 'utf8');
    assert.doesNotMatch(src, /localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|sendBeacon|document\.cookie/);
    const main = fs.readFileSync(path.join(ROOT, 'app', 'main.js'), 'utf8');
    const editPart = main.slice(main.indexOf('// ---- editing') >= 0 ? main.indexOf('// ---- editing') : main.indexOf('editing (COACH-CX'), main.indexOf('the progress tab\n'));
    assert.ok(editPart.length > 1000);
    assert.doesNotMatch(editPart, /localStorage|sessionStorage|indexedDB|fetch\(|sendBeacon/);
    for (const f of ['edit-ui.js', 'main.js', 'plan-view.js', 'worker.js', 'pdf.js']) {
      const code = fs.readFileSync(path.join(ROOT, 'app', f), 'utf8').split('\n').filter(l => !/^\s*(\/\/|\*)/.test(l)).join('\n');
      assert.doesNotMatch(code, /\(\?<[=!]/, f + ': lookbehind');
      assert.doesNotMatch(code, /\.at\(\s*-?\d|\bObject\.hasOwn\s*\(|\bstructuredClone\s*\(|\.(toSorted|toReversed|findLast)\s*\(/, f);
    }
  });
});
