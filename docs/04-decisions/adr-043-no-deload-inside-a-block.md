# ADR-043: No deload inside a block

A training block runs from its first week to its last with no easy week in the middle. If a person cannot finish it, they stop it, do a maintenance phase, and then start a whole new block. After a finished block an easy week at about half the sets is recommended, not required. The coach ruled out mid-block deloads in round 2 and made the easy week a recommendation in round 3.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: PER-05 (round 1); R2-VOL-07 (round 2); R3-PER-01 (round 3) |
| **Replaces** | A fixed deload week in the middle of a plan; deloads triggered by check-ins |

## Decision (the rule)

A **block** is one training plan run from start to finish, such as a 12-week plan. A **deload** is an easy week.

| Item | Rule | Source |
|---|---|---|
| Inside a block | No deload week and no maintenance week | R2-VOL-07 |
| A block that cannot be finished | Cancel it, do a maintenance phase, then start a whole new block | R2-VOL-07 |
| After a finished block | An easy week is recommended, not mandatory | R3-PER-01 |
| What the easy week is | About half the sets of the hardest week, same exercises, lighter | PER-05, R2-VOL-07 |
| When a block ends | It ends. The person builds what comes next. | R3-PER-01 |
| Holidays and vacations | Planned between blocks | R3-PER-01 |

## Why

> "It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it." (R2-VOL-07)

> "If they can't complete it, they should cancel the block and start a maintenance phase, but then, when they're done with maintenance, they should start a whole new block." (R2-VOL-07)

> "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01)

## Context

The team's first 12-week shape had a deload in week 7. The next version removed the fixed week but let check-ins trigger one: two "hold" weeks in a row, two weeks of very high effort, or pain on two or more exercises. He marked that proposal RIGHT and then wrote that a maintenance week should never land in the middle of a block. His words decide. Round 3 asked about the week between two blocks, and he made it optional.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. A planned deload in the middle | For example week 7 of 12 | Rejected (PER-01, R2-VOL-07) |
| B. A deload triggered by feedback | The tool inserts an easy week when signs are bad | Rejected (R2-VOL-07); impossible without check-ins |
| C. Nothing inside; an easy week between blocks, recommended | Blocks are completed | **Chosen** |

## Consequences

- The stairway runs unbroken to its hardest week ([ADR-022](adr-022-every-plan-is-a-stairway.md)).
- Stopping a block is the person's or the coach's call. The tool does not offer it, since it sees no feedback ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)).
- The easy week is an extra week, so the next block keeps all its weeks: 12 + 1 makes a 13-week quarter in a year plan (team proposal he marked RIGHT, R3-PER-01).
- A holiday marked after a block has started ends that block there, unless the mark is removed (same proposal, R3-PER-01).
- A person can still repeat a week or swap a painful exercise on their own.
- PROPOSED: after a stopped block, the next block starts at the same level rather than one step up.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.deload` | The easy week: dose, when, what is retired |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.fixed_12.deload` | No easy week inside the block |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V24_block_structure` | The check |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `deload` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `recovery` | Runtime copy (generated) |

Hard rule H15 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §11.6.

## Related

[ADR-042](adr-042-plan-lengths.md) plan lengths · [What he rejected](../01-philosophy/what-he-rejected.md) · [Changes across rounds](../03-coach-answers/changes-across-rounds.md)
