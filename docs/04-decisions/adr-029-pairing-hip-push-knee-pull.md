# ADR-029: Pair hip-dominant with a push, knee-dominant with a pull

When a session mixes lower and upper body work, a hip-dominant lower lift is paired with an upper-body push, and a knee-dominant lower lift with an upper-body pull. The two lifts work opposite sides of the body, so fatigue from one does not spill into the other. A second rule decides whether a day pairs the same lower pattern or crosses patterns, and that goes by goal. The coach explained both in round 1.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: UNI-11, ORD-06, UNI-06 (round 1); R3-SES-01 for athletes (round 3) |
| **Replaces** | Pairing by direction only (the team's reading of his sheets) |

## Decision (the rule)

**Hip dominant** means the hips do most of the work (deadlift, Romanian deadlift or RDL, hip thrust): the back of the lower body. **Knee dominant** means the knees do (squat, lunge): the front.

| Lower lift | Paired upper lift | Example |
|---|---|---|
| Hip dominant | Push (chest, shoulders) | RDL + bench press |
| Knee dominant | Pull (back) | Squat + row |

Same pattern or cross pattern, by goal (UNI-06):

| Pairing | What it is | Who |
|---|---|---|
| Same pattern | Two lifts for the same lower pattern, e.g. squat + lunge | Physique clients, high-level athletes who need more stimulus |
| Cross pattern | One knee lift + one hip lift, e.g. squat + single-leg RDL | Bootcamp, general clients, most athletes (R3-SES-01) |

## Why

> "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." (UNI-11)

> "That'll allow me to keep as far away as I can from bleeding over problems when I'm working out." (UNI-11)

> "You should read hinge and then push: hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06)

On same or cross pattern: "This is a rule by goal." (UNI-06). In a bootcamp he does not want people too sore, so they can come more often. A high-level athlete needs him to "drive a lot harder into that muscle".

## Context

The team had noticed in his sheets that the heavy two-leg lift usually sat with a horizontal upper lift and the one-leg lift with a vertical one, and asked if that was the rule. He answered with the front-and-back logic instead. One bootcamp tab paired the other way round on two days. He said that was not intentional (ORD-06).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Pair by direction | Two-leg lift with horizontal, one-leg lift with vertical | Not the rule he gave |
| B. No pairing rule | Any lower with any upper | Rejected |
| C. Opposite surfaces | Back of the lower body with front of the upper body, and the reverse | **Chosen** (UNI-11) |

## Consequences

- The suggested supersets follow the pairs: knee lift + pull, hip lift + push ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).
- The rule is for sessions that mix lower and upper work. The team does not apply it to upper/lower or push/pull/legs splits (INFERRED).
- The bootcamp tab's reversed days are corrected in the tool. His sheet is left as it is.
- For field athletes, the cross pattern is the default. His same-pattern athletic template is for size-focused and high-level athletes (R3-SES-01).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.pairing.hip_push_knee_pull` | The pairing rule |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.pairing.same_vs_cross` | Who gets same pattern, who gets cross pattern |
| [model/rules.json](../../model/rules.json) | `pairing` | Runtime copy (generated) |

The day layouts built on this are in [synthesis/05_templates.json](../../synthesis/05_templates.json) under `generator_split_templates`. Hard rule H06 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-028](adr-028-power-first-horizontal-before-vertical.md) session order · [ADR-033](adr-033-bilateral-unilateral-scale.md) bilateral and unilateral · [Sessions](../02-model/sessions.md)
