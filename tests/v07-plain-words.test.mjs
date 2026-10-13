// tests/v07-plain-words.test.mjs - COACH-CH7 CH7-09 (coach_answers_chat_2026-10-13b.md): "all explanations should be elementary
// school reading comprehension". The words people read in the web tool (app/i18n.js) and in the plan (model/i18n, written by
// tools/fixture/v07-plain.mjs) stay at a plain reading level in English and Spanish, keep every placeholder, never touch
// [LEGAL REVIEW] copy or names, and change words only (DECISIONS G-315; report: reviews/plain-words-2026-10-13.md).
//
// Grades come from tools/readability.mjs: Flesch-Kincaid grade (EN) and the Fernández-Huerta ease put on a grade scale (ES), on
// strings of 8 words or more. Fernández-Huerta reads short Spanish lines a grade or so higher than Flesch-Kincaid reads the
// same English line (Spanish words have more syllables: "repeticiones" is 5), so the Spanish limits are one step looser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadStrings, gradeRows, summary, score, JARGON, LEGAL_KEYS, COACH_VERBATIM_KEYS, isGradedModelKey } from '../tools/readability.mjs';
import { UI_P7 } from '../tools/fixture/v07-plain.mjs';
import { STRINGS } from '../app/i18n.js';

const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const en = read('model/i18n/en.json');
const es = read('model/i18n/es.json');
const FIX = read('tests/fixtures/plain-words-placeholders.json');
const rows = gradeRows(await loadStrings());
const ph = (s) => [...new Set([...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(m => m[1]))].sort();

// the limits (CH7-09: about a 3rd-5th grade level)
const LIMIT = { en: { mean: 5, max: 8 }, es: { mean: 5.5, max: 9 } };
// above the per-string limit on purpose: a list of activity names, and a label of body parts ("Achilles") - names, not sentences
const GRADE_ALLOW = { en: ['intake.goal.opt.active', 'prehab.code.AGE_50_RACKET'], es: [] };
// a term on the jargon list is allowed only where the same line explains it (or names the coach's own technique and points to it)
const JARGON_ALLOW = new Set([
  'plan.stairway_intro', 'plan.stairway_intro_half', 'plan.stairway_intro_plain',   // "climbs like a stairway: small steps ..."
  'ui.plan.wod_format.amrap',                                                        // "AMRAP (as many rounds as you can)"
  'effort.myo', 'reps.myo', 'why.myo_last',                                           // the MYO set, spelled out on the exercise
  'effort.intensifier', 'effort.intensifier_days', 'effort.intensifier_days_one',
  'effort.drift_intensifier', 'effort.drift_intensifier_days', 'effort.drift_intensifier_days_one'   // "a MYO set (see the note on the exercise)"
]);

test('CH7-09 grades: the explanations read at about a 3rd-5th grade level (EN and ES)', () => {
  for (const lang of ['en', 'es']) {
    const s = summary(rows, lang);
    assert.ok(s.graded > 400, `${lang}: graded strings found (${s.graded})`);
    assert.ok(s.mean <= LIMIT[lang].mean, `${lang}: mean grade ${s.mean} > ${LIMIT[lang].mean}`);
    const key = lang === 'es' ? 'g_es' : 'g_en';
    const over = rows.filter(r => r[key] && r[key].grade > LIMIT[lang].max && !GRADE_ALLOW[lang].includes(r.key)).map(r => `${r.key} (${r[key].grade})`);
    assert.deepEqual(over, [], `${lang}: strings above grade ${LIMIT[lang].max}`);
  }
});

test('CH7-09 jargon: no unexplained jargon in the explanations (RIR, RPE, stairway, intensifier, plyometric, ballistic, deload ...)', () => {
  const hits = [];
  for (const r of rows) for (const [lang, s] of [['en', r.en], ['es', r.es]]) {
    if (!s || JARGON_ALLOW.has(r.key)) continue;
    const bad = JARGON[lang].filter(re => re.test(s));
    if (bad.length) hits.push(`${r.src} ${r.key} [${lang}] ${bad.map(String).join(' ')}`);
  }
  assert.deepEqual(hits, []);
});

test('CH7-09 placeholders: every rewritten line keeps exactly the placeholders it had', () => {
  assert.ok(Object.keys(FIX.model).length > 300 && Object.keys(FIX.app).length > 10, 'the recorded placeholder list is present');
  for (const [k, langs] of Object.entries(FIX.model)) for (const [lang, want] of Object.entries(langs)) {
    const table = lang === 'es' ? es : en;
    assert.ok(k in table, `model key still exists: ${k}`);
    assert.deepEqual(ph(table[k]), want, `model ${lang} ${k}`);
  }
  for (const [k, langs] of Object.entries(FIX.app)) for (const [lang, want] of Object.entries(langs)) {
    assert.ok(k in STRINGS[lang], `app key still exists: ${k}`);
    assert.deepEqual(ph(STRINGS[lang][k]), want, `app ${lang} ${k}`);
  }
  // and the two languages of every plain-words line ask for the same values
  for (const [k, [e, s]] of Object.entries(UI_P7)) assert.deepEqual(ph(s), ph(e), `EN / ES placeholders of ${k}`);
});

test('CH7-09 scope: words only - existing keys, no legal copy, no names, the coach\'s own lines untouched', () => {
  for (const [k, [e, s]] of Object.entries(UI_P7)) {
    assert.ok(k in en, `the layer rewrites an existing key only: ${k}`);
    assert.equal(en[k], e, `model EN carries the plain line: ${k}`);
    assert.equal(es[k], s, `model ES carries the plain line: ${k}`);
    assert.ok(isGradedModelKey(k, e, s) || /^(athletic\.key|plyo\.stage|plan\.(phase|block_type)|detail\.|ui\.plan\.label_part)\./.test(k), `an explanation key, not a name or legal copy: ${k}`);
    assert.ok(!LEGAL_KEYS.test(k) && !COACH_VERBATIM_KEYS.test(k), `never legal copy or the coach's own line: ${k}`);
    assert.ok(!/\[(LEGAL REVIEW|REVISIÓN LEGAL)/.test(e + s), `no legal marker in a plain line: ${k}`);
    assert.ok(!/^(exercise|sport|activity|profile|program|day|muscle|group|equipment|slot)\./.test(k), `no names: ${k}`);
  }
  // the [LEGAL REVIEW] copy is still in the model, verbatim and marked
  for (const k of ['warning.health_flag', 'ui.plan.health_warning', 'ui.plan.health_warning_short', 'warn.coach_bypass']) {
    assert.match(en[k], /\[LEGAL REVIEW/, k);
  }
  // the coach's warning sentence (COACH-R2 R2-ATH-08) is kept word for word
  for (const k of ['warn.older_athletic', 'warn.racket_50_impact']) assert.ok(en[k].endsWith('Make sure that you have a fitness professional to help you understand what this means.'), k);
  // English and Spanish of the app still hold the same keys (the other suites check it too)
  assert.deepEqual(Object.keys(STRINGS.es).sort(), Object.keys(STRINGS.en).sort());
});

test('CH7-09 scorer sanity: plain text scores low, dense text scores high (EN and ES)', () => {
  assert.ok(score('Do this week again before you move on. Never squeeze two days into one.', 'en').grade < 4);
  assert.ok(score('Reps and weight follow a rule you apply yourself, not a number this plan promises: when every set of a lift reaches the top of its reps with the planned reps left in the tank and good form, add weight next time.', 'en').grade > 12);
  assert.ok(score('Repite esa semana antes de seguir. Nunca juntes dos días en uno.', 'es').grade < 5);
  assert.ok(score('Las repeticiones y el peso siguen una regla que aplicas tú, no un número que este plan prometa: cuando todas las series de un ejercicio lleguen al tope de sus repeticiones, sube el peso.', 'es').grade > 7);
  assert.equal(score('Two words', 'en'), null, 'labels under 8 words are not graded');
});
