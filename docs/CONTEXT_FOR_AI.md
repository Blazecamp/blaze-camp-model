# Context for AI agents: the Blaze Camp model in one file

This file is a self-contained briefing for an AI agent on the training model of coach Lalo Vera (Blaze Camp). It covers the purpose, the authority order, the categories, the dosing and session rules with their numbers, athletes, plan types, product decisions, what is retired, where each thing lives, and how to stay faithful to the coach. Every rule gives the id of the answer where he decided it. Anything he has not confirmed is marked **PROPOSED** (the team's suggestion) or **INFERRED** (the team's reading of his words or sheets). The model is a work in progress: the plan engine is being rebuilt, and he has not graded the sample plans yet. For more depth, follow the [docs map](README.md).

> General fitness information, not medical advice. Use at your own risk. Anyone who uses this with clients needs their own health screening, liability release and insurance. See [DISCLAIMER.md](../DISCLAIMER.md).

## 1. Purpose

**The rule.** A few answers go in. The whole plan comes out once, with every week visible. People adjust it themselves. There are no check-ins, no tracking and no data kept (R3-VOL-02, R3-VOL-04, R3-GEN-01).

**Why.** "I want them to be able to kick out a program, and that's it." "It's already a template, and you need to adjust it as you need to." (R3-VOL-04) "We're only doing outputs, and people can change accordingly." (R3-VOL-02)

**What it is for.** His programming system, captured so that clients, coaches and gyms can use it and developers and AI agents can build on it. It is free under the MIT license, "for anybody to use in their own app and their own training" (conversation). He builds from first principles, with Dr. Pat Davidson and Dr. Mike Israetel as his named sources, and not on packaged programs such as 5/3/1 (conversation).

**State.** No website exists yet. The engine's dosing is being rebuilt, a team decision ([ADR-048](04-decisions/adr-048-optimizer-rebuild-of-the-planner.md)). Version numbers move: read `model/MODEL_VERSION` and `engine/version.mjs`.

## 2. Who decides: authority order and labels

When two sources disagree, the higher one wins.

| Rank | Source | Cited as |
|---|---|---|
| 1 | `coach_answers_round3.md` (13 answers, newest) | `R3-...` |
| 2 | `coach_answers_round2.md` (45 answers) | `R2-...` |
| 3 | `coach_answers_full.md` (140 answers) | no prefix: `CAT-01`, `VOL-09`, `ORD-06` and so on |
| 4 | `coach_chat_statements.md`, `coach_answers.md` | "conversation" |
| 5 | His two Google Sheets (`raw/`, `dumps/`) | OBSERVED |
| 6 | Team work | INFERRED, SCIENCE, PROPOSED |

- RIGHT with no words means he approved the team's proposal as his rule. The wording is the team's.
- Text that contradicts a coach answer is a bug. A coach answer you think is scientifically weak is not a bug: report it "for discussion with the coach" and leave the rule alone.
- SCIENCE fills gaps. It never overrules him.

## 3. Categories

**The rule.** Every exercise is tagged on all lenses at once, not filed in one box (CAT-01). **Why.** "The hardest thing to understand is the categorization of everything" (conversation). Biomechanics describes every exercise. It is not a bucket of its own (CAT-03).

| Lens | Values |
|---|---|
| Family | Athletic patterns (AP), resistance patterns (RP), control or core (CT thorax, CP pelvis, both), cardio, functional (carries, drags) |
| Pattern | Knee dominant, hip dominant, leg flexion, horizontal and vertical push, horizontal and vertical pull. Athletic: triple extension (Olympic lifts), plyos, throwing, change of direction, speed. |
| Laterality | Bilateral (both sides together), unilateral (one side at a time), alternating |
| Plane | Sagittal, frontal, transverse |
| Muscle size | Big: quads, glutes, hamstrings, back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs (CAT-02) |
| Equipment | The implement, plus a constraint level from 1 (bodyweight, jumps) to 5 (seated machine with a back pad) (EQ-13) |
| Level | Foundational, intermediate, advanced |

- **The family sets the counting unit.** Resistance work counts as sets per muscle. Athletic work counts as contacts, throws, reps or metres, never as muscle sets (VOL-10).
- **Focus groups.** A **focus group** is the unit sets are counted on: quads, hips (glutes + hamstrings), back, chest, shoulders (front, side and rear delts), biceps, triceps, calves, core (R3-SES-01). Rear delts are part of shoulders: "I wouldn't categorize the rear delt as an individual muscle" (R3-VOL-01).
- **Exercise level** comes from skill, stability and where the load sits. In front or low is foundational. On the body is intermediate. Behind or overhead is advanced. A seat, machine or cable makes it easier (CAT-04, R2-LIB-02). Levels are soft: "The levels are still very theoretical" (CAT-05).
- **Client level** is separate (CAT-06). Level 1: under about a year of consistent training, or back after 6 to 12 months off. Level 2: over a year (PRG-05). Level 3 is PROPOSED: 3+ years and 4+ days a week now, or a competitive physique or strength athlete.
- **Davidson zones** are tags for rotation bias, not levels. Keep both biases in every week (R2-LIB-02, R2-LIB-03).
- **His library is the source of truth.** Each slot gets a default pick and swaps from the same category (GEN-04). The tool may change one detail of a library exercise between blocks. It never invents an exercise (R2-LIB-01). The catalog holds 939 records, 732 active. A new exercise is PROPOSED and can only be a swap until he approves it.

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
| Jumps, throws, Olympic lifts, sprints, change of direction, kettlebell swings, HYROX station circuits | 0 | VOL-10, R2-VOL-05, R3-ATH-03 |
| A set written 10/10 (10 reps each side) | 1 set | UNI-01 |
| Warm-up | never counts | ORD-08 |

PROPOSED: a set counts at most once toward a group such as hips or shoulders.

### 4.2 Weekly sets by client level

| | Level 1 | Level 2 | Level 3 | Source |
|---|---|---|---|---|
| Start, big muscles | 10 | 15 | 20 | VOL-01 gave ranges (10-12, 15-20, 20+). The 20 is PROPOSED. |
| Start, shoulders, biceps, triceps | 10 | 12 | 15 | R2-VOL-04 (8 / 12 / 15); the floor lifts level 1 to 10 (R2-VOL-06) |
| Ceiling in one block | 14 | 22 | 25 | R2-VOL-06; applied to small groups INFERRED |
| Ceiling of a Focus muscle | 18 | 26-28 | 30 | R2-VOL-06 (his priority-muscle ceilings; used for Focus muscles INFERRED) |

- **Floor.** Every group a training block trains directly gets at least 10 sets a week: "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). It is counted on the group (R3-VOL-01, R3-SES-01). The floor does not apply to a group the time check leaves to helper credit (R3-SES-02). Exempting maintenance, pre-season, in-season and pain-cut groups is INFERRED.
- **Calves:** one exercise × 3 sets every leg day (VOL-17, R3-SES-01). **Core opener:** 2 exercises × 2 sets every session (R2-SES-03).
- **Focus muscle 1 and 2.** A person may pick up to two. Each gets 1 to 3 extra sets a week (R3-SES-01). The default of +2 is PROPOSED.
- **Pain.** Cut that muscle or pattern 30 to 50 %, move it to machines or split grips, or drop the exercise (VOL-03). The person applies it. Severe pain stopping the build is PROPOSED.
- **Goal and phase factors** (for example 0.8 for general fitness) are PROPOSED. Confirmed: pre-season is about 60 % of off-season sets (R2-PER-06), and maintenance is 50 to 70 % (PER-01).
- "this is all customizable" (R2-VOL-06). The numbers are defaults. The hard rules are not.

### 4.3 The stairway

**The rule.** Every plan climbs: "It should be like steps up a stairway" (R2-PER-03). The whole stairway is computed when the plan is built. Nothing changes it afterwards.

| Parameter | Value | Source |
|---|---|---|
| Weekly step until the halfway week | about 3 % of the group's weekly sets | R3-VOL-04 |
| Weekly step after the halfway week | about 5 % | R3-VOL-04 |
| Where it ends | each trained group reaches its ceiling in the last week | R3-VOL-04 |
| Largest planned step for one group | 7 % a week | R2-VOL-01 |
| Rise of total weekly sets | less than 10 % a week | UNI-05 |
| Fractions | banked, and added as a whole set when they reach 1 | VOL-06 |
| How it feels | week 1 like a 2, the last week like an 11 | R2-PER-05 |
| Effort | 3 RIR early, then 2, then 1-2, then 1 plus intensifiers in the last week | R3-VOL-04 |
| Easy week inside a block | none | R2-VOL-07 |
| Next block | start 5 % higher, ceiling 1 set higher, never above 25 (30 for a priority muscle) | R2-VOL-06 |

Approved example: a level 2 big muscle goes 15 to 22 sets in 12 weeks, with the last four weeks at 19, 20, 21, 22 (R3-VOL-04). Open point (INFERRED): when steps of 3 % and 5 % cannot reach the ceiling, the group ends below it, with its highest week last. The halfway rounding and the week each effort step starts are PROPOSED.

### 4.4 Where a new set goes

- To the first exercise for that muscle, then the second: "I'm adding sets to the things that matter most" (VOL-07). So 2/2/2 becomes 3/2/2, then 3/3/2.
- When a day type runs twice a week, the new set alternates between the two days (R3-VOL-03).
- Extra small-muscle sets become a short bonus exercise on the optional day, or on a day that already trains that muscle, never as its only exercise that day (R3-VOL-03).
- Default sets: 3 on compound lifts, 2 on isolation (VOL-16).

### 4.5 Reps, effort, rest

- Reps: 5 to 30. Small muscles 12 to 30. Big muscles 5 to 15, mixed (VOL-11). Unilateral lifts 8 to 12 per side (UNI-04).
- Effort is given in reps in reserve: "I like RIR in my model" (VOL-13). Never to failure on heavy compound lifts (GEN-08). MAX (technical failure) only on small-muscle or bodyweight work (VOL-13). Myo sets only on the last exercise, machine or isolation (VOL-15).
- Rest: 1 to 2 minutes for hypertrophy, 3 to 6 for strength (VOL-14).

## 5. Session rules

| # | Rule | Source |
|---|---|---|
| 1 | Warm-up always. Then the core opener: "we need all the core work to be done first". The person may move it or switch it off. | ORD-08, ATH-11, R3-SES-02 |
| 2 | Power before strength: jumps, throws and Olympic lifts come before heavy lifting. | ORD-03 |
| 3 | Horizontal before vertical: row before pulldown, horizontal push before vertical push. The main lift ("the work") still goes first. | ORD-01, ORD-02, conversation |
| 4 | Pair hip dominant with a push and knee dominant with a pull. | UNI-11, ORD-06 |
| 5 | One heavy squat day and one heavy deadlift day a week, never the same day: "I would rather just load it once per week and load it correctly". | PER-04, R2-SES-01, R2-SES-02 |
| 6 | 2 to 4 exercises for every group trained that day: "there's never one exercise, so from 2 all the way to 4". | R2-SES-05, R3-SES-01 |
| 7 | About 5 to 7 resistance exercises. Field athletes off-season: up to 12 plus the 2 core exercises. | VOL-16, VOL-08, R2-SES-04 |
| 8 | Sessions: 45 to 60 minutes for general clients, about 90 for athletes and bodybuilders, 120 at most. | UNI-09 |
| 9 | Same exercises for a 4-to-6-week block. Then change one or two small variables. | PER-02 |

**When time cannot hold the minimums** (the floor of 10, 2 to 4 exercises per group, a climbing stairway), follow his order (R3-SES-02): (1) say so up front and offer another day or longer sessions; (2) if the person keeps their time, train fewer groups directly, big movers first; (3) recommend supersets, which are two exercises done back to back; (4) keep the stairway climbing on what is trained. Never squeeze 2 to 4 exercises per group into a day that cannot hold them. The minutes-per-set model behind this check is PROPOSED.

**Editing.** People can switch off a day's athletic block or core block, add or remove exercises or blocks, and swap inside a category (R3-SES-02, GEN-04). How this works on screen is PROPOSED.

**Bilateral and unilateral.** The share runs from 90/10 to 10/90. Unilateral work is "for health and keeping rotational foundations", bilateral "for driving and creating forces" (UNI-02). Bodybuilders and powerlifters start near 50/50 and end 80/20 or 90/10 bilateral. Field athletes stay 80 to 90 % unilateral, and bilateral work is minimal in season (UNI-10). Most per-sport numbers are PROPOSED.

**Equipment.** No bands, chains or weight releasers: "I don't do bands" (EQ-01, EQ-12). Machines are not ranked (EQ-11). Older, injured and high-volume clients get more machines (EQ-03). Medballs stay light: 8 to 10 lb for passes, never over 20 lb (conversation, EQ-06).

## 6. Athletes and active people

**Who gets athletic work.** Competitive athletes (sport, position, season), people who "stay athletic and active" (pickleball, HYROX, rec leagues, running), and people who just want to be athletic. Muscle and strength goals get no athletic block (OBSERVED). The data holds 52 sports, 26 activities and 127 profiles. Many numbers inside the profiles are PROPOSED or INFERRED.

| Topic | Rule | Source |
|---|---|---|
| Plyometric or ballistic | **Plyometric** means short, bouncy ground contacts. **Ballistic** means a longer contact or one big effort. The less time a sport spends on the ground, the more plyometric work. | ATH-01 |
| Plyometric share at the end of a block | 75 % sprinters, runners. 60 % volleyball, soccer, football skill positions. 50 % basketball, tennis, pickleball, HYROX, weekend warriors. 40 % baseball, softball, hockey, linemen, MMA. 25 % boxing, karate, wrestling, BJJ, golf, swimming, rowing. Each block starts 15 points more ballistic. | R2-ATH-01, R3-ATH-04 |
| Receive-Create stages | Learn to receive force before creating it. Stage 1 Land, 2 Land & Go, 3 Repeat. In 12 weeks: weeks 1-3, 4-7, 8-12. In 8 weeks: 1-2, 3-5, 6-8. | CAT-10, R2-ATH-03 |
| Olympic lifts | Everyone in athletic training. Beginners use dumbbell, kettlebell, hex-bar and hang versions. Up to 4 days a week. In season a light piece. | ATH-10, R2-ATH-04 |
| Cardio sessions a week | General and fat loss 3. Physique 4. Athletes in season 2, pre-season 2, off-season 2 to 4 by sport. Swimmers, runners, rowers and endurance cyclists 0 extra. Always adjustable. | ATH-07, R2-ATH-06, R2-SES-06, R3-ATH-04 |
| Season | Off-season: most volume. Pre-season: 4 to 6 weeks at about 60 %, then a 1-to-2-week taper. In season: 2 days, low volume. Game-heavy sports in season: gym plyos about half, hard gym day at least 48 hours before a game. | PER-08, R2-PER-06, R2-ATH-07 |
| Swimming dryland | 3 gym days + 1 optional. No extra cardio. 25 % plyometric. Olympic lifts 2 to 3 days. Shoulder care every session, never bands. 2-week taper before the main meet. | R3-ATH-01 |
| HYROX | 2 strength days + 2 hybrid days, 4 cardio sessions, 2 station circuits as finishers that count for no muscle. Wall ball never over 20 lb. | R3-ATH-03 |
| Stay athletic and active | The hardest gym day stays 48 hours before the biggest play day. A long session of the activity counts as cardio. An event date ends the hardest weeks 1 week before it. | R3-ATH-05 |
| From age 60 | On: landing drills, balance, quick stepping, light throws, fast machine work. Off unless switched on with his warning: hops, jumps, Olympic lifts, depth jumps. Never: overhead and low-bar squats. | R2-ATH-08, R3-ATH-02, EQ-03 |
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
- **After a block** an easy week at about half the sets is an extra week and only a recommendation: "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01). When a block ends, it ends, and the person builds the next one.
- **Tests** are optional. They happen before or at the start, and at the end. Never during the block. Never a 1-rep max or all-out mile from zero: use a 5-rep or 3-rep max and efforts at 80 to 90 % (R2-PER-07).

## 8. Product decisions

| Decision | Source |
|---|---|
| Inputs: goal, sport or activity, training experience, age, body weight, days, minutes, equipment, pain, optional Focus muscles. Nothing is asked after the build. | GEN-02, R3-VOL-04 |
| No sex field and no rules by sex: "mainly by age, foundation, goal, and injuries". No sleep, stress, job or lifestyle questions: "I just need the workouts here". | GEN-02, ATH-09, R2-GEN-04 |
| No data kept: "I don't want any data kept". The team reads this as no accounts, no stored answers, no email. | R3-GEN-01 |
| A short health check for clients, which a coach may skip with a warning. A "use at your own risk" box at every build. | R2-GEN-03, R3-GEN-01 |
| English first, with a full Spanish switch. Pounds or kilograms. | GEN-01, R2-GEN-08 |
| A simple phone-friendly website, not an app. Videos are optional. | GEN-03, R2-GEN-02 |
| MIT license to Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. Disclaimers in English and Spanish. They are drafts until a Florida attorney reviews them. | R3-GEN-01 |
| Coaches may add their own rules. The layer mechanism is PROPOSED. | GEN-08 |

## 9. Retired: never rebuild

| Retired | Replaced by | Source |
|---|---|---|
| Check-ins, logbooks, plans that adapt from feedback, `adapt()`, a week-by-week mode | The whole plan built once | R3-VOL-02, R3-VOL-04 |
| Accounts, stored data, learning from users | Nothing kept | R3-GEN-01 |
| A sex field; sleep, stress or job questions | Workouts only | GEN-02, R2-GEN-04 |
| Helper credit 0.5; kettlebell swings as glute sets | 0.25; no muscle credit | VOL-09, R2-VOL-05 |
| Rear delts with their own sets and floor | Part of shoulders | R3-VOL-01 |
| A weekly step by muscle size (3 / 5 / 7 %), or from the person's week | One planned stairway | VOL-05, R3-VOL-04 |
| A deload inside a block; a mandatory easy week; "start hard" plans | The stairway; rest between blocks, recommended | R2-VOL-07, R2-PER-03, R3-PER-01 |
| Fewer than 10 sets on a trained group; one exercise per muscle on full-body days | Floor of 10; 2 to 4 exercises | R2-VOL-06, R2-SES-05 |
| Priority push of +4 to +6 sets as the default | Focus muscles, +1 to +3 | R3-SES-01 |
| Bands, chains, weight releasers; a ranking of machines | None; no ranking | EQ-01, EQ-12, EQ-11 |
| Core after the power block; leg curls as hip dominant; zone number as level | Core first; leg flexion; zones as tags | ATH-11, CAT-09, R2-LIB-02 |
| A 1-rep max or all-out mile from zero | 5-rep or 3-rep max, 80 to 90 % | R2-PER-07 |

Old keys for some of these remain in the spec, such as `adaptation` and `rule_tables > learning`. Do not build on them. Full lists: [what he rejected](01-philosophy/what-he-rejected.md), [parameters](05-reference/parameters.md) §22.

## 10. Where each thing lives

Keys are in [generator_spec_v1.json](../generator_spec_v1.json) unless a file is named.

| Thing | Data | Explained in |
|---|---|---|
| His words | `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_chat_statements.md` | [answers by topic](03-coach-answers/index.md) |
| Master document | [BLAZE_CAMP_BRAIN.md](../BLAZE_CAMP_BRAIN.md) | this folder |
| Categories and exercises | `synthesis/01_taxonomy.json`; `synthesis/02_exercise_catalog.json` | [categories](02-model/categories.md), [exercise library](02-model/exercise-library.md) |
| Levels | `vocab > levels`; `rule_tables > levels_exercise` | [levels and zones](02-model/levels-and-zones.md) |
| Counting, starts, ceilings, floor, Focus, pain | `rule_tables > counting`, `weekly_sets`, `priority`, `pain` | [volume](02-model/volume.md) |
| Stairway and set placement | `rule_tables > rate_engine`, `banking`, `set_placement` | [stairway](02-model/stairway.md) |
| Session rules, the time check, week templates | `rule_tables > ordering`, `pairing`, `axial_loading`, `session_limits`, `time_model`; `synthesis/05_templates.json` | [sessions](02-model/sessions.md) |
| Bilateral share; equipment | `rule_tables > bilateral_unilateral`, `equipment` | [bilateral and unilateral](02-model/bilateral-unilateral.md), [equipment](02-model/equipment.md) |
| Athletes, sports, activities | `rule_tables > athletic`, `conditioning`; `synthesis/04_profiles.json` | [athletes](02-model/athletes.md), [sports](02-model/sports.md) |
| Plans and tests | `plan_types`; `tests` | [plans and calendar](02-model/plans-and-calendar.md), [testing](02-model/testing.md) |
| Intake, editing, legal, checks | `inputs_schema`, `plan_editing`, `legal_and_privacy`, `validation_checks` | [data dictionary](05-reference/data-dictionary.md) |
| Every number with its status | | [parameters](05-reference/parameters.md) |
| Why each rule exists | | [decision records](04-decisions/index.md) |
| Working rules for the repo, hard rules H01 to H22 | | [AGENTS.md](../AGENTS.md) |

`model/` is a compiled copy for the engine. It is generated and can lag. When it differs from the spec or from a coach answer, the coach answer wins, then the spec.

## 11. How to stay faithful to the coach

1. **Find the answer first.** Before you state or change a rule, find the answer id that owns it. If there is none, your statement is PROPOSED.
2. **The newest round wins.** Check [changes across rounds](03-coach-answers/changes-across-rounds.md) before you quote a round-1 answer.
3. **Never invent a coach statement.** Quote only words that are in his answer files, with the id. `coach_chat_statements.md` is a close paraphrase, so quote only what it puts in quotation marks.
4. **Never upgrade a label.** INFERRED does not become OBSERVED or confirmed because it looks right.
5. **Keep his vocabulary:** athletic patterns, resistance patterns, core, bigger and smaller muscles, stairway, Focus muscle, block. Keep his sheet spellings inside quotes ('SAGITAL', 'TRIPPLE EXTENSION').
6. **Keep it simple.** Every new input needs a coach answer behind it. Never add a check-in, a tracker, a stored field, a sex field or a lifestyle question.
7. **Never reintroduce a retired idea** from section 9.
8. **Never edit** his answer files, `raw/`, `dumps/`, the legal files, or generated files (`model/`, `samples/plans/`).
9. **Disagreement is not an error.** If research points elsewhere, report it "for discussion", with sources.
10. **Say what is unknown.** When the sources are silent, say so and mark your suggestion PROPOSED. Do not present a general fitness rule as his.
11. **Safety first.** A health-check answer that points to a professional stops the automatic plan. Nothing here is medical advice.
