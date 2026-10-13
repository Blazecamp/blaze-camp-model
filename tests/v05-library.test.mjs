// tests/v05-library.test.mjs - engine 0.5.0, work package V2 (design/ENGINE_V05_PLAN.md "V2 library and selection").
// One test per new rule, named with its coach answer id:
//   COACH-R4 R4-LIB-01   the proposed exercises are optional add-ons, never a template pick (wall balls and sled pushes in HYROX /
//                        the CrossFit class WOD excepted); neck work stays proposed
//   R4-LIB-02            carries and sled work by distance or time, no muscle-set credit
//   R4-LIB-03            the mid-range pull category; incline pressing first for bodybuilding and general-population plans
//   R4-LIB-04            swaps say what they keep and lose
//   R4-LIB-05            no third-party video link: a YouTube search built from the name, and the exact name to copy
//   R4-SCP-03            sport profile confidence labels
//   HANDOFF clean-ups, reviews/codex-model-review.md Appendix F1, and the selection problems of the coach-eye reviews that are
//   not about time (near-duplicates, the lead chest press, route drills, vague block changes).
// Runs on the reference fixture and on the compiled model/ (rules.json deep-equals the fixture rules).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir } from './helpers/models.mjs';
import { loadModel, assertModel } from '../engine/model.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { isNearDuplicate, offeredAddons } from '../engine/select.mjs';
import { NEVER_PICK_STATUS, NOT_SHOWN_STATUS, addonPrimaryOk, isCarry, carryReps, swapNote, swapNotes, videoOf } from '../engine/library.mjs';
import { VIDEO_SEARCH_BASE, profileConfidence, amendExerciseV2 } from '../tools/fixture/v05-library.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS = [['fixture', loadFixtureModel()]];
let COMPILED = null;
try { COMPILED = loadCompiledModel(); if (COMPILED) MODELS.push(['model', COMPILED]); } catch { /* fixture only */ }
const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n, mut) => { const i = clone(loadSample(n)); if (mut) mut(i); return i; };
const SAMPLES = ['01', '02', '03', '04', '05', '06', '07', '08'];
const BENCH_DIR = path.join(ROOT, 'design', 'bench', 'intakes');
/** benchmark intakes read by number prefix ('49' -> 49-hyrox-open-4x75.json) */
const bench = (nn) => JSON.parse(fs.readFileSync(path.join(BENCH_DIR, fs.readdirSync(BENCH_DIR).find(f => f.startsWith(nn + '-'))), 'utf8'));
// a spread of the 94 benchmark intakes: swimmers, football, soccer, court and racket sports, combat, HYROX, the CrossFit class,
// older adults, home / body-weight kits, fat loss, general fitness, hybrid
const BENCH = ['01', '09', '10', '23', '25', '27', '29', '31', '35', '38', '41', '43', '49', '60', '61', '63', '64', '66', '69', '77', '79', '81', '84', '85', '90'];
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const FOOTBALL = ['american_football', 'flag_football'];

for (const [mname, model] of MODELS) {
  const R = model.rules;
  const A = R.selection.addons;
  const plans = new Map();
  const planOf = (n, mut, key) => { const k = n + '|' + (key || ''); if (!plans.has(k)) plans.set(k, generate(sample(n, mut), model)); return plans.get(k); };
  const benchPlans = new Map();
  const benchOf = (nn) => { if (!benchPlans.has(nn)) benchPlans.set(nn, generate(bench(nn), model)); return benchPlans.get(nn); };
  const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
  /** every plan the selection checks read: the 8 samples on both models, the benchmark spread on the compiled model */
  const corpus = () => [...SAMPLES.map(n => ['S' + n, planOf(n)]), ...(mname === 'model' ? BENCH.map(nn => ['B' + nn, benchOf(nn)]) : [])];
  const isHyroxStation = (x) => x.it.bucket === 'COND_CIRCUIT' && x.b.kind !== 'circuit' && /hyrox/.test(String(x.it.station_id || '')) || (x.it.bucket === 'COND_CIRCUIT' && A.primary_exceptions[0].ids.includes(x.it.exercise_id));

  // ------------------------------------------------------------------------------------------------------------ R4-LIB-01
  describe(`v0.5 / V2 optional add-ons (${mname})`, () => {
    it('R4-LIB-01: the proposed exercises are optional add-ons in the catalog; only neck work is still proposed; none is a default pick', () => {
      const all = model.exercises();
      const proposed = all.filter(e => NOT_SHOWN_STATUS.includes(e.status));
      assert.ok(proposed.length > 0 && proposed.every(e => e.pattern === 'NECK' || e.credit_class === 'ISO_NECK'), proposed.map(e => e.id).join(', '));
      const addons = all.filter(e => e.status === A.addon_status);
      // the 29 other proposed records + the 2 mid-range pull records of R4-LIB-03
      // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): + the suitcase carry - sample 01 major: a carry opened the
      // swimmer's Friday as a core pick; R4-LIB-01 names farmer and suitcase carries together, so it has the farmer carry's status)
      assert.equal(addons.length + proposed.length, 31 + 2 + 1);
      for (const id of ['farmer-carry', 'single-leg-balance-reach-front-side-back', 'sled-push', 'sled-drag-forward', 'wall-ball-medball-squat-to-target', 'sandbag-walking-lunge-bag-on-shoulders', 'burpee-broad-jump',
        'split-step-reaction-drill', 'floor-prone-y-t-raises', 'side-lying-db-external-rotation', 'tibialis-raise-back-against-a-wall', 'seated-bent-knee-calf-raise-soleus']) {
        if (id === 'floor-prone-y-t-raises') { assert.notEqual(ex(id).status, A.addon_status, 'the floor Y / T raise was added by the coach in round 2 (R2-LIB-07): it stays a library exercise'); continue; }
        assert.equal(ex(id).status, A.addon_status, id);
      }
      for (const e of [...addons, ...proposed]) assert.deepEqual(e.default_in_slots, [], e.id);
      assert.deepEqual([...A.never_pick_statuses].sort(), [...NEVER_PICK_STATUS].sort(), 'engine/library.mjs and rules.selection.addons agree');
      assert.deepEqual([...A.not_shown_statuses].sort(), [...NOT_SHOWN_STATUS].sort());
    });

    it('R4-LIB-01: no plan picks an optional add-on - except wall balls and sled pushes in a HYROX station circuit or the CrossFit class WOD', () => {
      const allowed = new Set(A.primary_exceptions.flatMap(x => x.ids));
      let seenHyrox = 0, seenWod = 0;
      for (const [tag, p] of corpus()) {
        assert.equal(p.status, 'ok', tag);
        for (const x of allItems(p)) {
          for (const id of [x.it.exercise_id, ...((x.it.wod && x.it.wod.stations) || [])].filter(Boolean)) {
            const e = ex(id);
            if (!e || !NEVER_PICK_STATUS.includes(e.status)) continue;
            assert.ok(e.status === A.addon_status && allowed.has(id), `${tag} w${x.w.n} ${x.d.weekday} ${x.it.bucket}: ${id} (${e.status}) is a template pick`);
            const inHyrox = x.it.bucket === 'COND_CIRCUIT' && p.meta.template.variant === 'hyrox';
            const inWod = x.it.bucket === 'COND_WOD' && p.meta.family === 'hybrid_crossfit';
            assert.ok(inHyrox || inWod, `${tag} w${x.w.n} ${x.d.weekday}: ${id} outside HYROX / the CrossFit WOD (${x.it.bucket}, ${p.meta.family})`);
            if (inHyrox) seenHyrox++; else seenWod++;
          }
        }
      }
      if (mname === 'model') { assert.ok(seenHyrox > 0, 'a HYROX plan holds its race stations'); assert.ok(seenWod > 0, 'a CrossFit WOD holds a wall ball'); }
    });

    it('R4-LIB-01: a HYROX station circuit picks wall balls and sled pushes; the other race stations are its swaps', { skip: mname !== 'model' && 'bench intakes on the compiled model' }, () => {
      const p = benchOf('49');
      const stations = allItems(p).filter(x => x.it.bucket === 'COND_CIRCUIT' && x.w.n === 1);
      const picked = new Set(stations.map(x => x.it.exercise_id));
      assert.ok(picked.has('sled-push') && picked.has('wall-ball-medball-squat-to-target'), [...picked].join(', '));
      for (const id of ['sled-rope-pull-hand-over-hand', 'sled-drag-forward', 'burpee-broad-jump', 'farmer-carry', 'sandbag-walking-lunge-bag-on-shoulders']) assert.ok(!picked.has(id), id + ' is not a pick');
      const swaps = new Set(stations.flatMap(x => x.it.swaps || []));
      assert.ok(['farmer-carry', 'burpee-broad-jump', 'sandbag-walking-lunge-bag-on-shoulders'].every(id => swaps.has(id)), [...swaps].join(', '));
      // the race stations a plan already holds are not offered again
      assert.ok(!p.meta.addons.some(a => picked.has(a.exercise_id)));
    });

    it('R4-LIB-01: addonPrimaryOk holds only for the two approved add-ons in their programs; the CrossFit reading can be switched off', () => {
      const wb = ex('wall-ball-medball-squat-to-target'), sp = ex('sled-push'), fc = ex('farmer-carry');
      const hyx = { variant: 'hyrox_station' };
      assert.equal(addonPrimaryOk(wb, hyx, 'COND_CIRCUIT', 'athletic', R), true);
      assert.equal(addonPrimaryOk(sp, hyx, 'COND_CIRCUIT', 'athletic', R), true);
      assert.equal(addonPrimaryOk(fc, hyx, 'COND_CIRCUIT', 'athletic', R), false, 'a farmer carry is never the pick');
      assert.equal(addonPrimaryOk(wb, { variant: null }, 'COND_CIRCUIT', 'fat_loss_bootcamp', R), false, 'not in a bootcamp circuit');
      assert.equal(addonPrimaryOk(wb, { variant: null }, 'COND_WOD', 'hybrid_crossfit', R), true);
      assert.equal(addonPrimaryOk(wb, { variant: null }, 'COND_WOD', 'athletic', R), false);
      assert.equal(addonPrimaryOk(wb, { variant: null }, 'AP_THROW', 'athletic', R), false, 'never a throw station');
      const off = clone(R);
      off.selection.addons.primary_exceptions.find(x => x.bucket === 'COND_WOD').enabled = false;
      assert.equal(addonPrimaryOk(wb, { variant: null }, 'COND_WOD', 'hybrid_crossfit', off), false);
      assert.equal(addonPrimaryOk(wb, hyx, 'COND_CIRCUIT', 'athletic', off), true);
    });

    it('R4-LIB-01: neck work stays proposed - never a pick, a swap or an offered add-on', () => {
      const neck = new Set(model.exercises().filter(e => e.pattern === 'NECK').map(e => e.id));
      assert.ok(neck.size >= 2);
      for (const [tag, p] of corpus()) {
        for (const x of allItems(p)) {
          assert.ok(!neck.has(x.it.exercise_id), `${tag}: ${x.it.exercise_id}`);
          for (const s of x.it.swaps || []) assert.ok(!neck.has(s), `${tag} swap ${s}`);
        }
        for (const a of p.meta.addons) assert.ok(!neck.has(a.exercise_id), `${tag} add-on ${a.exercise_id}`);
      }
    });

    it('R4-LIB-01: joint care picks the code\'s own live exercise; its optional add-ons are swaps and offered add-ons', () => {
      // the swimmer (R3-ATH-01 shoulder care every session): KB face pull / floor Y-T raise are the picks, external rotation a swap
      const sw = planOf('01');
      const care = allItems(sw).filter(x => x.b.kind === 'prehab' && x.it.bucket === 'RECOVERY_ARM_CARE');
      assert.ok(care.length > 0);
      for (const x of care) {
        assert.ok(['kb-face-pull', 'floor-prone-y-t-raises'].includes(x.it.exercise_id), x.it.exercise_id);
        assert.ok((x.it.swaps || []).includes('side-lying-db-external-rotation'), 'the external rotation is offered as a swap');
      }
      assert.ok(sw.meta.addons.some(a => a.exercise_id === 'side-lying-db-external-rotation' && a.kind === 'joint_care' && a.code === 'SHOULDER_SWIMMER'));
      // the 52-year-old racket player (R3-ATH-02 'calf and Achilles work every leg day'): one of the coach's own calf raises on each leg
      // day, the soleus and tibialis raises as its swaps and as offered add-ons
      const pb = planOf('08');
      for (const d of pb.weeks[0].days.filter(d => d.kind === 'main')) {
        const its = d.blocks.flatMap(b => b.items);
        const calf = its.filter(it => it.exercise_id && (ex(it.exercise_id).credit_class === 'ISO_CALF'));
        assert.ok(calf.length >= 1, `${d.weekday}: calf / Achilles work`);
        for (const it of calf) assert.ok(!NEVER_PICK_STATUS.includes(ex(it.exercise_id).status), it.exercise_id);
        const pre = its.find(it => it.bucket === 'PREHAB_LOWER' && ex(it.exercise_id).credit_class === 'ISO_CALF');
        if (pre) assert.ok(pre.swaps.includes('seated-bent-knee-calf-raise-soleus') && pre.swaps.includes('tibialis-raise-back-against-a-wall'), pre.swaps.join(', '));
      }
      for (const id of ['seated-bent-knee-calf-raise-soleus', 'tibialis-raise-back-against-a-wall', 'db-wrist-extension-slow-lowering']) assert.ok(pb.meta.addons.some(a => a.exercise_id === id), id);
      // a code whose only exercises are add-ons holds no station (the racket elbow: wrist extension)
      assert.ok(!allItems(pb).some(x => ((x.it.why || []).find(y => y.key === 'why.prehab') || { args: {} }).args.code === 'ELBOW_LATERAL_RACKET'));
    });

    it('R4-LIB-01: plan.meta.addons - offered, never placed; each with its dose, its block, a search link and the name to copy', () => {
      for (const [tag, p] of corpus()) {
        const held = new Set(allItems(p).flatMap(x => [x.it.exercise_id, ...((x.it.wod && x.it.wod.stations) || [])]).filter(Boolean));
        assert.ok(Array.isArray(p.meta.addons) && p.meta.addons.length <= A.offer.max, tag);
        const seen = new Set();
        for (const a of p.meta.addons) {
          const e = ex(a.exercise_id);
          assert.ok(e && e.status === A.addon_status, `${tag} ${a.exercise_id}`);
          assert.ok(!held.has(a.exercise_id) && !seen.has(a.exercise_id), `${tag} ${a.exercise_id} offered twice or already in the plan`);
          seen.add(a.exercise_id);
          assert.ok(['joint_care', 'sport', 'carry'].includes(a.kind));
          assert.ok(Array.isArray(a.sets) && a.sets[0] >= 1 && a.sets[1] >= a.sets[0] && a.reps && typeof a.reps.type === 'string', `${tag} ${a.exercise_id} dose`);
          assert.ok(model.kitAvailable(e, { tokens: new Set(p.meta.kit.tokens), machines: p.meta.kit.machines }), `${tag} ${a.exercise_id} outside the kit`);
          assert.equal(a.video.kind, 'search'); assert.equal(a.video.copy_name, model.t('en', e.name_key));
          if (isCarry(e, R)) { assert.equal(a.block, 'conditioning'); assert.equal(a.counts_as_muscle_sets, false); assert.ok(['distance_or_time', 'seconds'].includes(a.reps.type)); }
        }
      }
      // printed once, up front, in both languages
      const en = unesc(renderPlan(planOf('01'), model, { lang: 'en' })), es = unesc(renderPlan(planOf('01'), model, { lang: 'es' }));
      assert.ok(en.includes('## ' + model.t('en', 'ui.plan.addons_title')) && en.includes(model.t('en', 'ui.plan.addons_intro')));
      assert.ok(es.includes('## ' + model.t('es', 'ui.plan.addons_title')) && es.includes(model.t('es', 'ui.plan.addons_intro')));
      assert.ok(en.includes('**' + model.t('en', ex('side-lying-db-external-rotation').name_key) + '**'));
    });

    it('R4-LIB-01 / CX-04: an offered add-on is added with a plan edit; the generated plan is not changed', () => {
      const p = planOf('06');
      const d0 = p.weeks[0].days.find(d => d.kind === 'main');
      const res = applyPlanEdits(p, [{ op: 'add_exercise', weekday: d0.weekday, exercise_id: 'farmer-carry', sets: 3 }], model);
      const q = res.plan;
      assert.equal(q.edited, true); assert.equal(p.edited, false);
      const its = q.weeks[0].days.find(d => d.weekday === d0.weekday).blocks.flatMap(b => b.items.map(it => ({ it, b })));
      const fc = its.find(x => x.it.exercise_id === 'farmer-carry');
      assert.ok(fc, 'the farmer carry is in the edited plan');
      assert.equal(fc.b.kind, 'conditioning', 'carries sit with core / conditioning (R4-LIB-02)');
      assert.deepEqual(fc.it.credits, {}); assert.equal(fc.it.reps.type, 'distance_or_time'); assert.equal(fc.it.sets, 3);
      assert.deepEqual(q.weeks[0].weekly_sets_by_group, p.weeks[0].weekly_sets_by_group, 'a carry adds no muscle sets');
      assert.ok(!allItems(p).some(x => x.it.exercise_id === 'farmer-carry'));
      // an add-on the plan offered keeps the dose it was offered with and leaves the offer list
      const sw = planOf('01');
      const offer = sw.meta.addons.find(a => a.kind === 'joint_care');
      const day = sw.weeks[0].days.find(d => d.kind === 'main');
      const r2 = applyPlanEdits(sw, [{ op: 'add_exercise', weekday: day.weekday, exercise_id: offer.exercise_id, sets: 2 }], model).plan;
      const added = r2.weeks[0].days.find(d => d.weekday === day.weekday).blocks.flatMap(b => b.items).find(it => it.exercise_id === offer.exercise_id);
      assert.deepEqual(added.reps, offer.reps);
      assert.ok(!r2.meta.addons.some(a => a.exercise_id === offer.exercise_id) && sw.meta.addons.some(a => a.exercise_id === offer.exercise_id));
    });

    it('R4-LIB-01: offeredAddons is deterministic, kit-aware and honours exclude_ids', () => {
      const p = planOf('02');
      const ctx = { derived: p.meta.derived, model };
      const a = offeredAddons(ctx), b = offeredAddons(ctx);
      assert.deepEqual(a, b);
      assert.ok(a.length > 0 && a.length <= A.offer.max);
      const first = a[0].exercise_id;
      assert.ok(!offeredAddons({ ...ctx, exclude_ids: [first] }).some(x => x.exercise_id === first));
      // a body-weight kit is never offered a sled or a cable exercise
      const bw = planOf('02', i => { i.equipment = { ...i.equipment, profile: 'BODYWEIGHT', extras: [], machines: [] }; }, 'bw');
      if (bw.status === 'ok') for (const x of bw.meta.addons) assert.ok(model.kitAvailable(ex(x.exercise_id), { tokens: new Set(bw.meta.kit.tokens), machines: bw.meta.kit.machines }), x.exercise_id);
    });
  });

  // ------------------------------------------------------------------------------------------------------------ R4-LIB-02
  describe(`v0.5 / V2 carries and sled work (${mname})`, () => {
    it('R4-LIB-02: every carry and sled record is dosed by distance or time and credits no muscle sets', () => {
      const C = R.conditioning.carry;
      assert.deepEqual(C.trips, [2, 4]); assert.deepEqual(C.metres, [20, 40]); assert.deepEqual(C.seconds, [20, 40]);
      assert.equal(C.counts_as_muscle_sets, false); assert.deepEqual(C.sits_with, ['core', 'conditioning']);
      const carries = model.exercises().filter(e => isCarry(e, R));
      assert.ok(carries.length >= 11, String(carries.length));
      for (const id of ['farmer-carry', 'single-side-suitcase-carry', 'sled-push', 'sled-drag-backward', 'sled-rope-pull-hand-over-hand', 'sandbag-bear-hug-carry', 'overhead-kb-carry']) assert.ok(carries.some(e => e.id === id), id);
      for (const e of carries) {
        assert.equal(e.credit_class, 'NONE', e.id); assert.deepEqual(e.credits, {}, e.id); assert.equal(e.primary_muscle, null, e.id);
        assert.ok(['distance_or_time', 'seconds'].includes(e.rep_hint.unit), `${e.id}: ${e.rep_hint.unit}`);
        assert.ok(!/reps/.test(e.rep_hint.text) && /20-40/.test(e.rep_hint.text), `${e.id}: ${e.rep_hint.text}`);
        assert.ok(!e.slots.some(s => /^RP_|^ISO_|^FOCUS$/.test(s)), `${e.id} sits in a lifting slot: ${e.slots.join(', ')}`);
        const r = carryReps(e, R);
        if (r.type === 'distance_or_time') { assert.deepEqual(r.metres, [20, 40]); assert.deepEqual(r.seconds, [20, 40]); assert.equal(r.per_side, e.laterality === 'unilateral'); }
        else assert.deepEqual([r.type, r.min, r.max], ['seconds', 20, 40]);
      }
      assert.equal(model.bucket('FUNCTIONAL').block, 'conditioning', 'carries sit with conditioning, not with the accessories');
      assert.equal(ex('farmer-hold-stationary').rep_hint.unit, 'seconds', 'a stationary hold has no distance');
    });

    it('R4-LIB-02: a carry in a plan is written "20-40 m (or 20-40 s)" with no credits, in the core or conditioning block (the swimmer\'s suitcase carry)', () => {
      let seen = 0;
      for (const [tag, p] of corpus()) for (const x of allItems(p)) {
        const e = ex(x.it.exercise_id);
        if (!e || !isCarry(e, R)) continue;
        seen++;
        assert.deepEqual(x.it.credits, {}, `${tag} ${e.id}`);
        if (x.it.circuit || x.it.wod) continue;   // a timed station: by time already
        assert.ok(['distance_or_time', 'seconds'].includes(x.it.reps.type), `${tag} ${e.id} ${JSON.stringify(x.it.reps)}`);
        assert.ok(['core', 'conditioning', 'circuit'].includes(x.b.kind), `${tag} ${e.id} in ${x.b.kind}`);
        assert.equal(x.it.effort.key, R.conditioning.carry.effort_key);
        assert.equal(x.it.progression, null);
      }
      const sw = planOf('01');
      const sc = allItems(sw).find(x => x.it.exercise_id === 'single-side-suitcase-carry');
      if (sc) {
        seen++;
        assert.deepEqual(sc.it.reps, { type: 'distance_or_time', metres: [20, 40], seconds: [20, 40], per_side: true });
        const line = unesc(renderPlan(sw, model, { lang: 'en' })).split('\n').find(l => l.includes('**' + model.t('en', ex('single-side-suitcase-carry').name_key) + '**'));
        assert.match(line, /20-40 m \(or 20-40 s\) per side/);
        assert.ok(unesc(renderPlan(sw, model, { lang: 'es' })).includes('20-40 m (o 20-40 s) por lado'));
      }
      if (mname === 'model') assert.ok(seen > 0, 'the corpus holds a carry');
    });
  });

  // ------------------------------------------------------------------------------------------------------------ R4-LIB-03
  describe(`v0.5 / V2 mid-range pull and incline first (${mname})`, () => {
    it('R4-LIB-03: mid-range pull is its own category between the horizontal and the vertical pull - a high row, a 45-degree row, the face-pull angle', () => {
      const MP = R.selection.mid_range.pull;
      assert.deepEqual(MP.between, ['HPULL', 'VPULL']); assert.equal(MP.template_pick, false);
      for (const id of ['high-row-machine', '45-degree-cable-row']) {
        const e = ex(id);
        assert.ok(e, id);
        assert.equal(e.pattern, 'MRPULL'); assert.equal(e.status, A.addon_status);
        assert.ok(e.tags.includes('mid_range_pull')); assert.deepEqual(e.slots, ['FOCUS', 'RP_HPULL', 'RP_VPULL']);
        assert.equal(e.credit_class, 'HPULL'); assert.deepEqual(e.default_in_slots, []);
        for (const lang of ['en', 'es']) assert.ok(model.has(lang, e.name_key), `${id} ${lang} name`);
      }
      for (const id of ['face-pull', 'kb-face-pull']) assert.ok(ex(id).tags.includes('mid_range_pull'), id);
      // a high row is not a version of a machine row (its own movement), and it is never picked
      assert.equal(isNearDuplicate(model, ex('high-row-machine'), ex('machine-row-grip-not-stated')), false);
      for (const [tag, p] of corpus()) for (const x of allItems(p)) assert.ok(!['high-row-machine', '45-degree-cable-row'].includes(x.it.exercise_id), tag);
      // it shows as a swap of a row or a pulldown somewhere in a full gym
      const swaps = new Set(allItems(planOf('07')).filter(x => ['RP_HPULL', 'RP_VPULL'].includes(x.it.bucket)).flatMap(x => x.it.swaps || []));
      assert.ok(swaps.has('high-row-machine') || swaps.has('45-degree-cable-row'), [...swaps].join(', '));
    });

    it('R4-LIB-03: the mid-range push tag marks the incline, landmine and viking presses', () => {
      for (const id of ['high-incline-db-press', 'high-incline-seated-db-press', 'high-incline-seated-barbell-press', 'incline-barbell-bench-press', 'incline-db-bench-press', 'standing-landmine-press', 'standing-viking-press'])
        assert.ok(ex(id).tags.includes('mid_range_push'), id);
      for (const id of ['standing-barbell-overhead-press-strict', 'db-overhead-press-seated-standing-not-stated', 'barbell-bench-press', 'incline-push-up-hands-elevated', 'incline-dumbbell-curl-pinky-facing-up-supinated-variation'].filter(id => model.hasEx(id)))
        assert.ok(!ex(id).tags.includes('mid_range_push'), id);
    });

    it('R4-LIB-03: bodybuilding and general-population plans lead the vertical / mid-range push slot with an incline press; overhead pressing stays in the swaps', () => {
      const IF = R.selection.incline_first;
      assert.deepEqual(IF.goals, ['muscle', 'general', 'fat_loss', 'active']); assert.equal(IF.bucket, 'RP_VPUSH'); assert.equal(IF.overhead_stays, true);
      const cases = [['S06', planOf('06')], ['S07', planOf('07')], ['S08', planOf('08')], ...(mname === 'model' ? [['B01', benchOf('01')], ['B77', benchOf('77')], ['B02', benchOf('02')]] : [])];
      for (const [tag, p] of cases) {
        // (engine 0.7 fix round, converted - DECISIONS G-299: the weekly light overhead press of R5-ATH-04 is joint care, role prehab, not
        // the slot's work)
        const slots = allItems(p).filter(x => x.it.bucket === 'RP_VPUSH' && x.d.kind === 'main' && x.it.exercise_id && x.b.kind !== 'circuit' && x.it.role !== 'prehab');
        assert.ok(slots.length > 0, tag);
        // every week leads with incline pressing: the first vertical / mid-range push of the week is an incline press, and so is
        // most of the slot's work
        for (const w of p.weeks) {
          const wk = slots.filter(x => x.w === w);
          if (!wk.length) continue;
          assert.ok(/incline/.test(wk[0].it.exercise_id), `${tag} w${w.n}: ${wk.map(x => x.it.exercise_id).join(', ')}`);
          assert.ok(wk.filter(x => ex(x.it.exercise_id).tags.includes('mid_range_push')).length * 2 >= wk.length, `${tag} w${w.n}: ${wk.map(x => x.it.exercise_id).join(', ')}`);
          for (const x of wk.filter(y => /incline/.test(y.it.exercise_id))) assert.equal(ex(x.it.exercise_id).laterality, 'bilateral', `${tag} ${x.it.exercise_id}`);
        }
        // overhead stays available: some incline pick lists an overhead press among its swaps
        const overhead = (id) => !!ex(id) && ex(id).tags.includes('overhead') && !ex(id).tags.includes('mid_range_push');
        assert.ok(slots.some(x => (x.it.swaps || []).some(overhead)), `${tag}: no overhead press among the swaps`);
        assert.ok(slots.some(x => (x.it.why || []).some(y => y.key === 'why.incline_first' && y.ref === 'R4-LIB-03')), `${tag}: the why`);
      }
      // the week never holds the library's two DB high-incline records (one exercise)
      for (const [tag, p] of cases) for (const w of p.weeks) {
        const n = w.days.flatMap(d => d.blocks.flatMap(b => b.items)).filter(it => /^high-incline-(seated-)?db-press$/.test(it.exercise_id || '')).length;
        assert.ok(n <= 1, `${tag} w${w.n}: ${n} DB high-incline presses`);
      }
    });

    it('R4-LIB-03: a competitive athlete keeps overhead and incline pressing level (no incline weight); a kit with no bench presses overhead', () => {
      const fb = planOf('02');
      assert.ok(!allItems(fb).some(x => (x.it.why || []).some(y => y.key === 'why.incline_first')), 'a linebacker is not an incline-first client');
      const nb = planOf('06', i => { i.equipment = { profile: 'DB_ONLY', extras: [], machines: [], preference: 'none', detail: i.equipment.detail }; }, 'no-bench');
      if (nb.status === 'ok') {
        const v = allItems(nb).filter(x => x.it.bucket === 'RP_VPUSH' && x.it.exercise_id);
        const kit = new Set(nb.meta.kit.tokens);
        if (!kit.has('weight_bench') && !kit.has('bench')) assert.ok(v.length > 0 && v.every(x => !/incline/.test(x.it.exercise_id)), v.map(x => x.it.exercise_id).join(', '));
      }
    });
  });

  // ------------------------------------------------------------------------------------------------------------ R4-LIB-04
  describe(`v0.5 / V2 swaps keep / lose (${mname})`, () => {
    it('R4-LIB-04: "DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch"', () => {
      const n = swapNote(model, ex('power-clean'), ex('single-arm-db-snatch'));
      assert.deepEqual(n, { id: 'single-arm-db-snatch', keeps: 'swap.keeps.hip_drive', loses: 'swap.loses.barbell_catch' });
      assert.equal(model.t('en', n.keeps), 'the explosive hip drive'); assert.equal(model.t('en', n.loses), 'the barbell catch');
      // a few more readings of the table
      assert.equal(swapNote(model, ex('barbell-bench-press'), ex('db-floor-press')).loses, 'swap.loses.bottom_range');
      assert.equal(swapNote(model, ex('barbell-bench-press'), ex('machine-bench-press')).loses, 'swap.loses.free_weight_balance');
      assert.equal(swapNote(model, ex('barbell-bench-press'), ex('machine-bench-press')).keeps, 'swap.keeps.HPUSH');
      assert.equal(swapNote(model, ex('leg-extension-machine'), ex('db-leg-extension-seated-on-box')).loses, 'swap.loses.machine_support');
      assert.equal(swapNote(model, ex('lat-pulldown-wide-grip'), ex('single-arm-lat-pulldown')).loses, 'swap.loses.two_side_load');
      assert.equal(swapNote(model, ex('lat-pulldown-wide-grip'), ex('lat-pulldown-close-grip')).loses, 'swap.loses.little');
      assert.equal(swapNote(model, ex('farmer-carry'), ex('sandbag-bear-hug-carry')).keeps, 'swap.keeps.carry');
    });

    it('R4-LIB-04: every swap of every item carries one keeps / loses note with words in both languages', () => {
      assert.equal(R.selection.swap_notes.enabled, true);
      const keys = new Set();
      for (const [tag, p] of corpus()) for (const x of allItems(p)) {
        const swaps = (x.it.swaps || []).filter(id => model.hasEx(id));
        assert.deepEqual((x.it.swap_notes || []).map(n => n.id), swaps, `${tag} w${x.w.n} ${x.it.slot_id}`);
        for (const n of x.it.swap_notes || []) { keys.add(n.keeps); keys.add(n.loses); }
        if (x.it.exercise_id && swaps.length) assert.deepEqual(x.it.swap_notes, swapNotes(model, x.it.exercise_id, swaps));
      }
      assert.ok(keys.size >= 12, 'the corpus reads a spread of the table: ' + keys.size);
      for (const k of keys) for (const lang of ['en', 'es']) assert.ok(model.has(lang, k), `${lang} ${k}`);
      // every key the table can return has its words (credit classes and the fixed vocabulary)
      for (const cc of Object.keys(R.credit.classes).filter(c => !['ATHLETIC', 'NONE'].includes(c))) assert.ok(model.has('en', 'swap.keeps.' + cc) && model.has('es', 'swap.keeps.' + cc), cc);
    });

    it('R4-LIB-04: the page prints each swap with what it keeps and loses; a pick that stands in for missing equipment says what it replaces', () => {
      const en = unesc(renderPlan(planOf('06'), model, { lang: 'en' })), es = unesc(renderPlan(planOf('06'), model, { lang: 'es' }));
      assert.match(en, /Swap for: [^\n]*\(keeps [^;()\n]+; loses [^\n]+\)/);
      assert.match(es, /\(mantiene [^;()\n]+; pierde [^\n]+\)/);
      // a home / field kit: at least one pick stands in for an exercise the kit does not hold, and says so in one line
      const home = planOf('05');
      const sub = allItems(home).filter(x => x.it.instead_of);
      assert.ok(sub.length > 0, 'the bootcamp kit has a stand-in');
      for (const x of sub) {
        const want = ex(x.it.instead_of.exercise_id);
        assert.ok(want && want.id !== x.it.exercise_id);
        assert.ok(!model.kitAvailable(want, { tokens: new Set(home.meta.kit.tokens), machines: home.meta.kit.machines }), `${want.id} is in the kit`);
        const note = x.it.notes.find(nt => nt.key === 'note.instead_of');
        assert.ok(note && note.args.pick === ex(x.it.exercise_id).name_key && note.args.instead === want.name_key && note.args.keeps === x.it.instead_of.keeps && note.args.loses === x.it.instead_of.loses);
      }
      const page = unesc(renderPlan(home, model, { lang: 'en' }));
      const x0 = sub[0];
      assert.ok(page.includes(`${model.t('en', ex(x0.it.exercise_id).name_key)} instead of ${model.t('en', ex(x0.it.instead_of.exercise_id).name_key)} (your equipment): keeps ${model.t('en', x0.it.instead_of.keeps)}, loses ${model.t('en', x0.it.instead_of.loses)}.`));
      // a full gym needs no stand-in
      assert.ok(!allItems(planOf('07')).some(x => x.it.instead_of));
    });
  });

  // ------------------------------------------------------------------------------------------------------------ R4-LIB-05
  describe(`v0.5 / V2 video search links (${mname})`, () => {
    it('R4-LIB-05: no third-party video link in the catalog - every exercise carries a YouTube search link built from its English name', () => {
      const V = R.render.video;
      assert.equal(V.third_party_links, false); assert.equal(V.search_url, VIDEO_SEARCH_BASE); assert.equal(V.copy_name, true);
      for (const e of model.exercises()) {
        assert.deepEqual(e.video, { url: VIDEO_SEARCH_BASE + encodeURIComponent(model.t('en', e.name_key)), kind: 'search' }, e.id);
        assert.deepEqual(videoOf(model, e), { kind: 'search', url: e.video.url, copy_name: model.t('en', e.name_key) });
      }
      assert.ok(!/youtu\.be\/|youtube\.com\/(watch|shorts|embed)/.test(JSON.stringify(model.exercises())));
    });

    it('R4-LIB-05: assertModel refuses a third-party link and a search link not built from the name', { skip: mname !== 'model' && 'mutations on the compiled model files' }, () => {
      const raw = readModelDir();
      raw.catalog.exercises[5].video = { url: 'https://youtu.be/abc123', kind: 'observed' };
      assert.ok(assertModel(raw).some(e => /R4-LIB-05/.test(e)));
      const raw2 = readModelDir();
      raw2.catalog.exercises[5].video = { url: VIDEO_SEARCH_BASE + 'something%20else', kind: 'search' };
      assert.ok(assertModel(raw2).some(e => /not built from the exercise name/.test(e)));
      assert.deepEqual(assertModel(readModelDir()), []);
    });

    it('R4-LIB-05: every exercise in a plan exposes the search link and the exact name to copy; the Spanish page copies the English gym name', () => {
      for (const n of ['03', '06']) {
        const p = planOf(n);
        for (const x of allItems(p)) {
          if (!x.it.exercise_id) { assert.equal(x.it.video, null); continue; }
          const e = ex(x.it.exercise_id);
          assert.deepEqual(x.it.video, { kind: 'search', url: VIDEO_SEARCH_BASE + encodeURIComponent(model.t('en', e.name_key)), copy_name: model.t('en', e.name_key) }, x.it.exercise_id);
        }
        for (const lang of ['en', 'es']) {
          const md = unesc(renderPlan(p, model, { lang }));
          assert.ok(!/youtu\.be\/|youtube\.com\/(watch|shorts|embed)/.test(md), `${n} ${lang}: a third-party link`);
          const lift = allItems(p).find(x => ['resistance'].includes(model.bucket(x.it.bucket).kind) && x.it.exercise_id && !x.it.detail);
          const name = model.t('en', ex(lift.it.exercise_id).name_key);
          assert.ok(md.includes(model.t(lang, 'ui.plan.copy_name', { name: '`' + name + '`' })), `${n} ${lang}: ${name}`);
          assert.ok(md.includes('](' + lift.it.video.url + ')'));
          assert.ok(md.trim().endsWith(model.t(lang, 'video.note')));
        }
      }
      // a block change with a detail ('- pause at the bottom') searches and copies the plain exercise name
      const withDetail = allItems(planOf('06')).find(x => x.it.detail && x.it.exercise_id && x.it.video);
      if (withDetail) assert.equal(withDetail.it.video.copy_name, model.t('en', ex(withDetail.it.exercise_id).name_key));
    });
  });

  // ------------------------------------------------------------------------------------------------------------ R4-SCP-03
  describe(`v0.5 / V2 profile confidence (${mname})`, () => {
    it('R4-SCP-03: every sport profile carries confirmed_by_coach, similar_sport or proposed (data and docs, never on a plan)', () => {
      const PC = R.render.profile_confidence;
      assert.deepEqual(PC.labels, ['confirmed_by_coach', 'similar_sport', 'proposed']); assert.equal(PC.shown_on_plan, false);
      const count = {};
      for (const [id, s] of Object.entries(model.profiles.sports)) {
        assert.ok(PC.labels.includes(s.confidence), `${id}: ${s.confidence}`);
        assert.ok(typeof s.confidence_basis === 'string' && s.confidence_basis.length > 5, id);
        count[s.confidence] = (count[s.confidence] || 0) + 1;
      }
      assert.ok(count.confirmed_by_coach > 0 && count.similar_sport > 0 && count.proposed > 0, JSON.stringify(count));
      // his own programs and the plans he approved by name are confirmed; a position delta is a similar sport; a sport with no
      // program in his sheets is proposed
      for (const id of ['bodybuilding_aesthetics', 'baseball_position', 'boxing', 'swimming_middle', 'hyrox_fitness']) assert.equal(model.profiles.sports[id].confidence, 'confirmed_by_coach', id);
      for (const id of ['football_rb', 'rec_pickleball', 'rec_soccer']) assert.equal(model.profiles.sports[id].confidence, 'similar_sport', id);
      for (const id of ['soccer', 'volleyball', 'golf']) assert.equal(model.profiles.sports[id].confidence, 'proposed', id);
      assert.deepEqual(profileConfidence({ id: 'x', evidence: 'OBSERVED (his sheet)' }).label, 'confirmed_by_coach');
      assert.deepEqual(profileConfidence({ id: 'x', evidence: 'INFERRED', base_profile: 'soccer' }).label, 'similar_sport');
      assert.deepEqual(profileConfidence({ id: 'x', evidence: 'INFERRED', reuse_status: 'new' }).label, 'proposed');
      // not shown on a plan
      for (const n of ['01', '03']) for (const lang of ['en', 'es']) assert.ok(!/confirmed_by_coach|similar_sport|confidence/.test(renderPlan(planOf(n), model, { lang })), n);
    });
  });

  // ------------------------------------------------------------------------------------------------------------ clean-ups
  describe(`v0.5 / V2 data clean-ups (${mname})`, () => {
    it('HANDOFF clean-ups: no retired 3 % step cap, no cut-order table, the 60+ flag carries the landing drills round 3 switched on (R3-ATH-02)', () => {
      const str = JSON.stringify(R);
      assert.ok(!/"step_cap"|"nonpriority_step_cap"/.test(str), 'a retired step cap is still in the rules');
      assert.equal(R.cut_order, undefined);
      assert.ok(!/"cut_order"/.test(str));
      for (const id of ['low-depth-drop', 'stick-the-landing-bilateral-jump-drop-and-freeze-the-landing', 'stick-the-landing-unilateral-single-leg-landing-freeze', 'db-snap-down']) {
        assert.equal(ex(id).older_ok, true, id); assert.ok(ex(id).rule_refs.includes('R3-ATH-02'), id);
      }
      // high-impact and weighted landings and the depth drops stay off without the opt-in
      for (const id of ['medium-depth-drop', 'high-depth-drop-above-hip-height', 'single-leg-depth-drop', 'weighted-stick-the-landing-unilateral', 'depth-drop-height-not-stated', 'low-depth-drop-single-leg-or-weighted']) assert.equal(ex(id).older_ok, false, id);
      for (const e of model.exercises()) if (e.athletic && ['plyometric', 'olympic'].includes(e.athletic.quality)) assert.equal(e.older_ok, false, e.id);
      // the amendment is idempotent
      assert.deepEqual(amendExerciseV2(clone(ex('low-depth-drop'))), { ...clone(ex('low-depth-drop')), video: null });
    });

    it('HANDOFF clean-ups: the spec no longer carries a live 60+ step cap or a "learning from users\' data" note; the master doc files the Z-press as advanced', () => {
      const spec = fs.readFileSync(path.join(ROOT, 'generator_spec_v1.json'), 'utf8');
      assert.ok(!/"older_adults_60plus_step_cap":/.test(spec));
      assert.ok(!/"action": "cap_weekly_step"/.test(spec));
      assert.ok(!/tuned later from users' data with coach approval/.test(spec));
      JSON.parse(spec);
      const brain = fs.readFileSync(path.join(ROOT, 'BLAZE_CAMP_BRAIN.md'), 'utf8');
      const row = brain.split('\n').find(l => l.startsWith('| Vertical push |'));
      const cells = row.split('|').map(c => c.trim());
      assert.ok(!/Z-press/.test(cells[3]) && /Z-press/.test(cells[4]), row);
      for (const id of ['barbell-z-press-seated-on-floor', 'db-z-press-seated-on-floor']) assert.equal(ex(id).level, 'advanced');
    });

    it('Appendix F1: the split-step reaction drill, the run intervals and the carries are finished records', () => {
      const ss = ex('split-step-reaction-drill');
      assert.deepEqual(ss.rep_hint, { text: '4-8 bouts of 5-10 s', unit: 'seconds' });
      assert.deepEqual(ss.equipment.any_of, [['open_space_short']], 'it needs usable space; cones are optional markers');
      assert.ok(!R.population.older.quick_stepping_no_hop.includes('split-step-reaction-drill'), 'a split-step is a hop (R3-ATH-02 quick stepping WITHOUT a hop)');
      assert.equal(ss.older_ok, false);
      const ri = ex('run-intervals-2-min-fast-1-min-walk');
      assert.equal(ri.rep_hint.unit, 'time'); assert.match(ri.rep_hint.text, /2 min fast \+ 1 min walk/);
      assert.deepEqual(ex('farmer-carry').rep_hint, { text: '2-4 trips of 20-40 m or 20-40 s', unit: 'distance_or_time' });
      assert.deepEqual(ex('single-side-suitcase-carry').rep_hint, { text: '2-4 trips of 20-40 m or 20-40 s each side', unit: 'distance_or_time' });
      // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the suitcase carry is an optional add-on like the farmer carry,
      // R4-LIB-01 - it was a reference-only record the low-back core rule could pick)
      assert.equal(ex('single-side-suitcase-carry').status, A.addon_status, 'the suitcase carry is an optional add-on (R4-LIB-01)');
      // a 60+ plan (no opt-in) never holds a split-step
      const old = planOf('08', i => { i.age = 66; }, 'age66');
      if (old.status === 'ok') assert.ok(!allItems(old).some(x => x.it.exercise_id === 'split-step-reaction-drill'));
    });

    it('R4-LIB-05: the library source and the compiled model hold no third-party video link', () => {
      const src = fs.readFileSync(path.join(ROOT, 'synthesis', '02_exercise_catalog.json'), 'utf8');
      assert.ok(!/youtu\.be|youtube\.com/.test(src), 'synthesis/02_exercise_catalog.json');
      if (mname === 'model') assert.ok(!/youtu\.be\/|youtube\.com\/(watch|shorts|embed)/.test(fs.readFileSync(path.join(ROOT, 'model', 'catalog.json'), 'utf8')));
    });
  });

  // ------------------------------------------------------------------------------------------------------------ selection
  describe(`v0.5 / V2 selection problems of the coach-eye reviews (${mname})`, () => {
    it('RECHECK 01 / 03: no session holds two versions of one exercise (near-duplicates)', () => {
      for (const [tag, p] of corpus()) for (const w of p.weeks) for (const d of w.days) {
        const its = d.blocks.flatMap(b => b.items.map(it => ({ it, kind: b.kind }))).filter(x => x.it.exercise_id && ex(x.it.exercise_id) && !['warmup', 'cooldown', 'aerobic'].includes(x.kind) && x.it.role !== 'test' && x.it.bucket !== 'TEST' && !x.it.test);
        for (let i = 0; i < its.length; i++) for (let j = i + 1; j < its.length; j++) {
          const a = ex(its[i].it.exercise_id), b = ex(its[j].it.exercise_id);
          if (a.is_athletic || b.is_athletic) continue;
          if (a.id === b.id) { assert.ok(its[i].it.detail || its[j].it.detail, `${tag} w${w.n} ${d.weekday}: ${a.id} twice with no detail`); continue; }
          assert.ok(!isNearDuplicate(model, a, b), `${tag} w${w.n} ${d.weekday}: ${a.id} ~ ${b.id}`);
        }
      }
      // a sissy squat is its own movement, not a version of an air squat
      assert.equal(isNearDuplicate(model, ex('sissy-squat'), ex('bodyweight-squat-air-squat')), false);
    });

    it('RECHECK 03 / 04 / 05 / 06: the day\'s lead chest press is a two-arm press, and never a floor press or push-up while the kit holds a bench or machine press', () => {
      const LP = R.selection.lead_press;
      const avoid = new RegExp(LP.avoid_re), floor = new RegExp(LP.floor_re);
      for (const [tag, p] of corpus()) {
        const kit = { tokens: new Set(p.meta.kit.tokens), machines: p.meta.kit.machines };
        const presses = model.bySlot('RP_HPUSH').filter(e => !NEVER_PICK_STATUS.includes(e.status) && e.laterality === 'bilateral' && model.kitAvailable(e, kit) && !avoid.test(e.id));
        const hasLoaded = presses.some(e => e.load_ceiling !== 'low');
        const hasBench = presses.some(e => e.load_ceiling !== 'low' && !floor.test(e.id));
        const upper = p.meta.share_targets && p.meta.share_targets.upper;
        // (an athlete whose sport share asks for one-arm pressing keeps the v0.4 rule: the lead press is two-arm all the same)
        void upper;
        for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
          const lead = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_HPUSH' && it.role !== 'test' && it.exercise_id && !(it.flags || []).includes('pattern_gap'));
          if (!lead) continue;
          const e = ex(lead.exercise_id);
          if (hasLoaded) assert.ok(e.laterality === 'bilateral' && !avoid.test(e.id), `${tag} w${w.n} ${d.weekday}: ${e.id} leads the chest work`);
          if (hasBench) assert.ok(!floor.test(e.id), `${tag} w${w.n} ${d.weekday}: ${e.id} while a bench or machine press is in the kit`);
        }
      }
      assert.ok(LP.floor_penalty <= -8);
    });

    it('RECHECK 03: route-running drills stay with football - no other sport picks one or lists one as a swap', () => {
      const routes = model.bySlot('AP_COD').filter(e => /route/.test(e.id));
      assert.ok(routes.length >= 5);
      for (const e of routes) assert.deepEqual(e.athletic.sport_only, FOOTBALL, e.id);
      let football = 0;
      for (const [tag, p] of corpus()) {
        const sport = p.meta.profile.sport_id;
        for (const x of allItems(p)) for (const id of [x.it.exercise_id, ...(x.it.swaps || [])].filter(Boolean)) {
          if (!/route/.test(id) || !ex(id) || !ex(id).athletic) continue;
          assert.ok(FOOTBALL.includes(sport), `${tag} (${sport}): ${id}`);
          football++;
        }
        for (const a of p.meta.addons) assert.ok(!/route/.test(a.exercise_id));
      }
      assert.ok(football > 0, 'the linebacker keeps his routes');
    });

    it('RECHECK 05 / 07: a block change names its detail ("pause at the bottom"), never "different implement / grip / stance"', () => {
      for (const [tag, p] of corpus()) {
        for (const x of allItems(p)) if (x.it.detail) {
          assert.ok(x.it.detail.value && /^detail\.v\./.test(x.it.detail.key) && model.has('en', x.it.detail.key) && model.has('es', x.it.detail.key), `${tag} ${x.it.exercise_id} ${JSON.stringify(x.it.detail)}`);
        }
      }
      for (const n of ['05', '07']) for (const lang of ['en', 'es']) {
        const md = renderPlan(planOf(n), model, { lang });
        assert.ok(!/different (implement|grip|stance|hand|range)|(implemento|agarre|postura) diferente/i.test(md), `${n} ${lang}`);
      }
    });

    it('PER-04 / R2-SES-05: on the A / B skeleton a movement family keeps its week cap (two vertical presses, two single-leg hinges a week)', () => {
      assert.ok(R.selection.r2.family_over_week <= -7);
      const fams = R.selection.r2.families.filter(f => typeof f.week_max === 'number' && ['db_overhead_alt', 'pull_up_bar', 'high_incline_db_press'].includes(f.id));
      assert.equal(fams.length, 3);
      for (const n of ['02', '03', '06', '07']) {
        const p = planOf(n);
        for (const w of p.weeks) for (const f of fams) {
          const hit = w.days.filter(d => d.kind === 'main').flatMap(d => d.blocks.flatMap(b => b.items)).filter(it => it.exercise_id && it.role !== 'test' && new RegExp(f.re).test(it.exercise_id));
          assert.ok(hit.length <= f.week_max, `${n} w${w.n} ${f.id}: ${hit.map(it => it.exercise_id).join(', ')}`);
        }
      }
    });
  });
}
