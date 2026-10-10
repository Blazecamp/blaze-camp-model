# Coach answers: Legal and open source

The health check, the release of liability, privacy, the licence and the plan to open the repo. Clients go through a short health check; coaches may skip it with a legal warning. Everyone ticks a "use at your own risk" box every time a plan is built. No user data is kept. The repo is licensed MIT (a short, permissive open-source licence) to Lalo Vera, Blaze Camp and BFit Studios Corp., and says in English and Spanish that people use it at their own expense and risk. The legal texts are drafts until a licensed attorney reviews them.

This page is part of [the coach answers by topic](index.md). It holds 2 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [safety and liability](../00-overview/safety-and-liability.md), [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md), [LICENSE](../../LICENSE).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Clients get a short health check before a plan. Coaches can run it with their client or skip it, with a legal warning. | [R2-GEN-03](#r2-gen-03), [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 2 | Coaches who build programs for people need their own screening and their own liability release. | [R2-GEN-03](#r2-gen-03), [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 3 | Everyone, client or coach, releases liability every time they get a plan, through a "use at your own risk" checkbox that also covers the terms and conditions. | [R2-GEN-03](#r2-gen-03), [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 4 | No data is kept. | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 5 | The licence is MIT, to Lalo Vera, Blaze Camp (doing business as) and BFit Studios Corp. (Florida corporation). | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 6 | The README and the repo say: liability is released, you download and use this at your own expense and risk, and if you use it for clients you need your own liability release. | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 7 | Everything legal exists in English and in Spanish, translated as legally equivalent as possible. | [R3-GEN-01](#r3-gen-01) | CONFIRMED |
| 8 | The repo will become a fully explained public resource, free for anyone to use, with a guide for adding exercises. | conversation | CONFIRMED |
| 9 | The exercise videos linked in his sheets are not his. | conversation | CONFIRMED |
| 10 | The wording of the health check, the terms and the release (drafts for a licensed Florida attorney), and requiring the tick before the Build button works. | [R3-GEN-01](#r3-gen-01) | PROPOSED |

## Why, in his words

- "I don't want any data kept." ([R3-GEN-01](#r3-gen-01))
- "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." ([R2-GEN-03](#r2-gen-03))
- "We release all liabilities as soon as you decide to use this tool and these templates of workouts." ([R3-GEN-01](#r3-gen-01))
- "I don't think anything like this exists." (conversation, `coach_chat_statements.md`)

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| Health check route | `generator_spec_v1.json` | `legal_and_privacy.health_check` |
| The release at every build | `generator_spec_v1.json` | `legal_and_privacy.release_every_build` |
| No data kept | `generator_spec_v1.json` | `legal_and_privacy.no_data_kept` |
| Licence | `generator_spec_v1.json` | `legal_and_privacy.licence` |
| The health check on the form (client / coach) | `generator_spec_v1.json` | `inputs_schema.fields.F01` |
| The own-risk box on the form | `generator_spec_v1.json` | `inputs_schema.fields.F46` |
| The checks that enforce it | `generator_spec_v1.json` | `validation_checks.V21_release` |
| Licence text | `LICENSE` | (whole file) |
| Disclaimer and release, English | `DISCLAIMER.md` | (whole file) |
| Disclaimer and release, Spanish | `DISCLAIMER.es.md` | (whole file) |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [R2-GEN-03](#r2-gen-03) | 2 | RIGHT | Health check for clients; coaches may bypass it with a legal warning; everyone releases liability every time. | Stands, refined |
| [R3-GEN-01](#r3-gen-01) | 3 | RIGHT | Lawyer-written health check EN/ES + PAR-Q+ link; own-risk checkbox every build; no data kept; MIT to Lalo Vera, Blaze Camp, BFit Studios Corp.; legal text in EN and ES. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| The repo is private for now. It will become a fully explained public repo: "the most comprehensive training model that there is out there," free "for anybody to use in their own app and their own training." | `coach_chat_statements.md` | First raised in [GEN-03](product-and-generator.md#gen-03). |
| It may include copies of his original Google Sheets "so people can download it and play with it." | `coach_chat_statements.md` | No questionnaire answer changed it. |
| People must be able to add and create exercises, with the repo explaining how. AI agents should be able to go in and grab from it. | `coach_chat_statements.md` | The how-to is [adding-exercises.md](../adding-exercises.md) (Spanish: [adding-exercises.es.md](../adding-exercises.es.md)). |
| "I don't think anything like this exists." He believes only a handful of people have built something this robust and open-sourced it. | `coach_chat_statements.md` | No questionnaire answer changed it. |
| The exercise videos linked in his sheets are not his. "The Blaze Camp name is the culture." | `coach_chat_statements.md` | Videos became optional in [R2-GEN-02](product-and-generator.md#r2-gen-02). |
| License: MIT, to Lalo Vera, Blaze Camp (doing-business-as) and BFit Studios Corp. (Florida corporation). Liability released in English and Spanish; anyone using it for clients needs their own liability release. | `coach_chat_statements.md` | Confirmed in [R3-GEN-01](#r3-gen-01). The licence text is in the repo's LICENSE file. |
| Data to back up the science of the model. | `coach_chat_statements.md` | One of the two things he asked outside reviewers to research. |
| Exercises and anything else the model might be missing compared with other models. | `coach_chat_statements.md` | The second thing he asked outside reviewers to research. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Health check and release of liability

#### R2-GEN-03

**Question (round 2).** Should the form start with a short health check that sends some people to a professional first?

**Final rule.** The form starts with a short health check. The five items that send someone to a professional first: chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said no. A client goes through the PAR-Q. A coach has a choice: run the health check, or bypass it because they are a fitness professional pulling a program for a client and follow their own onboarding procedures. The bypass shows a legal warning. Coaches who build programs for people should have their own PAR-Qs, "because we release all liability for this". Everyone releases liability every time they get a plan, client or coach. Round 3 kept all of this and set how it is done.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: chest pain or heart issues, surgery or a fracture in the last 6 months, pregnant or gave birth in the last 6 months, an injury under treatment, or a doctor said no: no automatic plan, refer them to a professional or to you.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "I want to be able to bypass it if I'm a coach and I just want to get it done." / "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." (R2-GEN-03)
- **Note:** In his dictated answer the PAR-Q (Physical Activity Readiness Questionnaire) appears as "park queue".
- **Where it lives:** `generator_spec_v1.json` → `legal_and_privacy.health_check`, `inputs_schema.fields.F01`, `inputs_schema.fields.F45`, `validation_checks.V1_safety`
- **Changed later:**
  - **REFINED by [R3-GEN-01](#r3-gen-01) (round 3).** Before: Clients go through the PAR-Q. Now: The official PAR-Q+ is copyrighted and has no Spanish version, so a lawyer writes a short Blaze Camp health check in English and Spanish, with a link to the official PAR-Q+.
  - **REFINED by [R3-GEN-01](#r3-gen-01) (round 3).** Before: Everyone releases liability every time. Now: One "use at your own risk" checkbox covering terms and conditions and the release, at every build or rebuild. No data kept.
- **See also:** [R3-GEN-01](#r3-gen-01)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> There should be an option: if you're a coach, please make sure that you follow your standard operating procedures for onboarding your clients. If you're a client, then we take them through the park queue. If you're a coach, it should be able to be toggled: do you want to follow your park queue because you are not a fitness professional, or are you a fitness professional just pulling a program for one of your clients? Please make sure that you follow up on our Q&A health status, that kind of thing. All the health checks should be there as an option. I want to be able to bypass it if I'm a coach and I just want to get it done. Meaning that it should have some type of legal warning to the coach. If they're building programs for people, they should be able to have their own park use because we release all liability for this. We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach.

</details>

#### R3-GEN-01

**Question (round 3).** Health check and liability release: OK to do it this way?

**Final rule.** Health check: the official PAR-Q+ is copyrighted, must be used unchanged and has no Spanish version. So a lawyer writes a short Blaze Camp health check (his 5 "see a professional first" items plus the usual PAR-Q topics) in English and Spanish, with a link to the official PAR-Q+. Coaches can run it with their client or skip it with his legal warning. Release: everyone, client or coach, accepts it every time a plan is built or rebuilt, including the start of each new block, and not when they just reopen a plan. He wants a "use at your own risk" checkbox, with the terms and conditions and the liability releases all in it. Data: "I don't want any data kept." Licence: MIT to Lalo Vera (him), Blaze Camp (the doing-business-as) and BFit Studios Corp. (the corporation, registered in Florida). The README and the files must say that liability is released, that people download it at their own expense and risk, and that anyone using it for clients needs their own liability release. There must be a Spanish version, translated as legally equivalent as possible.

- **Status:** Stands as answered.
- **We proposed (round 3):** The official PAR-Q+ is copyrighted, must be used unchanged and has no Spanish version, so a lawyer writes a short Blaze Camp health check (your 5 'see a professional first' items + the usual PAR-Q topics) in English and Spanish, with a link to the official PAR-Q+. Coaches can run it with their client or skip it with your legal warning. Everyone, client or coach, ticks the release every time a plan is built or rebuilt, including the start of each new block (not when they just reopen the plan or send a check-in). The record stays on the phone and is printed on every screenshot, PDF and sheet.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "I don't want any data kept." / "there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation)" / "it should be translated as legally equivalent as possible in English and Spanish" / "if you are going to use this for other clients, for other people, you should have your own liability release" (R3-GEN-01)
- **Not confirmed by him:** The proposal said the release record stays on the phone. His words say no data is kept, so the record is only printed on the plan and its exports (the team's design, PROPOSED). The texts in DISCLAIMER.md and DISCLAIMER.es.md are drafts and need review by a licensed Florida attorney before public release. He also said "It doesn't matter if they click it; it comes out. If they click it, they understand it." The model requires the tick before a plan is built; that reading is INFERRED and worth confirming with him.
- **Where it lives:** `generator_spec_v1.json` → `legal_and_privacy.health_check`, `legal_and_privacy.release_every_build`, `legal_and_privacy.no_data_kept`, `legal_and_privacy.licence`; [`LICENSE`](../../LICENSE); [`DISCLAIMER.md`](../../DISCLAIMER.md); [`DISCLAIMER.es.md`](../../DISCLAIMER.es.md)
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
