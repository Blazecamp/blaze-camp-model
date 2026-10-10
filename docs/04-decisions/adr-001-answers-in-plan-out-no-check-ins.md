# ADR-001: Answers in, the whole plan out. No check-ins

The tool takes a few answers and gives back the whole plan once, with every week visible ahead of time. Nothing comes back from the person afterwards: no check-ins, no tracking, no weekly adjustment by the tool. People and coaches adjust the plan themselves. The coach decided this in round 3. It retired a weekly check-in he had approved one round earlier.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: R3-VOL-02 and R3-VOL-04 (round 3, 2026-10-09) |
| **Replaces** | The optional weekly check-in (R2-GEN-01, R2-VOL-01) and adjusting the plan from logged effort (GEN-05) |

## Decision (the rule)

1. A person enters the basics: goal, sport or activity, plan length, experience, days, minutes, equipment, pain.
2. The tool builds the whole plan once. The coach calls this being able to "kick out a program".
3. Every week is shown before it begins. The growth is built in (the stairway, [ADR-022](adr-022-every-plan-is-a-stairway.md)).
4. Nothing is asked after the build. No check-in, no effort log, no readiness score.
5. The plan is a template. The person or their coach adjusts it ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).

A **check-in** here means a short weekly form (effort, sessions done, pain) that the tool would read to change next week.

## Why

> "we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." (R3-VOL-02)

> "I don't want people to be checking back on their phone in their program. I want them to be able to kick out a program, and that's it." (R3-VOL-04)

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

His reasons, in short: it must be very simple, people should see the whole thing ahead of time, and the program should not depend on inputs.

## Context

- Round 1: he said people should track on their own, "notebook or whatever" (GEN-03). He also marked RIGHT a proposal to adjust the plan from logged effort (GEN-05).
- Round 2: he approved an optional 1-minute weekly check-in (R2-GEN-01) and a table that turned effort into next week's step (R2-VOL-01). He added that without a check-in "the plan doesn't change. There is no data to go off of." (R2-VOL-03)
- Round 3: we asked a detail about that table. He removed check-ins altogether (R3-VOL-02), and repeated it when he approved the stairway numbers (R3-VOL-04).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Whole plan once, no feedback | The stairway is planned at build time. People adjust it themselves. | **Chosen** (R3-VOL-02, R3-VOL-04) |
| B. Plan + optional weekly check-in | Effort, sessions done and pain decide next week's step. | Approved in round 2, retired in round 3 |
| C. Plan adjusted from a logbook | The tool reads logged EFFORT and HOW IT FELT. | Retired (GEN-05 superseded) |
| D. Week-by-week mode | No fixed length, driven by check-ins. | Retired as a mode, because it ran on check-ins. This is the team's reading and goes back to him as N-PROD-22 ([ADR-042](adr-042-plan-lengths.md)) |

## Consequences

- The plan must be right when it is built. Nothing corrects it later.
- The plan prints a short "How to adjust this plan" guide. Its wording is PROPOSED.
- Pain named at intake shapes the plan. During the block the person swaps the exercise, cuts sets, or drops it (VOL-03). Nothing is logged.
- Moving an exercise up a level, and starting the next block one step higher, are the person's or coach's call at the next build.
- The EFFORT, HOW IT FELT? and DONE? columns of his sheet stay in the downloaded sheet for the person's own notes. The tool never reads them (PROPOSED detail).
- Retired and not to be rebuilt: the check-in table, the readiness score, the logbook as an input, `adapt()`, the "block at risk" offer, and week-by-week as a check-in mode.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.no_feedback` | Nothing after the build changes the steps |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `adaptation.status`, `rule_tables.rate_engine.retired` | The retired check-in logic |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.removed_fields`, `validation_checks.V26_inputs` | Output-mode field removed; no tracking field allowed |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `stairway.checkin_retired_v1_2` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `stairway.no_checkin` | Runtime copy (generated) |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.4 and §13.5. Hard rule H22 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-002](adr-002-no-data-kept.md) no data kept · [ADR-003](adr-003-no-lifestyle-inputs.md) no lifestyle inputs · [ADR-023](adr-023-weekly-percentages-by-size-or-by-person-retired.md) retired percentages · [What he rejected](../01-philosophy/what-he-rejected.md) · [Changes across rounds](../03-coach-answers/changes-across-rounds.md)
