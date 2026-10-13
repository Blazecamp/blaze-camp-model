#!/usr/bin/env node
// tools/readability.mjs - reading-grade scores for the words people read (COACH-CH7 CH7-09: "all explanations should be
// elementary school reading comprehension"). No dependencies, deterministic. Used by tests/v07-plain-words.test.mjs and by the
// report reviews/plain-words-2026-10-13.md.
//
//   English: the Flesch-Kincaid grade, 0.39 x (words / sentences) + 11.8 x (syllables / words) - 15.59.
//   Spanish: the Fernández-Huerta ease, 206.84 - 60 x (syllables / words) - 1.02 x (words / sentences) (the corrected form), put on
//            a grade scale with its own published bands (80-90 "easy" = 5th grade, 70-80 = 6th, 60-70 = 7th-8th):
//            grade = 3.5 + (100 - ease) / 10.
// Sentences end at . ! ? or a line break. Placeholders ({n}, {exercise} ...) count as one short word. Markdown marks, links and
// the [LEGAL REVIEW] markers are removed first. Short labels (fewer than MIN_WORDS words) are not graded: a two-word heading has
// no sentence to read; they are checked for jargon instead (JARGON).
//
//   node tools/readability.mjs [--lang en|es] [--top 40] [--json]   lists the graded model + app strings, hardest first
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MIN_WORDS = 8;

/** strip what a reader never sees as words */
export function cleanText(s) {
  return String(s)
    .replace(/\[(?:LEGAL REVIEW|REVISIÓN LEGAL)[^\]]*\]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')            // markdown links -> their text
    .replace(/https?:\/\/\S+/g, 'link')
    .replace(/\{[a-zA-Z0-9_]+\}/g, 'X')                  // a placeholder reads as one short word
    .replace(/[*_`#>]/g, ' ')
    .replace(/\s+([.!?])/g, '$1');
}

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’%+-]*/gu;

/** @returns {string[]} sentences */
export function sentences(text) {
  return cleanText(text).split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => (s.match(WORD_RE) || []).length);
}
export function words(text) { return cleanText(text).match(WORD_RE) || []; }

/** English syllables: vowel groups, a silent final e, a floor of one; numbers and letter codes counted as said */
export function syllablesEn(word) {
  let w = word.toLowerCase().replace(/[’']s$/, '').replace(/[^a-z0-9]/g, '');
  if (!w) return 1;
  if (/^\d/.test(w)) return Math.min(3, Math.max(1, w.replace(/\D/g, '').length));   // "12" ~ 'twelve', "40" ~ 'for-ty'
  if (/^[A-Z]{2,4}$/.test(word) && !/[AEIOUY]/.test(word.slice(1))) return word.length; // RIR, RPE, DB are spelled out
  if (w === 'x') return 1;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

/** Spanish syllables: vowel nuclei, with i / u (unaccented) joining a neighbour as a diphthong */
export function syllablesEs(word) {
  const w = word.toLowerCase().normalize('NFC').replace(/[^a-záéíóúüñ0-9]/g, '');
  if (!w) return 1;
  if (/^\d/.test(w)) return Math.min(3, Math.max(1, w.replace(/\D/g, '').length));
  if (/^[A-Z]{2,4}$/.test(word) && !/[AEIOU]/.test(word.slice(1))) return word.length;
  const strong = /[aeoáéíóú]/;   // an accented i / u breaks the diphthong (día, baúl)
  let n = 0, prev = null;
  for (const ch of w.replace(/qu|gu(?=[eiéí])/g, 'q')) {
    const isV = /[aeiouáéíóúü]/.test(ch);
    if (!isV) { prev = null; continue; }
    if (prev === null) n += 1;
    else if (strong.test(prev) && strong.test(ch)) n += 1;   // hiatus: two strong vowels
    prev = ch;
  }
  return Math.max(1, n);
}

/** @returns {{words:number, sentences:number, syllables:number, grade:number, ease?:number}|null} null below MIN_WORDS */
export function score(text, lang = 'en', { min = MIN_WORDS } = {}) {
  const sent = sentences(text);
  const ws = words(text);
  if (ws.length < min) return null;
  const syl = ws.reduce((n, w) => n + (lang === 'es' ? syllablesEs(w) : syllablesEn(w)), 0);
  const wps = ws.length / Math.max(1, sent.length);
  const spw = syl / ws.length;
  if (lang === 'es') {
    const ease = 206.84 - 60 * spw - 1.02 * wps;
    return { words: ws.length, sentences: sent.length, syllables: syl, ease: round1(ease), grade: round1(Math.max(0, 3.5 + (100 - ease) / 10)) };
  }
  return { words: ws.length, sentences: sent.length, syllables: syl, grade: round1(Math.max(0, 0.39 * wps + 11.8 * spw - 15.59)) };
}
const round1 = (x) => Math.round(x * 10) / 10;

/** the longest sentence, in words */
export function longestSentence(text) { return Math.max(0, ...sentences(text).map(s => (s.match(WORD_RE) || []).length)); }

// ---------------------------------------------------------------- what is graded
// The model keys a person reads as explanations. Names (exercises, sports, activities, profiles, programs, days, muscles,
// equipment, slots), units and dates are names, not explanations; [LEGAL REVIEW] copy is used verbatim (AGENTS.md §11.4, §13);
// the coach's own 'Basic Instruction' lines are his words from his sheet, quoted as written (OBSERVED).
const NAME_NS = /^(exercise|sport|sport_group|activity|profile|program|day|muscle|group|equipment|slot|weekday|date|unit|list|cardio\.modality|pain\.area|tests\.|level\.L|goal\.|season\.|month)/;
export const LEGAL_KEYS = /^(release\.|health\.|privacy\.|refer\.reason\.|intake\.safety\.|intake\.health_route\.|warn\.coach_bypass$|warning\.coach_bypass$|warning\.health_flag$|ui\.disclaimer$|ui\.plan\.(coach_bypass_stamp|disclaimer)$|ui\.plan\.(release_|own_risk|health_warning|health_check))/;
export const COACH_VERBATIM_KEYS = /^instruction\.(\d+|cf\.\d+|2_sport_cardio)$/;
const LEGAL_MARK = /\[(?:LEGAL REVIEW|REVISIÓN LEGAL)/;

/** @returns {boolean} true when a model key is an explanation this check grades */
export function isGradedModelKey(key, en, es) {
  if (key === '_meta') return false;
  if (NAME_NS.test(key)) return false;
  if (LEGAL_KEYS.test(key) || COACH_VERBATIM_KEYS.test(key)) return false;
  if (LEGAL_MARK.test(String(en || '')) || LEGAL_MARK.test(String(es || ''))) return false;
  return true;
}
// app keys that are names, legal copy or brand words
export const APP_SKIP = /^(app\.(title|brand|sub|credit)|lang\.|brand\.|legal\.|release\.|disclaimer\.|accept\.(read|guardian|own_risk|terms|release)|health\.)/;

/** jargon a reader needs explained in plain words (CH7-09). A word on this list may appear only with its plain explanation. */
export const JARGON = {
  en: [/\bRIR\b/, /\bhypertrophy\b/i, /\bintensifier/i, /\bunilateral\b/i, /\bbilateral\b/i, /\baxial\b/i, /\bAMRAP\b/, /\bwork:rest\b/i, /\bballistic\b/i, /\bplyometric/i, /\bperiodi[sz]ation\b/i, /\bdeload/i, /\bstairway\b/i, /\bMYO\b/, /\bRPE\b/, /\bplyos?\b/i, /\bexposure\b/i],
  es: [/\bRIR\b/, /\bhipertrofia\b/i, /\bintensificador/i, /\bunilateral\b/i, /\bbilateral\b/i, /\baxial\b/i, /\bAMRAP\b/, /\bbal[íi]stic/i, /\bpliom[ée]tric/i, /\bperiodizaci[óo]n\b/i, /\bdescarga\b/i, /\bescalera\b/i, /\bMYO\b/, /\bRPE\b/, /\bexposici[óo]n\b/i]
};

// ---------------------------------------------------------------- loading
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..');

export async function loadStrings(root = ROOT) {
  const en = JSON.parse(fs.readFileSync(path.join(root, 'model/i18n/en.json'), 'utf8'));
  const es = JSON.parse(fs.readFileSync(path.join(root, 'model/i18n/es.json'), 'utf8'));
  const { STRINGS } = await import(pathToFileURL(path.join(root, 'app/i18n.js')).href);
  const rows = [];
  for (const k of Object.keys(en)) if (isGradedModelKey(k, en[k], es[k])) rows.push({ src: 'model', key: k, en: String(en[k]), es: es[k] === undefined ? null : String(es[k]) });
  for (const k of Object.keys(STRINGS.en)) if (!APP_SKIP.test(k)) rows.push({ src: 'app', key: k, en: String(STRINGS.en[k]), es: STRINGS.es[k] === undefined ? null : String(STRINGS.es[k]) });
  return rows;
}

export function gradeRows(rows) {
  return rows.map(r => ({ ...r, g_en: score(r.en, 'en'), g_es: r.es === null ? null : score(r.es, 'es') }));
}

export function summary(graded, lang) {
  const g = graded.map(r => (lang === 'es' ? r.g_es : r.g_en)).filter(Boolean).map(s => s.grade);
  const mean = g.reduce((a, b) => a + b, 0) / Math.max(1, g.length);
  const sorted = [...g].sort((a, b) => a - b);
  return { graded: g.length, mean: round1(mean), median: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0, above5: g.filter(x => x > 5).length, above8: g.filter(x => x > 8).length, max: sorted.length ? sorted[sorted.length - 1] : 0 };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const a = process.argv.slice(2);
  const lang = a.includes('--lang') ? a[a.indexOf('--lang') + 1] : 'en';
  const top = a.includes('--top') ? Number(a[a.indexOf('--top') + 1]) : 40;
  const graded = gradeRows(await loadStrings());
  if (a.includes('--json')) { process.stdout.write(JSON.stringify({ en: summary(graded, 'en'), es: summary(graded, 'es'), rows: graded }, null, 1) + '\n'); }
  else {
    console.log('EN', JSON.stringify(summary(graded, 'en')), '\nES', JSON.stringify(summary(graded, 'es')));
    const key = lang === 'es' ? 'g_es' : 'g_en';
    for (const r of graded.filter(r => r[key]).sort((x, y) => y[key].grade - x[key].grade).slice(0, top)) console.log(r[key].grade.toFixed(1).padStart(5), r.src, r.key, '|', (lang === 'es' ? r.es : r.en).slice(0, 160));
  }
}
