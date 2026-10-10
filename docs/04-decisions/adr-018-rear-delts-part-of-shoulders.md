# ADR-018: Rear delts are part of the shoulders

Rear delts are not counted as a muscle of their own. They belong to the shoulders group, together with the front and side delts, and the floor of 10 sets is counted on that group. People and coaches can always add more rear-delt work. The coach decided this in round 3, replacing the separate rear-delt numbers he had approved in round 2.

| | |
|---|---|
| **Status** | Accepted. The direct side-delt dose that results is flagged PROPOSED. |
| **Decided by** | Coach: R3-VOL-01, verdict PARTLY (round 3, 2026-10-09) |
| **Replaces** | Rear delts with 4 / 6 / 8 sets of their own (R2-VOL-04) and side delts as a separate line |

## Decision (the rule)

- One **shoulders** line: front + side + rear delts.
- The floor of 10 is counted on the whole group ([ADR-017](adr-017-floor-of-10-on-focus-groups.md)).
- Rear delts also get work from back training.
- Adding more rear-delt work is always possible.

| Shoulders line | L1 beginner | L2 intermediate | L3 advanced | Source |
|---|---|---|---|---|
| Starting weekly sets | 10 | 12 | 15 | R2-VOL-04 (12, 15), read on the group; L1 lifted to 10 by the floor |
| Ceiling in a 12-week plan | 14 | 22 | 25 | R2-VOL-06; same ceilings as big muscles INFERRED from "the little muscles also grow the same idea" |

## Why

> "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable." (R3-VOL-01)

> "I think the rear delts also get worked when you do back, so that sounds about right." (R3-VOL-01)

> "People and coaches should always be able to add more rear delts, I guess, if they wanted, but that's the way I look at it." (R3-VOL-01)

## Context

- Round 1: rear delts got almost no direct sets in his sheets. He said that was not intended: "Rear delts and calves need to get their own sets and reps, yes." (VOL-17)
- Round 2: he approved 4 / 6 / 8 sets a week for rear delts on their own (R2-VOL-04), and in the same round said nobody needs fewer than 10 sets a week per muscle (R2-VOL-06).
- Round 3: we asked how both fit. He said he had been thinking of the shoulders as a whole: "I just figured the shoulders were what we were talking about." (R3-VOL-01)

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Rear delts keep 4 / 6 / 8 and are exempt from the floor | The team's round-3 proposal | Partly: he approved the group idea, not a separate muscle |
| B. Rear delts raised to 10 on their own | A lot of rear-delt isolation | Not chosen |
| C. Rear delts inside the shoulders group | One line, one floor | **Chosen** |

## Consequences

- The plan still includes a rear-delt exercise every week. This is a content rule, not a floor of sets. It is the team's reading of his round-1 words "Rear delts and calves need to get their own sets and reps, yes." (VOL-17) (INFERRED). The exact minimum, one exercise of 2 or more sets, is PROPOSED.
- Rows give the rear delts helper credit of 0.25 a set ([ADR-019](adr-019-helper-credit-0-25.md)).
- KB face pulls are shoulder work, not a vertical pull (R2-LIB-04, LIB-10).
- The Focus muscle list has one "Shoulders" choice ([ADR-024](adr-024-focus-muscle-1-and-2.md)).
- Flagged for the coach: with one shoulders line, an intermediate bodybuilder gets only about 3 to 4 direct side-delt sets a week unless shoulders are a Focus muscle (PROPOSED dose, round-4 question).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.weekly_sets.muscles.shoulders` | Members, starts, ceilings, counting |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.weekly_sets.floors.rear_delts` | The rear-delt note on the floor |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.weekly_sets.retired_v1_2` | The retired separate lines |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `starting_table.retired_v1_2` | Same, in the volume algorithm |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.3 "Retired lines".

## Related

[ADR-005](adr-005-editable-plan-switches-and-supersets.md) adding exercises · [Changes across rounds](../03-coach-answers/changes-across-rounds.md) · [Volume](../02-model/volume.md)
