# ADR-002: No data kept

Blaze Camp keeps nothing a person enters. There are no accounts, no database, no email field and no analytics with personal fields. The plan leaves with the person. Because nothing is kept, the tool does not learn from its users. The coach decided this in round 3, and it replaced his own round-1 idea of a tool that learns from everyone's data.

| | |
|---|---|
| **Status** | Accepted. The reading that learning from users stays off for good is PROPOSED (round-4 question N-PROD-26). |
| **Decided by** | Coach: R3-GEN-01 (round 3, 2026-10-09) |
| **Replaces** | His round-1 idea of a tool that "learns from the data of all the people that use it" (VOL-01, VOL-02); and three later team proposals: data kept on the phone, accounts, opt-in research data |

## Decision (the rule)

- Nothing a person types is stored by Blaze Camp or sent anywhere.
- The person keeps the plan themselves: an image, a PDF, a sheet, a link or a file (export list PROPOSED).
- The "use at your own risk" tick is printed on the plan. It is not stored ([ADR-010](adr-010-health-check-and-release-every-build.md)).
- Health answers are used on screen for that one build only.
- The model changes only when the coach changes it.

## Why

> "I don't know if we should be keeping any kind of data, but I don't want any data kept. It doesn't matter if they click it; it comes out. If they click it, they understand it." (R3-GEN-01)

It also fits his wish for a simple tool: "I want this to be very simple." (R3-VOL-04)

## Context

In round 1 he saw a tool that would improve from use:

> "This eventually will be something that learns from the data of all the people that use it" (VOL-01)

The team then designed data kept on the phone, optional research data and accounts later. In round 3 the team proposed keeping the record of the release on the phone. His answer removed data keeping as a whole. Round 3 is newer, so it wins.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Keep nothing | Static site, the engine runs in the browser, exports only | **Chosen** (R3-GEN-01) |
| B. Keep on the phone only | Local storage plus a backup code | Team proposal, retired |
| C. Accounts and sync | Server database, login, plans across devices | Team proposal, retired |
| D. Opt-in anonymous training data | Used to tune the model over time | Team proposal, retired |

## Consequences

- No check-in could work anyway, since nothing comes back ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md)).
- Starting the next block one step up (R2-VOL-06) needs a history. With nothing stored, the rebuild asks how many blocks the person completed in a row. That input is PROPOSED.
- Test reminders are printed in the plan and set as alarms in a calendar file. No notifications (PROPOSED mechanics).
- Anyone who builds their own app from this repo is responsible for their own data handling ([DISCLAIMER.md](../../DISCLAIMER.md) §7).
- Open questions for the coach: may the site remember the last plan on that one phone (N-PROD-21), and may it count page views without personal data (N-PROD-23).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.no_data_kept` | The rule and what the person keeps |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V27_no_data_kept` | The check: no network call carries intake or plan data |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.removed_fields` | The email field is removed |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.learning.status` | Learning from users: retired |
| [model/rules.json](../../model/rules.json) | `legal.nothing_stored` | Runtime copy (generated) |

Legal text: [DISCLAIMER.md](../../DISCLAIMER.md) §7 "No data collection". Product text: [synthesis/13_product_options.md](../../synthesis/13_product_options.md) §7.5.

## Related

[ADR-009](adr-009-mit-license-and-disclaimers.md) license and disclaimers · [ADR-006](adr-006-website-not-app.md) website, not an app · [Safety and liability](../00-overview/safety-and-liability.md)
