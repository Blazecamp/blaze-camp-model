// engine/select.mjs - owner B3 (engine/CONTRACTS.md §4.7).
// Exercise selection: hard filters 1-11 in order, scoring from rules.selection.weights, deterministic seeded tie-breaks,
// two spine days, laterality share (bilateral : unilateral), contra / ipsi loading, plyo : ballistic share by ground
// contact class and Receive-Create stage, Olympic tier by level and the clean-day / snatch-day station pattern, swaps 2-4,
// exercise-block changes (one small change or a one-detail variation, never invented).
// Pure: no I/O, no clock, no randomness (ties broken by util.tieBreak(seed, slot_id, exercise_id)).
import { EngineError, why, tieBreak, EPS } from './util.mjs';
import { daySlots, baseSets } from './week.mjs';

// Structural ids (§1.4 vocabulary).
const LOWER_RP = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'];
const UPPER_RP = ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'];
const PLYO_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'];
const CONTACT_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW'];
const MACHINE_ISO = ['ISO_QUAD', 'ISO_LEG_FLEXION'];
const SQUAT_MACHINES = ['leg_press', 'hack_squat', 'pendulum', 'belt_squat'];
const SWAP_ONLY_STATUS = ['proposed_v1', 'proposed_v1_1', 'live_library_not_selectable']; // never the pick (CAT-07, selection.proposed_records_swap_only)
const RC_RANK = { RC1: 1, RC2: 2, RC3: 3 };
const AXIAL_RANK = { none: 0, low: 1, moderate: 2, high: 3 };
// INFERRED (CONTRACT_REQUESTS B3): which slots a pain area "touches" (§4.7 filter 5 names the cases, no table exists)
const PAIN_REGION = { neck: 'all', shoulder: 'upper', elbow: 'upper', wrist_hand: 'all', upper_back: 'upper', lower_back: 'all',
  hip_groin: 'lower', knee: 'lower', ankle_foot: 'lower', other: 'none' };
// INFERRED: floor-type core records for the F38 'floor_work' exclusion; upper-body plyos for AP_PLYO variant 'upper'
const FLOOR_CORE_RE = /(plank|crunch|sit-up|situp|lying|supine|floor|v-up|leg-raise|hollow|dead-bug|bird-dog|bridge)/;
const UPPER_PLYO_RE = /(push-up|pushup|clap|medball-slam)/;
const SPLIT_STANCE_RE = /(split|lunge|staggered|kickstand)/;
// INFERRED nearest pattern when a bucket has nothing in the kit (substitution_order: nearest_pattern_buy_list)
const NEAREST = { RP_VPULL: 'RP_HPULL', RP_HPULL: 'RP_VPULL', RP_VPUSH: 'RP_HPUSH', RP_HPUSH: 'RP_VPUSH', ISO_CHEST: 'RP_HPUSH',
  RP_BKD: 'RP_UKD', RP_UKD: 'RP_BKD', RP_BHD: 'RP_UHD', RP_UHD: 'RP_BHD', ISO_QUAD: 'RP_UKD', ISO_LEG_FLEXION: 'RP_UHD' };

// ------------------------------------------------------------------------------------------------------------------
// context
// ------------------------------------------------------------------------------------------------------------------

function prep(ctx) {
  const { derived, shape, layout, model } = ctx;
  if (!derived || !model) throw new EngineError('select.bad_ctx', 'select needs ctx.derived and ctx.model');
  const R = model.rules;
  const age = derived.age || 0;
  const older = age >= R.population.older.from_age;
  const optIn = older && !!(derived.prefs && derived.prefs.older_athletic_opt_in);
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const ladderOrder = R.levels.ladder_order;
  let ladder = (derived.D3_client_level && derived.D3_client_level.exercise_ladder) || R.levels.exercise_ladder[lvl];
  const youth = age < R.levels.youth_age;
  const youthMax = ladderOrder.indexOf(R.levels.youth_max_ladder);
  if (youth && ladderOrder.indexOf(ladder) > youthMax) ladder = R.levels.youth_max_ladder;
  const kit = derived.D8_kit || { tokens: [], machines: [] };
  const kitObj = { tokens: new Set(kit.tokens || []), machines: kit.machines || [] };
  const profileId = derived.D2_profile && derived.D2_profile.id;
  const sport = profileId && model.hasSport(profileId) ? model.sport(profileId) : null;
  const tb = shape && layout ? (shape.training_blocks || []).find((t) => t.n === layout.training_block) || null : null;
  const exerciseBlock = ctx.exerciseBlock || 1;
  const eb = shape ? (shape.exercise_blocks || []).find((e) => e.n === exerciseBlock) || null : null;
  const ebIdx = tb ? Math.max(0, exerciseBlock - tb.first_exercise_block) : exerciseBlock - 1;
  const firstWeek = eb && shape ? (shape.weeks || []).find((w) => w.n === eb.weeks[0]) || null : null;
  const D10 = derived.D10_bilateral_share || null;
  const D11 = derived.D11_athletic_budget || {};
  const pickShare = (arr, idx) => (arr && arr.length ? arr[Math.min(idx, arr.length - 1)] : null);
  let lowerTarget = D10 ? pickShare(D10.lower.by_exercise_block, ebIdx) : null;
  if (D10 && tb && tb.type === 'pre_season' && D10.lower.PRE != null) lowerTarget = D10.lower.PRE;
  if (D10 && tb && tb.type === 'in_season' && D10.lower.IN != null) lowerTarget = D10.lower.IN;
  const upperTarget = D10 && D10.upper ? pickShare(D10.upper.by_exercise_block, ebIdx) : null;
  // plyo share at the middle of this exercise block (R2-ATH-01: start -> end over the stairway; flat blocks: end)
  let plyoTarget = null;
  if (D11.enabled && D11.plyo_share) {
    const ps = D11.plyo_share;
    if (tb && tb.type === 'stairway' && tb.stair_N && eb && tb.stair_N > 1) {
      const mid = (eb.weeks[0] + eb.weeks[1]) / 2 - tb.weeks[0] + 1;
      plyoTarget = ps.start + ((ps.end - ps.start) * (mid - 1)) / (tb.stair_N - 1);
    } else plyoTarget = ps.end;
  }
  const A50 = R.population.active_aging_50;
  const racket50 = age >= A50.from_age && age <= A50.to_age && A50.racket_profiles.includes(profileId);
  const injuries = new Set(sport ? sport.injuries || [] : []);
  const clientFamily = (derived.D7_constraint_band && derived.D7_constraint_band.client_family) || 'general';
  const highVolume = clientFamily === 'older_or_pain' || injuries.has('HIGH_VOLUME_CONSTRAINT'); // EQ-03 never-list
  const sportWords = new Set([profileId, derived.D2_profile && derived.D2_profile.sport_id, ...(((derived.D2_profile && derived.D2_profile.activity_ids) || [])), sport && sport.sport]
    .filter(Boolean).map((w) => String(w).toLowerCase().replace(/_/g, ' ')));
  const pain = (derived.pain || []).filter((p) => !R.volume.pain.refer_if_severity.includes(p.severity));
  const fill = (derived.D9_start_sets && derived.D9_start_sets.fill) || (ctx.targets && ctx.targets.fill) || {};
  // v1.2: sport-profile hot spots (default avoid / prefer even with no pain entered, review 01 major 8)
  const H = R.selection.hotspots || {};
  const hot = { avoid_tags: new Set(), avoid_re: [], prefer_tags: new Set(), prefer_re: [] };
  for (const code of injuries) {
    const h = H[code];
    if (!h) continue;
    for (const t of h.avoid_tags || []) hot.avoid_tags.add(t);
    for (const t of h.prefer_tags || []) hot.prefer_tags.add(t);
    for (const r of h.avoid_id_patterns || []) hot.avoid_re.push(new RegExp(r));
    for (const r of h.prefer_id_patterns || []) hot.prefer_re.push(new RegExp(r));
  }
  const genericRe = (R.selection.generic_id_patterns || []).map((x) => new RegExp(x));
  const plyoRules = (sport && sport.plyo_rules) || null;
  // stage override: a plyo slot is re-picked when the Receive-Create stage changes inside an exercise block (review 02 / 03)
  const stageNow = ctx.stage_override || (firstWeek && firstWeek.plyo_stage) || R.athletic.stages.start_stage;
  return {
    priority: (derived.priority_muscles || []).slice(),
    ...ctx, R, model, derived, age, older, optIn, youth, lvl, ladder, ladderOrder, kitObj, kit, sport, profileId, tb, eb, ebIdx,
    exerciseBlock, firstWeek, lowerTarget, upperTarget, plyoTarget, racket50, highVolume, clientFamily, sportWords, pain, fill,
    band: derived.D7_constraint_band || { main: [1, 5], iso: [1, 5], machine_pen: 0, skill_pen: 0 },
    goal: derived.goal, family: derived.D1_family || (layout && layout.family),
    minutes: derived.session_minutes || 60,
    preferIds: new Set((sport && sport.olympic && sport.olympic.prefer_ids) || []),
    seed: ctx.seed || 'c53:none',
    hot, genericRe, plyoRules, injuries,
    stage: stageNow,
    weekUsed: new Set(ctx.week_used || []),
    competitive: !!(derived.D2_profile && derived.D2_profile.competitive === 'competitive')
  };
}

// ------------------------------------------------------------------------------------------------------------------
// filters
// ------------------------------------------------------------------------------------------------------------------

function bucketKind(model, b) { return model.bucket(b).kind; }

function slotRegion(slot, eb, model) {
  const b = model.bucket(eb);
  if (b.kind === 'core') return 'core';
  if (b.region) return b.region;
  if (b.kind === 'focus') { const m = slot.focus_muscle; return m ? model.muscle(m).region : 'upper'; }
  if (eb === 'AP_PLYO') return slot.variant === 'upper' ? 'upper' : 'lower';
  if (['ISO_QUAD', 'ISO_LEG_FLEXION', 'ISO_CALF', 'AP_JUMP_LIMITED_KNEE', 'AP_SPRINT', 'AP_COD', 'PREHAB_LOWER'].includes(eb)) return 'lower';
  if (['AP_TRIPLE_EXT', 'COND_WOD', 'COND_CIRCUIT', 'COND_SPRINT_BUYOUT', 'COND_AEROBIC', 'FUNCTIONAL'].includes(eb)) return 'both';
  return 'upper';
}

function touches(area, region) {
  const r = PAIN_REGION[area] || 'none';
  if (r === 'none') return false;
  if (r === 'all') return true;
  return region === r || region === 'both';
}

/** pool for a slot in its effective bucket, after the variant / focus / colour narrowing of filter 1 */
function variantPool(slot, eb, E, relax) {
  const { model } = E;
  let pool = model.bySlot(eb);
  if (eb === 'ISO_SIDE_REAR_DELT' && slot.variant) {
    // relaxed (same pattern, other implement): a side / front station may take any delt isolation (e.g. floor Y / T
    // raises with no dumbbells); a rear station always stays rear (rear-delt own sets, R2-VOL-04)
    const cls = relax && slot.variant !== 'rear' ? ['ISO_SIDE', 'ISO_REAR', 'FACEPULL', 'ISO_FRONT']
      : ({ side: ['ISO_SIDE'], rear: ['ISO_REAR', 'FACEPULL'], front: ['ISO_FRONT'] }[slot.variant] || null);
    if (cls) pool = pool.filter((e) => cls.includes(e.credit_class));
    // INFERRED guard (CONTRACT_REQUESTS B3): 02 marks some front raises delt_head 'rear' -> ISO_REAR; never a rear-delt pick
    if (slot.variant === 'rear') pool = pool.filter((e) => !/front-raise/.test(e.id));
  }
  if (eb === 'AP_TRIPLE_EXT') {
    const v = slot.variant;
    const fam = (e) => e.athletic && e.athletic.olympic_family;
    // V19: clean station -> clean / loaded jump; snatch station -> snatch / swing; a jerk-family lift fits any station
    // (relaxed step only, when the kit / pain / level leaves nothing of the day's own family)
    if (v === 'clean') pool = pool.filter((e) => (relax ? ['clean', 'loaded_jump', 'jerk'] : ['clean', 'loaded_jump']).includes(fam(e)));
    else if (v === 'snatch') pool = pool.filter((e) => (relax ? ['snatch', 'swing', 'jerk'] : ['snatch']).includes(fam(e)));
    else if (v === 'swing') pool = pool.filter((e) => fam(e) === 'swing');
    else if (v === 'jerk') pool = pool.filter((e) => !!fam(e));
    else pool = pool.filter((e) => !!fam(e));
  }
  if (eb === 'AP_PLYO') {
    const upper = (e) => e.tags.includes('push_up_floor') || UPPER_PLYO_RE.test(e.id);
    pool = pool.filter((e) => (slot.variant === 'upper' ? upper(e) : !upper(e)));
  }
  if (bucketKind(model, eb) === 'focus') {
    const m = slot.focus_muscle;
    if (!m) return [];
    pool = pool.filter((e) => e.primary_muscle === m || (e.credit_class === 'DIPS' && m === 'triceps'));
  }
  if (eb === 'COND_AEROBIC' && slot.aerobic) pool = pool.filter((e) => e.conditioning && e.conditioning.colour === slot.aerobic.colour);
  if (eb === 'COND_SPRINT_BUYOUT' && E.R.conditioning.buyout_pool) {
    // the buy-out is a conditioning finisher (OBSERVED BASEBALL Part E: 1-3 bouts of 10-20 cal or 15-30 s runs), never a
    // max-velocity sprint, an acceleration or an A-drill after the lifting (ORD-03, LIB-21, ORD-08; review 02 major 1)
    const BP = E.R.conditioning.buyout_pool;
    const inc = new RegExp(BP.include_ids_re || 'calorie|buy-out|fast-run'), exc = new RegExp(BP.exclude_ids_re || 'max-velocity|acceleration|falling-start|a-march|a-skip|a-runs|mach-sprint|high-knee');
    const extra = model.bySlot('COND_CIRCUIT').filter((e) => inc.test(e.id));
    pool = [...pool, ...extra.filter((e) => !pool.includes(e))].filter((e) => inc.test(e.id) && !exc.test(e.id));
  }
  return pool;
}

/**
 * Hard filters 2-8 (filter 1 = pool, 9 = second exposure and 10-11 = fallbacks are applied by the caller).
 * @returns {{ok:boolean, step:string|null, area?:string}}
 */
function hardFilter(ex, slot, eb, E, spine) {
  const { R, model } = E;
  const tags = ex.tags;
  const bk = bucketKind(model, eb);
  // 2. kit (+ bumpers for lifts from the floor, ATH-10)
  if (!model.kitAvailable(ex, E.kitObj)) return { ok: false, step: 'kit' };
  if (tags.includes('olympic_from_floor') && !E.kitObj.tokens.has('barbell_bumpers_platform')) return { ok: false, step: 'kit' };
  // 3. never: v-squat, band words (H01), KB swings / wall balls never in a resistance slot (D-12)
  if (R.equipment.never_exercise_tags.some((t) => tags.includes(t)) || /\bv[- ]?squat\b/i.test(ex.id)) return { ok: false, step: 'never' };
  if (/\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i.test(ex.id)) return { ok: false, step: 'never' };
  if (['resistance', 'isolation', 'focus'].includes(bk) && R.credit.never_credit_tags.some((t) => tags.includes(t))) return { ok: false, step: 'never' };
  if (['resistance', 'isolation', 'focus'].includes(bk) && ex.is_athletic) return { ok: false, step: 'never' };
  // 4. age rules
  const O = R.population.older; // R3-pending: R3-ATH-02
  if (E.older) {
    if (O.never_tags.some((t) => tags.includes(t))) return { ok: false, step: 'older' };
    if (O.never_tags_phase0_even_with_opt_in.some((t) => tags.includes(t))) return { ok: false, step: 'older' }; // D-05
    if (!E.optIn) {
      if (PLYO_BUCKETS.includes(eb)) { // C-11: landing drills only by default (low impact)
        if (!(ex.athletic && ex.athletic.quality === 'landing' && ex.older_opt_in_ok && !tags.includes('high_impact'))) return { ok: false, step: 'older' };
      } else if (!ex.older_ok) return { ok: false, step: 'older' };
    } else if (!ex.older_opt_in_ok) return { ok: false, step: 'older' };
  }
  if (E.highVolume && [...O.never_tags, ...O.never_tags_phase0_even_with_opt_in].some((t) => tags.includes(t))) return { ok: false, step: 'older' }; // EQ-03 injured / high-volume
  if (E.racket50 && !E.optIn && R.population.active_aging_50.avoid_tags_unless_opt_in.some((t) => tags.includes(t))) return { ok: false, step: 'age_50' }; // R3-pending: R3-ATH-02
  if (E.youth) {
    if (E.ladderOrder.indexOf(ex.level) > E.ladderOrder.indexOf(R.levels.youth_max_ladder)) return { ok: false, step: 'youth' };
    if (tags.includes('olympic_from_floor') && !(E.age >= R.olympic.youth_floor_min_age && tags.includes('youth_floor_ok') &&
      (E.derived.previous_cycles && E.derived.previous_cycles.count >= 1))) return { ok: false, step: 'youth' }; // D-41
  }
  // Olympic tier by level (ATH-10, V19): L1 tier for L1 and for L2 in exercise block 1
  if (eb === 'AP_TRIPLE_EXT' && ex.athletic && ex.athletic.olympic_tier === 'L2_plus') {
    if (E.lvl === 'L1' || (E.lvl === 'L2' && E.exerciseBlock === 1)) return { ok: false, step: 'level' };
  }
  // 4b. sport profile plyo rules (review 01 major 3: no depth jumps / bounds / hurdle hops for a class-5 swimmer; 08 blocker)
  if (PLYO_BUCKETS.includes(eb) && E.plyoRules && (E.plyoRules.exclude_tags || []).some((t) => tags.includes(t))) return { ok: false, step: 'profile' };
  // a landing (stick) drill is the Receive stage only: from RC2 on the station takes a jump that can be done 'land & go' or
  // repeated (R2-ATH-03, CAT-10; review 01 / 02 / 03 / 08); older default (landing drills only) keeps them
  if (PLYO_BUCKETS.includes(eb) && R.athletic.landing_rc1_only && ex.athletic && ex.athletic.quality === 'landing' && E.stage !== 'RC1' && !(E.older && !E.optIn)) return { ok: false, step: 'stage' };
  // a near-maximal eccentric is never a Focus filler or a timed circuit station (review 06 major 4, review 05)
  if ((bk === 'focus' || slot.block === 'circuit' || slot.circuit) && /nordic/.test(ex.id)) return { ok: false, step: 'never' };
  // 5. pain (VOL-03, R2-LIB-03)
  const region = slotRegion(slot, eb, model);
  for (const p of E.pain) {
    const a = R.volume.pain.areas[p.area];
    if (a && touches(p.area, region)) {
      if (a.avoid_tags.some((t) => tags.includes(t))) return { ok: false, step: 'pain', area: p.area };
      if (a.max_axial_class && AXIAL_RANK[ex.axial_class] > AXIAL_RANK[a.max_axial_class]) return { ok: false, step: 'pain', area: p.area };
    }
    for (const w of p.worse_with || []) {
      const ww = R.volume.pain.worse_with[w];
      if (!ww) continue;
      if (ww.avoid_tags && ww.avoid_tags.some((t) => tags.includes(t))) return { ok: false, step: 'pain', area: p.area };
      if (ww.max_axial_class && AXIAL_RANK[ex.axial_class] > AXIAL_RANK[ww.max_axial_class]) return { ok: false, step: 'pain', area: p.area };
      if (ww.avoid_planes_in_core_and_throws && (bk === 'core' || eb === 'AP_THROW') && ww.avoid_planes_in_core_and_throws.includes(ex.plane)) return { ok: false, step: 'pain', area: p.area };
      if (ww.avoid_buckets && ex.athletic && ['sprint', 'cod'].includes(ex.athletic.quality)) return { ok: false, step: 'pain', area: p.area };
    }
  }
  // 6. exclusions (F38)
  for (const x of E.derived.exclusions || []) {
    if (x === 'barbell' && tags.includes('barbell')) return { ok: false, step: 'exclusion' };
    if (x === 'lunges' && ex.pattern === 'UKD' && /lunge/.test(ex.id)) return { ok: false, step: 'exclusion' };
    if (x === 'overhead_pressing' && tags.includes('overhead')) return { ok: false, step: 'exclusion' };
    if (x === 'floor_work' && ((bk === 'core' && FLOOR_CORE_RE.test(ex.id)) || tags.includes('push_up_floor'))) return { ok: false, step: 'exclusion' };
    if (x === 'machines' && (tags.includes('machine') || ex.equipment.machine)) return { ok: false, step: 'exclusion' };
    if (x === 'running' && ex.athletic && ['sprint', 'cod'].includes(ex.athletic.quality)) return { ok: false, step: 'exclusion' };
    if (x === 'jumping' && ex.athletic && ['plyometric', 'ballistic', 'landing'].includes(ex.athletic.quality) && ex.athletic.count_unit === 'contacts') return { ok: false, step: 'exclusion' };
  }
  // 7. medball: aesthetics main work never (H11, ATH-05); loads within the ball the client owns (<= 20 lb)
  if (E.goal === 'muscle' && bk !== 'warmup' && (tags.includes('medball') || tags.includes('aesthetics_warmup_only'))) return { ok: false, step: 'medball' };
  if (ex.medball) {
    if (ex.medball.min_lb > R.medball.max_lb) return { ok: false, step: 'medball' };
    const owned = E.kit.medball_max_lb;
    if (owned != null && ex.medball.min_lb > owned) return { ok: false, step: 'medball' };
  }
  // 8. two spine days (H07): counted lifts only on the station marked axial, once per pattern a week, never both on one day
  if (ex.axial) {
    if (!spine || slot.axial_req !== 'axial' || !LOWER_RP.includes(eb)) return { ok: false, step: 'spine' };
    const pat = ex.axial_pattern;
    if (spine.used[pat]) return { ok: false, step: 'spine' }; // one counted lift per pattern a week
    const other = pat === 'squat' ? 'hinge' : 'squat';
    if (spine.used[other] && spine.used[other] === spine.weekday) return { ok: false, step: 'spine' };
  }
  return { ok: true, step: null };
}

// ------------------------------------------------------------------------------------------------------------------
// scoring
// ------------------------------------------------------------------------------------------------------------------

function isDefaultPick(ex, eb, E) {
  return E.model.isDefaultIn(ex, eb) || (eb === 'AP_TRIPLE_EXT' && E.preferIds.has(ex.id));
}

// implement class of an exercise (implement ladder by level, second-of-group variety, squat vs hinge implement)
function implementOf(ex) {
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

/** plyo direction from the record id (INFERRED; the 04 direction_pct split) */
function directionOf(ex) {
  if (/lateral|side|zig-zag|skater|cossack/.test(ex.id)) return 'lateral';
  if (/broad|forward|bound|hurdle|zig|backward/.test(ex.id)) return 'horizontal';
  return 'vertical';
}
const ANTI_CORE_RE = /(plank|pallof|dead-bug|bird-dog|hollow|suitcase|offset|anti)/;

function scoreOf(ex, slot, eb, E, st, day) {
  const { R, model } = E;
  const w = R.selection.weights;
  const tags = ex.tags;
  const reasons = [];
  let s = 0;
  const bk = bucketKind(model, eb);
  if (isDefaultPick(ex, eb, E)) { s += w.default_in_slot; reasons.push(why('why.default_pick', 'CAT-07')); }
  // R2-LIB-01 / R2-LIB-07: library exercises are the main pick; program-only and reference-only records are swaps (v1.2)
  if (typeof w.live_library === 'number' && !(R.selection.swap_only_statuses || []).includes(ex.status)) s += w.live_library;
  // 'Calf Raise - any', 'Bent-Over Row' (implement not stated): swaps, never the default (FIX-03 / FIX-04; review 01 / 02 / 04 / 05)
  if (typeof w.not_stated_or_any === 'number' && E.genericRe.some((re) => re.test(ex.id))) s += w.not_stated_or_any;
  // equipment preference (F29b, EQ-10)
  const pref = E.derived.equipment_preference;
  const setupHas = (tok) => ex.equipment.any_of.some((su) => su.includes(tok));
  if ((pref === 'machines' && (tags.includes('machine') || ex.equipment.machine)) ||
      (pref === 'free_weights' && (tags.includes('barbell') || setupHas('dumbbell') || setupHas('kettlebell'))) ||
      (pref === 'dumbbells' && setupHas('dumbbell'))) { s += w.preference_match; reasons.push(why('why.preference', 'EQ-10')); }
  // constraint band (EQ-13); athletes' horizontal press / row may be a barbell or DB bench / row (review 02 blocker 2)
  let band = ['isolation', 'focus', 'prehab', 'core'].includes(bk) ? E.band.iso : E.band.main;
  const APB = R.selection.athlete_press_band;
  if (APB && E.clientFamily === 'athlete' && APB.buckets.includes(eb)) band = [Math.min(band[0], APB.band[0]), Math.max(band[1], APB.band[1])];
  // a pain region moves the band up (machines / supported positions, master 8.3 pain flag; review 08 blocker 4)
  const region = slotRegion(slot, eb, model);
  if (band && isNum(R.volume.pain.constraint_bump) && E.pain.some((p) => touches(p.area, region))) band = [Math.min(5, band[0] + R.volume.pain.constraint_bump), Math.min(5, band[1] + R.volume.pain.constraint_bump)];
  if (band && ['resistance', 'isolation', 'focus', 'prehab', 'core'].includes(bk)) {
    if (ex.constraint >= band[0] && ex.constraint <= band[1]) { s += w.constraint_in_band; reasons.push(why('why.constraint_band', 'EQ-13')); }
    else s += w.constraint_distance * (ex.constraint < band[0] ? band[0] - ex.constraint : ex.constraint - band[1]);
  }
  // soft ladder (CAT-05); v1.2: above the client's level costs more (review 05 / 08: advanced rows for an L1)
  const over = E.ladderOrder.indexOf(ex.level) - E.ladderOrder.indexOf(E.ladder);
  if (over > 0) s += (typeof w.above_level === 'number' ? w.above_level : w.over_ladder_step) * over;
  // implement ladder by level (EQ-09: bodyweight -> DB -> barbell as level rises, within the kit; review 05)
  const IL = R.selection.implement_ladder_by_level;
  if (IL && typeof w.implement_ladder === 'number' && ['resistance', 'isolation'].includes(bk)) {
    const list = IL[E.lvl] || [];
    const i = list.indexOf(implementOf(ex));
    if (i >= 0 && i <= 1) s += w.implement_ladder;
  }
  // assisted variants for experienced lifters, home substitutes in a gym that has the real thing (review 07)
  if (typeof w.assisted_l2_l3 === 'number' && tags.includes('assisted') && ['L2', 'L3'].includes(E.lvl) && !E.older && E.clientFamily !== 'older_or_pain') s += w.assisted_l2_l3;
  if (typeof w.home_substitute === 'number' && tags.includes('home_substitute')) {
    const need = (R.selection.home_substitute_kit || {})[ex.id] || [];
    if (need.some((t) => E.kitObj.tokens.has(t))) s += w.home_substitute;
  }
  // sport hot spots (review 01 major 8: swimmer's shoulder - no upright rows / standing overhead presses by default)
  if (E.hot && typeof w.hotspot_avoid === 'number') {
    if ([...E.hot.avoid_tags].some((t) => tags.includes(t)) || E.hot.avoid_re.some((re) => re.test(ex.id))) { s += w.hotspot_avoid; }
    if ([...E.hot.prefer_tags].some((t) => tags.includes(t)) || E.hot.prefer_re.some((re) => re.test(ex.id))) { s += w.hotspot_prefer; reasons.push(why('why.hotspot', 'D-23')); }
  }
  // pain preferences (prefer tags, constraint bias, external rotation bias) on slots the area touches
  for (const p of E.pain) {
    const a = R.volume.pain.areas[p.area];
    if (!a || !touches(p.area, region)) continue;
    for (const t of a.prefer_tags) if (tags.includes(t)) s += w.pain_prefer_tag;
    const cb = R.volume.pain.constraint_bias;
    if (cb && ex.constraint >= cb[0] && ex.constraint <= cb[1]) s += w.pain_prefer_tag;
    if (p.area === 'shoulder' && ex.rotation_bias === 'external') s += w.pain_prefer_tag / 2; // INFERRED (R2-LIB-03)
  }
  // machine / skill penalties by client family
  if (tags.includes('machine') || ex.equipment.machine) s += w.machine_pen_scale * (E.band.machine_pen || 0);
  const skillLvl = ex.skill === 'high' ? 1 : ex.skill === 'moderate' ? 0.5 : 0;
  s += w.skill_pen_scale * (E.band.skill_pen || 0) * skillLvl;
  // continuity with the previous exercise block (PER-02)
  const prev = E.prev && E.prev.fills && E.prev.fills[slot.slot_id];
  if (prev && prev.exercise_id === ex.id) { s += w.continuity; reasons.push(why('why.continuity', 'PER-02')); }
  // the template station's own words ('single-leg glute bridge', 'nordic curls', 'HEAVY single-arm row', 'DUBS' ...)
  if (typeof w.station_note === 'number' && (slot.note_tokens || []).some((t) => ex.id.includes(t) || tags.includes(t))) { s += w.station_note; reasons.push(why('why.station_note', 'OBSERVED')); }
  // sport use
  if ((ex.sport_use || []).some((u) => E.sportWords.has(String(u).toLowerCase().replace(/_/g, ' ')))) s += w.sport_use_match;
  // older preferred
  if ((E.older || E.clientFamily === 'older_or_pain') && tags.includes('older_preferred')) s += w.older_preferred;
  // prime mover is a steered muscle (credit-only muscles are never steered, C-15 / D-07) - INFERRED weight 1
  const offGroup = !!(slot.group && model.bucket(eb).group && slot.group !== model.bucket(eb).group);
  if (['resistance', 'isolation'].includes(bk) && ex.primary_muscle && !offGroup) {
    const f = E.fill[ex.primary_muscle];
    if (f === 'target' || f === 'own_sets') s += 1;
  }
  // spine: the station marked axial carries the week's counted lift; other squat / hinge slots prefer non-counted
  if (LOWER_RP.includes(eb)) {
    if (slot.axial_req === 'axial' && ex.axial) { s += 3; reasons.push(why('why.axial_first', 'R2-SES-02', { pattern: ex.axial_pattern })); } // INFERRED weight
    if (slot.axial_req && slot.axial_req !== 'axial' && ex.spine_class === 'not_counted') s += 1;
    // the week's counted squat and hinge do not share the implement (review 01 minor: hex squat + hex deadlift)
    if (R.selection.squat_implement_differs_from_hinge && ex.axial && slot.axial_req === 'axial' && st.spineImpl && st.spineImpl.impl === implementOf(ex) && st.spineImpl.pattern !== ex.axial_pattern) s -= 3;
  }
  // core: plane rotation across the week, transverse for rotational groups; anti-extension / anti-rotation first when the sport
  // profile asks for it, and holds vs reps by its plane split (review 01 / 08 core findings)
  if (bk === 'core') {
    const rot = R.core_block.plane_rotation;
    const di = slot.day_index != null ? slot.day_index : 0;
    if (ex.plane === rot[di % rot.length]) s += 1;
    if (E.sport && (E.sport.rotational_core || R.core_block.rotational_profiles_groups.includes(E.sport.ath03_group)) && ex.plane === 'transverse') s += 1;
    const cr = E.sport && E.sport.core_rules;
    if (cr && cr.anti_first && ANTI_CORE_RE.test(ex.id)) s += 2;
    if (cr && cr.plane_pct) {
      const pp = cr.plane_pct[ex.plane] || 0;
      const used = st.corePlanes[ex.plane] || 0, tot = Object.values(st.corePlanes).reduce((a, b) => a + b, 0) || 0;
      if (pp / 100 > (tot ? used / tot : 0)) s += 1.5;
    }
    if ((st.coreFlex.get(weekdayOfSlot(slot)) || 0) >= 1 && /(sit-up|crunch|v-up|leg-raise|knees-to|toes-to)/.test(ex.id)) s -= 1.5; // not all trunk flexion
  }
  // frontal / transverse unilateral lower work for court / field COD profiles (UNI-12; v1.2 quota from the profile share)
  if (['RP_UKD', 'RP_UHD'].includes(eb) && E.sport && E.sport.frontal_transverse_share >= (R.frontal_transverse.min_share_to_apply ?? R.frontal_transverse.court_combat_share[0]) - EPS) {
    const share = st.ft.n ? st.ft.k / st.ft.n : 0;
    if (share < E.sport.frontal_transverse_share && ['frontal', 'transverse', 'multi'].includes(ex.plane)) { s += (typeof w.frontal_quota === 'number' ? w.frontal_quota : 1); reasons.push(why('why.frontal_plane', 'UNI-12')); }
  }
  // stations written with contra / ipsi loading (05 'contralateral for COD athletes ...') prefer a DB / KB-loadable
  // single-leg pick so the loading cue applies (CAT-13) - INFERRED weight
  if (slot.loading && ['RP_UKD', 'RP_UHD'].includes(eb) && E.sport && ['contralateral', 'ipsilateral', 'both'].includes(E.sport.contra_ipsi) &&
      ex.equipment.any_of.some((su) => su.includes('dumbbell') || su.includes('kettlebell'))) s += 1.5;
  // upper bilateral share (UNI-02); v1.2 the share is enforced at selection (review 03)
  if (UPPER_RP.includes(eb) && E.upperTarget != null) {
    const cur = st.upper.tot ? st.upper.bil / st.upper.tot : 0;
    const wantBil = cur < E.upperTarget;
    const isBil = ex.laterality === 'bilateral';
    if (wantBil === isBil) s += R.bilateral_share.selection_enforced ? 2 : 1;
  }
  if (LOWER_RP.includes(eb) && E.lowerTarget != null && R.bilateral_share.selection_enforced && !slot.laterality_dial && slot.role !== 'work') {
    const cur = st.lower.tot ? st.lower.bil / st.lower.tot : 0;
    if ((cur < E.lowerTarget) === (ex.laterality === 'bilateral')) s += 1.5;
  }
  // athletic: plyo / ballistic share and Receive-Create stage (R2-ATH-01, R2-ATH-03)
  if (ex.athletic && CONTACT_BUCKETS.includes(eb)) {
    const q = ex.athletic.quality;
    if (E.plyoTarget != null && eb !== 'AP_THROW') {
      const sets = baseSets(slot, E.minutes);
      const target = E.plyoTarget * st.plyo.week_total;
      const wantPlyo = st.plyo.plyo + sets <= target + sets / 2 + EPS;
      if ((q === 'plyometric') === wantPlyo) { s += 2; reasons.push(why('why.plyo_share', 'R2-ATH-01', { pct: Math.round(E.plyoTarget * 100) })); }
    }
    const stage = E.stage;
    if (eb === 'AP_JUMP_LIMITED_KNEE') {
      // the low-amplitude ankle block (bone loading, Achilles, ankle sprains) is the same drill in every stage: in-place ankle /
      // pogo hops, bilateral first (04 tracks 'JUMPING ANKLE'; R2-ATH-08 'low ankle hops'; review 01 / 08)
      if (tags.includes('ankle_hop')) s += 3;
      if (ex.laterality === 'bilateral') s += 1;
    } else {
      const sq = R.athletic.stages.stage_qualities[stage] || [];
      s += sq.includes(q) ? 1 : -1;
      const r = RC_RANK[ex.athletic.rc_stage_default];
      if (r && RC_RANK[stage]) { if (r > RC_RANK[stage]) s -= 3; else if (r === RC_RANK[stage]) s += 1; }
    }
    // RC3 'Repeat' needs a repeated-contact drill (hops, pogos, hurdle hops, bounds), never a single depth drop (review 02 / 03)
    if (stage === 'RC3' && eb === 'AP_PLYO') s += tags.includes('plyo_repeated') ? 2 : -2;
    // the sport's jump directions (04 direction_pct; review 01 / 08: no lateral plate hops for a 5 % lateral swimmer)
    const dp = E.plyoRules && E.plyoRules.direction_pct;
    if (dp && eb !== 'AP_THROW' && typeof w.direction_match === 'number') s += w.direction_match * ((dp[directionOf(ex)] || 0) / 100) * 2 - w.direction_match / 2;
    // bilateral before single-leg inside a stage (CAT-10), and the kit's own implements (hurdles, EQ-16)
    if (eb !== 'AP_THROW' && ex.laterality !== 'bilateral' && stage === 'RC1') s -= 1;
    if (tags.includes('hurdle_hop') && E.kitObj.tokens.has('hurdles')) s += 0.5;
    // the throw planes of the sport (04 throwing.plane_pct; rotational station for racket / swim, review 01 / 08)
    if (eb === 'AP_THROW' && E.sport && E.sport.throw_plane_pct) {
      const tp = E.sport.throw_plane_pct;
      const used = st.throwPlanes[ex.plane === 'transverse' ? 'transverse' : 'sagittal'] || 0;
      if ((tp[ex.plane === 'transverse' ? 'transverse' : 'sagittal'] || 0) >= 50 || used === 0) s += 1.5;
    }
  }
  // Olympic: profile preference, L2+ scope from block 2 for L2 and always for L3 (ATH-10); v1.2: from there pulls are the
  // second item only, the catch lifts lead (review 04 major 6)
  if (eb === 'AP_TRIPLE_EXT' && ex.athletic) {
    if (E.preferIds.has(ex.id)) s += 3;
    const l2plusAllowed = E.lvl === 'L3' || (E.lvl === 'L2' && E.exerciseBlock > 1);
    if (l2plusAllowed && ex.athletic.olympic_tier === 'L2_plus') { s += 3; reasons.push(why('why.olympic_level', 'ATH-10')); }
    if (l2plusAllowed && /pull/.test(ex.id) && !E.preferIds.has(ex.id)) s -= 3;
    if (st.olyUsed.has(ex.id)) s -= 2; // vary the Olympic lift across the week
  }
  // a station serving another group than its bucket's (e.g. the PPL push day's triceps press) prefers lifts that credit
  // that group at >= 0.5 (dips, close-grip work) - INFERRED weight
  if (offGroup && model.groupMembers(slot.group).some((m) => (ex.credits[m] || 0) >= 0.5)) s += 4;
  // Focus: isolation or constraint >= 4 preferred
  if (bk === 'focus' && (ex.exercise_class === 'isolation' || ex.constraint >= 4)) s += 1;
  // main lifts must be loadable: the stairway progresses by sets and load ('changes.load_up' at cap), so a press / row /
  // squat that takes added load beats a push-up variant (INFERRED weights; CONTRACT_REQUESTS B3)
  if (bk === 'resistance' && ['athlete', 'strength', 'hypertrophy', 'general'].includes(E.clientFamily) &&
      ['work', 'paired_upper', 'secondary', 'secondary_upper', 'accessory'].includes(slot.role)) {
    s += ex.load_ceiling === 'high' ? 2.5 : ex.load_ceiling === 'moderate' ? 2 : -1.5;
  }
  // the work lift: bilateral, canonical, loadable for class-model / strength / physique clients (ORD-02 / ORD-07 / CAT-13;
  // review 04 major 3, 07 major 6); athletes with a strength resistance goal get a loaded bench (review 02 blocker 2)
  const WB = R.selection.work_bilateral_canonical;
  if (WB && slot.role === 'work' && bk === 'resistance' && (WB.families.includes(E.family) || WB.goals.includes(E.goal))) {
    if (ex.laterality !== 'bilateral') s += (typeof w.uni_as_work_bb === 'number' ? w.uni_as_work_bb : -6);
    if (E.family === 'hybrid_crossfit' && implementOf(ex) === 'barbell') s += 2;
  }
  // a hinge or squat work lift stays a loaded hinge / squat after a laterality flip: a glute bridge (GLUTE_ISO) is never the
  // day's work (ORD-07 'the work' = the main lift; random-corpus H21 sets_drop at a block boundary, v1.2)
  if (slot.role === 'work' && ['RP_BHD', 'RP_UHD', 'RP_BKD', 'RP_UKD'].includes(eb) && ex.credit_class === 'GLUTE_ISO' && !(E.priority || []).includes('glutes')) s -= 6;
  if (E.clientFamily === 'athlete' && E.sport && E.sport.resistance_goal === 'strength' && eb === 'RP_HPUSH' && ex.credit_class === 'HPUSH' && ex.load_ceiling === 'high' && !tags.includes('push_up_floor')) s += 2;
  if (E.clientFamily === 'athlete' && eb === 'RP_HPUSH' && ex.credit_class === 'DIPS' && st.dipsUsed) s -= 3;
  // a bent-over barbell row next to the week's heavy axial lift keeps the low back loaded (UNI-11, master 10.6; review 06)
  if (typeof w.bent_over_barbell_on_axial_day === 'number' && eb === 'RP_HPULL' && tags.includes('bent_over') && implementOf(ex) === 'barbell' && day && daySlots(day).some((x) => x.axial_req === 'axial' && x.role === 'work')) s += w.bent_over_barbell_on_axial_day;
  // the second exercise of a group on a day differs in pattern, implement, grip or laterality (R2-SES-05 'different
  // exercises', VOL-07; review 03 / 07 minors: two reverse flies, two lat pulldowns, two leg extensions)
  const wd = weekdayOfSlot(slot);
  const g = slot.group || (ex.primary_muscle ? model.groupOf(ex.primary_muscle) : null);
  const mates = (st.dayPicks.get(wd) || []).filter((x) => x.group && x.group === g);
  for (const mt of mates) {
    if (mt.ex.credit_class === ex.credit_class && implementOf(mt.ex) === implementOf(ex) && mt.ex.laterality === ex.laterality) s -= 3;
    const stem = (id) => id.split('-').slice(0, 2).join('-');
    if (stem(mt.ex.id) === stem(ex.id)) s -= 2;
  }
  return { score: Math.round(s * 1000) / 1000, reasons };
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

function rank(list, slot, E) {
  return list.map((c) => ({ ...c, tb: tieBreak(E.seed, slot.slot_id, c.ex.id) }))
    .sort((a, b) => b.score - a.score || a.tb - b.tb || (a.ex.id < b.ex.id ? -1 : a.ex.id > b.ex.id ? 1 : 0));
}

// ------------------------------------------------------------------------------------------------------------------
// week state
// ------------------------------------------------------------------------------------------------------------------

function newState(layout, E) {
  let weekTotal = 0;
  if (layout) for (const d of layout.days) for (const s of daySlots(d)) if (CONTACT_BUCKETS.includes(s.bucket)) weekTotal += baseSets(s, E.minutes);
  return { usedByBucket: new Map(), usedByDay: new Map(), spine: { squat: null, hinge: null },
    plyo: { plyo: 0, week_total: weekTotal }, upper: { bil: 0, tot: 0 }, lower: { bil: 0, tot: 0 }, contra: { n: 0, c: 0 }, ft: { n: 0, k: 0 },
    dayPicks: new Map(), usedWeek: new Set(), spineImpl: null, olyUsed: new Set(), corePlanes: {}, coreFlex: new Map(), throwPlanes: {}, dipsUsed: false };
}

function weekdayOfSlot(slot) { return String(slot.slot_id).split('.')[0]; }
const wdOf = weekdayOfSlot;

function record(st, slot, fill, ex, E) {
  if (!ex) return;
  const wd = weekdayOfSlot(slot);
  const b = fill.bucket;
  if (!st.usedByBucket.has(b)) st.usedByBucket.set(b, new Set());
  st.usedByBucket.get(b).add(ex.id);
  if (!st.usedByDay.has(wd)) st.usedByDay.set(wd, new Set());
  st.usedByDay.get(wd).add(ex.id);
  if (ex.axial && slot.axial_req === 'axial') { st.spine[ex.axial_pattern] = wd; if (!st.spineImpl) st.spineImpl = { impl: implementOf(ex), pattern: ex.axial_pattern }; }
  const sets = baseSets(slot, E.minutes);
  if (ex.athletic && CONTACT_BUCKETS.includes(b) && ex.athletic.quality === 'plyometric') st.plyo.plyo += sets;
  if (UPPER_RP.includes(b)) { st.upper.tot += sets; if (ex.laterality === 'bilateral') st.upper.bil += sets; }
  if (LOWER_RP.includes(b) && ex.credit_class !== 'GLUTE_ISO') { st.lower.tot += sets; if (ex.laterality === 'bilateral') st.lower.bil += sets; }
  if (['RP_UKD', 'RP_UHD'].includes(b)) { st.ft.n++; if (['frontal', 'transverse', 'multi'].includes(ex.plane)) st.ft.k++; }
  const kind = E.model.bucket(b).kind;
  if (!st.dayPicks.has(wd)) st.dayPicks.set(wd, []);
  st.dayPicks.get(wd).push({ group: slot.group || (ex.primary_muscle ? E.model.groupOf(ex.primary_muscle) : null), ex });
  if (kind !== 'warmup') st.usedWeek.add(ex.id);
  if (b === 'AP_TRIPLE_EXT') st.olyUsed.add(ex.id);
  if (kind === 'core') { st.corePlanes[ex.plane] = (st.corePlanes[ex.plane] || 0) + 1; if (/(sit-up|crunch|v-up|leg-raise|knees-to|toes-to)/.test(ex.id)) st.coreFlex.set(wd, (st.coreFlex.get(wd) || 0) + 1); }
  if (b === 'AP_THROW') { const k = ex.plane === 'transverse' ? 'transverse' : 'sagittal'; st.throwPlanes[k] = (st.throwPlanes[k] || 0) + 1; }
  if (ex.credit_class === 'DIPS') st.dipsUsed = true;
}

// ------------------------------------------------------------------------------------------------------------------
// laterality (UNI-02) and the home second squat (axial.home_second_squat)
// ------------------------------------------------------------------------------------------------------------------

function lexLess(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
}

function decideLaterality(layout, E) {
  const { R } = E;
  const out = new Map();
  if (!layout) return out;
  const sib = R.bilateral_share.siblings;
  const lowerSlots = [];
  for (const d of layout.days) for (const s of daySlots(d)) if (R.bilateral_share.regions.lower.includes(s.bucket)) lowerSlots.push(s);
  const machinesOk = SQUAT_MACHINES.some((m) => (E.kitObj.machines || []).includes(m));
  const hasCounted = lowerSlots.some((s) => s.axial_req === 'axial' && s.bucket === 'RP_BKD');
  for (const s of lowerSlots) {
    if (!s.laterality_dial && s.bucket === 'RP_BKD' && hasCounted && !machinesOk && R.axial.home_second_squat === 'unilateral' &&
        (s.axial_req === 'non_axial' || s.axial_req === 'light_or_non_axial') && s.role !== 'work') out.set(s.slot_id, sib.RP_BKD);
  }
  if (E.lowerTarget == null) return out;
  const isBil = (b) => b === 'RP_BKD' || b === 'RP_BHD';
  let fixBil = 0, fixUni = 0;
  const dial = [];
  for (const s of lowerSlots) {
    const n = baseSets(s, E.minutes);
    if (s.laterality_dial) { dial.push({ s, n }); continue; }
    const b = out.get(s.slot_id) || s.bucket;
    if (isBil(b)) fixBil += n; else fixUni += n;
  }
  if (!dial.length) return out;
  const tol = R.bilateral_share.tolerance;
  const evalMask = (mask) => {
    let bil = fixBil, tot = fixBil + fixUni, axialFlips = 0, flips = 0;
    dial.forEach((d, i) => {
      const flip = (mask >> i) & 1;
      const bilNow = flip ? !isBil(d.s.bucket) : isBil(d.s.bucket);
      tot += d.n; if (bilNow) bil += d.n;
      if (flip) { flips++; if (d.s.axial_req === 'axial') axialFlips++; }
    });
    const dev = Math.max(0, Math.abs((tot ? bil / tot : 0) - E.lowerTarget) - tol);
    return { dev: Math.round(dev * 1e9) / 1e9, axialFlips, flips };
  };
  const k = Math.min(dial.length, 12);
  let best = null;
  for (let mask = 0; mask < (1 << k); mask++) {
    const r = evalMask(mask);
    // prefer: closest share; keep the counted (axial) stations; fewer flips; flip later slots first
    const revMask = parseInt(mask.toString(2).padStart(k, '0').split('').reverse().join(''), 2);
    const key = [r.dev, r.axialFlips, r.flips, -revMask];
    if (!best || lexLess(key, best.key)) best = { mask, key };
  }
  dial.forEach((d, i) => { if ((best.mask >> i) & 1) out.set(d.s.slot_id, sib[d.s.bucket]); });
  return out;
}

// ------------------------------------------------------------------------------------------------------------------
// one slot
// ------------------------------------------------------------------------------------------------------------------

function emptyFill(slot, eb) {
  return { slot_id: slot.slot_id, bucket: eb, exercise_id: null, detail: null, swaps: [], laterality: null, loading: null, why: [], flags: [] };
}

function needsFill(slot, model) {
  const k = model.bucket(slot.bucket).kind;
  if (slot.role === 'cooldown') return false;
  if (slot.bucket === 'WARMUP_GENERAL') return false;
  return k !== 'test';
}

function warmupFill(slot, day, E) {
  const { R, model } = E;
  const f = emptyFill(slot, slot.bucket);
  f.why.push(why('why.warmup', 'ORD-08'));
  const lower = (day && day.lower_focus) || E.family === 'athletic';
  const ids = lower ? R.warmup.lower_or_athletic_drills : R.warmup.press_day_mobility;
  const ok = ids.filter((id) => model.hasEx(id)).map((id) => model.ex(id)).filter((ex) => hardFilter(ex, slot, slot.bucket, E, null).ok);
  if (ok.length) { f.exercise_id = ok[0].id; f.laterality = ok[0].laterality; f.swaps = ok.slice(1, 4).map((e) => e.id); return f; }
  if (lower && R.warmup.aesthetics_medball_warmup_allowed && E.goal === 'muscle') { // ATH-05: the only medball use for aesthetics
    const mb = model.bySlot('WARMUP_PREP').filter((ex) => ex.tags.includes('medball') && hardFilter(ex, slot, slot.bucket, E, null).ok);
    const ranked = rank(mb.map((ex) => ({ ex, score: 0, reasons: [] })), slot, E);
    if (ranked.length) { f.exercise_id = ranked[0].ex.id; f.laterality = ranked[0].ex.laterality; f.swaps = ranked.slice(1, 4).map((c) => c.ex.id); }
  }
  return f;
}

function wodGroup(ex) {
  if (ex.tags.includes('kb_swing')) return 'swing';
  if (ex.tags.includes('thruster')) return 'thruster';
  if (ex.tags.includes('wall_ball') || ex.tags.includes('medball')) return 'ball';
  if (ex.conditioning || /calorie|bike|rower|skierg|erg/.test(ex.id)) return 'erg';
  if (/rope|double-under/.test(ex.id)) return 'rope';
  if (/burpee|jumping-jack/.test(ex.id)) return 'burpee';
  if (/carry|sled/.test(ex.id)) return 'carry';
  return ex.credit_class + ':' + ex.pattern;
}

/** pick + swaps for one slot. opts: {relaxSecond, state, day, keepPrev, forceChange, prevId} */
function pickFor(slot, day, E, st, eb, opts = {}) {
  const { model, R } = E;
  if (slot.bucket === 'WARMUP_PREP') return warmupFill(slot, day, E);
  const fill = emptyFill(slot, eb);
  // joint care: the injury code's own pick first (rules.prehab.preferred_by_code; review 08 major 5)
  if (slot.prehab_code && R.prehab.preferred_by_code && (R.prehab.preferred_by_code[slot.prehab_code] || []).length) {
    const okStatus = (e) => !SWAP_ONLY_STATUS.includes(e.status) || (R.prehab.preferred_status_ok || []).includes(e.status);
    const usedW = st.usedWeek;
    const pre = R.prehab.preferred_by_code[slot.prehab_code].filter((id) => model.hasEx(id)).map((id) => model.ex(id))
      .filter((e) => okStatus(e) && hardFilter(e, slot, eb, E, { used: st.spine, weekday: wdOf(slot) }).ok && !(st.usedByDay.get(wdOf(slot)) || new Set()).has(e.id));
    const fresh = pre.filter((e) => !(R.prehab.skip_if_week_has_same && usedW.has(e.id)));
    const ex0 = fresh[0] || pre[0];
    if (ex0) {
      fill.exercise_id = ex0.id; fill.laterality = ex0.laterality === 'n/a' ? null : ex0.laterality;
      fill.swaps = pre.filter((e) => e !== ex0).slice(0, R.selection.swaps.max).map((e) => e.id);
      fill.why.push(why('why.prehab', 'D-23', { code: slot.prehab_code }));
      fill.flags.push('prehab_preferred');
      return fill;
    }
  }
  const wd = weekdayOfSlot(slot);
  const spine = { used: st.spine, weekday: wd };
  const bk = bucketKind(model, eb);
  const run = (relax) => {
    const pool = variantPool(slot, eb, E, relax.variant);
    const all = [];
    const removedBy = {};
    for (const ex of pool) {
      const hf = hardFilter(ex, slot, eb, E, spine);
      if (!hf.ok) { removedBy[hf.step] = removedBy[hf.step] || hf.area || true; continue; }
      const { score, reasons } = scoreOf(ex, slot, eb, E, st, day);
      all.push({ ex, score, reasons });
    }
    const ranked = rank(all, slot, E);
    const used = st.usedByBucket.get(eb) || new Set();
    const usedDay = st.usedByDay.get(wd) || new Set();
    const reserved = opts.reserved || new Set(); // previous-block picks other slots of this bucket keep (continuity)
    // PER-04 v1.2: an isolation / Focus pick never repeats an exercise the week already holds (review 02 / 06 / 07 minors)
    const weekWide = R.selection.second_exposure_scope === 'week_all_slots' && ['isolation', 'focus'].includes(bk) && !opts.keepPrev;
    const usedW = weekWide ? new Set([...st.usedWeek, ...E.weekUsed]) : new Set();
    const fresh = relax.second ? ranked.filter((c) => !usedDay.has(c.ex.id))
      : ranked.filter((c) => !used.has(c.ex.id) && !usedDay.has(c.ex.id) && !reserved.has(c.ex.id) && !usedW.has(c.ex.id));
    return { ranked, fresh, removedBy, secondApplied: fresh.length < ranked.length };
  };
  const swapOnly = R.selection.swap_only_statuses || [];
  const pickable = (cands) => {
    const allowed0 = cands.filter((c) => !SWAP_ONLY_STATUS.includes(c.ex.status));
    // R2-LIB-01 / R2-LIB-07 (v1.2): a library record is the pick whenever one passes; program-only / reference-only are swaps
    // (cardio options excepted); records named 'any' / 'implement not stated' only when nothing else is left (FIX-03)
    const lib = allowed0.filter((c) => !swapOnly.includes(c.ex.status) || (eb === 'AP_TRIPLE_EXT' && E.preferIds.has(c.ex.id)));
    const allowed1 = lib.length && !['COND_AEROBIC', 'COND_CIRCUIT', 'COND_WOD', 'COND_SPRINT_BUYOUT'].includes(eb) ? lib : allowed0;
    const named = allowed1.filter((c) => !E.genericRe.some((re) => re.test(c.ex.id)));
    const allowed = named.length ? named : allowed1;
    const defs = allowed.filter((c) => isDefaultPick(c.ex, eb, E));
    // the default-in-slot list only narrows while it keeps the best-scoring library pick in reach
    if (defs.length && allowed.length && allowed[0].score - defs[0].score <= R.selection.weights.default_in_slot + EPS) return defs;
    return allowed;
  };
  let res = run({ variant: false, second: false });
  let picks = pickable(res.fresh);
  let relaxNote = null;
  // a named library exercise used again this week beats a placeholder record ('Calf Raise - any'; review 01 / 04 / 05 minors)
  const onlyGeneric = (ps) => ps.length > 0 && ps.every((c) => E.genericRe.some((re) => re.test(c.ex.id)));
  if (onlyGeneric(picks)) {
    const rr = run({ variant: false, second: true });
    const pp = pickable(rr.fresh);
    if (pp.length && !onlyGeneric(pp)) { res = rr; picks = pp; }
  }
  if (!picks.length) { // substitution order: coach alternates (repeat allowed), same pattern other implement / variant
    const r2 = run({ variant: false, second: true });
    if (pickable(r2.fresh).length) { res = r2; picks = pickable(r2.fresh); }
    else {
      const r3 = run({ variant: true, second: true });
      if (pickable(r3.fresh).length) { res = r3; picks = pickable(r3.fresh); relaxNote = 'pattern_gap'; }
    }
  }
  // keep the previous block's pick (continuity) when asked and still valid
  let chosen = null;
  if (opts.keepPrev && opts.prevId) chosen = res.fresh.find((c) => c.ex.id === opts.prevId) || null;
  if (opts.forceChange && opts.prevId) {
    const prevEx = model.hasEx(opts.prevId) ? model.ex(opts.prevId) : null;
    // same pattern, laterality and credit class: the credited weekly sets never drop at the block boundary (H21); v1.2: a full kit
    // takes a real alternative (never 'Calf Raise - any - different implement'), never a lower load ceiling and, for physique /
    // strength clients, never barbell -> machine on a main lift (R2-LIB-01, R2-PER-04; review 01 / 07)
    const CEIL = { low: 0, moderate: 1, high: 2 };
    const BC = R.selection.block_change;
    const noDown = (c) => !BC.forbid_load_downgrade || !prevEx || (CEIL[c.ex.load_ceiling] ?? 1) >= (CEIL[prevEx.load_ceiling] ?? 1);
    const noMachine = (c) => !prevEx || !(['muscle', 'strength'].includes(E.goal) && bk === 'resistance' && implementOf(prevEx) === 'barbell' && implementOf(c.ex) === 'machine');
    // an assisted version never follows the unassisted one (review 07 major 13: weighted / bar dips -> assisted dips)
    const noAssist = (c) => !prevEx || !((c.ex.tags || []).includes('assisted') && !(prevEx.tags || []).includes('assisted'));
    const usedDayNow = st.usedByDay.get(wd) || new Set();
    const pool = BC.full_kit_real_alternative ? pickable(res.ranked.filter((c) => !usedDayNow.has(c.ex.id))) : picks;
    const same = (c) => c.ex.id !== opts.prevId && c.ex.pattern === prevEx.pattern && c.ex.credit_class === prevEx.credit_class &&
      (c.ex.laterality === 'bilateral') === (prevEx.laterality === 'bilateral') && noDown(c) && noMachine(c) && noAssist(c) && !E.genericRe.some((re) => re.test(c.ex.id));
    const alt = prevEx ? (pool.find((c) => same(c) && !(st.usedByBucket.get(eb) || new Set()).has(c.ex.id)) || pool.find(same)) : null;
    if (alt) { chosen = alt; fill.flags.push('block_change'); fill.why.push(why('why.block_change', 'PER-02')); }
    else chosen = res.ranked.find((c) => c.ex.id === opts.prevId) || null;
  }
  if (!chosen && picks.length) chosen = picks[0];
  // fallbacks 10-11: no-ball substitutes, machine isolation swaps, buy list
  if (!chosen) {
    if (res.removedBy.kit || res.removedBy.medball) {
      const subs = R.medball.no_ball_substitutes.filter((id) => model.hasEx(id)).map((id) => model.ex(id))
        .filter((ex) => (bk !== 'focus') && hardFilter(ex, slot, eb, E, spine).ok);
      if (subs.length && (eb === 'AP_THROW' || variantPool(slot, eb, E, true).some((e) => e.tags.includes('medball')))) {
        chosen = { ex: subs[0], score: 0, reasons: [] };
        fill.flags.push('no_medball_sub'); fill.why.push(why('why.no_medball_sub', 'EQ-07'));
      }
    }
    if (!chosen && MACHINE_ISO.includes(eb)) {
      const swaps = (R.equipment.machine_isolation_swaps[eb] || []).filter((id) => model.hasEx(id)).map((id) => model.ex(id))
        .filter((ex) => hardFilter(ex, slot, eb, E, spine).ok);
      fill.flags.push('machine_iso_swap'); fill.why.push(why('why.machine_iso_swap', 'EQ-08'));
      if (swaps.length) chosen = { ex: swaps[0], score: 0, reasons: [] };
    }
  }
  let altAll = [];
  if (!chosen && NEAREST[eb]) {
    // nearest pattern (substitution_order 'nearest_pattern_buy_list'): keeps the muscle group at 2-4 exercises; the buy
    // list still names the kit that unlocks the real pattern (V7). Walks the chain two steps (e.g. ISO_CHEST -> HPUSH -> VPUSH).
    const used2 = st.usedByDay.get(wd) || new Set();
    for (let eb2 = NEAREST[eb], hops = 0; eb2 && eb2 !== eb && hops < 2 && !altAll.length; eb2 = NEAREST[eb2], hops++) {
      altAll = rank(variantPool({ ...slot, variant: null }, eb2, E, true)
        .filter((ex2) => hardFilter(ex2, slot, eb2, E, spine).ok && !SWAP_ONLY_STATUS.includes(ex2.status))
        .map((ex2) => ({ ex: ex2, ...scoreOf(ex2, slot, eb2, E, st, day) })), slot, E).map((c) => ({ ...c, eb: eb2 }));
    }
    const eb2 = altAll.length ? altAll[0].eb : null;
    const alt = altAll.filter((c) => !used2.has(c.ex.id));
    if (alt.length) {
      chosen = alt[0];
      fill.bucket = eb2;
      fill.flags.push('pattern_gap');
      fill.buy = (R.equipment.buy_list[eb] || []).slice();
      fill.why.push(why('why.kit', 'EQ-09'));
      res = { ranked: alt, fresh: alt, removedBy: res.removedBy, secondApplied: false };
    }
  }
  if (!chosen) {
    // last resort: the same exercise again with a one-detail variation (R2-LIB-01: a variation, never an invented
    // exercise) so the muscle group keeps 2 exercises (R2-SES-05) when the kit holds a single option
    const own = res.ranked.filter((c) => !SWAP_ONLY_STATUS.includes(c.ex.status) && (c.ex.variation_axes || []).length).map((c) => ({ ...c, eb }));
    const near = altAll.filter((c) => (c.ex.variation_axes || []).length);
    const again = own[0] || near[0] || null;
    if (again) {
      chosen = again;
      if (again.eb !== eb) { fill.bucket = again.eb; fill.flags.push('pattern_gap'); fill.buy = (R.equipment.buy_list[eb] || []).slice(); }
      const axis = again.ex.variation_axes[0];
      fill.detail = { axis, key: 'detail.' + axis };
      fill.flags.push('detail_variation');
      fill.why.push(why('why.detail_variation', 'R2-LIB-01', { axis }));
      res = { ranked: own.length ? res.ranked : altAll, fresh: [], removedBy: res.removedBy, secondApplied: false };
    }
  }
  if (!chosen) {
    fill.flags.push('no_candidate');
    fill.buy = (R.equipment.buy_list[eb] || []).slice();
    fill.why.push(why('why.kit', 'EQ-09'));
    return fill;
  }
  const ex = chosen.ex;
  const ebF = fill.bucket; // effective bucket of the pick (nearest-pattern fallback may change it)
  fill.exercise_id = ex.id;
  fill.laterality = ex.laterality === 'n/a' ? null : ex.laterality;
  for (const r of chosen.reasons) if (!fill.why.some((w) => w.key === r.key)) fill.why.push(r);
  if (relaxNote) fill.flags.push(relaxNote);
  if (res.secondApplied && !opts.keepPrev) fill.why.push(why('why.second_exposure', 'PER-04'));
  if (res.removedBy.pain) { fill.flags.push('pain_swap'); fill.why.push(why('why.pain_swap', 'R2-LIB-03', { area: typeof res.removedBy.pain === 'string' ? res.removedBy.pain : 'other' })); }
  if (res.removedBy.age_50) { fill.flags.push('age_50_racket'); fill.why.push(why('why.age_50_racket', 'R3-ATH-02')); }
  if (E.older && ex.is_athletic) {
    if (E.optIn) { fill.flags.push('older_opt_in'); fill.why.push(why('why.older_opt_in', 'R2-ATH-08')); }
    else { fill.flags.push('older_default'); fill.why.push(why('why.older_default', 'R2-ATH-08')); }
  } else if (E.older && res.removedBy.older) fill.why.push(why('why.older_never', 'EQ-03'));
  if (E.ladderOrder.indexOf(ex.level) > E.ladderOrder.indexOf(E.ladder)) fill.flags.push('level_shift');
  else if (['resistance', 'isolation'].includes(bk)) fill.why.push(why('why.level_soft', 'CAT-05'));
  // spine
  if (ex.axial && slot.axial_req === 'axial') { fill.flags.push('axial_counted'); fill.why.push(why('why.two_spine_days', 'R2-SES-01', { pattern: ex.axial_pattern })); }
  else if (LOWER_RP.includes(ebF) && slot.axial_req && slot.axial_req !== 'axial') {
    fill.why.push(why('why.axial_second', 'R2-SES-02', { pattern: model.bucket(ebF).axial_pattern }));
    if (ex.spine_class === 'second_day') fill.flags.push('second_day');
  }
  // Olympic day pattern / swings as power (R2-ATH-04, R2-VOL-05)
  if (eb === 'AP_TRIPLE_EXT') {
    if (slot.variant === 'clean') { fill.flags.push('clean_day'); fill.why.push(why('why.clean_day', 'R2-ATH-04')); }
    if (slot.variant === 'snatch') { fill.flags.push('snatch_day'); fill.why.push(why('why.snatch_day', 'R2-ATH-04')); }
    if (ex.tags.includes('kb_swing')) { fill.flags.push('kb_swing_power'); fill.why.push(why('why.kb_swing_power', 'R2-VOL-05')); }
  }
  // contra / ipsi loading for unilateral lower fills (CAT-13)
  if (['RP_UKD', 'RP_UHD'].includes(ebF) && ['unilateral', 'alternating'].includes(ex.laterality)) {
    fill.loading = loadingFor(ex, E, st);
    if (fill.loading === 'contralateral') fill.why.push(why('why.contralateral', 'CAT-13'));
    if (fill.loading === 'ipsilateral') fill.why.push(why('why.ipsilateral', 'CAT-13'));
  }
  // swaps: 2-4 from the same filtered pool, never the pick (H01 / H12 hold: same filters)
  const sw = R.selection.swaps;
  if (eb === 'COND_WOD') {
    // the WOD's other stations (3-4 distinct movement groups); a WOD has no swaps (CONTRACT_REQUESTS B3: SlotFill.stations)
    const stations = [ex];
    const groups = new Set([wodGroup(ex)]);
    for (const c of res.ranked) {
      if (stations.length >= R.conditioning.wod.stations[1]) break;
      if (SWAP_ONLY_STATUS.includes(c.ex.status) || groups.has(wodGroup(c.ex))) continue;
      stations.push(c.ex); groups.add(wodGroup(c.ex));
    }
    fill.stations = stations.map((e) => e.id);
  } else {
    fill.swaps = res.ranked.filter((c) => c.ex.id !== ex.id).slice(0, sw.max).map((c) => c.ex.id);
  }
  return fill;
}

function loadingFor(ex, E, st) {
  const { R } = E;
  const loaded = ex.equipment.any_of.some((su) => su.includes('dumbbell') || su.includes('kettlebell'));
  if (!loaded) return null;
  const split = SPLIT_STANCE_RE.test(ex.id);
  const mode = E.sport ? E.sport.contra_ipsi : 'health_accessory';
  let share;
  if (E.older) share = (E.exerciseBlock % 2 === 1) ? 1 : 0; // general_older: alternate by exercise block
  else if (mode === 'contralateral') share = R.contra_ipsi.cod_contralateral_share;
  else if (mode === 'ipsilateral') share = 1 - R.contra_ipsi.sprinter_ipsilateral_share;
  else if (mode === 'both') share = 0.5;
  else share = null; // health accessory: only split stance is cued
  if (split && R.contra_ipsi.split_stance === 'contralateral' && share == null) return 'contralateral';
  if (share == null) return null;
  const n = st.contra.n;
  const want = Math.round((n + 1) * share + EPS);
  const contra = st.contra.c < want;
  st.contra.n++; if (contra) st.contra.c++;
  return contra ? 'contralateral' : 'ipsilateral';
}

// ------------------------------------------------------------------------------------------------------------------
// public API
// ------------------------------------------------------------------------------------------------------------------

/**
 * Fills for every exercise slot of the layout for one exercise block.
 * @param {{derived:object, shape:object, layout:object, targets:object, exerciseBlock:number, prev:object|null, model:object, seed:string}} ctx
 * @returns {{exercise_block:number, fills:Object<string,object>, buy_list:string[], why:Array}} Selection
 */
export function selectBlock(ctx) {
  const E = prep(ctx);
  const { model, R, layout, derived } = E;
  if (!layout) throw new EngineError('select.no_layout', 'selectBlock needs ctx.layout');
  const st = newState(layout, E);
  const lat = decideLaterality(layout, E);
  const prev = ctx.prev || null;
  const fills = {};
  const buy = new Set();
  const selWhy = [];
  // block changes (PER-02, R2-LIB-01): per day at most max_share of the other resistance slots change; work + core kept;
  // v1.2: the tested lifts stay the same exercise for the whole block (R2-PER-07 'the same test'), circuits change too
  const change = new Set();
  const detailOnly = new Set();
  const locked = new Set();
  if (prev && R.tests.lock_tested_exercise && ((derived.D13_tests && derived.D13_tests.items) || []).includes('strength')) {
    const all = layout.days.flatMap((d) => daySlots(d));
    const okEx = (sl) => { const f = prev.fills[sl.slot_id]; const ex = f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; return !!ex && ex.laterality === 'bilateral' && ex.exercise_class === 'compound' && !ex.is_athletic; };
    for (const b of ['RP_BKD', 'RP_BHD', 'RP_HPUSH']) {
      const c = all.filter((sl) => sl.bucket === b && sl.block !== 'circuit' && okEx(sl));
      const hit = c.find((sl) => sl.axial_req === 'axial') || c.find((sl) => sl.role === 'work') || c[0];
      if (hit) locked.add(hit.slot_id);
    }
  }
  if (prev) {
    selWhy.push(why('why.block_change', 'PER-02'));
    const bc = R.selection.block_change;
    for (const day of layout.days) {
      const others = daySlots(day).filter((s) => ['resistance', 'isolation'].includes(model.bucket(s.bucket).kind) &&
        !bc.keep_roles.includes(s.role) && !locked.has(s.slot_id) && prev.fills[s.slot_id] && prev.fills[s.slot_id].exercise_id && (bc.include_circuits || s.block !== 'circuit'));
      if (!others.length) continue;
      const order = others.slice().sort((a, b) => tieBreak(E.seed, 'block_change', E.exerciseBlock, a.slot_id) - tieBreak(E.seed, 'block_change', E.exerciseBlock, b.slot_id) || (a.slot_id < b.slot_id ? -1 : 1));
      const n = Math.floor(bc.max_share_of_slots * others.length + EPS);
      const fullKit = ['FULL_GYM', 'BASIC_GYM', 'FULL_FACILITY'].includes(E.kit.profile);
      if (n > 0) for (const s of order.slice(0, n)) change.add(s.slot_id);
      else if (bc.allow_detail_variation) { if (fullKit && bc.full_kit_real_alternative) change.add(order[0].slot_id); else detailOnly.add(order[0].slot_id); }
    }
  }
  const KEEP_KINDS = ['resistance', 'isolation', 'core', 'focus', 'prehab'];
  const keepIds = new Map(); // slot_id -> {eb, id}: previous picks that stay (continuity, PER-02)
  if (prev) for (const day of layout.days) for (const slot of daySlots(day)) {
    const pf = prev.fills[slot.slot_id];
    const eb = lat.get(slot.slot_id) || slot.bucket;
    if (pf && pf.exercise_id && pf.bucket === eb && KEEP_KINDS.includes(model.bucket(slot.bucket).kind) && !change.has(slot.slot_id)) keepIds.set(slot.slot_id, { eb, id: pf.exercise_id });
  }
  for (const day of layout.days) {
    for (const slot of daySlots(day)) {
      if (!needsFill(slot, model)) continue;
      let eb = lat.get(slot.slot_id) || slot.bucket;
      const CI = R.selection.chest_iso_to_press_when_pull_ratio_gte;
      if (eb === 'ISO_CHEST' && typeof CI === 'number' && E.sport && typeof E.sport.pull_per_push === 'number' && E.sport.pull_per_push >= CI) eb = 'RP_HPUSH'; // review 01 major 7
      const prevFill = prev && prev.fills[slot.slot_id];
      const prevId = prevFill && prevFill.exercise_id;
      const kind = model.bucket(slot.bucket).kind;
      const strictKeep = !!prevId && KEEP_KINDS.includes(kind) && !change.has(slot.slot_id);
      const reserved = new Set();
      for (const [sid, k] of keepIds) if (sid !== slot.slot_id && k.eb === eb && k.id !== prevId) reserved.add(k.id);
      let fill;
      if (slot.aerobic) fill = aerobicFill(slot, E);
      else fill = pickFor(slot, day, E, st, eb, { keepPrev: strictKeep, forceChange: change.has(slot.slot_id), prevId, reserved });
      if (prevFill && prevFill.bucket !== fill.bucket && fill.exercise_id) { fill.flags.push('laterality_flip'); fill.why.push(why('why.laterality_share', 'UNI-02', { pct: Math.round((E.lowerTarget || 0) * 100) })); }
      else if (lat.has(slot.slot_id) && fill.exercise_id) fill.why.push(why('why.laterality_share', 'UNI-02', { pct: Math.round((E.lowerTarget || 0) * 100) }));
      if (strictKeep && fill.exercise_id === prevId && !fill.why.some((w) => w.key === 'why.continuity')) fill.why.push(why('why.continuity', 'PER-02'));
      if (locked.has(slot.slot_id) && fill.exercise_id === prevId) fill.why.push(why('why.tested_locked', 'R2-PER-07'));
      // one-detail variation (R2-LIB-01): when no alternative exists, or as the day's single small change
      if (prev && fill.exercise_id && fill.exercise_id === prevId && (change.has(slot.slot_id) || detailOnly.has(slot.slot_id))) {
        const ex = model.ex(fill.exercise_id);
        const axes = ex.variation_axes || [];
        if (axes.length) {
          const k = Math.max(0, E.exerciseBlock - (E.tb ? E.tb.first_exercise_block : 1) - 1);
          const axis = axes[k % axes.length];
          fill.detail = { axis, key: 'detail.' + axis };
          fill.flags = fill.flags.filter((f) => f !== 'block_change');
          fill.flags.push('detail_variation');
          fill.why.push(why('why.detail_variation', 'R2-LIB-01', { axis }));
        }
      }
      if (fill.buy) { for (const t of fill.buy) buy.add(t); delete fill.buy; }
      fill.flags = [...new Set(fill.flags)].sort();
      record(st, slot, fill, fill.exercise_id ? model.ex(fill.exercise_id) : null, E);
      fills[slot.slot_id] = fill;
    }
  }
  if (E.plyoTarget != null) selWhy.push(why('why.plyo_share', 'R2-ATH-01', { pct: Math.round(E.plyoTarget * 100) }));
  if (E.lowerTarget != null) selWhy.push(why('why.laterality_share', 'UNI-02', { pct: Math.round(E.lowerTarget * 100) }));
  return { exercise_block: E.exerciseBlock, fills, buy_list: [...buy].sort(), why: selWhy };
}

function aerobicFill(slot, E) {
  const f = emptyFill(slot, slot.bucket);
  f.why.push(why('why.aerobic_colour', 'R2-SES-06'));
  const ex = aerobicPick(slot.aerobic.colour, E.derived, E.model, E.seed, slot.slot_id);
  if (ex) { f.exercise_id = ex.id; f.laterality = null; }
  return f;
}

/**
 * Catalog colour session available in the kit (any erg, EQ-14), or null (text item).
 * @param {string} colour A|B|C|LC @param {object} derived @param {object} model @param {string} [seed] @param {string} [slotId]
 * @returns {object|null} ExerciseRecord
 */
export function aerobicPick(colour, derived, model, seed, slotId) {
  const kit = derived.D8_kit || { tokens: [], machines: [] };
  const kitObj = { tokens: new Set(kit.tokens || []), machines: kit.machines || [] };
  const pool = model.bySlot('COND_AEROBIC').filter((e) => e.conditioning && e.conditioning.colour === colour && model.kitAvailable(e, kitObj));
  if (!pool.length) return null;
  const s = seed || 'c53:none';
  return pool.slice().sort((a, b) => tieBreak(s, slotId || colour, a.id) - tieBreak(s, slotId || colour, b.id) || (a.id < b.id ? -1 : 1))[0];
}

/**
 * Single slot (bonus / focus / substitutes). ctx as selectBlock's; optional ctx.selection (the current Selection) so the
 * pick respects the week's spine budget and avoids repeats.
 * @param {object} slot SlotDef @param {object} ctx @returns {object} SlotFill
 */
export function fillSlot(slot, ctx) {
  const E = prep(ctx);
  const { model, layout } = E;
  const st = newState(layout, E);
  const sel = ctx.selection || null;
  if (sel && layout) {
    for (const d of layout.days) for (const s of daySlots(d)) {
      const f = sel.fills[s.slot_id];
      if (f && f.exercise_id && model.hasEx(f.exercise_id)) record(st, s, f, model.ex(f.exercise_id), E);
    }
  }
  // ctx.day_used (optional): exercise ids already on this slot's weekday that are not in ctx.selection (other added
  // bonus / Focus slots) - the same exercise never appears twice on one day
  if (Array.isArray(ctx.day_used) && ctx.day_used.length) {
    const wd = weekdayOfSlot(slot);
    if (!st.usedByDay.has(wd)) st.usedByDay.set(wd, new Set());
    for (const id of ctx.day_used) st.usedByDay.get(wd).add(id);
  }
  const day = layout ? layout.days.find((d) => d.weekday === weekdayOfSlot(slot)) || null : null;
  if (slot.aerobic) return aerobicFill(slot, E);
  if (!needsFill(slot, model)) return emptyFill(slot, slot.bucket);
  const fill = pickFor(slot, day, E, st, slot.bucket, {});
  if (fill.buy) delete fill.buy;
  fill.flags = [...new Set(fill.flags)].sort();
  return fill;
}

/**
 * Scored candidate list for one slot (filters 1-8, no week state) - for tests and explain.
 * @param {object} slot SlotDef @param {object} ctx @returns {Array<{exercise_id:string, score:number, reasons:Array}>}
 */
export function candidates(slot, ctx) {
  const E = prep(ctx);
  const st = newState(E.layout, E);
  const eb = slot.bucket;
  const out = [];
  for (const ex of variantPool(slot, eb, E, false)) {
    if (!hardFilter(ex, slot, eb, E, { used: st.spine, weekday: weekdayOfSlot(slot) }).ok) continue;
    const { score, reasons } = scoreOf(ex, slot, eb, E, st, null);
    out.push({ ex, score, reasons });
  }
  return rank(out, slot, E).map((c) => ({ exercise_id: c.ex.id, score: c.score, reasons: c.reasons }));
}

/** exported for tests: does an exercise pass the hard filters (2-8) for a slot? */
export function passesHardFilters(exercise, slot, ctx) {
  const E = prep(ctx);
  return hardFilter(exercise, slot, slot.bucket, E, { used: { squat: null, hinge: null }, weekday: weekdayOfSlot(slot) }).ok;
}
