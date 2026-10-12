// tests/review-b3.test.mjs - engine 0.4.0 stage B3 (exercise selection, variation and rendering) regression tests for the coach-eye
// re-check of the v0.3 sample plans (samples/RECHECK_v0.3.md) and the round-3 answers that touch selection and the printed plan
// (coach_answers_round3.md R3-VOL-02 / 04, R3-SES-01 / 02, R3-GEN-01). One test per fixed issue, named R<sample>-<slug> after its
// RECHECK sample (R3-<slug> for a round-3 feature); samples/REVIEW_LOG.md (v0.4, stage B3) lists them. Plans are built from
// samples/intakes/<sample>.json on the compiled model (model/).
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { tr } from '../engine/explain.mjs';
import { renderPlan, renderDay, renderWeek, renderBlockView } from '../engine/render.mjs';
import { doseItem } from '../engine/dose.mjs';
import { isNearDuplicate, detailDistance, variationValues, aerobicPick } from '../engine/select.mjs';
import { loadCompiledModel, INTAKE_DIR } from './helpers/models.mjs';

const model = loadCompiledModel();
const R = model ? model.rules : null;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const planWith = (n, mut) => { const i = intakeOf(n); mut(i); return generate(i, model); };
const md = (n, opts = {}) => renderPlan(plan(n), model, { lang: plan(n).lang, ...opts });
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const RES = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD', 'RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'];
const kindOf = (b) => { try { return model.bucket(b).kind; } catch { return null; } };
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');

describe('stage B3: exercise selection, variation and rendering (RECHECK_v0.3 + round 3)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------ variations (R2-LIB-01)
  test('R05-placeholder-details: every block-to-block detail names a concrete value ("weight in the opposite hand"), never "different grip / implement / stance" (all samples, EN + ES)', () => {
    let details = 0;
    for (const n of Object.keys(NAMES)) {
      const p = plan(n);
      const kit = p.meta.kit.tokens, pain = (p.meta.derived.pain || []).map(x => x.area);
      for (const x of allItems(p)) {
        if (!x.it.detail) continue;
        details++;
        assert.match(x.it.detail.key, /^detail\.v\./, `${n} ${x.it.slot_id} ${x.it.detail.key}`);
        assert.ok(variationValues(model, ex(x.it.exercise_id), kit, pain).some(v => v.value === x.it.detail.value), `${n} ${x.it.exercise_id} ${x.it.detail.value}`);
      }
      for (const lang of ['en', 'es']) {
        const s = renderPlan(p, model, { lang });
        assert.ok(!/ - different (implement|grip|stance|hand|range)/.test(s), `${n} ${lang} placeholder`);
        assert.ok(!/(implemento|agarre|postura|rango) diferente/.test(s), `${n} ${lang} placeholder ES`);
      }
    }
    assert.ok(details > 10);
  });

  test('R07-block-change-one-detail: a block change alters one or two details of the exercise, never goes back to an earlier block\'s pick (no A-B-A) and never just swaps exercises between days', () => {
    for (const n of Object.keys(NAMES)) {
      const p = plan(n);
      for (const tb of p.shape.training_blocks) {
        const ebs = p.shape.exercise_blocks.filter(e => e.training_block === tb.n);
        const bySlot = new Map();
        for (const eb of ebs) {
          const w = p.weeks.find(x => x.n === eb.weeks[0]);
          const weekIds = new Set(items(w).map(x => x.it.exercise_id).filter(Boolean));
          for (const x of items(w)) {
            if (!x.it.exercise_id || !RES.includes(x.it.bucket) && !['isolation', 'focus'].includes(kindOf(x.it.bucket))) continue;
            const hist = bySlot.get(x.it.slot_id) || [];
            const last = hist[hist.length - 1];
            if ((x.it.flags || []).includes('block_change') && last) {
              assert.ok(detailDistance(ex(last.id), ex(x.it.exercise_id)) <= R.selection.block_change.max_distance, `${n} ${x.it.slot_id} ${last.id} -> ${x.it.exercise_id}`);
              assert.ok(!(ex(x.it.exercise_id).tags || []).includes('olympic'), `${n} ${x.it.slot_id} Olympic-tagged strength change`);
            }
            hist.push({ id: x.it.exercise_id, weekIds });
            bySlot.set(x.it.slot_id, hist);
          }
        }
        for (const [sid, hist] of bySlot) for (let i = 2; i < hist.length; i++) {
          if (hist[i].id !== hist[i - 1].id && hist[i].id === hist[i - 2].id) assert.fail(`${n} ${sid} A-B-A ${hist.map(h => h.id).join(' -> ')}`);
        }
      }
    }
  });

  test('R01-near-duplicates: one session never holds two versions of the same exercise (seated + bent-over DB reverse fly, DB floor press + alternating DB floor press)', () => {
    for (const n of Object.keys(NAMES)) for (const w of plan(n).weeks) for (const d of w.days) {
      // joint care is a different job (the bent-knee soleus raise next to a calf raise), not a second version of the lift
      const its = d.blocks.flatMap(b => b.items).filter(it => it.exercise_id && it.role !== 'test' && !ex(it.exercise_id).is_athletic && !['warmup', 'prehab'].includes(kindOf(it.bucket)));
      for (let i = 0; i < its.length; i++) for (let j = i + 1; j < its.length; j++) {
        const a = ex(its[i].exercise_id), b = ex(its[j].exercise_id);
        if (a.id === b.id && (its[i].detail || its[j].detail)) continue;   // the same exercise with a named detail (kit limit)
        assert.ok(!isNearDuplicate(model, a, b), `${n} w${w.n} ${d.weekday}: ${a.id} + ${b.id}`);
      }
    }
    // the rule itself: the two reverse flies and the two floor presses of the RECHECK are one exercise; a machine and a DB fly are not
    assert.ok(isNearDuplicate(model, ex('seated-chest-to-thighs-db-reverse-fly'), ex('bent-over-db-reverse-fly')));
    assert.ok(isNearDuplicate(model, ex('db-floor-press'), ex('alternating-db-floor-press')));
    assert.ok(!isNearDuplicate(model, ex('machine-reverse-fly-rear-delt-pec-deck'), ex('bent-over-db-reverse-fly')));
  });

  test('R03-lead-chest-press: the day\'s first chest press is a two-arm press when the kit holds one - never alternating / one-arm, never a floor press or push-up while a bench press passes', () => {
    const LP = R.selection.lead_press;
    for (const n of ['02', '03', '04', '06', '07']) for (const w of plan(n).weeks) for (const d of w.days) {
      const lead = d.blocks.filter(b => b.kind !== 'circuit').flatMap(b => b.items).find(it => it.bucket === 'RP_HPUSH' && it.role !== 'test' && kindOf(it.bucket) === 'resistance');
      if (!lead) continue;
      const e = ex(lead.exercise_id);
      assert.ok(e.laterality === 'bilateral' && !new RegExp(LP.avoid_re).test(e.id), `${n} w${w.n} ${d.weekday} ${e.id}`);
      assert.ok(!new RegExp(LP.floor_re).test(e.id) || lead.detail, `${n} w${w.n} ${d.weekday} floor press / push-up ${e.id}`);
    }
  });

  test('R07-powerlifting-presses: a powerlifting-style client presses with both arms, keeps the heavy bracket and the strength rest for the whole exercise block (no pyramid flip mid-block)', () => {
    const p = plan('07');
    assert.equal(p.meta.derived.lift_style, 'heavy_powerlifting');
    const byEbSlot = new Map();
    for (const x of allItems(p)) {
      if (!['RP_HPUSH', 'RP_VPUSH'].includes(x.it.bucket) || x.it.role === 'test') continue;
      const e = ex(x.it.exercise_id);
      assert.ok(e.laterality === 'bilateral' && !/alternating|seesaw|single-arm/.test(e.id), `w${x.w.n} ${e.id}`);
      assert.equal(x.it.set_reps, null, `pyramid on ${e.id} w${x.w.n}`);
      if (x.it.role === 'work') {
        const k = x.w.exercise_block + '|' + x.it.slot_id;
        const sig = JSON.stringify([x.it.reps.min, x.it.reps.max, x.it.rest]);
        if (byEbSlot.has(k)) assert.equal(sig, byEbSlot.get(k), `${k} changes mid-block`);
        byEbSlot.set(k, sig);
        assert.deepEqual([x.it.rest.min, x.it.rest.max], R.rest.strength_s);
      }
    }
  });

  test('R06-generic-records: a record that names no implement or two exercises is never the pick ("Hip Thrust or Glute Bridge (either)", "Box Squat - any variation (Deload ...)", the inferred barbell alternating deadlift); no "Deload" in a name', () => {
    const generic = R.selection.generic_id_patterns.map(x => new RegExp(x));
    for (const n of Object.keys(NAMES)) {
      for (const x of allItems(plan(n))) if (x.it.exercise_id && RES.concat(['ISO_LEG_FLEXION', 'FOCUS']).includes(x.it.bucket)) assert.ok(!generic.some(re => re.test(x.it.exercise_id)), `${n} ${x.it.exercise_id}`);
      assert.ok(!/Deload/.test(md(n)), n);
    }
    assert.equal(model.t('en', 'exercise.box-squat-any-variation-dead-stop-deload-sit-and-unload-on-the-box.name'), 'Box Squat (dead stop on the box)');
  });

  test('R06-canonical-work-lift: the axial work lift of a physique / strength / class client is a canonical barbell lift (front or high-bar back squat; conventional, sumo or hex-bar deadlift), never a box squat "any variation" or a Zercher; a max test never sits on a stiff-leg deadlift', () => {
    const CW = R.selection.class_work_prefer_id_patterns;
    for (const n of ['06', '07']) for (const x of allItems(plan(n))) {
      if (x.it.role !== 'work' || !['RP_BKD', 'RP_BHD'].includes(x.it.bucket) || !(x.it.flags || []).includes('axial_counted')) continue;
      assert.ok(CW[x.it.bucket].some(re => new RegExp(re).test(x.it.exercise_id)), `${n} w${x.w.n} ${x.it.exercise_id}`);
    }
    for (const x of allItems(plan('07'))) if (x.it.role === 'test' && x.it.bucket === 'RP_BHD') assert.ok(!/stiff-leg|rdl/.test(x.it.exercise_id), x.it.exercise_id);
  });

  test('R02-home-substitutes: a home substitute (floor Y / T, DB leg extension on a box, body-weight calf raise) is never a resistance pick in a full gym; the real exercise comes back with a named detail', () => {
    for (const n of ['02', '06', '07']) for (const x of allItems(plan(n))) {
      if (!x.it.exercise_id || !['resistance', 'isolation', 'focus'].includes(kindOf(x.it.bucket))) continue;
      assert.ok(!ex(x.it.exercise_id).tags.includes('home_substitute'), `${n} w${x.w.n} ${x.it.exercise_id}`);
    }
  });

  test('R01-assisted-pull-up: a trained lifter never gets a feet-supported pull-up as the pick, and an assisted record never says "if you cannot reach the reps, regress"', () => {
    for (const n of ['01', '02', '06', '07']) for (const x of allItems(plan(n))) {
      if (!x.it.exercise_id) continue;
      if (['resistance', 'isolation'].includes(kindOf(x.it.bucket))) assert.ok(!/feet-supported/.test(x.it.exercise_id), `${n} ${x.it.exercise_id}`);
      if (/assisted|feet-supported/.test(x.it.exercise_id)) assert.ok(!x.it.notes.some(nt => /bodyweight_regress/.test(nt.key)));
    }
    // no assisted machine in the kit -> the kit's own regression words (RECHECK 04 minor)
    const p = plan('04');
    const bw = allItems(p).filter(x => (x.it.notes || []).some(nt => /bodyweight_regress/.test(nt.key)));
    assert.ok(bw.length && bw.every(x => x.it.notes.some(nt => nt.key === 'note.bodyweight_regress_no_machine')));
  });

  // ------------------------------------------------------------------------------------------------ effort (R3-VOL-04)
  test('R01-intensifiers-last-week: intensifiers live in the last stairway week only - at most one a day (a MYO set on the last small-muscle / machine exercise), never MAX, never a glute bridge or free-weight compound, never calves for an Achilles hot spot; the flag sits only on that item', () => {
    for (const n of Object.keys(NAMES)) {
      const p = plan(n);
      for (const w of p.weeks) for (const d of w.days) {
        const its = d.blocks.flatMap(b => b.items).filter(it => it.effort && it.effort.last_set);
        assert.ok(its.length <= 1, `${n} w${w.n} ${d.weekday}: ${its.length} intensifiers`);
        for (const it of its) {
          // F3 (E-119): a timed circuit's intensifier is a 10-s hold on an isolation station's last round
          assert.equal(it.effort.last_set, it.effort.circuit ? 'hold' : 'myo');
          assert.ok(w.planned_rir && w.planned_rir.intensifiers && w.block_type === 'stairway', `${n} w${w.n}`);
          assert.ok(!R.effort.intensifiers.never_credit_classes.includes(ex(it.exercise_id).credit_class), `${n} ${it.exercise_id}`);
        }
        for (const it of d.blocks.flatMap(b => b.items)) if (it.effort && it.effort.intensifier) assert.ok(it.effort.last_set, `${n} flag without intensifier`);
      }
    }
    for (const x of allItems(plan('08'))) if (x.it.bucket === 'ISO_CALF') assert.ok(!(x.it.effort && x.it.effort.last_set), 'calves MYO for an Achilles hot spot');
    // the copy says what the plan does: the drift line names the intensifier week, the header only in a week that carries one
    // (G-214, R2-PER-07: a test day carries no intensifier - every week-12 day of 01 tests, so the drift line is read on 06, whose last
    // week holds no test)
    const s = unesc(md('06'));
    // F3 (E-119): the drift line names the days that carry the intensifier ('Week 12: one intensifier on each of these days (...)')
    assert.ok(s.includes(model.t('en', 'effort.drift_intensifier', { week: 12 })) || s.includes(model.t('en', 'effort.drift_intensifier_days', { week: 12, days: '' }).split('(')[0]));
    const s01 = unesc(md('01'));
    assert.ok(!s01.includes(model.t('en', 'effort.drift_intensifier_days', { week: 12, days: '' }).split('(')[0]), '01: no intensifier promised on its test days');
    assert.ok(!/The last week may add one intensifier/.test(s));
  });

  test('R05-circuit-effort-drift: a resistance circuit station follows the planned effort (3 -> 2 -> 1-2 -> 1 reps left at the bell); a body-weight station picks a version, never a weight; a single-side station switches at half time', () => {
    const p = plan('05');
    let seen = 0;
    for (const x of allItems(p)) {
      if (!x.it.circuit || !x.it.effort || x.it.effort.type !== 'rir') continue;
      seen++;
      assert.ok(x.it.effort.circuit);
      assert.equal(x.it.effort.min, Math.max(x.w.planned_rir.min, x.it.effort.min));
      assert.ok(x.it.effort.min >= R.effort.rir_band[0] && x.it.effort.max <= R.effort.rir_band[1]);
      const e = ex(x.it.exercise_id);
      // (fix round 2 / F3, RECHECK v0.4 05 minor: 'switch sides at half time' contradicted an alternating lift's own cue - an alternating
      // station now reads 'alternate sides every rep', a one-side station still switches at half time)
      if (e.laterality === 'unilateral') assert.ok(x.it.notes.some(nt => nt.key === 'note.circuit_unilateral'), x.it.exercise_id);
      if (e.laterality === 'alternating') assert.ok(x.it.notes.some(nt => nt.key === 'note.circuit_alternating') && !x.it.notes.some(nt => nt.key === 'note.circuit_unilateral'), x.it.exercise_id);
      if (x.it.effort.key === R.effort.circuit_rir.bodyweight_key) assert.ok(!x.it.notes.some(nt => /week1_tip/.test(nt.key)), x.it.exercise_id);
    }
    assert.ok(seen > 50);
    const rirs = p.weeks.map(w => items(w).find(x => x.it.circuit && x.it.effort && x.it.effort.type === 'rir')).map(x => x.it.effort.min);
    assert.ok(rirs[0] === 3 && rirs[rirs.length - 1] === 1, rirs.join(' '));
    const es = unesc(renderPlan(p, model, { lang: 'es' }));
    // F3 (E-119, RECHECK 05 minor 'unas 1 repeticiones'): one rep left reads in the singular
    assert.ok(es.includes(model.t('es', 'effort.circuit_rir', { rir: 3 })) && (es.includes(model.t('es', 'effort.circuit_rir_one', { rir: 1 })) || es.includes(model.t('es', 'effort.circuit_rir_bw_one', { rir: 1 }))));
    assert.ok(!/unas 1 repeticiones|about 1 reps/.test(es + unesc(renderPlan(p, model, { lang: 'en' }))));
  });

  test('R03-rep-phase-season: the athlete rep phase follows the season phase - the late off-season starts at VOL2 (8-12 compounds), not 12-15 for six weeks', () => {
    const p = plan('03');
    const off = p.weeks.filter(w => w.block_type === 'stairway');
    // (v0.5 fix round 1, PER-11 'heavier by block' / sample 03 major: a single-block late off-season steps VOL2 -> VOL3 after its
    // halfway week - rules.reps.athlete_vol_phases.off_late_single_block_step, switched on - so the plan starts at VOL2 and never
    // goes back)
    const ph = off.map(w => w.rep_phase);
    assert.ok(off.every(w => w.season_phase === 'OFF_LATE') && ph[0] === 'VOL2' && ph.every((x, i) => ['VOL2', 'VOL3'].includes(x) && (i === 0 || !(ph[i - 1] === 'VOL3' && x === 'VOL2'))), ph.join(' '));
    for (const w of off) for (const x of items(w)) if (x.it.role === 'secondary' && x.it.reps && x.it.reps.bracket) assert.notEqual(x.it.reps.bracket, 'b12_15', x.it.exercise_id);
  });

  test('R02-week-level-wording: the stairway level reads "Week level: n of 11", never "Effort level" next to an RIR prescription', () => {
    for (const n of Object.keys(NAMES)) {
      const s = md(n, { lang: 'en' });
      assert.ok(!/Effort level/.test(s), n);
      assert.ok(/Week level: \d+(\.\d)? of 11/.test(s), n);
    }
  });

  test('R04-capped-fixed-reps: the class model\'s fixed reps meet the exercise\'s own ceiling (a weighted pull-up never at 10 reps)', () => {
    for (const x of allItems(plan('04'))) if (/weighted-pull-up|weighted-dip/.test(x.it.exercise_id || '') && x.it.reps && x.it.reps.type !== 'test') {
      const hi = x.it.reps.type === 'fixed' ? x.it.reps.value : x.it.reps.max;
      assert.ok(hi <= 8, `${x.it.exercise_id} ${JSON.stringify(x.it.reps)}`);
    }
  });

  test('R02-pair-strength-rest: a supersetted work lift keeps its 3-6 min rest after the pair (and the page prints it)', () => {
    const p = plan('07');
    const x = allItems(p).find(y => y.it.role === 'work' && y.it.bucket === 'RP_HPUSH');
    const slot = { slot_id: 'Tue.T.s01', bucket: 'RP_HPUSH', role: 'work', block: 'strength', superset: 'P1', why: [] };
    const d = doseItem({ slot, fill: { bucket: 'RP_HPUSH', flags: [], why: [] }, exercise: ex(x.it.exercise_id), sets: 3, week: x.w, day: null, derived: p.meta.derived, athletic: null, position: { superset_active: true }, at_cap: false, model });
    if (d.reps.max <= 8) {
      assert.deepEqual(d.rest, { type: 'after_pair', min: R.rest.strength_s[0], max: R.rest.strength_s[1] });
      const day = { weekday: 'Tue', supersets_on: true, blocks: [{ kind: 'strength', items: [{ ...x.it, superset: 'P1', rest: d.rest }, { ...x.it, slot_id: 'z', exercise_id: 'seated-cable-row', name_key: model.ex('seated-cable-row').name_key, superset: 'P1', rest: { type: 'after_pair' } }] }] };
      const fake = { ...p, weeks: [{ ...x.w, n: 1, days: [{ ...x.d, ...day }] }] };
      assert.ok(renderDay(fake, 1, x.d.weekday, model, { lang: 'en' }).includes(model.t('en', 'rest.after_pair_minutes', { min: 3, max: 6 })));
    }
  });

  // ------------------------------------------------------------------------------------------------ aerobic (EQ-14)
  test('R03-aerobic-modality: aerobic sessions are named by the client\'s own cardio tool (no run with only a bike / rower; low-impact tools first with knee pain) and climb one step per exercise block from the client\'s level', () => {
    for (const n of Object.keys(NAMES)) {
      const p = plan(n), opts = p.meta.kit.tokens && p.meta.derived.D8_kit.cardio_options;
      for (const x of allItems(p)) {
        if (!(x.it.aerobic || (x.it.effort && x.it.effort.type === 'aerobic'))) continue;
        const m = x.it.effort.modality;
        assert.ok(m === 'any' ? !opts.length : opts.includes(m), `${n} ${m} not in ${opts}`);
        if ((p.meta.derived.pain || []).some(q => q.area === 'knee')) assert.ok(!['run', 'treadmill'].includes(m), `${n} knee pain ${m}`);
      }
      const s = md(n, { lang: 'en' });
      assert.ok(!/2 Mile Run|Minute Run\/|Sec Run\//.test(s), `${n}: the coach's run-walk record names leak into the page`);
    }
    // the semi-pro midfielder no longer gets the beginner 20 s / 40 s run-walk as his Blue session (RECHECK 03 major)
    const blue = aerobicPick('A', plan('03').meta.derived, model, 's', 'x', 0);
    assert.notEqual(blue.id, R.conditioning.aerobic_b3.ladder.A[0]);
    // the ladder climbs one step per exercise block (RECHECK 04 major 'identical for all 8 weeks')
    const d = plan('02').meta.derived;
    assert.ok(R.conditioning.aerobic_b3.ladder.A.indexOf(aerobicPick('A', d, model, 's', 'x', 2).id) > R.conditioning.aerobic_b3.ladder.A.indexOf(aerobicPick('A', d, model, 's', 'x', 0).id));
  });

  test('R04-aerobic-test-shown: a cardio test on an aerobic day is written on the card (what to test, record the time)', () => {
    const p = plan('04');
    const t = allItems(p).filter(x => (x.it.aerobic || (x.it.effort && x.it.effort.type === 'aerobic')) && x.it.test);
    assert.ok(t.length);
    for (const x of t) assert.ok(renderDay(p, x.w.n, x.d.weekday, model, { lang: 'en' }).includes(model.t('en', 'ui.plan.aerobic_test', { test: model.t('en', 'tests.' + x.it.test.test) })), `w${x.w.n}`);
  });

  // ------------------------------------------------------------------------------------------------ tests and notes
  test('R01-test-items-render: a test item renders once as "Test: <name>" (never "countermovement jump — countermovement jump"); a rep-max test carries no training rep cap and no detail', () => {
    for (const n of ['01', '02', '03']) {
      const p = plan(n), s = unesc(md(n, { lang: 'en' }));
      assert.ok(!/countermovement jump — countermovement jump|10-30 m sprint — 10-30 m sprint/.test(s), n);
      for (const x of allItems(p)) if (x.it.role === 'test') {
        assert.ok(!x.it.notes.some(nt => nt.key === 'note.rep_cap'), `${n} ${x.it.slot_id}`);
        assert.equal(x.it.detail, null);
        const plain = x.d.blocks.flatMap(b => b.items).find(it => it.slot_id + '.test' === x.it.slot_id);
        if (plain) assert.equal(plain.detail, null, `${n} the planned sets after a test are the same lift`);
      }
    }
    assert.ok(unesc(md('01')).includes(model.t('en', 'ui.plan.test_item', { test: model.t('en', 'tests.cmj') })));
  });

  test('R05-test-header-by-type: a body test week says "weigh in and measure", not "replaces this week\'s top sets"', () => {
    const s = unesc(renderPlan(plan('05'), model, { lang: 'en' }));
    assert.ok(s.includes(model.t('en', 'ui.plan.test_end_body')));
    assert.ok(!s.includes(model.t('en', 'ui.plan.test_end')));
  });

  test('R06-failed-check-words: the notes print a failed check in the client\'s words (V28 with its numbers), never its internal id', () => {
    const p = plan('06');
    const v28 = p.validation.checks.find(c => c.id === 'V28');
    if (v28 && !v28.pass) {
      const s = unesc(md('06'));
      assert.ok(!/\(V28, \d+\)/.test(s));
      const a = v28.violations[0].args;
      // F3 (E-113): the advice follows the direction of the gap (more two-leg work when the share is under the target)
      const k = a.share > a.target ? 'check.failed.V28_more_single' : 'check.failed.V28_more_two';
      assert.ok(s.includes(model.t('en', k, { share: Math.round(a.share * 100), target: Math.round(a.target * 100) })));
    }
  });

  test('R02-day-title-from-picks: a day title names what the day holds (no "leg press / belt squat" on a single-leg day, no "knee" on a day without a knee lift)', () => {
    const s = md('02');
    // (v0.5 fix round 1, R4-SES-05 / PER-04 'one day of squatting and the other day of leg pressing': the second A day's slot 2 is a
    // two-leg knee lift again - the title follows the pick either way)
    const a2 = plan('02').weeks[0].days.find(x => x.day_type === 'A2');
    const lift = a2.blocks.flatMap(b => b.items).find(it => ['RP_BKD', 'RP_UKD'].includes(it.bucket) && it.role === 'work');
    if (lift.bucket === 'RP_BKD') { assert.ok(!s.includes('A2 - single-leg squat + pull')); assert.equal(ex(lift.exercise_id).laterality, 'bilateral'); }
    else { assert.ok(!s.includes('A2 - leg press / belt squat + pull')); assert.ok(s.includes('A2 - single-leg squat + pull')); }
    const sw = md('01');
    for (const d of plan('01').weeks[0].days.filter(x => x.label_key === 'day.athletic.3.S1')) {
      const knee = d.blocks.flatMap(b => b.items).some(it => ['RP_BKD', 'RP_UKD'].includes(it.bucket));
      if (!knee) assert.ok(!sw.includes('S1 - jump + knee + pull'));
    }
  });

  test('R04-wod-loads-rotation: a WOD station carries its load (dumbbells per hand, the kettlebell), the format says how to rotate, a calorie station shows one number', () => {
    const p = plan('04');
    const w = allItems(p).filter(x => x.it.wod);
    assert.ok(w.length);
    assert.ok(w.some(x => (x.it.wod.station_loads || []).some(Boolean)));
    for (const x of w) assert.ok(x.it.notes.some(nt => nt.key === 'wod.rotation.' + x.it.wod.format));
    const s = unesc(md('04'));
    assert.ok(!/\d+ cal Calorie Effort: \d+ cal/.test(s));
    assert.ok(s.includes(model.t('en', 'wod.rotation.emom')) || s.includes(model.t('en', 'wod.rotation.amrap')));
  });

  test('R02-core-swaps-plane: a core swap stays in the plane of the pick (a Copenhagen plank never swaps to toes-to-bar); a core exercise appears once a week', () => {
    for (const n of Object.keys(NAMES)) for (const w of plan(n).weeks) {
      // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): with the core slots on the live library (R4-LIB-01, sample 01
      // major) a low-back client's anti-movement drill - a plank, a dead bug, a bird dog - may run a second time in the week, two
      // or more days apart, before a crunch or a leg raise takes the slot (rules.selection.x2.core_primary.low_back_repeat_first)
      const WD7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const seen = new Map();
      for (const x of items(w)) {
        if (x.b.kind !== 'core' || !x.it.exercise_id) continue;
        const e = ex(x.it.exercise_id);
        const same = x.it.swaps.filter(sid => ex(sid).plane === e.plane).length;
        if (same >= 2) assert.ok(x.it.swaps.slice(0, same).every(sid => ex(sid).plane === e.plane), `${n} ${e.id} swaps ${x.it.swaps.join(', ')}`);
        const before = seen.get(e.id);
        assert.ok(before === undefined || (/plank|dead-bug|bird-dog/.test(e.id) && Math.abs(WD7.indexOf(x.d.weekday) - WD7.indexOf(before)) >= 2), `${n} w${w.n} ${e.id} twice`);
        seen.set(e.id, x.d.weekday);
      }
    }
  });

  test('R04-skill-rotation: the class model\'s skill station rotates through the week (not toes-to-bar on every day)', () => {
    for (const w of plan('04').weeks) {
      const skills = items(w).filter(x => x.it.bucket === 'SKILL').map(x => x.it.exercise_id);
      assert.ok(new Set(skills).size >= Math.min(skills.length, 4), `w${w.n} ${skills.join(' ')}`);
    }
  });

  // ------------------------------------------------------------------------------------------------ pickleball 52 (RECHECK 08)
  test('R08-safe-picks: the 52-year-old L1 with knee pain gets no barbell lift, no loaded flexion-rotation core (low-back rotation hot spot), no long-lever Copenhagen, no core exercise twice a week, wrist work for the racket elbow, no deep-knee swaps', () => {
    const p = plan('08');
    const coreSeen = new Map();
    for (const w of p.weeks) {
      coreSeen.clear();
      for (const x of items(w)) {
        if (!x.it.exercise_id) continue;
        const e = ex(x.it.exercise_id);
        if (['resistance', 'isolation'].includes(kindOf(x.it.bucket))) assert.ok(!e.tags.includes('barbell') || x.it.bucket === 'ISO_CALF' && x.it.detail, `w${w.n} barbell ${e.id}`);
        if (x.b.kind === 'core') {
          assert.ok(!/russian-twist|copenhagen-plank$/.test(e.id), `w${w.n} ${e.id}`);
          // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the plank may run on a second, far day - see R02-core-swaps-plane)
          assert.ok(!coreSeen.has(e.id) || (/plank|dead-bug|bird-dog/.test(e.id) && coreSeen.get(e.id) !== x.d.weekday), `w${w.n} ${e.id} twice`);
          coreSeen.set(e.id, x.d.weekday);
        }
        // v0.4 B4: the racket elbow's care is wrist work; the racket shoulder's care (COACH-R3 R3-ATH-02 'rotator-cuff work') shares
        // the RECOVERY_ARM_CARE bucket and is external-rotation work
        const code = ((x.it.why || []).find(y => y.key === 'why.prehab') || { args: {} }).args.code;
        if (/^ELBOW|RECOVERY_ARM_CARE/.test(x.it.bucket) && code !== 'SHOULDER_THROWER') assert.match(e.id, /wrist/);
        for (const s of x.it.swaps || []) if (['RP_UKD', 'RP_BKD'].includes(x.it.bucket)) assert.ok(!(ex(s).tags || []).includes('deep_knee_flexion'), `${e.id} swap ${s}`);
      }
    }
    // engine 0.5.0 / V2 (converted; DECISIONS G): the racket elbow's wrist extension is an optional add-on (COACH-R4 R4-LIB-01) - offered
    // on the plan, never a template pick
    assert.ok(!allItems(p).some(x => x.it.exercise_id === 'db-wrist-extension-slow-lowering'));
    assert.ok(p.meta.addons.some(a => a.exercise_id === 'db-wrist-extension-slow-lowering' && a.kind === 'joint_care' && a.code === 'ELBOW_LATERAL_RACKET'));
  });

  // ------------------------------------------------------------------------------------------------ Spanish (R2-GEN-08)
  test('R03-spanish-fixes: Olympic pulls are a "tirón" (the "jalón" is the lat pulldown), no "pájaros", a generic pull in a day title is a "tirón", one year is "1 año"', () => {
    assert.match(model.t('es', 'exercise.high-hang-clean-pull.name'), /^Tirón de cargada/);
    assert.match(model.t('es', 'exercise.mid-hang-snatch-pull.name'), /^Tirón de arranque/);
    assert.match(model.t('es', 'exercise.lat-pulldown-wide-grip.name'), /^Jalón al pecho/);
    assert.ok(!/Pájaro/i.test(model.t('es', 'exercise.bent-over-db-reverse-fly.name')));
    assert.equal(model.t('es', 'ui.plan.label_part.pull'), 'tirón');
    assert.equal(model.t('es', 'day.athletic.3.S1'), 'S1 - salto + rodilla + tirón');
    const s = md('03', { lang: 'es' });
    assert.ok(!/Jalón de (cargada|arranque)|Pájaros|salto \+ rodilla \+ jalón/.test(s));
    // a weekday inside a Spanish sentence is lower case; the capacity notice agrees in number ('del volumen semanal ... en contactos')
    // (fix round 2 / F3, R2-GEN-08; RECHECK v0.4 03 minor: a list of days inside a sentence takes its 'y')
    // (v0.5: the sentence that listed the days 'el lunes, miércoles y viernes' was a time-check notice, retired with CT-01; the
    // intensifier line lists its days the same way)
    // (v0.5 fix round 1: a day whose only candidate is a calf raise in a week that tests sprints or jumps takes no intensifier)
    // (G-214: 03's last week tests on all three days, so it carries no intensifier; the day list is read on 07's Spanish plan)
    assert.ok(!/el Lunes|\(Lunes/.test(s));
    assert.ok(/\((martes, jueves y viernes)\)/.test(md('07', { lang: 'es' })));
    assert.ok(!/del (contactos|lanzamientos|cambios|metros)/.test(s));
    const b = md('05', { lang: 'es' });
    assert.ok(b.includes('1 año de entrenamiento') && !b.includes('1 años'));
    assert.ok(!md('05', { lang: 'en' }).includes('1 years'));
  });

  test('R03-season-notice: the season notice says how many pre-season weeks the plan holds, not "2 weeks before the first game"', () => {
    const s = unesc(md('03', { lang: 'en' }));
    assert.ok(s.includes(model.t('en', 'warning.v6_season', { weeks: 2 })));
    assert.ok(!/switches to pre-season 2 weeks before the first game/.test(s));
  });

  test('R01-coach-voice-cues: no coach-to-coach note reaches the client\'s cue ("the client feels the right muscles", "(or a barbell)" with dumbbells)', () => {
    for (const k of ['exercise.reverse-hyperextension.cue', 'exercise.ghd-glute-ham-developer-hip-extension-glute-ham-raise.cue', 'exercise.alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer.cue', 'exercise.belt-squat-machine.cue']) {
      assert.ok(!/client|athlete|or a barbell/i.test(model.t('en', k)), k);
      assert.ok(!/cliente|atleta|o una barra/i.test(model.t('es', k)), k);
    }
  });

  // ------------------------------------------------------------------------------------------------ round 3: the printed plan
  test('R3-own-risk-line: every plan opens with "use at your own risk" and the link to the release (EN / ES); every view and fragment carries it; refer and invalid plans too (R3-GEN-01)', () => {
    for (const n of Object.keys(NAMES)) for (const lang of ['en', 'es']) {
      const url = R.legal.disclaimer_url[lang];
      const full = renderPlan(plan(n), model, { lang });
      const lines = full.split('\n');
      const iRisk = lines.findIndex(l => l.includes(model.t(lang, 'ui.plan.own_risk_label')));
      assert.ok(iRisk > 0 && iRisk < 5, `${n} ${lang} risk line on top`);
      assert.ok(lines[iRisk].includes('](' + url + ')'));
      for (const view of ['overview', 'block', 'week', 'day']) assert.ok(renderPlan(plan(n), model, { lang, view, weeks: [1] }).includes(url), `${n} ${lang} ${view}`);
      assert.ok(renderWeek(plan(n), 1, model, { lang }).includes(url) && renderBlockView(plan(n), 1, model, { lang }).includes(url));
    }
    const refer = renderPlan({ status: 'refer', refer: { reasons: ['refer.reason.heart'] }, meta: {} }, model, { lang: 'es' });
    assert.ok(refer.includes(R.legal.disclaimer_url.es));
    const invalid = renderPlan({ status: 'invalid', errors: [{ code: 'release_missing', key: 'warning.release_missing' }], meta: {} }, model, { lang: 'en' });
    assert.ok(invalid.includes(R.legal.disclaimer_url.en));
  });

  test('R3-time-check-printed: the plan says up front what is trained directly, what is not (because of time / through compound lifts) and the offers in numbers (R3-SES-02)', () => {
    for (const n of Object.keys(NAMES)) {
      const p = plan(n), s = unesc(md(n));
      const tc = p.time_check;
      if (!tc) continue;
      const head = s.slice(0, s.indexOf('## ' + model.t(p.lang, 'instruction.title')));
      assert.ok(head.includes('## ' + model.t(p.lang, 'ui.plan.schedule')), n);
      const g = (gs) => gs.map(x => model.t(p.lang, 'group.' + x)).join(', ');
      // F3 (E-116): 'climbing every week' only when it is true (else 'through the block'); calves under the floor have their own line
      if (tc.trained_groups.length && tc.not_trained_directly.length) {
        // (F3, E-116: a group held below the floor is named on its own line, never in the '10+ sets' list)
        const below = new Set((tc.trained_below_floor || []).map(x => x.group));
        const tg = tc.trained_groups.filter(x => !below.has(x)), tgNoCalves = tg.filter(x => x !== 'calves');
        if (!tg.length) { assert.ok(head.includes(model.t(p.lang, 'ui.plan.below_floor', { groups: g([...below]) })), n); continue; }
        // (fix round 2 / F1: a plan whose only group at the floor is calves under 10 names them on the calves line)
        if (!tgNoCalves.length && head.includes(model.t(p.lang, 'ui.plan.calves_line', { from: '', to: '' }).split(' ')[0])) continue;
        const ok = [tg, tgNoCalves].some(list => list.length && ['ui.plan.trained_directly', 'ui.plan.trained_directly_block', 'ui.plan.trained_directly_circuit'].some(k => head.includes(model.t(p.lang, k, { groups: g(list) }))));
        assert.ok(ok, n);
      }
      const time = tc.not_trained_directly.filter(x => x.reason === 'time').map(x => x.group);
      // v0.4 B4: a group the block gives no credited set at all is named 'not trained in this plan' (ui.plan.not_trained_time_none)
      const bw = p.weeks.filter(w => w.training_block === tc.training_block);
      const none = time.filter(gr => !bw.some(w => ((w.weekly_sets_by_group || {})[gr] || 0) > 0)), some = time.filter(gr => !none.includes(gr));
      // (fix round 2 / F3, E-196; RECHECK v0.4 01 major / 08 minor: 'they still get work from your compound lifts' for a chest whose only
      // work is one kept press) a group that keeps an exercise is named with it; the others share the 'no direct exercise' line
      for (const gr of some) {
        const name = model.t(p.lang, 'group.' + gr);
        const keptLine = head.split('\n').find(l => l.startsWith('- ' + name + ':'));
        const creditLine = head.split('\n').find(l => l.startsWith('- ' + model.t(p.lang, 'ui.plan.not_trained_credit_all', { groups: '' }).split(':')[0]));
        assert.ok(keptLine || (creditLine && creditLine.includes(name)), `${n} ${gr}`);
      }
      if (none.length) assert.ok(head.includes(model.t(p.lang, 'ui.plan.not_trained_time_none', { groups: g(none) })), n);
      // (fix round 2 / F1: offer args may be codes - a weekday, group ids - resolved like the render does, explain.tr)
      for (const of of p.offers) assert.ok(head.includes(tr(model, p.lang, of.key, of.args)), `${n} ${of.key}`);
    }
  });

  test('R3-block-toggles-printed: each training day says which blocks can be switched off today (athletic, core ...) and that exercises can be added or removed (R3-SES-02)', () => {
    for (const n of ['01', '02', '08']) {
      const p = plan(n);
      for (const d of p.weeks[0].days.filter(x => x.kind === 'main')) {
        const card = unesc(renderDay(p, 1, d.weekday, model, { lang: 'en' }));
        // F3 (E-112): every switchable kind the JSON names, accessories and the cool-down too
        const kinds = d.toggle_blocks.filter(k => ['athletic', 'power', 'core', 'skill', 'conditioning', 'aerobic', 'prehab', 'accessories', 'cooldown'].includes(k) && d.blocks.some(b => b.kind === k && b.items.length));
        if (!kinds.length) continue;
        assert.ok(card.includes(model.t('en', 'ui.plan.edit_day', { blocks: kinds.map(k => model.t('en', 'block.short.' + k)).join(', ') })), `${n} ${d.weekday}`);
      }
    }
    assert.ok(unesc(md('02')).includes(model.t('en', 'block.short.athletic')));
  });

  test('R3-superset-recommendations-printed: a superset the day does not run yet is suggested with the minutes it saves; prefs.superset_recommendations "hide" hides it (R3-SES-02 step 3)', () => {
    const p = JSON.parse(JSON.stringify(plan('06')));
    const d = p.weeks[0].days.find(x => (x.superset_recommendations || []).length);
    for (const r of d.superset_recommendations) r.on = false;
    const rec = d.superset_recommendations.find(r => r.minutes_saved > 0);
    const its = rec.items.map(id => d.blocks.flatMap(b => b.items).find(it => it.slot_id === id));
    const nm = (it) => model.t('en', it.name_key) + (it.detail ? ' - ' + model.t('en', it.detail.key) : '');
    const line = model.t('en', 'ui.plan.superset_suggest_line', { pair: its.map(nm).join(' + '), min: rec.minutes_saved });
    assert.ok(unesc(renderDay(p, 1, d.weekday, model, { lang: 'en' })).includes(line));
    p.meta.derived.prefs.superset_recommendations = 'hide';
    assert.ok(!unesc(renderDay(p, 1, d.weekday, model, { lang: 'en' })).includes(line));
  });

  test('R3-no-checkin-text: no printed plan asks for a check-in or feedback; the check-in words are gone from the model (R3-VOL-02 "take away all check-in info")', () => {
    for (const n of Object.keys(NAMES)) for (const lang of ['en', 'es']) {
      const s = renderPlan(plan(n), model, { lang, show_why: true });
      assert.ok(!/check-?in|feedback|chequeo|Couldn.t do it|No pude hacerlo/i.test(s), `${n} ${lang}`);
    }
    for (const k of ['felt.couldnt', 'felt.pain', 'felt.right', 'felt.wrong', 'intake.error.week_by_week_needs_checkin']) assert.ok(!model.has('en', k), k);
    assert.ok(!/mark that exercise/i.test(model.t('en', 'effort.ten')));
  });

  test('R3-macro-views: the overview (screenshots) holds the stairway table (week, level, effort, sets), the weekly sets per muscle group, the week at a glance and one table per day - every table at most 4 columns (R2-GEN-02)', () => {
    for (const n of Object.keys(NAMES)) for (const lang of ['en', 'es']) {
      const s = renderPlan(plan(n), model, { lang, view: 'overview' });
      assert.ok(s.includes('| ' + [model.t(lang, 'ui.plan.col.week'), model.t(lang, 'ui.plan.level'), model.t(lang, 'ui.plan.col.effort')].join(' | ')), `${n} ${lang} stairway table`);
      assert.ok(s.includes(model.t(lang, 'ui.plan.weekly_sets_groups')), `${n} ${lang} group table`);
      assert.ok(s.includes(model.t(lang, 'ui.plan.week_glance', { n: 1 })), `${n} ${lang} week glance`);
      assert.ok(s.includes('| # | ' + model.t(lang, 'ui.plan.col.exercise')), `${n} ${lang} day table`);
      for (const l of s.split('\n').filter(x => x.trim().startsWith('|'))) assert.ok((l.match(/\|/g) || []).length <= 5, `${n} ${lang} ${l}`);
    }
  });

  test('R01-holiday-notice: weeks that hold Christmas / New Year are named before week 1 (R2-PER-02, R3-PER-01)', () => {
    const s = unesc(md('07'));
    // (v0.6 words, converted - DECISIONS G-177: 'weeks 11 and 12')
    assert.ok(s.includes(model.t('en', 'ui.plan.holiday_weeks', { weeks: '11 and 12' })));
    const moved = planWith('07', i => { i.schedule.start_date = '2027-03-01'; });
    assert.ok(!unesc(renderPlan(moved, model, { lang: 'en' })).includes(model.t('en', 'ui.plan.holiday_weeks', { weeks: '11 and 12' }).slice(0, 20)));
  });
});
