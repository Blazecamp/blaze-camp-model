# ADR-048: Rebuild the planner as an optimizer

The part of the engine that decides how many sets go where is being rebuilt. The first version worked in steps, one after another, and each fix moved the problem somewhere else. The new version will decide the whole plan together and check exactly whether the coach's rules fit the time. This is a team decision, taken on 2026-10-09 after repeated reviews graded the eight sample plans D at first and between D and B- after two rounds of fixes ([samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md)). The coach's rules do not change. Only the way the tool satisfies them does. The design is in progress and the final choice of method is not made yet.

| | |
|---|---|
| **Status** | **Superseded** (2026-10-11) by [ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md). The optimizer was designed and not built. |
| **Decided by** | Team, following the coach's request for the best possible algorithms (conversation; VOL-06) |
| **Replaces** | The first engine's step-by-step dosing |

> **Superseded. The optimizer is not being built.** Most of its difficulty came from fitting plans into session minutes, and the coach removed that requirement (CT-01, [ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)). The engine was rebuilt as version 0.5 around his own templates instead ([ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md)). The design documents named below stay in `design/` as research. The measurements in "Context" are still the reason the first engine was replaced. The text below is kept as history.

## Decision (the rule)

A **planner** is the code that turns the rules and a person's answers into sets per exercise per week. An **optimizer** searches all the valid plans and picks the best one by a fixed order of priorities.

1. Stop patching the step-by-step planner. Rebuild it.
2. Decide these things together, in one model: which groups are trained, on which days, sets per exercise per week, athletic doses and supersets.
3. Follow the coach's priorities in a fixed order. Safety and hard rules come first, then his time-versus-minimums order, then floors, the climbing stairway, time fit and the rest.
4. Use exact checks. A group is dropped only when no plan can fit it.
5. Keep it deterministic: the same answers always give the same plan. Keep it plain JavaScript that runs in a browser.
6. Score every plan with a checker that is separate from the planner.

## Why

He asked for "the best mathematical, logical algorithms possible to make sure this is top of the line. Spare no expense." (conversation)

> "I need this tool that we're building eventually to figure out the percentages. This would be the most advanced algorithm for training for humans that has ever been created." (VOL-06)

## Context

The first engine always produced a complete plan that passed its own checks. Reviewers then read the eight sample plans the way the coach would. The structure was right. The dosing was not. The team's diagnosis measured the following on those plans:

| Problem | What was measured |
|---|---|
| Groups under the floor | 4 of 8 plans trained a group below 10 sets for the whole block |
| Flat stairways | On most plans more than half of the week-to-week steps added no set to a trained group |
| Days too long | Days ran over the chosen minutes |
| Too many exercises | Full-body days had no working limit |
| Athletic work off target | Jumps and change-of-direction work far below the sport's budget in some plans |
| Unstable choices | Giving a person more time could remove a group that less time had trained |

The cause was the design, not one bug: separate steps each decided part of the dose without seeing the others, and several places cut for time. These are the rules of [ADR-017](adr-017-floor-of-10-on-focus-groups.md), [ADR-022](adr-022-every-plan-is-a-stairway.md), [ADR-031](adr-031-two-to-four-exercises-per-group.md) and [ADR-032](adr-032-time-vs-minimums-order.md).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Keep patching the first planner | Fix each review finding in place | Rejected: each round of fixes moved the problem somewhere else |
| B. One exact optimization of the whole block | Everything in a single mathematical model | Under study |
| C. Two stages | First the weekly sets per group per week, then packing them into days | Under study; favoured in a first, provisional review |
| D. Coach templates with a few solved numbers | His day templates as fixed skeletons, scaled exactly | Under study; ideas to be carried over |

The research note recommends an exact, layered approach that mixes these. No final specification exists yet.

## Consequences

- The folders `engine/`, `model/`, `tests/` and `samples/` are changing. To learn the coach's rules, read the model documents, not the engine code.
- The math makes some rule conflicts visible. Example: making every group reach its ceiling exactly in the last week, and never letting the weekly total go flat, cannot always both hold in small plans. Those go to the coach as questions.
- On some day templates a group cannot reach 10 sets at any session length. The honest offer is then "add a day", not "longer sessions".
- The sample plans will be regenerated and read again with a coach's eye. He has said he will grade them (R2-GEN-07).
- Nothing in this record is a coaching rule. If the rebuild needs a new number or a tie-break, it is PROPOSED until he approves it.

## Where it lives in the data

There is no data key for this decision. The working documents are:

| File | What |
|---|---|
| [design/diagnosis.md](../../design/diagnosis.md) | The measurements and root causes |
| [design/algorithm_research.md](../../design/algorithm_research.md) | The methods studied and the recommendation |
| [design/rules_as_constraints.md](../../design/rules_as_constraints.md) | Every coach rule written as a constraint, with its source |
| [samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md) | Every issue the reviewers found in the sample plans |
| [engine/DECISIONS.md](../../engine/DECISIONS.md) | The first engine's judgement calls |

## Related

[Roadmap](../06-history/roadmap.md) · [Timeline](../06-history/timeline.md) · [AGENTS.md](../../AGENTS.md)
