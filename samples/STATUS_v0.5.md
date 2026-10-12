# Engine 0.5 status

Written 2026-10-11, at the end of work package V4 (integrate). Engine 0.5.0, model 1.3.0. Nothing here is committed or pushed.

## In one paragraph

The engine now builds plans the way the coach's newest answers ask: his own day templates, sized by exercise count, with no time fitting. All 8 sample plans come out complete and pass every check. The A/B days and the push / pull / legs days now match his sheets slot for slot. The benchmark of 102 plans went from 673 hard-rule violations in 55 plans to 26 in 5 plans, and every rule added in v0.5 holds in every plan. The athletic layer (jumps, throws, sprints, Olympic sets) is the main part still short of its targets.

## What changed in v0.5

Work packages V1 to V3 did the large changes. V4 ran everything from clean, read the plans against the coach's sheets and fixed what was wrong.

### V1 to V3 (already reported)

- **No time fitting.** Session minutes are not an input and never cut or change a plan. Each day prints an average time as information.
- **His templates.** Days are built from his skeletons: A (pull + knee dominant), B (push + hip dominant), the 3-day builder, push / pull / legs, the athletic days, bootcamp, the CrossFit class, HYROX, strength.
- **Session size by exercise count.** General 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6.
- **Progression.** Whole weekly sets per muscle group climb to the planned final sets in the last week. A week that adds more than about 15% is marked. Reps and load are a rule the person applies.
- **Nothing dropped.** What a template cannot hold is named in the plan.
- **Library.** The 29 proposed exercises are optional add-ons. Carries and sleds are dosed by distance or time. Every exercise has a YouTube search link and a name to copy.
- **Words and safety.** No plan without accepting the terms and release. The release line is on every plan in English and Spanish.
- **Editing.** Sets, exercises and blocks can be edited; totals are recomputed and the plan is marked edited.

### V4 (this package)

Each item was found by reading the samples against `dumps/BYOP`, or by the benchmark.

1. **A/B and push / pull / legs days keep each slot's laterality.** Before, a dial that shifts plans toward two-leg or single-leg work rewrote his slots in later weeks. In sample 06 the lunge slot became a pendulum squat from week 5, the single-leg hinge became a back extension, and slot 1 was a one-arm row. Now a two-leg slot holds a two-leg lift and a single-leg slot a single-leg lift in every week, and the A day's first row is a two-arm row.
2. **Push / pull / legs prints in the order of his sheet.** Flies now come before dips. Leg extension and leg curl come before the single-leg hinge. The two triceps slots pick "push" (push-down) then "overhead".
3. **A Focus slot no longer pushes a muscle group over its top number.** A 16-year-old basketball guard had hips at 22 weekly sets from week 1 against a top of 16, flat for 12 weeks. Now those extra Focus slots close and the group climbs 14 to 16 on the main days. 8 of the 94 benchmark plans change.
4. **The athletic block keeps its order:** sprint, jump, ankle hops, throw, cuts. A superset suggestion used to move the throw ahead of the ankle hops in 29 plans.
5. **Every main day opens with a warm-up.** The 5-day hybrid Friday had none.
6. **Older adults and "no floor work".** A 74-year-old beginner with body weight only was given handstand work three times in one circuit, plus glute bridges and slider curls. Handstand work is now never picked for people 60 and over. "No floor work" now removes lifts done lying or kneeling on the floor and keeps the push-up with hands on a bench.
7. **The block table lists exercises in session order.** A jump station that a test replaced in week 1 was printed at the bottom, under the lifts.
8. **The benchmark scorer reads four rules the way the engine applies them on purpose** (scorer 2.1). Details are in the benchmark section.

## Do the sample days match his sheets?

Checked against `dumps/BYOP/00_AESTHETICS_FULL_BODY_4_DAYS`, `01_3_DAY_BUILDER` and `02_PUSHPULLLEGS_3_or_6_DAYS_A_WK`.

**Sample 06, Day A (Monday and Thursday)**

| Slot | His round-4 answer | Sample 06, Monday | Sample 06, Thursday |
|---|---|---|---|
| 1 | Horizontal pull, two-arm | Seal row (DB, then barbell) | Bent-over barbell row |
| 2 | Squat, two-leg | Front squat | Leg press |
| 3 | Vertical pull | Single-arm lat pulldown | Lat pulldown (rope) |
| 4 | Lunge, single-leg | Rear-foot-elevated lunge | Stationary lunge |
| 5 | Biceps | Spider curl, then lying curl | Concentration curl |
| 6 | Leg extension | Leg extension | Sissy squat |
| 7 | Calves, 3 sets | Machine calf raise | Machine calf raise, one leg |

**Sample 06, Day B (Tuesday and Friday)**

| Slot | His round-4 answer | Sample 06, Tuesday | Sample 06, Friday |
|---|---|---|---|
| 1 | Horizontal push | Barbell bench press | Incline barbell bench press |
| 2 | Hinge or hip thrust, two-leg | Barbell hip thrust | Hex-bar deadlift |
| 3 | Vertical push or incline | High-incline barbell press | High-incline DB press |
| 4 | Single-leg hinge | Staggered-stance DB deadlift | Alternating staggered deadlift |
| 5 | Triceps | EZ-bar skullcrusher | Cable push-down |
| 6 | Leg curl | Seated leg curl | Lying leg curl |
| 7 | Side raise | Seated DB lateral raise | Leaning cable side raise |

Two differences from the sheet, both on purpose:

- **Order inside a pair.** His sheet lists the leg lift first (leg press, then row). His round-4 answer lists the upper lift first (row, then squat). The engine follows round 4 because it is newer.
- **Side raise first on B days in sample 06.** Side delts are this client's Focus muscle, and his rule (ORD-04) puts a priority muscle first. Without that Focus the side raise is slot 7, as in his sheet. Calves are last on A days for the same reason: his sheet puts them first, and ORD-04 says first only when they are a priority.

Heavy squat is Monday and heavy deadlift is Friday. Thursday's squat slot is a leg press and Tuesday's hinge slot is a hip thrust, so the spine is loaded once per pattern per week.

**Sample 07, push / pull / legs**

| Day | His sheet | Sample 07 |
|---|---|---|
| Push | Horizontal push, vertical push, incline, flies, dips, triceps push, triceps overhead | Bench press, high-incline press, incline DB press, DB fly, weighted dip, push-down, skullcrusher |
| Pull | Horizontal pull, horizontal pull, vertical pull, side raise, reverse fly, biceps, biceps | Barbell row, one-arm DB row, lat pulldown, lateral raise, reverse fly, incline curl, concentration curl |
| Legs | Two-leg squat, two-leg hinge, lunge, leg extension, leg curl, single-leg hinge, Focus 1 | Back squat, hip thrust, forward lunge, leg extension, leg curl, staggered DB deadlift, calf raise |

Sample 07 has no leg Focus muscle (Focus is chest and back), so the legs day holds a calf raise where his sheet has "Focus 1".

## Tests

| Run | Result |
|---|---|
| `node tools/fixture/build-fixture.mjs` | ok |
| `node tools/compile-model.mjs` | ok. One old cross-check note, not new: X04, week-12 effort for a 16-week plan |
| `node tools/check-model.mjs` | 0 errors, 0 warnings |
| `node --test tests/` | 1,333 tests: 1,327 pass, 0 fail, 2 skipped, 4 to-do |
| `node tools/generate-samples.mjs` | 8 of 8 ok, 0 failing error checks |
| `node tools/sweep.mjs 1500 --render` | 1,578 plans on each of the two models: all ok, 0 failing error checks |
| `node design/bench/selftest.mjs` | 49 of 49 |

- 49 tests are new in V4 (`tests/v05-integrate.test.mjs`), named by coach answer id.
- 4 older tests were converted because they asserted the behaviour that V4 changed. Each has a one-line reason in `engine/DECISIONS.md`, section G.
- The 4 to-do tests are all in the athletic layer and were open before V4.
- The 2 skipped tests need the compiled model and run on it; they skip only on the fixture copy.

## Benchmark

94 benchmark intakes plus the 8 samples. Results: `design/bench/results_v05.json` and `design/bench/V05.md`, beside the 0.4 baseline.

| | Engine 0.4 baseline | 0.5 at the start of V4 | 0.5 now |
|---|---|---|---|
| Scorer | 1.0 | 2.0 | 2.1 |
| Mean score | 64.4 | 94.48 | 95.59 |
| Lowest score | 27.6 | 85.15 | 86.71 |
| Hard-rule violations | 2,228 | 673 | 26 |
| Plans with none | 12 of 102 | 47 of 102 | 97 of 102 |
| Plans passing every row | 1 | 27 | 48 |

The baseline used an older scorer with time metrics, so compare it loosely. The start-of-V4 run is kept as `design/bench/V05_PRE_V4.md`.

**Where the 647 went.** Engine fixes removed about 550: athletic order 453, Focus slots over the top number 48, missing warm-up 36, the handstand plan 12. Scorer corrections removed about 100: MYO placement 46, end-test week 48, ankle hops in stage 1 4. In each of those the scorer disagreed with a rule the engine already applies on purpose:

- **MYO set.** The engine never puts it on a barbell lift, a Nordic curl, a sissy squat, or calves for a sport with an Achilles hot spot. The scorer did not know those exclusions.
- **End-test week.** On test days the engine runs the first week's lighter athletic dose so the test is fresh. The scorer counted that as a drop. It still counts a fall of more than 25% under week 1, and any fall in another week.
- **Ankle hops.** The engine allows low ankle hops in the first jump stage. The scorer allowed them only in one slot.

**The 8 samples in the benchmark.** None has a hard-rule violation.

| Sample | Score | Rows that fail |
|---|---|---|
| 01 Swimming | 97.41 | A12 |
| 02 Football | 96.85 | A12 |
| 03 Soccer | 92.22 | A12, A13 |
| 04 CrossFit-style class | 91.62 | A12 |
| 05 Bootcamp | 92.23 | A11, A12 |
| 06 Full-body aesthetics, A/B | 99.42 | none |
| 07 Push / pull / legs | 99.42 | none |
| 08 Pickleball | 92.03 | A11, A12 |

A score is 100 minus points lost; it is the scorer's number, not a coach grade.

**Rows that pass in all 102 plans:** floors and the 2-day rule, his templates, session size, final sets reached, never fewer sets than the week before, no time fields, progression words, library rules, liability gate, same plan every time.

**Rows that still fail**

| Row | What | Number |
|---|---|---|
| A1 | Hard-rule violations | 26 in 5 plans |
| A11 | Something not said | 36 in 29 plans |
| A12 | Athletic dose under target | 379 in 45 of 63 athletic plans |
| A13 | Two-leg share near the dial's target | 86.5% of blocks, target 95% |

## Known gaps

**Hard-rule violations left (26 in 5 plans)**

- **HYROX competitive, 4 days: back above its top number** (16 weekly sets against 13, all 12 weeks). His HYROX week holds 8 pulls; at 2 sets each that is 16. "Template comes out complete" and "never above the top number" disagree here. The plan does not say so yet.
- **Three plans: shoulders about 1.5 sets over the top number in the last 4 weeks** (a 15-year-old cheer flyer and two older 2-day racket players). Direct sets are within the top. The extra comes from the quarter-set credit of presses.
- **CrossFit individual, 5 days: jumps over budget in weeks 2 and 3.** The sport's jump target starts at 0 and two jump stations at their smallest dose already give 24 contacts.

**Athletic layer**

- Olympic sets, sprint metres, cuts and ankle contacts are often under the sport's weekly target. The plan says so for jumps, ankle hops, throws and cuts. It does not say so for Olympic sets (20 cases), or for a quality with a target and no station at all (16 cases, mostly older adults and 2-day plans).
- 4 to-do tests: sprint metres hold flat for 5 weeks in the football plan; the soccer week keeps a push-up box jump; the soccer pre-season holds 72 cuts against 108 in the last off-season week; one early-peak check needs a new test case.
- **Open for the coach:** the athletic days still use the two-leg / single-leg dial, because his earlier answer asks for 80-90% single-leg work for field and court athletes. Should athletic A/B days also keep a two-leg squat and a lunge in every block?

**Volume on A/B days**

- **Sample 06, chest: 13 weekly sets against a planned 25, flat for 12 weeks.** Each B day has one chest slot (5 sets) and the optional day adds one bonus exercise (3 sets). Back, biceps and triceps are also capped (23, 18 and 17 of 25). The plan says so. Push / pull / legs reaches every target (sample 07: chest 27).
- **Open for the coach:** should the incline press in slot 3 count for chest? His sheet labels that slot "Chest/Shoulders". Today it counts for shoulders only.
- **No rear-delt exercise on A/B plans at 7 exercises a day.** The rear-delt slot is the 8th exercise of the A day and the default is 7. His earlier answer says rear delts need their own sets. Push / pull / legs has a reverse fly on both pull days.

**Selection**

- **Limited kits repeat the lead row.** With dumbbells only or kettlebells only, both A days pick the same two-arm row (2 of 94 plans).
- **Football sample: the tested squat is a Zercher squat.** It is a legal pick, but his athletic sheets use front squats and low-bar back squats.
- **"No floor work" and the core block.** The library has almost no standing core exercise, so a body-weight plan with that exclusion still gets floor core drills. Adding 3 or 4 standing core exercises would fix it.
- **The upper-body two-arm share misses the dial's target on A/B days** (soft metric, 69 plans). Three of the four upper slots are two-arm by his template, so a 50% target cannot be met. The target needs his review for template days.

**Not built, by decision**

- The large two-stage planner in `design/PLANNER_SPEC.md`.
- The website or form people will use.
- Spanish exercise names and cues: 843 machine-translated lines wait for the coach.

## What comes next

1. Coach-eye review of the 8 sample plans, graded, with fixes and a re-review. The goal in the plan is B+ or better on every sample.
2. The athletic layer: dose steps, pre-season sizing, and saying every shortfall.
3. The coach's answers to the open questions above.

---

# Fix round 1 (2026-10-11)

## In one paragraph

Eight coach-eye reviews graded the samples from C to B. They found 31 major problems and many small ones. This round fixed the major ones in the engine and its data, never in a plan. Every fix has a test named after the coach answer it reads. All 1,376 tests pass. The 1,578-plan sweep has no failing error check. The benchmark mean went from 95.59 to 97.49 and no plan scores lower. The samples in `samples/plans` are regenerated. Complaints about session length were left alone, because the plan is sized by exercise count (CT-01). The samples now need a second coach-eye review.

## What changed, sample by sample

**01 Swimming (was B-)**
- The floor of 10 weekly sets is now held on the training days. If a group needs the optional day to reach 10, the plan says so at the top.
- In a test week the tested lift comes first in the day's lifts. The test replaces that lift's top set. It no longer adds a set.
- Steps are spread over the weeks. Totals: 65 66 68 68 68 70 72 73 75 78 81 84.

**02 Football (was C+)**
- Slot 2 is a two-leg lift on all four days again: front squat Monday, leg press Thursday, back extension Tuesday, stiff-leg deadlift Friday.
- The tested squat is the front squat (it was a Zercher squat).
- Pulling sets are never under pressing sets in any week. Shoulders no longer end above the back.

**03 Soccer (was C+)**
- The athletic block now holds its weekly numbers. A 3-day week asks for three quarters of the 4-day soccer numbers. This scaling is the engine's own proposal (see the open questions).
- The pre-season weeks keep the jumps, cuts and sprint metres of the off-season block.
- Shoulders end at 14, under the back (19). They ended at 16.5, above the back. Reps move to the heavier phase after week 3.

**04 CrossFit-style class (was C+)**
- The class press is the standing strict press at 3 sets in every week. It was at 1 to 2 sets for most of the block.
- Triceps have their own exercise on the press day and the deadlift day. Quads train on two days.
- The for-time workout grows by rounds, and the time cap follows the work. The barbell thruster prints a bar load. Each week has a pull-up, an inverted row or toes-to-bar in a workout.

**05 Bootcamp (was B-)**
- Each session keeps the coach's own five stations. A day is one circuit of 7 stations.
- At 4 rounds every trained group holds 10 sets or more. Biceps and triceps were at 8.
- The Kong row is gone. With dumbbells and kettlebells only, the same two rows repeat on Monday and Friday, the second time with a pause.

**06 Full body, aesthetics (was C+)**
- Chest climbs from 17 to 20.5 weekly sets. It sat at 13 for 12 weeks. The incline press in slot 3 now counts for chest.
- The glute lifts go from 7 to 11 direct sets (the Focus muscle takes its group's steps first). They sat at 7 for 12 weeks.
- Curls and triceps exercises on training days hold 3 sets, and 4 in the hardest weeks. The rest goes to the optional-day bonus exercise and to one extra small exercise at the end of a day.

**07 Push / pull / legs (was B)**
- Calves climb from 6 to 10. Side raises hold 8 direct sets from week 1 and 9 at the end. They held 4 to 6.
- Both leg days use the leg-extension and leg-curl machines. No more sissy squats and Nordic curls in those slots.
- "Tricep - Overhead" is an overhead extension on both push days. The tested deadlift is the conventional deadlift. One bent-over barbell row a week.

**08 Pickleball, 52, knee pain (was C)**
- Both days keep a two-leg lift: hack squat on Monday, back extension on Thursday. No deep single-leg knee bend.
- A day holds 9 exercises and the count is honest (it printed 8 and held 11). Calves are trained 3 sets on both days.
- Joint care now sits inside the plan's own lifts (calf raise, leg extension, face pull). The home leg extension on the hip day is gone.
- One jump station a day and a throw on both days. The box stays low in every stage.
- The MYO set never lands on the painful knee. The plan explains what a MYO set is.
- The back climbs from 6 to 8. Totals: 34 34 35 35 35 36 36 37 37 38 40 42.
- The plan is now also written in Spanish (`08-pickleball-genpop.es.md`).

## Numbers

| Check | Before this round | After |
|---|---|---|
| Tests (`node --test tests/`) | 1,333 (0 failing) | 1,376: 1,370 pass, 0 fail, 4 to-do, 2 skipped |
| New tests | - | 43 in `tests/v05-fix1.test.mjs`, named by coach answer |
| Older tests converted | - | 49 (each with a one-line reason in `engine/DECISIONS.md`); none retired |
| Sweep, 1,578 random plans on each model | 0 failing error checks | 0 failing error checks, 0 render problems |
| Sweep warnings: pulling under pressing (V29) | 505 plans | 221 plans |
| Benchmark mean score (102 plans) | 95.59 | 97.49 |
| Benchmark lowest score | 86.71 | 88.57 |
| Benchmark hard violations | 26 in 5 plans | 5 in 3 plans |
| Plans scoring lower than before | - | 0 (83 higher, 19 the same) |

Sample scores: 01 97.41 to 99.13, 02 96.85 to 98.45, 03 92.22 to 99.00, 04 91.62 to 91.83, 05 92.23 to 92.23, 06 99.42 to 100, 07 99.42 to 99.42, 08 92.03 to 94.61.

**The scorer changed too (2.1 to 2.2).** Read this before trusting the comparison. Several scorer readings disagreed with rules the engine now applies on purpose. Each one was changed to read the model's own rule, and each is listed in the header of `design/bench/score.mjs` and in `engine/DECISIONS.md` G-74. Three of them make the scorer more lenient for old plans as well as new ones: the upper-body two-arm share is judged against what the plan could reach, the two-exposure check no longer counts a day that does not train the group, and a fly no longer counts as a press. One reading is stricter (the floor on training days). So part of the rise from 95.59 to 97.49 comes from the scorer, not from the plans. The earlier run is kept as `design/bench/results_v05_pre_fix1.json`.

## Not fixed in this round

- **3 hard violations remain in the benchmark:** a HYROX plan with shoulders above their ceiling for 2 weeks, a CrossFit plan with more jumps than its scaled target, and one MYO set the scorer places on a different exercise.
- **Samples 04, 05 and 08 still lose points on athletic work** (target not reached, or flat for weeks). 04 and 05 did not improve in score.
- **Small kits run out of library lifts.** Sample 05 repeats two rows and uses a dumbbell leg extension that is not in his live library.
- **No new validator checks were added.** The new rules are covered by tests and by the scorer, not by a V-check that fails a plan.
- **Many minor review items are open**: header wording for the exercise count, the effort schedule per level, swap notes, cardio placement lines, the warm-up dose, the "swapped to protect your knee" note on lifts that were not swapped, renaming the Kong row record.
- 4 older to-do tests on the athletic layer are still open.

## Open questions for the coach

1. **High-incline press credit.** It now counts 1 for front delts and half a set for chest. Is half right?
2. **Athletic A/B days.** Slot 2 is now a two-leg lift on every day, so athletes do less single-leg work than his earlier 80-90% answer. Is that what he wants?
3. **2- and 3-day athletic weeks.** They ask for three quarters of a 4-day profile's jumps, throws, cuts and sprints. Is that the right scale?
4. **Class deadlift day.** It now has a lunge so quads train twice a week. Lunge, or a leg press / goblet squat?
5. **Pull against push.** Pulling is held at or above pressing only for sports whose profile asks for it. Should every plan do this?
6. **Non-competitive adult (pickleball).** The day is sized 5 to 10 exercises from his sheet. Confirm.
7. **Side delts on a physique plan.** At least 4 / 6 / 8 direct sets by level. Confirm.
8. **Small kits.** May the two-arm bent-over dumbbell row and the chest-supported dumbbell row be used as regular picks? Today they are swaps only.
9. **In season.** When a session falls the day before a game, it is made the lighter one. Confirm.


---

# Fix round 2 (2026-10-11)

## In one paragraph

Eight coach-eye reviews graded the regenerated samples from B- to B+ (01 B-, 02 B, 03 B-, 04 B-, 05 B-, 06 B, 07 B+, 08 B). This round worked on every major problem in the engine and its data, never in a plan. Each fix has a test named after the coach answer it reads. All 1,407 tests pass. The benchmark mean went from 97.49 to 97.67 and no plan scores lower. Part of that rise comes from scorer changes, which are listed below with what the numbers would be without them. Not every reviewer suggestion could be met at once: the list of what is still open is at the end, with one new question for the coach. The samples in `samples/plans/` are regenerated. Rule layer: `tools/fixture/v05-fix2.mjs`. Decisions: `engine/DECISIONS.md` G-76 to G-96.

## What changed, sample by sample

**01 Swimming (B-)**
- Core: no carry and no swap-only record opens a day. The suitcase carry is now an optional add-on like the farmer carry. The swimmer has a low-back hot spot, so his six core slots are planks, side plank, Copenhagen plank, dead bugs and bird dogs; one drill runs twice a week, at least two days apart, instead of a crunch.
- Presses: no barbell press. Wednesday is a flat dumbbell bench press plus an incline dumbbell press (the third chest lift), so the chest floor no longer rests on two lifts at 5 sets.
- Jumps: no hex-bar jump squat (an empty bar is over 20 % of his body weight) and no loaded jump in the first block. No push-up plyo for a swimmer's shoulder: that slot is a leg jump.
- Sets: the floor of the training days is filled before the optional day's fly takes a set.

**02 Football (B)**
- Sprint buy-out: 1 x 20 calories, then 2 x 15, then 3 x 10, all out. It was a long conditioning piece.
- The aerobic session that follows lifting is the easy one (Orange). The hard intervals have Wednesday to themselves. A day that ends with an aerobic session has no buy-out.
- Core for a 230-lb athlete with a low-back hot spot: planks, dead bugs, bird dogs. No hanging raise opens a day.
- No weighted pull-up as the default pull for a 2-year lifter.

**03 Soccer (B-)**
- The back no longer grows past its sport-scaled final sets to balance the presses (it was the biggest group at 19). Reverse flies and face pulls count as pulling.
- Single-leg work: the third day's knee lift is a single-leg lift, and the "Chest / Shoulders" press is the alternating incline press. The plan says in one line what the template still holds two-sided (45 % against the sport's 20 %).
- A third chest lift, as in sample 01.

**04 CrossFit-style class (B-)**
- Class days now name a skeleton, so the checks read them. The lunge moved from the deadlift + push day to the clean + pull day. The day's first row is a two-arm row.
- Olympic lifts in block 1 are the hang power clean and hang power snatch (not pulls only).
- The core opener is light in every week and is no longer a weighted sit-up or an L-sit before the deadlift.
- Week 8 is the test week: groups reach their final sets in week 7 and hold.
- Arm work: the extra small exercise goes to the group missing the largest share.

**05 Bootcamp (B-)**
- Each session keeps his own slots in his order. Wednesday reads: slam, deadlift, floor press, curl, push-up variant, overhead press, skullcrusher.
- No table row and no "DB leg extension on a box": the quad station is a step-up, the second chest station a push-up variant.
- The kit has no vertical pull. The plan says so up front, and Monday's second back station is a rear-delt fly instead of one more row. Back is 12 sets (was 16), chest 12, every trained group at 10 or more.
- Timer: 35, 35, 40, 40, 45, 45, 50, 50 seconds, and a 5th round in the last two weeks (it was 35, 36, 37, 38 ... at 4 rounds).

**06 Full-body aesthetics (B)**
- Chest sits on four presses (an incline press on both B days) instead of 5-set lifts and a 4-set fly from week 1.
- The A day's own rear-delt exercise is in the plan every week.
- The weekly table shows the sets the plan really runs.

**07 Push / pull / legs (B+)**
- A compound lift reaches 3 sets before an isolation exercise of its group takes more; a later exercise is never above an earlier one of its group.
- The printed schedule matches the plan.

**08 Pickleball, knee pain (B)**
- The pain line is said once at the top. "Chosen to protect your knee" prints only under a lift the pain changed. Knee lifts carry a "pain-free depth" cue.
- Swaps: no placeholder "Lunge", no bar-on-the-back squat for a beginner with knee pain.
- Core for a 52-year-old with a low-back hot spot: planks, dead bugs, bird dogs; no leg raise or crunch.

## Numbers

| Check | Before this round | After |
|---|---|---|
| Tests (`node --test tests/`) | 1,376: 1,370 pass, 0 fail | 1,407: 1,401 pass, 0 fail, 4 to-do, 2 skipped |
| New tests | - | 31 in `tests/v05-fix2.test.mjs`, named by coach answer |
| Older tests converted | - | 36 (each with a one-line reason in `engine/DECISIONS.md`); none retired |
| Benchmark mean score (102 plans) | 97.49 | 97.67 |
| Benchmark lowest score | 88.57 | 89.35 |
| Benchmark hard violations | 5 in 3 plans | 3 in 2 plans |
| Plans scoring lower than before | - | 0 (29 higher, 73 the same) |
| Scorer self-test | 51 pass | 51 pass |
| Sweep, 1,578 random plans on each model | 0 failing error checks | 0 failing error checks, 0 render problems, 0 throws |
| Sweep warnings: pulling under pressing (V29) | 221 / 220 plans | 173 / 174 plans (the check now counts reverse flies and face pulls as pulling and leaves out joint-care sets, like the engine's own rule) |
| Sweep warnings: one-arm / two-arm share (V28) | 76 / 75 plans | 92 / 91 plans (more days keep a two-arm lift by rule: class days, the incline slot) |

Sample scores: 01 99.13 to 99.13, 02 98.45 to 98.85, 03 99.00 to 99.00, 04 91.83 to 92.83, 05 92.23 to 92.23, 06 100 to 100, 07 99.42 to 100, 08 94.61 to 94.61. The previous run is kept as `design/bench/results_v05_pre_fix2.json` and `V05_PRE_FIX2.md`.

**The scorer changed too (2.2 to 2.3).** Read this before trusting the comparison.
- Seven readings follow rules this round added on purpose (a high-incline press is a press; the youth exemption for dumbbell bench presses; the template's own rear-delt station; the staircase with a compound lift at 3 sets first; the circuit timer steps; the free knee slot of a cutting sport). One reading got stricter: a carry as a station's pick now counts as an add-on pick.
- Three readings fix gaps in how 2.2 judged the one-arm / two-arm share: presses of a heavy-powerlifting profile and the incline-first slot are two-arm by the engine's own rules, and the number of one-arm lifts is now counted on the client's kit. These three do not change any plan.
- Without those three, the same plans score a mean of 97.56, and 4 plans would score lower than before: bench 16 (-0.58), bench 51 (-0.58), bench 94 (-0.21) and bench 63 (-0.19), all on the upper one-arm share. In bench 94 the cause is this round's two-arm first row on class days; in the other three the sets moved between lifts and crossed the metric's threshold.

## Not fixed in this round

- **05, hips.** The reviewer asked for 12 direct hip sets with a bridge or hip thrust. The plan holds 8 direct sets plus helper credit (11). With 7 stations a session, the chest floor of 10 and as many pulling as pressing stations, there is no room for a third hip station. This is the new open question below.
- **05, Friday's first row** repeats Monday's chest-supported row. The kit holds two different two-arm rows and the one-arm version of one of them.
- **05, Monday core**: the Copenhagen plank is still the day-1 pelvis exercise for a general-population client.
- **01, core planes.** With the core on the live library the swimmer's week holds one anti-rotation drill (bird dogs). The live library has no other in-level anti-rotation floor drill; the Pallof holds are marked "not selectable".
- **Printed copy (minors, engine/render.mjs not touched this round):** the weekly table in whole sets, one exercise counter, the block table built from a non-test week, "1 set" singular, per-side wording, swap lines printed once per block, the YouTube copy name, no video link on aerobic colours, the stairway sentence position, the warm-up dose and drill by day.
- **Athletic minors:** the jump menu by sport (single-leg and lateral shares), jump load in pounds, the tested-lift-first order for the whole block, the test menu, class lifts on one shared rep ladder, calf picks.
- **Session length.** Not acted on (CT-01).

## Open questions for the coach

10. **Bootcamp with no pull-up bar.** When the kit has no vertical pull, should the freed station go to the hips (a hip thrust; pressing then leads pulling 4 stations to 3) or stay on the pulling side (a rear-delt fly, as built now)?
11. **Anti-rotation core.** Which floor anti-rotation drills should be regular picks? Today only bird dogs and dead bugs are allowed beside the live planks for a low-back client.
12. **Shoulder hot spots other than the swimmer's.** The incline-first rule is applied to the swimmer only. Should throwers and volleyball players press the same way?
13. **Circuit rounds.** One more round in the last two weeks is the engine's reading of "3 to 5 rounds". Confirm, or name the weeks.
14. **Pulling against pressing.** A press may now lead the pulls by one set while the back sits on its number for the week. Confirm.

# Engine 0.6.0, fix round on the round-5 reviews (2026-10-12)

Decisions G-200 ... G-206 (`engine/DECISIONS.md`); tests `tests/v06-fix2.test.mjs`. Only 06 and 08 change their sets; 01-05 and 07 change
words only.

- **01, 02, 03 (arm words, CH5-02).** The arms are no longer called "trained through your compound lifts (no extra sets)" or "no exercise
  of its own". Up front: "Biceps, Triceps: one exercise of their own on the training days (the template's arm slot), held at its sets ...".
  Tables: 01 Biceps "6 (2 direct)", final "held: 2 direct sets a week"; 02 "7 (4 direct)"; 03 (ES) "5 (2 directas)". Spanish group names
  are lower case in the accessories line.
- **08 (2-day arms, R4-SES-03).** Hammer curl and triceps extension 2 → 3 sets (were 4 x 15-20); no Friday arm bonus; biceps / triceps
  3.5 → 5 of final 5 (were 7.5 → 9 above a final 8). Shoulders 6.25 → 8 of 8 with a Friday rear-delt fly (were capped at 7 of 8). The big
  groups keep 6+ sets on the training days.
- **06 (hips, R3-VOL-03).** The hex-bar deadlift takes a step (3 → 4 in week 10) and the hip thrust 3 → 4 → 5, alternating. "Back: 5 of
  its 25 final sets sit on your optional days ..." is printed up front (CH5-03). Hips week 12 prints 27 (27.25 in the JSON).
- **07 (display).** Chest prints 27 in weeks 10-12 (27.5 in the JSON), biceps and shoulders 25: no number above "Final sets".
- **04 (display).** Shoulders' final sets print 13, what the plan reaches (the class top 12 plus helper credit the lifts cannot give back).
- **Not fixed: 02 M1, the DB bench ahead of Friday's RDL** (G-205). The RDL holds 2 sets for weeks 1-9 and 3 from week 10; no later hip
  lift of its day passes it. Making the RDL lead its press broke the staircase or the B1-first alternation on 11-17 other athletic
  benchmark plans; it is a coach question (G-205).
