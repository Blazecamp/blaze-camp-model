// tools/fixture/v05-library.mjs - engine 0.5.0, work package V2 (library and selection). Applied after v05-structure.mjs by BOTH
// builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source: COACH-R4
// (coach_answers_round4.md), an earlier coach answer, OBSERVED (his sheets), INFERRED or PROPOSED. Binding plan:
// design/ENGINE_V05_PLAN.md ("V2 library and selection"); decisions: engine/DECISIONS.md section G (G-25 ...).
//
// What V2 changes in the model:
//   * OPTIONAL ADD-ONS (R4-LIB-01). The 31 records the library marked 'proposed' are live as OPTIONAL ADD-ONS (status
//     'optional_addon'): a person may choose and add them, a plan lists them as swaps and as offered add-ons, and the template never
//     picks them. The only add-ons a template may pick: wall balls and sled pushes, in the HYROX station circuits (and in the
//     CrossFit-style class WOD - "maybe in the CrossFit program"). Neck work (2 records) stays 'proposed': not shown at all until the
//     coach decides.
//   * CARRIES AND SLED WORK (R4-LIB-02): dosed by distance or time - 2-4 trips of 20-40 m or 20-40 s - never by reps; no muscle-set
//     credit; they sit with core / conditioning (the FUNCTIONAL bucket's block is 'conditioning').
//   * MID-RANGE PULL (R4-LIB-03): its own small category between the horizontal and the vertical pull (pattern MRPULL, tag
//     'mid_range_pull'): high row, 45-degree row, the face-pull angle. INCLINE PRESSING FIRST in the vertical / mid-range push slot
//     for bodybuilding and general-population plans (tag 'mid_range_push'); overhead pressing stays available.
//   * SWAPS SAY WHAT THEY KEEP AND LOSE (R4-LIB-04): rules.selection.swap_notes + the wording table (PROPOSED words).
//   * NO THIRD-PARTY VIDEO LINKS (R4-LIB-05): every record's `video` is a YouTube SEARCH link built from its English name; the plan
//     exposes that exact name for copying.
//   * SPORT PROFILE CONFIDENCE (R4-SCP-03): every sport profile carries `confidence` = confirmed_by_coach | similar_sport |
//     proposed (+ `confidence_basis`); in data and docs, never on a plan.
//   * DATA CLEAN-UPS (HANDOFF.md step 5; reviews/codex-model-review.md Appendix F1): the retired 60+ / non-priority step caps are
//     deleted from the rules; the 60+ flag no longer excludes the landing drills round 3 switched on (R3-ATH-02); the F1 record
//     fixes (farmer carry, suitcase carry, split-step reaction drill, the 2 min fast / 1 min walk run intervals).
//   * SELECTION (coach-eye reviews, not time-related): rules.selection.v2 - the lead chest press, near-duplicates in a session, the
//     week's movement families on the A / B skeleton, the second hinge of a hip day, one cable pulldown a pull day, the upper-body
//     laterality dial on the new station set.

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniqSorted = (a) => [...new Set(a)].sort();

/** the YouTube search every exercise links to (R4-LIB-05); the query is the record's English name */
export const VIDEO_SEARCH_BASE = 'https://www.youtube.com/results?search_query=';
/** statuses (R4-LIB-01) */
export const STATUS_ADDON = 'optional_addon';
export const STATUS_PROPOSED = ['proposed_v1', 'proposed_v1_1'];
/** add-ons a template may pick (R4-LIB-01: "wall balls and sled pushes because that's part of HYROX programming ... maybe CrossFit") */
export const ADDON_PRIMARY_IDS = ['sled-push', 'wall-ball-medball-squat-to-target'];
/** the dose of carries and sled work (R4-LIB-02) */
export const CARRY_DOSE = { trips: [2, 4], metres: [20, 40], seconds: [20, 40] };

const isCarryRecord = (ex) => ['CARRY', 'DRAG'].includes(ex.pattern) || /(^|-)carry(-|$)/.test(ex.id);
const isNeck = (ex) => ex.pattern === 'NECK' || ex.credit_class === 'ISO_NECK';

// ---------------------------------------------------------------------------------------------------------------------------
// catalog
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * v0.5 / V2 exercise amendments (after amendExerciseR2F3).
 * @param {object} ex0 compiled ExerciseRecord @returns {object}
 */
export function amendExerciseV2(ex0) {
  const ex = clone(ex0);
  const refs = new Set(ex.rule_refs || []);
  const tags = new Set(ex.tags || []);

  // ---- R4-LIB-01: proposed -> optional add-on (neck work stays proposed)
  if (STATUS_PROPOSED.includes(ex.status) && !isNeck(ex)) { ex.status = STATUS_ADDON; refs.add('R4-LIB-01'); }

  // ---- R4-LIB-02: carries and sled work - distance or time, no muscle-set credit (Appendix F1: farmer carry, suitcase carry)
  if (isCarryRecord(ex)) {
    const stationary = /hold-stationary/.test(ex.id);
    ex.rep_hint = stationary
      ? { text: '2-4 holds of 20-40 s', unit: 'seconds' }
      : { text: ex.laterality === 'unilateral' ? '2-4 trips of 20-40 m or 20-40 s each side' : '2-4 trips of 20-40 m or 20-40 s', unit: 'distance_or_time' };
    ex.counting = 'distance_or_time';
    ex.credit_class = 'NONE';
    ex.credits = {};
    ex.primary_muscle = null;
    ex.slots = ex.slots.filter((s) => s !== 'FOCUS');
    tags.add('carry_sled');
    refs.add('R4-LIB-02');
  }

  // ---- R4-LIB-03: the mid-range categories
  const press = ['HPUSH', 'VPUSH'].includes(ex.credit_class) && /press/.test(ex.id);
  if (ex.pattern === 'MRPUSH' || (press && /(^|-)(high-)?incline(-|$)/.test(ex.id)) || (press && /landmine|viking/.test(ex.id))) { tags.add('mid_range_push'); refs.add('R4-LIB-03'); }
  if (ex.credit_class === 'FACEPULL') { tags.add('mid_range_pull'); refs.add('R4-LIB-03'); }

  // ---- HANDOFF clean-up 4 (R3-ATH-02): from 60 the landing drills are ON by default (step down and stick, no bounce) - the
  // catalog's 60+ flag excluded them; high-impact and weighted landings and the depth drops the never-list names stay off
  // (a depth drop of unstated height and the single-leg / weighted low drop are not 'step down and stick' for everyone: opt-in only)
  if (ex.athletic && ex.athletic.quality === 'landing' && ex.older_opt_in_ok && !tags.has('high_impact') && (!/depth-drop/.test(ex.id) || ex.id === 'low-depth-drop') && !ex.older_ok) { ex.older_ok = true; refs.delete('R2-ATH-08'); refs.add('R3-ATH-02'); }

  // ---- Appendix F1 record fixes
  if (ex.id === 'split-step-reaction-drill') {
    // bouts of seconds, never 'reps'; it needs usable space - cones are optional markers, not a replacement for space
    ex.rep_hint = { text: '4-8 bouts of 5-10 s', unit: 'seconds' };
    ex.equipment = { any_of: [['open_space_short']], machine: null };
    refs.add('F1');
  }
  if (ex.id === 'run-intervals-2-min-fast-1-min-walk') {
    // work and recovery written separately; a time-based session is never read as calories or distance
    ex.rep_hint = { text: '5-8 rounds of 2 min fast + 1 min walk', unit: 'time' };
    refs.add('F1');
  }

  // ---- R4-LIB-05: no third-party link in the public data (attachVideoSearchV2 writes the search link once the names are final)
  ex.video = null;

  ex.tags = [...tags].sort();
  ex.rule_refs = [...refs].sort();
  return ex;
}

/**
 * The two mid-range pull records the coach's approved proposal names (R4-LIB-03: "high row, 45-degree row, face-pull angle"; the
 * face-pull angle is the library's own face pulls). PROPOSED records: optional add-ons (swaps for the row and the pulldown), never a
 * template pick. Built from two library rows so every field has the catalog's own shape.
 * @param {object[]} exercises compiled records (already amended) @returns {object[]} new records, sorted by id
 */
export function addedExercisesV2(exercises) {
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const out = [];
  const make = (id, protoId, patch) => {
    const p = byId.get(protoId);
    if (!p || byId.has(id)) return;
    const e = clone(p);
    Object.assign(e, {
      id, source_id: id, name_key: `exercise.${id}.name`, cue_key: null, pattern: 'MRPULL', node: 'RP.PL.M',
      slots: ['FOCUS', 'RP_HPULL', 'RP_VPULL'], default_in_slots: [], status: STATUS_ADDON, sport_use: [], video: null,
      variation_axes: ['grip', 'range'], rep_hint: { text: '8-15', unit: 'reps' },
      rule_refs: ['R4-LIB-01', 'R4-LIB-03'], ...patch
    });
    e.tags = uniqSorted([...(e.tags || []).filter((t) => !['chest_supported', 'older_preferred'].includes(t)), 'mid_range_pull', ...(patch.add_tags || [])]);
    delete e.add_tags;
    out.push(e);
  };
  make('high-row-machine', 'machine-row-grip-not-stated', { add_tags: ['chest_supported'] });
  make('45-degree-cable-row', 'seated-cable-row-bilateral', {});
  return out.sort((a, b) => (a.id < b.id ? -1 : 1));
}

/**
 * R4-LIB-05: every exercise carries a YouTube search link built from its English name (the coach's own videos can be added later
 * as kind 'coach'). Mutates the records.
 * @param {object[]} exercises @param {Object<string,string>} en the final English strings
 */
export function attachVideoSearchV2(exercises, en) {
  for (const e of exercises) {
    const name = en[e.name_key];
    if (typeof name !== 'string' || !name) throw new Error('attachVideoSearchV2: no English name for ' + e.id);
    e.video = { url: VIDEO_SEARCH_BASE + encodeURIComponent(name), kind: 'search' };
  }
}

/** the bucket table: carries and sled work sit with conditioning (R4-LIB-02; the FUNCTIONAL bucket was an accessories block) */
export function amendBucketsV2(buckets) {
  const B = clone(buckets);
  if (B.FUNCTIONAL) B.FUNCTIONAL = { ...B.FUNCTIONAL, block: 'conditioning' };
  return B;
}

// ---------------------------------------------------------------------------------------------------------------------------
// profiles
// ---------------------------------------------------------------------------------------------------------------------------

/** sport plans the coach approved by name: R3-ATH-01 (swimming dryland), R3-ATH-03 (HYROX) */
const APPROVED_BY_NAME = [[/^swimming_/, 'R3-ATH-01'], [/^hyrox_/, 'R3-ATH-03']];

/**
 * R4-SCP-03: the confidence label of a sport profile, from the profile's own provenance in synthesis/04_profiles.json.
 *   confirmed_by_coach  the numbers come from his own programs (evidence OBSERVED) or he approved this sport's plan by name
 *   similar_sport       built on another profile (a base profile, a position delta, or a 04 v1 variant reused unchanged)
 *   proposed            inferred from a needs analysis with his general rules applied; no program of this sport in his sheets
 * @param {object} src 04 profile record @returns {{label:string, basis:string}}
 */
export function profileConfidence(src) {
  const ev = String((src && src.evidence) || '');
  const named = APPROVED_BY_NAME.find(([re]) => re.test(src.id));
  if (named) return { label: 'confirmed_by_coach', basis: `plan approved by name (${named[1]})` };
  if (/OBSERVED/.test(ev)) return { label: 'confirmed_by_coach', basis: 'numbers observed in his own programs' };
  if (src.base_profile) return { label: 'similar_sport', basis: `built on the ${src.base_profile} profile` };
  if (['delta', 'unchanged'].includes(src.reuse_status)) return { label: 'similar_sport', basis: 'a variant of a nearby profile, reused' };
  return { label: 'proposed', basis: 'inferred from a needs analysis; his general rules applied' };
}

/**
 * v0.5 / V2 sport amendments (after amendSportR2F2).
 * @param {object} sport compiled profile @param {object} src 04 profile record @returns {object}
 */
export function amendSportV2(sport, src) {
  const s = clone(sport);
  const c = profileConfidence(src);
  s.confidence = c.label;
  s.confidence_basis = c.basis;
  return s;
}

// ---------------------------------------------------------------------------------------------------------------------------
// rules
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * v0.5 / V2 rule amendments (after amendRulesV05).
 * @param {object} rules @returns {object}
 */
export function amendRulesV2(rules) {
  const R = clone(rules);
  const S = R.selection;

  // ---- R4-LIB-01: optional add-ons
  S.addons = {
    addon_status: STATUS_ADDON,
    never_pick_statuses: [STATUS_ADDON, ...STATUS_PROPOSED, 'live_library_not_selectable'],
    not_shown_statuses: STATUS_PROPOSED.slice(),
    not_shown_note: 'neck work stays proposed until the coach decides (R4-LIB-01): never a pick, a swap or an offered add-on',
    primary_exceptions: [
      { ids: ADDON_PRIMARY_IDS.slice(), bucket: 'COND_CIRCUIT', variants: ['hyrox_station', 'hyrox_run_station'], refs: ['R4-LIB-01', 'R3-ATH-03'],
        status: 'approved (R4-LIB-01): wall balls and sled pushes may be primary in the HYROX program' },
      { ids: ADDON_PRIMARY_IDS.slice(), bucket: 'COND_WOD', families: ['hybrid_crossfit'], enabled: true, refs: ['R4-LIB-01'],
        status: 'PROPOSED reading of "maybe in the CrossFit program" (R4-LIB-01): on for the class WOD; set enabled false to keep them out' }
    ],
    // what a plan offers as add-ons (plan.meta.addons): joint care first, then the client's sport, then carries
    offer: {
      max: 6,
      order: ['joint_care', 'sport', 'carry'],
      carry_goals: ['general', 'fat_loss', 'active', 'athletic', 'hybrid'],
      carry_ids: ['farmer-carry'],
      sets: [2, 3],
      skip_units: ['distance', 'time'],
      status: 'PROPOSED (V2, G-28): which add-ons a plan lists and how many; the person adds any library exercise with an edit'
    },
    refs: ['R4-LIB-01', 'CAT-07'],
    status: 'approved (R4-LIB-01): the 31 proposed exercises are optional - "they can be chosen and added, but not primary ones that the program is going to throw at you as part of the template"'
  };
  S.proposed_records_swap_only = true;
  // the athletic records a station may pick although the library lists them as reference: never an add-on (R4-LIB-01)
  if (R.athletic.f2 && Array.isArray(R.athletic.f2.pick_ok_ids)) R.athletic.f2.pick_ok_ids = R.athletic.f2.pick_ok_ids.filter((id) => !['streamline-squat-jump-arms-overhead', 'split-step-reaction-drill'].includes(id));
  // joint care takes the code's own LIVE exercise; an add-on is a swap and an offered add-on (was: proposed records could be the pick)
  delete R.prehab.preferred_status_ok;
  // Achilles / calf care (R3-ATH-02 'calf and Achilles work every leg day' for racket players 50+): its two named exercises are
  // optional add-ons now, so the station takes one of the coach's own calf raises on a leg day that holds no calf exercise - the
  // soleus and tibialis raises lead its swap list and are offered as add-ons
  if (R.prehab.preferred_by_code && Array.isArray(R.prehab.preferred_by_code.ACHILLES_CALF)) {
    R.prehab.preferred_by_code.ACHILLES_CALF = [...new Set([...R.prehab.preferred_by_code.ACHILLES_CALF, 'standing-db-calf-raise-deficit-optional', 'machine-calf-raise', 'standing-calf-raise-bodyweight-from-a-deficit-step'])];
  }
  R.prehab.refs = uniqSorted([...(R.prehab.refs || []), 'R4-LIB-01']);
  R.prehab.v2_status = 'V2 (R4-LIB-01): a joint-care station is placed only when its code has a live exercise; a code whose exercises are all optional add-ons (Achilles / calf, balance) is offered as an add-on instead';
  // HYROX: the station list stays the coach's (R3-ATH-03); only the two primaries (and his own program records) are picked
  R.athletic.hyrox = { ...R.athletic.hyrox, refs: uniqSorted([...(R.athletic.hyrox.refs || []), 'R4-LIB-01']),
    v2_status: 'V2 (R4-LIB-01): a station circuit picks wall balls, sled pushes and the coach\'s own SkiErg / row / burpee stations; the other race stations (sled pull and drag, burpee broad jumps, farmer carry, sandbag lunges) are swaps and offered add-ons' };
  // R3-ATH-02 quick stepping WITHOUT a hop: the split-step is a hop (Appendix F1 'reconcile older-adult notes'); it is an add-on anyway
  const OLD = R.population.older;
  if (Array.isArray(OLD.quick_stepping_no_hop)) OLD.quick_stepping_no_hop = OLD.quick_stepping_no_hop.filter((id) => id !== 'split-step-reaction-drill');

  // ---- R4-LIB-02: carries and sled work
  R.conditioning.carry = {
    patterns: ['CARRY', 'DRAG'], tag: 'carry_sled',
    trips: CARRY_DOSE.trips.slice(), metres: CARRY_DOSE.metres.slice(), seconds: CARRY_DOSE.seconds.slice(),
    per_side_when_one_sided: true,
    counts_as_muscle_sets: false, credit_class: 'NONE',
    sits_with: ['core', 'conditioning'],
    effort_key: 'effort.carry',
    refs: ['R4-LIB-02', 'LIB-19'],
    status: 'approved (R4-LIB-02): by distance or time, not reps - 2-4 trips of 20-40 m (or 20-40 s); no muscle sets; with core / conditioning'
  };

  // ---- R4-LIB-03: mid-range push and pull; incline pressing first
  S.mid_range = {
    push: { tag: 'mid_range_push', pattern: 'MRPUSH', fills: ['RP_HPUSH', 'RP_VPUSH'], refs: ['R4-LIB-03', 'OBSERVED MM RESISTANCE PATTERNS G6'] },
    pull: { tag: 'mid_range_pull', pattern: 'MRPULL', node: 'RP.PL.M', between: ['HPULL', 'VPULL'], fills: ['RP_HPULL', 'RP_VPULL'], credit_class: 'HPULL', template_pick: false,
      examples: ['high-row-machine', '45-degree-cable-row', 'face-pull'], refs: ['R4-LIB-03'],
      status: 'approved category (R4-LIB-03); its two row records are PROPOSED optional add-ons (swaps for the row and the pulldown)' }
  };
  S.incline_first = {
    bucket: 'RP_VPUSH', tag: 'mid_range_push', incline_re: '(^|-)incline(-|$)', weight: 4, weight_other: 2,
    goals: ['muscle', 'general', 'fat_loss', 'active'],
    not_competitive: true,
    overhead_stays: true,
    refs: ['R4-LIB-03', 'R4-SES-05'],
    status: 'approved (R4-LIB-03): bodybuilders and the general population bias incline pressing over overhead pressing in the vertical / mid-range push slot; overhead stays available. PROPOSED: the weight; the non-competitive "stay athletic" adult counts as general population'
  };

  // ---- R4-LIB-04: swaps say what they keep and lose
  S.swap_notes = {
    enabled: true,
    equipment_substitute_flags: ['pattern_gap', 'machine_iso_swap', 'no_medball_sub'],
    instead_of_note: 'note.instead_of',
    refs: ['R4-LIB-04'],
    status: 'approved (R4-LIB-04): one short line - what the swap keeps and what it loses; the wording table (swap.keeps.* / swap.loses.*) is PROPOSED'
  };

  // ---- R4-LIB-05: video search links; R4-SCP-03: profile confidence (data and docs, never on a plan)
  R.render = { ...(R.render || {}),
    video: { kind: 'search', search_url: VIDEO_SEARCH_BASE, third_party_links: false, copy_name: true, name_lang: 'en', refs: ['R4-LIB-05'],
      status: 'approved (R4-LIB-05): no third-party video links; a YouTube search built from the exercise name, and the exact name shown for copying' },
    profile_confidence: { labels: ['confirmed_by_coach', 'similar_sport', 'proposed'], shown_on_plan: false, refs: ['R4-SCP-03'] },
    refs: uniqSorted([...((R.render && R.render.refs) || []), 'R4-LIB-04', 'R4-LIB-05', 'R4-SCP-03']) };

  // ---- HANDOFF clean-up 1: the 60+ and non-priority 3 % step caps were retired by R3-VOL-04 and CX-01; no code reads them
  if (R.volume.older) delete R.volume.older.step_cap;
  if (R.volume.older && /step cap/.test(String(R.volume.older.status || ''))) R.volume.older.status = 'the 3 % step cap is retired (R3-VOL-04, CX-01): older adults climb the same stairway';
  delete R.population.older.step_cap;
  if (R.volume.priority) delete R.volume.priority.nonpriority_step_cap;

  // ---- selection problems the coach-eye reviews named that are not about time (samples/RECHECK_v0.3.md, REVIEW_LOG.md)
  // a floor press or a push-up is never the day's lead chest lift while a bench or machine press passes the kit (was -4: a DB floor
  // press still led the second press day of a full gym)
  if (S.lead_press) S.lead_press = { ...S.lead_press, floor_penalty: -8, v2_status: 'V2 (G-35): floor_penalty -4 -> -8 (PROPOSED weight)' };
  // the week never holds the two DB high-incline presses of the library (the seated and the plain record are one exercise):
  // the second press day of an incline-first client takes the barbell incline press, else an overhead press ("variability")
  if (S.r2 && Array.isArray(S.r2.families) && !S.r2.families.some((f) => f.id === 'high_incline_db_press')) {
    S.r2.families = [...S.r2.families, { id: 'high_incline_db_press', re: '^high-incline-(seated-)?db-press$', week_max: 1 }];
  }
  // a family's week cap must hold on the A / B skeleton, where a slot kind comes twice a week (two vertical presses, two single-leg
  // hinges): the penalty for a second pick of a capped family beats the first pass's pick bonus (-4 left a seesaw press next to an
  // alternating DB press, 1 point ahead of the landmine press)
  if (S.r2 && typeof S.r2.family_over_week === 'number') S.r2.family_over_week = Math.min(S.r2.family_over_week, -7);
  S.v2 = {
    // the day's lead chest press: two-arm also in a body-weight kit that holds a two-arm push-up; a floor press or push-up pays
    // its penalty on top of the one-arm penalty while a bench or machine press passes the kit (selection.lead_press.floor_penalty)
    lead_press: { body_weight_two_arm_first: true, refs: ['ORD-07', 'CAT-13'] },
    // a hip day's second hinge is never another staggered / kickstand hinge: it is the single-leg hip extension the coach names for
    // that slot ('a single-leg hip extension, or a glute bridge', R4-SES-05) - the same hips group, so the weekly sets hold
    second_hinge: { family: 'db_staggered_hinge', alt_credit_class: 'GLUTE_ISO', trained_levels: ['L2', 'L3'], trained_prefer_re: 'single-leg-hip-thrust', trained_prefer: 3, refs: ['R3-SES-01', 'R4-SES-05'] },
    refs: ['R2-SES-05', 'PER-04', 'ORD-07', 'R4-SES-05'],
    status: 'PROPOSED (V2, G-35): selection rules for the A / B skeleton; each fixes a coach-eye review finding'
  };

  return R;
}

// ---------------------------------------------------------------------------------------------------------------------------
// words (EN, ES). Every Spanish line is PROPOSED until the coach approves it.
// ---------------------------------------------------------------------------------------------------------------------------

export const UI_V2 = {
  // R4-LIB-03: the two mid-range pull records
  'exercise.high-row-machine.name': ['High Row (machine)', 'Remo alto en máquina (High Row)'],
  'exercise.45-degree-cable-row.name': ['45-Degree Cable Row (high pulley)', 'Remo en polea a 45 grados (45-Degree Row)'],
  // R4-LIB-02: carries and sled work
  'reps.distance_or_time': ['{m_min}-{m_max} m (or {s_min}-{s_max} s)', '{m_min}-{m_max} m (o {s_min}-{s_max} s)'],
  'reps.distance_or_time_per_side': ['{m_min}-{m_max} m (or {s_min}-{s_max} s) per side', '{m_min}-{m_max} m (o {s_min}-{s_max} s) por lado'],
  'effort.carry': ['walk tall and braced; put it down before your grip or posture breaks', 'camina erguido y firme; suelta antes de perder el agarre o la postura'],
  'note.carry_dose': ['Carries and sled work are written by distance or time, not reps, and do not count as muscle sets.', 'Las caminatas con carga y el trabajo con trineo se escriben por distancia o tiempo, no por repeticiones, y no cuentan como series musculares.'],
  // R4-LIB-04: swaps
  'ui.plan.swap_note': ['{name} (keeps {keeps}; loses {loses})', '{name} (mantiene {keeps}; pierde {loses})'],
  'ui.plan.swap_note_keeps': ['{name} (keeps {keeps})', '{name} (mantiene {keeps})'],
  'note.instead_of': ['{pick} instead of {instead} (your equipment): keeps {keeps}, loses {loses}.', '{pick} en lugar de {instead} (por tu equipo): mantiene {keeps}, pierde {loses}.'],
  'swap.keeps.BKD': ['the two-leg squat', 'la sentadilla a dos piernas'],
  'swap.keeps.UKD': ['the single-leg squat pattern', 'el patrón de sentadilla a una pierna'],
  'swap.keeps.BHD': ['the two-leg hinge', 'la bisagra de cadera a dos piernas'],
  'swap.keeps.UHD': ['the single-leg hinge', 'la bisagra de cadera a una pierna'],
  'swap.keeps.GLUTE_ISO': ['the glute work', 'el trabajo de glúteos'],
  'swap.keeps.LEG_FLEXION': ['the hamstring curl', 'el curl de isquiotibiales'],
  'swap.keeps.LEG_EXTENSION': ['the quad isolation', 'el aislamiento de cuádriceps'],
  'swap.keeps.HPUSH': ['the horizontal press', 'el empuje horizontal'],
  'swap.keeps.VPUSH': ['the vertical press', 'el empuje vertical'],
  'swap.keeps.DIPS': ['the dip pattern', 'el patrón de fondos'],
  'swap.keeps.THRUSTER': ['the squat-to-press', 'la sentadilla con empuje'],
  'swap.keeps.HPULL': ['the horizontal pull', 'el tirón horizontal'],
  'swap.keeps.VPULL': ['the vertical pull', 'el tirón vertical'],
  'swap.keeps.PULLOVER': ['the lat work', 'el trabajo de dorsales'],
  'swap.keeps.ISO_CHEST': ['the chest isolation', 'el aislamiento de pecho'],
  'swap.keeps.ISO_SIDE': ['the side-delt work', 'el trabajo de deltoides lateral'],
  'swap.keeps.ISO_REAR': ['the rear-delt work', 'el trabajo de deltoides posterior'],
  'swap.keeps.FACEPULL': ['the rear-delt work', 'el trabajo de deltoides posterior'],
  'swap.keeps.ISO_FRONT': ['the front-delt work', 'el trabajo de deltoides frontal'],
  'swap.keeps.ISO_BICEPS': ['the biceps work', 'el trabajo de bíceps'],
  'swap.keeps.ISO_TRICEPS': ['the triceps work', 'el trabajo de tríceps'],
  'swap.keeps.ISO_CALF': ['the calf work', 'el trabajo de pantorrillas'],
  'swap.keeps.ISO_NECK': ['the neck work', 'el trabajo de cuello'],
  'swap.keeps.CORE': ['the core work', 'el trabajo de core'],
  'swap.keeps.same_muscle': ['the same main muscle', 'el mismo músculo principal'],
  'swap.keeps.hip_drive': ['the explosive hip drive', 'la extensión explosiva de cadera'],
  'swap.keeps.jump': ['the jump', 'el salto'],
  'swap.keeps.landing': ['the landing practice', 'la práctica de aterrizaje'],
  'swap.keeps.throw': ['the throw', 'el lanzamiento'],
  'swap.keeps.sprint': ['the sprint work', 'el trabajo de velocidad'],
  'swap.keeps.cod': ['the change of direction', 'el cambio de dirección'],
  'swap.keeps.conditioning': ['the conditioning effect', 'el efecto de acondicionamiento'],
  'swap.keeps.carry': ['the loaded carry', 'la caminata con carga'],
  'swap.keeps.joint_care': ['the joint care', 'el cuidado articular'],
  'swap.keeps.same_job': ['the same job in the session', 'la misma función en la sesión'],
  'swap.loses.barbell_catch': ['the barbell catch', 'la recepción con barra'],
  'swap.loses.catch': ['the catch', 'la recepción'],
  'swap.loses.released_ball': ['the released throw', 'el lanzamiento con soltada'],
  'swap.loses.bottom_range': ['the bottom of the range', 'la parte baja del recorrido'],
  'swap.loses.barbell_load': ['the heavier barbell load', 'la carga más pesada de la barra'],
  'swap.loses.free_weight_balance': ['the free-weight balance work', 'el trabajo de equilibrio del peso libre'],
  'swap.loses.machine_support': ['the machine\'s support', 'el apoyo de la máquina'],
  'swap.loses.cable_tension': ['the constant cable tension', 'la tensión constante de la polea'],
  'swap.loses.external_load': ['the load you can add', 'la carga que puedes agregar'],
  'swap.loses.bodyweight_control': ['the body-weight control', 'el control del peso corporal'],
  'swap.loses.implement': ['the feel of the original implement', 'la sensación del implemento original'],
  'swap.loses.two_side_load': ['the heavier two-sided load', 'la carga más pesada a dos lados'],
  'swap.loses.one_side_work': ['the one-side-at-a-time work', 'el trabajo de un lado a la vez'],
  'swap.loses.chest_support': ['the chest support', 'el apoyo del pecho'],
  'swap.loses.trunk_work': ['the trunk work of holding the position', 'el trabajo de tronco de sostener la posición'],
  'swap.loses.heavy_spine_load': ['the heavy spinal loading', 'la carga pesada sobre la columna'],
  'swap.loses.overhead': ['the overhead position', 'la posición sobre la cabeza'],
  'swap.loses.incline_angle': ['the incline angle', 'el ángulo inclinado'],
  'swap.loses.flat_angle': ['the flat pressing angle', 'el ángulo plano del press'],
  'swap.loses.plane': ['the same direction of movement', 'la misma dirección de movimiento'],
  'swap.loses.top_load': ['the top-end load', 'la carga máxima'],
  'swap.loses.rebound': ['the quick rebound', 'el rebote rápido'],
  'swap.loses.hold': ['the held position', 'la posición sostenida'],
  'swap.loses.movement': ['the moving reps', 'las repeticiones con movimiento'],
  'swap.loses.same_pattern': ['the exact movement pattern', 'el patrón exacto de movimiento'],
  'swap.loses.difficulty': ['some difficulty - this one is easier', 'algo de dificultad: este es más fácil'],
  'swap.loses.simplicity': ['the easier set-up - this one is harder', 'la versión más fácil: este es más difícil'],
  'swap.loses.split_grip': ['each hand moving on its own', 'el movimiento libre de cada mano'],
  'swap.loses.same_drill': ['the exact drill - the same quality, trained another way', 'el ejercicio exacto: la misma cualidad, trabajada de otra forma'],
  'swap.loses.little': ['little - same movement, another grip or position', 'poco: mismo movimiento, otro agarre o posición'],
  // R4-LIB-05: videos
  'ui.plan.copy_name': ['Name to copy into YouTube: {name}', 'Nombre para copiar en YouTube: {name}'],
  'video.note': ['"Watch how" opens a YouTube search for the exercise name. The videos you find are not made or checked by Blaze Camp. You can also copy the name shown under each exercise and paste it into YouTube.', '"Ver cómo se hace" abre una búsqueda en YouTube con el nombre del ejercicio. Los videos que encuentres no son de Blaze Camp ni fueron revisados por Blaze Camp. También puedes copiar el nombre que aparece debajo de cada ejercicio y pegarlo en YouTube.'],
  // R4-LIB-01: optional add-ons
  'ui.plan.addons_title': ['Optional add-ons', 'Extras opcionales'],
  'ui.plan.addons_intro': ['Not part of your template. Add any of these if you want; the plan is complete without them.', 'No son parte de tu plantilla. Agrega los que quieras; el plan está completo sin ellos.'],
  'addon.purpose.sport': ['Extra work that fits your sport or activity.', 'Trabajo extra que va con tu deporte o actividad.'],
  'addon.purpose.carry': ['Do it with your core or conditioning work; it does not count as muscle sets.', 'Hazlo con tu trabajo de core o de acondicionamiento; no cuenta como series musculares.'],
  'why.carry_dose': ['Carries and sled work go by distance or time, not reps', 'Las caminatas con carga y el trineo van por distancia o tiempo, no por repeticiones'],
  'why.incline_first': ['Incline press first in this slot; an overhead press stays available as a swap', 'Primero el press inclinado en esta posición; el press sobre la cabeza sigue disponible como cambio'],
  'why.addon_offered': ['Optional add-on: you choose whether to add it', 'Extra opcional: tú decides si lo agregas'],
  'why.second_hinge': ['The day\'s second hip exercise is a different kind of hinge', 'El segundo ejercicio de cadera del día es otro tipo de bisagra'],
};

/** UI_V2 keys that replace an earlier string of the same key */
export const V2_FINAL = ['video.note'];

/** the Spanish lines of this package the coach should review first (additive to es_review.priority_review) */
export const ES_PRIORITY_V2 = ['exercise.high-row-machine.name', 'exercise.45-degree-cable-row.name', 'note.instead_of', 'ui.plan.swap_note', 'ui.plan.addons_intro', 'video.note', 'note.carry_dose'];
