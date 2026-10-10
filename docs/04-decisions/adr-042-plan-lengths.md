# ADR-042: Plan lengths and what each is for

The tool offers a small set of plan types, each with a purpose. A 12-week plan is the coach's preferred training plan. An 8-week plan is the shorter one. Plans of 4 to 6 weeks are for maintenance and transitions, not for building. A yearly plan is for the general population. A week-by-week plan with no fixed length was on his round-1 list, but it depended on check-ins and is retired as a mode. He set the lengths in round 1 and refined them in rounds 2 and 3.

| | |
|---|---|
| **Status** | Accepted. The week-by-week replacement and the year's week-by-week layout are PROPOSED. |
| **Decided by** | Coach: PER-01, verdict NOT RIGHT to the team's shapes (round 1); R2-PER-01, R2-PER-02, R2-PER-06 (round 2); R3-PER-01 (round 3) |
| **Replaces** | Three building plans of 6, 8 and 12 weeks, each with a deload or test week inside |

## Decision (the rule)

A **maintenance** phase is a stretch at lower volume that lets the body recover without pushing.

| Plan | What it is for | Source |
|---|---|---|
| 12 weeks | The preferred training plan. The last 4 weeks are the hardest. | PER-01, R2-PER-04 |
| 8 weeks | A shorter training plan. The same stairway. | PER-01, R2-PER-03 |
| Longer than 12 weeks | Repeat another 12 weeks, one step up | PER-01 |
| 4 to 6 weeks | Maintenance or transition: vacation, travel, moving, a season change. About 50 to 70 % of the volume. The person chooses how many weeks. | PER-01, R2-PER-06 |
| Pre-season | A 4-6-week block at about 60 % of off-season sets, more speed and power, ending with a 1-2-week taper | R2-PER-06 |
| A full year | For the general population that wants to stay in shape | PER-01, R2-PER-01 |
| Week by week | Retired as a mode, because it ran on check-ins. This is the team's reading and goes back to him (N-PROD-22). | PER-01; R3-VOL-02, R3-VOL-04 (INFERRED) |

The year he approved (R2-PER-01): January to March hard work with more cardio and the start of a cut; April to June summer shape; July to September maintenance at about 70 %; October to mid-December building muscle with less cardio; the last 2 weeks of December maintenance. People can re-order and tune it (R2-PER-02). Athletes follow their season instead.

## Why

> "So, usually, the 6-week plans are not necessarily needed. I would like for people to be able to use the 4- to 6-week plans when they need to transition" (PER-01)

> "Usually, I like, personally, on my model, the 12-week programs." (PER-01)

> "Anything more than 12 weeks, they can just repeat another 12 weeks." (PER-01)

On the year: "this is for the general population that wants to just stay in shape" (R2-PER-01).

## Context

At the start he spoke of 6-, 8- or 12-week plans. The team gave each one a building phase and a deload or test week. He marked that NOT RIGHT and described a purpose for each length instead, adding the week-by-week and yearly ideas in the same answer.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. 6, 8 and 12 weeks, all building plans with a deload | The team's first shapes | Rejected (PER-01) |
| B. One 12-week plan only | Nothing for travel, seasons or the year | Too narrow |
| C. Plan types by purpose | Train, maintain, pre-season, year | **Chosen** |

## Consequences

- Every training plan is a stairway ([ADR-022](adr-022-every-plan-is-a-stairway.md)) with no deload inside ([ADR-043](adr-043-no-deload-inside-a-block.md)).
- When a plan ends, it ends. The person builds the next one (R3-PER-01).
- Week by week: his idea was "Just keep me in line" with no set structure (PER-01). In round 2 it ran on the weekly check-in. With no check-ins it cannot work as designed. PROPOSED: the choice opens a 12-week plan shown one week at a time. This goes back to the coach (N-PROD-22).
- Holiday and vacation weeks are planned between blocks (R3-PER-01).
- INFERRED reading: the December maintenance was automatic in rounds 1 and 2. In PER-01 he said the tool "automatically puts you in maintenance", and in R2-PER-01 he marked RIGHT a proposal with "automatic maintenance". It is now printed by default, and the person can switch it off, because round 3 made maintenance a recommendation (R3-PER-01).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.fixed_12`, `plan_types.fixed_8`, `plan_types.maintenance_4_6`, `plan_types.year`, `plan_types.season` | Each plan type |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.week_by_week` | The retired mode and its proposed replacement |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fields.F25` | The plan-type question |
| [synthesis/06_periodization.json](../../synthesis/06_periodization.json) | `plan_length_model` | The plan-length model |
| [model/rules.json](../../model/rules.json) | `plan_types` | Runtime copy (generated) |

Human text: [synthesis/06_periodization.md](../../synthesis/06_periodization.md). Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §11.

## Related

[ADR-044](adr-044-tests-at-start-and-end.md) tests · [ADR-001](adr-001-answers-in-plan-out-no-check-ins.md) no check-ins · [Stairway](../02-model/stairway.md)
