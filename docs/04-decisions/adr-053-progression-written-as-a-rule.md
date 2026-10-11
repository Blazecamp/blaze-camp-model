# ADR-053: Reps and load progress are written as a rule the person applies

The plan never promises a number of reps or a weight for a given week. Each lift prints a rep range and one rule: when you reach the top of the range on every set with the planned reps left in the tank, add weight next time and start again at the bottom. The person applies the rule. Nothing is reported back. The coach approved this in round 4. The same round settled when the top set number arrives, how fast sets may rise, and where the next block starts.

| | |
|---|---|
| **Status** | Accepted. The wording for fixed-rep and pyramid lifts, and two small numbers, are PROPOSED. |
| **Decided by** | Coach: R4-PRG-03 (the rule), R4-PRG-01, R4-PRG-02, R4-PRG-04 (round 4, 2026-10-11); CX-01, CX-02, CX-03 (2026-10-10) |
| **Replaces** | Week-by-week rep or load targets; the hard step limits of 7 % for a group and under 10 % for the weekly total; "sets must rise every week" |

## Decision (the rule)

| Subject | Rule | Source |
|---|---|---|
| Reps and load | Written as a rule: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Never a promise such as "week 3: 12 reps". | R4-PRG-03 |
| Sets | Weekly sets per muscle group climb from the start to the planned final number, and the final number is reached. | CX-01 |
| How fast | The usual pattern is about 3 % a week to halfway and about 5 % after. Steps may be bigger when the target needs it. There is no hard limit. | R3-VOL-04, CX-01, R4-PRG-02 |
| A big step | A week that adds more than about 15 % carries a clear note: this week jumps more than usual, adjust if needed. | R4-PRG-02 |
| When the top arrives | In the last week when the math allows. One week early, then holding with more reps or load, is fine. Never earlier. | R4-PRG-01 |
| Same sets, still progress | A week may keep the same sets while reps or load go up. | CX-02 |
| At the top number | Sets stay. Progress comes from reps and load. | CX-03 |
| The next block | Starts a little above where the last block started: about 5 % more, in whole sets, never above the level's top number. | R4-PRG-04 |
| Editing | The person can change the sets of any day or week. | CX-02, CX-04 |

**Reps in the tank** means reps in reserve (RIR): how many more reps were possible at the end of a set ([ADR-026](adr-026-effort-in-reps-in-reserve.md)).

## Why

There are no check-ins ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)), so the tool cannot know what a person lifted last week. A promised number would be a guess. A rule works for everyone and needs no data. He approved the rule as proposed (R4-PRG-03, RIGHT). On the next block he added: "Yeah, and it has to be logical." (R4-PRG-04)

On reaching the target he had already said: "no, go ahead and increase faster if thats the need, they could edit accordingly" (CX-01). On same-set weeks: "yes but also should be editable if they want to adjust their sets on that week or that day doesnt matter" (CX-02).

## Context

[ADR-049](adr-049-endpoint-priority-and-editable-progression.md) recorded the direction on 2026-10-10 and left four things open: the exact arrival week, whether faster steps have a limit, how rep and load progress is written without check-ins, and where the next block starts. Round 4 asked those four questions. He marked all four RIGHT.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Promise a number per week | "Week 3: 12 reps", "week 5: add 5 lb" | Not chosen. The tool never sees what was lifted. |
| B. A rule the person applies | Double progression inside a rep range | **Chosen** (R4-PRG-03) |
| C. A hard limit on weekly set increases | Keep 7 % and 10 % as limits | Retired (CX-01, R4-PRG-02) |
| D. No limit and no note | Let short blocks jump silently | Not chosen. The note is the safeguard he approved. |
| E. Reach the top two or more weeks early | Hold longer at the top | Not chosen: "Never earlier than that" (the proposal he marked RIGHT, R4-PRG-01) |

## Consequences

- The numbers of [ADR-022](adr-022-every-plan-is-a-stairway.md) (3 % and 5 %) remain the usual pattern. They are no longer limits.
- "The stairway is never flat" now means: the plan as a whole always progresses. A group may hold its sets in a week when reps or load carry the progress.
- A hold is honest only when something else progresses. The plan never labels an unchanged prescription as progress.
- PROPOSED: a single whole set is never flagged as a big step, even when it is more than 15 % of a small number. It is the smallest step a group can take.
- PROPOSED: while a group is below its top, the next block starts at least one whole set higher.
- PROPOSED: the wording of the rule for lifts with fixed reps and for pyramids. Timed circuits progress by seconds and rounds instead.
- Pain keeps its own slow steps (VOL-03). Faster steps do not apply to a painful area.
- An edited plan is marked as edited. Its totals are recomputed and the checks that judge the generated layout no longer vouch for it ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-PRG-01 to R4-PRG-04 | His answers |
| [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md) | CX-01 to CX-04 | The earlier clarification |
| `model/rules.json` | `stairway.progression` | Target reached, arrival at most one week early, the 15 % note, flat weeks allowed |
| `model/rules.json` | `stairway.standard_steps` | 0.03 early, 0.05 late: the usual pattern |
| `model/rules.json` | `cycles.next_block` | 105 / 100, whole sets, never above the top |
| `model/rules.json` | `render.progression`, `render.acceleration` | The printed rule and the big-step mark |
| `engine/progression/stairway.mjs`, `engine/progression/prescription.mjs` | | The arithmetic |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | CX-01..04, R4-PRG-01..04 | The master-document section and the spec key |

## Related

[ADR-022](adr-022-every-plan-is-a-stairway.md) · [ADR-049](adr-049-endpoint-priority-and-editable-progression.md) · [ADR-025](adr-025-where-a-new-set-goes.md) · [Stairway](../02-model/stairway.md) · [Coach answers: progression](../03-coach-answers/progression.md#r4-prg-03)
