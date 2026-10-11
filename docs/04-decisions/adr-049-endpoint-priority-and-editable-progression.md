# ADR-049: Endpoint priority and editable progression

The generated template should reach its planned final set target, allowing faster increases when needed. Some weeks, and weeks already at the set ceiling, may keep the same sets while progressing through reps or load. The person or coach can edit any day's or week's sets as well as the rest of the template.

| | |
|---|---|
| **Status** | Accepted. Completed by round 4 (R4-PRG-01 to R4-PRG-04) and built in engine 0.5.0. See [ADR-053](adr-053-progression-written-as-a-rule.md). |
| **Decided by** | Coach, 2026-10-10: [COACH-CX CX-01..04](../../coach_answers_codex_2026-10-10.md) |
| **Replaces** | Ending below the target solely to preserve rate limits; interpreting "never flat" as an obligatory extra set every week; interpreting output-only as uneditable |

> **Update, 2026-10-11.** Round 4 answered what this record left open. The top set number arrives in the last week, one week early at most (R4-PRG-01). There is no hard limit on a weekly step; a week that adds more than about 15 % carries a note (R4-PRG-02). Rep and load progress is written as a rule the person applies (R4-PRG-03). The next block starts about 5 % above the last block's start, never above the level's top (R4-PRG-04). Time is no longer a constraint at all (CT-01), so where the text below says "time", read "the other rules". The large planner it points to was not built ([ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md)); the rules now live in the model data: `model/rules.json` → `stairway.progression`, `cycles.next_block`, `render.progression`. [ADR-053](adr-053-progression-written-as-a-rule.md) holds the full rule.

## Decision (the rule)

| Subject | Decision | Source |
|---|---|---|
| Rate versus endpoint | Increase faster when needed to reach the target; no new numeric maximum was supplied | CX-01 |
| Same-set weeks | Allowed with meaningful reps or load progression | CX-02 |
| At the set ceiling | Hold sets and progress through reps or load | CX-03 |
| Editing | The template is editable, including sets by day or week | CX-02..04 |
| Data and feedback | No storage, tracking or check-ins; editing is not an adaptive feedback loop | R3-VOL-02, R3-VOL-04, R3-GEN-01; unchanged |

## Why

The coach chose reaching the planned target over ending below it: "go ahead and increase faster if thats the need" (CX-01). He also explicitly allowed people to adjust sets on a week or a day (CX-02). The aim is a strong starting template, not a locked prescription.

## Context

The original planner draft could demand exact final arrival while also forbidding the rate needed to get there. It assumed at most one added set per group per week, and its normalized progress expression was undefined when starting sets already equalled the ceiling. The coach resolved the policy choices; the mathematics and implementation still require reconciliation.

## Options considered

| Option | Outcome |
|---|---|
| Finish below target solely to preserve prior rate limits | Rejected by CX-01 |
| Accelerate as needed while respecting other constraints | Approved direction; exact schedule still to be derived |
| Require additional sets every week, even at the ceiling | Replaced by CX-02 and CX-03 |
| Allow only exercise swaps or whole-block switches | Expanded by CX-02..04 |

## Consequences

- CX-01 overrides conflicting 3%/5% rate-pattern and 7%/10% limit interpretations when they prevent the planned endpoint. It does not remove final set ceilings or waive time, effort, equipment, population or scope rules.
- Earlier rules remain historical sources. Current consumers must read this dated clarification before applying them.
- The generalized accelerated schedule, valid upper bounds, proofs, rounding, already-at-cap cases and tests must agree before release. No "greatest" or universally optimal algorithm claim follows from these decisions.
- **PROPOSED editing mechanics:** recompute credits, time and rule checks after every relevant edit; expose conflicts and changed validation status without silently undoing the person's changes. No storage or tracking is needed for this.
- D1, D4, D13 and other unresolved planner choices are not automatically approved by these answers. Neither is a production switch.

## Where it lives in the data

| File | What it holds |
|---|---|
| [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md) | Exact answers, context, scope and authority |
| [PLANNER_SPEC.md](../../design/PLANNER_SPEC.md) | Controlling addendum and outstanding algorithm changes |
| [rules_as_constraints.md](../../design/rules_as_constraints.md), [JSON](../../design/rules_as_constraints.json) | Formal constraint reconciliation status |
| [planner_build.js](../../workflows/planner_build.js) | Fail-closed design, review and promotion gates |

The canonical model tables and runtime are not updated by this record. Do not confuse an approved policy with implemented behavior.

## Related

[ADR-001](adr-001-answers-in-plan-out-no-check-ins.md), [ADR-005](adr-005-editable-plan-switches-and-supersets.md), [ADR-022](adr-022-every-plan-is-a-stairway.md), [ADR-047](adr-047-authority-order-and-evidence-labels.md), [ADR-048](adr-048-optimizer-rebuild-of-the-planner.md).
