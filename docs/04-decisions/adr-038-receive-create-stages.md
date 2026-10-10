# ADR-038: Receive-Create stages for jump training

Jump training is taught in three stages. First the athlete learns to land and hold. Then to land and go once. Then to repeat. The coach described this method in round 1 and said he had no name for it yet. The team proposed the name "Receive-Create stages" and the weeks for each stage, and he approved both in round 2.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: CAT-10, CAT-11 (round 1); R2-ATH-03, RIGHT (round 2) |
| **Replaces** | "Plyo zones" as a fixed property of each exercise (team's first reading) |

## Decision (the rule)

To **receive** force is to absorb a landing. To **create** force is to push off.

| Stage | Name | What the athlete does | 12-week plan | 8-week plan |
|---|---|---|---|---|
| 1 | Land | Receive and pause: stick the landing | weeks 1-3 | weeks 1-2 |
| 2 | Land & Go | Receive, then create once: stick, then jump or hop | weeks 4-7 | weeks 3-5 |
| 3 | Repeat | Receive and create again and again: repeated hops and jumps | weeks 8-12 | weeks 6-8 |

- Restart at stage 1 each off-season.
- Stay at the current stage in maintenance blocks.
- Intermediate and advanced athletes may start at stage 2.
- Two feet before one foot. Single-leg hops and jumps are harder (CAT-10).

## Why

> "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." (CAT-10)

On the name:

> "I just gave it a name, but it's not necessarily a plyo zone. I don't know what to call it yet." (CAT-11)

## Context

His sheets label these steps with the word ZONE, the same word he uses for Dr. Pat Davidson's position zones. The team first stored a "plyo zone" on each exercise. He explained that the Davidson zones do not apply to plyometrics, and that this is "the way I want the plyos to be done" (CAT-11). It is a method that runs across weeks.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. A zone on each jump exercise | A hurdle hop always belongs to one zone | Replaced (CAT-11) |
| B. No stages | Athletes start with repeated jumps | Rejected (CAT-10) |
| C. Three stages across the plan | Land, Land & Go, Repeat | **Chosen** (R2-ATH-03) |

## Consequences

- The same drill can be done at different stages, for example a hurdle hop with a stuck landing or with repeated rebounds.
- Stick-the-landing drills are the "receive" stage (R2-ATH-02). They are the only jump work that is on by default for clients over 60 ([ADR-040](adr-040-older-adult-defaults.md)).
- The stages run alongside the shift from ballistic to plyometric work ([ADR-037](adr-037-plyometric-vs-ballistic-by-ground-contact.md)).
- Stage changes should line up with the points where exercises change. The first engine did not always manage this, which is noted in the sample-plan reviews.
- These stages are not the Davidson zones ([ADR-013](adr-013-davidson-zones-as-tags.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.method_stage` | Name, stages, weeks, rules |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.fixed_12.receive_create_weeks`, `plan_types.fixed_8.receive_create_weeks` | The weeks in each plan length |
| [model/rules.json](../../model/rules.json) | `athletic.stages` | Runtime copy (generated) |

Jump exercises in the catalog carry an `athletic_quality` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §9.3.

## Related

[ADR-039](adr-039-olympic-lifts-policy.md) Olympic lifts · [Athletes](../02-model/athletes.md) · [Glossary](../05-reference/glossary.md)
