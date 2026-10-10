// tests/review-r2f1.test.mjs - engine 0.4.0 FIX ROUND 2 / F1 (time, volume and structure) regression tests. One test per fixed issue of
// the coach-eye reviews of the v0.4 sample plans (grades D ... B-), named R<sample>-<slug> after the reviewed sample, and
// R2F1-sweep-<intake>-<slug> for an intake of the random sweep (tests/helpers/random-intake.mjs) the round's own changes made fail on
// the way. samples/REVIEW_LOG.md (v0.4 fix round 2 / F1) and engine/DECISIONS.md (E-135 ...) list them. Plans are built on the
// compiled model (model/) unless the test says the fixture.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { supersetMinutes, linesOf } from '../engine/timefit.mjs';
import { loadCompiledModel, loadFixtureModel, INTAKE_DIR } from './helpers/models.mjs';
import { randomIntake, sportIntake } from './helpers/random-intake.mjs';

const model = loadCompiledModel();
const fixture = loadFixtureModel();
const R = model ? model.rules : null;
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const ALL = Object.keys(NAMES);
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const passes = (p, ids) => { for (const id of ids) assert.ok(check(p, id).pass, `${id}: ${JSON.stringify(check(p, id).violations.slice(0, 2))}`); };
const stairWeeks = (p, tb) => p.weeks.filter(w => w.block_type === 'stairway' && (tb === undefined || w.training_block === tb));
const md = (n, lang = 'en') => renderPlan(plan(n), model, { lang, view: 'full' }).replace(/\\([*_#|\\-])/g, '$1');
const BIG = ['quads', 'hips', 'back', 'chest'];
const focusGroups = (p) => (p.meta.targets.priority || []).map(l => linesOf(model).groupOfLine[l]);
const below = (p) => new Set((p.time_check.trained_below_floor || []).map(x => x.group));

describe('v0.4 fix round 2 / F1: time, volume and structure (coach-eye reviews of the v0.4 samples)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------ the climb on the main days
  test('R01-climb-on-main-days: the swimmer\'s trained big groups climb on the MAIN days (not on the optional Saturday) and no big group that is not a Focus muscle adds an exercise there (E-135, R3-VOL-03, ORD-10 / ORD-11)', () => {
    for (const n of ['01', '03', '06']) {
      const p = plan(n), ws = stairWeeks(p, 1), fg = focusGroups(p), bl = below(p);
      for (const g of p.time_check.trained_groups.filter(x => BIG.includes(x) && !fg.includes(x))) {
        const need = bl.has(g) ? R.stairway.min_climb.calves : (ws.length <= R.stairway.min_climb.short_block.max_N ? R.stairway.min_climb.short_block.group : R.stairway.min_climb.group);
        assert.ok(ws[ws.length - 1].main_sets_by_group[g] - ws[0].main_sets_by_group[g] >= need - 0.5 - EPS, `${n} ${g} main ${ws.map(w => w.main_sets_by_group[g]).join(' ')}`);
      }
      for (const x of allItems(p).filter(x => x.d.kind === 'optional' && ['focus_added', 'bonus'].includes(x.it.origin))) {
        const ex = model.ex(x.it.exercise_id);
        const l = linesOf(model).lineOf[ex.primary_muscle];
        assert.ok(!l || linesOf(model).defs[l].class === 'small' || (p.meta.targets.priority || []).includes(l), `${n} w${x.w.n} ${x.d.weekday} ${x.it.exercise_id} (${l})`);
      }
    }
  });
  test('R01-main-total-climbs: the main-day total never holds for most of the block (it held 32 for ten weeks while Saturday climbed) - H21 total_hold (E-136)', () => {
    for (const n of ALL) passes(plan(n), ['H21']);
    for (const n of ['01', '03']) {
      const tm = stairWeeks(plan(n), 1).map(w => w.total_main_sets);
      assert.ok(tm[tm.length - 1] - tm[0] >= 4, `${n}: ${tm.join(' ')}`);
    }
  });
  test('R03-h21-reads-main-days: H21 fails a block whose main days hold flat while the all-days sets climb (main_days_flat, flat_second_half / group_hold on main_sets_by_group, total_hold)', () => {
    const p = structuredClone(plan('02'));
    const ws = stairWeeks(p, 1);
    for (const w of ws) { w.main_sets_by_group.back = ws[0].main_sets_by_group.back; w.total_main_sets = ws[0].total_main_sets + (w.n > 2 ? 1 : 0); }
    const v = validatePlan(p, model).checks.find(c => c.id === 'H21').violations.map(x => x.args && x.args.rule);
    assert.ok(v.includes('main_days_flat'), JSON.stringify(v));
    assert.ok(v.includes('group_hold_main_days') || v.includes('flat_second_half_main_days'), JSON.stringify(v));
    assert.ok(v.includes('total_hold'), JSON.stringify(v));
  });
  test('R06-optional-focus-slots: a Focus muscle\'s optional-day sets stay inside the day\'s two Focus slots x 2-3 sets, and an added exercise there never passes the line\'s main-day exercises (ORD-11, E-87 order; E-135)', () => {
    const p = plan('06');
    const OF = R.placement.added_slots.optional_focus;
    const X = linesOf(model);
    for (const w of stairWeeks(p)) for (const d of w.days.filter(x => x.kind === 'optional')) {
      const per = {};
      for (const x of items({ days: [d] }).filter(x => x.it.exercise_id && ['focus_added'].includes(x.it.origin))) {
        const l = X.lineOf[model.ex(x.it.exercise_id).primary_muscle];
        per[l] = (per[l] || 0) + x.it.sets;
        assert.ok(x.it.sets <= OF.sets_max, `${w.n} ${d.weekday} ${x.it.exercise_id} ${x.it.sets}`);
      }
      for (const [l, n] of Object.entries(per)) assert.ok(n <= OF.slots * OF.sets_max, `${w.n} ${d.weekday} ${l} ${n}`);
    }
  });

  // ------------------------------------------------------------------------------------------------ the whole-set schedule
  test('R04-ceiling-in-the-last-week: every trained line reaches its ceiling in the last stairway week (the week before for a lift tested in the end-test week) - never weeks early and then flat (E-146, R3-VOL-04)', () => {
    for (const n of ['02', '04', '06', '07', '08']) {
      const p = plan(n), ws = stairWeeks(p, 1), N = ws.length, st = p.meta.stairway[0];
      for (const l of p.meta.targets.lines) {
        const cap = st.cap[l];
        if (typeof cap !== 'number' || (st.dropped_groups || []).includes(linesOf(model).groupOfLine[l])) continue;
        const main = ws.map(w => w.main_sets_by_muscle[l]);
        const first = main.findIndex(x => x >= cap - EPS);
        if (first < 0) continue; // a line the minutes held under its ceiling
        // (the last week, or a week or two before it when the 7 % weekly limit or the end-test week moves the final set earlier)
        assert.ok(first >= N - 3, `${n} ${l} reaches ${cap} in week ${first + 1} of ${N}: ${main.join(' ')}`);
      }
    }
  });
  test('R03-steps-grow: the main-day total never sits three weeks in a row and the steps after the halfway week are on average no smaller than before it (R3-VOL-04 "about 3 % then about 5 %")', () => {
    for (const n of ['01', '02', '03', '04', '06', '07', '08']) {
      const tm = stairWeeks(plan(n), 1).map(w => w.total_main_sets), N = tm.length, half = Math.ceil(N / 2);
      // (a block whose minutes hold fewer whole-set steps than half its weeks - each line's last set stays in the last weeks - may sit longer)
      let run = 0;
      if (tm[N - 1] - tm[0] >= N / 2) for (let i = 1; i < N; i++) { run = tm[i] <= tm[i - 1] + EPS ? run + 1 : 0; assert.ok(run < 3, `${n}: ${tm.join(' ')}`); }
      const early = [], late = [];
      for (let i = 1; i < N; i++) (i + 1 <= half ? early : late).push((tm[i] - tm[i - 1]) / tm[i - 1]);
      const mean = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
      assert.ok(mean(late) >= mean(early) - EPS, `${n}: early ${mean(early).toFixed(3)} late ${mean(late).toFixed(3)} (${tm.join(' ')})`);
    }
  });

  // ------------------------------------------------------------------------------------------------ structure
  test('R01-cross-pattern: athletic.3 S1 / S2 follow the cross pattern (S1 squat + row, single-leg hinge + press; S2 hinge + press, single-leg squat + row) and the v1.1 same-pattern days are the same_pattern variant (E-137, R3-SES-01, UNI-06; D-81 retired)', () => {
    const t = model.template('athletic', '3');
    const b = (dt) => t.day_types[dt].stations.filter(s => s.pair).map(s => s.pair + ':' + s.bucket);
    assert.deepEqual(b('S1').slice(0, 4), ['P1:RP_BKD', 'P1:RP_HPULL', 'P2:RP_UHD', 'P2:RP_VPUSH']);
    assert.deepEqual(b('S2').slice(0, 4), ['P1:RP_BHD', 'P1:RP_HPUSH', 'P2:RP_UKD', 'P2:RP_HPULL']);
    assert.ok(t.variants.same_pattern && t.variants.same_pattern.day_types.S1.stations.some(s => s.bucket === 'RP_UKD' && s.pair === 'P2'));
    assert.equal(plan('01').meta.template.pairing, 'cross_pattern');
    passes(plan('01'), ['V11', 'H06', 'V23', 'H18']);
  });
  test('R01-hip-day-push: the swimmer\'s hip + push day keeps a press - a pattern station paired with the hinge when the day holds it at week 1 and at the peak, else on Saturday (E-145, W2 / ORD-06)', () => {
    const p = plan('01');
    const w1 = p.weeks[0], wed = w1.days.find(d => d.weekday === 'Wed');
    const press = wed.blocks.flatMap(b => b.items).find(it => it.origin === 'pattern_kept' && it.bucket === 'RP_HPUSH');
    if (press) assert.ok(wed.blocks.flatMap(b => b.items).some(it => it.role === 'work' && it.superset_suggested === press.superset_suggested), 'paired with the hinge');
    for (const w of stairWeeks(p)) assert.ok(items(w).some(x => x.it.origin === 'pattern_kept' && x.it.bucket === 'RP_HPUSH'), `week ${w.n}`);
  });
  test('R04-class-split: the CrossFit class holds its snatch on the press day and its clean on Friday, the squat and deadlift days hold their lift and pairs, and the skill practice runs on the squat (DUBS) and deadlift (GYMNASTICS) days at 60 minutes (E-141, OBSERVED class split)', () => {
    const p = plan('04');
    for (const w of stairWeeks(p)) {
      const oly = (wd) => (w.days.find(d => d.weekday === wd) || { blocks: [] }).blocks.flatMap(b => b.items).filter(it => it.bucket === 'AP_TRIPLE_EXT');
      assert.equal(oly('Mon').length + oly('Thu').length, 0, `w${w.n}`);
      const skill = w.days.filter(d => d.kind === 'main' && d.blocks.some(b => b.items.some(it => it.bucket === 'SKILL'))).map(d => d.weekday);
      assert.deepEqual(skill, ['Mon', 'Thu'], `w${w.n}`);
    }
  });
  test('R04-class-trains-back: on 4 x 60 the class trains back at 10+ and climbing (both pull pairs on the squat day + Friday) and keeps quads and hips on their class lifts with a second exercise (E-142 superset rounds, E-141)', () => {
    const p = plan('04');
    assert.ok(p.time_check.trained_groups.includes('back'), JSON.stringify(p.time_check));
    const ws = stairWeeks(p);
    assert.ok(ws.every(w => w.main_sets_by_group.back >= 10 - EPS) && ws[ws.length - 1].main_sets_by_group.back - ws[0].main_sets_by_group.back >= 1.5);
    for (const g of ['quads', 'hips']) for (const w of ws) {
      const days = w.days.filter(d => d.kind === 'main' && d.blocks.some(b => b.items.some(it => it.role === 'work' && it.group === g)));
      assert.ok(days.every(d => d.blocks.flatMap(b => b.items).filter(it => it.group === g && it.sets > 0 && it.role !== 'test').length >= 2), `w${w.n} ${g}`);
    }
  });
  test('R04-superset-rounds: a superset partner with more sets than its pair costs its own rest for the extra rounds, not the pair\'s strength rest (timefit.supersetMinutes, E-142)', () => {
    const a = { sets: 3, cost: { work: 0.75, rest: 4.5, minutes: 5.25 } }, b = { sets: 4, cost: { work: 0.75, rest: 1.5, minutes: 2.25 } };
    const t = supersetMinutes([a, b], model), T = R.time_model;
    assert.ok(Math.abs(t - (3 * (1.5 + 4.5) + (0.75 + 1.5) + 2 * T.changeover_in_superset_pair)) < 1e-9, String(t));
    assert.ok(Math.abs(supersetMinutes([{ ...a }, { ...b, sets: 3 }], model) - (3 * (1.5 + 4.5) + 2 * T.changeover_in_superset_pair)) < 1e-9);
  });

  // ------------------------------------------------------------------------------------------------ 08: the day patterns
  test('R08-day-patterns: the 2 x 45 racket player keeps a knee lift with a row on day A and a hinge on day B (each below its floor, climbing), the press as a pattern station, calves on both leg days (E-140 / E-143 / E-144 / E-145)', () => {
    const p = plan('08');
    for (const w of stairWeeks(p)) {
      const day = (wd) => w.days.find(d => d.weekday === wd).blocks.flatMap(b => b.items).filter(it => it.sets > 0);
      const mon = day('Mon'), thu = day('Thu');
      const knee = mon.find(it => ['RP_BKD', 'RP_UKD'].includes(it.bucket) && it.role === 'work');
      assert.ok(knee, `w${w.n} knee work lift`);
      assert.ok(mon.some(it => it.bucket === 'RP_HPULL' && it.origin === 'pattern_kept' && it.superset_suggested && it.superset_suggested === knee.superset_suggested), `w${w.n} row paired with the knee lift`);
      assert.ok(thu.some(it => ['RP_BHD', 'RP_UHD'].includes(it.bucket) && it.role === 'work'), `w${w.n} hinge`);
      for (const d of [mon, thu]) assert.ok(d.filter(it => it.bucket === 'ISO_CALF').reduce((a, it) => a + it.sets, 0) >= 3, `w${w.n} calves`);
      assert.ok(items(w).some(x => x.it.origin === 'pattern_kept' && x.it.bucket === 'RP_HPUSH'), `w${w.n} press`);
    }
    assert.ok(p.time_check.trained_groups.includes('calves'));
    assert.deepEqual([...below(p)].sort(), ['hips', 'quads']);
    passes(p, ['V22', 'V23', 'H17', 'H18', 'V19', 'H21']);
  });
  test('R08-power-switchable: the stay-active power block that the minutes switched off is offered back in minutes (offer.block_on) and V19 accepts its absence (E-143, R3-SES-02 "turn off that day\'s athletic training")', () => {
    const p = plan('08');
    const off = p.time_check.blocks_off || [];
    if (!off.length) return;
    assert.ok(p.offers.some(o => o.key === 'offer.block_on' && o.args.min > 0), JSON.stringify(p.offers));
    assert.ok(md('08').includes(model.t('en', 'offer.block_on', { block: model.t('en', 'block.short.power'), min: off[0].minutes })));
    passes(p, ['V19']);
  });
  test('R03-calves-optional-slot: with fewer than 4 main leg days the optional day\'s Calves slot carries the calves\' floor and climb next to one calf exercise x 3 sets a leg day (E-139, BRAIN V5b)', () => {
    const p = plan('03');
    assert.ok(p.time_check.trained_groups.includes('calves'), JSON.stringify(p.time_check.not_trained_directly));
    for (const w of stairWeeks(p)) {
      for (const d of w.days.filter(d => d.kind === 'main')) for (const it of d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'ISO_CALF')) assert.ok(it.sets <= 3, `w${w.n} ${d.weekday} ${it.sets}`);
      assert.ok(w.weekly_sets_by_group.calves >= 10 - EPS, `w${w.n} ${w.weekly_sets_by_group.calves}`);
    }
    passes(p, ['V22', 'H17']);
  });

  // ------------------------------------------------------------------------------------------------ Focus muscles under a time limit
  test('R07-focus-back-climbs: the PPL client\'s Focus back climbs through the block (it held 18 -> 21, flat in the hardest weeks) and ends at or above every group outside the Focus muscles (helper credit aside) (E-154, R3-SES-01 / R3-SES-02, R3-VOL-04)', () => {
    const p = plan('07'), ws = stairWeeks(p), fg = focusGroups(p);
    assert.deepEqual(fg, ['chest', 'back']);
    const last = ws[ws.length - 1].main_sets_by_group;
    for (const g of fg) {
      const ser = ws.map(w => w.main_sets_by_group[g]);
      assert.ok(ser[ser.length - 1] - ser[0] >= 5, `${g} ${ser.join(' ')}`);
      // never three weeks in a row without a step in the second half
      const half = Math.ceil(ser.length / 2);
      for (let i = half + 2; i < ser.length; i++) assert.ok(!(ser[i] <= ser[i - 1] + EPS && ser[i - 1] <= ser[i - 2] + EPS && ser[i - 2] <= ser[i - 3] + EPS), `${g} ${ser.join(' ')}`);
      for (const h of Object.keys(last).filter(x => !fg.includes(x))) assert.ok(last[g] >= last[h] - 0.5 - EPS, `${g} ${last[g]} < ${h} ${last[h]}`);
    }
  });
  test('R06-big-movers-before-arms: under a time cut the big movers fill the room before the arms - the aesthetics client\'s back and chest end above the biceps and triceps (back ended at 17 under biceps 18.25) (E-156, R3-SES-02 step 2, R2-VOL-04)', () => {
    for (const n of ['06', '07']) {
      const p = plan(n), ws = stairWeeks(p, 1), bl = below(p);
      assert.equal(p.time_check.fits, false, n);
      const last = ws[ws.length - 1].main_sets_by_group;
      for (const b of BIG.filter(g => p.time_check.trained_groups.includes(g) && !bl.has(g))) for (const sm of ['biceps', 'triceps']) assert.ok(last[sm] <= last[b] + 0.5 + EPS, `${n} ${sm} ${last[sm]} > ${b} ${last[b]}`);
    }
    const ws6 = stairWeeks(plan('06'), 1);
    assert.ok(ws6[ws6.length - 1].main_sets_by_group.back - ws6[0].main_sets_by_group.back >= ws6[ws6.length - 1].main_sets_by_group.biceps - ws6[0].main_sets_by_group.biceps, 'back climbs at least as much as the biceps');
  });
  test('R07-step-order: a Focus line\'s new sets go to its compounds in day order (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3), never skipping the pulldown and the weighted pull-up while the single-arm row is capped by the work lift (E-154, VOL-07 / BRAIN V10)', () => {
    const p = plan('07');
    for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
      const its = d.blocks.filter(b => b.kind === 'strength').flatMap(b => b.items).filter(it => ['chest', 'back'].includes(it.group) && !String(it.slot_id).endsWith('.test'));
      for (const g of ['chest', 'back']) {
        const st = its.filter(it => it.group === g);
        for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) assert.ok(!(st[j].sets >= 3 && st[i].sets <= 2 && st[i].role !== 'work'), `w${w.n} ${d.weekday} ${g}: ${st.map(x => x.slot_id + ':' + x.sets).join(' ')}`);
      }
    }
    const tue12 = stairWeeks(p).slice(-1)[0].days.find(d => d.weekday === 'Tue').blocks.flatMap(b => b.items);
    for (const id of ['Tue.Pull.s07', 'Tue.Pull.s08']) assert.ok(tue12.find(it => it.slot_id === id).sets >= 3, id);
  });
  test('R07-side-raise-on-pull-day: the PPL pull day holds one reverse fly and one side raise (the coach\'s \'ABdution\' slot), never two rear-delt flies (E-155, OBSERVED BYOP PUSHPULLLEGS, R3-VOL-01)', () => {
    const p = plan('07');
    for (const d of p.weeks[0].days.filter(x => x.day_type === 'Pull')) {
      const delt = d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'ISO_SIDE_REAR_DELT');
      const rear = delt.filter(it => (model.ex(it.exercise_id).primary_muscle === 'rear_delts'));
      assert.equal(rear.length, 1, `${d.weekday}: ${delt.map(it => it.exercise_id).join(' ')}`);
    }
  });

  // ------------------------------------------------------------------------------------------------ timed circuits (bootcamp)
  test('R05-work-time-steps: the circuit work seconds follow the approved steps from the configured start (3 % to halfway, 5 % after) and end at or under the top, so a 45-min day stays at 45 min in the last week (E-153, R3-VOL-04)', () => {
    const p = plan('05'), ws = stairWeeks(p), CS = R.supersets.bootcamp.stairway;
    const sec = ws.map(w => w.circuit.work_s);
    assert.deepEqual(sec, [35, 36, 37, 38, 40, 42, 44, 46]);
    assert.ok(sec[0] <= CS.work_s_start && sec[sec.length - 1] <= CS.work_s_max, sec.join(' '));
    for (const w of ws) for (const d of w.days.filter(x => x.kind === 'main')) assert.ok(d.est_minutes <= p.meta.session_minutes, `w${w.n} ${d.weekday} ${d.est_minutes}`);
    // the 'work time grows' line names the real range
    const wy = ws[0].days.flatMap(d => d.blocks.flatMap(b => b.items)).flatMap(it => it.why || []).find(x => x.key === 'why.circuit_stairway');
    assert.deepEqual(wy && wy.args, { from: 35, to: 46 });
  });
  test('R05-chest-floor: the bootcamp chest reaches its floor every stairway week (Friday\'s circuit holds a press of its own) and no circuit day trains a group with one lone station (V23 on circuits) (E-149, E-150)', () => {
    const p = plan('05');
    assert.ok(!below(p).has('chest'), JSON.stringify(p.time_check.trained_below_floor));
    for (const w of stairWeeks(p)) assert.ok(w.weekly_sets_by_group.chest >= R.volume.floor.value - EPS, `w${w.n} ${w.weekly_sets_by_group.chest}`);
    const fri = p.weeks[0].days.find(d => d.weekday === 'Fri');
    assert.ok(fri.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items).filter(it => it.group === 'chest').length >= 2);
    passes(p, ['V23']);
  });
  test('R05-ballistic-first: the swing / throw opens the first circuit of its day, no two stations in a row train the same group, and the horizontal press / row still comes before its vertical partner (E-151, ORD-03, H03 / H04)', () => {
    const p = plan('05');
    for (const w of p.weeks) for (const d of w.days) {
      const circ = d.blocks.filter(b => b.kind === 'circuit');
      if (!circ.length) continue;
      const bal = circ.flatMap(b => b.items).filter(it => it.athletic && ['ballistic', 'throw'].includes(it.athletic.quality));
      if (bal.length) assert.equal(circ[0].items[0], bal[0], `w${w.n} ${d.weekday}: ${circ[0].items.map(it => it.exercise_id).join(' ')}`);
      for (const b of circ) for (let i = 1; i < b.items.length; i++) {
        const a = b.items[i - 1].group, z = b.items[i].group;
        assert.ok(!a || a !== z, `w${w.n} ${d.weekday} circuit ${b.circuit}: ${b.items.map(it => it.group).join(' ')}`);
      }
    }
    passes(p, ['V12']);
  });
  test('R05-switchable-stations: the swing, the throws and the cardio station of a circuit are switchable by name (day.toggle_items), and the day says so (E-152)', () => {
    const p = plan('05');
    for (const d of p.weeks[0].days.filter(x => x.blocks.some(b => b.kind === 'circuit'))) {
      const its = d.blocks.flatMap(b => b.items);
      const cond = its.filter(it => it.bucket === 'COND_CIRCUIT');
      for (const it of cond) assert.ok((d.toggle_items || []).some(x => x.slot_id === it.slot_id && x.toggle && x.removable), `${d.weekday} ${it.slot_id}`);
    }
    assert.ok(md('05').includes('Kettlebell Swing (Russian) (jumps, throws and speed)'));
  });

  // ------------------------------------------------------------------------------------------------ the last week's MYO set
  test('R01-myo-not-in-superset: the last week\'s MYO set goes to the day\'s last eligible exercise that runs outside a superset pair (the swimmer\'s Friday leg curl, not the leg extension paired with the pulldown) (E-158, VOL-15)', () => {
    const p = plan('01'), w = stairWeeks(p).slice(-1)[0];
    const fri = w.days.find(d => d.weekday === 'Fri').blocks.flatMap(b => b.items);
    const myo = fri.filter(it => it.effort && it.effort.last_set === 'myo');
    assert.equal(myo.length, 1);
    assert.equal(myo[0].superset, null, myo[0].exercise_id);
    assert.equal(myo[0].bucket, 'ISO_LEG_FLEXION', myo[0].exercise_id);
    // (V12 / V17 read the same rule: an exercise running inside a pair is never 'the last eligible one')
    for (const n of ALL) passes(plan(n), ['V12', 'V17']);
  });
  test('R08-r3-pending-derived: an approved round-3 answer is pending neither in meta.r3_pending nor in meta.derived.r3_pending (E-157)', () => {
    for (const n of ALL) { const p = plan(n); assert.deepEqual(p.meta.r3_pending, [], n); assert.deepEqual(p.meta.derived.r3_pending.filter(id => R.r3_approved.includes(id)), [], n); }
  });

  // ------------------------------------------------------------------------------------------------ the random sweep (fixture)
  test('R2F1-sweep-random-481-circuit-lone-stations: a circuit day a donor swap touched never keeps a group on one lone station (it left one chest and one shoulder station on Thursday) (E-150, R3-SES-01; fixture)', () => {
    for (const i of [481, 531, 581]) {
      const p = generate(randomIntake(i, fixture), fixture);
      assert.equal(p.status, 'ok', `random ${i}`);
      passes(p, ['V23', 'H18']);
    }
  });
  test('R2F1-sweep-random-609-lone-station-outside-the-stairway: a maintenance circuit day and a recovery week never keep a group on one lone station (a bench dip alone; a curl brought back at one round) (E-150; fixture)', () => {
    for (const i of [609, 659, 1114, 1434]) {
      const p = generate(randomIntake(i, fixture), fixture);
      assert.equal(p.status, 'ok', `random ${i}`);
      passes(p, ['V23', 'H18']);
    }
    // the recovery week holds the stations of the stairway before it (fewer rounds), never a station the time check took out
    const p = generate(randomIntake(659, fixture), fixture);
    const rec = p.weeks.find(w => w.block_type === 'recovery'), before = p.weeks.find(w => w.n === rec.n - 1);
    const ids = (w) => new Set(w.days.flatMap(d => d.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items.filter(it => it.sets > 0).map(it => it.slot_id))));
    for (const id of ids(rec)) assert.ok(ids(before).has(id), id);
  });
  test('R2F1-sweep-sport-rugby-last-weeks-climb: a line that ran ahead with a 2-set entry is not counted as next week\'s step - the last real step is not pulled early, and H21 total_hold allows for a 2-set entry at an exercise-block start (E-146 / E-136)', () => {
    const k = model.profiles.picker.sports.findIndex(x => x.id === 'rugby');
    const p = generate(sportIntake(k, model), model);
    assert.equal(p.status, 'ok');
    passes(p, ['H21']);
    const tm = stairWeeks(p, 1).map(w => w.total_main_sets);
    assert.ok(tm[tm.length - 2] > tm[tm.length - 3] || tm[tm.length - 1] > tm[tm.length - 2], tm.join(' '));
  });
  test('R2F1-sweep-random-518-entry-below-the-ceiling: a 2-set exercise that opens at an exercise-block start before the last one leaves the line\'s final set for later (the hamstrings reached their ceiling in week 5 of 12 and held) (E-146; fixture)', () => {
    const p = generate(randomIntake(518, fixture), fixture);
    assert.equal(p.status, 'ok');
    passes(p, ['H21']);
  });
  test('R2F1-sweep-random-286-final-steps-together: H21 total_hold allows for the groups\' final steps sharing the last week (three one- or two-set climbs on a 3 x 75 class plan) (E-136; fixture)', () => {
    for (const i of [286, 32]) { const p = generate(randomIntake(i, fixture), fixture); assert.equal(p.status, 'ok', `random ${i}`); passes(p, ['H21']); }
  });

  // ------------------------------------------------------------------------------------------------ copy and dates
  test('R07-test-dates: the printed test dates are the days that hold a test item (week 1 and the end-test week), never the retired reminder dates (E-147, R2-PER-07, R3-VOL-02)', () => {
    for (const n of ALL) {
      const p = plan(n), tdays = p.meta.tests.test_days || [];
      assert.ok(!('reminders' in p.meta.tests), n);
      for (const t of tdays) {
        const w = p.weeks.find(x => x.n === t.week), d = w.days.find(x => x.weekday === t.weekday);
        assert.ok(d.blocks.some(b => b.items.some(it => it.test && t.tests.includes(it.test.test))), `${n} ${t.date}`);
      }
      // (fix round 2 / F3, E-198: the line prints each test day with its weekday and the date in words - 'Monday 12 Oct 2026')
      const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const line = md(n, p.lang).split('\n').find(l => l.startsWith(model.t(p.lang, 'ui.plan.test_days', { list: '' }).split(':')[0])) || '';
      if (tdays.length) assert.ok(line, n);
      if (p.lang === 'en') for (const t of tdays) { const [y, m, d] = t.date.split('-').map(Number); assert.ok(line.includes(model.t('en', 'weekday.' + t.weekday) + ' ' + d + ' ' + MON[m - 1] + ' ' + y), `${n} ${t.date}: ${line}`); }
    }
    assert.deepEqual(plan('07').meta.tests.test_dates, ['2026-10-12', '2026-10-14', '2026-10-17', '2026-12-28', '2026-12-30', '2027-01-02']);
  });
});
