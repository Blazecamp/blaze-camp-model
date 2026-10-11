# FAQ: 30 questions a coach or developer would ask

This page answers the questions people ask most about the Blaze Camp model: what the tool does, how it counts and grows volume, how a session is built, how it treats athletes and older people, and how to use the data in your own work. Every answer is taken from the model and from coach Lalo Vera's own answers. Each one leads with the short answer, then gives his reason with the answer id, then says where the rule lives in the data. Anything he has not confirmed is marked PROPOSED.

**How to read the ids.** `VOL-09` is a round-1 answer ([coach_answers_full.md](../../coach_answers_full.md)). `R2-…` is round 2 ([coach_answers_round2.md](../../coach_answers_round2.md)). `R3-…` is round 3 ([coach_answers_round3.md](../../coach_answers_round3.md)). `R4-…` is round 4 ([coach_answers_round4.md](../../coach_answers_round4.md)). `CT-01` and `CX-01..04` are two clarifications he gave on 2026-10-10 ([session time](../../coach_answers_time_2026-10-10.md), [progression and editing](../../coach_answers_codex_2026-10-10.md)). The newest answer wins: round 4 and CT-01 first. "Conversation" means [coach_chat_statements.md](../../coach_chat_statements.md). Terms are defined in the [glossary](glossary.md). Numbers and their data keys are in [parameters.md](parameters.md).

## Contents

**The product**
1. [What does the tool do?](#1-what-does-the-tool-do)
2. [Why are there no check-ins and no tracking?](#2-why-are-there-no-check-ins-and-no-tracking)
3. [Why doesn't it ask about sleep, stress, my job or my sex?](#3-why-doesnt-it-ask-about-sleep-stress-my-job-or-my-sex)
4. [Does it keep my data? What are the health check and the release?](#4-does-it-keep-my-data-what-are-the-health-check-and-the-release)
5. [Can I change the plan after it is built?](#5-can-i-change-the-plan-after-it-is-built)

**Volume and progression**
6. [How many sets per muscle per week?](#6-how-many-sets-per-muscle-per-week)
7. [How are sets counted?](#7-how-are-sets-counted)
8. [Why don't jumps, Olympic lifts or kettlebell swings count as muscle sets?](#8-why-dont-jumps-olympic-lifts-or-kettlebell-swings-count-as-muscle-sets)
9. [What is the stairway?](#9-what-is-the-stairway)
10. [Why is there no deload week in the middle of a plan?](#10-why-is-there-no-deload-week-in-the-middle-of-a-plan)
11. [What is a Focus muscle?](#11-what-is-a-focus-muscle)
12. [Why are rear delts not their own muscle?](#12-why-are-rear-delts-not-their-own-muscle)
13. [How hard should each set be?](#13-how-hard-should-each-set-be)

**Sessions and exercises**
14. [In what order does a session run?](#14-in-what-order-does-a-session-run)
15. [Why hip with push, knee with pull, and only one heavy squat day?](#15-why-hip-with-push-knee-with-pull-and-only-one-heavy-squat-day)
16. [My sessions are short, or I only have 2 days. What gives?](#16-my-sessions-are-short-or-i-only-have-2-days-what-gives)
17. [Why no bands? Which machine is best?](#17-why-no-bands-which-machine-is-best)
18. [How are exercises picked? Can the tool invent new ones?](#18-how-are-exercises-picked-can-the-tool-invent-new-ones)
19. [What plan lengths are there?](#19-what-plan-lengths-are-there)

**Athletes and special groups**
20. [How does the model treat different sports?](#20-how-does-the-model-treat-different-sports)
21. [I don't compete. Is there a plan for pickleball, HYROX or running?](#21-i-dont-compete-is-there-a-plan-for-pickleball-hyrox-or-running)
22. [What changes for people over 60, and for young athletes?](#22-what-changes-for-people-over-60-and-for-young-athletes)
23. [What happens when something hurts?](#23-what-happens-when-something-hurts)
24. [When and how do I test?](#24-when-and-how-do-i-test)

**Developers and AI agents**
25. [Where do I start, and which source wins when two disagree?](#25-where-do-i-start-and-which-source-wins-when-two-disagree)
26. [What do Confirmed, PROPOSED, INFERRED and OBSERVED mean?](#26-what-do-confirmed-proposed-inferred-and-observed-mean)
27. [Where is the data, and which files may I edit?](#27-where-is-the-data-and-which-files-may-i-edit)
28. [Can I generate a plan today? How good is the engine?](#28-can-i-generate-a-plan-today-how-good-is-the-engine)
29. [How do I add an exercise or change a number?](#29-how-do-i-add-an-exercise-or-change-a-number)
30. [Can I use this in my own app? What about Spanish?](#30-can-i-use-this-in-my-own-app-what-about-spanish)

---

## The product

### 1. What does the tool do?

**Short answer.** You give a few answers (goal, sport or activity, experience, days, equipment, pain) and accept the terms and the release. It gives you the whole plan at once: 12 weeks, 8 weeks, a maintenance phase, a season or a year. You see every week ahead of time. Each day is built on one of his own templates and sized by its number of exercises. It does not ask how long you want to train: each day shows an average time as information only.

**Why.** "I want them to be able to kick out a program, and that's it. That's the program ... It's already a template, and you need to adjust it as you need to" (R3-VOL-04). On time: "You need to stop trying to be responsible for the people's time" (CT-01).

**Where it lives.** The inputs: `generator_spec_v1.json > inputs_schema`. The steps from inputs to plan: `generator_spec_v1.json > pipeline`. Session size: `model/rules.json > session > size`. Decision records: [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md), [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md), [ADR-051](../04-decisions/adr-051-coach-templates-are-the-skeleton.md).

### 2. Why are there no check-ins and no tracking?

**Short answer.** He removed them. The plan climbs by its own built-in stairway. People and coaches adjust it themselves. If you want to log your training, use your own notebook or the columns of the downloaded sheet. The tool never reads them.

**Why.** "We're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly" (R3-VOL-02). "I don't want people to be checking back on their phone in their program" (R3-VOL-04).

**Where it lives.** `generator_spec_v1.json > rule_tables > rate_engine > no_feedback`. The old check-in tables are marked RETIRED in `generator_spec_v1.json > adaptation`. More: [what he rejected](../01-philosophy/what-he-rejected.md).

### 3. Why doesn't it ask about sleep, stress, my job or my sex?

**Short answer.** He said no to lifestyle questions, and he does not program by sex. The intake has neither. The engine rejects an intake that carries such a field.

**Why.** On lifestyle: "No, I don't want anything to do with anything else other than just workouts. I just need the workouts here. There's no need to talk about sleep or stress or anything else" (R2-GEN-04). On sex: "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries" (ATH-09). His example of a woman choosing glutes as a Focus muscle is an example of a choice. It is not a default (R3-SES-01).

**Where it lives.** `generator_spec_v1.json > inputs_schema > removed_fields`. Decision records: [ADR-003](../04-decisions/adr-003-no-lifestyle-inputs.md), [ADR-004](../04-decisions/adr-004-no-sex-field.md).

### 4. Does it keep my data? What are the health check and the release?

**Short answer.** It keeps nothing. Everyone may use the plans on their own. Before a plan is built there are two steps, and the release comes first.

| Step | What it is | Source |
|---|---|---|
| Release (the liability gate) | You accept the terms and the release of liability every time a plan is built or rebuilt. It is required: without it no plan is generated. The plan then prints a short line, top and bottom, in English and Spanish, saying liability was released. | R3-GEN-01, R4-SCP-01, R4-SCP-02 |
| Health check | A short set of questions. Five answers stop the automatic plan today and send you to a professional: chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said no. A coach may skip it for a client, with a legal warning. Open for the coach: whether these should still stop a plan, now that he said everyone should be able to use it (R4-SCP-01). | R2-GEN-03, R3-GEN-01 |

**Why.** "I don't want any data kept" (R3-GEN-01). In round 3 he also said "It doesn't matter if they click it; it comes out." Round 4 settled it the other way: "they need to click it before the plan shows, as part of when they put in their data, so that they understand the terms and conditions" (R4-SCP-02). And: "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out" (R4-SCP-01).

**Where it lives.** `generator_spec_v1.json > legal_and_privacy`; `model/rules.json > legal > gate` and `> legal > release_line`. Decision record: [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md). The full texts are [DISCLAIMER.md](../../DISCLAIMER.md) and [DISCLAIMER.es.md](../../DISCLAIMER.es.md). Both are drafts until a Florida attorney reviews them. The final health-check wording will be written by a lawyer, with a link to the official PAR-Q+.

### 5. Can I change the plan after it is built?

**Short answer.** Yes, all of it. The plan is a template. You or your coach can change the sets of any exercise on any day or week, switch off a day's athletic block or core block, remove or add exercises or whole blocks, add an optional add-on, swap an exercise for another in the same category, and use the suggested supersets. If a day is too long, you pick what to take away; the plan lists what is easiest to remove and removes nothing by itself. After an edit the weekly totals are recounted and the plan is marked as edited.

**Why.** "They should be able to turn off that day's athletic training or that day's core training and just focus on resistance. Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves ... because an athlete or a coach should be able to modify accordingly" (R3-SES-02). "It should be all editable as they need to" (CX-04). On what to remove: "That's something for the athlete to adjust" (R4-SES-04).

**Where it lives.** `generator_spec_v1.json > plan_editing`; `engine/edit.mjs > applyPlanEdits`. The options are his. The mechanics (block ids, what the tool shows after an edit, the Reset button) are PROPOSED. Decision record: [ADR-005](../04-decisions/adr-005-editable-plan-switches-and-supersets.md).

---

## Volume and progression

### 6. How many sets per muscle per week?

**Short answer.** It depends on your level. In a training block with 3 or more training days, no group that is trained directly starts below 10. With 2 training days, every big muscle is still trained, at about 6 to 8 weekly sets, and the plan suggests a third day (R4-SES-03). Each group climbs to its top number and reaches it in the last week.

| | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Start, big muscles | 10 | 15 | 20 |
| Start, shoulders, biceps, triceps | 10 | 12 | 15 |
| Top number (ceiling), reached in the last week | 14 | 22 | 25 |

Calves get one exercise × 3 sets on every leg day. Core gets 2 exercises × 2 sets at the start of every session.

**Why.** "I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation" (UNI-01). "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). He also said: "this is all customizable".

**Where it lives.** `generator_spec_v1.json > rule_tables > weekly_sets`; the 2-day rule in `model/rules.json > volume > two_day`. The Level 3 start of 20 is PROPOSED: the range he approved says "20+", and the model uses its low end. Read more: [volume](../02-model/volume.md).

### 7. How are sets counted?

**Short answer.** The main mover of a lift gets 1 set. Each helper muscle gets a quarter of a set. A bench press set is 1 chest set, 0.25 triceps and 0.25 front delts. A one-side set written 10/10 is one set, not two. Three exceptions: dips are half triceps and half chest; a thruster is 1 quads + 0.5 shoulders + 0.25 glutes; hip thrusts and bridges give glutes a full set.

**Why.** The team first proposed half a set for helpers. "I would suggest a 0.25 to the helpers, not a 0.5" (VOL-09).

**Where it lives.** `generator_spec_v1.json > rule_tables > counting > credit_map`; compiled into `model/rules.json > credit > classes`. Decision record: [ADR-019](../04-decisions/adr-019-helper-credit-0-25.md).

### 8. Why don't jumps, Olympic lifts or kettlebell swings count as muscle sets?

**Short answer.** They train a quality (speed, power, reactivity), not a muscle. They have their own units: contacts, throws, reps, cuts, metres. Kettlebell swings are in the same group, and so are HYROX station circuits. Carries and sled work are counted by distance or time (2 to 4 trips of 20 to 40 metres, or 20 to 40 seconds) and give no muscle sets either (R4-LIB-02).

**Why.** "I don't believe that Olympic lifts, sprints, throws, and plyos are going to count towards specific muscles because there are so many things happening at so many different levels" (VOL-10). "Kettlebell swings are not glutes. They are hip-dominant, but at the speed they are swinging like that, it doesn't really become a resistance movement-building muscle work" (R2-VOL-05).

**Where it lives.** `generator_spec_v1.json > rule_tables > athletic > never_counts_to_muscles`; credit class `ATHLETIC` in the catalog. Decision record: [ADR-020](../04-decisions/adr-020-athletic-work-never-counts-as-muscle-sets.md).

### 9. What is the stairway?

**Short answer.** It is how every plan grows. Weekly sets usually rise by about 3 % a week until the halfway week and about 5 % after it. The hardest weeks come last. The tool works in whole sets. Each trained muscle group reaches its planned final sets in the last week (one week early is fine). When small steps cannot get there, the steps are bigger: there is no hard limit, and a week that adds more than about 15 % carries a note so you can lower it. A week may keep the same sets while your reps or load go up. Reps and load are written as a rule you apply: "When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8."

**Why.** "It should be like steps up a stairway. In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... and that goes for every plan" (R2-PER-03). He approved the numbers in R3-VOL-04. On reaching the final sets: "go ahead and increase faster if thats the need, they could edit accordingly" (CX-01). Round 4 approved the arrival week, the note and the written rule (R4-PRG-01, R4-PRG-02, R4-PRG-03).

**Where it lives.** `generator_spec_v1.json > rule_tables > rate_engine`; `synthesis/12_volume_algorithm_v1.json > stairway`. Also `model/rules.json > stairway > progression` and `> render > progression`. Read more: [stairway](../02-model/stairway.md). Decision record: [ADR-053](../04-decisions/adr-053-progression-written-as-a-rule.md).

**No longer open.** With steps of 3 % and 5 %, a group that starts far below its top number would not reach it in 12 weeks. That used to be an open point. He settled it: the final sets win, and the steps get bigger (CX-01). The earlier limits (no more than 7 % for a muscle, under 10 % in total) are retired.

### 10. Why is there no deload week in the middle of a plan?

**Short answer.** A block is completed, and then it ends. Nothing easy is inserted in the middle. After a block, one easy week at about half the sets is recommended. It is not required. Then you build your next plan.

**Why.** "It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it. If they can't complete it, they should cancel the block and start a maintenance phase" (R2-VOL-07). "Maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01).

**Where it lives.** `generator_spec_v1.json > plan_types > deload`. Decision record: [ADR-043](../04-decisions/adr-043-no-deload-inside-a-block.md).

### 11. What is a Focus muscle?

**Short answer.** A muscle you want more of. You may pick one or two. Each gets 1 to 3 extra sets a week on top of a balanced plan. The model keeps the extra sets for the whole plan and does not slow the other muscles down. Those two points are the team's reading of his words (INFERRED).

**Why.** "They should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one ... There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing" (R3-SES-01).

**Where it lives.** `generator_spec_v1.json > rule_tables > priority > v1_2_focus_muscles`; intake field F09. The default of +2 sets is PROPOSED. Decision record: [ADR-024](../04-decisions/adr-024-focus-muscle-1-and-2.md).

### 12. Why are rear delts not their own muscle?

**Short answer.** He counts shoulders as one group: front, side and rear delts together. The floor of 10 sets is counted on the group. Rows also work the rear delts. You can always add more rear-delt work. The model also keeps one rear-delt exercise in every week (PROPOSED).

**Why.** "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable. People and coaches should always be able to add more rear delts" (R3-VOL-01).

**Where it lives.** `generator_spec_v1.json > rule_tables > weekly_sets > muscles > shoulders`. The earlier 4 / 6 / 8 sets for rear delts alone are RETIRED. Decision record: [ADR-018](../04-decisions/adr-018-rear-delts-part-of-shoulders.md).

### 13. How hard should each set be?

**Short answer.** Leave 1 to 3 reps in reserve (RIR) on every working set. The plan starts at 3 in reserve, moves to 2, then 1-2, and ends at 1 with a few extra-hard sets in the last week. Never go to failure on heavy compound lifts (GEN-08). Only small-muscle or bodyweight work may go to MAX (VOL-13). The model keeps that to the last set (INFERRED).

**Why.** "There's RIR, there are percentages, and there's RPE ... I like RIR in my model, so that's what I'm going to be using" (VOL-13). The drift from 3 down to 1 was approved in R3-VOL-04. On how a plan should feel: "you start feeling like a 2 ... The last week might feel like an 11, like you're doing more than what you usually do" (R2-PER-05).

**Where it lives.** `generator_spec_v1.json > rule_tables > effort` and `> rate_engine > start_at_2_end_at_11`. Decision record: [ADR-026](../04-decisions/adr-026-effort-in-reps-in-reserve.md).

---

## Sessions and exercises

### 14. In what order does a session run?

**Short answer.**

| Order | Block | Rule | Source |
|---|---|---|---|
| 1 | Warm-up | always; never counted | ORD-08 |
| 2 | Core | 2 exercises × 2 sets, light; first by default, movable | ATH-11, R2-SES-03 |
| 3 | Jumps, throws, speed, change of direction | athletes and athletic plans | VOL-08, VOL-17 |
| 4 | Olympic lifts | power before strength | ORD-03 |
| 5 | The lifts of the day's template, in slot order. Day A: row, squat, pulldown, lunge. Day B: press, hinge or hip thrust, vertical or incline press, single-leg hinge. | his template; "the work" first; row before pulldown; horizontal push before vertical push | R4-SES-05, ORD-01, ORD-02, UNI-11 |
| 6 | Isolation | biceps and leg extension on Day A; triceps and leg curl on Day B; then calves or a shoulder exercise | R4-SES-05, VOL-17 |
| 7 | Conditioning | last, except a fighter's opening aerobic block | OBSERVED (his sheets end with the buy-out); ORD-09 for the exception |

**Why.** On core: "we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up" (ATH-11). On order in general, from conversation: power first, then power-strength, then strength, then resistance patterns.

**Where it lives.** `generator_spec_v1.json > rule_tables > ordering`. Read more: [sessions](../02-model/sessions.md).

### 15. Why hip with push, knee with pull, and only one heavy squat day?

**Short answer.** In a session that mixes lower and upper body, a hip-dominant lift is paired with a push and a knee-dominant lift with a pull. That keeps the working muscles far apart. And the spine gets one heavy squat day and one heavy deadlift day a week, on different days. The other leg days use lifts that do not load the spine: leg press, belt squat, hip thrust, back extension.

**Why.** "If I'm doing the back of my lower body, then the opposite would be the front of my upper body. That'll allow me to keep as far away as I can from bleeding over problems when I'm working out" (UNI-11). "I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly" (PER-04).

**Where it lives.** `generator_spec_v1.json > rule_tables > pairing` and `> axial_loading`. Decision records: [ADR-029](../04-decisions/adr-029-pairing-hip-push-knee-pull.md), [ADR-030](../04-decisions/adr-030-axial-loading-once-per-pattern.md).

### 16. My sessions are short, or I only have 2 days. What gives?

**Short answer.** Nothing is cut for time. The tool does not ask how long you want to train, and it never fits a plan to minutes.

- **Session length.** The plan comes out complete, sized by its number of exercises (5 to 7 for general fitness, 6 to 8 for aesthetics, and so on). Each day shows an average time as information. If a day is too long for you, use the recommended supersets or remove something. Each day lists what is easiest to remove. You pick.
- **Only 2 days a week.** Every big muscle is still trained, with about 6 to 8 weekly sets instead of 10. The plan says so and suggests a third day. It does not drop whole muscles and does not pile on more exercises.

The round-3 order for short time (tell you, offer more time, train fewer groups directly, superset, keep climbing) is retired.

**Why.** "You need to stop trying to be responsible for the people's time ... We can give an average recommendation of what it should take, but we will never know what it's going to take" (CT-01). "Drop it. We don't need it" (R4-SES-01). On 2 days: "People can add or remove or adjust accordingly" (R4-SES-03). Supersets are still his recommendation: "Recommend doing supersets so that it's a faster workout" (R3-SES-02).

**Where it lives.** `model/rules.json > session > size`, `> volume > two_day`, `> session > easy_to_remove`, `> time_model` (`use: estimate_only`). The minutes behind the estimate are PROPOSED. Decision records: [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md), [ADR-052](../04-decisions/adr-052-two-day-rule.md); the retired one is [ADR-032](../04-decisions/adr-032-time-vs-minimums-order.md).

### 17. Why no bands? Which machine is best?

**Short answer.** No band, chain or weight-releaser exercise can reach a plan, as an exercise, a swap or a piece of equipment. The band and chain items in his sheets are kept on file as out-of-scope records and are never used. Machines are not ranked. Use the one in your gym that feels right. What matters is how much the machine supports you (its constraint), and older, injured and high-volume clients get more of that support.

**Why.** "I don't do bands. I don't program anything with bands" (EQ-01). "We don't want any variable resistance right now" (EQ-12). On machines: "I don't want to rank them because they have different brands, angles, and things like that ... I want them to feel the right muscles. I want them to get the right stimulus" (EQ-11).

**Where it lives.** `generator_spec_v1.json > rule_tables > equipment`. Decision records: [ADR-034](../04-decisions/adr-034-no-bands-no-variable-resistance.md), [ADR-035](../04-decisions/adr-035-machines-not-ranked.md).

### 18. How are exercises picked? Can the tool invent new ones?

**Short answer.** Every slot of his day template gets a default exercise from his library, and you can swap it for another from the same category. A swap says in one line what it keeps and what it loses. Exercises stay the same for an exercise block of 4 to 6 weeks. At the next block the tool may change one small detail (which hand holds the weight, grip, stance, implement, range). It never invents an exercise. Exercises the team proposed (carries, sled work, wall balls and others) are optional add-ons: you can add them, but a template never picks them, except wall balls and sled pushes in HYROX (R4-LIB-01). For muscle and general-fitness plans the "vertical push or incline" slot leads with an incline press (R4-LIB-03). Each exercise has a YouTube search link and its name to copy; there are no third-party video links (R4-LIB-05).

**Why.** "Yeah, pick the default and be able to do the drop-downs. That's going to be important" (GEN-04). From conversation: "Don't try to 'confuse' the muscle." The one-detail rule was approved in R2-LIB-01. His library is "the single source of truth as far as I was able to take it so far" (CAT-07).

**Where it lives.** `synthesis/02_exercise_catalog.json` (`generator.default_candidate`, `generator.pools`, `variation_v1_1.axes`). Decision records: [ADR-015](../04-decisions/adr-015-library-source-of-truth-one-detail-variations.md), [ADR-045](../04-decisions/adr-045-same-exercises-within-a-block.md).

### 19. What plan lengths are there?

**Short answer.**

| Plan | For | Source |
|---|---|---|
| 12 weeks | his preferred plan; the last 4 weeks are the hardest | PER-01, R2-PER-04 |
| 8 weeks | a shorter block, same stairway | PER-01, R2-PER-03 |
| Maintenance | vacation, travel, a season change, after a block; you pick the weeks; about 50-70 % of the volume | PER-01, R2-PER-06 |
| Year | the general population that wants to stay in shape; four themes by season; tunable | R2-PER-01, R2-PER-02 |
| Season | competitive athletes: off-season blocks, pre-season, in-season | PER-08, R2-PER-06 |
| Event date | stay-active people getting ready for a race or tournament | R3-ATH-05 |

"Week by week" is RETIRED as a plan type. It needed check-ins.

**Why.** "Usually, I like, personally, on my model, the 12-week programs" (PER-01).

**Where it lives.** `generator_spec_v1.json > plan_types`. Read more: [plans and calendar](../02-model/plans-and-calendar.md).

---

## Athletes and special groups

### 20. How does the model treat different sports?

**Short answer.** Each sport has a profile. The main dial is ground-contact time: the less time on the ground the sport demands, the more plyometric work; the more time on the ground, the more ballistic work. The plyometric share at the end of a block runs from 75 % (sprinters, runners) down to 25 % (boxing, golf, swimming). Other dials are the bilateral to unilateral share, aerobic sessions, medball throws and season rules. There are 52 sports, with positions where they matter.

**Why.** "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics" (ATH-01).

**Where it lives.** `synthesis/04_profiles.json > profiles[]` and `> sports > list`. The plyometric shares are confirmed (R2-ATH-01, R3-ATH-04). Most of the weekly amounts in the profiles are INFERRED or PROPOSED. Read more: [athletes](../02-model/athletes.md), [sports](../02-model/sports.md).

### 21. I don't compete. Is there a plan for pickleball, HYROX or running?

**Short answer.** Yes. Choose "Stay athletic and active" and pick your activity from 26 choices. You get a non-competitive athletic plan. You can enter the days you play: the hardest gym day then stays at least 48 hours before your biggest play day. A play session of 45 to 60 minutes or more counts as one of your 3 cardio sessions, up to 2. You can also give an event date.

**Why.** From conversation: "They want to stay athletic and active, so we need to understand that that's an option for them." He approved the play-day and event rules in R3-ATH-05 and the HYROX plan in R3-ATH-03.

**Where it lives.** `synthesis/04_profiles.json > activities > list`; `generator_spec_v1.json > rule_tables > athletic > stay_active_play`. Read more: [stay athletic and active](../02-model/stay-athletic-and-active.md).

### 22. What changes for people over 60, and for young athletes?

**Short answer.**

| Group | Default | Source |
|---|---|---|
| From 60: session size | 5 to 6 exercises, not counting the warm-up and the 2 core exercises | R4-SES-02 |
| From 60: on | landing drills, balance, quick stepping without a hop, light medball throws, fast machine work; more machines | R3-ATH-02, EQ-03 |
| From 60: off, can be switched on with a warning | ankle hops, other jumps, Olympic lifts, depth jumps | R2-ATH-08, R3-ATH-02 |
| From 60: stay out | overhead squats, low-bar squats | EQ-03, R3-ATH-02 |
| Pickleball, padel and tennis players from 50 | knee-friendly strength; calf and Achilles work every leg day; rotator-cuff work; only low-impact jumps unless switched on | R3-ATH-02 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work | R2-ATH-08 |

**Why.** "Older adults: we're not going to need them to be doing any Olympic lifting, plyos, depth jumps, or anything like that, but it should be an additional option if they want to do it according to the coach. They should probably have a warning saying, 'Make sure that you have a fitness professional to help you understand what this means'" (R2-ATH-08).

**Where it lives.** `generator_spec_v1.json > rule_tables > athletic > older` and `> racket_50plus`. Read more: [special populations](../02-model/special-populations.md).

### 23. What happens when something hurts?

**Short answer.** If you report pain in the intake, the plan cuts that muscle or pattern by 30 to 50 %, moves it to machines or split grips, and leaves out painful positions. Severe pain stops the automatic plan (PROPOSED: the team's extension of the health-check rule). If something starts to hurt during the plan, the printed guide says: use a listed swap, then cut that exercise's sets, then drop it. And see a professional.

**Why.** He approved the cut and added: "maybe even drop the exercise altogether if it's too much" (VOL-03). His own instruction block says that with joint pain it usually helps to go unilateral or to move from fixed grips to split grips (OBSERVED).

**Where it lives.** `generator_spec_v1.json > rule_tables > pain`. The actions in the printed guide are his (VOL-03, UNI-08). Their order and wording are PROPOSED. This is general fitness information, not medical advice: see [DISCLAIMER.md](../../DISCLAIMER.md).

### 24. When and how do I test?

**Short answer.** Before the block starts (or in week 1) and in the last week. Never in the middle. If you have not finished a block of training, you do not test a 1-rep max or an all-out mile. You test a 5-rep or 3-rep max, and run or sprint at 80 to 90 %. Testing is optional: "No need for testing" is a valid choice.

**Why.** "They should not test during the weeks, during the block ... you should not go from not training to a one-rep max test ... They should try to test at 80%, 90%, but not at 100%" (R2-PER-07).

**Where it lives.** `generator_spec_v1.json > tests`. Read more: [testing](../02-model/testing.md). Decision record: [ADR-044](../04-decisions/adr-044-tests-at-start-and-end.md).

---

## Developers and AI agents

### 25. Where do I start, and which source wins when two disagree?

**Short answer.** Start with [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) (the master document) and [AGENTS.md](../../AGENTS.md). When two sources disagree, the higher one in this list wins.

| Rank | Source |
|---|---|
| 1 | `coach_answers_round4.md` and `coach_answers_time_2026-10-10.md` (CT-01) |
| 2 | `coach_answers_codex_2026-10-10.md` (CX-01..04), on the subjects it answers |
| 3 | `coach_answers_round3.md` |
| 4 | `coach_answers_round2.md` |
| 5 | `coach_answers_full.md` |
| 6 | `coach_chat_statements.md`, `coach_answers.md` (things he said in conversation) |
| 7 | OBSERVED facts from his sheets (`raw/`, `dumps/`) |
| 8 | The team's work: INFERRED, SCIENCE, PROPOSED |

**Why.** The model exists to capture how he programs. Text that contradicts one of his answers is a bug. An answer you think is scientifically weak is not a bug: write it up "for discussion" and leave the rule alone.

**Where it lives.** `generator_spec_v1.json > _meta > authority_order`. Decision record: [ADR-047](../04-decisions/adr-047-authority-order-and-evidence-labels.md).

### 26. What do Confirmed, PROPOSED, INFERRED and OBSERVED mean?

**Short answer.**

| Label | Meaning | May I build on it? |
|---|---|---|
| Confirmed (a coach answer id) | he said it, or approved it | yes |
| OBSERVED | read from his sheets | yes, as evidence of how he has written programs |
| SCIENCE | from published research | as a gap-filler; it never overrules him |
| INFERRED | the team's reasoning | as a default; say so |
| PROPOSED | the team's design, waiting for his yes | as a default; say so, and expect it to change |
| RETIRED | removed by one of his answers | no |

Many numbers are PROPOSED. Examples: Level 3's definition, the +2 default for a Focus muscle, most goal factors, the minutes behind the time estimate, most per-sport weekly amounts. Each sport profile also carries a label: `confirmed_by_coach`, `similar_sport` or `proposed` (R4-SCP-03). [parameters.md](parameters.md) gives the status of every number.

**Why.** He asked for research and proposals where he had no number: "You should probably go and find some charts out there that can show those averages and also match them with what my experience is" (VOL-01).

**Where it lives.** `generator_spec_v1.json > _meta > status_values`; the tag on every rule in the spec. The master list of PROPOSED items is in `BLAZE_CAMP_BRAIN.md` §16.3.

### 27. Where is the data, and which files may I edit?

**Short answer.**

| Folder or file | What it is | Edit? |
|---|---|---|
| `generator_spec_v1.json`, `synthesis/` | The model as data and as documents | yes, with an evidence label on every change |
| `BLAZE_CAMP_BRAIN.md` | The master document | yes, with labels |
| `docs/` | These guides | yes |
| `coach_answers*.md`, `coach_chat_statements.md`, `answers_raw*/` | His words | never |
| `raw/`, `dumps/` | His two workbooks and their text exports | never |
| `model/` | The compiled copy the engine reads | never by hand; it is generated |
| `engine/`, `tools/`, `tests/` | The plan engine (version 0.5) and its tools | yes, with tests |
| `LICENSE`, `DISCLAIMER*.md` | Legal files | only through the owner |

**Where it lives.** [AGENTS.md](../../AGENTS.md) §5 (repository map) and §13 (what not to change). Field by field: [data-dictionary.md](data-dictionary.md).

### 28. Can I generate a plan today? How good is the engine?

**Short answer.** You can generate a plan. The engine is plain JavaScript with no dependencies. It gives the same plan for the same answers and it explains each decision with a `why`. Version 0.5 builds plans from the coach's own day templates, with no time-fitting. Its tests pass, and a sweep of 1,578 generated plans has no failing error check. Treat its output as a draft all the same. Team reviewers (not the coach) read the eight sample plans the way a coach would and graded them between B- and B+; the first engine had scored D to B-. The part still weakest is the athletic layer: jumps, throws, sprints and Olympic sets are often under a sport's weekly target. The coach has not graded the sample plans yet. He said he will (R2-GEN-07).

**Why this matters.** To learn his rules, read the model documents, not the engine code.

**Where it lives.** How to run it: `engine/README.md` §1, [for developers](../00-overview/for-developers.md) and [AGENTS.md](../../AGENTS.md). Status, numbers and known gaps: `samples/STATUS_v0.5.md`. Why it is built this way: [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md). The large optimizer of [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) was not built.

### 29. How do I add an exercise or change a number?

**Short answer.**

- **An exercise.** Add a record to `synthesis/02_exercise_catalog.json`, tagged on every lens, with its Spanish name. A new exercise starts as PROPOSED: it is never the default pick until he approves it. Never add a band exercise. Leave `video_urls` empty: the tool builds a YouTube search link from the name (R4-LIB-05). Follow [adding-exercises.md](../adding-exercises.md).
- **A number.** Find it in [parameters.md](parameters.md). Change it in `generator_spec_v1.json` (and in `synthesis/12_volume_algorithm_v1.json` when it is a volume number), keep its evidence tag, and recompile. Never edit `model/` by hand.
- **A rule he decided.** Do not change it. Write up your case "for discussion with the coach".

**Why.** He wants people to be able to add and create exercises, with the repo explaining how (conversation). The model lets coaches tune numbers ("this is all customizable", R2-VOL-06) and add their own rules (GEN-08), but his locked rules do not bend.

**Where it lives.** [CONTRIBUTING.md](../../CONTRIBUTING.md); [AGENTS.md](../../AGENTS.md) §11.

### 30. Can I use this in my own app? What about Spanish?

**Short answer.** Yes. The repository is under the MIT license, so you may use, change and ship it, as long as you keep the copyright and license notice. Three things to know:

- **You carry your own risk and your own duties.** If you build programs for other people, you need your own health screening, liability release and insurance. If your app stores personal data, the privacy duties are yours.
- **The name and the videos are not part of it.** The exercise videos linked in his sheets are not his (conversation), and they were removed from the model data: the compiled model and the exercise library (R4-LIB-05). The exports of his original sheets in `raw/`, `dumps/` and `analysis/` still show them. The MIT license gives no trademark right to the Blaze Camp name. That second point is the team's reading (INFERRED), and a lawyer will confirm it. In his words: "The Blaze Camp name is the culture" (conversation).
- **Spanish.** Everything a person reads exists in English and Spanish. The Spanish is neutral Latin American Spanish with the English gym word in brackets, for example "Empuje de cadera (Hip Thrust)". Lines he has not approved yet are listed in `model/i18n/es_review.json`.
- **Credit.** The model is the coaching experience and intellectual property of Coach Lalo (Gerardo Vera), Master NASM coach (R4-REL-03). Do not describe it as "the world's best" or as injury prevention.

**Why.** "There should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation) ... if you are going to use this for other clients, for other people, you should have your own liability release" (R3-GEN-01). On language: "It should start in English and toggle to Spanish if needed, the whole thing" (GEN-01).

**Where it lives.** [LICENSE](../../LICENSE), [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) (drafts until a Florida attorney reviews them). Decision records: [ADR-009](../04-decisions/adr-009-mit-license-and-disclaimers.md), [ADR-007](../04-decisions/adr-007-bilingual-english-first-full-spanish.md).

---

## Related pages

- [glossary.md](glossary.md) · [glossary.es.md](glossary.es.md)
- [parameters.md](parameters.md)
- [data-dictionary.md](data-dictionary.md)
- [what this is](../00-overview/what-this-is.md) · [how a plan is made](../00-overview/how-a-plan-is-made.md) · [for coaches](../00-overview/for-coaches.md) · [for developers](../00-overview/for-developers.md) · [safety and liability](../00-overview/safety-and-liability.md)
- [principles](../01-philosophy/principles.md) · [what he rejected](../01-philosophy/what-he-rejected.md)
- [his answers by topic](../03-coach-answers/index.md)
- [decision records](../04-decisions/index.md)
- [roadmap](../06-history/roadmap.md)
