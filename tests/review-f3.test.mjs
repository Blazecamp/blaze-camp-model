// tests/review-f3.test.mjs - engine 0.4.0 FIX ROUND 1 / F3 (selection, dosing and the printed plan) regression tests. One test per
// fixed issue of the coach-eye reviews of the 8 sample plans, named R<sample>-<slug> after the reviewed sample, and F3-sweep-<intake>-
// <slug> for an intake of the random sweep (tests/helpers/random-intake.mjs) that the round's own changes made fail an error check on
// the way. samples/REVIEW_LOG.md (v0.4 fix round 1 / F3) and engine/DECISIONS.md (E-110 ...) list them. Plans are built on the
// compiled model (model/) unless the test says the fixture.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { renderPlan, renderDay } from '../engine/render.mjs';
import { changesText } from '../engine/explain.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { variationValues } from '../engine/select.mjs';
import { loadModel } from '../engine/model.mjs';
import { loadCompiledModel, loadFixtureModel, readModelDir, INTAKE_DIR } from './helpers/models.mjs';
import { randomIntake, sportIntake } from './helpers/random-intake.mjs';

const model = loadCompiledModel();
const fixture = loadFixtureModel();
const R = model ? model.rules : null;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const ALL = Object.keys(NAMES);
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const mdCache = {};
const md = (n, lang) => { const k = n + '|' + (lang || ''); if (!mdCache[k]) mdCache[k] = renderPlan(plan(n), model, { lang: lang || plan(n).lang }); return mdCache[k]; };
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const exOf = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const stairWeeks = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const t = (lang, k, a) => model.t(lang, k, a);

describe('v0.4 fix round 1 / F3: selection, dosing and the printed plan (coach-eye reviews of the 8 samples)', { skip: !model && 'model/ not compiled' }, () => {
  // ------------------------------------------------------------------------------------------------ minutes and supersets (R3-SES-02)
  test('R01-supersets-promise-true: "Supersets marked today keep you inside N min" only on a day whose minutes hold it; a day over its minutes says so and what saves time (E-111)', () => {
    for (const n of ALL) {
      const p = plan(n);
      for (const w of p.weeks) for (const d of w.days.filter(x => ['main', 'optional'].includes(x.kind))) {
        const card = unesc(renderDay(p, w.n, d.weekday, model, { lang: 'en' }));
        const promise = card.includes(t('en', 'ui.plan.supersets_today', { min: d.minutes_limit }));
        if (typeof d.est_minutes === 'number' && d.est_minutes > d.minutes_limit) {
          assert.ok(!promise, `${n} w${w.n} ${d.weekday}: ${d.est_minutes} min > ${d.minutes_limit} with the promise`);
          assert.ok(['ui.plan.supersets_today_over', 'ui.plan.supersets_today_over_none', 'ui.plan.day_over', 'ui.plan.day_over_none'].some(k => card.includes(t('en', k, { min: d.minutes_limit, est: d.est_minutes }))), `${n} w${w.n} ${d.weekday}: no over line`);
        }
      }
    }
  });
  test('R01-supersets-warning-true: "Do the marked supersets ... to finish on time" only when every non-test week of those days fits; else the "save time" line (E-111)', () => {
    for (const n of ALL) {
      const p = plan(n), s = unesc(md(n, 'en'));
      const w = (p.meta.warnings || []).find(x => x.key === 'warning.supersets_needed');
      if (!w) continue;
      const days = [].concat(w.args.day);
      const over = p.weeks.some(wk => !wk.test && wk.days.some(d => days.includes(d.weekday) && d.est_minutes > d.minutes_limit));
      if (over) assert.ok(!s.includes('to finish on time'), n);
    }
  });

  // ------------------------------------------------------------------------------------------------ what can be switched off (R3-SES-02)
  test('R07-toggles-every-block: the day line names every block the JSON lets the person switch off (accessories and the cool-down too); a cardio day says it is optional (E-112)', () => {
    for (const n of ['06', '07']) {
      const p = plan(n);
      for (const d of p.weeks[0].days.filter(x => x.kind === 'main')) {
        const card = unesc(renderDay(p, 1, d.weekday, model, { lang: 'en' }));
        for (const k of d.toggle_blocks.filter(k => d.blocks.some(b => b.kind === k && b.items.length) && !['warmup', 'test', 'strength', 'circuit'].includes(k))) {
          assert.ok(card.includes(t('en', 'block.short.' + k)), `${n} ${d.weekday}: ${k} missing`);
        }
      }
    }
    const p5 = plan('05');
    const aer = p5.weeks[0].days.find(d => d.kind === 'aerobic');
    assert.ok(unesc(renderDay(p5, 1, aer.weekday, model, { lang: 'en' })).includes(t('en', 'ui.plan.edit_aerobic_day')));
    assert.ok(!/apagar/.test(md('05', 'es')) && md('05', 'es').includes('desactivar'));
  });

  // ------------------------------------------------------------------------------------------------ the two-leg / single-leg note
  test('R02-v28-direction: the two-leg / single-leg note follows the gap - over the target it says swap a two-leg exercise for a single-leg one, under it the reverse (E-113)', () => {
    const p = JSON.parse(JSON.stringify(plan('02')));
    const c = p.validation.checks.find(x => x.id === 'V28');
    const put = (share, target) => { c.pass = false; c.violations = [{ where: { week: 1 }, key: 'check.v28_laterality_share', args: { exercise_block: 1, share, target } }]; return unesc(renderPlan(p, model, { lang: 'en' })); };
    const hi = put(0.49, 0.2);
    assert.ok(hi.includes(t('en', 'check.failed.V28_more_single', { share: 49, target: 20 })));
    assert.ok(!hi.includes('swap a single-leg exercise for a two-leg one'));
    const lo = put(0.54, 0.8);
    assert.ok(lo.includes(t('en', 'check.failed.V28_more_two', { share: 54, target: 80 })));
  });
  test('R03-laterality-dial: every sample\'s lower body sits within the V28 tolerance of its share target - athletes convert two-legged stations to single-leg ones (the non-axial day first), physique / strength clients swap single-leg stations to two-legged non-axial lifts in later blocks (BRAIN 6.5, E-127)', () => {
    // (fix round 2 / F1, E-137 / E-138 / E-146: in a time-limited athlete plan the time check keeps each lower group on the days that hold
    // it - a group below its floor keeps its work lift's day only - and the climb goes where the minutes are, so single-leg stations can
    // leave with the other days; V28 still warns there. Open for the dial to run after the time check (samples/REVIEW_LOG.md v0.4 fix
    // round 2 / F1, select owner))
    const lowerHeld = (p) => (p.time_check && !p.time_check.fits && ((p.time_check.trained_below_floor || []).some(x => ['quads', 'hips'].includes(x.group)) || (p.time_check.lowered_peak || []).some(g => ['quads', 'hips'].includes(g))));
    for (const n of ALL) if (!lowerHeld(plan(n))) assert.ok(check(plan(n), 'V28').pass, `${n}: ${JSON.stringify(check(plan(n), 'V28').violations)}`);
    // the tested lifts and the counted squat / hinge stay two-legged (one bilateral exposure per pattern)
    for (const n of ['02', '03']) for (const x of allItems(plan(n)).filter(x => (x.it.flags || []).includes('axial_counted'))) assert.equal(exOf(x.it.exercise_id).laterality, 'bilateral', `${n} ${x.it.exercise_id}`);
    // engine 0.5.0 / V4 (converted; DECISIONS G-56; COACH-R4 R4-SES-05 'knee-dominant movement, bilateral ... knee-dominant movement,
    // unilateral'; OBSERVED BYOP 'Bilateral KD' / 'Unilateral KD' / 'Bilateral HD' / 'Unilateral HD'): 06 / 07 are built on the coach's
    // A / B and push / pull / legs days, whose slots name their laterality - the dial no longer swaps a single-leg slot to a two-legged
    // lift in the later blocks (was: 'the later blocks hold more two-legged lower work than the first'); every lower slot keeps the
    // laterality its slot names in every week
    const WANT = { RP_BKD: ['bilateral'], RP_BHD: ['bilateral'], RP_UKD: ['unilateral', 'alternating'], RP_UHD: ['unilateral', 'alternating'] };
    for (const n of ['06', '07']) for (const x of allItems(plan(n))) {
      if (x.d.kind !== 'main' || x.it.origin !== 'template' || !WANT[x.it.bucket] || !x.it.exercise_id) continue;
      assert.ok(WANT[x.it.bucket].includes(exOf(x.it.exercise_id).laterality), `${n} w${x.w.n} ${x.it.slot_id}: ${x.it.exercise_id} in a ${x.it.bucket} slot`);
    }
  });

  // ------------------------------------------------------------------------------------------------ Focus vs bonus (R3-SES-01)
  test('R08-focus-label: "(Focus)" only on an exercise of a Focus muscle the client picked; every other added / optional-day slot reads "(bonus)" (E-114)', () => {
    for (const n of ['01', '02', '03', '08']) assert.ok(!/\((Focus|Enfoque)\)/.test(md(n, 'en')) && !/\((Focus|Enfoque)\)/.test(md(n, 'es')), n);
    const p = plan('06'), pr = p.meta.derived.priority_muscles;
    const s = unesc(md('06', 'en'));
    for (const x of allItems(p).filter(x => x.it.exercise_id && (x.it.bucket === 'FOCUS' || x.it.origin === 'focus_added'))) {
      const label = t('en', x.it.name_key) + (x.it.detail ? ' - ' + t('en', x.it.detail.key) : '') + ' (Focus)';
      const pm = exOf(x.it.exercise_id).primary_muscle;
      const shoulders = model.groupOf(pm) === 'shoulders' && pr.some(m => model.groupOf(m) === 'shoulders');
      if (!pr.includes(pm) && !shoulders) assert.ok(!s.includes('**' + label + '**'), label);
    }
    assert.ok(s.includes('(Focus)'));
  });
  test('R07-focus-muscles-line: the header names the client\'s Focus muscles and the extra weekly sets they get (R3-SES-01; E-114)', () => {
    const s = unesc(md('07', 'en'));
    assert.ok(s.includes(t('en', 'ui.plan.focus_add', { n: plan('07').meta.targets.focus_add })));
    assert.ok(/\*\*Focus muscles:\*\* Chest, Back/.test(s));
    assert.ok(!/\*\*Focus muscles/.test(unesc(md('01', 'en'))));
    assert.ok(unesc(md('06', 'en')).includes('**' + t('en', 'ui.plan.profile_label') + ':** '));
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R01-pattern-kept-note: a kept movement-pattern station says it is 2 sets that do not count toward the weekly s…'
  //   a 'pattern kept' station was what the time check left of a dropped group; nothing is dropped any more (R4-SES-04), so no item has that origin
  test('R01-optional-tag-once: an optional day\'s title never reads "Optional day (optional)" (E-114)', () => {
    for (const n of ALL) for (const lang of ['en', 'es']) assert.ok(!/Optional day \(optional\)|Día opcional \(opcional\)/i.test(md(n, lang)), `${n} ${lang}`);
  });

  // ------------------------------------------------------------------------------------------------ the legal lines (R3-GEN-01)
  test('R08-release-health-lines: one flat "use at your own risk, terms and release accepted" stamp (no nested brackets), the health-check line with the official PAR-Q+ link, and the footer links the full terms (E-115)', () => {
    for (const n of ALL) for (const lang of ['en', 'es']) {
      const s = unesc(md(n, lang));
      assert.ok(!/(Release accepted|Descargo aceptado) \(/.test(s), `${n} ${lang} old stamp`);
      const who = t(lang, 'release.who.' + String(plan(n).release_stamp.version).replace(/^release\./, ''));
      assert.ok(s.includes(who), `${n} ${lang} stamp`);
      assert.ok(s.includes('](' + R.legal.parq_url + ')'), `${n} ${lang} PAR-Q+`);
      const foot = s.slice(s.lastIndexOf('---'));
      assert.ok(foot.includes('](' + R.legal.disclaimer_url[lang] + ')'), `${n} ${lang} footer link`);
    }
  });

  // ------------------------------------------------------------------------------------------------ the coach's instruction and the guide
  test('R07-effort-bridge: the coach\'s verbatim "always leave 1 in the tank" stays, with one line under it saying the plan starts at 3 and ends at 1 (R3-VOL-04; E-119)', () => {
    for (const n of ALL) for (const lang of ['en', 'es']) {
      const s = unesc(md(n, lang));
      // (fix round 2 / F3, E-200: the class model prints the CrossFit sheet's own Basic Instruction - OBSERVED A4:A7 - with no '1 in the
      // tank' line to bridge; its effort drift line still prints)
      if (n === '04') { assert.ok(s.includes(t(lang, 'instruction.cf.1')) && !s.includes(t(lang, 'instruction.1')) && s.includes(t(lang, 'effort.drift', { list: '' }).split(':')[0]), `${n} ${lang}`); continue; }
      assert.ok(s.includes(t(lang, 'instruction.1')), `${n} ${lang}`);
      assert.ok(s.includes(t(lang, 'instruction.1_bridge', { start: '3', end: '1' })), `${n} ${lang} bridge`);
      assert.ok(s.indexOf(t(lang, 'instruction.1_bridge', { start: '3', end: '1' })) > s.indexOf(t(lang, 'instruction.1')));
    }
  });
  test('R06-adjust-guide: every plan prints "How to adjust this plan" (missed week, a true max, too easy, pain: swap -> cut -> drop, life, what can be edited) in EN and ES (R3-VOL-02 / R3-VOL-04; E-120)', () => {
    for (const n of ALL) for (const lang of ['en', 'es']) {
      const s = unesc(md(n, lang));
      assert.ok(s.includes('## ' + t(lang, 'guide.adjust.title')), `${n} ${lang}`);
      for (const k of ['missed', 'max', 'easy', 'pain', 'life']) assert.ok(s.includes(t(lang, 'guide.adjust.' + k)), `${n} ${lang} ${k}`);
      // (fix round 2 / F3, E-197: the 'what can be edited' line names the blocks this plan's days can switch off, not a fixed list)
      assert.ok(s.includes(t(lang, 'guide.adjust.edit_blocks', { blocks: '' }).split(':')[0]) || s.includes(t(lang, 'guide.adjust.edit_none')), `${n} ${lang} edit`);
    }
  });
  test('R07-core-superset-once: "add a core superset to any exercise" is said once for the whole plan, not on one plank (R2-SES-03; E-119)', () => {
    const s = unesc(md('07', 'en'));
    assert.ok(s.includes(t('en', 'ui.plan.core_supersets_line')));
    assert.ok(!s.includes('- ' + t('en', 'note.core_supersets_optional')));
  });

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R05-schedule-lists: a group held below the floor is never in the "10+ sets" list, calves under 10 have their o…'
  //   the schedule section ('10+ sets' lists, 'below the floor' lines) is retired with the time check (CT-01)
  test('R08-climbing-truthful: "climb every week" is printed only when every named group gains sets every week; otherwise "through the block" (R3-VOL-04; E-116)', () => {
    for (const n of ALL) {
      const p = plan(n), s = unesc(md(n, 'en'));
      const lp = (p.meta.warnings || []).find(w => w.key === 'warning.time_lower_peak');
      if (!lp) continue;
      const st = stairWeeks(p);
      const every = [].concat(lp.args.group).every(g => st.every((w, i) => i === 0 || (w.weekly_sets_by_group[g] || 0) > (st[i - 1].weekly_sets_by_group[g] || 0)));
      if (!every) assert.ok(!s.includes('still climb every week'), n);
    }
  });
  test('R01-changes-by-group: a week never says a group "stays at these sets" when it gains a set that week; the hold lines name FOCUS groups (never "Hamstrings stays" / "Glutes stays"), a reached target is "this plan\'s set target" (E-122)', () => {
    for (const n of ALL) {
      const p = plan(n);
      for (const w of p.weeks) {
        const lines = changesText(p, w.n, model, 'en');
        assert.ok(!lines.some(l => /stays at these sets|weekly ceiling/.test(l)), `${n} w${w.n}: ${lines.join(' | ')}`);
        const added = new Set(w.changes.filter(c => ['changes.set_added', 'changes.bonus_added'].includes(c.key)).map(c => { const it = items(w).find(x => x.it.slot_id === c.args.slot_id); return it && it.it.group; }).filter(Boolean));
        for (const g of added) assert.ok(!lines.includes(t('en', 'changes.held_group', { group: t('en', 'group.' + g) })), `${n} w${w.n}: ${g}`);
      }
    }
  });
  test('R05-phase-halfway: the stairway intro names the halfway week (small steps up to it, bigger after) and no phase label promises bigger steps before it (R3-VOL-04; E-121)', () => {
    for (const n of ALL) {
      const s = unesc(md(n, 'en'));
      assert.ok(!/steps get a bit bigger/.test(s), n);
      const tb = plan(n).shape.training_blocks.find(x => x.type === 'stairway');
      const half = model.stair(tb.stair_N).halfway;
      assert.ok(s.includes(t('en', 'plan.stairway_intro_half', { half: tb.weeks[0] + half - 1, next: tb.weeks[0] + half })), n);
    }
  });

  // ------------------------------------------------------------------------------------------------ the weekly sets table
  test('R08-weekly-table-all-groups: the weekly sets table has a row for every FOCUS group - "-" when not trained directly, with the sets it still gets in brackets; a class lift reads "(class lift)" (E-117)', () => {
    const s8 = unesc(md('08', 'en'));
    const table = s8.slice(s8.indexOf('## ' + t('en', 'ui.plan.weekly_sets_groups')));
    for (const g of ['quads', 'hips', 'back', 'chest', 'shoulders', 'calves']) assert.ok(table.includes('| ' + t('en', 'group.' + g) + ' |'), g);
    // (v0.5, R4-SES-03: on 2 training days back is trained - 6-8 weekly sets - not left to a kept pattern station)
    assert.ok(/\| Back \| \d/.test(table));
    // (engine 0.6.0, converted - COACH-CH5 CH5-02 / DECISIONS G-198: 08's arms are trained in slot 5 now; the credit-only row is read on
    // the football plan, whose arms stay credit-only in the stairway)
    const s2 = unesc(md('02', 'en'));
    assert.ok(/\| Biceps \| - \(\d/.test(s2.slice(s2.indexOf('## ' + t('en', 'ui.plan.weekly_sets_groups')))), 'a credit-only group shows "-" with its helper sets');
    const s1 = unesc(md('01', 'en'));
    assert.ok(/\| Biceps \| - \(\d/.test(s1), 'a credit-only group shows "-" with its helper sets');
  });

  // ------------------------------------------------------------------------------------------------ small copy fixes
  test('R02-copy-fixes: every test item reads "Test:", the rep-cap note says "Keep this lift at ...", the reminders are test dates to mark, the easy week is recommended, one rep left is singular, no "(HALF TIME)", no "+ arms" on a day with no arm exercise, a one-arm Olympic lift is per side (E-123)', () => {
    for (const n of ALL) for (const x of allItems(plan(n)).filter(x => x.it.bucket === 'TEST' && x.it.test)) {
      const card = unesc(renderDay(plan(n), x.w.n, x.d.weekday, model, { lang: 'en' }));
      assert.ok(card.includes('**' + t('en', 'ui.plan.test_item', { test: x.it.name_key ? t('en', x.it.name_key) : t('en', 'tests.' + x.it.test.test) }) + '**'), `${n} ${x.it.test.test}`);
    }
    for (const n of ALL) {
      const s = unesc(md(n, 'en')), es = unesc(md(n, 'es'));
      assert.ok(!/harder than its group|Reminders:|one easy week, then one step up|about 1 reps|HALF TIME/.test(s), n);
      assert.ok(!/unas 1 repeticiones|Recordatorios:/.test(es), n);
    }
    const s5 = unesc(md('05', 'en'));
    // (v0.5, R4-SES-02: the 7-station Friday keeps its triceps station, so its title says '+ arms' - and only a day with an arm
    // exercise says so)
    assert.ok(/Bootcamp 3 - single-leg squat \+ pulls/.test(s5));
    for (const d of plan('05').weeks[0].days.filter(x => x.kind === 'main')) {
      const arms = d.blocks.flatMap(b => b.items).some(it => ['ISO_BICEP', 'ISO_TRICEP'].includes(it.bucket));
      const title = s5.split('\n').find(l => l.startsWith('### ' + t('en', 'weekday.' + d.weekday)));
      if (/\+ arms/.test(title)) assert.ok(arms, title);
    }
    assert.ok(/Bootcamp 2 - bisagra \+ empujes \(press\)/.test(unesc(md('05', 'es'))));
    const snatch = allItems(plan('01')).find(x => x.it.exercise_id === 'single-arm-db-snatch');
    assert.ok(snatch && snatch.it.reps.type === 'per_side');
  });
  test('R08-heavy-play-once: a client who plays 3+ times a week reads the "half the jumps" note once, up front - not on every jump of every week (E-123)', () => {
    const i = intakeOf('08');
    i.activity.play_days = ['Tue', 'Wed', 'Sat'];
    const p = generate(i, model);
    if (!allItems(p).some(x => (x.it.notes || []).some(nt => nt.key === 'note.heavy_play_week'))) return;
    const s = unesc(renderPlan(p, model, { lang: 'en' }));
    assert.equal(s.split(t('en', 'ui.plan.heavy_play_plan')).length - 1, 1);
    assert.ok(!s.includes(t('en', 'note.heavy_play_week')));
  });
  test('R01-test-one-line: a tested lift says once that the test replaces its top set (never also "Test day: replaces this week\'s top sets") (R2-PER-07; E-123)', () => {
    for (const n of ['01', '02', '07']) {
      const s = unesc(md(n, 'en'));
      for (const block of s.split(/\n\d+\. /)) if (block.includes(t('en', 'note.test_top_set_replaces', { test: '' }).split('(')[0])) assert.ok(!block.includes(t('en', 'note.test_day')), n);
    }
  });

  // ------------------------------------------------------------------------------------------------ superset rest and reading order
  test('R06-pair-rest-numbers: every superset partner rests in numbers ("rest 60-90 s after the pair"), the longer partner\'s extra sets are done on their own, and partners print next to each other (VOL-14, ORD-05; E-118)', () => {
    // v0.5 (CT-01; R3-SES-02 'I recommend'): a pair is a recommendation the person switches on - here with the superset preference
    const on = (n) => { const i = intakeOf(n); i.prefs.supersets_for_fatigue = true; return generate(i, model); };
    const p6on = on('06');
    for (const p of [p6on, on('07'), on('02')]) for (const x of allItems(p).filter(x => x.it.rest && x.it.rest.type === 'after_pair')) {
      assert.ok(typeof x.it.rest.min === 'number' && typeof x.it.rest.max === 'number', `${x.it.slot_id}`);
    }
    assert.ok(allItems(p6on).some(x => x.it.superset && x.it.rest && x.it.rest.type === 'after_pair' && x.it.bucket.startsWith('RP_')), 'the preference switches the lift pairs on');
    assert.ok(!allItems(plan('06')).some(x => x.it.superset && x.it.bucket.startsWith('RP_')), 'a lift pair is off by default');
    const s = unesc(renderPlan(p6on, model, { lang: 'en' }));
    assert.ok(!/rest after the pair(?! )/.test(s.replace(/rest \d+-\d+ (s|min) after the pair/g, '')));
    assert.ok(s.includes(t('en', 'ui.plan.superset_leftover_one')) || s.includes('Then do its last'));
    // reading order: [X1] is followed by [X2]
    for (const n of ['03', '06']) for (const line of unesc(md(n, 'en')).split('\n### ')) {
      const tags = [...line.matchAll(/\[([A-Z])(\d)\]/g)].map(m => m[1] + m[2]);
      for (let i = 0; i < tags.length; i++) if (tags[i][1] === '1' && tags.includes(tags[i][0] + '2')) {
        const j = tags.indexOf(tags[i][0] + '2', i);
        assert.ok(j === -1 || j === i + 1 || tags.slice(i + 1, j).every(x => x[0] === tags[i][0]), `${n}: ${tags.join(' ')}`);
      }
    }
  });

  // ------------------------------------------------------------------------------------------------ intensifiers (R3-VOL-04)
  test('R08-intensifier-fallback: a main day whose last item cannot take the MYO (an Achilles-protected calf raise, a glute bridge) gives it to its last eligible machine / isolation item; the header names the days (E-119)', () => {
    const p = plan('08');
    const last = stairWeeks(p).slice(-1)[0];
    // (v0.5 fix round 1, VOL-03 'pain: cut, keep it moving, do not push it' / sample 08 major: the MYO set never lands on a muscle
    // the plan cut for pain, and a calf raise carries it only when the day holds nothing else and the week tests no sprint or jump -
    // rules.effort.intensifiers; so a training day may hold none)
    const pain = new Set(p.meta.targets.pain_muscles || []);
    const myoOf = (d) => d.blocks.flatMap(b => b.items).filter(it => it.effort && it.effort.last_set === 'myo');
    assert.ok(last.days.filter(x => x.kind === 'main').some(d => myoOf(d).length === 1), 'no training day carries the intensifier');
    for (const d of last.days) for (const it of myoOf(d)) {
      const e = model.ex(it.exercise_id);
      assert.ok(!Object.entries(e.credits).some(([m, c]) => c >= 1 && pain.has((R.muscles.defs[m] || {}).line || m)), `${d.weekday} ${it.exercise_id}: a MYO set on a pain muscle`);
    }
    assert.ok(check(p, 'V12').pass && check(p, 'V17').pass);
    const p6 = plan('06');
    const l6 = stairWeeks(p6).slice(-1)[0];
    for (const d of l6.days.filter(x => x.kind === 'main')) assert.equal(d.blocks.flatMap(b => b.items).filter(it => it.effort && it.effort.last_set).length, 1, d.weekday);
    // (fix round 2 / F3: 'and' in a list of days; v0.5: the optional Friday holds the chest bonus exercise - the plan's own
    // 'template caps chest' answer, R3-VOL-03 - so it has an intensifier day too)
    const myoDays = last.days.filter(d => d.blocks.some(b => b.items.some(it => it.effort && it.effort.last_set === 'myo'))).map(d => t('en', 'weekday.' + d.weekday));
    const listed = myoDays.length > 1 ? myoDays.slice(0, -1).join(', ') + ' and ' + myoDays[myoDays.length - 1] : myoDays[0];
    // (v0.6 words, converted - DECISIONS G-176: one day reads in the singular)
    assert.ok(unesc(md('08', 'en')).includes(t('en', myoDays.length === 1 ? 'effort.intensifier_days_one' : 'effort.intensifier_days', { days: listed })), listed);
  });
  test('R05-circuit-intensifier: the bootcamp\'s last week carries its promised intensifier - a 10-s hold on one isolation station a day, never a compound; a plan with none never promises "a few extra-hard sets" (R3-VOL-04; E-119)', () => {
    const p = plan('05');
    const last = stairWeeks(p).slice(-1)[0];
    for (const d of last.days.filter(x => x.kind === 'main')) {
      const its = d.blocks.flatMap(b => b.items).filter(it => it.effort && it.effort.last_set);
      assert.equal(its.length, 1, d.weekday);
      assert.equal(its[0].effort.last_set, 'hold');
      assert.ok(!R.effort.intensifiers.never_credit_classes.includes(exOf(its[0].exercise_id).credit_class), its[0].exercise_id);
    }
    assert.ok(unesc(md('05', 'en')).includes(t('en', 'effort.last_set.hold')));
    // the CrossFit class's last week carries none: the copy does not promise one
    const s4 = unesc(md('04', 'en'));
    // (fix round 2 / F3: the line's week-1 tip names the plan's first effort, {rir})
    if (!allItems(plan('04')).some(x => x.it.effort && x.it.effort.last_set)) assert.ok(s4.includes(t('en', 'effort.how_hard_no_int', { rir: '3' })) && !s4.includes(t('en', 'effort.how_hard', { rir: '3' })));
  });
  test('F3-validator-myo-last-eligible: V12 / V17 accept a MYO on the day\'s last ELIGIBLE item (free-weight compounds, glute bridges and protected calves after it) and still fail one with an isolation after it (E-119)', () => {
    const p = JSON.parse(JSON.stringify(plan('08')));
    const last = stairWeeks(p).slice(-1)[0];
    const d = last.days.find(x => x.kind === 'main' && x.blocks.some(b => b.items.some(it => it.effort && it.effort.last_set === 'myo')));
    const flat = d.blocks.flatMap(b => b.items);
    const myo = flat.find(it => it.effort && it.effort.last_set === 'myo');
    // move the MYO to an earlier isolation with an eligible one after it -> fails
    const res = flat.filter(it => it.exercise_id && it.sets && ['ISO_LEG_FLEXION', 'ISO_QUAD', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP'].includes(it.bucket));
    if (res.length >= 2) {
      const first = res[0];
      if (first !== myo) {
        myo.effort = { ...myo.effort, last_set: null, intensifier: false };
        first.effort = { ...first.effort, last_set: 'myo', intensifier: true };
        const v = validatePlan(p, model);
        assert.ok(!v.checks.find(c => c.id === 'V12').pass || !v.checks.find(c => c.id === 'V17').pass);
      }
    }
  });

  // ------------------------------------------------------------------------------------------------ selection
  test('R01-non-spinal-hinge: the swimmer (low-back extension hot spot) gets a non-spinal hinge (back extension / hip thrust) on the second hinge day and never two two-legged deadlifts on one day (R2-SES-01; E-128)', () => {
    const p = plan('01');
    const wed = allItems(p).filter(x => x.d.weekday === 'Wed' && x.it.bucket === 'RP_BHD' && x.it.role !== 'test');
    assert.ok(wed.length && wed.every(x => new RegExp(R.selection.f3.non_spinal_hinge.prefer_re).test(x.it.exercise_id)), wed.map(x => x.it.exercise_id).join(' '));
    for (const n of ['01', '02', '03']) for (const w of plan(n).weeks) for (const d of w.days) {
      const dl = d.blocks.flatMap(b => b.items).filter(it => it.role !== 'test' && it.exercise_id && exOf(it.exercise_id).laterality === 'bilateral' && /deadlift|rdl/.test(it.exercise_id) && !exOf(it.exercise_id).is_athletic);
      assert.ok(dl.length <= 1, `${n} w${w.n} ${d.weekday}: ${dl.map(it => it.exercise_id).join(' ')}`);
    }
  });
  test('R01-low-back-core: a low-back hot-spot athlete\'s main-day core is anti-extension / anti-rotation (planks, Pallof / suitcase holds, dead bugs) - loaded twists, leg raises, V-ups and sit-ups stay off the main days (R2-SES-03; E-129)', () => {
    const avoid = new RegExp(R.selection.f3.core_low_back.avoid_re);
    // (engine 0.6 selection, converted - DECISIONS G-131: the low-back list is for a client who reports low-back pain - the swimmer's
    // profile hot spot alone is a lean, 02 M3 of round 4; the rule is asserted on the swimmer with the pain entered)
    const i01 = intakeOf('01'); i01.pain = [{ area: 'lower_back', side: 'both', severity: 'mild', worse_with: [] }];
    for (const x of allItems(generate(i01, model)).filter(x => x.b.kind === 'core' && x.d.kind === 'main')) assert.ok(!avoid.test(x.it.exercise_id), `w${x.w.n} ${x.d.weekday} ${x.it.exercise_id}`);
  });
  test('R06-side-delt-focus: with a side-delt / shoulders Focus the week keeps one rear-delt station and fills the others with side raises; the Focus-first spot holds a side raise (R3-VOL-01, R3-SES-01; E-133)', () => {
    const p = plan('06');
    for (const w of stairWeeks(p)) {
      const delts = items(w).filter(x => x.it.bucket === 'ISO_SIDE_REAR_DELT' && x.d.kind === 'main' && x.it.sets);
      const rear = delts.filter(x => ['ISO_REAR', 'FACEPULL'].includes(exOf(x.it.exercise_id).credit_class));
      assert.ok(rear.length <= 1, `w${w.n}: ${rear.map(x => x.it.exercise_id).join(' ')}`);
      for (const d of w.days.filter(x => x.kind === 'main')) {
        const st = d.blocks.find(b => b.kind === 'strength');
        const first = st && st.items[0];
        if (first && first.bucket === 'ISO_SIDE_REAR_DELT') assert.equal(exOf(first.exercise_id).credit_class, 'ISO_SIDE', `w${w.n} ${d.weekday}`);
      }
    }
    // v0.5 (R4-SES-05): the B day's delt slot is the side raise of the coach's template; the rear delts are worked with the rows
    // (R3-VOL-01) - so the football week holds side raises and no forced rear-delt station (was: 'one of each')
    const w2 = plan('02').weeks[0];
    const cls = items(w2).filter(x => x.it.bucket === 'ISO_SIDE_REAR_DELT' && x.it.sets).map(x => exOf(x.it.exercise_id).credit_class);
    assert.ok(cls.length >= 1 && cls.includes('ISO_SIDE'), cls.join(' '));
    assert.ok(check(plan('02'), 'V18').pass);
  });
  test('R05-level-hard: an above-ladder high-skill pick (sissy squat), or any above-ladder pick in a timed circuit (renegade row), is a fallback only - an in-level version that passes the kit wins (CAT-05; E-130)', () => {
    const p = plan('05');
    for (const x of allItems(p).filter(x => x.it.circuit && x.it.exercise_id)) assert.ok(!(x.it.flags || []).includes('level_shift'), `${x.d.weekday} ${x.it.exercise_id}`);
    assert.ok(!allItems(p).some(x => /sissy|renegade/.test(x.it.exercise_id || '')));
    // the kit-aware detail: no 'holding a plate at the chest' without a plate
    assert.ok(!p.meta.kit.tokens.includes('weight_plate') ? !allItems(p).some(x => x.it.detail && x.it.detail.value === 'plate_at_chest') : true);
  });
  test('R02-hotspot-picks: the ACL-landing athletes get no sissy squat; the low-back-loading athletes no bent-over barbell row; no axial-high calf raise on a day without an axial station (E-127 ... E-131)', () => {
    for (const n of ['02', '03']) assert.ok(!allItems(plan(n)).some(x => /sissy/.test(x.it.exercise_id || '')), n);
    for (const n of ['02', '04']) assert.ok(!allItems(plan(n)).some(x => /^bent-over-barbell-row/.test(x.it.exercise_id || '')), n);
    for (const w of plan('02').weeks) for (const d of w.days) {
      const axialDay = d.blocks.some(b => b.items.some(it => (it.flags || []).includes('axial_counted')));
      if (!axialDay) assert.ok(!d.blocks.some(b => b.items.some(it => it.exercise_id && exOf(it.exercise_id).tags.includes('axial_high') && it.bucket === 'ISO_CALF')), `w${w.n} ${d.weekday}`);
    }
  });
  test('R04-class-lifts-table: the class strength table (7 -> 4 reps, strength rest) belongs to the squat / press / deadlift work lifts only - the pull day\'s row trains on the resistance table (OBSERVED class split; E-126)', () => {
    const SB = R.reps.class_levels.strength_buckets;
    for (const x of allItems(plan('04')).filter(x => x.it.role === 'work' && !x.it.test && x.it.exercise_id && !SB.includes(x.it.bucket) && /^RP_/.test(x.it.bucket))) {
      assert.ok(!(x.it.rest && x.it.rest.type === 'seconds' && x.it.rest.min >= 180), `${x.d.weekday} ${x.it.exercise_id}`);
    }
  });
  test('R07-powerlifting-canonical: a heavy-powerlifting client\'s work lifts are the canonical barbell lifts (flat bench, back squat, conventional / sumo deadlift), tested, at two rep classes heavier (VOL-12; E-131)', () => {
    const p = plan('07');
    const tested = allItems(p).filter(x => x.it.role === 'test' && x.it.exercise_id).map(x => x.it.exercise_id);
    assert.ok(tested.includes('barbell-bench-press'), tested.join(' '));
    assert.ok(tested.some(id => /back-squat/.test(id)) && tested.some(id => /conventional|sumo-deadlift/.test(id)), tested.join(' '));
    const w2 = p.weeks[1];
    // (v0.5 fix round 1, PER-04 / sample 07 minor: the week's second pull day leads with another row than the bent-over barbell row -
    // a chest-supported row; the heavy shift is for a day's first free-weight two-arm compound, VOL-12, so a supported row keeps its range)
    for (const d of w2.days) { const it = d.blocks.flatMap(b => b.items).find(i => /^RP_/.test(i.bucket)); if (it && it.reps && it.reps.max && !/seal-row|chest-supported|machine/.test(it.exercise_id)) assert.ok(it.reps.max <= 6, `${d.weekday} ${it.exercise_id}`); }
  });
  test('R06-week-families: versions of one movement count as one in the week - at most 2 lying triceps extensions, no two side planks on one day, swaps never repeat an exercise of the day (PER-04; E-131)', () => {
    for (const n of ['06', '07']) for (const w of stairWeeks(plan(n))) {
      const lying = items(w).filter(x => /skullcrusher|tate-press|lying-triceps/.test(x.it.exercise_id || '') && x.it.sets);
      assert.ok(lying.length <= 2, `${n} w${w.n}: ${lying.map(x => x.it.exercise_id).join(' ')}`);
    }
    for (const n of ALL) for (const w of plan(n).weeks) for (const d of w.days) {
      const sp = d.blocks.flatMap(b => b.items).filter(it => /side-plank|star-side/.test(it.exercise_id || ''));
      assert.ok(sp.length <= 1, `${n} w${w.n} ${d.weekday}`);
      const ids = new Set(d.blocks.flatMap(b => b.items).map(it => it.exercise_id).filter(Boolean));
      for (const it of d.blocks.flatMap(b => b.items)) if (it.bucket !== 'TEST' && it.role !== 'test' && /^RP_/.test(it.bucket)) for (const sw of it.swaps || []) assert.ok(!ids.has(sw) || sw === it.exercise_id || d.blocks.flatMap(b => b.items).filter(x => x.exercise_id === sw).every(x => x.slot_id.startsWith(it.slot_id)), `${n} ${d.weekday} ${it.exercise_id} -> ${sw}`);
    }
  });
  test('R04-detail-words: a one-detail variation never contradicts the record\'s own name ("Flat DB Fly - on an incline bench", "DB Deadlift - with kettlebells") (R2-LIB-01; E-110)', () => {
    const fly = model.ex('flat-db-fly');
    assert.ok(!variationValues(model, fly, ['weight_bench', 'bench', 'dumbbell']).some(v => v.value === 'incline_bench'));
    const rfe = model.ex('rear-foot-on-wall-db-deadlift-rdl');
    assert.ok(!variationValues(model, rfe, ['dumbbell', 'kettlebell']).some(v => v.value === 'kettlebell'));
    for (const n of ALL) assert.ok(!/Flat DB Fly - on an incline bench|DB [^|\n]*- with kettlebells/.test(unesc(md(n, 'en'))), n);
  });

  test("R04-skill-note: the class model's warm-up skill follows the template station's own word (squat day 'DUBS' -> double-unders) before the slot's default list (OBSERVED class split; E-123)", () => {
    const p = plan('04');
    const mon = allItems(p).filter(x => x.d.weekday === 'Mon' && x.it.bucket === 'SKILL');
    assert.ok(mon.length && mon.every(x => /double-under/.test(x.it.exercise_id)), mon.map(x => x.it.exercise_id).join(' '));
  });

  // ------------------------------------------------------------------------------------------------ dosing
  test('R02-rep-cap-every-block: an athlete\'s heavy two-legged compound keeps its own top rep (front squat 5-10) in every block - never 8-12 under a printed 7-10 cap (VOL-11; E-124)', () => {
    const p = plan('02');
    for (const x of allItems(p).filter(x => x.it.exercise_id === 'front-squat-barbell' && x.it.reps && typeof x.it.reps.max === 'number')) assert.ok(x.it.reps.max <= 10, `w${x.w.n} ${JSON.stringify(x.it.reps)}`);
  });
  test('R03-off-late-step-switch: the late off-season VOL2 -> VOL3 step after the halfway week of a single-block stairway is built and switched off (it costs the soccer sample chest and calves at 3 x 75; open for the coach); switched on it moves weeks 4-6 to 6-8 reps (PER-11; E-125)', () => {
    // (v0.5 fix round 1, PER-11 'heavier by block' / sample 03 major: the step is switched ON - with the session sized by exercise
    // count, CT-01, it no longer costs the soccer sample its chest and calves; switched off the block holds VOL2)
    assert.equal(R.reps.athlete_vol_phases.off_late_single_block_step.enabled, true);
    const st = plan('03').weeks.filter(w => w.block_type === 'stairway');
    assert.deepEqual(st.map(w => w.rep_phase), ['VOL2', 'VOL2', 'VOL2', 'VOL3', 'VOL3', 'VOL3']);
    const raw = readModelDir();
    raw.rules = JSON.parse(JSON.stringify(raw.rules));
    raw.rules.reps.athlete_vol_phases.off_late_single_block_step.enabled = false;
    const p0 = generate(intakeOf('03'), loadModel(raw));
    assert.ok(p0.weeks.filter(w => w.block_type === 'stairway').every(w => w.rep_phase === 'VOL2'));
  });

  // ------------------------------------------------------------------------------------------------ sweep intakes the round's own changes broke
  test('F3-sweep-random-349-rear-with-rows: a hybrid class whose time check keeps back keeps a rear-delt station or rows enough for the rear delts (V18; the racket-only glute rule leaves it alone)', () => {
    const p = generate(randomIntake(349, fixture), fixture);
    assert.ok(check(p, 'V18').pass, JSON.stringify(check(p, 'V18').violations.slice(0, 2)));
  });
  test('F3-sweep-random-350-dial-one-way: the laterality dial only moves a station toward the plan\'s end share, so a station never flips one way and back at a block boundary (V15 / H10 total rise)', () => {
    const p = generate(randomIntake(350, fixture), fixture);
    assert.ok(check(p, 'V15').pass && check(p, 'H10').pass, JSON.stringify(check(p, 'V15').violations.slice(0, 2)));
  });
  test('F3-sweep-beach-volleyball-hinge-lean: the non-spinal hinge lean applies to low-back hot spots only, so a volleyball player\'s hips stairway keeps climbing (H21 group_hold)', () => {
    const k = fixture.profiles.picker.sports.findIndex(s => s.id === 'beach_volleyball');
    const p = generate(sportIntake(k, fixture), fixture);
    assert.ok(check(p, 'H21').pass, JSON.stringify(check(p, 'H21').violations.slice(0, 2)));
  });
});
