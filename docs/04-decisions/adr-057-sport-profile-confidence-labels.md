# ADR-057: Every sport profile carries a confidence label

Each sport and activity profile says how sure its numbers are. There are three labels: confirmed by the coach, based on a similar sport, or proposed. The label is in the data and in the docs. It is not printed on a plan. The coach approved this in round 4.

| | |
|---|---|
| **Status** | Accepted. How each profile was sorted into a label is the team's reading (INFERRED). |
| **Decided by** | Coach: R4-SCP-03, RIGHT (round 4, 2026-10-11) |
| **Replaces** | Marking single numbers inside a profile only, with no label for the profile as a whole |

## Decision (the rule)

| Label | Meaning | Profiles |
|---|---|---|
| `confirmed_by_coach` | The numbers come from his own programs, or he approved that sport's plan by name (swimming in R3-ATH-01, HYROX in R3-ATH-03). | 23 |
| `similar_sport` | Built on another profile: a base profile, a position change, or a variant reused unchanged. | 67 |
| `proposed` | Worked out from the sport's demands with his general rules applied. There is no program for this sport in his sheets. | 37 |

- The label sits on the profile in the data, with one line saying what it is based on.
- The docs list every profile under its label ([sports](../02-model/sports.md) §5.1).
- The label is never shown on the plan itself.

## Why

The team's question said it plainly: "Many sport numbers were confirmed by you, others we inferred from similar sports." He approved the three labels as proposed (R4-SCP-03, RIGHT, no added words).

The label keeps the project's own rule: never present team work as the coach's ([ADR-047](adr-047-authority-order-and-evidence-labels.md)).

## Context

He asked for every popular US sport plus the "stay athletic and active" activities ([ADR-041](adr-041-every-sport-and-stay-athletic.md)). His sheets hold programs for a handful of sports. The rest of the 127 profiles were built from similar sports or from a needs analysis. An outside review of the model recommended publishing a confidence for each profile, so that direct evidence can be told apart from analogy ([reviews/codex-model-review.md](../../reviews/codex-model-review.md)).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. No profile label | Evidence labels on single numbers only | Replaced |
| B. Three labels in data and docs | Not shown on plans | **Chosen** |
| C. Show the label on the plan | A person sees "proposed" on their plan | Not chosen: "Not shown on the plan itself" (the proposal he marked RIGHT) |

## Consequences

- A label describes the whole profile. Single numbers inside a `similar_sport` or `proposed` profile can still be his. Example: the plyometric share for soccer and volleyball is his (R2-ATH-01), while those profiles as a whole are `proposed`.
- A label is not a grade of quality. It says where the numbers came from.
- A profile moves to `confirmed_by_coach` only when he confirms that sport. Never upgrade a label because the numbers look right.
- The two-thirds of profiles that are not confirmed are the first candidates for his review.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-SCP-03 | His answer |
| `model/profiles.json` | `sports[id].confidence`, `sports[id].confidence_basis` | The label and its one-line basis |
| `model/rules.json` | `render.profile_confidence` | The three labels; `shown_on_plan: false` |
| `synthesis/04_profiles.json` | each profile's evidence fields | What the label is read from |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | R4-SCP-03 | The master-document section and the spec key |

## Related

[ADR-041](adr-041-every-sport-and-stay-athletic.md) · [ADR-047](adr-047-authority-order-and-evidence-labels.md) · [Sports](../02-model/sports.md) · [Coach answers: athletes and sports](../03-coach-answers/athletes-and-sports.md#r4-scp-03)
