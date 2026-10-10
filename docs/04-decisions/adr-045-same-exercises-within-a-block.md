# ADR-045: Same exercises within a block, small changes in the next

Exercises stay the same for 4 to 6 weeks. In the next stretch, one or two small things change: a grip, a stance, an implement, a range of motion or a rep range. Never everything at once. Progress comes from more sets and better effort on the same lifts, not from new exercises every week. The coach said this in conversation and confirmed it in round 1.

| | |
|---|---|
| **Status** | Accepted. Where the exercise changes fall inside a 12-week plan is PROPOSED. |
| **Decided by** | Coach: conversation; PER-02, PER-03, PER-04 (round 1, all RIGHT); R2-LIB-01 (round 2) |
| **Replaces** | Changing exercises week to week for variety |

## Decision (the rule)

An **exercise block** is a stretch of 4 to 6 weeks with the same exercises.

| Item | Rule | Source |
|---|---|---|
| Inside an exercise block | Exercises are fixed | PER-02 |
| At the next exercise block | Change one or two of: grip, stance, implement, range of motion, rep range | PER-02 |
| How big a change | One detail of a library exercise. Never an invented exercise. | R2-LIB-01 |
| Second time a slot comes up in a week | A different exercise from the same category | PER-04 |
| People who want more variety | An A week and a B week that swap the lead lift | PER-03 |

## Why

> "Don't try to 'confuse' the muscle." (conversation)

On variety: "sometimes athletes and people want more variety, and that'll give them more variety. If they don't really need a lot of variety, then they don't have it" (PER-03).

## Context

Early in the conversation he described his week-to-week method: count the sets for a muscle this week, and do more sets next week. He also said to keep the same exercises over a block and change small variables in the next one. Some of his program tabs swap the lead lift every other week. The team asked whether that is the default. It is an option for strength and fat-loss plans and for people who want variety.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. New exercises every week | "Muscle confusion" | Rejected |
| B. The same exercises for the whole plan and beyond | No change at all | Not his practice |
| C. Fixed for 4-6 weeks, small changes after | Stable lifts, measured progress | **Chosen** (PER-02) |

## Consequences

- The stairway keeps climbing across the points where exercises change ([ADR-022](adr-022-every-plan-is-a-stairway.md)).
- Added sets go to the exercises already in the plan, first exercise first ([ADR-025](adr-025-where-a-new-set-goes.md)).
- PROPOSED: a 12-week plan changes details at weeks 5 and 9; an 8-week plan at week 5.
- For bodybuilders and powerlifters, the first 2 to 4 weeks hold more single-leg accessory work, and later weeks shift toward two-leg lifts (CAT-13, UNI-02; see [ADR-033](adr-033-bilateral-unilateral-scale.md)). Lining that shift up with the exercise changes is PROPOSED.
- The person can still swap an exercise from the dropdown at any time ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.fixed_12.exercise_blocks` | The exercise blocks of a 12-week plan |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.library_decisions.variations` | The one-detail rule |
| [synthesis/11_training_variables.json](../../synthesis/11_training_variables.json) | `variation_policy` | What may change and when |
| [synthesis/06_periodization.json](../../synthesis/06_periodization.json) | `exercise_progression_rules_v1_2` | How exercises progress block to block |
| [model/rules.json](../../model/rules.json) | `stairway.exercise_blocks_by_N` | Runtime copy (generated) |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §7.6 and §11.1 rule P9.

## Related

[ADR-015](adr-015-library-source-of-truth-one-detail-variations.md) library and variations · [Principles](../01-philosophy/principles.md)
