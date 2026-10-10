# Sessions: order, pairing, caps and what gives when time is short

This page explains how one training session and one training week are put together in the Blaze Camp model. Every session starts with a warm-up and a light core block. Fast, powerful work comes before heavy strength work. Horizontal pushing and pulling come before vertical. A hip-dominant lift is paired with a push, and a knee-dominant lift with a pull. The spine is loaded heavily once a week per pattern: one heavy squat day and one heavy deadlift day. Every muscle group trained on a day gets 2 to 4 exercises. The plan recommends supersets to save time, and people can switch off blocks or add and remove exercises. When the chosen time cannot hold the minimums, the plan says so first and then follows a fixed order.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`ORD-01`) are round 1, `R2-` is round 2, `R3-` is round 3. The newest round wins. **PROPOSED** means the team designed it and he has not confirmed it. **OBSERVED** means it was read from his sheets. His full answers by topic: [../03-coach-answers/sessions-and-order.md](../03-coach-answers/sessions-and-order.md).

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
| 8 | **2 to 4 exercises for every muscle group trained that day. Never 1.** | R2-SES-05, R3-SES-01 |
| 9 | **Calves: one exercise × 3 sets on every leg day.** | VOL-17, R3-SES-01 |
| 10 | **Caps:** about 5 to 7 exercises in a resistance session. Field athletes off-season: up to 12 exercises plus the 2 core exercises. | VOL-08, VOL-16, R2-SES-04 |
| 11 | **Supersets are recommended** to save time. | R3-SES-02, ORD-05 |
| 12 | **People can edit the plan:** switch off a day's athletic block or core block, add or remove exercises or blocks. | R3-SES-02 |
| 13 | **When time is short:** tell them up front and offer more time → train fewer groups directly → recommend supersets → keep the stairway climbing. | R3-SES-02 |
| 14 | **Hard rules:** never to failure on heavy compounds; no V-squat; no bands. Coaches may add their own rules. | GEN-08, EQ-01 |

## Why

**Core first.** The team had read his baseball sheet as core work placed after the power block. He corrected that:

> "No, we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff." (ATH-11)

**Hip with push, knee with pull.** He pairs the back of the lower body with the front of the upper body, so tired muscles do not sit next to each other:

> "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." (UNI-11)

> "That'll allow me to keep as far away as I can from bleeding over problems when I'm working out." (UNI-11)

**The spine.**

> "I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well." (PER-04)

**Never one exercise.** The team proposed 1 or 2 exercises per muscle on full-body days. He answered:

> "No, full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day." (R2-SES-05)

**Supersets and editing.**

> "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (R3-SES-02)

> "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance." (R3-SES-02)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). The session templates are in [`synthesis/05_templates.json`](../../synthesis/05_templates.json), explained in [`synthesis/05_session_architecture.md`](../../synthesis/05_session_architecture.md). `model/rules.json`, `model/templates.json` and `model/catalog.json` are compiled copies. They are rebuilt by tools, so check the sources first when they differ.

| What | File | JSON key |
|---|---|---|
| Session order, hard and default ordering rules | `generator_spec_v1.json` | `rule_tables.ordering` (`tiers`, `hard`, `defaults`, `allowed_overrides`) |
| Warm-up | `generator_spec_v1.json` | `rule_tables.warmup` |
| Core block (position, dose, switch) | `generator_spec_v1.json` | `rule_tables.core_block`; preference `inputs_schema.fields.F44.fields.core_position` |
| Hip + push / knee + pull; same or cross pattern | `generator_spec_v1.json` | `rule_tables.pairing` |
| The two spine days and the counted lifts | `generator_spec_v1.json` | `rule_tables.axial_loading` (`budget_per_week`, `classes`) |
| Which exercises load the spine | `synthesis/02_exercise_catalog.json`; `model/catalog.json` | `axial_spinal_load.spine_day_v1_1` on the lower-body and Olympic lift records that carry it; `exercises[].spine_class` |
| Exercises per group, caps, default sets, lengths, rest | `generator_spec_v1.json` | `rule_tables.session_limits` |
| Minutes per set (PROPOSED) | `generator_spec_v1.json` | `rule_tables.time_model` |
| Supersets | `generator_spec_v1.json` | `rule_tables.supersets_contrast_circuits`, `plan_editing.superset_recommendations` |
| Block switches, add and remove | `generator_spec_v1.json` | `plan_editing` (`block_ids`, `block_kinds`, `edits`) |
| Time against the minimums | `generator_spec_v1.json` | `derived_values.D15_time_fit`, `rule_tables.session_limits.time_vs_minimums`, `inputs_schema.fields.F24.time_check` |
| Days per week, session length | `generator_spec_v1.json` | `inputs_schema.fields.F22`, `inputs_schema.fields.F24` |
| Week shape and optional days | `generator_spec_v1.json` | `template_refs.week_shape_4_6_days`, `template_refs.optional_block` |
| Checks every plan must pass | `generator_spec_v1.json` | `validation_checks` (`V10_spine`, `V11_pairing`, `V12_order`, `V13_caps`, `V23_exercises_per_group`, `V28_time_fit`, `V30_editable`) |
| The 30 split templates (2 to 6 days × 6 families) | `synthesis/05_templates.json` | `generator_split_templates[family][days]` |
| Session rules with the sheet evidence | `synthesis/05_templates.json` | `rules.ordering`, `rules.pairing`, `rules.axial_loading`, `rules.core_placement`, `rules.exercises_per_muscle_R2SES05`, `rules.time_vs_minimums_check_R3SES02`, `rules.plan_editing_R3SES02` |
| Compiled copies | `model/rules.json` | `ordering`, `core_block`, `warmup`, `pairing`, `axial`, `session`, `time_model`, `supersets` |

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
| 8 | More exercises for each group, then isolation | the 2nd to 4th exercise of each group trained that day; arms and shoulders; calves; the week's rear-delt exercise | R2-SES-05, VOL-17 |
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

A typical 4-day week for a physique client (same pattern). This is a generator template built from his program sheets and R2-SES-01; the exact layout is **PROPOSED**.

| Day | Lower body | Upper body |
|---|---|---|
| A1 (Monday) | heavy squat + a unilateral knee-dominant lift | pulls: row, then pulldown |
| B1 (Tuesday) | hip thrust or back extension + a unilateral hip-dominant lift | pushes: horizontal, then vertical |
| A2 (Thursday) | leg press or belt squat + a different unilateral knee-dominant lift | pulls, different exercises |
| B2 (Friday) | heavy deadlift + a different unilateral hip-dominant lift | pushes, different exercises |

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

### 6. Two to four exercises per group

**Rule.** Every muscle group that is trained on a day gets 2 to 4 exercises that day. Never 1. Split days usually have 3 to 4.

**Why.** It is how he writes programs: "Usually, I have about 3 to 4 exercises per muscle group per day." (VOL-07). On full-body days it still holds: "there's never one exercise, so from 2 all the way to 4" (R2-SES-05).

| Detail | Rule | Decided by |
|---|---|---|
| What a "muscle" is here | the FOCUS groups: quads, hips (glutes + hamstrings), chest, back, shoulders (front + side + rear delts), biceps, triceps | R3-SES-01 |
| Example | RDL + hip thrust + leg curl = 3 hip exercises | R3-SES-01 |
| Calves | the exception: one exercise × 3 sets per leg day | R3-SES-01, VOL-17 |
| Core | the 2-exercise opener | R2-SES-03 |
| Full-body days | keep the same 2 to 4 per group, so they run longer | R2-SES-05. The model's estimate of 7 to 10 resistance exercises is **PROPOSED**. |
| Field athletes | 2 to 4 exercises for each group trained that day, inside 12 + 2 core | R3-SES-01 |
| A group cannot get 2 exercises on a day | train it on fewer days with 2 exercises each | **PROPOSED** |
| Strength days built on the four roles | stay as he wrote them, even where a muscle has one exercise | **PROPOSED** exception |
| Rear delts | at least one rear-delt exercise in the week, inside the shoulders group | His words: rear delts need their own sets (VOL-17) and sit inside shoulders (R3-VOL-01). The weekly rule and its dose are **PROPOSED**. |

Sets on a new exercise: 3 on compounds and 2 on isolation; athletic templates use 2 sets per slot (VOL-16, approved). Calves get 3 (VOL-17). The weekly stairway then adds sets: [stairway.md](stairway.md).

### 7. Caps and session length

**Rule.** A session has a ceiling on exercises and on minutes.

| Session type | Exercises | Length | Decided by |
|---|---|---|---|
| Resistance session, 45 minutes | about 5 | 45 min | VOL-08 |
| Resistance session, 60 minutes | 6 to 7 ("usually 7") | 60 min | VOL-08, VOL-16 |
| Resistance session, 75 to 90 minutes | 8 to 9 | 75-90 min | VOL-08 |
| Full-body day | 7 to 10 resistance exercises + the core opener | "a little longer day" | R2-SES-05; the count is **PROPOSED** |
| Field athlete, off-season | **up to 12 + the 2 core exercises** (14 written) | about 90 min, 120 at most | VOL-08, R2-SES-04, UNI-09 |
| Bodybuilders, powerlifters, professional athletes | by length, as above | about 90 min, 120 at most | UNI-09 |
| Weight loss and everyday people | by length, as above | 45 to 60 min | UNI-09 |
| Bootcamp | 5 to 7 stations, 3 to 5 rounds, 30 to 50 seconds each | 35 to 45 min | PRG-03 |

Counting rules for the field-athlete cap (R2-SES-04, approved): warm-up drills never count; the core block sits outside the 12; a superset of two small isolation exercises counts as one.

**What fills the 12 for a field athlete** (R3-SES-01, approved):

| Layout | Resistance exercises | Athletic stations | Who |
|---|---|---|---|
| Cross pattern (default) | 9 of the 12 | 2 jump or throw stations + 1 Olympic lift | most athletes |
| Same-pattern athletic template | fewer | 3 to 4 jump stations (the model also keeps 1 Olympic lift; **PROPOSED**) | size-focused and high-level athletes |

**Why sessions are not endless.** "a great workout by an athlete that has time should be a max of 2 hours. Usually, about 1.5 hours is a great workout for a lot of the athletes" (UNI-09). Everyday people "can be 45 minutes to 1 hour" (UNI-09).

Rest between sets (VOL-14, approved): 1 to 2 minutes for muscle-building work (up to 3), 3 to 6 minutes for strength work, as prescribed for athletic work. A superset rests after the pair.

**The time model (PROPOSED).** To check whether a day fits, the tool estimates minutes per set, rest included. He has not reviewed these numbers.

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

With these numbers a session holds about 5 exercises and 11 sets in 45 minutes, 7 and 17 in 60, 8 and 23 in 75, and 9-10 and 29 in 90. As a check, his own 60-minute day (7 exercises, 19 sets, OBSERVED) comes out at about 59 minutes.

Other **PROPOSED** limits: about 11 sets for one group in one session (14 for a Focus muscle), and at most 4 sets on one exercise for beginners (client level L1) or 5 for intermediate and advanced lifters (L2, L3).

### 8. Supersets

**Rule.** A *superset* is two exercises done back to back, with the rest after the pair. The plan marks every pair that can be supersetted as "superset suggested", with the minutes it saves. The person switches each one on or off.

**Why.** For him the superset is first a fatigue tool: "The supersetting is more like a fatiguing principle." and "It's a tool to use to fatigue the heart more and compress the time." (ORD-05). In round 3 he made it the answer to short sessions: "Recommend doing supersets so that it's a faster workout" (R3-SES-02).

| When to superset | Who | Decided by |
|---|---|---|
| The session is short on time | anyone | ORD-05, R3-SES-02 |
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

A suggested superset is already switched on when the day only fits with it. Whether suggestions are shown at all is a preference (`F44.superset_recommendations`, shown by default).

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
| Remove an exercise | the other exercises keep their planned sets and keep climbing. The removed sets are not moved elsewhere automatically. | Option: R3-SES-02. Mechanism **PROPOSED**. |
| Add an exercise | the list offers only what the generator could have picked for this person. Rear-delt work is always offered on upper-body days. An added exercise climbs with its group. | Option: R3-SES-02, R3-VOL-01. Mechanism **PROPOSED**. |
| Add a block | a core superset anywhere, an extra accessory block, a cardio session | R2-SES-03, R2-SES-06 |
| Swap an exercise | the dropdown of the same category | GEN-04 |
| After an edit | the tool shows the day's minutes and the weekly sets per group. It adds a note when a group drops under 10 sets, stops climbing, or a day has no core block. It never refuses the person's own edit. | **PROPOSED** |
| Reset | "Reset to the generated plan" undoes every edit | **PROPOSED** |
| Where edits are kept | inside the plan the person holds. Blaze Camp keeps nothing. | R3-GEN-01 |

The generator still builds every plan by the rules first. Editing is what people do afterwards.

Cardio is adjustable in the same spirit: "You can always say, 'I need more cardio,' and then it just adds it to the program." (R2-SES-06)

### 10. What gives when time is short

**Rule.** Sometimes the days and minutes a person picks cannot hold the minimums. The plan then follows this order. He approved it in R3-SES-02.

| Step | What the plan does |
|---|---|
| 1 | **Tell them up front** and offer another training day or longer sessions. |
| 2 | If they keep their time, **train fewer muscle groups directly**. Big movers first. Arms, calves and rear delts get only *compound credit*: the quarter sets they earn as helpers on compound lifts. This replaces dropping every group below the floor. |
| 3 | **Recommend supersets** to save time. |
| 4 | **The stairway still climbs** on the groups that are trained. Never flat. |
| Never | Squeeze 2 to 4 exercises per group into a day that cannot hold them. |

**The minimums of a directly trained group.**

| Minimum | Value | Decided by |
|---|---|---|
| Floor | 10 sets a week (calves: 3 sets per leg day) | R2-VOL-06, VOL-17 |
| Exercises | 2 to 4 on every day it is trained (calves: 1) | R2-SES-05, R3-SES-01 |
| Climb | the last week is at least 2 sets above week 1 (calves: 1) | the climb is his (R3-SES-02); the size is **PROPOSED** |

**How the tool applies it** (the order is his; the numbers are **PROPOSED**):

| Detail | Value |
|---|---|
| When a day "fits" | its week-1 minutes, with every suggested superset on, are at most 110 % of the chosen length |
| Offer A | one more training day |
| Offer B | longer sessions, rounded up to 5 minutes |
| Offer C | switching off the core or athletic block on some days, when that helps |
| Which groups are kept, in order | first Focus muscles and groups the sport needs (for example calves for racket players over 50); then hips, quads, back, chest; then shoulders, calves, triceps, biceps |
| A group that is left out | keeps its compound credit and is listed as "not trained directly (time)" |

He approved "big movers first". Putting Focus muscles and sport-pinned groups ahead of them is **PROPOSED**.

**Three examples** (computed by the team with the time model above; an illustration, not his numbers):

| Client | Picks | The plan says | If they keep their time |
|---|---|---|---|
| Pickleball player with 2 × 45 minutes (the example in the round-3 question; worked here for a 55-year-old intermediate) | 2 × 45 min | the full plan needs about 105-minute sessions; a third 45-minute day is still not enough | hips trained directly (10 → 14 sets) plus the calves; everything else from compound credit. 2 × 60 adds quads. |
| Beginner, aesthetics, 4 full-body days | 4 × 60 min | the full plan needs about 85-minute sessions | quads, hips, back, chest and shoulders trained directly (biceps too, depending on one **PROPOSED** setting); triceps and calves from compound credit |
| CrossFit-style class member (the other example in that question) | 4 × 60 min | week 1 needs about 88 minutes on the longest day; offer about 90-minute sessions or another day | fewer groups trained directly, by the same order |

The 2 × 45 result is an open question for him: with his minimums, so little time holds only one big group plus calves.

### 11. The week

| Topic | Rule | Decided by |
|---|---|---|
| Shape of a 4 to 6 day week | A1, B1, optional day, A2, B2, optional day, off | OBSERVED in his program sheets |
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
| 1 to 2 exercises per muscle on full-body days | 2 to 4, never 1 | R2-SES-05 |
| "At most 2 exercises per muscle per session" | 2 to 4 | VOL-07 |
| A second calf exercise on a leg day | one exercise × 3 sets | R3-SES-01 |
| Loading the spine once a week in total | one heavy squat day + one heavy deadlift day | R2-SES-01 |
| Hinge + pull and lunge + push on bootcamp days | hinge + push, knee + pull | ORD-06 |
| Cutting sets late in a block when a day runs over time | the time check runs before the plan is built | R3-SES-02 |
| Pulldown before the row (three older sheets) | row first | ORD-01 |
| Ranking machines (hack squat "last") | no ranking; use what feels right | EQ-11 |
| Bands, chains, band chops as substitutes | none | EQ-01, EQ-07, EQ-12 |

## Still PROPOSED

Waiting for his yes or no:

- Which blocks can be switched off, beyond the athletic and core blocks he named.
- What happens to the sets of a removed exercise.
- The wording "superset suggested" and "needed", and the list of allowed pairs.
- Every number of the time model, the 110 % fit rule and the 2-set minimum climb.
- The keep order when time is short (Focus and sport-pinned groups first).
- Very short weeks (2 × 45 minutes).
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
- [stairway.md](stairway.md): how sets are added, and why there are no check-ins.
- [bilateral-unilateral.md](bilateral-unilateral.md): the two-leg and one-leg share.
- [plans-and-calendar.md](plans-and-calendar.md): blocks, maintenance and the year.
- [athletes.md](athletes.md): the athletic blocks in depth.
- [equipment.md](equipment.md): machines, free weights, no bands.
- [categories.md](categories.md): hip dominant, knee dominant, push, pull and the other categories.
- [../00-overview/how-a-plan-is-made.md](../00-overview/how-a-plan-is-made.md): one worked example from intake to a finished week.
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
- Decision records: [core first](../04-decisions/adr-027-core-first.md), [power first, horizontal before vertical](../04-decisions/adr-028-power-first-horizontal-before-vertical.md), [pairing hip + push, knee + pull](../04-decisions/adr-029-pairing-hip-push-knee-pull.md), [axial loading once per pattern](../04-decisions/adr-030-axial-loading-once-per-pattern.md), [two to four exercises per group](../04-decisions/adr-031-two-to-four-exercises-per-group.md), [time against the minimums](../04-decisions/adr-032-time-vs-minimums-order.md), [editable plan, switches and supersets](../04-decisions/adr-005-editable-plan-switches-and-supersets.md), [no bands, no variable resistance](../04-decisions/adr-034-no-bands-no-variable-resistance.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
