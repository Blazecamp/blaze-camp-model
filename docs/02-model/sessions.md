# Sessions: order, pairing, his templates and session size

This page explains how one training session and one training week are put together in the Blaze Camp model. Every session starts with a warm-up and a light core block. Fast, powerful work comes before heavy strength work. Horizontal pushing and pulling come before vertical. A hip-dominant lift is paired with a push, and a knee-dominant lift with a pull. The spine is loaded heavily once a week per pattern: one heavy squat day and one heavy deadlift day. Every day is built on one of the coach's own templates, and a session is sized by its number of exercises. **Session length is not asked and limits nothing**: each day prints an average time as information. The plan recommends supersets, and people can switch off blocks, add and remove exercises and change sets. Nothing is dropped automatically.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`ORD-01`) are round 1, `R2-` is round 2, `R3-` is round 3, `R4-` is round 4. `CT-01` and `CX-01..04` are two clarifications he gave on 2026-10-10. The newest answer wins: round 4 and CT-01 first. **PROPOSED** means the team designed it and he has not confirmed it. **OBSERVED** means it was read from his sheets. His full answers by topic: [../03-coach-answers/sessions-and-order.md](../03-coach-answers/sessions-and-order.md).

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | **Warm-up always.** It never counts as volume. | ORD-08 |
| 2 | **Core first**, as a light opener: 2 exercises × 2 sets, short of failure. The person may move it or switch it off. | ATH-11, R2-SES-03, R3-SES-02 |
| 3 | **Power before strength.** Jumps, throws and Olympic lifts come before heavy lifting. | ORD-03 |
| 4 | **Horizontal before vertical.** Row before pulldown. Horizontal push before vertical push. | ORD-01, chat statement |
| 5 | **'The work' comes first** among the strength lifts, whatever its direction. | ORD-02 |
| 6 | **Hip dominant + push. Knee dominant + pull.** In every session that mixes lower and upper body. | UNI-11, ORD-06 |
| 7 | **Heavy squat and heavy deadlift on two different days.** The other lower-body days use lifts that do not load the spine. | PER-04, R2-SES-01, R2-SES-02 |
| 8 | **His templates are the skeleton.** A full-body day is his A day (pull + knee dominant) or B day (push + hip dominant), about 6 exercises, up to 8. Push / pull / legs is his other main layout. On split days a group gets 2 to 4 exercises. | R4-SES-05, R2-SES-05, R3-SES-01 |
| 9 | **Calves: one exercise × 3 sets on every leg day.** | VOL-17, R3-SES-01 |
| 10 | **Session size by exercise count**, not counting the warm-up or the 2 core exercises: general fitness and fat loss 5-7; aesthetics 6-8; strength 5-6; bootcamp 5-7 stations; field athletes off-season up to 12; older adults 60+ 5-6. Recommendations: people add or remove. | R4-SES-02, VOL-08, R2-SES-04 |
| 11 | **Supersets are recommended** to save time. The person decides. | R3-SES-02, ORD-05 |
| 12 | **People can edit the plan:** switch off a day's athletic block or core block, add or remove exercises or blocks, change the sets of any day or week. | R3-SES-02, CX-02, CX-04 |
| 13 | **No time-fitting.** Session length is not an input and not a limit. Each day prints an average time as information only. | CT-01, R4-SES-01 |
| 13b | **Nothing is dropped automatically.** The template comes out complete. The person picks what to take away; the plan names what is easiest to remove. | R4-SES-04 |
| 13c | **2 training days a week:** every big muscle is still trained, at about 6 to 8 weekly sets instead of 10. The plan says so and suggests a third day. | R4-SES-03 |
| 14 | **Hard rules:** never to failure on heavy compounds; no V-squat; no bands. Coaches may add their own rules. | GEN-08, EQ-01 |

## Why

**Core first.** The team had read his baseball sheet as core work placed after the power block. He corrected that:

> "No, we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff." (ATH-11)

**Hip with push, knee with pull.** He pairs the back of the lower body with the front of the upper body, so tired muscles do not sit next to each other:

> "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." (UNI-11)

> "That'll allow me to keep as far away as I can from bleeding over problems when I'm working out." (UNI-11)

**The spine.**

> "I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well." (PER-04)

**His templates.** Two of his rules did not fit together on a full-body day: about 5 to 7 exercises a session, and 2 to 4 exercises for every muscle. In round 4 the team offered two ways out. He rejected both and described his own template:

> "The template is usually 6 exercises for the full-body days because we do that A-day/B-day of upper/lower" (R4-SES-05)

> "We don't design full bodies only with push, pull, and legs. This is the model that I believe is the greatest one." (R4-SES-05)

**No time-fitting.** The team had been fitting every plan into the minutes a person picked. He stopped that:

> "You need to stop trying to be responsible for the people's time. We just need to be able to give them that responsibility and not worry about how long the session is going to be." (CT-01)

> "We can give an average recommendation of what it should take, but we will never know what it's going to take." (CT-01)

**Supersets and editing.**

> "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (R3-SES-02)

> "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance." (R3-SES-02)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). The session templates are in [`synthesis/05_templates.json`](../../synthesis/05_templates.json), explained in [`synthesis/05_session_architecture.md`](../../synthesis/05_session_architecture.md). `model/rules.json`, `model/templates.json` and `model/catalog.json` are the compiled copies the engine reads. The round-4 and CT-01 rules are cited from `model/rules.json`; the matching spec keys are in [`coverage_matrix_round4.md`](../../coverage_matrix_round4.md).

| What | File | JSON key |
|---|---|---|
| Session order, hard and default ordering rules | `generator_spec_v1.json` | `rule_tables.ordering` (`tiers`, `hard`, `defaults`, `allowed_overrides`) |
| Warm-up | `generator_spec_v1.json` | `rule_tables.warmup` |
| Core block (position, dose, switch) | `generator_spec_v1.json` | `rule_tables.core_block`; preference `inputs_schema.fields.F44.fields.core_position` |
| Hip + push / knee + pull; same or cross pattern | `generator_spec_v1.json` | `rule_tables.pairing` |
| The two spine days and the counted lifts | `generator_spec_v1.json` | `rule_tables.axial_loading` (`budget_per_week`, `classes`) |
| Which exercises load the spine | `synthesis/02_exercise_catalog.json`; `model/catalog.json` | `axial_spinal_load.spine_day_v1_1` on the lower-body and Olympic lift records that carry it; `exercises[].spine_class` |
| Exercises per group, default sets, rest | `generator_spec_v1.json` | `rule_tables.session_limits` |
| Session size by client type (R4-SES-02) | `model/rules.json` | `session.size.by_type` |
| Full-body days and exercises per group (R4-SES-05) | `model/rules.json` | `session.full_body_days`, `session.exercises_per_group` (`full_body_day: [1, 4]`, `split_day: [2, 4]`) |
| The A / B / C, athletic and push / pull / legs day types | `model/templates.json` | `families.<family>.days.<n>.day_types.<day>.skeleton`, `.stations[].rank` |
| Each slot keeps its kind (two-leg, single-leg, two-arm row) | `model/rules.json` | `selection.skeleton_laterality` |
| The 2-day rule (R4-SES-03) | `model/rules.json` | `volume.two_day`, `volume.floor.applies_from_days` |
| Easiest to remove; nothing automatic (R4-SES-04) | `model/rules.json` | `session.easy_to_remove`, `render.easy_to_remove` |
| The time estimate, information only (CT-01, R4-SES-01; numbers PROPOSED) | `model/rules.json` | `time_model` (`use: estimate_only`), `render.estimate` |
| Supersets | `generator_spec_v1.json` | `rule_tables.supersets_contrast_circuits`, `plan_editing.superset_recommendations` |
| Block switches, add and remove, set edits | `generator_spec_v1.json`; `engine/edit.mjs` | `plan_editing` (`block_ids`, `block_kinds`, `edits`); `applyPlanEdits` |
| Days per week | `generator_spec_v1.json` | `inputs_schema.fields.F22` (session length, `F24`, is retired: R4-SES-01) |
| Week shape and optional days | `generator_spec_v1.json` | `template_refs.week_shape_4_6_days`, `template_refs.optional_block` |
| Checks every plan must pass | `model/rules.json`; `engine/validate.mjs` | `validation.checks`: V3 (no time fitting in the plan), V10 (spine), V11 (pairing), V12 (order), V13 (session size), V22 (floor, and the 2-day rule), V23 (exercises per group), V30 (the template's skeleton, nothing dropped), V36 (the easy-to-remove list) |
| The 30 split templates (2 to 6 days × 6 families) | `synthesis/05_templates.json` | `generator_split_templates[family][days]` |
| Session rules with the sheet evidence | `synthesis/05_templates.json` | `rules.ordering`, `rules.pairing`, `rules.axial_loading`, `rules.core_placement`, `rules.plan_editing_R3SES02` |
| Compiled copies | `model/rules.json` | `ordering`, `core_block`, `warmup`, `pairing`, `axial`, `session`, `time_model`, `supersets`, `placement` |

---

## In detail

### 1. The order of a session

**Rule.** A session runs from fast and light to slow and heavy, then to small and local, then to conditioning. In his words (chat statement): power first, then power-strength, then strength, then resistance patterns.

Each row below is a *block*: a group of exercises with one purpose. Blocks matter later, because people can switch some of them off (section 9).

| Order | Block | What is in it | Decided by |
|---|---|---|---|
| 0 | Warm-up | 5 minutes of any cardio, then A-drills (A march, A skip, A run) or mobility. The model uses A-drills on lower-body and athletic days and mobility on pressing days (that split is **PROPOSED**). | ORD-08 |
| 1 | **Core opener** | 2 exercises × 2 sets, short of failure | ATH-11, R2-SES-03 |
| 2 | Jumps and sprints | plyometric and ballistic work. Field athletes: 2 jump or throw stations on the default cross-pattern day, 3 to 4 jump stations on the same-pattern athletic template (section 7). | R3-SES-01. Round 1 said 2 to 4 (VOL-08, VOL-17). |
| 3 | Throws | medball throws. None for aesthetics clients, except in the warm-up. | ATH-05 |
| 4 | Change of direction | for every athlete | ATH-06 |
| 5 | Olympic lifts and power | always before strength work | ORD-03 |
| 6 | **'The work'** with its paired upper-body lift | the main lower-body lift plus its partner (hip + push or knee + pull) | ORD-02, UNI-11 |
| 7 | Second pair | a unilateral lower-body lift plus the other upper-body direction | OBSERVED in his program sheets |
| 8 | The rest of the template's slots, then isolation | the remaining lifts of the day's template; arms and shoulders; calves; the week's rear-delt exercise | R4-SES-05, VOL-17 |
| 9 | Conditioning | finisher, circuit or cardio | PRG-11 (circuits are a finisher after lifting), ORD-09 |

Aesthetics and general clients have no blocks 2 to 5 unless they chose an athletic plan. Athletes have all of them. See [athletes.md](athletes.md). CrossFit-style (hybrid) plans add a skill block right after the core opener; that placement is the team's (**PROPOSED**).

How strict each ordering rule is:

| Rule | Strictness | Decided by |
|---|---|---|
| Power before strength | hard | ORD-03, GEN-08 |
| Row before pulldown; horizontal push before vertical push | hard | ORD-01, GEN-08 |
| 'The work' first, even when it is a vertical lift | hard | ORD-02 |
| Jumps, throws, change of direction and sprints before Olympic lifts | hard | OBSERVED in 48 of 51 of his sessions. Making it a hard rule is **PROPOSED**. |
| Bilateral before unilateral for the same body region | hard | OBSERVED in 225 of 231 of his sessions. Making it a hard rule is **PROPOSED**. |
| Core first | default; the person may move it | ATH-11 |
| A small muscle first (calves, side raises) | only when that muscle is a priority or Focus muscle | ORD-04 |
| MYO sets (one long set followed by short mini-sets) only on the last exercise, machine or isolation | hard | VOL-15 |
| Clean-type Olympic lifts on squat days, snatch-type on hinge days | default | A **PROPOSED** reading of R2-ATH-04: "Some days are about cleans, and some days are about snatches", and "I take snatches a little bit more hingy than squatty" |
| Conditioning last | default. Exception: a fighter's opening cardio is a real aerobic block. | ORD-09 |

**'The work'.** In his strength plans every lift has a role (ORD-07, approved):

| Role | Meaning | Effort |
|---|---|---|
| The work | the main lift | 1 rep in reserve |
| The accessory | a supporting lift | 2 reps in reserve |
| The nuance | weak-point, unilateral or variation work | MAX (his label for technical failure; only on small-muscle or bodyweight work, VOL-13) |
| The survival | isolation or joint-health work, done no matter what | |

On weeks where the overhead press is the main lift, it goes before the incline bench. The main lift wins over "horizontal before vertical" (ORD-02).

### 2. The warm-up and the core opener

**Rule.** The generator always writes a warm-up and always writes a core opener right after it.

| Parameter | Value | Status |
|---|---|---|
| Warm-up | 5 minutes of any cardio + A-drills or mobility | Coach: ORD-08 |
| Does the warm-up count as volume? | no | Coach: ORD-08 |
| Core opener size | 2 exercises × 2 sets | Coach: R2-SES-03 |
| Core opener effort | short of failure; it is a warm-up | Coach: R2-SES-03 |
| What the two exercises are | one where the trunk moves, one where the pelvis moves; the planes change through the week | **PROPOSED** (his core categories: CAT-08) |
| Position | first. The person can move it: after the jumps, after strength, or at the end. | Coach: ATH-11 |
| Extra core work | coaches and users may add a core superset or a "monster set" (his words) anywhere | Coach: R2-SES-03 |
| Switching it off | the person may switch off a day's core block. The generator never leaves it out by itself. | Coach: R3-SES-02, GEN-08 |

**Why it can move.** "Some athletes like to do it at the end, so that's why I want them to be able to move it around if they need to." (ATH-11)

**Why extra core is allowed anywhere.** Some coaches like to superset core with other exercises: "It should be optional to be thrown anywhere" (R2-SES-03).

### 3. Horizontal before vertical

**Rule.** On a day with both, the row comes before the pulldown, and the horizontal push (bench press, push-up) comes before the vertical push (overhead press).

**Why.** He gave this as an ordering rule in conversation and confirmed it when the team found three of his older sheets that put the pulldown first (ORD-01). He did not spell out the reason in his answers. Our reading, not his words: in his model the overhead position is the harder one. He described overhead or vertical work as "more advanced, with the positioning, the amount of stability that you need, and the skill that you need to do things right" (CAT-04), so the easier direction goes first.

More on positions and zones: [levels-and-zones.md](levels-and-zones.md).

### 4. Pairing: hip + push, knee + pull

**Rule.** In any session that trains both lower and upper body:

- a *hip-dominant* lift (deadlift, RDL or Romanian deadlift, hip thrust: the back of the lower body) goes with a **push** (the front of the upper body);
- a *knee-dominant* lift (squat, lunge, leg press: the front of the lower body) goes with a **pull** (the back of the upper body).

This holds for full-body days and bootcamps too: "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06). One bootcamp tab in his sheet had it the other way round. He said that was a mistake (ORD-06).

It does not apply to upper/lower or push/pull/legs splits, where a day has only one body half or one direction.

**Same pattern or cross pattern.** A second choice sits on top of the pairing: is the day's second lower-body lift the same pattern as the first, or the opposite one?

| | Same pattern | Cross pattern |
|---|---|---|
| Example | squat + lunge on one day | squat + single-leg RDL on one day |
| Effect | drives one muscle harder | less soreness; every pattern trained every day |
| Who | aesthetics and bodybuilding, strength, size-focused and high-level athletes | bootcamp, fat loss, general fitness, most athletes, in-season plans, 2-3 day plans |
| Decided by | UNI-06, R3-SES-01 | UNI-06, R3-SES-01 |

"This is a rule by goal." (UNI-06)

What he named: same pattern for aesthetics and for high-level and size-focused athletes; cross pattern for bootcamp and for most athletes (UNI-06, R3-SES-01). Placing strength plans with the same pattern, and fat loss, general fitness, in-season plans and 2-3 day plans with the cross pattern, is **PROPOSED**.

A typical 4-day week for a physique client. The day layout is his (R4-SES-05, section 6). Which day holds the heavy squat and the heavy deadlift follows R2-SES-01.

| Day | Lower body | Upper body |
|---|---|---|
| A1 (Monday) | heavy squat + a lunge + leg extension | pulls: row, then pulldown; biceps |
| B1 (Tuesday) | hip thrust or back extension + a single-leg hip-dominant lift + leg curl | pushes: horizontal, then vertical or incline; triceps |
| A2 (Thursday) | leg press or belt squat + a different lunge + leg extension | pulls, different exercises; biceps |
| B2 (Friday) | heavy deadlift + a different single-leg hip-dominant lift + leg curl | pushes, different exercises; triceps |

Wednesday and the weekend are rest days. They can hold cardio, accessories and Focus work (R4-SES-05, ORD-10).

### 5. The spine: once a week per pattern

**Rule.** A week holds at most one heavy squat day and one heavy deadlift day, and they are never the same day. *Axial* loading means load that presses down through the spine. He put it as "a lot of loading, also axial, meaning on your spine" (PER-04).

| Class | Lifts | Decided by |
|---|---|---|
| **Counts** as heavy spine loading | barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings | R2-SES-02 |
| **Fine on the second day if not sore** | goblet squat, hack squat, pendulum squat | R2-SES-02 |
| **Does not count** | leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg dumbbell work, Olympic lifts, loaded jumps | R2-SES-02 |

| Parameter | Value | Decided by |
|---|---|---|
| Heavy squat days a week | 1 | R2-SES-01 |
| Heavy deadlift days a week | 1, on a different day | R2-SES-01 |
| Default spacing | heavy squat Monday, heavy deadlift Friday | R2-SES-01 |
| Tuesday | a hinge that does not load the spine (hip thrust, back extension, reverse hyper) | R2-SES-01 |
| Thursday | leg press or belt squat | R2-SES-01 |
| Powerlifters | may add a light technique squat or deadlift | R2-SES-02 |
| Already loaded or sore | switch to the belt squat | EQ-11 |
| Second squat day at home, with no machines | a single-leg squat, or a goblet squat if not sore | **PROPOSED** |

**Why the belt squat.** "Belt squats are for people that you don't need to load them axially, so it won't be a load on their back." (EQ-11)

**The second time a slot comes up.** When the same slot comes twice in a week, the second time uses a different exercise from the same category (PER-04). For squats and hinges, that second exercise is the one that does not load the spine.

### 6. His templates: the skeleton of every day

**Rule.** The tool does not invent day layouts. Every training day is built on one of his own templates, slot for slot (R4-SES-05). The template comes out complete, and the person edits it.

**The A / B days.** He calls them "full body" or "upper/lower" days: each day has upper-body and lower-body work.

| Slot | Day A: pull + knee dominant | Day B: push + hip dominant |
|---|---|---|
| 1 | Horizontal pull, two arms (a row) | Horizontal push (bench press, machine chest press) |
| 2 | Two-leg knee-dominant lift (a squat) | Two-leg hip-dominant lift (deadlift, hip extension or hip thrust) |
| 3 | Vertical pull (a lat pulldown) | Vertical push (shoulder press), or an incline press |
| 4 | Single-leg knee-dominant lift (a lunge) | Single-leg hip-dominant lift (stagger-stance deadlift, single-leg hip extension, glute bridge) |
| 5 | Biceps | Triceps |
| 6 | Leg extension | Leg curl |

> "Day A: back, quads, and biceps. It's going to be more pull- and knee-dominant movements." (R4-SES-05)

> "Day B: push with hip-dominant movements. Let's say, for example, chest, shoulders, and tricep with hamstrings and glutes." (R4-SES-05)

| Detail | Rule | Decided by |
|---|---|---|
| Size of an A or B day | about 6 exercises; "anywhere from 6 exercises to 8 exercises" | R4-SES-05 |
| Exercises 7 and 8 | "an extra small muscle exercise at the end, or a core". His sheet adds calves to A and a side raise to B (OBSERVED). Slot 8 is rear delts on A and calves on B (**PROPOSED**). | R4-SES-05 |
| Default week for 4 days | A, B, rest, A, B, rest, rest | R4-SES-05 |
| Rest days | can hold cardio, accessories, "bonuses" and Focus work | R4-SES-05, ORD-10 |
| Push / pull / legs | his other main layout, 3 or 6 days | R4-SES-05; OBSERVED in his 'PUSHPULLLEGS - 3 or 6 DAYS A WK' tab |
| A true all-in-one full-body day (push, pull and legs together) | only "when you only have, let's say, 3 days a week of training or 2 days a week" | R4-SES-05 |
| 3 days | his 3-day builder: an A day, a B day and a C day (row, squat, press, hinge, lunge, then small muscles) | OBSERVED in his '3 DAY BUILDER' tab |
| 2 days | two full-body days cover every big group (round 5; was one A day and one B day). Day 1: row, squat, incline or vertical press, single-leg hinge, biceps. Day 2: press, hinge, vertical pull, lunge, triceps | R4-SES-03; R5-GEN-01 |
| Athletic days | the athletic block first (jumps, throws, change of direction, Olympic lift), then the same A / B lifts without arm isolation | OBSERVED in his 'ATHLETIC - FULL BODY - 4 DAYS A' tab |
| Other families | bootcamp, the CrossFit-style class, HYROX, and strength days built on the four roles keep their own layouts from his sheets | OBSERVED |
| Each slot keeps its kind | a two-leg slot holds a two-leg lift and a single-leg slot a single-leg lift in every block; slot 1 of the A day is a two-arm row | his words "bilateral, symmetrical" and "unilateral" for each slot (R4-SES-05). The selection weights are **PROPOSED**. |
| Order inside a pair | his round-4 answer lists the upper lift first (row, then squat); his sheet lists the leg lift first. The data follows round 4. | **PROPOSED** |

**How many exercises a group gets on a day.**

| Day type | Exercises per group | Decided by |
|---|---|---|
| A or B (full-body) day | what the template gives: back 2, quads 3 (squat, lunge, leg extension), biceps 1 on Day A; chest and shoulders share 2 presses, hips 3 (hinge, single-leg hinge, leg curl), triceps 1 on Day B. So 1 to 4. | R4-SES-05 |
| Split day (push, pull, legs) | 2 to 4, never 1: "Usually, I have about 3 to 4 exercises per muscle group per day." | VOL-07, R2-SES-05. Keeping it for split days after round 4 is INFERRED. |
| What a "muscle" is here | the FOCUS groups: quads, hips (glutes + hamstrings), chest, back, shoulders (front + side + rear delts), biceps, triceps | R3-SES-01 |
| Calves | one exercise × 3 sets per leg day | R3-SES-01, VOL-17 |
| Core | the 2-exercise opener | R2-SES-03 |
| Rear delts | at least one rear-delt exercise in the week, inside the shoulders group | VOL-17, R3-VOL-01. The weekly rule and its dose are **PROPOSED**. |

Sets on a new exercise: 3 on compounds and 2 on isolation; athletic templates use 2 sets per slot (VOL-16, approved). Calves get 3 (VOL-17). The weekly stairway then adds sets: [stairway.md](stairway.md).

**When the template cannot hold a group's sets.** A day of about 7 exercises has one or two slots for a group such as chest. A high weekly target may not fit. The plan then adds his **bonus exercise** for that group on the optional day (VOL-07, R3-VOL-03). If there is no optional day, the group is capped at what the slots hold, and the plan says so in words: "this template holds X weekly sets, below the planned Y. Add an exercise if you want more." Nothing else is shrunk to make room (R4-SES-04). How many bonus exercises a day can take is **PROPOSED**.

### 7. Session size

**Rule.** A session is sized by its number of exercises. The count leaves out the warm-up and the 2 core exercises. These are recommendations in a template: "They can add 1 if they want to. This is just our recommendation." (R4-SES-02)

| Client type | Exercises per session | Decided by |
|---|---|---|
| General fitness, fat loss | 5 to 7 | R4-SES-02 (he widened the proposed 5 to 6) |
| Aesthetics, bodybuilding | 6 to 8 | R4-SES-02, VOL-16 |
| Strength | 5 to 6 | R4-SES-02 |
| Bootcamp | 5 to 7 stations, 3 to 5 rounds, 30 to 50 seconds each | R4-SES-02, PRG-03 |
| Field athletes, off-season | up to 12 (jumps and throws, Olympic lifts, then lifts) | R4-SES-02, VOL-08, R2-SES-04 |
| Older adults, 60 and over | 5 to 6 | R4-SES-02 |
| CrossFit-style class | 5 to 7; the workout of the day and the skill piece are outside the count | **PROPOSED** |
| Non-competitive "stay athletic" adult | 5 to 10 | **PROPOSED**; read from his 'JUSTICE LEAGUE' tab (OBSERVED) |

The default count inside each range is **PROPOSED**: 7 for general fitness and aesthetics, 6 for strength and older adults, 7 stations for bootcamp, 12 for field athletes.

Counting rules (R2-SES-04, R4-SES-02): warm-up drills never count; the core block sits outside the count; a superset of two small isolation exercises counts as one. Joint care, skill practice, conditioning, cardio, the cool-down and tests are also outside the count (**PROPOSED**).

**What fills the 12 for a field athlete** (R3-SES-01, approved):

| Layout | Resistance exercises | Athletic stations | Who |
|---|---|---|---|
| Cross pattern (default) | 9 of the 12 | 2 jump or throw stations + 1 Olympic lift | most athletes |
| Same-pattern athletic template | fewer | 3 to 4 jump stations (the model also keeps 1 Olympic lift; **PROPOSED**) | size-focused and high-level athletes |

**Time is information.** The form does not ask how long a person wants to train. "Drop it. We don't need it." (R4-SES-01). Each day prints one line, for example "Average time: about 60-75 min (an estimate, for information only)". Nothing is cut, moved, reshaped or flagged because of it.

| Detail | Value | Status |
|---|---|---|
| Is session length asked? | no | Coach: R4-SES-01 |
| Does time limit or change the plan? | never | Coach: CT-01 |
| What is printed | an average time per day, as a range | Coach: CT-01, R4-SES-01 |
| Width of the range | 10 % each way, rounded to 5 minutes | **PROPOSED** |
| His typical lengths | everyday people 45 to 60 minutes; athletes, bodybuilders and powerlifters about 1.5 hours, "a max of 2 hours"; bootcamp 35 to 45 minutes | UNI-09, PRG-03. Background for the estimate. They limit nothing. |

Rest between sets (VOL-14, approved): 1 to 2 minutes for muscle-building work (up to 3), 3 to 6 minutes for strength work, as prescribed for athletic work. A superset rests after the pair.

**The numbers behind the estimate (PROPOSED).** He has not reviewed them. They are used only to print the average time.

| Item | Minutes |
|---|---|
| Warm-up, per session | 8 |
| Core set | 1.5 |
| Bilateral compound set | 2.5 |
| Unilateral compound set | 3.75 |
| Isolation set | 1.75 (unilateral 2.5) |
| Jump or ballistic set | 1.5 |
| Olympic lift set | 3.0 |
| Throw set | 1.25 |
| Changing to the next exercise | 1.0 (0.5 inside a superset) |
| Two exercises done as a superset | 65 % of their normal time |

As a check, his own 60-minute day (7 exercises, 19 sets, OBSERVED) comes out at about 59 minutes.

Other **PROPOSED** limits: at most 4 sets on one exercise for beginners (client level L1) or 5 for intermediate and advanced lifters (L2, L3), and at least 2 sets on any exercise.

### 8. Supersets

**Rule.** A *superset* is two exercises done back to back, with the rest after the pair. The plan marks every pair that can be supersetted as "superset suggested". The person switches each one on or off. No session length switches one on.

**Why.** For him the superset is first a fatigue tool: "The supersetting is more like a fatiguing principle." and "It's a tool to use to fatigue the heart more and compress the time." (ORD-05). In round 3 he made it a standing recommendation: "Recommend doing supersets so that it's a faster workout" (R3-SES-02).

| When to superset | Who | Decided by |
|---|---|---|
| The person wants a faster session | anyone, by their own choice | ORD-05, R3-SES-02 |
| More stimulus is wanted | advanced athletes | ORD-05 |
| Building aerobic capacity in the off-season | athletes | ORD-05 |
| A beginner does not feel tired from straight sets | beginners | ORD-05 |
| Core added to another exercise | any session, coach's or user's choice | R2-SES-03 |

| What may be paired | Status |
|---|---|
| The lower + upper pair: knee lift + pull, hip lift + push | his program sheets alternate lower and upper lifts (OBSERVED; ORD-05) |
| Two small isolation exercises: biceps + rear delts, triceps + side delts, calves + delts | **PROPOSED** list |
| Never two lower-body compound lifts | **PROPOSED** |
| Never a heavy lift with a tiring lift for the same muscle. Contrast training (a heavy lift followed at once by a jump) is the exception. | **PROPOSED** |

Whether suggestions are shown at all is a preference (shown by default). Only neighbours in the session are suggested as a pair, so the order of the day does not change (**PROPOSED**).

### 9. Editing the plan: block switches, add and remove

**Rule.** The plan is a template. The person or the coach can change it without asking the tool.

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

**Why.** His example: a pickleball player with sore calves does not want jumps that day. "Then it could be turned off, or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly." (R3-SES-02). He listed the options himself: "Recommend supersets" and "Adding or removing exercises or blocks within the training session" (R3-SES-02).

| Block kind | Can it be switched off? | Status |
|---|---|---|
| Warm-up | no | **PROPOSED** |
| Core | yes | Coach: R3-SES-02 |
| Athletic (jumps, throws, agility, sprints) | yes | Coach: R3-SES-02 |
| Olympic lifts | yes, alone or with the athletic block | **PROPOSED** |
| Skill (CrossFit-style classes) | yes | **PROPOSED** |
| Strength | not as a switch. It is edited exercise by exercise, or removed as a block. | **PROPOSED** |
| Accessory, calves, Focus slots | yes | **PROPOSED** |
| Finisher (conditioning finishers, HYROX station circuits) and cardio | yes | **PROPOSED** |

| Edit | What happens | Status |
|---|---|---|
| Switch a block off | this day only, or this day in every week of the current exercise block. It stays visible and prints as "(switched off)". | Option: R3-SES-02. Scopes and printing **PROPOSED**. |
| Effect on the numbers | athletic, Olympic, core and conditioning work never count as muscle sets. Switching them off changes no weekly set number. The session just gets shorter. | VOL-10 |
| Remove an exercise | the other exercises keep their planned sets and keep climbing. The removed sets are not moved elsewhere automatically. | Option: R3-SES-02, R4-SES-04. Mechanism **PROPOSED**. |
| Add an exercise | the list offers what the generator could have picked for this person, plus the optional add-ons (carries, sled work and the other exercises he made optional in round 4). Rear-delt work is always offered on upper-body days. | Option: R3-SES-02, R3-VOL-01, R4-LIB-01. Mechanism **PROPOSED**. |
| Add a block | a core superset anywhere, an extra accessory block, a cardio session | R2-SES-03, R2-SES-06 |
| Swap an exercise | the dropdown of the same category. A swap prints one line on what it keeps and what it loses. | GEN-04, R4-LIB-04 |
| Change sets | the sets of any exercise, for one day or for chosen weeks | CX-02, CX-04 |
| What is easiest to remove | each day lists it: conditioning finishers, extra jump or throw stations, small-muscle accessories, bonus exercises. A hint only: "they get to pick what they want to keep or what they want to take away" | R4-SES-04. The list and its order are **PROPOSED**. |
| After an edit | the weekly sets per group are recounted and the plan is marked as edited. The tool notes where the edit leaves the template's rules (a group under its floor, a session above its size range) and never refuses the person's own edit. The checks that judged the generated layout no longer vouch for an edited plan. | CX-04. Mechanism **PROPOSED**. |
| Reset | "Reset to the generated plan" undoes every edit | **PROPOSED** |
| Where edits are kept | inside the plan the person holds. Blaze Camp keeps nothing. | R3-GEN-01 |

The generator still builds every plan by the rules first. Editing is what people do afterwards.

Cardio is adjustable in the same spirit: "You can always say, 'I need more cardio,' and then it just adds it to the program." (R2-SES-06)

### 10. Nothing is cut for time

**Rule.** The plan is never fitted to a session length (CT-01, R4-SES-01). The round-3 order for short time (tell them, offer more time, train fewer muscles directly, superset, keep climbing) is **retired**. Three rules replaced it.

| Situation | What the plan does | Decided by |
|---|---|---|
| Any plan | The template comes out complete. Each day prints an average time, and a list of what is easiest to remove. The person decides. | CT-01, R4-SES-01, R4-SES-04 |
| 2 training days a week | Every big muscle is still trained, at about 6 to 8 weekly sets instead of 10. The plan says so and suggests a third day. No whole muscle is dropped and no extra exercises are piled on. | R4-SES-03 |
| 3 or more training days | Every group trained directly gets at least 10 sets a week. | R2-VOL-06 |
| A template that cannot hold a group's planned sets | A bonus exercise on the optional day. Without an optional day the group is capped at what the slots hold, and the plan says so. | R4-SES-04, VOL-07, R3-VOL-03; the mechanics are **PROPOSED** |

> "That's something for the athlete to adjust. There could be a question of what's more important here, and then they get to pick what they want to keep or what they want to take away." (R4-SES-04)

On 2 days he approved the rule with these words: "People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation." (R4-SES-03)

The line a 2-day plan prints: "With 2 training days a week every big muscle group is trained with about 6-8 weekly sets instead of 10 or more. A third training day would let every group reach 10."

What still stands from R3-SES-02: supersets are recommended (section 8), and people can switch off blocks and add or remove exercises (section 9).

### 11. The week

| Topic | Rule | Decided by |
|---|---|---|
| Shape of a 4 to 6 day week | A, B, rest or optional day, A, B, rest or optional day, off | R4-SES-05; OBSERVED in his program sheets |
| A1 and A2 | the same day type with different exercises | PER-04 |
| Optional days | Calves, Cardio, Core, Focus 1, Focus 2. "Ideally, separate days, so they don't get in the way." They can also be add-ons. | ORD-10 |
| Focus 1 and Focus 2 slots | may both hit the same muscle, 2 to 3 sets each | ORD-11 |
| Going from 4 to 5 or 6 days | add optional days, not more heavy sessions | **PROPOSED** |
| Push / pull / legs | the weekdays are flexible | PRG-02 |
| A/B weeks (the lead lift changes each week) | for people who want variety | PER-03 |
| Olympic lifts | up to 4 days a week ("it could be done four times a week"). Cleans on squat days and snatches on hinge days is a **PROPOSED** reading. | R2-ATH-04 |
| In season | 2 days a week; the hard day at least 48 hours before a game | PER-08, R2-ATH-07 |
| Stay-active players | the hardest gym day at least 48 hours before the biggest play day | R3-ATH-05 |
| Easy or maintenance weeks | never inside a block | R2-VOL-07 |

Aerobic sessions per week are defaults the user can raise or lower (R2-SES-06):

| Who | Sessions | Decided by |
|---|---|---|
| General and fat-loss clients | 3 | ATH-07 |
| Aesthetics and bodybuilders | 4, plus optional easy walks after workouts | ATH-07, R2-SES-06 |
| Athletes off-season | 2 to 4 by sport | R2-ATH-06, R3-ATH-04 |
| Swimmers, runners, rowers and endurance cyclists | 0 extra in the gym: their practice is the cardio. The user can add one. | R3-ATH-01, R3-ATH-04 |
| HYROX | 4 (Blue, Green, Orange and a second Orange) | R3-ATH-03 |
| Athletes pre-season and in season | 2 | R2-ATH-06, ATH-07 |
| Powerlifters | 2 easy | R2-ATH-06 |

The session types (his Blue, Green and Orange) and each sport's count are on [athletes.md](athletes.md) and [sports.md](sports.md).

### 12. Hard rules the generator never breaks

He approved this list and added one line (GEN-08):

- Never to failure on heavy compound lifts.
- No V-squat.
- Power before strength.
- Horizontal before vertical.
- Core is never skipped by the generator.
- "and options for a coach to add their own rules if they want" (GEN-08)

From other answers:

- No bands and no variable resistance (EQ-01, EQ-12). See [equipment.md](equipment.md).
- Heavy squat and heavy deadlift on different days (R2-SES-01).
- Kettlebell swings sit in the power block, never in a strength slot (R2-VOL-05).

---

## Retired: do not rebuild

| Retired idea | Replaced by | Retired by |
|---|---|---|
| Core after the power block ("Part B") for athletes | core first for everyone, movable | ATH-11 |
| Full-body days built from "2 to 4 exercises for every muscle" (7 to 10 or more exercises) | his A / B template, about 6 exercises, up to 8 | R4-SES-05 |
| Day layouts invented by the engine | his templates, slot for slot | R4-SES-05 |
| "At most 2 exercises per muscle per session" | 2 to 4 on split days; the template on full-body days | VOL-07, R4-SES-05 |
| A second calf exercise on a leg day | one exercise × 3 sets | R3-SES-01 |
| Loading the spine once a week in total | one heavy squat day + one heavy deadlift day | R2-SES-01 |
| Hinge + pull and lunge + push on bootcamp days | hinge + push, knee + pull | ORD-06 |
| Session length as an input; the time check; time offers; the 110 % fit rule; cutting or moving anything for minutes; exercise caps by minutes (5 in 45, 6-7 in 60, 8-9 in 75-90) | sessions sized by exercise count; time printed as an estimate | CT-01, R4-SES-01, R4-SES-02 |
| "Train fewer muscle groups directly" when time is short; lists of groups "not trained directly (time)" | on 2 days every big muscle at about 6 to 8 sets; nothing dropped automatically | R4-SES-03, R4-SES-04 |
| Supersets switched on by the tool because a day did not fit | a recommendation the person takes or leaves | CT-01 |
| Pulldown before the row (three older sheets) | row first | ORD-01 |
| Ranking machines (hack squat "last") | no ranking; use what feels right | EQ-11 |
| Bands, chains, band chops as substitutes | none | EQ-01, EQ-07, EQ-12 |

## Still PROPOSED

Waiting for his yes or no:

- Which blocks can be switched off, beyond the athletic and core blocks he named.
- What happens to the sets of a removed exercise.
- The wording "superset suggested", and the list of allowed pairs.
- Every number behind the time estimate, and the width of the printed range.
- The default count inside each session-size range; the count for the CrossFit-style class and for the non-competitive "stay athletic" adult.
- The order inside an A / B pair (upper lift or leg lift first); slot 8 of the A and B days.
- Whether athletic A / B days keep a two-leg lift in slot 2 on every day, which gives athletes less single-leg work than UNI-02 asks.
- Small muscle groups on 2 training days (he spoke of big muscles).
- The "easiest to remove" list and its order.
- What the tool shows after an edit.
- The optional-day Calves slot when there are fewer than four leg days.
- The lighter second exercise on cross-pattern days (leg extension, leg curl).
- Bootcamp as two circuits of 4-6 stations.
- The content of the core opener (one trunk exercise, one pelvis exercise).
- The per-session and per-exercise set limits.
- Which goals get the same pattern and which the cross pattern, beyond the ones he named.
- Clean-type lifts on squat days and snatch-type lifts on hinge days.
- A-drills on lower-body and athletic days, mobility on pressing days.
- The two ordering rules read from his sheets and made hard (jumps before Olympic lifts, bilateral before unilateral).

## Related pages

- [volume.md](volume.md): weekly sets, the floor of 10, Focus muscles.
- [stairway.md](stairway.md): how sets are added, how reps and load progress, and why there are no check-ins.
- [bilateral-unilateral.md](bilateral-unilateral.md): the two-leg and one-leg share.
- [plans-and-calendar.md](plans-and-calendar.md): blocks, maintenance and the year.
- [athletes.md](athletes.md): the athletic blocks in depth.
- [equipment.md](equipment.md): machines, free weights, no bands.
- [categories.md](categories.md): hip dominant, knee dominant, push, pull and the other categories.
- [../00-overview/how-a-plan-is-made.md](../00-overview/how-a-plan-is-made.md): one worked example from intake to a finished week.
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
- Decision records: [core first](../04-decisions/adr-027-core-first.md), [power first, horizontal before vertical](../04-decisions/adr-028-power-first-horizontal-before-vertical.md), [pairing hip + push, knee + pull](../04-decisions/adr-029-pairing-hip-push-knee-pull.md), [axial loading once per pattern](../04-decisions/adr-030-axial-loading-once-per-pattern.md), [two to four exercises per group](../04-decisions/adr-031-two-to-four-exercises-per-group.md), [no time-fitting, session size](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md), [his templates as the skeleton](../04-decisions/adr-051-coach-templates-are-the-skeleton.md), [the 2-day rule](../04-decisions/adr-052-two-day-rule.md), [time against the minimums (retired)](../04-decisions/adr-032-time-vs-minimums-order.md), [editable plan, switches and supersets](../04-decisions/adr-005-editable-plan-switches-and-supersets.md), [no bands, no variable resistance](../04-decisions/adr-034-no-bands-no-variable-resistance.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
