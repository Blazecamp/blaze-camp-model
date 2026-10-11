// tools/fixture/templates-profiles.mjs - templates.json (templates/2) + profiles.json (profiles/2) normalisation, v1.1
// (engine/CONTRACTS.md §3.4, §3.5). Reads 05_templates.json v1.1 and 04_profiles.json v1.1 (127 profiles, sports picker,
// activities, goal defaults, age overlays, aliases). B1 may copy this file into tools/compile-model.mjs.

export const BUCKETS = {
  WARMUP_GENERAL: { kind: 'warmup', block: 'warmup', rep_class: null, time_class: 'warmup_session', catalog: false },
  WARMUP_PREP: { kind: 'warmup', block: 'warmup', rep_class: null, time_class: null, catalog: true },
  CT_CORE_THORAX: { kind: 'core', block: 'core', rep_class: 'core', time_class: 'core_set', core_segment: 'thorax' },
  CP_CORE_PELVIS: { kind: 'core', block: 'core', rep_class: 'core', time_class: 'core_set', core_segment: 'pelvis' },
  CORE_ANY: { kind: 'core', block: 'core', rep_class: 'core', time_class: 'core_set', core_segment: 'any' },
  CORE_OTHER: { kind: 'core', block: 'core', rep_class: 'core', time_class: 'core_set', core_segment: 'any', pool_as: 'CORE_ANY' },
  SKILL: { kind: 'skill', block: 'skill', rep_class: 'skill', time_class: 'skill_block' },
  AP_SPRINT: { kind: 'athletic', block: 'athletic', rep_class: 'sprint', time_class: 'sprint', athletic_unit: 'metres' },
  AP_PLYO: { kind: 'athletic', block: 'athletic', rep_class: 'plyo', time_class: 'plyo_or_ballistic', athletic_unit: 'contacts' },
  AP_JUMP_LIMITED_KNEE: { kind: 'athletic', block: 'athletic', rep_class: 'plyo', time_class: 'plyo_or_ballistic', athletic_unit: 'contacts' },
  AP_THROW: { kind: 'athletic', block: 'athletic', rep_class: 'throw', time_class: 'throw', athletic_unit: 'throws' },
  AP_COD: { kind: 'athletic', block: 'athletic', rep_class: 'cod', time_class: 'cod', athletic_unit: 'cuts' },
  AP_TRIPLE_EXT: { kind: 'power', block: 'power', rep_class: 'olympic', time_class: 'olympic', athletic_unit: 'reps' },
  RP_BKD: { kind: 'resistance', block: 'strength', pattern: 'BKD', region: 'lower', dominance: 'knee', laterality: 'bilateral', axial_pattern: 'squat', rep_class: 'main_bilateral_compound', time_class: 'compound_bilateral', group: 'quads' },
  RP_UKD: { kind: 'resistance', block: 'strength', pattern: 'UKD', region: 'lower', dominance: 'knee', laterality: 'unilateral', axial_pattern: 'squat', rep_class: 'unilateral_compound', time_class: 'compound_unilateral', group: 'quads' },
  RP_BHD: { kind: 'resistance', block: 'strength', pattern: 'BHD', region: 'lower', dominance: 'hip', laterality: 'bilateral', axial_pattern: 'hinge', rep_class: 'main_bilateral_compound', time_class: 'compound_bilateral', group: 'hips' },
  RP_UHD: { kind: 'resistance', block: 'strength', pattern: 'UHD', region: 'lower', dominance: 'hip', laterality: 'unilateral', axial_pattern: 'hinge', rep_class: 'unilateral_compound', time_class: 'compound_unilateral', group: 'hips' },
  RP_HPUSH: { kind: 'resistance', block: 'strength', pattern: 'HPUSH', region: 'upper', vector: 'horizontal', direction: 'push', laterality: 'either', rep_class: 'main_bilateral_compound', time_class: 'compound_bilateral', group: 'chest' },
  RP_VPUSH: { kind: 'resistance', block: 'strength', pattern: 'VPUSH', region: 'upper', vector: 'vertical', direction: 'push', laterality: 'either', rep_class: 'main_bilateral_compound', time_class: 'compound_bilateral', group: 'shoulders' },
  RP_HPULL: { kind: 'resistance', block: 'strength', pattern: 'HPULL', region: 'upper', vector: 'horizontal', direction: 'pull', laterality: 'either', rep_class: 'main_bilateral_compound', time_class: 'compound_bilateral', group: 'back' },
  RP_VPULL: { kind: 'resistance', block: 'strength', pattern: 'VPULL', region: 'upper', vector: 'vertical', direction: 'pull', laterality: 'either', rep_class: 'main_bilateral_compound', time_class: 'compound_bilateral', group: 'back' },
  ISO_QUAD: { kind: 'isolation', block: 'accessories', muscle: 'quads', rep_class: 'big_muscle_isolation', time_class: 'isolation', machine_swap: true, group: 'quads' },
  ISO_LEG_FLEXION: { kind: 'isolation', block: 'accessories', muscle: 'hamstrings', rep_class: 'big_muscle_isolation', time_class: 'isolation', machine_swap: true, alias_of: ['ISO_HAM', 'RP.HD.ISO'], group: 'hips' },
  ISO_CHEST: { kind: 'isolation', block: 'accessories', muscle: 'chest', rep_class: 'big_muscle_isolation', time_class: 'isolation', group: 'chest' },
  ISO_SIDE_REAR_DELT: { kind: 'isolation', block: 'accessories', muscle_by_variant: { side: 'side_delts', rear: 'rear_delts', front: 'front_delts' }, rep_class: 'small_muscle_isolation', rep_class_by_variant: { rear: 'rear_delts' }, time_class: 'isolation', group: 'shoulders' },
  ISO_BICEP: { kind: 'isolation', block: 'accessories', muscle: 'biceps', rep_class: 'small_muscle_isolation', time_class: 'isolation', group: 'biceps' },
  ISO_TRICEP: { kind: 'isolation', block: 'accessories', muscle: 'triceps', rep_class: 'small_muscle_isolation', time_class: 'isolation', group: 'triceps' },
  ISO_CALF: { kind: 'isolation', block: 'accessories', muscle: 'calves', rep_class: 'calves', time_class: 'isolation', group: 'calves' },
  FOCUS: { kind: 'focus', block: 'accessories', rep_class: 'by_exercise', time_class: 'isolation' },
  COND_AEROBIC: { kind: 'aerobic', block: 'aerobic', rep_class: null, time_class: null },
  COND_SPRINT_BUYOUT: { kind: 'conditioning', block: 'conditioning', rep_class: 'sprint', time_class: 'sprint' },
  COND_CIRCUIT: { kind: 'conditioning', block: 'circuit', rep_class: null, time_class: null },
  COND_WOD: { kind: 'conditioning', block: 'conditioning', rep_class: 'wod', time_class: null },
  FUNCTIONAL: { kind: 'functional', block: 'accessories', rep_class: null, time_class: 'isolation' },
  RECOVERY_ARM_CARE: { kind: 'prehab', block: 'prehab', rep_class: 'prehab', time_class: 'prehab' },
  PREHAB_LOWER: { kind: 'prehab', block: 'prehab', rep_class: 'prehab', time_class: 'prehab' },
  PREHAB_NECK: { kind: 'prehab', block: 'prehab', rep_class: 'prehab', time_class: 'prehab' },
  COMPLEX: { kind: 'power', block: 'power', rep_class: null, time_class: 'olympic', phase0: false },
  TEST: { kind: 'test', block: 'strength', rep_class: null, time_class: null }
};

const ROLE_TO_BLOCK = { warmup: 'warmup', core_block: 'core', skill: 'skill', athletic: 'athletic', power: 'power', work: 'strength', paired_upper: 'strength', secondary: 'strength', secondary_upper: 'strength', accessory: 'strength', nuance: 'accessories', survival: 'accessories', iso: 'accessories', focus: 'accessories', conditioning: 'conditioning', aerobic_block: 'aerobic', circuit_station: 'circuit', prehab: 'prehab' };
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function parseSets(h) {
  if (h === undefined || h === null) return null;
  if (typeof h === 'number') return [h, h];
  const m = String(h).match(/^(\d+)\s*-\s*(\d+)$/); if (m) return [Number(m[1]), Number(m[2])];
  const n = String(h).match(/^(\d+)$/); if (n) return [Number(n[1]), Number(n[1])];
  const r = String(h).match(/^(\d+)\s*-\s*(\d+)\s+bouts/); if (r) return [Number(r[1]), Number(r[2])];
  const q = String(h).match(/^(\d+) rounds/); if (q) return [Number(q[1]), Number(q[1])];
  return null;
}

function parseVariant(bucket, v) {
  if (!v) return null;
  const s = String(v).toLowerCase();
  if (bucket === 'AP_TRIPLE_EXT') { if (/clean/.test(s)) return 'clean'; if (/snatch/.test(s)) return 'snatch'; if (/swing/.test(s)) return 'swing'; if (/jerk/.test(s)) return 'jerk'; return null; }
  if (bucket === 'ISO_SIDE_REAR_DELT') { if (/^rear/.test(s)) return 'rear'; if (/^side/.test(s)) return 'side'; if (/^front/.test(s)) return 'front'; return null; }
  if (bucket === 'AP_PLYO' && /upper/.test(s)) return 'upper';
  return null;
}

const GROUP_ALIAS = { glutes: 'hips', hamstrings: 'hips', delts: 'shoulders' };
// CONTRACTS §3.4 station axial enum: axial | non_axial | light_or_non_axial | null. 05 v1.1 also writes 'light_technique'
// (strength DE lower days) and 'n/a (bodyweight)' (no-equipment days): mapped here (integration fix, B1 request).
function normAxial(a) {
  if (a === 'axial' || a === 'non_axial' || a === 'light_or_non_axial') return a;
  if (a === 'light_technique') return 'light_or_non_axial';
  return null;
}
function normStation(st, dayType, idx) {
  const bucket = st.bucket === 'ISO_HAM' ? 'ISO_LEG_FLEXION' : st.bucket;
  if (!BUCKETS[bucket]) throw new Error('unknown bucket ' + bucket);
  const sh = parseSets(st.sets_hint);
  let variant = parseVariant(bucket, st.variant);
  if (!variant && bucket === 'ISO_SIDE_REAR_DELT') variant = /face pull|rear/i.test(String(st.note || '')) ? 'rear' : 'side';
  const grp = st.group ? (GROUP_ALIAS[st.group] || st.group) : (BUCKETS[bucket].group || null);
  return {
    id: `${dayType}.s${String(idx + 1).padStart(2, '0')}`,
    bucket,
    role: st.role,
    block: ROLE_TO_BLOCK[st.role] || BUCKETS[bucket].block,
    group: ['warmup', 'core_block', 'athletic', 'power', 'skill', 'conditioning', 'aerobic_block', 'focus'].includes(st.role) && !st.group ? null : grp,
    sets_hint: sh,
    sets_text: sh ? null : (st.sets_hint !== undefined ? String(st.sets_hint) : null),
    dose_text: st.dose || null,
    pair: st.pair || null,
    superset: st.superset || null,
    superset_below_minutes: st.superset_below_minutes || null,
    circuit: typeof st.circuit === 'number' ? st.circuit : null,
    include_from_minutes: st.include_from_minutes || null,
    axial: normAxial(st.axial),
    variant,
    variant_text: st.variant ? String(st.variant) : null,
    laterality_dial: !!st.laterality_dial,
    loading: st.loading || null,
    movable: !!st.movable,
    counts_as_volume: st.counts_as_volume === false ? false : !['warmup'].includes(st.role),
    condition: st.condition ? (/calves/i.test(st.condition) && /priority/i.test(st.condition) ? 'if_priority:calves' : (/priority/i.test(st.condition) ? 'if_priority:any' : 'text')) : null,
    condition_text: st.condition || null,
    older_default_excluded: /excluded/i.test(String(st.older_default || '')),
    older_default_text: st.older_default || null,
    group_label: st.group_label || null,
    pool_filter: st.pool_filter || null,
    rir: st.rir || null,
    note: st.note || null
  };
}

function normLayoutValue(v) {
  const s = String(v);
  if (/^OFF$|^sport\/OFF$|^sport$/.test(s)) return { day_type: null, kind: 'off', optional: false, note: s === 'OFF' ? null : 'sport_or_off' };
  if (/^aerobic|^run$/.test(s)) return { day_type: 'aerobic', kind: 'aerobic', optional: /or add-on|or OPT|WOD only/.test(s), note: null };
  if (/^OPT \(optional/.test(s)) return { day_type: 'OPT', kind: 'optional', optional: true, note: /or aerobic/.test(s) ? 'or_aerobic' : null };
  if (s === 'OPT') return { day_type: 'OPT', kind: 'optional', optional: false, note: null };
  if (s === 'WOD') return { day_type: 'WOD', kind: 'optional', optional: true, note: 'wod_only_class' };
  return { day_type: s, kind: 'main', optional: false, note: null };
}

function lowerFocus(stations) {
  const st = stations.find(x => ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'].includes(x.bucket) && ['work', 'circuit_station', 'secondary'].includes(x.role));
  if (!st) return null;
  return BUCKETS[st.bucket].dominance;
}
function dayTypeObj(id, name, k, dt, kindHint) {
  const stations = (dt.stations || []).map((st, i) => normStation(st, k, i));
  const groups = [...new Set(stations.filter(s => s.group && ['resistance', 'isolation'].includes(BUCKETS[s.bucket].kind)).map(s => s.group))];
  const hasLower = stations.some(s => BUCKETS[s.bucket].region === 'lower' || ['ISO_QUAD', 'ISO_LEG_FLEXION', 'ISO_CALF'].includes(s.bucket));
  const hasUpper = stations.some(s => BUCKETS[s.bucket].region === 'upper' || ['ISO_CHEST', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP'].includes(s.bucket));
  return {
    label: dt.label || k,
    label_key: name ? `day.${id}.${name}.${k}` : `day.${id}.${k}`,
    kind: kindHint || (k === 'OPT' ? 'optional' : k === 'aerobic' || k === 'run' ? 'aerobic' : 'main'),
    format: dt.format === 'timed circuit' ? 'circuit' : 'straight',
    dose_text: dt.dose || null,
    lower_focus: lowerFocus(stations),
    full_body: hasLower && hasUpper,
    groups,
    axial: { squat: stations.some(s => s.axial === 'axial' && ['RP_BKD', 'RP_UKD'].includes(s.bucket)), hinge: stations.some(s => s.axial === 'axial' && ['RP_BHD', 'RP_UHD'].includes(s.bucket)) },
    stations
  };
}

export function normTemplate(family, days, t) {
  const id = `${family}.${days}`;
  const week_layout = {};
  for (const wd of WEEKDAYS) week_layout[wd] = normLayoutValue((t.week_layout || {})[wd] || 'OFF');
  const day_types = {};
  const built = !!(t.day_types && typeof t.day_types === 'object');
  if (built) for (const [k, dt] of Object.entries(t.day_types)) {
    if (!dt || typeof dt !== 'object' || !Array.isArray(dt.stations)) continue;
    day_types[k] = dayTypeObj(id, null, k, dt);
  }
  const variants = {};
  const addVariant = (name, v) => {
    if (!v || typeof v !== 'object' || !v.day_types) return;
    const vt = { week_layout: null, day_types: {}, evidence: v.evidence || null, use_when: v.use_when || null };
    if (v.week_layout) { vt.week_layout = {}; for (const wd of WEEKDAYS) vt.week_layout[wd] = normLayoutValue(v.week_layout[wd] || 'OFF'); }
    for (const [k, dt] of Object.entries(v.day_types || {})) {
      if (!dt || typeof dt !== 'object' || !dt.stations) continue;
      vt.day_types[k] = dayTypeObj(id, name, k, dt, k === 'OPT' || k === 'WOD' ? 'optional' : 'main');
    }
    variants[name] = vt;
  };
  if (t.alternative && typeof t.alternative === 'object') for (const [n, v] of Object.entries(t.alternative)) addVariant(n, v);
  if (t.same_pattern_variant) addVariant('same_pattern', t.same_pattern_variant);
  if (t.in_season_variant) addVariant('in_season', t.in_season_variant);
  if (t.baseball_parts_variant) addVariant('baseball_parts', t.baseball_parts_variant);
  const aer = t.aerobic_ATH07 || {};
  return {
    id, family, days: Number(days),
    status: built && Object.keys(day_types).length ? 'built' : 'unbuilt',
    format_note: t.format_note || null,
    week_layout, day_types, variants,
    aerobic: { in_layout: typeof aer.in_layout === 'number' ? aer.in_layout : null },
    evidence: t.evidence || null
  };
}

export const PROGRAM_NAMES = [
  { when: { variant: ['ppl_x2'] }, id: 'OT03' },
  { when: { variant: ['upper_lower'] }, id: 'OT08' },
  { when: { variant: ['crossfit_style_bootcamp'] }, id: 'OTCFB' },
  { when: { family: ['aesthetics'], days: [3] }, id: 'OT02' },
  { when: { family: ['aesthetics'] }, id: 'OT01' },
  { when: { family: ['athletic'], profile_family: ['combat'], competitive: ['competitive'] }, id: 'OT14' },
  { when: { family: ['athletic'], variant: ['baseball_parts'] }, id: 'OT16' },
  { when: { family: ['athletic'], competitive: ['competitive'] }, id: 'OT11' },
  { when: { family: ['athletic'], goal: ['active'] }, id: 'OTACT' },
  { when: { family: ['athletic'] }, id: 'OT04b' },
  { when: { family: ['fat_loss_bootcamp'], format: ['bootcamp'], days: [3, 6] }, id: 'OT06' },
  { when: { family: ['fat_loss_bootcamp'], format: ['bootcamp'] }, id: 'OT05' },
  { when: { family: ['fat_loss_bootcamp'], goal: ['general'] }, id: 'OTGEN' },
  { when: { family: ['fat_loss_bootcamp'] }, id: 'OT10' },
  { when: { family: ['strength'] }, id: 'OT19' },
  { when: { family: ['hybrid_crossfit'] }, id: 'OT23' },
  { when: { family: ['no_equipment'] }, id: 'OTNOEQ' }
];
export const PROGRAM_NAME_STRINGS = {
  OT01: ['Muscle & Physique - Full Body A/B', 'Músculo y físico - Cuerpo completo A/B'],
  OT02: ['Muscle & Physique - Full Body 3 Days', 'Músculo y físico - Cuerpo completo 3 días'],
  OT03: ['Push / Pull / Legs', 'Empuje / Jalón / Piernas'],
  OT04b: ['Athletic Performance - Non-Competitive', 'Rendimiento atlético - No competitivo'],
  OT05: ['Bootcamp - Full Body A/B', 'Bootcamp - Cuerpo completo A/B'],
  OT06: ['Bootcamp - 3-Session Rotation', 'Bootcamp - Rotación de 3 sesiones'],
  OT08: ['Upper / Lower Split', 'Tren superior / Tren inferior'],
  OT10: ['Fat Loss & Toning (lifting + circuits)', 'Pérdida de grasa y tonificación (pesas + circuitos)'],
  OT11: ['Athletic Off-Season', 'Atlético fuera de temporada'],
  OT14: ['Combat Sports Build-Up', 'Deportes de combate - Preparación'],
  OT16: ['Baseball Year (Off / Pre / In-Season)', 'Béisbol - Temporada completa'],
  OT19: ['Strength', 'Fuerza'],
  OT23: ['Hybrid Strength + Athletic + Conditioning', 'Híbrido fuerza + atletismo + acondicionamiento'],
  OTACT: ['Stay Athletic & Active', 'Mantente atlético y activo'],
  OTCFB: ['CrossFit-Style Bootcamp', 'Bootcamp estilo CrossFit'],
  OTGEN: ['General Fitness - Full Body A/B', 'Condición general - Cuerpo completo A/B'],
  OTNOEQ: ['No-Equipment Full Body', 'Cuerpo completo sin equipo']
};

// ---------------------------------------------------------------- profiles
const pctPair = (a) => (Array.isArray(a) ? Math.round(a[0]) / 100 : null);
function contraIpsi(s) {
  const t = String(s || '').toLowerCase().trim();
  if (t.startsWith('contralateral') || t.startsWith('into / out of the hip')) return 'contralateral';
  if (t.startsWith('ipsilateral')) return 'ipsilateral';
  if (t.startsWith('both')) return 'both';
  return 'health_accessory';
}
const SEASON_TYPE = { field_court: 'A', combat: 'D', strength: 'G', physique: 'G', endurance: 'F', crossfit: 'F', youth: 'A', general: 'I', aquatic: 'C', snow: 'H' };
const TEMPLATE_HINTS = {
  crossfit_class: { family: 'hybrid_crossfit', variant: 'crossfit_style_bootcamp' },
  crossfit_competitor: { family: 'hybrid_crossfit', variant: null },
  hybrid: { family: 'hybrid_crossfit', variant: 'crossfit_style_bootcamp' },
  baseball_position: { family: 'athletic', variant: 'baseball_parts' }, baseball_pitcher: { family: 'athletic', variant: 'baseball_parts' }, baseball_catcher: { family: 'athletic', variant: 'baseball_parts' }, baseball_infield: { family: 'athletic', variant: 'baseball_parts' }, baseball_outfield: { family: 'athletic', variant: 'baseball_parts' },
  softball: { family: 'athletic', variant: 'baseball_parts' }, softball_pitcher: { family: 'athletic', variant: 'baseball_parts' }
};
const LEAD_FOR_GOALS = { crossfit_class: ['active', 'hybrid'], hyrox_fitness: ['active', 'hybrid'] };
const SWIM_RATIO = [{ muscle: 'lats_upper_back', plus: ['rear_delts'], over: ['chest'], min: 1.5, applies_to: ['start', 'cap'] }];
const VOLUME_RATIOS = { // 04 injury_prehab SHOULDER_SWIMMER: 'pull sets at least 1.5 x push sets every dryland week' (INFERRED: pull = back + rear delts, push = chest)
  swimming_sprint: SWIM_RATIO, swimming_middle: SWIM_RATIO, swimming_distance: SWIM_RATIO,
  water_polo_field: SWIM_RATIO, water_polo_center: SWIM_RATIO, water_polo_goalkeeper: SWIM_RATIO, lap_swim: SWIM_RATIO
};
const SPEED_ATHLETE_GROUPS = ['speed_power'];
// 04 v1.1 swimming sample week / dryland realism: 'single-arm DB snatch by default for swimmers' (INFERRED); distance avoids the barbell snatch
const OLYMPIC_PREFER = { swimming_sprint: ['single-arm-db-snatch', 'hang-power-clean-from-the-high-hang-hip-crease'], swimming_middle: ['single-arm-db-snatch', 'hang-power-clean-from-the-high-hang-hip-crease'], swimming_distance: ['single-arm-db-snatch', 'kb-squat-clean', 'hex-bar-jump-squat'] };
const ATHLETIC_CATS = ['PLYO', 'JLK', 'BALL', 'THROW', 'COD', 'SPRINT', 'TE'];

export function normSport(p, classEnd) {
  const gc = p.ground_contact && p.ground_contact.class;
  const bu = p.bilateral_unilateral || {};
  const aer = p.aerobic_sessions_wk || {};
  const ws = p.weekly_sets || {};
  const isg = p.in_season_gym || {};
  const pre = (p.season_overrides && p.season_overrides.pre_season) || null;
  const end = gc ? classEnd[String(gc)] : null;
  const share = Array.isArray(bu.block_start) ? {
    lower: { by_exercise_block: [pctPair(bu.block_start), Array.isArray(bu.baseline_mid_block) ? pctPair(bu.baseline_mid_block) : null, pctPair(bu.block_end)].filter(x => x !== null), PRE: pctPair(bu.pre_season), IN: pctPair(bu.in_season) },
    upper: { same_logic: true }
  } : null;
  const injuries = (p.injuries || []).slice();
  for (const ip of (p.injury_prehab || [])) if (ip && ip.code && !injuries.includes(ip.code)) injuries.push(ip.code);
  for (let i = injuries.length - 1; i >= 0; i--) if (injuries[i] === 'NO_BANDS') injuries.splice(i, 1); // a rule, not an injury code (EQ-01 is global)
  const tier = (o) => (o && o.tier) || null;
  return {
    id: p.id,
    name_key: `profile.${p.id}.name`,
    category: p.category,
    sport: p.sport || null,
    family: p.family,
    group: p.group || null,
    ath03_group: p.ath03_group || null,
    season_type: p.category === 'competitive' ? (SEASON_TYPE[p.family] || 'I') : 'I',
    ground_contact_class: gc || null,
    plyo_share: end !== null && end !== undefined ? { start: Math.max(0, Math.round((end - 0.15) * 100) / 100), end } : null,
    share,
    contra_ipsi: contraIpsi(p.contra_ipsi),
    frontal_transverse_share: typeof p.frontal_transverse_unilateral_pct === 'number' ? p.frontal_transverse_unilateral_pct / 100 : null,
    aerobic: {
      off: typeof aer.off_season_or_default === 'number' ? aer.off_season_or_default : null,
      off_range: Array.isArray(aer.off_season_range) ? aer.off_season_range : null,
      pre: typeof aer.pre_season === 'number' ? aer.pre_season : null,
      in: typeof aer.in_season === 'number' ? aer.in_season : null,
      walks: !!aer.walks_after_workouts,
      sport_is_aerobic: aer.off_season_or_default === 0,
      activity_counts: !!aer.activity_counts_as_aerobic
    },
    athletic_sets_wk: Object.fromEntries(ATHLETIC_CATS.filter(c => typeof ws[c] === 'number').map(c => [c, ws[c]])),
    athletic_weekly: {
      plyo_contacts: (p.plyo && p.plyo.plyometric_target_wk) || null,
      jump_contacts: (p.plyo && p.plyo.high_contacts_wk) || null,
      low_contacts: (p.plyo && p.plyo.low_contacts_wk) || null,
      throws: (p.throwing && p.throwing.throws_wk) || null,
      cod_cuts: (p.cod && p.cod.cuts_wk) || null,
      sprint_m: (p.sprint && p.sprint.m_wk) || null,
      olympic_sets: (p.triple_ext && p.triple_ext.sets_wk) || null
    },
    tiers: { plyo: tier(p.plyo) || (p.plyo && p.plyo.tier_high) || null, throws: tier(p.throwing), cod: tier(p.cod), sprint: tier(p.sprint), olympic: tier(p.triple_ext) },
    medball: { tier: (p.medball_policy && p.medball_policy.tier) || null, throws_wk: (p.medball_policy && p.medball_policy.throws_wk) || null, main_workout: !/none in the main workout/i.test(String((p.medball_policy && (p.medball_policy.types || p.medball_policy.level)) || '')) },
    olympic: {
      prefer_ids: OLYMPIC_PREFER[p.id] || [],
      exposures_wk: (p.olympic_policy && (p.olympic_policy.off_season_exposures_wk ?? p.olympic_policy.default_exposures_wk)) ?? null,
      weekly_sets: (p.olympic_policy && p.olympic_policy.weekly_sets) ?? null,
      none_by_default: /no Olympic lifts by default|not in athletic training/i.test(String((p.olympic_policy && p.olympic_policy.rule) || ''))
    },
    cod_sport: !!(p.cod && ['T3', 'T4', 'T5'].includes(p.cod.tier)),
    speed_athlete: SPEED_ATHLETE_GROUPS.includes(p.ath03_group),
    rotational_core: ['rotational_power', 'combat'].includes(p.ath03_group),
    in_season: { lift_days: isg.lift_days_wk ?? 2, game_heavy: !!isg.game_heavy, hard_day_gap_h: 48 },
    pre_season: pre ? Object.fromEntries(Object.entries(pre).filter(([k, v]) => typeof v === 'number')) : null,
    injuries: injuries.sort(),
    variants: Object.fromEntries((p.variants || []).map(v => [v.id, { name_key: `profile.${v.id}.name`, weekly_sets_delta: v.weekly_sets_delta || {}, injuries_add: v.injuries_add || [] }])),
    age_rules: { age_50_plus: !!p.age_50_plus, older_60_plus: !!p.older_60_plus },
    template_hint: TEMPLATE_HINTS[p.id] || null,
    lead_for_goals: LEAD_FOR_GOALS[p.id] || [],
    volume_ratios: VOLUME_RATIOS[p.id] || [],
    play: p.play_adjustment ? { activity_counts_as_aerobic: true, heavy_play_weeks: true } : null,
    stay_athletic_dial: p.stay_athletic_dial || null,
    resistance_goal: (p.resistance_goal && p.resistance_goal.primary) || null,
    rules: p.family === 'combat' ? ['striker'] : [],
    evidence: 'synthesis/04_profiles.json v1.1'
  };
}

export function normPicker(prof) {
  const sports = prof.sports.list.map(s => ({
    id: s.id,
    name_key: `sport.${s.id}.name`,
    group: s.group,
    kind: s.kind || 'competitive',
    default_profile: s.default_profile || null,
    default_variant: s.default_variant || null,
    positions: (s.positions || []).map(p => ({ value: p.value, name_key: `sport.${s.id}.position.${p.value}`, profile: typeof p.profile === 'string' ? p.profile : null, profile_by_choice: p.profile_by_choice || (p.profile && typeof p.profile === 'object' ? p.profile : null), variant: p.variant || null })),
    second_choice: s.second_choice ? { name_key: `sport.${s.id}.second_choice`, options: (s.second_choice.options || []).map(o => ({ value: o.value, name_key: `sport.${s.id}.second_choice.${o.value}`, variant: o.variant || null, profile: o.profile || null })) } : null,
    age_variant: s.age_variant || null,
    routes_to: s.routes_to || null,
    rec_activity: s.rec_activity || s.recreational_activity || null
  }));
  const activities = prof.activities.list.map(a => ({
    id: a.id,
    name_key: `activity.${a.id}.name`,
    profile: a.profile,
    variant: a.variant || null,
    event_type: !!a.event_type,
    league_sport: (a.league_sport || []).map(x => ({ value: x.value, profile: x.profile })),
    style: (a.style || []).map(x => ({ value: x.value, profile: x.profile, variant: x.variant || null })),
    competitive_counterpart: a.competitive_counterpart || null
  }));
  return { groups: prof.sports.groups.map(g => ({ id: g.id, name_key: `sport_group.${g.id}.name` })), sports, activities };
}

export const GOALS = {
  muscle: { family: 'aesthetics', default_profile: 'bodybuilding_aesthetics', modifier: 'by_rule', aerobic: 4, walks: true, medball_main: false, plyo_block: false, olympic: false, pairing: 'same_pattern', rep_column: 'hypertrophy', refs: ['VOL-01', 'ATH-05', 'ATH-07', 'UNI-06', 'R2-SES-06'] },
  strength: { family: 'strength', default_profile: 'powerlifting_strength', modifier: 'by_rule', aerobic: 2, walks: false, medball_main: false, plyo_block: false, olympic: false, pairing: 'same_pattern', rep_column: 'strength', refs: ['VOL-12', 'ORD-07', 'PER-09', 'R2-ATH-06'] },
  athletic: { family: 'athletic', default_profile: 'weekend_warrior', modifier: 'by_rule', aerobic: 'by_profile', walks: false, medball_main: true, plyo_block: true, olympic: true, pairing: 'cross_pattern', rep_column: 'athletic', refs: ['ATH-10', 'ATH-13', 'UNI-06'] },
  active: { family: 'athletic', competitive: 'recreational', default_profile: 'weekend_warrior', modifier: 'by_rule', aerobic: 'by_profile', walks: false, medball_main: true, plyo_block: true, olympic: true, pairing: 'cross_pattern', rep_column: 'general', refs: ['ATH-13', 'COACH-CHAT 2026-10-08'] },
  fat_loss: { family: 'fat_loss_bootcamp', default_profile: 'fat_loss', modifier: 'by_rule', aerobic: 3, walks: false, medball_main: false, plyo_block: false, olympic: false, pairing: 'cross_pattern', rep_column: 'fat_loss', refs: ['ATH-07', 'PRG-03', 'PRG-11'] },
  general: { family: 'fat_loss_bootcamp', default_profile: 'general_population', modifier: 'by_rule', aerobic: 3, walks: false, medball_main: false, plyo_block: false, olympic: false, pairing: 'cross_pattern', rep_column: 'general', refs: ['ATH-07', 'UNI-06', 'UNI-09'] },
  hybrid: { family: 'hybrid_crossfit', default_profile: 'hybrid', modifier: 'by_rule', aerobic: 'by_profile', walks: false, medball_main: true, plyo_block: false, olympic: true, pairing: 'cross_pattern', rep_column: 'general', refs: ['PRG-10', 'ORD-03'] }
};
