# ADR-022: Every plan is a stairway

Every plan climbs week by week like steps up a stairway. The steps are a little smaller in the first half and a little bigger after the halfway week, and the hardest weeks come last. The coach stated the shape in round 2 and approved the numbers in round 3: weekly sets grow about 3 % a week until the halfway week and about 5 % after it. The stairway is planned once, when the plan is built.

| | |
|---|---|
| **Status** | Accepted, refined on 2026-10-10 and in round 4: the 3 % / 5 % pattern is the usual shape, not a limit; the final sets are reached; a week may hold sets while reps or load progress ([ADR-053](adr-053-progression-written-as-a-rule.md)). |
| **Decided by** | Coach: R2-PER-03 (NOT RIGHT to "4 + 4, start hard"), R2-PER-04, R2-PER-05 (round 2); R3-VOL-04 (round 3) |
| **Replaces** | Plans with a deload in the middle; an 8-week plan with a "start hard" opening; a weekly step chosen from feedback |

> **Update, 2026-10-11 (CX-01 to CX-03, R4-PRG-01, R4-PRG-02).** The stairway shape stands: smaller steps early, bigger steps late, hardest weeks last. Three things changed. (1) The planned final sets are reached, even when that needs bigger steps than 3 % and 5 % (CX-01). (2) There is no hard limit on a weekly step. The 7 % and under-10 % rows below are **retired as limits**; a week that adds more than about 15 % carries a note instead (R4-PRG-02). (3) "Never flat" is about the plan: a group may keep its sets in a week when reps or load carry the progress, also at its top number (CX-02, CX-03). The top number arrives in the last week, one week early at most (R4-PRG-01). The planner rebuild mentioned below was replaced by engine 0.5 ([ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md)). Full rule: [ADR-053](adr-053-progression-written-as-a-rule.md).

## Decision (the rule)

| Item | Value | Source |
|---|---|---|
| Step until the halfway week | about 3 % of each group's weekly sets | R3-VOL-04 |
| Step after the halfway week | about 5 % | R3-VOL-04 |
| End point | each trained group reaches its ceiling in the last week, where the steps can reach it (see the INFERRED reading below) | R3-VOL-04 |
| ~~Most a group may grow in one week~~ | ~~7 %~~ retired as a limit (CX-01, R4-PRG-02) | R2-VOL-01 |
| ~~Too much~~ | ~~10 % a week~~ no longer a hard limit; a note above about 15 % (R4-PRG-02) | UNI-05 |
| Effort across the plan | 3 reps in the tank early, then 2, then 1-2, then 1 plus intensifiers in the last week; always inside 1-3 | R3-VOL-04 |
| How it should feel | starts like a 2, ends like an 11 | PER-01, R2-PER-05 |

Approved example: an intermediate's big muscle goes from 15 to 22 sets over 12 weeks. The last four weeks are 19, 20, 21, 22.

**Reps in the tank** (reps in reserve, RIR) means how many more reps you could have done. An **intensifier** is a harder set technique, such as a myo set (one long set split into short mini-sets).

## Why

> "the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." (R2-PER-03)

> "When they get to that halfway point and upwards, the steps get a little bit higher, but not too much." (R2-PER-03)

> "on a 12-week program, the last 4 weeks are going to be brutal." (R2-PER-04)

> "The program will just have its natural algorithm recommendation of growth throughout it" (R3-VOL-04)

"2 to 11" is a feeling, not a count of sets: "I'm just talking about how it feels and what level you're starting at." (R2-PER-05)

## Context

- The team's first plan shapes had a deload week in the middle or at the end. He marked them NOT RIGHT (PER-01).
- From his round-1 words about the 8-week plan, the team proposed four easier weeks, four hard weeks and about 10 % more sets at the start. He marked that NOT RIGHT and described the stairway (R2-PER-03).
- Round 3 put numbers on it. He approved them and added that no input from the person is needed.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Build, deload in the middle, build again | The team's first shapes | Rejected (PER-01) |
| B. 8 weeks as 4 + 4, starting hard | About 10 % more sets from week 1 | Rejected (R2-PER-03) |
| C. A step chosen each week from feedback | 3, 5 or 7 % by how the week went | Retired ([ADR-023](adr-023-weekly-percentages-by-size-or-by-person-retired.md)) |
| D. One planned stairway for every plan | Small steps, then bigger, hardest last | **Chosen** |

## Consequences

- The tool does the math and turns percentages into whole sets ([ADR-025](adr-025-where-a-new-set-goes.md)).
- Lifters already at their ceiling get the "11" from heavier loads and intensifiers, not from more sets on everything (R2-PER-05).
- His rule: the stairway climbs on every trained group and never goes flat, also when time is short (R3-SES-02). Counted in whole sets, a small plan cannot add a set to every group every week, so some weeks add none for a given group. Making this exact is one reason for the planner rebuild ([ADR-048](adr-048-optimizer-rebuild-of-the-planner.md)).
- When 3 % and 5 % would overshoot a group's ceiling, all its steps shrink by one factor so the peak lands on the ceiling in the last week. He approved the sizing: "each muscle's steps are sized so it reaches its ceiling exactly in the last week" is the team's proposal, which he marked RIGHT (R3-VOL-04). The single factor is the team's formula for it.
- The person's total weekly sets rise by less than 10 % a week (UNI-05). PROPOSED: one whole set may always be added, so a small plan can still climb.
- INFERRED reading for round 4: when the ceiling is far above the start, the standard steps do not reach it. The team keeps the step sizes and treats the ceiling as a maximum.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.principle`, `rule_tables.rate_engine.standard_steps` | The rule and the 3 % / 5 % / 7 % numbers |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.math`, `rule_tables.rate_engine.limits` | The formula and the limits |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.rate_engine.start_at_2_end_at_11`, `rule_tables.effort.planned_drift` | The felt level and the effort drift |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.fixed_12`, `plan_types.fixed_8` | The 12-week and 8-week shapes |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `stairway` | Same, with worked examples |
| [model/rules.json](../../model/rules.json) | `stairway.standard_steps` | Runtime copy (generated) |

Hard rules H10 and H21 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.4.

## Related

[ADR-043](adr-043-no-deload-inside-a-block.md) no deload inside a block · [ADR-026](adr-026-effort-in-reps-in-reserve.md) effort · [Stairway](../02-model/stairway.md)
