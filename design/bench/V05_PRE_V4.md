> **History only.** This is the first benchmark run of work package V4 (2026-10-11): engine 0.5.0 as work packages V1-V3 left it, scored with scorer 2.0.0, before the V4 engine and scorer fixes. The current run is `V05.md` / `results_v05.json`. What changed between the two is in `samples/STATUS_v0.5.md`.

# Benchmark: v05

Engine 0.5.0, model 1.3.0, scorer 2.0.0 (107 metrics; no metric reads minutes). Run 2026-10-11T06:50:27.905Z, 31.07 s, v22.22.0.
Git 50fd654 on `planner-build` with 35 uncommitted engine / model files; fingerprint `185887f175284c66` over 31 files.

## 1. Summary

| Corpus | Plans | Scored | Mean score | Median | Lowest | Hard violations | Plans with none | Plans passing every row |
|---|---|---|---|---|---|---|---|---|
| all | 102 | 102 | 94.48 | 94.73 | 85.15 | 673 | 47 | 27 |
| C2 | 94 | 94 | 94.54 | 95.49 | 85.15 | 634 | 44 | 25 |
| C1 | 8 | 8 | 93.73 | 92.23 | 89.06 | 39 | 3 | 2 |

## 2. Acceptance rows

| Row | What | Pass rule | Value | Result | Plans failing |
|---|---|---|---|---|---|
| A1 | hard_violations | sum == 0 | 673 | FAIL | 55 of 102 |
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
| A12 | athletic: athletic_drops, athletic_attainment | sum == 0 | 427 | FAIL | 45 of 63 |
| A13 | laterality_error | share of blocks within 0.12 >= 0.95 | 0.8966 | FAIL | 19 of 90 |
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
| addon_picks | R4-LIB-01 | hard | 0 | 56142 | 0 | optional add-ons or proposed records placed by the template (wall balls and sled pushes in a HYROX station circuit or the class WOD excepted); a still-proposed record among the swaps or the offered add-ons |
| incline_share | R4-LIB-03 | soft | 0 | 36 | 0 | bodybuilding / general-population training blocks whose vertical / mid-range push slot is mostly overhead although the kit holds an incline press |
| liability_gate | R4-SCP-02 | hard | 0 | 102 | 0 | a plan with weeks whose release stamp does not say the release was accepted, or names the wrong version for its role and age |
| video_links | R4-LIB-05 | hard | 0 | 55218 | 0 | items or offered add-ons whose video is not a search link on the model's search URL (or the coach's own); any third-party video link in the plan |
| progression_rule_missing | R4-PRG-03 | hard | 0 | 54328 | 0 | set-and-rep lifts without the progression rule of their own rep range; any item that promises a number for a week |
| acceleration_unnoted | R4-PRG-02 | output | 0 | 7640 | 0 | stairway group-weeks that add more than about 15 % (2 or more whole sets) without the acceleration note |
| easy_to_remove_invalid | R4-SES-04 | hard | 0 | 16995 | 0 | easy-to-remove entries that name a core exercise, a main lift, the first athletic station, or an item that is not in the day |
| carry_dose | R4-LIB-02 | hard | 0 | 72 | 0 | carries or sled work counted in reps, credited as muscle sets, or (on their own) outside 2-4 trips of 20-40 m / 20-40 s |

## 4. Every metric with violations

| Metric | Rule | Kind | Violations | Plans with any | Points lost (sum) | Example |
|---|---|---|---|---|---|---|
| exposure_imbalance | T7-PLC-02 | soft | 1245 | 38 | 52.02 | 03-muscle-l2-4x75-upper-lower-focus-chest: quads: +0 on Mon, +1 on Thu |
| push_pull_ratio | T8-BAL-03 | soft | 612 | 58 | 53.69 | 01-muscle-l1-4x60-worked-example: pull 10 against push 16 (0.63) |
| athletic_order | T0-SES-07 | hard | 453 | 29 | 58.48 | 23-swim-sprint-free-15-4x75: AP_PLYO > AP_THROW > AP_JUMP_LIMITED_KNEE |
| athletic_attainment | T5-ATH-02 | objective | 379 | 45 | 111.82 | 21-weightlifter-5x90: olympic planned 16 of 26 |
| group_over_ceiling | T5-CAP-01 | soft | 144 | 13 | 9.79 | 31-basketball-guard-16-4x60: hips credited 22 on all days, group ceiling 16 |
| upper_laterality_error | T8-BAL-02 | soft | 129 | 60 | 51.48 | 01-muscle-l1-4x60-worked-example: upper bilateral share 0.63 against 0.5 |
| share_off | T3-ATH-02 | soft | 99 | 24 | 13.76 | 21-weightlifter-5x90: plyometric share 0 against 0.1 |
| over_ceiling | T5-CAP-01 | hard | 72 | 8 | 8.38 | 31-basketball-guard-16-4x60: hamstrings direct 18, credited 18.5 on all days, ceiling 16 |
| frequency_shortfall | T7-WEEK-01 | soft | 64 | 3 | 2.28 | 90-hybrid-4x60: knee on 1 day(s) |
| cod_missing | T5-ATH-03 | soft | 60 | 5 | 5 | 66-tennis-rec-62-2x45-elbow: COD target 24, no COD station |
| near_duplicates | T8-VAR-03 | soft | 60 | 3 | 2.34 | 45-sprinter-field-kit-only-3x60: table-row-inverted-row-under-a-sturdy-table |
| athletic_drops | T3-ATH-01 | hard_conditional | 48 | 12 | 18.52 | 23-swim-sprint-free-15-4x75: jumps 58 -> 46 |
| work_bilateral_myo_order | T0-SES-06 | hard | 46 | 35 | 24.24 | 03-muscle-l2-4x75-upper-lower-focus-chest: MYO on Thu.Lower 2.s10, not the last eligible item (Thu.Lower 2.s11) |
| athletic_flat | T3-ATH-01 | soft | 43 | 33 | 61.48 | 21-weightlifter-5x90: olympic planned 16 -> 16 while the target goes 26 -> 38 |
| unexplained_decisions | T0-SYS-03 | output | 36 | 29 | 36.64 | 21-weightlifter-5x90: olympic peaks at 16 of 38 (under 85 %) and is not told |
| missing_warmup | T0-SES-01 | hard | 36 | 3 | 4.02 | 58-crossfit-individual-5x90: first block is core |
| laterality_error | T8-BAL-01 | soft | 27 | 19 | 42.01 | 16-strength-l3-4x90-tests: lower bilateral share 0.67 against 0.5 |
| block_change_violations | T8-VAR-02 | soft | 15 | 14 | 2.12 | 27-football-ol-4x105: the work lift changes: 45-degree-hyperextension-back-hip-extension -> 45-degree-hyperextension-back-hip-extension -> staggered-stance-kickstand-db-deadlift |
| missing_primary_pattern | T1-POL-07 | hard_conditional | 12 | 1 | 3 | 84-general-bodyweight-74-3x45-edge: no hpush exercise in the week |
| staircase_deviation | T7-PLC-01 | soft | 9 | 2 | 0.57 | 01-muscle-l1-4x60-worked-example: triceps sets 4/2 |
| stage_violation | T0-ATH-02 | hard | 4 | 1 | 1.02 | 40-volleyball-libero-15-4x45: plyometric in RC1 |
| athletic_over_budget | T5-ATH-01 | hard | 2 | 1 | 0.56 | 58-crossfit-individual-5x90: jumps planned 24, target 5 (limit 16.25) |

Reported, never judged:

| Value | Rule | Total or mean | Measured on |
|---|---|---|---|
| below_floor_deficit | T2-FLR-05 | 21.22 | 11 |
| ceiling_shortfall | T5-CAP-04 | 983.25 | 90 |
| athletic_attainment_ratio | T5-ATH-02 | 0.8 | 63 |
| exercise_count | T6-CNT-03 | 626.58 | 102 |
| group_balance | T8-BAL-04 | 0.31 | 90 |

## 5. Every plan

`Val` = the engine's own validation (failing error checks). `Rows` = acceptance rows that fail. Edge cases in bold.

| Intake | Template | Days | Size | Score | Hard | Val | Rows | Largest deduction |
|---|---|---|---|---|---|---|---|---|
| 01-muscle-l1-4x60-worked-example | undefined | 4 | aesthetics 6-8 | 98.12 | 0 | ok | all pass | push_pull_ratio (1) |
| 02-muscle-l1-3x60-basic-gym | undefined | 3 | aesthetics 6-8 | 98.73 | 0 | ok | all pass | push_pull_ratio (1) |
| 03-muscle-l2-4x75-upper-lower-focus-chest | undefined | 4 | aesthetics 6-8 | 97.71 | 1 | ok | A1 | exposure_imbalance (1.1547) |
| 04-muscle-l3-5x90-focus-glutes-hams | undefined | 5 | aesthetics 6-8 | 100 | 0 | ok | all pass | - |
| 05-muscle-l3-6x90-ppl-v-taper | undefined | 6 | aesthetics 6-8 | 98.97 | 1 | ok | A1 | upper_laterality_error (0.5774) |
| **06-muscle-l3-6x120-goal-muscle-edge** | undefined | 6 | aesthetics 6-8 | 99.36 | 0 | ok | all pass | exposure_imbalance (0.6396) |
| **07-muscle-l2-2x45-edge** | undefined | 2 | aesthetics 6-8 | 100 | 0 | ok | all pass | - |
| **08-muscle-l2-3x30-edge** | undefined | 3 | aesthetics 6-8 | 99 | 0 | ok | all pass | push_pull_ratio (1) |
| 09-muscle-l2-4x45-home-db-focus-arms | undefined | 4 | aesthetics 6-8 | 98.2 | 0 | ok | all pass | exposure_imbalance (1.2247) |
| 10-muscle-older-62-3x60-machines-shoulder | undefined | 3 | older 5-6 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| 11-muscle-l3-4x90-heavy-style-focus-back | undefined | 4 | aesthetics 6-8 | 98.78 | 0 | ok | all pass | exposure_imbalance (0.6396) |
| 12-muscle-l2-3x45-hotel-maintenance | undefined | 3 | aesthetics 6-8 | 100 | 0 | ok | all pass | - |
| 13-muscle-l2-4x60-year-plan | undefined | 4 | aesthetics 6-8 | 98.29 | 0 | ok | all pass | push_pull_ratio (0.8944) |
| 14-muscle-l2-5x60-fixed-8-kg-es | undefined | 5 | aesthetics 6-8 | 98.84 | 0 | ok | all pass | exposure_imbalance (1.165) |
| 15-strength-l2-3x90-home-barbell | undefined | 3 | strength 5-6 | 100 | 0 | ok | all pass | - |
| 16-strength-l3-4x90-tests | undefined | 4 | strength 5-6 | 97.27 | 0 | ok | A13 | laterality_error (1.7321) |
| 17-strength-l1-2x60-55-low-back | undefined | 2 | strength 5-6 | 96.73 | 0 | ok | A13 | laterality_error (1.7321) |
| 18-strength-l3-5x75 | undefined | 5 | strength 5-6 | 97.27 | 0 | ok | A13 | laterality_error (1.7321) |
| 19-strength-l2-6x60-fixed-8 | undefined | 6 | strength 5-6 | 97.88 | 0 | ok | A13 | laterality_error (2.1213) |
| 20-powerlifter-raw-4x120-meet | undefined | 4 | athletic 6-12 | 98.44 | 1 | ok | A1 | push_pull_ratio (1) |
| 21-weightlifter-5x90 | undefined | 5 | athletic 6-12 | 89.91 | 1 | ok | A1 A11 A12 | athletic_attainment (4.2426) |
| **22-bodybuilder-6x120-edge** | undefined | 6 | athletic 6-12 | 99.22 | 2 | ok | A1 | work_bilateral_myo_order (0.7845) |
| 23-swim-sprint-free-15-4x75 | undefined | 4 | athletic 6-12 | 94.33 | 25 | ok | A1 A12 | athletic_order (2.2361) |
| **24-swim-distance-im-2x45-edge** | undefined | 2 | athletic 6-12 | 92.07 | 18 | ok | A1 A13 | athletic_order (2.5249) |
| 25-football-qb-4x75 | undefined | 4 | athletic 6-12 | 92.78 | 7 | ok | A1 A12 A13 | laterality_error (2.4495) |
| 26-football-wr-5x90 | undefined | 5 | athletic 6-12 | 91.37 | 19 | ok | A1 A12 A13 | laterality_error (1.7321) |
| 27-football-ol-4x105 | undefined | 4 | athletic 6-12 | 94.73 | 25 | ok | A1 A12 | athletic_order (2.1213) |
| 28-football-kp-3x60 | undefined | 3 | athletic 6-12 | 91.51 | 12 | ok | A1 A13 | laterality_error (3) |
| 29-soccer-goalkeeper-3x60 | undefined | 3 | athletic 6-12 | 92.48 | 0 | ok | A12 A13 | laterality_error (3) |
| **30-soccer-forward-in-season-2x45-games-edge** | undefined | 2 | athletic 6-12 | 97 | 16 | ok | A1 | athletic_order (3) |
| 31-basketball-guard-16-4x60 | undefined | 4 | athletic 6-12 | 92.23 | 20 | ok | A1 A12 | athletic_drops (1.2309) |
| **32-basketball-wing-2x30-edge** | undefined | 2 | athletic 6-12 | 88.64 | 38 | ok | A1 A11 A12 | athletic_order (3) |
| 33-basketball-big-in-season-2x60-games | undefined | 2 | athletic 6-12 | 97 | 24 | ok | A1 | athletic_order (3) |
| 34-baseball-pitcher-4x75 | undefined | 4 | athletic 6-12 | 95.95 | 13 | ok | A1 | athletic_order (1.7321) |
| 35-softball-catcher-3x60 | undefined | 3 | athletic 6-12 | 88.55 | 12 | ok | A1 A11 A12 A13 | athletic_attainment (2.6458) |
| 36-hockey-forward-4x90 | undefined | 4 | athletic 6-12 | 91.5 | 30 | ok | A1 A12 A13 | athletic_order (2.1213) |
| 37-hockey-goalie-3x45 | undefined | 3 | athletic 6-12 | 96.24 | 0 | ok | all pass | exposure_imbalance (1.7581) |
| 38-tennis-singles-3x75 | undefined | 3 | athletic 6-12 | 87.72 | 14 | ok | A1 A11 A12 A13 | laterality_error (3) |
| 39-volleyball-outside-3x90-knee | undefined | 3 | athletic 6-12 | 85.15 | 12 | ok | A1 A11 A12 A13 | athletic_attainment (3.4641) |
| 40-volleyball-libero-15-4x45 | undefined | 4 | athletic 6-12 | 92.69 | 17 | ok | A1 A12 | athletic_attainment (1.4142) |
| 41-wrestling-middle-3x60-meet | undefined | 3 | athletic 6-12 | 95.61 | 8 | ok | A1 | exposure_imbalance (1.9518) |
| 42-mma-light-4x75 | undefined | 4 | athletic 6-12 | 96.26 | 12 | ok | A1 | athletic_order (1.5) |
| 43-bjj-masters-3x45 | undefined | 3 | athletic 6-12 | 93.67 | 0 | ok | A11 A12 | athletic_attainment (1.957) |
| 44-sprinter-100m-4x90 | undefined | 4 | athletic 6-12 | 91.49 | 30 | ok | A1 A12 | athletic_order (2.1213) |
| 45-sprinter-field-kit-only-3x60 | undefined | 3 | athletic 6-12 | 87.31 | 13 | ok | A1 A11 A12 | athletic_attainment (2.6833) |
| 46-thrower-4x120 | undefined | 4 | athletic 6-12 | 96.87 | 25 | ok | A1 | athletic_order (2.1213) |
| 47-marathoner-2x60 | undefined | 2 | athletic 6-12 | 93.53 | 14 | ok | A1 | athletic_flat (1.5) |
| 48-cross-country-14-3x45-bodyweight | undefined | 3 | athletic 6-12 | 89.4 | 1 | ok | A1 A11 A12 | athletic_attainment (3.1225) |
| 49-hyrox-open-4x75 | undefined | 4 | athletic 6-12 | 91.53 | 26 | ok | A1 A13 | athletic_order (1.7321) |
| 50-lacrosse-midfield-3x75 | undefined | 3 | athletic 6-12 | 92.7 | 0 | ok | A13 | laterality_error (3) |
| 51-rugby-forwards-4x90 | undefined | 4 | athletic 6-12 | 95.49 | 25 | ok | A1 | athletic_order (2.1213) |
| 52-golf-masters-58-2x45 | undefined | 2 | athletic 6-12 | 91.41 | 24 | ok | A1 A11 A12 | athletic_order (3) |
| 53-gymnast-13-3x60 | undefined | 3 | athletic 6-12 | 95.51 | 2 | ok | A1 | exposure_imbalance (1.7581) |
| 54-cyclist-road-3x45 | undefined | 3 | athletic 6-12 | 93.73 | 12 | ok | A1 | athletic_order (1.7321) |
| 55-triathlete-70-3-2x45 | undefined | 2 | athletic 6-12 | 98.2 | 1 | ok | A1 | upper_laterality_error (1) |
| 56-climber-boulder-3x60-elbow | undefined | 3 | athletic 6-12 | 97.04 | 0 | ok | all pass | exposure_imbalance (1.8091) |
| 57-rower-sweep-4x60 | undefined | 4 | athletic 6-12 | 97.01 | 13 | ok | A1 | athletic_order (1.7321) |
| 58-crossfit-individual-5x90 | undefined | 5 | class 5-7 | 89.61 | 27 | ok | A1 A11 A12 | athletic_attainment (2.3842) |
| 59-cheer-flyer-15-3x45 | undefined | 3 | athletic 6-12 | 91.99 | 4 | ok | A1 A13 | laterality_error (1.7321) |
| 60-pickleball-57-3x45 | undefined | 3 | stay_active 5-8 | 90.97 | 0 | ok | A11 A12 A13 | athletic_attainment (1.7321) |
| 61-pickleball-66-2x60-opt-in | undefined | 2 | older 5-6 | 87.06 | 4 | ok | A1 A11 A12 | athletic_attainment (5.0498) |
| **62-pickleball-52-2x45-no-core-edge** | undefined | 2 | stay_active 5-8 | 89.91 | 12 | ok | A1 A11 A12 | athletic_attainment (2.7386) |
| 63-hyrox-fitness-4x60 | undefined | 4 | stay_active 5-8 | 92.27 | 0 | ok | A11 A12 | athletic_attainment (1.8974) |
| 64-crossfit-class-3x60 | undefined | 3 | class 5-7 | 88.88 | 2 | ok | A1 A12 | athletic_attainment (3.6742) |
| 65-crossfit-class-5x60 | undefined | 5 | class 5-7 | 89.42 | 13 | ok | A1 A12 | athletic_attainment (3.4641) |
| 66-tennis-rec-62-2x45-elbow | undefined | 2 | older 5-6 | 90.31 | 4 | ok | A1 A11 A12 | athletic_attainment (3.4641) |
| 67-rec-league-soccer-3x60 | undefined | 3 | stay_active 5-8 | 87.06 | 0 | ok | A11 A12 A13 | athletic_attainment (3.3912) |
| 68-run-fitness-2x45-kb-only | undefined | 2 | stay_active 5-8 | 92.8 | 0 | ok | A11 A12 | athletic_attainment (2.3009) |
| 69-hike-ruck-68-3x45-knee-back | undefined | 3 | older 5-6 | 88.16 | 0 | ok | A11 A12 | athletic_attainment (4.899) |
| 70-weekend-warrior-3x60-event | undefined | 3 | stay_active 5-8 | 91.15 | 0 | ok | A11 A12 | athletic_attainment (2.5298) |
| **71-golf-rec-72-2x30-bodyweight-edge** | undefined | 2 | older 5-6 | 87.24 | 0 | ok | A11 A12 | athletic_attainment (4.899) |
| 72-combat-fitness-striking-4x60 | undefined | 4 | stay_active 5-8 | 94.05 | 12 | ok | A1 A12 | athletic_attainment (1.5492) |
| 73-lap-swim-59-3x60 | undefined | 3 | stay_active 5-8 | 92.58 | 0 | ok | A11 A12 | athletic_flat (2.1213) |
| 74-ski-prep-3x60-fixed-8 | undefined | 3 | stay_active 5-8 | 91.23 | 2 | ok | A1 A11 A12 | athletic_attainment (2.1213) |
| 75-athletic-no-sport-3x60 | undefined | 3 | stay_active 5-8 | 91.95 | 0 | ok | A11 A12 | athletic_attainment (2.4495) |
| 76-athletic-rec-league-basketball-2x60 | undefined | 2 | stay_active 5-8 | 87.46 | 12 | ok | A1 A11 A12 | athletic_attainment (3.7947) |
| 77-fat-loss-gym-l1-4x60-focus-glutes | undefined | 4 | general 5-7 | 97.48 | 0 | ok | all pass | upper_laterality_error (1) |
| 78-fat-loss-bootcamp-l1-3x45 | undefined | 3 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 79-fat-loss-bootcamp-l2-5x45 | undefined | 5 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 80-fat-loss-gym-l2-6x60 | undefined | 6 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 81-general-gym-l2-3x60 | undefined | 3 | bootcamp 5-7 | 92.28 | 0 | ok | A11 A12 | athletic_attainment (4.3339) |
| **82-general-gym-l1-2x30-edge** | undefined | 2 | general 5-7 | 99.04 | 0 | ok | all pass | push_pull_ratio (0.9574) |
| 83-general-bootcamp-l2-4x45 | undefined | 4 | bootcamp 5-7 | 92.28 | 0 | ok | A11 A12 | athletic_attainment (4.3339) |
| **84-general-bodyweight-74-3x45-edge** | undefined | 3 | older 5-6 | 97 | 12 | ok | A1 | missing_primary_pattern (3) |
| 85-general-kb-only-4x45 | undefined | 4 | general 5-7 | 98.04 | 0 | ok | all pass | upper_laterality_error (1) |
| 86-general-gym-l2-5x75-second-cycle | undefined | 5 | bootcamp 5-7 | 92.46 | 0 | ok | A11 A12 | athletic_attainment (4.1494) |
| 87-general-coach-client-81-2x45-hip | undefined | 2 | older 5-6 | 99 | 0 | ok | all pass | push_pull_ratio (1) |
| 88-general-layoff-l1-4x60 | undefined | 4 | general 5-7 | 97.48 | 0 | ok | all pass | upper_laterality_error (1) |
| 89-general-maintenance-3x60-6wk | undefined | 3 | bootcamp 5-7 | 100 | 0 | ok | all pass | - |
| 90-hybrid-4x60 | undefined | 4 | class 5-7 | 97.74 | 1 | ok | A1 | upper_laterality_error (1) |
| 91-hybrid-3x75-full-gym | undefined | 3 | class 5-7 | 98.18 | 0 | ok | all pass | upper_laterality_error (1) |
| 92-hybrid-l3-5x90 | undefined | 5 | class 5-7 | 97.11 | 13 | ok | A1 | missing_warmup (1.3416) |
| **93-hybrid-2x45-edge** | undefined | 2 | class 5-7 | 96.44 | 1 | ok | A1 | upper_laterality_error (1) |
| 94-hybrid-6x60 | undefined | 6 | class 5-7 | 97.47 | 1 | ok | A1 | push_pull_ratio (1) |
| 01-swimming | undefined | 3 | athletic 6-12 | 94.49 | 12 | ok | A1 A12 | exposure_imbalance (1.7233) |
| 02-football | undefined | 4 | athletic 6-12 | 94.78 | 7 | ok | A1 A12 | athletic_drops (1.5076) |
| 03-soccer | undefined | 3 | athletic 6-12 | 89.98 | 6 | ok | A1 A12 A13 | laterality_error (3) |
| 04-crossfit-style-bootcamp | undefined | 4 | class 5-7 | 89.06 | 2 | ok | A1 A12 | athletic_attainment (3.6742) |
| 05-bootcamp | undefined | 3 | bootcamp 5-7 | 92.23 | 0 | ok | A11 A12 | athletic_attainment (4.3818) |
| 06-full-body-aesthetics | undefined | 4 | aesthetics 6-8 | 100 | 0 | ok | all pass | - |
| 07-push-pull-legs | undefined | 6 | aesthetics 6-8 | 99.42 | 0 | ok | all pass | upper_laterality_error (0.5774) |
| 08-pickleball-genpop | undefined | 2 | stay_active 5-8 | 89.91 | 12 | ok | A1 A11 A12 | athletic_attainment (2.7386) |

## 6. Determinism and speed

| Corpus | Same bytes twice in one process | Fresh process checked | Fresh process differs | generate() p50 ms | p99 ms | max ms |
|---|---|---|---|---|---|---|
| C2 | 94 of 94 | 94 | 0 | 89.11 | 479.75 | 493.98 |
| C1 | 8 of 8 | 8 | 0 | 70.61 | 146.71 | 146.71 |

## How to read this

- The scorer recounts sets, credits, exercises per group and the session's exercise count from the plan's items; it uses the plan's own summary fields only to compare (`credit_tally_mismatch`). It never imports the engine.
- The coach's templates are read from `model/templates.json`: a template A / B day must hold his slots in his order, and a plan day must hold its template's counted lifts (`skeleton_mismatch`, `template_lift_missing`).
- A group the template cannot take to its planned final sets, or cannot hold at the floor, is not a violation when the plan says so (`unsaid_cap` counts the ones it does not say; `below_floor_deficit` reports the size of what it says).
- Hard and hard_conditional metrics are exact counts (A1). The 0-100 score weights them with the points in `score.mjs > METRICS`.
- Not measured on one plan JSON: style_changes_sets, olympic_dose, rep_phase_violation, calendar_violation, next_block_start, edit_recompute, release_line_printed, profile_confidence, default_order_violations, plane_mix_error (see `NOT_MEASURED` in `score.mjs`).
- Re-run: `node design/bench/run.mjs` (about 1 min). Compare a later engine: `node design/bench/run.mjs --label <name> --compare design/bench/results_v05.json`.
