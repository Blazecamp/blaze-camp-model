# Baseline: engine 0.4.0 on the benchmark corpus

Written by `design/bench/run.mjs`; the numbers are in `design/bench/results_baseline.json`. Do not edit by hand: re-run.

| | |
|---|---|
| Run | 2026-10-10T09:01:55.643Z to 2026-10-10T09:02:53.176Z (57.53 s), Node v22.22.0, darwin arm64 |
| Engine | 0.4.0, model 1.3.0 |
| Git | HEAD `3c373faa1bed945549da5191e5e811e27362f581` (2026-10-09T23:34:41-04:00), branch main, **29 uncommitted files** under engine/ and model/ |
| Files measured | sha256 `00e4cc8d885c6af8...` over 26 engine / model files; newest file 2026-10-10T04:27:03.392Z; changed during the run: **no** |
| Scorer | 1.0.0: 128 metrics; 106 of the inventory's 120 measured, 14 listed as not measurable on one plan |

> engine/ and model/ hold uncommitted changes (another workflow was editing them): the fingerprint, not the git hash, identifies what was measured. The per-file hashes are in the results file (`engine.fingerprint.per_file`).

How to read the score: 100 minus the points lost. A metric loses `points x sqrt(violations / checked)`, so a rule broken in 1 of 36 group-weeks already costs a sixth of its points and a rule broken everywhere costs all of them. The points per metric are in `score.mjs > METRICS`. One metric is an objective and not a violation: `groups_out_for_time` costs up to 8 points for the groups a plan leaves out for time (their share, a big mover counting double), so a plan that trains nobody does not score well for having no floor to miss. The band (A >= 90, B >= 80, C >= 70, D >= 60, F below) is the scorer's, not a coach grade. `hard violations` (A1) and the acceptance rows are exact counts and do not depend on the points.

## 1. Headline

| Corpus | Plans | Scored | Mean score | Median | 10th pct | Min | Max | Hard violations (A1) | Plans with 0 hard violations | Plans passing every acceptance row | Engine's own validation ok |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C2 bench (design/bench/intakes) | 94 | 94 | 64.64 | 66.98 | 39.17 | 27.61 | 100 | 2056 | 11 | 1 | 94 of 94 |
| C1 samples (samples/intakes) | 8 | 8 | 62.21 | 69.28 | 36.45 | 36.45 | 85.64 | 172 | 1 | 0 | 8 of 8 |

Bands on C2: A 3, B 13, C 19, D 27, F 32.

### The C2 corpus (94 intakes, written by `design/bench/build_intakes.mjs`)

| Axis | Coverage (number of intakes) |
|---|---|
| Goal | active (15), athletic (42), fat_loss (2), fat_loss / bootcamp (2), general (8), general / bootcamp (1), hybrid (5), muscle (14), strength (5) |
| Template family the engine chose | aesthetics (14), athletic (54), fat_loss_bootcamp (12), hybrid_crossfit (8), no_equipment (1), strength (5) |
| Days a week | 2 (18), 3 (33), 4 (27), 5 (10), 6 (6) |
| Session minutes asked | 30 (4), 45 (25), 60 (36), 75 (11), 90 (13), 105 (1), 120 (4) |
| Equipment profile | BASIC_GYM (6), BODYWEIGHT (3), FIELD_TRACK_KIT (4), FULL_GYM (68), HOME_BARBELL (7), HOME_DB_BENCH (2), HOTEL_GYM (1), KB_ONLY (3) |
| Level (from the plan) | L1 (15), L2 (57), L3 (22) |
| Age | under 18 (10), 18-29 (37), 30-49 (34), 50-59 (6), 60-69 (4), 70+ (3); youngest 13, oldest 81 |
| Competitive sports | american_football (4), baseball (1), basketball (3), bjj (1), bodybuilding_physique (1), cheerleading (1), climbing (1), crossfit (1), cycling (1), distance_running (2), golf (1), gymnastics (1), hyrox (1), ice_hockey (2), lacrosse (1), mma (1), olympic_weightlifting (1), powerlifting (1), rowing (1), rugby (1), soccer (2), softball (1), swimming (2), tennis (1), track_and_field (3), triathlon (1), volleyball (2), wrestling (1) |
| Activities (stay active / recreational) | crossfit_class (2), hike_ruck (1), hyrox_fitness (1), lap_swim (1), rec_combat_fitness (1), rec_golf (1), rec_league (2), rec_pickleball (3), rec_tennis (1), run_fitness (1), ski_snow_prep (1), weekend_warrior (1) |
| Focus muscles | back (2), biceps (2), calves (1), chest (2), glutes (2), hamstrings (1), quads (1), shoulders (1), triceps (1), v_taper (1) |
| Pain areas | ankle_foot (1), elbow (2), hip_groin (2), knee (5), lower_back (3), neck (1), shoulder (2) |
| Plan mode | fixed_12 (84), fixed_8 (7), maintenance_4_6 (2), year (1) |
| First block of the plan | in_season (2), maintenance (1), maintenance (circuit) (1), stairway (70), stairway (circuit) (7), stairway (class) (8), stairway (strength_roles) (5) |
| Deliberately hard cases (tag `edge`) | 12: 06-muscle-l3-6x120-goal-muscle-edge, 07-muscle-l2-2x45-edge, 08-muscle-l2-3x30-edge, 22-bodybuilder-6x120-edge, 24-swim-distance-im-2x45-edge, 30-soccer-forward-in-season-2x45-games-edge, 32-basketball-wing-2x30-edge, 62-pickleball-52-2x45-no-core-edge, 71-golf-rec-72-2x30-bodyweight-edge, 82-general-gym-l1-2x30-edge, 84-general-bodyweight-74-3x45-edge, 93-hybrid-2x45-edge |

## 2. Acceptance rows (PLANNER_SPEC 13.2)

Value = the count on the corpus (a share where the rule is a share). "Plans" = plans that fail the row.

| Row | Metric | Pass rule | C2 value | C2 plans | C2 | C1 value | C1 plans | C1 |
|---|---|---|---|---|---|---|---|---|
| A1 | `hard_violations` | sum == 0 | 2056 | 83 | **FAIL** | 172 | 7 | **FAIL** |
| A2 | `floor_misses, calf_floor_misses` | sum == 0 | 279 | 16 | **FAIL** | 40 | 3 | **FAIL** |
| A3 | `below_floor_states` | sum == 0 | 27 | 16 | **FAIL** | 5 | 3 | **FAIL** |
| A4 | `unlisted_untrained` | sum == 0 | 0 | 0 | pass | 0 | 0 | pass |
| A5 | `one_exercise_groups` | sum == 0 | 379 | 26 | **FAIL** | 32 | 3 | **FAIL** |
| A6 | `trained_not_climbing, set_drops` | sum == 0 | 82 | 44 | **FAIL** | 10 | 7 | **FAIL** |
| A7 | `flat_weeks_excess` | sum == 0 | 35 | 20 | **FAIL** | 0 | 0 | pass |
| A8 | `progression_missing` | sum == 0 | 3653 | 81 | **FAIL** | 354 | 7 | **FAIL** |
| A9 | `weekly_rise_over, last_week_not_hardest` | sum == 0 | 17 | 13 | **FAIL** | 0 | 0 | pass |
| A10 | `days_over_unwarned` | sum == 0 | 1134 | 85 | **FAIL** | 81 | 7 | **FAIL** |
| A11 | `days_over_band` | sum == 0 | 136 | 17 | **FAIL** | 3 | 2 | **FAIL** |
| A12 | `minutes_recost_gap` | sum == 0 | 882 | 62 | **FAIL** | 48 | 5 | **FAIL** |
| A13 | `exbudget_over, athlete_cap` | sum == 0 | 364 | 11 | **FAIL** | 20 | 1 | **FAIL** |
| A16 | `offer_invalid, offer_mismatch` | sum == 0 | 115 | 73 | **FAIL** | 9 | 6 | **FAIL** |
| A17 | `unexplained_decisions` | sum == 0 | 78 | 42 | **FAIL** | 12 | 5 | **FAIL** |
| A18 | `athletic_drops, athletic_attainment` | sum == 0 | 476 | 37 | **FAIL** | 54 | 6 | **FAIL** |
| A19 | `best_found_share` | share <= 0.05 | - (not measured on this corpus) | - | n/a | - | - | n/a |
| A20 | `early_peak_plans` | share of plans <= 0.05 | 0.0851 (8 of 94 plans) | 8 | **FAIL** | 0.25 | 2 | **FAIL** |
| A21 | `laterality_error` | share of blocks within 0.12 >= 0.95 | 0.5422 (103 of 225 exercise blocks more than 0.12 off) | 46 | **FAIL** | 0.6667 | 3 | **FAIL** |
| A22 | `determinism` | sum == 0 | 0 | 0 | pass | 0 | 0 | pass |
| A15 | `keep_worse_with_minutes`, `keep_worse_with_days` | 0 and 0 (C3) | - | - | - | 3 of 90 minute steps, 8 of 49 day steps | - | **FAIL** |
| A23 | `time` (C2) | p99 <= 250 ms | p50 84.5, p99 627.35, max 627.35 ms | - | **FAIL** | - | - | - |
| A23 | `time` (C1) | p99 <= 250 ms | - | - | - | p50 80.12, p99 132.34, max 132.34 ms | - | pass |

Not measured here: A14 (the certified grid, C4), A19 (`meta.planner.tiers`; the 0.4 engine has none), A23 in JavaScriptCore and on a phone, C5 (random intakes).

Expected by construction of the measurement (PLANNER_SPEC 13.2 note 2): the 0.4 engine writes no `time_check.pattern_stations`, no `time_check.overrun` and no `weeks[].progression`, so A5 counts its kept-movement stations, A10 counts every day over the minutes (told or not) and A8 counts every trained group-week. Section 3 splits those counts.

## 3. The reviewed failures of the brief, measured on C2

| Reviewed failure | What the scorer counts | Result |
|---|---|---|
| Stairways that go flat on the main days | `main_flat_weeks_excess` (flat weeks of the main-day total beyond the arithmetic minimum); `flat_weeks_excess` (the same on the whole week, A7); `trained_not_climbing` (a trained group gains less than its minimum climb on the main days); share of week-to-week transitions of trained groups that add no own set | 29 and 35 avoidable flat weeks in 17 and 20 plans; 50 trained groups not climbing in 32 plans; 72 % of 3653 transitions flat (345 trained groups) |
| Trained groups below the 10-set floor | `floor_misses` (group-weeks of a trained group under its floor on the main days); `below_floor_states` (the plan lists a group as "trained below the floor") | 279 group-weeks in 16 plans; 27 listed below-floor states in 16 plans; calves under 3 x leg days: 0 weeks |
| Days over the chosen minutes | `days_over_unwarned` (A10: over the minutes and not listed in `time_check.overrun` with an offer); `days_over_band` (A11: above ceil(minutes x 1.10)); `minutes_recost_gap` (A12: printed minutes against the re-cost of the dosed items, tolerance 2 min) | 1134 of 4933 gym days over in 85 plans (836 main days, 298 optional days; 32 are test days; 159 carry a 0.4-style long-day warning); 136 above the band in 17 plans; 882 days where the printed minutes and the re-cost differ by more than 2 min (62 plans); by the re-cost 1061 days are over the minutes and 174 above the band |
| Too many exercises per day | `exbudget_over` (A13: full-body days above the cap by minutes + 1); `athlete_cap` (athlete days above 12 counted exercises); `exercise_cap_excess` (split days above the cap) | 364 full-body days over in 11 plans; athlete cap 0; 36 exercises above the cap on split days (1 plan(s)) |
| The time check over-cuts ("left with only hinges") | `missing_primary_pattern` (a week with no knee, hip, horizontal push or horizontal pull exercise); `day_lost_pattern` (a lower work lift with no partner push / pull on its day); `one_exercise_groups` (A5); `slack_while_untrained` (a peak-week day more than 15 % under the minutes while a group is out for time); stairway plans that train at most one group | 404 week-patterns missing in 20 plans; 321 days that lost their pattern in 19 plans; 379 one-exercise group-days in 26 plans (343 kept-movement stations the plan does not list in `time_check.pattern_stations`, 36 trained groups squeezed to 1 exercise, 0 lone stations of groups that are not trained, 0 above 4); 21 slack days in 15 plans; 9 plans train 0 or 1 group; 203 of 587 groups are out for time (`groups_out_for_time`: legal, the objective the policy maximizes, it costs points) |
| Athletic work off its budget or not climbing | `athletic_attainment` (A18: a family under 0.9 x its scaled target in a week); `athletic_drops` (A18: a family's weekly dose drops); `athletic_flat` (the target rises 10 %+ over the block, the planned dose does not); `athletic_over_budget`; mean planned / full target | 448 family-weeks under 0.9 x in 34 plans; 28 drops in 7 plans (28 of them in an end-test week); 49 flat families in 33 plans; over budget 14; mean planned / full target 0.65 |
| Greedy logic interacting badly (erratic selection, offers) | `keep_order_skips` (a group trained while an earlier group of the keep order is out for time: a signal, not a proof); `offer_invalid` (offered schedules the intake rejects); `offer_mismatch` (offered schedules that do not give what they state); the sweep (section 9) | 73 skips in 34 plans; 66 invalid offers in 56 plans; 49 offers that do not deliver of 127 generated; sweep: 3 minute steps and 8 day steps make the trained set worse |

## 4. Where the points go

| Corpus | T0 safety and structure | T1 policy | T2 floors | T3 stairway | T4 time | T5 caps and athletic budget | T6 counts | T7 placement | T8 balance | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| C2 | 2.82 | 9.69 | 2.32 | 7.72 | 6.6 | 2.25 | 0.56 | 1.02 | 2.38 | 35.36 |
| C1 | 3.22 | 10 | 4.42 | 7.62 | 5.92 | 2.9 | 0.68 | 1.18 | 1.86 | 37.8 |

Mean points lost per plan, by tier of the rule inventory.

| Metric | Rule | Kind | Max points | Count | Checked | Plans failing | Mean points lost per plan |
|---|---|---|---|---|---|---|---|
| `days_over_unwarned` | T4-TIME-01 | hard_conditional | 10 | 1134 | 4933 | 85 of 94 | 4.48 |
| `progression_missing` | T3-STW-09 | hard | 5 | 3653 | 3653 | 81 of 81 | 4.31 |
| `groups_out_for_time` | T1-POL-05 | objective | 8 | 203 | 587 | 67 of 90 | 2.59 |
| `floor_misses` | T2-FLR-01 | hard_conditional | 14 | 279 | 3921 | 16 of 88 | 2.03 |
| `offer_invalid` | T1-POL-04 | output | 4 | 66 | 193 | 56 of 85 | 1.64 |
| `trained_not_climbing` | T1-POL-12 | hard_conditional | 8 | 50 | 345 | 32 of 81 | 1.64 |
| `minutes_recost_gap` | DEF-09 | hard | 5 | 882 | 4933 | 62 of 94 | 1.55 |
| `laterality_error` | T8-BAL-01 | soft | 3 | 103 | 225 | 46 of 77 | 1.28 |
| `offer_mismatch` | T1-POL-04 | output | 3 | 49 | 137 | 42 of 94 | 1.18 |
| `athletic_attainment` | T5-ATH-02 | objective | 6 | 448 | 2952 | 34 of 57 | 1.13 |
| `one_exercise_groups` | T0-SES-10 | hard | 8 | 379 | 8576 | 26 of 89 | 1.09 |
| `day_lost_pattern` | T1-POL-07 | hard_conditional | 6 | 321 | 1650 | 19 of 54 | 0.88 |
| `missing_primary_pattern` | T1-POL-07 | hard_conditional | 6 | 404 | 4260 | 20 of 90 | 0.82 |
| `unexplained_decisions` | T0-SYS-03 | output | 4 | 78 | 861 | 42 of 90 | 0.74 |
| `tracking_error` | T3-STW-07 | soft | 2 | 1213 | 5011 | 64 of 82 | 0.71 |
| `hold_excess` | T3-STW-03 | soft | 3 | 166 | 888 | 38 of 83 | 0.69 |
| `athletic_flat` | T3-ATH-01 | soft | 3 | 49 | 255 | 33 of 56 | 0.67 |
| `flat_weeks_excess` | T3-STW-07 | hard_conditional | 8 | 35 | 888 | 20 of 83 | 0.66 |
| `upper_laterality_error` | T8-BAL-02 | soft | 1 | 168 | 240 | 68 of 82 | 0.66 |
| `exposure_imbalance` | T7-PLC-02 | soft | 2 | 817 | 2838 | 47 of 49 | 0.58 |

## 5. Every metric with a non-zero count

| Tier | Metric | Rule | Kind | Acc. | C2 count | C2 checked | C2 plans | C1 count | C1 plans | What is counted |
|---|---|---|---|---|---|---|---|---|---|---|
| T0 | `unexplained_decisions` | T0-SYS-03 | output | A17 | 78 | 861 | 42 | 12 | 5 | a group not trained without a reason; a lowered peak without stopped_by; an overrun without a cause; an athletic family under 85 % of its target that is not told |
| T0 | `missing_warmup` | T0-SES-01 | hard |  | 36 | 3825 | 3 | 0 | 0 | main days whose first block is not the warm-up |
| T0 | `core_opener_missing` | T0-SES-02 | hard |  | 108 | 3825 | 4 | 0 | 0 | main days without the 2 x 2 core block in its position |
| T0 | `h_before_v` | T0-SES-05 | hard |  | 4 | 1489 | 1 | 0 | 0 | days with a non-work vertical pull / push before a horizontal one |
| T0 | `work_bilateral_myo_order` | T0-SES-06 | hard |  | 55 | 3000 | 15 | 10 | 2 | days breaking work-first, bilateral-before-unilateral or MYO-last |
| T0 | `athletic_order` | T0-SES-07 | hard |  | 181 | 1840 | 14 | 8 | 1 | days breaking sprint -> plyo -> ankle -> throws -> COD, or athletic after Olympic |
| T0 | `one_exercise_groups` | T0-SES-10 | hard | A5 | 379 | 8576 | 26 | 32 | 3 | (week, main day, group) with exactly 1 exercise (or more than 4) that is not calves, a class lift or a listed kept movement |
| T0 | `calf_rule` | T0-SES-11 | hard |  | 24 | 1778 | 1 | 0 | 0 | calves trained: leg days without exactly one calf exercise at 3+ sets; any day with two |
| T0 | `weekly_rise_over` | T0-STW-03 | hard | A9 | 17 | 888 | 13 | 0 | 0 | weeks whose resistance total rises by more than max(1 set, 7 %) (10 % only with the printed note) |
| T0 | `stage_violation` | T0-ATH-02 | hard |  | 4 | 2108 | 1 | 0 | 0 | Receive-Create stage changing inside an exercise block, going down, or a quality outside its stage |
| T1 | `days_not_holding` | T1-POL-02 | hard_conditional (counted, 0 pts) |  | 33 | 3759 | 6 | 0 | 0 | non-test main days above the fit factor (scored through days_over_band) |
| T1 | `fits_inconsistent` | T1-POL-03 | output |  | 4 | 90 | 4 | 1 | 1 | a plan that says it fits and still lists a group out for time, a lowered peak or a day over the minutes |
| T1 | `offer_invalid` | T1-POL-04 | output | A16 | 66 | 193 | 56 | 5 | 5 | offered schedules the intake rejects (session length not in the allowed list, days outside 2-6) |
| T1 | `offer_mismatch` | T1-POL-04 | output | A16 | 49 | 137 | 42 | 4 | 4 | offers whose re-run does not give what they state (set by the runner) |
| T1 | `groups_out_for_time` | T1-POL-05 | objective |  | 203 | 587 | 67 | 12 | 5 | groups the plan leaves out for time (legal, and the objective of the policy is to keep them): points = 8 x their share of the groups that are trained or out for time, a big mover counting double |
| T1 | `keep_order_skips` | T1-POL-05 | objective (reported) |  | 73 | 384 | 34 | 0 | 0 | a group trained directly while an earlier group of the keep order is out for time (a signal; only an exhaustive solve proves an inversion) |
| T1 | `missing_primary_pattern` | T1-POL-07 | hard_conditional |  | 404 | 4260 | 20 | 0 | 0 | (week, pattern) with no knee, hip, horizontal push or horizontal pull exercise |
| T1 | `day_lost_pattern` | T1-POL-07 | hard_conditional |  | 321 | 1650 | 19 | 24 | 2 | main days of a cross-pattern week with a lower work lift and no partner (hip: a push, knee: a pull): "no press on the hip + push day" |
| T1 | `below_floor_states` | T1-POL-08 | hard_conditional | A3 | 27 | 736 | 16 | 5 | 3 | entries of trained_below_floor, plus groups with 2+ exercises on a day that are not listed as trained |
| T1 | `missing_superset_recs` | T1-POL-11 | output |  | 72 | 3825 | 3 | 0 | 0 | needed pairs that are not on; days marked supersets_needed without a needed pair |
| T1 | `athletic_vs_big_mover` | T1-POL-13 | objective |  | 6 | 41 | 6 | 0 | 0 | stay-active plans where a big mover is out for time while a day still holds athletic room (2+ stations or an Olympic lift) |
| T1 | `slack_while_untrained` | T1-POL-05 | objective |  | 21 | 316 | 15 | 1 | 1 | peak-week main days more than 15 % under the minutes while a group is out for time (DR-5) |
| T2 | `floor_misses` | T2-FLR-01 | hard_conditional | A2 | 279 | 3921 | 16 | 40 | 3 | stairway group-weeks of a trained group under its floor on the main days (10; a pain-reduced group its start) |
| T2 | `athlete_floor_misses` | T2-FLR-04 | hard_conditional (counted, 0 pts) |  | 102 | 0 | 7 | 12 | 1 | floor_misses of competitive field athletes (a subset) |
| T2 | `below_floor_deficit` | T2-FLR-05 | soft (reported) |  | mean 4.75 | - | - | mean 4.61 | - | mean weekly shortfall under the floor of the groups listed trained_below_floor |
| T2 | `week1_at_ceiling` | T2-FLR-06 | hard_conditional |  | 14 | 359 | 13 | 4 | 3 | lines of trained groups whose week-1 main-day sets leave less than the minimum climb under their ceiling |
| T3 | `set_drops` | T3-STW-01 | hard_conditional | A6 | 32 | 26550 | 20 | 2 | 2 | an exercise or a trained group with fewer sets than the week before; a planned target that drops |
| T1 | `trained_not_climbing` | T1-POL-12 | hard_conditional | A6 | 50 | 345 | 32 | 8 | 6 | trained groups whose own main-day sets rise by less than the minimum climb over the block |
| T3 | `flat_groups` | T3-STW-02 | hard_conditional (counted, 0 pts) |  | 12 | 345 | 11 | 4 | 3 | the same on credited sets of all days (scored through trained_not_climbing) |
| T3 | `flat_weeks_excess` | T3-STW-07 | hard_conditional | A7 | 35 | 888 | 20 | 0 | 0 | flat weeks of the resistance total beyond max(0, N - 1 - sets added) |
| T3 | `main_flat_weeks_excess` | T3-STW-03 | soft |  | 29 | 888 | 17 | 0 | 0 | the same on the main-day total ("stairways that go flat on main days") |
| T3 | `hold_excess` | T3-STW-03 | soft |  | 166 | 888 | 38 | 7 | 3 | long holds: trained big groups, the second half, the main-day total, the total flat two weeks running |
| T3 | `tracking_error` | T3-STW-07 | soft |  | 1213 | 5011 | 64 | 77 | 5 | placed line sets against the printed target: cells more than 1 set apart; targets printed for groups that are not trained (DR-21) |
| T3 | `progression_missing` | T3-STW-09 | hard | A8 | 3653 | 3653 | 81 | 354 | 7 | trained group-weeks from week 2 on without exactly one entry in weeks[].progression |
| T3 | `early_peak` | T3-STW-06 | soft | A20 | 10 | 345 | 8 | 3 | 2 | trained groups (climb of 3+) whose last set arrives before week N-1 |
| T3 | `athletic_drops` | T3-ATH-01 | hard_conditional | A18 | 28 | 2709 | 7 | 16 | 4 | (family, week) whose planned athletic dose drops inside a stairway block |
| T3 | `athletic_flat` | T3-ATH-01 | soft |  | 49 | 255 | 33 | 4 | 3 | athletic families whose target rises 10 %+ over the block while the planned dose does not rise |
| T3 | `share_off` | T3-ATH-02 | soft |  | 117 | 529 | 23 | 3 | 1 | weeks whose plyometric share is more than 5 points from the target |
| T4 | `days_over_unwarned` | T4-TIME-01 | hard_conditional | A10 | 1134 | 4933 | 85 | 81 | 7 | gym days of any week over the chosen minutes that are not listed in time_check.overrun with an offer |
| T4 | `days_over_band` | T1-POL-02 | hard_conditional | A11 | 136 | 4933 | 17 | 3 | 2 | gym days of any week above ceil(minutes x 1.10) |
| T4 | `minutes_recost_gap` | DEF-09 | hard | A12 | 882 | 4933 | 62 | 48 | 5 | gym days whose est_minutes differs from the re-cost of the dosed items by more than the tolerance |
| T4 | `overrun_minutes` | T4-TIME-01 | soft (reported) |  | mean 33.34 | - | - | mean 21.88 | - | minutes over the chosen length, summed over non-test main days |
| T4 | `format_minutes` | T4-TIME-03 | hard |  | 6 | 180 | 2 | 0 | 0 | bootcamp days outside 35-45 min (for a 45-min choice) |
| T5 | `over_ceiling` | T5-CAP-01 | hard |  | 322 | 4161 | 28 | 25 | 2 | line-weeks above the line's (time-held) ceiling on all days: direct sets above it, or credited sets more than 1 above it |
| T5 | `group_over_ceiling` | T5-CAP-01 | soft |  | 523 | 3998 | 59 | 35 | 6 | decision D7 read per FOCUS group: credited sets of a group more than 1 above the larger ceiling of its lines (hips = glutes + hamstrings) |
| T5 | `over_30` | T5-CAP-03 | hard |  | 22 | 3998 | 4 | 8 | 1 | group-weeks above 30 credited sets on all days |
| T5 | `ceiling_shortfall` | T5-CAP-04 | objective (reported) |  | mean 14.47 | - | - | mean 22.11 | - | sets between the last week and the level ceiling, summed over trained groups |
| T5 | `per_session_over` | T5-CAP-05 | soft |  | 133 | 17227 | 10 | 0 | 0 | (day, group) above 11 credited sets in a session (Focus 14) |
| T5 | `per_session_over_hard` | T5-CAP-05 | hard |  | 14 | 17227 | 2 | 0 | 0 | (day, group) above 14 credited sets in a session |
| T5 | `athletic_over_budget` | T5-ATH-01 | hard |  | 14 | 2952 | 2 | 0 | 0 | (family, week) planned above 1.25 x target + one set (Olympic 1.5 x) |
| T5 | `athletic_attainment` | T5-ATH-02 | objective | A18 | 448 | 2952 | 34 | 38 | 6 | (family, week) planned under 0.9 x the scaled target |
| T5 | `athletic_attainment_ratio` | T5-ATH-02 | objective (reported) |  | mean 0.65 | - | - | mean 0.72 | - | mean planned / full target over families and weeks (capped at 1) |
| T5 | `cod_missing` | T5-ATH-03 | soft |  | 113 | 331 | 10 | 0 | 0 | weeks of a COD sport with a COD target and no COD station |
| T6 | `exbudget_over` | T6-CNT-01 | hard | A13 | 364 | 3075 | 11 | 20 | 1 | full-body days with more counted resistance exercises than the cap by minutes + the margin |
| T6 | `exercise_cap_excess` | T6-CNT-01 | soft |  | 36 | 384 | 1 | 0 | 0 | split days: resistance exercises above the cap by minutes |
| T6 | `exercise_count` | T6-CNT-03 | objective (reported) |  | mean 4.92 | - | - | mean 5.93 | - | mean resistance exercises per main day |
| T6 | `focus_slot_violation` | T6-CNT-05 | hard |  | 8 | 581 | 1 | 15 | 1 | optional days with more than 2 Focus slots, or Focus slots outside 2-3 sets |
| T6 | `athletic_split` | T6-CNT-07 | hard |  | 24 | 1252 | 2 | 0 | 0 | cross-pattern athlete days with more than 2 jump / throw stations or more than 1 Olympic lift |
| T7 | `staircase_deviation` | T7-PLC-01 | soft |  | 1169 | 13347 | 55 | 161 | 5 | group-days whose sets are not the coach's staircase (a later exercise above an earlier one, or a spread above 1) |
| T7 | `exposure_imbalance` | T7-PLC-02 | soft |  | 817 | 2838 | 47 | 83 | 5 | sets added on the two exposures of a day type that are not alternated |
| T7 | `frequency_shortfall` | T7-WEEK-01 | soft |  | 188 | 1916 | 12 | 16 | 1 | patterns on fewer than 2 days a week in plans of 4+ main days |
| T7 | `supersets_on_unneeded` | T7-PAIR-03 | objective (reported) |  | 687 | 10353 | 12 | 44 | 2 | pairs switched on that the day does not need |
| T7 | `day_spread` | T7-WEEK-02 | soft (reported) |  | mean 9.29 | - | - | mean 8.13 | - | longest minus shortest main day of the last week |
| T8 | `laterality_error` | T8-BAL-01 | soft | A21 | 103 | 225 | 46 | 6 | 3 | lower-body bilateral share against the target per exercise block (blocks more than 0.12 off) |
| T8 | `upper_laterality_error` | T8-BAL-02 | soft |  | 168 | 240 | 68 | 12 | 6 | the same for the upper body |
| T8 | `push_pull_ratio` | T8-BAL-03 | soft |  | 436 | 928 | 39 | 12 | 1 | weeks with pull sets under 0.8 x push sets (no pushing Focus) |
| T8 | `group_balance` | T8-BAL-04 | soft (reported) |  | mean 1.07 | - | - | mean 1.18 | - | spread of relative progress (peak - start) / (ceiling - start) over trained groups |
| T8 | `repeated_exposure` | T8-VAR-01 | soft |  | 9 | 834 | 8 | 0 | 0 | the two exposures of a slot holding the identical exercise with no detail |
| T8 | `block_change_violations` | T8-VAR-02 | soft |  | 10 | 2952 | 10 | 0 | 0 | a slot that returns to an earlier pick (A-B-A); a work lift that changes between exercise blocks |
| T8 | `near_duplicates` | T8-VAR-03 | soft |  | 48 | 3459 | 2 | 0 | 0 | a session holding the same exercise twice |

Measured with no violation on either corpus (57): `determinism`, `lifestyle_inputs`, `sex_inputs`, `refer_or_release_violation`, `band_items`, `v_squat`, `failure_on_compound`, `older_never`, `racket50_defaults`, `youth_violation`, `pain_avoid_items`, `medball_violation`, `kit_violation`, `invented_exercises`, `slot_type_violation`, `max_test_from_zero`, `credit_class_mismatch`, `credit_tally_mismatch`, `block_order`, `power_after_strength`, `pairing_violation`, `axial_violation`, `rear_delt_week`, `athlete_cap`, `mid_block_changes`, `set_bounds`, `illegal_supersets`, `spacing_violation`, `rir_violation`, `intensifier_violation`, `rest_out_of_class`, `survival_cut`, `deload_inside_block`, `planned_step_over`, `steps_in_flat`, `test_violation`, `olympic_presence`, `contact_cap`, `in_season_violation`, `sport_default_violation`, `offer_missing`, `unlisted_untrained`, `calf_floor_misses`, `last_week_not_hardest`, `early_step_larger`, `peak_not_last`, `restart_at_block`, `level_not_rising`, `circuit_flat`, `length_invalid`, `focus_violation`, `bad_added_exercise`, `prehab_over`, `bonus_misplaced`, `climb_on_optional_only`, `olympic_day_pattern`, `pairing_style`.

"(reported)" rows are never judged; a value row shows the mean over the plans it was measured on. "(counted, 0 pts)" rows repeat another metric on a different tally: they count and cost no points (a `subset_of` row is left out of A1).

## 6. Per plan: C2 bench (edge cases in bold)

`Trained` = groups in `time_check.trained_groups` of the first stairway block (b = of which listed below the floor). `Floor` = group-weeks under the floor. `Flat` = avoidable flat weeks (total / main days). `Not climbing` = trained groups under their minimum climb. `Over` = gym days over the minutes / above the 10 % band, of all gym days. `1-ex` = one-exercise group-days. `Ex+` = full-body days above the exercise budget. `Pattern` = week-patterns missing + days that lost their pattern. `Ath` = athletic family-weeks under 0.9 x the scaled target / dose drops. `ms` = the faster of two generate() calls.

| Intake | Days x min | Template | Level | First block | Trained | Score | Band | Hard | Floor | Flat | Not climbing | Over | 1-ex | Ex+ | Pattern | Ath | ms |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01-muscle-l1-4x60-worked-example | 4 x 60 | aesthetics.4 | L1 | stairway | 7 | 64.32 | D | 24 | 0 | 0 / 0 | 1 | 20 / 0 of 72 | 12 | 12 | 0 + 0 | - | 221.12 |
| 02-muscle-l1-3x60-basic-gym | 3 x 60 | aesthetics.3 | L1 | stairway | 6 | 63.18 | D | 33 | 0 | 2 / 2 | 2 | 10 / 0 of 60 | 24 | 0 | 0 + 0 | - | 300.89 |
| 03-muscle-l2-4x75-upper-lower-focus-chest | 4 x 75 | aesthetics.4:upper_lower | L2 | stairway | 8 | 76.8 | C | 2 | 0 | 1 / 1 | 2 | 0 / 0 of 48 | 0 | 0 | 0 + 0 | - | 94.7 |
| 04-muscle-l3-5x90-focus-glutes-hams | 5 x 90 | aesthetics.5 | L3 | stairway | 8 | 74.03 | C | 33 | 0 | 0 / 0 | 0 | 2 / 0 of 60 | 0 | 36 | 0 + 0 | - | 118.39 |
| 05-muscle-l3-6x90-ppl-v-taper | 6 x 90 | aesthetics.6:ppl_x2 | L3 | stairway | 8 | 87.99 | B | 4 | 0 | 0 / 0 | 0 | 0 / 0 of 72 | 0 | 0 | 0 + 0 | - | 109.82 |
| **06-muscle-l3-6x120-goal-muscle-edge** | 6 x 90 | aesthetics.6 | L3 | stairway | 8 | 69.24 | D | 49 | 0 | 0 / 0 | 1 | 6 / 0 of 72 | 0 | 36 | 0 + 0 | - | 114.76 |
| **07-muscle-l2-2x45-edge** | 2 x 45 | aesthetics.2 | L2 | stairway | 2 | 58.48 | F | 18 | 0 | 3 / 0 | 0 | 12 / 10 of 36 | 12 | 0 | 0 + 0 | - | 368.82 |
| **08-muscle-l2-3x30-edge** | 3 x 30 | aesthetics.3 | L2 | stairway | 1 | 56.72 | F | 72 | 0 | 0 / 0 | 0 | 27 / 24 of 60 | 0 | 0 | 36 + 0 | - | 79.6 |
| 09-muscle-l2-4x45-home-db-focus-arms | 4 x 45 | aesthetics.4 | L2 | stairway | 5 | 67.72 | D | 9 | 0 | 0 / 0 | 1 | 41 / 12 of 72 | 0 | 0 | 0 + 0 | - | 91.07 |
| 10-muscle-older-62-3x60-machines-shoulder | 3 x 60 | aesthetics.3 | L2 | stairway | 8 | 57.92 | F | 27 | 0 | 3 / 3 | 3 | 29 / 0 of 60 | 0 | 36 | 0 + 0 | - | 102.55 |
| 11-muscle-l3-4x90-heavy-style-focus-back | 4 x 90 | aesthetics.4 | L3 | stairway | 7 | 69.49 | D | 27 | 0 | 0 / 0 | 0 | 7 / 1 of 72 | 12 | 16 | 0 + 0 | - | 326.13 |
| 12-muscle-l2-3x45-hotel-maintenance | 3 x 45 | aesthetics.3 | L2 | maintenance | - | 83.42 | B | 0 | 0 | 0 / 0 | 0 | 3 / 3 of 15 | 0 | 3 | 0 + 0 | - | 11.36 |
| 13-muscle-l2-4x60-year-plan | 4 x 60 | aesthetics.4 | L2 | stairway | 8 | 67.62 | D | 37 | 0 | 2 / 5 | 6 | 22 / 0 of 312 | 0 | 153 | 0 + 0 | - | 627.35 |
| 14-muscle-l2-5x60-fixed-8-kg-es | 5 x 60 | aesthetics.5 | L2 | stairway | 8 | 69.25 | D | 5 | 0 | 0 / 0 | 1 | 14 / 0 of 40 | 0 | 24 | 0 + 0 | - | 95.91 |
| 15-strength-l2-3x90-home-barbell | 3 x 90 | strength.3 | L2 | stairway (strength_roles) | 5 | 73.66 | C | 18 | 0 | 0 / 0 | 3 | 4 / 0 of 48 | 0 | 0 | 0 + 0 | - | 104.59 |
| 16-strength-l3-4x90-tests | 4 x 90 | strength.4 | L3 | stairway (strength_roles) | 8 | 72.38 | C | 18 | 0 | 0 / 0 | 2 | 7 / 1 of 48 | 0 | 0 | 0 + 0 | - | 118.05 |
| 17-strength-l1-2x60-55-low-back | 2 x 60 | strength.2 | L1 | stairway (strength_roles) | 2 | 57.64 | F | 10 | 0 | 1 / 0 | 0 | 24 / 9 of 36 | 0 | 0 | 0 + 0 | - | 116.43 |
| 18-strength-l3-5x75 | 5 x 75 | strength.5 | L3 | stairway (strength_roles) | 8 | 73.98 | C | 8 | 0 | 0 / 0 | 3 | 7 / 0 of 60 | 0 | 0 | 0 + 0 | - | 99.94 |
| 19-strength-l2-6x60-fixed-8 | 6 x 60 | strength.6 | L2 | stairway (strength_roles) | 5 | 74.36 | C | 5 | 0 | 0 / 1 | 2 | 11 / 0 of 48 | 0 | 0 | 0 + 0 | - | 313.76 |
| 20-powerlifter-raw-4x120-meet | 4 x 120 | athletic.4:same_pattern | L3 | stairway | 6 | 80.67 | B | 12 | 0 | 0 / 0 | 0 | 0 / 0 of 72 | 0 | 0 | 0 + 0 | 0 / 0 | 77.68 |
| 21-weightlifter-5x90 | 5 x 90 | athletic.5 | L3 | stairway | 6 | 69.37 | D | 13 | 0 | 0 / 0 | 1 | 14 / 0 of 60 | 0 | 0 | 0 + 0 | 12 / 0 | 112.22 |
| **22-bodybuilder-6x120-edge** | 6 x 120 | athletic.6 | L3 | stairway | 6 | 82.05 | B | 25 | 0 | 0 / 0 | 0 | 1 / 0 of 72 | 0 | 0 | 0 + 0 | 0 / 0 | 74.12 |
| 23-swim-sprint-free-15-4x75 | 4 x 75 | athletic.4 | L2 | stairway | 5 | 70.61 | C | 30 | 0 | 0 / 0 | 0 | 11 / 2 of 72 | 0 | 0 | 0 + 0 | 1 / 4 | 222.53 |
| **24-swim-distance-im-2x45-edge** | 2 x 45 | athletic.2 | L2 | stairway | 1 | 65.73 | D | 15 | 0 | 0 / 0 | 0 | 11 / 0 of 36 | 0 | 0 | 0 + 0 | 0 / 0 | 76 |
| 25-football-qb-4x75 | 4 x 75 | athletic.4 | L2 | stairway | 6 | 76.93 | C | 5 | 0 | 0 / 0 | 0 | 13 / 3 of 72 | 0 | 0 | 0 + 0 | 0 / 4 | 80.46 |
| 26-football-wr-5x90 | 5 x 90 | athletic.5 | L3 | stairway | 6 | 80.31 | B | 18 | 0 | 0 / 0 | 0 | 6 / 0 of 60 | 0 | 0 | 0 + 0 | 0 / 6 | 75.13 |
| 27-football-ol-4x105 | 4 x 105 | athletic.4:same_pattern | L3 | stairway | 6 | 79.15 | C | 13 | 0 | 0 / 0 | 0 | 11 / 0 of 72 | 0 | 0 | 0 + 0 | 0 / 0 | 117.93 |
| 28-football-kp-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 2 (1 b) | 41.68 | F | 39 | 12 | 0 / 0 | 1 | 13 / 0 of 48 | 24 | 0 | 0 + 12 | 0 / 0 | 81.56 |
| 29-soccer-goalkeeper-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 3 (1 b) | 51.83 | F | 23 | 10 | 1 / 1 | 1 | 14 / 0 of 48 | 10 | 0 | 0 + 2 | 0 / 0 | 83.77 |
| **30-soccer-forward-in-season-2x45-games-edge** | 2 x 45 | athletic.2 | L2 | in_season | - | 97.17 | A | 0 | 0 | 0 / 0 | 0 | 0 / 0 of 16 | 0 | 0 | 0 + 0 | 0 / 0 | 12.51 |
| 31-basketball-guard-16-4x60 | 4 x 60 | athletic.4 | L2 | stairway | 3 | 58.64 | F | 22 | 0 | 1 / 1 | 0 | 34 / 0 of 72 | 0 | 0 | 0 + 48 | 1 / 6 | 102.96 |
| **32-basketball-wing-2x30-edge** | 2 x 30 | athletic.2 | L2 | stairway | 0 | 51.04 | F | 96 | 0 | 0 / 0 | 0 | 36 / 36 of 36 | 0 | 0 | 48 + 0 | 5 / 0 | 64.51 |
| 33-basketball-big-in-season-2x60-games | 2 x 60 | athletic.2 | L2 | in_season | - | 83.74 | B | 12 | 0 | 0 / 0 | 0 | 12 / 0 of 24 | 0 | 0 | 0 + 12 | 0 / 0 | 18.15 |
| 34-baseball-pitcher-4x75 | 4 x 75 | athletic.4:baseball_parts | L3 | stairway | 4 | 72.87 | C | 24 | 0 | 0 / 0 | 0 | 4 / 0 of 48 | 12 | 0 | 0 + 12 | 0 / 0 | 191.05 |
| 35-softball-catcher-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 3 | 59.09 | F | 25 | 0 | 1 / 1 | 0 | 14 / 0 of 48 | 12 | 0 | 0 + 0 | 12 / 0 | 99.58 |
| 36-hockey-forward-4x90 | 4 x 90 | athletic.4 | L3 | stairway | 6 | 80.96 | B | 4 | 0 | 0 / 0 | 0 | 3 / 0 of 72 | 0 | 0 | 0 + 0 | 0 / 4 | 73.02 |
| 37-hockey-goalie-3x45 | 3 x 45 | athletic.3 | L2 | stairway | 2 | 47.26 | F | 26 | 0 | 1 / 0 | 1 | 34 / 6 of 48 | 0 | 0 | 24 + 0 | 0 / 0 | 91.48 |
| 38-tennis-singles-3x75 | 3 x 75 | athletic.3 | L2 | stairway | 3 | 61.37 | D | 23 | 0 | 1 / 1 | 0 | 10 / 0 of 48 | 11 | 0 | 0 + 13 | 6 / 0 | 106.32 |
| 39-volleyball-outside-3x90-knee | 3 x 90 | athletic.3 | L2 | stairway | 4 | 39.17 | F | 53 | 0 | 3 / 0 | 2 | 4 / 0 of 48 | 18 | 0 | 0 + 18 | 18 / 0 | 144.48 |
| 40-volleyball-libero-15-4x45 | 4 x 45 | athletic.4 | L1 | stairway | 2 (1 b) | 37.29 | F | 31 | 12 | 0 / 0 | 1 | 39 / 0 of 72 | 0 | 0 | 12 + 24 | 0 / 0 | 110.35 |
| 41-wrestling-middle-3x60-meet | 3 x 60 | athletic.3:same_pattern | L2 | stairway | 1 (1 b) | 34.83 | F | 22 | 8 | 0 / 0 | 1 | 17 / 3 of 32 | 0 | 0 | 8 + 0 | 0 / 0 | 72.4 |
| 42-mma-light-4x75 | 4 x 75 | athletic.4 | L3 | stairway | 3 | 70.17 | C | 12 | 0 | 0 / 0 | 0 | 3 / 0 of 72 | 12 | 0 | 0 + 12 | 0 / 0 | 108.84 |
| 43-bjj-masters-3x45 | 3 x 45 | athletic.3 | L2 | stairway | 2 | 67.37 | D | 12 | 0 | 0 / 0 | 0 | 21 / 0 of 48 | 0 | 0 | 12 + 0 | 5 / 0 | 95.38 |
| 44-sprinter-100m-4x90 | 4 x 90 | athletic.4 | L3 | stairway | 6 | 72.82 | C | 25 | 0 | 0 / 0 | 0 | 5 / 0 of 72 | 0 | 0 | 0 + 0 | 2 / 3 | 68.77 |
| 45-sprinter-field-kit-only-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 3 | 67.14 | D | 0 | 0 | 1 / 1 | 0 | 23 / 0 of 48 | 0 | 0 | 0 + 0 | 12 / 0 | 88.83 |
| 46-thrower-4x120 | 4 x 120 | athletic.4:same_pattern | L3 | stairway | 6 | 79.29 | C | 27 | 0 | 0 / 0 | 0 | 3 / 0 of 72 | 0 | 0 | 0 + 0 | 0 / 0 | 95.87 |
| 47-marathoner-2x60 | 2 x 60 | athletic.2 | L2 | stairway | 3 (2 b) | 33.28 | F | 42 | 24 | 0 / 0 | 2 | 16 / 0 of 36 | 0 | 0 | 0 + 24 | 0 / 0 | 57.42 |
| 48-cross-country-14-3x45-bodyweight | 3 x 45 | athletic.3 | L1 | stairway | 1 | 64.31 | D | 12 | 0 | 0 / 0 | 0 | 5 / 0 of 48 | 12 | 0 | 0 + 0 | 13 / 0 | 66.36 |
| 49-hyrox-open-4x75 | 4 x 75 | athletic.4:hyrox | L3 | stairway | 4 | 68.18 | D | 24 | 0 | 1 / 1 | 0 | 11 / 0 of 48 | 0 | 0 | 12 + 0 | 0 / 0 | 108.96 |
| 50-lacrosse-midfield-3x75 | 3 x 75 | athletic.3 | L2 | stairway | 3 | 60.2 | D | 33 | 0 | 1 / 1 | 0 | 10 / 0 of 48 | 0 | 0 | 0 + 24 | 0 / 0 | 72.62 |
| 51-rugby-forwards-4x90 | 4 x 90 | athletic.4:same_pattern | L3 | stairway | 6 | 78.96 | C | 14 | 0 | 0 / 0 | 0 | 6 / 0 of 72 | 0 | 0 | 0 + 0 | 0 / 0 | 102.87 |
| 52-golf-masters-58-2x45 | 2 x 45 | athletic.2 | L2 | stairway | 2 (2 b) | 37 | F | 48 | 24 | 0 / 0 | 0 | 21 / 0 of 36 | 12 | 0 | 0 + 12 | 5 / 0 | 67.66 |
| 53-gymnast-13-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 2 | 60.71 | D | 26 | 0 | 0 / 0 | 1 | 5 / 0 of 48 | 24 | 0 | 0 + 12 | 0 / 0 | 77.31 |
| 54-cyclist-road-3x45 | 3 x 45 | athletic.3 | L2 | stairway | 2 | 68.53 | D | 11 | 0 | 0 / 0 | 0 | 11 / 0 of 48 | 0 | 0 | 0 + 0 | 0 / 0 | 91.94 |
| 55-triathlete-70-3-2x45 | 2 x 45 | athletic.2 | L2 | stairway | 1 | 66.37 | D | 12 | 0 | 0 / 0 | 0 | 13 / 0 of 36 | 0 | 0 | 0 + 0 | 0 / 0 | 57.05 |
| 56-climber-boulder-3x60-elbow | 3 x 60 | athletic.3:same_pattern | L2 | stairway | 3 | 66.38 | D | 14 | 0 | 0 / 0 | 0 | 14 / 10 of 48 | 12 | 0 | 0 + 0 | 0 / 0 | 79.27 |
| 57-rower-sweep-4x60 | 4 x 60 | athletic.4 | L3 | stairway | 5 | 73.28 | C | 24 | 0 | 3 / 3 | 0 | 12 / 0 of 72 | 0 | 0 | 0 + 0 | 1 / 0 | 89.13 |
| 58-crossfit-individual-5x90 | 5 x 90 | hybrid_crossfit.5 | L3 | stairway (class) | 6 | 71.46 | C | 43 | 0 | 0 / 0 | 0 | 19 / 0 of 60 | 0 | 0 | 0 + 0 | 9 / 0 | 73.18 |
| 59-cheer-flyer-15-3x45 | 3 x 45 | athletic.3 | L1 | stairway | 1 (1 b) | 30.87 | F | 39 | 12 | 0 / 0 | 1 | 13 / 0 of 48 | 0 | 0 | 24 + 12 | 0 / 0 | 66.37 |
| 60-pickleball-57-3x45 | 3 x 45 | athletic.3 | L1 | stairway | 2 | 51.55 | F | 24 | 0 | 0 / 0 | 0 | 20 / 0 of 48 | 0 | 0 | 24 + 0 | 24 / 0 | 143.51 |
| 61-pickleball-66-2x60-opt-in | 2 x 60 | athletic.2 | L2 | stairway | 3 (2 b) | 34.42 | F | 53 | 24 | 0 / 0 | 1 | 5 / 0 of 36 | 24 | 0 | 0 + 0 | 24 / 0 | 90.85 |
| **62-pickleball-52-2x45-no-core-edge** | 2 x 45 | athletic.2 | L1 | stairway | 3 (2 b) | 36.45 | F | 29 | 12 | 0 / 0 | 1 | 23 / 0 of 36 | 12 | 0 | 0 + 12 | 17 / 0 | 84.5 |
| 63-hyrox-fitness-4x60 | 4 x 60 | athletic.4:hyrox | L2 | stairway | 4 | 63.32 | D | 13 | 0 | 0 / 0 | 0 | 16 / 0 of 48 | 0 | 0 | 12 + 0 | 11 / 0 | 190.15 |
| 64-crossfit-class-3x60 | 3 x 60 | hybrid_crossfit.3 | L2 | stairway (class) | 2 (2 b) | 27.61 | F | 44 | 16 | 0 / 0 | 1 | 7 / 1 of 24 | 8 | 0 | 16 + 0 | 3 / 1 | 48.9 |
| 65-crossfit-class-5x60 | 5 x 60 | hybrid_crossfit.5 | L3 | stairway (class) | 4 | 58.42 | F | 25 | 0 | 0 / 0 | 0 | 27 / 0 of 60 | 0 | 0 | 12 + 24 | 4 / 0 | 102.93 |
| 66-tennis-rec-62-2x45-elbow | 2 x 45 | athletic.2 | L2 | stairway | 2 | 61.71 | D | 36 | 0 | 0 / 0 | 0 | 24 / 0 of 36 | 0 | 0 | 36 + 0 | 12 / 0 | 83.92 |
| 67-rec-league-soccer-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 4 | 63.35 | D | 0 | 0 | 0 / 0 | 0 | 13 / 0 of 48 | 0 | 0 | 0 + 0 | 36 / 0 | 82.32 |
| 68-run-fitness-2x45-kb-only | 2 x 45 | athletic.2 | L2 | stairway | 2 (2 b) | 32.72 | F | 36 | 24 | 0 / 0 | 0 | 18 / 0 of 36 | 12 | 0 | 0 + 12 | 5 / 0 | 55.92 |
| 69-hike-ruck-68-3x45-knee-back | 3 x 45 | athletic.3 | L2 | stairway | 3 | 58.95 | F | 0 | 0 | 1 / 1 | 0 | 24 / 0 of 48 | 0 | 0 | 0 + 0 | 24 / 0 | 135.51 |
| 70-weekend-warrior-3x60-event | 3 x 60 | athletic.3 | L2 | stairway | 5 | 56.33 | F | 6 | 0 | 0 / 0 | 1 | 22 / 0 of 40 | 0 | 12 | 0 + 0 | 21 / 0 | 99.32 |
| **71-golf-rec-72-2x30-bodyweight-edge** | 2 x 30 | athletic.2 | L1 | stairway | 1 | 46.45 | F | 60 | 0 | 0 / 0 | 0 | 22 / 12 of 36 | 0 | 0 | 36 + 0 | 24 / 0 | 55.1 |
| 72-combat-fitness-striking-4x60 | 4 x 60 | athletic.4 | L2 | stairway | 4 | 65.7 | D | 4 | 0 | 0 / 0 | 0 | 8 / 0 of 60 | 0 | 0 | 0 + 0 | 24 / 0 | 111.3 |
| 73-lap-swim-59-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 4 | 45.17 | F | 31 | 5 | 3 / 0 | 1 | 22 / 0 of 48 | 12 | 0 | 0 + 12 | 5 / 0 | 89.32 |
| 74-ski-prep-3x60-fixed-8 | 3 x 60 | athletic.3 | L2 | stairway | 5 | 59.09 | F | 7 | 0 | 0 / 0 | 1 | 19 / 2 of 32 | 0 | 0 | 0 + 0 | 16 / 0 | 80.52 |
| 75-athletic-no-sport-3x60 | 3 x 60 | athletic.3 | L2 | stairway | 4 | 66.95 | D | 2 | 0 | 0 / 1 | 0 | 9 / 0 of 48 | 0 | 0 | 0 + 0 | 24 / 0 | 97.99 |
| 76-athletic-rec-league-basketball-2x60 | 2 x 60 | athletic.2 | L2 | stairway | 2 | 56.48 | F | 0 | 0 | 0 / 0 | 0 | 16 / 0 of 36 | 0 | 0 | 0 + 24 | 24 / 0 | 69.86 |
| 77-fat-loss-gym-l1-4x60-focus-glutes | 4 x 60 | fat_loss_bootcamp.4 | L1 | stairway | 6 | 67.95 | D | 0 | 0 | 2 / 2 | 0 | 9 / 0 of 48 | 0 | 24 | 0 + 0 | - | 64.39 |
| 78-fat-loss-bootcamp-l1-3x45 | 3 x 45 | fat_loss_bootcamp.3 | L1 | stairway (circuit) | 6 | 89.37 | B | 3 | 0 | 0 / 0 | 0 | 3 / 0 of 36 | 0 | 0 | 0 + 0 | - | 31.45 |
| 79-fat-loss-bootcamp-l2-5x45 | 5 x 45 | fat_loss_bootcamp.5 | L2 | stairway (circuit) | 3 | 87.97 | B | 12 | 0 | 0 / 0 | 0 | 0 / 0 of 60 | 0 | 0 | 12 + 0 | - | 49.91 |
| 80-fat-loss-gym-l2-6x60 | 6 x 60 | fat_loss_bootcamp.6 | L2 | stairway (circuit) | 6 | 91.78 | A | 0 | 0 | 0 / 0 | 0 | 6 / 0 of 72 | 0 | 0 | 0 + 0 | - | 60.29 |
| 81-general-gym-l2-3x60 | 3 x 60 | fat_loss_bootcamp.3 | L2 | stairway (circuit) | 6 | 84.5 | B | 0 | 0 | 0 / 0 | 0 | 3 / 0 of 36 | 0 | 0 | 0 + 0 | 12 / 0 | 36.46 |
| **82-general-gym-l1-2x30-edge** | 2 x 30 | fat_loss_bootcamp.2 | L1 | stairway | 2 (2 b) | 47.38 | F | 72 | 24 | 0 / 0 | 0 | 3 / 0 of 24 | 24 | 0 | 0 + 0 | - | 52.87 |
| 83-general-bootcamp-l2-4x45 | 4 x 45 | fat_loss_bootcamp.4:bootcamp_circuit | L2 | stairway (circuit) | 3 | 81.55 | B | 12 | 0 | 0 / 0 | 0 | 0 / 0 of 48 | 0 | 0 | 12 + 0 | 22 / 0 | 36.48 |
| **84-general-bodyweight-74-3x45-edge** | 3 x 45 | no_equipment.3 | L1 | stairway (circuit) | 5 (1 b) | 86.84 | B | 3 | 0 | 0 / 0 | 0 | 3 / 0 of 36 | 0 | 0 | 0 + 0 | - | 29.55 |
| 85-general-kb-only-4x45 | 4 x 45 | fat_loss_bootcamp.4 | L2 | stairway | 5 | 77.19 | C | 2 | 0 | 0 / 0 | 1 | 9 / 0 of 48 | 0 | 0 | 0 + 0 | - | 94.51 |
| 86-general-gym-l2-5x75-second-cycle | 5 x 75 | fat_loss_bootcamp.5 | L2 | stairway (circuit) | 2 | 74.71 | C | 24 | 0 | 0 / 0 | 0 | 1 / 0 of 60 | 0 | 0 | 24 + 0 | 14 / 0 | 47.16 |
| 87-general-coach-client-81-2x45-hip | 2 x 45 | fat_loss_bootcamp.2 | L1 | stairway | 2 | 67.57 | D | 24 | 0 | 0 / 0 | 0 | 7 / 0 of 24 | 24 | 0 | 0 + 0 | - | 55.71 |
| 88-general-layoff-l1-4x60 | 4 x 60 | fat_loss_bootcamp.4 | L1 | stairway | 6 | 81.97 | B | 0 | 0 | 0 / 0 | 0 | 0 / 0 of 48 | 0 | 0 | 0 + 0 | - | 57.34 |
| 89-general-maintenance-3x60-6wk | 3 x 60 | fat_loss_bootcamp.3 | L2 | maintenance (circuit) | - | 100 | A | 0 | 0 | 0 / 0 | 0 | 0 / 0 of 18 | 0 | 0 | 0 + 0 | 0 / 0 | 14.08 |
| 90-hybrid-4x60 | 4 x 60 | hybrid_crossfit.4:crossfit_style_bootcamp | L2 | stairway (class) | 3 (2 b) | 44.63 | F | 42 | 24 | 0 / 0 | 2 | 7 / 0 of 60 | 12 | 0 | 0 + 0 | - | 90.17 |
| 91-hybrid-3x75-full-gym | 3 x 75 | hybrid_crossfit.3 | L2 | stairway (class) | 4 (2 b) | 42.72 | F | 50 | 24 | 3 / 3 | 1 | 4 / 1 of 36 | 12 | 0 | 12 + 0 | - | 71.12 |
| 92-hybrid-l3-5x90 | 5 x 90 | hybrid_crossfit.5 | L3 | stairway (class) | 6 | 77.4 | C | 15 | 0 | 0 / 0 | 0 | 21 / 0 of 60 | 0 | 12 | 0 + 0 | - | 76.99 |
| **93-hybrid-2x45-edge** | 2 x 45 | hybrid_crossfit.2 | L2 | stairway (class) | 0 | 66.98 | D | 36 | 0 | 0 / 0 | 0 | 0 / 0 of 24 | 12 | 0 | 24 + 0 | - | 43.8 |
| 94-hybrid-6x60 | 6 x 60 | hybrid_crossfit.6 | L2 | stairway (class) | 3 (3 b) | 44.82 | F | 43 | 24 | 0 / 0 | 1 | 5 / 0 of 48 | 8 | 0 | 8 + 0 | - | 89.21 |

## 7. Per plan: C1 samples

`Trained` = groups in `time_check.trained_groups` of the first stairway block (b = of which listed below the floor). `Floor` = group-weeks under the floor. `Flat` = avoidable flat weeks (total / main days). `Not climbing` = trained groups under their minimum climb. `Over` = gym days over the minutes / above the 10 % band, of all gym days. `1-ex` = one-exercise group-days. `Ex+` = full-body days above the exercise budget. `Pattern` = week-patterns missing + days that lost their pattern. `Ath` = athletic family-weeks under 0.9 x the scaled target / dose drops. `ms` = the faster of two generate() calls.

| Intake | Days x min | Template | Level | First block | Trained | Score | Band | Hard | Floor | Flat | Not climbing | Over | 1-ex | Ex+ | Pattern | Ath | ms |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01-swimming | 3 x 60 | athletic.3 | L2 | stairway | 3 (1 b) | 41.73 | F | 56 | 12 | 0 / 0 | 1 | 13 / 2 of 48 | 12 | 0 | 0 + 12 | 1 / 4 | 101.99 |
| 02-football | 4 x 90 | athletic.4 | L3 | stairway | 6 | 75.84 | C | 7 | 0 | 0 / 0 | 0 | 6 / 0 of 72 | 0 | 0 | 0 + 0 | 2 / 6 | 68.14 |
| 03-soccer | 3 x 75 | athletic.3 | L2 | stairway | 5 | 69.28 | D | 6 | 0 | 0 / 0 | 1 | 14 / 0 of 32 | 0 | 0 | 0 + 0 | 1 / 5 | 52.31 |
| 04-crossfit-style-bootcamp | 4 x 60 | hybrid_crossfit.4:crossfit_style_bootcamp | L2 | stairway (class) | 3 (2 b) | 36.6 | F | 31 | 16 | 0 / 0 | 2 | 8 / 1 of 40 | 8 | 0 | 0 + 0 | 3 / 1 | 80.35 |
| 05-bootcamp | 3 x 45 | fat_loss_bootcamp.3 | L2 | stairway (circuit) | 6 | 82.09 | B | 0 | 0 | 0 / 0 | 0 | 0 / 0 of 24 | 0 | 0 | 0 + 0 | 14 / 0 | 19.73 |
| 06-full-body-aesthetics | 4 x 75 | aesthetics.4 | L3 | stairway | 8 | 70.04 | C | 42 | 0 | 0 / 0 | 2 | 14 / 0 of 72 | 0 | 20 | 0 + 0 | - | 132.34 |
| 07-push-pull-legs | 6 x 75 | aesthetics.6:ppl_x2 | L3 | stairway | 8 | 85.64 | B | 1 | 0 | 0 / 0 | 1 | 3 / 0 of 72 | 0 | 0 | 0 + 0 | - | 116.46 |
| 08-pickleball-genpop | 2 x 45 | athletic.2 | L1 | stairway | 3 (2 b) | 36.45 | F | 29 | 12 | 0 / 0 | 1 | 23 / 0 of 36 | 12 | 0 | 0 + 12 | 17 / 0 | 80.12 |

## 8. The deliberately hard cases

| Intake | Who | Trained directly | Not trained (reason) | Score | Largest deductions |
|---|---|---|---|---|---|
| 06-muscle-l3-6x120-goal-muscle-edge | 6 x 120 with goal muscle (not a competitive athlete: over 90 min is clamped and warned). Focus quads + calves. | quads, hips, back, chest, shoulders, biceps, triceps, calves | - | 69.24 | `exbudget_over` 5.2, `progression_missing` 5, `days_over_unwarned` 2.89, `calf_rule` 2.83 |
| 07-muscle-l2-2x45-edge | aesthetics L2 on 2 x 45: eight groups cannot fit; the policy must pick by priority. | quads, chest | hips:time, back:time, shoulders:time, calves:time, biceps:no_station, triceps:no_station | 58.48 | `days_over_unwarned` 5.77, `progression_missing` 5, `groups_out_for_time` 4.8, `days_over_band` 4.22 |
| 08-muscle-l2-3x30-edge | aesthetics L2 on 3 x 30 minutes, Focus biceps. | chest | quads:time, hips:time, back:time, shoulders:time, calves:time, biceps:no_station, triceps:no_station | 56.72 | `days_over_unwarned` 6.71, `groups_out_for_time` 6.4, `missing_primary_pattern` 5.2, `days_over_band` 5.06 |
| 22-bodybuilder-6x120-edge | competitive bodybuilder (classic physique), 6 x 120, show in 20 weeks, Focus chest + back. | quads, hips, back, chest, shoulders, calves | biceps:credit_only, triceps:credit_only | 82.05 | `progression_missing` 5, `minutes_recost_gap` 4.04, `laterality_error` 3, `over_ceiling` 1.77 |
| 24-swim-distance-im-2x45-edge | college distance / IM swimmer with only 2 x 45 of dryland beside 8 pool sessions. | back | quads:time, hips:time, chest:time, shoulders:time, calves:time, biceps:credit_only, triceps:credit_only | 65.73 | `groups_out_for_time` 6.4, `days_over_unwarned` 5.53, `progression_missing` 5, `over_ceiling` 3 |
| 30-soccer-forward-in-season-2x45-games-edge | in-season forward, games on Saturday, 2 x 45 (Mon, Wed): flat in-season block, the hard day 48 h before the game. | none | - | 97.17 | `offer_invalid` 2.83 |
| 32-basketball-wing-2x30-edge | college wing with 2 x 30 minutes: an athlete session shorter than its own fixed blocks. | none | quads:time, hips:time, back:time, chest:time, shoulders:time, calves:time, biceps:credit_only, triceps:credit_only | 51.04 | `days_over_unwarned` 10, `groups_out_for_time` 8, `days_over_band` 8, `missing_primary_pattern` 6 |
| 62-pickleball-52-2x45-no-core-edge | the D1 client (pickleball, 52, 2 x 45, mild knee) with the core opener moved to the end. | quads, hips, calves (below the floor: quads, hips) | back:time, chest:time, shoulders:time, biceps:no_station, triceps:no_station | 36.45 | `floor_misses` 9.9, `days_over_unwarned` 7.99, `progression_missing` 5, `one_exercise_groups` 4.62 |
| 71-golf-rec-72-2x30-bodyweight-edge | recreational golfer, 72, 2 x 30, no equipment. | back | quads:time, hips:time, chest:time, shoulders:time, calves:time, biceps:no_station, triceps:no_station | 46.45 | `days_over_unwarned` 7.82, `groups_out_for_time` 6.4, `missing_primary_pattern` 5.2, `progression_missing` 5 |
| 82-general-gym-l1-2x30-edge | general fitness beginner on 2 x 30. | quads, hips (below the floor: quads, hips) | back:time, chest:time, shoulders:time, calves:time, biceps:no_station, triceps:no_station | 47.38 | `floor_misses` 14, `one_exercise_groups` 5.66, `progression_missing` 5, `groups_out_for_time` 4.8 |
| 84-general-bodyweight-74-3x45-edge | no-equipment older adult: 74, 3 x 45, bodyweight only, mild knee pain, no floor work. | quads, hips, back, shoulders, calves (below the floor: chest) | biceps:time, triceps:time, chest:no_station | 86.84 | `offer_mismatch` 3, `days_over_unwarned` 2.89, `offer_invalid` 2.83, `below_floor_states` 1.77 |
| 93-hybrid-2x45-edge | hybrid on 2 x 45: the class lift, the skill and the WOD leave little room. | none | quads:time, hips:class_lift, back:time, chest:time, shoulders:time, calves:time, biceps:no_station, triceps:no_station | 66.98 | `groups_out_for_time` 8, `one_exercise_groups` 5.66, `missing_primary_pattern` 4.24, `offer_mismatch` 3 |

## 9. The sweep (C3, A15): more minutes or one more day must never train a worse set of groups

The keep vector marks, in the keep order, the groups trained directly and not listed below the floor. A step is worse when the vector gets lexicographically smaller: an earlier group of the keep order is lost. 3 of 90 minute steps and 8 of 49 day steps are worse.

| Sample | Keep order | Days | 30 min | 45 min | 60 min | 75 min | 90 min | 105 min | 120 min | Worse steps |
|---|---|---|---|---|---|---|---|---|---|---|
| 01-swimming | hips > quads > back > chest > calves > shoulders > triceps > biceps | 3 | none | back | hips, back | hips, quads, back, chest | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | - |
|  |  | 4 | none | back | hips, quads, back, chest | hips, quads, back, chest, calves | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders |  |
| 02-football | hips > quads > back > chest > calves > shoulders > triceps > biceps | 4 | none | chest | hips, quads, chest | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | - |
|  |  | 5 | none | chest | hips, quads, chest | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders |  |
| 03-soccer | hips > quads > back > chest > calves > shoulders > triceps > biceps | 3 | none | hips | hips, quads, chest | hips, quads, back, chest, calves | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | - |
|  |  | 4 | none | hips, quads, chest | hips, quads, back, chest, calves | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders | hips, quads, back, chest, calves, shoulders |  |
| 04-crossfit-style-bootcamp | hips > quads > back > chest > shoulders > calves > triceps > biceps | 4 | none | none | back | back, chest, shoulders, calves | back, chest, shoulders, calves | back, chest, shoulders, calves | back, chest, shoulders, calves | 5 days: 30 -> 45 min |
|  |  | 5 | shoulders | none | hips, quads, chest, shoulders | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves |  |
| 05-bootcamp | hips > quads > back > chest > shoulders > calves > triceps > biceps | 3 | hips | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves, triceps, biceps | hips, quads, back, chest, shoulders, calves, triceps, biceps | hips, quads, back, chest, shoulders, calves, triceps, biceps | hips, quads, back, chest, shoulders, calves, triceps, biceps | 4 days: 60 -> 75 min; 45 min: 3 -> 4 days; 60 min: 3 -> 4 days; 75 min: 3 -> 4 days; 90 min: 3 -> 4 days; 105 min: 3 -> 4 days; 120 min: 3 -> 4 days |
|  |  | 4 | hips | hips, quads, back | hips, quads, back, chest, shoulders | hips, quads, back, chest | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves | hips, quads, back, chest, shoulders, calves |  |
| 06-full-body-aesthetics | hips > shoulders > quads > back > chest > calves > triceps > biceps | 4 | calves | hips, shoulders, quads, back, chest | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | - |
|  |  | 5 | calves | hips, shoulders, quads, back, chest | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps | hips, shoulders, quads, back, chest, calves, triceps, biceps |  |
| 07-push-pull-legs | chest > back > hips > quads > shoulders > calves > triceps > biceps | 6 | shoulders, calves | chest, back, quads | chest, back, shoulders, calves, triceps | chest, back, hips, quads, shoulders, calves, triceps, biceps | chest, back, hips, quads, shoulders, calves, triceps, biceps | chest, back, hips, quads, shoulders, calves, triceps, biceps | chest, back, hips, quads, shoulders, calves, triceps, biceps | 6 days: 45 -> 60 min |
| 08-pickleball-genpop | calves > hips > quads > back > chest > shoulders > triceps > biceps | 2 | none | calves | calves, quads, back | calves, hips, quads, back | calves, hips, quads, back | calves, hips, quads, back | calves, hips, quads, back | 60 min: 2 -> 3 days; 75 min: 2 -> 3 days |
|  |  | 3 | none | calves, chest | calves, quads, chest | calves, quads, back, chest | calves, hips, quads, back, chest | calves, hips, quads, back, chest | calves, hips, quads, back, chest |  |

Cells list the groups trained directly at the floor (the keep vector). 105 plans were generated for the sweep.

## 10. Determinism (A22) and time (A23)

| Corpus | Identical twice in one process | Identical in a fresh process | p50 ms | p90 ms | p99 ms | max ms | first call p50 / max ms |
|---|---|---|---|---|---|---|---|
| C2 | 94 of 94 | 94 of 94 | 84.5 | 144.48 | 627.35 | 627.35 | 89.76 / 629.17 |
| C1 | 8 of 8 | 8 of 8 | 80.12 | 132.34 | 132.34 | 132.34 | 80.35 / 133.11 |

Times are one laptop run in V8 (the faster of two calls per intake); the target of PLANNER_SPEC 10.1 is p50 <= 60 ms and p99 <= 250 ms.

## 11. What the scorer covers

Of the 120 metrics of `design/rules_as_constraints.json > metrics_index`: 106 are computed, 14 cannot be measured on one plan JSON. Bench-only metrics (not in the inventory, they name a reviewed failure or an acceptance row): `credit_class_mismatch`, `credit_tally_mismatch`, `fits_inconsistent`, `offer_invalid`, `offer_mismatch`, `groups_out_for_time`, `keep_order_skips`, `day_lost_pattern`, `below_floor_states`, `slack_while_untrained`, `flat_weeks_excess`, `main_flat_weeks_excess`, `progression_missing`, `early_peak`, `athletic_flat`, `days_over_unwarned`, `days_over_band`, `minutes_recost_gap`, `group_over_ceiling`, `per_session_over_hard`, `athletic_attainment_ratio`, `exbudget_over`.

| Not measured | Rule | Why |
|---|---|---|
| `style_changes_sets` | T0-EFF-04 | needs the same intake generated with two lift styles |
| `olympic_dose` | T0-EFF-05 | the rep scheme by implement and catch is not in the plan JSON in a checkable form |
| `rep_phase_violation` | T0-EFF-07 | the VOL-phase rep matrix by rep class and exception is selection / dose logic; not re-implemented |
| `calendar_violation` | T0-STW-05 | needs holiday marks and event lead-ins of the intake against the block calendar |
| `trained_group_minimums` | T1-POL-01 | the union of floor_misses, one_exercise_groups and trained_not_climbing (reported in facts.trained_failing_minimums) |
| `full_plan_when_feasible` | T1-POL-03 | needs a solve of the full level plan (the scorer checks only that a plan that says it fits is consistent: fits_inconsistent) |
| `keep_order_inversion` | T1-POL-05 | needs an exhaustive check of the keep vector (C4 grid, A14); keep_order_skips is the one-plan signal |
| `protected_item_cut` | T1-POL-06 | needs the uncut template day; the parts that show on a plan are core_opener_missing, calf_rule, rear_delt_week, survival_cut |
| `below_floor_unlisted` | T1-POL-08 | scored as below_floor_states (A3) and unlisted_untrained (A4) |
| `squeezed_groups` | T1-POL-09 | same count as one_exercise_groups (T0-SES-10) |
| `edit_rebuild` | T1-POL-14 | needs a rebuild with a block toggled off |
| `split_day_group_counts` | T6-CNT-02 | needs to know whether a third exercise would fit the minutes (a solve) |
| `default_order_violations` | T7-ORD-03 | observed default orders are selection preferences; not re-implemented |
| `plane_mix_error` | T8-BAL-05 | contra / ipsi and plane shares are not in the plan JSON |

Parameters that are not read from `model/rules.json` (every other number is; the full list with sources is in the results file under `scorer.parameters`):

| Parameter | Value | Source |
|---|---|---|
| `calves_floor_mode` | `"per_leg_day"` | PLANNER_SPEC 4.7 default (rules.planner.calves.floor absent) |
| `total_rise_pct` | `0.07` | PLANNER_SPEC 4.7 default (rules.planner.stairway.total_rule_pct absent) |
| `total_rise_note_keys` | `["note.total_rise_10","warning.total_rise_10","why.total_rise_10"]` | scorer (the printed note that allows the 10 % fallback, PLANNER_SPEC 13.2 A9) |
| `band_factor` | `{"full_body":1.1,"split":1}` | PLANNER_SPEC 4.7 default (rules.planner.fit.full_plan_factor absent) |
| `exercise_margin` | `1` | PLANNER_SPEC 4.7 default (rules.planner.fit.exercise_margin absent) |
| `one_exercise_exempt_formats` | `["circuit"]` | inventory T0-SES-10 ("timed circuit days"), PLANNER_SPEC 13.2 note 3 |
| `set_bounds_skip_formats` | `["circuit"]` | PLANNER_SPEC 7.13 (rounds x stations are the circuit format's own dose) |
| `order_reading` | `"first"` | inventory T0-SES-05 / -06 formal statements (one position per pattern); "every" = the plain-text reading |
| `bilateral_first_regions` | `["lower"]` | BRAIN 6 order table ("bilateral before unilateral (same region)", OBSERVED on lower-body lifts); add "upper" to check the presses and pulls too |
| `recost_tolerance_min` | `2` | diagnosis DR-11 ("est_minutes equals a re-cost of the printed items within 2 min") |
| `slack_factor` | `0.85` | diagnosis DR-5 (a day more than 15 % under its minutes) |
| `athletic_attainment_min` | `0.9` | PLANNER_SPEC 13.2 A18 (planned dose under 0.9 x the scaled target) |
| `athletic_test_replaced_counts` | `true` | PLANNER_SPEC 5.5 R-TEST (a timed test takes the place of the station of its quality) |
| `pain_area_region` | `"{\"neck\":\"all\",\"shoulder\":\"upper\",\"elbow\":\"upper\",\"wrist_hand\":\"all\",\"upper_back\":\"upper\",\"lower_back\":\"all\",\"hip_groin\":\"lower\",\"knee\":\"lower\",\"ankle_foot\":\"..."` | scorer (INFERRED): the body region an area's avoid tags apply to - a fixed grip matters to a sore shoulder on a press or a pull, not on a calf raise; worse_with tags apply everywhere |
| `two_line_groups` | `"carrier_max"` | PLANNER_SPEC 4.7 default (rules.planner.group_targets.two_line_groups absent) |
| `myo_not_in_superset` | `false` | scorer: false = VOL-15 literal (the MYO set is on the day's last eligible exercise); true = engine E-158 (an exercise inside a superset is not eligible) |

## 12. Reading notes

- The engine, the model and the samples were being edited by another workflow while this ran. The fingerprint above identifies the files measured; "changed during the run" says whether a file changed between the first and the last generation.
- The scorer recounts sets, credits, exercises per group and minutes from the items; it uses the plan's own summary fields only to compare (`credit_tally_mismatch`). `engine validation ok` in section 1 is the engine's own `validation.ok`: it is not an acceptance criterion (PLANNER_SPEC 12.1).
- A rep-max test item is the top set of its lift: the two are one exercise for set bounds, set drops and the exercise count.
- `one_exercise_groups` (A5) exempts calves, circuit days, the strength family's four-role days, a class lift (a work lift of a group listed with reason `class_lift`, or a slot in `time_check.class_lifts`) and a station listed in `time_check.pattern_stations` at 2 constant sets for a group that is not trained. The 0.4 engine marks its kept movements only on the item (`origin: pattern_kept`), so they are counted; section 3 gives the split.
- `h_before_v` and the bilateral-before-unilateral part of `work_bilateral_myo_order` use the "first" reading (the first horizontal before the first vertical; lower body). The count under the "every" reading is in each plan's metric detail.
- `minutes_recost_gap` (A12) prices every printed item with DEF-09: work minutes of its time class, the rest class its printed rest falls in, pairs that are on share the rest, one changeover per exercise, the warm-up, skill, WOD, circuits, aerobic add-ons, 10 min per rep-max work-up and the timed tests. A gap means the printed `est_minutes` and the printed prescription disagree; it does not say which one is right.
- Flat blocks (maintenance, in-season, pre-season, taper, recovery), timed circuits and the year plan's flat first quarter are scored on the rows their format keeps: floors and minutes always, the set stairway only where the format climbs in sets (PLANNER_SPEC 13.2 note 3).
- Re-run: `node design/bench/run.mjs` (about 1 min). Compare a later engine: `node design/bench/run.mjs --label <name> --compare design/bench/results_baseline.json` (exit code 2 when a plan's score drops, A24).
