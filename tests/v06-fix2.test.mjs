// Blaze Camp engine 0.6 - fix round on the round-5 coach-eye reviews (reviews/coach-eye-r5/*.md): one test per rule, named with the
// coach answer it reads. Every plan here is generated in the test - no stored plan is read. Decisions: engine/DECISIONS.md G-200..G-219.
//   CH5-02     a group with its own arm-slot exercise is never called credit-only (G-202), EN and ES
//   R4-SES-03  2 days: the 6-8 band is for the big groups; the arms sit at 2-3 sets in slot 5; the shoulders take the optional place (G-200)
//   VOL-07 / R3-VOL-03  the day's main two-leg lift leads; the twin exposures alternate (G-201)
//   CH5-03     a big group's optional-day sets are said (G-204)
//   R4-PRG-04  no weekly table number prints above the planned final sets (G-203)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';

const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const model = loadCompiledModel() || loadFixtureModel();
const R = model.rules;
const plans = new Map(), mds = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const mdOf = (n, lang = 'en') => { const k = n + lang; if (!mds.has(k)) mds.set(k, renderPlan(planOf(n), model, { lang })); return mds.get(k); };
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const series = (p, slotId) => p.weeks.map(w => { const x = itemsOf(w).find(y => y.it.slot_id === slotId && y.it.role !== 'test'); return x ? x.it.sets : null; });
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const groupOfEx = (id) => { const e = ex(id); if (!e) return null; const cr = e.credits || {}; return R.muscles.groups.order.find(g => (R.muscles.groups.members[g] || []).some(m => (cr[m] || 0) >= 1 - EPS)) || null; };
const directOf = (w, g) => (R.muscles.groups.members[g] || [g]).reduce((a, m) => a + ((w.direct_sets_by_muscle || {})[m] || 0), 0);
const t = (lang, k) => model.t(lang, k);

describe('CH5-02 (G-202): a group with its own arm-slot exercise is not called credit-only', () => {
  for (const n of ['01', '02', '03']) it(n + ': the arms are held at their slot, said so in EN and ES; no "no exercise of its own"', () => {
    const p = planOf(n);
    const st = p.meta.stairway[0];
    assert.deepEqual(st.held_groups, ['biceps', 'triceps']);
    for (const w of p.weeks.filter(x => x.block_type === 'stairway')) for (const g of ['biceps', 'triceps']) assert.ok(directOf(w, g) > 0, n + ' week ' + w.n + ' ' + g);
    assert.ok(!p.meta.warnings.some(w => w.code === 'credit_only_groups'), 'no credit-only notice for a group with direct sets');
    assert.ok(p.meta.warnings.some(w => w.code === 'slot_held_groups' && w.args.group.includes('biceps') && w.args.group.includes('triceps')));
    for (const lang of ['en', 'es']) {
      const md = mdOf(n, lang);
      assert.ok(!md.includes('| ' + t(lang, 'ui.plan.final_credit_only') + ' |'), lang + ': no "no exercise of its own" in the tables');
      assert.ok(!md.includes(t(lang, 'warning.credit_only_groups_lifts').split('{')[0]) && !md.includes(t(lang, 'warning.credit_only_groups').split('{')[0]), lang + ': no "trained through ... (no extra sets)"');
      for (const g of ['biceps', 'triceps']) {
        const row = md.split('\n').find(l => l.startsWith('| ' + t(lang, 'group.' + g) + ' | '));
        assert.ok(row && !/\| - \(/.test(row), lang + ' ' + g + ': the table prints the real sets: ' + row);
      }
      assert.ok(md.includes(t(lang, 'warning.slot_held_groups').split(':')[1].trim().slice(0, 20)), lang + ': the held line');
    }
  });
  it('every sample: a group named credit-only has no direct set in the block; a held group has some', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const st of p.meta.stairway || []) {
        const ws = p.weeks.filter(w => w.training_block === st.training_block && w.block_type === 'stairway');
        const named = p.meta.warnings.filter(w => w.code === 'credit_only_groups').flatMap(w => w.args.group);
        for (const g of named) assert.ok(ws.every(w => directOf(w, g) <= EPS), n + ' ' + g + ' named credit-only with direct sets');
        for (const g of st.held_groups || []) assert.ok(ws.some(w => directOf(w, g) > EPS), n + ' ' + g);
      }
    }
  });
});

describe('R4-SES-03 (G-200): 2 days - the band is for the big groups, the arms sit in slot 5 at 2-3 sets', () => {
  it('08: no arm exercise above 3 sets, no arm bonus, the arms never above their final sets; the shoulders end at what the training days hold', () => {
    const p = planOf('08');
    const A = R.placement.x3.two_day_arm_slot;
    assert.deepEqual(A.sets, [2, 3]);
    const st = p.meta.stairway[0];
    for (const w of p.weeks) for (const { it } of itemsOf(w)) {
      const g = groupOfEx(it.exercise_id);
      if (!['biceps', 'triceps'].includes(g) || typeof it.sets !== 'number') continue;
      assert.notEqual(it.origin, 'bonus', 'no arm bonus exercise (week ' + w.n + ')');
      assert.ok(it.sets >= 2 && it.sets <= 3, it.exercise_id + ' week ' + w.n + ': ' + it.sets);
    }
    for (const g of ['biceps', 'triceps']) {
      for (const w of p.weeks) assert.ok(w.weekly_sets_by_group[g] < st.group_top[g] + 1 - EPS, g + ' week ' + w.n);
      assert.ok(st.group_top[g] <= R.volume.two_day.weekly_sets[0], g + ' final ' + st.group_top[g] + ' under the big groups\' band');
    }
    // (G-207, converted: the training days hold the shoulders at the band and the optional-day fly is extra - final 9, 7 of them on
    // Monday + Thursday; converted again in the round-7 fix round, G-221: a group the training days hold inside the band takes no bonus -
    // the shoulders' final sets are the 7 Monday + Thursday hold, not capped, and the optional day holds no bonus for anyone)
    assert.equal(st.group_top.shoulders, 7);
    assert.ok(p.weeks[p.weeks.length - 1].weekly_sets_by_group.shoulders >= 7 - EPS);
    assert.ok(!(st.capped || []).some(c => c.group === 'shoulders'), 'shoulders not capped');
    assert.ok(!(st.bonus || []).some(b => b.group === 'shoulders'), 'no optional-day shoulder bonus');
    assert.ok(!(st.bonus || []).some(b => ['biceps', 'triceps'].includes(b.group)));
    // the big groups keep the 6-set band on the training days
    for (const w of p.weeks) for (const g of ['quads', 'hips', 'back', 'chest']) assert.ok(w.main_sets_by_group[g] >= 6 - EPS, g + ' week ' + w.n);
  });
});

describe('VOL-07 / R3-VOL-03 (G-201): the main two-leg lift leads its day; the two exposures alternate', () => {
  it('02: no later hips lift of Friday takes its 3rd set while the RDL (the week\'s heavy hinge) is under 3', () => {
    const p = planOf('02');
    const rdl = series(p, 'Fri.B2.s09');
    const fri = p.weeks[1].days.find(d => d.weekday === 'Fri').blocks.flatMap(b => b.items);
    assert.equal(ex(fri.find(i => i.slot_id === 'Fri.B2.s09').exercise_id).spine_class, 'counted');
    for (const sid of ['Fri.B2.s11', 'Fri.B2.s12']) series(p, sid).forEach((x, i) => assert.ok(!(x >= 3 && rdl[i] < 3), sid + ' week ' + (i + 1)));
  });
  it('every sample: on a training day the main two-leg lift holds 3 sets before a later lift of its group takes its 3rd', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const w of p.weeks.filter(x => x.block_type === 'stairway' && !x.test)) for (const d of w.days.filter(x => x.kind === 'main')) {
        const its = d.blocks.flatMap(b => b.items).filter(i => typeof i.sets === 'number' && i.exercise_id && i.role !== 'test');
        const work = its.find(i => i.role === 'work' && ex(i.exercise_id) && ex(i.exercise_id).spine_class === 'counted');
        if (!work || work.sets >= 3) continue;
        const g = groupOfEx(work.exercise_id);
        const later = its.slice(its.indexOf(work) + 1).filter(i => groupOfEx(i.exercise_id) === g && i.origin !== 'bonus');
        assert.ok(!later.some(i => i.sets >= 3), n + ' week ' + w.n + ' ' + d.weekday + ': ' + work.exercise_id + ' at ' + work.sets + ' behind ' + later.map(i => i.exercise_id + ' ' + i.sets).join(', '));
      }
    }
  });
  it('06: the B days\' two hip lifts alternate - the hex-bar deadlift takes a step too', () => {
    const p = planOf('06');
    const hex = series(p, 'Fri.B2.s06');
    assert.ok(Math.max(...hex) > hex[0], 'hex-bar deadlift ' + hex.join(' '));
  });
});

describe('CH5-03 (G-204): a big group\'s optional-day sets are said up front', () => {
  it('06: the back\'s optional-day bonus sets are named, EN and ES', () => {
    const p = planOf('06');
    const bonus = p.meta.stairway[0].bonus.filter(b => b.group === 'back');
    assert.ok(bonus.length >= 1);
    const en = mdOf('06', 'en').split('\n').find(l => l.startsWith('- ' + t('en', 'group.back') + ':') && l.includes('optional days'));
    assert.ok(en && /\b5 of its 25 final sets/.test(en), en);
    const es = mdOf('06', 'es').split('\n').find(l => l.includes('días opcionales') && l.startsWith('- ' + t('es', 'group.back')));
    assert.ok(es, 'ES line');
  });
  it('a plan whose big groups need no optional day prints no such line for them (02, 08)', () => {
    // (G-208, converted: every group with optional-day sets is now said - 08's shoulders - so the line is read on the big groups)
    for (const n of ['02', '08']) for (const g of ['quads', 'hips', 'back', 'chest']) assert.ok(!mdOf(n).split('\n').some(l => l.startsWith('- ' + t('en', 'group.' + g) + ':') && /final sets sit on your optional day/.test(l)), n + ' ' + g);
  });
});

describe('R4-PRG-04 (G-203): a weekly table never prints a number above the planned final sets', () => {
  it('every sample: the week-by-week rows stay at or under their final sets', () => {
    for (const n of Object.keys(NAMES)) {
      const md = mdOf(n);
      const lines = md.split('\n');
      let inTable = false;
      for (const l of lines) {
        if (l.startsWith('| ' + t('en', 'ui.plan.col.group') + ' |')) { inTable = true; continue; }
        if (!l.startsWith('|')) { inTable = false; continue; }
        if (!inTable || l.startsWith('|---') || l.startsWith('| **')) continue;
        const cells = l.split('|').map(x => x.trim()).filter(Boolean);
        const fin = Number(cells[cells.length - 1]);
        if (!Number.isFinite(fin)) continue;
        const nums = cells[1].split(/[ ·]+/).filter(Boolean).map(Number);
        assert.ok(nums.every(x => x <= fin), n + ': ' + l);
      }
    }
  });
  it('07: chest prints 27 in week 12, its final sets (27.5 in the plan JSON)', () => {
    const p = planOf('07');
    const w12 = p.weeks[p.weeks.length - 1];
    assert.ok(w12.weekly_sets_by_group.chest > 27 && w12.weekly_sets_by_group.chest < 28);
    const row = mdOf('07').split('\n').find(l => l.startsWith('| ' + t('en', 'group.chest') + ' | ') && l.includes('·'));
    assert.ok(row && !/\b28\b/.test(row), row);
  });
});
