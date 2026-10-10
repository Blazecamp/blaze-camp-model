# ADR-003: No lifestyle inputs

The form never asks about sleep, stress, a physical job or anything else about a person's life. It asks only what the workouts need. The coach rejected the team's proposal for three lifestyle questions in round 2. Every plan now climbs by the same rule, whatever the person's week looks like.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: R2-GEN-04, verdict NOT RIGHT (round 2, 2026-10-08) |
| **Replaces** | Three intake taps (usual sleep, stress, physical job or other sport) and the "how was life" cells of the check-in table |

## Decision (the rule)

- No question about sleep, stress, job, energy, recovery or life anywhere: not in the form, not after it.
- A new intake field needs a coach answer behind it.

## Why

> "No, I don't want anything to do with anything else other than just workouts. I just need the workouts here. There's no need to talk about sleep or stress or anything else." (R2-GEN-04)

## Context

After round 1 the weekly step was chosen by the person's state ([ADR-023](adr-023-weekly-percentages-by-size-or-by-person-retired.md)). The team needed a way to read that state without a check-in. We proposed three quick taps. Poor sleep, high stress or a hard job would have started the plan on a 3 % step instead of 5 %.

In the same round he had approved a check-in table that included "life was harder" and "life was better" cells (R2-VOL-01). The two answers pulled against each other. In round 3 we asked to drop the life cells, and he dropped check-ins as a whole (R3-VOL-02, [ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Three lifestyle taps at intake | Sleep, stress, workload set the starting step | Rejected (R2-GEN-04) |
| B. A "how was life" question in the weekly check-in | Life moves next week's step | Approved inside a table (R2-VOL-01), then retired with the check-in |
| C. Workouts only | One stairway for everyone; people adjust for life themselves | **Chosen** |

## Consequences

- The plan cannot slow down for a bad week by itself. The person repeats a week, cuts sets or swaps an exercise ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).
- The form is shorter. This matches "The fewer clicks, the better." (R2-GEN-02)
- An intake that carries a lifestyle key is refused by the engine (keys such as `sleep`, `stress`, `job`, `life`).
- Age, training experience, body weight, pain and equipment stay. They change the workouts directly.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.removed_fields` | The removed recovery field (sleep, stress, job) |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V26_inputs` | The check: no sleep, stress, job or life field |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fewest_clicks` | The rule to ask nothing the engine does not use |
| [model/rules.json](../../model/rules.json) | `locked` | Locked rule LK16 `locked.no_lifestyle_inputs` (generated) |

Hard rule H16 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-004](adr-004-no-sex-field.md) no sex field · [ADR-022](adr-022-every-plan-is-a-stairway.md) the stairway · [What he rejected](../01-philosophy/what-he-rejected.md)
