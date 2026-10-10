# ADR-028: Power before strength, horizontal before vertical

A session runs from fast to heavy to accessory: athletic and power work first, then the heavy strength lift, then the resistance accessories. Within the upper body, the horizontal lift comes before the vertical one: a row before a pulldown, a bench press before an overhead press. The day's main lift, "the work", goes first in its part. The coach confirmed these rules in round 1, choosing his "BUILD YOUR OWN PROGRAM" sheet over tabs that did it differently.

| | |
|---|---|
| **Status** | Accepted. The full list of session tiers is partly INFERRED from his sheets. |
| **Decided by** | Coach: ORD-01, ORD-02, ORD-03, ORD-08, GEN-08 (round 1, all RIGHT); his statements in conversation |
| **Replaces** | Following each program tab's own order |

## Decision (the rule)

| # | Rule | Source |
|---|---|---|
| 1 | Power before strength. Cleans and snatches come before heavy strength lifts. | ORD-03, GEN-08 |
| 2 | Horizontal pull before vertical pull: row before pulldown. | ORD-01 |
| 3 | Horizontal push before vertical push. | Conversation; GEN-08 |
| 4 | "The work" (the main lift) comes first, whatever its direction. | ORD-02 |
| 5 | Always a warm-up. Warm-up drills do not count as volume. | ORD-08 |
| 6 | A small muscle goes first only when it is a priority. Since round 3 that means a Focus muscle ([ADR-024](adr-024-focus-muscle-1-and-2.md)). | ORD-04; R3-SES-01 |

His order of a field athlete's session, in his words:

> "Usually, about 2 core exercises, then we get into the plyo work, which would be 2 to 3 or 4 different exercises, and then the powerlifting or Olympic lifting, which would be 2 or 3 exercises. Then the 3 to 4 resistance patterns for accessories" (VOL-17)

## Why

Fast work needs a fresh body. He said in conversation that the session intent runs power first, then power-strength, then strength, then resistance patterns, and that speed and load pull against each other:

> "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (conversation)

For horizontal before vertical, he did not give the reason with the rule. His description of the positions fits it: horizontal work is "safer for you when you push and pull", and overhead work needs more "positioning", "stability" and "skill" (CAT-04). Linking the two is the team's reading (INFERRED).

## Context

His sheets did not agree with each other. His main sheet always puts the row before the pulldown, but three program tabs put the pulldown first. One strength tab puts the overhead press before the incline bench on overhead weeks. One hybrid tab lists strength above Olympic lifts. The team asked which to follow in each case.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Copy each tab's order | The tool would be inconsistent | Rejected |
| B. One set of ordering rules from his main sheet | Row before pulldown, power before strength, the work first | **Chosen** |

## Consequences

- Rule 4 can override rule 2 or 3: when a vertical lift is the day's main lift, it goes first (ORD-02).
- Core opens the session before all of this ([ADR-027](adr-027-core-first.md)).
- Myo sets come only on the last exercise (VOL-15).
- A speed session has a fixed order: squirrel jumps, then MACH drills or acceleration starts, then max velocity (LIB-21).
- OBSERVED, not asked: in his written programs the bilateral lift comes before the unilateral one in 225 of 231 sessions. The tool follows that as a default.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.ordering.hard` | The rules that never bend |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.ordering.tiers`, `rule_tables.ordering.defaults` | The full session order and the softer defaults |
| [synthesis/11_training_variables.json](../../synthesis/11_training_variables.json) | `ordering_rules` | Every ordering rule with its evidence |
| [model/rules.json](../../model/rules.json) | `ordering.block_order`, `ordering.hard` | Runtime copy (generated) |

Hard rules H03 and H04 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §10.2.

## Related

[ADR-029](adr-029-pairing-hip-push-knee-pull.md) pairing · [ADR-013](adr-013-davidson-zones-as-tags.md) zones · [Sessions](../02-model/sessions.md)
