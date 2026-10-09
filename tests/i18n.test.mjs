// tests/i18n.test.mjs - CONTRACTS §1.6 / §8 / H14: every sample plan renders in EN and ES (all views, markdown and text)
// with no undefined, no unfilled {placeholder}, no raw key; every key used exists in EN and in ES (or es_review). Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generate, generateWith, realModulesStatus } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { STUB_DEPS } from './helpers/stub-modules.mjs';
import { loadFixtureModel, loadCompiledModel, allSamples } from './helpers/models.mjs';

const REAL = realModulesStatus().ready;
const LABEL = REAL ? 'real modules' : 'stub modules';
const gen = (intake, model) => (REAL ? generate(intake, model) : generateWith(STUB_DEPS, intake, model));
const KEY_TOKEN = /\b(?:why|note|exercise|warning|warn|changes|ui|plan|slot|block|effort|reps|rest|load|tests|day|profile|program|sport|activity|instruction|locked|check|muscle|group|weekday|level|season|conditioning|plyo|detail|warmup|refer|release|goal|intake|video|unit|health|felt|checkin|maint)\.[A-Za-z0-9_.\-/]+/g;

function problems(text, model) {
  const out = [];
  if (text.includes('undefined')) out.push('undefined');
  const ph = text.match(/\{[a-z_]+\}/g);
  if (ph) out.push('placeholder ' + ph[0]);
  for (const tok of text.match(KEY_TOKEN) || []) {
    const k = tok.replace(/[.)\]]+$/, '');
    if (model.has('en', k)) out.push('raw key ' + k);
    else if (/^tests\./.test(k)) out.push('missing key ' + k);   // a test id rendered as a key that does not exist
  }
  // engine codes never reach the reader (joint-care codes resolve through prehab.code.*)
  for (const code of [...Object.keys(model.rules.prehab.by_injury_code), 'AGE_50_RACKET']) {
    if (text.includes(code) || text.includes(code.replace(/_/g, '\\_'))) out.push('raw code ' + code);
  }
  return out;
}

function suite(label, model) {
  describe(label, () => {
    for (const { name, intake } of allSamples()) {
      test(`${name}: EN + ES, full / block / week / day views, markdown + text (${LABEL})`, () => {
        const plan = gen(intake, model);
        assert.equal(plan.status, 'ok');
        const h14 = plan.validation.checks.find(c => c.id === 'H14');
        assert.equal(h14.pass, true, JSON.stringify(h14.violations.slice(0, 5)));
        for (const lang of ['en', 'es']) {
          for (const view of ['full', 'block', 'week', 'day']) {
            const md = renderPlan(plan, model, { lang, view, weeks: view === 'day' ? [1] : 'all' });
            assert.ok(md.length > 200, `${lang}/${view} is empty`);
            assert.deepEqual(problems(md, model), [], `${lang}/${view}`);
          }
          const txt = renderPlan(plan, model, { lang, format: 'text' });
          assert.deepEqual(problems(txt, model), [], `${lang}/text`);
        }
        const es = renderPlan(plan, model, { lang: 'es' });
        assert.ok(es.includes(model.t('es', 'instruction.title')));
        assert.ok(!es.includes('## ' + model.t('en', 'instruction.title')) || model.t('en', 'instruction.title') === model.t('es', 'instruction.title'));
      });
    }
  });
}

suite('fixture model', loadFixtureModel());
const compiled = loadCompiledModel();
if (compiled) {
  suite('compiled model/', compiled);
  test('compiled model/: every key the 8 sample plans use has a real Spanish line (B1: missing_keys ends empty for them)', () => {
    const missing = new Set();
    for (const { intake } of allSamples()) {
      const plan = gen(intake, compiled);
      const keys = new Set();
      JSON.stringify(plan, (k, v) => { if ((k === 'key' || k.endsWith('_key')) && typeof v === 'string') keys.add(v); return v; });
      for (const k of keys) if (compiled.has('en', k) && !compiled.has('es', k)) missing.add(k);
    }
    assert.deepEqual([...missing].sort().slice(0, 20), []);
  });
} else test('compiled model/ suite', { skip: 'model/ not compiled yet' }, () => {});

test('the coach copy carries the round-2 meanings (effort 10 = successful max; no lifestyle question)', () => {
  const model = loadFixtureModel();
  assert.match(model.t('en', 'effort.ten'), /made it/);
  assert.ok(model.has('es', 'effort.ten') || model.i18n.es_review.missing_keys.includes('effort.ten'));
  assert.match(model.rules.stairway.checkin.effort_10_meaning, /successful/);
  assert.equal(model.rules.stairway.checkin.no_life_question, true);
  for (const k of ['instruction.title', 'instruction.1', 'instruction.2', 'instruction.3', 'instruction.4', 'instruction.5', ...model.rules.locked.map(l => l.key), ...model.rules.validation.checks.map(c => c.key)]) {
    assert.ok(model.has('en', k), k);
    assert.ok(model.has('es', k) || model.i18n.es_review.missing_keys.includes(k), k);
  }
});
