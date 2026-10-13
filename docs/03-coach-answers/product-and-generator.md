# Coach answers: Product and generator

Who the tool is for, what it asks and what it gives back. It is for clients, coaches, trainers, strength and conditioning coaches and anyone else, in English with a full Spanish switch. It must be very simple: put in the basics, get the whole program, see it ahead of time, adjust it yourself. The form asks about workouts only: no sex, no sleep, no stress. The output is a phone-friendly website, not an app, that people can screenshot. The tool does not track anyone. Health check, liability and licence are on the [legal and open source](legal-and-open-source.md) page. **Newest answers:** the form no longer asks for a session length ([R4-SES-01](sessions-and-order.md#r4-ses-01)); the output is an editable template, including the sets of any day or week ([CX-04](#cx-04)); accepting the terms and release is required before a plan is shown ([R4-SCP-02](legal-and-open-source.md#r4-scp-02)); and he approved releasing the model as v1.3 and building the engine now ([R4-REL-01](#r4-rel-01), [R4-REL-02](#r4-rel-02)).

This page is part of [the coach answers by topic](index.md). It holds 16 ids: 13 from rounds 1 to 3, the dated clarification CX-04, and 2 from round 4. Every place where a later answer changed an earlier one is also listed in [changes across rounds](changes-across-rounds.md). Read next: [how a plan is made](../00-overview/how-a-plan-is-made.md), [for developers](../00-overview/for-developers.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Users: clients, coaches, trainers, strength and conditioning coaches, anyone. | [GEN-01](#gen-01) | CONFIRMED |
| 2 | English first, with a switch that turns the whole thing into Spanish: neutral Latin American Spanish, with the English gym word in brackets. Pounds in the US, kilograms elsewhere, switchable. | [GEN-01](#gen-01), [R2-GEN-08](#r2-gen-08) | CONFIRMED |
| 3 | Very simple and few inputs. The plan is kicked out whole, people see it ahead of time and adjust it themselves. It is an editable template: swaps, blocks, exercises, and the sets of any day or week. | [R3-VOL-04](progression.md#r3-vol-04), [CX-04](#cx-04), [CX-02](progression.md#cx-02) | CONFIRMED |
| 4 | The form asks about workouts only. No sex field. No sleep, stress or other lifestyle questions. | [GEN-02](#gen-02), [R2-GEN-04](#r2-gen-04) | CONFIRMED |
| 5 | The form asks training experience in years, body weight, and for competitive athletes sport, position and season. Recreational players give a general sport only. It does not ask how long a session should be. | [GEN-02](#gen-02), [R4-SES-01](sessions-and-order.md#r4-ses-01) | CONFIRMED |
| 6 | Competitive athletes give the next season start date and their practice and game days; the tool works out the phase. | [R2-GEN-05](#r2-gen-05) | CONFIRMED |
| 7 | People can pick Focus muscle 1 and Focus muscle 2. | [R3-SES-01](sessions-and-order.md#r3-ses-01) | CONFIRMED |
| 8 | Every slot gets a default exercise, with a dropdown to swap inside the same category. A swap says in one line what it keeps and what it loses. | [GEN-04](#gen-04), [R4-LIB-04](library-details.md#r4-lib-04) | CONFIRMED |
| 9 | A phone-friendly website, not an app. Fewest clicks. Macro views of the block, the week and the day. Easy to screenshot and send. | [GEN-03](#gen-03), [R2-GEN-02](#r2-gen-02) | CONFIRMED |
| 10 | The tool does not track. People track for themselves, however they like. | [GEN-03](#gen-03), [R3-VOL-02](progression.md#r3-vol-02) | CONFIRMED |
| 11 | Videos are optional. No third-party video links in the public data: each exercise has a YouTube search link and an easy way to copy its name. | [R2-GEN-02](#r2-gen-02), [R4-LIB-05](library-details.md#r4-lib-05) | CONFIRMED |
| 12 | A short coaching cue per exercise in his voice, plus his instruction block at the top. | [GEN-07](#gen-07) | CONFIRMED |
| 13 | Weight is given in reps-in-reserve language. Percentages only for lifts with a recent tested best. Olympic lifts are explained as power output. | [R2-GEN-06](#r2-gen-06) | CONFIRMED |
| 14 | Hard rules the generator never breaks: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped. Coaches can add their own rules. | [GEN-08](#gen-08) | CONFIRMED |
| 15 | He grades seven sample plans before launch. | [R2-GEN-07](#r2-gen-07) | CONFIRMED |
| 15b | Model v1.3 is released as the finished model; the engine is built now, in the same repo. | [R4-REL-01](#r4-rel-01), [R4-REL-02](#r4-rel-02) | CONFIRMED |
| 16 | Screen layouts, export formats, the coach rule-pack mechanism, what the tool shows after an edit, and all cost estimates. | [R2-GEN-02](#r2-gen-02), [GEN-08](#gen-08), [CX-04](#cx-04) | PROPOSED |

## Why, in his words

- "I just need the workouts here." ([R2-GEN-04](#r2-gen-04))
- "The fewer clicks, the better." ([R2-GEN-02](#r2-gen-02))
- "They should be tracking it themselves, however they want to track it" ([GEN-03](#gen-03))
- "This needs to be very simple for them to see the whole thing ahead of time" ([R3-VOL-04](progression.md#r3-vol-04))
- "I need you to take away just sex." ([GEN-02](#gen-02))
- "it should be all editable as they need to" ([CX-04](#cx-04))
- "Yes, go ahead and finish it all, and then after you're done, consolidate everything." ([R4-REL-01](#r4-rel-01))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| Every intake field | `generator_spec_v1.json` | `inputs_schema.fields` |
| Fields that were removed, and why | `generator_spec_v1.json` | `inputs_schema.removed_fields` |
| Languages | `generator_spec_v1.json` | `inputs_schema.i18n` |
| The product path | `generator_spec_v1.json` | `output.recommendation` |
| Block, week and day views | `generator_spec_v1.json` | `output.views` |
| What every export carries | `generator_spec_v1.json` | `output.exports_rules` |
| Videos | `generator_spec_v1.json` | `output.videos` |
| Cues | `generator_spec_v1.json` | `output.cues` |
| How weight is told | `generator_spec_v1.json` | `output.weight_guidance` |
| Hard rules | `generator_spec_v1.json` | `rule_tables.ordering.hard` |
| Coach-added rules | `generator_spec_v1.json` | `coach_rule_hooks` |
| Sample plans to grade | `generator_spec_v1.json` | `output.sample_plans_for_grading` |
| The build steps, in order | `generator_spec_v1.json` | `pipeline` |
| Plan edits: sets, add, remove, block on or off (CX-04) | `engine/edit.mjs` | `applyPlanEdits`; plan field `edited` |
| The intake without a session length (R4-SES-01) | `engine/CONTRACTS.md` | intake `schedule = {days_per_week, weekdays, start_date}` |
| Spec keys for every 2026-10-10 and round-4 answer | `coverage_matrix_round4.md` | |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [GEN-01](#gen-01) | 1 | answered in words (no chip) | For clients, coaches, trainers, S&C coaches, anyone; English first with a full Spanish toggle. | Stands, refined |
| [R2-GEN-08](#r2-gen-08) | 2 | RIGHT | Neutral Latin American Spanish with the English gym word in brackets; he approves the lines; lb / kg switchable. | Stands, refined |
| [GEN-02](#gen-02) | 1 | answered in words (no chip) | Intake: no sex; training experience in years; body weight; sport, position and season only for competitive athletes. Session length left the form in round 4. | Partly superseded |
| [R2-GEN-04](#r2-gen-04) | 2 | NOT RIGHT | No sleep, stress or lifestyle questions: workouts only. | Stands |
| [R2-GEN-05](#r2-gen-05) | 2 | RIGHT | Ask the season start date and practice / game days; the tool works out the phase. | Stands |
| [GEN-03](#gen-03) | 1 | answered in words (no chip) | Output: a simple, phone-friendly website (not an app); no tracking by the tool; the repo given away as open source. | Stands, refined |
| [R2-GEN-02](#r2-gen-02) | 2 | RIGHT | Phone-friendly website: fewest clicks, block / week / day views, easy screenshots, videos optional. | Partly superseded |
| [GEN-04](#gen-04) | 1 | RIGHT | A default exercise in every slot plus same-category dropdown swaps. | Stands, refined |
| [GEN-06](#gen-06) | 1 | answered in words (no chip) | Superseded: videos are optional; each exercise has a YouTube search link and a name to copy. | Superseded |
| [GEN-07](#gen-07) | 1 | RIGHT | A short cue per exercise in his voice + his instruction block at the top. | Stands |
| [R2-GEN-06](#r2-gen-06) | 2 | RIGHT | Weight in reps-in-reserve words; percentages only with a recent tested best; Olympic lifts explained as power output. | Stands |
| [GEN-08](#gen-08) | 1 | RIGHT | Hard rules: no failure on heavy compounds, no V-squat, power before strength, horizontal before vertical, core never skipped. Coaches can add rules. | Stands, refined |
| [R2-GEN-07](#r2-gen-07) | 2 | RIGHT | He grades seven sample plans: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs. | Stands, refined |
| [CX-04](#cx-04) | 2026-10-10 | said in conversation | The output is an editable template: everything can be adjusted, including the sets of any day or week. | Stands |
| [R4-REL-01](#r4-rel-01) | 4 | RIGHT | Release model v1.3 as the finished model; finish it all, then consolidate. | Stands, refined |
| [R4-REL-02](#r4-rel-02) | 4 | PARTLY | Build the engine now. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| He wants his programming system captured so a tool can take basic information and "kick out" a 6-, 8- or 12-week plan (later: 4–6-week maintenance, 8, 12, week-by-week, yearly). | `coach_chat_statements.md` | Plan lengths are in [PER-01](plans-and-calendar.md#per-01) (plans-and-calendar). |
| It should serve "different gyms, different people, different coaches, and all of our clients": a database "to help a lot of people who haven't really created something like this." | `coach_chat_statements.md` | Matches [GEN-01](#gen-01). |
| No landing page or app is being built yet. First organize the data and context. | `coach_chat_statements.md` | No questionnaire answer changed it. |
| It must be very simple: put in the basics, get the whole program, see it ahead of time, adjust it yourself. No check-ins, no tracking, no data kept (confirmed in round 3). | `coach_chat_statements.md` | Confirmed by [R3-VOL-02](progression.md#r3-vol-02), [R3-VOL-04](progression.md#r3-vol-04) and [R3-GEN-01](legal-and-open-source.md#r3-gen-01). |
| English first with a full Spanish toggle. | `coach_chat_statements.md` | [GEN-01](#gen-01) and [R2-GEN-08](#r2-gen-08). |
| Users: clients, coaches, trainers, strength and conditioning coaches, anyone. | `coach_chat_statements.md` | [GEN-01](#gen-01). |
| He wants "the best mathematical, logical algorithms possible to make sure this is top of the line. Spare no expense." | `coach_chat_statements.md` | No questionnaire answer changed it. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Who it is for and which language

#### GEN-01

**Question (round 1).** Who will use it?

**Final rule.** The tool is used by clients, coaches, trainers, strength and conditioning coaches, and anyone. It is used in English and in Spanish. It starts in English and has a toggle that turns the whole thing into Spanish.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Your clients and the public, self-serve, with an option for you to review before a plan goes out.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "There should be a toggle for the whole thing, and it's also going to be used in English." (GEN-01)
- **Note:** Our assumption also offered him a review step before a plan goes out. He did not take that up.
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.i18n`, `inputs_schema.fields.F00`, `inputs_schema.fields.F39`
- **Changed later:**
  - **REFINED by [R2-GEN-08](#r2-gen-08) (round 2).** Before: All in Spanish, with a toggle. Now: Neutral Latin American Spanish, with the English gym word in brackets; approved line by line by him or a coach he trusts.
- **See also:** [R2-GEN-08](#r2-gen-08)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Ideally, this is going to be used by:
>
> - clients
> - coaches
> - trainers
> - strength and conditioning coaches
> - anyone
>
> It's going to be used in Spanish, all in Spanish. There should be a toggle for the whole thing, and it's also going to be used in English. It should start in English and toggle to Spanish if needed, the whole thing. We got to get all that right.

</details>

#### R2-GEN-08

**Question (round 2).** Which Spanish, and who approves it?

**Final rule.** Spanish is neutral Latin American Spanish, with the English gym word in brackets where gyms use it: "Empuje de cadera (Hip Thrust)". He or a coach he trusts approves every line. Pounds in the US and kilograms elsewhere, switchable.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Neutral Latin American Spanish, with the English gym word in brackets where gyms use it ('Empuje de cadera (Hip Thrust)'). You or a coach you trust approves every line; pounds in the US and kilograms elsewhere, switchable.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "That sounds right. If it's the best way to go, then let's do that" (R2-GEN-08)
- **Where it lives:** `generator_spec_v1.json` → `output.language`, `inputs_schema.i18n`
- **Changed later:**
  - **REFINED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before: Spanish for the plan and the form. Now: The legal texts also exist in Spanish, "translated as legally equivalent as possible".
- **This answer changed:** [GEN-01](#gen-01) (refined)
- **See also:** [GEN-01](#gen-01), [R3-GEN-01](legal-and-open-source.md#r3-gen-01)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> That sounds right. If it's the best way to go, then let's do that

</details>

### What the form asks

#### GEN-02

**Question (round 1).** Intake fields: what's missing or unnecessary?

**Final rule.** Take sex off the form. Replace "training age" with training experience, in years of training and experience in the gym. Under goals, open the sport and position options when someone trains for athleticism in a sport. For recreational sports there is no position and no season, just the general sport. Add body weight, which matters for the training. The rest of our list stood at the time: goal, age, days per week, session length, equipment, injuries or pain areas, priority muscles, rep-style preference and plan length. Later rounds renamed priority muscles to Focus muscle 1 and 2, refused any lifestyle question and added the own-risk box. **Round 4 took session length off the form** ([R4-SES-01](sessions-and-order.md#r4-ses-01)) and made accepting the terms a condition for getting a plan ([R4-SCP-02](legal-and-open-source.md#r4-scp-02)).

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We assumed (round 1):** Goal · sport + position · season · training age · age · sex · days per week · session length · equipment · injuries/pain areas · priority muscles · rep-style preference · plan length (6/8/12).
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "I need you to take away just sex." / "Also, you missed weight." (GEN-02)
- **Not confirmed by him:** Dropping the email field follows from "I don't want any data kept" ([R3-GEN-01](legal-and-open-source.md#r3-gen-01)); he never mentioned email, so that is INFERRED.
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.removed_fields`, `inputs_schema.fields.F17`, `inputs_schema.fields.F05`, `inputs_schema.fields.F11a`
- **Changed later:**
  - **REFINED by [R2-GEN-04](#r2-gen-04) (round 2).** Before: The field list. Now: No sleep, stress or job questions: workouts only.
  - **REFINED by [R2-GEN-05](#r2-gen-05) (round 2).** Before: Season as a field. Now: Ask the next season start date and the practice and game days.
  - **REFINED by [R3-SES-01](sessions-and-order.md#r3-ses-01) (round 3).** Before: Priority muscles on the form. Now: Focus muscle 1 and Focus muscle 2.
  - **REFINED by [R3-VOL-04](progression.md#r3-vol-04) (round 3).** Before: A list of fields. Now: "We're not going to need a lot of inputs for this."
  - **REFINED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before: The field list. Now: A "use at your own risk" box before every build; no data kept.
  - **REVERSED in part by [R4-SES-01](sessions-and-order.md#r4-ses-01) (round 4) and [CT-01](sessions-and-order.md#ct-01) (2026-10-10).** Before (superseded): "Session length" was one of the form's questions. Now: "Drop it. We don't need it." The form does not ask how long a session should be.
  - **REFINED by [R4-SCP-02](legal-and-open-source.md#r4-scp-02) (round 4).** Before: An own-risk box on the form. Now: Accepting the terms and release is required before a plan is shown.
- **See also:** [ATH-09](athletes-and-sports.md#ath-09), [R2-GEN-04](#r2-gen-04), [R2-GEN-05](#r2-gen-05), [R3-SES-01](sessions-and-order.md#r3-ses-01), [PRG-05](levels-and-zones.md#prg-05)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> I need you to take away just sex. Instead of training age, you could put training experience, and then it goes by maybe years of training and experience in the gym.
>
> When it says goals, I need you to open up the options for sports and positions if they are trying to train for athleticism in sports. If they're recreational sports, then you don't need to go into what sport, what position, or maybe you do. If they're recreational sports, you don't need to go into position and season, just general sports.
>
> Also, you missed weight. We need to put the weight in there as well because weight is going to be important for their training.

</details>

#### R2-GEN-04

**Question (round 2).** Add three quick taps to the form: usual sleep, stress, and a physical job or other sport?

**Final rule.** He refused three quick questions about usual sleep, stress and a physical job or other sport. The tool deals with workouts and nothing else.

- **Status:** Stands as answered.
- **We proposed (round 2):** Yes: it sets the starting weekly step (3 % instead of 5 % when sleep, stress or workload are bad).
- **His verdict (round 2):** NOT RIGHT
- **In his words:** "No, I don't want anything to do with anything else other than just workouts. I just need the workouts here." (R2-GEN-04)
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.removed_fields`, `validation_checks.V26_inputs`
- **This answer changed:** [GEN-02](#gen-02) (refined), [R2-VOL-01](progression.md#r2-vol-01) (reversed)
- **See also:** [GEN-02](#gen-02), [R2-VOL-01](progression.md#r2-vol-01), [R2-VOL-03](progression.md#r2-vol-03), [R3-VOL-04](progression.md#r3-vol-04)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> No, I don't want anything to do with anything else other than just workouts. I just need the workouts here. There's no need to talk about sleep or stress or anything else.

</details>

#### R2-GEN-05

**Question (round 2).** For competitive athletes, ask the season dates or the season phase?

**Final rule.** For competitive athletes the form asks the next season start date (or "in season until"), plus practice and game days per week. The tool works out off-season, pre-season and in-season from that.

- **Status:** Stands as answered.
- **We proposed (round 2):** Ask the next season start date (or 'in season until'), plus practice and game days per week. The tool works out off-season, pre-season and in-season.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.fields.F14`, `inputs_schema.fields.F15`, `plan_types.season.calendar`
- **This answer changed:** [PER-08](plans-and-calendar.md#per-08) (refined), [GEN-02](#gen-02) (refined)
- **See also:** [PER-08](plans-and-calendar.md#per-08), [R2-PER-06](plans-and-calendar.md#r2-per-06), [R2-ATH-07](athletes-and-sports.md#r2-ath-07)

### What comes out

#### GEN-03

**Question (round 1).** Output format?

**Final rule.** In round 1 the output format was open. His thoughts: a PDF would be the easiest, because people can screenshot it and follow it. Something easy for phone view. He was not sure about a Google Sheet. People should not be tracking through the tool; they track for themselves, in a notebook or however they want. He does not want a whole app (that plan fell through). Maybe a website. Or a website plus the repo, given away as open source to any coach or person who wants to build a training app on the model. Rounds 2 and 3 settled it: a phone-friendly website, outputs only, no tracking, open source under MIT.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** A Google Sheet like BYOP (with dropdowns and WEIGHT / EFFORT / HOW IT FELT / DONE tracking columns), plus a phone-friendly view.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "I don't think that they should be tracking it from us. They should be tracking it themselves, however they want to track it, notebook or whatever" / "just give away the repo, open source it to any coach and person that wants to create a training app and just use this model to put it all together" (GEN-03)
- **Where it lives:** `generator_spec_v1.json` → `output.recommendation`, `output.exports_rules`
- **Changed later:**
  - **REFINED by [R2-GEN-02](#r2-gen-02) (round 2).** Before: "I don't know what the output should be yet." Now: A phone-friendly website first: fewest clicks, macro views of block, week and day, easy screenshots.
  - **REFINED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before: "I don't know if people want to track it or not." Now: "We're only doing outputs." No check-ins, no tracking.
  - **REFINED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before: Open source it to any coach and person. Now: The licence is MIT; no user data is kept.
- **See also:** [R2-GEN-02](#r2-gen-02), [GEN-05](progression.md#gen-05), [R3-GEN-01](legal-and-open-source.md#r3-gen-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> I don't know what the output should be yet (the output format), but I think that you should be able to give me some ideas. Is this something that we could just create, or should we create it as a PDF? I think that'll be the easiest thing because they could just screenshot it and follow it. That'll be really easy.
>
> Should it create a Google Sheet? For them, I don't know. Something easy for phone view would definitely be something. I don't know if people want to track it or not. I don't think that they should be tracking it from us. They should be tracking it themselves, however they want to track it, notebook or whatever, but I don't know what to do with this yet.
>
> I was going to create a whole app, but that kind of fell through, so I don't want to create a whole app. Maybe just a website they can just go into, and then that'll make it real easy. Or I should just create the website and also create the repo, and just give away the repo, open source it to any coach and person that wants to create a training app and just use this model to put it all together. It's a pretty good model, to be honest. I don't know. I don't know yet. That's something that we're going to have to figure out.

</details>

#### R2-GEN-02

**Question (round 2).** Build a phone-friendly website (not an app) first, then add the check-in, then open-source it after you approve the model?

**Final rule.** He approved building a phone-friendly website first (not an app). His words set the design: as simple as possible, the fewer clicks the better, easy to manage on a phone. He wants a macro view of the week, of the block and of the day, with easy toggles between them. A coach can screenshot 12 weeks or 1 week and send it; an athlete takes a picture of their week and follows it. People can look up videos on YouTube; the videos do not need to be in the tool. Where a video is missing, a note can invite people to send one. Two parts of the approved proposal were later dropped: the check-in phase, and the Apache + CC BY licences.

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We proposed (round 2):** Yes: phase 1 website with the plan, save-day-as-image, PDF and a Google Sheet download (about 10-14 developer-weeks); phase 1.1 the check-in (+3.5-5 weeks); then open source with the code free to use (Apache), the model shared with credit to you (CC BY), and your videos, cues and the Blaze Camp name kept yours.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "The fewer clicks, the better." / "No need to have the videos on there." (R2-GEN-02)
- **Not confirmed by him:** The developer-week estimates in the proposal are the team's and were not something he decided. The exact screens and export formats are PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `output.recommendation`, `output.views`, `output.videos`, `inputs_schema.fewest_clicks`
- **Changed later:**
  - **REVERSED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before (superseded): Approved path: website, then a weekly check-in, then open source. Now: No check-in phase. "We're only doing outputs."
  - **REVERSED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before (superseded): Approved proposal: code under Apache, the model under CC BY. Now: MIT for the repo, to Lalo Vera, Blaze Camp and BFit Studios Corp.
  - **REFINED by [R3-GEN-01](legal-and-open-source.md#r3-gen-01) (round 3).** Before: Save-day-as-image, PDF and a Google Sheet download. Now: Same exports, and nothing the person enters is kept.
  - **REFINED by [R4-LIB-05](library-details.md#r4-lib-05) (round 4).** Before: Videos optional; people look them up on YouTube. Now: A "search this exercise on YouTube" link for each exercise and an easy way to copy its name. No third-party links in the public data.
  - **REFINED by [R4-REL-01](#r4-rel-01) (round 4).** Before: Website first, then open source. Now: The model is released as v1.3 before any website is built.
- **This answer changed:** [GEN-03](#gen-03) (refined), [GEN-06](#gen-06) (reversed)
- **See also:** [GEN-03](#gen-03), [GEN-06](#gen-06), [R3-GEN-01](legal-and-open-source.md#r3-gen-01), [R3-VOL-02](progression.md#r3-vol-02)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, ideally, we want to make it as simple as possible. The fewer clicks, the better. The easier it is to manage on a phone, the better. The better I can see the macro view of the week, the macro view of the block, and the macro view per day. I should be able to have the options for visibility easily toggled so that I can understand it and I can overview the program.
>
> For example, if a coach creates a program for somebody, they can just screenshot their 12 weeks and send it over to them, or they can screenshot 1 week and send it over to them. It'll make it a lot easier for the coach to have everything organized. And for the athlete, the same: I think you just take a picture of their week, what it's going to be, and they just follow it. They can just look up the videos on their own on YouTube. No need to have the videos on there. If we want to have the videos on there of the exercises we have, if we don't have the exercise on video, we could just put them on there. We haven't built our video library. If you would like to add video for this, please send an email to whatever, something like that. I don't know yet.

</details>

#### GEN-04

**Question (round 1).** Should the plan pick exact exercises, or leave dropdown choices in each slot like BYOP?

**Final rule.** The plan picks a default exercise in every slot and keeps the dropdown, so the person can swap inside the same category. "That's going to be important." Round 3 added that people can also add or remove exercises and blocks.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Pick a default exercise in every slot and keep the dropdown so the client can swap within the same category.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "Yeah, pick the default and be able to do the drop-downs. That's going to be important." (GEN-04)
- **Where it lives:** `generator_spec_v1.json` → `template_refs.exercise_catalog.slot_rule`
- **Changed later:**
  - **REFINED by [R3-SES-02](sessions-and-order.md#r3-ses-02) (round 3).** Before: Swap inside the same category. Now: People can also add or remove exercises or whole blocks, and switch off a day's athletic or core block.
  - **REFINED by [CX-04](#cx-04) (2026-10-10).** Before: Swap, add or remove. Now: "It should be all editable as they need to": the sets of any day or week too.
  - **REFINED by [R4-LIB-04](library-details.md#r4-lib-04) (round 4).** Before: A dropdown of swaps. Now: A swap also says in one short line what it keeps and what it loses.
  - **REFINED by [R4-LIB-01](library-details.md#r4-lib-01) (round 4).** Before: Swaps come from his library. Now: The exercises the team proposed can also be chosen and added as optional add-ons.
- **See also:** [EQ-10](equipment.md#eq-10), [R3-SES-02](sessions-and-order.md#r3-ses-02), [R2-LIB-01](library-details.md#r2-lib-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, pick the default and be able to do the drop-downs. That's going to be important.

</details>

#### GEN-06

**Question (round 1).** Video for every exercise? Where are your videos?

**Final rule.** Superseded. In round 1 he wanted a video for every exercise and said more links were needed. In round 2 he said the videos do not need to be in the tool: people can look them up on YouTube, and his own video library is not built. He also said, in conversation, that the videos linked in his sheets are not his.

- **Status:** SUPERSEDED. A later answer replaced this one (see "Changed later").
- **We assumed (round 1):** Yes. Your YouTube links where they exist (some are in the RESISTANCE PATTERNS tab).
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "yes but we need more links, i dont have them all and thats a lot of work but needs to get done" (GEN-06)
- **Where it lives:** `generator_spec_v1.json` → `output.videos`
- **Changed later:**
  - **REVERSED by [R2-GEN-02](#r2-gen-02) (round 2).** Before (superseded): "yes but we need more links, i dont have them all and thats a lot of work but needs to get done" Now: "They can just look up the videos on their own on YouTube. No need to have the videos on there."
  - **REFINED by [R4-LIB-05](library-details.md#r4-lib-05) (round 4).** Before: People look videos up themselves. Now: The third-party links from his sheets are removed from the public data; each exercise has a YouTube search link and an easy way to copy its name.
- **See also:** [R2-GEN-02](#r2-gen-02)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> yes but we need more links, i dont have them all and thats a lot of work but needs to get done

</details>

#### GEN-07

**Question (round 1).** Coaching cues and notes in your voice (the *, **, *** notes)?

**Final rule.** Each exercise carries a short coaching cue in his voice (the *, **, *** notes of his sheets), and his instruction block sits at the top of the plan.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. A short cue per exercise plus your instruction block at the top.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `output.cues`
- **See also:** [R2-GEN-08](#r2-gen-08)

#### R2-GEN-06

**Question (round 2).** How should the plan tell someone what weight to use?

**Final rule.** The plan tells people what weight to use in reps-in-reserve language ("leave 1-2 reps in the tank"), with a tip for week 1 ("pick a weight you could lift 2-3 more times"). Percentages appear only when the person enters a recent best; the approved proposal named barbell main lifts and Olympic lifts. If they have not tested a lift, they go by RPE or reps in reserve. Olympic lifts are explained simply: they are for power output and "don't necessarily need to go by percentage unless you're a competitive Olympic lifter". Competitive Olympic weightlifting is a different kind of programming.

- **Status:** Stands as answered.
- **We proposed (round 2):** Reps-in-reserve language ('leave 1-2 reps in the tank') with a week-1 tip ('pick a weight you could lift 2-3 more times'). Percentages only for barbell main lifts and Olympic lifts when they enter a recent best.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "these are for power output, and they don't necessarily need to go by percentage unless you're a competitive Olympic lifter" (R2-GEN-06)
- **Not confirmed by him:** Showing no percentage on Olympic lifts by default is the team's reading of his words (INFERRED). Showing one only when a coach switches it on, and a separate program type for competitive Olympic weightlifting, are PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `output.weight_guidance`
- **This answer changed:** [PER-09](progression.md#per-09) (refined), [R2-ATH-05](athletes-and-sports.md#r2-ath-05) (refined)
- **See also:** [VOL-13](volume.md#vol-13), [R2-ATH-05](athletes-and-sports.md#r2-ath-05), [PER-09](progression.md#per-09), [R2-PER-07](testing.md#r2-per-07)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, and if they haven't tested their Olympic lifts, 1-rep maxes, or anything like that, then they should pick an RPE or reps in reserve. Again, Olympic lifts should be explained on there easily: these are for power output, and they don't necessarily need to go by percentage unless you're a competitive Olympic lifter. That becomes a nuance, and now the program needs to change to Olympic weightlifting programming, which is completely different but kind of the same on here (because they're going to do a lot of sets and reps in their sport of lifting weights).

</details>

### Rules and review

#### GEN-08

**Question (round 1).** Hard rules it must never break?

**Final rule.** The hard rules the generator never breaks: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped. He added that coaches must have the option to add their own rules. Since round 3 a person may switch a day's core block off themselves; the generator still always includes it.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped. Add yours.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "and options for a coach to add their own rules if they want" (GEN-08)
- **Not confirmed by him:** How coaches add rules (a rule-pack file applied before the plan is built) is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.ordering.hard.GEN-08`, `coach_rule_hooks`
- **Changed later:**
  - **REFINED by [R3-SES-02](sessions-and-order.md#r3-ses-02) (round 3).** Before: Core is never skipped. Now: The generator always writes the core block, but the person can turn off that day's core training.
- **See also:** [ORD-01](sessions-and-order.md#ord-01), [ORD-02](sessions-and-order.md#ord-02), [ORD-03](sessions-and-order.md#ord-03), [ATH-11](sessions-and-order.md#ath-11), [VOL-13](volume.md#vol-13)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> and options for a coach to add their own rules if they want

</details>

#### R2-GEN-07

**Question (round 2).** Before launch, will you grade 5 sample plans and check our exercise tags?

**Final rule.** Before launch he will go over sample plans. His list has seven: swimming, football, soccer, CrossFit-style boot camp, boot camp, full-body aesthetics, and push / pull / legs. His grades become automatic tests, and he reviews the exercise tags in one sheet, most-used exercises first.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: beginner fat loss, intermediate aesthetics, off-season basketball, boxer, and a home dumbbell client (about 5 hours). Your grades become automatic tests. Tags reviewed in one sheet, most-used exercises first.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "Yes, I will go ahead and go over five different sample plans:" (R2-GEN-07)
- **Note:** The question asked for five plans; his list names seven. The model plans for seven (INFERRED).
- **Where it lives:** `generator_spec_v1.json` → `output.sample_plans_for_grading`
- **Changed later:**
  - **REFINED by [R4-REL-02](#r4-rel-02) (round 4).** Before: He grades sample plans before launch. Now: Unchanged. The engine was rebuilt as version 0.5 and its 8 sample plans wait for his grades.
- **See also:** [R3-ATH-01](athletes-and-sports.md#r3-ath-01), [PRG-03](sessions-and-order.md#prg-03)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yes, I will go ahead and go over five different sample plans:
>
> 1. Swimming
> 2. Football
> 3. Soccer
> 4. CrossFit-style boot camp
> 5. Boot camp
> 6. Full-body aesthetics
> 7. Push, pull, legs

</details>

### The editable template and the release (2026-10-10 and round 4)

These three entries are the newest on this page.

#### CX-04

**Question (conversation, 2026-10-10).** Not a question. This is the explanation he gave with his three progression answers ([CX-01](progression.md#cx-01), [CX-02](progression.md#cx-02), [CX-03](progression.md#cx-03)).

**Final rule.** The output is an editable template. A coach or a person receives a complete, usable starting plan and can adjust all of it as they need. Editing is not limited to swaps or switching blocks: the sets of any day or week can be changed too. The aim is a tool so intuitive and well built that most people will not need to edit.

- **Status:** Stands as answered.
- **Authority:** A dated clarification (`COACH-CX CX-04`). It indexes his explanation; it is not a fourth questionnaire answer.
- **In his words:** "This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to." / "it will be editable, but they might not need to most of the time" (CX-04)
- **Not confirmed by him:** PROPOSED: what the tool does after an edit. Today the plan data supports four edits (change sets for a day or week, remove an exercise, add an exercise, switch a block on or off). After an edit the weekly totals are recounted and the plan is marked as edited. The checks that judged the generated layout no longer vouch for an edited plan. Nothing is stored, and nothing adapts. An editable template is not a promise that every edit still follows his rules. "For any type of sport, the general population, or an older generation" states the goal; it is not a claim that every profile is validated ([R4-SCP-03](athletes-and-sports.md#r4-scp-03)).
- **Where it lives:** `engine/edit.mjs` → `applyPlanEdits`; plan field `edited`. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md). Decision records: [ADR-005](../04-decisions/adr-005-editable-plan-switches-and-supersets.md), [ADR-049](../04-decisions/adr-049-endpoint-priority-and-editable-progression.md).
- **This answer changed:** [GEN-04](#gen-04) (refined), [R3-VOL-04](progression.md#r3-vol-04) (refined), [R3-SES-02](sessions-and-order.md#r3-ses-02) (refined)
- **See also:** [CX-02](progression.md#cx-02), [R4-SES-04](sessions-and-order.md#r4-ses-04), [R3-VOL-02](progression.md#r3-vol-02)

<details>
<summary>His full explanation, 2026-10-10 (from <code>coach_answers_codex_2026-10-10.md</code>)</summary>

> This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to. Ideally, the tool is just so great and smart that edits are probably not going to be needed if it's that intuitive and it's built that well for any type of sport, the general population, or an older generation. Young people like it. It should be so intuitive and so good with everything that we've been putting into it that it will be editable, but they might not need to most of the time.

</details>

#### R4-REL-01

**Question (round 4).** Release the model now as the finished product, and label the plan-writing engine 'experimental'?

**Final rule.** Yes. Model v1.3 is the library, the categories, the rules, the sports, his answers and the docs, merged into one clean main branch. He added: finish it all, then consolidate everything.

- **Status:** Stands. The engine part moved on with [R4-REL-02](#r4-rel-02) (see "Changed later").
- **We proposed (round 4):** Yes. Model v1.3 = library + categories + rules + sports + your answers + docs, all merged into one clean main branch. The engine stays in the repo marked experimental until it's rebuilt (simpler now that time-fitting is gone).
- **His verdict (round 4):** RIGHT, with words
- **In his words:** "Yes, go ahead and finish it all, and then after you're done, consolidate everything." (R4-REL-01)
- **Not confirmed by him:** "Finished" describes the model documents and data. It is not a claim that every number is his: profiles and parameters keep their PROPOSED and INFERRED labels. Before the public release is called final the team still owes an attorney's review of the disclaimers, his review of the Spanish, and his grades on the sample plans.
- **Changed later:**
  - **REFINED by [R4-REL-02](#r4-rel-02) (round 4).** Before: The engine stays "experimental until it's rebuilt" later. Now: "I think you can try to build it now." The engine was rebuilt as version 0.5 in the same release.
- **Where it lives:** the repo itself; version numbers in `model/MODEL_VERSION` and `engine/version.mjs`. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md).
- **This answer changed:** [R2-GEN-02](#r2-gen-02) (refined)
- **See also:** [R4-REL-03](legal-and-open-source.md#r4-rel-03), [R2-GEN-07](#r2-gen-07)

#### R4-REL-02

**Question (round 4).** Who rebuilds the engine after the release?

**Final rule.** Build it now. The team had proposed to rebuild the engine later, from the planner design already in the repo. He said to try now.

- **Status:** Stands as answered.
- **We proposed (round 4):** Claude builds it when your weekly usage resets, using the planner design already in the repo (minus all the time-fitting), and your Codex reviews it.
- **His verdict (round 4):** PARTLY
- **In his words:** "I think you can try to build it now." (R4-REL-02)
- **Not confirmed by him:** How it was built is a team decision: engine 0.5 is template-first, and the large two-stage planner in `design/PLANNER_SPEC.md` was not built ([ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md)). He graded the engine's 8 sample plans in round 5: A for three, B+ for five (R5-GRD-01 ... 08).
- **Where it lives:** `design/ENGINE_V05_PLAN.md`, `engine/`, `samples/STATUS_v0.5.md`. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md).
- **This answer changed:** [R2-GEN-07](#r2-gen-07) (refined), [R4-REL-01](#r4-rel-01) (refined)
- **See also:** [CT-01](sessions-and-order.md#ct-01), [R2-GEN-07](#r2-gen-07)

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [GEN-05](progression.md#gen-05) | [progression](progression.md) | Adjusting from logs: approved in round 1, removed in round 3. |
| [R2-GEN-01](progression.md#r2-gen-01) | [progression](progression.md) | The optional check-in: approved in round 2, removed in round 3. |
| [R3-VOL-02](progression.md#r3-vol-02) | [progression](progression.md) | No check-ins. |
| [R3-VOL-04](progression.md#r3-vol-04) | [progression](progression.md) | The plan is kicked out whole; few inputs. |
| [R2-GEN-03](legal-and-open-source.md#r2-gen-03) | [legal-and-open-source](legal-and-open-source.md) | Health check and release of liability. |
| [R3-GEN-01](legal-and-open-source.md#r3-gen-01) | [legal-and-open-source](legal-and-open-source.md) | Own-risk box, no data kept, MIT licence. |
| [R3-SES-01](sessions-and-order.md#r3-ses-01) | [sessions-and-order](sessions-and-order.md) | Focus muscle 1 and 2. |
| [R3-SES-02](sessions-and-order.md#r3-ses-02) | [sessions-and-order](sessions-and-order.md) | Switching blocks off; adding and removing exercises. |
| [PER-07](testing.md#per-07) | [testing](testing.md) | Choosing tests on the form. |
| [EQ-01](equipment.md#eq-01) | [equipment](equipment.md) | Equipment options on the form. |
| [FIX-03](library-details.md#fix-03) | [library-details](library-details.md) | Names must be general and understandable. |
| [PER-01](plans-and-calendar.md#per-01) | [plans-and-calendar](plans-and-calendar.md) | Plan types. |
