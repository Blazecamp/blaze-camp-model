# ADR-026: Effort is given in reps in reserve

The plan tells people how hard to work with reps in reserve: how many more reps they could have done. Every working set stays between 1 and 3 reps in reserve. Heavy compound lifts never go to failure. Percentages of a max are used only in a few cases. The coach chose reps in reserve in round 1. Rounds 2 and 3 added what a "10" means and how effort drifts across a plan.

| | |
|---|---|
| **Status** | Accepted. The wording shown to users is PROPOSED. |
| **Decided by** | Coach: VOL-13, VOL-15, GEN-08 (round 1); R2-VOL-02, R2-GEN-06 (round 2); R3-VOL-04 (round 3) |
| **Replaces** | Prescribing every lift by percentage of a one-rep max |

## Decision (the rule)

**Reps in reserve (RIR)** is how many more reps you could have done at the end of a set. **RPE** is a 1-10 effort score. 2 RIR is about RPE 8.

| Item | Rule | Source |
|---|---|---|
| Working sets | 1 to 3 RIR | VOL-13 |
| Heavy compound lifts | never to failure | GEN-08 |
| "MAX" sets | only on small-muscle or bodyweight work | VOL-13 |
| Myo sets | only on the last exercise, on a machine or an isolation lift | VOL-15 |
| Effort 10 | "the max I can do, not a fail" | R2-VOL-02 |
| What weight to use | reps-in-reserve words, with a week-1 tip | R2-GEN-06 |
| Percentages | only for barbell main lifts with a recent tested best | R2-GEN-06 |
| Olympic lifts | by effort and speed; explained as power output | R2-GEN-06 |
| Across the plan | 3 RIR early, then 2, then 1-2, then 1 plus intensifiers in the last week | R3-VOL-04 |

A **myo set** is one long set broken into short mini-sets with very brief rests.

## Why

> "I like RIR in my model, so that's what I'm going to be using." (VOL-13)

> "Everything in training is kind of subjective." (VOL-13)

On Olympic lifts: "these are for power output, and they don't necessarily need to go by percentage unless you're a competitive Olympic lifter." (R2-GEN-06)

## Context

His sheets say "leave 1 in the tank" and carry a 1-10 effort menu with labels. The team asked whether effort changes through a plan and what MAX means. He named three systems, RIR, percentages and RPE, and chose RIR, with RPE explained next to it. In round 2 we proposed that 10 means "failed". He corrected it: 10 is a successful all-out set.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Percent of one-rep max for every lift | Needs a tested max | Not chosen; kept for tested barbell main lifts |
| B. RPE only | One number, no explanation | Not chosen as the main cue |
| C. RIR, with RPE shown beside it | "Leave 2 reps in the tank" | **Chosen** (VOL-13) |

## Consequences

- A new person can start without testing a max ([ADR-044](adr-044-tests-at-start-and-end.md)).
- The 1-10 effort menu from his sheet, with 10 as a successful max, stays in the downloaded sheet for the person's own notes. The tool never reads it, because there are no check-ins ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)).
- The load adjusts to the day by itself: the same reps in reserve means less weight on a bad day. This is how a fixed plan still fits a person without check-ins.
- Rest: about 1 to 2 minutes for muscle-building work, 3 to 6 for strength (VOL-14).
- Competitive Olympic weightlifting needs its own percentage-based programming. It is not part of this model yet (R2-GEN-06).
- A percentage on an Olympic lift is shown only if that lift was tested and a coach switches it on (PROPOSED).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.effort.scale`, `rule_tables.effort.never`, `rule_tables.effort.max`, `rule_tables.effort.myo` | The effort rules |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.effort.planned_drift`, `rule_tables.effort.effort_menu_reading` | The drift; what 8, 9 and 10 mean |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `output.weight_guidance` | How the plan tells people what weight to use |
| [model/rules.json](../../model/rules.json) | `effort.rir_band` | Runtime copy (generated) |

Hard rule H02 in [AGENTS.md](../../AGENTS.md) §10. Human text: [synthesis/11_training_variables.md](../../synthesis/11_training_variables.md).

## Related

[ADR-022](adr-022-every-plan-is-a-stairway.md) the stairway · [ADR-039](adr-039-olympic-lifts-policy.md) Olympic lifts · [Glossary](../05-reference/glossary.md)
