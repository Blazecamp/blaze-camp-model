# ADR-006: A phone-friendly website, not an app

The first product is a simple website that works well on a phone: answer a few questions, see the whole plan, save it or screenshot it. There is no native app. After the coach approves the model, the repository is opened to everyone. In round 1 the coach dropped the idea of an app and leaned toward a website, while saying he did not know the format yet. He approved the website path in round 2. Round 3 made it simpler by removing check-ins and accounts. The website itself is not built yet.

| | |
|---|---|
| **Status** | Accepted (direction). Not built yet. Screens, exports and effort estimates are PROPOSED or INFERRED. |
| **Decided by** | Coach: GEN-03 (round 1), R2-GEN-02 (round 2); scope narrowed by R3-VOL-02, R3-VOL-04, R3-GEN-01 |
| **Replaces** | A native app (his earlier plan); a Google Sheet as the only output |

## Decision (the rule)

- Build a website, not an app.
- Fewest clicks. Easy on a phone.
- Three views that toggle easily: the block, the week, the day.
- A coach can screenshot 12 weeks, or one week, and send it.
- Then open-source the repository ([ADR-009](adr-009-mit-license-and-disclaimers.md)).

## Why

> "I was going to create a whole app, but that kind of fell through, so I don't want to create a whole app. Maybe just a website they can just go into, and then that'll make it real easy." (GEN-03)

> "ideally, we want to make it as simple as possible. The fewer clicks, the better. The easier it is to manage on a phone, the better." (R2-GEN-02)

He wants to see "the macro view of the week, the macro view of the block, and the macro view per day" (R2-GEN-02).

## Context

In round 1 he did not know the output format yet. He mentioned a PDF, a Google Sheet, a phone view, a website, and giving the repo away. He asked the team for ideas (GEN-03). The team compared four options. He has also said that no landing page or app is being built yet: first the data and context get organized (conversation, 2026-10-07 to 2026-10-09).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Plan website | Intake, the whole plan, views, exports | **Chosen** as phase 1 (R2-GEN-02) |
| B. Website + weekly check-in + logbook, accounts later | Approved as a later phase in round 2 | Retired in round 3 ([ADR-001](adr-001-answers-in-plan-out-no-check-ins.md), [ADR-002](adr-002-no-data-kept.md)) |
| C. Google Sheet only | A sheet like his "BUILD YOUR OWN PROGRAM" workbook | Kept as a download inside A (PROPOSED) |
| D. Open-source engine and model | Anyone can build on it | **Chosen** for after he approves the model |
| Native iPhone or Android app | App stores, more cost | Set aside (GEN-03) |
| PDF only | Easy, but no swaps or language switch after printing | Set aside; kept as an export |
| An AI chatbot that writes plans | Not reproducible or checkable against his rules | Set aside (team) |

## Consequences

- The engine must run in a browser with no server behind it. That also makes "no data kept" possible.
- The plan must read well as a picture. A screenshot of a block is a real way to deliver it.
- Videos do not have to be in the site ([ADR-008](adr-008-videos-optional.md)).
- Still open for the coach: free or paid (N-PROD-09), and the plan names shown to users (N-PROD-10).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `output.recommendation` | The approved path |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `output.views`, `output.principles` | Block, week and day views |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fewest_clicks` | The "fewest clicks" rules |

Full option analysis: [synthesis/13_product_options.md](../../synthesis/13_product_options.md) §3 to §6.

## Related

[ADR-007](adr-007-bilingual-english-first-full-spanish.md) bilingual · [Roadmap](../06-history/roadmap.md)
