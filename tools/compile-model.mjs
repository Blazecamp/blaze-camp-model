#!/usr/bin/env node
// tools/compile-model.mjs - B1: compiles the read-only sources into the runtime model files (engine/CONTRACTS.md §3).
// Usage: node tools/compile-model.mjs [--out <dir>] [--quiet]        (default --out model)
// Reads: generator_spec_v1.json, coach_answers_round2.md, synthesis/02, 03, 04, 05, 06, 10, 11, 12 (never writes there).
// Writes: manifest.json catalog.json rules.json templates.json profiles.json i18n/en.json i18n/es.json i18n/es_review.json
//         MODEL_VERSION CHANGELOG.md COMPILE_REPORT.json
// Deterministic: no clock, no randomness, sorted output; a re-compile of the same sources is byte-identical.
// Exits 1 (and writes nothing) on any contract error: engine assertModel + tools/check-model.mjs checks + coach-patch targets.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASE, SOURCE_FILES, loadSources, sortKeys } from './compile/sources.mjs';
import { normalizeExercise, cleanName, cleanNameFixture, isActive, ACTIVE_TYPES } from './compile/catalog.mjs';
import { buildRules } from './compile/rules.mjs';
import { BUCKETS, normTemplate, normSport, normPicker, GOALS, PROGRAM_NAMES } from './compile/templates-profiles.mjs';
import { applyCoachPatches } from './compile/patches.mjs';
import { crossCheckRules } from './compile/crosscheck.mjs';
import { buildI18n } from './compile/i18n.mjs';
import { checkModel, readFixture } from './check-model.mjs';
import { amendExercise, amendRules, amendTemplates, amendSport } from './fixture/review-v12.mjs';
import { amendRulesR3, R3_VERSION } from './fixture/round3.mjs';
import { amendExerciseB2, amendSportB2, amendRulesB2, amendTemplatesB2, amendProgramNamesB2 } from './fixture/athletic-b2.mjs';
import { amendExerciseB3, amendRulesB3 } from './fixture/render-b3.mjs';
import { amendRulesB4 } from './fixture/integrate-b4.mjs';
import { amendRulesF1 } from './fixture/fix-r1-f1.mjs';
import { amendRulesF2, amendSportF2 } from './fixture/fix-r1-f2.mjs';
import { amendRulesF3, amendExerciseF3 } from './fixture/fix-r1-f3.mjs';
import { amendRulesR2F1, amendTemplatesR2F1 } from './fixture/fix-r2-f1.mjs';
import { amendRulesR2F2, amendSportR2F2, amendExerciseR2F2 } from './fixture/fix-r2-f2.mjs';
import { amendRulesR2F3, amendExerciseR2F3 } from './fixture/fix-r2-f3.mjs';
import { amendRulesV05, amendTemplatesV05 } from './fixture/v05-structure.mjs';
import { amendRulesV3, CHECKS_V3, REMOVED_V3, ES_REVIEW_V3 } from './fixture/v05-words.mjs';
import { amendExerciseV2, addedExercisesV2, attachVideoSearchV2, amendBucketsV2, amendSportV2, amendRulesV2, UI_V2 } from './fixture/v05-library.mjs';
import { amendRulesV4, amendTemplatesV4, amendExerciseV4 } from './fixture/v05-integrate.mjs';
import { amendRulesX1, amendTemplatesX1, amendExerciseX1, amendSportX1 } from './fixture/v05-fix1.mjs';
import { amendRulesX2, amendTemplatesX2, amendExerciseX2, amendSportX2 } from './fixture/v05-fix2.mjs';
import { amendRulesV06, amendSportV06 } from './fixture/v06-volume.mjs';
import { amendRulesW6 } from './fixture/v06-words.mjs';
import { amendRulesS6, amendTemplatesS6, amendExerciseS6, amendSportS6 } from './fixture/v06-select.mjs';
import { amendRulesV07, amendExerciseV07 } from './fixture/v07-volume.mjs';
import { amendRulesW7, V07_MODEL_VERSION } from './fixture/v07-words.mjs';
import { amendRulesV07 as amendRulesS7, amendTemplatesV07, amendExerciseV07 as amendExerciseS7, addedExercisesV07, amendSportV07, UI_V07 as UI_S7 } from './fixture/v07-select.mjs';

// 1.3.0: the v1.2 sources (round-3 docs) + the coach-eye review amendments (tools/fixture/review-v12.mjs) + the round-3 engine
// amendments (tools/fixture/round3.mjs: lines / groups, time check, Focus muscles, check-ins retired) + the stage-B2 athletic
// amendments (tools/fixture/athletic-b2.mjs: contact responses, sport-only drills, the athletic stairway, R3-ATH-01 / 02 defaults)
// 1.4.0: the round-5 answers and the chat answers CH5 / CH6 (coach_answers_round5.md, coach_answers_chat_2026-10-11.md,
// coach_answers_chat_2026-10-13.md) through the v0.6 and v0.7 layers (engine 0.7.0). R3_VERSION stays the round-3 layer's own value.
export const MODEL_VERSION = V07_MODEL_VERSION;
export const CONTRACTS_VERSION = '1.1.0';

const DROP_RULES = {
  out_of_scope: 'EQ-01 / EQ-12 (band, chain, weight-releaser and other out-of-scope items)',
  retired: 'LIB-09 / LIB-17 / R2-LIB-06 (retired or merged by the coach)',
  taxonomy_placeholder: 'CONTRACTS §3.2 (taxonomy node, not an exercise)',
  modifier: 'CONTRACTS §3.2 (set / tempo modifier, applied by dose rules)',
  variant_rule: 'CONTRACTS §3.2 (variation rule, R2-LIB-01)',
  progression_note: 'CONTRACTS §3.2 (progression note)',
  generic_choice: "CONTRACTS §3.2 (generic 'any X' choice; the slot is the choice)",
  complex: 'CONTRACTS §3.2 / D-21 v1.0 (contrast complexes: Phase 1)',
  not_eligible: '02 v1.1 generator.eligible = false',
  band_only: 'EQ-01 (every setup needs a band)',
  removed: 'R2-LIB-06 (21.6-mile run removed from plans and tests)'
};

function dropReason(r) {
  if (/21-6-mile|21\.6/.test(r.id)) return 'removed';
  if (!ACTIVE_TYPES.includes(r.record_type)) return r.record_type;
  if (r.status === 'retired') return 'retired';
  return 'not_eligible';
}

/**
 * Compile the model in memory.
 * @param {object} [S] sources (loadSources())
 * @returns {{raw: object, report: object, changelog: string, errors: string[], warnings: string[]}}
 */
export function compileModel(S = loadSources()) {
  const errors = [];
  // ---------------------------------------------------------------- catalog
  const exercises = [], dropped = [], aliases = {}, enNames = {}, enCues = {}, nameCleanups = [];
  const src = new Map(S.cat.map(r => [r.id, r]));
  const activeSourceIds = new Set();
  for (const r of S.cat) {
    if (!isActive(r)) { const reason = dropReason(r); dropped.push({ source_id: r.id, reason, rule: DROP_RULES[reason] || null }); continue; }
    const ex = normalizeExercise(r);
    if (!ex) { dropped.push({ source_id: r.id, reason: 'band_only', rule: DROP_RULES.band_only }); continue; }
    activeSourceIds.add(r.id);
    exercises.push(ex);
    if (ex.id !== ex.source_id) aliases[ex.source_id] = ex.id;
    enNames[ex.name_key] = cleanName(r);
    const fixtureName = cleanNameFixture(r);
    if (fixtureName !== enNames[ex.name_key]) nameCleanups.push({ id: ex.id, from: fixtureName, to: enNames[ex.name_key] });
    if (ex.cue_key) enCues[ex.cue_key] = r.coach_cues[0].cue;
  }
  exercises.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  dropped.sort((a, b) => (a.source_id < b.source_id ? -1 : 1));
  const exMap = new Map(exercises.map(e => [e.id, e]));
  const patched = applyCoachPatches({ src, ex: exMap, en: enNames, dropped, aliases, activeSourceIds, nameCleanups });
  for (const e of patched.errors) errors.push(`coach patch: ${e}`);
  for (let i = 0; i < exercises.length; i++) exercises[i] = amendExerciseX2(amendExerciseX1(amendExerciseV4(amendExerciseV2(amendExerciseR2F3(amendExerciseR2F2(amendExerciseF3(amendExerciseB3(amendExerciseB2(amendExercise(exercises[i])))))))))); // (+ v0.5 fix round 2, v05-fix2.mjs) // (+ v0.5 fix round 1, v05-fix1.mjs) // (+ fix round 2 / F3, fix-r2-f3.mjs) // (+ fix round 2 / F2, fix-r2-f2.mjs) // (+ F3, fix-r1-f3.mjs) // v1.2 review amendments, stage B2 (athletic-b2.mjs), then stage B3 (render-b3.mjs)

  for (let i = 0; i < exercises.length; i++) exercises[i] = amendExerciseS6(exercises[i]); // engine 0.6 / selection (v06-select.mjs)
  for (let i = 0; i < exercises.length; i++) exercises[i] = amendExerciseV07(exercises[i]); // engine 0.7 / volume: the high-incline press credits (v07-volume.mjs, R5-VOL-01)
  for (let i = 0; i < exercises.length; i++) exercises[i] = amendExerciseS7(exercises[i]); // engine 0.7 / selection (v07-select.mjs)
  // engine 0.5.0 / V2: the two mid-range pull records (R4-LIB-03; optional add-ons, tools/fixture/v05-library.mjs)
  const addedV2 = addedExercisesV2(exercises);
  for (const e of addedV2) { exercises.push(e); enNames[e.name_key] = UI_V2[e.name_key][0]; }
  for (const e of addedExercisesV07(exercises)) { exercises.push(e); enNames[e.name_key] = UI_S7[e.name_key][0]; } // engine 0.7: assisted jumps (R5-GRD-08), the WOD run station (R5-GRD-04) (v07-select.mjs)
  exercises.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  // ---------------------------------------------------------------- templates (all 30 + variants)
  const families = {};
  for (const [fam, s] of Object.entries(S.tpl.generator_split_templates)) {
    families[fam] = { pairing: s.pairing_mode, default_minutes: s.default_minutes, notes: s.family_notes, days: {} };
    for (const d of ['2', '3', '4', '5', '6']) if (s[d]) families[fam].days[d] = normTemplate(fam, d, s[d]);
  }
  { const amended = amendTemplates(families); for (const k of Object.keys(families)) families[k] = amended[k]; }
  { const b2 = amendTemplatesB2(families); for (const k of Object.keys(families)) families[k] = b2[k]; } // R3-ATH-03 HYROX variant (athletic-b2.mjs)
  { const r2 = amendTemplatesR2F1(families); for (const k of Object.keys(families)) families[k] = r2[k]; } // fix round 2 / F1: athletic.3 cross pattern (fix-r2-f1.mjs)
  { const v5 = amendTemplatesV05(families); for (const k of Object.keys(families)) families[k] = v5[k]; } // engine 0.5.0 / V1: the coach's templates as the skeleton, ranks, no minutes (v05-structure.mjs)
  { const v4 = amendTemplatesV4(families); for (const k of Object.keys(families)) families[k] = v4[k]; } // engine 0.5.0 / V4: push / pull / legs in the sheet's order, a warm-up on every main day (v05-integrate.mjs)
  { const x1 = amendTemplatesX1(families); for (const k of Object.keys(families)) families[k] = x1[k]; } // engine 0.5.0 / fix round 1 (v05-fix1.mjs)
  { const x2 = amendTemplatesX2(families); for (const k of Object.keys(families)) families[k] = x2[k]; } // engine 0.5.0 / fix round 2 (v05-fix2.mjs)
  { const s6 = amendTemplatesS6(families); for (const k of Object.keys(families)) families[k] = s6[k]; } // engine 0.6 / selection: the athletic A / B arm slot (v06-select.mjs)
  { const v7 = amendTemplatesV07(families); for (const k of Object.keys(families)) families[k] = v7[k]; } // engine 0.7 / selection: 2 days = two full-body days, R5-GEN-01 (v07-select.mjs)
  const templates = {
    schema: 'templates/2',
    buckets: amendBucketsV2(BUCKETS), // V2: carries and sled work sit with conditioning (R4-LIB-02)
    goal_to_family: { muscle: 'aesthetics', strength: 'strength', athletic: 'athletic', active: 'athletic', fat_loss: 'fat_loss_bootcamp', general: 'fat_loss_bootcamp', hybrid: 'hybrid_crossfit' },
    kit_family_override: { profiles: ['BODYWEIGHT', 'FIELD_TRACK_NO_KIT'], family: 'no_equipment', except_goals: ['athletic', 'active'] },
    families,
    program_names: amendProgramNamesB2(PROGRAM_NAMES)
  };
  const allTemplates = Object.values(families).flatMap(f => Object.values(f.days));
  const stationCount = allTemplates.reduce((n, t) => n + [t.day_types, ...Object.values(t.variants).map(v => v.day_types)].reduce((m, d) => m + Object.values(d).reduce((k, dt) => k + dt.stations.length, 0), 0), 0);

  // ---------------------------------------------------------------- profiles (all 127 + picker + activities)
  const classEnd = { 1: 0.75, 2: 0.6, 3: 0.5, 4: 0.4, 5: 0.25 };
  const sports = {};
  for (const p of S.prof.profiles.slice().sort((a, b) => (a.id < b.id ? -1 : 1))) sports[p.id] = amendSportV06(amendSportX2(amendSportX1(amendSportV2(amendSportR2F2(amendSportF2(amendSportB2(amendSport(normSport(p, classEnd), p), p), p)), p), p), p), p); // (+ v0.6 volume, v06-volume.mjs) // (+ v0.5 fix round 2) // (+ v0.5 fix round 1) // (+ V2: the confidence label, R4-SCP-03) // (+ fix round 2 / F2) // (+ F2)
  for (const k of Object.keys(sports)) sports[k] = amendSportS6(sports[k]); // engine 0.6 / selection (v06-select.mjs)
  for (const k of Object.keys(sports)) sports[k] = amendSportV07(sports[k]); // engine 0.7 / selection (v07-select.mjs)
  const picker = normPicker(S.prof);
  const profiles = {
    schema: 'profiles/2',
    goals: GOALS,
    sports,
    picker,
    goal_defaults: S.prof.goal_defaults,
    age_overlays: Object.fromEntries(Object.keys(S.prof.age_overlays).map(k => [k, { when: S.prof.age_overlays[k].when, scope: S.prof.age_overlays[k].scope }])),
    id_aliases: { profiles: S.prof.id_aliases.profiles || {}, sports: S.prof.id_aliases.sports || {} },
    recreational_profile: 'weekend_warrior'
  };

  // ---------------------------------------------------------------- rules + cross-checks against the sources
  const rules = amendRulesW6(amendRulesV06(amendRulesX2(amendRulesX1(amendRulesV4(amendRulesV3(amendRulesV2(amendRulesV05(amendRulesR2F3(amendRulesR2F2(amendRulesR2F1(amendRulesF3(amendRulesF2(amendRulesF1(amendRulesB4(amendRulesB3(amendRulesB2(amendRulesR3(amendRules(buildRules(S.eqm)))))))))))))))))))); /* (+ v0.6 words, v06-words.mjs) (+ v0.6 volume, v06-volume.mjs) (+ v0.5 fix round 2, v05-fix2.mjs) (+ v0.5 fix round 1, v05-fix1.mjs) (+ V3, v05-words.mjs) */ // (+ V2, v05-library.mjs) (+ fix round 2 / F3, fix-r2-f3.mjs) // (+ fix round 2 / F2, fix-r2-f2.mjs) // (+ fix round 2 / F1, fix-r2-f1.mjs) // (+ fix round 1 / F1, F2, F3) v1.2 review amendments, the round-3 answers, stage B2 (athletic), stage B3 (selection / render), then stage B4 (integration)
  { const s6 = amendRulesS6(rules); for (const k of Object.keys(rules)) delete rules[k]; Object.assign(rules, s6); } // engine 0.6 / selection (v06-select.mjs), after fix round 2
  { const v7 = amendRulesV07(rules); for (const k of Object.keys(rules)) delete rules[k]; Object.assign(rules, v7); } // engine 0.7 / volume (v07-volume.mjs), after the v0.6 layers
  { const s7 = amendRulesS7(rules); for (const k of Object.keys(rules)) delete rules[k]; Object.assign(rules, s7); } // engine 0.7 / selection (v07-select.mjs), after the v0.6 layers
  { const w7 = amendRulesW7(rules); for (const k of Object.keys(rules)) delete rules[k]; Object.assign(rules, w7); } // engine 0.7 / words (v07-words.mjs), after the v0.6 layers
  // a mismatch is a warning, not an error: rules.json must deep-equal the fixture's normative rules (BUILD_PLAN B1.2);
  // a value we believe is wrong goes to engine/CONTRACT_REQUESTS.md for the integrator
  const crosschecks = crossCheckRules(rules, S);
  const warnings = crosschecks.filter(c => c.status === 'mismatch' || c.status === 'source_missing').map(c => `cross-check ${c.id} ${c.status} (${c.source}: ${c.what}): ${c.detail || ''}`);

  // ---------------------------------------------------------------- i18n
  const i18n = buildI18n({ spec: S.spec, prof: S.prof, families, exercises, enNames, enCues });
  for (const p of i18n.problems) errors.push(`i18n: ${p}`);
  attachVideoSearchV2(exercises, i18n.en); // R4-LIB-05: a YouTube search link built from the final English name (v05-library.mjs)
  patched.patches.push({ id: 'P16', refs: ['FIX-03', 'FIX-04'], target: 'user-facing EN day labels, coach cues and profile names', rule: "decoder notes removed from rendered text ('(complete)', '(corrected)', '(OT02 Day 3)', 'INFERRED', '(COACH-R2 ...)', 'the BYOP cell says ...', 'bodyweight pools'); templates.label stays verbatim", action: i18n.cleaned_en.length ? 'applied' : 'verified', counts: { strings_cleaned: i18n.cleaned_en.length } });
  for (const c of i18n.cleaned_en) patched.changes.push({ patch: 'P16', id: c.key, field: 'en', from: c.from, to: c.to });

  // ---------------------------------------------------------------- assemble
  const templateCount = allTemplates.length;
  const manifest = {
    schema: 'manifest/2',
    model_version: MODEL_VERSION,
    spec_version: S.spec._meta.version,
    contracts_version: CONTRACTS_VERSION,
    files: { catalog: 'catalog.json', rules: 'rules.json', templates: 'templates.json', profiles: 'profiles.json', i18n: { en: 'i18n/en.json', es: 'i18n/es.json', es_review: 'i18n/es_review.json' } },
    languages: ['en', 'es'], default_lang: 'en',
    counts: { exercises: exercises.length, templates: templateCount, profiles: Object.keys(sports).length, sports_in_picker: picker.sports.length, activities: picker.activities.length },
    sources_sha256: Object.fromEntries(SOURCE_FILES.map(f => [f, S.sha[f]]))
  };
  const catalog = { schema: 'catalog/2', model_version: MODEL_VERSION, id_aliases: Object.fromEntries(Object.entries(aliases).sort(([a], [b]) => (a < b ? -1 : 1))), exercises };
  const raw = { manifest, catalog, rules, templates, profiles, i18n: { en: i18n.en, es: i18n.es, es_review: i18n.es_review } };

  // ---------------------------------------------------------------- fixture comparison (informational; rules must be equal)
  const fixture = readFixture();
  const fixtureDiff = fixture ? diffAgainstFixture(raw, fixture) : null;

  // ---------------------------------------------------------------- report
  const droppedBy = {};
  for (const d of dropped) droppedBy[d.reason] = (droppedBy[d.reason] || 0) + 1;
  const report = {
    schema: 'compile_report/1',
    model_version: MODEL_VERSION,
    contracts_version: CONTRACTS_VERSION,
    spec_version: S.spec._meta.version,
    counts: {
      source_records: S.cat.length,
      kept: exercises.length,
      added_v2: addedV2.length,
      dropped: dropped.length,
      dropped_by_reason: sortKeys(droppedBy),
      aliases: Object.keys(aliases).length,
      templates_total: templateCount,
      templates_built: allTemplates.filter(t => t.status === 'built').length,
      templates_unbuilt: allTemplates.filter(t => t.status === 'unbuilt').length,
      template_variants: allTemplates.reduce((n, t) => n + Object.keys(t.variants).length, 0),
      stations: stationCount,
      profiles: Object.keys(sports).length,
      sports_in_picker: picker.sports.length,
      activities: picker.activities.length,
      en_keys: i18n.stats.en_keys,
      es_keys: i18n.stats.es_keys,
      es_missing: i18n.stats.es_missing,
      es_machine_translated: i18n.stats.es_machine_translated,
      coach_patches: patched.patches.length,
      coach_patch_record_changes: patched.changes.length
    },
    templates: { built: allTemplates.filter(t => t.status === 'built').map(t => t.id), unbuilt: allTemplates.filter(t => t.status === 'unbuilt').map(t => t.id) },
    coach_patches: patched.patches,
    crosschecks,
    i18n: { es_by_source: i18n.stats.es_by_source, machine_translated_by_namespace: i18n.stats.machine_translated_by_namespace, missing_keys: i18n.es_review.missing_keys, unused_translation_rows: i18n.stats.unused_translation_rows },
    fixture_diff: fixtureDiff,
    dropped
  };
  const changelog = renderChangelog(raw, report, patched.changes);
  return { raw, report, changelog, errors, warnings };
}

/** informational diff of the compiled model against engine/fixtures/mini-model.json */
function diffAgainstFixture(raw, fx) {
  const byId = new Map(fx.catalog.exercises.map(e => [e.id, e]));
  const fieldCounts = {}, changedRecords = new Set();
  for (const e of raw.catalog.exercises) {
    const f = byId.get(e.id);
    if (!f) { changedRecords.add(e.id); fieldCounts.__added = (fieldCounts.__added || 0) + 1; continue; }
    for (const k of Object.keys(e)) if (JSON.stringify(e[k]) !== JSON.stringify(f[k])) { fieldCounts[k] = (fieldCounts[k] || 0) + 1; changedRecords.add(e.id); }
  }
  const ids = new Set(raw.catalog.exercises.map(e => e.id));
  const removed = fx.catalog.exercises.filter(e => !ids.has(e.id)).map(e => e.id);
  const enChanged = Object.keys(fx.i18n.en).filter(k => k !== '_meta' && k in raw.i18n.en && raw.i18n.en[k] !== fx.i18n.en[k]).sort();
  const esChanged = Object.keys(fx.i18n.es).filter(k => k !== '_meta' && k in raw.i18n.es && raw.i18n.es[k] !== fx.i18n.es[k]).sort();
  const enAdded = Object.keys(raw.i18n.en).filter(k => !(k in fx.i18n.en)).sort();
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  return {
    rules_equal: same(raw.rules, fx.rules),
    templates_equal: same(raw.templates, fx.templates),
    profiles_equal: same(raw.profiles, fx.profiles),
    catalog_id_aliases_equal: same(raw.catalog.id_aliases, fx.catalog.id_aliases),
    catalog_records_changed: changedRecords.size,
    catalog_fields_changed: sortKeys(fieldCounts),
    catalog_records_removed: removed,
    en_values_changed: enChanged.map(k => ({ key: k, fixture: fx.i18n.en[k], model: raw.i18n.en[k] })),
    en_keys_added: enAdded,
    es_fixture_values_changed: esChanged,
    es_keys_added: Object.keys(raw.i18n.es).filter(k => !(k in fx.i18n.es)).length
  };
}

function renderChangelog(raw, report, changes) {
  const L = [];
  L.push(`# Blaze Camp runtime model - CHANGELOG`, '');
  L.push(`Generated by \`node tools/compile-model.mjs\` (B1). Do not edit by hand: change the compiler (tools/compile/**) or the sources and re-compile.`, '');
  L.push(`## ${raw.manifest.model_version} (contracts ${raw.manifest.contracts_version}, spec ${raw.manifest.spec_version})`, '');
  L.push(`Compiled from the v1.1 sources with the coach's round-2 answers (coach_answers_round2.md, newest authority). Counts: ${report.counts.kept} exercises kept / ${report.counts.dropped} dropped, ${report.counts.aliases} id aliases, ${report.counts.templates_total} templates (${report.counts.templates_built} built, ${report.counts.templates_unbuilt} unbuilt: ${report.templates.unbuilt.join(', ') || '-'}), ${report.counts.stations} stations, ${report.counts.profiles} profiles, ${report.counts.sports_in_picker} picker sports, ${report.counts.activities} activities; i18n ${report.counts.en_keys} EN keys, ${report.counts.es_keys} ES keys (${report.counts.es_machine_translated} machine-translated, PROPOSED; ${report.counts.es_missing} missing).`, '');
  L.push(`Model 1.4.0 (2026-10-13, engine 0.7.0) = model 1.3.0 + the coach's round-5 answers (coach_answers_round5.md, COACH-R5) and his chat answers CH5 (coach_answers_chat_2026-10-11.md) and CH6 (coach_answers_chat_2026-10-13.md), applied through the v0.6 and v0.7 layers listed below (engine/DECISIONS.md G-100 ... G-304; coverage_matrix_round5.md). The model version also seeds the engine's tie-breaks (CONTRACTS §1.3), so a version change can change picks that tie.`, '');
  L.push('### v0.5 layer (engine 0.5.0, package V1 "structure and volume"; tools/fixture/v05-structure.mjs)', '');
  L.push('Applied on top of the round-3 layers by both builds (the model version is unchanged until V2 - V4 land; engine/DECISIONS.md G):', '');
  L.push('- rules: time fitting removed (CT-01, R4-SES-01) - session minutes, exercise caps by minutes, the cut order, the long-day and time-fit tables, the stairway step limits; `time_model.use = estimate_only`');
  L.push('- rules: `session.size` (exercise count by client type, R4-SES-02), `volume.two_day` (R4-SES-03), `volume.floor.applies_from_days = 3`, `stairway.progression` (CX-01, R4-PRG-01 / 02), `cycles.next_block` (R4-PRG-04), `placement` (allocation and the bonus exercise), bootcamp `rounds_by_level`');
  L.push('- templates: the coach\'s A / B / C skeletons, the athletic days and push / pull / legs (R4-SES-05); every station has a `rank`, every day type a `count` and a `skeleton`; `include_from_minutes` / `superset_below_minutes` deleted');
  L.push('- words: the time-fitting strings deleted from both languages; new warnings (2-day rule, acceleration, capped by the template, below the floor, credit-only groups, plan edited) and the reworded check labels', '');
  const conf = {};
  for (const s of Object.values(raw.profiles.sports)) conf[s.confidence] = (conf[s.confidence] || 0) + 1;
  const st = {};
  for (const e of raw.catalog.exercises) st[e.status] = (st[e.status] || 0) + 1;
  L.push('### v0.5 layer, package V2 "library and selection" (tools/fixture/v05-library.mjs)', '');
  L.push('Applied after the V1 layer by both builds (engine/DECISIONS.md G-25 ...):', '');
  L.push(`- catalog: the proposed exercises are **optional add-ons** (status \`optional_addon\`: ${st.optional_addon || 0} records, never a template pick; COACH-R4 R4-LIB-01); neck work stays proposed (${(st.proposed_v1 || 0) + (st.proposed_v1_1 || 0)} records, never shown); carries and sled work are dosed by distance or time and credit no muscle sets (R4-LIB-02); the mid-range pull category with its ${report.counts.added_v2} records and the \`mid_range_push\` / \`mid_range_pull\` tags (R4-LIB-03); the 60+ flag no longer excludes the landing drills round 3 switched on (R3-ATH-02); the Appendix F1 record fixes (split-step reaction drill, 2 min fast / 1 min walk intervals, the suitcase carry)`);
  L.push('- catalog: **no third-party video link** - every exercise carries a YouTube search link built from its English name (R4-LIB-05)');
  L.push('- rules: `selection.addons`, `conditioning.carry`, `selection.mid_range`, `selection.incline_first`, `selection.swap_notes`, `render.video`, `render.profile_confidence`, `selection.v2`; the retired 60+ and non-priority 3 % step caps are deleted (HANDOFF clean-up); `selection.lead_press.floor_penalty` -8; `selection.r2.family_over_week` -7');
  L.push(`- profiles: every sport profile carries \`confidence\` (R4-SCP-03): ${Object.entries(conf).sort().map(([k, v]) => `${k} ${v}`).join(', ')}`);
  L.push('- words: swap notes (what a swap keeps and loses, R4-LIB-04), the name to copy into YouTube, optional add-ons, carries by distance or time', '');
  L.push('### v0.5 layer, package V3 "words and checks" (tools/fixture/v05-words.mjs)', '');
  L.push('Applied after the V2 layer by both builds (engine/DECISIONS.md G-37 ...):', '');
  L.push('- rules: `legal.gate` and `legal.release_line` (COACH-R4 R4-SCP-01 / R4-SCP-02: the terms and the release are accepted before a plan is generated; a short release line on every plan, EN and ES, linking DISCLAIMER.md / DISCLAIMER.es.md)');
  L.push('- rules: `render.progression` (R4-PRG-03: reps and load as a rule the person applies), `render.acceleration` (R4-PRG-02), `render.estimate` (CT-01 / R4-SES-01: an average range, information only), `render.easy_to_remove` (R4-SES-04), `render.views` (the weekly sets per group table week by week; block / week / day macro views)');
  L.push('- rules: `validation.checks` gains ' + CHECKS_V3.map(([id]) => id).join(', ') + ' and `validation.v05` (which check holds which v0.5 rule); no check reads minutes');
  L.push(`- words: the release lines, the progression rule, the acceleration note, the time estimate, the easy-to-remove hints, the week-by-week table; ${REMOVED_V3.length} dead time-fitting / rate-cap words deleted; ${Object.keys(ES_REVIEW_V3).length} Spanish lines reviewed (R2-GEN-08)`, '');
  L.push('### v0.5 layer, package V4 "integrate" (tools/fixture/v05-integrate.mjs)', '');
  L.push('Applied after the V3 layer by both builds (engine/DECISIONS.md G-51 ...):', '');
  L.push('- rules: `selection.skeleton_laterality` (COACH-R4 R4-SES-05: on a gym A / B / C day and a push / pull / legs day a two-leg slot keeps a two-leg lift, a single-leg slot a single-leg lift, and the A day\'s first row is a two-arm row; the athletic days keep the laterality dial)');
  L.push('- rules: `placement.optional_focus.close_when_over_top` (an optional-day Focus slot closes when the group\'s exercises at their fewest sets already hold more than its planned final sets)');
  L.push('- rules: `validation.v05.skeleton` gains the laterality table (V30 holds it; V28 reads the share on the stations the dial may move)');
  L.push('- templates: push / pull / legs prints in the sheet\'s order (flies before dips; leg extension and leg curl before the single-leg hinge); every main day type opens with the general warm-up (ORD-08)', '');
  L.push('### v0.6 layer, volume targets and set placement (tools/fixture/v06-volume.mjs)', '');
  L.push('Applied after the v0.5 fix-round-2 layer by both builds (engine/DECISIONS.md G-100 ...):', '');
  L.push('- rules: `placement.x3` (main lift first, VOL-07; an athlete\'s flat press at most 4 sets; the optional day\'s bonus exercise for small groups only and never a pattern the day before trained, R3-VOL-03; the training-day bonus when no optional day can take it; the 2-day band held on the training days, R4-SES-03; every capped group said, CX-04; the physique first-week ceiling, VOL-01; one step an exercise a week; the presses held for the pulls, VOL-18; a circuit above its top said, CX-03)');
  L.push('- rules: `volume.x3` (an advanced 4-day physique client\'s non-Focus big groups start at 16, VOL-01; an upper body at maintenance for the profiles that say so, UNI-02; the class member\'s tops, R4-SES-02)');
  L.push('- profiles: `upper_maintenance` on the sport profiles whose resistance notes keep the upper body at maintenance');
  L.push('- words: `changes.sets_added_n` (with the sets before and after, as the words layer prints it), `changes.sets_added_n_plain`, `why.bonus_main_day`, `warning.circuit_over_top` (EN and ES)', '');
  L.push('- COACH-CH5 CH5-03 (coach_answers_chat_2026-10-11.md): `placement.x3.bonus_small_only.big_when_needed` (a big group takes a bonus exercise when the training days cannot take it to its planned final sets), `placement.x3.reach_planned`, `volume.x3.group_max` (no group above 35 weekly sets)', '');
  L.push('### v0.6 layer, selection, templates and week layout (tools/fixture/v06-select.mjs)', '');
  L.push('Applied after the volume layer by both builds (engine/DECISIONS.md G-130 ...): `selection.s6`, `conditioning.s6`, `athletic.s6`, the athletic A / B arm station (every athletic A / B day type, the in-season variant too: COACH-CH5 CH5-02, `selection.s6.arm_slot`), the seal-row family; team practices are not counted as aerobic sessions (COACH-CH5 CH5-01, `conditioning.s6.practice.counts_as_aerobic` false).', '');
  L.push('### v0.6 layer, "words" (tools/fixture/v06-words.mjs)', '');
  L.push('Applied after the v0.5 fix-round-2 layer by both builds (engine/DECISIONS.md G-160 ...): `render.v6` (circuit progression from the real weeks, the written-out pyramid, "What changes" by exercise and real set difference, the printed-copy minors of the round-4 coach-eye reviews) and `volume.pain.x6` (the pain-free depth cue by exercise type); new EN / ES lines listed in `i18n/es_review.json > priority_review`.', '');
  L.push('### v0.7 layer, volume, credits, set placement and circuit rounds (tools/fixture/v07-volume.mjs)', '');
  L.push('Applied after the v0.6 layers by both builds (engine/DECISIONS.md G-230 ...; COACH-R5, coach_answers_round5.md): `credit.classes.MRPUSH` and the high-incline presses 1.0 chest + 0.25 front delts + 0.25 triceps (R5-VOL-01); `placement.x7` (a light chest bonus on the optional day after a press day, R5-VOL-07; the athlete\'s flat-press cap lifted for a chest Focus, R5-VOL-09; a one-set shortfall on the day\'s first lift, R5-VOL-11; the week\'s heavy hinge at 3 sets and first, R5-ATH-12; a bonus opens in the week it is needed); `volume.x7.start_below_top` (R5-CLS-07); `session.x7.racket_calf_both_days` (R5-VOL-10); `supersets.bootcamp.x7.rounds_by_third` (R5-CLS-03); `validation.v05.size_plus_whys`.', '');
  L.push('### v0.7 layer, templates, selection, athletic progression and WODs (tools/fixture/v07-select.mjs)', '');
  L.push('Applied after the v0.6 layers by both builds (engine/DECISIONS.md G-250 ...; coach answers round 5): the 2-day templates are two full-body days (R5-GEN-01, skeletons `gym_FB1` / `gym_FB2` / `athletic_FB1` / `athletic_FB2`); `selection.v7` (incline first and one overhead press a week for throwers, volleyball and the swimmer, R5-ATH-04; the jump progression, R5-GRD-03 / R5-ATH-10; assisted jumps with knee pain and the pain-scale warning, R5-GRD-08); `conditioning.v7.named_wods` (named benchmark workouts in the class workout, R5-GRD-04); `supersets.v7.bootcamp_format` (rounds or station by station, R5-GRD-05); `athletic.v7.hold` (athletic doses hold at most 2 weeks, R5-ATH-02); the free pull-up station of a bootcamp is a hip thrust or bridge (R5-CLS-02); side planks and the Pallof press join the low-back core picks (R5-LIB-02); the 50+ low-back hot-spot list is retired (R5-ATH-08); nine new records (five assisted jumps, three two-foot lateral jumps, the WOD run station); the shoulder-health overhead press as joint care (prehab code OVERHEAD_HEALTH, R5-ATH-04); the round-5 confirmations (R5-LIB-01, R5-ATH-05 / 09 / 10 / 11, R5-CLS-04 / 06) are written into the statuses of the rules they confirm.', '');
  L.push('### v0.7 layer, "words" (tools/fixture/v07-words.mjs)', '');
  L.push('Applied after the v0.6 layers by both builds (engine/DECISIONS.md G-270 ...): `legal.health_flag` (COACH-R5 R5-GEN-02: a health-check flag no longer stops the plan; the plan is built and prints a health warning in EN and ES, [LEGAL REVIEW]; severe pain builds with the moderate pain rules and the same warning, PROPOSED) and `render.v7` (R5-GRD-06: the core block printed as optional and adjustable); new EN / ES lines listed in `i18n/es_review.json > priority_review`.', '');
  L.push('### Sources (sha256)', '');
  for (const [f, h] of Object.entries(raw.manifest.sources_sha256)) L.push(`- \`${f}\` ${h}`);
  L.push('', '### Coach corrections applied in the compile', '');
  L.push('| Patch | Coach ids | Target | Rule | Action | Counts |', '|---|---|---|---|---|---|');
  const esc = (s) => String(s).replace(/\|/g, '\\|');
  for (const p of report.coach_patches) L.push(`| ${p.id} | ${p.refs.join(', ')} | ${esc(p.target)} | ${esc(p.rule)} | ${p.action} | ${esc(Object.entries(p.counts).map(([k, v]) => `${k} ${v}`).join(', ') || '-')} |`);
  L.push('', '### Record changes made by the patches (the source already carries every other correction)', '');
  if (!changes.length) L.push('_none_');
  else {
    L.push('| Patch | Exercise | Field | From | To |', '|---|---|---|---|---|');
    for (const c of changes) L.push(`| ${c.patch} | \`${c.id}\` | ${c.field} | ${esc(JSON.stringify(c.from))} | ${esc(JSON.stringify(c.to))} |`);
  }
  L.push('', '### Dropped source records', '');
  for (const [r, n] of Object.entries(report.counts.dropped_by_reason)) L.push(`- ${r}: ${n}`);
  L.push('', '(every drop with its reason: `COMPILE_REPORT.json > dropped`)', '');
  L.push('### Rules cross-checked against the sources', '');
  for (const c of report.crosschecks) L.push(`- ${c.id} ${c.status.toUpperCase()} - ${c.source}: ${c.what}${c.detail ? ` (${c.detail})` : ''}${c.ref ? ` [${c.ref}]` : ''}`);
  L.push('', '### Spanish', '');
  L.push('Neutral Latin American Spanish, English gym term in brackets (R2-GEN-08). Every line is PROPOSED until the coach (or a coach he trusts) approves it; lines machine-translated by the compiler are listed in `i18n/es_review.json > machine_translated`. [LEGAL REVIEW] copy (health check, release, coach bypass) is taken verbatim from the spec.', '');
  for (const [s, n] of Object.entries(report.i18n.es_by_source)) L.push(`- ${s}: ${n} lines`);
  L.push('');
  return L.join('\n');
}

/** @param {object} raw @param {object} report @param {string} changelog @param {string} outDir */
export function writeModel(raw, report, changelog, outDir) {
  const w = (rel, text) => { const p = path.join(outDir, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
  const j = (x) => JSON.stringify(x, null, 1) + '\n';
  w('manifest.json', j(raw.manifest));
  w('catalog.json', j(raw.catalog));
  w('rules.json', j(raw.rules));
  w('templates.json', j(raw.templates));
  w('profiles.json', j(raw.profiles));
  w('i18n/en.json', j(raw.i18n.en));
  w('i18n/es.json', j(raw.i18n.es));
  w('i18n/es_review.json', j(raw.i18n.es_review));
  w('MODEL_VERSION', raw.manifest.model_version + '\n');
  w('CHANGELOG.md', changelog);
  w('COMPILE_REPORT.json', j(report));
}

// ---------------------------------------------------------------- CLI
const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outDir = path.resolve(outIdx >= 0 ? args[outIdx + 1] : path.join(BASE, 'model'));
  const quiet = args.includes('--quiet');
  const { raw, report, changelog, errors, warnings } = compileModel();
  const check = checkModel(raw);
  report.validation = { errors: [...errors, ...check.errors], warnings: [...warnings, ...check.warnings] };
  const allErrors = report.validation.errors;
  if (allErrors.length) {
    console.error(`compile-model: ${allErrors.length} contract error(s); nothing written`);
    for (const e of allErrors.slice(0, 80)) console.error('ERROR', e);
    if (allErrors.length > 80) console.error(`... ${allErrors.length - 80} more`);
    process.exit(1);
  }
  writeModel(raw, report, changelog, outDir);
  const c = report.counts;
  console.log(JSON.stringify({ out: path.relative(BASE, outDir) || '.', model_version: raw.manifest.model_version, kept: c.kept, dropped: c.dropped, dropped_by_reason: c.dropped_by_reason, aliases: c.aliases, templates: `${c.templates_built} built / ${c.templates_unbuilt} unbuilt`, stations: c.stations, profiles: c.profiles, sports_in_picker: c.sports_in_picker, activities: c.activities, en_keys: c.en_keys, es_keys: c.es_keys, es_machine_translated: c.es_machine_translated, es_missing: c.es_missing, coach_patches: c.coach_patches, patch_record_changes: c.coach_patch_record_changes, warnings: report.validation.warnings.length }));
  if (!quiet) {
    for (const p of report.coach_patches) console.log(`  ${p.id} ${p.action.padEnd(8)} ${p.refs.join(',')} ${JSON.stringify(p.counts)}`);
    for (const x of report.crosschecks) console.log(`  ${x.id} ${x.status}${x.detail ? ' - ' + x.detail.slice(0, 160) : ''}`);
    for (const w of report.validation.warnings.filter(w => !/^check-fixture: .*has 1 always-on station/.test(w))) console.log('  WARN', w);
  }
}
