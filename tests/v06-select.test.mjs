// Blaze Camp engine 0.6 - selection, templates and week layout (the round-4 coach-eye reviews, reviews/coach-eye-r4/): one test per
// rule the package added, named with the coach answer it reads. Every plan here is generated in the test - no stored plan is read.
//   layer   tools/fixture/v06-select.mjs is pure and idempotent, and each new rule section names its coach answers
//   01 / 02 R4-SES-05 the arm slot of the athletic A / B days (G-130); CH5-02 on every athletic A / B day (G-198)
//   02      R2-SES-03 / PER-02 the core of a healthy athlete with a low-back hot spot (G-131)
//   03      R2-ATH-03 / CAT-13 single-leg and lateral jumps from the first block (G-132); the hard eve (G-136); CH5-01 practices not counted, one line (G-197)
//   05      OT06 / PRG-03 the bootcamp's cardio station (G-135)
//   07      R2-LIB-01 / PER-02 / PER-04 one-detail block changes, one seal row a week (G-134)
//   02      T3-ATH-02 the plyo share after the never-a-drop pass (G-139)
//   08      EQ-03 / ATH-10 no snatch and no barbell power lift for the 52-year-old beginner with knee pain (G-133)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { loadModel } from '../engine/model.mjs';
import { renderPlan } from '../engine/render.mjs';
import { amendRulesS6, amendTemplatesS6, amendExerciseS6, UI_S6, ARM_SLOT } from '../tools/fixture/v06-select.mjs';
import { makeContext, scorePlan, SCORER_VERSION } from '../design/bench/score.mjs';

const clone = (x) => JSON.parse(JSON.stringify(x));
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const WD7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const model = loadCompiledModel() || loadFixtureModel();
const raw = loadCompiledModel() ? readModelDir() : readFixtureRaw();
const R = model.rules;
const S6 = R.selection.s6;
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const uni = (e) => !!e && (e.laterality === 'unilateral' || e.laterality === 'alternating');
const lateral = (id) => /(^|-)(lateral|side|skater|cossack|zig-zag)(-|$)/.test(id);

describe('v0.6 selection - the amendment layer', () => {
  it('amendRulesS6 / amendTemplatesS6 / amendExerciseS6 do not change their input, are idempotent on the built model, and the compiled model carries the layer', () => {
    const fx = readFixtureRaw();
    const r0 = clone(fx.rules), t0 = clone(fx.templates.families);
    const r1 = amendRulesS6(fx.rules), t1 = amendTemplatesS6(fx.templates.families);
    assert.deepEqual(fx.rules, r0); assert.deepEqual(fx.templates.families, t0);
    assert.deepEqual(r1, fx.rules, 'the fixture already carries the layer'); assert.deepEqual(t1, fx.templates.families);
    for (const e of fx.catalog.exercises) assert.deepEqual(amendExerciseS6(e), e, e.id);
    assert.deepEqual(raw.rules.selection.s6, fx.rules.selection.s6);
    assert.deepEqual(raw.rules.conditioning.s6, fx.rules.conditioning.s6);
  });
  it('every new rule section names its coach answers and says what is PROPOSED; the words are in English and Spanish', () => {
    for (const [name, sec] of [['selection.s6', S6], ['selection.s6.core', S6.core], ['selection.s6.jumps', S6.jumps], ['selection.s6.olympic_safe', S6.olympic_safe], ['selection.s6.block_change', S6.block_change], ['selection.s6.circuit_cardio_first', S6.circuit_cardio_first], ['conditioning.s6.practice', R.conditioning.s6.practice], ['conditioning.s6.hard_eve', R.conditioning.s6.hard_eve]]) {
      assert.ok(sec && Array.isArray(sec.refs) && sec.refs.length > 0, name + ': refs');
      assert.ok(typeof sec.status === 'string' && sec.status.length > 0, name + ': status');
    }
    for (const [k, v] of Object.entries(UI_S6)) { assert.equal(v.length, 2, k); assert.ok(v[0] && v[1], k); assert.equal(model.t('en', k), v[0], k); assert.equal(model.t('es', k), v[1], k); }
  });
});

describe('v0.6 selection - R4-SES-05 slot 5 on the athletic A / B days (01 M1, 02 M1)', () => {
  // (converted, COACH-CH5 CH5-02 'all should have it and be adjustable always' - DECISIONS G-198: the in-season variant takes the slot
  // too; it stays the day's last rank and the engine keeps it on a full day in place of the last isolation accessory)
  it('CH5-02: every athletic A / B day type, the in-season variant too, holds slot 5 (biceps A, triceps B), ranked last and printed before the leg extension / leg curl', () => {
    assert.equal(S6.arm_slot.every_athletic_day, true);
    assert.ok(S6.arm_slot.refs.includes('CH5-02'));
    const fam = model.templates.families.athletic;
    let n = 0, inSeason = 0;
    for (const t of Object.values(fam.days)) {
      const lists = [['base', t.day_types], ...Object.entries(t.variants || {}).map(([vn, v]) => [vn, v.day_types])];
      for (const [vn, dts] of lists) for (const def of Object.values(dts || {})) {
        const b = ARM_SLOT[def.skeleton];
        if (!b) continue;
        const st = def.stations.find(s => s.bucket === b);
        assert.ok(st, `${vn} ${def.skeleton}: no ${b}`); n++; if (vn === 'in_season') inSeason++;
        assert.equal(st.condition, 'if_athletic_arm_sets');
        const counted = def.stations.filter(s => typeof s.rank === 'number' && s.rank < 99).map(s => s.rank);
        assert.equal(st.rank, Math.max(...counted), 'the arm slot is the first thing to remove (R4-SES-04)');
        const iso = def.stations.findIndex(s => s.bucket === (b === 'ISO_BICEP' ? 'ISO_QUAD' : 'ISO_LEG_FLEXION'));
        if (iso >= 0) assert.ok(def.stations.indexOf(st) < iso, 'slot 5 prints before slot 6');
      }
    }
    assert.ok(n >= 10 && inSeason >= 2, `${n} day types, ${inSeason} in season`);
    // a full day keeps the slot in place of its last isolation accessory, and says so (a stated reason for V30 and the scorer)
    assert.equal(S6.arm_slot.full_day, 'replace_last_accessory');
    assert.ok(R.validation.v05.skeleton.absent_ok_whys.includes('why.arm_slot'));
  });
  it('R4-SES-05 (01, 02): the swimmer\'s and the linebacker\'s A days hold a biceps exercise and their B days a triceps exercise in every week, inside the field-athlete count of 12', () => {
    for (const k of ['01', '02']) {
      const p = planOf(k);
      assert.equal(p.status, 'ok'); assert.equal(p.validation.ok, true, k);
      for (const w of p.weeks) for (const d of w.days) {
        if (d.kind !== 'main' || !ARM_SLOT[d.skeleton]) continue;
        const items = d.blocks.flatMap(b => b.items);
        assert.ok(items.some(it => it.bucket === ARM_SLOT[d.skeleton] && it.exercise_id && it.sets >= 2), `${k} w${w.n} ${d.weekday} ${d.skeleton}: no ${ARM_SLOT[d.skeleton]}`);
        assert.ok(d.exercise_count <= 12, `${k} w${w.n} ${d.weekday}: count ${d.exercise_count}`);
      }
    }
  });
  // (converted, COACH-CH5 CH5-02 - DECISIONS G-198: the soccer midfielder and the stay-active adult were kept on his athletic sheet with no
  // arm isolation; every athletic A / B day now holds slot 5)
  it('CH5-02 (03, 08): every A / B training day of the soccer midfielder and of the stay-active adult holds slot 5 in every week, inside the day\'s exercise count', () => {
    for (const k of ['03', '08']) {
      const p = planOf(k);
      assert.equal(p.status, 'ok'); assert.equal(p.validation.ok, true, k);
      for (const w of p.weeks) for (const d of w.days) {
        if (d.kind !== 'main' || !ARM_SLOT[d.skeleton]) continue;
        const items = d.blocks.flatMap(b => b.items);
        assert.ok(items.some(it => it.bucket === ARM_SLOT[d.skeleton] && it.exercise_id && it.sets >= 2), `${k} w${w.n} ${d.weekday} ${d.skeleton}: no ${ARM_SLOT[d.skeleton]}`);
        assert.ok(d.exercise_count <= p.meta.session_size.range[1], `${k} w${w.n} ${d.weekday}: count ${d.exercise_count}`);
      }
    }
  });
  it('CH5-02 (in season): an in-season athlete\'s A / B days hold slot 5 too', () => {
    const i = loadSample(NAMES['02']);
    i.sport.season = { type: 'in_season_until', date: '2027-01-15' };
    const p = generate(i, model);
    assert.equal(p.status, 'ok');
    let n = 0;
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main' || !ARM_SLOT[d.skeleton]) continue;
      n++;
      assert.ok(d.blocks.flatMap(b => b.items).some(it => it.bucket === ARM_SLOT[d.skeleton] && it.exercise_id), `w${w.n} ${d.weekday} ${d.day_type}`);
    }
    assert.ok(n > 0, 'the in-season plan has A / B days');
  });
});

describe('v0.6 selection - R2-SES-03 core of a healthy athlete (02 M3)', () => {
  const lowBackList = /^(plank-forearm-low-plank|side-plank-elbow|dead-bugs|bird-dogs|copenhagen-plank)$/;
  it('R2-SES-03 (02): a linebacker with no pain is not on the low-back list - his main days hold a rotational or anti-rotation drill and core that is not on the list', () => {
    const p = planOf('02');
    assert.ok(model.sport('football_big_skill').injuries.some(c => /LOW_BACK/.test(c)), 'the profile names a low-back hot spot');
    for (const w of p.weeks.filter(x => x.block_type === 'stairway')) {
      const core = itemsOf(w).filter(x => x.b.kind === 'core' && x.d.kind === 'main' && x.it.exercise_id);
      assert.ok(core.some(x => ['transverse', 'multi'].includes(ex(x.it.exercise_id).plane)), `w${w.n}: no transverse / anti-rotation drill on a main day`);
      assert.ok(core.some(x => !lowBackList.test(x.it.exercise_id)), `w${w.n}: only the low-back list`);
    }
  });
  it('R2-SES-03 / VOL-03: the same linebacker who reports low-back pain is on the low-back list (anti-movement drills, no trunk flexion or rotation)', () => {
    const i = loadSample(NAMES['02']);
    i.pain = [{ area: 'lower_back', side: 'both', severity: 'mild', worse_with: [] }];
    const p = generate(i, model);
    assert.equal(p.status, 'ok');
    const avoid = new RegExp(R.selection.f3.core_low_back.avoid_re);
    for (const x of allItems(p)) if (x.b.kind === 'core' && x.d.kind === 'main' && x.it.exercise_id) assert.ok(!avoid.test(x.it.exercise_id), `w${x.w.n} ${x.d.weekday}: ${x.it.exercise_id}`);
  });
  it('R2-SES-03 (08, PROPOSED): a client from the 50+ overlay with a low-back hot spot keeps the low-back list', () => {
    assert.equal(S6.core.hotspot_list_from_age, 50);
    const avoid = new RegExp(R.selection.f3.core_low_back.avoid_re);
    for (const x of allItems(planOf('08'))) if (x.b.kind === 'core' && x.it.exercise_id) assert.ok(!avoid.test(x.it.exercise_id), `w${x.w.n} ${x.d.weekday}: ${x.it.exercise_id}`);
  });
  it('PER-02 (02 M3 "nothing changes between blocks"): a core exercise of a main day changes at an exercise-block boundary, inside its plane', () => {
    const p = planOf('02');
    assert.equal(S6.core.block_change_per_day, 1);
    const at = (w, sid) => itemsOf(w).find(x => x.it.slot_id === sid);
    let changed = 0;
    for (let k = 1; k < p.weeks.length; k++) {
      const a = p.weeks[k - 1], b = p.weeks[k];
      if (a.exercise_block === b.exercise_block || b.block_type !== a.block_type) continue;
      for (const x of itemsOf(b)) {
        if (x.b.kind !== 'core' || x.d.kind !== 'main' || !x.it.exercise_id) continue;
        const y = at(a, x.it.slot_id);
        if (y && y.it.exercise_id && y.it.exercise_id !== x.it.exercise_id) {
          changed++;
          const pl = (e) => (e.plane === 'frontal' ? 'frontal' : ['transverse', 'multi'].includes(e.plane) ? 'transverse' : 'sagittal');
          assert.equal(pl(ex(x.it.exercise_id)), pl(ex(y.it.exercise_id)), `${x.it.slot_id}: ${y.it.exercise_id} -> ${x.it.exercise_id}`);
        }
      }
    }
    assert.ok(changed >= 1, 'no core exercise changed between blocks');
  });
});

describe('v0.6 selection - R2-ATH-03 / CAT-13 jumps of a cutting sport (03 M3)', () => {
  it('R2-ATH-03 (03): a plan that starts at stage 2 takes single-leg jumps from its first block; depth jumps and drops stay two-foot in the first reactive block (E-32)', () => {
    const p = planOf('03');
    assert.equal(p.weeks[0].plyo_stage, 'RC2');
    const first = p.weeks.filter(w => w.exercise_block === p.weeks[0].exercise_block);
    let single = 0;
    for (const w of first) for (const x of itemsOf(w)) {
      if (x.it.bucket !== 'AP_PLYO' || !x.it.exercise_id) continue;
      const e = ex(x.it.exercise_id);
      if (uni(e)) { single++; assert.ok(!/depth/.test(e.id), `w${w.n}: a single-leg depth jump in the first reactive block (${e.id})`); }
    }
    assert.ok(single >= first.length, `single-leg jump stations in block 1: ${single}`);
  });
  it('CAT-13 (03): every training day that holds a jump station holds a single-leg or lateral one, and the week\'s single-leg contacts reach 40 % by week 5', () => {
    const p = planOf('03');
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main') continue;
      const jumps = d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'AP_PLYO' && it.exercise_id && !(ex(it.exercise_id).athletic || {}).upper);
      if (!jumps.length) continue;
      assert.ok(jumps.some(it => uni(ex(it.exercise_id)) || lateral(it.exercise_id)), `w${w.n} ${d.weekday}: ${jumps.map(it => it.exercise_id).join(', ')}`);
    }
    const w5 = p.weeks.find(w => w.n === 5);
    let u = 0, all = 0;
    for (const x of itemsOf(w5)) {
      if (x.it.bucket !== 'AP_PLYO' || !x.it.exercise_id) continue;
      const c = (x.it.sets || 0) * ((x.it.reps && x.it.reps.value) || 0);
      all += c; if (uni(ex(x.it.exercise_id))) u += c;
    }
    assert.ok(all > 0 && u / all >= 0.4 - 1e-9, `single-leg share ${u}/${all}`);
  });
  it('CAT-10 / E-32: a plan that starts at stage 1 still lands on two feet in its first block (01, the swimmer)', () => {
    const p = planOf('01');
    assert.equal(p.weeks[0].plyo_stage, 'RC1');
    for (const w of p.weeks.filter(x => x.exercise_block === p.weeks[0].exercise_block)) for (const x of itemsOf(w)) {
      if (x.it.bucket !== 'AP_PLYO' || !x.it.exercise_id) continue;
      const e = ex(x.it.exercise_id);
      assert.ok(!(uni(e) && e.athletic && e.athletic.quality === 'plyometric'), `w${w.n}: ${e.id}`);
    }
  });
});

describe('v0.6 selection - EQ-03 / ATH-10 the power slot (08 M1)', () => {
  it('EQ-03 / ATH-10 (08): the 52-year-old beginner with knee pain who plays 3 times a week gets no snatch-family lift but the high pull, and no barbell power lift', () => {
    const p = planOf('08');
    assert.equal(p.validation.ok, true);
    const keep = new RegExp(S6.olympic_safe.keep_id_re);
    let n = 0;
    for (const x of allItems(p)) {
      if (x.it.bucket !== 'AP_TRIPLE_EXT' || !x.it.exercise_id) continue;
      const e = ex(x.it.exercise_id); n++;
      assert.ok(!(e.athletic && e.athletic.olympic_family === 'snatch' && !keep.test(e.id)), `w${x.w.n} ${x.d.weekday}: ${e.id}`);
      assert.ok(!e.tags.includes('barbell'), `w${x.w.n} ${x.d.weekday}: ${e.id} is a barbell lift`);
      assert.ok(!e.tags.includes('overhead'), `w${x.w.n} ${x.d.weekday}: ${e.id} goes overhead`);
      for (const s of x.it.swaps || []) assert.ok(!(ex(s).athletic && ex(s).athletic.olympic_family === 'snatch' && !keep.test(s)) && !ex(s).tags.includes('barbell'), `swap ${s}`);
    }
    assert.ok(n > 0, 'the power slot stays (it holds a KB swing or a high pull)');
  });
  it('EQ-03: 3+ play days alone make the power slot "olympic safe" (no pain, a 30-year-old)', () => {
    const i = loadSample(NAMES['08']);
    i.pain = []; i.age = 30;
    const p = generate(i, model);
    assert.equal(p.status, 'ok'); assert.equal(p.validation.ok, true);
    for (const x of allItems(p)) if (x.it.bucket === 'AP_TRIPLE_EXT' && x.it.exercise_id) { const e = ex(x.it.exercise_id); assert.ok(!(e.athletic && e.athletic.olympic_family === 'snatch' && !/high-pull/.test(e.id)), e.id); }
  });
});

describe('v0.6 selection - R2-LIB-01 / PER-02 block changes (07 M2)', () => {
  it('R2-LIB-01 (07): on the push / pull / legs days no block change turns a one-arm lift into a two-arm one (or back), and a changed lift keeps its support', () => {
    const p = planOf('07');
    const supp = new RegExp(S6.block_change.supported_re);
    const support = (e) => (supp.test(e.id) ? 'supported' : (e.equipment.machine || e.tags.includes('machine')) ? 'machine' : 'free');
    const at = (w, sid) => itemsOf(w).find(x => x.it.slot_id === sid);
    for (let k = 1; k < p.weeks.length; k++) {
      const a = p.weeks[k - 1], b = p.weeks[k];
      if (a.exercise_block === b.exercise_block) continue;
      for (const x of itemsOf(b)) {
        if (!['strength', 'accessories'].includes(x.b.kind) || !x.it.exercise_id || x.it.role === 'test') continue;
        const y = at(a, x.it.slot_id);
        if (!y || !y.it.exercise_id || y.it.exercise_id === x.it.exercise_id || y.it.role === 'test') continue;
        const e1 = ex(y.it.exercise_id), e2 = ex(x.it.exercise_id);
        if (/^RP_(HPULL|VPULL|HPUSH|VPUSH)$/.test(x.it.bucket)) assert.equal(uni(e2), uni(e1), `w${b.n} ${x.it.slot_id}: ${e1.id} -> ${e2.id}`);
        if (x.it.bucket === 'RP_HPULL') assert.equal(support(e2), support(e1), `w${b.n} ${x.it.slot_id}: ${e1.id} -> ${e2.id}`);
        assert.ok(!(/split-squat/.test(e1.id) && !/lunge/.test(e1.id) && /lunge/.test(e2.id)), `w${b.n} ${x.it.slot_id}: a static split squat became a stepping lunge (${e2.id})`);
      }
    }
  });
  it('PER-04 / E-182 (07): the week holds one seal row at most; Tuesday\'s one-arm row stays one-arm in every block', () => {
    const p = planOf('07');
    for (const w of p.weeks) {
      const seals = itemsOf(w).filter(x => x.it.exercise_id && /^seal-row/.test(x.it.exercise_id));
      assert.ok(seals.length <= 1, `w${w.n}: ${seals.map(x => x.it.exercise_id).join(', ')}`);
      const t = itemsOf(w).find(x => x.it.slot_id === 'Tue.Pull.s06');
      if (t && t.it.exercise_id) assert.ok(uni(ex(t.it.exercise_id)), `w${w.n}: ${t.it.exercise_id}`);
    }
    assert.ok(R.selection.r2.families.some(f => f.id === 'seal_row' && f.week_max === 1));
  });
});

describe('v0.6 selection - OT06 / PRG-03 the bootcamp cardio station (05 M1)', () => {
  it('OT06 / PRG-03 (05): every cardio station is a cardio pick dosed as continuous work, in the coach\'s station order', () => {
    const p = planOf('05');
    assert.equal(p.validation.ok, true);
    for (const w of p.weeks) for (const d of w.days) {
      if (d.kind !== 'main') continue;
      const items = d.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items);
      const cardio = items.filter(it => it.bucket === 'COND_CIRCUIT');
      assert.ok(cardio.length >= 1, `w${w.n} ${d.weekday}: no cardio station`);
      for (const it of cardio) {
        const e = ex(it.exercise_id);
        assert.ok(!e.medball && !e.tags.includes('kb_swing'), `w${w.n} ${d.weekday}: ${e.id} is a power drill`);
        assert.equal(it.effort && it.effort.key, 'effort.circuit_metabolic', `w${w.n} ${d.weekday}: ${it.exercise_id}`);
        assert.notEqual(items.indexOf(it), 0, `w${w.n} ${d.weekday}: the cardio station was moved to station 1`);
      }
    }
  });
});

describe('v0.6 selection - R3-ATH-05 team practices and the hard eve (03 M1)', () => {
  // (converted, COACH-CH5 CH5-01 'team practice doesnt matter, just have the athlete take into account and they handle that' -
  // DECISIONS G-197: the G-136 reading - practices shown as days and counted as aerobic sessions - is retired)
  it('CH5-01 (03): team practices are not built into the week and do not count as aerobic sessions; the template\'s aerobic sessions stay; one line (EN + ES) tells the athlete to account for them', () => {
    assert.equal(R.conditioning.s6.practice.counts_as_aerobic, false);
    assert.ok(R.conditioning.s6.practice.refs.includes('CH5-01'));
    const p = planOf('03');
    assert.equal(p.meta.season.practice_days, 2);
    for (const w of p.weeks) assert.ok(!w.days.some(d => d.kind === 'sport'), `w${w.n}: a practice day was built into the week`);
    // the same athlete with no practice: the same aerobic sessions (practices replace none)
    const i = loadSample(NAMES['03']); i.sport.practice.practice_days_per_week = 0;
    const p0 = generate(i, model);
    const nA = (pl) => pl.weeks.map(w => itemsOf(w).filter(x => x.it.aerobic).length).join(' ');
    assert.equal(nA(p), nA(p0));
    // the line, EN and ES, only for an athlete with practice days
    const md = (pl, lang) => renderPlan(pl, model, { lang }).replace(/\\([\\*_`])/g, '$1');
    assert.ok(md(p, 'en').includes(model.t('en', 'ui.plan.team_practice', { n: 2 })));
    assert.ok(md(p, 'es').includes(model.t('es', 'ui.plan.team_practice', { n: 2 })));
    assert.ok(!md(p0, 'en').includes(model.t('en', 'ui.plan.team_practice').split('{')[0]));
    assert.ok(!md(planOf('06'), 'en').includes(model.t('en', 'ui.plan.team_practice').split('{')[0]), 'no line for a client who does not compete');
  });
  it('ORD-03 / R2-SES-06 (all samples, and the soccer player with no practice): a hard aerobic colour never sits on the day before a sprint day or the week\'s heavy hinge', () => {
    const HE = R.conditioning.s6.hard_eve;
    const i = loadSample(NAMES['03']); i.sport.practice.practice_days_per_week = 0;
    const list = [...Object.keys(NAMES).map(planOf), generate(i, model)];
    for (const p of list) for (const w of p.weeks) {
      const prot = new Set(w.days.filter(d => d.kind === 'main' && d.blocks.flatMap(b => b.items).some(it => it.bucket === 'AP_SPRINT' || (it.bucket === 'RP_BHD' && ex(it.exercise_id) && ex(it.exercise_id).axial && ex(it.exercise_id).axial_pattern === 'hinge'))).map(d => d.weekday));
      for (const d of w.days) for (const b of d.blocks) for (const it of b.items) {
        if (!it.aerobic || !HE.colours.includes(it.aerobic.colour)) continue;
        const next = WD7[(WD7.indexOf(d.weekday) + 1) % 7];
        assert.ok(!prot.has(next), `${p.meta.profile && p.meta.profile.id} w${w.n} ${d.weekday}: colour ${it.aerobic.colour} before ${next}`);
      }
    }
  });
});

describe('v0.6 selection - the benchmark scorer reads the package\'s rules (scorer 2.4, G-138)', () => {
  it('EQ-03 / G-133: the 52-year-old\'s KB swing on his knee day is not counted as a day-pattern miss; R2-LIB-01 / G-134: the push / pull / legs plan\'s kept laterality is not a dial error', () => {
    assert.equal(SCORER_VERSION, '2.4.1'); // (engine 0.6.0 integration: 2.4.1 reads the model's stated-reason list, G-198)
    const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });
    const s08 = scorePlan(planOf('08'), ctx);
    assert.equal((s08.metrics.olympic_day_pattern || {}).value || 0, 0, JSON.stringify(s08.metrics.olympic_day_pattern));
    const s07 = scorePlan(planOf('07'), ctx);
    assert.equal((s07.metrics.upper_laterality_error || {}).value || 0, 0, JSON.stringify(s07.metrics.upper_laterality_error));
  });
});

describe('v0.6 selection - T3-ATH-02 the plyo share after the never-a-drop pass (G-139)', () => {
  it('T3-ATH-02 / R2-ATH-01 (02): the climb CAT-13\'s lateral stations add does not push week 2 out of its share band, and the jumps never drop inside the block', () => {
    const p = planOf('02'), tol = R.athletic.f2.share.tolerance;
    const ab = p.weeks[1].athletic_budget;
    assert.ok(Math.abs(ab.planned_share - ab.plyo_share) <= tol + 1e-9, JSON.stringify([ab.planned_share, ab.plyo_share]));
    const jumps = (w) => (w.athletic_budget.planned.plyo_contacts || 0) + (w.athletic_budget.planned.jump_contacts || 0);
    const blk = p.weeks.filter(w => w.training_block === p.weeks[0].training_block && !w.test);
    for (let i = 1; i < blk.length; i++) assert.ok(jumps(blk[i]) >= jumps(blk[i - 1]), `week ${blk[i].n}: ${jumps(blk[i])} < ${jumps(blk[i - 1])}`);
    // without the step the same plan leaves week 2 outside the band
    const r0 = clone(raw); delete r0.rules.athletic.s6;
    const ab0 = generate(loadSample(NAMES['02']), loadModel(r0)).weeks[1].athletic_budget;
    assert.ok(Math.abs(ab0.planned_share - ab0.plyo_share) > tol, JSON.stringify([ab0.planned_share, ab0.plyo_share]));
  });
});
