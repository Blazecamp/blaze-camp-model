// tests/v05-structure.test.mjs - engine 0.5.0, work package V1 (design/ENGINE_V05_PLAN.md "V1 structure and volume").
// One test per new rule, named with its coach answer id:
//   COACH-CT CT-01 / COACH-R4 R4-SES-01  no time-fitting, no session minutes
//   R4-SES-02   sessions sized by exercise count
//   R4-SES-03   the 2-day rule
//   R4-SES-04   nothing is dropped automatically
//   R4-SES-05   the coach's A / B, push / pull / legs and athletic templates, slot for slot
//   COACH-CX CX-01..04 / R4-PRG-01 / 02 / 04   the stairway reaches its target, arrival, the acceleration note, the next block, edits
//   "How volume is allocated" steps 1-4 of the plan
// Runs on the reference fixture and on the compiled model/ (both must agree: rules.json deep-equals the fixture rules).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { ENGINE_VERSION } from '../engine/version.mjs';
import { deriveValues, validateIntake } from '../engine/intake.mjs';
import { buildShape } from '../engine/shape.mjs';
import { buildWeekLayout } from '../engine/week.mjs';
import { computeTargets, stairwayFrom, stairwayPlan, planWeeklySets, calvesFloor } from '../engine/volume.mjs';
import { linesOf, groupCredits } from '../engine/lines.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { simpleFill } from './helpers/simple-layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS = [['fixture', loadFixtureModel()]];
try { const c = loadCompiledModel(); if (c) MODELS.push(['model', c]); } catch { /* fixture only */ }
const EPS = 1e-9;
const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n, mut) => { const i = clone(loadSample(n)); if (mut) mut(i); return i; };
const SAMPLES = ['01', '02', '03', '04', '05', '06', '07', '08'];
const itemsOf = (day) => (day.blocks || []).flatMap(b => (b.items || []).map(it => ({ ...it, _block: b.kind })));
const liftBuckets = (day) => itemsOf(day).filter(it => ['strength', 'accessories'].includes(it._block) && it.role !== 'test' && it.origin !== 'bonus').map(it => it.bucket + (it.bucket === 'ISO_SIDE_REAR_DELT' ? '' : ''));
const A_DAY = ['RP_HPULL', 'RP_BKD', 'RP_VPULL', 'RP_UKD', 'ISO_BICEP', 'ISO_QUAD'];
const B_DAY = ['RP_HPUSH', 'RP_BHD', 'RP_VPUSH', 'RP_UHD', 'ISO_TRICEP', 'ISO_LEG_FLEXION'];

for (const [mname, model] of MODELS) {
  const plans = new Map();
  const planOf = (n, mut, key) => {
    const k = n + '|' + (key || (mut ? mut.toString() : ''));
    if (!plans.has(k)) plans.set(k, generate(sample(n, mut), model));
    return plans.get(k);
  };
  const R = model.rules;
  const X = linesOf(model);
  /** weekly group sets recomputed from the plan's items (group credit: a set counts at most 1.0 to a group) */
  const groupSets = (w) => {
    const out = {};
    for (const d of w.days) for (const it of itemsOf(d)) for (const [g, c] of Object.entries(groupCredits(model, it.credits || {}))) out[g] = (out[g] || 0) + (typeof it.sets === 'number' ? it.sets : 0) * c;
    return out;
  };

  describe(`v0.5 no time-fitting (${mname})`, () => {
    // (engine 0.6.0: the version bump of the merged volume, selection and words packages)
    it('engine version is 0.7.0', () => { assert.equal(ENGINE_VERSION, '0.7.0'); for (const n of ['06']) assert.equal(planOf(n).engine_version, '0.7.0'); });

    it('CT-01 / R4-SES-01: no rule, intake field, plan field or engine file sizes a plan by minutes', () => {
      // rules: every time-fitting table is gone; the time model is an estimate
      for (const k of ['exercise_cap_by_minutes', 'minutes_default', 'minutes_allowed', 'minutes_over_90_competitive_only', 'long_day', 'time_fit']) assert.equal(k in R.session, false, 'rules.session.' + k);
      assert.equal('cut_order' in R, false);
      for (const k of ['capacity', 'track', 'release', 'release_rounding', 'hold_rules', 'min_climb', 'lambda']) assert.equal(k in R.stairway, false, 'rules.stairway.' + k);
      for (const k of ['planned_step_max', 'total_weekly_ceiling', 'placed']) assert.equal(k in R.stairway.limits, false);
      assert.equal(R.time_model.use, 'estimate_only');
      // templates: no station is switched on by session length
      for (const F of Object.values(model.templates.families)) {
        assert.equal('default_minutes' in F, false);
        for (const t of Object.values(F.days)) for (const dts of [t.day_types, ...Object.values(t.variants || {}).map(v => v.day_types)]) for (const dt of Object.values(dts)) for (const st of dt.stations) {
          assert.equal('include_from_minutes' in st, false); assert.equal('superset_below_minutes' in st, false);
        }
      }
      // the engine: the time-fitting module is deleted and no engine source reads session minutes or a time check
      assert.equal(fs.existsSync(path.join(ROOT, 'engine', 'timefit.mjs')), false);
      for (const f of fs.readdirSync(path.join(ROOT, 'engine')).filter(x => x.endsWith('.mjs'))) {
        const src = fs.readFileSync(path.join(ROOT, 'engine', f), 'utf8').split('\n').filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).map(l => l.replace(/\/\/.*$/, '')).join('\n');
        // (model.mjs names the retired rule tables only to assert that a model no longer carries them; validate.mjs names the
        // retired plan fields only in V3, which fails a plan that still carries one)
        if (f === 'validate.mjs') continue;
        for (const word of ['minutes_limit', 'time_check', 'exercise_cap_by_minutes', 'long_day', 'time_fit', 'timeCheck', 'trimToTime', 'roomCut']) if (f !== 'model.mjs' || !['exercise_cap_by_minutes', 'long_day', 'time_fit'].includes(word)) assert.equal(src.includes(word), false, `${f} still mentions ${word}`);
        if (f !== 'intake.mjs') assert.equal(src.includes('session_minutes'), false, `${f} reads session_minutes`);
      }
    });

    it('CT-01 / R4-SES-01: the plan carries no time check, no schedule offers and no day limit - only an estimate per day', () => {
      for (const n of SAMPLES) {
        const p = planOf(n);
        assert.equal(p.status, 'ok');
        for (const k of ['time_check', 'offers']) assert.equal(k in p, false, n + ' plan.' + k);
        assert.equal('session_minutes' in p.meta, false);
        assert.equal(p.meta.time, 'estimate_only');
        assert.equal('session_minutes' in p.meta.derived, false);
        for (const w of p.meta.warnings) assert.ok(!/time_check|long_day|not_trained_directly|time_lower_peak|supersets_needed|minutes/.test(w.key), n + ' ' + w.key);
        for (const w of p.weeks) for (const d of w.days) {
          assert.equal('minutes_limit' in d, false); assert.equal('supersets_needed' in d, false);
          if (['main', 'optional'].includes(d.kind)) assert.equal(typeof d.est_minutes, 'number');
          for (const r of d.superset_recommendations || []) assert.equal('needed' in r, false);
        }
        const md = renderPlan(p, model, { lang: 'en', view: 'full' });
        assert.ok(!/Session length|cannot hold the full plan|Your schedule options|Longer sessions|over your \d+ min/i.test(md), n + ': time-fitting copy in the printed plan');
      }
    });

    it('CT-01: a session length in an old intake changes nothing in the plan (it is ignored with one warning)', () => {
      for (const n of ['06', '08']) {
        const a = planOf(n);
        for (const min of [30, 45, 120]) {
          const b = generate(sample(n, i => { i.schedule.session_minutes = min; }), model);
          assert.ok(b.meta.warnings.some(w => w.key === 'warning.session_minutes_retired'));
          assert.deepEqual(b.weeks.map(w => w.days.map(d => itemsOf(d).map(it => [it.slot_id, it.exercise_id, it.sets]))), a.weeks.map(w => w.days.map(d => itemsOf(d).map(it => [it.slot_id, it.exercise_id, it.sets]))));
        }
      }
    });
  });

  describe(`v0.5 templates and session size (${mname})`, () => {
    const dayTypes = (fam, d, variant) => model.dayTypes(model.template(fam, d), variant || null).day_types;
    const lifts = (dt, n) => dt.stations.filter(s => typeof s.rank === 'number' && !/^AP_/.test(s.bucket)).sort((a, b) => a.rank - b.rank).slice(0, n).map(s => s.bucket + (s.variant ? ':' + s.variant : ''));
    const inOrder = (dt) => dt.stations.filter(s => ['strength', 'accessories'].includes(s.block)).map(s => s.bucket);

    it('R4-SES-05: Day A = pull + knee dominant, Day B = push + hip dominant, slot for slot, in every full-body template', () => {
      for (const [fam, ds] of [['aesthetics', [2, 3, 4, 5, 6]], ['fat_loss_bootcamp', [2, 4]], ['no_equipment', [2, 4]]]) for (const d of ds) {
        const dts = dayTypes(fam, d);
        for (const [name, dt] of Object.entries(dts)) {
          if (dt.kind !== 'main' || dt.format === 'circuit' || (fam === 'aesthetics' && d === 3 && name === 'C')) continue;
          const six = inOrder(dt).slice(0, 6);
          assert.deepEqual(six, dt.lower_focus === 'knee' ? A_DAY : B_DAY, `${fam}.${d} ${name}`);
          // the pairs: knee dominant + pull, hip dominant + push (UNI-11, ORD-06)
          const st = dt.stations.filter(s => ['strength', 'accessories'].includes(s.block));
          assert.equal(st[0].pair, st[1].pair); assert.ok(st[0].pair);
          assert.equal(st[2].pair, st[3].pair); assert.ok(st[2].pair); assert.notEqual(st[0].pair, st[2].pair);
          assert.equal(st[1].role, 'work');
          // the 7th exercise of his sheets: calves on the A day, the side raise on the B day (OBSERVED BYOP)
          assert.equal(st[6].bucket + (st[6].variant ? ':' + st[6].variant : ''), dt.lower_focus === 'knee' ? 'ISO_CALF' : 'ISO_SIDE_REAR_DELT:side');
          assert.deepEqual(st.map(s => s.rank), st.map((_, i) => i + 1));
          assert.ok(st.length <= 8, 'up to 8 slots');
        }
      }
      // the heavy squat and the heavy deadlift sit on different days, once per pattern per week (R2-SES-01)
      const a4 = dayTypes('aesthetics', 4);
      const axial = (b) => Object.entries(a4).filter(([, dt]) => dt.stations.some(s => s.bucket === b && s.axial === 'axial')).map(([k]) => k);
      assert.deepEqual(axial('RP_BKD'), ['A1']); assert.deepEqual(axial('RP_BHD'), ['B2']);
    });

    it('R4-SES-05: push / pull / legs as in his sheet (BYOP PUSHPULLLEGS), and his 3-day builder day 3', () => {
      const ppl = dayTypes('aesthetics', 6, 'ppl_x2');
      assert.deepEqual(inOrder(ppl.Push).slice(0, 7), ['RP_HPUSH', 'RP_VPUSH', 'RP_HPUSH', 'ISO_CHEST', 'RP_HPUSH', 'ISO_TRICEP', 'ISO_TRICEP']);
      assert.deepEqual(ppl.Pull.stations.filter(s => ['strength', 'accessories'].includes(s.block)).slice(0, 7).map(s => s.bucket + (s.variant ? ':' + s.variant : '')),
        ['RP_HPULL', 'RP_HPULL', 'RP_VPULL', 'ISO_SIDE_REAR_DELT:side', 'ISO_SIDE_REAR_DELT:rear', 'ISO_BICEP', 'ISO_BICEP']);
      assert.deepEqual(inOrder(ppl['Legs 1']), ['RP_BKD', 'RP_BHD', 'RP_UKD', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'RP_UHD', 'ISO_CALF', 'FOCUS']);
      assert.deepEqual(inOrder(ppl['Legs 2']).slice(0, 2), ['RP_BHD', 'RP_BKD']);
      assert.equal(ppl['Legs 1'].count, 8);
      const c = dayTypes('aesthetics', 3).C;
      assert.deepEqual([...new Set(inOrder(c).slice(0, 5))].sort(), ['RP_BHD', 'RP_BKD', 'RP_HPULL', 'RP_HPUSH', 'RP_UKD']);
    });

    it('R4-SES-05: athletic days = the athletic block, then the same A / B lifts (BYOP ATHLETIC - FULL BODY)', () => {
      for (const d of [2, 4, 5, 6]) for (const [name, dt] of Object.entries(dayTypes('athletic', d))) {
        if (dt.kind !== 'main') continue;
        const ath = dt.stations.filter(s => /^AP_/.test(s.bucket));
        assert.ok(ath.length >= 2, `athletic.${d} ${name}: an athletic block`);
        const first = dt.stations.findIndex(s => /^RP_|^ISO_/.test(s.bucket));
        assert.ok(dt.stations.slice(first).every(s => !/^AP_/.test(s.bucket)), 'power before strength: the athletic block comes first');
        assert.deepEqual(inOrder(dt).filter(b => !['ISO_BICEP', 'ISO_TRICEP'].includes(b)).slice(0, 5), dt.lower_focus === 'knee' ? ['RP_HPULL', 'RP_BKD', 'RP_VPULL', 'RP_UKD', 'ISO_QUAD'] : ['RP_HPUSH', 'RP_BHD', 'RP_VPUSH', 'RP_UHD', 'ISO_LEG_FLEXION']);
        // (engine 0.6 selection, converted - DECISIONS G-130: R4-SES-05 slot 5 is in the athletic A / B days, for a sport whose
        // profile writes direct arm sets; his athletic sheet has none, round 4 is newer)
        const arm = dt.stations.filter(s => ['ISO_BICEP', 'ISO_TRICEP'].includes(s.bucket));
        assert.ok(arm.every(s => s.condition === 'if_athletic_arm_sets'), 'the arm slot is the competitive athlete\'s, by profile');
      }
      assert.equal(lifts(dayTypes('athletic', 4).A1, 5).join(), 'RP_HPULL,RP_BKD,RP_VPULL,RP_UKD,ISO_QUAD');
    });

    it('R4-SES-02: a generated session holds its client type\'s exercise count (warm-up, the 2 core exercises, joint care and cardio outside it)', () => {
      // (v0.5 fix round 1, R4-SES-05 'a 7th-8th exercise is an extra small exercise at the end' / VOL-07 / sample 06 major: a training
      // day whose isolation exercise holds 3 sets may take an 8th, second small-muscle exercise - rules.placement.x1.main_day_extra)
      const expect = { '06': [7, 8], '07': [7, 8], '05': 7 };
      for (const n of SAMPLES) {
        const p = planOf(n), size = p.meta.session_size;
        assert.ok(size && size.range.length === 2);
        for (const w of [p.weeks[0], p.weeks[p.weeks.length - 1]]) for (const d of w.days.filter(x => x.kind === 'main')) {
          assert.ok(d.exercise_count <= size.range[1], `${n} ${d.weekday}: ${d.exercise_count} exercises for a ${size.type} session (max ${size.range[1]})`);
          assert.ok(d.exercise_count >= 4, `${n} ${d.weekday}: ${d.exercise_count} exercises`); // (a class day's template holds 4-5 lifts next to its skill and WOD)
          const core = itemsOf(d).filter(it => it._block === 'core');
          assert.equal(core.length, 2, `${n} ${d.weekday}: the 2 core exercises, first`);
          const e = expect[n];
          if (e) assert.ok([].concat(e).includes(d.exercise_count), `${n} ${d.weekday}: ${d.exercise_count}`);
        }
      }
      // older adults 60+: 5-6
      const old = generate(sample('06', i => { i.age = 64; i.priority_muscles = []; }), model);
      assert.deepEqual(old.meta.session_size.range, [5, 6]);
      for (const d of old.weeks[0].days.filter(x => x.kind === 'main')) assert.equal(d.exercise_count, 6);
    });

    it('R4-SES-05: a generated 4-day week is A, B, optional, A, B, optional with the template\'s lifts in order', () => {
      const p = planOf('06', i => { i.priority_muscles = []; }, 'nofocus');
      const w = p.weeks[0];
      assert.deepEqual(w.days.map(d => d.weekday + ':' + d.kind), ['Mon:main', 'Tue:main', 'Wed:optional', 'Thu:main', 'Fri:main', 'Sat:optional']);
      for (const wd of ['Mon', 'Thu']) assert.deepEqual(liftBuckets(w.days.find(d => d.weekday === wd)), [...A_DAY, 'ISO_CALF']);
      for (const wd of ['Tue', 'Fri']) assert.deepEqual(liftBuckets(w.days.find(d => d.weekday === wd)), [...B_DAY, 'ISO_SIDE_REAR_DELT']);
      // core first, horizontal before vertical, and the same exercises for the whole exercise block
      for (const d of w.days.filter(x => x.kind === 'main')) assert.equal(d.blocks.filter(b => b.kind !== 'warmup')[0].kind, 'core');
      const ids = (wk) => wk.days.map(d => itemsOf(d).filter(it => it.exercise_id).map(it => it.slot_id + '=' + it.exercise_id).join());
      assert.deepEqual(ids(p.weeks[1]), ids(p.weeks[0])); assert.deepEqual(ids(p.weeks[3]), ids(p.weeks[0]));
    });

    it('R4-SES-04: nothing is dropped automatically - every template lift is in the plan every week, and the easiest to remove are only named', () => {
      for (const n of ['06', '07', '02']) {
        const p = planOf(n);
        const d = p.meta.derived, sh = p.shape;
        const layout = buildWeekLayout(d, buildShape(d, model), sh.training_blocks[0], model);
        const want = layout.days.filter(x => x.kind === 'main').flatMap(x => x.blocks.flatMap(b => b.slots)).filter(s => /^RP_|^ISO_/.test(s.bucket)).map(s => s.slot_id);
        assert.ok(want.length >= 20);
        for (const w of p.weeks) {
          const have = new Map(w.days.flatMap(x => itemsOf(x)).map(it => [it.slot_id, it]));
          // (v0.5 fix round 1, R2-PER-07 'tested in the last week instead of that week's top sets': in a test week the tested lift's
          // sets are its top set - the test - plus its back-off sets)
          for (const id of want) { assert.ok(have.has(id), `${n} week ${w.n}: ${id} missing`); const top = have.get(id + '.test'); assert.ok(have.get(id).sets + (top ? top.sets : 0) >= 2, `${n} week ${w.n}: ${id} below 2 sets`); }
        }
        // the hints: accessories, extra stations and finishers - never the core block, a work lift or its pair
        const hints = p.weeks[0].days.flatMap(x => x.easy_to_remove.map(h => ({ ...h, item: itemsOf(x).find(it => it.slot_id === h.slot_id) })));
        assert.ok(hints.length > 0);
        for (const h of hints) { assert.ok(h.item, h.slot_id); assert.ok(!['core_block', 'work', 'paired_upper'].includes(h.item.role), `${n}: ${h.slot_id} (${h.item.role}) listed as easy to remove`); }
        assert.ok(hints.every(h => R.session.easy_to_remove.order.includes(h.kind)));
      }
      assert.equal(R.session.easy_to_remove.automatic, false);
    });
  });

  describe(`v0.5 targets (${mname})`, () => {
    const D9 = (n, mut) => deriveValues(sample(n, mut), model).D9_start_sets;
    const pair = (t) => Object.fromEntries(t.lines.map(l => [l, [t.start[l], t.cap[l]]]));

    it('R3-SES-01 / R2-VOL-06: start -> final sets per line for the 8 samples (one target per group; the floor of 10 from 3 training days)', () => {
      // (v0.5 fix round 1, VOL-18 'we need to balance this out' / samples 02 / 03 majors 'shoulders 10 -> 16 against chest and back
      // 10 -> 13': an athlete's shoulders line takes the upper-body factor of the sport and never ends above the back's final sets -
      // rules.volume.x1.shoulders_athlete, PROPOSED)
      assert.deepEqual(pair(D9('01')), { quads: [11, 16], hamstrings: [11, 16], chest: [10, 14], lats_upper_back: [15, 21], shoulders: [10, 14], calves: [9, 11] });
      assert.deepEqual(pair(D9('02')), { quads: [14, 18], hamstrings: [14, 18], chest: [10, 13], lats_upper_back: [10, 13], shoulders: [10, 13], calves: [12, 14] });
      // (engine 0.6, converted - DECISIONS G-113: the class member's arms and shoulders end at floor + 2, chest and back at 15)
      assert.deepEqual(pair(D9('04')), { quads: [12, 18], hamstrings: [12, 18], chest: [12, 15], lats_upper_back: [12, 15], shoulders: [10, 12], biceps: [10, 12], triceps: [10, 12], calves: [6, 8] });
      // Focus glutes + shoulders (R3-SES-01): + 2 on the start and on the ceiling; hips is ONE group - its target is the glutes line here
      // (engine 0.6, converted - DECISIONS G-111: the non-Focus big groups of an advanced 4-day A / B physique week start at 16)
      assert.deepEqual(pair(D9('06')), { quads: [16, 25], glutes: [22, 27], chest: [16, 25], lats_upper_back: [16, 25], shoulders: [17, 27], biceps: [15, 25], triceps: [15, 25], calves: [6, 25] });
      assert.deepEqual(pair(D9('07')), { quads: [20, 25], hamstrings: [20, 25], chest: [22, 27], lats_upper_back: [22, 27], shoulders: [15, 25], biceps: [15, 25], triceps: [15, 25], calves: [6, 25] });
      for (const n of SAMPLES) {
        const t = D9(n);
        // one target line per group (ENGINE_V05_PLAN allocation step 1)
        const groups = t.lines.map(l => X.groupOfLine[l]);
        assert.equal(new Set(groups).size, groups.length, n + ': one line per group');
        for (const l of t.lines) assert.ok(t.cap[l] >= t.start[l]);
      }
      // the floor lifts a field athlete's chest and back to 10 (3+ days); the swimmer's pull >= 1.5 x push stays (D-09)
      assert.equal(D9('02').start.chest, 10); assert.ok(D9('01').start.lats_upper_back >= 1.5 * D9('01').start.chest);
      assert.deepEqual(D9('02').floor_groups, ['quads', 'hips', 'chest', 'back', 'shoulders', 'calves']);
    });

    it('R4-SES-03: two training days - every big group at about 6-8 weekly sets, no floor of 10, pain still wins', () => {
      const t = D9('08');
      assert.equal(t.two_day, true);
      assert.deepEqual(R.volume.two_day.weekly_sets, [6, 8]);
      // (v0.5 fix round 1, VOL-17 '3 sets of calves every time they do legs' / sample 08 major: both leg days keep their calf exercise -
      // 3 + 3 = 6 - where the count of 8 used to drop the slot)
      assert.deepEqual(pair(t), { quads: [4, 8], hamstrings: [6, 8], chest: [6, 8], lats_upper_back: [6, 8], shoulders: [6, 8], biceps: [6, 8], triceps: [6, 8], calves: [6, 8] });
      assert.deepEqual(t.floor_groups, [], 'the floor of 10 applies from 3 training days');
      assert.ok((t.why.chest || []).some(w => w.key === 'why.two_day_rule' && w.ref === 'R4-SES-03'));
      assert.ok(t.pain_muscles.includes('quads'), 'the knee: quads start lower (pain wins)');
      // the same person on 3 days is back on the floor of 10
      const t3 = D9('08', i => { i.schedule.days_per_week = 3; i.schedule.weekdays = ['Mon', 'Tue', 'Thu']; i.activity.play_days = ['Sat', 'Sun']; });
      assert.equal(t3.two_day, false); assert.equal(t3.start.chest, 10);
      // every level: a 2-day aesthetics plan runs 6 -> 8 too
      const a2 = D9('06', i => { i.schedule.days_per_week = 2; i.schedule.weekdays = ['Mon', 'Thu']; i.priority_muscles = []; });
      for (const l of ['quads', 'hamstrings', 'chest', 'lats_upper_back']) assert.deepEqual([a2.start[l], a2.cap[l]], [6, 8]);
    });

    it('R4-PRG-04: the next block starts about 5 % above the last start in whole sets, never above the level\'s top; an unfinished block repeats its start', () => {
      const base = D9('06', i => { i.priority_muscles = []; });
      const next = (count, extra) => D9('06', i => { i.priority_muscles = []; i.plan.previous_cycles = { count, last_block_finished: true, ...(extra || {}) }; });
      // (engine 0.6, converted - DECISIONS G-111: an advanced physique client's non-Focus big groups on a 4-day A / B week start at 16)
      assert.equal(base.start.quads, 16); assert.equal(base.cap.quads, 25);
      assert.equal(next(1).start.quads, 17);                  // 16 x 1.05 = 16.8 -> 17
      assert.equal(next(2).start.quads, 18);                  // 17 x 1.05 = 17.85 -> 18
      assert.equal(next(3).start.quads, 19);                  // 18 x 1.05 = 18.9 -> 19
      assert.equal(next(1).start.biceps, 16);                 // 15 x 1.05 = 15.75 -> 16
      for (const k of [1, 2, 3]) {
        const t = next(k);
        for (const l of t.lines) { assert.equal(t.cap[l], base.cap[l], 'the level top does not grow with finished blocks'); assert.ok(t.start[l] <= t.cap[l]); assert.ok(t.start[l] >= base.start[l]); }
      }
      // (at the top the sets stay, CX-03: tests/progression/prescription.test.mjs 'R4-PRG-04'; the intake counts up to 3 finished blocks)
      assert.ok((next(1).why.quads || []).some(w => w.key === 'why.next_block_start' && w.ref === 'R4-PRG-04'));
      assert.equal(next(2, { last_block_finished: false }).start.quads, 16, 'same start when the last block was not finished (R3-PER-02)');
      // a year plan's later stairway blocks follow the same rule
      const d = deriveValues(sample('06', i => { i.priority_muscles = []; }), model);
      const up = stairwayPlan(d.D9_start_sets, { n: 2, type: 'stairway', stair_N: 12, factor: { cycle_step: 1 } }, d, model);
      assert.equal(up.T.quads[0], 17); assert.equal(up.T.quads[11], 25);
    });

    it('VOL-17: calves - one exercise x 3 sets on a leg day; the optional-day Calves slots carry the rest (no 4th set is squeezed in)', () => {
      assert.deepEqual([0, 1, 2, 3, 4, 5].map(n => calvesFloor(model, n)), [0, 3, 6, 9, 10, 10]);
      assert.equal(calvesFloor(model, 2, 2), 10); assert.equal(calvesFloor(model, 2, 1), 9);
      const p = planOf('06');
      for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) for (const it of itemsOf(d).filter(x => x.bucket === 'ISO_CALF')) assert.equal(it.sets, 3);
      // his A / B week: calves on the two A days (3 + 3) and on the two optional days (2-3 each): 10 -> 12
      assert.deepEqual([p.weeks[0].weekly_sets_by_group.calves, p.weeks[11].weekly_sets_by_group.calves], [10, 12]);
    });
  });

  describe(`v0.5 stairway and allocation (${mname})`, () => {
    const tb = (N) => ({ n: 1, type: 'stairway', stair_N: N, factor: null });
    const bt = (S, C, pain) => ({ start: { chest: S }, cap: { chest: C }, pain_muscles: pain ? ['chest'] : [], priority: [] });
    const dAny = deriveValues(sample('06'), model);

    it('CX-01 / R4-PRG-01: whole-set stairways keep the coach\'s lambda numbers, reach the planned final sets in the last week and never drop', () => {
      const run = (S, C, N) => stairwayFrom(bt(S, C), tb(N), dAny, model);
      assert.equal(Math.round(run(10, 14, 12).lambda.chest * 100) / 100, 0.76);    // L1
      assert.equal(Math.round(run(15, 22, 12).lambda.chest * 1000) / 1000, 0.867); // L2
      assert.equal(Math.round(run(20, 25, 12).lambda.chest * 1000) / 1000, 0.501); // L3
      assert.deepEqual(run(15, 22, 12).T.chest, [15, 15, 16, 16, 17, 17, 18, 19, 19, 20, 21, 22]);
      for (const [S, C, N] of [[10, 14, 12], [15, 22, 12], [20, 25, 12], [15, 22, 8], [10, 14, 8], [12, 22, 6], [10, 30, 4], [10, 11, 12], [26, 30, 16]]) {
        const T = run(S, C, N).T.chest;
        assert.equal(T.length, N); assert.equal(T[0], S); assert.equal(T[N - 1], C);
        assert.equal(T.indexOf(C), N - 1, `${S}->${C} in ${N} weeks reaches ${C} in the last week only: ${T.join(' ')}`);
        for (let i = 1; i < N; i++) assert.ok(T[i] >= T[i - 1]);
        assert.ok(T.every(Number.isInteger));
      }
      // CX-01: a block too short for the default 3 % / 5 % steps still REACHES its target (v0.4 stopped at lambda 1)
      assert.ok(run(15, 22, 8).lambda.chest > 1);
      assert.equal(run(15, 22, 8).top.chest, 22);
    });

    it('R4-PRG-02: no hard limit - a week that adds more than about 15 % is noted; a single whole set never is', () => {
      const big = stairwayFrom(bt(10, 30), tb(4), dAny, model);
      assert.deepEqual(big.T.chest, [10, 13, 20, 30]);
      assert.deepEqual(big.noted.chest, [2, 3, 4]);
      assert.ok(Math.max(...big.steps.chest) > 0.45, 'about +50 % in one week is allowed');
      assert.deepEqual(stairwayFrom(bt(10, 11), tb(12), dAny, model).noted.chest, [], '10 -> 11 is one set: 10 %, never a note');
      assert.deepEqual(stairwayFrom(bt(15, 22), tb(12), dAny, model).noted.chest, []);
      assert.equal(R.stairway.progression.note_above, 0.15);
      // in a plan: the note is data on the week and a warning up front
      const p = generate(sample('06', i => { i.priority_muscles = []; i.plan.mode = 'fixed_8'; }), model);
      const acc = p.weeks.flatMap(w => w.acceleration.map(a => ({ week: w.n, ...a })));
      for (const a of acc) { assert.ok(a.pct > 15); assert.ok(a.total || a.to - a.from >= 2 - EPS); }
      assert.deepEqual(p.summary.acceleration, acc);
      assert.equal(p.meta.warnings.filter(w => /^warning\.acceleration/.test(w.key)).length, acc.length);
    });

    it('VOL-03 pain: a pain area holds for its freeze weeks, then climbs slowly to where those steps take it (never above its ceiling)', () => {
      const p = stairwayFrom(bt(8, 14, true), tb(12), dAny, model);
      assert.deepEqual(p.T.chest.slice(0, 3), [8, 8, 8]);
      assert.ok(p.top.chest > 8 && p.top.chest < 14);
      assert.equal(p.T.chest[11], p.top.chest);
    });

    it('CX-01 / R4-PRG-01: the 8 samples - every trained group reaches its final sets in the last week, on a whole-set schedule that never drops', () => {
      for (const n of SAMPLES) {
        const p = planOf(n);
        assert.equal(p.validation.ok, true, n + ': ' + JSON.stringify(p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => [c.id, c.violations[0]])));
        for (const b of p.meta.stairway) {
          const ws = p.weeks.filter(w => w.training_block === b.training_block);
          if (b.circuit) { assert.deepEqual(b.groups, []); continue; }
          assert.ok(b.groups.length >= 4, n + ': trained groups');
          // (v0.5 fix round 1, R4-PRG-01 'reach the top in the last week, one week early at most' / R3-VOL-04; samples 01 / 06 / 08: every
          // group took its last set in the same final week - '+6 in the MYO week'. The last steps are shared between the last two
          // weeks: at most half of the climbing groups arrive a week early - rules.stairway.progression.stagger)
          const EARLY = R.stairway.progression.stagger && R.stairway.progression.stagger.enabled ? R.stairway.progression.stagger.weeks_early : 0;
          // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): a block that ends with a strength-test week reaches its
          // final sets the week before and holds them through the test week (sample 04 minor 'the end-test week is also the
          // biggest week'; R4-PRG-01 'arriving one week early and holding is fine'; rules.placement.x2.end_test_week_hold) - 'the
          // last week' is then the last week before the tests
          const HOLD = R.placement.x2.end_test_week_hold && ws[ws.length - 1].days.some(d => d.blocks.some(bl => bl.items.some(it => it.role === 'test' && /\.test$/.test(it.slot_id)))) ? 1 : 0;
          const climbing = b.groups.filter(g => b.group_top[g] > b.group_start[g]);
          const early = climbing.filter(g => b.schedule[g].indexOf(b.group_top[g]) < b.schedule[g].length - 1 - HOLD);
          assert.ok(early.length <= Math.ceil(climbing.length / 2), `${n}: ${early.length} of ${climbing.length} groups arrive early`);
          for (const g of b.groups) {
            const sc = b.schedule[g], N = sc.length, top = b.group_top[g], start = b.group_start[g];
            assert.equal(N, ws.length); assert.equal(sc[0], start); assert.equal(sc[N - 1], top);
            for (let i = 1; i < N; i++) assert.ok(sc[i] >= sc[i - 1]);
            if (top > start) { assert.ok(sc.indexOf(top) >= N - 1 - EARLY - HOLD, `${n} ${g}: ${sc.join(' ')}`); assert.equal(b.arrival_week[g], sc.indexOf(top) + 1); } else assert.equal(b.arrival_week[g], null);
            // the plan's items hold the schedule every week (helper credit may add a fraction; never a whole set of drift below)
            ws.forEach((w, i) => {
              const have = groupSets(w)[g] || 0;
              assert.ok(have >= sc[i] - EPS, `${n} ${g} week ${w.n}: ${have} < ${sc[i]}`);
              assert.equal(w.target_by_group[g], sc[i]);
              assert.ok(Math.abs(have - w.weekly_sets_by_group[g]) < 0.011, 'the printed weekly sets are the credited count of the items (allocation step 4)');
              if (i) assert.ok(have >= (groupSets(ws[i - 1])[g] || 0) - 0.5 - EPS, `${n} ${g}: sets drop in week ${w.n}`);
            });
            assert.ok(groupSets(ws[N - 1])[g] >= top - EPS, `${n} ${g}: the final target ${top} is reached`);
            assert.ok(top <= Math.max(b.planned_top[g], start));
          }
        }
      }
    });

    it('floor of 10 (3+ training days): every trained group of the full-body, split and athletic samples holds 10 weekly sets every week, or the plan says so', () => {
      for (const n of ['01', '02', '03', '04', '06', '07']) {
        const p = planOf(n), b = p.meta.stairway[0];
        const floored = (p.meta.targets.floor_groups || []).filter(g => b.groups.includes(g) && g !== 'calves');
        assert.ok(floored.length >= 4);
        for (const w of p.weeks.filter(x => x.training_block === b.training_block)) for (const g of floored) {
          if (b.below_floor.includes(g)) { assert.ok(p.meta.warnings.some(x => x.key === 'warning.below_floor_template' && x.args.group === g)); continue; }
          assert.ok((groupSets(w)[g] || 0) >= 10 - EPS, `${n} ${g} week ${w.n}: ${groupSets(w)[g]}`);
        }
        assert.deepEqual(b.below_floor, [], n + ': no trained group under the floor');
      }
    });

    it('R4-SES-03: two training days - one A day and one B day train every big group at 6-8 sets, the plan says so and suggests a third day', () => {
      const p = planOf('08');
      const w2 = p.meta.warnings.find(w => w.key === 'warning.two_day_rule');
      assert.deepEqual(w2.args, { days: 2, low: 6, high: 8, suggest: 3 });
      assert.deepEqual(p.meta.two_day, { weekly_sets: [6, 8], suggest_days: 3 });
      const b = p.meta.stairway[0];
      for (const g of ['quads', 'hips', 'back', 'chest']) assert.ok(b.groups.includes(g), g + ' is trained (never fewer groups)');
      for (const w of p.weeks) for (const g of ['quads', 'hips', 'back', 'chest']) {
        const v = groupSets(w)[g];
        assert.ok(v >= 6 - EPS && v < 10, `week ${w.n} ${g}: ${v}`);
      }
      const mains = p.weeks[0].days.filter(d => d.kind === 'main');
      assert.equal(mains.length, 2);
      // one A day and one B day: the four compound slots of each, in the template's order (the knee-friendly pick of a slot may be a
      // single-leg lift - the slot stays)
      const roles = (d) => itemsOf(d).filter(it => it._block === 'strength' && it.role !== 'test').map(it => it.role);
      assert.deepEqual(roles(mains[0]), ['paired_upper', 'work', 'paired_upper', 'secondary']);
      assert.deepEqual(roles(mains[1]), ['paired_upper', 'work', 'paired_upper', 'secondary']);
      assert.deepEqual(liftBuckets(mains[0]).filter(x => /^RP_.(PULL)/.test(x)), ['RP_HPULL', 'RP_VPULL']);
      assert.deepEqual(liftBuckets(mains[1]).filter(x => /^RP_.(PUSH)/.test(x)), ['RP_HPUSH', 'RP_VPUSH']);
      for (const d of mains) assert.ok(d.exercise_count <= p.meta.session_size.range[1], 'never more exercises');
      assert.match(renderPlan(p, model, { lang: 'en', view: 'full' }), /third training day/i);
      assert.match(renderPlan(generate(sample('08', i => { i.lang = 'es'; i.release.lang = 'es'; }), model), model, { lang: 'es', view: 'full' }), /tercer día/i);
    });

    it('allocation steps 2-3 (VOL-07, R3-VOL-03): 2-5 sets an exercise (2-4 for L1), the exercise with the fewest sets first, exposures alternating', () => {
      for (const n of SAMPLES) {
        const p = planOf(n);
        const L = p.meta.level.client, max = R.placement.max_sets_per_exercise[L];
        assert.deepEqual(R.placement.max_sets_per_exercise, { L1: 4, L2: 5, L3: 5 });
        for (const w of p.weeks.filter(x => x.block_type === 'stairway')) for (const d of w.days) for (const it of itemsOf(d)) {
          if (!['strength', 'accessories'].includes(it._block) || it.role === 'test' || typeof it.sets !== 'number' || !it.exercise_id) continue;
          if (it.sets === 1 && itemsOf(d).some(x => x.role === 'test' && x.slot_id === it.slot_id + '.test')) continue; // the test top set replaces one set
          assert.ok(it.sets >= 2 - (w.test ? 1 : 0) && it.sets <= max, `${n} week ${w.n} ${it.slot_id}: ${it.sets} sets (L ${L})`);
        }
      }
      // a group's sets inside a day follow the template order: an exercise never holds more than the one before it by 2, and the
      // two exposures of a day type stay within one set of each other
      const p = planOf('07');
      for (const w of p.weeks) {
        const days = w.days.filter(d => d.kind === 'main');
        const setsOf = (wd, g) => itemsOf(days.find(d => d.weekday === wd)).filter(it => it.group === g && it.role !== 'test' && ['strength', 'accessories'].includes(it._block)).reduce((a, it) => a + it.sets, 0);
        for (const [a, z, g] of [['Mon', 'Thu', 'chest'], ['Tue', 'Fri', 'back'], ['Wed', 'Sat', 'quads']]) assert.ok(Math.abs(setsOf(a, g) - setsOf(z, g)) <= 1 + (w.test ? 1 : 0), `week ${w.n} ${g}: ${setsOf(a, g)} vs ${setsOf(z, g)}`);
      }
    });

    it('allocation step 3: a group the main days cannot hold gets the bonus exercise on the optional day; with no optional day it is capped and the plan says so', () => {
      const p = planOf('06'), b = p.meta.stairway[0];
      assert.ok(b.bonus.length >= 1);
      const optDays = new Set(p.weeks[0].days.filter(d => d.kind === 'optional').map(d => d.weekday));
      // (v0.5 fix round 1, VOL-16 / VOL-07 / R4-SES-05 'a 7th-8th exercise is an extra small exercise at the end'; sample 06 major: an
      // isolation exercise of a training day holds 3 sets, so the bonus exercise runs 2 -> 4 on the optional day -
      // rules.placement.bonus.sets - and what is still left goes to an 8th, second small-muscle exercise at the end of a training
      // day that already trains the group - rules.placement.x1.main_day_extra, 2-3 sets)
      const MX = R.placement.x1.main_day_extra;
      assert.ok(b.bonus.some(x => optDays.has(x.slot_id.split('.')[0])), 'the optional day carries a bonus exercise');
      for (const { group, slot_id } of b.bonus) {
        const onOpt = optDays.has(slot_id.split('.')[0]);
        if (!onOpt) assert.ok(MX.groups.includes(group), `${slot_id}: a main-day extra for ${group}`);
        assert.match(slot_id, /\.x\d\d$/);
        const first = p.weeks.find(w => w.days.some(d => itemsOf(d).some(it => it.slot_id === slot_id)));
        const eb = p.shape.exercise_blocks.find(e => e.n === first.exercise_block);
        assert.equal(first.n, eb.weeks[0], 'it opens with an exercise block (exercises stay fixed inside a block)');
        for (const w of p.weeks.filter(x => x.n >= first.n)) {
          const it = w.days.flatMap(d => itemsOf(d)).find(x => x.slot_id === slot_id);
          const top = onOpt ? R.placement.bonus.sets[1] : MX.sets[1];
          assert.ok(it && it.origin === 'bonus' && it.group === group && it.sets >= 2 && it.sets <= top, `${slot_id} w${w.n}: ${it && it.sets}`);
          assert.ok(it.why.some(x => x.key === (onOpt ? 'why.bonus_optional_day' : 'why.extra_small_exercise')), slot_id);
        }
      }
      for (const wd of optDays) assert.ok(b.bonus.filter(x => x.slot_id.startsWith(wd + '.')).length <= R.placement.bonus.max_added_per_optional_day);
      // capped and said: the planned final sets, what the template holds
      for (const c of b.capped) {
        assert.ok(c.held < c.planned);
        assert.equal(b.group_top[c.group], c.held);
        assert.ok(c.notice === false || p.meta.warnings.some(w => w.key === 'warning.capped_by_template' && w.args.group === c.group && w.args.held === c.held && w.args.planned === c.planned)) /* fix round 1, CX-04: capped[].notice - the table names every capped group */;
      }
      // push / pull / legs has no optional day: no bonus exercise anywhere
      const ppl = planOf('07');
      // (v0.5 fix round 1, R2-VOL-04 / sample 07 major 'an advanced bodybuilder gets 4 direct side-delt sets a week': with no optional
      // day the only added exercise is the 8th, second small-muscle exercise at the end of a training day that already trains the
      // group - rules.placement.x1.main_day_extra)
      for (const x of ppl.meta.stairway[0].bonus) assert.ok(MX.groups.includes(x.group), JSON.stringify(x));
      for (const w of ppl.weeks) for (const d of w.days) for (const it of itemsOf(d).filter(x => x.origin === 'bonus')) {
        assert.equal(d.kind, 'main');
        assert.ok(MX.groups.includes(it.group) && it.sets >= MX.sets[0] && it.sets <= MX.sets[1], `w${w.n} ${it.slot_id} ${it.sets}`);
        assert.ok(itemsOf(d).some(o => o !== it && o.origin === 'template' && (groupCredits(model, o.credits || {})[it.group] || 0) >= 1), `w${w.n} ${it.slot_id}: the day already trains ${it.group}`);
      }
    });

    it('allocation (crafted): the block is capped at what its slots hold when there is no optional day, and week 1 already says so', () => {
      const d0 = deriveValues(sample('07'), model), sh = buildShape(d0, model);
      const layouts = sh.training_blocks.map(t => buildWeekLayout(d0, sh, t, model));
      // every station filled by the first default record of its bucket (tests/helpers/simple-layout.mjs)
      const sel = sh.exercise_blocks.map(eb => ({ exercise_block: eb.n, fills: Object.fromEntries(layouts[0].days.flatMap(x => x.blocks.flatMap(b => b.slots)).map(s => [s.slot_id, simpleFill(s, model)]).filter(([, f]) => f)), buy_list: [], why: [] }));
      const D9 = clone(d0.D9_start_sets);
      D9.start.calves = 6; D9.cap.calves = 6; D9.start.quads = 20; D9.cap.quads = 60; // far above what 2 leg days hold
      const vp = planWeeklySets({ derived: { ...d0, D9_start_sets: D9 }, shape: sh, layouts, selections: sel, model, fillSlot: (s) => simpleFill(s, model) });
      const b = vp.block_targets[0];
      const cap = b.capped.find(c => c.group === 'quads');
      // (engine 0.6.0, converted - COACH-CH5 CH5-03 'no cap until 35' / DECISIONS G-199: a group is never planned above 35 weekly sets)
      assert.ok(cap && cap.planned === model.rules.volume.x3.group_max.sets && cap.held < cap.planned, JSON.stringify(cap));
      assert.equal(b.group_top.quads, cap.held);
      assert.ok(vp.warnings.some(w => w.key === 'warning.capped_by_template' && w.args.group === 'quads'));
      assert.ok(vp.weeks[11].weekly_sets_by_group.quads >= cap.held - EPS);
      assert.deepEqual(b.bonus, []);
    });

    it('PRG-03 circuits: every station runs the week\'s rounds (3 / 4 / 5 by level), 5-7 stations a session, work seconds climb', () => {
      const p = planOf('05');
      const rounds = R.supersets.bootcamp.stairway.rounds_by_level[p.meta.level.client];
      // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): one more round in the last two weeks, inside his 3-5 -
      // rules.supersets.bootcamp.x2.rounds_late)
      const RL = R.supersets.bootcamp.x2.rounds_late;
      for (const w of p.weeks) {
        assert.equal(w.circuit.rounds, Math.min(R.supersets.bootcamp.rounds[1], rounds + (w.n > p.weeks.length - RL.last_weeks ? RL.add : 0)));
        for (const d of w.days.filter(x => x.kind === 'main')) {
          const st = d.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items);
          assert.ok(st.length >= 5 && st.length <= 7, `week ${w.n} ${d.weekday}: ${st.length} stations`);
        }
      }
      assert.ok(p.weeks[7].circuit.work_s > p.weeks[0].circuit.work_s);
      assert.equal(p.meta.stairway[0].circuit, true);
    });
  });

  describe(`v0.5 nothing dropped, everything said (${mname})`, () => {
    it('R4-SES-04: every main day of every sample keeps its work lift in every week (nothing is dropped for time)', () => {
      for (const n of ['01', '02', '03', '04', '06', '07', '08']) {
        const p = planOf(n);
        const w1 = p.weeks[0];
        for (const d of w1.days.filter(x => x.kind === 'main')) {
          const work = itemsOf(d).filter(it => it.role === 'work' && it.exercise_id).map(it => it.slot_id);
          if (!work.length) continue;
          for (const w of p.weeks.filter(x => x.training_block === w1.training_block)) {
            const dd = w.days.find(x => x.weekday === d.weekday);
            for (const id of work) assert.ok(itemsOf(dd).some(it => it.slot_id === id && it.sets > 0), `${n} w${w.n} ${id}`);
          }
        }
      }
    });

    it('R4-SES-04: a group the client type leaves to the compound lifts is named as credit only (the swimmer\'s biceps and triceps)', () => {
      const p = planOf('01');
      const st = p.meta.stairway[0];
      assert.deepEqual(st.credit_only_groups, ['biceps', 'triceps']);
      // (converted, G-202 / CH5-02: the swimmer's arms hold the slot-5 exercise, so they are said as held at its sets, not as credit only)
      assert.deepEqual(st.held_groups, ['biceps', 'triceps']);
      assert.ok(p.meta.warnings.some(w => w.key === 'warning.slot_held_groups' && w.args.group.includes('biceps')));
      for (const w of p.weeks) assert.deepEqual(w.credit_only_groups, w.block_type === 'stairway' ? ['biceps', 'triceps'] : w.credit_only_groups);
    });

    it('R4-SES-03: a 2-day maintenance plan says the 2-day rule and holds no line above 8 weekly sets', () => {
      const p = planOf('06', i => { i.schedule.days_per_week = 2; i.schedule.weekdays = ['Mon', 'Thu']; i.plan.mode = 'maintenance_4_6'; i.plan.maint_weeks = 4; i.plan.maint_reason = 'planned_maintenance'; i.priority_muscles = []; }, 'maint2');
      assert.equal(p.status, 'ok', JSON.stringify(p.errors));
      assert.ok(p.meta.two_day && p.meta.warnings.some(w => w.key === 'warning.two_day_rule'));
      for (const [l, v] of Object.entries(p.meta.targets.start)) if (typeof v === 'number' && l !== 'calves') assert.ok(v <= R.volume.two_day.weekly_sets[1], `${l} ${v}`);
      // a flat block's target is always one the week keeps; what the template cannot hold is said
      for (const w of p.weeks) for (const [g, t] of Object.entries(w.target_by_group)) if (typeof t === 'number') assert.ok(w.weekly_sets_by_group[g] >= t - 1e-9, `w${w.n} ${g} ${w.weekly_sets_by_group[g]} < ${t}`);
    });

    it('CX-01 / R4-SES-04: in a year plan every stairway block keeps its schedule every week; the flat cut quarter has top = start and no "capped" claim', () => {
      const p = planOf('06', i => { i.plan.mode = 'year'; }, 'year');
      assert.equal(p.status, 'ok', JSON.stringify(p.errors));
      assert.ok(p.meta.stairway.length >= 2);
      for (const st of p.meta.stairway) {
        const ws = p.weeks.filter(w => w.training_block === st.training_block);
        for (const g of st.groups) {
          st.schedule[g].forEach((v, i) => { assert.ok(ws[i].weekly_sets_by_group[g] >= v - 1e-9, `block ${st.training_block} ${g} w${ws[i].n}`); assert.equal(ws[i].target_by_group[g], v); });
          assert.equal(st.schedule[g][0], st.group_start[g]); assert.equal(st.schedule[g][st.N - 1], st.group_top[g]);
        }
      }
      const tb1 = p.shape.training_blocks[0];
      if (tb1.factor && tb1.factor.flat_sets) { const st = p.meta.stairway[0]; for (const g of st.groups) assert.equal(st.group_top[g], st.group_start[g], g); assert.deepEqual(st.capped, []); }
      for (const id of ['V15', 'V22', 'H21', 'H22']) assert.equal(p.validation.checks.find(c => c.id === id).pass, true, id);
    });

    it('R4-SES-02: a sport track never pushes a session past its size (stay-active 8, athletic 12) and opens a further station only when the block\'s lowest target holds it', () => {
      const p3 = planOf('03');
      // one throw station that climbs with the stairway (LIB-22, E-101), not two stations sitting at the peak from week 1
      const w1 = p3.weeks[0], w5 = p3.weeks[4];
      assert.ok(w5.athletic_budget.planned.throws > w1.athletic_budget.planned.throws, `${w1.athletic_budget.planned.throws} -> ${w5.athletic_budget.planned.throws}`);
      for (const n of ['01', '02', '03', '08']) { const p = planOf(n); assert.equal(p.validation.checks.find(c => c.id === 'V13').pass, true, n); for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) assert.ok(d.exercise_count <= p.meta.session_size.range[1], `${n} w${w.n} ${d.weekday} ${d.exercise_count}`); }
    });
  });

  describe(`v0.5 validator V3 (${mname})`, () => {
    it('CT-01 / R4-SES-01: V3 passes on every generated sample and fails a plan that carries a session length, a minute limit, a time check or a time offer', () => {
      for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) {
        const p = planOf(n);
        const v3 = p.validation.checks.find(c => c.id === 'V3');
        assert.equal(v3.pass, true, `${n}: ${JSON.stringify(v3.violations)}`);
        assert.equal(v3.severity, 'error');
      }
      const bad = (mut) => { const p = structuredClone(planOf('06')); mut(p); return validatePlan(p, model).checks.find(c => c.id === 'V3'); };
      assert.equal(bad(p => { p.meta.session_minutes = 60; }).pass, false);
      assert.equal(bad(p => { p.weeks[0].days[0].minutes_limit = 60; }).pass, false);
      assert.equal(bad(p => { p.time_check = { fits: true }; }).pass, false);
      assert.equal(bad(p => { p.offers = [{ key: 'offer.more_days', args: { days: 5 } }]; }).pass, false);
      assert.equal(bad(p => { p.meta.warnings.push({ code: 'long_day', key: 'warning.two_day_rule' }); }).pass, false);
    });
  });

  describe(`v0.5 plan edits (${mname})`, () => {
    const base = () => planOf('06');
    const find = (p, n, wd, id) => itemsOf(p.weeks[n - 1].days.find(d => d.weekday === wd)).find(it => it.slot_id === id);

    it('CX-04: a generated plan says it is not edited and its validation is its own', () => {
      const p = base();
      assert.equal(p.edited, false); assert.equal('edits' in p, false); assert.equal(p.validation.ok, true); assert.equal('edited' in p.validation, false);
    });

    it('CX-02 / CX-04: sets of any exercise on any day, in one week or in every week - totals recomputed, the plan marked edited, no stale validation', () => {
      const p = base();
      const before = JSON.stringify(p);
      const id = 'Mon.A1.s06';
      const was3 = find(p, 3, 'Mon', id).sets, was5 = find(p, 5, 'Mon', id).sets;
      const r = applyPlanEdits(p, [{ op: 'set_sets', weekday: 'Mon', slot_id: id, sets: was3 + 1, weeks: 3 }], model);
      assert.equal(JSON.stringify(p), before, 'the generated plan is never mutated');
      const q = r.plan;
      assert.equal(q.edited, true); assert.equal(r.edited, true); assert.equal(r.priorValidationDiscarded, true);
      assert.deepEqual(q.edits, [{ op: 'set_sets', weekday: 'Mon', slot_id: id, sets: was3 + 1, weeks: [3] }]);
      assert.equal(find(q, 3, 'Mon', id).sets, was3 + 1); assert.equal(find(q, 3, 'Mon', id).edited, true);
      assert.equal(find(q, 5, 'Mon', id).sets, was5, 'only week 3 changes');
      // recomputed totals: the week, the group, the muscle, the summary, the rise of that week and of the next
      assert.equal(q.weeks[2].total_resistance_sets, p.weeks[2].total_resistance_sets + 1);
      assert.equal(q.weeks[2].weekly_sets_by_group.quads, p.weeks[2].weekly_sets_by_group.quads + 1);
      assert.equal(q.weeks[2].weekly_sets_by_muscle.quads, p.weeks[2].weekly_sets_by_muscle.quads + 1);
      assert.equal(q.weeks[2].weekly_sets_by_muscle.glutes, p.weeks[2].weekly_sets_by_muscle.glutes + 0.25, 'helper credit recomputed too');
      assert.equal(q.summary.total_resistance_sets_by_week[2], p.summary.total_resistance_sets_by_week[2] + 1);
      assert.equal(q.summary.sets_by_group_by_week.quads[2], p.summary.sets_by_group_by_week.quads[2] + 1);
      assert.notEqual(q.weeks[2].rise_vs_prev, p.weeks[2].rise_vs_prev); assert.notEqual(q.weeks[3].rise_vs_prev, p.weeks[3].rise_vs_prev);
      assert.deepEqual(q.weeks[0], p.weeks[0], 'an untouched week is unchanged');
      // no stale validation: recomputed on the edited plan and stamped
      assert.equal(q.validation.edited, true); assert.notEqual(q.validation, p.validation);
      assert.deepEqual(q.validation.checks.map(c => c.id), p.validation.checks.map(c => c.id));
      assert.equal(q.validation.ok, true);
      assert.equal(q.meta.warnings[0].key, 'warning.plan_edited');
      assert.equal(q.summary.edited, true); assert.equal(q.weeks[2].edited, true);
      // every week at once
      const all = applyPlanEdits(p, [{ op: 'set_sets', weekday: 'Mon', slot_id: id, sets: 3 }], model).plan;
      assert.ok(all.weeks.every(w => find(all, w.n, 'Mon', id).sets === 3));
    });

    it('CX-04: remove an exercise, add an exercise - the day, the week and the credits follow', () => {
      const p = base();
      const rm = applyPlanEdits(p, [{ op: 'remove_exercise', weekday: 'Mon', slot_id: 'Mon.A1.s10' }], model);
      for (const w of rm.plan.weeks) {
        assert.equal(find(rm.plan, w.n, 'Mon', 'Mon.A1.s10'), undefined);
        const old = p.weeks[w.n - 1], gone = find(p, w.n, 'Mon', 'Mon.A1.s10');
        assert.equal(w.total_resistance_sets, old.total_resistance_sets - gone.sets);
        assert.equal(w.days.find(d => d.weekday === 'Mon').exercise_count, old.days.find(d => d.weekday === 'Mon').exercise_count - 1);
        assert.ok(!w.days.find(d => d.weekday === 'Mon').easy_to_remove.some(h => h.slot_id === 'Mon.A1.s10'));
        assert.ok(w.days.find(d => d.weekday === 'Mon').est_minutes < old.days.find(d => d.weekday === 'Mon').est_minutes, 'the estimate follows (information only)');
      }
      const add = applyPlanEdits(p, [{ op: 'add_exercise', weekday: 'Tue', exercise_id: 'cable-fly', sets: 3, weeks: [1, 2] }], model);
      const it = itemsOf(add.plan.weeks[0].days.find(d => d.weekday === 'Tue')).find(x => x.origin === 'edit');
      assert.equal(it.exercise_id, 'cable-fly'); assert.equal(it.sets, 3); assert.deepEqual(it.credits, { chest: 1 }); assert.match(it.slot_id, /^Tue\.edit\.e01$/);
      assert.ok(it.reps && it.effort && it.rest, 'the added exercise borrows the day\'s dose');
      assert.equal(add.plan.weeks[0].weekly_sets_by_group.chest, p.weeks[0].weekly_sets_by_group.chest + 3);
      assert.equal(add.plan.weeks[2].weekly_sets_by_group.chest, p.weeks[2].weekly_sets_by_group.chest, 'only weeks 1-2');
      assert.equal(add.plan.weeks[0].days.find(d => d.weekday === 'Tue').exercise_count, p.weeks[0].days.find(d => d.weekday === 'Tue').exercise_count + 1);
      // bands never come in through an edit: the catalog holds none (unknown ids are refused)
      assert.throws(() => applyPlanEdits(p, [{ op: 'add_exercise', weekday: 'Tue', exercise_id: 'banded-squat', sets: 3 }], model), /unknown exercise/);
    });

    it('CX-04 / R3-SES-02: a block switched off (core, accessories ...) leaves the totals; switched back on it returns', () => {
      const p = base();
      const off = applyPlanEdits(p, [{ op: 'set_block', weekday: 'Mon', block: 'accessories', on: false, weeks: [1] }], model);
      const d1 = off.plan.weeks[0].days.find(d => d.weekday === 'Mon'), d0 = p.weeks[0].days.find(d => d.weekday === 'Mon');
      const acc = d0.blocks.find(b => b.kind === 'accessories');
      assert.equal(d1.blocks.find(b => b.kind === 'accessories').on, false);
      assert.equal(off.plan.weeks[0].total_resistance_sets, p.weeks[0].total_resistance_sets - acc.items.reduce((a, it) => a + it.sets, 0));
      assert.equal(d1.exercise_count, d0.exercise_count - acc.items.length);
      assert.ok(off.plan.weeks[0].weekly_sets_by_group.biceps < p.weeks[0].weekly_sets_by_group.biceps);
      assert.equal(off.plan.validation.checks.find(c => c.id === 'V14').pass, true, 'credits agree with the items that are on');
      const on = applyPlanEdits(off.plan, [{ op: 'set_block', weekday: 'Mon', block: 'accessories', on: true, weeks: [1] }], model);
      assert.equal(on.plan.weeks[0].total_resistance_sets, p.weeks[0].total_resistance_sets);
      assert.deepEqual(on.plan.weeks[0].weekly_sets_by_group, p.weeks[0].weekly_sets_by_group);
      assert.equal(on.plan.edits.length, 2, 'the edit log keeps both steps');
      assert.equal(on.plan.edited, true, 'an edited plan stays marked even when the numbers are back');
    });

    it('CX-04: edits are never refused for breaking the template\'s rules and never repaired - the conflicts are listed with a class', () => {
      const p = base();
      const r = applyPlanEdits(p, [
        { op: 'set_sets', weekday: 'Mon', slot_id: 'Mon.A1.s06', sets: 9, weeks: [2] },
        { op: 'set_sets', weekday: 'Thu', slot_id: 'Thu.A2.s06', sets: 1, weeks: [6] }], model);
      assert.equal(find(r.plan, 2, 'Mon', 'Mon.A1.s06').sets, 9); assert.equal(find(r.plan, 6, 'Thu', 'Thu.A2.s06').sets, 1);
      const codes = (cls) => r.conflicts.filter(c => c.class === cls).map(c => c.code);
      assert.ok(codes('bound').includes('sets_above_max') && codes('bound').includes('sets_below_min'));
      assert.ok(codes('plan_shape').includes('group_sets_decreased'), 'week 3 drops back under week 2');
      assert.ok(r.conflicts.every(c => ['bound', 'plan_shape', 'info'].includes(c.class) && typeof c.week === 'number'));
      // other sets are never moved to compensate
      for (const w of r.plan.weeks) for (const d of w.days) for (const it of itemsOf(d)) {
        if ((w.n === 2 && it.slot_id === 'Mon.A1.s06') || (w.n === 6 && it.slot_id === 'Thu.A2.s06')) continue;
        assert.equal(it.sets, find(p, w.n, d.weekday, it.slot_id).sets);
      }
      // the checks that describe the generated template do not judge the edited plan; the safety checks still run
      const v = r.plan.validation;
      for (const id of ['V15', 'H21']) assert.equal(v.checks.find(c => c.id === id).pass, true);
      assert.equal(validatePlan(r.plan, model).checks.length, p.validation.checks.length);
      // malformed edits are refused (nothing is guessed)
      for (const e of [{ op: 'explode' }, { op: 'set_sets', weekday: 'Mon', slot_id: 'nope', sets: 3 }, { op: 'set_sets', weekday: 'Mon', slot_id: 'Mon.A1.s06', sets: -1 },
        { op: 'set_sets', weekday: 'Mon', slot_id: 'Mon.A1.s06', sets: 2.5 }, { op: 'set_sets', weekday: 'Mon', slot_id: 'Mon.A1.s06', sets: 3, weeks: [99] }, { op: 'set_block', weekday: 'Mon', block: 'core' }]) {
        assert.throws(() => applyPlanEdits(p, [e], model));
      }
      // an edited plan renders (no stale 'validated' text, no crash) and can be edited again
      assert.ok(renderPlan(r.plan, model, { lang: 'en', view: 'full' }).length > 1000);
      assert.equal(applyPlanEdits(r.plan, [{ op: 'set_sets', weekday: 'Mon', slot_id: 'Mon.A1.s06', sets: 4, weeks: [2] }], model).plan.edits.length, 3);
    });

    it('CX-04: an intake check still runs first - edits apply only to a generated plan', () => {
      assert.throws(() => applyPlanEdits({ schema: 'plan/2', status: 'invalid', weeks: [] }, [], model));
      assert.equal(validateIntake(sample('06'), model).ok, true);
      assert.ok(computeTargets);
    });
  });
}
