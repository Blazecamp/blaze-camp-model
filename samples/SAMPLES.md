# The 8 sample plans (engine 0.4.0, model 1.3.0, round 3) - what the engine decided and why

The coach's seven sample clients (R2-GEN-07) plus the pickleball "stay athletic and active" bonus, generated from the compiled model
(`model/` 1.3.0) by engine 0.4.0 with `node tools/generate-samples.mjs` after stage B4 (integration). Every plan has status `ok` and
**zero failing error checks** (V1-V29, H01-H22); V28 (bilateral share, a warning) still flags 01, 02, 03, 04, 06 and 07. Files:
`plans/<name>.json` (the full plan with every `why`), `plans/<name>.en.md`, and for the two Spanish clients also `plans/<name>.es.md`.
Intakes: `intakes/<name>.json`. Every issue found and fixed is in `REVIEW_LOG.md` (v0.4 stages B1 ... B4).

**What every plan is now (round 3).** The plan is built once, with the whole stairway visible ahead of time - no check-ins, no tracking,
nothing kept (R3-VOL-02, R3-VOL-04, R3-GEN-01). It opens with the use-at-your-own-risk line and the release link (EN / ES), then
"Before you start" and **"Your schedule"**: when the chosen days x minutes cannot hold the full plan (every group at 10+ sets, 2-4
exercises a group a day, a climbing stairway), the plan says so up front, offers one more day or longer sessions in numbers, keeps the
time by training fewer groups directly (big movers first; the sport's or the client's priority groups first) and every trained group
still climbs (R3-SES-02). Each day says which blocks can be switched off (athletic, core, joint care, cardio ...) and which supersets
save time; blocks carry stable ids. Effort drifts 3 in the tank -> 2 -> 1-2 -> 1 + one intensifier a day in the last week, always inside
1-3 RIR (R3-VOL-04). Tests are their own items (a work-up to one top set, then the planned sets) in the first and last week only.

How to read the numbers: weekly sets are counted the coach's way on the **FOCUS groups** (hips = glutes + hamstrings; shoulders = front +
side + rear delts; a set counts once for its group; helpers 1/4; dips 1/2 + 1/2; jumps, throws, sprints, swings and Olympic lifts never
count). "wk1 -> wkN" is the first and the last week of the first stairway, all days (main days carry the floor and the stairway; the
optional days hold their own Focus / bonus slots). Minutes are the engine's estimate (work + rest by rest class, supersets sharing the
rest); a day may run to minutes x 1.1 (`time_fit.fit_factor`), a test day longer (it says so).

---

### 01 - Swimming (EN)

**Who:** 16-year-old high-school swimmer (200 free / 100 fly, middle distance), 2 years of training, 145 lb, off-season dryland,
3 gym days x 60 min (Mon / Wed / Fri) + optional Saturday, full gym, 12 weeks to the season (2027-02-01), tests strength + jumps,
guardian release.

**Key decisions:** profile `swimming_middle` + youth overlay, level L2, `athletic.3` (OT11 "Athletic Off-Season"). R3-ATH-01 dryland
defaults: 0 extra cardio (the pool is the cardio), shoulder care every session at 1 set without bands (side-lying external rotation,
floor Y / T, KB face pull), Olympic work 3 days (hang power clean, single-arm DB snatch, mid-hang clean pull) climbing 6 -> 8 sets a
week, jumps mostly ballistic, Receive-Create stage 1 -> 2 -> 3 by exercise block. Work lifts: DB deadlift (Wed), hex-bar deadlift (Fri;
the strength test lift: a 3-or-5-rep max for a minor, never a 1RM from zero). Pulls outnumber presses (swimmer pull ratio).

**Weekly sets by group (wk1 -> wk12):** hips 12 -> 15 · back 12 -> 14 · shoulders 12 -> 16.25 · biceps 3 -> 3.5 · triceps 0.5 · quads,
chest, calves 0. Main-day total 28 -> 35 (largest weekly rise 3.1 %).

**Athletic budget (planned vs the profile's target):** week 1 - 14 jump contacts (+ 20 ankle contacts, 12 push-up contacts) vs 37,
36 throws vs 35, 6 Olympic sets vs 5; peak (week 11) - 16 jumps + 28 ankle vs 46 + 27, 40 throws vs 45, 8 Olympic sets vs 8; plyo share
33 % (target 25 %, the ankle work carries it). The plan says the sessions hold about 58 % of the sport's weekly jump contacts.

**Time fit:** 3 x 60 cannot hold the full plan (needs ~115 min). Main days 51-66 min (limit 66), supersets marked Mon / Wed / Fri; test
days in week 12 run 72 (Mon) and 78 min (Fri, deadlift work-up) and say so; the optional Saturday holds 21-26 min (seal row, hip
thrust, a side raise added late). Offers: a 4th day of about 80 min, or 115-min sessions.

**Not trained directly and why:** quads, chest, calves - time (no squat, no chest press is left: the plan says "not trained in this plan
because of time ... add a day or longer sessions to train them"); biceps, triceps - credit only (field athlete, R3-VOL-01).

### 02 - Football (EN)

**Who:** 20-year-old college linebacker (230 lb), 3 years of lifting, off-season after the bowl season, 4 days x 90 min (Mon / Tue /
Thu / Fri) + optional Wed / Sat, full gym + platform, bumpers, hurdles and field space, 12 weeks, tests strength + speed / agility +
jumps.

**Key decisions:** `football_big_skill`, level L3, `athletic.4` (OT11), cross pattern, field-athlete cap 12 + 2 core (hard). Work lifts:
front squat (Mon), rear-foot-on-wall RDL (Tue), split squat (Thu), stiff-leg deadlift (Fri); loaded presses (incline bench, bench,
strict press); Olympic every main day (power clean, squat snatch, power clean & jerk, power snatch) climbing 8 -> 12 sets. Speed and
change of direction before lifting, receiver-route drills only because this is football. Tests in weeks 1 and 12: front squat, bench,
RDL (a 3-year athlete tests for real), 10-30 m sprint and 5-10-5 on Monday, the jump test on Thursday (B4: no longer stacked on Monday).

**Weekly sets by group (wk1 -> wk12):** quads 18 -> 20 · hips 23.5 -> 28 · back 16 -> 18 · chest 10 -> 13 · shoulders 11.5 -> 16.25 ·
calves 18 -> 21 · biceps 4 -> 4.5 · triceps 8.5 -> 9.5. Main-day total 78 -> 96 (largest weekly rise 4.6 %).

**Athletic budget:** week 1 - 66 jump + 42 ankle contacts vs 105 + 60, 84 throws vs 70, 80 cuts vs 80, 120 m of sprints vs 300, 8 Olympic
sets vs 8; peak (week 11) - 90 jump (66 reactive) + 50 ankle vs 145 + 91, 108 throws vs 110, 96 cuts vs 100, 240 m vs 400, 12 Olympic sets
vs 12; plyo share 47 %. The plan says the sessions hold about 59 % of the sport's jump contacts.

**Time fit:** 4 x 90 cannot hold the full plan's peak (needs ~100 min): every group stays trained, hips and calves at a lower peak.
Main days 73-99 min (limit 99), optional days 52-62 min; test days: Monday 107 (week 1) and 125 min (week 12), Tuesday 102 (week 12), told.
Offers: a 5th day, or 100-min sessions.

**Not trained directly and why:** biceps, triceps - credit only (field athlete; the optional days still hold a Tate press and a
pushdown).

### 03 - Soccer (ES)

**Who:** 22-year-old semi-pro midfielder (165 lb), 2 years of lifting, 3 days x 75 min (Mon / Wed / Fri) + optional Saturday, full gym
+ field kit, season in 10 weeks (2026-12-21), 8-week plan, tests speed / agility + jumps, Spanish output.

**Key decisions:** `soccer`, level L2, `athletic.3`; the season shape is a 6-week off-season stairway + the first 2 pre-season weeks
(about 60 % of the sets, more speed and power; `warning.v6_season`); rep phase VOL2 (late off-season). Work lifts: flipped hex-bar
squat (Mon), single-KB deadlift (Wed), conventional deadlift (Fri); Olympic pulls (high-hang clean pull Mon, high-hang snatch pull Wed).
Two aerobic sessions (Tue / Thu, the client's own tools). Tests in weeks 1 and 6: 10-30 m sprint + 5-10-5 on Monday, the jump test on
Wednesday (B4).

**Weekly sets by group (wk1 -> wk6):** quads 11 -> 13 · hips 17.25 -> 19.75 · back 10 -> 11 · chest 10 -> 12 · shoulders 11 -> 12.25 ·
biceps 2.5 -> 2.75 · triceps 2 -> 2.25 · calves 0. Main-day total 50 -> 58 (largest weekly rise 5.5 %); pre-season weeks 7-8: 36 sets.

**Athletic budget:** week 1 - 10 reactive jumps + 46 ankle contacts vs 120 + 50, 10 throws vs 20, 54 cuts vs 120, 120 m vs 400, 4 Olympic
sets vs 2 (the profile's minimum dose on 2 exposures); peak (week 5) - 12 + 100 vs 160 + 111, 20 throws vs 40, 72 cuts vs 160, 200 m vs
600, 6 Olympic sets vs 6; plyo share 85 % (the ankle work carries it). The plan tells the client the sessions hold 41 % of the jump
contacts, 50 % of the throws, 45 % of the cuts and 33 % of the sprint metres.

**Time fit:** 3 x 75 cannot hold the full plan (needs ~100 min): quads, hips and back at a lower peak. Main days 57-81 min (limit 82.5),
optional Saturday 42-51 min; test Mondays 94 / 97 min, told. Offers: a 4th day, or 100-min sessions.

**Not trained directly and why:** calves - time (they still get compound credit); biceps, triceps - credit only (field athlete).

### 04 - CrossFit-style class (EN)

**Who:** 35-year-old CrossFit-style class member (170 lb) who wants to stay athletic and active, 2 years, 4 days x 60 min (Mon / Tue /
Thu / Fri) + a WOD-only Saturday, box kit (barbell + bumpers, KB, medball, slam ball, boxes, rings, rope, cardio machines), 8 weeks,
tests strength + cardio.

**Key decisions:** class model `hybrid_crossfit.4` / `crossfit_style_bootcamp` (OTCFB): each day is warm-up + skill, core, the class's
power piece, the strength lift, accessories, the WOD (held at 10 min on the lift days to make room; the WOD-only Saturday climbs
20 -> 30 min). **B4 (E-64, PROPOSED):** the
class's work lifts are never removed by the time check - Monday front squat + mid-hang clean pull, Tuesday high-incline strict press,
Thursday conventional deadlift + mid-hang snatch pull, Friday Yates row (titled "Pull day": the class's Olympic budget, 5-7 sets at 3 a
piece, keeps 2 of the 3 pieces). A group the time check does not train directly keeps its class lift at 3 sets, 7 -> 4 reps with more
weight (HALF TIME table). Tests in weeks 1 and 8: front squat, incline bench, deadlift (3RM or work up to 1RM) and the 1-mile run on the
aerobic Wednesday.

**Weekly sets by group (wk1 -> wk8):** back 12 -> 16 · chest 10 -> 13 · shoulders 6.5 -> 7.25 · hips 3.75 · quads 3 · biceps 3 -> 4 ·
triceps 2.25 -> 2.5 · calves 0. Main-day total 31 -> 38 (largest weekly rise 5.6 %).

**Athletic budget:** Olympic only - 6 sets a week (target 5 -> 7); no plyo budget (the WOD's jumps and ball work are not muscle sets).

**Time fit:** 4 x 60 cannot hold the full plan (needs ~115 min). Main days 49-66 min (limit 66), WOD-only Saturday 54-64 min; test days
67-76 min, told. Offer: a 5th day of about 75 min (longer sessions above 90 min are for competitive athletes).

**Not trained directly and why:** quads, hips, shoulders - their class lift stays (front squat, deadlift, strict press: 3 sets, heavier
by the week, no extra sets); biceps, calves - time (compound credit from rows / pull-ups and the WOD); triceps - no station on the main
days.

### 05 - Bootcamp (ES)

**Who:** 42-year-old general-population client (160 lb), 1 year of training, 3 circuit days x 45 min (Mon / Wed / Fri), outdoor kit +
dumbbells + kettlebells (no barbell, no machines), 8 weeks, test: body weight / measurements, Spanish output.

**Key decisions:** `fat_loss_bootcamp.3` (OT06): two circuits a day, 3 rounds, 15 s transitions, 90 s between rounds; the circuit climbs
by work seconds every week (35 -> 46 s) at the same stations; resistance stations follow the planned 3 -> 1 reps left at the bell. One
medball station a week (overhead throw) and a KB swing are the ballistic stations (never muscle sets); **B4:** the ball's throws share the
week's target (18 -> 39 a week; they used to start at 33). Three aerobic days (Tue / Thu / Sat) with the client's own tool.

**Weekly sets by group (wk1 -> wk8; a round = 1 set):** quads 12 · hips 12 · back 12 · chest 12 · shoulders 15 · calves 9 · biceps 3 ·
triceps 3.75 (sets stay, the work per station climbs 35 -> 46 s). Total 63 a week.

**Athletic budget:** throws 18 vs 20 (week 1) -> 39 vs 40 (week 7).

**Time fit:** 3 x 45 cannot hold every group (needs ~50 min). Circuit days 38-47 min (limit 49.5). Offers: a 4th day, or 50-min
sessions.

**Not trained directly and why:** biceps, triceps - time (they still get compound credit from rows and presses). Optional upgrade named
up front: a pull-up bar or a suspension trainer.

### 06 - Full-body aesthetics (EN)

**Who:** 29-year-old (150 lb), 3 years of training, 4 full-body days x 75 min (Mon / Tue / Thu / Fri) + optional Wed / Sat, full gym,
Focus muscles glutes and side delts (the shoulders line), 12 weeks, no tests.

**Key decisions:** `aesthetics.4` (OT01) A1 / B1 / A2 / B2, same pattern, level L3 (PROPOSED rule: 3+ years and 4+ days). Focus +2 on
glutes and shoulders; the first shoulder isolation opens the day (priority small muscle first). Work lifts: high-bar back squat, barbell
hip thrust (12 / 10 / 8 / 8 / 20 pyramid decided per block), leg press, hex-bar deadlift. MAX / MYO only in the last week (one MYO a day
on the last small-muscle or machine exercise). The optional days hold the Focus / bonus slots (reverse hyper, hip thrust machine,
pushdown and curl added late).

**Weekly sets by group (wk1 -> wk12):** quads 14 -> 18 · hips 26 -> 31.75 · back 11 -> 17 · chest 12 -> 18 · shoulders 23.25 -> 30.5 ·
biceps 12.75 -> 20.25 · triceps 11.75 -> 18.25 · calves 18 -> 20. Main-day total 103 -> 137 (largest weekly rise 5.3 %).

**Athletic budget:** none (aesthetics; medball only in the warm-up).

**Time fit:** every group trained directly; 4 x 75 holds a lower peak for every group but shoulders (needs ~100 min at the full plan's
peak). Main days 62-82 min (limit 82.5), optional days 49-67 min, supersets marked on the four main days. Offer: a 5th day of about
80 min.

**Not trained directly:** none.

### 07 - Push / pull / legs (EN)

**Who:** 24-year-old (195 lb), 4 years of training, 6 days x 75 min push / pull / legs twice, Focus chest and back, prefers heavier
powerlifting-style compounds, full gym, 12 weeks, tests strength.

**Key decisions:** `aesthetics.6` / `ppl_x2` (OT03), level L3. Every day opens with a bilateral barbell lift (incline bench, bent-over
row, front squat, bench, Yates row, hex-bar deadlift); two-arm presses all plan; tests (3RM or work up to 1RM) on the incline bench,
front squat and hex-bar deadlift in weeks 1 and 12. **B4 (E-77):** the time check's cuts now come off the most loaded day, so both Pull
days keep rows + pulldowns (Pull 1 takes the biceps pair, Pull 2 the rear delts) and both Push days hold 7 exercises (the second pull
day had lost its pulldowns, rear delts and biceps and ran 40 of 75 min).

**Weekly sets by group (wk1 -> wk12):** quads 13 -> 15 · hips 15.75 -> 18 · back 18 -> 21 · chest 16.5 -> 21 · shoulders 17 -> 23 ·
biceps 10.5 -> 13.25 · triceps 10 -> 12.25 · calves 7 -> 8. Main-day total 92 -> 113 (largest weekly rise 6.6 %).

**Athletic budget:** none.

**Time fit:** every group trained directly at a lower peak (6 x 75 needs ~110 min a day at the full plan's peak; no 7th day, and
sessions over 90 min are for competitive athletes). Days 62-75 min; test days in week 12 run 84-85 min, told. The only offer: keep
6 x 75 with a lower peak.

**Not trained directly:** none.

### 08 - Pickleball, stay athletic and active (EN, bonus)

**Who:** 52-year-old recreational pickleball player (180 lb), plays Wed / Sat / Sun, half a year of lifting, mild right-knee pain
worse with deep knee bends, 2 gym days x 45 min (Mon / Thu) + optional Friday, basic gym, 12 weeks, no tests.

**Key decisions:** profile `rec_pickleball` + 50+ racket rules (R3-ATH-02: knee-friendly strength, calf / Achilles care every leg day,
rotator-cuff work, low-impact jumps only), level L1, `athletic.2` (OTACT "Stay Athletic & Active"). Knee pain: no deep knee bends, hinge
work instead (rear-foot-on-wall RDL, alternating staggered DB deadlift, leg curls). One light Olympic piece (high-hang clean pull 2 x 3),
rotational medball scoops, low box jumps (stage 1) -> ankle hops, two core exercises a day. Joint care: soleus
raise (Mon), tibialis raise (Thu); **B4 (E-75):** the optional Friday now holds the rotator-cuff work (side-lying external rotation)
next to the racket-elbow wrist extension - before, the elbow care took every arm-care slot. Compounds 12-15 reps in block 1, 8-12 after.

**Weekly sets by group (wk1 -> wk12):** hips 10 -> 12 · calves 8 -> 9 · biceps 2 · triceps 2 (optional day) · quads, back, chest,
shoulders 0. Main-day total 16 -> 19.

**Athletic budget:** week 1 - 8 jump contacts vs 7 (+ 35 ankle contacts the stations cannot hold), 36 throws vs 51, 2 Olympic sets vs 4;
week 12 - 10 contacts vs 9, 40 throws vs 69, 2 Olympic sets vs 8 (the stay-active light piece). The plan says the sessions hold about
12 % of the sport's contacts (with ankle work) and 58 % of its throws.

**Time fit:** 2 x 45 cannot hold the full plan (needs ~105 min a session); main days 43-49 min (limit 49.5), supersets marked Mon / Thu;
the optional Friday runs about 60 min with its aerobic session (told: do the aerobic part at another time). Offer: a 3rd day of about
65 min.

**Not trained directly and why:** quads, back, chest, shoulders - time: the plan says "not trained in this plan because of time ... add a
day or longer sessions to train them" (B4: it used to claim they still get compound work, but no row or press is left); biceps, triceps -
no station on the main days (the optional day holds a curl and a kickback).

---

## Questions for the coach (from reading these plans, v0.4)

1. **Class lifts (04, E-64, PROPOSED).** A CrossFit-class group the time check does not train directly keeps the day's class lift (3 sets,
   heavier by the week, no extra sets) instead of losing the lift. Right, or should the class's squat / deadlift / press be fully trained
   groups below the floor?
2. **Short schedules lose whole groups (01, 08).** The swimmer at 3 x 60 trains hips, back and shoulders (no squat, no chest press); the
   pickleball player at 2 x 45 trains hips and calves (no row, no press). This follows your approved order (fewer groups, big movers first,
   sport priorities first). Should a stay-active or field plan always keep one squat, one push and one pull (below the floor), or push the
   extra day harder?
3. **30-minute sessions.** In the random sweep, 30-minute plans often hold no group at 10 sets (warm-up, core and the athletic / Olympic /
   WOD blocks fill the session). Offer 30 minutes only for circuits and aerobic plans?
4. **Test days run long** (02 Monday 107 / 125 min for 90 with the squat test, the sprint and the 5-10-5). Put the speed / agility tests on
   the optional day?
5. **Athletic budgets** stay below the sport's weekly numbers on short schedules (01, 03, 08: told as a %); confirm the 04 numbers are
   full-time targets.
6. **Spanish:** 843 machine-translated lines are listed in `model/i18n/es_review.json` for approval (all new B4 lines are PROPOSED too).
