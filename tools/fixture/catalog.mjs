// tools/fixture/catalog.mjs - architect-owned reference compile of synthesis/02_exercise_catalog.json (v1.1)
// into runtime ExerciseRecords (engine/CONTRACTS.md §3.2, catalog/2). B1's tools/compile-model.mjs must produce the
// same shapes; this file is the executable reading of the compile rules (B1 may copy it).
// Deterministic: no clock, no randomness; output sorted by id.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BASE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SYN = path.join(BASE, 'synthesis');
export const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// ---------------------------------------------------------------- vocab
export const MUSCLES = ['quads', 'hamstrings', 'glutes', 'chest', 'lats_upper_back', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'calves', 'abs_obliques', 'forearms', 'front_delts', 'traps', 'adductors', 'neck'];

// Credit map v1.1 (coach count). COACH-R2 R2-VOL-05: glutes 0.25 on squats / lunges / deadlifts / RDLs, hip thrusts and
// bridges 1.0, KB swings 0 (ballistic), thruster 1.0 quads / 0.5 shoulders / 0.25 glutes. LIB-16 dips 0.5 / 0.5.
// R2-LIB-04 + LIB-10: face pulls (cable or KB) = shoulder work, rear delts 1.0 + side delts 0.25 (split PROPOSED).
export const CREDIT_MAP = {
  BKD: { quads: 1, glutes: 0.25, adductors: 0.25 },
  UKD: { quads: 1, glutes: 0.25, adductors: 0.25 },
  BHD: { hamstrings: 1, glutes: 0.25 },
  UHD: { hamstrings: 1, glutes: 0.25 },
  GLUTE_ISO: { glutes: 1, hamstrings: 0.25 },
  LEG_FLEXION: { hamstrings: 1 },
  LEG_EXTENSION: { quads: 1 },
  HPUSH: { chest: 1, triceps: 0.25, front_delts: 0.25 },
  VPUSH: { front_delts: 1, side_delts: 0.25, triceps: 0.25 },
  DIPS: { triceps: 0.5, chest: 0.5 },
  THRUSTER: { quads: 1, front_delts: 0.5, glutes: 0.25 },
  HPULL: { lats_upper_back: 1, biceps: 0.25, rear_delts: 0.25 },
  VPULL: { lats_upper_back: 1, biceps: 0.25 },
  PULLOVER: { lats_upper_back: 1 },
  ISO_CHEST: { chest: 1 },
  ISO_SIDE: { side_delts: 1 },
  ISO_REAR: { rear_delts: 1 },
  FACEPULL: { rear_delts: 1, side_delts: 0.25 },
  ISO_FRONT: { front_delts: 1 },
  ISO_BICEPS: { biceps: 1, forearms: 0.25 },
  ISO_TRICEPS: { triceps: 1 },
  ISO_CALF: { calves: 1 },
  ISO_NECK: { neck: 1 },
  CORE: { abs_obliques: 1 },
  ATHLETIC: {},
  NONE: {}
};

// catalog pool -> template buckets the record may fill
const POOL_TO_BUCKETS = {
  BKD: ['RP_BKD'], UKD: ['RP_UKD'], BHD: ['RP_BHD'], UHD: ['RP_UHD'],
  HPUSH: ['RP_HPUSH'], VPUSH: ['RP_VPUSH'], HPULL: ['RP_HPULL'], VPULL: ['RP_VPULL'],
  KEXT: ['ISO_QUAD'], KFLEX: ['ISO_LEG_FLEXION'], SHLD: ['ISO_SIDE_REAR_DELT'], BIC: ['ISO_BICEP'], TRI: ['ISO_TRICEP'], CALF: ['ISO_CALF'],
  CT: ['CT_CORE_THORAX', 'CORE_ANY'], CP: ['CP_CORE_PELVIS', 'CORE_ANY'], CB: ['CT_CORE_THORAX', 'CP_CORE_PELVIS', 'CORE_ANY'], AOS: ['CT_CORE_THORAX', 'CORE_ANY'], CORE: ['CORE_ANY'],
  PLYO: ['AP_PLYO'], ANKLE: ['AP_JUMP_LIMITED_KNEE'], THROW: ['AP_THROW'], TX: ['AP_TRIPLE_EXT'], COD: ['AP_COD'], SPRINT: ['AP_SPRINT', 'COND_SPRINT_BUYOUT'],
  CARDIO: ['COND_AEROBIC'], WARMUP: ['WARMUP_PREP'], CARRY: ['FUNCTIONAL'], DRAG: ['FUNCTIONAL'], ARMCARE: ['RECOVERY_ARM_CARE'], NECK: ['PREHAB_NECK'],
  MRPUSH: [] // resolved by primary muscle below
};

// CrossFit-class skill work (05 G9 'SKILL' station: 'DUBS', 'GYMNASTICS'); INFERRED list, Phase 0.
export const SKILL_IDS = ['double-unders-jump-rope', 'jump-rope', 'toes-to-bar-hanging', 'dead-hang-pull-up-bar', 'hollow-rocks', 'handstand-hold-wall', 'pull-up-grip-not-stated', 'knees-to-chest-hanging'];
// WOD / circuit / HYROX station pool (conditioning; never muscle sets, VOL-10). INFERRED, Phase 0.
const WOD_RE = /^(calorie-effort-|burpees$|burpee-broad-jump|wall-ball|rower-calorie-sprint|skierg-calorie-sprint|bike-calorie-sprint|jumping-jacks|mountain-climbers|sled-push|sled-drag|sled-rope-pull|farmer-carry|sandbag-|kettlebell-swing-russian|american-kb-swing|db-thruster|barbell-thruster|box-jump|jump-rope|double-unders)/;
const CIRCUIT_CARDIO_RE = /^(calorie-effort-|burpees$|jumping-jacks|mountain-climbers|jump-rope|rower-calorie-sprint|skierg-calorie-sprint|bike-calorie-sprint|fast-run-walk-back|20-s-fast-40-s-slow)/;
const TIBIALIS_RE = /^tibialis-raise/;

export const IMPLEMENT_TO_KIT = {
  none: null, any_cardio_mode: null, rope: null, dumbbell: 'dumbbell', kettlebell: 'kettlebell', barbell: 'barbell', medball: 'medball',
  open_space_long: 'open_space_long', open_space_short: 'open_space_short', cable: 'cable', box: 'box', machine: '__machine__',
  cardio_treadmill: 'treadmill', cardio_machine: 'cardio_machine_cal', step: 'step_low', bench: 'bench', weight_bench: 'weight_bench',
  wall: 'wall', pullup_bar: 'pullup_bar', plate: 'weight_plate', plate_low_target: 'plate_low_target', hex_bar: 'hex_bar', squat_rack: 'rack',
  household_object: 'household', hurdles: 'hurdles', landmine: 'landmine', seal_bench: 'seal_bench', stability_ball: 'stability_ball',
  ez_bar: 'ez_bar', suspension_trainer: 'trx', dip_station: 'dip_bars', sled: 'sled', sandbag: 'sandbag', slider: 'slider',
  jump_rope: 'jump_rope', cones: 'cones', smith: 'smith', dip_belt: 'dip_belt', farmer_handles: 'farmer_handles', box_high: 'plyo_box_high',
  ssb: 'ssb', foam_roller: 'foam_roller', hyper_bench: 'hyper_bench', ghd: 'ghd', anchor: 'anchor_point', reverse_hyper: 'reverse_hyper'
};

// F29 machine ids -> the kit token that makes them available when F29 is left empty
export const MACHINES = {
  leg_press: 'machine_plate_loaded', hack_squat: 'machine_plate_loaded', pendulum: 'machine_specialty', belt_squat: 'belt_squat',
  leg_extension: 'machine_selectorized', leg_curl_seated: 'machine_selectorized', leg_curl_lying: 'machine_selectorized',
  lat_pulldown: 'cable', assisted_pullup: 'machine_selectorized', row_machine: 'machine_selectorized', chest_press: 'machine_selectorized',
  shoulder_press_machine: 'machine_selectorized', cable_stack: 'cable', smith: 'smith', ghd_or_45deg: 'hyper_bench', reverse_hyper: 'reverse_hyper',
  hip_thrust_machine: 'machine_specialty'
};

function machineFor(r) {
  const id = r.id, mt = r.equipment.machine_type;
  if (/lat-pulldown|single-arm-lat-pulldown/.test(id)) return { machine: 'lat_pulldown', token: 'cable' };
  if (/leg-press/.test(id)) return { machine: 'leg_press', token: 'machine_plate_loaded' };
  if (/hack-squat-machine/.test(id)) return { machine: 'hack_squat', token: 'machine_plate_loaded' };
  if (/pendulum-squat/.test(id)) return { machine: 'pendulum', token: 'machine_specialty' };
  if (/belt-squat/.test(id)) return { machine: 'belt_squat', token: 'belt_squat' };
  if (/leg-extension-machine/.test(id)) return { machine: 'leg_extension', token: 'machine_selectorized' };
  if (/seated-leg-curl/.test(id)) return { machine: 'leg_curl_seated', token: 'machine_selectorized' };
  if (/lying-leg-curl/.test(id)) return { machine: 'leg_curl_lying', token: 'machine_selectorized' };
  if (/machine-leg-curl/.test(id)) return { machine: null, token: 'machine_selectorized' };
  if (/assisted-pull-up|assisted-dips/.test(id)) return { machine: 'assisted_pullup', token: 'machine_selectorized' };
  if (/machine-row|single-arm-machine-row/.test(id)) return { machine: 'row_machine', token: 'machine_selectorized' };
  if (/machine-bench-press|machine-chest-press/.test(id)) return { machine: 'chest_press', token: 'machine_selectorized' };
  if (/seated-machine-shoulder-press/.test(id)) return { machine: 'shoulder_press_machine', token: 'machine_selectorized' };
  if (/hip-thrust-machine/.test(id)) return { machine: 'hip_thrust_machine', token: 'machine_specialty' };
  if (/good-morning-machine/.test(id)) return { machine: null, token: 'machine_specialty' };
  if (/seated-bent-knee-calf-raise/.test(id)) return { machine: null, token: 'machine_selectorized' };
  if (mt) return { machine: null, token: 'machine_selectorized' };
  return { machine: null, token: 'machine_selectorized' };
}

// ---------------------------------------------------------------- bands (EQ-01, EQ-07, EQ-08, EQ-12)
export const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;
export function cleanBandId(id) {
  return id
    .replace(/-as-written-face-pulls-are-normally-cable-band$/g, '')
    .replace(/-band-or-machine/g, '-machine')
    .replace(/-cable-band-/g, '-cable-')
    .replace(/-cable-band$/g, '-cable')
    .replace(/-banded-cable-/g, '-cable-')
    .replace(/--+/g, '-');
}
export function cleanBandName(name) {
  return name
    .replace(/\s*\((?:band or machine|machine or band)\)/gi, ' (machine)')
    .replace(/Band or Machine/gi, 'Machine')
    .replace(/\bcable\s*\/\s*band\b/gi, 'cable')
    .replace(/\bband\s*\/\s*cable\b/gi, 'cable')
    .replace(/\bcable or band\b/gi, 'cable')
    .replace(/\bband or cable\b/gi, 'cable')
    .replace(/\bbanded cable\b/gi, 'cable')
    .replace(/\(as written[^)]*\)/gi, '')
    .replace(/\s{2,}/g, ' ').trim();
}

// ---------------------------------------------------------------- helpers
const LEVELS = ['foundational', 'intermediate', 'advanced'];
function parseLb(text) {
  if (text === null || text === undefined) return null;
  const m = String(text).match(/(\d+)\s*-\s*(\d+)/);
  if (m) return [Number(m[1]), Math.min(20, Number(m[2]))];
  const n = String(text).match(/(\d+)/);
  return n ? [Number(n[1]), Math.min(20, Number(n[1]))] : null;
}
function medballKind(r, typical) {
  const t = (typical || '') + ' ' + r.id;
  if (/wall-ball/.test(r.id)) return 'wall_ball';
  if (/slam/.test(t)) return 'slam';
  if (/sit-up|situp/.test(r.id)) return 'situp';
  if (/overhead/.test(r.id)) return 'overhead';
  if (/warm|squat-jumps|calf-raise|lunge/.test(r.id) && !/scoop|throw|pass/.test(r.id)) return 'warmup';
  return 'pass_rotation';
}
const isKbSwing = (r) => /swing/.test(r.id) && ['BHD', 'UHD'].includes(r.taxonomy.pattern_code);

function creditClass(r, pattern) {
  const ps = (r.volume_credit && r.volume_credit.per_set) || {};
  const counts = r.volume_credit && r.volume_credit.counts_toward_muscle_volume;
  const fam = r.taxonomy.family;
  if (['PLYO', 'ANKLE', 'THROW', 'TX', 'COD', 'SPRINT', 'CARDIO', 'WARMUP', 'COMPLEX'].includes(pattern)) return 'ATHLETIC';
  if (isKbSwing(r)) return 'ATHLETIC'; // R2-VOL-05: KB swings are ballistic, never glute (or any muscle) volume
  if (TIBIALIS_RE.test(r.id)) return 'NONE'; // tibialis anterior is not 'calves' (prehab, INFERRED)
  if (['CARRY', 'DRAG', 'ARMCARE', 'POS', 'LSS', 'MODIFIER'].includes(pattern)) return 'NONE';
  if (pattern === 'NECK') return 'ISO_NECK';
  if (['CT', 'CP', 'CB', 'AOS', 'CORE'].includes(pattern)) return 'CORE';
  if (counts === false && fam !== 'RESISTANCE') return 'ATHLETIC';
  switch (pattern) {
    case 'BKD': return (ps['SHOULDERS/TRAPS'] === 0.5 || /thruster/.test(r.id)) ? 'THRUSTER' : 'BKD';
    case 'UKD': return 'UKD';
    case 'BHD': return ps.GLUTES === 1 ? 'GLUTE_ISO' : 'BHD';
    case 'UHD': return ps.GLUTES === 1 ? 'GLUTE_ISO' : 'UHD';
    case 'KEXT': return 'LEG_EXTENSION';
    case 'KFLEX': return 'LEG_FLEXION';
    case 'HPUSH':
      if (ps.CHEST === 0.5 && ps.TRICEP === 0.5) return 'DIPS';
      if (r.exercise_class === 'isolation' || (ps.CHEST === 1 && Object.keys(ps).length === 1)) return 'ISO_CHEST';
      return 'HPUSH';
    case 'MRPUSH': return ps.CHEST === 1 ? 'HPUSH' : 'VPUSH';
    case 'VPUSH': return 'VPUSH';
    case 'HPULL': return 'HPULL';
    case 'VPULL':
      if (/pullover|pull-over/.test(r.id)) return 'PULLOVER';
      return 'VPULL';
    case 'SHLD': {
      if (/face-pull/.test(r.id)) return 'FACEPULL';
      const head = r.delt_head && r.delt_head.value;
      // a front raise is front-delt work whatever 02 says in delt_head (4 records carry 'rear'; CONTRACTS §3.2.3, integration fix)
      if (/front-raise/.test(r.id)) return 'ISO_FRONT';
      if (head === 'rear' || /reverse-fly|rear-delt|t-raise|y-raise|y-t-raise/.test(r.id)) return 'ISO_REAR';
      if (head === 'front') return 'ISO_FRONT';
      return 'ISO_SIDE';
    }
    case 'BIC': return 'ISO_BICEPS';
    case 'TRI': return 'ISO_TRICEPS';
    case 'CALF': return 'ISO_CALF';
    default: return 'NONE';
  }
}

function firstUrl(u) {
  const m = String(u || '').match(/https?:\/\/[^\s;,)]+/);
  return m ? m[0] : null;
}

function slotsFor(r, pattern, cclass) {
  const g = r.generator || {};
  const pools = g.pools || [pattern];
  const out = new Set();
  for (const p of pools) for (const b of (POOL_TO_BUCKETS[p] || [])) out.add(b);
  if (pattern === 'MRPUSH') out.add(cclass === 'HPUSH' ? 'RP_HPUSH' : 'RP_VPUSH');
  if (cclass === 'ISO_CHEST') { out.delete('RP_HPUSH'); out.add('ISO_CHEST'); }
  if (cclass === 'FACEPULL' || cclass === 'ISO_REAR') { out.delete('RP_VPULL'); out.add('ISO_SIDE_REAR_DELT'); }
  // R2-VOL-05: a swing never fills a resistance (muscle-set) slot; it lives in the ballistic / power slot only (D-12)
  if (isKbSwing(r)) { for (const b of ['RP_BHD', 'RP_UHD']) out.delete(b); out.add('AP_TRIPLE_EXT'); }
  if (TIBIALIS_RE.test(r.id)) { out.delete('ISO_CALF'); out.add('PREHAB_LOWER'); }
  if (/sissy-squat/.test(r.id)) out.add('ISO_QUAD'); // EQ-08 swap for no leg-extension machine
  if (SKILL_IDS.includes(r.id)) out.add('SKILL');
  if (WOD_RE.test(r.id)) out.add('COND_WOD');
  if (CIRCUIT_CARDIO_RE.test(r.id)) out.add('COND_CIRCUIT');
  // COND_AEROBIC holds colour sessions / steady or interval cardio only (prescriptions), never a WOD station
  if (out.has('COND_AEROBIC') && r.record_type !== 'conditioning_prescription' && WOD_RE.test(r.id)) out.delete('COND_AEROBIC');
  if (/^(side-lying-db-external-rotation|cable-external-rotation|scapular-push-up|floor-prone-y-t-raises|kb-face-pull)/.test(r.id)) out.add('RECOVERY_ARM_CARE');
  if (/^(single-leg-balance-reach|tibialis-raise|seated-bent-knee-calf-raise|copenhagen-plank)/.test(r.id)) out.add('PREHAB_LOWER');
  // FOCUS can take any resistance record that has a target-muscle prime credit
  if (!['ATHLETIC', 'NONE', 'CORE', 'ISO_NECK'].includes(cclass)) out.add('FOCUS');
  return [...out].sort();
}

// per-slot default (generator.default_candidate_by_pool wins over default_candidate; CAT-07: BYOP library first)
function defaultSlots(r, slots, cclass) {
  const g = r.generator || {};
  if (['proposed_v1', 'proposed_v1_1'].includes(r.status)) return []; // PROPOSED additions are swaps only until he approves
  if (g.default_candidate_by_pool) {
    const ok = new Set();
    for (const [pool, v] of Object.entries(g.default_candidate_by_pool)) if (v) for (const b of (POOL_TO_BUCKETS[pool] || [])) if (slots.includes(b)) ok.add(b);
    return [...ok].sort();
  }
  if (!g.default_candidate) return [];
  return slots.filter(s => s !== 'FOCUS' || ['ISO_CHEST', 'ISO_SIDE', 'ISO_REAR', 'FACEPULL', 'ISO_BICEPS', 'ISO_TRICEPS', 'ISO_CALF', 'LEG_FLEXION', 'LEG_EXTENSION', 'GLUTE_ISO'].includes(cclass)).sort();
}

const OLY_DAY = { clean: 'knee', snatch: 'hip', jerk: 'either', loaded_jump: 'knee' };
function athleticFor(r, pattern) {
  const pools = (r.generator && r.generator.pools) || [];
  if (!['PLYO', 'ANKLE', 'THROW', 'TX', 'COD', 'SPRINT'].includes(pattern) && !pools.includes('TX') && !isKbSwing(r)) return null;
  const aq = r.athletic_quality || {};
  const v = aq.value || '';
  const cc = (r.contact_class_v1_1 && r.contact_class_v1_1.value) || null; // plyometric | ballistic | receive (R2-ATH-02)
  const oly = r.olympic_v1_1 || null;
  let quality = 'ballistic';
  if (pattern === 'THROW' || /\(throw\)/.test(v)) quality = 'throw';
  else if (pattern === 'COD' || /change of direction/.test(v)) quality = 'cod';
  else if (pattern === 'SPRINT' || /^speed/.test(v)) quality = 'sprint';
  else if ((oly && oly.family !== 'loaded_jump') || /^olympic/.test(v) || /push-press|push-jerk/.test(r.id)) quality = 'olympic';
  else if (cc === 'receive' || /^landing/.test(v)) quality = 'landing';
  else if (cc === 'plyometric' || /^plyometric/.test(v)) quality = 'plyometric';
  else quality = 'ballistic';
  const lvl = (r.level && r.level.generator_min_level) || 'foundational';
  const fromFloor = /^(power-clean|power-snatch|power-clean-and-jerk|clean-and-jerk-full|clean-squat-clean|snatch-squat-snatch|clean-pull-start|snatch-pull-start)/.test(r.id);
  let olyFamily = oly ? oly.family : (/push-press/.test(r.id) ? 'jerk' : (/swing/.test(r.id) ? 'swing' : null));
  const rcs = aq.receive_create_stage && aq.receive_create_stage.default_stage;
  return {
    quality,
    contact_class: cc === 'receive' ? 'landing' : cc,
    olympic_family: quality === 'olympic' || olyFamily === 'loaded_jump' || olyFamily === 'swing' ? olyFamily : null,
    day_pattern: olyFamily ? (OLY_DAY[olyFamily] || 'either') : null,
    olympic_tier: quality === 'olympic' || olyFamily === 'loaded_jump' ? (lvl === 'foundational' ? 'L1' : 'L2_plus') : null,
    full_catch: /squat-clean|squat-snatch|clean-and-jerk-full|full-depth-catch|high-hang-squat-snatch|low-hang-squat/.test(r.id),
    from_floor: fromFloor,
    plyo_method_default: aq.plyo_method || null,
    rc_stage_default: typeof rcs === 'number' ? `RC${rcs}` : null,
    unilateral_harder: !!aq.unilateral_harder,
    loaded_jump: /loaded jump/.test(v) || olyFamily === 'loaded_jump' || /hex-bar-jump|db-repeated-squat-jumps|medball-squat-jumps/.test(r.id),
    count_unit: quality === 'throw' ? 'throws' : quality === 'cod' ? 'cuts' : quality === 'sprint' ? 'metres' : (['olympic'].includes(quality) || olyFamily === 'swing' ? 'reps' : 'contacts')
  };
}

// tags: closed list (CONTRACTS §3.2.5)
export const OLDER_NEVER_ALWAYS = ['overhead_squat', 'low_bar'];               // EQ-03, never even with the 60+ opt-in
export const OLDER_NEVER_PHASE0 = ['depth_jump', 'high_depth_drop', 'snatch']; // EQ-03; R2-ATH-08 opt-in pending R3-ATH-02 (D-05)
function tagsFor(r, pattern, cclass, eq, ath, axialClass) {
  const id = r.id, t = new Set();
  const setups = (r.equipment.setups_any_of || []).flat();
  if (/overhead-squat|overhead-box-squat|drop-overhead-squat/.test(id)) t.add('overhead_squat');
  if (/snatch/.test(id) && !/snatch-grip-deadlift|snatch-grip-rdl/.test(id)) t.add('snatch');
  if (/low-bar/.test(id)) t.add('low_bar');
  if (/depth-jump|drop-to-box-jump|depth-drop-release|drop-release|drop-and-double-bounce|drop-bilateral-and-hop|weighted-depth-jump|single-leg-depth-drop/.test(id)) t.add('depth_jump');
  if (/high-depth-drop/.test(id)) t.add('high_depth_drop');
  if (/hurdle-hop|hurdle-hops/.test(id)) t.add('hurdle_hop');
  if (/bound/.test(id)) t.add('bound');
  if (pattern === 'VPUSH' || /overhead/.test(id)) t.add('overhead');
  if (pattern === 'VPUSH' && setups.includes('barbell')) t.add('overhead_barbell');
  if (/dip/.test(id) && !/hip/.test(id)) t.add('dips');
  if (/upright-row/.test(id)) t.add('upright_row');
  if (/skull/.test(id)) t.add('skullcrusher');
  if (/good-morning/.test(id)) t.add('good_morning');
  if (/bent-over/.test(id)) t.add('bent_over');
  if (/chest-supported|seal-|machine-row|seated-cable-row/.test(id)) t.add('chest_supported');
  if (/sumo/.test(id)) t.add('sumo');
  if (/cossack/.test(id)) t.add('cossack');
  if (/pistol|sissy|cossack|deep/.test(id)) t.add('deep_knee_flexion');
  if (/front-squat|front-rack|clean/.test(id)) t.add('front_rack');
  if (/push-up/.test(id)) t.add('push_up_floor');
  if (/belt-squat/.test(id)) t.add('belt_squat');
  if (/kong-row/.test(id)) t.add('kong_row');
  if (/push-press/.test(id)) t.add('push_press');
  if (/push-jerk|split-jerk/.test(id)) t.add('push_jerk');
  if (/thruster/.test(id)) t.add('thruster');
  if (/pullover|pull-over/.test(id)) t.add('pullover');
  if (/face-pull/.test(id)) t.add('face_pull');
  if (isKbSwing(r)) t.add('kb_swing');
  if (/wall-ball/.test(id)) t.add('wall_ball');
  if (cclass === 'GLUTE_ISO') t.add('glute_iso');
  if (cclass === 'DIPS') t.add('dips');
  const fixed = setups.length && setups.every(s => ['barbell', 'ez_bar', 'hex_bar', 'squat_rack', 'weight_bench', 'bench', 'landmine', 'smith', 'ssb'].includes(s)) && setups.some(s => ['barbell', 'ez_bar', 'hex_bar', 'ssb'].includes(s));
  if (fixed) t.add('fixed_grip');
  if (setups.some(s => ['dumbbell', 'kettlebell'].includes(s)) || /single-arm|alternating/.test(id)) t.add('split_grip');
  if (eq.machine || eq.any_of.flat().some(x => /machine_/.test(x))) t.add('machine');
  if (eq.any_of.flat().includes('cable')) t.add('cable');
  if (eq.any_of.flat().includes('barbell')) t.add('barbell');
  if (eq.any_of.flat().includes('medball')) t.add('medball');
  if (ath && ath.quality === 'olympic') t.add('olympic');
  if (ath && ath.loaded_jump) t.add('loaded_jump');
  if (ath && ath.from_floor) t.add('olympic_from_floor');
  if (ath && ath.quality === 'plyometric') t.add('plyo_repeated');
  if (ath && ath.quality === 'landing') t.add('landing');
  if (/ankle-hops|pogo/.test(id)) t.add('ankle_hop');
  if (/high/.test(r.impact_level || '') || t.has('depth_jump')) t.add('high_impact');
  if (axialClass === 'high') t.add('axial_high');
  if (r.axial_spinal_load && r.axial_spinal_load.spine_day_v1_1 && r.axial_spinal_load.spine_day_v1_1.counts_as_heavy_spine_lift) t.add('spine_counted');
  return t;
}

export function normalizeExercise(r) {
  const pattern = r.taxonomy.pattern_code;
  const m = machineFor(r);
  const sets = (r.equipment.setups_any_of || [['none']]).filter(s => !s.some(x => BAND_RE.test(x)));
  if (!sets.length) return null; // band-only record: dropped (EQ-01)
  const any_of = sets.map(s => {
    const toks = new Set();
    for (const x of s) {
      const k = IMPLEMENT_TO_KIT[x];
      if (k === undefined) throw new Error('unmapped implement ' + x + ' in ' + r.id);
      if (k === '__machine__') toks.add(m.token); else if (k) toks.add(k);
    }
    return [...toks].sort();
  });
  // dedupe identical setups
  const seen = new Set(); const anyOf = [];
  for (const s of any_of) { const k = s.join('|'); if (!seen.has(k)) { seen.add(k); anyOf.push(s); } }
  anyOf.sort((a, b) => a.length - b.length || (a.join('|') < b.join('|') ? -1 : 1));
  const usesMachine = sets.some(s => s.includes('machine'));
  const equipment = { any_of: anyOf, machine: usesMachine ? m.machine : null };
  const cclass = creditClass(r, pattern);
  const credits = { ...CREDIT_MAP[cclass] };
  const primary = cclass === 'DIPS' ? null : (Object.entries(credits).find(([, v]) => v === 1) || [null])[0];
  const ath = athleticFor(r, pattern);
  const axialRaw = (r.axial_spinal_load && r.axial_spinal_load.value) || 'none';
  const axial_pattern = ['BKD', 'UKD'].includes(pattern) ? 'squat' : ['BHD', 'UHD'].includes(pattern) ? 'hinge' : null;
  // R2-SES-01/02: the counted spine list comes from 02 v1.1 axial_spinal_load.spine_day_v1_1 (counted / second-day option / not counted)
  const spineDay = (r.axial_spinal_load && r.axial_spinal_load.spine_day_v1_1) || null;
  const spineCls = String((spineDay && spineDay.class) || 'not counted');
  const spineCounted = !!(spineDay && spineDay.counts_as_heavy_spine_lift) && !!axial_pattern;
  const tagSet = tagsFor(r, pattern, cclass, equipment, ath, axialRaw);
  for (const p of (r.population_rules || [])) {
    const pop = String(p.population || ''), rule = String(p.rule || '');
    if (/older \/ injured/.test(pop) && /^preferred/.test(rule)) tagSet.add('older_preferred');
    if (/aesthetics/.test(pop) && /warm-up only/.test(rule)) tagSet.add('aesthetics_warmup_only');
    if (/pitchers/.test(pop) && /overhead/.test(rule)) tagSet.add('pitcher_reduce');
    if (/boxers/.test(pop)) tagSet.add('striker_reduce');
    if (/beginners in athletic/.test(pop)) tagSet.add('beginner_olympic');
    if (/youth/.test(pop) && /floor/.test(rule)) tagSet.add('youth_floor_ok');
    if (/axially loaded/.test(pop)) tagSet.add('axial_unload');
    if (/shoulder or back pain/.test(pop)) tagSet.add('pain_friendly');
  }
  const tags = [...tagSet].sort();
  // 60+ (R2-ATH-08): power work off by default, on by opt-in; EQ-03 never-list kept (D-05)
  const olderExcluded = !!(r.older_default_excluded && r.older_default_excluded.value) || (ath && ['plyometric', 'olympic'].includes(ath.quality)) || tags.includes('depth_jump');
  const neverAlways = tags.some(x => OLDER_NEVER_ALWAYS.includes(x));
  const neverPhase0 = tags.some(x => OLDER_NEVER_PHASE0.includes(x));
  const older_ok = !olderExcluded && !neverAlways && !neverPhase0;
  const older_opt_in_ok = !neverAlways && !neverPhase0;
  const lvl = (r.level && r.level.generator_min_level) || 'foundational';
  let medball = null;
  if (r.implement_load) {
    const lb = parseLb(r.implement_load.typical_lb) || parseLb(r.implement_load.max_lb);
    if (lb) medball = { min_lb: lb[0], max_lb: Math.min(20, lb[1]), kind: medballKind(r, r.implement_load.typical_lb) };
  }
  const cardio = pattern === 'CARDIO' ? ((r.name.match(/Aerobic ([ABC]) \(/) || [])[1] || (/^lactate-clearance/.test(r.id) ? 'LC' : null)) : null;
  const vid = (r.video_urls || [])[0];
  const id = cleanBandId(r.id);
  const slots = slotsFor(r, pattern, cclass);
  const lat = r.laterality;
  const out = {
    id,
    source_id: r.id,
    name_key: `exercise.${id}.name`,
    cue_key: r.coach_cues && r.coach_cues.length ? `exercise.${id}.cue` : null,
    kind: r.record_type === 'conditioning_prescription' ? 'conditioning' : r.record_type,
    family: r.taxonomy.family,
    pattern,
    node: r.taxonomy.node_01_taxonomy || null,
    slots,
    default_in_slots: defaultSlots(r, slots, cclass),
    laterality: ['bilateral', 'unilateral', 'alternating'].includes(lat) ? lat : (lat && String(lat).startsWith('either') ? 'unilateral' : 'n/a'),
    plane: ['sagittal', 'frontal', 'transverse', 'multi'].includes(r.plane) ? r.plane : 'n/a',
    level: LEVELS.includes(lvl) ? lvl : 'foundational',
    zone: (r.davidson_zone && r.davidson_zone.zone) || null,
    rotation_bias: r.davidson_zone && r.davidson_zone.rotation_bias ? (/external/.test(r.davidson_zone.rotation_bias) ? 'external' : 'internal') : null,
    size_class: r.muscle_size_class || 'n/a',
    exercise_class: r.exercise_class || 'n/a',
    counting: r.volume_counting || 'not_counted',
    credit_class: cclass,
    credits,
    primary_muscle: primary,
    equipment,
    constraint: (r.constraint_level && r.constraint_level.value) || 2,
    axial_class: ['high', 'moderate', 'low', 'none'].includes(axialRaw) ? axialRaw : 'none',
    axial: spineCounted,
    spine_class: spineCounted ? 'counted' : (/second-day/.test(spineCls) ? 'second_day' : 'not_counted'),
    axial_pattern,
    skill: r.skill_demand || 'low',
    impact: r.impact_level || 'none',
    load_ceiling: r.load_ceiling || 'low',
    is_athletic: cclass === 'ATHLETIC',
    athletic: ath,
    conditioning: cardio ? { colour: cardio } : null,
    medball,
    older_ok,
    older_opt_in_ok,
    youth_ok: true,
    tags,
    variation_axes: (r.variation_v1_1 && Array.isArray(r.variation_v1_1.axes)) ? r.variation_v1_1.axes.map(a => { const w = String(a).split(' ')[0]; return w === 'which' ? 'hand' : w; }).filter((x, i, a) => a.indexOf(x) === i) : [],
    rep_hint: { text: (r.typical_rep_range && r.typical_rep_range.value) || null, unit: (r.typical_rep_range && r.typical_rep_range.dose_unit) || 'reps' },
    // 4 source cells hold two labelled links ('https://a (forward) ; https://b (lateral)'): keep the first URL (integration fix)
    video: vid && firstUrl(vid.url) ? { url: firstUrl(vid.url), kind: /MASTER EXERCISE LIBRARY/.test(vid.source || '') ? 'coach' : 'observed' } : null,
    status: r.status,
    sport_use: Array.isArray(r.sport_use_v1_1) ? r.sport_use_v1_1.slice().sort() : [],
    rule_refs: []
  };
  if (cclass === 'DIPS') out.rule_refs.push('LIB-16');
  if (cclass === 'THRUSTER') out.rule_refs.push('LIB-14', 'R2-VOL-05');
  if (cclass === 'GLUTE_ISO') out.rule_refs.push('R2-VOL-05');
  if (isKbSwing(r)) out.rule_refs.push('R2-VOL-05');
  if (cclass === 'FACEPULL') out.rule_refs.push('LIB-10', 'R2-LIB-04');
  if (id !== r.id) out.rule_refs.push('EQ-01');
  if (olderExcluded) out.rule_refs.push('R2-ATH-08');
  if (r.new_in_v1_1) out.rule_refs.push(r.new_in_v1_1.qid || 'R2-LIB-07');
  out.rule_refs = [...new Set(out.rule_refs)].sort();
  return out;
}

export function cleanName(r) {
  let n = cleanBandName(r.name);
  n = n.replace(/\s*\((?:meaning|implement|grip|catch|height|start position|type|technique)[^)]*(?:inferred|not stated|unconfirmed|ambiguous)[^)]*\)/gi, '');
  n = n.replace(/\s*\(as written\)/gi, '').replace(/\s*\(verify\)/gi, '');
  return n.replace(/\s{2,}/g, ' ').trim();
}

// the active filter (CONTRACTS §3.2): exercise / drill / test / conditioning_prescription with generator.eligible
export const ACTIVE_TYPES = ['exercise', 'drill', 'test', 'conditioning_prescription'];
export function isActive(r) {
  return ACTIVE_TYPES.includes(r.record_type) && !!(r.generator && r.generator.eligible) && !['retired'].includes(r.status) && !/21-6-mile|21\.6/.test(r.id);
}
