// tests/app-groups.test.mjs - the day card's segmentation (app/plan-view.js groupCard / groupHeader; coach, 2026-10-13: "each
// exercise ... boxed, and then each set or superset ... boxed itself, so people understand this is the segmentation of each one of
// the things I need to do today"). Supersets (2), trisets (3), giant sets (4+), circuits and WODs are one group with plain-words
// headers in EN and ES, A1 -> A2 labels and the rest said once; edits keep the grouping right; the PDF mirrors it.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCompiledModel } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { ui } from '../app/i18n.js';
import * as V from '../app/plan-view.js';
import * as E from '../app/edit-ui.js';
import { pdfDoc } from '../app/pdf.js';

const model = loadCompiledModel();
const sample = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'plans', name + '.json'), 'utf8'));
const intake = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'intakes', '06-full-body-aesthetics.json'), 'utf8'));
// a plan with supersets switched on (the engine's preference; the web tool's plans show circuits and WODs, and supersets when on)
const SS = generate({ ...intake, prefs: { ...(intake.prefs || {}), supersets_for_fatigue: true }, experience: { years_consistent: 0 } }, model);
const tr = (lang) => (k, a) => ui(lang, k, a);
const groupsOf = (card) => card.blocks.flatMap(b => b.groups || []);
const firstDay = (p) => p.weeks[0].days.find(d => d.kind === 'main').weekday;

describe('the day card groups the work (plan-view.js groupCard)', () => {
  it('supersets: one group each, lettered A, B ... across the day, rows A1 -> A2, the rest said once for the group', () => {
    assert.equal(SS.status, 'ok');
    const wd = firstDay(SS);
    const items = SS.weeks[0].days.find(d => d.weekday === wd).blocks.flatMap(b => b.items);
    const ids = [...new Set(items.filter(i => i.superset).map(i => i.superset))];
    assert.ok(ids.length >= 2, 'the plan holds supersets');
    for (const lang of ['en', 'es']) {
      const card = V.dayCard(SS, model, lang, 1, wd);
      const gs = groupsOf(card).filter(g => g.kind !== 'single');
      assert.equal(gs.length, ids.length);
      gs.forEach((g, k) => {
        assert.equal(g.label, 'ABCDEFGH'[k]);
        assert.deepEqual(g.rows.map(r => r.label), g.rows.map((r, q) => g.label + (q + 1)));
        assert.equal(g.kind, g.rows.length === 2 ? 'superset' : g.rows.length === 3 ? 'triset' : 'giant');
        assert.ok(g.rest && /^\d+(-\d+)? (s|min)$/.test(g.rest), g.rest);
        for (const r of g.rows) {
          assert.equal(r.superset_tag, '');
          assert.ok(!r.meta.some(m => /after the pair|después del par/i.test(m)), 'no rest on the rows: ' + r.meta.join(' | '));
        }
        const hd = V.groupHeader(g, tr(lang));
        assert.equal(hd.kind, lang === 'en' ? 'SUPERSET' : 'SUPERSERIE');
        assert.ok(hd.line.includes(g.label + '1 → ' + g.label + '2'));
        assert.ok(hd.line.includes('×' + g.rounds));
        assert.ok(hd.line.includes(g.rest));
        assert.doesNotMatch(hd.line + hd.note, /\{\w+\}|undefined|NaN/);
        if (g.rows.some(r => r.sets < g.rounds)) assert.ok(hd.note.length > 0, 'different sets are said simply');
      });
      assert.ok(groupsOf(card).some(g => g.kind === 'single'), 'straight exercises stay straight');
    }
  });

  it('a triset and a giant set by size; a superset left with one exercise is a straight exercise again (edits)', () => {
    const wd = firstDay(SS);
    const card0 = V.dayCard(SS, model, 'en', 1, wd);
    const g0 = groupsOf(card0).find(g => g.kind === 'superset' && g.rows.length === 2);
    // remove one exercise of the pair: the other is straight
    const rm = applyPlanEdits(SS, E.removeEdits(SS, 1, wd, g0.rows[1].slot_id), model).plan;
    const card1 = V.dayCard(rm, model, 'en', 1, wd);
    const left = groupsOf(card1).find(g => g.rows.some(r => r.slot_id === g0.rows[0].slot_id));
    assert.equal(left.kind, 'single');
    assert.equal(groupsOf(card1).filter(g => g.kind !== 'single').length, groupsOf(card0).filter(g => g.kind !== 'single').length - 1);
    // a swap inside the group keeps it in the group
    const it0 = E.itemAt(SS, 1, wd, g0.rows[0].slot_id);
    if (it0.swaps.length) {
      const sw = applyPlanEdits(SS, E.swapEdits(SS, 1, wd, it0.slot_id, it0.swaps[0]), model).plan;
      const g1 = groupsOf(V.dayCard(sw, model, 'en', 1, wd)).find(g => g.rows.some(r => r.slot_id === it0.slot_id));
      assert.equal(g1.kind, 'superset'); assert.equal(g1.rows[0].exercise_id, it0.swaps[0]);
    }
    // three and four in one id: a triset, a giant set
    for (const [n, kind, es] of [[3, 'triset', 'TRISERIE'], [4, 'giant', 'SERIE GIGANTE']]) {
      const p = JSON.parse(JSON.stringify(SS));
      const blk = p.weeks[0].days.find(d => d.weekday === wd).blocks.find(b => b.items.filter(i => i.exercise_id && typeof i.sets === 'number').length >= n && b.kind !== 'warmup');
      const list = blk.items.filter(i => i.exercise_id && typeof i.sets === 'number').slice(0, n);
      for (const it of blk.items) if (it.superset && !list.includes(it)) it.superset = null;
      for (const it of list) it.superset = 'T1';
      const g = groupsOf(V.dayCard(p, model, 'es', 1, wd)).find(x => x.rows.some(r => r.slot_id === list[0].slot_id));
      assert.equal(g.kind, kind); assert.equal(g.rows.length, n);
      assert.equal(V.groupHeader(g, tr('es')).kind, es);
    }
  });

  it('a bootcamp circuit: one group with every station, its rounds, work, change and rest between rounds', () => {
    const p = sample('05-bootcamp');
    const wd = firstDay(p);
    for (const lang of ['en', 'es']) {
      const card = V.dayCard(p, model, lang, 1, wd);
      const g = groupsOf(card).find(x => x.kind === 'circuit');
      const blk = p.weeks[0].days.find(d => d.weekday === wd).blocks.find(b => b.kind === 'circuit');
      assert.equal(g.rows.length, blk.items.length);
      const c = blk.items[0].circuit;
      assert.equal(g.rounds, c.rounds); assert.equal(g.work_s, c.work_s);
      assert.equal(g.rest, blk.items[0].rest.between_rounds_s % 60 === 0 && blk.items[0].rest.between_rounds_s >= 60 ? blk.items[0].rest.between_rounds_s / 60 + ' min' : blk.items[0].rest.between_rounds_s + ' s');
      const hd = V.groupHeader(g, tr(lang));
      assert.equal(hd.kind, c.format === 'stations' ? (lang === 'en' ? 'STATION BY STATION' : 'ESTACIÓN POR ESTACIÓN') : (lang === 'en' ? 'CIRCUIT' : 'CIRCUITO'));
      assert.match(hd.line, /A1 → A2/);
      assert.ok(hd.note.includes(String(c.work_s)));
    }
  });

  it('a class WOD: its stations are the group, A1 -> A2 -> A3, each with its YouTube search (R4-LIB-05); the header fits its format', () => {
    const p = sample('04-crossfit-style-bootcamp');
    const seen = new Set();
    for (const w of p.weeks) for (const d of w.days) {
      if (!['main', 'optional'].includes(d.kind)) continue;
      const card = V.dayCard(p, model, 'en', w.n, d.weekday);
      for (const g of groupsOf(card).filter(x => x.kind === 'wod')) {
        const it = E.itemAt(p, w.n, d.weekday, g.rows[0].slot_id);
        assert.equal(g.stations.length, it.wod.stations.length);
        g.stations.forEach((st, q) => {
          assert.equal(st.label, g.label + (q + 1));
          assert.equal(st.exercise_id, it.wod.stations[q]);
          assert.ok(!st.video || st.video.startsWith(model.rules.render.video.search_url));
        });
        const hd = V.groupHeader(g, tr('en'));
        seen.add(g.format);
        if (g.format === 'emom') assert.match(hd.line, /each minute/);
        if (g.format === 'amrap') assert.match(hd.line, /then again/);
        assert.doesNotMatch(hd.line, /\{\w+\}|undefined/);
      }
    }
    assert.ok(seen.size >= 2, [...seen].join(','));
    assert.equal(V.groupSeq(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7']), 'A1 → A2 → … → A7');
  });

  it('the PDF mirrors it: a header band per group and its rows on the rail; straight exercises numbered 1, 2 ...', () => {
    const t = (k, a) => ui('es', k, a);
    const doc = pdfDoc(sample('05-bootcamp'), model, 'es', t);
    const rows = doc.weeks[0].days.flatMap(d => d.blocks.flatMap(b => b.rows));
    const head = rows.find(r => r.head);
    assert.ok(head && /CIRCUITO/.test(head.head) && /A1 (→|->) A2/.test(head.head), head && head.head);
    assert.ok(rows.some(r => r.in && r.n === 'A1'));
    assert.ok(rows.some(r => !r.in && !r.head && r.n === '1.'));
  });
});
