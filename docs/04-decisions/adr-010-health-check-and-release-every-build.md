# ADR-010: A short health check, and a "use at your own risk" tick at every build

> **Update, round 5 (R5-GEN-02, 2026-10-12).** A health-check flag no longer stops the plan. "It doesn't stop because we're not taking on any liability, but it should warn them": the plan is built and prints a clear warning in English and Spanish (general fitness information, not a plan from a doctor; see a medical professional to make sure it is safe for you). The release is still accepted first. Severe pain is planned with the moderate pain rules and the same warning (PROPOSED). The plan never names which health question was a yes. Engine: `engine/DECISIONS.md` G-270 ... G-274. The text below is the round-2 / round-3 decision as it was.

Before a plan is built, a client answers a short health check. Some answers send the person to a professional and no plan is built. A coach can skip the check with a legal warning. Everyone, client or coach, ticks a "use at your own risk" box every time a plan is built. Nothing is stored. The coach set this in round 2 and approved the details in round 3. All wording is a placeholder until a lawyer writes it.

| | |
|---|---|
| **Status** | Accepted, refined in round 4: the tick is required before a plan is generated, and every plan prints a release line ([ADR-056](adr-056-liability-gate-before-every-plan.md)). Wording: LEGAL REVIEW pending. Screen layout PROPOSED. |
| **Decided by** | Coach: R2-GEN-03 (round 2), R3-GEN-01 (round 3) |
| **Replaces** | A plain safety screen proposed by the team with no coach route |

> **Update, round 4 (R4-SCP-01, R4-SCP-02, 2026-10-11).** The acceptance is a gate: "they need to click it before the plan shows" (R4-SCP-02). No acceptance, no plan. Every plan also prints a short line that liability was released, in English and Spanish. He also said "Everyone should be able to use the plan on their own" (R4-SCP-01). Whether a flagged health-check answer should still stop a plan after that answer is open for him. See [ADR-056](adr-056-liability-gate-before-every-plan.md).

## Decision (the rule)

1. **Clients** answer a short Blaze Camp health check. Any "see a professional first" answer means no automatic plan.
2. **Coaches** building for a client can run the check with the client, or skip it. Skipping shows a legal warning: follow your own onboarding.
3. **Everyone** ticks one box at every build: use at my own risk, terms and conditions, release of liability. His dictation reads "Turn some conditions and liability releases. They should all be in that." (R3-GEN-01). The team reads the first words as "terms and conditions" (INFERRED).
4. The check and the release exist in **English and Spanish**.
5. **Nothing is kept.** The record of the tick is printed on the plan.

The five "see a professional first" items he approved (R2-GEN-03):

| # | Item |
|---|---|
| 1 | Chest pain or heart issues |
| 2 | Surgery or a fracture in the last 6 months |
| 3 | Pregnant, or gave birth in the last 6 months |
| 4 | An injury under treatment |
| 5 | A doctor said no |

## Why

> "I want to be able to bypass it if I'm a coach and I just want to get it done." (R2-GEN-03)

> "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." (R2-GEN-03)

> "there probably should be a 'use at your own risk' checkbox." (R3-GEN-01)

## Context

The PAR-Q+ is a standard pre-exercise questionnaire. The team found that it is copyrighted, must be used unchanged and has no Spanish version (team research, re-check before launch). So we proposed a short Blaze Camp check written by a lawyer in both languages, with a link to the official PAR-Q+. He marked it RIGHT (R3-GEN-01).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. No screening | Fastest | Not chosen: he approved a health check (R2-GEN-03) |
| B. The official PAR-Q+ inside the form | Cannot be shortened or translated | Not chosen |
| C. A short lawyer-written check + a link to the PAR-Q+ | Short, bilingual | **Chosen** (R3-GEN-01) |
| Coach route: no bypass | Every coach repeats the check | Rejected: he wants a bypass with a warning |

## Consequences

- A lawyer must write the health check, the release and the coach warning. Until then the texts are placeholders marked LEGAL REVIEW.
- The tick is required again for every new plan, including each new block.
- Coaches who skip the check are told they need their own screening and release. Blaze Camp's release does not cover their clients ([DISCLAIMER.md](../../DISCLAIMER.md) §5).
- For anyone under 18, a parent or guardian accepts ([DISCLAIMER.md](../../DISCLAIMER.md) §6; mechanics PROPOSED).
- One box or separate ticks is the lawyer's call (N-PROD-24).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.health_check` | The route, the five items, the coach option |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.release_every_build` | The tick at every build |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fields.F01`, `inputs_schema.fields.F45`, `inputs_schema.fields.F46` | Health check, coach route, release |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V1_safety`, `validation_checks.V21_release` | The checks |
| [model/rules.json](../../model/rules.json) | `locked` | Locked rule LK17 `locked.release_every_build` (generated) |

Hard rule H20 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-009](adr-009-mit-license-and-disclaimers.md) license and disclaimers · [ADR-002](adr-002-no-data-kept.md) no data kept · [Safety and liability](../00-overview/safety-and-liability.md)
