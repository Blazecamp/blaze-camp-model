# Coach clarification: progression and editable templates

Date: 2026-10-10. Source: Lalo Vera's answers in the Codex conversation reviewing this repository. This is a new answer record, not an edit to any earlier transcript.

**Authority:** `COACH-CX CX-01..04`. These later answers supersede earlier answers only on the specific subjects below. All unrelated coach rules still stand. CX-04 indexes the accompanying product explanation, not a fourth questionnaire answer. The questions below are context summaries, not verbatim transcript quotations. The answer blocks are verbatim.

## CX-01: Reach the planned endpoint, allowing faster increases

Question context: If reaching the final planned set target requires faster increases than the existing rate rules permit, should the plan finish with fewer sets instead?

> 1) no, go ahead and increase faster if thats the need, they could edit accordingly

**Approved meaning:** Do not deliberately undershoot the final target merely to preserve the earlier progression-rate limits. Faster set increases are permitted when needed to reach it. The user or coach may edit the result.

**Boundary:** No replacement percentage, unrestricted new ceiling, or universal maximum increase was specified. This resolves the rate-versus-endpoint conflict; it does not waive time, equipment, effort, population, or other constraints. Endpoint feasibility still has to be demonstrated. The exact accelerated schedule and handling of impossible combinations require engineering work and clearly labelled proposals where coaching policy is absent.

## CX-02: The same sets can support continued progress

Question context: Can a week keep the same number of sets while progression comes from reps or load?

> 2) yes but also should be editable if they want to adjust their sets on that week or that day doesnt matter

**Approved meaning:** Consecutive weeks need not always add sets if there is meaningful planned progression through reps or load. People may change sets for an individual day or week. This is not permission to label an unchanged prescription as progress or to add automatic check-ins.

## CX-03: Progress without increasing sets beyond the ceiling

Question context: Once the maximum weekly sets are reached, can sets stay there while progress comes from reps or load?

> 3) yes but they should be able to edit accordingly

**Approved meaning:** At the set ceiling, keep sets level and use reps or load for further progression. The prescription remains editable. The answer does not establish new set ceilings or approve an exact next-block rounding formula.

## CX-04: The output is an editable template

The coach's accompanying explanation, verbatim:

> This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to. Ideally, the tool is just so great and smart that edits are probably not going to be needed if it's that intuitive and it's built that well for any type of sport, the general population, or an older generation. Young people like it. It should be so intuitive and so good with everything that we've been putting into it that it will be editable, but they might not need to most of the time.

**Approved direction:** A coach or individual receives a complete, usable starting template and can adjust it. Editing is not restricted to swaps or block switches; day-level and week-level sets are explicitly included. Broad usefulness is the goal, not a claim that the current algorithm is validated for every sport or population.

## What remains unchanged

- One initial intake and a complete program output. No stored personal data, tracking, check-ins, or feedback-driven adaptation.
- Future open-source use, mobile-friendly delivery, and English and Spanish remain the product direction. This clarification does not commission a website or introduce new intake fields.
- Existing exercise, equipment, session, effort, population and scope rules remain unless specifically superseded above. An editable template is not a guarantee that every possible user edit follows those rules.
- Coaching intent and scientific evidence remain separate. These answers record intent; they are not evidence that a faster increase is optimal or suitable for every person. Evidence-based objections are "for discussion with the coach".

## Implementation status and safeguards

**Policy approved; implementation incomplete.** The existing runtime and canonical numeric tables have not been migrated by this record. See [ADR-049](docs/04-decisions/adr-049-endpoint-priority-and-editable-progression.md) and the controlling addenda in [PLANNER_SPEC.md](design/PLANNER_SPEC.md) and [rules_as_constraints.md](design/rules_as_constraints.md).

Engineering requirements, not additional coach quotations:

1. Replace proofs and tests that depend on rate-limited arrival or at most one added set per group per week before claiming the new planner meets this policy.
2. Show when the default rate pattern was accelerated. Do not rely on the user discovering or repairing a conflict.
3. Recalculate volume credits, session time and applicable constraints after edits. Distinguish the validated generated template from a changed, unvalidated or conflicting version; never silently retain an obsolete validation result. Exact edit handling is still PROPOSED.
4. Handle already-at-cap starts without dividing by zero or requiring another set. Reconcile next-block rounding and exact saturation separately.
5. Keep the old engine as default until the design, tests, independent reviews and release approval gates pass. These answers are not approval of all other planner defaults or of production promotion.
