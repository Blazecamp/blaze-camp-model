# ADR-058: Engine v0.5 is template-first. The large planner is not being built

The plan engine was rebuilt as version 0.5 around the coach's own templates. It sizes sessions by exercise count, climbs each muscle group's weekly sets to the planned final number, and prints everything it could not fit instead of cutting. The large two-stage optimizer planned in [ADR-048](adr-048-optimizer-rebuild-of-the-planner.md) is not being built. Its design documents stay in the repo as research. This is a team decision. It follows from the coach removing time-fitting and from his round-4 word to build the engine now.

| | |
|---|---|
| **Status** | Accepted (team). Engine 0.5.0 is built and tested. The coach has not graded its sample plans. |
| **Decided by** | Team, 2026-10-11, in [design/ENGINE_V05_PLAN.md](../../design/ENGINE_V05_PLAN.md). Follows the coach: CT-01, R4-SES-01 to R4-SES-05, R4-REL-01, R4-REL-02 |
| **Replaces** | [ADR-048](adr-048-optimizer-rebuild-of-the-planner.md): rebuild the planner as an optimizer |

## Decision (the rule)

1. Do not build the two-stage planner of `design/PLANNER_SPEC.md`. Keep it and `design/IMPLEMENTATION_PLAN.md` as research.
2. Build engine v0.5 in four packages: structure and volume; library and selection; words and checks; integrate.
3. The engine does these things, in this order of importance:
   - no time-based behaviour anywhere ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md));
   - his templates as the skeleton ([ADR-051](adr-051-coach-templates-are-the-skeleton.md));
   - every trained group reaches its planned final sets, or the plan says why not ([ADR-053](adr-053-progression-written-as-a-rule.md));
   - the hard rules hold in every plan.
4. Keep it plain JavaScript with no dependencies, and deterministic: the same answers always give the same plan.
5. Score plans with a checker that is separate from the engine.

**How volume is allocated**, in plain steps: (1) each trained group's weekly sets come from the stairway; (2) the sets are split over the template slots that train the group, first exercise first, alternating between the two days of the same type; (3) an exercise holds 2 to 5 sets (2 to 4 for a beginner), and when the slots cannot hold a group's sets the plan adds his bonus exercise on the optional day, or caps the group and says so; (4) credits are recounted from the real exercises and printed per group.

## Why

> "I want you to not get complicated over the time." (CT-01)

> "I think you can try to build it now." (R4-REL-02)

Most of the difficulty in the large planner came from fitting plans into session minutes. He removed that requirement. What was left could be solved exactly with his templates and simple arithmetic.

## Context

The first engine graded C to D with reviewers reading the sample plans as he would. [ADR-048](adr-048-optimizer-rebuild-of-the-planner.md) chose a rebuild as an optimizer, and a full specification was written. Before it was built, three things happened in two days: he took time out of the problem (CT-01), he chose endpoint over rate limits (CX-01 to CX-04, [ADR-049](adr-049-endpoint-priority-and-editable-progression.md)), and round 4 fixed session size, his templates and the 2-day rule. For round 4 the team proposed building later, with the planner design. His answer was PARTLY: "I think you can try to build it now." (R4-REL-02)

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Build the two-stage optimizer as specified | Weekly sets per group first, then packing into days by time | Not built. Its hardest part, the time fit, is no longer required. |
| B. Keep patching engine 0.4 | Leave the time logic and switch it off | Rejected. Dead time-fitting code was deleted, not disabled. |
| C. Template-first engine | His skeletons, exact whole-set arithmetic, nothing cut | **Chosen** |

## Consequences

- Measured on 2026-10-11 (the engine's own numbers, in [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md), not a coach grade): all tests pass; a sweep of 1,578 generated plans has no failing error check; the 8 sample plans come out complete; reviewers reading the samples as he would graded them between B- and B+. The goal of B+ or better on every sample is not met yet.
- Known gaps: the athletic layer (jumps, throws, sprints, Olympic sets) is often under a sport's weekly target; some A / B plans cannot hold a high set target for chest or arms and say so; small kits repeat exercises.
- The engine made judgement calls where he gave no number. Each is marked PROPOSED in [engine/DECISIONS.md](../../engine/DECISIONS.md) section G and listed as an open question in the status document.
- R4-REL-01 approved releasing the model as v1.3. The engine is version 0.5.0 and is still young: read its status document before relying on it.
- The benchmark and its scorer no longer contain any time metric.
- Nothing in this record is a coaching rule.

## Where it lives in the data

There is no data key for this decision. The working documents are:

| File | What |
|---|---|
| [design/ENGINE_V05_PLAN.md](../../design/ENGINE_V05_PLAN.md) | The binding plan for engine v0.5 |
| [engine/README.md](../../engine/README.md), [engine/CONTRACTS.md](../../engine/CONTRACTS.md), [engine/DECISIONS.md](../../engine/DECISIONS.md) | What the engine does, its data shapes, its judgement calls (section G) |
| [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) | What changed, test counts, benchmark numbers, known gaps |
| [design/PLANNER_SPEC.md](../../design/PLANNER_SPEC.md), [design/IMPLEMENTATION_PLAN.md](../../design/IMPLEMENTATION_PLAN.md) | The large planner: research only |
| `design/bench/` | The 94 benchmark intakes and the scorer |

## Related

[ADR-048](adr-048-optimizer-rebuild-of-the-planner.md) (superseded) · [ADR-049](adr-049-endpoint-priority-and-editable-progression.md) · [For developers](../00-overview/for-developers.md) · [Roadmap](../06-history/roadmap.md)
