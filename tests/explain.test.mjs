// tests/explain.test.mjs - engine/explain.mjs (CONTRACTS §4.10). Owner: B4.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { whyText, explainItem, levelText, changesText, stairText, resolveArgs } from '../engine/explain.mjs';
import { loadFixtureModel } from './helpers/models.mjs';

const model = loadFixtureModel();
const plan = JSON.parse(fs.readFileSync(new URL('./fixtures/plan-min.json', import.meta.url), 'utf8'));

test('whyText = translated text + [ref], args resolved', () => {
  assert.equal(whyText({ key: 'why.two_spine_days', ref: 'R2-SES-01', args: { pattern: 'squat' } }, model, 'en'), 'Heavy squat and heavy deadlift on different days [R2-SES-01]');
  assert.equal(whyText({ key: 'why.floor_10', ref: 'R2-VOL-06', args: { muscle: 'quads' } }, model, 'en'), 'At least 10 weekly sets for Quads [R2-VOL-06]');
  assert.match(whyText({ key: 'why.floor_10', ref: 'R2-VOL-06', args: { muscle: 'quads' } }, model, 'es'), /\[R2-VOL-06\]$/);
  assert.equal(whyText(null, model, 'en'), '');
});

test('resolveArgs turns ids into words (weekday, muscle, exercise, area, key-valued args) and keeps codes', () => {
  const a = resolveArgs({ day: 'Mon', muscle: 'lats_upper_back', exercise: 'front-squat-barbell', area: 'knee', advice: 'ui.plan.schedule_advice.more_days', version: 'release.client', n: 3 }, model, 'en');
  assert.equal(a.day, 'Monday');
  assert.equal(a.muscle, 'Back (lats / upper back)');
  assert.equal(a.exercise, model.t('en', model.ex('front-squat-barbell').name_key));
  assert.equal(a.area, 'Knee');
  assert.equal(a.advice, 'add a training day');
  assert.equal(a.version, 'release.client');
  assert.equal(a.n, 3);
  assert.equal(resolveArgs({ muscles: ['quads', 'chest'] }, model, 'en').muscles, 'Quads, Chest');
  assert.equal(resolveArgs({ day: 'Thu' }, model, 'es').day, model.t('es', 'weekday.Thu'));
});

test('levelText: "Intermediate (L2): 2 years of consistent training" (PRG-05)', () => {
  assert.equal(levelText(plan, model, 'en'), 'Intermediate (L2): 2 years of consistent training');
  assert.match(levelText(plan, model, 'es'), /L2/);
  assert.equal(levelText({ meta: {} }, model, 'en'), '');
});

test('changesText: words, never percentages (VOL-06)', () => {
  const en = changesText(plan, 3, model, 'en');
  assert.deepEqual(en, ['+1 set on ' + model.t('en', model.ex('front-squat-barbell').name_key) + ' (Monday)',
    '+1 set on ' + model.t('en', model.ex('barbell-deadlift-conventional').name_key) + ' (Thursday)']);
  const withPct = structuredClone(plan);
  withPct.weeks[2].changes.push({ key: 'why.stairway_step', args: { pct: 5, part: 'late' } });
  for (const s of changesText(withPct, 3, model, 'en')) assert.ok(!/%/.test(s.replace('{pct}', '')) || !/\d%/.test(s), s);
  assert.deepEqual(changesText(plan, 1, model, 'en'), []);
  assert.equal(changesText(plan, 99, model, 'en').length, 0);
});

test('stairText: the week as an effort level, whole numbers without a decimal (v1.2, review 08 minor 16: never "a 8.0")', () => {
  assert.equal(stairText(plan, 1, model, 'en'), 'Effort level this week: 2 (2 = start, 11 = a little past your limits)');
  assert.match(stairText(plan, 2, model, 'en'), /5\.4/);
  assert.match(stairText(plan, 3, model, 'es'), /: 11 \(/);
  assert.ok(!/ a (8|11)/.test(stairText(plan, 3, model, 'en')));
  assert.equal(stairText(plan, 42, model, 'en'), '');
});

test('explainItem lists the item reasons first, then the day and week reasons, deduplicated', () => {
  const lines = explainItem(plan, { week: 1, weekday: 'Mon', slot_id: 'Mon.A.s08' }, model, 'en');
  assert.ok(lines.length >= 4);
  assert.equal(lines[0], 'Heavy squat and heavy deadlift on different days [R2-SES-01]');
  assert.ok(lines.some(l => l.endsWith('[R2-VOL-03]')));
  assert.equal(new Set(lines).size, lines.length);
  assert.deepEqual(explainItem(plan, { week: 1, weekday: 'Mon', slot_id: 'nope' }, model, 'en'), []);
});
