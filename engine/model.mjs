// engine/model.mjs - model access API (engine/CONTRACTS.md §4.2). Engine code reads the model ONLY through this object.
// First version provided by the architect (so B2 / B3 can start against the fixture at once); owner from now on: B4
// (extends assertModel and adds tests; must not change member names or semantics without a CONTRACTS change).
import { EngineError, deepFreeze } from './util.mjs';

const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;
const BUCKET_ALIASES = { ISO_HAM: 'ISO_LEG_FLEXION', 'RP.HD.ISO': 'ISO_LEG_FLEXION', CORE_OTHER: 'CORE_ANY' };

/**
 * @param {{manifest:object, catalog:object, rules:object, templates:object, profiles:object, i18n:{en:object, es:object, es_review?:object}}} raw
 * @returns {object} Model (deep-frozen)
 */
export function loadModel(raw) {
  if (!raw || !raw.catalog || !raw.rules || !raw.templates || !raw.profiles || !raw.i18n) throw new EngineError('model.bad_raw', 'missing model parts');
  deepFreeze(raw);
  const exById = new Map();
  for (const e of raw.catalog.exercises) exById.set(e.id, e);
  const aliases = raw.catalog.id_aliases || {};
  const slotIndex = new Map();
  for (const e of raw.catalog.exercises) for (const s of e.slots) {
    if (!slotIndex.has(s)) slotIndex.set(s, []);
    slotIndex.get(s).push(e);
  }
  for (const list of slotIndex.values()) list.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const sortedEx = raw.catalog.exercises.slice().sort((a, b) => (a.id < b.id ? -1 : 1));
  const R = raw.rules;
  const groupOfMuscle = {};
  for (const [g, ms] of Object.entries(R.muscles.groups.members)) for (const m of ms) groupOfMuscle[m] = g;
  const profAlias = (raw.profiles.id_aliases && raw.profiles.id_aliases.profiles) || {};
  const sportAlias = (raw.profiles.id_aliases && raw.profiles.id_aliases.sports) || {};
  const pickerById = new Map(raw.profiles.picker.sports.map(s => [s.id, s]));
  const activityById = new Map(raw.profiles.picker.activities.map(a => [a.id, a]));
  const athleticBuckets = new Set(R.credit.athletic_slot_buckets);
  const resolveBucket = (b) => BUCKET_ALIASES[b] || b;
  const resolveEx = (id) => (exById.has(id) ? id : aliases[id]);

  const model = {
    version: raw.manifest.model_version,
    manifest: raw.manifest, rules: raw.rules, templates: raw.templates, profiles: raw.profiles, i18n: raw.i18n,

    ex(id) {
      const r = resolveEx(id);
      if (!r || !exById.has(r)) throw new EngineError('model.unknown_exercise', `unknown exercise ${id}`);
      return exById.get(r);
    },
    hasEx(id) { const r = resolveEx(id); return !!r && exById.has(r); },
    exercises() { return sortedEx; },
    bySlot(bucket) { return slotIndex.get(resolveBucket(bucket)) || []; },
    isDefaultIn(exercise, bucket) { return exercise.default_in_slots.includes(resolveBucket(bucket)); },
    byMuscle(m, opts = {}) {
      const prime = opts.prime !== false;
      return sortedEx.filter(e => !e.is_athletic && (prime ? e.credits[m] === 1 : (e.credits[m] || 0) > 0));
    },
    bucket(id) {
      const b = raw.templates.buckets[resolveBucket(id)];
      if (!b) throw new EngineError('model.unknown_bucket', `unknown bucket ${id}`);
      return b;
    },

    template(family, days) {
      const f = raw.templates.families[family];
      const t = f && f.days[String(days)];
      if (!t) throw new EngineError('model.unknown_template', `unknown template ${family}.${days}`);
      return t;
    },
    /** variant merged over the base: {week_layout, day_types, variant} */
    dayTypes(template, variant) {
      if (!variant) return { week_layout: template.week_layout, day_types: template.day_types, variant: null };
      const v = template.variants[variant];
      if (!v) throw new EngineError('model.unknown_variant', `${template.id} has no variant ${variant}`);
      return { week_layout: v.week_layout || template.week_layout, day_types: { ...template.day_types, ...v.day_types }, variant };
    },
    /** D-22: unbuilt template -> first built variant, else family (days - 1) */
    templateFor(family, days, variant) {
      let t = model.template(family, days);
      if (variant && t.variants[variant]) return { template: t, variant };
      if (t.status === 'unbuilt' || !Object.keys(t.day_types).length) {
        const firstBuilt = Object.keys(t.variants).sort().find(n => Object.keys(t.variants[n].day_types).length && t.variants[n].week_layout);
        if (firstBuilt) return { template: t, variant: firstBuilt };
        for (let d = Number(days) - 1; d >= 2; d--) {
          const f = raw.templates.families[family];
          const alt = f && f.days[String(d)];
          if (alt && alt.status === 'built') return { template: alt, variant: null, fallback_days: d };
        }
        throw new EngineError('model.no_template', `no built template for ${family}.${days}`);
      }
      return { template: t, variant: null };
    },

    goal(id) {
      const g = raw.profiles.goals[id];
      if (!g) throw new EngineError('model.unknown_goal', `unknown goal ${id}`);
      return g;
    },
    sport(profileId) {
      const id = profAlias[profileId] || profileId;
      const p = raw.profiles.sports[id];
      if (!p) throw new EngineError('model.unknown_profile', `unknown profile ${profileId}`);
      return p;
    },
    hasSport(profileId) { return !!raw.profiles.sports[profAlias[profileId] || profileId]; },
    pickerSport(sportId) {
      const s = pickerById.get(sportAlias[sportId] || sportId);
      if (!s) throw new EngineError('model.unknown_sport', `unknown sport ${sportId}`);
      return s;
    },
    activity(id) {
      const a = activityById.get(id);
      if (!a) throw new EngineError('model.unknown_activity', `unknown activity ${id}`);
      return a;
    },

    muscle(id) {
      const m = R.muscles.defs[id];
      if (!m) throw new EngineError('model.unknown_muscle', `unknown muscle ${id}`);
      return m;
    },
    muscleIds(opts = {}) { return R.muscles.order.filter(m => (opts.target === undefined ? true : !!R.muscles.defs[m].target === !!opts.target)); },
    groupOf(muscle) { return groupOfMuscle[muscle] || null; },
    groupMembers(group) { return R.muscles.groups.members[group] || []; },

    stair(N) {
      const k = String(N);
      const s = R.stairway.by_N[k];
      if (!s) throw new EngineError('model.no_stairway', `no stairway table for N=${N}`);
      return { N: Number(N), ...s, phases: R.stairway.phases_by_N[k], exercise_blocks: R.stairway.exercise_blocks_by_N[k], rc_weeks: R.athletic.stages.weeks_by_N[k] };
    },

    /** @param {object} exercise @param {{tokens:Set<string>|string[], machines:string[]}} kit */
    kitAvailable(exercise, kit) {
      const tokens = kit.tokens instanceof Set ? kit.tokens : new Set(kit.tokens);
      const okSetup = exercise.equipment.any_of.some(setup => setup.every(t => tokens.has(t)));
      if (!okSetup) return false;
      if (exercise.equipment.machine) return (kit.machines || []).includes(exercise.equipment.machine);
      return true;
    },
    /** per-set credits; {} in an athletic-slot bucket (H09) */
    credits(exercise, bucket) {
      if (athleticBuckets.has(resolveBucket(bucket)) || exercise.is_athletic) return {};
      return exercise.credits;
    },

    t(lang, key, args) {
      const table = raw.i18n[lang] || raw.i18n.en;
      let s = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : (Object.prototype.hasOwnProperty.call(raw.i18n.en, key) ? raw.i18n.en[key] : key);
      if (args) s = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (m, k) => (args[k] === undefined || args[k] === null ? m : String(args[k])));
      return s;
    },
    has(lang, key) { const table = raw.i18n[lang]; return !!table && Object.prototype.hasOwnProperty.call(table, key); }
  };
  return Object.freeze(model);
}

// ---------------------------------------------------------------------------------------------------------------------
// assertModel: every §3 shape (manifest, catalog, rules, templates, profiles, i18n). Returns human-readable error strings;
// [] = the model honours the contract. Used by tools/compile-model (B1), tools/check-model (B1) and tests/model.test.mjs.
// ---------------------------------------------------------------------------------------------------------------------

// Closed vocabularies copied from CONTRACTS §1.4 / §3.2 (structure, not coaching numbers).
const EXERCISE_FIELDS = ['id', 'source_id', 'name_key', 'cue_key', 'kind', 'family', 'pattern', 'node', 'slots', 'default_in_slots',
  'laterality', 'plane', 'level', 'zone', 'rotation_bias', 'size_class', 'exercise_class', 'counting', 'credit_class', 'credits',
  'primary_muscle', 'equipment', 'constraint', 'axial_class', 'axial', 'spine_class', 'axial_pattern', 'skill', 'impact', 'load_ceiling',
  'is_athletic', 'athletic', 'conditioning', 'medball', 'older_ok', 'older_opt_in_ok', 'youth_ok', 'tags', 'variation_axes', 'rep_hint',
  'video', 'status', 'sport_use', 'rule_refs'];
const ENUMS = {
  kind: ['exercise', 'drill', 'test', 'conditioning'],
  laterality: ['bilateral', 'unilateral', 'alternating', 'n/a'],
  plane: ['sagittal', 'frontal', 'transverse', 'multi', 'n/a'],
  level: ['foundational', 'intermediate', 'advanced'],
  axial_class: ['high', 'moderate', 'low', 'none'],
  spine_class: ['counted', 'second_day', 'not_counted'],
  axial_pattern: ['squat', 'hinge', null],
  rotation_bias: ['external', 'internal', null]
};
const CLOSED_TAGS = new Set(['overhead_squat', 'snatch', 'low_bar', 'depth_jump', 'high_depth_drop', 'hurdle_hop', 'bound', 'ankle_hop', 'landing',
  'overhead', 'overhead_barbell', 'dips', 'upright_row', 'skullcrusher', 'good_morning', 'bent_over', 'chest_supported', 'sumo', 'cossack',
  'deep_knee_flexion', 'front_rack', 'push_up_floor', 'belt_squat', 'kong_row', 'push_press', 'push_jerk', 'thruster', 'pullover', 'face_pull',
  'kb_swing', 'wall_ball', 'glute_iso', 'spine_counted', 'fixed_grip', 'split_grip', 'machine', 'cable', 'barbell', 'medball', 'olympic',
  'loaded_jump', 'olympic_from_floor', 'plyo_repeated', 'high_impact', 'axial_high', 'older_preferred', 'aesthetics_warmup_only',
  'pitcher_reduce', 'striker_reduce', 'beginner_olympic', 'youth_floor_ok', 'axial_unload', 'pain_friendly', 'assisted', 'home_substitute',
  'carry_sled', 'mid_range_push', 'mid_range_pull']); // + v0.5 / V2 (R4-LIB-02, R4-LIB-03)
const CREDIT_CLASSES = ['BKD', 'UKD', 'BHD', 'UHD', 'GLUTE_ISO', 'LEG_FLEXION', 'LEG_EXTENSION', 'HPUSH', 'VPUSH', 'DIPS', 'THRUSTER', 'HPULL',
  'VPULL', 'PULLOVER', 'ISO_CHEST', 'ISO_SIDE', 'ISO_REAR', 'FACEPULL', 'ISO_FRONT', 'ISO_BICEPS', 'ISO_TRICEPS', 'ISO_CALF', 'ISO_NECK', 'CORE',
  'ATHLETIC', 'NONE'];
const RULE_SECTIONS = ['locked', 'muscles', 'credit', 'levels', 'volume', 'stairway', 'placement', 'session', 'time_model',
  'bilateral_share', 'contra_ipsi', 'frontal_transverse', 'pairing', 'axial', 'reps', 'effort', 'rest', 'athletic', 'olympic', 'medball',
  'conditioning', 'equipment', 'population', 'prehab', 'selection', 'ordering', 'supersets', 'plan_types', 'recovery', 'cycles', 'tests',
  'warmup', 'core_block', 'template_select', 'validation'];
const MUST_BAN = ['band', 'bands', 'band_anchor', 'chains', 'weight_releaser'];
const GOALS = ['muscle', 'strength', 'athletic', 'active', 'fat_loss', 'general', 'hybrid'];
const FAMILIES = ['aesthetics', 'athletic', 'strength', 'fat_loss_bootcamp', 'hybrid_crossfit', 'no_equipment'];
const BUCKET_KINDS = ['warmup', 'core', 'skill', 'athletic', 'power', 'resistance', 'isolation', 'focus', 'aerobic', 'conditioning',
  'functional', 'prehab', 'test'];
const BLOCK_KINDS = ['warmup', 'core', 'skill', 'athletic', 'power', 'strength', 'accessories', 'prehab', 'circuit', 'conditioning', 'aerobic', 'cooldown'];
const WEEKDAY_IDS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LIFESTYLE_IN_RULES = ['"sleep', '"stress', 'hard_job', 'stress_high', 'sleep_lt6'];
const PROPOSED_STATUSES = ['proposed_v1', 'proposed_v1_1'];
// v0.5 / V2 (COACH-R4 R4-LIB-01): records the template never picks - optional add-ons and the records still proposed (neck work)
const NEVER_DEFAULT_STATUSES = [...PROPOSED_STATUSES, 'optional_addon'];
// v0.5 / V2 (COACH-R4 R4-LIB-05): the only video kinds - a YouTube search built from the name, or the coach's own video
const VIDEO_KINDS = ['search', 'coach'];
const PLACEHOLDER_RE = /\{([a-zA-Z0-9_]+)\}/g;

const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o);
const isSortedStrings = (a) => a.every((x, i) => i === 0 || a[i - 1] < x);
const placeholders = (s) => [...String(s).matchAll(PLACEHOLDER_RE)].map(m => m[1]).sort().join(',');

/** @param {object} raw @returns {string[]} contract errors (empty = OK): every §3 shape, band regex, credits == class map, KB swing rules, i18n coverage */
export function assertModel(raw) {
  const errors = [];
  const err = (m) => { if (errors.length < 500) errors.push(m); };
  for (const k of ['manifest', 'catalog', 'rules', 'templates', 'profiles', 'i18n']) if (!raw || !raw[k]) err(`missing ${k}`);
  if (errors.length) return errors;
  const { manifest, catalog, rules, templates, profiles, i18n } = raw;
  if (!isObj(i18n.en) || !isObj(i18n.es)) { err('i18n.en / i18n.es missing'); return errors; }
  const en = i18n.en, es = i18n.es;
  const hasEn = (k) => Object.prototype.hasOwnProperty.call(en, k);

  // §3.1 manifest
  if (manifest.schema !== 'manifest/2') err('manifest.schema != manifest/2');
  if (typeof manifest.model_version !== 'string' || !manifest.model_version) err('manifest.model_version missing');
  if (!Array.isArray(manifest.languages) || !manifest.languages.includes('en') || !manifest.languages.includes('es')) err('manifest.languages must hold en and es');
  if (manifest.default_lang !== 'en') err('manifest.default_lang != en');
  if (!isObj(manifest.files)) err('manifest.files missing');

  // §3.3 rules
  if (rules.schema !== 'rules/2') err('rules.schema != rules/2');
  for (const s of RULE_SECTIONS) if (!(s in rules)) err(`rules.${s} missing`);
  if (errors.length) return errors;
  const classes = rules.credit.classes || {};
  for (const c of CREDIT_CLASSES) if (!isObj(classes[c])) err(`rules.credit.classes.${c} missing`);
  const banned = rules.equipment.banned_tokens || [];
  for (const t of MUST_BAN) if (!banned.includes(t)) err(`rules.equipment.banned_tokens lacks ${t}`);
  const checkIds = (rules.validation.checks || []).map(c => c.id).join(',');
  const nChecks = Math.max(26, (rules.validation.checks || []).length);
  const wantChecks = Array.from({ length: nChecks }, (_, i) => 'V' + (i + 1)).join(',');
  if (checkIds !== wantChecks) err('rules.validation.checks must be V1..Vn (n >= 26) in order');
  const hardIds = (rules.validation.hard || []).map(c => c.id).join(',');
  const wantHard = Array.from({ length: 22 }, (_, i) => 'H' + String(i + 1).padStart(2, '0')).join(',');
  if (hardIds !== wantHard) err('rules.validation.hard must be H01..H22 in order');
  for (const c of [...(rules.validation.checks || []), ...(rules.validation.hard || [])]) if (!hasEn(c.key)) err(`missing EN ${c.key}`);
  for (const c of rules.validation.checks || []) if (!['error', 'warn'].includes(c.severity)) err(`bad severity on ${c.id}`);
  for (const l of rules.locked || []) if (!hasEn(l.key)) err(`missing EN ${l.key}`);
  const mOrder = rules.muscles.order || [];
  for (const m of mOrder) if (!isObj(rules.muscles.defs[m])) err(`rules.muscles.defs.${m} missing`);
  for (const g of rules.muscles.groups.order || []) if (!Array.isArray(rules.muscles.groups.members[g])) err(`rules.muscles.groups.members.${g} missing`);
  for (let N = 2; N <= 16; N++) {
    const s = rules.stairway.by_N[String(N)];
    if (!s) { err(`rules.stairway.by_N.${N} missing`); continue; }
    const steps = Object.keys(s.standard_steps || {}).map(Number).sort((a, b) => a - b);
    if (steps.join(',') !== Array.from({ length: N - 1 }, (_, i) => i + 2).join(',')) err(`stairway.by_N.${N}.standard_steps must cover weeks 2..${N}`);
    const early = steps.filter(w => w <= s.halfway).map(w => s.standard_steps[w]);
    const late = steps.filter(w => w > s.halfway).map(w => s.standard_steps[w]);
    if (early.length && late.length && Math.max(...early) > Math.min(...late)) err(`stairway.by_N.${N}: early step > late step`);
    for (let w = 1; w <= N; w++) {
      if (typeof s.display_level[w] !== 'number') err(`stairway.by_N.${N}.display_level.${w} missing`);
      if (!(s.planned_effort[w] in rules.effort.planned_map)) err(`stairway.by_N.${N}.planned_effort.${w} not in effort.planned_map`);
    }
    for (let w = 2; w <= N; w++) if (!(s.display_level[w] > s.display_level[w - 1])) err(`stairway.by_N.${N}.display_level not strictly rising at ${w}`);
    if (!rules.stairway.phases_by_N[String(N)]) err(`stairway.phases_by_N.${N} missing`);
    if (!rules.stairway.exercise_blocks_by_N[String(N)]) err(`stairway.exercise_blocks_by_N.${N} missing`);
  }
  // v0.5 (COACH-CX CX-01, COACH-R4 R4-PRG-01 / 02, COACH-CT CT-01): no rate limit and no session-minutes rule exists; the planned
  // final sets are reached, at most one week early; sessions are sized by exercise count
  const PG = rules.stairway.progression;
  if (!PG || PG.target_reached !== true) err('stairway.progression.target_reached must be true (CX-01)');
  else {
    if (!(PG.arrival_weeks_early_max <= 1)) err('stairway.progression.arrival_weeks_early_max > 1 (R4-PRG-01)');
    if (!(PG.arrival_weeks_early <= PG.arrival_weeks_early_max)) err('stairway.progression.arrival_weeks_early above its maximum');
    if (!(PG.note_above > 0 && PG.note_above < 1)) err('stairway.progression.note_above must be a fraction (R4-PRG-02)');
  }
  if (!rules.session.size || !rules.session.size.by_type) err('session.size missing (R4-SES-02)');
  else for (const [k, z] of Object.entries(rules.session.size.by_type)) {
    if (!(Array.isArray(z.range) && z.range[0] <= z.default && z.default <= z.range[1])) err(`session.size.by_type.${k}: default outside its range`);
  }
  for (const k of ['exercise_cap_by_minutes', 'minutes_allowed', 'minutes_default', 'long_day', 'time_fit']) if (rules.session[k] !== undefined) err(`session.${k} is a time-fitting rule (retired, CT-01)`);
  if (rules.time_model && rules.time_model.use !== 'estimate_only') err('time_model.use must be estimate_only (CT-01)');
  if (!rules.volume.two_day || !(rules.volume.floor.applies_from_days >= 3)) err('volume.two_day / volume.floor.applies_from_days missing (R4-SES-03)');
  if (!(rules.medball.max_lb <= 20)) err('medball.max_lb > 20');
  const rulesStr = JSON.stringify(rules);
  for (const w of LIFESTYLE_IN_RULES) if (rulesStr.includes(w)) err(`lifestyle input in rules: ${w}`);

  // §3.4 templates
  if (templates.schema !== 'templates/2') err('templates.schema != templates/2');
  const buckets = templates.buckets || {};
  for (const [b, d] of Object.entries(buckets)) {
    if (!BUCKET_KINDS.includes(d.kind)) err(`bucket ${b}: bad kind ${d.kind}`);
    if (!BLOCK_KINDS.includes(d.block)) err(`bucket ${b}: bad block ${d.block}`);
    if (!hasEn('slot.' + b)) err(`missing EN slot.${b}`);
  }
  for (const g of GOALS) if (!FAMILIES.includes((templates.goal_to_family || {})[g])) err(`templates.goal_to_family.${g} missing / unknown`);
  let tCount = 0;
  for (const [fam, F] of Object.entries(templates.families || {})) {
    if (!FAMILIES.includes(fam)) err(`unknown template family ${fam}`);
    for (let d = 2; d <= 6; d++) if (!F.days || !F.days[String(d)]) err(`template ${fam}.${d} missing`);
    for (const [d, t] of Object.entries(F.days || {})) {
      tCount++;
      if (t.id !== `${fam}.${d}`) err(`template id ${t.id} != ${fam}.${d}`);
      if (!['built', 'unbuilt'].includes(t.status)) err(`${t.id}: bad status ${t.status}`);
      const wl = t.week_layout || {};
      if (Object.keys(wl).join(',') !== WEEKDAY_IDS.join(',')) err(`${t.id}: week_layout must list Mon..Sun`);
      const variants = Object.entries(t.variants || {});
      for (const [vn, dts] of [['main', t.day_types || {}], ...variants.map(([n, v]) => [n, v.day_types || {}])]) {
        for (const [k, dt] of Object.entries(dts)) {
          if (!hasEn(dt.label_key)) err(`missing EN ${dt.label_key}`);
          const seen = new Set();
          for (const st of dt.stations || []) {
            if (seen.has(st.id)) err(`${t.id}/${vn}/${k}: duplicate station ${st.id}`);
            seen.add(st.id);
            if (!buckets[st.bucket]) err(`${t.id}/${vn}/${k}: unknown bucket ${st.bucket}`);
            // §3.4 lists axial | non_axial | light_or_non_axial | null; the fixture also carries free-text values
            // ('light_technique', 'n/a (bodyweight)') - the fixture wins on shape, so only 'axial' is load-bearing here.
            if (st.axial !== null && st.axial !== undefined && typeof st.axial !== 'string') err(`${t.id}/${vn}/${k}/${st.id}: bad axial ${st.axial}`);
          }
        }
      }
      if (t.status === 'built') for (const [wd, v] of Object.entries(wl)) if (['main', 'optional'].includes(v.kind) && v.day_type && !(v.day_type in (t.day_types || {}))) err(`${t.id}: ${wd} -> ${v.day_type} not in day_types`);
    }
  }
  if (manifest.counts && manifest.counts.templates !== undefined && manifest.counts.templates !== tCount) err(`manifest.counts.templates ${manifest.counts.templates} != ${tCount}`);
  for (const p of templates.program_names || []) if (!hasEn(`program.${p.id}.name`)) err(`missing EN program.${p.id}.name`);

  // §3.2 catalog
  if (catalog.schema !== 'catalog/2') err('catalog.schema != catalog/2');
  if (catalog.model_version !== manifest.model_version) err('catalog.model_version != manifest.model_version');
  const exs = catalog.exercises || [];
  const ids = new Set();
  let prev = null;
  for (const e of exs) {
    const where = `exercise ${e && e.id}`;
    for (const f of EXERCISE_FIELDS) if (!(f in e)) err(`${where}: field ${f} missing`);
    if (prev !== null && !(prev < e.id)) err(`catalog not sorted by id at ${e.id}`);
    prev = e.id;
    if (ids.has(e.id)) err(`duplicate exercise ${e.id}`);
    ids.add(e.id);
    for (const [f, vals] of Object.entries(ENUMS)) if (f in e && !vals.includes(e[f])) err(`${where}: bad ${f} ${e[f]}`);
    if (BAND_RE.test(e.id)) err(`band word in id ${e.id}`);
    if (!hasEn(e.name_key)) err(`missing EN ${e.name_key}`);
    else if (BAND_RE.test(en[e.name_key])) err(`band word in name ${e.id}`);
    if (e.cue_key !== null && !hasEn(e.cue_key)) err(`missing EN ${e.cue_key}`);
    if (!Array.isArray(e.slots) || !isSortedStrings(e.slots)) err(`${where}: slots must be a sorted array`);
    else for (const s of e.slots) if (!buckets[s] && !BUCKET_ALIASES[s]) err(`${where}: unknown slot ${s}`);
    if (!Array.isArray(e.default_in_slots) || e.default_in_slots.some(s => !e.slots.includes(s))) err(`${where}: default_in_slots not a subset of slots`);
    if (NEVER_DEFAULT_STATUSES.includes(e.status) && e.default_in_slots.length) err(`${where}: proposed record may not be a default pick`);
    // v0.5 / V2 (R4-LIB-01): the 31 proposed records are optional add-ons; only neck work is still proposed
    if (rules.selection.addons && PROPOSED_STATUSES.includes(e.status) && !(e.pattern === 'NECK' || e.credit_class === 'ISO_NECK')) err(`${where}: still 'proposed' - only neck work stays proposed (R4-LIB-01)`);
    // v0.5 / V2 (R4-LIB-02): carries and sled work credit no muscle and are never dosed in reps
    if (rules.conditioning.carry && ((e.tags || []).includes(rules.conditioning.carry.tag) || (rules.conditioning.carry.patterns || []).includes(e.pattern))) {
      if (e.credit_class !== 'NONE' || Object.keys(e.credits || {}).length) err(`${where}: a carry / sled record credits muscle sets (R4-LIB-02)`);
      if (!e.rep_hint || !['distance_or_time', 'seconds'].includes(e.rep_hint.unit)) err(`${where}: a carry / sled record must be dosed by distance or time (R4-LIB-02)`);
    }
    // v0.5 / V2 (R4-LIB-05): no third-party video link - a search link built from the English name (or the coach's own video)
    if (rules.render && rules.render.video) {
      const V = rules.render.video;
      if (!e.video || !VIDEO_KINDS.includes(e.video.kind)) err(`${where}: video must be a search link or the coach's own video (R4-LIB-05)`);
      else if (e.video.kind === 'search' && hasEn(e.name_key) && e.video.url !== V.search_url + encodeURIComponent(en[e.name_key])) err(`${where}: video search link is not built from the exercise name (R4-LIB-05)`);
    }
    if (!classes[e.credit_class]) err(`unknown credit class ${e.credit_class} (${e.id})`);
    else if (canonical(classes[e.credit_class]) !== canonical(e.credits)) err(`credits != class map (${e.id})`);
    if (e.is_athletic !== (e.credit_class === 'ATHLETIC')) err(`${where}: is_athletic must equal credit_class == ATHLETIC`);
    const tags = e.tags || [];
    for (const t of tags) if (!CLOSED_TAGS.has(t)) err(`${where}: tag ${t} not in the closed list`);
    if (!isSortedStrings(tags)) err(`${where}: tags not sorted`);
    if (tags.includes('v_squat') || /\bv[- ]?squat\b/i.test(e.id)) err(`V-squat present: ${e.id}`);
    for (const t of rules.credit.never_credit_tags || []) if (tags.includes(t) && Object.keys(e.credits || {}).length) err(`${t} credits muscles: ${e.id}`);
    if (tags.includes('kb_swing') && e.slots.some(s => s.startsWith('RP_'))) err(`KB swing in a resistance slot: ${e.id}`);
    if (e.credit_class === 'THRUSTER' && (e.credits.quads !== 1 || e.credits.front_delts !== 0.5 || e.credits.glutes !== 0.25)) err(`thruster credits != 1 / 0.5 / 0.25: ${e.id}`);
    if (e.credit_class === 'DIPS' && (e.credits.triceps !== 0.5 || e.credits.chest !== 0.5)) err(`dips credits != 0.5 / 0.5: ${e.id}`);
    if (!isObj(e.equipment) || !Array.isArray(e.equipment.any_of) || !e.equipment.any_of.every(Array.isArray)) err(`${where}: equipment.any_of must be an array of arrays`);
    else for (const t of e.equipment.any_of.flat()) if (banned.includes(t) || BAND_RE.test(t)) err(`banned token ${t} (${e.id})`);
    if (e.equipment && e.equipment.machine !== null && !(e.equipment.machine in (rules.equipment.machines || {}))) err(`${where}: unknown machine ${e.equipment.machine}`);
    if (e.medball && !(e.medball.max_lb <= rules.medball.max_lb)) err(`medball > 20 lb (${e.id})`);
    if (tags.some(t => (rules.population.older.never_tags || []).includes(t)) && (e.older_ok || e.older_opt_in_ok)) err(`older never-list leak: ${e.id}`);
    if (tags.some(t => (rules.population.older.never_tags_phase0_even_with_opt_in || []).includes(t)) && (e.older_ok || e.older_opt_in_ok)) err(`older phase-0 never-list leak: ${e.id}`);
    if (e.axial && !['squat', 'hinge'].includes(e.axial_pattern)) err(`${where}: counted spine lift without squat / hinge pattern`);
    if (e.axial && tags.some(t => (rules.axial.not_counted_tags || []).includes(t))) err(`${where}: ${tags.join('/')} may never be a counted spine lift`);
  }
  if (manifest.counts && manifest.counts.exercises !== undefined && manifest.counts.exercises !== exs.length) err(`manifest.counts.exercises ${manifest.counts.exercises} != ${exs.length}`);
  for (const [src, tgt] of Object.entries(catalog.id_aliases || {})) {
    if (!ids.has(tgt)) err(`id_aliases ${src} -> ${tgt}: target missing`);
    if (BAND_RE.test(tgt)) err(`id_aliases target with band word: ${tgt}`);
  }
  for (const s of Object.values(rules.equipment.machines || {})) if (banned.includes(s)) err(`machine maps to banned token ${s}`);

  // §3.5 profiles
  if (profiles.schema !== 'profiles/2') err('profiles.schema != profiles/2');
  for (const g of GOALS) if (!isObj((profiles.goals || {})[g])) err(`profiles.goals.${g} missing`);
  const sports = profiles.sports || {};
  const pAlias = (profiles.id_aliases && profiles.id_aliases.profiles) || {};
  const hasProfile = (id) => !!sports[pAlias[id] || id];
  const confLabels = (rules.render && rules.render.profile_confidence && rules.render.profile_confidence.labels) || null;
  for (const [id, p] of Object.entries(sports)) {
    if (p.id !== id) err(`profile ${id}: id mismatch`);
    if (!hasEn(p.name_key)) err(`missing EN ${p.name_key}`);
    // v0.5 / V2 (COACH-R4 R4-SCP-03): every sport profile carries its confidence label (data and docs, never on a plan)
    if (confLabels && !confLabels.includes(p.confidence)) err(`profile ${id}: confidence '${p.confidence}' is not one of ${confLabels.join(' / ')} (R4-SCP-03)`);
  }
  if (manifest.counts && manifest.counts.profiles !== undefined && manifest.counts.profiles !== Object.keys(sports).length) err(`manifest.counts.profiles != ${Object.keys(sports).length}`);
  const picker = profiles.picker || { sports: [], activities: [] };
  for (const s of picker.sports || []) {
    if (!hasEn(s.name_key)) err(`missing EN ${s.name_key}`);
    for (const pos of s.positions || []) for (const pid of [pos.profile, ...Object.values(pos.profile_by_choice || {})].filter(Boolean)) if (!hasProfile(pid)) err(`picker ${s.id}/${pos.value}: profile ${pid} missing`);
  }
  for (const a of picker.activities || []) {
    if (!hasEn(a.name_key)) err(`missing EN ${a.name_key}`);
    if (a.profile && !hasProfile(a.profile)) err(`activity ${a.id}: profile ${a.profile} missing`);
  }
  if (manifest.counts && manifest.counts.sports_in_picker !== undefined && manifest.counts.sports_in_picker !== (picker.sports || []).length) err('manifest.counts.sports_in_picker mismatch');
  if (manifest.counts && manifest.counts.activities !== undefined && manifest.counts.activities !== (picker.activities || []).length) err('manifest.counts.activities mismatch');
  for (const [g, pid] of Object.entries(profiles.goal_defaults || {})) if (!hasProfile(pid)) err(`goal_defaults.${g}: profile ${pid} missing`);

  // §3.6 i18n + H13 (no sex / gender key anywhere in the model)
  const review = i18n.es_review || {};
  if (!Array.isArray(review.missing_keys) || !Array.isArray(review.machine_translated)) err('i18n.es_review must hold missing_keys[] and machine_translated[]');
  const missing = new Set(review.missing_keys || []);
  for (const k of Object.keys(en)) {
    if (k === '_meta') continue;
    if (!Object.prototype.hasOwnProperty.call(es, k) && !missing.has(k)) err(`ES missing and not in es_review: ${k}`);
    else if (Object.prototype.hasOwnProperty.call(es, k) && placeholders(es[k]) !== placeholders(en[k])) err(`ES placeholders differ from EN: ${k}`);
  }
  for (const k of Object.keys(es)) if (k !== '_meta' && !hasEn(k)) err(`ES key without EN: ${k}`);
  for (const [k, v] of Object.entries(en)) if (k !== '_meta' && typeof v !== 'string') err(`EN value not a string: ${k}`);
  // v1.2 (review 04 / 05 minors, H14): no unresolved [PLACEHOLDER] token reaches a client (e.g. '[VIDEO_CONTACT]')
  // (the legal release texts carry their own [LEGAL REVIEW] / [RELEASE_VERSION] markers until counsel signs them off - D-35)
  for (const [lang, dict] of [['EN', en], ['ES', es]]) for (const [k, v] of Object.entries(dict)) if (k !== '_meta' && !/^release\./.test(k) && typeof v === 'string' && /\[[A-Z][A-Z0-9_]{2,}\]/.test(v)) err(`unresolved placeholder in ${lang} ${k}`);
  if (/"(sex|gender)"\s*:/i.test(JSON.stringify({ manifest, catalog, rules, templates, profiles }))) err('sex/gender key present');

  // v0.5 / V3 (design/ENGINE_V05_PLAN.md "V3 words and checks"): the liability gate, the printed lines and the check list
  const hasEs = (k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(es, k);
  const both = (k, what) => { if (!hasEn(k) || !hasEs(k)) err(`${what}: ${k} needs English and Spanish words`); };
  const LG = rules.legal || {};
  if (LG.gate) {
    // COACH-R4 R4-SCP-02 'they need to click it before the plan shows': the gate cannot be switched off in data
    if (LG.gate.required !== true) err('rules.legal.gate.required must be true (R4-SCP-02: no plan without the accepted release)');
    const RL = LG.release_line || null;
    if (!RL) err('rules.legal.release_line is missing (R4-SCP-01 / R4-SCP-02: a release line on every plan)');
    else {
      for (const k of [RL.label_key, RL.link_key, RL.short_key, RL.footer_key, RL.no_plan_key, ...Object.values(RL.by_version || {})]) both(k, 'release line');
      for (const v of ['release.client', 'release.coach', 'release.minor']) if (!(RL.by_version || {})[v]) err(`rules.legal.release_line.by_version.${v} is missing`);
      for (const lang of RL.langs || []) if (!(LG.disclaimer_url && /^https?:\/\//.test(String(LG.disclaimer_url[lang])))) err(`rules.legal.disclaimer_url.${lang} is missing (the release line links the full text)`);
      for (const lang of ['en', 'es']) if (!(RL.langs || []).includes(lang)) err(`rules.legal.release_line.langs must hold ${lang}`);
    }
  }
  // engine 0.7 (COACH-R5 R5-GEN-02): the health warning that replaced the stop is printable in English and Spanish, and the gate stays first
  if (LG.health_flag) {
    const HF = LG.health_flag;
    if (!['warn', 'refer'].includes(HF.on_flag)) err('rules.legal.health_flag.on_flag must be warn or refer');
    if (HF.on_flag === 'warn') {
      for (const k of [HF.warning_key, HF.label_key, HF.line_key, HF.reasons_key, HF.short_key, HF.stamp_key].filter(Boolean)) both(k, 'health warning');
      if (HF.gate_unchanged !== true || !(LG.gate && LG.gate.required === true)) err('rules.legal.health_flag: the release gate must stay required and first (R4-SCP-02, H20)');
    }
  }
  const RN = rules.render || {};
  if (RN.progression) {
    // R4-PRG-03: the rule is worded for every kind engine/progression can give, per side too; never a promised number
    if (RN.progression.promised_numbers !== false) err('rules.render.progression.promised_numbers must be false (R4-PRG-03)');
    for (const k of Object.values(RN.progression.keys || {})) both(k, 'progression rule');
    for (const kind of ['double_progression', 'load_when_all_sets_done']) both(((RN.progression.keys || {})[kind] || '?') + (RN.progression.per_side_suffix || '_side'), 'progression rule (per side)');
  }
  if (RN.estimate && RN.estimate.information_only !== true) err('rules.render.estimate.information_only must be true (CT-01, R4-SES-01)');
  if (RN.easy_to_remove) {
    for (const kind of ((rules.session && rules.session.easy_to_remove && rules.session.easy_to_remove.order) || [])) both((RN.easy_to_remove.kind_keys || {})[kind], `easy-to-remove kind ${kind}`);
    if (rules.session && rules.session.easy_to_remove && rules.session.easy_to_remove.automatic !== false) err('rules.session.easy_to_remove.automatic must be false (R4-SES-04: nothing is removed for the person)');
  }
  if (rules.validation && rules.validation.v05) {
    const ids = new Set([...(rules.validation.checks || []).map(c => c.id), ...(rules.validation.hard || []).map(c => c.id)]);
    for (const [rule, list] of Object.entries(rules.validation.v05.by_rule || {})) for (const id of list) if (!ids.has(id)) err(`rules.validation.v05.by_rule.${rule}: unknown check ${id}`);
    for (const c of [...(rules.validation.checks || []), ...(rules.validation.hard || [])]) both(c.key, `check ${c.id}`);
    // no check or rule is about minutes any more (CT-01): the time model is an estimate only
    if (rules.time_model && rules.time_model.use !== 'estimate_only') err('rules.time_model.use must be estimate_only (CT-01)');
  }
  return errors;
}

function canonical(o) {
  if (o === null || typeof o !== 'object') return JSON.stringify(o);
  if (Array.isArray(o)) return '[' + o.map(canonical).join(',') + ']';
  return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canonical(o[k])).join(',') + '}';
}
