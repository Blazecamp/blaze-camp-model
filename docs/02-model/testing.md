# Testing: before the block and at the end

Testing is optional in the Blaze Camp model. At the start of a block the athlete or the coach ticks what they want to test: strength, cardio, speed and agility, jumps or body weight. Tests happen before the block, or in its first week, and again in its last week. They never happen in between. Nobody tests a true maximum from zero: a person who has not finished a block of training tests a 5-rep or 3-rep max and runs at 80 to 90 % effort. The plan prints the test weeks and the reminders. It stores no results.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`PER-07`) are round 1, `R2-` is round 2, `R3-` is round 3. The newest round wins. **PROPOSED** means the team designed it and he has not confirmed it. **OBSERVED** means it was read from his sheets. His full answers by topic: [../03-coach-answers/testing.md](../03-coach-answers/testing.md). **Since model v1.3** there are newer answers too: round 4 (`R4-`, `coach_answers_round4.md`) and two clarifications of 2026-10-10 (`CT-01` on session time, `CX-01..04` on progression and editing). They win on their subjects.

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | **Testing is a choice.** The athlete or coach decides what to test. "No need for testing" is a valid answer. | PER-07 |
| 2 | The choice is made **by checkbox at the start of a block**: strength, cardio, speed and agility, jumps, body weight. | PER-07, R2-PER-07 |
| 3 | **Test before the block (or at its beginning) and at the end. Never during the block.** | R2-PER-07 |
| 4 | **Never from zero.** Someone who has not finished a block of training does not test a 1-rep max or an all-out mile. They test a 5-rep or 3-rep max, and at 80 to 90 % effort. | R2-PER-07 |
| 5 | The end test **replaces that week's top sets**. | R2-PER-07 |
| 6 | **Reminders** at the block start, 7 days before the test and the day before. | PER-07, R2-PER-07 |
| 7 | The '21.6 mile run' is **removed** from plans and tests. | R2-LIB-06 |
| 8 | Aerobic tests can run on **any cardio machine**, tracked by distance, calories or time. | EQ-14 |
| 9 | Results belong to the person. **Nothing is stored.** | R3-GEN-01 |

## Why

**Why testing is optional and picked up front.** He wants people to decide at the start what the block is for:

> "It's up to the athlete or the coach what they're going to be testing, but ideally, throughout their programming, they're going to be focused on some things." (PER-07)

The plan can then tell them when the day comes. In his words: "All right, it's time for your test. Get ready." (PER-07)

**Why only at the start and the end.**

> "You should be able to test before and then test at the end. We should be giving value to people, and they should not test during the weeks, during the block." (R2-PER-07)

**Why never from zero.** It is a safety rule:

> "If they haven't finished a block of training to be able to test that, then they should never start from zero testing their maxes. They can start from zero if they're starting from zero at a 5-rep max. That way, it's safer, or a 3-rep max." (R2-PER-07)

> "you should not go from not training to a one-rep max test. That should never be like that, or a one-mile run speed test." (R2-PER-07)

> "They should try to test at 80%, 90%, but not at 100%." (R2-PER-07)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). The fuller file is [`synthesis/06_periodization.json`](../../synthesis/06_periodization.json). `model/rules.json` and `model/catalog.json` are compiled copies. They are rebuilt by tools, so check the sources first when they differ.

| What | File | JSON key |
|---|---|---|
| The testing rules | `generator_spec_v1.json` | `tests` (`rule`, `when`, `never_from_zero`, `catalogue`, `excluded`) |
| Test weeks by plan type | `generator_spec_v1.json` | `tests.timing_by_mode` |
| Reminders and how they are delivered | `generator_spec_v1.json` | `tests.reminders`, `tests.reminders_how` |
| The checkbox question on the form | `generator_spec_v1.json` | `inputs_schema.fields.F26b` (`options`, `untrained_rule`, `one_rm_gate`) |
| Where the test week falls in a plan | `generator_spec_v1.json` | `derived_values.D13_test_week`; `plan_types.fixed_12.tests`, `plan_types.fixed_8.tests`, `plan_types.year.tests` |
| The check every plan must pass | `generator_spec_v1.json` | `validation_checks.V25_tests` |
| When a tested best turns into percentages | `generator_spec_v1.json` | `output.weight_guidance` |
| The rule with his words, safety notes and placement | `synthesis/06_periodization.json` | `testing` (`rule`, `coach_words`, `safety`, `catalogue`, `placement`, `reminders`) |
| Suggested tests for each sport | `synthesis/04_profiles.json` | `profiles[].tests` |
| The test items in the exercise library | `model/catalog.json` | `exercises[]` where `kind` is `"test"` |
| Compiled copy | `model/rules.json` | `tests` |

---

## In detail

### 1. The menu

**Rule.** The form shows one question: "What do you want to test? (before you start and at the end)". The person ticks any of five boxes, or "No need for testing". The default is no testing.

He approved the menu in R2-PER-07. The exact doses, and the default of no testing, are **PROPOSED**.

| Checkbox | What is tested | If the person has not finished a block | Status |
|---|---|---|---|
| **Strength** | Beginners: a 5 to 8 rep max. Intermediate and up: a 3-rep max, or work up to a 1-rep max. | a 5-rep or 3-rep max. Never a 1-rep max. | Coach: R2-PER-07 |
| **Cardio** | a 1-mile run, or a time trial on a cardio machine | the same test at 80 to 90 % effort. Never an all-out mile. | Coach: R2-PER-07, EQ-14 |
| **Speed and agility** | a 10 to 30 metre sprint, the 5-10-5, the L-test | at 80 to 90 % effort | Coach: R2-PER-07, LIB-01 |
| **Jumps** | a jump test | as written | Coach: R2-PER-07. Which jump (countermovement or broad jump) is **PROPOSED**. |
| **Body weight** | body weight | | Coach: R2-PER-07. Optional photos or measurements are **PROPOSED**. |
| **No need for testing** | nothing | | Coach: PER-07 |

The words:

- A *rep max* is the heaviest weight you can lift for that many clean reps. A 5-rep max (5RM) is the most you can lift five times.
- The *5-10-5* is the pro agility shuttle. His sheet wrote it '5/10/05' and the spreadsheet turned it into a date (LIB-01).
- The *L-test* is the 3-cone drill. His sheet calls it 'LEFT TEST' (LIB-01).
- A *time trial* is a fixed distance, time or calorie target done as a test.

A rep max can be turned into an estimated 1-rep max with a standard formula (the Epley formula). The model uses that estimate, so most people never need to lift a true single. This is **PROPOSED**; the supporting research is in section 7.

### 2. Never from zero

**Rule.** "From zero" means the person has not finished a block of training. For them every test is below maximum.

| Test | From zero | After a finished block |
|---|---|---|
| Strength | 5-rep max or 3-rep max (beginners 5 to 8 reps) | intermediate and up may take a 3-rep max or work up to a 1-rep max |
| Cardio | 80 to 90 % effort: a hard but controlled mile | a timed mile or a time trial |
| Speed and agility | 80 to 90 % effort | full effort |

The numbers 5-rep max, 3-rep max and 80 to 90 % are his (R2-PER-07). These details are **PROPOSED**:

- Who counts as "from zero": new users, beginners (client level L1), and anyone back after six months or more off.
- A 1-rep max is offered only to intermediate and advanced lifters (L2, L3), and only at the end of a finished block, or at the start if they tap "I just finished a training block".
- People over 60 test below maximum only.
- Professional athletes do not test a true 1-rep max.

### 3. When the tests happen

**Rule.** Two test points per block: one before it or in week 1, one in the last week.

| Plan | Baseline test | End test | Status |
|---|---|---|---|
| 12-week block | before the block or in week 1 | week 12 | Coach: R2-PER-07 |
| 8-week block | before the block or in week 1 | week 8 | Coach: R2-PER-07 |
| Maintenance plan | none, unless ticked | none, unless ticked | **PROPOSED** |
| Yearly plan | week 1 | the last week of each training block (weeks 12, 25 and 50 in the proposed layout) | **PROPOSED** layout |
| Athletes | the start of each off-season block | the end of each off-season block | **PROPOSED** |

The end test of one block can serve as the baseline of the next one (**PROPOSED**).

Week 1 is the lightest week of the stairway, the one that should feel like a 2. That is why the baseline can sit there. See [stairway.md](stairway.md).

### 4. The test week

| Parameter | Value | Status |
|---|---|---|
| What the test replaces | that week's top sets | Coach: R2-PER-07. Replacing only the top sets of the lifts being tested is **PROPOSED**. |
| The rest of the test week | open. One file proposes 50 to 70 % of that week's sets. The engine currently keeps the week as planned, so the last week stays the hardest. | both **PROPOSED** |
| Spacing | a strength test 48 to 72 hours after the last hard lower-body session | **PROPOSED** |
| The exercise being tested | stays the same exercise through the block, so start and end can be compared | **PROPOSED** |

### 5. Reminders

**Rule.** The plan reminds the person three times: when the block starts, 7 days before the test, and the day before. He approved this timing (R2-PER-07).

How the reminder reaches the person changed in round 3. He wants no data kept (R3-GEN-01), so the tool cannot send notifications later. Instead:

- the test weeks are marked in the plan, with a "get ready" line in the week before;
- the downloaded calendar file carries the three alarms;
- a screenshot or PDF of the block shows the test weeks.

This way of delivering them is **PROPOSED**.

### 6. What happens with the results

**Rule.** The results are the person's own. The tool does not keep them.

| Topic | Rule | Decided by |
|---|---|---|
| Where results are written | in the person's own log. His sheet has a 'WEIGHT USED or SCORE' column; SCORE is for times, rounds and distances. | PRG-08, GEN-03 |
| Percentages in the plan | only when the person enters a recent tested best. The approved proposal named barbell main lifts and Olympic lifts; his added words (next rows) take Olympic lifts off percentages by default. | R2-GEN-06 |
| No tested best | the plan uses reps in reserve: "if they haven't tested their Olympic lifts, 1-rep maxes, or anything like that, then they should pick an RPE or reps in reserve." | R2-GEN-06 |
| Olympic lifts | explained as power output. No percentage by default: they "don't necessarily need to go by percentage unless you're a competitive Olympic lifter". | R2-GEN-06. Showing no percentage by default is a **PROPOSED** reading: his own ramp is written in percentages (75 to 90 %, PER-09), taken from that lift's own 1-rep max (R2-ATH-05). |
| A percentage on an Olympic lift | only when a coach switches it on and that exact lift was tested | **PROPOSED** |
| Carrying a result into the next block | the person types it in again when they build the next block | **PROPOSED** |

### 7. Test items in his library

| Item | Status | Decided by |
|---|---|---|
| L-test ('LEFT TEST'), 5-10-5 ('5/10/05') | in the library | LIB-01 |
| Cardio 'DISTANCE TEST' and 'SPEED TEST' lists | in the library | OBSERVED |
| 'Work up to 1RM' (level 5 of his CrossFit strength table) | in the library; gated by the never-from-zero rule | OBSERVED, R2-PER-07 |
| '21.6 mile run' | removed from plans and tests | R2-LIB-06 |
| Distance tests of 14, 17 and 20 miles | in his list, but not offered by default | **PROPOSED** |
| Aerobic tests on a bike, rower or ski machine | allowed; track distance, calories or time | EQ-14 |

On the long run he said: "thats a marathon, dont know when/where we need that" (LIB-18). A marathon is 26.2 miles, so the team proposed removing the item and he agreed (R2-LIB-06). The longest run in the model stays the half-marathon plan he uses as-is (PRG-12).

On tracking units he added: "I wouldn't completely throw away distance." (EQ-14)

**SCIENCE** (does not overrule his answers): a 5-rep max predicts the 1-rep max well (Reynolds 2006). This supports testing beginners with rep maxes. References: `synthesis/06_periodization.json > science`.

---

## Retired: do not rebuild

| Retired idea | Replaced by | Retired by |
|---|---|---|
| A test or deload week in the middle of a plan | tests only at the start and the end | PER-01, R2-PER-07 |
| Tests only in the last week | a baseline before the block (or week 1) and an end test | R2-PER-07 |
| A 1-rep max or an all-out mile for someone who has not been training | a 5-rep or 3-rep max; 80 to 90 % effort | R2-PER-07 |
| The '21.6 mile run' | removed | R2-LIB-06 |
| Reminders as stored notifications; a saved test history | printed lines and calendar alarms; nothing stored | R3-GEN-01 |
| Test results feeding an automatic change of the plan | the person adjusts the plan | R3-VOL-02, R3-VOL-04 |

## Still PROPOSED

Waiting for his yes or no:

- The exact doses of each test, and which jump test.
- Who counts as "from zero" beyond his words (L1, back after six months off).
- The one-tap gate for a 1-rep max ("I just finished a training block").
- Below-maximum tests only for people over 60; no true 1-rep max for professionals.
- What the rest of the test week looks like.
- The 48 to 72 hour spacing before a strength test.
- Printed reminders plus calendar alarms as the way to deliver them.
- The long distance test items (14, 17 and 20 miles).
- How a tested best is entered at the next build.
- No percentage on Olympic lifts by default, and the coach switch that turns it on.
- "No need for testing" as the default answer.
- Test weeks of the yearly plan.

## Related pages

- [plans-and-calendar.md](plans-and-calendar.md): where blocks start and end.
- [stairway.md](stairway.md): why week 1 is light and the last week is the hardest.
- [sessions.md](sessions.md): how a session is ordered.
- [athletes.md](athletes.md) and [sports.md](sports.md): tests that fit each sport.
- [special-populations.md](special-populations.md): older adults and youth.
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
- Decision record: [tests at the start and the end](../04-decisions/adr-044-tests-at-start-and-end.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
