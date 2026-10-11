# ADR-024: Focus muscle 1 and Focus muscle 2

When a person builds a plan they may pick one or two muscles they want to work on the most. Each gets an extra set or two or three a week on top of a balanced plan, for the whole plan. Two is the maximum. The coach asked for this in round 3. It replaced a heavier "priority muscle" push from earlier rounds.

| | |
|---|---|
| **Status** | Accepted. The default of +2 sets, the list of choices and how the extra rides the stairway are PROPOSED. |
| **Decided by** | Coach: R3-SES-01, RIGHT with words (round 3, 2026-10-09) |
| **Replaces** | A priority push of +4 to +6 sets with the other muscles slowed down (VOL-02, R2-VOL-06); kept only as an optional coach setting |

## Decision (the rule)

| Item | Value | Source |
|---|---|---|
| How many | Focus muscle 1 and Focus muscle 2; both optional | R3-SES-01 |
| Extra volume | +1 to +3 weekly sets each | R3-SES-01 |
| Default extra | +2 | PROPOSED |
| Ceiling with a Focus | up to 18 / 26 / 30 by level (28 for an intermediate's chest) | R2-VOL-06 priority ceilings of 18 / 26-28 / 30. Using 26 inside his range is the team's pick. |
| Everything else | stays balanced | R3-SES-01 |

## Why

> "they should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one compared to the other one." (R3-SES-01)

> "As much as everything else is balanced, the glutes should have an extra set or two or three." (R3-SES-01)

> "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." (R3-SES-01)

## Context

His sheets already have optional-day slots called 'Focus 1' and 'Focus 2'. In round 1 he said a priority muscle gets more volume, with one or two at a time (VOL-02, verdict PARTLY: "That's the idea"). In round 2 he approved higher ceilings for a priority muscle. The team's design added 4 to 6 sets at the start and held the other muscles to 3 % a week. In round 3 he described something lighter, chosen by the person.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Priority push: +4 to +6 sets, others slowed | A strong bias | Kept only as an optional coach setting (PROPOSED) |
| B. Focus muscles: +1 to +3 sets, the rest balanced | A light bias the person picks | **Chosen** |
| C. Set the emphasis from sex | For example more glutes by default | Never ([ADR-004](adr-004-no-sex-field.md)) |

## Consequences

- PROPOSED: the extra sets are added to the group's start and to its ceiling, so the stairway carries them every week. Example with +2 for an intermediate's glutes over 12 weeks: 17, 17, 17, 18, 18, 19, 19, 20, 21, 22, 23, 24.
- INFERRED: the other groups are not slowed down.
- The Focus exercise goes first in its session. Small muscles go first only when they are a priority (ORD-04).
- The optional-day Focus slots can both hit the same muscle, 2 to 3 sets each (ORD-11).
- Shoulders are one choice ([ADR-018](adr-018-rear-delts-part-of-shoulders.md)).
- Open for the coach: Focus muscles for competitive field athletes (N-PROD-25), and what happens to a Focus muscle when its template has too few slots for its sets. The second question used to be about short time (N-PROD-27); time is no longer a limit ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)). Today the plan adds a bonus exercise on the optional day, or caps the group and says so.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.priority.v1_2_focus_muscles` | Max, choices, extra sets, ceilings, example |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fields.F09` | The Focus muscles question |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `focus_muscles` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `volume.focus` | Runtime copy (generated) |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.1 rule V6b.

## Related

[ADR-021](adr-021-starting-sets-and-ceilings-by-level.md) starts and ceilings · [ADR-032](adr-032-time-vs-minimums-order.md) time vs minimums · [Volume](../02-model/volume.md)
