# Coach answers: Levels and zones

What makes an exercise foundational, intermediate or advanced, how a client's level is set, and what the word "zone" means in his sheets. The level of an exercise comes from skill, stability and where the load sits. The Davidson zones are rotation-bias tags, not levels. The plyo "zones" are a teaching order, later named the Receive-Create stages. He calls the levels "still very theoretical", so they guide choices and never lock anyone out.

This page is part of [the coach answers by topic](index.md). It holds 9 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: levels and zones](../02-model/levels-and-zones.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Exercise level = skill and stability demand plus where the load sits. Load in front = foundational. Load on the body = intermediate. Load behind the body = advanced. | [CAT-04](#cat-04), [R2-LIB-02](#r2-lib-02) | CONFIRMED |
| 2 | A seat, a machine or a cable makes a movement easier, because it does part of the work. | [CAT-04](#cat-04), [R2-LIB-02](#r2-lib-02) | CONFIRMED |
| 3 | Levels add options. They never take options away. Do not rely heavily on them. | [CAT-05](#cat-05) | CONFIRMED |
| 4 | The client's level (how much volume) and the exercise's level (how hard the movement is) are separate. | [CAT-06](#cat-06) | CONFIRMED |
| 5 | Client level 1 (novice = newby): under about a year of training, or back after 6 to 12 months off. Level 2: over a year of consistent training. | [PRG-05](#prg-05) | CONFIRMED |
| 6 | What makes someone Level 3 (3+ years consistent and 4+ days a week, or a competitive physique or strength athlete). | [PRG-05](#prg-05) | PROPOSED |
| 7 | Davidson zones are rotation biases. Zones 1 and 3 are vertical positions (external rotation). Zone 2 is horizontal (internal rotation, more compressive). The zone is a tag, not a level. | [CAT-10](#cat-10), [R2-LIB-02](#r2-lib-02) | CONFIRMED |
| 8 | Keep both rotation biases in every week. Use the bias to pick a swap when something hurts. Not by sport for now. | [R2-LIB-03](#r2-lib-03) | CONFIRMED |
| 9 | The plyo "zones" are a way to do plyos: receive and pause, then receive and create, then repeat. Zones do not apply to plyos. | [CAT-10](#cat-10), [CAT-11](#cat-11), [R2-ATH-03](athletes-and-sports.md#r2-ath-03) | CONFIRMED |
| 10 | Move up a level in a slot at the end of a block, when the exercise felt like an 8 or easier with no pain. | [PER-06](#per-06) | CONFIRMED |

## Why, in his words

- "The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright." ([CAT-04](#cat-04))
- "The levels are still very theoretical, so we don't need to rely heavily on them." ([CAT-05](#cat-05))
- "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." ([CAT-10](#cat-10))
- "I don't want to make an ex-pro athlete go back to Level 1 for no reason." ([PRG-05](#prg-05))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| Exercise level rule | `generator_spec_v1.json` | `rule_tables.levels_exercise.rule` |
| Davidson zones (positions, bias, use) | `generator_spec_v1.json` | `rule_tables.levels_exercise.davidson_zones` |
| Levels add options; client vs exercise level | `generator_spec_v1.json` | `rule_tables.taxonomy.levels` |
| Client levels L1 to L3 and the Pro setting | `generator_spec_v1.json` | `vocab.levels` |
| How the client level is worked out from the intake | `generator_spec_v1.json` | `derived_values.D3_client_level` |
| Receive-Create stages | `generator_spec_v1.json` | `rule_tables.athletic.method_stage` |
| Exercises with no level | `generator_spec_v1.json` | `rule_tables.levels_exercise.no_levels` |
| Level-up rule | `generator_spec_v1.json` | `rule_tables.levels_exercise.level_up` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [CAT-04](#cat-04) | 1 | answered in words (no chip) | Level = skill + stability + load position (front foundational, on the body intermediate, behind advanced); machines and cables make it easier. | Stands, refined |
| [CAT-05](#cat-05) | 1 | answered in words (no chip) | Levels add options, never remove them; they are "still very theoretical". | Stands |
| [CAT-06](#cat-06) | 1 | RIGHT | Client level and exercise level are separate. | Stands |
| [PER-06](#per-06) | 1 | RIGHT | Move up a level in a slot at the end of a block if it felt like an 8 or easier with no pain; the person decides (no check-ins). | Stands, refined |
| [PRG-05](#prg-05) | 1 | RIGHT | Novice = newby = Level 1 (under ~1 year, or back after 6-12 months off); Level 2 = over a year consistent; ex-pros only briefly at Level 1. | Stands, refined |
| [CAT-10](#cat-10) | 1 | answered in words (no chip) | Davidson zones = rotation biases (vertical external, horizontal internal); they do not apply to plyos, which follow a receive-then-create teaching order. | Stands, refined |
| [CAT-11](#cat-11) | 1 | answered in words (no chip) | The plyo "zones" are a way to perform plyos, now named the Receive-Create stages. | Stands, refined |
| [R2-LIB-02](#r2-lib-02) | 2 | RIGHT | Zones 1 and 3 vertical (external rotation), zone 2 horizontal (internal rotation); the zone is a tag, the level comes from load position. | Stands |
| [R2-LIB-03](#r2-lib-03) | 2 | RIGHT | Keep both rotation biases every week; use the bias to pick pain swaps; not by sport for now. | Stands, refined |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| His lineage: Dr. Pat Davidson, Dr. Mike Israetel, and training science from first principles. He is deliberately not building on packaged models (5/3/1, Texas Method, Prilepin's chart). He is "building the segmentation and the buckets from the ground up." | `coach_chat_statements.md` | The zones in [CAT-04](#cat-04) and [CAT-10](#cat-10) come from Davidson's book A Coach's Guide to Optimizing Movement. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Exercise level

#### CAT-04

**Question (round 1).** What makes an exercise FOUNDATIONAL vs INTERMEDIATE vs ADVANCED?

**Final rule.** An exercise's level comes mostly from skill and stability demand, plus where the load sits. Load in front of you (goblet squat, front-loaded Zercher) is foundational, "because people need to learn how to be more upright". Load close to and on the body (barbell front squat) is intermediate. Load behind the body (barbell back squat) is advanced. Machines and cables make a movement easier, because the machine or cable does part of the work. Round 2 confirmed that the level comes from load position, skill and stability, not from the zone.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Mostly skill and stability demand. Puzzle: leg press, pendulum and hip thrust machine sit in ADVANCED even though they're safe and easy to learn.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright." / "the machine or the cable is doing the work for you" (CAT-04)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.levels_exercise.rule`
- **Changed later:**
  - **REFINED by [R2-LIB-02](#r2-lib-02) (round 2).** Before: He described load position and the zones together (zone 1 arms low, zone 2 horizontal "more intermediate work", overhead or vertical "more advanced") and called it "a little bit of a puzzle". Now: Approved: the level comes from where the load sits, skill and stability, made easier by a seat, machine or cable. The zone is only a tag. A deep goblet squat stays foundational; a seated DB shoulder press or a lat pulldown is foundational even though it is overhead.
- **See also:** [R2-LIB-02](#r2-lib-02), [CAT-10](#cat-10), [EQ-04](equipment.md#eq-04), [EQ-13](equipment.md#eq-13)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Correct. Mostly, skill and stability demand would be more advanced. Also, in the positioning:
>
> - A barbell back squat is more advanced.
> - A barbell front squat would be more intermediate.
> - A goblet squat or a more front-loaded zerker would be foundational. The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright.
> - The load closer to and on your body is more intermediate.
> - The loading behind your body, for example, for back squat, would be more advanced.
>
> It has its nuances, but if you look for the book "A Coach's Guide to Optimizing Movement" by Dr. Pat Davidson, you can understand there are zones:
>
> - Zone 1 would be closer to your body at the bottom, with your arms, for example, and that is more zone 1.
> - Zone 2 would be very high-pressure, like horizontal, but it's safer for you when you push and pull. That is more intermediate work.
> - Overhead or vertical would be more advanced, with the positioning, the amount of stability that you need, and the skill that you need to do things right.
>
> When it's machines or cables, it changes because it's easier because the machine or the cable is doing the work for you. In a sense, it's a little bit of a puzzle, but I guess I'm trying to explain it as much as I can.

</details>

#### CAT-05

**Question (round 1).** Can a client at a higher level still pick exercises from lower levels?

**Final rule.** A client at a higher level can still pick exercises from lower levels. Levels add options and never remove them. The levels are "still very theoretical", so the model should not lean on them heavily.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. Levels add options and don't take any away. The MODERATE lists repeat some FOUNDATIONAL items.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "The levels are still very theoretical, so we don't need to rely heavily on them." (CAT-05)
- **Not confirmed by him:** Treating the level as a soft default and never as a gate is the team's wording of this answer (INFERRED).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.taxonomy.levels.rule`
- **See also:** [CAT-04](#cat-04), [CAT-06](#cat-06)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Correct, yes. The levels are still very theoretical, so we don't need to rely heavily on them.

</details>

#### CAT-06

**Question (round 1).** Are the client's level (how much volume) and the exercise's level (how hard the movement is) separate things?

**Final rule.** The client's level (how much volume) and the exercise's level (how hard the movement is) are two separate things. In his own Upper/Lower example a novice does barbell deadlifts and leg press.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. In your Upper/Lower example a NOVICE does barbell deadlifts and leg press, which the library files as MODERATE/ADVANCED.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.taxonomy.levels.client_vs_exercise_level`
- **See also:** [PRG-05](#prg-05), [CAT-05](#cat-05)

#### PER-06

**Question (round 1).** When does a client move up a level in a slot?

**Final rule.** A client moves up a level in a slot at the end of a block, when the exercise felt like "8 - That was perfect" or easier and there was no pain. Since round 3 there are no check-ins, so the tool does not read this from a log. The person or the coach makes the call when they build the next block.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** At the end of a block, if the exercise felt like '8 – That was perfect' or easier with no pain.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** How the person is told to apply this (a line in the printed "How to adjust this plan" guide) is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.levels_exercise.level_up`
- **Changed later:**
  - **REFINED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before: Move up when the exercise felt like an 8 or easier with no pain (the design then read that from the client's log). Now: No check-ins and no tracking. The rule stays as guidance; the person or coach applies it when building the next block.
- **See also:** [R3-VOL-02](progression.md#r3-vol-02), [PER-02](plans-and-calendar.md#per-02)

### Client level

#### PRG-05

**Question (round 1).** NOVICE vs NEWBY: which is lower? Rename to Level 1/2/3?

**Final rule.** Novice and newby are the same level. A novice has under a year of training, or under about 6 months. An intermediate has gone to the gym consistently for over a year. After 6 months to a year off, treat the person as a newby for their body, "but not necessarily as their skills". The names Level 1, Level 2 and Level 3 are fine if they are explained. Do not send an ex-pro athlete back to Level 1 for no reason: Level 1 for a short time to get acclimated, then up.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** NOVICE is the lowest in your sheet. Rename to L1/L2/L3.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "I don't want to make an ex-pro athlete go back to Level 1 for no reason." (PRG-05)
- **Not confirmed by him:** He defined Level 1 and Level 2. The Level 3 definition (3+ years consistent and 4+ days a week now, or a competitive physique or strength athlete) is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `vocab.levels`, `derived_values.D3_client_level`, `inputs_schema.fields.F17`
- **Changed later:**
  - **REFINED by [R2-VOL-06](volume.md#r2-vol-06) (round 2).** Before: Three levels. Now: He added the idea of a pro level where a very advanced person can take a muscle above 30 sets a week. It is built as an optional setting, not a fourth level (numbers PROPOSED).
- **See also:** [CAT-06](#cat-06), [VOL-01](volume.md#vol-01), [R2-VOL-06](volume.md#r2-vol-06)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, that's fine. We can use "novice" and "newbie" for me. Essentially, they are the same. The way I see it, a novice is somebody with less than a year of training experience, or maybe less than 6 months around there. A more intermediate athlete can be somebody that has consistently gone to the gym for over a year. If they take off for more than 6 months to a year, then we have to automatically treat them as a newby as far as their body, but not necessarily as their skills, because they might pick up the skills right away.
>
> Level 1, Level 2, and Level 3 sound okay. That's not a problem. We just have to explain it a little bit better so that they understand it. I don't want to make an ex-pro athlete go back to Level 1 for no reason. Maybe just Level 1 for a little bit of time, just so they can get acclimated with it and then be able to move up. That should be very subjective, but also objective in the sense of being in touch with the body.

</details>

### What "zone" means

#### CAT-10

**Question (round 1).** 'ZONE' means different things in different tabs. What does each mean?

**Final rule.** "Zone" means two different things in his sheets. (1) The Davidson zones, from Dr. Pat Davidson's book A Coach's Guide to Optimizing Movement, are rotation biases. Vertical positions (hands raised, a deep squat, or standing with the hands down) have an external-rotation bias. Horizontal positions (knee at hip level halfway through a squat, hands in front of you) are zone 2: an internal-rotation bias, which is more compressive. The zones do not apply to plyos. (2) The plyo labels are a teaching order. First receive and pause (stick the landing). Then receive and create once. Then receive and create over and over (hops). One leg is harder than two. The longer the foot stays on the ground, the less plyometric and the more ballistic the movement is. Programs start with more ballistic work and move gradually toward more plyometric work.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Plyo zones: Receive pause/create → Receive/create → Repeat receive create. Cable curl 'Zone 1/2/3': arm position or range of motion? Sheet23 green/yellow/red rows: unclear.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "It doesn't apply to the plyos. The plyos are different." / "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." (CAT-10)
- **Note:** He did not comment on the green, yellow and red rows of Sheet23 that the question also asked about.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.levels_exercise.davidson_zones`, `rule_tables.athletic.method_stage`, `rule_tables.athletic.plyo_vs_ballistic.rule`
- **Changed later:**
  - **REFINED by [R2-LIB-02](#r2-lib-02) (round 2).** Before: Vertical positions external rotation, horizontal zone 2 internal rotation. Now: Approved in full: zones 1 and 3 are both vertical external-rotation positions (arms low vs arms overhead or deep squat); zone 2 is horizontal internal rotation. The zone is a tag on the exercise.
  - **REFINED by [R2-LIB-03](#r2-lib-03) (round 2).** Before: He explained what the zones are, not how a plan uses them. Now: Keep both biases in every week and use them to pick swaps when something hurts. Not by sport for now.
  - **REFINED by [R2-ATH-03](athletes-and-sports.md#r2-ath-03) (round 2).** Before: The plyo teaching order had no name and no timing. Now: Named the Receive-Create stages (1 Land, 2 Land & Go, 3 Repeat) with set weeks for 12-week and 8-week plans.
  - **REFINED by [R2-ATH-02](athletes-and-sports.md#r2-ath-02) (round 2).** Before: Ballistic vs plyometric was described by ground-contact time only. Now: Approved lists of which jumps are ballistic and which are plyometric.
- **See also:** [CAT-04](#cat-04), [CAT-11](#cat-11), [R2-LIB-02](#r2-lib-02), [R2-ATH-03](athletes-and-sports.md#r2-ath-03), [ATH-01](athletes-and-sports.md#ath-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> The zones come from Dr. Pat Davidson's book, A Coach's Guide to Optimizing Movement, which is essentially external rotation biases at the vertical. If I raise my hands up, or if I'm in a deep squat, and then if I'm standing, it's also external rotational bias in the way my muscles work, or my hands are down.
>
> If I'm in a horizontal plane, like if my knee is at the level of my hips (I'm halfway through a squat), or if my hands are in front of me horizontally, then that is a zone 2 or an internal rotation bias, which is more compressive. It doesn't apply to the plyos. The plyos are different.
>
> The plyos are just a way of when I say "first receive and pause." You got to learn how to do that. Your body and your connective tissue need to learn how to receive forces before we teach it how to create. The beginning of a program might have a lot more receiving, like stick-the-landing drills and things like that. After that, slowly, gradually receive and then create force. That is more like a one-time thing, and then repetitively receiving and creating forces can be like hops and jumps and things like that. Those are a way of teaching plyometrics.
>
> Obviously, there is a create force between 1 and 2:
>
> 1. Receive and pause
> 2. Create
>
> We already create forces in a lot of the exercises that we do. It's all about creating forces when we're doing exercises, so I don't really think about it much.
>
> 1. Receive and then create, like stick-the-landing and then jump, or stick-the-landing and then hop, right?
> 2. Repetitively create, receiving and creating, like repetitive hops, right?
>
> Usually, I see plyos as different ways you can do plyos bilaterally or laterally. You can do it unilaterally, so it's harder if it's unilateral hops or jumps, a single-leg kind of thing. It's easier when it's both feet on the ground, but there's also an understanding of how much plyos. The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement. I do have to make sure that I explain to the athletes. Usually, they start the programs with more ballistic movements, and then slowly and gradually we go into more plyometric movements because we're trying to work on the connective tissue resistance and endurance, and just overall structure.

</details>

#### CAT-11

**Question (round 1).** Plyo zones: a property of the exercise, or a way to perform any jump? How long does an athlete stay in each?

**Final rule.** The "plyo zones" are not really zones. They are "the way I want the plyos to be done". In round 1 he had no name for it. In round 2 he approved the name Receive-Create stages, with the weeks spent in each stage.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** A way to perform a jump: the same hurdle hop can be done stick-and-pause, single rebound, or repeated. Athletes spend a few weeks in each zone.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "it's more like the way I want the plyos to be done" / "I don't know what to call it yet." (CAT-11)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.method_stage.name`
- **Changed later:**
  - **ANSWERED by [R2-ATH-03](athletes-and-sports.md#r2-ath-03) (round 2).** Before: "I just gave it a name, but it's not necessarily a plyo zone. I don't know what to call it yet." Now: Name approved: Receive-Create stages (1 Land, 2 Land & Go, 3 Repeat). 12-week plan: weeks 1-3 / 4-7 / 8-12. 8-week plan: weeks 1-2 / 3-5 / 6-8.
- **See also:** [CAT-10](#cat-10), [R2-ATH-03](athletes-and-sports.md#r2-ath-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Not necessarily plyo zones. You could call them plyo zones, but it's more like the way I want the plyos to be done, which I talked about in your cat 1 question. Partially plyo zones. I just gave it a name, but it's not necessarily a plyo zone. I don't know what to call it yet.

</details>

#### R2-LIB-02

**Question (round 2).** Zones 1 and 3 are both 'vertical' external-rotation positions (arms low vs arms overhead or deep squat) and zone 2 is the horizontal, internal-rotation one. Right? And does the exercise level come from where the load sits, not from the zone?

**Final rule.** Zones 1 and 3 are both vertical, external-rotation positions: arms low (zone 1) versus arms overhead or a deep squat (zone 3). Zone 2 is the horizontal, internal-rotation position. The zone is a tag on the exercise. The exercise level comes from where the load sits, skill and stability, made easier by a seat, machine or cable. So a deep goblet squat stays foundational, and a seated DB shoulder press or a lat pulldown is foundational even though it is overhead.

- **Status:** Stands as answered.
- **We proposed (round 2):** Yes to both. The zone is a tag on the exercise; the level comes from load position, skill and stability, made easier by a seat, machine or cable. So a deep goblet squat stays foundational, and a seated DB shoulder press or a lat pulldown is foundational even though it's overhead.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.levels_exercise.rule`, `rule_tables.levels_exercise.davidson_zones`
- **This answer changed:** [CAT-04](#cat-04) (refined), [CAT-10](#cat-10) (refined)
- **See also:** [CAT-04](#cat-04), [CAT-10](#cat-10), [R2-LIB-03](#r2-lib-03)

#### R2-LIB-03

**Question (round 2).** How should the plan use the rotation bias (external vs internal)?

**Final rule.** Keep both rotation biases (external and internal) in every week. Use the bias to pick a swap when something hurts. Do not set it by sport for now. Since round 3 there are no check-ins: the person makes the swap and nothing is logged. Listing the swap on the plan is the team's design (PROPOSED).

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Keep both in every week and use it to pick swaps when something hurts. Not by sport for now.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.levels_exercise.davidson_zones.use`, `rule_tables.pain`
- **Changed later:**
  - **REFINED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before: Use the bias to pick swaps when something hurts (the design then read pain from a check-in). Now: No check-ins. Pain declared at intake shapes the plan, and the printed guide tells the person to use the listed swap (the team's design, PROPOSED).
- **This answer changed:** [CAT-10](#cat-10) (refined), [VOL-03](volume.md#vol-03) (refined)
- **See also:** [R2-LIB-02](#r2-lib-02), [VOL-03](volume.md#vol-03)

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [LIB-06](library-details.md#lib-06) | [library-details](library-details.md) | Throws have no levels. |
| [LIB-08](library-details.md#lib-08) | [library-details](library-details.md) | The GHD has no levels. |
| [LIB-15](library-details.md#lib-15) | [library-details](library-details.md) | Leg extensions and leg curls are available at every level. |
| [LIB-13](library-details.md#lib-13) | [library-details](library-details.md) | Push press is the easier one; push jerk is intermediate to advanced. |
| [R2-LIB-05](library-details.md#r2-lib-05) | [library-details](library-details.md) | Bench push-ups: hands on the bench is foundational, feet on the bench is advanced. |
| [EQ-04](equipment.md#eq-04) | [equipment](equipment.md) | An older or injured foundational client can use machines filed as moderate or advanced. |
| [EQ-13](equipment.md#eq-13) | [equipment](equipment.md) | The 1 to 5 constraint scale. |
| [R2-ATH-03](athletes-and-sports.md#r2-ath-03) | [athletes-and-sports](athletes-and-sports.md) | Receive-Create stages: names and weeks. |
| [R2-VOL-06](volume.md#r2-vol-06) | [volume](volume.md) | A possible pro level above 30 sets. |
| [ATH-10](athletes-and-sports.md#ath-10) | [athletes-and-sports](athletes-and-sports.md) | Beginners get the simpler Olympic-lift variants; intermediate and up get the full scope. |
