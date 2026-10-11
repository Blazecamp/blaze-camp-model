# ADR-017: A floor of 10 weekly sets, counted on focus groups

Volume is counted as hard sets per week for each focus group. Every group the plan trains directly gets at least 10 sets a week in a training block. The coach set the floor of 10 in round 2. In round 3 he approved counting it on groups: hips are glutes plus hamstrings, and shoulders are front, side and rear delts together.

| | |
|---|---|
| **Status** | Accepted, refined in round 4: the floor applies when there are 3 or more training days; 2 days follow [ADR-052](adr-052-two-day-rule.md). "Group credit" and the calf top-up are PROPOSED. The exemptions he did not speak to are INFERRED. |
| **Decided by** | Coach: R2-VOL-06 (round 2); R3-SES-01 and R3-VOL-01 (round 3, 2026-10-09) |
| **Replaces** | Lower starts for small muscles (8 sets) and floors of 2 to 4 sets (team, earlier versions) |

> **Update, round 4 (R4-SES-03, CT-01).** The floor of 10 holds when a person trains 3 or more days a week. On 2 days every big group is trained with about 6 to 8 weekly sets, the plan says so and suggests a third day ([ADR-052](adr-052-two-day-rule.md)). No group is left out "because time is short" any more: there is no time check ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)). A group can still sit under 10 when its template has too few slots and no optional day; the plan then says so in words.

## Decision (the rule)

A **hard set** is a working set done 1 to 3 reps short of failure. A **focus group** is one of the muscle headings the coach programs by.

| Focus group | Members |
|---|---|
| Quads | quads |
| Hips | glutes + hamstrings |
| Back | lats and upper back |
| Chest | chest |
| Shoulders | front + side + rear delts |
| Biceps, Triceps | each on its own |
| Calves | one exercise × 3 sets every leg day |

- Each **trained** group holds 10 or more sets a week in a training block.
- An RDL (Romanian deadlift), a hip thrust and a leg curl count as three hip exercises.

| Not floored | Source |
|---|---|
| Maintenance phases, pre-season and in-season (lower maintenance volume) | Team proposal in R3-VOL-01; his answer did not change it (INFERRED) |
| A group cut back for pain | VOL-03 |
| Helper-only lines of field athletes, such as arms (their trained chest and back still go up to 10) | Team proposal in R3-VOL-01; his answer did not change it (INFERRED) |
| Plans with 2 training days (about 6 to 8 sets instead) | R4-SES-03, see [ADR-052](adr-052-two-day-rule.md) |
| ~~Groups the plan does not train directly because time is short~~ | Retired with the time check (CT-01); it was R3-SES-02, [ADR-032](adr-032-time-vs-minimums-order.md) |

## Why

> "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06)

> "8 sets a week is probably just barely maintenance." (R2-VOL-04)

> "If you put together all the sets of shoulders, it'll equate to more than 10 sets" (R3-VOL-01)

## Context

He had approved 4 / 6 / 8 sets for rear delts on their own (R2-VOL-04) and also said nobody needs fewer than 10. Both could not hold if the 10 was counted on each small muscle. Full-body days raised the same question for his "2-4 exercises per muscle" (R2-SES-05; see [ADR-031](adr-031-two-to-four-exercises-per-group.md)). Round 3 asked how to count a "muscle". He approved the groups.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Different floors by muscle size | Small muscles could sit at 4 to 8 | Replaced by the floor of 10 (R2-VOL-06; his note on 8 sets in R2-VOL-04) |
| B. 10 on every single muscle | Rear delts alone would need 10 | Not what he meant (R3-VOL-01) |
| C. 10 on each trained focus group | Shoulders and hips counted as groups | **Chosen** |

## Consequences

- With little time, the plan trains fewer groups directly, instead of holding every group under the floor ([ADR-032](adr-032-time-vs-minimums-order.md)).
- Glutes and hamstrings still have their own lines for starting numbers and for display.
- PROPOSED: a set counts at most 1.0 toward a group ("group credit"). A face pull is one shoulder set, not 1.25.
- PROPOSED: with fewer than four leg days, calves reach 10 through a fourth set or an optional-day calf slot. His own rule is 3 sets per leg day (VOL-17, R3-SES-01).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.weekly_sets.floors` | The floor, what it is counted on, the exemptions |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `vocab.muscles.focus_groups` | The groups and their members |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V22_floor` | The check |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `starting_table.floors`, `counting.groups`, `counting.group_credit` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `volume.floor`, `muscles.groups` | Runtime copy (generated) |

Hard rule H17 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.3.

## Related

[ADR-018](adr-018-rear-delts-part-of-shoulders.md) rear delts · [ADR-021](adr-021-starting-sets-and-ceilings-by-level.md) starts and ceilings · [Volume](../02-model/volume.md)
