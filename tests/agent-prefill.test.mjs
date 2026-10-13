// tests/agent-prefill.test.mjs - the prefilled web link an agent hands out (app/prefill.js): answers in the URL fragment only,
// a round trip back to the same wizard answers, and never the release acceptance, the guardian or the health check (H20, R5-GEN-02).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as B from '../app/intake-builder.js';
import { encodePrefill, decodePrefill, prefillLink, NEVER_PREFILLED } from '../app/prefill.js';

const TODAY = '2026-10-13';
const def = () => B.defaultAnswers(TODAY);

test('prefill: a round trip gives the same answers (athlete, Spanish accents, pain, focus)', () => {
  const a = { ...def(), age: 17, weight: 61, unit: 'kg', years: 2, goal: 'athletic', days: 4, weekdays: ['Mon', 'Tue', 'Thu', 'Fri'], equipment: 'BASIC_GYM',
    sport: { ...def().sport, id: 'soccer', position: 'winger', season: 'next_season_start', season_date: '2027-02-01', practice: 3 },
    pain: [{ area: 'knee', severity: 'moderate' }], tests: ['jumps'], extras: ['medball'], start_date: '2026-10-19', weeks: 8 };
  const frag = encodePrefill(a, { lang: 'es' });
  assert.match(frag, /^#a=[A-Za-z0-9_-]+&l=es$/);
  const r = decodePrefill(frag, def());
  assert.equal(r.lang, 'es');
  for (const k of Object.keys(a)) if (!NEVER_PREFILLED.includes(k)) assert.deepEqual(r.answers[k], a[k], k);
  assert.deepEqual(r.ignored, []);
  assert.ok(r.touched.includes('detail') && r.touched.includes('pain'));
  // the same intake as the original answers once the person accepts and answers the health check on the page
  const done = { ...r.answers, health: 'none', accepted: true, guardian: true };
  assert.deepEqual(B.buildIntake(done, { lang: 'es' }), B.buildIntake({ ...a, health: 'none', accepted: true, guardian: true }, { lang: 'es' }));
});

test('prefill: accepted, guardian and the health check are never prefilled, even when the link says so', () => {
  const a = { ...def(), goal: 'general', accepted: true, guardian: true, health: 'some', safety: { ...def().safety, heart: true } };
  const frag = encodePrefill(a);
  const json = Buffer.from(frag.slice(3).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  for (const k of NEVER_PREFILLED) assert.ok(!(k in JSON.parse(json)), `${k} not carried`);
  // a hand-made link that tries
  const forged = '#a=' + Buffer.from(JSON.stringify({ goal: 'muscle', accepted: true, guardian: true, health: 'none', safety: { heart: true } })).toString('base64url');
  const r = decodePrefill(forged, def());
  assert.equal(r.answers.accepted, false);
  assert.equal(r.answers.guardian, false);
  assert.equal(r.answers.health, null);
  assert.deepEqual(r.answers.safety, def().safety);
  assert.equal(r.answers.goal, 'muscle');
  assert.deepEqual(r.ignored.sort(), ['accepted', 'guardian', 'health', 'safety']);
  assert.equal(B.stepBlocker('accept', r.answers), 'accept.required', 'the page still needs the person to accept');
  assert.equal(B.stepBlocker('health', r.answers), 'health.pick', 'and to answer the health check');
});

test('prefill: unknown keys, forbidden fields and bad values are ignored; not a prefill -> null', () => {
  const enc = (o) => '#a=' + Buffer.from(JSON.stringify(o)).toString('base64url');
  const r = decodePrefill(enc({ sex: 'f', sleep: 5, session_minutes: 45, goal: 'fly', days: 9, age: 200, weekdays: ['Mon', 'Xyz'], equipment: '<script>', focus: ['chest', 'nope', 'back', 'glutes'], pain: [{ area: 'knee', severity: 'awful' }] }), def());
  assert.ok(!('sex' in r.answers) && !('sleep' in r.answers) && !('session_minutes' in r.answers));
  assert.equal(r.answers.goal, null);
  assert.equal(r.answers.days, 3);
  assert.equal(r.answers.age, 30);
  assert.deepEqual(r.answers.weekdays, B.DEFAULT_WEEKDAYS[3], 'weekdays that do not match the day count -> the usual days');
  assert.equal(r.answers.equipment, 'FULL_GYM');
  assert.deepEqual(r.answers.focus, ['back', 'glutes'], 'at most 2 Focus slots');
  assert.deepEqual(r.answers.pain, []);
  for (const k of ['sex', 'sleep', 'session_minutes', 'goal', 'days', 'age', 'equipment']) assert.ok(r.ignored.includes(k), k);
  assert.equal(decodePrefill('', def()), null);
  assert.equal(decodePrefill('#top', def()), null);
  assert.equal(decodePrefill('#a=%%%', def()), null);
  assert.equal(decodePrefill('#a=' + 'x'.repeat(7000), def()), null);
});

test('prefill: the link keeps the site path, uses the fragment only, and carries only what differs from the defaults', () => {
  const link = prefillLink('https://plan.example.org/app/?x=1#old', { ...def(), goal: 'strength', days: 4, weekdays: [] }, { lang: 'en' });
  const u = new URL(link);
  assert.equal(u.origin + u.pathname + u.search, 'https://plan.example.org/app/?x=1');
  assert.match(u.hash, /^#a=/);
  const r = decodePrefill(u.hash, def());
  assert.equal(r.answers.goal, 'strength');
  assert.equal(r.answers.days, 4);
  assert.deepEqual(r.answers.weekdays, B.DEFAULT_WEEKDAYS[4]);
  assert.ok(link.length < 300, `short link (${link.length})`);
});
