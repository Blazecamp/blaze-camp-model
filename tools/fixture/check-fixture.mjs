#!/usr/bin/env node
// tools/fixture/check-fixture.mjs - structural checks of engine/fixtures/mini-model.json (or a model dir assembled the same way).
// Usage: node tools/fixture/check-fixture.mjs [path/to/model.json]. Exits 1 on any error. Owner: architect (B1 reuses it for model/).
import fs from 'node:fs';
import path from 'node:path';
import { BASE } from './catalog.mjs';

const file = process.argv[2] || path.join(BASE, 'engine', 'fixtures', 'mini-model.json');
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [], warns = [];
const BAND = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;
const exById = new Map(m.catalog.exercises.map(e => [e.id, e]));
const en = m.i18n.en, es = m.i18n.es;

// catalog
for (const e of m.catalog.exercises) {
  if (BAND.test(e.id) || BAND.test(en[e.name_key] || '')) errors.push(`band word in ${e.id}`);
  if (!(e.name_key in en)) errors.push(`missing EN name ${e.name_key}`);
  const cls = m.rules.credit.classes[e.credit_class];
  if (!cls) errors.push(`unknown credit class ${e.credit_class} on ${e.id}`);
  else if (JSON.stringify(cls) !== JSON.stringify(e.credits)) errors.push(`credits != class map on ${e.id}`);
  if (e.tags.includes('kb_swing') && e.slots.some(s => s.startsWith('RP_'))) errors.push(`KB swing in a resistance slot: ${e.id}`);
  if (e.tags.includes('kb_swing') && Object.keys(e.credits).length) errors.push(`KB swing credits muscles: ${e.id}`);
  if (e.tags.includes('thruster') && e.credit_class === 'THRUSTER' && e.credits.glutes !== 0.25) errors.push(`thruster glute credit != 0.25: ${e.id}`);
  for (const t of e.equipment.any_of.flat()) if (m.rules.equipment.banned_tokens.includes(t)) errors.push(`banned kit token ${t} on ${e.id}`);
  if (e.medball && e.medball.max_lb > 20) errors.push(`medball > 20 lb: ${e.id}`);
  if (e.tags.some(t => ['overhead_squat', 'low_bar'].includes(t)) && (e.older_ok || e.older_opt_in_ok)) errors.push(`older never-list leak: ${e.id}`);
  if (e.default_in_slots.some(s => !e.slots.includes(s))) errors.push(`default slot not in slots: ${e.id}`);
  if (/v[- ]?squat/i.test(e.id) || e.tags.includes('v_squat')) errors.push(`V-squat present: ${e.id}`);
}
// buckets have candidates
const bySlot = {};
for (const e of m.catalog.exercises) for (const s of e.slots) (bySlot[s] = bySlot[s] || []).push(e.id);
const textOnly = ['WARMUP_GENERAL', 'COMPLEX', 'TEST', 'CORE_OTHER'];
// templates
const usedBuckets = new Set();
let tCount = 0, stCount = 0;
for (const [fam, F] of Object.entries(m.templates.families)) for (const [d, t] of Object.entries(F.days)) {
  tCount++;
  const allDayTypes = [['main', t.day_types], ...Object.entries(t.variants).map(([n, v]) => [n, v.day_types])];
  for (const [vname, dts] of allDayTypes) for (const [k, dt] of Object.entries(dts)) {
    if (!(dt.label_key in en)) errors.push(`missing day label ${dt.label_key}`);
    // (v0.5, COACH-R4 R4-SES-05: the 'never 1 station of a group' warning is retired - a day follows the coach's template)
    for (const st of dt.stations) {
      stCount++; usedBuckets.add(st.bucket);
      if (!m.templates.buckets[st.bucket]) errors.push(`unknown bucket ${st.bucket} in ${t.id}/${vname}/${k}`);
    }
  }
  for (const [wd, v] of Object.entries(t.week_layout)) if (t.status === 'built' && ['main', 'optional'].includes(v.kind) && v.day_type && !(v.day_type in t.day_types)) errors.push(`${t.id}: ${wd} -> ${v.day_type} not in day_types`);
}
for (const b of usedBuckets) if (!textOnly.includes(b) && !(bySlot[b] || []).length && b !== 'CORE_OTHER') errors.push(`bucket ${b} has no catalog candidate`);
// profiles + picker
const sp = m.profiles.sports;
const alias = (id) => (m.profiles.id_aliases.profiles[id] || id);
for (const s of m.profiles.picker.sports) {
  if (s.default_profile && !sp[alias(s.default_profile)] && !s.routes_to) warns.push(`picker ${s.id}: default_profile ${s.default_profile} not a profile`);
  for (const p of s.positions) { for (const pid of [p.profile, ...Object.values(p.profile_by_choice || {})].filter(Boolean)) if (!sp[alias(pid)]) errors.push(`picker ${s.id}/${p.value}: profile ${pid} missing`); }
  if (!(s.name_key in en)) errors.push(`missing sport name ${s.name_key}`);
}
for (const a of m.profiles.picker.activities) if (a.profile && !sp[alias(a.profile)]) errors.push(`activity ${a.id}: profile ${a.profile} missing`);
for (const g of Object.values(m.profiles.goals)) if (!sp[g.default_profile]) warns.push(`goal default profile ${g.default_profile} not in sports`);
for (const p of Object.values(sp)) if (!(p.name_key in en)) errors.push(`missing profile name ${p.name_key}`);
// rules: stairway equals the spec reference curves (12 v1.1)
const s12 = m.rules.stairway.by_N['12'], s8 = m.rules.stairway.by_N['8'];
if (JSON.stringify(Object.values(s12.planned_effort)) !== JSON.stringify(['3', '3', '3', '3', '3', '3', '2', '2', '2', '1-2', '1-2', '1+'])) errors.push('12-week planned effort != spec');
if (JSON.stringify(Object.values(s8.planned_effort)) !== JSON.stringify(['3', '3', '3', '3', '2', '2', '1-2', '1+'])) errors.push('8-week planned effort != spec');
if (JSON.stringify(m.rules.stairway.phases_by_N['12'].L2) !== JSON.stringify({ ACCLIMATION: [1, 3], DRIVE: [4, 8], HARDEST: [9, 12] })) errors.push('12-week L2 phases != spec');
if (JSON.stringify(m.rules.athletic.stages.weeks_by_N['12']) !== JSON.stringify({ RC1: [1, 3], RC2: [4, 7], RC3: [8, 12] })) errors.push('RC weeks 12 != R2-ATH-03');
if (JSON.stringify(m.rules.athletic.stages.weeks_by_N['8']) !== JSON.stringify({ RC1: [1, 2], RC2: [3, 5], RC3: [6, 8] })) errors.push('RC weeks 8 != R2-ATH-03');
// lifestyle words never appear as intake/rule keys
const rulesStr = JSON.stringify(m.rules);
for (const w of ['"sleep', '"stress', 'hard_job', 'stress_high', 'sleep_lt6']) if (rulesStr.includes(w)) errors.push(`lifestyle input in rules: ${w}`);
if (/"sex"|"gender"/i.test(JSON.stringify(m))) errors.push('sex/gender key present');
// i18n
const esReview = new Set(m.i18n.es_review.missing_keys);
for (const k of Object.keys(en)) if (k !== '_meta' && !(k in es) && !esReview.has(k)) errors.push(`ES missing and not in es_review: ${k}`);
console.log(JSON.stringify({ file: path.relative(BASE, file), templates: tCount, stations: stCount, exercises: m.catalog.exercises.length, errors: errors.length, warnings: warns.length }));
for (const e of errors.slice(0, 60)) console.log('ERROR', e);
for (const w of warns.slice(0, 40)) console.log('WARN', w);
process.exit(errors.length ? 1 : 0);
