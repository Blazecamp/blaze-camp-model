# ADR-009: MIT license, with disclaimers in English and Spanish

The whole repository is released under the MIT license, in the name of Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. Two disclaimer files, one in English and one in Spanish, say that everything is used at the person's own expense and risk and that anyone who uses it for clients needs their own liability release. The coach decided this in round 3. Both disclaimers are drafts until a Florida attorney reviews them. The repository is private until he approves the model.

| | |
|---|---|
| **Status** | Accepted. Disclaimer wording: draft, LEGAL REVIEW pending. Public release: not yet. |
| **Decided by** | Coach: R3-GEN-01 (round 3, 2026-10-09); open-source idea from GEN-03 and R2-GEN-02 |
| **Replaces** | Apache-2.0 for the code plus CC BY 4.0 for the model (team proposal he had marked RIGHT in R2-GEN-02) |

## Decision (the rule)

| Item | Decision |
|---|---|
| License | MIT, for code, model data and docs |
| Copyright line | "Copyright (c) 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation)" |
| Disclaimers | [DISCLAIMER.md](../../DISCLAIMER.md) and [DISCLAIMER.es.md](../../DISCLAIMER.es.md), meant to be legally equivalent |
| Message | Not medical advice. Use at your own expense and risk. Liability released. |
| Coaches and gyms | Need their own liability release for their own clients |

The **MIT license** is a short, permissive license. Anyone may use, copy, change and sell the work, as long as the copyright and license notice stay with it.

## Why

> "there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation)." (R3-GEN-01)

> "you're downloading this at your own expense and risk, and that if you are going to use this for other clients, for other people, you should have your own liability release" (R3-GEN-01)

The purpose goes back to round 1: "give away the repo, open source it to any coach and person that wants to create a training app" (GEN-03).

## Context

He wants a free, fully explained model that anyone can use in their own app and their own training, and that AI agents can read (conversation, 2026-10-07 to 2026-10-09). In round 2 the team proposed two licenses, one for code and one for the model, and he marked the whole product path RIGHT. In round 3 he named MIT himself.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Apache-2.0 (code) + CC BY 4.0 (model) | Two licenses, credit required for the model | Retired (R3-GEN-01) |
| B. MIT for everything | One simple license in his name and his company's | **Chosen** |
| C. Keep it private | No public repo | The state today, until he approves the model |

## Consequences

- People may build paid products on it. The notice must stay.
- MIT covers copyright. It gives no right to the Blaze Camp name (INFERRED from the license text; the attorney confirms).
- The disclaimers must be reviewed by a licensed Florida attorney before public release. The files say so at the top.
- Contributors do not edit `LICENSE` or the disclaimers. Changes go through the owner and his attorney.
- He has said the public repo may include copies of his original sheets "so people can download it and play with it" (conversation). What exactly is published is checked before release.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.licence`, `output.licence` | License, holder, what it covers, what was retired |
| [model/rules.json](../../model/rules.json) | `legal.owner` | Runtime copy (generated) |

Files: [LICENSE](../../LICENSE), [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md), and the notice at the top of [README.md](../../README.md).

## Related

[ADR-010](adr-010-health-check-and-release-every-build.md) health check and release · [ADR-002](adr-002-no-data-kept.md) no data kept · [Safety and liability](../00-overview/safety-and-liability.md)
