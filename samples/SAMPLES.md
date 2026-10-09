# The 8 sample plans (Phase 0, v1.2 review round) - what the engine decided and why

The coach's seven sample clients (R2-GEN-07) plus the pickleball "stay athletic and active" bonus, generated from the compiled model
(`model/` 1.2.0) by engine 0.3.0 / contracts 1.1.1 with `node tools/generate-samples.mjs`, after the fixes for the coach-eye reviews
(all eight were graded D; every issue and what happened to it is in `REVIEW_LOG.md`). Every plan has status `ok` and **zero failing
error checks** (V1-V29, H01-H22); V28 (bilateral share, a warning) still flags 03, 06 and 07. Files: `plans/<name>.json` (the full
plan with every `why`), `plans/<name>.en.md`, and for the two Spanish clients also `plans/<name>.es.md`. Intakes: `intakes/<name>.json`.

How to read the numbers: weekly sets are counted the coach's way (main muscle 1 set, helpers 1/4, dips 1/2 + 1/2, thruster
1 / 0.5 / 0.25; jumps, throws, sprints, swings and Olympic lifts never count). "Main sets" are the sets on the main days - the days the
stairway climbs on; the optional day holds its template Focus slots and never carries the stairway (ORD-10). "wk1 -> wkN" is the first
and the last week of the first stairway. Effort is planned reps in reserve: 3 in the first weeks -> 2 -> 1-2 -> 1 in the last week,
never below 1 on compounds; every plan now states that drift under the Basic Instruction.

**What is new in every plan (v1.2):** the stairway is sized to the chosen minutes first (D-67) - when the full starts do not fit, the
starts are lowered so that every week can still climb, and the plan says so before week 1 ("Before you start": the warnings, then the
schedule options - keep the minutes with lower starts (chosen), longer sessions, one more day). Sets are added to the main days in the
VOL-07 order (the work lift first), the placed weekly rise is at most max(1 set, 7 %) per muscle and 7 % in total, and no week is a
"hold" without a check-in. Glutes and side delts are targets for every client (R2-VOL-06; only the arms of competitive field athletes
stay credit-only, D-03 revised). The sport profile's weekly athletic budget is dosed, not just reported (D-73).

---

**01 - Swimming (EN).** A 16-year-old high-school swimmer (middle distance, freestyle), 2 years of training, 3 gym days x 60 min (Mon /
Wed / Fri), full gym without bumper plates, 16 weeks to the season. `swimming_middle` profile + youth overlay, level L2, `athletic.3`
(OT11 "Athletic Off-Season"). The 60-minute days cannot hold the field-athlete starts, so the starts were sized to the minutes
(quads 10 -> 11, hamstrings 9, chest 6 -> 7, back 10, glutes 4 -> 7, rear delts 6 -> 12 own sets, calves 9). Main sets wk1 -> wk12:
quads 10 -> 11, hamstrings 9 -> 9.25, glutes 4.25 -> 5.5, chest 6 -> 7, back 10, rear delts 5 -> 8; total 50 -> 56 (largest weekly rise
2 %). Days run 61-66 min (limit 66). Shoulder care: no upright rows or standing overhead presses (swimmer's-shoulder hotspots), arm
care twice a week, prehab credits rear delts, pulls outnumber presses. Olympic one light station a day at 2 sets inside the 4.5-7.5
budget (hang power clean Mon, single-arm DB snatch Wed, mid-hang clean pull Fri). Athletic week 1: 32 jump contacts, 50 low-amplitude
ankle contacts, 36 throws against 37 / 51 / 35; no depth jumps, bounds or hurdle hops; plyo stage RC1 -> RC3 with landings only in
RC1. Mobility warm-up (not sprint drills). Tests are their own items: week 1 3-or-5-rep max (hex-bar squat, deadlift, DB floor press) +
a countermovement jump (a minor's baseline is never a 1RM); week 12 the same lifts (3RM or work up to 1RM) and jump. Named up front:
floor misses (hamstrings, glutes, chest, side delts, calves), lowered starts, offers of 80-min sessions or a 4th day.

**02 - Football (EN).** A 20-year-old college linebacker (`football_big_skill`), 3 years of lifting, 4 days x 90 min + optional Wed /
Sat, full gym with platforms, bumpers, hurdles and turf. Level L3, `athletic.4` (OT11). Main sets wk1 -> wk12: quads 14 -> 18,
hamstrings 14.5 -> 17.5, glutes 6.5 -> 8, chest 10 -> 12, back 10 -> 13, rear delts 7 -> 11, calves 12 -> 16; total 75 -> 95 (largest
weekly rise 4.9 %) - the stairway climbs from week 1 (it was flat to week 9). Loaded presses (barbell bench, incline bench, strict
press); a bench test instead of a dip test; work lifts at 3 sets. Speed work sits before lifting (max-velocity sprints and COD
first), the buy-out is a conditioning finisher only. Athletic week 1: COD 80 / 80 cuts, 50 low contacts, 240 / 300 m of sprints,
72 / 70 throws, 8 Olympic sets (clean & jerk, power snatch, squat clean, squat snatch at 2 sets, 3-5 reps). Exercise rep ceilings:
Nordics 5-8, weighted pull-ups 5-8. Tests: the same lifts and drills in weeks 1 and 12 (front squat, bench, RDL; 10-30 m sprint,
5-10-5, CMJ) - a 3-year athlete tests for real. Days run 87-102 min (Tue +15 min Blue aerobic) for 90; Monday / Tuesday carry
`warning.long_day`, offers 100-min sessions or a 5th day.

**03 - Soccer (ES).** A 22-year-old semi-pro midfielder, 2 years of lifting, 3 days x 75 min, full gym + field kit, season in 10 weeks:
a 6-week off-season stairway + the first 2 pre-season weeks (`warning.v6_season`), `athletic.3`, level L2. Main sets wk1 -> wk6:
quads 10 -> 12, hamstrings 10 -> 13.25, glutes 4 -> 6, chest 10 -> 12, back 10 -> 11, calves 10 -> 11; total 59 -> 69 (largest rise
6.2 %); pre-season about 60 % with the work and paired lifts kept at 2 sets. Soccer speed work is in the plan now: 96 / 120 cuts and
240 -> 400 m of sprints a week with max-velocity work weekly; jumps progress from landings (RC1) to reactive work. Olympic on the
profile's 2 exposures (mid-hang clean pull Mon, mid-hang snatch pull Wed, 2 sets). The non-axial hinge day uses a double-KB
deadlift. Monday runs 81-84 min for 75 (`warning.long_day`); the Orange session moves to a separate session on a full day. Tests:
speed / agility and jumps in weeks 1 and 6, same drills. Still open (REVIEW_LOG): the bilateral share stays near 50 % against the
20 % target (V28 warns), the rep phase does not yet follow the season phase.

**04 - CrossFit-style bootcamp (EN).** A 35-year-old CrossFit-class member who wants to stay athletic and active, 2 years, 4 days x 60
min + a WOD-only Saturday, box kit. Class-model template `hybrid_crossfit.4` / `crossfit_style_bootcamp` (OTCFB): Squat + clean
(Mon), Press (Tue), Deadlift + push + snatch (Thu), Pull + push press (Fri). On over-time days skill practice folds into the warm-up
and the WOD holds 10 -> 15 min before any group leaves a day (D-78); the work lifts follow the HALF TIME class levels (3 x 7 -> 3 x 4)
with strength rest. Main sets wk1 -> wk8: back 9 -> 10, rear delts 6 -> 7, biceps 4.25 -> 4.5, the legs and chest hold at 5-6; total
44 -> 46. The 60-minute class cannot hold 10 sets a muscle, and the plan says so up front (floor misses named, offer of a 5th day).
Pull >= 0.8 x push (V29), Olympic 6 sets a week (clean pull Mon, snatch pull Thu, class power table), every WOD station has reps or
calories for its format. The cardio test is on the aerobic day (same protocol at both ends). Days run 47-68 min (Mon warned).

**05 - Bootcamp (ES).** A 42-year-old general-population client, 1 year of training, 3 circuit days x 45 min, outdoor kit + DBs + KBs
(no barbell, no machines). `fat_loss_bootcamp.3` (OT06): two circuits a day, 3 rounds, 15 s transitions, 90 s between rounds. The
circuit now climbs every week by the planned steps: work 35 36 37 38 40 42 44 46 s (D-72; it used to jump in 5-s lumps). Each day
keeps a metabolic station; the second calf station and duplicate isolations are cut first. Circuits are no longer floor exempt: what
3 x 45 min cannot hold (glutes, side delts, biceps, triceps, calves) is named with the offer of a 4th day. Reported sets (a round =
1 set): 75 a week. No barbell-named records in a DB-only kit; equipment gaps shown by name (pull-up bar, TRX). Days run 42-50 min
(Wednesday reaches 50 and carries `warning.long_day`). Tests: body weight / measurements in weeks 1 and 8.

**06 - Full-body aesthetics (EN).** A 29-year-old, 3 years of training, 4 full-body days x 75 min + optional Wed / Sat, full gym,
priorities glutes and side delts. Level L3 (PROPOSED). `aesthetics.4` (OT01). The L3 starts (20-26 sets) cannot fit 75 minutes, so
the stairway was sized to the minutes: non-priority duplicate isolation groups (a second curl / pushdown day) left the week so the
priorities have room. Main sets wk1 -> wk12: side delts (priority) 11 -> 18, glutes (priority) 10.75, quads 14, hamstrings 12.5,
chest 8 -> 9, back 8, rear delts 8 -> 10, calves 12; total 89 -> 99. Days run 70-82 min (limit 82.5); the optional days hold their 2
Focus slots (hip thrust machine, reverse hyper / side raises). MAX only on the last small exercise once the plan is at 2 in the tank;
no Nordic as a filler; the non-axial hinge day uses a DB hinge. Header: "Muscle & physique" (not competitive NPC). Named up front:
floor misses (chest, back, biceps, triceps), lowered starts, offer of a 5th day. No tests (not ticked). Still open: the stance swap
toward bilateral lifts by block (V28 warns 0.58 vs 0.9).

**07 - Push / pull / legs (EN).** A 24-year-old, 4 years of training, 6 days x 75 min, priorities chest and back, heavier-compound
preference. `aesthetics.6` / `ppl_x2` (OT03). Main sets wk1 -> wk12: chest (priority) 16.5 -> 21.5, back (priority) 18 -> 21, quads
13 -> 14, hamstrings 12.75 -> 14, glutes 11.5 -> 13, biceps 12.5 -> 14.25, triceps 10 -> 11, side delts 5 -> 6, rear delts 8 -> 11,
calves 6; total 102 -> 118 (largest rise 4.4 %). Every day opens with a bilateral barbell work lift (incline bench, row, high-bar
squat, bench, row, RDL); tests and heavy work get 3-6 min rest; block changes never move to assisted dips or a machine. Days run
63-75 min. Tests: 3RM or work up to 1RM on the same three lifts in weeks 1 and 12 (4 years of training: not "from zero"). Named up front: side delts and calves under
10, lowered starts.

**08 - Pickleball, stay athletic and active (EN, bonus).** A 52-year-old recreational player (plays Wed / Sat / Sun), half a year of
lifting, mild right-knee pain worse with deep knee bends, 2 gym days x 45 min (Mon / Thu) + optional Friday, basic gym. Profile
`rec_pickleball` + 50+ overlay, level L1, `athletic.2` (OTACT "Stay Athletic & Active"). The sessions now fit: Monday 50 and
Thursday 43-49 min for the 45 picked (they ran ~80) - one athletic piece a day (rotational medball scoops Monday, low box jumps
Thursday), one light Olympic piece (mid-hang clean pull 2 x 3), the two core exercises alternate (one rotational / anti-rotation),
knee and Achilles care on both leg days (bent-knee soleus raise, tibialis raise), shoulder care on the optional day. Knee pain: step-ups
and machines, no deep squats or depth drops, the share shifted toward single-leg work. Main sets wk1 -> wk12: hamstrings 3 -> 4,
calves (profile priority) 9 -> 11, the leg extension / leg curl enter at 1 set and climb; total 20 -> 23; compounds 12-15 reps in
block 1, 8-12 after. The optional Friday (before two play days) holds upper-body / core work and the Orange session only. Named up
front, honestly: two 45-min days cannot hold 10 sets for glutes, chest, back, arms or side delts, rear delts climb by load, Monday
runs 50 min; the offer is a 3rd training day. No tests (not ticked).

---

## Questions for the coach (round 3), from reading these plans

1. **Minutes vs. volume.** The engine now keeps the client's minutes, lowers the starts so the stairway still climbs, names the muscles
   under 10 sets and offers longer sessions or one more day (01, 04, 05, 06, 08). Is that the right default, or should a stay-active
   client (08) get a 3rd day by default when 2 x 45 cannot hold the floor?
2. **Opposite-pattern pairing for athletes (UNI-06) vs. knee + pull / hip + push (ORD-06).** `athletic.3` pairs the squat day's
   single-leg slot with a pull; switching it to a single-leg hinge breaks the pairing. Which wins? (REVIEW_LOG R01-5.)
3. **Bilateral share by block.** Field athletes at 20 % bilateral and physique clients moving to 80-90 % bilateral need a stance swap
   at block boundaries; today the counted squat / deadlift keep the field plans near 50 %. Swap the counted lifts to split stance, or
   accept ~50 %?
4. **Athletic budgets** are now doses (D-73). Confirm the 04 weekly numbers are targets for the gym plan (e.g. soccer 120-160 cuts).
5. **Credit-only arms for competitive field athletes** (D-03 revised): keep, or target arms for athletes too (R3-VOL-01)?
6. **Spanish:** 861 machine-translated lines are listed in `model/i18n/es_review.json` for approval (plus the review's wording notes:
   "tirón" for Olympic pulls, "flexión de brazos" for push-ups).
