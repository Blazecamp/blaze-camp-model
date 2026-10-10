# How a plan is made: one example, from the answers to the finished week

This page follows one person through the model, step by step: the answers they give, the safety check, the week layout, the time check, the weekly sets, the exercises, the finished first week, and the way the plan then climbs for 12 weeks. The person is a beginner who wants to build muscle and trains 4 days a week. The example is the model's own worked example ([synthesis/12_volume_algorithm_v1.md](../../synthesis/12_volume_algorithm_v1.md) §5.1). Its numbers were computed by the team's reference calculation. They were not produced by the plan engine, which is being rebuilt, so the engine's output for the same person can differ. Each step says which rule is the coach's, with the id of his answer, and which part is **PROPOSED** (suggested by the team, not yet approved by him).

> General fitness information, not medical advice. Read [safety-and-liability.md](safety-and-liability.md).

## The rule

1. A person gives a few answers.
2. The tool builds the whole plan once, with every week visible ahead of time.
3. Nothing is asked afterwards. No check-ins, no tracking, no data kept.
4. The person or their coach adjusts the plan themselves.

Decided by the coach in R3-VOL-02, R3-VOL-04 and R3-GEN-01. Decision record: [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md).

## Why

> "The program will just have its natural algorithm recommendation of growth throughout it, so anybody can just plug in the numbers of what they want as far as weeks and sport or goals. The program would just kick itself out, and then people will adjust accordingly over time." (R3-VOL-04)

> "This needs to be very simple for them to see the whole thing ahead of time" (R3-VOL-04)

He also wants the tool, not the person, to do the math: "I need this tool that we're building eventually to figure out the percentages." (VOL-06)

## The path in one picture

```
  THE ANSWERS                 goal, experience, days, minutes, equipment, pain ...
       |
       v
  0. SAFETY AND RELEASE       a health-check answer of "yes" stops here: see a professional first
       |                      the use-at-your-own-risk box is ticked for this build
       v
  1. WHO IS THIS              training family, level L1 to L3, sport or activity,
       |                      Focus muscles, equipment
       v
  2. PLAN SHAPE AND WEEK      12 weeks, 8 weeks, maintenance, year or season
       |                      day types and the order inside each session
       v
  3. TIME CHECK               the time is too short? Say so first and offer another day
       |                      or longer sessions. If the person keeps their time:
       |                      fewer groups trained directly, supersets recommended
       v
  4. WEEKLY SETS              a start and a ceiling for each muscle group, by level
       |                      floor of 10, Focus muscles, pain
       v
  5. EXERCISES                a default pick for each slot from his library, plus swaps
       |
       v
  6. DOSE                     sets, reps, effort (reps in reserve), rest
       |
       v
  7. THE STAIRWAY             every week is worked out now: small steps to halfway,
       |                      bigger steps after it, whole sets added one at a time
       v
  8. CHECKS AND THE PLAN      the rules are checked, then the whole plan is shown

  AFTER THE BUILD             nothing goes back to the tool. The person edits the plan:
                              switch off a block, add or remove an exercise, swap, superset.
```

## The example person

| Question | Answer | Field in the spec |
|---|---|---|
| Who is this plan for? | Me | `F39` |
| Health check | None of the items apply | `F01` |
| Training experience | 9 months of consistent training | `F17` |
| Main goal | Build muscle | `F07` |
| Focus muscles (optional) | None | `F09` |
| Training days per week | 4: Monday, Tuesday, Thursday, Friday | `F22`, `F23` |
| Session length | 60 minutes. Changed to 85 after the time check (step 3). | `F24` |
| Plan type | 12 weeks | `F25` |
| Anything hurting? | Nothing | `F35` |
| Age, body weight, equipment | The form requires them. The source example does not state them. Its exercise list uses dumbbells, cables and machines. | `F02`, `F05`, `F27` |
| Terms, release and own risk | Ticked | `F46` |

Things the form never asks: sex (GEN-02, ATH-09), sleep, stress or work (R2-GEN-04), and anything after the plan is built (R3-VOL-02). It also asks for no email address. That is the team applying his "I don't want any data kept" (R3-GEN-01).

## Step 0: safety and release

The plan is not built when a health-check answer points to a professional: chest pain or a heart issue, surgery or a fracture in the last 6 months, pregnancy or a birth in the last 6 months, an injury under treatment, or a doctor who said no (R2-GEN-03). Severe pain stops the build too (PROPOSED). Every build needs the "use at your own risk" box ticked (R3-GEN-01). The wording of the health check and the release still needs a lawyer. Details: [safety-and-liability.md](safety-and-liability.md).

Our example person passes and ticks the box.

## Step 1: who is this

| What the tool works out | For this person | Rule |
|---|---|---|
| Training family | Aesthetics (build muscle). This plan has no block of jumps, throws or Olympic lifts. Olympic lifts belong to athletic training (ATH-10). On throws he said: "If you're a bodybuilder, you don't need to do med ball throwing." (ATH-05) | ATH-05, ATH-10 |
| Client level | **L1** (beginner). Levels come from training experience: "a novice is somebody with less than a year of training experience, or maybe less than 6 months around there". The 12-month line between L1 and L2 is the team's reading. | PRG-05; line INFERRED |
| Sport or activity profile | None | |
| Focus muscles | None, so the plan stays balanced | R3-SES-01 |

## Step 2: plan shape and week

**Shape.** A 12-week **block**. A block is a run of weeks that climbs and is meant to be finished. There is no easy week inside it (R2-VOL-07). The 12-week plan is the one he prefers (PER-01).

**Week.** Four full-body days in two types. **Knee dominant** means the knee does most of the bending, as in a squat or a lunge. **Hip dominant** means the hip does, as in a deadlift or a hip thrust.

| Days | Day type | Why |
|---|---|---|
| Monday, Thursday | Knee dominant + pull: quads with back | "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06) |
| Tuesday, Friday | Hip dominant + push: hips with chest | Same rule. The reason: "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." (UNI-11) |

**Order inside a session** ([sessions](../02-model/sessions.md)):

1. Warm-up. It never counts as volume (ORD-08).
2. **Core opener**: 2 core exercises × 2 sets, kept light (R2-SES-03). His reason: "we need all the core work to be done first" (ATH-11).
3. The main lower-body lift with its upper-body partner.
4. A second pair.
5. The other exercises for each group, then arms, shoulders and calves.

**How many exercises.** Each muscle group trained on a day gets 2 to 4 exercises: "there's never one exercise, so from 2 all the way to 4" (R2-SES-05). Groups are counted his way: **hips** = glutes + hamstrings, **shoulders** = front, side and rear delts (R3-SES-01). Calves get one exercise × 3 sets on every leg day (VOL-17, R3-SES-01).

| Day | Exercises per group |
|---|---|
| Monday | quads 3, back 2, biceps 2, calves 1 |
| Tuesday | hips 3, chest 2, shoulders 2, calves 1 |
| Thursday | quads 2, back 2, shoulders 2, biceps 2, calves 1 |
| Friday | hips 4, chest 2, triceps 2, calves 1 |

**Spine.** His rule is one heavy squat day and one heavy deadlift day a week, on different days (R2-SES-01). This beginner has neither yet. A goblet squat, a leg press and a dumbbell Romanian deadlift are not on the list of lifts that count as loading the spine (R2-SES-02).

## Step 3: the time check

The tool compares what the coach's minimums need with the time the person chose. The minimums are 10 sets a week for each trained group, 2 to 4 exercises per group, 3 calf sets per leg day and a stairway that climbs.

At 4 × 60 minutes they do not fit. In the example, week 1 already takes 56 to 61 minutes a day with every pair done as a superset, and quads could only climb from 10 to 11 sets.

So the tool follows the order the coach approved (R3-SES-02):

| His order | In this example |
|---|---|
| 1. Tell the person up front and offer another day or longer sessions | Offer A: sessions of about 85 minutes. Offer B: a 5th day. Checked the same way, a 5th day at 60 minutes does not fix it. |
| 2. If they keep their time, train fewer groups directly, big movers first | Keeping 4 × 60 would train hips, quads, back, chest, shoulders and biceps directly. Triceps would get only the helper credit from presses. Calves would get no sets. The plan would list both as "not trained directly". |
| 3. Recommend supersets | "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." |
| 4. The stairway still climbs on every trained group | Never flat |

A **superset** is two exercises done back to back before resting. It saves time.

**The person takes offer A: 85 minutes.** The rest of this page uses that plan.

The order is his. The minute estimates come from the team's time model, which is PROPOSED. So is the detail of which groups are kept. The source example notes one open point: if the beginner ceiling of 14 is applied strictly at this step, biceps would also be left to helper credit.

## Step 4: weekly sets

The model counts **weekly hard sets** for each muscle group. A hard set is a working set that ends with 1 to 3 reps in reserve. **Reps in reserve (RIR)** means how many more reps the person could have done.

| Group | Start for L1 | Ceiling for L1 | Rule |
|---|---|---|---|
| Quads, hamstrings, glutes, chest, back | 10 each | 14 | Beginners start at about 10 to 12 sets (VOL-01). The ceilings are 14, 22 and 25 for the three levels (R2-VOL-06). |
| Shoulders, biceps, triceps | 10 each | 14 | The proposal was 8. He answered that "8 sets a week is probably just barely maintenance" (R2-VOL-04), and the floor lifts them to 10. Using the same ceiling of 14 for these smaller groups is the team's reading of his answer (INFERRED). |
| Calves | 3 sets every leg day = 12 | 14 | VOL-17, R3-SES-01 |
| Core | The opener: 4 days × 2 exercises × 2 sets = 16 | | R2-SES-03 |

**The floor.** "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). It is counted on the groups (R3-SES-01, R3-VOL-01).

**How a set is counted.** The main muscle of an exercise gets 1 set. Each helper muscle gets a quarter: "I would suggest a 0.25 to the helpers, not a 0.5." (VOL-09). A set written 10/10 is 10 reps on each side and counts as one set (UNI-01).

Example from week 1 below: biceps get 8 direct sets from four curl exercises. The 10 sets of rows and pulldowns add 10 × 0.25 = 2.5. Total 10.5.

## Step 5: exercises

Each slot gets a default exercise from his library and a short list of swaps from the same category: "pick the default and be able to do the drop-downs" (GEN-04). The pick respects the person's equipment, level and pain. The tool never invents an exercise (R2-LIB-01).

The exercises stay the same for 4 to 6 weeks (PER-02). In his words: "Don't try to 'confuse' the muscle." (conversation)

Monday and Thursday are the same day type, but they use different exercises of the same category (PER-04). "I can do one day of squatting and the other day of leg pressing." That is why the plan has a goblet squat on Monday and a leg press on Thursday.

## Step 6: dose

| What | Rule | Source |
|---|---|---|
| Sets | Week 1 starts with 2 to 4 sets per exercise, so each group lands on its start or just above it. His default is 3 sets on compounds and 2 on isolation work. A **compound** lift moves more than one joint, like a squat or a row. An **isolation** exercise moves one, like a curl. | VOL-16 |
| Reps | Everyone works between 5 and 30 reps. Smaller muscles take more reps. The exact range comes from the rep table for the goal and the kind of exercise. | conversation; [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §7.3 |
| Effort | Given as reps in reserve: "I like RIR in my model". Week 1 asks for 3 reps in reserve. | VOL-13, R3-VOL-04 |
| Never | To failure on heavy compound lifts. | GEN-08 |

## The finished week 1

The number after each exercise is the sets. "10/10" means each side.

| # | Monday | Tuesday | Thursday | Friday |
|---|---|---|---|---|
| 1 | Dead bug · 2 | Bird dog · 2 | Dead bug · 2 | Bird dog · 2 |
| 2 | Side plank · 2 | Pallof hold · 2 | Side plank · 2 | Pallof hold · 2 |
| 3 | Goblet squat · 2 | DB Romanian deadlift · 2 | Leg press · 2 | Hip thrust · 3 |
| 4 | Chest-supported DB row · 3 | DB bench press · 3 | 1-arm DB row 10/10 · 3 | Machine chest press · 3 |
| 5 | DB split squat 10/10 · 2 | DB single-leg RDL 10/10 · 2 | DB step-up 10/10 · 2 | Cable glute kickback 10/10 · 3 |
| 6 | Lat pulldown · 2 | Seated DB shoulder press · 2 | Neutral-grip pulldown · 2 | Push-up · 2 |
| 7 | Leg extension · 2 | Incline DB press · 2 | Reverse DB fly · 2 | Cable pushdown · 4 |
| 8 | DB curl · 2 | Leg curl · 2 | Face pull · 2 | Overhead DB triceps extension · 3 |
| 9 | Hammer curl · 2 | DB side raise · 2 | Incline DB curl · 2 | B-stance DB RDL 10/10 · 2 |
| 10 | Calf raise · 3 | Calf raise · 3 | Cable curl · 2 | Swiss-ball leg curl · 2 |
| 11 | | | Single-leg calf raise 10/10 · 3 | Calf raise · 3 |

DB = dumbbell. RDL = Romanian deadlift. Rows 1 and 2 are the core opener.

**Week 1 totals** (weekly sets, counted his way): quads 10 · hips 18 (hamstrings 11.5, glutes 9.5) · chest 10 · back 10 · shoulders 12 · biceps 10.5 · triceps 10 · calves 12 · core 16. That is 81 resistance sets, not counting the core opener.

Some groups start above 10 because every group needs at least 2 exercises on each day it is trained.

## Step 7: the stairway, all 12 weeks

Every plan climbs "like steps up a stairway" (R2-PER-03). He approved the numbers in round 3 (R3-VOL-04):

| Part of the stairway | Number | Source |
|---|---|---|
| Weekly step until the halfway week | about 3 % of each group's weekly sets | R3-VOL-04 |
| Weekly step after the halfway week | about 5 % | R3-VOL-04 |
| Where it ends | Each trained group reaches its ceiling in the last week. When the ceiling is too far for steps of 3 % and 5 % to reach, the group ends below it, still with its highest week last. That second part is the team's reading (INFERRED). | R3-VOL-04 |
| Largest planned step for one group | 7 %. The cap comes from his round-2 table. The check-in part of that table is retired (R3-VOL-02). The cap is on the planned step. In the week a whole set lands, that one group can show a bigger jump. | R2-VOL-01 |
| Total weekly sets | Rise by less than 10 % in any week. A 10 % weekly rise is "way too much". | UNI-05 |
| How it feels | Week 1 feels like a 2. The last week feels like an 11. | R2-PER-05 |
| Effort | 3 reps in reserve early, then 2, then 1–2, then 1 plus intensifiers in the last week. **Intensifiers** are harder ways to do a set, such as myo sets and supersets. | R3-VOL-04, R2-PER-05 |

A step of about 2 to 3 % of 10 sets is a quarter of a set. The tool saves these fractions and adds a whole set when they reach 1 (VOL-06). That is why the first new sets appear in weeks 4 to 6. Until then the plan gets harder through load and effort.

| Week | Feels like | Effort | Quads | Hips | Chest | Back | Shoulders | Biceps | Triceps | Calves | Total sets |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 3 RIR | 10 | 18 | 10 | 10 | 12 | 10.5 | 10 | 12 | 81 |
| 2 | 2.6 | 3 RIR | 10 | 18 | 10 | 10 | 12 | 10.5 | 10 | 12 | 81 |
| 3 | 3.2 | 3 RIR | 10 | 18 | 10 | 10 | 12 | 10.5 | 10 | 12 | 81 |
| 4 | 3.8 | 3 RIR | 10 | 19 | 10 | 10 | 12 | 10.5 | 10 | 12 | 82 |
| 5 | 4.4 | 3 RIR | 10 | 19 | 10 | 10 | 12 | 10.5 | 10 | 12 | 82 |
| 6 | 5 | 3 RIR | 11 | 19.25 | 11 | 11 | 12.25 | 10.75 | 10.25 | 12 | 85 |
| 7 | 6 | 2 RIR | 11 | 19.25 | 11 | 11 | 12.25 | 11.75 | 10.25 | 12 | 86 |
| 8 | 7 | 2 RIR | 12 | 20.5 | 12 | 12 | 12.5 | 12 | 10.5 | 13 | 91 |
| 9 | 8 | 2 RIR | 12 | 20.5 | 12 | 12 | 12.5 | 12 | 10.5 | 13 | 91 |
| 10 | 9 | 1–2 RIR | 12 | 21.5 | 12 | 12 | 13.5 | 13 | 10.75 | 13 | 94 |
| 11 | 10 | 1–2 RIR | 13 | 21.75 | 13 | 13 | 14 | 13.25 | 11 | 13 | 97 |
| 12 | 11 | 1 RIR + intensifiers | 14 | 23 | 14 | 14 | 14.5 | 13.5 | 11.25 | 14 | 102 |

Quarter numbers come from helper credit. "Total sets" is resistance sets, without the core opener.

What to notice:

- **The hardest weeks come last.** The last four weeks hold 91, 94, 97 and 102 sets. "on a 12-week program, the last 4 weeks are going to be brutal" (R2-PER-04).
- **New sets go to the first exercise first.** "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning" (VOL-07). When a day type runs twice a week, the new set alternates between the two days (R3-VOL-03). Quads here: goblet squat 2 → 3 sets in week 6 (Monday), leg press 2 → 3 in week 8 (Thursday), split squat 2 → 3 in week 11 (Monday), step-up 2 → 3 in week 12 (Thursday).
- **The climb stays gentle.** Total sets go from 81 to 102, which is 26 % in 12 weeks. The biggest weekly rise is 5.8 %, in week 8.
- **Two groups land a little lower.** Triceps are trained on Friday only, in two exercises, and the source example gives them no new direct set. Their small rise comes from helper credit as the presses grow. Glutes run out of Friday minutes in the last week. So both end on what the week can hold (triceps 11.25, glutes 13). Biceps end at 13.5, because the gap to 14 is smaller than one whole set. This "ceiling the time holds" is PROPOSED.
- **No easy week inside the 12 weeks.** After week 12 an easy week at about half the sets is recommended, not required (R3-PER-01).

## Step 8: checks and the plan

Before the plan is shown, it is checked against the rules: no bands, the two spine days, the session order, the floor of 10, 2 to 4 exercises per group, a stairway that climbs, tests only at the start and the end, the release ticked, and more. The list is in `generator_spec_v1.json > validation_checks` (V1 to V31).

The plan then shows the whole block, each week and each day. It carries the "use at your own risk" line, says which blocks can be switched off, and ends with what to do next: "when the block ends, it just ends, and then you have to go back into the app and build whatever you want next" (R3-PER-01). The screens and exports are PROPOSED. The website is not built yet.

## After the build: the person's side

Nothing goes back to the tool. The plan is a template: "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

| Situation | What the person or coach does | Source |
|---|---|---|
| A hard day | Switch off that day's core block. In an athletic plan, switch off that day's jumps and throws. Going lighter inside the reps-in-reserve cue is the team's advice (PROPOSED). | R3-SES-02 |
| Short on time | Do the recommended supersets | R3-SES-02 |
| An exercise feels wrong | Swap it for another from the same category | GEN-04 |
| Something hurts | Swap, then cut the sets, then drop the exercise. See a professional. The swap to machines, the cut and the drop are his. The three-step order is PROPOSED. | VOL-03 |
| They want more of a muscle | Add an exercise, or pick it as a Focus muscle in the next plan | R3-SES-02, R3-SES-01 |
| The block cannot be finished | Stop it. In his words: "cancel the block and start a maintenance phase", then "a whole new block". Maintenance is a recommendation, not a requirement. | R2-VOL-07, R3-PER-01 |
| The block is finished | Take the recommended easy week, then build the next block one step higher | R3-PER-01, R2-VOL-06 |

How editing works on screen is PROPOSED ([ADR-005](../04-decisions/adr-005-editable-plan-switches-and-supersets.md)).

## What is his rule here, and what is PROPOSED

| In this example | Status |
|---|---|
| Answers in, the whole plan out, no check-ins | His rule (R3-VOL-02, R3-VOL-04) |
| Knee + pull and hip + push days, core first, 2 to 4 exercises per group, calves 3 sets per leg day | His rules (ORD-06, UNI-11, ATH-11, R2-SES-05, R3-SES-01) |
| Starts of 10, floor of 10, ceilings of 14 for a beginner | His rules (VOL-01, R2-VOL-04, R2-VOL-06). The 14 for shoulders, biceps and triceps is INFERRED. |
| Helper muscles count a quarter of a set | His rule (VOL-09) |
| The stairway numbers and the effort steps | His rule, approved in numbers (R3-VOL-04) |
| The order of the time check | His rule (R3-SES-02) |
| Where a new set goes | His rules (VOL-07, R3-VOL-03) |
| The minutes each day takes, and the 85-minute offer | PROPOSED (the team's time model) |
| A lower ceiling when the time cannot hold the full climb | PROPOSED |
| Counting a set at most once for a group such as hips or shoulders | PROPOSED |
| The "feels like" number for each week | The 2 and the 11 are his (R2-PER-05). The numbers in between are the team's display. |
| The exact exercise in each slot | The example's picks. The rebuilt engine may pick others from the same category. |

## Where it lives in the data

| Step | File and key |
|---|---|
| The answers | [generator_spec_v1.json](../../generator_spec_v1.json) `> inputs_schema.fields` (F00 to F46), `> inputs_schema.removed_fields` |
| 0 Safety and release | `generator_spec_v1.json > legal_and_privacy`, `> validation_checks.V1_safety`, `.V21_release` |
| 1 Who is this | `generator_spec_v1.json > derived_values` (D1 to D15), `> vocab.levels`; `synthesis/04_profiles.json > profiles` |
| 2 Shape and week | `generator_spec_v1.json > plan_types.fixed_12`, `> rule_tables.ordering`, `.pairing`, `.axial_loading`, `.core_block`; `synthesis/05_templates.json > generator_split_templates.aesthetics.4` |
| 3 Time check | `generator_spec_v1.json > derived_values.D15_time_fit`, `> rule_tables.session_limits.time_vs_minimums`, `.time_model` |
| 4 Weekly sets | `generator_spec_v1.json > rule_tables.weekly_sets` (`muscles.<name>.start`, `.cap`, `floors`), `.counting.credit_map`, `> vocab.muscles.focus_groups` |
| 5 Exercises | `synthesis/02_exercise_catalog.json` (one record per exercise) |
| 6 Dose | `generator_spec_v1.json > rule_tables.reps`, `.effort`, `.rest`, `.session_limits.default_sets` |
| 7 Stairway | `generator_spec_v1.json > rule_tables.rate_engine` (`standard_steps`, `limits`, `math`), `.banking`, `.set_placement` |
| 8 Checks and the plan | `generator_spec_v1.json > validation_checks`, `> output`, `> plan_editing` |
| The whole example | `synthesis/12_volume_algorithm_v1.md` §5.1; data in `synthesis/12_volume_algorithm_v1.json > examples.ex1_beginner_aesthetics_12wk_time_policy` |
| The steps as pseudo-code | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §13.3; `generator_spec_v1.json > pipeline` |

## Other worked examples

The same document works through four more people (`synthesis/12_volume_algorithm_v1.md` §5.2 to §5.5):

| Example | What it shows |
|---|---|
| §5.2 Intermediate bodybuilder, Focus muscle = chest | A Focus muscle riding 2 sets above the balanced plan for the whole block |
| §5.3 Tennis player, off-season, 8 weeks | An athletic plan: jumps, throws and Olympic lifts on their own budget, mostly one-leg work |
| §5.4 After the block | The recommended easy week and a maintenance plan |
| §5.5 Pickleball player who keeps 2 × 45 minutes | The case from question R3-SES-02: what the time check does when very little time is available |

To run the engine on a sample person, see [for-developers.md](for-developers.md). Remember that the engine is being rebuilt, so read its plans as drafts.

## Related pages

[what-this-is.md](what-this-is.md) · [for-coaches.md](for-coaches.md) · [volume](../02-model/volume.md) · [stairway](../02-model/stairway.md) · [sessions](../02-model/sessions.md) · [plans and calendar](../02-model/plans-and-calendar.md) · [glossary](../05-reference/glossary.md)
