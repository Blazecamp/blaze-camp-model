# ADR-056: The liability gate: accept the terms before any plan, and a release line on every plan

Everyone may use the plans on their own. Before a plan is generated, the person must accept the terms and the release of liability. Without that acceptance no plan is built. Every plan then prints a short line saying liability was released, in English and Spanish, with a link to the full disclaimer. The coach decided this in round 4. It settles an open question from round 3, where he had been read as saying the box did not need to be ticked.

| | |
|---|---|
| **Status** | Accepted. All wording is PROPOSED and LEGAL REVIEW pending. One reading is open (the health check, see Consequences). |
| **Decided by** | Coach: R4-SCP-01, RIGHT with words; R4-SCP-02, PARTLY with words (round 4, 2026-10-11). Builds on R2-GEN-03 and R3-GEN-01. |
| **Replaces** | "Not required. The box is just an acknowledgment" (the team's round-4 proposal, which he corrected); the team's earlier reading "it doesn't matter if they click it; it comes out" |

## Decision (the rule)

| Subject | Rule | Source |
|---|---|---|
| Who may use the plans | Everyone, on their own. | R4-SCP-01 |
| The gate | The person accepts the terms and the release of liability as part of entering their data, before the plan shows. No acceptance, no plan. | R4-SCP-02, R4-SCP-01 |
| The printed line | Every plan carries a short line that liability was released, at the top or the bottom. | R4-SCP-02 |
| Languages | English and Spanish, each linking its disclaimer file. | R3-GEN-01, R2-GEN-08 |
| Data | Nothing is stored. The acceptance is stamped on the plan itself. | R3-GEN-01, [ADR-002](adr-002-no-data-kept.md) |

## Why

> "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out. There should be a message on there that we are not reliable for anything. You're totally responsible. Even before it kicks out the thing, they should be able to click to approve that they're responsible." (R4-SCP-01)

> "Yes, part of the whole thing is they need to click it before the plan shows, as part of when they put in their data, so that they understand the terms and conditions: this is not our responsibility, and this is on them." (R4-SCP-02)

> "it should be outputted in their program somewhere at the bottom or at the top: you've released liability. Something. I don't know how to do it. You need to figure that out." (R4-SCP-02)

("Reliable" in the first quote is his dictation for "liable".)

## Context

[ADR-010](adr-010-health-check-and-release-every-build.md) set a "use at your own risk" tick at every build. A later remark was read as making the tick optional, and the handoff notes listed it as an open question. Round 4 asked two things: who may use the plans alone, and whether the box must be ticked. The team proposed "not required". He answered PARTLY and made it required.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Notice only | Print the risk notice; the tick is optional | Not chosen (R4-SCP-02) |
| B. Required acceptance before the plan | No plan without it | **Chosen** |
| C. Limit who may use plans alone | Teens with a coach or parent; some groups through a professional first | His words went wider: "Everyone should be able to use the plan on their own" (R4-SCP-01) |
| D. A long legal page on every plan | The full release printed each time | Not chosen: "something minimal" (R4-SCP-02) |

## Consequences

- The release check runs first, before anything else is read. A missing or false acceptance returns no plan and the message "Read and accept the terms and the release of liability first. No plan is built without it."
- A full plan prints the line at the top and at the bottom. Block, week and day views print a short line. There are three wordings: a person building their own plan, a fitness professional building for a client, and a parent or guardian for a minor.
- The model data refuses to load with the gate switched off.
- A coach who builds for clients still needs their own screening, release and insurance ([ADR-009](adr-009-mit-license-and-disclaimers.md)).
- **Open for the coach.** The short health check of rounds 2 and 3 still exists, and in the current engine a flagged answer still stops the automatic plan and points to a professional. R4-SCP-01 says everyone should be able to use the plan on their own. The team reads that as "everyone, once they accept the release" (INFERRED). Whether a health flag should still stop a plan is a question for him.
- The wording is a draft, like [DISCLAIMER.md](../../DISCLAIMER.md). A Florida attorney has not reviewed it.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-SCP-01, R4-SCP-02 | His answers |
| `model/rules.json` | `legal.gate` | `required: true`, the field `release.accepted`, what happens without it |
| `model/rules.json` | `legal.release_line` | The three wordings, the short line, the footer, where each is printed, the two disclaimer files |
| `model/i18n/en.json`, `model/i18n/es.json` | `ui.plan.release_line`, `_coach`, `_minor`, `_short`, `ui.plan.release_footer`, `warning.release_missing` | The words |
| [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | | The full text (drafts) |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | R4-SCP-01, R4-SCP-02 | The master-document section and the spec key |

## Related

[ADR-010](adr-010-health-check-and-release-every-build.md) · [ADR-009](adr-009-mit-license-and-disclaimers.md) · [ADR-002](adr-002-no-data-kept.md) · [Safety and liability](../00-overview/safety-and-liability.md) · [Coach answers: legal and open source](../03-coach-answers/legal-and-open-source.md#r4-scp-02)
