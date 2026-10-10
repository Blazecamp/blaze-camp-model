# ADR-030: Load the spine heavily once a week per pattern

A plan has at most one heavy squat day and one heavy deadlift day a week, and they are on two different days. The other lower-body days use lifts that do not load the spine, such as the leg press, belt squat or hip thrust. The coach gave the principle in round 1 and approved the two-day layout and the list of lifts in round 2.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: PER-04, EQ-11 (round 1); R2-SES-01, R2-SES-02 (round 2, both RIGHT) |
| **Replaces** | Squatting twice a week with a loaded spine (team's first version) |

## Decision (the rule)

**Axial load** means load that presses down through the spine, as with a barbell on the back or a heavy bar in the hands.

Example week (R2-SES-01): heavy squat Monday, heavy deadlift Friday. Tuesday a hinge that does not load the spine. Thursday leg press or belt squat.

| Class | Lifts | Source |
|---|---|---|
| Counts as loading the spine | Barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs (Romanian deadlifts); good mornings | R2-SES-02 |
| Fine on the second day if not sore | Goblet squat, hack squat, pendulum | R2-SES-02 |
| Does not count | Leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg dumbbell work, Olympic lifts, loaded jumps | R2-SES-02 |

Powerlifters may add a light technique squat or deadlift (R2-SES-02).

## Why

> "I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well." (PER-04)

> "Belt squats are for people that you don't need to load them axially, so it won't be a load on their back." (EQ-11)

## Context

The team asked what to do when a slot, such as the squat, comes up a second time in a week. He confirmed: a different exercise of the same category, for example squatting one day and leg pressing the other. His words left one thing open: is "once a week" one day with both squat and deadlift, or one day each? Round 2 asked, and he approved one day each.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Two loaded squat days a week | Front squat Monday, back squat Thursday | Rejected (PER-04) |
| B. Heavy squat and heavy deadlift on the same day | The spine is loaded one day only | Not chosen |
| C. One heavy squat day and one heavy deadlift day | Each pattern heavy once, on different days | **Chosen** (R2-SES-01) |

## Consequences

- The second time a lower pattern comes up in a week, it is a different, non-spinal exercise.
- An athlete who is already sore from loading that week switches to the belt squat (EQ-11).
- Single-leg dumbbell work fills the other days, which also feeds the unilateral share ([ADR-033](adr-033-bilateral-unilateral-scale.md)).
- PROPOSED: at home or in a hotel with no machines, the second squat day is a single-leg squat, or a goblet squat if not sore.
- The team added a few barbell and trap-bar variants to the counted list by the same logic (INFERRED).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.axial_loading.budget_per_week` | One heavy squat day, one heavy deadlift day, never the same day |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.axial_loading.classes` | The three lists above |
| [model/rules.json](../../model/rules.json) | `axial` | Runtime copy (generated) |

Each catalog record has an `axial_spinal_load` field. Hard rule H07 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §10.4.

## Related

[ADR-035](adr-035-machines-not-ranked.md) machines · [Sessions](../02-model/sessions.md)
