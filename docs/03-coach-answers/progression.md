# Coach answers: Progression

How a plan grows from week to week. Every plan is a stairway: the steps are small in the first half, a little bigger after the halfway week, and the hardest weeks come last. Weekly sets grow about 3 % a week until halfway and about 5 % after. A small increase that is less than one set is kept (banked) until it adds up to a whole set. The whole stairway is worked out once, when the plan is built. There are no check-ins and no tracking: the plan comes out whole, and people and coaches adjust it themselves. This page also keeps the full history of the check-in, which he first approved and then removed.

This page is part of [the coach answers by topic](index.md). It holds 17 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: the stairway](../02-model/stairway.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Every plan goes up "like steps up a stairway": smaller steps in the first weeks, a bit higher after the halfway point, "but not too much". | [R2-PER-03](#r2-per-03) | CONFIRMED |
| 2 | On a 12-week plan the last 4 weeks are the hardest. | [R2-PER-04](#r2-per-04) | CONFIRMED |
| 3 | Weekly sets grow about 3 % a week until the halfway week and about 5 % after it. Each muscle reaches its ceiling in the last week. | [R3-VOL-04](#r3-vol-04) | CONFIRMED |
| 4 | The percentage is taken from weekly sets per muscle, not from load. | [VOL-04](#vol-04) | CONFIRMED |
| 5 | The step never depends on muscle size. | [VOL-05](#vol-05) | CONFIRMED |
| 6 | 10 % a week is "way too much". No weekly step above 7 % (he approved that limit inside the round-2 check-in table; the team kept it when the table was removed). | [UNI-05](bilateral-unilateral.md#uni-05), [R2-VOL-01](#r2-vol-01) | CONFIRMED |
| 7 | Small increases are banked: when the fraction reaches a whole set, one set is added. | [VOL-06](#vol-06) | CONFIRMED |
| 8 | An added set goes to the first exercise of the day, then the second, and so on (2/2/2, 3/2/2, 3/3/2, 3/3/3, 4/3/3). | [VOL-07](#vol-07) | CONFIRMED |
| 9 | When the same day runs twice a week, added sets alternate between the two days. Extra small-muscle sets become a short bonus exercise. | [R3-VOL-03](#r3-vol-03) | CONFIRMED |
| 10 | A block should feel like starting at a 2 and ending at an 11. Effort goes from 3 reps in the tank to 1, plus intensifiers in the last week. | [R2-PER-05](#r2-per-05), [R3-VOL-04](#r3-vol-04) | CONFIRMED |
| 11 | No check-ins. No tracking. The plan is produced once and people change it themselves. | [R3-VOL-02](#r3-vol-02), [R3-VOL-04](#r3-vol-04) | CONFIRMED |
| 12 | One sound algorithm for rep, set and volume increases, for every athlete and level. | [PRG-06](#prg-06) | CONFIRMED |
| 13 | The printed "How to adjust this plan" guide, the coach's hand-set step (0 to 7 %), and treating the ceiling as a maximum when small steps cannot reach it. | [R3-VOL-04](#r3-vol-04) | PROPOSED |

## Why, in his words

- "It should be like steps up a stairway." ([R2-PER-03](#r2-per-03))
- "I want them to be able to kick out a program, and that's it. That's the program." ([R3-VOL-04](#r3-vol-04))
- "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing." ([VOL-05](#vol-05))
- "I'm adding sets to the things that matter most." ([VOL-07](#vol-07))
- "We're only doing outputs, and people can change accordingly." ([R3-VOL-02](#r3-vol-02))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| The stairway rule, steps and limits | `generator_spec_v1.json` | `rule_tables.rate_engine` |
| Planned weekly sets, week by week, by level | `generator_spec_v1.json` | `rule_tables.rate_engine.planned_targets_by_level` |
| Banking of fractions | `generator_spec_v1.json` | `rule_tables.banking` |
| Where each added set goes | `generator_spec_v1.json` | `rule_tables.set_placement.steps` |
| Planned effort through the block | `generator_spec_v1.json` | `rule_tables.effort.planned_drift` |
| 12-week and 8-week shapes | `generator_spec_v1.json` | `plan_types.fixed_12` |
| The printed self-adjust guide | `generator_spec_v1.json` | `rule_tables.rate_engine.self_adjust_guide` |
| The retired check-in (kept as a note only) | `generator_spec_v1.json` | `adaptation.status` |
| Strength template | `generator_spec_v1.json` | `rule_tables.strength_template` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [VOL-04](#vol-04) | 1 | RIGHT | The weekly percentage applies to weekly sets per muscle, not to load. | Stands, refined |
| [VOL-05](#vol-05) | 1 | answered in words (no chip) | The weekly step never goes by muscle size. One planned stairway; people adjust by hand. | Partly superseded |
| [VOL-06](#vol-06) | 1 | RIGHT | Bank the fraction; add a whole set when it reaches 1. The tool does the math. | Stands |
| [R2-PER-03](#r2-per-03) | 2 | NOT RIGHT | Every plan is a stairway: smaller steps first, a bit higher after halfway, never a hard start. | Stands, refined |
| [R2-PER-04](#r2-per-04) | 2 | PARTLY | 12 weeks: a stairway whose last 4 weeks are the hardest. | Stands, refined |
| [R2-PER-05](#r2-per-05) | 2 | RIGHT | "Start at a 2 and end at an 11" is the felt level of the block, not a count of sets. | Stands, refined |
| [R3-VOL-04](#r3-vol-04) | 3 | RIGHT | Stairway numbers: about 3 % a week to halfway, about 5 % after; ceiling in the last week; the plan comes out whole and people adjust it. | Stands |
| [VOL-07](#vol-07) | 1 | answered in words (no chip) | Add the set to the first exercise of the day, then the second, and so on; small muscles get a bonus exercise. | Stands, refined |
| [R2-VOL-08](#r2-vol-08) | 2 | answered in words (no chip) | Not understood in round 2; answered by R3-VOL-03. | Answered later |
| [R3-VOL-03](#r3-vol-03) | 3 | RIGHT | Added sets alternate between the two days of the same type; small-muscle extras become a bonus exercise, never the only one that day. | Stands |
| [GEN-05](#gen-05) | 1 | RIGHT | Superseded: the plan is not adjusted from logs. It comes out whole; people adjust it. | Superseded |
| [R2-GEN-01](#r2-gen-01) | 2 | RIGHT | The plan works with no tracking (stands); the optional weekly check-in is removed. | Superseded |
| [R2-VOL-01](#r2-vol-01) | 2 | RIGHT | Superseded: the check-in step table is gone. Only the limit (never above 7 % a week) remains. | Superseded |
| [R2-VOL-03](#r2-vol-03) | 2 | answered in words (no chip) | No check-in, no change: the plan follows its planned stairway. Now true for everyone. | Stands, refined |
| [R3-VOL-02](#r3-vol-02) | 3 | RIGHT | No check-ins at all. Outputs only; people change the plan themselves. | Stands |
| [PER-09](#per-09) | 1 | RIGHT | Strength template: main lifts 80/80/85/85/90/90 % at RPE 7 to 10; Olympic ramp 75 to 90 % (8s only for DB/KB and pulls). | Stands, refined |
| [PRG-06](#prg-06) | 1 | PARTLY | One sound algorithm for rep, set and volume increases, for every athlete and level. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| Volume ramps week by week in small increments (he first said 3%, 5% or 7%). | `coach_chat_statements.md` | Now the stairway: about 3 % a week to the halfway week, about 5 % after, never above 7 % ([R2-PER-03](#r2-per-03), [R3-VOL-04](#r3-vol-04)). |
| "I usually go week to week: how many sets did you do this week? If you want to do more, do more sets the next week of the same thing." Example: 20 sets of chest this week; next week keep the load and do 22 sets with different exercises: more volume, more variety. | `coach_chat_statements.md` | [VOL-07](#vol-07) made it precise: the added set goes to the first exercise already on the list. Exercises stay the same inside a block ([PER-02](plans-and-calendar.md#per-02)). |
| Week to week: count weekly sets per muscle; to progress, add sets of the same work next week, e.g. chest 20 sets -> 22 sets at the same load, using different exercises for more volume and variety. | `coach_answers.md` (earliest notes) | See [VOL-04](#vol-04) (the percentage is of weekly sets) and [VOL-07](#vol-07) (where the set goes). |
| It must be very simple: put in the basics, get the whole program, see it ahead of time, adjust it yourself. No check-ins, no tracking, no data kept (confirmed in round 3). | `coach_chat_statements.md` | Confirmed by [R3-VOL-02](#r3-vol-02), [R3-VOL-04](#r3-vol-04) and [R3-GEN-01](legal-and-open-source.md#r3-gen-01). |
| He wants "the best mathematical, logical algorithms possible to make sure this is top of the line. Spare no expense." | `coach_chat_statements.md` | Same wish as [VOL-06](#vol-06) and [PRG-06](#prg-06). |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### The weekly step

#### VOL-04

**Question (round 1).** The 3% / 5% / 7% weekly increase: a percentage of what?

**Final rule.** The 3 %, 5 % and 7 % are percentages of weekly sets per muscle. His example: chest goes from 20 to 22 sets at the same load. Load is tracked but is not driven by percentages. Rounds 2 and 3 turned the three numbers into a planned stairway: about 3 % a week until halfway, about 5 % after, never more than 7 %.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Of weekly sets per muscle (your chest example: 20 → 22 sets at the same load). Load and volume load are tracked but not driven by percentages.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.principle`, `rule_tables.rate_engine.standard_steps`
- **Changed later:**
  - **REFINED by [R2-PER-03](#r2-per-03) (round 2).** Before: 3 %, 5 % or 7 % a week. Now: Every plan is a stairway: smaller steps first, a bit higher after halfway.
  - **REFINED by [R3-VOL-04](#r3-vol-04) (round 3).** Before: 3 %, 5 % or 7 % a week. Now: About 3 % a week until the halfway week and about 5 % after it.
- **See also:** [VOL-05](#vol-05), [R3-VOL-04](#r3-vol-04)

#### VOL-05

**Question (round 1).** Which muscles get 3% vs 5% vs 7%?

**Final rule.** The weekly step does not go by muscle. It is "not a big muscle thing or small muscle thing". In round 1 he said it depends on what is going on with the person, and that the person or their coach has to adjust. That part changed. The plan now carries one planned stairway for everyone, and the tool never picks a step from how someone's week went. The person or coach still adjusts by hand.

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We assumed (round 1):** Big muscles 3% (more fatigue per set), medium 5%, small muscles 7% (they recover fast and take high reps). Could be the other way round.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing." (VOL-05)
- **Not confirmed by him:** Letting a coach fix or cap the weekly step by hand, between 0 and 7 %, before the plan is built is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.principle`, `rule_tables.rate_engine.hand_set_range`
- **Changed later:**
  - **REFINED by [R2-VOL-01](#r2-vol-01) (round 2).** Before: The step depends on "what's going on with the person". Now: Round 2 approved a check-in table that picked the step from how the week went. Round 3 removed it.
  - **REVERSED by [R3-VOL-02](#r3-vol-02) (round 3).** Before (superseded): The tool would choose 3, 5 or 7 % from the person's state. Now: No check-ins. The tool does not read the person's state at all.
  - **REFINED by [R3-VOL-04](#r3-vol-04) (round 3).** Before: "They're going to have to somehow be able to adjust accordingly, or their coach." Now: The plan has its own built-in growth; "people will adjust accordingly over time".
- **See also:** [VOL-04](#vol-04), [R3-VOL-02](#r3-vol-02), [R3-VOL-04](#r3-vol-04)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person. Again, this is so personal that they're going to have to somehow be able to adjust accordingly, or their coach to adjust accordingly.

</details>

#### VOL-06

**Question (round 1).** How do you round small increases? 5% of 16 sets is 0.8 sets.

**Final rule.** Small increases are rounded by banking: 5 % of 16 sets is 0.8 of a set, so the fraction is kept and a whole set is added when it reaches 1. Rounding up or down is fine. People should never have to work out the percentages: the tool does it.

- **Status:** Stands as answered.
- **We assumed (round 1):** Bank the fraction and add a whole set once it reaches 1.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." (VOL-06)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.banking`
- **See also:** [VOL-04](#vol-04), [VOL-07](#vol-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, you round up, you round down. That's fine. But I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages. This would be the most advanced algorithm for training for humans that has ever been created.

</details>

### The stairway

#### R2-PER-03

**Question (round 2).** 8-week plan: 4 weeks getting used to it + 4 driving hard, or 3 + 5? And does 'start hard' mean more sets?

**Final rule.** He rejected the 8-week plan as "4 weeks getting used to it + 4 driving hard" with a harder start. The 8-week plan goes up gradually "like steps up a stairway", and so does every program. In the first 2, 3 or 4 weeks the steps are a little smaller. From the halfway point up, the steps get a little higher, "but not too much". This holds for every plan.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** 4 + 4. 'Start hard' = about 10 % more sets than the normal start, with the weekly step capped at 5 % in weeks 1-4.
- **His verdict (round 2):** NOT RIGHT
- **In his words:** "It should be like steps up a stairway." / "It's just a gradual step, a ramp-up, and that goes for every plan." (R2-PER-03)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.principle`, `plan_types.fixed_8.shape`
- **Changed later:**
  - **REFINED by [R3-VOL-04](#r3-vol-04) (round 3).** Before: Smaller steps first, a little higher after halfway. Now: Numbers approved: about 3 % a week until the halfway week, about 5 % after.
- **This answer changed:** [UNI-05](bilateral-unilateral.md#uni-05) (refined), [VOL-04](#vol-04) (refined), [PER-01](plans-and-calendar.md#per-01) (reversed), [PER-10](plans-and-calendar.md#per-10) (refined)
- **See also:** [PER-01](plans-and-calendar.md#per-01), [R2-PER-04](#r2-per-04), [R3-VOL-04](#r3-vol-04)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be. It should be like steps up a stairway. In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much. It's just a gradual step, a ramp-up, and that goes for every plan.

</details>

#### R2-PER-04

**Question (round 2).** 12-week plan: weeks 1-3 getting used to it (1-4 for beginners or people coming back, 1-2 for advanced), drive to week 9, hardest weeks 10-12. OK?

**Final rule.** On a 12-week program "the last 4 weeks are going to be brutal". It is a stairway: week by week it gets gradually harder, meaning more volume. So the hardest stretch is weeks 9 to 12, not weeks 10 to 12 as we proposed.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes, with a 3 % max weekly step during the getting-used-to-it weeks.
- **His verdict (round 2):** PARTLY
- **In his words:** "on a 12-week program, the last 4 weeks are going to be brutal" (R2-PER-04)
- **Not confirmed by him:** His verdict was PARTLY and he spoke only about the last 4 weeks. The "getting used to it" weeks by level (1-4 beginners, 1-3 intermediates, 1-2 advanced) are labels the team kept (PROPOSED).
- **Where it lives:** `generator_spec_v1.json` → `plan_types.fixed_12.shape`, `plan_types.fixed_12.phases_by_level`
- **Changed later:**
  - **REFINED by [R3-VOL-04](#r3-vol-04) (round 3).** Before: A stairway with a brutal last 4 weeks. Now: 12 weeks: small steps in weeks 2 to 6, bigger in weeks 7 to 12; each muscle at its ceiling in the last week.
- **This answer changed:** [PER-01](plans-and-calendar.md#per-01) (refined)
- **See also:** [PER-01](plans-and-calendar.md#per-01), [R2-PER-03](#r2-per-03), [R3-VOL-04](#r3-vol-04)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, on a 12-week program, the last 4 weeks are going to be brutal. Again, like a stairway: steps up, steps up, and week by week, it just gets gradually worse. I mean worse, meaning better, more volume.

</details>

#### R2-PER-05

**Question (round 2).** 'Start at a 2 and end at an 11': advanced lifters are already at the 25-set ceiling. Where does 'one level higher' come from for them?

**Final rule.** "Start at a 2 and end at an 11" is about how the block feels, not about the number of sets. Like RPE: the program starts feeling like a 2 and climbs the ladder. The last week may feel like an 11, a little past your usual limits in overall volume and loading. For advanced lifters already at their ceiling, the extra level comes from heavier loads, intensifiers (myo sets, supersets) and a rotating priority muscle (today a Focus muscle) that can go up to 30 sets, not from more sets on everything.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** From heavier loads, intensifiers (myo sets, supersets) and a rotating priority muscle that can go up to 30 sets, not from more sets on everything.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "I'm just talking about how it feels and what level you're starting at." / "you've pushed yourself a little bit past your limits, which is what an 11 really would mean" (R2-PER-05)
- **Not confirmed by him:** Showing a stair-level number next to each week is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.start_at_2_end_at_11`, `plan_types.fixed_12.stair_level`
- **Changed later:**
  - **REFINED by [R3-VOL-04](#r3-vol-04) (round 3).** Before: The block should feel like 2 at the start and 11 at the end. Now: Approved how: effort goes from 3 reps in the tank early, to 2, to 1-2, to 1 plus intensifiers in the last week.
- **This answer changed:** [VOL-13](volume.md#vol-13) (refined), [PER-01](plans-and-calendar.md#per-01) (refined)
- **See also:** [PER-01](plans-and-calendar.md#per-01), [VOL-13](volume.md#vol-13), [R3-VOL-04](#r3-vol-04)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> When I say started at 2 and ended at 11, I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets. It feels like if you do RPE, you start feeling like a 2, and then that's how you start your program, and then you're gradually going up that ladder. The last week might feel like an 11, like you're doing more than what you usually do. That's how you should end up in your block.
>
> I'm just talking about how it feels and what level you're starting at. By the time you're done with your block, ideally, you've pushed yourself a little bit past your limits, which is what an 11 really would mean. I'm just talking about overall limitations and what you usually do as far as volume and total loading and all of that.

</details>

#### R3-VOL-04

**Question (round 3).** Your stairway in numbers: is this how the weekly steps should feel?

**Final rule.** The stairway in numbers. Sets grow about 3 % a week until the halfway week and about 5 % after it. On 12 weeks, weeks 2 to 6 are small steps and weeks 7 to 12 are bigger. Each muscle's steps are sized so it reaches its ceiling in the last week. Example: an intermediate's big muscle goes from 15 to 22 sets, and the last four weeks are 19, 20, 21, 22. Effort goes from 3 reps in the tank early, to 2, to 1-2, to 1 plus intensifiers in the last week, always inside 1 to 3. His words added the main product rule: the program is kicked out already designed, with its own built-in growth, without anyone reporting how they feel. People see the whole plan ahead of time and adjust it themselves. "It's already a template, and you need to adjust it as you need to."

- **Status:** Stands as answered.
- **We proposed (round 3):** Sets grow about 3 % a week until the halfway week and about 5 % after it (12 weeks: weeks 2-6 small steps, 7-12 bigger), and each muscle's steps are sized so it reaches its ceiling exactly in the last week. Example: intermediate big muscle 15 to 22 sets, the last four weeks 19, 20, 21, 22. To make week 1 feel like a 2 and the last week like an 11, effort goes from 3 reps in the tank early, to 2, to 1-2, to 1 + intensifiers in the last week, always inside your 1-3. With a check-in, 'perfect' = the planned step and 'too easy' = the planned step + 2 points (max 7 %): +3 / +5 % in the first half, your +5 / +7 % after it.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "I want them to be able to kick out a program, and that's it. That's the program." / "It's already a template, and you need to adjust it as you need to." / "It doesn't need to rely too much on inputs." (R3-VOL-04)
- **Not confirmed by him:** The proposal's last sentence described a check-in ("perfect" = the planned step, "too easy" = the step + 2 points). His words remove it, so that sentence is void. Two team readings are open: when a muscle's ceiling is far above its start, small steps cannot reach it, so the ceiling is treated as a maximum (INFERRED). The wording of the printed "How to adjust this plan" guide is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.standard_steps`, `rule_tables.rate_engine.planned_targets_by_level`, `rule_tables.effort.planned_drift`, `rule_tables.rate_engine.self_adjust_guide`
- **This answer changed:** [UNI-05](bilateral-unilateral.md#uni-05) (refined), [VOL-04](#vol-04) (refined), [VOL-05](#vol-05) (refined), [VOL-13](volume.md#vol-13) (refined), [GEN-02](product-and-generator.md#gen-02) (refined), [GEN-05](#gen-05) (reversed), [R2-VOL-06](volume.md#r2-vol-06) (reversed), [R2-PER-03](#r2-per-03) (refined), [R2-PER-04](#r2-per-04) (refined), [R2-PER-05](#r2-per-05) (refined), [R2-GEN-01](#r2-gen-01) (reversed)
- **See also:** [R2-PER-03](#r2-per-03), [R2-PER-04](#r2-per-04), [R2-PER-05](#r2-per-05), [R3-VOL-02](#r3-vol-02), [VOL-13](volume.md#vol-13), [R2-VOL-06](volume.md#r2-vol-06)

<details>
<summary>His full answer, round 3 (from <code>coach_answers_round3.md</code>)</summary>

> Yeah, but remember that we can just kick out the program designed already without the input of somebody saying how they feel or whatever. It doesn't really matter. The program will just have its natural algorithm recommendation of growth throughout it, so anybody can just plug in the numbers of what they want as far as weeks and sport or goals. The program would just kick itself out, and then people will adjust accordingly over time.
>
> I want this to be very simple. This works. We're not going to need a lot of inputs for this. I don't want people to be checking back on their phone in their program. I want them to be able to kick out a program, and that's it. That's the program. That's what you have to follow, and the program will tell you to adjust accordingly. It's already a template, and you need to adjust it as you need to.
>
> I guess that's probably the easiest, best way for people to get their program, whether it be coaches, athletes, or general population people. It doesn't matter. This needs to be very simple for them to see the whole thing ahead of time, ideally, and they can adjust ahead of time, ideally. It doesn't need to rely too much on inputs.

</details>

### Where added sets go

#### VOL-07

**Question (round 1).** When sets go up, do they go to the same exercise or a new one?

**Final rule.** He usually has 3 to 4 exercises per muscle group per day. When a set is added, it goes to the first exercise on the list. The next added set goes to the second exercise, and so on. Starting from 2, 2, 2 the weeks run 3, 2, 2, then 3, 3, 2, then 3, 3, 3, then 4, 3, 3. The first exercises matter most because that is where the energy goes. A small muscle trained at the end of a session (biceps on a back day) is tired by then, so its extra work comes as a bonus exercise.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** First +1 set on an existing exercise, then add a second exercise for that muscle from the same category (your 'different exercises, more variety'). At most 2 exercises per muscle per session.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "I'm adding sets to the things that matter most." / "then we need to get more bicep done as a bonus exercise" (VOL-07)
- **Note:** Our assumption of at most 2 exercises per muscle per session was wrong.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.set_placement.steps`, `rule_tables.session_limits.exercises_per_muscle_on_its_day`
- **Changed later:**
  - **REFINED by [R2-SES-05](sessions-and-order.md#r2-ses-05) (round 2).** Before: 3 to 4 exercises per muscle group per day. Now: Full-body days too: 2 to 4 exercises per muscle that day, never 1.
  - **REFINED by [R3-VOL-03](#r3-vol-03) (round 3).** Before: Add the set to the first exercise of day A. Now: When day A runs twice a week, alternate: Monday's first exercise, then Thursday's. The bonus exercise goes on the optional day, or on a day that already trains that muscle.
  - **REFINED by [R3-SES-01](sessions-and-order.md#r3-ses-01) (round 3).** Before: Exercises counted "per muscle group". Now: Counted on his FOCUS groups (hips = glutes + hamstrings; shoulders = all three delts).
- **See also:** [R3-VOL-03](#r3-vol-03), [R2-SES-05](sessions-and-order.md#r2-ses-05), [VOL-06](#vol-06), [ORD-11](sessions-and-order.md#ord-11)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Usually, I have about 3 to 4 exercises per muscle group per day. The way that I would add it, let's say on day A of the week, is that if there are 3 exercises and I need to add an extra set of volume, then I add it to the first exercise on the list. That way, I can get more work done to that first exercise.
>
> If the next week I need to add an extra set to that workout day A, then I would add the other set to the second exercise on the list. Let's say, for example, I started with 2 sets of 1, 2 sets of 2, and 2 sets of 3. The next week would be 3 sets of 1, 2 sets of 2, and 2 sets of 3. The next week after that would be 3 sets of 1, 3 sets of 2, and 2 sets of 3. The week after that, I would probably go 3, 3, 3. The week after that, I would probably go 4, 3, 3, and so forth.
>
> If you can understand that math, then you can understand this algorithm that I'm trying to do: I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning of the exercise because I put all my energy into it. That's usually how I pick that.
>
> Now, if the person, for example, starts with big muscles and then ends with little muscles, you start with back rows and lat pullovers, and you have vertical pulling. Eventually, they end up with bicep. They're going to be kind of gassed out. When they go and switch into bicep, for example, on a back day for bodybuilding, if they want to get more bicep done, then we need to get more bicep done as a bonus exercise. Ideally, that's kind of how my head works in all of this.

</details>

#### R2-VOL-08

**Question (round 2).** When day A happens twice a week, where does a new set go? And where does a small-muscle bonus exercise go?

**Final rule.** Not understood in round 2 ("I don't understand this question"). It was asked again in plain words in round 3 and approved there: see [R3-VOL-03](#r3-vol-03).

- **Status:** Not answered in this round. Answered later (see "Changed later").
- **We proposed (round 2):** Alternate: Monday's first exercise, then Thursday's first exercise, so both days stay even. A bonus exercise (2 sets) goes on the optional day as a Focus slot; with no optional day, at the end of the shortest training day.
- **His verdict (round 2):** answered in words, no chip
- **In his words:** "I don't understand this question." (R2-VOL-08)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.set_placement.R3_VOL_03_status`
- **Changed later:**
  - **ANSWERED by [R3-VOL-03](#r3-vol-03) (round 3).** Before: "I don't understand this question." Now: Approved: the added set alternates between the two days; small-muscle extras become a bonus exercise on the optional day or on a day that already trains that muscle.
- **See also:** [R3-VOL-03](#r3-vol-03), [VOL-07](#vol-07)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> I don't understand this question.

</details>

#### R3-VOL-03

**Question (round 3).** (Re-asking R2-VOL-08 in plain words.) A 4-day plan has the same Day A on Monday and Thursday. When the plan adds one more back set, where does it go? And where do 2 extra biceps sets go when every training day is full?

**Final rule.** A 4-day plan has the same Day A on Monday and Thursday. When the plan adds one back set, it goes to Monday's first back exercise this time and Thursday's first back exercise the next time, so both days stay even. When every training day is full, 2 extra biceps sets become a short bonus biceps exercise on the optional day (for example Saturday). With no optional day, the bonus goes on a day that already trains biceps. It is never the only biceps exercise of that day.

- **Status:** Stands as answered.
- **We proposed (round 3):** The back set goes to Monday's first back exercise this time and Thursday's first back exercise the next time, so both days stay even. The biceps sets become a short bonus biceps exercise on the optional day (e.g. Saturday); with no optional day, on a day that already trains biceps, never as the only biceps exercise of that day.
- **His verdict (round 3):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.set_placement.steps`, `rule_tables.set_placement.R3_VOL_03_status`
- **This answer changed:** [VOL-07](#vol-07) (refined), [ORD-10](sessions-and-order.md#ord-10) (refined), [R2-VOL-08](#r2-vol-08) (answered)
- **See also:** [VOL-07](#vol-07), [R2-VOL-08](#r2-vol-08), [ORD-10](sessions-and-order.md#ord-10), [ORD-11](sessions-and-order.md#ord-11)

### Check-ins: asked, approved, then removed

#### GEN-05

**Question (round 1).** Fixed plan, or adjust week to week from the client's logged EFFORT and HOW IT FELT?

**Final rule.** Superseded. In round 1 he marked RIGHT that the plan should adjust week to week from the client's logged EFFORT and HOW IT FELT. Round 3 removed that. The plan is fixed when it is built. It comes out whole with its stairway built in. The tool never adjusts it from logs. People and coaches adjust it themselves.

- **Status:** SUPERSEDED. A later answer replaced this one (see "Changed later").
- **We assumed (round 1):** Adjust: 'Felt a PAIN' → swap within the category or lower the level; EFFORT 9–10 → hold or cut sets next week; EFFORT ≤ 6 → add.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `adaptation.status`, `rule_tables.rate_engine.no_feedback`, `plan_editing.principle`
- **Changed later:**
  - **REFINED by [R2-GEN-01](#r2-gen-01) (round 2).** Before: Adjust week to week from logged effort. Now: Round 2: the plan works with no tracking; a 1-minute weekly check-in was optional. Round 3 removed the check-in.
  - **REFINED by [R2-VOL-03](#r2-vol-03) (round 2).** Before: Adjust from logs. Now: "If they don't check in, the plan doesn't change. There is no data to go off of." Round 3 removed the check-in for everyone.
  - **REVERSED by [R3-VOL-02](#r3-vol-02) (round 3).** Before (superseded): Adjust week to week from the client's logged EFFORT and HOW IT FELT (RIGHT). Now: "I want to take away all check-in info. We're only doing outputs, and people can change accordingly."
  - **REVERSED by [R3-VOL-04](#r3-vol-04) (round 3).** Before (superseded): The plan adapts to what the client logs. Now: "I don't want people to be checking back on their phone in their program."
- **See also:** [R3-VOL-02](#r3-vol-02), [R3-VOL-04](#r3-vol-04), [GEN-03](product-and-generator.md#gen-03)

#### R2-GEN-01

**Question (round 2).** You said people should track on their own, but also that the plan should adjust from their effort. OK to offer both?

**Final rule.** Superseded in part. In round 2 he approved offering both: a plan that works with no tracking at all, plus an optional 1-minute weekly check-in that decided next week's step. The first half stands. The check-in was removed in round 3. The approved proposal tied the week-by-week plan to the check-in, so the team no longer builds it as a separate mode (INFERRED).

- **Status:** SUPERSEDED. A later answer replaced this one (see "Changed later").
- **We proposed (round 2):** Yes: the plan works with no tracking at all. An optional 1-minute weekly check-in (effort, how it felt, anything hurting, how life was) decides next week's step. The week-by-week plan needs the check-in.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** He did not say to drop the week-by-week plan. Dropping it as a separate mode follows from removing the check-in (INFERRED). Keeping the name "week by week" as a way to open a 12-week plan on its week view is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `adaptation.status`, `plan_types.week_by_week`
- **Changed later:**
  - **REVERSED by [R3-VOL-02](#r3-vol-02) (round 3).** Before (superseded): An optional 1-minute weekly check-in decides next week's step (RIGHT). Now: "We're not going to have check-ins, correct? I want to take away all check-in info."
  - **REVERSED by [R3-VOL-04](#r3-vol-04) (round 3).** Before (superseded): The week-by-week plan needs the check-in. Now: The whole plan is produced once and seen ahead of time.
- **This answer changed:** [PER-01](plans-and-calendar.md#per-01) (refined), [GEN-05](#gen-05) (refined)
- **See also:** [GEN-05](#gen-05), [R3-VOL-02](#r3-vol-02), [PER-01](plans-and-calendar.md#per-01)

#### R2-VOL-01

**Question (round 2).** Each week the plan grows by 3, 5 or 7 % depending on how the person's week went. Does this table match how you'd adjust a client?

**Final rule.** Superseded. In round 2 he approved a table that grew the plan by 3, 5 or 7 % from how the week went: too easy = more, on target = the planned step, effort 9 = hold, any 10 = hold and one set less, under half the sessions = repeat the week. In the same round he rejected every lifestyle question, which emptied the table's "life was harder / better" cells. In round 3 he removed the check-in itself. The one part still in use is the limit: no weekly step above 7 %.

- **Status:** SUPERSEDED. A later answer replaced this one (see "Changed later").
- **We proposed (round 2):** Effort mostly 1-6 (too easy): +7 % (+5 % if life was harder). Effort 7-8 (tough / perfect): +5 % (+3 % if life was harder). Effort 9: hold (+3 % only if life was better than usual). Any '10 - I'm done': hold and remove 1 set from that day. Life 'much harder' (sick, travel, no sleep): hold. Never more than 7 % a week; repeat the week if they did under half the sessions.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** He approved "never more than 7 % a week" as one line of the check-in table. Keeping that limit after the table was removed is the team's reading (INFERRED).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.retired`, `rule_tables.rate_engine.standard_steps.never_above`
- **Changed later:**
  - **REVERSED by [R2-GEN-04](product-and-generator.md#r2-gen-04) (round 2).** Before (superseded): The table had cells for "life was harder" and "life was better". Now: Same round: "There's no need to talk about sleep or stress or anything else." The life cells were dropped.
  - **REVERSED by [R3-VOL-02](#r3-vol-02) (round 3).** Before (superseded): A check-in table decides next week's step (RIGHT). Now: No check-ins at all. "We're only doing outputs."
- **This answer changed:** [VOL-05](#vol-05) (refined)
- **See also:** [R2-GEN-04](product-and-generator.md#r2-gen-04), [R3-VOL-02](#r3-vol-02), [R2-VOL-02](volume.md#r2-vol-02), [R2-VOL-03](#r2-vol-03)

#### R2-VOL-03

**Question (round 2).** If someone never checks in, what weekly step should their plan use?

**Final rule.** He did not accept our default steps for people who never check in (5 % for most people; 3 % for people under stress, short on sleep, in a hard physical job, 60 or over, back from time off or in pain). "If they don't check in, the plan doesn't change. There is no data to go off of." Round 3 made this the rule for everyone: nobody checks in, so after it is built the plan only follows its own planned stairway.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** 5 % for most people. 3 % for people who are stressed, sleep under 6 hours, have a hard physical job, are 60+, are coming back from 6+ months off, or have pain. 7 % only after check-ins show they handle it. Advanced lifters default to 3 % so the hardest weeks land at the end.
- **His verdict (round 2):** answered in words, no chip
- **In his words:** "No, if they don't check in, the plan doesn't change. There is no data to go off of." (R2-VOL-03)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.rate_engine.no_feedback`, `derived_values.D12_planned_step`
- **Changed later:**
  - **REFINED by [R3-VOL-02](#r3-vol-02) (round 3).** Before: Without a check-in the plan doesn't change. Now: There is no check-in at all, so this is every plan.
- **This answer changed:** [GEN-05](#gen-05) (refined)
- **See also:** [R3-VOL-02](#r3-vol-02), [R2-GEN-04](product-and-generator.md#r2-gen-04)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> No, if they don't check in, the plan doesn't change. There is no data to go off of.

</details>

#### R3-VOL-02

**Question (round 3).** Your approved check-in table had 'life was harder / better' cells, but you also said no questions about sleep, stress or anything else. OK to drop the life cells?

**Final rule.** No check-ins. The question asked whether to drop the "life" cells from the check-in table. His words went further: take away all check-in information. The tool only produces outputs, and people change the plan as they need. His words define the rule, so the trimmed check-in described in the proposal is not built either.

- **Status:** Stands as answered.
- **We proposed (round 3):** Yes: the check-in only asks which sessions were done, how hard they felt and whether anything hurts. Effort mostly 1-6: a bit more next week. 7-8: the planned step. 9: hold. Any 10: hold and 1 set less that day. Under half the sessions: repeat the week. Someone who was sick shows it through missed sessions or high effort, so the plan still reacts.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "Yeah, we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." (R3-VOL-02)
- **Where it lives:** `generator_spec_v1.json` → `adaptation.status`, `rule_tables.rate_engine.no_feedback`, `inputs_schema.removed_fields`
- **This answer changed:** [UNI-08](bilateral-unilateral.md#uni-08) (refined), [VOL-03](volume.md#vol-03) (refined), [VOL-05](#vol-05) (reversed), [PER-01](plans-and-calendar.md#per-01) (reversed), [PER-06](levels-and-zones.md#per-06) (refined), [GEN-03](product-and-generator.md#gen-03) (refined), [GEN-05](#gen-05) (reversed), [R2-VOL-01](#r2-vol-01) (reversed), [R2-VOL-02](volume.md#r2-vol-02) (reversed), [R2-VOL-03](#r2-vol-03) (refined), [R2-VOL-07](plans-and-calendar.md#r2-vol-07) (reversed), [R2-LIB-03](levels-and-zones.md#r2-lib-03) (refined), [R2-GEN-01](#r2-gen-01) (reversed), [R2-GEN-02](product-and-generator.md#r2-gen-02) (reversed)
- **See also:** [R3-VOL-04](#r3-vol-04), [GEN-05](#gen-05), [R2-GEN-01](#r2-gen-01), [R2-VOL-01](#r2-vol-01), [R3-GEN-01](legal-and-open-source.md#r3-gen-01), [R3-SES-02](sessions-and-order.md#r3-ses-02)

<details>
<summary>His full answer, round 3 (from <code>coach_answers_round3.md</code>)</summary>

> Yeah, we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly.

</details>

### Strength template and one algorithm

#### PER-09

**Question (round 1).** Strength progression template: is this the default for strength-focused plans?

**Final rule.** The strength template is the default for strength-focused plans. Main lifts follow the 4 Tracks rows: 80, 80, 85, 85, 90, 90 % across the weeks at RPE 7 rising to 10. Olympic lifts ramp 75, 80, 85, 90 % with 4x8, 4x6, 4x6, 4x4. He asked that it be checked for correctness. Round 2 kept the 8-rep ramp only for dumbbell, kettlebell and hang-pull variants, and limited percentages to lifts with a tested best.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Olympic lifts 75 → 80 → 85 → 90% with 4×8 → 4×6 → 4×6 → 4×4. The 4 Tracks rows: %, RPE, sets and reps per week (80/80/85/85/90/90, RPE 7→10).
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "That's right. That's essentially it. I just want to make sure it's correct." (PER-09)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.strength_template`, `rule_tables.athletic.olympic.reps`
- **Changed later:**
  - **REFINED by [R2-ATH-05](athletes-and-sports.md#r2-ath-05) (round 2).** Before: Olympic lifts 4x8 at 75 % up to 4x4 at 90 %. Now: Full squat cleans and snatches use 3 to 5 reps per set with the same weekly reps. The 8-rep ramp stays for DB/KB and pull variants.
  - **REFINED by [R2-GEN-06](product-and-generator.md#r2-gen-06) (round 2).** Before: Percentages on the template. Now: Percentages only with a recent tested best; untested lifts go by RPE or reps in reserve. Olympic lifts "don't necessarily need to go by percentage unless you're a competitive Olympic lifter".
- **See also:** [R2-ATH-05](athletes-and-sports.md#r2-ath-05), [R2-GEN-06](product-and-generator.md#r2-gen-06), [ORD-07](sessions-and-order.md#ord-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> That's right. That's essentially it. I just want to make sure it's correct.

</details>

#### PRG-06

**Question (round 1).** Upper/Lower: upper-day reps rise with level (3×8 → 3×10 → 4×12), the opposite of the lower day. Intentional?

**Final rule.** In his Upper/Lower example the upper-day reps rose with level while the lower-day reps fell. That was probably a fill error, or a different program. The rule he wants: one mathematical algorithm for rep increases, set increases and volume changes that is equal and sound for every kind of athlete and every level.

- **Status:** Stands as answered.
- **We assumed (round 1):** Fill error.
- **His verdict (round 1):** PARTLY
- **In his words:** "we should make sure our mathematical algorithm for rep rises, set rises, and volume adaptations is equal and sound for every different model of athlete, level, and everything" (PRG-06)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.reps.one_algorithm`
- **See also:** [VOL-06](#vol-06), [R2-PER-03](#r2-per-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Not necessarily intentional. That was probably a fill error or just a different program that I wrote, but we should make sure our mathematical algorithm for rep rises, set rises, and volume adaptations is equal and sound for every different model of athlete, level, and everything.

</details>

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [UNI-05](bilateral-unilateral.md#uni-05) | [bilateral-unilateral](bilateral-unilateral.md) | Unilateral work progresses like bilateral work; 10 % a week is way too much. |
| [PER-01](plans-and-calendar.md#per-01) | [plans-and-calendar](plans-and-calendar.md) | Plan lengths. Its 8-week reading (4 + 4 with a hard start) was reversed by R2-PER-03. |
| [R2-VOL-06](volume.md#r2-vol-06) | [volume](volume.md) | Ceilings by level; the next block starts 5 % higher. |
| [R2-VOL-07](plans-and-calendar.md#r2-vol-07) | [plans-and-calendar](plans-and-calendar.md) | No deload or maintenance week inside a block. |
| [R3-SES-02](sessions-and-order.md#r3-ses-02) | [sessions-and-order](sessions-and-order.md) | When time is short the stairway still climbs on the muscles that are trained. |
| [R2-GEN-04](product-and-generator.md#r2-gen-04) | [product-and-generator](product-and-generator.md) | No sleep or stress questions. |
| [VOL-13](volume.md#vol-13) | [volume](volume.md) | Effort scale (RIR). |
| [R3-PER-01](plans-and-calendar.md#r3-per-01) | [plans-and-calendar](plans-and-calendar.md) | The easy week after a block is a recommendation. |
| [PER-02](plans-and-calendar.md#per-02) | [plans-and-calendar](plans-and-calendar.md) | Exercises stay the same for a block. |
