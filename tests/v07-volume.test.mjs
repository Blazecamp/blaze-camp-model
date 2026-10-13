// Blaze Camp engine 0.7 - volume package: credits, set placement and circuit rounds from the coach's round-5 answers
// (coach_answers_round5.md) and the round-8 coach-eye bonus-timing minor (reviews/coach-eye-r8/01-swimming.md m2,
// 06-full-body-aesthetics.md m1). One describe per rule, named with the coach answer it reads. Every plan here is generated in the
// test - no stored plan is read. Decisions: engine/DECISIONS.md G-230 ... G-249.
//   R5-VOL-01  a high-incline press counts 1.0 chest, 0.25 front delts, 0.25 triceps (G-230)
//   R5-VOL-07  a light chest exercise may sit on the optional day right after a press day; 06 chest reaches 25 (G-231)
//   R5-VOL-09  the athlete's flat-press cap of 4 is the default; a chest Focus may go to the level's per-exercise top (G-232)
//   R5-VOL-10  racket players 50+ keep the calf raise on both training days; that day holds one more exercise, said (G-233)
//   R5-CLS-03  circuit rounds climb in thirds (3 / 4 / 5); the plan says people adjust (G-234)
//   R5-VOL-11  a one-set shortfall: the day's first lift of the group takes one extra set in the last block (G-235)
//   R5-ATH-12  the week's heavy hinge starts at 3 sets and takes its group's next set first (G-236)
//   R5-CLS-07  no group starts at its top number (G-237)
//   R8 bonus   a bonus comes in the week its group's template lifts are at their tops (G-238)
//   R5-VOL-02 / 03 / 04 confirmations kept (G-239)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir } from './helpers/models.mjs';
import { loadModel } from '../engine/model.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { roundsByThird } from '../engine/shape.mjs';

const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const model = loadCompiledModel() || loadFixtureModel();
const R = model.rules;
const plans = new Map(), mds = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const mdOf = (n, lang = 'en') => { const k = n + lang; if (!mds.has(k)) mds.set(k, renderPlan(planOf(n), model, { lang })); return mds.get(k); };
const unesc = (s) => s.replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1');
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(itemsOf);
const series = (p, slotId) => p.weeks.map(w => { const x = itemsOf(w).find(y => y.it.slot_id === slotId && y.it.role !== 'test' && !/\.test$/.test(y.it.slot_id)); return x ? x.it.sets : null; });
const withTest = (p, slotId) => p.weeks.map(w => itemsOf(w).filter(y => y.it.slot_id === slotId || y.it.slot_id === slotId + '.test').reduce((a, y) => a + (y.it.sets || 0), 0));
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const GM = { hips: ['glutes', 'hamstrings'], back: ['lats_upper_back'], shoulders: ['front_delts', 'side_delts', 'rear_delts'] };
const inGroup = (it, g) => Object.entries(it.credits || {}).some(([m, c]) => c >= 1 - EPS && (m === g || (GM[g] || []).includes(m)));
const lastWeek = (p) => p.weeks[p.weeks.length - 1];
const validOk = (p) => p.status === 'ok' && p.validation.ok;
const failing = (p) => (p.validation.checks || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + JSON.stringify((c.violations || []).slice(0, 2)));

describe('R5-VOL-01 (G-230): a high-incline press counts 1.0 chest, 0.25 front delts, 0.25 triceps', () => {
  it('the credit class and every high-incline press record carry the coach\'s numbers; chest is the prime mover', () => {
    assert.deepEqual(R.credit.classes.MRPUSH, { chest: 1, front_delts: 0.25, triceps: 0.25 });
    for (const id of ['high-incline-db-press', 'high-incline-seated-barbell-press', 'high-incline-seated-db-press']) {
      const e = ex(id);
      assert.equal(e.credit_class, 'MRPUSH', id);
      assert.deepEqual(e.credits, { chest: 1, front_delts: 0.25, triceps: 0.25 }, id);
      assert.equal(e.primary_muscle, 'chest', id);
      assert.ok(e.rule_refs.includes('R5-VOL-01'), id);
    }
  });
  it('07: the push day\'s high-incline press credits a full chest set in the plan, and the plan is valid', () => {
    const p = planOf('07');
    const hi = allItems(p).filter(x => ex(x.it.exercise_id) && ex(x.it.exercise_id).credit_class === 'MRPUSH' && x.it.role !== 'test');
    assert.ok(hi.length > 0, 'a high-incline press is planned');
    for (const { it } of hi) assert.deepEqual(it.credits, { chest: 1, front_delts: 0.25, triceps: 0.25 });
    assert.ok(validOk(p), failing(p).join(' '));
  });
  it('the swap line says what a high-incline press keeps: the upper-chest press (EN + ES)', () => {
    assert.equal(model.t('en', 'swap.keeps.MRPUSH'), 'the upper-chest press');
    assert.equal(model.t('es', 'swap.keeps.MRPUSH'), 'el press de pecho superior');
  });
});

describe('R5-VOL-07 (G-231): a light chest exercise on the optional day, even right after a press day', () => {
  it('the rule is on, for chest, a fly or a machine press', () => {
    const L = R.placement.x7.light_chest_optional;
    assert.ok(L.enabled && L.groups.includes('chest') && L.credit_classes.includes('ISO_CHEST'));
    assert.ok(L.refs.includes('R5-VOL-07'));
  });
  it('06: chest reaches its final 25 sets (was held at 23); no group is capped but the arms', () => {
    const p = planOf('06');
    const st = p.meta.stairway[0];
    assert.equal(st.planned_top.chest, 25);
    assert.equal(st.group_top.chest, 25);
    assert.ok(!(st.capped || []).some(c => c.group === 'chest'), JSON.stringify(st.capped));
    assert.ok(lastWeek(p).weekly_sets_by_group.chest >= 25 - EPS);
    assert.ok(validOk(p), failing(p).join(' '));
  });
  it('06: a chest exercise on an optional day that follows a press day is a fly or a machine press and says why', () => {
    const p = planOf('06');
    const L = R.placement.x7.light_chest_optional;
    let seen = 0;
    for (const w of p.weeks) for (const x of itemsOf(w)) {
      if (x.d.kind !== 'optional' || x.it.origin !== 'bonus' || x.it.group !== 'chest' || !(x.it.sets > 0)) continue;
      seen++;
      const e = ex(x.it.exercise_id);
      const light = L.credit_classes.includes(e.credit_class) || (L.machine_press.credit_classes.includes(e.credit_class) && e.tags.some(t => L.machine_press.tags.includes(t)));
      assert.ok(light, x.it.exercise_id);
      assert.ok((x.it.why || []).some(y => y.key === 'why.light_chest_optional' && y.ref === 'R5-VOL-07'), 'why on ' + x.it.slot_id);
    }
    assert.ok(seen > 0, 'a light chest bonus on an optional day');
  });
});

describe('R5-VOL-09 (G-232): the athlete\'s flat-press cap of 4 is the default; a chest Focus may go higher', () => {
  // a 3-day linebacker with no optional day's room left: a chest Focus asks for more sets than three presses at 4 hold
  const raw = () => { const r = readModelDir() ? JSON.parse(JSON.stringify(readModelDir())) : null; return r; };
  const build = (focus, ruleOn) => {
    const r = raw();
    if (!r) return null;
    r.rules.volume.focus.add_default = 6; r.rules.volume.focus.add_range = [1, 8];
    r.rules.placement.x7.athlete_press_focus.enabled = ruleOn;
    const i = loadSample(NAMES['02']);
    const intake = { ...i, priority_muscles: focus, prefs: { ...i.prefs, optional_days: 'add_on' }, schedule: { ...i.schedule, days_per_week: 3, weekdays: ['Mon', 'Wed', 'Fri'] } };
    return generate(intake, loadModel(r));
  };
  const maxPress = (p) => Math.max(...allItems(p).filter(x => x.d.kind === 'main' && ex(x.it.exercise_id) && ex(x.it.exercise_id).credit_class === 'HPUSH' && !/\.test$/.test(x.it.slot_id)).map(x => x.it.sets));
  it('with chest a Focus muscle a flat press reaches the level\'s per-exercise top (5 at L3); with the rule off it holds 4', (t) => {
    const on = build(['chest'], true), off = build(['chest'], false);
    if (!on) { t.skip('no compiled model'); return; }
    assert.ok(validOk(on), failing(on).join(' '));
    assert.equal(maxPress(on), R.levels && R.levels.L3 && R.levels.L3.max_sets_per_exercise ? R.levels.L3.max_sets_per_exercise : 5);
    assert.equal(maxPress(off), R.placement.x3.athlete_press_max.max);
  });
  it('02 (no Focus): no flat press passes 4 except the one-set shortfall\'s lift (R5-VOL-11) in the last exercise block', () => {
    const p = planOf('02');
    const ebLast = lastWeek(p).exercise_block;
    for (const x of allItems(p)) {
      const e = ex(x.it.exercise_id);
      if (!e || e.credit_class !== 'HPUSH' || x.d.kind !== 'main' || /\.test$/.test(x.it.slot_id) || x.it.sets <= 4) continue;
      assert.equal(x.w.exercise_block, ebLast, x.it.slot_id + ' week ' + x.w.n);
      assert.ok((p.meta.stairway[0].one_set_shortfall || []).some(s => s.slot_id === x.it.slot_id), x.it.slot_id);
    }
  });
});

describe('R5-VOL-10 (G-233): racket players 50+ keep the calf raise on both training days; that day holds one more exercise', () => {
  it('08: a calf raise on Monday and Thursday every week; calves climb to 8 (were held at 4)', () => {
    const p = planOf('08');
    for (const w of p.weeks) for (const d of w.days.filter(d => d.kind === 'main')) {
      assert.ok(d.blocks.some(b => b.items.some(it => it.bucket === 'ISO_CALF' && it.sets > 0)), d.weekday + ' week ' + w.n);
    }
    assert.equal(p.meta.stairway[0].group_top.calves, 8);
    assert.ok(validOk(p), failing(p).join(' '));
  });
  it('08: the day that keeps both holds one exercise above the size range, says why, and V13 reads it', () => {
    const p = planOf('08');
    const RC = R.session.x7.racket_calf_both_days;
    const max = p.meta.session_size.range[1];
    const days = p.weeks[0].days.filter(d => (d.why || []).some(y => y.key === RC.why_key));
    assert.ok(days.length >= 1);
    for (const d of days) assert.ok(d.exercise_count <= max + RC.size_plus, d.weekday + ' ' + d.exercise_count);
    assert.ok(R.validation.v05.size_plus_whys.includes(RC.why_key));
    const v13 = p.validation.checks.find(c => c.id === 'V13');
    assert.ok(v13 && v13.pass);
    const w = p.meta.warnings.find(x => x.code === 'racket_calf_both_days');
    assert.ok(w && w.args.days.length === days.length);
  });
  it('08: the plan says so up front, EN and ES', () => {
    assert.ok(unesc(mdOf('08', 'en')).includes('Calf raises stay on both training days for Achilles care (racket players 50+)'));
    assert.ok(unesc(mdOf('08', 'es')).includes('La elevación de talones se queda en los dos días de entrenamiento'));
  });
  it('a 45-year-old pickleball player is not under the rule (the arm slot still takes the calf raise\'s place)', () => {
    const i = loadSample(NAMES['08']);
    const p = generate({ ...i, age: 45 }, model);
    assert.ok(p.status === 'ok');
    assert.ok(!p.meta.warnings.some(x => x.code === 'racket_calf_both_days'));
  });
});

describe('R5-CLS-03 (G-234): circuit rounds climb with the plan in thirds; people adjust', () => {
  it('the thirds: 12 weeks 3 / 4 / 5 in weeks 1-4 / 5-8 / 9-12; 8 weeks 3-3-3 / 4-4-4 / 5-5; a held plan keeps the middle third\'s rounds', () => {
    const r = R.supersets.bootcamp.x7.rounds_by_third.rounds;
    assert.deepEqual(r, [3, 4, 5]);
    assert.deepEqual([...Array(12).keys()].map(i => roundsByThird(r, 12, i + 1)), [3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]);
    assert.deepEqual([...Array(8).keys()].map(i => roundsByThird(r, 8, i + 1)), [3, 3, 3, 4, 4, 4, 5, 5]);
    assert.deepEqual([...Array(6).keys()].map(i => roundsByThird(r, 6, i + 1)), [3, 3, 4, 4, 5, 5]);
    assert.deepEqual([...Array(8).keys()].map(i => roundsByThird(r, 8, i + 1, true)), [3, 3, 3, 4, 4, 4, 4, 4]);
  });
  it('05 (8 weeks): the stations run 3 / 4 / 5 rounds by thirds, and every circuit item holds the week\'s rounds', () => {
    const p = planOf('05');
    assert.deepEqual(p.weeks.map(w => w.circuit && w.circuit.rounds), [3, 3, 3, 4, 4, 4, 5, 5]);
    for (const w of p.weeks) for (const x of itemsOf(w)) if (x.b.kind === 'circuit' && typeof x.it.sets === 'number' && x.it.sets > 0) assert.equal(x.it.sets, w.circuit.rounds, x.it.slot_id + ' week ' + w.n);
    assert.ok(validOk(p), failing(p).join(' '));
  });
  it('05: the plan says the rounds are a guide, and names the groups under the floor in the first third (H17), EN and ES', () => {
    const p = planOf('05');
    assert.ok(p.meta.warnings.some(w => w.code === 'circuit_rounds_thirds' && w.args.from === 3 && w.args.to === 5));
    const fl = p.meta.warnings.find(w => w.code === 'circuit_rounds_floor');
    assert.ok(fl && fl.args.week === 4 && fl.args.rounds === 3);
    assert.ok(!p.meta.warnings.some(w => w.code === 'below_floor_template'), 'no "this template holds" line for a first-third dip');
    const en = unesc(mdOf('05', 'en')), es = unesc(mdOf('05', 'es'));
    assert.ok(en.includes('Circuit rounds climb with the plan, one more round each third of the block (3 to 5 rounds).'));
    assert.ok(en.includes('weeks 1-3 run 3 rounds a station'));
    assert.ok(es.includes('Las rondas del circuito suben con el plan'));
    assert.ok(es.includes('las semanas 1-3 llevan 3 rondas por estación'));
  });
});

describe('R5-VOL-11 (G-235): a one-set shortfall - the day\'s first lift of the group takes one more set in the last block', () => {
  it('02: chest reaches its final 13 of 13 (was held at 12), not capped', () => {
    const p = planOf('02');
    const st = p.meta.stairway[0];
    assert.equal(st.group_top.chest, 13);
    assert.ok(!(st.capped || []).some(c => c.group === 'chest'));
    assert.ok(lastWeek(p).weekly_sets_by_group.chest >= 13 - EPS);
    assert.ok(validOk(p), failing(p).join(' '));
  });
  it('02: the extra set is on the first training day\'s first press (Tuesday\'s bench), only in the last exercise block, never above the level\'s top', () => {
    const p = planOf('02');
    const os = p.meta.stairway[0].one_set_shortfall || [];
    assert.equal(os.length, 1);
    assert.equal(os[0].group, 'chest');
    const slot = os[0].slot_id;
    assert.ok(/^Tue\./.test(slot), slot);
    const day = p.weeks[0].days.find(d => d.weekday === 'Tue');
    const firstChest = day.blocks.flatMap(b => b.items).find(it => inGroup(it, 'chest') && !/\.test$/.test(it.slot_id));
    assert.equal(firstChest.slot_id, slot);
    const s = withTest(p, slot), ebLast = lastWeek(p).exercise_block;
    p.weeks.forEach((w, i) => { if (s[i] > R.placement.x3.athlete_press_max.max) assert.equal(w.exercise_block, ebLast, 'week ' + w.n); });
    assert.ok(Math.max(...s) <= 5);
    assert.ok(Math.max(...s) === R.placement.x3.athlete_press_max.max + 1);
  });
});

describe('R5-ATH-12 (G-236): the week\'s heavy hinge starts at 3 sets and takes its group\'s next set ahead of the other hip lifts', () => {
  it('02: Friday\'s RDL holds 3 sets in week 1 and takes the hips\' first added set (3 -> 4) before any other hip lift takes its 3rd', () => {
    const p = planOf('02');
    const rdl = allItems(p).find(x => x.d.weekday === 'Fri' && x.it.exercise_id === 'stiff-leg-deadlift-rdl');
    assert.ok(rdl, 'the RDL');
    const s = series(p, rdl.it.slot_id);
    assert.equal(s[0], R.placement.x7.heavy_hinge_lead.start_sets);
    const k = s.findIndex(v => v >= 4);
    assert.ok(k > 0, 'the RDL takes a 4th set');
    for (const x of allItems(p)) {
      if (x.it.slot_id === rdl.it.slot_id || x.d.kind !== 'main' || !inGroup(x.it, 'hips') || /\.test$/.test(x.it.slot_id)) continue;
      const i = p.weeks.indexOf(x.w);
      if (x.it.sets >= 3 && series(p, x.it.slot_id)[0] < 3) assert.ok(i >= k, x.it.exercise_id + ' takes its 3rd set in week ' + x.w.n + ' before the RDL\'s 4th (week ' + (k + 1) + ')');
    }
    assert.ok(validOk(p), failing(p).join(' '));
  });
});

describe('R5-CLS-07 (G-237): no group starts at its top number', () => {
  it('every stairway group of the 8 samples (calves and a pain-held group aside) starts below its top', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const st of p.meta.stairway) for (const g of st.groups || []) {
        if (g === 'calves') continue;
        if ((p.meta.pain || p.intake_pain || []).length && n === '08' && g === 'quads') continue; // the knee-pain plan's quads (pain rule)
        assert.ok(st.group_start[g] < st.group_top[g], n + ' ' + g + ' ' + st.group_start[g] + ' -> ' + st.group_top[g]);
      }
    }
  });
  it('05 bootcamp: the shoulders start below their top of 18 (13.5 at 3 rounds; were 18 from week 1)', () => {
    const p = planOf('05');
    assert.ok(p.weeks[0].weekly_sets_by_group.shoulders < 18 - EPS, String(p.weeks[0].weekly_sets_by_group.shoulders));
  });
  it('04 class member: the shoulders start under their class top (11 -> 12)', () => {
    const st = planOf('04').meta.stairway[0];
    assert.ok(st.group_start.shoulders < st.group_top.shoulders);
    assert.ok(R.volume.x7.start_below_top.refs.includes('R5-CLS-07'));
  });
});

describe('Round-8 coach-eye minor (G-238): a bonus comes in the week its group\'s template lifts are at their tops', () => {
  const BONUS = ['why.bonus_main_day', 'why.bonus_optional_day'];
  const check = (p) => {
    const rows = allItems(p).filter(x => x.it.credits && Object.keys(x.it.credits).length);
    const setsAt = (slot, w) => rows.filter(x => x.w === w && (x.it.slot_id === slot || x.it.slot_id === slot + '.test')).reduce((a, x) => a + x.it.sets, 0);
    const bad = [];
    for (const r of rows.filter(r => r.it.origin === 'bonus' && BONUS.includes(((r.it.why || [])[0] || {}).key) && r.it.sets > 0)) {
      const first = rows.filter(x => x.it.slot_id === r.it.slot_id && x.it.sets > 0).sort((a, b) => a.w.n - b.w.n)[0];
      if (first !== r) continue;
      for (const t of rows.filter(x => x.w === r.w && x.d.kind === 'main' && x.it.origin !== 'bonus' && inGroup(x.it, r.it.group) && !/\.test$/.test(x.it.slot_id))) {
        const top = Math.max(...rows.filter(x => x.w.exercise_block === r.w.exercise_block && x.it.slot_id === t.it.slot_id).map(x => setsAt(x.it.slot_id, x.w)));
        if (setsAt(t.it.slot_id, r.w) < top) bad.push(`week ${r.w.n}: ${r.it.exercise_id} while ${t.it.exercise_id} ${setsAt(t.it.slot_id, r.w)} < ${top}`);
      }
    }
    return bad;
  };
  it('no sample opens a bonus while a template lift of its group is under its top in that exercise block', () => {
    for (const n of Object.keys(NAMES)) assert.deepEqual(check(planOf(n)), [], n);
  });
  it('01: the incline press takes its 4th set (week 9) before the Saturday fly comes in (week 11)', () => {
    const p = planOf('01');
    const inc = allItems(p).find(x => x.it.exercise_id === 'incline-db-bench-press');
    const fly = allItems(p).find(x => x.d.kind === 'optional' && x.it.group === 'chest' && x.it.origin === 'bonus' && x.it.sets > 0);
    const kInc = series(p, inc.it.slot_id).findIndex(v => v >= 4);
    const kFly = series(p, fly.it.slot_id).findIndex(v => v > 0);
    assert.ok(kInc >= 0 && kFly > kInc, kInc + ' ' + kFly);
    assert.ok(p.meta.warnings.some(w => w.code === 'acceleration' ? true : true));
  });
  it('06: both A-day pulldowns hold 5 sets before the optional-day row comes in', () => {
    const p = planOf('06');
    const row = allItems(p).find(x => x.d.kind === 'optional' && x.it.group === 'back' && x.it.origin === 'bonus' && x.it.sets > 0);
    const k = p.weeks.indexOf(row.w);
    for (const x of itemsOf(p.weeks[k]).filter(y => y.d.kind === 'main' && /pulldown/.test(y.it.exercise_id))) assert.equal(x.it.sets, 5, x.it.exercise_id);
    assert.ok(row.w.n > p.weeks.find(w => w.exercise_block === row.w.exercise_block).n, 'not the exercise block\'s first week');
  });
  it('the week a bonus comes in is printed by its up-front line', () => {
    const md = unesc(mdOf('06', 'en'));
    assert.ok(/Chest: .*from week \d+/.test(md) || /Chest: \d+ of its 25 final sets/.test(md), 'chest bonus line');
  });
});

describe('R5-VOL-02 / 03 / 04 (G-239): confirmations kept - all adjustable', () => {
  it('R5-VOL-02: pulling at or above pressing in every sample week (a press may lead by one set)', () => {
    for (const n of Object.keys(NAMES)) for (const w of planOf(n).weeks) {
      const b = w.weekly_sets_by_group.back || 0, c = w.weekly_sets_by_group.chest || 0;
      assert.ok(b >= c - 1 - EPS, n + ' week ' + w.n + ': back ' + b + ' chest ' + c);
    }
  });
  it('R5-VOL-03: the physique plans hold at least 8 side-delt sets at L3 (06, 07)', () => {
    for (const n of ['06', '07']) assert.ok((lastWeek(planOf(n)).weekly_sets_by_muscle.side_delts || 0) >= 8 - EPS, n);
  });
  it('R5-VOL-04: 06\'s A days hold a biceps exercise and its B days a triceps exercise', () => {
    const w = planOf('06').weeks[0];
    for (const d of w.days.filter(d => d.kind === 'main')) {
      const m = /^A/.test(d.day_type) ? 'biceps' : 'triceps';
      assert.ok(d.blocks.some(b => b.items.some(it => (it.credits || {})[m] === 1 && it.origin !== 'bonus')), d.weekday + ' ' + m);
    }
  });
});
