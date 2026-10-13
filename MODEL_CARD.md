# Model card: Blaze Camp Model v1.4

One page. Date: 2026-10-13. Model v1.4 (compiled runtime model 1.4.0), engine 0.7.0. For anything that moves, read the live files named here.

## What it is

A complete coaching model from the experience of **Coach Lalo (Gerardo Vera), Master NASM coach**: how he classifies exercises, doses weekly sets, orders a session, lays out a week, plans a block and adapts all of that to a sport, an age and the equipment at hand. It is written twice: in words ([BLAZE_CAMP_BRAIN.md](BLAZE_CAMP_BRAIN.md), `docs/`) and as data ([generator_spec_v1.json](generator_spec_v1.json), `synthesis/*.json`, compiled into `model/`). An experimental engine (`engine/`) reads the data and turns one short intake into a complete, editable training template in English or Spanish.

**Author and owner.** The model is Coach Lalo's intellectual property: his experience, condensed and consolidated, and his way of thinking through a program (COACH-R4 R4-REL-03). The team's job was to capture it faithfully, not to design it.

## Who it is for

| Reader | Use |
|---|---|
| Coaches and trainers | A starting template for a client, to adjust with their own judgement, screening, release and insurance |
| People who train themselves | A complete plan to follow and edit. Everyone may use the plans (COACH-R4 R4-SCP-01) after accepting the terms and the release of liability (R4-SCP-02). A yes on the health check does not stop the plan; it adds a health warning (R5-GEN-02) |
| Developers | A rule set, a library and an engine to build their own app on (MIT) |
| AI agents | A labelled, machine-readable model to read and build on: [docs/CONTEXT_FOR_AI.md](docs/CONTEXT_FOR_AI.md), [AGENTS.md](AGENTS.md) |
| Reviewers and researchers | A fully sourced record of one coach's system: [REVIEW_GUIDE.md](REVIEW_GUIDE.md) |

## Scope

- **Library:** 742 runtime exercises (731 compiled from 939 source records, plus 11 added records), each tagged by family, pattern, laterality, plane, level, muscles and credits, equipment, spine load and suitability for older adults and youth. 32 of them are optional add-ons: a person can add or swap them in, and no template picks them (the one exception is wall balls and sled pushes in HYROX and the CrossFit-style class, with a switch).
- **Rules:** weekly sets per muscle group by level, the stairway from below the top to a planned final number, the floor of 10 sets, set counting (prime mover 1, helpers a quarter), session order and pairing, two spine days, reps, effort and rest, tests at the start and end of a block.
- **Templates:** 30 week templates in six families, made from his own day layouts: the A/B full-body days (two full-body days on 2 days a week), push / pull / legs, the 3-day builder, upper / lower, athletic days, bootcamp, a CrossFit-style class, HYROX and strength.
- **Sports and populations:** 127 profiles covering 52 sports (with positions where they matter) and 26 "stay athletic and active" activities, plus rules for youth, adults over 50 in racket sports, and adults over 60.
- **Plans:** 4-6-week maintenance, 8-week and 12-week blocks, season and year plans. English and Spanish.

## Limits

- **General fitness information. Not medical advice,** not physical therapy, not a health screening. It does not replace a physician or a qualified coach.
- **One coach's system.** It has not been tested in outcome trials. It makes no claim to be better than other systems and no claim to prevent injury.
- **A plan is a template, built once.** There are no check-ins, no tracking and no stored data, so nothing adapts to how the person responds. The person or their coach adjusts it. Session time is theirs too: the plan is sized by exercise count and prints an average time as information only (COACH-CT CT-01).
- **Few inputs, on purpose.** No sex field, no sleep, stress or lifestyle questions. No bands or variable resistance.
- **A template holds only so many sets.** When a day layout cannot take a muscle group to its planned final number, the group is held at what the exercises can hold, and the plan says so. Nothing is added or dropped to force the number.
- **The engine is experimental.** It passes its own tests and checks. The coach graded the 8 sample plans in round 5: A for 01 swimming, 02 football and 07 push / pull / legs; B+ for 03 soccer, 04 CrossFit-style class, 05 bootcamp, 06 full-body aesthetics and 08 pickleball (COACH-R5 R5-GRD-01 ... 08). Engine 0.7 applied his notes; AI reviewers now grade every sample A- or A. He has not graded engine 0.7. Athletic work (jumps, throws, sprints, Olympic sets) is often under the sport's weekly target. Details: [HANDOFF.md](HANDOFF.md).
- **A health-check yes warns, it does not stop** (R5-GEN-02). The plan is built and says it is general fitness information, not a plan from a doctor, and to see a medical professional. The wording waits for the attorney.
- **An edited plan loses the generated plan's guarantees.** Edits recompute the totals and mark the plan as edited. They are not re-checked against every rule.
- **Spanish is partly machine-translated** (832 lines are marked for the coach's review, and he has not approved any Spanish yet). **The legal texts and the health warning are drafts** for a Florida attorney.

## How it was built

1. His two Google Sheets were exported and decoded tab by tab (`raw/`, `dumps/`, `analysis/`). The sheets were never changed.
2. Model documents were written per topic and fact-checked against the sheets (`synthesis/`).
3. He answered five rounds of questions (140, 45, 13, 20 and 43) and gave clarifications in conversation (CT-01, CX-01..04, CH5, CH6). His newest answer always wins. Each answer is traced in `coverage_matrix*.md`.
4. The rules were compared with published research (`synthesis/07_science_lineage.md`, `synthesis/12_volume_algorithm_v1.md`) and reviewed from outside (`reviews/`). Research fills gaps. It never overrules his answer.
5. The engine was built on the compiled model and measured with tests, a random-intake sweep, a benchmark and AI plan reviews.

History: [docs/06-history/timeline.md](docs/06-history/timeline.md).

## Evidence labels

| Label | Meaning |
|---|---|
| `COACH-R5`, `COACH-CH5`, `COACH-CH6`, `COACH-R4`, `COACH-CT`, `COACH-CX`, `COACH-R3`, `COACH-R2`, `COACH-ANSWER` + id | The coach said so, in that round. Newest first: round 5 with CH5 and CH6, then round 4 and CT-01, then CX, then rounds 3, 2 and 1 |
| `COACH-CHAT` + date | He said so in conversation |
| `OBSERVED` | Read from a cell of his sheets |
| `INFERRED` | The team's reasoning from his sheets or answers |
| `SCIENCE` | From the cited literature |
| `PROPOSED` | The team's suggestion, waiting for his approval |

## Confirmed and proposed

| Confirmed by the coach (his answers or his sheets) | Proposed or inferred by the team (not his rule yet) |
|---|---|
| The categories and the way every exercise is tagged | The weekly athletic targets inside most sport profiles (jumps, throws, cuts, sprint metres, Olympic sets) |
| Helper credit of a quarter set; athletic work never counts as muscle sets | 104 of the 127 profiles: 67 are built on a similar sport and 37 are proposed. 23 are confirmed by him. Each profile carries its label in `model/profiles.json` |
| The floor of 10 sets from 3 training days, the 2-day rule, two full-body days on 2 days (R5-GEN-01) | Which slots go to which of the two full-body days |
| Exercise counts per session and their defaults (R5-GEN-03), his A/B, push / pull / legs and other templates; the scale for 2- and 3-day athletic weeks (three quarters, R5-ATH-03) | Credit details decided in fix rounds (the high-incline press is his: 1.0 chest, R5-VOL-01) |
| The stairway: start below the top, reach the final sets, faster steps allowed with a note, reps and load by a rule the person applies, the next block about 5% higher, effort from 3 reps in the tank down to 1 | The one-intensifier-a-day rule and some rep-range steps between his ranges; the four jump levels; the named-workout library and its scaling; severe pain built with the moderate pain rules |
| Order and pairing rules, two spine days, no deload inside a block, tests at the start and end | The time estimate numbers (information only) |
| No bands, no sex or lifestyle inputs, no check-ins, no stored data | Selection weights and tie-breaks inside the engine (`engine/DECISIONS.md`) |
| Older-adult and youth defaults; swimming, HYROX and "stay active" defaults; jumps two-leg first, assisted with knee pain; named workouts in the class; overhead pressing kept for health | The weekly light overhead press for general plans (his answer named throwers and volleyball); the open items in [HANDOFF.md](HANDOFF.md) |
| Optional add-ons, carries by distance or time, mid-range pull, incline before overhead, YouTube search links | The benchmark scorer and its targets (a team tool, not his grade) |
| The liability gate, the health warning instead of a stop (R5-GEN-02), the MIT license, English and Spanish | Neck work (2 records, never shown) |

About 130 status notes inside `model/rules.json` still contain the word `PROPOSED`, for a whole table or for one detail of an approved rule. Where a document and this table differ, the status on the rule itself is right.

## License

[MIT](LICENSE). Copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation). Keep the copyright and permission notice in every copy. Whether the license reaches the Blaze Camp name is a question for the attorney. The team's reading is that it covers copyright and not the name.

## Disclaimer

Use at your own expense and risk. No warranty. Lalo Vera, Blaze Camp and BFit Studios Corp. are released from all liability. If you program for anyone else, you need your own health screening, liability release and insurance. Minors need a parent or guardian and a qualified coach. No personal data is kept. Read [DISCLAIMER.md](DISCLAIMER.md) (English) and [DISCLAIMER.es.md](DISCLAIMER.es.md) (Español) in full. Both are drafts pending attorney review.
