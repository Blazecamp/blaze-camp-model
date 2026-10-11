// engine/select.mjs - owner B3 (engine/CONTRACTS.md §4.7).
// Exercise selection: hard filters 1-11 in order, scoring from rules.selection.weights, deterministic seeded tie-breaks,
// two spine days, laterality share (bilateral : unilateral), contra / ipsi loading, plyo : ballistic share by ground
// contact class and Receive-Create stage, Olympic tier by level and the clean-day / snatch-day station pattern, swaps 2-4,
// exercise-block changes (one small change or a one-detail variation, never invented).
// Pure: no I/O, no clock, no randomness (ties broken by util.tieBreak(seed, slot_id, exercise_id)).
import { EngineError, why, tieBreak, EPS, WEEKDAYS } from './util.mjs';
import { daySlots, baseSets } from './week.mjs';
import { responseOf, isUnilateral, circuitBallistic, athleticBudget, isFloorJump, olympicAboveCeiling, olympicVariantByDay } from './athletic.mjs';
import { NEVER_PICK_STATUS, notShown, addonPrimaryOk, implementOf, swapNote, coreFunction } from './library.mjs';

// Structural ids (§1.4 vocabulary).
const LOWER_RP = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'];
const UPPER_RP = ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'];
const PLYO_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'];
const CONTACT_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_THROW'];
const MACHINE_ISO = ['ISO_QUAD', 'ISO_LEG_FLEXION'];
const SQUAT_MACHINES = ['leg_press', 'hack_squat', 'pendulum', 'belt_squat'];
// never the template's pick (CAT-07; v0.5 / V2, COACH-R4 R4-LIB-01: the optional add-ons too - rules.selection.addons.never_pick_statuses)
const SWAP_ONLY_STATUS = NEVER_PICK_STATUS;
const RC_RANK = { RC1: 1, RC2: 2, RC3: 3 };
const ROUTE_SPORT_OK = (E) => ((E.R.athletic.cod && E.R.athletic.cod.route_sports) || []).includes(E.sportId);
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
// v0.4 stage B3: exercise anatomy - the movement, its implement, position and grip - for near-duplicates in one session and
// one-detail block-to-block changes (R2-SES-05 '2-4 different exercises', R2-LIB-01 / PER-02 'change one detail'). INFERRED from
// the catalog ids (the 02 records carry no grip / position fields).
// ------------------------------------------------------------------------------------------------------------------

// the movement noun, matched in order (first hit wins); the matched text is removed before the position / grip tokens are read
const NOUNS = [
  ['pullup', /(pull-up|chin-up)/], ['pulldown', /pulldown/], ['face_pull', /face-pull/], ['reverse_fly', /reverse-fly|rear-delt-pec-deck/],
  ['pullover', /pull-?over/], ['mid_row', /high-row|45-degree-cable-row/], ['row', /row/], ['triceps_ext', /skullcrusher|tate-press|triceps-extension/], ['pushdown', /push-?down/],
  ['kickback', /kickback/], ['leg_curl', /leg-curl|hamstring-curl|nordic/], ['curl', /curl/], ['fly', /fly|pec-deck|crossover/],
  ['lateral_raise', /lateral|side-raise|upright-row/], ['front_raise', /front-raise/], ['calf_raise', /calf-raise/], ['yt_raise', /y-t|y-raise|t-raise/],
  ['push_up', /push-up|pushup/], ['dip', /dip/], ['press', /press/], ['split_squat', /split-squat|lunge|step-up|sit-to-stand/],
  ['sissy_squat', /sissy-squat/], ['squat', /squat/], ['deadlift', /deadlift|rdl|good-morning/], ['hip_thrust', /hip-thrust|glute-bridge|bridge|pull-through/],
  ['leg_ext', /leg-extension/], ['hyper', /hyperextension|reverse-hyper|back-extension|glute-ham/], ['shrug', /shrug/], ['carry', /carry/]
];
const POSITION_TOKENS = ['bent-knee', 'seated', 'standing', 'bent-over', 'chest-to-thighs', 'alternating', 'single-arm', 'one-arm', 'single-leg', 'kneeling',
  'half-kneeling', 'tall-kneeling', 'incline', 'high-incline', 'decline', 'flat', 'floor', 'lying', 'prone', 'supine', 'side-lying', 'seesaw',
  'cross-body', 'concentration', 'spider', 'overhead', 'leaning', 'deficit', 'elevated', 'staggered', 'kickstand', 'sumo', 'zercher', 'goblet',
  'front', 'box', 'pause', 'walking', 'reverse', 'rear-foot', 'bulgarian', 'landmine', 'z-press', 'seal', 'chest-supported', 'pendlay', 'b-stance',
  'hands-elevated', 'feet-elevated', 'heels-elevated', 'stiff-leg', 'romanian', 'hack', 'belt', 'pendulum', 'smith', 'safety-bar'];
const GRIP_TOKENS = ['wide', 'close', 'neutral', 'supinated', 'pronated', 'underhand', 'overhand', 'hammer', 'mag', 'rope', 'palms-up', 'reverse-grip', 'snatch-grip', 'v-handle', 'yates'];
const tokenRe = (t) => new RegExp('(^|-)' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(-|$)');
const POS_RE = POSITION_TOKENS.map((t) => [t, tokenRe(t)]);
const GRIP_RE = GRIP_TOKENS.map((t) => [t, tokenRe(t)]);
const ANATOMY = new Map();

/** {noun, impl, lat, pos:string[], grip:string[]} of a record (cached by id) */
// v0.5 fix round 2: the core movements (the noun table above names none, so every pair of core records of one pattern read as 'two
// versions of the same exercise' - a Copenhagen plank and toes-to-bar, a dead bug and a bird dog). A core record outside this
// table is its own movement (pattern + first word of its id).
const CORE_NOUNS = [
  ['hang_rotational', /hanging-rotational/], ['hang', /hanging|toes-to-bar/], ['side_plank', /side-plank|oblique-hold|oblique-sit/], ['copenhagen', /copenhagen/],
  ['plank', /plank/], ['dead_bug', /dead-bug/], ['bird_dog', /bird-dog/], ['hollow', /hollow/], ['sit_up', /sit-up/], ['crunch', /crunch/], ['v_up', /v-up/],
  ['leg_raise', /leg-raise|flutter/], ['twist', /twist/], ['chop', /chop|rotation/], ['pallof', /pallof/], ['climber', /climber|runners/]
];
function anatomy(ex) {
  if (ANATOMY.has(ex.id)) return ANATOMY.get(ex.id);
  const hit = NOUNS.find(([, re]) => re.test(ex.id));
  const coreHit = !hit && ex.credit_class === 'CORE' ? CORE_NOUNS.find(([, re]) => re.test(ex.id)) : null;
  const noun = (ex.credit_class || '') + ':' + (hit ? hit[0] : coreHit ? coreHit[0] : ex.credit_class === 'CORE' ? (ex.pattern || 'x') + ':' + ex.id.split('-')[0] : ex.pattern || 'x');
  const rest = hit ? ex.id.replace(hit[1], '-') : ex.id;
  const pos = POS_RE.filter(([, re]) => re.test(rest)).map(([t]) => t).filter((t, i, a) => !(t === 'incline' && a.includes('high-incline')) && !(t === 'kneeling' && (a.includes('half-kneeling') || a.includes('tall-kneeling'))));
  const grip = GRIP_RE.filter(([, re]) => re.test(rest)).map(([t]) => t);
  const lat = ex.laterality === 'bilateral' ? 'bi' : ex.laterality === 'n/a' ? 'na' : 'uni';
  const a = { noun, impl: implementOf(ex), lat, pos, grip };
  ANATOMY.set(ex.id, a);
  return a;
}
const setDiff = (a, b) => [...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x))];

/** two versions of the same exercise (one session never holds both): same movement, implement and credit class, differing only in
 *  trivial position / grip words (seated vs bent-over reverse fly, DB floor press vs alternating DB floor press) */
function nearDuplicate(a, b, R) {
  if (a.id === b.id) return true;
  const ND = R.selection.near_duplicate;
  if (!ND) return false;
  const x = anatomy(a), y = anatomy(b);
  if (x.noun !== y.noun || x.impl !== y.impl || a.credit_class !== b.credit_class) return false;
  const diff = [...setDiff(x.pos, y.pos), ...setDiff(x.grip, y.grip)];
  return diff.every((t) => ND.trivial_tokens.includes(t));
}

/** how many details a block change alters (movement 2, implement / laterality / position / grip 1 each); 0 = the same exercise */
function changeDistance(a, b) {
  const x = anatomy(a), y = anatomy(b);
  return (x.noun !== y.noun ? 2 : 0) + (x.impl !== y.impl ? 1 : 0) + (x.lat !== y.lat ? 1 : 0) + (setDiff(x.pos, y.pos).length ? 1 : 0) + (setDiff(x.grip, y.grip).length ? 1 : 0);
}

/** exported for tests and the reviewers' tools: two records are versions of one exercise (one session never holds both) */
export function isNearDuplicate(model, a, b) { return nearDuplicate(a, b, model.rules); }
/** exported for tests: the number of details a block change alters (0 = the same exercise) */
export function detailDistance(a, b) { return changeDistance(a, b); }

/**
 * The concrete one-detail variations a record allows (rules.selection.variations; R2-LIB-01 'show it as "Reverse lunge -
 * dumbbell in opposite hand"'), in preference order. Exported for generate.distinctDetails.
 * @param {object} model @param {object} ex ExerciseRecord @param {Set<string>|string[]} kitTokens @param {string[]} [painAreas]
 * @returns {Array<{axis:string, key:string, value:string}>}
 */
export function variationValues(model, ex, kitTokens, painAreas = []) {
  const V = model.rules.selection.variations;
  if (!V || !ex) return [];
  const kit = kitTokens instanceof Set ? kitTokens : new Set(kitTokens || []);
  const impl = implementOf(ex);
  const out = [];
  for (const v of V.values || []) {
    const w = v.when || {};
    if (w.cc && !w.cc.includes(ex.credit_class)) continue;
    if (w.impl && !w.impl.includes(impl)) continue;
    if (w.lat && !w.lat.includes(ex.laterality)) continue;
    if (w.re && !new RegExp(w.re).test(ex.id)) continue;
    if (w.not_re && new RegExp(w.not_re).test(ex.id)) continue;
    if (w.kit && !w.kit.some((t) => kit.has(t))) continue;
    if (w.not_pain && w.not_pain.some((a) => painAreas.includes(a))) continue;
    if (!model.has('en', 'detail.v.' + v.id)) continue;
    out.push({ axis: v.axis, key: 'detail.v.' + v.id, value: v.id });
  }
  return out;
}

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
  // v0.4 stage B2 (CAT-10 'start ballistic, then slowly and gradually more plyometric; unilateral is harder'; R2-ATH-03):
  // the first exercise block of a training block lands on two feet; the first stage-2 (reactive) exercise block takes bilateral,
  // unloaded, low-box land & go only, and single-leg reactive work waits for a later stage-2 block; heavy athletes and beginners
  // hold one depth-jump station a week (rules.athletic.first_reactive, E-32)
  const FR = R.athletic.first_reactive || null;
  const ebStage = (e) => { const w = shape && e ? (shape.weeks || []).find((x) => x.n === e.weeks[0]) : null; return (w && w.plyo_stage) || null; };
  const tbEbs = shape && tb ? (shape.exercise_blocks || []).filter((e) => e.training_block === tb.n && e.n < exerciseBlock) : [];
  const priorRc2 = tbEbs.some((e) => ebStage(e) === 'RC2');
  const firstReactive = !!FR && stageNow === 'RC2' && !priorRc2 && !tbEbs.some((e) => ebStage(e) === 'RC3');
  // F2: the Receive-Create stage moved at this exercise block (the jump stations change drill with it)
  const prevEbStage = (() => { const pe = shape ? (shape.exercise_blocks || []).find((e) => e.n === exerciseBlock - 1) : null; return pe ? ebStage(pe) : null; })();
  const stageMoved = !!(stageNow && prevEbStage && stageNow !== prevEbStage);
  const heavyOrL1 = !!FR && ((derived.body_weight_lb || 0) >= (FR.heavy_bw_lb || Infinity) || lvl === 'L1');
  const kitTok = new Set(kit.tokens || []);
  // B2 (E-30): how many of the week's lower-body jump stations are reactive (plyometric) - the profile's own reactive part of its
  // jump work (04 plyometric target / high contacts), from stage 2 on; the share (ankle work counted plyometric) is dosed in
  // athletic.planAthletic. Stage 1 has no reactive jumps.
  let reactiveWant = null;
  if (R.athletic.split && D11.enabled && D11.weekly && Array.isArray(D11.weekly.jump_contacts) && Array.isArray(D11.weekly.plyo_contacts) && layout && stageNow !== 'RC1') {
    const H = D11.weekly.jump_contacts[1], P = D11.weekly.plyo_contacts[1];
    const n = layout.days.filter((d) => d.kind === 'main').reduce((a, d) => a + daySlots(d).filter((x) => x.bucket === 'AP_PLYO' && x.variant !== 'upper').length, 0);
    let ratio = H > 0 ? Math.min(1, P / H) : 0;
    // v0.4 fix round 1 / F2 (RECHECK 03 blocker: every soccer jump station reactive, no ballistic jump): the reactive : ballistic
    // split of the stations follows the exercise block's own weekly targets (the share split already counts the ankle work as
    // plyometric, R2-ATH-01 / R2-ATH-02), not the profile's raw plyometric number
    if (R.athletic.f2 && R.athletic.f2.share && eb && shape) {
      try {
        const B = athleticBudget(derived, shape, model);
        let Pt = 0, Jt = 0;
        for (let wk = eb.weeks[0]; wk <= eb.weeks[1]; wk++) { const t = B[wk - 1] && B[wk - 1].targets; if (t) { Pt += t.plyo_contacts || 0; Jt += t.jump_contacts || 0; } }
        if (Pt + Jt > 0) ratio = Pt / (Pt + Jt);
        // the ballistic jump goal is filled first: one lower-body jump station stays ballistic while the week has a ballistic goal
        if (Jt > 0) ratio = Math.min(ratio, n > 0 ? (n - 1) / n : 0);
      } catch { /* the profile ratio */ }
    }
    reactiveWant = Math.round((n * ratio) + EPS);
  }
  const E0 = {
    priority: (derived.priority_muscles || []).slice(),
    ...ctx, R, model, derived, age, older, optIn, youth, lvl, ladder, ladderOrder, kitObj, kit, sport, profileId, tb, eb, ebIdx,
    exerciseBlock, firstWeek, lowerTarget, upperTarget, plyoTarget, racket50, highVolume, clientFamily, sportWords, pain, fill,
    band: derived.D7_constraint_band || { main: [1, 5], iso: [1, 5], machine_pen: 0, skill_pen: 0 },
    goal: derived.goal, family: derived.D1_family || (layout && layout.family),
    preferIds: new Set((sport && sport.olympic && sport.olympic.prefer_ids) || []),
    seed: ctx.seed || 'c53:none',
    hot, genericRe, plyoRules, injuries,
    stage: stageNow,
    FR, firstReactive, firstStageBlock: ebIdx === 0, priorRc2, heavyOrL1, reactiveWant, stageMoved,
    // v0.4 fix round 2 / F2 (rules.athletic.r2.selection, E-167 ...): the athletic picks by sport, stage and client
    R2S: (R.athletic.r2 && R.athletic.r2.selection) || null,
    heavy: !!FR && (derived.body_weight_lb || 0) >= (FR.heavy_bw_lb || Infinity),
    lowImpact: racket50 || (older && !optIn) || pain.some((p) => ['knee', 'ankle_foot'].includes(p.area)),
    lastCodSlot: (() => { const all = layout ? layout.days.filter((d) => d.kind === 'main').flatMap((d) => daySlots(d).filter((x) => x.bucket === 'AP_COD')) : []; return all.length > 1 ? all[all.length - 1].slot_id : null; })(),
    racketOptIn: !!(derived.prefs && derived.prefs.racket_50_impact_opt_in),
    circuitBallistic: circuitBallistic(derived, model),
    depthCap: FR ? (heavyOrL1 ? FR.depth_jump_max_wk_heavy_or_l1 : FR.depth_jump_max_wk) : Infinity,
    sportId: sport ? sport.sport : null, sprintFocus: sport ? sport.sprint_focus || null : null,
    hasBall: kitTok.has('medball') || kitTok.has('slam_ball'),
    weekUsed: new Set(ctx.week_used || []),
    // (fix round 2 / F3: how often each exercise is already held by the week's other added slots)
    weekUsedN: (ctx.week_used || []).reduce((m, id) => m.set(id, (m.get(id) || 0) + 1), new Map()),
    competitive: !!(derived.D2_profile && derived.D2_profile.competitive === 'competitive'),
    // B3: the kit's bench presses (the lead chest press, R.selection.lead_press), the pain areas, the slot history of the
    // training block (no A-B-A at block changes)
    kitTok, painAreas: pain.map((p) => p.area),
    pressAlt: leadPressAlternatives(model, kitObj),
    history: (ctx.prev && ctx.prev.history) || {},
    // v0.4 fix round 1 / F3 (rules.selection.f3): the client's own Focus picks (priority_choices: 'side_delts', 'glutes' ...) and
    // the movement families of the week-wide uniqueness check
    F3: R.selection.f3 || null,
    focusChoices: new Set([...((derived.priority_choices) || []), ...((derived.focus_lines) || [])]),
    familyRe: ((R.selection.f3 && R.selection.f3.families) || []).map((f) => ({ id: f.id, re: new RegExp(f.re), lying: !!f.lying })),
    // v0.4 fix round 2 / F3 (rules.selection.r2, DECISIONS E-178 ...): the round's selection rules, the stations the time check keeps
    // (`ctx.live`, the second pass of generate) and the movement families with their weekly / daily caps
    // The round's rules act in generate's SECOND pass only (`ctx.live` given): the first pass picks as before so the time check sizes
    // the plan on the same stations, and the second pass re-picks the kept stations inside their time and credit profile (same
    // laterality class and credit class as the first pick - the dials' flips excepted), so the plan's sets stay what the time check
    // proved.
    S2: (ctx.live instanceof Set || Array.isArray(ctx.live)) ? (R.selection.r2 || null) : null,
    live: ctx.live instanceof Set ? ctx.live : (Array.isArray(ctx.live) ? new Set(ctx.live) : null),
    baseFills: (ctx.base && ctx.base.fills) || null,
    baseAddedId: (ctx.base_added && ctx.base_added.exercise_id) || null,
    // `ctx.frozen`: the second pass without its profile changes (no dial flip against the first pass, no knee-flexion swap) - generate
    // falls back to it when the changed picks would cost the plan a group the first pass trained (the time check is a knife edge on
    // very short schedules)
    frozen: !!ctx.frozen,
    // v0.5 fix round 1 (rules.selection.x1.dial_reads_plan_sets; sample 04: the lower share landed 15 points under its target
    // because the dial counted every station at its template minimum while the plan gave the single-leg stations 4-5 sets): in the
    // second pass the laterality dials weigh every station by the sets the first pass gave it across the exercise block
    liveSets: (R.selection.x1 && R.selection.x1.dial_reads_plan_sets && ctx.live_sets && typeof ctx.live_sets === 'object') ? ctx.live_sets : null,
    liveWeeks: typeof ctx.live_weeks === 'number' && ctx.live_weeks > 0 ? ctx.live_weeks : 1,
    families2: (ctx.live instanceof Set || Array.isArray(ctx.live)) ? ((R.selection.r2 && R.selection.r2.families) || []).map((f) => ({ ...f, rx: new RegExp(f.re) })) : [],
    // v0.5 fix round 1 (rules.selection.x1): does the kit hold the machine of the leg-extension / leg-curl slot?
    isoMachine: (() => {
      const IM = R.selection.x1 && R.selection.x1.iso_machine_first;
      const out = {};
      if (IM) for (const [b, def] of Object.entries(IM.buckets || {})) out[b] = (def.machine_ids || []).some((id) => model.hasEx(id) && model.kitAvailable(model.ex(id), kitObj));
      return out;
    })()
  };
  // v0.5 fix round 1: does the kit hold a bench or machine chest press (the lead press's staples)?
  { const LPx = R.selection.x1 && R.selection.x1.lead_press; const rx = LPx ? new RegExp(LPx.staples_re) : null;
    E0.pressStaple = !!rx && model.bySlot('RP_HPUSH').some((e) => rx.test(e.id) && model.kitAvailable(e, kitObj)); }
  // v0.5 fix round 2: does the kit hold no library two-arm row at the client's level? (then the reference-tab dumbbell rows may be picked)
  { const so = R.selection.swap_only_statuses || [];
    E0.smallKitRows = !model.bySlot('RP_HPULL').some((e) => e.laterality === 'bilateral' && !SWAP_ONLY_STATUS.includes(e.status) && !so.includes(e.status) && !(e.tags || []).includes('home_substitute') &&
      !genericRe.some((re) => re.test(e.id)) && ladderOrder.indexOf(e.level) <= ladderOrder.indexOf(ladder) && model.kitAvailable(e, kitObj)); }
  // (fix round 2: a kit with no vertical pull at all, and one that holds fewer than two different rows - a circuit's second back
  // station becomes a rear-delt fly in the first case unless the second holds too; rules.selection.x2.circuit.stand_in.RP_VPULL)
  { const so = R.selection.swap_only_statuses || [];
    const SKx = R.selection.x2 && R.selection.x2.small_kit_rows;
    const KAx = R.session && R.session.x2 && R.session.x2.circuit_kit_aware;
    const homeKit = !KAx || !(KAx.not_home_profiles || []).includes((derived.D8_kit || {}).profile);
    const okRec = (e, extra = []) => !SWAP_ONLY_STATUS.includes(e.status) && (!so.includes(e.status) || extra.includes(e.id)) && (homeKit || !(e.tags || []).includes('home_substitute')) &&
      !genericRe.some((re) => re.test(e.id)) && ladderOrder.indexOf(e.level) <= ladderOrder.indexOf(ladder) && model.kitAvailable(e, kitObj);
    E0.noVpull = !model.bySlot('RP_VPULL').some((e) => okRec(e));
    E0.smallKitRows1 = model.bySlot('RP_HPULL').filter((e) => okRec(e, (SKx && SKx.ids) || [])).length < 2;
    E0.kitHolds = (bucket) => model.bySlot(bucket).some((e) => okRec(e));
    E0.homeKit = homeKit; }
  // v0.5 fix round 1: the week's 'Chest / Shoulders' slot that takes an incline press, and the days whose slot 3 is an incline
  E0.chestShoulders = chestShouldersSlots(layout, E0);
  E0.inclineDays = inclineVpushDays(layout, E0);
  // (a small kit - dumbbells and a bench - holds one flat bench press: its second pressing day leads with the incline press rather
  // than a floor press, ORD-07; the 'first press stays a flat one' lean is for kits that hold a flat press for every pressing day)
  {
    const LP = R.selection.lead_press, LPx = R.selection.x1 && R.selection.x1.lead_press;
    if (LP && LPx && layout) {
      const avoid = new RegExp(LP.avoid_re), floor = new RegExp(LP.floor_re), inc = new RegExp(LPx.incline_re);
      const flat = model.bySlot('RP_HPUSH').filter((e) => e.laterality === 'bilateral' && !SWAP_ONLY_STATUS.includes(e.status) && !(R.selection.swap_only_statuses || []).includes(e.status) &&
        e.load_ceiling !== 'low' && !avoid.test(e.id) && !floor.test(e.id) && !inc.test(e.id) && !(e.tags || []).includes('mid_range_push') && model.kitAvailable(e, kitObj));
      const pressDays = layout.days.filter((d) => d.kind === 'main' && daySlots(d).some((x) => LP.buckets.includes(x.bucket))).length;
      if (flat.length < pressDays) E0.inclineDays = new Set();
    }
  }
  return E0;
}

/** generate runs its second selection pass only on a selection module that knows it (the test stubs do not) */
export const SECOND_PASS = true;

/** is this slot one of the plan's real stations? (true for every slot until generate's second pass says which ones the time check kept) */
function isLive(slot, E) { return !E.live || E.live.has(slot.slot_id); }

/** the round-2 movement families of a record (rules.selection.r2.families; a record may sit in several) */
function families2Of(ex, E) {
  if (!ex || !E.families2 || !E.families2.length) return [];
  return E.families2.filter((f) => f.rx.test(ex.id));
}

/** the movement family of a record for the week-wide uniqueness check (F3; rules.selection.f3.families), or null */
function familyOf(ex, E) {
  if (!ex || !E.familyRe || !E.familyRe.length) return null;
  const f = E.familyRe.find((x) => x.re.test(ex.id));
  return f ? f.id : null;
}

/** v0.5 / V2 (COACH-R4 R4-LIB-03): is this client one whose vertical / mid-range push slot leads with incline pressing? (bodybuilding
 *  and the general population, rules.selection.incline_first; a competitive athlete keeps overhead and incline pressing level) */
function inclineFirstOn(E) {
  const IF = E.R.selection.incline_first;
  if (!IF) return false;
  // v0.5 fix round 2 (sample 01 major; 04 swimming_middle 'avoid high-volume overhead pressing'): the swimmer's shoulder hot spot
  // takes the incline / mid-range press too (rules.selection.x2.incline_first_hotspot_codes - the one profile whose 04 row says so;
  // a thrower keeps his one-arm overhead press, the coach has not reviewed that plan)
  const X2 = E.R.selection.x2;
  if (X2 && (X2.incline_first_hotspot_codes || []).some((c) => E.injuries.has(c))) return true;
  return (IF.goals || []).includes(E.goal) && !(IF.not_competitive && E.competitive);
}

/** anti-movement / hold core record (plank, dead bug, Pallof, hollow / streamline hold, side plank, carries; not the Copenhagen plank -
 *  an adductor exercise with a long lever) */
function antiCore(ex) { return !/copenhagen/.test(ex.id) && (ANTI_CORE_RE.test(ex.id) || /hold|plank|carry/.test(ex.id)); }

/** does the kit hold a two-arm press (not alternating / one-arm), and a two-arm bench press (not floor / push-up)? */
function leadPressAlternatives(model, kitObj) {
  const LP = model.rules.selection.lead_press;
  if (!LP) return { twoArm: false, bench: false };
  const avoid = new RegExp(LP.avoid_re), floor = new RegExp(LP.floor_re);
  const ok = model.bySlot('RP_HPUSH').filter((e) => !SWAP_ONLY_STATUS.includes(e.status) && e.laterality === 'bilateral' && model.kitAvailable(e, kitObj) && e.load_ceiling !== 'low');
  // (v0.5 / V2, rules.selection.v2.lead_press: with no loaded press in the kit the lead is still a two-arm push-up, not an offset one)
  const anyTwo = model.bySlot('RP_HPUSH').some((e) => !SWAP_ONLY_STATUS.includes(e.status) && e.laterality === 'bilateral' && model.kitAvailable(e, kitObj) && !avoid.test(e.id));
  return { twoArm: ok.some((e) => !avoid.test(e.id)), bench: ok.some((e) => !avoid.test(e.id) && !floor.test(e.id)), twoArmAny: anyTwo };
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
  // v0.5 fix round 1: the 'Chest / Shoulders' slot of the week's first B day may hold a 30-45 degree incline press (R4-SES-05)
  if (E.chestShoulders && E.chestShoulders.has(slot.slot_id) && E.R.selection.x1 && E.R.selection.x1.chest_shoulders) {
    const CS = E.R.selection.x1.chest_shoulders;
    if (eb === CS.bucket) {
      const CSUv = E.R.selection.x2 && E.R.selection.x2.chest_slot_uni;
      const rx = new RegExp(CS.incline_re), rxu = CSUv ? new RegExp(CSUv.id_re) : null;
      const extra = model.bySlot(CS.lead_bucket).filter((e) => (rx.test(e.id) || (rxu && rxu.test(e.id))) && !pool.includes(e));
      pool = [...pool, ...extra];
    }
  }
  // B2 (RECHECK 04 major 'every WOD is erg + thruster + swing'): a WOD may hold a ballistic jump (box / squat jump) and a medball
  // slam or wall ball, so the week's WODs can rotate their movements (rules.conditioning.wod.weekly_must_have: jump, ball or KB)
  if (eb === 'COND_WOD' && E.R.conditioning.wod && E.R.conditioning.wod.rotate_stations_week) {
    const jumps = model.bySlot('AP_PLYO').filter((e) => e.athletic && e.athletic.quality === 'ballistic' && responseOf(e) === 'single' && !e.athletic.upper && e.laterality === 'bilateral' && !e.tags.includes('loaded_jump'));
    const balls = model.bySlot('AP_THROW').filter((e) => e.medball && ['slam', 'wall_ball'].includes(e.medball.kind));
    pool = [...pool, ...jumps.filter((e) => !pool.includes(e)), ...balls.filter((e) => !pool.includes(e))];
    // v0.5 fix round 1 (sample 04 minor: no WOD held a pulling or gymnastics station although the rig is in the kit; his CrossFit
    // sheet: T2B, gymnastics): the week's WODs may hold a pull-up, an inverted row or toes-to-bar
    const WX = E.R.conditioning.wod.x1;
    if (WX && WX.weekly_must_have_pull) { const rx = new RegExp(WX.pull_re); pool = [...pool, ...model.exercises().filter((e) => rx.test(e.id) && !pool.includes(e))]; }
  }
  // COACH-R3 R3-ATH-03 (approved, B2): a HYROX station circuit draws the race stations (sled push / pull, burpee broad jumps,
  // wall balls, farmers carry, sandbag lunges, SkiErg / row) that the kit holds
  if (eb === 'COND_CIRCUIT' && E.R.athletic.hyrox && (E.R.athletic.hyrox.station_variants || []).includes(slot.variant)) {
    pool = E.R.athletic.hyrox.station_ids.filter((id) => model.hasEx(id)).map((id) => model.ex(id));
  }
  // B2 (RECHECK 05 major): a general-population circuit's metabolic station may be a ballistic one - a medball slam / throw or a
  // KB swing (rules.athletic.circuit_ballistic; never a muscle set, R2-VOL-05)
  if (eb === 'COND_CIRCUIT' && E.circuitBallistic) {
    const CB = E.R.athletic.circuit_ballistic;
    const balls = model.bySlot('AP_THROW').filter((e) => e.medball && CB.throw_kinds.includes(e.medball.kind));
    const swings = CB.swing && !(E.older && !E.optIn) ? model.bySlot('AP_TRIPLE_EXT').filter((e) => e.tags.includes('kb_swing') && !e.tags.includes('overhead')) : [];
    pool = [...pool, ...balls.filter((e) => !pool.includes(e)), ...swings.filter((e) => !pool.includes(e))];
  }
  if (eb === 'COND_SPRINT_BUYOUT' && E.R.conditioning.buyout_pool) {
    // the buy-out is a conditioning finisher (OBSERVED BASEBALL Part E: 1-3 bouts of 10-20 cal or 15-30 s runs), never a
    // max-velocity sprint, an acceleration or an A-drill after the lifting (ORD-03, LIB-21, ORD-08; review 02 major 1)
    const BP = E.R.conditioning.buyout_pool;
    const inc = new RegExp(BP.include_ids_re || 'calorie|buy-out|fast-run'), exc = new RegExp(BP.exclude_ids_re || 'max-velocity|acceleration|falling-start|a-march|a-skip|a-runs|mach-sprint|high-knee');
    const extra = model.bySlot('COND_CIRCUIT').filter((e) => inc.test(e.id));
    pool = [...pool, ...extra.filter((e) => !pool.includes(e))].filter((e) => inc.test(e.id) && !exc.test(e.id));
    // v0.5 fix round 2 (sample 02 major: 'Calorie Effort: 40 cal' and '45 cal' as buy-outs; OBSERVED BASEBALL Part E: 10-20 cal
    // sprints, 1-3 bouts): the calories of a buy-out record stay inside rules.conditioning.buyout_pool.calories
    if (BP.x2 && BP.x2.enforce_calories && Array.isArray(BP.calories)) {
      const calOf = (e) => { const m = /calorie-effort-(\d+)-cal/.exec(e.id); return m ? Number(m[1]) : null; };
      pool = pool.filter((e) => { const c = calOf(e); return c === null || (c >= BP.calories[0] && c <= BP.calories[1]); });
    }
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
  // v0.5 / V2 (COACH-R4 R4-LIB-01): a record that is still proposed (neck work) is never shown - not a pick, not a swap
  if (notShown(ex)) return { ok: false, step: 'never' };
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
        // (v0.5 / V2: the catalog's own 60+ flag now carries the landing drills round 3 switched on - R3-ATH-02; HANDOFF clean-up)
        if (!(ex.athletic && ex.athletic.quality === 'landing' && ex.older_ok)) return { ok: false, step: 'older' };
      } else if (!ex.older_ok) return { ok: false, step: 'older' };
    } else if (!ex.older_opt_in_ok) return { ok: false, step: 'older' };
  }
  if (E.highVolume && [...O.never_tags, ...O.never_tags_phase0_even_with_opt_in].some((t) => tags.includes(t))) return { ok: false, step: 'older' }; // EQ-03 injured / high-volume
  // R3-ATH-02 (approved): racket players 50-59 - low-impact jumps only unless switched on (prefs.racket_50_impact_opt_in, B2)
  if (E.racket50 && !E.optIn && !E.racketOptIn && R.population.active_aging_50.avoid_tags_unless_opt_in.some((t) => tags.includes(t))) return { ok: false, step: 'age_50' };
  // R3-ATH-02 (approved): from 60 the default COD work is quick stepping without a hop (B2)
  if (E.older && !E.optIn && eb === 'AP_COD' && Array.isArray(O.quick_stepping_no_hop) && !O.quick_stepping_no_hop.includes(ex.id)) return { ok: false, step: 'older' };
  if (E.youth) {
    const YX = R.selection.x2 && R.selection.x2.youth_level_exempt_re;
    if (E.ladderOrder.indexOf(ex.level) > E.ladderOrder.indexOf(R.levels.youth_max_ladder) && !(YX && new RegExp(YX).test(ex.id))) return { ok: false, step: 'youth' };
    if (tags.includes('olympic_from_floor') && !(E.age >= R.olympic.youth_floor_min_age && tags.includes('youth_floor_ok') &&
      (E.derived.previous_cycles && E.derived.previous_cycles.count >= 1))) return { ok: false, step: 'youth' }; // D-41
  }
  // Olympic tier by level (ATH-10, V19): L1 tier for L1 and for L2 in exercise block 1
  // v0.4 fix round 1 / F2 (RECHECK 02 minor: a full squat snatch for a 230-lb linebacker whose profile stops at 'power clean, clean
  // pulls'): the sport's Olympic ceiling (04 triple_ext.ceiling, named on the L2+ barbell lifts; L1 keeps its own DB / KB list) -
  // 'power' keeps the catch above a full squat, 'pull' keeps the barbell work to pulls - unless the coach switches the full lifts on
  if (eb === 'AP_TRIPLE_EXT' && olympicAboveCeiling(ex, E.sport, R, E.derived)) return { ok: false, step: 'profile' };
  if (eb === 'AP_TRIPLE_EXT' && ex.athletic && ex.athletic.olympic_tier === 'L2_plus') {
    // (fix round 2, rules.olympic.x2.l2_block1: an L2 lifter's first exercise block takes the hang power lifts - ATH-10 'power and
    // hang variants with the barbell' - so the hang power snatch passes there)
    const LB = R.olympic.x2 && R.olympic.x2.l2_block1;
    const hangOk = !!LB && (LB.levels || []).includes(E.lvl) && E.exerciseBlock === 1 && (LB.ids || []).includes(ex.id);
    if (E.lvl === 'L1' || (E.lvl === 'L2' && E.exerciseBlock === 1 && !hangOk)) return { ok: false, step: 'level' };
  }
  // v0.5 fix round 2 (samples 01 / 02; EQ-15 'loaded jumps 10-20 % of body weight', CAT-10 / R2-ATH-03 receive first, simple first):
  // a jump loaded by an implement heavier than the top of that range for this client is no pick (an empty hex bar is about 45 lb:
  // over 30 % of a 145-lb swimmer); a loaded jump never opens the plan (the Land stage, the first exercise block)
  const LJ = R.athletic.x2 && R.athletic.x2.loaded_jump;
  if (LJ && (PLYO_BUCKETS.includes(eb) || eb === 'AP_TRIPLE_EXT') && (tags.includes('loaded_jump') || (ex.athletic && ex.athletic.loaded_jump))) {
    const minLb = (LJ.implement_min_lb || {})[ex.id];
    const bw = E.derived.body_weight_lb;
    if (typeof minLb === 'number' && typeof bw === 'number' && bw > 0 && minLb > LJ.max_bw_share * bw + EPS) return { ok: false, step: 'loaded_jump' };
    if (PLYO_BUCKETS.includes(eb) && !(LJ.stage_exempt_tags || []).some((t) => tags.includes(t)) && ((LJ.never_stages || []).includes(E.stage) || (LJ.never_first_block && E.firstStageBlock))) return { ok: false, step: 'stage' };
  }
  // 4b. sport profile plyo rules (review 01 major 3: no depth jumps / bounds / hurdle hops for a class-5 swimmer; 08 blocker)
  if (PLYO_BUCKETS.includes(eb) && E.plyoRules && (E.plyoRules.exclude_tags || []).some((t) => tags.includes(t))) return { ok: false, step: 'profile' };
  // the profile's 50+ exclusions (R3-ATH-02, B2): from 50 only, lifted by the racket impact switch (50-59) or the 60+ opt-in
  if (PLYO_BUCKETS.includes(eb) && E.plyoRules && (E.age || 0) >= R.population.active_aging_50.from_age && !E.racketOptIn && !E.optIn &&
      (E.plyoRules.exclude_tags_age_50 || []).some((t) => tags.includes(t))) return { ok: false, step: 'age_50' };
  // v0.4 fix round 2 / F2 (E-169; 04 rec_pickleball resistance.avoid 'fast backpedal drills (fall mechanism)'; RECHECK v0.4 08 major: a
  // 52-year-old court player's RC3 ankle drill was backward hopping): no backward hop drill for a profile with a court-fall hot spot
  // or a 50+ court / 60+ client
  const BKH = E.R2S && E.R2S.backward_hops_avoid;
  if (BKH && PLYO_BUCKETS.includes(eb) && new RegExp(BKH.id_re).test(ex.id) && ((BKH.codes || []).some((c) => E.injuries.has(c)) || E.racket50 || (E.older && !E.optIn))) return { ok: false, step: 'profile' };
  // a landing (stick) drill is the Receive stage only: from RC2 on the station takes a jump that can be done 'land & go' or
  // repeated (R2-ATH-03, CAT-10; review 01 / 02 / 03 / 08); older default (landing drills only) keeps them
  if (PLYO_BUCKETS.includes(eb) && R.athletic.landing_rc1_only && ex.athletic && ex.athletic.quality === 'landing' && E.stage !== 'RC1' && !(E.older && !E.optIn)) return { ok: false, step: 'stage' };
  // v0.4 stage B2: stage 3 'Repeat' takes a repeated-contact plyometric only - a depth jump / drop & go is one rebound (R2-ATH-03;
  // RECHECK 02 major 'single-response depth jumps get the repeat cue')
  if (PLYO_BUCKETS.includes(eb) && R.athletic.rc3_plyometric_response && E.stage === 'RC3' && ex.athletic && ex.athletic.quality === 'plyometric' &&
      !(ex.athletic.upper) && responseOf(ex) !== R.athletic.rc3_plyometric_response) return { ok: false, step: 'stage' };
  // stage 1 'Land' (R2-ATH-03): landings and ballistic jumps; the only plyometric work is the low-amplitude ankle / pogo kind
  // (RECHECK random corpus: tuck / squirrel jumps in a Receive week)
  if (PLYO_BUCKETS.includes(eb) && R.athletic.rc3_plyometric_response && E.stage === 'RC1' && ex.athletic && ex.athletic.quality === 'plyometric' && !ex.athletic.upper && !ex.athletic.low_amplitude) return { ok: false, step: 'stage' };
  // first reactive block: bilateral and unloaded reactive jumps only; single-leg reactive work after one bilateral stage-2 block
  if (PLYO_BUCKETS.includes(eb) && E.FR && ex.athletic && ex.athletic.quality === 'plyometric' && responseOf(ex) === 'single' && !ex.athletic.upper) {
    if (E.firstReactive && (isUnilateral(ex) || tags.includes('split_grip') || ex.equipment.any_of.every((su) => su.includes('dumbbell')))) return { ok: false, step: 'first_reactive' };
    if (E.FR.single_leg_reactive_after_bilateral_block && isUnilateral(ex) && !E.priorRc2) return { ok: false, step: 'first_reactive' };
  }
  // COD drills of one sport (American-football routes; RECHECK 03 major) and drills with no cut never fill a COD station
  if (eb === 'AP_COD' && ex.athletic && (ex.athletic.no_cuts || (Array.isArray(ex.athletic.sport_only) && !ex.athletic.sport_only.includes(E.sportId)))) return { ok: false, step: 'sport' };
  // the no-medball substitute (fake slam) only without a ball (EQ-07; RECHECK 01 major)
  if (E.hasBall && (R.medball.no_ball_only_ids || []).includes(ex.id)) return { ok: false, step: 'medball' };
  // a jerk is a catch lift, never a hypertrophy press; a push press presses for athletes / class-model clients only (B2)
  const ONR = R.selection.olympic_never_in_resistance;
  if (ONR && ['resistance', 'isolation', 'focus'].includes(bk) && (ONR.tags.some((t) => tags.includes(t)) || (tags.includes('push_press') && !(ONR.push_press_families || []).includes(E.family)))) return { ok: false, step: 'never' };
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
    // v0.5 / V4 (rules.selection.floor_work; the benchmark's 74-year-old with body weight only: glute bridges, slider curls and no
    // push at all): "no floor work" covers every lift done lying, sitting or kneeling on the floor, and it does not cover a push-up
    // with the hands on a bench or a table - nobody gets down on the floor for that one
    if (x === 'floor_work') {
      const FW = R.selection.floor_work || {};
      const notFloor = !!FW.not_floor_id_re && new RegExp(FW.not_floor_id_re).test(ex.id);
      if (!notFloor && ((bk === 'core' && FLOOR_CORE_RE.test(ex.id)) || tags.includes('push_up_floor') || (!!FW.floor_lift_id_re && new RegExp(FW.floor_lift_id_re).test(ex.id)))) return { ok: false, step: 'exclusion' };
    }
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
  if (E.model.isDefaultIn(ex, eb) || (eb === 'AP_TRIPLE_EXT' && E.preferIds.has(ex.id))) return true;
  // (fix round 2, rules.olympic.x2.l2_block1: the hang power lifts are the L2 lifter's first-block default)
  const LB = E.R.olympic.x2 && E.R.olympic.x2.l2_block1;
  if (eb === 'AP_TRIPLE_EXT' && !!LB && (LB.levels || []).includes(E.lvl) && E.exerciseBlock === 1 && !E.older && !E.youth && (LB.ids || []).includes(ex.id)) return true;
  // (fix round 2, rules.selection.x2.small_kit_rows: in a kit with no library two-arm row the reference-tab dumbbell rows are picks)
  const SK = E.R.selection.x2 && E.R.selection.x2.small_kit_rows;
  return eb === 'RP_HPULL' && !!SK && !!E.smallKitRows && (SK.ids || []).includes(ex.id);
}

// (implementOf - the implement class of an exercise - lives in engine/library.mjs since v0.5 / V2: the swap notes read it too)

// a record no set-up of which holds a load (body-weight bridges, push-ups, table rows): fix round 2 / F3
const LOAD_TOKENS_SEL = ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine_selectorized', 'machine_plate_loaded', 'machine_specialty', 'hex_bar', 'ez_bar', 'medball', 'weight_plate', 'sandbag', 'landmine', 'smith', 'slam_ball', 'sled', 'reverse_hyper', 'hyper_bench', 'ghd', 'belt_squat', 'dip_belt'];
function noLoad(ex) { return !!ex && !ex.equipment.machine && !(ex.tags || []).includes('machine') && !ex.equipment.any_of.some((su) => su.some((t) => LOAD_TOKENS_SEL.includes(t))); }

/** plyo direction from the record id (INFERRED; the 04 direction_pct split) */
function directionOf(ex) {
  if (/lateral|side|zig-zag|skater|cossack/.test(ex.id)) return 'lateral';
  if (/broad|forward|bound|hurdle|zig|backward/.test(ex.id)) return 'horizontal';
  return 'vertical';
}
const ANTI_CORE_RE = /(plank|pallof|dead-bug|bird-dog|hollow|suitcase|offset|anti)/;
const stage0 = (E) => E.stage || 'RC1';

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
  // assisted variants for experienced lifters, home substitutes in a gym that has the real thing (review 07); B3: a feet-supported
  // pull-up is an assisted variant too (RECHECK 01 minor)
  const assisted = tags.includes('assisted') || (R.selection.assisted_id_re && new RegExp(R.selection.assisted_id_re).test(ex.id));
  if (typeof w.assisted_l2_l3 === 'number' && assisted && ['L2', 'L3'].includes(E.lvl) && !E.older && E.clientFamily !== 'older_or_pain') s += w.assisted_l2_l3;
  // B3 (RECHECK 03 / 04 / 05 / 06 majors): the day's lead chest press is a two-arm press - never alternating / one-arm while one
  // passes the kit, never a floor press or push-up while a bench press does; powerlifting-style clients press with both arms
  // (VOL-12, RECHECK 07 major); L1, 50+ and pain clients take dumbbells / kettlebells / machines before a barbell (EQ-09, RECHECK 08)
  const LP = R.selection.lead_press;
  if (LP && LP.buckets.includes(eb) && day && bk === 'resistance') {
    const firstPress = daySlots(day).find((x) => LP.buckets.includes(x.bucket) && model.bucket(x.bucket).kind === 'resistance');
    if (firstPress && firstPress.slot_id === slot.slot_id) {
      // (fix round 2 / F3, E-179: a station the upper-body dial marks one-arm takes its one-arm / alternating press - never a floor press
      // while a bench press passes the kit)
      const dialUni = !!(E.upperWant && E.upperWant.get(slot.slot_id) === 'uni');
      // v0.5 / V2 (coach-eye reviews 03 / 04 / 05 / 06: an alternating floor press, a floor press or an offset push-up as the lead chest
      // lift): the one-arm / alternating penalty also holds in a body-weight kit that has a two-arm push-up, and a floor press or
      // push-up pays its own penalty on top while a bench or machine press passes the kit (rules.selection.v2.lead_press)
      const LP2 = (R.selection.v2 && R.selection.v2.lead_press) || null;
      const twoArmKit = E.pressAlt.twoArm || (!!LP2 && LP2.body_weight_two_arm_first && E.pressAlt.twoArmAny);
      const oneArm = !dialUni && twoArmKit && (new RegExp(LP.avoid_re).test(ex.id) || ex.laterality !== 'bilateral');
      if (oneArm) { s += LP.penalty; reasons.push(why('why.lead_press', 'ORD-07')); }
      if (E.pressAlt.bench && new RegExp(LP.floor_re).test(ex.id) && (!oneArm || !!LP2)) s += LP.floor_penalty;
    }
  }
  // v0.5 / V4 (OBSERVED BYOP PUSHPULLLEGS 'Tricep - Push', 'Tricep - Overhead'): a slot that names a kind of exercise prefers it
  const SV = R.selection.slot_variants && R.selection.slot_variants[eb] && slot.variant ? R.selection.slot_variants[eb][slot.variant] : null;
  if (SV && SV.id_re && new RegExp(SV.id_re).test(ex.id)) s += SV.weight;
  // v0.5 / V4 (COACH-R4 R4-SES-05 A day slot 1 'horizontal pull, bilateral, symmetrical'; OBSERVED BYOP 'Bent Over Barbell Rows'): the
  // A day's first row is a two-arm row; one-arm rows stay in the swaps and in the day's other pull slot
  const LR = R.selection.skeleton_laterality && R.selection.skeleton_laterality.lead_row;
  if (LR && eb === LR.bucket && day && (LR.skeletons || []).includes(day.skeleton) && bk === 'resistance') {
    const firstRow = daySlots(day).find((x) => x.bucket === LR.bucket);
    if (firstRow && firstRow.slot_id === slot.slot_id && ex.laterality !== 'bilateral') s += LR.penalty;
  }
  // v0.5 / V2 (COACH-R4 R4-LIB-03 'for bodybuilders ... and for the general population I would rather focus more on incline pressing
  // and bias incline pressing instead of overhead pressing'; R4-SES-05 B day slot 3 'vertical push ... or an incline press'): in the
  // vertical / mid-range push slot an incline (mid-range) press comes first; overhead pressing stays in the pool and the swaps
  const IF = R.selection.incline_first;
  const inclineSlot = !!IF && eb === IF.bucket && bk === 'resistance' && inclineFirstOn(E);
  if (inclineSlot && tags.includes(IF.tag)) {
    // (an incline press takes the full weight; the other mid-range presses - landmine, viking - half of it)
    s += new RegExp(IF.incline_re || 'incline').test(ex.id) ? IF.weight : (typeof IF.weight_other === 'number' ? IF.weight_other : IF.weight / 2);
    reasons.push(why('why.incline_first', 'R4-LIB-03'));
  }
  const PP = R.selection.powerlifting_presses;
  if (PP && E.derived.lift_style === PP.lift_style && PP.buckets.includes(eb) && bk === 'resistance' && (new RegExp(PP.avoid_re).test(ex.id) || ex.laterality !== 'bilateral')) s += PP.penalty;
  const BB = R.selection.barbell_l1_50_pain;
  if (BB && ['resistance', 'isolation'].includes(bk) && implementOf(ex) === 'barbell' && (BB.levels.includes(E.lvl) || (E.age || 0) >= BB.from_age || E.pain.length) &&
      !(slot.role === 'work' && ['strength', 'hybrid_crossfit'].includes(E.family))) s += BB.penalty;
  const PA = R.selection.pain_avoid_id_patterns;
  if (PA) for (const p of E.pain) for (const re of PA[p.area] || []) if (new RegExp(re).test(ex.id)) s += (typeof w.hotspot_avoid === 'number' ? w.hotspot_avoid : -3);
  const CW = R.selection.class_work_prefer_id_patterns, WBc = R.selection.work_bilateral_canonical;
  const canonFam = E.family === 'hybrid_crossfit' || (WBc && (WBc.families.includes(E.family) || WBc.goals.includes(E.goal)));
  if (CW && canonFam && slot.role === 'work' && slot.axial_req === 'axial' && (CW[eb] || []).some((re) => new RegExp(re).test(ex.id))) s += 4;
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
  // v0.4 fix round 2 / F3 (E-179; COACH-ANSWER UNI-02 / UNI-03 'the bilateral vs unilateral relationship is very important'; UNI-07; RECHECK
  // v0.4 02 major, 03 minor, 06 major: 56-65 % two-arm against 20-30 %; 55 % against 80-90 %): a station the upper-body dial marked takes
  // the laterality it was marked with (selectBlock sets E.upperWant); other upper slots keep the week's running share
  const upWant = E.upperWant && UPPER_RP.includes(eb) ? E.upperWant.get(slot.slot_id) : null;
  if (upWant) {
    const UD = E.S2.upper_dial;
    const isBil = ex.laterality === 'bilateral';
    if (isBil === (upWant === 'bil')) { s += UD.weight; if (!isBil) reasons.push(why('why.laterality_share_upper', 'UNI-02', { pct: Math.round((E.upperTarget || 0) * 100) })); }
    else s -= UD.weight;
    if (upWant === 'uni' && E.pressAlt.bench && LP && new RegExp(LP.floor_re).test(ex.id) && typeof UD.floor_press_when_bench === 'number') s += UD.floor_press_when_bench;
  } else if (UPPER_RP.includes(eb) && E.upperTarget != null && !inclineSlot) {
    // (v0.5 / V2: the incline-first slot stays out of the running two-arm share - its incline presses are two-arm)
    const cur = st.upper.tot ? st.upper.bil / st.upper.tot : 0;
    const wantBil = cur < E.upperTarget;
    const isBil = ex.laterality === 'bilateral';
    if (wantBil === isBil) s += R.bilateral_share.selection_enforced ? 2 : 1;
  }
  if (LOWER_RP.includes(eb) && E.lowerTarget != null && R.bilateral_share.selection_enforced && !slot.laterality_dial && slot.role !== 'work') {
    const cur = st.lower.tot ? st.lower.bil / st.lower.tot : 0;
    if ((cur < E.lowerTarget) === (ex.laterality === 'bilateral')) s += 1.5;
  }
  // v0.4 fix round 1 / F3 (UNI-02; RECHECK 01: the optional day's added quad / hamstring exercises were all two-legged and took the share
  // to 80 % against 55 %): a Focus / bonus slot for a lower muscle steers the share like a lower station
  if (E.F3 && E.F3.dial && bk === 'focus' && E.lowerTarget != null && ['BKD', 'BHD', 'UKD', 'UHD'].includes(ex.credit_class)) {
    const cur = st.lower.tot ? st.lower.bil / st.lower.tot : 0;
    if ((cur < E.lowerTarget) === (ex.laterality === 'bilateral')) s += 2;
  }
  // athletic: plyo / ballistic share and Receive-Create stage (R2-ATH-01, R2-ATH-03)
  if (ex.athletic && CONTACT_BUCKETS.includes(eb)) {
    const q = ex.athletic.quality;
    if (E.reactiveWant !== null && eb === 'AP_PLYO' && slot.variant !== 'upper') {
      // B2: the profile's reactive jump stations first, then ballistic ones
      const wantPlyo = (st.reactive || 0) < E.reactiveWant;
      // (F2: the station's role - reactive or ballistic - follows the share and outweighs the drill preferences of the stage)
      const roleW = R.athletic.f2 && R.athletic.f2.share ? 10 : 2;
      if ((q === 'plyometric') === wantPlyo) { s += roleW; reasons.push(why('why.plyo_share', 'R2-ATH-01', { pct: Math.round((E.plyoTarget || 0) * 100) })); }
    } else if (E.plyoTarget != null && eb !== 'AP_THROW' && !(st.plyo.b2 && (eb === 'AP_JUMP_LIMITED_KNEE' || slot.variant === 'upper'))) {
      const sets = baseSets(slot);
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
    // v0.4 fix round 1 / F2 (RECHECK 01 major: the same box jump in 'Land', 'Land & Go' and 'Repeat'; 03 minor: an advanced depth jump
    // for an intermediate; 08: the same low box jump in every stage): a ballistic station lands on a box in stage 1 (stick it) and
    // jumps from the floor from stage 2 (land & go, then 2-3 in a row: squat / broad / streamline jumps); a jump station moves to a
    // drill it has not used earlier in the training block; a drill above the client's exercise ladder waits; the ankle block starts in
    // place on two feet and takes direction / one leg later
    const F2S = R.athletic.f2 && R.athletic.f2.stage_drill_change;
    if (F2S && F2S.enabled && PLYO_BUCKETS.includes(eb) && slot.variant !== 'upper' && !ex.athletic.upper) {
      const prevF = E.prev && E.prev.fills ? E.prev.fills[slot.slot_id] : null;
      const hist = [...((E.history && E.history[slot.slot_id]) || []), ...(prevF && prevF.exercise_id ? [prevF.exercise_id] : [])];
      if (E.stageMoved && hist.includes(ex.id)) s -= 3;
      const L = E.ladderOrder || [];
      if (L.indexOf(ex.level) > L.indexOf(E.ladder) && L.indexOf(E.ladder) >= 0) s -= 1.5;
      if (q === 'ballistic' && eb === 'AP_PLYO') {
        // (the floor jumps are reference / proposed records: their stage bonus outweighs the library and default-pick weights)
        if (E.stage === 'RC1' && !isFloorJump(ex) && !tags.includes('loaded_jump')) s += 1;
        if (E.stage && E.stage !== 'RC1' && isFloorJump(ex)) s += 6;
        if (E.stage && E.stage !== 'RC1' && !isFloorJump(ex) && !tags.includes('loaded_jump')) s -= 1;
      }
      if (tags.includes('high_depth_drop')) s -= 2; // EQ-16: a high drop is never the pick while a lower one passes
      // COACH-R3 R3-ATH-02 (racket players 50+, 60+: low-impact jumps only; RECHECK 08 major: the same low box jump in every stage):
      // stage 1 sticks the landing, stage 3 takes quick low hops (pogos / lateral line hops), never a high-impact repeat
      if ((E.racket50 || E.older) && eb === 'AP_PLYO') {
        if (E.stage === 'RC1' && q === 'landing') s += 4;
        if (E.stage === 'RC3' && responseOf(ex) === 'repeat' && !tags.includes('high_impact') && (ex.athletic.low_amplitude || ['frontal', 'multi'].includes(ex.plane))) s += 4;
      }
      // the sport's jump directions and single-leg share across the week's jump stations (04 plyo_rules.direction_pct /
      // unilateral_pct; RECHECK 03 blocker: no horizontal or single-leg jump for a 40 % horizontal, 60 % single-leg soccer profile;
      // 08: no lateral jump for a 60 % lateral racket player): the least-served direction first; single-leg after the first block
      const PRr = E.plyoRules || {};
      if (eb === 'AP_PLYO' && PRr.direction_pct) {
        const dj = st.jumpDirs || {}, nj = Object.values(dj).reduce((a, b) => a + b, 0);
        const dir = directionOf(ex), want = (PRr.direction_pct[dir] || 0) / 100;
        if (want > 0 && (nj ? (dj[dir] || 0) / nj : 0) < want - EPS) s += 2 * want;
      }
      if (eb === 'AP_PLYO' && typeof PRr.unilateral_pct === 'number' && !E.firstStageBlock && !(E.firstReactive && q === 'plyometric')) {
        const ju = st.jumpUni || { n: 0, u: 0 };
        const under = (ju.n ? ju.u / ju.n : 0) < PRr.unilateral_pct / 100 - EPS;
        if (under && isUnilateral(ex)) s += 1.5;
      }
      // E-32 (the first reactive block lands on two feet): a single-leg repeat drill waits too, not only a single-leg depth jump
      if (E.FR && E.firstReactive && q === 'plyometric' && isUnilateral(ex)) s -= 6;
      if (eb === 'AP_JUMP_LIMITED_KNEE' && F2S.ankle_first_block_in_place) {
        // in place on two feet first, then a direction on two feet (the sport's directions: lateral for a racket player), one leg
        // from the third block (CAT-10 'bilateral before unilateral')
        const inPlace = ex.laterality === 'bilateral' && ex.plane === 'sagittal' && /in-place|pogo/.test(ex.id);
        if (E.firstStageBlock) s += inPlace ? 3 : 0;
        else {
          if (inPlace) s -= 1;
          if (E.ebIdx === 1 && isUnilateral(ex)) s -= 2;
          const dpA = E.plyoRules && E.plyoRules.direction_pct;
          if (dpA && !inPlace) s += 2 * ((dpA[directionOf(ex)] || 0) / 100);
        }
      }
    }
    // RC3 'Repeat' needs a repeated-contact drill (hops, pogos, hurdle hops, bounds), never a single depth drop (review 02 / 03);
    // v0.4 B2: single-response plyometrics are filtered out in stage 3 (hardFilter), so the share decides plyo vs ballistic here
    if (stage === 'RC3' && eb === 'AP_PLYO' && !R.athletic.rc3_plyometric_response) s += tags.includes('plyo_repeated') ? 2 : -2;
    // B2: the first exercise block of a training block lands on two feet (CAT-10; RECHECK 01 minor 'single-leg / weighted depth
    // drop in week 1 for a swimmer'); a week holds at most E.depthCap depth-jump stations (heavier athletes / beginners 1)
    if (E.FR && E.FR.first_block_bilateral_landing && E.firstStageBlock && eb !== 'AP_THROW' && (ex.laterality !== 'bilateral' || tags.includes('split_grip'))) s -= 3;
    if (E.FR && tags.includes('depth_jump') && (st.depthUsed || 0) >= E.depthCap) s -= 8;
    // the sport's jump directions (04 direction_pct; review 01 / 08: no lateral plate hops for a 5 % lateral swimmer)
    const dp = E.plyoRules && E.plyoRules.direction_pct;
    if (dp && eb !== 'AP_THROW' && typeof w.direction_match === 'number') s += w.direction_match * ((dp[directionOf(ex)] || 0) / 100) * 2 - w.direction_match / 2;
    // bilateral before single-leg inside a stage (CAT-10), and the kit's own implements (hurdles, EQ-16)
    if (eb !== 'AP_THROW' && ex.laterality !== 'bilateral' && stage === 'RC1') s -= 1;
    if (tags.includes('hurdle_hop') && E.kitObj.tokens.has('hurdles')) s += 0.5;
    // the throw planes of the sport (04 throwing.plane_pct; rotational station for racket / swim, review 01 / 08)
    if (eb === 'AP_THROW' && E.sport && E.sport.throw_plane_pct) {
      const tp = E.sport.throw_plane_pct;
      const pl = ex.plane === 'transverse' ? 'transverse' : 'sagittal';
      const used = st.throwPlanes[pl] || 0;
      if ((tp[pl] || 0) >= 50 || used === 0) s += 1.5;
      // F2 (RECHECK 01 major: a 65 % sagittal swimmer's only throw was a rotational scoop): the week's first throw station takes the
      // sport's main plane, the next one the other plane
      const FT = R.athletic.f2 && R.athletic.f2.throws;
      if (FT && FT.majority_plane_first) {
        const anyUsed = Object.values(st.throwPlanes).reduce((a, b) => a + b, 0);
        const major = (tp.sagittal || 0) >= (tp.transverse || 0) ? 'sagittal' : 'transverse';
        if (!anyUsed && pl === major) s += 2;
        if (anyUsed && !used) s += 1.5;
      }
    }
    // F2 (RECHECK 02 / 03 majors: 'Left-Facing, Left Leg Up' dosed per side): a one-side record waits while a both-sides one passes
    if (eb === 'AP_THROW' && R.athletic.f2 && R.athletic.f2.throws && R.athletic.f2.throws.one_side_id_re && new RegExp(R.athletic.f2.throws.one_side_id_re).test(ex.id)) s -= 6;
  }
  // v0.4 fix round 2 / F2 (rules.athletic.r2.selection; every weight PROPOSED, DECISIONS E-167 ... E-171)
  const R2S = E.R2S;
  // (E-171: the reactive COD drill takes the week's LAST COD station - a test week's 5-10-5 replaces the first one, so the reaction
  // work stays in every week)
  const codLastOk = !(R2S && R2S.cod_tiers) || !E.lastCodSlot || slot.slot_id === E.lastCodSlot;
  if (R2S && ex.athletic) {
    const q = ex.athletic.quality;
    const jumpB = PLYO_BUCKETS.includes(eb) && slot.variant !== 'upper' && !ex.athletic.upper;
    // E-167 (RECHECK v0.4 02 / 03 minors: a swimmer's streamline squat jump for a linebacker and a midfielder): a jump or COD drill the
    // library writes for other sports waits while one without a sport label, or one for the client's sport, passes
    const OS = R2S.other_sport;
    if (OS && OS.buckets.includes(eb) && E.sportId && (ex.sport_use || []).length && !(OS.generic_ids || []).includes(ex.id)) {
      const words = [...E.sportWords];
      const hit = ex.sport_use.some((u) => { const x = String(u).toLowerCase().replace(/_/g, ' '); return words.some((wd0) => x.includes(wd0) || wd0.includes(x)); });
      if (!hit) s += OS.penalty;
    }
    if (jumpB) {
      const PRq = E.plyoRules || {};
      // E-167 (RECHECK v0.4 03 major: no single-leg and no horizontal jump in 8 weeks for a 60 % single-leg, 40 % horizontal sport): a
      // trained athlete (L2+) of a sport that jumps mostly off one leg takes single-leg and directional ballistic jumps and landings
      // from the first block - the reactive single-leg drills still wait for a two-foot block (E-32)
      const FB = R2S.first_block_single_leg;
      const fbOk = !!FB && E.firstStageBlock && FB.levels.includes(E.lvl) && typeof PRq.unilateral_pct === 'number' && PRq.unilateral_pct >= FB.min_unilateral_pct && FB.qualities.includes(q) && !E.lowImpact;
      if (fbOk && isUnilateral(ex)) {
        if (E.FR && E.FR.first_block_bilateral_landing && !tags.includes('split_grip')) s += 3; // (gives back the first-block two-feet penalty)
        if (stage0(E) === 'RC1') s += 1;
        const ju = st.jumpUni || { n: 0, u: 0 };
        if ((ju.n ? ju.u / ju.n : 0) < PRq.unilateral_pct / 100 - EPS) s += 1.5;
      }
      // E-169 (04 plyo.direction_pct; RECHECK v0.4 08 major: no lateral contact in 12 weeks for a 60 % lateral sport): a sport whose
      // jumps are mostly lateral holds a lateral jump or ankle station every week - on two feet in the first block
      const LQ = R2S.lateral_quota;
      const dp = PRq.direction_pct;
      if (LQ && dp && (dp.lateral || 0) >= LQ.min_pct && !st.lateralAny && directionOf(ex) === 'lateral' && !(E.firstStageBlock && ex.laterality !== 'bilateral')) s += LQ.bonus;
      // E-169 (COACH-R3 R3-ATH-02 'only low-impact jumps'; RECHECK v0.4 08 major: floor squat jumps for a 52-year-old with knee pain): a
      // low-impact client (court 50+, 60+, knee or ankle pain) keeps the jump that lands on a box in every stage - the floor jumps of
      // stages 2 and 3 are for the others
      const LI = R2S.low_impact;
      if (LI && E.lowImpact && eb === 'AP_PLYO' && q === 'ballistic' && E.stage && E.stage !== 'RC1') {
        if (isFloorJump(ex)) s += LI.floor_jump; else if (!tags.includes('loaded_jump')) s += LI.box_jump;
      }
      // E-170 (CAT-10 'unilateral is harder'; RECHECK v0.4 02 minor: four single-leg reactive drills a week for a 230-lb linebacker): a
      // heavy athlete holds at most `max` single-leg reactive stations a week
      const SLR = R2S.single_leg_reactive_heavy;
      if (SLR && E.heavy && q === 'plyometric' && isUnilateral(ex) && (st.uniReactive || 0) >= SLR.max_wk) s += SLR.penalty;
    }
    // E-171 (COACH-ANSWER PER-02 / PER-03 'athletes like variety'; RECHECK v0.4 02 / 08 minors: the same throw for 12 weeks): a throw
    // station takes another throw of its plane at each exercise-block start, never back to an earlier block's
    const TC = R2S.throw_change_per_block;
    if (TC && eb === 'AP_THROW') {
      const prevT = E.prev && E.prev.fills ? E.prev.fills[slot.slot_id] : null;
      if (prevT && prevT.exercise_id === ex.id) s += TC.same_as_previous;
      else if (((E.history && E.history[slot.slot_id]) || []).includes(ex.id)) s += TC.earlier_block;
    }
    // E-171 (05 template note 'tiered by turn angle (EASY -> MOD. -> HARD TURN)', ATH-06; 04 cod.reactive; RECHECK v0.4 02 minor: the same
    // two routes for 12 weeks, no reactive drill for a reactive-COD profile): a COD station takes the turn tier of its exercise block
    // (easy, then moderate, then hard turns) and a reactive-COD profile holds its reactive drill from the Land & Go stage on
    const CT = R2S.cod_tiers;
    if (CT && eb === 'AP_COD') {
      const tier = CT.by_id[ex.id];
      const wantTier = RC_RANK[stage0(E)] || 1;
      if (typeof tier === 'number') s += tier === wantTier ? CT.match : tier > wantTier ? CT.above * (tier - wantTier) : CT.below * (wantTier - tier);
      const CF2r = R.athletic.f2 && R.athletic.f2.cod;
      if (E.sport && E.sport.cod_reactive && CF2r && (CF2r.reactive_drill_ids || []).includes(ex.id) && !st.codReactive && codLastOk) s += E.stage === 'RC1' ? CT.reactive_before_rc2 : CT.reactive_from_rc2;
    }
  }
  // B2: up to rules.athletic.circuit_ballistic.per_week circuit stations a week are ballistic (alternating ball / swing)
  if (eb === 'COND_CIRCUIT' && E.circuitBallistic) {
    const ballistic = !!(ex.medball || tags.includes('kb_swing'));
    const n = st.circBall || 0;
    if (ballistic) {
      // at most one medball station and one KB swing a week (the weekly throw budget is 20-40 for a general client)
      const kind = tags.includes('kb_swing') ? 'swing' : 'ball';
      const usedKind = (st.circBallKinds || new Set()).has(kind);
      s += n < E.R.athletic.circuit_ballistic.per_week && !usedKind ? 6 : -8;
      // v0.4 fix round 2 / F2 (E-174; 04 general_population throw_plane_pct 50 / 50; RECHECK v0.4 05 minor: every throw sagittal for 8
      // weeks): the circuit's ball station changes plane at the exercise-block start when the profile throws in both planes
      const CPR = E.R2S && E.R2S.circuit_throw_plane_rotate;
      const tpp = E.sport && E.sport.throw_plane_pct;
      const prevC = E.prev && E.prev.fills ? E.prev.fills[slot.slot_id] : null;
      const prevEx = prevC && prevC.exercise_id && model.hasEx(prevC.exercise_id) ? model.ex(prevC.exercise_id) : null;
      if (CPR && kind === 'ball' && tpp && Math.min(tpp.sagittal || 0, tpp.transverse || 0) >= CPR.min_pct && prevEx && prevEx.medball) {
        const pl = (e) => (e.plane === 'transverse' ? 'transverse' : 'sagittal');
        s += pl(ex) !== pl(prevEx) ? CPR.other_plane : CPR.same_plane;
      }
    }
  }
  // sprint drill by the profile's sprint focus (04 sprint.focus; LIB-21: accelerations before max velocity; RECHECK 02 / 03 minors
  // 'a max-velocity drill dosed at acceleration distances', 'no acceleration station'): the first sprint station of the week
  // takes the focus (accelerations for '0-20 yd' profiles), a second station the other kind
  // F2 (RECHECK 03 minor: no reactive COD drill although soccer COD is reactive, 04 cod.reactive): a reactive-COD profile holds one
  // reactive drill a week (split-step reaction)
  const CF2 = R.athletic.f2 && R.athletic.f2.cod;
  if (eb === 'AP_COD' && CF2 && E.sport && E.sport.cod_reactive && (CF2.reactive_drill_ids || []).includes(ex.id)) s += st.codReactive || !codLastOk ? -2 : 4;
  if (eb === 'AP_SPRINT' && ex.athletic && ex.athletic.sprint_kind && E.sprintFocus) {
    const kind = ex.athletic.sprint_kind;
    const want = E.sprintFocus === 'both' ? ((st.sprintKinds || new Set()).has('acceleration') ? 'max_velocity' : 'acceleration') : E.sprintFocus;
    if (kind === want) { s += 4; reasons.push(why('why.sprint_focus', 'LIB-21', { kind: 'sprint.kind.' + kind })); }
    else if (kind === 'drill' || kind === 'run') s -= 2;
  }
  // Olympic: profile preference, L2+ scope from block 2 for L2 and always for L3 (ATH-10); v1.2: from there pulls are the
  // second item only, the catch lifts lead (review 04 major 6)
  if (eb === 'AP_TRIPLE_EXT' && ex.athletic) {
    if (E.preferIds.has(ex.id)) s += 3;
    const l2plusAllowed = E.lvl === 'L3' || (E.lvl === 'L2' && E.exerciseBlock > 1);
    if (l2plusAllowed && ex.athletic.olympic_tier === 'L2_plus') { s += 3; reasons.push(why('why.olympic_level', 'ATH-10')); }
    if (l2plusAllowed && /pull/.test(ex.id) && !E.preferIds.has(ex.id)) s -= 3;
    if (st.olyUsed.has(ex.id)) s -= 2; // vary the Olympic lift across the week
    // (fix round 2, sample 04 major: an L2 lifter's first block is the hang power snatch / clean, the pulls are its swaps)
    const LB1 = R.olympic.x2 && R.olympic.x2.l2_block1;
    if (LB1 && (LB1.levels || []).includes(E.lvl) && E.exerciseBlock === 1 && !E.older && !E.youth) {
      if ((LB1.ids || []).includes(ex.id)) { s += LB1.weight; reasons.push(why('why.olympic_level', 'ATH-10')); }
      else if (/pull/.test(ex.id) && !E.preferIds.has(ex.id)) s += LB1.pull;
    }
  }
  // a station serving another group than its bucket's (e.g. the PPL push day's triceps press) prefers lifts that credit
  // that group at >= 0.5 (dips, close-grip work) - INFERRED weight
  if (offGroup && model.groupMembers(slot.group).some((m) => (ex.credits[m] || 0) >= 0.5)) s += 4;
  // Focus: isolation or constraint >= 4 preferred; B3 (RECHECK 06 minor: a body-weight floor glute bridge as an L3's priority Focus):
  // a trained lifter's Focus exercise takes load
  if (bk === 'focus' && (ex.exercise_class === 'isolation' || ex.constraint >= 4)) s += 1;
  if (bk === 'focus' && ['L2', 'L3'].includes(E.lvl) && ex.load_ceiling === 'low' && !E.older && slot.focus_muscle && model.muscle(slot.focus_muscle).class === 'big') s -= 3;
  // B3: the class model's skill station follows the template's own word ('DUBS' -> double-unders, 'GYMNASTICS'; RECHECK 04 minor)
  if (eb === 'SKILL' && (slot.note_tokens || []).some((t) => ex.id.includes(t))) s += 4;
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
  // B3 (RECHECK 02 minor: kickstand DB deadlift Monday + alternating staggered DB deadlift Tuesday): a second weekly exposure is a
  // different exercise, not another version of the same one (PER-04)
  if (bk === 'resistance' && slot.role !== 'work' && R.selection.near_duplicate) {
    for (const [d2, picks] of st.dayPicks) if (d2 !== wd && picks.some((x) => x.ex && !x.ex.is_athletic && x.ex.id !== ex.id && nearDuplicate(x.ex, ex, R))) { s -= 2; break; }
  }
  if (E.F3) s += f3Score(ex, slot, eb, E, st, day, bk, wd, reasons);
  if (E.S2) s += r2Score(ex, slot, eb, E, st, day, bk, wd, reasons);
  if (R.selection.x1) s += x1Score(ex, slot, eb, E, st, day, bk, wd, over);
  if (R.selection.x2) s += x2Score(ex, slot, eb, E, st, day, bk, wd, reasons);
  return { score: Math.round(s * 1000) / 1000, reasons };
}

/** the credit class a pick is compared by in the second pass: a high-incline press (MRPUSH, v0.5 fix round 1) is still the
 *  vertical / mid-range push slot's press, so it may give way to an overhead press and back */
const profileClass = (cc) => (cc === 'MRPUSH' ? 'VPUSH' : cc);

/** is this slot the day's first chest press (the lead press)? */
function isLeadPress(slot, day, E) {
  const LP = E.R.selection.lead_press;
  if (!LP || !day || !LP.buckets.includes(slot.bucket)) return false;
  const first = daySlots(day).find((x) => LP.buckets.includes(x.bucket) && E.model.bucket(x.bucket).kind === 'resistance');
  return !!first && first.slot_id === slot.slot_id;
}

/**
 * v0.5 fix round 1 (rules.selection.x1.chest_shoulders; OBSERVED BYOP label 'Chest/Shoulders' on the B day's slot 3; COACH-R4
 * R4-SES-05 'vertical push, like shoulder press or an incline press'; the coach-eye reviews of samples 01 / 02 / 06 / 08: chest was
 * carried by one press a B day): the week's first B day takes a 30-45 degree incline press in that slot - a chest press - and the
 * other B day keeps the high-incline or overhead press. Returns the slot ids of the week that take the incline press.
 */
function chestShouldersSlots(layout, E) {
  const out = new Set();
  const CS = E.R.selection.x1 && E.R.selection.x1.chest_shoulders;
  if (!CS || !layout) return out;
  if ((CS.not_families || []).includes(E.family) || (CS.not_lift_styles || []).includes(E.derived.lift_style)) return out;
  const cands = [];
  for (const d of layout.days) {
    if (d.kind !== 'main' || !d.skeleton || !new RegExp(CS.skeleton_re).test(String(d.skeleton))) continue;
    const slots = daySlots(d);
    const v = slots.find((x) => x.bucket === CS.bucket && isLive(x, E));
    if (!v || !slots.some((x) => x.bucket === CS.lead_bucket && x.slot_id !== v.slot_id)) continue;
    cands.push(v.slot_id);
  }
  // with one B day in the week the slot stays the shoulders' press - the week's other press day carries the chest - except on a
  // 2-day plan, where the B day is the only pressing day (R4-SES-03: every big group, fewer sets)
  const twoDay = !!(E.derived.D9_start_sets && E.derived.D9_start_sets.two_day);
  // v0.5 fix round 2 (samples 01 / 03 major: a 3-day athletic week pressed on two days and held the chest floor on two lifts at 5
  // sets each): a week with one B day and at most `max_press_days` pressing days takes the incline press there too
  const SB = E.R.selection.x2 && E.R.selection.x2.chest_shoulders_single_b;
  const pressDays = layout.days.filter((d) => d.kind === 'main' && daySlots(d).some((x) => x.bucket === CS.lead_bucket && isLive(x, E))).length;
  const singleB = !!SB && cands.length === 1 && pressDays <= SB.max_press_days;
  if (cands.length < (CS.min_b_days || 2) && !(twoDay && CS.two_day_plan) && !singleB) return out;
  // (a small kit - dumbbells and a bench: the incline press is the second B day's own lead press there; the slot takes it only while
  // every B day still has another two-arm bench or machine press to lead with, so no day falls to a floor press - ORD-07, bench 09)
  const LP = E.R.selection.lead_press;
  if (LP) {
    const avoid = new RegExp(LP.avoid_re), floor = new RegExp(LP.floor_re), inc = new RegExp(CS.incline_re);
    const leads = E.model.bySlot(CS.lead_bucket).filter((e) => e.laterality === 'bilateral' && !SWAP_ONLY_STATUS.includes(e.status) && !(E.R.selection.swap_only_statuses || []).includes(e.status) &&
      e.load_ceiling !== 'low' && !avoid.test(e.id) && !floor.test(e.id) && !inc.test(e.id) && E.model.kitAvailable(e, E.kitObj));
    // (fix round 2: with a single B day the week's other pressing day needs a lead press of its own - a dumbbell-and-bench kit
    // keeps its incline press for that day instead of leading it with a floor press, bench 69)
    if (leads.length < (singleB && cands.length < (CS.min_b_days || 2) ? pressDays : cands.length)) return out;
  }
  // v0.5 fix round 2 (sample 06 major): a physique plan whose chest exercises at their most sets cannot hold the level's start
  // takes the incline press on every B day (rules.selection.x2.chest_shoulders_all_b)
  let perWeek = CS.per_week || 1;
  const AB = E.R.selection.x2 && E.R.selection.x2.chest_shoulders_all_b;
  const D9 = E.derived.D9_start_sets;
  if (AB && (AB.families || []).includes(E.family) && D9 && D9.start && typeof D9.start.chest === 'number') {
    const P = E.R.placement;
    const maxEx = P.max_sets_per_exercise[E.lvl] || 5;
    const mains = layout.days.filter((d) => d.kind === 'main');
    const nPress = mains.reduce((a, d) => a + daySlots(d).filter((x) => x.bucket === CS.lead_bucket && isLive(x, E)).length, 0);
    const nIso = mains.reduce((a, d) => a + daySlots(d).filter((x) => x.bucket === 'ISO_CHEST' && isLive(x, E)).length, 0);
    const isoMax = (P.x1 && P.x1.iso_main_day_max && P.x1.iso_main_day_max.default) || maxEx;
    const bonus = layout.days.some((d) => d.kind === 'optional') && P.bonus ? P.bonus.sets[1] : 0;
    if (maxEx * (nPress + perWeek) + isoMax * nIso + bonus < D9.start.chest) perWeek = cands.length;
  }
  for (const id of cands.slice(0, perWeek)) out.add(id);
  return out;
}

/** the days whose vertical / mid-range push slot holds an incline press (so their first press stays a flat one) */
function inclineVpushDays(layout, E) {
  const out = new Set();
  if (!layout) return out;
  const IF = E.R.selection.incline_first;
  for (const d of layout.days) {
    if (d.kind !== 'main') continue;
    for (const x of daySlots(d)) {
      if (E.chestShoulders && E.chestShoulders.has(x.slot_id)) out.add(d.weekday);
      else if (IF && x.bucket === IF.bucket && inclineFirstOn(E) && isLive(x, E)) out.add(d.weekday);
    }
  }
  return out;
}

/**
 * v0.5 fix round 1 selection weights (rules.selection.x1; every weight PROPOSED, engine/DECISIONS.md G-58 ...; each rule is a finding
 * of a coach-eye review of the regenerated samples):
 *  - the athlete's heavy squat and hinge are his sheet's lifts (OBSERVED BYOP JUSTICE LEAGUE 'Front Squats', 'Low Bar Back Squat';
 *    sample 02 major: a Zercher squat as the tested squat of an advanced linebacker);
 *  - the second squat / hinge day of an athletic week is a leg press, hack or belt squat / a hip thrust, back extension or reverse
 *    hyper (R2-SES-01, PER-04 'one day of squatting and the other day of leg pressing'; sample 02 major);
 *  - a painful area takes the supported lift on the day's work slot (VOL-03, EQ-03; sample 08 major);
 *  - the heavy lift of the day is not a step under the client's level (CAT-04; sample 02);
 *  - the lead chest press is a bench or machine press, never a balance-limited one, and a flat press on a day whose slot 3 is an
 *    incline (R4-SES-05 'bench press or machine chest press'; samples 01 / 03 / 04 / 08);
 *  - the leg-extension and leg-curl slots keep the machine the gym has (EQ-08; samples 06 / 07 major);
 *  - a core family once a week (PER-04; samples 02 / 03 / 05).
 */
function x1Score(ex, slot, eb, E, st, day, bk, wd, over) {
  const X = E.R.selection.x1, model = E.model, R = E.R, w = R.selection.weights;
  const tags = ex.tags || [];
  const re = (p) => new RegExp(p);
  let s = 0;
  const lowerRP = LOWER_RP.includes(eb);
  const region = slotRegion(slot, eb, model);
  const painHere = E.pain.filter((p) => touches(p.area, region));
  const aboveLevel = (typeof w.above_level === 'number' ? w.above_level : w.over_ladder_step);
  // 0. the class's press is the standing strict press in the first pass too (rules.selection.r2.class_press acted in the second pass
  // only: the first pass picked a high-incline press, whose half set of chest credit the second pass then lost - the plan fell back
  // to the first pass's picks and dropped every laterality flip, sample 04)
  const CP1 = X.class_press_both_passes && !E.S2 && R.selection.r2 ? R.selection.r2.class_press : null;
  if (CP1 && (CP1.families || []).includes(E.family) && eb === CP1.bucket && slot.role === 'work' && ex.id === CP1.id) { s += CP1.weight; if (over > 0) s -= aboveLevel * over; }
  // (a lift the coach keeps for people with pain - the Kong row, LIB-09 'for people that have some type of shoulder pain or back pain
  // ... I wouldn't really give a lot of importance to it' - is no pick for a client without that pain; sample 05 major)
  const PO = X.pain_only;
  if (PO && re(PO.re).test(ex.id) && !E.pain.some((p) => (PO.areas || []).includes(p.area))) s += PO.penalty;
  // 1. the athlete's heavy squat and hinge
  const WP = X.work_prefer;
  if (WP && lowerRP && bk === 'resistance' && slot.role === 'work' && slot.axial_req === 'axial' && WP.families.includes(E.family) && WP.levels.includes(E.lvl) && !painHere.length && !E.older) {
    const i = (WP.patterns[eb] || []).findIndex((p) => re(p).test(ex.id));
    if (i >= 0) s += WP.weight - (WP.step || 0) * i;
  }
  // 2. the second squat / hinge day of a skeleton week
  const SD = X.second_day_prefer;
  if (SD && lowerRP && bk === 'resistance' && slot.role === 'work' && slot.axial_req && slot.axial_req !== 'axial' && day && day.skeleton &&
      SD.skeleton_prefixes.some((p) => String(day.skeleton).startsWith(p)) && (SD.patterns[eb] || []).some((p) => re(p).test(ex.id))) s += SD.weight;
  // 3. pain: the supported lift on the day's work slot
  const PW = X.pain_work;
  if (PW && lowerRP && bk === 'resistance' && slot.role === 'work' && painHere.length) {
    for (const p of painHere) { const a = R.volume.pain.areas[p.area]; if (a && (a.prefer_tags || []).some((t) => tags.includes(t))) { s += PW.weight; break; } }
  }
  // 4. a step under the client's level: the heavy lift of the day; a trained lifter's core
  const BL = X.below_ladder;
  if (BL) {
    const under = E.ladderOrder.indexOf(E.ladder) - E.ladderOrder.indexOf(ex.level);
    // (the lifts of his own sheets are never 'under the level': a front squat or a deadlift is the work at every level)
    const sheetLift = !!WP && (WP.patterns[eb] || []).some((p) => re(p).test(ex.id));
    if (under > 0 && !sheetLift && lowerRP && bk === 'resistance' && slot.role === 'work' && slot.axial_req === 'axial' && !painHere.length && !E.older && (BL.work_levels || []).includes(E.lvl)) s += BL.work_per_step * under;
    if (under > 0 && bk === 'core' && (BL.core_levels || []).includes(E.lvl) && !E.pain.length && !E.older) s += BL.core_per_step * under;
  }
  // 5. the lead chest press
  const LPx = X.lead_press;
  if (LPx && bk === 'resistance' && isLeadPress(slot, day, E)) {
    if (re(LPx.staples_re).test(ex.id)) { s += LPx.staple_weight; if (LPx.staples_no_above_level && over > 0) s -= aboveLevel * over; }
    if (E.pressStaple && re(LPx.unstable_re).test(ex.id)) s += LPx.unstable_penalty;
    if (E.inclineDays && E.inclineDays.has(wd) && (re(LPx.incline_re).test(ex.id) || tags.includes('mid_range_push'))) s += LPx.incline_penalty;
  }
  // 6. the 'Chest / Shoulders' slot of the week's first B day: a 30-45 degree incline press
  const CS = X.chest_shoulders;
  if (CS && E.chestShoulders && E.chestShoulders.has(slot.slot_id)) {
    if (re(CS.incline_re).test(ex.id)) { s += CS.weight; if (over > 0) s -= aboveLevel * over; }
  }
  // (a press the week already holds in its other press slot is not the lead press of another day, PER-04)
  if (typeof X.cross_bucket_repeat === 'number' && bk === 'resistance' && st.usedWeek.has(ex.id) && !((st.usedByBucket.get(eb) || new Set()).has(ex.id))) s += X.cross_bucket_repeat;
  // 7. the gym's leg-extension / leg-curl machine keeps its slot
  const IM = X.iso_machine_first;
  if (IM && IM.buckets[eb] && E.isoMachine && E.isoMachine[eb] && !(IM.not_families || []).includes(E.family) && re(IM.buckets[eb].avoid_re).test(ex.id)) s += IM.penalty;
  // (a template lift that is also the day's joint care takes the care's own exercise where it fits the slot: the face pull in the
  // rear-delt slot, R3-ATH-02 / R4-SES-02)
  if (slot.care_code && typeof X.care_slot_prefer === 'number' && ((R.prehab.preferred_by_code || {})[slot.care_code] || []).includes(ex.id)) s += X.care_slot_prefer;
  // (a 50+ court player, a painful knee or ankle: the low box and the stick-the-landing drills, never the knee-height box - R3-ATH-02,
  // EQ-16)
  const LIH = X.low_impact_heights;
  if (LIH && E.lowImpact && PLYO_BUCKETS.includes(eb) && ex.athletic && !ex.athletic.upper) {
    if (re(LIH.prefer_re).test(ex.id)) s += LIH.prefer;
    if (re(LIH.avoid_re).test(ex.id)) s += LIH.avoid;
  }
  // (a beginner with a painful joint, or anyone from 50: the dumbbell and kettlebell pulls before the barbell ones - ATH-10
  // 'beginners: DB / KB snatches, hex-bar jumps, hang pulls', his note on joint pain 'split grips')
  const OLx = X.olympic_split_grip;
  if (OLx && eb === 'AP_TRIPLE_EXT' && E.lvl === 'L1' && (E.pain.length || (E.age || 0) >= OLx.from_age)) s += tags.includes('barbell') ? OLx.barbell : OLx.split;
  // 8. a core family once a week
  if (bk === 'core' && Array.isArray(X.core_families)) {
    for (const f of X.core_families) {
      if (!re(f.re).test(ex.id)) continue;
      let week = 0;
      for (const [, picks] of st.dayPicks) for (const x of picks) if (x.ex && x.kind === 'core' && x.ex.id !== ex.id && re(f.re).test(x.ex.id)) week++;
      if (week >= (f.week_max || 1)) s += X.core_family_over_week;
    }
  }
  return s;
}

/**
 * v0.5 fix round 2 selection weights (rules.selection.x2; every weight PROPOSED, engine/DECISIONS.md G-76 ...; each rule is a finding
 * of the second coach-eye reviews of the regenerated samples).
 */
function x2Score(ex, slot, eb, E, st, day, bk, wd, reasons) {
  const X = E.R.selection.x2, model = E.model;
  const tags = ex.tags || [];
  const re = (p) => new RegExp(p);
  let s = 0;
  // 1. the core opener (R2-SES-03 'light, as a warm-up'; samples 04 major, 05 / 07 minor)
  const CP = X.core_primary;
  if (CP && bk === 'core') {
    const ds = day ? daySlots(day) : [];
    if (typeof CP.weighted_on_axial_day === 'number' && re(CP.weighted_re).test(ex.id) && ds.some((x) => x.axial_req === 'axial' && isLive(x, E))) s += CP.weighted_on_axial_day;
    if (ds.some((x) => x.bucket === 'SKILL')) {
      if (CORE_FLEXION_RE.test(ex.id) || re(CP.hanging_re).test(ex.id)) s += CP.skill_day_flexion;
      else if (antiCore(ex)) s += CP.skill_day_anti;
    }
    if (typeof CP.genpop_copenhagen === 'number' && /copenhagen/.test(ex.id) && ((CP.genpop_families || []).includes(E.family) || ((CP.genpop_goals || []).includes(E.goal) && !E.competitive))) s += CP.genpop_copenhagen;
    if (typeof CP.hanging_week_max === 'number' && re(CP.hanging_re).test(ex.id)) {
      let n = 0;
      for (const [, picks] of st.dayPicks) for (const x of picks) if (x.ex && x.kind === 'core' && x.ex.id !== ex.id && re(CP.hanging_re).test(x.ex.id)) n++;
      if (n >= CP.hanging_week_max) s += CP.hanging_over_week;
    }
  }
  // 2. a hot shoulder presses with split grips or a machine (sample 01 major)
  const SP = X.shoulder_press;
  if (SP && bk === 'resistance' && SP.buckets.includes(eb) && (SP.codes || []).some((c) => E.injuries.has(c)) && tags.includes('fixed_grip') && implementOf(ex) === 'barbell') s += SP.fixed_grip;
  // (samples 02 / 03 / 04 minors: a weighted pull-up as the default vertical pull of a 2-year lifter and of a 230-lb athlete - the
  // body-weight pull-up or a pulldown first; 'add weight when you hit the top of the range' is the progression rule, R4-PRG-03)
  const WPU = X.weighted_pull;
  if (WPU && bk === 'resistance' && re(WPU.re).test(ex.id) && (!(WPU.from_levels || []).includes(E.lvl) || (E.heavy && WPU.not_heavy))) s += WPU.penalty;
  // (a circuit session's first row is a two-arm row: R4-SES-05 Day A slot 1; sample 05 major)
  const CC = X.circuit;
  if (CC && typeof CC.lead_row_two_arm === 'number' && eb === 'RP_HPULL' && day && (slot.block === 'circuit' || slot.circuit) && ex.laterality !== 'bilateral') {
    const firstRow = daySlots(day).find((x) => x.bucket === 'RP_HPULL' && isLive(x, E));
    if (firstRow && firstRow.slot_id === slot.slot_id) s += CC.lead_row_two_arm;
  }
  // 3. the buy-out's calories follow its bouts (OBSERVED BASEBALL Part E '1 x 20 cal, 2 x 15 cal, 3 x 10 cal'; sample 02 major)
  const BX = E.R.conditioning.buyout_pool && E.R.conditioning.buyout_pool.x2;
  if (BX && eb === 'COND_SPRINT_BUYOUT') {
    const m = /calorie-effort-(\d+)-cal/.exec(ex.id);
    const bouts = BX.bouts_by_block[Math.min(E.ebIdx || 0, BX.bouts_by_block.length - 1)];
    if (m && Number(m[1]) === BX.calories_by_bouts[String(bouts)]) s += BX.match_weight;
  }
  void model; void wd; void reasons;
  return s;
}

/** circular distance in days between two weekdays (Sunday and Monday are neighbours) */
function dayGap(a, b) {
  const i = WEEKDAYS.indexOf(a), j = WEEKDAYS.indexOf(b);
  if (i < 0 || j < 0) return 7;
  const d = Math.abs(i - j);
  return Math.min(d, 7 - d);
}

/** the plane a core pick counts toward in the week's plane mix (a multi-planar record counts as rotational work) */
function corePlaneOf(ex) { return ex.plane === 'frontal' ? 'frontal' : (ex.plane === 'transverse' || ex.plane === 'multi') ? 'transverse' : 'sagittal'; }
const CORE_FLEXION_RE = /(sit-up|crunch|v-up|leg-raise|knees-to|toes-to)/;

/** whole core picks per plane for n main-day core slots from the profile's plane shares (largest remainder) */
function corePlaneTargets(pct, n) {
  const keys = ['sagittal', 'frontal', 'transverse'];
  const raw = keys.map((k) => ((pct[k] || 0) / 100) * n);
  const out = Object.fromEntries(keys.map((k, i) => [k, Math.floor(raw[i] + EPS)]));
  let left = n - keys.reduce((a, k) => a + out[k], 0);
  const order = keys.map((k, i) => ({ k, r: raw[i] - Math.floor(raw[i] + EPS), i })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (const o of order) { if (left <= 0) break; out[o.k]++; left--; }
  return out;
}

/**
 * v0.4 fix round 2 / F3 selection weights (rules.selection.r2; every weight PROPOSED, DECISIONS E-178 ...): movement families with a
 * weekly cap, a per-day cap and a day gap (PER-04; RECHECK v0.4 02 / 03 / 06 / 07), a glute-dominant second hip exercise (R3-SES-01;
 * RECHECK v0.4 03 major), a dialled two-legged station that can be loaded heavy (UNI-02 stance swap; RECHECK v0.4 07 major, 06 / 01
 * minors), loaded Focus picks for trained lifters (EQ-09; RECHECK v0.4 06 major), the core plane mix (CAT-08; RECHECK v0.4 01 / 02 / 08),
 * the class's strict press (OBSERVED class split; RECHECK v0.4 04 minor)
 */
function r2Score(ex, slot, eb, E, st, day, bk, wd, reasons) {
  const S2 = E.S2, model = E.model;
  const tags = ex.tags || [];
  let s = 0;
  const resKind = ['resistance', 'isolation', 'focus'].includes(bk);
  // E-182: movement families (week cap, day cap, day gap)
  if (resKind && E.families2.length) {
    for (const f of families2Of(ex, E)) {
      let week = 0, today = 0, near = false;
      for (const [d2, picks] of st.dayPicks) for (const x of picks) {
        if (!x.ex || x.ex.is_athletic || !f.rx.test(x.ex.id)) continue;
        week++;
        if (d2 === wd) today++;
        else if (f.min_day_gap && dayGap(d2, wd) < f.min_day_gap) near = true;
      }
      // (RECHECK v0.4 07 minor: a rope pulldown next to a single-arm pulldown) a one-arm station of the day that is still to be picked
      // keeps its lift - few one-arm versions exist - so the day's two-arm station of the same family sees it already
      if (S2.family_day_counts_pending_one_arm && typeof f.day_max === 'number' && day && E.baseFills && ex.laterality === 'bilateral') {
        const have = new Set((st.dayPicks.get(wd) || []).map((x) => x.ex && x.ex.id));
        for (const x of daySlots(day)) {
          const bfx = x.slot_id !== slot.slot_id && isLive(x, E) ? E.baseFills[x.slot_id] : null;
          const bx2 = bfx && bfx.exercise_id && model.hasEx(bfx.exercise_id) ? model.ex(bfx.exercise_id) : null;
          if (bx2 && !bx2.is_athletic && bx2.laterality !== 'bilateral' && !have.has(bx2.id) && f.rx.test(bx2.id)) today++;
        }
      }
      if (typeof f.week_max === 'number' && week >= f.week_max) s += S2.family_over_week;
      if (typeof f.day_max === 'number' && today >= f.day_max) s += S2.family_over_day;
      if (near) s += S2.family_day_gap;
    }
  }
  // E-178: the second pass keeps the first pass's pick unless a rule of the round speaks against it, and spreads a repeat over
  // different exercises (an exercise the week already holds twice waits)
  if (resKind) {
    const baseId = (E.baseFills && E.baseFills[slot.slot_id] && E.baseFills[slot.slot_id].exercise_id) || E.baseAddedId || null;
    if (baseId && baseId === ex.id && typeof S2.base_pick_bonus === 'number') s += S2.base_pick_bonus;
    if (typeof S2.repeat_in_week === 'number') {
      let n = 0;
      for (const [, picks] of st.dayPicks) for (const x of picks) if (x.ex && x.ex.id === ex.id) n++;
      n += E.weekUsedN.get(ex.id) || 0;
      if (n > 0) s += S2.repeat_in_week * n;
    }
  }
  // E-189 (CAT-05; RECHECK v0.4 05 major: an offset push-up on Wednesday and a kneeling push-up on Friday for one client): the week's
  // push-up versions stay within one step of each other on the push-up ladder
  const PB = S2.push_up_band;
  if (PB && resKind && /push-up/.test(ex.id)) {
    const rk = (id) => { const i = PB.ladder.findIndex((re) => new RegExp(re).test(id)); return i < 0 ? PB.default_rank : i; };
    let worst = 0;
    for (const [, picks] of st.dayPicks) for (const x of picks) if (x.ex && /push-up/.test(x.ex.id) && x.ex.id !== ex.id) worst = Math.max(worst, Math.abs(rk(x.ex.id) - rk(ex.id)));
    if (worst > PB.max_gap) s += PB.penalty * (worst - PB.max_gap);
  }
  // E-183: the hip day's second hip exercise is glute-dominant when its first is a hinge
  const GS = S2.glute_second_hip;
  // (only where the glutes are a target line of the plan: in the other plans the hips' one weekly target is counted on the hamstrings
  // line - E-84 - and a hip thrust gives that line a quarter set, so the time check would drop the hips; open for the volume engine)
  if (GS && GS.enabled && (eb === 'RP_UHD' || eb === 'RP_BHD') && bk === 'resistance' && day && slot.role !== 'work' && slot.axial_req !== 'axial' &&
      slot.block !== 'circuit' && !slot.circuit && !(E.priority || []).includes('hamstrings') && (!GS.only_when_glutes_target || E.fill.glutes === 'target')) {
    const today = (st.dayPicks.get(wd) || []).filter((x) => x.ex && !x.ex.is_athletic);
    const hinge = today.some((x) => ['BHD', 'UHD'].includes(x.ex.credit_class));
    const glute = today.some((x) => x.ex.credit_class === 'GLUTE_ISO');
    if (hinge && !glute && ex.credit_class === 'GLUTE_ISO') { s += GS.weight; reasons.push(why('why.glute_second_hip', 'R3-SES-01')); }
  }
  // E-181: a station the dial turned two-legged takes a lift that loads heavy; trained lifters' Focus picks take load
  const NS = S2.no_step_down;
  if (NS && (NS.levels || []).includes(E.lvl) && !E.older) {
    // (a non-counted two-legged squat / hinge station - the dial's flips and the second squat / hinge day alike; not in a timed circuit)
    if ((eb === 'RP_BKD' || eb === 'RP_BHD') && bk === 'resistance' && slot.axial_req !== 'axial' && slot.block !== 'circuit' && !slot.circuit) {
      if (ex.load_ceiling === 'high') s += NS.flip_load_high;
      if (tags.includes('machine') || ex.equipment.machine) s += NS.flip_machine;
      if (NS.hand_held_re && new RegExp(NS.hand_held_re).test(ex.id)) s += NS.hand_held;
      if (eb === 'RP_BHD' && NS.flip_hinge_prefer_re && new RegExp(NS.flip_hinge_prefer_re).test(ex.id)) s += NS.flip_hinge_prefer;
    }
    if (bk === 'focus' && slot.focus_muscle && model.muscle(slot.focus_muscle).class === 'big') {
      if (noLoad(ex) && typeof NS.focus_bodyweight_big === 'number') s += NS.focus_bodyweight_big;
      if (NS.odd_implement_re && new RegExp(NS.odd_implement_re).test(ex.id) && ['FULL_GYM', 'FULL_FACILITY'].includes(E.kit.profile) && typeof NS.focus_odd_implement_full_gym === 'number') s += NS.focus_odd_implement_full_gym;
    }
  }
  // E-184: the core plane mix of the profile across the week's main days, different planes inside a day, one trunk-flexion move a day
  const C2 = S2.core;
  if (C2 && bk === 'core') {
    const pl = corePlaneOf(ex);
    const cr = E.sport && E.sport.core_rules;
    // (the week's planes are dealt to the main-day core slots up front - two different planes a day; newState.corePlan)
    const wantPl = st.corePlan ? st.corePlan.get(slot.slot_id) : null;
    if (wantPl) s += pl === wantPl ? C2.plane_under : C2.plane_over;
    const mates = (st.dayPicks.get(wd) || []).filter((x) => x.ex && x.kind === 'core');
    if (mates.some((x) => corePlaneOf(x.ex) === pl)) s += C2.pair_same_plane;
    const flex = CORE_FLEXION_RE.test(ex.id);
    if (flex && mates.some((x) => CORE_FLEXION_RE.test(x.ex.id))) s += C2.flexion_second;
    if (flex && day && daySlots(day).some((x) => x.bucket === 'RP_BHD' && x.axial_req === 'axial')) s += C2.flexion_on_hinge_day;
    if (E.heavy && C2.heavy_avoid_re && new RegExp(C2.heavy_avoid_re).test(ex.id)) s += C2.heavy_avoid;
  }
  // E-188: the class's press is the standing strict press
  const CP = S2.class_press;
  if (CP && (CP.families || []).includes(E.family) && eb === CP.bucket && slot.role === 'work' && ex.id === CP.id) {
    s += CP.weight;
    const over = E.ladderOrder.indexOf(ex.level) - E.ladderOrder.indexOf(E.ladder);
    const w = E.R.selection.weights;
    if (over > 0) s -= (typeof w.above_level === 'number' ? w.above_level : w.over_ladder_step) * over;
  }
  return s;
}

/**
 * v0.4 fix round 1 / F3 selection weights (rules.selection.f3; every weight PROPOSED, DECISIONS E-127 ... E-133):
 * the second hinge day's non-spinal hinge and one two-legged deadlift a day (R2-SES-01; RECHECK 01 major, 03 minor), a dialled
 * two-legged station that counts toward the share (UNI-02, BRAIN §6.5), the low-back core opener (R2-SES-03; RECHECK 01 minor), no
 * hanging core on a pull or deadlift day (RECHECK 06 / 07 minors), no axial-high calf raise on a non-axial day (R2-SES-01; RECHECK 02
 * minor), week-wide movement families (PER-04; RECHECK 02 / 06 / 07 minors), the heavy-powerlifting canonical lifts (VOL-12; RECHECK
 * 07 minor), a glute-dominant hip pick next to a leg curl (R3-SES-01 'RDL + hip thrust + leg curl'; RECHECK 08 major)
 */
function f3Score(ex, slot, eb, E, st, day, bk, wd, reasons) {
  const F3 = E.F3, R = E.R, model = E.model;
  const tags = ex.tags || [];
  let s = 0;
  const NS = F3.non_spinal_hinge;
  if (NS && eb === 'RP_BHD' && slot.bucket === eb && slot.axial_req && slot.axial_req !== 'axial' && bk === 'resistance') {
    const hot = (NS.hotspots || []).some((h) => E.injuries.has(h)) || E.painAreas.includes('lower_back');
    if (new RegExp(NS.prefer_re).test(ex.id)) { const add = NS.weight + (hot ? NS.hotspot_extra : 0); s += add; if (add > 0) reasons.push(why('why.non_spinal_hinge', 'R2-SES-01')); }
    else if (hot && new RegExp(NS.avoid_re).test(ex.id)) s += NS.hotspot_avoid;
  }
  // (a Focus / bonus hip exercise of a low-back hot-spot client follows the same lean: RECHECK 01 major, a third deadlift on Saturday)
  if (NS && bk === 'focus' && ((NS.hotspots || []).some((h) => E.injuries.has(h)) || E.painAreas.includes('lower_back')) && ex.credit_class === 'BHD' &&
      new RegExp(NS.avoid_re).test(ex.id) && ex.laterality === 'bilateral') s += NS.hotspot_avoid;
  if (NS && typeof NS.second_bilateral_deadlift === 'number' && LOWER_RP.includes(eb) && ex.laterality === 'bilateral' && new RegExp(NS.deadlift_re).test(ex.id) &&
      (st.dayPicks.get(wd) || []).some((x) => x.ex && !x.ex.is_athletic && x.ex.id !== ex.id && x.ex.laterality === 'bilateral' && new RegExp(NS.deadlift_re).test(x.ex.id))) s += NS.second_bilateral_deadlift;
  const D3 = F3.dial;
  if (D3 && typeof D3.flipped_bilateral_counted === 'number' && slot.bucket !== eb && (eb === 'RP_BKD' || eb === 'RP_BHD')) s += ['BKD', 'BHD'].includes(ex.credit_class) ? D3.flipped_bilateral_counted : -D3.flipped_bilateral_counted;
  if (bk === 'core' && (!(day && day.optional) || !!E.S2)) {
    const CO = F3.core_low_back;
    if (CO && ((CO.hotspots || []).some((h) => E.injuries.has(h)) || E.painAreas.includes('lower_back'))) {
      if (antiCore(ex)) { s += CO.anti_bonus; reasons.push(why('why.core_low_back', 'R2-SES-03')); }
      if (new RegExp(CO.avoid_re).test(ex.id)) s += CO.avoid;
    }
    const HC = F3.hanging_core;
    if (HC && day && new RegExp(HC.re).test(ex.id)) {
      const ds = daySlots(day);
      const pull = ds.some((x) => ['RP_VPULL', 'RP_HPULL'].includes(x.bucket) && (x.role === 'work' || x.role === 'paired_upper'));
      const hinge = ds.some((x) => x.bucket === 'RP_BHD' && (x.axial_req === 'axial' || x.test));
      if (pull || hinge) s += HC.penalty;
    }
  }
  if (typeof F3.axial_high_non_axial_day === 'number' && ['resistance', 'isolation', 'focus'].includes(bk) && tags.includes('axial_high') && day && !daySlots(day).some((x) => x.axial_req === 'axial')) s += F3.axial_high_non_axial_day;
  const fam = familyOf(ex, E);
  if (fam && ['resistance', 'isolation', 'focus'].includes(bk)) {
    let other = 0, lying = 0;
    for (const [d2, picks] of st.dayPicks) for (const x of picks) {
      if (!x.ex || x.ex.is_athletic) continue;
      const fx = familyOf(x.ex, E);
      if (fx === fam && x.ex.id !== ex.id) other++;
      if (fx && E.familyRe.find((f) => f.id === fx && f.lying)) lying++;
    }
    if (other) s += F3.family_penalty;
    const fdef = E.familyRe.find((f) => f.id === fam);
    if (fdef && fdef.lying && typeof F3.lying_week_max === 'number' && lying >= F3.lying_week_max) s += F3.family_penalty;
  }
  // (core: two versions of one hold on the same day - a side plank and a star side plank - read as one exercise twice)
  if (fam && bk === 'core' && (st.dayPicks.get(wd) || []).some((x) => x.ex && x.ex.id !== ex.id && familyOf(x.ex, E) === fam)) s += 2 * F3.family_penalty;
  const PLC = F3.powerlifting_canonical;
  if (PLC && E.derived.lift_style === PLC.lift_style && slot.role === 'work' && bk === 'resistance' && PLC.prefer[eb] && new RegExp(PLC.prefer[eb]).test(ex.id)) { s += PLC.weight; reasons.push(why('why.reps_preference', 'VOL-12')); }
  const GH = F3.glute_with_leg_curl && F3.glute_with_leg_curl.enabled !== false ? F3.glute_with_leg_curl : null;
  const ghProfile = !GH || !GH.racket_only || (E.R.population.active_aging_50.racket_profiles || []).includes(E.profileId);
  if (GH && ghProfile && (eb === 'RP_UHD' || eb === 'RP_BHD') && bk === 'resistance' && day && slot.role !== 'work' &&
      daySlots(day).some((x) => x.bucket === 'ISO_LEG_FLEXION') && !(E.priority || []).includes('hamstrings')) {
    if (ex.credit_class === 'GLUTE_ISO' || new RegExp(GH.re).test(ex.id)) s += GH.weight;
  }
  void R; void model;
  return s;
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const resKindOf = (bk) => ['resistance', 'isolation', 'focus'].includes(bk);

function rank(list, slot, E) {
  return list.map((c) => ({ ...c, tb: tieBreak(E.seed, slot.slot_id, c.ex.id) }))
    .sort((a, b) => b.score - a.score || a.tb - b.tb || (a.ex.id < b.ex.id ? -1 : a.ex.id > b.ex.id ? 1 : 0));
}

// ------------------------------------------------------------------------------------------------------------------
// week state
// ------------------------------------------------------------------------------------------------------------------

function newState(layout, E) {
  let weekTotal = 0, ankle = 0;
  // v0.4 B2: the share is over the jump and throw work (R2-ATH-01) - upper-body plyo stations are outside it, and the ankle
  // block is plyometric work from the start (R2-ATH-02 'pogo and ankle hops'), so the jump stations see it
  const shareB2 = !!(E.R.athletic && E.R.athletic.split);
  if (layout) for (const d of layout.days) for (const s of daySlots(d)) {
    if (!CONTACT_BUCKETS.includes(s.bucket)) continue;
    if (shareB2 && s.bucket === 'AP_PLYO' && s.variant === 'upper') continue;
    const n = baseSets(s);
    weekTotal += n;
    if (shareB2 && s.bucket === 'AP_JUMP_LIMITED_KNEE') ankle += n;
  }
  // (fix round 2 / F3, E-184: the week's main-day core slots and the planes they hold so far)
  let coreMainN = 0;
  if (layout) for (const d of layout.days) if (d.kind === 'main') for (const s of daySlots(d)) { let k = null; try { k = E.model.bucket(s.bucket).kind; } catch { k = null; } if (k === 'core' && isLive(s, E)) coreMainN++; }
  const mainDays = new Set(layout ? layout.days.filter((d) => d.kind === 'main').map((d) => d.weekday) : []);
  // (E-184: the plane each main-day core slot is asked for - the profile's shares in whole picks, a day's slots in different planes,
  // the planes rotating through the week from rules.core_block.plane_rotation)
  let corePlan = null;
  const crP = E.S2 && E.S2.core && E.sport && E.sport.core_rules && E.sport.core_rules.plane_pct;
  if (crP && layout && coreMainN > 0) {
    corePlan = new Map();
    const left = corePlaneTargets(crP, coreMainN);
    const rot = E.R.core_block.plane_rotation || ['sagittal', 'frontal', 'transverse'];
    let di = 0;
    for (const d of layout.days) {
      if (d.kind !== 'main') continue;
      const cs = daySlots(d).filter((x) => { let k = null; try { k = E.model.bucket(x.bucket).kind; } catch { k = null; } return k === 'core' && isLive(x, E); });
      const taken = new Set();
      for (const x of cs) {
        const order = rot.map((p2, i) => ({ p: p2, i: (i - di + 3 * rot.length) % rot.length })).sort((a, b) => (left[b.p] || 0) - (left[a.p] || 0) || a.i - b.i);
        const pick = order.find((o) => (left[o.p] || 0) > 0 && !taken.has(o.p)) || order.find((o) => (left[o.p] || 0) > 0) || order[0];
        corePlan.set(x.slot_id, pick.p); taken.add(pick.p); left[pick.p] = (left[pick.p] || 0) - 1;
      }
      di++;
    }
  }
  return { usedByBucket: new Map(), usedByDay: new Map(), spine: { squat: null, hinge: null },
    plyo: { plyo: ankle, week_total: weekTotal, b2: shareB2 }, upper: { bil: 0, tot: 0 }, lower: { bil: 0, tot: 0 }, contra: { n: 0, c: 0 }, ft: { n: 0, k: 0 },
    dayPicks: new Map(), usedWeek: new Set(), spineImpl: null, olyUsed: new Set(), corePlanes: {}, coreFlex: new Map(), throwPlanes: {}, dipsUsed: false,
    coreMainN, coreMainPlanes: {}, mainDays, corePlan };
}

function weekdayOfSlot(slot) { return String(slot.slot_id).split('.')[0]; }
const wdOf = weekdayOfSlot;

function record(st, slot, fill, ex, E, shadow = false) {
  if (!ex) return;
  const wd = weekdayOfSlot(slot);
  const b = fill.bucket;
  if (!st.usedByDay.has(wd)) st.usedByDay.set(wd, new Set());
  st.usedByDay.get(wd).add(ex.id);
  if (ex.axial && slot.axial_req === 'axial') { st.spine[ex.axial_pattern] = wd; if (!st.spineImpl) st.spineImpl = { impl: implementOf(ex), pattern: ex.axial_pattern }; }
  // (fix round 2 / F3, E-178: a station the time check dropped only keeps its day free of a second copy and the spine budget - it takes
  // no part in the week's variety, shares or quotas)
  if (shadow) return;
  if (!st.usedByBucket.has(b)) st.usedByBucket.set(b, new Set());
  st.usedByBucket.get(b).add(ex.id);
  const sets = baseSets(slot);
  if (ex.athletic && CONTACT_BUCKETS.includes(b) && ex.athletic.quality === 'plyometric' && !(st.plyo.b2 && (b === 'AP_JUMP_LIMITED_KNEE' || ex.athletic.upper))) st.plyo.plyo += sets;
  if (UPPER_RP.includes(b)) { st.upper.tot += sets; if (ex.laterality === 'bilateral') st.upper.bil += sets; }
  if (LOWER_RP.includes(b) && ex.credit_class !== 'GLUTE_ISO') { st.lower.tot += sets; if (ex.laterality === 'bilateral') st.lower.bil += sets; }
  if (['RP_UKD', 'RP_UHD'].includes(b)) { st.ft.n++; if (['frontal', 'transverse', 'multi'].includes(ex.plane)) st.ft.k++; }
  const kind = E.model.bucket(b).kind;
  if (!st.dayPicks.has(wd)) st.dayPicks.set(wd, []);
  st.dayPicks.get(wd).push({ group: slot.group || (ex.primary_muscle ? E.model.groupOf(ex.primary_muscle) : null), ex, kind });
  if (kind !== 'warmup') st.usedWeek.add(ex.id);
  if (b === 'AP_TRIPLE_EXT') st.olyUsed.add(ex.id);
  if (ex.athletic && ex.tags.includes('depth_jump') && PLYO_BUCKETS.includes(b)) st.depthUsed = (st.depthUsed || 0) + 1;
  if (b === 'AP_PLYO' && slot.variant !== 'upper' && ex.athletic && ex.athletic.quality === 'plyometric') st.reactive = (st.reactive || 0) + 1;
  // (fix round 2 / F2: the week's lateral jump / ankle stations and its single-leg reactive ones)
  if (PLYO_BUCKETS.includes(b) && slot.variant !== 'upper' && ex.athletic && !ex.athletic.upper) {
    if (directionOf(ex) === 'lateral') st.lateralAny = true;
    if (ex.athletic.quality === 'plyometric' && isUnilateral(ex)) st.uniReactive = (st.uniReactive || 0) + 1;
  }
  if (b === 'AP_PLYO' && slot.variant !== 'upper' && ex.athletic && !ex.athletic.upper) {
    st.jumpDirs = st.jumpDirs || {}; const dr = directionOf(ex); st.jumpDirs[dr] = (st.jumpDirs[dr] || 0) + 1;
    st.jumpUni = st.jumpUni || { n: 0, u: 0 }; st.jumpUni.n++; if (isUnilateral(ex)) st.jumpUni.u++;
  }
  if (kind === 'core') { st.corePlanes[ex.plane] = (st.corePlanes[ex.plane] || 0) + 1; if (/(sit-up|crunch|v-up|leg-raise|knees-to|toes-to)/.test(ex.id)) st.coreFlex.set(wd, (st.coreFlex.get(wd) || 0) + 1); }
  if (kind === 'core' && st.mainDays && st.mainDays.has(wd)) { const pl = corePlaneOf(ex); st.coreMainPlanes[pl] = (st.coreMainPlanes[pl] || 0) + 1; }
  if (b === 'AP_THROW') { const k = ex.plane === 'transverse' ? 'transverse' : 'sagittal'; st.throwPlanes[k] = (st.throwPlanes[k] || 0) + 1; }
  if (b === 'AP_SPRINT' && ex.athletic && ex.athletic.sprint_kind) { st.sprintKinds = st.sprintKinds || new Set(); st.sprintKinds.add(ex.athletic.sprint_kind); }
  if (b === 'AP_COD' && E.R.athletic.f2 && E.R.athletic.f2.cod && (E.R.athletic.f2.cod.reactive_drill_ids || []).includes(ex.id)) st.codReactive = true;
  if (b === 'COND_CIRCUIT' && E.R.athletic.hyrox && (E.R.athletic.hyrox.station_variants || []).includes(slot.variant)) { st.hyroxUsed = st.hyroxUsed || new Map(); st.hyroxUsed.set(ex.id, (st.hyroxUsed.get(ex.id) || 0) + 1); }
  if (b === 'COND_CIRCUIT' && (ex.medball || ex.tags.includes('kb_swing'))) { st.circBall = (st.circBall || 0) + 1; st.circBallKinds = st.circBallKinds || new Set(); st.circBallKinds.add(ex.tags.includes('kb_swing') ? 'swing' : 'ball'); }
  if (ex.credit_class === 'DIPS') st.dipsUsed = true;
  st.weekDetails = st.weekDetails || new Map();
  if (!st.weekDetails.has(ex.id)) st.weekDetails.set(ex.id, new Set());
  st.weekDetails.get(ex.id).add(fill.detail ? fill.detail.value || fill.detail.axis : '');
}

// ------------------------------------------------------------------------------------------------------------------
// laterality (UNI-02) and the home second squat (axial.home_second_squat)
// ------------------------------------------------------------------------------------------------------------------

function lexLess(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
}

/**
 * v0.5 / V4 (COACH-R4 R4-SES-05 'horizontal pull, bilateral, symmetrical ... knee-dominant movement, bilateral ... knee-dominant
 * movement, unilateral'; OBSERVED BYOP 'Bilateral KD' / 'Unilateral KD' / 'Bilateral HD' / 'Unilateral HD'): is this day built to a
 * skeleton whose slots name their laterality (gym A / B / C, push / pull / legs)? The laterality dial leaves its lower slots alone.
 */
function skeletonPinned(day, R) {
  const SL = R.selection.skeleton_laterality;
  return !!(SL && SL.lower_fixed && day && day.skeleton && (SL.skeleton_prefixes || []).some((p) => String(day.skeleton).startsWith(p)));
}
/** the lower-body slots of the pinned skeleton days (slot ids) */
function pinnedLowerSlots(layout, E) {
  const out = new Set();
  const SL = E.R.selection.skeleton_laterality;
  if (!layout || !SL) return out;
  // v0.5 fix round 2 (sample 03 major; UNI-02 / UNI-03 'change-of-direction sports: 80-90 % unilateral work', UNI-12; R4-SES-05 pins
  // only the A day's row and squat and the B day's hinge): for a change-of-direction sport the third day's second knee lift - the
  // non-axial two-leg slot the engine took from his 3-day builder - is left to the dial (rules.selection.skeleton_laterality.x2_free)
  const FR = SL.x2_free || null;
  const free = (d, s) => !!FR && !!E.sport && !!E.sport.cod_sport && (FR.skeletons || []).includes(d.skeleton) && (FR.buckets || []).includes(s.bucket) && s.role !== 'work' && s.axial_req !== 'axial';
  for (const d of layout.days) if (skeletonPinned(d, E.R)) for (const s of daySlots(d)) if (SL.laterality_of_bucket && SL.laterality_of_bucket[s.bucket] && !free(d, s)) out.add(s.slot_id);
  return out;
}
/** the A day's slot 1 - 'horizontal pull, bilateral, symmetrical' - of each day that follows that skeleton (slot ids) */
function leadRowSlots(layout, E) {
  const out = new Set();
  const LR = E.R.selection.skeleton_laterality && E.R.selection.skeleton_laterality.lead_row;
  if (!layout || !LR) return out;
  for (const d of layout.days) {
    if (!d.skeleton || !(LR.skeletons || []).includes(d.skeleton)) continue;
    const first = daySlots(d).find((x) => x.bucket === LR.bucket);
    if (first) out.add(first.slot_id);
  }
  return out;
}

/** the weight of a station in a laterality dial: the sets the first pass gave it across the exercise block (second pass), else its
 *  template minimum over the same weeks */
function dialSets(s, E) {
  if (!E.liveSets) return baseSets(s);
  const v = E.liveSets[s.slot_id];
  return typeof v === 'number' && v > 0 ? v : baseSets(s) * E.liveWeeks;
}

function decideLaterality(layout, E, locked = new Set()) {
  const { R } = E;
  const out = new Map();
  if (!layout) return out;
  const pinned = pinnedLowerSlots(layout, E);
  const sib = R.bilateral_share.siblings;
  const lowerSlots = [];
  // (fix round 2 / F3, E-178: the share is read on the stations the plan keeps - a station the time check dropped takes no part)
  for (const d of layout.days) for (const s of daySlots(d)) if (R.bilateral_share.regions.lower.includes(s.bucket) && isLive(s, E)) lowerSlots.push(s);
  const machinesOk = SQUAT_MACHINES.some((m) => (E.kitObj.machines || []).includes(m));
  const hasCounted = lowerSlots.some((s) => s.axial_req === 'axial' && s.bucket === 'RP_BKD');
  for (const s of lowerSlots) {
    // (v0.5 / V4: on a gym A / B / C or push / pull / legs day the second squat stays a two-leg squat - a goblet squat is 'fine on
    // the second day', COACH-R2 R2-SES-02 - because the slot is the coach's 'knee-dominant, bilateral' slot, R4-SES-05)
    if (!s.laterality_dial && !pinned.has(s.slot_id) && s.bucket === 'RP_BKD' && hasCounted && !machinesOk && R.axial.home_second_squat === 'unilateral' &&
        (s.axial_req === 'non_axial' || s.axial_req === 'light_or_non_axial') && s.role !== 'work') out.set(s.slot_id, sib.RP_BKD);
  }
  if (E.lowerTarget == null) return out;
  const isBil = (b) => b === 'RP_BKD' || b === 'RP_BHD';
  let fixBil = 0, fixUni = 0;
  const dial = [];
  // v0.4 fix round 1 / F3 (BRAIN §6.5 #2 / #3, COACH-ANSWER UNI-02 / UNI-03; RECHECK 01 / 02 / 03 / 04 / 06 / 07 majors: the share missed
  // its target by 25-40 points and the plan told the client to fix it): every lower station takes part in the dial, except the
  // tested lifts and the week's counted (axial) squat and hinge - the one two-legged exposure of each pattern the heavy days keep
  // (R2-SES-01 / R2-SES-02); athletes convert two-legged stations to single-leg ones of the same dominance (the non-axial day
  // first), physique / strength clients swap single-leg stations to two-legged, non-axial ones as the blocks move to 80 / 90 %
  const D3 = E.F3 && E.F3.dial;
  // (v0.5 / V4: a lower slot of a gym A / B / C or push / pull / legs day keeps the laterality the coach's template names)
  const dialable = (s) => !pinned.has(s.slot_id) && (s.laterality_dial || (!!D3 && D3.all_lower && s.block !== 'circuit' && !s.circuit && !(D3.keep_axial && s.axial_req === 'axial') &&
    !(Array.isArray(D3.skip_roles) && D3.skip_roles.includes(s.role))));
  // (F3: a station the template does not mark for the dial only moves toward the plan's end share - two-legged -> single-leg for
  // athletes, single-leg -> two-legged for physique / strength clients - so a station never flips one way and back between exercise
  // blocks, which would move its credits between lines at a block boundary)
  const D10 = E.derived.D10_bilateral_share;
  const endArr = D10 && D10.lower && Array.isArray(D10.lower.by_exercise_block) ? D10.lower.by_exercise_block : [];
  const endT = endArr.length ? endArr[endArr.length - 1] : E.lowerTarget;
  let t0b = 0, t0n = 0;
  for (const s of lowerSlots) { const n0 = dialSets(s, E); t0n += n0; if (isBil(s.bucket)) t0b += n0; }
  const towardBil = typeof endT === 'number' && t0n > 0 ? endT >= t0b / t0n : null;
  for (const s of lowerSlots) {
    const n = dialSets(s, E);
    const way = s.laterality_dial || towardBil === null || (towardBil ? !isBil(s.bucket) : isBil(s.bucket));
    if (dialable(s) && way && !locked.has(s.slot_id) && !(out.has(s.slot_id) && !s.laterality_dial)) { dial.push({ s, n }); continue; }
    const b = out.get(s.slot_id) || s.bucket;
    if (isBil(b)) fixBil += n; else fixUni += n;
  }
  if (!dial.length) return out;
  const tol = R.bilateral_share.tolerance;
  // v0.4 fix round 2 / F3 (E-180; COACH-ANSWER UNI-06 'athletes pair squat + single-leg RDL'; COACH-R3 R3-SES-01 cross pattern; RECHECK v0.4
  // 03 major: two single-leg hinges as the hip day's two hip exercises): the dial never makes a day hold more single-leg lifts of one
  // pattern than its template does (at least one is always allowed)
  const LD2 = E.S2 && E.S2.lower_dial;
  const pairRule = !!(LD2 && LD2.no_same_pattern_single_leg_pair);
  const domOf = (b) => (b === 'RP_BKD' || b === 'RP_UKD' ? 'knee' : 'hip');
  const dialIds = new Set(dial.map((d) => d.s.slot_id));
  const uniCount = (bucketOf) => {
    const m = new Map();
    for (const s of lowerSlots) { const b = bucketOf(s); if (isBil(b)) continue; const key = wdOf(s) + '|' + domOf(b); m.set(key, (m.get(key) || 0) + 1); }
    return m;
  };
  const tplUni = pairRule ? uniCount((s) => (dialIds.has(s.slot_id) ? s.bucket : (out.get(s.slot_id) || s.bucket))) : null;
  const evalMask = (mask) => {
    let bil = fixBil, tot = fixBil + fixUni, axialFlips = 0, flips = 0;
    const flipped = new Map();
    dial.forEach((d, i) => {
      const flip = (mask >> i) & 1;
      const bilNow = flip ? !isBil(d.s.bucket) : isBil(d.s.bucket);
      tot += d.n; if (bilNow) bil += d.n;
      if (flip) { flips++; flipped.set(d.s.slot_id, sib[d.s.bucket]); if (d.s.axial_req === 'axial') axialFlips++; }
    });
    let pairs = 0;
    if (pairRule && flips) {
      const now = uniCount((s) => flipped.get(s.slot_id) || (dialIds.has(s.slot_id) ? s.bucket : (out.get(s.slot_id) || s.bucket)));
      for (const [key, n] of now) pairs += Math.max(0, n - Math.max(1, tplUni.get(key) || 0));
    }
    const dev = Math.max(0, Math.abs((tot ? bil / tot : 0) - E.lowerTarget) - tol);
    return { dev: Math.round(dev * 1e9) / 1e9, axialFlips, flips, pairs };
  };
  const k = Math.min(dial.length, 12);
  let best = null;
  for (let mask = 0; mask < (1 << k); mask++) {
    const r = evalMask(mask);
    // prefer: no extra same-pattern single-leg pair on a day (F3 round 2); closest share; keep the counted (axial) stations; fewer flips;
    // flip later slots first
    const revMask = parseInt(mask.toString(2).padStart(k, '0').split('').reverse().join(''), 2);
    const key = [r.pairs, r.dev, r.axialFlips, r.flips, -revMask];
    if (!best || lexLess(key, best.key)) best = { mask, key };
  }
  dial.forEach((d, i) => { if ((best.mask >> i) & 1) out.set(d.s.slot_id, sib[d.s.bucket]); });
  return out;
}

/**
 * v0.4 fix round 2 / F3 (E-179; COACH-ANSWER UNI-02 / UNI-03 / UNI-07; RECHECK v0.4 02 major, 03 minor, 06 major): the upper-body laterality
 * dial (second pass). Reads the two-arm share of the plan's main-day upper compound stations as the first pass picked them
 * (`baseFills`) and flips as few stations as it takes to land on the exercise block's share target (D10 upper): toward one-arm /
 * alternating lifts the week's second exposures flip first (the tested lift and the week's first press, pull-up, row and overhead
 * press stay two-arm longest), toward two-arm lifts the first exposures flip first - a fixed order, so as the target moves from block
 * to block a station only ever flips one way. A bucket takes no more one-arm stations than the kit holds different one-arm lifts.
 * @returns {Map<string,'bil'|'uni'>} the laterality every station ends with
 */
function decideUpperLaterality(layout, E, locked = new Set(), baseFills = null) {
  const out = new Map();
  const UD = E.S2 && E.S2.upper_dial;
  if (!UD || !UD.enabled || E.frozen || !layout || !baseFills || E.upperTarget == null) return out;
  const { model, R } = E;
  const stations = [];
  for (const d of layout.days) {
    if (d.kind !== 'main') continue;
    for (const s of daySlots(d)) {
      if (!UPPER_RP.includes(s.bucket) || s.block === 'circuit' || s.circuit || !isLive(s, E)) continue;
      if (model.bucket(s.bucket).kind !== 'resistance') continue;
      const bf = baseFills[s.slot_id];
      if (!bf || !bf.exercise_id || !model.hasEx(bf.exercise_id) || bf.bucket !== s.bucket) continue;
      stations.push(s);
    }
  }
  if (stations.length < (UD.min_stations || 2)) return out;
  const curBil = (s) => model.ex(baseFills[s.slot_id].exercise_id).laterality === 'bilateral';
  const PP = R.selection.powerlifting_presses, WB = R.selection.work_bilateral_canonical;
  // (the day's first chest press stays a two-arm press: selection.lead_press, RECHECK v0.3 03 major - the dial turns the pulls, the
  // overhead presses and a day's second press first)
  const leadPress = new Set();
  if (UD.keep_lead_press !== false && R.selection.lead_press) {
    for (const d of layout.days) { const lp = stations.find((x) => x.bucket === 'RP_HPUSH' && daySlots(d).includes(x)); if (lp) leadPress.add(lp.slot_id); }
  }
  // (v0.5 / V2, R4-LIB-03: the incline press of a bodybuilder's or a general-population client's vertical / mid-range push slot is a
  // two-arm press - the library's incline presses of that slot are - so the dial turns the rows and pulldowns instead)
  const IFd = R.selection.incline_first;
  const inclineSlot = (s) => !!IFd && s.bucket === IFd.bucket && inclineFirstOn(E);
  // (v0.5 / V4, R4-SES-05: the A day's first row is a two-arm row - the dial turns the vertical pull instead)
  const leadRow = leadRowSlots(layout, E);
  // (v0.5 fix round 1: the 'Chest / Shoulders' slot that takes the week's incline press is a two-arm press too)
  // (fix round 2, sample 03 major 'one press as single-arm or alternating DB': for a profile whose two-arm target is low the week's
  // incline press of the 'Chest / Shoulders' slot may be the alternating one - rules.selection.x2.chest_slot_uni)
  const CSU = R.selection.x2 && R.selection.x2.chest_slot_uni;
  const chestUniOk = !!CSU && E.upperTarget != null && E.upperTarget <= CSU.max_upper_target + EPS;
  const chestSlot = (s) => !chestUniOk && !!(E.chestShoulders && E.chestShoulders.has(s.slot_id));
  const fixed = (s) => locked.has(s.slot_id) || leadPress.has(s.slot_id) || leadRow.has(s.slot_id) || inclineSlot(s) || chestSlot(s) || !!(PP && E.derived.lift_style === PP.lift_style && PP.buckets.includes(s.bucket)) ||
    !!(s.role === 'work' && WB && (WB.families.includes(E.family) || WB.goals.includes(E.goal)));
  // how many different one-arm / alternating lifts each bucket holds for this client (one per movement family)
  const cap = {};
  const swapOnly = R.selection.swap_only_statuses || [];
  for (const b of UPPER_RP) {
    const probe = stations.find((x) => x.bucket === b);
    if (!probe) continue;
    const seen = new Set();
    for (const ex of model.bySlot(b)) {
      if (ex.laterality === 'bilateral' || SWAP_ONLY_STATUS.includes(ex.status) || swapOnly.includes(ex.status)) continue;
      if (ex.load_ceiling === 'low' || E.genericRe.some((re) => re.test(ex.id))) continue;
      if (!hardFilter(ex, probe, b, E, { used: { squat: null, hinge: null }, weekday: weekdayOfSlot(probe) }).ok) continue;
      const fam = families2Of(ex, E)[0];
      seen.add(fam ? 'f:' + fam.id : ex.id);
    }
    cap[b] = seen.size;
  }
  const nth = new Map(), seenB = {};
  for (const s of stations) { seenB[s.bucket] = seenB[s.bucket] || 0; nth.set(s.slot_id, seenB[s.bucket]++); }
  const bp = UD.bucket_priority || UPPER_RP;
  // 'stays two-arm longest' order: the week's first exposure of each pattern, then by pattern, then by week order
  const order = stations.map((s, i) => ({ s, i, n: dialSets(s, E) || 1 }))
    .sort((a, b) => (nth.get(a.s.slot_id) - nth.get(b.s.slot_id)) || (bp.indexOf(a.s.bucket) - bp.indexOf(b.s.bucket)) || (a.i - b.i));
  const state = new Map(order.map((o) => [o.s.slot_id, curBil(o.s) || ((leadRow.has(o.s.slot_id) || chestSlot(o.s)) && !locked.has(o.s.slot_id)) ? 'bil' : 'uni']));
  const tot = order.reduce((a, o) => a + o.n, 0);
  let bil = order.filter((o) => state.get(o.s.slot_id) === 'bil').reduce((a, o) => a + o.n, 0);
  const T = E.upperTarget;
  const uniIn = (b) => order.filter((o) => o.s.bucket === b && state.get(o.s.slot_id) === 'uni').length;
  if (bil / tot > T + EPS) {
    // too two-armed: the last exposures turn one-arm first
    for (const o of order.slice().reverse()) {
      if (state.get(o.s.slot_id) !== 'bil' || fixed(o.s) || uniIn(o.s.bucket) >= (cap[o.s.bucket] || 0)) continue;
      if (!(Math.abs((bil - o.n) / tot - T) < Math.abs(bil / tot - T) - EPS)) break;
      state.set(o.s.slot_id, 'uni'); bil -= o.n;
    }
  } else if (bil / tot < T - EPS) {
    // too one-armed: the first exposures turn two-arm first
    for (const o of order) {
      if (state.get(o.s.slot_id) !== 'uni') continue;
      if (!(Math.abs((bil + o.n) / tot - T) < Math.abs(bil / tot - T) - EPS)) break;
      state.set(o.s.slot_id, 'bil'); bil += o.n;
    }
  }
  for (const [id, v] of state) out.set(id, v);
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
  // v0.4 fix round 2 / F3 (E-204; ORD-08 A-drills 'A-march / A-skip / A-run'; RECHECK v0.4 05 minor: the A-march opened every session of
  // the plan): the running drill moves one step up its list with each exercise block (march -> skip -> run) for a trained client
  // with no lower-limb pain (rules.warmup.progress_by_exercise_block)
  const WP = R.warmup.progress_by_exercise_block || null;
  const wpOn = !!WP && lower && WP.levels.includes(E.lvl) && !(typeof E.age === 'number' && E.age > WP.max_age) && !(E.painAreas || []).some((a) => WP.not_pain.includes(a));
  const k = wpOn ? Math.min(ok.length - 1, Math.max(0, (E.exerciseBlock || 1) - 1)) : 0;
  if (ok.length) { f.exercise_id = ok[k].id; f.laterality = ok[k].laterality; f.swaps = ok.filter((_, i) => i !== k).slice(0, 3).map((e) => e.id); return f; }
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
  if (ex.athletic && ex.athletic.count_unit === 'contacts' && !ex.athletic.upper) return 'jump'; // B2: box / squat jumps in a WOD
  if (ex.conditioning || /calorie|bike|rower|skierg|erg/.test(ex.id)) return 'erg';
  if (/rope|double-under/.test(ex.id)) return 'rope';
  if (/burpee|jumping-jack/.test(ex.id)) return 'burpee';
  if (/carry|sled/.test(ex.id)) return 'carry';
  return ex.credit_class + ':' + ex.pattern;
}

// v0.5 / V2 (COACH-R4 R4-LIB-04): a kit that holds every piece of equipment the library names - to ask what a slot would hold
// if equipment were no limit (what an equipment stand-in replaces)
const FULL_KITS = new WeakMap();
function fullKit(model) {
  if (!FULL_KITS.has(model)) {
    const tokens = new Set(['barbell_bumpers_platform']);
    for (const e of model.exercises()) for (const su of e.equipment.any_of) for (const t of su) tokens.add(t);
    FULL_KITS.set(model, { tokens, machines: Object.keys(model.rules.equipment.machines || {}) });
  }
  return FULL_KITS.get(model);
}

/**
 * v0.5 / V2 (R4-LIB-04 'DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch'): the exercise this
 * slot would hold with every piece of equipment - the same filters and scores, the kit aside - or null.
 */
function intendedWithFullKit(slot, eb, E, st, day, spine) {
  const Ef = { ...E, kitObj: fullKit(E.model), kitTok: fullKit(E.model).tokens, hasBall: true, kit: { ...E.kit, medball_max_lb: null }, pressAlt: { twoArm: true, bench: true } };
  const swapOnly = E.R.selection.swap_only_statuses || [];
  const cands = variantPool(slot, eb, Ef, false)
    .filter((ex) => !SWAP_ONLY_STATUS.includes(ex.status) && !swapOnly.includes(ex.status) && !ex.tags.includes('home_substitute') && !E.genericRe.some((re) => re.test(ex.id)) && hardFilter(ex, slot, eb, Ef, spine).ok)
    .map((ex) => ({ ex, ...scoreOf(ex, slot, eb, Ef, st, day) }));
  const ranked = rank(cands, slot, Ef);
  const defs = ranked.filter((c) => isDefaultPick(c.ex, eb, Ef));
  const top = defs[0] || ranked[0] || null;
  return top ? top.ex : null;
}

/**
 * v0.5 fix round 2 (sample 08 major: 'Swapped to protect your Knee' on lifts where nothing was swapped): the exercise this slot
 * would hold if the client had entered no pain - the same filters and scores, the pain aside - or null.
 */
function intendedWithoutPain(slot, eb, E, st, day, spine) {
  const En = { ...E, pain: [], painAreas: [], lowImpact: E.racket50 || (E.older && !E.optIn) };
  const swapOnly = E.R.selection.swap_only_statuses || [];
  const cands = variantPool(slot, eb, En, false)
    .filter((ex) => !SWAP_ONLY_STATUS.includes(ex.status) && !swapOnly.includes(ex.status) && !ex.tags.includes('home_substitute') && !E.genericRe.some((re) => re.test(ex.id)) && hardFilter(ex, slot, eb, En, spine).ok)
    .map((ex) => ({ ex, ...scoreOf(ex, slot, eb, En, st, day) }));
  const ranked = rank(cands, slot, En);
  const defs = ranked.filter((c) => isDefaultPick(c.ex, eb, En));
  const top = defs[0] || ranked[0] || null;
  return top ? top.ex : null;
}

/** pick + swaps for one slot. opts: {relaxSecond, state, day, keepPrev, forceChange, prevId} */
function pickFor(slot, day, E, st, eb, opts = {}) {
  const { model, R } = E;
  if (slot.bucket === 'WARMUP_PREP') return warmupFill(slot, day, E);
  // v0.4 fix round 2 / F2 (R2-ATH-04): a clean / snatch station takes the family of the day's lower-body work lift
  if (eb === 'AP_TRIPLE_EXT' && day) {
    const wl = daySlots(day).find((x) => x.role === 'work' && LOWER_RP.includes(x.bucket));
    const v = olympicVariantByDay(slot.variant, wl ? wl.bucket : null, R);
    if (v !== slot.variant) slot = { ...slot, variant: v, variant_by_day: true };
  }
  const fill = emptyFill(slot, eb);
  // joint care: the injury code's own pick first (rules.prehab.preferred_by_code; review 08 major 5)
  if (slot.prehab_code && R.prehab.preferred_by_code && (R.prehab.preferred_by_code[slot.prehab_code] || []).length) {
    // v0.5 / V2 (COACH-R4 R4-LIB-01): the code's own LIVE exercise is the pick; its optional add-ons (external rotation, soleus and
    // tibialis raises, wrist extension, wall sit) are swaps - "they can be chosen and added, but not primary ones"
    const usedW = st.usedWeek;
    const preAll = R.prehab.preferred_by_code[slot.prehab_code].filter((id) => model.hasEx(id)).map((id) => model.ex(id))
      .filter((e) => hardFilter(e, slot, eb, E, { used: st.spine, weekday: wdOf(slot) }).ok && !(st.usedByDay.get(wdOf(slot)) || new Set()).has(e.id));
    // (v0.5 fix round 1, sample 08 major: a 'DB leg extension seated on a box' - a reference-only home substitute - as joint care in a
    // gym with the machine: joint care is a live library exercise, rules.prehab.x1.never_status)
    const neverSt = (R.prehab.x1 && R.prehab.x1.never_status) || [];
    const pre = preAll.filter((e) => !SWAP_ONLY_STATUS.includes(e.status) && !neverSt.includes(e.status));
    let fresh = pre.filter((e) => !(R.prehab.skip_if_week_has_same && usedW.has(e.id)));
    // B2 (R3-ATH-01 every-session shoulder care): a day that already holds two rear-delt exercises takes the care that is not a
    // rear-delt exercise (external rotation) - never a third rear-delt item on a day
    const rearToday = (st.dayPicks.get(wdOf(slot)) || []).filter((x) => x.ex && ['ISO_REAR', 'FACEPULL'].includes(x.ex.credit_class)).length;
    if (rearToday >= 2) { const nr = [...fresh, ...pre].filter((e) => !(e.credits && e.credits.rear_delts)); if (nr.length) fresh = [nr[0]]; }
    const ex0 = fresh[0] || pre[0];
    if (ex0) {
      fill.exercise_id = ex0.id; fill.laterality = ex0.laterality === 'n/a' ? null : ex0.laterality;
      fill.swaps = preAll.filter((e) => e !== ex0).slice(0, R.selection.swaps.max).map((e) => e.id);
      fill.why.push(why('why.prehab', 'D-23', { code: slot.prehab_code }));
      fill.flags.push('prehab_preferred');
      return fill;
    }
    // (V2: a code whose exercises are all add-ons, or pass nothing for this client, gets no stand-in from another code's list -
    // an adductor plank is not Achilles care; the station is left out and the add-ons are offered, plan.meta.addons)
    fill.flags.push('no_candidate', 'prehab_addon_only');
    return fill;
  }
  const wd = weekdayOfSlot(slot);
  const spine = { used: st.spine, weekday: wd };
  // v0.4 fix round 2 / F3 (E-183; COACH-R3 R3-SES-01 'hips = glutes + hamstrings, e.g. RDL + hip thrust + leg curl'; OBSERVED BYOP ATHLETIC
  // hip day 'bilateral HD + unilateral HD + leg curls'; COACH-ANSWER CAT-09, PER-04; RECHECK v0.4 03 major: a kickstand DB deadlift and an
  // alternating staggered DB deadlift as the hip day's two hip exercises): a day's second single-leg hinge that could only be another
  // version of the day's first one becomes a knee-flexion exercise (a leg curl: the same hamstrings line, so the hips keep their
  // weekly sets) - when the day holds no leg-curl station of its own
  const KF = E.S2 && E.S2.second_hip_knee_flexion;
  if (KF && KF.enabled && !E.frozen && !opts.noConvert && eb === 'RP_UHD' && day && slot.role !== 'work' && slot.axial_req !== 'axial' && slot.block !== 'circuit' && !slot.circuit) {
    const fam = E.families2.find((f) => f.id === KF.family) || null;
    const today = (st.dayPicks.get(wd) || []).filter((x) => x.ex && !x.ex.is_athletic);
    const curlStation = daySlots(day).some((x) => x.bucket === 'ISO_LEG_FLEXION' && isLive(x, E));
    if (fam && !curlStation && today.some((x) => fam.rx.test(x.ex.id))) {
      const usedDay0 = st.usedByDay.get(wd) || new Set();
      const other = variantPool(slot, eb, E, false).some((e) => !fam.rx.test(e.id) && e.credit_class === 'UHD' && !SWAP_ONLY_STATUS.includes(e.status) &&
        !(R.selection.swap_only_statuses || []).includes(e.status) && !E.genericRe.some((re) => re.test(e.id)) && !usedDay0.has(e.id) && hardFilter(e, slot, eb, E, spine).ok);
      if (!other) {
        const f2 = pickFor(slot, day, E, st, 'ISO_LEG_FLEXION', { ...opts, like: null, noConvert: true });
        if (f2.exercise_id) {
          f2.flags.push('second_hip_knee_flexion');
          f2.why.push(why('why.second_hip_knee_flexion', 'R3-SES-01'));
          return f2;
        }
      }
    }
  }
  // v0.5 fix round 2 (sample 05 majors; R4-LIB-01 his live exercises are the picks, OT06 drops the leg extension with no machine): in a
  // timed circuit the quad station and the second hips station of a kit with no machine take a library lift for the same muscle -
  // a single-leg knee lift, a glute bridge or hip thrust - never a reference-only home substitute
  const CSI = R.selection.x2 && R.selection.x2.circuit && R.selection.x2.circuit.stand_in;
  const csiOn = (def) => (def.when === 'no_vertical_pull' ? !!E.noVpull && !(def.not_own && slot.own) && !E.smallKitRows1
    : def.when === 'no_candidate' ? typeof E.kitHolds === 'function' && !(def.not_home && E.homeKit) && !E.kitHolds(eb)
      : !!E.isoMachine && E.isoMachine[eb] === false);
  if (CSI && CSI[eb] && !opts.standIn && (slot.block === 'circuit' || slot.circuit) && csiOn(CSI[eb])) {
    const def = CSI[eb];
    // (a stand-in that would only repeat an exercise the session already holds - a body-weight kit with one push-up at the
    // client's level - leaves the station out instead: the plan says the kit has nothing for it)
    const heldToday = new Set((st.dayPicks.get(weekdayOfSlot(slot)) || []).map((x) => x.ex && x.ex.id).filter(Boolean));
    for (const b2 of [def.bucket, ...(def.also_buckets || [])]) {
      const f2 = pickFor(slot, day, E, st, b2, { ...opts, like: null, standIn: def, noConvert: true });
      if (def.when && f2.exercise_id && heldToday.has(f2.exercise_id)) {
        const none = emptyFill(slot, eb);
        none.flags.push('no_candidate');
        none.buy = (R.equipment.buy_list[eb] || []).slice();
        none.why.push(why('why.kit', 'EQ-09'));
        return none;
      }
      if (f2.exercise_id) {
        // (the station that lost its vertical pull says so and keeps its buy list - a pull-up bar or a TRX brings the pattern back)
        if (def.when === 'no_vertical_pull') { for (const fl of ['pattern_gap', 'no_vertical_pull']) if (!f2.flags.includes(fl)) f2.flags.push(fl); f2.buy = (R.equipment.buy_list[eb] || []).slice(); }
        else if (!f2.flags.includes('machine_iso_swap')) f2.flags.push('machine_iso_swap');
        f2.why.push(why(def.why, 'EQ-08'));
        return f2;
      }
    }
  }
  const bk = bucketKind(model, eb);
  // v0.5 / V2 (COACH-R4 R4-SES-05 B day slot 4 'a stagger-stance deadlift with dumbbells, a single-leg hip extension, or a glute bridge';
  // RECHECK v0.4 03 major: a kickstand DB deadlift next to an alternating staggered DB deadlift): on a hip day whose other hinge is
  // already a staggered-stance one, this station may leave its first pick's credit class for the single-leg hip extension - the same
  // hips group (glutes + hamstrings, R3-SES-01), so the group's weekly sets hold (rules.selection.v2.second_hinge)
  const SH = E.S2 && !E.frozen && R.selection.v2 ? R.selection.v2.second_hinge : null;
  const shFam = SH ? E.families2.find((f) => f.id === SH.family) || null : null;
  const dayHasStaggered = !!shFam && (st.dayPicks.get(wd) || []).some((x) => x.ex && !x.ex.is_athletic && shFam.rx.test(x.ex.id));
  const secondHingeAlt = (ex) => dayHasStaggered && ['RP_UHD', 'RP_BHD'].includes(eb) && slot.role !== 'work' && slot.axial_req !== 'axial' && !!opts.like &&
    ['UHD', 'BHD'].includes(opts.like.cc) && ex.credit_class === 'GLUTE_ISO' && (opts.like.bil === null || (ex.laterality === 'bilateral') === opts.like.bil);
  const run = (relax) => {
    const pool = variantPool(slot, eb, E, relax.variant);
    const all = [];
    const removedBy = {};
    for (const ex of pool) {
      const hf = hardFilter(ex, slot, eb, E, spine);
      if (!hf.ok) { removedBy[hf.step] = removedBy[hf.step] || hf.area || true; continue; }
      if (opts.standIn && !((!opts.standIn.id_re || new RegExp(opts.standIn.id_re).test(ex.id)) && (!opts.standIn.classes || opts.standIn.classes.includes(ex.credit_class)))) continue;
      // (fix round 2 / F3, E-178: in the second pass a kept station stays inside its first pick's time and credit profile - the same
      // laterality class and credit class - so the sets the time check proved still hold)
      if (opts.like && !ex.is_athletic && ((opts.like.bil !== null && (ex.laterality === 'bilateral') !== opts.like.bil) || profileClass(ex.credit_class) !== profileClass(opts.like.cc)) && !secondHingeAlt(ex)) continue;
      const { score: score0, reasons } = scoreOf(ex, slot, eb, E, st, day);
      // (V2: a trained client's single-leg hip extension is the hip thrust with the shoulders on a bench before the floor bridge)
      const score = score0 + (SH && secondHingeAlt(ex) && SH.trained_prefer_re && (SH.trained_levels || []).includes(E.lvl) && new RegExp(SH.trained_prefer_re).test(ex.id) ? (SH.trained_prefer || 0) : 0);
      all.push({ ex, score, reasons });
    }
    const ranked = rank(all, slot, E);
    // (fix round 2: every buy-out of the week follows the same ladder - 1 x 20 cal, 2 x 15 cal, 3 x 10 cal - so the same record may repeat)
    const buyoutLadder = eb === 'COND_SPRINT_BUYOUT' && !!(R.conditioning.buyout_pool && R.conditioning.buyout_pool.x2);
    const used = buyoutLadder ? new Set() : (st.usedByBucket.get(eb) || new Set());
    const usedDay = st.usedByDay.get(wd) || new Set();
    const reserved = opts.reserved || new Set(); // previous-block picks other slots of this bucket keep (continuity)
    // PER-04 v1.2: an isolation / Focus pick never repeats an exercise the week already holds (review 02 / 06 / 07 minors);
    // B3: core picks too, main and optional days (RECHECK 02 / 06 / 08: the same core exercise on back-to-back days)
    const coreWeek = bk === 'core' && !!R.selection.core_week_unique;
    const weekWide = (R.selection.second_exposure_scope === 'week_all_slots' && ['isolation', 'focus'].includes(bk) && !opts.keepPrev) || (coreWeek && !opts.keepPrev);
    const usedW = weekWide ? new Set([...st.usedWeek, ...E.weekUsed]) : new Set();
    // B3 (RECHECK 01 / 03 majors): one session never holds two versions of the same exercise (seated + bent-over DB reverse fly,
    // DB floor press + alternating DB floor press); a relaxed pass (nothing else left) may
    // (second pass, a home-substitute stand-in picked again: the day's other first-pass picks count too - RECHECK v0.4 05 minor)
    const dayEx = (st.dayPicks.get(wd) || []).map((x) => x.ex).concat((opts.dayBaseIds || []).filter((id) => model.hasEx(id)).map((id) => model.ex(id))).filter((x) => x && !x.is_athletic);
    // (v0.5 fix round 1: the incline press of the 'Chest / Shoulders' slot is not 'a second version' of the day's bench press - a
    // bench press and an incline press are the coach's own B day, R4-SES-05)
    const chestSlot = !!(E.chestShoulders && E.chestShoulders.has(slot.slot_id));
    const dup = (c) => !chestSlot && !c.ex.is_athletic && ['resistance', 'isolation', 'focus', 'core'].includes(bk) && dayEx.some((x) => x.id !== c.ex.id && nearDuplicate(x, c.ex, R));
    const fresh = relax.second ? ranked.filter((c) => !usedDay.has(c.ex.id))
      : ranked.filter((c) => !used.has(c.ex.id) && !usedDay.has(c.ex.id) && !reserved.has(c.ex.id) && !usedW.has(c.ex.id) && !dup(c));
    return { ranked, fresh, removedBy, secondApplied: fresh.length < ranked.length };
  };
  const swapOnly = R.selection.swap_only_statuses || [];
  // HYROX stations: every station of the coach's list that the kit holds, the week rotating through them (one use each first)
  const rankHyrox = (cands) => {
    const ids = R.athletic.hyrox.station_ids;
    const usedH = st.hyroxUsed || new Map();
    // v0.5 / V2 (COACH-R4 R4-LIB-01): of the race stations only wall balls and sled pushes are picked (with the coach's own SkiErg /
    // row / burpee stations); sled pulls and drags, burpee broad jumps, farmer carries and sandbag lunges are swaps and add-ons
    return cands.filter((c) => ids.includes(c.ex.id) && (!SWAP_ONLY_STATUS.includes(c.ex.status) || addonPrimaryOk(c.ex, slot, eb, E.family, R)))
      .sort((a, b) => (usedH.get(a.ex.id) || 0) - (usedH.get(b.ex.id) || 0) || ids.indexOf(a.ex.id) - ids.indexOf(b.ex.id));
  };
  // F2 (BRAIN §9.11 swimming: box / squat / broad / streamline squat jumps; R3-ATH-02 split-step reaction): the athletic records the
  // coach names for a station may be the pick although the library lists them as reference / proposed
  const pickOkIds = new Set((R.athletic.f2 && R.athletic.f2.pick_ok_ids) || []);
  // F3 (04 LOW_BACK_EXTENSION 'core first as anti-extension / anti-rotation (dead bug, plank, hollow hold)'; RECHECK 01 minor: Russian
  // twists, leg raises and V-ups opened the swimmer's days): a low-back hot-spot client's main-day core may take the coach's program /
  // reference anti-movement records (dead bug, Pallof hold, suitcase carry) when the live library runs out of them
  const CLB = E.F3 && E.F3.core_low_back;
  const lowBackCore = !!CLB && bk === 'core' && (!(day && day.optional) || !!E.S2) && ((CLB.hotspots || []).some((h) => E.injuries.has(h)) || E.painAreas.includes('lower_back'));
  // v0.5 fix round 2 (sample 01 major; COACH-R4 R4-LIB-01 / R4-LIB-02): a core slot takes a live-library exercise; the low-back opener
  // keeps the two basic floor drills of his reference tab (rules.selection.x2.core_primary.low_back_allow_ids) and a carry is
  // never the template's pick
  const CPX = (R.selection.x2 && R.selection.x2.core_primary) || null;
  const lowBackOk = (c) => (CPX && CPX.live_only ? (CPX.low_back_allow_ids || []).includes(c.ex.id) : antiCore(c.ex) && !SWAP_ONLY_STATUS.includes(c.ex.status));
  const LBp = R.olympic.x2 && R.olympic.x2.l2_block1;
  const hangPick = (c) => eb === 'AP_TRIPLE_EXT' && !!LBp && (LBp.levels || []).includes(E.lvl) && E.exerciseBlock === 1 && !E.older && !E.youth && (LBp.ids || []).includes(c.ex.id);
  // (fix round 2, rules.selection.x2.small_kit_rows - STATUS open question 8: the reference-tab two-arm dumbbell rows are picks
  // only in a kit that holds no library two-arm row)
  const SKR = R.selection.x2 && R.selection.x2.small_kit_rows;
  const smallKitRow = (c) => !!SKR && !!E.smallKitRows && (SKR.ids || []).includes(c.ex.id);
  const pickOk = (c) => (/^AP_/.test(eb) && pickOkIds.has(c.ex.id)) || (lowBackCore && lowBackOk(c)) || hangPick(c) || (eb === 'RP_HPULL' && smallKitRow(c));
  // F3 (CAT-05; RECHECK 05 major): an above-ladder pick that is high-skill (or any above-ladder pick in a timed circuit) is a fallback only
  const LH = E.F3 && E.F3.level_hard;
  const levelHardOn = !!LH && ['resistance', 'isolation', 'focus'].includes(bk);
  const li = (lv) => E.ladderOrder.indexOf(lv);
  const levelHard = (c) => levelHardOn && li(c.ex.level) > li(E.ladder) && !(slot.note_tokens || []).some((t) => c.ex.id.includes(t)) &&
    ((LH.circuit_any_above && (slot.block === 'circuit' || !!slot.circuit)) || ((LH.skills || []).includes(c.ex.skill) && li(E.ladder) <= li(LH.max_ladder)));
  const pickable = (cands, opt2 = {}) => {
    // (v0.5 / V2, R4-LIB-01: an optional add-on is never the pick - wall balls and sled pushes in their approved programs excepted)
    let allowed0 = cands.filter((c) => !SWAP_ONLY_STATUS.includes(c.ex.status) || addonPrimaryOk(c.ex, slot, eb, E.family, R));
    // (fix round 2, sample 05 major 'a household exercise in a field / bootcamp kit': a home substitute - the table row - is no
    // circuit station's pick outside a home kit while the kit holds anything else for it)
    if (!E.homeKit && (slot.block === 'circuit' || !!slot.circuit)) { const noHome = allowed0.filter((c) => !c.ex.tags.includes('home_substitute')); if (noHome.length) allowed0 = noHome; }
    // (fix round 2: in a core slot a carry, an above-level record or one under its own minimum level is a fallback only)
    if (CPX && bk === 'core') {
      const lvN = { L1: 1, L2: 2, L3: 3 };
      const weakCore = (c) => (CPX.never_tags || []).some((t) => c.ex.tags.includes(t)) ||
        (CPX.in_level_first && E.ladderOrder.indexOf(c.ex.level) > E.ladderOrder.indexOf(E.ladder) && !(CPX.in_level_exempt_ids || []).includes(c.ex.id)) ||
        (!!(CPX.min_level_ids || {})[c.ex.id] && (lvN[E.lvl] || 1) < (lvN[CPX.min_level_ids[c.ex.id]] || 1));
      const strong = allowed0.filter((c) => !weakCore(c) && (!swapOnly.includes(c.ex.status) || pickOk(c)));
      if (strong.length) allowed0 = strong;
      else { const noCarry = allowed0.filter((c) => !(CPX.never_tags || []).some((t) => c.ex.tags.includes(t))); if (noCarry.length) allowed0 = noCarry; }
    }
    // R2-LIB-01 / R2-LIB-07 (v1.2): a library record is the pick whenever one passes; program-only / reference-only are swaps
    // (cardio options excepted); records named 'any' / 'implement not stated' only when nothing else is left (FIX-03)
    const lib = allowed0.filter((c) => !swapOnly.includes(c.ex.status) || pickOk(c) || (eb === 'AP_TRIPLE_EXT' && E.preferIds.has(c.ex.id)) ||
      // B2: an acceleration drill is the pick for an acceleration-focus profile (the library's only live sprint is max velocity)
      (eb === 'AP_SPRINT' && E.sprintFocus && c.ex.athletic && ['acceleration', 'max_velocity'].includes(c.ex.athletic.sprint_kind) && c.ex.status === 'reference_only'));
    // R3-ATH-03 (B2): the HYROX race stations are the coach's own list (the records are PROPOSED in the library)
    if (eb === 'COND_CIRCUIT' && R.athletic.hyrox && (R.athletic.hyrox.station_variants || []).includes(slot.variant)) return rankHyrox(cands);
    // B3 (RECHECK 04 minor: toes-to-bar six times a week for 8 weeks, the template's 'DUBS' ignored): the class model's skill
    // station takes the coach's program skills too (double-unders, jump rope, hollow rocks), so the week rotates them
    const progOk = ['COND_AEROBIC', 'COND_CIRCUIT', 'COND_WOD', 'COND_SPRINT_BUYOUT', ...(R.selection.skill_rotate ? ['SKILL'] : [])];
    const allowed1 = lib.length && !progOk.includes(eb) ? lib : allowed0;
    const named = allowed1.filter((c) => !E.genericRe.some((re) => re.test(c.ex.id)));
    const allowed2 = named.length ? named : allowed1;
    // B3 (R2-LIB-07 'for home clients'; RECHECK 02 / 03 / 05 / 06 / 07 minors): a home substitute (floor Y / T, table row, body-
    // weight calf raise, DB leg extension on a box) only when no loaded or machine version of the slot passes the kit
    const real = R.selection.home_substitute_only_when_needed && ['resistance', 'isolation', 'focus'].includes(bk) ? allowed2.filter((c) => !c.ex.tags.includes('home_substitute')) : allowed2;
    let allowed = real.length ? real : allowed2;
    // v0.4 fix round 1 / F3 (CAT-05 level ladder; RECHECK 05 major: an advanced, high-skill sissy squat twice a week in a timed circuit for
    // an intermediate client, the renegade row too): an exercise above the client's ladder that is high-skill (or any above-ladder pick
    // in a timed circuit) is a fallback only - an in-level record that passes the kit wins, even a reference / home version
    if (levelHardOn) {
      const hard = levelHard;
      if (allowed.length && allowed.some(hard)) {
        const keep = allowed.filter((c) => !hard(c));
        if (keep.length) allowed = keep;
        else {
          const alt = allowed0.filter((c) => !hard(c) && !E.genericRe.some((re) => re.test(c.ex.id)));
          if (alt.length) allowed = alt;
        }
      }
    }
    // (v0.5 fix round 1, the 1,500-intake sweep: a chest-press slot turned into assisted dips at a block change and took a set of
    // helper credit from the shoulders, H21. A template lift keeps its credit class into the next exercise block while a lift of
    // that class passes the filters - PER-02 'change one or two details', never what the lift counts for)
    {
      const KC = R.selection.x1 && R.selection.x1.keep_class_at_block_change;
      const prevF0 = KC && E.prev && E.prev.fills ? E.prev.fills[slot.slot_id] : null;
      if (prevF0 && prevF0.exercise_id && prevF0.bucket === eb && model.hasEx(prevF0.exercise_id) && resKindOf(bk) && slot.origin !== 'bonus') {
        const pc = profileClass(model.ex(prevF0.exercise_id).credit_class);
        const same = allowed.filter((c) => profileClass(c.ex.credit_class) === pc);
        if (same.length) allowed = same;
      }
    }
    // (a slot that names its kind takes that kind while one passes the filters, in every exercise block: 'Tricep - Overhead' an
    // overhead extension on both push days, BYOP PUSHPULLLEGS / sample 07 minor - rules.selection.slot_variants[bucket][variant].strict)
    {
      const SVp = R.selection.slot_variants && R.selection.slot_variants[eb] && slot.variant ? R.selection.slot_variants[eb][slot.variant] : null;
      if (SVp && SVp.strict) { const rxv = new RegExp(SVp.id_re); const own = allowed.filter((c) => rxv.test(c.ex.id)); if (own.length) allowed = own; }
    }
    if (opt2.all) return allowed;   // B3 block changes: every library alternative, not only the slot's defaults
    if (lowBackCore) return allowed; // (F3: the slot's default core list holds the twists and leg raises the low back avoids)
    // v0.5 fix round 1: the 'Chest / Shoulders' slot of the week's first B day takes its incline press while one passes
    if (E.chestShoulders && E.chestShoulders.has(slot.slot_id) && R.selection.x1 && R.selection.x1.chest_shoulders) {
      const CSUp = R.selection.x2 && R.selection.x2.chest_slot_uni;
      const wantUni = !!CSUp && !!E.upperWant && E.upperWant.get(slot.slot_id) === 'uni';
      const rxc = new RegExp(wantUni ? CSUp.id_re : R.selection.x1.chest_shoulders.incline_re);
      const inc = allowed.filter((c) => rxc.test(c.ex.id));
      if (inc.length) return inc;
      if (wantUni) { const inc2 = allowed.filter((c) => new RegExp(R.selection.x1.chest_shoulders.incline_re).test(c.ex.id)); if (inc2.length) return inc2; }
    }
    // (a template lift that is also the day's joint care takes the care's own exercise while one passes the filters: the face pull
    // or the Y-T raise in the rear-delt slot of a racket player's shoulder care, R3-ATH-02 / R4-SES-02)
    if (slot.care_code && R.selection.x1 && typeof R.selection.x1.care_slot_prefer === 'number') {
      const pref = (R.prehab.preferred_by_code || {})[slot.care_code] || [];
      const own = allowed.filter((c) => pref.includes(c.ex.id));
      if (own.length) return own;
    }
    const defs = allowed.filter((c) => isDefaultPick(c.ex, eb, E));
    // (F2: from stage 2 a jump station follows its stage - the slot's default drills are the Receive-stage box jumps)
    const stageFree = !!(R.athletic.f2 && R.athletic.f2.stage_drill_change && R.athletic.f2.stage_drill_change.enabled) && PLYO_BUCKETS.includes(eb) && !!E.stage && E.stage !== 'RC1';
    // the default-in-slot list only narrows while it keeps the best-scoring library pick in reach
    // (F3: the template station's own words - 'DUBS' on the class's squat day - beat the slot's default list; RECHECK 04 minor)
    const noted = !!E.F3 && allowed.length && (slot.note_tokens || []).some((tk) => allowed[0].ex.id.includes(tk));
    if (!stageFree && !noted && defs.length && allowed.length && allowed[0].score - defs[0].score <= R.selection.weights.default_in_slot + EPS) return defs;
    return allowed;
  };
  let res = run({ variant: false, second: false });
  let picks = pickable(res.fresh);
  // (fix round 2 / F3, E-181; RECHECK v0.4 06 minor 'the Monday and Wednesday curls just swap places at the block change'): a new
  // engine-added exercise is not one the previous exercise block's week just let go, while the pool holds another
  if (opts.avoidIds && opts.avoidIds.size) { const p2 = picks.filter((c) => !opts.avoidIds.has(c.ex.id)); if (p2.length) picks = p2; }
  // v0.5 fix round 2 (04 LOW_BACK_* 'core first as anti-extension / anti-rotation'; RECHECK 01 minor; samples 01 / 02 / 08): with the
  // core slots on the live library (R4-LIB-01) a low-back client's week holds fewer anti-movement drills than core slots - a plank
  // or a side plank runs on a second day (never the day's own, the far day first) before a crunch, a leg raise or a hanging raise
  // takes the slot (rules.selection.x2.core_primary.low_back_repeat_first)
  // (a core slot keeps its exercise through the block, PER-02: the rule decides the first exercise block's pick only)
  if (lowBackCore && CPX && CPX.low_back_repeat_first && !(opts.keepPrev && opts.prevId) && picks.length && new RegExp(CLB.avoid_re).test(picks[0].ex.id)) {
    const avoidRx = new RegExp(CLB.avoid_re);
    const rr = run({ variant: false, second: true });
    const dayEx2 = (st.dayPicks.get(wd) || []).map((x) => x.ex).filter((x) => x && !x.is_athletic);
    // (the Copenhagen plank is a hold too - the low-back bonus leaves it out for its adductor load, as a second-day repeat it is fine)
    const pp = pickable(rr.fresh).filter((c) => !avoidRx.test(c.ex.id) && (antiCore(c.ex) || /copenhagen-plank/.test(c.ex.id)) && !SWAP_ONLY_STATUS.includes(c.ex.status) && !dayEx2.some((x) => x.id === c.ex.id || nearDuplicate(x, c.ex, R)));
    if (pp.length) {
      const WD7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const here = WD7.indexOf(wd);
      const gap = (c) => { let g = 9; for (const [d2, list] of st.dayPicks) if (d2 !== wd && list.some((x) => x.ex && x.ex.id === c.ex.id)) g = Math.min(g, Math.abs(WD7.indexOf(d2) - here)); return g; };
      const order = new Map(pp.map((c, i) => [c.ex.id, i]));
      res = rr; picks = pp.slice().sort((a, b) => gap(b) - gap(a) || order.get(a.ex.id) - order.get(b.ex.id));
    }
  }
  let relaxNote = null;
  // a named library exercise used again this week beats a placeholder record ('Calf Raise - any'; review 01 / 04 / 05 minors)
  const onlyGeneric = (ps) => ps.length > 0 && ps.every((c) => E.genericRe.some((re) => re.test(c.ex.id)));
  if (onlyGeneric(picks)) {
    const rr = run({ variant: false, second: true });
    const pp = pickable(rr.fresh);
    if (pp.length && !onlyGeneric(pp)) { res = rr; picks = pp; }
  }
  let repeatDetail = false;   // B3: a second weekly exposure of the same exercise names one concrete detail (PER-04, R2-LIB-01)
  // v0.5 fix round 1 (R4-LIB-01 'only his live library as primary picks'; sample 05 major): a library lift used again this week -
  // with a named detail - beats a reference-only or program-only record
  if (R.selection.x1 && R.selection.x1.stand_in_library_first && resKindOf(bk)) {
    const SOs = R.selection.swap_only_statuses || [];
    if (picks.length > 0 && picks.every((c) => SOs.includes(c.ex.status))) {
      const rr = run({ variant: false, second: true });
      const pp = pickable(rr.fresh).filter((c) => !SOs.includes(c.ex.status));
      if (pp.length) { res = rr; picks = pp; repeatDetail = true; }
    }
  }
  if (!picks.length) { // substitution order: coach alternates (repeat allowed), same pattern other implement / variant
    const r2 = run({ variant: false, second: true });
    if (pickable(r2.fresh).length) { res = r2; picks = pickable(r2.fresh); repeatDetail = true; }
    else {
      const r3 = run({ variant: true, second: true });
      if (pickable(r3.fresh).length) { res = r3; picks = pickable(r3.fresh); relaxNote = 'pattern_gap'; repeatDetail = true; }
    }
  }
  // B3 (RECHECK 02 / 03 / 06 / 07 minors: home improvisations in a full gym; 03 / 04 / 05: an alternating floor press as the day's lead
  // chest press): a home substitute, or an alternating / one-arm lead press, never beats the real thing the week already uses -
  // that exercise comes back with one concrete detail changed (R2-LIB-01)
  const resKindB3 = ['resistance', 'isolation', 'focus'].includes(bk);
  const LPx = R.selection.lead_press;
  const leadSlot = !!(LPx && LPx.buckets.includes(eb) && day && bk === 'resistance' && (() => { const f = daySlots(day).find((x) => LPx.buckets.includes(x.bucket) && model.bucket(x.bucket).kind === 'resistance'); return f && f.slot_id === slot.slot_id; })());
  // (F3: a sport hot spot's avoided pick - a sissy squat for an ACL-landing athlete - is weak too: the real exercise of the week comes
  // back with one detail instead, E-48; RECHECK 02 minor)
  const hotAvoid = (c) => !!E.F3 && resKindB3 && ([...E.hot.avoid_tags].some((t) => c.ex.tags.includes(t)) || E.hot.avoid_re.some((re) => re.test(c.ex.id)));
  // (F3: a home version is not weak when every real version of the slot is above the client's level - RECHECK 05 major)
  const realAllHard = levelHardOn && res.ranked.filter((c) => !c.ex.tags.includes('home_substitute') && !SWAP_ONLY_STATUS.includes(c.ex.status)).every(levelHard);
  // (fix round 2 / F3: a one-arm lead press the upper dial asked for is not weak; an axial-high pick on a day with no axial station
  // - a barbell calf raise - is: the week's real exercise comes back with a detail instead, R2-SES-01)
  const dialUniLead = !!(E.upperWant && E.upperWant.get(slot.slot_id) === 'uni');
  const axialOff = (c) => !!E.S2 && !!E.F3 && typeof E.F3.axial_high_non_axial_day === 'number' && resKindB3 && c.ex.tags.includes('axial_high') && !!day && !daySlots(day).some((x) => x.axial_req === 'axial');
  // (fix round 2 / F3, E-181; RECHECK v0.4 06 major: a body-weight glute bridge and a sandbag hip thrust as an advanced lifter's glute
  // Focus in a full gym): a trained lifter's big-muscle Focus pick with no load (or an odd implement in a full gym) is weak - a loaded
  // exercise the week already holds comes back with one detail instead
  const NSDw = E.S2 && E.S2.no_step_down;
  const focusWeak = (c) => !!NSDw && bk === 'focus' && (NSDw.levels || []).includes(E.lvl) && !E.older && !!slot.focus_muscle && model.muscle(slot.focus_muscle).class === 'big' &&
    (noLoad(c.ex) || (!!NSDw.odd_implement_re && new RegExp(NSDw.odd_implement_re).test(c.ex.id) && ['FULL_GYM', 'FULL_FACILITY'].includes(E.kit.profile)));
  // (v0.5 fix round 1, EQ-08: a sissy squat or a Nordic curl in the leg-extension / leg-curl slot of a gym that has the machine is
  // weak too - the machine comes back with one detail, one leg at a time or a pause)
  const IMw = R.selection.x1 && R.selection.x1.iso_machine_first;
  const machineWeak = (c) => !!IMw && !!IMw.buckets[eb] && !!E.isoMachine && !!E.isoMachine[eb] && !(IMw.not_families || []).includes(E.family) && new RegExp(IMw.buckets[eb].avoid_re).test(c.ex.id);
  const weak0 = (c) => machineWeak(c) || (R.selection.home_substitute_only_when_needed && resKindB3 && c.ex.tags.includes('home_substitute') && !realAllHard) ||
    (leadSlot && !dialUniLead && E.pressAlt.twoArm && (new RegExp(LPx.avoid_re).test(c.ex.id) || c.ex.laterality !== 'bilateral')) || hotAvoid(c) || levelHard(c) || axialOff(c);
  const weak = (c) => weak0(c) || focusWeak(c);
  const prevKept = !!(opts.keepPrev && opts.prevId && res.fresh.some((c) => c.ex.id === opts.prevId));
  // (fix round 2 / F3: an unloaded Focus pick gives way to a loaded one before a movement family's cap is weighed)
  const strongWeak = (c) => weak0(c) || focusWeak(c);
  if (E.S2 && picks.length && strongWeak(picks[0]) && picks.some((c) => !strongWeak(c))) picks = [...picks.filter((c) => !strongWeak(c)), ...picks.filter(strongWeak)];
  if (picks.length && !prevKept && !opts.forceChange && weak(picks[0])) {
    const rr = run({ variant: false, second: true });
    const dayEx2 = (st.dayPicks.get(wd) || []).map((x) => x.ex).filter((x) => x && !x.is_athletic);
    // (fix round 2 / F3, RECHECK v0.4 05 minor: the same calf raise three times a week, twice with no detail): a repeat needs a detail
    // the week has not used on that exercise yet
    const freeDetail = (c) => { const vals = variationValues(model, c.ex, E.kitTok, E.painAreas); if (!E.S2) return vals.length > 0; const usedV = (st.weekDetails && st.weekDetails.get(c.ex.id)) || new Set(); return vals.some((v) => !usedV.has(v.value)); };
    const usable = (c) => freeDetail(c) && !dayEx2.some((x) => nearDuplicate(x, c.ex, R));
    let better = pickable(rr.fresh).filter((c) => !weak(c) && usable(c));
    if (better.length) { res = rr; picks = better; repeatDetail = true; }
  }
  // keep the previous block's pick (continuity) when asked and still valid
  let chosen = null;
  if (opts.keepPrev && opts.prevId) {
    chosen = res.fresh.find((c) => c.ex.id === opts.prevId) || null;
    // B3: a kept second exposure (the real thing again with one detail, PER-04) stays kept in the next block
    if (!chosen && opts.prevDetail) {
      const rr = run({ variant: false, second: true });
      const c = rr.fresh.find((x) => x.ex.id === opts.prevId);
      if (c) { chosen = c; res = rr; repeatDetail = true; }
    }
    // (fix round 2: a low-back client's repeated plank - rules.selection.x2.core_primary.low_back_repeat_first - stays through the block)
    if (!chosen && lowBackCore && CPX && CPX.low_back_repeat_first) {
      const rr = run({ variant: false, second: true });
      const c = rr.fresh.find((x) => x.ex.id === opts.prevId);
      if (c) { chosen = c; res = rr; }
    }
  }
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
    // B3 (R2-LIB-01 / PER-02 'change one detail'; RECHECK 02 / 05 / 06 / 07 / 08): any kit looks for a real library alternative
    // that differs in one detail (two at most), is not an Olympic-tagged lift in a strength slot, is not much more guided for a
    // trained lifter, is not already in the week, is not a version of another exercise of the day and does not go back to an
    // earlier block's pick; the nearest change wins
    const pool = BC.one_detail ? pickable(res.ranked.filter((c) => !usedDayNow.has(c.ex.id)), { all: true })
      : BC.full_kit_real_alternative ? pickable(res.ranked.filter((c) => !usedDayNow.has(c.ex.id))) : picks;
    const resKind = ['resistance', 'isolation', 'focus'].includes(bk);
    const noOly = (c) => !BC.never_olympic_tag || !resKind || !(c.ex.tags.includes('olympic') || c.ex.is_athletic);
    const noGuided = (c) => !BC.constraint_up_max_l2_l3 || !['L2', 'L3'].includes(E.lvl) || bk !== 'resistance' || !prevEx || c.ex.constraint <= prevEx.constraint + BC.constraint_up_max_l2_l3;
    // v0.4 fix round 2 / F3 (E-181; COACH-ANSWER PER-02, CAT-05; RECHECK v0.4 07 major: flat DB bench -> standing cable press -> DB floor press;
    // kickstand DB deadlift -> DB deadlift -> single-kettlebell deadlift in the hardest block): a block change never lowers the exercise
    // level, as far as the client's own ladder goes
    const NSD = E.S2 && E.S2.no_step_down;
    const lvRank = (lv) => E.ladderOrder.indexOf(lv);
    const noLevelDown = (c) => !NSD || !NSD.level || !resKindOf(bk) || !prevEx || lvRank(c.ex.level) >= Math.min(lvRank(prevEx.level), lvRank(E.ladder));
    const same = (c) => c.ex.id !== opts.prevId && c.ex.pattern === prevEx.pattern && c.ex.credit_class === prevEx.credit_class &&
      (c.ex.laterality === 'bilateral') === (prevEx.laterality === 'bilateral') && noDown(c) && noMachine(c) && noAssist(c) && noOly(c) && noGuided(c) && noLevelDown(c) && !E.genericRe.some((re) => re.test(c.ex.id));
    let alt = null;
    if (prevEx && bk === 'core') {
      // fix round 2 / F3 (E-186; PER-02; RECHECK v0.4 08 major 'plank -> Pallof hold', 04 minor 'rotate core picks'): a day whose lifts
      // cannot change takes another core exercise of the same plane and kind (a hold for a hold, a moving one for a moving one), one
      // the week does not hold and the slot has not used before
      const weekIds = new Set([...st.usedWeek, ...(opts.reserved || []), ...(opts.weekKeep || []), ...E.weekUsed]);
      const hist = new Set([...(E.history[slot.slot_id] || []), ...(opts.prevWeekIds || [])]);
      const isoOf = (e) => !!((e.rep_hint && e.rep_hint.unit === 'seconds') || /(plank|hold|hollow|dead-hang|wall-sit|isometric)/.test(e.id));
      const prevC = res.ranked.find((c) => c.ex.id === opts.prevId);
      const cands = pickable(res.ranked.filter((c) => !usedDayNow.has(c.ex.id)), { all: true }).filter((c) => c.ex.id !== opts.prevId &&
        corePlaneOf(c.ex) === corePlaneOf(prevEx) && antiCore(c.ex) === antiCore(prevEx) && isoOf(c.ex) === isoOf(prevEx) && !weekIds.has(c.ex.id) && !hist.has(c.ex.id) &&
        lvRank(c.ex.level) <= Math.max(lvRank(prevEx.level), lvRank(E.ladder)) && (!prevC || c.score >= prevC.score - 3 - EPS) &&
        !(st.dayPicks.get(wd) || []).some((x) => x.ex && ((familyOf(x.ex, E) && familyOf(x.ex, E) === familyOf(c.ex, E)) || nearDuplicate(x.ex, c.ex, R))) &&
        !(opts.dayKeepIds || []).some((id) => model.hasEx(id) && (nearDuplicate(model.ex(id), c.ex, R) || (familyOf(model.ex(id), E) && familyOf(model.ex(id), E) === familyOf(c.ex, E)))));
      alt = cands[0] || null;
    } else if (prevEx && BC.one_detail) {
      const dist = (c) => changeDistance(prevEx, c.ex);
      const weekIds = new Set([...st.usedWeek, ...(opts.reserved || []), ...(opts.weekKeep || []), ...E.weekUsed]);
      const dayEx = (st.dayPicks.get(wd) || []).map((x) => x.ex).filter(Boolean);
      // never a change to a home substitute from the real thing (R2-LIB-07; RECHECK 02 / 06 minors: DB leg extension on a box,
      // body-weight calf raise at a block change in a full gym)
      const homeDown = (c) => R.selection.home_substitute_only_when_needed && c.ex.tags.includes('home_substitute') && !prevEx.tags.includes('home_substitute');
      let cands = pool.filter((c) => same(c) && dist(c) > 0 && dist(c) <= (BC.max_distance || 2) && !homeDown(c));
      if (BC.week_unique) cands = cands.filter((c) => !weekIds.has(c.ex.id) && !dayEx.some((x) => !x.is_athletic && nearDuplicate(x, c.ex, R)));
      // never an earlier block's pick of this slot (no A-B-A), never another day's pick of the previous block (exercises do not
      // just swap days, RECHECK 03 minor)
      const hist = new Set([...(E.history[slot.slot_id] || []), ...(opts.prevWeekIds || [])]);
      // (hard: with nothing new left the exercise stays and changes one concrete detail instead)
      if (BC.no_return_to_earlier_pick) cands = cands.filter((c) => !hist.has(c.ex.id));
      // the nearest change first, the pick's own score (hot spots, pain, kit, level) weighed in: each extra detail costs 3 points
      const adj = (c) => c.score - 3 * (dist(c) - 1);
      // a change never trades down: an alternative scoring well below the current pick (a barbell for an L1 / 50+ / pain client, a
      // hot-spot lift, a home substitute) loses to a concrete detail on the current exercise (RECHECK 08: barbell calf raise)
      const prevC = res.ranked.find((c) => c.ex.id === opts.prevId);
      if (prevC) cands = cands.filter((c) => c.score >= prevC.score - 3 - EPS);
      alt = cands.slice().sort((a, b) => adj(b) - adj(a) || dist(a) - dist(b) || a.tb - b.tb || (a.ex.id < b.ex.id ? -1 : a.ex.id > b.ex.id ? 1 : 0))[0] || null;
    } else if (prevEx) alt = pool.find((c) => same(c) && !(st.usedByBucket.get(eb) || new Set()).has(c.ex.id)) || pool.find(same) || null;
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
    // (v0.5 fix round 1, LIB-09 / R4-LIB-01; sample 05 major: a lift he keeps for people with shoulder or back pain - the Kong row -
    // is no stand-in for a client without that pain while another one is left)
    {
      const PO = R.selection.x1 && R.selection.x1.pain_only;
      if (PO) { const rxp = new RegExp(PO.re); const keep = altAll.filter((c) => !(rxp.test(c.ex.id) && !E.pain.some((p) => (PO.areas || []).includes(p.area))) && !used2.has(c.ex.id)); if (keep.length) altAll = altAll.filter((c) => !rxp.test(c.ex.id) || E.pain.some((p) => (PO.areas || []).includes(p.area))); }
    }
    // (fix round 2, sample 05 major 'a household exercise in a field / bootcamp kit'; R2-LIB-08 never infer equipment: a home
    // substitute - the table row - is no stand-in outside a home kit while another one is left)
    if (!E.homeKit) { const noHome = altAll.filter((c) => !c.ex.tags.includes('home_substitute') && !used2.has(c.ex.id)); if (noHome.length) altAll = altAll.filter((c) => !c.ex.tags.includes('home_substitute')); }
    const eb2 = altAll.length ? altAll[0].eb : null;
    const altFull = altAll.filter((c) => !used2.has(c.ex.id));
    let alt = altFull;
    // (R4-LIB-01 'only his live library as primary picks'; sample 05 major: a library lift used again in the week - with a named
    // detail - is the stand-in before a reference-only or program-only record; those stay in its swap list)
    if (R.selection.x1 && R.selection.x1.stand_in_library_first) {
      const so = R.selection.swap_only_statuses || [];
      const libAlt = alt.filter((c) => (!so.includes(c.ex.status) || smallKitRow(c)) && !levelHard(c));
      if (libAlt.length) alt = libAlt;
    }
    // F3 (PER-04; RECHECK 05 minor: the same row on both bootcamp days for 8 weeks): a nearest-pattern stand-in the week does not hold yet first
    let altW = E.F3 ? alt.filter((c) => !st.usedWeek.has(c.ex.id) && !levelHard(c)) : [];
    if (R.selection.x1 && R.selection.x1.stand_in_library_first && E.F3 && !altW.length && alt.length) altW = alt.filter((c) => !levelHard(c));
    // (fix round 2 / F3, RECHECK v0.4 05 minor 'the table row is a home substitute in a field kit'; R2-LIB-07): the stand-in stays inside
    // the first pass's profile and is a loaded lift before a home substitute
    if (E.S2 && altW.length) {
      const inLike = opts.like ? altW.filter((c) => (opts.like.bil === null || (c.ex.laterality === 'bilateral') === opts.like.bil) && profileClass(c.ex.credit_class) === profileClass(opts.like.cc)) : altW;
      const pool2 = inLike.length ? inLike : altW;
      // (an in-level lift first - also where the station's own word would let an advanced version through -, a loaded lift before a
      // home substitute, and not the exercise another station of the week had in the first pass)
      const inLevel = pool2.filter((c) => E.ladderOrder.indexOf(c.ex.level) <= E.ladderOrder.indexOf(E.ladder));
      const pool3 = inLevel.length ? inLevel : pool2;
      const loaded = pool3.filter((c) => !c.ex.tags.includes('home_substitute') && !noLoad(c.ex));
      const pool4 = loaded.length ? loaded : pool3;
      const othersBase = new Set(Object.entries(E.baseFills || {}).filter(([sid, f]) => sid !== slot.slot_id && f && f.exercise_id && isLive({ slot_id: sid }, E)).map(([, f]) => f.exercise_id));
      const own = pool4.filter((c) => !othersBase.has(c.ex.id));
      altW = own.length ? own : pool4;
    }
    if (alt.length) {
      // v0.5 (B3 near-duplicates, RECHECK 01 / 03): the stand-in is not a second version of an exercise the day already holds
      // while another stand-in is left (a circuit day can now carry two stations of one pattern - 5-7 stations, R4-SES-02)
      const dayHeld = (st.dayPicks.get(wd) || []).map((x) => x.ex).filter((x) => x && !x.is_athletic);
      const notDup = (c) => !dayHeld.some((x) => x.id !== c.ex.id && nearDuplicate(x, c.ex, R));
      const altWn = altW.filter(notDup), altN = alt.filter(notDup);
      chosen = altWn.length ? altWn[0] : altW.length && !altN.length ? altW[0] : altN.length ? altN[0] : (altW.length ? altW[0] : alt[0]);
      fill.bucket = eb2;
      fill.flags.push('pattern_gap');
      fill.buy = (R.equipment.buy_list[eb] || []).slice();
      fill.why.push(why('why.kit', 'EQ-09'));
      res = { ranked: altFull, fresh: altFull, removedBy: res.removedBy, secondApplied: false };
    }
  }
  if (!chosen) {
    // last resort: the same exercise again with a one-detail variation (R2-LIB-01: a variation, never an invented
    // exercise) so the muscle group keeps 2 exercises (R2-SES-05) when the kit holds a single option
    // B3: the variation always names its concrete detail (R2-LIB-01 'Reverse lunge - dumbbell in opposite hand'); a record with
    // no concrete variation for the kit is not repeated
    const vOf = (c) => variationValues(model, c.ex, E.kitTok, E.painAreas);
    const own = res.ranked.filter((c) => !SWAP_ONLY_STATUS.includes(c.ex.status) && vOf(c).length).map((c) => ({ ...c, eb }));
    const near = altAll.filter((c) => vOf(c).length);
    const again = own[0] || near[0] || null;
    if (again) {
      chosen = again;
      if (again.eb !== eb) { fill.bucket = again.eb; fill.flags.push('pattern_gap'); fill.buy = (R.equipment.buy_list[eb] || []).slice(); }
      const v = vOf(again)[0];
      fill.detail = { axis: v.axis, key: v.key, value: v.value };
      fill.flags.push('detail_variation');
      fill.why.push(why('why.detail_variation', 'R2-LIB-01', { axis: v.axis }));
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
  // B3: the week already holds this exercise (a relaxed second exposure) - it comes back with one concrete detail changed
  if (repeatDetail && !fill.detail && (st.usedWeek.has(ex.id) || E.weekUsed.has(ex.id)) && bk !== 'core' && bk !== 'prehab') {
    const usedV = (st.weekDetails && st.weekDetails.get(ex.id)) || new Set();
    const vals = variationValues(model, ex, E.kitTok, E.painAreas);
    // (fix round 2 / F3, E-186: a value the slot has not carried in an earlier block first - no 'deficit -> one leg -> deficit')
    const histV = new Set((E.S2 && E.S2.block_change ? ((E.history.details || {})[slot.slot_id] || []) : []));
    // (a value another exposure of this exercise keeps this block - `opts.keptDetails` - is taken too)
    const keptV = (opts.keptDetails && opts.keptDetails.get(ex.id)) || new Set();
    const free = vals.filter((x) => !usedV.has(x.value) && !keptV.has(x.value));
    const v = (opts.prevDetail && ex.id === opts.prevId && free.find((x) => x.value === opts.prevDetail.value)) || free.find((x) => !histV.has(x.value)) || free[0] || vals.find((x) => !usedV.has(x.value));
    if (v) { fill.detail = { axis: v.axis, key: v.key, value: v.value }; fill.flags.push('detail_variation'); fill.why.push(why('why.detail_variation', 'R2-LIB-01', { axis: v.axis })); }
  }
  fill.laterality = ex.laterality === 'n/a' ? null : ex.laterality;
  // (v0.5 / V2: the hip day's second hinge left its first pick's credit class for a single-leg hip extension - selectBlock keeps it)
  if (opts.like && profileClass(ex.credit_class) !== profileClass(opts.like.cc) && secondHingeAlt(ex)) { fill.flags.push('second_hinge'); fill.why.push(why('why.second_hinge', 'R4-SES-05')); }
  for (const r of chosen.reasons) if (!fill.why.some((w) => w.key === r.key)) fill.why.push(r);
  if (relaxNote) fill.flags.push(relaxNote);
  if (res.secondApplied && !opts.keepPrev) fill.why.push(why('why.second_exposure', 'PER-04'));
  if (res.removedBy.pain) {
    const area = typeof res.removedBy.pain === 'string' ? res.removedBy.pain : 'other';
    // v0.5 fix round 2 (sample 08 major): the flag and its note only when the lift this slot would hold without the pain is
    // another one that the pain filter took out; the plan then names it ('Instead of X, to protect your knee')
    const PSX = R.selection.x2 && R.selection.x2.pain_swap;
    if (PSX && PSX.only_when_changed) {
      let want = null;
      try { want = intendedWithoutPain(slot, eb, E, st, day, spine); } catch { want = null; }
      if (want && want.id !== ex.id && !hardFilter(want, slot, eb, E, spine).ok) {
        fill.flags.push('pain_swap');
        fill.why.push(why('why.pain_swap', 'R2-LIB-03', { area }));
        fill.pain_instead_of = { exercise_id: want.id, area };
      }
    } else { fill.flags.push('pain_swap'); fill.why.push(why('why.pain_swap', 'R2-LIB-03', { area })); }
  }
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
  // B2: the first reactive block's reactive jump (two feet, low box) - dose writes the low box and the note
  if (E.firstReactive && PLYO_BUCKETS.includes(eb) && ex.athletic && ex.athletic.quality === 'plyometric' && responseOf(ex) === 'single') { fill.flags.push('first_reactive'); fill.why.push(why('why.first_reactive', 'CAT-10')); }
  if (eb === 'AP_COD' && E.sportId && !ROUTE_SPORT_OK(E) && res.removedBy.sport) fill.why.push(why('why.route_sport_only', 'ATH-01'));
  // Olympic day pattern / swings as power (R2-ATH-04, R2-VOL-05)
  if (eb === 'AP_TRIPLE_EXT') {
    if (slot.variant === 'clean') { fill.flags.push('clean_day'); fill.why.push(why('why.clean_day', 'R2-ATH-04')); }
    if (slot.variant === 'snatch') { fill.flags.push('snatch_day'); fill.why.push(why('why.snatch_day', 'R2-ATH-04')); }
    if (ex.tags.includes('kb_swing')) { fill.flags.push('kb_swing_power'); fill.why.push(why('why.kb_swing_power', 'R2-VOL-05')); }
    const ceilF = E.sport && E.sport.olympic && E.sport.olympic.ceiling;
    if (ceilF && R.athletic.f2 && R.athletic.f2.olympic_ceiling && R.athletic.f2.olympic_ceiling.enabled) fill.why.push(why('why.olympic_ceiling', 'ATH-10', { ceiling: 'olympic.ceiling.' + ceilF }));
  }
  // contra / ipsi loading for unilateral lower fills (CAT-13)
  if (['RP_UKD', 'RP_UHD'].includes(ebF) && ['unilateral', 'alternating'].includes(ex.laterality)) {
    fill.loading = loadingFor(ex, E, st);
    if (fill.loading === 'contralateral') fill.why.push(why('why.contralateral', 'CAT-13'));
    if (fill.loading === 'ipsilateral') fill.why.push(why('why.ipsilateral', 'CAT-13'));
  }
  // v0.5 / V2 (COACH-R4 R4-LIB-04): when the pick stands in for an exercise the kit does not hold, the fill names that exercise and
  // says in one line what the stand-in keeps and what it loses
  const SN = R.selection.swap_notes;
  if (SN && SN.enabled && !opts.noInstead) {
    const standIn = (SN.equipment_substitute_flags || []).some((f) => fill.flags.includes(f)) || (ex.tags.includes('home_substitute') && !!res.removedBy.kit);
    if (standIn) {
      const want = intendedWithFullKit(slot, eb, E, st, day, spine);
      if (want && want.id !== ex.id && !model.kitAvailable(want, E.kitObj)) {
        const n = swapNote(model, want, ex);
        fill.instead_of = { exercise_id: want.id, keeps: n.keeps, loses: n.loses };
        // (fix round 2: a vertical-pull slot filled by a row says that the plan has no vertical pull with this kit)
        if (want.credit_class === 'VPULL' && ex.credit_class === 'HPULL' && !fill.flags.includes('no_vertical_pull')) fill.flags.push('no_vertical_pull');
      }
    }
  }
  // swaps: 2-4 from the same filtered pool, never the pick (H01 / H12 hold: same filters)
  const sw = R.selection.swaps;
  if (eb === 'COND_WOD') {
    // the WOD's other stations (3-4 distinct movement groups); a WOD has no swaps (CONTRACT_REQUESTS B3: SlotFill.stations).
    // v0.4 stage B2 (RECHECK 04 major; rules.conditioning.wod rotate_stations_week / exclude_day_pattern / weekly_must_have): the
    // week's WODs rotate their movement groups (a group used in an earlier WOD this week goes to the back), the day's own lift
    // pattern stays out of its WOD (no thruster on the squat day, no swing on the deadlift day), and the week holds a jump and a
    // ball or KB station
    const W = R.conditioning.wod;
    // (fix round 1: a pull-up, an inverted row and toes-to-bar are one movement group of the WOD - 'pull / gymnastics')
    const pullRx0 = W.x1 && W.x1.weekly_must_have_pull ? new RegExp(W.x1.pull_re) : null;
    const wg = (e0) => (pullRx0 && pullRx0.test(e0.id) ? 'pull' : wodGroup(e0));
    let order = res.ranked.filter((c) => !SWAP_ONLY_STATUS.includes(c.ex.status) || addonPrimaryOk(c.ex, slot, eb, E.family, R));
    if (W.rotate_stations_week || W.exclude_day_pattern || W.weekly_must_have) {
      const used = st.wodGroups || new Map();
      const lf = day && day.lower_focus;
      // (v0.5 / V2: a wall ball is a squat-to-target - on the squat day it stays out of the WOD like the thruster)
      const bad = (g, ex2) => W.exclude_day_pattern && ((lf === 'knee' && (g === 'thruster' || (!!ex2 && ex2.tags.includes('wall_ball')))) || (lf === 'hip' && g === 'swing'));
      const must = (g) => (W.weekly_must_have || []).some((m) => (m === 'jump' && g === 'jump') || (m === 'ball_or_kb' && (g === 'ball' || g === 'swing')));
      const mustNeeded = (g) => must(g) && !(W.weekly_must_have || []).some((m) => [...used.keys()].some((u) => (m === 'jump' && u === 'jump' && g === 'jump') || (m === 'ball_or_kb' && (u === 'ball' || u === 'swing') && (g === 'ball' || g === 'swing'))));
      // the same WOD slot of the previous exercise block rotates too (PER-02: something changes at a block boundary)
      const prevF = E.prev && E.prev.fills && E.prev.fills[slot.slot_id];
      const prevGroups = new Set(((prevF && prevF.stations) || []).filter((id) => model.hasEx(id)).map((id) => wg(model.ex(id))));
      // v0.4 fix round 2 / F2 (E-173; RECHECK v0.4 04 major: two WODs kept the same three stations for 8 weeks; thrusters and the same
      // slam three times a week): the same WOD of the previous exercise block gives its movement groups up more firmly, and a station
      // the week's WODs already hold waits for another of its group (rules.conditioning.wod.rotate_r2)
      const RR = W.rotate_r2 || null;
      const usedEx = st.wodEx || new Map();
      // v0.5 fix round 1 (rules.conditioning.wod.x1): the week's WODs hold one pulling / gymnastics station, a movement group is in
      // two WODs a week at most while another passes, and jumping jacks are no station for a trained class member
      const WX = W.x1 || null;
      const pullRx = WX && WX.weekly_must_have_pull ? new RegExp(WX.pull_re) : null;
      const isPullSt = (c) => !!pullRx && pullRx.test(c.ex.id);
      const pullNeeded = (c) => isPullSt(c) && !st.wodPull;
      const adj = (c) => c.score - (W.rotate_stations_week ? 6 * (used.get(wg(c.ex)) || 0) : 0) + (mustNeeded(wg(c.ex)) ? 4 : 0) - (prevGroups.has(wg(c.ex)) ? (RR ? RR.previous_block_group : 2) : 0)
        - (RR ? RR.same_exercise_week * (usedEx.get(c.ex.id) || 0) : 0) + (pullNeeded(c) ? 8 : 0);
      order = order.filter((c) => !bad(wg(c.ex), c.ex));
      if (WX) {
        // (a station is never a second version of an exercise the day already holds - toes-to-bar in the WOD of a day whose core
        // block holds a hanging leg raise; R2-SES-05)
        const todayIds = st.usedByDay.get(weekdayOfSlot(slot)) || new Set();
        const notDup = order.filter((c) => ![...todayIds].some((id) => id !== c.ex.id && model.hasEx(id) && nearDuplicate(c.ex, model.ex(id), R)));
        if (new Set(notDup.map((c) => wg(c.ex))).size >= W.stations[1]) order = notDup;
        const lvlOk = order.filter((c) => !(WX.not_above_l1_re && E.lvl !== 'L1' && new RegExp(WX.not_above_l1_re).test(c.ex.id)));
        if (lvlOk.length) order = lvlOk;
        const fresh = order.filter((c) => !(typeof WX.group_week_max === 'number' && (used.get(wg(c.ex)) || 0) >= WX.group_week_max));
        if (new Set(fresh.map((c) => wg(c.ex))).size >= W.stations[1]) order = fresh;
      }
      order = order.map((c) => ({ ...c, adj: adj(c) }))
        .sort((a, b) => b.adj - a.adj || a.tb - b.tb || (a.ex.id < b.ex.id ? -1 : a.ex.id > b.ex.id ? 1 : 0));
    }
    const stations = [];
    const groups = new Set();
    for (const c of order) {
      if (stations.length >= W.stations[1]) break;
      if (groups.has(wg(c.ex))) continue;
      stations.push(c.ex); groups.add(wg(c.ex));
    }
    if (!stations.length) { stations.push(ex); groups.add(wg(ex)); }
    // (fix round 2 / F2, E-173: a WOD that would repeat the previous exercise block's stations gives its last station to the best
    // station of a movement group it does not hold - PER-02 'something changes at a block boundary')
    {
      const RR2 = W.rotate_r2 || null;
      const prevF2 = E.prev && E.prev.fills && E.prev.fills[slot.slot_id];
      // (the stations every WOD of the block runs are its first W.stations[0]; the later ones only join the longer WODs)
      const nRun = Math.min(W.stations[0], stations.length);
      const prevIds = new Set(((prevF2 && prevF2.stations) || []).slice(0, W.stations[0]));
      if (RR2 && prevIds.size && nRun > 1 && stations.slice(0, nRun).every((e2) => prevIds.has(e2.id))) {
        const alt = order.find((c) => !prevIds.has(c.ex.id) && !stations.includes(c.ex) && !groups.has(wg(c.ex))) || order.find((c) => !prevIds.has(c.ex.id) && !stations.includes(c.ex));
        if (alt) { const out = stations[nRun - 1]; groups.delete(wg(out)); stations[nRun - 1] = alt.ex; groups.add(wg(alt.ex)); }
      }
    }
    if (stations[0] !== ex) { fill.exercise_id = stations[0].id; fill.laterality = stations[0].laterality === 'n/a' ? null : stations[0].laterality; }
    st.wodGroups = st.wodGroups || new Map();
    // the stations past the short WOD's count (W.stations[0]) only run in the longer WODs of the block: half weight
    stations.forEach((e, i) => { const g = wg(e); st.wodGroups.set(g, (st.wodGroups.get(g) || 0) + (i < W.stations[0] ? 1 : 0.5)); });
    st.wodEx = st.wodEx || new Map();
    for (const e of stations) st.wodEx.set(e.id, (st.wodEx.get(e.id) || 0) + 1);
    { const WX2 = W.x1; if (WX2 && WX2.weekly_must_have_pull && stations.slice(0, W.stations[0]).some((e) => new RegExp(WX2.pull_re).test(e.id))) st.wodPull = true; }
    fill.stations = stations.map((e) => e.id);
  } else {
    let others = res.ranked.filter((c) => c.ex.id !== ex.id);
    // B3 (RECHECK 08 minor: a beginner's ankle hops offered intermediate single-leg plate hops): swaps at or below the client's
    // ladder come first
    const within = (c) => E.ladderOrder.indexOf(c.ex.level) <= E.ladderOrder.indexOf(E.ladder);
    others = [...others.filter(within), ...others.filter((c) => !within(c))];
    // B3 (RECHECK 02 minor: a Copenhagen plank swapped for toes-to-bar): a core swap stays in the plane of the pick
    if (bk === 'core' && R.selection.core_swaps_same_plane) {
      const same = others.filter((c) => c.ex.plane === ex.plane);
      others = same.length >= sw.min ? same : [...same, ...others.filter((c) => c.ex.plane !== ex.plane)];
      // F3 (GEN-04 / CAT-08 swap within the category; RECHECK 02 minor: Plank -> Crunch / sit-ups): a hold or anti-movement pick swaps
      // to holds / anti-movement first, a moving one to moving ones
      if (E.F3 && E.F3.core_swaps_by_category) {
        const cat = antiCore(ex);
        const sameCat = others.filter((c) => antiCore(c.ex) === cat);
        others = [...sameCat, ...others.filter((c) => antiCore(c.ex) !== cat)];
      }
      // (fix round 2, R4-LIB-04: a core swap keeps the pick's trunk action - a sit-up is never swapped for a superman - and is
      // never a carry)
      const SNx = R.selection.x2 && R.selection.x2.swap_notes;
      if (SNx && SNx.core_same_function) {
        const fn = coreFunction(ex);
        const noCarry = others.filter((c) => !c.ex.tags.includes('carry_sled'));
        const sameFn = noCarry.filter((c) => coreFunction(c.ex) === fn);
        const cross = (c) => (fn === 'flexion' && coreFunction(c.ex) === 'extension') || (fn === 'extension' && coreFunction(c.ex) === 'flexion');
        others = [...sameFn, ...noCarry.filter((c) => coreFunction(c.ex) !== fn && !cross(c))];
      }
    }
    // F3 (RECHECK 07 minor: 'Weighted Dip -> Incline Barbell Bench', the day's own work lift, in the swap list): a swap is never an
    // exercise the day already holds
    if (E.F3 && E.F3.swaps_not_on_day) {
      const today = st.usedByDay.get(wd) || new Set();
      const off = others.filter((c) => !today.has(c.ex.id));
      if (off.length >= Math.min(sw.min, others.length)) others = off;
    }
    // v0.4 fix round 2 / F3 (E-185; GEN-04, CAT-09, CAT-04 / EQ-09): a swap stays in the pick's own category and passes the client's leans
    const SW = E.S2 && E.S2.swaps;
    if (SW) others = swapsR2(others, ex, eb, bk, E, SW);
    fill.swaps = others.slice(0, sw.max).map((c) => c.ex.id);
    // v0.5 fix round 1: a lift's swap list is never left short by the second pass's own filters (GEN-04 'default pick plus a dropdown
    // in every slot'; sample 08 minor: the one-arm pulldown printed no swap). The slot's other library lifts of the same category
    // fill it - the two-arm version of a one-arm pick; for the incline press of the week's 'Chest / Shoulders' slot the slot's own
    // presses, a high-incline and an overhead press (R4-LIB-03 'overhead pressing stays in the swaps').
    {
      const CSw = R.selection.x1 && R.selection.x1.chest_shoulders;
      const CSUw = R.selection.x2 && R.selection.x2.chest_slot_uni;
      const uniChest = !!CSw && !!CSUw && !!E.chestShoulders && E.chestShoulders.has(slot.slot_id) && new RegExp(CSUw.id_re).test(ex.id);
      const chestPick = !!CSw && (uniChest || (eb === CSw.bucket && new RegExp(CSw.incline_re).test(ex.id)));
      const short = resKindOf(bk) && !ex.is_athletic && fill.swaps.length < Math.min(sw.min, sw.max);
      if ((chestPick && fill.swaps.length < sw.max) || short) {
        const today = st.usedByDay.get(wd) || new Set();
        const li = (lv) => E.ladderOrder.indexOf(lv);
        const wantCls = chestPick ? 'VPUSH' : profileClass(ex.credit_class);
        // (fix round 2: the alternating incline press of a cutting-sport athlete's 'Chest / Shoulders' slot printed no swap - the
        // two-arm incline presses are its first swaps, GEN-04)
        const rxInc = chestPick ? new RegExp(CSw.incline_re) : null;
        const poolX = chestPick && CSw.lead_bucket ? [...model.bySlot(eb), ...model.bySlot(CSw.lead_bucket).filter((e) => rxInc.test(e.id) && !model.bySlot(eb).includes(e))] : model.bySlot(eb);
        let extra = poolX.filter((e) => e.id !== ex.id && !fill.swaps.includes(e.id) && !today.has(e.id) && (profileClass(e.credit_class) === wantCls || (chestPick && rxInc.test(e.id))) && (!chestPick || e.laterality === 'bilateral') &&
          !SWAP_ONLY_STATUS.includes(e.status) && !(R.selection.swap_only_statuses || []).includes(e.status) && li(e.level) <= li(E.ladder) && !E.genericRe.some((re) => re.test(e.id)) &&
          !/push-press|jerk|thruster/.test(e.id) && hardFilter(e, slot, eb, E, { used: { squat: null, hinge: null }, weekday: wd }).ok);
        if (E.S2 && E.S2.swaps) extra = swapsR2(extra.map((e) => ({ ex: e })), ex, eb, bk, E, { ...E.S2.swaps, same_category: false }).map((c) => c.ex);
        // (the same movement first - a lat pulldown for a one-arm lat pulldown - then the slot's default lifts)
        const noun = anatomy(ex).noun;
        extra.sort((a, b) => (anatomy(b).noun === noun ? 1 : 0) - (anatomy(a).noun === noun ? 1 : 0) || (isDefaultPick(b, eb, E) ? 1 : 0) - (isDefaultPick(a, eb, E) ? 1 : 0) || (a.id < b.id ? -1 : 1));
        // (the chest slot: one high-incline press and one overhead press first, while the list has room)
        const hi = chestPick ? extra.find((e) => e.tags.includes('mid_range_push')) : null, oh = chestPick ? extra.find((e) => e.tags.includes('overhead') && !e.tags.includes('mid_range_push')) : null;
        const top = chestPick ? sw.max : Math.min(sw.min, sw.max);
        const inc1 = chestPick && !fill.swaps.length ? extra.find((e) => rxInc.test(e.id)) : null;
        for (const e of [inc1, hi, oh, ...extra]) if (e && fill.swaps.length < top && !fill.swaps.includes(e.id)) fill.swaps.push(e.id);
      }
    }
    // v0.5 fix round 2 (sample 08 major: 'Lunge' - the placeholder record - and two bar-on-the-back squats offered as swaps of a
    // beginner's knee-protected squat): a swap is never a placeholder record; on a slot a pain area touches, a beginner's swaps
    // never load the spine heavily and the hot spot's own preferred lifts come first
    {
      const SWX = R.selection.x2 && R.selection.x2.swaps;
      if (SWX && fill.swaps.length) {
        const exOf = (id) => model.ex(id);
        let list = fill.swaps.filter((id) => !E.genericRe.some((re) => re.test(id)));
        const regionX = slotRegion(slot, eb, model);
        const painHere = E.pain.some((p) => touches(p.area, regionX));
        if (painHere) {
          if ((SWX.pain_no_axial_high_levels || []).includes(E.lvl)) { const soft = list.filter((id) => exOf(id).axial_class !== 'high'); if (soft.length) list = soft; }
          const pref = (id) => (E.hot && (E.hot.prefer_re.some((re) => re.test(id)) || [...E.hot.prefer_tags].some((t) => exOf(id).tags.includes(t))) ? 0 : 1);
          list = list.map((id, i) => ({ id, i })).sort((a, b) => pref(a.id) - pref(b.id) || a.i - b.i).map((x) => x.id);
        }
        fill.swaps = list;
      }
    }
    // v0.5 / V2 (COACH-R4 R4-LIB-03 'mid-range pull ... between horizontal and vertical pull'): the category has no slot of its own in the
    // coach's templates, so a row or a pulldown lists one mid-range pull among its swaps (the last place) when the kit holds one
    const MP = R.selection.mid_range && R.selection.mid_range.pull;
    if (MP && MP.fills.includes(eb) && bk === 'resistance' && !ex.tags.includes(MP.tag) && fill.swaps.length && !fill.swaps.some((id) => model.ex(id).tags.includes(MP.tag))) {
      const today = st.usedByDay.get(wd) || new Set();
      const mid = res.ranked.find((c) => c.ex.pattern === MP.pattern && c.ex.tags.includes(MP.tag) && c.ex.id !== ex.id && !today.has(c.ex.id));
      if (mid) fill.swaps = [...fill.swaps.slice(0, Math.max(0, sw.max - 1)), mid.ex.id];
    }
  }
  return fill;
}

/**
 * v0.4 fix round 2 / F3 (E-185; COACH-ANSWER GEN-04 'a swap is a same-category dropdown', CAT-09 'leg curls are their own bucket', CAT-04 /
 * EQ-09; RECHECK v0.4 01 / 03 / 04 / 08): the swap list of a pick - the pick's own credit class (two-legged / single-leg like the pick
 * first), nothing the client's hot spots, pain, level or implement ladder lean away from, a skill only for its own skill family, and
 * at most `max_per_stem` versions of one variant.
 */
function swapsR2(others, ex, eb, bk, E, SW) {
  const { R } = E;
  let list = others;
  if (SW.same_category && resKindOf(bk) && !ex.is_athletic) {
    const bil = ex.laterality === 'bilateral';
    // (v0.5 fix round 1: a high-incline press - class MRPUSH - and an overhead press are one swap category, the slot's 'vertical push
    // ... or an incline press', R4-SES-05 / R4-LIB-03 'overhead pressing stays in the swaps'; the incline bench of the week's
    // 'Chest / Shoulders' slot swaps to the other incline presses first, then to the slot's own presses)
    const CSs = R.selection.x1 && R.selection.x1.chest_shoulders;
    const chestPick = !!CSs && eb === CSs.bucket && new RegExp(CSs.incline_re).test(ex.id);
    const cls = chestPick
      ? [...list.filter((c) => new RegExp(CSs.incline_re).test(c.ex.id)), ...list.filter((c) => !new RegExp(CSs.incline_re).test(c.ex.id) && profileClass(c.ex.credit_class) === 'VPUSH')]
      : list.filter((c) => profileClass(c.ex.credit_class) === profileClass(ex.credit_class));
    list = chestPick ? cls : [...cls.filter((c) => (c.ex.laterality === 'bilateral') === bil), ...cls.filter((c) => (c.ex.laterality === 'bilateral') !== bil)];
  }
  if (SW.client_filter) {
    const PA = R.selection.pain_avoid_id_patterns || {};
    const BB = R.selection.barbell_l1_50_pain;
    const CLB = E.F3 && E.F3.core_low_back;
    const C2 = E.S2.core;
    const lowBack = !!CLB && ((CLB.hotspots || []).some((h) => E.injuries.has(h)) || E.painAreas.includes('lower_back'));
    const li = (lv) => E.ladderOrder.indexOf(lv);
    list = list.filter((c) => {
      const e = c.ex, tags = e.tags || [];
      if (E.hot && ([...E.hot.avoid_tags].some((t) => tags.includes(t)) || E.hot.avoid_re.some((re) => re.test(e.id)))) return false;
      for (const p of E.pain) for (const re of PA[p.area] || []) if (new RegExp(re).test(e.id)) return false;
      if (BB && ['resistance', 'isolation'].includes(bk) && implementOf(e) === 'barbell' && implementOf(ex) !== 'barbell' &&
          (BB.levels.includes(E.lvl) || (E.age || 0) >= BB.from_age || E.pain.length)) return false;
      if (bk === 'core' && lowBack && new RegExp(CLB.avoid_re).test(e.id)) return false;
      if (bk === 'core' && E.heavy && C2 && C2.heavy_avoid_re && new RegExp(C2.heavy_avoid_re).test(e.id)) return false;
      const over = li(e.level) - li(E.ladder);
      if (resKindOf(bk) && (over >= 2 || (over >= 1 && e.skill === 'high'))) return false;
      return true;
    });
  }
  if (eb === 'SKILL' && Array.isArray(SW.skill_families)) {
    const fam = SW.skill_families.find((f) => f.includes(ex.id));
    if (fam) list = list.filter((c) => fam.includes(c.ex.id));
  }
  if (typeof SW.max_per_stem === 'number') {
    const stems = SW.stem_re || [];
    const key = (id) => stems.find((t) => id.includes(t)) || id.split('-').slice(0, 2).join('-');
    const n = new Map();
    list = list.filter((c) => { const k = key(c.ex.id); n.set(k, (n.get(k) || 0) + 1); return n.get(k) <= SW.max_per_stem; });
  }
  return list;
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
  const prev = ctx.prev || null;
  // v1.2: the tested lifts stay the same exercise for the whole block (R2-PER-07 'the same test'). v0.4 (stage B1, minimal):
  // the lock is decided before the laterality dial, so a locked lift is never flipped to its unilateral sibling to meet the
  // bilateral share (review RECHECK 02: the end test moved off the front squat when fewer unilateral stations were left)
  const locked = new Set();
  // (fix round 2 / F3: in the second pass the first block reads the first pass's picks, so the dials leave the lifts to be tested alone)
  const lockFrom = prev || (E.S2 && ctx.base) || null;
  if (lockFrom && R.tests.lock_tested_exercise && ((derived.D13_tests && derived.D13_tests.items) || []).includes('strength')) {
    const all = layout.days.flatMap((d) => daySlots(d));
    const okEx = (sl) => { const f = lockFrom.fills[sl.slot_id]; const ex = f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; return !!ex && ex.laterality === 'bilateral' && ex.exercise_class === 'compound' && !ex.is_athletic; };
    for (const b of ['RP_BKD', 'RP_BHD', 'RP_HPUSH']) {
      const c0 = all.filter((sl) => sl.bucket === b && sl.block !== 'circuit' && okEx(sl));
      // (fix round 2 / F3, E-178: a station the plan keeps before one the time check dropped)
      const c = c0.some((sl) => isLive(sl, E)) ? c0.filter((sl) => isLive(sl, E)) : c0;
      const hit = c.find((sl) => sl.axial_req === 'axial') || c.find((sl) => sl.role === 'work') || c[0];
      if (hit) locked.add(hit.slot_id);
    }
  }
  let lat = decideLaterality(layout, E, locked);
  if (E.frozen && ctx.base && ctx.base.fills) {
    // (frozen second pass: every lower station keeps the bucket the first pass gave it)
    lat = new Map();
    for (const day of layout.days) for (const sl of daySlots(day)) {
      const bf0 = ctx.base.fills[sl.slot_id];
      if (LOWER_RP.includes(sl.bucket) && bf0 && LOWER_RP.includes(bf0.bucket) && bf0.bucket !== sl.bucket) lat.set(sl.slot_id, bf0.bucket);
    }
  }
  // v0.4 fix round 2 / F3 (E-179): the upper-body dial of this exercise block (scoreOf reads E.upperWant)
  E.upperWant = decideUpperLaterality(layout, E, locked, (ctx.base && ctx.base.fills) || null);
  // the stations the dials turn at this block boundary: the previous pick no longer has the station's laterality (E-127 lower: the
  // effective bucket moved; E-179 upper: two-arm <-> one-arm); such a flip is the day's change (PER-02 'one or two small changes')
  const BC2 = (E.S2 && E.S2.block_change) || null;
  const upFlip = new Set(), flipDays = new Set();
  if (prev) for (const day of layout.days) for (const sl of daySlots(day)) {
    if (!isLive(sl, E)) continue;
    const pf = prev.fills[sl.slot_id];
    if (!pf || !pf.exercise_id || !model.hasEx(pf.exercise_id)) continue;
    if (LOWER_RP.includes(sl.bucket) && LOWER_RP.includes(pf.bucket) && pf.bucket !== (lat.get(sl.slot_id) || sl.bucket)) flipDays.add(day.weekday);
    const uw = E.upperWant.get(sl.slot_id);
    if (uw && (model.ex(pf.exercise_id).laterality === 'bilateral') !== (uw === 'bil')) { upFlip.add(sl.slot_id); flipDays.add(day.weekday); }
  }
  const fills = {};
  // (second pass: the kit gaps the first pass found stay on the buy list - the kept picks no longer carry them)
  const buy = new Set((ctx.base && ctx.base.buy_list) || []);
  const selWhy = [];
  // block changes (PER-02, R2-LIB-01): per day at most max_share of the other resistance slots change; work + core kept;
  // circuits change too
  const change = new Set();
  const detailOnly = new Set();
  const backups = new Map();     // B3: weekday -> slot ids that take over a change their day could not make
  const processed = new Set();
  if (prev) {
    selWhy.push(why('why.block_change', 'PER-02'));
    const bc = R.selection.block_change;
    for (const day of layout.days) {
      // (fix round 2 / F3, E-178 / E-186: the day's change falls on a station the plan keeps; a day a dial flips has had its change)
      if (BC2 && BC2.flip_is_the_change && flipDays.has(day.weekday)) continue;
      const others = daySlots(day).filter((s) => ['resistance', 'isolation'].includes(model.bucket(s.bucket).kind) && isLive(s, E) && !upFlip.has(s.slot_id) &&
        !bc.keep_roles.includes(s.role) && !locked.has(s.slot_id) && prev.fills[s.slot_id] && prev.fills[s.slot_id].exercise_id && (bc.include_circuits || s.block !== 'circuit'));
      if (!others.length) continue;
      const order = others.slice().sort((a, b) => tieBreak(E.seed, 'block_change', E.exerciseBlock, a.slot_id) - tieBreak(E.seed, 'block_change', E.exerciseBlock, b.slot_id) || (a.slot_id < b.slot_id ? -1 : 1));
      const n = Math.floor(bc.max_share_of_slots * others.length + EPS);
      const fullKit = ['FULL_GYM', 'BASIC_GYM', 'FULL_FACILITY'].includes(E.kit.profile);
      if (bc.one_detail) {
        // B3: every kit changes at least one slot a day (a real one-detail alternative, else a concrete detail); a slot that can
        // do neither hands its change to the next slot of the day (backups)
        const k = Math.max(1, n);
        for (const s of order.slice(0, k)) change.add(s.slot_id);
        backups.set(day.weekday, order.slice(k).map((s) => s.slot_id));
      } else if (n > 0) for (const s of order.slice(0, n)) change.add(s.slot_id);
      else if (bc.allow_detail_variation) { if (fullKit && bc.full_kit_real_alternative) change.add(order[0].slot_id); else detailOnly.add(order[0].slot_id); }
    }
  }
  // v0.4 fix round 1 / F3 (COACH-R3 R3-VOL-01 'rear delts are not an individual muscle ... people and coaches can add more'; R3-SES-01
  // Focus muscles; RECHECK 06 major: four rear-delt flies a week while the client's Focus was the side delts; 02 minor: both delt slots
  // reverse flies, no side raise): with a side-delt / shoulders Focus every rear-delt station but the week's last takes a side raise;
  // a week with two or more rear stations and no side station turns its second one into a side raise
  const DV = E.F3 && E.F3.delt_variants;
  const deltVar = new Map();
  if (DV) {
    const delts = [];
    for (const day of layout.days) for (const sl of daySlots(day)) if (sl.bucket === 'ISO_SIDE_REAR_DELT' && sl.block !== 'circuit' && isLive(sl, E)) delts.push(sl);
    const rear = delts.filter((x) => x.variant === 'rear'), side = delts.filter((x) => x.variant === 'side');
    const keepN = DV.side_focus_keep_rear || 1;
    if ((DV.side_focus_choices || []).some((c) => E.focusChoices.has(c)) && rear.length > keepN) {
      const keep = new Set(rear.slice(-keepN).map((x) => x.slot_id));
      for (const x of rear) if (!keep.has(x.slot_id)) deltVar.set(x.slot_id, 'side');
    } else if (DV.second_rear_to_side && !side.length && rear.length >= 2) deltVar.set(rear[1].slot_id, 'side');
  }
  const KEEP_KINDS = ['resistance', 'isolation', 'core', 'focus', 'prehab'];
  const prevWeekIds = new Set(prev ? Object.values(prev.fills || {}).map((f) => f && f.exercise_id).filter(Boolean) : []);
  const keepIds = new Map(); // slot_id -> {eb, id, live}: previous picks that stay (continuity, PER-02)
  if (prev) for (const day of layout.days) for (const slot of daySlots(day)) {
    const pf = prev.fills[slot.slot_id];
    const eb = lat.get(slot.slot_id) || slot.bucket;
    if (pf && pf.exercise_id && pf.bucket === eb && KEEP_KINDS.includes(model.bucket(slot.bucket).kind) && !change.has(slot.slot_id) && !upFlip.has(slot.slot_id)) keepIds.set(slot.slot_id, { eb, id: pf.exercise_id, live: isLive(slot, E), detail: pf.detail && pf.detail.value ? pf.detail.value : '' });
  }
  // (fix round 2 / F3, E-186: the detail every kept exposure of an exercise carries this block - a second exposure never takes the same)
  const keptDetailsFor = (slotId) => {
    const m = new Map();
    if (!(BC2 && BC2.week_distinct_details)) return m;
    for (const [sid, k] of keepIds) { if (sid === slotId || !k.live) continue; if (!m.has(k.id)) m.set(k.id, new Set()); m.get(k.id).add(k.detail); }
    return m;
  };
  const dayChanged = new Map();   // weekday -> a station of the day changed its exercise or its detail at this block boundary
  for (const wd of flipDays) dayChanged.set(wd, true);
  const coreKind = (sl) => model.bucket(sl.bucket).kind === 'core';
  // (E-178: a station the time check dropped keeps the pick of the first pass - `ctx.base` - so the time check reads the same station)
  const baseFills = (ctx.base && ctx.base.fills) || null;
  const copyFill = (bf) => ({ ...bf, detail: bf.detail ? { ...bf.detail } : null, swaps: (bf.swaps || []).slice(), why: (bf.why || []).slice(), flags: (bf.flags || []).slice(), ...(bf.stations ? { stations: bf.stations.slice() } : {}) });
  const REPICK_KINDS = ['resistance', 'isolation', 'focus', 'core'];
  const KEEP_BASE_FLAGS = ['pattern_gap', 'no_candidate', 'machine_iso_swap', 'no_medball_sub'];
  const doSlot = (day, slot, shadow) => {
      const kind = model.bucket(slot.bucket).kind;
      const bf = baseFills ? baseFills[slot.slot_id] || null : null;
      const bx = bf && bf.exercise_id && model.hasEx(bf.exercise_id) ? model.ex(bf.exercise_id) : null;
      const usedToday = st.usedByDay.get(weekdayOfSlot(slot)) || new Set();
      // second pass (E-178): a dropped station, an athletic / joint-care / warm-up / cardio station and a station the first pass
      // filled by a fallback keep the first pass's pick (unless the day now holds that exercise elsewhere)
      // (a nearest-pattern stand-in that is a home substitute is picked again: a loaded lift of the same profile may pass the kit)
      // (... and so is a push-up stand-in that sits more than one step from the week's other push-ups: E-189)
      const PB2 = E.S2 && E.S2.push_up_band;
      const pushRank = (id) => { const i = PB2.ladder.findIndex((re) => new RegExp(re).test(id)); return i < 0 ? PB2.default_rank : i; };
      const pushGap = !!bx && !!PB2 && !shadow && (bf.flags || []).includes('pattern_gap') && /push-up/.test(bx.id) && !bx.is_athletic && layout.days.some((d2) => daySlots(d2).some((x) => {
        const o = x.slot_id !== slot.slot_id && isLive(x, E) && baseFills[x.slot_id] ? baseFills[x.slot_id].exercise_id : null;
        return !!o && /push-up/.test(o) && model.hasEx(o) && !model.ex(o).is_athletic && Math.abs(pushRank(o) - pushRank(bx.id)) > PB2.max_gap;
      }));
      const homeGap = !!bx && (bf.flags || []).includes('pattern_gap') && ((bx.tags || []).includes('home_substitute') || pushGap) && !shadow;
      if (bf && (shadow || !REPICK_KINDS.includes(kind) || slot.aerobic || ((bf.flags || []).some((f) => KEEP_BASE_FLAGS.includes(f)) && !homeGap)) && !(bx && usedToday.has(bx.id))) {
        const fill0 = copyFill(bf);
        // (E-185; RECHECK v0.4 04 minor: toes-to-bar offered as a swap for double-unders) the copy keeps the first pass's pick; a skill's
        // swaps stay in its own skill family
        const SWF = E.S2 && E.S2.swaps && E.S2.swaps.skill_families;
        if (Array.isArray(SWF) && bx && slot.bucket === 'SKILL') {
          const fam = SWF.find((f) => f.includes(bx.id));
          if (fam) fill0.swaps = fam.filter((id) => id !== bx.id && model.hasEx(id) && hardFilter(model.ex(id), slot, slot.bucket, E, null).ok);
        }
        processed.add(slot.slot_id);
        record(st, slot, fill0, bx, E, shadow);
        fills[slot.slot_id] = fill0;
        return;
      }
      let eb = lat.get(slot.slot_id) || slot.bucket;
      const CI = R.selection.chest_iso_to_press_when_pull_ratio_gte;
      if (eb === 'ISO_CHEST' && typeof CI === 'number' && E.sport && typeof E.sport.pull_per_push === 'number' && E.sport.pull_per_push >= CI) eb = 'RP_HPUSH'; // review 01 major 7
      const prevFill = prev && prev.fills[slot.slot_id];
      const prevId = prevFill && prevFill.exercise_id;
      // second pass: the time and credit profile of the first pick (the lower dial's own flips - the effective bucket moved - and the
      // upper dial's flips excepted)
      let like = null;
      if (bx && kind !== 'core' && !slot.aerobic && !(LOWER_RP.includes(slot.bucket) && bf.bucket !== eb)) {
        const uw = E.upperWant.get(slot.slot_id);
        like = { bil: uw ? uw === 'bil' : bx.laterality === 'bilateral', cc: bx.credit_class };
        // (a timed circuit's upper-body station costs the same seconds one-arm or two-arm: only its credit class is held - E-189)
        if ((slot.block === 'circuit' || slot.circuit) && ['HPUSH', 'VPUSH', 'HPULL', 'VPULL'].includes(bx.credit_class)) like.bil = null;
      }
      // fix round 2 / F3 (E-186; PER-02; RECHECK v0.4 08 major: three exercise blocks with no change on a day): a day whose lifts could not
      // change (no real alternative, no free detail) changes one core exercise inside its plane - the day's core slots are picked after
      // its lifts for this
      const coreBackup = !!(prev && !shadow && BC2 && BC2.core_backup && kind === 'core' && day.kind === 'main' && prevId && !dayChanged.get(day.weekday) && !slot.aerobic);
      if (coreBackup) change.add(slot.slot_id);
      const flipped = upFlip.has(slot.slot_id);
      const strictKeep = !!prevId && KEEP_KINDS.includes(kind) && !change.has(slot.slot_id) && !flipped;
      const reserved = new Set();
      for (const [sid, k] of keepIds) if (sid !== slot.slot_id && k.eb === eb && k.id !== prevId && (shadow || k.live)) reserved.add(k.id);
      // B3: every exercise the week keeps from the previous block (any bucket), and every pick of the previous block
      const weekKeep = new Set();
      for (const [sid, k] of keepIds) if (sid !== slot.slot_id && k.id !== prevId && (shadow || k.live)) weekKeep.add(k.id);
      let fill;
      const slotX = deltVar.has(slot.slot_id) ? { ...slot, variant: deltVar.get(slot.slot_id) } : slot;
      if (slot.aerobic) fill = aerobicFill(slot, E);
      else {
        // (the picks the day's other slots keep from the previous block: a changed core exercise is never a version of one of them)
        const dayKeepIds = daySlots(day).filter((x) => x.slot_id !== slot.slot_id && keepIds.has(x.slot_id)).map((x) => keepIds.get(x.slot_id).id);
        const dayBaseIds = homeGap && baseFills ? daySlots(day).filter((x) => x.slot_id !== slot.slot_id && isLive(x, E) && baseFills[x.slot_id] && baseFills[x.slot_id].exercise_id).map((x) => baseFills[x.slot_id].exercise_id) : [];
        fill = pickFor(slotX, day, E, st, eb, { keepPrev: strictKeep, forceChange: change.has(slot.slot_id) && !flipped, prevId, reserved, weekKeep, prevWeekIds, like, dayKeepIds, dayBaseIds, keptDetails: keptDetailsFor(slot.slot_id), prevDetail: prevFill && prevFill.detail && prevFill.detail.value ? prevFill.detail : null });
        // (a stand-in that is still a version of another exercise of the day gives way to the first pass's pick)
        if (homeGap && fill.exercise_id && fill.exercise_id !== bf.exercise_id && dayBaseIds.some((id) => model.hasEx(id) && nearDuplicate(model.ex(id), model.ex(fill.exercise_id), R))) fill = copyFill(bf);
      }
      // (second pass: a pick that left the first pick's profile - a fallback found nothing inside it - gives way to the first pick)
      if (like && bx && !(fill.flags || []).includes('second_hip_knee_flexion') && !(fill.flags || []).includes('second_hinge')) {
        const fx = fill.exercise_id && model.hasEx(fill.exercise_id) ? model.ex(fill.exercise_id) : null;
        const off = !fx || (like.bil !== null && (fx.laterality === 'bilateral') !== like.bil) || profileClass(fx.credit_class) !== profileClass(like.cc);
        if (off && (!usedToday.has(bx.id) || homeGap)) fill = copyFill(bf);
      }
      if (slotX !== slot && fill.exercise_id) fill.why.push(why('why.delt_variant', 'R3-VOL-01'));
      // B3: a kept exercise keeps its block's detail (the variation stays until the slot changes again; no A-B-A on details)
      if (strictKeep && fill.exercise_id && fill.exercise_id === prevId && prevFill.detail && prevFill.detail.value && !fill.detail) fill.detail = { ...prevFill.detail };
      if (prevFill && prevFill.bucket !== fill.bucket && fill.exercise_id && !(fill.flags || []).includes('second_hip_knee_flexion') && !(prevFill.flags || []).includes('second_hip_knee_flexion')) { fill.flags.push('laterality_flip'); fill.why.push(why('why.laterality_share', 'UNI-02', { pct: Math.round((E.lowerTarget || 0) * 100) })); }
      else if (lat.has(slot.slot_id) && fill.exercise_id) fill.why.push(why('why.laterality_share', 'UNI-02', { pct: Math.round((E.lowerTarget || 0) * 100) }));
      // (fix round 2 / F3, E-179: an upper station the dial turned at this block boundary)
      if (flipped && fill.exercise_id && prevId && fill.exercise_id !== prevId && (model.ex(fill.exercise_id).laterality === 'bilateral') !== (model.ex(prevId).laterality === 'bilateral')) fill.flags.push('laterality_flip');
      if (strictKeep && fill.exercise_id === prevId && !fill.why.some((w) => w.key === 'why.continuity')) fill.why.push(why('why.continuity', 'PER-02'));
      if (locked.has(slot.slot_id) && fill.exercise_id === prevId) fill.why.push(why('why.tested_locked', 'R2-PER-07'));
      // one-detail variation (R2-LIB-01): when no alternative exists, or as the day's single small change. B3: the detail is a
      // concrete value ('weight in the opposite hand', '1-second pause at the bottom'), never the axis alone ('different grip');
      // a value the slot already used in an earlier block is skipped; no concrete value -> the exercise stays as it is and the
      // change moves to the next slot of the day
      if (prev && fill.exercise_id && fill.exercise_id === prevId && (change.has(slot.slot_id) || detailOnly.has(slot.slot_id)) && kind !== 'core') {
        const ex = model.ex(fill.exercise_id);
        const usedV = new Set([prevFill && prevFill.detail && prevFill.detail.value, ...((E.history.details || {})[slot.slot_id] || [])].filter(Boolean));
        // (fix round 2 / F3, E-186: never the detail another exposure of this exercise carries this week)
        if (BC2 && BC2.week_distinct_details) {
          for (const v0 of (st.weekDetails && st.weekDetails.get(ex.id)) || []) if (v0) usedV.add(v0);
          for (const v0 of keptDetailsFor(slot.slot_id).get(ex.id) || []) if (v0) usedV.add(v0);
        }
        const vals = variationValues(model, ex, E.kitTok, E.painAreas).filter((v) => !usedV.has(v.value));
        const k = Math.max(0, E.exerciseBlock - (E.tb ? E.tb.first_exercise_block : 1) - 1);
        const v = vals.length ? vals[k % vals.length] : null;
        if (v) {
          fill.detail = { axis: v.axis, key: v.key, value: v.value };
          fill.flags = fill.flags.filter((f) => f !== 'block_change');
          fill.flags.push('detail_variation');
          fill.why.push(why('why.detail_variation', 'R2-LIB-01', { axis: v.axis }));
        } else {
          // (fix round 2 / F3, E-186; RECHECK v0.4 02 / 05 minors 'plain -> pause -> plain', 'the squeeze taken away in block 2'): with nothing
          // new left the slot keeps the detail it had - a block change never takes a detail away
          if (BC2 && BC2.keep_detail_when_stuck && prevFill && prevFill.detail && prevFill.detail.value && !fill.detail) fill.detail = { ...prevFill.detail };
          if (backups.has(day.weekday)) {
            const next = backups.get(day.weekday).find((id) => !processed.has(id) && !change.has(id));
            if (next) change.add(next);
          }
        }
      }
      if (prev && !shadow && prevId && fill.exercise_id && (fill.exercise_id !== prevId || ((fill.detail && fill.detail.value) || '') !== ((prevFill.detail && prevFill.detail.value) || ''))) dayChanged.set(day.weekday, true);
      processed.add(slot.slot_id);
      if (fill.buy) { for (const t of fill.buy) buy.add(t); delete fill.buy; }
      fill.flags = [...new Set(fill.flags)].sort();
      record(st, slot, fill, fill.exercise_id ? model.ex(fill.exercise_id) : null, E, shadow);
      fills[slot.slot_id] = fill;
  };
  // the plan's stations first, day by day - with a previous block, a day's core slots after its lifts (the core backup above) - then
  // the stations the time check dropped (they still get a pick: the volume engine reads every station; E-178)
  // (second pass with a previous block: the day's work lifts first, then the slots chosen for the day's change - so a slot that cannot
  // change can still hand its change to any other lift of the day -, then the other lifts, then core)
  const deferCore = !!(prev && BC2 && BC2.core_backup);
  for (const day of layout.days) {
    const ds = daySlots(day).filter((slot) => needsFill(slot, model) && isLive(slot, E));
    let seq = ds;
    if (deferCore && day.kind === 'main') {
      const lifts = ds.filter((sl) => !coreKind(sl));
      const first = lifts.filter((sl) => sl.role === 'work'), chg = lifts.filter((sl) => sl.role !== 'work' && change.has(sl.slot_id));
      seq = [...first, ...chg, ...lifts.filter((sl) => !first.includes(sl) && !chg.includes(sl)), ...ds.filter(coreKind)];
    }
    // v0.5: the class's skill practice is the day's named piece (the template's own word: DUBS, GYMNASTICS); it is picked before
    // the day's core block - as when it sat in the warm-up - so the core never takes the skill's own exercise and the session
    // never holds two versions of it (B3 near-duplicates)
    const sk = seq.filter((sl) => sl.bucket === 'SKILL');
    if (sk.length) {
      const rest = seq.filter((sl) => sl.bucket !== 'SKILL');
      const at = rest.findIndex(coreKind);
      seq = at < 0 ? [...sk, ...rest] : [...rest.slice(0, at), ...sk, ...rest.slice(at)];
    }
    for (const slot of seq) doSlot(day, slot, false);
  }
  if (E.live) for (const day of layout.days) for (const slot of daySlots(day)) if (needsFill(slot, model) && !isLive(slot, E)) doSlot(day, slot, true);

  // v0.5 (B3 near-duplicates; a circuit day can now carry two stations of one pattern, R4-SES-02): when the passes leave a
  // nearest-pattern stand-in that is a second version of another exercise of its day, the stand-in takes its first listed
  // alternative that is not (the day's other picks are final here, whatever pass made them)
  if (R.selection.near_duplicate) for (const day of layout.days) {
    const live = daySlots(day).filter((sl) => isLive(sl, E) && fills[sl.slot_id] && fills[sl.slot_id].exercise_id && model.hasEx(fills[sl.slot_id].exercise_id));
    for (const sl of live) {
      const f = fills[sl.slot_id];
      if (!(f.flags || []).includes('pattern_gap') || !['resistance', 'isolation', 'focus'].includes(model.bucket(sl.bucket).kind)) continue;
      const others = live.filter((x) => x !== sl).map((x) => model.ex(fills[x.slot_id].exercise_id)).filter((x) => !x.is_athletic);
      const clash = (e) => others.some((x) => x.id === e.id || nearDuplicate(x, e, R));
      if (!clash(model.ex(f.exercise_id))) continue;
      // (v0.5 fix round 1, R4-LIB-01 / LIB-09; sample 05 major: the Kong row - a reference-only record he keeps for people with
      // shoulder or back pain - was the first back station of a healthy client's week. Of the alternatives, a library record goes
      // before a reference-only or program-only one, and a pain-only lift is the last choice for a client without that pain)
      const alts = (f.swaps || []).filter((id) => model.hasEx(id) && !clash(model.ex(id)) && !SWAP_ONLY_STATUS.includes(model.ex(id).status));
      const PO = R.selection.x1 && R.selection.x1.pain_only;
      const painOnly = (id) => !!PO && new RegExp(PO.re).test(id) && !E.pain.some((p) => (PO.areas || []).includes(p.area));
      const swapOnlyS = R.selection.swap_only_statuses || [];
      const pool = alts.filter((id) => !painOnly(id)).length ? alts.filter((id) => !painOnly(id)) : alts;
      const altId = PO ? (pool.find((id) => !swapOnlyS.includes(model.ex(id).status)) || pool[0]) : alts[0];
      if (!altId) continue;
      const was = f.exercise_id, e2 = model.ex(altId);
      f.swaps = [was, ...f.swaps.filter((id) => id !== altId)].slice(0, R.selection.swaps.max);
      f.exercise_id = altId; f.detail = null; f.laterality = e2.laterality; f.loading = null;
      f.flags = (f.flags || []).filter((x) => x !== 'detail_variation');
    }
  }

  // F3 (RECHECK 07 minor: the day's own work lift offered as a swap): once the day is picked, a swap list never names another exercise
  // the same day holds (picks made after the slot included)
  if (E.F3 && E.F3.swaps_not_on_day) for (const day of layout.days) {
    const ids = new Set(daySlots(day).map((sl) => fills[sl.slot_id] && fills[sl.slot_id].exercise_id).filter(Boolean));
    for (const sl of daySlots(day)) {
      const f = fills[sl.slot_id];
      if (!f || !Array.isArray(f.swaps) || !f.swaps.length) continue;
      const off = f.swaps.filter((id) => !ids.has(id));
      if (off.length >= Math.min(R.selection.swaps.min, f.swaps.length)) f.swaps = off;
    }
  }
  if (E.plyoTarget != null) selWhy.push(why('why.plyo_share', 'R2-ATH-01', { pct: Math.round(E.plyoTarget * 100) }));
  if (E.lowerTarget != null) selWhy.push(why('why.laterality_share', 'UNI-02', { pct: Math.round(E.lowerTarget * 100) }));
  // B3: the picks (and detail values) every slot had in the earlier exercise blocks of this training block, so a block change
  // never goes back to an earlier pick (RECHECK 07 / 08 minors 'A-B-A'); internal to the pipeline (not in plan/2)
  const history = { details: {} };
  if (prev && prev.exercise_block && E.tb && prev.exercise_block >= E.tb.first_exercise_block) {
    const ph = prev.history || { details: {} };
    for (const [sid, f] of Object.entries(prev.fills || {})) {
      if (!f || !f.exercise_id) continue;
      history[sid] = [...(ph[sid] || []), f.exercise_id];
      const d = f.detail && f.detail.value;
      history.details[sid] = [...((ph.details || {})[sid] || []), ...(d ? [d] : [])];
    }
  }
  return { exercise_block: E.exerciseBlock, fills, buy_list: [...buy].sort(), why: selWhy, history };
}

function aerobicFill(slot, E) {
  const f = emptyFill(slot, slot.bucket);
  f.why.push(why('why.aerobic_colour', 'R2-SES-06'));
  // (fix round 2 / F3, E-194: the ladder climbs with the plan's exercise blocks - a pre-season block no longer starts over)
  const A2 = E.R.conditioning.aerobic_b3 && E.R.conditioning.aerobic_b3.r2;
  const ex = aerobicPick(slot.aerobic.colour, E.derived, E.model, E.seed, slot.slot_id, A2 && A2.plan_wide_block_index ? Math.max(0, (E.exerciseBlock || 1) - 1) : E.ebIdx);
  if (ex) { f.exercise_id = ex.id; f.laterality = null; }
  if (ex && E.R.conditioning.aerobic_b3) f.why.push(why('why.aerobic_level', 'ATH-07'));
  return f;
}

/**
 * Catalog colour session available in the kit (any erg, EQ-14), or null (text item). v0.4 stage B3 (RECHECK 03 / 04 majors:
 * beginner run-walks for a semi-pro, the same session for 8 weeks): the colour's ladder (rules.conditioning.aerobic_b3) starts by
 * the client's level and climbs one step per exercise block; the session is done on the client's own cardio tools (dose.mjs).
 * @param {string} colour A|B|C|LC @param {object} derived @param {object} model @param {string} [seed] @param {string} [slotId]
 * @param {number} [ebIdx] exercise block index inside the training block (0 = first)
 * @returns {object|null} ExerciseRecord
 */
export function aerobicPick(colour, derived, model, seed, slotId, ebIdx = 0) {
  const kit = derived.D8_kit || { tokens: [], machines: [] };
  const kitObj = { tokens: new Set(kit.tokens || []), machines: kit.machines || [] };
  const A = model.rules.conditioning.aerobic_b3;
  if (A && A.ladder && A.ladder[colour]) {
    // the ladder records are done on any cardio tool (the dose names the client's own), so only the record has to exist
    const ladder = A.ladder[colour].filter((id) => model.hasEx(id));
    if (ladder.length) {
      const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
      // fix round 2 / F3 (E-194; RECHECK v0.4 03 major: entry-level run-walks for a semi-pro midfielder): a competitive athlete of L2+ starts
      // one rung higher (rules.conditioning.aerobic_b3.r2.competitive_bump)
      const CB = A.r2 && A.r2.competitive_bump;
      const prof = derived.D2_profile || {};
      const bump = CB && CB.levels.includes(lvl) && prof.competitive === 'competitive' && (!CB.families || CB.families.includes(derived.D1_family)) ? CB.by : 0;
      const start = ((A.level_start && A.level_start[lvl]) || 0) + bump;
      const i = Math.min(ladder.length - 1, start + (A.climb_per_exercise_block || 0) * Math.max(0, ebIdx || 0));
      return model.ex(ladder[i]);
    }
  }
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
      // (fix round 2 / F3, E-178: a station the time check dropped only keeps its own day free of a second copy)
      if (f && f.exercise_id && model.hasEx(f.exercise_id)) record(st, s, f, model.ex(f.exercise_id), E, !isLive(s, E));
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
  // v0.4 fix round 2 / F3 (E-181; PER-02 'exercises stay'; RECHECK v0.4 06: a DB hip thrust became a body-weight glute bridge at the block
  // change, curls traded places between days): an engine-added exercise keeps its exercise across exercise blocks (generate passes the
  // slot's pick of the previous exercise block as ctx.prev_added) while the week does not hold it elsewhere
  const NSD = E.S2 && E.S2.no_step_down;
  const prevAdded = NSD && NSD.added_keep_across_blocks && typeof ctx.prev_added === 'string' && model.hasEx(ctx.prev_added) ? ctx.prev_added : null;
  // (E-178, second pass: the added exercise stays inside the time and credit profile of the first pass's pick for this slot -
  // ctx.base_added - so the sets the time check proved still hold)
  const ba = E.S2 && ctx.base_added && ctx.base_added.exercise_id && model.hasEx(ctx.base_added.exercise_id) ? ctx.base_added : null;
  const bax = ba ? model.ex(ba.exercise_id) : null;
  const like = bax && !bax.is_athletic ? { bil: bax.laterality === 'bilateral', cc: bax.credit_class } : null;
  const inProfile = (f) => { const fx = f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; return !!fx && (!like || ((fx.laterality === 'bilateral') === like.bil && fx.credit_class === like.cc)); };
  let fill = null;
  if (prevAdded && !st.usedWeek.has(prevAdded) && !E.weekUsed.has(prevAdded)) {
    const kept = pickFor(slot, day, E, st, slot.bucket, { keepPrev: true, prevId: prevAdded, like });
    if (kept.exercise_id === prevAdded && inProfile(kept)) { fill = kept; if (!fill.why.some((w) => w.key === 'why.continuity')) fill.why.push(why('why.continuity', 'PER-02')); }
  }
  if (!fill) {
    // the exercises the previous exercise block's week held and this week no longer does
    let avoidIds = null;
    if (E.S2 && E.prev && E.prev.fills) {
      avoidIds = new Set([...Object.values(E.prev.fills).map((f) => f && f.exercise_id).filter(Boolean), ...((ctx.prev_week_added) || [])]);
      for (const id of st.usedWeek) avoidIds.delete(id);
      for (const id of E.weekUsed) avoidIds.delete(id);
    }
    fill = pickFor(slot, day, E, st, slot.bucket, { like, avoidIds });
    if (like && !inProfile(fill)) {
      const today = st.usedByDay.get(weekdayOfSlot(slot)) || new Set();
      if (!today.has(ba.exercise_id)) fill = { ...ba, detail: ba.detail ? { ...ba.detail } : null, swaps: (ba.swaps || []).slice(), why: (ba.why || []).slice(), flags: (ba.flags || []).slice() };
    }
  }
  if (fill.buy) delete fill.buy;
  fill.flags = [...new Set(fill.flags)].sort();
  return fill;
}

/**
 * v0.5 / V2 (COACH-R4 R4-LIB-01 'they can be optional, and they can be chosen and added, but not primary ones that the program is
 * going to throw at you as part of the template'): the optional add-ons a plan OFFERS this client. Never part of the template;
 * the person adds one with a plan edit (engine/edit.mjs add_exercise). In order (rules.selection.addons.offer.order): the joint
 * care of the profile's own injury codes, the add-ons the library marks for the client's sport or activity, then a carry for
 * general-fitness and athletic goals (LIB-19). Each passes the client's kit, age, pain and exclusion filters.
 * @param {object} ctx {derived, model, shape?, layout?}
 * @returns {Array<{exercise_id:string, kind:'joint_care'|'sport'|'carry', code:string|null, bucket:string}>}
 */
export function offeredAddons(ctx) {
  const E = prep(ctx);
  const { R, model } = E;
  const A = R.selection.addons;
  if (!A || !A.offer) return [];
  const O = A.offer;
  const out = [];
  const seen = new Set();
  const bucketOf = (ex) => ex.slots.find((b) => b !== 'FOCUS') || ex.slots[0] || null;
  const ok = (ex) => {
    if (!ex || ex.status !== A.addon_status || seen.has(ex.id)) return false;
    const b = bucketOf(ex);
    if (!b || (O.skip_units || []).includes(ex.rep_hint && ex.rep_hint.unit)) return false;
    const slot = { slot_id: 'Mon.addon.a01', station_id: null, bucket: b, role: 'addon', block: model.bucket(b).block, variant: null, axial_req: null, circuit: null, focus_muscle: ex.primary_muscle || null };
    return hardFilter(ex, slot, b, E, null).ok;
  };
  const push = (ex, kind, code) => { seen.add(ex.id); out.push({ exercise_id: ex.id, kind, code: code || null, bucket: bucketOf(ex) }); };
  // (an add-on the plan already holds - a HYROX race station - is not offered again: ctx.exclude_ids)
  for (const id of ctx.exclude_ids || []) seen.add(id);
  const injuries = [...new Set((E.sport && E.sport.injuries) || [])];
  const vName = E.derived.D2_profile && E.derived.D2_profile.variant;
  if (E.sport && vName && E.sport.variants && E.sport.variants[vName]) for (const c of E.sport.variants[vName].injuries_add || []) if (!injuries.includes(c)) injuries.push(c);
  const sportMatch = (ex) => (ex.sport_use || []).some((u) => E.sportWords.has(String(u).toLowerCase().replace(/_/g, ' ')));
  for (const kind of O.order || []) {
    if (kind === 'joint_care') {
      for (const code of injuries.slice().sort()) for (const id of (R.prehab.preferred_by_code || {})[code] || []) {
        const ex = model.hasEx(id) ? model.ex(id) : null;
        if (ok(ex)) push(ex, 'joint_care', code);
      }
    } else if (kind === 'sport') {
      // a reactive change-of-direction profile is offered its reaction drill (04 cod.reactive; the drill is an add-on, R4-LIB-01)
      const RD = R.athletic.f2 && R.athletic.f2.cod && R.athletic.f2.cod.reactive_drill_ids;
      if (E.sport && E.sport.cod_reactive) for (const id of RD || []) { const ex = model.hasEx(id) ? model.ex(id) : null; if (ok(ex)) push(ex, 'sport', null); }
      // the client's sport first names the add-on (catalog sport_use); joint-care records without a code of this profile wait
      for (const ex of model.exercises()) if (ex.status === A.addon_status && sportMatch(ex) && ok(ex)) push(ex, 'sport', null);
    } else if (kind === 'carry') {
      if ((O.carry_goals || []).includes(E.goal)) for (const id of O.carry_ids || []) { const ex = model.hasEx(id) ? model.ex(id) : null; if (ok(ex)) push(ex, 'carry', null); }
    }
  }
  return out.slice(0, typeof O.max === 'number' ? O.max : out.length);
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
