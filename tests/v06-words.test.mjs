// Blaze Camp engine 0.6 - work package "words": what the plan prints, in English and Spanish. One test per fixed review item, named
// with the coach answer it reads and the round-4 coach-eye review id (reviews/coach-eye-r4/0N-*.md, M = major, m = minor). Every plan
// here is generated in the test - no stored plan is read. Layer: tools/fixture/v06-words.mjs; decisions: engine/DECISIONS.md G-160 ...
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan, renderWeek, renderDay } from '../engine/render.mjs';
import { changesText, stairText, circuitStory } from '../engine/explain.mjs';
import { amendRulesW6, UI_W6, ES_PRIORITY_W6 } from '../tools/fixture/v06-words.mjs';

const clone = (x) => JSON.parse(JSON.stringify(x));
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const SAMPLES = Object.keys(NAMES);
const compiled = loadCompiledModel();
const model = compiled || loadFixtureModel();
const raw = compiled ? readModelDir() : readFixtureRaw();
const t = (lang, k, a) => model.t(lang, k, a);
const unesc = (s) => s.replace(/\\([\\*_`])/g, '$1');
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const mds = new Map();
const mdOf = (n, lang = 'en') => { const k = n + lang; if (!mds.has(k)) mds.set(k, unesc(renderPlan(planOf(n), model, { lang }))); return mds.get(k); };
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const head = (k, lang = 'en') => t(lang, k).split('{')[0];

describe('v0.6 words - the amendment layer', () => {
  it('amendRulesW6 does not change its input and is idempotent on the built model; both builds carry it', () => {
    const fx = readFixtureRaw();
    const r0 = clone(fx.rules);
    const r1 = amendRulesW6(fx.rules);
    assert.deepEqual(fx.rules, r0);
    assert.deepEqual(r1, fx.rules, 'the fixture already carries the layer');
    assert.deepEqual(raw.rules.render.v6, fx.rules.render.v6);
    assert.deepEqual(raw.rules.volume.pain.x6, fx.rules.volume.pain.x6);
  });
  it('R2-GEN-08 / H14: every new line has EN and ES with the same placeholders, and the machine-written Spanish waits for the coach in es_review.priority_review', () => {
    const PH = (s) => [...String(s).matchAll(/\{([a-z_]+)\}/g)].map(m => m[1]).sort().join(',');
    for (const [k, [en, es]] of Object.entries(UI_W6)) {
      assert.equal(raw.i18n.en[k], en, k); assert.equal(raw.i18n.es[k], es, k);
      assert.equal(PH(en), PH(es), `placeholders ${k}`);
    }
    if (compiled) for (const k of ES_PRIORITY_W6) assert.ok(raw.i18n.es_review.priority_review.includes(k), k);
  });
});

describe('05 M2 (R4-PRG-03, R4-PRG-02, CX-02): circuit progression from the real weeks', () => {
  it('R4-PRG-03 rev05-M2: "the rounds stay" never prints when the rounds change; the line names the extra round and the time step', () => {
    const p = planOf('05');
    const rounds = p.weeks.map(w => w.circuit && w.circuit.rounds);
    assert.ok(new Set(rounds).size > 1, 'the sample adds a round');
    for (const lang of ['en', 'es']) {
      const out = mdOf('05', lang);
      assert.ok(!out.includes(head('circuit.rounds_stay', lang)), `${lang}: no 'rounds stay'`);
      for (const k of ['ui.plan.progress_circuit', 'ui.plan.circuit_climb_note']) assert.ok(!out.includes(t(lang, k)), `${lang}: the old line ${k}`);
      const cs = circuitStory(p, model, lang);
      assert.ok(out.includes(cs.rounds) && out.includes(cs.when), `${lang}: ${cs.rounds} / ${cs.when}`);
    }
    assert.equal(circuitStory(p, model, 'en').rounds, '4 rounds, then 5 from week 7');
    assert.equal(circuitStory(p, model, 'en').when, 'a step every 2 weeks');
    // a plan whose rounds do not change says so
    const q = clone(p);
    for (const w of q.weeks) if (w.circuit) w.circuit.rounds = 4;
    assert.equal(circuitStory(q, model, 'en').rounds, t('en', 'circuit.rounds_stay', { n: 4 }));
    assert.ok(unesc(renderPlan(q, model, { lang: 'en' })).includes(t('en', 'circuit.rounds_stay', { n: 4 })));
  });
  it('R4-PRG-02 rev05-M2: the week that adds a round says so in "What changes" (EN and ES), and the block table reads first week -> last week', () => {
    const p = planOf('05');
    const w7 = p.weeks.find(w => w.n > 1 && w.circuit.rounds > p.weeks.find(x => x.n === w.n - 1).circuit.rounds);
    for (const lang of ['en', 'es']) {
      const lines = changesText(p, w7.n, model, lang);
      assert.ok(lines.includes(t(lang, 'changes.circuit_rounds_up', { from: w7.circuit.rounds - 1, to: w7.circuit.rounds })), lang + ': ' + lines.join(' | '));
    }
    const first = p.weeks[0].circuit, last = p.weeks[p.weeks.length - 1].circuit;
    const blk = unesc(renderPlan(p, model, { lang: 'en', view: 'block' }));
    assert.ok(blk.includes(`${t('en', 'reps.rounds_work', first)} → ${t('en', 'reps.rounds_work', last)} |`), 'first -> last');
  });
});

describe('06 M3 (PRG-07, R4-PRG-03): the pyramid written out', () => {
  it('PRG-07 rev06-M3: per-set reps read "12, 10, 8, then a light back-off set of 20" with the coach note, never raw, never under a single-range rep note', () => {
    const p = planOf('06');
    const pyr = allItems(p).filter(x => x.it.set_reps);
    assert.ok(pyr.length > 0);
    for (const { it } of pyr) {
      assert.ok(!(it.notes || []).some(n => n.key === 'note.rep_cap'), 'no rep_cap note in the data');
      assert.ok((it.notes || []).some(n => n.key === 'note.pyramid_backoff'), 'the pyramid note');
    }
    for (const lang of ['en', 'es']) {
      const out = mdOf('06', lang);
      assert.ok(!/\d+\/\d+\/\d+( -|\/)\d+/.test(out), `${lang}: a raw 12/10/8 -20`);
      assert.ok(out.includes(t(lang, 'note.pyramid_backoff')));
    }
    const { w, d, it } = pyr[0];
    const card = unesc(renderDay(p, w.n, d.weekday, model, { lang: 'en' }));
    const list = it.set_reps.slice(0, -1).map(r => r.value).join(', ');
    assert.ok(card.includes(t('en', 'reps.pyramid_sets', { sets: it.sets, list, last: it.set_reps[it.set_reps.length - 1].value })), card.slice(0, 400));
  });
});

describe('08 M3 (VOL-03, R3-ATH-02): the pain-free depth cue by exercise type', () => {
  it('VOL-03 rev08-M3: a step-up gets the low step (6-12 in / 15-30 cm), a machine its range, nothing gets "set the stops or use a box"', () => {
    const p = planOf('08');
    const marked = allItems(p).filter(x => (x.it.notes || []).some(n => /^note\.pain_free_depth/.test(n.key)));
    assert.ok(marked.length > 0);
    for (const { it } of marked) {
      const k = it.notes.find(n => /^note\.pain_free_depth/.test(n.key)).key;
      const e = model.ex(it.exercise_id);
      if (/step-?up/.test(e.id)) assert.equal(k, 'note.pain_free_depth_step', e.id);
      else if (e.equipment.machine || e.tags.includes('machine')) assert.equal(k, 'note.pain_free_depth_machine', e.id);
      assert.notEqual(k, 'note.pain_free_depth', e.id);
    }
    assert.ok(marked.some(x => /step-?up/.test(x.it.exercise_id)));
    assert.ok(mdOf('08', 'en').includes('6-12 in (15-30 cm)') && mdOf('08', 'es').includes('15-30 cm (6-12 in)'));
    for (const lang of ['en', 'es']) assert.ok(!mdOf('08', lang).includes(t(lang, 'note.pain_free_depth')), lang);
    // the rule data: first match wins, step before machine before squat / lunge
    assert.deepEqual(model.rules.volume.pain.x6.depth_by_pattern.map(r => r.key), ['note.pain_free_depth_step', 'note.pain_free_depth_machine', 'note.pain_free_depth_squat', 'note.pain_free_depth_lunge']);
  });
});

describe('"What changes" names the exercises and the real set differences (04 M2, 07 m8; R4-PRG-03)', () => {
  it('R4-PRG-03 rev04-M2: a slot that gains 2 sets in a week says +2 with from -> to (DB floor press 2 -> 4), and every set line matches the real sets', () => {
    // (converted, G-192: sample 04's Saturday floor press is gone - a big group takes no optional-day bonus, G-102 - and an exercise
    // takes one step a week, G-109; the 2-set line is read on a copy of the plan whose slot gains 2 sets in a working week)
    const p = clone(planOf('04'));
    const w = p.weeks.find(x => !x.test && !p.weeks.find(y => y.n === x.n - 1 && y.test) && x.n > 1 && (x.changes || []).some(c => c.key === 'changes.set_added'));
    const c = w.changes.find(x => x.key === 'changes.set_added');
    const it = w.days.flatMap(d => d.blocks.flatMap(b => b.items)).find(x => x.slot_id === c.args.slot_id && x.role !== 'test');
    const before = p.weeks.find(y => y.n === w.n - 1).days.flatMap(d => d.blocks.flatMap(b => b.items)).find(x => x.slot_id === c.args.slot_id && x.role !== 'test').sets;
    it.sets = before + 2;
    const all = changesText(p, w.n, model, 'en');
    const name = t('en', model.ex(it.exercise_id).name_key);
    assert.ok(all.includes(`+2 sets on ${name} (${t('en', 'weekday.' + c.args.day)}): ${before} → ${before + 2} sets`), all.join('\n'));
    assert.ok(!planOf('04').weeks.some(x => x.days.some(d => d.weekday === 'Sat' && d.blocks.some(b => b.items.some(i => i.origin === 'bonus' && i.group === 'chest' && i.sets)))));
    for (const n of SAMPLES) {
      const q = planOf(n);
      for (const w of q.weeks) {
        const pw = q.weeks.find(x => x.n === w.n - 1);
        for (const l of changesText(q, w.n, model, 'en')) {
          const m = /^\+(\d+) sets? on .*: (\d+) → (\d+) sets$/.exec(l);
          if (m) assert.equal(Number(m[3]) - Number(m[2]), Number(m[1]), `${n} w${w.n}: ${l}`);
        }
        // no slot is reported twice in one week
        const slots = (w.changes || []).filter(c => ['changes.set_added', 'changes.sets_added_n'].includes(c.key)).map(c => c.args.slot_id);
        const lines = changesText(q, w.n, model, 'en').filter(l => /^\+\d+ sets? on /.test(l));
        assert.ok(lines.length <= new Set(slots).size, `${n} w${w.n}`);
        void pw;
      }
    }
  });
  it('R4-PRG-03 rev07-m8: a new exercise block names what changes, day by day (weeks 5 and 9 of sample 07)', () => {
    const p = planOf('07');
    for (const n of [5, 9]) {
      const lines = changesText(p, n, model, 'en');
      const days = lines.filter(l => /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday): .+ → .+/.test(l));
      assert.ok(days.length >= 2, `week ${n}: ${lines.join(' | ')}`);
    }
    // (converted, G-193: a block change keeps the one-arm row's laterality and support, G-134, so week 9's Tuesday no longer turns a
    // row into a seal row; the Tuesday line names its own changes)
    assert.ok(changesText(p, 9, model, 'en').some(l => l.startsWith('Tuesday: ') && l.includes(' → ')));
    assert.ok(changesText(p, 9, model, 'es').some(l => l.startsWith('Martes: ')));
  });
});

describe('printed-copy minors of the round-4 reviews', () => {
  it('R2-GEN-08 rev01-m9 / rev05-m11: no "1 reps", "1 sets", "1 repeticiones", "1 series" anywhere in the 8 samples, EN and ES', () => {
    for (const n of SAMPLES) for (const lang of ['en', 'es']) {
      const m = /\b1 (reps|sets|repeticiones|series|rounds|rondas)\b/.exec(mdOf(n, lang));
      assert.equal(m, null, `${n} ${lang}: ${m && mdOf(n, lang).slice(m.index - 60, m.index + 40)}`);
    }
    // the progression example is a real working week's lift with 2+ sets (01: not the test week's 1 back-off set)
    assert.match(mdOf('01'), /Example from your plan: [^,]+, [2-9] sets of/);
  });
  it('GEN-08 / H02 rev02-m9 rev06-m11 rev08-m9: the top of the week-level scale is "your hardest week", never "a little past your limits"', () => {
    for (const n of SAMPLES) for (const lang of ['en', 'es']) assert.ok(!/past your limits|más allá de tus límites/.test(mdOf(n, lang)), n + lang);
    assert.equal(stairText(planOf('06'), 1, model, 'en'), t('en', 'plan.stair_level', { level: '2' }));
    assert.match(t('en', 'plan.stair_level'), /11 = your hardest week/);
  });
  it('rev02-m14 / rev08-m4: "trained through your sport work" only with sport practice days; otherwise "your compound lifts"', () => {
    // (converted, G-202 / CH5-02: 01's and 02's arms hold the slot-5 exercise and are said as held, so the two wordings are read on copies
    // whose arms are credit-only)
    const withCredit = (n) => { const q = clone(planOf(n)); q.meta.warnings = q.meta.warnings.filter(w => w.code !== 'slot_held_groups'); q.meta.warnings.push({ code: 'credit_only_groups', key: 'warning.credit_only_groups', args: { group: ['biceps', 'triceps'] } }); return unesc(renderPlan(q, model, { lang: 'en' })); };
    { const o2 = withCredit('02'); assert.ok(o2.includes(head('warning.credit_only_groups_lifts')) && !o2.includes(head('warning.credit_only_groups')), '02: 0 practice days'); }
    // (converted, COACH-CH5 CH5-02 / G-198: the recreational player's A / B days now train the arms in slot 5, so 08 has no credit-only
    // group left; the wording is read on a copy of 08 whose arms are credit-only again)
    { const q = clone(planOf('08')); q.meta.warnings.push({ code: 'credit_only_groups', key: 'warning.credit_only_groups', args: { group: ['biceps'] } });
      const out = unesc(renderPlan(q, model, { lang: 'en' }));
      assert.ok(out.includes(head('warning.credit_only_groups_lifts')), '08: a recreational player'); }
    assert.ok(withCredit('01').includes(head('warning.credit_only_groups')), '01: 6 pool days a week');
  });
  it('R4-SES-02 rev02-m8 rev03-m12 rev06-m10: the header prints the real exercise count of the training days', () => {
    for (const n of SAMPLES) {
      const c = planOf(n).weeks.flatMap(w => w.days.filter(d => d.kind === 'main').map(d => d.exercise_count));
      const lo = Math.min(...c), hi = Math.max(...c);
      const want = lo === hi ? t('en', 'ui.plan.session_size', { n: lo }) : t('en', 'ui.plan.session_size_range', { low: lo, high: hi });
      assert.ok(mdOf(n).includes(want), `${n}: ${want}`);
    }
    // (converted, COACH-CH5 CH5-03 / G-199: sample 06's Friday takes the chest's bonus fly, so every training day holds 8; converted again in
    // the round-7 fix round, G-217: the fly opens with the last exercise block, the week it is needed, so the training days hold 7-8)
    assert.ok(mdOf('06').includes('about 7-8 exercises a session'));
  });
  it('VOL-03 rev08-m2: the pain line promises a note "on the lift" only when a lift carries one', () => {
    // (converted, G-194: sample 08's power slot now takes a KB swing "instead of Mid-Hang Clean Pull, to protect your knee" - the safe
    // power slot, G-133 - so its plan carries a lift note and says so; the line without it is read on a copy with the notes removed)
    const p = planOf('08');
    const PN = ['note.pain_swap', 'note.pain_instead_of'];
    assert.ok(allItems(p).some(x => (x.it.notes || []).some(n => PN.includes(n.key))));
    assert.ok(mdOf('08').includes('Instead of Mid-Hang Clean Pull, to protect your knee.') && mdOf('08').includes('says so on the lift'));
    const q = clone(p);
    for (const x of allItems(q)) x.it.notes = (x.it.notes || []).filter(n => !PN.includes(n.key));
    const mq = unesc(renderPlan(q, model, { lang: 'en' }));
    assert.ok(mq.includes(head('warning.pain_plan_no_lift')) && !mq.includes('says so on the lift'));
  });
  it('CX-04 rev04-m11: a class member reads that the plan\'s WODs replace the box WOD; a competitor keeps his line', () => {
    assert.ok(mdOf('04').includes(t('en', 'instruction.cf.3_class').replace(/\*/g, '')) || mdOf('04').includes(t('en', 'instruction.cf.3_class')));
    assert.ok(!mdOf('04').includes('WODs will be prescribed by your box'));
    const q = clone(planOf('04')); q.meta.profile.competitive = 'competitive';
    assert.ok(unesc(renderPlan(q, model, { lang: 'en' })).includes('WODs will be prescribed by your box'));
  });
  it('R4-LIB-05 rev03-m12 rev07-m9: no "Watch how" search on an aerobic colour session; an Orange session on a machine reads steady (rev06-m12)', () => {
    for (const n of ['03', '06', '07']) {
      const out = mdOf(n);
      assert.ok(!/search_query=[^)]*(Orange|Blue|Green|Naranja|Azul|Verde)/.test(out), n);
      assert.ok(!/search_query=Aerobic/.test(out), n);
    }
    assert.ok(!/rower\*\* — \d+ min · 11 min steady/.test(mdOf('06')));
    assert.ok(mdOf('06').includes('rower** — 30 min · ' + t('en', 'aerobic.pattern.steady')));
  });
  it('R4-PRG-02 rev05-m10: one "jumps more than usual" line per week, the groups listed (sample 05: one more round for every group)', () => {
    for (const lang of ['en', 'es']) {
      const wk = unesc(renderWeek(planOf('05'), 7, model, { lang }));
      const hits = wk.split('\n').filter(l => l.includes(t(lang, 'ui.plan.accel_week_groups').split('(')[0].trim()));
      assert.equal(hits.length, 1, `${lang}: ${hits.join(' | ')}`);
      assert.ok(hits[0].includes(head('ui.plan.accel_week_all_round', lang).split('(')[0].trim()));
    }
    // (converted, G-195: sample 03 no longer jumps in week 6 - one step an exercise a week, G-109 - so the Spanish group names and the
    // one line for groups with different steps are read on a copy of week 6 that carries two fast groups)
    const q = clone(planOf('03'));
    q.weeks.find(w => w.n === 6).acceleration = [{ group: 'quads', from: 10, to: 12, pct: 20 }, { group: 'hips', from: 10, to: 12.5, pct: 25 }];
    const w6 = unesc(renderWeek(q, 6, model, { lang: 'es' })).split('\n').filter(l => l.includes(t('es', 'ui.plan.accel_week_groups').split('(')[0].trim()));
    assert.equal(w6.length, 1, w6.join(' | '));
    assert.ok(w6[0].includes('20-25 %') && w6[0].includes('cadera (glúteos + isquiotibiales)'), 'Spanish group names in lower case mid-sentence: ' + w6[0]);
  });
  it('rev05-m12 (STATUS v0.5 printed copy): the weekly tables print whole sets; the plan JSON keeps the quarter credits', () => {
    const p = planOf('05');
    assert.ok(p.weeks.some(w => Object.values(w.weekly_sets_by_group || {}).some(v => v % 1 !== 0)), 'JSON exact');
    for (const n of SAMPLES) for (const view of ['full', 'block']) {
      const out = unesc(renderPlan(planOf(n), model, { lang: 'en', view }));
      const rows = out.split('\n').filter(l => l.startsWith('| ') && model.rules.muscles.groups.order.some(g => l.startsWith('| ' + t('en', 'group.' + g) + ' |')));
      for (const r of rows) assert.ok(!/\| [\d ·]*\d+\.\d+/.test(r), `${n} ${view}: ${r}`);
    }
    assert.ok(mdOf('05').includes(t('en', 'ui.plan.sets_rounded')));
  });
  it('GEN-01 rev05-m13 rev08-m9: no athlete jargon for the general population (no "Athletic work this week" in a bootcamp, no plyo share or stage for a recreational player)', () => {
    assert.ok(!mdOf('05').includes(t('en', 'ui.plan.athletic_budget')) && !mdOf('05', 'es').includes(t('es', 'ui.plan.athletic_budget')));
    assert.ok(!mdOf('05').includes('(jumps, throws and speed)') && mdOf('05').includes('(' + t('en', 'block.short.circuit_station') + ')'));
    const a8 = mdOf('08').split('\n').filter(l => l.startsWith('**' + t('en', 'ui.plan.athletic_budget')));
    assert.ok(a8.length > 0 && a8.every(l => !l.includes('Plyo share') && !l.includes('Receive-Create')));
    assert.ok(mdOf('02').split('\n').some(l => l.startsWith('**' + t('en', 'ui.plan.athletic_budget')) && l.includes('Receive-Create')), 'a competitive athlete keeps them');
  });
  it('R2-GEN-08 rev08-m14 rev05-m11: Spanish articles, lists and lower-case groups mid-sentence; equipment options joined with "or"', () => {
    const es = mdOf('08', 'es');
    assert.ok(es.includes('dolor en la rodilla') && !es.includes('dolor en rodilla'));
    assert.ok(es.includes('mantiene cuádriceps'));
    assert.ok(es.includes('Las semanas 11 y 12'));
    assert.ok(mdOf('08').includes('Weeks 11 and 12'));
    assert.ok(mdOf('05').includes('pull-up bar or suspension trainer (TRX) would add'));
    assert.ok(mdOf('05', 'es').includes('barra de dominadas (pull-up bar) o entrenador de suspensión (TRX) agregaría'));
  });
  it('rev08-m9: one intensifier day reads in the singular; rev08-m8: the cardio bridge names the optional day it sits on', () => {
    const out = mdOf('08');
    // (converted, COACH-CH5 CH5-02 / G-198: Monday's arm exercise now carries the last week's MYO set too, so 08 names two days; the
    // singular is read on a copy whose Monday carries none)
    assert.ok(out.includes('each of these days (Monday and Thursday)'));
    { const q = clone(planOf('08')); const last = q.weeks[q.weeks.length - 1];
      for (const d of last.days.filter(x => x.weekday === 'Mon')) for (const b of d.blocks) for (const it of b.items) if (it.effort && it.effort.last_set) delete it.effort.last_set;
      const o1 = unesc(renderPlan(q, model, { lang: 'en' }));
      assert.ok(o1.includes(t('en', 'effort.intensifier_days_one', { days: 'Thursday' })) && !o1.includes('each of these days (Thursday)')); }
    assert.ok(out.includes(t('en', 'instruction.2_bridge_optional', { days: 'Friday' })) && !out.includes(t('en', 'instruction.2_bridge')));
  });
  it('rev03-m12: a one-leg jump says "per leg"; the block heading does not say "Block" twice', () => {
    assert.match(mdOf('03'), /Single-Leg Broad Jump\*\* — \d+ × \d+ contacts per leg/);
    assert.match(mdOf('03', 'es'), /contactos por pierna/);
    for (const n of SAMPLES) assert.ok(!/## Block · Training block|## Bloque · Bloque/.test(mdOf(n) + mdOf(n, 'es')), n);
    assert.ok(mdOf('05').includes('## ' + t('en', 'ui.plan.block_view_title', { label: t('en', planOf('05').shape.training_blocks[0].label_key), weeks: 'Week 1-8' })));
  });
  it('R2-PER-07 rev01-m8: a test week with the same sets says the test takes the top set, not "add a little load" alone', () => {
    const p = planOf('01');
    const last = p.weeks[p.weeks.length - 1];
    assert.ok(last.test && changesText(p, last.n, model, 'en').includes(t('en', 'changes.load_up_test')));
  });
});
