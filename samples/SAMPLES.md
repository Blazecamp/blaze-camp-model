# The 8 sample plans (engine 0.5.0, model 1.3.0): what the engine decided and why

The coach's seven sample clients (R2-GEN-07) plus the pickleball "stay athletic and active" bonus. Generated from the compiled model (`model/` 1.3.0) by engine 0.5.0 with `node tools/generate-samples.mjs`. The plans in `plans/` are the ones regenerated after fix round 2 (2026-10-11); a fresh generation gives the same files byte for byte (`RELEASE_CHECK_v1.3.md`).

- Every plan has status `ok` and **zero failing error checks** (59 checks: V1-V37, H01-H22).
- No warning check fails on any of the 8 plans (at the end of V4, V29 failed on 02; fix round 1 closed it).
- Files: `plans/<name>.json` (the full plan with every `why`), `plans/<name>.en.md`, and for three plans also `plans/<name>.es.md` (03 and 05 are Spanish clients; 08 has a Spanish copy). Intakes: `intakes/<name>.json`.
- Status, test counts, benchmark numbers and known gaps: `STATUS_v0.5.md`.
- The v0.4 review history is in `REVIEW_LOG.md` and `RECHECK_v0.3.md`. It describes time-fitted plans that no longer exist.

## Current numbers (after fix round 2)

> **Read this first.** The per-sample sections further down were written at the end of work package V4. Fix rounds 1 and 2 changed the engine and the plans were regenerated, so some lines in those sections no longer match the plans. Examples: sample 06 chest was 13 weekly sets and now climbs 19 -> 24; the football squat test is a front squat, not a Zercher squat; the athletic A / B days keep a two-leg lift in slot 2; sample 05 climbs 72 -> 90 instead of holding 72; sample 08 holds 9 exercises a day and has a Spanish copy. The plan files in `plans/` and the table below are current (computed from the plan JSON on 2026-10-11). What each fix round changed, sample by sample: `STATUS_v0.5.md`. The questions for the coach at the end of this file were written at V4 too; the current list of 14 is at the end of `STATUS_v0.5.md`.

Weekly sets are counted the coach's way, on all days, for the first and the last week of the stairway. "Said in the plan" lists the notice codes in `plan.meta.warnings`.

| Sample | Template, level, session size | Total weekly resistance sets | Weekly sets by group | Said in the plan | Failing checks |
|---|---|---|---|---|---|
| 01 Swimming | `athletic.3`, L2, 6-12 exercises | 61 -> 82 (weeks 1-12). | quads 12 -> 16; hips 11.5 -> 16.5; back 15 -> 21; chest 10 -> 14; shoulders 10.75 -> 13.5; biceps 3.75 -> 5.25; triceps 2.5 -> 3.5; calves 9 -> 11 | credit_only_groups | none |
| 02 Football | `athletic.4`, L3, 6-12 exercises | 64 -> 79 (weeks 1-12). | quads 14 -> 18; hips 14.5 -> 18; back 10 -> 13; chest 10 -> 13; shoulders 10 -> 13; biceps 2.5 -> 3.25; triceps 3 -> 4; calves 12 | credit_only_groups, laterality_capped | none |
| 03 Soccer | `athletic.3`, L2, 6-12 exercises | 55 -> 75 (weeks 1-6). Weeks 7-8 (pre season): 42. | quads 11 -> 16; hips 11.25 -> 16.25; back 10 -> 14; chest 10 -> 14; shoulders 10 -> 12.5; biceps 2.5 -> 3.5; triceps 2.5 -> 3.5; calves 9 -> 11 | v6_season, acceleration, credit_only_groups, laterality_capped | none |
| 04 CrossFit-style class | `hybrid_crossfit.4/crossfit_style_bootcamp`, L2, 5-7 exercises | 77 -> 110 (weeks 1-8). | quads 12 -> 15; hips 12 -> 17.75; back 12 -> 18; chest 12 -> 18; shoulders 12.75 -> 18; biceps 10 -> 15.5; triceps 13 -> 18.25; calves 6 -> 8 | none | none |
| 05 Bootcamp | `fat_loss_bootcamp.3`, L2, 5-7 exercises | 72 -> 90 (weeks 1-8). | quads 12 -> 15; hips 11 -> 13.75; back 12 -> 15; chest 12 -> 15; shoulders 18 -> 22.5; biceps 11 -> 13.75; triceps 12 -> 15; calves 0 | acceleration, V7, no_vertical_pull | none |
| 06 Full-body aesthetics (A/B) | `aesthetics.4`, L3, 6-8 exercises | 121 -> 154 (weeks 1-12). | quads 20 -> 25; hips 22.5 -> 27.25; back 19 -> 24; chest 19 -> 24; shoulders 20 -> 27.5; biceps 14.75 -> 18; triceps 15.25 -> 20; calves 10 -> 12 | none | none |
| 07 Push / pull / legs | `aesthetics.6/ppl_x2`, L3, 6-8 exercises | 122 -> 161 (weeks 1-12). | quads 20 -> 25; hips 20.5 -> 25.25; back 22 -> 27; chest 22 -> 27.5; shoulders 23 -> 25.5; biceps 15.5 -> 22.75; triceps 15 -> 25; calves 6 -> 10 | none | none |
| 08 Pickleball, 52, knee pain | `athletic.2`, L1, 5-10 exercises | 34 -> 42 (weeks 1-12). | quads 6; hips 7 -> 8; back 6 -> 8; chest 6 -> 8; shoulders 6.25 -> 8; biceps 1.5 -> 2; triceps 1.5 -> 2; calves 6 -> 8 | two_day_rule, credit_only_groups, pain_plan | none |

## What every plan is in v0.5

- **Built from the coach's templates and sized by exercise count** (R4-SES-02, R4-SES-05). The count leaves out the warm-up, the 2 core exercises, joint care, skill practice, conditioning and cardio.
- **No time fitting** (CT-01, R4-SES-01). Session minutes are not an input. Each day prints an average time as information.
- **Nothing is dropped** (R4-SES-04). What a template cannot hold is named up front. Each day lists what is easiest to remove.
- **A stairway of whole weekly sets per muscle group** that reaches its final sets in the last week (CX-01, R4-PRG-01). A week that adds more than about 15% is marked (R4-PRG-02).
- **Reps and load are a rule the person applies** (R4-PRG-03), printed on every lift.
- **Effort** drifts from 3 in the tank to 1 in the last week, with one MYO set a day in the last week only.
- **Tests** only in the first and last week of a block.
- **The release line** on top and at the bottom, in English and Spanish (R4-SCP-01 / 02). No plan is built without accepting it.

How to read the numbers: weekly sets are counted the coach's way on the Focus groups (hips = glutes + hamstrings; shoulders = front + side + rear delts). A set counts once for its group. Helpers count 1/4. Jumps, throws, sprints, swings, carries and Olympic lifts never count. "wk1 -> wkN" is the first and last week of the stairway, on all days.

---

## 01 - Swimming (EN)

**Who:** 16-year-old high-school swimmer (200 free / 100 fly), 2 years of lifting, 145 lb, off-season dryland, 3 gym days (Mon / Wed / Fri) + optional Saturday, full gym, 12 weeks. Tests strength and jumps. A guardian accepts the release.

**Template:** `athletic.3` (athletic block, then his A / B / C lifts), level L2, up to 12 exercises a session.

| Day | Session | Average time |
|---|---|---|
| Monday | S1: jump + knee + pull | about 90-110 min |
| Wednesday | S2: medball + hip + push | about 85-105 min |
| Friday | S3: Olympic + strength | about 85-100 min |
| Saturday | Optional | about 30-35 min |

**Key decisions**

- Shoulder joint care every session (KB face pull, floor Y/T raise), outside the exercise count.
- Olympic work on all 3 days (hang power clean, one-arm DB snatch, snatch pull), 6 -> 8 sets a week.
- No extra cardio: the pool is the cardio.
- Tested lifts: flipped hex-bar squat (Mon), incline bench (Wed), conventional deadlift (Fri). A minor tests a 3- or 5-rep max.

**Weekly sets (wk1 -> wk12):** quads 11 -> 16, hips 11 -> 16, back 15 -> 21, chest 10 -> 13, shoulders 10 -> 16, calves 11. Total 62 -> 85.

**Said in the plan:** chest holds 13 of the planned 14. Biceps and triceps have no exercise of their own (field-athlete rule). Week 9 adds 17% for shoulders.

**Athletic work:** week 1 has 26 jump contacts (target 37), 36 throws (35), 6 Olympic sets (5). Week 11 has 48 jump contacts (49), 44 throws (45), 8 Olympic sets (8).

## 02 - Football (EN)

**Who:** 20-year-old college linebacker, 230 lb, 3 years of lifting, early off-season, 4 days (Mon / Tue / Thu / Fri) + optional Wed / Sat, full gym with platform, bumpers and field space, 12 weeks. Tests strength, speed / agility and jumps.

**Template:** `athletic.4`, level L3, up to 12 exercises a session.

| Day | Session | Average time |
|---|---|---|
| Monday | A1: squat + pull | about 105-125 min |
| Tuesday | B1: single-leg hinge + push | about 105-130 min |
| Thursday | A2: single-leg squat + pull | about 90-110 min |
| Friday | B2: deadlift + push | about 90-110 min |
| Wed / Sat | Optional | about 30-50 min |

**Key decisions**

- Each day opens core, then sprint, jump, ankle hops, throw, cuts, then an Olympic lift, then the lifts.
- Olympic lift every main day (clean and jerk, power snatch, power clean, snatch pull), 8 -> 12 sets a week.
- Route drills as the cutting work, because this is football.
- Work lifts: Zercher squat (Mon), stiff-leg deadlift (Fri), bench and incline bench.
- The two-leg / single-leg dial is on for athletic days: Tuesday and Thursday use single-leg lifts in the two-leg slots (profile target 30% -> 20% two-leg).

**Weekly sets (wk1 -> wk12):** quads 14 -> 18, hips 14 -> 18, back 10 -> 13, chest 10 -> 13, shoulders 10 -> 16, calves 12. Total 66 -> 83.

**Said in the plan:** biceps and triceps have no exercise of their own.

**Athletic work:** week 1 has 63 jump contacts (target 105), 62 ankle contacts (60), 63 throws (70), 81 cuts (80), 150 m of sprints (300), 8 Olympic sets (8). Week 11 has 126 jump contacts (145), 90 ankle (91), 108 throws (110), 99 cuts (100), 420 m (400), 12 Olympic sets (12).

**Open:** the tested squat is a Zercher squat; his athletic sheets use front squats and low-bar back squats. Sprint metres hold at 360 m for 5 weeks (a to-do test).

## 03 - Soccer (ES)

**Who:** 22-year-old semi-pro midfielder, 165 lb, 2 years of lifting, 3 days (Mon / Wed / Fri) + optional Saturday, full gym + field kit, season in 10 weeks, 8-week plan. Tests speed / agility and jumps. Spanish output.

**Template:** `athletic.3`, level L2. The shape is a 6-week stairway plus the first 2 pre-season weeks (about 55% of the sets, more speed and power).

| Day | Session | Average time |
|---|---|---|
| Monday | S1: jump + knee + pull | about 80-100 min |
| Wednesday | S2: medball + single-leg hinge + push | about 105-130 min |
| Friday | S3: Olympic + strength | about 95-115 min |
| Tue / Thu | Aerobic | about 15-20 min |
| Saturday | Optional | about 50-60 min |

**Key decisions**

- Mostly single-leg lower work (profile target 20% two-leg): step-up, lateral lunge, staggered deadlift, single-leg hip thrust. The hex-bar squat and the conventional deadlift stay two-leg.
- Olympic pulls on Monday and Friday (clean pull, snatch pull), 4 -> 6 sets.

**Weekly sets (wk1 -> wk6):** quads 11 -> 16, hips 11 -> 16, back 10 -> 14, chest 10 -> 13, shoulders 10 -> 16, calves 11. Total 58 -> 79. Pre-season weeks 7-8: 43.

**Said in the plan:** weeks 4, 5 and 6 each add more than about 15% for one group (a 6-week climb to the same final sets). Chest holds 13 of 14. The template holds about 53% of the sport's jump contacts, 77% of its ankle contacts and 68% of its cuts.

**Athletic work:** week 1 has 42 jump contacts (target 120), 47 ankle (50), 20 throws (20), 54 cuts (120), 300 m (400). Week 5 has 84 jump contacts (160), 85 ankle (111), 40 throws (40), 108 cuts (160), 600 m (600).

**Open:** Wednesday keeps a push-up box jump, and the pre-season holds 72 cuts against 108 in the last off-season week (two to-do tests).

## 04 - CrossFit-style class (EN)

**Who:** 35-year-old class member who wants to stay athletic and active, 170 lb, 2 years, 4 days (Mon / Tue / Thu / Fri) + a WOD-only Saturday, box kit, 8 weeks. Tests strength and cardio.

**Template:** `hybrid_crossfit.4` / `crossfit_style_bootcamp` (his class: squat day, press day, deadlift day, clean / pull day), level L2, 5-7 exercises a session.

| Day | Session | Average time |
|---|---|---|
| Monday | Squat day | about 105-130 min |
| Tuesday | Press + snatch day | about 70-85 min |
| Thursday | Deadlift + push day | about 85-100 min |
| Friday | Clean + pull day | about 70-85 min |
| Wednesday | Aerobic | about 25-35 min |
| Saturday | WOD class + cardio (optional) | about 55-70 min |

**Key decisions**

- Each day: warm-up and skill, core, the Olympic piece (Tue / Fri), the class lift, accessories, the WOD (10 min, then 15).
- Class lifts: front squat, strict press, conventional deadlift. Olympic: snatch pull then power snatch, clean pull then power clean, 6 sets a week.
- No Olympic work in the end-test week: the max is the first heavy work of the day.

**Weekly sets (wk1 -> wk8):** quads 12 -> 13, hips 12 -> 18, back 12 -> 18, chest 12 -> 18, shoulders 10 -> 18, biceps 10 -> 14, calves 6. Total 66 -> 93.

**Said in the plan:** quads hold 13 of the planned 18, biceps 14 of 18. Triceps have no exercise of their own. Week 6 adds 15% for shoulders.

## 05 - Bootcamp (ES)

**Who:** 42-year-old general-population client, 160 lb, 1 year of training, 3 circuit days (Mon / Wed / Fri), dumbbells, kettlebells and outdoor kit (no barbell, no machines), 8 weeks. Test: body weight and measurements. Spanish output.

**Template:** `fat_loss_bootcamp.3` (his Bootcamp 1-2-3), level L2, 7 stations a day.

| Day | Session | Average time |
|---|---|---|
| Monday | Bootcamp 1: squat + row + single-leg hinge | about 45-55 min |
| Wednesday | Bootcamp 2: hinge + presses | about 45-55 min |
| Friday | Bootcamp 3: single-leg squat + pulls + arms | about 45-55 min |
| Tue / Thu / Sat | Aerobic | about 20-40 min |

**Key decisions**

- 4 rounds at every station. The sets stay the same and the work per station climbs 35 -> 46 seconds over 8 weeks.
- One ball station and one kettlebell swing a week are ballistic work and never count as muscle sets.

**Weekly sets (all 8 weeks):** quads 16, hips 18, back 16, chest 12, shoulders 11, biceps 8, triceps 8. Total 72.

**Said in the plan:** biceps and triceps hold 8 weekly sets, below 10. A pull-up bar or a suspension trainer would add options.

## 06 - Full-body aesthetics, A/B (EN)

**Who:** 29-year-old, 150 lb, 3 years of training, 4 days (Mon / Tue / Thu / Fri) + optional Wed / Sat, full gym, Focus glutes and side delts, 12 weeks, no tests.

**Template:** `aesthetics.4`, his A/B full body: A = pull + knee dominant, B = push + hip dominant. Level L3, 7 exercises a session.

| Day | Session | Average time |
|---|---|---|
| Monday | A1: squat + pull | about 75-90 min |
| Tuesday | B1: hip thrust + push | about 75-90 min |
| Thursday | A2: leg press + pull | about 75-90 min |
| Friday | B2: deadlift + push | about 90-110 min |
| Wed / Sat | Optional | about 55-75 min |

**The days, slot for slot** (week 1; the full comparison with his sheet is in `STATUS_v0.5.md`)

| Slot | A1 Monday | A2 Thursday | B1 Tuesday | B2 Friday |
|---|---|---|---|---|
| 1 | Seal row (two-arm) | Bent-over barbell row | Barbell bench press | Incline barbell bench press |
| 2 | Front squat | Leg press | Barbell hip thrust | Hex-bar deadlift |
| 3 | Single-arm lat pulldown | Lat pulldown (rope) | High-incline barbell press | High-incline DB press |
| 4 | Rear-foot-elevated lunge | Stationary lunge | Staggered-stance DB deadlift | Alternating staggered deadlift |
| 5 | Spider curl | Concentration curl | EZ-bar skullcrusher | Cable push-down |
| 6 | Leg extension | Sissy squat | Seated leg curl | Lying leg curl |
| 7 | Machine calf raise | Machine calf raise, one leg | Seated DB lateral raise | Leaning cable side raise |

**Key decisions**

- New in V4: the lunge slot stays a lunge and the single-leg hinge slot stays a single-leg hinge in all three exercise blocks, and slot 1 of the A day is a two-arm row (R4-SES-05).
- The side raise opens the B day because side delts are a Focus muscle (ORD-04). Without that Focus it is slot 7.
- Heavy squat Monday, heavy deadlift Friday; leg press and hip thrust on the second days.
- Optional days hold the Focus slots (machine hip thrust, reverse hyper, two lateral raises) and one bonus exercise each for back, chest, biceps and triceps.
- Incline pressing in slot 3 (R4-LIB-03).

**Weekly sets (wk1 -> wk12):** quads 20 -> 25, hips 22 -> 27, back 20 -> 23, chest 13, shoulders 17 -> 27, biceps 15 -> 18, triceps 15 -> 17, calves 10 -> 12. Total 115 -> 143.

**Said in the plan:** this template holds chest at 13 of the planned 25, back 23 of 25, biceps 18 of 25, triceps 17 of 25.

**Open:** chest is flat at 13 for 12 weeks, and no exercise trains the rear delts directly (the rear-delt slot is the 8th exercise of the A day; the default is 7).

## 07 - Push / pull / legs (EN)

**Who:** 24-year-old, 195 lb, 4 years of training, 6 days push / pull / legs twice, Focus chest and back, prefers heavier powerlifting-style compounds, full gym, 12 weeks. Tests strength.

**Template:** `aesthetics.6` / `ppl_x2`, his push / pull / legs sheet. Level L3, 7 exercises a session.

| Day | Session | Average time |
|---|---|---|
| Monday / Thursday | Push | about 90-115 min |
| Tuesday / Friday | Pull | about 95-120 min |
| Wednesday | Legs 1: squat-led | about 85-100 min |
| Saturday | Legs 2: hinge-led | about 80-100 min |

**The days, slot for slot** (in the order of his sheet, new in V4)

| Day | Exercises, in order |
|---|---|
| Push (Mon) | Barbell bench press, high-incline barbell press, incline DB press, DB fly, weighted dip, cable push-down, floor DB skullcrusher |
| Pull (Tue) | Bent-over barbell row, one-arm DB row, lat pulldown, seated DB lateral raise, seated DB reverse fly, incline DB curl, concentration curl |
| Legs 1 (Wed) | High-bar back squat, barbell hip thrust, forward lunge, leg extension, lying leg curl, staggered-stance DB deadlift, machine calf raise |
| Push (Thu) | Incline barbell bench press, high-incline DB press, flat DB bench press, pec deck, parallel-bar dip, cable push-down, EZ-bar skullcrusher |
| Pull (Fri) | Yates row, one-arm cable row, single-arm lat pulldown, cable lateral raise, machine reverse fly, lying biceps curl, cable curl |
| Legs 2 (Sat) | Sumo deadlift, leg press, split squat, sissy squat, Nordic curl, alternating staggered deadlift, DB calf raise |

**Key decisions**

- The first lift of each day is heavy (4-6 reps) because the client asked for heavier compounds. Tests in weeks 1 and 12 on the bench press, the back squat and the sumo deadlift.
- Heavy squat Wednesday, heavy deadlift Saturday.
- The legs day holds a calf raise where his sheet has "Focus 1": this client's Focus muscles are chest and back.

**Weekly sets (wk1 -> wk12):** quads 20 -> 25, hips 20 -> 25, back 22 -> 27, chest 22 -> 27, shoulders 16 -> 25, biceps 15 -> 25, triceps 15 -> 25, calves 6. Total 119 -> 161.

**Said in the plan:** nothing is capped. Every group reaches its planned final sets.

## 08 - Pickleball, stay athletic and active (EN, bonus)

**Who:** 52-year-old recreational player, 180 lb, plays Wed / Sat / Sun, half a year of lifting, mild knee pain with deep knee bends, 2 gym days (Mon / Thu) + optional Friday, basic gym, 12 weeks, no tests.

**Template:** `athletic.2` (stay athletic and active), level L1, up to 8 exercises a session.

| Day | Session | Average time |
|---|---|---|
| Monday | A: single-leg squat + pull | about 75-90 min |
| Thursday | B: single-leg hinge + push | about 70-85 min |
| Friday | Optional | about 40-50 min |

**Key decisions**

- **The 2-day rule** (R4-SES-03): every big group is trained at about 6-8 weekly sets, the plan says so and suggests a third day.
- Knee pain: landing drills and low box jumps, step-ups and a box single-leg get-up in place of deep squats.
- 50-and-over racket rules: a calf raise on each leg day and a face pull as joint care; half the jumps and no extra agility drills because the client plays 3 times a week.
- One light Olympic piece each day (clean pull, snatch pull, 2 x 3).

**Weekly sets (wk1 -> wk12):** quads 6, hips 7 -> 8, back 6 -> 8, chest 6 -> 7, shoulders 6 -> 8. Total 29 -> 34.

**Said in the plan:** the 2-day rule; chest holds 7 of the planned 8; biceps, triceps and calves have no counted exercise of their own (the calf raises are joint care); the template holds about 82% of the plan's ankle contacts.

**Athletic work:** week 1 has 12 jump contacts (target 7), 36 ankle (35), 42 throws (51), 4 Olympic sets (4). Week 11 has 12 jump contacts (9), 60 ankle (68), 60 throws (67), 4 Olympic sets (8).

---

## Questions for the coach (from reading these plans, v0.5)

1. **A/B days: should the incline press in slot 3 count for chest?** Your sheet labels that slot "Chest/Shoulders". Today it counts for shoulders only, and the A/B plan holds chest at 13 weekly sets against a planned 25 (sample 06).
2. **Rear delts on A/B days.** At 7 exercises a day there is no rear-delt exercise. Make the A day 8 exercises for physique clients, or put the rear-delt exercise on the optional day?
3. **Athletic A/B days.** Gym A/B days now always keep a two-leg squat and a lunge. Athletic days still shift toward single-leg work (your 80-90% answer for field and court athletes), so a soccer or football day can hold two single-leg knee lifts. Keep that, or keep the same slots as the gym days?
4. **The tested squat for athletes.** The football plan tests a Zercher squat. Should athletes test a front squat or back squat, as in your athletic sheets?
5. **HYROX week.** Your HYROX week holds 8 pulls. At 2 sets each that is 16 weekly back sets against a top of 13 for that athlete. Keep all 8, or take one out?
6. **Standing core.** A body-weight client who ticks "no floor work" still gets floor core drills, because the library has almost no standing core exercise. Which 3 or 4 standing core exercises would you add?
7. **Spanish:** 843 machine-translated lines are listed in `model/i18n/es_review.json` for approval.
