// tests/compile.test.mjs - B1: the model compiler (tools/compile-model.mjs) and the compiled model (model/).
// CONTRACTS §8: assertModel(model) == [], band regex, rules deep-equals the fixture rules, every catalog credits == class map,
// KB swings never in RP slots, every i18n key used has EN + ES-or-review, check-fixture passes on the compiled model.
// Plus: determinism (two compiles byte-identical; model/ on disk is the current compile), coach-correction patches,
// round-2 hard rules visible in the data, the sport / activity picker (all popular US sports, swimming, pickleball, HYROX),
// and Spanish quality gates (placeholders, gym term in brackets, review flags).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileModel } from '../tools/compile-model.mjs';
import { checkModel, readFixture, readModelDir, fixtureChecks, rulesKeys, BAND_RE } from '../tools/check-model.mjs';
import { assertModel, loadModel } from '../engine/model.mjs';

const BASE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODEL_DIR = path.join(BASE, 'model');
const fixture = readFixture();
const first = compileModel();
const raw = first.raw;
const exs = raw.catalog.exercises;
const byId = new Map(exs.map(e => [e.id, e]));
const { en, es, es_review } = raw.i18n;
const PH = (s) => [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(m => m[1]).sort().join(',');

test('compile has no errors and every coach-patch target exists', () => {
  assert.deepEqual(first.errors, []);
  const ids = first.report.coach_patches.map(p => p.id);
  for (let i = 1; i <= 16; i++) assert.ok(ids.includes('P' + String(i).padStart(2, '0')), `patch P${i} ran`);
});

test('assertModel passes (no error the reference fixture does not also raise)', () => {
  const errs = assertModel(structuredClone(raw));
  const fx = fixture ? assertModel(structuredClone(fixture)) : [];
  assert.deepEqual(errs.filter(e => !fx.includes(e)), []);
  if (!fx.length) assert.deepEqual(errs, []);
});

test('check-model: contract schema, i18n coverage, shapes and check-fixture all pass', () => {
  const { errors } = checkModel(raw, { fixture });
  assert.deepEqual(errors, []);
});

test('the architect check-fixture checks pass on the compiled model', () => {
  assert.deepEqual(fixtureChecks(structuredClone(raw)).errors, []);
});

test('loadModel works on the compiled model', () => {
  const m = loadModel(structuredClone(raw));
  assert.equal(m.version, '1.2.0'); // v1.2 review amendments (tools/fixture/review-v12.mjs)
  assert.equal(m.ex('kb-face-pull-as-written-face-pulls-are-normally-cable-band').id, 'kb-face-pull');
  assert.ok(m.bySlot('ISO_HAM').length > 0, 'retired ISO_HAM alias resolves to leg flexion');
  assert.equal(m.t('es', 'weekday.Mon'), 'Lunes');
  assert.match(m.t('es', 'exercise.barbell-hip-thrust.name'), /\(Hip Thrust\)/);
});

test('rules.json deep-equals the fixture rules', { skip: !fixture && 'fixture absent' }, () => {
  assert.deepEqual(raw.rules, fixture.rules);
});

test('templates and profiles equal the reference build (same output as the fixture builder)', { skip: !fixture && 'fixture absent' }, () => {
  assert.deepEqual(raw.templates, fixture.templates);
  assert.deepEqual(raw.profiles, fixture.profiles);
});

test('counts: 731 kept / 208 dropped, 30 templates, 127 profiles, 52 picker sports, 26 activities', () => {
  const c = first.report.counts;
  assert.equal(c.kept, 731); assert.equal(c.dropped, 208); assert.equal(c.kept + c.dropped, c.source_records);
  assert.equal(c.templates_total, 30); assert.equal(c.stations, 1823); // v1.2: chest stations on bootcamp Mon / Fri, review 05
  assert.equal(c.profiles, 127); assert.equal(c.sports_in_picker, 52); assert.equal(c.activities, 26);
  assert.deepEqual(raw.manifest.counts, { exercises: 731, templates: 30, profiles: 127, sports_in_picker: 52, activities: 26 });
  for (const d of first.report.dropped) assert.ok(d.reason && d.rule, `drop ${d.source_id} has a reason and a rule`);
});

test('determinism: two compiles are byte-identical and carry no timestamps', () => {
  const second = compileModel();
  assert.equal(JSON.stringify(second.raw), JSON.stringify(raw));
  assert.equal(JSON.stringify(second.report), JSON.stringify(first.report));
  assert.equal(second.changelog, first.changelog);
  assert.doesNotMatch(JSON.stringify(raw.manifest) + first.changelog, /20\d\d-\d\d-\d\dT\d\d:/);
});

test('model/ on disk is the current compile of the sources', { skip: !fs.existsSync(path.join(MODEL_DIR, 'manifest.json')) && 'model/ not compiled yet' }, () => {
  const disk = readModelDir(MODEL_DIR);
  assert.equal(JSON.stringify(disk), JSON.stringify(raw), 'model/ is stale: run node tools/compile-model.mjs');
  assert.equal(fs.readFileSync(path.join(MODEL_DIR, 'MODEL_VERSION'), 'utf8'), raw.manifest.model_version + '\n');
  assert.equal(fs.readFileSync(path.join(MODEL_DIR, 'CHANGELOG.md'), 'utf8'), first.changelog);
});

test('H01: no band, chain or weight releaser in any id, alias, name, cue, kit token or rules swap', () => {
  for (const e of exs) {
    assert.doesNotMatch(e.id, BAND_RE);
    assert.doesNotMatch(en[e.name_key], BAND_RE);
    if (e.cue_key) assert.doesNotMatch(en[e.cue_key], BAND_RE);
    for (const t of e.equipment.any_of.flat()) assert.ok(!raw.rules.equipment.banned_tokens.includes(t), `${e.id} token ${t}`);
    assert.doesNotMatch(es[e.name_key], /\b(liga|ligas|banda|bandas|cadena|cadenas)\b/i);
  }
  for (const r of Object.values(raw.catalog.id_aliases)) assert.doesNotMatch(r, BAND_RE);
  for (const id of [...raw.rules.medball.no_ball_substitutes, ...Object.values(raw.rules.equipment.machine_isolation_swaps).flat()]) assert.doesNotMatch(id, BAND_RE);
});

test('H08: credits equal the class map; helpers 0.25, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25', () => {
  const C = raw.rules.credit.classes;
  for (const e of exs) assert.deepEqual(e.credits, C[e.credit_class], e.id);
  assert.deepEqual(C.DIPS, { triceps: 0.5, chest: 0.5 });
  assert.deepEqual(C.THRUSTER, { quads: 1, front_delts: 0.5, glutes: 0.25 });
  for (const [cls, map] of Object.entries(C)) if (!['DIPS', 'THRUSTER'].includes(cls)) for (const v of Object.values(map)) assert.ok(v === 1 || v === 0.25, `${cls} ${v}`);
  for (const id of ['barbell-thruster', 'db-thruster-front-squat-into-overhead-press']) assert.equal(byId.get(id).credit_class, 'THRUSTER');
  assert.equal(byId.get('parallel-bar-dip').credit_class, 'DIPS');
  assert.equal(byId.get('parallel-bar-dip').primary_muscle, null);
  assert.equal(byId.get('barbell-upright-row').credit_class, 'ISO_SIDE');
});

test('H09 / R2-VOL-05: KB swings are ballistic (credit {}), never in a resistance slot; athletic records credit nothing', () => {
  const swings = exs.filter(e => e.tags.includes('kb_swing'));
  assert.ok(swings.length >= 3);
  for (const e of swings) {
    assert.deepEqual(e.credits, {});
    assert.ok(!e.slots.some(s => s.startsWith('RP_')), e.id);
    assert.ok(e.slots.includes('AP_TRIPLE_EXT'), e.id);
  }
  for (const e of exs) if (e.is_athletic) assert.deepEqual(e.credits, {}, e.id);
});

test('CAT-09 / R2-LIB-04: leg curls are leg flexion; face pulls are shoulder work, never the vertical pull', () => {
  for (const e of exs.filter(x => x.pattern === 'KFLEX')) { assert.equal(e.credit_class, 'LEG_FLEXION'); assert.ok(e.slots.includes('ISO_LEG_FLEXION')); }
  for (const e of exs.filter(x => x.tags.includes('face_pull'))) { assert.equal(e.credit_class, 'FACEPULL'); assert.ok(!e.slots.includes('RP_VPULL')); }
});

test('H07 / R2-SES-02: 28 counted heavy spine lifts (v1.2: staggered / kickstand / alternating barbell deadlifts count, review 06), all squats or hinges', () => {
  const counted = exs.filter(e => e.axial);
  assert.equal(counted.length, 28);
  for (const e of counted) { assert.ok(['squat', 'hinge'].includes(e.axial_pattern)); assert.equal(e.spine_class, 'counted'); assert.ok(e.rule_refs.includes('R2-SES-02')); }
  for (const id of ['leg-press-machine', 'belt-squat-machine', 'barbell-hip-thrust']) assert.equal(byId.get(id).axial, false, id);
});

test('H11 / H12: medball <= 20 lb; 60+ never overhead squat / low bar / depth jumps / snatch; no Olympic or plyo by default', () => {
  for (const e of exs) {
    if (e.medball) assert.ok(e.medball.max_lb <= 20, e.id);
    if (e.tags.some(t => ['overhead_squat', 'low_bar', 'depth_jump', 'high_depth_drop', 'snatch'].includes(t))) { assert.equal(e.older_ok, false, e.id); assert.equal(e.older_opt_in_ok, false, e.id); }
    if (e.athletic && ['plyometric', 'olympic'].includes(e.athletic.quality)) assert.equal(e.older_ok, false, e.id);
  }
});

test('H13 / H16: no sex, gender or lifestyle key anywhere in the model', () => {
  const keys = new Set();
  const walk = (o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { keys.add(k.toLowerCase()); walk(v); } };
  walk({ manifest: raw.manifest, catalog: raw.catalog, rules: raw.rules, templates: raw.templates, profiles: raw.profiles });
  for (const k of ['sex', 'gender', 'sleep', 'stress', 'job', 'hard_job_or_other_sport', 'life', 'energy']) assert.ok(!keys.has(k), k);
});

test('R2-LIB-07 additions are library defaults at foundational; PROPOSED records are swaps only', () => {
  for (const id of ['belt-squat-machine', 'seated-machine-shoulder-press', 'hang-clean-of-1rm-catch-not-stated', 'single-arm-db-snatch', 'kb-squat-clean', 'hex-bar-jump-squat', 'kb-curl', 'table-row-inverted-row-under-a-sturdy-table', 'floor-prone-y-t-raises']) {
    const e = byId.get(id);
    assert.ok(e, id); assert.equal(e.level, 'foundational', id); assert.ok(e.default_in_slots.length > 0, id); assert.ok(e.rule_refs.includes('R2-LIB-07'), id);
    assert.notEqual(e.status, 'program_only', id);
  }
  for (const e of exs) if (['proposed_v1', 'proposed_v1_1'].includes(e.status)) assert.deepEqual(e.default_in_slots, [], e.id);
});

test('renames the coach approved are the EN names (LIB-01, LIB-07, LIB-09, LIB-11, R2-LIB-05) and decoder notes are gone', () => {
  assert.equal(en['exercise.snatch-squat-snatch.name'], 'Squat Snatch');
  assert.equal(en['exercise.clean-squat-clean.name'], 'Squat Clean');
  assert.equal(en['exercise.cable-lat-pullover.name'], 'Lat Pull-over (cable)');
  assert.match(en['exercise.kong-row-unclear-possibly-kroc-row.name'], /double-KB row from the floor/);
  assert.match(en['exercise.single-leg-get-up-single-leg-sit-to-stand-from-bench-box.name'], /box pistol/);
  assert.equal(en['exercise.back-squat-bar-position-not-stated.name'], 'Back Squat');
  for (const e of exs) assert.doesNotMatch(en[e.name_key], /\b(not stated|inferred|unconfirmed|typo|ambiguous)\b/i, e.id);
  for (const [k, v] of Object.entries(en)) if (/^(day|profile)\./.test(k) || /\.cue$/.test(k)) assert.doesNotMatch(v, /INFERRED|COACH-R2|BYOP cell|\(corrected\)|bodyweight pools/, k);
});

test('i18n: every key used has EN and ES; nothing missing; ES placeholders match EN; review flags are consistent', () => {
  assert.deepEqual(es_review.missing_keys, []);
  const used = new Set(rulesKeys(raw.rules));
  for (const e of exs) { used.add(e.name_key); if (e.cue_key) used.add(e.cue_key); }
  for (const F of Object.values(raw.templates.families)) for (const t of Object.values(F.days)) for (const d of [t.day_types, ...Object.values(t.variants).map(v => v.day_types)]) for (const dt of Object.values(d)) { used.add(dt.label_key); for (const st of dt.stations) used.add(`slot.${st.bucket}`); }
  for (const p of Object.values(raw.profiles.sports)) used.add(p.name_key);
  for (const s of raw.profiles.picker.sports) { used.add(s.name_key); for (const p of s.positions) used.add(p.name_key); }
  for (const a of raw.profiles.picker.activities) used.add(a.name_key);
  for (const k of used) { assert.ok(k in en, `EN ${k}`); assert.ok(k in es || es_review.missing_keys.includes(k), `ES ${k}`); }
  for (const k of Object.keys(en)) if (k !== '_meta') assert.ok(k in es, `ES ${k}`);
  for (const k of es_review.machine_translated) { assert.ok(k in es, k); assert.equal(PH(es[k]), PH(en[k]), `placeholders ${k}`); }
  assert.equal(es_review.machine_translated.length, 861); // v1.2: review-v12 UI strings carry coach-reviewed ES (5 fewer machine-translated)
  if (fixture) for (const k of Object.keys(fixture.i18n.en)) assert.ok(k in en, `fixture EN key ${k} kept`);
});

test('Spanish: architect and spec lines kept verbatim; [LEGAL REVIEW] copy untouched', { skip: !fixture && 'fixture absent' }, () => {
  for (const [k, v] of Object.entries(fixture.i18n.es)) if (k !== '_meta') assert.equal(es[k], v, k);
  const legal = Object.entries(fixture.i18n.es).filter(([, v]) => /LEGAL REVIEW/.test(String(v)));
  for (const [k, v] of legal) assert.equal(es[k], v, k);
});

test('Spanish exercise names: neutral LatAm with the English gym term in brackets (R2-GEN-08)', () => {
  const names = exs.map(e => es[e.name_key]);
  const bracketed = names.filter(s => /\([A-Z][^)]*\)/.test(s)).length;
  assert.ok(bracketed / names.length > 0.85, `only ${bracketed} / ${names.length} names carry the gym term in brackets`);
  const untranslated = exs.filter(e => es[e.name_key] === en[e.name_key]).map(e => e.id);
  assert.ok(untranslated.length <= 3, `ES name equals EN for ${untranslated.join(', ')}`);
  for (const s of names) assert.doesNotMatch(s, /\b(the|with|and|single-leg|lunge|squat)\b(?![^()]*\))/i, s); // no English left outside the brackets
});

test('every popular US sport, swimming and the stay-active door (pickleball, HYROX) are in the picker, in EN and ES', () => {
  const sports = new Set(raw.profiles.picker.sports.map(s => s.id));
  for (const id of ['american_football', 'flag_football', 'basketball', 'baseball', 'softball', 'soccer', 'ice_hockey', 'volleyball', 'lacrosse', 'wrestling', 'track_and_field', 'distance_running', 'tennis', 'golf', 'swimming', 'pickleball', 'hyrox', 'crossfit', 'cheerleading', 'gymnastics']) {
    assert.ok(sports.has(id), id);
    assert.ok(es[`sport.${id}.name`], `ES sport.${id}.name`);
  }
  const acts = new Set(raw.profiles.picker.activities.map(a => a.id));
  for (const id of ['rec_pickleball', 'hyrox_fitness', 'crossfit_class', 'rec_tennis', 'run_fitness', 'lap_swim', 'weekend_warrior']) { assert.ok(acts.has(id), id); assert.ok(es[`activity.${id}.name`], id); }
  for (const id of ['swimming_middle', 'football_big_skill', 'soccer', 'crossfit_class', 'general_population', 'bodybuilding_aesthetics', 'rec_pickleball']) { assert.ok(raw.profiles.sports[id], id); assert.ok(es[`profile.${id}.name`], id); }
});

test('the 8 sample intakes only touch keys that exist in both languages', () => {
  const dir = path.join(BASE, 'samples', 'intakes');
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
    const i = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const keys = [`goal.${i.goal}`, `weekday.Mon`];
    if (i.sport && i.sport.sport) { keys.push(`sport.${i.sport.sport}.name`); if (i.sport.position) keys.push(`sport.${i.sport.sport}.position.${i.sport.position}`); }
    for (const a of (i.activity && i.activity.ids) || []) keys.push(`activity.${a}.name`);
    for (const k of keys) { assert.ok(k in en, `${f}: EN ${k}`); assert.ok(k in es, `${f}: ES ${k}`); }
  }
});

test('cross-checks against the sources: only the known N=16 RIR boundary differs', () => {
  const bad = first.report.crosschecks.filter(c => c.status === 'mismatch' || c.status === 'source_missing');
  assert.deepEqual(bad.map(c => c.id), ['X04']);
  assert.match(bad[0].detail, /^N=16 planned_effort w12 2 vs 1-2 RIR$/);
});

test('check-model catches broken models (mutation tests of the schema check)', () => {
  const mutate = (fn) => { const m = structuredClone(raw); fn(m); return checkModel(m, { fixture }).errors.join('\n'); };
  assert.match(mutate(m => { m.i18n.en['exercise.barbell-hip-thrust.name'] = 'Banded Hip Thrust'; }), /band word/);
  assert.match(mutate(m => { delete m.i18n.es['exercise.barbell-hip-thrust.name']; }), /ES missing and not in es_review/);
  assert.match(mutate(m => { m.catalog.exercises.find(e => e.id === 'barbell-hip-thrust').credits = { glutes: 1 }; }), /credits != class map/);
  assert.match(mutate(m => { m.catalog.exercises.find(e => e.id === 'kettlebell-swing-russian').slots.push('RP_BHD'); }), /KB swing/);
  assert.match(mutate(m => { m.catalog.exercises.find(e => e.id === 'barbell-hip-thrust').tags.push('banana'); }), /closed list/);
  assert.match(mutate(m => { m.rules.medball.max_lb = 25; }), /rules != fixture rules/);
  assert.match(mutate(m => { m.manifest.counts.exercises = 700; }), /manifest.counts.exercises/);
  assert.match(mutate(m => { m.catalog.exercises.reverse(); }), /not sorted/);
  assert.match(mutate(m => { m.i18n.es_review.machine_translated.push('zzz.not.a.key'); }), /machine_translated lists untranslated/);
});
