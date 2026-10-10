# Coach answers: Testing

What gets tested and when. Testing is optional. The person or the coach picks what to test at the start of a block. Tests happen before the block, or at its beginning, and at the end. Never during the block. Nobody goes from not training to a one-rep max or an all-out mile: they test a 5-rep or 3-rep max and efforts at 80 to 90 %.

This page is part of [the coach answers by topic](index.md). It holds 5 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: testing](../02-model/testing.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Testing is the athlete's or coach's choice. They tick what to test when the block starts. "No need for testing" is fine. | [PER-07](#per-07) | CONFIRMED |
| 2 | Test before the block (or at its beginning) and at the end. Do not test during the block. | [R2-PER-07](#r2-per-07) | CONFIRMED |
| 3 | Never go from not training to a one-rep max test or an all-out mile. Start with a 5-rep or 3-rep max; test at 80 to 90 %, not 100 %. | [R2-PER-07](#r2-per-07) | CONFIRMED |
| 4 | The menu: strength, cardio (1-mile run or an erg time trial), speed and agility (10-30 m sprint, 5-10-5, L-test), jumps, body weight. | [R2-PER-07](#r2-per-07) | CONFIRMED |
| 5 | 'LEFT TEST' is the L-test. '5/10/05' is the 5-10-5 pro agility drill. | [LIB-01](#lib-01) | CONFIRMED |
| 6 | The '21.6 mile run' is removed from plans and tests. | [R2-LIB-06](#r2-lib-06) | CONFIRMED |
| 7 | How much the rest of a test week is reduced, and showing test weeks as printed marks and calendar alarms instead of the reminders he approved in round 2. | [R2-PER-07](#r2-per-07) | PROPOSED |

## Why, in his words

- "they should not test during the weeks, during the block" ([R2-PER-07](#r2-per-07))
- "you should not go from not training to a one-rep max test" ([R2-PER-07](#r2-per-07))
- "'No need for testing' is fine too." ([PER-07](#per-07))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| The testing rule and when tests happen | `generator_spec_v1.json` | `tests.when` |
| Never from zero | `generator_spec_v1.json` | `tests.never_from_zero` |
| The test menu | `generator_spec_v1.json` | `tests.catalogue` |
| Tests that are not offered | `generator_spec_v1.json` | `tests.excluded` |
| How reminders are shown | `generator_spec_v1.json` | `tests.reminders_how` |
| The test question on the intake form | `generator_spec_v1.json` | `inputs_schema.fields.F26b` |
| The check on test timing | `generator_spec_v1.json` | `validation_checks.V25_tests` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [PER-07](#per-07) | 1 | RIGHT | Tests are optional; picked at block start; the plan says when the test day is. | Stands, refined |
| [R2-PER-07](#r2-per-07) | 2 | RIGHT | Test before (or at the start) and at the end, never during the block; never from zero to a 1RM: 5RM or 3RM, 80-90 % efforts. | Stands, refined |
| [LIB-01](#lib-01) | 1 | RIGHT | 'LEFT TEST' = L-test; '5/10/05' = 5-10-5 pro agility drill. | Stands |
| [LIB-18](#lib-18) | 1 | answered in words (no chip) | Superseded: the '21.6 mile run' (his "marathon") was removed by R2-LIB-06. | Superseded |
| [R2-LIB-06](#r2-lib-06) | 2 | RIGHT | The '21.6 mile run' is removed; the half-marathon plan stays the longest run. | Stands |

## What he said in conversation

He made no statement on this topic outside the questionnaires.

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### When and what to test

#### PER-07

**Question (round 1).** What do you test, and when?

**Final rule.** What to test is up to the athlete or the coach. At the start of a block the tool asks what they want to test at the end: strength, cardio, speed, a specific number. At the end the plan tells them it is time for the test and on which day. If they do not need to test anything, they pick nothing: "No need for testing" is fine. Round 2 added a test at the start and the rule never to test from zero.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Week 8 / end of block: rep max or 1RM on the main lifts, mile/speed tests from the CARDIO list, jumps and sprints for athletes. Tell us which.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "It's up to the athlete or the coach what they're going to be testing" / "'No need for testing' is fine too." (PER-07)
- **Where it lives:** `generator_spec_v1.json` → `tests.rule`, `inputs_schema.fields.F26b`
- **Changed later:**
  - **REFINED by [R2-PER-07](#r2-per-07) (round 2).** Before: Test at the end of the block. Now: Test before the block (or at its beginning) and at the end; never during the block; never from zero to a 1-rep max.
  - **REFINED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before: The plan tells them "it's time for your test". Now: Nothing is stored, so the team dropped notifications and marks the test weeks in the plan itself (INFERRED: he did not speak about reminders).
- **See also:** [R2-PER-07](#r2-per-07), [R2-GEN-06](product-and-generator.md#r2-gen-06)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Correct. It's up to the athlete or the coach what they're going to be testing, but ideally, throughout their programming, they're going to be focused on some things. Maybe at the beginning, they could say, "What do you want to test at the end of this block? Is there any specific number you want to test at the end of this block? Your strength, your cardio, your speed?" and then they can check those boxes at the beginning so that, at the end of the block, it tells them, "All right, it's time for your test. Get ready. This test is going to be this day. Just make sure you understand that and all of that." And if they don't need to test anything, then they don't have to pick that also. "No need for testing" is fine too.

</details>

#### R2-PER-07

**Question (round 2).** Testing: is this the menu and timing?

**Final rule.** The menu, ticked at the start of a block: strength (beginners a 5-8 rep max; intermediate and up a 3-rep max or a work-up to a 1-rep max), cardio (1-mile run or an erg time trial), speed and agility (10-30 m sprint, 5-10-5, L-test), jumps, and body weight. People test before they start the block, or at the beginning, and at the end. They do not test during the weeks of the block. Someone who has not finished a block of training must never test a one-rep max from zero. A 5-rep max or a 3-rep max is safer. The same goes for a one-mile speed test. They test at 80 or 90 %, not at 100 %.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Ticked at block start: strength (beginners a 5-8 rep max; intermediate and up a 3-rep max or work up to a 1-rep max), cardio (1-mile run or an erg time trial), speed and agility (10-30 m sprint, 5-10-5, L-test), jumps, body weight. Tested in the last week instead of that week's top sets. Reminders at block start, 7 days before and the day before.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "they should not test during the weeks, during the block" / "you should not go from not training to a one-rep max test" / "They should try to test at 80%, 90%, but not at 100%." (R2-PER-07)
- **Not confirmed by him:** Cutting the rest of a test week to about 50 to 70 % of its sets, and offering the test dates as alarms in a downloadable calendar file, are PROPOSED. The approved proposal also had reminders (at block start, 7 days before and the day before). The team dropped them as notifications because nothing is stored ([R3-GEN-01](legal-and-open-source.md#r3-gen-01)) and he does not want people checking back on their phone ([R3-VOL-04](progression.md#r3-vol-04)). He did not speak about reminders himself, so that is INFERRED.
- **Where it lives:** `generator_spec_v1.json` → `tests.when`, `tests.never_from_zero`, `tests.catalogue`
- **Changed later:**
  - **REFINED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before: Reminders at block start, 7 days before and the day before. Now: No data is kept, so the team dropped the notifications and prints the test weeks in the plan (INFERRED: he did not speak about reminders).
- **This answer changed:** [PER-07](#per-07) (refined)
- **See also:** [PER-07](#per-07), [LIB-01](#lib-01), [R2-LIB-06](#r2-lib-06)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Ideally, that's correct. You should be able to test before and then test at the end. We should be giving value to people, and they should not test during the weeks, during the block. They should test before they start their block, or at the beginning, and at the end.
>
> The problem might be that some people are going to want to test their one-rep maxes at the beginning of a block, and they're not ready for it. If they haven't finished a block of training to be able to test that, then they should never start from zero testing their maxes. They can start from zero if they're starting from zero at a 5-rep max. That way, it's safer, or a 3-rep max. That way, it's safer, but you should not go from not training to a one-rep max test. That should never be like that, or a one-mile run speed test. Things like that. They should try to test at 80%, 90%, but not at 100%.

</details>

### Test names and removed tests

#### LIB-01

**Question (round 1).** 'LEFT TEST' = the L-test (3-cone)? And '5/10/05' = the 5-10-5 pro agility drill? (Sheets turned it into a date.)

**Final rule.** 'LEFT TEST' in his sheet is the L-test (3-cone). '5/10/05' is the 5-10-5 pro agility drill; the sheet had turned it into a date.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes to both.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `tests.catalogue.speed_agility`, `rule_tables.library_decisions.renames`
- **See also:** [R2-PER-07](#r2-per-07), [FIX-04](library-details.md#fix-04)

#### LIB-18

**Question (round 1).** '21.6 mile run': what is it? The DISTANCE TEST block is listed twice.

**Final rule.** Superseded. In round 1 he said the '21.6 mile run' was a marathon and that he did not know when or where it was needed. A marathon is 26.2 miles. Round 2 removed the item from plans and tests.

- **Status:** SUPERSEDED. A later answer replaced this one (see "Changed later").
- **We assumed (round 1):** Not known.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "thats a marathon, dont know when/where we need that" (LIB-18)
- **Note:** The question also noted that the DISTANCE TEST block is listed twice in the sheet. He did not comment on that.
- **Where it lives:** `generator_spec_v1.json` → `tests.excluded`
- **Changed later:**
  - **REVERSED by [R2-LIB-06](#r2-lib-06) (round 2).** Before (superseded): "thats a marathon, dont know when/where we need that" Now: Removed from plans and tests. The longest run stays the half-marathon plan.
- **See also:** [R2-LIB-06](#r2-lib-06), [PRG-12](plans-and-calendar.md#prg-12)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> thats a marathon, dont know when/where we need that

</details>

#### R2-LIB-06

**Question (round 2).** The '21.6 mile run' you called a marathon (a marathon is 26.2 miles): change it, keep it, or remove it?

**Final rule.** The '21.6 mile run' is removed from plans and tests. The longest run in the model stays the half-marathon plan (Chris Hinshaw), which he uses as it is.

- **Status:** Stands as answered.
- **We proposed (round 2):** Remove it from plans and tests. The longest run stays the half-marathon plan (Chris Hinshaw), which you use as-is.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `tests.excluded`, `rule_tables.conditioning.endurance_plan.longest_run`
- **This answer changed:** [LIB-18](#lib-18) (reversed), [PRG-12](plans-and-calendar.md#prg-12) (refined)
- **See also:** [LIB-18](#lib-18), [PRG-12](plans-and-calendar.md#prg-12)

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [R2-GEN-06](product-and-generator.md#r2-gen-06) | [product-and-generator](product-and-generator.md) | Percentages only for lifts with a recent tested best. |
| [R2-ATH-05](athletes-and-sports.md#r2-ath-05) | [athletes-and-sports](athletes-and-sports.md) | An Olympic-lift percentage comes from that lift's own best. |
| [EQ-14](equipment.md#eq-14) | [equipment](equipment.md) | Tests can run on any cardio tool. |
| [PRG-08](library-details.md#prg-08) | [library-details](library-details.md) | SCORE = times, rounds or distances. |
| [PRG-12](plans-and-calendar.md#prg-12) | [plans-and-calendar](plans-and-calendar.md) | The half-marathon plan is the longest run. |
| [FIX-02](library-details.md#fix-02) | [library-details](library-details.md) | Cardio menus extended with distance and calories. |
