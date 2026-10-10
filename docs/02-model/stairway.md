# The stairway: how plans climb week to week

Every Blaze Camp plan gets a little harder each week, "like steps up a stairway". Weekly sets grow by about 3 % a week until the halfway week and by about 5 % a week after it. Each trained muscle group reaches its ceiling in the last week, so the hardest weeks come last. Effort climbs too: week 1 feels like a 2 and the last week feels like an 11. The whole stairway is worked out once, when the plan is built, and the person sees every week ahead of time. There are no check-ins and no tracking. The person or their coach adjusts the plan by hand.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`VOL-07`) are round 1, `R2-` is round 2, `R3-` is round 3. The newest round wins. **PROPOSED** means the team designed it and he has not confirmed it. His full answers by topic: [../03-coach-answers/progression.md](../03-coach-answers/progression.md).

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | **Every plan is a stairway**, whatever its length. | R2-PER-03 |
| 2 | A step is a **percentage of each muscle group's weekly sets**. It is the same rule for big and small muscles. | VOL-04, VOL-05 |
| 3 | Steps are **about 3 % a week until the halfway week** and **about 5 % a week after it**. | R3-VOL-04 |
| 4 | Each group's steps are sized so it **reaches its ceiling in the last week**. | R3-VOL-04 |
| 5 | **The hardest weeks come last.** On a 12-week plan the last four weeks are "brutal". | R2-PER-04 |
| 6 | **Never more than 7 % in a week.** 10 % a week is too much. | R2-VOL-01, UNI-05 |
| 7 | The tool turns percentages into whole sets. It saves the fraction and adds one set when the saved amount reaches one. | VOL-06 |
| 8 | A new set goes to the **first exercise of the day** for that muscle, then to the second, then the third. | VOL-07 |
| 9 | When the same day type happens twice a week, new sets **alternate**: Monday's first exercise, then Thursday's. | R3-VOL-03 |
| 10 | **Effort drifts** from 3 reps in the tank, to 2, to 1-2, to 1 plus intensifiers in the last week. It always stays inside 1 to 3 reps in reserve. | R2-PER-05, R3-VOL-04 |
| 11 | The plan is **built once and shown whole**. No check-ins, no tracking, no data kept. People adjust it themselves. | R3-VOL-02, R3-VOL-04, R3-GEN-01 |
| 12 | After a finished block, the next block starts **5 % higher** with the ceiling **one set higher**. | R2-VOL-06 |

The starting sets and the ceilings are on [volume.md](volume.md). That page also defines the client levels used below: L1 (beginner), L2 (intermediate) and L3 (advanced).

## Why

**Why a stairway.** The team first proposed an 8-week plan with four easy weeks, four hard weeks and a harder start. He said no:

> "No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." (R2-PER-03)

> "In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much." (R2-PER-03)

**Why the hardest weeks are last.**

> "on a 12-week program, the last 4 weeks are going to be brutal. Again, like a stairway: steps up, steps up, and week by week, it just gets gradually worse. I mean worse, meaning better, more volume." (R2-PER-04)

**Why the steps are small.**

> "it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program." (UNI-05)

**Why it is not by muscle size.** The team guessed big muscles would get 3 % and small ones 7 %. He corrected it:

> "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing." (VOL-05)

**Why the tool does the math.**

> "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." (VOL-06)

**Why nothing comes back from the user.**

> "The program will just have its natural algorithm recommendation of growth throughout it, so anybody can just plug in the numbers of what they want as far as weeks and sport or goals." (R3-VOL-04)

> "I want them to be able to kick out a program, and that's it. That's the program." (R3-VOL-04)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). `model/rules.json` is the compiled copy the engine reads. It is rebuilt by tools, so check the spec first when the two differ.

| What | File | JSON key |
|---|---|---|
| The principle and the formula | `generator_spec_v1.json` | `rule_tables.rate_engine.principle`, `rule_tables.rate_engine.math` |
| Step sizes (0.03, 0.05, never above 0.07) | `generator_spec_v1.json` | `rule_tables.rate_engine.standard_steps` |
| Limits (7 % step, under 10 % total) | `generator_spec_v1.json` | `rule_tables.rate_engine.limits`, `rule_tables.rate_engine.hard_ceiling` |
| Steps, stair level and planned effort for 4, 6, 8, 10, 12 and 16 weeks | `generator_spec_v1.json` | `rule_tables.rate_engine.steps_by_plan_length` |
| Weekly sets by level, already computed | `generator_spec_v1.json` | `rule_tables.rate_engine.planned_targets_by_level` |
| The felt level: "start at a 2 and end at an 11" | `generator_spec_v1.json` | `rule_tables.rate_engine.start_at_2_end_at_11` |
| Nothing changes the steps after the build | `generator_spec_v1.json` | `rule_tables.rate_engine.no_feedback`; `derived_values.D12_planned_step` |
| The open question on ceiling and step size | `generator_spec_v1.json` | `rule_tables.rate_engine.ceiling_reach_v1_2` |
| Turning fractions into whole sets | `generator_spec_v1.json` | `rule_tables.banking` |
| Where each new set goes | `generator_spec_v1.json` | `rule_tables.set_placement.steps` |
| Effort scale and planned drift | `generator_spec_v1.json` | `rule_tables.effort` (`rir_rpe`, `planned_drift`) |
| The printed "How to adjust this plan" guide | `generator_spec_v1.json` | `rule_tables.rate_engine.self_adjust_guide` |
| The next block one step up | `generator_spec_v1.json` | `plan_types.cycles` |
| The retired check-in (kept only as an empty stub) | `generator_spec_v1.json` | `adaptation` |
| Same content with research and worked examples | `synthesis/12_volume_algorithm_v1.json` | `stairway`, `banking`, `set_placement`, `examples` |
| Stairway by plan length | `synthesis/06_periodization.json` | `plan_length_model.stairway` |
| Compiled copy | `model/rules.json` | `stairway`, `placement`, `effort`, `cycles` |

---

## In detail

### 1. The step sizes

**Rule.** A *step* is how much a muscle group's weekly sets grow from one week to the next. Steps are small in the first half of the plan and a little bigger in the second half.

| Parameter | Value | Status |
|---|---|---|
| Step into each week, up to the halfway week | about 3 % of that group's weekly sets | Coach: R3-VOL-04 |
| Step into each week after the halfway week | about 5 % | Coach: R3-VOL-04 |
| Halfway week | the number of weeks divided by 2 (week 6 of 12, week 4 of 8) | Coach: R3-VOL-04. Rounding up for odd lengths is **PROPOSED**. |
| Largest step ever planned | 7 % | Coach: R2-VOL-01 (the limit in the round-2 step table he approved; the table itself is retired) |
| The person's total weekly sets | rise by less than 10 % from one week to the next | His words: UNI-05. The exact check is **PROPOSED**. |
| One whole set may always be added in a week | yes, so a very small plan can still climb | **PROPOSED** |
| Different steps for big and small muscles | no | Coach: VOL-05 |
| Different steps for sleep, stress or job | no. These are never asked. | Coach: R2-GEN-04 |
| A smaller step for people over 60 | no. The team dropped this idea. | It was **PROPOSED** and never confirmed. The team dropped it because R3-VOL-04 wants every trained group at its ceiling in the last week. He was never asked about it directly. The spec marks it retired; the compiled `model/rules.json` may still list a 0.03 cap (`stairway.limits.older_60plus`) until the engine is rebuilt. |
| A coach setting the step by hand before the plan is built | 0 to 7 % | **PROPOSED** |

How much a group can grow with full-size steps:

| Plan length | Halfway week | Small steps (3 %) into weeks | Bigger steps (5 %) into weeks | Total growth at full steps |
|---|---|---|---|---|
| 4 weeks | 2 | 2 | 3-4 | × 1.14 |
| 6 weeks | 3 | 2-3 | 4-6 | × 1.23 |
| 8 weeks | 4 | 2-4 | 5-8 | × 1.33 |
| 12 weeks | 6 | 2-6 | 7-12 | × 1.55 |

### 2. Reaching the ceiling in the last week

**Rule.** The *ceiling* is the most weekly sets a group reaches in one plan (14 / 22 / 25 by level, see [volume.md](volume.md)). If full-size steps would hit the ceiling too early, every step of that group shrinks by the same share. The group then lands on its ceiling exactly in the last week.

**Why.** This is the proposal he approved: "each muscle's steps are sized so it reaches its ceiling exactly in the last week" (R3-VOL-04, marked RIGHT).

| Example (12 weeks) | Start → ceiling | Full steps would give | So the steps become |
|---|---|---|---|
| L2 big muscle | 15 → 22 | 15 × 1.55 = 23.3 | about 2.6 % then 4.3 % |
| L3 big muscle | 20 → 25 | 20 × 1.55 = 31.1 | about 1.5 % then 2.5 % |
| L1 big muscle | 10 → 14 | 10 × 1.55 = 15.5 | about 2.3 % then 3.8 % |

**Open question (PROPOSED reading).** Some groups cannot reach their ceiling even with full steps. An L2 lifter's shoulders start at 12 and the ceiling is 22, but 12 weeks of full steps give only 18. Two of his approved phrases pull against each other here: "about 3 % ... about 5 %" and "reaches its ceiling exactly in the last week". The model keeps the step sizes and treats the ceiling as a maximum. The group still peaks in the last week. The other choice would be bigger late steps, up to his 7 % limit. This is waiting for his answer.

### 3. From percentages to whole sets

**Rule.** Nobody does 0.4 of a set. The tool keeps a running target with decimals. It writes whole sets in the plan and adds one set each time the target is a full set ahead. The person never sees a percentage.

**Why.** He approved "bank the fraction and add a whole set once it reaches 1": "Yeah, you round up, you round down. That's fine." (VOL-06)

Worked example: an L2 big muscle on a 12-week plan, 15 → 22 sets.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Running target | 15.0 | 15.4 | 15.8 | 16.2 | 16.6 | 17.1 | 17.8 | 18.6 | 19.4 | 20.2 | 21.1 | 22.0 |
| Sets in the plan | 15 | 15 | 15 | 16 | 16 | 17 | 17 | 18 | 19 | 20 | 21 | 22 |

The last four weeks are 19, 20, 21, 22. That is the example he approved in R3-VOL-04.

Weekly sets by level (computed from the rules above; the same numbers are in `rule_tables.rate_engine.planned_targets_by_level`):

| Plan | Line | Weekly sets, week 1 → last week |
|---|---|---|
| 12 weeks | L1 big muscles, shoulders, arms (10 → 14) | 10 · 10 · 10 · 10 · 10 · 11 · 11 · 12 · 12 · 12 · 13 · 14 |
| 12 weeks | L2 big muscle (15 → 22) | 15 · 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 |
| 12 weeks | L3 big muscle (20 → 25) | 20 · 20 · 20 · 20 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 25 |
| 12 weeks | L2 shoulders or arms (12, ceiling 22) | 12 · 12 · 12 · 13 · 13 · 13 · 14 · 15 · 16 · 16 · 17 · 18 |
| 12 weeks | L3 shoulders or arms (15, ceiling 25) | 15 · 15 · 15 · 16 · 16 · 17 · 18 · 19 · 20 · 21 · 22 · 23 |
| 12 weeks | L2 Focus muscle, +2 (17 → 24) | 17 · 17 · 17 · 18 · 18 · 19 · 19 · 20 · 21 · 22 · 23 · 24 |
| 8 weeks | L1 big muscles, shoulders, arms (10, ceiling 14) | 10 · 10 · 10 · 10 · 11 · 12 · 12 · 13 |
| 8 weeks | L2 big muscle (15, ceiling 22) | 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19 |
| 8 weeks | L3 big muscle (20 → 25) | 20 · 20 · 20 · 21 · 22 · 23 · 24 · 25 |

Things to notice:

- An 8-week plan starts at the same place as a 12-week plan. It has fewer steps, so it ends lower. There is no "start hard".
- In the first weeks the sets barely move. An L1 line adds its first set in week 6 of 12. The early steps show up as more load, more reps and a harder effort target.
- When every L1 line would add a set in the same week, the total would jump 10 %. The tool then lets some lines wait one week. This staggering is **PROPOSED**.
- A day needs at least two exercises of two sets for each group it trains. That can put a group above its table start in week 1. The stairway then climbs from the week-1 sets (**PROPOSED**).

### 4. Where each new set goes

**Rule.** A new set goes to the first exercise of the day for that muscle. The next new set goes to the second exercise, then the third. Then it starts again at the first.

| After each added set | Exercise 1 | Exercise 2 | Exercise 3 |
|---|---|---|---|
| Start | 2 sets | 2 sets | 2 sets |
| +1 | 3 | 2 | 2 |
| +1 | 3 | 3 | 2 |
| +1 | 3 | 3 | 3 |
| +1 | 4 | 3 | 3 |

**Why.**

> "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning of the exercise because I put all my energy into it." (VOL-07)

More placement rules:

| Situation | Where the set goes | Status |
|---|---|---|
| The same day type runs twice a week (Day A on Monday and Thursday) | Monday's first exercise this time, Thursday's first exercise the next time, so both days stay even | Coach: R3-VOL-03 |
| Extra sets for a small muscle when every day is full | a short bonus exercise on the optional day | Coach: R3-VOL-03, VOL-07 |
| Same, but there is no optional day | on a day that already trains that muscle. Never as that day's only exercise for it. | Coach: R3-VOL-03 |
| Extra calf sets | the calf exercise already there. Never a second calf exercise on a leg day. | Coach: R3-SES-01 |
| Extra sets for a big muscle when every day is full | a Focus slot on the optional day | Slots: ORD-11. Using them for this is **PROPOSED**. |
| Most sets on one exercise | 4 at L1, 5 at L2-L3, 4 on isolation, never fewer than 2 | **PROPOSED** |
| The share of two-leg and one-leg work drifts off target | the set goes to the side that is short | **PROPOSED**. See [bilateral-unilateral.md](bilateral-unilateral.md). |
| Nothing fits | the plan suggests supersets. If it still does not fit, the group's ceiling becomes what the week can hold. | Supersets: R3-SES-02. The rest is **PROPOSED**. See [sessions.md](sessions.md). |

Why small muscles get a bonus exercise: on a back day, by the time people reach biceps "they're going to be kind of gassed out", so more biceps work is done "as a bonus exercise" (VOL-07).

### 5. How it feels: start at a 2, end at an 11

**Rule.** The stairway is also about effort. Week 1 should feel like a 2. The last week should feel like an 11, a little past the person's usual limit. This is a feeling of total work, not a set count.

**Why.**

> "When I say started at 2 and ended at 11, I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets." (R2-PER-05)

> "By the time you're done with your block, ideally, you've pushed yourself a little bit past your limits, which is what an 11 really would mean." (R2-PER-05)

The plan tells people how hard to push with *reps in reserve* (RIR): how many more clean reps they could have done. He chose this scale: "I like RIR in my model, so that's what I'm going to be using." (VOL-13). The RPE number (rate of perceived exertion, 1 to 10) is shown beside it.

| Reps in reserve | RPE | Plain words |
|---|---|---|
| 3 | 7 | hard; 3 more clean reps were possible |
| 2 | 8 | very hard; 2 more clean reps |
| 1 | 9 | "leave 1 in the tank" |
| 0 ('MAX') | 10 | technical failure; only on the last set of small-muscle or bodyweight work |

Every working set stays inside 1 to 3 RIR (VOL-13). Inside that range the target drifts down as the plan goes on. He approved the order: "3 reps in the tank early, to 2, to 1-2, to 1 + intensifiers in the last week" (R3-VOL-04, marked RIGHT).

| Week (12-week plan) | 1-6 | 7-9 | 10-11 | 12 |
|---|---|---|---|---|
| Effort target | 3 RIR | 2 RIR | 1-2 RIR | 1 RIR + intensifiers |
| Stair level shown (2 → 11) | 2 to 5 | 6 to 8 | 9 to 10 | 11 |

| Week (8-week plan) | 1-4 | 5-6 | 7 | 8 |
|---|---|---|---|---|
| Effort target | 3 RIR | 2 RIR | 1-2 RIR | 1 RIR + intensifiers |
| Stair level shown (2 → 11) | 2 to 4.8 | 6.3 to 7.9 | 9.4 | 11 |

Status of the details:

- The order of the drift is his (R3-VOL-04). The exact week each stage starts, and the stair-level number shown next to each week, are **PROPOSED**.
- *Intensifiers* are ways to make a set harder without adding sets. Here they are MYO sets (one long set followed by short mini-sets) and supersets (two exercises back to back). A MYO set is allowed only on the last exercise, and only on a machine or isolation exercise (VOL-15).
- Heavy compound lifts never go to failure (GEN-08).
- A lifter who is already at the ceiling still needs an 11. For them it comes from heavier loads, intensifiers and "a rotating priority muscle that can go up to 30 sets" (the proposal he approved in R2-PER-05). After round 3 that muscle is a Focus muscle (see [volume.md](volume.md)).

The effort words on his sheet ('8 - That was perfect', "10 - I'm done") stay as a column in the downloaded sheet for people who like to log (keeping the column is **PROPOSED**). A 10 means a successful all-out set, not a failed one: "10 should be like, 'That was the max I can do, not a fail.'" (R2-VOL-02). The tool never reads these back.

### 6. What does not move inside a block

| Thing | Rule | Decided by |
|---|---|---|
| The exercises | stay the same for 4 to 6 weeks. He does not try to "confuse" the muscle. | PER-02, chat statement |
| The stairway at an exercise change (week 5 or 9 of 12) | keeps climbing; it does not restart | **PROPOSED** reading of R2-PER-04 and R2-VOL-07 |
| One-leg and one-arm work | climbs the same way as two-leg work: "It progresses about the same." | UNI-05 |
| Easy weeks | none inside a block | R2-VOL-07. See [plans-and-calendar.md](plans-and-calendar.md). |

### 7. Why there are no check-ins

**Rule.** Answers go in, the whole plan comes out, once. Nothing the person does later changes the plan by itself. There is no weekly check-in, no logbook the tool reads, no score, no stored data.

**How the decision was reached.** Earlier rounds did include feedback. Round 3 removed it.

| Round | What was on the table | What he said |
|---|---|---|
| 1 (GEN-05) | adjust next week from logged effort and how it felt | approved |
| 1 (GEN-03) | tracking columns in the plan | "I don't think that they should be tracking it from us. They should be tracking it themselves" |
| 2 (R2-VOL-01, R2-GEN-01) | an optional one-minute weekly check-in that picks a 3, 5 or 7 % step | approved |
| 2 (R2-VOL-03) | a default step for people who never check in | "No, if they don't check in, the plan doesn't change. There is no data to go off of." |
| 2 (R2-GEN-04) | three taps on sleep, stress and job | "I just need the workouts here. There's no need to talk about sleep or stress or anything else." |
| 3 (R3-VOL-02) | a shorter check-in without life questions | "Yeah, we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." |
| 3 (R3-VOL-04) | the stairway in numbers | approved, and: "I don't want people to be checking back on their phone in their program." |
| 3 (R3-GEN-01) | where to keep the release record | "I don't want any data kept." |

**Why.** He wants the simplest possible product:

> "I want this to be very simple. This works. We're not going to need a lot of inputs for this." (R3-VOL-04)

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

> "This needs to be very simple for them to see the whole thing ahead of time, ideally, and they can adjust ahead of time, ideally." (R3-VOL-04)

**What replaces the check-in.**

1. *The effort target does the fine tuning.* Every set says how many reps to leave in the tank. On a bad day the person uses less weight and still follows the plan.
2. *A printed "How to adjust this plan" guide.* He said "the program will tell you to adjust accordingly" (R3-VOL-04). The wording below is **PROPOSED**:

| If this happens | Do this |
|---|---|
| You missed most of a week | Repeat that week before moving on. |
| A set felt like a true max, with no rep left | Next time take one set off that exercise, or a little weight. |
| Everything feels easy | Add weight or reps first. Never jump ahead more than one week. |
| Something hurts | Use the listed swap, then cut the sets, then drop the exercise. |
| Life got in the way for several weeks | Stop the block, take the recommended easy week, build a new block. |

3. *Editing the plan.* People can switch off a day's athletic or core block, add or remove exercises, and take the suggested supersets (R3-SES-02). See [sessions.md](sessions.md).
4. *Their own log, if they want one.* He said people "should be tracking it themselves, however they want to track it, notebook or whatever" (GEN-03). The downloaded sheet keeps his columns ('WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?'). They are for the person. The tool never reads them. Keeping the columns in the sheet is **PROPOSED**.

### 8. After the block: the next stairway

**Rule.** When someone finishes a block and builds the next one, the new block starts 5 % higher and its ceiling is one set higher. The ceiling never goes above 25, or 30 for a priority muscle (now a Focus muscle).

**Why.** This is the proposal he approved in R2-VOL-06. The idea of a second program one level up comes from round 1: a second 12-week program "might want to start at a 2 and end at an 11, meaning your volume slowly creates more" (PER-01). In round 2 he made clear that the 2 and the 11 describe how the block feels, not a set count (R2-PER-05, section 5). The set step between blocks is the 5 % and the one set he approved.

| Level (big muscle) | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|
| L1 | 10 → 14 | 11 → 15 | 12 → 16 | 13 → 17 |
| L2 | 15 → 22 | 16 → 23 | 17 → 24 | 18 → 25 |
| L3 | 20 → 25 | 21 → 25 | 22 → 25 | 23 → 25 |

The L2 row is in the data (`plan_types.cycles.example_L2_big`). The L1 and L3 rows were computed by the team with the same rule, rounding halves up.

Nothing is stored, so the tool cannot know what a person did before. When they build the next block it asks how many blocks they finished in a row, and whether they finished the last one. After a block that was stopped early, the next one starts at the same level. Both the question and the "same start" rule are **PROPOSED**.

### 9. Plans that do not climb in sets

| Plan or phase | What the sets do | Decided by |
|---|---|---|
| Maintenance phase | flat, at 50 to 70 % of the volume | Volume: PER-01, R2-PER-06. Holding it flat is the team's reading of "maintenance" (**PROPOSED**). |
| Athlete pre-season and in-season | at maintenance volume (pre-season about 60 % of off-season sets); the model keeps them flat | Volume: R2-PER-06, PER-08. Keeping them flat is **PROPOSED**. |
| The cut quarter of the yearly plan (January to March) | sets stay at the starting level; the weeks still get harder through cardio, load and effort | Sets: R2-PER-01. Reading it as weeks that still get harder is **PROPOSED**. |
| Fight or competition prep | 2-week steps and waves, not a smooth weekly step | PER-10 |
| A plan with too little time | the stairway still climbs on the groups that are trained, "never flat" | R3-SES-02 |

Details: [plans-and-calendar.md](plans-and-calendar.md).

### 10. What research says about this shape

This is **SCIENCE** collected by the team. It does not overrule his answers. Full references: `synthesis/12_volume_algorithm_v1.json > science`.

- Big jumps in weekly sets add strain without reliably adding growth (Barsuhn 2024; Enes 2023/24). Small steps are the cautious choice.
- Letting the load follow reps in reserve works about as well as fixed percentages (Hickmott 2022). People misjudge their reps in reserve by about one rep (Halperin 2022). This is why the target is a small range.
- The "10 % rule" from other sports is weakly supported. The model uses 10 % as a limit, not a goal.

---

## Retired: do not rebuild

| Retired idea | Retired by |
|---|---|
| A 3 / 5 / 7 % step chosen by muscle size | VOL-05 |
| A step chosen from sleep, stress, job or a readiness score | R2-GEN-04 |
| The 8-week plan as 4 easy weeks + 4 hard weeks with a 10 % harder start | R2-PER-03 |
| A cap of 3 % during the first weeks of a 12-week plan | R2-PER-03, R2-PER-04 |
| A deload triggered in the middle of a block | R2-VOL-07 |
| The weekly check-in and its step table (too easy: more; 9: hold; a 10: hold and one set less; under half the sessions: repeat the week) | R3-VOL-02 |
| Week-by-week plans that depend on check-ins | R3-VOL-02, R3-VOL-04 |
| An automatic offer to stop a block that looks at risk | R3-VOL-02, R3-PER-01 |
| A 3 % step cap for people over 60 (it was PROPOSED, never his rule) | dropped by the team after R3-VOL-04 |
| Tuning the steps from users' logs | R3-GEN-01 |

More on what he turned down: [../01-philosophy/what-he-rejected.md](../01-philosophy/what-he-rejected.md). Every change between rounds: [../03-coach-answers/changes-across-rounds.md](../03-coach-answers/changes-across-rounds.md).

## Still PROPOSED

Waiting for his yes or no:

- Ceiling against step size: keep the steps and stop below the ceiling, or allow bigger late steps (section 2).
- The stair-level number printed next to each week, and the exact weeks of the effort drift.
- The check that total weekly sets rise by less than 10 %, the one-set allowance and the staggering of added sets.
- The most sets per exercise (4 or 5).
- Climbing from the week-1 sets when they are above the table start.
- The wording of the "How to adjust this plan" guide, in English and Spanish.
- Asking "how many blocks did you finish in a row?" and keeping the same start after a stopped block.
- A coach setting the step by hand (0 to 7 %).
- Dropping the 3 % step cap for people over 60, so they climb like everyone else.
- Keeping his log columns in the downloaded sheet for people who want their own log.
- Maintenance, pre-season and in-season phases held flat.

## Related pages

- [volume.md](volume.md): starts, ceilings, credit and Focus muscles.
- [sessions.md](sessions.md): session order, caps, supersets and what gives when time is short.
- [plans-and-calendar.md](plans-and-calendar.md): plan lengths, no deload inside a block, the year.
- [testing.md](testing.md): tests at the start and the end of a block.
- [../01-philosophy/principles.md](../01-philosophy/principles.md): the principles behind these rules.
- [../05-reference/parameters.md](../05-reference/parameters.md): every tunable number.
- Decision records: [every plan is a stairway](../04-decisions/adr-022-every-plan-is-a-stairway.md), [weekly percentages by size or by person (retired)](../04-decisions/adr-023-weekly-percentages-by-size-or-by-person-retired.md), [where a new set goes](../04-decisions/adr-025-where-a-new-set-goes.md), [effort in reps in reserve](../04-decisions/adr-026-effort-in-reps-in-reserve.md), [answers in, plan out, no check-ins](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md), [no data kept](../04-decisions/adr-002-no-data-kept.md), [no lifestyle inputs](../04-decisions/adr-003-no-lifestyle-inputs.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
