# Context for AI agents: the Blaze Camp model in one file

This file is a self-contained briefing for an AI agent on the training model of Coach Lalo (Gerardo Vera, Blaze Camp). It covers the purpose, the authority order, the categories, the dosing and session rules with their numbers, athletes, plan types, product decisions, what is retired, where each thing lives, and how to stay faithful to the coach. Every rule gives the id of the answer where he decided it. Anything he has not confirmed is marked **PROPOSED** (the team's suggestion) or **INFERRED** (the team's reading of his words or sheets). This is model v1.3: it includes his round-4 answers and the two clarifications of 2026-10-10. Engine 0.5 builds plans from it. He has not graded the sample plans yet. For more depth, follow the [docs map](README.md).

> General fitness information, not medical advice. Use at your own risk. Anyone who uses this with clients needs their own health screening, liability release and insurance. See [DISCLAIMER.md](../DISCLAIMER.md).

## 1. Purpose

**The rule.** A few answers go in. The whole plan comes out once, with every week visible. It is a complete, editable template: people adjust it themselves. There are no check-ins, no tracking and no data kept (R3-VOL-02, R3-VOL-04, R3-GEN-01, CX-04).

**Why.** "I want them to be able to kick out a program, and that's it." "It's already a template, and you need to adjust it as you need to." (R3-VOL-04) "It should be all editable as they need to." (CX-04)

**What it is for.** His programming system, captured so that clients, coaches and gyms can use it and developers and AI agents can build on it. It is "a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera. Master NASM coach", and his intellectual property (R4-REL-03). It is free under the MIT license (R3-GEN-01). He builds from first principles, with Dr. Pat Davidson and Dr. Mike Israetel as his named sources, and not on packaged programs such as 5/3/1 (conversation). Make no "world's best" or injury-prevention claims (R4-REL-03).

**State.** No website exists yet, by design. The engine was rebuilt as version 0.5: template-first, with no time-fitting ([ADR-058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md)). Its measured results and known gaps are in [samples/STATUS_v0.5.md](../samples/STATUS_v0.5.md). Version numbers move: read `model/MODEL_VERSION` and `engine/version.mjs`.

## 2. Who decides: authority order and labels

When two sources disagree, the higher one wins.

| Rank | Source | Cited as |
|---|---|---|
| 1 | `coach_answers_round4.md` (20 answers, 2026-10-11) and `coach_answers_time_2026-10-10.md` | `R4-...`, `CT-01` |
| 2 | `coach_answers_codex_2026-10-10.md`, only the subjects answered there | `CX-01..04` |
| 3 | `coach_answers_round3.md` (13 answers) | `R3-...` |
| 4 | `coach_answers_round2.md` (45 answers) | `R2-...` |
| 5 | `coach_answers_full.md` (140 answers) | no prefix: `CAT-01`, `VOL-09`, `ORD-06` and so on |
| 6 | `coach_chat_statements.md`, `coach_answers.md` | "conversation" |
| 7 | His two Google Sheets (`raw/`, `dumps/`) | OBSERVED |
| 8 | Team work | INFERRED, SCIENCE, PROPOSED |

- CT-01 supersedes earlier answers only on fitting plans to a session length. Round 4 and CX supersede earlier answers only on the subjects they answer. Everything else he said still stands.
- RIGHT with no words means he approved the team's proposal as his rule. The wording is the team's.
- Text that contradicts a coach answer is a bug. A coach answer you think is scientifically weak is not a bug: report it "for discussion with the coach" and leave the rule alone.
- SCIENCE fills gaps. It never overrules him.

## 3. Categories

**The rule.** Every exercise is tagged on all lenses at once, not filed in one box (CAT-01). **Why.** "The hardest thing to understand is the categorization of everything" (conversation). Biomechanics describes every exercise. It is not a bucket of its own (CAT-03).

| Lens | Values |
|---|---|
| Family | Athletic patterns (AP), resistance patterns (RP), control or core (CT thorax, CP pelvis, both), cardio, functional (carries, drags) |
| Pattern | Knee dominant, hip dominant, leg flexion; horizontal, mid-range and vertical push; horizontal, mid-range and vertical pull. Athletic: triple extension (Olympic lifts), plyos, throwing, change of direction, speed. |
| Laterality | Bilateral (both sides together), unilateral (one side at a time), alternating |
| Plane | Sagittal, frontal, transverse |
| Muscle size | Big: quads, glutes, hamstrings, back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs (CAT-02) |
| Equipment | The implement, plus a constraint level from 1 (bodyweight, jumps) to 5 (seated machine with a back pad) (EQ-13) |
| Level | Foundational, intermediate, advanced |

- **The family sets the counting unit.** Resistance work counts as sets per muscle. Athletic work counts as contacts, throws, reps or metres, never as muscle sets (VOL-10). Carries and sled work count by distance or time and give no muscle sets (R4-LIB-02).
- **Mid-range.** A mid-range lift moves at an angle between horizontal and vertical. Mid-range push (incline, landmine) is in his sheets (OBSERVED). Mid-range pull (high row, 45-degree row, the face-pull angle) was added in round 4 (R4-LIB-03).
- **Focus groups.** A **focus group** is the unit sets are counted on: quads, hips (glutes + hamstrings), back, chest, shoulders (front, side and rear delts), biceps, triceps, calves, core (R3-SES-01). Rear delts are part of shoulders: "I wouldn't categorize the rear delt as an individual muscle" (R3-VOL-01).
- **Exercise level** comes from skill, stability and where the load sits. In front or low is foundational. On the body is intermediate. Behind or overhead is advanced. A seat, machine or cable makes it easier (CAT-04, R2-LIB-02). Levels are soft: "The levels are still very theoretical" (CAT-05).
- **Client level** is separate (CAT-06). Level 1: under about a year of consistent training, or back after 6 to 12 months off. Level 2: over a year (PRG-05). Level 3 is PROPOSED: 3+ years and 4+ days a week now, or a competitive physique or strength athlete.
- **Davidson zones** are tags for rotation bias, not levels. Keep both biases in every week (R2-LIB-02, R2-LIB-03).
- **His library is the source of truth.** Each slot gets a default pick and swaps from the same category (GEN-04). A swap says in one line what it keeps and what it loses (R4-LIB-04). The tool may change one detail of a library exercise between blocks. It never invents an exercise (R2-LIB-01). The source catalog holds 939 records, 732 active.
- **Optional add-ons.** The exercises the team proposed (carries, sled work, wall balls, sandbag lunges, burpee broad jumps, split-step drills, swimmer shoulder work, tibialis and soleus raises) are live as options only: "they can be chosen and added, but not primary ones that the program is going to throw at you as part of the template" (R4-LIB-01). Exceptions: wall balls and sled pushes may be primary in HYROX, "maybe in the CrossFit program". Neck work stays PROPOSED and is not shown. A new exercise from a contributor still starts as PROPOSED.

## 4. Dosing rules

### 4.1 Counting

A **hard set** is a working set of 5 to 30 reps that ends with 1 to 3 **reps in reserve (RIR)**, meaning 1 to 3 more reps were possible (VOL-13). Volume is weekly hard sets per focus group.

| What | Credit | Source |
|---|---|---|
| Main mover | 1.0 set | VOL-09 |
| Each helper muscle | 0.25 ("not a 0.5") | VOL-09 |
| Glutes on squats, lunges, deadlifts, RDLs | 0.25 | R2-VOL-05 |
| Glutes on hip thrusts and bridges | 1.0 | R2-VOL-05 |
| Dips | triceps 0.5 + chest 0.5 | LIB-16 |
| Thruster | quads 1.0 + shoulders 0.5 + glutes 0.25 | LIB-14, R2-VOL-05 |
| Jumps, throws, Olympic lifts, sprints, change of direction, kettlebell swings, HYROX station circuits, carries, sled work | 0 | VOL-10, R2-VOL-05, R3-ATH-03, R4-LIB-02 |
| A set written 10/10 (10 reps each side) | 1 set | UNI-01 |
| Warm-up | never counts | ORD-08 |

PROPOSED: a set counts at most once toward a group such as hips or shoulders. PROPOSED: an incline press of 30 to 45 degrees counts for chest; a high-incline press counts 1 set for front delts and half a set for chest.

### 4.2 Weekly sets by client level

| | Level 1 | Level 2 | Level 3 | Source |
|---|---|---|---|---|
| Start, big muscles | 10 | 15 | 20 | VOL-01 gave ranges (10-12, 15-20, 20+). The 20 is PROPOSED. |
| Start, shoulders, biceps, triceps | 10 | 12 | 15 | R2-VOL-04 (8 / 12 / 15); the floor lifts level 1 to 10 (R2-VOL-06) |
| Top number in one block | 14 | 22 | 25 | R2-VOL-06; applied to small groups INFERRED |
| Top number of a Focus muscle | 18 | 26-28 | 30 | R2-VOL-06 (his priority-muscle ceilings; used for Focus muscles INFERRED) |

- **Floor, with 3 or more training days.** Every group a training block trains directly gets at least 10 sets a week: "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). It is counted on the group (R3-VOL-01, R3-SES-01). Exempting maintenance, pre-season, in-season and pain-cut groups is INFERRED.
- **The 2-day rule.** With 2 training days a week every big muscle is still trained, with about 6 to 8 weekly sets instead of 10. The plan says so and suggests a third day. Never drop whole muscles, never pile on more exercises (R4-SES-03). Small groups taking the same 6 to 8 is PROPOSED.
- **Calves:** one exercise × 3 sets every leg day (VOL-17, R3-SES-01). **Core opener:** 2 exercises × 2 sets every session (R2-SES-03).
- **Focus muscle 1 and 2.** A person may pick up to two. Each gets 1 to 3 extra sets a week (R3-SES-01). The default of +2 is PROPOSED.
- **Pain.** Cut that muscle or pattern 30 to 50 %, move it to machines or split grips, or drop the exercise (VOL-03). The person applies it. Severe pain stopping the build is PROPOSED.
- **Goal and phase factors** (for example 0.8 for general fitness) are PROPOSED. Confirmed: pre-season is about 60 % of off-season sets (R2-PER-06), and maintenance is 50 to 70 % (PER-01).
- "this is all customizable" (R2-VOL-06). The numbers are defaults. The hard rules are not.

### 4.3 The stairway and progression

**The rule.** Every plan climbs: "It should be like steps up a stairway" (R2-PER-03). The whole stairway is computed when the plan is built. Nothing adapts afterwards. People can edit it, including the sets of any day or week (CX-02, CX-04).

| Subject | Rule | Source |
|---|---|---|
| Usual weekly step | About 3 % until the halfway week, about 5 % after. This is the usual pattern, not a limit. | R3-VOL-04, CX-01 |
| Where it ends | Each trained group reaches its planned final sets. Steps may be bigger when the target needs it. | CX-01 |
| When the top arrives | In the last week when the math allows. One week early is fine. Never earlier. | R4-PRG-01 |
| A big step | No hard limit. A week that adds more than about 15 % carries a clear note. | R4-PRG-02 |
| Same sets, still progress | A week may keep its sets while reps or load progress, also at the top number. | CX-02, CX-03 |
| Reps and load | Written as a rule the person applies: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Never a promised number per week. | R4-PRG-03 |
| Whole sets | Fractions are banked and added as a whole set (VOL-06). | VOL-06 |
| How it feels | Week 1 like a 2, the last week like an 11. | R2-PER-05 |
| Effort | 3 RIR early, then 2, then 1-2, then 1 plus intensifiers in the last week. | R3-VOL-04 |
| Easy week inside a block | None. | R2-VOL-07 |
| Next block | Starts about 5 % above where the last block started, in whole sets, never above the level's top. At the top, sets stay and load and reps progress. | R4-PRG-04, CX-03 |

Approved example: a level 2 big muscle goes 15 to 22 sets in 12 weeks, with the last four weeks at 19, 20, 21, 22 (R3-VOL-04). **Retired as limits:** "no weekly step above 7 %" (R2-VOL-01) and "under 10 % in total" (UNI-05). PROPOSED details: one single added set is never flagged; the next block is at least one whole set higher while below the top; pain keeps slow steps.

### 4.4 Where a set goes

- To the first exercise for that muscle, then the second: "I'm adding sets to the things that matter most" (VOL-07). So 2/2/2 becomes 3/2/2, then 3/3/2.
- When a day type runs twice a week, the new set alternates between the two days (R3-VOL-03).
- Extra small-muscle sets become a short bonus exercise on the optional day, or on a day that already trains that muscle (R3-VOL-03).
- Default sets: 3 on compound lifts, 2 on isolation (VOL-16). PROPOSED: an exercise holds 2 to 5 sets, 2 to 4 for a beginner.
- When a template's slots cannot hold a group's planned sets and there is no optional day, the group is capped at what the slots hold and the plan says so. Nothing else is shrunk to make room (R4-SES-04).

### 4.5 Reps, effort, rest

- Reps: 5 to 30. Small muscles 12 to 30. Big muscles 5 to 15, mixed (VOL-11). Unilateral lifts 8 to 12 per side (UNI-04).
- Effort is given in reps in reserve: "I like RIR in my model" (VOL-13). Never to failure on heavy compound lifts (GEN-08). MAX (technical failure) only on small-muscle or bodyweight work (VOL-13). Myo sets only on the last exercise, machine or isolation (VOL-15).
- Rest: 1 to 2 minutes for hypertrophy, 3 to 6 for strength (VOL-14).
- Carries and sled work: 2 to 4 trips of 20 to 40 metres, or 20 to 40 seconds (R4-LIB-02).

## 5. Session rules

| # | Rule | Source |
|---|---|---|
| 1 | Warm-up always. Then the core opener: "we need all the core work to be done first". The person may move it or switch it off. | ORD-08, ATH-11, R3-SES-02 |
| 2 | Power before strength: jumps, throws and Olympic lifts come before heavy lifting. | ORD-03 |
| 3 | Horizontal before vertical: row before pulldown, horizontal push before vertical push. The main lift ("the work") still goes first. | ORD-01, ORD-02, conversation |
| 4 | Pair hip dominant with a push and knee dominant with a pull. | UNI-11, ORD-06 |
| 5 | One heavy squat day and one heavy deadlift day a week, never the same day: "I would rather just load it once per week and load it correctly". | PER-04, R2-SES-01, R2-SES-02 |
| 6 | **His templates are the skeleton.** Do not invent day layouts. A full-body day is his A day or B day, about 6 exercises, up to 8. Push / pull / legs is his other main layout. | R4-SES-05 |
| 7 | **A session is sized by exercise count**, not counting the warm-up or the 2 core exercises: general fitness and fat loss 5-7; aesthetics 6-8; strength 5-6; bootcamp 5-7 stations; field athletes off-season up to 12; older adults 60+ 5-6. Recommendations: people add or remove. | R4-SES-02, VOL-08, R2-SES-04 |
| 8 | **No time-fitting.** Session length is not asked and limits nothing. Each day prints an average time as information only. | CT-01, R4-SES-01 |
| 9 | **Nothing is dropped automatically.** The template comes out complete. The person picks what to take away; the plan only names what is easiest to remove. | R4-SES-04 |
| 10 | Same exercises for a 4-to-6-week block. Then change one or two small variables. | PER-02 |

**The A / B days** (R4-SES-05). Default week for 4 days: A, B, rest, A, B.

| Slot | Day A: pull + knee dominant | Day B: push + hip dominant |
|---|---|---|
| 1 | Horizontal pull, two arms | Horizontal push |
| 2 | Two-leg knee-dominant lift (a squat) | Two-leg hip-dominant lift (deadlift, hip extension, hip thrust) |
| 3 | Vertical pull | Vertical push, or an incline press |
| 4 | Single-leg knee-dominant lift (a lunge) | Single-leg hip-dominant lift |
| 5 | Biceps | Triceps |
| 6 | Leg extension | Leg curl |

"The template is usually 6 exercises for the full-body days because we do that A-day/B-day of upper/lower." (R4-SES-05) Slots 7 and 8 are a small-muscle or core exercise. On these days a group can have one exercise (biceps, triceps). "2 to 4 exercises per group, never 1" (R2-SES-05) is kept for split days (INFERRED). Athletic days put the athletic block first, then the same lifts.

**Incline first.** For bodybuilders and the general population, prefer an incline press over an overhead press in the vertical or mid-range push slot. Overhead stays as a variation (R4-LIB-03).

**Supersets** (two exercises back to back) are a recommendation to save time and a tool to add fatigue (ORD-05, R3-SES-02). No session length triggers them.

**Editing.** People can switch off a day's athletic block or core block, add or remove exercises or blocks, swap inside a category, and change the sets of any day or week (R3-SES-02, GEN-04, CX-02, CX-04). After an edit the totals are recounted and the plan is marked as edited; the checks that judged the generated layout no longer vouch for it. Screen design is PROPOSED and not built.

**Bilateral and unilateral.** The share runs from 90/10 to 10/90. Unilateral work is "for health and keeping rotational foundations", bilateral "for driving and creating forces" (UNI-02). Bodybuilders and powerlifters start near 50/50 and end 80/20 or 90/10 bilateral. Field athletes stay 80 to 90 % unilateral, and bilateral work is minimal in season (UNI-02, UNI-10). Most per-sport numbers are PROPOSED. Open for the coach: his A / B template fixes a two-leg lift in slot 2, which gives athletes less single-leg work than that share.

**Equipment.** No bands, chains or weight releasers: "I don't do bands" (EQ-01, EQ-12). Machines are not ranked (EQ-11). Older, injured and high-volume clients get more machines (EQ-03). Medballs stay light: 8 to 10 lb for passes, never over 20 lb (conversation, EQ-06).

## 6. Athletes and active people

**Who gets athletic work.** Competitive athletes (sport, position, season), people who "stay athletic and active" (pickleball, HYROX, rec leagues, running), and people who just want to be athletic. Muscle and strength goals get no athletic block (OBSERVED). The data holds 52 sports, 26 activities and 127 profiles.

**How sure each profile is** (R4-SCP-03). Every profile carries a label in the data and docs, never on the plan: `confirmed_by_coach` (23), `similar_sport` (67), `proposed` (37). Never upgrade a label because the numbers look right.

| Topic | Rule | Source |
|---|---|---|
| Plyometric or ballistic | **Plyometric** means short, bouncy ground contacts. **Ballistic** means a longer contact or one big effort. The less time a sport spends on the ground, the more plyometric work. | ATH-01 |
| Plyometric share at the end of a block | 75 % sprinters, runners. 60 % volleyball, soccer, football skill positions. 50 % basketball, tennis, pickleball, HYROX, weekend warriors. 40 % baseball, softball, hockey, linemen, MMA. 25 % boxing, karate, wrestling, BJJ, golf, swimming, rowing. Each block starts 15 points more ballistic. | R2-ATH-01, R3-ATH-04 |
| Receive-Create stages | Learn to receive force before creating it. Stage 1 Land, 2 Land & Go, 3 Repeat. In 12 weeks: weeks 1-3, 4-7, 8-12. In 8 weeks: 1-2, 3-5, 6-8. | CAT-10, R2-ATH-03 |
| Olympic lifts | Everyone in athletic training. Beginners use dumbbell, kettlebell, hex-bar and hang versions. Up to 4 days a week. In season a light piece. | ATH-10, R2-ATH-04 |
| Cardio sessions a week | General and fat loss 3. Physique 4. Athletes in season 2, pre-season 2, off-season 2 to 4 by sport. Swimmers, runners, rowers and endurance cyclists 0 extra. Always adjustable. | ATH-07, R2-ATH-06, R2-SES-06, R3-ATH-04 |
| Season | Off-season: most volume. Pre-season: 4 to 6 weeks at about 60 %, then a 1-to-2-week taper. In season: 2 days, low volume. Game-heavy sports in season: gym plyos about half, hard gym day at least 48 hours before a game. | PER-08, R2-PER-06, R2-ATH-07 |
| Swimming dryland | 3 gym days + 1 optional. No extra cardio. 25 % plyometric. Olympic lifts 2 to 3 days. Shoulder care every session, never bands. 2-week taper before the main meet. | R3-ATH-01 |
| HYROX | 2 strength days + 2 hybrid days, 4 cardio sessions, 2 station circuits as finishers that count for no muscle. Wall ball never over 20 lb. Wall balls and sled pushes may be primary picks here. | R3-ATH-03, R4-LIB-01 |
| Stay athletic and active | The hardest gym day stays 48 hours before the biggest play day. A long session of the activity counts as cardio. An event date ends the hardest weeks 1 week before it. | R3-ATH-05 |
| From age 60 | 5 to 6 exercises a session. On: landing drills, balance, quick stepping, light throws, fast machine work. Off unless switched on with his warning: hops, jumps, Olympic lifts, depth jumps. Never: overhead and low-bar squats. | R4-SES-02, R2-ATH-08, R3-ATH-02, EQ-03 |
| Racket players from 50 | Knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, low-impact jumps only. | R3-ATH-02 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work. | R2-ATH-08 |

## 7. Plan types, calendar and tests

| Plan | Rule | Source |
|---|---|---|
| 12-week block | His preferred plan. One stairway, hardest weeks last. | PER-01, R2-PER-04 |
| 8-week block | The same stairway, shorter. | R2-PER-03 |
| Maintenance | 50 to 70 % of the volume. The person picks the length. | PER-01, R2-PER-06 |
| Year | General population only. Q1 cut with more cardio, Q2 summer shape, Q3 maintain at about 70 %, Q4 build, late December maintenance. | R2-PER-01 |
| Season | Athletes follow their season (section 6). | PER-08, R2-GEN-05 |
| Event prep | A fight or meet uses 2-week steps and waves. | PER-10 |

- **No easy week inside a block.** "It should never be thrown in the middle of a block" (R2-VOL-07). If a block cannot be finished, stop it, do maintenance, then start a new block.
- **After a block** an easy week at about half the sets is an extra week and only a recommendation: "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01). When a block ends, it ends, and the person builds the next one (section 4.3, "Next block").
- **Tests** are optional. They happen before or at the start, and at the end. Never during the block. Never a 1-rep max or all-out mile from zero: use a 5-rep or 3-rep max and efforts at 80 to 90 % (R2-PER-07).

## 8. Product decisions

| Decision | Source |
|---|---|
| Inputs: goal, sport or activity, training experience, age, body weight, days, equipment, pain, optional Focus muscles. **Not asked: session length.** Nothing is asked after the build. | GEN-02, R4-SES-01, R3-VOL-04 |
| No sex field and no rules by sex: "mainly by age, foundation, goal, and injuries". No sleep, stress, job or lifestyle questions: "I just need the workouts here". | GEN-02, ATH-09, R2-GEN-04 |
| No data kept: "I don't want any data kept". The team reads this as no accounts, no stored answers, no email. | R3-GEN-01 |
| **The liability gate.** Everyone may use the plans on their own. The terms and the release of liability must be accepted before a plan is generated: "they need to click it before the plan shows". Every plan prints a short release line, in English and Spanish, linking the disclaimer. | R4-SCP-01, R4-SCP-02 |
| A short health check for clients, which a coach may skip with a warning. Open for the coach: whether a flagged answer should still stop a plan now that "everyone" may use it. Today it does. | R2-GEN-03, R3-GEN-01, R4-SCP-01 |
| English first, with a full Spanish switch. Pounds or kilograms. | GEN-01, R2-GEN-08 |
| A simple phone-friendly website, not an app. Not built yet. | GEN-03, R2-GEN-02 |
| Videos: no third-party links in the public data. Each exercise has a YouTube search link built from its name, and the plan shows the exact name to copy. His own videos can be added later. | R2-GEN-02, R4-LIB-05 |
| MIT license to Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. Disclaimers in English and Spanish. They are drafts until a Florida attorney reviews them. | R3-GEN-01 |
| Model v1.3 is released as the finished model, with the engine in the same repo. | R4-REL-01, R4-REL-02 |
| Coaches may add their own rules. The layer mechanism is PROPOSED. | GEN-08 |

## 9. Retired: never rebuild

| Retired | Replaced by | Source |
|---|---|---|
| Session length as an input; the time check; time offers; cutting, moving or dropping anything for minutes; exercise caps by minutes; the 100 % / 110 % day-length rules | Sessions sized by exercise count; time printed as an estimate | CT-01, R4-SES-01, R4-SES-02 |
| The order "tell them, offer more time, train fewer muscles directly, superset, keep climbing" | The 2-day rule; nothing dropped automatically | CT-01, R4-SES-03, R4-SES-04 (it was R3-SES-02) |
| Day layouts invented by the engine; full-body days built from "2 to 4 exercises for every muscle" | His A / B and push / pull / legs templates, slot for slot | R4-SES-05 |
| Hard limits on a weekly step (7 % a group, under 10 % in total); "sets must rise every week"; a promised number of reps or load per week | Final sets reached; a note above about 15 %; flat weeks allowed; a rule the person applies | CX-01..03, R4-PRG-01..03 |
| Editing limited to swaps and block switches | Everything editable, including sets by day or week | CX-02, CX-04 |
| Proposed exercises as template picks; carries counted in reps or as muscle sets | Optional add-ons; carries by distance or time | R4-LIB-01, R4-LIB-02 |
| Third-party video links in the public data | A search link and a name to copy | R4-LIB-05 |
| An optional own-risk tick | Required acceptance before any plan | R4-SCP-02 |
| The large two-stage optimizer planner | Engine 0.5, template-first | team, [ADR-058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) |
| Check-ins, logbooks, plans that adapt from feedback, `adapt()`, a week-by-week mode | The whole plan built once | R3-VOL-02, R3-VOL-04 |
| Accounts, stored data, learning from users | Nothing kept | R3-GEN-01 |
| A sex field; sleep, stress or job questions | Workouts only | GEN-02, R2-GEN-04 |
| Helper credit 0.5; kettlebell swings as glute sets | 0.25; no muscle credit | VOL-09, R2-VOL-05 |
| Rear delts with their own sets and floor | Part of shoulders | R3-VOL-01 |
| A weekly step by muscle size (3 / 5 / 7 %), or from the person's week | One planned stairway | VOL-05, R3-VOL-04 |
| A deload inside a block; a mandatory easy week; "start hard" plans | The stairway; rest between blocks, recommended | R2-VOL-07, R2-PER-03, R3-PER-01 |
| Fewer than 10 sets on a trained group when there are 3 or more training days | Floor of 10 (2 days: about 6 to 8) | R2-VOL-06, R4-SES-03 |
| Priority push of +4 to +6 sets as the default | Focus muscles, +1 to +3 | R3-SES-01 |
| Bands, chains, weight releasers; a ranking of machines | None; no ranking | EQ-01, EQ-12, EQ-11 |
| Core after the power block; leg curls as hip dominant; zone number as level | Core first; leg flexion; zones as tags | ATH-11, CAT-09, R2-LIB-02 |
| A 1-rep max or all-out mile from zero | 5-rep or 3-rep max, 80 to 90 % | R2-PER-07 |

Old keys for some of these may remain in the spec as retired notes, such as `adaptation` and `rule_tables > learning`. Do not build on them. Full lists: [what he rejected](01-philosophy/what-he-rejected.md), [parameters](05-reference/parameters.md) §22, [decision records](04-decisions/index.md).

## 10. Where each thing lives

Spec keys are in [generator_spec_v1.json](../generator_spec_v1.json). Keys written `rules: ...` are in `model/rules.json`, the compiled rules that engine 0.5 reads. For every CT, CX and round-4 answer, [coverage_matrix_round4.md](../coverage_matrix_round4.md) gives the master-document section and the spec key.

| Thing | Data | Explained in |
|---|---|---|
| His words | `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_chat_statements.md` | [answers by topic](03-coach-answers/index.md) |
| Master document | [BLAZE_CAMP_BRAIN.md](../BLAZE_CAMP_BRAIN.md) | this folder |
| Categories and exercises | `synthesis/01_taxonomy.json`; `synthesis/02_exercise_catalog.json` | [categories](02-model/categories.md), [exercise library](02-model/exercise-library.md) |
| Optional add-ons, carries, mid-range, incline first, swap notes, video links | `rules: selection.addons`, `conditioning.carry`, `selection.mid_range`, `selection.incline_first`, `selection.swap_notes`, `render.video` | [exercise library](02-model/exercise-library.md) |
| Levels | `vocab > levels`; `rule_tables > levels_exercise` | [levels and zones](02-model/levels-and-zones.md) |
| Counting, starts, top numbers, floor, Focus, pain | `rule_tables > counting`, `weekly_sets`, `priority`, `pain`; `rules: volume.floor`, `volume.two_day` | [volume](02-model/volume.md) |
| Stairway, progression, set placement | `rule_tables > rate_engine`, `banking`, `set_placement`; `rules: stairway.progression`, `cycles.next_block`, `placement`, `render.progression` | [stairway](02-model/stairway.md) |
| Session rules, session size, templates | `rule_tables > ordering`, `pairing`, `axial_loading`, `session_limits`; `rules: session.size`, `session.full_body_days`, `session.easy_to_remove`; `synthesis/05_templates.json`; `model/templates.json` | [sessions](02-model/sessions.md) |
| The time estimate (information only) | `rules: time_model` (`use: estimate_only`), `render.estimate` | [sessions](02-model/sessions.md) |
| Bilateral share; equipment | `rule_tables > bilateral_unilateral`, `equipment` | [bilateral and unilateral](02-model/bilateral-unilateral.md), [equipment](02-model/equipment.md) |
| Athletes, sports, activities, profile labels | `rule_tables > athletic`, `conditioning`; `synthesis/04_profiles.json`; `model/profiles.json > sports[id].confidence` | [athletes](02-model/athletes.md), [sports](02-model/sports.md) |
| Plans and tests | `plan_types`; `tests` | [plans and calendar](02-model/plans-and-calendar.md), [testing](02-model/testing.md) |
| Intake, editing, legal, checks | `inputs_schema`, `plan_editing`, `legal_and_privacy`, `validation_checks`; `rules: legal.gate`, `legal.release_line`; `engine/edit.mjs` | [data dictionary](05-reference/data-dictionary.md) |
| Every number with its status | | [parameters](05-reference/parameters.md) |
| Why each rule exists | | [decision records](04-decisions/index.md) |
| Working rules for the repo, hard rules | | [AGENTS.md](../AGENTS.md) |

`model/` is a compiled copy for the engine. It is generated, never edited by hand. When it differs from a coach answer, the coach answer wins.

## 11. How to stay faithful to the coach

1. **Find the answer first.** Before you state or change a rule, find the answer id that owns it. If there is none, your statement is PROPOSED.
2. **The newest relevant answer wins.** Read round 4, CT-01 and the CX clarification first, then [changes across rounds](03-coach-answers/changes-across-rounds.md) before quoting an older answer.
3. **Never invent a coach statement.** Quote only words that are in his answer files, with the id. `coach_chat_statements.md` is a close paraphrase, so quote only what it puts in quotation marks. Do not invent or look up his certifications.
4. **Never upgrade a label.** INFERRED does not become OBSERVED or confirmed because it looks right. A `proposed` sport profile stays `proposed` until he confirms it.
5. **Keep his vocabulary:** athletic patterns, resistance patterns, core, bigger and smaller muscles, stairway, Focus muscle, block, Day A and Day B. Keep his sheet spellings inside quotes ('SAGITAL', 'TRIPPLE EXTENSION').
6. **Keep it simple.** Every new input needs a coach answer behind it. Never add a check-in, a tracker, a stored field, a sex field, a lifestyle question or a session-length question.
7. **Do not manage people's time.** "You need to stop trying to be responsible for the people's time." (CT-01) Never cut, reshape or flag a plan because of minutes.
8. **Never reintroduce a retired idea** from section 9.
9. **Never edit** his answer files, `raw/`, `dumps/`, the legal files, or generated files (`model/`, `samples/plans/`).
10. **Disagreement is not an error.** If research points elsewhere, report it "for discussion", with sources.
11. **Say what is unknown.** When the sources are silent, say so and mark your suggestion PROPOSED. Do not present a general fitness rule as his.
12. **Safety first.** No plan without the accepted release. Nothing here is medical advice.
