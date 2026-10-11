# The stairway: how plans climb week to week

Every Blaze Camp plan gets a little harder each week, "like steps up a stairway". Weekly sets usually grow by about 3 % a week until the halfway week and by about 5 % a week after it. Each trained muscle group reaches its planned final sets in the last week, so the hardest weeks come last. When that needs bigger steps, the steps are bigger, and a week that adds more than about 15 % carries a note. A week may keep the same sets while reps or load go up. Reps and load are written as a rule the person applies, never as a promised number. Effort climbs too: week 1 feels like a 2 and the last week feels like an 11. The whole stairway is worked out once, when the plan is built, and the person sees every week ahead of time. There are no check-ins and no tracking. The person or their coach adjusts the plan by hand, including the sets of any day or week.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`VOL-07`) are round 1, `R2-` is round 2, `R3-` is round 3, `R4-` is round 4. `CX-01..04` is a clarification he gave on 2026-10-10. The newest answer wins: round 4 first, then CX. **PROPOSED** means the team designed it and he has not confirmed it. His full answers by topic: [../03-coach-answers/progression.md](../03-coach-answers/progression.md).

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | **Every plan is a stairway**, whatever its length. | R2-PER-03 |
| 2 | A step is a **percentage of each muscle group's weekly sets**. It is the same rule for big and small muscles. | VOL-04, VOL-05 |
| 3 | Steps are usually **about 3 % a week until the halfway week** and **about 5 % a week after it**. This is the usual pattern, not a limit. | R3-VOL-04, CX-01 |
| 4 | Each group **reaches its planned final sets**. Steps are bigger than 3 % and 5 % when the target needs it. | R3-VOL-04, CX-01 |
| 4b | The final number arrives **in the last week** when the math allows. One week early is fine. Never earlier. | R4-PRG-01 |
| 5 | **The hardest weeks come last.** On a 12-week plan the last four weeks are "brutal". | R2-PER-04 |
| 6 | **No hard limit on a step.** A week that adds more than about 15 % carries a clear note: this week jumps more than usual, adjust if needed. | R4-PRG-02, CX-01 |
| 6b | **A week may keep the same sets** while reps or load progress, also at the top number. | CX-02, CX-03 |
| 6c | **Reps and load are a rule the person applies**, never a promised number per week. | R4-PRG-03 |
| 7 | The tool turns percentages into whole sets. It saves the fraction and adds one set when the saved amount reaches one. | VOL-06 |
| 8 | A new set goes to the **first exercise of the day** for that muscle, then to the second, then the third. | VOL-07 |
| 9 | When the same day type happens twice a week, new sets **alternate**: Monday's first exercise, then Thursday's. | R3-VOL-03 |
| 10 | **Effort drifts** from 3 reps in the tank, to 2, to 1-2, to 1 plus intensifiers in the last week. It always stays inside 1 to 3 reps in reserve. | R2-PER-05, R3-VOL-04 |
| 11 | The plan is **built once and shown whole**. No check-ins, no tracking, no data kept. People adjust it themselves, including the sets of any day or week. | R3-VOL-02, R3-VOL-04, R3-GEN-01, CX-02, CX-04 |
| 12 | After a finished block, the next block starts **about 5 % above where the last block started**, in whole sets, never above the level's top number. At the top, sets stay and load and reps progress. | R4-PRG-04, CX-03 |

The starting sets and the ceilings are on [volume.md](volume.md). That page also defines the client levels used below: L1 (beginner), L2 (intermediate) and L3 (advanced).

## Why

**Why a stairway.** The team first proposed an 8-week plan with four easy weeks, four hard weeks and a harder start. He said no:

> "No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." (R2-PER-03)

> "In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much." (R2-PER-03)

**Why the hardest weeks are last.**

> "on a 12-week program, the last 4 weeks are going to be brutal. Again, like a stairway: steps up, steps up, and week by week, it just gets gradually worse. I mean worse, meaning better, more volume." (R2-PER-04)

**Why the steps are usually small.**

> "it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program." (UNI-05)

**Why the final sets still win.** The team asked what to do when small steps cannot reach the planned final number. Finish lower? He said:

> "no, go ahead and increase faster if thats the need, they could edit accordingly" (CX-01)

**Why a week may hold its sets.** Asked whether a week can keep the same sets while reps or load progress: "yes but also should be editable if they want to adjust their sets on that week or that day doesnt matter" (CX-02).

**Why it is not by muscle size.** The team guessed big muscles would get 3 % and small ones 7 %. He corrected it:

> "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing." (VOL-05)

**Why the tool does the math.**

> "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." (VOL-06)

**Why nothing comes back from the user.**

> "The program will just have its natural algorithm recommendation of growth throughout it, so anybody can just plug in the numbers of what they want as far as weeks and sport or goals." (R3-VOL-04)

> "I want them to be able to kick out a program, and that's it. That's the program." (R3-VOL-04)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). `model/rules.json` is the compiled copy the engine reads. The rules of 2026-10-10 and round 4 are cited from `model/rules.json`; the matching spec keys are in [`coverage_matrix_round4.md`](../../coverage_matrix_round4.md).

| What | File | JSON key |
|---|---|---|
| The principle and the formula | `generator_spec_v1.json` | `rule_tables.rate_engine.principle`, `rule_tables.rate_engine.math` |
| The usual step sizes (0.03, 0.05) | `generator_spec_v1.json`; `model/rules.json` | `rule_tables.rate_engine.standard_steps`; `stairway.standard_steps` |
| Final sets reached, arrival week, the 15 % note, flat weeks allowed (CX-01, CX-02, R4-PRG-01, R4-PRG-02) | `model/rules.json` | `stairway.progression` (`target_reached`, `arrival_weeks_early_max`, `note_above`, `note_min_whole_sets`, `flat_weeks_ok`) |
| The written progression rule and the big-step mark (R4-PRG-03, R4-PRG-02) | `model/rules.json` | `render.progression` (`promised_numbers: false`), `render.acceleration` |
| ~~Limits (7 % step, under 10 % total)~~ retired by CX-01 and R4-PRG-02 | `model/rules.json` | `stairway.limits` holds only the slow step for a painful area (`pain_after_freeze`) |
| Steps, stair level and planned effort for 4, 6, 8, 10, 12 and 16 weeks | `generator_spec_v1.json` | `rule_tables.rate_engine.steps_by_plan_length` |
| Weekly sets by level, already computed | `generator_spec_v1.json` | `rule_tables.rate_engine.planned_targets_by_level` |
| The felt level: "start at a 2 and end at an 11" | `generator_spec_v1.json` | `rule_tables.rate_engine.start_at_2_end_at_11` |
| Nothing changes the steps after the build | `generator_spec_v1.json` | `rule_tables.rate_engine.no_feedback`; `derived_values.D12_planned_step` |
| The old open question on ceiling and step size (answered by CX-01) | `generator_spec_v1.json` | `rule_tables.rate_engine.ceiling_reach_v1_2` |
| Turning fractions into whole sets | `generator_spec_v1.json` | `rule_tables.banking` |
| Where each new set goes | `generator_spec_v1.json` | `rule_tables.set_placement.steps` |
| Effort scale and planned drift | `generator_spec_v1.json` | `rule_tables.effort` (`rir_rpe`, `planned_drift`) |
| The printed "How to adjust this plan" guide | `generator_spec_v1.json` | `rule_tables.rate_engine.self_adjust_guide` |
| The next block (R4-PRG-04) | `generator_spec_v1.json`; `model/rules.json` | `plan_types.cycles`; `cycles.next_block` |
| The retired check-in (kept only as an empty stub) | `generator_spec_v1.json` | `adaptation` |
| Same content with research and worked examples | `synthesis/12_volume_algorithm_v1.json` | `stairway`, `banking`, `set_placement`, `examples` |
| Stairway by plan length | `synthesis/06_periodization.json` | `plan_length_model.stairway` |
| Compiled copy | `model/rules.json` | `stairway`, `placement`, `effort`, `cycles`, `render.progression` |
| The arithmetic | `engine/progression/stairway.mjs`, `engine/progression/prescription.mjs` | `planStairway`, `staggerStairways`, `nextBlockStart`, `progressionRule` |

---

## In detail

### 1. The step sizes

**Rule.** A *step* is how much a muscle group's weekly sets grow from one week to the next. Steps are small in the first half of the plan and a little bigger in the second half. The percentages below are the usual pattern. They are not limits (CX-01).

| Parameter | Value | Status |
|---|---|---|
| Usual step into each week, up to the halfway week | about 3 % of that group's weekly sets | Coach: R3-VOL-04 |
| Usual step into each week after the halfway week | about 5 % | Coach: R3-VOL-04 |
| Halfway week | the number of weeks divided by 2 (week 6 of 12, week 4 of 8) | Coach: R3-VOL-04. Rounding up for odd lengths is **PROPOSED**. |
| When the usual steps cannot reach the final sets | every step of that group is scaled up by the same share, so the group still arrives | Coach: CX-01. The scaling formula is the team's math. |
| Largest step allowed | no hard limit | Coach: CX-01, R4-PRG-02 |
| A week that adds more than about 15 % | carries a clear note: "This week jumps more than usual: adjust if needed." | Coach: R4-PRG-02 |
| One single added set | never flagged, even when it is more than 15 % of a small number. It is the smallest step a group can take. | **PROPOSED** |
| Different steps for big and small muscles | no | Coach: VOL-05 |
| Different steps for sleep, stress or job | no. These are never asked. | Coach: R2-GEN-04 |
| A smaller step for people over 60 | no. They climb like everyone else. | The 3 % cap was **PROPOSED**, never his rule, and is deleted from the data. |
| A painful area | keeps slow steps | VOL-03; the number (3 %) is **PROPOSED** |

**Retired as limits:** "never more than 7 % in a week" (R2-VOL-01, from the retired check-in table) and "total weekly sets rise by less than 10 %" (the team's check built on UNI-05). His remark that 10 % a week is "way too much" to sustain still explains why the usual steps are small.

How much a group grows with the usual steps:

| Plan length | Halfway week | Small steps (3 %) into weeks | Bigger steps (5 %) into weeks | Total growth at the usual steps |
|---|---|---|---|---|
| 4 weeks | 2 | 2 | 3-4 | × 1.14 |
| 6 weeks | 3 | 2-3 | 4-6 | × 1.23 |
| 8 weeks | 4 | 2-4 | 5-8 | × 1.33 |
| 12 weeks | 6 | 2-6 | 7-12 | × 1.55 |

### 2. Reaching the final sets in the last week

**Rule.** Each trained group has a planned final number of weekly sets: its *ceiling* or *top number* (14 / 22 / 25 by level, see [volume.md](volume.md)). The group reaches it. All its steps are scaled by one factor so it lands there in the last week.

- If the usual steps would overshoot, every step shrinks by the same share.
- If the usual steps would fall short, every step grows by the same share (CX-01).

**Why.** He approved "each muscle's steps are sized so it reaches its ceiling exactly in the last week" (R3-VOL-04, marked RIGHT). When that pulled against "about 3 % ... about 5 %", he chose the endpoint: "go ahead and increase faster if thats the need" (CX-01).

| Example (12 weeks) | Start → final | The usual steps would give | So the steps are |
|---|---|---|---|
| L2 big muscle | 15 → 22 | 15 × 1.55 = 23.3 | smaller: about 2.6 % then 4.3 % |
| L3 big muscle | 20 → 25 | 20 × 1.55 = 31.1 | smaller: about 1.5 % then 2.5 % |
| L1 big muscle | 10 → 14 | 10 × 1.55 = 15.5 | smaller: about 2.3 % then 3.8 % |
| L2 shoulders or arms | 12 → 22 | 12 × 1.55 = 18.6 | bigger: about 4.2 % then 6.9 % |
| L3 shoulders or arms | 15 → 25 | 15 × 1.55 = 23.3 | bigger: about 3.5 % then 5.8 % |

**When the top arrives** (R4-PRG-01, approved as proposed):

| Question | Rule |
|---|---|
| Which week? | The last week, when the math allows. |
| One week early? | Fine. The group then holds its sets and progresses with reps or load. |
| Two or more weeks early? | Never. |
| A block that ends with a strength-test week | The top arrives the week before the test and holds (**PROPOSED**). |

**Big steps** (R4-PRG-02, approved as proposed). Short blocks with a far target need big steps. There is no hard limit. Any week that adds more than about 15 % is marked in the plan and explained in one line. An example of the arithmetic (the question he was asked used a 4-week block with a big target): 12 → 22 in 4 weeks would run 12, 14, 17, 22, and weeks 2, 3 and 4 would all carry the note. The person can lower those sets: everything is editable (CX-01, CX-04).

**What can still stop a group below its planned number.** Not the step size. Only the template: when a day's slots cannot hold the sets and there is no optional day for a bonus exercise, the group is capped at what the slots hold and the plan says so ([sessions.md](sessions.md) §6). The plan never hides this.

### 3. From percentages to whole sets

**Rule.** Nobody does 0.4 of a set. The tool works with a smooth curve and writes whole sets in the plan. The person never sees a percentage.

**Why.** He approved "bank the fraction and add a whole set once it reaches 1": "Yeah, you round up, you round down. That's fine." (VOL-06)

Worked example: an L2 big muscle on a 12-week plan, 15 → 22 sets.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Sets in the plan | 15 | 15 | 16 | 16 | 17 | 17 | 18 | 19 | 19 | 20 | 21 | 22 |

The last four weeks are 19, 20, 21, 22. That is the example he approved in R3-VOL-04.

Weekly sets for one group on its own, computed with the engine's arithmetic (`engine/progression/stairway.mjs`, 2026-10-11). In a real plan the groups take turns adding a set, so a group's week can differ from this table by one set.

| Plan | Line | Weekly sets, week 1 → last week |
|---|---|---|
| 12 weeks | L1 big muscles, shoulders, arms (10 → 14) | 10 · 10 · 10 · 11 · 11 · 11 · 12 · 12 · 13 · 13 · 13 · 14 |
| 12 weeks | L2 big muscle (15 → 22) | 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 19 · 20 · 21 · 22 |
| 12 weeks | L3 big muscle (20 → 25) | 20 · 20 · 21 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 24 · 25 |
| 12 weeks | L2 shoulders or arms (12 → 22), steps above the usual | 12 · 12 · 13 · 14 · 14 · 15 · 16 · 17 · 18 · 19 · 21 · 22 |
| 12 weeks | L3 shoulders or arms (15 → 25), steps above the usual | 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 · 24 · 25 |
| 12 weeks | L2 Focus muscle, +2 (17 → 24) | 17 · 17 · 18 · 18 · 19 · 19 · 20 · 21 · 21 · 22 · 23 · 24 |
| 8 weeks | L1 big muscles, shoulders, arms (10 → 14), steps above the usual | 10 · 10 · 11 · 11 · 12 · 12 · 13 · 14 |
| 8 weeks | L2 big muscle (15 → 22), steps above the usual | 15 · 16 · 16 · 17 · 18 · 19 · 21 · 22 |
| 8 weeks | L3 big muscle (20 → 25) | 20 · 20 · 21 · 21 · 22 · 23 · 24 · 25 |
| 12 weeks | A big muscle on 2 training days (6 → 8) | 6 · 6 · 6 · 6 · 6 · 7 · 7 · 7 · 7 · 7 · 7 · 8 |

Things to notice:

- An 8-week plan starts at the same place as a 12-week plan and reaches the same final sets. Its steps are bigger. There is still no "start hard": week 1 is the start number.
- Several weeks in a row can show the same sets. That is allowed (CX-02). In those weeks the progress comes from reps and load (section 5a) and from the effort target (section 5).
- None of these lines needs a big-step note: a single added set is never flagged, and the two-set steps here stay under 15 %.
- The groups of one plan do not all add a set in the same week. They take turns, so the week's total climbs by a set or two most weeks (**PROPOSED**; the kernel calls it staggering).
- A day needs at least 2 sets on every exercise. That can put a group above its table start in week 1. The stairway then climbs from the week-1 sets (**PROPOSED**).

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
| Most sets on one exercise | 4 at L1, 5 at L2-L3, never fewer than 2. Isolation exercises on a training day hold 3 sets (4 in the hardest weeks); the rest goes to the bonus exercise. A compound lift reaches 3 sets before an isolation exercise of its group takes more. | **PROPOSED** |
| The share of two-leg and one-leg work drifts off target | the set goes to the side that is short | **PROPOSED**. See [bilateral-unilateral.md](bilateral-unilateral.md). |
| The template's slots are full | his bonus exercise on the optional day (2 to 4 sets). With no optional day the group is capped at what the slots hold, and the plan says so. Nothing is cut for time. | Bonus exercise: VOL-07, R3-VOL-03. Capping and saying so: R4-SES-04. The numbers are **PROPOSED**. See [sessions.md](sessions.md). |

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

### 5a. Reps and load: a rule the person applies

**Rule.** The plan never promises a number of reps or a weight for a given week. Each lift prints its sets, a rep range and one rule (R4-PRG-03, approved as proposed):

> "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8."

Not: "week 3: 12 reps".

**Why.** There are no check-ins, so the tool never sees what a person lifted. A promised number would be a guess. A rule works for everyone and needs no data.

| Detail | Rule | Status |
|---|---|---|
| What prints under a lift | "Progress: when you hit 12 on every set with 1-2 left in the tank, add weight next time and start again at 8." with that lift's own rep range and effort target | Coach: R4-PRG-03. The exact wording is **PROPOSED**. |
| Not there yet | keep the weight and add a rep where you can | **PROPOSED** wording |
| Single-side lifts | the same rule, "per side" | **PROPOSED** |
| Lifts with fixed reps, and pyramids such as 12 / 10 / 8 | a matching rule: add weight when every set is done at the written reps with the planned reps in reserve | **PROPOSED** wording |
| Timed circuits (bootcamp) | progress by seconds per station and by rounds | PRG-03; the steps are **PROPOSED** |
| Same sets two weeks in a row | allowed when reps or load progress | Coach: CX-02 |
| At the top number of sets | sets stay; reps and load carry the progress | Coach: CX-03 |
| An unchanged week | is never labelled as progress | team safeguard from the CX record |

*Reps left in the tank* means reps in reserve (section 5). In the data this style of progress is called double progression: first reps go up inside the range, then weight goes up and reps start again at the bottom.

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
| Everything feels easy | Follow the progression rule: add reps, then weight. Never jump ahead more than one week. |
| A week is marked "jumps more than usual" | Take it as written, or lower those sets. Your choice. |
| Something hurts | Use the listed swap, then cut the sets, then drop the exercise. |
| Life got in the way for several weeks | Stop the block, take the recommended easy week, build a new block. |

3. *Editing the plan.* People can switch off a day's athletic or core block, add or remove exercises, take the suggested supersets, and change the sets of any day or week (R3-SES-02, CX-02, CX-04). See [sessions.md](sessions.md).
4. *Their own log, if they want one.* He said people "should be tracking it themselves, however they want to track it, notebook or whatever" (GEN-03). The downloaded sheet keeps his columns ('WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?'). They are for the person. The tool never reads them. Keeping the columns in the sheet is **PROPOSED**.

### 8. After the block: the next stairway

**Rule.** When someone finishes a block and builds the next one, the new block starts a little above where the last block started: about 5 % more, rounded to whole sets, never above the level's top number. If they are already at the top, sets stay and progress comes from load and reps (R4-PRG-04, approved as proposed).

**Why.** "Yeah, and it has to be logical." (R4-PRG-04). The idea of a second program one level up comes from round 1: a second 12-week program "might want to start at a 2 and end at an 11, meaning your volume slowly creates more" (PER-01). In round 2 he made clear that the 2 and the 11 describe how the block feels, not a set count (R2-PER-05, section 5).

| Level (big muscle) | Block 1 | Block 2 | Block 3 |
|---|---|---|---|
| L1 | 10 → 14 | 11 → 14 | 12 → 14 |
| L2 | 15 → 22 | 16 → 22 | 17 → 22 |
| L3 | 20 → 25 | 21 → 25 | 22 → 25 |

Computed with the engine's rule (`cycles.next_block`: 105 / 100, whole sets).

| Detail | Rule | Status |
|---|---|---|
| The step between blocks | about 5 % of the last block's start | Coach: R4-PRG-04, R2-VOL-06 |
| A small number | 5 % of 10 is half a set. While a group is below its top, the next block starts at least one whole set higher. | **PROPOSED** |
| The top number | never passed. In round 2 he also approved a ceiling one set higher per finished block, never above 25, or 30 for a Focus muscle (R2-VOL-06). Round 4 said "never above the level's top number". The data keeps the level's top fixed. | The fixed top is the team's reading (INFERRED) |
| Already at the top | sets stay; load and reps progress | Coach: R4-PRG-04, CX-03 |
| A block that was stopped early | the next one starts at the same level | **PROPOSED** |

Nothing is stored, so the tool cannot know what a person did before. When they build the next block it asks how many blocks they finished in a row, and whether they finished the last one. The question is **PROPOSED**.

### 9. Plans that do not climb in sets

| Plan or phase | What the sets do | Decided by |
|---|---|---|
| Maintenance phase | flat, at 50 to 70 % of the volume | Volume: PER-01, R2-PER-06. Holding it flat is the team's reading of "maintenance" (**PROPOSED**). |
| Athlete pre-season and in-season | at maintenance volume (pre-season about 60 % of off-season sets); the model keeps them flat | Volume: R2-PER-06, PER-08. Keeping them flat is **PROPOSED**. |
| The cut quarter of the yearly plan (January to March) | sets stay at the starting level; the weeks still get harder through cardio, load and effort | Sets: R2-PER-01. Reading it as weeks that still get harder is **PROPOSED**. |
| Fight or competition prep | 2-week steps and waves, not a smooth weekly step | PER-10 |
| 2 training days a week | the stairway still climbs: a big group goes from about 6 to about 8 weekly sets | R4-SES-03 |
| A group capped by its template | holds what the slots can take; the plan says so; reps and load still progress | R4-SES-04, CX-02 |

Details: [plans-and-calendar.md](plans-and-calendar.md).

### 10. What research says about this shape

This is **SCIENCE** collected by the team. It does not overrule his answers. Full references: `synthesis/12_volume_algorithm_v1.json > science`.

- Big jumps in weekly sets add strain without reliably adding growth (Barsuhn 2024; Enes 2023/24). Small steps are the cautious choice.
- Letting the load follow reps in reserve works about as well as fixed percentages (Hickmott 2022). People misjudge their reps in reserve by about one rep (Halperin 2022). This is why the target is a small range.
- The "10 % rule" from other sports is weakly supported. The model no longer uses it as a limit (CX-01). The note above about 15 % is the safeguard he approved (R4-PRG-02).
- Faster set increases in short blocks are a coaching choice he made. They are not evidence that a faster increase is best for every person. Anyone who disagrees on research grounds should raise it "for discussion with the coach".

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
| A hard limit on the weekly step (7 % for a group, under 10 % in total) | CX-01, R4-PRG-02 |
| Ending below the planned final sets to keep the steps small; treating the ceiling as a maximum that some groups never reach | CX-01 |
| "Sets must rise every week" | CX-02, CX-03 |
| A promised number of reps or a load for a given week | R4-PRG-03 |
| A coach-set step capped at 7 % | CX-01 (a coach edits sets directly: CX-04) |
| Suggesting supersets, then lowering a group's ceiling, when a day ran out of minutes | CT-01 |

More on what he turned down: [../01-philosophy/what-he-rejected.md](../01-philosophy/what-he-rejected.md). Every change between rounds: [../03-coach-answers/changes-across-rounds.md](../03-coach-answers/changes-across-rounds.md).

## Still PROPOSED

Waiting for his yes or no:

- Never flagging a single added set as a big step; the mark printed next to a flagged week.
- The stair-level number printed next to each week, and the exact weeks of the effort drift.
- The groups of a plan taking turns to add a set (staggering).
- The most sets per exercise (4 or 5), 3 to 4 on isolation exercises, and the 2-to-4-set bonus exercise.
- Arriving the week before a strength-test week.
- The wording of the progression rule for fixed-rep lifts, pyramids and single-side lifts.
- At least one whole set more in the next block; keeping the level's top fixed from block to block.
- Climbing from the week-1 sets when they are above the table start.
- The wording of the "How to adjust this plan" guide, in English and Spanish.
- Asking "how many blocks did you finish in a row?" and keeping the same start after a stopped block.
- Keeping his log columns in the downloaded sheet for people who want their own log.
- Maintenance, pre-season and in-season phases held flat.

## Related pages

- [volume.md](volume.md): starts, ceilings, credit and Focus muscles.
- [sessions.md](sessions.md): session order, his templates, session size, supersets and editing.
- [plans-and-calendar.md](plans-and-calendar.md): plan lengths, no deload inside a block, the year.
- [testing.md](testing.md): tests at the start and the end of a block.
- [../01-philosophy/principles.md](../01-philosophy/principles.md): the principles behind these rules.
- [../05-reference/parameters.md](../05-reference/parameters.md): every tunable number.
- Decision records: [every plan is a stairway](../04-decisions/adr-022-every-plan-is-a-stairway.md), [weekly percentages by size or by person (retired)](../04-decisions/adr-023-weekly-percentages-by-size-or-by-person-retired.md), [endpoint priority and editable progression](../04-decisions/adr-049-endpoint-priority-and-editable-progression.md), [progression written as a rule](../04-decisions/adr-053-progression-written-as-a-rule.md), [where a new set goes](../04-decisions/adr-025-where-a-new-set-goes.md), [effort in reps in reserve](../04-decisions/adr-026-effort-in-reps-in-reserve.md), [answers in, plan out, no check-ins](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md), [no data kept](../04-decisions/adr-002-no-data-kept.md), [no lifestyle inputs](../04-decisions/adr-003-no-lifestyle-inputs.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
