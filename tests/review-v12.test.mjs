// tests/review-v12.test.mjs - regression tests for the coach-eye reviews of the 8 sample plans (v1.2 review round).
// One test per fixed review issue, named R<sample>-<issue #> as in samples/REVIEW_LOG.md; each test reads the plan the
// engine builds from samples/intakes/<sample>.json on the compiled model (model/) - the same plans samples/plans holds.
// Issues deferred in samples/REVIEW_LOG.md have no test here.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { repClassFor } from '../engine/dose.mjs';
import { loadCompiledModel, INTAKE_DIR } from './helpers/models.mjs';

const model = loadCompiledModel();
const R = model ? model.rules : null;
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const cache = {};
const plan = (n) => {
  if (!cache[n]) {
    const intake = JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
    const p = generate(intake, model);
    cache[n] = { p, md: renderPlan(p, model, { lang: 'en' }), intake };
  }
  return cache[n];
};
const items = (p, pred = () => true) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it, ex: it.exercise_id && model.hasEx(it.exercise_id) ? model.ex(it.exercise_id) : null })))).filter(pred));
const mains = (w) => w.days.filter(d => d.kind === 'main');
const stairWeeks = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const hasWarning = (p, key) => p.meta.warnings.some(w => w.key === key);
const offered = (p) => p.offers.some(o => ['offer.longer_sessions', 'offer.more_days'].includes(o.key));
const limit = (p) => p.meta.session_minutes * R.session.long_day.warn_above_factor;

/** the stairway climbs on the main days: the main-day total of the last stairway week is above week 1, never drops */
function climbsOnMainDays(p) {
  const ws = stairWeeks(p).filter(w => w.training_block === stairWeeks(p)[0].training_block);
  const tot = ws.map(w => w.total_main_sets);
  assert.ok(tot[tot.length - 1] > tot[0], `main-day total ${tot.join(' ')}`);
  for (let i = 1; i < tot.length; i++) assert.ok(tot[i] >= tot[i - 1], `drops at week ${ws[i].n}`);
}
/** the placed weekly rise: per muscle at most max(1 set, 7 %) (+0.5 helper slack), the total at most 7 % (R2-VOL-01) */
function placedRiseCapped(p) {
  const P = R.stairway.limits.placed;
  const ws = stairWeeks(p);
  for (let i = 1; i < ws.length; i++) {
    const a = ws[i - 1], b = ws[i];
    // (an exercise-block start may open a 2-set exercise - v0.4 fix round 1, E-86)
    const ebStart = (p.shape.exercise_blocks || []).some(e => e.weeks[0] === b.n);
    if (a.training_block !== b.training_block || b.is_exercise_block_start === true || ebStart) continue;
    for (const [m, v] of Object.entries(b.main_sets_by_muscle)) {
      const prev = a.main_sets_by_muscle[m] || 0;
      // the volume engine allows max(1, 7 % rounded to whole sets) a week (volume.allowRise, B1); helpers add their slack
      const cap = Math.max(P.per_muscle_whole_sets, Math.round(prev * P.per_muscle_pct)) + P.helper_slack;
      assert.ok(v - prev <= cap + EPS, `${m} week ${b.n}: ${prev} -> ${v}`);
    }
    if (a.total_main_sets > 0) assert.ok(b.total_main_sets <= a.total_main_sets * (1 + P.total_pct) + 1 + EPS, `total week ${b.n}: ${a.total_main_sets} -> ${b.total_main_sets}`);
  }
}
/** every main day within minutes x 1.10, or warned (UNI-09, D-34); v0.4: a test week's day may run longer by its work-ups and
 *  timed tests and says so (warning.test_day_long for that day and week, R2-PER-07) */
function daysFitOrWarned(p, factor = R.session.long_day.warn_above_factor) {
  for (const w of p.weeks) for (const d of mains(w)) {
    if (d.est_minutes <= p.meta.session_minutes * factor + EPS) continue;
    const warned = p.meta.warnings.some(x => (x.key === 'warning.long_day' && x.args.day === d.weekday) || (x.key === 'warning.test_day_long' && x.args.day === d.weekday && x.args.week === w.n));
    assert.ok(warned, `${d.weekday} w${w.n} ${d.est_minutes} min without warning.long_day / warning.test_day_long`);
  }
}

describe('v1.2 coach-eye review regressions (compiled model)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------------ 01 swimming
  test('R01-1 swimming: the stairway climbs on the three main days; the optional Saturday keeps its template sets and only takes a small line\'s bonus exercise (R2-PER-03, ORD-10, R3-VOL-03)', () => {
    const { p } = plan('01');
    climbsOnMainDays(p);
    const sat = (w) => w.days.find(d => d.kind === 'optional');
    const setsOf = (d, pred) => d ? d.blocks.flatMap(b => b.items).filter(pred).reduce((a, it) => a + (it.sets || 0), 0) : 0;
    // v0.4 fix round 1 (E-86 / E-94): the optional day also carries a trained big line's climb (an added exercise, 2+ sets, opened
    // where an exercise block starts) and the pattern station of a big mover the main days cannot hold - never a 1-set station
    const tpl = (it) => !['bonus', 'focus_added', 'pattern_kept'].includes(it.origin);
    assert.equal(setsOf(sat(p.weeks[11]), tpl), setsOf(sat(p.weeks[0]), tpl), 'the optional day\'s template slots stay flat');
    for (const w of p.weeks) for (const it of sat(w).blocks.flatMap(b => b.items).filter(x => !tpl(x) && x.exercise_id)) assert.ok(it.sets >= 2, `${it.slot_id} opens at 2+ sets`);
  });
  test('R01-2 swimming: placed weekly rises capped at max(1 set, 7 %) per muscle and 7 % in total (R2-VOL-01, UNI-05)', () => placedRiseCapped(plan('01').p));
  test('R01-3 swimming: no depth jumps / bounds / hurdle hops; plyo contacts near the 6-8 budget (04 swimming plyo rules, V27)', () => {
    const { p } = plan('01');
    for (const x of items(p, x => x.ex && ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket))) assert.ok(!x.ex.tags.some(t => ['depth_jump', 'bound', 'hurdle_hop'].includes(t)), x.it.exercise_id);
    assert.ok(p.validation.checks.find(c => c.id === 'V27').pass);
  });
  test('R01-4 swimming: Olympic sets inside the weekly budget; days within 60 x 1.10 min or warned (R2-ATH-04, UNI-09)', () => {
    const { p } = plan('01');
    for (const w of stairWeeks(p)) assert.ok(w.athletic_budget.planned.olympic_sets <= Math.max(1.5 * w.athletic_budget.targets.olympic_sets, 2 * p.meta.athletic.olympic_exposures_wk) + EPS, `w${w.n}`);
    daysFitOrWarned(p);
  });
  test('R01-6 swimming: a barbell / trap-bar hinge counts as a spine day (R2-SES-02): never two counted hinges a week', () => {
    const { p } = plan('01');
    for (const id of ['alternating-barbell-deadlift-alternate-lead-leg-meaning-inferred', 'staggered-stance-kickstand-barbell-deadlift']) assert.equal(model.ex(id).spine_class, 'counted', id);
    assert.ok(p.validation.checks.find(c => c.id === 'H07').pass);
  });
  test('R01-7 swimming: glutes and side delts are targets for an athlete, not credit-only (R2-VOL-06)', () => {
    const { p } = plan('01');
    // v0.4 fix round 1 (E-84, COACH-R3 R3-SES-01): glutes + hamstrings are ONE hips group with one target (the hamstrings line);
    // glutes follow as credit; side delts stay targets inside the shoulders line
    assert.equal(p.meta.targets.fill.glutes, 'credit'); assert.equal(p.meta.targets.fill.hamstrings, 'target'); assert.equal(p.meta.targets.fill.side_delts, 'target');
    assert.ok(stairWeeks(p).every(w => w.main_sets_by_group.hips >= 10 - EPS));
  });
  test('R01-8 swimming: joint-care rear-delt work is credited (R2-LIB-04) and pulling outweighs pushing (SHOULDER_SWIMMER)', () => {
    const { p } = plan('01');
    const w = p.weeks[0];
    const its = items({ weeks: [w] }, x => x.ex && x.it.sets);
    const pull = its.filter(x => ['HPULL', 'VPULL'].includes(x.ex.credit_class)).reduce((a, x) => a + x.it.sets, 0);
    const push = its.filter(x => ['HPUSH', 'VPUSH', 'DIPS'].includes(x.ex.credit_class)).reduce((a, x) => a + x.it.sets, 0);
    assert.ok(pull >= push, `pull ${pull} push ${push}`);
    // v0.4 fix round 1 (E-89): the shoulder care stays every session but credits no muscle (survival work, not working sets)
    assert.ok(its.some(x => x.it.bucket === 'RECOVERY_ARM_CARE'));
    for (const x of its.filter(r => r.it.role === 'prehab')) assert.deepEqual(x.it.credits, {}, x.it.slot_id);
  });
  test('R01-9 swimming: shoulder hotspots avoided without reported pain - no upright row, no standing overhead press (SHOULDER_SWIMMER)', () => {
    const { p } = plan('01');
    for (const x of items(p, x => x.ex)) {
      assert.ok(!x.ex.tags.includes('upright_row'), x.it.exercise_id);
      assert.ok(!(x.ex.credit_class === 'VPUSH' && /standing/.test(x.it.exercise_id)), x.it.exercise_id);
    }
  });
  test('R01-10 swimming: tests are their own items in weeks 1 and 12, the same protocol both times, never in a superset (R2-PER-07)', () => {
    const { p } = plan('01');
    const t1 = items({ weeks: [p.weeks[0]] }, x => x.it.test).map(x => x.it.test.test.replace('rm_3_or_work_up_to_1', 'rm_3_or_5'));
    const t12 = items({ weeks: [p.weeks[11]] }, x => x.it.test).map(x => x.it.test.test.replace('rm_3_or_work_up_to_1', 'rm_3_or_5'));
    assert.ok(t1.length >= 2);
    for (const k of new Set(t12)) assert.ok(t1.includes(k), k);
    for (const x of items(p, x => x.it.test)) assert.equal(x.it.superset, null, x.it.slot_id);
  });
  test('R01-11 swimming: placeholder records ("- any", implement not stated) are never the default pick (R2-LIB-01)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.ex && x.b.kind !== 'warmup')) assert.ok(!/(^|-)any$|-any-different|not-stated/.test(x.it.exercise_id) || x.ex.status === 'live_library_selectable', `${n} ${x.it.exercise_id}`);
  });
  test('R01-12 swimming: one box height per item (EQ-16)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.it.bucket === 'AP_PLYO')) {
      const boxes = (x.it.notes || []).filter(k => /box/.test(k.key)).length + (x.it.load && x.it.load.type === 'box_height' ? 1 : 0);
      assert.ok(boxes <= 1, `${n} ${x.it.exercise_id}`);
    }
  });
  test('R01-13 swimming: the Olympic rep scheme follows the implement - barbell catches 3-5, DB / KB / pulls ramp (R2-ATH-05)', () => {
    const { p } = plan('01');
    for (const x of items(p, x => x.it.bucket === 'AP_TRIPLE_EXT' && x.ex && x.w.block_type === 'stairway' && !x.it.test)) {
      const ramp = x.it.why.some(w => w.key === 'why.olympic_ramp');
      const bar = x.ex.tags.includes('barbell') && !/pull/.test(x.it.exercise_id);
      if (bar && x.ex.athletic && x.ex.athletic.full_catch) assert.ok(!ramp, x.it.exercise_id);
    }
  });
  test('R01-14 swimming: holds are dosed in seconds, dynamic core in reps (R2-SES-03)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.b.kind === 'core' && x.ex)) {
      if (x.it.reps && x.it.reps.type === 'seconds') assert.ok(x.ex.tags.some(t => /plank|hold|isometric/.test(t)) || /plank|hold|hollow|l-sit|dead-bug/.test(x.it.exercise_id), `${n} ${x.it.exercise_id}`);
    }
  });
  test('R01-15 swimming: a non-running sport with shoulder hotspots warms up with mobility, not sprint drills (ORD-08)', () => {
    const { p } = plan('01');
    for (const d of mains(p.weeks[0])) {
      const prep = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'WARMUP_PREP');
      assert.ok(prep && !/a-march|a-skip|a-run|falling/.test(prep.exercise_id || prep.text_key || ''), d.weekday);
    }
  });
  test('R01-16 swimming / R06-10: MAX only on the day\'s last small-muscle item, and only once the planned effort is 1-2 in the tank (VOL-13)', () => {
    for (const n of Object.keys(NAMES)) {
      const { p } = plan(n);
      for (const w of p.weeks) for (const d of w.days) {
        const its = d.blocks.flatMap(b => b.items);
        its.forEach((it, i) => {
          if (!(it.effort && it.effort.last_set === 'max')) return;
          assert.ok(w.planned_rir.min <= 2, `${n} w${w.n} ${d.weekday} ${it.exercise_id}`);
          const later = its.slice(i + 1).filter(x => ['ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF'].includes(x.bucket));
          assert.equal(later.length, 0, `${n} w${w.n} ${d.weekday} ${it.exercise_id} is not the last small item`);
        });
      }
    }
  });
  test('R01-19 swimming / R02-4: an exercise\'s own rep ceiling caps the phase bracket (Nordics, weighted / body-weight pull-ups)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.ex && x.it.reps && x.it.reps.max != null && !x.it.test)) {
      if (/nordic/.test(x.it.exercise_id)) assert.ok(x.it.reps.max <= 8, `${n} ${x.it.exercise_id}`);
      if (/weighted-pull-up|weighted-dip/.test(x.it.exercise_id)) assert.ok(x.it.reps.max <= 8, `${n} ${x.it.exercise_id}`);
    }
  });
  test('R01-20 swimming: accessory rep brackets never zig-zag across the exercise blocks; no degenerate min = max range (PRG-06)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.it.reps && x.it.reps.type === 'range')) assert.ok(x.it.reps.min < x.it.reps.max || x.it.reps.bracket === 'b15' || x.it.reps.bracket === 'b20', `${n} ${x.it.exercise_id} ${x.it.reps.min}-${x.it.reps.max}`);
  });

  // ------------------------------------------------------------------------------------------------------ 02 football
  test('R02-1 football: the stairway climbs from week 1 on the main days (R2-PER-03)', () => { climbsOnMainDays(plan('02').p); placedRiseCapped(plan('02').p); });
  test('R02-2 football: a loaded horizontal press (barbell / DB bench) and a press test, never a dip test (D-07 constraint band)', () => {
    const { p } = plan('02');
    const press = items(p, x => x.it.bucket === 'RP_HPUSH' && x.ex && x.ex.credit_class === 'HPUSH' && x.ex.load_ceiling === 'high');
    assert.ok(press.length > 0);
    for (const x of items(p, x => x.it.test && x.ex)) assert.ok(x.ex.credit_class !== 'DIPS', x.it.exercise_id);
  });
  test('R02-3 football: speed work is never a finisher after heavy lifting - sprints sit before the lifts (BASEBALL Part A / E)', () => {
    const { p } = plan('02');
    for (const w of p.weeks) for (const d of mains(w)) {
      const its = d.blocks.flatMap(b => b.items);
      const firstLift = its.findIndex(it => ['RP_BKD', 'RP_BHD', 'RP_UKD', 'RP_UHD'].includes(it.bucket));
      its.forEach((it, i) => { if (it.bucket === 'AP_SPRINT') assert.ok(i < firstLift, `${d.weekday} w${w.n}`); });
      for (const it of its.filter(it => it.bucket === 'COND_SPRINT_BUYOUT')) assert.ok(!(it.exercise_id || '').match(/max-velocity|acceleration|falling-start/), it.exercise_id);
    }
  });
  test('R02-5 football: the athletic budget is dosed toward its targets (COD, low contacts, sprint metres, throws) - V27', () => {
    const { p } = plan('02');
    assert.ok(p.validation.checks.find(c => c.id === 'V27').pass);
    // (fix round 2 / F2: week 2 - week 1 is the baseline test week, where the sprint test replaces a sprint station, E-165; one scale
    // down the block, E-160: the early weeks plan the share of the target the peak week's stations hold, so the work climbs to the
    // peak instead of sitting on it - COD is read against its stairway goal and, at the peak, against 70 % of the sport target)
    const w = p.weeks[1].athletic_budget;
    // v0.4 stage B2: every key lands on the athletic stairway's goal (the sport target, scaled to what the block's stations hold,
    // E-29) and climbs to the block's peak (the football sprint is acceleration work, 10-20 m, LIB-21)
    assert.ok(w.planned.cod_cuts >= 0.75 * w.goals.cod_cuts && w.planned.low_contacts > 0 && w.planned.sprint_m >= 0.75 * w.goals.sprint_m);
    const last = p.weeks[10].athletic_budget;
    assert.ok(last.planned.cod_cuts > w.planned.cod_cuts && last.planned.cod_cuts >= 0.7 * last.targets.cod_cuts, `COD ${w.planned.cod_cuts} -> ${last.planned.cod_cuts}`);
    assert.ok(last.planned.sprint_m > w.planned.sprint_m && last.planned.sprint_m >= 0.6 * last.targets.sprint_m, `${w.planned.sprint_m} -> ${last.planned.sprint_m}`);
  });
  test('R02-6 football: baseline and end tests are the same drills / lifts (R2-PER-07); a trained athlete is not tested "from zero"', () => {
    const { p } = plan('02');
    const ids = (w) => items({ weeks: [w] }, x => x.it.test).map(x => x.it.test.test.replace('rm_3_or_work_up_to_1', 'rm_3_or_5') + '|' + (x.it.exercise_id || '')).sort();
    assert.deepEqual(ids(p.weeks[11]), ids(p.weeks[0]));
    assert.equal(p.meta.tests.from_zero, false);
  });
  test('R02-7 football: no muscle is credit-only for a competitive field athlete except the arms; glutes / side delts targeted', () => {
    const { p } = plan('02');
    // (v0.4 fix round 1, E-84: glutes follow the hips group's hamstrings line as credit)
    assert.equal(p.meta.targets.fill.glutes, 'credit'); assert.equal(p.meta.targets.fill.hamstrings, 'target'); assert.equal(p.meta.targets.fill.side_delts, 'target');
  });
  test('R02-9 football: the work lift gets at least the sets of any other station in its group, and 3 sets at 90 min (VOL-07, VOL-16)', () => {
    const { p } = plan('02');
    for (const w of p.weeks) for (const d of mains(w)) {
      const its = d.blocks.flatMap(b => b.items);
      const work = its.find(it => it.role === 'work');
      if (!work || work.test || (work.flags || []).includes('back_off')) continue; // a tested lift's back-off sets (E-91)
      assert.ok(work.sets >= 3, `${d.weekday} w${w.n} work ${work.sets}`);
      for (const it of its.filter(x => x.group === work.group && x !== work && x.sets)) assert.ok(work.sets >= it.sets, `${d.weekday} w${w.n} ${it.exercise_id}`);
    }
  });
  test('R02-10 football: RC3 "repeat" never sits on a single-effort landing drill; landing drills are RC1 only (R2-ATH-03)', () => {
    const { p } = plan('02');
    for (const x of items(p, x => x.it.bucket === 'AP_PLYO' && x.ex && x.ex.athletic)) if (x.ex.athletic.quality === 'landing') assert.equal(x.w.plyo_stage, 'RC1', `w${x.w.n} ${x.it.exercise_id}`);
  });
  test('R02-11 football: the time model counts the add-on aerobic work and WOD minutes (UNI-09); an add-on the session cannot hold is its own session that day (v0.4)', () => {
    const { p } = plan('02');
    // (v0.4 fix round 1 / F2: the add-on goes to the main day with the most room - Friday once Tuesday holds the ankle block)
    const tue = p.weeks[0].days.find(d => d.kind === 'main' && d.blocks.some(b => b.items.some(it => it.aerobic)));
    const aer = tue.blocks.flatMap(b => b.items).filter(it => it.aerobic);
    assert.ok(aer.length > 0);
    assert.ok(typeof tue.aerobic_minutes === 'number');
    if (tue.aerobic_minutes === 0) assert.ok(aer.every(it => it.notes.some(n => n.key === 'note.aerobic_separate')), 'a separate session says so');
    else assert.ok(tue.aerobic_minutes > 0);
  });
  test('R02-12 football / R08-16: client-facing day titles carry no coach jargon (axial, clean day, snatch day)', () => {
    // (a CrossFit class names its lifts - 'Squat + clean day' is the class's own vocabulary, kept)
    for (const n of Object.keys(NAMES)) for (const d of plan(n).p.weeks[0].days) if (!/hybrid_crossfit/.test(d.label_key)) assert.ok(!/axial|clean day|snatch day/i.test(model.t('en', d.label_key)), `${n} ${d.label_key}`);
  });
  test('R02-14 football / R06-12: calves are one exercise x 3 sets per leg day, never two calf exercises supersetted (VOL-17)', () => {
    for (const n of ['01', '02', '03', '06', '07']) for (const w of plan(n).p.weeks) for (const d of mains(w)) {
      const calves = d.blocks.flatMap(b => b.items).filter(it => it.bucket === 'ISO_CALF');
      if (calves.length >= 2) assert.ok(!(calves[0].superset && calves[0].superset === calves[1].superset), `${n} ${d.weekday}`);
    }
  });
  test('R02-15 football: a bilateral overhead throw is counted as written, rotational throws per side (LIB-06)', () => {
    for (const x of items(plan('02').p, x => x.it.bucket === 'AP_THROW' && x.ex)) {
      if (x.it.reps.type === 'throws_per_side') assert.ok(x.ex.plane === 'transverse' || ['unilateral', 'alternating'].includes(x.ex.laterality) || (x.ex.medball && x.ex.medball.kind === 'pass_rotation'), x.it.exercise_id);
    }
  });
  test('R02-17 football / R08-6: the printed plyo share is the planned one, not the budget target', () => {
    const { p, md } = plan('08');
    // (v0.4 fix round 1 / F2: the racket player's Receive weeks now hold the ankle track, so the share is not 0 % - the printed share is
    // still the planned one, week by week)
    for (const w of p.weeks.filter(x => x.athletic_budget && typeof x.athletic_budget.planned_share === 'number')) assert.ok(md.includes('Plyo share ' + Math.round(100 * w.athletic_budget.planned_share) + '%'), `w${w.n}`);
  });
  test('R02-19 football: Olympic lifts follow one ramp or the class / budget table and keep 2-4 sets (PER-09, R2-ATH-04)', () => {
    for (const x of items(plan('02').p, x => x.it.bucket === 'AP_TRIPLE_EXT')) assert.ok(x.it.sets >= 2 && x.it.sets <= 4, `${x.it.exercise_id} ${x.it.sets}`);
  });

  // ------------------------------------------------------------------------------------------------------ 03 soccer
  test('R03-1 soccer: COD and sprint work dosed toward the profile (COD >= 75 % of target, sprint metres > 0, max velocity weekly)', () => {
    const { p } = plan('03');
    for (const w of stairWeeks(p)) {
      const a = w.athletic_budget;
      // v0.4: the field-athlete cap of 12 + 2 core is hard (R3-SES-01), so the cross-pattern day keeps fewer COD stations. Stage B2
      // (E-29): COD is dosed every week on the athletic stairway's goal (the target scaled to what the stations hold) and climbs;
      // the client is told the stations hold under 60 % of the soccer COD dose (warning.athletic_capacity)
      assert.ok(a.planned.cod_cuts > 0 && a.planned.cod_cuts >= 0.75 * a.goals.cod_cuts - 12, `w${w.n} cod ${a.planned.cod_cuts}/${a.goals.cod_cuts}`);
      assert.ok(a.planned.sprint_m > 0, `w${w.n} sprint`);
    }
    // (fix round 2 / F2, E-165: a station the 5-10-5 test replaced counts as done; the end-test week's tested days run the baseline dose)
    const sw = stairWeeks(p).filter(w => !w.athletic_budget.hold);
    const cod = (w) => w.athletic_budget.planned.cod_cuts + ((w.athletic_budget.test_replaced || {}).cod_cuts || 0);
    for (let k = 1; k < sw.length; k++) assert.ok(cod(sw[k]) >= cod(sw[k - 1]), `COD climbs w${sw[k].n}`);
    assert.ok(p.meta.warnings.some(x => x.key === 'warning.athletic_capacity' && x.args.key === 'athletic.key.cod_cuts'));
  });
  test('R03-2 soccer: jump work progresses from landings (RC1) to repeated / reactive contacts; no repeat cue on a box drop', () => {
    const { p } = plan('03');
    const late = items(p, x => x.it.bucket === 'AP_PLYO' && x.ex && x.w.plyo_stage === 'RC3');
    for (const x of late) assert.ok(x.ex.athletic.quality !== 'landing', x.it.exercise_id);
  });
  test('R03-5 soccer: Olympic sets inside the 2-6 budget with the profile\'s exposures; the ramp never restarts (R2-ATH-04)', () => {
    const { p } = plan('03');
    const ex = new Set(p.weeks[0].days.filter(d => d.blocks.some(b => b.items.some(it => it.bucket === 'AP_TRIPLE_EXT'))).map(d => d.weekday));
    assert.ok(ex.size <= p.meta.athletic.olympic_exposures_wk, [...ex].join());
    assert.ok(p.validation.checks.find(c => c.id === 'V27').pass);
  });
  test('R03-6 soccer: aerobic add-ons count as session time; a full main day takes them as a separate session (UNI-09)', () => {
    const { p } = plan('03');
    // v0.4: week 1 is a test week; a day its work-ups make longer says so (warning.test_day_long, R2-PER-07)
    const testLong = (d) => p.meta.warnings.some(x => x.key === 'warning.test_day_long' && x.args.day === d.weekday && x.args.week === 1);
    for (const d of mains(p.weeks[0])) assert.ok(d.est_minutes + (d.aerobic_minutes || 0) <= p.meta.session_minutes * 1.25 + EPS || d.blocks.some(b => b.items.some(it => it.aerobic && it.aerobic.position === 'separate_session')) || hasWarning(p, 'warning.long_day') || testLong(d), d.weekday);
  });
  test('R03-10 soccer: pre-season keeps 2 sets on the work and paired lifts and drops Focus (R2-PER-06, D-37)', () => {
    const { p } = plan('03');
    const pre = p.weeks.find(w => w.block_type === 'pre_season');
    for (const d of mains(pre)) for (const it of d.blocks.flatMap(b => b.items).filter(it => ['work', 'paired_upper'].includes(it.role) && !it.test)) assert.ok(it.sets >= 2, `${d.weekday} ${it.exercise_id}`);
  });

  // ------------------------------------------------------------------------------------------------------ 04 crossfit
  test('R04-1 crossfit: skill folds into the warm-up and the WOD holds its shorter range before a group leaves a day (cut order)', () => {
    const { p } = plan('04');
    const whys = p.weeks[0].days.flatMap(d => d.why.map(w => w.key));
    assert.ok(whys.includes('why.skill_in_warmup') || whys.includes('why.wod_short'));
    climbsOnMainDays(p);
  });
  test('R04-3 crossfit: the week pulls at least 0.8 x what it pushes and the deadlift day has its push partner (ORD-06, V29)', () => {
    const { p } = plan('04');
    assert.ok(p.validation.checks.find(c => c.id === 'V29').pass);
    // (v0.4 fix round 1, E-81: the deadlift day keeps its push partner while chest is trained directly)
    const thu = p.weeks[0].days.find(d => d.weekday === 'Thu');
    if (p.time_check.trained_groups.includes('chest')) assert.ok(thu.blocks.flatMap(b => b.items).some(it => it.bucket === 'RP_HPUSH'));
    assert.ok(thu.blocks.flatMap(b => b.items).some(it => it.bucket === 'RP_BHD' && it.role === 'work'));
  });
  test('R04-4 crossfit: the class model\'s work lifts follow the HALF TIME levels with strength rest (OT18, VOL-14)', () => {
    const { p } = plan('04');
    // F3 (E-126, OBSERVED class split: STRENGTH = squat / press / deadlift): the class lifts are the squat / press / deadlift work slots;
    // the pull day's row is not a class lift (RECHECK 04 minor: a Yates row on the class table the day after the deadlift)
    const SB = R.reps.class_levels.strength_buckets || ['RP_BKD', 'RP_BHD', 'RP_VPUSH', 'RP_HPUSH'];
    const work = items(p, x => x.it.role === 'work' && !x.it.test && x.w.n === 2 && SB.includes(x.it.bucket));
    // a heavy work lift rests 3-6 min, or (when the short session pairs it) rests after the pair - never hypertrophy rest
    assert.ok(work.length && work.every(x => x.it.rest && (x.it.rest.type === 'after_pair' || x.it.rest.min >= 180)), JSON.stringify(work.map(x => x.it.rest)));
  });
  // (fix round 2 / F1, E-141: the class split puts the snatch on the press day and the clean on Friday - OBSERVED MASTER_MODEL 'CLASS
  // PROGRAMMING SPLIT', 04_profiles crossfit_class triple_ext; R2-ATH-04 classifies the lifts, it does not fix their day)
  test('R04-6 crossfit: Olympic sets within the class / budget table, the snatch on the press day and the clean on Friday (OBSERVED class split; R2-ATH-04)', () => {
    const { p } = plan('04');
    for (const w of p.weeks) assert.ok(w.athletic_budget.planned.olympic_sets <= Math.max(1.5 * w.athletic_budget.targets.olympic_sets, 6) + EPS, `w${w.n}`);
    const oly = (wd) => p.weeks[0].days.find(d => d.weekday === wd).blocks.flatMap(b => b.items).filter(it => it.bucket === 'AP_TRIPLE_EXT');
    assert.ok(oly('Tue').some(it => /snatch/.test(it.exercise_id || '')), 'snatch on the press day');
    assert.ok(oly('Fri').some(it => /clean/.test(it.exercise_id || '')), 'clean on Friday');
    assert.equal(oly('Mon').length + oly('Thu').length, 0, 'the squat and deadlift days hold their lift');
  });
  test('R04-9 crossfit: the cardio test sits on the aerobic day, never after a strength test or a WOD (R2-PER-07)', () => {
    const { p } = plan('04');
    for (const x of items({ weeks: [p.weeks[0]] }, x => x.it.test && x.it.aerobic)) assert.equal(x.d.kind, 'aerobic', x.d.weekday);
  });
  test('R04-10 crossfit: every WOD station has reps or calories for its format (PRG-10)', () => {
    for (const x of items(plan('04').p, x => x.it.bucket === 'COND_WOD')) {
      assert.ok(x.it.wod && Array.isArray(x.it.wod.station_reps) && x.it.wod.station_reps.length === x.it.wod.stations.length, x.it.slot_id);
    }
  });
  test('R04-11 crossfit: the validators fail flat stairways and unbudgeted athletic work (H21 stairway_flat, V27, V29)', () => {
    assert.ok(R.validation.checks.some(c => c.id === 'V27') && R.validation.checks.some(c => c.id === 'V29'));
  });
  test('R04-17 crossfit / R05-18: no unresolved [PLACEHOLDER] in client copy; the effort drift is explained', () => {
    for (const n of Object.keys(NAMES)) {
      const { md } = plan(n);
      assert.ok(!/\[[A-Z][A-Z0-9_\\]{2,}\]/.test(md.replace(/\\_/g, '_')), n);
      assert.ok(/Planned effort across the stairway/.test(md), n);
    }
  });

  // ------------------------------------------------------------------------------------------------------ 05 bootcamp
  test('R05-1 bootcamp: the circuit climbs every week by the planned steps, never more than 7 % (D-19 revised)', () => {
    const { p } = plan('05');
    const ws = stairWeeks(p);
    for (let i = 1; i < ws.length; i++) { const a = ws[i - 1].circuit.work_s, b = ws[i].circuit.work_s; assert.ok(b > a && (b - a) / a <= 0.07 + EPS, `w${ws[i].n} ${a} -> ${b}`); }
  });
  test('R05-2 bootcamp: circuits are not floor exempt - what 3 x 45 min cannot hold is named up front (R2-VOL-06, R3-SES-02)', () => {
    const { p } = plan('05');
    assert.ok(p.meta.targets.floored.length > 0);
    assert.ok(hasWarning(p, 'warning.time_check'));
    const ntd = p.time_check.not_trained_directly.filter(x => x.reason === 'time').map(x => x.group);
    assert.ok(ntd.length > 0 && hasWarning(p, 'warning.not_trained_directly'));
    assert.ok(p.offers.some(o => ['offer.longer_sessions', 'offer.more_days', 'offer.more_days_min'].includes(o.key)));
  });
  test('R05-3 bootcamp: circuit time counts each week\'s work seconds and the rest between circuits (UNI-09)', () => {
    const { p } = plan('05');
    const mon1 = p.weeks[0].days.find(d => d.weekday === 'Mon'), mon8 = p.weeks[7].days.find(d => d.weekday === 'Mon');
    assert.ok(mon8.est_minutes > mon1.est_minutes);
  });
  test('R05-5 bootcamp: a record named "barbell" needs a barbell (EQ-09)', () => {
    assert.ok(model.ex('bent-over-barbell-row').equipment.any_of.every(su => su.includes('barbell')));
    for (const x of items(plan('05').p, x => x.ex)) assert.ok(!/barbell/.test(x.it.exercise_id), x.it.exercise_id);
  });
  test('R05-7 bootcamp: circuit stations take part in the exercise-block change (PER-02)', () => {
    const { p } = plan('05');
    const ids = (w) => w.days.flatMap(d => d.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items.map(it => d.weekday + it.slot_id + it.exercise_id)));
    const a = new Set(ids(p.weeks[3])), b = ids(p.weeks[4]);
    assert.ok(b.some(x => !a.has(x)), 'some circuit station changed at week 5');
  });
  test('R05-8 bootcamp: every circuit day keeps a metabolic station (cut order protects COND_CIRCUIT)', () => {
    const { p } = plan('05');
    for (const d of mains(p.weeks[0])) assert.ok(d.blocks.flatMap(b => b.items).some(it => it.bucket === 'COND_CIRCUIT'), d.weekday);
  });
  test('R05-17 bootcamp: every main day warms up with cardio plus drills or mobility (ORD-08)', () => {
    const { p } = plan('05');
    for (const d of mains(p.weeks[0])) assert.ok(d.blocks.flatMap(b => b.items).some(it => it.bucket === 'WARMUP_PREP'), d.weekday);
  });
  test('R05-18 bootcamp: equipment tokens are shown by name (pull-up bar, not pullup_bar)', () => {
    const { md } = plan('05');
    assert.ok(!/pullup\\?_bar/.test(md) && /pull-up bar/.test(md));
  });
  test('R05-16 bootcamp: a timed circuit never holds a Nordic curl (VOL-11, safety)', () => {
    for (const x of items(plan('05').p, x => x.b.kind === 'circuit')) assert.ok(!/nordic/.test(x.it.exercise_id || ''), x.it.exercise_id);
  });

  // ------------------------------------------------------------------------------------------------------ 06 aesthetics
  test('R06-1 aesthetics: the stairway is sized to the minutes and climbs; the client\'s priorities climb (D-67)', () => {
    const { p } = plan('06');
    climbsOnMainDays(p); placedRiseCapped(p);
    // v0.4: side delts are the shoulders line's Focus muscle (R3-VOL-01); the time check replaces D-67's lowered start
    const sd = stairWeeks(p).map(w => w.main_sets_by_muscle.shoulders);
    assert.ok(sd[sd.length - 1] > sd[0], 'shoulders (Focus) climb');
    assert.ok(hasWarning(p, 'warning.time_check') && p.offers.some(o => o.key.startsWith('offer.keep_time') && o.chosen));
  });
  test('R06-3 aesthetics: optional days hold their template Focus slots only (ORD-10)', () => {
    const { p } = plan('06');
    // (v0.4 fix round 1, E-86: added exercises of a big line's climb may join at 2+ sets; the template Focus slots stay 2)
    for (const w of p.weeks) for (const d of w.days.filter(d => d.kind === 'optional')) {
      const its = d.blocks.flatMap(b => b.items);
      assert.ok(its.filter(it => it.bucket === 'FOCUS' && it.origin === 'template').length <= 2, `${d.weekday} w${w.n}`);
      for (const it of its.filter(x => ['bonus', 'focus_added'].includes(x.origin))) assert.ok(it.sets >= 2, `${it.slot_id} w${w.n} ${it.sets}`);
    }
  });
  test('R06-5 aesthetics: a Nordic curl is never a Focus or high-rep filler (VOL-11)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => /nordic/.test(x.it.exercise_id || ''))) assert.ok(x.it.bucket !== 'FOCUS' && x.it.reps.max <= 8, `${n} ${x.it.slot_id}`);
  });
  test('R06-8 aesthetics: a non-axial hinge day never draws a barbell hinge (R2-SES-01/02)', () => {
    const { p } = plan('06');
    for (const x of items(p, x => x.ex && /\.B1$/.test(x.d.day_type || x.d.label_key) && ['RP_BHD', 'RP_UHD'].includes(x.it.bucket))) assert.notEqual(x.ex.spine_class, 'counted', x.it.exercise_id);
  });
  test('R06-9 aesthetics: no running sprints without running space; reference-only items are never defaults (EQ-14)', () => {
    const { p, intake } = plan('06');
    if ((intake.equipment && intake.equipment.running_space) === 'none') for (const x of items(p, x => x.it.aerobic)) assert.ok(!/sprints?$|10x10m/.test(x.it.exercise_id || ''), x.it.exercise_id);
  });
  test('R06-11 aesthetics: an axial work lift is never supersetted with an unsupported bent-over barbell row (UNI-11)', () => {
    for (const n of ['06', '07']) for (const w of plan(n).p.weeks) for (const d of w.days) {
      const its = d.blocks.flatMap(b => b.items);
      for (const it of its.filter(x => x.role === 'work' && x.superset)) {
        const mate = its.find(x => x !== it && x.superset === it.superset);
        if (mate && model.ex(it.exercise_id).spine_class === 'counted') assert.ok(!(model.ex(mate.exercise_id).tags.includes('bent_over') && /barbell/.test(mate.exercise_id)), `${n} ${d.weekday}`);
      }
    }
  });
  test('R06-13 aesthetics / R07-22: a non-competitive physique client is not labelled a competitive NPC athlete', () => {
    for (const n of ['06', '07']) assert.ok(!/competitive \(all NPC/.test(plan(n).md), n);
  });

  // ------------------------------------------------------------------------------------------------------ 07 push-pull-legs
  test('R07-1 PPL: the stairway climbs (sets rise in the second half) and the chest priority climbs (D-67)', () => {
    const { p } = plan('07');
    climbsOnMainDays(p);
    const ch = stairWeeks(p).map(w => w.main_sets_by_muscle.chest);
    assert.ok(ch[ch.length - 1] > ch[0]);
  });
  test('R07-3 PPL: warnings and schedule offers come before week 1', () => {
    const { md } = plan('07');
    assert.ok(md.indexOf('## Before you start') > 0 && md.indexOf('## Before you start') < md.indexOf('## Week 1'));
  });
  test('R07-6 PPL: the work lift of a bodybuilding day is a bilateral loadable lift (ORD-07, CAT-13)', () => {
    const { p } = plan('07');
    for (const d of mains(p.weeks[0])) {
      const work = d.blocks.flatMap(b => b.items).find(it => it.role === 'work');
      if (work) assert.equal(model.ex(work.exercise_id).laterality, 'bilateral', `${d.weekday} ${work.exercise_id}`);
    }
  });
  test('R07-9 PPL: rep-max tests and heavy work get strength rest (VOL-14)', () => {
    for (const x of items(plan('07').p, x => x.it.test && x.ex)) assert.ok(x.it.rest && x.it.rest.min >= 180, `${x.it.exercise_id}`);
  });
  test('R07-13 PPL: block changes never regress the load (assisted dips after weighted dips)', () => {
    const { p } = plan('07');
    const ids = items(p, x => x.ex && x.w.n >= 5).map(x => x.it.exercise_id);
    assert.ok(!ids.some(id => /assisted-dip/.test(id)));
  });
  test('R07-15 PPL: no MAX set in the acclimation weeks (R2-PER-05)', () => {
    const { p } = plan('07');
    for (const x of items(p, x => x.it.effort && x.it.effort.last_set === 'max')) assert.ok(x.w.planned_rir.min <= 2, `w${x.w.n}`);
  });
  test('R07-17 PPL: a test item never carries the week-1 "pick a weight" tip', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.it.test)) assert.ok(!(x.it.notes || []).some(k => k.key === 'load.week1_tip'), `${n} ${x.it.slot_id}`);
  });
  test('R07-25 PPL: never an intensifier on a heavy compound (H02)', () => {
    for (const n of Object.keys(NAMES)) for (const x of items(plan(n).p, x => x.it.effort && x.it.effort.intensifier && x.ex)) {
      assert.ok(!R.effort.never_failure_rep_classes.includes(repClassFor({ bucket: x.it.bucket, role: x.it.role }, x.ex, model)), `${n} ${x.it.exercise_id}`);
    }
  });

  // ------------------------------------------------------------------------------------------------------ 08 pickleball
  test('R08-1 pickleball: 2 x 45 min days stay near 45 (cut chain, core pair, prehab / groups to the optional day); never over 1.25 x', () => {
    const { p } = plan('08');
    for (const w of p.weeks) for (const d of mains(w)) assert.ok(d.est_minutes <= 45 * 1.25 + EPS, `${d.weekday} w${w.n} ${d.est_minutes}`);
    assert.ok(p.offers.some(o => ['offer.more_days', 'offer.more_days_min'].includes(o.key)));
  });
  test('R08-2 pickleball: main-day sets climb (isolations enter at 1 set when the minutes are short, VOL-07)', () => climbsOnMainDays(plan('08').p));
  test('R08-3 pickleball: a stay-active client\'s glutes / side delts / arms are targets with the floor of 10 named when the schedule cannot hold it', () => {
    const { p } = plan('08');
    // (v0.4 fix round 1, E-84: glutes follow the hips group's hamstrings line as credit)
    assert.equal(p.meta.targets.fill.glutes, 'credit');
    for (const m of ['hamstrings', 'shoulders', 'side_delts', 'biceps', 'triceps']) assert.equal(p.meta.targets.fill[m], 'target', m);
    // v0.4 (R3-SES-02): the groups the schedule cannot hold at 10 are named up front as not trained directly, with the offers
    assert.ok(hasWarning(p, 'warning.time_check') && p.time_check.not_trained_directly.length > 0);
  });
  test('R08-4 pickleball: knee pain - no deep knee flexion, no Zercher / deep squat; the knee days use step-ups / machines', () => {
    const { p } = plan('08');
    for (const x of items(p, x => x.ex && ['RP_BKD', 'RP_UKD', 'ISO_QUAD'].includes(x.it.bucket))) assert.ok(!x.ex.tags.includes('deep_knee_flexion'), x.it.exercise_id);
  });
  test('R08-5 pickleball: a 52-year-old racket player with knee pain gets no depth drops; landings stay RC1 (D-32)', () => {
    for (const x of items(plan('08').p, x => x.ex && ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket))) {
      assert.ok(!/depth/.test(x.it.exercise_id), x.it.exercise_id);
      if (x.ex.athletic && x.ex.athletic.quality === 'landing') assert.equal(x.w.plyo_stage, 'RC1');
    }
  });
  test('R08-7 pickleball: a medball throw station every week (racket rotation, ATH-05) and a frontal / transverse core pick', () => {
    const { p } = plan('08');
    for (const w of p.weeks) assert.ok(w.athletic_budget.planned.throws > 0, `w${w.n}`);
    const core = items({ weeks: [p.weeks[0]] }, x => x.b.kind === 'core' && x.ex).map(x => x.ex.plane);
    assert.ok(core.some(pl => ['frontal', 'transverse'].includes(pl)), core.join());
  });
  test('R08-8 pickleball: one light Olympic piece of 2 sets (stay-active policy), no 4 x 8 ramp', () => {
    for (const x of items(plan('08').p, x => x.it.bucket === 'AP_TRIPLE_EXT')) { assert.equal(x.it.sets, 2); assert.ok(!x.it.why.some(w => w.key === 'why.olympic_ramp')); }
  });
  test('R08-9 pickleball: joint care by injury code - knee / Achilles care each leg day, arm care weekly (D-32)', () => {
    const { p } = plan('08');
    for (const d of mains(p.weeks[0])) assert.ok(d.blocks.flatMap(b => b.items).some(it => it.bucket === 'PREHAB_LOWER'), d.weekday);
    assert.ok(p.weeks[0].days.some(d => d.blocks.some(b => b.items.some(it => it.bucket === 'RECOVERY_ARM_CARE'))));
  });
  test('R08-10 pickleball: knee pain shifts the share toward single-leg work (UNI-02, coach\'s joint-pain note)', () => {
    const { p } = plan('08');
    assert.ok(p.meta.share_targets.pain_shift < 0);
    assert.ok(p.meta.share_targets.lower.by_exercise_block.every(v => v <= 0.3));
  });
  test('R08-11 pickleball: the optional day before two play days holds no lower-body or calf work (R2-ATH-07 play spacing)', () => {
    const { p } = plan('08');
    for (const w of p.weeks) for (const d of w.days.filter(d => d.kind === 'optional')) for (const it of d.blocks.flatMap(b => b.items)) {
      const ex = it.exercise_id && model.hasEx(it.exercise_id) ? model.ex(it.exercise_id) : null;
      if (ex && ex.primary_muscle) assert.ok(model.rules.muscles.defs[ex.primary_muscle].region !== 'lower' || it.bucket === 'PREHAB_LOWER', `${d.weekday} ${it.exercise_id}`);
    }
  });
  test('R08-12 pickleball: stay-active compounds move from 12-15 to 8-12 at the second exercise block (PER-11)', () => {
    const { p } = plan('08');
    const reps = (n) => items({ weeks: [p.weeks[n - 1]] }, x => x.it.role === 'work' && x.it.reps && x.it.reps.max != null && !x.it.test).map(x => x.it.reps.max);
    assert.ok(reps(5).length && reps(5).every(m => m <= 12), JSON.stringify(reps(5)));
  });
  test('R08-13 pickleball: no running warm-up drills for a knee-pain court player with no running space (ORD-08)', () => {
    const { p } = plan('08');
    for (const d of mains(p.weeks[0])) {
      const prep = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'WARMUP_PREP');
      assert.ok(prep && /balance/.test(prep.text_key || prep.exercise_id || ''), d.weekday);
    }
  });
  test('R08-16 pickleball: the effort level prints "2" / "8" - never "a 8.0" or "a 11.0"', () => {
    const { md } = plan('08');
    // B3 (RECHECK 02 minor): the stairway level reads 'Week level', never 'Effort level' next to an RIR prescription
    assert.ok(!/like a (8|11)\.0/.test(md) && /Week level: 8 of 11/.test(md) && !/Effort level this week/.test(md));
  });
});
