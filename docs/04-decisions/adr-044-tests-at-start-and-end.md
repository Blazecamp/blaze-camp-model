# ADR-044: Tests at the start and the end, never from zero

Testing is optional. The person or coach ticks what to test when the plan is built. Tests happen before the block, or in its first week, and again at the end. They never happen in the middle. Someone who has not finished a block of training does not test a one-rep max or an all-out mile. The coach set the choice in round 1 and the timing and safety rules in round 2.

| | |
|---|---|
| **Status** | Accepted. The dose for the rest of a test week and how reminders are delivered are PROPOSED. |
| **Decided by** | Coach: PER-07 (round 1); R2-PER-07 (round 2) |
| **Replaces** | A test week for everyone at the end of the plan, at any level |

## Decision (the rule)

| Item | Rule | Source |
|---|---|---|
| What can be tested | Strength, cardio, speed and agility, jumps, body weight, or nothing | PER-07, R2-PER-07 |
| Who chooses | The athlete or the coach, at the start of the block | PER-07 |
| When | Before the block or at its beginning, and at the end | R2-PER-07 |
| Never | During the block | R2-PER-07 |
| From zero | No one-rep max and no all-out mile. Use a 5-rep or 3-rep max, and 80 to 90 % efforts. | R2-PER-07 |

"From zero" means the person has not finished a block of training yet.

## Why

> "You should be able to test before and then test at the end." (R2-PER-07)

> "they should not test during the weeks, during the block." (R2-PER-07)

> "you should not go from not training to a one-rep max test." (R2-PER-07)

> "They should try to test at 80%, 90%, but not at 100%." (R2-PER-07)

## Context

In round 1 he said testing is up to the athlete or coach, picked by checkbox at the start, and that "No need for testing" is fine. The team proposed a menu and put the test in the last week. In round 2 he approved the menu and added two things: test at the start as well, and protect people who are not ready.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. A fixed test week for everyone | Every plan ends with max tests | Rejected: testing is a choice (PER-07) |
| B. Tests during the block to steer it | Mid-plan checks | Rejected (R2-PER-07) |
| C. Optional tests, before and at the end, never from zero | Safe and simple | **Chosen** |

## Consequences

- The end test replaces that week's top sets (team proposal he marked RIGHT, R2-PER-07).
- He approved reminders at the block start, 7 days before and the day before. Since nothing is stored ([ADR-002](adr-002-no-data-kept.md)), the team proposes printing them in the plan and adding alarms to a calendar file (PROPOSED).
- The '21.6 mile run' in his sheets is removed from plans and tests (R2-LIB-06).
- 'LEFT TEST' in his sheets is the L-test, and '5/10/05' is the 5-10-5 agility drill (LIB-01).
- Cardio tests can run on a bike, rower or ski erg (EQ-14).
- A tested best can feed percentages for barbell main lifts ([ADR-026](adr-026-effort-in-reps-in-reserve.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `tests.rule`, `tests.when`, `tests.never_from_zero` | The three rules |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `tests.catalogue`, `tests.timing_by_mode` | The menu and the test weeks by plan type |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fields.F26b`, `validation_checks.V25_tests` | The question and the check |
| [synthesis/06_periodization.json](../../synthesis/06_periodization.json) | `testing` | Testing in the periodization model |
| [model/rules.json](../../model/rules.json) | `tests` | Runtime copy (generated) |

Hard rule H19 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §12.

## Related

[ADR-042](adr-042-plan-lengths.md) plan lengths · [Testing](../02-model/testing.md)
