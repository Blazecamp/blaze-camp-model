# How he thinks: the mental model behind the Blaze Camp plans

This page explains how coach Lalo Vera reasons when he writes a program, so that a coach, a developer or an AI agent can predict what he would do in a case the rules do not cover. It covers his two sets of lenses (bigger muscles, smaller muscles and biomechanics; athletic, resistance and core), the difference between producing force and receiving force, health versus performance, unilateral versus bilateral work, machines versus free weights, speed versus load, the stairway, and his demand for simplicity. Each section gives the idea first, then his reasoning in his own words with the answer id, then where it lives in the data. Team readings he has not confirmed are marked **PROPOSED**.

Related pages: [principles](principles.md) (the rules, one by one), [lineage](lineage.md) (where the ideas come from), [what he rejected](what-he-rejected.md).

## How to read this page

| You see | It means |
|---|---|
| "Text in double quotes" | His own words, copied from the answer files. " ... " marks words left out. |
| 'Text in single quotes' | A label copied from his sheets, with his spelling. |
| `CAT-..`, `UNI-..`, `VOL-..`, `PER-..`, `ATH-..`, `ORD-..`, `EQ-..`, `GEN-..`, `LIB-..`, `PRG-..`, `FIX-..` | Round-1 answers: [coach_answers_full.md](../../coach_answers_full.md) |
| `R2-..`, `R3-..`, `R4-..` | Round-2, round-3 and round-4 answers: [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md), [coach_answers_round4.md](../../coach_answers_round4.md). Round 4 is the newest questionnaire round and wins. |
| `CT-01`, `CX-01..04` | Two clarifications he gave in conversation on 2026-10-10: on session time ([coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md)) and on progression and editing ([coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md)). They rank with round 4 on their subjects. |
| `COACH-CHAT` | Said in conversation: [coach_chat_statements.md](../../coach_chat_statements.md), [coach_answers.md](../../coach_answers.md). Close paraphrases unless shown in quotes there. |
| `OBSERVED` | Read from his sheets (`dumps/`). |
| **PROPOSED** | The team's number or reading. He has not confirmed it. |
| `file > key` | Where it lives. `model/rules.json` is generated and its keys may move; the `generator_spec_v1.json` key is the stable one. |

## The model in one picture

```
WHO IS THIS?            age, training experience, goal, sport and season, injuries, time, equipment
        |
WHAT IS TRAINED?        bigger muscles | smaller muscles          (biomechanics describes every exercise)
WHAT KIND OF WORK?      athletic patterns | resistance patterns | core   (+ cardio)
        |
WHICH WAY DOES IT LEAN?
   receive force  <----------------------------->  create force
   health         <----------------------------->  performance
   unilateral     <----------------------------->  bilateral
   machines       <----------------------------->  free weights
   light and fast <----------------------------->  heavy and slow
        |
HOW DOES IT GROW?       a stairway: small steps, then bigger steps, the hardest weeks last
        |
WHAT COMES OUT?         the whole plan at once, as a template the person adjusts
```

The picture is the team's summary of his answers (**PROPOSED**). Each part is explained below with his own words. Read the five leans as one question asked five ways: what does this person need right now, and what is the safest tool that gives it to them?

---

## 1. Two sets of three lenses

**The idea.** A lens is one way of sorting exercises. He uses two sets of three. The first set says *what* is trained. The second set says *what kind of work* it is. Every exercise sits in both at once.

**His reasoning.** He named both sets himself and said this is the part people find hardest: "The hardest thing to understand is the categorization of everything" (COACH-CHAT). The lenses he listed were bigger muscles, smaller muscles and biomechanics, and athletic patterns, resistance patterns and core (COACH-CHAT). When the team asked whether every exercise should carry all tags at once, he said: "Yes, this is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge." (CAT-01).

### Lens set A: what is trained

| Lens | What it holds | How the model uses it | Source |
|---|---|---|---|
| Bigger muscles | quads, glutes, hamstrings, lats and upper back, chest | Organized by movement pattern (knee dominant, hip dominant, push, pull). A mix of reps, 5 to 15. | CAT-02, VOL-11; library layout OBSERVED |
| Smaller muscles | biceps, triceps, side and rear delts, calves, forearms, abs | Organized by muscle. More reps, 12 to 30, because they cannot go heavy. Shoulders count as one group. | CAT-02, VOL-11, R3-VOL-01; library layout OBSERVED |
| Biomechanics | plane (the direction of the movement), one side or both sides, where the load sits, stance (how the feet are set), range of motion, zone | Not a group of exercises. It is the description on every exercise. | CAT-03 |

"No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises. No." (CAT-03).

Two details of the biomechanics lens matter later on this page:

- **Where the load sits sets the level.** Load in front is easier, load behind is harder: "The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright." (CAT-04).
- **Zones are positions with a rotation bias.** He takes them from Dr. Pat Davidson's book. Arms down or overhead is "essentially external rotation biases at the vertical"; hands in front, or the knee at hip height, "is a zone 2 or an internal rotation bias, which is more compressive." (CAT-10). The model keeps both biases in every week and uses the zone to pick a swap when something hurts (R2-LIB-03).

### Lens set B: what kind of work

| Family | What it is | Its purpose | Counted in | Counts toward a muscle's weekly sets? | Source |
|---|---|---|---|---|---|
| Athletic patterns | jumps, throws, Olympic lifts, sprints, change of direction | a quality: speed, power, reactivity | contacts, throws, reps, meters | No | VOL-10, R2-VOL-05 |
| Resistance patterns | squats, hinges, pushes, pulls, isolation lifts | a muscle | hard sets | Yes | VOL-09, VOL-10 |
| Control patterns (core) | the trunk moves, the pelvis moves, or both | the warm-up that opens every session | 2 exercises of 2 sets to open the session | To abs only (**PROPOSED**) | CAT-08, ATH-11, R2-SES-03 |
| Cardio | aerobic work in three colours (Blue, Green, Orange) | conditioning | sessions | No | ATH-07, EQ-14 |
| Functional | carries, drags, sling systems (chains of muscles that cross the body) | still to be built out | not set yet | not set yet | LIB-19 |

"I think counting towards muscles is more for resistance patterns, not for athletic patterns. That's important." (VOL-10).

**How the two sets meet.** In his BUILD YOUR OWN PROGRAM sheet every row of a workout has a PURPOSE (the muscle or quality it is for) and a CATEGORY (the list the exercise is picked from) (OBSERVED). The team reads a program slot as purpose times category: place the pattern, then check the muscle (PROPOSED reading).

**In the data.**
- `synthesis/01_taxonomy.json > lenses` (both lens sets and how they cross)
- `generator_spec_v1.json > rule_tables > taxonomy`
- `generator_spec_v1.json > rule_tables > muscles` and `generator_spec_v1.json > vocab > muscles > focus_groups`
- `generator_spec_v1.json > rule_tables > levels_exercise > davidson_zones`
- Guides: [categories](../02-model/categories.md), [levels and zones](../02-model/levels-and-zones.md)

---

## 2. Producing force and receiving force

**The idea.** Training does two things with force. It teaches the body to *create* force (push, pull, jump, throw) and to *receive* force (land, absorb, stop). Most lifting is about creating force. Receiving has to be taught on purpose, and it comes first.

**His reasoning.** "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." (CAT-10). Creating is already everywhere: "We already create forces in a lot of the exercises that we do. It's all about creating forces when we're doing exercises, so I don't really think about it much." (CAT-10). So a program opens with landing drills and moves toward bouncing.

| What the body does | His words | Tools | Source |
|---|---|---|---|
| Receive and pause | "stick-the-landing drills" | landing drills, depth drops held for 3 seconds | CAT-10 |
| Receive, then create | "stick-the-landing and then jump" | drop then one jump, drop into a box jump | CAT-10 |
| Receive and create again and again | "repetitive hops" | pogo hops, hurdle hops, bounds | CAT-10 |
| Create with a long push or one big effort (ballistic) | "more of a ballistic movement" | squat jumps, box jumps, broad jumps, loaded jumps, medball throws, kettlebell swings | CAT-10, R2-ATH-02, R2-VOL-05 |
| Create force fast against a load (power) | "these are for power output" | Olympic lifts, in a version that fits the level | R2-GEN-06, ATH-10 |
| Create with slow, heavy force | "driving and creating forces" | bilateral squats, deadlifts, presses, rows | UNI-02 |

The Tools column is filled from his sheets and from the lists he approved (OBSERVED; R2-ATH-02). For example, his athletic template has 'Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one' and his library has 'Depth Drop to Box Jump ' (OBSERVED).

His sheet says the same thing in two labels: 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST', '*I USE THESE FOR MUSCULAR FORCE PRODUCTION' and 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY', '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS' (OBSERVED, MASTER MODEL workbook, ALL ABOUT BALLISTICS tab, cells A22 to D23).

**Time on the ground is the dial.** A plyometric contact is short and bouncy. A ballistic effort stays on the ground longer. "The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement." (CAT-10). The sport decides the mix: "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics." (ATH-01). Both always stay in: "some plyos are always good because I need them to have other tissues really strong." (ATH-01).

**The hip is where force goes in and out.** In single-leg work, the hand that holds the weight changes the job. A weight in the opposite hand (contralateral) pulls you into the hip: "it's helping me coil into my body. It's helping me get into the hip." (CAT-13). A weight on the same side (ipsilateral) helps you out of it. For a sprinter: "I don't need them to get into the hip; I need them to get out of the hip really quick." (CAT-13). Athletes who change direction need both, because they are "getting in and out of the hip quickly" (CAT-13).

**In the data.**
- `generator_spec_v1.json > rule_tables > athletic > method_stage` (the Receive-Create stages) and `generator_spec_v1.json > rule_tables > athletic > plyo_vs_ballistic`
- `synthesis/04_profiles.json > ground_contact_model`
- `generator_spec_v1.json > rule_tables > contra_ipsi`
- `model/rules.json > athletic > stages`, `model/rules.json > athletic > ground_contact_classes`
- Guide: [athletes](../02-model/athletes.md)

---

## 3. Health and performance

**The idea.** Every plan holds two kinds of work: work that drives a change (bigger, stronger, faster) and work that keeps the body healthy so it can keep training and playing. He decides how much of each by asking what the person is trying to do right now.

**His reasoning.** The clearest statement is about single-leg work: "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-02). But the health part is not always the unilateral part. In his answers it is the part the person's goal does not already cover. The two middle columns below are the team's sorting of his answers (**PROPOSED**); the quotes are his.

| Person | What drives the result | What keeps them healthy | His words | Source |
|---|---|---|---|---|
| Bodybuilder, powerlifter | bilateral work | unilateral work, mostly early in the program | "I use contralateral and ipsilateral movements for powerlifters and bodybuilders as accessory movements in order to keep them healthy, but I don't give them too much of that." | CAT-13 |
| Field athlete (tennis, soccer, basketball) | unilateral work, like the sport | bilateral work | "the bilateral work is more of a health foundation and strength of all the connective tissues and joints" | UNI-02 |
| Athlete in season | nothing new; hold what they have | unilateral work, ranges of motion | "they're not trying to drive changes in their body during their season. I just want them to maintain their strength and their potentiation" | UNI-10 |
| Bootcamp client | showing up often | not getting too sore | "I don't want them to get too sore so they can do the bootcamp more often." | UNI-06 |
| High-level athlete or physique client | driving hard into one muscle | not stated in this answer | "I have to make sure I drive a lot harder into that muscle." | UNI-06 |
| Older, injured or very high-volume client | volume collected safely | machines, fewer risky lifts | "I'd rather they collect that volume in a safe place with more constraints" | EQ-03 |
| Non-competitive adult who wants to be athletic | a body that performs | a good mix of everything | "It's just good health all around and just having a body that performs well." | ATH-13 |

Sorting his rules into a health side and a performance side, as the next two tables do, is also the team's summary (**PROPOSED**). Every rule and quote in them is his.

**Rules that come from the health side.**

| Rule | Why | Source |
|---|---|---|
| Load the spine heavy once a week per pattern | "I would rather just load it once per week and load it correctly" | PER-04, R2-SES-01 |
| Use the belt squat when the back has had enough | "Belt squats are for people that you don't need to load them axially, so it won't be a load on their back." | EQ-11 |
| With pain: cut 30 to 50%, go to machines or split grips, or drop the exercise | "maybe even drop the exercise altogether if it's too much." | VOL-03 |
| Boxers in heavy punching weeks: lower pressing and arm work, never to zero | "We just need to bring the volume down, down, down when it's like that, but not completely cut it out." | ATH-04 |
| Older adults: no jumps, Olympic lifts or depth jumps unless switched on, with a warning | "Make sure that you have a fitness professional to help you understand what this means." | R2-ATH-08, R3-ATH-02 |
| Never test a true max from zero | "you should not go from not training to a one-rep max test." | R2-PER-07 |
| Rest goes between blocks, not inside them | "This allows them to recover and not push too hard." (about 4 to 6-week maintenance phases) | PER-01, R2-VOL-07 |

**Rules that come from the performance side.**

| Rule | Why | Source |
|---|---|---|
| The last weeks of a block are the hardest | "you've pushed yourself a little bit past your limits" | R2-PER-05 |
| A block is completed | "they need to be able to manage their block and complete it." | R2-VOL-07 |
| Added sets go to the first exercise | "I put all my energy into it." | VOL-07 |
| Power work comes before strength work | confirmed as a hard rule; he did not spell out the reason | ORD-03, GEN-08, COACH-CHAT |
| Pair opposite ends of the body | "You can do a lot of work throughout the week and more volume throughout your program." | UNI-11 |

**In the data.**
- `generator_spec_v1.json > rule_tables > bilateral_unilateral` and `synthesis/04_profiles.json > bilateral_unilateral_model`
- `generator_spec_v1.json > rule_tables > pain`, `generator_spec_v1.json > rule_tables > axial_loading`
- `generator_spec_v1.json > rule_tables > athletic > older` and `generator_spec_v1.json > rule_tables > athletic > strikers`
- `generator_spec_v1.json > rule_tables > pairing > same_vs_cross`
- Guides: [special populations](../02-model/special-populations.md), [sessions](../02-model/sessions.md)

---

## 4. Unilateral for health and rotation, bilateral for driving force

**The idea.** Bilateral means both sides work together (a squat). Unilateral means one side at a time (a lunge). Bilateral lifts are symmetrical. He uses them to drive force, build muscle and get stronger. Unilateral lifts keep the hips, the lower back and the body's rotation working. The share between them is a slider, not a fixed number.

**His reasoning.** Symmetrical lifting loses something: "That's the rotational forces that get lost when you do powerlifting and bodybuilding, for example, because those are more bilateral, symmetrical movements and not so much unilateral." (CAT-13). Field athletes cannot afford that loss: "I don't want them to lose their rotational forces and skills." (UNI-02). And the slider moves with the calendar: for a strength athlete, the unilateral share is biggest "at the beginning of their program, maybe the first couple of weeks, 3 weeks, up to 4, maybe. I then slowly but surely turn it into more bilateral, symmetrical dominant, so that they can just drive more forces, build more muscle, and get stronger." (CAT-13).

| Who | Bilateral : unilateral | Status | Source |
|---|---|---|---|
| The full range | from 90/10 to 10/90 | his rule | UNI-02 |
| Bodybuilders and powerlifters, start of a program | about 50/50 | his rule | UNI-02, CAT-13 |
| Bodybuilders and powerlifters, later | 80/20 or 90/10 | his rule | UNI-02 |
| Field athletes who change direction (tennis, soccer, basketball, football routes) | 10/90 to 20/80 | his rule ("80% or 90% unilateral") | UNI-02, UNI-03 |
| Athletes in season | bilateral kept minimal | his rule | UNI-10 |
| Upper body | the same logic | his rule | UNI-03 |
| With pain | adjusted for the person | his rule | UNI-02, UNI-08 |
| Every other profile (sprinters, combat, swimmers, beginners, older adults ...) | a number per profile | **PROPOSED** | team, in `synthesis/04_profiles.json` |

He asked for the rest to be worked out: "It should be a range anywhere from one side, like 90/10, to the other side, 10/90. We got to figure that out and put that algorithm together." (UNI-02).

**What does not change with the side.** A set of 10/10 counts as one set (UNI-01). Unilateral work progresses the same way as bilateral work (UNI-05). It takes longer, and the plan has to account for that (UNI-09).

**In the data.**
- `generator_spec_v1.json > rule_tables > bilateral_unilateral > slider` and `generator_spec_v1.json > rule_tables > bilateral_unilateral > profiles`
- `synthesis/04_profiles.json > bilateral_unilateral_model`
- `model/rules.json > bilateral_share > slider_range`
- Guide: [bilateral and unilateral](../02-model/bilateral-unilateral.md)

---

## 5. Machines and free weights

**The idea.** Equipment differs in how much it holds you in place. He calls this constraint. A machine has many reference points: you sit, your feet are planted, and you move only your hands or feet. That makes it safe and lets you push hard. A free weight gives you fewer reference points, so it asks for more skill. The barbell asks for the most.

**His reasoning.** In conversation he explained that machines have many reference points and constraints, so you can push a lot and it is safer, and that dumbbells, kettlebells and medicine balls sit between machines and the barbell (COACH-CHAT). He added: "If you read the workouts you can understand them by their equipment usage." (COACH-CHAT). The same idea sets exercise level: "When it's machines or cables, it changes because it's easier because the machine or the cable is doing the work for you." (CAT-04). His squat sheet says what the leg press is good for: 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' (OBSERVED, MASTER MODEL workbook, ALL ABOUT SQUATS tab, cell I35).

The constraint scale he approved (EQ-13):

| Level | What it is | Examples | Suits |
|---|---|---|---|
| 5 | seated machine with a back pad | leg press, leg extension, machine row | older people, pain, high-volume finishers |
| 4 | plate-loaded machine, Smith machine, chest-supported free weight | hack squat, lat pulldown, belt squat | volume, beginners on pulls, older or injured people |
| 3 | cable, or a dumbbell on a bench | cable press, dumbbell bench press | beginners, accessories |
| 2 | standing free weights | front squat, deadlift, loaded lunges, Olympic lifts | main strength lifts, athletes |
| 1 | bodyweight, ballistic, reactive | pull-ups, jumps, sprints | athletes, advanced bodyweight skill |

The five levels and what each one is are approved. The Examples and Suits columns are the team's summary of how the scale is used (**PROPOSED**).

**What he will not do with machines.** He will not rank them: "I don't want to rank them because they have different brands, angles, and things like that." (EQ-11). The test is the person: "I want them to feel the right muscles. I want them to get the right stimulus." (EQ-11). And the person can choose: "The client might have that preference, so that can be completely up to them as well." (EQ-10).

**What he will not use at all.** Bands: "The only exception is I don't do bands." (EQ-01). See [what he rejected](what-he-rejected.md).

**In the data.**
- `synthesis/10_equipment_model.json > constraint_scale`, `synthesis/10_equipment_model.json > machine_preferences` and `synthesis/10_equipment_model.json > level_model`
- `generator_spec_v1.json > rule_tables > equipment > constraint_scale`, `generator_spec_v1.json > rule_tables > equipment > machines_not_ranked` and `generator_spec_v1.json > rule_tables > equipment > no_variable_resistance`
- `model/rules.json > equipment > banned_tokens`
- Guide: [equipment](../02-model/equipment.md)

---

## 6. Speed and load

**The idea.** Load and speed pull against each other. To train speed you must go light. Speed is a variable you set on purpose, the same as load, range of motion and volume. The same movement becomes a different kind of training when the speed changes.

**His reasoning.** "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (COACH-CHAT). In conversation he listed speed, range of motion (full or mid), load and volume as variables, and said quality of movement matters as much as quantity (COACH-CHAT).

| Case | What he does | His words | Source |
|---|---|---|---|
| Medball passes and rotations | light, 8 to 10 lb | (stated in conversation) | COACH-CHAT |
| Any medball or wall ball | never above 20 lb | "I don't think there's any need for anything more than 20 lbs., to be honest." | EQ-06 |
| A heavier ball | only for something specific | "the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or something like wall balls." | EQ-06 |
| Throws | no levels | "No levels in throws, just do them right" | LIB-06 |
| Kettlebell swings | power work, not muscle work | "at the speed they are swinging like that, it doesn't really become a resistance movement-building muscle work." | R2-VOL-05 |
| Olympic lifts | explained as power output and judged by speed; a percentage only when the person has tested that lift | "these are for power output, and they don't necessarily need to go by percentage unless you're a competitive Olympic lifter." | R2-GEN-06 |
| Full cleans and snatches | 3 to 5 reps per set | "the coach's eye and how the athlete's feeling to make sure that they're fast and powerful." | R2-ATH-05 |
| Loaded jumps | 10 to 20% of body weight; too heavy when height or speed clearly drops | approved as proposed | EQ-15 |
| Session order | fast work first, slow work last | power first, then power-strength, then strength, then resistance | COACH-CHAT, ORD-03 |

Everyone in athletic training gets Olympic lifts, in a version that fits their level: "everyone gets Olympic lifts." (ATH-10). He sorts them by pattern, like any other lift: "I take them as more of a squatty pattern and a hinging pattern. I take snatches a little bit more hingy than squatty" (R2-ATH-04).

**In the data.**
- `synthesis/10_equipment_model.json > load_velocity` and `synthesis/11_training_variables.json > load_velocity_rules`
- `generator_spec_v1.json > rule_tables > athletic > medball` and `generator_spec_v1.json > rule_tables > athletic > olympic`
- `generator_spec_v1.json > rule_tables > equipment > loaded_jumps`
- `model/rules.json > medball`, `model/rules.json > olympic > power_language`
- **PROPOSED:** the doses and stop rules in the load-velocity table (sets, reps, and stopping a speed set at the first slower rep).
- Guide: [athletes](../02-model/athletes.md)

---

## 7. The stairway

**The idea.** A plan grows the way you climb stairs: one step each week. The steps start small, get a little bigger after the halfway point, and the top steps are the hardest. He thinks about a block as a feeling that climbs from a 2 to an 11.

**His reasoning.** He starts from a simple weekly habit: "I usually go week to week: how many sets did you do this week? If you want to do more, do more sets the next week of the same thing." (COACH-CHAT). The shape came when the team proposed something else for an 8-week plan: "No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." (R2-PER-03). And for 12 weeks: "Again, like a stairway: steps up, steps up, and week by week, it just gets gradually worse. I mean worse, meaning better, more volume." (R2-PER-04).

| Part of the stairway | Value | Status | Source |
|---|---|---|---|
| Usual step in the first half | about 3% of weekly sets | approved | R3-VOL-04 |
| Usual step in the second half | about 5% of weekly sets | approved | R3-VOL-04 |
| What sets the step | the person, not the muscle's size | his rule | VOL-05 |
| Too big to sustain as a habit | 10% a week | his words | UNI-05 |
| Largest step allowed | no hard limit; a note when a week adds more than about 15% | approved | CX-01, R4-PRG-02 (the 7% limit is retired) |
| A week with the same sets | fine, while reps or load progress | his rule | CX-02, CX-03 |
| Reps and load | a rule the person applies, never a promised number | approved | R4-PRG-03 |
| Where a new set goes | the first exercise of the day, then the next | his rule | VOL-07 |
| How it feels | a 2 in week 1, an 11 in the last week | his rule | R2-PER-05 |
| Effort cue | 3 reps in the tank, then 2, then 1 to 2, then 1 plus extra-hard sets | approved | R3-VOL-04 |
| Deload inside the block | none | his rule | R2-VOL-07 |
| Next block | starts about 5% above where the last one started, never above the level's top | approved | PER-01, R2-VOL-06, R4-PRG-04 |
| Where each group ends | at its planned final sets, in the last week (one week early is fine) | approved | R3-VOL-04, CX-01, R4-PRG-01 |
| Exact scaling so each group lands on its final sets | one factor per group; it may make the steps bigger than 3% and 5% | the formula is the team's; the choice is his | CX-01 |

**Why the steps are usually small.** "it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program." (UNI-05).

**Why the endpoint still wins.** When small steps cannot reach the planned final sets, he does not want the plan to finish lower: "no, go ahead and increase faster if thats the need, they could edit accordingly" (CX-01). The person can always lower a week.

**Why the stairs never dip.** A block is meant to be finished: "It should never be thrown in the middle of a block." (R2-VOL-07, about maintenance and deload weeks). Rest belongs after the last step.

**Why the tool does the math.** He explained the set-by-set pattern (2/2/2, then 3/2/2, then 3/3/2 ...) and said: "If you can understand that math, then you can understand this algorithm that I'm trying to do" (VOL-07). But the person should not have to: "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." (VOL-06).

**In the data.**
- `generator_spec_v1.json > rule_tables > rate_engine` (principle, math, standard steps, limits)
- `generator_spec_v1.json > rule_tables > set_placement > steps`
- `generator_spec_v1.json > plan_types > fixed_12` and `generator_spec_v1.json > plan_types > cycles`
- `synthesis/12_volume_algorithm_v1.json > stairway`
- `model/rules.json > stairway` (`standard_steps`, `progression`), `model/rules.json > cycles > next_block`, `model/rules.json > render > progression`
- Guides: [stairway](../02-model/stairway.md), [plans and calendar](../02-model/plans-and-calendar.md)

---

## 8. Simplicity

**The idea.** The model has many rules, but what the person sees must be simple. A few answers go in. The whole plan comes out. The person can see all of it ahead of time and change what they need.

**His reasoning.** "I want this to be very simple. This works. We're not going to need a lot of inputs for this." and "This needs to be very simple for them to see the whole thing ahead of time, ideally, and they can adjust ahead of time, ideally. It doesn't need to rely too much on inputs." (R3-VOL-04). "It's already a template, and you need to adjust it as you need to." (R3-VOL-04).

| Simple means | His words | Source |
|---|---|---|
| Few inputs | "anybody can just plug in the numbers of what they want as far as weeks and sport or goals." | R3-VOL-04 |
| Only training questions | "I just need the workouts here." | R2-GEN-04 |
| No reporting back | "I don't want people to be checking back on their phone in their program." | R3-VOL-04 |
| Few clicks | "The fewer clicks, the better." | R2-GEN-02 |
| See the big picture | "the macro view of the week, the macro view of the block, and the macro view per day." | R2-GEN-02 |
| Easy to share | "they can just screenshot their 12 weeks and send it over to them" | R2-GEN-02 |
| Names people understand | "no one's going to know what Justice League means." | FIX-03 |
| Levels explained plainly | "We just have to explain it a little bit better so that they understand it." | PRG-05 |
| Nothing stored | "I don't want any data kept." | R3-GEN-01 |
| The person stays in charge | "an athlete or a coach should be able to modify accordingly." | R3-SES-02 |
| Everything is editable | "it should be all editable as they need to." | CX-04 |
| The person owns their time | "You need to stop trying to be responsible for the people's time." | CT-01 |
| No session-length question | "Drop it. We don't need it." | R4-SES-01 |
| His templates, not invented layouts | "These are templates that we're giving them for them to add or take away" | R4-SES-02 |

**Simple outside, adjustable inside.** He sees training as partly a matter of feel: "Everything in training is kind of subjective." (VOL-13). So the plan gives a sound default and trusts the person to adapt it. The words "adjust accordingly" come up again and again in his answers (UNI-02, UNI-08, VOL-01, VOL-05, VOL-16, PER-01, R3-VOL-04). The numbers are defaults too: "Yeah, but this is all customizable." (R2-VOL-06).

**Why this documentation exists.** He said more than once that the system is clearer in his head than on paper: "This is very complicated in my head, so I'm trying to get your help with it." (PER-03). "In a sense, it's a little bit of a puzzle, but I guess I'm trying to explain it as much as I can." (CAT-04).

**In the data.**
- `generator_spec_v1.json > inputs_schema > fewest_clicks` and `generator_spec_v1.json > inputs_schema > removed_fields`
- `generator_spec_v1.json > plan_editing > principle`
- `model/rules.json > session > size`, `model/rules.json > time_model` (`use: estimate_only`), `model/rules.json > session > easy_to_remove`
- `generator_spec_v1.json > legal_and_privacy > no_data_kept`
- `generator_spec_v1.json > rule_tables > rate_engine > no_feedback`
- Guides: [how a plan is made](../00-overview/how-a-plan-is-made.md), [what this is](../00-overview/what-this-is.md)

---

## 9. A reading aid: the questions he seems to ask, in order

This list is the team's summary of the order his answers imply. He did not state it as a list, so treat the whole section as **PROPOSED**. Each question points to the answer it is built from.

| # | Question | What it decides | Built from |
|---|---|---|---|
| 1 | Who is this? Age, training experience, goal, injuries. | level, safety defaults, starting sets | ATH-09, PRG-05, VOL-01 |
| 2 | Do they play a sport? What does the sport do on the ground? | plyometric versus ballistic share, how much athletic work | ATH-01, R2-ATH-01 |
| 3 | Do they need to get bigger and stronger, or stay fast and healthy? | the bilateral to unilateral slider, how much resistance work | UNI-02, ATH-03 |
| 4 | Where are they in their year or season? | drive a change, or maintain | UNI-10, PER-08, PER-01 |
| 5 | Does anything hurt? Are they older? | machines, cuts, exercises left out | VOL-03, EQ-03, R3-ATH-02 |
| 6 | What equipment do they have, and how many days? | which exercises; with 2 days, every big muscle at about 6 to 8 sets instead of 10. (How long a session lasts is not asked: CT-01, R4-SES-01.) | EQ-09, R4-SES-03 |
| 7 | Which muscle do they want most? | Focus muscle 1 and 2 | R3-SES-01 |
| 8 | Build each session on his template: core, then fast work, then the Day A or Day B lifts in their slots. | session order, pairing, session size | ATH-11, ORD-03, UNI-11, R4-SES-05, R4-SES-02 |
| 9 | Grow it week by week like a stairway, reach the final sets and finish the block. | weekly sets, effort, the progression rule | R2-PER-03, R2-VOL-07, CX-01, R4-PRG-03 |
| 10 | Hand over the whole plan and let them adjust all of it. | the output | R3-VOL-04, CX-04 |

When a new case comes up that no rule covers, these questions are the safest guide. If the answer would add an input, a check-in, a band, a rule by sex, a deload inside a block, a session-length question or a cut made for time, stop: he has already said no. See [what he rejected](what-he-rejected.md).

## Where to go next

| You want | Read |
|---|---|
| The 30 rules with ids and data keys | [principles.md](principles.md) |
| Where the ideas come from | [lineage.md](lineage.md) |
| The model guides | [../02-model/categories.md](../02-model/categories.md), [../02-model/volume.md](../02-model/volume.md), [../02-model/sessions.md](../02-model/sessions.md) |
| His answers by topic | [../03-coach-answers/index.md](../03-coach-answers/index.md) |
| The decisions and who made them | [../04-decisions/index.md](../04-decisions/index.md) |
| Terms | [../05-reference/glossary.md](../05-reference/glossary.md) |
