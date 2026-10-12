# How a plan is made: one example, from the answers to the finished week

This page follows one person through the model, step by step: the answers they give, the release and the safety check, the week layout taken from the coach's own template, the weekly sets, the exercises, the finished first week, and the way the plan then climbs for 12 weeks. The person is a beginner who wants to build muscle and trains 4 days a week. The numbers on this page are real output: they were produced by plan engine 0.5.0 on model 1.3.0 on 2026-10-11. The coach has not graded this plan, and the engine's exercise picks can change as it improves. Each step says which rule is the coach's, with the id of his answer, and which part is **PROPOSED** (suggested by the team, not yet approved by him).

> General fitness information, not medical advice. Read [safety-and-liability.md](safety-and-liability.md).

## The rule

1. A person gives a few answers and accepts the terms and the release of liability.
2. The tool builds the whole plan once, with every week visible ahead of time.
3. Nothing is asked afterwards. No check-ins, no tracking, no data kept.
4. The plan is a complete template. The person or their coach edits it themselves.

Decided by the coach in R3-VOL-02, R3-VOL-04, R3-GEN-01, CX-04 and R4-SCP-02. Decision records: [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md), [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md).

## Why

> "The program will just have its natural algorithm recommendation of growth throughout it, so anybody can just plug in the numbers of what they want as far as weeks and sport or goals. The program would just kick itself out, and then people will adjust accordingly over time." (R3-VOL-04)

> "This needs to be very simple for them to see the whole thing ahead of time" (R3-VOL-04)

He also wants the tool, not the person, to do the math: "I need this tool that we're building eventually to figure out the percentages." (VOL-06)

And he does not want the tool to manage anyone's clock: "You need to stop trying to be responsible for the people's time." (CT-01)

## The path in one picture

```
  THE ANSWERS                 goal, experience, days, equipment, pain ...
       |                      (no session length: it is not asked)
       v
  0. RELEASE, THEN SAFETY     the terms and the release must be accepted first: no acceptance, no plan
       |                      a health-check answer of "yes" points to a professional
       v
  1. WHO IS THIS              training family, level L1 to L3, sport or activity,
       |                      Focus muscles, equipment
       v
  2. PLAN SHAPE AND WEEK      12 weeks, 8 weeks, maintenance, year or season
       |                      the coach's own day templates: A / B days, push / pull / legs ...
       v
  3. SESSION SIZE             a number of exercises by kind of client (not minutes)
       |
       v
  4. WEEKLY SETS              a start and a final number for each muscle group, by level
       |                      floor of 10 from 3 training days, Focus muscles, pain
       v
  5. EXERCISES                a default pick for each template slot from his library, plus swaps
       |
       v
  6. DOSE                     sets, reps, effort (reps in reserve), rest, the progression rule
       |
       v
  7. THE STAIRWAY             every week is worked out now: whole sets added week by week
       |                      until each group reaches its final sets in the last week
       v
  8. CHECKS AND THE PLAN      the rules are checked, then the whole plan is shown,
                              with an average time on each day as information

  AFTER THE BUILD             nothing goes back to the tool. The person edits the plan:
                              change sets, switch off a block, add or remove an exercise, swap, superset.
```

## The example person

| Question | Answer |
|---|---|
| Who is this plan for? | Me |
| Terms, release and own risk | Accepted. Without this no plan is built. |
| Health check | None of the items apply |
| Training experience | 9 months of consistent training |
| Main goal | Build muscle |
| Focus muscles (optional) | None |
| Training days per week | 4: Monday, Tuesday, Thursday, Friday |
| Plan type | 12 weeks |
| Age, body weight | 30, 170 lb |
| Equipment | Full gym |
| Anything hurting? | Nothing |

Things the form never asks: how long a session should be (R4-SES-01), sex (GEN-02, ATH-09), sleep, stress or work (R2-GEN-04), and anything after the plan is built (R3-VOL-02). It also asks for no email address. That is the team applying his "I don't want any data kept" (R3-GEN-01).

## Step 0: release, then safety

The first check is the release. The person must accept the terms and the release of liability before a plan is generated: "they need to click it before the plan shows, as part of when they put in their data" (R4-SCP-02). Without it the tool answers "Read and accept the terms and the release of liability first. No plan is built without it."

Everyone may use the plans on their own (R4-SCP-01). A short health check still follows (R2-GEN-03, R3-GEN-01). Today a "yes" on one of its items stops the automatic plan and points to a professional: chest pain or a heart issue, surgery or a fracture in the last 6 months, pregnancy or a birth in the last 6 months, an injury under treatment, or a doctor who said no. Whether that stop should stay after R4-SCP-01 is an open question for the coach. Severe pain stops the build too (PROPOSED). All wording still needs a lawyer. Details: [safety-and-liability.md](safety-and-liability.md).

Our example person accepts the release and passes the health check.

## Step 1: who is this

| What the tool works out | For this person | Rule |
|---|---|---|
| Training family | Aesthetics (build muscle). This plan has no block of jumps, throws or Olympic lifts. Olympic lifts belong to athletic training (ATH-10). On throws he said: "If you're a bodybuilder, you don't need to do med ball throwing." (ATH-05) | ATH-05, ATH-10 |
| Client level | **L1** (beginner). Levels come from training experience: "a novice is somebody with less than a year of training experience, or maybe less than 6 months around there". The 12-month line between L1 and L2 is the team's reading. | PRG-05; line INFERRED |
| Sport or activity profile | None | |
| Focus muscles | None, so the plan stays balanced | R3-SES-01 |

## Step 2: plan shape and week

**Shape.** A 12-week **block**. A block is a run of weeks that climbs and is meant to be finished. There is no easy week inside it (R2-VOL-07). The 12-week plan is the one he prefers (PER-01).

**Week.** The tool does not invent a layout. It uses his own template for 4 days: Day A, Day B, rest, Day A, Day B (R4-SES-05). **Knee dominant** means the knee does most of the bending, as in a squat or a lunge. **Hip dominant** means the hip does, as in a deadlift or a hip thrust.

| Slot | Day A (Monday, Thursday): pull + knee dominant | Day B (Tuesday, Friday): push + hip dominant |
|---|---|---|
| 1 | Horizontal pull, two arms (a row) | Horizontal push |
| 2 | Two-leg knee-dominant lift (a squat) | Two-leg hip-dominant lift (a hinge or hip thrust) |
| 3 | Vertical pull | Vertical push, or an incline press |
| 4 | Single-leg knee-dominant lift (a lunge) | Single-leg hip-dominant lift |
| 5 | Biceps | Triceps |
| 6 | Leg extension | Leg curl |
| 7 | Calves, 3 sets | Side raise |

> "Day A: back, quads, and biceps. It's going to be more pull- and knee-dominant movements." / "Day B: push with hip-dominant movements." (R4-SES-05)

The pairing behind it is older: "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06). Slot 7 comes from his sheet (OBSERVED).

Wednesday and Saturday are optional days. In his words they can hold "cardio", "accessory movements" and "bonuses, things they want to focus on" (R4-SES-05, ORD-10).

**Order inside a session** ([sessions](../02-model/sessions.md)):

1. Warm-up. It never counts as volume (ORD-08).
2. **Core opener**: 2 core exercises × 2 sets, kept light (R2-SES-03). His reason: "we need all the core work to be done first" (ATH-11).
3. The template's slots, in order: horizontal before vertical (ORD-01).
4. The small-muscle exercises.
5. Cardio, when the day has a session.

**Spine.** His rule is one heavy squat day and one heavy deadlift day a week, on different days (R2-SES-01). Here the heavier squat is on Monday and the trap-bar deadlift on Friday. Thursday's squat slot and Tuesday's hinge slot take lifts that do not load the spine.

## Step 3: session size

A session is sized by its number of exercises, not by minutes (CT-01, R4-SES-02). For an aesthetics client the range is 6 to 8, not counting the warm-up and the 2 core exercises. The plan uses 7 (the default inside the range is PROPOSED).

> "This is just our recommendation. These are templates that we're giving them for them to add or take away" (R4-SES-02)

The plan prints an average time on each day, as information only. For this person: Monday "about 55-70 min", Tuesday "about 85-105 min" (that day also carries a 30-minute easy cardio session). Nothing is cut or moved because of these numbers. Each day also lists what is easiest to remove if the person wants a shorter day. The person picks (R4-SES-04).

## Step 4: weekly sets

The model counts **weekly hard sets** for each muscle group. A hard set is a working set that ends with 1 to 3 reps in reserve. **Reps in reserve (RIR)** means how many more reps the person could have done.

| Group | Start for L1 | Final sets for L1 | Rule |
|---|---|---|---|
| Quads, hamstrings, glutes, chest, back | 10 each | 14 | Beginners start at about 10 to 12 sets (VOL-01). The top numbers are 14, 22 and 25 for the three levels (R2-VOL-06). |
| Shoulders, biceps, triceps | 10 each | 14 | The proposal was 8. He answered that "8 sets a week is probably just barely maintenance" (R2-VOL-04), and the floor lifts them to 10. Using the same top of 14 for these smaller groups is the team's reading of his answer (INFERRED). |
| Calves | 3 sets every leg day | | VOL-17, R3-SES-01 |
| Core | The opener: 2 exercises × 2 sets every session | | R2-SES-03 |

**The floor.** "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). It is counted on the groups (R3-SES-01, R3-VOL-01) and holds when there are 3 or more training days. A person with 2 training days gets every big muscle at about 6 to 8 sets instead (R4-SES-03).

**How a set is counted.** The main muscle of an exercise gets 1 set. Each helper muscle gets a quarter: "I would suggest a 0.25 to the helpers, not a 0.5." (VOL-09). A set written 10/10 is 10 reps on each side and counts as one set (UNI-01).

**Why some groups start above 10.** Every exercise holds at least 2 sets (PROPOSED). Day A has three quad exercises, so two A days give quads 12 sets in week 1. The stairway then climbs from the week-1 number.

## Step 5: exercises

Each template slot gets a default exercise from his library and a short list of swaps from the same category: "pick the default and be able to do the drop-downs" (GEN-04). The pick respects the person's equipment, level and pain. The tool never invents an exercise (R2-LIB-01).

- The exercises stay the same for 4 to 6 weeks (PER-02). In his words: "Don't try to 'confuse' the muscle." (conversation)
- Monday and Thursday are the same day type, but they use different exercises of the same category (PER-04). "I can do one day of squatting and the other day of leg pressing."
- For a muscle-building plan, the "vertical push or incline" slot leads with an incline press. Overhead pressing stays in the swap list (R4-LIB-03).
- A swap says in one line what it keeps and what it loses (R4-LIB-04).
- Each exercise carries a "Watch how" link that opens a YouTube search, and the exact name to copy into YouTube (R4-LIB-05). There are no third-party video links.
- The exercises the team proposed (carries, sled work and so on) are never picked here. They can be added as optional add-ons (R4-LIB-01).

## Step 6: dose

| What | Rule | Source |
|---|---|---|
| Sets | Week 1 starts with 2 to 4 sets per exercise. His default is 3 sets on compounds and 2 on isolation work. A **compound** lift moves more than one joint, like a squat or a row. An **isolation** exercise moves one, like a curl. | VOL-16 |
| Reps | Everyone works between 5 and 30 reps. Smaller muscles take more reps. The exact range comes from the rep table for the goal and the kind of exercise. | conversation; [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §7.3 |
| Effort | Given as reps in reserve: "I like RIR in my model". Week 1 asks for 3 reps in reserve. | VOL-13, R3-VOL-04 |
| Progress | A rule under every lift, never a promised number. | R4-PRG-03 |
| Never | To failure on heavy compound lifts. | GEN-08 |

The progression rule as the plan prints it under Monday's row: "Progress: when you hit 12 on every set with 3 left in the tank, add weight next time and start again at 10."

## The finished week 1

The number after each exercise is the sets. "per side" means each side.

| Slot | Monday (A1) | Tuesday (B1) | Thursday (A2) | Friday (B2) |
|---|---|---|---|---|
| Core | Sit-up · 2 | Crunch · 2 | V-up · 2 | Side plank · 2 |
| Core | Reverse crunch · 2 | Hanging rotational knee raise · 2 | Lying leg raise · 2 | Hanging knees to chest · 2 |
| 1 | Seal row, dumbbells · 3 | Flat dumbbell bench press · 3 | Inverted row · 3 | Machine bench press · 3 |
| 2 | Box Zercher squat · 2 | 45-degree back extension · 2 | Bodyweight squat · 2 | Trap-bar deadlift · 2 |
| 3 | Single-arm lat pulldown · 2 | Incline dumbbell bench press · 3 | Feet-supported ring pull-up · 2 | High-incline seated dumbbell press · 2 |
| 4 | Reverse lunge, per side · 2 | Single-leg glute bridge, per side · 2 | Split squat, per side · 2 | Single-leg glute bridge, foot on bench, per side · 2 |
| 5 | Incline dumbbell curl · 4 | Floor dumbbell skullcrusher · 4 | Seated dumbbell curl · 4 | Cable triceps pushdown · 4 |
| 6 | Leg extension · 2 | Lying leg curl · 2 | Leg extension, one leg at a time · 2 | Seated leg curl · 2 |
| 7 | Machine calf raise · 3 | Seated dumbbell lateral raise · 3 | Machine calf raise, one leg at a time · 3 | Leaning cable side raise · 2 |

Optional days. Wednesday: plank · 2; pec-deck fly (bonus) · 2; spider curl (bonus) · 2; standing dumbbell calf raise · 2; a short, hard cardio session. Saturday: cable rotation · 2; overhead cable triceps extension (bonus) · 2; cable fly (bonus) · 2; calf raise · 2; a moderate cardio session. A **bonus exercise** is his way to give a muscle more work than its day can hold (VOL-07, R3-VOL-03).

**Week 1 totals** (weekly sets, counted his way): quads 12 · hips 14 · back 10 · chest 14 · shoulders 10.75 · biceps 12.5 · triceps 12.75 · calves 10. That is 84 resistance sets, not counting the core opener. Quarter numbers come from helper credit.

## Step 7: the stairway, all 12 weeks

Every plan climbs "like steps up a stairway" (R2-PER-03).

| Part of the stairway | Rule | Source |
|---|---|---|
| Usual weekly step | about 3 % of each group's weekly sets until the halfway week, about 5 % after | R3-VOL-04 |
| Where it ends | each trained group reaches its planned final sets; steps are bigger when the target needs it | CX-01 |
| When it arrives | in the last week when the math allows; one week early is fine; never earlier | R4-PRG-01 |
| A big step | no hard limit; a week that adds more than about 15 % carries a note | R4-PRG-02 |
| Same sets | a week may keep its sets while reps or load progress | CX-02 |
| How it feels | week 1 feels like a 2; the last week feels like an 11 | R2-PER-05 |
| Effort | 3 reps in reserve early, then 2, then 1-2, then 1 plus an intensifier in the last week. An **intensifier** is a harder way to do a set, such as a myo set or a superset. | R3-VOL-04, R2-PER-05 |

The tool works in whole sets (VOL-06). This is the plan's own table:

| Week | Feels like | Effort | Quads | Hips | Back | Chest | Shoulders | Biceps | Triceps | Calves | Total sets |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 3 RIR | 12 | 14 | 10 | 14 | 10.75 | 12.5 | 12.75 | 10 | 84 |
| 2 | 2.6 | 3 RIR | 12 | 14 | 11 | 14 | 10.75 | 12.75 | 12.75 | 10 | 85 |
| 3 | 3.2 | 3 RIR | 12 | 14 | 11 | 14 | 10.75 | 12.75 | 12.75 | 10 | 85 |
| 4 | 3.8 | 3 RIR | 12 | 14 | 11 | 14 | 11.75 | 12.75 | 12.75 | 10 | 86 |
| 5 | 4.4 | 3 RIR | 13 | 14.25 | 11 | 14 | 11.75 | 12.75 | 12.75 | 10 | 87 |
| 6 | 5 | 3 RIR | 13 | 14.25 | 12 | 14 | 11.75 | 13 | 12.75 | 10 | 88 |
| 7 | 6 | 2 RIR | 13 | 14.25 | 12 | 14 | 12.75 | 13 | 12.75 | 10 | 89 |
| 8 | 7 | 2 RIR | 13 | 14.25 | 12 | 14 | 12.75 | 13 | 12.75 | 10 | 89 |
| 9 | 8 | 2 RIR | 13 | 14.25 | 13 | 14 | 13 | 13.25 | 12.75 | 11 | 91 |
| 10 | 9 | 1-2 RIR | 13 | 14.25 | 13 | 14 | 13 | 13.25 | 12.75 | 11 | 91 |
| 11 | 10 | 1-2 RIR | 14 | 14.5 | 13 | 14 | 13 | 14.25 | 13.75 | 11 | 94 |
| 12 | 11 | 1 RIR + intensifier | 14 | 14.5 | 14 | 14 | 14.25 | 14.5 | 13.75 | 12 | 97 |

"Total sets" is resistance sets, without the core opener.

What to notice:

- **The hardest weeks come last.** The last four weeks hold 91, 91, 94 and 97 sets. "on a 12-week program, the last 4 weeks are going to be brutal" (R2-PER-04).
- **Every group ends at its final sets.** Back climbs from 10 to 14 and lands on 14 in week 12. Shoulders, quads and biceps arrive in the last two weeks.
- **Some groups hold their sets.** Chest starts at 14 in week 1, which is already the top number for a beginner, and stays there. That is allowed: a week may keep its sets while reps or load progress (CX-02, CX-03). The progression rule under each lift does that work.
- **New sets go to the first exercise first.** "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning" (VOL-07). When a day type runs twice a week, the new set alternates between the two days (R3-VOL-03). Back here: the Monday pulldown goes 2 → 3 sets in week 2, the Thursday pull-up 2 → 3 in week 6, the Monday row 3 → 4 in week 9, the Thursday row 3 → 4 in week 12.
- **What the template cannot hold, the plan says.** Triceps end at 13.75, and the plan prints "13 of 14": this template's exercises hold 13 of the 14 planned sets. The person can add an exercise. Nothing else is shrunk to make room (R4-SES-04).
- **The climb is gentle here.** Total sets go from 84 to 97, about 15 % in 12 weeks. No week needed a "jumps more than usual" note.
- **No easy week inside the 12 weeks.** After week 12 an easy week at about half the sets is recommended, not required (R3-PER-01). The next block starts about 5 % above where this one started, never above the level's top (R4-PRG-04).

## Step 8: checks and the plan

Before the plan is shown, it is checked against the rules: the release accepted, no bands, the two spine days, the session order, the template's slots all present, the session size, the floor of 10, final sets reached in the last week, a progression rule on every lift, no third-party video link, no time fitting anywhere, tests only at the start and the end, and more. The engine's list has 59 checks (`model/rules.json > validation.checks`, explained in `engine/CONTRACTS.md`).

The plan then shows the whole block, each week and each day. It opens and closes with the release line, says which blocks can be switched off, and ends with what to do next: "when the block ends, it just ends, and then you have to go back into the app and build whatever you want next" (R3-PER-01). The website is not built yet; today the plan is text and data.

## After the build: the person's side

Nothing goes back to the tool. The plan is a template: "It's already a template, and you need to adjust it as you need to." (R3-VOL-04). "It should be all editable as they need to." (CX-04)

| Situation | What the person or coach does | Source |
|---|---|---|
| A hard day | Switch off that day's core block. In an athletic plan, switch off that day's jumps and throws. Going lighter inside the reps-in-reserve cue is the team's advice (PROPOSED). | R3-SES-02 |
| A day is too long | Do the recommended supersets, or remove what the day lists as easiest to remove. Their choice. | R3-SES-02, R4-SES-04 |
| They want more or fewer sets | Change the sets of any exercise, for one day or for chosen weeks | CX-02, CX-04 |
| An exercise feels wrong | Swap it for another from the same category | GEN-04 |
| Something hurts | Swap, then cut the sets, then drop the exercise. See a professional. The swap to machines, the cut and the drop are his. The three-step order is PROPOSED. | VOL-03 |
| They want more of a muscle | Add an exercise or an optional add-on, or pick it as a Focus muscle in the next plan | R3-SES-02, R4-LIB-01, R3-SES-01 |
| The block cannot be finished | Stop it. In his words: "cancel the block and start a maintenance phase", then "a whole new block". Maintenance is a recommendation, not a requirement. | R2-VOL-07, R3-PER-01 |
| The block is finished | Take the recommended easy week, then build the next block a little higher | R3-PER-01, R4-PRG-04 |

After an edit the weekly totals are recounted and the plan is marked as edited. How editing works on a screen is PROPOSED ([ADR-005](../04-decisions/adr-005-editable-plan-switches-and-supersets.md)).

## What is his rule here, and what is PROPOSED

| In this example | Status |
|---|---|
| Answers in, the whole plan out, no check-ins, everything editable | His rule (R3-VOL-02, R3-VOL-04, CX-04) |
| The release accepted before the plan; a release line on the plan | His rule (R4-SCP-02); the wording is PROPOSED and needs a lawyer |
| No session length asked; a session sized by exercise count; time printed as information | His rule (CT-01, R4-SES-01, R4-SES-02) |
| The A / B days and their slots; knee + pull and hip + push; core first; calves 3 sets per leg day | His rules (R4-SES-05, ORD-06, UNI-11, ATH-11, R3-SES-01) |
| Starts of 10, floor of 10, top of 14 for a beginner | His rules (VOL-01, R2-VOL-04, R2-VOL-06). The 14 for shoulders, biceps and triceps is INFERRED. |
| Helper muscles count a quarter of a set | His rule (VOL-09) |
| Final sets reached in the last week; flat weeks allowed; the progression rule | His rules (CX-01, CX-02, R4-PRG-01, R4-PRG-03) |
| Where a new set goes | His rules (VOL-07, R3-VOL-03) |
| Incline press in the "vertical or incline" slot; swap notes; YouTube search links | His rules (R4-LIB-03, R4-LIB-04, R4-LIB-05) |
| 7 exercises as the default inside 6 to 8; the minutes behind the time estimate | PROPOSED |
| At least 2 sets on every exercise, which puts some groups above 10 in week 1 | PROPOSED |
| Counting a set at most once for a group such as hips or shoulders | PROPOSED |
| The "feels like" number for each week | The 2 and the 11 are his (R2-PER-05). The numbers in between are the team's display. |
| The exact exercise in each slot | The engine's picks. They can change. He graded the 8 sample plans in round 5 (A for 3, B+ for 5). |

## Where it lives in the data

Spec keys are in [generator_spec_v1.json](../../generator_spec_v1.json). Keys written `rules: ...` are in `model/rules.json`, the compiled rules the engine reads. The spec key for each newest answer is in [coverage_matrix_round4.md](../../coverage_matrix_round4.md).

| Step | File and key |
|---|---|
| The answers | `generator_spec_v1.json > inputs_schema.fields`, `> inputs_schema.removed_fields`; the engine's intake shape in `engine/CONTRACTS.md` |
| 0 Release and safety | `rules: legal.gate`, `legal.release_line`; `generator_spec_v1.json > legal_and_privacy` |
| 1 Who is this | `generator_spec_v1.json > derived_values`, `> vocab.levels`; `synthesis/04_profiles.json > profiles` |
| 2 Shape and week | `generator_spec_v1.json > plan_types.fixed_12`, `> rule_tables.ordering`, `.pairing`, `.axial_loading`, `.core_block`; `synthesis/05_templates.json > generator_split_templates.aesthetics.4`; `model/templates.json` (day types `gym_A`, `gym_B`) |
| 3 Session size | `rules: session.size`, `session.easy_to_remove`, `time_model` (`use: estimate_only`), `render.estimate` |
| 4 Weekly sets | `generator_spec_v1.json > rule_tables.weekly_sets` (`muscles.<name>.start`, `.cap`, `floors`), `.counting.credit_map`, `> vocab.muscles.focus_groups`; `rules: volume.floor`, `volume.two_day` |
| 5 Exercises | `synthesis/02_exercise_catalog.json` (one record per exercise); `rules: selection.incline_first`, `selection.addons`, `selection.swap_notes`, `render.video` |
| 6 Dose | `generator_spec_v1.json > rule_tables.reps`, `.effort`, `.rest`; `rules: render.progression` |
| 7 Stairway | `generator_spec_v1.json > rule_tables.rate_engine`, `.banking`, `.set_placement`; `rules: stairway.progression`, `placement`, `cycles.next_block` |
| 8 Checks and the plan | `rules: validation.checks`; `engine/validate.mjs`; `generator_spec_v1.json > output`, `> plan_editing` |
| The steps as pseudo-code | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §13.3; `generator_spec_v1.json > pipeline` |

## Make this example yourself

The example uses the intake of sample plan 06 (`samples/intakes/06-full-body-aesthetics.json`) with four changes: 0.75 years of consistent training, age 30, body weight 170 lb, and no Focus muscles. [for-developers.md](for-developers.md) shows how to run the engine on an intake.

## Other worked examples

| Example | Where | What it shows |
|---|---|---|
| The 8 sample plans | `samples/plans/`, with notes in `samples/SAMPLES.md` | Swimming, football, soccer, a CrossFit-style class, bootcamp, full-body aesthetics, push / pull / legs, and a 52-year-old pickleball player on 2 days a week |
| The pickleball sample (08) | `samples/plans/08-pickleball-genpop.en.md` | The 2-day rule: every big muscle at about 6 to 8 weekly sets, with the suggestion of a third day |
| The push / pull / legs sample (07) | `samples/plans/07-push-pull-legs.en.md` | His other main layout, where a group gets 2 to 4 exercises on its day |
| The model's hand-worked examples | `synthesis/12_volume_algorithm_v1.md` §5 | The arithmetic behind starts, top numbers, Focus muscles and the stairway |

The engine's status, test counts and known gaps are in [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md). Read its plans as drafts until the coach has graded them.

## Related pages

[what-this-is.md](what-this-is.md) · [for-coaches.md](for-coaches.md) · [volume](../02-model/volume.md) · [stairway](../02-model/stairway.md) · [sessions](../02-model/sessions.md) · [plans and calendar](../02-model/plans-and-calendar.md) · [glossary](../05-reference/glossary.md)
