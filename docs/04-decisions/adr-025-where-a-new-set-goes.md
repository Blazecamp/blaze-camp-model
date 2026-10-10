# ADR-025: Where a new set goes

A plan adds sets week by week (the stairway). When it adds a set, the set goes to the first exercise of the day for that muscle, then to the second, and so on. When the same day runs twice a week, the new set alternates between the two days. Extra sets for a small muscle on full days become a short bonus exercise. The coach described the first rule in round 1 and approved the other two in round 3.

| | |
|---|---|
| **Status** | Accepted. Per-exercise set limits are PROPOSED. |
| **Decided by** | Coach: VOL-06, VOL-07 (round 1); R3-VOL-03, RIGHT (round 3) |
| **Replaces** | Spreading new sets round-robin; adding a new exercise each time; at most 2 exercises per muscle per session |

## Decision (the rule)

1. **The tool does the percentages.** A 5 % step on 16 sets is 0.8 of a set. The tool keeps the fraction and adds a whole set when it reaches 1 (VOL-06).
2. **First exercise first.** Three exercises at 2 sets each grow like this (VOL-07):

| Week | Exercise 1 | Exercise 2 | Exercise 3 |
|---|---|---|---|
| start | 2 | 2 | 2 |
| +1 set | 3 | 2 | 2 |
| +1 set | 3 | 3 | 2 |
| +1 set | 3 | 3 | 3 |
| +1 set | 4 | 3 | 3 |

3. **Alternate the two days.** If the same day runs Monday and Thursday, the new back set goes to Monday's first back exercise this time and to Thursday's the next time (R3-VOL-03).
4. **Bonus exercise for small muscles.** Two extra biceps sets on full days become a short bonus exercise on the optional day. With no optional day, they go on a day that already trains biceps, never as that day's only biceps exercise (R3-VOL-03).

## Why

> "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning of the exercise because I put all my energy into it." (VOL-07)

> "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." (VOL-06)

On small muscles at the end of a big-muscle day, he says people are "kind of gassed out", so more biceps has to come "as a bonus exercise" (VOL-07).

## Context

The team's first design released one or two sets at a time and spread them evenly. It also capped a session at two exercises per muscle. He corrected both in VOL-07: he usually has 3 to 4 exercises per muscle group per day, and the first one gets the new set. In round 2 we asked about the two-days case and he did not understand the question (R2-VOL-08). We asked again in plain words in round 3 and he marked it RIGHT.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Spread new sets evenly | Every exercise grows in turn from the start | Replaced |
| B. Add a new exercise for each increase | More variety, less focus | Replaced |
| C. First exercise first, then alternate the two days | Sets go where the energy is | **Chosen** |

## Consequences

- No exercise ever loses a set from one week to the next.
- Calves are a special case: extra calf sets go to the existing calf exercise, never to a second calf exercise on a leg day (R3-SES-01).
- PROPOSED limits: at most 4 sets per exercise for beginners and 5 for others; isolation exercises at most 4.
- PROPOSED: when the plan needs more bilateral or more unilateral work to match its target share, the new set goes to the side that is behind ([ADR-033](adr-033-bilateral-unilateral-scale.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.set_placement.steps` | Every step of the placement, with its source |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.banking` | Keeping the fraction |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `set_placement`, `banking` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `placement` | Runtime copy (generated) |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.5.

## Related

[ADR-022](adr-022-every-plan-is-a-stairway.md) the stairway · [ADR-031](adr-031-two-to-four-exercises-per-group.md) exercises per group · [Stairway](../02-model/stairway.md)
