# Benchmark: v05

Engine 0.5.0, model 1.3.0, scorer 2.1.0 (107 metrics; no metric reads minutes). Run 2026-10-11T07:39:20.394Z, 31.25 s, v22.22.0.
Git 50fd654 on `planner-build` with 35 uncommitted engine / model files; fingerprint `338cb5d882e846ee` over 31 files.

## 1. Summary

| Corpus | Plans | Scored | Mean score | Median | Lowest | Hard violations | Plans with none | Plans passing every row |
|---|---|---|---|---|---|---|---|---|
| all | 102 | 102 | 95.59 | 96.73 | 86.71 | 26 | 97 | 48 |
| C2 | 94 | 94 | 95.63 | 96.73 | 86.71 | 26 | 89 | 46 |
| C1 | 8 | 8 | 95.15 | 92.23 | 91.62 | 0 | 8 | 2 |

## 2. Acceptance rows

| Row | What | Pass rule | Value | Result | Plans failing |
|---|---|---|---|---|---|
| A1 | hard_violations | sum == 0 | 26 | FAIL | 5 of 102 |
| A2 | floors: floor_misses, calf_floor_misses, two_day_rule_misses | sum == 0 | 0 | PASS | 0 of 98 |
| A3 | the coach's templates: skeleton_mismatch, template_lift_missing | sum == 0 | 0 | PASS | 0 of 93 |
| A4 | session size: session_size_over, exercises_per_group | sum == 0 | 0 | PASS | 0 of 102 |
| A5 | final sets: target_not_reached, arrival_early, below_schedule | sum == 0 | 0 | PASS | 0 of 90 |
| A6 | never down: set_drops, last_week_not_hardest, level_not_rising | sum == 0 | 0 | PASS | 0 of 98 |
| A7 | no time fitting: time_fields | sum == 0 | 0 | PASS | 0 of 102 |
| A8 | progression words: progression_rule_missing, acceleration_unnoted | sum == 0 | 0 | PASS | 0 of 93 |
| A9 | library: addon_picks, video_links, carry_dose | sum == 0 | 0 | PASS | 0 of 102 |
| A10 | liability gate: liability_gate, refer_or_release_violation | sum == 0 | 0 | PASS | 0 of 102 |
| A11 | nothing hidden: unsaid_cap, unexplained_decisions | sum == 0 | 36 | FAIL | 29 of 98 |
| A12 | athletic: athletic_drops, athletic_attainment | sum == 0 | 379 | FAIL | 45 of 63 |
| A13 | laterality_error | share of blocks within 0.12 >= 0.95 | 0.865 | FAIL | 19 of 71 |
| A14 | determinism | sum == 0 | 0 | PASS | 0 of 102 |

## 3. The v0.5 rules

| Metric | Rule | Kind | Violations | Checked | Plans with any | What it counts |
|---|---|---|---|---|---|---|
| time_fields | CT-01 | hard | 0 | 102 | 0 | time fitting left in the plan: a session length, a per-day minute limit, a time check, a schedule offer, a retired time warning |
| skeleton_mismatch | R4-SES-05 | hard | 0 | 22292 | 0 | a template A / B day that is not the coach's slots; lifts of a skeleton day outside their slot's pattern, out of his order or not from the template; a day that does not name its template's skeleton |
| template_lift_missing | R4-SES-04 | hard | 0 | 22439 | 0 | (stairway week, main day) counted template lifts that are absent with no stated reason (an exclusion, pain, play spacing, the 60+ default, no exercise in the kit) |
| session_size_over | R4-SES-02 | hard | 0 | 5425 | 0 | gym days with more counted exercises than the client type's range allows (warm-up, core, joint care, skill, conditioning, cardio, tests and the ankle prep are outside the count) |
| session_size_under | R4-SES-02 | soft | 0 | 3795 | 0 | main days of a stairway week under the range minimum although the template day holds that many counted stations and the day states no reason |
| exercises_per_group | R4-SES-05 | hard | 0 | 11833 | 0 | (week, full-body main day, group) with more than 4 exercises (calves, the strength family and timed circuits aside) |
| target_not_reached | CX-01 | hard | 0 | 593 | 0 | trained groups whose last-week sets are under the planned final sets |
| arrival_early | R4-PRG-01 | hard | 0 | 593 | 0 | trained groups whose schedule reaches its final sets more than one week before the last week |
| below_schedule | CX-01 | hard | 0 | 6814 | 0 | trained group-weeks under the planned whole-set schedule; schedules that are not whole sets, drop, or do not run from the start to the final sets; weekly targets that are not the schedule |
| floor_misses | T2-FLR-01 | hard_conditional | 0 | 5414 | 0 | plans of 3 or more training days: stairway group-weeks of a trained group under the floor of 10 on all days (a pain-reduced group its start) that the plan does not say |
| calf_floor_misses | T2-FLR-02 | hard_conditional | 0 | 950 | 0 | stairway weeks with calves trained under 3 sets x the main days that hold a calf exercise |
| two_day_rule_misses | R4-SES-03 | hard | 0 | 906 | 0 | 2-day plans: big group-weeks under 6 sets, a plan that does not say the rule or does not suggest a third day |
| unsaid_cap | R4-SES-04 | output | 0 | 649 | 0 | groups the template holds under the planned final sets, or under the floor, that the plan does not name |
| addon_picks | R4-LIB-01 | hard | 0 | 55884 | 0 | optional add-ons or proposed records placed by the template (wall balls and sled pushes in a HYROX station circuit or the class WOD excepted); a still-proposed record among the swaps or the offered add-ons |
| incline_share | R4-LIB-03 | soft | 0 | 36 | 0 | bodybuilding / general-population training blocks whose vertical / mid-range push slot is mostly overhead although the kit holds an incline press |
| liability_gate | R4-SCP-02 | hard | 0 | 102 | 0 | a plan with weeks whose release stamp does not say the release was accepted, or names the wrong version for its role and age |
| video_links | R4-LIB-05 | hard | 0 | 54960 | 0 | items or offered add-ons whose video is not a search link on the model's search URL (or the coach's own); any third-party video link in the plan |
| progression_rule_missing | R4-PRG-03 | hard | 0 | 53740 | 0 | set-and-rep lifts without the progression rule of their own rep range; any item that promises a number for a week |
| acceleration_unnoted | R4-PRG-02 | output | 0 | 7640 | 0 | stairway group-weeks that add more than about 15 % (2 or more whole sets) without the acceleration note |
| easy_to_remove_invalid | R4-SES-04 | hard | 0 | 16557 | 0 | easy-to-remove entries that name a core exercise, a main lift, the first athletic station, or an item that is not in the day |
| carry_dose | R4-LIB-02 | hard | 0 | 72 | 0 | carries or sled work counted in reps, credited as muscle sets, or (on their own) outside 2-4 trips of 20-40 m / 20-40 s |

## 4. Every metric with violations

| Metric | Rule | Kind | Violations | Plans with any | Points lost (sum) | Example |
|---|---|---|---|---|---|---|
| exposure_imbalance | T7-PLC-02 | soft | 1260 | 38 | 52.46 | 03-muscle-l2-4x75-upper-lower-focus-chest: quads: +0 on Mon, +1 on Thu |
| push_pull_ratio | T8-BAL-03 | soft | 607 | 57 | 53.04 | 01-muscle-l1-4x60-worked-example: pull 10 against push 16 (0.63) |
| athletic_attainment | T5-ATH-02 | objective | 379 | 45 | 111.82 | 21-weightlifter-5x90: olympic planned 16 of 26 |
| upper_laterality_error | T8-BAL-02 | soft | 144 | 69 | 57.74 | 01-muscle-l1-4x60-worked-example: upper bilateral share 0.9 against 0.5 |
| share_off | T3-ATH-02 | soft | 99 | 24 | 13.76 | 21-weightlifter-5x90: plyometric share 0 against 0.1 |
| frequency_shortfall | T7-WEEK-01 | soft | 64 | 3 | 2.28 | 90-hybrid-4x60: knee on 1 day(s) |
| cod_missing | T5-ATH-03 | soft | 60 | 5 | 5 | 66-tennis-rec-62-2x45-elbow: COD target 24, no COD station |
| near_duplicates | T8-VAR-03 | soft | 60 | 3 | 2.34 | 45-sprinter-field-kit-only-3x60: table-row-inverted-row-under-a-sturdy-table |
| group_over_ceiling | T5-CAP-01 | soft | 49 | 7 | 4.08 | 34-baseball-pitcher-4x75: hips credited 19.5 on all days, group ceiling 18 |
| athletic_flat | T3-ATH-01 | soft | 43 | 33 | 61.48 | 21-weightlifter-5x90: olympic planned 16 -> 16 while the target goes 26 -> 38 |
| unexplained_decisions | T0-SYS-03 | output | 36 | 29 | 36.64 | 21-weightlifter-5x90: olympic peaks at 16 of 38 (under 85 %) and is not told |
| laterality_error | T8-BAL-01 | soft | 27 | 19 | 42.01 | 16-strength-l3-4x90-tests: lower bilateral share 0.67 against 0.5 |
| over_ceiling | T5-CAP-01 | hard | 24 | 4 | 3.48 | 49-hyrox-open-4x75: lats_upper_back direct 16, credited 16 on all days, ceiling 13 |
| block_change_violations | T8-VAR-02 | soft | 15 | 14 | 2.14 | 27-football-ol-4x105: the work lift changes: 45-degree-hyperextension-back-hip-extension -> 45-degree-hyperextension-back-hip-extension -> staggered-stance-kickstand-db-deadlift |
| staircase_deviation | T7-PLC-01 | soft | 9 | 2 | 0.57 | 01-muscle-l1-4x60-worked-example: triceps sets 4/2 |
| athletic_over_budget | T5-ATH-01 | hard | 2 | 1 | 0.56 | 58-crossfit-individual-5x90: jumps planned 24, target 5 (limit 16.25) |
| repeated_exposure | T8-VAR-01 | soft | 1 | 1 | 0.15 | 09-muscle-l2-4x45-home-db-focus-arms: table-row-inverted-row-under-a-sturdy-table on both Mon and Thu (exercise block 1) |

Reported, never judged:

| Value | Rule | Total or mean | Measured on |
|---|---|---|---|
| below_floor_deficit | T2-FLR-05 | 20.08 | 12 |
| ceiling_shortfall | T5-CAP-04 | 988.25 | 90 |
| athletic_attainment_ratio | T5-ATH-02 | 0.8 | 63 |
| exercise_count | T6-CNT-03 | 626.58 | 102 |
| group_balance | T8-BAL-04 | 0.32 | 90 |

## 5. Every plan

`Val` = the engine's own validation (failing error checks). `Rows` = acceptance rows that fail. Edge cases in bold.

| Intake | Template | Days | Size | Score | Hard | Val | Rows | Largest deduction |
|---|---|---|---|---|---|---|---|---|
| 01-muscle-l1-4x60-worked-example | aesthetics.4 | 4 | aesthetics 6-8 | 97.88 | 0 | ok | all pass | push_pull_ratio (1) |
| 02-muscle-l1-3x60-basic-gym | aesthetics.3 | 3 | aesthetics 6-8 | 98.16 | 0 | ok | all pass | push_pull_ratio (1) |
| 03-muscle-l2-4x75-upper-lower-focus-chest | aesthetics.4 / upper_lower | 4 | aesthetics 6-8 | 98.27 | 0 | ok | all pass | exposure_imbalance (1.1547) |
| 04-muscle-l3-5x90-focus-glutes-hams | aesthetics.5 | 5 | aesthetics 6-8 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| 05-muscle-l3-6x90-ppl-v-taper | aesthetics.6 / ppl_x2 | 6 | aesthetics 6-8 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| **06-muscle-l3-6x120-goal-muscle-edge** | aesthetics.6 | 6 | aesthetics 6-8 | 98.78 | 0 | ok | all pass | exposure_imbalance (0.6396) |
| **07-muscle-l2-2x45-edge** | aesthetics.2 | 2 | aesthetics 6-8 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| **08-muscle-l2-3x30-edge** | aesthetics.3 | 3 | aesthetics 6-8 | 98.42 | 0 | ok | all pass | push_pull_ratio (1) |
| 09-muscle-l2-4x45-home-db-focus-arms | aesthetics.4 | 4 | aesthetics 6-8 | 97.8 | 0 | ok | all pass | exposure_imbalance (1.2247) |
| 10-muscle-older-62-3x60-machines-shoulder | aesthetics.3 | 3 | older 5-6 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| 11-muscle-l3-4x90-heavy-style-focus-back | aesthetics.4 | 4 | aesthetics 6-8 | 98.78 | 0 | ok | all pass | exposure_imbalance (0.6396) |
| 12-muscle-l2-3x45-hotel-maintenance | aesthetics.3 | 3 | aesthetics 6-8 | 100 | 0 | ok | all pass | - |
| 13-muscle-l2-4x60-year-plan | aesthetics.4 | 4 | aesthetics 6-8 | 97.68 | 0 | ok | all pass | push_pull_ratio (0.8944) |
| 14-muscle-l2-5x60-fixed-8-kg-es | aesthetics.5 | 5 | aesthetics 6-8 | 98.13 | 0 | ok | all pass | exposure_imbalance (1.165) |
| 15-strength-l2-3x90-home-barbell | strength.3 | 3 | strength 5-6 | 100 | 0 | ok | all pass | - |
| 16-strength-l3-4x90-tests | strength.4 | 4 | strength 5-6 | 97.27 | 0 | ok | A13 | laterality_error (1.7321) |
| 17-strength-l1-2x60-55-low-back | strength.2 | 2 | strength 5-6 | 96.73 | 0 | ok | A13 | laterality_error (1.7321) |
| 18-strength-l3-5x75 | strength.5 | 5 | strength 5-6 | 97.27 | 0 | ok | A13 | laterality_error (1.7321) |
| 19-strength-l2-6x60-fixed-8 | strength.6 | 6 | strength 5-6 | 97.88 | 0 | ok | A13 | laterality_error (2.1213) |
| 20-powerlifter-raw-4x120-meet | athletic.4 / same_pattern | 4 | athletic 6-12 | 99 | 0 | ok | all pass | push_pull_ratio (1) |
| 21-weightlifter-5x90 | athletic.5 | 5 | athletic 6-12 | 90.47 | 0 | ok | A11 A12 | athletic_attainment (4.2426) |
| **22-bodybuilder-6x120-edge** | athletic.6 | 6 | athletic 6-12 | 100 | 0 | ok | all pass | - |
| 23-swim-sprint-free-15-4x75 | athletic.4 | 4 | athletic 6-12 | 98.62 | 0 | ok | A12 | athletic_attainment (0.866) |
| **24-swim-distance-im-2x45-edge** | athletic.2 | 2 | athletic 6-12 | 95.38 | 0 | ok | A13 | laterality_error (2.1213) |
| 25-football-qb-4x75 | athletic.4 | 4 | athletic 6-12 | 94.84 | 0 | ok | A12 A13 | laterality_error (2.4495) |
| 26-football-wr-5x90 | athletic.5 | 5 | athletic 6-12 | 94.93 | 0 | ok | A12 A13 | laterality_error (1.7321) |
| 27-football-ol-4x105 | athletic.4 / same_pattern | 4 | athletic 6-12 | 97.4 | 0 | ok | A12 | athletic_attainment (0.7071) |
| 28-football-kp-3x60 | athletic.3 | 3 | athletic 6-12 | 93.24 | 0 | ok | A13 | laterality_error (3) |
| 29-soccer-goalkeeper-3x60 | athletic.3 | 3 | athletic 6-12 | 92.48 | 0 | ok | A12 A13 | laterality_error (3) |
| **30-soccer-forward-in-season-2x45-games-edge** | athletic.2 | 2 | athletic 6-12 | 100 | 0 | ok | all pass | - |
| 31-basketball-guard-16-4x60 | athletic.4 | 4 | athletic 6-12 | 96.61 | 0 | ok | A12 | upper_laterality_error (1) |
| **32-basketball-wing-2x30-edge** | athletic.2 | 2 | athletic 6-12 | 94.78 | 0 | ok | A11 A12 | athletic_attainment (1.5811) |
| 33-basketball-big-in-season-2x60-games | athletic.2 | 2 | athletic 6-12 | 100 | 0 | ok | all pass | - |
| 34-baseball-pitcher-4x75 | athletic.4 / baseball_parts | 4 | athletic 6-12 | 98.24 | 0 | ok | all pass | group_over_ceiling (0.8165) |
| 35-softball-catcher-3x60 | athletic.3 | 3 | athletic 6-12 | 90.28 | 0 | ok | A11 A12 A13 | athletic_attainment (2.6458) |
| 36-hockey-forward-4x90 | athletic.4 | 4 | athletic 6-12 | 95.56 | 0 | ok | A12 A13 | laterality_error (1.7321) |
| 37-hockey-goalie-3x45 | athletic.3 | 3 | athletic 6-12 | 96.24 | 0 | ok | all pass | exposure_imbalance (1.7581) |
| 38-tennis-singles-3x75 | athletic.3 | 3 | athletic 6-12 | 90.37 | 0 | ok | A11 A12 A13 | laterality_error (3) |
| 39-volleyball-outside-3x90-knee | athletic.3 | 3 | athletic 6-12 | 86.71 | 0 | ok | A11 A12 A13 | athletic_attainment (3.4641) |
| 40-volleyball-libero-15-4x45 | athletic.4 | 4 | athletic 6-12 | 96.4 | 0 | ok | A12 | athletic_attainment (1.4142) |
| 41-wrestling-middle-3x60-meet | athletic.3 / same_pattern | 3 | athletic 6-12 | 97.34 | 0 | ok | all pass | exposure_imbalance (1.9518) |
| 42-mma-light-4x75 | athletic.4 | 4 | athletic 6-12 | 97.76 | 0 | ok | all pass | push_pull_ratio (1) |
| 43-bjj-masters-3x45 | athletic.3 | 3 | athletic 6-12 | 93.67 | 0 | ok | A11 A12 | athletic_attainment (1.957) |
| 44-sprinter-100m-4x90 | athletic.4 | 4 | athletic 6-12 | 96.56 | 0 | ok | A12 | push_pull_ratio (1) |
| 45-sprinter-field-kit-only-3x60 | athletic.3 | 3 | athletic 6-12 | 89.7 | 0 | ok | A11 A12 | athletic_attainment (2.6833) |
| 46-thrower-4x120 | athletic.4 / same_pattern | 4 | athletic 6-12 | 99.54 | 0 | ok | all pass | exposure_imbalance (0.4558) |
| 47-marathoner-2x60 | athletic.2 | 2 | athletic 6-12 | 96.68 | 0 | ok | all pass | athletic_flat (1.5) |
| 48-cross-country-14-3x45-bodyweight | athletic.3 | 3 | athletic 6-12 | 91.25 | 0 | ok | A11 A12 | athletic_attainment (3.1225) |
| 49-hyrox-open-4x75 | athletic.4 / hyrox | 4 | athletic 6-12 | 94.35 | 12 | ok | A1 A13 | laterality_error (1.7321) |
| 50-lacrosse-midfield-3x75 | athletic.3 | 3 | athletic 6-12 | 92.7 | 0 | ok | A13 | laterality_error (3) |
| 51-rugby-forwards-4x90 | athletic.4 / same_pattern | 4 | athletic 6-12 | 98.16 | 0 | ok | all pass | upper_laterality_error (0.8165) |
| 52-golf-masters-58-2x45 | athletic.2 | 2 | athletic 6-12 | 94.41 | 0 | ok | A11 A12 | athletic_attainment (2.4495) |
| 53-gymnast-13-3x60 | athletic.3 | 3 | athletic 6-12 | 96.43 | 0 | ok | all pass | exposure_imbalance (1.7581) |
| 54-cyclist-road-3x45 | athletic.3 | 3 | athletic 6-12 | 95.46 | 0 | ok | all pass | exposure_imbalance (1.6697) |
| 55-triathlete-70-3-2x45 | athletic.2 | 2 | athletic 6-12 | 99 | 0 | ok | all pass | upper_laterality_error (1) |
| 56-climber-boulder-3x60-elbow | athletic.3 / same_pattern | 3 | athletic 6-12 | 97.04 | 0 | ok | all pass | exposure_imbalance (1.8091) |
| 57-rower-sweep-4x60 | athletic.4 | 4 | athletic 6-12 | 99.29 | 0 | ok | all pass | push_pull_ratio (0.7071) |
| 58-crossfit-individual-5x90 | hybrid_crossfit.5 | 5 | class 5-7 | 93.03 | 2 | ok | A1 A11 A12 | athletic_attainment (2.3842) |
| 59-cheer-flyer-15-3x45 | athletic.3 | 3 | athletic 6-12 | 91.99 | 4 | ok | A1 A13 | laterality_error (1.7321) |
| 60-pickleball-57-3x45 | athletic.3 | 3 | stay_active 5-8 | 90.97 | 0 | ok | A11 A12 A13 | athletic_attainment (1.7321) |
| 61-pickleball-66-2x60-opt-in | athletic.2 | 2 | older 5-6 | 87.06 | 4 | ok | A1 A11 A12 | athletic_attainment (5.0498) |
| **62-pickleball-52-2x45-no-core-edge** | athletic.2 | 2 | stay_active 5-8 | 92.03 | 0 | ok | A11 A12 | athletic_attainment (2.7386) |
| 63-hyrox-fitness-4x60 | athletic.4 / hyrox | 4 | stay_active 5-8 | 92.27 | 0 | ok | A11 A12 | athletic_attainment (1.8974) |
| 64-crossfit-class-3x60 | hybrid_crossfit.3 | 3 | class 5-7 | 91.54 | 0 | ok | A12 | athletic_attainment (3.6742) |
| 65-crossfit-class-5x60 | hybrid_crossfit.5 | 5 | class 5-7 | 91.31 | 0 | ok | A12 | athletic_attainment (3.4641) |
| 66-tennis-rec-62-2x45-elbow | athletic.2 | 2 | older 5-6 | 90.31 | 4 | ok | A1 A11 A12 | athletic_attainment (3.4641) |
| 67-rec-league-soccer-3x60 | athletic.3 | 3 | stay_active 5-8 | 87.06 | 0 | ok | A11 A12 A13 | athletic_attainment (3.3912) |
| 68-run-fitness-2x45-kb-only | athletic.2 | 2 | stay_active 5-8 | 92.8 | 0 | ok | A11 A12 | athletic_attainment (2.3009) |
| 69-hike-ruck-68-3x45-knee-back | athletic.3 | 3 | older 5-6 | 88.16 | 0 | ok | A11 A12 | athletic_attainment (4.899) |
| 70-weekend-warrior-3x60-event | athletic.3 | 3 | stay_active 5-8 | 91.15 | 0 | ok | A11 A12 | athletic_attainment (2.5298) |
| **71-golf-rec-72-2x30-bodyweight-edge** | athletic.2 | 2 | older 5-6 | 87.24 | 0 | ok | A11 A12 | athletic_attainment (4.899) |
| 72-combat-fitness-striking-4x60 | athletic.4 | 4 | stay_active 5-8 | 95.55 | 0 | ok | A12 | athletic_attainment (1.5492) |
| 73-lap-swim-59-3x60 | athletic.3 | 3 | stay_active 5-8 | 92.58 | 0 | ok | A11 A12 | athletic_flat (2.1213) |
| 74-ski-prep-3x60-fixed-8 | athletic.3 | 3 | stay_active 5-8 | 92.43 | 0 | ok | A11 A12 | athletic_attainment (2.1213) |
| 75-athletic-no-sport-3x60 | athletic.3 | 3 | stay_active 5-8 | 91.95 | 0 | ok | A11 A12 | athletic_attainment (2.4495) |
| 76-athletic-rec-league-basketball-2x60 | athletic.2 | 2 | stay_active 5-8 | 89.58 | 0 | ok | A11 A12 | athletic_attainment (3.7947) |
| 77-fat-loss-gym-l1-4x60-focus-glutes | fat_loss_bootcamp.4 | 4 | general 5-7 | 98.18 | 0 | ok | all pass | upper_laterality_error (1) |
| 78-fat-loss-bootcamp-l1-3x45 | fat_loss_bootcamp.3 | 3 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 79-fat-loss-bootcamp-l2-5x45 | fat_loss_bootcamp.5 | 5 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 80-fat-loss-gym-l2-6x60 | fat_loss_bootcamp.6 | 6 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 81-general-gym-l2-3x60 | fat_loss_bootcamp.3 | 3 | bootcamp 5-7 | 92.28 | 0 | ok | A11 A12 | athletic_attainment (4.3339) |
| **82-general-gym-l1-2x30-edge** | fat_loss_bootcamp.2 | 2 | general 5-7 | 98.04 | 0 | ok | all pass | upper_laterality_error (1) |
| 83-general-bootcamp-l2-4x45 | fat_loss_bootcamp.4 / bootcamp_circuit | 4 | bootcamp 5-7 | 92.28 | 0 | ok | A11 A12 | athletic_attainment (4.3339) |
| **84-general-bodyweight-74-3x45-edge** | no_equipment.3 | 3 | older 5-6 | 100 | 0 | ok | all pass | - |
| 85-general-kb-only-4x45 | fat_loss_bootcamp.4 | 4 | general 5-7 | 98.04 | 0 | ok | all pass | upper_laterality_error (1) |
| 86-general-gym-l2-5x75-second-cycle | fat_loss_bootcamp.5 | 5 | bootcamp 5-7 | 92.46 | 0 | ok | A11 A12 | athletic_attainment (4.1494) |
| 87-general-coach-client-81-2x45-hip | fat_loss_bootcamp.2 | 2 | older 5-6 | 99 | 0 | ok | all pass | push_pull_ratio (1) |
| 88-general-layoff-l1-4x60 | fat_loss_bootcamp.4 | 4 | general 5-7 | 97.48 | 0 | ok | all pass | upper_laterality_error (1) |
| 89-general-maintenance-3x60-6wk | fat_loss_bootcamp.3 | 3 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 90-hybrid-4x60 | hybrid_crossfit.4 / crossfit_style_bootcamp | 4 | class 5-7 | 98.29 | 0 | ok | all pass | upper_laterality_error (1) |
| 91-hybrid-3x75-full-gym | hybrid_crossfit.3 | 3 | class 5-7 | 98.18 | 0 | ok | all pass | upper_laterality_error (1) |
| 92-hybrid-l3-5x90 | hybrid_crossfit.5 | 5 | class 5-7 | 99 | 0 | ok | all pass | push_pull_ratio (1) |
| **93-hybrid-2x45-edge** | hybrid_crossfit.2 | 2 | class 5-7 | 97.22 | 0 | ok | all pass | upper_laterality_error (1) |
| 94-hybrid-6x60 | hybrid_crossfit.6 | 6 | class 5-7 | 98.13 | 0 | ok | all pass | push_pull_ratio (1) |
| 01-swimming | athletic.3 | 3 | athletic 6-12 | 97.41 | 0 | ok | A12 | exposure_imbalance (1.7233) |
| 02-football | athletic.4 | 4 | athletic 6-12 | 96.85 | 0 | ok | A12 | upper_laterality_error (1) |
| 03-soccer | athletic.3 | 3 | athletic 6-12 | 92.22 | 0 | ok | A12 A13 | laterality_error (3) |
| 04-crossfit-style-bootcamp | hybrid_crossfit.4 / crossfit_style_bootcamp | 4 | class 5-7 | 91.62 | 0 | ok | A12 | athletic_attainment (3.6742) |
| 05-bootcamp | fat_loss_bootcamp.3 | 3 | bootcamp 5-7 | 92.23 | 0 | ok | A11 A12 | athletic_attainment (4.3818) |
| 06-full-body-aesthetics | aesthetics.4 | 4 | aesthetics 6-8 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| 07-push-pull-legs | aesthetics.6 / ppl_x2 | 6 | aesthetics 6-8 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| 08-pickleball-genpop | athletic.2 | 2 | stay_active 5-8 | 92.03 | 0 | ok | A11 A12 | athletic_attainment (2.7386) |

## 6. Determinism and speed

| Corpus | Same bytes twice in one process | Fresh process checked | Fresh process differs | generate() p50 ms | p99 ms | max ms |
|---|---|---|---|---|---|---|
| C2 | 94 of 94 | 94 | 0 | 89.87 | 484.99 | 492.18 |
| C1 | 8 of 8 | 8 | 0 | 72.63 | 147.27 | 147.27 |

## How to read this

- The scorer recounts sets, credits, exercises per group and the session's exercise count from the plan's items; it uses the plan's own summary fields only to compare (`credit_tally_mismatch`). It never imports the engine.
- The coach's templates are read from `model/templates.json`: a template A / B day must hold his slots in his order, and a plan day must hold its template's counted lifts (`skeleton_mismatch`, `template_lift_missing`).
- A group the template cannot take to its planned final sets, or cannot hold at the floor, is not a violation when the plan says so (`unsaid_cap` counts the ones it does not say; `below_floor_deficit` reports the size of what it says).
- Hard and hard_conditional metrics are exact counts (A1). The 0-100 score weights them with the points in `score.mjs > METRICS`.
- Not measured on one plan JSON: style_changes_sets, olympic_dose, rep_phase_violation, calendar_violation, next_block_start, edit_recompute, release_line_printed, profile_confidence, default_order_violations, plane_mix_error (see `NOT_MEASURED` in `score.mjs`).
- Re-run: `node design/bench/run.mjs` (about 1 min). Compare a later engine: `node design/bench/run.mjs --label <name> --compare design/bench/results_v05.json`.
