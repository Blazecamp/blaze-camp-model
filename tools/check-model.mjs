#!/usr/bin/env node
// tools/check-model.mjs - B1: contract checks of a compiled model (engine/CONTRACTS.md §3, §4.13).
// Usage: node tools/check-model.mjs [model-dir | --fixture]   (default: model/). Exits 1 on any error.
// Runs: engine/model.mjs assertModel + a loadModel smoke test; the §3 schema of every runtime file (key order, types,
// enums, closed tag list, sorted arrays); the band regex over ids / names / cues / aliases / kit tokens; i18n coverage
// (every key the catalog, templates, profiles and rules reference has EN, and ES or an es_review.missing_keys entry; ES
// placeholders match EN); `rules` deep-equals the fixture's rules; shape signatures equal the fixture's (the fixture wins
// on shapes, CONTRACTS header); and the architect's check-fixture checks (ported below) on the assembled model.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertModel, loadModel } from '../engine/model.mjs';

const BASE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FIXTURE_PATH = path.join(BASE, 'engine', 'fixtures', 'mini-model.json');
export const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;

const EX_KEYS = ['id', 'source_id', 'name_key', 'cue_key', 'kind', 'family', 'pattern', 'node', 'slots', 'default_in_slots', 'laterality', 'plane', 'level', 'zone', 'rotation_bias', 'size_class', 'exercise_class', 'counting', 'credit_class', 'credits', 'primary_muscle', 'equipment', 'constraint', 'axial_class', 'axial', 'spine_class', 'axial_pattern', 'skill', 'impact', 'load_ceiling', 'is_athletic', 'athletic', 'conditioning', 'medball', 'older_ok', 'older_opt_in_ok', 'youth_ok', 'tags', 'variation_axes', 'rep_hint', 'video', 'status', 'sport_use', 'rule_refs'];
const ATH_KEYS = ['quality', 'contact_class', 'olympic_family', 'day_pattern', 'olympic_tier', 'full_catch', 'from_floor', 'plyo_method_default', 'rc_stage_default', 'unilateral_harder', 'loaded_jump', 'count_unit'];
const STATION_KEYS = ['id', 'bucket', 'role', 'block', 'group', 'sets_hint', 'sets_text', 'dose_text', 'pair', 'superset', 'superset_below_minutes', 'circuit', 'include_from_minutes', 'axial', 'variant', 'variant_text', 'laterality_dial', 'loading', 'movable', 'counts_as_volume', 'condition', 'condition_text', 'older_default_excluded', 'older_default_text', 'group_label', 'pool_filter', 'rir', 'note'];
const TEMPLATE_KEYS = ['id', 'family', 'days', 'status', 'format_note', 'week_layout', 'day_types', 'variants', 'aerobic', 'evidence'];
const DAYTYPE_KEYS = ['label', 'label_key', 'kind', 'format', 'dose_text', 'lower_focus', 'full_body', 'groups', 'axial', 'stations'];
const TAGS = new Set(['overhead_squat', 'snatch', 'low_bar', 'depth_jump', 'high_depth_drop', 'hurdle_hop', 'bound', 'ankle_hop', 'landing', 'overhead', 'overhead_barbell', 'dips', 'upright_row', 'skullcrusher', 'good_morning', 'bent_over', 'chest_supported', 'sumo', 'cossack', 'deep_knee_flexion', 'front_rack', 'push_up_floor', 'belt_squat', 'kong_row', 'push_press', 'push_jerk', 'thruster', 'pullover', 'face_pull', 'kb_swing', 'wall_ball', 'glute_iso', 'spine_counted', 'fixed_grip', 'split_grip', 'machine', 'cable', 'barbell', 'medball', 'olympic', 'loaded_jump', 'olympic_from_floor', 'plyo_repeated', 'high_impact', 'axial_high', 'older_preferred', 'aesthetics_warmup_only', 'pitcher_reduce', 'striker_reduce', 'beginner_olympic', 'youth_floor_ok', 'axial_unload', 'pain_friendly', 'assisted', 'home_substitute']);
const ENUM = {
  kind: ['exercise', 'drill', 'test', 'conditioning'], laterality: ['bilateral', 'unilateral', 'alternating', 'n/a'], plane: ['sagittal', 'frontal', 'transverse', 'multi', 'n/a'],
  level: ['foundational', 'intermediate', 'advanced'], rotation_bias: ['external', 'internal', null], axial_class: ['high', 'moderate', 'low', 'none'], spine_class: ['counted', 'second_day', 'not_counted'],
  axial_pattern: ['squat', 'hinge', null], quality: ['plyometric', 'ballistic', 'landing', 'throw', 'olympic', 'sprint', 'cod'], contact_class: ['plyometric', 'ballistic', 'landing', null],
  olympic_family: ['clean', 'snatch', 'jerk', 'loaded_jump', 'swing', null], day_pattern: ['knee', 'hip', 'either', null], olympic_tier: ['L1', 'L2_plus', null], rc_stage_default: ['RC1', 'RC2', 'RC3', null],
  count_unit: ['contacts', 'throws', 'cuts', 'metres', 'reps'], colour: ['A', 'B', 'C', 'LC'], medball_kind: ['pass_rotation', 'overhead', 'situp', 'slam', 'warmup', 'wall_ball'], video_kind: ['coach', 'observed'],
  layout_kind: ['main', 'optional', 'aerobic', 'off'], daytype_kind: ['main', 'optional', 'aerobic'], format: ['straight', 'circuit'], template_status: ['built', 'unbuilt'],
  station_axial: ['axial', 'non_axial', 'light_or_non_axial', null]
};
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PLACEHOLDER_RE = /\{([a-zA-Z0-9_]+)\}/g;
const ph = (s) => [...new Set([...String(s).matchAll(PLACEHOLDER_RE)].map(m => m[1]))].sort().join(',');
const isSortedStrings = (a) => a.every((x, i) => i === 0 || a[i - 1] < x);
const keysEq = (o, keys) => JSON.stringify(Object.keys(o)) === JSON.stringify(keys);

/** @param {string} dir @returns {object} raw model {manifest, catalog, rules, templates, profiles, i18n:{en, es, es_review}} */
export function readModelDir(dir) {
  const rd = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const manifest = rd('manifest.json');
  const F = manifest.files;
  return { manifest, catalog: rd(F.catalog), rules: rd(F.rules), templates: rd(F.templates), profiles: rd(F.profiles), i18n: { en: rd(F.i18n.en), es: rd(F.i18n.es), es_review: rd(F.i18n.es_review) } };
}

/** @returns {object|null} the fixture model without `_fixture`, or null when absent */
export function readFixture() {
  if (!fs.existsSync(FIXTURE_PATH)) return null;
  const raw = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
  delete raw._fixture;
  return raw;
}

/** the architect's tools/fixture/check-fixture.mjs checks, ported as a function over an assembled model */
export function fixtureChecks(m) {
  const errors = [], warns = [];
  const en = m.i18n.en, es = m.i18n.es;
  for (const e of m.catalog.exercises) {
    if (BAND_RE.test(e.id) || BAND_RE.test(en[e.name_key] || '')) errors.push(`band word in ${e.id}`);
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
  const bySlot = {};
  for (const e of m.catalog.exercises) for (const s of e.slots) (bySlot[s] = bySlot[s] || []).push(e.id);
  const textOnly = ['WARMUP_GENERAL', 'COMPLEX', 'TEST', 'CORE_OTHER'];
  const usedBuckets = new Set();
  let tCount = 0, stCount = 0;
  for (const [fam, F] of Object.entries(m.templates.families)) for (const [, t] of Object.entries(F.days)) {
    tCount++;
    const allDayTypes = [['main', t.day_types], ...Object.entries(t.variants).map(([n, v]) => [n, v.day_types])];
    for (const [vname, dts] of allDayTypes) for (const [k, dt] of Object.entries(dts)) {
      if (!(dt.label_key in en)) errors.push(`missing day label ${dt.label_key}`);
      const groupCount = {};
      for (const st of dt.stations) {
        stCount++; usedBuckets.add(st.bucket);
        if (!m.templates.buckets[st.bucket]) errors.push(`unknown bucket ${st.bucket} in ${t.id}/${vname}/${k}`);
        if (st.group && ['resistance', 'isolation'].includes(m.templates.buckets[st.bucket].kind) && !st.include_from_minutes) groupCount[st.group] = (groupCount[st.group] || 0) + 1;
      }
      for (const [g, n] of Object.entries(groupCount)) if (n === 1 && !['calves', 'core'].includes(g) && !m.rules.session.exercises_per_group.exempt_families.includes(fam)) warns.push(`${t.id}/${vname}/${k}: group ${g} has 1 always-on station (R2-SES-05 needs 2-4; check include_from_minutes)`);
    }
    for (const [wd, v] of Object.entries(t.week_layout)) if (t.status === 'built' && ['main', 'optional'].includes(v.kind) && v.day_type && !(v.day_type in t.day_types)) errors.push(`${t.id}: ${wd} -> ${v.day_type} not in day_types`);
  }
  for (const b of usedBuckets) if (!textOnly.includes(b) && !(bySlot[b] || []).length && b !== 'CORE_OTHER') errors.push(`bucket ${b} has no catalog candidate`);
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
  const s12 = m.rules.stairway.by_N['12'], s8 = m.rules.stairway.by_N['8'];
  if (JSON.stringify(Object.values(s12.planned_effort)) !== JSON.stringify(['3', '3', '3', '3', '3', '3', '2', '2', '2', '1-2', '1-2', '1+'])) errors.push('12-week planned effort != spec');
  if (JSON.stringify(Object.values(s8.planned_effort)) !== JSON.stringify(['3', '3', '3', '3', '2', '2', '1-2', '1+'])) errors.push('8-week planned effort != spec');
  if (JSON.stringify(m.rules.stairway.phases_by_N['12'].L2) !== JSON.stringify({ ACCLIMATION: [1, 3], DRIVE: [4, 8], HARDEST: [9, 12] })) errors.push('12-week L2 phases != spec');
  if (JSON.stringify(m.rules.athletic.stages.weeks_by_N['12']) !== JSON.stringify({ RC1: [1, 3], RC2: [4, 7], RC3: [8, 12] })) errors.push('RC weeks 12 != R2-ATH-03');
  if (JSON.stringify(m.rules.athletic.stages.weeks_by_N['8']) !== JSON.stringify({ RC1: [1, 2], RC2: [3, 5], RC3: [6, 8] })) errors.push('RC weeks 8 != R2-ATH-03');
  const rulesStr = JSON.stringify(m.rules);
  for (const w of ['"sleep', '"stress', 'hard_job', 'stress_high', 'sleep_lt6']) if (rulesStr.includes(w)) errors.push(`lifestyle input in rules: ${w}`);
  if (/"sex"|"gender"/i.test(JSON.stringify(m))) errors.push('sex/gender key present');
  const esReview = new Set(m.i18n.es_review.missing_keys);
  for (const k of Object.keys(en)) if (k !== '_meta' && !(k in es) && !esReview.has(k)) errors.push(`ES missing and not in es_review: ${k}`);
  return { errors, warns, templates: tCount, stations: stCount };
}

/** collect every i18n key a rules object references ('key' and '*_key' string fields) */
export function rulesKeys(rules) {
  const out = new Set();
  const walk = (o, k) => {
    if (Array.isArray(o)) { for (const x of o) walk(x, null); return; }
    if (o && typeof o === 'object') { for (const [kk, v] of Object.entries(o)) walk(v, kk); return; }
    if (typeof o === 'string' && k && (k === 'key' || /_key$/.test(k)) && /^[a-z_]+\.[A-Za-z0-9_.]+$/.test(o)) out.add(o);
  };
  walk(rules, null);
  return [...out].sort();
}

/** key-order signatures of every object at the given paths (for shape equality with the fixture) */
function signatures(m) {
  const sig = {};
  const add = (kind, o) => { (sig[kind] = sig[kind] || new Set()).add(Object.keys(o).join('|')); };
  for (const e of m.catalog.exercises) { add('exercise', e); add('equipment', e.equipment); add('rep_hint', e.rep_hint); if (e.athletic) add('athletic', e.athletic); if (e.medball) add('medball', e.medball); if (e.video) add('video', e.video); if (e.conditioning) add('conditioning', e.conditioning); }
  for (const F of Object.values(m.templates.families)) { add('family', F); for (const t of Object.values(F.days)) { add('template', t); for (const wd of Object.values(t.week_layout)) add('layout_day', wd); const dts = [t.day_types, ...Object.values(t.variants).map(v => { add('variant', v); return v.day_types; })]; for (const d of dts) for (const dt of Object.values(d)) { add('day_type', dt); for (const st of dt.stations) add('station', st); } } }
  for (const s of Object.values(m.profiles.sports)) { add('sport', s); add('sport.aerobic', s.aerobic); add('sport.olympic', s.olympic); add('sport.tiers', s.tiers); add('sport.medball', s.medball); }
  for (const s of m.profiles.picker.sports) { add('picker', s); for (const p of s.positions) add('position', p); }
  for (const a of m.profiles.picker.activities) add('activity', a);
  for (const g of Object.values(m.profiles.goals)) add('goal', g);
  add('top.templates', m.templates); add('top.profiles', m.profiles); add('top.catalog', m.catalog);
  // manifest: CONTRACTS §3.1 adds sources_sha256, which the fixture manifest does not carry; checked explicitly above
  return sig;
}

/**
 * @param {object} raw  assembled model {manifest, catalog, rules, templates, profiles, i18n}
 * @param {{fixture?: object|null, isFixture?: boolean}} [opts]
 * @returns {{errors:string[], warnings:string[], stats:object}}
 */
export function checkModel(raw, opts = {}) {
  const errors = [], warnings = [];
  const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
  const fixture = opts.fixture === undefined ? readFixture() : opts.fixture;
  const m = structuredClone(raw); // loadModel deep-freezes its argument

  // 1. engine assertModel + loadModel smoke test
  // engine/model.mjs is B4's and grows during the build: an assertModel error that the reference fixture ALSO raises is a
  // fixture / contract gap for B4 and the architect to reconcile (reported as a warning); every other one is an error.
  const fixtureAssert = new Set(fixture && !opts.isFixture ? assertModel(structuredClone(fixture)) : []);
  for (const e of assertModel(structuredClone(raw))) (fixtureAssert.has(e) ? warn : err)(`assertModel: ${e}${fixtureAssert.has(e) ? ' (the fixture fails the same check)' : ''}`);
  let model = null;
  try { model = loadModel(structuredClone(raw)); } catch (e) { err(`loadModel threw: ${e.message}`); }
  if (model) {
    try {
      for (const b of Object.keys(m.templates.buckets)) model.bySlot(b);
      model.template('athletic', 3); model.stair(12); model.stair(8); model.goal('active');
      model.sport('rec_pickleball'); model.pickerSport('swimming'); model.activity('rec_pickleball');
      if (model.ex('kb-face-pull-as-written-face-pulls-are-normally-cable-band').id !== 'kb-face-pull') err('alias kb face pull does not resolve');
      if (model.t('es', 'weekday.Mon') === 'weekday.Mon') err('t(es, weekday.Mon) not translated');
    } catch (e) { err(`model smoke test: ${e.code || ''} ${e.message}`); }
  }

  // 2. manifest
  const man = m.manifest;
  if (!keysEq(man, ['schema', 'model_version', 'spec_version', 'contracts_version', 'files', 'languages', 'default_lang', 'counts', 'sources_sha256'].filter(k => k in man)) || man.schema !== 'manifest/2') err('manifest keys / schema');
  if (!/^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/.test(man.model_version || '')) err(`manifest.model_version '${man.model_version}' not semver`);
  if (!opts.isFixture) {
    if (!man.sources_sha256 || !Object.values(man.sources_sha256).every(h => /^[0-9a-f]{64}$/.test(h))) err('manifest.sources_sha256 missing or not sha256');
    if (m.catalog.model_version !== man.model_version) err('catalog.model_version != manifest.model_version');
  }
  const counts = { exercises: m.catalog.exercises.length, templates: Object.values(m.templates.families).reduce((n, f) => n + Object.keys(f.days).length, 0), profiles: Object.keys(m.profiles.sports).length, sports_in_picker: m.profiles.picker.sports.length, activities: m.profiles.picker.activities.length };
  for (const [k, v] of Object.entries(counts)) if (man.counts[k] !== v) err(`manifest.counts.${k} ${man.counts[k]} != ${v}`);
  if (JSON.stringify(man.languages) !== '["en","es"]' || man.default_lang !== 'en') err('manifest languages / default_lang');

  // 3. catalog (§3.2)
  const C = m.catalog;
  if (C.schema !== 'catalog/2') err('catalog.schema');
  const ids = C.exercises.map(e => e.id);
  if (!isSortedStrings(ids)) err('catalog.exercises not sorted by id / not unique');
  const idSet = new Set(ids);
  for (const [s, r] of Object.entries(C.id_aliases)) { if (!idSet.has(r)) err(`id_alias ${s} -> ${r}: target missing`); if (BAND_RE.test(r)) err(`id_alias target with band word ${r}`); }
  const buckets = new Set(Object.keys(m.templates.buckets));
  const machines = new Set(Object.keys(m.rules.equipment.machines));
  for (const e of C.exercises) {
    const where = `exercise ${e.id}`;
    if (!keysEq(e, EX_KEYS)) { err(`${where}: keys/order != CONTRACTS §3.2`); continue; }
    if (e.name_key !== `exercise.${e.id}.name`) err(`${where}: name_key`);
    if (e.cue_key !== null && e.cue_key !== `exercise.${e.id}.cue`) err(`${where}: cue_key`);
    for (const f of ['kind', 'laterality', 'plane', 'level', 'rotation_bias', 'axial_class', 'spine_class', 'axial_pattern']) if (!ENUM[f].includes(e[f])) err(`${where}: ${f} '${e[f]}' not in enum`);
    if (!(e.zone === null || [1, 2, 3].includes(e.zone))) err(`${where}: zone`);
    if (!(Number.isInteger(e.constraint) && e.constraint >= 1 && e.constraint <= 5)) err(`${where}: constraint ${e.constraint}`);
    for (const f of ['axial', 'is_athletic', 'older_ok', 'older_opt_in_ok', 'youth_ok']) if (typeof e[f] !== 'boolean') err(`${where}: ${f} not boolean`);
    if (e.is_athletic !== (e.credit_class === 'ATHLETIC')) err(`${where}: is_athletic != (credit_class == ATHLETIC)`);
    if (e.axial && !e.axial_pattern) err(`${where}: counted spine lift without squat / hinge pattern`);
    if (e.older_ok && !e.older_opt_in_ok) err(`${where}: older_ok but not older_opt_in_ok`);
    for (const f of ['slots', 'default_in_slots', 'tags', 'sport_use', 'rule_refs']) if (!Array.isArray(e[f]) || !isSortedStrings(e[f])) err(`${where}: ${f} not a sorted unique array`);
    for (const s of e.slots) if (!buckets.has(s)) err(`${where}: unknown slot ${s}`);
    if (!e.slots.length) err(`${where}: no slots`);
    for (const t of e.tags) if (!TAGS.has(t)) err(`${where}: tag '${t}' outside the closed list`);
    if (!keysEq(e.equipment, ['any_of', 'machine']) || !Array.isArray(e.equipment.any_of) || !e.equipment.any_of.length || !e.equipment.any_of.every(a => Array.isArray(a) && isSortedStrings(a))) err(`${where}: equipment shape`);
    if (e.equipment.machine !== null && !machines.has(e.equipment.machine)) err(`${where}: unknown machine ${e.equipment.machine}`);
    if (e.athletic) {
      if (!keysEq(e.athletic, ATH_KEYS)) err(`${where}: athletic keys`);
      for (const f of ['quality', 'contact_class', 'olympic_family', 'day_pattern', 'olympic_tier', 'rc_stage_default', 'count_unit']) if (!ENUM[f].includes(e.athletic[f])) err(`${where}: athletic.${f} '${e.athletic[f]}'`);
    }
    if (e.conditioning && (!keysEq(e.conditioning, ['colour']) || !ENUM.colour.includes(e.conditioning.colour))) err(`${where}: conditioning`);
    if (e.medball && (!keysEq(e.medball, ['min_lb', 'max_lb', 'kind']) || !ENUM.medball_kind.includes(e.medball.kind) || e.medball.max_lb > m.rules.medball.max_lb || e.medball.min_lb > e.medball.max_lb)) err(`${where}: medball ${JSON.stringify(e.medball)}`);
    if (e.video && (!keysEq(e.video, ['url', 'kind']) || !ENUM.video_kind.includes(e.video.kind))) err(`${where}: video`);
    if (!keysEq(e.rep_hint, ['text', 'unit'])) err(`${where}: rep_hint`);
    if (e.credit_class !== 'DIPS' && Object.keys(e.credits).length && !(e.primary_muscle && e.credits[e.primary_muscle] === 1)) err(`${where}: primary_muscle ${e.primary_muscle} not the 1.0 credit`);
    if (e.credit_class === 'DIPS' && e.primary_muscle !== null) err(`${where}: DIPS primary_muscle must be null`);
    if (['proposed_v1', 'proposed_v1_1'].includes(e.status) && e.default_in_slots.length) err(`${where}: PROPOSED record is a default pick`);
    if (e.tags.includes('v_squat')) err(`${where}: v_squat tag`);
  }
  // band regex: ids, aliases, names, cues, swaps / substitutes in rules, kit tokens
  for (const [k, v] of Object.entries(m.i18n.en)) if (/^exercise\./.test(k) && BAND_RE.test(String(v))) err(`band word in EN ${k}`);
  for (const [k, v] of Object.entries(m.i18n.es)) if (/^exercise\./.test(k) && /\b(liga|ligas|banda|bandas|cadena|cadenas)\b/i.test(String(v))) err(`band word in ES ${k}`);
  const subs = [...m.rules.medball.no_ball_substitutes, ...Object.values(m.rules.equipment.machine_isolation_swaps).flat(), ...m.rules.olympic.tiers.L1.examples, ...m.rules.olympic.tiers.L2_plus.examples, ...m.rules.warmup.lower_or_athletic_drills, ...m.rules.warmup.press_day_mobility];
  for (const s of subs) { if (BAND_RE.test(s)) err(`band word in rules swap ${s}`); if (!idSet.has(s) && !(s in C.id_aliases)) warn(`rules references unknown exercise ${s}`); }
  for (const p of Object.values(m.profiles.sports)) for (const id of (p.olympic.prefer_ids || [])) if (!idSet.has(id)) warn(`profile ${p.id} prefers unknown exercise ${id}`);

  // 4. rules (§3.3)
  if (m.rules.schema !== 'rules/2') err('rules.schema');
  for (const [cls, map] of Object.entries(m.rules.credit.classes)) for (const v of Object.values(map)) if (![1, 0.5, 0.25].includes(v)) err(`credit class ${cls} value ${v}`);
  if (fixture && !opts.isFixture && JSON.stringify(m.rules) !== JSON.stringify(fixture.rules)) {
    const diffs = [];
    for (const k of new Set([...Object.keys(m.rules), ...Object.keys(fixture.rules)])) if (JSON.stringify(m.rules[k]) !== JSON.stringify(fixture.rules[k])) diffs.push(k);
    err(`rules != fixture rules (sections: ${diffs.join(', ') || 'key order'})`);
  }

  // 5. templates (§3.4)
  const T = m.templates;
  if (T.schema !== 'templates/2' || !keysEq(T, ['schema', 'buckets', 'goal_to_family', 'kit_family_override', 'families', 'program_names'])) err('templates top-level keys / schema');
  for (const [fam, F] of Object.entries(T.families)) for (const [d, t] of Object.entries(F.days)) {
    const where = `template ${t.id}`;
    if (!keysEq(t, TEMPLATE_KEYS)) err(`${where}: keys`);
    if (t.id !== `${fam}.${d}` || t.days !== Number(d) || t.family !== fam || !ENUM.template_status.includes(t.status)) err(`${where}: id / days / status`);
    if (!keysEq(t.week_layout, WEEKDAYS)) err(`${where}: week_layout weekdays`);
    for (const v of Object.values(t.week_layout)) if (!ENUM.layout_kind.includes(v.kind)) err(`${where}: layout kind ${v.kind}`);
    const dtsAll = [[null, t.day_types], ...Object.entries(t.variants).map(([n, v]) => [n, v.day_types])];
    for (const [vn, dts] of dtsAll) for (const [k, dt] of Object.entries(dts)) {
      if (!keysEq(dt, DAYTYPE_KEYS)) err(`${where}/${vn || 'base'}/${k}: day type keys`);
      if (dt.label_key !== (vn ? `day.${t.id}.${vn}.${k}` : `day.${t.id}.${k}`)) err(`${where}/${k}: label_key ${dt.label_key}`);
      if (!ENUM.daytype_kind.includes(dt.kind) || !ENUM.format.includes(dt.format)) err(`${where}/${k}: kind / format`);
      for (const st of dt.stations) {
        if (!keysEq(st, STATION_KEYS)) err(`${where}/${k}/${st.id}: station keys`);
        // 05 v1.1 carries two values outside the §3.4 enum ('light_technique' on strength DE lower days, 'n/a (bodyweight)' on
        // no-equipment days); the fixture keeps them verbatim, so this is a warning + CONTRACT_REQUESTS entry, not an error.
        if (!ENUM.station_axial.includes(st.axial)) warn(`${where}/${k}/${st.id}: station axial '${st.axial}' outside the CONTRACTS §3.4 enum`);
        if (st.sets_hint !== null && !(Array.isArray(st.sets_hint) && st.sets_hint.length === 2)) err(`${where}/${k}/${st.id}: sets_hint`);
        if (!(`slot.${st.bucket}` in m.i18n.en)) err(`missing EN slot.${st.bucket}`);
      }
    }
  }
  const progIds = new Set(T.program_names.map(p => p.id));
  for (const id of progIds) if (!(`program.${id}.name` in m.i18n.en)) err(`missing EN program.${id}.name`);

  // 6. profiles (§3.5)
  const P = m.profiles;
  if (P.schema !== 'profiles/2' || !keysEq(P, ['schema', 'goals', 'sports', 'picker', 'goal_defaults', 'age_overlays', 'id_aliases', 'recreational_profile'])) err('profiles top-level keys / schema');
  if (!keysEq(P.goals, ['muscle', 'strength', 'athletic', 'active', 'fat_loss', 'general', 'hybrid'])) err('profiles.goals keys');
  for (const a of P.picker.activities) if (!(a.name_key in m.i18n.en)) err(`missing EN ${a.name_key}`);
  for (const g of P.picker.groups) if (!(g.name_key in m.i18n.en)) err(`missing EN ${g.name_key}`);
  for (const s of P.picker.sports) {
    for (const p of s.positions) if (!(p.name_key in m.i18n.en)) err(`missing EN ${p.name_key}`);
    if (s.second_choice) { if (!(s.second_choice.name_key in m.i18n.en)) err(`missing EN ${s.second_choice.name_key}`); for (const o of s.second_choice.options) if (!(o.name_key in m.i18n.en)) err(`missing EN ${o.name_key}`); }
  }
  for (const p of Object.values(P.sports)) for (const v of Object.values(p.variants)) if (!(v.name_key in m.i18n.en)) err(`missing EN ${v.name_key}`);
  const sportIds = new Set(P.picker.sports.map(s => s.id));
  for (const want of ['swimming', 'american_football', 'basketball', 'baseball', 'soccer', 'pickleball']) if (!sportIds.has(want) && !Object.keys(P.id_aliases.sports || {}).includes(want)) warn(`picker has no sport '${want}'`);
  const actIds = new Set(P.picker.activities.map(a => a.id));
  for (const want of ['rec_pickleball', 'hyrox_fitness']) if (!actIds.has(want)) warn(`picker has no activity '${want}'`);

  // 7. i18n (§1.6, §3.6)
  const { en, es, es_review } = m.i18n;
  for (const [lang, tbl] of [['en', en], ['es', es]]) {
    const ks = Object.keys(tbl);
    if (ks[0] !== '_meta') err(`${lang}.json: _meta not first`);
    if (!isSortedStrings(ks.slice(1))) err(`${lang}.json: keys not sorted`);
    for (const k of ks.slice(1)) if (typeof tbl[k] !== 'string' || !tbl[k].length) err(`${lang}.json: ${k} not a non-empty string`);
  }
  if (!keysEq(es_review, ['missing_keys', 'machine_translated'])) err('es_review keys != {missing_keys, machine_translated}');
  for (const f of ['missing_keys', 'machine_translated']) if (!isSortedStrings(es_review[f])) err(`es_review.${f} not sorted unique`);
  for (const k of es_review.missing_keys) { if (k in es) err(`es_review.missing_keys lists translated ${k}`); if (!(k in en)) err(`es_review.missing_keys lists unknown ${k}`); }
  for (const k of es_review.machine_translated) if (!(k in es)) err(`es_review.machine_translated lists untranslated ${k}`);
  for (const k of Object.keys(es)) if (k !== '_meta' && !(k in en)) warn(`ES key without EN: ${k}`);
  const missingSet = new Set(es_review.missing_keys);
  const machineSet = new Set(es_review.machine_translated);
  for (const k of Object.keys(en)) if (k !== '_meta' && !(k in es) && !missingSet.has(k)) err(`ES missing and not in es_review.missing_keys: ${k}`);
  for (const k of Object.keys(es)) if (k !== '_meta' && k in en && ph(en[k]) !== ph(es[k])) (machineSet.has(k) ? err : warn)(`placeholders differ EN/ES for ${k}: {${ph(en[k])}} vs {${ph(es[k])}}`);
  const needKeys = new Set();
  for (const e of C.exercises) { needKeys.add(e.name_key); if (e.cue_key) needKeys.add(e.cue_key); }
  for (const p of Object.values(P.sports)) needKeys.add(p.name_key);
  for (const s of P.picker.sports) needKeys.add(s.name_key);
  for (const k of rulesKeys(m.rules)) needKeys.add(k);
  for (const k of needKeys) if (!(k in en)) err(`missing EN key ${k}`);
  for (const k of [...m.rules.muscles.order.map(x => `muscle.${x}`), ...m.rules.muscles.groups.order.map(x => `group.${x}`), ...WEEKDAYS.map(x => `weekday.${x}`), ...Object.keys(P.goals).map(x => `goal.${x}`), ...m.rules.ordering.block_order.map(x => `block.${x}`)]) if (!(k in en)) warn(`render key missing in EN: ${k}`);
  if (fixture && !opts.isFixture) {
    for (const k of Object.keys(fixture.i18n.en)) if (k !== '_meta' && !(k in en)) err(`fixture EN key missing from the compiled EN: ${k}`);
    // shape signatures: every compiled object shape must exist in the fixture
    const sm = signatures(m), sf = signatures(fixture);
    for (const [kind, set] of Object.entries(sm)) for (const s of set) if (!sf[kind] || !sf[kind].has(s)) err(`shape '${kind}' not in the fixture: ${s.slice(0, 160)}`);
  }

  // 8. the architect's check-fixture checks on the assembled model
  const fc = fixtureChecks(m);
  for (const e of fc.errors) err(`check-fixture: ${e}`);
  const stats = { exercises: counts.exercises, templates: fc.templates, stations: fc.stations, profiles: counts.profiles, sports_in_picker: counts.sports_in_picker, activities: counts.activities, en_keys: Object.keys(en).length - 1, es_keys: Object.keys(es).length - 1, es_missing: es_review.missing_keys.length, es_machine_translated: es_review.machine_translated.length, check_fixture_warnings: fc.warns.length };
  return { errors, warnings: [...warnings, ...fc.warns.map(w => `check-fixture: ${w}`)], stats };
}

// ---------------------------------------------------------------- CLI
const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const arg = process.argv.slice(2).find(a => a === '--fixture' || !a.startsWith('--')) || path.join(BASE, 'model');
  let raw, label, isFixture = false;
  if (arg === '--fixture') { raw = readFixture(); label = path.relative(BASE, FIXTURE_PATH); isFixture = true; if (!raw) { console.error('fixture not found'); process.exit(1); } }
  else { const dir = path.resolve(arg); if (!fs.existsSync(path.join(dir, 'manifest.json'))) { console.error(`no manifest.json in ${dir} (run node tools/compile-model.mjs first)`); process.exit(1); } raw = readModelDir(dir); label = path.relative(BASE, dir) || '.'; }
  const { errors, warnings, stats } = checkModel(raw, { isFixture });
  console.log(JSON.stringify({ model: label, version: raw.manifest.model_version, ...stats, errors: errors.length, warnings: warnings.length }));
  for (const e of errors.slice(0, 80)) console.log('ERROR', e);
  if (errors.length > 80) console.log(`... ${errors.length - 80} more errors`);
  if (process.argv.includes('--verbose')) for (const w of warnings) console.log('WARN', w);
  else if (warnings.length) console.log(`(${warnings.length} warnings; --verbose lists them)`);
  process.exit(errors.length ? 1 : 0);
}
