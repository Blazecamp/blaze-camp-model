# Coach answers: Sessions and order

How one training session and one training week are put together: what comes first, what is paired with what, how many exercises fit, how the spine is loaded, when to superset, how much cardio, and what gives when time is short. Core opens the session. Power comes before strength. Rows come before pulldowns. Hip-dominant lifts (deadlifts, hip thrusts) pair with pushes, and knee-dominant lifts (squats, lunges) pair with pulls. A superset is two exercises done back to back. Every muscle group trained that day gets 2 to 4 exercises. People can switch off a day's athletic or core block and add or remove exercises.

This page is part of [the coach answers by topic](index.md). It holds 30 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: sessions](../02-model/sessions.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Core work comes first for everyone, as part of the warm-up. People may move it, or switch it off for a day. | [ATH-11](#ath-11), [R3-SES-02](#r3-ses-02) | CONFIRMED |
| 2 | The core opener is light: 2 exercises x 2 sets, short of failure. Core supersets can be added anywhere. | [R2-SES-03](#r2-ses-03) | CONFIRMED |
| 3 | Every session has a warm-up (5 minutes of any cardio plus A-drills or mobility). It never counts as volume. | [ORD-08](#ord-08) | CONFIRMED |
| 4 | Power before strength: cleans and snatches before heavy strength work. | [ORD-03](#ord-03) | CONFIRMED |
| 5 | Horizontal pull before vertical pull: the row comes before the pulldown, always. | [ORD-01](#ord-01) | CONFIRMED |
| 6 | The main lift ("the work") comes first, whatever its direction. | [ORD-02](#ord-02) | CONFIRMED |
| 7 | Pair hip-dominant lifts with pushing and knee-dominant lifts with pulling. | [UNI-11](#uni-11), [ORD-06](#ord-06) | CONFIRMED |
| 8 | Same-pattern or opposite-pattern pairing depends on the goal. Cross pattern is the default for most athletes. | [UNI-06](#uni-06), [R3-SES-01](#r3-ses-01) | CONFIRMED |
| 9 | Heavy squat and heavy deadlift go on two different days. The second time a slot comes up in the week, use a different exercise. | [PER-04](#per-04), [R2-SES-01](#r2-ses-01), [R2-SES-02](#r2-ses-02) | CONFIRMED |
| 10 | Each muscle group trained that day gets 2 to 4 exercises, never 1. Groups are his FOCUS groups (hips, shoulders ...). | [VOL-07](progression.md#vol-07), [R2-SES-05](#r2-ses-05), [R3-SES-01](#r3-ses-01) | CONFIRMED |
| 11 | About 7 exercises for a resistance session (45 min about 5, 60 min 6-7, 75-90 min 8-9). Field athletes: up to 12 plus the 2-exercise core block. | [VOL-08](#vol-08), [R2-SES-04](#r2-ses-04) | CONFIRMED |
| 12 | Session length: athletes about 1.5 hours (2 hours at most); everyday people 45 to 60 minutes; bootcamp 35 to 45 minutes. | [UNI-09](#uni-09), [PRG-03](#prg-03) | CONFIRMED |
| 13 | Supersets are a tool to add fatigue and save time. The plan recommends them to make the workout faster. | [ORD-05](#ord-05), [R3-SES-02](#r3-ses-02) | CONFIRMED |
| 14 | When the chosen time cannot fit the minimums: say so and offer more time; else train fewer muscles directly; use supersets; keep the stairway climbing. | [R3-SES-02](#r3-ses-02) | CONFIRMED |
| 15 | People can turn off that day's athletic or core training, and add or remove exercises or blocks. | [R3-SES-02](#r3-ses-02) | CONFIRMED |
| 16 | A small muscle goes first only when it is the muscle the person wants to work on most. | [ORD-04](#ord-04) | CONFIRMED |
| 17 | Optional days (calves, cardio, core, Focus 1, Focus 2) are add-ons or separate days; separate days are better. | [ORD-10](#ord-10), [ORD-11](#ord-11) | CONFIRMED |
| 18 | Aerobic sessions per week: 3 general and fat loss, 2 athletes in season, 4 aesthetics, plus long walks. The user can ask for more or less. | [ATH-07](#ath-07), [R2-SES-06](#r2-ses-06) | CONFIRMED |
| 19 | How the edit controls work (which blocks can be switched off, what happens to the sets of a removed exercise) and the time cost of a unilateral slot. | [R3-SES-02](#r3-ses-02), [UNI-09](#uni-09) | PROPOSED |

## Why, in his words

- "Ideally, for me, I want everybody to start with core work so they can get it out of the way." ([ATH-11](#ath-11))
- "That'll allow me to keep as far away as I can from bleeding over problems when I'm working out." ([UNI-11](#uni-11))
- "I don't want to always load the lower back and the spine twice per week." ([PER-04](#per-04))
- "It's a tool to use to fatigue the heart more and compress the time." ([ORD-05](#ord-05))
- "there's never one exercise, so from 2 all the way to 4" ([R2-SES-05](#r2-ses-05))
- "an athlete or a coach should be able to modify accordingly" ([R3-SES-02](#r3-ses-02))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| Order tiers, hard rules and defaults | `generator_spec_v1.json` | `rule_tables.ordering` |
| The core block | `generator_spec_v1.json` | `rule_tables.core_block` |
| Warm-up | `generator_spec_v1.json` | `rule_tables.warmup` |
| Pairing | `generator_spec_v1.json` | `rule_tables.pairing` |
| What counts as loading the spine | `generator_spec_v1.json` | `rule_tables.axial_loading` |
| Exercises per session and per group, session minutes | `generator_spec_v1.json` | `rule_tables.session_limits` |
| Time against the minimums | `generator_spec_v1.json` | `rule_tables.session_limits.time_vs_minimums` |
| Supersets, contrast and circuits | `generator_spec_v1.json` | `rule_tables.supersets_contrast_circuits` |
| Editing the plan (switch off, add, remove) | `generator_spec_v1.json` | `plan_editing` |
| Aerobic sessions per week | `generator_spec_v1.json` | `rule_tables.conditioning.sessions_per_week` |
| Session templates by family and days | `synthesis/05_templates.json` | `generator_split_templates` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [ATH-11](#ath-11) | 1 | NOT RIGHT | Core first for everyone, as the warm-up; movable, and can be switched off for a day. | Stands, refined |
| [R2-SES-03](#r2-ses-03) | 2 | RIGHT | Core opener: 2 exercises x 2 sets, short of failure. Core supersets optional anywhere. | Stands, refined |
| [ORD-08](#ord-08) | 1 | RIGHT | Always a warm-up (5 min cardio + A-drills or mobility); never counted as volume. | Stands |
| [ORD-03](#ord-03) | 1 | RIGHT | Power (cleans, snatches) before heavy strength. | Stands |
| [ORD-01](#ord-01) | 1 | RIGHT | Row before pulldown, always. | Stands |
| [ORD-02](#ord-02) | 1 | RIGHT | "The work" (main lift) always comes first, whatever its direction. | Stands |
| [ORD-04](#ord-04) | 1 | RIGHT | A small muscle goes first only when it is the person's Focus muscle. | Stands, refined |
| [ORD-07](#ord-07) | 1 | RIGHT | The work / the accessory / the nuance / the survival: the four roles of a strength session. | Stands |
| [ORD-09](#ord-09) | 1 | RIGHT | Fighters' opening cardio is a real aerobic block, not a warm-up. | Stands |
| [LIB-21](#lib-21) | 1 | RIGHT | Speed session order is fixed: squirrel jumps, MACH drills / acceleration starts, max velocity. | Stands |
| [UNI-11](#uni-11) | 1 | answered in words (no chip) | Pair hip dominant with push, knee dominant with pull, to avoid bleed-over. | Stands |
| [ORD-06](#ord-06) | 1 | RIGHT | Bootcamp 1 Tue/Fri was a mistake: hip dominant + push, knee dominant + pull. | Stands |
| [UNI-06](#uni-06) | 1 | answered in words (no chip) | Same-pattern or opposite-pattern pairing depends on the goal; cross pattern is the default for most athletes. | Stands, refined |
| [PER-04](#per-04) | 1 | RIGHT | Second exposure in the week = a different exercise; do not squat heavy twice a week. | Stands, refined |
| [R2-SES-01](#r2-ses-01) | 2 | RIGHT | Heavy squat and heavy deadlift on two different days; non-spinal lifts on the other lower days. | Stands |
| [R2-SES-02](#r2-ses-02) | 2 | RIGHT | Approved list of what counts as loading the spine and what does not. | Stands |
| [VOL-08](#vol-08) | 1 | RIGHT | About 7 exercises per resistance session (45 min ~5, 60 min 6-7, 75-90 min 8-9); field athletes up to 12. | Stands, refined |
| [R2-SES-04](#r2-ses-04) | 2 | RIGHT | Field athletes: 12 exercises + the 2-exercise core block. | Stands, refined |
| [R2-SES-05](#r2-ses-05) | 2 | PARTLY | Full-body days too: 2 to 4 exercises per muscle that day, never 1. | Stands, refined |
| [R3-SES-01](#r3-ses-01) | 3 | RIGHT | Count FOCUS groups (hips, shoulders); calves 1 exercise x 3 sets per leg day; field-athlete layout; Focus muscle 1 and 2 get 1-3 extra sets. | Stands |
| [UNI-09](#uni-09) | 1 | PARTLY | Sessions: athletes about 1.5 h (max 2 h); everyday people 45-60 min. Unilateral time must be accounted for. | Stands, refined |
| [ORD-05](#ord-05) | 1 | PARTLY | Supersets = a tool to add fatigue and compress time: short sessions, advanced athletes, off-season conditioning, beginners who do not fatigue. | Stands, refined |
| [PRG-03](#prg-03) | 1 | PARTLY | Bootcamp: timed circuits, 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min; 4, 5 or 6 sessions a week. | Stands |
| [PRG-11](#prg-11) | 1 | RIGHT | Fat Burn circuits are finishers after lifting. | Stands |
| [R3-SES-02](#r3-ses-02) | 3 | RIGHT | Time vs minimums: tell them, offer more time; else fewer muscles directly; supersets; stairway keeps climbing. People can switch off athletic or core blocks and add or remove exercises. | Stands |
| [ORD-10](#ord-10) | 1 | PARTLY | Optional days: add-ons or separate days; ideally separate. | Stands, refined |
| [ORD-11](#ord-11) | 1 | RIGHT | Focus slots: both may hit the same muscle, 2-3 sets each. | Stands, refined |
| [ATH-07](#ath-07) | 1 | PARTLY | Aerobic sessions: 3 general / fat loss, 2 athletes in season, 4 aesthetics, plus long walks; adjustable. | Stands, refined |
| [R2-SES-06](#r2-ses-06) | 2 | RIGHT | Aesthetics: 4 sessions (the 4th a second easy Orange) + walks. Every cardio count is adjustable up or down. | Stands |
| [PRG-02](#prg-02) | 1 | PARTLY | PPL weekdays are flexible: set by the athlete. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| Session intent order: power first (athletics), then power-strength, then strength, then resistance patterns. | `coach_chat_statements.md` | [ORD-03](#ord-03) confirms power before strength. [ATH-11](#ath-11) puts the core block in front of all of it. |
| Ordering: rowing (horizontal pull) before an overhead (vertical) pull; horizontal push before vertical push. | `coach_chat_statements.md` | [ORD-01](#ord-01) confirms the pull order. [ORD-02](#ord-02) adds the exception: the main lift comes first whatever its direction. |
| Ordering: row (horizontal pull) before overhead/vertical pull; horizontal push before vertical push. Power first (athletics) -> power-strength -> strength -> resistance patterns. | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Order inside a session

#### ATH-11

**Question (round 1).** Core early for athletes (Part B, right after the power block) and separate or optional for aesthetics: confirm?

**Final rule.** He rejected core placed right after the power block. All the core work is done first. It gives a good warm-up, and then you go to the rest. That is the default for everyone. People can move the core block (after the plyos, after strength, or to the end) because some athletes like it there. Round 3 added that they can also switch it off for a day.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Yes. 112 Baseball core items sit right after the power block.
- **His verdict (round 1):** NOT RIGHT
- **In his words:** "No, we need all the core work to be done first." / "Ideally, for me, I want everybody to start with core work so they can get it out of the way." (ATH-11)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.core_block.position`, `rule_tables.ordering.defaults.ATH-11`, `inputs_schema.fields.F44.fields.core_position`
- **Changed later:**
  - **REFINED by [R2-SES-03](#r2-ses-03) (round 2).** Before: All the core work first. Now: The opener stays light: 2 exercises x 2 sets, short of failure. Core supersets may be added anywhere.
  - **REFINED by [R3-SES-02](#r3-ses-02) (round 3).** Before: The core block can be moved. Now: It can also be turned off for that day.
- **See also:** [R2-SES-03](#r2-ses-03), [ORD-08](#ord-08), [VOL-17](volume.md#vol-17), [CAT-08](categorization.md#cat-08)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> No, we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff. That's how I like my model to be put together, but if they want to be able to move the core work to after the plyos or after the strength, that's fine too. They can have the option of moving it around that core block. Ideally, for me, I want everybody to start with core work so they can get it out of the way. Some athletes like to do it at the end, so that's why I want them to be able to move it around if they need to.

</details>

#### R2-SES-03

**Question (round 2).** When core opens the session before jumps and Olympic lifts, should it stay light?

**Final rule.** When core opens the session, before jumps and Olympic lifts, it stays light: 2 exercises x 2 sets, short of failure, as a warm-up. Hard core finishers only come when the client moves core to the end. Core supersets or monster sets can be added next to any exercise: "It should be optional to be thrown anywhere."

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: 2 exercises x 2 sets, short of failure, as a warm-up. Hard core finishers only when the client moves core to the end.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "It should be optional to be thrown anywhere, but yeah, just like this is fine." (R2-SES-03)
- **Not confirmed by him:** Picking one thorax and one pelvis exercise for the opener, and rotating planes across the week, is the team's content rule (PROPOSED).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.core_block.dose`, `rule_tables.core_block.add_ons`
- **Changed later:**
  - **REFINED by [R3-SES-02](#r3-ses-02) (round 3).** Before: The core block is always there. Now: People can turn off that day's core training.
- **This answer changed:** [VOL-17](volume.md#vol-17) (refined), [ATH-11](#ath-11) (refined), [ORD-05](#ord-05) (refined)
- **See also:** [ATH-11](#ath-11), [ORD-05](#ord-05), [CAT-08](categorization.md#cat-08)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, they can always add supersets of core to any of the exercises that they want to. Sometimes coaches like to do that. They like to give a person their exercise. For example, they'll start with core and then move to other things, and then, when the person is ending, they like to superset with core or superset or monster set with different exercises. It should be optional to be thrown anywhere, but yeah, just like this is fine.

</details>

#### ORD-08

**Question (round 1).** Should the generator always write a warm-up? Do A-drills count as athletic volume or warm-up?

**Final rule.** The generator always writes a warm-up: 5 minutes of any cardio, plus A-drills (A March, A Skip, A Run: running warm-up drills) or mobility such as KB book openers. A-drills are warm-up. They do not count as athletic volume.

- **Status:** Stands as answered.
- **We assumed (round 1):** Always: 5 min any cardio + A March/Skip/Run or mobility (KB book openers). A-drills don't count as volume.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.warmup`
- **See also:** [ATH-11](#ath-11), [ATH-05](athletes-and-sports.md#ath-05)

#### ORD-03

**Question (round 1).** HYBRID lists STRENGTH above OLY/POWER. Should cleans and snatches always come before heavy strength?

**Final rule.** Power before strength. Cleans and snatches always come before heavy strength work, as in BYOP and Baseball. The HYBRID tab that lists STRENGTH above OLY/POWER is not the rule.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. Power before strength, as in BYOP and Baseball.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.ordering.hard.ORD-03`
- **See also:** [ORD-02](#ord-02), [ATH-10](athletes-and-sports.md#ath-10)

#### ORD-01

**Question (round 1).** Row before pulldown: BYOP always does it, but Fat Burn, 4 Tracks Aesthetics and Boxing weeks 1–2 put the pulldown first. Which should the generator follow?

**Final rule.** Horizontal pull before vertical pull, always: the row comes before the pulldown. The tabs that put the pulldown first (Fat Burn, 4 Tracks Aesthetics, Boxing weeks 1-2) are not the rule.

- **Status:** Stands as answered.
- **We assumed (round 1):** BYOP: horizontal pull before vertical pull, always.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.ordering.hard.ORD-01`
- **See also:** [ORD-02](#ord-02)

#### ORD-02

**Question (round 1).** On overhead-press weeks in Conjugate, the overhead press ('the work') comes before the incline bench. Rule: the main lift comes first regardless of direction?

**Final rule.** The main lift, "the work", always comes first, whatever its direction. On overhead-press weeks the overhead press comes before the incline bench.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. 'The work' always comes first.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.ordering.hard.ORD-02`
- **See also:** [ORD-01](#ord-01), [ORD-07](#ord-07)

#### ORD-04

**Question (round 1).** Calves first on aesthetics A-days and side raises first on 4 Tracks push days: warm-up, pre-fatigue, or priority?

**Final rule.** Calves first on aesthetics A-days and side raises first on push days are there because that muscle is a priority (pre-fatigue). The generator puts a small muscle first only when it is the priority muscle. Since round 3 the "priority" is Focus muscle 1 or 2.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Priority/pre-fatigue for that muscle. The generator would only put them first when that muscle is a priority.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** Carrying this first-in-the-session rule over to Focus muscles is INFERRED; round 3 did not restate it.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.ordering.defaults.ORD-04`, `rule_tables.priority.order_in_session`
- **Changed later:**
  - **REFINED by [R3-SES-01](#r3-ses-01) (round 3).** Before: First when the muscle is a priority. Now: Priority muscles became Focus muscle 1 and Focus muscle 2.
- **See also:** [R3-SES-01](#r3-ses-01), [VOL-02](volume.md#vol-02)

#### ORD-07

**Question (round 1).** 'The work / the accessory / the nuance / the survival': what does each mean, and should every program use it?

**Final rule.** His four roles for strength plans. The work = the main lift, at 1 rep in reserve. The accessory = a supporting lift, at 2 reps in reserve. The nuance = weak-point, unilateral or variation work, to MAX. The survival = isolation or joint-health work, done no matter what. He marked our reading RIGHT.

- **Status:** Stands as answered.
- **We assumed (round 1):** Work = main lift at 1 RIR. Accessory = a supporting lift at 2 RIR. Nuance = weak-point, unilateral or variation work at MAX. Survival = isolation or joint-health work, done no matter what. A useful backbone for strength plans.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.effort.strength_roles`
- **See also:** [ORD-02](#ord-02), [PER-09](progression.md#per-09)

#### ORD-09

**Question (round 1).** Boxing starts every day with cardio and Hybrid Friday starts with 15–40 min easy. Warm-up or real aerobic block?

**Final rule.** For fighters, the cardio that opens every boxing day, and the 15 to 40 easy minutes that open Hybrid Friday, are a real aerobic block (Orange, easy), not a warm-up.

- **Status:** Stands as answered.
- **We assumed (round 1):** Real aerobic block (Orange/easy) for fighters.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.ordering.defaults.ORD-09`, `rule_tables.conditioning.rules`
- **See also:** [ATH-07](#ath-07), [ORD-08](#ord-08)

#### LIB-21

**Question (round 1).** Speed-session order from Sheet23 (squirrel jumps → MACH drills / acceleration starts → max velocity): fixed? Add MACH drills to the library?

**Final rule.** The order of a speed session is fixed: squirrel jumps, then MACH drills or acceleration starts, then max velocity. MACH drills are added to the library.

- **Status:** Stands as answered.
- **We assumed (round 1):** Fixed order; add them.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.speed_session_order`, `rule_tables.ordering.hard.LIB-21`
- **See also:** [ATH-06](athletes-and-sports.md#ath-06)

### Pairing

#### UNI-11

**Question (round 1).** Heavy bilateral lower lift paired with the horizontal upper vector, unilateral with the vertical one: intentional?

**Final rule.** Pair opposites. A hip-dominant lower lift (hamstrings and glutes, the back of the lower body) goes with chest (the front of the upper body). That keeps fatigue from "bleeding over" between muscles that sit close together: quads and hamstrings in the same block build up lactate and weakness. Pairing this way lets you do a lot of work with effort across the week.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. In BYOP this held 29 times vs 2 and 24 times vs 2.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." / "That'll allow me to keep as far away as I can from bleeding over problems when I'm working out." (UNI-11)
- **Note:** The question asked whether bilateral lifts pair with the horizontal vector and unilateral lifts with the vertical one. He answered with the hip / push and knee / pull rule and did not speak about the vector.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.pairing.hip_push_knee_pull`
- **See also:** [ORD-06](#ord-06), [UNI-06](#uni-06)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> If I do a hip-dominant movement (bilateral, symmetrical), or if I work, let's say, for example, hamstrings and glutes, then the upper body would be chest. If I'm doing the lower body, my opposite would be the upper body. If I'm doing the back of my lower body, then the opposite would be the front of my upper body.
>
> That'll allow me to keep as far away as I can from bleeding over problems when I'm working out. If I do quads and hamstrings, that might bleed over into a lot of leg buildup of lactate, weakness, and things like that.
>
> In my personal model, I think that's the best way to get a lot of work done with a lot of effort and not have it bleed over to the closeness of any muscles. You can do a lot of work throughout the week and more volume throughout your program.

</details>

#### ORD-06

**Question (round 1).** Bootcamp Option 1 Tue/Fri pairs hinge + vertical pull and lunge + horizontal push, the reverse of your other templates. Intentional?

**Final rule.** Bootcamp Option 1 on Tuesday and Friday paired hinge + vertical pull and lunge + horizontal push. That was not intentional. It should read hinge and then push: hip dominant with pushing and knee dominant with pulling. That is the model for full-body days and for bootcamps.

- **Status:** Stands as answered.
- **We assumed (round 1):** Not intentional. Should read hinge + push.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.pairing.bootcamp_1_tue_fri`, `rule_tables.pairing.hip_push_knee_pull`
- **See also:** [UNI-11](#uni-11), [PRG-03](#prg-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, that was not intentional. You should read hinge and then push: hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps.

</details>

#### UNI-06

**Question (round 1).** Same-pattern vs opposite-pattern pairing: is this a rule by goal?

**Final rule.** Whether the bilateral and the unilateral lower lift of a day share a pattern is a rule by goal. Aesthetics pairs a squat with a lunge (same pattern, more quad volume). Bootcamp pairs a squat with a single-leg RDL (opposite pattern), so people do not get too sore and can come more often. A high-level athlete who needs a bigger stimulus has to be driven harder into the muscle. Round 3 set the default for athletes: the cross pattern for most, the same-pattern athletic template for size-focused and high-level athletes.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Aesthetics pairs squat + lunge (same pattern, more quad volume). Athletes and bootcamp pair squat + single-leg RDL (opposite pattern, both covered every day).
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "Correct. This is a rule by goal." (UNI-06)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.pairing.same_vs_cross`
- **Changed later:**
  - **REFINED by [R3-SES-01](#r3-ses-01) (round 3).** Before: A rule by goal. Now: Cross pattern is the default for most athletes; the same-pattern athletic template is for size-focused and high-level athletes.
- **See also:** [UNI-11](#uni-11), [R3-SES-01](#r3-ses-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Correct. This is a rule by goal. If I want them to be in a bootcamp, for example, I don't want them to get too sore so they can do the bootcamp more often. If they are a high-level athlete and they're demanding more of their muscles in order to get the stimulus they need in order to grow and make big changes, then I have to make sure I drive a lot harder into that muscle. Depending on the goal, yes.

</details>

### Loading the spine

#### PER-04

**Question (round 1).** Second time a slot comes up in the week (e.g. Monday and Thursday squat): same exercise or a different one from that category?

**Final rule.** The second time a slot comes up in the week, use a different exercise from the same category. He does not want the squat pattern, which loads the spine, done twice a week: one day squat, the other day leg press. Load the spine once a week and load it correctly, because the deadlift will probably load it as well. Round 2 made this exact: the heavy squat and the heavy deadlift go on two different days.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** A different exercise from the same category (Justice League: Front Squat Monday, Low Bar Back Squat Thursday).
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "I don't want to always load the lower back and the spine twice per week." (PER-04)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.set_placement.second_weekly_exposure`, `rule_tables.axial_loading`
- **Changed later:**
  - **REFINED by [R2-SES-01](#r2-ses-01) (round 2).** Before: "I would rather just load it once per week." Now: Two different days: one heavy squat day and one heavy deadlift day; the other lower days use lifts that do not load the spine.
  - **REFINED by [R2-SES-02](#r2-ses-02) (round 2).** Before: Squats and deadlifts load the spine. Now: An approved list of what counts and what does not.
- **See also:** [R2-SES-01](#r2-ses-01), [R2-SES-02](#r2-ses-02), [EQ-11](equipment.md#eq-11)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Correct. I ideally don't want, for example, if you use the squat pattern (which is a lot of loading, also axial, meaning on your spine), to have them squat twice a week, essentially. I can do one day of squatting and the other day of leg pressing. I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well. I want to make sure we do this accordingly and correctly.

</details>

#### R2-SES-01

**Question (round 2).** 'Load the spine once a week': one squat day and one deadlift day (two days), or squat and deadlift on the same day?

**Final rule.** "Load the spine once a week" means two different days: a heavy squat on one day (Monday) and a heavy deadlift on another (Friday). On Tuesday the hinge (the hip-dominant lift) is one that does not load the spine (hip thrust, back extension, reverse hyper). On Thursday the knee lift is a leg press or belt squat.

- **Status:** Stands as answered.
- **We proposed (round 2):** Two different days: heavy squat Monday, heavy deadlift Friday. Tuesday a non-spinal hinge (hip thrust, back extension, reverse hyper). Thursday leg press or belt squat.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.axial_loading.rule`, `validation_checks.V10_spine`
- **This answer changed:** [PER-04](#per-04) (refined)
- **See also:** [PER-04](#per-04), [R2-SES-02](#r2-ses-02)

#### R2-SES-02

**Question (round 2).** Which lifts count as loading the spine?

**Final rule.** Lifts that count as loading the spine: barbell back, front, Zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Lifts that do not count: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg dumbbell work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum are fine on the second day if the person is not sore. Powerlifters may add a light technique squat or deadlift.

- **Status:** Stands as answered.
- **We proposed (round 2):** Count: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Don't count: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum: fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.axial_loading.classes`, `rule_tables.axial_loading.powerlifter_exception`
- **This answer changed:** [PER-04](#per-04) (refined), [EQ-11](equipment.md#eq-11) (refined)
- **See also:** [R2-SES-01](#r2-ses-01), [EQ-11](equipment.md#eq-11)

### How many exercises, how long

#### VOL-08

**Question (round 1).** Maximum exercises and sets per session?

**Final rule.** A resistance session is usually about 7 exercises of 2 to 3 sets. By length: 45 minutes about 5 exercises, 60 minutes 6 to 7, 75 to 90 minutes 8 to 9. Field athletes can have more, because they do plyos, then Olympic lifts, then accessories: up to 3 plyo exercises, 2 or 3 Olympic or power lifts and about 4 resistance exercises, 10 to 12 in all, "max maybe 12". Time and the athlete's energy must be accounted for.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Observed about 7 exercises × 2–3 sets (14–21 sets). By session length: 45 min ≈ 5, 60 min ≈ 6–7, 75–90 min ≈ 8–9 exercises.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "If you have to go with a complete athlete that is very far away from competition, like off-season, trying to max out their output, maybe max 12 exercises." (VOL-08)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.session_limits.resistance_exercises`, `rule_tables.session_limits.field_athlete_off_season`
- **Changed later:**
  - **REFINED by [R2-SES-04](#r2-ses-04) (round 2).** Before: "Max maybe 12" here, "12 to 14" in [VOL-17](volume.md#vol-17). Now: 12 exercises plus the 2-exercise core block (14 listed). Warm-up drills never count.
  - **REFINED by [R3-SES-01](#r3-ses-01) (round 3).** Before: 3 plyo + 2-3 Olympic + about 4 resistance. Now: Inside the cap: 2 to 4 exercises for each group trained that day, which leaves 2 jump or throw stations + 1 Olympic lift in the cross pattern.
- **See also:** [R2-SES-04](#r2-ses-04), [R3-SES-01](#r3-ses-01), [VOL-16](volume.md#vol-16), [UNI-09](#uni-09)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> It can be 7 exercises, but sometimes, when you have field athletes that need to do, for example, a couple of plyo exercises at the beginning, then they have to do their Olympic lifts, and then they have to do their accessories, they might have more than 7. Some of those plyo exercises might be 3 or 4 different things, and the Olympic lifts might be 3 or 4 different things because they need to warm up correctly and all of these things.
>
> It doesn't have to be 7. It's usually 7 for more resistance training patterns and non-athletes of sports and field sports. If you go do field sports, then we're going to have to do the plyos, and we have to do the Olympic lifts. You can have more than 7. It's just that we have to account for the time accordingly and account for the energy that the athlete has accordingly as well.
>
> What I usually do, if I do plyos and just keep it in good time, is the max would be, let's say, 3 different plyo exercises (planks or ballistics), and then I would have 2 or 3 exercises for Olympic lifting and powerlifting. For example, it'd be 3 and then 3, that's 6, and then for resistance training it might be 4 different exercises. It's going to be 10 to 12, so max maybe 12 different exercises.
>
> If you have to go with a complete athlete that is very far away from competition, like off-season, trying to max out their output, maybe max 12 exercises. For a field athlete like that, that's what I would say and suggest.

</details>

#### R2-SES-04

**Question (round 2).** Your cap for field athletes: 'max maybe 12' in one answer, '12 to 14' in another. Is it 12 plus the 2 core exercises?

**Final rule.** The cap for field athletes is 12 exercises plus the 2-exercise core block, 14 in total. Warm-up drills never count. A superset of two small isolation exercises counts as one.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: up to 12 exercises plus the 2-exercise core block (14 total). Warm-up drills never count, and a superset of two small isolations counts as one.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.session_limits.field_athlete_off_season`, `rule_tables.session_limits.superset_of_two_small_isolations`
- **Changed later:**
  - **REFINED by [R3-SES-01](#r3-ses-01) (round 3).** Before: 12 + 2 core. Now: How the 12 are used: 2 to 4 exercises per group trained that day, the rest jump or throw stations and one Olympic lift.
- **This answer changed:** [VOL-08](#vol-08) (refined), [VOL-17](volume.md#vol-17) (refined)
- **See also:** [VOL-08](#vol-08), [VOL-17](volume.md#vol-17), [R3-SES-01](#r3-ses-01)

#### R2-SES-05

**Question (round 2).** You use 3-4 exercises per muscle a day, but full-body days only hold 5-7 exercises. On full-body days, OK to give each muscle 1-2 exercises?

**Final rule.** Full-body days need the same 2 to 4 exercises per muscle as any other day. There is never just one exercise for a muscle. The day may run a little longer. We had proposed 1 or 2 per muscle on full-body days; he did not accept that.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: 1-2 per muscle on full-body days (volume comes from training it 2-3 times a week, Focus slots and bonus exercises); 3-4 per muscle on split days (push/pull/legs, upper/lower).
- **His verdict (round 2):** PARTLY
- **In his words:** "No, full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day." (R2-SES-05)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.session_limits.exercises_per_muscle_on_its_day`, `rule_tables.session_limits.full_body_days`
- **Changed later:**
  - **REFINED by [R3-SES-01](#r3-ses-01) (round 3).** Before: "Per muscle". Now: Counted on FOCUS groups: glutes + hamstrings = hips; front + side + rear delts = shoulders; calves keep one exercise.
  - **REFINED by [R3-SES-02](#r3-ses-02) (round 3).** Before: The day "might be a little longer". Now: If the chosen time cannot hold it, train fewer muscles directly. Never squeeze 2 to 4 exercises per muscle into a day that cannot hold them.
- **This answer changed:** [VOL-07](progression.md#vol-07) (refined)
- **See also:** [VOL-07](progression.md#vol-07), [R3-SES-01](#r3-ses-01), [R3-SES-02](#r3-ses-02)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> No, full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day. It could start really short, but because you're doing more volume throughout the week, there's never one exercise, so from 2 all the way to 4

</details>

#### R3-SES-01

**Question (round 3).** Full-body days need 2-4 exercises per muscle, never 1. How do we count a 'muscle', and how does it fit the field-athlete cap of 12 + 2 core?

**Final rule.** Three things. (1) A "muscle" for the 2-to-4-exercises rule is one of his FOCUS groups. Glutes + hamstrings are one hips group, so RDL + hip thrust + leg curl = 3 hip exercises. Front, side and rear delts are shoulders. Calves keep one exercise x 3 sets per leg day. (2) Field athletes get 2 to 4 exercises for each group trained that day (knee + pull day, hip + push day) inside the 12 + 2 core cap. With the cross pattern that leaves 2 jump or throw stations and 1 Olympic lift, so the cross pattern is the default for most athletes. The same-pattern athletic template (3 to 4 jump stations) is for size-focused and high-level athletes. (3) His words added Focus muscles. When someone picks a program they choose the main muscle they want to work on most, and the program automatically gives it extra sets: "an extra set or two or three". There can be a Focus muscle 1 and a Focus muscle 2, "and that should be enough".

- **Status:** Stands as answered.
- **We proposed (round 3):** We count your FOCUS groups, with glutes + hamstrings as one 'hips' group (e.g. RDL + hip thrust + leg curl = 3 hip exercises) and front / side / rear delts as 'shoulders'; calves keep one exercise x 3 sets per leg day. Field athletes: 2-4 exercises for each group trained that day (knee + pull day, hip + push day) inside the 12 + 2 core. With your cross pattern that leaves 2 jump / throw stations + 1 Olympic lift, so cross pattern stays the default for most athletes, and your same-pattern athletic template (3-4 jump stations) is used for size-focused and high-level athletes.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "The program will then automatically choose extra sets for that one compared to the other one." / "As much as everything else is balanced, the glutes should have an extra set or two or three." / "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." (R3-SES-01)
- **Not confirmed by him:** The default of +2 sets per Focus muscle is PROPOSED (he said one, two or three). Also PROPOSED: a Focus muscle stays directly trained when a short schedule forces the plan to train fewer muscles, and Focus muscles are offered to competitive field athletes with a note that the sport work comes first.
- **Note:** His example speaks of a woman choosing glutes. It is an example only: the intake has no sex field ([GEN-02](product-and-generator.md#gen-02)) and no sex-based rule ([ATH-09](athletes-and-sports.md#ath-09)).
- **Where it lives:** `generator_spec_v1.json` → `vocab.muscles.focus_groups`, `rule_tables.priority.v1_2_focus_muscles`, `rule_tables.session_limits.field_athlete_off_season`, `inputs_schema.fields.F09`
- **This answer changed:** [CAT-02](categorization.md#cat-02) (refined), [CAT-09](categorization.md#cat-09) (refined), [UNI-06](#uni-06) (refined), [VOL-02](volume.md#vol-02) (reversed), [VOL-07](progression.md#vol-07) (refined), [VOL-08](#vol-08) (refined), [VOL-17](volume.md#vol-17) (refined), [VOL-18](volume.md#vol-18) (refined), [ORD-04](#ord-04) (refined), [ORD-11](#ord-11) (refined), [GEN-02](product-and-generator.md#gen-02) (refined), [R2-VOL-06](volume.md#r2-vol-06) (refined), [R2-SES-04](#r2-ses-04) (refined), [R2-SES-05](#r2-ses-05) (refined)
- **See also:** [VOL-02](volume.md#vol-02), [R2-SES-05](#r2-ses-05), [R2-SES-04](#r2-ses-04), [UNI-06](#uni-06), [R3-VOL-01](volume.md#r3-vol-01), [CAT-02](categorization.md#cat-02), [ORD-11](#ord-11)

<details>
<summary>His full answer, round 3 (from <code>coach_answers_round3.md</code>)</summary>

> Yes, and also, when a person is picking their training program, they should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one compared to the other one.
>
> For example, if it's a female and she chooses glutes as one of the focus muscles, then the program should bias more toward glutes in the lower body. As much as everything else is balanced, the glutes should have an extra set or two or three. The program should do that. It should automatically understand that you want to have a little bit more volume on that muscle, which is essentially your focus muscle throughout this program.
>
> There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing.

</details>

#### UNI-09

**Question (round 1).** Unilateral work takes about twice as long. Does that lower how many exercises fit in a session?

**Final rule.** Unilateral work takes longer and that must be accounted for. He answered with session lengths. A great workout for an athlete who has the time is 2 hours at most; about 1.5 hours is usual for bodybuilders, powerlifters, professional athletes and field athletes. People with other goals (weight loss, everyday people) train 45 minutes to 1 hour. Do not add too much.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Yes. A unilateral slot counts like 1.5 slots of session time.
- **His verdict (round 1):** PARTLY
- **In his words:** "a great workout by an athlete that has time should be a max of 2 hours" (UNI-09)
- **Not confirmed by him:** Counting a unilateral slot as 1.5 slots of time was our assumption. He answered PARTLY and gave no number, so the time cost is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.session_limits.session_minutes`, `rule_tables.counting.unilateral_time_cost`
- **Changed later:**
  - **REFINED by [R3-SES-02](#r3-ses-02) (round 3).** Before: Account for the time; do not add too much. Now: A fixed order for what gives when the chosen time cannot fit the minimums.
- **See also:** [VOL-08](#vol-08), [R3-SES-02](#r3-ses-02), [PRG-03](#prg-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, we assume that you're going to finish your workout, but still, a great workout by an athlete that has time should be a max of 2 hours. Usually, about 1.5 hours is a great workout for a lot of the athletes: conventional bodybuilders, powerlifters, professional athletes, field athletes, and things like that. They usually take about that long. People that have different goals, like just weight loss and everyday people, can be 45 minutes to 1 hour. Ideally, just do not add too much, but it has to be accounted for, so partially, yeah.

</details>

### Supersets and circuits

#### ORD-05

**Question (round 1).** BYOP's alternating lower/upper order: straight sets or supersets? When should the generator write 'SUPERSET W/ 👇'?

**Final rule.** Supersets are a fatigue tool. Use them when time is short. Use them for an advanced athlete who wants more work done: the superset compresses the fatigue. Use them in the off-season to push VO2 max and mitochondrial capacity. Use them for a beginner who is not yet getting tired from the first exercise. "It's a tool to use to fatigue the heart more and compress the time." Round 3 added that the plan should recommend supersets to make the workout faster.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Superset each lower + upper pair when session time is short; straight sets otherwise.
- **His verdict (round 1):** PARTLY
- **In his words:** "The supersetting is more like a fatiguing principle." / "It's a tool to use to fatigue the heart more and compress the time." (ORD-05)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.supersets_contrast_circuits.use_cases`, `rule_tables.supersets_contrast_circuits.recommendations`
- **Changed later:**
  - **REFINED by [R2-SES-03](#r2-ses-03) (round 2).** Before: Supersets of lower + upper pairs. Now: Core supersets or monster sets can also be added next to any exercise.
  - **REFINED by [R3-SES-02](#r3-ses-02) (round 3).** Before: Use supersets when time is short. Now: "Recommend doing supersets so that it's a faster workout." The plan marks suggested pairs.
- **See also:** [R3-SES-02](#r3-ses-02), [R2-SES-03](#r2-ses-03), [VOL-14](volume.md#vol-14)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> You want to be able to superset those when the time is short, but also when there is an advanced athlete that wants to get more work done, and the superset allows them to compress the fatigue.
>
> Also, when athletes are in their off-season and they need to be able to hit their VO2 maxes and get better in VO2 max and their mitochondrial work, that's when you would start supersetting to advance the capacity of the mitochondria and the VO2 max of that athlete (because you're fatiguing that person way faster and more).
>
> Basically, anybody at a higher level, you can start mixing them in, or, on the opposite side, a beginner that's pushing weights but hasn't really potentiated anything and is not really getting a lot of fatigue with that first exercise. You give them a superset, and they really enjoy it because they feel they're getting more fatigued. The supersetting is more like a fatiguing principle.
>
> A lot of beginners don't get a lot of fatigue, so we put them in. A lot of pros, when they get really good at it, don't get a lot of fatigue, and they need more from the stimulus. Then you put that in there too. It's weird, but that's the way my brain works. It's a tool to use to fatigue the heart more and compress the time.

</details>

#### PRG-03

**Question (round 1).** Bootcamp Option 2: 6 sessions a week, or A/B weeks? Straight sets or timed circuits?

**Final rule.** A bootcamp can be 4, 5 or 6 sessions a week; it does not matter. What matters is the timed circuit: 3 to 5 rounds, 30 to 50 seconds at each station, around 5 to 7 stations, and 35 to 45 minutes in total.

- **Status:** Stands as answered.
- **We assumed (round 1):** A/B weeks, 3 days; timed circuits 3–5 rounds × 30–50 s.
- **His verdict (round 1):** PARTLY
- **In his words:** "We just have to make sure we keep those time circuits: 3 to 5 rounds, 30 to 50 seconds in each station." (PRG-03)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.supersets_contrast_circuits.bootcamp_circuits`
- **See also:** [ORD-06](#ord-06), [PRG-11](#prg-11), [R2-GEN-07](product-and-generator.md#r2-gen-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, there are different options for all this stuff, so it could be 6 days, 6 sessions a week, 4 sessions a week, or 5 sessions a week. It doesn't matter. We just have to make sure we keep those time circuits: 3 to 5 rounds, 30 to 50 seconds in each station. That's the best bootcamp option for me when I go for bootcamps, and it's probably around 5 to 7 stations. It should be anywhere from a 35-minute to a 45-minute workout total.

</details>

#### PRG-11

**Question (round 1).** Fat Burn circuits: finisher after lifting, or separate session?

**Final rule.** Fat Burn circuits are a finisher after lifting, not a separate session.

- **Status:** Stands as answered.
- **We assumed (round 1):** Finisher.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.conditioning.rules`
- **See also:** [PRG-03](#prg-03), [R3-ATH-03](athletes-and-sports.md#r3-ath-03)

### When time is short, and editing the plan

#### R3-SES-02

**Question (round 3).** Biggest open decision: when the time someone picks can't fit your minimums (10 sets per muscle, 2-4 exercises per muscle, 3 calf sets per leg day, a climbing stairway), what should give? Example: a pickleball player with 2 x 45 min, or a CrossFit class member with 4 x 60 min.

**Final rule.** When the time someone picks cannot fit his minimums (10 sets per muscle, 2 to 4 exercises per muscle, 3 calf sets per leg day, a climbing stairway), things give in this order. (1) Tell them up front and offer a third day or longer sessions. (2) If they keep their time, train fewer muscles directly: big movers first, with arms, calves and rear delts getting only the credit from compound lifts. Do not drop below the floor on everything. (3) Use supersets to save time. (4) The stairway climbs on the muscles that are trained; it is never flat. Never squeeze 2 to 4 exercises per muscle into a day that cannot hold them. His words added editing. Recommend supersets so the workout is faster. Recreational people, the general population and athletes should all be able to turn off that day's athletic training or that day's core training and just do the resistance work. They can also delete exercises. He listed the options himself: recommend supersets, and adding or removing exercises or blocks within the training session.

- **Status:** Stands as answered.
- **We proposed (round 3):** In this order: (1) tell them up front and offer a 3rd day or longer sessions; (2) if they keep their time, train fewer muscles directly (big movers first; arms, calves and rear delts only from compound credit) instead of dropping below the floor on everything; (3) use supersets to save time; (4) the stairway climbs on the muscles that are trained, never flat. Never squeeze 2-4 exercises per muscle into a day that can't hold them.
- **His verdict (round 3):** RIGHT, with words
- **In his words:** "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." / "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance" / "an athlete or a coach should be able to modify accordingly" (R3-SES-02)
- **Not confirmed by him:** The four steps are his. The mechanics are PROPOSED: how the fit is tested, the order in which groups are kept, which blocks can be switched off (every block but the warm-up), and what happens to the sets when an exercise is removed (nothing is moved automatically; the plan shows the effect). The approved text names "rear delts" among the small groups left to compound credit. Rear delts are part of the shoulders group ([R3-VOL-01](volume.md#r3-vol-01)), so the model reads this as shoulder isolation work (INFERRED).
- **Note:** In his dictated answer "plies" means plyos.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.session_limits.time_vs_minimums`, `plan_editing.edits`, `plan_editing.superset_recommendations`, `rule_tables.core_block.toggle`
- **This answer changed:** [UNI-09](#uni-09) (refined), [ATH-11](#ath-11) (refined), [ORD-05](#ord-05) (refined), [GEN-04](product-and-generator.md#gen-04) (refined), [GEN-08](product-and-generator.md#gen-08) (refined), [R2-SES-03](#r2-ses-03) (refined), [R2-SES-05](#r2-ses-05) (refined)
- **See also:** [R2-SES-05](#r2-ses-05), [ORD-05](#ord-05), [ATH-11](#ath-11), [UNI-09](#uni-09), [R3-VOL-04](progression.md#r3-vol-04), [GEN-04](product-and-generator.md#gen-04)

<details>
<summary>His full answer, round 3 (from <code>coach_answers_round3.md</code>)</summary>

> Yeah, this is fine. Recommend doing supersets so that it's a faster workout, but they should be able to get things done.
>
> Also, when there are recreational, general-population people or even athletes, they should be able to turn off that day's athletic training or that day's core training and just focus on resistance. Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves, or their connective tissues just don't feel like doing any plies and things like that. Then it could be turned off, or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly.
>
> The options should be:
>
> - Recommend supersets
> - Adding or removing exercises or blocks within the training session
>
> That should be a thing as well.

</details>

### Optional days and Focus slots

#### ORD-10

**Question (round 1).** Optional days (Calves, Cardio, Core, Focus 1, Focus 2): separate days or add-ons? How many should a client do?

**Final rule.** The optional days in his sheet (Calves, Cardio, Core, Focus 1, Focus 2) can be done either way: as add-ons to a training day or on separate days. Separate days are better, "so they don't get in the way".

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Separate days (Wed/Sat), 0–2 per week depending on schedule.
- **His verdict (round 1):** PARTLY
- **In his words:** "Ideally, separate days, so they don't get in the way." (ORD-10)
- **Not confirmed by him:** How many optional days a client does (we assumed 0 to 2) was not answered.
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.fields.F44.fields.optional_days`, `rule_tables.conditioning.placement`
- **Changed later:**
  - **REFINED by [R3-VOL-03](progression.md#r3-vol-03) (round 3).** Before: Optional days hold calves, cardio, core and Focus slots. Now: A small-muscle bonus exercise goes on the optional day first.
- **See also:** [ORD-11](#ord-11), [R3-VOL-03](progression.md#r3-vol-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Both. You can throw them in as add-ons, or you can do them on separate days. Ideally, separate days, so they don't get in the way.

</details>

#### ORD-11

**Question (round 1).** Focus slots: can both hit the same muscle? How many sets?

**Final rule.** Both Focus slots can hit the same muscle, with 2 to 3 sets each. They are used to bring a priority muscle up to its weekly target. Since round 3 that muscle is Focus muscle 1 or 2.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Yes, 2–3 sets each, used to bring a priority muscle up to its weekly target.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.priority.delivery`
- **Changed later:**
  - **REFINED by [R3-SES-01](#r3-ses-01) (round 3).** Before: Used for a priority muscle. Now: Priority muscles became Focus muscle 1 and Focus muscle 2.
- **See also:** [ORD-10](#ord-10), [R3-SES-01](#r3-ses-01), [VOL-02](volume.md#vol-02)

### Cardio in the week

#### ATH-07

**Question (round 1).** Aerobic work: 3 sessions/week (one Blue, Green and Orange each, per the cheat sheet) or 2 (as the athletic templates have)?

**Final rule.** Aerobic sessions per week: 3 for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics bodybuilders. Long walks after the workout belong in the plan too. Later rounds set the athlete numbers by sport and made every count adjustable.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** 3 for general and fat-loss clients and 2 for athletes in season.
- **His verdict (round 1):** PARTLY
- **In his words:** "They can do long walks after their workout, so that needs to be in there as well." (ATH-07)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.conditioning.sessions_per_week`
- **Changed later:**
  - **REFINED by [R2-SES-06](#r2-ses-06) (round 2).** Before: 4 for aesthetics bodybuilders. Now: The 4th is a second easy Orange session. All aesthetics clients get 4. Every count can be raised or lowered by the user.
  - **REFINED by [R2-ATH-06](athletes-and-sports.md#r2-ath-06) (round 2).** Before: 2 for athletes in season. Now: Off-season 2 to 4 by sport; pre-season 2; powerlifters 2 easy.
  - **REFINED by [R3-ATH-04](athletes-and-sports.md#r3-ath-04) (round 3).** Before: Counts by population. Now: 0 extra gym cardio for swimmers, runners, rowers and endurance cyclists: their practice is the cardio.
  - **REFINED by [R3-ATH-05](athletes-and-sports.md#r3-ath-05) (round 3).** Before: 3 for general clients. Now: For "stay athletic and active" people a 45-60+ minute session of their activity counts as one of the 3 (up to 2).
- **See also:** [R2-SES-06](#r2-ses-06), [R2-ATH-06](athletes-and-sports.md#r2-ath-06), [EQ-14](equipment.md#eq-14), [ORD-09](#ord-09)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Both are important. This just needs to be picked accordingly. Yes, essentially:
>
> - 3 for general and fat loss clients
> - 2 for athletes in season
> - 4 for aesthetics bodybuilders
>
> They can do long walks after their workout, so that needs to be in there as well.

</details>

#### R2-SES-06

**Question (round 2).** Aesthetics clients get 4 aerobic sessions, but your sheet says never the same colour twice. What is the 4th?

**Final rule.** His aerobic cheat sheet has three colours: Blue (short, high intensity), Green (moderate) and Orange (long, low). It says never the same colour twice in a week, so the 4th aerobic session for aesthetics clients is a second easy Orange session. The long walks after workouts are extra: 20 to 30 easy minutes. All aesthetics and physique clients get the 4, not only competitive bodybuilders. It is adjustable: someone can say "I need more cardio" or less, and the program adds or removes it.

- **Status:** Stands as answered.
- **We proposed (round 2):** A second easy Orange (long, low). The long walks after workouts are extra, 20-30 minutes easy. All aesthetics / physique clients get the 4, not only competitive bodybuilders.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "You can always say, 'I need more cardio,' and then it just adds it to the program." (R2-SES-06)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.conditioning.sessions_per_week.aesthetics_content`, `rule_tables.conditioning.sessions_per_week.adjustable`
- **This answer changed:** [ATH-07](#ath-07) (refined)
- **See also:** [ATH-07](#ath-07), [R2-PER-02](plans-and-calendar.md#r2-per-02)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, but also adjustable. You can always say, "I need more cardio," and then it just adds it to the program. Where I need less cardio, it takes away from the program, so it can always be adjustable.

</details>

### The week

#### PRG-02

**Question (round 1).** PPL 3-day: which days, and do sets per slot go up to make up for 1× per week?

**Final rule.** Push / pull / legs on 3 days: the days are adjusted to the athlete. The tool cannot know in advance which days they need, so the weekdays are the person's choice.

- **Status:** Stands as answered.
- **We assumed (round 1):** Mon/Wed/Fri, 3–4 sets per slot.
- **His verdict (round 1):** PARTLY
- **In his words:** "can be adjusted as needed by athlete, we don't really know what days they're going to really need it or not." (PRG-02)
- **Not confirmed by him:** Whether sets per slot go up to make up for training each muscle once a week was not answered; our 3 to 4 sets per slot is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.fields.F23`
- **See also:** [R2-GEN-07](product-and-generator.md#r2-gen-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> can be adjusted as needed by athlete, we don't really know what days they're going to really need it or not.

</details>

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [GEN-08](product-and-generator.md#gen-08) | [product-and-generator](product-and-generator.md) | Hard rules the generator never breaks; coaches can add their own. |
| [VOL-17](volume.md#vol-17) | [volume](volume.md) | Calves 3 sets every leg day; about 2 core exercises. |
| [R3-VOL-03](progression.md#r3-vol-03) | [progression](progression.md) | Where added sets go when a day repeats. |
| [R2-ATH-04](athletes-and-sports.md#r2-ath-04) | [athletes-and-sports](athletes-and-sports.md) | Clean days are squat-pattern days; snatch days are hinge-pattern days. |
| [ATH-12](athletes-and-sports.md#ath-12) | [athletes-and-sports](athletes-and-sports.md) | Contrast work and complexes. |
| [EQ-11](equipment.md#eq-11) | [equipment](equipment.md) | Belt squat when the back has already been loaded. |
| [R2-ATH-06](athletes-and-sports.md#r2-ath-06) | [athletes-and-sports](athletes-and-sports.md) | Aerobic sessions for athletes by sport. |
| [R2-ATH-07](athletes-and-sports.md#r2-ath-07) | [athletes-and-sports](athletes-and-sports.md) | In season, the hard gym day sits at least 48 hours before a game. |
| [PER-03](plans-and-calendar.md#per-03) | [plans-and-calendar](plans-and-calendar.md) | A / B weeks for people who want variety. |
| [VOL-15](volume.md#vol-15) | [volume](volume.md) | Myo sets go last. |
