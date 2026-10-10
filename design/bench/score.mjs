// design/bench/score.mjs - the benchmark scorer: "the definition of done is outside the planner" (design/PLANNER_SPEC.md 12.1,
// 13.2; design/diagnosis.md DR-19). PURE: no I/O, no clock, no randomness, no import of engine/. It reads a plan/2 JSON and
// the model data (rules, catalog, templates as plain JSON) and nothing else.
//
//   const ctx   = makeContext({ rules, catalog, templates });            // model/*.json, parsed by the caller
//   const score = scorePlan(plan, ctx, { intake, determinism, params }); // one plan -> metrics, violations, 0-100
//   const all   = aggregate([score, ...]);                               // a corpus -> the acceptance table A1-A22
//
// What it computes. Every metric of design/rules_as_constraints.json > metrics_index that can be measured on ONE plan JSON
// (METRICS below; the ids are the inventory's), the extra acceptance metrics of PLANNER_SPEC 13.2 (A3, A7, A8, A10-A13, A17,
// A20), and a few bench-only diagnostics that name the reviewed failures of the brief (day_lost_pattern, athletic_flat,
// slack_while_untrained ...). Metrics that need a second run (another intake, a toggle, an exhaustive search) are listed in
// NOT_MEASURED with the reason; run.mjs adds the ones it can do with re-runs (determinism, offers).
//
// How it is written. From the coach's rules as the inventory states them, with its own tallies: credited sets per FOCUS group
// are recomputed from the items (DEF-02 ... 05), exercises per group per day are recounted (DEF-08), minutes are re-costed
// from the dosed items (DEF-09). The plan's own summary fields (main_sets_by_group, group_counts_by_day, est_minutes ...) are
// only compared against these. No exemption exists that is not a named parameter (PARAMS: the value, and the model path it
// was read from); a field the old engine does not write (time_check.pattern_stations, .overrun, weeks[].progression) is read
// as empty, so the 0.4 engine fails A3, A5, A8 and A10 by design of the measurement (PLANNER_SPEC 13.2 note 2).
//
// The 0-100 score. 100 minus the points lost. Each scored metric has a maximum it can cost (`pts`); it loses
// pts x sqrt(min(1, violations / opportunities)), so one broken week of 36 already shows (17 % of the points) and a rule
// broken everywhere costs all of them. The square root is the only shape choice; the points are the weights and sit in one
// table (METRICS). One metric is linear instead: `groups_out_for_time`, the objective of the policy (a group left out for time
// is legal; it costs its share of 8 points, so a plan that trains nobody cannot outscore a plan that trains its groups well).
// `hard_violations` (A1) and the acceptance table are exact counts and do not depend on the weights.

export const SCORER_VERSION = '1.0.0';
export const SCORE_SCHEMA = 'bench-score/1';

const EPS = 1e-9;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BUCKET_ALIASES = { ISO_HAM: 'ISO_LEG_FLEXION', 'RP.HD.ISO': 'ISO_LEG_FLEXION', CORE_OTHER: 'CORE_ANY' };
const RES_KINDS = ['resistance', 'isolation', 'focus'];
const BIG_MOVERS = ['hips', 'quads', 'back', 'chest'];
const MAX_LISTED = 60;   // violations kept per metric in the output (the count is always exact)

// ----------------------------------------------------------------------------------------------------------------------
// The metric registry. id = the inventory's metric id where one exists; rule, tier and kind are the inventory's
// (hard | hard_conditional | output | soft | objective). pts = the most the metric can cost on the 0-100 score (0 = counted,
// not scored: it repeats another metric on a different tally). acc = the acceptance row of PLANNER_SPEC 13.2 it feeds.
// Flags: bench = not in the inventory's metrics_index (an acceptance row or a reviewed failure of the brief);
// report_only = a value that is reported and never judged; subset_of = its hits are also hits of that metric (counted once in A1).
// ----------------------------------------------------------------------------------------------------------------------
const BENCH = { bench: true }, REPORT = { report_only: true };
const m = (id, rule, tier, kind, unit, pts, acc, what, flags = {}) => ({ id, rule, tier, kind, unit, pts, acc, what, bench: !!flags.bench, report_only: !!flags.report_only, subset_of: flags.subset_of || null });
export const METRICS = [
  // ---- T0 system, safety
  m('determinism', 'T0-SYS-01', 0, 'hard', 'bool', 10, 'A22', 'the same intake gives the same plan bytes (set by the runner)'),
  m('lifestyle_inputs', 'T0-SYS-02', 0, 'hard', 'count', 3, null, 'sleep / stress / job / life / check-in keys in the plan'),
  m('sex_inputs', 'T0-SYS-04', 0, 'hard', 'count', 3, null, 'sex / gender keys in the plan'),
  m('unexplained_decisions', 'T0-SYS-03', 0, 'output', 'count', 4, 'A17', 'a group not trained without a reason; a lowered peak without stopped_by; an overrun without a cause; an athletic family under 85 % of its target that is not told'),
  m('refer_or_release_violation', 'T0-SAFE-01', 0, 'hard', 'count', 6, null, 'a plan with weeks while a refer is set or the release is missing'),
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
  m('one_exercise_groups', 'T0-SES-10', 0, 'hard', 'count', 8, 'A5', '(week, main day, group) with exactly 1 exercise (or more than 4) that is not calves, a class lift or a listed kept movement'),
  m('calf_rule', 'T0-SES-11', 0, 'hard', 'count', 4, null, 'calves trained: leg days without exactly one calf exercise at 3+ sets; any day with two'),
  m('rear_delt_week', 'T0-SES-12', 0, 'hard', 'count', 3, null, 'weeks with shoulders trained and no rear-delt station and under 1.5 sets of row credit'),
  m('athlete_cap', 'T0-SES-13', 0, 'hard', 'count', 6, 'A13', 'athlete days with more than 12 counted exercises'),
  m('mid_block_changes', 'T0-SES-14', 0, 'hard', 'count', 4, null, 'exercises that change between weeks of one exercise block'),
  m('set_bounds', 'T0-SES-15', 0, 'hard', 'count', 4, null, 'resistance exercises outside 2 .. 4 / 5 sets (isolation and calves 4)'),
  m('illegal_supersets', 'T0-SES-16', 0, 'hard', 'count', 3, null, 'supersets of two lower compounds or of one muscle twice'),
  m('spacing_violation', 'T0-SES-17', 0, 'hard', 'count', 3, null, 'no OFF day; an optional / aerobic day on a play or game day; the hardest day inside 48 h of a game'),
  // ---- T0 effort, stairway hard limits, tests, athletic safety
  m('rir_violation', 'T0-EFF-01', 0, 'hard', 'count', 3, null, 'weeks with planned RIR outside the band or rising inside a stairway'),
  m('intensifier_violation', 'T0-EFF-02', 0, 'hard', 'count', 3, null, 'intensifiers outside the last stairway week, more than one a day, or on an ineligible item'),
  m('rest_out_of_class', 'T0-EFF-03', 0, 'hard', 'count', 2, null, 'items whose rest is outside every range of its class'),
  m('survival_cut', 'T0-EFF-06', 0, 'hard', 'count', 2, null, 'strength-family days without their survival item'),
  m('deload_inside_block', 'T0-STW-01', 0, 'hard', 'count', 4, null, 'stairway blocks with a gap in their stair weeks'),
  m('planned_step_over', 'T0-STW-02', 0, 'hard', 'count', 4, null, 'line-weeks with a planned step above 7 %'),
  m('weekly_rise_over', 'T0-STW-03', 0, 'hard', 'count', 5, 'A9', 'weeks whose resistance total rises by more than max(1 set, 7 %) (10 % only with the printed note)'),
  m('steps_in_flat', 'T0-STW-04', 0, 'hard', 'count', 2, null, 'a planned step in a flat block or in week 1'),
  m('test_violation', 'T0-TST-01', 0, 'hard', 'count', 3, null, 'tests outside week 1 / the last week of a stairway, or a rep-max test on a single-leg / single-arm pick'),
  m('olympic_presence', 'T0-ATH-01', 0, 'hard', 'count', 3, null, 'competitive athletic weeks without an Olympic item, or with more than 4 exposures'),
  m('stage_violation', 'T0-ATH-02', 0, 'hard', 'count', 4, null, 'Receive-Create stage changing inside an exercise block, going down, or a quality outside its stage'),
  m('contact_cap', 'T0-ATH-03', 0, 'hard', 'count', 3, null, 'days over the contacts-per-session cap'),
  m('in_season_violation', 'T0-ATH-04', 0, 'hard', 'count', 2, null, 'in-season weeks of game-heavy sports with extra COD or more than one Olympic exposure'),
  m('sport_default_violation', 'T0-ATH-05', 0, 'hard', 'count', 2, null, 'swimmer main days without shoulder care; station circuits credited as muscle sets'),
  // ---- T1 the R3-SES-02 policy
  m('days_not_holding', 'T1-POL-02', 1, 'hard_conditional', 'count', 0, null, 'non-test main days above the fit factor (scored through days_over_band)'),
  m('fits_inconsistent', 'T1-POL-03', 1, 'output', 'count', 2, null, 'a plan that says it fits and still lists a group out for time, a lowered peak or a day over the minutes', BENCH),
  m('offer_missing', 'T1-POL-04', 1, 'output', 'count', 3, null, 'a plan that does not fit and carries no offer'),
  m('offer_invalid', 'T1-POL-04', 1, 'output', 'count', 4, 'A16', 'offered schedules the intake rejects (session length not in the allowed list, days outside 2-6)', BENCH),
  m('offer_mismatch', 'T1-POL-04', 1, 'output', 'count', 3, 'A16', 'offers whose re-run does not give what they state (set by the runner)', BENCH),
  m('groups_out_for_time', 'T1-POL-05', 1, 'objective', 'count', 8, null, 'groups the plan leaves out for time (legal, and the objective of the policy is to keep them): points = 8 x their share of the groups that are trained or out for time, a big mover counting double', BENCH),
  m('keep_order_skips', 'T1-POL-05', 1, 'objective', 'count', 0, null, 'a group trained directly while an earlier group of the keep order is out for time (a signal; only an exhaustive solve proves an inversion)', { bench: true, report_only: true }),
  m('missing_primary_pattern', 'T1-POL-07', 1, 'hard_conditional', 'count', 6, null, '(week, pattern) with no knee, hip, horizontal push or horizontal pull exercise'),
  m('day_lost_pattern', 'T1-POL-07', 1, 'hard_conditional', 'count', 6, null, 'main days of a cross-pattern week with a lower work lift and no partner (hip: a push, knee: a pull): "no press on the hip + push day"', BENCH),
  m('below_floor_states', 'T1-POL-08', 1, 'hard_conditional', 'count', 5, 'A3', 'entries of trained_below_floor, plus groups with 2+ exercises on a day that are not listed as trained', BENCH),
  m('unlisted_untrained', 'T1-POL-10', 1, 'output', 'count', 4, 'A4', 'groups neither in trained_groups nor in not_trained_directly with a reason'),
  m('missing_superset_recs', 'T1-POL-11', 1, 'output', 'count', 2, null, 'needed pairs that are not on; days marked supersets_needed without a needed pair'),
  m('athletic_vs_big_mover', 'T1-POL-13', 1, 'objective', 'count', 3, null, 'stay-active plans where a big mover is out for time while a day still holds athletic room (2+ stations or an Olympic lift)'),
  m('slack_while_untrained', 'T1-POL-05', 1, 'objective', 'count', 3, null, 'peak-week main days more than 15 % under the minutes while a group is out for time (DR-5)', BENCH),
  // ---- T2 floors
  m('floor_misses', 'T2-FLR-01', 2, 'hard_conditional', 'group-weeks', 14, 'A2', 'stairway group-weeks of a trained group under its floor on the main days (10; a pain-reduced group its start)'),
  m('calf_floor_misses', 'T2-FLR-02', 2, 'hard_conditional', 'weeks', 4, 'A2', 'stairway weeks with calves trained under 3 x leg days'),
  m('athlete_floor_misses', 'T2-FLR-04', 2, 'hard_conditional', 'group-weeks', 0, null, 'floor_misses of competitive field athletes (a subset)', { subset_of: 'floor_misses' }),
  m('below_floor_deficit', 'T2-FLR-05', 2, 'soft', 'sets', 0, null, 'mean weekly shortfall under the floor of the groups listed trained_below_floor', REPORT),
  m('week1_at_ceiling', 'T2-FLR-06', 2, 'hard_conditional', 'count', 3, null, 'lines of trained groups whose week-1 main-day sets leave less than the minimum climb under their ceiling'),
  // ---- T3 the stairway
  m('set_drops', 'T3-STW-01', 3, 'hard_conditional', 'count', 6, 'A6', 'an exercise or a trained group with fewer sets than the week before; a planned target that drops'),
  m('trained_not_climbing', 'T1-POL-12', 1, 'hard_conditional', 'count', 8, 'A6', 'trained groups whose own main-day sets rise by less than the minimum climb over the block'),
  m('flat_groups', 'T3-STW-02', 3, 'hard_conditional', 'count', 0, null, 'the same on credited sets of all days (scored through trained_not_climbing)'),
  m('flat_weeks_excess', 'T3-STW-07', 3, 'hard_conditional', 'weeks', 8, 'A7', 'flat weeks of the resistance total beyond max(0, N - 1 - sets added)', BENCH),
  m('main_flat_weeks_excess', 'T3-STW-03', 3, 'soft', 'weeks', 4, null, 'the same on the main-day total ("stairways that go flat on main days")', BENCH),
  m('hold_excess', 'T3-STW-03', 3, 'soft', 'weeks', 3, null, 'long holds: trained big groups, the second half, the main-day total, the total flat two weeks running'),
  m('last_week_not_hardest', 'T3-STW-04', 3, 'hard_conditional', 'count', 5, 'A9', 'blocks whose last week is not the largest (12 weeks: the last four), or whose main-day total does not rise'),
  m('early_step_larger', 'T3-STW-05', 3, 'hard', 'count', 2, null, 'lines whose largest planned early step is above their smallest late step'),
  m('peak_not_last', 'T3-STW-06', 3, 'hard', 'count', 3, null, 'trained groups whose highest week comes before the last week and is above it'),
  m('tracking_error', 'T3-STW-07', 3, 'soft', 'sets', 2, null, 'placed line sets against the printed target: cells more than 1 set apart; targets printed for groups that are not trained (DR-21)'),
  m('restart_at_block', 'T3-STW-08', 3, 'hard', 'count', 0, null, 'trained groups whose sets drop at an exercise-block start (a subset of set_drops)', { subset_of: 'set_drops' }),
  m('level_not_rising', 'T3-STW-09', 3, 'hard', 'count', 3, 'A8', 'stairway weeks whose display level does not rise'),
  m('progression_missing', 'T3-STW-09', 3, 'hard', 'group-weeks', 5, 'A8', 'trained group-weeks from week 2 on without exactly one entry in weeks[].progression', BENCH),
  m('circuit_flat', 'T3-STW-10', 3, 'hard_conditional', 'count', 4, null, 'circuit weeks whose work seconds do not rise (below the top) or rise by more than 10 %'),
  m('early_peak', 'T3-STW-06', 3, 'soft', 'count', 2, 'A20', 'trained groups (climb of 3+) whose last set arrives before week N-1', BENCH),
  m('athletic_drops', 'T3-ATH-01', 3, 'hard_conditional', 'count', 5, 'A18', '(family, week) whose planned athletic dose drops inside a stairway block'),
  m('athletic_flat', 'T3-ATH-01', 3, 'soft', 'count', 3, null, 'athletic families whose target rises 10 %+ over the block while the planned dose does not rise', BENCH),
  m('share_off', 'T3-ATH-02', 3, 'soft', 'weeks', 1, null, 'weeks whose plyometric share is more than 5 points from the target'),
  // ---- T4 time
  m('days_over_unwarned', 'T4-TIME-01', 4, 'hard_conditional', 'count', 10, 'A10', 'gym days of any week over the chosen minutes that are not listed in time_check.overrun with an offer', BENCH),
  m('days_over_band', 'T1-POL-02', 4, 'hard_conditional', 'count', 8, 'A11', 'gym days of any week above ceil(minutes x 1.10)', BENCH),
  m('minutes_recost_gap', 'DEF-09', 4, 'hard', 'count', 5, 'A12', 'gym days whose est_minutes differs from the re-cost of the dosed items by more than the tolerance', BENCH),
  m('overrun_minutes', 'T4-TIME-01', 4, 'soft', 'minutes', 0, null, 'minutes over the chosen length, summed over non-test main days', REPORT),
  m('length_invalid', 'T4-TIME-02', 4, 'hard', 'count', 2, null, 'a session length outside the allowed list, or over 90 min for a non-competitive client'),
  m('format_minutes', 'T4-TIME-03', 4, 'hard', 'count', 2, null, 'bootcamp days outside 35-45 min (for a 45-min choice)'),
  // ---- T5 caps and the athletic budget
  m('over_ceiling', 'T5-CAP-01', 5, 'hard', 'line-weeks', 3, null, 'line-weeks above the line\'s (time-held) ceiling on all days: direct sets above it, or credited sets more than 1 above it'),
  m('group_over_ceiling', 'T5-CAP-01', 5, 'soft', 'group-weeks', 2, null, 'decision D7 read per FOCUS group: credited sets of a group more than 1 above the larger ceiling of its lines (hips = glutes + hamstrings)', BENCH),
  m('over_30', 'T5-CAP-03', 5, 'hard', 'group-weeks', 3, null, 'group-weeks above 30 credited sets on all days'),
  m('ceiling_shortfall', 'T5-CAP-04', 5, 'objective', 'sets', 0, null, 'sets between the last week and the level ceiling, summed over trained groups', REPORT),
  m('per_session_over', 'T5-CAP-05', 5, 'soft', 'count', 2, null, '(day, group) above 11 credited sets in a session (Focus 14)'),
  m('per_session_over_hard', 'T5-CAP-05', 5, 'hard', 'count', 3, null, '(day, group) above 14 credited sets in a session', BENCH),
  m('focus_violation', 'T5-CAP-06', 5, 'hard', 'count', 2, null, 'more than 2 Focus muscles, or a Focus add outside 1-3'),
  m('athletic_over_budget', 'T5-ATH-01', 5, 'hard', 'count', 3, null, '(family, week) planned above 1.25 x target + one set (Olympic 1.5 x)'),
  m('athletic_attainment', 'T5-ATH-02', 5, 'objective', 'count', 6, 'A18', '(family, week) planned under 0.9 x the scaled target'),
  m('athletic_attainment_ratio', 'T5-ATH-02', 5, 'objective', 'ratio', 0, null, 'mean planned / full target over families and weeks (capped at 1)', { bench: true, report_only: true }),
  m('cod_missing', 'T5-ATH-03', 5, 'soft', 'count', 1, null, 'weeks of a COD sport with a COD target and no COD station'),
  // ---- T6 counts
  m('exbudget_over', 'T6-CNT-01', 6, 'hard', 'count', 6, 'A13', 'full-body days with more counted resistance exercises than the cap by minutes + the margin', BENCH),
  m('exercise_cap_excess', 'T6-CNT-01', 6, 'soft', 'exercises', 2, null, 'split days: resistance exercises above the cap by minutes'),
  m('exercise_count', 'T6-CNT-03', 6, 'objective', 'exercises', 0, null, 'mean resistance exercises per main day', REPORT),
  m('bad_added_exercise', 'T6-CNT-04', 6, 'hard', 'count', 3, null, 'added exercises at 1 set, or appearing in the middle of an exercise block'),
  m('focus_slot_violation', 'T6-CNT-05', 6, 'hard', 'count', 2, null, 'optional days with more than 2 Focus slots, or Focus slots outside 2-3 sets'),
  m('athletic_split', 'T6-CNT-07', 6, 'hard', 'count', 2, null, 'cross-pattern athlete days with more than 2 jump / throw stations or more than 1 Olympic lift'),
  m('prehab_over', 'T6-CNT-08', 6, 'hard', 'count', 1, null, 'days with more than 2 joint-care items'),
  // ---- T7 placement, order, pairing
  m('staircase_deviation', 'T7-PLC-01', 7, 'soft', 'sets', 2, null, 'group-days whose sets are not the coach\'s staircase (a later exercise above an earlier one, or a spread above 1)'),
  m('exposure_imbalance', 'T7-PLC-02', 7, 'soft', 'sets', 2, null, 'sets added on the two exposures of a day type that are not alternated'),
  m('bonus_misplaced', 'T7-PLC-03', 7, 'soft', 'count', 1, null, 'a bonus exercise alone for its group on a main day; a second calf exercise on a leg day'),
  m('climb_on_optional_only', 'T7-PLC-04', 7, 'soft', 'count', 2, null, 'trained big groups whose main-day sets are flat while the all-day sets rise'),
  m('focus_not_first', 'T7-ORD-01', 7, 'soft', 'count', 1, null, 'days training a Focus group whose first resistance exercise is not of a Focus group (days with a work lift excepted)'),
  m('olympic_day_pattern', 'T7-ORD-02', 7, 'soft', 'count', 1, null, 'a clean on a hip day or a snatch on a knee day'),
  m('pairing_style', 'T7-PAIR-01', 7, 'soft', 'count', 1, null, 'a plan whose pairing grammar does not match its goal'),
  m('frequency_shortfall', 'T7-WEEK-01', 7, 'soft', 'count', 1, null, 'patterns on fewer than 2 days a week in plans of 4+ main days'),
  m('supersets_on_unneeded', 'T7-PAIR-03', 7, 'objective', 'count', 0, null, 'pairs switched on that the day does not need', REPORT),
  m('day_spread', 'T7-WEEK-02', 7, 'soft', 'minutes', 0, null, 'longest minus shortest main day of the last week', REPORT),
  // ---- T8 balance and variety
  m('laterality_error', 'T8-BAL-01', 8, 'soft', 'points', 3, 'A21', 'lower-body bilateral share against the target per exercise block (blocks more than 0.12 off)'),
  m('upper_laterality_error', 'T8-BAL-02', 8, 'soft', 'points', 1, null, 'the same for the upper body'),
  m('push_pull_ratio', 'T8-BAL-03', 8, 'soft', 'weeks', 1, null, 'weeks with pull sets under 0.8 x push sets (no pushing Focus)'),
  m('group_balance', 'T8-BAL-04', 8, 'soft', 'ratio', 0, null, 'spread of relative progress (peak - start) / (ceiling - start) over trained groups', REPORT),
  m('repeated_exposure', 'T8-VAR-01', 8, 'soft', 'count', 1, null, 'the two exposures of a slot holding the identical exercise with no detail'),
  m('block_change_violations', 'T8-VAR-02', 8, 'soft', 'count', 1, null, 'a slot that returns to an earlier pick (A-B-A); a work lift that changes between exercise blocks'),
  m('near_duplicates', 'T8-VAR-03', 8, 'soft', 'count', 1, null, 'a session holding the same exercise twice')
];
const METRIC_BY_ID = new Map(METRICS.map(x => [x.id, x]));

/** inventory metrics this scorer cannot measure on one plan JSON, and why */
export const NOT_MEASURED = {
  style_changes_sets: 'needs the same intake generated with two lift styles',
  olympic_dose: 'the rep scheme by implement and catch is not in the plan JSON in a checkable form',
  rep_phase_violation: 'the VOL-phase rep matrix by rep class and exception is selection / dose logic; not re-implemented',
  calendar_violation: 'needs holiday marks and event lead-ins of the intake against the block calendar',
  full_plan_when_feasible: 'needs a solve of the full level plan (the scorer checks only that a plan that says it fits is consistent: fits_inconsistent)',
  keep_order_inversion: 'needs an exhaustive check of the keep vector (C4 grid, A14); keep_order_skips is the one-plan signal',
  protected_item_cut: 'needs the uncut template day; the parts that show on a plan are core_opener_missing, calf_rule, rear_delt_week, survival_cut',
  squeezed_groups: 'same count as one_exercise_groups (T0-SES-10)',
  below_floor_unlisted: 'scored as below_floor_states (A3) and unlisted_untrained (A4)',
  edit_rebuild: 'needs a rebuild with a block toggled off',
  trained_group_minimums: 'the union of floor_misses, one_exercise_groups and trained_not_climbing (reported in facts.trained_failing_minimums)',
  split_day_group_counts: 'needs to know whether a third exercise would fit the minutes (a solve)',
  default_order_violations: 'observed default orders are selection preferences; not re-implemented',
  plane_mix_error: 'contra / ipsi and plane shares are not in the plan JSON'
};

/** PLANNER_SPEC 13.2: the acceptance rows this scorer feeds, with their pass rule on a corpus */
export const ACCEPTANCE = [
  { id: 'A1', name: 'hard_violations', metrics: null, pass: 'sum == 0', what: 'sum of every hard / hard_conditional metric' },
  { id: 'A2', name: 'floor_misses, calf_floor_misses', metrics: ['floor_misses', 'calf_floor_misses'], pass: 'sum == 0' },
  { id: 'A3', name: 'below_floor_states', metrics: ['below_floor_states'], pass: 'sum == 0' },
  { id: 'A4', name: 'unlisted_untrained', metrics: ['unlisted_untrained'], pass: 'sum == 0' },
  { id: 'A5', name: 'one_exercise_groups', metrics: ['one_exercise_groups'], pass: 'sum == 0' },
  { id: 'A6', name: 'trained_not_climbing, set_drops', metrics: ['trained_not_climbing', 'set_drops'], pass: 'sum == 0' },
  { id: 'A7', name: 'flat_weeks_excess', metrics: ['flat_weeks_excess'], pass: 'sum == 0' },
  { id: 'A8', name: 'progression_missing', metrics: ['progression_missing', 'level_not_rising'], pass: 'sum == 0' },
  { id: 'A9', name: 'weekly_rise_over, last_week_not_hardest', metrics: ['weekly_rise_over', 'last_week_not_hardest'], pass: 'sum == 0' },
  { id: 'A10', name: 'days_over_unwarned', metrics: ['days_over_unwarned'], pass: 'sum == 0' },
  { id: 'A11', name: 'days_over_band', metrics: ['days_over_band'], pass: 'sum == 0' },
  { id: 'A12', name: 'minutes_recost_gap', metrics: ['minutes_recost_gap'], pass: 'sum == 0' },
  { id: 'A13', name: 'exbudget_over, athlete_cap', metrics: ['exbudget_over', 'athlete_cap'], pass: 'sum == 0' },
  { id: 'A16', name: 'offer_invalid, offer_mismatch', metrics: ['offer_invalid', 'offer_mismatch'], pass: 'sum == 0' },
  { id: 'A17', name: 'unexplained_decisions', metrics: ['unexplained_decisions'], pass: 'sum == 0' },
  { id: 'A18', name: 'athletic_drops, athletic_attainment', metrics: ['athletic_drops', 'athletic_attainment'], pass: 'sum == 0' },
  { id: 'A19', name: 'best_found_share', metrics: null, pass: 'share <= 0.05' },
  { id: 'A20', name: 'early_peak_plans', metrics: ['early_peak'], pass: 'share of plans <= 0.05' },
  { id: 'A21', name: 'laterality_error', metrics: ['laterality_error'], pass: 'share of blocks within 0.12 >= 0.95' },
  { id: 'A22', name: 'determinism', metrics: ['determinism'], pass: 'sum == 0' }
];

// ----------------------------------------------------------------------------------------------------------------------
// Context: indexes over the model JSON, and the named parameters
// ----------------------------------------------------------------------------------------------------------------------

const get = (o, path) => String(path).split('.').reduce((x, k) => (x === undefined || x === null ? undefined : x[k]), o);

/** PLANNER_SPEC 4.7: the defaults of rules.planner, used while model/rules.json has no `planner` section */
export const PLANNER_DEFAULTS = Object.freeze({
  fit: { trained_factor: { full_body: 1.0, split: 1.0 }, full_plan_factor: { full_body: 1.1, split: 1.0 }, pattern_factor: { full_body: 1.1, split: 1.0 }, test_days: 'inside', exercise_margin: 1 },
  calves: { floor: 'per_leg_day' },
  group_targets: { two_line_groups: 'carrier_max' },
  session: { hard_for_every_group: true },
  stairway: { total_rule_pct: 7, fallback_pct: 10 }
});

/**
 * Every number the scorer compares against, with the model path it came from. `overrides` = {name: value} (opts.params or
 * makeContext's second argument) replaces a value; a replaced value is reported as source 'override'.
 */
function resolveParams(R, overrides = {}) {
  const PL = R.planner || {};
  const P = {};
  const src = {};
  const put = (name, value, source) => { P[name] = value; src[name] = source; };
  const pl = (path, def) => { const v = get(PL, path); return v === undefined ? [get(PLANNER_DEFAULTS, path), 'PLANNER_SPEC 4.7 default (rules.planner.' + path + ' absent)'] : [v, 'rules.planner.' + path]; };
  const rule = (name, path, def) => { const v = get(R, path); put(name, v === undefined ? def : v, v === undefined ? 'scorer default (rules.' + path + ' absent)' : 'rules.' + path); };

  rule('floor', 'volume.floor.value', 10);
  put('calves_floor_mode', ...pl('calves.floor'));                       // per_leg_day | model_formula | ten_with_optional_slot
  rule('calves_per_leg_day', 'volume.calves.per_leg_day', { L1: 3, L2: 3, L3: 3 });
  rule('calves_weekly_floor', 'volume.calves.weekly_floor', 10);
  rule('calves_max_per_day', 'volume.calves.per_leg_day_max_L3', 4);
  rule('min_climb', 'stairway.min_climb', { group: 2, calves: 1, line: 1, short_block: { max_N: 7, group: 1 } });
  rule('planned_step_max', 'stairway.limits.planned_step_max', 0.07);
  put('total_rise_pct', ...(() => { const [v, s] = pl('stairway.total_rule_pct'); return [v / 100, s]; })());
  rule('total_rise_ceiling', 'stairway.limits.total_weekly_ceiling', 0.10);
  put('total_rise_note_keys', ['note.total_rise_10', 'warning.total_rise_10', 'why.total_rise_10'], 'scorer (the printed note that allows the 10 % fallback, PLANNER_SPEC 13.2 A9)');
  rule('hold_rules', 'stairway.hold_rules', { min_N: 8, min_climb: 3, hold_extra_weeks: 1, total_hold_max_frac: 0.5 });
  put('band_factor', ...(() => { const [v, s] = pl('fit.full_plan_factor'); return [v, s]; })());   // {full_body, split}; A11 uses the full-body value for every gym day
  put('exercise_margin', ...pl('fit.exercise_margin'));
  rule('exercise_cap_by_minutes', 'session.exercise_cap_by_minutes', {});
  rule('athlete_cap', 'session.athlete_cap', 12);
  rule('outside_cap_blocks', 'session.outside_cap_blocks', ['warmup', 'core', 'skill', 'prehab', 'conditioning', 'aerobic', 'cooldown', 'test']);
  rule('small_iso_superset_counts_as_one', 'session.small_iso_superset_counts_as_one', true);
  rule('ankle_outside_athlete_cap', 'athletic.f2.ankle_block.outside_athlete_cap', true);
  rule('ankle_time_class', 'athletic.f2.ankle_block.time_class', null);
  rule('exercises_per_group', 'session.exercises_per_group', { full_body_day: [2, 4], split_day: [2, 4], exempt_groups: ['calves', 'core'], exempt_families: ['strength'] });
  put('one_exercise_exempt_formats', ['circuit'], 'inventory T0-SES-10 ("timed circuit days"), PLANNER_SPEC 13.2 note 3');
  rule('class_families', 'session.time_fit.keep_work_lift.families', ['hybrid_crossfit']);
  rule('pattern_keep', 'volume.pattern_keep', { sets: 2, max_per_week: 3 });
  rule('placement_min_sets', 'placement.min_sets', 2);
  rule('placement_max_sets', 'placement.max_sets_per_exercise', { L1: 4, L2: 5, L3: 5 });
  rule('placement_max_iso', 'placement.max_sets_isolation', 4);
  put('set_bounds_skip_formats', ['circuit'], 'PLANNER_SPEC 7.13 (rounds x stations are the circuit format\'s own dose)');
  rule('per_session', 'volume.per_session', { soft: 11, priority: 14 });
  rule('absolute_cap', 'volume.priority.absolute_cap', 30);
  rule('focus', 'volume.focus', { max: 2, add_range: [1, 3] });
  rule('core_block', 'core_block', { exercises: 2, sets_when_first: 2 });
  rule('block_order', 'ordering.block_order', []);
  rule('athletic_bucket_order', 'ordering.athletic_bucket_order', []);
  // T0-SES-05 / -06 are written with one position per pattern: pos(HPULL) < pos(VPULL), pos(bilateral) < pos(unilateral). 'first' reads
  // them as "the first horizontal before the first vertical" (the reading the coach's own templates satisfy, engine D-30); 'every' reads
  // "every horizontal before every vertical". The count under the other reading is always reported in the metric's detail.
  put('order_reading', 'first', 'inventory T0-SES-05 / -06 formal statements (one position per pattern); "every" = the plain-text reading');
  put('bilateral_first_regions', ['lower'], 'BRAIN 6 order table ("bilateral before unilateral (same region)", OBSERVED on lower-body lifts); add "upper" to check the presses and pulls too');
  rule('h_before_v_exempt_role', 'ordering.h_before_v_exempt_when_vertical_is', 'work');
  rule('pairing', 'pairing', {});
  rule('axial', 'axial', { budget: { squat: 1, hinge: 1 }, not_counted_tags: [] });
  rule('rir_band', 'effort.rir_band', [1, 3]);
  rule('effort_by_block_type', 'effort.by_block_type', {});
  rule('intensifiers', 'effort.intensifiers', { last_week_only: true, per_day: 1 });
  rule('never_failure_rep_classes', 'effort.never_failure_rep_classes', []);
  rule('rest', 'rest', {});
  rule('time_model', 'time_model', {});
  put('recost_tolerance_min', 2, 'diagnosis DR-11 ("est_minutes equals a re-cost of the printed items within 2 min")');
  put('slack_factor', 0.85, 'diagnosis DR-5 (a day more than 15 % under its minutes)');
  rule('minutes_allowed', 'session.minutes_allowed', [30, 45, 60, 75, 90, 105, 120]);
  rule('minutes_over_90_competitive_only', 'session.minutes_over_90_competitive_only', true);
  rule('off_days_min', 'session.off_days_min', 1);
  rule('bootcamp_session_min', 'supersets.bootcamp.session_min', [35, 45]);
  rule('rear_from_rows_min', 'volume.rear_from_rows_min', 1.5);
  rule('keep_order', 'session.time_fit.keep_order', []);
  rule('keep_order_r2', 'session.time_fit.keep_order_r2', {});
  rule('athletic_reconcile', 'athletic.reconcile', { tolerance: 0.25, olympic_max_factor: 1.5, per_set_max: {}, warn_below_share: 0.85, climb_families: { jumps: ['plyo_contacts', 'jump_contacts'], ankle: ['low_contacts'], throws: ['throws'], cod_cuts: ['cod_cuts'], sprint_m: ['sprint_m'] } });
  put('athletic_attainment_min', 0.9, 'PLANNER_SPEC 13.2 A18 (planned dose under 0.9 x the scaled target)');
  put('athletic_test_replaced_counts', true, 'PLANNER_SPEC 5.5 R-TEST (a timed test takes the place of the station of its quality)');
  rule('athletic_target_rise_min', 'athletic.r2.flat.target_rise_min', 0.1);
  rule('share_tolerance', 'athletic.f2.share.tolerance', 0.05);
  rule('stage_qualities', 'athletic.stages.stage_qualities', {});
  rule('contacts_session_max', 'athletic.contacts_per_session_max', {});
  rule('olympic', 'olympic', { per_week_max: 4 });
  rule('in_season_game_heavy', 'athletic.in_season_game_heavy', { sports: [] });
  rule('prehab', 'prehab', { per_day_max: 2 });
  rule('bilateral_share', 'bilateral_share', { tolerance: 0.03, validate_tolerance: 0.12, regions: { lower: [], upper: [] } });
  rule('population', 'population', {});
  rule('levels', 'levels', {});
  rule('pain', 'volume.pain', { areas: {}, worse_with: {} });
  put('pain_area_region', { neck: 'all', shoulder: 'upper', elbow: 'upper', wrist_hand: 'all', upper_back: 'upper', lower_back: 'all', hip_groin: 'lower', knee: 'lower', ankle_foot: 'lower', other: 'none' },
    'scorer (INFERRED): the body region an area\'s avoid tags apply to - a fixed grip matters to a sore shoulder on a press or a pull, not on a calf raise; worse_with tags apply everywhere');
  put('two_line_groups', ...pl('group_targets.two_line_groups'));          // carrier_max: one ceiling per FOCUS group (decision D7)
  put('myo_not_in_superset', false, 'scorer: false = VOL-15 literal (the MYO set is on the day\'s last eligible exercise); true = engine E-158 (an exercise inside a superset is not eligible)');
  rule('floor_carriers', 'volume.floor.carriers', {});
  rule('medball', 'medball', { max_lb: 20 });
  rule('credit', 'credit', { classes: {}, athletic_slot_buckets: [] });
  rule('optional_focus', 'placement.added_slots.optional_focus', { slots: 2, sets_max: 3 });
  rule('tests', 'tests', {});
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
  return {
    R, P, param_sources: src, groups, members, groupOfMuscle, lines, lineDefs, groupOfLine, linesOfGroup,
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
  const tc = plan.time_check || {};
  const X = {
    meta, derived, tc,
    family: meta.family || null, goal: meta.goal || null, format: meta.format || null,
    level: (meta.level && meta.level.client) || 'L2',
    competitive: (meta.profile && meta.profile.competitive) === 'competitive',
    profile_id: (meta.profile && meta.profile.id) || null,
    sport_id: (meta.profile && meta.profile.sport_id) || null,
    minutes: meta.session_minutes || null,
    age: typeof derived.age === 'number' ? derived.age : null,
    prefs: derived.prefs || {},
    pain: derived.pain || [],
    kit: meta.kit || { tokens: [], machines: [] },
    play_days: meta.play_days || [],
    game_days: (meta.season && meta.season.game_days) || [],
    targets: meta.targets || {},
    warnings: meta.warnings || [],
    weeks: [], blocks: []
  };
  const cls = ctx.P.class_families.includes(X.family);
  const strengthRoles = (ctx.P.exercises_per_group.exempt_families || []).includes(X.family);
  X.athletic_family = X.family === 'athletic';

  for (const w of plan.weeks || []) {
    const W = { raw: w, n: w.n, tb: w.training_block, type: w.block_type, eb: w.exercise_block, stair_week: w.stair_week, stairway: w.block_type === 'stairway', days: [] };
    for (const d of w.days || []) {
      const D = { raw: d, weekday: d.weekday, kind: d.kind, main: d.kind === 'main', optional: d.kind === 'optional' || !!d.optional, gym: d.kind === 'main' || d.kind === 'optional',
        full_body: !!d.full_body, format: d.format || 'straight', est: typeof d.est_minutes === 'number' ? d.est_minutes : null, limit: d.minutes_limit || X.minutes, items: [], units: [], blocks: d.blocks || [] };
      let pos = 0;
      for (const [bi, b] of (d.blocks || []).entries()) {
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
  const tcBlocks = Array.isArray(tc.by_block) ? tc.by_block.filter(b => b && typeof b === 'object') : [];
  for (const [n, weeks] of byTb) {
    const t = tcBlocks.find(b => b.training_block === n) || (tc.training_block === n || (!tcBlocks.length && n === 1) ? tc : null) || {};
    const type = weeks[0].type;
    const mainDays = weeks.flatMap(W => W.days.filter(D => D.main));
    const circuit = mainDays.length > 0 && mainDays.every(D => D.format === 'circuit');
    const B = { n, type, weeks, N: weeks.length, stairway: type === 'stairway', tc: t,
      trained: (t.trained_groups || []).slice(), notTrained: (t.not_trained_directly || []).map(x => (typeof x === 'string' ? { group: x } : x)),
      below: (t.trained_below_floor || []).map(x => (typeof x === 'string' ? { group: x } : x)),
      format: circuit ? 'circuit' : cls ? 'class' : strengthRoles ? 'strength_roles' : 'straight' };
    // the year plan's Q1 is a stairway block that holds its sets (rules.plan_types.year.layout[].flat_sets; inventory T0-STW-04)
    const sb = ((plan.shape && plan.shape.training_blocks) || []).find(x => x && x.n === n);
    B.flatSets = !!(sb && sb.factor && sb.factor.flat_sets);
    B.climbsInSets = B.stairway && B.format !== 'circuit' && !B.flatSets;
    B.ebs = new Map();
    for (const W of weeks) { if (!B.ebs.has(W.eb)) B.ebs.set(W.eb, []); B.ebs.get(W.eb).push(W); }
    X.blocks.push(B);
  }
  // listed kept movements and class lifts (PLANNER_SPEC 4.6); the old engine lists neither
  X.patternSlots = new Map();
  for (const p of Array.isArray(tc.pattern_stations) ? tc.pattern_stations : []) if (p && p.slot_id) X.patternSlots.set(p.slot_id, p);
  X.classSlots = new Set((Array.isArray(tc.class_lifts) ? tc.class_lifts : []).map(c => (typeof c === 'string' ? c : c && c.slot_id)).filter(Boolean));
  X.classGroups = new Set((tc.not_trained_directly || []).filter(x => x && x.reason === 'class_lift').map(x => x.group));
  X.focusGroups = [...new Set((X.targets.priority || []).map(l => ctx.groupOfLine[l] || ctx.groupOfMuscle[l]).filter(Boolean))];
  return X;
}

// ----------------------------------------------------------------------------------------------------------------------
// DEF-09: the scorer's own re-cost of a day from the dosed items
// ----------------------------------------------------------------------------------------------------------------------

function timeClassOf(I, ctx) {
  const it = I.raw;
  if (noteKeys(it).includes('note.prehab_in_rest')) return 'prehab_in_rest';
  if (I.bucket === 'AP_JUMP_LIMITED_KNEE' && ctx.P.ankle_time_class) return ctx.P.ankle_time_class;
  let tc = I.bdef.time_class || null;
  if (I.bk === 'focus' || !tc) tc = I.ex && I.ex.exercise_class === 'compound' ? 'compound_bilateral' : (I.bk === 'core' ? 'core_set' : I.bk === 'prehab' ? 'prehab' : 'isolation');
  const lat = it.laterality;
  if (lat === 'unilateral' || lat === 'alternating') {
    if (tc === 'compound_bilateral') tc = 'compound_unilateral'; else if (tc === 'isolation') tc = 'isolation_unilateral';
  } else if (tc === 'compound_unilateral' && lat === 'bilateral') tc = 'compound_bilateral';
  return tc;
}

/** the rest class the dose printed: the class whose range in rules.rest equals the printed range; else the class of the time class */
function restClassOf(I, tc, ctx) {
  const T = ctx.P.time_model, RR = ctx.P.rest;
  const def = (T.rest_class_by_time_class || {})[tc] || 'hypertrophy';
  const r = I.raw.rest;
  if (tc === 'prehab_in_rest' || !r || typeof r.min !== 'number' || typeof r.max !== 'number' || r.type === 'work_rest') return def;
  const ranges = { strength: RR.strength_s, olympic: RR.olympic_s, hypertrophy: RR.hypertrophy_s, isolation: RR.isolation_s, core: RR.core_s, throw: RR.throw_s, prehab: RR.prehab_s };
  const eq = (a) => Array.isArray(a) && a[0] === r.min && a[1] === r.max;
  if (eq(ranges[def])) return def;
  const order = ['strength', 'olympic', 'hypertrophy', 'isolation', 'throw', 'core', 'prehab'];
  const exact = order.find(c => eq(ranges[c]));
  if (exact) return exact;
  const mid = (r.min + r.max) / 2;
  let best = def, bd = Infinity;
  for (const c of order) { const a = ranges[c]; if (!Array.isArray(a)) continue; const dd = Math.abs((a[0] + a[1]) / 2 - mid); if (dd < bd - EPS) { bd = dd; best = c; } }
  return best;
}

function setCostOf(I, ctx) {
  const T = ctx.P.time_model;
  const tc = timeClassOf(I, ctx);
  const work = (T.work_minutes || {})[tc] ?? (T.work_minutes || {}).isolation ?? 0;
  const rc = restClassOf(I, tc, ctx);
  const rest = (T.rest_class_minutes || {})[rc] ?? (T.rest_class_minutes || {}).hypertrophy ?? 0;
  return { tc, rc, work, rest };
}

/** @returns {{minutes:number|null, parts:object}} the day's minutes by DEF-09, from what is printed; null when a block cannot be costed */
export function recostDay(D, W, ctx, trace = null) {
  const T = ctx.P.time_model;
  if (!T.work_minutes || !T.rest_class_minutes) return { minutes: null, parts: { reason: 'no v1.3 time model' } };
  const mps = T.minutes_per_set || {};
  const parts = { warmup: 0, skill: 0, core: 0, athletic: 0, power: 0, resistance: 0, prehab: 0, circuit: 0, conditioning: 0, aerobic: 0, test: 0 };
  const bucketOfPart = (I) => (I.block === 'core' ? 'core' : I.bk === 'athletic' ? 'athletic' : I.bk === 'power' ? 'power' : I.bk === 'prehab' || I.role === 'prehab' ? 'prehab' : I.bk === 'conditioning' ? 'conditioning' : 'resistance');
  if (D.items.some(I => I.bucket === 'WARMUP_GENERAL' && I.block === 'warmup')) { parts.warmup += mps.warmup_session || 0; if (trace) trace.push({ slot_id: 'warm-up', what: 'warm-up of the session', minutes: mps.warmup_session || 0 }); }
  const pairs = new Map();
  const circuits = new Map();
  const stationCircuit = [];
  for (const I of D.items) {
    const it = I.raw;
    if (I.block === 'cooldown' || (I.bk === 'warmup')) continue;
    if (I.bucket === 'SKILL') {
      const short = T.skill_in_warmup_short && D.limit <= T.skill_in_warmup_short.at_or_below_minutes ? T.skill_in_warmup_short.min : null;
      parts.skill += I.block === 'warmup' ? (short ?? T.skill_in_warmup_min ?? 0) : (T.skill_extra_min ?? mps.skill_block ?? 0);
      continue;
    }
    if (it.aerobic) {
      const pos = it.aerobic.position;
      if (it.test) continue;   // a cardio test is the session of its own day
      // an add-on after lifting, a fighter's opening block and the session of an optional day are part of the day; a
      // 'separate_session' is done at another time of day (rules.time_model.aerobic_addon_counts)
      if (pos !== 'separate_session' && (T.aerobic_addon_counts !== false || pos === 'open_day')) { const mm = (T.aerobic_addon_minutes || {})[it.aerobic.colour] || 0; parts.aerobic += mm; if (trace) trace.push({ slot_id: it.slot_id, what: 'aerobic ' + it.aerobic.colour + ' (' + pos + ')', minutes: mm }); }
      continue;
    }
    if (I.bucket === 'TEST') {
      const t = String((it.test && it.test.test) || '');
      const k = /cmj|jump/.test(t) ? 'jumps' : /sprint/.test(t) ? 'sprint' : /shuttle|5-10-5|l-test|agility/.test(t) ? 'cod' : /mile|erg|trial|cardio/.test(t) ? 'cardio' : 'jumps';
      parts.test += (T.test_item_minutes || {})[k] || 0;
      continue;
    }
    if (I.block === 'circuit') { if (I.sets > 0) { if (!circuits.has(I.block_index)) circuits.set(I.block_index, []); circuits.get(I.block_index).push(I); } continue; }
    if (I.bucket === 'COND_WOD') { const mm = it.wod && Array.isArray(it.wod.minutes) ? it.wod.minutes[1] : null; if (mm == null) return { minutes: null, parts: { reason: 'WOD without minutes' } }; parts.conditioning += mm; continue; }
    if (I.bucket === 'COND_CIRCUIT' && it.circuit) { stationCircuit.push(I); continue; }
    if (!I.sets) continue;
    const cost = setCostOf(I, ctx);
    const part = bucketOfPart(I);
    // a rep-max test: the work-up, then the top set with the rest it is dosed with; it is the first set of its lift (one changeover)
    const topSetOfLift = I.isTest && RES_KINDS.includes(I.bk);
    if (topSetOfLift) { parts.test += T.test_workup_minutes || 0; if (trace) trace.push({ slot_id: it.slot_id, what: 'test work-up', minutes: T.test_workup_minutes || 0 }); }
    const sharesChangeover = topSetOfLift && D.items.some(J => !J.isTest && J.sets > 0 && baseSlot(J.raw.slot_id) === baseSlot(it.slot_id));
    if (it.superset) {
      const key = it.superset;
      if (!pairs.has(key)) pairs.set(key, []);
      pairs.get(key).push({ sets: I.sets, cost, part, slot_id: it.slot_id });
    } else {
      const mm = I.sets * (cost.work + cost.rest) + (sharesChangeover ? 0 : (T.changeover_min_per_exercise || 0));
      parts[part] += mm;
      if (trace) trace.push({ slot_id: it.slot_id, what: I.sets + ' x (' + cost.work + ' ' + cost.tc + ' + ' + cost.rest + ' ' + cost.rc + ')' + (sharesChangeover ? '' : ' + changeover'), minutes: r2(mm) });
    }
  }
  for (const ms of pairs.values()) {
    let t;
    if (ms.length < 2) t = ms[0].sets * (ms[0].cost.work + ms[0].cost.rest) + (T.changeover_min_per_exercise || 0);
    else {
      t = 0;
      const rounds = Math.max(...ms.map(x => x.sets));
      for (let k = 1; k <= rounds; k++) { const act = ms.filter(x => x.sets >= k); if (act.length) t += sum(act.map(x => x.cost.work)) + Math.max(...act.map(x => x.cost.rest)); }
      t += (T.changeover_in_superset_pair || 0) * ms.length;
    }
    parts[ms[0].part] += t;
    if (trace) trace.push({ slot_id: ms.map(x => x.slot_id).join(' + '), what: 'pair: ' + ms.map(x => x.sets + ' x ' + x.cost.work + ' ' + x.cost.tc + ' / rest ' + x.cost.rest + ' ' + x.cost.rc).join(' | '), minutes: r2(t) });
  }
  const circ = T.circuit || {};
  let nCirc = 0;
  for (const st of circuits.values()) {
    nCirc++;
    const c0 = st[0].raw.circuit || {};
    const wc = (W.raw.circuit) || {};
    const work = c0.work_s ?? wc.work_s; const trans = c0.transition_s ?? circ.transition_s ?? 0; const between = c0.between_rounds_s ?? circ.between_rounds_s ?? 0;
    if (work == null) return { minutes: null, parts: { reason: 'circuit without work seconds' } };
    const rounds = Math.max(...st.map(I => I.sets));
    parts.circuit += (rounds * st.length * (work + trans)) / 60 + (Math.max(0, rounds - 1) * between) / 60;
  }
  if (nCirc > 1 && typeof T.between_circuits_s === 'number') parts.circuit += ((nCirc - 1) * T.between_circuits_s) / 60;
  if (stationCircuit.length) {
    const c0 = stationCircuit[0].raw.circuit;
    const rounds = c0.rounds ?? Math.max(...stationCircuit.map(I => I.sets || 0));
    parts.conditioning += (rounds * stationCircuit.length * ((c0.work_s || 0) + (c0.transition_s ?? circ.transition_s ?? 0))) / 60 + (T.changeover_min_per_exercise || 0);
  }
  const minutes = sum(Object.values(parts));
  for (const k of Object.keys(parts)) parts[k] = r2(parts[k]);
  return { minutes: Math.round(minutes + EPS), exact: r2(minutes), parts };
}

/**
 * Where the minutes of one day go, item by item (the re-cost of A12 with its working shown).
 * @param {object} plan plan/2 @param {object} ctx makeContext(model) @param {number} week week number @param {string} weekday 'Mon' ...
 * @returns {{est_minutes:number|null, minutes_limit:number, recost:number|null, exact:number, parts:object, lines:Array<{slot_id:string, what:string, minutes:number}>}|null}
 */
export function explainDay(plan, ctx, week, weekday) {
  const X = readPlan(plan, ctx);
  const W = X.weeks.find(w => w.n === week);
  const D = W && W.days.find(d => d.weekday === weekday);
  if (!D) return null;
  const lines = [];
  const rc = recostDay(D, W, ctx, lines);
  return { est_minutes: D.est, minutes_limit: D.limit, recost: rc.minutes, exact: rc.exact, parts: rc.parts, lines };
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
    /** a metric whose value is not a count of hits (sets, minutes, ratio); sev in 0..1 is its share of the points */
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
      if (ladder.indexOf(ex.level) > youthMax) S.hit('youth_violation', where, it.exercise_id + ' is ' + ex.level);
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
const direction = (U) => (['HPUSH', 'VPUSH'].includes(patternOf(U)) ? 'push' : ['HPULL', 'VPULL'].includes(patternOf(U)) ? 'pull' : null);

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
        if (X.blocks.find(B => B.n === W.tb).format !== 'strength_roles' && strengthUnits[0].role !== 'work' && !focusFirst && !strengthUnits[0].hasTest) S.hit('work_bilateral_myo_order', { ...where, slot_id: strengthUnits[0].slot }, 'the work lift is not first (' + strengthUnits[0].role + ' first)');
        else {
          let bad = null;
          for (const region of ['lower', 'upper']) {
            const reg = strengthUnits.filter(U => U.ex && U.ex.exercise_class === 'compound' && (region === 'lower' ? isLowerCompound(U) : direction(U)));
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
        const neverCC = P.intensifiers.never_credit_classes || [];
        const eligible = (U) => U.ex && (U.ex.exercise_class === 'isolation' || U.ex.constraint >= 4) && !neverCC.includes(U.ex.credit_class) && !(P.myo_not_in_superset && U.superset);
        const lastElig = [...units].reverse().find(eligible);
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

function calvesFloor(W, X, ctx) {
  const P = ctx.P; const L = W.legDays.length; const per = (P.calves_per_leg_day || {})[X.level] || 3;
  if (P.calves_floor_mode === 'model_formula') return Math.max(per * L, Math.min(P.calves_weekly_floor, (per + 1) * L - 1));
  if (P.calves_floor_mode === 'ten_with_optional_slot') return P.calves_weekly_floor;
  return per * L;
}

function floorOf(g, W, X, ctx) {
  if (g === 'calves') return calvesFloor(W, X, ctx);
  let F = ctx.P.floor;
  const painLines = new Set(X.targets.pain_muscles || []);
  const lines = ctx.linesOfGroup[g] || [];
  if (lines.some(l => painLines.has(l) || (ctx.lineDefs[l].members || []).some(mu => painLines.has(mu)))) {
    const starts = lines.map(l => (X.targets.start || {})[l]).filter(v => typeof v === 'number');
    if (starts.length) F = Math.min(F, Math.max(...starts));
  }
  return F;
}

const minClimb = (g, B, X, ctx) => {
  const mc = ctx.P.min_climb;
  if (mc.short_block && B.N <= mc.short_block.max_N) return mc.short_block.group;
  if (g === 'calves') return mc.calves;
  const painLines = new Set(X.targets.pain_muscles || []);
  if ((ctx.linesOfGroup[g] || []).some(l => painLines.has(l) || (ctx.lineDefs[l].members || []).some(mu => painLines.has(mu)))) return 1;
  return mc.group;
};

function checkPolicyAndFloors(S, X, ctx, plan) {
  const P = ctx.P;
  const epg = P.exercises_per_group;
  const facts = { blocks: [] };
  const oneExKinds = {};
  const keptW = { out: 0, all: 0 };
  for (const B of X.blocks) {
    if (!B.stairway) continue;
    const trained = new Set(B.trained);
    const listedNT = new Map(B.notTrained.map(x => [x.group, x]));
    const classGroups = new Set(B.notTrained.filter(x => x.reason === 'class_lift').map(x => x.group));
    const where0 = { block: B.n };
    // A4 unlisted groups / A17 reasons
    for (const g of ctx.groups) {
      S.n('unlisted_untrained');
      if (!trained.has(g) && !(listedNT.has(g) && listedNT.get(g).reason)) S.hit('unlisted_untrained', { ...where0, group: g }, g + ' is neither trained nor listed with a reason');
    }
    for (const x of B.notTrained) { S.n('unexplained_decisions'); if (!x.reason) S.hit('unexplained_decisions', { ...where0, group: x.group }, 'not trained, no reason'); }
    // A17 a lowered peak says what stopped it: `stopped_by` on the entry (PLANNER_SPEC 4.6), or - the 0.4 form, a list of group
    // names - a time_lower_peak warning that names the group
    for (const lp of (B.n === (X.tc.training_block || 1) ? X.tc.lowered_peak || [] : [])) {
      S.n('unexplained_decisions');
      const g = typeof lp === 'string' ? lp : lp && lp.group;
      const told = (lp && typeof lp === 'object' && lp.stopped_by) || X.warnings.some(w => w && /lower_peak/.test(String(w.key)) && w.args && [].concat(w.args.group || []).includes(g));
      if (!told) S.hit('unexplained_decisions', { ...where0, group: g }, 'a lowered peak for ' + g + ' with no stopped_by and no warning that names it');
    }
    // A3 the below-floor state
    for (const g of ctx.groups) S.n('below_floor_states');
    for (const x of B.below) S.hit('below_floor_states', { ...where0, group: x.group }, x.group + ' is listed as trained below the floor (' + (x.reason || 'no reason') + ')');
    const twoPlus = new Set();
    for (const W of B.weeks) for (const D of W.days) if (D.main) for (const g of ctx.groups) if (!trained.has(g) && (W.T.K[D.weekday][g] || 0) >= 2) twoPlus.add(g);
    for (const g of twoPlus) if (!B.below.some(x => x.group === g)) S.hit('below_floor_states', { ...where0, group: g }, g + ' has 2+ exercises on a day and is not listed as trained');

    const bf = { n: B.n, N: B.N, format: B.format, trained: B.trained.slice(), groups: {} };
    for (const W of B.weeks) {
      const leg = W.legDays.map(D => D.weekday);
      for (const g of B.trained) {
        // A2 floors on the main days
        const F = floorOf(g, W, X, ctx);
        const q = W.T.Qmain[g];
        const id = g === 'calves' ? 'calf_floor_misses' : 'floor_misses';
        S.n(id);
        if (q < F - EPS) {
          S.hit(id, { week: W.n, group: g }, g + ' ' + r2(q) + ' < ' + F, { value: r2(q), limit: F, listed_below_floor: B.below.some(x => x.group === g) });
          if (X.competitive && X.athletic_family && g !== 'calves') S.hit('athlete_floor_misses', { week: W.n, group: g }, g + ' ' + r2(q) + ' < ' + F);
        }
      }
      // T0-SES-10 / A5: never 1 exercise for a group on a main day
      for (const D of W.days) {
        if (!D.main) continue;
        const exemptDay = P.one_exercise_exempt_formats.includes(D.format) || B.format === 'strength_roles';
        for (const g of ctx.groups) {
          const k = W.T.K[D.weekday][g] || 0;
          if (!k || (epg.exempt_groups || []).includes(g)) continue;
          S.n('one_exercise_groups');
          if (exemptDay) continue;
          const hi = (D.full_body ? epg.full_body_day : epg.split_day)[1];
          if (k > hi) { oneExKinds.more_than_max = (oneExKinds.more_than_max || 0) + 1; S.hit('one_exercise_groups', { week: W.n, weekday: D.weekday, group: g }, g + ' has ' + k + ' exercises (max ' + hi + ')', { value: k, kind: 'more_than_max' }); continue; }
          if (k !== 1) continue;
          const U = D.units.find(u => u.prime.includes(g));
          const classLift = X.classSlots.has(U.slot) || (U.role === 'work' && classGroups.has(g));
          const listed = X.patternSlots.has(U.slot);
          if (classLift) continue;
          if (listed && !trained.has(g) && B.weeks.every(w2 => { const d2 = w2.days.find(d => d.weekday === D.weekday); const u2 = d2 && d2.units.find(u => u.slot === U.slot); return !u2 || u2.sets === (P.pattern_keep.sets || 2); })) continue;
          const kind = U.origin === 'pattern_kept' ? 'kept_movement_not_listed' : trained.has(g) ? 'trained_group_squeezed' : 'lone_station';
          oneExKinds[kind] = (oneExKinds[kind] || 0) + 1;
          S.hit('one_exercise_groups', { week: W.n, weekday: D.weekday, group: g, slot_id: U.slot }, g + ' has 1 exercise (' + U.exercise_id + ', origin ' + U.origin + ')', { value: 1, origin: U.origin, trained: trained.has(g), kind });
        }
        // T0-SES-11 calves on leg days
        if (trained.has('calves')) {
          const calfUnits = D.units.filter(U => U.prime.includes('calves'));
          if (leg.includes(D.weekday)) {
            S.n('calf_rule');
            if (calfUnits.length !== 1) S.hit('calf_rule', { week: W.n, weekday: D.weekday }, calfUnits.length + ' calf exercises on a leg day');
            else if (calfUnits[0].sets < ((P.calves_per_leg_day || {})[X.level] || 3)) S.hit('calf_rule', { week: W.n, weekday: D.weekday, slot_id: calfUnits[0].slot }, 'calf exercise at ' + calfUnits[0].sets + ' sets');
          } else if (calfUnits.length > 1) { S.n('calf_rule'); S.hit('calf_rule', { week: W.n, weekday: D.weekday }, calfUnits.length + ' calf exercises on one day'); }
        }
      }
      // T0-SES-12 a rear-delt exercise every week while the shoulders are trained
      if (trained.has('shoulders')) {
        S.n('rear_delt_week');
        let rearStation = false, rowCredit = 0;
        for (const D of W.days) for (const U of D.units) { const c = U.lead.credits.rear_delts || 0; if (c >= 1 - EPS) rearStation = true; else rowCredit += c * U.sets; }
        if (!rearStation && rowCredit < P.rear_from_rows_min - EPS) S.hit('rear_delt_week', { week: W.n }, 'no rear-delt station, ' + r2(rowCredit) + ' sets of row credit');
      }
      // T1-POL-07 every primary pattern stays in the week (main + optional days)
      const have = { knee: false, hip: false, hpush: false, hpull: false };
      for (const D of W.days) for (const U of D.units) { const p = patternOf(U); if (p === 'BKD' || p === 'UKD') have.knee = true; if (p === 'BHD' || p === 'UHD') have.hip = true; if (p === 'HPUSH') have.hpush = true; if (p === 'HPULL') have.hpull = true; }
      // not asked where the plan says the group has no station at all (kit, exclusions, a credit-only line): reason no_station / credit_only
      const groupOfPattern = { knee: 'quads', hip: 'hips', hpush: 'chest', hpull: 'back' };
      for (const [k, v] of Object.entries(have)) {
        const nt = listedNT.get(groupOfPattern[k]);
        if (!trained.has(groupOfPattern[k]) && nt && (nt.reason === 'no_station' || nt.reason === 'credit_only')) continue;
        S.n('missing_primary_pattern');
        if (!v) S.hit('missing_primary_pattern', { week: W.n, group: groupOfPattern[k] }, 'no ' + k + ' exercise in the week (' + groupOfPattern[k] + (trained.has(groupOfPattern[k]) ? ' is listed as trained' : nt ? ' is out for ' + nt.reason : '') + ')', { pattern: k });
      }
    }
    for (const g of B.trained) bf.groups[g] = { main: B.weeks.map(W => r2(W.T.Qmain[g])), own_main: B.weeks.map(W => W.T.OwnMain[g]), all: B.weeks.map(W => r2(W.T.Qall[g])) };
    bf.total = B.weeks.map(W => W.T.Tot); bf.total_main = B.weeks.map(W => W.T.TotMain);
    facts.blocks.push(bf);

    // T1-POL-05 the objective: how much of the week the policy keeps. Legal, never a violation; it keeps the score honest when
    // a plan trains nobody (no floor to miss, no stairway to go flat) - the keep vector itself is judged by A14 / A15
    const outTime = B.notTrained.filter(x => x.reason === 'time' && !trained.has(x.group)).map(x => x.group);
    const wOf = (g) => (BIG_MOVERS.includes(g) ? 2 : 1);
    S.n('groups_out_for_time', trained.size + outTime.length);
    for (const g of outTime) S.hit('groups_out_for_time', { ...where0, group: g }, g + ' is not trained directly (time)');
    keptW.out += sum(outTime.map(wOf)); keptW.all += sum([...trained, ...outTime].map(wOf));
    // T1-POL-05 keep-order signal
    const pi = keepOrder(X, ctx);
    for (const [i, g] of pi.entries()) {
      if (!trained.has(g)) continue;
      S.n('keep_order_skips');
      const skipped = pi.slice(0, i).filter(h => !trained.has(h) && listedNT.has(h) && listedNT.get(h).reason === 'time');
      if (skipped.length) S.hit('keep_order_skips', { ...where0, group: g }, g + ' is trained while ' + skipped.join(', ') + ' (earlier in the keep order) ' + (skipped.length > 1 ? 'are' : 'is') + ' out for time', { skipped });
    }
    // DR-5: free minutes while a group is out for time; T1-POL-13: athletic room kept while a big mover is out
    const outForTime = B.notTrained.filter(x => x.reason === 'time').map(x => x.group);
    const peak = B.weeks[B.weeks.length - 1 - (B.weeks[B.weeks.length - 1].raw.test ? 1 : 0)] || B.weeks[B.weeks.length - 1];
    for (const D of peak.days) {
      if (!D.main || D.est === null) continue;
      S.n('slack_while_untrained');
      if (outForTime.length && D.est < P.slack_factor * D.limit - EPS) S.hit('slack_while_untrained', { week: peak.n, weekday: D.weekday }, D.est + ' of ' + D.limit + ' min used while ' + outForTime.join(', ') + ' ' + (outForTime.length > 1 ? 'are' : 'is') + ' out for time', { value: D.est, limit: D.limit });
      if (X.athletic_family && !X.competitive) {
        S.n('athletic_vs_big_mover');
        const big = outForTime.filter(g => BIG_MOVERS.includes(g));
        const stations = D.items.filter(I => I.bk === 'athletic' && I.bucket !== 'AP_JUMP_LIMITED_KNEE').length, oly = D.items.filter(I => I.bk === 'power').length;
        if (big.length && (stations >= 2 || oly >= 1)) S.hit('athletic_vs_big_mover', { week: peak.n, weekday: D.weekday }, big.join(', ') + ' out for time while the day holds ' + stations + ' athletic station(s) and ' + oly + ' Olympic lift(s)');
      }
    }
  }
  if (Object.keys(oneExKinds).length) S.extra('one_exercise_groups', { by_kind: oneExKinds });
  if (keptW.all) S.sev('groups_out_for_time', keptW.out / keptW.all);
  // T1-POL-03 / -04: fits and offers
  const tc = X.tc;
  if (typeof tc.fits === 'boolean') {
    S.n('fits_inconsistent'); S.n('offer_missing');
    if (tc.fits) {
      const out = (tc.not_trained_directly || []).filter(x => x && x.reason === 'time').map(x => x.group);
      if (out.length || (tc.lowered_peak || []).length) S.hit('fits_inconsistent', {}, 'fits = true with ' + (out.length ? out.join(', ') + ' out for time' : 'a lowered peak'));
    } else if (!(plan.offers || []).length) S.hit('offer_missing', {}, 'fits = false and no offer');
  }
  for (const o of plan.offers || []) {
    const isSchedule = o.schedule || /more_days|longer_sessions/.test(String(o.key));
    if (!isSchedule || o.chosen) continue;
    S.n('offer_invalid');
    const a = o.args || {};
    const minutes = o.schedule ? o.schedule.minutes : (a.min ?? a.minutes);
    const days = o.schedule ? o.schedule.days : a.days;
    const bad = [];
    if (minutes !== undefined && minutes !== null) {
      if (!P.minutes_allowed.includes(minutes)) bad.push(minutes + ' min is not an allowed session length');
      else if (P.minutes_over_90_competitive_only && minutes > 90 && !X.competitive) bad.push(minutes + ' min is for competitive athletes only');
    }
    if (days !== undefined && days !== null && (days < 2 || days > 6)) bad.push(days + ' days');
    if (bad.length) S.hit('offer_invalid', {}, o.key + ': ' + bad.join('; '), { offer: o.key, args: a });
  }
  // T1-POL-11 superset recommendations
  for (const W of X.weeks) for (const D of W.days) {
    if (!D.main) continue;
    const recs = D.raw.superset_recommendations || [];
    S.n('missing_superset_recs');
    const needOff = recs.filter(r => r.needed && !r.on);
    if (needOff.length) S.hit('missing_superset_recs', { week: W.n, weekday: D.weekday }, 'needed pair(s) not on: ' + needOff.map(r => r.pair_id).join(', '));
    else if (D.raw.supersets_needed && !recs.some(r => r.needed)) S.hit('missing_superset_recs', { week: W.n, weekday: D.weekday }, 'supersets_needed with no needed pair');
    for (const r of recs) { S.n('supersets_on_unneeded'); if (r.on && !r.needed) S.hit('supersets_on_unneeded', { week: W.n, weekday: D.weekday }, 'pair ' + r.pair_id + ' is on and not needed'); }
  }
  return facts;
}

function keepOrder(X, ctx) {
  const P = ctx.P; const out = [];
  const add = (g) => { if (ctx.groups.includes(g) && !out.includes(g)) out.push(g); };
  for (const g of X.focusGroups) add(g);
  const pin = (P.keep_order_r2 || {}).pin_first_50_racket;
  const A50 = P.population.active_aging_50 || {};
  if (pin && X.age !== null && X.age >= (pin.age_gte || 50) && (A50.racket_profiles || []).includes(X.profile_id)) for (const g of pin.groups || []) add(g);
  const base = X.athletic_family && (P.keep_order_r2 || {}).athletic ? P.keep_order_r2.athletic : P.keep_order;
  for (const g of base || []) add(g);
  for (const g of ctx.groups) add(g);
  return out;
}

function groupCeiling(g, B, X, ctx) {
  const st = (X.meta.stairway || []).find(s => s.training_block === B.n) || {};
  const caps = (ctx.linesOfGroup[g] || []).map(l => (st.cap || {})[l] ?? (X.targets.cap || {})[l]).filter(v => typeof v === 'number');
  const level = (ctx.linesOfGroup[g] || []).map(l => (X.targets.level_cap || X.targets.cap || {})[l]).filter(v => typeof v === 'number');
  const starts = (ctx.linesOfGroup[g] || []).map(l => (st.start || {})[l] ?? (X.targets.start || {})[l]).filter(v => typeof v === 'number');
  return { cap: caps.length ? Math.max(...caps) : null, level_cap: level.length ? Math.max(...level) : null, start: starts.length ? Math.max(...starts) : null };
}

function checkStairway(S, X, ctx, plan) {
  const P = ctx.P;
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
    // T0-STW-01 the block is complete: stair weeks 1..N
    S.n('deload_inside_block');
    if (B.weeks.some((W, i) => W.stair_week !== i + 1)) S.hit('deload_inside_block', where0, 'stair weeks ' + B.weeks.map(W => W.stair_week).join(','));
    const h = Math.ceil(N / 2);
    const lines = new Set();
    for (const W of B.weeks) for (const l of Object.keys(W.raw.step_by_muscle || {})) lines.add(l);
    for (const [i, W] of B.weeks.entries()) {
      const prev = i ? B.weeks[i - 1] : null;
      const w = W.raw;
      // T0-STW-02, -04 planned steps
      for (const [l, v] of Object.entries(w.step_by_muscle || {})) {
        if (typeof v !== 'number') continue;
        S.n('planned_step_over');
        if (v > P.planned_step_max + EPS) S.hit('planned_step_over', { week: W.n, line: l }, l + ' step ' + r4(v));
        if (i === 0) { S.n('steps_in_flat'); if (Math.abs(v) > EPS) S.hit('steps_in_flat', { week: W.n, line: l }, 'a step in week 1'); }
      }
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
      for (const D of W.days) for (const I of D.items) if (I.isTest && RES_KINDS.includes(I.bk) && /^rm_/.test(String(I.raw.test && I.raw.test.test)) && I.raw.laterality && I.raw.laterality !== 'bilateral') S.hit('test_violation', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, 'rep-max test on a ' + I.raw.laterality + ' pick');
      // T0-EFF-02 intensifiers: the last stairway week only, one a day, never on a free-weight compound / glute bridge
      for (const D of W.days) {
        const ints = D.items.filter(I => I.raw.effort && (I.raw.effort.intensifier || I.raw.effort.last_set === 'myo'));
        if (!ints.length) continue;
        S.n('intensifier_violation');
        const never = (P.intensifiers.never_credit_classes || []);
        if (P.intensifiers.last_week_only && i !== N - 1) S.hit('intensifier_violation', { week: W.n, weekday: D.weekday }, 'an intensifier in stair week ' + (i + 1) + ' of ' + N);
        else if (ints.length > (P.intensifiers.per_day || 1)) S.hit('intensifier_violation', { week: W.n, weekday: D.weekday }, ints.length + ' intensifiers on one day');
        else { const bad = ints.find(I => I.ex && never.includes(I.ex.credit_class) && !((I.ex.tags || []).includes('machine') || I.ex.constraint >= 4)); if (bad) S.hit('intensifier_violation', { week: W.n, weekday: D.weekday, slot_id: bad.raw.slot_id }, 'intensifier on ' + bad.raw.exercise_id + ' (' + bad.ex.credit_class + ')'); }
      }
    }
    // T3-STW-05 early steps never larger than late steps (per line)
    for (const l of lines) {
      const steps = B.weeks.map(W => (W.raw.step_by_muscle || {})[l]);
      const early = steps.slice(1, h).filter(v => typeof v === 'number'), late = steps.slice(h).filter(v => typeof v === 'number');
      if (!early.length || !late.length) continue;
      S.n('early_step_larger');
      if (Math.max(...early) > Math.min(...late) + 1e-6) S.hit('early_step_larger', { ...where0, line: l }, l + ': early ' + r4(Math.max(...early)) + ' > late ' + r4(Math.min(...late)));
      // T3-STW-01 a planned target never drops
      const tg = B.weeks.map(W => (W.raw.target_by_muscle || {})[l]);
      for (let i = 1; i < tg.length; i++) if (typeof tg[i] === 'number' && typeof tg[i - 1] === 'number') { S.n('set_drops'); if (tg[i] < tg[i - 1] - EPS) S.hit('set_drops', { week: B.weeks[i].n, line: l }, 'planned target of ' + l + ' drops ' + tg[i - 1] + ' -> ' + tg[i], { kind: 'target' }); }
    }

    const bfacts = { block: B.n, N, format: B.format, flat_total: null, flat_min: null, flat_main: null, groups: {} };
    if (B.format === 'circuit') {
      // T3-STW-10 circuits climb by work seconds
      for (let i = 1; i < N; i++) {
        const a = B.weeks[i - 1].raw.circuit, b = B.weeks[i].raw.circuit;
        if (!a || !b) continue;
        S.n('circuit_flat');
        const top = b.to_s ?? Infinity;
        if (b.work_s <= a.work_s && a.work_s < top) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work ' + a.work_s + ' s -> ' + b.work_s + ' s');
        else if (b.work_s > a.work_s * 1.10 + EPS) S.hit('circuit_flat', { week: B.weeks[i].n }, 'work ' + a.work_s + ' s -> ' + b.work_s + ' s (more than 10 %)');
      }
    }
    if (B.climbsInSets) {
      const Tot = B.weeks.map(W => W.T.Tot), TotMain = B.weeks.map(W => W.T.TotMain);
      const noteAllows = (W) => { const keys = [...(W.raw.why || []), ...(W.raw.notes || []), ...X.warnings].map(x => x && x.key); return P.total_rise_note_keys.some(k => keys.includes(k)); };
      for (let i = 1; i < N; i++) {
        // T0-STW-03 / A9: the weekly total rises by at most max(1 set, 7 %); 10 % (strictly below) only with the printed note
        S.n('weekly_rise_over');
        const d = Tot[i] - Tot[i - 1];
        const lim7 = Math.max(1, Math.floor(P.total_rise_pct * Tot[i - 1] + EPS));
        const over10 = d > 1 + EPS && d >= P.total_rise_ceiling * Tot[i - 1] - EPS;
        if (over10) S.hit('weekly_rise_over', { week: B.weeks[i].n }, 'total ' + Tot[i - 1] + ' -> ' + Tot[i] + ' (+' + r2(100 * d / Tot[i - 1]) + ' %, at or above 10 %)', { value: d, limit: lim7, kind: 'ceiling_10' });
        else if (d > lim7 + EPS && !noteAllows(B.weeks[i])) S.hit('weekly_rise_over', { week: B.weeks[i].n }, 'total ' + Tot[i - 1] + ' -> ' + Tot[i] + ' (+' + d + ', limit ' + lim7 + ')', { value: d, limit: lim7, kind: 'placed_7' });
      }
      // A7 flat weeks beyond the arithmetic minimum
      const flatOf = (arr) => { let f = 0; for (let i = 1; i < arr.length; i++) if (arr[i] - arr[i - 1] < 0.5) f++; return f; };
      const minFlat = (arr) => Math.max(0, (arr.length - 1) - Math.max(0, Math.round(arr[arr.length - 1] - arr[0])));
      const fT = flatOf(Tot), mT = minFlat(Tot), fM = flatOf(TotMain), mM = minFlat(TotMain);
      S.n('flat_weeks_excess', N - 1); S.n('main_flat_weeks_excess', N - 1);
      for (let k = 0; k < Math.max(0, fT - mT); k++) S.hit('flat_weeks_excess', where0, 'total ' + Tot.join(' ') + ': ' + fT + ' flat weeks, ' + mT + ' unavoidable');
      for (let k = 0; k < Math.max(0, fM - mM); k++) S.hit('main_flat_weeks_excess', where0, 'main-day total ' + TotMain.join(' ') + ': ' + fM + ' flat weeks, ' + mM + ' unavoidable');
      bfacts.flat_total = fT; bfacts.flat_min = mT; bfacts.flat_main = fM; bfacts.flat_main_min = mM;
      // T3-STW-04 / A9 the last week is the hardest
      S.n('last_week_not_hardest');
      if (Tot[N - 1] < Math.max(...Tot) - EPS) S.hit('last_week_not_hardest', where0, 'total ' + Tot.join(' '));
      else if (N === 12 && Math.min(...Tot.slice(8)) < Math.max(...Tot.slice(0, 8)) - EPS) S.hit('last_week_not_hardest', where0, 'weeks 9-12 are not the four hardest: ' + Tot.join(' '));
      else if (B.trained.length && !(TotMain[N - 1] > TotMain[0] + EPS)) S.hit('last_week_not_hardest', where0, 'the main-day total does not rise: ' + TotMain.join(' '));
      // T3-STW-03 holds (soft)
      const HR = P.hold_rules;
      let holdX = 0; const holdNotes = [];
      const longestHold = (arr) => { let best = 1, run = 1; for (let i = 1; i < arr.length; i++) { if (Math.abs(arr[i] - arr[i - 1]) < 0.5) run++; else run = 1; best = Math.max(best, run); } return best; };
      if (N >= (HR.min_N || 8)) {
        for (const g of B.trained) {
          if (!BIG_MOVERS.includes(g)) continue;
          const q = B.weeks.map(W => W.T.Qmain[g]);
          if (q[N - 1] - q[0] < (HR.min_climb || 3) - EPS) continue;
          const lh = longestHold(q);
          if (lh > h + (HR.hold_extra_weeks || 1)) { holdX += lh - (h + (HR.hold_extra_weeks || 1)); holdNotes.push(g + ' holds ' + lh + ' weeks'); }
          if (q[N - 1] - q[h - 1] < 0.5 - EPS) { holdX += 1; holdNotes.push(g + ' does not climb in the second half'); }
        }
        const lm = longestHold(TotMain);
        if (lm > Math.floor((HR.total_hold_max_frac || 0.5) * N)) { holdX += lm - Math.floor((HR.total_hold_max_frac || 0.5) * N); holdNotes.push('main-day total holds ' + lm + ' weeks'); }
      }
      let twoFlat = 0; for (let i = 2; i < N; i++) if (Math.abs(Tot[i] - Tot[i - 1]) < 0.5 && Math.abs(Tot[i - 1] - Tot[i - 2]) < 0.5) twoFlat++;
      if (twoFlat) { holdX += twoFlat; holdNotes.push('the total is flat two weeks running ' + twoFlat + ' time(s)'); }
      S.n('hold_excess', N - 1);
      for (let k = 0; k < holdX; k++) S.hit('hold_excess', where0, holdNotes.join('; '));

      // per exercise: no exercise ever loses a set inside the block (R-MONO); added exercises (T6-CNT-04)
      const slotSeries = new Map();   // weekday|slot -> [{week index, sets, exercise, origin}]
      for (const [i, W] of B.weeks.entries()) for (const D of W.days) for (const U of D.units) { const key = D.weekday + '|' + U.slot; if (!slotSeries.has(key)) slotSeries.set(key, []); slotSeries.get(key).push({ i, sets: U.sets, U, W, D }); }
      const ebStarts = new Set([...B.ebs.values()].map(ws => ws[0].n));
      for (const [key, ser] of slotSeries) {
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
        else if (first.U.origin !== 'template' && first.sets < (P.placement_min_sets || 2) && !first.U.hasTest) S.hit('bad_added_exercise', { week: first.W.n, weekday: first.D.weekday, slot_id: first.U.slot }, first.U.exercise_id + ' (' + first.U.origin + ') enters at ' + first.sets + ' set');
      }
      // per trained group
      let earlyPeak = 0;
      for (const g of B.trained) {
        const own = B.weeks.map(W => W.T.OwnMain[g]), q = B.weeks.map(W => W.T.Qmain[g]), qa = B.weeks.map(W => W.T.Qall[g]);
        const mc = minClimb(g, B, X, ctx);
        // A6 / T1-POL-12 the minimum climb on the main days, in the group's own sets
        S.n('trained_not_climbing'); S.n('flat_groups');
        if (own[N - 1] - own[0] < mc - EPS) S.hit('trained_not_climbing', { ...where0, group: g }, g + ' own main-day sets ' + own[0] + ' -> ' + own[N - 1] + ' (minimum climb ' + mc + ')', { value: own[N - 1] - own[0], limit: mc });
        if (qa[N - 1] - qa[0] < mc - 0.5 - EPS) S.hit('flat_groups', { ...where0, group: g }, g + ' credited sets ' + r2(qa[0]) + ' -> ' + r2(qa[N - 1]) + ' (minimum climb ' + mc + ')');
        // A6 / T3-STW-01 a trained group never drops
        for (let i = 1; i < N; i++) {
          S.n('set_drops');
          const ebStart = ebStarts.has(B.weeks[i].n);
          if (own[i] < own[i - 1] - EPS || q[i] < q[i - 1] - 0.5 - EPS) {
            S.hit('set_drops', { week: B.weeks[i].n, group: g }, g + ' ' + (own[i] < own[i - 1] - EPS ? 'own sets ' + own[i - 1] + ' -> ' + own[i] : 'credited sets ' + r2(q[i - 1]) + ' -> ' + r2(q[i])), { kind: 'group' });
            if (ebStart) S.hit('restart_at_block', { week: B.weeks[i].n, group: g }, g + ' drops at an exercise-block start');
          }
          if (ebStart) S.n('restart_at_block');
        }
        // T3-STW-06 the peak is in the last week
        S.n('peak_not_last');
        if (Math.max(...qa) > qa[N - 1] + EPS) S.hit('peak_not_last', { ...where0, group: g }, g + ' peaks at ' + r2(Math.max(...qa)) + ' in week ' + (B.weeks[qa.indexOf(Math.max(...qa))].n) + ', last week ' + r2(qa[N - 1]));
        // A20 the last set arrives before week N-1 (climb of 3 or more)
        S.n('early_peak');
        const lastRise = (() => { let k = 0; for (let i = 1; i < N; i++) if (own[i] > own[i - 1] + EPS) k = i; return k; })();
        if (own[N - 1] - own[0] >= 3 - EPS && lastRise < N - 2) { S.hit('early_peak', { ...where0, group: g }, g + ' reaches its last set in week ' + B.weeks[lastRise].n + ' of ' + N); earlyPeak++; }
        // T7-PLC-04 the climb sits on the main days
        if (BIG_MOVERS.includes(g)) { S.n('climb_on_optional_only'); if (qa[N - 1] - qa[0] >= 1 - EPS && q[N - 1] - q[0] < 0.5 - EPS) S.hit('climb_on_optional_only', { ...where0, group: g }, g + ' rises ' + r2(qa[0]) + ' -> ' + r2(qa[N - 1]) + ' on all days, ' + r2(q[0]) + ' -> ' + r2(q[N - 1]) + ' on the main days'); }
        // T5-CAP-01 / -03 ceilings (per line, the inventory's reading; per group = decision D7, soft); T2-FLR-06 week 1 under the ceiling
        const C = groupCeiling(g, B, X, ctx);
        const st = (X.meta.stairway || []).find(x => x.training_block === B.n) || {};
        const carrier = ((P.floor_carriers || {})[g] || ctx.linesOfGroup[g] || []).find(l => typeof ((st.cap || {})[l] ?? (X.targets.cap || {})[l]) === 'number');
        for (const l of ctx.linesOfGroup[g] || []) {
          const cap = (st.cap || {})[l] ?? (X.targets.cap || {})[l];
          if (typeof cap !== 'number') continue;
          for (let i = 0; i < N; i++) {
            S.n('over_ceiling');
            const dir = B.weeks[i].T.LdirAll[l], cred = B.weeks[i].T.Lall[l];
            if (dir > cap + EPS || cred > cap + 1 + EPS) S.hit('over_ceiling', { week: B.weeks[i].n, group: g, line: l }, l + ' direct ' + dir + ', credited ' + r2(cred) + ' on all days, ceiling ' + cap, { value: r2(cred), limit: cap });
          }
          const mcl = l === carrier ? mc : Math.min(mc, P.min_climb.line || 1);
          const w1 = B.weeks[0].T.LdirMain[l];
          S.n('week1_at_ceiling');
          if (w1 > cap - mcl + EPS) S.hit('week1_at_ceiling', { ...where0, group: g, line: l }, l + ' week 1 ' + r2(w1) + ' direct sets on the main days against ceiling ' + cap + ' (minimum climb ' + mcl + ')', { value: r2(w1), limit: cap });
        }
        for (let i = 0; i < N; i++) {
          S.n('over_30'); if (qa[i] > P.absolute_cap + EPS) S.hit('over_30', { week: B.weeks[i].n, group: g }, g + ' ' + r2(qa[i]) + ' credited sets');
          if (C.cap !== null && P.two_line_groups === 'carrier_max') { S.n('group_over_ceiling'); if (qa[i] > C.cap + 1 + EPS) S.hit('group_over_ceiling', { week: B.weeks[i].n, group: g }, g + ' credited ' + r2(qa[i]) + ' on all days, group ceiling ' + C.cap, { value: r2(qa[i]), limit: C.cap }); }
        }
        // A8 one progression fact per trained group and week from week 2 on
        for (let i = 1; i < N; i++) {
          S.n('progression_missing');
          const pr = Array.isArray(B.weeks[i].raw.progression) ? B.weeks[i].raw.progression.filter(p => p && p.group === g) : [];
          if (pr.length !== 1) S.hit('progression_missing', { week: B.weeks[i].n, group: g }, g + ' has ' + pr.length + ' progression entries');
        }
        bfacts.groups[g] = { own_main: own, credited_main: q.map(r2), credited_all: qa.map(r2), min_climb: mc, ceiling: C.cap, level_ceiling: C.level_cap, start: C.start,
          flat_transitions: own.filter((v, i) => i > 0 && v - own[i - 1] < 0.5).length, last_rise_week: B.weeks[lastRise].n };
      }
      bfacts.early_peak_groups = earlyPeak;
      // T5-CAP-04 (info): sets under the level ceiling; T8-BAL-04 balance of relative progress
      let shortfall = 0; const prog = [];
      for (const g of B.trained) { const f = bfacts.groups[g]; if (f.level_ceiling !== null) shortfall += Math.max(0, f.level_ceiling - f.credited_all[N - 1]); if (f.ceiling !== null && f.start !== null && f.ceiling > f.start) prog.push((f.credited_all[N - 1] - f.start) / (f.ceiling - f.start)); }
      bfacts.ceiling_shortfall = r2(shortfall);
      bfacts.progress_spread = prog.length > 1 ? r2(Math.max(...prog) - Math.min(...prog)) : 0;
      // T3-STW-07 / DR-21: the printed target against what is placed
      const trainedLines = new Set(B.trained.flatMap(g => ctx.linesOfGroup[g] || []));
      for (const W of B.weeks) for (const [l, t] of Object.entries(W.raw.target_by_muscle || {})) {
        if (typeof t !== 'number') continue;
        S.n('tracking_error');
        const g = ctx.groupOfLine[l];
        if (!trainedLines.has(l)) { S.hit('tracking_error', { week: W.n, line: l }, 'a target (' + t + ') is printed for ' + l + ', whose group is not trained', { kind: 'target_for_untrained' }); continue; }
        const placed = W.T.Lmain[l];   // the stairway is placed and read on the main days
        if (Math.abs(placed - t) > 1 + EPS) S.hit('tracking_error', { week: W.n, line: l, group: g }, l + ' placed ' + r2(placed) + ' on the main days against target ' + t, { kind: 'gap', value: r2(placed - t) });
      }
    } else {
      // formats that do not climb in sets still must not lose sets on trained groups (flat = allowed)
      for (const g of B.trained) for (let i = 1; i < N; i++) { S.n('set_drops'); const a = B.weeks[i - 1].T.Qmain[g], b = B.weeks[i].T.Qmain[g]; if (b < a - 0.5 - EPS) S.hit('set_drops', { week: B.weeks[i].n, group: g }, g + ' credited sets ' + r2(a) + ' -> ' + r2(b), { kind: 'group' }); }
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

function checkTime(S, X, ctx, plan) {
  const P = ctx.P;
  const facts = { days: 0, over: 0, over_main: 0, over_optional: 0, over_test_days: 0, over_with_an_old_style_warning: 0, over_band: 0, max_ratio: 0,
    recost: { compared: 0, mean_abs_gap: 0, max_gap: 0, unknown: 0, days_over_by_recost: 0, days_over_band_by_recost: 0 } };
  // the 0.4 engine tells a long day through meta.warnings (warning.long_day, .long_day_optional, .test_day_long); the scorer reports
  // how many of the days over the minutes carry one, and still counts them (A10 asks for time_check.overrun and an offer)
  const oldWarned = (W, D) => X.warnings.some(w => w && /long_day|test_day_long/.test(String(w.key)) && w.args && (w.args.day === D.weekday || w.args.day === 'weekday.' + D.weekday) && (w.args.week === undefined || w.args.week === W.n));
  const tc = X.tc;
  const overrun = Array.isArray(tc.overrun) ? tc.overrun.filter(o => o && o.weekday) : [];
  const hasRemovingOffer = (plan.offers || []).some(o => !o.chosen && (o.kind ? /longer|switch|block|exact/.test(String(o.kind)) : /longer_sessions|block_off/.test(String(o.key))));
  for (const o of overrun) { S.n('unexplained_decisions'); if (!o.cause) S.hit('unexplained_decisions', { weekday: o.weekday }, 'an overrun without a cause'); }
  // T4-TIME-02 the session length
  S.n('length_invalid');
  if (X.minutes !== null && !P.minutes_allowed.includes(X.minutes)) S.hit('length_invalid', {}, X.minutes + ' min');
  else if (X.minutes > 90 && P.minutes_over_90_competitive_only && !X.competitive) S.hit('length_invalid', {}, X.minutes + ' min for a non-competitive client');
  const bandF = P.band_factor.full_body ?? 1.1;
  let overMin = 0, gapSum = 0;
  for (const W of X.weeks) for (const D of W.days) {
    if (!D.gym || D.est === null) continue;
    const where = { week: W.n, weekday: D.weekday };
    const isTestDay = D.items.some(I => I.raw.test);
    facts.days++;
    S.n('days_over_unwarned'); S.n('days_over_band');
    facts.max_ratio = Math.max(facts.max_ratio, D.est / D.limit);
    if (D.est > D.limit + EPS) {
      facts.over++; if (D.main) facts.over_main++; else facts.over_optional++; if (isTestDay) facts.over_test_days++;
      const warned = oldWarned(W, D); if (warned) facts.over_with_an_old_style_warning++;
      const listed = overrun.find(o => o.weekday === D.weekday && (typeof o.minutes !== 'number' || o.minutes >= D.est - D.limit - EPS));
      if (!(listed && hasRemovingOffer)) S.hit('days_over_unwarned', where, D.est + ' min of ' + D.limit + (isTestDay ? ' (test day)' : '') + (D.optional ? ' (optional day)' : ''), { value: D.est, limit: D.limit, test_day: isTestDay, kind: D.kind, old_style_warning: warned });
    }
    if (D.est > Math.ceil(D.limit * bandF) + EPS) { facts.over_band++; S.hit('days_over_band', where, D.est + ' min of ' + D.limit + ' (band ' + Math.ceil(D.limit * bandF) + ')' + (isTestDay ? ' (test day)' : ''), { value: D.est, limit: Math.ceil(D.limit * bandF), test_day: isTestDay }); }
    if (D.main && !isTestDay) {
      S.n('days_not_holding');
      const f = D.full_body ? bandF : (P.band_factor.split ?? 1);
      if (D.est > D.limit * f + EPS) S.hit('days_not_holding', where, D.est + ' min of ' + D.limit + ' (factor ' + f + ')');
      overMin += Math.max(0, D.est - D.limit);
    }
    // T4-TIME-03 bootcamp minutes (for a 45-min choice)
    if (D.main && D.format === 'circuit' && D.limit === 45) { S.n('format_minutes'); const [lo, hi] = P.bootcamp_session_min; if (D.est < lo - EPS || D.est > hi + EPS) S.hit('format_minutes', where, D.est + ' min (bootcamp ' + lo + '-' + hi + ')'); }
    // A12 the re-cost of the dosed items
    const rc = recostDay(D, W, ctx);
    if (rc.minutes === null) { facts.recost.unknown++; continue; }
    S.n('minutes_recost_gap');
    const gap = D.est - rc.minutes;
    facts.recost.compared++; gapSum += Math.abs(gap); if (Math.abs(gap) > Math.abs(facts.recost.max_gap)) facts.recost.max_gap = gap;
    if (rc.minutes > D.limit + EPS) facts.recost.days_over_by_recost++;
    if (rc.minutes > Math.ceil(D.limit * bandF) + EPS) facts.recost.days_over_band_by_recost++;
    if (Math.abs(gap) > P.recost_tolerance_min + EPS) S.hit('minutes_recost_gap', where, 'est ' + D.est + ' min, re-cost ' + rc.minutes + ' (' + (gap > 0 ? '+' : '') + gap + ')', { value: D.est, recost: rc.minutes, parts: rc.parts, test_day: isTestDay });
  }
  facts.recost.mean_abs_gap = facts.recost.compared ? r2(gapSum / facts.recost.compared) : 0;
  facts.max_ratio = r2(facts.max_ratio);
  S.set('overrun_minutes', overMin, null);
  // T7-WEEK-02 (info): the spread of the last week's main days
  const lastW = X.weeks[X.weeks.length - 1];
  if (lastW) { const e = lastW.days.filter(D => D.main && D.est !== null).map(D => D.est); if (e.length) S.set('day_spread', Math.max(...e) - Math.min(...e), null); }
  return facts;
}

function checkCounts(S, X, ctx) {
  const P = ctx.P;
  let mainDays = 0, resEx = 0, maxCounted = 0, maxRes = 0;
  const crossPattern = ((X.meta.template || {}).pairing || '') === 'cross_pattern';
  for (const W of X.weeks) {
    const B = X.blocks.find(b => b.n === W.tb);
    for (const D of W.days) {
      const where = { week: W.n, weekday: D.weekday };
      if (D.main) {
        mainDays++; resEx += D.units.length; maxRes = Math.max(maxRes, D.units.length);
        const cap = P.exercise_cap_by_minutes[String(D.limit)];
        if (typeof cap === 'number' && D.format !== 'circuit') {
          if (D.full_body) { S.n('exbudget_over'); if (D.units.length > cap + P.exercise_margin) S.hit('exbudget_over', where, D.units.length + ' resistance exercises in ' + D.limit + ' min (cap ' + cap + ' + ' + P.exercise_margin + ')', { value: D.units.length, limit: cap + P.exercise_margin }); }
          else { S.n('exercise_cap_excess'); for (let k = 0; k < Math.max(0, D.units.length - cap); k++) S.hit('exercise_cap_excess', where, D.units.length + ' resistance exercises on a split day (cap ' + cap + ')'); }
        }
        // T0-SES-13 athletes: 12 counted exercises
        if (X.athletic_family) {
          S.n('athlete_cap');
          let counted = 0; const isoPairs = new Set();
          for (const I of D.items) {
            if (P.outside_cap_blocks.includes(I.block) || I.bk === 'warmup' || I.role === 'prehab' || I.isTest && I.bk === 'test') continue;
            if (P.ankle_outside_athlete_cap && I.bucket === 'AP_JUMP_LIMITED_KNEE') continue;
            if (I.isTest && D.items.some(J => !J.isTest && baseSlot(J.raw.slot_id) === baseSlot(I.raw.slot_id))) continue;   // the top set of a counted lift
            const smallIso = I.bk === 'isolation' && I.ex && I.ex.size_class === 'small';
            if (P.small_iso_superset_counts_as_one && smallIso && I.raw.superset) {
              const mates = D.items.filter(J => J.raw.superset === I.raw.superset);
              if (mates.length === 2 && mates.every(J => J.bk === 'isolation' && J.ex && J.ex.size_class === 'small')) { if (isoPairs.has(I.raw.superset)) continue; isoPairs.add(I.raw.superset); }
            }
            counted++;
          }
          maxCounted = Math.max(maxCounted, counted);
          if (counted > P.athlete_cap) S.hit('athlete_cap', where, counted + ' counted exercises (cap ' + P.athlete_cap + ')', { value: counted, limit: P.athlete_cap });
          // T6-CNT-07 the day split inside the 12 (cross-pattern, competitive)
          if (X.competitive && crossPattern) {
            S.n('athletic_split');
            const jt = D.items.filter(I => I.block === 'athletic' && (I.bucket === 'AP_PLYO' || I.bucket === 'AP_THROW')).length;
            const oly = D.items.filter(I => I.bk === 'power' && I.block === 'power').length;
            if (jt > 2 || oly > 1) S.hit('athletic_split', where, jt + ' jump / throw stations, ' + oly + ' Olympic lift(s)');
          }
        }
        // T5-CAP-05 sets of a group in one session
        for (const g of ctx.groups) {
          let q = 0; for (const I of D.items) if (I.sets) q += I.sets * (groupCredits(ctx, I.credits)[g] || 0);
          if (q <= 0) continue;
          S.n('per_session_over'); S.n('per_session_over_hard');
          const soft = X.focusGroups.includes(g) ? P.per_session.priority : P.per_session.soft;
          if (q > P.per_session.priority + EPS) S.hit('per_session_over_hard', { ...where, group: g }, g + ' ' + r2(q) + ' sets in one session');
          if (q > soft + EPS) S.hit('per_session_over', { ...where, group: g }, g + ' ' + r2(q) + ' sets in one session (limit ' + soft + ')');
        }
        // T0-SES-15 sets per exercise
        if (W.stairway && !P.set_bounds_skip_formats.includes(D.format)) for (const U of D.units) {
          S.n('set_bounds');
          const iso = U.bk === 'isolation' || (U.ex && U.ex.exercise_class === 'isolation');
          const hi = U.prime.includes('calves') ? P.calves_max_per_day : iso ? P.placement_max_iso : (P.placement_max_sets[X.level] || 5);
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
          S.n('staircase_deviation', us.length);
          let dev = 0;
          for (let i = 1; i < us.length; i++) dev += Math.max(0, us[i].sets - us[i - 1].sets);
          const capOf = (U) => (U.bk === 'isolation' ? P.placement_max_iso : (P.placement_max_sets[X.level] || 5));
          const below = us.filter(U => U.sets < capOf(U));
          if (below.length) dev += Math.max(0, Math.max(...us.map(U => U.sets)) - Math.min(...below.map(U => U.sets)) - 1);
          for (let k = 0; k < dev; k++) S.hit('staircase_deviation', { ...where, group: g }, g + ' sets ' + us.map(U => U.sets).join('/'));
        }
        // T7-PLC-03 a bonus exercise never alone for its group
        for (const U of D.units) if (U.origin === 'bonus') { S.n('bonus_misplaced'); const g = U.prime[0]; if (g && D.units.filter(V => V.prime.includes(g)).length === 1) S.hit('bonus_misplaced', { ...where, slot_id: U.slot }, 'bonus ' + U.exercise_id + ' is the only ' + g + ' exercise of the day'); }
      }
      if (D.optional && W.stairway) {
        // T6-CNT-05 Focus slots on optional days (recovery weeks run at about half the sets)
        const fs = D.units.filter(U => U.role === 'focus' || U.bucket === 'FOCUS');
        if (fs.length) {
          S.n('focus_slot_violation');
          const lim = P.optional_focus;
          if (fs.length > (lim.slots || 2)) S.hit('focus_slot_violation', where, fs.length + ' Focus slots on the optional day');
          else { const bad = fs.find(U => U.sets < 2 || U.sets > (lim.sets_max || 3)); if (bad) S.hit('focus_slot_violation', { ...where, slot_id: bad.slot }, 'Focus slot at ' + bad.sets + ' sets'); }
        }
      }
    }
    // T7-WEEK-01 frequency in plans of 4+ main days
    const mains = W.days.filter(D => D.main);
    if (W.stairway && mains.length >= 4 && B && B.format !== 'circuit') {
      const cnt = { knee: 0, hip: 0, push: 0, pull: 0 };
      for (const D of mains) { const ps = new Set(D.units.map(patternOf)); if (ps.has('BKD') || ps.has('UKD')) cnt.knee++; if (ps.has('BHD') || ps.has('UHD')) cnt.hip++; if (ps.has('HPUSH') || ps.has('VPUSH')) cnt.push++; if (ps.has('HPULL') || ps.has('VPULL')) cnt.pull++; }
      for (const [k, v] of Object.entries(cnt)) { S.n('frequency_shortfall'); if (v < 2) S.hit('frequency_shortfall', { week: W.n }, k + ' on ' + v + ' day(s)'); }
    }
  }
  S.set('exercise_count', mainDays ? r2(resEx / mainDays) : 0, null, { most_on_one_day: maxRes });
  if (X.athletic_family) S.extra('athlete_cap', { most_counted_on_one_day: maxCounted });
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
        const own = (W, wd) => { const D = W.days.find(d => d.weekday === wd); return D ? sum(D.units.filter(U => U.prime.includes(g)).map(U => U.sets)) : 0; };
        const a0 = own(w1, da), b0 = own(w1, db);
        if (!a0 && !b0) continue;
        for (const W of B.weeks.slice(1)) {
          S.n('exposure_imbalance');
          const dA = own(W, da) - a0, dB = own(W, db) - b0;
          const dev = Math.max(0, Math.abs(dA - dB) - 1) + (dB > dA ? 1 : 0);
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
  // a block the plan says it switched off (time_check.blocks_off in 0.4, time_check.room.cut in planner/1) is told for its families
  const offBlocks = new Set([...(X.tc.blocks_off || []), ...((X.tc.room && X.tc.room.cut) || [])].map(b => (typeof b === 'string' ? b : b && b.block)).filter(Boolean));
  const toldByBlock = (fam) => (fam === 'olympic' ? offBlocks.has('power') : offBlocks.has('athletic'));
  const told = (fam) => toldByBlock(fam) || X.warnings.some(w => w && /athletic_capacity/.test(String(w.key)) && (!w.args || !Object.keys(w.args).length || JSON.stringify(w.args).includes(fam) || (fams[fam] || []).some(k => JSON.stringify(w.args).includes(k)) || !/jump|ankle|throw|cod|sprint|olympic|contact|famil|key/.test(JSON.stringify(w.args))));
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
        if (ok.length && !ok.includes(a.quality) && !(olderNoOptIn && olderAllowed.includes(a.quality))) S.hit('stage_violation', { week: W.n, weekday: D.weekday, slot_id: I.raw.slot_id }, a.quality + ' in ' + stage);
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
      for (let i = 1; i < N; i++) { S.n('athletic_drops'); if ((p[i] || 0) < (p[i - 1] || 0) - EPS) { if (B.weeks[i].raw.test) dropsInTestWeek++; S.hit('athletic_drops', { week: B.weeks[i].n, family: fam }, fam + ' ' + p[i - 1] + ' -> ' + p[i], { test_week: !!B.weeks[i].raw.test }); } }
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
      if (D.main && racket50 && W.legDays.includes(D)) { S.n('racket50_defaults'); if (!D.items.some(I => (A50.prehab_each_leg_day || []).includes(I.bucket))) S.hit('racket50_defaults', { week: W.n, weekday: D.weekday }, 'leg day without lower joint care'); }
      if (D.main && D.items.some(I => (A50.prehab_weekly || []).includes(I.bucket))) armCare = true;
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
        let bi = 0, uni = 0;
        for (const W of B.ebs.get(eb)) for (const D of W.days) for (const U of D.units) {
          if (!buckets.includes(U.bucket) || (U.ex && U.ex.exercise_class !== 'compound')) continue;
          if (U.laterality === 'unilateral' || U.laterality === 'alternating') uni += U.sets; else bi += U.sets;
        }
        const tgtList = st && st[region] && st[region].by_exercise_block;
        if (!tgtList || !tgtList.length || bi + uni === 0) continue;
        const target = tgtList[Math.min(k, tgtList.length - 1)];   // meta.share_targets already carries the pain shift (pain_shift is reported beside it)
        if (typeof target !== 'number') continue;
        const share = bi / (bi + uni);
        blocks++; S.n(id);
        const e = Math.max(0, Math.abs(share - target) - (BS.tolerance || 0.03));
        err += e;
        const isOff = Math.abs(share - target) > (BS.validate_tolerance || 0.12) + EPS;
        if (isOff) { off++; S.hit(id, { block: B.n, exercise_block: eb }, region + ' bilateral share ' + r2(share) + ' against ' + r2(target), { value: r2(share), limit: r2(target) }); }
        facts[region].push({ block: B.n, exercise_block: eb, share: r2(share), target: r2(target), off: isOff });
      }
    }
    if (blocks) S.extra(id, { blocks, blocks_off: off, summed_error: r2(err) });
  }
  // T8-BAL-03 push : pull
  const pushFocus = X.focusGroups.some(g => g === 'chest' || g === 'shoulders' || g === 'triceps');
  for (const W of X.weeks) {
    if (!W.stairway) continue;
    let push = 0, pull = 0;
    for (const D of W.days) for (const U of D.units) { const d = direction(U); if (d === 'push') push += U.sets; else if (d === 'pull') pull += U.sets; }
    if (push <= 0 || pushFocus) continue;
    S.n('push_pull_ratio');
    if (pull < 0.8 * push - EPS) S.hit('push_pull_ratio', { week: W.n }, 'pull ' + pull + ' against push ' + push + ' (' + r2(pull / push) + ')');
  }
  return facts;
}

// ----------------------------------------------------------------------------------------------------------------------
// scorePlan
// ----------------------------------------------------------------------------------------------------------------------

/**
 * @param {object} plan a plan/2 JSON
 * @param {object} ctx makeContext(model)
 * @param {{intake?:object, determinism?:boolean|null, offers?:{checked:number, mismatches:Array<object>}|null, params?:object}} [opts]
 *        determinism: true when the runner generated the plan twice and the bytes were equal, false when not, null / absent when not checked;
 *        offers: the runner's re-run of the offered schedules (offer_mismatch); params: named parameter overrides for this call
 * @returns {object} bench-score/1
 */
export function scorePlan(plan, ctx, opts = {}) {
  if (opts.params && Object.keys(opts.params).length) { const { P, src } = resolveParams(ctx.R, opts.params); ctx = { ...ctx, P, param_sources: src }; }
  const id = (opts.intake && opts.intake.id) || (plan.meta && plan.meta.program_id) || null;
  const out = { schema: SCORE_SCHEMA, scorer_version: SCORER_VERSION, id, status: plan ? plan.status : null, scored: false };
  if (!plan || plan.schema !== 'plan/2') return { ...out, error: 'not a plan/2 object', score: null };
  if (plan.status !== 'ok' || !(plan.weeks || []).length) return { ...out, score: null, error: 'status ' + plan.status + ' (no weeks to score)', refer: plan.refer || null, errors: plan.errors || [] };

  const S = sheet();
  const X = readPlan(plan, ctx);
  checkSystemSafety(S, X, ctx, plan);
  checkTallies(S, X, ctx);
  checkSessionStructure(S, X, ctx);
  const policy = checkPolicyAndFloors(S, X, ctx, plan);
  const stair = checkStairway(S, X, ctx, plan);
  checkExerciseBlocks(S, X, ctx);
  const time = checkTime(S, X, ctx, plan);
  checkCounts(S, X, ctx);
  checkPlacementPairs(S, X, ctx);
  const athletic = checkAthletic(S, X, ctx);
  checkEffortRest(S, X, ctx);
  const balance = checkBalance(S, X, ctx);
  // set by the runner
  if (opts.determinism === true || opts.determinism === false) { S.n('determinism'); if (!opts.determinism) S.hit('determinism', {}, 'two runs of the same intake gave different plan bytes'); }
  if (opts.offers) { S.n('offer_mismatch', Math.max(1, opts.offers.checked || 0)); for (const mm of opts.offers.mismatches || []) S.hit('offer_mismatch', {}, mm.msg, mm); }
  // info values from the sheet
  const belowGroups = X.blocks.flatMap(B => (B.stairway ? B.below.map(x => ({ B, g: x.group })) : []));
  if (belowGroups.length) { let d = 0, n = 0; for (const { B, g } of belowGroups) for (const W of B.weeks) { d += Math.max(0, ctx.P.floor - W.T.Qmain[g]); n++; } S.set('below_floor_deficit', n ? r2(d / n) : 0, null); }
  const cs = stair.filter(b => typeof b.ceiling_shortfall === 'number');
  if (cs.length) { S.set('ceiling_shortfall', r2(sum(cs.map(b => b.ceiling_shortfall))), null); S.set('group_balance', Math.max(...cs.map(b => b.progress_spread || 0)), null); }

  // ---- the sheet -> metrics, points, acceptance
  const metrics = {};
  const violations = [];
  let lost = 0, hard = 0, hardBench = 0;
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
    // A1: every hard / hard_conditional metric of the inventory, each violation once
    if ((def.kind === 'hard' || def.kind === 'hard_conditional') && !def.report_only && !def.subset_of) { if (def.bench) hardBench += r.count; else hard += r.count; }
    for (const v of r.violations) violations.push({ metric: def.id, rule: def.rule, tier: def.tier, kind: def.kind, ...v });
  }
  const acceptance = {};
  for (const a of ACCEPTANCE) {
    if (a.id === 'A1') { acceptance.A1 = { name: a.name, value: hard, pass: hard === 0, note: 'hard and hard_conditional metrics of the inventory; the bench-only hard rows (' + hardBench + ' here) are judged by their own acceptance rows' }; continue; }
    if (a.id === 'A19') { const tiers = (plan.meta && plan.meta.planner && plan.meta.planner.tiers) || null; acceptance.A19 = tiers ? { name: a.name, value: tiers.filter(t => t && t.status === 'best_found').length, pass: !tiers.some(t => t && t.status === 'best_found') } : { name: a.name, value: null, pass: null, note: 'no meta.planner (engine 0.4)' }; continue; }
    const ms = a.metrics.filter(k => metrics[k]);
    if (!ms.length) { acceptance[a.id] = { name: a.name, value: null, pass: null }; continue; }
    const v = sum(ms.map(k => (typeof metrics[k].value === 'number' && METRIC_BY_ID.get(k).unit !== 'ratio' ? (S.rows.get(k).count) : 0)));
    acceptance[a.id] = { name: a.name, value: v, pass: v === 0, by_metric: Object.fromEntries(ms.map(k => [k, S.rows.get(k).count])) };
  }
  const top = Object.entries(metrics).filter(([, v]) => v.lost > 0).sort((a, b) => b[1].lost - a[1].lost).slice(0, 8).map(([k, v]) => ({ metric: k, lost: v.lost, value: v.value, checked: v.checked }));
  const trainedFail = new Set();
  for (const k of ['floor_misses', 'calf_floor_misses', 'one_exercise_groups', 'trained_not_climbing']) for (const v of (metrics[k] && metrics[k].violations) || []) if (v.group && (k !== 'one_exercise_groups' || v.trained)) trainedFail.add(v.group);

  return {
    ...out, scored: true,
    score: r2(Math.max(0, 100 - lost)),
    points_lost: r2(lost), points_lost_by_tier: lostByTier,
    hard_violations: hard,
    hard_violations_bench_rows: hardBench,
    acceptance_pass: Object.values(acceptance).every(a => a.pass !== false),
    acceptance,
    top_deductions: top,
    facts: {
      family: X.family, goal: X.goal, format: X.format, level: X.level, competitive: X.competitive, profile: X.profile_id, template: X.meta.template || null,
      days_per_week: X.meta.days_per_week, session_minutes: X.minutes, weeks: X.weeks.length, age: X.age,
      blocks: X.blocks.map(B => ({ n: B.n, type: B.type, weeks: [B.weeks[0].n, B.weeks[B.weeks.length - 1].n], format: B.format, trained: B.trained, not_trained: B.notTrained.map(x => x.group + ':' + (x.reason || '?')), below_floor: B.below.map(x => x.group) })),
      fits: typeof X.tc.fits === 'boolean' ? X.tc.fits : null,
      outcome: X.tc.outcome || null,
      trained_failing_minimums: [...trainedFail],
      keep_order: keepOrder(X, ctx),
      policy: policy.blocks, stairway: stair, time, athletic, laterality: balance
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
 * @param {Array<object>} scores bench-score/1 objects (unscored ones - refer / invalid - are counted apart)
 * @returns {object} the acceptance table of PLANNER_SPEC 13.2 on the corpus, metric totals, the score distribution
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
    if (a.id === 'A20') { const share = failing / scored.length; pass = share <= 0.05 + EPS; shown = r4(share); note = failing + ' of ' + scored.length + ' plans'; }
    if (a.id === 'A21') { let blocks = 0, off = 0; for (const s of scored) { const d = s.metrics.laterality_error && s.metrics.laterality_error.detail; if (d) { blocks += d.blocks; off += d.blocks_off; } } const within = blocks ? 1 - off / blocks : 1; pass = within >= 0.95 - EPS; shown = r4(within); note = off + ' of ' + blocks + ' exercise blocks more than 0.12 off'; }
    if (a.id === 'A19') { const share = failing / rows.length; pass = share <= 0.05 + EPS; shown = r4(share); }
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
 * A24, the regression rule: a change may not lower any plan's score.
 * @param {Array<{id:string, score:number}>} before @param {Array<{id:string, score:number}>} after @param {number} [tolerance]
 */
export function compareRuns(before, after, tolerance = 0.005) {
  const b = new Map(before.map(x => [x.id, x.score]));
  const rows = [];
  for (const x of after) { if (!b.has(x.id)) continue; const d = r2(x.score - b.get(x.id)); rows.push({ id: x.id, before: b.get(x.id), after: x.score, delta: d }); }
  return { compared: rows.length, lowered: rows.filter(r => r.delta < -tolerance), raised: rows.filter(r => r.delta > tolerance), mean_delta: rows.length ? r2(sum(rows.map(r => r.delta)) / rows.length) : 0, pass: !rows.some(r => r.delta < -tolerance) };
}

/** which inventory metrics the scorer covers (run.mjs prints it against rules_as_constraints.json > metrics_index) */
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
