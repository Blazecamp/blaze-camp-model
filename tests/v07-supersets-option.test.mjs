// COACH-CH7 CH7-07: "More supersets" is the person's own choice at any level (DECISIONS G-313).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCompiledModel } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import * as B from '../app/intake-builder.js';

const model = await loadCompiledModel();
const paired = (plan) => plan.weeks[0].days.some(d => d.blocks.some(b => b.items.some(it => it.superset_id || it.superset)));
const build = (years, supersets) => generate(B.buildIntake({ ...B.defaultAnswers('2026-10-13'), goal: 'muscle', days: 4, weekdays: B.DEFAULT_WEEKDAYS[4].slice(), years, accepted: true, health: 'none', supersets }, { lang: 'en' }), model);

test('CH7-07: "More supersets" pairs the template\'s exercises at every level; "As planned" leaves them straight', () => {
  for (const years of [0.5, 2, 6]) {
    const more = build(years, 'more'), normal = build(years, 'normal');
    assert.equal(more.status, 'ok'); assert.ok(more.validation.ok);
    assert.ok(paired(more), `years ${years}: supersets with More`);
    assert.ok(!paired(normal), `years ${years}: straight sets as planned`);
  }
});

test('CH7-07: the wizard answer maps to prefs.supersets_for_fatigue and back', () => {
  const a = { ...B.defaultAnswers('2026-10-13'), goal: 'muscle', accepted: true, health: 'none' };
  assert.equal(B.defaultAnswers('2026-10-13').supersets, 'normal');
  assert.equal(B.buildIntake({ ...a, supersets: 'more' }, { lang: 'en' }).prefs.supersets_for_fatigue, true);
  assert.equal(B.buildIntake(a, { lang: 'en' }).prefs.supersets_for_fatigue, false);
});
