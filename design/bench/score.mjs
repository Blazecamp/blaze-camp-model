// design/bench/score.mjs - the benchmark scorer for engine 0.5 (design/ENGINE_V05_PLAN.md "V3 words and checks"). The definition
// of done sits outside the engine: this file reads a plan/2 JSON and the model data (rules, catalog, templates as plain JSON) and
// nothing else. PURE: no I/O, no clock, no randomness, no import of engine/.
//
//   const ctx   = makeContext({ rules, catalog, templates });            // model/*.json, parsed by the caller
//   const score = scorePlan(plan, ctx, { intake, determinism, params }); // one plan -> metrics, violations, 0-100
//   const all   = aggregate([score, ...]);                               // a corpus -> the acceptance table A1-A14
//
// Scorer 2.0 (2026-10-11). The coach removed time-fitting (COACH-CT CT-01, COACH-R4 R4-SES-01): NO metric here reads minutes.
// Gone with it: the re-cost of a day (DEF-09), days over the chosen minutes, the 100 % / 110 % bands, schedule offers, 'groups out
// for time', the keep order, session-length checks, and the rate limits CX-01 retired (7 % steps, 10 % weekly rise, minimum climb,
// flat-week counts). A plan that still carries a session length, a minute limit, a time check or an offer fails `time_fields`.
//
// What it measures now:
//   * the hard rules that stay (tier 0: safety, session structure, effort, tests, athletic safety; tiers 2-8: floors, the stairway
//     shape, caps, counts, placement, balance and variety), recounted from the items with the scorer's own tallies;
//   * the v0.5 rules (tier 4): the coach's template skeleton (R4-SES-05) and nothing dropped (R4-SES-04), the session's exercise
//     count (R4-SES-02), the final sets reached and arriving at most one week early (CX-01, R4-PRG-01), the floor of 10 from 3
//     training days and the 2-day rule (R4-SES-03), optional add-ons never picked (R4-LIB-01), incline pressing first
//     (R4-LIB-03), carries by distance or time (R4-LIB-02), no third-party video links (R4-LIB-05), the progression rule
//     (R4-PRG-03), the acceleration note (R4-PRG-02), the liability gate (R4-SCP-02).
// No exemption exists that is not a named parameter (PARAMS: the value, and the model path it was read from).
//
// The 0-100 score. 100 minus the points lost. Each scored metric has a maximum it can cost (`pts`); it loses
// pts x sqrt(min(1, violations / opportunities)), so one broken week of 36 already shows (17 % of the points) and a rule
// broken everywhere costs all of them. The square root is the only shape choice; the points are the weights and sit in one
// table (METRICS). `hard_violations` (A1) and the acceptance table are exact counts and do not depend on the weights.

// Scorer 2.2 (2026-10-11, engine 0.5.0 fix round 1 - the coach-eye reviews of the 8 samples). Six readings follow rules the engine
// now applies on purpose (each one a named model rule, read from model/rules.json - no new exemption without a rule behind it):
//   * skeleton order      a rep-max test opens the day's lifts (rules.tests.x1.tested_lift_first, R2-PER-07): the tested lift's
//                         back-off sets are not judged against the order of the template's slots
//   * unsaid_cap          a group the template caps is named by the week-by-week table ('x of y'); the up-front notice is for a
//                         Focus group, a group under its level's start and a big group under 80 % (meta.stairway[].capped[].notice,
//                         rules.placement.x1.capped_notice, CX-04)
//   * MYO last            a calf raise carries the MYO set only when the day holds no other exercise that may, and a two-sided
//                         exercise goes before a one-side one (rules.effort.intensifiers.x1; OBSERVED BYOP ATHLETIC G12)
//   * racket 50-59        joint care may live in the template's own lift (item flag 'joint_care': the calf raise, the leg extension,
//                         the rear-delt slot; rules.prehab.x1.in_template_slot, R4-SES-02)
//   * upper share         the two-arm share is read against the closest share the plan could reach: the A day's first row, the
//                         week's 'Chest / Shoulders' incline press (R4-SES-05) and the day's first chest press
//                         (rules.selection.lead_press) are two-arm lifts whatever the dial asks; the others are the dial's
//   * staircase / exposures  every exercise is read against its own top: an isolation exercise of a training day holds 3 sets (its
//                         4th in the hardest weeks is the group's next step), the day's extra small exercise 2-3, and a press holds
//                         its sets in a week whose pressing would pass its pulling (rules.placement.x1, rules.volume.push_pull;
//                         VOL-16, VOL-18). A later exercise may pass an earlier one that sits at its top; the exposure that lags
//                         is read only while it has room, and a step that evens the two days is no miss. A group that steps on one
//                         muscle's own exercises first (a Focus muscle of a group of several; side delts on a physique plan,
//                         R3-SES-01 / R2-VOL-04) has no single staircase to read.
//   * push : pull          a press and a pull are the classes the model's own balance rule names (rules.volume.push_pull: HPUSH,
//                         VPUSH, MRPUSH, DIPS against HPULL, VPULL), as the engine's V29 reads them. 2.1 read the library's pattern
//                         column: it counted the three flyes (filed under 'horizontal push') and missed the mid-range presses.
//   * group ceiling       a group whose own exercises all sit at their fewest sets has no set to give back: helper credit from
//                         other groups' lifts on a template whose lifts never close (R4-SES-04) is not counted as over the ceiling
// One reading is stricter: the floor of 10 is read on the TRAINING days when the plan says so (rules.volume.floor.counted_on
// 'main_days'): a group that holds it only with the optional day must be said (meta.stairway[].floor_on_optional + its notice).
// Scorer 2.3 (engine 0.5.0 fix round 2, DECISIONS G-76 ...): three readings follow model rules the round added, and one gap of 2.2
// is closed. Each is a named model rule or a catalog fact; none is an exemption without a rule behind it:
//   * youth ladder        the horizontal-push staples of his sheets (flat / incline dumbbell bench, barbell bench, machine bench) are
//                         open to every level (rules.selection.x2.youth_level_exempt_re; CAT-05 'levels are soft')
//   * push / pull          a mid-range press (library pattern MRPUSH: the high-incline dumbbell press) is a push and a mid-range pull
//                         (MRPULL) a pull when a day's partner pattern is read - 2.2 read the pattern column and missed them
//   * bonus alone          the A day's own rear-delt station - the template's 8th exercise, R4-SES-05 - is the day's only shoulder
//                         exercise by the coach's design (item why 'why.template_extra_station', rules.placement.x2.template_extra)
//   * circuit seconds      the work time of a timed circuit moves in the rule's 5-s values and holds between them (rules.supersets
//                         .bootcamp.x2; PRG-03, CX-02): a drop, a skipped step, a hold longer than the pattern or a block that
//                         ends under its top value is counted - 2.2 asked for a rise every week and under 10 %
//   * carries              a carry or sled exercise is never a template pick outside its approved programs (R4-LIB-01 / R4-LIB-02):
//                         a primary pick that carries the `carry_sled` tag counts under addon_picks whatever its status (stricter)
//   * staircase           a compound lift counts at no more than the 3 sets it takes before its group's isolation exercise takes
//                         more (rules.placement.x2.order.compound_min; VOL-16), and a cutting sport's third-day knee slot is free
//                         of the two-leg pin (rules.selection.skeleton_laterality.x2_free; the context reads the sport profiles)
//   * one-arm share       'the closest share the dial could reach' (upper_laterality_error) held three stations as free that the
//                         engine has always kept two-arm or could not turn: the presses of a heavy-powerlifting profile
//                         (rules.selection.powerlifting_presses), the incline-first slot (rules.selection.incline_first) and a
//                         pattern with no one-arm lift in the client's KIT (2.2 counted the whole library). These three change no
//                         plan: with them off, 4 of the 102 plans of this round score lower than under 2.2 (bench 16, 51, 63,
//                         94; -0.19 ... -0.58) - samples/STATUS_v0.5.md, fix round 2, says so.
export const SCORER_VERSION = '2.3.0';
export const SCORE_SCHEMA = 'bench-score/2';

const EPS = 1e-9;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BUCKET_ALIASES = { ISO_HAM: 'ISO_LEG_FLEXION', 'RP.HD.ISO': 'ISO_LEG_FLEXION', CORE_OTHER: 'CORE_ANY' };
const RES_KINDS = ['resistance', 'isolation', 'focus'];
const MAX_LISTED = 60;   // violations kept per metric in the output (the count is always exact)

// ----------------------------------------------------------------------------------------------------------------------
// The metric registry. id = the inventory's metric id where one exists; rule, tier and kind are the inventory's
// (hard | hard_conditional | output | soft | objective). pts = the most the metric can cost on the 0-100 score (0 = counted,
// not scored: it repeats another metric on a different tally). acc = the acceptance row (ACCEPTANCE) it feeds.
// Flags: bench = not in the inventory's metrics_index (an acceptance row or a reviewed failure of the brief);
// report_only = a value that is reported and never judged; subset_of = its hits are also hits of that metric (counted once in A1).
// ----------------------------------------------------------------------------------------------------------------------
const BENCH = { bench: true }, REPORT = { report_only: true };
const m = (id, rule, tier, kind, unit, pts, acc, what, flags = {}) => ({ id, rule, tier, kind, unit, pts, acc, what, bench: !!flags.bench, report_only: !!flags.report_only, subset_of: flags.subset_of || null });
export const METRICS = [
  // ---- T0 system, safety
  m('determinism', 'T0-SYS-01', 0, 'hard', 'bool', 10, 'A14', 'the same intake gives the same plan bytes (set by the runner)'),
  m('lifestyle_inputs', 'T0-SYS-02', 0, 'hard', 'count', 3, null, 'sleep / stress / job / life / check-in keys in the plan'),
  m('sex_inputs', 'T0-SYS-04', 0, 'hard', 'count', 3, null, 'sex / gender keys in the plan'),
  m('unexplained_decisions', 'T0-SYS-03', 0, 'output', 'count', 4, 'A11', 'a group with exercises of its own that the plan does not list as trained (or the reverse); an athletic family under 85 % of its target that is not told'),
  m('refer_or_release_violation', 'T0-SAFE-01', 0, 'hard', 'count', 6, 'A10', 'a plan with weeks while a refer is set or the release stamp is missing'),
  m('band_items', 'T0-SAFE-02', 0, 'hard', 'count', 4, null, 'items or swaps with a band / chain exercise'),
  m('v_squat', 'T0-SAFE-03', 0, 'hard', 'count', 4, null, 'items or swaps with a V-squat'),
  m('failure_on_compound', 'T0-SAFE-04', 0, 'hard', 'count', 4, null, 'compound items planned under 1 RIR or with a MAX / MYO last set (free-weight compounds)'),
  m('older_never', 'T0-SAFE-05', 0, 'hard', 'count', 5, null, '60+: never-tag items, or default-off qualities without the opt-in'),
  m('racket50_defaults', 'T0-SAFE-06', 0, 'hard', 'count', 3, null, 'racket 50-59: leg days without lower joint care, weeks without arm care on a main day, avoided-tag items'),
  m('youth_violation', 'T0-SAFE-07', 0, 'hard', 'count', 5, null, 'under 18: items above the exercise ladder, floor Olympic lifts before the rule allows'),
  m('pain_avoid_items', 'T0-SAFE-08', 0, 'hard', 'count', 5, null, 'items whose exercise carries an avoid tag of a declared pain area'),
  m('medball_violation', 'T0-SAFE-09', 0, 'hard', 'count', 3, null, 'medball over 20 lb, or a medball in an aesthetics main workout'),
  m('kit_violation', 'T0-SAFE-10', 0, 'hard', 'count', 5, null, 'items whose exercise needs equipment outside the kit'),
  m('invented_exercises', 'T0-SAFE-11', 0, 'hard', 'count', 5, null, 'items whose exercise id is not in the catalog'),
  m('slot_type_violation', 'T0-SAFE-12', 0, 'hard', 'count', 3, null, 'KB swing / wall ball / Olympic catch in a resistance, isolation or Focus slot'),
  m('max_test_from_zero', 'T0-SAFE-13', 0, 'hard', 'count', 3, null, '1RM or max-mile test for a from-zero client'),
  m('credit_class_mismatch', 'DEF-02', 0, 'hard', 'count', 3, null, 'items whose credits differ from the credit map (DEF-02, -03, -07)', BENCH),
  m('credit_tally_mismatch', 'DEF-04', 0, 'hard', 'count', 3, null, 'weeks whose printed group / total tallies differ from the recount of the items', BENCH),
  // ---- T0 session structure
  m('missing_warmup', 'T0-SES-01', 0, 'hard', 'count', 3, null, 'main days whose first block is not the warm-up'),
  m('core_opener_missing', 'T0-SES-02', 0, 'hard', 'count', 4, null, 'main days without the 2 x 2 core block in its position'),
  m('block_order', 'T0-SES-03', 0, 'hard', 'count', 4, null, 'days whose block kinds break the block order'),
  m('power_after_strength', 'T0-SES-04', 0, 'hard', 'count', 4, null, 'days with an athletic / Olympic item after a strength item'),
  m('h_before_v', 'T0-SES-05', 0, 'hard', 'count', 4, null, 'days with a non-work vertical pull / push before a horizontal one'),
  m('work_bilateral_myo_order', 'T0-SES-06', 0, 'hard', 'count', 4, null, 'days breaking work-first, bilateral-before-unilateral or MYO-last'),
  m('athletic_order', 'T0-SES-07', 0, 'hard', 'count', 3, null, 'days breaking sprint -> plyo -> ankle -> throws -> COD, or athletic after Olympic'),
  m('pairing_violation', 'T0-SES-08', 0, 'hard', 'count', 5, null, 'mixed days whose lower lift is paired with the wrong upper vector'),
  m('axial_violation', 'T0-SES-09', 0, 'hard', 'count', 5, null, 'weeks with more than one counted squat day or hinge day, or both on one day'),
  m('calf_rule', 'T0-SES-11', 0, 'hard', 'count', 4, null, 'calves trained: main days with two calf exercises, or with a calf exercise under 3 sets'),
  m('rear_delt_week', 'T0-SES-12', 0, 'hard', 'count', 3, null, 'weeks with shoulders trained and no rear-delt station and under 1.5 sets of row credit'),
  m('mid_block_changes', 'T0-SES-14', 0, 'hard', 'count', 4, null, 'exercises that change between weeks of one exercise block'),
  m('set_bounds', 'T0-SES-15', 0, 'hard', 'count', 4, null, 'resistance exercises outside 2 .. 5 sets (2 .. 4 at L1; calves by the calf rule; timed circuits aside)'),
  m('illegal_supersets', 'T0-SES-16', 0, 'hard', 'count', 3, null, 'supersets of two lower compounds or of one muscle twice'),
  m('spacing_violation', 'T0-SES-17', 0, 'hard', 'count', 3, null, 'no OFF day; an optional / aerobic day on a play or game day; the hardest day inside 48 h of a game'),
  // ---- T0 effort, stairway hard limits, tests, athletic safety
  m('rir_violation', 'T0-EFF-01', 0, 'hard', 'count', 3, null, 'weeks with planned RIR outside the band or rising inside a stairway'),
  m('intensifier_violation', 'T0-EFF-02', 0, 'hard', 'count', 3, null, 'intensifiers outside the last stairway week, more than one a day, or on an ineligible item'),
  m('rest_out_of_class', 'T0-EFF-03', 0, 'hard', 'count', 2, null, 'items whose rest is outside every range of its class'),
  m('survival_cut', 'T0-EFF-06', 0, 'hard', 'count', 2, null, 'strength-family days without their survival item'),
  m('deload_inside_block', 'T0-STW-01', 0, 'hard', 'count', 4, null, 'stairway blocks with a gap in their stair weeks'),
  m('steps_in_flat', 'T0-STW-04', 0, 'hard', 'count', 2, null, 'a planned step in a flat block or in week 1'),
  m('test_violation', 'T0-TST-01', 0, 'hard', 'count', 3, null, 'tests outside week 1 / the last week of a stairway, or a rep-max test on a single-leg / single-arm pick'),
  m('olympic_presence', 'T0-ATH-01', 0, 'hard', 'count', 3, null, 'competitive athletic weeks without an Olympic item, or with more than 4 exposures'),
  m('stage_violation', 'T0-ATH-02', 0, 'hard', 'count', 4, null, 'Receive-Create stage changing inside an exercise block, going down, or a quality outside its stage'),
  m('contact_cap', 'T0-ATH-03', 0, 'hard', 'count', 3, null, 'days over the contacts-per-session cap'),
  m('in_season_violation', 'T0-ATH-04', 0, 'hard', 'count', 2, null, 'in-season weeks of game-heavy sports with extra COD or more than one Olympic exposure'),
  m('sport_default_violation', 'T0-ATH-05', 0, 'hard', 'count', 2, null, 'swimmer main days without shoulder care; station circuits credited as muscle sets'),
  // ---- T1 the week keeps its patterns
  m('missing_primary_pattern', 'T1-POL-07', 1, 'hard_conditional', 'count', 6, null, '(week, pattern) with no knee, hip, horizontal push or horizontal pull exercise'),
  m('day_lost_pattern', 'T1-POL-07', 1, 'hard_conditional', 'count', 6, null, 'main days of a cross-pattern week with a lower work lift and no partner (hip: a push, knee: a pull): "no press on the hip + push day"', BENCH),
  // ---- T2 floors
  m('floor_misses', 'T2-FLR-01', 2, 'hard_conditional', 'group-weeks', 14, 'A2', 'plans of 3 or more training days: stairway group-weeks of a trained group under the floor of 10 on all days (a pain-reduced group its start) that the plan does not say'),
  m('calf_floor_misses', 'T2-FLR-02', 2, 'hard_conditional', 'weeks', 4, 'A2', 'stairway weeks with calves trained under 3 sets x the main days that hold a calf exercise'),
  m('athlete_floor_misses', 'T2-FLR-04', 2, 'hard_conditional', 'group-weeks', 0, null, 'floor_misses of competitive field athletes (a subset)', { subset_of: 'floor_misses' }),
  m('below_floor_deficit', 'T2-FLR-05', 2, 'soft', 'sets', 0, null, 'mean weekly shortfall under the floor of the groups the plan says its template cannot hold at the floor (said, R4-SES-04)', REPORT),
  // ---- T3 the stairway
  m('set_drops', 'T3-STW-01', 3, 'hard_conditional', 'count', 6, 'A6', 'an exercise or a trained group with fewer sets than the week before; a planned target that drops'),
  m('last_week_not_hardest', 'T3-STW-04', 3, 'hard_conditional', 'count', 5, 'A6', 'blocks whose last week is not the largest'),
  m('peak_not_last', 'T3-STW-06', 3, 'hard', 'count', 3, null, 'trained groups whose highest week comes before the last week and is above it'),
  m('restart_at_block', 'T3-STW-08', 3, 'hard', 'count', 0, null, 'trained groups whose sets drop at an exercise-block start (a subset of set_drops)', { subset_of: 'set_drops' }),
  m('level_not_rising', 'T3-STW-09', 3, 'hard', 'count', 3, 'A6', 'stairway weeks whose display level does not rise'),
  m('circuit_flat', 'T3-STW-10', 3, 'hard_conditional', 'count', 4, null, 'circuit weeks whose work seconds do not rise (below the top) or rise by more than 10 %'),
  m('athletic_drops', 'T3-ATH-01', 3, 'hard_conditional', 'count', 5, 'A12', '(family, week) whose planned athletic dose drops inside a stairway block'),
  m('athletic_flat', 'T3-ATH-01', 3, 'soft', 'count', 3, null, 'athletic families whose target rises 10 %+ over the block while the planned dose does not rise', BENCH),
  m('share_off', 'T3-ATH-02', 3, 'soft', 'weeks', 1, null, 'weeks whose plyometric share is more than 5 points from the target'),
  // ---- T4 v0.5: template first, no time fitting (design/ENGINE_V05_PLAN.md; the tier of the retired time metrics)
  m('time_fields', 'CT-01', 4, 'hard', 'count', 8, 'A7', 'time fitting left in the plan: a session length, a per-day minute limit, a time check, a schedule offer, a retired time warning', BENCH),
  m('skeleton_mismatch', 'R4-SES-05', 4, 'hard', 'count', 8, 'A3', 'a template A / B day that is not the coach\'s slots; lifts of a skeleton day outside their slot\'s pattern, out of his order or not from the template; a day that does not name its template\'s skeleton', BENCH),
  m('template_lift_missing', 'R4-SES-04', 4, 'hard', 'count', 6, 'A3', '(stairway week, main day) counted template lifts that are absent with no stated reason (an exclusion, pain, play spacing, the 60+ default, no exercise in the kit)', BENCH),
  m('session_size_over', 'R4-SES-02', 4, 'hard', 'count', 6, 'A4', 'gym days with more counted exercises than the client type\'s range allows (warm-up, core, joint care, skill, conditioning, cardio, tests and the ankle prep are outside the count)', BENCH),
  m('session_size_under', 'R4-SES-02', 4, 'soft', 'count', 2, null, 'main days of a stairway week under the range minimum although the template day holds that many counted stations and the day states no reason', BENCH),
  m('exercises_per_group', 'R4-SES-05', 4, 'hard', 'count', 6, 'A4', '(week, full-body main day, group) with more than 4 exercises (calves, the strength family and timed circuits aside)', BENCH),
  m('target_not_reached', 'CX-01', 4, 'hard', 'count', 10, 'A5', 'trained groups whose last-week sets are under the planned final sets', BENCH),
  m('arrival_early', 'R4-PRG-01', 4, 'hard', 'count', 5, 'A5', 'trained groups whose schedule reaches its final sets more than one week before the last week', BENCH),
  m('below_schedule', 'CX-01', 4, 'hard', 'group-weeks', 5, 'A5', 'trained group-weeks under the planned whole-set schedule; schedules that are not whole sets, drop, or do not run from the start to the final sets; weekly targets that are not the schedule', BENCH),
  m('two_day_rule_misses', 'R4-SES-03', 4, 'hard', 'count', 8, 'A2', '2-day plans: big group-weeks under 6 sets, a plan that does not say the rule or does not suggest a third day', BENCH),
  m('unsaid_cap', 'R4-SES-04', 4, 'output', 'count', 5, 'A11', 'groups the template holds under the planned final sets, or under the floor, that the plan does not name', BENCH),
  m('addon_picks', 'R4-LIB-01', 4, 'hard', 'count', 6, 'A9', 'optional add-ons or proposed records placed by the template (wall balls and sled pushes in a HYROX station circuit or the class WOD excepted); a still-proposed record among the swaps or the offered add-ons', BENCH),
  m('incline_share', 'R4-LIB-03', 4, 'soft', 'count', 3, null, 'bodybuilding / general-population training blocks whose vertical / mid-range push slot is mostly overhead although the kit holds an incline press', BENCH),
  m('liability_gate', 'R4-SCP-02', 4, 'hard', 'count', 10, 'A10', 'a plan with weeks whose release stamp does not say the release was accepted, or names the wrong version for its role and age', BENCH),
  m('video_links', 'R4-LIB-05', 4, 'hard', 'count', 5, 'A9', 'items or offered add-ons whose video is not a search link on the model\'s search URL (or the coach\'s own); any third-party video link in the plan', BENCH),
  m('progression_rule_missing', 'R4-PRG-03', 4, 'hard', 'count', 6, 'A8', 'set-and-rep lifts without the progression rule of their own rep range; any item that promises a number for a week', BENCH),
  m('acceleration_unnoted', 'R4-PRG-02', 4, 'output', 'count', 4, 'A8', 'stairway group-weeks that add more than about 15 % (2 or more whole sets) without the acceleration note', BENCH),
  m('easy_to_remove_invalid', 'R4-SES-04', 4, 'hard', 'count', 3, null, 'easy-to-remove entries that name a core exercise, a main lift, the first athletic station, or an item that is not in the day', BENCH),
  m('carry_dose', 'R4-LIB-02', 4, 'hard', 'count', 3, 'A9', 'carries or sled work counted in reps, credited as muscle sets, or (on their own) outside 2-4 trips of 20-40 m / 20-40 s', BENCH),
  // ---- T5 caps and the athletic budget
  m('over_ceiling', 'T5-CAP-01', 5, 'hard', 'line-weeks', 3, null, 'line-weeks above the line\'s (time-held) ceiling on all days: direct sets above it, or credited sets more than 1 above it'),
  m('group_over_ceiling', 'T5-CAP-01', 5, 'soft', 'group-weeks', 2, null, 'decision D7 read per FOCUS group: credited sets of a group more than 1 above the larger ceiling of its lines (hips = glutes + hamstrings)', BENCH),
  m('over_30', 'T5-CAP-03', 5, 'hard', 'group-weeks', 3, null, 'group-weeks above 30 credited sets on all days'),
  m('ceiling_shortfall', 'T5-CAP-04', 5, 'objective', 'sets', 0, null, 'sets between the last week and the level ceiling, summed over trained groups', REPORT),
  m('focus_violation', 'T5-CAP-06', 5, 'hard', 'count', 2, null, 'more than 2 Focus muscles, or a Focus add outside 1-3'),
  m('athletic_over_budget', 'T5-ATH-01', 5, 'hard', 'count', 3, null, '(family, week) planned above 1.25 x target + one set (Olympic 1.5 x)'),
  m('athletic_attainment', 'T5-ATH-02', 5, 'objective', 'count', 6, 'A12', '(family, week) planned under 0.9 x the scaled target'),
  m('athletic_attainment_ratio', 'T5-ATH-02', 5, 'objective', 'ratio', 0, null, 'mean planned / full target over families and weeks (capped at 1)', { bench: true, report_only: true }),
  m('cod_missing', 'T5-ATH-03', 5, 'soft', 'count', 1, null, 'weeks of a COD sport with a COD target and no COD station'),
  // ---- T6 counts
  m('exercise_count', 'T6-CNT-03', 6, 'objective', 'exercises', 0, null, 'mean resistance exercises per main day', REPORT),
  m('bad_added_exercise', 'T6-CNT-04', 6, 'hard', 'count', 3, null, 'added exercises at 1 set, or appearing in the middle of an exercise block'),
  m('focus_slot_violation', 'T6-CNT-05', 6, 'hard', 'count', 2, null, 'optional days with more than 2 Focus slots, or Focus slots outside 2-3 sets'),
  m('prehab_over', 'T6-CNT-08', 6, 'hard', 'count', 1, null, 'days with more than 2 joint-care items'),
  // ---- T7 placement, order, pairing
  m('staircase_deviation', 'T7-PLC-01', 7, 'soft', 'sets', 2, null, 'group-days whose sets are not the coach\'s staircase (a later exercise above an earlier one, or a spread above 1)'),
  m('exposure_imbalance', 'T7-PLC-02', 7, 'soft', 'sets', 2, null, 'sets added on the two exposures of a day type that are not alternated'),
  m('bonus_misplaced', 'T7-PLC-03', 7, 'soft', 'count', 1, null, 'a bonus exercise alone for its group on a main day; a second calf exercise on a leg day'),
  m('focus_not_first', 'T7-ORD-01', 7, 'soft', 'count', 1, null, 'days training a Focus group whose first resistance exercise is not of a Focus group (days with a work lift excepted)'),
  m('olympic_day_pattern', 'T7-ORD-02', 7, 'soft', 'count', 1, null, 'a clean on a hip day or a snatch on a knee day'),
  m('pairing_style', 'T7-PAIR-01', 7, 'soft', 'count', 1, null, 'a plan whose pairing grammar does not match its goal'),
  m('frequency_shortfall', 'T7-WEEK-01', 7, 'soft', 'count', 1, null, 'patterns on fewer than 2 days a week in plans of 4+ main days'),
  // ---- T8 balance and variety
  m('laterality_error', 'T8-BAL-01', 8, 'soft', 'points', 3, 'A13', 'lower-body bilateral share against the target per exercise block (blocks more than 0.12 off)'),
  m('upper_laterality_error', 'T8-BAL-02', 8, 'soft', 'points', 1, null, 'the same for the upper body'),
  m('push_pull_ratio', 'T8-BAL-03', 8, 'soft', 'weeks', 1, null, 'weeks with pull sets under 0.8 x push sets (no pushing Focus)'),
  m('group_balance', 'T8-BAL-04', 8, 'soft', 'ratio', 0, null, 'spread of relative progress (peak - start) / (ceiling - start) over trained groups', REPORT),
  m('repeated_exposure', 'T8-VAR-01', 8, 'soft', 'count', 1, null, 'the two exposures of a slot holding the identical exercise with no detail'),
  m('block_change_violations', 'T8-VAR-02', 8, 'soft', 'count', 1, null, 'a slot that returns to an earlier pick (A-B-A); a work lift that changes between exercise blocks'),
  m('near_duplicates', 'T8-VAR-03', 8, 'soft', 'count', 1, null, 'a session holding the same exercise twice')
];
const METRIC_BY_ID = new Map(METRICS.map(x => [x.id, x]));

/** rules this scorer does not measure on one plan JSON, and why */
export const NOT_MEASURED = {
  style_changes_sets: 'needs the same intake generated with two lift styles',
  olympic_dose: 'the rep scheme by implement and catch is not in the plan JSON in a checkable form',
  rep_phase_violation: 'the rep matrix by rep class and exception is selection / dose logic; not re-implemented',
  calendar_violation: 'needs holiday marks and event lead-ins of the intake against the block calendar',
  next_block_start: 'R4-PRG-04 (the next block starts about 5 % higher) needs two plans of one person; tests/v05-structure holds it on the engine',
  edit_recompute: 'CX-04 (totals recomputed after an edit) needs an edit; tests/v05-structure holds it on engine/edit.mjs',
  release_line_printed: 'R4-SCP-01 / R4-SCP-02 (the release line on every view, EN and ES) is a property of the rendered text; tests/v05-words holds it on engine/render.mjs - the scorer checks the stamp (liability_gate)',
  profile_confidence: 'R4-SCP-03 is model data (model/profiles.json), not a plan field',
  default_order_violations: 'observed default orders are selection preferences; not re-implemented',
  plane_mix_error: 'contra / ipsi and plane shares are not in the plan JSON'
};

/** the acceptance rows of engine 0.5 this scorer feeds, with their pass rule on a corpus (design/ENGINE_V05_PLAN.md "Done means") */
export const ACCEPTANCE = [
  { id: 'A1', name: 'hard_violations', metrics: null, pass: 'sum == 0', what: 'sum of every hard / hard_conditional metric' },
  { id: 'A2', name: 'floors: floor_misses, calf_floor_misses, two_day_rule_misses', metrics: ['floor_misses', 'calf_floor_misses', 'two_day_rule_misses'], pass: 'sum == 0' },
  { id: 'A3', name: 'the coach\'s templates: skeleton_mismatch, template_lift_missing', metrics: ['skeleton_mismatch', 'template_lift_missing'], pass: 'sum == 0' },
  { id: 'A4', name: 'session size: session_size_over, exercises_per_group', metrics: ['session_size_over', 'exercises_per_group'], pass: 'sum == 0' },
  { id: 'A5', name: 'final sets: target_not_reached, arrival_early, below_schedule', metrics: ['target_not_reached', 'arrival_early', 'below_schedule'], pass: 'sum == 0' },
  { id: 'A6', name: 'never down: set_drops, last_week_not_hardest, level_not_rising', metrics: ['set_drops', 'last_week_not_hardest', 'level_not_rising'], pass: 'sum == 0' },
  { id: 'A7', name: 'no time fitting: time_fields', metrics: ['time_fields'], pass: 'sum == 0' },
  { id: 'A8', name: 'progression words: progression_rule_missing, acceleration_unnoted', metrics: ['progression_rule_missing', 'acceleration_unnoted'], pass: 'sum == 0' },
  { id: 'A9', name: 'library: addon_picks, video_links, carry_dose', metrics: ['addon_picks', 'video_links', 'carry_dose'], pass: 'sum == 0' },
  { id: 'A10', name: 'liability gate: liability_gate, refer_or_release_violation', metrics: ['liability_gate', 'refer_or_release_violation'], pass: 'sum == 0' },
  { id: 'A11', name: 'nothing hidden: unsaid_cap, unexplained_decisions', metrics: ['unsaid_cap', 'unexplained_decisions'], pass: 'sum == 0' },
  { id: 'A12', name: 'athletic: athletic_drops, athletic_attainment', metrics: ['athletic_drops', 'athletic_attainment'], pass: 'sum == 0' },
  { id: 'A13', name: 'laterality_error', metrics: ['laterality_error'], pass: 'share of blocks within 0.12 >= 0.95' },
  { id: 'A14', name: 'determinism', metrics: ['determinism'], pass: 'sum == 0' }
];

// ----------------------------------------------------------------------------------------------------------------------
// Context: indexes over the model JSON, and the named parameters
// ----------------------------------------------------------------------------------------------------------------------

const get = (o, path) => String(path).split('.').reduce((x, k) => (x === undefined || x === null ? undefined : x[k]), o);

/**
 * Every number the scorer compares against, with the model path it came from. `overrides` = {name: value} (opts.params or
 * makeContext's second argument) replaces a value; a replaced value is reported as source 'override'. No parameter is about time.
 */
function resolveParams(R, overrides = {}) {
  const P = {};
  const src = {};
  const put = (name, value, source) => { P[name] = value; src[name] = source; };
  const rule = (name, path, def) => { const v = get(R, path); put(name, v === undefined ? def : v, v === undefined ? 'scorer default (rules.' + path + ' absent)' : 'rules.' + path); };

  rule('floor', 'volume.floor.value', 10);
  rule('two_day', 'volume.two_day', { days_max: 2, weekly_sets: [6, 8], big_classes: ['big'], suggest_days: 3 });
  rule('calves_per_leg_day', 'volume.calves.per_leg_day', { L1: 3, L2: 3, L3: 3 });
  rule('outside_cap_blocks', 'session.outside_cap_blocks', ['warmup', 'core', 'skill', 'prehab', 'conditioning', 'aerobic', 'cooldown', 'test']);
  rule('ankle_outside_count', 'athletic.f2.ankle_block.outside_athlete_cap', true);
  rule('exercises_per_group', 'session.exercises_per_group', { full_body_day: [1, 4], split_day: [2, 4], exempt_groups: ['calves', 'core'], exempt_families: ['strength'] });
  put('group_count_exempt_formats', ['circuit'], 'scorer (a timed circuit\'s stations are the format\'s own count)');
  rule('class_families', 'session.class_lift.families', ['hybrid_crossfit']);
  rule('easy_to_remove', 'session.easy_to_remove', { order: [], always_keep: ['core_block', 'work', 'paired_upper', 'first_athletic_station'], automatic: false });
  rule('placement_min_sets', 'placement.min_sets', 2);
  rule('placement_max_sets', 'placement.max_sets_per_exercise', { L1: 4, L2: 5, L3: 5 });
  put('set_bounds_skip_formats', ['circuit'], 'scorer (rounds x stations are the circuit format\'s own dose)');
  rule('optional_focus', 'placement.optional_focus', { slots: 2, sets: [2, 3] });
  rule('bonus_per_optional_day', 'placement.bonus.max_added_per_optional_day', 2);
  rule('progression', 'stairway.progression', { arrival_weeks_early_max: 1, note_above: 0.15, note_min_whole_sets: 2 });
  rule('absolute_cap', 'volume.priority.absolute_cap', 30);
  rule('focus', 'volume.focus', { max: 2, add_range: [1, 3] });
  rule('core_block', 'core_block', { exercises: 2, sets_when_first: 2 });
  rule('block_order', 'ordering.block_order', []);
  rule('athletic_bucket_order', 'ordering.athletic_bucket_order', []);
  // T0-SES-05 / -06 are written with one position per pattern: pos(HPULL) < pos(VPULL), pos(bilateral) < pos(unilateral). 'first' reads
  // them as "the first horizontal before the first vertical" (the reading the coach's own templates satisfy, engine D-30); 'every' reads
  // "every horizontal before every vertical". The count under the other reading is always reported in the metric's detail.
  put('order_reading', 'first', 'T0-SES-05 / -06 (one position per pattern); "every" = the plain-text reading');
  put('bilateral_first_regions', ['lower'], 'BRAIN 6 order table ("bilateral before unilateral (same region)", OBSERVED on lower-body lifts); add "upper" to check the presses and pulls too');
  rule('h_before_v_exempt_role', 'ordering.h_before_v_exempt_when_vertical_is', 'work');
  rule('pairing', 'pairing', {});
  rule('axial', 'axial', { budget: { squat: 1, hinge: 1 }, not_counted_tags: [] });
  rule('rir_band', 'effort.rir_band', [1, 3]);
  rule('effort_by_block_type', 'effort.by_block_type', {});
  rule('intensifiers', 'effort.intensifiers', { last_week_only: true, per_day: 1 });
  rule('never_failure_rep_classes', 'effort.never_failure_rep_classes', []);
  rule('rest', 'rest', {});
  rule('off_days_min', 'session.off_days_min', 1);
  rule('rear_from_rows_min', 'volume.rear_from_rows_min', 1.5);
  rule('athletic_reconcile', 'athletic.reconcile', { tolerance: 0.25, olympic_max_factor: 1.5, per_set_max: {}, warn_below_share: 0.85, climb_families: { jumps: ['plyo_contacts', 'jump_contacts'], ankle: ['low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] } });
  put('athletic_attainment_min', 0.9, 'scorer (planned dose under 0.9 x the scaled target)');
  put('athletic_test_replaced_counts', true, 'R2-PER-07 (a timed test takes the place of the station of its quality)');
  rule('athletic_target_rise_min', 'athletic.r2.flat.target_rise_min', 0.1);
  rule('share_tolerance', 'athletic.f2.share.tolerance', 0.05);
  rule('stage_qualities', 'athletic.stages.stage_qualities', {});
  rule('contacts_session_max', 'athletic.contacts_per_session_max', {});
  rule('olympic', 'olympic', { per_week_max: 4 });
  rule('in_season_game_heavy', 'athletic.in_season_game_heavy', { sports: [] });
  rule('in_season_template', 'plan_types.season.in_season', { template: null, variant: null });
  rule('prehab', 'prehab', { per_day_max: 2 });
  rule('bilateral_share', 'bilateral_share', { tolerance: 0.03, validate_tolerance: 0.12, regions: { lower: [], upper: [] } });
  rule('population', 'population', {});
  rule('levels', 'levels', {});
  rule('pain', 'volume.pain', { areas: {}, worse_with: {} });
  put('pain_area_region', { neck: 'all', shoulder: 'upper', elbow: 'upper', wrist_hand: 'all', upper_back: 'upper', lower_back: 'all', hip_groin: 'lower', knee: 'lower', ankle_foot: 'lower', other: 'none' },
    'scorer (INFERRED): the body region an area\'s avoid tags apply to - a fixed grip matters to a sore shoulder on a press or a pull, not on a calf raise; worse_with tags apply everywhere');
  put('two_line_groups', 'carrier_max', 'scorer: one ceiling per FOCUS group (hips = glutes + hamstrings)');
  put('myo_not_in_superset', false, 'scorer: false = VOL-15 literal (the MYO set is on the day\'s last eligible exercise); true = engine E-158 (an exercise inside a superset is not eligible)');
  rule('medball', 'medball', { max_lb: 20 });
  rule('credit', 'credit', { classes: {}, athletic_slot_buckets: [] });
  // ---- v0.5 rules
  // R4-SES-05 in the coach's words: Day A = horizontal pull, squat, vertical pull, lunge, biceps, leg extension; Day B = horizontal
  // push, hinge / hip thrust, vertical or incline push, unilateral hinge, triceps, leg curl. The compound slots are read on every
  // A / B skeleton (the gym days and the athletic days, 'athletic block, then the same A / B lifts'); the two small slots on the gym days.
  put('ab_compound_slots', { A: ['RP_HPULL', 'RP_BKD', 'RP_VPULL', 'RP_UKD'], B: ['RP_HPUSH', 'RP_BHD', 'RP_VPUSH', 'RP_UHD'] }, 'COACH-R4 R4-SES-05 (slots 1-4 of Day A / Day B)');
  put('ab_small_slots', { A: ['ISO_BICEP', 'ISO_QUAD'], B: ['ISO_TRICEP', 'ISO_LEG_FLEXION'] }, 'COACH-R4 R4-SES-05 (slots 5-6 of Day A / Day B, gym skeletons)');
  put('skeleton_day_of', { gym_A: 'A', athletic_A: 'A', gym_B: 'B', athletic_B: 'B' }, 'engine/DECISIONS G-04 (skeleton ids of the templates)');
  put('skeleton_gym', ['gym_A', 'gym_B'], 'engine/DECISIONS G-04');
  put('skeleton_patterns', { gym_A: ['pull', 'knee'], athletic_A: ['pull', 'knee'], gym_B: ['push', 'hip'], athletic_B: ['push', 'hip'], ppl_push: ['push'], ppl_pull: ['pull'], ppl_legs: ['knee', 'hip'] },
    'COACH-R4 R4-SES-05 (A = pull + knee dominant, B = push + hip dominant; push / pull / legs as in his sheets)');
  put('pattern_of_bucket', { RP_BKD: 'knee', RP_UKD: 'knee', ISO_QUAD: 'knee', RP_BHD: 'hip', RP_UHD: 'hip', ISO_LEG_FLEXION: 'hip', RP_HPULL: 'pull', RP_VPULL: 'pull', RP_HPUSH: 'push', RP_VPUSH: 'push', ISO_CHEST: 'push' },
    'scorer: the movement pattern a template slot names');
  put('lift_blocks', ['strength', 'accessories'], 'scorer: the blocks that hold the template\'s lifts');
  // scorer 2.1 (V4): the skeleton's laterality (R4-SES-05; OBSERVED BYOP 'Bilateral KD' / 'Unilateral KD' ...) and the end-test week
  rule('skeleton_laterality', 'selection.skeleton_laterality', { skeleton_prefixes: [], laterality_of_bucket: {}, unilateral_lateralities: ['unilateral', 'alternating'] });
  rule('skeleton_laterality_exempt_flags', 'validation.v05.skeleton.laterality_exempt_flags', ['pain_swap', 'pattern_gap', 'no_candidate']);
  // scorer 2.2 (engine 0.5.0 fix round 1): the rules the six readings above follow
  rule('tests_x1', 'tests.x1', {});
  rule('placement_x1', 'placement.x1', {});
  rule('prehab_x1', 'prehab.x1', {});
  rule('selection_x1', 'selection.x1', {});
  rule('selection_x2', 'selection.x2', {});
  rule('placement_x2', 'placement.x2', {});
  rule('bootcamp_x2', 'supersets.bootcamp.x2', null);
  rule('lead_press_rule', 'selection.lead_press', null);
  rule('upper_dial_rule', 'selection.r2.upper_dial', null);
  rule('powerlifting_presses_rule', 'selection.powerlifting_presses', null);
  rule('floor_counted_on', 'volume.floor.counted_on', 'all_days');
  rule('push_pull_rule', 'volume.push_pull', null);
  put('athletic_end_test_week_dose_ok', true, 'engine E-165 / E-172 (R2-PER-07): on the tested days of a block\'s end-test week the athletic and Olympic work runs the baseline week\'s dose, so the fall from the week before is the rule, not a drop; false = count it');
  put('absent_ok_whys', ['why.left_out_exclusion', 'why.pain_cut', 'why.play_spacing', 'why.older_default'], 'scorer: the reasons a day states for a station it leaves out (R4-SES-04 "said")');
  rule('addons', 'selection.addons', { addon_status: 'optional_addon', never_pick_statuses: ['optional_addon', 'proposed_v1', 'proposed_v1_1'], not_shown_statuses: ['proposed_v1', 'proposed_v1_1'], primary_exceptions: [] });
  rule('incline_first', 'selection.incline_first', null);
  put('incline_majority', 0.5, 'COACH-R4 R4-LIB-03 ("bias incline pressing"), read as at least half of the slot\'s picks in a training block');
  rule('carry', 'conditioning.carry', { patterns: ['CARRY', 'DRAG'], tag: 'carry_sled', trips: [2, 4], metres: [20, 40], seconds: [20, 40] });
  rule('video_search_url', 'render.video.search_url', 'https://www.youtube.com/results?search_query=');
  put('video_forbidden_re', 'youtu\\.be/|youtube\\.com/(watch|shorts|embed)|vimeo\\.com|instagram\\.com|tiktok\\.com|facebook\\.com', 'COACH-R4 R4-LIB-05 (no third-party video links)');
  put('progression_kinds', ['double_progression', 'load_when_all_sets_done', 'hold'], 'engine/progression/prescription.mjs progressionRule (R4-PRG-03)');
  put('time_warning_codes', ['time_check', 'time_lower_peak', 'long_day', 'test_day_long', 'supersets_needed', 'start_lowered', 'not_trained_directly', 'below_floor_work_lift', 'stairway_time', 'maintenance_time', 'minutes_competitive_only'],
    'COACH-CT CT-01 (the warnings of the retired time check)');
  for (const [k, v] of Object.entries(overrides || {})) { if (!(k in P)) throw new Error('score: unknown parameter ' + k); put(k, v, 'override'); }
  return { P, src };
}

/**
 * @param {{rules:object, catalog:object, templates:object}} model the parsed model/*.json (never read from disk here)
 * @param {object} [paramOverrides] named parameter overrides (see resolveParams)
 */
export function makeContext(model, paramOverrides) {
  if (!model || !model.rules || !model.catalog || !model.templates) throw new Error('score: makeContext needs {rules, catalog, templates}');
  const R = model.rules;
  const exById = new Map(model.catalog.exercises.map(e => [e.id, e]));
  const aliases = model.catalog.id_aliases || {};
  const groups = R.muscles.groups.order.filter(g => g !== 'core');
  const members = R.muscles.groups.members;
  const groupOfMuscle = {};
  for (const g of R.muscles.groups.order) for (const mu of members[g] || []) groupOfMuscle[mu] = g;
  const lines = (R.muscles.lines && R.muscles.lines.order) || [];
  const lineDefs = (R.muscles.lines && R.muscles.lines.defs) || {};
  const groupOfLine = Object.fromEntries(lines.map(l => [l, lineDefs[l].group]));
  const linesOfGroup = {};
  for (const l of lines) (linesOfGroup[groupOfLine[l]] = linesOfGroup[groupOfLine[l]] || []).push(l);
  const { P, src } = resolveParams(R, paramOverrides);
  /** the template day type of a plan day (base or variant template; in-season days from the in-season template), or null */
  const dayTypesOf = (id, variant) => {
    if (!id) return null;
    const [fam, days] = String(id).split('.');
    const f = model.templates.families[fam];
    const t = f && f.days && f.days[String(days)];
    if (!t) return null;
    const v = variant && t.variants && t.variants[variant];
    return v ? { ...t.day_types, ...(v.day_types || {}) } : (t.day_types || {});
  };
  const templateDay = (tpl, dayType) => {
    const a = dayTypesOf(tpl && tpl.id, tpl && tpl.variant);
    if (a && a[dayType]) return a[dayType];
    const IS = P.in_season_template || {};
    const b = dayTypesOf(IS.template, IS.variant);
    return (b && b[dayType]) || null;
  };
  const slotIndex = new Map();
  for (const e of model.catalog.exercises) for (const sl of e.slots || []) { if (!slotIndex.has(sl)) slotIndex.set(sl, []); slotIndex.get(sl).push(e); }
  // scorer 2.2: how many different one-arm / alternating lifts the library holds per upper pattern (one per movement family,
  // rules.selection.r2.families) - the engine's bound on a week's one-arm stations of that pattern (UNI-07)
  const fam2 = ((R.selection.r2 && R.selection.r2.families) || []).map(f => ({ id: f.id, rx: new RegExp(f.re) }));
  const neverPick = new Set([...(R.selection.swap_only_statuses || []), 'program_only', 'reference_only']);
  // (scorer 2.3: the same count on the lifts a client's kit can set up - a barbell home gym holds no one-arm vertical pull, so its
  // pull-up station is no station the dial could have turned; scorer 2.2 read the whole library for every kit)
  const oneArmCapIn = (fits) => {
    const out = {};
    for (const b of (R.bilateral_share.regions.upper || [])) {
      const seen = new Set();
      for (const e of slotIndex.get(b) || []) {
        if (e.laterality === 'bilateral' || neverPick.has(e.status) || e.load_ceiling === 'low' || !fits(e)) continue;
        const f = fam2.find(x => x.rx.test(e.id));
        seen.add(f ? 'f:' + f.id : e.id);
      }
      out[b] = seen.size;
    }
    return out;
  };
  const oneArmCap = oneArmCapIn(() => true);
  // the sport profiles' injury hot spots (optional fourth model part; scorer 2.1 reads them for the MYO-on-calves exclusion)
  const sportList = model.profiles && model.profiles.sports ? (Array.isArray(model.profiles.sports) ? model.profiles.sports : Object.values(model.profiles.sports)) : [];
  const hotById = new Map(sportList.map(sp => [sp.id, Array.isArray(sp.injuries) ? sp.injuries : []]));
  const sportById = new Map(sportList.map(sp => [sp.id, sp]));
  return {
    R, P, param_sources: src, groups, members, groupOfMuscle, lines, lineDefs, groupOfLine, linesOfGroup, templateDay, oneArmCap, oneArmCapIn,
    hotspotsOf: (profileId) => hotById.get(profileId) || [],
    sportOf: (X) => (X && X.profile_id ? sportById.get(X.profile_id) || null : null),
    bySlot: (bucket) => slotIndex.get(bucket) || slotIndex.get(BUCKET_ALIASES[bucket]) || [],
    model_version: model.rules.rules_version || null,
    olympicExercises: model.catalog.exercises.filter(e => (e.slots || []).includes('AP_TRIPLE_EXT') && e.athletic && e.athletic.olympic_family),
    ex: (id) => (id == null ? null : exById.get(id) || exById.get(aliases[id]) || null),
    bucket: (id) => model.templates.buckets[id] || model.templates.buckets[BUCKET_ALIASES[id]] || null
  };
}

// ----------------------------------------------------------------------------------------------------------------------
// Reading a plan: days, exercises (a rep-max test item is the top set of its lift), credits, tallies
// ----------------------------------------------------------------------------------------------------------------------

const baseSlot = (id) => String(id).replace(/\.test$/, '');
const r2 = (x) => Math.round(x * 100) / 100;
const r4 = (x) => Math.round(x * 10000) / 10000;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const noteKeys = (it) => (it.notes || []).map(n => n && n.key);

function groupCredits(ctx, cr) {
  const out = {};
  for (const [mu, v] of Object.entries(cr || {})) { const g = ctx.groupOfMuscle[mu]; if (g && g !== 'core') out[g] = (out[g] || 0) + v; }
  for (const g of Object.keys(out)) out[g] = Math.min(1, out[g]);
  return out;
}

function lineCredits(ctx, cr) {
  const out = {};
  for (const l of ctx.lines) { let v = 0; for (const mu of ctx.lineDefs[l].members || []) v += (cr || {})[mu] || 0; if (v > 0) out[l] = Math.min(1, v); }
  return out;
}

function readPlan(plan, ctx) {
  const meta = plan.meta || {};
  const derived = meta.derived || {};
  const X = {
    meta, derived,
    family: meta.family || null, goal: meta.goal || null, format: meta.format || null,
    level: (meta.level && meta.level.client) || 'L2',
    competitive: (meta.profile && meta.profile.competitive) === 'competitive',
    profile_id: (meta.profile && meta.profile.id) || null,
    sport_id: (meta.profile && meta.profile.sport_id) || null,
    // the sport profile's injury hot spots (model/profiles.json; empty when the caller gave no profiles)
    hotspots: ctx.hotspotsOf((meta.profile && meta.profile.id) || null),
    age: typeof derived.age === 'number' ? derived.age : null,
    prefs: derived.prefs || {},
    pain: derived.pain || [],
    kit: meta.kit || { tokens: [], machines: [] },
    play_days: meta.play_days || [],
    game_days: (meta.season && meta.season.game_days) || [],
    targets: meta.targets || {},
    warnings: meta.warnings || [],
    size: meta.session_size && Array.isArray(meta.session_size.range) ? meta.session_size : null,
    two_day: meta.two_day || null,
    days_per_week: typeof meta.days_per_week === 'number' ? meta.days_per_week : null,
    edited: !!plan.edited,
    weeks: [], blocks: []
  };
  const cls = ctx.P.class_families.includes(X.family);
  const strengthRoles = (ctx.P.exercises_per_group.exempt_families || []).includes(X.family);
  X.athletic_family = X.family === 'athletic';

  for (const w of plan.weeks || []) {
    const W = { raw: w, n: w.n, tb: w.training_block, type: w.block_type, eb: w.exercise_block, stair_week: w.stair_week, stairway: w.block_type === 'stairway', days: [] };
    for (const d of w.days || []) {
      const D = { raw: d, weekday: d.weekday, kind: d.kind, main: d.kind === 'main', optional: d.kind === 'optional' || !!d.optional, gym: d.kind === 'main' || d.kind === 'optional',
        full_body: !!d.full_body, format: d.format || 'straight', items: [], units: [], blocks: (d.blocks || []).filter(b => b && b.on !== false) };
      let pos = 0;
      for (const [bi, b] of D.blocks.entries()) {
        for (const it of b.items || []) {
          const bd = ctx.bucket(it.bucket) || {};
          const ex = ctx.ex(it.exercise_id);
          D.items.push({ raw: it, pos: pos++, block: b.kind, block_index: bi, bucket: it.bucket, bk: bd.kind || null, bdef: bd, role: it.role, origin: it.origin, ex,
            sets: typeof it.sets === 'number' ? it.sets : 0, credits: it.credits || {}, isTest: it.role === 'test' || it.origin === 'test' });
        }
      }
      // exercises: a rep-max test item ("X.test") is the top set of its lift X
      const bySlot = new Map();
      for (const I of D.items) {
        const res = RES_KINDS.includes(I.bk) && I.role !== 'prehab';
        if (!res) continue;
        const key = baseSlot(I.raw.slot_id);
        if (!bySlot.has(key)) bySlot.set(key, []);
        bySlot.get(key).push(I);
      }
      for (const [slot, parts] of bySlot) {
        const lead = parts.find(p => !p.isTest) || parts[0];
        const gcred = groupCredits(ctx, lead.credits);
        const prime = ctx.groups.filter(g => (gcred[g] || 0) >= 1 - EPS);
        if (lead.ex && lead.ex.credit_class === 'DIPS' && lead.credits.triceps && !prime.includes('triceps')) prime.push('triceps');
        D.units.push({ slot, weekday: D.weekday, parts, lead, sets: sum(parts.map(p => p.sets)), gcred, prime, role: lead.role, origin: lead.origin, bucket: lead.bucket, bk: lead.bk, ex: lead.ex,
          exercise_id: lead.raw.exercise_id, laterality: lead.raw.laterality, superset: lead.raw.superset || null, pos: Math.min(...parts.map(p => p.pos)), block: lead.block,
          hasTest: parts.some(p => p.isTest), circuit: lead.block === 'circuit' || lead.role === 'circuit_station' });
      }
      D.units.sort((a, b) => a.pos - b.pos);
      W.days.push(D);
    }
    // tallies (the scorer's own): credited sets per group (main / all), own sets, exercises per group per day, totals
    const T = { Qmain: {}, Qall: {}, OwnMain: {}, OwnAll: {}, K: {}, Tot: 0, TotMain: 0, Lmain: {}, Lall: {}, LdirAll: {}, LdirMain: {} };
    for (const g of ctx.groups) { T.Qmain[g] = 0; T.Qall[g] = 0; T.OwnMain[g] = 0; T.OwnAll[g] = 0; }
    for (const l of ctx.lines) { T.Lmain[l] = 0; T.Lall[l] = 0; T.LdirAll[l] = 0; T.LdirMain[l] = 0; }
    for (const D of W.days) {
      T.K[D.weekday] = {};
      for (const I of D.items) {
        if (!I.sets) continue;
        const gc = groupCredits(ctx, I.credits);
        for (const [g, c] of Object.entries(gc)) { T.Qall[g] += I.sets * c; if (D.main) T.Qmain[g] += I.sets * c; }
        const lc = lineCredits(ctx, I.credits);
        for (const [l, c] of Object.entries(lc)) { T.Lall[l] += I.sets * c; if (D.main) T.Lmain[l] += I.sets * c; if (c >= 1 - EPS) { T.LdirAll[l] += I.sets; if (D.main) T.LdirMain[l] += I.sets; } }
      }
      for (const U of D.units) {
        T.Tot += U.sets; if (D.main) T.TotMain += U.sets;
        for (const g of U.prime) { T.OwnAll[g] += U.sets; if (D.main) T.OwnMain[g] += U.sets; T.K[D.weekday][g] = (T.K[D.weekday][g] || 0) + 1; }
      }
    }
    W.T = T;
    W.legDays = W.days.filter(D => D.main && D.units.some(U => U.prime.includes('quads') || U.prime.includes('hips')));
    X.weeks.push(W);
  }
  // training blocks
  const byTb = new Map();
  for (const W of X.weeks) { if (!byTb.has(W.tb)) byTb.set(W.tb, []); byTb.get(W.tb).push(W); }
  // v0.5: what the plan says about each stairway block (meta.stairway[]): the groups trained with exercises of their own, their
  // whole-set schedule, the groups the template caps or holds under the floor (said), the credit-only groups
  const recs = Array.isArray(meta.stairway) ? meta.stairway.filter(b => b && typeof b === 'object') : [];
  for (const [n, weeks] of byTb) {
    const rec = recs.find(b => b.training_block === n) || {};
    const type = weeks[0].type;
    const mainDays = weeks.flatMap(W => W.days.filter(D => D.main));
    const circuit = mainDays.length > 0 && mainDays.every(D => D.format === 'circuit');
    // (a timed circuit block lists no groups: its stations run the week's rounds, rec.circuit - the groups with stations of their own)
    const listed = Array.isArray(rec.groups) && !rec.circuit;
    const B = { n, type, weeks, N: weeks.length, stairway: type === 'stairway', rec, listed, circuitRec: !!rec.circuit,
      trained: (listed ? rec.groups : ctx.groups.filter(g => weeks.some(W => W.T.OwnAll[g] > 0))).slice(),
      creditOnly: (rec.credit_only_groups || []).slice(), saidBelow: (rec.below_floor || []).slice(),
      capped: (rec.capped || []).filter(x => x && x.group),
      format: circuit ? 'circuit' : cls ? 'class' : strengthRoles ? 'strength_roles' : 'straight' };
    // the year plan's Q1 is a stairway block that holds its sets (rules.plan_types.year.layout[].flat_sets; inventory T0-STW-04)
    const sb = ((plan.shape && plan.shape.training_blocks) || []).find(x => x && x.n === n);
    B.flatSets = !!(sb && sb.factor && sb.factor.flat_sets);
    B.climbsInSets = B.stairway && B.format !== 'circuit' && !B.flatSets;
    B.ebs = new Map();
    for (const W of weeks) { if (!B.ebs.has(W.eb)) B.ebs.set(W.eb, []); B.ebs.get(W.eb).push(W); }
    X.blocks.push(B);
  }
  // the class model's work lifts (rules.session.class_lift): the class's strength piece is the day's named lift
  X.classSlots = new Set();
  if (cls) for (const W of X.weeks) for (const D of W.days) for (const U of D.units) if (U.role === 'work' && U.origin !== 'bonus') X.classSlots.add(U.slot);
  X.focusGroups = [...new Set((X.targets.priority || []).map(l => ctx.groupOfLine[l] || ctx.groupOfMuscle[l]).filter(Boolean))];
  return X;
}

// ----------------------------------------------------------------------------------------------------------------------
// The score sheet
// ----------------------------------------------------------------------------------------------------------------------

function sheet() {
  const rows = new Map(METRICS.map(x => [x.id, { n: 0, count: 0, value: null, sev: null, violations: [], extra: null, measured: false }]));
  const row = (id) => { const r = rows.get(id); if (!r) throw new Error('score: unknown metric ' + id); return r; };
  return {
    rows,
    /** `k` more opportunities were checked for metric id */
    n(id, k = 1) { const r = row(id); r.n += k; r.measured = true; },
    /** one violation */
    hit(id, where, msg, more) { const r = row(id); r.count += 1; r.measured = true; if (r.violations.length < MAX_LISTED) r.violations.push({ ...where, msg, ...(more || {}) }); },
    /** the share of the points a metric loses, when it is not sqrt(hits / opportunities) */
    sev(id, x) { row(id).sev = Math.max(0, Math.min(1, x)); },
    /** a metric whose value is not a count of hits (sets, a ratio); sev in 0..1 is its share of the points */
    set(id, value, sev, extra) { const r = row(id); r.value = value; r.measured = true; if (sev !== undefined && sev !== null) r.sev = Math.max(0, Math.min(1, sev)); if (extra !== undefined) r.extra = extra; },
    extra(id, extra) { row(id).extra = extra; }
  };
}

// ----------------------------------------------------------------------------------------------------------------------
// Checks. Each takes (S, X, ctx, plan) and writes hits. "Stairway weeks" = block_type == 'stairway'.
// ----------------------------------------------------------------------------------------------------------------------

function deepKeys(o, re, path, out, depth = 0) {
  if (!o || typeof o !== 'object' || depth > 12) return;
  if (Array.isArray(o)) { o.forEach((v, i) => deepKeys(v, re, path + '[' + i + ']', out, depth + 1)); return; }
  for (const k of Object.keys(o)) { if (re.test(k)) out.push(path ? path + '.' + k : k); deepKeys(o[k], re, path ? path + '.' + k : k, out, depth + 1); }
}

function checkSystemSafety(S, X, ctx, plan) {
  const P = ctx.P;
  // T0-SYS-02 / -04: no lifestyle, no sex keys anywhere (meta.derived and meta.input_audit.keys are values, the key names count)
  const life = []; deepKeys(plan, /^(sleep|stress|job|hard_job_or_other_sport|life|energy|checkin|check_in)$/i, '', life);
  const sex = []; deepKeys(plan, /^(sex|gender)$/i, '', sex);
  S.n('lifestyle_inputs'); S.n('sex_inputs');
  for (const p of life) S.hit('lifestyle_inputs', {}, 'key ' + p);
  for (const p of sex) S.hit('sex_inputs', {}, 'key ' + p);
  for (const p of (X.meta.input_audit && X.meta.input_audit.forbidden_found) || []) S.hit(/sex|gender/i.test(p) ? 'sex_inputs' : 'lifestyle_inputs', {}, 'intake key ' + p);
  // T0-SAFE-01
  S.n('refer_or_release_violation');
  if (plan.status === 'ok' && ((X.meta.health && X.meta.health.refer) || !plan.release_stamp || (plan.refer && (plan.refer.reasons || []).length))) S.hit('refer_or_release_violation', {}, 'an ok plan with a refer or without a release stamp');

  const bandRe = /(^|[-_ ])(band|bands|banded|chain|chains|weight[-_ ]?releasers?)([-_ ]|$)/i;
  const vsqRe = /(^|[-_ ])v[-_ ]?squat([-_ ]|$)/i;
  const older = X.age !== null && X.age >= ((P.population.older && P.population.older.from_age) || 60);
  const youth = X.age !== null && X.age < ((P.population.youth && P.population.youth.below_age) || 18);
  const optIn = !!X.meta.older_opt_in;
  const O = P.population.older || {};
  const A50 = P.population.active_aging_50 || {};
  const racket50 = X.age !== null && X.age >= (A50.from_age || 50) && X.age <= (A50.to_age || 59) && (A50.racket_profiles || []).includes(X.profile_id);
  const racketOpt = !!X.prefs.racket_50_impact_opt_in;
  const ladder = P.levels.ladder_order || ['foundational', 'intermediate', 'advanced'];
  const youthMax = ladder.indexOf((P.population.youth && P.population.youth.max_ladder) || P.levels.youth_max_ladder || 'intermediate');
  const avoidAll = new Set(), avoidBy = { upper: new Set(), lower: new Set() };
  for (const p of X.pain) {
    const reg = P.pain_area_region[p.area] || 'none';
    for (const t of ((P.pain.areas || {})[p.area] || {}).avoid_tags || []) { if (reg === 'all') avoidAll.add(t); else if (avoidBy[reg]) avoidBy[reg].add(t); }
    for (const w of p.worse_with || []) for (const t of ((P.pain.worse_with || {})[w] || {}).avoid_tags || []) avoidAll.add(t);
  }
  const anyAvoid = avoidAll.size + avoidBy.upper.size + avoidBy.lower.size > 0;
  const regionOfEx = (I) => { const md = I.ex && ctx.R.muscles.defs[I.ex.primary_muscle]; if (md && (md.region === 'upper' || md.region === 'lower')) return md.region; if (I.bdef.region) return I.bdef.region; if (['AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_SPRINT', 'AP_COD', 'PREHAB_LOWER'].includes(I.bucket)) return 'lower'; if (['AP_THROW', 'RECOVERY_ARM_CARE', 'PREHAB_NECK'].includes(I.bucket)) return 'upper'; return 'both'; };
  const kitTokens = new Set(X.kit.tokens || []);
  const kitMachines = new Set(X.kit.machines || []);
  const athleticBuckets = new Set(P.credit.athletic_slot_buckets || []);
  const fromZero = !!(X.meta.tests && X.meta.tests.from_zero);

  for (const W of X.weeks) for (const D of W.days) for (const I of D.items) {
    const it = I.raw; const ex = I.ex; const where = { week: W.n, weekday: D.weekday, slot_id: it.slot_id };
    if (!it.exercise_id) continue;
    S.n('band_items'); S.n('v_squat'); S.n('invented_exercises');
    if (bandRe.test(it.exercise_id) || (it.swaps || []).some(s => bandRe.test(s))) S.hit('band_items', where, it.exercise_id);
    if (vsqRe.test(it.exercise_id) || (it.swaps || []).some(s => vsqRe.test(s)) || (ex && (ex.tags || []).includes('v_squat'))) S.hit('v_squat', where, it.exercise_id);
    if (!ex) {
      // aerobic sessions, tests and warm-up drills are named by text ids of their own tables; everything with sets or credits must be in the library
      if (I.sets > 0 || Object.keys(I.credits).length) S.hit('invented_exercises', where, it.exercise_id);
      continue;
    }
    const tags = ex.tags || [];
    // T0-SAFE-10 kit
    S.n('kit_violation');
    const okSetup = (ex.equipment.any_of || []).some(setup => setup.every(t => kitTokens.has(t)));
    if (kitTokens.size && (!okSetup || (ex.equipment.machine && !kitMachines.has(ex.equipment.machine)))) S.hit('kit_violation', where, it.exercise_id + ' needs ' + JSON.stringify(ex.equipment.any_of) + (ex.equipment.machine ? ' + machine ' + ex.equipment.machine : ''));
    // T0-SAFE-08 pain
    if (anyAvoid) { S.n('pain_avoid_items'); const reg = regionOfEx(I); const bad = tags.filter(t => avoidAll.has(t) || (reg !== 'lower' && avoidBy.upper.has(t)) || (reg !== 'upper' && avoidBy.lower.has(t))); if (bad.length) S.hit('pain_avoid_items', where, it.exercise_id + ' carries ' + bad.join(', ')); }
    // T0-SAFE-05 older
    if (older) {
      S.n('older_never');
      const never = [...(O.never_tags || []), ...(O.never_tags_phase0_even_with_opt_in || [])].filter(t => tags.includes(t));
      const q = it.athletic && it.athletic.quality;
      if (never.length) S.hit('older_never', where, it.exercise_id + ' carries ' + never.join(', '));
      else if (!optIn && ((O.default_excluded_qualities || []).includes(q) || (q === 'ballistic' && I.bucket !== 'AP_THROW' && !(ex.athletic && ex.athletic.olympic_family === 'swing') && (O.default_excluded_qualities || []).includes('ballistic_jump') && ex.pattern === 'PLYO') || tags.includes('loaded_jump'))) S.hit('older_never', where, it.exercise_id + ' (' + q + ') without the opt-in');
    }
    // T0-SAFE-06 racket 50-59 avoided tags
    if (racket50 && !racketOpt) { S.n('racket50_defaults'); const bad = (A50.avoid_tags_unless_opt_in || []).filter(t => tags.includes(t)); if (bad.length) S.hit('racket50_defaults', where, it.exercise_id + ' carries ' + bad.join(', ')); }
    // T0-SAFE-07 youth
    if (youth) {
      S.n('youth_violation');
      if (ladder.indexOf(ex.level) > youthMax && !(P.selection_x2 && P.selection_x2.youth_level_exempt_re && new RegExp(P.selection_x2.youth_level_exempt_re).test(ex.id))) S.hit('youth_violation', where, it.exercise_id + ' is ' + ex.level);
      else if (tags.includes('olympic_from_floor') && (X.age < ((P.population.youth && P.population.youth.olympic_floor_min_age) || 14))) S.hit('youth_violation', where, it.exercise_id + ' from the floor under 14');
    }
    // T0-SAFE-09 medball
    S.n('medball_violation');
    if (it.load && it.load.type === 'medball_lb' && it.load.max > (P.medball.max_lb || 20)) S.hit('medball_violation', where, 'medball ' + it.load.max + ' lb');
    else if (X.goal === 'muscle' && tags.includes('medball') && I.block !== 'warmup') S.hit('medball_violation', where, 'medball in an aesthetics main workout: ' + it.exercise_id);
    // T0-SAFE-12 slot type
    if (RES_KINDS.includes(I.bk)) { S.n('slot_type_violation'); if (tags.includes('kb_swing') || tags.includes('wall_ball') || tags.includes('push_jerk') || (tags.includes('olympic') && !tags.includes('push_press'))) S.hit('slot_type_violation', where, it.exercise_id + ' in ' + I.bucket); }
    // T0-SAFE-04 never to failure on compounds
    const repClass = I.bdef.rep_class;
    if (RES_KINDS.includes(I.bk) && ex.exercise_class === 'compound' && it.effort) {
      S.n('failure_on_compound');
      const e = it.effort;
      const machineLast = tags.includes('machine') || ex.constraint >= 4;   // VOL-15: MYO on the last machine or isolation exercise
      if (e.type === 'rir' && typeof e.min === 'number' && e.min < 1) S.hit('failure_on_compound', where, it.exercise_id + ' at ' + e.min + ' RIR');
      else if ((e.last_set === 'max' || e.last_set === 'myo') && (P.never_failure_rep_classes || []).includes(repClass) && !machineLast) S.hit('failure_on_compound', where, it.exercise_id + ' last set ' + e.last_set);
    }
    // DEF-02 / -03 / -07 credit map
    S.n('credit_class_mismatch');
    const zero = athleticBuckets.has(I.bucket) || ex.is_athletic || I.role === 'prehab' || I.bk === 'prehab' || tags.includes('kb_swing') || tags.includes('wall_ball');
    const want = zero ? {} : ((P.credit.classes || {})[ex.credit_class] || {});
    const have = I.credits;
    const keys = new Set([...Object.keys(want), ...Object.keys(have)]);
    if ([...keys].some(k => Math.abs((want[k] || 0) - (have[k] || 0)) > EPS)) S.hit('credit_class_mismatch', where, it.exercise_id + ' credits ' + JSON.stringify(have) + ', class ' + ex.credit_class + ' gives ' + JSON.stringify(want));
    // T0-SAFE-13 no max test from zero
    if (it.test && fromZero) { S.n('max_test_from_zero'); if (/work_up_to_1|^1rm|1_mile|time_trial/.test(String(it.test.test)) && W.raw.test && W.raw.test.from_zero) S.hit('max_test_from_zero', where, String(it.test.test)); }
  }
}

function checkTallies(S, X, ctx) {
  for (const W of X.weeks) {
    S.n('credit_tally_mismatch');
    const w = W.raw; const bad = [];
    for (const g of ctx.groups) {
      if (w.main_sets_by_group && typeof w.main_sets_by_group[g] === 'number' && Math.abs(w.main_sets_by_group[g] - W.T.Qmain[g]) > 0.011) bad.push('main ' + g + ' ' + w.main_sets_by_group[g] + ' vs ' + r2(W.T.Qmain[g]));
      if (w.weekly_sets_by_group && typeof w.weekly_sets_by_group[g] === 'number' && Math.abs(w.weekly_sets_by_group[g] - W.T.Qall[g]) > 0.011) bad.push('all ' + g + ' ' + w.weekly_sets_by_group[g] + ' vs ' + r2(W.T.Qall[g]));
    }
    if (typeof w.total_resistance_sets === 'number' && Math.abs(w.total_resistance_sets - W.T.Tot) > 0.011) bad.push('total ' + w.total_resistance_sets + ' vs ' + W.T.Tot);
    if (typeof w.total_main_sets === 'number' && Math.abs(w.total_main_sets - W.T.TotMain) > 0.011) bad.push('main total ' + w.total_main_sets + ' vs ' + W.T.TotMain);
    if (bad.length) S.hit('credit_tally_mismatch', { week: W.n }, bad.slice(0, 4).join('; '));
  }
}

const patternOf = (U) => (U.ex && U.ex.pattern) || (U.bucket || '').replace(/^RP_/, '');
const isLowerCompound = (U) => ['BKD', 'UKD', 'BHD', 'UHD'].includes(patternOf(U)) && (!U.ex || U.ex.exercise_class === 'compound');
const dominance = (U) => (['BKD', 'UKD'].includes(patternOf(U)) ? 'knee' : ['BHD', 'UHD'].includes(patternOf(U)) ? 'hip' : null);
/** scorer 2.2: does this group step on one muscle's own exercises first (rules.placement.x1.step_first)? A Focus pick that names one
 *  muscle of a group of several (glutes in the hips, side delts in the shoulders), or the group's named muscle on its families
 *  (side delts on a physique plan). A Focus on a one-muscle group steers nothing inside it. */
const stepsFirst = (g, X, ctx) => {
  const SF = (ctx.P.placement_x1 || {}).step_first;
  if (!SF) return false;
  const members = ctx.members[g] || [];
  const own = [...new Set([...(X.derived.priority_choices || []), ...(X.derived.priority_muscles || [])])].filter(m => members.includes(m));
  if (SF.focus && members.length > 1 && own.length && X.focusGroups.includes(g)) return true;
  const gm = SF.group_muscle && SF.group_muscle[g];
  return !!(gm && (gm.families || []).includes(X.family));
};
/** scorer 2.2: does every exercise that trains the group as a main mover sit at its fewest sets this week (rules.placement: 2; a class
 *  lift its template's own minimum, rules.placement.x1.work_min_from_hint_families)? */
const ownAtFewest = (W, g, X, ctx) => {
  const P = ctx.P, PXs = P.placement_x1 || {};
  const classMin = (U, D) => {
    if (U.role !== 'work' || !(PXs.work_min_from_hint_families || []).includes(X.family)) return 0;
    const dt = ctx.templateDay(X.meta.template, D.raw.day_type);
    const st = dt && (dt.stations || []).find(x => x.id === String(U.lead.raw.station_id || '').replace(/\.test$/, ''));
    const h = st && (st.sets_hint || st.sets);
    return Array.isArray(h) && typeof h[0] === 'number' ? h[0] : 0;
  };
  let any = false;
  for (const D of W.days) for (const U of D.units) {
    if (!U.prime.includes(g)) continue;
    any = true;
    if (U.sets > Math.max(P.placement_min_sets, classMin(U, D)) + EPS) return false;
  }
  return any;
};
/** scorer 2.2: the most sets the engine's placement rules give one exercise (rules.placement: 5, 4 for L1; an isolation exercise of
 *  a training day 3; the day's extra small exercise 2-3) */
const unitTop = (U, D, X, P) => {
  const top = P.placement_max_sets[X.level] || 5;
  const PXs = P.placement_x1 || {};
  if (PXs.main_day_extra && U.origin === 'bonus' && D.main) return Math.min(top, PXs.main_day_extra.sets[1]);
  if (PXs.iso_main_day_max && D.main && U.ex && U.ex.exercise_class === 'isolation' && U.origin !== 'bonus') return Math.min(top, PXs.iso_main_day_max.default);
  return top;
};
/** scorer 2.2: a press takes no set in a week whose pressing sets would pass its pulling sets (rules.volume.push_pull, VOL-18; the
 *  block says when the balance is on: meta.stairway[].push_pull) - such a press sits at its top for that week */
const isPressUnit = (U, P) => !!(P.push_pull_rule && U.ex && (P.push_pull_rule.push_classes || []).includes(U.ex.credit_class));
const pressHeld = (W, B, P) => {
  const PPr = P.push_pull_rule, bal = B && B.rec && B.rec.push_pull;
  if (!PPr || !bal) return false;
  if (W._pressHeld === undefined) {
    let push = 0, pull = 0;
    for (const D of W.days) for (const U of D.units) {
      if (U.circuit) continue;
      const cc = U.ex && U.ex.credit_class;
      if ((PPr.push_classes || []).includes(cc)) push += U.sets; else if ((PPr.pull_classes || []).includes(cc)) pull += U.sets;
    }
    W._pressHeld = push + 1 > pull / (bal.hard || 1) + EPS;
  }
  return W._pressHeld;
};
const direction = (U) => (['HPUSH', 'VPUSH', 'MRPUSH'].includes(patternOf(U)) ? 'push' : ['HPULL', 'VPULL', 'MRPULL'].includes(patternOf(U)) ? 'pull' : null);

function checkSessionStructure(S, X, ctx) {
  const P = ctx.P;
  const order = P.block_order;
  const corePos = X.prefs.core_position || 'start';
  const pairingOff = (P.pairing.not_for_variants || []).includes((X.meta.template || {}).variant);
  const crossPattern = ((X.meta.template || {}).pairing || '') === 'cross_pattern';
  const other = { h_before_v_every: 0, bilateral_after_unilateral_every_lower: 0, bilateral_after_unilateral_every_upper: 0 };
  for (const W of X.weeks) {
    for (const D of W.days) {
      const where = { week: W.n, weekday: D.weekday };
      if (D.main) {
        // T0-SES-01 warm-up first
        S.n('missing_warmup');
        if (!D.blocks.length || D.blocks[0].kind !== 'warmup') S.hit('missing_warmup', where, 'first block is ' + (D.blocks[0] ? D.blocks[0].kind : 'none'));
        // T0-SES-02 the core opener
        S.n('core_opener_missing');
        const coreItems = D.items.filter(I => I.block === 'core');
        const need = P.core_block.exercises || 2, needSets = P.core_block.sets_when_first || 2;
        if (coreItems.length < need || coreItems.some(I => I.sets < needSets)) S.hit('core_opener_missing', where, coreItems.length + ' core item(s), sets ' + coreItems.map(I => I.sets).join('/'));
        else if (corePos === 'start') { const k = D.blocks.findIndex(b => b.kind === 'core'); const before = D.blocks.slice(0, k).map(b => b.kind).filter(x => x !== 'warmup'); if (before.length) S.hit('core_opener_missing', where, 'core block after ' + before.join(', ')); }
      }
      if (D.gym) {
        // T0-SES-03 block order
        S.n('block_order');
        let last = -1, bad = null;
        for (const b of D.blocks) {
          if (b.kind === 'core' && corePos !== 'start') continue;
          if (b.kind === 'aerobic' && (b.items || []).some(it => it.aerobic && it.aerobic.position === 'open_day')) continue;
          const k = order.indexOf(b.kind);
          if (k < 0) continue;
          if (k < last) { bad = b.kind; break; }
          last = k;
        }
        if (bad) S.hit('block_order', where, D.blocks.map(b => b.kind).join(' > '));
        // T0-SES-04 power before strength (circuit days: the format's own order)
        if (D.format !== 'circuit') {
          S.n('power_after_strength');
          let seen = null;
          for (const I of D.items) {
            if (RES_KINDS.includes(I.bk) && I.role !== 'prehab' && (I.block === 'strength' || I.block === 'accessories')) { if (!seen) seen = I; continue; }
            if (seen && (I.bk === 'athletic' || I.bk === 'power') && I.bucket !== 'COMPLEX') { S.hit('power_after_strength', { ...where, slot_id: I.raw.slot_id }, I.bucket + ' after ' + seen.raw.slot_id); break; }
          }
        }
        // T0-SES-07 athletic order, athletic before Olympic
        const ath = D.items.filter(I => I.block === 'athletic' && P.athletic_bucket_order.includes(I.bucket));
        if (ath.length > 1 || D.items.some(I => I.bk === 'power')) {
          S.n('athletic_order');
          let lastK = -1, hitIt = false;
          for (const I of ath) { const k = P.athletic_bucket_order.indexOf(I.bucket); if (k < lastK) { S.hit('athletic_order', { ...where, slot_id: I.raw.slot_id }, ath.map(x => x.bucket).join(' > ')); hitIt = true; break; } lastK = k; }
          if (!hitIt) { const firstPower = D.items.find(I => I.bk === 'power' && I.block === 'power'); const lateAth = firstPower && D.items.find(I => I.block === 'athletic' && I.pos > firstPower.pos); if (lateAth) S.hit('athletic_order', { ...where, slot_id: lateAth.raw.slot_id }, 'athletic item after the Olympic lift'); }
        }
      }
      if (!D.main || D.format === 'circuit') continue;
      const units = D.units;
      // T0-SES-05 horizontal before vertical
      for (const dir of ['pull', 'push']) {
        const H = units.filter(U => patternOf(U) === (dir === 'pull' ? 'HPULL' : 'HPUSH'));
        const Vv = units.filter(U => patternOf(U) === (dir === 'pull' ? 'VPULL' : 'VPUSH') && U.role !== P.h_before_v_exempt_role);
        if (!H.length || !Vv.length) continue;
        S.n('h_before_v');
        const firstV = Math.min(...Vv.map(U => U.pos));
        const badFirst = Math.min(...H.map(U => U.pos)) > firstV, badEvery = H.some(U => U.pos > firstV);
        if (badEvery) other.h_before_v_every++;
        if (P.order_reading === 'first' ? badFirst : badEvery) S.hit('h_before_v', { ...where }, 'vertical ' + dir + ' (' + Vv.find(U => U.pos === firstV).slot + ') before ' + (badFirst ? 'the first' : 'a') + ' horizontal ' + dir);
      }
      // T0-SES-06 the work first; bilateral before unilateral; MYO last
      const works = units.filter(U => U.role === 'work');
      const strengthUnits = units.filter(U => U.block === 'strength' || U.block === 'accessories');
      if (works.length && strengthUnits.length) {
        S.n('work_bilateral_myo_order');
        const focusFirst = X.focusGroups.length && strengthUnits[0].prime.some(g => X.focusGroups.includes(g));   // allowed override: a priority small muscle first
        // v0.5 (COACH-R4 R4-SES-05): the coach's A / B day opens with the upper lift of the first pair - horizontal pull, then the squat;
        // horizontal push, then the hinge - so the work lift is in the day's first pair
        const lifts0 = focusFirst ? strengthUnits.slice(1) : strengthUnits;
        const openingPair = !!lifts0[0] && lifts0[0].role === 'paired_upper' && !!lifts0[1] && lifts0[1].role === 'work';
        if (X.blocks.find(B => B.n === W.tb).format !== 'strength_roles' && strengthUnits[0].role !== 'work' && !focusFirst && !strengthUnits[0].hasTest && !openingPair) S.hit('work_bilateral_myo_order', { ...where, slot_id: strengthUnits[0].slot }, 'the work lift is not first (' + strengthUnits[0].role + ' first)');
        else {
          let bad = null;
          for (const region of ['lower', 'upper']) {
            // (read on the compound slots: a sissy squat or a leg extension in the quad-isolation slot is not the day's bilateral lift)
            const reg = strengthUnits.filter(U => /^RP_/.test(String(U.bucket)) && U.ex && U.ex.exercise_class === 'compound' && (region === 'lower' ? isLowerCompound(U) : direction(U)));
            const uni = reg.filter(U => U.laterality === 'unilateral' || U.laterality === 'alternating'), bi = reg.filter(U => U.laterality === 'bilateral' && !(U.ex.tags || []).includes('machine'));
            if (!uni.length || !bi.length || uni[0].role === 'work') continue;
            const badFirst = uni[0].pos < bi[0].pos, badEvery = bi.some(U => U.pos > uni[0].pos);
            if (badEvery) other['bilateral_after_unilateral_every_' + region]++;
            if (!P.bilateral_first_regions.includes(region)) continue;
            if ((P.order_reading === 'first' ? badFirst : badEvery) && !bad) bad = (badFirst ? bi[0] : bi.find(U => U.pos > uni[0].pos)).slot + ' (bilateral) after ' + uni[0].slot + ' (unilateral)';
          }
          if (bad) S.hit('work_bilateral_myo_order', where, bad);
        }
      }
      const myo = units.filter(U => U.parts.some(p => p.raw.effort && p.raw.effort.last_set === 'myo'));
      if (myo.length) {
        S.n('work_bilateral_myo_order');
        // (scorer 2.1: the engine's own exclusions, rules.effort.intensifiers - never on a barbell or axial-high lift, a Nordic curl,
        // a sissy squat or a Copenhagen, never on calves for a sport with an Achilles / calf hot spot; E-53, E-193. Scorer 2.0 read
        // only the credit classes and counted 46 correct placements as 'MYO not last'.)
        const IN = P.intensifiers;
        const neverCC = IN.never_credit_classes || [], neverTags = IN.never_tags || [], neverId = IN.never_id_re ? new RegExp(IN.never_id_re) : null;
        const calvesHot = (IN.never_calves_hotspots || []).some(c => X.hotspots.includes(c));
        const eligible = (U) => U.ex && (U.ex.exercise_class === 'isolation' || U.ex.constraint >= 4) && !neverCC.includes(U.ex.credit_class) && !(P.myo_not_in_superset && U.superset) &&
          !neverTags.some(t => (U.ex.tags || []).includes(t)) && !(neverId && neverId.test(U.ex.id)) && !(calvesHot && U.ex.credit_class === 'ISO_CALF');
        // (scorer 2.2: a calf raise only when the day holds no other eligible exercise; a two-sided exercise before a one-side one)
        const IX = IN.x1 || null;
        let pool = units.filter(eligible);
        if (IX) {
          const isCalf = (U) => U.bucket === 'ISO_CALF' || (U.ex && U.ex.credit_class === 'ISO_CALF');
          const oneSide = (U) => !!U.ex && ['unilateral', 'alternating'].includes(U.ex.laterality);
          const nonCalf = pool.filter(U => !isCalf(U)); if (nonCalf.length) pool = nonCalf;
          const two = pool.filter(U => !oneSide(U)); if (two.length) pool = two;
        }
        const lastElig = pool.length ? pool[pool.length - 1] : null;
        if (lastElig && myo.some(U => U.pos < lastElig.pos && U !== lastElig)) S.hit('work_bilateral_myo_order', where, 'MYO on ' + myo[0].slot + ', not the last eligible item (' + lastElig.slot + ')', { last_is_in_superset: !!lastElig.superset });
      }
      // T0-SES-08 pairing: a pair holding a lower compound and an upper compound must be hip + push or knee + pull
      const lower = units.filter(isLowerCompound), upper = units.filter(U => direction(U) && U.ex && U.ex.exercise_class === 'compound');
      if (!pairingOff && lower.length && upper.length) {
        const pairId = (U) => U.lead.raw.superset || U.lead.raw.superset_suggested || null;
        const groupsByPair = new Map();
        for (const U of units) { const id = pairId(U); if (id) { if (!groupsByPair.has(id)) groupsByPair.set(id, []); groupsByPair.get(id).push(U); } }
        for (const [id, us] of groupsByPair) {
          const lo = us.find(isLowerCompound), up = us.find(U => direction(U) && U.ex && U.ex.exercise_class === 'compound');
          if (!lo || !up) continue;
          S.n('pairing_violation');
          const want = dominance(lo) === 'hip' ? 'push' : 'pull';
          if (direction(up) !== want) S.hit('pairing_violation', { ...where, slot_id: lo.slot }, 'pair ' + id + ': ' + dominance(lo) + '-dominant ' + lo.slot + ' with a ' + direction(up) + ' (' + up.slot + ')');
        }
        // the day keeps its pattern: a lower work lift needs one exercise of its partner class on the day (R-PARTNER)
        if (crossPattern) for (const wk of works.filter(isLowerCompound)) {
          S.n('day_lost_pattern');
          const want = dominance(wk) === 'hip' ? 'push' : 'pull';
          if (!units.some(U => direction(U) === want)) S.hit('day_lost_pattern', { ...where, slot_id: wk.slot }, dominance(wk) + '-dominant work lift with no ' + want + ' on the day');
        }
      } else if (!pairingOff && crossPattern && lower.length && !upper.length && D.full_body) {
        for (const wk of works.filter(isLowerCompound)) { S.n('day_lost_pattern'); S.hit('day_lost_pattern', { ...where, slot_id: wk.slot }, dominance(wk) + '-dominant work lift with no upper lift on the day'); }
      }
      // T0-SES-16 supersets that are on
      const on = new Map();
      for (const U of units) if (U.superset) { if (!on.has(U.superset)) on.set(U.superset, []); on.get(U.superset).push(U); }
      for (const [id, us] of on) {
        if (us.length < 2) continue;
        S.n('illegal_supersets');
        const primes = us.flatMap(U => Object.entries(U.lead.credits).filter(([mu, c]) => c >= 1 - EPS && mu !== 'abs_obliques').map(([mu]) => mu));
        if (us.filter(isLowerCompound).length >= 2) S.hit('illegal_supersets', where, 'pair ' + id + ': two lower compounds');
        else if (new Set(primes).size < primes.length) S.hit('illegal_supersets', where, 'pair ' + id + ': one muscle twice (' + primes.join(', ') + ')');
      }
      // T8-VAR-03 the same exercise twice in a session
      S.n('near_duplicates');
      const ids = units.map(U => U.exercise_id).filter(Boolean);
      if (new Set(ids).size < ids.length) S.hit('near_duplicates', where, ids.filter((x, i) => ids.indexOf(x) !== i).join(', '));
      // T6-CNT-08 joint care
      S.n('prehab_over');
      const nPre = D.items.filter(I => I.role === 'prehab' || I.bk === 'prehab').length;
      if (nPre > (P.prehab.per_day_max || 2)) S.hit('prehab_over', where, nPre + ' joint-care items');
    }
    // T0-SES-09 two spine days
    S.n('axial_violation');
    const notCounted = P.axial.not_counted_tags || [];
    const counted = (U, pat) => U.ex && U.ex.axial && U.ex.axial_pattern === pat && !(U.ex.tags || []).some(t => notCounted.includes(t));
    const sq = W.days.filter(D => D.units.some(U => counted(U, 'squat'))).map(D => D.weekday);
    const hg = W.days.filter(D => D.units.some(U => counted(U, 'hinge'))).map(D => D.weekday);
    const extra = (P.axial.powerlifter_light_extra && P.axial.powerlifter_light_extra.enabled && (P.axial.powerlifter_light_extra.profiles || []).includes(X.profile_id)) ? 1 : 0;
    if (sq.length > (P.axial.budget.squat || 1) + extra) S.hit('axial_violation', { week: W.n }, 'counted squats on ' + sq.join(', '));
    else if (hg.length > (P.axial.budget.hinge || 1) + extra) S.hit('axial_violation', { week: W.n }, 'counted hinges on ' + hg.join(', '));
    else if (sq.some(d => hg.includes(d))) S.hit('axial_violation', { week: W.n }, 'counted squat and hinge both on ' + sq.filter(d => hg.includes(d)).join(', '));
    // T0-SES-17 spacing
    S.n('spacing_violation');
    const busy = new Set(W.days.map(D => D.weekday));
    for (const d of [...X.play_days, ...X.game_days]) if (WEEKDAYS.includes(d)) busy.add(d);
    if (7 - busy.size < P.off_days_min) S.hit('spacing_violation', { week: W.n }, 'no OFF day');
    const noGym = new Set([...X.play_days, ...X.game_days].filter(d => WEEKDAYS.includes(d)));
    const clash = W.days.filter(D => (D.kind === 'optional' || D.kind === 'aerobic') && noGym.has(D.weekday));
    if (clash.length) S.hit('spacing_violation', { week: W.n }, clash.map(D => D.kind + ' day on ' + D.weekday).join(', '));
    else if (W.type === 'in_season' && X.game_days.some(d => WEEKDAYS.includes(d))) {
      const mains = W.days.filter(D => D.main);
      const hardest = mains.reduce((a, D) => (!a || sum(D.units.map(U => U.sets)) > sum(a.units.map(U => U.sets)) ? D : a), null);
      if (hardest) for (const g of X.game_days) { const gi = WEEKDAYS.indexOf(g), hi = WEEKDAYS.indexOf(hardest.weekday); if (gi < 0) continue; const gap = (gi - hi + 7) % 7; if (gap < 2) S.hit('spacing_violation', { week: W.n, weekday: hardest.weekday }, 'the hardest gym day is ' + gap + ' day(s) before the game on ' + g); }
    }
  }
  S.extra('h_before_v', { reading: P.order_reading, days_under_every_reading: other.h_before_v_every });
  S.extra('work_bilateral_myo_order', { reading: P.order_reading, regions: P.bilateral_first_regions, days_bilateral_after_unilateral_every_reading: { lower: other.bilateral_after_unilateral_every_lower, upper: other.bilateral_after_unilateral_every_upper } });
}

/** the floor of a trained group on a plan of 3 or more training days: 10 on all days; a pain-reduced group its start */
function floorOf(g, X, ctx) {
  let F = ctx.P.floor;
  const painLines = new Set(X.targets.pain_muscles || []);
  const lines = ctx.linesOfGroup[g] || [];
  if (lines.some(l => painLines.has(l) || (ctx.lineDefs[l].members || []).some(mu => painLines.has(mu)))) {
    const starts = lines.map(l => (X.targets.start || {})[l]).filter(v => typeof v === 'number');
    if (starts.length) F = Math.min(F, Math.max(...starts));
  }
  return F;
}
/** a big muscle group (rules.volume.two_day.big_classes on its lines) */
const isBigGroup = (g, ctx) => (ctx.linesOfGroup[g] || []).some(l => (ctx.P.two_day.big_classes || ['big']).includes((ctx.lineDefs[l] || {}).class));
/** does a notice of the plan name this group? (warning codes capped_by_template, below_floor_template, credit_only_groups) */
const saysGroup = (X, code, g) => X.warnings.some(w => w && w.code === code && w.args && [].concat(w.args.group || []).map(x => String(x).replace(/^group\./, '')).includes(g));

/**
 * Floors, the 2-day rule and what the plan says about its groups (v0.5: COACH-R4 R4-SES-03 / R4-SES-04 / R4-SES-05, R2-VOL-06,
 * R3-SES-01). Counted on ALL days with group credit (a set counts at most 1.0 to a group; the bonus exercise on the optional day
 * counts). A group the template cannot hold at the floor and that the plan SAYS so (meta.stairway[].below_floor + its notice) is
 * reported (below_floor_deficit), not counted as a miss - nothing is hidden, the person adds an exercise or a day.
 */
function checkFloorsAndGroups(S, X, ctx) {
  const P = ctx.P;
  const epg = P.exercises_per_group;
  const facts = { blocks: [], two_day: false, said_below: { deficit: 0, weeks: 0 } };
  const days = X.days_per_week;
  const twoDay = typeof days === 'number' ? days <= P.two_day.days_max : !!X.two_day;
  facts.two_day = twoDay;
  const per = (P.calves_per_leg_day || {})[X.level] || 3;
  if (X.blocks.some(B => B.stairway)) {
    // R4-SES-03 'the plan says so and suggests a 3rd day'; the rule belongs to plans of 2 training days only
    S.n('two_day_rule_misses');
    if (twoDay && !X.two_day) S.hit('two_day_rule_misses', {}, 'a ' + days + '-day plan that does not carry the 2-day rule (meta.two_day)', { kind: 'not_said' });
    else if (twoDay && !X.warnings.some(w => w && w.code === 'two_day_rule')) S.hit('two_day_rule_misses', {}, 'a 2-day plan with no notice that says the 2-day rule', { kind: 'not_said' });
    else if (twoDay && !(X.two_day.suggest_days > days)) S.hit('two_day_rule_misses', {}, 'a 2-day plan that does not suggest a third day', { kind: 'no_third_day' });
    else if (!twoDay && X.two_day) S.hit('two_day_rule_misses', {}, 'the 2-day rule on a plan of ' + days + ' training days', { kind: 'wrong_plan' });
  }
  for (const B of X.blocks) {
    if (!B.stairway) continue;
    const trained = new Set(B.trained), said = new Set(B.saidBelow), creditOnly = new Set(B.creditOnly);
    const where0 = { block: B.n };
    // nothing hidden: the plan's list of trained groups is the groups that hold exercises of their own
    for (const g of ctx.groups) {
      const own = B.weeks.some(W => W.T.OwnAll[g] > 0);
      const credited = B.weeks.some(W => W.T.Qall[g] > 0);
      S.n('unexplained_decisions');
      if (!B.listed) { if (own && !B.circuitRec) S.hit('unexplained_decisions', { ...where0, group: g }, 'the plan lists no trained groups for this block (meta.stairway[].groups)'); continue; }
      if (own && !trained.has(g) && !creditOnly.has(g)) S.hit('unexplained_decisions', { ...where0, group: g }, g + ' has exercises of its own and is listed neither as trained nor as credit only');
      else if (!own && trained.has(g)) S.hit('unexplained_decisions', { ...where0, group: g }, g + ' is listed as trained with no exercise of its own');
      else if (!own && credited && !trained.has(g) && !creditOnly.has(g)) S.hit('unexplained_decisions', { ...where0, group: g }, g + ' gets its sets from other lifts only and the plan does not list it as credit only');
    }
    // R4-SES-04: a group the template holds under its planned final sets, or under the floor, is named
    for (const g of B.trained) {
      const top = (B.rec.group_top || {})[g], planned = (B.rec.planned_top || {})[g];
      const cap = B.capped.find(x => x.group === g);
      S.n('unsaid_cap');
      if (typeof top === 'number' && typeof planned === 'number' && planned > top + EPS && !cap && !said.has(g)) S.hit('unsaid_cap', { ...where0, group: g }, g + ' ends at ' + top + ' of the planned ' + planned + ' and is not listed as capped');
      else if (cap && cap.notice === false && P.placement_x1.capped_notice) { /* named by the week-by-week table (CX-04) */ }
      else if (cap && !saysGroup(X, 'capped_by_template', g) && !saysGroup(X, 'below_floor_template', g)) S.hit('unsaid_cap', { ...where0, group: g }, g + ' is capped (' + cap.held + ' of ' + cap.planned + ') and no notice names it');
      else if (said.has(g) && !saysGroup(X, 'below_floor_template', g)) S.hit('unsaid_cap', { ...where0, group: g }, g + ' is held under the floor and no notice names it');
    }
    const bf = { n: B.n, N: B.N, format: B.format, trained: B.trained.slice(), credit_only: B.creditOnly.slice(), said_below_floor: B.saidBelow.slice(), capped: B.capped.map(x => x.group), groups: {} };
    for (const W of B.weeks) {
      const calfDays = W.days.filter(D => D.main && D.units.some(U => U.prime.includes('calves')));
      for (const g of B.trained) {
        const q = W.T.Qall[g];
        if (g === 'calves') {
          // VOL-17: one calf exercise x 3 sets on a leg day that holds one (the optional-day Calves slots carry the rest)
          const F = per * calfDays.length;
          S.n('calf_floor_misses');
          if (F > 0 && q < F - EPS && !said.has(g)) S.hit('calf_floor_misses', { week: W.n, group: g }, 'calves ' + r2(q) + ' < ' + F + ' (' + per + ' x ' + calfDays.length + ' main days with a calf exercise)', { value: r2(q), limit: F });
          continue;
        }
        if (twoDay) {
          // R4-SES-03: every big group at about 6-8 weekly sets (6 or more), no floor of 10
          if (!isBigGroup(g, ctx)) continue;
          const F = Math.min(P.two_day.weekly_sets[0], floorOf(g, X, ctx));
          S.n('two_day_rule_misses');
          if (q < F - EPS && !said.has(g)) S.hit('two_day_rule_misses', { week: W.n, group: g }, g + ' ' + r2(q) + ' < ' + F + ' on a 2-day plan', { value: r2(q), limit: F, kind: 'under' });
          continue;
        }
        const F = floorOf(g, X, ctx);
        S.n('floor_misses');
        // scorer 2.2 (stricter): where the plan reads the floor on its training days, a group that holds it only with the optional
        // day must be said (meta.stairway[].floor_on_optional + warning.floor_needs_optional_day)
        // (the groups the plan floors: meta.targets.floor_groups - a group held back for pain is floored at its own start, on all days)
        const onMain = P.floor_counted_on === 'main_days' && B.rec.floor_counted_on === 'main_days' && (X.targets.floor_groups || []).includes(g);
        if (onMain && q >= F - EPS && W.T.Qmain[g] < F - EPS && !said.has(g) && !(B.rec.floor_on_optional || []).includes(g) && !saysGroup(X, 'floor_needs_optional_day', g)) { S.hit('floor_misses', { week: W.n, group: g }, g + ' ' + r2(W.T.Qmain[g]) + ' < ' + F + ' on the training days and the plan does not say the optional day carries it', { value: r2(W.T.Qmain[g]), limit: F }); continue; }
        if (q >= F - EPS) continue;
        if (said.has(g)) { facts.said_below.deficit += F - q; facts.said_below.weeks++; continue; }
        S.hit('floor_misses', { week: W.n, group: g }, g + ' ' + r2(q) + ' < ' + F, { value: r2(q), limit: F });
        if (X.competitive && X.athletic_family) S.hit('athlete_floor_misses', { week: W.n, group: g }, g + ' ' + r2(q) + ' < ' + F);
      }
      for (const D of W.days) {
        if (!D.main) continue;
        // R4-SES-05: a full-body day gives a group the 1-4 exercises of the coach's template
        const exemptDay = P.group_count_exempt_formats.includes(D.format) || B.format === 'strength_roles';
        for (const g of ctx.groups) {
          const k = W.T.K[D.weekday][g] || 0;
          if (!k || (epg.exempt_groups || []).includes(g)) continue;
          S.n('exercises_per_group');
          if (exemptDay || !D.full_body || X.edited) continue;
          const hi = (epg.full_body_day || [1, 4])[1];
          if (k > hi) S.hit('exercises_per_group', { week: W.n, weekday: D.weekday, group: g }, g + ' has ' + k + ' exercises (max ' + hi + ')', { value: k, limit: hi });
        }
        // T0-SES-11 calves: one calf exercise on a day, 3 sets or more on a main day
        if (trained.has('calves')) {
          const calfUnits = D.units.filter(U => U.prime.includes('calves'));
          if (calfUnits.length) {
            S.n('calf_rule');
            if (calfUnits.length > 1) S.hit('calf_rule', { week: W.n, weekday: D.weekday }, calfUnits.length + ' calf exercises on one day');
            else if (calfUnits[0].sets < per && !X.edited) S.hit('calf_rule', { week: W.n, weekday: D.weekday, slot_id: calfUnits[0].slot }, 'calf exercise at ' + calfUnits[0].sets + ' sets');
          }
        }
      }
      // T0-SES-12 a rear-delt exercise every week while the shoulders are trained
      if (trained.has('shoulders')) {
        S.n('rear_delt_week');
        let rearStation = false, rowCredit = 0;
        for (const D of W.days) for (const U of D.units) { const c = U.lead.credits.rear_delts || 0; if (c >= 1 - EPS) rearStation = true; else rowCredit += c * U.sets; }
        // (a 2-day plan runs every big group at 6-8 weekly sets, R4-SES-03: its rows cannot carry the 3+ day number - any row credit counts)
        const need = twoDay ? EPS : P.rear_from_rows_min;
        if (!rearStation && rowCredit < need - EPS) S.hit('rear_delt_week', { week: W.n }, 'no rear-delt station, ' + r2(rowCredit) + ' sets of row credit');
      }
      // T1-POL-07 every primary pattern stays in the week (main + optional days); not asked for a group the plan says has no
      // exercise of its own (credit only: its kit or its template holds none)
      const have = { knee: false, hip: false, hpush: false, hpull: false };
      for (const D of W.days) for (const U of D.units) { const p = patternOf(U); if (p === 'BKD' || p === 'UKD') have.knee = true; if (p === 'BHD' || p === 'UHD') have.hip = true; if (p === 'HPUSH') have.hpush = true; if (p === 'HPULL') have.hpull = true; }
      const groupOfPattern = { knee: 'quads', hip: 'hips', hpush: 'chest', hpull: 'back' };
      for (const [k, v] of Object.entries(have)) {
        if (!trained.has(groupOfPattern[k]) && creditOnly.has(groupOfPattern[k])) continue;
        S.n('missing_primary_pattern');
        if (!v) S.hit('missing_primary_pattern', { week: W.n, group: groupOfPattern[k] }, 'no ' + k + ' exercise in the week', { pattern: k });
      }
    }
    for (const g of B.trained) bf.groups[g] = { all: B.weeks.map(W => r2(W.T.Qall[g])), main: B.weeks.map(W => r2(W.T.Qmain[g])), own: B.weeks.map(W => W.T.OwnAll[g]) };
    bf.total = B.weeks.map(W => W.T.Tot); bf.total_main = B.weeks.map(W => W.T.TotMain);
    facts.blocks.push(bf);
  }
  return facts;
}

function groupCeiling(g, B, X, ctx) {
  const st = (X.meta.stairway || []).find(s => s.training_block === B.n) || {};
  const caps = (ctx.linesOfGroup[g] || []).map(l => (st.cap || {})[l] ?? (X.targets.cap || {})[l]).filter(v => typeof v === 'number');
  const level = (ctx.linesOfGroup[g] || []).map(l => (X.targets.level_cap || X.targets.cap || {})[l]).filter(v => typeof v === 'number');
  const starts = (ctx.linesOfGroup[g] || []).map(l => (st.start || {})[l] ?? (X.targets.start || {})[l]).filter(v => typeof v === 'number');
  return { cap: caps.length ? Math.max(...caps) : null, level_cap: level.length ? Math.max(...level) : null, start: starts.length ? Math.max(...starts) : null };
}

/**
 * The stairway (v0.5: COACH-CX CX-01 .. CX-03, COACH-R4 R4-PRG-01 / R4-PRG-02). No rate limit is judged: faster steps are allowed
 * (CX-01) and the same sets may hold while reps or load progress (CX-02 / CX-03). What stays: nothing goes down inside a block, the
 * last week is the hardest, every trained group REACHES its planned final sets on a whole-set schedule that arrives in the last
 * week (one week early at most), and a week that adds more than about 15 % carries its note.
 */
function checkStairway(S, X, ctx) {
  const P = ctx.P; const PG = P.progression || {};
  const facts = [];
  for (const B of X.blocks) {
    const N = B.N; const where0 = { block: B.n };
    if (!B.stairway) {
      // T0-STW-04 flat blocks have no steps; T0-TST-01 no tests outside a stairway
      for (const W of B.weeks) {
        S.n('steps_in_flat');
        const st = Object.entries(W.raw.step_by_muscle || {}).filter(([, v]) => typeof v === 'number' && Math.abs(v) > EPS);
        if (st.length) S.hit('steps_in_flat', { week: W.n }, 'steps in a ' + B.type + ' block: ' + st.map(([k]) => k).join(', '));
        S.n('test_violation');
        if (W.raw.test || W.days.some(D => D.items.some(I => I.raw.test))) S.hit('test_violation', { week: W.n }, 'a test in a ' + B.type + ' block');
        S.n('rir_violation');
        const band = (P.effort_by_block_type || {})[B.type]; const rr = W.raw.planned_rir;
        if (band && rr && (rr.min < band.min - EPS || rr.max > band.max + EPS)) S.hit('rir_violation', { week: W.n }, 'planned RIR ' + rr.min + '-' + rr.max + ' in a ' + B.type + ' block (' + band.min + '-' + band.max + ')');
      }
      continue;
    }
    // T0-STW-01 the block is complete: stair weeks 1..N (no deload inside a block)
    S.n('deload_inside_block');
    if (B.weeks.some((W, i) => W.stair_week !== i + 1)) S.hit('deload_inside_block', where0, 'stair weeks ' + B.weeks.map(W => W.stair_week).join(','));
    for (const [i, W] of B.weeks.entries()) {
      const prev = i ? B.weeks[i - 1] : null;
      const w = W.raw;
      // T0-STW-04 no step is written into week 1
      if (i === 0) for (const [l, v] of Object.entries(w.step_by_muscle || {})) { if (typeof v !== 'number') continue; S.n('steps_in_flat'); if (Math.abs(v) > EPS) S.hit('steps_in_flat', { week: W.n, line: l }, 'a step in week 1'); }
      // T0-EFF-01 planned RIR inside the band, never rising
      S.n('rir_violation');
      const rr = w.planned_rir;
      if (rr && (rr.min < P.rir_band[0] - EPS || rr.max > P.rir_band[1] + EPS)) S.hit('rir_violation', { week: W.n }, 'planned RIR ' + rr.min + '-' + rr.max);
      else if (rr && prev && prev.raw.planned_rir && (rr.min > prev.raw.planned_rir.min + EPS || rr.max > prev.raw.planned_rir.max + EPS)) S.hit('rir_violation', { week: W.n }, 'planned RIR rises ' + prev.raw.planned_rir.min + '-' + prev.raw.planned_rir.max + ' -> ' + rr.min + '-' + rr.max);
      // T3-STW-09 the display level rises every week
      if (prev) { S.n('level_not_rising'); if (!(w.stair_level > prev.raw.stair_level + EPS)) S.hit('level_not_rising', { week: W.n }, 'level ' + prev.raw.stair_level + ' -> ' + w.stair_level); }
      // T0-TST-01 tests only in week 1 and the last week; rep-max tests on bilateral compound picks
      S.n('test_violation');
      const hasTest = !!w.test || W.days.some(D => D.items.some(I => I.raw.test));
      if (hasTest && i !== 0 && i !== N - 1) S.hit('test_violation', { week: W.n }, 'a test in stair week ' + (i + 1) + ' of ' + N);
      for (const D of W.days) for (const I of D.items) if (I.isTest && RES_KINDS.includes(I.bk) && /^rm_/.test(String(I.raw.test && I.raw.test.test)) && I.raw.laterality && I.raw.laterality !== 'bilateral') S.hit('test_violation', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, 'a rep-max test on a ' + I.raw.laterality + ' pick (' + I.raw.exercise_id + ')');
      // T0-EFF-02 intensifiers: the last stairway week only, one a day, never on a free-weight compound / glute bridge
      for (const D of W.days) {
        const ints = D.items.filter(I => I.raw.effort && (I.raw.effort.intensifier || I.raw.effort.last_set === 'myo'));
        if (!ints.length) continue;
        S.n('intensifier_violation');
        const never = (P.intensifiers.never_credit_classes || []);
        if (P.intensifiers.last_week_only && i !== N - 1) S.hit('intensifier_violation', { week: W.n, weekday: D.weekday }, 'an intensifier in stair week ' + (i + 1) + ' of ' + N);
        else if (ints.length > (P.intensifiers.per_day || 1)) S.hit('intensifier_violation', { week: W.n, weekday: D.weekday }, ints.length + ' intensifiers on one day');
        else { const bad = ints.find(I => I.ex && never.includes(I.ex.credit_class) && !((I.ex.tags || []).includes('machine') || I.ex.constraint >= 4)); if (bad) S.hit('intensifier_violation', { week: W.n, weekday: D.weekday, slot_id: bad.raw.slot_id }, 'an intensifier on ' + bad.raw.exercise_id); }
      }
    }
    // T3-STW-01 a planned target never drops (per group)
    for (const g of ctx.groups) {
      const tg = B.weeks.map(W => (W.raw.target_by_group || {})[g]);
      for (let i = 1; i < tg.length; i++) if (typeof tg[i] === 'number' && typeof tg[i - 1] === 'number') { S.n('set_drops'); if (tg[i] < tg[i - 1] - EPS) S.hit('set_drops', { week: B.weeks[i].n, group: g }, 'planned target of ' + g + ' drops ' + tg[i - 1] + ' -> ' + tg[i], { kind: 'target' }); }
    }

    const bfacts = { block: B.n, N, format: B.format, groups: {} };
    if (B.format === 'circuit') {
      // T3-STW-10 circuits climb by work seconds
      // scorer 2.3 (rules.supersets.bootcamp.x2, fix round 2 - PRG-03 '30-50 s', OBSERVED FAT BURN ramp, CX-02 a held week
      // progresses by load): the work time moves in the rule's 5-s values and holds between them. Counted: a week that drops, a
      // step that skips a value, a hold longer than the pattern allows, a block that does not end on its top value.
      const BXs = P.bootcamp_x2 && Array.isArray(P.bootcamp_x2.work_s_values) ? P.bootcamp_x2 : null;
      let held = 0;
      for (let i = 1; i < N; i++) {
        const a = B.weeks[i - 1].raw.circuit, b = B.weeks[i].raw.circuit;
        if (!a || !b) continue;
        S.n('circuit_flat');
        const top = b.to_s ?? Infinity;
        if (BXs) {
          const vals = BXs.work_s_values, ia = vals.indexOf(a.work_s), ib = vals.indexOf(b.work_s);
          held = b.work_s === a.work_s ? held + 1 : 0;
          if (b.work_s < a.work_s) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work ' + a.work_s + ' s -> ' + b.work_s + ' s (drops)');
          else if (ia >= 0 && ib >= 0 && ib - ia > 1) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work ' + a.work_s + ' s -> ' + b.work_s + ' s (skips a step)');
          else if (held > Math.max(1, Math.ceil(N / vals.length))) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work held at ' + b.work_s + ' s for ' + (held + 1) + ' weeks');
          else if (i === N - 1 && N >= vals.length && b.work_s < top) S.hit('circuit_flat', { week: B.weeks[i].n }, 'the last week holds ' + b.work_s + ' s, under the top ' + top + ' s');
        } else if (b.work_s <= a.work_s && a.work_s < top) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work ' + a.work_s + ' s -> ' + b.work_s + ' s');
        else if (b.work_s > a.work_s * 1.10 + EPS) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work ' + a.work_s + ' s -> ' + b.work_s + ' s (more than 10 %)');
      }
    }
    if (B.climbsInSets && !X.edited) {
      const Tot = B.weeks.map(W => W.T.Tot);
      // T3-STW-04 the last week is the hardest
      S.n('last_week_not_hardest');
      if (Tot[N - 1] < Math.max(...Tot) - EPS) S.hit('last_week_not_hardest', where0, 'total ' + Tot.join(' '));
      bfacts.total = Tot;

      // per exercise: no exercise ever loses a set inside the block; added exercises (T6-CNT-04)
      const slotSeries = new Map();   // weekday|slot -> [{week index, sets, exercise, origin}]
      for (const [i, W] of B.weeks.entries()) for (const D of W.days) for (const U of D.units) { const key = D.weekday + '|' + U.slot; if (!slotSeries.has(key)) slotSeries.set(key, []); slotSeries.get(key).push({ i, sets: U.sets, U, W, D }); }
      const ebStarts = new Set([...B.ebs.values()].map(ws => ws[0].n));
      for (const [, ser] of slotSeries) {
        for (let k = 1; k < ser.length; k++) {
          if (ser[k].i !== ser[k - 1].i + 1) continue;
          S.n('set_drops');
          if (ser[k].sets < ser[k - 1].sets - EPS) S.hit('set_drops', { week: ser[k].W.n, weekday: ser[k].D.weekday, slot_id: ser[k].U.slot }, ser[k].U.exercise_id + ' ' + ser[k - 1].sets + ' -> ' + ser[k].sets + ' sets', { kind: 'exercise', test_week: !!ser[k].W.raw.test });
        }
        const last = ser[ser.length - 1];
        if (last.i < N - 1) { S.n('set_drops'); S.hit('set_drops', { week: B.weeks[last.i + 1].n, weekday: last.D.weekday, slot_id: last.U.slot }, last.U.exercise_id + ' leaves the day in the middle of the block', { kind: 'exercise_removed' }); }
        const first = ser[0];
        S.n('bad_added_exercise');
        // T6-CNT-04: only at an exercise-block start, "or on the optional day later in the same block while it runs 2+ weeks"
        const ebWeeks = B.ebs.get(first.W.eb) || [];
        const weeksLeft = ebWeeks.filter(w2 => w2.n >= first.W.n).length;
        if (first.i > 0 && !ebStarts.has(first.W.n) && !(first.D.optional && weeksLeft >= 2)) S.hit('bad_added_exercise', { week: first.W.n, weekday: first.D.weekday, slot_id: first.U.slot }, first.U.exercise_id + ' enters in the middle of an exercise block');
        else if (first.U.origin !== 'template' && first.sets < (P.placement_min_sets || 2) && !first.U.hasTest) S.hit('bad_added_exercise', { week: first.W.n, weekday: first.D.weekday, slot_id: first.U.slot }, first.U.exercise_id + ' (' + first.U.origin + ') enters at ' + first.sets + ' set(s)');
      }

      // per trained group: never down, the peak in the last week, the final sets reached on the planned schedule
      const sched = B.rec.schedule || {}, tops = B.rec.group_top || {}, starts = B.rec.group_start || {};
      const earlyMax = typeof PG.arrival_weeks_early_max === 'number' ? PG.arrival_weeks_early_max : 1;
      for (const g of B.trained) {
        const own = B.weeks.map(W => W.T.OwnAll[g]), qa = B.weeks.map(W => W.T.Qall[g]);
        for (let i = 1; i < N; i++) {
          S.n('set_drops');
          const ebStart = ebStarts.has(B.weeks[i].n);
          if (qa[i] < qa[i - 1] - 0.5 - EPS) {
            S.hit('set_drops', { week: B.weeks[i].n, group: g }, g + ' credited sets ' + r2(qa[i - 1]) + ' -> ' + r2(qa[i]), { kind: 'group' });
            if (ebStart) S.hit('restart_at_block', { week: B.weeks[i].n, group: g }, g + ' drops at an exercise-block start');
          }
          if (ebStart) S.n('restart_at_block');
        }
        // T3-STW-06 the peak is in the last week
        S.n('peak_not_last');
        if (Math.max(...qa) > qa[N - 1] + EPS) S.hit('peak_not_last', { ...where0, group: g }, g + ' peaks at ' + r2(Math.max(...qa)) + ' in week ' + (B.weeks[qa.indexOf(Math.max(...qa))].n) + ', last week ' + r2(qa[N - 1]));
        // CX-01 / R4-PRG-01: the final sets are reached
        const top = tops[g], start = starts[g], sc = sched[g];
        S.n('target_not_reached');
        if (typeof top !== 'number') S.hit('target_not_reached', { ...where0, group: g }, g + ' has no planned final sets (meta.stairway[].group_top)', { kind: 'no_target' });
        else if (qa[N - 1] < top - EPS) S.hit('target_not_reached', { ...where0, group: g }, g + ' ends at ' + r2(qa[N - 1]) + ' of the planned ' + top, { value: r2(qa[N - 1]), limit: top });
        // the whole-set schedule: from the start to the final sets, never down; every week at or above it; the printed target is it
        S.n('below_schedule', N);
        if (!Array.isArray(sc) || sc.length !== N) S.hit('below_schedule', { ...where0, group: g }, g + ' has no whole-set schedule for the block', { kind: 'schedule_missing' });
        else {
          if (sc.some((v, i) => !Number.isInteger(v) || (i && v < sc[i - 1]))) S.hit('below_schedule', { ...where0, group: g }, g + ' schedule ' + sc.join(' ') + ' is not whole sets or drops', { kind: 'schedule_shape' });
          if (sc[0] !== start || sc[N - 1] !== top) S.hit('below_schedule', { ...where0, group: g }, g + ' schedule ' + sc[0] + ' .. ' + sc[N - 1] + ' does not run from its start ' + start + ' to its final sets ' + top, { kind: 'schedule_endpoints' });
          for (let i = 0; i < N; i++) {
            if (qa[i] < sc[i] - EPS) S.hit('below_schedule', { week: B.weeks[i].n, group: g }, g + ' ' + r2(qa[i]) + ' under the planned ' + sc[i], { kind: 'under', value: r2(qa[i]), limit: sc[i] });
            const t = (B.weeks[i].raw.target_by_group || {})[g];
            if (t !== sc[i]) S.hit('below_schedule', { week: B.weeks[i].n, group: g }, g + ' target ' + t + ' is not the planned ' + sc[i], { kind: 'target_not_the_schedule' });
          }
          // R4-PRG-01: the top number arrives in the last week, one week early at most
          S.n('arrival_early');
          if (typeof top === 'number' && typeof start === 'number' && top > start + EPS && N >= 3) {
            const first = sc.findIndex(v => v >= top - EPS);
            if (first >= 0 && first < N - 1 - earlyMax) S.hit('arrival_early', { ...where0, group: g }, g + ' reaches ' + top + ' in week ' + B.weeks[first].n + ' of ' + N + ' (' + (N - 1 - first) + ' weeks early)', { value: N - 1 - first, limit: earlyMax });
          }
        }
        // T5-CAP-01 / -03 ceilings (per line; per group soft)
        const C = groupCeiling(g, B, X, ctx);
        for (const l of ctx.linesOfGroup[g] || []) {
          const cap = (B.rec.cap || {})[l] ?? (X.targets.cap || {})[l];
          if (typeof cap !== 'number') continue;
          for (let i = 0; i < N; i++) {
            S.n('over_ceiling');
            const dir = B.weeks[i].T.LdirAll[l], cred = B.weeks[i].T.Lall[l];
            if (dir > cap + EPS || cred > cap + 1 + EPS) S.hit('over_ceiling', { week: B.weeks[i].n, group: g, line: l }, l + ' direct ' + dir + ', credited ' + r2(cred) + ' on all days, ceiling ' + cap, { value: r2(cred), limit: cap });
          }
        }
        for (let i = 0; i < N; i++) {
          S.n('over_30'); if (qa[i] > P.absolute_cap + EPS) S.hit('over_30', { week: B.weeks[i].n, group: g }, g + ' ' + r2(qa[i]) + ' credited sets');
          // (scorer 2.2: a group whose own exercises all sit at their fewest sets has no set to give back - what passes the ceiling
          // is the helper credit of other groups' lifts on a template whose lifts never close, R4-SES-04)
          if (C.cap !== null && P.two_line_groups === 'carrier_max') { S.n('group_over_ceiling'); if (qa[i] > C.cap + 1 + EPS && !ownAtFewest(B.weeks[i], g, X, ctx)) S.hit('group_over_ceiling', { week: B.weeks[i].n, group: g }, g + ' credited ' + r2(qa[i]) + ' on all days, group ceiling ' + C.cap); }
        }
        bfacts.groups[g] = { own, credited: qa.map(r2), start: typeof start === 'number' ? start : null, top: typeof top === 'number' ? top : null, planned_top: (B.rec.planned_top || {})[g] ?? null,
          schedule: Array.isArray(sc) ? sc.slice() : null, ceiling: C.cap, level_ceiling: C.level_cap,
          flat_weeks: qa.filter((v, i) => i > 0 && v - qa[i - 1] < 0.5).length };
      }
      // R4-PRG-02: a week that adds more than about 15 % for a group (by 2 or more whole sets) carries its note
      const above = typeof PG.note_above === 'number' ? PG.note_above : 0.15, minSets = typeof PG.note_min_whole_sets === 'number' ? PG.note_min_whole_sets : 2;
      let fast = 0;
      for (let i = 1; i < N; i++) for (const g of ctx.groups) {
        const from = r2(B.weeks[i - 1].T.Qall[g]), to = r2(B.weeks[i].T.Qall[g]);
        S.n('acceleration_unnoted');
        if (!(from > 0 && to - from >= minSets - EPS && (to - from) / from > above + EPS)) continue;
        fast++;
        const acc = B.weeks[i].raw.acceleration || [];
        if (!acc.some(a => a && a.group === g)) S.hit('acceleration_unnoted', { week: B.weeks[i].n, group: g }, g + ' ' + from + ' -> ' + to + ' (+' + Math.round(100 * (to - from) / from) + ' %) with no acceleration note');
        else if (!X.warnings.some(w => w && w.code === 'acceleration' && w.args && w.args.week === B.weeks[i].n)) S.hit('acceleration_unnoted', { week: B.weeks[i].n, group: g }, g + ' is noted on the week, and no notice up front names week ' + B.weeks[i].n);
      }
      bfacts.weeks_above_the_note = fast;
      // T5-CAP-04 (info): sets under the level ceiling; T8-BAL-04 balance of relative progress
      let shortfall = 0; const prog = [];
      for (const g of B.trained) { const f = bfacts.groups[g]; if (f.level_ceiling !== null) shortfall += Math.max(0, f.level_ceiling - f.credited[N - 1]); if (f.top !== null && f.start !== null && f.top > f.start) prog.push((f.credited[N - 1] - f.credited[0]) / (f.top - f.start)); }
      bfacts.ceiling_shortfall = r2(shortfall);
      bfacts.progress_spread = prog.length > 1 ? r2(Math.max(...prog) - Math.min(...prog)) : 0;
    } else if (!X.edited) {
      // formats that do not climb in sets still must not lose sets on trained groups (flat = allowed, CX-02)
      for (const g of B.trained) for (let i = 1; i < N; i++) { S.n('set_drops'); const a = B.weeks[i - 1].T.Qall[g], b = B.weeks[i].T.Qall[g]; if (b < a - 0.5 - EPS) S.hit('set_drops', { week: B.weeks[i].n, group: g }, g + ' credited sets ' + r2(a) + ' -> ' + r2(b), { kind: 'group' }); }
    }
    facts.push(bfacts);
  }
  return facts;
}

function checkExerciseBlocks(S, X, ctx) {
  // T0-SES-14 exercises fixed inside an exercise block; T8-VAR-02 block-to-block changes
  const scope = (I) => (RES_KINDS.includes(I.bk) || ['core', 'athletic', 'power', 'prehab'].includes(I.bk)) && !I.isTest && I.block !== 'circuit' && I.raw.exercise_id;
  for (const B of X.blocks) {
    const perSlotByEb = new Map();   // slot -> [exercise per exercise block]
    for (const [eb, weeks] of B.ebs) {
      const seen = new Map();
      for (const W of weeks) for (const D of W.days) for (const I of D.items) {
        if (!scope(I)) continue;
        const key = D.weekday + '|' + I.raw.slot_id;
        const val = I.raw.exercise_id + (I.raw.detail ? '#' + JSON.stringify(I.raw.detail) : '');
        if (!seen.has(key)) { seen.set(key, { val, I, W }); S.n('mid_block_changes'); if (!perSlotByEb.has(key)) perSlotByEb.set(key, []); perSlotByEb.get(key).push({ eb, id: I.raw.exercise_id, role: I.role, W }); }
        else if (seen.get(key).val !== val && !seen.get(key).reported) { seen.get(key).reported = true; S.hit('mid_block_changes', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, seen.get(key).val + ' -> ' + val + ' inside exercise block ' + eb); }
      }
    }
    if (!B.stairway) continue;
    for (const [key, seq] of perSlotByEb) {
      if (seq.length < 2) continue;
      S.n('block_change_violations');
      const ids = seq.map(x => x.id);
      const aba = ids.some((id, i) => i >= 2 && ids.slice(0, i - 1).includes(id) && ids[i - 1] !== id);
      if (aba) S.hit('block_change_violations', { block: B.n, slot_id: key.split('|')[1] }, 'returns to an earlier pick: ' + ids.join(' -> '));
      else if (seq[0].role === 'work' && new Set(ids).size > 1) S.hit('block_change_violations', { block: B.n, slot_id: key.split('|')[1] }, 'the work lift changes: ' + ids.join(' -> '));
    }
  }
}

/**
 * The scorer's own count of a session's exercises (COACH-R4 R4-SES-02 'not counting warm-up or the 2 core exercises'): everything
 * outside the warm-up, the core block, joint care, skill practice, conditioning, cardio, the cool-down and tests
 * (rules.session.outside_cap_blocks); a rep-max test row is the top set of its lift; a row at 0 sets is not in the session; the
 * quick ankle prep block is outside the count (rules.athletic.f2.ankle_block).
 */
function countedExercises(D, ctx) {
  const P = ctx.P;
  let n = 0;
  for (const I of D.items) {
    if (P.outside_cap_blocks.includes(I.block)) continue;
    if (typeof I.raw.sets === 'number' && I.raw.sets === 0) continue;
    if (I.raw.role === 'test' && I.raw.test && I.bucket !== 'TEST') continue;
    if (P.ankle_outside_count && I.bucket === 'AP_JUMP_LIMITED_KNEE' && ((I.raw.flags || []).includes('ankle_block') || (I.raw.athletic && I.raw.athletic.key === 'low_contacts'))) continue;
    n++;
  }
  return n;
}

function checkCounts(S, X, ctx) {
  const P = ctx.P;
  let mainDays = 0, resEx = 0, maxCounted = 0, maxRes = 0;
  const size = X.size;
  const passedAt = new Map();   // scorer 2.2 (staircase): day | earlier | later exercise -> had the earlier one room when it was passed?
  for (const W of X.weeks) {
    const B = X.blocks.find(b => b.n === W.tb);
    for (const D of W.days) {
      const where = { week: W.n, weekday: D.weekday };
      // R4-SES-02: the session is sized by its exercise count (the scorer's own recount); the range is a ceiling for a generated day
      if (D.gym && size && !X.edited) {
        const counted = countedExercises(D, ctx);
        maxCounted = Math.max(maxCounted, counted);
        S.n('session_size_over');
        if (counted > size.range[1]) S.hit('session_size_over', where, counted + ' counted exercises (' + size.type + ': ' + size.range[0] + '-' + size.range[1] + ')', { value: counted, limit: size.range[1] });
        if (typeof D.raw.exercise_count === 'number' && D.raw.exercise_count !== counted) S.hit('credit_tally_mismatch', where, 'the day says ' + D.raw.exercise_count + ' exercises, the recount gives ' + counted);
        if (D.main && W.stairway && !W.raw.test) {
          const dt = ctx.templateDay(X.meta.template, D.raw.day_type);
          if (dt) {
            const planned = Math.min(size.range[1], Math.max(size.range[0], typeof dt.count === 'number' ? dt.count : size.default));
            const inTemplate = dt.stations.filter(st => typeof st.rank === 'number' && st.rank <= planned && !P.outside_cap_blocks.includes(st.block)).length;
            const saidWhy = (D.raw.why || []).some(y => y && (P.absent_ok_whys.includes(y.key) || y.key === 'why.olympic_budget'));
            S.n('session_size_under');
            if (counted < size.range[0] && inTemplate >= size.range[0] && !saidWhy) S.hit('session_size_under', where, counted + ' counted exercises (' + size.type + ': ' + size.range[0] + '-' + size.range[1] + '; the template day holds ' + inTemplate + ')', { value: counted, limit: size.range[0] });
          }
        }
      }
      if (D.main) {
        mainDays++; resEx += D.units.length; maxRes = Math.max(maxRes, D.units.length);
        // T0-SES-15 sets per exercise
        if (W.stairway && !P.set_bounds_skip_formats.includes(D.format) && !X.edited) for (const U of D.units) {
          if (U.prime.includes('calves')) continue;   // the calf rule (calf_rule): one exercise x 3 sets
          S.n('set_bounds');
          const hi = P.placement_max_sets[X.level] || 5;
          if (U.sets < P.placement_min_sets - EPS || U.sets > hi + EPS) S.hit('set_bounds', { ...where, slot_id: U.slot }, U.exercise_id + ' at ' + U.sets + ' sets (' + P.placement_min_sets + '-' + hi + ')', { value: U.sets, test_week: U.hasTest });
        }
        // T7-ORD-01 the Focus muscle first
        if (X.focusGroups.length && D.format !== 'circuit') {
          const first = D.units.find(U => U.block === 'strength' || U.block === 'accessories');
          if (first && D.units.some(U => U.prime.some(g => X.focusGroups.includes(g))) && !D.units.some(U => U.role === 'work')) { S.n('focus_not_first'); if (!first.prime.some(g => X.focusGroups.includes(g))) S.hit('focus_not_first', where, 'first exercise ' + first.slot + ' (' + first.prime.join('/') + '), Focus ' + X.focusGroups.join(', ')); }
        }
        // T7-ORD-02 clean on knee days, snatch on hip days
        const work = D.units.find(U => U.role === 'work' && isLowerCompound(U));
        if (work) for (const I of D.items) {
          const fam = I.ex && I.ex.athletic && I.ex.athletic.olympic_family;
          if (I.bk !== 'power' || !fam) continue;
          const dp = (P.olympic.day_pattern || {})[fam];
          if (!dp || dp === 'either') continue;
          S.n('olympic_day_pattern');
          if (dp !== dominance(work)) S.hit('olympic_day_pattern', { ...where, slot_id: I.raw.slot_id }, fam + ' on a ' + dominance(work) + ' day');
        }
        // T7-PLC-01 the coach's staircase inside a group-day (straight days of blocks that climb in sets)
        if (B && B.climbsInSets && B.format !== 'strength_roles') for (const g of B.trained) {
          if (g === 'calves') continue;
          const us = D.units.filter(U => U.prime[0] === g && !X.classSlots.has(U.slot) && !(U.role === 'work' && B.format === 'class'));
          if (us.length < 2) continue;
          // scorer 2.2 (rules.placement.x1): a group that steps on one muscle's own exercises first (a Focus muscle; side delts on a
          // physique plan; a muscle's direct minimum) has no single staircase to read
          if (stepsFirst(g, X, ctx)) continue;
          S.n('staircase_deviation', us.length);
          let dev = 0;
          // (scorer 2.2: an isolation exercise of a training day holds 3 sets - its 4th in the hardest weeks is the group's next
          // step, not a hole in the staircase - and the day's extra small exercise 2-3; a later exercise may pass an earlier one
          // that sits at its own top)
          const held = pressHeld(W, B, P);
          const capOf = (U) => (held && isPressUnit(U, P) ? U.sets : unitTop(U, D, X, P));
          const CMo = P.placement_x2 && P.placement_x2.order && P.placement_x2.order.compound_min;
          const cmpMin = CMo && (CMo.levels || []).includes(X.level) && !(CMo.not_families || []).includes(X.family) ? CMo.sets : 0;
          for (let i = 1; i < us.length; i++) {
            // (the earlier exercise is read at the week the later one passed it: a press the balance held that week keeps its place
            // until the group's next step)
            const key = B.n + '|' + D.weekday + '|' + us[i - 1].slot + '|' + us[i].slot;
            if (us[i].sets <= us[i - 1].sets) { passedAt.delete(key); continue; }
            // (scorer 2.3, rules.placement.x2.order.compound_min - VOL-16 '3 sets on compounds, 2 on isolation': a compound lift at
            // its 3 sets is not 'above' an isolation exercise that stands before it in the template's order)
            if (cmpMin && us[i].ex && us[i].ex.exercise_class === 'compound' && us[i].sets <= cmpMin && us[i - 1].ex && us[i - 1].ex.exercise_class === 'isolation') { passedAt.delete(key); continue; }
            if (!passedAt.has(key)) passedAt.set(key, us[i - 1].sets < capOf(us[i - 1]));
            if (passedAt.get(key) && us[i - 1].sets < capOf(us[i - 1])) dev += us[i].sets - us[i - 1].sets;
          }
          const below = us.filter(U => U.sets < capOf(U));
          // (scorer 2.3: the spread is read with a compound lift counted at no more than the 3 sets it takes before the group's
          // isolation exercises step - the same model rule)
          const hi = (U) => (cmpMin && U.ex && U.ex.exercise_class === 'compound' && below.some(V => V.ex && V.ex.exercise_class === 'isolation' && V.sets < cmpMin) ? Math.min(U.sets, Math.max(cmpMin - 1, Math.min(...below.map(V => V.sets)) + 1)) : U.sets);
          if (below.length) dev += Math.max(0, Math.max(...us.map(hi)) - Math.min(...below.map(U => U.sets)) - 1);
          for (let k = 0; k < dev; k++) S.hit('staircase_deviation', { ...where, group: g }, g + ' sets ' + us.map(U => U.sets).join('/'));
        }
        // T7-PLC-03 a bonus exercise never alone for its group
        // (scorer 2.3: the template's own extra station - the A day's rear-delt exercise - is his 8th exercise, not a misplaced bonus)
        const tplExtra = (U) => !!(P.placement_x2 && P.placement_x2.template_extra) && ((U.lead && U.lead.raw && U.lead.raw.why) || []).some(w => w && w.key === 'why.template_extra_station');
        for (const U of D.units) if (U.origin === 'bonus' && !tplExtra(U)) { S.n('bonus_misplaced'); const g = U.prime[0]; if (g && D.units.filter(V => V.prime.includes(g)).length === 1) S.hit('bonus_misplaced', { ...where, slot_id: U.slot }, 'bonus ' + U.exercise_id + ' is the only ' + g + ' exercise of the day'); }
      }
      if (D.optional && W.stairway) {
        // T6-CNT-05 Focus slots on optional days (recovery weeks run at about half the sets)
        // (v0.5: a group its template cannot take to the target gets a bonus exercise on the optional day - rules.placement.bonus)
        const fs = D.units.filter(U => (U.role === 'focus' || U.bucket === 'FOCUS') && U.origin !== 'bonus');
        const bonus = D.units.filter(U => U.origin === 'bonus');
        if (fs.length || bonus.length) {
          S.n('focus_slot_violation');
          const lim = P.optional_focus;
          const range = Array.isArray(lim.sets) ? lim.sets : [2, lim.sets_max || 3];
          if (fs.length > (lim.slots || 2)) S.hit('focus_slot_violation', where, fs.length + ' Focus slots on the optional day');
          else if (bonus.length > P.bonus_per_optional_day) S.hit('focus_slot_violation', where, bonus.length + ' bonus exercises on the optional day');
          else { const bad = fs.find(U => U.sets < range[0] || U.sets > range[1]); if (bad && !X.edited) S.hit('focus_slot_violation', { ...where, slot_id: bad.slot }, 'Focus slot at ' + bad.sets + ' sets'); }
        }
      }
    }
    // T7-WEEK-01 frequency in plans of 4+ main days
    const mains = W.days.filter(D => D.main);
    if (W.stairway && mains.length >= 4 && B && B.format !== 'circuit') {
      const cnt = { knee: 0, hip: 0, push: 0, pull: 0 };
      for (const D of mains) { const ps = new Set(D.units.map(patternOf)); if (ps.has('BKD') || ps.has('UKD')) cnt.knee++; if (ps.has('BHD') || ps.has('UHD')) cnt.hip++; if (ps.has('HPUSH') || ps.has('VPUSH') || ps.has('MRPUSH')) cnt.push++; if (ps.has('HPULL') || ps.has('VPULL') || ps.has('MRPULL')) cnt.pull++; }
      for (const [k, v] of Object.entries(cnt)) { S.n('frequency_shortfall'); if (v < 2) S.hit('frequency_shortfall', { week: W.n }, k + ' on ' + v + ' day(s)'); }
    }
  }
  S.set('exercise_count', mainDays ? r2(resEx / mainDays) : 0, null, { most_on_one_day: maxRes });
  if (size) S.extra('session_size_over', { most_counted_on_one_day: maxCounted, size: size.type, range: size.range });
  // T5-CAP-06 Focus muscles
  S.n('focus_violation');
  const choices = (X.derived.priority_choices || X.targets.priority || []);
  if ((X.derived.priority_choices ? choices.length : X.focusGroups.length) > (P.focus.max || 2)) S.hit('focus_violation', {}, choices.length + ' Focus choices');
  else if (X.focusGroups.length && typeof X.targets.focus_add === 'number' && (X.targets.focus_add < P.focus.add_range[0] || X.targets.focus_add > P.focus.add_range[1])) S.hit('focus_violation', {}, 'Focus add ' + X.targets.focus_add);
  // T7-PAIR-01 the pairing grammar follows the goal
  const pairing = (X.meta.template || {}).pairing;
  if (pairing && X.goal) {
    S.n('pairing_style');
    const same = (P.pairing.same_pattern || {}).goals || [], cross = (P.pairing.cross_pattern || {}).goals || [];
    if (same.includes(X.goal) && pairing !== 'same_pattern') S.hit('pairing_style', {}, 'goal ' + X.goal + ' with ' + pairing);
    else if (cross.includes(X.goal) && !X.competitive && pairing !== 'cross_pattern' && !(P.pairing.cross_pattern.formats || []).includes(X.format)) S.hit('pairing_style', {}, 'goal ' + X.goal + ' with ' + pairing);
  }
}

function checkPlacementPairs(S, X, ctx) {
  // T7-PLC-02 the two exposures of a day type alternate; T8-VAR-01 the second exposure holds a different exercise
  for (const B of X.blocks) {
    if (!B.climbsInSets) continue;
    const w1 = B.weeks[0];
    const stem = (t) => { const mm = /^(.*?)[ ]?([12])$/.exec(String(t)); return mm ? { stem: mm[1], k: Number(mm[2]) } : null; };
    const pairs = [];
    const mains = w1.days.filter(D => D.main);
    for (const a of mains) { const sa = stem(a.raw.day_type); if (!sa || sa.k !== 1) continue; const b = mains.find(D => { const sb = stem(D.raw.day_type); return sb && sb.stem === sa.stem && sb.k === 2; }); if (b) pairs.push([a.weekday, b.weekday]); }
    for (const [da, db] of pairs) {
      for (const g of B.trained) {
        // (scorer 2.2: a group that steps on its Focus muscle's own exercises first does not alternate its two exposures)
        if (stepsFirst(g, X, ctx)) continue;
        const own = (W, wd) => { const D = W.days.find(d => d.weekday === wd); return D ? sum(D.units.filter(U => U.prime.includes(g)).map(U => U.sets)) : 0; };
        const a0 = own(w1, da), b0 = own(w1, db);
        if (!a0 && !b0) continue;
        for (const W of B.weeks.slice(1)) {
          S.n('exposure_imbalance');
          const dA = own(W, da) - a0, dB = own(W, db) - b0;
          // (scorer 2.2: the exposure that lags is read only while one of its exercises has room under its own top, and the second
          // exposure 'first' only when it also holds more sets than the first - a step that evens the two days is no miss)
          const lag = dA < dB ? da : db;
          const heldW = pressHeld(W, B, ctx.P);
          const roomOn = (wd) => { const Dx = W.days.find(d => d.weekday === wd); return !!Dx && Dx.units.some(U => U.prime.includes(g) && !(heldW && isPressUnit(U, ctx.P)) && U.sets < unitTop(U, Dx, X, ctx.P)); };
          const dev = (roomOn(lag) ? Math.max(0, Math.abs(dA - dB) - 1) : 0) + (dB > dA && own(W, db) > own(W, da) && roomOn(da) ? 1 : 0);
          for (let k = 0; k < dev; k++) S.hit('exposure_imbalance', { week: W.n, group: g }, g + ': +' + dA + ' on ' + da + ', +' + dB + ' on ' + db);
        }
      }
      // identical exercise on both exposures, no detail
      for (const [eb, weeks] of B.ebs) {
        const W = weeks[0]; const A = W.days.find(d => d.weekday === da), Bd = W.days.find(d => d.weekday === db);
        if (!A || !Bd) continue;
        for (const U of A.units) {
          const st = String(U.lead.raw.station_id || '').split('.').pop();
          const V = Bd.units.find(v => String(v.lead.raw.station_id || '').split('.').pop() === st && v.bucket === U.bucket);
          if (!V) continue;
          S.n('repeated_exposure');
          if (U.exercise_id === V.exercise_id && !U.lead.raw.detail && !V.lead.raw.detail) S.hit('repeated_exposure', { week: W.n, slot_id: U.slot }, U.exercise_id + ' on both ' + da + ' and ' + db + ' (exercise block ' + eb + ')');
        }
      }
    }
  }
}

function checkAthletic(S, X, ctx) {
  const P = ctx.P; const RC = P.athletic_reconcile;
  const fams = { ...(RC.climb_families || {}), olympic: ['olympic_sets'] };
  const facts = { enabled: !!(X.meta.athletic && X.meta.athletic.enabled), families: {} };
  const told = (fam) => X.warnings.some(w => w && /athletic_capacity/.test(String(w.key)) && (!w.args || !Object.keys(w.args).length || JSON.stringify(w.args).includes(fam) || (fams[fam] || []).some(k => JSON.stringify(w.args).includes(k)) || !/jump|ankle|throw|cod|sprint|olympic|contact|famil|key/.test(JSON.stringify(w.args))));
  const ratios = [];
  let dropsInTestWeek = 0;
  // T0-SAFE-10 wins over T0-ATH-01: Olympic work is asked for only where the kit can do one Olympic exercise of the catalog
  const kitTokens = new Set(X.kit.tokens || []), kitMachines = new Set(X.kit.machines || []);
  const olympicPossible = !kitTokens.size || ctx.olympicExercises.some(ex => (ex.equipment.any_of || []).some(setup => setup.every(t => kitTokens.has(t))) && (!ex.equipment.machine || kitMachines.has(ex.equipment.machine)));
  const olderNoOptIn = X.age !== null && X.age >= ((P.population.older && P.population.older.from_age) || 60) && !X.meta.older_opt_in;
  const olderAllowed = (P.population.older && P.population.older.default_allowed_athletic) || [];
  for (const B of X.blocks) {
    const N = B.N;
    const val = (W, fam, field) => { const ab = W.raw.athletic_budget || {}; const o = ab[field] || {}; let v = 0, any = false; for (const k of fams[fam]) if (typeof o[k] === 'number') { v += o[k]; any = true; } if (field === 'planned' && P.athletic_test_replaced_counts && ab.test_replaced) for (const k of fams[fam]) v += ab.test_replaced[k] || 0; return any ? v : null; };
    for (const W of B.weeks) {
      const ab = W.raw.athletic_budget;
      // T0-ATH-03 contacts per session
      for (const D of W.days) {
        const contacts = sum(D.items.filter(I => I.raw.athletic && I.raw.athletic.unit === 'contacts' && I.bucket !== 'AP_JUMP_LIMITED_KNEE' && !/upper/.test(String(I.raw.athletic.key))).map(I => I.raw.athletic.total || 0));
        if (!contacts) continue;
        S.n('contact_cap');
        const cap = (ab && ab.contacts_session_max) || P.contacts_session_max[X.level] || Infinity;
        if (contacts > cap + EPS) S.hit('contact_cap', { week: W.n, weekday: D.weekday }, contacts + ' contacts (cap ' + cap + ')');
      }
      // T0-ATH-02 a quality outside its stage
      const stage = W.raw.plyo_stage;
      if (stage) for (const D of W.days) for (const I of D.items) {
        const a = I.raw.athletic;
        if (!a || !a.stage || !['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(I.bucket) || I.bucket === 'AP_JUMP_LIMITED_KNEE' || /upper/.test(String(a.key))) continue;
        S.n('stage_violation');
        const ok = P.stage_qualities[stage] || [];
        // T0-SAFE-05 wins: a 60+ client without the opt-in keeps the default-on qualities (landing) in every stage
        // scorer 2.1: the low-amplitude ankle / pogo hop is the one plyometric of every stage, whatever station it fills (engine
        // select.hardFilter 'stage 1 Land: ... the only plyometric work is the low-amplitude ankle / pogo kind', R2-ATH-03, CAT-10);
        // scorer 2.0 allowed it in the ankle station only
        const lowAmp = !!(I.ex && I.ex.athletic && I.ex.athletic.low_amplitude);
        if (ok.length && !ok.includes(a.quality) && !lowAmp && !(olderNoOptIn && olderAllowed.includes(a.quality))) S.hit('stage_violation', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, a.quality + ' in ' + stage);
      }
      if (!ab || !B.stairway) continue;
      // the athletic budget is scored where the plan says athletic work is on (meta.athletic.enabled); a target printed for a plan
      // with the athletic block off is reported in facts.athletic.targets_printed_while_off
      if (!facts.enabled) { if (Object.keys(fams).some(fam => val(W, fam, 'targets') > 0)) facts.targets_printed_while_off = true; continue; }
      for (const fam of Object.keys(fams)) {
        const t = val(W, fam, 'targets'), p = val(W, fam, 'planned'), g = val(W, fam, 'goals');
        if (t === null || t <= 0) continue;
        ratios.push(Math.min(1, (p || 0) / t));
        // T5-ATH-01 never above the budget
        S.n('athletic_over_budget');
        const perSet = Math.max(0, ...fams[fam].map(k => (RC.per_set_max || {})[k] || 0));
        const lim = fam === 'olympic' ? Math.max(RC.olympic_max_factor * t, ((P.olympic.sets || {}).min_per_exposure || 2) * ((X.meta.athletic || {}).olympic_exposures_wk || 0)) : (1 + RC.tolerance) * t + perSet;
        if ((p || 0) > lim + EPS) S.hit('athletic_over_budget', { week: W.n, family: fam }, fam + ' planned ' + p + ', target ' + t + ' (limit ' + r2(lim) + ')');
        // A18 planned at least 0.9 x the scaled target
        const scaled = g !== null ? g : t;
        S.n('athletic_attainment');
        if ((p || 0) < P.athletic_attainment_min * scaled - EPS) S.hit('athletic_attainment', { week: W.n, family: fam }, fam + ' planned ' + (p || 0) + ' of ' + r2(scaled) + (g !== null ? ' (scaled from ' + t + ')' : ''), { value: p || 0, limit: r2(P.athletic_attainment_min * scaled), full_target: t });
      }
      // T3-ATH-02 the plyometric share
      if (typeof ab.plyo_share === 'number' && typeof ab.planned_share === 'number' && !W.raw.test) { S.n('share_off'); if (Math.abs(ab.planned_share - ab.plyo_share) > P.share_tolerance + EPS) S.hit('share_off', { week: W.n }, 'plyometric share ' + r2(ab.planned_share) + ' against ' + ab.plyo_share); }
      // T5-ATH-03 a COD target with no COD station
      if (val(W, 'cod_cuts', 'targets') > 0) { S.n('cod_missing'); if (!W.days.some(D => D.items.some(I => I.bucket === 'AP_COD'))) S.hit('cod_missing', { week: W.n }, 'COD target ' + val(W, 'cod_cuts', 'targets') + ', no COD station'); }
      // T0-ATH-01 Olympic work every week for competitive athletes
      if (X.athletic_family && X.competitive && (X.age === null || X.age < 60 || X.meta.older_opt_in) && (X.meta.athletic || {}).enabled && olympicPossible) {
        S.n('olympic_presence');
        const expo = W.days.filter(D => D.items.some(I => I.bk === 'power' && I.sets > 0)).length;
        if (!expo && !(W.raw.test && W.raw.test.type === 'end')) S.hit('olympic_presence', { week: W.n }, 'no Olympic item');
        else if (expo > (P.olympic.per_week_max || 4)) S.hit('olympic_presence', { week: W.n }, expo + ' Olympic exposures');
      }
    }
    if (!B.stairway) {
      // T0-ATH-04 in-season weeks of game-heavy sports
      if (B.type === 'in_season' && (P.in_season_game_heavy.sports || []).includes(X.sport_id)) for (const W of B.weeks) {
        S.n('in_season_violation');
        const cod = W.days.some(D => D.items.some(I => I.bucket === 'AP_COD'));
        const expo = W.days.filter(D => D.items.some(I => I.bk === 'power' && I.sets > 0)).length;
        if (cod) S.hit('in_season_violation', { week: W.n }, 'extra COD in season');
        else if (expo > ((P.olympic.in_season || {}).per_week || 1)) S.hit('in_season_violation', { week: W.n }, expo + ' Olympic exposures in season');
      }
      continue;
    }
    // T0-ATH-02 the stage is aligned to exercise blocks and never goes back
    const order = ['RC1', 'RC2', 'RC3'];
    for (const [eb, weeks] of B.ebs) { const st = new Set(weeks.map(W => W.raw.plyo_stage).filter(Boolean)); if (st.size) { S.n('stage_violation'); if (st.size > 1) S.hit('stage_violation', { block: B.n }, 'stages ' + [...st].join(', ') + ' inside exercise block ' + eb); } }
    for (let i = 1; i < N; i++) { const a = B.weeks[i - 1].raw.plyo_stage, b = B.weeks[i].raw.plyo_stage; if (a && b) { S.n('stage_violation'); if (order.indexOf(b) < order.indexOf(a)) S.hit('stage_violation', { week: B.weeks[i].n }, a + ' -> ' + b); } }
    // T3-ATH-01 the athletic stairway: never drops, climbs when its target climbs; A17 an untold shortfall
    for (const fam of Object.keys(fams)) {
      const p = B.weeks.map(W => val(W, fam, 'planned')), t = B.weeks.map(W => val(W, fam, 'targets'));
      if (!facts.enabled || !t.some(v => v > 0)) continue;
      for (let i = 1; i < N; i++) {
        S.n('athletic_drops');
        if (!((p[i] || 0) < (p[i - 1] || 0) - EPS)) continue;
        // scorer 2.1: the end-test week of a block runs the baseline week's athletic dose on its tested days and, in the class model,
        // no Olympic work before a strength test (engine E-165 / E-172, R2-PER-07 "test ... at the end"); that fall is reported, not
        // counted - unless the week falls clearly under the block's own first week (more than the reconcile tolerance under it: the
        // week's exercises are the last exercise block's, whose per-set steps differ from the baseline week's), then it is a drop
        const endTest = !!B.weeks[i].raw.test && i === N - 1 && B.weeks[i].raw.test.type !== 'baseline';
        if (endTest) dropsInTestWeek++;
        const classNoPower = fam === 'olympic' && X.family === 'hybrid_crossfit';
        if (endTest && P.athletic_end_test_week_dose_ok && ((p[i] || 0) >= (1 - (RC.tolerance || 0.25)) * (p[0] || 0) - EPS || classNoPower)) continue;
        S.hit('athletic_drops', { week: B.weeks[i].n, family: fam }, fam + ' ' + p[i - 1] + ' -> ' + p[i], { test_week: !!B.weeks[i].raw.test });
      }
      const lastIdx = N - 1 - ((B.weeks[N - 1].raw.athletic_budget || {}).hold ? 1 : 0);
      const tRise = t[0] > 0 ? t[N - 1] / t[0] - 1 : (t[N - 1] > 0 ? 1 : 0);
      if (tRise >= P.athletic_target_rise_min - EPS && lastIdx > 0) { S.n('athletic_flat'); if ((p[lastIdx] || 0) <= (p[0] || 0) + EPS) S.hit('athletic_flat', { block: B.n, family: fam }, fam + ' planned ' + p[0] + ' -> ' + p[lastIdx] + ' while the target goes ' + t[0] + ' -> ' + t[N - 1]); }
      const peakT = Math.max(...t.map(v => v || 0)), peakP = Math.max(...p.map(v => v || 0));
      S.n('unexplained_decisions');
      if (peakT > 0 && peakP < RC.warn_below_share * peakT - EPS && !told(fam)) S.hit('unexplained_decisions', { block: B.n, family: fam }, fam + ' peaks at ' + peakP + ' of ' + peakT + ' (under ' + Math.round(RC.warn_below_share * 100) + ' %) and is not told');
      facts.families[fam] = { planned: p, target: t, peak_share: peakT > 0 ? r2(peakP / peakT) : null };
    }
  }
  if (ratios.length) S.set('athletic_attainment_ratio', r2(sum(ratios) / ratios.length), null);
  if (dropsInTestWeek) S.extra('athletic_drops', { in_an_end_test_week: dropsInTestWeek });
  // T0-ATH-05 sport defaults; T0-SAFE-06 racket 50-59 joint care; T0-EFF-06 survival work
  const A50 = P.population.active_aging_50 || {};
  const racket50 = X.age !== null && X.age >= (A50.from_age || 50) && X.age <= (A50.to_age || 59) && (A50.racket_profiles || []).includes(X.profile_id);
  for (const W of X.weeks) {
    let armCare = false;
    for (const D of W.days) {
      if (D.main && X.sport_id === 'swimming') { S.n('sport_default_violation'); if (!D.items.some(I => I.bucket === 'RECOVERY_ARM_CARE')) S.hit('sport_default_violation', { week: W.n, weekday: D.weekday }, 'swimmer main day without shoulder care'); }
      for (const I of D.items) if (I.bucket === 'COND_CIRCUIT') { S.n('sport_default_violation'); if (Object.keys(I.credits).length) S.hit('sport_default_violation', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, 'a station circuit credited as muscle sets'); }
      if (D.main && racket50 && W.legDays.includes(D)) { S.n('racket50_defaults'); if (!D.items.some(I => (A50.prehab_each_leg_day || []).includes(I.bucket) || (I.ex && I.ex.credit_class === 'ISO_CALF'))) S.hit('racket50_defaults', { week: W.n, weekday: D.weekday }, 'leg day without lower joint care or a calf exercise (R3-ATH-02: calf and Achilles work every leg day)'); }
      if (D.main && D.items.some(I => (A50.prehab_weekly || []).includes(I.bucket) || (P.prehab_x1.in_template_slot && (I.raw.flags || []).includes('joint_care') && I.ex && ['ISO_REAR', 'FACEPULL'].includes(I.ex.credit_class)))) armCare = true;
      if (D.main && X.family === 'strength') { S.n('survival_cut'); if (!D.units.some(U => U.role === 'survival')) S.hit('survival_cut', { week: W.n, weekday: D.weekday }, 'no survival item'); }
    }
    if (racket50 && W.days.some(D => D.main)) { S.n('racket50_defaults'); if (!armCare) S.hit('racket50_defaults', { week: W.n }, 'no arm care on a main day this week'); }
  }
  return facts;
}

function checkEffortRest(S, X, ctx) {
  const RR = ctx.P.rest;
  const inAny = (r, list) => list.some(a => Array.isArray(a) && r.min >= a[0] - EPS && r.max <= a[1] + EPS);
  for (const W of X.weeks) for (const D of W.days) for (const I of D.items) {
    const r = I.raw.rest;
    if (!r || typeof r.min !== 'number' || typeof r.max !== 'number' || r.type === 'work_rest') continue;
    let ok;
    if (I.bk === 'core' || I.block === 'core') ok = [RR.core_s];
    else if (I.bk === 'power') ok = [RR.olympic_s];
    else if (I.bk === 'resistance' || I.bk === 'focus') ok = [RR.hypertrophy_s, RR.strength_s, [RR.hypertrophy_s ? RR.hypertrophy_s[0] : 60, RR.hypertrophy_max_s || 180], RR.isolation_s];
    else if (I.bk === 'isolation') ok = [RR.isolation_s, RR.hypertrophy_s];
    else if (I.bucket === 'AP_THROW') ok = [RR.throw_s];
    else continue;
    S.n('rest_out_of_class');
    if (!inAny(r, ok)) S.hit('rest_out_of_class', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, 'rest ' + r.min + '-' + r.max + ' s on a ' + I.bk + ' item');
  }
}

function checkBalance(S, X, ctx) {
  const P = ctx.P; const BS = P.bilateral_share;
  const kitTok = new Set((X.kit && X.kit.tokens) || []), kitMach = new Set((X.kit && X.kit.machines) || []);
  const capOfKit = kitTok.size ? ctx.oneArmCapIn(e => ((e.equipment && e.equipment.any_of) || []).some(setup => setup.every(t => kitTok.has(t))) && (!(e.equipment && e.equipment.machine) || kitMach.has(e.equipment.machine))) : ctx.oneArmCap;
  const facts = { lower: [], upper: [] };
  const st = X.meta.share_targets;
  for (const region of ['lower', 'upper']) {
    const buckets = (BS.regions || {})[region] || [];
    const id = region === 'lower' ? 'laterality_error' : 'upper_laterality_error';
    let err = 0, blocks = 0, off = 0;
    for (const B of X.blocks) {
      if (!B.stairway || B.format === 'circuit') continue;
      const ebList = [...B.ebs.keys()];
      for (const [k, eb] of ebList.entries()) {
        let bi = 0, uni = 0, pinnedSets = 0; const movable = new Map();
        for (const W of B.ebs.get(eb)) for (const D of W.days) {
          // scorer 2.1 (R4-SES-05): a lower slot of a gym A / B / C or push / pull / legs day keeps the laterality the coach's template
          // names (skeleton_mismatch holds that), so it is no part of the share the laterality dial is judged on
          const SL = P.skeleton_laterality;
          const pinnedDay = region === 'lower' && !!D.raw.skeleton && (SL.skeleton_prefixes || []).some(pf => String(D.raw.skeleton).startsWith(pf));
          // scorer 2.2: three upper stations are two-arm lifts whatever the dial asks - the A day's first row ('horizontal pull,
          // bilateral'), the week's 'Chest / Shoulders' incline press (R4-SES-05) and the day's first chest press
          // (rules.selection.lead_press). They count in the share; the dial is judged on what the others could have reached.
          const LR = SL.lead_row || null;
          const leadRow = region === 'upper' && LR && (LR.skeletons || []).includes(D.raw.skeleton) ? D.units.find(V => V.bucket === LR.bucket && V.origin === 'template') : null;
          const CSx = P.selection_x1.chest_shoulders || null;
          const csRe = CSx ? new RegExp(CSx.incline_re) : null;
          const LPr = P.lead_press_rule && P.upper_dial_rule && P.upper_dial_rule.keep_lead_press !== false ? P.lead_press_rule : null;
          const leadPress = region === 'upper' && LPr ? D.units.find(V => (LPr.buckets || []).includes(V.bucket) && V.bk === 'resistance') : null;
          // scorer 2.3: a heavy-powerlifting profile's presses are two-arm presses whatever the dial asks (rules.selection.
          // powerlifting_presses, VOL-12 / UNI-02 - the engine's dial has always held them; scorer 2.2 counted them as free)
          // (and the incline-first slot: the vertical / mid-range push station of a bodybuilder, a general-population client or a
          // swimmer is a two-arm incline press - rules.selection.incline_first, R4-LIB-03; the library holds no one-arm one)
          const IFh = P.incline_first, IFc = (P.selection_x2 || {}).incline_first_hotspot_codes || [];
          const inclineOn = !!IFh && (((IFh.goals || []).includes(X.goal) && !(IFh.not_competitive && X.competitive)) || ctx.hotspotsOf(X.profile_id).some(h => IFc.includes(typeof h === 'string' ? h : h && h.code)));
          const inclineHeld = (V) => region === 'upper' && inclineOn && V.bucket === IFh.bucket;
          const PLp = P.powerlifting_presses_rule;
          const plPress = (V) => region === 'upper' && !!PLp && X.meta.derived && X.meta.derived.lift_style === PLp.lift_style && (PLp.buckets || []).includes(V.bucket);
          for (const U of D.units) {
            if (!buckets.includes(U.bucket) || (U.ex && U.ex.exercise_class !== 'compound')) continue;
            if (pinnedDay && U.origin === 'template' && (SL.laterality_of_bucket || {})[U.bucket]) { pinnedSets += U.sets; continue; }
            const one = U.laterality === 'unilateral' || U.laterality === 'alternating';
            if (one) uni += U.sets; else bi += U.sets;
            if (region === 'upper') {
              const held = !one && ((leadRow && U === leadRow) || (leadPress && U === leadPress) || plPress(U) || inclineHeld(U) || (csRe && U.bucket === CSx.bucket && U.ex && csRe.test(U.ex.id)));
              if (!held) { const m = movable.get(U.slot) || { sets: 0, bucket: U.bucket, one }; m.sets += U.sets; movable.set(U.slot, m); }
            }
          }
        }
        // (a block whose lower compound sets are all on the template's own slots has no dial to judge)
        if (region === 'lower' && pinnedSets > 0 && pinnedSets >= 3 * (bi + uni)) continue;
        const tgtList = st && st[region] && st[region].by_exercise_block;
        if (!tgtList || !tgtList.length || bi + uni === 0) continue;
        const target = tgtList[Math.min(k, tgtList.length - 1)];   // meta.share_targets already carries the pain shift (pain_shift is reported beside it)
        if (typeof target !== 'number') continue;
        const share = bi / (bi + uni);
        blocks++; S.n(id);
        // (scorer 2.2, upper: the distance is read from the closest share the stations the dial may turn could reach)
        let dist = Math.abs(share - target), reach = null;
        if (region === 'upper' && movable.size <= 14) {
          // every station the dial may turn, two-arm or one-arm - a pattern never holds more one-arm stations in a week than the
          // library holds different one-arm lifts for it (ctx.oneArmCap; the engine's own bound, UNI-07)
          const mv = [...movable.values()];
          const held = (bi + uni) - sum(mv.map(m => m.sets));          // sets of the stations held two-arm
          const nowOne = {}; for (const m of mv) if (m.one) nowOne[m.bucket] = (nowOne[m.bucket] || 0) + 1;
          let best = share;
          for (let mask = 0; mask < (1 << mv.length); mask++) {
            let b2 = held; const cnt = {}; let ok = true;
            for (let i = 0; i < mv.length; i++) { if ((mask >> i) & 1) cnt[mv[i].bucket] = (cnt[mv[i].bucket] || 0) + 1; else b2 += mv[i].sets; }
            for (const [bk, n] of Object.entries(cnt)) if (n > Math.max(capOfKit[bk] ?? Infinity, nowOne[bk] || 0)) { ok = false; break; }
            if (!ok) continue;
            const sh = b2 / (bi + uni);
            if (Math.abs(sh - target) < Math.abs(best - target) - EPS) best = sh;
          }
          reach = best;
          dist = Math.max(0, Math.abs(share - target) - Math.abs(best - target));
        }
        const e = Math.max(0, dist - (BS.tolerance || 0.03));
        err += e;
        const isOff = dist > (BS.validate_tolerance || 0.12) + EPS;
        if (isOff) { off++; S.hit(id, { block: B.n, exercise_block: eb }, region + ' bilateral share ' + r2(share) + ' against ' + r2(target) + (reach !== null && Math.abs(reach - target) > EPS ? ' (closest the template allows: ' + r2(reach) + ')' : ''), { value: r2(share), limit: r2(target) }); }
        facts[region].push({ block: B.n, exercise_block: eb, share: r2(share), target: r2(target), off: isOff, ...(reach !== null ? { reach: r2(reach) } : {}) });
      }
    }
    if (blocks) S.extra(id, { blocks, blocks_off: off, summed_error: r2(err) });
  }
  // T8-BAL-03 push : pull
  const pushFocus = X.focusGroups.some(g => g === 'chest' || g === 'shoulders' || g === 'triceps');
  for (const W of X.weeks) {
    if (!W.stairway) continue;
    let push = 0, pull = 0;
    // (scorer 2.2: a press and a pull are what the model's own balance rule names - rules.volume.push_pull: the pressing classes,
    // a high-incline press among them, against the rows and vertical pulls; a fly is a chest isolation exercise, as a reverse fly
    // was never a pull. Scorer 2.1 read the library's pattern column, which files the three flyes under 'horizontal push'.)
    const PPc = P.push_pull_rule;
    const dirOf = (U) => {
      if (!PPc) return direction(U);
      const cc = U.ex && U.ex.credit_class;
      return (PPc.push_classes || []).includes(cc) ? 'push' : (PPc.pull_classes || []).includes(cc) ? 'pull' : null;
    };
    for (const D of W.days) for (const U of D.units) { const d = dirOf(U); if (d === 'push') push += U.sets; else if (d === 'pull') pull += U.sets; }
    if (push <= 0 || pushFocus) continue;
    S.n('push_pull_ratio');
    if (pull < 0.8 * push - EPS) S.hit('push_pull_ratio', { week: W.n }, 'pull ' + pull + ' against push ' + push + ' (' + r2(pull / push) + ')');
  }
  return facts;
}

// ----------------------------------------------------------------------------------------------------------------------
// The v0.5 rules (design/ENGINE_V05_PLAN.md): the coach's templates, the library, the words - and no time fitting
// ----------------------------------------------------------------------------------------------------------------------

/** does the client's kit hold this exercise? (an empty kit list = not told: every exercise counts as available) */
function kitHolds(ex, X) {
  const tokens = new Set(X.kit.tokens || []), machines = new Set(X.kit.machines || []);
  if (!tokens.size) return true;
  return (ex.equipment.any_of || []).some(setup => setup.every(t => tokens.has(t))) && (!ex.equipment.machine || machines.has(ex.equipment.machine));
}

/**
 * COACH-R4 R4-SES-05 / R4-SES-04. Read from the TEMPLATE the plan names (never from what the day says about itself):
 *   1. a template A / B day is the coach's day - slots 1-4 in his order (and biceps + leg extension / triceps + leg curl on the
 *      gym days); a skeleton day holds only its patterns (A: pull + knee, B: push + hip, push / pull / legs);
 *   2. the plan day names its template's skeleton;
 *   3. every lift of the day comes from the template, inside its slot's pattern, the compounds in the coach's order;
 *   4. in a stairway week every counted lift of the template is there (nothing dropped), unless the day states a reason, the
 *      slot's group is said to be credit only, or the kit holds no exercise for the slot.
 */
function checkTemplate(S, X, ctx) {
  const P = ctx.P;
  const pat = (b) => P.pattern_of_bucket[b] || b;
  const tpl = X.meta.template || {};
  const never = P.addons.never_pick_statuses || [];
  const judged = new Set();
  const facts = { id: (X.meta.template && X.meta.template.id) || null, variant: (X.meta.template && X.meta.template.variant) || null, skeleton_days: 0, days_without_a_skeleton: 0, template_days_judged: [] };
  for (const W of X.weeks) {
    const B = X.blocks.find(b => b.n === W.tb);
    for (const D of W.days) {
      if (!D.main) continue;
      const dt = ctx.templateDay(tpl, D.raw.day_type);
      if (!dt) continue;
      const where = { week: W.n, weekday: D.weekday };
      const skel = dt.skeleton || null;
      const lifts = dt.stations.filter(st => P.lift_blocks.includes(st.block));
      if (skel) {
        facts.skeleton_days++;
        if (!judged.has(D.raw.day_type)) {
          judged.add(D.raw.day_type); facts.template_days_judged.push(D.raw.day_type + ':' + skel);
          S.n('skeleton_mismatch');
          const rp = lifts.filter(st => /^RP_/.test(st.bucket)).map(st => st.bucket);
          const ab = P.skeleton_day_of[skel];
          const allowed = P.skeleton_patterns[skel];
          if (ab && P.ab_compound_slots[ab].some((b, i) => rp[i] !== b)) S.hit('skeleton_mismatch', { day_type: D.raw.day_type }, 'template day ' + D.raw.day_type + ' (' + skel + '): compound slots ' + rp.slice(0, 4).join(', ') + '; the coach\'s Day ' + ab + ' is ' + P.ab_compound_slots[ab].join(', '), { kind: 'template_not_the_coachs' });
          else if (ab && P.skeleton_gym.includes(skel) && P.ab_small_slots[ab].some((b, i) => lifts.filter(st => !/^RP_/.test(st.bucket)).map(st => st.bucket)[i] !== b)) S.hit('skeleton_mismatch', { day_type: D.raw.day_type }, 'template day ' + D.raw.day_type + ' (' + skel + '): slots 5-6 are not ' + P.ab_small_slots[ab].join(', '), { kind: 'template_not_the_coachs' });
          else if (allowed && lifts.some(st => /^RP_/.test(st.bucket) && !allowed.includes(pat(st.bucket)))) S.hit('skeleton_mismatch', { day_type: D.raw.day_type }, 'template day ' + D.raw.day_type + ' (' + skel + ') holds a compound outside ' + allowed.join(' + '), { kind: 'template_pattern' });
        }
        if (!X.edited) {
          S.n('skeleton_mismatch');
          if ((D.raw.skeleton || null) !== skel) S.hit('skeleton_mismatch', where, 'the day says skeleton ' + (D.raw.skeleton || 'none') + ', its template day is ' + skel, { kind: 'skeleton_not_named' });
          const idx = new Map(dt.stations.map((st, i) => [st.id, { st, i }]));
          let last = -1;
          for (const I of D.items) {
            if (!P.lift_blocks.includes(I.block) || I.origin !== 'template' || I.isTest) continue;
            S.n('skeleton_mismatch');
            const hit = idx.get(I.raw.station_id);
            if (!hit) { S.hit('skeleton_mismatch', { ...where, slot_id: I.raw.slot_id }, I.raw.exercise_id + ' fills no station of the template day', { kind: 'lift_not_in_template' }); continue; }
            // scorer 2.1 (R4-SES-05): on a gym A / B / C or push / pull / legs day a two-leg slot holds a two-leg lift and a single-leg
            // slot a single-leg lift, in every exercise block (a pain swap or a kit stand-in is not judged)
            const SL = P.skeleton_laterality;
            // (scorer 2.3, rules.selection.skeleton_laterality.x2_free: for a change-of-direction sport the third day's non-axial
            // two-leg knee slot follows the dial - UNI-02 / UNI-03; R4-SES-05 names the A day's squat and the B day's hinge)
            const FRs = SL.x2_free, prof = (ctx.sportOf ? ctx.sportOf(X) : null);
            const freeS = !!FRs && !!prof && !!prof.cod_sport && (FRs.skeletons || []).includes(skel) && (FRs.buckets || []).includes(hit.st.bucket) && hit.st.role !== 'work' && hit.st.axial !== 'axial';
            const wantLat = !freeS && (SL.skeleton_prefixes || []).some(pf => String(skel).startsWith(pf)) ? (SL.laterality_of_bucket || {})[hit.st.bucket] : null;
            if (wantLat && I.ex && !(I.raw.flags || []).some(f => P.skeleton_laterality_exempt_flags.includes(f))) {
              const uniLat = (SL.unilateral_lateralities || ['unilateral', 'alternating']).includes(I.ex.laterality);
              if (wantLat === 'unilateral' ? !uniLat : I.ex.laterality !== 'bilateral') S.hit('skeleton_mismatch', { ...where, slot_id: I.raw.slot_id }, I.raw.exercise_id + ' (' + I.ex.laterality + ') in the ' + hit.st.bucket + ' slot', { kind: 'slot_laterality' });
            }
            if (pat(I.bucket) !== pat(hit.st.bucket)) S.hit('skeleton_mismatch', { ...where, slot_id: I.raw.slot_id }, I.raw.exercise_id + ' (' + I.bucket + ') in the ' + hit.st.bucket + ' slot', { kind: 'slot_pattern' });
            else if (/^RP_/.test(hit.st.bucket) && P.tests_x1.tested_lift_first && (I.raw.flags || []).includes('back_off')) { /* the tested lift opens the day's lifts (R2-PER-07) */ }
            else if (/^RP_/.test(hit.st.bucket)) { if (hit.i < last) S.hit('skeleton_mismatch', { ...where, slot_id: I.raw.slot_id }, I.raw.exercise_id + ' (' + hit.st.bucket + ') out of the coach\'s order', { kind: 'slot_order' }); else last = hit.i; }
          }
        }
      } else facts.days_without_a_skeleton++;
      if (!W.stairway || !X.size || X.edited) continue;
      const planned = Math.min(X.size.range[1], Math.max(X.size.range[0], typeof dt.count === 'number' ? dt.count : X.size.default));
      const said = (D.raw.why || []).some(y => y && P.absent_ok_whys.includes(y.key));
      const have = new Set(D.items.map(I => baseSlot(String(I.raw.station_id || ''))));
      for (const st of lifts) {
        if (typeof st.rank !== 'number' || st.rank > planned || st.bucket === 'FOCUS' || st.condition) continue;
        S.n('template_lift_missing');
        if (have.has(st.id) || said) continue;
        if ((st.group && B && B.creditOnly.includes(st.group)) || !ctx.bySlot(st.bucket).some(e => !never.includes(e.status) && kitHolds(e, X))) continue;
        S.hit('template_lift_missing', where, 'template station ' + st.id + ' (' + st.bucket + ', rank ' + st.rank + ' of ' + planned + ') is not in the day and the day states no reason', { station: st.id, slot: st.bucket });
      }
    }
  }
  return facts;
}

/**
 * The library and the words (COACH-CT CT-01; COACH-R4 R4-LIB-01 / 02 / 03 / 05, R4-PRG-03, R4-SES-04, R4-SCP-02), each recounted
 * from the plan's own items.
 */
function checkLibraryAndWords(S, X, ctx, plan) {
  const P = ctx.P;
  // ---- CT-01 / R4-SES-01: nothing of the time check is left in the plan
  S.n('time_fields');
  const tf = [];
  if (plan.time_check !== undefined && plan.time_check !== null) tf.push('plan.time_check');
  if (Array.isArray(plan.offers) && plan.offers.length) tf.push('plan.offers');
  if (X.meta.session_minutes !== undefined && X.meta.session_minutes !== null) tf.push('meta.session_minutes');
  if (X.derived.session_minutes !== undefined && X.derived.session_minutes !== null) tf.push('meta.derived.session_minutes');
  if (X.meta.time !== undefined && X.meta.time !== 'estimate_only') tf.push('meta.time = ' + X.meta.time);
  for (const w of X.warnings) if (w && (P.time_warning_codes.includes(w.code) || /^(warning\.(time_|long_day|test_day_long|supersets_needed)|offer\.)/.test(String(w.key)))) tf.push('warning ' + (w.code || w.key));
  for (const W of X.weeks) for (const D of W.days) for (const k of ['minutes_limit', 'supersets_needed']) if (D.raw[k] !== undefined && D.raw[k] !== null) tf.push('week ' + W.n + ' ' + D.weekday + ' ' + k);
  for (const x of tf) S.hit('time_fields', {}, x);

  // ---- R4-SCP-02: the liability gate (the release was accepted before the plan was built)
  S.n('liability_gate');
  const st = plan.release_stamp;
  const role = (X.meta.health && X.meta.health.role) || (st && st.role) || 'self';
  const youthAge = (P.levels && P.levels.youth_age) || 18;
  const want = X.age !== null && X.age < youthAge ? 'release.minor' : role === 'client' ? 'release.coach' : 'release.client';
  if (!st) S.hit('liability_gate', {}, 'no release stamp');
  else if (st.accepted !== true) S.hit('liability_gate', {}, 'the release stamp does not say the release was accepted');
  else if (st.version !== want) S.hit('liability_gate', {}, 'release ' + st.version + ', expected ' + want);
  else if (want === 'release.minor' && st.guardian !== true) S.hit('liability_gate', {}, 'a minor\'s plan without a guardian\'s acceptance');

  const A = P.addons;
  const never = A.never_pick_statuses || [], hidden = A.not_shown_statuses || [];
  const tpl = X.meta.template || {};
  const stationVariant = (D, I) => { const dt = ctx.templateDay(tpl, D.raw.day_type); const s0 = dt && dt.stations.find(x => x.id === I.raw.station_id); return s0 ? s0.variant || null : null; };
  const primaryOk = (ex, bucket, variant) => ex.status === A.addon_status && (A.primary_exceptions || []).some(x => x.enabled !== false && (x.ids || []).includes(ex.id) && x.bucket === bucket && (!x.variants || x.variants.includes(variant)) && (!x.families || x.families.includes(X.family)));
  const C = P.carry;
  const isCarry = (ex) => !!ex && (((ex.tags || []).includes(C.tag)) || (C.patterns || []).includes(ex.pattern));
  const badVideo = (v) => !!v && !(v.kind === 'coach' || (v.kind === 'search' && typeof v.url === 'string' && v.url.startsWith(P.video_search_url)));
  const E = P.easy_to_remove || {};

  for (const W of X.weeks) for (const D of W.days) {
    const firstAth = D.items.find(I => I.block === 'athletic');
    for (const I of D.items) {
      const it = I.raw, ex = I.ex, where = { week: W.n, weekday: D.weekday, slot_id: it.slot_id };
      const byPerson = it.origin === 'edit' || it.edited === true;
      // ---- R4-LIB-01: optional add-ons are never the template's pick
      if (ex && !byPerson) {
        S.n('addon_picks');
        if (never.includes(ex.status) && !primaryOk(ex, I.bucket, stationVariant(D, I))) S.hit('addon_picks', where, ex.id + ' (' + ex.status + ') placed in ' + I.bucket, { kind: 'pick' });
        // (scorer 2.3, R4-LIB-01 / R4-LIB-02: a carry or sled exercise is a pick only in its approved programs, whatever its status)
        else if (isCarry(ex) && !primaryOk(ex, I.bucket, stationVariant(D, I)) && !['COND_CIRCUIT', 'COND_WOD'].includes(I.bucket)) S.hit('addon_picks', where, ex.id + ' (a carry) placed in ' + I.bucket, { kind: 'carry_pick' });
      }
      for (const id of (it.wod && it.wod.stations) || []) { const e = ctx.ex(id); if (!e) continue; S.n('addon_picks'); if (never.includes(e.status) && !primaryOk(e, I.bucket, stationVariant(D, I))) S.hit('addon_picks', where, id + ' (' + e.status + ') in a WOD', { kind: 'wod_station' }); }
      for (const id of it.swaps || []) { const e = ctx.ex(id); if (e && hidden.includes(e.status)) { S.n('addon_picks'); S.hit('addon_picks', where, id + ' (' + e.status + ') among the swaps', { kind: 'not_shown' }); } }
      // ---- R4-LIB-05: a search link, never somebody's video
      if (it.video !== undefined && it.video !== null) { S.n('video_links'); if (badVideo(it.video)) S.hit('video_links', where, 'video kind ' + it.video.kind + ' ' + String(it.video.url).slice(0, 60)); }
      // ---- R4-PRG-03: the progression rule
      const pr = it.progression;
      if (pr !== undefined && pr !== null) {
        S.n('progression_rule_missing');
        if (pr.promised_numbers !== false || 'weeks' in pr || 'by_week' in pr || 'targets' in pr) S.hit('progression_rule_missing', where, 'a number is promised for a week', { kind: 'promise' });
        else if (!Array.isArray(pr.rep_range) || !P.progression_kinds.includes(pr.kind)) S.hit('progression_rule_missing', where, 'a rule of an unknown shape (' + pr.kind + ')', { kind: 'shape' });
      }
      const reps = it.reps;
      if (!byPerson && RES_KINDS.includes(I.bk) && I.role !== 'prehab' && !I.isTest && I.sets > 0 && !it.circuit && reps && ['range', 'fixed', 'per_side'].includes(reps.type)) {
        S.n('progression_rule_missing');
        const lo = typeof reps.min === 'number' ? reps.min : reps.value, hi = typeof reps.max === 'number' ? reps.max : lo;
        if (!pr) S.hit('progression_rule_missing', where, it.exercise_id + ' has no progression rule', { kind: 'missing' });
        else if (Array.isArray(pr.rep_range) && (pr.rep_range[0] !== lo || pr.rep_range[1] !== hi)) S.hit('progression_rule_missing', where, it.exercise_id + ': the rule says ' + pr.rep_range.join('-') + ', the dose ' + lo + '-' + hi, { kind: 'range' });
      }
      // ---- R4-LIB-02: carries and sled work by distance or time, no muscle sets
      if (isCarry(ex)) {
        S.n('carry_dose');
        if (Object.keys(I.credits).length) S.hit('carry_dose', where, ex.id + ' is credited as muscle sets', { kind: 'credits' });
        else if (reps && ['range', 'fixed', 'per_side', 'max', 'myo'].includes(reps.type)) S.hit('carry_dose', where, ex.id + ' is counted in reps', { kind: 'reps' });
        else if (!it.circuit && !it.wod && !(reps && ['rounds_work', 'minutes'].includes(reps.type)) && !byPerson) {
          const okDose = reps && ((reps.type === 'distance_or_time' && Array.isArray(reps.metres) && reps.metres[0] >= C.metres[0] && reps.metres[1] <= C.metres[1] && Array.isArray(reps.seconds) && reps.seconds[0] >= C.seconds[0] && reps.seconds[1] <= C.seconds[1]) ||
            (reps.type === 'seconds' && reps.min >= C.seconds[0] && reps.max <= C.seconds[1]));
          if (!okDose) S.hit('carry_dose', where, ex.id + ' is not dosed at ' + C.metres.join('-') + ' m or ' + C.seconds.join('-') + ' s', { kind: 'dose' });
          else if (typeof it.sets === 'number' && (it.sets < C.trips[0] || it.sets > C.trips[1])) S.hit('carry_dose', where, ex.id + ' at ' + it.sets + ' trips (' + C.trips.join('-') + ')', { kind: 'trips' });
        }
      }
    }
    // ---- R4-SES-04: the easy-to-remove list is a hint - nothing the rule always keeps, nothing that is not in the day
    const list = D.raw.easy_to_remove;
    if (Array.isArray(list)) for (const x of list) {
      S.n('easy_to_remove_invalid');
      const I = x && D.items.find(y => y.raw.slot_id === x.slot_id);
      if (!I) { if (!X.edited) S.hit('easy_to_remove_invalid', { week: W.n, weekday: D.weekday }, 'lists ' + (x && x.slot_id) + ', which is not in the day', { kind: 'not_in_day' }); continue; }
      if (I.block === 'core' || (E.always_keep || []).includes(I.role) || I === firstAth) S.hit('easy_to_remove_invalid', { week: W.n, weekday: D.weekday, slot_id: x.slot_id }, 'lists ' + I.raw.exercise_id + ' (' + I.role + ', ' + I.block + '), which the rule always keeps', { kind: 'always_keep' });
      else if ((E.order || []).length && !E.order.includes(x.kind)) S.hit('easy_to_remove_invalid', { week: W.n, weekday: D.weekday, slot_id: x.slot_id }, 'kind ' + x.kind, { kind: 'kind' });
    }
  }
  for (const a of Array.isArray(X.meta.addons) ? X.meta.addons : []) {
    const e = a && ctx.ex(a.exercise_id);
    S.n('addon_picks');
    if (!e || e.status !== A.addon_status || hidden.includes(e.status)) S.hit('addon_picks', {}, 'offered add-on ' + (a && a.exercise_id) + ' is not an optional add-on', { kind: 'offered' });
    if (a && a.video !== undefined && a.video !== null) { S.n('video_links'); if (badVideo(a.video)) S.hit('video_links', {}, 'offered add-on ' + a.exercise_id + ': video kind ' + a.video.kind); }
  }
  // any third-party video link anywhere in the plan
  S.n('video_links');
  const re = new RegExp(P.video_forbidden_re, 'i');
  const found = [];
  const walk = (o, path, depth) => {
    if (typeof o === 'string') { if (re.test(o)) found.push(path); return; }
    if (!o || typeof o !== 'object' || depth > 12) return;
    if (Array.isArray(o)) o.forEach((v, i) => walk(v, path + '[' + i + ']', depth + 1));
    else for (const k of Object.keys(o)) if (k !== 'validation') walk(o[k], path ? path + '.' + k : k, depth + 1);
  };
  walk(plan, '', 0);
  for (const p of found) S.hit('video_links', {}, 'a third-party video link at ' + p, { kind: 'third_party' });

  // ---- R4-LIB-03: incline pressing first for bodybuilding and general-population plans (soft: 'bias', overhead stays)
  const IF = P.incline_first;
  const facts = { incline: [] };
  if (IF && (IF.goals || []).includes(X.goal) && !(IF.not_competitive && X.competitive) && !X.edited) {
    const reI = new RegExp(IF.incline_re || 'incline');
    const inKit = ctx.bySlot(IF.bucket).some(e => reI.test(e.id) && !never.includes(e.status) && kitHolds(e, X));
    for (const B of X.blocks) {
      let picks = 0, incline = 0;
      for (const W of B.weeks) for (const D of W.days) {
        if (!D.main) continue;
        for (const I of D.items) {
          // (the class model's work press, circuit stations and a pick swapped to protect a pain area are not read)
          if (I.bucket !== IF.bucket || !I.ex || I.origin !== 'template' || I.isTest || I.role === 'work' || I.block === 'circuit' || (I.raw.flags || []).includes('pain_swap')) continue;
          picks++; if (reI.test(I.ex.id) || (I.ex.tags || []).includes(IF.tag)) incline++;
        }
      }
      if (!picks) continue;
      facts.incline.push({ block: B.n, picks, incline, in_kit: inKit });
      if (!inKit) continue;
      S.n('incline_share');
      if (incline < picks * P.incline_majority - EPS) S.hit('incline_share', { block: B.n }, incline + ' of ' + picks + ' picks of the vertical / mid-range push slot are incline or mid-range presses', { value: r2(incline / picks), limit: P.incline_majority });
    }
  }
  return facts;
}

// ----------------------------------------------------------------------------------------------------------------------
// scorePlan
// ----------------------------------------------------------------------------------------------------------------------

/**
 * @param {object} plan a plan/2 JSON
 * @param {object} ctx makeContext(model)
 * @param {{intake?:object, determinism?:boolean|null, params?:object}} [opts]
 *        determinism: true when the runner generated the plan twice and the bytes were equal, false when not, null / absent when
 *        not checked; params: named parameter overrides for this call
 * @returns {object} bench-score/2
 */
export function scorePlan(plan, ctx, opts = {}) {
  if (opts.params && Object.keys(opts.params).length) { const { P, src } = resolveParams(ctx.R, opts.params); ctx = { ...ctx, P, param_sources: src }; }
  const id = (opts.intake && opts.intake.id) || (plan && plan.meta && plan.meta.program_id) || null;
  const out = { schema: SCORE_SCHEMA, scorer_version: SCORER_VERSION, id, status: plan ? plan.status : null, scored: false };
  if (!plan || plan.schema !== 'plan/2') return { ...out, error: 'not a plan/2 object', score: null };
  if (plan.status !== 'ok' || !(plan.weeks || []).length) return { ...out, score: null, error: 'status ' + plan.status + ' (no weeks to score)', refer: plan.refer || null, errors: plan.errors || [] };

  const S = sheet();
  const X = readPlan(plan, ctx);
  checkSystemSafety(S, X, ctx, plan);
  checkTallies(S, X, ctx);
  checkSessionStructure(S, X, ctx);
  const floors = checkFloorsAndGroups(S, X, ctx);
  const stair = checkStairway(S, X, ctx);
  checkExerciseBlocks(S, X, ctx);
  checkCounts(S, X, ctx);
  checkPlacementPairs(S, X, ctx);
  const template = checkTemplate(S, X, ctx);
  const words = checkLibraryAndWords(S, X, ctx, plan);
  const athletic = checkAthletic(S, X, ctx);
  checkEffortRest(S, X, ctx);
  const balance = checkBalance(S, X, ctx);
  // set by the runner
  if (opts.determinism === true || opts.determinism === false) { S.n('determinism'); if (!opts.determinism) S.hit('determinism', {}, 'two runs of the same intake gave different plan bytes'); }
  // info values from the sheet
  if (floors.said_below.weeks) S.set('below_floor_deficit', r2(floors.said_below.deficit / floors.said_below.weeks), null);
  const cs = stair.filter(b => typeof b.ceiling_shortfall === 'number');
  if (cs.length) { S.set('ceiling_shortfall', r2(sum(cs.map(b => b.ceiling_shortfall))), null); S.set('group_balance', Math.max(...cs.map(b => b.progress_spread || 0)), null); }

  // ---- the sheet -> metrics, points, acceptance
  const metrics = {};
  const violations = [];
  let lost = 0, hard = 0;
  const lostByTier = {};
  for (const def of METRICS) {
    const r = S.rows.get(def.id);
    if (!r.measured) continue;
    const value = r.value !== null ? r.value : r.count;
    const sev = r.sev !== null ? r.sev : (r.count > 0 ? Math.sqrt(Math.min(1, r.count / Math.max(1, r.n))) : 0);
    const pts = def.report_only ? 0 : r4(def.pts * sev);
    const pass = def.report_only ? null : r.count === 0;
    metrics[def.id] = { rule: def.rule, tier: def.tier, kind: def.kind, unit: def.unit, value, checked: r.n, pass, lost: pts, ...(r.extra ? { detail: r.extra } : {}), ...(r.violations.length ? { violations: r.violations, ...(r.count > r.violations.length ? { violations_truncated: r.count - r.violations.length } : {}) } : {}) };
    lost += pts;
    lostByTier['T' + def.tier] = r4((lostByTier['T' + def.tier] || 0) + pts);
    // A1: every hard / hard_conditional metric, each violation once
    if ((def.kind === 'hard' || def.kind === 'hard_conditional') && !def.report_only && !def.subset_of) hard += r.count;
    for (const v of r.violations) violations.push({ metric: def.id, rule: def.rule, tier: def.tier, kind: def.kind, ...v });
  }
  const acceptance = {};
  for (const a of ACCEPTANCE) {
    if (a.id === 'A1') { acceptance.A1 = { name: a.name, value: hard, pass: hard === 0 }; continue; }
    const ms = a.metrics.filter(k => metrics[k]);
    if (!ms.length) { acceptance[a.id] = { name: a.name, value: null, pass: null }; continue; }
    const v = sum(ms.map(k => (typeof metrics[k].value === 'number' && METRIC_BY_ID.get(k).unit !== 'ratio' ? (S.rows.get(k).count) : 0)));
    acceptance[a.id] = { name: a.name, value: v, pass: v === 0, by_metric: Object.fromEntries(ms.map(k => [k, S.rows.get(k).count])) };
  }
  const top = Object.entries(metrics).filter(([, v]) => v.lost > 0).sort((a, b) => b[1].lost - a[1].lost).slice(0, 8).map(([k, v]) => ({ metric: k, lost: v.lost, value: v.value, checked: v.checked }));

  return {
    ...out, scored: true,
    score: r2(Math.max(0, 100 - lost)),
    points_lost: r2(lost), points_lost_by_tier: lostByTier,
    hard_violations: hard,
    acceptance_pass: Object.values(acceptance).every(a => a.pass !== false),
    acceptance,
    top_deductions: top,
    facts: {
      family: X.family, goal: X.goal, format: X.format, level: X.level, competitive: X.competitive, profile: X.profile_id, template: X.meta.template || null,
      days_per_week: X.days_per_week, session_size: X.size ? { type: X.size.type, range: X.size.range, default: X.size.default } : null, two_day: floors.two_day, weeks: X.weeks.length, age: X.age, edited: X.edited,
      blocks: X.blocks.map(B => ({ n: B.n, type: B.type, weeks: [B.weeks[0].n, B.weeks[B.weeks.length - 1].n], format: B.format, trained: B.trained, credit_only: B.creditOnly, said_below_floor: B.saidBelow, capped: B.capped.map(x => x.group + ':' + x.held + '/' + x.planned) })),
      floors: floors.blocks, stairway: stair, template, incline: words.incline, athletic, laterality: balance
    },
    metrics,
    violations
  };
}

// ----------------------------------------------------------------------------------------------------------------------
// Corpus roll-up, comparison, determinism
// ----------------------------------------------------------------------------------------------------------------------

/** byte equality of two generations of one intake (the runner serializes; the scorer only compares) */
export function sameBytes(jsonA, jsonB) { return typeof jsonA === 'string' && jsonA === jsonB; }

/**
 * @param {Array<object>} scores bench-score/2 objects (unscored ones - refer / invalid - are counted apart)
 * @returns {object} the acceptance table A1-A14 on the corpus, metric totals, the score distribution
 */
export function aggregate(scores) {
  const scored = scores.filter(s => s && s.scored);
  const q = (arr, p) => { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.max(0, Math.ceil(p * a.length) - 1))]; };
  const sc = scored.map(s => s.score);
  const metrics = {};
  for (const def of METRICS) {
    let value = 0, checked = 0, plans = 0, lost = 0, measured = 0;
    for (const s of scored) { const mm = s.metrics[def.id]; if (!mm) continue; measured++; checked += mm.checked || 0; lost += mm.lost || 0; if (def.unit === 'ratio' || (def.report_only && typeof mm.value === 'number' && !(mm.violations || []).length && !mm.violations_truncated)) { value += mm.value; } else { const c = (mm.violations || []).length + (mm.violations_truncated || 0); value += c; if (c > 0) plans++; } }
    if (!measured) continue;
    metrics[def.id] = { rule: def.rule, tier: def.tier, kind: def.kind, unit: def.unit, pts: def.pts, acc: def.acc, bench: def.bench, report_only: def.report_only, measured_on: measured, total: def.unit === 'ratio' ? r2(value / measured) : r2(value), mean_per_plan: r2(value / measured), checked, plans_failing: plans, points_lost: r2(lost) };
  }
  const acceptance = {};
  for (const a of ACCEPTANCE) {
    const rows = scored.map(s => s.acceptance[a.id]).filter(x => x && x.value !== null && x.value !== undefined);
    if (!rows.length) { acceptance[a.id] = { name: a.name, rule: a.pass, value: null, pass: null, plans_failing: null, note: 'not measured on this corpus' }; continue; }
    const total = sum(rows.map(x => x.value));
    const failing = rows.filter(x => x.pass === false).length;
    let pass = total === 0, shown = total, note;
    if (a.id === 'A13') { let blocks = 0, off = 0; for (const s of scored) { const d = s.metrics.laterality_error && s.metrics.laterality_error.detail; if (d) { blocks += d.blocks; off += d.blocks_off; } } const within = blocks ? (blocks - off) / blocks : 1; pass = within >= 0.95 - EPS; shown = r4(within); note = (blocks - off) + ' of ' + blocks + ' exercise blocks within 0.12'; }
    acceptance[a.id] = { name: a.name, rule: a.pass, value: shown, pass, plans_failing: failing, measured_on: rows.length, ...(note ? { note } : {}) };
  }
  const byTier = {};
  for (const s of scored) for (const [t, v] of Object.entries(s.points_lost_by_tier || {})) byTier[t] = r2((byTier[t] || 0) + v);
  for (const t of Object.keys(byTier)) byTier[t] = r2(byTier[t] / Math.max(1, scored.length));
  return {
    plans: scores.length, scored: scored.length, not_scored: scores.filter(s => !s || !s.scored).map(s => ({ id: s && s.id, status: s && s.status, error: s && s.error })),
    score: { mean: sc.length ? r2(sum(sc) / sc.length) : null, median: q(sc, 0.5), p10: q(sc, 0.1), min: sc.length ? Math.min(...sc) : null, max: sc.length ? Math.max(...sc) : null },
    plans_passing_acceptance: scored.filter(s => s.acceptance_pass).length,
    plans_without_hard_violations: scored.filter(s => s.hard_violations === 0).length,
    hard_violations: sum(scored.map(s => s.hard_violations)),
    hard_violations_bench_rows: sum(scored.map(s => s.hard_violations_bench_rows || 0)),
    mean_points_lost_by_tier: byTier,
    acceptance, metrics
  };
}

/**
 * The regression rule: a change may not lower any plan's score. Scores of different scorer versions are not comparable
 * (run.mjs refuses to compare them).
 * @param {Array<{id:string, score:number}>} before @param {Array<{id:string, score:number}>} after @param {number} [tolerance]
 */
export function compareRuns(before, after, tolerance = 0.005) {
  const b = new Map(before.map(x => [x.id, x.score]));
  const rows = [];
  for (const x of after) { if (!b.has(x.id)) continue; const d = r2(x.score - b.get(x.id)); rows.push({ id: x.id, before: b.get(x.id), after: x.score, delta: d }); }
  return { compared: rows.length, lowered: rows.filter(r => r.delta < -tolerance), raised: rows.filter(r => r.delta > tolerance), mean_delta: rows.length ? r2(sum(rows.map(r => r.delta)) / rows.length) : 0, pass: !rows.some(r => r.delta < -tolerance) };
}

/** which metrics of an inventory (design/rules_as_constraints.json > metrics_index, written for engine 0.4) the scorer still covers */
export function coverage(metricsIndex) {
  const out = { implemented: [], not_measured: [], missing: [], rule_or_kind_differs: [] };
  for (const e of metricsIndex || []) {
    const d = METRIC_BY_ID.get(e.metric);
    if (d) { out.implemented.push(e.metric); if (d.rule !== e.rule && !METRICS.some(x => x.id === e.metric && x.rule === e.rule)) out.rule_or_kind_differs.push({ metric: e.metric, inventory: e.rule + ' / ' + e.kind, scorer: d.rule + ' / ' + d.kind }); }
    else if (NOT_MEASURED[e.metric]) out.not_measured.push({ metric: e.metric, rule: e.rule, why: NOT_MEASURED[e.metric] });
    else out.missing.push({ metric: e.metric, rule: e.rule });
  }
  out.bench_only = METRICS.filter(x => !(metricsIndex || []).some(e => e.metric === x.id)).map(x => x.id);
  return out;
}
