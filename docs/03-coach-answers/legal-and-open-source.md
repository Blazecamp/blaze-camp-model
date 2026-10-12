# Coach answers: Legal and open source

The health check, the release of liability, privacy, the licence and the plan to open the repo. Everyone may use the plans on their own. Before a plan is generated, the person must accept the terms and the release of liability; without that, no plan is built. Every plan prints a short line saying liability was released, in English and Spanish. Clients go through a short health check; coaches may skip it with a legal warning. No user data is kept. The repo is licensed MIT (a short, permissive open-source licence) to Lalo Vera, Blaze Camp and BFit Studios Corp., and says in English and Spanish that people use it at their own expense and risk. It presents the model as the coaching experience and intellectual property of Coach Lalo (Gerardo Vera), Master NASM coach. The legal texts are drafts until a licensed attorney reviews them.

This page is part of [the coach answers by topic](index.md). It holds 5 question ids: 2 from rounds 2 and 3, and 3 from round 4. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [safety and liability](../00-overview/safety-and-liability.md), [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md), [LICENSE](../../LICENSE).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Clients get a short health check before a plan. Coaches can run it with their client or skip it, with a legal warning. | [R2-GEN-03](#r2-gen-03), [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 2 | Coaches who build programs for people need their own screening and their own liability release. | [R2-GEN-03](#r2-gen-03), [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 3 | Everyone, client or coach, releases liability every time they get a plan, through a "use at your own risk" checkbox that also covers the terms and conditions. **The click is required before the plan shows.** No acceptance, no plan. | [R2-GEN-03](#r2-gen-03), [R3-GEN-01](#r3-gen-01), [R4-SCP-02](#r4-scp-02), [R4-SCP-01](#r4-scp-01) | CONFIRMED |
| 3b | Every plan carries a minimal line, at the top or the bottom, saying liability was released. | [R4-SCP-02](#r4-scp-02) | CONFIRMED |
| 3c | Everyone may use the plans on their own. | [R4-SCP-01](#r4-scp-01) | CONFIRMED |
| 4 | No data is kept. | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 5 | The licence is MIT, to Lalo Vera, Blaze Camp (doing business as) and BFit Studios Corp. (Florida corporation). | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 6 | The README and the repo say: liability is released, you download and use this at your own expense and risk, and if you use it for clients you need your own liability release. | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 7 | Everything legal exists in English and in Spanish, translated as legally equivalent as possible. | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 8 | The repo will become a fully explained public resource, free for anyone to use, with a guide for adding exercises. | conversation | CONFIRMED |
| 9 | The exercise videos linked in his sheets are not his. They are removed from the public data; each exercise has a YouTube search link instead. | conversation, [R4-LIB-05](library-details.md#r4-lib-05) | CONFIRMED |
| 9b | The repo describes itself as a complete coaching model from the experience of Coach Lalo (Gerardo Vera), Master NASM coach, and as his intellectual property. No "world's best" or injury-prevention claims. | [R4-REL-03](#r4-rel-03) | CONFIRMED |
| 10 | The wording of the health check, the terms, the release and the printed release line (drafts for a licensed Florida attorney); the three wordings of the line (self, coach, guardian); whether a flagged health-check answer still stops a plan now that "everyone" may use it. | [R3-GEN-01](#r3-gen-01), [R4-SCP-01](#r4-scp-01), [R4-SCP-02](#r4-scp-02) | PROPOSED |

## Why, in his words

- "I don't want any data kept." ([R3-GEN-01](#r3-gen-01))
- "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." ([R2-GEN-03](#r2-gen-03))
- "We release all liabilities as soon as you decide to use this tool and these templates of workouts." ([R3-GEN-01](#r3-gen-01))
- "they need to click it before the plan shows, as part of when they put in their data" ([R4-SCP-02](#r4-scp-02))
- "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out." ([R4-SCP-01](#r4-scp-01))
- "This is me and my intellectual property of condensing and consolidating everything" ([R4-REL-03](#r4-rel-03))
- "I don't think anything like this exists." (conversation, `coach_chat_statements.md`)

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named. The round-4 rules are cited from `model/rules.json`, the compiled rules the engine reads; the matching spec keys are in the [coverage matrix, round 4](../../coverage_matrix_round4.md).

| What | File | JSON key |
|---|---|---|
| Health check route | `generator_spec_v1.json` | `legal_and_privacy.health_check` |
| The release at every build | `generator_spec_v1.json` | `legal_and_privacy.release_every_build` |
| No data kept | `generator_spec_v1.json` | `legal_and_privacy.no_data_kept` |
| Licence | `generator_spec_v1.json` | `legal_and_privacy.licence` |
| The health check on the form (client / coach) | `generator_spec_v1.json` | `inputs_schema.fields.F01` |
| The own-risk box on the form | `generator_spec_v1.json` | `inputs_schema.fields.F46` |
| The checks that enforce it | `generator_spec_v1.json` | `validation_checks.V21_release` |
| The liability gate: required acceptance before a plan (R4-SCP-02) | `model/rules.json` | `legal.gate` |
| The release line printed on every plan, EN and ES (R4-SCP-01, R4-SCP-02) | `model/rules.json`; `model/i18n/en.json`, `es.json` | `legal.release_line`; `ui.plan.release_line*`, `ui.plan.release_footer` |
| Licence text | `LICENSE` | (whole file) |
| Disclaimer and release, English | `DISCLAIMER.md` | (whole file) |
| Disclaimer and release, Spanish | `DISCLAIMER.es.md` | (whole file) |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [R2-GEN-03](#r2-gen-03) | 2 | RIGHT | Health check for clients; coaches may bypass it with a legal warning; everyone releases liability every time. | Stands, refined |
| [R3-GEN-01](#r3-gen-01) | 3 | RIGHT | Lawyer-written health check EN/ES + PAR-Q+ link; own-risk checkbox every build; no data kept; MIT to Lalo Vera, Blaze Camp, BFit Studios Corp.; legal text in EN and ES. | Stands, refined |
| [R4-SCP-01](#r4-scp-01) | 4 | RIGHT | Everyone may use the plans on their own; every plan releases liability before and after it comes out. | Stands |
| [R4-SCP-02](#r4-scp-02) | 4 | PARTLY | The terms and release must be accepted before the plan shows; a minimal release line is printed on the plan. | Stands |
| [R4-REL-03](#r4-rel-03) | 4 | PARTLY | The repo credits the model to Coach Lalo (Gerardo Vera), Master NASM coach, as his experience and intellectual property; no "world's best" claims. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| The repo is private for now. It will become a fully explained public repo: "the most comprehensive training model that there is out there," free "for anybody to use in their own app and their own training." | `coach_chat_statements.md` | First raised in [GEN-03](product-and-generator.md#gen-03). In round 4 he approved releasing the model as v1.3 ([R4-REL-01](product-and-generator.md#r4-rel-01)) and said how it should describe itself ([R4-REL-03](#r4-rel-03)). |
| It may include copies of his original Google Sheets "so people can download it and play with it." | `coach_chat_statements.md` | No questionnaire answer changed it. |
| People must be able to add and create exercises, with the repo explaining how. AI agents should be able to go in and grab from it. | `coach_chat_statements.md` | The how-to is [adding-exercises.md](../adding-exercises.md) (Spanish: [adding-exercises.es.md](../adding-exercises.es.md)). |
| "I don't think anything like this exists." He believes only a handful of people have built something this robust and open-sourced it. | `coach_chat_statements.md` | No questionnaire answer changed it. |
| The exercise videos linked in his sheets are not his. "The Blaze Camp name is the culture." | `coach_chat_statements.md` | Videos became optional in [R2-GEN-02](product-and-generator.md#r2-gen-02). Round 4 removed the third-party links from the public data ([R4-LIB-05](library-details.md#r4-lib-05)). |
| License: MIT, to Lalo Vera, Blaze Camp (doing-business-as) and BFit Studios Corp. (Florida corporation). Liability released in English and Spanish; anyone using it for clients needs their own liability release. | `coach_chat_statements.md` | Confirmed in [R3-GEN-01](#r3-gen-01). The licence text is in the repo's LICENSE file. |
| Data to back up the science of the model. | `coach_chat_statements.md` | One of the two things he asked outside reviewers to research. |
| Exercises and anything else the model might be missing compared with other models. | `coach_chat_statements.md` | The second thing he asked outside reviewers to research. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Health check and release of liability

#### R2-GEN-03

**Question (round 2).** Should the form start with a short health check that sends some people to a professional first?

**Final rule.** **Refined by R5-GEN-02 (round 5): a yes no longer stops the plan; the plan is built with a clear warning to see a medical professional first.** The form starts with a short health check. The five items that send someone to a professional first: chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said no. A client goes through the PAR-Q. A coach has a choice: run the health check, or bypass it because they are a fitness professional pulling a program for a client and follow their own onboarding procedures. The bypass shows a legal warning. Coaches who build programs for people should have their own PAR-Qs, "because we release all liability for this". Everyone releases liability every time they get a plan, client or coach. Round 3 kept all of this and set how it is done.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: chest pain or heart issues, surgery or a fracture in the last 6 months, pregnant or gave birth in the last 6 months, an injury under treatment, or a doctor said no: no automatic plan, refer them to a professional or to you.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "I want to be able to bypass it if I'm a coach and I just want to get it done." / "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." (R2-GEN-03)
- **Note:** In his dictated answer the PAR-Q (Physical Activity Readiness Questionnaire) appears as "park queue".
- **Where it lives:** `generator_spec_v1.json` → `legal_and_privacy.health_check`, `inputs_schema.fields.F01`, `inputs_schema.fields.F45`, `validation_checks.V1_safety`
- **Changed later:**
  - **REFINED by [R3-GEN-01](#r3-gen-01) (round 3).** Before: Clients go through the PAR-Q. Now: The official PAR-Q+ is copyrighted and has no Spanish version, so a lawyer writes a short Blaze Camp health check in English and Spanish, with a link to the official PAR-Q+.
  - **REFINED by [R3-GEN-01](#r3-gen-01) (round 3).** Before: Everyone releases liability every time. Now: One "use at your own risk" checkbox covering terms and conditions and the release, at every build or rebuild. No data kept.
  - **REFINED by [R4-SCP-02](#r4-scp-02) (round 4).** Before: Everyone releases liability every time they get a plan. Now: The acceptance is required before the plan shows, and the plan prints a short line that liability was released.
  - **REFINED by [R4-SCP-01](#r4-scp-01) (round 4).** Before: Five health items send a client to a professional first. Now: "Everyone should be able to use the plan on their own", with the release before and after. Whether a flagged item still stops the plan is open for him (the engine still stops it).
- **See also:** [R3-GEN-01](#r3-gen-01)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> There should be an option: if you're a coach, please make sure that you follow your standard operating procedures for onboarding your clients. If you're a client, then we take them through the park queue. If you're a coach, it should be able to be toggled: do you want to follow your park queue because you are not a fitness professional, or are you a fitness professional just pulling a program for one of your clients? Please make sure that you follow up on our Q&A health status, that kind of thing. All the health checks should be there as an option. I want to be able to bypass it if I'm a coach and I just want to get it done. Meaning that it should have some type of legal warning to the coach. If they're building programs for people, they should be able to have their own park use because we release all liability for this. We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach.

</details>

#### R3-GEN-01

**Question (round 3).** Health check and liability release: OK to do it this way?

**Final rule.** Health check: the official PAR-Q+ is copyrighted, must be used unchanged and has no Spanish version. So a lawyer writes a short Blaze Camp health check (his 5 "see a professional first" items plus the usual PAR-Q topics) in English and Spanish, with a link to the official PAR-Q+. Coaches can run it with their client or skip it with his legal warning. Release: everyone, client or coach, accepts it every time a plan is built or rebuilt, including the start of each new block, and not when they just reopen a plan. He wants a "use at your own risk" checkbox, with the terms and conditions and the liability releases all in it. Data: "I don't want any data kept." Licence: MIT to Lalo Vera (him), Blaze Camp (the doing-business-as) and BFit Studios Corp. (the corporation, registered in Florida). The README and the files must say that liability is released, that people download it at their own expense and risk, and that anyone using it for clients needs their own liability release. There must be a Spanish version, translated as legally equivalent as possible.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 3):** The official PAR-Q+ is copyrighted, must be used unchanged and has no Spanish version, so a lawyer writes a short Blaze Camp health check (your 5 'see a professional first' items + the usual PAR-Q topics) in English and Spanish, with a link to the official PAR-Q+. Coaches can run it with their client or skip it with your legal warning. Everyone, client or coach, ticks the release every time a plan is built or rebuilt, including the start of each new block (not when they just reopen the plan or send a check-in). The record stays on the phone and is printed on every screenshot, PDF and sheet.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "I don't want any data kept." / "there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation)" / "it should be translated as legally equivalent as possible in English and Spanish" / "if you are going to use this for other clients, for other people, you should have your own liability release" (R3-GEN-01)
- **Not confirmed by him:** The proposal said the release record stays on the phone. His words say no data is kept, so the record is only printed on the plan and its exports (the team's design, PROPOSED). The texts in DISCLAIMER.md and DISCLAIMER.es.md are drafts and need review by a licensed Florida attorney before public release. He also said "It doesn't matter if they click it; it comes out. If they click it, they understand it." The model requires the tick before a plan is built; that reading is INFERRED and worth confirming with him.
- **Where it lives:** `generator_spec_v1.json` → `legal_and_privacy.health_check`, `legal_and_privacy.release_every_build`, `legal_and_privacy.no_data_kept`, `legal_and_privacy.licence`; [`LICENSE`](../../LICENSE); [`DISCLAIMER.md`](../../DISCLAIMER.md); [`DISCLAIMER.es.md`](../../DISCLAIMER.es.md)
- **Changed later:**
  - **REFINED by [R4-SCP-02](#r4-scp-02) (round 4).** Before: A "use at your own risk" checkbox at every build; the team had left open whether the tick is required. Now: Required before the plan shows. A minimal release line is printed on the plan.
  - **REFINED by [R4-SCP-01](#r4-scp-01) (round 4).** Before: Clients take the health check; coaches may skip it. Now: Everyone may use the plans on their own, with the release.
  - **REFINED by [R4-REL-03](#r4-rel-03) (round 4).** Before: MIT to Lalo Vera, Blaze Camp and BFit Studios Corp. Now: Unchanged, and the repo also presents the model as the experience and intellectual property of Coach Lalo (Gerardo Vera), Master NASM coach.
  - **REFINED by [R4-LIB-05](library-details.md#r4-lib-05) (round 4).** Before: The third-party video links were still in the data. Now: Removed from the public data.
- **This answer changed:** [VOL-01](volume.md#vol-01) (reversed), [VOL-02](volume.md#vol-02) (reversed), [PER-07](testing.md#per-07) (refined), [GEN-02](product-and-generator.md#gen-02) (refined), [GEN-03](product-and-generator.md#gen-03) (refined), [R2-VOL-06](volume.md#r2-vol-06) (refined), [R2-PER-07](testing.md#r2-per-07) (refined), [R2-GEN-02](product-and-generator.md#r2-gen-02) (reversed, refined), [R2-GEN-03](#r2-gen-03) (refined), [R2-GEN-08](product-and-generator.md#r2-gen-08) (refined)
- **See also:** [R2-GEN-03](#r2-gen-03), [R2-GEN-02](product-and-generator.md#r2-gen-02), [VOL-01](volume.md#vol-01), [R2-GEN-08](product-and-generator.md#r2-gen-08)

<details>
<summary>His full answer, round 3 (from <code>coach_answers_round3.md</code>)</summary>

> Yeah, there probably should be a "use at your own risk" checkbox. I don't know if we should be keeping any kind of data, but I don't want any data kept. It doesn't matter if they click it; it comes out. If they click it, they understand it.
>
> Turn some conditions and liability releases. They should all be in that.
>
> Also, for people that are downloading the repo, eventually the public repo, the README, and all the files, there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation). That is registered in Florida, but it should be MIT to me so that the repo has that license to me. That repo should have, in the README and in certain places where it needs to be, that we are releasing liability, that you're downloading this at your own expense and risk, and that if you are going to use this for other clients, for other people, you should have your own liability release, all of that.
>
> Yes, there should also be a Spanish version. It doesn't only need to be English, and it should be translated as legally equivalent as possible in English and Spanish. We release all liabilities as soon as you decide to use this tool and these templates of workouts. The same: when you download the repo, you should understand what you're doing with it. It's at your own expense and risk, and your clients, and all of that. We should get all that done.

</details>

### Round 4: who may use the plans, the liability gate and the credit line

These three answers are the newest on this page.

#### R4-SCP-01

**Question (round 4).** Who can use the plans on their own, and who should work with a professional?

**Final rule.** Everyone should be able to use the plan on their own. All plans release liability before and after the plan comes out. There is a message that Blaze Camp is not liable for anything and the person is totally responsible. Before the plan comes out, the person clicks to approve that they are responsible.

- **Status:** Stands as answered.
- **We proposed (round 4):** On their own: healthy adults. Teens: with a coach or parent. Work with a professional first (the plan is still available to their coach): pregnancy or recent birth, serious medical conditions, coming back from an injury or surgery, frail older adults.
- **His verdict (round 4):** RIGHT, with words. His words went wider than the proposal: everyone, with the release.
- **In his words:** "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out." / "Even before it kicks out the thing, they should be able to click to approve that they're responsible." (R4-SCP-01)
- **Not confirmed by him:** **Open reading.** He marked the proposal RIGHT and then said "everyone". The model follows his words: nobody is barred from building a plan. The short health check of rounds 2 and 3 still exists, and in the current engine a flagged answer still stops the automatic plan and points to a professional. The team reads "everyone" as "everyone, once they accept the release" (INFERRED). Whether a health flag should still stop a plan is a question for him. Plans for minors still say a parent or guardian and a qualified coach must supervise (the disclaimer draft, §6).
- **Note:** In his dictated answer "reliable" means "liable".
- **Where it lives:** `model/rules.json` → `legal.gate` (`applies_to: everyone`), `legal.release_line`. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md). Decision record: [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md).
- **This answer changed:** [R2-GEN-03](#r2-gen-03) (refined), [R3-GEN-01](#r3-gen-01) (refined)
- **See also:** [R4-SCP-02](#r4-scp-02), [R2-GEN-03](#r2-gen-03), [R3-ATH-02](athletes-and-sports.md#r3-ath-02)

<details>
<summary>His full answer, round 4 (from <code>coach_answers_round4.md</code>)</summary>

> Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out. There should be a message on there that we are not reliable for anything. You're totally responsible. Even before it kicks out the thing, they should be able to click to approve that they're responsible.

</details>

#### R4-SCP-02

**Question (round 4).** Must the 'use at your own risk' box be ticked before a plan shows? (You said 'it doesn't matter if they click it; it comes out'.)

**Final rule.** Yes. The person must click it before the plan shows, as part of entering their data, so they understand the terms and conditions: this is not Blaze Camp's responsibility, it is on them. The plan itself also carries a minimal line, somewhere at the bottom or at the top, saying liability was released.

- **Status:** Stands as answered.
- **We proposed (round 4):** Not required. The risk notice is printed at the top of every plan no matter what. The box is just an acknowledgment.
- **His verdict (round 4):** PARTLY. He kept the printed notice and made the click required.
- **In his words:** "they need to click it before the plan shows, as part of when they put in their data" / "it should be outputted in their program somewhere at the bottom or at the top: you've released liability." (R4-SCP-02)
- **Not confirmed by him:** PROPOSED and LEGAL REVIEW: every word of the printed line. He said "I don't know how to do it. You need to figure that out." The team's design: no plan is generated without the acceptance; a full plan prints the line at the top and at the bottom; block, week and day views print a short line; there are three wordings (a person building their own plan, a fitness professional building for a client, a parent or guardian for a minor); each links `DISCLAIMER.md` or `DISCLAIMER.es.md`. Nothing is stored: the acceptance is stamped on the plan.
- **Where it lives:** `model/rules.json` → `legal.gate` (`required: true`, field `release.accepted`), `legal.release_line`; words `ui.plan.release_line`, `ui.plan.release_line_coach`, `ui.plan.release_line_minor`, `ui.plan.release_line_short`, `ui.plan.release_footer`, `warning.release_missing` in `model/i18n/`. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md). Decision record: [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md).
- **This answer changed:** [R2-GEN-03](#r2-gen-03) (refined), [R3-GEN-01](#r3-gen-01) (refined), [GEN-02](product-and-generator.md#gen-02) (refined)
- **See also:** [R4-SCP-01](#r4-scp-01), [R3-GEN-01](#r3-gen-01)

<details>
<summary>His full answer, round 4 (from <code>coach_answers_round4.md</code>)</summary>

> Yes, part of the whole thing is they need to click it before the plan shows, as part of when they put in their data, so that they understand the terms and conditions: this is not our responsibility, and this is on them. It should also be printed out in something minimal, not printed out on actual paper, but it should be outputted in their program somewhere at the bottom or at the top: you've released liability. Something. I don't know how to do it. You need to figure that out.

</details>

#### R4-REL-03

**Question (round 4).** How should the repo describe itself publicly?

**Final rule.** As a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera, a Master NASM coach. It is his intellectual property: his condensing and consolidating of everything, and the way he thinks about the workflows of putting programming together. The rest of the proposal stands: open, free for anyone to build on, with no "world's best" or injury-prevention claims.

- **Status:** Stands as answered.
- **We proposed (round 4):** 'An open, complete coaching model: exercise library, programming rules and sport profiles from coach Lalo Vera, free for anyone to build on.' No 'world's best' or injury-prevention claims.
- **His verdict (round 4):** PARTLY. He added who he is and that the model is his intellectual property.
- **In his words:** "it should talk about this being a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera. Master NASM coach." / "This is me and my intellectual property of condensing and consolidating everything and the way I think of the workflows of putting together programming." (R4-REL-03)
- **Not confirmed by him:** He said "I have a bunch of certifications. You could look them up." The list of certifications is not written anywhere in this repo, and the team does not invent or look up credentials. Round 5 settled it: "Master NASM coach" only, as written; the placeholder is removed (R5-PUB-02). The licence stays MIT ([R3-GEN-01](#r3-gen-01)); "intellectual property" here is a credit and authorship statement, and its exact legal wording is for the attorney.
- **Where it lives:** the repo's front pages (`README.md`, `MODEL_CARD.md`) and the master document's opening. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md). Decision record: [ADR-009](../04-decisions/adr-009-mit-license-and-disclaimers.md).
- **This answer changed:** [R3-GEN-01](#r3-gen-01) (refined)
- **See also:** [R4-REL-01](product-and-generator.md#r4-rel-01), [R3-GEN-01](#r3-gen-01)

<details>
<summary>His full answer, round 4 (from <code>coach_answers_round4.md</code>)</summary>

> Yeah, but it should talk about this being a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera. Master NASM coach. I have a bunch of certifications. You could look them up. This is me and my intellectual property of condensing and consolidating everything and the way I think of the workflows of putting together programming.

</details>

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [GEN-03](product-and-generator.md#gen-03) | [product-and-generator](product-and-generator.md) | His first idea of giving the repo away as open source. |
| [R2-GEN-02](product-and-generator.md#r2-gen-02) | [product-and-generator](product-and-generator.md) | The Apache + CC BY licences, later replaced by MIT. |
| [VOL-01](volume.md#vol-01) | [volume](volume.md) | "Learns from the data of all the people": reversed by no data kept. |
| [GEN-06](product-and-generator.md#gen-06) | [product-and-generator](product-and-generator.md) | Videos. |
| [R2-ATH-08](athletes-and-sports.md#r2-ath-08) | [athletes-and-sports](athletes-and-sports.md) | The warning shown when an older adult switches on jumps or Olympic lifts. |
| [R2-GEN-08](product-and-generator.md#r2-gen-08) | [product-and-generator](product-and-generator.md) | Spanish. |
| [R3-VOL-02](progression.md#r3-vol-02) | [progression](progression.md) | No check-ins, so nothing is collected. |
