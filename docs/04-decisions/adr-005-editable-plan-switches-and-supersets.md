# ADR-005: The plan is a template people edit

A generated plan is a template. The person or their coach can switch off a day's athletic block or core block, remove or add exercises or whole blocks, swap an exercise within its category, and take the supersets the plan recommends to save time. The coach asked for these options in round 3. How the editor works in detail is PROPOSED.

| | |
|---|---|
| **Status** | Accepted (the options). Mechanism PROPOSED. |
| **Decided by** | Coach: R3-SES-02 (round 3, 2026-10-09); swaps from GEN-04 (round 1); "add more rear delts" from R3-VOL-01 |
| **Replaces** | A plan that changed only through the check-in |

## Decision (the rule)

The person or coach can:

1. **Switch off a block for a day.** A *block* is one part of a session, such as the core block or the athletic block (jumps, throws, agility).
2. **Remove or add** an exercise or a whole block.
3. **Swap** an exercise for another of the same category (the dropdown).
4. **Use supersets.** A *superset* is two exercises done back to back with rest after the pair. The plan recommends them to make the workout faster.

The generator still builds every plan by the rules first. Editing is what people do to their own plan afterwards.

## Why

> "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance." (R3-SES-02)

> "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (R3-SES-02)

> "an athlete or a coach should be able to modify accordingly." (R3-SES-02)

His example is a pickleball player who has played a lot, has sore calves, and does not feel like doing jumps that day.

## Context

Round 1 already set the dropdown: "pick the default and be able to do the drop-downs. That's going to be important." (GEN-04). Round 2 let coaches add core supersets anywhere (R2-SES-03) and let users ask for more or less cardio (R2-SES-06). Round 3 removed check-ins ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)), so editing became the only way a plan changes.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. A fixed plan (PDF only) | Nothing can change after printing | Set aside; kept as an export |
| B. Changes only through a weekly check-in | The tool decides | Retired |
| C. An editable template | Switches, add, remove, swap, suggested supersets | **Chosen** (R3-SES-02) |

## Consequences

- Switching off athletic, Olympic, core or conditioning work changes no muscle-set number. That work never counts toward muscle sets ([ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md)).
- The hard rule "core is never skipped" (GEN-08) now means the generator never leaves it out. The person may switch it off ([ADR-027](adr-027-core-first.md)).
- People and coaches can always add rear-delt work (R3-VOL-01, [ADR-018](adr-018-rear-delts-part-of-shoulders.md)). The editor's "add rear delts" option is part of the PROPOSED mechanism.

PROPOSED mechanism (not confirmed by the coach):

| Item | Proposal |
|---|---|
| Block ids | Every block has a stable id so a switch can apply to "this day" or "this day every week" |
| What can be switched off | Core, skill, athletic, Olympic, accessory, calves, focus, finisher, cardio. Not the warm-up. |
| Removed exercise | Its sets are not moved elsewhere automatically |
| After an edit | The tool shows minutes and weekly sets per group, and a note if a group drops below 10. Notes, never refusals. |
| Where edits live | Inside the plan the person keeps. Nothing is stored ([ADR-002](adr-002-no-data-kept.md)). |

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_editing.principle`, `plan_editing.block_kinds`, `plan_editing.edits` | The editing options |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_editing.superset_recommendations` | Which pairs are suggested |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.core_block.toggle` | The core block switch |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V30_editable` | The check that a plan is editable |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `session_limits.plan_editing_R3SES02`, `session_limits.superset_recommendation_R3SES02` | Same, in the volume algorithm |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §10.10.

## Related

[ADR-032](adr-032-time-vs-minimums-order.md) time vs minimums · [ADR-015](adr-015-library-source-of-truth-one-detail-variations.md) swaps and variations · [Sessions](../02-model/sessions.md)
