// Blaze Camp engine 0.6 - volume targets and set placement (the round-4 coach-eye reviews, reviews/coach-eye-r4/0*.md): one test per
// rule the package added, named with the coach answer it reads. Every plan here is generated in the test - no stored plan is read.
//   layer   tools/fixture/v06-volume.mjs is pure and idempotent; every rule section names its answers; EN + ES words
//   VOL-07  main lift first (G-100); athletes' flat press at most 4 sets (G-101); the main leg lift before the paired press (G-114)
//   R3-VOL-03  the optional day's bonus is for small groups (G-102 / G-103), never a pattern the day before trained (G-104), and with
//           no optional day it goes on a training day that trains the group (G-105)
//   R4-SES-03  2 days: the band is held on the training days (G-106)
//   CX-04   every capped group is said up front and is a summary shortfall (G-107)
//   VOL-01  a physique plan's first week leaves its first lifts a step (G-108 / G-111)
//   CX-02 / R4-PRG-03  one step an exercise a week; the change lines name the real difference (G-109)
//   CX-03   a circuit over its top is said (G-110)
//   UNI-02  an upper body at maintenance (G-112); R4-SES-02 the class tops (G-113); VOL-18 the presses held for the pulls (G-115)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { amendRulesV06, amendSportV06, UI_V06 } from '../tools/fixture/v06-volume.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BENCH_DIR = path.join(ROOT, 'design', 'bench', 'intakes');
const EPS = 1e-9;
const clone = (x) => JSON.parse(JSON.stringify(x));
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const WD7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const model = loadCompiledModel() || loadFixtureModel();
const raw = loadCompiledModel() ? readModelDir() : readFixtureRaw();
const R = model.rules, PX3 = R.placement.x3, VX3 = R.volume.x3;
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const bench = (nn) => JSON.parse(fs.readFileSync(path.join(BENCH_DIR, fs.readdirSync(BENCH_DIR).find(f => f.startsWith(nn + '-'))), 'utf8'));
const benchOf = (nn) => { if (!plans.has('B' + nn)) plans.set('B' + nn, generate(bench(nn), model)); return plans.get('B' + nn); };
const BENCH_SET = ['04', '06', '18', '19', '34', '46', '62', '64', '90'];
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const stair = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const codes = (p) => p.meta.warnings.map(w => w.code);
const lineClass = (g) => (R.muscles.lines.order.filter(l => R.muscles.lines.defs[l].group === g).some(l => R.muscles.lines.defs[l].class === 'big') ? 'big' : 'small');
/** sets of one slot week by week (null when absent) */
const series = (p, slotId) => p.weeks.map(w => { const x = itemsOf(w).find(y => y.it.slot_id === slotId && y.it.role !== 'test'); return x ? x.it.sets : null; });
/** the group an item's sets belong to: its exercise's prime mover group */
const primeGroup = (it) => { const e = ex(it.exercise_id); if (!e) return null; const cr = e.credits || {}; return R.muscles.groups.order.find(g => (R.muscles.groups.members[g] || []).some(m => (cr[m] || 0) >= 1 - EPS)) || null; };

describe('v0.6 volume - the amendment layer', () => {
  it('amendRulesV06 / amendSportV06 do not change their input and are idempotent on the built model; the compiled model equals the fixture', () => {
    const fx = readFixtureRaw();
    const r0 = clone(fx.rules);
    const r1 = amendRulesV06(fx.rules);
    assert.deepEqual(fx.rules, r0);
    assert.deepEqual(r1, fx.rules, 'the fixture already carries the layer');
    assert.deepEqual(raw.rules.placement.x3, fx.rules.placement.x3);
    assert.deepEqual(raw.rules.volume.x3, fx.rules.volume.x3);
    for (const s of Object.values(fx.profiles.sports)) assert.deepEqual(amendSportV06(s, null), s, s.id);
  });
  it('every new rule section names its coach answers; the words are in English and Spanish', () => {
    for (const [k, sec] of Object.entries(PX3)) if (sec && typeof sec === 'object' && !Array.isArray(sec)) assert.ok(Array.isArray(sec.refs) && sec.refs.length, 'placement.x3.' + k + ': refs');
    for (const [k, sec] of Object.entries(VX3)) if (sec && typeof sec === 'object' && !Array.isArray(sec)) assert.ok(Array.isArray(sec.refs) && sec.refs.length, 'volume.x3.' + k + ': refs');
    for (const [k, v] of Object.entries(UI_V06)) { assert.equal(v.length, 2, k); assert.ok(v[0] && v[1], k); assert.equal(model.t('en', k), v[0], k); assert.equal(model.t('es', k), v[1], k); }
  });
  it('UNI-02 (G-112): the profiles that keep the upper body at maintenance carry the flag (soccer, sprinters), the others do not', () => {
    const sp = model.rules && raw.profiles.sports;
    assert.equal(sp.soccer.upper_maintenance, true);
    assert.equal(sp.track_sprinter.upper_maintenance, true);
    assert.ok(!sp.american_football_lb || !sp.american_football_lb.upper_maintenance);
    assert.equal(amendSportV06({ id: 'x' }, { resistance: { avoid: ['upper-body hypertrophy volume beyond maintenance'] } }).upper_maintenance, true);
    assert.equal(amendSportV06({ id: 'x' }, { resistance: { avoid: ['heavy bench volume (punching) beyond maintenance'] } }).upper_maintenance, undefined);
  });
});

describe('v0.6 volume - VOL-07 main lift first (reviews 01 / 02 / 03 M2)', () => {
  it('VOL-07 (G-100, 01): the swimmer\'s front squat - the A day\'s main two-leg lift - takes a 4th set by week 8 (it sat at 3 for 9 weeks)', () => {
    const p = planOf('01');
    const fs1 = series(p, 'Mon.S1.s10');
    assert.ok(fs1.slice(0, 8).some(n => n >= 4), 'front squat ' + fs1.join(' '));
  });
  it('VOL-07 (G-100, 03): the midfielder\'s only heavy squat climbs (3 -> 4 by week 4) and the day keeps the coach\'s staircase', () => {
    const p = planOf('03');
    const s = series(p, 'Mon.S1.s10');
    assert.ok(s[3] >= 4 && s[5] >= 4, 'front squat ' + s.join(' '));
    for (const w of stair(p)) for (const d of w.days.filter(x => x.kind === 'main')) {
      // a later exercise of the group never above an earlier one that still has room (VOL-07)
      const its = itemsOf({ days: [d] }).filter(x => x.it.exercise_id && x.it.sets && x.b.kind === 'strength' && x.it.role !== 'test' && primeGroup(x.it) === 'quads');
      for (let i = 1; i < its.length; i++) assert.ok(its[i].it.sets <= its[0].it.sets, `w${w.n} ${d.weekday}: ${its.map(x => x.it.sets).join('/')}`);
    }
  });
  it('R4-SES-05 (G-114, 03): on the B day the hex-bar deadlift holds at least the barbell bench\'s sets by the last off-season week', () => {
    const p = planOf('03');
    const last = stair(p).filter(w => w.training_block === 1).pop();
    const at = (slot) => itemsOf(last).find(x => x.it.slot_id === slot && x.it.role !== 'test').it.sets;
    assert.ok(at('Fri.S3.s07') >= at('Fri.S3.s06'), `hex ${at('Fri.S3.s07')} vs bench ${at('Fri.S3.s06')}`);
  });
  it('VOL-07 (G-101, 02 / 03): an athlete\'s flat press holds at most 4 sets in every week (the DB bench ran to 5)', () => {
    const AP = PX3.athlete_press_max;
    assert.equal(AP.max, 4);
    for (const n of ['01', '02', '03']) for (const w of stair(planOf(n))) for (const x of itemsOf(w)) {
      const e = ex(x.it.exercise_id);
      if (!e || x.it.role === 'test' || !AP.credit_classes.includes(e.credit_class) || e.tags.includes('mid_range_push') || !x.it.sets) continue;
      assert.ok(x.it.sets <= AP.max, `${n} w${w.n} ${x.d.weekday} ${e.id} ${x.it.sets}`);
    }
  });
  it('VOL-07 (G-101): a group with fewer than 3 exercises of its own keeps its press (the pitcher\'s one chest press is not held under the floor)', () => {
    const p = benchOf('34');
    const most = Math.max(...stair(p).flatMap(w => itemsOf(w).filter(x => x.it.slot_id === 'Tue.TUE.s08' && x.it.role !== 'test').map(x => x.it.sets)));
    assert.equal(most, 5);
  });
});

describe('v0.6 volume - R3-VOL-03 the optional day and the bonus exercise', () => {
  const all = () => [...Object.keys(NAMES).map(planOf), ...BENCH_SET.map(benchOf)];
  it('R3-VOL-03 (G-102): no plan puts a bonus or extra exercise of a big group (quads, hips, back, chest) on any day, but the class\'s second knee lift', () => {
    for (const p of all()) for (const w of p.weeks) for (const x of itemsOf(w)) {
      if (x.it.origin !== 'bonus' || !x.it.exercise_id || !x.it.sets) continue;
      const g = x.it.group;
      if (g === 'quads' && p.meta.family === 'hybrid_crossfit') continue;
      assert.equal(lineClass(g), 'small', `${p.meta.program_id || p.meta.template.id} w${w.n} ${x.d.weekday}: bonus ${x.it.exercise_id} (${g})`);
    }
  });
  it('R3-VOL-03 (G-102, 04 M2): the class member\'s chest no longer lives on the optional WOD day (the floor press 2 -> 4)', () => {
    const p = planOf('04');
    const sat = p.weeks.flatMap(w => w.days.filter(d => d.weekday === 'Sat').flatMap(d => itemsOf({ days: [d] })));
    assert.ok(!sat.some(x => x.it.origin === 'bonus' && x.it.group === 'chest' && x.it.sets));
  });
  it('R3-VOL-03 (G-103, 01 M2): the swimmer\'s optional day holds no big-group Focus exercise (the split squat after Friday\'s, the extra row)', () => {
    const p = planOf('01');
    for (const w of stair(p)) for (const d of w.days.filter(x => x.kind === 'optional')) for (const x of itemsOf({ days: [d] })) {
      if (!x.it.exercise_id || !x.it.sets || !['focus', 'accessories'].includes(x.b.kind)) continue;
      assert.notEqual(lineClass(primeGroup(x.it)), 'big', `w${w.n} ${d.weekday}: ${x.it.exercise_id}`);
    }
    assert.ok((p.meta.stairway[0].focus_closed || []).some(c => c.group === 'quads'));
  });
  it('R3-VOL-03 (G-104): a bonus exercise never repeats a compound pattern the training day before it trained', () => {
    const pats = PX3.bonus_no_repeat_previous_day.compound_patterns;
    for (const p of all()) for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'optional')) {
      const prev = w.days.find(x => x.weekday === WD7[(WD7.indexOf(d.weekday) + 6) % 7] && x.kind === 'main');
      if (!prev) continue;
      const prevPats = new Set(itemsOf({ days: [prev] }).filter(x => x.it.exercise_id && x.it.sets).map(x => (ex(x.it.exercise_id) || {}).pattern));
      for (const x of itemsOf({ days: [d] })) {
        if (x.it.origin !== 'bonus' || !x.it.exercise_id) continue;
        const pt = ex(x.it.exercise_id).pattern;
        assert.ok(!(pats.includes(pt) && prevPats.has(pt)), `w${w.n} ${d.weekday}: ${x.it.exercise_id} repeats ${pt}`);
      }
    }
  });
  it('R3-VOL-03 / CX-01 (G-105, 07 M1): with no optional day the biceps take a bonus curl on a pull day and reach their planned final sets', () => {
    const p = planOf('07');
    const st = p.meta.stairway[0];
    assert.ok(!(st.capped || []).some(c => c.group === 'biceps'), JSON.stringify(st.capped));
    const last = p.weeks[p.weeks.length - 1];
    assert.ok(last.weekly_sets_by_group.biceps >= st.planned_top.biceps - EPS, String(last.weekly_sets_by_group.biceps));
    const extra = itemsOf(p.weeks[0]).find(x => x.it.origin === 'bonus' && x.it.group === 'biceps');
    assert.ok(extra && ['Tue', 'Fri'].includes(extra.d.weekday) && extra.d.kind === 'main', 'a bonus curl on a pull day');
    // never the only biceps exercise of its day (R3-VOL-03)
    assert.ok(itemsOf({ days: [extra.d] }).filter(x => x.it.group === 'biceps' && x.it.sets).length >= 2);
    assert.ok(extra.d.exercise_count <= p.meta.session_size.range[1]);
  });
  it('R4-SES-03 (G-106, 08 M2): on 2 training days the training days hold the 6-8 band for the shoulders every week', () => {
    const p = planOf('08');
    for (const w of stair(p)) assert.ok(w.main_sets_by_group.shoulders >= R.volume.two_day.weekly_sets[0] - EPS, `w${w.n} ${w.main_sets_by_group.shoulders}`);
  });
});

describe('v0.6 volume - CX-04 a capped group is said (07 M1)', () => {
  it('CX-04 (G-107): every capped group carries notice: true, a summary shortfall and an up-front line (or the below-floor line)', () => {
    for (const p of [...Object.keys(NAMES).map(planOf), ...BENCH_SET.map(benchOf)]) for (const st of p.meta.stairway || []) for (const c of st.capped || []) {
      assert.equal(c.notice, true, c.group);
      assert.ok(p.summary.shortfalls.some(s => s.code === 'capped_by_template' && s.args.group === c.group && s.args.held === c.held), 'shortfall ' + c.group);
      assert.ok(p.meta.warnings.some(w => ['capped_by_template', 'below_floor_template'].includes(w.code) && w.args && w.args.group === c.group), 'notice ' + c.group);
    }
    const md = renderPlan(planOf('06'), model, { lang: 'en' });
    assert.match(md, /Back: this template holds 20 weekly sets, below the planned 25/);
  });
});

describe('v0.6 volume - VOL-01 the physique start (06 M1)', () => {
  it('VOL-01 (G-108 / G-111, 06): week 1 holds no compound above 4 sets and no isolation above 3 outside the Focus groups; the first back lift climbs', () => {
    const p = planOf('06');
    const focus = new Set(p.meta.targets.priority.map(l => R.muscles.lines.defs[l].group));
    for (const x of itemsOf(p.weeks[0])) {
      if (!x.it.exercise_id || !x.it.sets || x.it.role === 'test' || !['strength', 'accessories'].includes(x.b.kind) || x.d.kind !== 'main') continue;
      const g = primeGroup(x.it);
      if (!g || focus.has(g) || g === 'calves') continue;
      const iso = ex(x.it.exercise_id).exercise_class === 'isolation';
      assert.ok(x.it.sets <= (iso ? PX3.start_max_sets.isolation : PX3.start_max_sets.compound), `${x.d.weekday} ${x.it.exercise_id} ${x.it.sets}`);
    }
    const seal = series(p, 'Mon.A1.s05');
    assert.ok(seal[seal.length - 1] > seal[0], 'seal row ' + seal.join(' '));
    assert.equal(p.meta.targets.start.lats_upper_back, VX3.nonfocus_start.start);
    assert.ok(p.meta.targets.start.glutes >= 20, 'the Focus group keeps the higher start');
  });
  it('VOL-01 (G-111): a 6-day push / pull / legs plan keeps the level\'s start (the 4-day A / B template is the one that started at the top)', () => {
    assert.equal(planOf('07').meta.targets.start.quads, R.volume.start.quads.L3);
  });
});

describe('v0.6 volume - CX-02 / R4-PRG-03 one step an exercise, the real change (04 M2)', () => {
  it('CX-02 (G-109): every "+n sets" line names the item\'s real difference from the week before', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (let i = 1; i < p.weeks.length; i++) {
        const w = p.weeks[i], pw = p.weeks[i - 1];
        for (const c of w.changes || []) {
          if (!['changes.set_added', 'changes.sets_added_n'].includes(c.key)) continue;
          const a = itemsOf(w).find(x => x.it.slot_id === c.args.slot_id && x.it.role !== 'test'), b = itemsOf(pw).find(x => x.it.slot_id === c.args.slot_id && x.it.role !== 'test');
          if (!a || !b || w.exercise_block !== pw.exercise_block) continue;
          const want = c.key === 'changes.sets_added_n' ? c.args.n : 1;
          // (a test week replaces the tested lift's top set, R2-PER-07)
          if (w.test || pw.test) continue;
          assert.equal(a.it.sets - b.it.sets, want, `${n} w${w.n} ${c.args.slot_id}`);
        }
      }
    }
    assert.equal(model.t('en', 'changes.sets_added_n', { n: 2, exercise: 'X', day: 'Saturday' }), '+2 sets on X (Saturday)');
  });
});

describe('v0.6 volume - CX-03 a circuit above its top is said (05 M3)', () => {
  it('CX-03 (G-110, 05): the bootcamp\'s shoulders above their top of 18 are named in meta.stairway and up front, EN and ES', () => {
    const p = planOf('05');
    const st = p.meta.stairway[0];
    const o = (st.over_top || []).find(x => x.group === 'shoulders');
    assert.ok(o && o.top === 18 && o.held > 18, JSON.stringify(st.over_top));
    assert.ok(codes(p).includes('circuit_over_top'));
    assert.match(renderPlan(p, model, { lang: 'en' }), /above its usual top of 18/);
    assert.match(renderPlan(p, model, { lang: 'es' }), /por encima de su tope habitual de 18/);
  });
});

describe('v0.6 volume - the profile tops', () => {
  it('UNI-02 (G-112, 03 M2): the midfielder\'s chest and shoulders end one set above the floor', () => {
    const p = planOf('03');
    const st = p.meta.stairway[0];
    assert.equal(st.planned_top.chest, R.volume.floor.value + VX3.upper_maintenance.over_floor);
    assert.equal(st.planned_top.shoulders, R.volume.floor.value + VX3.upper_maintenance.over_floor);
    const w = stair(p).filter(x => x.training_block === 1).pop();
    assert.ok(w.weekly_sets_by_group.chest <= 11 + EPS && w.weekly_sets_by_group.chest >= R.volume.floor.value - EPS, String(w.weekly_sets_by_group.chest));
  });
  it('R4-SES-02 (G-113, 04 M1): the class member\'s arms and shoulders end near floor + 2, chest and back at 15 at most, no bonus for them; the quads reach 18', () => {
    const p = planOf('04');
    const st = p.meta.stairway[0];
    for (const g of ['biceps', 'triceps', 'shoulders']) assert.ok(st.planned_top[g] <= R.volume.floor.value + 2, g + ' ' + st.planned_top[g]);
    for (const g of ['chest', 'back']) assert.ok(st.planned_top[g] <= 15, g + ' ' + st.planned_top[g]);
    assert.deepEqual(st.capped, []);
    assert.equal(st.planned_top.quads, 18);
    const last = p.weeks[p.weeks.length - 1];
    assert.ok(last.weekly_sets_by_group.quads >= 18 - EPS);
    assert.ok(!p.weeks.some(w => itemsOf(w).some(x => x.it.origin === 'bonus' && ['biceps', 'triceps', 'shoulders', 'chest', 'back'].includes(x.it.group) && x.it.sets)));
  });
  it('VOL-18 (G-115, bench 18 / 19): with the back held at what the training days take, pulling never falls under 0.8 x pressing', () => {
    const PP = R.volume.push_pull;
    for (const nn of ['18', '19']) {
      const p = benchOf(nn);
      for (const w of stair(p)) {
        let push = 0, pull = 0;
        for (const x of itemsOf(w)) { const e = ex(x.it.exercise_id); if (!e || !x.it.sets || x.b.kind === 'circuit') continue; if (PP.push_classes.includes(e.credit_class)) push += x.it.sets; else if (PP.pull_classes.includes(e.credit_class)) pull += x.it.sets; }
        assert.ok(pull >= PX3.press_hold.min_pull_per_push * push - EPS, `bench ${nn} w${w.n}: pull ${pull} push ${push}`);
      }
    }
  });
  it('R4-SES-04 (G-116, 03): a training day\'s lift never runs at 1 set in the pre-season block', () => {
    const p = planOf('03');
    for (const w of p.weeks.filter(x => x.block_type === 'pre_season')) for (const x of itemsOf(w)) {
      if (x.d.kind !== 'main' || !['strength', 'accessories'].includes(x.b.kind) || !x.it.exercise_id || x.it.role === 'test' || !Object.keys(x.it.credits || {}).length) continue;
      assert.ok(x.it.sets >= 2, `w${w.n} ${x.d.weekday} ${x.it.exercise_id} ${x.it.sets}`);
    }
  });
});
