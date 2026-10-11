// tests/render.test.mjs - engine/render.mjs (CONTRACTS §4.11): EN / ES markdown and text, all views, formatters. Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderPlan, renderBlockView, renderWeek, renderDay, formatReps, formatEffort, formatRest, formatLoad } from '../engine/render.mjs';
import { loadFixtureModel } from './helpers/models.mjs';

const model = loadFixtureModel();
const plan = JSON.parse(fs.readFileSync(new URL('./fixtures/plan-min.json', import.meta.url), 'utf8'));
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');

describe('full view (markdown)', () => {
  const en = renderPlan(plan, model, { lang: 'en' });
  const es = renderPlan(plan, model, { lang: 'es' });

  test('title line is the program name, then the coach instruction block before anything else', () => {
    const lines = en.split('\n');
    assert.equal(lines[0], '# ' + model.t('en', 'program.OT04b.name'));
    const iTitle = en.indexOf('## ' + model.t('en', 'instruction.title'));
    assert.ok(iTitle > 0);
    // F3 (E-121): the stairway intro names the halfway week when the plan has one ('small steps up to week N ...')
    const iIntro = en.indexOf(model.t('en', 'plan.stairway_intro')) >= 0 ? en.indexOf(model.t('en', 'plan.stairway_intro')) : en.indexOf('Your plan climbs like a stairway');
    assert.ok(iIntro > 0 && iTitle < iIntro);
    assert.ok(iTitle < en.indexOf('## ' + model.t('en', 'ui.plan.week', { n: 1 })));
    // B3 (RECHECK 01 minor): a plan with no aerobic session reads the coach's cardio line for sport-led cardio
    // (fix round 2 / F3, E-200: a family with its own Basic Instruction - the CrossFit sheet's A4:A7 lines for the class model - prints
    // those; every other plan the BYOP lines)
    const IKF = model.rules.render && model.rules.render.instruction_keys_by_family;
    const fam = IKF && IKF[plan.meta.family];
    if (fam) for (const k of fam) assert.ok(unesc(en).includes(model.t('en', k)), k);
    else {
      for (const k of ['instruction.1', 'instruction.3', 'instruction.4', 'instruction.5']) assert.ok(unesc(en).includes(model.t('en', k)), k);
      assert.ok(unesc(en).includes(model.t('en', 'instruction.2')) || unesc(en).includes(model.t('en', 'instruction.2_sport_cardio')));
    }
    // B3 (COACH-R3 R3-GEN-01): the use-at-your-own-risk line with the link to the release sits on top, before the instructions
    const iRisk = en.indexOf(model.t('en', 'ui.plan.own_risk_label'));
    assert.ok(iRisk > 0 && iRisk < iTitle);
    assert.ok(en.includes('](' + model.rules.legal.disclaimer_url.en + ')'));
    assert.ok(es.includes('](' + model.rules.legal.disclaimer_url.es + ')'));
    assert.ok(en.includes(fam ? '> \\*Instead of working to failure' : '> \\*Always leave 1 rep'), 'asterisk ladder kept literally (escaped for markdown)');
    assert.ok(en.includes('> \\*\\*\\*\\*\\*If you have any questions'));
    // F3 (E-119): a plan whose last week carries no intensifier reads the 'ends at 1 in the last week' line instead
    // (fix round 2 / F3: the week-1 tip inside the line names the plan's own first effort, {rir})
    const rir0 = (plan.weeks.find(w => w.block_type === 'stairway' && w.planned_rir) || { planned_rir: { min: 3, max: 3 } }).planned_rir;
    const rirArg = { rir: rir0.min === rir0.max ? String(rir0.min) : rir0.min + '-' + rir0.max };
    assert.ok(unesc(en).includes(model.t('en', 'effort.how_hard', rirArg)) || unesc(en).includes(model.t('en', 'effort.how_hard_no_int', rirArg)));
    assert.ok(unesc(en).includes(model.t('en', 'effort.olympic')), 'Olympic note when the plan has Olympic lifts');
  });

  test('header lines: level, plan type, start date, release stamp', () => {
    assert.ok(en.includes('**' + model.t('en', 'ui.plan.level') + ':** Intermediate (L2): 2 years of consistent training'));
    // (fix round 2 / F3: client copy prints dates in words - '12 Oct 2026' - never the machine format)
    assert.ok(en.includes('12 Oct 2026') && !/Start date:\*\* 2026-10-12/.test(en));
    // F3 (E-115, COACH-R3 R3-GEN-01: one tick for own risk + terms + release): one flat stamp line, no nested brackets
    const who = 'release.who.' + String(plan.release_stamp.version).replace(/^release\./, '');
    assert.ok(en.includes(model.t('en', 'ui.plan.release_stamp_flat', { who: model.t('en', who), lang: model.t('en', 'intake.lang.opt.en') })));
    assert.ok(!en.includes('release.client'));
  });

  test('stairway table (B3 macro view: week, level, effort, sets), phases, exercise blocks, tests with reminder dates', () => {
    assert.ok(en.includes('| ' + ['Week', 'Level', 'Effort', 'Sets'].join(' | ') + ' |'));
    assert.match(en, /\| 1 · test \| 2\.0 ▮▮ \| 3 in the tank \| \d+ \|/);
    assert.match(en, /\| 3 · test \| 11\.0 ▮{11} \| 1 in the tank/);
    assert.ok(en.includes(model.t('en', 'ui.plan.phase_span_one', { from: 1, phase: model.t('en', 'plan.phase.ACCLIMATION') })) || en.includes('weeks 1-'));
    assert.ok(en.includes(model.t('en', 'plan.exercise_block', { n: 1, from: 1, to: 3 })));
    assert.ok(en.includes(model.t('en', 'ui.plan.reminder', { dates: '2026-10-12, 2026-10-19, 2026-10-25' })));
  });

  test('weekly sets per muscle group table (first / middle / last stairway week) with the coach counting note (B3: FOCUS groups, R3-SES-01)', () => {
    assert.ok(en.includes('## ' + model.t('en', 'ui.plan.weekly_sets_groups')));
    assert.ok(unesc(en).includes(model.t('en', 'ui.plan.weekly_sets_groups_note')));
    // v0.5 fixture (2 training days, R4-SES-03): the big groups sit at 6-8 weekly sets; chest climbs 6 -> 8 to its final sets (CX-01)
    assert.match(en, /\| Quads \| 8 \| 8 \| 8 \|/);
    assert.match(en, /\| Chest \| 6 \| 7 \| 8 \|/);
    assert.match(en, /\| \*\*Total\*\* \| \*\*42\*\* \| \*\*44\*\* \| \*\*46\*\* \|/);
  });

  test('phone-friendly day cards: sets x reps, "leave N in the tank (N RIR)", rest, cue, swaps, video link', () => {
    assert.ok(en.includes('### Monday · ' + model.t('en', 'day.athletic.2.A')));
    // engine 0.5.0 / V3 (converted; DECISIONS G): the day's time is an average range, information only (COACH-CT CT-01, COACH-R4
    // R4-SES-01 'an estimate like about 60-75 minutes'): 58 min -> 'about 50-65 min', never the bare number as if it were a limit
    assert.ok(en.includes('_' + model.t('en', 'ui.plan.est_line', { low: 50, high: 65 }) + '_'));
    assert.ok(!en.includes('_' + model.t('en', 'ui.plan.est_minutes', { min: 58 }) + '_'));
    const squat = en.split('\n').find(l => l.includes('**' + model.t('en', model.ex('front-squat-barbell').name_key) + '**'));
    assert.ok(squat, 'front squat line');
    assert.match(squat, /— 2 × 12 to 15 Reps · leave 3 in the tank \(3 RIR, RPE 7\) · rest after the pair · SUPERSET W\//);
    assert.ok(en.includes('leave 1 in the tank (1 RIR, RPE 9)'), 'last week drifts to 1 RIR');
    assert.ok(en.includes('- ' + model.t('en', 'ui.plan.swaps') + ': '));
    // engine 0.5.0 / V2 (converted; DECISIONS G): no third-party video link (COACH-R4 R4-LIB-05) - every exercise prints the YouTube
    // search built from its name and the exact name to copy; the swaps say what they keep and lose (R4-LIB-04)
    assert.ok(!/youtu\.be\/|youtube\.com\/watch/.test(en), 'no third-party video link');
    assert.ok(en.includes('[Watch how](https://www.youtube.com/results?search_query='), 'YouTube search link');
    assert.ok(en.includes('Name to copy into YouTube: `' + model.t('en', model.ex('front-squat-barbell').name_key) + '`'), 'the exact name to copy');
    assert.match(en, /Swap for: [^\n]*\(keeps [^;()]+; loses [^()]+\)/);
    assert.ok(en.includes('**Test week:** 3 or 5 rep max'));
    assert.ok(en.includes('**' + model.t('en', 'block.core') + '**'));
  });

  test('footer: model / engine stamp, disclaimer, video note', () => {
    assert.ok(en.includes(model.t('en', 'ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version })));
    assert.ok(en.includes(model.t('en', 'ui.disclaimer')));
    assert.ok(unesc(en).trim().endsWith(model.t('en', 'video.note')));
  });

  test('Spanish twin: Spanish instruction block and effort wording', () => {
    assert.ok(es.startsWith('# ' + model.t('es', 'program.OT04b.name')));
    assert.ok(es.includes('## ' + model.t('es', 'instruction.title')));
    assert.ok(unesc(es).includes(model.t('es', 'instruction.1')));
    assert.ok(es.includes(model.t('es', 'effort.rir_single', { n: 3, rpe: 7 })));
    assert.ok(es.includes(model.t('es', 'weekday.Mon')));
    assert.ok(!es.includes('### Monday'));
  });

  test('no undefined, no unfilled placeholder, no raw i18n key', () => {
    for (const s of [en, es]) {
      assert.ok(!s.includes('undefined'));
      assert.ok(!/\{[a-z_]+\}/.test(s), s.match(/\{[a-z_]+\}/));
      for (const tok of s.match(/\b(?:why|note|exercise|warning|changes|ui|plan|slot|block|effort|reps|rest|load|tests|day|profile|program|instruction|locked|check|muscle|group|weekday|level|season|conditioning|plyo|detail|warmup)\.[A-Za-z0-9_.\-/]+/g) || []) {
        assert.ok(!model.has('en', tok.replace(/[.)]+$/, '')), 'raw key in output: ' + tok);
      }
    }
  });

  test('tables are at most 4 columns (block view: 3)', () => {
    for (const l of en.split('\n').filter(x => x.trim().startsWith('|'))) assert.ok((l.match(/\|/g) || []).length <= 5, l);
  });

  test('never renders template-internal notes (EN-only hints)', () => {
    const t = model.template('athletic', 2);
    const notes = Object.values(t.day_types).flatMap(dt => dt.stations.map(s => s.note).filter(Boolean)).filter(n => n.length > 12);
    for (const n of notes) assert.ok(!en.includes(n), n);
  });
});

describe('views and formats', () => {
  test('block view: one 3-column table per day with sets per week and reps first -> last', () => {
    const b = renderBlockView(plan, 1, model, { lang: 'en' });
    assert.ok(b.startsWith('## ' + model.t('en', 'ui.plan.view.block')));
    assert.ok(b.includes('### Monday · '));
    assert.ok(b.includes('| Exercise | Sets | Reps |'));
    assert.ok(b.includes('| 3 3 4 |'), 'the work lift gains a set in week 3');
    assert.match(b, /\*\*Level:\*\* 2\.0 · 5\.4 · 11\.0/);
  });

  test('week, day and text views', () => {
    const w = renderWeek(plan, 2, model, { lang: 'en' });
    assert.ok(w.startsWith('## Week 2 — '));
    assert.ok(!w.includes('## Week 1'));
    const d = renderDay(plan, 1, 'Thu', model, { lang: 'es' });
    assert.ok(d.startsWith('### ' + model.t('es', 'weekday.Thu')));
    assert.equal(renderDay(plan, 1, 'Sun', model, {}), '\n');
    const views = renderPlan(plan, model, { view: 'week', weeks: [3] });
    assert.ok(views.includes('## Week 3') && !views.includes('## Week 1'));
    assert.ok(renderPlan(plan, model, { view: 'block' }).includes('| Exercise | Sets | Reps |'));
    assert.ok(renderPlan(plan, model, { view: 'day', weeks: [1] }).includes('### Thursday'));
    const txt = renderPlan(plan, model, { format: 'text' });
    assert.ok(!/^#|\|---/m.test(txt) && !txt.includes('**Level:**') && !txt.includes('| Quads |'));
    assert.ok(txt.includes('Level: Intermediate (L2)'));
    assert.ok(txt.includes('*Always leave 1 rep in the tank'), 'text keeps the asterisk ladder, unescaped');
    assert.ok(txt.includes('Watch how: https://www.youtube.com/results?search_query='));
  });

  test('show_why adds the reasons; show_swaps:false hides swaps', () => {
    assert.ok(renderPlan(plan, model, { show_why: true }).includes('_Why:_ Heavy squat and heavy deadlift on different days [R2-SES-01]'));
    assert.ok(!renderPlan(plan, model, { show_swaps: false }).includes('Swap for:'));
  });

  test('refer and invalid plans render through i18n only', () => {
    const refer = renderPlan({ status: 'refer', refer: { reasons: ['refer.reason.heart'] }, meta: {} }, model, { lang: 'es' });
    assert.ok(refer.startsWith('# ' + model.t('es', 'ui.plan.refer_title')));
    assert.ok(refer.includes(model.t('es', 'refer.reason.heart')));
    const invalid = renderPlan({ status: 'invalid', errors: [{ code: 'release_missing', key: 'warning.release_missing' }], meta: {} }, model, { lang: 'en' });
    // engine 0.5.0 / V3 (converted; DECISIONS G): the gate's own words (COACH-R4 R4-SCP-02 'they need to click it before the plan shows')
    assert.ok(invalid.includes(model.t('en', 'warning.release_missing')) && /No plan is built without it/.test(invalid));
  });
});

describe('formatters', () => {
  const R = (r) => formatReps(r, model, 'en');
  test('formatReps', () => {
    assert.equal(R({ type: 'range', min: 8, max: 12, bracket: 'b8_12' }), '8 to 12 Reps');
    assert.equal(R({ type: 'range', min: 10, max: 15 }), '10 to 15 Reps');
    assert.equal(R({ type: 'per_side', min: 10, max: 10 }), '10/10');
    assert.equal(R({ type: 'per_side', min: 6, max: 8 }), '6 to 8 per side');
    assert.equal(R([{ type: 'fixed', value: 12 }, { type: 'fixed', value: 10 }, { type: 'fixed', value: 8 }, { type: 'fixed', value: 20 }]), '12/10/8 -20');
    assert.equal(R({ type: 'max' }), 'MAX');
    assert.equal(R({ type: 'rounds_work', rounds: 3, work_s: 40 }), '3 rounds x 40 s');
    assert.equal(R({ type: 'contacts', value: 6 }), '6 contacts');
    assert.equal(R({ type: 'minutes', min: 30, max: 40 }), '30-40 min');
    assert.equal(R({ type: 'test', test: 'rm_3_or_5' }), '3 or 5 rep max');
    assert.equal(R(null), '');
  });
  test('formatEffort: "leave N in the tank (N RIR)", MAX / MYO, intent, power', () => {
    assert.equal(formatEffort({ type: 'rir', min: 2, max: 2, rpe_min: 8, rpe_max: 8, last_set: null }, model, 'en'), 'leave 2 in the tank (2 RIR, RPE 8)');
    assert.equal(formatEffort({ type: 'rir', min: 1, max: 2 }, model, 'en'), 'leave 1-2 in the tank (1-2 RIR, RPE 8-9)');
    assert.equal(formatEffort({ type: 'rir', min: 1, max: 1, last_set: 'max' }, model, 'en'), 'leave 1 in the tank (1 RIR, RPE 9) · last set MAX (technical failure)');
    assert.equal(formatEffort({ type: 'power', key: 'effort.olympic_power' }, model, 'en'), model.t('en', 'effort.olympic_power'));
    assert.equal(formatEffort({ type: 'role', role: 'survival' }, model, 'es'), model.t('es', 'effort.done'));
    assert.equal(formatEffort(null, model, 'en'), '');
  });
  test('formatRest and formatLoad', () => {
    assert.equal(formatRest({ type: 'seconds', min: 60, max: 90 }, model, 'en'), '60-90 s rest');
    assert.equal(formatRest({ type: 'seconds', min: 180, max: 360 }, model, 'en'), '3-6 min rest');
    assert.equal(formatRest({ type: 'after_pair' }, model, 'en'), 'rest after the pair');
    assert.equal(formatRest({ type: 'work_rest', min: 5, max: 10 }, model, 'en'), 'work:rest 1:5 to 1:10');
    assert.equal(formatLoad({ type: 'medball_lb', min: 6, max: 8 }, model, 'en'), '6-8 lb ball');
    assert.equal(formatLoad({ type: 'medball_lb', min: 10, max: 20, wall_ball: true }, model, 'en'), 'wall ball 10-20 lb (never over 20 lb)');
    assert.equal(formatLoad({ type: 'bw_pct', min: 10, max: 20 }, model, 'en'), '10-20% of body weight');
    assert.equal(formatLoad({ type: 'week1_tip' }, model, 'es'), model.t('es', 'load.week1_tip'));
  });
});
