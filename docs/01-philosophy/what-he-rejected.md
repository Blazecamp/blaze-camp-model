# What he rejected: ideas considered and turned down

This page lists the ideas that were proposed for the Blaze Camp model and that coach Lalo Vera said no to, in his own words. Some came from the team, some from his own older sheets, and a few from his own earlier answers that he later changed. Each entry gives the rule the model follows now, the idea that was rejected, his words with the answer id, and where the rule is enforced in the data. Read it before you add a feature: most obvious improvements to a training tool are already on this list. Team proposals that fell as a side effect, and that he never spoke about directly, are kept apart and marked **TEAM**.

Related pages: [principles](principles.md), [how he thinks](how-he-thinks.md), [lineage](lineage.md).

## How to read this page

| You see | It means |
|---|---|
| "Text in double quotes" | The coach's own words, copied from the answer files. " ... " marks words left out. |
| 'Text in single quotes' | A label copied from his sheets, with his spelling (OBSERVED). |
| `CAT-..`, `VOL-..`, `EQ-..`, `GEN-..` and so on | Round-1 answers: [coach_answers_full.md](../../coach_answers_full.md) |
| `R2-..`, `R3-..` | Round-2 and round-3 answers: [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md). The newest round wins. |
| `COACH-CHAT` | Said in conversation: [coach_chat_statements.md](../../coach_chat_statements.md), [coach_answers.md](../../coach_answers.md) |
| NOT RIGHT, PARTLY, RIGHT | The verdict he ticked on the team's proposal in the questionnaire. |
| **TEAM** | A team proposal or a team reading. He did not state it. Treat it as **PROPOSED**. |
| `H01` ... `H22` | Hard rules the plan engine checks: `model/rules.json > validation > hard`. Listed in [AGENTS.md](../../AGENTS.md), section 10. |
| `LK01` ... `LK18` | Locked rules: `model/rules.json > locked`. |
| `file > key` | Where it lives. `model/rules.json` is generated and may change when the engine is rebuilt; `generator_spec_v1.json` is the stable reference. |

## The rule

**A rejected idea stays rejected until the coach says otherwise.** Do not bring one back because it is common in other apps, because a study supports it, or because it would be easy to build. If you think he should reconsider, write it up as a question for him.

## The short list

| # | Rejected idea | What the model does instead | Decided in | Checked by |
|---|---|---|---|---|
| 1 | Check-ins, tracking, plans that adapt from feedback | Answers in, the whole plan out, once | R3-VOL-02, R3-VOL-04 | `H22`, `LK18` |
| 2 | Keeping user data; learning from users | Nothing is kept | R3-GEN-01 | spec `V27_no_data_kept` |
| 3 | Questions about sleep, stress, work or life | Workouts only | R2-GEN-04 | `H16`, `LK16` |
| 4 | A sex field; rules by sex | Age, foundation, goal and injuries decide | GEN-02, ATH-09 | `H13`, `LK10` |
| 5 | Bands | No bands anywhere | EQ-01, EQ-02, EQ-07, EQ-08 | `H01`, `LK06` |
| 6 | Chains, weight releasers and other variable resistance | Parked "for now" | EQ-12 | `H01`, `LK06` |
| 7 | Weekly increase chosen by muscle size | One stairway for every person | VOL-05, R2-PER-03 | `H21` |
| 8 | Jumps of 10% a week | Steps of about 3% then 5%, never above 7% | UNI-05, R3-VOL-04 | `H10`, `LK08` |
| 9 | A deload or maintenance week inside a block | Rest goes between blocks, as a recommendation | R2-VOL-07, R3-PER-01 | `H15`, `LK13` |
| 10 | "Start hard" 8-week plans; fixed shapes with a deload week | Every plan is a stairway | PER-01, R2-PER-03 | `H21` |
| 11 | Half a set for helper muscles | A quarter set | VOL-09 | `H08` |
| 12 | Kettlebell swings as glute work | Swings are ballistic and count for no muscle | R2-VOL-05 | `H09`, `LK07` |
| 13 | Fewer than 10 weekly sets for a trained muscle group | A floor of 10 | R2-VOL-04, R2-VOL-06 | `H17` |
| 14 | Rear delts as their own muscle | Part of the shoulders group | R3-VOL-01 | `H17` |
| 15 | One exercise per muscle on full-body days | 2 to 4, never 1 | R2-SES-05 | `H18` |
| 16 | Core after the power block | Core first | ATH-11 | `H05`, `LK05` |
| 17 | Loading the spine heavy twice a week in the same pattern | One heavy squat day, one heavy deadlift day | PER-04, R2-SES-01 | `H07`, `LK11` |
| 18 | Ranking machines; hack squat last | Machines are not ranked | EQ-11 | spec `machines_not_ranked` |
| 19 | Medballs heavier than 20 lb; medball work for bodybuilders | Light balls; none in a physique main workout | EQ-06, ATH-05 | `H11`, `LK12` |
| 20 | Olympic lifts only for intermediate and advanced athletes | Everyone in athletic training gets a version | ATH-10 | spec `V19_olympic` |
| 21 | A 1-rep max or all-out mile for someone starting from zero; tests mid-block | Tests at the start and end, never from zero | R2-PER-07 | `H19`, `LK14` |
| 22 | Biomechanics as a bucket; leg curls as hip dominant; plyo "zones" | See Part 3 | CAT-03, CAT-09, CAT-11 | catalog |
| 23 | Packaged programs: 5/3/1, Texas Method, Prilepin's chart, conjugate | His own model on first principles | COACH-CHAT, PER-01 | [lineage](lineage.md) |
| 24 | A full app; videos required; the name "Justice League" | A simple website; videos optional; plain names | GEN-03, R2-GEN-02, FIX-03 | spec `output` |

---

## Part 1. The product

### 1.1 Check-ins, tracking and plans that adapt from feedback

**The rule now.** The plan is built once and shown whole. Nothing the person does afterwards changes it. People and coaches adjust the plan themselves.

**The idea that was rejected.** A weekly check-in (effort, sessions done, pain) that would choose next week's step. A logbook the tool reads. A plan that grows faster when the week felt easy and holds when it felt hard. A week-by-week mode driven by those check-ins.

**His words.**
- "Yeah, we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." (R3-VOL-02)
- "we can just kick out the program designed already without the input of somebody saying how they feel or whatever. It doesn't really matter. The program will just have its natural algorithm recommendation of growth throughout it" (R3-VOL-04)
- "I don't want people to be checking back on their phone in their program. I want them to be able to kick out a program, and that's it." (R3-VOL-04)
- Earlier, on who should track: "I don't think that they should be tracking it from us. They should be tracking it themselves, however they want to track it, notebook or whatever" (GEN-03)
- Earlier, on a plan with no check-in: "No, if they don't check in, the plan doesn't change. There is no data to go off of." (R2-VOL-03)

**Note.** He approved a check-in more than once before he removed it (GEN-05, R2-GEN-01, R2-VOL-01). Round 3 is the newest answer and wins. See Part 8.

**In the data.**
- `generator_spec_v1.json > adaptation > status` (retired) and `generator_spec_v1.json > adaptation > retired_items`
- `generator_spec_v1.json > rule_tables > rate_engine > no_feedback` and `generator_spec_v1.json > rule_tables > rate_engine > retired`
- `generator_spec_v1.json > validation_checks > V26_inputs`
- `model/rules.json > stairway > planned_only`; `H22`; `LK18`
- His EFFORT and HOW IT FELT? columns stay in the sheet a person can download and fill in for themselves. The tool never reads them: `generator_spec_v1.json > rule_tables > learning > sheet_columns_for_the_person`

### 1.2 Keeping data and learning from users

**The rule now.** The tool keeps nothing: no accounts, no stored answers, no stored plans. The model changes only when the coach changes it.

**The idea that was rejected.** Storing plans and check-ins, and tuning the model from the results of everyone who uses it.

**His words.** "I don't know if we should be keeping any kind of data, but I don't want any data kept. It doesn't matter if they click it; it comes out." (R3-GEN-01)

**Note.** In round 1 he had hoped for the opposite: "This eventually will be something that learns from the data of all the people that use it" (VOL-01). The round-3 answer is newer and wins. Whether learning from data is off for good is an open question the team has kept for him (**TEAM**).

**In the data.**
- `generator_spec_v1.json > legal_and_privacy > no_data_kept`
- `generator_spec_v1.json > rule_tables > learning > status` (retired)
- `generator_spec_v1.json > validation_checks > V27_no_data_kept`
- `model/rules.json > legal > nothing_stored`
- [DISCLAIMER.md](../../DISCLAIMER.md), section 7

### 1.3 Questions about sleep, stress, work or life

**The rule now.** The form asks only what the workout plan needs.

**The idea that was rejected.** Three quick taps on the form (usual sleep, stress, a physical job or other sport) that would slow the weekly step for tired or stressed people.

**His words.** NOT RIGHT. "No, I don't want anything to do with anything else other than just workouts. I just need the workouts here. There's no need to talk about sleep or stress or anything else." (R2-GEN-04)

**In the data.**
- `generator_spec_v1.json > inputs_schema > removed_fields` (field F42)
- `generator_spec_v1.json > validation_checks > V26_inputs`
- `H16`; `LK16`

### 1.4 A sex field and rules by sex

**The rule now.** There is no sex or gender field and no rule that depends on sex. A Focus muscle is something the person chooses.

**The idea that was rejected.** Sex as an intake field, and different rules for female athletes.

**His words.** "I need you to take away just sex." (GEN-02). "For the older population, female or male doesn't really matter, so I don't go by sex on these things, but mainly by age, foundation, goal, and injuries. The rules kind of apply to everybody." (ATH-09)

**Note.** In round 3 he used "if it's a female and she chooses glutes as one of the focus muscles" as an example (R3-SES-01). The key word is *chooses*. The model reads this as an example of a choice, never as a default by sex (**TEAM** reading).

**In the data.**
- `generator_spec_v1.json > inputs_schema > removed_fields` (field F04)
- `H13`; `LK10`

### 1.5 Smaller product ideas he turned down

| Rejected idea | His words | What the model does instead | Source |
|---|---|---|---|
| Building a full app first | "I was going to create a whole app, but that kind of fell through, so I don't want to create a whole app. Maybe just a website they can just go into, and then that'll make it real easy." | A phone-friendly website, then the open repository | GEN-03 |
| A video for every exercise before launch | "They can just look up the videos on their own on YouTube. No need to have the videos on there." | Videos are optional; his own are added as they exist | R2-GEN-02 |
| Making people work out the percentages | "I don't really need them to be figuring out the percentages. I need this tool that we're building eventually to figure out the percentages." | The tool does the math and shows whole sets | VOL-06 |
| A health check a coach cannot skip | "I want to be able to bypass it if I'm a coach and I just want to get it done." | Coaches may skip it with a legal warning; everyone accepts the release each time | R2-GEN-03 |
| Program names only he understands | "we need the names to be general and understandable because no one's going to know what Justice League means." | Plain names for every program | FIX-03 |
| Sending a pro athlete back to the lowest level | "I don't want to make an ex-pro athlete go back to Level 1 for no reason." | Level 1 only briefly after a long break, explained in plain words | PRG-05 |
| Separate licences for code and model (Apache-2.0 and CC BY) | "it should be MIT to me so that the repo has that license to me." | One MIT license for the whole repository | R3-GEN-01 |

**In the data.** `generator_spec_v1.json > output > videos`, `generator_spec_v1.json > vocab > program_names`, `generator_spec_v1.json > legal_and_privacy > licence`, `generator_spec_v1.json > legal_and_privacy > health_check`.

---

## Part 2. Volume and progression

### 2.1 A weekly increase chosen by muscle size

**The rule now.** One stairway for every person. The step is a share of each group's weekly sets and does not depend on whether the muscle is big or small.

**The idea that was rejected.** Big muscles grow 3% a week, medium 5%, small 7%. An early note of his conversation recorded the 3, 5 and 7% ramp as depending on muscle size, and the team built on that.

**His words.** "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person." (VOL-05)

**In the data.** `generator_spec_v1.json > rule_tables > rate_engine > principle` (the rule text says the step is never chosen by muscle size); `H21`.

### 2.2 Big weekly jumps

**The rule now.** Steps of about 3% before the halfway week and about 5% after it. No step above 7%. Total weekly sets rise by less than 10%.

**The idea that was rejected.** Progressing by 10% a week. He raised this limit himself when asked how unilateral work progresses.

**His words.** "it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program." (UNI-05)

**In the data.** `generator_spec_v1.json > rule_tables > rate_engine > limits`; `generator_spec_v1.json > validation_checks > V15_step`; `H10`; `LK08`.

### 2.3 A deload or maintenance week inside a block

**The rule now.** A block has no easy week inside it. After a finished block, one easy week at about half the sets is recommended, not required. Holidays are planned between blocks.

**The idea that was rejected.** A fixed deload in the middle of a 12-week plan (week 7). A deload that fires when check-ins show two hard weeks in a row. A required recovery week before the next block.

**His words.**
- "No maintenance weeks are supposed to be at the end of a block, or if the athlete or coach demands a program of maintenance. It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it." (R2-VOL-07). This was dictated. The team reads the opening as: no, maintenance weeks belong at the end of a block (**TEAM** reading; the next sentence of his answer says the same thing).
- "If they can't complete it, they should cancel the block and start a maintenance phase, but then, when they're done with maintenance, they should start a whole new block." (R2-VOL-07)
- "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01)

**In the data.**
- `generator_spec_v1.json > plan_types > deload > when`
- `generator_spec_v1.json > validation_checks > V24_block_structure`
- `model/rules.json > recovery > only_between_blocks`; `H15`; `LK13`

### 2.4 "Start hard" and fixed plan shapes

**The rule now.** Every plan, of any length, climbs gradually from its normal starting point.

**The ideas that were rejected.**
- Plan shapes read from his sheets: 6 weeks as 5 building weeks plus a deload, 8 weeks as 7 plus a test week, 12 weeks as 6 plus a deload plus 5. Verdict: NOT RIGHT (PER-01).
- An 8-week plan as 4 easy weeks plus 4 hard weeks, starting with about 10% more sets. Verdict: NOT RIGHT (R2-PER-03).

**His words.** "So, usually, the 6-week plans are not necessarily needed." (PER-01). "No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." (R2-PER-03)

**Note.** The "start hard" idea came from his own round-1 words: "An 8-week program is a program that wants to modify you, so you have to start hard." (PER-01). In round 2 he corrected the team's reading of it. See Part 8.

**In the data.** `generator_spec_v1.json > plan_types > retired_v0` and `generator_spec_v1.json > plan_types > retired_v1`; `H21`.

### 2.5 Half a set for helpers, and kettlebell swings as glute work

**The rule now.** Helper muscles get a quarter set. Kettlebell swings count toward no muscle.

**The ideas that were rejected.** Counting helper muscles at half a set (bench press: chest 1.0, triceps 0.5). Counting kettlebell swings as one full glute set.

**His words.** "I would suggest a 0.25 to the helpers, not a 0.5." (VOL-09). "kettlebell swings are not glutes. They are hip-dominant, but at the speed they are swinging like that, it doesn't really become a resistance movement-building muscle work." (R2-VOL-05). On lunges and glutes: "I'm counting those mostly for quads. I don't necessarily count it for glutes" (UNI-01)

**In the data.** `generator_spec_v1.json > rule_tables > counting > retired_v1`; `generator_spec_v1.json > validation_checks > V14_counting`; `model/rules.json > credit > helper`; `model/rules.json > credit > never_credit_tags`; `H08`; `H09`.

### 2.6 Fewer than 10 sets, and rear delts as their own muscle

**The rule now.** Every muscle group trained directly gets at least 10 sets a week in a training block. Rear delts are counted inside the shoulders group.

**The ideas that were rejected.** Starting small muscles at 8 sets a week for beginners. Giving rear delts their own 4, 6 or 8 weekly sets.

**His words.** "8 sets a week is probably just barely maintenance." (R2-VOL-04). "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable. People and coaches should always be able to add more rear delts, I guess, if they wanted, but that's the way I look at it." (R3-VOL-01)

**In the data.** `generator_spec_v1.json > rule_tables > weekly_sets > floors`; `generator_spec_v1.json > rule_tables > weekly_sets > retired_v1_2`; `generator_spec_v1.json > validation_checks > V22_floor`; `H17`.

### 2.7 One exercise per muscle

**The rule now.** 2 to 4 exercises for each muscle group on every day it is trained.

**The ideas that were rejected.** At most 2 exercises per muscle per session. On full-body days, 1 to 2 exercises per muscle.

**His words.** "Usually, I have about 3 to 4 exercises per muscle group per day." (VOL-07). PARTLY: "No, full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day. It could start really short, but because you're doing more volume throughout the week, there's never one exercise, so from 2 all the way to 4" (R2-SES-05)

**In the data.** `generator_spec_v1.json > rule_tables > session_limits > exercises_per_muscle_on_its_day`; `generator_spec_v1.json > validation_checks > V23_exercises_per_group`; `H18`.

### 2.8 Smaller volume ideas he turned down

| Rejected idea | His words | What the model does instead | Source |
|---|---|---|---|
| An effort of 10 means a failed set | "That was the max I can do, not a fail." | 10 is the most you could do, done successfully | R2-VOL-02 |
| "start at a 2 and end at an 11" read as a number of sets | "I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets." | A felt level for the week, shown beside the plan | PER-01 (the phrase), R2-PER-05 (what he meant) |
| 40-rep sets as a fat-burning method | "it's not necessarily more fat-burning. I don't really believe too much of that is something that people want to do, but it's optional." | Only in an optional AMRAP workout (as many rounds or reps as possible) or inside the station circuits of a HYROX plan (HYROX is a fitness race of runs and workout stations) | VOL-11, R3-ATH-03 |
| Almost no direct work for calves and rear delts (as in his old sheets) | "They don't, but they should. They should get more sets on lifting days. It wasn't intentional." | Calves 3 sets every leg day; a rear-delt exercise every week | VOL-17 |
| Templates that give chest far fewer sets than side delts (as in his old sheets) | "it wasn't intentional for me to do that." | Balance to the weekly targets; a V-taper only when the person asks | VOL-18 |
| Reps that rise with level on one day and fall on another (as in his old sheets) | "That was probably a fill error or just a different program that I wrote" | One algorithm for reps, sets and volume | PRG-06 |
| Only 7 exercises in an athlete's session | "It doesn't have to be 7." | Field athletes may reach 12 exercises plus the 2-exercise core block | VOL-08, R2-SES-04 |
| Changing a plan for someone who never checked in, based on stress or sleep | "No, if they don't check in, the plan doesn't change. There is no data to go off of." | The planned stairway only | R2-VOL-03 |

---

## Part 3. Categories and levels

| Rejected idea | His words | What the model does instead | Source | In the data |
|---|---|---|---|---|
| Biomechanics as its own bucket of exercises | "No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises. No." | The description every exercise carries | CAT-03 | `generator_spec_v1.json > rule_tables > taxonomy > biomechanics` |
| Leg curls and Nordic curls counted as hip-dominant (hinge) work | "No, they shouldn't go in the hip-dominant movements. They should go in more of a flexion of the leg, kind of like bicep curls" | Their own LEG FLEXION group; they count for hamstrings, not for the hinge pattern | CAT-09 | `generator_spec_v1.json > vocab > retired_ids` |
| Calling the jump progression "plyo zones" | "Not necessarily plyo zones." and "I just gave it a name, but it's not necessarily a plyo zone. I don't know what to call it yet." | A way of doing a jump: the Receive-Create stages (name approved in R2-ATH-03) | CAT-11 | `generator_spec_v1.json > rule_tables > athletic > method_stage` |
| Using Davidson zones (position tags from Dr. Pat Davidson's book) for jumps | "It doesn't apply to the plyos. The plyos are different." | Zones tag loaded exercises only | CAT-10 | `generator_spec_v1.json > rule_tables > levels_exercise > davidson_zones` |
| Levels as hard gates | "The levels are still very theoretical, so we don't need to rely heavily on them." | Levels add options and never remove them | CAT-05 | `generator_spec_v1.json > rule_tables > taxonomy > levels` |
| Levels for medball throws | "No levels in throws, just do them right" | Throws have no level | LIB-06 | `generator_spec_v1.json > rule_tables > levels_exercise > no_levels` |
| Levels for the GHD (glute-ham bench) | "no levels on this" | No level | LIB-08 | same key |
| Different plans for high school, college and pro | "High school is the same as college, the same as pro, essentially." | The same plan; loads, speeds and care change with the athlete | PRG-09 | `synthesis/04_profiles.json > competition_level` |
| Exercises he dropped from his own library | "For the Camporini deadlift, you can ignore that one." and "you can take that one away, doesn't matter." (the strap rotation) | Removed | LIB-09 | `generator_spec_v1.json > rule_tables > library_decisions > removed` |
| The 21.6-mile run in the test list | "thats a marathon, dont know when/where we need that" | Removed from plans and tests (R2-LIB-06) | LIB-18 | same key |
| The tool inventing new exercises | approved as proposed (RIGHT, no words of his own): the tool never invents a new exercise | One-detail variations of library exercises only | R2-LIB-01 | `generator_spec_v1.json > rule_tables > library_decisions > variations` |

## Part 4. Sessions

| Rejected idea | His words | What the model does instead | Source | Checked by |
|---|---|---|---|---|
| Core after the power block for athletes, optional for others | NOT RIGHT. "No, we need all the core work to be done first." | Core first for everyone, light, movable | ATH-11 | `H05`, `LK05` |
| Squatting heavy twice a week | "I don't want to always load the lower back and the spine twice per week." | One heavy squat day; the second lower day uses a leg press or belt squat | PER-04 | `H07`, `LK11` |
| A hinge paired with a pull (as in one of his own bootcamp tabs) | "Yeah, that was not intentional. You should read hinge and then push: hip-dominant with pushing and knee-dominant with pulling." | Hip dominant with a push, knee dominant with a pull | ORD-06 | `H06` |
| Pulldown before row (as in some of his older tabs) | approved as proposed (RIGHT, no words of his own): row before pulldown, always | Horizontal before vertical | ORD-01 | `H04`, `LK04` |
| Supersets only when time is short | PARTLY. "The supersetting is more like a fatiguing principle." | Also for advanced athletes, off-season conditioning and beginners who do not tire | ORD-05 | `generator_spec_v1.json > rule_tables > supersets_contrast_circuits > use_cases` |
| Squeezing every muscle into a session that is too short | approved as proposed (RIGHT): never squeeze 2 to 4 exercises per muscle into a day that cannot hold them. His own words: "they should be able to get things done." | Say so up front, offer more time, train fewer groups directly, recommend supersets | R3-SES-02 | `generator_spec_v1.json > rule_tables > session_limits > time_vs_minimums` |

**In the data.** `generator_spec_v1.json > rule_tables > core_block`, `generator_spec_v1.json > rule_tables > axial_loading`, `generator_spec_v1.json > rule_tables > pairing > bootcamp_1_tue_fri`, `generator_spec_v1.json > rule_tables > ordering > hard`.

---

## Part 5. Equipment

### 5.1 Bands

**The rule now.** No bands anywhere: not as equipment, not as an exercise, not as a substitute.

**The idea that was rejected.** Bands on the equipment list, a bands-only home option, band exercises as swaps when a machine or a medball is missing.

**His words.**
- "The only exception is I don't do bands. I don't program anything with bands." (EQ-01)
- "I just never use bands. I don't work with anything with bands, so I don't really like bands. In my model, bands are not something that you're going to make changes to your body with." (EQ-02)
- "Yes, just no bands. I don't need any bands. Band chops are, to me, worthless." (EQ-07)
- "Yes, just no bands. I don't want any bands in the program." (EQ-08)

**Note.** His older sheets do contain band and chain notes, for example in the squat tab. His answers are newer than his sheets and win. The sheet content is kept as an archive and never used (**TEAM** handling).

**In the data.**
- `generator_spec_v1.json > rule_tables > equipment > no_variable_resistance`
- `generator_spec_v1.json > validation_checks > V9_bands`
- `generator_spec_v1.json > vocab > retired_ids` (the removed bands-only equipment option)
- `model/rules.json > equipment > banned_tokens`; `H01`; `LK06`

### 5.2 Chains, weight releasers and other variable resistance

**The rule now.** None in the model for now.

**The idea that was rejected.** Bands at about 50% and chains at about 70% on speed lifts, as written in his squat sheet.

**His words.** NOT RIGHT. "We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on." (EQ-12). And: "I don't really want to talk about variable resistance in any of this right now because it's so complicated." (EQ-01)

**Note.** This one is parked, not closed. Bands themselves are a firm no (5.1).

**In the data.** Same keys as 5.1.

### 5.3 Ranking machines

**The rule now.** Machines are not ranked. The model describes how much each one holds you in place, and the person picks what feels right.

**The idea that was rejected.** Ranking the hack squat last. The team took this from his squat sheet, where the hack squat row reads 'I PERSONALLY DON'T LIKE IT' (OBSERVED).

**His words.** NOT RIGHT. "No, my opinion on machines is that if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great." and "I don't want to rank them because they have different brands, angles, and things like that." (EQ-11)

**The one exception.** The V-squat machine is never used. The rule against it is one of the hard rules he confirmed (GEN-08). His squat sheet explains it: 'Always tight on lower back & knees, so I don't presercibe the use of these, ever.' (OBSERVED, MASTER MODEL workbook, ALL ABOUT SQUATS tab, cell I39).

**In the data.** `generator_spec_v1.json > rule_tables > equipment > machines_not_ranked`; `generator_spec_v1.json > validation_checks > V20_vsquat`; `LK02`.

### 5.4 Heavy medballs, and medballs for bodybuilders

**The rule now.** Medballs are light and fast. Nothing above 20 lb. No medball work in a physique plan's main workout.

**His words.** "No, I don't think there's any need for anything more than 20 lbs., to be honest." (EQ-06). "I don't really need any med ball throwing for aesthetics. If you're a bodybuilder, you don't need to do med ball throwing. That might be something for warming up, but it's not something in the main workout." (ATH-05)

**In the data.** `generator_spec_v1.json > rule_tables > athletic > medball`; `generator_spec_v1.json > validation_checks > V16_aesthetics`; `model/rules.json > medball > max_lb`; `H11`; `LK12`.

---

## Part 6. Athletes and special groups

| Rejected idea | His words | What the model does instead | Source |
|---|---|---|---|
| Olympic lifts only for intermediate and advanced athletes | "Those are still going to be there, so everyone gets Olympic lifts." and "Not just intermediate plus" | Beginners get dumbbell and kettlebell versions, hex-bar jumps and hang work; the full lifts come later | ATH-10 |
| Olympic lifts once a week | "Yeah, it doesn't need to be once a week. According to my programming, it could be done four times a week." | Up to 4 days; cleans on squat days, snatches on hinge days | R2-ATH-04 |
| Olympic lifts by percentage for everyone | "they don't necessarily need to go by percentage unless you're a competitive Olympic lifter." | Effort by feel and bar speed; explained as power output; a percentage only when the person has tested that lift | R2-GEN-06 |
| Cutting bench, pull-ups and arm work completely for boxers | "Yes, but don't completely cut it." | Lower the volume in heavy punching weeks, never to zero | ATH-04 |
| Youth never lifting from the floor | "Doesn't need to be like that. It could be some Olympic lift from the ground according to their program." | From the floor from about 14, after one block of hang work (R2-ATH-08) | ATH-09 |
| Jumps and Olympic lifts for older adults by default | "we're not going to need them to be doing any Olympic lifting, plyos, depth jumps, or anything like that, but it should be an additional option if they want to do it according to the coach." | Off by default from 60; can be switched on with his warning | R2-ATH-08, R3-ATH-02 |
| A 1-rep max test for someone who has not trained | "you should not go from not training to a one-rep max test. That should never be like that, or a one-mile run speed test." | A 5-rep or 3-rep max, or efforts at 80 to 90% | R2-PER-07 |
| Testing in the middle of a block | "they should not test during the weeks, during the block." | Before the block or in week 1, and at the end | R2-PER-07 |
| Reading "Justice League" as a real team | "This was just a marketing name that I gave a program that I designed" | A non-competitive athletic program with a plain name | ATH-13 |

**In the data.** `generator_spec_v1.json > rule_tables > athletic > olympic`, `generator_spec_v1.json > rule_tables > athletic > older`, `generator_spec_v1.json > rule_tables > athletic > strikers`, `generator_spec_v1.json > rule_tables > athletic > youth`, `generator_spec_v1.json > tests > never_from_zero`; `H12`, `H19`; `LK09`, `LK14`, `LK15`.

---

## Part 7. Packaged programs

**The rule now.** The model is built from his own categories and first principles. It is not built on a finished, named program.

**What he said.** His lineage is Dr. Pat Davidson, Dr. Mike Israetel and training science from first principles, and he is deliberately not building on packaged models such as 5/3/1, the Texas Method or Prilepin's chart. He is "building the segmentation and the buckets from the ground up." (COACH-CHAT). On plan structure: "I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it" (PER-01).

Details, and the two places where his sheets do borrow from others, are in [lineage](lineage.md), section 6.

---

## Part 8. Answers he changed himself

He refined several of his own answers as the model took shape. The newest answer is the rule. The older one is shown so nobody mistakes it for the current rule.

| Topic | Earlier | Later (the rule) |
|---|---|---|
| Learning from users | "This eventually will be something that learns from the data of all the people that use it" (VOL-01) | "I don't want any data kept." (R3-GEN-01) |
| Check-ins | Adjusting week to week from logged effort: RIGHT (GEN-05). An optional weekly check-in: RIGHT (R2-GEN-01). A step table read from the check-in: RIGHT (R2-VOL-01). | "I want to take away all check-in info." (R3-VOL-02) |
| The life cells in that step table (life was harder, life was better) | RIGHT, as part of the table (R2-VOL-01) | "There's no need to talk about sleep or stress or anything else." (R2-GEN-04); then the whole table went (R3-VOL-02) |
| The 8-week plan | "An 8-week program is a program that wants to modify you, so you have to start hard." (PER-01) | "No, the 8-week plan should gradually go up like steps up a stairway." (R2-PER-03) |
| The weekly step | An early conversation note recorded 3, 5 or 7% depending on muscle size (COACH-CHAT) | "It doesn't really go by muscle" (VOL-05); then about 3% and about 5% for everyone (R3-VOL-04) |
| Rear delts | Their own 4, 6 or 8 weekly sets: RIGHT (R2-VOL-04) | "I wouldn't categorize the rear delt as an individual muscle" (R3-VOL-01) |
| The deload | A deload when check-ins call for one, and week 1 of the next cycle as a deload: ticked RIGHT, but his words already said "It should never be thrown in the middle of a block." (R2-VOL-07) | "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01) |
| Plan lengths | Plans of 6, 8 or 12 weeks (COACH-CHAT) | "the 6-week plans are not necessarily needed"; 4 to 6 weeks is for maintenance and transitions (PER-01) |
| Older adults and jumps | Never depth jumps or snatches: RIGHT (EQ-03). Low ankle hops still fine: RIGHT (R2-ATH-08 proposal). | Off by default, "an additional option if they want to do it according to the coach" (R2-ATH-08); ankle hops also off by default (R3-ATH-02) |
| The licence | Apache for the code and CC BY for the model: RIGHT (R2-GEN-02) | "it should be MIT to me" (R3-GEN-01) |
| Week-by-week plans | "Just keep me in line, kind of thing, and then it does it by itself." (PER-01) | No check-ins (R3-VOL-02). The team retired week-by-week as a separate mode, because it ran on check-ins (**TEAM** reading; he has not confirmed it). |

More detail on every change between rounds: [changes across rounds](../03-coach-answers/changes-across-rounds.md).

---

## Part 9. Team proposals that fell with them (TEAM, not his words)

These were designed by the team. He never discussed most of them by name, though he had ticked a few as RIGHT inside larger proposals in rounds 1 and 2. They were removed because they depended on something he rejected, or because a later answer made them wrong. They are listed so nobody rebuilds them.

| Team proposal | Why it went | Depended on |
|---|---|---|
| A readiness score mixing effort, sessions done, performance and how life was going | needed check-ins and lifestyle inputs | R2-GEN-04, R3-VOL-02 |
| A slower step for people who report stress, short sleep or a hard job | lifestyle input | R2-GEN-04 |
| A week rated too easy adds 2 points to the step; a 10 removes a set; repeat the week under half the sessions | needed check-ins | R3-VOL-02 |
| An offer to stop the block after two bad weeks | needed check-ins | R3-VOL-02, R3-PER-01 |
| A separate answer for a failed set on the effort scale | needed check-ins | R3-VOL-02 |
| Plans kept on the phone with a backup code; accounts; an email field | nothing is kept | R3-GEN-01 |
| A step capped at 3% for people over 60 | every trained group should reach its ceiling in the last week; older adults are protected by exercise choice instead | R3-VOL-04, R3-ATH-02 |
| Priority muscles at +4 to +6 sets with every other muscle slowed down, as the way a person asks for more of one muscle | He had accepted these numbers earlier (VOL-02 PARTLY, R2-VOL-06 RIGHT). Round 3 replaced the intake path with Focus muscle 1 and 2 at one to three extra sets, others not slowed. The +4 to +6 push is not deleted: it stays in the spec as an optional coach setting, off by default (**TEAM** handling). | R3-SES-01 |
| A second calf exercise on leg days | calves are one exercise, 3 sets, per leg day | R3-SES-01 |
| Cutting exercises in a fixed order when a day runs long | replaced by his order: tell, offer, train fewer groups, supersets, keep climbing | R3-SES-02 |
| Contralateral loading as the default for everyone | he explained when each side is used; there is no global default | CAT-13 |
| Four client levels, with a level 4 for competitors | three levels by training experience; competition changes the profile, not the level | PRG-05, PRG-09 |
| Reading his sport ranking (ATH-02) as total jumps per sport | the ranking is read as fast, bouncy contacts, and the plyometric share is set by time on the ground; the weekly contact numbers inside each sport profile are still team numbers (**PROPOSED**) | ATH-01, R2-ATH-01 |

**In the data.** `generator_spec_v1.json > rule_tables > rate_engine > retired`, `generator_spec_v1.json > adaptation > retired_items`, `generator_spec_v1.json > rule_tables > learning > retired`, `generator_spec_v1.json > rule_tables > rate_engine > limits` (the retired 60+ cap), `generator_spec_v1.json > rule_tables > priority > v1_2_focus_muscles`. The full list is in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), section 0c.4.

---

## Part 10. Parked or optional, not rejected

He left the door open on these. Some are not in the model at all. Some are in it only as an option or as a team sketch. Do not treat them as rejected, and do not build them out further without asking him.

| Item | His words | Where it stands today | Source |
|---|---|---|---|
| Variable resistance (chains, weight releasers) | "We will work with that later on." | Not in the model. Bands stay a firm no (5.1). | EQ-12 |
| A pro setting above 30 weekly sets for one muscle | "Maybe we can add a pro level where some muscles can grow out of that if the person is really adamant about growing that muscle" | Sketched in the spec as a coach opt-in; its numbers are **PROPOSED**. | R2-VOL-06 |
| Programming for competitive Olympic weightlifters | "now the program needs to change to Olympic weightlifting programming, which is completely different but kind of the same on here" | Not in the model. Olympic lifts are a tool for power here. | R2-GEN-06 |
| His own exercise video library | "We haven't built our video library." | Not built. Videos are optional. | R2-GEN-02 |
| Heavy, low-rep single-leg work | "it can be something that we can add if the athlete feels like they need that." | Single-leg lifts stay at 8 to 12 reps per side by default. A heavy option is sketched in the spec (**PROPOSED**). | UNI-04 |
| A/B weeks for people who want variety | "sometimes athletes and people want more variety, and that'll give them more variety." | In the model as an option for people who ask for variety. Off otherwise. | PER-03 |
| Carries, drags and sling systems | approved to build out (RIGHT, no words of his own) | His library columns for them are empty. The starter lists in the model are the team's (**PROPOSED**). | LIB-19 |
| Coaches adding their own rules | "and options for a coach to add their own rules if they want" | Asked for by him. The format of a coach rule file is the team's (**PROPOSED**). | GEN-08 |

**In the data.** `generator_spec_v1.json > rule_tables > weekly_sets > landmarks_coach > pro_setting`, `generator_spec_v1.json > rule_tables > reps > unilateral`, `generator_spec_v1.json > rule_tables > set_placement > block_rule` (A/B weeks), `generator_spec_v1.json > rule_tables > library_decisions > build_out`, `generator_spec_v1.json > coach_rule_hooks`.

---

## Part 11. Where the rejections are enforced

| Rejection | Hard rule | Locked rule | Spec check or key |
|---|---|---|---|
| No bands, chains or weight releasers | `H01` | `LK06` | `generator_spec_v1.json > validation_checks > V9_bands` |
| Never to failure on heavy compound lifts | `H02` | `LK01` | `generator_spec_v1.json > validation_checks > V17_effort` |
| Core first; the generator never leaves it out | `H05` | `LK05` | `generator_spec_v1.json > validation_checks > V12_order` |
| Hip dominant with a push, knee dominant with a pull | `H06` | | `generator_spec_v1.json > validation_checks > V11_pairing` |
| One heavy squat day and one heavy deadlift day | `H07` | `LK11` | `generator_spec_v1.json > validation_checks > V10_spine` |
| Helpers a quarter set; athletic work counts for no muscle | `H08`, `H09` | `LK07` | `generator_spec_v1.json > validation_checks > V14_counting` |
| Step never above 7%; total rise below 10% | `H10` | `LK08` | `generator_spec_v1.json > validation_checks > V15_step` |
| Medball limits | `H11` | `LK12` | `generator_spec_v1.json > validation_checks > V16_aesthetics` |
| Older-adult defaults | `H12` | `LK09`, `LK15` | `generator_spec_v1.json > validation_checks > V5_older` |
| No sex or gender field | `H13` | `LK10` | `generator_spec_v1.json > inputs_schema > removed_fields` |
| No deload or maintenance week inside a block | `H15` | `LK13` | `generator_spec_v1.json > validation_checks > V24_block_structure` |
| No sleep, stress, job or life input | `H16` | `LK16` | `generator_spec_v1.json > validation_checks > V26_inputs` |
| Floor of 10 sets per trained group | `H17` | | `generator_spec_v1.json > validation_checks > V22_floor` |
| 2 to 4 exercises per group, never 1 | `H18` | | `generator_spec_v1.json > validation_checks > V23_exercises_per_group` |
| Tests only at the start and end; never a true max from zero | `H19` | `LK14` | `generator_spec_v1.json > validation_checks > V25_tests` |
| The stairway always climbs | `H21` | | `generator_spec_v1.json > validation_checks > V29_stairway_climbs` |
| Built once; no input changes the plan afterwards | `H22` | `LK18` | `generator_spec_v1.json > rule_tables > rate_engine > no_feedback` |
| No data kept | | | `generator_spec_v1.json > validation_checks > V27_no_data_kept` |
| No V-squat | | `LK02` | `generator_spec_v1.json > validation_checks > V20_vsquat` |

The plan engine is being rebuilt, so the hard-rule and locked-rule ids may be renumbered. The coach's answers do not change with the code. The same list of retired ideas is kept for reviewers in [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md) and for agents in [AGENTS.md](../../AGENTS.md), section 13.

## If you are about to add something

| You want to add | Check first |
|---|---|
| A new question on the form | Is there a coach answer behind it? If it is about sleep, stress, work, life or sex, the answer is no (Part 1). |
| Any kind of feedback, log or score that changes the plan | No (1.1). People adjust the plan themselves. |
| Storage, accounts, analytics | No (1.2). |
| A band exercise or a band substitute | No (5.1). |
| An easy week inside a block | No (2.3). |
| A rule that differs for big and small muscles in the weekly step | No (2.1). |
| A published program as a template | No (Part 7). |
| Something from Part 10, or more of it than the model has today | Ask him first. |
| Something not on this page | Mark it **PROPOSED**, write down the evidence, and put it to him as a question. See [CONTRIBUTING.md](../../CONTRIBUTING.md), section 5. |

More: [decision records](../04-decisions/index.md), [his answers by topic](../03-coach-answers/index.md), [the master document](../../BLAZE_CAMP_BRAIN.md).
