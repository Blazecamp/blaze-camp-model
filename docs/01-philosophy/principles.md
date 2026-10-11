# The principles: how coach Lalo Vera programs, in his own terms

This page lists the 30 core principles behind the Blaze Camp model. Each one gives the rule first, then the coach's own reasoning with a short quote and the answer id, then where the rule lives in the data (file and JSON key). It is the fastest way to learn what the model believes before you read the detailed guides. Nothing here is new: every principle comes from an answer the coach gave. Numbers the team proposed and he has not confirmed are marked **PROPOSED**. The page was brought up to model v1.3 on 2026-10-11: principles 5, 7, 10, 25, 28 and 29 carry his newest answers (round 4 and the two clarifications of 2026-10-10).

Related pages: [how he thinks](how-he-thinks.md) (the mental model behind these rules), [lineage](lineage.md) (where the ideas come from) and [what he rejected](what-he-rejected.md) (ideas that must not come back).

## How to read this page

| You see | It means |
|---|---|
| "Text in double quotes" | The coach's own words, copied from the answer files. " ... " marks words left out. |
| `CAT-01`, `VOL-07`, `ORD-05` ... | A round-1 answer, in [coach_answers_full.md](../../coach_answers_full.md). |
| `R2-...` | A round-2 answer, in [coach_answers_round2.md](../../coach_answers_round2.md). |
| `R3-...` | A round-3 answer, in [coach_answers_round3.md](../../coach_answers_round3.md). |
| `R4-...` | A round-4 answer (the newest questionnaire round, 2026-10-11), in [coach_answers_round4.md](../../coach_answers_round4.md). |
| `CT-01`, `CX-01..04` | Two clarifications he gave in conversation on 2026-10-10: on session time ([coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md)) and on progression and editing ([coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md)). |
| `COACH-CHAT` | Something he said in conversation, recorded in [coach_chat_statements.md](../../coach_chat_statements.md) and [coach_answers.md](../../coach_answers.md). These are close paraphrases unless shown in quotes there. |
| `OBSERVED` | Read from a cell in his own sheets (`dumps/`, `raw/`). Sheet labels are shown in 'single quotes' with his spelling. |
| **PROPOSED** | A number or mechanism from the team that he has not confirmed. The repo also uses the label INFERRED for team readings; on this page both count as not confirmed. |
| `file > key > key` | Where the rule lives. `generator_spec_v1.json` is the machine spec. `model/rules.json` is the compiled file the plan engine reads. It is generated from the sources. The rules of 2026-10-10 and round 4 are cited from it; their spec keys are in [coverage_matrix_round4.md](../../coverage_matrix_round4.md). |

When two answers disagree, the newer one wins: round 4 and CT-01, then CX-01..04, then round 3, round 2, round 1, then chat, then his sheets.

## The principles at a glance

| # | Principle | Main answer ids |
|---|---|---|
| 1 | Classify every exercise on every lens at once | CAT-01, CAT-03, CAT-07 |
| 2 | Bigger muscles and smaller muscles are handled differently | CAT-02, R3-VOL-01, R3-SES-01 |
| 3 | Athletic, resistance and core work are different families, counted in different units | VOL-10, R2-VOL-05, CAT-08 |
| 4 | Different people need different things | COACH-CHAT, ATH-03, ATH-09 |
| 5 | Count hard sets per muscle group per week, and nobody trains a group with fewer than 10 (on 2 days a week: about 6 to 8) | UNI-01, VOL-01, R2-VOL-06, R3-VOL-01, R4-SES-03 |
| 6 | The main mover gets a full set, the helpers get a quarter | VOL-09, R2-VOL-05, LIB-16 |
| 7 | Every plan is a stairway that reaches its final sets | R2-PER-03, R2-PER-04, R3-VOL-04, UNI-05, VOL-05, CX-01, R4-PRG-01..03 |
| 8 | Start at a 2, end at an 11 | PER-01, R2-PER-05 |
| 9 | Add sets to the things that matter most | VOL-07, R3-VOL-03, VOL-06 |
| 10 | His own templates are the skeleton of every day | R4-SES-05, VOL-07, R2-SES-05, R3-SES-01 |
| 11 | Leave reps in the tank; never go to failure on heavy compound lifts | VOL-13, GEN-08, R2-VOL-02 |
| 12 | Small muscles take more reps, big muscles take a mix, everyone works between 5 and 30 | COACH-CHAT, VOL-11, VOL-12 |
| 13 | Don't "confuse" the muscle | COACH-CHAT, PER-02, PER-04, R2-LIB-01 |
| 14 | More for the muscle you want to grow, less where it hurts | VOL-02, R3-SES-01, VOL-03 |
| 15 | Unilateral work is for health and rotation; bilateral work is for driving force | UNI-02, UNI-10, CAT-13 |
| 16 | Learn to receive force before you create it | CAT-10, CAT-11, R2-ATH-03 |
| 17 | Time on the ground decides plyometric versus ballistic | ATH-01, R2-ATH-01, R2-ATH-02, R3-ATH-04 |
| 18 | The heavier you go, the slower you are | COACH-CHAT, EQ-06, R2-ATH-05, R2-GEN-06 |
| 19 | Machines are a safe place to collect volume; free weights ask for skill | COACH-CHAT, EQ-03, EQ-11, EQ-13 |
| 20 | Exercise level is skill, stability and where the load sits, and levels are soft | CAT-04, CAT-05, CAT-06, R2-LIB-02 |
| 21 | Core comes first | ATH-11, R2-SES-03 |
| 22 | Power first, then strength, then resistance; horizontal before vertical | COACH-CHAT, ORD-01, ORD-02, ORD-03, GEN-08 |
| 23 | Pair opposite ends of the body: hip dominant with a push, knee dominant with a pull | UNI-11, ORD-06 |
| 24 | Load the spine heavy once a week per pattern | PER-04, R2-SES-01, R2-SES-02 |
| 25 | Supersets are a tool to fatigue and to save time | ORD-05, R3-SES-02 |
| 26 | A block is completed; rest goes between blocks | R2-VOL-07, R3-PER-01, PER-01 |
| 27 | Test before and after a block, never during it and never from zero | PER-07, R2-PER-07 |
| 28 | Answers in, the whole plan out; the plan is a template you adjust, and your time is your own | R3-VOL-02, R3-VOL-04, R3-SES-02, CX-04, CT-01, R4-SES-01, R4-SES-04 |
| 29 | Workouts only, nothing is kept, and the release comes first | R2-GEN-04, GEN-02, R3-GEN-01, R4-SCP-02 |
| 30 | Everything is customizable, backed by sound science, and free for anyone | R2-VOL-06, GEN-08, PER-01, R3-GEN-01 |

---

## A. What the system is made of

### 1. Classify every exercise on every lens at once

**Rule.** Every exercise carries all of its tags at the same time: family, pattern, laterality (one side or both sides), plane, muscle size, muscles worked, equipment and level. A lens is one way of sorting the library. The plan can then be built by sorting on any lens. Biomechanics is not a category of exercises. It is the description every exercise carries.

**Why (his reasoning).** He called categorization the hardest part of his system to explain: "The hardest thing to understand is the categorization of everything" (COACH-CHAT). Asked if every exercise should be tagged on all lenses at once: "Yes, this is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge." (CAT-01). On biomechanics: "No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises. No." (CAT-03). His MASTER EXERCISE LIBRARY is the single source of truth, "as far as I was able to take it so far" (CAT-07).

**In the data.**
- `generator_spec_v1.json > rule_tables > taxonomy > all_lenses` and `generator_spec_v1.json > rule_tables > taxonomy > biomechanics`
- `synthesis/01_taxonomy.json > lenses`, `synthesis/01_taxonomy.json > facets` and `synthesis/01_taxonomy.json > nodes`
- One record per exercise: `synthesis/02_exercise_catalog.json` (source list) and `model/catalog.json > exercises` (compiled)

**Guide.** [Categories](../02-model/categories.md), [exercise library](../02-model/exercise-library.md), [adding exercises](../adding-exercises.md).

### 2. Bigger muscles and smaller muscles are handled differently

**Rule.** Bigger muscles are quads, glutes, hamstrings, lats and upper back, and chest. Smaller muscles are biceps, triceps, side and rear delts, calves, forearms and abs. In his library, big muscles are organized by movement pattern and small muscles by muscle (library layout, OBSERVED). Rear delts are not a muscle of their own: front, side and rear delts count together as **shoulders**. Glutes and hamstrings count together as **hips** when the plan checks minimums. The model calls these counting units focus groups.

**Why (his reasoning).** He confirmed the big and small lists as right (CAT-02). On shoulders: "rear delts are weird because they're part of the shoulder cap, so there are side delts and front delts as well. I just figured the shoulders were what we were talking about." and "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable." (R3-VOL-01). He approved counting hips and shoulders as groups (R3-SES-01).

**In the data.**
- `generator_spec_v1.json > rule_tables > muscles > big` and `generator_spec_v1.json > rule_tables > muscles > small`
- `generator_spec_v1.json > vocab > muscles > focus_groups` (hips, shoulders and the other groups)
- `model/rules.json > muscles > groups`

**Not confirmed (PROPOSED).** Where traps, adductors and neck sit, and whether front delts count as big or small. He left that part of CAT-02 open. Round 3 did settle one thing: front delts count inside the shoulders group (R3-SES-01).

**Guide.** [Categories](../02-model/categories.md), [volume](../02-model/volume.md).

### 3. Athletic, resistance and core work are different families, counted in different units

**Rule.** The library has families: athletic patterns (jumps, throws, Olympic lifts, sprints, change of direction), resistance patterns (muscle-building lifts) and control patterns (core), plus cardio and functional work. Only resistance work is counted in sets per muscle. Athletic work has its own units (contacts, throws, reps, meters) and never counts toward a muscle's weekly sets. Kettlebell swings are athletic work, not glute work.

**Why (his reasoning).** "I don't believe that Olympic lifts, sprints, throws, and plyos are going to count towards specific muscles because there are so many things happening at so many different levels. I think counting towards muscles is more for resistance patterns, not for athletic patterns. That's important." (VOL-10). On swings: "kettlebell swings are not glutes. They are hip-dominant, but at the speed they are swinging like that, it doesn't really become a resistance movement-building muscle work." (R2-VOL-05). On core: "The rule is deciding the trunk on core, or the pelvis on core. Those are two different things. Then both at the same time" (CAT-08).

**In the data.**
- `generator_spec_v1.json > rule_tables > athletic > never_counts_to_muscles`
- `generator_spec_v1.json > rule_tables > counting > credit_map`
- `generator_spec_v1.json > rule_tables > taxonomy > core_segments`
- `model/rules.json > credit > never_credit_tags` and `model/rules.json > credit > athletic_slot_zero`
- Locked rule `LK07` in `model/rules.json > locked`

**Guide.** [Categories](../02-model/categories.md), [athletes](../02-model/athletes.md).

### 4. Different people need different things

**Rule.** The plan changes with the person: age, training foundation, goal, sport and injuries. It never changes with sex. Some people need more resistance training. Others need more power through athletic patterns. Older adults do not get jumps or Olympic lifts unless they ask for them.

**Why (his reasoning).** "Different athletes need different things." (COACH-CHAT). "athletes that are field athletes don't need to get bigger and stronger that much. A powerlifter or bodybuilder needs to get bigger and stronger." (UNI-02). "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries. The rules kind of apply to everybody." (ATH-09). "Definitely, the older population doesn't really need a lot of plyos unless they ask for it." (ATH-09). He confirmed which athletes need more resistance work (linemen, wrestlers, rugby, heavyweight fighters, throwers) and which need more speed and power (sprinters, basketball, skill positions, volleyball) (ATH-03).

**In the data.**
- `synthesis/04_profiles.json > profiles` (127 sport, activity and goal profiles) and `synthesis/04_profiles.json > age_overlays`
- `generator_spec_v1.json > rule_tables > athletic > resistance_vs_speed_groups`
- `generator_spec_v1.json > inputs_schema > removed_fields` (the sex field, removed)
- `model/profiles.json > sports`, `model/rules.json > population`

**Not confirmed (PROPOSED).** Most per-sport numbers inside the profiles (set budgets, weekly contacts) come from the team. The plyometric shares by sport are approved (principle 17).

**Guide.** [Sports](../02-model/sports.md), [special populations](../02-model/special-populations.md), [stay athletic and active](../02-model/stay-athletic-and-active.md).

---

## B. How much work

### 5. Count hard sets per muscle group per week, and nobody trains a group with fewer than 10

**Rule.** Volume is counted as hard sets per muscle group per week. A hard set is a working set taken close to its limit. Starting points are about 10 to 12 for a beginner, 15 to 20 for an intermediate and 20 or more for an advanced lifter. With 3 or more training days, every group the plan trains directly gets at least 10 sets a week in a training block. Shoulders count as one group for that floor. With 2 training days, every big muscle is still trained, at about 6 to 8 weekly sets, and the plan suggests a third day.

| Parameter | Value | Source |
|---|---|---|
| Start, big muscles (beginner / intermediate / advanced) | 10 / 15 / 20 sets a week | VOL-01 (ranges 10-12 / 15-20 / 20+); the single numbers are the team's pick inside his ranges |
| Start, shoulders, biceps, triceps | 10 / 12 / 15 sets a week | R2-VOL-04, R2-VOL-06, R3-VOL-01 |
| Floor for a trained group, 3 or more training days | 10 sets a week | R2-VOL-06, R3-VOL-01 |
| Every big muscle on 2 training days | about 6 to 8 sets a week; say so and suggest a third day | R4-SES-03 |
| Top number (ceiling) in one 12-week plan | 14 / 22 / 25 sets a week, reached in the last week | R2-VOL-06, CX-01, R4-PRG-01 |
| Calves | one exercise, 3 sets, every leg day | VOL-17, R3-SES-01 |

**Why (his reasoning).** "I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation." and "I think doing 40 sets of chest per week might be way too much, but I think 5 might be too little." (UNI-01). "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). "8 sets a week is probably just barely maintenance. Essentially, the little muscles also grow the same idea." (R2-VOL-04). "If you put together all the sets of shoulders, it'll equate to more than 10 sets" (R3-VOL-01). On 2 days a week: "People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation." (R4-SES-03).

**In the data.**
- `generator_spec_v1.json > rule_tables > weekly_sets > muscles`, `generator_spec_v1.json > rule_tables > weekly_sets > floors` and `generator_spec_v1.json > rule_tables > weekly_sets > landmarks_coach`
- `synthesis/12_volume_algorithm_v1.json > starting_table`
- `model/rules.json > volume > start`, `model/rules.json > volume > cap` `model/rules.json > volume > floor` (`applies_from_days: 3`) and `model/rules.json > volume > two_day`

**Not confirmed (PROPOSED).** Where the floor does not apply (maintenance phases, pre-season, in-season, a group cut back for pain). He answered only the rear-delt part of that question (R3-VOL-01), so the rest is the team's reading. Two more team readings sit in this table. The same ceilings (14 / 22 / 25) are used for small muscles because he said "the little muscles also grow the same idea" (R2-VOL-04). And calves reach 10 sets a week through a fourth set and an optional-day slot; he only gave the 3 sets per leg day.

**Guide.** [Volume](../02-model/volume.md).

### 6. The main mover gets a full set, the helpers get a quarter

**Rule.** One set counts 1.0 for the main muscle and 0.25 for each helper muscle. Squats, lunges, deadlifts and RDLs (Romanian deadlifts) give glutes a quarter set. Hip thrusts and bridges give glutes a full set. Dips count half for triceps and half for chest. A thruster counts 1 for quads, half for shoulders and a quarter for glutes. A set written 10/10 is 10 reps on each side and counts as one set.

**Why (his reasoning).** The team assumed helpers at half a set. He corrected it: "I would suggest a 0.25 to the helpers, not a 0.5." (VOL-09). On glutes in compound lifts: "that sounds like the math is correct on the way to count for compound movements that include glutes." (R2-VOL-05). On dips: "dips i would say more tricep than chest but still .5 and .5 done in push day or push exercise" (LIB-16). On unilateral sets: "So when I say 10/10, it means 10 on each leg." (UNI-01).

**In the data.**
- `generator_spec_v1.json > rule_tables > counting > credit_map` and `generator_spec_v1.json > rule_tables > counting > unilateral`
- `model/rules.json > credit > helper` (0.25), `model/rules.json > credit > classes` and `model/rules.json > credit > exceptions`

**Not confirmed (PROPOSED).** Group credit (a set counts at most 1.0 toward a group such as shoulders) and the quarter set for adductors.

**Guide.** [Volume](../02-model/volume.md).

### 7. Every plan is a stairway that reaches its final sets

**Rule.** Weekly sets go up in steps, week after week. The steps are a little smaller in the first half of the plan and a little bigger after the halfway week. The hardest weeks come last. The step is a percentage of each muscle group's weekly sets. It does not depend on muscle size. Each trained group reaches its planned final sets, and the steps get bigger when that is what it takes. A week may keep the same sets while reps or load go up. Reps and load are written as a rule the person applies, not as a promised number.

| Parameter | Value | Source |
|---|---|---|
| Usual step until the halfway week | about 3% a week | R3-VOL-04 (approved) |
| Usual step after the halfway week | about 5% a week | R3-VOL-04 (approved) |
| Largest step allowed | no hard limit; a week that adds more than about 15% carries a note | CX-01, R4-PRG-02 (the 7% limit of R2-VOL-01 is retired) |
| Same sets two weeks in a row | allowed while reps or load progress, also at the top number | CX-02, CX-03 |
| Reps and load | a rule: "When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." | R4-PRG-03 |
| Where each group ends | at its planned final sets, in the last week when the math allows; one week early is fine; never earlier | R3-VOL-04, CX-01, R4-PRG-01 |
| The next block | starts about 5% above where the last one started, never above the level's top | R4-PRG-04 |

**Why (his reasoning).** "No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." and "In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much." (R2-PER-03). On the usual size of the step: "it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program." (UNI-05). On reaching the planned final sets when small steps are not enough: "no, go ahead and increase faster if thats the need, they could edit accordingly" (CX-01). On what sets the step: "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person." (VOL-05). On who does the math: "The program will just have its natural algorithm recommendation of growth throughout it" (R3-VOL-04).

**In the data.**
- `generator_spec_v1.json > rule_tables > rate_engine > principle`, `generator_spec_v1.json > rule_tables > rate_engine > standard_steps` and `generator_spec_v1.json > rule_tables > rate_engine > limits`
- `synthesis/12_volume_algorithm_v1.json > stairway`
- `model/rules.json > stairway > standard_steps`, `model/rules.json > stairway > progression`, `model/rules.json > cycles > next_block` and `model/rules.json > render > progression`. (The compiled list of locked rules still carries `LK08`, "total weekly sets rise by less than 10%". That is a leftover: CX-01 and R4-PRG-02 retired it as a limit.)

**Not confirmed (PROPOSED).** The scaling formula that sizes the steps so a group lands on its final sets; never flagging one single added set as a big step; and at least one whole set more in the next block.

**Guide.** [Stairway](../02-model/stairway.md).

### 8. Start at a 2, end at an 11

**Rule.** A block should feel like a 2 out of 10 in week 1 and like an 11 in the last week. This is about how hard the whole week feels, not about the number of sets. The last weeks push a little past what the person usually does. The effort cue moves with it: 3 reps left in the tank early, then 2, then 1 to 2, then 1 plus extra-hard sets in the last week.

**Why (his reasoning).** "It feels like if you do RPE, you start feeling like a 2, and then that's how you start your program, and then you're gradually going up that ladder. The last week might feel like an 11, like you're doing more than what you usually do." and "By the time you're done with your block, ideally, you've pushed yourself a little bit past your limits, which is what an 11 really would mean." (R2-PER-05). "on a 12-week program, the last 4 weeks are going to be brutal." (R2-PER-04). He first described the idea for repeated 12-week programs: "You might want to start at a 2 and end at an 11, meaning your volume slowly creates more" (PER-01). The effort drift was approved as part of the stairway (R3-VOL-04).

**In the data.**
- `generator_spec_v1.json > rule_tables > rate_engine > start_at_2_end_at_11`
- `generator_spec_v1.json > rule_tables > effort > planned_drift`
- `generator_spec_v1.json > plan_types > fixed_12 > stair_level` and `generator_spec_v1.json > plan_types > fixed_12 > planned_rir`
- `model/rules.json > effort > planned_map`

**Not confirmed (PROPOSED).** The printed stair-level number for each week (2, 2.6, 3.2 ... 11) is a display the team designed.

**Guide.** [Stairway](../02-model/stairway.md).

### 9. Add sets to the things that matter most

**Rule.** When a muscle earns one more set, the set goes to the first exercise of the day for that muscle. The next added set goes to the second exercise, and so on. Three exercises that start at 2 sets each go 2/2/2, then 3/2/2, then 3/3/2, then 3/3/3, then 4/3/3. When the same day runs twice a week, the added set alternates between the two days. Small increases are banked until they make a whole set. The tool does this math, not the person.

**Why (his reasoning).** "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning of the exercise because I put all my energy into it." (VOL-07). On who calculates: "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." (VOL-06). The alternation between two days was approved in round 3 (R3-VOL-03).

**In the data.**
- `generator_spec_v1.json > rule_tables > set_placement > steps`
- `generator_spec_v1.json > rule_tables > banking`
- `model/rules.json > placement`

**Guide.** [Stairway](../02-model/stairway.md), [volume](../02-model/volume.md).

### 10. His own templates are the skeleton of every day

**Rule.** The tool does not invent day layouts. Every day is built on one of his own templates, slot for slot. His "full body" day is an A day or a B day of about 6 exercises, up to 8. Day A is pull plus knee dominant: row, squat, pulldown, lunge, biceps, leg extension. Day B is push plus hip dominant: press, hinge or hip thrust, vertical or incline press, single-leg hinge, triceps, leg curl. Push / pull / legs is his other main layout. On a split day a muscle group gets 2 to 4 exercises, never 1. Calves get one exercise, 3 sets, every leg day.

**Why (his reasoning).** "Usually, I have about 3 to 4 exercises per muscle group per day." (VOL-07). In round 2 he said full-body days needed the same: "there's never one exercise, so from 2 all the way to 4" (R2-SES-05). That did not fit his own session size, so round 4 asked which rule wins on a full-body day. He answered with his template: "The template is usually 6 exercises for the full-body days because we do that A-day/B-day of upper/lower" and "We don't design full bodies only with push, pull, and legs. This is the model that I believe is the greatest one." (R4-SES-05). He approved counting his focus groups (R3-SES-01).

**In the data.**
- `generator_spec_v1.json > rule_tables > session_limits > exercises_per_muscle_on_its_day`
- `model/rules.json > session > exercises_per_group` (`full_body_day: [1, 4]`, `split_day: [2, 4]`), `model/rules.json > session > full_body_days`
- `model/templates.json` (day types with `skeleton`: `gym_A`, `gym_B`, `gym_C`, `ppl_push`, `ppl_pull`, `ppl_legs`, `athletic_A` ...)

**Not confirmed (PROPOSED).** Keeping "2 to 4, never 1" for split days after round 4 is the team's reading (INFERRED). The order inside each A / B pair follows his round-4 answer (upper lift first); his sheet lists the leg lift first.

**Guide.** [Sessions](../02-model/sessions.md).

### 11. Leave reps in the tank; never go to failure on heavy compound lifts

**Rule.** Effort is set in reps in reserve (RIR): how many more clean reps you could have done. Every working set sits between 1 and 3 reps in reserve. RPE (a 1 to 10 effort rating) is shown beside it. A MAX set (as many reps as you can) is allowed only on the last set of small-muscle or bodyweight work. Heavy compound lifts (lifts that use several joints, such as squats, deadlifts and presses) never go to failure. An effort of 10 means the most you could do, done successfully. It is not a failed set.

**Why (his reasoning).** "I like RIR in my model, so that's what I'm going to be using." and "Everything in training is kind of subjective. It's very hard to get an objective opinion when someone's tired and their body's hurting" (VOL-13). On what a 10 means: "I can't do any more than this. I gave it all I had, but it was successful." (R2-VOL-02). On what he wants from each set: "What I just want them to do is that every time they do a set, they do it correctly and they do it with effort." (VOL-14). Never going to failure on heavy compound lifts is one of the hard rules he confirmed (GEN-08, approved as the team worded it).

**In the data.**
- `generator_spec_v1.json > rule_tables > effort > scale`, `generator_spec_v1.json > rule_tables > effort > never`, `generator_spec_v1.json > rule_tables > effort > max` and `generator_spec_v1.json > rule_tables > effort > effort_menu_reading`
- `model/rules.json > effort > rir_band`; locked rule `LK01` in `model/rules.json > locked`

**Guide.** [Stairway](../02-model/stairway.md), [glossary](../05-reference/glossary.md).

### 12. Small muscles take more reps, big muscles take a mix, everyone works between 5 and 30

**Rule.** Small muscles work at 12 to 30 reps because they cannot be loaded very heavy. Big muscles work at 5 to 15 reps, a mix. A person's preference (lighter with more reps, or heavier powerlifting style) moves the rep range on the big compound lifts only. Weekly sets stay about the same. Sets of 40 reps are not a default.

**Why (his reasoning).** In conversation he said smaller muscles take more reps because you can't go heavy, bigger muscles take a mix, and everyone works between 5 and 30 reps (COACH-CHAT). He confirmed the ranges and added: "I'm not really a big fan of 40 reps of doing something. A 40-rep set would be more for CrossFit, maybe" (VOL-11). He confirmed that preference changes reps on big lifts only (VOL-12).

**In the data.**
- `generator_spec_v1.json > rule_tables > reps > by_size`, `generator_spec_v1.json > rule_tables > reps > forty_rep_sets` and `generator_spec_v1.json > rule_tables > reps > preference_styles`
- `model/rules.json > reps > matrix`

**Not confirmed (PROPOSED).** The full rep table by goal and exercise type is built by the team from his menu labels and written programs.

### 13. Don't "confuse" the muscle

**Rule.** The exercises stay the same for 4 to 6 weeks. The model calls this stretch an exercise block. It is shorter than the 8 or 12-week training block of principle 26: a 12-week plan holds three exercise blocks (weeks 1-4, 5-8 and 9-12), and the stairway keeps climbing across each change. That split and the continuity are the team's reading (**PROPOSED**). Inside an exercise block only sets, reps, load and effort move. At the next exercise block, one or two small things change (grip, stance, implement, range of motion, rep range), never everything at once. The tool may show a one-detail variation of a library exercise. It never invents an exercise. The second time a slot comes up in the same week, it uses a different exercise from the same category.

**Why (his reasoning).** "Don't try to 'confuse' the muscle." (COACH-CHAT). He confirmed fixed exercises inside a block of 4 to 6 weeks and one or two small changes at the next block (PER-02). Variety exists for people who want it: "sometimes athletes and people want more variety, and that'll give them more variety. If they don't really need a lot of variety, then they don't have it" (PER-03). He approved one-detail variations and no invented exercises (R2-LIB-01).

**In the data.**
- `synthesis/11_training_variables.json > variation_policy`
- `generator_spec_v1.json > rule_tables > library_decisions > variations`
- `generator_spec_v1.json > rule_tables > set_placement > block_rule` and `generator_spec_v1.json > rule_tables > set_placement > second_weekly_exposure`
- `generator_spec_v1.json > plan_types > fixed_12 > exercise_blocks` and `generator_spec_v1.json > plan_types > fixed_8 > exercise_blocks`

**Guide.** [Exercise library](../02-model/exercise-library.md), [plans and calendar](../02-model/plans-and-calendar.md).

### 14. More for the muscle you want to grow, less where it hurts

**Rule.** A person may pick Focus muscle 1 and Focus muscle 2. Each gets a few extra sets a week on top of a balanced plan. Pain works the other way: that muscle or pattern is cut by 30 to 50%, moved to machines or split grips, and the exercise is dropped if it is still too much.

**Why (his reasoning).** "they should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one compared to the other one." and "As much as everything else is balanced, the glutes should have an extra set or two or three." and "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." (R3-SES-01). On pain: "That's correct, and maybe even drop the exercise altogether if it's too much." (VOL-03).

**In the data.**
- `generator_spec_v1.json > rule_tables > priority > v1_2_focus_muscles` and `synthesis/12_volume_algorithm_v1.json > focus_muscles`
- `generator_spec_v1.json > rule_tables > pain`
- `model/rules.json > volume > focus` and `model/rules.json > volume > pain`

**Not confirmed (PROPOSED).** The default of +2 sets for a Focus muscle. He said "an extra set or two or three"; the middle value is the team's pick.

**Guide.** [Volume](../02-model/volume.md), [special populations](../02-model/special-populations.md).

---

## C. Force, speed and equipment

### 15. Unilateral work is for health and rotation; bilateral work is for driving force

**Rule.** Bilateral lifts (both sides together) are for producing force, building muscle and getting stronger. Unilateral lifts (one side at a time) keep the hips and lower back healthy and keep the body's rotation. The share between the two slides from 90/10 to 10/90 depending on the athlete, the phase and pain. Bodybuilders and powerlifters start near 50/50 and move to 80/20 or 90/10 bilateral. Field athletes who change direction a lot do 80 to 90% unilateral work. In season, bilateral work stays minimal.

**Why (his reasoning).** "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-02). For a tennis player: "Their unilateral work, which is what they do in their sport, can be more like 80% or 90% unilateral work in the gym because I don't want them to lose their rotational forces and skills." (UNI-02). In season: "I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season." (UNI-10). For strength athletes, unilateral work restores "the rotational forces that get lost when you do powerlifting and bodybuilding" (CAT-13).

**In the data.**
- `generator_spec_v1.json > rule_tables > bilateral_unilateral` and `generator_spec_v1.json > rule_tables > contra_ipsi`
- `synthesis/04_profiles.json > bilateral_unilateral_model`
- `model/rules.json > bilateral_share` and `model/rules.json > contra_ipsi`

**Not confirmed (PROPOSED).** The exact share for every profile he did not name. He gave the range and the two ends and said "We got to figure that out and put that algorithm together." (UNI-02).

**Guide.** [Bilateral and unilateral](../02-model/bilateral-unilateral.md).

### 16. Learn to receive force before you create it

**Rule.** Jump training starts with landing. Stage 1 is receive and pause (stick the landing). Stage 2 is receive, then create (land, then one jump). Stage 3 is repeated receive and create (continuous hops). The model calls these the Receive-Create stages. They are a way of doing a jump, not a property of an exercise.

| Stage | 12-week plan | 8-week plan | Source |
|---|---|---|---|
| 1 Land | weeks 1-3 | weeks 1-2 | R2-ATH-03 (approved) |
| 2 Land & Go | weeks 4-7 | weeks 3-5 | R2-ATH-03 (approved) |
| 3 Repeat | weeks 8-12 | weeks 6-8 | R2-ATH-03 (approved) |

**Why (his reasoning).** "Your body and your connective tissue need to learn how to receive forces before we teach it how to create. The beginning of a program might have a lot more receiving, like stick-the-landing drills and things like that." (CAT-10). He did not want them called zones: "it's more like the way I want the plyos to be done" (CAT-11). He approved the name and the weeks in round 2 (R2-ATH-03).

**In the data.**
- `generator_spec_v1.json > rule_tables > athletic > method_stage`
- `synthesis/04_profiles.json > ground_contact_model > plyo_method_stages`
- `model/rules.json > athletic > stages`

**Guide.** [Athletes](../02-model/athletes.md).

### 17. Time on the ground decides plyometric versus ballistic

**Rule.** A plyometric jump has a short, bouncy ground contact. A ballistic movement has a longer contact or is one big effort (a box jump, a loaded jump, a medball throw). The more time a sport spends on the ground, the more ballistic work its athletes get. The less time on the ground, the more plyometric work. Both are always in the plan. A program starts more ballistic and becomes more plyometric.

| Share of jump and throw work that is plyometric at the end of a block | Sports (examples from the lists he approved) | Source |
|---|---|---|
| 75% | sprinters, runners | R2-ATH-01, R3-ATH-04 |
| 60% | volleyball, soccer, football skill positions | R2-ATH-01 |
| 50% | basketball, tennis, weekend warriors, pickleball, HYROX | R2-ATH-01, R3-ATH-04 |
| 40% | baseball, softball, hockey, linemen, MMA | R2-ATH-01 |
| 25% | boxing, karate, wrestling, BJJ, golf, swimming | R2-ATH-01, R3-ATH-04 |

Each block starts 15 points more ballistic than it ends (R2-ATH-01).

**Why (his reasoning).** "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics. But both of those ranges are important, both end ranges" (ATH-01). "The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement." (CAT-10). The reason to build toward plyometrics slowly: "we're trying to work on the connective tissue resistance and endurance, and just overall structure." (CAT-10).

**In the data.**
- `generator_spec_v1.json > rule_tables > athletic > plyo_vs_ballistic`
- `synthesis/04_profiles.json > ground_contact_model`
- `model/rules.json > athletic > ground_contact_classes` and `model/rules.json > athletic > block_start_offset`

**Guide.** [Athletes](../02-model/athletes.md), [sports](../02-model/sports.md).

### 18. The heavier you go, the slower you are

**Rule.** Speed is a training variable, just like load, range of motion and volume. To train speed, the load must be light. Medball passes and rotations use 8 to 10 lb. No medball or wall ball is ever above 20 lb. Olympic lifts are explained as power output and judged by speed. They do not have to go by percentage; a percentage is used only when the person has tested that lift. Quality of movement matters as much as quantity.

**Why (his reasoning).** "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (COACH-CHAT). On heavy medballs: "No, I don't think there's any need for anything more than 20 lbs., to be honest." (EQ-06). On Olympic lifts: "these are for power output, and they don't necessarily need to go by percentage unless you're a competitive Olympic lifter." (R2-GEN-06). The check is "the coach's eye and how the athlete's feeling to make sure that they're fast and powerful." (R2-ATH-05). Percentages for an Olympic lift appear only when the person enters a recent best for it (R2-GEN-06, approved as proposed).

**In the data.**
- `synthesis/10_equipment_model.json > load_velocity` and `synthesis/11_training_variables.json > load_velocity_rules`
- `generator_spec_v1.json > rule_tables > athletic > medball`
- `model/rules.json > medball > max_lb` and `model/rules.json > medball > loads_lb`; locked rule `LK12` in `model/rules.json > locked`

**Not confirmed (PROPOSED).** The doses in the load-velocity table (sets, reps, stop rules) are the team's.

**Guide.** [Athletes](../02-model/athletes.md), [equipment](../02-model/equipment.md).

### 19. Machines are a safe place to collect volume; free weights ask for skill

**Rule.** A machine gives the body many reference points: you sit, your feet are planted, you move only your hands or feet. That makes it safer and lets you push hard. Machines suit people adding a lot of volume, people with injuries and older people. Free weights ask for more skill, and the barbell asks for the most. Machines are not ranked against each other. The person picks the one that feels right. The model describes equipment on a constraint scale from 1 (bodyweight, reactive) to 5 (seated machine with a back pad).

**Why (his reasoning).** In conversation he explained that machines have many reference points and constraints, so you can push a lot and it is safer (COACH-CHAT). "If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints" (EQ-03). On ranking: "I don't want to rank them because they have different brands, angles, and things like that." and "I want them to feel the right muscles. I want them to get the right stimulus." (EQ-11). He approved the 1 to 5 constraint scale (EQ-13).

**In the data.**
- `synthesis/10_equipment_model.json > constraint_scale` and `synthesis/10_equipment_model.json > machine_preferences`
- `generator_spec_v1.json > rule_tables > equipment > constraint_scale`, `generator_spec_v1.json > rule_tables > equipment > machines_not_ranked` and `generator_spec_v1.json > rule_tables > equipment > older_injured_high_volume`
- `model/rules.json > equipment > client_families`

**Guide.** [Equipment](../02-model/equipment.md).

### 20. Exercise level is skill, stability and where the load sits, and levels are soft

**Rule.** An exercise is harder when it needs more skill and stability, and when the load sits further back. Load in front of you is foundational (goblet squat). Load close to and on the body is intermediate (front squat). Load behind the body is advanced (back squat). A seat, a machine or a cable makes any position easier. Levels add options and never take them away. A client's level (how much volume) and an exercise's level (how hard the movement is) are two separate things. Safety beats the label: an older or injured beginner may use a machine filed as advanced.

**Why (his reasoning).** "The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright." and "When it's machines or cables, it changes because it's easier because the machine or the cable is doing the work for you." (CAT-04). "The levels are still very theoretical, so we don't need to rely heavily on them." (CAT-05). He confirmed that client level and exercise level are separate (CAT-06) and that safety beats the level label for older or injured clients (EQ-04).

**In the data.**
- `generator_spec_v1.json > rule_tables > levels_exercise`
- `generator_spec_v1.json > rule_tables > taxonomy > levels`
- `synthesis/10_equipment_model.json > level_model`

**Guide.** [Levels and zones](../02-model/levels-and-zones.md).

---

## D. How a session is built

### 21. Core comes first

**Rule.** Every session opens with core work, right after the warm-up. It is light: 2 exercises of 2 sets, short of failure. The person may move the core block or switch it off for a day. Coaches may add core supersets anywhere.

**Why (his reasoning).** The team assumed core came after the power block for athletes. He said: "No, we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff." and "Ideally, for me, I want everybody to start with core work so they can get it out of the way." (ATH-11). On extra core: "It should be optional to be thrown anywhere" (R2-SES-03). The light dose of 2 exercises of 2 sets was approved as proposed (R2-SES-03). Switching a day's core block off comes from round 3: people "should be able to turn off that day's athletic training or that day's core training and just focus on resistance" (R3-SES-02).

**In the data.**
- `generator_spec_v1.json > rule_tables > core_block`
- `model/rules.json > core_block`; locked rule `LK05` in `model/rules.json > locked`

**Guide.** [Sessions](../02-model/sessions.md).

### 22. Power first, then strength, then resistance; horizontal before vertical

**Rule.** A session runs from fast to slow: athletic and power work first, then strength, then resistance work for muscle. Rows come before pulldowns and horizontal pushes come before vertical pushes. The main lift of the day (his sheets call it 'the work') comes first in its part of the session, whatever its direction.

**Why (his reasoning).** In conversation he gave the order as power first (athletics), then power-strength, then strength, then resistance patterns, with rowing before an overhead pull and horizontal push before vertical push (COACH-CHAT). He confirmed row before pulldown (ORD-01), the main lift first (ORD-02) and cleans and snatches before heavy strength (ORD-03). He did not give a reason for horizontal first in so many words. His description of positions fits it: horizontal work is "safer for you when you push and pull", while overhead work is "more advanced, with the positioning, the amount of stability that you need, and the skill that you need to do things right." (CAT-04). Linking the two is the team's reading (PROPOSED). He confirmed the order rules as hard rules and added "and options for a coach to add their own rules if they want" (GEN-08).

**In the data.**
- `generator_spec_v1.json > rule_tables > ordering > hard` and `generator_spec_v1.json > rule_tables > ordering > tiers`
- `synthesis/11_training_variables.json > ordering_rules`
- `model/rules.json > ordering > block_order` and `model/rules.json > ordering > hard`; locked rules `LK03` and `LK04` in `model/rules.json > locked`

**Guide.** [Sessions](../02-model/sessions.md).

### 23. Pair opposite ends of the body: hip dominant with a push, knee dominant with a pull

**Rule.** In any session that mixes lower and upper body, a hip-dominant lift (a hinge such as a deadlift, which works the back of the legs) is paired with a push (the front of the upper body). A knee-dominant lift (a squat or a lunge, which works the front of the legs) is paired with a pull. This holds for full-body days and bootcamps too.

**Why (his reasoning).** "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." and "That'll allow me to keep as far away as I can from bleeding over problems when I'm working out." (UNI-11). The payoff: "You can do a lot of work throughout the week and more volume throughout your program." (UNI-11). "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06).

**In the data.**
- `generator_spec_v1.json > rule_tables > pairing > hip_push_knee_pull`
- `model/rules.json > pairing > hip_with` and `model/rules.json > pairing > knee_with`

**Guide.** [Sessions](../02-model/sessions.md).

### 24. Load the spine heavy once a week per pattern

**Rule.** A week has one heavy squat day and one heavy deadlift day, on two different days. The other lower-body days use lifts that do not load the spine: leg press, belt squat, hip thrust, back extension, reverse hyper or single-leg dumbbell work. An athlete who is already sore from back loading switches to the belt squat.

**Why (his reasoning).** "I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well." (PER-04). "Belt squats are for people that you don't need to load them axially, so it won't be a load on their back." (EQ-11). He approved the two-day layout and the list of lifts that count as loading the spine (R2-SES-01, R2-SES-02).

**In the data.**
- `generator_spec_v1.json > rule_tables > axial_loading`
- `model/rules.json > axial > budget` and `model/rules.json > axial > counted`; locked rule `LK11` in `model/rules.json > locked`

**Guide.** [Sessions](../02-model/sessions.md).

### 25. Supersets are a tool to fatigue and to save time

**Rule.** A superset is two exercises done back to back. It is used when a person wants a faster session, when an advanced athlete needs more stimulus, when an off-season athlete is building aerobic capacity, or when a beginner does not get tired from one exercise. The plan recommends supersets; the person decides. No session length switches them on.

**Why (his reasoning).** "The supersetting is more like a fatiguing principle." and "It's a tool to use to fatigue the heart more and compress the time." (ORD-05). "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (R3-SES-02).

**In the data.**
- `generator_spec_v1.json > rule_tables > supersets_contrast_circuits > use_cases` and `generator_spec_v1.json > rule_tables > supersets_contrast_circuits > recommendations`
- `model/rules.json > supersets`

**Guide.** [Sessions](../02-model/sessions.md).

---

## E. Plans and time

### 26. A block is completed; rest goes between blocks

**Rule.** A block is a run of training weeks (8 or 12, with 12 preferred). Once started, it is completed. There is no deload week and no maintenance week inside it. A deload is an easy week at about half the sets. If someone cannot complete a block, they cancel it, do a maintenance phase and then start a whole new block. After a finished block, an easy week is recommended but not required. When the block ends, it ends, and the person builds what comes next. Plans of 4 to 6 weeks are for maintenance and transitions, at about 50 to 70% of the volume.

**Why (his reasoning).** "It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it. If they can't complete it, they should cancel the block and start a maintenance phase, but then, when they're done with maintenance, they should start a whole new block." (R2-VOL-07). "maintenance weeks are a recommendation. They don't have to be mandatory, so people can go ahead and start one, or when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." (R3-PER-01). On length: "Usually, I like, personally, on my model, the 12-week programs." (PER-01). On short plans: "This allows them to recover and not push too hard." (PER-01).

**In the data.**
- `generator_spec_v1.json > plan_types > deload > when`
- `generator_spec_v1.json > plan_types > fixed_12`, `generator_spec_v1.json > plan_types > fixed_8` and `generator_spec_v1.json > plan_types > maintenance_4_6`
- `model/rules.json > recovery`; locked rule `LK13` in `model/rules.json > locked`

**Guide.** [Plans and calendar](../02-model/plans-and-calendar.md).

### 27. Test before and after a block, never during it and never from zero

**Rule.** Testing is optional and chosen by the athlete or coach. Tests happen before the block or in week 1, and again at the end. Nobody tests in the middle. Someone who has not finished a block of training never tests a 1-rep max or an all-out mile. They test a 5-rep or 3-rep max, or a hard effort at 80 to 90%.

**Why (his reasoning).** "It's up to the athlete or the coach what they're going to be testing" (PER-07). "We should be giving value to people, and they should not test during the weeks, during the block." and "you should not go from not training to a one-rep max test." and "They should try to test at 80%, 90%, but not at 100%." (R2-PER-07).

**In the data.**
- `generator_spec_v1.json > tests > rule` and `generator_spec_v1.json > tests > never_from_zero`
- `model/rules.json > tests`; locked rule `LK14` in `model/rules.json > locked`

**Guide.** [Testing](../02-model/testing.md).

---

## F. The product

### 28. Answers in, the whole plan out; the plan is a template you adjust, and your time is your own

**Rule.** A person enters a few basics and gets the whole plan at once, with every week visible ahead of time. There are no check-ins, no tracking and nothing to report back. The plan is a complete template. The person or their coach adjusts all of it: change the sets of any day or week, switch off a day's athletic or core block, add or remove exercises, use the suggested supersets. The tool does not manage anyone's time. It does not ask for a session length, it sizes a session by its number of exercises, and it prints an average time on each day as information only. Nothing is cut or dropped automatically: the person picks what to take away.

**Why (his reasoning).** "I want this to be very simple." and "I don't want people to be checking back on their phone in their program. I want them to be able to kick out a program, and that's it. That's the program." and "It's already a template, and you need to adjust it as you need to." (R3-VOL-04). "We're only doing outputs, and people can change accordingly." (R3-VOL-02). "an athlete or a coach should be able to modify accordingly." (R3-SES-02). "It should be all editable as they need to." (CX-04). On time: "You need to stop trying to be responsible for the people's time." and "I want you to not get complicated over the time." (CT-01). On what to leave out of a long day: "That's something for the athlete to adjust." (R4-SES-04). On the interface: "The fewer clicks, the better." (R2-GEN-02).

**In the data.**
- `generator_spec_v1.json > plan_editing > principle`
- `generator_spec_v1.json > rule_tables > rate_engine > no_feedback` and `generator_spec_v1.json > adaptation > status` (retired)
- `model/rules.json > session > size`, `model/rules.json > session > easy_to_remove` (`automatic: false`), `model/rules.json > time_model` (`use: estimate_only`)
- `engine/edit.mjs > applyPlanEdits` (sets, add, remove, block on or off)
- `model/rules.json > stairway > planned_only`; locked rule `LK18` in `model/rules.json > locked`

**Not confirmed (PROPOSED).** How editing works on screen (block ids, notes after an edit), the wording of the printed guide on how to adjust the plan, the list of what is "easiest to remove", and the minutes behind the time estimate.

**Guide.** [How a plan is made](../00-overview/how-a-plan-is-made.md), [stairway](../02-model/stairway.md), [sessions](../02-model/sessions.md).

### 29. Workouts only, nothing is kept, and the release comes first

**Rule.** The form asks only what the plan needs. It has no sex field, no questions about sleep, stress, work or life, and no question about session length. The tool keeps no data. Everyone may use the plans, and everyone accepts the terms and the release of liability before a plan is generated: no acceptance, no plan. Every plan prints a short line that liability was released. People who want to track their training do it themselves.

**Why (his reasoning).** "No, I don't want anything to do with anything else other than just workouts. I just need the workouts here. There's no need to talk about sleep or stress or anything else." (R2-GEN-04). "I need you to take away just sex." (GEN-02). "I don't know if we should be keeping any kind of data, but I don't want any data kept." (R3-GEN-01). "I don't think that they should be tracking it from us. They should be tracking it themselves, however they want to track it, notebook or whatever" (GEN-03). On the release: "they need to click it before the plan shows, as part of when they put in their data" (R4-SCP-02) and "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out." (R4-SCP-01).

**In the data.**
- `generator_spec_v1.json > inputs_schema > removed_fields`
- `generator_spec_v1.json > legal_and_privacy > no_data_kept` and `generator_spec_v1.json > legal_and_privacy > release_every_build`
- `model/rules.json > legal > nothing_stored`, `model/rules.json > legal > gate` and `model/rules.json > legal > release_line`; locked rules `LK10`, `LK16` and `LK17` in `model/rules.json > locked`

**Guide.** [Safety and liability](../00-overview/safety-and-liability.md), [DISCLAIMER.md](../../DISCLAIMER.md).

### 30. Everything is customizable, backed by sound science, and free for anyone

**Rule.** The model's numbers are defaults. A coach can change them and add their own rules. The hard rules he confirmed stay locked in what the tool builds (GEN-08, and later answers such as R2-VOL-07, R2-PER-07, R2-GEN-04, R3-VOL-02 and R3-GEN-01). How the layers of locked rules, defaults and coach rules work is the team's design (**PROPOSED**). The model is checked against published research. The whole repository is released under the MIT license so any coach, gym, developer or AI agent can use it, at their own risk.

**Why (his reasoning).** "Yeah, but this is all customizable." (R2-VOL-06, said about the weekly-set ceilings). He asked for "options for a coach to add their own rules if they want" (GEN-08). "I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it so we can research on this and make sure we do it correctly." (PER-01). On giving it away: "just give away the repo, open source it to any coach and person that wants to create a training app and just use this model to put it all together." (GEN-03). In conversation he described the goal as "the most comprehensive training model that there is out there", free "for anybody to use in their own app and their own training" (COACH-CHAT). He set the license in round 3: "there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation)." (R3-GEN-01).

**In the data.**
- `generator_spec_v1.json > coach_rule_hooks > layers` (what is locked, what a coach can change)
- `generator_spec_v1.json > legal_and_privacy > licence`
- [LICENSE](../../LICENSE), [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md)
- The research behind the rules: [synthesis/07_science_lineage.md](../../synthesis/07_science_lineage.md) and [synthesis/12_volume_algorithm_v1.md](../../synthesis/12_volume_algorithm_v1.md)

**Not confirmed (PROPOSED).** The format of coach rule files and the list of actions a coach rule may take.

**Guide.** [Lineage](lineage.md), [for coaches](../00-overview/for-coaches.md), [for developers](../00-overview/for-developers.md).

---

## Where to go next

| You want | Read |
|---|---|
| The reasoning that ties these principles together | [how-he-thinks.md](how-he-thinks.md) |
| Where each idea comes from | [lineage.md](lineage.md) |
| Ideas he turned down, in his words | [what-he-rejected.md](what-he-rejected.md) |
| Every answer he gave, by topic | [../03-coach-answers/index.md](../03-coach-answers/index.md) |
| Every number in one place | [../05-reference/parameters.md](../05-reference/parameters.md) |
| The full master document | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) |
| Rules for agents and developers | [AGENTS.md](../../AGENTS.md) |
