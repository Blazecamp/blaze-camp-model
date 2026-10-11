// tools/compile/i18n.mjs - B1 (model compiler): model/i18n/en.json, es.json, es_review.json (CONTRACTS §1.6, §3.6).
// EN: the same assembly as the reference build (UI word lists, slot / program names, day labels from 05, intake labels and
// [LEGAL REVIEW] copy verbatim from the spec, profile / sport / activity names from 04 v1.1, exercise names and cues from
// 02 v1.1). The UI / why word lists are the architect's (tools/fixture/i18n.mjs + i18n-v11.mjs, imported read-only:
// "the compiler copies the fixture's UI / why strings", CONTRACTS §7).
// ES: neutral Latin American Spanish with the English gym term in brackets (R2-GEN-08). Sources, in priority order:
//   spec (EN + ES given there, incl. [LEGAL REVIEW] copy, never edited) > 04 v1.1 name_es > architect word lists >
//   B1 machine translation (tools/compile/es/*.mjs). Every B1 line is listed in es_review.machine_translated;
//   every EN key still without ES is listed in es_review.missing_keys (render falls back to EN).
import { UI, SLOT_NAMES, ES_EXERCISES } from '../fixture/i18n.mjs';
import { UI_V11, REMOVED_KEYS } from '../fixture/i18n-v11.mjs';
import { UI_V12, V12_FINAL, plainDayLabel } from '../fixture/review-v12.mjs';
import { UI_R3, R3_FINAL } from '../fixture/round3.mjs';
import { UI_B2, B2_FINAL } from '../fixture/athletic-b2.mjs';
import { UI_B3, B3_FINAL, REMOVED_B3, EXERCISE_TEXT_B3, esDayLabelB3 } from '../fixture/render-b3.mjs';
import { UI_B4, B4_FINAL } from '../fixture/integrate-b4.mjs';
import { UI_F1, F1_FINAL } from '../fixture/fix-r1-f1.mjs';
import { UI_F2, F2_FINAL } from '../fixture/fix-r1-f2.mjs';
import { UI_F3, F3_FINAL, TEXT_F3, ES_PRIORITY_F3 } from '../fixture/fix-r1-f3.mjs';
import { UI_R2F1, R2F1_FINAL } from '../fixture/fix-r2-f1.mjs';
import { UI_R2F2, R2F2_FINAL } from '../fixture/fix-r2-f2.mjs';
import { UI_R2F3, R2F3_FINAL, TEXT_R2F3, ES_PRIORITY_R2F3 } from '../fixture/fix-r2-f3.mjs';
import { UI_V05, V05_FINAL, isRemovedV05 } from '../fixture/v05-structure.mjs';
import { UI_V2, V2_FINAL, ES_PRIORITY_V2 } from '../fixture/v05-library.mjs';
import { UI_V3, V3_FINAL, isRemovedV3, ES_REVIEW_V3, ES_PRIORITY_V3 } from '../fixture/v05-words.mjs';
import { UI_X1 } from '../fixture/v05-fix1.mjs';
import { UI_X2 } from '../fixture/v05-fix2.mjs';
import { UI_V06 } from '../fixture/v06-volume.mjs';
import { UI_W6, ES_PRIORITY_W6 } from '../fixture/v06-words.mjs';
import { UI_S6 } from '../fixture/v06-select.mjs';
import { PROGRAM_NAME_STRINGS } from './templates-profiles.mjs';
import { ES_EXERCISE_NAMES } from './es/exercises.mjs';
import { ES_CUES, ES_DAY_LABELS, ES_PROFILE_NAMES, ES_MISC } from './es/labels.mjs';
import { sortKeys } from './sources.mjs';

// Copied from tools/fixture/build-fixture.mjs (module-local there, so not importable); keep in sync (tests/compile.test.mjs
// compares the compiled ES of every fixture key with the fixture's ES).
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

/** ES provenance labels (COMPILE_REPORT.i18n.es_sources) */
export const ES_SOURCE = { spec: 'spec', profiles04: 'profiles_04', wordlist: 'architect_wordlist', b1: 'b1_machine_translation', review: 'v3_spanish_review' };

// FIX-03 / FIX-04 ("program and day names generic and understandable; spelling corrected in the generator only, his sheets
// untouched"): decoder notes that leaked into user-facing EN text (day labels, cues, profile names) are removed here; the
// templates' own `label` field stays verbatim (same output as the reference build) and only the rendered EN string changes.
/** @param {string} s @returns {string} */
export function cleanUserText(s) {
  let t = String(s)
    .replace(/\s*\(the BYOP cell[^)]*\)/g, '')
    .replace(/^INFERRED \([^)]*\):\s*/, '')
    .replace(/\s*Confirm with the coach\.?$/, '')
    .replace(/\s*\((?:complete|corrected)\)/g, '')
    .replace(/\s*\(OT\d+[^)]*\)/g, '')
    .replace(/,\s*INFERRED\)/g, ')')
    .replace(/\s*\(COACH-[A-Z0-9]+ [A-Z]+-\d+\)/g, '')
    .replace(/\(bodyweight pools\)/g, '(bodyweight)')
    .replace(/\s{2,}/g, ' ').trim();
  if (t !== s && /^[a-z]/.test(t)) t = t[0].toUpperCase() + t.slice(1);
  return t;
}

const PLACEHOLDER_RE = /\{([a-zA-Z0-9_]+)\}/g;
/** @param {string} s @returns {string[]} sorted unique placeholder names */
export function placeholders(s) { return [...new Set([...String(s).matchAll(PLACEHOLDER_RE)].map(m => m[1]))].sort(); }

/**
 * @param {{spec:object, prof:object, families:object, exercises:object[], enNames:Object<string,string>, enCues:Object<string,string>}} input
 * @returns {{en:object, es:object, es_review:{missing_keys:string[], machine_translated:string[]}, provenance:Object<string,string>, cleaned_en:object[], stats:object, problems:string[]}}
 */
export function buildI18n({ spec, prof, families, exercises, enNames, enCues }) {
  const en = { _meta: { lang: 'en', status: 'canonical', version: '1.1.0' } };
  const es = { _meta: { lang: 'es', status: 'PROPOSED - PENDING COACH APPROVAL (neutral Latin American Spanish; English gym term in brackets, R2-GEN-08). Lines in es_review.machine_translated were machine-translated by the model compiler and need a human review.', version: '1.1.0' } };
  const prov = {};
  const problems = [];
  const put = (k, e, s, source) => { en[k] = e; if (s !== undefined && s !== null) { es[k] = s; prov[k] = source; } };
  const cleaned = []; // {key, from, to}
  const clean = (k, v) => { const c = cleanUserText(v); if (c !== v) cleaned.push({ key: k, from: v, to: c }); return c; };

  for (const [k, [e, s]] of Object.entries(UI)) put(k, e, s, ES_SOURCE.wordlist);
  for (const [k, [e, s]] of Object.entries(UI_V11)) put(k, e, s, ES_SOURCE.wordlist);
  for (const [k, [e, s]] of Object.entries(UI_V12)) put(k, e, s, ES_SOURCE.wordlist);
  for (const [k, [e, s]] of Object.entries(UI_R3)) put(k, e, s, ES_SOURCE.wordlist); // round-3 words (tools/fixture/round3.mjs)
  for (const [k, [e, s]] of Object.entries(UI_B2)) put(k, e, s, ES_SOURCE.wordlist); // stage-B2 athletic words (tools/fixture/athletic-b2.mjs)
  for (const [k, [e, s]] of Object.entries(UI_B3)) put(k, e, s, ES_SOURCE.wordlist); // stage-B3 selection / render words (tools/fixture/render-b3.mjs)
  for (const [k, [e, s]] of Object.entries(UI_B4)) put(k, e, s, ES_SOURCE.wordlist); // stage-B4 integration words (tools/fixture/integrate-b4.mjs)
  for (const [k, [e, s]] of Object.entries(UI_F1)) put(k, e, s, ES_SOURCE.wordlist); // fix round 1 / F1 words (tools/fixture/fix-r1-f1.mjs)
  for (const [k, [e, s]] of Object.entries(UI_F2)) put(k, e, s, ES_SOURCE.wordlist); // fix round 1 / F2 words (tools/fixture/fix-r1-f2.mjs)
  for (const [k, [e, s]] of Object.entries(UI_F3)) put(k, e, s, ES_SOURCE.wordlist); // fix round 1 / F3 words (tools/fixture/fix-r1-f3.mjs)
  for (const [k, [e, s]] of Object.entries(UI_R2F1)) put(k, e, s, ES_SOURCE.wordlist); // fix round 2 / F1 words (tools/fixture/fix-r2-f1.mjs)
  for (const [k, [e, s]] of Object.entries(UI_R2F2)) put(k, e, s, ES_SOURCE.wordlist); // fix round 2 / F2 words (tools/fixture/fix-r2-f2.mjs)
  for (const [k, [e, s]] of Object.entries(UI_R2F3)) put(k, e, s, ES_SOURCE.wordlist); // fix round 2 / F3 words (tools/fixture/fix-r2-f3.mjs)
  for (const [k, [e, s]] of Object.entries(UI_V05)) put(k, e, s, ES_SOURCE.wordlist); // engine 0.5.0 / V1 words (tools/fixture/v05-structure.mjs)
  for (const [k, [e, s]] of Object.entries(UI_V2)) put(k, e, s, ES_SOURCE.wordlist); // engine 0.5.0 / V2 words (tools/fixture/v05-library.mjs)
  for (const [k, [e, s]] of Object.entries(UI_V3)) put(k, e, s, ES_SOURCE.wordlist); // engine 0.5.0 / V3 words (tools/fixture/v05-words.mjs)
  for (const k of REMOVED_KEYS) { if (!(k in UI_V11)) { delete en[k]; delete es[k]; delete prov[k]; } }
  for (const [b, [e, s]] of Object.entries({ ...SLOT_NAMES, ...SLOT_NAMES_V11 })) put(`slot.${b}`, e, s, ES_SOURCE.wordlist);
  for (const [id, [e, s]] of Object.entries(PROGRAM_NAME_STRINGS)) put(`program.${id}.name`, e, s, ES_SOURCE.wordlist);
  // day labels (EN from 05 v1.1)
  for (const fam of Object.values(families)) for (const t of Object.values(fam.days)) {
    for (const dt of Object.values(t.day_types)) en[dt.label_key] = clean(dt.label_key, dt.label);
    for (const v of Object.values(t.variants)) for (const dt of Object.values(v.day_types)) en[dt.label_key] = clean(dt.label_key, dt.label);
  }
  // intake labels + options (spec gives EN + ES)
  for (const f of Object.values(spec.inputs_schema.fields)) {
    if (f.i18n_key && f.label) put(f.i18n_key, f.label.en, f.label.es, ES_SOURCE.spec);
    for (const o of (Array.isArray(f.options) ? f.options : [])) if (o && o.i18n_key) put(o.i18n_key, o.en, o.es, ES_SOURCE.spec);
  }
  // copy placeholders (health check, release, warnings, video, effort, block prompts) - [LEGAL REVIEW] verbatim
  for (const block of [spec.inputs_schema.copy_placeholders.strings, spec.output.copy.strings, spec.adaptation.copy.strings]) for (const [k, v] of Object.entries(block || {})) if (v && v.en) put(k, v.en, v.es, ES_SOURCE.spec);
  // v1.2 review strings are the newest authority: they win over the v1 spec copy too (e.g. video.note without [VIDEO_CONTACT])
  for (const k of V12_FINAL) put(k, UI_V12[k][0], UI_V12[k][1], ES_SOURCE.wordlist);
  for (const k of R3_FINAL) put(k, UI_R3[k][0], UI_R3[k][1], ES_SOURCE.wordlist); // round-3 strings win over the v1 spec copy
  for (const k of B2_FINAL) put(k, UI_B2[k][0], UI_B2[k][1], ES_SOURCE.wordlist); // stage-B2 strings win too
  for (const k of B3_FINAL) put(k, UI_B3[k][0], UI_B3[k][1], ES_SOURCE.wordlist); // stage-B3 strings win too
  for (const k of B4_FINAL) put(k, UI_B4[k][0], UI_B4[k][1], ES_SOURCE.wordlist); // stage-B4 strings win too
  for (const k of F1_FINAL) put(k, UI_F1[k][0], UI_F1[k][1], ES_SOURCE.wordlist); // fix round 1 / F1 strings win too
  for (const k of F2_FINAL) put(k, UI_F2[k][0], UI_F2[k][1], ES_SOURCE.wordlist); // fix round 1 / F2 strings win too
  for (const k of F3_FINAL) put(k, UI_F3[k][0], UI_F3[k][1], ES_SOURCE.wordlist); // fix round 1 / F3 strings win too
  for (const k of R2F1_FINAL) put(k, UI_R2F1[k][0], UI_R2F1[k][1], ES_SOURCE.wordlist); // fix round 2 / F1 strings win too
  for (const k of R2F2_FINAL) put(k, UI_R2F2[k][0], UI_R2F2[k][1], ES_SOURCE.wordlist); // fix round 2 / F2 strings win too
  for (const k of R2F3_FINAL) put(k, UI_R2F3[k][0], UI_R2F3[k][1], ES_SOURCE.wordlist); // fix round 2 / F3 strings win too
  for (const k of V05_FINAL) put(k, UI_V05[k][0], UI_V05[k][1], ES_SOURCE.wordlist); // engine 0.5.0 / V1 strings win too
  for (const k of V2_FINAL) put(k, UI_V2[k][0], UI_V2[k][1], ES_SOURCE.wordlist); // engine 0.5.0 / V2 strings win too
  for (const k of V3_FINAL) put(k, UI_V3[k][0], UI_V3[k][1], ES_SOURCE.wordlist); // engine 0.5.0 / V3 strings win too
  for (const k of REMOVED_B3) { delete en[k]; delete es[k]; delete prov[k]; } // check-in words retired (R3-VOL-02)
  for (const [q, k] of Object.entries(spec.adaptation.checkin_schema.i18n_keys)) put(k, spec.adaptation.checkin_schema.labels[q].en, spec.adaptation.checkin_schema.labels[q].es, ES_SOURCE.spec);
  // profiles, sports, positions, activities (EN + ES from 04 v1.1)
  for (const p of prof.profiles) { put(`profile.${p.id}.name`, clean(`profile.${p.id}.name`, p.name), p.name_es || undefined, ES_SOURCE.profiles04); for (const v of (p.variants || [])) put(`profile.${v.id}.name`, clean(`profile.${v.id}.name`, v.name || v.id), v.name_es || undefined, ES_SOURCE.profiles04); }
  for (const g of prof.sports.groups) put(`sport_group.${g.id}.name`, g.en, g.es, ES_SOURCE.profiles04);
  for (const s of prof.sports.list) {
    put(`sport.${s.id}.name`, s.en, s.es, ES_SOURCE.profiles04);
    for (const p of (s.positions || [])) put(`sport.${s.id}.position.${p.value}`, p.en, p.es, ES_SOURCE.profiles04);
    if (s.second_choice) { put(`sport.${s.id}.second_choice`, s.second_choice.label.en, s.second_choice.label.es, ES_SOURCE.profiles04); for (const o of s.second_choice.options) put(`sport.${s.id}.second_choice.${o.value}`, o.en, o.es, ES_SOURCE.profiles04); }
  }
  for (const a of prof.activities.list) put(`activity.${a.id}.name`, a.en, a.es, ES_SOURCE.profiles04);
  // exercise names / cues
  Object.assign(en, enNames);
  for (const [k, v] of Object.entries(enCues)) en[k] = clean(k, v);
  const esEx = { ...ES_EXERCISES, ...ES_EXERCISES_V11 };
  for (const ex of exercises) if (esEx[ex.id]) { es[ex.name_key] = esEx[ex.id]; prov[ex.name_key] = ES_SOURCE.wordlist; }
  // stage-B3 names / cues (render-b3.mjs): coach-to-coach notes out of cues, 'tirón' for Olympic pulls, no 'pájaros'
  for (const [k, [e, s]] of Object.entries(EXERCISE_TEXT_B3)) if (k in en) { if (e) en[k] = e; if (s) { es[k] = s; prov[k] = ES_SOURCE.wordlist; } }

  // ---- B1 machine translation of every EN line still without ES (R2-GEN-08, D-45)
  const machine = [];
  for (const k of Object.keys(en)) {
    if (k === '_meta' || k in es) continue;
    let s;
    if (/^exercise\..+\.name$/.test(k)) s = ES_EXERCISE_NAMES[en[k]];
    else if (/^exercise\..+\.cue$/.test(k)) s = ES_CUES[en[k]];
    else if (/^day\./.test(k)) s = ES_DAY_LABELS[en[k]];
    else if (/^profile\..+\.name$/.test(k)) s = ES_PROFILE_NAMES[en[k]];
    if (s === undefined) s = ES_MISC[k];
    if (s === undefined) continue;
    const pe = placeholders(en[k]).join(','), ps = placeholders(s).join(',');
    if (pe !== ps) { problems.push(`ES placeholders differ for ${k}: en {${pe}} es {${ps}}`); continue; }
    es[k] = s; prov[k] = ES_SOURCE.b1; machine.push(k);
  }
  // v1.2: plain client-facing day titles (jargon stays in why[])
  for (const k of Object.keys(en)) if (/^day\./.test(k)) { en[k] = plainDayLabel(en[k], 'en'); if (k in es) es[k] = esDayLabelB3(plainDayLabel(es[k], 'es')); }
  // fix round 1 / F3 names (fix-r1-f3.mjs): the same rewrite as the reference build, after the day labels
  for (const [k, [e, s]] of Object.entries(TEXT_F3)) if (k in en) { if (e) en[k] = e; if (s) { es[k] = s; prov[k] = ES_SOURCE.wordlist; } }
  // fix round 2 / F3 names / cues (fix-r2-f3.mjs): coach-only notes out of the client text, neutral Spanish (R2-GEN-08)
  for (const [k, [e, s]] of Object.entries(TEXT_R2F3)) if (k in en) { if (e) en[k] = e; if (s) { es[k] = s; prov[k] = ES_SOURCE.wordlist; } }
  for (const k of Object.keys(en)) if (isRemovedV05(k)) { delete en[k]; delete es[k]; delete prov[k]; } // time-fitting words retired (CT-01, R4-SES-01; v05-structure.mjs)
  for (const k of Object.keys(en)) if (isRemovedV3(k)) { delete en[k]; delete es[k]; delete prov[k]; } // dead time-fitting and rate-cap words (v05-words.mjs)
  // the V3 Spanish review (R2-GEN-08; v05-words.mjs): a reviewed line replaces the earlier one, whatever its source was
  const reviewed = [];
  for (const [k, s] of Object.entries(ES_REVIEW_V3)) if (k in en) {
    const pe = placeholders(en[k]).join(','), ps = placeholders(s).join(',');
    if (pe !== ps) { problems.push(`ES review placeholders differ for ${k}: en {${pe}} es {${ps}}`); continue; }
    es[k] = s; prov[k] = ES_SOURCE.review; reviewed.push(k);
  }
  // engine 0.5.0 / fix round 1 (tools/fixture/v05-fix1.mjs): the round's words are the newest and win over every earlier layer
  // (they are written last in both builds); a line the machine translation had filled is no longer a machine line
  for (const [k, [e, s]] of Object.entries({ ...UI_X1, ...UI_X2, ...UI_V06, ...UI_S6, ...UI_W6 })) { // (engine 0.6 words, tools/fixture/v06-words.mjs, win over both) // (fix round 2, tools/fixture/v05-fix2.mjs: its words win over fix round 1)
    en[k] = e;
    if (s !== undefined && s !== null) { es[k] = s; prov[k] = ES_SOURCE.wordlist; const i = machine.indexOf(k); if (i >= 0) machine.splice(i, 1); }
  }
  const missing = Object.keys(en).filter(k => k !== '_meta' && !(k in es)).sort();
  // stale table rows (translations whose EN text no longer exists) - reported so the tables stay tidy
  const enValues = new Set(Object.values(en).filter(v => typeof v === 'string'));
  const unused = [
    ...Object.keys(ES_EXERCISE_NAMES).filter(t => !enValues.has(t)).map(t => `exercise name: ${t}`),
    ...Object.keys(ES_CUES).filter(t => !enValues.has(t)).map(t => `cue: ${t}`),
    ...Object.keys(ES_DAY_LABELS).filter(t => !enValues.has(t)).map(t => `day label: ${t}`),
    ...Object.keys(ES_PROFILE_NAMES).filter(t => !enValues.has(t)).map(t => `profile name: ${t}`)
  ];
  const bySource = {};
  for (const k of Object.keys(es)) if (k !== '_meta') bySource[prov[k] || 'unknown'] = (bySource[prov[k] || 'unknown'] || 0) + 1;
  const byNamespace = {};
  for (const k of machine) { const n = k.split('.')[0] + (k.endsWith('.cue') ? '.cue' : k.endsWith('.name') ? '.name' : ''); byNamespace[n] = (byNamespace[n] || 0) + 1; }
  return {
    en: sortKeys(en),
    es: sortKeys(es),
    // F3: the ES lines the coach should review first (RECHECK 03 / 05 minors; additive field, CONTRACTS §3.6)
    es_review: { missing_keys: missing, machine_translated: machine.filter(k => k in en && !reviewed.includes(k)).sort(), priority_review: [...new Set([...ES_PRIORITY_F3, ...ES_PRIORITY_R2F3, ...ES_PRIORITY_V2, ...ES_PRIORITY_V3, ...ES_PRIORITY_W6])].filter(k => k in es).sort() },
    provenance: prov,
    cleaned_en: cleaned.sort((a, b) => (a.key < b.key ? -1 : 1)),
    stats: { en_keys: Object.keys(en).length - 1, es_keys: Object.keys(es).length - 1, es_missing: missing.length, es_machine_translated: machine.length, es_by_source: sortKeys(bySource), machine_translated_by_namespace: sortKeys(byNamespace), unused_translation_rows: unused },
    problems
  };
}
