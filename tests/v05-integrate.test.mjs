// tests/v05-integrate.test.mjs - engine 0.5.0, work package V4 (design/ENGINE_V05_PLAN.md "V4 integrate").
// One test per rule this package added or tightened, named with its coach answer id:
//   COACH-R4 R4-SES-05                 the coach's skeleton keeps its laterality (two-leg slot / single-leg slot; the A day's two-arm
//                                      row); push / pull / legs prints slot for slot in the order of his sheet; 'Tricep - Push' /
//                                      'Tricep - Overhead'; V30 holds it on generated plans and on hand-broken copies; V28 reads the
//                                      share on the stations the dial may move
//   R4-PRG-04 / ORD-11                 a Focus slot never pushes a group over its final sets
//   COACH-ANSWER ORD-08                every main day opens with a warm-up
//   rules.ordering SPEED_SESSION_ORDER sprint -> jump -> ankle -> throw -> cuts, also with the jump + throw pair
//   EQ-03 / R2-ATH-08 / F38            no handstand work for a 60+ default; "no floor work" covers the floor lifts, not the
//                                      hands-elevated push-up
//   R2-GEN-02                          the block view lists its rows in session order
//   design/bench                       scorer 2.1: the skeleton's laterality, the MYO exclusions, the end-test week's dose
// Runs on the reference fixture and on the compiled model/ (both must agree: rules.json deep-equals the fixture rules).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { renderBlockView } from '../engine/render.mjs';
import { amendRulesV4, amendTemplatesV4, amendExerciseV4, PINNED_SKELETON_PREFIXES } from '../tools/fixture/v05-integrate.mjs';
import { PINNED_SKELETON_PREFIXES_X1 } from '../tools/fixture/v05-fix1.mjs';
import { makeContext, scorePlan, SCORER_VERSION } from '../design/bench/score.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BENCH_DIR = path.join(ROOT, 'design', 'bench', 'intakes');
const MODELS = [['fixture', loadFixtureModel()]];
try { const c = loadCompiledModel(); if (c) MODELS.push(['model', c]); } catch { /* fixture only */ }
const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n) => clone(loadSample(n));
const bench = (nn) => JSON.parse(fs.readFileSync(path.join(BENCH_DIR, fs.readdirSync(BENCH_DIR).find(f => f.startsWith(nn + '-'))), 'utf8'));
const SAMPLES = ['01', '02', '03', '04', '05', '06', '07', '08'];
// gym A / B / C and push / pull / legs plans of the benchmark: muscle 2-6 days, home kits, older adults, fat loss, general, 2 days
const SKELETON_BENCH = ['01', '02', '04', '05', '07', '08', '09', '10', '12', '14', '77', '82', '85', '88'];
// athletic plans of the benchmark (jump, ankle, throw and cut stations)
const ATHLETIC_BENCH = ['23', '26', '27', '28', '30', '32', '36', '44', '49', '52', '62'];
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const check = (res, id) => res.checks.find(c => c.id === id);
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');

for (const [mname, model] of MODELS) {
  const R = model.rules;
  const SL = R.selection.skeleton_laterality;
  const plans = new Map();
  const planOf = (n) => { if (!plans.has('S' + n)) plans.set('S' + n, generate(sample(n), model)); return plans.get('S' + n); };
  const benchOf = (nn) => { if (!plans.has('B' + nn)) plans.set('B' + nn, generate(bench(nn), model)); return plans.get('B' + nn); };
  const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
  const pinnedDay = (d) => !!d.skeleton && SL.skeleton_prefixes.some(p => String(d.skeleton).startsWith(p));
  /** the template station an item was placed on */
  const stationOf = (p, d, it) => {
    const [fam, days] = String(p.meta.template.id).split('.');
    const t = model.templates.families[fam].days[days];
    const dts = p.meta.template.variant ? { ...t.day_types, ...t.variants[p.meta.template.variant].day_types } : t.day_types;
    return (dts[d.day_type].stations || []).find(s => s.id === String(it.station_id).replace(/\.test$/, '')) || { bucket: it.bucket };
  };
  const latOk = (bucket, e) => (SL.laterality_of_bucket[bucket] === 'unilateral' ? SL.unilateral_lateralities.includes(e.laterality) : e.laterality === 'bilateral');

  // ------------------------------------------------------------------------------------------------------------ R4-SES-05
  describe(`v0.5 / V4 the skeleton keeps its laterality (${mname})`, () => {
    // v0.5 fix round 1 (converted, DECISIONS G): the athletic A / B / C days are pinned too - samples 02 / 08 majors 'the two-leg slot
    // of his template is gone on both days'; R4-SES-05 is newer than UNI-02, and G-51 had left this open for the coach
    it('R4-SES-05: the rule data - gym A / B / C, push / pull / legs and the athletic A / B / C days are pinned', () => {
      assert.deepEqual(PINNED_SKELETON_PREFIXES, ['gym_', 'ppl_']);
      // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the class days carry a skeleton of their own now - sample 04
      // major 'every day has skeleton: null ... the one-arm lead row and the laterality flip pass every validator')
      assert.deepEqual(SL.skeleton_prefixes, [...PINNED_SKELETON_PREFIXES_X1, 'class_']);
      assert.equal(SL.lower_fixed, true);
      assert.deepEqual(SL.laterality_of_bucket, { RP_BKD: 'bilateral', RP_BHD: 'bilateral', RP_UKD: 'unilateral', RP_UHD: 'unilateral' });
      // (engine 0.7, converted - R5-GEN-01, DECISIONS G-250: full-body day 1 opens with his A day's two-arm row too)
      assert.deepEqual([...SL.lead_row.skeletons].sort(), ['athletic_A', 'athletic_FB1', 'class_pull', 'class_squat', 'gym_A', 'gym_FB1']); assert.equal(SL.lead_row.bucket, 'RP_HPULL'); assert.ok(SL.lead_row.penalty < 0);
      assert.ok(SL.refs.includes('R4-SES-05'));
      assert.ok(SL.skeleton_prefixes.some(p => 'athletic_A'.startsWith(p)), 'the athletic days keep each slot\'s laterality (R4-SES-05)');
      assert.deepEqual(R.validation.v05.skeleton.laterality_of_bucket, SL.laterality_of_bucket);
      assert.deepEqual(R.validation.v05.skeleton.laterality_skeleton_prefixes, SL.skeleton_prefixes);
    });

    it('R4-SES-05: on a gym A / B / C or push / pull / legs day a two-leg slot holds a two-leg lift and a single-leg slot a single-leg lift, in every week of every exercise block (the lunge slot never turns into a machine squat)', () => {
      const corpus = [...['06', '07'].map(n => ['S' + n, planOf(n)]), ...SKELETON_BENCH.map(nn => ['B' + nn, benchOf(nn)])];
      let judged = 0;
      for (const [name, p] of corpus) {
        assert.equal(p.status, 'ok', name);
        for (const x of allItems(p)) {
          if (x.d.kind !== 'main' || !pinnedDay(x.d) || x.it.origin !== 'template' || !SL.laterality_of_bucket[x.it.bucket] || !x.it.exercise_id) continue;
          if ((x.it.flags || []).some(f => R.validation.v05.skeleton.laterality_exempt_flags.includes(f))) continue;
          judged++;
          assert.ok(latOk(x.it.bucket, ex(x.it.exercise_id)), `${name} w${x.w.n} ${x.it.slot_id}: ${x.it.exercise_id} (${ex(x.it.exercise_id).laterality}) in a ${x.it.bucket} slot`);
          // (the item sits in its template station's own bucket: the dial did not turn the slot)
          assert.equal(x.it.bucket, stationOf(p, x.d, x.it).bucket, `${name} w${x.w.n} ${x.it.slot_id}: the dial turned a skeleton slot`);
        }
      }
      assert.ok(judged > 1000, 'judged ' + judged);
    });

    it('R4-SES-05: sample 06 keeps a lunge in slot 4 of the A day and a single-leg hinge in slot 4 of the B day in all three exercise blocks', () => {
      const p = planOf('06');
      for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
        const lifts = d.blocks.filter(b => b.kind === 'strength').flatMap(b => b.items).filter(it => /^RP_/.test(it.bucket) && it.role !== 'test');
        const want = d.skeleton === 'gym_A' ? ['RP_HPULL', 'RP_BKD', 'RP_VPULL', 'RP_UKD'] : ['RP_HPUSH', 'RP_BHD', 'RP_VPUSH', 'RP_UHD'];
        assert.deepEqual(lifts.map(it => it.bucket), want, `w${w.n} ${d.weekday}`);
        const fourth = ex(lifts[3].exercise_id);
        assert.ok(['unilateral', 'alternating'].includes(fourth.laterality), `w${w.n} ${d.weekday}: ${fourth.id}`);
        assert.equal(ex(lifts[1].exercise_id).laterality, 'bilateral', `w${w.n} ${d.weekday}: ${lifts[1].exercise_id}`);
      }
    });

    it('R4-SES-05: the A day\'s first row is a two-arm row ("horizontal pull, bilateral, symmetrical") while the kit holds one', () => {
      const corpus = [['S06', planOf('06')], ...['01', '04', '09', '10', '14', '77', '85'].map(nn => ['B' + nn, benchOf(nn)])];
      let n = 0;
      for (const [name, p] of corpus) for (const w of p.weeks) for (const d of w.days) {
        if (d.skeleton !== 'gym_A') continue;
        const row = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_HPULL' && it.origin === 'template' && it.role !== 'test');
        if (!row || (row.flags || []).some(f => ['pain_swap', 'pattern_gap', 'no_candidate'].includes(f))) continue;
        n++;
        assert.equal(ex(row.exercise_id).laterality, 'bilateral', `${name} w${w.n} ${d.weekday}: ${row.exercise_id}`);
      }
      assert.ok(n > 150, 'rows judged ' + n);
    });

    // v0.5 fix round 1 (converted, DECISIONS G; was: 'an athletic day keeps the laterality dial'): samples 02 / 03 / 08 - the two-leg
    // slot of an athletic day holds a two-leg lift in every week (a squat or a leg press; a deadlift, a hip extension or a hip thrust)
    it('R4-SES-05: an athletic A / B / C day keeps each lower slot\'s laterality - the dial turns no slot of it', () => {
      for (const n of ['02', '03', '08']) {
        const p = planOf(n);
        // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): for a change-of-direction sport the third day's non-axial
        // knee slot is free of the pin (sample 03 major: a cutting sport lifted 70 % two-sided against its own 20 %;
        // rules.selection.skeleton_laterality.x2_free) - the soccer plan turns that one slot, nothing else
        const XF = SL.x2_free;
        const free = (x) => n === '03' && !!XF && XF.skeletons.includes(x.d.skeleton) && XF.buckets.includes(stationOf(p, x.d, x.it).bucket);
        const flips = allItems(p).filter(x => x.d.kind === 'main' && x.it.origin === 'template' && SL.laterality_of_bucket[x.it.bucket] && stationOf(p, x.d, x.it).bucket !== x.it.bucket && !free(x));
        assert.deepEqual(flips.map(x => x.it.slot_id), [], n);
        if (n === '03') assert.ok(allItems(p).some(x => free(x) && ex(x.it.exercise_id).laterality !== 'bilateral'), 'the soccer player\'s third-day knee lift is a single-leg lift');
        let seen = 0;
        for (const x of allItems(p)) {
          if (x.d.kind !== 'main' || x.it.origin !== 'template' || !SL.laterality_of_bucket[x.it.bucket] || !x.it.exercise_id || !pinnedDay(x.d) || free(x)) continue;
          const lat = ex(x.it.exercise_id).laterality === 'bilateral' ? 'bilateral' : 'unilateral';
          assert.equal(lat, SL.laterality_of_bucket[x.it.bucket], `${n} w${x.w.n} ${x.it.slot_id} ${x.it.exercise_id}`);
          seen++;
        }
        assert.ok(seen > 0, n);
      }
    });

    it('R4-SES-05: push / pull / legs prints slot for slot in the order of his sheet - press, press, incline, flies, dips, triceps, triceps; squat, hinge, lunge, leg extension, leg curl, single-leg hinge', () => {
      const p = planOf('07');
      const w = p.weeks[1];
      const liftsOf = (d) => d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items).filter(it => it.origin === 'template');
      for (const d of w.days.filter(x => x.skeleton === 'ppl_push')) {
        const its = liftsOf(d);
        assert.deepEqual(its.map(it => it.bucket), ['RP_HPUSH', 'RP_VPUSH', 'RP_HPUSH', 'ISO_CHEST', 'RP_HPUSH', 'ISO_TRICEP', 'ISO_TRICEP'], d.weekday);
        assert.equal(ex(its[4].exercise_id).credit_class, 'DIPS', d.weekday + ': the fifth slot is his dips');
      }
      for (const d of w.days.filter(x => x.skeleton === 'ppl_pull')) {
        assert.deepEqual(liftsOf(d).map(it => it.bucket), ['RP_HPULL', 'RP_HPULL', 'RP_VPULL', 'ISO_SIDE_REAR_DELT', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_BICEP'], d.weekday);
      }
      const legs = w.days.filter(x => x.skeleton === 'ppl_legs').map(d => liftsOf(d).map(it => it.bucket));
      assert.deepEqual(legs[0], ['RP_BKD', 'RP_BHD', 'RP_UKD', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'RP_UHD', 'ISO_CALF']);
      assert.deepEqual(legs[1], ['RP_BHD', 'RP_BKD', 'RP_UKD', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'RP_UHD', 'ISO_CALF']);
      // the template data: the flies, the leg extension and the leg curl sit with the compound lifts they stand between
      const T = model.templates.families.aesthetics.days['6'].variants.ppl_x2.day_types;
      assert.equal(T.Push.stations.find(s => s.bucket === 'ISO_CHEST').block, 'strength');
      for (const k of ['Legs 1', 'Legs 2']) for (const b of ['ISO_QUAD', 'ISO_LEG_FLEXION']) assert.equal(T[k].stations.find(s => s.bucket === b).block, 'strength', k + ' ' + b);
      assert.equal(T['Legs 1'].stations.find(s => s.bucket === 'ISO_CALF').block, 'accessories');
    });

    it('R4-SES-05: the push day\'s two triceps slots pick their kind - "Tricep - Push" a push-down or kickback, "Tricep - Overhead" an overhead extension or skullcrusher', () => {
      const SV = R.selection.slot_variants.ISO_TRICEP;
      assert.ok(SV.push.weight > 0 && SV.overhead.weight > 0);
      const p = planOf('07');
      let n = 0;
      for (const w of p.weeks) for (const d of w.days.filter(x => x.skeleton === 'ppl_push')) {
        const tri = d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'ISO_TRICEP' && it.origin === 'template');
        assert.equal(tri.length, 2, `w${w.n} ${d.weekday}`);
        assert.match(tri[0].exercise_id, new RegExp(SV.push.id_re), `w${w.n} ${d.weekday} slot 6: ${tri[0].exercise_id}`);
        assert.match(tri[1].exercise_id, new RegExp(SV.overhead.id_re), `w${w.n} ${d.weekday} slot 7: ${tri[1].exercise_id}`);
        n++;
      }
      assert.equal(n, 24);
    });

    it('V30 (R4-SES-05): a generated plan passes; a hand-broken copy with a two-leg lift in the lunge slot fails with rule slot_laterality', () => {
      for (const n of ['06', '07']) assert.ok(check(planOf(n).validation, 'V30').pass, n + ': ' + JSON.stringify(check(planOf(n).validation, 'V30').violations.slice(0, 2)));
      const bad = clone(planOf('06'));
      const day = bad.weeks[2].days.find(d => d.skeleton === 'gym_A');
      const lunge = day.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_UKD');
      const squat = day.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_BKD');
      lunge.exercise_id = squat.exercise_id; lunge.name_key = squat.name_key;
      const v = check(validatePlan(bad, model), 'V30');
      assert.equal(v.pass, false);
      assert.ok(v.violations.some(x => x.args && x.args.rule === 'slot_laterality' && x.args.slot === 'RP_UKD'), JSON.stringify(v.violations.slice(0, 3)));
    });

    it('V28 (UNI-02, R4-SES-05): the share is read on the stations the dial may move - a plan built only on pinned skeleton days is not judged, an athletic plan still is', () => {
      for (const n of ['06', '07']) { const c = check(planOf(n).validation, 'V28'); assert.ok(c.pass, n + ': ' + JSON.stringify(c.violations)); }
      // a plan whose days are not the coach's pinned days (the class week) with every single-leg lift turned two-legged still trips
      // the warning (v0.5 fix round 1: the athletic days are pinned now, so the class plan carries the dial here)
      // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the class week is a pinned skeleton now, so the plan that still
      // carries the dial is a strength week - maximal- / dynamic-effort days name no skeleton)
      const bad = clone(benchOf('19'));
      assert.ok(bad.weeks[0].days.every(d => !d.skeleton), 'the strength week names no skeleton');
      const bil = allItems(bad).find(x => x.it.bucket === 'RP_BKD' && x.it.exercise_id && ex(x.it.exercise_id).credit_class === 'BKD');
      for (const x of allItems(bad)) if (x.it.exercise_id && ['UKD', 'UHD'].includes(ex(x.it.exercise_id).credit_class)) { x.it.exercise_id = bil.it.exercise_id; x.it.name_key = bil.it.name_key; }
      assert.equal(check(validatePlan(bad, model), 'V28').pass, false);
    });
  });

  // ------------------------------------------------------------------------------------------------------ R4-PRG-04 / ORD-11
  describe(`v0.5 / V4 a Focus slot never pushes a group over its final sets (${mname})`, () => {
    it('R4-PRG-04 / ORD-11: the rule data', () => {
      assert.equal(R.placement.optional_focus.close_when_over_top, true);
      assert.ok(R.placement.optional_focus.close_refs.includes('R4-PRG-04'));
    });

    it('R4-PRG-04: a 16-year-old guard\'s hips start at what the main days hold and climb to the final sets (they sat at 22 against a final 16 while four Focus slots were filled); the closed slots are recorded', () => {
      const p = benchOf('31');
      const st = p.meta.stairway[0];
      assert.ok(st.focus_closed.length >= 1 && st.focus_closed.every(c => c.group === 'hips' && /\.OPT\./.test(c.slot_id)), JSON.stringify(st.focus_closed));
      assert.ok(st.group_start.hips <= st.planned_top.hips, `${st.group_start.hips} <= ${st.planned_top.hips}`);
      assert.equal(st.group_top.hips, st.planned_top.hips);
      assert.ok(st.schedule.hips[st.schedule.hips.length - 1] > st.schedule.hips[0], 'the group climbs: ' + st.schedule.hips.join(' '));
      // the closed slots hold no item in any week; the main days' template lifts all stay
      const closed = new Set(st.focus_closed.map(c => c.slot_id));
      for (const x of allItems(p)) assert.ok(!closed.has(x.it.slot_id) || !(x.it.sets > 0), `w${x.w.n} ${x.it.slot_id}`);
      assert.ok(check(p.validation, 'V30').pass);
    });

    it('R4-PRG-04: across the benchmark spread no trained group starts more than 1 set above its planned final sets because of an optional-day Focus slot', () => {
      for (const nn of ['31', '32', '39', '40', '44', '47', '48', '77']) {
        const p = benchOf(nn);
        for (const st of p.meta.stairway) {
          const focusGroups = new Set(allItems(p).filter(x => x.d.kind === 'optional' && x.it.bucket === 'FOCUS' && x.it.origin === 'template' && x.it.sets > 0 && x.it.exercise_id).map(x => model.groupOf(ex(x.it.exercise_id).primary_muscle)));
          for (const g of focusGroups) if (g in st.group_start && g in st.planned_top) assert.ok(st.group_start[g] <= st.planned_top[g], `B${nn} ${g}: starts at ${st.group_start[g]}, final ${st.planned_top[g]}`);
        }
      }
    });

    it('R3-SES-01: the person\'s own Focus muscle keeps the Focus slots that fit under its final sets (sample 06: glutes and side delts)', () => {
      const p = planOf('06');
      assert.deepEqual(p.meta.stairway[0].focus_closed, []);
      const focus = allItems(p).filter(x => x.w.n === 1 && x.d.kind === 'optional' && x.it.bucket === 'FOCUS' && x.it.origin === 'template' && x.it.sets > 0);
      assert.equal(focus.length, 4);
    });
  });

  // -------------------------------------------------------------------------------------------------------------- ORD-08
  describe(`v0.5 / V4 every main day opens with a warm-up (${mname})`, () => {
    it('ORD-08: every main day type of every template and variant holds the general warm-up station', () => {
      for (const [fam, f] of Object.entries(model.templates.families)) for (const [d, t] of Object.entries(f.days)) {
        const sets = [[null, t.day_types], ...Object.entries(t.variants || {}).map(([n, v]) => [n, (v && v.day_types) || {}])];
        for (const [vn, dts] of sets) for (const [name, def] of Object.entries(dts)) {
          if (def.kind !== 'main') continue;
          assert.ok((def.stations || []).some(s => s.bucket === 'WARMUP_GENERAL'), `${fam}.${d}${vn ? '/' + vn : ''} ${name}`);
        }
      }
    });

    it('ORD-08: the 5-day hybrid week\'s Friday (written "easy aerobic first") opens with the warm-up, then the core', () => {
      const p = benchOf('65');
      for (const w of p.weeks) {
        const fri = w.days.find(d => d.weekday === 'Fri' && d.kind === 'main');
        assert.ok(fri, 'w' + w.n);
        assert.deepEqual(fri.blocks.slice(0, 2).map(b => b.kind), ['warmup', 'core'], 'w' + w.n);
      }
    });

    it('ORD-08: the first block of every main day of the 8 samples is the warm-up', () => {
      for (const n of SAMPLES) for (const w of planOf(n).weeks) for (const d of w.days.filter(x => x.kind === 'main')) assert.equal(d.blocks[0].kind, 'warmup', `${n} w${w.n} ${d.weekday}`);
    });
  });

  // ------------------------------------------------------------------------------------------------- SPEED_SESSION_ORDER
  describe(`v0.5 / V4 the speed-session order holds (${mname})`, () => {
    it('SPEED_SESSION_ORDER (rules.ordering.hard): the athletic block runs sprint -> jump -> ankle -> throw -> cuts on every day of the samples and of the athletic benchmark spread (the jump + throw pair never moves the throw ahead of the ankle station)', () => {
      assert.ok(R.ordering.hard.includes('SPEED_SESSION_ORDER'));
      const order = R.ordering.athletic_bucket_order;
      const corpus = [...SAMPLES.map(n => ['S' + n, planOf(n)]), ...ATHLETIC_BENCH.map(nn => ['B' + nn, benchOf(nn)])];
      let days = 0;
      for (const [name, p] of corpus) for (const w of p.weeks) for (const d of w.days) {
        const ath = d.blocks.filter(b => b.kind === 'athletic').flatMap(b => b.items).filter(it => order.includes(it.bucket));
        if (ath.length < 2) continue;
        days++;
        const idx = ath.map(it => order.indexOf(it.bucket));
        for (let i = 1; i < idx.length; i++) assert.ok(idx[i] >= idx[i - 1], `${name} w${w.n} ${d.weekday}: ${ath.map(it => it.bucket).join(' > ')}`);
      }
      assert.ok(days > 300, 'days judged ' + days);
    });

    it('R3-SES-02: the jump + throw pair is still recommended where the throw stands right after a lower-body jump station', () => {
      let pairs = 0;
      for (const n of ['01', '02', '03']) for (const w of planOf(n).weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
        const order = d.blocks.flatMap(b => b.items.map(it => it.slot_id));
        for (const r of (d.superset_recommendations || [])) {
          const its = r.items.map(id => d.blocks.flatMap(b => b.items).find(it => it.slot_id === id));
          if (!its.some(it => it && it.bucket === 'AP_THROW')) continue;
          pairs++;
          assert.equal(Math.abs(order.indexOf(r.items[0]) - order.indexOf(r.items[1])), 1, `${n} w${w.n} ${d.weekday}: not neighbours`);
        }
      }
      assert.ok(pairs > 0, 'no jump + throw pair recommended in the three athlete samples');
    });
  });

  // ----------------------------------------------------------------------------------------------- EQ-03 / R2-ATH-08 / F38
  describe(`v0.5 / V4 older adults and "no floor work" (${mname})`, () => {
    it('EQ-03 / R2-ATH-08: handstand work is an advanced, high-skill lift that the 60+ default never takes', () => {
      const h = model.ex('handstand-skill-work-h-s');
      assert.equal(h.level, 'advanced'); assert.equal(h.skill, 'high'); assert.equal(h.older_ok, false); assert.equal(h.older_opt_in_ok, false);
      assert.equal(model.ex('handstand-push-up-wall-supported').older_ok, false);
      for (const nn of ['84', '87', '71', '69', '10']) for (const x of allItems(benchOf(nn))) assert.ok(!/handstand/.test(String(x.it.exercise_id)), `B${nn} w${x.w.n} ${x.it.slot_id}`);
    });

    it('F38 / EQ-03: "no floor work" for a 74-year-old with body weight only - no lift done lying or kneeling on the floor, and a push is still there (the push-up with the hands on a bench)', () => {
      const FW = R.selection.floor_work;
      const p = benchOf('84');
      assert.equal(p.status, 'ok');
      assert.ok((p.meta.derived.exclusions || []).includes('floor_work'));
      const lifts = allItems(p).filter(x => ['circuit', 'strength', 'accessories'].includes(x.b.kind) && x.it.exercise_id);
      for (const x of lifts) {
        assert.ok(!new RegExp(FW.floor_lift_id_re).test(x.it.exercise_id), `w${x.w.n} ${x.it.slot_id}: ${x.it.exercise_id}`);
        const e = ex(x.it.exercise_id);
        assert.ok(!(e.tags || []).includes('push_up_floor') || new RegExp(FW.not_floor_id_re).test(e.id), `w${x.w.n} ${x.it.slot_id}: ${e.id}`);
      }
      for (const w of p.weeks) assert.ok(w.days.some(d => d.blocks.flatMap(b => b.items).some(it => it.exercise_id === 'incline-push-up-hands-elevated')), 'w' + w.n + ': no push');
    });

    it('F38: without the exclusion the same kit still takes its floor lifts (the rule only acts when the person ticks "no floor work")', () => {
      const withFloor = bench('84');
      const strip = (o) => { for (const k of Object.keys(o)) { if (Array.isArray(o[k])) o[k] = o[k].filter(v => v !== 'floor_work'); else if (o[k] && typeof o[k] === 'object') strip(o[k]); } };
      strip(withFloor);
      const p = generate(withFloor, model);
      assert.equal(p.status, 'ok');
      assert.ok(!(p.meta.derived.exclusions || []).includes('floor_work'));
      assert.ok(allItems(p).some(x => x.it.exercise_id && new RegExp(R.selection.floor_work.floor_lift_id_re).test(x.it.exercise_id)));
    });
  });

  // ------------------------------------------------------------------------------------------------------------ R2-GEN-02
  describe(`v0.5 / V4 the block view (${mname})`, () => {
    it('R2-GEN-02: the block view lists a day\'s rows in session order - a jump station that a baseline test replaced in week 1 stands before the lifts, not at the bottom of the table', () => {
      const p = planOf('02');
      const out = unesc(renderBlockView(p, 1, model, { lang: 'en' }));
      const thu = out.slice(out.indexOf('### Thursday'), out.indexOf('### Friday'));
      const rows = thu.split('\n').filter(l => l.startsWith('| ') && !l.startsWith('| Exercise') && !l.startsWith('|---'));
      const at = (re) => rows.findIndex(l => re.test(l));
      const w2 = p.weeks[1].days.find(d => d.weekday === 'Thu');
      const names = w2.blocks.filter(b => !['warmup', 'cooldown', 'aerobic'].includes(b.kind)).flatMap(b => b.items).filter(it => it.name_key && it.role !== 'test').map(it => model.t('en', it.name_key));
      // every station of week 2 appears in the table in week 2's own order
      let last = -1;
      for (const nm of names) { const i = rows.findIndex(l => l.includes('| ' + nm) || l.includes(nm + ' |') || l.includes(nm + ' →')); assert.ok(i >= 0, nm); assert.ok(i >= last, `${nm} is listed before the station that precedes it in the session`); last = i; }
      assert.ok(at(/Accelerations|Sprint/) < at(/Power Clean|Clean/), 'the sprint station stands before the Olympic lift');
    });
  });

  // ------------------------------------------------------------------------------------------------------------ the scorer
  describe(`v0.5 / V4 benchmark scorer 2.1 (${mname})`, { skip: mname !== 'model' && 'the scorer reads the compiled model files' }, () => {
    const raw = readModelDir();
    const ctx = raw ? makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles }) : null;
    const score = (p) => scorePlan(p, ctx, {});

    it('scorer 2.1: version, and the three v0.5 acceptance rows the V4 fixes touch pass on the 8 samples (A3 skeleton, A1-part: order, warm-up, MYO)', () => {
      assert.match(SCORER_VERSION, /^2\.[1-9]/);
      for (const n of SAMPLES) {
        const s = score(planOf(n));
        assert.equal((s.metrics.skeleton_mismatch && s.metrics.skeleton_mismatch.value) || 0, 0, n + ' skeleton_mismatch ' + JSON.stringify(s.metrics.skeleton_mismatch && s.metrics.skeleton_mismatch.violations));
        for (const k of ['athletic_order', 'missing_warmup', 'work_bilateral_myo_order', 'athletic_drops']) assert.equal((s.metrics[k] && s.metrics[k].value) || 0, 0, n + ' ' + k + ' ' + JSON.stringify(s.metrics[k] && s.metrics[k].violations));
      }
    });

    it('scorer 2.1 (R4-SES-05): a two-leg lift put in a single-leg slot of a gym day is a skeleton mismatch (kind slot_laterality)', () => {
      const bad = clone(planOf('06'));
      for (const w of bad.weeks) for (const d of w.days.filter(x => x.skeleton === 'gym_A')) {
        const lunge = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_UKD'), squat = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_BKD');
        lunge.exercise_id = squat.exercise_id;
      }
      const m = score(bad).metrics.skeleton_mismatch;
      assert.ok(m.value > 0);
      assert.ok(m.violations.some(v => v.kind === 'slot_laterality'), JSON.stringify(m.violations.slice(0, 2)));
    });

    it('scorer 2.1 (VOL-15, E-193): a MYO set kept off a barbell calf raise, a Nordic curl or a sissy squat is "last eligible"; a MYO set moved up to an earlier isolation is not', () => {
      const p = planOf('07');
      assert.equal(score(p).metrics.work_bilateral_myo_order.value, 0);
      const bad = clone(p);
      const last = bad.weeks[bad.weeks.length - 1];
      let moved = false;
      for (const d of last.days) {
        const its = d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items);
        const myo = its.find(it => it.effort && it.effort.last_set === 'myo');
        const earlier = its.find(it => it !== myo && it.exercise_id && ex(it.exercise_id).exercise_class === 'isolation' && its.indexOf(it) < its.indexOf(myo) && !/nordic|sissy|copenhagen/.test(it.exercise_id) && !(ex(it.exercise_id).tags || []).includes('barbell'));
        if (!myo || !earlier) continue;
        earlier.effort = { ...earlier.effort, last_set: 'myo', intensifier: true };
        myo.effort = { ...myo.effort, last_set: null, intensifier: false };
        moved = true; break;
      }
      assert.ok(moved, 'no day to move the MYO set on');
      assert.ok(score(bad).metrics.work_bilateral_myo_order.value > 0);
    });

    it('scorer 2.1 (R2-PER-07, E-165 / E-172): the end-test week\'s baseline athletic dose is reported, not counted as a drop; a fall in any other week still is', () => {
      const p = planOf('02');
      const s = score(p);
      assert.equal(s.metrics.athletic_drops.value, 0, JSON.stringify(s.metrics.athletic_drops.violations));
      // the same plan scored with the switch off counts the end-test week again
      const strict = scorePlan(p, makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles }, { athletic_end_test_week_dose_ok: false }), {});
      assert.ok(strict.metrics.athletic_drops.value > 0);
      // a mid-block fall is a drop
      const bad = clone(p);
      const w5 = bad.weeks[4];
      for (const k of Object.keys(w5.athletic_budget.planned)) w5.athletic_budget.planned[k] = Math.floor(w5.athletic_budget.planned[k] / 2);
      assert.ok(score(bad).metrics.athletic_drops.value > 0);
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------- the amendments
describe('v0.5 / V4 tools/fixture/v05-integrate.mjs', () => {
  it('the amendments are pure and repeatable (the same input gives the same output; the input is not changed)', () => {
    const raw = readModelDir();
    if (!raw) return;
    const r0 = JSON.stringify(raw.rules);
    const a = amendRulesV4(raw.rules), b = amendRulesV4(raw.rules);
    assert.deepEqual(a, b); assert.equal(JSON.stringify(raw.rules), r0);
    assert.deepEqual(amendRulesV4(a), a, 'applying the rule amendment twice changes nothing more');
    const t0 = JSON.stringify(raw.templates.families);
    const ta = amendTemplatesV4(raw.templates.families);
    assert.equal(JSON.stringify(raw.templates.families), t0);
    assert.deepEqual(amendTemplatesV4(ta), ta, 'applying the template amendment twice changes nothing more');
    const h = raw.catalog.exercises.find(e => e.id === 'handstand-skill-work-h-s');
    assert.deepEqual(amendExerciseV4(h), h);
    const other = raw.catalog.exercises.find(e => e.id === 'barbell-bench-press');
    assert.deepEqual(amendExerciseV4(other), other, 'a record the package does not name is unchanged');
  });
});
