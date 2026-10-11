// engine/library.mjs - engine 0.5.0, work package V2 (library and selection): the library rules shared by select, week, dose,
// generate, edit, render and validate. Pure helpers: no I/O, no clock, no randomness.
//   * optional add-ons (COACH-R4 R4-LIB-01): statuses a template never picks, the two approved primaries (wall balls, sled pushes)
//   * carries and sled work (R4-LIB-02): dosed by distance or time, no muscle-set credit
//   * swaps say what they keep and lose (R4-LIB-04)
//   * the YouTube search link and the exact name to copy (R4-LIB-05)
// Data lives in the model: rules.selection.addons, rules.conditioning.carry, rules.selection.swap_notes, rules.render.video.

/** statuses a template never picks (rules.selection.addons.never_pick_statuses; tests/v05-library.test.mjs holds the two in step) */
export const NEVER_PICK_STATUS = ['optional_addon', 'proposed_v1', 'proposed_v1_1', 'live_library_not_selectable'];
/** statuses a plan never shows - not a pick, a swap or an offered add-on (neck work stays proposed, R4-LIB-01) */
export const NOT_SHOWN_STATUS = ['proposed_v1', 'proposed_v1_1'];
export const ADDON_STATUS = 'optional_addon';

/** a record the template never picks on its own (an optional add-on, a proposed record, a not-selectable library row) */
export function neverPick(ex) { return !!ex && NEVER_PICK_STATUS.includes(ex.status); }
/** a record no plan shows (still proposed: neck work) */
export function notShown(ex) { return !!ex && NOT_SHOWN_STATUS.includes(ex.status); }
/** an optional add-on (R4-LIB-01): chosen and added by the person, listed as a swap */
export function isAddon(ex) { return !!ex && ex.status === ADDON_STATUS; }

/**
 * R4-LIB-01: may this add-on be the template's pick here? Only wall balls and sled pushes, in a HYROX station circuit (and in the
 * CrossFit-style class WOD while rules.selection.addons.primary_exceptions keeps that reading enabled).
 * @param {object} ex @param {object} slot @param {string} eb effective bucket @param {string} family template family @param {object} R rules
 */
export function addonPrimaryOk(ex, slot, eb, family, R) {
  const A = R.selection && R.selection.addons;
  if (!A || !ex || ex.status !== A.addon_status) return false;
  return (A.primary_exceptions || []).some((x) => x.enabled !== false && x.ids.includes(ex.id) && x.bucket === eb
    && (!x.variants || x.variants.includes(slot && slot.variant)) && (!x.families || x.families.includes(family)));
}

/** R4-LIB-02: a carry or a sled exercise (rules.conditioning.carry: the tag, or the CARRY / DRAG pattern) */
export function isCarry(ex, R) {
  const C = R && R.conditioning && R.conditioning.carry;
  return !!C && !!ex && (((ex.tags || []).includes(C.tag)) || (C.patterns || []).includes(ex.pattern));
}

/** R4-LIB-02: the dose of a carry / sled exercise - by distance or time, never reps; `sets` are trips */
export function carryReps(ex, R) {
  const C = R.conditioning.carry;
  if (ex.rep_hint && ex.rep_hint.unit === 'seconds') return { type: 'seconds', min: C.seconds[0], max: C.seconds[1] };
  return { type: 'distance_or_time', metres: C.metres.slice(), seconds: C.seconds.slice(), per_side: !!(C.per_side_when_one_sided && ex.laterality === 'unilateral') };
}

/** implement class of an exercise (the implement ladder, second-of-group variety, squat vs hinge implement, swap notes) */
export function implementOf(ex) {
  const setups = ex.equipment.any_of;
  const all = (t) => setups.length && setups.every((su) => su.includes(t));
  if (ex.equipment.machine || ex.tags.includes('machine')) return 'machine';
  if (all('hex_bar')) return 'hex_bar';
  if (all('barbell') || all('ez_bar')) return 'barbell';
  if (ex.tags.includes('cable') || all('cable')) return 'cable';
  if (setups.some((su) => su.includes('dumbbell'))) return 'dumbbell';
  if (setups.some((su) => su.includes('kettlebell'))) return 'kettlebell';
  if (!setups.length || setups.some((su) => !su.length)) return 'bodyweight';
  return 'other';
}

// ---------------------------------------------------------------------------------------------------------------------------
// R4-LIB-04: what a swap keeps and what it loses, one key each (the words are model/i18n swap.keeps.* / swap.loses.*)
// ---------------------------------------------------------------------------------------------------------------------------

const PARTIAL_RE = /floor-press|box-squat|pin-press|board-press|rack-pull|quarter|half-squat|partial/;
const HOLD_RE = /plank|hold|hollow|dead-hang|wall-sit|isometric/;
const CEIL = { low: 0, moderate: 1, high: 2 };
const LEVEL = { foundational: 0, intermediate: 1, advanced: 2 };
const FREE = ['barbell', 'hex_bar', 'dumbbell', 'kettlebell'];
const isHold = (x) => (x.rep_hint && x.rep_hint.unit === 'seconds') || HOLD_RE.test(x.id);
const catches = (x) => !!(x.athletic && x.athletic.quality === 'olympic') && !/pull|jump|swing|shrug/.test(x.id);
const withBar = (x) => (x.tags || []).includes('barbell');

/** v0.5 fix round 2 (R4-LIB-04 'one short, true line'; the second coach-eye reviews listed 19 wrong lines): helpers of the notes */
const X2N = (R) => !!(R && R.selection && R.selection.x2 && R.selection.x2.swap_notes && R.selection.x2.swap_notes.enabled);
const isSwing = (x) => (x.tags || []).includes('kb_swing') || !!(x.athletic && x.athletic.olympic_family === 'swing');
const isCond = (x) => !!x.conditioning || x.family === 'CARDIO' || x.kind === 'conditioning' || /jump-rope|double-under|burpee|jumping-jack|calorie|fast-run/.test(x.id);
const LOAD_TOKENS = ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine_selectorized', 'machine_plate_loaded', 'machine_specialty', 'hex_bar', 'ez_bar', 'medball', 'weight_plate', 'sandbag', 'landmine', 'smith', 'dip_belt'];
const unloaded = (x) => !x.equipment.machine && !(x.tags || []).includes('machine') && !x.equipment.any_of.some((su) => su.some((t) => LOAD_TOKENS.includes(t)));
const FLEX_RE = /(sit-up|crunch|v-up|leg-raise|knees-to|toes-to|hollow)/, EXT_RE = /(superman|hyperextension|back-extension|reverse-hyper)/;
/** the trunk action of a core record: flexion, extension, a hold / anti-movement, rotation, or other */
export function coreFunction(x) {
  if (EXT_RE.test(x.id)) return 'extension';
  if (FLEX_RE.test(x.id)) return 'flexion';
  if (isHold(x) || /pallof|dead-bug|bird-dog|plank|carry/.test(x.id)) return 'anti';
  if (x.plane === 'transverse') return 'rotation';
  return 'other';
}

function keepsKey(a, b, R) {
  const qa = a.athletic && a.athletic.quality, qb = b.athletic && b.athletic.quality;
  if (X2N(R)) {
    // (the note reads the PICK: a strict press swapped for a push press keeps the vertical press, not 'the explosive hip drive';
    // a KB swing or a jump rope station does not 'keep the jump')
    if (isSwing(a)) return isSwing(b) || qb === 'olympic' ? 'swap.keeps.hip_drive' : 'swap.keeps.same_job';
    if (qa === 'olympic') return 'swap.keeps.hip_drive';
    if (!a.is_athletic && qb === 'olympic') return a.credit_class === b.credit_class && a.credit_class !== 'NONE' ? 'swap.keeps.' + a.credit_class : (a.primary_muscle && a.primary_muscle === b.primary_muscle ? 'swap.keeps.same_muscle' : 'swap.keeps.same_job');
    if (isCond(a) && !['plyometric', 'ballistic', 'landing', 'throw'].includes(qa)) return isCond(b) || qb === 'sprint' ? 'swap.keeps.conditioning' : 'swap.keeps.same_job';
  } else if (qa === 'olympic' || qb === 'olympic') return 'swap.keeps.hip_drive';
  if (a.is_athletic || b.is_athletic) {
    const q = qa || qb;
    if (q === 'landing' && qa === qb) return 'swap.keeps.landing';
    if (['plyometric', 'ballistic', 'landing'].includes(q)) return 'swap.keeps.jump';
    if (q === 'throw') return 'swap.keeps.throw';
    if (q === 'sprint') return 'swap.keeps.sprint';
    if (q === 'cod') return 'swap.keeps.cod';
    // (an erg, a rope or a burpee station is conditioning; a warm-up prep drill or a skill piece keeps its job in the session)
    const cond = (x) => !!x.conditioning || x.family === 'CARDIO' || x.kind === 'conditioning';
    return cond(a) || cond(b) ? 'swap.keeps.conditioning' : 'swap.keeps.same_job';
  }
  if (isCarry(a, R) && isCarry(b, R)) return 'swap.keeps.carry';
  if (a.credit_class === b.credit_class && a.credit_class !== 'NONE') return 'swap.keeps.' + a.credit_class;
  if (a.primary_muscle && a.primary_muscle === b.primary_muscle) return 'swap.keeps.same_muscle';
  if (a.pattern === 'ARMCARE' || b.pattern === 'ARMCARE' || (a.slots || []).some((s) => /^PREHAB|^RECOVERY/.test(s)) && (b.slots || []).some((s) => /^PREHAB|^RECOVERY/.test(s))) return 'swap.keeps.joint_care';
  return 'swap.keeps.same_job';
}

function losesKey(a, b, R) {
  if (X2N(R)) {
    const cls = (x) => x.credit_class;
    // a vertical pull the kit cannot hold, stood in for by a row
    if (cls(a) === 'VPULL' && cls(b) === 'HPULL') return 'swap.loses.vertical_pull';
    // an isolation exercise swapped for a compound one (a fly for a push-up, a lateral raise for an upright row), and back
    if (!a.is_athletic && !b.is_athletic && cls(a) !== 'CORE' && cls(b) !== 'CORE' && a.exercise_class === 'isolation' && b.exercise_class === 'compound') return 'swap.loses.isolation';
    // the load itself: a weighted pull-up or dip against the body-weight one
    if (!a.is_athletic && !b.is_athletic && cls(a) === cls(b) && !unloaded(a) && unloaded(b) && /weighted|dip|pull-up|chin-up|push-up/.test(a.id + ' ' + b.id)) return 'swap.loses.external_load';
    if (!a.is_athletic && !b.is_athletic && unloaded(a) && unloaded(b) && cls(a) === cls(b) && cls(a) !== 'CORE') return levelKey(a, b) || 'swap.loses.little';
    // a longer range is harder, whatever level the library files it under (a deficit deadlift for a deadlift)
    if (/deficit/.test(b.id) && !/deficit/.test(a.id) && cls(a) === cls(b)) return 'swap.loses.simplicity';
    // core: the same trunk action only when it is one (a sit-up and a superman are not 'the same movement')
    if (cls(a) === 'CORE' && cls(b) === 'CORE') {
      if (isHold(a) && !isHold(b)) return 'swap.loses.hold';
      if (!isHold(a) && isHold(b)) return 'swap.loses.movement';
      if (coreFunction(a) !== coreFunction(b)) return 'swap.loses.core_action';
      if (a.plane !== b.plane && a.plane !== 'n/a' && b.plane !== 'n/a' && a.plane !== 'multi' && b.plane !== 'multi') return 'swap.loses.plane';
      return levelKey(a, b) || 'swap.loses.little';
    }
    // a ballistic or conditioning station against another kind of station: the exact drill, never a 'two-sided load'
    if ((a.is_athletic || b.is_athletic) && !(a.athletic && b.athletic && a.athletic.quality === b.athletic.quality && ['plyometric', 'ballistic', 'landing'].includes(a.athletic.quality)) && !catches(a) && !(a.medball && !b.medball)) {
      if (a.athletic && b.athletic && a.athletic.response === 'repeat' && b.athletic.response && b.athletic.response !== 'repeat') return 'swap.loses.rebound';
      return 'swap.loses.same_drill';
    }
  }
  // the catch of an Olympic lift ("DB snatch instead of power clean: ... loses the barbell catch")
  if (catches(a) && withBar(a)) {
    if (!catches(b)) return withBar(b) ? 'swap.loses.catch' : 'swap.loses.barbell_catch';
    if (!withBar(b)) return 'swap.loses.barbell_catch';
  }
  if (catches(a) && !catches(b)) return 'swap.loses.catch';
  if (a.medball && !b.medball && a.athletic && a.athletic.quality === 'throw') return 'swap.loses.released_ball';
  if (!PARTIAL_RE.test(a.id) && PARTIAL_RE.test(b.id)) return 'swap.loses.bottom_range';
  if (a.athletic && b.athletic && a.athletic.response === 'repeat' && b.athletic.response && b.athletic.response !== 'repeat') return 'swap.loses.rebound';
  if (a.credit_class === 'CORE' || b.credit_class === 'CORE') {
    if (isHold(a) && !isHold(b)) return 'swap.loses.hold';
    if (!isHold(a) && isHold(b)) return 'swap.loses.movement';
    if (a.plane !== b.plane && a.plane !== 'n/a' && b.plane !== 'n/a') return 'swap.loses.plane';
    if (a.credit_class === b.credit_class) return levelKey(a, b) || 'swap.loses.little';
  }
  // a warm-up drill, a skill piece, an erg: nothing to compare but the level
  if ((a.is_athletic && !a.athletic) || (b.is_athletic && !b.athletic)) return levelKey(a, b) || 'swap.loses.same_drill';
  const press = ['HPUSH', 'VPUSH'].includes(a.credit_class) && ['HPUSH', 'VPUSH'].includes(b.credit_class);
  const incl = (x) => /(^|-)incline(-|$)/.test(x.id);
  if (press && incl(a) && !incl(b)) return 'swap.loses.incline_angle';
  if (press && !incl(a) && incl(b)) return a.credit_class === 'HPUSH' ? 'swap.loses.flat_angle' : 'swap.loses.overhead';
  if (press && !incl(a) && (a.tags || []).includes('overhead') && !(b.tags || []).includes('overhead')) return 'swap.loses.overhead';
  if (!a.is_athletic && !b.is_athletic) {
    // a bar (fixed grip) against dumbbells / kettlebells (split grip), read from the catalog's own grip tags first
    const fixed = (x) => (x.tags || []).includes('fixed_grip'), split = (x) => (x.tags || []).includes('split_grip') && !(x.tags || []).includes('fixed_grip');
    const mach = (x) => !!x.equipment.machine || (x.tags || []).includes('machine') || (x.tags || []).includes('cable');
    if (fixed(a) && split(b) && !mach(a) && !mach(b)) return 'swap.loses.barbell_load';
    if (split(a) && fixed(b) && !mach(a) && !mach(b)) return 'swap.loses.split_grip';
    const ia = implementOf(a), ib = implementOf(b);
    if (ia !== ib) {
      if (['barbell', 'hex_bar'].includes(ia) && ['dumbbell', 'kettlebell'].includes(ib)) return 'swap.loses.barbell_load';
      if (['dumbbell', 'kettlebell'].includes(ia) && ['barbell', 'hex_bar'].includes(ib)) return 'swap.loses.split_grip';
      if (FREE.includes(ia) && ['machine', 'cable'].includes(ib)) return 'swap.loses.free_weight_balance';
      if (ia === 'machine') return 'swap.loses.machine_support';
      if (ia === 'cable') return 'swap.loses.cable_tension';
      if (ib === 'bodyweight') return 'swap.loses.external_load';
      if (ia === 'bodyweight') return 'swap.loses.bodyweight_control';
      return 'swap.loses.implement';
    }
  }
  const bi = (x) => x.laterality === 'bilateral';
  if (bi(a) && ['unilateral', 'alternating'].includes(b.laterality)) return 'swap.loses.two_side_load';
  if (['unilateral', 'alternating'].includes(a.laterality) && bi(b)) return 'swap.loses.one_side_work';
  const sup = (x) => (x.tags || []).includes('chest_supported');
  if (sup(a) && !sup(b)) return 'swap.loses.chest_support';
  if (!sup(a) && sup(b)) return 'swap.loses.trunk_work';
  if (a.axial && !b.axial) return 'swap.loses.heavy_spine_load';
  if (a.credit_class !== b.credit_class && !(a.is_athletic && b.is_athletic)) return 'swap.loses.same_pattern';
  if (X2N(R) && !a.is_athletic && !b.is_athletic && (CEIL[b.load_ceiling] ?? 1) < (CEIL[a.load_ceiling] ?? 1)) return 'swap.loses.top_load';
  if (a.plane !== b.plane && a.plane !== 'n/a' && b.plane !== 'n/a' && !(X2N(R) && (a.plane === 'multi' || b.plane === 'multi'))) return 'swap.loses.plane';
  if (a.is_athletic && b.is_athletic) return levelKey(a, b) || 'swap.loses.same_drill';
  if ((CEIL[b.load_ceiling] ?? 1) < (CEIL[a.load_ceiling] ?? 1)) return 'swap.loses.top_load';
  return levelKey(a, b) || 'swap.loses.little';
}

/** an easier or a harder version of the same thing */
function levelKey(a, b) {
  if ((LEVEL[b.level] ?? 0) < (LEVEL[a.level] ?? 0)) return 'swap.loses.difficulty';
  if ((LEVEL[b.level] ?? 0) > (LEVEL[a.level] ?? 0)) return 'swap.loses.simplicity';
  return null;
}

/**
 * R4-LIB-04: the one-line note of swapping `from` for `to` - what it keeps and what it loses.
 * @param {object} model @param {object} from ExerciseRecord (the plan's pick) @param {object} to ExerciseRecord (the swap)
 * @returns {{id:string, keeps:string, loses:string}} i18n keys
 */
export function swapNote(model, from, to) {
  const R = model.rules;
  return { id: to.id, keeps: keepsKey(from, to, R), loses: losesKey(from, to, R) };
}

/** R4-LIB-04: the notes of a pick's swap list (ids the model does not hold are skipped) */
export function swapNotes(model, pickId, swapIds) {
  if (!pickId || !model.hasEx(pickId)) return [];
  const SN = model.rules.selection && model.rules.selection.swap_notes;
  if (!SN || !SN.enabled) return [];
  const from = model.ex(pickId);
  return (swapIds || []).filter((id) => model.hasEx(id)).map((id) => swapNote(model, from, model.ex(id)));
}

// ---------------------------------------------------------------------------------------------------------------------------
// R4-LIB-05: the video of an exercise - a YouTube search built from its English name, and that exact name for copying
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * @param {object} model @param {object} ex ExerciseRecord
 * @returns {{kind:string, url:string|null, copy_name:string|null}}
 */
export function videoOf(model, ex) {
  const V = (model.rules.render && model.rules.render.video) || null;
  const name = ex && model.has('en', ex.name_key) ? model.t('en', ex.name_key) : null;
  if (ex && ex.video && ex.video.url) return { kind: ex.video.kind, url: ex.video.url, copy_name: name };
  return { kind: 'search', url: V && name ? V.search_url + encodeURIComponent(name) : null, copy_name: name };
}
