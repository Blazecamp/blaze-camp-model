// tests/v05-words.test.mjs - engine 0.5.0, work package V3 (design/ENGINE_V05_PLAN.md "V3 words and checks").
// One test per new rule, named with its coach answer id:
//   COACH-R4 R4-SCP-01 / R4-SCP-02   the liability gate, the release line on every plan and view (EN / ES)
//   R4-PRG-03                        reps and load as a rule the person applies, never a promised number
//   R4-PRG-02                        the acceleration note
//   COACH-CT CT-01 / R4-SES-01       the average time as information only
//   R4-SES-04                        'easiest to remove' hints, nothing removed
//   "How volume is allocated" 4      the weekly sets per group table, week by week; R2-GEN-02 block / week / day macro views
//   the v0.5 check list              V21, V30 ... V37 on generated plans (and hand-broken copies), no check about minutes
//   R2-GEN-08                        the Spanish of the new lines
//   design/bench                     the scorer 2.0 (no minutes-based metric) on the samples, and its self-test
// Runs on the reference fixture and on the compiled model/ (both must agree: rules.json deep-equals the fixture rules).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample, cloneFixtureRaw, readModelDir } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { assertModel } from '../engine/model.mjs';
import { validateIntake } from '../engine/intake.mjs';
import { validatePlan, CHECK_IDS } from '../engine/validate.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { renderPlan, renderWeek, renderDay, renderBlockView } from '../engine/render.mjs';
import { groupCredits } from '../engine/lines.mjs';
import { UI_V3, REMOVED_V3, ES_REVIEW_V3, CHECKS_V3 } from '../tools/fixture/v05-words.mjs';
import { makeContext, scorePlan, METRICS, SCORER_VERSION } from '../design/bench/score.mjs';
import { UI_P7 } from '../tools/fixture/v07-plain.mjs'; // plain words win over every earlier layer (CH7-09, G-315)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS = [['fixture', loadFixtureModel()]];
try { const c = loadCompiledModel(); if (c) MODELS.push(['model', c]); } catch { /* fixture only */ }
const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n, mut) => { const i = clone(loadSample(n)); if (mut) mut(i); return i; };
const SAMPLES = ['01', '02', '03', '04', '05', '06', '07', '08'];
const unesc = (s) => s.replace(/\\([*_`\\])/g, '$1');
const itemsOf = (day) => (day.blocks || []).flatMap(b => (b.items || []).map(it => ({ ...it, _block: b.kind })));
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const check = (res, id) => res.checks.find(c => c.id === id);
const VIEWS = [['full', {}], ['overview', {}], ['block', {}], ['week', { weeks: [1] }], ['day', { weeks: [1] }], ['week', { weeks: [2], macro: true }], ['day', { weeks: [2], macro: true }]];

for (const [mname, model] of MODELS) {
  const R = model.rules;
  const t = (lang, k, a) => model.t(lang, k, a);
  const plans = new Map();
  const planOf = (n, mut, key) => { const k = n + '|' + (key || ''); if (!plans.has(k)) plans.set(k, generate(sample(n, mut), model)); return plans.get(k); };
  const md = new Map();
  const mdOf = (n, lang = 'en') => { const k = n + '|' + lang; if (!md.has(k)) md.set(k, renderPlan(planOf(n), model, { lang })); return md.get(k); };

  // ------------------------------------------------------------------------------------------------- R4-SCP-01 / R4-SCP-02
  describe(`v0.5 / V3 liability gate and release line (${mname})`, () => {
    it('R4-SCP-02: no plan is generated before the terms and the release are accepted (missing, false, not a boolean); the result says so in EN and ES', () => {
      assert.equal(R.legal.gate.required, true); assert.equal(R.legal.gate.before, 'plan_generated'); assert.equal(R.legal.gate.applies_to, 'everyone');
      const cases = [i => { delete i.release; }, i => { i.release.accepted = false; }, i => { i.release.accepted = 'yes'; }, i => { delete i.release.accepted; }];
      for (const n of ['06', '01', '05']) for (const mut of cases) {
        const p = generate(sample(n, mut), model);
        assert.equal(p.status, 'invalid', n); assert.equal(p.weeks.length, 0); assert.equal(p.release_stamp, null);
        assert.ok(p.errors.some(e => e.code === 'release_missing'), JSON.stringify(p.errors));
        for (const lang of ['en', 'es']) {
          const out = renderPlan(p, model, { lang });
          assert.ok(unesc(out).includes(t(lang, 'warning.release_missing')), lang);
          assert.ok(out.includes(R.legal.disclaimer_url[lang]), 'the link to the full text');
          assert.ok(!/## /.test(out.replace(/^# .*$/m, '')), 'no plan sections without the release');
        }
      }
      assert.match(t('en', 'warning.release_missing'), /No plan is built without it/);
      assert.match(t('es', 'warning.release_missing'), /Sin eso no se crea ningún plan/);
    });

    it('R4-SCP-02: the release comes before everything else - a health flag without the release gives "accept first", not a referral', () => {
      const p = generate(sample('06', i => { i.safety = { ...(i.safety || {}), heart: true }; delete i.release; }), model);
      assert.equal(p.status, 'invalid');
      const v = validateIntake(sample('06', i => { i.release.accepted = false; }), model);
      assert.equal(v.ok, false); assert.ok(v.errors.some(e => e.code === 'release_missing' && e.field === 'release.accepted'));
    });

    it('R4-SCP-02: every generated plan carries a release stamp that says it was accepted, and V21 / H20 hold the gate', () => {
      for (const n of SAMPLES) {
        const p = planOf(n);
        assert.equal(p.status, 'ok'); assert.equal(p.release_stamp.accepted, true, n);
        assert.deepEqual(Object.keys(p.release_stamp), ['version', 'lang', 'role', 'guardian', 'accepted']);
        assert.equal(check(p.validation, 'V21').pass, true); assert.equal(check(p.validation, 'H20').pass, true);
      }
      const bad = (mut) => { const p = clone(planOf('06')); mut(p); return validatePlan(p, model); };
      for (const mut of [p => { p.release_stamp.accepted = false; }, p => { delete p.release_stamp.accepted; }, p => { p.release_stamp = null; }, p => { p.release_stamp.version = 'release.coach'; }]) {
        const res = bad(mut);
        assert.equal(check(res, 'V21').pass, false); assert.equal(check(res, 'H20').pass, false); assert.equal(res.ok, false);
      }
      // a result that is not a plan holds no weeks
      const refer = { ...clone(planOf('06')), status: 'refer', refer: { reasons: ['refer.reason.heart'] } };
      assert.ok(check(validatePlan(refer, model), 'V21').violations.some(v => v.args.rule === 'weeks_without_a_plan'));
    });

    it('R4-SCP-01 / R4-SCP-02: the release line is printed on top and at the bottom of every plan, and on every view and fragment, in English and Spanish, linking DISCLAIMER.md / DISCLAIMER.es.md', () => {
      const RL = R.legal.release_line;
      assert.deepEqual(RL.positions, ['top', 'bottom']); assert.deepEqual(RL.langs, ['en', 'es']);
      assert.equal(RL.files.en, 'DISCLAIMER.md'); assert.equal(RL.files.es, 'DISCLAIMER.es.md');
      for (const f of Object.values(RL.files)) assert.ok(fs.existsSync(path.join(ROOT, f)), f + ' exists in the repository');
      assert.ok(R.legal.disclaimer_url.en.endsWith('/DISCLAIMER.md') && R.legal.disclaimer_url.es.endsWith('/DISCLAIMER.es.md'));
      for (const n of SAMPLES) for (const lang of ['en', 'es']) {
        const p = planOf(n), url = R.legal.disclaimer_url[lang];
        const line = t(lang, RL.by_version[p.release_stamp.version]);
        const full = mdOf(n, lang), lines = full.split('\n');
        const iTop = lines.findIndex(l => unesc(l).includes(line));
        assert.ok(iTop > 0 && iTop < 5, `${n} ${lang}: the release line on top`);
        assert.ok(lines[iTop].startsWith('> **' + t(lang, 'ui.plan.own_risk_label') + '**') && lines[iTop].includes('](' + url + ')'));
        const tail = lines.slice(-8).join('\n');
        assert.ok(unesc(tail).includes(t(lang, RL.footer_key)) && tail.includes('](' + url + ')'), `${n} ${lang}: the release line at the bottom`);
        for (const [view, o] of VIEWS) {
          const out = renderPlan(p, model, { lang, view, ...o });
          const said = unesc(out).includes(line) || unesc(out).includes(t(lang, RL.short_key));
          assert.ok(said && out.includes('](' + url + ')'), `${n} ${lang} ${view}${o.macro ? ' macro' : ''}: release line + link`);
        }
        for (const out of [renderWeek(p, 1, model, { lang }), renderWeek(p, 1, model, { lang, macro: true }), renderBlockView(p, 1, model, { lang }), renderDay(p, 1, p.weeks[0].days.find(d => d.kind === 'main').weekday, model, { lang }),
          renderPlan(p, model, { lang, format: 'text' })]) {
          assert.ok((unesc(out).includes(line) || unesc(out).includes(t(lang, RL.short_key))) && out.includes(url), `${n} ${lang}: a fragment / the text format`);
        }
      }
      // the words say what the coach asked: the terms were accepted, liability is released, own risk
      for (const k of Object.values(RL.by_version)) { assert.match(t('en', k), /accepted the terms and released .* from all liability/); assert.match(t('es', k), /liber(aste|ó) de toda responsabilidad/); }
      assert.match(t('en', RL.short_key), /Liability released before this plan was built/); assert.match(t('es', RL.short_key), /Responsabilidad liberada antes de crear este plan/);
    });

    it('R4-SCP-01: a self-built, a coach-built and a minor\'s plan each print their own release line (who accepted, who is responsible)', () => {
      const RL = R.legal.release_line;
      const own = planOf('06');
      assert.equal(own.release_stamp.version, 'release.client');
      assert.ok(unesc(mdOf('06')).includes(t('en', 'ui.plan.release_line')));
      const coach = generate(sample('06', i => { i.role = 'client'; i.health_route = 'coach_own_sop'; i.release.version = 'release.coach'; }), model);
      assert.equal(coach.status, 'ok', JSON.stringify(coach.errors));
      const cmd = unesc(renderPlan(coach, model, { lang: 'en' }));
      assert.ok(cmd.includes(t('en', RL.by_version['release.coach'])) && /responsible for the client's own health screening and release/.test(cmd));
      const minor = planOf('01');
      assert.equal(minor.release_stamp.version, 'release.minor'); assert.equal(minor.release_stamp.guardian, true);
      assert.ok(unesc(mdOf('01', 'es')).includes(t('es', RL.by_version['release.minor'])));
      // a refer result (no plan was built) keeps the plain use-at-your-own-risk line
      const refer = generate(sample('06', i => { i.safety = { ...(i.safety || {}), heart: true }; }), model);
      if (refer.status === 'refer') {
        const out = unesc(renderPlan(refer, model, { lang: 'en' }));
        assert.ok(out.includes(t('en', 'ui.plan.own_risk')) && !out.includes(t('en', 'ui.plan.release_line')) && out.includes(R.legal.disclaimer_url.en));
      }
    });

    it('R4-SCP-02: the model refuses a build with the gate switched off or a release line with no words', () => {
      const errs = (mut) => { const raw = mname === 'fixture' ? cloneFixtureRaw() : clone(readModelDir()); mut(raw); return assertModel(raw).join('\n'); };
      assert.match(errs(m => { m.rules.legal.gate.required = false; }), /gate\.required must be true/);
      assert.match(errs(m => { delete m.i18n.es['ui.plan.release_line']; }), /release line: ui\.plan\.release_line needs English and Spanish/);
      assert.match(errs(m => { delete m.rules.legal.disclaimer_url.es; }), /disclaimer_url\.es is missing/);
      assert.match(errs(m => { m.rules.render.progression.promised_numbers = true; }), /promised_numbers must be false/);
      assert.match(errs(m => { m.rules.session.easy_to_remove.automatic = true; }), /automatic must be false/);
      assert.match(errs(m => { m.rules.time_model.use = 'fit'; }), /estimate_only/);
    });
  });

  // ------------------------------------------------------------------------------------------------- R4-PRG-03
  describe(`v0.5 / V3 progression as a rule (${mname})`, () => {
    it('R4-PRG-03: every set-and-rep lift prints its rule with its own numbers - "when you hit 12 on every set with N left in the tank, add weight next time and start again at 8"', () => {
      for (const n of ['06', '07', '02', '08']) for (const lang of ['en', 'es']) {
        const p = planOf(n);
        const w = p.weeks[0], d = w.days.find(x => x.kind === 'main');
        const card = unesc(renderDay(p, 1, d.weekday, model, { lang }));
        const lifts = itemsOf(d).filter(it => it.progression);
        assert.ok(lifts.length >= 4, n);
        for (const it of lifts) {
          const pr = it.progression, e = it.effort;
          const rir = e.min === e.max ? String(e.min) : e.min + '-' + e.max;
          const base = it.set_reps ? 'ui.plan.progress.written' : pr.kind === 'double_progression' ? 'ui.plan.progress.double' : 'ui.plan.progress.fixed';
          const key = !it.set_reps && it.reps.type === 'per_side' ? base + '_side' : base;
          assert.ok(card.includes('- ' + t(lang, key, { low: pr.rep_range[0], high: pr.rep_range[1], rir })), `${n} ${lang} ${it.slot_id}: ${t(lang, key, { low: pr.rep_range[0], high: pr.rep_range[1], rir })}`);
        }
        // a lift that is not dosed in sets and reps (holds, jumps, cardio, tests) carries no rule line
        const n2 = card.split('\n').filter(l => l.trim().startsWith('- ' + t(lang, 'ui.plan.progress.double', { low: 0, high: 0, rir: 0 }).split(':')[0] + ':')).length;
        assert.equal(n2, lifts.length, `${n} ${lang}: one rule line per lift (${n2} lines, ${lifts.length} lifts)`);
      }
      const en = t('en', 'ui.plan.progress.double', { low: 8, high: 12, rir: '1-2' });
      assert.equal(en, 'Progress: when you hit 12 on every set with 1-2 left in the tank, add weight next time and start again at 8.');
      assert.equal(t('es', 'ui.plan.progress.double', { low: 8, high: 12, rir: '1-2' }), 'Para avanzar: cuando llegues a 12 en todas las series con 1-2 de sobra, sube el peso la próxima vez y vuelve a empezar en 8.'); // plain words (CH7-09, G-315): wording converted
    });

    it('R4-PRG-03: "How you progress" says the rule with an example from the plan, and no line promises a number for a week', () => {
      for (const n of SAMPLES) for (const lang of ['en', 'es']) {
        const out = unesc(mdOf(n, lang));
        assert.ok(out.includes('## ' + t(lang, 'ui.plan.progress_title')), `${n} ${lang}`);
        const p = planOf(n);
        const any = allItems(p).some(x => x.it.progression);
        if (any) assert.ok(/not a number this plan promises|no un número que este plan prometa/.test(out), `${n} ${lang}: a rule you apply`);
        assert.ok(!/week \d+: \d+ reps\b/i.test(out) && !/semana \d+: \d+ rep/i.test(out), `${n} ${lang}: a promised number`);
        assert.ok(out.includes(t(lang, 'ui.plan.progress_edit')), 'the plan is a template you can edit (CX-04)');
      }
      // the example is the plan's own first main lift with a rep range
      const p6 = planOf('06');
      const ex = allItems(p6).find(x => x.w.n === 1 && x.it.progression && x.it.progression.kind === 'double_progression' && !x.it.set_reps && x.it.role === 'work');
      assert.ok(unesc(mdOf('06')).includes(`${t('en', ex.it.name_key)}, ${ex.it.sets} sets of ${ex.it.progression.rep_range[0]}-${ex.it.progression.rep_range[1]}`));
      // CX-02: a week with the same sets progresses with reps or load; R4-PRG-04: where the next block starts
      assert.ok(unesc(mdOf('06')).includes(t('en', 'ui.plan.progress_sets')) && unesc(mdOf('06')).includes(t('en', 'ui.plan.progress_next', { pct: 5 })));
      // a timed circuit climbs by work time, and says so
      // (v0.6 words, converted - DECISIONS G-160: the circuit line is built from the weeks' own rounds and work time)
      assert.ok(unesc(mdOf('05', 'es')).includes(t('es', 'ui.plan.progress_circuit_v6').split('{')[0]));
    });

    it('R4-PRG-03: a lift with its reps written per set (the 12/10/8 pyramid) reads "the written reps"; V34 holds the rule on every plan', () => {
      const p = planOf('06');
      const pyr = allItems(p).find(x => x.it.set_reps && x.it.progression);
      assert.ok(pyr, 'the bench pyramid');
      const card = unesc(renderDay(p, pyr.w.n, pyr.d.weekday, model, { lang: 'en' }));
      const rir = pyr.it.effort.min === pyr.it.effort.max ? String(pyr.it.effort.min) : pyr.it.effort.min + '-' + pyr.it.effort.max;
      assert.ok(card.includes(t('en', 'ui.plan.progress.written', { low: 0, high: 0, rir })));
      for (const n of SAMPLES) assert.equal(check(planOf(n).validation, 'V34').pass, true, n);
      const bad = (mut) => { const q = clone(p); mut(q); return check(validatePlan(q, model), 'V34'); };
      const lift = (q) => allItems(q).find(x => x.it.progression && x.w.n === 3).it;
      assert.ok(bad(q => { lift(q).progression = null; }).violations.some(v => v.args.rule === 'rule_missing'));
      assert.ok(bad(q => { const it = lift(q); it.progression.promised_numbers = true; }).violations.some(v => v.args.rule === 'promised_numbers'));
      assert.ok(bad(q => { const it = lift(q); it.progression.rep_range = [1, 2]; }).violations.some(v => v.args.rule === 'rule_not_the_items_reps'));
    });
  });

  // ------------------------------------------------------------------------------------------------- R4-PRG-02
  describe(`v0.5 / V3 acceleration note (${mname})`, () => {
    it('R4-PRG-02: a week that adds more than about 15 % is marked in the stairway table, said on its week and listed in "How you progress"; other plans print none of it', () => {
      let withNote = 0;
      for (const n of SAMPLES) {
        const p = planOf(n);
        const fast = p.weeks.filter(w => (w.acceleration || []).length);
        for (const lang of ['en', 'es']) {
          const out = unesc(mdOf(n, lang));
          const legend = t(lang, 'ui.plan.accel_legend', { mark: R.render.acceleration.mark });
          if (!fast.length) { assert.ok(!out.includes(legend) && !out.includes(' ' + R.render.acceleration.mark + ' |'), `${n} ${lang}: no mark`); continue; }
          assert.ok(out.includes(legend), `${n} ${lang}: the legend`);
          for (const w of fast) {
            assert.match(out, new RegExp('\\| ' + w.n + ' ' + R.render.acceleration.mark + '( · [^|]+)? \\|'), `${n} ${lang}: week ${w.n} marked`);
            // (v0.6 words, converted - DECISIONS G-172: one line per week and step size, the groups listed; a circuit week that added a
            // round says 'every muscle group: one more circuit round')
            const wk = unesc(renderWeek(p, w.n, model, { lang })).toLowerCase(), mac = unesc(renderWeek(p, w.n, model, { lang, macro: true })).toLowerCase();
            const allRound = t(lang, 'ui.plan.accel_week_all_round', { pct: 0 }).split('(')[0].toLowerCase();
            for (const a of w.acceleration) {
              if (a.total && w.acceleration.some(x => x.group)) continue;
              const line = (a.total ? t(lang, 'ui.plan.accel_week_total', { pct: a.pct }) : t(lang, 'group.' + a.group)).toLowerCase();
              for (const out2 of [wk, mac]) assert.ok(out2.includes(line) || (out2.includes(allRound) && out2.includes(a.pct + ' %')), `${n} ${lang} week ${w.n}: ${line}`);
            }
          }
          assert.ok(/adjust if needed|ajusta si hace falta/.test(out));
        }
        if (fast.length) withNote++;
      }
      assert.ok(withNote >= 1, 'at least one sample holds a fast week');
      assert.equal(R.render.acceleration.above, R.stairway.progression.note_above);
    });

    it('R4-PRG-02: V35 fails a plan whose fast week lost its note, and passes every generated plan (no hard limit: the note is the rule)', () => {
      for (const n of SAMPLES) assert.equal(check(planOf(n).validation, 'V35').pass, true, n);
      const n = SAMPLES.find(x => planOf(x).weeks.some(w => (w.acceleration || []).some(a => a.group)));
      const p = clone(planOf(n));
      const w = p.weeks.find(x => (x.acceleration || []).some(a => a.group));
      w.acceleration = [];
      const res = check(validatePlan(p, model), 'V35');
      assert.equal(res.pass, false); assert.ok(res.violations.some(v => v.where.week === w.n && v.args.rule === 'week_not_noted'));
      const q = clone(planOf(n));
      q.meta.warnings = q.meta.warnings.filter(x => x.code !== 'acceleration');
      assert.ok(check(validatePlan(q, model), 'V35').violations.some(v => v.args.rule === 'warning_missing'));
    });
  });

  // ------------------------------------------------------------------------------------------------- CT-01 / R4-SES-01
  describe(`v0.5 / V3 time estimate as information (${mname})`, () => {
    it('CT-01 / R4-SES-01: every training day prints an average time as a range ("about 60-75 min"), marked as an estimate for information only', () => {
      const E = R.render.estimate;
      assert.equal(E.information_only, true); assert.equal(R.time_model.use, 'estimate_only');
      for (const n of SAMPLES) for (const lang of ['en', 'es']) {
        const p = planOf(n);
        for (const d of p.weeks[0].days.filter(x => ['main', 'optional'].includes(x.kind) && typeof x.est_minutes === 'number')) {
          const card = unesc(renderDay(p, 1, d.weekday, model, { lang }));
          const m = (lang === 'en' ? /Average time: about (\d+)-(\d+) min \(an estimate, just so you know\)/ : /Tiempo promedio: unos (\d+)-(\d+) min \(un cálculo, solo para que sepas\)/).exec(card); // plain words (CH7-09, G-315): wording converted, still an estimate for information only
          assert.ok(m, `${n} ${lang} ${d.weekday}: ${card.split('\n')[1]}`);
          const [lo, hi] = [Number(m[1]), Number(m[2])];
          assert.ok(lo < hi && lo % E.round_to_min === 0 && hi % E.round_to_min === 0 && lo <= d.est_minutes && d.est_minutes <= hi, `${n} ${d.weekday}: ${lo}-${hi} around ${d.est_minutes}`);
        }
        const out = unesc(mdOf(n, lang));
        assert.ok(out.includes(t(lang, 'guide.adjust.time')) || out.includes(t(lang, 'guide.adjust.time_no_list')), `${n} ${lang}: the guide says nothing is cut for time`);
        // nothing reads like a limit
        assert.ok(!/over your minutes|minutes over|longer than your|session length|más de tus minutos|duración de la sesión/i.test(out), `${n} ${lang}`);
      }
      assert.match(t('en', 'guide.adjust.time'), /nothing in this plan is cut or changed because of time/i); // plain words (CH7-09, G-315): wording converted
      assert.match(t('es', 'guide.adjust.time'), /nada de este plan se corta ni cambia por el tiempo/i);
    });

    it('CT-01: no check of the validator and no metric of the scorer is about minutes; a long estimate changes nothing', () => {
      const p = clone(planOf('06'));
      for (const w of p.weeks) for (const d of w.days) if (typeof d.est_minutes === 'number') d.est_minutes = 300;
      const res = validatePlan(p, model);
      assert.deepEqual(res.checks.filter(c => !c.pass && c.severity === 'error').map(c => c.id), []);
      for (const c of R.validation.checks) assert.ok(!/minute|session length/i.test(t('en', c.key)) || c.id === 'V3', c.id + ': ' + t('en', c.key));
      for (const m of METRICS) if (m.id !== 'time_fields') assert.ok(!/minute|session length/i.test(m.what), m.id + ': ' + m.what);
      for (const k of REMOVED_V3) { assert.equal(model.has('en', k), false, k + ' is a dead word'); assert.equal(model.has('es', k), false, k); }
    });
  });

  // ------------------------------------------------------------------------------------------------- R4-SES-04
  describe(`v0.5 / V3 easy to remove (${mname})`, () => {
    it('R4-SES-04: a day names what is easiest to remove - by kind, in the rule\'s order - and removes nothing; the person picks', () => {
      let lines = 0;
      for (const n of SAMPLES) for (const lang of ['en', 'es']) {
        const p = planOf(n);
        for (const d of p.weeks[0].days.filter(x => ['main', 'optional'].includes(x.kind))) {
          const card = unesc(renderDay(p, 1, d.weekday, model, { lang }));
          const head = t(lang, 'ui.plan.easy_to_remove_line', { list: '' }).split(':')[0];
          const line = card.split('\n').find(l => l.startsWith('_' + head));
          const list = d.easy_to_remove || [];
          if (!list.length) { assert.equal(line, undefined, `${n} ${lang} ${d.weekday}: no hint without a list`); continue; }
          assert.ok(line, `${n} ${lang} ${d.weekday}: the hint`);
          lines++;
          const its = itemsOf(d);
          let at = -1;
          for (const x of list.slice(0, R.render.easy_to_remove.max_listed)) {
            const it = its.find(y => y.slot_id === x.slot_id);
            assert.ok(it && typeof it.sets === 'number' ? it.sets > 0 : !!it, 'the listed exercise is still in the day');
            const name = it.wod ? t(lang, 'slot.COND_WOD') : it.name_key ? t(lang, it.name_key) : null;
            if (!name) continue;
            const i = line.indexOf(name.split(' - ')[0], Math.max(0, at));
            assert.ok(i >= 0, `${n} ${lang} ${d.weekday}: ${name} in "${line}"`);
            at = i;
            assert.ok(line.includes(t(lang, R.render.easy_to_remove.kind_keys[x.kind])), 'the kind is named');
          }
          assert.ok(/your choice|tú decides/.test(line));
        }
      }
      assert.ok(lines > 20);
      assert.deepEqual(Object.keys(R.render.easy_to_remove.kind_keys).sort(), R.session.easy_to_remove.order.slice().sort());
    });

    it('R4-SES-04: V36 - the list never holds a core exercise, a main lift or the first athletic station, and nothing on it was removed', () => {
      for (const n of SAMPLES) assert.equal(check(planOf(n).validation, 'V36').pass, true, n);
      const p = planOf('02');
      const d0 = p.weeks[0].days.find(x => x.kind === 'main');
      const bad = (mut) => { const q = clone(p); mut(q.weeks[0].days.find(x => x.weekday === d0.weekday)); return check(validatePlan(q, model), 'V36'); };
      const core = itemsOf(d0).find(it => it._block === 'core'), work = itemsOf(d0).find(it => it.role === 'work'), ath = itemsOf(d0).find(it => it._block === 'athletic');
      for (const it of [core, work, ath]) assert.ok(bad(d => { d.easy_to_remove.push({ slot_id: it.slot_id, kind: 'small_muscle_accessory' }); }).violations.some(v => v.args.rule === 'always_keep_listed'), it.slot_id);
      assert.ok(bad(d => { const x = d.easy_to_remove[0]; for (const b of d.blocks) b.items = b.items.filter(it => it.slot_id !== x.slot_id); }).violations.some(v => v.args.rule === 'listed_item_not_in_the_day'));
    });
  });

  // ------------------------------------------------------------------------------------------------- tables and macro views
  describe(`v0.5 / V3 weekly sets table and macro views (${mname})`, () => {
    it('ENGINE_V05_PLAN allocation step 4: the plan prints the weekly sets per muscle group for every week, counted from its own exercises, with the planned final sets', () => {
      for (const n of ['06', '01', '08']) {
        const p = planOf(n);
        const out = unesc(renderPlan(p, model, { lang: 'en', view: 'block' }));
        assert.ok(out.includes('### ' + t('en', 'ui.plan.sets_by_week_title')), n);
        assert.ok(out.includes('| ' + [t('en', 'ui.plan.col.group'), t('en', 'ui.plan.col.sets_by_week', { from: 1, to: p.weeks.length }), t('en', 'ui.plan.col.final_sets')].join(' | ') + ' |'));
        const st = p.meta.stairway[0];
        for (const g of st.groups) {
          const row = out.split('\n').find(l => l.startsWith('| ' + t('en', 'group.' + g) + ' | ') && l.split('|').length === 5 && /\d \d/.test(l));
          assert.ok(row, `${n}: the ${g} row`);
          const cells = row.split('|').map(x => x.trim());
          // the recount from the items, week by week (a set counts at most 1.0 to a group)
          const want = p.weeks.map(w => { let v = 0; for (const d of w.days) for (const it of itemsOf(d)) v += (typeof it.sets === 'number' ? it.sets : 0) * (groupCredits(model, it.credits || {})[g] || 0); const fin = (st.capped || []).find(x => x.group === g) ? st.capped.find(x => x.group === g).held : Math.max(st.group_top[g], Math.floor((st.realized_top || {})[g] + 1e-9 || 0)); return String(v > fin && v - fin < 1 - 1e-9 && Math.round(v) > fin ? fin : v < fin - 1e-9 && Math.round(v) >= fin ? fin - 1 : Math.round(v)); }); // (v0.6 words, converted - DECISIONS G-174: the table prints whole sets; G-203: never above the final sets; G-212: never the final sets before they are reached)
          assert.deepEqual(cells[2].split(/ · | /).filter(Boolean), want, `${n} ${g}`);
          const cap = (st.capped || []).find(x => x.group === g);
          assert.equal(cells[3], cap ? t('en', 'ui.plan.final_capped', { held: cap.held, planned: cap.planned }) : String(Math.max(st.group_top[g], Math.floor(((st.realized_top || {})[g] || 0) + 1e-9))), `${n} ${g}: final sets`); // (G-203: a whole set of helper credit above a lowered top prints what the plan reaches)
        }
        for (const g of (st.credit_only_groups || []).filter(x => !(st.held_groups || []).includes(x) && p.weeks.some(w => (w.weekly_sets_by_group || {})[x] > 0))) { /* (G-202: a held group - the arm slot - is not 'no exercise of its own') */ const row = out.split('\n').find(l => l.startsWith('| ' + t('en', 'group.' + g) + ' | ') && l.includes(t('en', 'ui.plan.final_credit_only'))); assert.ok(row, `${n}: ${g} has no exercise of its own`); }
        assert.ok(out.split('\n').some(l => l.startsWith('| **' + t('en', 'ui.plan.total') + '** | ' + p.weeks.slice(0, 2).map(w => Math.round(w.total_resistance_sets)).join(' '))));
      }
      // sample 06: chest is capped by the template and the table says '13 of 25'
      // (v0.5 fix round 1: the incline press of the 'Chest / Shoulders' slot and the half set of a high-incline press now count for
      // chest - R4-SES-05 / R4-LIB-03, sample 06 major 'chest holds 13 weekly sets in every one of the 12 weeks' - so the number moved;
      // the table still prints 'held of planned' for a group its template caps)
      // (converted in engine 0.7, G-231: COACH-R5 R5-VOL-07's light chest exercise on the optional day takes 06's chest to its 25, so the
      // capped row is read on the group the template still holds - the biceps)
      { const p6 = planOf('06'), c6 = p6.meta.stairway[0].capped.find(x => x.group === 'biceps');
        assert.ok(!p6.meta.stairway[0].capped.some(x => x.group === 'chest'));
        assert.ok(c6 && c6.held < c6.planned, JSON.stringify(c6));
        assert.match(unesc(renderPlan(p6, model, { view: 'block' })), new RegExp('\\| Biceps \\| [\\d. ·]+ \\| ' + c6.held + ' of ' + c6.planned + ' \\|')); }
      // a timed circuit has no stairway of sets: two columns, no 'final sets' to promise
      const circ = unesc(renderPlan(planOf('05'), model, { lang: 'en', view: 'block' }));
      assert.ok(circ.includes('| ' + [t('en', 'ui.plan.col.group'), t('en', 'ui.plan.col.sets_by_week', { from: 1, to: planOf('05').weeks.length })].join(' | ') + ' |\n|---|---|\n'));
      assert.ok(circ.includes(t('en', 'ui.plan.sets_by_week_note_flat')) && !circ.includes(t('en', 'ui.plan.col.final_sets')));
    });

    it('R2-GEN-02: block, week and day macro views - compact tables for a screenshot, EN and ES, with no undefined, no unfilled placeholder and no raw key', () => {
      for (const n of ['06', '02', '05']) for (const lang of ['en', 'es']) {
        const p = planOf(n);
        const block = renderPlan(p, model, { lang, view: 'block' });
        const wk = renderPlan(p, model, { lang, view: 'week', weeks: [3], macro: true });
        const dy = renderPlan(p, model, { lang, view: 'day', weeks: [3], macro: true });
        const mains = p.weeks[2].days.filter(d => ['main', 'optional'].includes(d.kind));
        // the week: its title, the sets of the week, the days at a glance, one table per training day - and no full cards
        assert.ok(unesc(wk).includes('## ' + t(lang, 'ui.plan.week_macro', { n: 3 })), `${n} ${lang}`);
        assert.ok(unesc(wk).includes('**' + t(lang, 'ui.plan.sets_this_week') + ':**') || p.weeks[2].total_resistance_sets === 0);
        assert.ok(unesc(wk).includes('### ' + t(lang, 'ui.plan.week_glance', { n: 3 })));
        assert.equal(wk.split('\n').filter(l => l.startsWith('| # | ')).length, mains.length, `${n} ${lang}: one table per training day`);
        assert.ok(!wk.includes(t(lang, 'ui.plan.swaps') + ':') && !wk.includes('youtube.com'), 'no swaps or links in the macro week');
        assert.ok(wk.length < renderPlan(p, model, { lang, view: 'week', weeks: [3] }).length / 2, 'the macro week is much shorter than the full week');
        // the day: one table each, with the average time
        assert.equal(dy.split('\n').filter(l => l.startsWith('| # | ')).length, mains.length);
        assert.ok(/Average time|Tiempo promedio/.test(dy));
        const one = renderDay(p, 3, mains[0].weekday, model, { lang, macro: true });
        assert.equal(one.split('\n').filter(l => l.startsWith('| # | ')).length, 1);
        // the block: levels, the sets per group week by week, one exercise table per day
        assert.ok(unesc(block).includes(t(lang, 'ui.plan.sets_by_week_title')));
        for (const s of [block, wk, dy, one, renderWeek(p, 3, model, { lang, macro: true })]) {
          assert.ok(!s.includes('undefined') && !/\{[a-z_]+\}/.test(s), `${n} ${lang}: ${(s.match(/\{[a-z_]+\}/) || [''])[0]}`);
          assert.ok(!/\b(ui|warning|note|why|guide|check)\.[a-z_]+\.[a-z_.]+/.test(s.replace(/\(https?:[^)]*\)/g, '')), `${n} ${lang}: a raw key`);
          for (const line of s.split('\n').filter(l => l.startsWith('|'))) assert.ok(line.split('|').length - 2 <= 4, 'phone-friendly: at most 4 columns');
        }
      }
      assert.deepEqual(R.render.views.macro, ['block', 'week', 'day']);
    });

    it('CX-04: an edited plan says so under its title; a switched-off block stays visible as switched off', () => {
      const p = planOf('06');
      const d = p.weeks[0].days.find(x => x.kind === 'main');
      const r = applyPlanEdits(p, [{ op: 'set_block', weekday: d.weekday, block: 'core', on: false, weeks: [1] }], model);
      const out = unesc(renderPlan(r.plan, model, { lang: 'en' }));
      assert.ok(out.split('\n')[1].includes(t('en', 'ui.plan.edited')));
      assert.ok(!unesc(mdOf('06')).split('\n')[1].includes(t('en', 'ui.plan.edited')));
      assert.ok(unesc(renderPlan(r.plan, model, { lang: 'es' })).split('\n')[1].includes(t('es', 'ui.plan.edited')));
    });
  });

  // ------------------------------------------------------------------------------------------------- the v0.5 check list
  describe(`v0.5 / V3 validator check list (${mname})`, () => {
    it('ENGINE_V05_PLAN V3: the check list holds V1-V37 + H01-H22, every v0.5 rule names its checks, and every check has English and Spanish words', () => {
      assert.equal(CHECK_IDS.length, 59);
      const ids = R.validation.checks.map(c => c.id);
      for (const [id, key, severity] of CHECKS_V3) { const c = R.validation.checks.find(x => x.id === id); assert.ok(c && c.key === key && c.severity === severity, id); }
      assert.deepEqual(ids, Array.from({ length: 37 }, (_, i) => 'V' + (i + 1)));
      for (const c of [...R.validation.checks, ...R.validation.hard]) { assert.ok(model.has('en', c.key), c.key); assert.ok(model.has('es', c.key), c.key + ' (es)'); }
      const BR = R.validation.v05.by_rule;
      assert.deepEqual(BR.template_skeleton, ['V30']); assert.deepEqual(BR.exercise_count, ['V13']); assert.deepEqual(BR.final_target_reached, ['V15', 'H10']);
      assert.deepEqual(BR.arrival_one_week_early_at_most, ['V15', 'H10']); assert.deepEqual(BR.floor_from_3_days, ['V22', 'H17']); assert.deepEqual(BR.two_day_rule, ['V22', 'H17']);
      assert.deepEqual(BR.addons_optional_only, ['V31']); assert.deepEqual(BR.incline_first, ['V32']); assert.deepEqual(BR.liability_gate, ['V21', 'H20']); assert.deepEqual(BR.no_video_urls, ['V33']);
      assert.deepEqual(BR.no_time_fitting, ['V3']);
    });

    it('every generated sample passes every error check of the v0.5 list, and V30 ... V37 look at real rows (not vacuous)', () => {
      for (const n of SAMPLES) {
        const p = planOf(n);
        assert.deepEqual(p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => c.id), [], n);
        for (const id of ['V30', 'V31', 'V33', 'V34', 'V35', 'V36', 'V37']) assert.equal(check(p.validation, id).pass, true, `${n} ${id}`);
      }
    });

    it('R4-SES-05: a generated day names its template\'s skeleton, and V30 holds it to the coach\'s slots - pattern, order, nothing dropped', () => {
      for (const n of SAMPLES) {
        const p = planOf(n);
        const [fam, days] = p.meta.template.id.split('.');
        const tpl = model.template(fam, days);
        const dts = model.dayTypes(tpl, p.meta.template.variant && tpl.variants[p.meta.template.variant] ? p.meta.template.variant : null).day_types;
        for (const w of p.weeks) for (const d of w.days) {
          if (!['main', 'optional'].includes(d.kind)) { assert.equal(d.skeleton, null); continue; }
          const dt = dts[d.day_type];
          if (dt) assert.equal(d.skeleton, dt.skeleton || null, `${n} w${w.n} ${d.weekday}`);
        }
      }
      const p = planOf('06');
      assert.deepEqual([...new Set(p.weeks[0].days.filter(d => d.kind === 'main').map(d => d.skeleton))], ['gym_A', 'gym_B']);
      const A = p.weeks[0].days.find(d => d.skeleton === 'gym_A').weekday, B = p.weeks[0].days.find(d => d.skeleton === 'gym_B').weekday;
      const bad = (mut) => { const q = clone(p); mut(q); return check(validatePlan(q, model), 'V30'); };
      const day = (q, w, wd) => q.weeks[w - 1].days.find(d => d.weekday === wd);
      // the squat in front of the row: out of the coach's order
      let res = bad(q => { const b = day(q, 2, A).blocks.find(x => x.kind === 'strength'); const i = b.items.findIndex(it => it.bucket === 'RP_HPULL'), j = b.items.findIndex(it => it.bucket === 'RP_BKD'); [b.items[i], b.items[j]] = [b.items[j], b.items[i]]; });
      assert.ok(res.violations.some(v => v.where.week === 2 && v.where.weekday === A && v.args.rule === 'slot_order'), JSON.stringify(res.violations.slice(0, 2)));
      // a press on the A day (pull + knee dominant)
      res = bad(q => { itemsOfRaw(day(q, 3, A)).find(it => it.bucket === 'RP_VPULL').bucket = 'RP_VPUSH'; });
      assert.ok(res.violations.some(v => v.where.week === 3 && v.args.rule === 'slot_pattern' && v.args.slot === 'RP_VPULL'));
      // a lift dropped from the B day with no reason said (R4-SES-04)
      res = bad(q => { const d = day(q, 4, B); for (const b of d.blocks) b.items = b.items.filter(it => it.bucket !== 'ISO_LEG_FLEXION'); });
      assert.ok(res.violations.some(v => v.where.week === 4 && v.where.weekday === B && v.args.rule === 'template_lift_missing' && v.args.slot === 'ISO_LEG_FLEXION'));
      // the same day saying why is fine; a day that names another skeleton is not
      res = bad(q => { const d = day(q, 4, B); for (const b of d.blocks) b.items = b.items.filter(it => it.bucket !== 'ISO_LEG_FLEXION'); d.why.push({ key: 'why.left_out_exclusion', ref: 'F38', args: { reason: 'machines' } }); });
      assert.ok(!res.violations.some(v => v.where.week === 4 && v.args.rule === 'template_lift_missing'));
      assert.ok(bad(q => { day(q, 1, A).skeleton = 'gym_B'; }).violations.some(v => v.args.rule === 'skeleton_not_the_templates'));
      // the laterality dial or a kit stand-in may change the bucket inside the pattern
      assert.equal(bad(q => { itemsOfRaw(day(q, 1, A)).find(it => it.bucket === 'RP_UKD').bucket = 'RP_BKD'; }).violations.filter(v => v.args.rule === 'slot_pattern').length, 0);
      // an edited plan is the person's (CX-04)
      const q = clone(p); q.edited = true; for (const b of day(q, 4, B).blocks) b.items = b.items.filter(it => it.bucket !== 'ISO_LEG_FLEXION');
      assert.equal(check(validatePlan(q, model), 'V30').pass, true);
    });

    it('R4-LIB-01 / R4-LIB-02 / R4-LIB-05: V31, V37 and V33 fail a hand-broken plan at the broken item', () => {
      const p = planOf('01');
      const lift = (q, n = 1) => allItems(q).find(x => x.w.n === n && x.it.bucket === 'ISO_CALF').it;
      const run = (mut, id) => { const q = clone(p); mut(q); return check(validatePlan(q, model), id); };
      const addon = model.exercises().find(e => e.status === R.selection.addons.addon_status && e.slots.includes('ISO_CALF'));
      let res = run(q => { const it = lift(q); it.exercise_id = addon.id; it.name_key = addon.name_key; }, 'V31');
      assert.ok(res.violations.some(v => v.args.rule === 'addon_as_pick' && v.args.exercise === addon.id));
      const neck = model.exercises().find(e => R.selection.addons.not_shown_statuses.includes(e.status));
      assert.ok(run(q => { lift(q).swaps.push(neck.id); }, 'V31').violations.some(v => v.args.rule === 'not_shown_as_swap'));
      assert.ok(run(q => { q.meta.addons.push({ exercise_id: lift(q).exercise_id, kind: 'sport' }); }, 'V31').violations.some(v => v.args.rule === 'offered_not_an_addon'));
      // the person may add an add-on by an edit: it is theirs to choose
      const carryId = (p.meta.addons.find(a => a.kind === 'carry') || { exercise_id: 'farmer-carry' }).exercise_id;
      const wd = p.weeks[0].days.find(d => d.kind === 'main').weekday;
      const ed = applyPlanEdits(p, [{ op: 'add_exercise', weekday: wd, block: 'conditioning', exercise_id: carryId, sets: 3, weeks: [1] }], model);
      assert.equal(check(ed.plan.validation, 'V31').pass, true); assert.equal(check(ed.plan.validation, 'V37').pass, true);
      // carries: by distance or time, 2-4 trips, no credit
      const carry = allItems(p).find(x => model.hasEx(x.it.exercise_id) && (model.ex(x.it.exercise_id).tags || []).includes(R.conditioning.carry.tag) && x.it.reps && x.it.reps.type === 'distance_or_time');
      if (carry) {
        const at = (q) => allItems(q).find(x => x.w.n === carry.w.n && x.it.slot_id === carry.it.slot_id).it;
        assert.ok(run(q => { at(q).reps = { type: 'range', min: 8, max: 12 }; }, 'V37').violations.some(v => v.args.rule === 'carry_in_reps'));
        assert.ok(run(q => { at(q).sets = 6; }, 'V37').violations.some(v => v.args.rule === 'carry_trips'));
        assert.ok(run(q => { at(q).credits = { forearms: 1 }; }, 'V37').violations.some(v => v.args.rule === 'carry_credits'));
        assert.ok(run(q => { at(q).reps.metres = [20, 80]; }, 'V37').violations.some(v => v.args.rule === 'carry_distance_or_time'));
      }
      // video: a search link only
      assert.ok(run(q => { lift(q).video = { kind: 'observed', url: 'https://www.youtube.com/watch?v=abc' }; }, 'V33').violations.some(v => v.args.rule === 'video_not_a_search_link'));
      assert.ok(run(q => { lift(q).video.url = 'https://vimeo.com/123'; }, 'V33').violations.length >= 1);
      assert.ok(run(q => { q.meta.why.push({ key: 'why.warmup', ref: 'x', args: { link: 'https://youtu.be/abc' } }); }, 'V33').violations.some(v => v.args.rule === 'third_party_link'));
    });

    it('R4-LIB-03: V32 (warn) - an incline-first plan whose vertical / mid-range push slot is turned to overhead presses is told; a competitive athlete and a kit with no incline press are not judged', () => {
      const IF = R.selection.incline_first;
      const overhead = model.bySlot(IF.bucket).find(e => (e.tags || []).includes('overhead') && !(e.tags || []).includes(IF.tag) && e.status === 'live_library_selectable');
      for (const n of ['06', '07', '08']) {
        const p = planOf(n);
        assert.equal(check(p.validation, 'V32').pass, true, n);
        const q = clone(p);
        for (const x of allItems(q)) if (x.it.bucket === IF.bucket && x.it.origin === 'template' && x.it.exercise_id) x.it.exercise_id = overhead.id;
        const res = check(validatePlan(q, model), 'V32');
        assert.equal(res.pass, false, n); assert.equal(res.severity, 'warn');
        assert.ok(unesc(renderPlan({ ...q, validation: validatePlan(q, model) }, model, { lang: 'en' })).includes(t('en', 'check.failed.V32')), 'the client reads it in plain words');
      }
      const fb = clone(planOf('02'));
      for (const x of allItems(fb)) if (x.it.bucket === IF.bucket && x.it.exercise_id) x.it.exercise_id = overhead.id;
      assert.equal(check(validatePlan(fb, model), 'V32').pass, true, 'a linebacker keeps overhead and incline pressing level');
      // a pick swapped to protect a pain area belongs to the pain rule (VOL-03): it is not read
      const pain = clone(planOf('06'));
      for (const x of allItems(pain)) if (x.it.bucket === IF.bucket && x.it.origin === 'template' && x.it.exercise_id) { x.it.exercise_id = overhead.id; x.it.flags = [...(x.it.flags || []), 'pain_swap']; }
      assert.equal(check(validatePlan(pain, model), 'V32').pass, true, 'pain swaps are not an incline miss');
      const nokit = clone(planOf('06'));
      nokit.meta.kit = { ...nokit.meta.kit, tokens: ['floor'], machines: [] };
      for (const x of allItems(nokit)) if (x.it.bucket === IF.bucket && x.it.exercise_id) x.it.exercise_id = overhead.id;
      assert.equal(check(validatePlan(nokit, model), 'V32').pass, true, 'no incline press in the kit');
    });
  });

  // ------------------------------------------------------------------------------------------------- Spanish
  describe(`v0.5 / V3 Spanish (${mname})`, () => {
    it('R2-GEN-08: every V3 line has its Spanish twin with the same placeholders; the reviewed lines are in the model; gym terms keep their English word in brackets', () => {
      const ph = (s) => [...new Set([...String(s).matchAll(/\{([a-z_]+)\}/g)].map(m => m[1]))].sort().join(',');
      // (G-211: the counting note's '-' sentence became its own legend line, printed only with a '-' cell - read in UI_W6)
      for (const [k, [en, es]] of Object.entries(UI_V3)) {
        if (k in UI_P7) continue; // (plain words, CH7-09 / G-315: a line the last words layer rewrote is checked in tests/v07-plain-words.test.mjs)
        if (k === 'ui.plan.weekly_sets_groups_note') { assert.ok(en.startsWith(model.i18n.en[k]) && model.i18n.en['ui.plan.sets_legend_dash'] && en.endsWith(model.i18n.en['ui.plan.sets_legend_dash'])); continue; }
        assert.equal(model.i18n.en[k], en, k); assert.equal(model.i18n.es[k], ES_REVIEW_V3[k] || es, k + ' (es)');
        assert.equal(ph(model.i18n.es[k]), ph(en), 'placeholders of ' + k);
        assert.ok(!/\b(vosotros|vuestr[oa]s?|coged|haced|ordenador|vale)\b/i.test(model.i18n.es[k]), k + ': not neutral Latin American');
      }
      for (const [k, es] of Object.entries(ES_REVIEW_V3)) if (model.has('en', k) && !(k in UI_P7)) { assert.equal(model.i18n.es[k], es, k); assert.equal(ph(es), ph(model.i18n.en[k]), 'placeholders of ' + k); }
      // one word per idea on the plan: the release is a 'liberación de responsabilidad', never a 'descargo'
      for (const [k, v] of Object.entries(model.i18n.es)) if (/^(ui\.plan\.|warning\.|release\.(short|who|label|own_risk|full_text_link))/.test(k)) assert.ok(!/descargo/i.test(v), k + ': ' + v);
      assert.match(model.i18n.es['ui.plan.easy_kind.conditioning_finisher'], /\(finisher\)/);
    });

    it('R2-GEN-08: a Spanish plan reads in Spanish from the release line to the footer (no English sentence of the new lines leaks in)', () => {
      for (const n of ['03', '05']) {
        const out = unesc(mdOf(n, 'es'));
        for (const k of ['ui.plan.progress_title', 'ui.plan.release_footer', 'ui.plan.sets_by_week_title', 'guide.adjust.sets']) assert.ok(out.includes(t('es', k)), `${n}: ${k}`);
        for (const k of Object.keys(UI_V3)) { const en = t('en', k); if (en.length > 25 && !/\{/.test(en)) assert.ok(!out.includes(en), `${n}: English line in a Spanish plan: ${en}`); }
      }
    });
  });
}

// ---------------------------------------------------------------------------------------------------- the benchmark scorer
describe('v0.5 / V3 benchmark scorer 2.0 (design/bench)', () => {
  const raw = readModelDir();
  const model = loadCompiledModel();
  it('CT-01: the scorer has no minutes-based metric, and the v0.5 rules each have one', { skip: !raw }, () => {
    assert.equal(SCORER_VERSION.split('.')[0], '2');
    const ids = METRICS.map(m => m.id);
    for (const gone of ['days_over_unwarned', 'days_over_band', 'minutes_recost_gap', 'overrun_minutes', 'length_invalid', 'format_minutes', 'day_spread', 'slack_while_untrained', 'groups_out_for_time', 'offer_invalid', 'exbudget_over', 'planned_step_over', 'weekly_rise_over', 'trained_not_climbing']) assert.ok(!ids.includes(gone), gone);
    for (const want of ['time_fields', 'skeleton_mismatch', 'template_lift_missing', 'session_size_over', 'target_not_reached', 'arrival_early', 'floor_misses', 'two_day_rule_misses', 'addon_picks', 'incline_share', 'liability_gate', 'video_links', 'progression_rule_missing', 'acceleration_unnoted', 'carry_dose']) assert.ok(ids.includes(want), want);
    const src = fs.readFileSync(path.join(ROOT, 'design', 'bench', 'score.mjs'), 'utf8');
    assert.ok(!/from ['"][^'"]*engine\//.test(src), 'the scorer never imports the engine');
    assert.ok(!/est_minutes|minutes_limit'\]|D\.limit|time_model|recostDay/.test(src.split('\n').filter(l => !/^\s*(\/\/|\*)/.test(l)).join('\n').replace(/'minutes_limit', 'supersets_needed'/, '')));
  });

  it('the 8 samples: every v0.5 acceptance row the scorer reads on one plan passes (templates, sizes, final sets, floors, no time fields, words, library, liability)', { skip: !raw }, () => {
    // (v0.5 fix round 2, converted - DECISIONS G: the scorer reads the sport profiles too - the fourth model part - to know a
    // change-of-direction sport, whose third-day knee slot is free of the two-leg pin; scorer 2.3, sample 03 major)
    const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });
    for (const n of SAMPLES) {
      const s = scorePlan(generate(sample(n), model), ctx, {});
      assert.equal(s.scored, true, n);
      for (const row of ['A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']) assert.notEqual(s.acceptance[row].pass, false, `${n} ${row}: ${JSON.stringify(s.acceptance[row])}`);
      for (const id of ['time_fields', 'skeleton_mismatch', 'liability_gate', 'video_links', 'progression_rule_missing']) assert.equal((s.metrics[id] || { value: 0 }).value, 0, `${n} ${id}`);
    }
  });

  it('the scorer self-test passes: one hand-broken plan per v0.5 rule is reported at the broken week, day and group', { skip: !raw }, () => {
    const r = spawnSync(process.execPath, [path.join(ROOT, 'design', 'bench', 'selftest.mjs')], { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    assert.equal(r.status, 0, r.stdout.split('\n').filter(l => /FAIL/.test(l)).join('\n') || r.stderr.slice(0, 600));
    assert.match(r.stdout, /\d+ passed, 0 failed/);
  });
});

function itemsOfRaw(day) { return day.blocks.flatMap(b => b.items); }
