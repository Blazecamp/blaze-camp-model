# What this is

This repository holds the training model of coach Lalo Vera (Blaze Camp). It describes how he sorts exercises, how many sets he gives each muscle group, how he orders a session and a week, how a plan gets harder week by week, and how all of that changes with the sport, the person's age, the equipment and any pain. The model is written twice: in plain language for coaches, and as data files for developers and AI agents. The goal is a simple tool. A person gives a few answers, gets a whole plan at once, and adjusts it themselves. Everything here is free to use under the MIT license. It is a work in progress. Some parts are still **PROPOSED**, which means the team suggested them and the coach has not approved them yet. The plan engine is being rebuilt, and the coach has not graded the sample plans yet.

> **Not medical advice. Use at your own risk.** If you use this with clients or anyone else, you need your own health screening, liability release and insurance. Read [safety-and-liability.md](safety-and-liability.md) and [DISCLAIMER.md](../../DISCLAIMER.md).

*Español: [what-this-is.es.md](what-this-is.es.md).*

## The rule

**A few answers go in. The whole plan comes out once. People adjust it themselves.**

| | |
|---|---|
| What goes in | Goal, sport or activity, training experience, age, body weight, training days, minutes per session, equipment and pain. Optional: up to two Focus muscles. A **Focus muscle** is a muscle the person wants to work on most. It gets 1 to 3 extra sets a week. |
| What comes out | The whole plan, with every week visible ahead of time: 12 weeks (his preferred length), 8 weeks, a maintenance plan, a full year for the general population, or a season plan for athletes. |
| What happens next | The person or their coach adjusts the plan. Nothing is tracked. Nothing is kept. |

## Why

These are the coach's own words. The code after each quote is the id of the answer it comes from (see [how to read ids](../04-decisions/index.md)).

> "I want this to be very simple. This works. We're not going to need a lot of inputs for this." (R3-VOL-04)

> "I want them to be able to kick out a program, and that's it. That's the program." (R3-VOL-04)

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

> "We're only doing outputs, and people can change accordingly." (R3-VOL-02)

On who it should serve, he said "different gyms, different people, different coaches, and all of our clients", and that it should be free "for anybody to use in their own app and their own training" (conversation).

## What the model is

In his words: "The hardest thing to understand is the categorization of everything" (conversation). So the model starts there, and every other part builds on it.

| Part | What it holds | Read |
|---|---|---|
| Categories | Every exercise is tagged on all of his lenses at once: family (athletic, resistance, core, cardio), movement pattern, one side or two, plane, big or small muscle, equipment and level. In his words, "this is the whole taxonomy of each exercise" (CAT-01). | [categories](../02-model/categories.md) |
| Exercise library | His MASTER EXERCISE LIBRARY with those tags. Each **slot** (a place in a plan) has a first pick and a list of **swaps** (other exercises of the same kind). | [exercise library](../02-model/exercise-library.md) |
| Volume | Weekly **hard sets** per muscle group. A hard set is a working set that ends with 1 to 3 reps left in the tank. Starts and ceilings by level, and a floor of 10. | [volume](../02-model/volume.md) |
| The stairway | His word for how every plan climbs: small steps early, bigger steps after halfway, the hardest weeks last. | [stairway](../02-model/stairway.md) |
| Sessions | Core first, power before strength, horizontal before vertical, hip + push and knee + pull, 2 to 4 exercises per group. | [sessions](../02-model/sessions.md) |
| Bilateral and unilateral | How much work is done on two legs or on one, by type of athlete. | [bilateral and unilateral](../02-model/bilateral-unilateral.md) |
| Equipment | Machines, free weights and what to swap when something is missing. No bands. | [equipment](../02-model/equipment.md) |
| Athletes and active people | Jumps, throws and Olympic lifts by sport. Rules for older adults, youth and pain. | [athletes](../02-model/athletes.md), [sports](../02-model/sports.md), [stay athletic and active](../02-model/stay-athletic-and-active.md) |
| Plans and tests | Plan lengths, the year, seasons, and tests at the start and the end only. | [plans and calendar](../02-model/plans-and-calendar.md), [testing](../02-model/testing.md) |
| The plan engine | Code that turns the rules and a person's answers into a plan. The part that decides the sets is being rebuilt. | [for developers](for-developers.md) |

The model comes from his own sheets and his own answers. Its roots are Dr. Pat Davidson, Dr. Mike Israetel and training science from first principles. He is "building the segmentation and the buckets from the ground up" (conversation). See [lineage](../01-philosophy/lineage.md).

## Who it is for

He named the users himself: "clients", "coaches", "trainers", "strength and conditioning coaches", "anyone" (GEN-01).

| You are | What you get | Start with |
|---|---|---|
| A coach, trainer or gym | His whole system, with the reason for each rule and the numbers you can change. | [for-coaches.md](for-coaches.md) |
| A person who trains | A clear picture of how a plan is built. The website that would build one in a few taps does not exist yet. | [how-a-plan-is-made.md](how-a-plan-is-made.md) |
| A developer | The model as data, free to build on. | [for-developers.md](for-developers.md) |
| An AI agent | One briefing file and a working guide. | [CONTEXT_FOR_AI.md](../CONTEXT_FOR_AI.md), [AGENTS.md](../../AGENTS.md), [llms.txt](../../llms.txt) |
| A reviewer | What to check and how to report it. | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |

## What you can do with it

- **Read how he programs, and why.** Every rule names the answer where he decided it.
- **Use the exercise library** with its tags in your own gym or product.
- **Change the numbers for your own people.** In his words, "this is all customizable" (R2-VOL-06). See [for-coaches.md](for-coaches.md).
- **Build your own app on the data.** He thought about giving the repo away from the start: "open source it to any coach and person that wants to create a training app and just use this model to put it all together" (GEN-03).
- **Add exercises.** See [adding-exercises.md](../adding-exercises.md) (Spanish: [adding-exercises.es.md](../adding-exercises.es.md)).
- **Look at his original sheets**, kept as Excel copies in `raw/` and as text in `dumps/`, "so people can download it and play with it" (conversation).
- **Generate sample plans** with the engine. Treat them as drafts until the rebuild is done.

## What it is not

| It is not | Why | Source |
|---|---|---|
| Medical advice | It is general fitness information. People with a health condition see a professional first. | [DISCLAIMER.md](../../DISCLAIMER.md) |
| A finished website or app | The data and context come first. The website is not built yet. | conversation; GEN-03 |
| A tracker | No check-ins, no logbook that the tool reads, no weekly adjustment by the tool. | R3-VOL-02, R3-VOL-04 |
| A data collector | "I don't want any data kept." | R3-GEN-01 |
| A lifestyle or nutrition plan | "I just need the workouts here." No questions about sleep, stress or work. | R2-GEN-04 |
| A packaged method | He does not build on 5/3/1, the Texas Method or Prilepin's chart. | conversation |
| A replacement for a coach's eye | The plan is a template. A person or a coach still has to fit it to the day. | R3-VOL-04, R3-SES-02 |
| Fully confirmed | Some numbers and mechanics are the team's. They are marked PROPOSED until he approves them. | [decision records](../04-decisions/index.md) |
| Graded by the coach yet | He said he will grade sample plans, and he listed seven. That has not happened yet, and the engine is being rebuilt. | R2-GEN-07; [roadmap](../06-history/roadmap.md) |
| A video library | Videos are optional. The video links in his sheets are not his. | R2-GEN-02; conversation |
| Lawyer-approved | The disclaimer and release are drafts that wait for review by a Florida attorney. | [DISCLAIMER.md](../../DISCLAIMER.md) |

It also leaves some things out on purpose: no sex field, no bands or variable resistance, and no easy week in the middle of a block. See [what he rejected](../01-philosophy/what-he-rejected.md).

## The numbers

| Thing | Count | Where it lives |
|---|---|---|
| Questions put to the coach | 198, in three rounds (140, 45 and 13). All 198 now have his answer. | [coach_answers_full.md](../../coach_answers_full.md), [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md) |
| Records in the exercise catalog | 939. Of these, 732 are active: 633 exercises, 72 cardio items, 14 drills and 13 tests. | `synthesis/02_exercise_catalog.json` |
| Records that can be the first pick in a slot | 368 (329 exercises, 22 cardio items, 13 tests and 4 drills). The other active records can only be swaps. | same file, `generator.default_candidate` |
| Sports in the picker | 52, in 5 groups, with 146 position or event choices | `synthesis/04_profiles.json > sports.list` |
| "Stay athletic and active" activities | 26 (pickleball, HYROX, rec leagues, running and more) | `synthesis/04_profiles.json > activities.list` |
| Profiles | 127. A **profile** is the record that sets the plan's dials for one sport, position or type of person. | `synthesis/04_profiles.json > profiles` |
| Week templates | 30 (6 training families, each for 2 to 6 days a week) | `synthesis/05_templates.json > generator_split_templates` |
| Questions on the intake form | 39 fields. Many are optional or shown only to some people. | `generator_spec_v1.json > inputs_schema.fields` |
| Hard rules that must never break | 22 | [AGENTS.md](../../AGENTS.md) §10 |
| Decision records | 48 | [04-decisions](../04-decisions/index.md) |
| Source workbooks | 2 Google Sheets with 34 tabs | `raw/`, `dumps/` |
| Languages | 2. English first, with a full Spanish switch (GEN-01). | `model/i18n/` |

Notes on the counts:

- Everything he skipped, left blank or did not understand in one round was asked again and answered in a later round (PRG-01, FIX-01, LIB-10, LIB-12, CAT-12, R2-VOL-08).
- The compiled copy that the engine reads (`model/`) holds 731 exercises today. That folder is generated, and its counts can move while the engine is rebuilt.
- Of the 732 active records, 31 are records the team PROPOSED (27 exercises and 4 cardio items). They can only be swaps until he approves them.

## Where it lives in the data

| File | What it is |
|---|---|
| [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | The master document (v1.2). Every rule, with its evidence label. |
| [generator_spec_v1.json](../../generator_spec_v1.json) | The same model as data: `inputs_schema`, `derived_values`, `rule_tables`, `plan_types`, `tests`, `plan_editing`, `legal_and_privacy`, `validation_checks`. |
| `synthesis/` | One detailed document per topic, most with a `.json` twin. |
| `coach_answers*.md`, [coach_chat_statements.md](../../coach_chat_statements.md) | His own words. These are the final authority. The newest round wins. |
| `raw/`, `dumps/` | His two original sheets, as Excel copies and as text. |
| `model/`, `engine/`, `tests/`, `samples/` | The compiled model, the plan engine, its tests and sample plans. All of these are changing. |

## Where to go next

| I want to | Read |
|---|---|
| See one plan built step by step | [how-a-plan-is-made.md](how-a-plan-is-made.md) |
| Use the model in my gym | [for-coaches.md](for-coaches.md) |
| Build on the data | [for-developers.md](for-developers.md) |
| Know the risks and my duties | [safety-and-liability.md](safety-and-liability.md) |
| Understand how he thinks | [principles](../01-philosophy/principles.md), [how he thinks](../01-philosophy/how-he-thinks.md) |
| Read every answer he gave, by topic | [03-coach-answers](../03-coach-answers/index.md) |
| Look up a word | [glossary](../05-reference/glossary.md) |
| See how this was built and what is next | [timeline](../06-history/timeline.md), [roadmap](../06-history/roadmap.md) |
| See the map of all the docs | [docs/README.md](../README.md) |
