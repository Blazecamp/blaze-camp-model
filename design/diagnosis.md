# Dosing diagnosis: why the v0.4 engine keeps failing coach-eye reviews

Scope: the dosing layer of the Blaze Camp engine (weekly sets per group, the stairway, time fit, exercises per day, athletic work).
Exercise selection, the printed words and the Spanish output are out of scope except where they feed dosing.

Status: measured on a frozen copy of `engine/` + `model/` (model 1.3.0, engine 0.4.0 with fix round 2 / F1 partly applied), copied
2026-10-09 20:33 into `design/scratch/snap/`, because another workflow was editing `engine/` during this run. A re-run against the live
engine at 20:46 (two more patches in `volume.mjs` / `validate.mjs`) gives the same picture; the differences are noted where they matter.
Nothing outside `design/` was written; `tools/generate-samples.mjs` was not run.

---

## 0. Summary

**What fails (measured on the 8 sample plans).**

- **Trained groups below the floor.** 4 of 8 plans train a group directly below the 10-set floor for the whole block: swimming quads 5 -> 6,
  CrossFit class quads 5 -> 6 and hips 6.25 -> 7.5, bootcamp chest 9, pickleball quads 4 -> 6 and hips 4.5 -> 6.75. The approved R3-SES-02
  algorithm keeps a group only if every kept group holds its floor and climbs. The engine ships them as "trained below the floor" (E-11,
  PROPOSED), and every error-level validator passes.
- **Flat stairways.** 59-85 % of the week-to-week transitions of trained groups add no set (`main_sets_by_group`); the
  bootcamp's 100 % is by design, since its climb is in work seconds. The weekly total stands
  still in 5 of 11 weeks (swimming), 6 of 11 (pickleball) and 3 of 7 (CrossFit class). For those plans this is the arithmetic minimum:
  the time check leaves only 4-6 whole-set steps for 7-11 week transitions (table 1.9). The placement is not the cause. The cause is the
  targets and a progression defined only in whole sets.
- **Days over the chosen minutes.** The engine lets full-body days run to 110 % (`long_day.warn_above_factor` 1.1, PROPOSED). 9 of 30
  swimming days are over 60 min, 16 of 48 aesthetics days over 75, 8 of 24 pickleball days over 45. Test-week days reach up to 128 %
  (swimming 77 min for 60, soccer 94 for 75, football 106 for 90). Re-costing the printed doses with their own reps, per-side work
  and printed rest puts 06 aesthetics at up to 85-91 min for 75 and pickleball at up to 51-54 min for 45.
- **Too many exercises.** Full-body days have no exercise-count limit: aesthetics runs 10-12 resistance exercises in 75 min (coach: about 8-9 at
  75-90 min), and pickleball runs 7 exercises plus 2 core in 45 min (coach: about 5). Groups get 1 exercise on a day in 4 plans
  (swimming, CrossFit class, bootcamp, pickleball: "pattern kept" stations, class lifts, circuit stations).
- **Athletic work off budget.** Soccer delivers 16-20 % of its jump target and 45 % of its change-of-direction (COD) target. Pickleball (snapshot)
  delivers 0 of 35-73 ankle contacts and 0 of 4-8 Olympic sets, with a 0 % plyometric share against a 35-50 % target. Twelve minutes later
  the live engine restored the ankle work and lost hips progression (4.5 -> 5.75 over 12 weeks).
- **Erratic group selection.** In a sweep of the 8 intakes over 30-120 minutes and +1 day (105 plans), more time or one more day
  *untrains a group that less time trained* in 8 minute-steps and 14 day-steps. Examples: pickleball 3 x 90 drops hips but keeps
  shoulders, pickleball 3 x 45 trains only chest and calves, and bootcamp 4 days trains fewer groups than 3 days. The "add a day" and
  "longer sessions" offers propose minute values the intake rejects (65, 70). For football the extra day changes nothing, because the
  5-day template's fifth day is optional and carries no stairway sets.
- **Instability across fix rounds.** The swimmer's trained groups were {hips, back, shoulders} after B1 and B4, {quads, hips, back} after F1,
  and {quads (below floor), hips, back} now. The pickleball player's were {hips, calves}, {hips}, then {quads, hips (both below floor), calves}.
  Each round fixes the last review's symptom and moves another.

**Why (root causes, section 2).** The engine is a pipeline of greedy, order-dependent stages. Each stage decides part of the dose
with no view of the others, and they are then reconciled by probes, retries and post-hoc repairs:

1. **No global model.** Layout, selection, volume, athletic and dose run in sequence, and four separate places cut for time
   (RC1).
2. **Structure before capacity.** Template stations fix which group can train on which day before any minutes are known, so free minutes
   on one day cannot host a group stationed on another day (RC2).
3. **Greedy subset search by simulation.** The time check builds the kept-group set in a keep order with probes, relaxations
   and pattern passes. It is path-dependent and non-monotone (RC3).
4. **Targets, packing and verification disagree.** Per-line stairway targets are recomputed from probe results with `floor()`, placed by a
   different greedy, then verified on groups. A failed verification drops the group: hips, the coach's first big mover, is removed
   from a plan that the probe had shown to be feasible (RC4).
5. **Mixed units.** Lines and groups, whole sets and quarter helper credits, and main-day, all-day and "stair" tallies are used side by side,
   with a 0.5-set fudge factor (`CLIMB_TOL`) (RC5).
6. **Whole-set granularity.** With 1-3 steps per group over 11 weeks, "never flat" cannot hold in sets alone (RC6).
7. **Conflicting rules with no explicit precedence.** Each fix round re-ranks them locally (RC7).
8. **Athletic budget outside the solve.** The athletic targets are uncapacitated; stations are added, then cut, then dosed per set only
   (RC8).
9. **Time model decoupled from the dose,** and a 10 % tolerance stands in for "fits" (RC9).
10. **Validators mirror the patches.** A green validation does not mean a coach-acceptable plan (RC10).
11. **Patch accretion.** 134 round-3 decisions, 9 model amendment layers, `runBlock` = 2,149 lines with 154 closures, and the stairway
    rounding mode changed four times (RC11).

**What the new planner must do (section 4).** Decide which groups are trained, which days they train on, sets per slot per week,
athletic doses and supersets **in one block-level optimization model**. Use **lexicographic priority tiers** in the coach's order, **exact
feasibility** instead of probes, **one unit of account** (group sets with exact fractional credit), **integer stairway constraints** plus a
**multi-dimensional progression ladder**, **one time function** shared with the dose, **offers computed by re-solving** at valid intake
values, and an **independent scorer** with monotonicity and stability properties as tests. The problem is small (at most 8 groups x 6 days x
12 weeks x about 15 slots a day). The current engine takes 27-238 ms per plan, so an exact solver in plain JS has ample headroom.

---

## 1. Measurements

### 1.0 Method

- Harness: `design/scratch/measure.mjs` (imports `design/scratch/snap/engine/generate.mjs`, generates in memory) and
  `design/scratch/report.mjs` (tables). Raw data: `design/scratch/out/measure.json` (snapshot), `measure.live.json` (live 20:46),
  `measure.spr3.json` (time sensitivity).
- Additional probes: `sweep_minutes.mjs` (minutes and days sweep; `out/sweep_minutes.json`), `probe_dbg.mjs` (the engine's own
  `__BC_DBG` time-check trace), `probe_retry.mjs` on an instrumented copy `snap_instr/` (logs the verify-retry loop),
  `planned_vs_placed.mjs`, `blockminutes.mjs`, `timegap.mjs`, `dayprobe.mjs`, `probe5.mjs`.
- "Sets" are weekly hard sets per FOCUS group with group credit (a set counts at most 1.0 to a group; helpers 0.25), read from
  `weeks[].main_sets_by_group` (main days), which is where the engine places and verifies the stairway. "Flat transition" = a group
  gains less than 0.5 set week over week. The floor is 10; for calves, 3 x leg days, capped at 10.
- "Independent minutes" re-cost each printed item from its own dose: reps x 3 s (3.5 s in the sensitivity run), doubled for per-side or
  unilateral work, plus the printed rest midpoint. Pairs share the rest, with 1 min changeover (0.5 in a pair) and an 8-min warm-up. Athletic,
  Olympic, throw and sprint stations use the engine's own constants. It is an approximation, used to test whether the engine's planning
  constants and the dose agree.

### 1.1 Overview (snapshot)

| Sample | Days x min | Level | Fits | Trained directly | Not trained directly (reason) | Trained BELOW floor | Lowered peak | Failed checks | ms |
|---|---|---|---|---|---|---|---|---|---|
| 01 swimming | 3 x 60 | L2 | no | quads, hips, back | chest, shoulders, calves (time); biceps, triceps (credit only) | **quads** | quads, hips, back | V28 (warn) | 190 |
| 02 football | 4 x 90 | L3 | yes | quads, hips, back, chest, shoulders, calves | biceps, triceps (credit only) | - | shoulders | - | 134 |
| 03 soccer | 3 x 75 | L2 | no | quads, hips, back, chest, calves | shoulders (time); arms (credit only) | - | quads, hips, chest, back | V28 (warn) | 76 |
| 04 CrossFit class | 4 x 60 | L2 | no | quads, hips, back | chest, biceps, calves (time); shoulders (class lift); triceps (no station) | **quads, hips** | quads, hips, back | - | 92 |
| 05 bootcamp | 3 x 45 | L2 | no | quads, hips, back, chest, shoulders, calves | biceps, triceps (time) | **chest** (circuit) | - | - | 27 |
| 06 aesthetics | 4 x 75 | L3 | no | all 8 | - | - | 7 of 8 groups | - | 150 |
| 07 push / pull / legs | 6 x 75 | L3 | no | all 8 | - | - | 7 of 8 groups | - | 165 |
| 08 pickleball 52 | 2 x 45 | L1 | no | quads, hips, calves | back, chest, shoulders (time); arms (no station) | **quads, hips** | quads, hips, calves | - | 73 |

Every plan is `ok` and passes every error-level check.

### 1.2 Weekly sets per trained group (main days), first stairway block

(Rows marked "below" are listed by the engine as `trained_below_floor`.)

**01 swimming 3 x 60, 12 weeks.** Total main sets 27 27 27 28 28 29 29 30 30 31 32 33; weekly rise % 0, 0, 3.7, 0, 3.6, 0, 3.5, 0, 3.3,
3.2, 3.1.

| Group | Weeks 1-12 | Weeks under 10 | Flat transitions | Longest flat run | Reaches final value in week |
|---|---|---|---|---|---|
| quads (below) | 5 5 5 5 5 5 5 5 5 6 6 6 | 12 / 12 | 10 / 11 | 8 | 10 |
| hips | 10.75 10.75 10.75 10.75 10.75 11.75 11.75 11.75 11.75 11.75 12.75 12.75 | 0 | 9 / 11 | 4 | 11 |
| back | 10 10 10 11 11 11 11 12 12 12 12 13 | 0 | 8 / 11 | 3 | 12 |

**02 football 4 x 90 (fits), 12 weeks.** Total 68 -> 87; every week rises (1.2-4.3 %).

| Group | Weeks 1-12 | Flat transitions | Longest flat run | Final value from week |
|---|---|---|---|---|
| quads | 14 14 14 15 15 15 16 16 17 17 18 18 | 7 / 11 | 2 | 11 |
| hips | 16 16 16 17 17 17 18.25 18.25 19.5 19.5 20.75 20.75 | 7 / 11 | 2 | 11 |
| back | 10 10 10 11 11 11 11 12 12 12 12 13 | 8 / 11 | 3 | 12 |
| chest | 10 10 11 11 11 11 11 12 12 12 13 13 | 8 / 11 | 4 | 11 |
| shoulders | 11 12 12 12 12 13 13 13.25 13.25 14.25 14.5 14.75 | 8 / 11 | 3 | 12 |
| calves | 12 12 12 12 13 13 13 13 13 13 13 14 | 9 / 11 | 6 | 12 |

The L3 ceilings are 25. The field-athlete modifiers (lower 0.7, upper 0.5) set quads 14 -> 18 and chest / back 10 -> 13, so the whole
block holds 3-4 whole steps per group.

**03 soccer 3 x 75, 6-week off-season block.** Total 49 -> 58.

| Group | Weeks 1-6 | Flat transitions | Note |
|---|---|---|---|
| quads | 10 10 11 12 12 13 | 2 / 5 | |
| hips | 11.25 11.25 12.5 12.5 12.5 13.75 | 3 / 5 | |
| back | 10 10 11 11 11 12 | 3 / 5 | |
| chest | 10 11 11 11 12 12 | 3 / 5 | final value from week 5 |
| calves | 9 9 9 9 9 9 | 5 / 5 | target 11 -> 12 is placed only through the optional-day slot |

Shoulders were trained in the F1 sample and are now "not trained (time)".

**04 CrossFit class 4 x 60, 8 weeks.** Total 25 25 25 26 26 27 28 29.

| Group | Weeks 1-8 | Flat transitions |
|---|---|---|
| quads (below) | 5 5 5 5 5 6 6 6 | 6 / 7 |
| hips (below) | 6.25 6.25 6.25 6.25 6.25 6.5 7.5 7.5 | 6 / 7 |
| back | 10 10 10 11 11 11 11 12 | 5 / 7 |

**05 bootcamp 3 x 45, 8 weeks (timed circuits).** Every group is flat in sets (quads 12, hips 13.5, back 12, chest 9 below the floor,
shoulders 14.25, calves 9). The climb is in work seconds (35 -> 50 s), as designed; the stairway targets printed per line
(12 -> 15.9) are never placed (table 1.8).

**06 aesthetics 4 x 75, L3, Focus glutes + side delts.** Total 108 -> 140; every week rises.

| Group | Main days, weeks 1-12 | All days (optional days included) | Flat (main) |
|---|---|---|---|
| quads | 14 15 15 15 15 16 16 17 17 18 18 19 | same | 6 / 11 |
| hips | 23 23.25 23.25 23.25 25.25 25.5 25.5 25.5 25.5 25.75 25.75 27 | 27 -> **35** | 9 / 11 |
| back | 11 11 12 12 12 13 13 14 15 16 17 17 | same | 5 / 11 |
| chest | 12 12 13 13 14 14 15 16 17 18 19 19 | same | 4 / 11 |
| shoulders | 19 19 19.25 20.25 20.5 21.5 22.5 23.75 23.75 25 26 26 | 23 -> **30** (absolute cap) | 5 / 11 |
| biceps | 14.75 ... 18.25 | 14.75 -> 24.25 | 9 / 11 |
| triceps | 13.5 13.5 13.75 13.75 14 14.25 14.25 14.5 14.5 14.75 14.75 14.75 | 13.5 -> 22.75 | 11 / 11 |
| calves | 12 12 12 13 13 13 13 14 14 14 14 15 | same | 8 / 11 |

The arms climb only on the optional days (R3-VOL-03 bonus exercises), and their main days are flat. Hips, two lines in one group, reach 35
sets a week on all days, above the "more than 30 is for a very advanced person" guidance (R2-VOL-06).

**07 push / pull / legs 6 x 75, L3, Focus chest + back.** Total 98 -> 132; every week rises. Chest 16.5 -> 26 (Focus) climbs almost every
week; back (Focus) 18 18 18 19 19 19 19 20 20 20 20 21 (+3 in 12 weeks, 8 flat transitions); calves 7 for 11 weeks, then 8. Calves
are below the coach's 10, and the engine's calves floor is 7 with 2 leg days. RECHECK flagged "calves 7 for 11 weeks" as a blocker
(R07-flat) before F1, and it is still present.

**08 pickleball 2 x 45, L1, knee pain.** Total 19 19 19 20 20 20 21 21 21 22 23 24 (flat in 6 of 11 weeks).

| Group | Weeks 1-12 | Note |
|---|---|---|
| quads (below) | 4 4 4 4 4 4 5 5 5 6 6 6 | floor exempt for knee pain in the engine; listed as trained below the floor |
| hips (below) | 4.5 4.5 4.5 5.5 5.5 5.5 5.75 5.75 5.75 5.75 6.75 6.75 | |
| calves | 7 7 7 7 7 7 7 7 7 7 7 8 | 10 flat transitions |

The coach's approved worked example for exactly this client (12 v1.2 §5.5) trains **hips 10 -> 14 and calves 6 -> 7** and leaves the rest
to compound credit. The engine trains two groups at under half the floor instead. In the live engine (20:46) hips falls to 4.5 -> 5.75
and the total stands still in 7 of 11 weeks.

### 1.3 Stairway summary (first stairway block, trained groups)

| Sample | Weeks | Trained | Group-weeks under floor | Flat transitions | Groups with a flat run >= 3 | Groups at final value before the last week | Mean growth | Planned G(N) | Max weekly total rise | Weeks total flat |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 swimming | 12 | 3 | 12 (declared) | 27 / 33 | quads, hips, back | quads (wk 10), hips (wk 11) | 1.23 | 1.554 | 3.7 % | 5 / 11 |
| 02 football | 12 | 6 | 0 | 47 / 66 | back, chest, shoulders, calves | quads, hips, chest (wk 11) | 1.28 | 1.554 | 4.3 % | 0 / 11 |
| 03 soccer | 6 | 5 | 0 | 16 / 25 | calves | chest (wk 5), calves (wk 1) | 1.18 | 1.228 | 6.0 % | 0 / 5 |
| 04 CrossFit | 8 | 3 | 16 (declared) | 17 / 21 | quads, hips, back | quads (wk 6), hips (wk 7) | 1.20 | 1.328 | 4.0 % | 3 / 7 |
| 05 bootcamp | 8 | 6 | 8 (declared) | 42 / 42 | all | all (wk 1) | 1.00 | (work seconds) | 0 % | 7 / 7 |
| 06 aesthetics | 12 | 8 | 0 | 57 / 88 | quads, hips, biceps, triceps, calves | back, chest, shoulders, biceps (wk 11), triceps (wk 10) | 1.33 | 1.554 | 4.1 % | 0 / 11 |
| 07 PPL | 12 | 8 | 0 | 52 / 88 | quads, hips, back, shoulders, triceps, calves | quads, hips, chest (wk 11) | 1.36 | 1.554 | 4.4 % | 0 / 11 |
| 08 pickleball | 12 | 3 | 24 (declared) | 28 / 33 | quads, hips, calves | quads (wk 10), hips (wk 11) | 1.38 | 1.554 | 5.3 % | 6 / 11 |

No week exceeds the 7 % planned limit. The stairway's front-light / back-heavy shape (3 % then 5 %) is barely visible: football's rises are
1.5, 1.5, 4.3, 1.4, 1.4, 2.7, 2.6, 2.5, 1.2, 3.7, 2.4 %. The lambda scaling squeezes 3-4 whole sets into 11 weeks.

### 1.4 Planned stairway vs what was placed (lines with a gap of 1+ set)

| Sample | Line | Planned T, wk 1 -> last | Placed, main days | Placed, all days | Weeks placed >= 1 set below T |
|---|---|---|---|---|---|
| 03 soccer | calves | 11 -> 12 | 9 -> 9 | 11 -> 12 | 6 / 6 |
| 04 CrossFit | triceps | 10 -> 13.3 | 1.25 -> 1.25 | 1.25 | 8 / 8 (group has no station) |
| 05 bootcamp | quads / hams / back | 12 -> 15.9 | 12 -> 12 | 12 | 5 / 8 |
| 05 bootcamp | chest | 12 -> 15.9 | 9 -> 9 | 9 | 8 / 8 |
| 06 aesthetics | glutes | 14 -> 21.75 | 13.75 -> 17.75 | 17.75 -> 25.75 | 6 / 12 |
| 06 aesthetics | biceps / triceps | 15 -> 23.3 / 14 -> 21.75 | 14.75 -> 18.25 / 13.5 -> 14.75 | 24.25 / 22.75 | 9 / 10 of 12 |
| 08 pickleball | biceps, triceps | 10 -> 13 | 0.5 | 0.5 | 12 / 12 (no station, still printed as target) |

A plan carries three inconsistent volume stories: the planned line target T, the main-day placement and the all-day placement. Targets
are printed for groups that cannot be trained at all.

### 1.5 Minutes per day vs the chosen minutes (main days, non-test weeks)

| Sample | Limit | Main days | Engine est. > limit | Engine est. > limit x 1.1 | Max engine est. | Independent (3 s/rep) > limit | Independent > x 1.1 | Max independent (3 s / 3.5 s per rep) |
|---|---|---|---|---|---|---|---|---|
| 01 swimming | 60 | 30 | 9 | 0 | 66 | 0 | 0 | 59 / 60 |
| 02 football | 90 | 40 | 3 | 0 | 95 | 0 | 0 | 89 / 91 |
| 03 soccer | 75 | 18 | 8 | 0 | 82 | 7 | 1 | 85 / 87 |
| 04 CrossFit | 60 | 24 | 2 | 0 | 62 | 0 | 0 | 57 / 58 |
| 05 bootcamp | 45 | 18 | 0 | 0 | 45 | 2 | 0 | 46 / 47 |
| 06 aesthetics | 75 | 48 | **16** | 0 | 80 | **28** | 6 | **85 / 91** |
| 07 PPL | 75 | 60 | 0 | 0 | 75 | 1 | 0 | 76 / 79 |
| 08 pickleball | 45 | 24 | 8 | 0 | 49 | **24** | 4 | **51 / 54** |

Test-week main days (the rep-max work-up replaces one set but adds 10 min; the speed and jump tests add 6-8 min each): swimming up to 77 min
(60), football 106 (90), soccer 94 (75), CrossFit 70 (60), PPL 79 (75).

The per-item comparison (`timegap.mjs`, 06 week 11 Monday) shows where the planning constants and the dose disagree. A 4 x 15-20-reps-per-side
concentration curl is costed at 2.45 min a set but doses about 3.0. A 15-20-rep isolation is costed 1.85 but doses about 2.1. A per-side wrist
extension (prehab) is costed 1.35 but doses 2.1. The day adds up to 82 set-minutes planned against 88 printed, before pairing. The time
model in `timefit.setCost` (`timefit.mjs:125`) uses per-class constants and "mirrors dose.mjs closely enough" (`timefit.mjs:99`). The printed
`est_minutes` is the volume engine's estimate (`generate.mjs:522`), not a re-cost of the dosed items.

**Where the minutes go** (`blockminutes.mjs`, mean of main days, engine constants):

| Sample | Limit | Warm-up | Core | Athletic | Power (Olympic) | Prehab | Other (skill, WOD, circuit, aerobic add-on) | Resistance | Resistance share |
|---|---|---|---|---|---|---|---|---|---|
| 01 swimming, wk 11 | 60 | 8.0 | 5.5 | 7.0 | 9.0 | 2.2 | 0 | 27.0 | 46 % |
| 02 football, wk 11 | 90 | 8.0 | 5.5 | 17.4 | 10.0 | 0 | 0 | 42.6 | 51 % |
| 03 soccer, wk 5 | 75 | 8.0 | 5.5 | 20.2 | 6.7 | 0 | 0 | 38.3 | 49 % |
| 04 CrossFit, wk 7 | 60 | 8.0 | 5.5 | 0 | 5.0 | 0 | 13.0 | 18.8 | 37 % |
| 06 aesthetics, wk 11 | 75 | 8.0 | 5.5 | 0 | 0 | 0 | 0 | 64.8 | 83 % |
| 08 pickleball, wk 11 | 45 | 8.0 | 5.5 | 4.3 | 0 | 6.9 | 0 | 23.6 | 49 % |

Athletes and stay-active clients spend about half of every session on fixed blocks. A 45-min pickleball day holds about 20-24 resistance
minutes, about 9-10 sets, so about 18-20 sets a week on 2 days. That is enough for **one** big group at 10 -> 12 plus the pinned calves 6 -> 7,
exactly the coach's example 5.5. It is not enough for three groups. The engine discovers this capacity by probing instead of computing it
(RC3).

### 1.6 Exercises per day (main days, all weeks)

| Sample | Minutes | Exercises / day (excl. core) | Resistance / day | Athletic + power | Prehab | Days with a 1-exercise group (not calves) | Coach guidance (VOL-08) |
|---|---|---|---|---|---|---|---|
| 01 swimming | 60 | 7-8 | 3-4 | 2-4 | 1 | 12 / 36 (Wed: chest, a "pattern kept" press) | 6-7 resistance at 60 |
| 02 football | 90 | 9-11 | 5-7 | 4 | 0 | 0 / 48 | 12 + 2 core max (athlete) |
| 03 soccer | 75 | 10-11 | 5-7 | 4-5 | 0 | 0 / 24 | 12 + 2 core max |
| 04 CrossFit | 60 | 3-5 | 1-4 | 0-1 | 0 | 16 / 32 (Tue: shoulders class lift, Thu: chest) | class model |
| 05 bootcamp | 45 | 8 | 8 (circuit stations) | 0 | 0 | 8 / 24 (Fri: chest + shoulders) | 5-7 stations |
| 06 aesthetics | 75 | **10-12** | **10-12** | 0 | 0 | 0 / 48 | **about 8-9 at 75-90** |
| 07 PPL | 75 | 7-8 | 7-8 | 0 | 0 | 0 / 72 | 8-9 (split-day cap 9) |
| 08 pickleball | 45 | **7** | 4 | 1 | 2 | **24 / 24** (Mon: back, Thu: chest) | **about 5 at 45** |

`rules.session.exercise_cap_by_minutes` applies to split days only. On full-body days the count follows from "2-4 exercises x every group
trained that day", with no budget. The single-exercise groups are the E-94 / E-145 "pattern kept" stations for groups the time check did
not keep. They follow BRAIN 10.7 ("every primary pattern at least once") and break "never 1 exercise per group" (R2-SES-05). The validator
skips them (`validate.mjs:824`).

### 1.7 Athletic budget vs delivered (stairway weeks; planned, with target in brackets)

| Sample | Key | Week 1 -> last, planned (target) | Delivered vs target | Weeks flat or down |
|---|---|---|---|---|
| 01 swimming | jumps (ballistic + reactive) | 28 -> 36 (37 -> 49) | 73-82 % | 7 / 11 |
| | ankle contacts | 6 -> 20 (8 -> 27) | 74-120 % | 6 / 11 |
| | throws | 34 -> 44 (35 -> 45) | 95-103 % | 6 / 11 |
| 02 football | jumps | 87 -> 117 (105 -> 145) | 59-83 % | 5 / 11 |
| | COD cuts | 66 -> 72 (80 -> 100) | 72-84 % | 9 / 11 |
| | sprint m | 220 -> 400 (300 -> 400) | 73-105 % | 7 / 11 |
| | throws | 69 -> 90 (70 -> 110) | 82-100 % | 6 / 11 |
| 03 soccer | jumps | 24 -> 32 (**120 -> 160**) | **16-20 %** | 3 / 5 |
| | COD cuts | 54 -> 72 (120 -> 160) | **45 %** | 1 / 5 |
| | ankle contacts | 24 -> 82 (50 -> 111) | 44-74 % | 1 / 5 |
| | sprint m / throws | 400 -> 560 (400 -> 600) / 20 -> 40 (20 -> 40) | 93-102 % / 96-107 % | 2 / 5, 1 / 5 |
| 04 CrossFit | Olympic sets | 6 -> 6 (5 -> 7) | 86-120 % | 7 / 7 (flat) |
| 08 pickleball (snapshot) | ankle contacts | **0 -> 0 (35 -> 73)** | **0 %** | 11 / 11 |
| | Olympic sets | **0 (4 -> 8)** | **0 %** (power block switched off, E-143) | 11 / 11 |
| | throws | 36 -> 40 (51 -> 69) | 58-74 % | 10 / 11 |
| | plyo share | 0 % (35 -> 50 %) | | |
| 08 pickleball (live, 20:46) | ankle contacts | 28 -> 50 (35 -> 73) | 68-91 % | 2 / 11 |
| | Olympic sets | 0 (4 -> 8) | 0 % | 11 / 11 |

Fix round 1 / F2 protected the pickleball ankle track ("R08-ankle-track-kept"). Fix round 2 / F1 (E-143, the stay-active room cuts) removed
it, and a patch 12 minutes later restored it while hips progression got worse (1.2). The athletic numbers are the 04 profile's full-time
weekly ranges; nothing scales them to the minutes before stations are built.

### 1.8 Monotonicity sweep (the same intakes at 30-120 minutes and +1 day; 105 plans)

A sound planner never trains a group with less time that it stops training with more time, and never trains fewer or lower-priority
groups with more time. Measured (`sweep_minutes.mjs`):

| Property | Steps checked | Violations |
|---|---|---|
| More minutes untrains a group trained at fewer minutes | 90 minute-steps | **8** |
| More minutes trains fewer groups | 90 | 2 |
| More minutes plans a lower peak (sum of trained groups) | 90 | 4 |
| More minutes leaves more groups below the floor | 90 | 9 |
| +1 day untrains a group or lowers the peak | 49 day-steps | **14** |
| +1 day changes nothing at all (football: the 5-day template's 5th day is optional) | 7 | 7 |

Examples:
- **Pickleball 3 x 45** trains only **chest and calves**. Monday holds a calf exercise and nothing else (34 of 45 minutes). The same player
  at 2 x 45 trains quads, hips and calves.
- **Pickleball 3 x 90** drops **hips** (the coach's first big mover) and keeps shoulders; 3 x 75 trains hips.
- **Pickleball 2 x 60** drops quads that 2 x 45 trained; 3 x 60 drops hips and back that 2 x 60 trained.
- **Bootcamp** 4 days trains fewer groups than 3 days at every length from 45 to 120 min.
- **Aesthetics** 4 x 45 trains chest; 5 x 45 does not.
- Taking an offer: football 4 x 60 offers "5 days x **70** min", pickleball 2 x 45 offers "3 days x **65** min", and swimming 3 x 60 offers
  "4 days x **75** / **110** min". 65 and 70 are rejected by intake validation (`schedule.session_minutes` must be 30/45/60/75/90/105/120). The
  offer is arithmetic, `need.total / (mains + 1)` rounded to 5 (`volume.mjs:2608`), not a re-solve. Football at 5 x 60 trains exactly what
  4 x 60 trains (quads, hips, chest).

### 1.9 Flatness is mostly arithmetic: whole-set steps vs weeks

| Sample | N | Week transitions | Whole-set steps available (sum of cap - start, trained lines) | Steps per trained group | Minimum flat group-transitions with one step a week at most | Measured | Weeks with total flat |
|---|---|---|---|---|---|---|---|
| 01 swimming | 12 | 11 | 6 | 2.0 | 27 / 33 | 27 / 33 | 5 (minimum 5) |
| 02 football | 12 | 11 | 20 | 3.3 | 46 / 66 | 47 / 66 | 0 |
| 03 soccer | 6 | 5 | 10 | 2.0 | 15 / 25 | 16 / 25 | 0 |
| 04 CrossFit | 8 | 7 | 4 | 1.3 | 17 / 21 | 17 / 21 | 3 (minimum 3) |
| 06 aesthetics | 12 | 11 | 61 | 7.6 | 27 / 88 | 57 / 88 | 0 |
| 07 PPL | 12 | 11 | 42 | 5.3 | 46 / 88 | 52 / 88 | 0 |
| 08 pickleball | 12 | 11 | 5 | 1.7 | 28 / 33 | 28 / 33 | 6 (minimum 6) |

For the time-limited plans the engine hits the mathematical minimum: placement is not what makes them flat. Their start -> ceiling ranges
are 1-3 sets because the time check lowers the ceilings to start + `min_climb` (2, PROPOSED). "Never flat" cannot hold in whole sets when a
group has fewer steps than weeks. Even the coach's own unconstrained L2 big line (15 -> 22 over 12 weeks: 7 steps) is flat in 4 of 11
weeks per group. Only the weekly total, or a composite load, can climb every week (RC6). For 06 and 07 the placement adds flatness beyond
the minimum (57 vs 27; 52 vs 46): the arms' climb sits on the optional day, and the scheduler moves steps to keep the total rising.

### 1.10 Stability across fix rounds (trained directly; main-day sets, week 1 -> last)

| Sample | After stage B1 | After B4 | After fix round 1 (F1) | Now (fix round 2 in progress) |
|---|---|---|---|---|
| 01 swimming | hips, back, shoulders (33 -> 44) | hips, back, shoulders (28 -> 35) | quads, hips, back (30 -> 33) | quads (below floor), hips, back (27 -> 33) |
| 03 soccer | quads, hips, back, chest, shoulders | same | + calves (60 -> 67) | shoulders dropped (49 -> 58) |
| 04 CrossFit | back, chest, shoulders | back, chest | quads, back (below floor) | quads, hips (below floor), back |
| 08 pickleball | hips, calves (20 -> 23) | hips, calves (16 -> 19) | hips (10 -> 13) | quads, hips (below floor), calves (19 -> 24) |

The same intake gets a different answer to "which groups does this person train" in every round. The answer follows the last review's
complaint, not one objective.

### 1.11 Traces: how the time check reaches its answers

**Pickleball 3 x 45, Mon / Tue / Thu** (the engine's `__BC_DBG` probe trace; group sets at week 1 / peak; day minutes against the 49.5 limit,
which is 45 x 1.1):

```
PROBE K=[quads,hips,back,chest,shoulders,calves] full -> fail: quads/hips/back/chest climb, shoulders/calves time
PROBE K=[calves]            ok    Mon 34  Tue 31  Thu 30   (calves 10 -> 12)
PROBE K=[calves,hips]       fail  Mon 34  Tue 49  Thu 49   hips 11 -> 11 (no room to climb), calves climb lost
PROBE K=[calves,quads]      fail  Mon 48  Tue 31  Thu 30   quads 4 -> 4: quads has stations on Monday only
PROBE K=[calves,back]       fail  ...                      back 10 -> 10
PROBE K=[calves,chest]      ok    Mon 34  Tue 47  Thu 46   chest 10 -> 12      <- kept
PROBE K=[calves,chest,hips] fail  chest and hips both under the floor ... (relaxed retries)
=> trained: chest, calves. Monday: one calf exercise, 34 of 45 minutes.
```

The template fixes hips on Tue / Thu and quads on Monday. The kept set is built in a fixed keep order and accepts the first subset that
probes clean, so 15 free minutes on Monday can never host a hip exercise, and quads (one day) can never reach its floor.

**Pickleball 3 x 90** (the instrumented verify-retry loop, `snap_instr/`):

```
FINISH hamstrings: probe w1 10.5, peak 12.5 -> start 10, cap 12    (floor() of both)
VERIFY fail hips: main 12.75 ... 14  (climb +1.25 < 2 - CLIMB_TOL 0.5)  -> attempt 0 fail, give: calves
VERIFY fail hips: main 12.75 ... 14                                   -> attempt 1 fail, cap cut calves 1
attempt 2: drop hips -> trained: quads, back, chest, shoulders, calves
```

The probe proved hips fits with a 2-set climb. `finishCheck` floored the line targets (`volume.mjs:1875-1887`), and the weekly placement
realized +1.25 group sets because quarter-set helper credit does not move with the line. The verification (`volume.mjs:2532-2565`) then
removed the coach's first big mover from the plan through the retry loop (`volume.mjs:454-462`).

---

## 2. Root causes

### RC1. A pipeline of greedy stages with no global model, and four independent time cutters

`generate.run` (`generate.mjs:62-152`) runs in a fixed order:

1. `buildWeekLayout` (`generate.mjs:73`): template days, stations included by minutes, athletic stations added, prehab, then
   `applyCuts` / `enforceAthleteCap` / `moveGroupsToOptional` (`week.mjs:357`, `1287`, `1456`, `1506`). These cut against the template's
   default sets at the peak week, before any volume target exists.
2. `selectBlock` (`generate.mjs:77`): exercises picked per slot. Laterality changes the time class (unilateral costs 1.5 x) before the time
   check runs.
3. `planWeeklySets` (`generate.mjs:119`): the volume engine, with its own `structureCut`, `timeCheck` with room cuts and a keep order,
   `trimToTime` for flat blocks, `addPatternKept`, placement and verification.
4. `athleticBudget` (`generate.mjs:120`): targets from the 04 profile, independent of the minutes.
5. `collectWeek` (`generate.mjs:279-376`): the athletic reconcile drops athletic stations and sets to the budget, after the time check.
6. `planAthletic` (`generate.mjs:125`, `athletic.mjs:594`): "Only per-set doses move - the sets are the volume engine's" (`athletic.mjs:589`).
7. `finishWeek` / `doseItem`: reps, rest and RIR are chosen here, after the time was spent with class constants.
8. `validatePlan` (`generate.mjs:150`).

Each stage optimizes its own local goal and hands a fait accompli to the next. Time is cut in `week.applyCuts`, `volume.timeCheck`,
`volume.trimToTime` and the athletic reconcile, each with its own order and each blind to the others. No stage can trade a set of chest
for 10 jump contacts, or a Monday hip exercise for a Thursday press. The trade-offs the coach cares about are never evaluated together.

### RC2. Structure is fixed before capacity is known (templates vs variable time)

The week layout decides which groups have stations on which day: the template's day types, A / B patterns, and `include_from_minutes`
stations. The volume engine can only *delete* (drop groups, room cuts, structure cuts) or add a 2-set bonus or Focus exercise under
narrow rules (`tryBonus`, `volume.mjs:865`; only at exercise-block starts, E-86). It cannot move a group to a day with room. Consequences:

- **Pickleball 3 x 45**: Monday keeps 11 free minutes, but hips can only train Tue / Thu and quads only Monday (1.11), so the time check
  keeps chest and calves.
- **Swimmer 3 x 60**: quads have stations on Monday only (a Zercher squat 3 sets plus a leg extension 2 sets). Quads cannot reach 10
  and are kept below the floor (E-11). Wednesday and Friday are both hip days. The optional Saturday uses 21 of its 60 minutes (two 2-set
  template Focus slots, a hack squat and a row), but by rule it carries no stairway sets for a non-Focus big line (ORD-10,
  `placement.optional_days.stairway_sets = false`, E-135 `focus_only`).
- **CrossFit 4 x 60**: the class's squat and deadlift days carry the class lifts, so quads and hips stay at 5-7.5 sets.
- **Football at 5 days**: `athletic.5` turns the fifth day into an optional day that carries no stairway sets
  (`placement.optional_days.stairway_sets = false`), so one more day changes nothing (1.8).

The templates are good *skeletons*: pattern pairing, spine days, order. They are not a capacity plan for an arbitrary days x minutes
choice, and the engine treats them as one.

### RC3. Group selection is a greedy subset search by simulation: path-dependent and non-monotone

`timeCheck` (`volume.mjs:1715-1850`) tries the full plan, then up to 12 room cuts, then builds the kept set `K` in `keepOrder()`
(`volume.mjs:1550`):

- **Pass 1** (`1761`): add group g if `probe(K + g)` passes; a big mover that fails only its floor is retried "relaxed" (E-11), and a group
  that crowds another is retried without its stations on contested days (E-82).
- **Pass 2** (`1796`): relaxed big movers may displace small groups, which are retried.
- **Pass 3** (`1822`): the work-lift pattern of each day is re-inserted and other groups are shed from that day (E-144).
- In the live engine (20:46) all of this runs up to three times, with and without the stay-active athletic cuts (E-143).

Every `probe` (`volume.mjs:1563-1698`) is itself a greedy fill: `fit` at week 1, then per-group climb passes, then a peak fit, with
day-shedding loops in keep order. That is 0-15 probes per sample plan, each a full simulation.

A greedy search over subsets with order-dependent inner fills has no optimality and no monotonicity property. Adding minutes changes which
first subset probes clean, so groups appear and disappear (1.8). The order itself (`keep_order`, `keep_order_r2`, pin-first calves for
racket players 50+, pattern days) was rewritten in fix rounds E-81, E-138, E-140, E-143 and E-144 to satisfy specific reviews.

### RC4. Stairway targets, packing and verification are three different computations

- **Targets.** Per-line start and ceiling come from the level table x modifiers (`targetsFor`, `volume.mjs:130-270`), lambda-solved per line
  (`stairwayFrom`, `334-357`). After the time check they are *re-derived from the probe allocation*: `finishCheck` (`1853-1901`) floors the
  probe's week-1 and peak values (`Math.floor(pk + EPS)`, `Math.floor(pkW / g1)`) and clamps them.
- **Packing.** Weeks are placed by yet another greedy: `placeInc` from the peak allocation, `placeSet` and `tryBonus` as fallbacks, a
  whole-set `buildSchedule` (E-146), smoothing passes and early-entry rules (`volume.mjs:2217-2527`). Each has its own limits: the per-line
  7 % rise, the week's total 7 % and 10 %, the per-exercise maximum, the work-lift guard, the per-session 11 / 14, Focus slots on optional
  days, and added slots only at exercise-block starts.
- **Verification.** The result is checked on *groups* (`2532-2565`). A group that misses its floor or climb triggers a retry that first cuts
  a competitor line's ceiling, then drops the group (`planWeeklySets`, `454-462`, up to 40 re-runs).

Because the three disagree (1.4, 1.11), the repair loop removes groups the probe had shown feasible. A drop is the worst outcome
for the coach (a big mover lost), and it is reached through rounding.

### RC5. No single unit of account

- **Lines and groups.** The stairway runs on 9 lines and the floor, the 2-4 rule and the time check on 8 groups. Hips is two lines, so it
  gets two line ceilings (06: hips 27 -> 35 on all days); shoulders reaches the absolute cap of 30 on all days.
- **Whole sets and helper credit.** Sets are whole, but group credit moves in quarter steps; a squat adds 0.25 to hips. Line targets are
  floored, group climbs are compared with a 0.5-set tolerance (`CLIMB_TOL`, `volume.mjs:1535`; `validate.mjs:1182`).
- **Main days, all days and "stair" days.** Floors are read on main days, the climb on main days plus added optional-day exercises
  (`stairMode`), and caps on all days. Each validator rule chooses one view.
- **Printed targets for untrained groups.** Pickleball biceps and triceps show 10 -> 13 targets with no station (1.4).

Every tolerance or alternate tally added to reconcile these views is another place for the views to drift apart.

### RC6. Whole-set granularity makes "never flat" impossible in sets alone

The coach's stairway asks for about 3 % a week, then 5 %. On a 10-13-set group that is 0.3-0.65 set a week. With integer sets a group can
step only `cap - start` times; with time-lowered ranges of 1-3 sets over 11 transitions, per-group flatness of 70-90 % is forced (1.9). The
engine has tried four rounding regimes to hide this: the release threshold, `half_up` (E-85), `floor_last`, and `scheduled` (E-146). It has
also added smoothing passes that pull next week's step forward. None can create steps that do not exist. The coach's own words already
contain the answer: "start at a 2 ... end at an 11 ... the amount of volume ... and total loading" (R2-PER-05), and planned effort drifting
from 3 RIR to 1 RIR plus intensifiers (R3-VOL-04). Progression needs more than one dimension (sets, then reps in the bracket, then RIR,
then load or intensifier), and "never flat" must be defined on that composite or on the weekly total. Doing that is a coach decision
(section 3).

### RC7. Conflicting rules with no explicit precedence, re-ranked locally by each fix

| Conflict | Current resolution in code | Evidence |
|---|---|---|
| Floor 10 on every trained group vs a big mover that holds the day's work lift but cannot reach 10 | E-11: keep it **below** the floor ("relaxed"), PROPOSED | 4 of 8 plans train a group below the floor |
| R3-SES-02 "fewer groups" vs BRAIN 10.7 "every primary pattern at least once" | E-94 / E-145: 1-exercise "pattern kept" stations for untrained groups | 1-exercise groups on full-body days (1.6) |
| Day patterns (knee + pull / hip + push) vs a group needing 2 days to reach 10 | E-144: the day keeps its pattern | pickleball quads and hips both below the floor |
| "Fit the chosen minutes" vs "full-body days might be a little longer" (R2-SES-05) | `warn_above_factor` 1.1 | days up to 110 %, test weeks to 128 % |
| Calves 1 exercise x 3 sets a leg day vs floor 10 | `calvesFloor` = max(3n, min(10, 4n - 1)); optional-day calves slot (E-139) | PPL calves 7 for 11 weeks |
| Athletic budget vs resistance minutes | stations added (F2), then cut (E-143), then restored (live) | pickleball ankle 0 -> 28-50; hips worse |
| 2-4 exercises per group vs exercises per session by minutes | no count limit on full-body days | 10-12 exercises at 75 min |
| Line ceilings vs group ceilings vs the absolute cap 30 | per-line caps, `ABS_CAP` check on all-day line sets (E-95) | hips 35 on all days |

None of these has a stated, coach-approved priority in the model. Each fix round picks a local winner for the reviewed sample, and the next
review finds the loser (1.10).

### RC8. The athletic budget is planned outside the capacity model

- `athleticBudget` (`athletic.mjs:313-402`) ramps the 04 profile's weekly ranges by stair progress and splits contacts by the plyo share. It
  never looks at the minutes.
- `ensureAthleticStations` (`athletic.mjs:419`, called from `week.ensureAthleticTracks`, `week.mjs:1760`) adds stations to reach those
  targets at 2 sets each. Then `applyCuts`, `enforceAthleteCap` (12 + 2) and the volume room cuts (`second_plyo`, `ankle_block_extra`,
  `stay_active_power` ...) remove some.
- The sets of the survivors are the volume engine's defaults (2, or 3 at 90+ min), constant across weeks except Olympic sets.
  `planAthletic` can only move per-set contacts inside each drill's bounds (`distribute`, `athletic.mjs:543`), so the athletic climb is
  capped by per-set bounds, and a key whose stations cannot hold the target is "scaled" and "told" (`warning.athletic_capacity`).

Result: soccer gets 16-20 % of its jumps and 45 % of its COD, football 59-83 % of its jumps. Pickleball's ankle and Olympic work disappear
or reappear depending on which time-cut rule is active.

### RC9. The time model is decoupled from the dose, and "fits" means 110 %

- `setCost` (`timefit.mjs:125`) charges per-class constants (compound 0.75 min of work, isolation 0.6, unilateral isolation 1.2, plus a rest
  class). The dose later chooses 15-20 reps per side, 20-60 s holds and 30-60 s rest for prehab. The engine's planning minutes and the
  printed prescription diverge by 5-16 min a day on high-rep per-side days (1.5).
- `limitOf` (`volume.mjs:679`) accepts days up to minutes x 1.1 on full-body days (`longF`, `488`). Test weeks are sized separately
  (`testPlan`) and may run further over, with `warning.test_day_long`.
- `est_minutes` in the plan is the volume engine's estimate (`generate.mjs:522`), not re-costed after the athletic reconcile or the dose.
- The engine-added "pattern kept" and bonus stations are costed with probe picks that can differ from the final picks (the B3 open item
  "probe vs real picks", `fillFor` keyed `probe|`, `generate.mjs:86-118`).

### RC10. The validators share the engine's patched semantics

`validatePlan` passes on every sample because the checks encode the same exemptions the engine introduced:

- V22 skips "trained below floor" groups (`validate.mjs:800`) and pattern-kept stations (`824`).
- H21 allows a 0.5-set shortfall on the climb (`1182`), applies its hold rules to big movers only (calves 7 for 11 weeks pass), and skips
  groups "below the floor".
- V13 accepts any day up to 110 % or any day carrying `warning.long_day`.

Validation is used inside the engine as a repair trigger (RC4), so it cannot also serve as the independent definition of a coach-acceptable
plan. The reviews (grades C-D) and the validators (all green) measure different things.

### RC11. Patch accretion has outgrown the design

- `engine/DECISIONS.md` holds 134 round-3 E-decisions plus 81 D- and 19 C-decisions. The round-2 code adds E-135 to E-146.
- 9 amendment layers sit on the model: `review-v12`, `round3`, `athletic-b2`, `render-b3`, `integrate-b4`, `fix-r1-f1/f2/f3`, `fix-r2-f1`.
- `rules.json` carries 42 fix-round status flags and 78 PROPOSED mentions.
- `volume.mjs` has 101 fix-round annotations. `runBlock` alone is 2,149 lines with 154 nested closures sharing mutable state (`sets`,
  `fills`, `dropGroups`, `relaxed`, `roomCut`, `curWS`, `probing`, `peakGuard` ...), plus `DEBUG-TC` hooks.
- `stairway.release_rounding.mode` has changed four times.
- Within 12 minutes of this snapshot the live engine added a new outer loop around the time check.

Each patch is reasonable for the symptom it fixes, but there is no global invariant for a patch to preserve, so fixes trade one review's
blocker for another (1.7, 1.10). This is the signature of a missing model, not of missing patches.

### Symptom -> root cause map

| Reviewer symptom (REVIEW_LOG / RECHECK) | Root causes |
|---|---|
| Stairways flat on main days; groups at their ceiling weeks early | RC6 (granularity), RC4 (targets vs packing), RC2 / RC3 (time-lowered ranges) |
| Trained groups below the 10-set floor | RC7 (E-11 precedence), RC2 (one-day stations), RC3 |
| Days over the chosen minutes | RC9 (time model vs dose; 1.1 tolerance), RC1 (cuts in four places) |
| Too many exercises per day | RC7 (2-4 rule without a count budget), RC2 (template stations) |
| The time check over-cutting (pickleball with only hinges or only chest) | RC3 (greedy subset search), RC2, RC4 (verify-drop) |
| Athletic work under budget or not climbing | RC8, RC1 |
| Patch-on-patch regressions | RC11, RC10, RC7 |
| Offers that do not help or cannot be accepted | RC3 / RC9 (offers by arithmetic), RC2 (5-day optional day) |

---

## 3. Decisions the coach must make before any planner can be "top of the line"

A solver needs a priority for every conflict in RC7. These are not engineering choices:

1. **Below-floor training (E-11).** Forbid it, as the approved R3-SES-02 algorithm says: fewer groups, each at 10 and climbing. Or allow a
   big mover holding the day's work lift below 10, and then by how much at most?
2. **Time tolerance.** Must every day fit the chosen minutes (100 %), or may full-body days run to 110 %? Do test weeks get the same limit
   (tests replacing work, not adding to it)?
3. **"Never flat".** Is it measured on the weekly total, or on every group? If on groups, accept that progression in non-set weeks comes from
   reps, RIR and load (the R2-PER-05 "2 -> 11" level) and print that.
4. **Day patterns vs floors on 2-3-day plans.** May a hip exercise go on the knee + pull day (or vice versa) when that is the only way a
   kept group reaches 10?
5. **Untrained groups.** Keep one "pattern" exercise per primary pattern (BRAIN 10.7), or nothing ("never 1 exercise per group")?
6. **Calves.** Floor 10 (needs a 4th set or an optional-day slot below 3-4 leg days), or 3 sets per leg day as the whole rule?
7. **Group ceilings for two-line groups** (hips = glutes + hamstrings; shoulders): one ceiling per group, or per line?
8. **Athletes' minutes split.** What share of a short session goes to athletic work vs resistance, by sport? Are the 04 weekly numbers
   full-time targets to scale down?
9. **Exercise budget per session** on full-body days (VOL-08: 45 = about 5, 60 = 6-7, 75-90 = 8-9): a hard limit or a guide?

---

## 4. Design requirements for the new planner

Each requirement has an acceptance test that the benchmark (`design/bench/`) can score automatically.

### A. Architecture

- **DR-1 One block-level model, solved jointly.** For each training block the following are decision variables of one model:
  - the set of groups trained directly;
  - the day(s) each trained group is placed on (within the pattern rules);
  - the exercises per group per day (2-4) and the stations kept;
  - integer sets per station per week;
  - athletic stations, sets and per-set doses;
  - supersets on or off per day;
  - fixed blocks on or off (user-switchable).

  No later stage may add or remove volume. The dose may choose reps, RIR and load only inside the solved sets and the solved time budget.
  *Test:* the plan's sets, stations and minutes are identical before and after dosing.
- **DR-2 Lexicographic (pre-emptive) priority tiers**, in the coach's order and held as data:
  1. hard safety and structure (pain exclusions, spine days, power before strength, core first, athlete cap);
  2. R3-SES-02 group selection (max priority-weighted set of trained groups);
  3. floors and minimum climb of every trained group;
  4. time fit per day;
  5. the stairway shape (monotone, ceiling in the last week, step limits, the 3 %/5 % profile);
  6. athletic budget adherence and climb;
  7. exercise-count guidance;
  8. pairing, order, variety and laterality preferences.

  Each tier is optimized and then frozen as a constraint for the next. *Test:* changing a lower tier's weights never changes a higher
  tier's result.
- **DR-3 Exact feasibility, not simulation.** Subset selection and allocation are decided by an exact method: ILP or branch and bound, or
  DP over the small dimensions. The size is at most 8 groups x 6 days x 12 weeks x about 15 slots. A decision such as "hips is not trained"
  must come with the binding constraint, for example "Tue / Thu hold 26 resistance minutes; hips 10 -> 12 + calves 6 -> 7 need 28".
  *Test:* for every untrained group, adding it makes the model infeasible at the same or a higher tier.
- **DR-4 Monotonicity and stability as guarantees.**
  - More minutes, or one more day, never untrains a group, never swaps a higher-priority group for a lower one, and never lowers a trained
    group's peak.
  - Adding a Focus muscle never drops a big mover unless the model proves it must, and then the plan says so.
  - The same input gives the same output (deterministic tie-breaks on stable ids).

  *Test:* the 105-plan sweep of 1.8 (and a larger one) shows 0 violations.
- **DR-5 Templates give patterns and order, not capacity.** Day types, A / B pattern pairing (knee + pull, hip + push), spine days and
  block order come from the coach templates. Which groups sit on which day, and with how many exercises, is solved, within the pattern
  rules and the exceptions the coach approves in section 3.4. A day with free minutes can host a kept group. *Test:* no plan leaves a day
  more than 15 % under its minutes while a group is "not trained directly (time)", unless a hard rule forbids every placement and the plan
  names it.
- **DR-6 No post-hoc repair.** No verify -> cut ceiling -> drop group -> re-run loops. If the solver returns feasible, the plan satisfies
  every hard constraint by construction. *Test:* there is no retry loop; the scorer finds 0 hard violations.

### B. Units, floors and the stairway

- **DR-7 One unit of account: weekly hard sets per FOCUS group** with exact fractional credit (1.0 / 0.5 / 0.25; thruster 1 / 0.5 / 0.25;
  dips 0.5 / 0.5; KB swing 0; at most 1.0 per set per group) inside the constraints, with no rounding fudge. Lines are display only, or an
  explicit sub-target (a glute Focus inside hips). There is one ceiling per group, decided by the coach (3.7). *Test:* no `CLIMB_TOL`-style
  tolerances; floors, climbs and caps are checked on the same tally the solver used.
- **DR-8 Integer stairway as constraints**, per trained group and block:
  - weekly sets are non-decreasing;
  - the last week equals the solved ceiling;
  - per-group step is at most max(1 set, 7 %);
  - the weekly total rises at most 7 % planned and stays below 10 % absolute (one set always allowed);
  - the total rises every week whenever the available steps are at least N - 1;
  - steps are distributed toward the 3 % then 5 % curve (minimum L1 deviation from the lambda curve, or largest-remainder apportionment
    staggered across groups);
  - the longest hold per group is minimized.

  *Test:* the measured flat transitions equal the arithmetic minimum of 1.9 for every plan.
- **DR-9 Multi-dimensional progression ladder for "never flat".** When whole-set steps are fewer than the weeks, the remaining weeks
  progress through reps in the bracket, the planned RIR drift (3 -> 2 -> 1-2 -> 1 + intensifiers), or load, and every week states which
  dimension climbs. The definition (total vs group, composite index) is the coach's (3.3). *Test:* a composite load index rises every week
  for every trained group.
- **DR-10 Floors exactly as approved.** Every directly trained group holds its floor (10; calves per 3.6) every week of a training block and
  climbs at least `min_climb`. A below-floor group exists only if the coach approves it (3.1); then it is a named, solved parameter, not
  an exemption in the validator. *Test:* 0 group-weeks under the floor except groups explicitly listed under an approved rule.

### C. Time

- **DR-11 One time function** shared by solver, dose and scorer. It costs the *dosed* prescription:
  - reps x tempo, doubled per side;
  - hold seconds;
  - the rest class the dose will print;
  - supersets sharing rest;
  - changeovers;
  - fixed blocks;
  - test work-ups that replace a top set.

  Calibrate it on the coach's own sessions (BYOP day 1: 7 exercises, 19 sets, about 60 min). *Test:* `est_minutes` equals a re-cost of the
  printed items within 2 min.
- **DR-12 Day time is a hard capacity** at the chosen minutes, with a tolerance only if the coach approves one (3.2), including test weeks.
  *Test:* 0 days over the limit (or over the approved tolerance) in any week.
- **DR-13 Fixed blocks are budgeted first and visibly**: warm-up, core, athletic, power, prehab, conditioning and aerobic add-ons. Switching a
  block off is a modeled option with exact minutes saved. *Test:* each `offer.block_on` reports minutes equal to the re-solve difference.
- **DR-14 Exercise counts as constraints.** Athletes: at most 12 + 2 core. Every day: 2-4 exercises per trained group, calves 1 exercise.
  Full-body days: the per-minutes guidance (3.9) as a constraint or a soft tier. *Test:* 0 cap breaches and 0 single-exercise trained
  groups; counts within the guidance.

### D. Athletic work

- **DR-15 The athletic budget is co-planned.** Stations, sets *and* per-set doses are variables in the same capacity model. The athletic vs
  resistance minutes share is an explicit profile parameter (3.8). Plyo-share, Receive-Create stage (changing only at exercise-block
  boundaries), Olympic and contacts-per-session constraints all apply, and every key climbs monotonically within a stairway block.
  *Test:* every key delivers at least the coach-set fraction of its scaled target and is non-decreasing week over week (the end-test week
  holds the week before).
- **DR-16 Targets are scaled to capacity before stations exist.** Do not build stations to full-time targets and then report 16-20 %.
  *Test:* `planned / target` is at least 0.9 for every key after scaling, and the scaling factor is printed.

### E. Infeasibility and offers (R3-SES-02)

- **DR-17 Offers are computed by re-solving** at *valid* intake values: minutes 30 / 45 / 60 / 75 / 90 / 105 / 120 and days + 1, with the
  template the intake would really get. An offer is shown only if it strictly improves the result. Each offer names what it adds ("2 x 60
  adds quads at 10 -> 12; 2 x 75 adds back"). *Test:* every offered schedule, run as an intake, is valid and produces exactly the
  improvement the offer states.
- **DR-18 Group selection maximizes the priority-ordered set** (Focus and sport-pinned groups > big movers hips, quads, back, chest >
  shoulders, calves > arms), every member at floor and climbing. Unselected groups keep their compound credit, and the plan lists it.
  *Test:* matches the coach's worked examples. Example 5.5 (pickleball 2 x 45) gives hips 10 -> 14 and calves 6 -> 7; example 5.1
  (aesthetics L1 4 x 60) gives quads, hips, back, chest, shoulders and biceps.

### F. Verification, explainability, engineering

- **DR-19 An independent scorer** implements the coach rules literally, with no engine-mirrored exemptions; every exemption is a named
  coach-approved parameter. Acceptance is the scorer's metrics on the benchmark, not `validation.ok`. *Test:* the scorer flags the current
  engine on every failure listed in section 1.
- **DR-20 Explainability.** Every decision carries the tier and binding constraint that forced it, mapped to `why` keys and coach answer ids.
  *Test:* every `not_trained_directly`, lowered ceiling and below-target athletic key has a binding-constraint explanation.
- **DR-21 Consistent outputs.** Targets are printed only for trained groups and equal what is placed. There are no planned-but-impossible
  targets (1.4). *Test:* `target_by_group == placed` for every trained group and week.
- **DR-22 Browser-ready and deterministic.** Plain JS (Node 22 and browsers), no dependency unless clearly justified and MIT / Apache, a worst
  case of about 1 s per plan on a phone (the current engine takes 27-238 ms), and deterministic tie-breaking. *Test:* the corpus timing and
  byte-identical repeat runs.
- **DR-23 Parameters as data.** Floors, ceilings, steps, tolerances, keep order, minutes shares and exercise budgets live in `model/rules`
  with their coach status; changing one needs no code. *Test:* the property tests pass under parameter changes inside their allowed ranges.
- **DR-24 Keep what works.** Exercises stay fixed inside an exercise block (measured: 0 mid-block exercise changes in all 8 samples).
  Added exercises enter only at exercise-block starts. The VOL-07 order applies inside a group (2/2/2 -> 3/2/2 ...), as does the R3-VOL-03
  alternation between the two exposures of a day type. Selection and dosing modules, safety screens and the render stay. *Test:* the
  existing selection and render tests keep passing.
- **DR-25 Benchmark and property suite as the definition of done.** The suite covers the 8 samples, the minutes / days sweep, the random
  corpus and the coach's worked examples. It scores floors, the stairway (against the arithmetic minimum), time, counts, athletic
  adherence, monotonicity, offer validity and stability across parameter changes. A fix that improves one sample must not regress another
  sample's score.

---

## Appendix A. Reproduce

```sh
cd blaze-camp-model
node design/scratch/measure.mjs            # snapshot engine -> design/scratch/out/measure.json (add --live for engine/ + model/)
node design/scratch/report.mjs design/scratch/out/measure.json [overview|groups|summary|minutes|exercises|athletic|churn]
SPR=3 node design/scratch/measure.mjs      # independent minutes at 3 s a rep (measure.spr3.json)
node design/scratch/sweep_minutes.mjs      # 105-plan minutes / days sweep -> out/sweep_minutes.json
node design/scratch/probe_dbg.mjs 08-pickleball-genpop 3 45 Mon,Tue,Thu   # the engine's own time-check trace
node design/scratch/probe_retry.mjs 08-pickleball-genpop 3 90 Mon,Tue,Thu # verify-retry loop (instrumented copy snap_instr/)
node design/scratch/planned_vs_placed.mjs  # planned line targets vs placed sets
node design/scratch/blockminutes.mjs       # minutes per block kind
node design/scratch/timegap.mjs 06-full-body-aesthetics 11 Mon             # planning cost vs printed dose per item
```

Line numbers in section 2 refer to the snapshot `design/scratch/snap/engine/*.mjs` (copied 2026-10-09 20:33). The live files have moved
since (for example `volume.mjs` gained `timeCheckCore` at 20:42).
