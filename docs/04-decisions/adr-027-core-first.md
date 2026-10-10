# ADR-027: Core first

Every session opens with core work, right after the warm-up. It is a light opener: 2 exercises of 2 sets, short of failure. The person can move the core block, add core supersets anywhere, or switch a day's core block off. The coach set "core first" in round 1, overruling the team's reading of his sheets, and approved the light dose in round 2.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: ATH-11, verdict NOT RIGHT to the team's assumption (round 1); R2-SES-03 (round 2); R3-SES-02 (round 3) |
| **Replaces** | Core after the power block for athletes, and separate or optional for physique clients |

## Decision (the rule)

| Item | Rule | Source |
|---|---|---|
| Position | First, after the warm-up, for everyone | ATH-11 |
| Dose when first | 2 exercises × 2 sets, short of failure, as a warm-up | R2-SES-03 |
| Moving it | The person may move it to after the jumps or after the strength work | ATH-11 |
| Extra core | Core supersets or monster sets may be added anywhere | R2-SES-03 |
| Switching it off | The person or coach may switch off that day's core block | R3-SES-02 |
| The generator | Never leaves core out by itself | GEN-08 |

## Why

> "No, we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff." (ATH-11)

> "Some athletes like to do it at the end, so that's why I want them to be able to move it around if they need to." (ATH-11)

On adding core elsewhere: "It should be optional to be thrown anywhere" (R2-SES-03).

## Context

In his baseball program the core items sit right after the power block. The team read that as "core early for athletes" and left it optional for physique clients. He said no: core first, so people "get it out of the way". The team then asked whether core before jumps and Olympic lifts should stay light. He agreed.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Core after the power block (athletes only) | What the baseball sheet shows | Rejected (ATH-11) |
| B. Core last, as a finisher | Common in gyms | Allowed if the person moves it; not the default |
| C. Core first for everyone, light, movable | His model | **Chosen** |

## Consequences

- The opener must stay light so it does not tire the jumps and lifts that follow. Hard core finishers appear only when the person moves core to the end (R2-SES-03).
- Core exercises come in two kinds: the trunk moves on a still pelvis (thorax), or the pelvis and legs move on a still trunk (pelvis) (CAT-08). Using one of each in the opener is PROPOSED.
- For field athletes the 2 core exercises sit on top of the cap of 12 exercises (R2-SES-04).
- Switching the core block off changes no muscle-set number for the other groups.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.core_block` | Position, dose, add-ons, the switch |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.ordering.tiers` | Where core sits in the session order |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.session_limits.core_opener` | The opener in the session limits |
| [model/rules.json](../../model/rules.json) | `core_block` | Runtime copy (generated) |

Hard rule H05 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-028](adr-028-power-first-horizontal-before-vertical.md) session order · [ADR-005](adr-005-editable-plan-switches-and-supersets.md) editing · [Sessions](../02-model/sessions.md)
