# ADR-023: Weekly percentages by muscle size, or by the person's week (both retired)

Two earlier ways of choosing the weekly increase are retired. The first sized the step by muscle: 3 % for big muscles, 5 % for medium, 7 % for small. The second sized it by the person's week, read from a check-in. The coach rejected the first in round 1. The second lost its inputs in rounds 2 and 3. What remains is one planned stairway for everyone. This record exists so nobody rebuilds either idea.

| | |
|---|---|
| **Status** | Retired. Replaced by [ADR-022](adr-022-every-plan-is-a-stairway.md). |
| **Decided by** | Coach: VOL-05 (round 1) retired the size-based step; R2-GEN-04, R2-VOL-03 (round 2) and R3-VOL-02, R3-VOL-04 (round 3) retired the person-based step |
| **Replaces** | Nothing. It records two retired options. |

## Decision (the rule)

- The weekly step is **not** chosen by muscle size.
- The weekly step is **not** chosen from how the person's week went.
- One rule for every person and every muscle: about 3 % a week to the halfway week, about 5 % after ([ADR-022](adr-022-every-plan-is-a-stairway.md)).

## Why

On muscle size:

> "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person." (VOL-05)

On feedback from the person:

> "No, if they don't check in, the plan doesn't change. There is no data to go off of." (R2-VOL-03)

> "we can just kick out the program designed already without the input of somebody saying how they feel or whatever. It doesn't really matter." (R3-VOL-04)

## Context: how the idea moved

| When | The weekly step was... | Source |
|---|---|---|
| First conversation | Small weekly increments; he mentioned 3 %, 5 % or 7 % | Conversation |
| Team's first version | Picked by muscle size: big 3 %, medium 5 %, small 7 % | Team inference |
| Round 1 | Not by muscle. It depends on the person. The percentage is of weekly sets per muscle. | VOL-05, VOL-04 |
| Team's second version | One 3, 5 or 7 % step per person per week, from how the week went | Team design after VOL-05 |
| Round 2 | He approved a check-in table for it (R2-VOL-01). He rejected lifestyle questions (R2-GEN-04). No check-in means no change (R2-VOL-03). Every plan is a stairway (R2-PER-03). | Round 2 |
| Round 3 | No check-ins at all. The stairway is approved in numbers. | R3-VOL-02, R3-VOL-04 |

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. By muscle size | Big 3 %, medium 5 %, small 7 % | Retired (VOL-05) |
| B. By the person's state from intake questions | Bad sleep, stress or a hard job gives 3 % instead of 5 % | Retired ([ADR-003](adr-003-no-lifestyle-inputs.md)) |
| C. By the person's week from a check-in | Easy week +7 %, on target +5 %, hard week hold | Approved in round 2, retired in round 3 ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)) |
| D. One planned stairway | The same steps for everyone | **Chosen** |

## Consequences

- What survives from the earlier answers: the percentage is taken from weekly sets per muscle (VOL-04); never more than 7 % in a week (R2-VOL-01); 10 % a week is "way too much" (UNI-05).
- What he called "what's going on with the person" (VOL-05) is now handled by the person. They adjust the plan themselves.
- A coach may still set the step by hand before the plan is built, inside 0 to 7 %. This comes from his words that the coach should "adjust accordingly" (VOL-05). The mechanism is PROPOSED.
- Some older files in the repo still describe the person-based step. Round 3 wins.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.retired` | The retired step rules, listed |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.principle` | One rule for every person, never by muscle size |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.hand_set_range` | The coach's hand-set range |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `adaptation.status` | The retired check-in block |

History: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §0.2 row 1 and §0b.2 rows 1, 3 and 4.

## Related

[What he rejected](../01-philosophy/what-he-rejected.md) · [Changes across rounds](../03-coach-answers/changes-across-rounds.md) · [Stairway](../02-model/stairway.md)
