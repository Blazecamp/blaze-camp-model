# Safety and liability: the short version

This page sums up, in plain words, what the Blaze Camp disclaimer says and what the model does to keep people safe. It is a summary and not the legal text. The legal text is [DISCLAIMER.md](../../DISCLAIMER.md) in English and [DISCLAIMER.es.md](../../DISCLAIMER.es.md) in Spanish. Both are drafts that a licensed Florida attorney still has to review. If this page and the disclaimer differ, the disclaimer wins. Nothing here is legal or medical advice.

## The rule

1. **This is general fitness information, not medical advice.**
2. **You use it at your own expense and risk.** That covers downloading the repository, using the model, and following any plan made from it.
3. **Blaze Camp is released from liability.** "Blaze Camp" here means Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp.
4. **If you use it for other people, you need your own protection:** your own health screening, liability release and insurance.
5. **Everyone may use the plans, and everyone accepts the terms and the release first.** The acceptance is required before a plan is generated, every time. No acceptance, no plan.
6. **Every plan prints a short release line**, at the top and at the bottom, in English and Spanish, with a link to the full disclaimer.
7. **Nothing a person enters is kept.**
8. **Everything legal exists in English and Spanish.**

## Why

The coach set rules 2 to 8 himself. Three details are not from his answers: the "not medical advice" wording of rule 1, the insurance line in rule 4, and the rule for people under 18. They come from the draft legal text and wait for the lawyer.

> "We release all liabilities as soon as you decide to use this tool and these templates of workouts." (R3-GEN-01)

> "you're downloading this at your own expense and risk, and that if you are going to use this for other clients, for other people, you should have your own liability release" (R3-GEN-01)

> "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." (R2-GEN-03)

> "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out." (R4-SCP-01)

> "they need to click it before the plan shows, as part of when they put in their data, so that they understand the terms and conditions: this is not our responsibility, and this is on them." (R4-SCP-02)

> "it should be outputted in their program somewhere at the bottom or at the top: you've released liability." (R4-SCP-02)

On data: "I don't want any data kept." (R3-GEN-01)

On Spanish: "it should be translated as legally equivalent as possible in English and Spanish" (R3-GEN-01)

Coaches can skip the health check for their own clients, with a warning: "I want to be able to bypass it if I'm a coach and I just want to get it done." (R2-GEN-03)

## The disclaimer, section by section

| § | Topic | In plain words |
|---|---|---|
| 1 | Not medical advice | Talk to your doctor before you start, above all with a medical condition, an injury, pain, pregnancy or a recent birth, age over 60, or a long time without training. |
| 2 | Use at your own risk | Exercise can cause injury, illness and, rarely, death. By using the materials you accept those risks. |
| 3 | No warranty | Everything is provided "as is". Plans are templates and may contain errors. You check every plan, fit it to the person, and stop any exercise that causes pain. |
| 4 | Release of liability | You release Lalo Vera, Blaze Camp, BFit Studios Corp. and their people from claims that come from your use of the materials. |
| 5 | Coaches, trainers, gyms | You act under your own professional judgment. You need your own screening, consent, release and insurance. Blaze Camp's release does not cover your clients. You agree to hold Blaze Camp harmless against claims from your clients. |
| 6 | Minors | Plans for anyone under 18 must be reviewed and supervised by a parent or legal guardian and a qualified coach. |
| 7 | No data collection | The Blaze Camp tool keeps no personal data. If you build your own app, the data handling and privacy terms are yours. |
| 8 | Third-party content | Some names and links in the source sheets, such as video links, belong to other people. (Since round 4 the video links are removed from the model data, which is the compiled model and the exercise library; each exercise has a YouTube search link instead: R4-LIB-05. The exports of his original sheets in `raw/`, `dumps/` and `analysis/` still show them, and whether those files stay public is an open release item.) |
| 9 | Governing law | Florida, United States. |
| 10 | Acceptance | Downloading or using the materials, or ticking the box in the plan generator, means you accept these terms. |

Read the full sections in [DISCLAIMER.md](../../DISCLAIMER.md). The license is separate: [LICENSE](../../LICENSE) (MIT).

## What this means for you

| You are | What to do |
|---|---|
| A person training on your own | Read the disclaimer. See a professional first if any health-check item applies to you. Treat the plan as a template. Stop an exercise that hurts. |
| A coach, trainer or gym | Screen your clients your own way. Use your own liability release and insurance. Check every plan before you hand it over. See [for-coaches.md](for-coaches.md). |
| A developer building an app | Show your own terms and privacy policy. Keep the required acceptance before any plan, the release line on the plan, and the health check. Do not ship the draft legal text as final. See [for-developers.md](for-developers.md). |
| A parent or guardian | You review and accept for anyone under 18, together with a qualified coach. |

## The health check and the release, as the model plans them

The website is not built yet. This is the approved design. The plan engine already enforces the release step: it returns no plan without the acceptance.

| Step | Rule | Source | Status |
|---|---|---|---|
| Health check for clients | A short Blaze Camp health check in English and Spanish, with a link to the official PAR-Q+. The PAR-Q+ is a standard questionnaire used before starting exercise. | R2-GEN-03, R3-GEN-01 | Approved. A lawyer must write the wording. |
| "See a professional first" | **Round 5 (R5-GEN-02): the plan is built with a health warning instead** (general fitness information, not a plan from a doctor; see a medical professional to make sure it is safe for you), printed in EN and ES; the plan never says which answer was a yes. Before round 5: no plan is built when any of these applies: chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant, or gave birth in the last 6 months; an injury under treatment; a doctor said no. Round 4: "Everyone should be able to use the plan on their own", with the release. Today the engine still stops the automatic plan on a flagged answer and points to a professional. | R2-GEN-03, R4-SCP-01 | **Open for the coach:** whether a flagged answer should still stop a plan. |
| Severe pain | Since engine 0.7: the plan is built with the moderate pain rules and the same health warning (read from R5-GEN-02). Before: no plan was built. | | PROPOSED |
| Coaches | A coach can run the check with the client, or skip it with a legal warning to follow their own onboarding. | R2-GEN-03, R3-GEN-01 | Approved. Warning wording waits for a lawyer. |
| The release (the liability gate) | Everyone, client or coach, accepts the terms and the release before a plan is generated: at every build and rebuild, including each new block. Without the acceptance the tool builds nothing and says: "Read and accept the terms and the release of liability first. No plan is built without it." | R2-GEN-03, R3-GEN-01, R4-SCP-02 | Approved. One box or several is the lawyer's call. |
| The release line on the plan | A full plan prints it at the top and at the bottom. Block, week and day views print a short line: "Liability released before this plan was built: use it at your own risk. Not medical advice." There are three wordings: a person building their own plan, a fitness professional building for a client, a parent or guardian for a minor. Each links the disclaimer. | R4-SCP-01, R4-SCP-02 | Rule approved. Wording PROPOSED, a draft for the lawyer. |
| The record | The acceptance is stamped on the plan itself. It is not stored anywhere. | R3-GEN-01 | Approved |
| Under 18 | A parent or guardian accepts. | DISCLAIMER §6 (draft) | PROPOSED. He has not been asked about minors. The lawyer decides. |

## Safety rules built into the model

These are coaching rules, not legal terms. They lower risk. They do not remove it.

| Rule | Source |
|---|---|
| Effort stays at 1 to 3 reps in reserve. Never to failure on heavy compound lifts. | VOL-13, GEN-08 |
| Pain named at the start: cut that muscle or pattern 30 to 50 %, move to machines or split grips, or drop the exercise | VOL-03 |
| Heavy loading of the spine once a week per pattern: one heavy squat day and one heavy deadlift day, on different days | PER-04, R2-SES-01 |
| Weekly sets usually grow in small steps (about 3 % then 5 % a week). When a short block needs bigger steps to reach its final sets, the plan marks any week that adds more than about 15 % with a note, and the person can lower it. | R3-VOL-04, CX-01, R4-PRG-02 |
| Session length is the person's own. The plan never squeezes work into a time limit. | CT-01 |
| No 1-rep max and no all-out mile for someone who has not finished a block: "you should not go from not training to a one-rep max test" | R2-PER-07 |
| Older, injured and high-volume clients collect their volume "in a safe place with more constraints". They never get an overhead squat or a low-bar squat. | EQ-03 |
| Age 60 and over: 5 to 6 exercises a session. Jumps, Olympic lifts and depth jumps are off unless switched on, with this warning: "Make sure that you have a fitness professional to help you understand what this means." | R4-SES-02, R2-ATH-08, R3-ATH-02 |
| Pickleball, padel and tennis players from 50: knee-friendly strength, calf and Achilles work, and only low-impact jumps unless switched on | R3-ATH-02 |
| Youth: Olympic lifts from the floor from about age 14, after one block of hang work | R2-ATH-08 |
| Jumps start with landing: "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." | CAT-10 |
| No medicine ball over 20 lb | EQ-06 |

More detail: [special populations](../02-model/special-populations.md), [testing](../02-model/testing.md), [athletes](../02-model/athletes.md).

## What is still open

| Item | State |
|---|---|
| Attorney review of both disclaimers | Not done. Both files say so at the top. |
| Wording of the health check, the release and the coach warning | Placeholders, marked LEGAL REVIEW in the data |
| One box or separate ticks | The lawyer's call |
| The Blaze Camp name | The MIT license covers copyright. Whether the name needs its own protection is a question for the lawyer. |
| Whether a flagged health-check answer still stops a plan | Open for the coach after R4-SCP-01 ("everyone"). Today it stops the plan. |
| Wording of the printed release line, in English and Spanish | PROPOSED; a draft for the lawyer, like the disclaimer |
| The plan engine | Experimental. The coach graded the 8 sample plans in round 5 (A for 3, B+ for 5). A health-check answer of yes no longer stops a plan: since engine 0.7 the plan is built with a health warning (R5-GEN-02), and the person should see a medical professional first. Check any generated plan with extra care. |

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | | The full legal text, English and Spanish (drafts) |
| [LICENSE](../../LICENSE) | | MIT license and copyright line |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.no_data_kept` | Nothing is kept |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.health_check` | The health check and the coach route |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `legal_and_privacy.release_every_build` | The acceptance at every build |
| `model/rules.json` | `legal.gate` | The liability gate: `required: true`, field `release.accepted`, no plan without it (R4-SCP-02) |
| `model/rules.json` | `legal.release_line` | The release line: three wordings, a short line and a footer, top and bottom, English and Spanish (R4-SCP-01, R4-SCP-02) |
| `model/i18n/en.json`, `model/i18n/es.json` | `ui.plan.release_line`, `_coach`, `_minor`, `_short`, `ui.plan.release_footer`, `warning.release_missing` | The printed words |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fields.F01`, `.F45`, `.F46` | Health check, coach route, release |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V1_safety`, `.V21_release`, `.V27_no_data_kept`, `.V31_release_stamp` | The checks |
| [AGENTS.md](../../AGENTS.md) | H12, H19, H20 | Hard rules for older adults, tests and the release |

## Related pages

[ADR-009: MIT license and disclaimers](../04-decisions/adr-009-mit-license-and-disclaimers.md) · [ADR-010: health check and release](../04-decisions/adr-010-health-check-and-release-every-build.md) · [ADR-056: the liability gate](../04-decisions/adr-056-liability-gate-before-every-plan.md) · [ADR-002: no data kept](../04-decisions/adr-002-no-data-kept.md) · [ADR-040: older-adult defaults](../04-decisions/adr-040-older-adult-defaults.md) · [his answers on legal and open source](../03-coach-answers/legal-and-open-source.md) · [what-this-is.md](what-this-is.md)
