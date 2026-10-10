# Coach answers: Plans and calendar

Which plans exist and how they sit on the calendar. The coach prefers 12-week plans. 8-week plans are fine. 4 to 6 weeks is for maintenance and transitions at reduced volume. Exercises stay the same for 4 to 6 weeks at a time; then one or two small things change. The answers use the word block for two things: that 4-to-6-week run of the same exercises, and a whole 8- or 12-week plan. The team calls the first an exercise block and the second a training block. There is never a deload or maintenance week in the middle of a training block. The easy week after a block is a recommendation, not a must. The general population can follow a yearly plan in four quarters; athletes follow their season. How the weeks climb inside a plan is on the [progression](progression.md) page.

This page is part of [the coach answers by topic](index.md). It holds 14 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: plans and calendar](../02-model/plans-and-calendar.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | 12 weeks is his preferred plan. For more than 12 weeks, do another 12 one step up. | [PER-01](#per-01), [R2-VOL-06](volume.md#r2-vol-06) | CONFIRMED |
| 2 | 8-week plans are fine. Like every plan they climb as a stairway, with no hard start. | [PER-01](#per-01), [R2-PER-03](progression.md#r2-per-03) | CONFIRMED |
| 3 | 4 to 6 weeks is for maintenance and transitions (vacation, travel, moving, a season change) at about 50 to 70 % of the volume. The person picks the number of weeks and can add more. | [PER-01](#per-01), [R2-PER-06](#r2-per-06) | CONFIRMED |
| 4 | Exercises stay the same for a block (4 to 6 weeks). The next block changes one or two small variables, never all at once. | [PER-02](#per-02) | CONFIRMED |
| 5 | A week A / week B swap of the lead lift is for people who want more variety. | [PER-03](#per-03) | CONFIRMED |
| 6 | No deload and no maintenance week in the middle of a block (the whole 8- or 12-week plan). A block is managed and completed. | [R2-VOL-07](#r2-vol-07) | CONFIRMED |
| 7 | If a block cannot be completed: stop it, do a maintenance phase, then start a whole new block. | [R2-VOL-07](#r2-vol-07) | CONFIRMED |
| 8 | The easy week: about half the sets of the hardest week, same exercises, lighter, no finisher. After a block it is an extra week and only a recommendation. | [PER-05](#per-05), [R2-VOL-07](#r2-vol-07), [R3-PER-01](#r3-per-01) | CONFIRMED |
| 9 | When a block ends, it ends. The person goes back and builds what they want next. | [R3-PER-01](#r3-per-01) | CONFIRMED |
| 10 | The yearly plan is for the general population: Jan-Mar hard work and more cardio, Apr-Jun summer shape, Jul-Sep maintain at about 70 %, Oct-Dec build muscle; holidays in maintenance. | [R2-PER-01](#r2-per-01) | CONFIRMED |
| 11 | The year follows the user's own calendar and can be tuned freely. Holiday weeks are planned between blocks. | [R2-PER-02](#r2-per-02), [R3-PER-01](#r3-per-01) | CONFIRMED |
| 12 | Athletes: off-season most volume; pre-season more speed and power with less volume; in season 2 days and low volume; post-season recovery. | [PER-08](#per-08) | CONFIRMED |
| 13 | Pre-season is the 4-6-week block at about 60 % of off-season sets, ending with a 1-2-week taper before the first game. | [R2-PER-06](#r2-per-06) | CONFIRMED |
| 14 | Athlete rep phases VOL 1 (12-15), VOL 2 (8-12), VOL 3 (6-8): one per off-season block. | [PER-11](#per-11) | CONFIRMED |
| 15 | Fight or competition prep uses 2-week steps and waves. | [PER-10](#per-10) | CONFIRMED |
| 16 | "Week by week" kept only as a name for the week view of a 12-week plan; the question asked when someone builds their next block; the reading of the Q1 cut; three 4-week exercise blocks inside 12 weeks. | [PER-01](#per-01), [R3-PER-01](#r3-per-01), [R2-PER-01](#r2-per-01), [PER-02](#per-02) | PROPOSED |

## Why, in his words

- "Usually, I like, personally, on my model, the 12-week programs." ([PER-01](#per-01))
- "It should never be thrown in the middle of a block." ([R2-VOL-07](#r2-vol-07))
- "maintenance weeks are a recommendation. They don't have to be mandatory" ([R3-PER-01](#r3-per-01))
- "Don't try to 'confuse' the muscle." (conversation, `coach_chat_statements.md`)
- "This is for gen pop and general staying healthy and in shape type of life." ([R2-PER-01](#r2-per-01))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| All plan types | `generator_spec_v1.json` | `plan_types` |
| 12-week plan | `generator_spec_v1.json` | `plan_types.fixed_12` |
| 8-week plan | `generator_spec_v1.json` | `plan_types.fixed_8` |
| Maintenance, 4 to 6 weeks | `generator_spec_v1.json` | `plan_types.maintenance_4_6` |
| The easy week (deload): dose and when | `generator_spec_v1.json` | `plan_types.deload` |
| The yearly plan | `generator_spec_v1.json` | `plan_types.year` |
| Seasons | `generator_spec_v1.json` | `plan_types.season` |
| Fight, meet and event prep | `generator_spec_v1.json` | `plan_types.prep` |
| The next block, one step up | `generator_spec_v1.json` | `plan_types.cycles` |
| The check that no block holds a deload | `generator_spec_v1.json` | `validation_checks.V24_block_structure` |
| Plan type on the intake form | `generator_spec_v1.json` | `inputs_schema.fields.F25` |
| Periodization in full | `synthesis/06_periodization.json` | `plan_length_model` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [PER-01](#per-01) | 1 | NOT RIGHT | Plans: 12 weeks preferred; 8 weeks OK; 4-6 weeks = maintenance at 50-70 %; more than 12 = another 12 one step up; a yearly option. | Partly superseded |
| [PER-02](#per-02) | 1 | RIGHT | Same exercises for a 4-6-week block; next block change one or two small variables. | Stands, refined |
| [PER-03](#per-03) | 1 | RIGHT | A / B weeks (lead-lift swap) for people who want more variety. | Stands |
| [PER-05](#per-05) | 1 | RIGHT | Easy week (deload) = about half the sets of the hardest week, same exercises, lighter or 3+ RIR, no finisher; only after a block, and only a recommendation. | Stands, refined |
| [R2-VOL-07](#r2-vol-07) | 2 | RIGHT | No deload or maintenance inside a block. Cannot finish it: stop, maintenance, then a whole new block. | Partly superseded |
| [R2-PER-06](#r2-per-06) | 2 | RIGHT | Pre-season = 4-6 weeks at ~60 % with speed/power + a 1-2-week taper. Maintenance length is the person's choice and can be extended. | Stands, refined |
| [R3-PER-01](#r3-per-01) | 3 | RIGHT | The easy week after a block is an extra week and only a recommendation; holidays sit between blocks; when a block ends, it ends. | Stands |
| [R2-PER-01](#r2-per-01) | 2 | RIGHT | Yearly plan for the general population: Q1 cut with more cardio, Q2 summer shape, Q3 maintain ~70 %, Q4 build; December holidays in maintenance. | Stands, refined |
| [R2-PER-02](#r2-per-02) | 2 | RIGHT | The year follows the user's calendar and is fully tunable (re-order blocks, more or less cardio). | Stands, refined |
| [PER-08](#per-08) | 1 | RIGHT | Off-season most volume; pre-season speed/power with less volume; in season 2 days, low volume; post-season recovery. | Stands, refined |
| [PER-11](#per-11) | 1 | RIGHT | Athlete rep phases: VOL 1 (12-15) early off-season, VOL 2 (8-12) mid, VOL 3 (6-8) late off-season / pre-season. | Stands |
| [PER-10](#per-10) | 1 | RIGHT | Smooth increases for general and hypertrophy clients; 2-week steps and waves for fight or competition prep. | Stands, refined |
| [PRG-04](#prg-04) | 1 | PARTLY | STARTING / MID / ADVANCED OFF SEASON: blocks or levels, whatever is needed. | Stands |
| [PRG-12](#prg-12) | 1 | RIGHT | Half-marathon plan (Chris Hinshaw) used as-is, for the half marathon only. | Stands, refined |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| "Don't try to 'confuse' the muscle." Keep the same exercises over the block; in the next block change some small variables. | `coach_chat_statements.md` | Confirmed by [PER-02](#per-02). |
| Don't "confuse the muscle": keep the same exercises over a block; change small variables in the next block. | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |
| He wants his programming system captured so a tool can take basic information and "kick out" a 6-, 8- or 12-week plan (later: 4–6-week maintenance, 8, 12, week-by-week, yearly). | `coach_chat_statements.md` | [PER-01](#per-01) set the lengths: 6-week training plans are not needed; 4 to 6 weeks is maintenance. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Plan lengths

#### PER-01

**Question (round 1).** How are 6-, 8- and 12-week plans shaped?

**Final rule.** He rejected our plan shapes (each with a built-in deload or test week). His picture: 6-week plans are not really needed. 4 to 6 weeks is for transitions and maintenance (a vacation of 1 or 2 weeks, moving from off-season to on-season, travel, moving house) at lower volume, about 50 to 70 % of the complete volume, so people recover. 8-week programs are OK. 12-week programs are his favourite. Anything longer is another 12 weeks: the first ends at a level 10, the second starts at a 2 and ends at an 11. It does not need to follow the conjugate method or be set in stone, but it needs sound science behind it. He also wanted a week-by-week option with no set length, and a yearly option. Later rounds changed three parts. The 8-week reading of 4 weeks getting used to it, 4 weeks driving hard and a hard start was replaced by the stairway. The week-by-week option was tied to check-ins in round 2, so the team no longer builds it as a separate mode (INFERRED). Maintenance weeks in the year are recommendations, not automatic.

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We assumed (round 1):** 8 weeks = 7 building + week 8 TEST/DELOAD (Conjugate, 4 Tracks). 12 weeks = 6 building + week 7 deload + 5 building with a small change. 6 weeks = 5 building + a deload or test week.
- **His verdict (round 1):** NOT RIGHT
- **In his words:** "Usually, I like, personally, on my model, the 12-week programs." / "I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it" (PER-01)
- **Not confirmed by him:** He did not say to drop the week-by-week option; that follows from removing the check-in (INFERRED). Keeping the name "week by week" for a 12-week plan that opens on its week view is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `plan_types.fixed_12`, `plan_types.fixed_8`, `plan_types.maintenance_4_6`, `plan_types.year`, `inputs_schema.fields.F25`
- **Changed later:**
  - **REVERSED by [R2-PER-03](progression.md#r2-per-03) (round 2).** Before (superseded): 8 weeks: "the first 4 weeks are going to be mainly your body getting used to it, and then the next 4 weeks are going to be you driving it hard ... you have to start hard" (read by us as 4 + 4 with a harder start). Now: NOT RIGHT. The 8-week plan goes up gradually like steps up a stairway, as every program should.
  - **REFINED by [R2-PER-04](progression.md#r2-per-04) (round 2).** Before: 12 weeks: 2 to 4 weeks getting used to it, 4 to 6 driving hard, the last weeks hardest. Now: A stairway whose last 4 weeks are "brutal".
  - **REFINED by [R2-PER-05](progression.md#r2-per-05) (round 2).** Before: "You might want to start at a 2 and end at an 11." Now: That is how the block feels, not a count of sets.
  - **REFINED by [R2-VOL-06](volume.md#r2-vol-06) (round 2).** Before: The second 12 weeks starts higher. Now: Approved step: the next block starts 5 % higher with the ceiling 1 set higher.
  - **REFINED by [R2-PER-01](#r2-per-01) (round 2).** Before: A first sketch of the year in quarters. Now: The year approved quarter by quarter, for the general population.
  - **REFINED by [R2-PER-06](#r2-per-06) (round 2).** Before: Maintenance of 4 to 6 weeks. Now: The person picks how many weeks and can add more.
  - **REFINED by [R2-GEN-01](progression.md#r2-gen-01) (round 2).** Before: A week-by-week plan: "Just keep me in line ... and then it does it by itself." Now: Round 2 tied the week-by-week plan to the weekly check-in, which round 3 removed.
  - **REVERSED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before (superseded): A week-by-week plan that runs by itself. Now: No check-ins. The whole plan is produced at once, so the team no longer builds week-by-week as a separate mode (INFERRED).
  - **REFINED by [R3-PER-01](#r3-per-01) (round 3).** Before: At the end of the year "it just automatically puts you in maintenance". Now: "Maintenance weeks are a recommendation. They don't have to be mandatory."
- **See also:** [R2-PER-03](progression.md#r2-per-03), [R2-PER-04](progression.md#r2-per-04), [R2-PER-05](progression.md#r2-per-05), [R2-PER-01](#r2-per-01), [R2-PER-06](#r2-per-06), [R3-PER-01](#r3-per-01), [PER-05](#per-05)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> So, usually, the 6-week plans are not necessarily needed. I would like for people to be able to use the 4- to 6-week plans when they need to transition, like if they need a maintenance phase, or if they need to do a transition of vacation, things like that. They can do a vacation 1-week or vacation 2-week kind of thing, or if they're transitioning from off-season to on-season, they're traveling, and they're moving to a new place, or they need to take a maintenance phase that's 4 to 6 weeks. That's usually a lower-volume maintenance volume kind of thing, which would drop all of the complete volume to maybe 70% around there, 50%. This allows them to recover and not push too hard.
>
> The 8-week program: the first 4 weeks are going to be mainly your body getting used to it, and then the next 4 weeks are going to be you driving it hard. 8-week programs are okay. They're not too bad. It's just going to be gradual, starting from point 1 to point 2 to point 3, and then all the way, you're driving yourself to more and more. You want good stimulus for the last 5 weeks. Let's say, for example, and of course you're starting hard. An 8-week program is a program that wants to modify you, so you have to start hard.
>
> Usually, I like, personally, on my model, the 12-week programs. The 12-week programs would be:
>
> 1. You start your program.
> 2. The first 2 to 4 weeks are going to be just you getting used to the movements.
> 3. The next 4 to 6 weeks are going to be you driving it hard, not all the way to the top.
> 4. The last weeks are going to be you driving it hard, and you're going to get more tired, more stimulus, more changes, more adaptations.
>
> That's the 12-week program. Anything more than 12 weeks, they can just repeat another 12 weeks. Let's say you end your 12-week program at a level 10 and you start it at a level 1. For your next 12-week program, you can let it be known that it's not your first one, it's your second one. You might want to start at a 2 and end at an 11, meaning your volume slowly creates more, and then you can adjust accordingly.
>
> This is a very complicated thing, usually for the amount of weeks, but it's not necessarily built in a too complicated way or anything set in stone. I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it so we can research on this and make sure we do it correctly.
>
> Also, if people want to not do a week plan and they just do a week-by-week plan that doesn't have a set structure of 6, 8, 12, or whatever, then we can also do that. Just keep me in line, kind of thing, and then it does it by itself.
>
> I believe maybe we should even have a year option where it's a lot of hard work during the winter. The last couple of weeks of the year, for New Year's and Christmas, it just automatically puts you in maintenance. At the beginning of the year, you start up again, and it's really hard work, but it's a lot more cardio than the end-of-the-year win, which is less cardio, so you can start the year cutting down so you can get into summer.
>
> This second half of the year, the second quarter, is for losing body fat and starting to get in shape. For the summer, the second quarter of the year, you're going to kick into summer, so it's going to be a mix in between building up a little bit more muscle and keeping your body fat down. The third quarter of the year is going to be more about maintaining the way your body looks and staying healthy. The last quarter of the year would be building muscle, like wintertime. Maybe something like that can work. Also, we need to make sure we act accordingly.

</details>

### Blocks and variety

#### PER-02

**Question (round 1).** How long is a block, and which small variables change between blocks?

**Final rule.** Exercises stay fixed for a block of 4 to 6 weeks. In the next block, change one or two small variables: grip, stance, implement, range of motion or rep range. Never all of them at once. Round 2 added how the tool shows such a change.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Exercises stay fixed for the block (4–6 weeks). Next block: change one or two of grip, stance, implement, range of motion or rep range. Never all at once.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** Splitting a 12-week plan into three exercise blocks of 4 weeks is the team's layout (PROPOSED).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.set_placement.block_rule`, `plan_types.fixed_12.exercise_blocks`
- **Changed later:**
  - **REFINED by [R2-LIB-01](library-details.md#r2-lib-01) (round 2).** Before: Change one or two small variables next block. Now: The tool may change one detail of a library exercise and show it as "Reverse lunge - dumbbell in opposite hand". It never invents an exercise.
- **See also:** [R2-LIB-01](library-details.md#r2-lib-01), [PER-03](#per-03), [CAT-12](library-details.md#cat-12)

#### PER-03

**Question (round 1).** The weekly A/B swap of the lead lift (squat-led / hinge-led week; bench / overhead week): default for all programs?

**Final rule.** The weekly A / B swap of the lead lift (a squat-led week then a hinge-led week; a bench week then an overhead week) is mostly in his strength and fat-loss plans. It can be used as week A and week B in other programs for people who want more variety. People who do not need the variety do not get it.

- **Status:** Stands as answered.
- **We assumed (round 1):** Seen in Fat Burn, Conjugate and 4 Tracks, but not in BYOP, where the days repeat exactly. Our guess: strength and fat-loss plans only.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "sometimes athletes and people want more variety, and that'll give them more variety" (PER-03)
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.fields.F44.fields.variety_ab`
- **See also:** [PER-02](#per-02), [PER-04](sessions-and-order.md#per-04)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, this is mostly in those, but also can be, in some way, week A and week B essentially in different programs. We just have to understand that sometimes athletes and people want more variety, and that'll give them more variety. If they don't really need a lot of variety, then they don't have it, but I want to make sure that it's understood. This is very complicated in my head, so I'm trying to get your help with it.

</details>

### Easy weeks, deloads and maintenance

#### PER-05

**Question (round 1).** What does a deload week change?

**Final rule.** A deload (an easy week) changes this: about half the sets, the same exercises, a lighter load or 3 or more reps in reserve, and no buy-out (his word for a short conditioning finisher) or other finisher. Round 2 fixed which week the half is taken from and where a deload may sit. Round 3 made it a recommendation.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** About half the sets, same exercises, lighter load or 3+ RIR, no buy-out or finisher (Baseball deload: 3 × 8, buy-out 'none').
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `plan_types.deload.dose`
- **Changed later:**
  - **REFINED by [R2-VOL-07](#r2-vol-07) (round 2).** Before: About half the sets. Now: Half of the hardest (last) week. Never in the middle of a block.
  - **REFINED by [R3-PER-01](#r3-per-01) (round 3).** Before: A deload week. Now: After a finished block the easy week is an extra week and only a recommendation.
- **See also:** [R2-VOL-07](#r2-vol-07), [R3-PER-01](#r3-per-01)

#### R2-VOL-07

**Question (round 2).** Deload is 'about half the sets'. Half of which week, and when does it happen?

**Final rule.** A deload is half of the hardest week, with the same exercises and 3 or more reps in reserve. Maintenance weeks go at the end of a block, or when the athlete or coach asks for a maintenance program. They are never thrown into the middle of a block. Whatever happens, the person manages the block and completes it. If they cannot complete it, they cancel the block and start a maintenance phase, and after maintenance they start a whole new block. The approved proposal also had a deload triggered by check-ins and a deload as week 1 of the next cycle. Round 3 removed check-ins and made the easy week an optional extra week between blocks.

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We proposed (round 2):** Half of the current (hardest) week, same exercises, 3+ reps in reserve. No fixed deload week inside a 12-week plan: it comes when check-ins say so (two hold weeks in a row, effort 9-10 two weeks, or pain on 2+ exercises), and week 1 of the next cycle is a deload.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "It should never be thrown in the middle of a block." / "If they can't complete it, they should cancel the block and start a maintenance phase" (R2-VOL-07)
- **Not confirmed by him:** Reading "block" here as the whole training plan (8 or 12 weeks), so that no easy week sits between the 4-week exercise blocks inside it, is INFERRED from [R2-PER-04](progression.md#r2-per-04) and [R3-PER-01](#r3-per-01) (12 + 1).
- **Where it lives:** `generator_spec_v1.json` → `plan_types.deload.when`, `validation_checks.V24_block_structure`
- **Changed later:**
  - **REVERSED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before (superseded): Approved proposal: a deload comes when check-ins say so (two hold weeks, effort 9-10 two weeks, pain on 2+ exercises). Now: No check-ins, so nothing triggers a deload. Stopping a block is the person's or coach's own call.
  - **REFINED by [R3-PER-01](#r3-per-01) (round 3).** Before: Approved proposal: week 1 of the next cycle is a deload. Now: The easy week sits between two blocks as an extra week (12 + 1), and it is a recommendation, not mandatory.
- **This answer changed:** [PER-05](#per-05) (refined)
- **See also:** [PER-05](#per-05), [R3-PER-01](#r3-per-01), [R2-PER-06](#r2-per-06), [PER-01](#per-01)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> No maintenance weeks are supposed to be at the end of a block, or if the athlete or coach demands a program of maintenance. It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it. If they can't complete it, they should cancel the block and start a maintenance phase, but then, when they're done with maintenance, they should start a whole new block.

</details>

#### R2-PER-06

**Question (round 2).** Is pre-season the same as the 4-6-week 'season change' maintenance block?

**Final rule.** Pre-season is the same thing as the 4-6-week "season change" maintenance block: 4 to 6 weeks at about 60 % of off-season sets, with more speed and power, ending with a 1-2-week taper (a short cut in volume) before the first game. Maintenance must always be modifiable. The person picks how many weeks. They can add weeks to keep going. Or it stops and asks three things: keep going on maintenance, change the plan, or start a block of training. Since round 3 nothing is stored, so those three choices are printed as next steps instead of popping up in an app.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: 4-6 weeks at about 60 % of off-season sets with more speed and power, ending with a 1-2-week taper before the first game.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "You should be able to pick how many weeks you're going to do with maintenance." (R2-PER-06)
- **Not confirmed by him:** Printing the three choices on the plan's last page, instead of an in-app prompt, is the team's design (PROPOSED). The split of the maintenance factor (0.5 for vacations, 0.6 for travel or a season change, 0.7 for planned maintenance) is PROPOSED inside his 50 to 70 %.
- **Where it lives:** `generator_spec_v1.json` → `plan_types.maintenance_4_6`, `plan_types.season.pre`, `inputs_schema.fields.F25d`
- **Changed later:**
  - **REFINED by [R3-PER-01](#r3-per-01) (round 3).** Before: At the end of maintenance "it just stops and says" three options. Now: "When the block ends, it just ends, and then you have to go back into the app and build whatever you want next."
- **This answer changed:** [PER-01](#per-01) (refined), [PER-08](#per-08) (refined)
- **See also:** [PER-01](#per-01), [PER-08](#per-08), [R2-VOL-07](#r2-vol-07), [R3-PER-01](#r3-per-01)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, but that should always be able to be modified. You should be able to pick how many weeks you're going to do with maintenance. When you're doing those weeks, you can add more weeks so that you can keep going on maintenance, or it just stops and says:
>
> - Do you want to keep going on maintenance?
> - Do you want to change your plan into a better program?
> - Do you want to change your plan into a block of training?
>
> Kind of thing.

</details>

#### R3-PER-01

**Question (round 3).** Three calendar details: the easy week between two blocks, holiday weeks, and when the plan offers to stop a block.

**Final rule.** Three calendar details. (1) After a finished block, the easy week at half the sets is an extra week, so the next block keeps all its weeks: 12 + 1 makes a 13-week quarter in the year plan. (2) Holiday and vacation weeks that the user marks are planned between blocks. If someone marks one after a block has started, that block ends there (stop, maintenance, then a new block) unless they remove the mark. (3) His words settle the rest: maintenance weeks are a recommendation, not mandatory. People can start one, or the block simply ends, and then they go back and build what they want next.

- **Status:** Stands as answered.
- **We proposed (round 3):** (1) After a finished block, the easy week at half the sets is an extra week, so the next block keeps all its weeks (12 + 1 = a 13-week quarter in the year plan). (2) Holiday and vacation weeks the user marks are planned between blocks; if someone marks one after a block has started, that block ends there (stop, maintenance, then a new block) unless they remove the mark. (3) With check-ins, the plan only offers 'stop this block' (it never forces it) after 2 hold weeks in a row, 2 weeks of effort 9-10, 2 weeks under half the sessions, or pain on 2+ exercises in a week.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "maintenance weeks are a recommendation. They don't have to be mandatory" / "when the block ends, it just ends, and then you have to go back into the app and build whatever you want next" (R3-PER-01)
- **Not confirmed by him:** The third part of the proposal described when a check-in would offer to stop a block. With no check-ins that part is void. Two details are PROPOSED: when someone switches off a recommended easy week in the year plan, the next block starts a week earlier; and because nothing is stored, the tool asks how many blocks were completed in a row when the next block is built.
- **Where it lives:** `generator_spec_v1.json` → `plan_types.deload.when`, `plan_editing.stopping_and_next_block`, `plan_types.year.v1_2_note`
- **This answer changed:** [PER-01](#per-01) (refined), [PER-05](#per-05) (refined), [R2-VOL-07](#r2-vol-07) (refined), [R2-PER-01](#r2-per-01) (refined), [R2-PER-02](#r2-per-02) (refined), [R2-PER-06](#r2-per-06) (refined)
- **See also:** [R2-VOL-07](#r2-vol-07), [PER-05](#per-05), [R2-PER-01](#r2-per-01), [R2-PER-02](#r2-per-02), [R2-PER-06](#r2-per-06), [R3-GEN-01](legal-and-open-source.md#r3-gen-01)

<details>
<summary>His full answer, round 3 (from <code>coach_answers_round3.md</code>)</summary>

> Yeah, maintenance weeks are a recommendation. They don't have to be mandatory, so people can go ahead and start one, or when the block ends, it just ends, and then you have to go back into the app and build whatever you want next.

</details>

### The year

#### R2-PER-01

**Question (round 2).** Your yearly plan, as we understood it. Right?

**Final rule.** The yearly plan, approved. January to March: hard work with more cardio, start cutting (sets stay at the starting level). April to June: summer shape, keep losing fat while building a little muscle. July to September: maintain at about 70 % of the volume. October to mid-December: build muscle, less cardio. Last 2 weeks of December: maintenance. This plan is for the general population that wants to stay in shape and wants to see how the year works, so they can adjust their nutrition and lifestyle. Round 3 changed "automatic" maintenance into a recommendation.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Jan-Mar: hard work + more cardio, start cutting (sets stay at the starting level). Apr-Jun: summer shape, keep losing fat while building a little muscle. Jul-Sep: maintain at about 70 % of the volume. Oct to mid-Dec: build muscle, less cardio. Last 2 weeks of December: automatic maintenance.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "This is for gen pop and general staying healthy and in shape type of life." (R2-PER-01)
- **Not confirmed by him:** In the cut quarter the sets stay at the starting level, while round 3 says the stairway always climbs. The team keeps the sets flat and lets cardio, density, load and effort climb. That reading is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `plan_types.year.quarters`, `plan_types.year.who`
- **Changed later:**
  - **REFINED by [R2-PER-02](#r2-per-02) (round 2).** Before: Fixed quarters. Now: The year follows the user's own calendar and can be re-ordered and tuned.
  - **REFINED by [R3-PER-01](#r3-per-01) (round 3).** Before: Last 2 weeks of December: automatic maintenance. Now: Maintenance weeks are a recommendation. The December maintenance is printed by default and the person can remove or move it (the team's reading, PROPOSED).
- **This answer changed:** [PER-01](#per-01) (refined)
- **See also:** [PER-01](#per-01), [R2-PER-02](#r2-per-02), [R3-PER-01](#r3-per-01)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> This is correct, but this is for the general population that wants to just stay in shape and wants to have some type of planning for how the year works (because they can just understand easier how to adjust their nutrition and their lifestyles and all of that). This is for gen pop and general staying healthy and in shape type of life.

</details>

#### R2-PER-02

**Question (round 2).** Should the year follow the user's own calendar?

**Final rule.** The year follows the user's own calendar: their hemisphere for summer, and their own vacation and holiday weeks (Christmas, Semana Santa, Thanksgiving ...). Athletes follow their season instead. People can set the year up however they want: switch the blocks around, add or change something, ask for more or less cardio. Someone may want a deep winter with the cardio taken away and a powerlifting style. They are tuning it to their needs. Round 3 added that marked holiday weeks are planned between blocks.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: use the user's hemisphere for summer and let them mark their own vacation and holiday weeks (Christmas, Semana Santa, Thanksgiving...), which switch to maintenance automatically. Athletes follow their season instead.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "They can set it up however they want, and they can adjust their year as well." (R2-PER-02)
- **Where it lives:** `generator_spec_v1.json` → `plan_types.year.calendar`, `plan_types.year.tunable`
- **Changed later:**
  - **REFINED by [R3-PER-01](#r3-per-01) (round 3).** Before: Marked holiday weeks switch to maintenance automatically. Now: Holiday weeks are planned between blocks. A week marked after a block has started ends that block, unless the mark is removed. Maintenance is a recommendation.
- **This answer changed:** [R2-PER-01](#r2-per-01) (refined)
- **See also:** [R2-PER-01](#r2-per-01), [R3-PER-01](#r3-per-01), [R2-SES-06](sessions-and-order.md#r2-ses-06)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, that's correct. They can set it up however they want, and they can adjust their year as well. They can just switch it around if they don't like the blocks the way they're set up, or if they want to add something, change something, or change the variety (more cardio, less cardio). They can tune it up if they want to tune it up a little bit better for themselves, how they like it.
>
> Somebody might want to go into deep winter, so really just take away ball cardio and just ramp it up to powerlifting style. They can do that. They're just tuning it, equalizing it to their needs. This is, again, for an option to be able to modify for gen-pop.

</details>

### Seasons and competition prep

#### PER-08

**Question (round 1).** Athletes through the season: what changes in off, pre, in and post season?

**Final rule.** Athletes through the season. Off-season: the most volume, strength and plyos. Pre-season: more speed and power, less volume. In season: 2 days a week, low volume. Post-season: recovery and general work. What the in-season work is depends on the athlete: sprints for speed athletes, maintenance of strength for others, high jumps for some.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Off-season: most volume, strength + plyos. Pre-season: more speed/power, less volume. In-season: 2 days/week, low volume, sprint buy-outs. Post-season: recovery and general work.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "for speed athletes, it'll be sprints on the on-season, but for other athletes, it might be just maintenance of strength" (PER-08)
- **Where it lives:** `generator_spec_v1.json` → `plan_types.season`
- **Changed later:**
  - **REFINED by [R2-PER-06](#r2-per-06) (round 2).** Before: Pre-season: more speed and power, less volume. Now: Pre-season = 4 to 6 weeks at about 60 % of off-season sets, ending with a 1-2-week taper.
  - **REFINED by [R2-ATH-07](athletes-and-sports.md#r2-ath-07) (round 2).** Before: In season: low volume. Now: Game-heavy sports: gym plyos at about half, no extra change-of-direction work, hard day 48 h before a game.
  - **REFINED by [R2-GEN-05](product-and-generator.md#r2-gen-05) (round 2).** Before: Season phases. Now: The form asks the season start date and the practice and game days; the tool works out the phase.
- **See also:** [UNI-10](bilateral-unilateral.md#uni-10), [R2-PER-06](#r2-per-06), [R2-ATH-07](athletes-and-sports.md#r2-ath-07), [R2-GEN-05](product-and-generator.md#r2-gen-05), [PER-11](#per-11)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, for speed athletes, it'll be sprints on the on-season, but for other athletes, it might be just maintenance of strength. For some athletes, it might be high jumps. It can be different things.

</details>

#### PER-11

**Question (round 1).** Baseball VOL 1 / VOL 2 / VOL 3 (compound 12–15 / 8–12 / 6–8 reps): a phase per block for all athletes?

**Final rule.** The baseball labels VOL 1, VOL 2 and VOL 3 are rep phases for compound lifts: 12-15, 8-12 and 6-8 reps. Every athlete uses them, one phase per block: VOL 1 early off-season, VOL 2 mid, VOL 3 late off-season and pre-season.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. VOL 1 early off-season, VOL 2 mid, VOL 3 late off-season / pre-season.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.reps.athlete_phases`
- **See also:** [PER-08](#per-08), [VOL-11](volume.md#vol-11)

#### PER-10

**Question (round 1).** When do you use smooth weekly increases vs 2-week steps and waves (like the Boxing build-up)?

**Final rule.** Smooth weekly increases are for hypertrophy and general clients. 2-week steps and waves, like his boxing build-up, are for fight or competition prep.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Smooth increases for hypertrophy and general clients, steps and waves for fight or competition prep.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** [R2-PER-03](progression.md#r2-per-03) says the stairway "goes for every plan". PER-10 was not withdrawn, so fight and competition prep keeps its 2-week steps. That reading is INFERRED.
- **Where it lives:** `generator_spec_v1.json` → `plan_types.prep`
- **Changed later:**
  - **REFINED by [R2-PER-03](progression.md#r2-per-03) (round 2).** Before: Smooth weekly increases. Now: Named and shaped as the stairway that every plan follows.
  - **REFINED by [R3-ATH-05](athletes-and-sports.md#r3-ath-05) (round 3).** Before: Prep for fights and competitions. Now: General-population events get a simple rule: the hardest weeks end 1 week before the event, then 1 easy week.
- **See also:** [ATH-04](athletes-and-sports.md#ath-04), [R2-PER-03](progression.md#r2-per-03), [R3-ATH-05](athletes-and-sports.md#r3-ath-05)

#### PRG-04

**Question (round 1).** Athletic 'STARTING / MID / ADVANCED OFF SEASON': three back-to-back 8-week blocks, or three athlete levels?

**Final rule.** The athletic labels STARTING / MID / ADVANCED OFF SEASON can be three back-to-back blocks of one off-season or three athlete levels. "Depends on whatever is needed."

- **Status:** Stands as answered.
- **We assumed (round 1):** Back-to-back blocks of one off-season.
- **His verdict (round 1):** PARTLY
- **In his words:** "Depends on whatever is needed." (PRG-04)
- **Where it lives:** `generator_spec_v1.json` → `plan_types.season.starting_mid_advanced`
- **See also:** [PER-08](#per-08), [PRG-05](levels-and-zones.md#prg-05)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Depends on whatever is needed.

</details>

### Endurance plan

#### PRG-12

**Question (round 1).** Half marathon (Chris Hinshaw plan): used as-is? Any other endurance plans?

**Final rule.** The half-marathon plan (Chris Hinshaw) is used as it is, for the half marathon only. He named no other endurance plan. Round 2 confirmed it stays the longest run in the model.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Used as-is for half marathon only.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.conditioning.endurance_plan`
- **Changed later:**
  - **REFINED by [R2-LIB-06](testing.md#r2-lib-06) (round 2).** Before: Used as-is for the half marathon only. Now: The 21.6-mile run is removed, so the half-marathon plan stays the longest run.
- **See also:** [R2-LIB-06](testing.md#r2-lib-06), [LIB-18](testing.md#lib-18)

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [R2-PER-03](progression.md#r2-per-03) | [progression](progression.md) | Every plan is a stairway. |
| [R2-PER-04](progression.md#r2-per-04) | [progression](progression.md) | 12 weeks: the last 4 are the hardest. |
| [R2-PER-05](progression.md#r2-per-05) | [progression](progression.md) | Start at a 2, end at an 11. |
| [R3-VOL-04](progression.md#r3-vol-04) | [progression](progression.md) | The stairway in numbers. |
| [R2-VOL-06](volume.md#r2-vol-06) | [volume](volume.md) | The next block starts 5 % higher. |
| [R2-GEN-01](progression.md#r2-gen-01) | [progression](progression.md) | The week-by-week plan needed the check-in. |
| [PER-07](testing.md#per-07) | [testing](testing.md) | Tests are picked at the start of a block. |
| [R2-PER-07](testing.md#r2-per-07) | [testing](testing.md) | Test before and at the end, never during. |
| [R2-ATH-07](athletes-and-sports.md#r2-ath-07) | [athletes-and-sports](athletes-and-sports.md) | In-season rule for game-heavy sports. |
| [R2-GEN-05](product-and-generator.md#r2-gen-05) | [product-and-generator](product-and-generator.md) | The form asks for season dates. |
| [R3-ATH-05](athletes-and-sports.md#r3-ath-05) | [athletes-and-sports](athletes-and-sports.md) | Optional event date for stay-active people. |
| [R3-ATH-01](athletes-and-sports.md#r3-ath-01) | [athletes-and-sports](athletes-and-sports.md) | Swimmers: a 2-week dryland taper. |
| [R2-LIB-01](library-details.md#r2-lib-01) | [library-details](library-details.md) | One-detail variations between blocks. |
| [UNI-10](bilateral-unilateral.md#uni-10) | [bilateral-unilateral](bilateral-unilateral.md) | In season, bilateral work stays minimal. |
