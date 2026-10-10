# Review log - coach-eye reviews of the 8 sample plans (v0.4 fix round 2 / F3, F2 and F1, fix round 1 / F3, F2 and F1, stage B4, stage B3, stage B2, stage B1, then the v1.2 review round)

## v0.4 - fix round 2 / F3: exercise selection, dosing and the printed plan (engine 0.4.0, model 1.3.0, 2026-10-10)

Scope: the blockers and majors (and the cheap minors) of the second coach-eye reviews of the 8 sample plans (grades D ... B-) in the
selection, dosing and rendering area - which exercise fills a station, how it changes from block to block, reps / rest / effort /
load words, the aerobic sessions, and every line the plan prints. Decisions: `engine/DECISIONS.md` E-178 ... E-205. Code:
`engine/select.mjs` (**the second selection pass** on the stations the time check kept - `ctx.live` / `ctx.base` / `ctx.frozen`,
`SECOND_PASS`; `r2Score`: movement families, the base-pick bonus, the push-up band, loadable flips and Focus picks, the core plane
plan, the class press; `decideUpperLaterality`; the second hip as a leg curl; block changes on live stations with kept details and
the core backup; swaps by category / client filters / stems / skill family; the stand-in inside the first pick's profile; the
warm-up drill by exercise block; the aerobic ladder by the plan's blocks), `engine/dose.mjs` (the unilateral rep floor, rep floors
for back extensions, rep caps that step down by phase, the heavy-compound rest, MYO never on a bar, the implement note and the
week-1 tip by the week's effort, body-weight-moved lifts, the alternating circuit note, the joint-care label by exercise, aerobic
minutes and the mid-block rung, core holds by block), `engine/render.mjs` (dates and lists in words, the client's Focus picks and
their rows, the days-over line, the schedule's kept-exercise / no-direct-exercise / below-floor lines, instructions by family and
the cardio bridge, the adjust guide from the plan's switches, the stairway intro by the plan's own steps, the test-days line, the
block table by exercise block, the athletic line, day titles, the circuit over-time line, the English video search),
`engine/explain.mjs` (`listAnd`; the block-change and circuit week lines). Model data and words in
`tools/fixture/fix-r2-f3.mjs` (wired into `build-fixture.mjs`, `compile-model.mjs`, `tools/compile/i18n.mjs`). Minimal seams:
`engine/generate.mjs` (the second pass: fresh layouts per pass, `selectAll(base)`, the live stations, the frozen redo and the frozen
fallback run; the added slots' context), `engine/validate.mjs` (2 lines: the MYO check reads the new never-lists). Regression tests:
`tests/review-r2f3.test.mjs` (38 tests). Tests encoding the old behaviour updated (same names, each with a one-line reason):
`review-b3` (`R05-circuit-effort-drift`: an alternating station reads 'alternate sides every rep'; `R03-spanish-fixes`: a list of
days takes its 'y'; `R3-time-check-printed`: a kept exercise is named, the rest share the 'no direct exercise' line), `review-b4`
(`R08-not-trained-copy`: the kept exercise and its day), `review-f3` (`R07-effort-bridge`: the class model prints the CrossFit
sheet's own instruction lines; `R06-adjust-guide`: the edit line names the plan's own blocks; `R05-schedule-lists`: the calves line
says 'below 10' and why; `R08-intensifier-fallback`: 'Monday and Thursday'; `R05-circuit-intensifier`: the `{rir}` argument),
`review-r2f1` (`R07-test-dates`: the test days in words), `render` (instruction keys by family, the start date in words, `{rir}`).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/fixture/check-fixture.mjs` (0 errors, 0 warnings),
`node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning), `node tools/check-model.mjs` (0 errors, 0 warnings),
`node --test tests/` (**1035 tests, 1035 pass, 0 fail**), `node tools/generate-samples.mjs` (8 / 8 `ok`, zero failing error checks;
warn-checks: V28 on 01 as before the round, and on 03 - see open), `node tools/sweep.mjs 1500 --render` (1,578 intakes on the
fixture and on `model/`: all `ok`, **0 failing error checks**, 0 render problems in EN / ES; warn checks V28 on 386 / 381 plans
(493 / 486 before the round: the dial now reads the stations that train) and V29 on 492 / 492 (490 / 491); 56 plans train no
group directly and 502 / 503 non-test main days run past 125 % of the minutes in 60 plans (501 / 502 in 60 before)).

### Review issues fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R02-upper-share / R03 / R06 | major / minor / major | the upper-body two-arm share sat at 58-65 % against 20-30 % for the linebacker and the midfielder, at 53-58 % against 50 / 80 / 90 % for the physique client, and never moved | E-178 (second pass), E-179 (the upper dial; the day's first chest press stays two-arm): 02 40 / 36 / 33 %, 03 50 / 46 %, 06 55 / 77 / 90 % | `R02-upper-laterality-dial`, `R06-upper-dial-toward-two-arm` |
| R03-same-hinge-twice | major | Wednesday's two hips exercises were a kickstand DB deadlift and an alternating staggered DB deadlift | E-183 (the second is a seated leg curl), E-182 (the staggered family: 1 a day) | `R03-second-hip-is-not-the-same-hinge`, `R02-week-families` |
| R06-hip-thrust-work / R06-step-down / R07-step-down / R01-flip | major / minor / major / minor | a body-weight glute bridge and a sandbag hip thrust as an L3's Focus work; goblet and landmine squats while the hack squat sat unused; a single-KB deadlift, a standing cable press and a floor press as an L3's block changes; a squat with DBs hanging at the sides at 6-8 reps | E-181 (no step down, loadable flips, loaded Focus picks, an added exercise keeps its lift) | `R06-focus-picks-are-loaded`, `R07-no-step-down`, `R01-no-load-limited-flip` |
| R08-core / R01-core / R02-core | major / minor / minor | leg raises, crunches and reverse crunches for a court player with the rotational low-back hot spot; one transverse pick of six for a swimmer; an L-sit hold opening a 230-lb athlete's day, two side holds as a pair | E-184 | `R08-core-for-a-court-back`, `R01-core-planes-and-holds`, `R02-core-opener` |
| R08-no-change / R02 / R04 / R06 / R07 | major / minor | 'one small change on some exercises' in weeks where a day changed nothing; details that flipped back or were dropped at the block change | E-186 (a change on every main day among live stations; kept or new details; the core backup), E-203 (the line counts what changes) | `R02-something-changes-each-block`, `R05-push-up-band-and-calves`, `R08-recreational-copy` |
| R08-swaps / R01-swaps / R03-swaps / R04-swaps | major / minor | swap lists crossed categories and the client's filters | E-185 | `R01-swaps-stay-in-the-category`, `R04-skill-swaps-in-family` |
| R01-kept-press | major | 'they still get work from your compound lifts' for a chest whose only work is one kept press | E-196 | `R01-kept-press-named` |
| R03-aerobic | major | entry-level run-walks for a semi-pro for 8 weeks; the pre-season block started the ladder over | E-194 | `R03-aerobic-ladder` |
| R06-focus-line | major | 'Focus muscles: Glutes, Side delts, Rear delts'; no table row for a Focus muscle | E-197 | `R06-focus-line-and-rows` |
| R02-test-dates / R03 / R04 / R05 / R07 | major (the dates: F1, E-147) | the line printed machine dates with no weekday | E-198 (test days by week and weekday, dates in words) | `R03-spanish-neutral`, `review-r2f1` `R07-test-dates` |
| R02-week-duplicates / R07-pulldowns / R06 | minor | seesaw + alternating DB overhead press, weighted + strict pull-up in one week; two cable pulldowns on a pull day; overhead triceps twice a day | E-182 | `R02-week-families`, `R07-one-pulldown-a-day` |
| R02-unilateral-reps | minor | single-leg and single-arm lifts at 6-8 per side at 1 RIR | E-190 | `R02-unilateral-rep-floor` |
| R02-rest | minor | a 6-8-rep bench rested 60-120 s | E-192 | `R02-heavy-compound-rest` |
| R02-myo | minor | a MYO set on a barbell calf raise | E-193 | `R02-myo-never-on-a-bar` |
| R02-implement | minor | a split squat and a step-up with no implement or loading word | E-187 | `R02-implement-note` |
| R02-days-over / R05 / R08 | minor | over-time days not named; 'some weeks still run a few minutes over' | E-198 | `R02-days-over-listed` |
| R01-reps | minor | a back extension at a 6-8 RM; a hex-bar deadlift at 7-10, 8-10, 6-8 | E-191 | `R01-back-extension-reps` |
| R01-swim-copy | minor | no pool lines, no easy week after the plan | E-201 | `R01-swim-lines` |
| R03-copy | minor | jumps and ankle hops as one number; 'replaces this week's top sets' over a sprint test; regional Spanish, no 'y', long Spanish video searches | E-198, E-202 | `R03-athletic-line-and-test-header`, `R03-spanish-neutral` |
| R04-press / R04-copy | minor | a seated high-incline press as the class's press; the BYOP instructions, '1 Reps', a weight tip on an inverted row, 'the main lift stays and climbs', 'WOD-only class' with a bike session | E-188, E-200, E-187, E-196, E-199 | `R04-class-press`, `R04-class-copy` |
| R05-push-ups / R05-copy / R05-es | major (part) / minor | an offset push-up next to a kneeling push-up; weight tips on body-weight stations, 'switch sides at half time' on an alternating lift, 'add a little load or reps' in a climbing circuit; capitalised weekdays, machine dates; the A-march every session | E-189, E-187, E-203, E-202, E-204 | `R05-push-up-band-and-calves`, `R05-bodyweight-copy`, `R05-circuit-week-line`, `R05-warm-up-drill-steps` |
| R06-title / R06-table / R06-copy / R07-copy | minor | a day title that changed while its lead lift stayed; 'A -> B' hiding a third block; '(PER-04)', 'No ranking:', 'program it on a push day'; an adjust line naming blocks the plan does not have; nothing on what the accessories carry; 'aerobic days' with none; calves under 10 with no reason | E-199, E-202, E-197, E-200, E-196 | `R06-day-title-and-block-table`, `R06-client-copy` |
| R08-copy | minor | 'your sport's weekly throws' for a recreational player; '(or a test day)' with no tests; a tibialis raise as Achilles care; 'Monday, Thursday' | E-198, E-187, E-202 | `R08-recreational-copy`, `R06-client-copy` |

### Sweep findings fixed on the way (the round's own changes; fixture unless noted)

| Intake | Finding | Fix |
|---|---|---|
| samples 01 / 04 (first design) | the round's selection rules in the one pass moved the time check: the swimmer lost her hips for chest, the class its hips | the two-pass design (E-178): the first pass is the baseline, the second holds each pick to its first pick's profile; test `R2F3-second-pass-keeps-the-time-check` |
| random 32, 286 | H21 `flat_second_half` after the upper dial turned stations one-arm | the plan is rebuilt with the first pass's lateralities when the flipped plan fails an error check (E-178); test `R2F3-sweep-random-32-flat-second-half` |
| random 69 / 104 / 204 | V13 / V23 / H18 on circuit plans: a stand-in station picked again changed its credit class between blocks | fallback picks copy the first pass's fill; a home-substitute or out-of-band push-up stand-in is picked again only inside its profile (E-178, E-189); test `R2F3-sweep-random-69-circuit-credit` |
| `review-b3` `R01-near-duplicates` | the core backup changed a core exercise into a version of the day's other one; a bent-over two-arm row next to the day's single-arm row | the changed core exercise and a re-picked stand-in are never a version of the day's other picks (E-186, E-178) |
| `review-f1` `R04-wod-room` | the second pass lost `why.wod_short`: the volume engine marks layout slots | every pass runs on fresh layouts (E-178) |
| stub pipeline (`generate.test`) | the stubs counted one fill per exercise block | the second pass runs only when `deps.SECOND_PASS === true` |

### The plans after fix round 2 / F3 (compiled model; against the plans before the round)

| Sample | Selection | Dosing and words |
|---|---|---|
| 01 swimming | the frozen path (the flips would cost the hips): picks as before; core Mon plank + anti-rotation march, Wed side plank + Copenhagen, Fri plank DB pull-through + hollow rocks | holds 20-40 / 25-45 / 30-50 s; back extension 10+ reps, hex-bar deadlift 8-10 / 7-9 / 6-8; 'Chest: ... keeps Standing Cable Chest Press on Wednesday'; swim lines; test days by weekday |
| 02 football | upper two-arm 65 / 64 / 58 % -> 40 / 36 / 33 %: single-arm DB and cable rows, half-kneeling landmine press, single-arm pulldown; the bench and incline bench lead their days two-arm; no L-sit opener | one-side lifts 8-10 per side in block 3; bench 2-3 min; split squat / step-up 'hold dumbbells'; no MYO on the barbell calf raise; main days 64-99 min (was 64-98), 6 non-test main days over 90 (was 3), all named up front |
| 03 soccer | Wednesday: kickstand DB deadlift + side lunge + seated leg curl; upper two-arm 63 / 62 % -> 50 / 46 %; weekly sets 52 -> 61 (was 52 -> 62) | Blue 20 s / 40 s then 30 / 30 from week 4, the pre-season keeps climbing; Orange 30 -> 40 min; neutral Spanish; test days in words |
| 04 CrossFit class | the standing strict press is the class press and the tested lift; a detail changes on the pull-up, the RDL and the chin-up in block 2; skill swaps in the family | the CrossFit sheet's instructions; '1 Rep'; no weight tip on the inverted row; 'WOD class + cardio'; A-march -> A-skip |
| 05 bootcamp | Friday: push-up + alternating DB floor press (was push-up + incline push-up); details kept at the block change | 'alternate sides every rep'; no weight tip on body-weight stations; 'keep your weights this week (the stations got longer)'; Spanish dates and weekdays |
| 06 aesthetics | upper two-arm 55 / 58 / 53 % -> 55 / 77 / 90 %; hack squat then pendulum squat for the turned lunge, 45-degree back extension for the DB deadlift; no body-weight bridge or sandbag thrust; 10 non-test main days over 75 min (was 14) | 'Focus muscles: Glutes, Side delts' with their table rows; one day title for 12 weeks; cues without rule ids |
| 07 push / pull / legs | no step down at the block changes (incline DB bench, hack squat, 45-degree back extension); Friday chin-up + single-arm pulldown | 'Focus muscles: Chest, Back'; the accessories note (biceps, calves); the cardio bridge line; calves 'below 10' with the rule |
| 08 pickleball | core: plank, bird-dog, side plank, plank with feet raises, side-plank knee-to-elbow; each day changes one thing each block | 'this plan's weekly ...'; tibialis raise = shins and ankles; no '(or a test day)'; 'Monday and Thursday' |

Trained groups and weekly sets are the same as before the round on 01, 02, 04, 05, 06, 07 and 08; 03 ends one set lower (61 against
62: chest 11 against 12).

### Open after fix round 2 / F3 (for the coach or another owner; E-205)

* **Library limits show in the picks.** Two non-thrust glute exercises (cable pull-through, reverse hyper): 06's Focus glutes still
  run three hip-thrust versions a week, two of them on the optional Wednesday after Tuesday's barbell hip thrust. One family of
  single-leg hinges (02 and 07 hold two a week, on different days). Three live calf records (02 repeats the standing DB raise).
  No vertical pull for a DB-only kit (05 keeps the table row). For the coach: add glute, single-leg hinge, calf and DB-pullover
  records?
* **A glute-dominant second hip exercise for athletes and circuits** (05, 08, 02) is built and off: a hip thrust gives the hips
  group's line a quarter set, so the time check dropped the hips. Needs the hips target counted on group credit (volume.mjs).
* **The day's first chest press stays two-arm** (the v0.3 review rule): 02 ends at 33 % two-arm against 20 %, 03 at 46 % against 15 %.
  For the coach: may an athlete's second press day lead with a one-arm or alternating press?
* **V28 still warns on 01 and now on 03.** 01 takes the frozen path; 03's leg curl no longer counts as a single-leg station (lower
  two-leg share 50 % against 20 %; its work lifts are fixed).
* **Minutes the time model does not count**: the one-arm upper stations (about 0.75 min a set; 02: 6 non-test main days over 90 min,
  was 3) and the 2-3 min rest of a heavy two-arm compound (about a minute a set in the last block).
* **Not built in this round** (other owners' files): the meet date and the dryland taper block (intake / shape); practice days as
  aerobic sessions and a third session for the class (intake D14); `planned_rir.intensifiers` true on the class's end-test week
  (shape); MYO sets spread over different groups and pull-up before pulldown (generate / week); at most 2 leg-extension stations a
  week, shoulder care / Nordic tables (week); supersets marked 'needed' on days that fit without them, schedule and holiday offers
  (volume / timefit); `summary.shortfalls`; the `...meaning-infer` record id; `samples/SAMPLES.md` written by the sample generator.
* **Words.** Every new sentence is PROPOSED; 45 Spanish strings wait in `es_review.priority_review` (the push-up, seal-row and
  landing names, the swim lines, the CrossFit instruction lines).

## v0.4 - fix round 2 / F2: athletic work (engine 0.4.0, model 1.3.0, 2026-10-10)

Scope: the blockers and majors (and the cheap minors) of the second coach-eye reviews of the 8 sample plans (grades D ... B-) in the
athletic area - jumps, ankle work, throws, sprints, COD, Olympic lifts, the plyo share, the WODs, the circuit's ball station and the
swimmer's shoulder care. Samples 06 and 07 had no athletic issue; their plans are unchanged but for `meta.athletic.mode: 'off'`.
Decisions: `engine/DECISIONS.md` E-160 ... E-177. Code: `engine/athletic.mjs` (`planAthletic` rewritten: two jump / ankle
families, one scale down the block, family spill, even steps, the set climb, the second ankle day, the share's block-end clamp and
balanced lowering, the pre-season hold, replaced stations, the end-test week's baseline dose, the class end-test week;
`ensureAthleticStations`: the warm-up ankle day, an upper-body plyo station as a jump station; `olympicVariantByDay`; `endTestHold`
for physical tests only), `engine/select.mjs` (athletic parts: sport-fit drills, first-block single-leg ballistic jumps, the
lateral quota, low-impact picks, no backward hops, the single-leg reactive cap, the throw change per block, COD tiers and the
reaction drill, the Olympic lift by the day's lift, WOD rotation, the ball station's plane), `engine/dose.mjs` (athletic parts: WOD
density, throws a round, the in-rest shoulder care note), `engine/budget.mjs` (`endTestHoldOf`). Model data in
`tools/fixture/fix-r2-f2.mjs` (wired into `build-fixture.mjs`, `compile-model.mjs`, `tools/compile/i18n.mjs`). Minimal seams:
`engine/generate.mjs` (the items and rooms handed to `planAthletic`; its set changes, minutes and plan fields; a replaced station
left out of the day; a kept prehab block; `meta.athletic.mode`), `engine/week.mjs` (a warm-up ankle day and a replaced station cost
no minutes; the test goes to the day that holds its station; the prehab time class), `engine/validate.mjs` (V27 `early_peak` /
`hold_over` and the new readings, V19 `day_lift`). Regression tests: `tests/review-r2f2.test.mjs` (32 tests). Tests encoding the
old behaviour updated (same names, each with a one-line reason): `review-b2` (the `athleticClimbs` helper counts a replaced
station; `R02-olympic-climb`, `R02-test-week-hold`: the end-test week runs the baseline dose on its tested days; `R02-sprint-focus`:
read between the tests), `review-f2` (`R01-ballistic-before-ankle`, `R02-second-sprint`, `R03-max-velocity`: the weeks between the
tests; `R03-share-held`: told from 85 % down; `F2-share-validator`: week 2), `review-v12` (`R02-5`: week 2 and one scale down the
block; `R03-1`: a replaced station counts as done), `select` (the Olympic family by the day's lift).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/fixture/check-fixture.mjs` (0 errors, 0 warnings),
`node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning), `node tools/check-model.mjs` (0 errors, 0 warnings),
`node --test tests/` (**997 tests, 997 pass, 0 fail**), `node tools/generate-samples.mjs` (8 / 8 `ok`, zero failing error checks;
warn-checks: V28 on 01, as before the round), `node tools/sweep.mjs 1500 --render` (1,578 intakes on the fixture and on `model/`: all `ok`, **0 failing error checks**, 0 render problems in EN / ES; warn checks V28 on 493 / 486 plans and V29 on 490 / 491; 56 plans train no group directly and 501 / 502 non-test main days run past 125 % of the minutes in 60 plans - the same counts as before the round on the fixture, see the open items).

### Review issues fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R01-flat-athletic / R02-flat-athletic | major | athletic families held one total through the hardest weeks (01: jumps 36 from week 7, ankle 20 from week 8; 02: cuts 72 from week 4 to 12, throws 90 from week 8) and V27 passed | E-160 (two families, one scale down the block, family spill), E-166 (even steps; V27 `early_peak`) | `R01-athletic-climbs-to-the-end`, `R02-cod-and-throws-climb`, `R02-v27-early-peak`, `R2F2-even-steps-unit` |
| R01-ankle-once | major | the swimmer's bone-loading ankle block ran once a week for 12 weeks | E-162 (a second day from exercise block 2, in the warm-up window: no strength group lost) | `R01-ankle-second-day` |
| R01-shoulder-care | major | shoulder care 'every session' was one easy set, less than a thrower's, and switchable | E-175 (2 sets inside the rests of the pulls, not a block to switch off) | `R01-shoulder-care-two-sets` |
| R01-untold / R08-untold | major / minor | jumps at about three quarters of the target, throws and ankle work under theirs, and nothing said so | E-160 (told from 85 % down, jumps and ankle apart) | `R01-capacity-told`, `R08-throws-step` |
| R01-clean-on-hinge-day / R03 | minor | a clean pull on the hex-bar deadlift day | E-176 (clean on the squat-pattern day, snatch on the hinge-pattern day) | `R01-olympic-by-day-lift` |
| R02-test-day / R03-test-day | major | the sprint, 5-10-5 and jump tests came on top of the full day (02 Thursday 96 / 106 min of 90; 03 Monday 94 of 75) | E-165 (a timed test takes its station's place; the test goes to the day that holds the station) | `R02-test-day-replaces-stations`, `R03-tests-replace-stations` |
| R02-end-test-conditions | major | the end test ran after 200 m of accelerations and 3 clean sets against 120 m and 2 sets at the baseline | E-165 (the tested days of the end-test week run the baseline week's athletic and Olympic dose) | `R02-end-test-baseline-dose` |
| R02-set-climb / R01 | major | 'let the station's sets climb' instead of holding at the top dose | E-161 (one more set where the day has the minutes - none at the sample lengths, see open) | `R02-set-climb` |
| R02-cod | major | two receiver routes as a linebacker's COD work for 12 weeks; no reaction drill for a reactive profile | E-171 (turn tiers by stage; the reaction drill from Land & Go) | `R02-cod-tiers-and-reaction` |
| R02-swim-jump / R03 | minor | a swimmer's streamline squat jump for a linebacker and a midfielder | E-167 (a drill written for other sports waits) | `R02-sport-fit-jumps` |
| R02-share / R02-single-leg | minor | 55 % plyometric against the approved 50 %; three single-leg reactive stations a week at 230 lb | E-163, E-170 | `R02-share-end-clamp` |
| R02-throws | minor | the same throw in two blocks; a 6-8 lb sit-up pass | E-171 (another throw per block; 8-10 lb) | `R02-throws-change-per-block` |
| R03-jumps | major | Wednesday's jump station was a push-up box jump; no single-leg or horizontal jump in the first block of a 60 % single-leg sport | E-167, E-168 | `R03-jump-stations-by-sport` |
| R03-preseason | major | the pre-season held less speed and power than the last off-season week (Olympic 6 -> 4 sets, 560 m against 600) | E-164; E-166 (the half-step tie: 600 m) | `R03-preseason-speed-and-power`, `R03-tests-replace-stations` |
| R04-wod | major | the same WOD for 8 weeks at 10 minutes; 21 / 22 / 23-minute EMOMs of 4 stations | E-173 (density, whole rounds, rotation at the block) | `R04-wod-climbs`, `R04-wod-changes-at-the-block` |
| R04-end-test | major | three heavy Olympic singles before the 1RM attempts | E-172 (no Olympic work in the class's end-test week) | `R04-end-test-no-olympic` |
| R05-ball-station | major | 13 'max-intent' overhead throws in a 50-s station; every throw sagittal; a weigh-in held the last week; `meta.athletic.enabled: false` | E-174 (6 -> 10 throws a round then rest; the plane changes with the block; only physical tests hold; `meta.athletic.mode`) | `R05-circuit-throws-by-the-round`, `R05-throw-plane-rotates` |
| R08-low-impact | major | a 52-year-old court player with knee pain: no lateral station until week 9, a backward hop drill, floor squat jumps from Land & Go, jump contacts falling through the hardest weeks | E-169, E-160 | `R08-lateral-low-impact` |
| R08-swaps | major | lunge / switch jumps and a hang clean with no stated catch offered as swaps to a knee-pain client | E-169 (`deep_knee_flexion` on 8 records) | `R08-swaps-low-impact` |
| R08-throws / R08-cue | minor | throws at 28 for ten weeks then a short top; a 'repeat 2-3 jumps' cue on a set of 7 | E-166 (even steps: 28 -> 32 -> 36 -> 40), E-169 (`note.ballistic_repeat`: runs of 2-3) | `R08-throws-step` |

### Sweep findings fixed on the way (the round's own changes; fixture unless noted)

| Intake | Finding | Fix |
|---|---|---|
| random 135 | `athletic_drop` (ankle): the next exercise block's drill has a smaller minimum dose under the share | a key the share moved is the share's doing (V27 reads `share_moved`); test `R2F2-sweep-random-135-share-drop` |
| random 136 | `share_over` after the never-drop pass brought a ballistic dose down | the share is held again after the backward pass (E-163); test `R2F2-sweep-random-136-share-after-the-no-drop-pass` |
| random 30 / 59 / 240 | `early_peak` on a throw station whose first block sits on its minimum dose | a run on minimum doses is no early peak (E-166); test `R2F2-sweep-random-30-floor-plateau` |
| random 153 | `hold_over` on a week with no targets | the rule needs targets (E-166) |
| random 520 / 1150 (1,500-intake sweep) | `under` (ankle 87 of a 150 goal): two ankle days of 3 x 25 next to the day's jumps under an 80-contact session | a key the session cap or the share's allowance trims asks for what the week plans, and the told line names the share (E-160); test `R2F2-sweep-random-520-session-cap` |
| random 677 / 817 / 1167 (1,500-intake sweep) | `hold_over` (throws): the circuit's ball station kept climbing in a week that holds for a physical end test | the hold week throws what the week before threw (E-174; `athletic_week.prev_stair_level`); test `R2F2-sweep-random-677-circuit-hold` |
| random 1004 (`model/`, 1,500-intake sweep) | `athletic_drop` (jumps 21 -> 18): the last block's squat jump could not rise because the ankle hops filled the session's contact cap | the day's ankle block gives a step back to the jumps (E-160); test `R2F2-sweep-random-1004-jumps-under-the-session-cap` |
| stub pipeline (`generate.test`), `plan-min.json` | V19 `day_lift` on items that declare no day; `capacity_not_told` on the old `contacts` warning | `day_lift` only where the item says its day; a `contacts` warning covers the jumps and the ankle work |

### Athletic work after fix round 2 / F2 (compiled model; week 1 -> peak week, planned (target); a replaced station counted)

| Sample | Jumps | Ankle | Throws | Cuts | Sprint m | Share at the peak (target) | Told up front |
|---|---|---|---|---|---|---|---|
| 01 swimming | 28 -> 36 (37 -> 49) | 6 -> 26 (8 -> 27), two days from block 2 | 36 -> 44 (35 -> 45) | - | - | 25 % (25) | jumps 73 % |
| 02 football | 81 -> 126 (105 -> 145) | 58 -> 72 (60 -> 91) | 57 -> 90 (70 -> 110) | 57 -> 72 (80 -> 100) | 220 -> 400 (300 -> 400) | 50 % (50) | ankle 79 %, throws 82 %, cuts 72 % |
| 03 soccer | 42 -> 56 (120 -> 160) | 38 -> 94 (50 -> 111) | 20 -> 40 (20 -> 40) | 54 -> 72 (120 -> 160) | 400 -> 600 (400 -> 600); pre-season 600 | 60 % (60) | jumps 35 %, ankle 85 %, cuts 45 % |
| 05 bootcamp | - | - | 18 -> 30 (20 -> 40), 6 -> 10 a round | - | - | - | - |
| 08 pickleball | 8 = 8 (7 -> 9), box jumps only | 24 -> 48 (35 -> 73), lateral from block 2 | 28 -> 40 (51 -> 69) | - | - | 50 % (50) | ankle 66 %, throws 58 % |

The strength side holds: against the plans before the round, 01, 02, 04, 06, 07 and 08 train the same groups with the same weekly
sets; 03 gains a quad set a week (the tests no longer sit on top of the day); 05 changes only the ball station's throw in block 2.
Test days: 02 Thursday 80 / 87 min of 90 (was 96 / 106), 03 Monday 69 / 79 of 75 (was 94). 04: Olympic 6 sets a week, 0 in week 8;
Saturday's EMOM 20 -> 24 -> 28 min in whole rounds of 4.

### Open after fix round 2 / F2 (for the coach or another owner)

* **The set climb adds nothing at the sample lengths** (E-161): the last block's days are full, so no athletic station takes its
  extra set in the 8 samples (it does at 4 x 105). The time check still ranks a jump station's set below an isolation's
  (volume.mjs) - for the coach: should a jump or throw set outrank a shoulder / arm isolation set when the minutes are short?
* **Field-sport jump volume** stays under the 04 targets (03: 35 %; 02: 87 %) and soccer's cuts at 45 %: told up front. More
  stations cost a strength group on a 75-minute day.
* **Not built in this round** (other owners' files): soccer's Nordic 2 x / Copenhagen progression table and neck / shoulder care
  for a contact sport (prehab tables, week.mjs); the swimmer's dryland taper and meet-date lines; shoulder care on an optional day
  that presses or rows; soccer's aerobic ladder; the weekly summary line printing jumps and ankle work apart (render.mjs);
  `level_of_play` as a same-pattern trigger (for the coach: does college count as 'high-level'?).
* **The low-impact pool is small** (08): the box-jump station keeps the lateral box step-up jump in blocks 2 and 3 - more
  low-impact lateral records, or is a repeat fine there?
* **The end-test week's ankle prep** runs at its minimum on a tested day (01 Friday: 1 x 6), as part of the baseline-dose rule.
* **Time-check fragility** (volume.mjs): of the 1,578 sweep plans, 3 changed their directly trained groups with this round's
  athletic minutes - the test's day, the ankle sets (two lost a group, one swapped shoulders for calves); the counts of plans
  training no group directly (56) and of days past 125 % (501 in 60 plans) are the same as before the round (fixture).
* **PROPOSED for the coach**: the 85 % told line; one extra athletic set and its caps; the second ankle day in the warm-up window;
  the COD turn tiers (INFERRED from the drill descriptions); 6 -> 10 throws a round at the circuit's ball station; about 30 % more
  WOD reps across a stairway held at 10 minutes; 2 sets of swimmer shoulder care inside the rests; no Olympic work in the class's
  end-test week; the baseline dose on the tested days of the end-test week.
* **`samples/SAMPLES.md`** is not regenerated by `generate-samples.mjs` and is stale after this round too.

## v0.4 - fix round 2 / F1: time, volume and structure (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the blockers and majors (and the cheap minors) of the second coach-eye reviews of the 8 sample plans (grades D ... B-) in the
time / volume / structure area. Decisions: `engine/DECISIONS.md` E-135 ... E-159 (D-81 item 1 retired). Code: `engine/volume.mjs`
(optional-day policy, relaxed footprint, optional Calves slot, keep order, stay-active room cuts, day patterns, main-day pattern
stations, the whole-set schedule, schedule offers, circuit donors, a Focus line under a time cut), `engine/timefit.mjs` (superset
rounds), `engine/shape.mjs` (circuit seconds by the approved steps), `engine/generate.mjs` (added slots picked with their day, real
test days, circuit sequencing, `toggle_items`, MYO outside a pair), `engine/validate.mjs` (H21 on the main days + `total_hold`, H03
circuits, V19 / V22 / V23 readings, MYO reading), `engine/intake.mjs` (`derived.r3_pending`); model data in
`tools/fixture/fix-r2-f1.mjs` (wired into `build-fixture.mjs`, `compile-model.mjs`, `tools/compile/i18n.mjs`). Minimal seams:
`engine/render.mjs` (test dates, a circuit's switchable station by name), `engine/dose.mjs` (the circuit 'work time grows' range).
Regression tests: `tests/review-r2f1.test.mjs` (30 tests). Tests encoding the old behaviour updated (same names unless noted):
`compile` (station counts), `review-f1` (pattern stations on main days, swimmer push weekly, below-floor exempt in the hold test,
`R05-circuit-top` = the approved steps, `R05-hinge-kept` = chest at its floor), `review-f3` (`R05-schedule-lists`, the Back row,
the laterality exemption for time-limited lower groups), `review-b3` / `review-b4` (class day titles, offers, calves line),
`review-r3`, `review-v12` (R04-6: snatch Tuesday, clean Friday), `shape` (circuit seconds), `volume`, `generate` (H21 rule list,
`toggle_items` key), `intake` (`r3_pending`), `invariants` (optional calves, pattern stations, circuit days, offer keys).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning),
`node tools/check-model.mjs` (0 errors, 0 warnings), `node --test tests/` (**965 tests, 965 pass, 0 fail**), `node tools/generate-samples.mjs` (8 / 8 `ok`, zero
failing error checks; warn-checks: V28 on 01 and 03), `node tools/sweep.mjs 1500 --render` (1,578 intakes on the fixture and on
`model/`: all `ok`, **0 failing error checks**, 0 render problems in EN / ES; warn checks V28 on ~490 plans and V29 on ~505; 56 plans
train no group directly - 30-minute plans and 30-45-minute class-model plans, which keep their class lifts - and 60 plans have
non-test main days past 125 % of the minutes; neither count was compared with the fix-round-1 sweep - see the open items).

### Review issues fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R01-main-days / R03-main-days | blocker | the big lines' whole climb sat on the optional Saturday; the main days held flat for 10 weeks and H21 passed | E-135, E-136 | `R01-climb-on-main-days`, `R01-main-total-climbs`, `R03-h21-reads-main-days` |
| R06-optional-days | major | 44 % of the added sets on the two optional days; lone big-muscle 'bonus' exercises there | E-135 (only a Focus line, inside the two Focus slots x 2-3 sets) | `R06-optional-focus-slots` |
| R04-back | blocker | the CrossFit class trained no back directly; Olympic work stacked on the squat and deadlift days | E-141, E-142 | `R04-class-split`, `R04-class-trains-back`, `R04-superset-rounds` |
| R08-patterns | blocker | 2 x 45: hips only; the knee day became a second hinge day; a throw, a clean pull and two jump stations kept while the squat and row were dropped | E-140, E-143, E-144, E-145 | `R08-day-patterns`, `R08-power-switchable` |
| R01-cross / R03-cross | major | `athletic.3`: the same pattern twice a day (squat + single-leg squat; hinge + single-leg hinge) | E-137 | `R01-cross-pattern` |
| R01-press | major | the swimmer's hip + push day had no press | E-145 (a press paired with the hinge as a pattern station) | `R01-hip-day-push` |
| R0x-ceiling | major | groups reached their ceiling weeks early and held it through the hardest weeks; flat runs; the last week smaller than the first half (02 / 03 / 04 / 06 / 07 / 08) | E-146 | `R04-ceiling-in-the-last-week`, `R03-steps-grow` |
| R0x-test-dates | major | the printed test dates were the retired reminder dates (01 / 02 / 03 / 04 / 05 / 07) | E-147 | `R07-test-dates` |
| R0x-offers | major / minor | one offer only; no middle session length; no block switch (01 / 04 / 06 / 07 / 08) | E-148 | `R08-power-switchable`; B3 / invariants offer tests |
| R03-calves | minor | calves on four days for a 3-day athlete; the optional calf slot counted nowhere | E-139 | `R03-calves-optional-slot` |
| R05-chest | major | chest held at 9 below the floor; Friday trained chest and shoulders with one station each | E-149, E-150 | `R05-chest-floor` |
| R05-power-order | major | the swing and the throw after a full strength circuit; same-group stations back to back | E-151 | `R05-ballistic-first` |
| R05-toggles | major | only 'core' could be switched off on a bootcamp day | E-152 | `R05-switchable-stations` |
| R05-work-time | minor | work seconds 35-36-38-40-42-44-47-50 off the approved steps; 47-min days in a 45-min session | E-153 (35 36 37 38 40 42 44 46 s; main days 41-45 min) | `R05-work-time-steps` |
| R07-focus-back | major | Focus back 18 -> 21, flat in the hardest weeks, below shoulders, level with biceps | E-154 (back 18 -> 25, biceps 12.5 -> 15.25) | `R07-focus-back-climbs` |
| R07-step-order | major | the pulldown and the weighted pull-up kept 2 sets for 12 weeks while curls reached 4 | E-154 | `R07-step-order` |
| R07-side-delts | major | four rear-delt flies a week; side delts 2 x 2 for 12 weeks | E-155 (volume / template part; the select part stays with F3) | `R07-side-raise-on-pull-day` |
| R06-arms | major | under a time cut the back trained less than the biceps all block | E-156 (back 12 -> 19, biceps main 15 -> 16.75) | `R06-big-movers-before-arms` |
| R01-myo / R02-myo | minor | the week-12 MYO in the middle of a superset | E-158 | `R01-myo-not-in-superset` |
| R08-r3-pending | minor | `meta.derived.r3_pending` listed approved answers | E-157 | `R08-r3-pending-derived` |

### Sweep findings fixed on the way (the round's own changes; fixture unless noted)

| Intake | Finding | Fix |
|---|---|---|
| random 292 | `flat_second_half` after the schedule's budget pass read the week-1 total of the lines, not the main-day total | the 7 % budget reads the placed main-day total; the over-budget pass repeats down the block (E-146) |
| random 381 | the stay-active cuts switched a power block off where no pattern was at stake | the time check runs without the cuts first and keeps them only when they save a work-lift pattern (E-143) |
| random BC3 plans | V23 on circuit days: Friday's lone chest / shoulder stations | Bootcamp 3 s09 is a chest press (E-150) |
| random 173 / 229 / 236 / 243 / 257 / 278 | H04: the circuit sequencer put a vertical pull / press before its horizontal partner | the sequencer keeps horizontal before vertical (E-151) |
| random 286 | `total_hold` 8 > 7 on a 3 x 75 class plan whose three groups each end with their one step in the last week | `total_hold` allows for the groups' final steps sharing the last week (E-136) |
| random 32 | `flat_second_half` (hips) when the laterality fallback applied to every line | the fallback applies to Focus lines only (E-154) |
| random 481 / 531 / 581 (1,500-intake sweep) | V23 / H18: a donor swap on `no_equipment.3` Bootcamp 3 left one chest and one shoulder station on its day | a day a swap touched never keeps a lone station (E-150); test `R2F1-sweep-random-481-circuit-lone-stations` |
| random 609 / 659 / 1114 / 1434 (1,500-intake sweep) | V23 / H18 on 6 x 30 and 6 x 45 circuit plans: a maintenance day kept one bench dip (its second triceps station had no pick); a recovery week brought back, at one round, stations the time check had taken out | outside the stairway a lone circuit station leaves its day; a recovery / taper week holds only the stations of the stairway before it (E-150); test `R2F1-sweep-random-609-lone-station-outside-the-stairway` |
| sport rugby (`model/`, 1,500-intake sweep) | `total_hold` 7 > 6: after a 2-set entry in week 9 the only real step left was pulled a week early and weeks 11-12 stood still | a line that ran ahead is not counted as next week's step; `total_hold` allows for a 2-set entry at an exercise-block start (E-146 / E-136); test `R2F1-sweep-sport-rugby-last-weeks-climb` |
| random 518 (1,500-intake sweep) | `flat_second_half`: a 2-set exercise opened at the second exercise block took the hamstrings to their ceiling in week 5 of 12 | an entry before the last exercise block stops a set under the ceiling (E-146); test `R2F1-sweep-random-518-entry-below-the-ceiling` |

### Sample plans after fix round 2 / F1 (compiled model; first stairway block)

| Sample | Trained directly | Not trained directly (why) | Main sets wk1 -> last (all days) | Non-test main days (min) |
|---|---|---|---|---|
| 01 swimming 3 x 60 | hips, back; quads below the floor on the squat day (work lift + partner, climbing) | chest (a press kept with the hinge), shoulders, calves (time); arms (credit only) | 27 -> 33 (31 -> 37) | 46-66 |
| 02 football 4 x 90 | quads, hips, back, chest, shoulders, calves | arms (credit only) | 68 -> 87 | 64-98 |
| 03 soccer 3 x 75 | quads, hips, back, chest, calves (the optional Calves slot) | shoulders (time); arms (credit only) | 49 -> 58 (51 -> 61) | 65-82 |
| 04 CrossFit-style class 4 x 60 | back (10 -> 12); quads, hips below the floor on their class lifts + a second exercise | shoulders (class lift); chest (a kept press), biceps, calves (time); triceps (no station) | 25 -> 29 | 50-62 |
| 05 bootcamp 3 x 45 | quads, hips, back, chest, shoulders (12 each), calves 9 | biceps, triceps (time) | 63 -> 63 (work 35 -> 46 s) | 41-45 |
| 06 aesthetics 4 x 75 | every group | - | 109 -> 141 (117 -> 163) | 61-82 |
| 07 push / pull / legs 6 x 75 | every group | - | 98 -> 130 | 59-75 |
| 08 pickleball 2 x 45 | calves (pinned, 7 -> 8); quads and hips below the floor on their work-lift days (knee + row, hinge + press) | back, chest (a kept row and press), shoulders (time); arms (no station); the power block switched off for the minutes (offered back) | 17 -> 21 (19 -> 23) | 44-49 |

### Open after fix round 2 / F1 (for the coach or another owner)

- **Laterality share on time-limited athlete plans** (01, 03: V28 warns): once the time check keeps each lower group on its
  work-lift day, the dial (select.mjs) has too few stations to move the two-leg / single-leg share to its target.
- **Pattern stations only** (04 chest; 08 back, chest): 2 fixed sets a week, no stairway - the minutes hold no more. 03 lost its
  direct shoulder work at 3 x 75 now that the climb sits on the main days (offers: a 4th day, or about 100 min).
- **Days a few minutes over** (06 up to 82 of 75; 01 / 03 / 04 / 08 by 2-5 min; test days more): the dosed day is longer than the
  time check's planning estimate; inside the `session.long_day` tolerance and warned. A second fit on the dosed minutes is not built.
- **Starts** (06 / 07): isolations start at the template's 3-4 sets (the review asks for 2 and compounds at 3); a Focus line can
  still start below its level start when the day's structure fills the minutes (07 back 18 vs 22); a side-delt Focus has no line of
  its own (it rides the shoulders line).
- **Calves on two leg days** (07: 7 -> 8, under the floor of 10, no optional day to carry a Calves slot): a 4th set from week 1, or
  an add-on offer?
- **Not built in this round**: the swimmer's joint-care dose and dryland taper (01); a test day replacing its sprint / jump
  stations, the Nordic / Copenhagen progression table (02 / 03, week.mjs); 1-set stations in the pre-season block (03); the class
  skill piece as its own switchable block (04); a holiday offer when the hardest weeks fall on Christmas / New Year (06 / 08);
  `level_of_play` as a same-pattern trigger (02 - for the coach: does college count as 'high-level'?); supersets 'needed' flags
  on days that still run over (08).
- **Very short plans** (sweep): 56 of 1,578 plans train no group directly (30-minute plans; class-model plans at 30-45 min, which
  keep their class lifts only) and 60 plans have non-test main days past 125 % of the minutes (the 30-minute plans of fix round 1's
  open list). The plan says so and offers more time; is a floor on the minutes per template wanted (e.g. no 30-minute class plan)?
- **`samples/SAMPLES.md`** is not regenerated by `generate-samples.mjs` and is stale for 01, 03, 04, 05, 07 and 08 after this round.
- **Another owner** (selection / dosing / render / athletic): everything listed under select.mjs, dose.mjs, render.mjs,
  explain.mjs and athletic.mjs in the reviews (upper-body laterality, block changes that step down, hip-thrust families, COD and
  plyo budgets, coach-only notes, ES wording).

## v0.4 - fix round 1 / F3: selection, dosing and the printed plan (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the blockers and majors (and the cheap minors) of the coach-eye reviews of the 8 sample plans in the selection, dosing and
rendering area - non-athletic picks (`engine/select.mjs`), non-athletic doses (`engine/dose.mjs`), the printed plan (`engine/render.mjs`,
`engine/explain.mjs`) and its words (EN / ES through the compiler). Decisions: `engine/DECISIONS.md` E-110 ... E-134. Model data in
`tools/fixture/fix-r1-f3.mjs` (wired into `build-fixture.mjs`, `compile-model.mjs`, `tools/compile/i18n.mjs`; `tools/check-model.mjs`
accepts the new `es_review.priority_review`). Minimal seams outside the area (explained in DECISIONS): `engine/generate.mjs` (the day's
last eligible intensifier item; a circuit station dosed with its day), `engine/validate.mjs` (V12 / V17 read 'the day's last eligible
item'), `engine/shape.mjs` (the late off-season step, switched off). Regression tests: `tests/review-f3.test.mjs` (40 tests). Tests encoding
the old behaviour updated (same names, each with a one-line reason): `render` (the halfway intro, the flat release stamp, the
no-intensifier effort line), `review-b3` (`R01-intensifiers-last-week`: the circuit hold and the days line; `R05-circuit-effort-drift`:
one rep singular; `R06-failed-check-words`: the V28 direction; `R3-time-check-printed`: 'through the block', the circuit variant, below-floor
groups on their own line, calves; `R3-block-toggles-printed`: accessories and the cool-down), `review-v12` (`R04-4`: the class table on
the class lifts only), `dose` (a one-arm Olympic lift per side).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning),
`node tools/check-model.mjs` (0 errors), `node --test tests/` (**935 tests, 935 pass, 0 fail, 0 todo**), `node tools/generate-samples.mjs`
(8 / 8 `ok`, zero failing error checks, **no V28 warning on any sample** - 02 / 03 / 06 / 07 had one), `node tools/sweep.mjs 1500 --render`
(1,578 intakes on the fixture and on `model/`: all `ok`, **0 failing error checks**, 0 render problems in EN / ES; warn checks V28 467 / 466
and V29 482 / 487 plans; 47 plans train no group directly; 515 / 516 non-test days over 125 % in 64 plans).

### Review issues fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R01-v28 / R02-v28 / R03-v28 / R04-v28 / R06-v28 / R07-v28 | major | the two-leg / single-leg share 25-40 points off target, and the note told the client to swap the wrong way | E-127 (the dial on every lower station, one way, counted lifts on dialled stations, Focus slots steer), E-113 (the advice by direction). Two-leg share before -> after: 02 49 -> 41 % (target 30 -> 20), 03 47 -> 31 % (20), 05 67 -> 50 % (50), 06 54/54/60 -> 56/76/92 % (50/80/90), 07 55/49/51 -> 55/78/87 % (50/80/90); V28 passes on all 8 | `R03-laterality-dial`, `R02-v28-direction` |
| R01-hinge | major | the swimmer's second hinge day a heavy DB deadlift, deadlift variants stacked | E-128: a 45-degree back extension on Wednesday; one two-legged deadlift a day | `R01-non-spinal-hinge` |
| R01-supersets / R02-overruns / R03-supersets / R04-skill-minutes (copy) / R06-overruns / R08-supersets | major / minor | 'Supersets marked today keep you inside N min' above 61-99 minute days | E-111 | `R01-supersets-promise-true`, `R01-supersets-warning-true` |
| R01-copy | minor | 'Hamstrings stays' next to '+1 set'; 'Optional day (optional)'; '(Focus)' with no Focus; the coach's '1 in the tank' with no bridge; toggles missing accessories; '-' rows missing; snatch without 'per side'; nested release stamp | E-122, E-114, E-119, E-112, E-117, E-123, E-115 | `R01-changes-by-group`, `R01-optional-tag-once`, `R08-focus-label`, `R07-effort-bridge`, `R07-toggles-every-block`, `R08-weekly-table-all-groups`, `R02-copy-fixes`, `R08-release-health-lines` |
| R01-core | minor | Russian twists, leg raises and V-ups as the low-back swimmer's opener | E-129: planks, Pallof / suitcase holds, dead bugs on the main days; sit-ups on the optional day only | `R01-low-back-core` |
| R01-test-copy | major (part) | 'replaces this week's top sets' and 'then do the planned sets below' on one test | E-123 (one instruction; F1's E-91 back-off sets) | `R01-test-one-line` |
| R02-v28-upper | major (part) | the lower body V28 | E-127 (lower); the upper-body dial / V28 for the upper body stays open | `R03-laterality-dial` |
| R02-copy | minor | toggles, rep-cap jargon, 'ceiling', 'Test:' label, the effort bridge | E-112, E-123, E-122, E-119 | `R02-copy-fixes`, `R01-changes-by-group` |
| R02-rest-reps | minor | 7-10 -> 8-12 -> 6-8 on capped lifts; 'rest after the pair' with no minutes | E-124, E-118 | `R02-rep-cap-every-block`, `R06-pair-rest-numbers` |
| R02-delts-dupes | minor | two reverse flies, no side raise; foot-position pull-up variants; a barbell calf raise on the non-axial day; sissy squats for an ACL-hot-spot linebacker | E-133, E-131, E-127 (hot-spot pick is weak) | `R06-side-delt-focus`, `R06-week-families`, `R02-hotspot-picks` |
| R03-adjust-guide / R06-adjust-guide | major | no 'How to adjust this plan' | E-120 | `R06-adjust-guide` |
| R03-pair-order / R06-pairs-across-blocks | minor / major (render part) | a pair's partner printed after the next pair, or in another block | E-118 (display order) | `R06-pair-rest-numbers` |
| R03-copy / R05-es | minor | ES 'apagar', 'presses', 'Kickstand RDL', 'bicicleta (bike)' in brackets, 'Final de fuera de temporada', 'Empujando', 'serie máxima' on a speed-test day, nested stamp | E-112, E-123, E-111, E-115; `es_review.priority_review` | `R07-toggles-every-block`, `R02-copy-fixes` |
| R04-yates-row | minor | a Yates row on the class strength table the day after the deadlift | E-126 (resistance table; an inverted row for the low-back hot spot) | `R04-class-lifts-table`, `R02-hotspot-picks` |
| R04-copy | minor | '(HALF TIME)', 'Reminders', the easy week, 'Flat DB Fly - on an incline bench', the no-intensifier copy | E-123, E-110, E-119 | `R02-copy-fixes`, `R04-detail-words`, `R05-circuit-intensifier` |
| R04-skill | minor | toes-to-bar practice on the squat day, double-unders on the deadlift day (his split: DUBS with the squat) | E-123 (the station's own word first) | `R04-skill-note` |
| R05-level | major | an advanced, high-skill sissy squat twice a week in a timed circuit; a renegade row; 'holding a plate at the chest' with no plate | E-130, E-110: the DB leg extension on a box (the real exercise again with a detail on Friday), a chest-supported row | `R05-level-hard`, `R04-detail-words` |
| R05-intensifier | major | week 8 promised intensifiers, no station carried one | E-119: a 10-s hold on one isolation station a day | `R05-circuit-intensifier` |
| R05-copy | minor | Friday '+ arms' with no arm exercise; calves '10+ ... climbing' at 9 flat; 'steps get a bit bigger' from week 3; '1 reps'; aerobic days not switchable | E-123, E-116, E-121, E-119, E-112 | `R02-copy-fixes`, `R05-schedule-lists`, `R05-phase-halfway`, `R07-toggles-every-block` |
| R05-table-row | minor | the same row on both bootcamp days | E-131 (a nearest-pattern stand-in the week does not hold first) | `R05-level-hard` |
| R06-rear-delts | major | four rear-delt flies, side delts the Focus | E-133 (one rear station a week, side raises in the Focus-first spot) | `R06-side-delt-focus` |
| R06-myo | minor | no MYO on Tue / Thu | E-119 (last eligible item) | `R08-intensifier-fallback` |
| R06-triceps | minor | three lying triceps extensions a week | E-131 (at most 2) | `R06-week-families` |
| R06-pairs | minor | unequal partners, 'rest after the pair' with no time | E-118 | `R06-pair-rest-numbers` |
| R07-focus | major (render part) | the plan never named the Focus muscles | E-114 (the header line) | `R07-focus-muscles-line` |
| R07-copy | major | 'climbs every week' (false), calves in the 10+ list, held lines next to '+1 set' | E-116, E-122 | `R08-climbing-truthful`, `R05-schedule-lists`, `R01-changes-by-group` |
| R07-powerlifting | minor | 6-8 on the first lift only; no back squat / conventional deadlift; the incline bench tested | E-131 (flat bench, high-bar back squat, sumo deadlift tested; 4-6) | `R07-powerlifting-canonical` |
| R07-small | minor | the day's work lift in a swap list; reminders; easy week; core superset once | E-131, E-123, E-119 | `R06-week-families`, `R02-copy-fixes`, `R07-core-superset-once` |
| R08-focus-labels | major | '(Focus)' curls and kickbacks for a client with no Focus muscle | E-114 (with F1's E-96) | `R08-focus-label` |
| R08-intensifier | major | week 12 MYO only on the optional day | E-119: seated / lying leg curl on Monday / Thursday | `R08-intensifier-fallback` |
| R08-climb-copy | major (copy part) | 'climbs every week' while flat | E-116, E-105 (F2) | `R08-climbing-truthful` |
| R08-copy-legal | minor | 'Glutes stays', calves 10+, '-' rows missing, 'Lots of play this week' every week, the bridge, the easy week; the stamp, no health-check line, no footer link | E-122, E-116, E-117, E-123, E-119, E-115 | `R01-changes-by-group`, `R08-weekly-table-all-groups`, `R08-heavy-play-once`, `R08-release-health-lines` |

### Sweep findings fixed on the way (the round's own changes; fixture)

| Intake | Check | Cause | Fix | Test |
|---|---|---|---|---|
| random-349 | V18 rear_delt_weekly | a glute pick next to a leg curl moved the time check, which then kept back and cut both rear stations | E-132 racket-only, then switched off | `F3-sweep-random-349-rear-with-rows` |
| random-350 | V15 / H10 total rise | a dialled station flipped two-legged -> single-leg in block 1 and back in block 2; its credits moved between lines at the boundary | E-127: the dial moves a station one way only | `F3-sweep-random-350-dial-one-way` |
| sport beach volleyball | H21 group_hold | the non-spinal hinge lean on every client changed the hips credits and the stairway held 9 weeks | E-128: the lean for low-back hot spots only | `F3-sweep-beach-volleyball-hinge-lean` |
| random 23 / 114, activity rec_ocr | V12 / V17 myo | the generator's eligibility let a machine compound take the MYO where the validator did not | the validator reads the matrix cell's `myo_if_last` like the dose | `F3-validator-myo-last-eligible` |
| sample 02 | R02-olympic-ceiling | the axial-high penalty hit Olympic lifts on non-axial days | E-131: resistance / isolation / Focus picks only | (review-f2) |
| sample 08 | R08-safe-picks | the low-back core lean promoted the Copenhagen plank for a knee-pain client | E-129: not for the rotational hot spot; the Copenhagen plank is not an anti-core hold | (review-b3) |

### Open after fix round 1 / F3 (for the coach or another owner)

* **The late off-season VOL3 step** (03 major, E-125): built and switched off - at the step the work lifts take their 3-6 min strength
  rest and the 3 x 75 soccer week loses chest and calves (62 -> 42 sets). Heavier reps or more groups: the coach's call.
* **The racket player's glute pick** (08 major, E-132): built and switched off - the single-leg glute bridge counts as an isolation in the
  time model and the hips stairway flattened. Needs the volume engine to treat a glute-dominant hinge like a compound.
* **Upper-body laterality** (02 major part): the dial and V28 read the lower body; the upper body (field athletes 80-90 % single-arm) is
  steered by the old +2 score only.
* **The football press test on the flat bench** (02 major part): the test placement (week / generate) and the select lock must move
  together; not done.
* **Schedule offers** (01 / 04 / 06 / 07 / 08): the smallest longer session that adds each group, 'use the optional day', a 'switch off a
  block saves N min' offer - the volume engine's.
* **Pairs across blocks** (06 major): the render prints a later block's partner next to its mate; forming pairs inside one block is
  week.mjs's.
* **The swimmer's dryland taper** (01 minor): needs an intake meet date.
* **Smaller**: aerobic minutes stepping weekly and a 'shuttle runs' note for a 10-20 m running space (05); a DB / KB pullover as the no-bar
  vertical pull (05); the soccer prehab table (Nordic 2 / Copenhagen 2-3 a week, 03); loaded pull-up before the pulldown (07); swap lists
  filtered for pain on athletic stations (08); the pickleball core plane mix (08); the block change on every main day (08).
* PROPOSED for the coach: every F3 weight, the 'How to adjust this plan' wording, the bridge line, the circuit hold intensifier, all new
  Spanish lines (`es_review.priority_review`); the health-check and release lines are LEGAL REVIEW.


## v0.4 - fix round 1 / F2: athletic work (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the blockers and majors (and the cheap minors) of the coach-eye reviews of the 8 sample plans in the athletic area - jumps,
throws, sprints, COD, Olympic lifts, the plyo share and the Receive-Create stages. Decisions: `engine/DECISIONS.md` E-97 ... E-109.
Code: `engine/athletic.mjs` (the share held per week, the never-drop backward pass, `ensureAthleticStations`, `pairAthleticBlock`,
stage cues, throw / COD / patterned-hop bounds, the Olympic ceiling helper, split capacity warnings), `engine/select.mjs` (athletic
parts: the reactive : ballistic station count, stage / direction / single-leg / ladder scoring, pick-ok records, the Olympic ceiling,
one-side throws, the main throw plane, reactive COD), `engine/dose.mjs` (athletic parts: throws 6-10, COD reps, full-intent circuit
ballistics); minimal seams: `engine/week.mjs` (the F2 tracks call, the Olympic trim before the tracks, the ankle block outside the
split / cap / one-station cut, priority groups last in the cap trim, the jump test next to the speed tests), `engine/generate.mjs`
(the stairway's ankle sets, a ballistic circuit station first), `engine/shape.mjs` (the pre-season's next stage), `engine/validate.mjs`
(V27 `share_over` and the split warnings, V13 ankle block, V19 Olympic ceiling). Model data in `tools/fixture/fix-r1-f2.mjs` (wired into
`build-fixture.mjs`, `compile-model.mjs`, `tools/compile/i18n.mjs`). Regression tests: `tests/review-f2.test.mjs` (28 tests). Tests
encoding the old behaviour updated (same names, each with a one-line reason): `dose` (the stage cues of a ballistic jump, a full-intent
circuit ballistic station), `review-b2` (`R03-preseason-stage-held`: the pre-season's next stage; `R3-split-and-bounds`: the sit-up pass
6-10), `review-r3` (`R02-athlete-cap`, `R03-athlete-cap`: the ankle block outside the 12 + 2), `review-v12` (`R02-11`: the add-on day
with the most room; `R02-17 / R08-6`: the printed share is the planned one week by week), `shape` (soccer D-10: the pre-season RC3).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning),
`node tools/check-model.mjs` (0 errors), `node --test tests/` (**895 tests, 895 pass, 0 fail, 0 todo**), `node tools/generate-samples.mjs`
(8 / 8 `ok`, zero failing error checks),
`node tools/sweep.mjs 1500 --render` (1,578 intakes on the fixture and on `model/`: all `ok`, **0 failing error checks**, 0 render
problems in EN / ES; 46 plans train no group directly and 516 non-test days run over 125 % in 62 plans - see the open items).

### Review issues fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R01-jumps-inverted | major | ballistic jumps (starts and turns) 14-16 of 37-46 contacts while the ankle block ran 20 against 8; Friday with no jump or throw; throws only rotational | E-97, E-98, E-101: Monday + Friday ballistic jumps (28 -> 36 of 37 -> 49), the ankle block sized to the share (6 -> 20), an overhead throw first (Wed) and a rotational one second (Fri; 34 -> 44 of 35 -> 45); share 9-21 % for 10 -> 25 % | `R01-ballistic-before-ankle`, `R01-friday-jump-throw`, `R01-share-held`, `R01-overhead-throw-first` |
| R01-rc-labels | major | the same box jump and cue in Land, Land & Go and Repeat; ankle hops started with the right-angle pattern | E-99: box jump stuck (RC1) -> streamline / squat / single-leg broad jumps land & go (RC2) -> repeated (RC3); ankle hops in place -> forward / backward -> single-leg | `R01-rc-stage-drills`, `R01-ankle-in-place-first` |
| R01-capacity-copy | major (part) | '58 % ... the work still climbs every week' hid the ballistic shortfall | E-105 (jumps and ankle work told apart; 'climbs every week' only when true); the swimmer now holds 74 % of its jump target, no warning | `R03-capacity-told-apart` |
| R02-sprint | major | 120-240 m a week, Monday only, against 300 -> 400 m | E-98, E-102: Monday + Thursday accelerations, 220 -> 400 m climbing weekly | `R02-second-sprint` |
| R02-athletic-ladder | minor | the 6-12 in box jump for 12 weeks, 3 x 20 sit-up passes, the plyo share starting at 22 % | E-99 (box -> depth / hurdle / floor jumps by stage), E-101 (sit-up pass 3 x 9-10, throws 69 -> 90), E-97 (share 30-55 % for 35 -> 50 %) | `R02-jump-ladder`, `R02-medball-dose` |
| R02-squat-snatch | minor | a full squat snatch for a 230-lb linebacker above the profile's ceiling | E-103 (power snatch) | `R02-olympic-ceiling` |
| R03-share | blocker | 85 % plyometric against 45 -> 60 %, no ballistic jump, no horizontal or single-leg jump | E-97, E-99: a ballistic jump every week (hex-bar jump squat, streamline / squat jumps), reactive hurdle hops, share 50-65 %; direction and single-leg quotas from the second block | `R03-share-held` |
| R03-max-velocity | major | 8 weeks of 10-20 m starts only | E-98, E-102: accelerations Wednesday + max velocity Friday every week (400 -> 560 m) | `R03-max-velocity` |
| R03-throw | major | one 1-set throw station on a one-side record dosed per side | E-101: the both-sides rotational chest pass, 2 sets, 20 -> 40 throws (target 20 -> 40); no sample picks a one-side record | `R03-throw-both-sides` |
| R03-cod-dose | minor | '5-10-5 2 x 9 cuts', 'L-drill 2 x 9 cuts', no reactive drill | E-104: L-drill 2 x 3-4 reps (3 cuts a rep), the split-step reaction drill weekly | `R03-cod-reps`, `R03-reactive-cod` |
| R03-stage | blocker (part) | RC2 for all 6 weeks, never RC3 | E-100: the pre-season after the single-block stairway is RC3 (Repeat) | `R03-preseason-repeat` |
| R05-power-last | major | the KB swing after two hamstring stations, the medball throw as the last station, dosed as a timed effort | E-106: the ballistic station opens its circuit with full intent | `R05-power-first-in-circuit` |
| R08-ankle-lateral | major | 0 low contacts every week; no lateral jump; the same low box jump and cue in every stage | E-98, E-99, E-108: the ankle track on Thursday every week (28 -> 50 of 35 -> 73, protected for a 45-min racket player), lateral / directional ankle hops from the second block, the box jump stuck in RC1 then floor jumps; share 39-50 % for 35 -> 50 % | `R08-ankle-track-kept`, `R08-jump-by-stage` |
| R08-flat | major (part) | the athletic work flat while its targets climb | E-97, E-105: ankle 28 -> 50, jumps 8 -> 10; the throw station holds its 2 x 20 cap from week 3 and the plan says so ('climbs across the block', 58 %) | `R03-capacity-told-apart` |

### Sweep findings fixed on the way (the round's own changes; fixture unless noted)

| Intake | Check | Cause | Fix | Test |
|---|---|---|---|---|
| random-59 (rec basketball, no medball) | V27 athletic_drop | the share counted throws the client cannot do, the stage-2 reactive stations came down hard | E-97: no throws in the kit -> share over the jumps; the share-aware never-drop | `F2-sweep-random-59-share-without-throws` |
| random-136 (rec pickleball, year plan) | V27 athletic_drop | the share cut the ankle block to one set in the new stage | E-97: the backward pass brings the earlier weeks down (an ankle set fewer) | `F2-sweep-random-136-ankle-set-cut` |
| random-170 (cycling, L2) | V19 olympic_every_week | the Olympic ceiling filtered the L1 KB squat clean | E-103: the ceiling binds the L2+ lifts only; the trim mirror and V19 read the same helper | `F2-sweep-random-170-olympic-ceiling-l1` |
| random-309 / 344 / 932 | V27 athletic_drop | a forced drill change in a plan with no Receive-Create stage | E-99: drills change only where the stage moves | `F2-sweep-random-309-no-stage-no-drill-change` |
| random-58, sports american football / basketball / beach volleyball | V13 athlete_cap | V13 counted the ankle block the layout leaves out | E-108 | `F2-sweep-random-58-ankle-cap` |
| random-661 | V27 share_over | the backward pass lowered a ballistic dose before cutting an ankle set | E-97: on a week over its share the ankle set goes first | (corpus) |

### Athletic work after fix round 1 / F2 (compiled model; week 1 -> peak week, planned (target))

| Sample | Jumps | Ankle | Throws | Cuts | Sprint m | Share | Told up front |
|---|---|---|---|---|---|---|---|
| 01 swimming | 28 -> 36 (37 -> 49) | 6 -> 20 (8 -> 27) | 34 -> 44 (35 -> 45) | - | - | 9-21 % (10 -> 25) | - |
| 02 football | 87 -> 117 (105 -> 145) | 68 -> 92 (60 -> 91) | 69 -> 90 (70 -> 110) | 66 -> 72 (80 -> 100) | 220 -> 400 (300 -> 400) | 30-55 % (35 -> 50) | - |
| 03 soccer | 24 -> 32 (120 -> 160) | 24 -> 82 (50 -> 111) | 20 -> 40 (20 -> 40) | 54 -> 72 (120 -> 160) | 400 -> 560 (400 -> 600) | 50-65 % (45 -> 60) | jumps 20 %, cuts 45 % |
| 08 pickleball | 8 -> 10 (7 -> 9) | 28 -> 50 (35 -> 73) | 36 -> 40 (51 -> 69) | - | - | 39-50 % (35 -> 50) | throws 58 % (climbs across the block) |

The strength work holds (the time check sees the new stations): 01 trains quads, hips, back (36 -> 50 sets), 02 and 03 every big
group, 08 hips - the same groups and totals within a set of the plans without the F2 rules.

### Open after fix round 1 / F2 (for the coach or another owner)

* Jump volume of the field sports stays well under the 04 targets where the minutes cannot hold more jump stations next to the
  sprints, COD and strength (03: 24 -> 32 of 120 -> 160, told up front). Raising a station to 3 sets, or one more jump station,
  costs a strength group on a 75-minute day - the coach's call.
* The swimmer's ankle block runs once a week (bone loading calls for 2-3): its 8 -> 27-contact target is too small for 2 days of a
  real dose; 2 days from a 40-contact peak (`bone_loading_min_peak`, PROPOSED).
* The end-test week holds the week before (E-29); RECHECK 03 asked for the test to replace a station instead - not changed.
* Stay-active Olympic pieces keep their fixed 2 x 3 (08's clean pull); bootcamp throws stay 18 -> 39 against 20 -> 40 (never over it,
  B4); a stay-active gen-pop plan's 'athletic enabled' flag (05) and HYROX finisher dosing untouched.
* 30-minute sessions (E-80): 46 of 1,578 corpus plans train no group directly (about 42 with the F2 rules off); 516 non-test days
  over 125 % in 62 plans (547 in 63 with them off).
* PROPOSED for the coach: the 5-point share tolerance, the station sizes and caps, the stage cue words ('stick it' / 'land and go' /
  'repeat'), the floor jumps as stage-2 / 3 picks, the 6-contact ankle set, the Olympic ceiling reading of the 04 text, COD cuts per rep.

## v0.4 - fix round 1 / F1: time, volume and structure (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the blockers and majors (and the cheap minors) of the coach-eye reviews of the 8 sample plans (grades C- ... D) in the time /
volume / structure area. Decisions: `engine/DECISIONS.md` E-81 ... E-96. Code: `engine/volume.mjs` (keep order, peak guard, structure
cut, one hips target, half-up release, added exercises, compound-first steps, calves, pattern stations, circuit donors, absolute
ceiling, main-day-total verification), `engine/week.mjs` (pairs, joint care, skill minutes, Olympic trim, class tests),
`engine/generate.mjs` (test = top set + back-off sets, block ids, leftover pairs, added compound order, Achilles care, r3_pending),
`engine/validate.mjs` (H21 hold rules, V13 absolute ceiling, V18 rows / untrained back, V14 / V17 test top set, H04 test of a work
lift), `engine/shape.mjs` (circuit seconds reach the top); model data in `tools/fixture/fix-r1-f1.mjs` (wired into `build-fixture.mjs`,
`compile-model.mjs`, `tools/compile/i18n.mjs`). Regression tests: `tests/review-f1.test.mjs` (36 tests). Tests encoding the old
behaviour updated (same names): `review-b4` (`R04-class-lifts-stay`, `R04-class-day-title`, `B4-sweep-random-396-circuit-no-work`),
`review-r3` (tests as top sets, every trained group climbs below the floor, V22 circuits), `review-v12` (placed rises skip
exercise-block starts; R01-1, R01-7, R01-8, R02-7, R02-9, R04-3, R06-3, R08-3), `shape` (circuit seconds), `volume` (start -> cap
table, credit-only), `validate` (V18 mutation), `invariants` (below-floor reasons, H21 need).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning),
`node --test tests/` (**867 tests, 867 pass, 0 fail, 0 todo**), `node tools/generate-samples.mjs` (8 / 8 `ok`, zero failing error checks),
`node tools/sweep.mjs 1500 --render` (1,578 intakes on the fixture and on `model/`: all `ok`, **0 failing error checks**, 0 render
problems in EN / ES).

### Review issues fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R01-quads | blocker | the time check kept the cheap shoulder isolation and dropped the swimmer's quads: 12 weeks with no squat, split squat or lunge | E-81, E-82 | `R01-swimmer-quads-kept` |
| R01-press | major | the swimmer's only press: 2 sets of a high-incline press; chest 'not trained' | E-94 (a DB floor press on the optional Saturday; chest stays not trained directly) | `R01-pattern-kept` |
| R01-flat | major | back flat for the last 6 weeks, hips flat weeks 4-8, the steps after halfway smaller than before | E-85, E-92 | `R07-groups-climb-through-block`, `R01-hold-rules-checked` |
| R01-wrong-steps | major | 1-set bonus exercises, new exercises mid-block (W4, W10), the main lifts never gain a set | E-86, E-87 | `R01-added-exercise-entry` |
| R01-test-on-top | major | the end-test work-up came on top of 3 x 6-8 at 1 RIR | E-91 | `R07-test-replaces-top-set` |
| R01-joint-care-credit | minor | easy face pulls / Y-T raises counted as hard shoulder sets | E-89 | `R01-prehab-no-credit` |
| R02-start-at-cap | major | quads 18 = level ceiling in week 1, back 16 > 13; each group could gain 2 sets in 12 weeks | E-83, E-85 | `R02-start-at-level`, `R02-week-2-steps` |
| R02-steps-to-isolations | major | the stairway's sets went to calf raises, Nordics and flies | E-87 (the coach's VOL-07 order: an isolation only catches up with the compounds) | `R01-added-exercise-entry`, `R02-week-2-steps` |
| R02-calves | major | 18 -> 21 calf sets on 6 days for a linebacker | E-88 | `R02-calves-cap` |
| R02-tests-on-top | major | tests added on top of the full session (Monday 125 min) | E-91 (Monday of the test week now 120 min with the speed tests) | `R07-test-replaces-top-set` |
| R02-rdl-test | major | a 3RM / 1RM on a stiff-leg RDL | E-91 | `R02-no-long-lever-max` |
| R03-hips | major | hips at 1.6-1.8 x every other group (glutes + hamstrings as two lines) | E-84 | `R03-hips-one-target` |
| R03-calves | major | calves dropped for time while Friday ran 8-15 min under | E-88 | `R03-calves-kept` |
| R03-olympic-title | major | Friday 'Olympic + strength' with no Olympic lift | E-96 | `R03-olympic-day-title` |
| R03-flat | major | back 10 / 10 / 10 / 11 / 11 / 11 and shoulders flat | E-85 (back 10 -> 12, shoulders 11 -> 13.5) | `R07-groups-climb-through-block` |
| R03-test-on-top | major | the week-6 tests replaced nothing | E-91 | `R07-test-replaces-top-set` |
| R03-block-ids | minor | Tuesday and Thursday aerobic days share one block id | E-90 | `R07-block-ids` |
| R03-bonus-1-set | minor | 1-set bonus / pre-season stations | E-86 | `R01-added-exercise-entry` |
| R04-class-groups | blocker | the class kept back and chest (accessories) and dropped quads, hips and shoulders | E-81 (quads + back trained, below the floor on their class lifts; hips, shoulders keep their class lifts; chest goes) | `R04-class-big-movers-first` |
| R04-skill-minutes | major | the warm-up skill ('6-10 min of quality practice') costed 0 minutes | E-96 | `R04-skill-costed` |
| R04-test-on-top | major | week 8: test, then the full planned sets at 1 RIR | E-91 | `R07-test-replaces-top-set` |
| R04-test-accessory | major | the Tuesday test on a 10-rep incline bench accessory after the press | E-91 | `R04-test-work-lift` |
| R04-bonus-1-set | minor | a 1-set inverted-row bonus for a big muscle | E-86 | `R01-added-exercise-entry` |
| R05-hinge-swapped | blocker | Wednesday 'hinge + presses' lost its hinge to an incline push-up '(bonus)' | E-93 | `R05-hinge-kept` |
| R05-rear-swap | major | Friday's side raise forced into a reverse fly '(bonus)' | E-93 | `R05-side-raise-kept` |
| R05-circuit-top | major | the circuit stopped at 46 of its 50-s top | E-93 (35 -> 50 s) | `R05-circuit-top` |
| R06-shoulders-30 | major | shoulders 30.5 sets (helpers), past the Focus ceiling of 30, validation passing | E-95 (30 at most; the line cap 27 with the optional day's side raises and helpers: open) | `R06-shoulders-absolute-cap` |
| R06-bonus-1-set | major | 1-set bonus glute bridge / machine bench / seal row / curls | E-86 | `R01-added-exercise-entry` |
| R06-bonus-last | major | the added seal row and machine bench press printed last, after flies and calf raises | E-87 | `R06-added-compound-order` |
| R06-optional-calves | minor | optional-day calf slots although 4 leg days give the 12 sets | E-88 | `R02-calves-cap` |
| R07-flat | blocker | hips 15.75 for 9 weeks, calves 7 for 11, quads 13 for 5 then 14 for 6; +1 set a week | E-85, E-86, E-92 (hips 15.75 -> 21.25, quads 13 -> 16, back 18 -> 21) | `R07-groups-climb-through-block`, `R02-week-2-steps` |
| R07-no-supersets | major | no superset recommendation on any of the 72 days | E-90 | `R07-supersets-recommended` |
| R07-test-on-top | major | the week-12 tests on top of the planned sets (84-85 min) | E-91 | `R07-test-replaces-top-set` |
| R07-block-ids | minor | 'blk.Push.core.1' on Monday and Thursday, 'blk.Legs 1.core.1' with a space | E-90 | `R07-block-ids` |
| R08-no-row-or-press | blocker | the 2 x 45 plan had no row or press at all | E-94 (a seal row on the optional Friday; quads, back, chest, shoulders stay not trained directly) | `R08-pattern-kept` |
| R08-arm-focus | major | Friday 'Incline Curl (Focus)' + 'Kickback (Focus)' 'to reach your weekly sets' for arms with no target | E-96 | `R08-no-arm-focus` |
| R08-cuff | major | rotator-cuff and elbow care only on the optional day | E-89 | `R08-cuff-main-day` |
| R08-two-calf | major | Monday: a machine calf raise + a soleus raise credited to calves | E-89 | `R08-one-calf-exercise`, `R01-prehab-no-credit` |
| R08-supersets | major | only the core pair recommended while Monday ran 49 min for 45 | E-90 (Monday 47 min, leg curl + external rotation pair) | `R07-supersets-recommended` |
| R08-r3-pending | minor | `meta.r3_pending` listed approved round-3 answers | E-96 | `R08-r3-pending` |

### Sweep findings fixed on the way (the round's own changes; fixture unless noted)

| Intakes | Check | Cause | Fix | Test |
|---|---|---|---|---|
| random 2, 5, 56 | H21 flat_second_half / group_hold | the ceiling (13) above what the peak allocation held (12 + a 2-set optional station) | E-92 | `F1-sweep-peak-reachable` |
| random 112 (both models) | H21 | optional-day entries charged to the main days' 7 % ceiling | E-86 | `F1-sweep-ceiling-counts-main-days` |
| sport water polo (4 x 30) | H21 total_flat | every step on the optional day's added rows | E-86 | `F1-sweep-main-total-climbs` |
| random 1290, sport ice hockey | H21 group_hold | a late entry 2 sets ahead of the stairway | E-86 | `F1-sweep-late-entry` |
| random 899 (both models) | H21 flat_second_half | back held at the absolute ceiling of 30 | E-95 | `F1-sweep-absolute-cap-hold` |
| random 454, 482, 587 (both models) | V12 / H04 | the class model's test on its vertical press read as a non-work vertical | E-91 | `F1-sweep-class-press-test` |
| random 349, 411, 761 (both models) | V18 rear_delt_weekly | no row left after the time check dropped back (the forced rear swap retired) | E-93 | `F1-sweep-rear-with-back` |

### Sample plans after fix round 1 (compiled model; first stairway block)

| Sample | Trained directly | Not trained directly (why) | Main sets wk1 -> last (all days) | Non-test days (min) |
|---|---|---|---|---|
| 01 swimming 3 x 60 | quads, hips, back | chest, shoulders, calves (time); arms (credit only) - a floor press kept on Saturday | 30 -> 33 (36 -> 51) | 49-66 |
| 02 football 4 x 90 | quads, hips, back, chest, shoulders, calves | arms (credit only) | 68 -> 87 | 57-99 |
| 03 soccer 3 x 75 | quads, hips, back, chest, shoulders, calves | arms (credit only) | 60 -> 67 (63 -> 76) | 73-80 |
| 04 CrossFit-style class 4 x 60 | quads, back (below the floor, class lifts heavier by the week) | hips, shoulders (class lift); chest, biceps, calves (time); triceps (no station) | 16 -> 19 | 46-66 |
| 05 bootcamp 3 x 45 | quads, hips, back, chest (below the floor: circuit time), shoulders, calves | biceps, triceps (time) | 63 -> 63 (work 35 -> 50 s) | 41-45 |
| 06 aesthetics 4 x 75 | every group | - | 115 -> 142 (123 -> 175) | 64-82 |
| 07 push / pull / legs 6 x 75 | every group | - | 98 -> 131 | 59-75 |
| 08 pickleball 2 x 45 | hips | quads, back, chest, shoulders, calves (time) - a seal row kept on Friday; arms (no station) | 10 -> 13 (12 -> 15) | 40-49 |

### Open after fix round 1 (for the coach or another owner)

- **Schedule offers** (01 / 04 / 06 / 07 / 08): the plan offers one more day (often with longer sessions) and 'longer sessions' only when the full plan fits the longest session offered. The reviewers ask for the smallest session length that adds each next group in keep order (08: 2 x 60 adds quads, 2 x 75 adds back) and a 'switch off a block saves N min' offer. Needs the time check re-run per candidate length - not done here.
- **Per-line caps with the optional day and helpers** (06 and ~100 sweep plans): the stairway lands each line on its cap on the main days + added exercises; the optional day's own template sets and the presses' / rows' helper credit can carry the weekly total past the cap (never past 30 now). Should the cap count every day and helper credit?
- **Calves for the 2 x 45 racket player** (08): with joint care no longer counted, the calves (one machine calf raise a leg day = 6 < 7) fail their floor and leave for time; the soleus / tibialis raises stay as joint care. Keep calves below the floor instead?
- **Late off-season reps** (03): the rep phase of a late off-season block starts at VOL2 (B3); PER-11 says VOL3 (6-8). Step to VOL3 at the halfway week, or start there?
- **Cross pattern on a full-body athletic day** (01 Monday 'jump + pull' with no lower lift): not built here (V11 / H06 do not check it).
- **The 30-minute plans** (~19 plans of 378): non-test days still pass 125 % of the minutes once the warm-up skill is costed (E-96).
- **Render** (render owner): the test-week header, `note.test_top_set_replaces` / `note.test_back_off` (new keys, EN / ES in `UI_F1`), the dose text of a skill folded into the warm-up, and the 'Focus' labels.

## v0.4 - stage B4: integration (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: run the whole pipeline from clean, sweep 1,500 random intakes + every sport + every activity on both models, fix the cross-stage
breakage, read the 8 regenerated plans end to end and fix the obvious nonsense. Decisions: `engine/DECISIONS.md` E-64 ... E-80. Code:
`engine/volume.mjs` (class lifts, lone stations, `added_fills`, day-aware room cuts, lowered peaks), `engine/budget.mjs` (in-season
Olympic), `engine/athletic.mjs` (the raise stops at the V27 limit), `engine/dose.mjs` + `engine/generate.mjs` (circuit throws, added-slot
fills, test-day warning), `engine/week.mjs` (Olympic trim keeps fillable stations, joint care round robin, jump test spread),
`engine/validate.mjs` (V18 / V19 / V22 / V23 / H21 readings), `engine/render.mjs` (class-lift line, 'not trained in this plan', class
day titles); model data in `tools/fixture/integrate-b4.mjs` (wired into `build-fixture.mjs`, `compile-model.mjs`,
`tools/compile/i18n.mjs`); new tool `tools/sweep.mjs`. Regression tests: `tests/review-b4.test.mjs` (22 tests; each fails on the
pre-B4 engine). Tests encoding the old behaviour updated (same names): `review-r3.test.mjs` (`floorsOrListed` accepts a kept class lift),
`review-b3.test.mjs` (`R08-safe-picks` - the racket shoulder's care shares the arm-care bucket; `R3-time-check-printed` - the 'time'
line is split by whether the group gets any credited set), `invariants.test.mjs` (H17 / H18 read the class-lift rule).

Verification (from clean): `node tools/fixture/build-fixture.mjs`, `node tools/fixture/check-fixture.mjs` (0 errors, the 2 old warnings),
`node tools/compile-model.mjs` (0 errors; the old X04 cross-check warning), `node tools/check-model.mjs` (0 errors, 2 warnings),
`node --test tests/` (**831 tests, 831 pass, 0 fail, 0 todo**), `node tools/generate-samples.mjs` (8 / 8 `ok`, zero failing error checks),
`node tools/sweep.mjs 1500 --render` (1,578 intakes on the fixture and on `model/`: all `ok`, **0 failing error checks** - 15 before B4
on each model -, 0 render problems in EN / ES).

### Sweep findings fixed (random intakes; index n of `tests/helpers/random-intake.mjs`)

| Intakes | Check | Cause (stage seam) | Fix | Test |
|---|---|---|---|---|
| 789, 803, 824, 971, 1223 | V27 throws (99 / 80 / 66 vs 20) | a medball press counted as throws; each ball station capped by the range's high end, not the week's target (B2 dose vs B2 targets) | E-65 | `B4-sweep-random-1223-medball-load-no-throws`, `B4-sweep-random-971-ball-stations-share-target`, `R05-circuit-throws-week-target` |
| 765, 793, 1024 | V27 Olympic sets (8 vs 2) | in-season game-heavy: the volume engine sized the Olympic sets from the range, the athletic budget targets 2 (B1 vs B2) | E-66 | `B4-sweep-random-765-in-season-olympic` |
| 412, 1322 | V19 | the validator counted a body-weight squat to calf raise as a possible jerk-station pick; select never does (B4 vs B3) | E-67 | `B4-sweep-random-412-v19-jerk-family` |
| 381 | V19 | the Olympic budget trim kept the clean nobody can do (knee pain) and dropped the DB snatch (week layout vs select) | E-68 | `B4-sweep-random-381-olympic-fillable-kept` |
| 412, 1386 | V23 / H18 | a shoulder station alone on a day when its partner got no candidate (select vs volume) | E-69 | `B4-sweep-random-1386-lone-station` |
| 676 | V14 / H08 | a circuit swap station counted as a floor press, printed as assisted dips at the block change (volume vs generate) | E-70 | `B4-sweep-random-676-added-fill-credits` |
| 318 (fixture) | V27 jumps (22 vs 9) | the athletic stairway's 'never drop' raise ignored the over-budget limit (B2) | E-71 | `B4-sweep-random-318-athletic-raise-limit` |
| 396 | H21 circuit_flat | a 3 x 30 body-weight circuit that holds no resistance station (B1 time check vs B4 validator) | E-72 | `B4-sweep-random-396-circuit-no-work` |
| 1042 | H21 total_flat | a 4 x 30 class with every group on its class lift (after E-64) | E-64 | `B4-sweep-random-13-class-lift-short-day` |

### Issues found reading the 8 plans, fixed

| ID | Severity | Issue | Fix | Test |
|---|---|---|---|---|
| R04-class-lifts | major | 'Squat + clean day' with no squat, 'Deadlift + push + snatch day' with no deadlift, 'Press day' with no press (the time check dropped quads, hips, shoulders and every station with them) | E-64 | `R04-class-lifts-stay`, `R04-class-lift-printed`, `B4-class-lift-validators`, `B4-sweep-random-1322-class-lifts-45-min`, `B4-sweep-random-13-class-lift-short-day` |
| R04-class-title | minor | 'Pull + push press day' with no push press (the class's Olympic budget keeps 2 of 3 pieces) | E-78 | `R04-class-day-title` |
| R04-lower-peak | minor | 'a lower peak for ... Triceps' next to 'your main days hold no exercise for them: Triceps' (also 08: biceps, triceps) | E-74 | `R04-lower-peak-trained-only` |
| R07-pull-days | major | the second Pull day lost its pulldowns, rear delts and biceps to the room cuts (40 of 75 min) while the first kept all of them | E-77 | `R07-pull-days-even` |
| R08-rotator-cuff | major | no rotator-cuff work for the 52-year-old racket player (COACH-R3 R3-ATH-02, approved) - the elbow care took every arm-care slot | E-75 | `R08-rotator-cuff-care` |
| R08-not-trained-copy | major | 'Back, Chest, Shoulders ... still get work from your compound lifts' with no row or press in the plan (01: quads, chest) | E-76 | `R08-not-trained-copy` |
| R01-test-week-day | minor | the end-test Friday (78 min with the deadlift work-up) told as 'the minimum work of that day does not fit' (closes the B3 open item) | E-73 | `R01-test-week-day` |
| R02-tests-stacked | minor | squat test + 10-30 m sprint + 5-10-5 + jump test on the end-test Monday (131 min for 90; now 125, the jump test on Thursday) | E-79 | `R02-tests-spread` |

### Sample plans after B4 (compiled model; main-day sets of the first -> last stairway week)

| Sample | Trained directly | Not trained directly (why) | Main sets wk1 -> last | Non-test days (min) | Changed in B4 |
|---|---|---|---|---|---|
| 01 swimming 3 x 60 | hips, back, shoulders | quads, chest, calves (time - no credited set: 'not trained in this plan'); arms (credit only) | 28 -> 35 | 51-66 | copy, test-day warning |
| 02 football 4 x 90 | quads, hips, back, chest, shoulders, calves | arms (credit only) | 78 -> 96 | 73-99 | jump test on Thursday (test Monday 113 / 125 min) |
| 03 soccer 3 x 75 | quads, hips, back, chest, shoulders | calves (time); arms (credit only) | 50 -> 58 | 57-81 | jump test on Wednesday (test Monday 94 / 97 min) |
| 04 CrossFit-style class 4 x 60 | back, chest | quads, hips, shoulders (class lift kept: front squat, deadlift, strict press 3 sets); biceps, calves (time); triceps (no station) | 31 -> 38 | 49-66 | class lifts, Friday title |
| 05 bootcamp 3 x 45 | quads, hips, back, chest, shoulders, calves | biceps, triceps (time) | 63 -> 63 (work 35 -> 46 s) | 38-47 | throws 18 -> 39 |
| 06 aesthetics 4 x 75 | every group | - | 103 -> 137 | 62-82 | - |
| 07 push / pull / legs 6 x 75 | every group | - | 92 -> 113 | 62-75 | the two Pull days even |
| 08 pickleball 2 x 45 | hips, calves | quads, back, chest, shoulders (time - not trained in this plan); arms (no station) | 16 -> 19 | 43-49 | rotator-cuff care, copy |

### Open after B4 (for the coach)

- **Class lifts** (E-64, PROPOSED): a CrossFit-class group the time check does not train directly keeps its class lift (3 sets, heavier by the week, no set stairway). Approve, or keep the class's lifts as fully trained groups below the floor?
- **Swimmer 3 x 60 (01)** trains hips, back and shoulders directly; quads and chest get no set (no squat or press left). **Pickleball 2 x 45 (08)** trains hips and calves; no row or press at all. The keep order follows the approved R3-SES-02 order with the sport's priority groups first; should a stay-active / field plan always keep one squat, one push and one pull (below the floor), or offer the 3rd day more strongly?
- **30-minute sessions** (sweep): 35 of 1,578 plans train no group directly and 56 plans run non-test days past 125 % of the minutes (warm-up, core and the athletic / Olympic / WOD blocks alone fill 30 min). Offer 30 min only for circuits / aerobic plans, or allow below-floor work there?
- **Room cuts from the most loaded day** (E-77, INFERRED) and **joint care round robin** (E-75, INFERRED).
- **Test-week days** stay long (02: 113 / 125 min for 90 on the speed-test Monday); the plan says so. Move the speed / agility tests to the optional day?

## v0.4 - stage B3: exercise selection, variation and rendering (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the selection, variation, dose and rendering issues of `samples/RECHECK_v0.3.md` (non-athletic picks, block-to-block changes, near-duplicates, lead lifts, effort words, aerobic sessions, tests, notes, Spanish) and the round-3 answers that touch the printed plan (`coach_answers_round3.md` R3-VOL-02 / R3-VOL-04 no check-ins and the effort drift, R3-SES-01 groups, R3-SES-02 time check / block switches / supersets, R3-GEN-01 use at your own risk). Code: `engine/select.mjs` (non-athletic picks), `engine/dose.mjs` (non-athletic doses), `engine/render.mjs`, `engine/explain.mjs`; model data in the amendment layer `tools/fixture/render-b3.mjs` (rules, catalog tags, EN / ES words), applied by both builds after `athletic-b2.mjs`. Minimal edits outside (explained in `engine/DECISIONS.md` E-46 ... E-63): `engine/intake.mjs` (`D8_kit.cardio_options` / `running_space`, additive), `engine/shape.mjs` (the athlete rep phase follows the season phase), `engine/generate.mjs` (`distinctDetails` takes concrete values and skips test items; `block_first_sets` and the aerobic fill reach the dose), `tools/fixture/build-fixture.mjs`, `tools/compile-model.mjs`, `tools/compile/i18n.mjs` (wiring of the B3 layer). Regression tests: `tests/review-b3.test.mjs` (35 tests, `R<sample>-<slug>` / `R3-<slug>`).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors), `node tools/check-model.mjs` (0 errors, the 2 old warnings), `node --test tests/` (809 tests, 809 pass, 0 fail, 0 `todo`), `node tools/generate-samples.mjs` (8 / 8 plans `ok`, zero failing error checks). The 378-intake random / sport / activity corpus passes every error check on the fixture and on `model/`.

### What changed (all samples)

- **Real block-to-block variations** (E-46): a block change takes a library alternative that differs in one detail (two at most) - 'Single-Arm DB/KB Row -> Single-Arm Cable Row', 'Lat Pulldown (Wide Grip) -> (Supinated Grip)' - or keeps the exercise with one concrete detail: 'Leg Extension (machine) - one leg at a time', 'Weighted Dip - dumbbell held between the feet', 'Flat DB Fly - on an incline bench', 'EZ-Bar Skullcrusher - lower to behind the head', 'Barbell Bench Press - 1-second pause at the bottom'. No '- different grip / implement / stance' anywhere (EN or ES), no A-B-A, no exercise swapping days, no Olympic-tagged lift as a strength change, no step down to a machine for a trained lifter, no home substitute from the real thing.
- **One exercise once a session** (E-47, E-48): no seated + bent-over DB reverse fly, no DB floor press + alternating DB floor press; a second weekly exposure the kit cannot vary comes back with a named detail.
- **Lead lifts** (E-49, E-50): the day's first chest press is a two-arm bench press when the kit holds one; powerlifting-style presses are two-arm all plan; the axial work lift is a front / high-bar back squat or a conventional / sumo / hex-bar deadlift (no 'Box Squat - any variation (Deload ...)', no Zercher, no max test on a stiff-leg deadlift); records that name no implement are swaps; L1 / 50+ / pain clients get no barbell lift.
- **Effort** (E-53, E-54, E-55): one intensifier per training day in the last week only (a MYO set on the last small-muscle / machine exercise; no MAX sets, never a glute bridge or calves for an Achilles hot spot); circuits follow the planned 3 -> 2 -> 1-2 -> 1 reps left at the bell; the pyramid never flips mid-block; a supersetted work lift keeps 3-6 min after the pair; fixed class reps meet the exercise's ceiling.
- **Rep phase by season** (E-56): the late off-season starts at VOL2 (soccer 8-12 instead of 12-15 for six weeks).
- **Aerobic sessions** (E-57): named by the client's own tool ('Green (B): moderate · bike — 20-30 min · 3 min hard / 3 min easy, repeat'), low-impact only for knee pain, by level and climbing one step per exercise block; a cardio test is written on the card.
- **The printed plan** (E-59 ... E-62): the use-at-your-own-risk line with the release link (EN / ES) tops every plan and view; 'Your schedule' says what is trained directly, what is not because of time, what comes through compound lifts, and the offers in numbers; each day says which blocks can be switched off and which supersets save time; macro tables for screenshots (`view: 'overview'`, the stairway table week · level · effort · sets, weekly sets per FOCUS group, the week at a glance, one table per day); tests read 'Test: countermovement jump'; failed checks in words; day titles from the day's own lifts; a Christmas / New Year notice; check-in words gone; Spanish fixes.

### Sample plans after the fixes (compiled model)

| Sample | Block changes (real / detail) | Lead chest press | Aerobic tools (colour: tool) | MYO sets (last week) |
|---|---|---|---|---|
| 01 swimming | 2 / 5 | - (no chest group: time check) | - (the pool is the cardio) | 3 (one a day) |
| 02 football | 2 / 24 | incline barbell bench, barbell bench | A: run, B: bike, C: run | 6 (4 main + 2 optional days) |
| 03 soccer | 2 / 4 | incline barbell bench, standing cable press | A: run, B: bike, C: run | 2 |
| 04 CrossFit-style class | 2 / 4 | incline barbell bench, incline DB bench | B: bike, C: rower | 3 |
| 05 bootcamp | 1 / 7 | (circuit stations) | A / B / C: run (the only tool) | 0 (timed stations) |
| 06 aesthetics | 6 / 34 | barbell bench, incline barbell bench | A: treadmill, B: bike, C: rower | 4 |
| 07 push-pull-legs | 7 / 14 | incline barbell bench, barbell bench (all presses two-arm) | A: treadmill, B: bike, C: rower | 5 |
| 08 pickleball 52 | 0 / 1 | - | C: bike (knee pain) | 1 |

### RECHECK_v0.3 issues fixed in stage B3

| ID | Severity | Issue (RECHECK_v0.3.md) | Status | Fix made | Test |
|---|---|---|---|---|---|
| R01-near-duplicates | major | Two near-identical rear-delt flies supersetted; DB floor press + alternating DB floor press on one day | Fixed | E-47 | `R01-near-duplicates` |
| R01-intensifiers | major | MYO from week 9, 10 items flagged in week 12, MYO on a barbell hip thrust | Fixed | E-53 | `R01-intensifiers-last-week` |
| R01-either-focus | minor | 'Hip Thrust or Glute Bridge (either) (Focus)' on a main day; leg extension '- different range (box / height / depth)' | Fixed | E-50, E-46; main-day extras carry the bonus tag | `R06-generic-records`, `R05-placeholder-details` |
| R01-assisted-pull-up | minor | Feet-supported pull-up for an L2 with a 'regress' note | Fixed | E-49 (assisted ids), dose note by kit | `R01-assisted-pull-up` |
| R01-render | minor | Aerobic-days line with no aerobic session; 'countermovement jump — countermovement jump'; a superset split by the reading order | Fixed | E-59 (sport cardio line, test items, pair tags [A1] [A2]) | `R01-test-items-render` |
| R01-holidays | minor | Hardest week and max tests on Christmas / New Year with no notice | Fixed (notice) | E-59 holiday notice; moving the day is the client's call | `R01-holiday-notice` |
| R02-effort-level | minor | 'Effort level 10 / 11' next to an RIR prescription | Fixed | E-60 'Week level: n of 11' | `R02-week-level-wording` |
| R02-pair-rest | minor | 'rest after the pair' with no partner; supersetted work lifts lose the strength rest | Fixed | E-55; no unpaired 'after the pair' left | `R02-pair-strength-rest` |
| R02-day-title | minor | 'A2 - leg press / belt squat + pull' with step-ups and lunges | Fixed | E-59 title from the day's lifts | `R02-day-title-from-picks` |
| R02-block-change | minor | Weighted pull-up -> close-grip pulldown for an L3; seated leg curl -> 'seated or lying' duplicate | Fixed | E-46, E-50 | `R07-block-change-one-detail` |
| R02-staggered-family | minor | Kickstand DB deadlift Monday + alternating staggered DB deadlift Tuesday; '(or a barbell)' on the DB cue | Fixed | E-47 (week penalty), E-62 | `R01-coach-voice-cues` |
| R02-home-subs | minor | Sissy squat / DB leg extension on a box / floor Y-T / body-weight calf raise in a college weight room | Fixed | E-48, E-51 | `R02-home-substitutes` |
| R02-test-names | minor | Raw duplicated test names; 'Reps capped' on a 3RM test | Fixed | E-59, E-55 | `R01-test-items-render` |
| R02-core-swaps | minor | Copenhagen plank swapped for toes-to-bar | Fixed | E-52 | `R02-core-swaps-plane` |
| R03-aerobic | major | Beginner run-walks for a semi-pro, '2 Mile Run', tools the client does not have | Fixed | E-57 | `R03-aerobic-modality` |
| R03-rep-phase | major | VOL1 12-15 reps for six late off-season weeks | Fixed | E-56 | `R03-rep-phase-season` |
| R03-reverse-fly-superset | major | Two reverse flies supersetted while side delts starve | Fixed | E-47 (the shoulders line is B1's) | `R01-near-duplicates` |
| R03-home-sub-calf | minor | Body-weight calf raise in a full gym | Fixed | E-51 | `R02-home-substitutes` |
| R03-v28-note | minor | '⚠ Two-leg / single-leg share follows the plan (V28, 1)' on a failed check | Fixed | E-59 `check.failed.V28` | `R06-failed-check-words` |
| R03-myo-coach-note | minor | 4 MYO sets in week 6; 'the client feels the right muscles' | Fixed | E-53, E-62 | `R01-intensifiers-last-week`, `R01-coach-voice-cues` |
| R03-block-change-days | minor | Exercises swap days at the block change | Fixed | E-46 | `R07-block-change-one-detail` |
| R03-spanish | minor | 'Jalón de cargada', 'salto + rodilla + jalón', 'Pájaros' | Fixed | E-61 | `R03-spanish-fixes` |
| R03-season-notice | minor | 'pre-season 2 weeks before the first game' | Fixed | E-61 | `R03-season-notice` |
| R03-test-rows | major (part) | Test-only row with dashes in the block table; raw test names | Fixed (render part) | E-59; the test-day minutes are B1's | `R01-test-items-render` |
| R04-weighted-pull-up | major | Weighted pull-up at the class model's fixed 10 reps | Fixed | E-55 | `R04-capped-fixed-reps` |
| R04-aerobic | major | Beginner run-walks, identical 8 weeks | Fixed (sessions) | E-57 ladder by level and block; the session count is intake / week (open) | `R03-aerobic-modality` |
| R04-wod-render | major | Two calorie numbers per station, no EMOM rotation, no loads | Fixed | E-58 | `R04-wod-loads-rotation` |
| R04-cardio-test | major | The 1-mile test only in the JSON | Fixed | E-59 | `R04-aerobic-test-shown` |
| R04-skill | minor | Toes-to-bar six times a week, 'DUBS' ignored | Fixed | E-52 | `R04-skill-rotation` |
| R04-flies-details | minor | 'Flat DB Fly - different grip', the same fly twice a week | Fixed | E-46 / E-48 ('on an incline bench') | `R05-placeholder-details` |
| R04-notes | minor | Pull-up note sends to an assisted machine; a tri-set called a pair; thrusters missing from the WOD note | Fixed | E-55, E-58 | `R01-assisted-pull-up` |
| R04-zercher | minor | Zercher as the class's work squat | Fixed | E-49 (canonical work lift) | `R06-canonical-work-lift` |
| R05-placeholders | major | Five of seven block-2 changes are '- different implement / grip' | Fixed | E-46 | `R05-placeholder-details` |
| R05-circuit-effort | major | 'About 2 reps left at the bell' for 8 weeks | Fixed | E-54 | `R05-circuit-effort-drift` |
| R05-uniqueness | minor | Slider ham curl Monday + Wednesday; table row twice a week | Fixed | E-46 week_unique; E-48 named detail on the kit's only row | `R07-block-change-one-detail` |
| R05-bodyweight-stations | minor | 'Pick a weight' on body-weight stations | Fixed | E-54 | `R05-circuit-effort-drift` |
| R05-unilateral | minor | No side switch on timed single-side stations | Fixed | E-54 | `R05-circuit-effort-drift` |
| R05-test-header | minor | 'Replaces this week's top sets' on a body test; an intensifier line with no intensifier | Fixed | E-59, E-53 | `R05-test-header-by-type` |
| R05-weekly-table | minor | Flat sets table, the climb in work seconds untold | Fixed | E-59 work-seconds row and note | `R3-macro-views` |
| R05-plural-cue-buy | minor | '1 years', '(or a barbell)', the buy list as missing slots | Fixed | E-61, E-62, `warning.v7_no_equipment` reworded | `R03-spanish-fixes` |
| R06-box-squat | major | 'Box Squat - any variation (Deload ...)' as the main squat | Fixed | E-49, E-50 | `R06-generic-records`, `R06-canonical-work-lift` |
| R06-alternating-presses | major | Alternating DB presses as both chest presses; a floor press as the lead lift | Fixed | E-49 | `R03-lead-chest-press` |
| R06-intensifiers | minor | MAX from week 7, MYO from week 9 on a body-weight bridge | Fixed | E-53 | `R01-intensifiers-last-week` |
| R06-home-focus | minor | L3 home substitutes; body-weight glute bridge as the priority Focus | Fixed (picks) | E-49, E-51 (the Friday glute Focus stays a bridge when the week's loaded glute lifts are used) | `R02-home-substitutes` |
| R06-placeholders | minor | 'different grip / range / stance' | Fixed | E-46 | `R05-placeholder-details` |
| R06-week-unique | minor | The same side raise / calf machine twice; the rear-delt pair swapping order | Fixed | E-46, E-47, E-48 | `R07-block-change-one-detail` |
| R06-v28-note | minor | The failed V28 printed as its pass title with ids | Fixed | E-59 | `R06-failed-check-words` |
| R07-pyramid | major | The bench flips to 12/10/8/20 with hypertrophy rest mid-block | Fixed | E-55 | `R07-powerlifting-presses` |
| R07-placeholders | major | 'Weighted Dip - different implement', 'Barbell Hip Thrust - different grip' | Fixed | E-46 ('dumbbell held between the feet', '1-second squeeze at the top') | `R05-placeholder-details` |
| R07-alternating-presses | major | Alternating / seesaw DB presses for a heavy-powerlifting client, no barbell overhead press | Fixed | E-49 (barbell strict press, two-arm presses) | `R07-powerlifting-presses` |
| R07-home-subs | minor | Floor Y / T and body-weight calf raise with cables and calf machines | Fixed | E-51 | `R02-home-substitutes` |
| R07-dip-aba | minor | Parallel dip -> weighted dip -> parallel dip; the same exercise on both push days | Fixed | E-46 | `R07-block-change-one-detail` |
| R07-test-sldl | minor | A 1RM test on a stiff-leg deadlift | Fixed (hinge) | E-49 (hex-bar deadlift is the work and the test) | `R06-canonical-work-lift` |
| R07-copy | minor | MAX 28 times from week 7; 'one intensifier' header | Fixed | E-53 | `R01-intensifiers-last-week` |
| R07-aerobic-holidays | minor | '2 Mile Run' with no running space; peak weeks on the holidays | Fixed | E-57, E-59 | `R03-aerobic-modality`, `R01-holiday-notice` |
| R08-barbell-l1 | major | Barbell alternating deadlift ('meaning-inferred') for a 52-year-old L1 with knee pain | Fixed | E-49, E-50 | `R08-safe-picks` |
| R08-core | major | Weighted Russian twist twice with a low-back rotation hot spot; long-lever Copenhagen with knee pain | Fixed | E-52 | `R08-safe-picks` |
| R08-elbow | major | Y / T raise as the racket-elbow care | Fixed (pick) | E-52 wrist extension; its main-day placement is week.mjs (open) | `R08-safe-picks` |
| R08-aerobic | minor | Run-walk with knee pain, no running space, a bike | Fixed | E-57 | `R03-aerobic-modality` |
| R08-copy-myo | minor | MYO on both calf exercises of an Achilles-hot-spot player; '1 set(s)' wording | Fixed | E-53 | `R01-intensifiers-last-week` |
| R08-placeholders-swaps | minor | Leg extension '- different stance'; chest press A-B-A; lunges and squat cleans as knee-pain swaps; intermediate hop swaps | Fixed | E-46, E-52 | `R08-safe-picks`, `R07-block-change-one-detail` |

Round-3 features with their own tests: `R3-own-risk-line` (R3-GEN-01), `R3-time-check-printed` (R3-SES-02), `R3-block-toggles-printed` (R3-SES-02), `R3-superset-recommendations-printed` (R3-SES-02), `R3-no-checkin-text` (R3-VOL-02), `R3-macro-views` (R2-GEN-02).

Tests updated for the B3 rules (same names): `dose.test.mjs` (intensifiers in the last week only, no MAX; circuit RIR effort; aerobic tools), `select.test.mjs` (block changes: concrete detail values, at least one change a day), `explain.test.mjs` ('Week level'; Spanish weekdays in a sentence), `render.test.mjs` (the legal line on top; the stairway table week · level · effort · sets; weekly sets per FOCUS group), `shape.test.mjs` (soccer VOL2), `compile.test.mjs` (843 machine-translated ES lines), `review-v12.test.mjs` (R08-16 'Week level'; the placed-rise helper rounds 7 % to whole sets like volume.allowRise), `invariants.test.mjs` (D-48 reads concrete details and skips test items).

### Open after stage B3 (for the coach or another stage)

- **Vocabulary of details** (E-46, PROPOSED): the coach approved the one-detail rule; each value ('1-second pause at the bottom', 'one leg at a time', 'on an incline bench' ...) is ours. Pauses are the fallback when no grip / stance / hand / implement change applies - the coach may prefer a different exercise there.
- **One intensifier a day** (E-53): R3-VOL-04 says '1 + intensifiers in the last week'; how many a day is PROPOSED (one, MYO). MAX sets before the last week are gone (always inside 1-3 RIR).
- **Probe vs real picks** (B1): the volume engine's peak probe can fill an added Focus slot with another exercise than the final pick (week-wide uniqueness changed some picks); 01 Friday week 12 runs 78 min on its test day (68 min without the test vs 66) and carries `warning.long_day`.
- **Test station** (week.mjs / generate): the PPL bench test sits on Monday's incline bench (the template's first press); the flat bench is Thursday's work lift.
- **Racket elbow care on a main day** (week.mjs prehab placement) and the class model's 3 aerobic sessions (intake / week) stay with their owners.
- **Bootcamp vertical pull** without a bar: the field kit's VPULL slots hold rows (a DB pullover substitute is PROPOSED, not built).
- **Spanish** (E-61): the new lines are PROPOSED neutral Latin American Spanish for the coach's review (D-64); the legal line points to DISCLAIMER.md / DISCLAIMER.es.md (drafts for attorney review).

## v0.4 - stage B2: athletic work (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the athletic issues of `samples/RECHECK_v0.3.md` (jump / plyo / throw / COD / sprint / Olympic work, WODs, ballistic circuit stations) and the round-3 athletic answers (`coach_answers_round3.md` R3-ATH-01 .. 05, all approved). Code: the new module `engine/athletic.mjs` (Receive-Create stages, drill responses and cues, the share-based weekly targets, the athletic stairway), the athletic parts of `budget.mjs` (Olympic climb), `select.mjs` (picks), `dose.mjs` (doses) and V27 in `validate.mjs`; model data in the amendment layer `tools/fixture/athletic-b2.mjs` (catalog drill responses, sport-only COD drills, sprint kinds, the HYROX template, rules), applied by both builds. Minimal edits outside: `generate.mjs` (weeks collected first, then the athletic stairway doses the whole block), `shape.mjs` (stage per exercise block; the swim championship taper), `volume.mjs` (athleticBudget re-exported from athletic.mjs; per-exposure Olympic sets; every-session shoulder care is never a room cut), `week.mjs` (every-session shoulder care, 60+ quick stepping, colour-named aerobic stations, HYROX station minutes), `render.mjs` (prints the plan's own planned share), `tools/check-model.mjs` (the six new catalog `athletic` fields). Decisions: `engine/DECISIONS.md` E-26 ... E-45. Regression tests: `tests/review-b2.test.mjs` (29 tests, `R<sample>-<slug>` / `R3-<slug>`).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors), `node --test tests/` (774 tests, 774 pass, 0 fail, **0 `todo`** - the V27 random-corpus limit is fixed), `node tools/generate-samples.mjs` (8 / 8 plans `ok`, zero failing error checks). The 378-intake random / sport / activity corpus passes every error check on the fixture and on `model/`.

### What changed (all samples)

- **Stages per exercise block** (E-26): a jump exercise never changes inside an exercise block; 12 weeks run RC1 / RC2 / RC3 = blocks 1 / 2 / 3; a one-block stairway (6 weeks) holds RC2 for L2 / L3 athletes; pre-season / maintenance hold the stage reached.
- **How a drill is done** (E-27): depth jumps are single-response (land & go), never a stage-3 repeat drill; ankle / pogo hops are plyometric and cued as quick continuous contacts at every stage; a ballistic jump is 'one big effort, reset'; stage 1 takes no tuck / squirrel / hurdle hops.
- **Targets and the athletic stairway** (E-28, E-29, E-30): the plyo share decides the reactive / ballistic / ankle split; the whole block is dosed at once - doses land on the goal, a key the stations cannot hold keeps the shape of its target (scaled) and climbs, no week drops, the end-test week holds the week before; the client is told when the peak sits under 60 % of the sport dose (`warning.athletic_capacity`). Single-leg drills count both legs.
- **First reactive exposures** (E-32): two feet, unloaded, a low box, one depth-jump station a week for the 230-lb linebacker.
- **Sport-appropriate drills** (E-33, E-34): no football routes for soccer (or anyone but football / flag football); accelerations (10-20 m) or max velocity (30-40 m) by the profile's sprint focus, 5-m steps.
- **Olympic sets** (E-35, E-36): climb one set at a time (football 8 -> 12, swimmer 6 -> 8), no test-week cliff; a jerk is never a hypertrophy press.
- **Bootcamp and WODs** (E-38, E-39): the general-population circuit keeps a medball throw and a KB swing station (never muscle sets, inside the 20-40 throws a week); the CrossFit class's WODs rotate (no two the same, no thruster on the squat day, no swing on the deadlift day, a jump and a ball / KB station each week).
- **Round 3** (E-40 ... E-43): swimmers' shoulder care every session (1 set, never cut) and a 2-week taper before the championship; 60+ defaults (landings, balance and reactive stepping, light throws, fast machine work; jumps / Olympic off unless switched on); racket players 50-59 lift the low-impact rule with `prefs.racket_50_impact_opt_in`; the HYROX plan (`athletic.4/hyrox`, program OTHYX: S1 / S2 strength + station circuit, H1 Blue intervals, H2 Green 1 km + station, 4 cardio sessions).
- **Block switches**: every athletic / power block carries `toggle: true` and lists in `day.toggle_blocks`; athletic work never credits a muscle, so switching it off changes no set (`R3-athletic-toggle`).
- **Plan additions** (additive, plan/2 and contracts_version 1.1.0 unchanged): `athletic_budget.planned.upper_contacts`, `planned_share`, `goals`, `scale`, `hold`; item `athletic.key`, `athletic.response`; catalog `athletic.response / upper / low_amplitude / sport_only / no_cuts / sprint_kind`; rules `athletic.split / response_cues / first_reactive / cod / circuit_ballistic / hyrox`, `olympic.sets.climb`.

### Athletic work after the fixes (compiled model; stairway week 1 -> last week)

| Sample | Contacts | Throws | COD cuts | Sprint m | Olympic sets | Plyo share planned (target) | Stages | Told (peak under 60 %) |
|---|---|---|---|---|---|---|---|---|
| 01 swimming | 34 -> 44 | 36 -> 40 | - | - | 6 -> 8 | 0.29 -> 0.33 (0.10 -> 0.25) | RC1 / RC2 / RC3 | contacts 58 % |
| 02 football | 108 -> 140 | 84 -> 108 | 80 -> 96 | 120 -> 240 (accelerations) | 8 -> 12 | 0.22 -> 0.47 (0.35 -> 0.50) | RC1 / RC2 / RC3 | contacts 59 % |
| 03 soccer | 56 -> 112 | 10 -> 20 | 54 -> 72 | 120 -> 200 | 4 -> 6 | 0.85 (0.45 -> 0.60) | RC2 (one 6-week block), held in pre-season | contacts 41 %, throws 50 %, COD 45 %, sprint 33 % |
| 04 CrossFit-style class | - | - | - | - | 6 | - | - | WODs rotate (E-39) |
| 05 bootcamp | - | 33 -> 39 (ball station) | - | - | - | - | - | KB swing + medball station |
| 08 pickleball 52 | 8 -> 10 | 36 -> 40 | - (3 play days) | - | 2 | 0 -> 0.20 (0.35 -> 0.50) | RC1 / RC2 / RC3 | contacts 12 %, throws 58 % |

Every family climbs or holds inside each stairway block; the hold weeks are the end-test weeks. Where the time check (stage B1) and the field-athlete cap of 12 + 2 core leave few stations, the work is scaled to what they hold and the client is told.

### RECHECK_v0.3 issues fixed in stage B2

| ID | Severity | Issue (RECHECK_v0.3.md) | Status | Fix made | Test |
|---|---|---|---|---|---|
| R01-athletic-climb | major | Swimmer jump contacts drop in stage-change weeks and end lower; Olympic flat 6 vs 5 -> 8; per-side contacts counted once | Fixed | Athletic stairway (E-29), Olympic climb (E-35), both legs counted (E-31) | `R01-athletic-climb`, `R01-per-side-contacts` |
| R01-mid-block-swap | major | Athletic exercises change for one week and change back inside a block; fake slam with medballs owned | Fixed | Stages per exercise block (E-26); no-ball substitute only without a ball (E-37) | `R01-mid-block-swap`, `R01-fake-slam` |
| R01-validators-exempt (V27 part) | major | V27 only checks overshoot | Fixed | V27 under / drop / told / stage / sport checks (E-44) | `R01-v27-under-and-drop` |
| R01-rc1-ankle-hops | minor | Stick cue on ankle hops, ankle hops 0 % of the share, single-leg / weighted depth drop in week 1 | Fixed | Cues by response (E-27), planned share counts ankle work (E-28), first block on two feet (E-32) | `R01-ankle-hop-cue`, `R01-first-block-bilateral` |
| R02-rc-mid-block | major | RC stages and exercise blocks not aligned; single-week exercises; week 5 goes backwards | Fixed | E-26 | `R02-rc-stage-blocks`, `R01-mid-block-swap` |
| R02-depth-jump-repeat-cue | major | Single-response depth jumps get the RC3 'repeat' cue; catalog tags them plyo_repeated | Fixed | Catalog `athletic.response`, stage-3 filter, cues (E-27) | `R02-depth-jump-single-response` |
| R02-first-reactive-heavy | major | A 230-lb linebacker's first reactive rep is a single-leg depth jump; 4 depth-jump variants in week 4 | Fixed | E-32 | `R02-first-reactive-heavy` |
| R02-olympic-flat-cliff | major | Olympic 8 sets for 11 weeks, then 12 in the test week | Fixed | E-35 | `R02-olympic-climb` |
| R02-plyo-share | major | Share cannot reach 50 %; weeks 1-3 0 %; low contacts flat | Fixed | Share split + planned share (E-28); ankle work climbs (E-29) | `R02-plyo-share` |
| R02-tests-counted (athletic part) | major | Olympic +50 % and full athletic dose in the test week | Fixed | End-test week holds the week before (E-29, E-35) | `R02-test-week-hold` |
| R02-sprint-max-velocity | minor | Max-velocity drill at acceleration distances, odd 31 / 33 m, no accelerations | Fixed | E-34 | `R02-sprint-focus` |
| R02-push-jerk-block-change | minor | Strict OHP becomes a push jerk at block 3 | Fixed | E-36 | `R02-push-jerk-never-a-press` |
| R03-athletic-budget | blocker | Soccer short of budget on every track and flat while targets climb; V27 overshoot only | Fixed | Athletic stairway: climbs to what the capped stations hold, told up front (E-29, E-44) | `R03-athletic-budget-climb` |
| R03-football-routes | major | Dig / out, fade routes for a soccer midfielder | Fixed | E-33 | `R03-football-routes` |
| R03-plyo-ankle-upper | major | Ankle hops out of the share and mis-cued; push-up plyos in the lower-body budget | Fixed | E-27, E-28 | `R03-upper-plyo-out`, `R01-ankle-hop-cue` |
| R03-preseason-athletic | major | Pre-season regresses to RC1 cues | Fixed | Stage held (E-26), cues by response (E-27); the pre-season PLYO / BALL factors (0.75 / 0.6) still lower jump contacts by the profile's design | `R03-preseason-stage-held` |
| R03-sprint-distances | minor | 20-26 m max velocity, no acceleration station | Fixed | E-34 (soccer's 'both' focus takes accelerations first; a second sprint station would take max velocity) | `R02-sprint-focus` |
| R04-wod-variety | major | Every WOD erg + thruster + swing; the v1.2 WOD rules never read | Fixed | E-39 | `R04-wod-variety` |
| R05-bootcamp-athletic | major | No ballistic / throw work for a gen-pop client with medballs and KBs | Fixed | E-38 | `R05-bootcamp-ballistic` |
| R06-push-jerk | major | Strict press -> barbell push jerk in an aesthetics block | Fixed | E-36 | `R02-push-jerk-never-a-press` |
| R08-athletic | major | Jump contacts fewest in the hardest weeks; RC1 cue in RC2 weeks; 3-contact 'repeat' sets | Fixed | E-26, E-27, E-29 | `R08-pickleball-jumps-climb` |

Round-3 features with their own tests: `R3-ATH-01 swimming dryland`, `R3-ATH-02 older 60+`, `R3-ATH-03 HYROX`, `R3-ATH-04 sport shares and cardio`, `R3-ATH-05 stay active`, `R3-athletic-toggle`, `R3-split-and-bounds`.

Tests updated for the B2 rules (same names): `dose.test.mjs` (cues by response; a KB swing in a circuit is a conditioning dose), `shape.test.mjs` (stages per exercise block), `volume.test.mjs` (share-split targets, 60+ defaults), `select.test.mjs` (WOD and circuit pools hold ballistic records), `week.test.mjs` (swimmer shoulder care every session), `review-v12.test.mjs` R02-5 / R03-1 (goal, climb, told), `compile.test.mjs` (+55 HYROX stations), `invariants.test.mjs` (V27 `todo` removed), `tests/fixtures/plan-min.json` (one stage per exercise block, a told capacity warning).

### Open after stage B2 (for the coach or another stage)

- **Plyo share vs the 04 volumes** (E-28): with few jump stations (soccer: one lower jump station inside the 12 + 2 cap) the ankle work carries the share (soccer 85 % planned vs 60 %); the swimmer's minimum ankle dose (2 x 10) sits at 33 % vs 25 %. Coach: should ankle work count in the share, and may the plan trim the ankle block to hold the share?
- **Capacity under the sport dose**: soccer (3 x 75) and the pickleball player (2 x 45) hold well under their 04 weekly numbers; the plan scales and tells (`warning.athletic_capacity`). Coach to confirm the 04 weekly numbers are full-time targets.
- **HYROX at 4 x 60**: the time check keeps hips, shoulders and calves directly (quads, back, chest named, with 5 days or 75-90 min offered); the hybrid days' upper-body pairs are PROPOSED (E-42).
- **60+ quick stepping** needs floor space (lateral shuffles); without it the balance-and-reactive-stepping warm-up carries it.
- **CrossFit class Friday 'push press / jerk'**: the class's Olympic budget (2 exposures) still trims the Friday jerk station (RECHECK 04 major); the class model's exposures are the coach's call.
- **Swimmer every-session shoulder care** is 1 set (INFERRED dose) so hips still fit 3 x 60 min; at 2 sets the time check trades hips for chest.
- **Play days** (R3-ATH-05): 'the hardest gym day at least 48 h before the biggest play day' is checked and told (`warning.play_48h`), the weekdays stay the client's choice.
- **Words** (B3): the new notes and warnings are PROPOSED EN / ES (`tools/fixture/athletic-b2.mjs` UI_B2); the render shows them as notes; `plan.time_check` / `goals` / `scale` are not rendered yet.

## v0.4 - stage B1: time, volume and structure (engine 0.4.0, model 1.3.0, 2026-10-09)

Scope: the round-3 answers (`coach_answers_round3.md`: R3-VOL-01 / 02 / 03 / 04, R3-SES-01 / 02, R3-PER-02) and the time, volume and structure issues of the coach-eye re-check of the v0.3 plans (`samples/RECHECK_v0.3.md`). Athletic dosing, exercise picks and the client copy belong to stages B2 / B3 and are not in this table. Decisions: `engine/DECISIONS.md` section E. Regression tests: `tests/review-r3.test.mjs` (`R<sample>-<slug>`); the v1.2 tests in `tests/review-v12.test.mjs` were updated where round 3 changed the rule (named below).

Verification: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors), `node --test tests/` (745 tests, 0 failures, 1 `todo` - the random-corpus limit below), `node tools/generate-samples.mjs` (8 / 8 plans `ok`, zero failing error checks).

### What changed (all samples)

- **Lines and groups** (R3-VOL-01, R3-SES-01): the stairway climbs on 9 lines (one shoulders line: side + rear + front delts); the floor of 10, the 2-4 rule and the time check read the FOCUS groups (hips = glutes + hamstrings). A set counts at most 1.0 to a group (group credit).
- **No check-ins** (R3-VOL-02, R3-VOL-04): `adapt()` and the check-in offers are gone; an old `output_mode: checkin` is planned like plan-only and says so; `week_by_week` is the 12-week plan shown a week at a time.
- **Focus muscle 1 / 2** (R3-SES-01): +2 sets on start and ceiling (range 1-3); the other lines keep their own steps.
- **The time check** (R3-SES-02, `plan.time_check`): told up front (`warning.time_check`) with one more day / longer sessions in numbers; if the client keeps the time, fewer groups are trained directly (big movers first, arms / calves / shoulder isolation from compound credit), listed as `not_trained_directly` (reason `time`, `no_station` or `credit_only`); supersets recommended per day; every trained group holds 10 and climbs.
- **Realistic minutes** (v1.3 time model): rest-based set minutes (strength rest 3-6 min on heavy work lifts), supersets share the rest, a rep-max test is a 10-min work-up, aerobic add-ons count; a day whose fixed work fills the minutes holds no lift; circuits, maintenance, in-season and pre-season blocks are trimmed to the minutes too.
- **Validators**: no warning exempts a trained group (V22 / H17, H21); a group listed as not trained directly may not keep its exercises; H22 = planned stairway only.

### Sample plans after the fixes (compiled model)

| Sample | Days x min | Fits? | Trained directly | Not trained directly | Offers (chosen last) | Sets wk 1 -> last |
|---|---|---|---|---|---|---|
| 01 swimming | 3 x 60 | no (needs 115) | hips, back, shoulders | quads, chest, calves (time); arms (credit only) | 4 days x 85 min; 115 min; keep 3 x 60 | 33 -> 44 |
| 02 football | 4 x 90 | no (needs 100) | quads, hips, back, chest, shoulders, calves | arms (credit only) | 5 days; 100 min; keep 4 x 90, lower peak | 96 -> 114 |
| 03 soccer | 3 x 75 | no (needs 105) | quads, hips, back, chest, shoulders | calves (time); arms (credit only) | 4 days; 105 min; keep 3 x 75 | 54 -> 62 (pre-season 36) |
| 04 CrossFit-style class | 4 x 60 | no (needs 115) | back, chest, shoulders | quads, hips, biceps, calves (time); triceps (no station) | 5 days x 80 min; keep 4 x 60 | 31 -> 39 |
| 05 bootcamp | 3 x 45 | no (needs 50) | quads, hips, back, chest, shoulders, calves | biceps, triceps (time) | 4 days; 50 min; keep 3 x 45 | 63 flat sets, work seconds 35 -> 50 |
| 06 aesthetics | 4 x 75 | no (needs 105) | all 8 groups | - | 5 days x 80 min; keep 4 x 75, lower peak | 115 -> 157 |
| 07 push-pull-legs | 6 x 75 | no (needs 110) | all 8 groups | - | keep 6 x 75, lower peak (no 7th day; 110 min is over the 90 allowed) | 81 -> 100 |
| 08 pickleball | 2 x 45 | no (needs 105) | hips, calves | quads, back, chest, shoulders (time); arms (no station) | 3 days x 70 min; keep 2 x 45 | 20 -> 23 |

No non-test main day runs past its minutes x 1.10; test-week days that run longer carry `warning.test_day_long`.

### RECHECK_v0.3 issues fixed in stage B1

| ID | Severity | Issue (RECHECK_v0.3.md) | Status | Fix made | Test |
|---|---|---|---|---|---|
| R01-stairway-flat | blocker | Swimmer's sets mostly flat; lats / hamstrings / calves never change (lambda 0, cap = start) | Fixed | The time check keeps only the groups the 3 x 60 min can hold at 10+ and climbing; every kept group climbs >= 2 sets (E-10, E-13, E-14) | `R01-stairway-flat` |
| R01-validators-exempt | major | V22 / H17 / H21 skip any muscle named in a warning; validation.ok on an unsigned plan | Fixed | validate.mjs: no warning exemption; group credit from the items; listed groups may not be trained; H21 per-group climb (E-24) | `R01-validators-exempt`, `R3-validators-no-warning-exemption`, validate.test mutations |
| R01-floor-missed | major | Side delts 2, chest 6, glutes 4 below 10 for 12 weeks | Fixed | Groups held at 10+ or listed as not trained directly (time); side delts are part of the shoulders line (R3-VOL-01) | `R01-time-check-up-front` |
| R01-days-over-60 | minor | Every main day 61-66 min, steps added to full days | Fixed | v1.3 time model + allocation replay: no non-test day over 60 x 1.10 | `R01-days-over-60` |
| R01-test-in-strength-block | minor | Strength tests written as "3 x 3 or 5 rep max" inside the block | Fixed | A test is one top-set item before the planned sets, no credit (E-18) | `R01-test-in-strength-block` |
| R02-athlete-cap | major | Monday 15 exercises (18 in test weeks) over the 12 + 2 cap | Fixed | Cap is hard: athletic split per R3-SES-01, then whole non-work groups (E-19) | `R02-athlete-cap` |
| R02-tests-counted | major | Tested lifts print 3 x 3RM and count as 3 working sets | Fixed | Test top set (1 set, no credit) + planned sets; tested lift locked before the laterality dial (select.mjs, minimal) | `R02-tests-counted`, `R02-6` |
| R02-days-over-90 | major | Monday 92+, Tuesday / Thursday over 90 | Fixed | Time check; aerobic add-on moves to its own session when the session cannot hold it | `R02-days-over-90`, `R02-11` |
| R02-floor | major | Glutes 6 / 6, side delts 2 / 2 targets (floor_schedule) | Fixed | Group floors (hips, shoulders) held and climbing; arms credit only for field athletes (R3-VOL-01) | `R02-floor-and-climb` |
| R03-athlete-cap | major | Monday 14 non-core exercises | Fixed | Hard cap (E-19) | `R03-athlete-cap` |
| R03-stairway-flat | major | Steps lumpy / flat; side delts target 3 / 3 | Fixed | Short block minimum climb 1 (E-14); groups listed or trained at 10+ | `R03-stairway-flat` |
| R04-floor-flat | blocker | 9 of 10 muscles below 10; lambda 0 for 9 of 10 | Fixed | The class keeps back, chest and shoulders at 10+ and climbing; quads, hips, biceps, calves named (time) with 5 x 80 min offered | `R04-floor-flat`, `R04-wod-room` |
| R05-v22-circuits | major | V22 skips circuit weeks; calves under the leg-day rule | Fixed | Circuits floored: time pass at the peak week, swaps, rear-delt station, calves 3 a leg day (E-15) | `R05-v22-circuits`, `R05-circuit-minutes`, `R05-2` |
| R06-flat-priorities | blocker | No stairway for most muscles; priorities flat | Fixed | Every group climbs; Focus glutes / shoulders +2 (E-06) | `R06-flat-priorities`, `R06-1` |
| R06-back-below-floor | blocker | Back 8, chest 8-9, arms 6 for 12 weeks | Fixed | All 8 groups at 10+ on the main days every week | `R06-back-below-floor` |
| R07-calves-side-delts-flat | blocker | Side delts 5 -> 8, calves 6 = 6 (lambda 0) | Fixed | Shoulders line and calves climb; all PPL groups at 10+ | `R07-calves-side-delts-flat` |
| R07-tests-5x3rm | major | Week 12 "5 x 3 rep max" + an extra set on the squat / RDL | Fixed | Test top set + planned sets (E-18) | `R07-tests-5x3rm` |
| R07-time-model | major | Compound sets costed at a flat 2.5 min; tests not a work-up | Fixed | Rest-based set minutes, strength rest on heavy work lifts, 10-min test work-up (E-09) | `R07-time-model` |
| R08-stairway-flat | blocker | Lambda 0, start = cap for 7 muscles; weeks 8-12 flat at 25 | Fixed | 2 x 45 min keeps hips + calves at 10+ climbing; the rest named with 3 days x 70 min offered | `R08-stairway-flat` |
| R08-side-delts-zero | major | Side delts 0 / 0 yet listed as floored | Fixed | A floored group is trained or listed, never a 0 / 0 target | `R08-side-delts-zero` |
| R08-calves-per-leg-day | major | Calves: two calf stations + a bonus calf raise on Thursday | Fixed | One calf exercise x 3 sets a leg day; weekly calves floor follows the leg days (E-05); no calves bonus | `R08-calves-per-leg-day` |

Round-3 features with their own tests: `R3-focus-slots`, `R3-play-days-event`, `R3-superset-recommendations`, `R3-block-toggles`, `R3-year-q1-time-check`, `R3-maintenance-time`, `R3-full-day-no-lift`, `R3-time-check-in-contract`, `R3-engine-version`.

v1.2 tests updated for round 3 (same IDs in `tests/review-v12.test.mjs`): R01-1 (the optional day may take a small line's bonus, R3-VOL-03), R01-4 / R03-6 (`warning.test_day_long` on test days), R02-11 (an aerobic add-on the session cannot hold is its own session), R03-1 (COD inside the hard 12 + 2 cap: dosed every week, half its target in week 1), R05-2 / R08-3 (`warning.time_check` replaces `warning.floor_schedule`), R06-1 (shoulders line, time check replaces D-67), R08-1 (`offer.more_days_min`).

### Open after stage B1 (for the coach or another stage)

- **CrossFit-style class 4 x 60** (R04): with strength rest on the class's work lifts and the WOD, the squat and deadlift days cannot hold 10 climbing sets, so the plan trains back, chest and shoulders and names quads / hips. Coach: keep the class's squat / deadlift as 2-3 flat work sets outside the stairway, or shorter rests in the class model?
- **Swimmer 3 x 60** keeps hips, back, shoulders and names quads, chest, calves; **soccer** names calves. Coach to confirm the keep order for field athletes (sport priorities first, then hips, quads, back, chest, shoulders, calves, arms).
- **Athletic budgets inside the hard cap** (B2): COD / sprint / throw targets can no longer be met on capped days (soccer COD 72 vs 128-152).
- **Laterality share** (B2, V28 warn): the bilateral share drifts from the D10 target on 01 / 02 / 03 / 06 / 07 (locked tested lifts, fewer unilateral stations after the cap and the time check).
- **Render** (B3): show `plan.time_check` (trained / not trained directly, offers in numbers), `superset_recommendations`, block toggles and the test top set.
- **Numbers to confirm** (all PROPOSED): rest-class minutes, Focus +2, minimum climb 2 (1 in blocks <= 7 weeks), calves floor formula, the work-lift below-floor exemption (E-11), the swim pull ratio on the back line alone (E-23).

### Random-corpus limit (v0.4)

- **V27** (3 of 378): wall-ball / sit-up throws are dosed at fixed reps, so a small weekly throw target can be exceeded (B2). H10 / V15 and H21 now pass on the whole corpus. *Fixed in stage B2 (see above): V27 passes on the whole corpus, no `todo` left.*

## v1.2 review round (engine 0.3.0, model 1.2.0)

The eight sample plans (engine 0.2.0, model 1.1.0) were each reviewed "with a coach's eye" and graded **D**: 151 issues, 17 blockers, 68 majors and 66 minors. Every fix was made in the engine, the model compiler or the rules (the amendment layer `tools/fixture/review-v12.mjs`, applied identically to the fixture and to `model/`), never by editing a plan; the samples were then regenerated (engine 0.3.0, model 1.2.0).

**Status:** Fixed 97, Partly fixed 36, Deferred 18.

| Severity | Fixed | Partly fixed | Deferred |
|---|---|---|---|
| blocker | 12 | 5 | 0 |
| major | 49 | 15 | 4 |
| minor | 36 | 16 | 14 |

How to read: **ID** = `R<sample>-<n>`, n = the issue's position in that sample's review. **Test** = the regression test in `tests/review-v12.test.mjs` (same ID prefix) that fails if the issue comes back; issues fixed through a shared rule cite the test of the first sample that covers it. "Partly fixed" names what is still missing. Deferred items carry the reason; they are also returned as `problems`.

Verification after the fixes: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors), `node tools/check-model.mjs` (0 errors), `node --test tests/` (all pass; 6 `todo` entries are random-corpus limits listed at the end), `node tools/generate-samples.mjs` (8 / 8 plans `ok`, zero failing error checks).

## 01-swimming - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R01-1 | blocker | Main days frozen at 2 sets; every step lands on the optional Saturday | Fixed | volume.mjs: the stairway is placed on main days only (ORD-10), VOL-07 order with the work-lift guard, sized to the minutes (D-67). Main-day total 50 -> 56; Saturday flat. | `R01-1` |
| R01-2 | blocker | Placed weekly jumps of +10-17 % per muscle (two bonus exercises in one week) | Fixed | volume.mjs: placed rise capped at max(1 set, 7 %) per muscle and 7 % in total; added slots enter at 1 set (rules.stairway.limits.placed). | `R01-2` |
| R01-3 | major | Depth drop turned depth jump; 0 -> 50 lateral single-leg contacts; printed plyo share is the target | Fixed | select.mjs: profile plyo exclusions (no depth jumps / bounds / hurdle hops for class-5 swimmers), landing drills RC1 only, RC-stage re-picks; dose.mjs/generate.mjs: contacts reconciled to the 6-8 budget (D-73); render prints the planned share. | `R01-3`, `R02-17` |
| R01-4 | major | 81-min Mondays, 12 Olympic sets vs budget 5; only priority muscles cut | Fixed | Data-driven cut chain (athletic budget first, then fillers, then groups); Olympic sets from the profile budget and exposures (budget.mjs, week.mjs trimOlympicExposures). Days 61-66 min for the 60 picked. | `R01-4` |
| R01-5 | major | Wednesday stacks two hinges, no knee-dominant lift (opposite-pattern pairing) | Deferred | Changing athletic.3 S1 / S2 to bkd + uhd / bhd + ukd breaks the template's knee + pull / hip + push pairs (ORD-06, V11 / H06) and the 2-4-per-group rule; needs the coach's call (round-3 conflict noted in DECISIONS D-81). | - |
| R01-6 | major | Alternating staggered barbell deadlift classed as a non-axial second day | Fixed | tools/fixture/review-v12.mjs amendExercise: any barbell / hex-bar hinge (staggered, kickstand, alternating) is spine_class counted (R2-SES-02). | `R01-6` |
| R01-7 | major | Glutes 3.5, triceps 1.5, side delts 2.5 for a swimmer (credit-only) | Partly fixed | D-03 revised: glutes and side delts are targets for athletes (R2-VOL-06); arms stay credit-only for field athletes (D-07 revised, R3-VOL-01 pending). Glutes 4.25 -> 5.5 placed; the floor miss is named (warning.floor_schedule). | `R01-7` |
| R01-8 | major | Lats flat, VPULL 4 sets, rear delts cut for time while flies stay; prehab credits 0 | Partly fixed | Prehab credits by catalog (rear delts / face pulls count, R2-LIB-04); aquatic chest fly cut before pulls; pulls >= presses. Lats stay at 10 (start sized to 60 min, D-67); the 1 : 2.3 push : pull ratio is not enforced. | `R01-8` |
| R01-9 | major | Upright row and standing overhead press for a swimmer's shoulder | Fixed | select.mjs: profile injury hotspots act as default avoid / prefer tags without reported pain (SHOULDER_SWIMMER). | `R01-9` |
| R01-10 | major | Tests attached to different plyo exercises, rep-max tests written as "2 x" and supersetted | Fixed | week.mjs markTests: tests are their own TEST items (protocol per test), the same in week 1 and the last week; a tested lift never runs in a superset; the tested exercise is locked across blocks. | `R01-10` |
| R01-11 | minor | Placeholder names ("Calf Raise - any", empty "different implement" variations) | Fixed | select.mjs: library-first statuses, generic records only as swaps (a named repeat beats a placeholder); full kits take a real alternative at block changes. | `R01-11` |
| R01-12 | minor | Contradicting box heights; RC cues on ballistic jumps; "bar" on DB / KB lifts | Fixed | dose.mjs: one box height from the exercise record; stage cues by quality; implement-aware Olympic copy (effort.olympic_power_db / _kb). | `R01-12` |
| R01-13 | minor | Olympic rep rule inverted (barbell 4 x 8, KB squat clean 3-5) | Fixed | dose.mjs: the scheme follows implement + catch (DB / KB / pulls ramp, barbell catches 3-5), one ramp across the block. | `R01-13` |
| R01-14 | minor | Core all flexion; dynamic core dosed in seconds with RIR | Fixed | select.mjs: core picks follow the profile plane mix (sagittal + frontal / transverse); dose.mjs: holds in seconds with a form cue, dynamic core in reps. | `R01-14`, `R08-7` |
| R01-15 | minor | Sprint A-drills for a T0 swimmer; no thoracic / pec-minor mobility | Fixed | budget.mjs warmupMode: mobility prep for non-running sports and shoulder hotspots, A-drills for running sports, balance for court players. | `R01-15` |
| R01-16 | minor | MAX on a mid-session lateral raise | Fixed | dose.mjs / positionFor: MAX only on the day's last small-muscle item and only once the planned effort is 1-2 in the tank. | `R01-16` |
| R01-17 | minor | Hex-bar squat and hex-bar deadlift as the two axial lifts, both rep-max tested | Partly fixed | The plan now squats on the hex bar and deadlifts with a barbell (different implements, both still tested); there is no explicit rule forcing different implements. | - |
| R01-18 | minor | 20 throws a week, no transverse throw, no ankle block | Fixed | week.mjs ensureAthleticTracks / ensureThrowStation: throw station with a rotational pick and a low-amplitude ankle block; throws 36-40 and low contacts 50 against 35-45 / 51-69. | `R01-3` |
| R01-19 | minor | Pull-ups 12-15 at 3 RIR for a 145-lb 16-year-old | Fixed | dose.mjs capToHint: body-weight pull-ups 7-10 (or the assisted regression note), weighted pulls 5-8. | `R01-19` |
| R01-20 | minor | Accessory brackets zig-zag; degenerate 15-15 range | Partly fixed | Rep caps never produce a min = max range (capToHint widens to 3 reps); the accessory brackets in rules.reps still follow the coach's matrix per block (PRG-06 re-ordering left for the coach). | `R01-20` |

## 02-football - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R02-1 | blocker | No stairway in weeks 1-9 (template minimum above the starts) | Fixed | D-67 capacity sizing + D-68 group-day reduction: main-day total 75 -> 95, every week climbs or holds by the 7 % cap. | `R02-1` |
| R02-2 | blocker | No loaded horizontal press for a linebacker; dip rep-max test | Fixed | select.mjs: athletes with a strength goal get a high-ceiling bench; constraint band no longer forces dips; tests relocate to a testable press. | `R02-2` |
| R02-3 | major | Max-velocity sprints / accelerations as an end-of-session buy-out | Fixed | Sprints sit in the athletic block before lifting; the buy-out is a conditioning finisher only (note.buyout) and the first room cut. | `R02-3` |
| R02-4 | major | Nordics 15, weighted pull-ups / dips 12-15, 16-contact depth drops | Fixed | dose.mjs: exercise rep hints cap the phase bracket (Nordic 5-8, weighted 5-8, body-weight pulls 7-10); per-leg contact caps. | `R01-19` |
| R02-5 | major | Athletic budget missed (COD 18 of 80, low contacts 0, throws 120 of 70) | Fixed | D-73: tracks ensured (COD, JLK, sprint, throw) and doses reconciled to the weekly targets; week 1 now COD 80 / 80, low contacts 50 / 60, sprint 240 / 300 m, throws 72 / 70. | `R02-5` |
| R02-6 | major | Baseline and end tests on different exercises; trained athlete tested "from zero" | Fixed | Tested lifts locked across blocks; same drill ids; from_zero = untrained only (rules.tests.from_zero_if, intake.mjs). | `R02-6` |
| R02-7 | major | Side delts 1.5, biceps 4, triceps 4.5, glutes 5-6, traps 0 (credit-only) | Partly fixed | Glutes and side delts targeted (D-03 revised); arms credit-only for field athletes (R3-VOL-01 pending); the floor misses are named (warning.floor_schedule: glutes, side delts). Traps are not targeted. | `R02-7` |
| R02-8 | major | All unilateral lower work sagittal (no frontal / transverse quota) | Partly fixed | select.mjs scores frontal / transverse unilateral picks for COD sports (side lateral lunge on Tuesday); no hard weekly quota yet. | - |
| R02-9 | major | Work lift gets fewer sets than its pair; added sets go to flies and calves | Fixed | volume.mjs: VOL-07 order with the work-lift guard (work >= any station of its group), compounds start at 3 at >= 60 min. | `R02-9` |
| R02-10 | major | RC3 "repeat" cue on single-effort depth drops; hurdles unused | Fixed | Landing drills RC1 only; RC2 / RC3 re-pick a repeatable drill (RC-stage re-picks in generate.mjs). | `R02-10` |
| R02-11 | major | Session times leave out aerobic blocks; Tue really 97-110 min | Fixed | week.mjs estimateMinutes counts add-on aerobic work; a full main day takes the session separately (aerobic_minutes per day in the plan). | `R02-11` |
| R02-12 | minor | Day titles promise lifts the day does not hold | Partly fixed | Client-facing titles drop coach jargon (plainDayLabel); titles are not yet rebuilt from the actual work picks after a laterality flip. | `R02-12` |
| R02-13 | minor | Contradictory box heights | Fixed | One height from the exercise record (see 01-12). | `R01-12` |
| R02-14 | minor | Second calf station note says 1 set but doses 2; calves supersetted with calves | Fixed | Calves = one exercise x 3 sets per leg day; the 1-set second station is the first cut; small isolations re-pair across groups (calves with a delt). | `R02-14` |
| R02-15 | minor | Bilateral overhead throw dosed "per side" | Fixed | dose.mjs throwDose: per side only for rotational / unilateral throws. | `R02-15` |
| R02-16 | minor | Same exercise twice a week in a category | Fixed | select.mjs: week-wide second exposure for isolation / Focus slots. | - |
| R02-17 | minor | Plyo share printed from the target | Fixed | render.mjs prints the planned share (plyo / all jump + throw work). | `R02-17` |
| R02-18 | minor | Implement-not-stated / "any" records as defaults | Fixed | Generic records are swaps only (see 01-11). | `R01-11` |
| R02-19 | minor | Olympic lifts never move; pulls 3 sets instead of 4 x 8 -> 4 x 4 | Partly fixed | Olympic sets follow the budget (2-4 a station, low -> high across the block); barbell catches keep 3-5 reps; the 4 x 8 -> 4 x 4 ramp runs once across the block for DB / KB / pull variants. | `R02-19` |

## 03-soccer - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R03-1 | blocker | COD 6-12 cuts vs 120-160, sprinting 0 m vs 400-600 m | Fixed | D-73 athletic tracks + reconcile: COD 96 / 120 cuts and 240 -> 400 m of sprints a week, max-velocity work weekly. | `R03-1` |
| R03-2 | major | Six weeks of landing-only depth drops; plyo share printed from the target | Fixed | Landings RC1 only, repeated / reactive picks from RC2; planned share printed. | `R03-2`, `R02-17` |
| R03-3 | major | Lower-body share 43 % bilateral vs the 20 % -> 10 % target | Deferred | The laterality dial keeps the counted squat / deadlift bilateral, so a 3-day field plan cannot go below ~45 % bilateral; V28 now warns (0.52 vs 0.2). Needs the stance-swap work (see 06-7). | - |
| R03-4 | major | VOL1 12-15 reps for the whole off-season; VOL2 skipped | Partly fixed | Work lifts now take the heavier preference bracket (front squat 7-10, deadlift 7-10); the season-phase rep mapping (OFF_LATE -> VOL2/3) in shape.mjs is not done. | - |
| R03-5 | major | 14 Olympic / ballistic sets over 3 exposures vs the 2-6 budget | Fixed | Olympic exposures trimmed to the profile (2) and sets from the budget (4-6 a week); one ramp across the block. | `R03-5` |
| R03-6 | major | Mon 82 min, Friday 98-118 min with the Orange add-on | Partly fixed | Add-ons count as time and move to a separate session when the day is full; Monday still runs 81-84 min for the 75 picked and carries warning.long_day. | `R03-6` |
| R03-7 | major | Barbell deadlift variant on the non-axial hinge day; bent-over barbell rows on spine days | Fixed | Barbell hinges count as spine days (R2-SES-02); the non-axial day draws DB / KB hinges (double-KB deadlift); a bent-over barbell row next to the day's axial lift is penalised. | `R01-6`, `R06-8` |
| R03-8 | major | Upper body progresses faster than legs; 4 chest-fly sets; Focus quads on Saturday | Fixed | Main-day stairway with priority tiers (floored big muscles first): quads 10 -> 12, hamstrings 10 -> 13.25, chest 10 -> 12, back 10 -> 11; glutes targeted; Focus no longer carries stairway sets. | `R01-1` |
| R03-9 | major | Baseline test names no drill; from_zero for a 2-year athlete | Fixed | TEST items with protocols; same drill both weeks; from_zero = untrained only. | `R01-10`, `R02-6` |
| R03-10 | minor | Pre-season: 12 of 16 lifts drop to 1 set, Olympic keeps all 14 | Fixed | D-37 revised: about 60 %, work and paired lifts keep 2 sets, Focus / second calf / duplicate isolations go first, Olympic x the profile TE factor. | `R03-10` |
| R03-11 | minor | Contradicting box heights; box notes on plate hops | Fixed | One height from the exercise record; box notes only on box drills. | `R01-12` |
| R03-12 | minor | Near-duplicate exercises supersetted to meet 2-4 per group | Partly fixed | Second-of-group variety scoring (pattern / implement / grip) and no same-group supersets; stem stripping of "alternating / single-arm" names is not done. | - |
| R03-13 | minor | Superset partners with unequal set counts | Deferred | Needs a superset-aware placement step in volume.mjs (give the partner a matching set or render the extra set straight); not done. | - |
| R03-14 | minor | Spanish wording (jalón for pulls, pájaros, swing copy) | Deferred | Spanish strings stay PROPOSED for the coach's review (D-64); the KB swing copy no longer says "bar" (implement-aware copy). | - |
| R03-15 | minor | Core dosed in seconds with RIR; Nordics / Copenhagen under-dosed | Partly fixed | Holds in seconds, dynamic core in reps; Copenhagen 10-30 s; the soccer Nordic 2 x / Copenhagen 3 x weekly prehab rule is not mapped. | `R01-14` |
| R03-16 | minor | Practice days never placed (about 9 sessions a week) | Deferred | Needs intake/2 practice weekdays (contract change); not in Phase 0 scope. | - |
| R03-17 | minor | Weekly totals move in lumps (+8.1 % in week 4) | Fixed | Placed total rise <= 7 % with staggered releases (max rise 6.2 %). | `R01-2` |

## 04-crossfit-style-bootcamp - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R04-1 | blocker | Back 4, quads 5, hamstrings 5, calves 6 on 4 x 60 min; floor warning claims the schedule cannot fit | Partly fixed | Cut order for the class model: skill folds into the warm-up, the WOD holds 10 -> 15 min, then groups (D-78); the pull partners stay (keep_work_pair): back 9 -> 10. The 60-min class still cannot hold 10 sets for every muscle; the misses and the offer (one more day) are named up front. | `R04-1` |
| R04-2 | blocker | No set stairway at all (42 flat) | Partly fixed | D-67 sizing: 44 -> 46 main sets; WOD minutes and class levels carry most of the climb. A real set climb needs more minutes (offer shown). | `R04-1` |
| R04-3 | major | Two push days and one pull day | Fixed | Template amendment (review-v12 amendTemplates): DEADLIFT day gets its push partner, Friday becomes CLEAN + PULL; V29 checks pull >= 0.8 x push. | `R04-3` |
| R04-4 | major | Generic 10-15 reps; HALF TIME class levels ignored; hypertrophy rest on work lifts | Fixed | rules.reps.class_levels (strength 7/6/5/4, power, resistance) read by dose.mjs for hybrid_crossfit; strength rest (or rest after the pair) for work lifts; body-weight pulls capped. | `R04-4` |
| R04-5 | major | Alternating DB press as the work; DB floor press tested | Fixed | Work lifts prefer bilateral canonical barbell lifts in the kit (seated barbell press on Tuesday); tests stay on the locked work lift. | `R07-6` |
| R04-6 | major | Pulls only, 12 Olympic sets vs budget 5; clean on the hinge day | Fixed | Clean on the squat day, snatch on the deadlift day; class power table 3 sets; exposures trimmed to the budget (6 sets a week). | `R04-6` |
| R04-7 | major | Days 69-79 min; WOD midpoint and add-ons not counted; skill as a separate block | Fixed | WOD minutes from the dose, add-ons counted (the Green session moved to the WOD day), skill folded into the warm-up on over-time days. | `R04-1` |
| R04-8 | major | Time spent on duplicate rear-delt / chest isolations while back is cut | Partly fixed | Duplicate isolations and the second calf go before groups; back keeps its pair. Floors still missed on 60-min days (named). | - |
| R04-9 | major | Cardio test after a strength test and a WOD; protocols differ | Fixed | The cardio test sits on the aerobic day with the same protocol at both ends. | `R04-9` |
| R04-10 | major | WODs without reps / loads, EMOM stations that cannot fit | Fixed | dose.mjs WOD builder: reps or calories per station by format and level, rotation across the week, ball <= 20 lb. | `R04-10` |
| R04-11 | major | Validators green on a plan the coach would not sign | Fixed | H21 stairway_flat / total_flat / circuit_flat, V27 athletic budget, V29 push : pull, V28 share (warn), long-day check with the real minutes. | `R04-11` |
| R04-12 | minor | "Calf Raise - any", flat DB fly twice, dips note ignored | Partly fixed | Generic records are swaps only; week-wide uniqueness for isolations; station note tokens (dips / push-up) score the pick only where the template note matches. | `R01-11` |
| R04-13 | minor | Skill picks repeat the core block; DUBS / GYMNASTICS notes ignored | Deferred | Skill selection by station note and excluding the day's core picks is not done. | - |
| R04-14 | minor | Phase labels say "bigger steps" while sets hold | Deferred | Phase labels still come from the stair table; render does not yet suppress them on hold weeks. | - |
| R04-15 | minor | Biceps 1, triceps 2.5 shown as bare numbers | Fixed | Class-model and stay-active plans target every muscle (biceps 4.25 -> 4.5) and name the floor misses. | - |
| R04-16 | minor | Two aerobic sessions, no Blue; beginner run-walk for a 2-year CrossFitter | Deferred | D14 for crossfit_class still gives 2 sessions; level-based aerobic variants not done. | - |
| R04-17 | minor | [VIDEO_CONTACT] placeholder; 1-RIR header vs 3-RIR weeks; weight tip on a body-weight lift | Fixed | video.note resolved (@BLAZECAMP on Instagram), assertModel fails any [PLACEHOLDER]; the planned-effort drift line under the Basic Instruction; the week-1 tip skips tests. | `R04-17`, `R07-17` |

## 05-bootcamp - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R05-1 | blocker | No stairway: 84 sets flat, work seconds jump in 5-s lumps | Fixed | D-19 revised (D-72): work seconds climb by the planned steps, lambda-scaled to the top, in 1-s steps - 35 36 37 38 40 42 44 46 s; H21 circuit_flat / circuit_step_over_ceiling. | `R05-1` |
| R05-2 | blocker | Six muscles below 10 sets, floor exemption hides it | Partly fixed | Circuits are no longer floor exempt (floored list, V22 / H17 apply); the misses are named with the offer of a 4th day. Stations are not yet re-assigned to under-floor muscles. | `R05-2` |
| R05-3 | major | Session length ignores the work-time progression and the rest between circuits | Fixed | estimateMinutes takes the week's work seconds and adds 1 min between circuits; warning.long_day per weekday. | `R05-3` |
| R05-4 | major | 18 calf sets a week (two calf stations x 3 rounds) | Partly fixed | The bootcamp cut order removes the second calf station first (9 calf sets a week now); calf station 2 as a 1-round station is not modelled. | - |
| R05-5 | major | "Bent-Over Barbell Row" in a kit without a barbell | Fixed | amendExercise: a record named barbell requires the barbell token. | `R05-5` |
| R05-6 | major | Unloaded box squat vs advanced sissy squat / row | Partly fixed | Implement ladder by level (goblet / high-zercher DB squat now); assisted / home-substitute penalties. Sissy squat can still fill the second quad station in block 1. | - |
| R05-7 | major | Block 2 announced but nothing changes in the circuits | Fixed | Circuit stations take part in the block change (goblet squat -> high-zercher DB squat in block 2); a Nordic never fills a timed station. | `R05-7`, `R05-16` |
| R05-8 | major | Metabolic station cut while second calf / biceps stay; no ballistic or athletic work | Partly fixed | Cut order protects one metabolic station a day and cuts the second calf / duplicate isolations first. No ballistic medball / KB station is added for the general-population profile. | `R05-8` |
| R05-9 | major | Rear delts 3 own sets shown as 6 through helper credit | Deferred | Own-sets muscles are compared on direct sets in the stairway, but the circuit plan has no room for a second rear-delt station; deferred with the circuit station re-assignment. | - |
| R05-10 | minor | Weekly table shows no progression; work seconds missing | Partly fixed | Each week says what changed (work seconds, changes.circuit_longer); the macro table still shows sets, not rounds x seconds. | - |
| R05-11 | minor | Week-8 header: "replaces top sets" for a body test; MYO note with no MYO | Deferred | Test-week copy by test type and an intensifier note only when an item carries one are not done. | - |
| R05-12 | minor | Same row / calf raise on two days | Partly fixed | Week-wide second exposure for isolation slots; with this kit the table row still fills two pull slots (VPULL gap, see 05-13). | - |
| R05-13 | minor | No vertical pull (rows in both VPULL slots) | Deferred | A DB pullover as the VPULL substitute for no-bar kits is not tagged yet. | - |
| R05-14 | minor | Two posterior-chain stations back to back | Deferred | Circuit interleaving by region is not done. | - |
| R05-15 | minor | Unilateral holds without "per side"; long Copenhagen; RIR on holds | Partly fixed | Copenhagen 10-30 s and a hold cue instead of RIR; the side plank still prints 20-60 s without "per side". | `R01-14` |
| R05-16 | minor | Same cue on every station | Fixed | Effort key by station kind (effort.circuit_resistance / effort.circuit_metabolic). | - |
| R05-17 | minor | Warm-up is cardio only | Fixed | ensureWarmupPrep: every main day gets cardio + drills or mobility (ORD-08). | `R05-17` |
| R05-18 | minor | Raw tokens (pullup_bar), [VIDEO_CONTACT], "1 years", ES label / wording | Partly fixed | Equipment tokens by name (equipment.token.*), placeholder resolved and checked, BC3 label; the "1 years" plural and "lagartija" wording are left for the coach's ES review. | `R05-18`, `R04-17` |
| R05-19 | minor | "Calf Raise - any" and a reference-only record as main picks | Fixed | Program-only / reference-only records are swaps whenever a library record passes. | `R01-11` |
| R05-20 | minor | Share labelled "sport" for a general-population client | Deferred | intake.mjs D10 still keys the share on the generic profile row; the numbers match (50 / 50). | - |

## 06-full-body-aesthetics - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R06-1 | blocker | The plan does not climb (162 sets, +3 %); holds without check-ins | Fixed | D-67: the stairway is sized to 4 x 75 min first; non-priority duplicate isolation groups leave a day for the priorities; main total 89 -> 99, side delts (priority) 11 -> 18; no "hold" without a check-in (load_up). | `R06-1` |
| R06-2 | major | Every day over 75 min; aerobic add-ons outside the estimate | Fixed | Add-ons counted (separate sessions when the day is full); days 70-82 min (limit 82.5). | `R06-1` |
| R06-3 | major | Optional days became 80-min training days with 9 Focus slots | Fixed | Optional days hold their template's 2 Focus slots; target / floor / priority sets go to main days first. | `R06-3` |
| R06-4 | major | Posterior chain 5 days in a row; same exercise on back-to-back days | Partly fixed | Week-wide uniqueness for Focus / bonus picks; optional days keep 2 Focus slots. Muscle spacing around optional days is not checked. | - |
| R06-5 | major | Nordic curls 15-20 reps, also as a Focus | Fixed | Nordic never a Focus / circuit filler; rep hint caps it at 5-8. | `R06-5` |
| R06-6 | major | Work lift gets the fewest sets | Fixed | VOL-07 work-lift guard; compounds start at 3. | `R02-9` |
| R06-7 | major | Bilateral share never moves toward bilateral (stance swap) | Deferred | D10 now picks the bb_pl row (0.5 / 0.8 / 0.9) but the stance swap at exercise-block boundaries is not implemented; V28 warns (0.58 vs 0.9). | - |
| R06-8 | major | Kickstand barbell deadlift on the non-axial hinge day | Fixed | Counted spine class for barbell hinge variants; the non-axial day draws DB / KB / machine hinges. | `R06-8` |
| R06-9 | major | 10 x 10 m sprints with no running space; reference-only aerobic item | Partly fixed | Reference-only items are swaps; distance sprints are avoided without running space. The Blue session is still a run / walk interval with "any cardio tool" copy rather than an erg-specific item. | `R06-9` |
| R06-10 | major | MAX on the first item of the day and in 3-RIR weeks | Fixed | MAX only on the last small item and only at planned RIR <= 2. | `R01-16` |
| R06-11 | major | Zercher squat supersetted with a bent-over barbell row | Fixed | select.mjs penalises a bent-over barbell row next to the day's axial work lift. | `R06-11` |
| R06-12 | minor | Calves split into 2 + 1 sets and supersetted | Fixed | One calf exercise x 3 sets per leg day. | `R02-14` |
| R06-13 | minor | Non-competitive client labelled competitive NPC | Fixed | render.mjs uses profile.<id>.name_recreational for non-competitive clients ("Muscle & physique"). | `R06-13` |
| R06-14 | minor | L3 cut-off PROPOSED; L3 starts saturate 4 x 75 | Partly fixed | L3 stays flagged (D-01, round 3); the capacity sizing now steps the start down to what the minutes hold and says so (warning.start_lowered, offers). | `R06-1` |
| R06-15 | minor | Standing alternating cable press as the lead chest lift | Partly fixed | Block changes never lower the load ceiling of a station; the lead press is still alternating in some blocks. | - |
| R06-16 | minor | Mixed effort messages; RIR on timed holds | Fixed | Planned-effort drift line; holds use a form cue. | `R04-17` |

## 07-push-pull-legs - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R07-1 | blocker | No stairway in sets (+4.3 % over 12 weeks) | Fixed | D-67 sizing: 102 -> 118 main sets (+16 %), every muscle climbs in the second half or sits at its week-12 target; H21 stairway_flat guards it. | `R07-1` |
| R07-2 | blocker | Chest (priority) frozen at 21 vs 26 -> 30 | Fixed | Priorities that cannot reach their peak start lower and climb first (priority-first probe): chest 16.5 -> 21.5; the start change is named (warning.start_lowered, offer.lower_start). | `R07-1` |
| R07-3 | major | Warnings only after week 12 | Fixed | render.mjs noticesSection: warnings and schedule offers right after the header. | `R07-3` |
| R07-4 | major | Calves 9 (< floor 10) while Focus slots keep 3 sets | Partly fixed | Calves are named in warning.floor_schedule; one calf exercise x 3 per leg day; Focus is cut before calves on over-time days. Calves stay at 6 placed on 2 leg days. | - |
| R07-5 | major | Days 82 min for 75; add-ons outside the estimate (real days ~140 min) | Fixed | Days 63-75 min; add-ons are separate sessions on full days and counted otherwise. | - |
| R07-6 | major | Unilateral / alternating lifts as the work, bilateral barbell lift second | Fixed | select.mjs work_bilateral_canonical for physique / strength clients: barbell bench, row, squat, RDL as the work. | `R07-6` |
| R07-7 | major | Heavy preference shift lands on unilateral lifts; barbell -> machine at block changes | Fixed | The work is bilateral now; block changes never move a barbell main lift to a machine or lower its load ceiling. | `R07-6` |
| R07-8 | major | Share profile "sport" instead of bb_pl; share never moves | Partly fixed | D10 picks the bb_pl row (0.5 / 0.8 / 0.9); the stance swap is not implemented (V28 warns). | - |
| R07-9 | major | Tests and heavy work with hypertrophy rest | Fixed | Strength rest (180-360 s) for tests and heavy work lifts. | `R07-9` |
| R07-10 | major | Front squat (work) gets the fewest sets | Fixed | Work-lift guard (VOL-07). | `R02-9` |
| R07-11 | major | Barbell hinge twice a week (kickstand / alternating barbell deadlifts) | Fixed | Counted spine class for barbell hinge variants (H07). | `R01-6` |
| R07-12 | major | Nordic 15-20 reps | Fixed | Rep hint 5-8; never a Focus / high-rep filler. | `R06-5` |
| R07-13 | major | Assisted dips for a 4-year lifter; weighted -> assisted at block 2 | Fixed | Assisted records penalised for trained lifters; a block change never moves to an assisted version (noAssist). | `R07-13` |
| R07-14 | minor | Delivered rises +8.1 % / +8.2 % on small muscles | Fixed | Placed per-muscle rise <= max(1 set, 7 %). | `R01-2` |
| R07-15 | minor | MAX on 4-6 small exercises from week 1 | Fixed | MAX only at planned RIR <= 2 and on the last small item. | `R07-15` |
| R07-16 | minor | Calf note says 1 set but doses 2 | Fixed | One calf exercise x 3 sets per leg day; the 1-set second station note matches its dose. | `R02-14` |
| R07-17 | minor | Rep-max test item also carries the week-1 "pick a weight" tip | Fixed | dose.mjs suppresses the week-1 tip on test items. | `R07-17` |
| R07-18 | minor | 24 ab sets a week (over the L3 cap of 20) | Deferred | The core opener stays 2 x 2 on each of 6 days (core supersets save time, not sets); an abs cap on 5-6-day splits is not applied. | - |
| R07-19 | minor | Home substitutes (floor Y/T, prone DB curl) in a full gym | Fixed | Catalog tag home_substitute + select penalty when the gym holds the machine. | - |
| R07-20 | minor | Hip thrust twice a week; bent-over row = barbell row | Fixed | Week-wide uniqueness for Focus / bonus fills; implement-not-stated records are swaps only. | `R01-11` |
| R07-21 | minor | Near-duplicate lat pulldowns / cable raises back to back | Partly fixed | Second-of-group variety scoring (pattern / implement / grip); exact-stem stripping is not done. | - |
| R07-22 | minor | Competitive NPC label for a non-competitor | Fixed | Recreational profile name for non-competitive clients. | `R06-13` |
| R07-23 | minor | Hardest weeks and max tests on Christmas / New Year | Deferred | Holiday notices need a calendar rule (shape.mjs); not done. | - |
| R07-24 | minor | 1 triceps isolation per push day; split days checked against 2 per group | Deferred | V23 still checks split days against the full-body lower bound; the 3-4-per-group split rule needs the coach (R3-SES-01). | - |
| R07-25 | minor | Intensifier flag on heavy compounds in week 12 | Fixed | rirEffort never sets the intensifier on never-to-failure rep classes. | `R07-25` |
| R07-26 | minor | "2 Mile Run" item prescribed as 30-40 min | Deferred | Aerobic items still render the library name next to the colour and minutes. | - |

## 08-pickleball-genpop - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R08-1 | blocker | Mon ~81 / Thu ~77 min for 2 x 45 (16 items) | Fixed | Stay-active cut chain (one athletic piece a day keeping the throw, one light Olympic piece, arm care to the optional day, knee / Achilles care kept), the core pair alternates, work starts at 2 sets under 60 min: Mon 50, Thu 43-49 min; offers (3 days) shown up front. | `R08-1` |
| R08-2 | blocker | Main-day sets never move (2 2 2 2 ...); no stairway | Partly fixed | Isolations enter at 1 set when the minutes leave no room (VOL-07) and climb: main total 20 -> 23, leg curl / leg extension / calves climb. The big lifts stay at 2 sets inside 45 min (named: warning.stairway_time, offer of a 3rd day). | `R08-2` |
| R08-3 | blocker | Glutes 2, side delts 0.5, biceps / triceps ~1-2 for a stay-active client | Partly fixed | Stay-active muscles are targets (floor 10, D-07 revised) and the floor misses are named up front; with 2 x 45 min the main days still place glutes ~1 and side delts / arms only on the optional day. | `R08-3` |
| R08-4 | blocker | Zercher squat and deep lateral lunge labelled "protect your knee" | Fixed | deep_knee_flexion tagged on deep squats / lunges / drops (D-70); knee pain picks step-ups / machines. | `R08-4` |
| R08-5 | blocker | Single-leg / weighted depth drops for a 52-year-old with knee pain | Fixed | No depth drops for the 50-59 racket overlay or knee pain; landings RC1 only; low box jumps / ankle hops. | `R08-5` |
| R08-6 | major | Plyo contacts 6-8 x over budget; printed share is the target | Fixed | Contacts reconciled to the budget (V27); planned share printed. | `R08-6`, `R02-17` |
| R08-7 | major | 0 medball throws; core 100 % sagittal flexion | Fixed | Throw station kept on stay-active days (one athletic piece a day keeps the throw); core picks follow the plane mix (rotation / anti-rotation). | `R08-7` |
| R08-8 | major | Olympic 4 sets x 2 days on the strength ramp | Fixed | Stay-active policy: one light piece, 2 sets of 3-6 (2 x 3 in heavy-play weeks), no 4 x 8 ramp. | `R08-8` |
| R08-9 | major | Copenhagen plank as Achilles care; missing wrist / balance / soleus work | Fixed | Preferred joint-care lists per injury code (soleus calf raise, tibialis raise, Y/T arm care); knee / Achilles care each leg day (D-32). | `R08-9` |
| R08-10 | major | Knee pain pushed the share toward bilateral barbells | Partly fixed | Pain shift now toward single-leg work (share 0.1); the Thursday hinge is still an alternating barbell deadlift (split stance, counted spine day). | `R08-10` |
| R08-11 | major | Fly-heavy Focus and near-failure calves / hamstrings the day before two play days | Fixed | Optional-day Focus only for priority or small floor-lifted muscles; no lower-body or calf work < 48 h before play. | `R08-11` |
| R08-12 | minor | 10-15 reps for 12 weeks; 15-rep barbell deadlifts to 1 RIR | Fixed | Stay-active compounds 12-15 -> 8-12 from exercise block 2 (rules.reps.stay_active_compound_by_block). | `R08-12` |
| R08-13 | minor | Running A-drills and run intervals for a knee-pain player with no running space | Partly fixed | Balance / reactive-stepping warm-up for court players; the Orange session still names a run / walk interval (any cardio tool). | `R08-13` |
| R08-14 | minor | Joint-care Y/T and face pulls credit nothing; rear-delt shortfall reported | Fixed | Prehab credits by catalog (rules.prehab.credits by_catalog); shoulder care never a third rear-delt item on a day. | - |
| R08-15 | minor | Advanced renegade row for an L1; calf load drops in block 3; block table hides block 3 | Partly fixed | Block changes never lower the load ceiling or regress to an assisted version; level-band scoring of block-change candidates and a per-block column in the block table are not done. | - |
| R08-16 | minor | Header 1 RIR vs 3-RIR weeks; "a 8.0" / "a 11.0"; jargon in titles | Fixed | Effort-drift line, "Effort level this week: 8", plain day titles. | `R08-16`, `R02-12` |

## Random-corpus limits (tests run as `todo`, tests/invariants/invariants.test.mjs)

The stricter checks added in this round pass on all 8 samples, the 52 picker sports and the 26 activities except where listed; on the 300 seeded random intakes these remain:

- **V27** (2 of 378): wall-ball / sit-up throws are dosed at fixed reps, so a small weekly throw target can be exceeded (the per-week station trim does not resize fixed-rep throws).
- **H21** (9 of 378): a muscle whose only day sits at its per-session cap on 6-day crossfit / athletic templates stays flat although the peak probe sized room for it; in one plan (sport-45) a block change flips a hinge work slot to a glute bridge and the hamstring sets drop.
- **H10 / V15** (1 of 378): a 2 x 30 min plan adds a bonus slot and a set at an exercise-block boundary (+14 %).

