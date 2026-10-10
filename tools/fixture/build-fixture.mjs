#!/usr/bin/env node
// tools/fixture/build-fixture.mjs - builds engine/fixtures/mini-model.json (model/2 shapes, v1.1) from the read-only sources.
// Owner: architect. Deterministic (no clock, sorted output). Usage: node tools/fixture/build-fixture.mjs
// The fixture = the reference compile: rules complete and normative; catalog = every active 02 record; templates = all 30
// 05 v1.1 templates with their variants; profiles = all 127 04 v1.1 profiles + sports picker + activities; i18n EN complete,
// ES partial on purpose (fallback path). B1's compiler must reproduce `rules` exactly and the other shapes field-for-field.
import fs from 'node:fs';
import path from 'node:path';
import { BASE, SYN, readJSON, normalizeExercise, cleanName, isActive } from './catalog.mjs';
import { buildRules } from './rules.mjs';
import { BUCKETS, normTemplate, normSport, normPicker, GOALS, PROGRAM_NAMES, PROGRAM_NAME_STRINGS } from './templates-profiles.mjs';
import { UI, SLOT_NAMES, ES_EXERCISES } from './i18n.mjs';
import { UI_V11, REMOVED_KEYS } from './i18n-v11.mjs';
import { amendExercise, amendRules, amendTemplates, amendSport, UI_V12, V12_FINAL, plainDayLabel } from './review-v12.mjs';
import { amendRulesR3, UI_R3, R3_FINAL, R3_VERSION } from './round3.mjs';
import { amendExerciseB2, amendSportB2, amendRulesB2, amendTemplatesB2, amendProgramNamesB2, UI_B2, B2_FINAL } from './athletic-b2.mjs';
import { amendExerciseB3, amendRulesB3, UI_B3, B3_FINAL, REMOVED_B3, EXERCISE_TEXT_B3, esDayLabelB3 } from './render-b3.mjs';
import { amendRulesB4, UI_B4, B4_FINAL } from './integrate-b4.mjs';
import { amendRulesF1, UI_F1, F1_FINAL } from './fix-r1-f1.mjs';
import { amendRulesF2, amendSportF2, UI_F2, F2_FINAL } from './fix-r1-f2.mjs';
import { amendRulesF3, amendExerciseF3, UI_F3, F3_FINAL, TEXT_F3 } from './fix-r1-f3.mjs';
import { amendRulesR2F1, amendTemplatesR2F1, UI_R2F1, R2F1_FINAL } from './fix-r2-f1.mjs';
import { amendRulesR2F2, amendSportR2F2, amendExerciseR2F2, UI_R2F2, R2F2_FINAL } from './fix-r2-f2.mjs';
import { amendRulesR2F3, amendExerciseR2F3, UI_R2F3, R2F3_FINAL, TEXT_R2F3 } from './fix-r2-f3.mjs';

const spec = readJSON(path.join(BASE, 'generator_spec_v1.json'));
const cat = readJSON(path.join(SYN, '02_exercise_catalog.json'));
const tpl = readJSON(path.join(SYN, '05_templates.json'));
const prof = readJSON(path.join(SYN, '04_profiles.json'));
const eqm = readJSON(path.join(SYN, '10_equipment_model.json'));

const SLOT_NAMES_V11 = { PREHAB_LOWER: ['Knee / ankle care', 'Cuidado de rodilla / tobillo'], PREHAB_NECK: ['Neck care', 'Cuidado del cuello'], RECOVERY_ARM_CARE: ['Shoulder / arm care', 'Cuidado de hombro / brazo'], COND_WOD: ['WOD (workout of the day)', 'WOD (entrenamiento del día)'] };
const ES_EXERCISES_V11 = {
  'kb-face-pull': 'Face pull con kettlebell (KB Face Pull)', 'face-pull': 'Face pull en polea (Face Pull)', 'floor-prone-y-t-raises': 'Elevaciones Y / T boca abajo en el piso (Prone Y-T Raises)',
  'side-lying-db-external-rotation': 'Rotación externa acostado de lado con mancuerna (Side-Lying External Rotation)', 'cable-external-rotation-elbow-at-side-or-90-90': 'Rotación externa en polea (Cable External Rotation)',
  'scapular-push-up-push-up-plus': 'Lagartija escapular (Push-Up Plus)', 'streamline-squat-jump-arms-overhead': 'Salto en sentadilla en posición de flecha (Streamline Squat Jump)', 'streamline-hold-hollow-body-arms-overhead': 'Posición de flecha en hollow (Streamline Hold)',
  'single-arm-db-snatch': 'Arranque con mancuerna a una mano (Single-Arm DB Snatch)', 'kb-squat-clean': 'Cargada con kettlebell en sentadilla (KB Squat Clean)', 'hex-bar-jump-squat': 'Salto con barra hexagonal (Hex-Bar Jump)',
  'high-hang-clean-pull': 'Jalón de cargada desde colgado alto (High-Hang Clean Pull)', 'high-hang-snatch-pull': 'Jalón de arranque desde colgado alto (High-Hang Snatch Pull)', 'power-clean': 'Cargada de potencia (Power Clean)', 'power-snatch': 'Arranque de potencia (Power Snatch)',
  'hang-power-clean-from-the-high-hang-hip-crease': 'Cargada de potencia desde colgado alto (Hang Power Clean)', 'kettlebell-swing-russian': 'Swing ruso con kettlebell (KB Swing)', 'barbell-thruster': 'Thruster con barra (Barbell Thruster)',
  'db-thruster-front-squat-into-overhead-press': 'Thruster con mancuernas (DB Thruster)', 'wall-ball-medball-squat-to-target': 'Lanzamiento a la pared con balón (Wall Ball)', 'burpees': 'Burpees', 'burpee-broad-jump': 'Burpee con salto largo (Burpee Broad Jump)',
  'double-unders-jump-rope': 'Dobles con cuerda (Double-Unders)', 'toes-to-bar-hanging': 'Pies a la barra (Toes-to-Bar)', 'split-step-reaction-drill': 'Split step con reacción (Split-Step Reaction Drill)', 'single-leg-balance-reach-front-side-back': 'Equilibrio a una pierna con alcance (Single-Leg Balance Reach)',
  'tibialis-raise-back-against-a-wall': 'Elevación de tibial contra la pared (Tibialis Raise)', 'seated-bent-knee-calf-raise-soleus': 'Elevación de talones sentado (Seated Calf Raise)', 'lateral-shuffles': 'Desplazamientos laterales (Lateral Shuffles)',
  'belt-squat-machine': 'Sentadilla con cinturón (Belt Squat)', 'seated-machine-shoulder-press': 'Press de hombro sentado en máquina (Machine Shoulder Press)', 'kb-curl': 'Curl con kettlebell (KB Curl)', 'table-row-inverted-row-under-a-sturdy-table': 'Remo bajo una mesa (Table Row)',
  'copenhagen-plank': 'Plancha Copenhague (Copenhagen Plank)', 'nordic-hamstring-curl': 'Curl nórdico (Nordic Curl)', 'medball-overhead-throw': 'Lanzamiento de balón medicinal sobre la cabeza (Overhead Throw)',
  'farmer-carry': 'Caminata del granjero (Farmer Carry)', 'sled-push': 'Empuje de trineo (Sled Push)', 'calorie-effort-15-cal-bike-rower-ski': 'Esfuerzo de 15 calorías (bici / remo / ski)', 'single-leg-rdl-single-leg-deadlift': 'Peso muerto rumano a una pierna (Single-Leg RDL)'
};

// ---------------------------------------------------------------- catalog (every active record)
const exercises = [], dropped = [], aliases = {}, enNames = {}, enCues = {};
for (const r of cat) {
  if (!isActive(r)) { dropped.push({ source_id: r.id, reason: r.record_type === 'exercise' || r.record_type === 'drill' ? 'not_eligible' : r.record_type }); continue; }
  const ex0 = normalizeExercise(r);
  if (!ex0) { dropped.push({ source_id: r.id, reason: 'band_only', rule: 'EQ-01' }); continue; }
  const ex = amendExerciseR2F3(amendExerciseR2F2(amendExerciseF3(amendExerciseB3(amendExerciseB2(amendExercise(ex0)))))); // (+ fix round 2 / F3, fix-r2-f3.mjs) // (+ fix round 2 / F2, fix-r2-f2.mjs) // (+ F3, fix-r1-f3.mjs) // v1.2 review amendments (review-v12.mjs), the B2 athletic amendments (athletic-b2.mjs), then B3 (render-b3.mjs)
  exercises.push(ex);
  if (ex.id !== ex.source_id) aliases[ex.source_id] = ex.id;
  enNames[ex.name_key] = cleanName(r);
  if (ex.cue_key) enCues[ex.cue_key] = r.coach_cues[0].cue;
}
exercises.sort((a, b) => (a.id < b.id ? -1 : 1));

// ---------------------------------------------------------------- templates (all 30 + variants)
const families = {};
for (const [fam, src] of Object.entries(tpl.generator_split_templates)) {
  families[fam] = { pairing: src.pairing_mode, default_minutes: src.default_minutes, notes: src.family_notes, days: {} };
  for (const d of ['2', '3', '4', '5', '6']) if (src[d]) families[fam].days[d] = normTemplate(fam, d, src[d]);
}
{ const amended = amendTemplates(families); for (const k of Object.keys(families)) families[k] = amended[k]; }
{ const b2 = amendTemplatesB2(families); for (const k of Object.keys(families)) families[k] = b2[k]; } // R3-ATH-03 HYROX variant (athletic-b2.mjs)
{ const r2 = amendTemplatesR2F1(families); for (const k of Object.keys(families)) families[k] = r2[k]; } // fix round 2 / F1: athletic.3 cross pattern (fix-r2-f1.mjs)
const templates = {
  schema: 'templates/2',
  buckets: BUCKETS,
  goal_to_family: { muscle: 'aesthetics', strength: 'strength', athletic: 'athletic', active: 'athletic', fat_loss: 'fat_loss_bootcamp', general: 'fat_loss_bootcamp', hybrid: 'hybrid_crossfit' },
  kit_family_override: { profiles: ['BODYWEIGHT', 'FIELD_TRACK_NO_KIT'], family: 'no_equipment', except_goals: ['athletic', 'active'] },
  families,
  program_names: amendProgramNamesB2(PROGRAM_NAMES)
};

// ---------------------------------------------------------------- profiles (all 127 + picker + activities)
const classEnd = { 1: 0.75, 2: 0.6, 3: 0.5, 4: 0.4, 5: 0.25 };
const sports = {};
for (const p of prof.profiles.slice().sort((a, b) => (a.id < b.id ? -1 : 1))) sports[p.id] = amendSportR2F2(amendSportF2(amendSportB2(amendSport(normSport(p, classEnd), p), p), p)); // (+ fix round 2 / F2: pre-season speed and power) // (+ F2: Olympic ceiling, reactive COD)
const picker = normPicker(prof);
const profiles = {
  schema: 'profiles/2',
  goals: GOALS,
  sports,
  picker,
  goal_defaults: prof.goal_defaults,
  age_overlays: Object.fromEntries(Object.keys(prof.age_overlays).map(k => [k, { when: prof.age_overlays[k].when, scope: prof.age_overlays[k].scope }])),
  id_aliases: { profiles: prof.id_aliases.profiles || {}, sports: prof.id_aliases.sports || {} },
  recreational_profile: 'weekend_warrior'
};

// ---------------------------------------------------------------- i18n
const en = { _meta: { lang: 'en', status: 'canonical', version: '1.1.0' } };
const es = { _meta: { lang: 'es', status: 'PROPOSED - PENDING COACH APPROVAL (neutral Latin American; gym term in brackets, R2-GEN-08)', version: '1.1.0' } };
const put = (k, e, s) => { en[k] = e; if (s !== undefined && s !== null) es[k] = s; };
for (const [k, [e, s]] of Object.entries(UI)) put(k, e, s);
for (const [k, [e, s]] of Object.entries(UI_V11)) put(k, e, s);
for (const [k, [e, s]] of Object.entries(UI_V12)) put(k, e, s);
for (const [k, [e, s]] of Object.entries(UI_R3)) put(k, e, s); // round-3 words (tools/fixture/round3.mjs)
for (const [k, [e, s]] of Object.entries(UI_B2)) put(k, e, s); // stage-B2 athletic words (tools/fixture/athletic-b2.mjs)
for (const [k, [e, s]] of Object.entries(UI_B3)) put(k, e, s); // stage-B3 selection / render words (tools/fixture/render-b3.mjs)
for (const [k, [e, s]] of Object.entries(UI_B4)) put(k, e, s); // stage-B4 integration words (tools/fixture/integrate-b4.mjs)
for (const [k, [e, s]] of Object.entries(UI_F1)) put(k, e, s); // fix round 1 / F1 words (tools/fixture/fix-r1-f1.mjs)
for (const [k, [e, s]] of Object.entries(UI_F2)) put(k, e, s); // fix round 1 / F2 words (tools/fixture/fix-r1-f2.mjs)
for (const [k, [e, s]] of Object.entries(UI_F3)) put(k, e, s); // fix round 1 / F3 words (tools/fixture/fix-r1-f3.mjs)
for (const [k, [e, s]] of Object.entries(UI_R2F1)) put(k, e, s); // fix round 2 / F1 words (tools/fixture/fix-r2-f1.mjs)
for (const [k, [e, s]] of Object.entries(UI_R2F2)) put(k, e, s); // fix round 2 / F2 words (tools/fixture/fix-r2-f2.mjs)
for (const [k, [e, s]] of Object.entries(UI_R2F3)) put(k, e, s); // fix round 2 / F3 words (tools/fixture/fix-r2-f3.mjs)
for (const k of REMOVED_KEYS) { if (!(k in UI_V11)) { delete en[k]; delete es[k]; } }
for (const [b, [e, s]] of Object.entries({ ...SLOT_NAMES, ...SLOT_NAMES_V11 })) put(`slot.${b}`, e, s);
for (const [id, [e, s]] of Object.entries(PROGRAM_NAME_STRINGS)) put(`program.${id}.name`, e, s);
// day labels (EN from 05; ES left to B1 -> es_review)
for (const fam of Object.values(families)) for (const t of Object.values(fam.days)) {
  for (const dt of Object.values(t.day_types)) en[dt.label_key] = plainDayLabel(dt.label, 'en');
  for (const v of Object.values(t.variants)) for (const dt of Object.values(v.day_types)) en[dt.label_key] = plainDayLabel(dt.label, 'en');
}
// intake labels + options from the spec (EN + ES given there)
for (const f of Object.values(spec.inputs_schema.fields)) {
  if (f.i18n_key && f.label) put(f.i18n_key, f.label.en, f.label.es);
  for (const o of (Array.isArray(f.options) ? f.options : [])) if (o && o.i18n_key) put(o.i18n_key, o.en, o.es);
}
// copy placeholders (health, release, warnings, video, effort, block prompts) - LEGAL REVIEW where marked
for (const block of [spec.inputs_schema.copy_placeholders.strings, spec.output.copy.strings, spec.adaptation.copy.strings]) for (const [k, v] of Object.entries(block || {})) if (v && v.en) put(k, v.en, v.es);
for (const k of V12_FINAL) put(k, UI_V12[k][0], UI_V12[k][1]); // v1.2 review strings win over the v1 spec copy
for (const k of R3_FINAL) put(k, UI_R3[k][0], UI_R3[k][1]); // round-3 strings win over the v1 spec copy
for (const k of B2_FINAL) put(k, UI_B2[k][0], UI_B2[k][1]); // stage-B2 strings win too
for (const k of B3_FINAL) put(k, UI_B3[k][0], UI_B3[k][1]); // stage-B3 strings win too
for (const k of B4_FINAL) put(k, UI_B4[k][0], UI_B4[k][1]); // stage-B4 strings win too
for (const k of F1_FINAL) put(k, UI_F1[k][0], UI_F1[k][1]); // fix round 1 / F1 strings win too
for (const k of F2_FINAL) put(k, UI_F2[k][0], UI_F2[k][1]); // fix round 1 / F2 strings win too
for (const k of F3_FINAL) put(k, UI_F3[k][0], UI_F3[k][1]); // fix round 1 / F3 strings win too
for (const k of R2F1_FINAL) put(k, UI_R2F1[k][0], UI_R2F1[k][1]); // fix round 2 / F1 strings win too
for (const k of R2F2_FINAL) put(k, UI_R2F2[k][0], UI_R2F2[k][1]); // fix round 2 / F2 strings win too
for (const k of R2F3_FINAL) put(k, UI_R2F3[k][0], UI_R2F3[k][1]); // fix round 2 / F3 strings win too
for (const k of REMOVED_B3) { delete en[k]; delete es[k]; } // check-in words retired (R3-VOL-02)
for (const [q, k] of Object.entries(spec.adaptation.checkin_schema.i18n_keys)) put(k, spec.adaptation.checkin_schema.labels[q].en, spec.adaptation.checkin_schema.labels[q].es);
// profiles, sports, positions, activities (EN + ES from 04 v1.1)
for (const p of prof.profiles) { put(`profile.${p.id}.name`, p.name, p.name_es || undefined); for (const v of (p.variants || [])) put(`profile.${v.id}.name`, v.name || v.id, v.name_es || undefined); }
for (const g of prof.sports.groups) put(`sport_group.${g.id}.name`, g.en, g.es);
for (const s of prof.sports.list) {
  put(`sport.${s.id}.name`, s.en, s.es);
  for (const p of (s.positions || [])) put(`sport.${s.id}.position.${p.value}`, p.en, p.es);
  if (s.second_choice) { put(`sport.${s.id}.second_choice`, s.second_choice.label.en, s.second_choice.label.es); for (const o of s.second_choice.options) put(`sport.${s.id}.second_choice.${o.value}`, o.en, o.es); }
}
for (const a of prof.activities.list) put(`activity.${a.id}.name`, a.en, a.es);
// exercise names / cues
Object.assign(en, enNames, enCues);
const esEx = { ...ES_EXERCISES, ...ES_EXERCISES_V11 };
for (const ex of exercises) if (esEx[ex.id]) es[ex.name_key] = esEx[ex.id];
for (const [k, [e, s]] of Object.entries(EXERCISE_TEXT_B3)) if (k in en) { if (e) en[k] = e; if (s) es[k] = s; } // stage-B3 names / cues (render-b3.mjs)
for (const k of Object.keys(es)) if (/^day\./.test(k)) es[k] = esDayLabelB3(es[k]); // a generic 'pull' is a 'tirón' (B3)
for (const [k, [e, s]] of Object.entries(TEXT_F3)) if (k in en) { if (e) en[k] = e; if (s) es[k] = s; } // fix round 1 / F3 names (fix-r1-f3.mjs)
for (const [k, [e, s]] of Object.entries(TEXT_R2F3)) if (k in en) { if (e) en[k] = e; if (s) es[k] = s; } // fix round 2 / F3 names / cues (fix-r2-f3.mjs)
const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a === '_meta' ? -1 : b === '_meta' ? 1 : a < b ? -1 : a > b ? 1 : 0)));
const esMissing = Object.keys(en).filter(k => k !== '_meta' && !(k in es)).sort();

const rules = amendRulesR2F3(amendRulesR2F2(amendRulesR2F1(amendRulesF3(amendRulesF2(amendRulesF1(amendRulesB4(amendRulesB3(amendRulesB2(amendRulesR3(amendRules(buildRules(eqm)))))))))))); // (+ fix round 2 / F3, fix-r2-f3.mjs) // (+ fix round 2 / F2, fix-r2-f2.mjs) // (+ fix round 2 / F1, fix-r2-f1.mjs) // (+ fix round 1 / F1, F2, F3) v1.2 review amendments, the round-3 answers, stage B2 (athletic), stage B3 (selection / render), then stage B4 (integration)
const templateCount = Object.values(families).reduce((n, f) => n + Object.keys(f.days).length, 0);
const model = {
  _fixture: {
    purpose: 'Reference model for builders (engine/CONTRACTS.md v1.1). Same shapes as model/*.json. rules = complete and normative (B1 must deep-equal); catalog = every active 02 v1.1 record; templates = all 05 v1.1 templates + variants; profiles = all 04 v1.1 profiles + sports picker + activities; i18n EN complete, ES partial on purpose (fallback path, es_review).',
    built_by: 'node tools/fixture/build-fixture.mjs',
    built_from: ['generator_spec_v1.json ' + spec._meta.version, 'coach_answers_round2.md', 'synthesis/02_exercise_catalog.json v1.1', 'synthesis/04_profiles.json v1.1', 'synthesis/05_templates.json v1.1', 'synthesis/10_equipment_model.json', 'synthesis/12_volume_algorithm_v1.json v1.1'],
    counts: { exercises: exercises.length, dropped: dropped.length, templates: templateCount, profiles: Object.keys(sports).length, sports_in_picker: picker.sports.length, activities: picker.activities.length, en_keys: Object.keys(en).length - 1, es_missing: esMissing.length },
    do_not_edit_by_hand: 'edit tools/fixture/*.mjs and rebuild; update engine/CONTRACTS.md with any shape change'
  },
  manifest: {
    schema: 'manifest/2',
    model_version: R3_VERSION + '-fixture',
    spec_version: spec._meta.version,
    contracts_version: '1.1.0',
    files: { catalog: 'catalog.json', rules: 'rules.json', templates: 'templates.json', profiles: 'profiles.json', i18n: { en: 'i18n/en.json', es: 'i18n/es.json', es_review: 'i18n/es_review.json' } },
    languages: ['en', 'es'], default_lang: 'en',
    counts: { exercises: exercises.length, templates: templateCount, profiles: Object.keys(sports).length, sports_in_picker: picker.sports.length, activities: picker.activities.length }
  },
  catalog: { schema: 'catalog/2', model_version: R3_VERSION + '-fixture', id_aliases: Object.fromEntries(Object.entries(aliases).sort()), exercises },
  rules,
  templates,
  profiles,
  i18n: { en: sortObj(en), es: sortObj(es), es_review: { missing_keys: esMissing, machine_translated: [] } }
};
const out = path.join(BASE, 'engine', 'fixtures', 'mini-model.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(model, null, 1) + '\n');
console.log(JSON.stringify(model._fixture.counts), 'bytes', fs.statSync(out).size);
