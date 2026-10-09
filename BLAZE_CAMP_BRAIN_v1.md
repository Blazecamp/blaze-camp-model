# BLAZE CAMP BRAIN v1: the coach's confirmed system

**What this is.** The master document of the Blaze Camp model: how the coach (Blaze Camp, IG @BLAZECAMP) classifies, doses, orders and periodizes training, written so that (1) the coach can check every rule against what he believes and (2) an engineer can build the plan generator (people enter basic info and get a 4-6-week, 8-week, 12-week, week-by-week or yearly plan in his style). The machine-readable twin is `generator_spec_v1.json`. The next questions for the coach are in `round2_questions.json`.

**Version.** v1, 2026-10-08. The coach answered 138 of 140 questions (`coach_answers_full.md`); his earlier chat statements are in `coach_answers.md`. **His answers are authoritative: they override every inference from the sheets and every earlier team decision.** The previous master is archived unchanged as `BLAZE_CAMP_BRAIN_v0.md` (its header said "v1" because it had folded in CAT-01 to CAT-09 only; it is v0 here). This version was built from the coach's answers and the v1 synthesis files 01, 02, 03, 04, 05, 06, 07, 10, 10b, 11, 12 and 13. No Google Sheet was opened for writing. A coverage audit (same day) traced all 138 answered questions to this file and the spec and fixed the gaps it found (`coverage_matrix.md`; Appendix B).

**How each section reads.** Confirmed rules first (with the question ID that set them), then the supporting evidence, then anything PROPOSED or pending. Numbers that the coach did not give are always marked.

### Evidence labels

| Label | Meaning | Weight |
|---|---|---|
| **COACH-ANSWER <ID>** | The coach's questionnaire answer (`coach_answers_full.md`), e.g. COACH-ANSWER VOL-07. A RIGHT chip with no text makes our assumption his rule; PARTLY / NOT RIGHT means his words define the rule. | Authoritative. |
| **COACH-CHAT** | His earlier statements relayed in chat (`coach_answers.md`), close paraphrase. | Authoritative in meaning; an answer wins where they differ (e.g. VOL-05 retires "3/5/7 % depending on muscle size"). |
| **OBSERVED** | Read from a sheet cell, tab, colour or dropdown; labels quoted verbatim with his spelling ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT'). | Evidence of how he has written programs. |
| **SCIENCE** | Published research or a named practitioner source (references in 07, 10b, 12, 13). | Fills gaps and checks his numbers; never overrules an answer. |
| **RESEARCH** | Product, price, platform or legal facts from public pages (13, accessed 2026-10-08). | Re-check before acting. |
| **INFERRED** | The team's reasoning from the sheets or answers. | A default until he confirms. |
| **PROPOSED** | Short for **PROPOSED - PENDING COACH APPROVAL**: our design where he asked us to propose (volume algorithm, output format) or left a gap. | Ships only after his yes. |
| **DORMANT** | Kept as an archive of sheet content, never used by the generator (variable resistance, EQ-01 / EQ-12). | None. |

**Cell shorthand.** BYOP = 'BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL' workbook; MM = 'BLAZE CAMP MASTER MODEL'; LIB = BYOP 'MASTER EXERCISE LIBRARY'; SQ = MM 'ALL ABOUT SQUATS'; 4T = MM '(NOT DONE) 4 TRACKS PROGRAMMING'; AE = 'AEROBIC CAPACITY CHEAT SHEET'; S23 = 'Sheet23'; JL = the BYOP tab 'JUSTICE LEAGUE' (a tab name only: the program is now "Athletic Performance - Non-Competitive", COACH-ANSWER ATH-13, FIX-03).

### Where the full version of each section lives

| Section here | Full version (in `synthesis/` unless noted) |
|---|---|
| 1 Philosophy | `coach_answers_full.md`, `coach_answers.md`; 01 §0; 07 §0 |
| 2 Segmentation | `01_taxonomy.md` / `.json` (90 nodes, 44 facets, 243 values, 641 crosswalk rows) |
| 3 Levels | 01 §1-2 (F.DZONE, F.LOADPOS); `10_equipment_model.md` §1.4; `11_training_variables.md` §1.2; 12 §3.2 |
| 4 Library | `02_exercise_catalog.md` / `.json` (913 records, 707 active), `02_no_equipment_subset.md` |
| 5 Volume engine | `12_volume_algorithm_v1.md` / `.json` (engine + research charts); `03_volume_dosing.md` / `03_volume_rules.json` (observed doses, coach-side corrections to 12) |
| 6 Bilateral vs unilateral | 12 §3.11; 11 §3.7 (V22, V14, V24); 04 §5.11; 05 §4 |
| 7 Training variables | `11_training_variables.md` / `.json`; `10b_equipment_variables_science.md` |
| 8 Equipment | `10_equipment_model.md` / `.json`; 10b |
| 9 Athletes | `04_athlete_profiles.md` / `04_profiles.json` (27 profiles + 24 variants) |
| 10 Sessions and weeks | `05_session_architecture.md` / `05_templates.json` (30 split templates + variants) |
| 11-12 Plans, tests | `06_periodization.md` / `.json` |
| 13 Generator | this file §13 + `generator_spec_v1.json`; v0 intake detail `09_generator_inputs.md` (superseded where §13.2 differs) |
| 14 Product | `13_product_options.md` |
| 15 Science | `07_science_lineage.md`; 10b; 12 §2 and §8; 06 §12 |
| 16 Open items | this file §16; `round2_questions.json` |

---

## 0. What changed since v0 (short)

### 0.1 The answers in numbers

140 questions: **84 RIGHT**, **18 PARTLY** (UNI-08, UNI-09, VOL-02, VOL-17, ATH-07, ATH-09, ATH-13, ORD-05, ORD-10, EQ-10, LIB-02, LIB-07, LIB-13, LIB-16, PRG-02, PRG-03, PRG-04, PRG-06), **4 NOT RIGHT** (PER-01 plan shapes, ATH-11 core placement, EQ-11 machine ranking, EQ-12 variable resistance), **30 answered in words without a chip**, **2 skipped** (PRG-01, FIX-01), **2 unanswered** (LIB-10, LIB-12). Counted with the team venv from `coach_answers_full.md`.

### 0.2 The 24 changes that move the generator most

| # | v0 (team inference) | v1 (coach's rule) | ID |
|---|---|---|---|
| 1 | Weekly 3 / 5 / 7 % picked by muscle size (big lower 3, big upper 5, small 7) | One 3, 5 or 7 % step per **person** per week, chosen by fatigue, life and response; coach can set it; 10 %/week is "way too much" | VOL-05, UNI-05, VOL-04 |
| 2 | 15-20 sets read as the peak week; start back-solved | **Starting** sets: beginner 10-12, intermediate 15-20, advanced 20+; 15-20 = maintenance to some growth, 20-25 = growth | VOL-01, UNI-01 |
| 3 | Helpers 0.5; glutes 1.0 from every hinge and lunge | Helpers **0.25**; dips 0.5 triceps + 0.5 chest; athletic work never counts toward muscles | VOL-09, LIB-16, VOL-10 |
| 4 | Release 1-2 sets at a time, round-robin across exercises | Bank the fraction, add **one** whole set at 1.0, to the **first exercise of the day first** (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3) | VOL-06, VOL-07 |
| 5 | Max 2 exercises per muscle per session | **3-4 exercises per muscle group per day**; small muscles at the end get a **bonus exercise** | VOL-07 |
| 6 | Bilateral share 35-70 % by goal | A **90/10 ↔ 10/90 slider** by athlete, phase and pain: bodybuilders/powerlifters 50/50 → 80/20-90/10; field/COD athletes 80-90 % unilateral; in-season minimal bilateral | UNI-02, UNI-03, UNI-10 |
| 7 | Contralateral loading as the default | Contralateral pulls you **into** the hip (COD athletes); ipsilateral helps you **out** of it (sprint acceleration); for bodybuilders/powerlifters both are health accessories, mostly weeks 1-4 | CAT-13 |
| 8 | Core primer for athletes, optional days for physique | **Core first for everyone** (it is the warm-up), movable by the user | ATH-11 (NOT RIGHT to v0) |
| 9 | Vertical vector free; Bootcamp 1 Tue/Fri as written | **Hip-dominant + push, knee-dominant + pull** in every full-body and bootcamp day; Bootcamp 1 Tue/Fri was a mistake | UNI-11, ORD-06 |
| 10 | Two squat exposures a week (front squat + back squat twins) | **Load the spine once a week**: one squat day, leg press or belt squat the other; deadlifts load the spine too | PER-04, EQ-11 |
| 11 | 6 = 5 + deload; 8 = 7 + deload/test; 12 = 6 + mid deload + 5 | **4-6 weeks = maintenance/transition at 50-70 %**; 8 weeks start hard (4 adapting + 4 driving); **12 weeks preferred** (2-4 acclimation, 4-6 driving, hardest last); repeat cycles start one level higher; week-by-week and yearly modes | PER-01 (NOT RIGHT to v0) |
| 12 | Deload back to ~week-1 volume | Deload = **about half the sets**, same exercises, lighter, no finisher | PER-05 |
| 13 | Plyo zones Z1-Z3 as an exercise property | Not zones: a **method** (receive & pause → receive then create → repeated); unnamed yet; programs start ballistic and become plyometric | CAT-10, CAT-11 |
| 14 | "Zone" = level | Davidson zones are **rotation biases** (vertical = external rotation; horizontal = zone 2 internal rotation, compressive); level comes from **load position**, skill and stability; machines/cables easier; zones never for plyos | CAT-04, CAT-10 |
| 15 | Bands, chains, weight releasers as tools | **None** anywhere for now | EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 |
| 16 | Machine ranking Pendulum > Leg press > Hack | **Not ranked** (brands and angles differ); hack/leg press more constrained than Smith; belt squat = no axial load | EQ-11 (NOT RIGHT to v0) |
| 17 | Olympic lifts for intermediate+ athletes, optional | **Everyone in athletic training** gets Olympic lifts; beginners DB/KB snatches, hex-bar jumps, hang pulls/cleans; intermediate+ full scope | ATH-10 |
| 18 | Plyo dial by contact counts (squirrel-jump convention) | Plyo vs ballistic set by the sport's **ground-contact time** (long ground time → more ballistics) | ATH-01, ATH-02 |
| 19 | Sex on the form; female-athlete rules | **No sex field, no sex-based rules**: age, foundation, goal, injuries | GEN-02, ATH-09 |
| 20 | Levels L1-L4, NOVICE below NEWBY | **L1-L3**; novice = newby; placed by **years of training**; 6-12+ months off → body treated as L1 | PRG-05 |
| 21 | 60-min reference session, ~20-set budget | 5-7 exercises (45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); field athletes off-season up to 10-12; athletes/bodybuilders/powerlifters ~90 min (max 2 h); general 45-60 min | VOL-08, VOL-16, UNI-09 |
| 22 | Medball for everyone; female -2 lb | **No medball for aesthetics** except warm-up; never over 20 lb | ATH-05, EQ-06 |
| 23 | 2-3 aerobic sessions by level | **3** general/fat loss, **2** athletes in season, **4** aesthetics/bodybuilders + long walks after workouts | ATH-07 |
| 24 | Output = a Google Sheet like BYOP | Undecided by him; **PROPOSED**: phone-friendly website with optional weekly check-in, PDF/image/Sheet exports, open source after approval | GEN-03 (13) |

### 0.3 Cross-file decisions this master takes

Where two v1 synthesis files disagree, the generator follows the column "Adopted" until the coach decides. Every row is mirrored in `generator_spec_v1.json > _meta.integration_decisions`.

| Topic | One file says | Another says | Adopted here | Status |
|---|---|---|---|---|
| Hand-set weekly rate | 12 §3.7: coach may set 0-10 % | 03: 0-7 %, 10 % is never a rate | **0-7 % by hand; the person's total weekly sets must stay below +10 %** | COACH-ANSWER UNI-05, VOL-05 |
| Default sets in athletic templates | 12 §3.10: 3 / 2 / 3 everywhere | 03, 05: 2 per slot (VOL-16 RIGHT) | **2 per slot in athletic templates**; 3 compound / 2 isolation / 3 calves elsewhere | COACH-ANSWER VOL-16 |
| RIR in the hardest weeks | 12 §3.12: "RIR toward 1" | 03: 1-3 RIR always, no ramp | **1-3 RIR on every working set**; landing at 1 RIR in the hardest weeks stays inside his band (PROPOSED, not a rule) | COACH-ANSWER VOL-13 |
| Exercises per resistance session | 12: 5-7, 8 PROPOSED | 03, 05: 45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 | **His length mapping** (VOL-08 RIGHT); "usually 7" at 60 min | COACH-ANSWER VOL-08, VOL-16 |
| Priority add by level | 12 §3.5: +4 (L1-L2) / +6 (L3); 12 §3.3: +5 at L2 | 03: +4-6, split PROPOSED | **+4 L1, +5 L2, +6 L3** (inside his +4-6) | PROPOSED |
| Full Olympic lifts | 12 §3.13: L3 only | 03, 04, 06, 10: L2+ full scope | **L1 and early L2: DB/KB snatch, hex-bar jumps, hang pulls/cleans; L2+: full scope** (power and squat versions) | COACH-ANSWER ATH-10 |
| Glute credit on hinges | 01, 12: 0.5 (glutes as a co-mover) | 02: 0.25 (helper rule) | **0.25** (his helper rule, "0.25 to the helpers, not a 0.5"; and on the RFE lunge, whose purpose label also names glutes, he counts "mostly for quads ... I don't necessarily count it for glutes"); the 0.5 co-mover value is kept only as a switch for round 2. Hip thrusts, bridges and swings stay glutes 1.0. *(Coverage audit 2026-10-08: was 0.5, a leftover of the retired 0.5 helper credit.)* | COACH-ANSWER VOL-09, UNI-01; 0.5 alternative PROPOSED; round 2 (R2-VOL-05) |
| Plyo share by sport | 12 §3.13: per-sport start → end table | 04: ground-contact class map 75/60/50/40/25 % | **04's class map = end-of-block target; block starts 15 points more ballistic (floor 20)** | PROPOSED; round 2 |
| Weekly jump-contact targets per sport | 03 §9.11: block-end fast-SSC totals (e.g. basketball 180-240) | 04 §5.1: tier dials (fast-reactive plyometric contacts, e.g. basketball T5 100-140; all jump contacts as the NSCA safety check) | **04's two dials** (they follow the ATH-02 ranking by construction and are anchored on his re-counted programs); 03's totals kept as an upper reference | PROPOSED |
| Plyo method stage weeks | 12: weeks 1-2 / 3-5 / 6+ | 04: by plan length (12-wk 1-3 / 4-7 / 8-12; 8-wk 1-2 / 3-5 / 6-8) | **04's plan-length split** | PROPOSED; round 2 |
| Weekly step mechanism | 12 §3.7: readiness score R (effort, completion, performance, life) | 13 §2.3: effort band × life table | **13's table for the check-in (readable, one screen)**, inside 12's gates; R kept as the logbook/learning score (v2) | PROPOSED; round 2 |
| Field-athlete exercise cap | VOL-08 "max maybe 12" | VOL-17 "12 to 14" (2 core + 2-4 + 2-3 + 3-4) | **12 excluding the core block = 14 with it** (both answers agree under this count) | INFERRED; round 2 |
| Thruster credit | VOL-09 helpers 0.25 | LIB-14 (RIGHT) 1.0 quads + 0.5 shoulders | **0.5** (exercise-specific answer, like dips); all v1 files now agree | COACH-ANSWER LIB-14; round 2 confirm |
| Program name for the 'JUSTICE LEAGUE' tab | 01: "All-around athletic / weekend warrior" | 05, 11: "Athletic Performance - Non-Competitive" | Display **"Athletic Performance - Non-Competitive (weekend athletes, adults and youth)"**; profile id `weekend_warrior` | COACH-ANSWER ATH-13, FIX-03; names PROPOSED |
| Equipment profile ids | v0 spec / 09: HOME_DB_BENCH_BANDS, BANDS_ONLY, BOOTCAMP_OUTDOOR, TRACK_FIELD | 10 v1 | **10 v1 ids** (HOME_DB_BENCH; BANDS_ONLY removed; FIELD_TRACK_KIT; FIELD_TRACK_NO_KIT) | COACH-ANSWER EQ-01 |
| Leg-flexion bucket id | 05_templates.json, v0 spec: RP.HD.ISO / ISO_HAM | 01 v1: RP.LF (retired alias kept) | **RP.LF** everywhere; `RP.HD.ISO` resolves as a retired alias | COACH-ANSWER CAT-09 |

---

## 1. The philosophy in his words

### 1.1 What he said (short quotes; the full text is in `coach_answers_full.md`)

| Topic | His words | ID |
|---|---|---|
| Taxonomy | "this is the whole taxonomy of each exercise ... we can segment by whatever we need ... This is huge." | CAT-01 |
| Biomechanics | "biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises." | CAT-03 |
| Levels | "Mostly, skill and stability demand ... Also, in the positioning" (front-loaded foundational, on the body intermediate, behind advanced); machines and cables "easier because the machine or the cable is doing the work for you." | CAT-04 |
| Levels are soft | "The levels are still very theoretical, so we don't need to rely heavily on them." | CAT-05 |
| How much volume | "15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation." "40 sets of chest per week might be way too much, but I think 5 might be too little." | UNI-01 |
| Learning | "This eventually will be something that learns from the data of all the people that use it." | VOL-01 |
| Weekly step | "It doesn't really go by muscle ... It's just more on what's going on with the person." "It can progress week by week by 10 %. That's way too much." | VOL-05, UNI-05 |
| The tool does the math | "I need this tool that we're building eventually to figure out the percentages." | VOL-06 |
| Where sets go | "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning." | VOL-07 |
| Bilateral vs unilateral | "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." | UNI-02 |
| Into / out of the hip | contralateral "pull[s] me into the hip"; ipsilateral: "that right hand is going to help me get pulled out of the hip." | CAT-13 |
| Pairing | "If I'm doing the back of my lower body, then the opposite would be the front of my upper body ... keep as far away as I can from bleeding over." | UNI-11 |
| Spine | "I would rather just load it once per week and load it correctly." | PER-04 |
| Core | "we need all the core work to be done first ... that'll give you a good warm-up." | ATH-11 |
| Supersets | "It's a tool to use to fatigue the heart more and compress the time." | ORD-05 |
| Athletes | "The more time on the ground ... the more ballistics and less plyos. The less time on the ground ... the more plyos." "everyone gets Olympic lifts." | ATH-01, ATH-10 |
| Plyos | "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." | CAT-10 |
| Plans | "An 8-week program is a program that wants to modify you, so you have to start hard." 12 weeks preferred; next cycle "start at a 2 and end at an 11." "I do want to have good sound science behind it." | PER-01 |
| Equipment | "I don't do bands." "I don't want to rank them because they have different brands, angles." Older/injured/high volume: "collect that volume in a safe place with more constraints." | EQ-01, EQ-11, EQ-03 |
| Pain | cut 30-50 %, machines, "maybe even drop the exercise altogether if it's too much." | VOL-03 |
| People, not labels | "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." | ATH-09 |
| Effort | "I like RIR in my model, so that's what I'm going to be using." | VOL-13 |
| Users | "clients, coaches, trainers, strength and conditioning coaches, anyone"; English first with a full Spanish toggle. | GEN-01 |
| Lineage | Dr. Pat Davidson + Dr. Mike Israetel + first-principles science, not packaged models (5/3/1, Texas Method, Prilepin). | COACH-CHAT |

### 1.2 The model in fifteen sentences

1. **Classify first, then dose.** Every exercise is tagged on every lens at once: family, pattern, laterality, plane, size class, muscles, equipment, constraint, load position, level (COACH-ANSWER CAT-01, CAT-03).
2. **A slot is CATEGORY × PURPOSE.** The category ('Unilateral KD') is the Davidson half (a pattern and a position); the purpose ('Quads/Glutes') is the Israetel half (the muscle credited). The generator places patterns and audits muscles (OBSERVED BYOP rows; INFERRED reading).
3. **Big muscles are organised by pattern, small muscles by muscle** (COACH-ANSWER CAT-02; OBSERVED LIB columns).
4. **Exercise level = skill + stability + where the load sits**, made easier by machines and cables; levels add options, never gate, and stay separate from the client's level (COACH-ANSWER CAT-04, CAT-05, CAT-06).
5. **Count weekly hard sets per muscle**: main mover 1.0, helpers 0.25, 10/10 = one set, athletic work never (COACH-ANSWER VOL-09, UNI-01, VOL-10).
6. **Start where the person is** (10-12 / 15-20 / 20+) and **grow 3, 5 or 7 % a week by the person's state**, banking fractions and adding whole sets to the first exercise of the day first (COACH-ANSWER VOL-01, VOL-05, VOL-06, VOL-07).
7. **Bilateral drives force, unilateral keeps the body healthy and rotational**: the share slides from 90/10 to 10/90 by athlete, phase and pain (COACH-ANSWER UNI-02).
8. **Every session**: warm-up → core → athletic work (plyo, throws, COD, sprints) → Olympic/power → the work with its opposite-surface partner (hip + push, knee + pull) → secondary pair → isolation → conditioning (COACH-ANSWER ATH-11, ORD-01..08, UNI-11).
9. **Load the spine once a week, correctly**; the second squat day is a leg press or belt squat (COACH-ANSWER PER-04, EQ-11).
10. **Blocks are stable**: same exercises for 4-6 weeks, one or two small variables change at the next block, A/B weeks only for people who want variety (COACH-ANSWER PER-02, PER-03).
11. **Athletes: the sport's ground time sets plyo vs ballistic**; programs start ballistic and become plyometric; everyone in athletic training gets an Olympic-lift variant (COACH-ANSWER ATH-01, CAT-10, ATH-10).
12. **Plans have a shape**: 12 weeks preferred (get used to it → drive hard → hardest last), 8 weeks start hard, 4-6 weeks maintain at 50-70 %, and each new 12-week cycle starts one level higher (COACH-ANSWER PER-01).
13. **Safety beats labels**: older, injured and high-volume clients collect volume on constrained machines and never get overhead squats, snatches, low-bar squats or depth jumps; pain cuts 30-50 % or drops the exercise (COACH-ANSWER EQ-03, VOL-03).
14. **No bands, no variable resistance, no machine ranking, no sex-based rules** (COACH-ANSWER EQ-01, EQ-12, EQ-11, ATH-09).
15. **The tool does the math and learns**: the client sees "+1 set on Back Squat next week", never percentages; the engine improves from everyone's data under fixed guardrails and the coach's approval (COACH-ANSWER VOL-06, VOL-01; method PROPOSED).

---

## 2. The segmentation model

### 2.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| S1 | **Every exercise is tagged on all lenses at once**: family, pattern, laterality, plane, size class, muscles credited, implement/constraint, level (plus the v1 fields below). The generator can then segment by any of them. | COACH-ANSWER CAT-01 |
| S2 | **Families**: Athletic patterns (AP), Resistance patterns (RP), Control/core (CO: thorax CT, pelvis CP, both CB), Cardio/conditioning (CA), Functional systems (FN: carries, drags, slings). | OBSERVED LIB row 4; CAT-01 |
| S3 | **Big muscles**: quads, glutes, hamstrings, lats/upper back, chest. **Small muscles**: biceps, triceps, side delts, rear delts, calves, forearms, abs. | COACH-ANSWER CAT-02 |
| S4 | **Biomechanics is the description every exercise carries** (plane, laterality, load position, stance, ROM, zone), **not a bucket**. | COACH-ANSWER CAT-03 |
| S5 | **Core**: thorax = the trunk moves on a still pelvis; pelvis = the pelvis/legs move on a still trunk; both at once; each in any plane, static or dynamic. | COACH-ANSWER CAT-08 |
| S6 | **Leg curls, Nordics, slider/ball curls are LEG FLEXION** (node `RP.LF`), not hip dominant; they count fully to hamstrings and never to the hinge pattern. | COACH-ANSWER CAT-09, VOL-09 |
| S7 | **Athletic patterns never count toward muscle volume** (plyos, ballistics, throws, Olympic lifts, sprints, change of direction); they have their own units. | COACH-ANSWER VOL-10 |
| S8 | **The BYOP MASTER EXERCISE LIBRARY is the single source of truth**; Sheet23 and RESISTANCE PATTERNS are older drafts used for levels and grammar. | COACH-ANSWER CAT-07 |
| S9 | **Speed (sprint and running mechanics) is a library category** (squirrel jumps → MACH drills / acceleration starts → max velocity, fixed order). | COACH-ANSWER LIB-21 |
| S10 | **Carries, drags and sling systems are to be built out**: carries and drags for athletes and general fitness; slings for advanced athletes and rehab. | COACH-ANSWER LIB-19 |

### 2.2 Two cuts plus a variable stack

```
STEP 1  FAMILY (what QUALITY is trained, its dose unit, its place in the session)
        ATHLETIC  AP  purpose = a quality ('SPEED/POWER', 'CHANGE OF DIRECTION'); contacts / throws / cuts / metres; never muscle sets (VOL-10)
        RESISTANCE RP purpose = a muscle ('QUADS', 'BACK'); sets x reps at 1-3 RIR; counted per muscle (VOL-09)
        CONTROL   CO  purpose = 'CORE'; thorax / pelvis / both x plane x static/dynamic (CAT-08); first in the session (ATH-11)
        CARDIO    CA  blue A / green B / orange C / lactate clearance; any erg (EQ-14)
        FUNCTIONAL FN carries, drags, slings (LIB-19; build-out pending)
STEP 2  ORGANISING LENS inside the family (CAT-02, CAT-03)
        big muscles + all athletic and core work -> by pattern (knee/hip x bilateral/unilateral, leg extension, LEG FLEXION;
                                                  push/pull x vertical / mid-range / horizontal; phase, height, turn, plane)
        small muscles -> by muscle ('SIDE RAISES', 'BICEP', 'TRICEP', 'CALVES'; rear delts tracked apart, VOL-17)
        biomechanics  -> NOT a bucket: the description on every record
STEP 3  EXERCISE LEVEL inside the bucket = skill + stability + load position; machines/cables easier; soft default (section 3)
STEP 4  VARIABLES on the base exercise: stance, load position, into/out of the hip, grip, feet/body, ROM, end range,
        implement/constraint, axial load, tempo, intent. Bands/chains/releasers: DORMANT (EQ-01, EQ-12)
STEP 5  THE SLOT = PURPOSE (muscle or quality credited) x CATEGORY (bucket the exercise is drawn from)
```

### 2.3 Canonical tree (v1; stable IDs, full node list in `01_taxonomy.json > nodes`)

```
AP  Athletic      TEX triple extension / Olympic (DRILL, PULL, PWR, SQ = Squat Snatch / Squat Clean / Squat Clean & Jerk, JERK)
                  JMP jumping (LK limited-knee/ankle; PLY landing -> box -> hurdle; FULL reactive/depth/loaded/squirrel)
                  UBP upper-body plyos | SPD sprint & mechanics (MECH A-drills/MACH, ACC, MAXV) [confirmed LIB-21]
                  THR medball throws (BS, ROT, INT, HIP into/out of a hip, TRUNK, SPEC) | COD pre-planned | AGI reactive [empty]
RP  Resistance    KD knee dominant (BS bilateral, UL unilateral, ISO leg extension)
                  HD hip dominant (BS hinge/bridge/thrust/back extension, UL single-leg hinge/bridge)
                  LF LEG FLEXION (knee flexion; lanes MACH / BW PROPOSED) [CAT-09; replaces RP.HD.ISO]
                  PU push (V vertical BS/UL; M mid-range [PROPOSED node]; H horizontal BS/UL/ISO fly)
                  PL pull (V vertical BS/UL/ISO lat pull-over = 'Pull under' [LIB-09]; H horizontal BS/UL; M [PROPOSED])
                  SM small muscles (DELT SIDE / REAR / FRONT; TRAP [PROPOSED]; BI; TRI; CALF)
CO  Control       CT thorax moves | CP pelvis moves | CB both [confirmed CAT-08]  x plane x static/dynamic
CA  Conditioning  A blue | B green | C orange | LC lactate clearance | BUY buy-out | WOD | CIRC circuit
FN  Functional    AOS anterior oblique (CHOP, AROT Pallof, PLANK, CRUNCH) | POS | LSS | CARRY | DRAG  [build-out LIB-19]
X   Meta          FOCUS ('Focus 1'/'Focus 2') | PREP (warm-up) | SKILL | TEST
```

Retired ids (resolve as aliases): `RP.HD.ISO` → `RP.LF`; `F.PZONE` → `F.PMETHOD`; `ZONE_ARM` → `ZONE_DAVIDSON`; muscle `FOREARMS_NECK_CUFF` → `FOREARMS` + `NECK_CUFF` (`01_taxonomy.json > _meta.retired_ids`).

### 2.4 Program slots (BYOP PURPOSE × CATEGORY) → node → credit (v1)

Wiring OBSERVED (data validations); credit = COACH-ANSWER VOL-09 (main mover 1.0, helpers 0.25) with his exercise-level exceptions. **Credit follows the exercise picked, not the slot** (library columns hold off-pattern items).

| PURPOSE | CATEGORY | LIB range | Node | Credit per set |
|---|---|---|---|---|
| 'Quads' | 'Bilateral KD' | AI7:AI122 | RP.KD.BS | quads 1.0; glutes 0.25, adductors 0.25 (PROPOSED values) |
| 'Quads/Glutes' | 'Unilateral KD' | AL7:AL42 | RP.KD.UL | quads 1.0 ("mostly for quads", UNI-01); glutes 0.25 (PROPOSED); 10/10 = 1 set |
| 'Quads' | 'Leg Extensions' | AM7:AM9 | RP.KD.ISO | quads 1.0 |
| 'Hamstring' | 'Bilateral HD' | AN7:AN122 | RP.HD.BS | hamstrings 1.0; glutes 0.25 (helper, VOL-09; §0.3); thrusts/bridges/swings: glutes 1.0 |
| 'Hamstring/Glutes' | 'Unilateral HD' | AQ7:AQ42 | RP.HD.UL | hamstrings 1.0; glutes 0.25 (helper, VOL-09, UNI-01; §0.3); single-leg bridges/thrusts glutes 1.0 |
| 'Hamstrings' | 'Leg Curls' | AR7:AR10 + LEG FLEXION items | RP.LF | hamstrings 1.0 (CAT-09) |
| 'Back' | 'Horizontal Pull' | X7:X162 | RP.PL.H | lats/upper back 1.0; biceps 0.25, rear delts 0.25 |
| 'Back ' | 'Vertical Pull' | U7:U122 | RP.PL.V | lats/upper back 1.0; biceps 0.25 (lat pull-over: back 1.0 only) |
| 'Chest' | 'Horizontal Push' (PPL 'Incline', 'Flies', 'Dips') | AD7:AD162 | RP.PU.H (M, ISO) | chest 1.0; triceps 0.25, front delts 0.25; **dips 0.5 triceps + 0.5 chest, on push days** (LIB-16) |
| 'Chest/Shoulders' | 'Vertical Push' | AA7:AA122 | RP.PU.V | front delts 1.0; side delts 0.25, triceps 0.25 |
| 'Shoulders/Traps' | 'ABdution' / 'Reverse Flies' | AH7:AH42 | RP.SM.DELT | side delts 1.0 (upright rows too, LIB-16); rear delts 1.0 on rear-delt items (own sets, VOL-17) |
| 'Bicep' / 'Tricep' / 'Calves' | same | AS / AT / AU | RP.SM.BI / TRI / CALF | target 1.0; calves 3 sets every leg day (VOL-17) |
| 'Plyo' / 'Throwing' / 'COD' / 'Tripple Extension' | same | G / K / L / C | AP.JMP / THR / COD / TEX | none: contacts, throws, cuts, power reps (VOL-10) |
| 'Core' | (blank) | O7:O283 | CO.CT / CP / CB | abs/obliques 1.0; first in the session (ATH-11) |
| 'Cardio' / 'Aerobic Capacity' | (blank) | B7:B122 | CA | sessions and bouts, not sets |
| 'Focus 1' / 'Focus 2' | (blank) | AZ7:AZ335 | X.FOCUS | the muscle picked; 2-3 sets each, both may hit the same muscle (ORD-11) |

Exercise-level exceptions (COACH-ANSWER): **thrusters** quads 1.0 + shoulders 0.5 (LIB-14); **dips** 0.5 / 0.5 (LIB-16); **leg extension / leg curl** count fully (VOL-09); **'Pull under'** = lat pull-over, back 1.0 (LIB-09); **Kong row** counts as a row but "doesn't really create a lot of stimulus" → used for shoulder/back pain clients, not to fill back volume (LIB-09; use PROPOSED). Push press / push jerk count to shoulders only in the VERTICAL PUSH slot; in the triple-extension slot they are power reps (02 `volume_credit.by_pool`, VOL-10).

### 2.5 Facets that are separate fields (one meaning per field; full list `01_taxonomy.json > facets`, 44 facets / 243 values)

| Facet | Values | v1 status | ID |
|---|---|---|---|
| `F.LEVEL` (exercise level) | L1 foundational, L2 intermediate, L3 advanced, L0 no level (throws, GHD, leg ext/curl, small-muscle lists) | soft default, never a gate | CAT-04, CAT-05, LIB-06, LIB-08, LIB-15 |
| `F.CLIENT` (client level) | Level 1 / 2 / 3 | separate axis from F.LEVEL | CAT-06, PRG-05 |
| `F.LOADPOS` | SIDES, GOBLET, COUNTER, HIGH_ZERCHER, ZERCHER, FRONT_RACK, BACK_HIGH, BACK_LOW, OVERHEAD, SHOULDER | carries the level band (front/low → L1, on the body → L2, behind/overhead → L3) | CAT-04 |
| `F.DZONE` (Davidson zone) | Z1 vertical-low (ER bias), Z2 horizontal (IR bias, compressive), Z3 vertical-high (ER bias) | new; not for plyos; describes rotation bias, does not by itself set the level | CAT-04, CAT-10 |
| `F.PMETHOD` (plyo execution method) | RECEIVE_PAUSE, RECEIVE_CREATE, REPEAT_RC | replaces F.PZONE; name pending; a way to perform a jump, not an exercise property | CAT-10, CAT-11 |
| `F.INTENT` | BALLISTIC (long ground contact / single effort), PLYOMETRIC (short contact), SPEED_STRENGTH, MAX_STRENGTH | defined by ground-contact time | ATH-01 |
| `F.LOADLAT` | DOUBLE, CONTRA (into the hip), IPSI (out of the hip), SINGLE | use case per record (COD / acceleration / health accessory); "contra default" retired | CAT-13 |
| `F.AXIAL` | HIGH, LOW, NONE (02 adds MODERATE for goblet/DB/KB/hack/pendulum/landmine) | new; drives the once-a-week spine budget | PER-04, EQ-11 |
| `F.CONSTRAINT` | 1-5 (approved scale, §8.2) | approved | EQ-13 |
| `F.ROLE` | PRIMER, CORE_BLOCK (first by default), ATHLETIC_BLOCK, MAIN, SECONDARY, ISOLATION, FINISHER, OPTIONAL_DAY ... + strength roles the work / accessory / nuance / survival | confirmed | ATH-11, ORD-07 |
| `F.ACCOM` | BANDS, REV_BANDS, CHAINS, RELEASERS | **DORMANT** | EQ-01, EQ-12 |
| `F.PERTURB` | ADDUCT (active); HIP_BAND DORMANT; STRAP removed | | EQ-01, LIB-09 |
| core | segment (CT/CP/CB) × plane × static/dynamic | confirmed | CAT-08 |
| others kept from v0 | F.PHASE (force phase P1-P4), F.TURN (COD), F.OLY (start position/receive), F.STANCE, F.ORIENT, F.GRIP, F.BODYPOS, F.ROM, F.END, F.ABAND (A/B/C/LC), F.EZONE, F.VOL (VOL 1/2/3), F.SEASON, F.WEEKTYPE | | OBSERVED |

### 2.6 One record per exercise (required fields)

**Required on every exercise** (COACH-ANSWER CAT-01): `family`, `node_id` (pattern), `laterality`, `plane`, `size_class`, `muscle_credit` (empty for athletic work), `implement[]`, `level`. **Also carried in v1**: `constraint_level` 1-5, `davidson_zone` + `rotation_bias` (not plyos), `load_position`, `load_laterality` + use case, `axial_spinal_load`, `athletic_quality` + `plyo_method_default` (as named only), `population_rules` (older/injured never-list, aesthetics no throws, pitchers, strikers, youth floor Olympic), `generator` {eligible, pools, default_candidate, why}, `coach_cues` (with question ID), `video_url`, `name_raw` / `name_clean` (FIX-04) / `name_es` (GEN-01), `status` (active / dormant / out_of_scope / retired / pending), and an evidence tag per field. Schema: `01_taxonomy.json > proposed_cleanup.record_schema`; implementation: `02_exercise_catalog.json`.

### 2.7 Pending (segmentation)

| Item | Proposal | Status |
|---|---|---|
| Size class of front delts, traps, adductors, neck (CAT-02 left them open) | front delts SMALL (credit only), traps SMALL, adductors BIG (credit only), neck SMALL (only for wrestlers, fighters, football, rugby) | PROPOSED |
| Toes to bar, hanging knees to chest; Copenhagen plank (CAT-08 "a little bit more complicated") | toes to bar / knees to chest → CO.CP (pelvis moves); V-up → CO.CB; Copenhagen → CO.CB frontal static + adductor credit | PROPOSED |
| Lanes inside LEG FLEXION | RP.LF.MACH (seated/lying curls), RP.LF.BW (slider, ball, DB, Nordic) | PROPOSED |
| Mid-range push / pull nodes; plane of motion vs plane of demand; A/B/C tag on every cardio item; slots for functional systems | open from v0 | OPEN (low priority) |
| CAT-12: may the generator build a variant by changing one detail of a library exercise? | named library exercises first; one-detail variants only for the 1-2 small changes between blocks | PROPOSED; re-asked in plain words (round 2) |

---

## 3. Levels

### 3.1 Exercise level: confirmed rules

| # | Rule | ID |
|---|---|---|
| L1 | **Level = skill + stability demand + where the load sits.** Load in front / low = foundational ("people need to learn how to be more upright"); close to and on the body = intermediate; behind the body or overhead = advanced. | COACH-ANSWER CAT-04 |
| L2 | **Machines and cables make any position easier** ("the machine or the cable is doing the work for you"). | COACH-ANSWER CAT-04 |
| L3 | **Levels add options and never remove them**, and they are "still very theoretical": a soft default for ordering and suggestions, never a gate. | COACH-ANSWER CAT-05 |
| L4 | **Client level (how much volume) and exercise level (how hard the movement is) are separate.** | COACH-ANSWER CAT-06 |
| L5 | **Safety beats the level label**: foundational older/injured clients may use machines filed MODERATE/ADVANCED (leg press, pendulum, hip thrust machine); machines (constraint 4-5) are offered from foundational. | COACH-ANSWER EQ-04, CAT-04 (extension to every client INFERRED) |
| L6 | **No levels on throws** ("just do them right") **or the GHD**; leg extensions and leg curls are at every level (the 'ADVANCED' / 'UNILATERAL' labels were typos). | COACH-ANSWER LIB-06, LIB-08, LIB-15 |
| L7 | **Push press is the easier rung; push jerk is intermediate/advanced.** | COACH-ANSWER LIB-13 |
| L8 | **A slot moves up a level at the end of a block** when it felt '8 - That was perfect' or easier with no pain. | COACH-ANSWER PER-06 |

**His ladders, as applied** (OBSERVED ladders; levels per CAT-04; 02 `level.generator_min_level`):

| Pattern | Foundational (L1) | Intermediate (L2) | Advanced (L3) |
|---|---|---|---|
| Bilateral knee dominant | goblet, front-loaded zercher, hex-bar squat, low DB squat (DBs at the sides, LIB-09), leg press, pendulum, hack, belt squat (machines, L5) | barbell front squat, SSB | high-bar and low-bar back squat ('A barbell back squat is more advanced'), overhead squat |
| Vertical push | seated machine shoulder press (EQ-05), seated DB press, push press (LIB-13) | push jerk (LIB-13), Z-press | standing barbell overhead press (LIB-11), handstand push-up |
| Vertical pull | lat pulldowns, assisted pull-up machine (BYOP FOUNDATIONAL: machine-supported overhead) | - (no middle tier in LIB) | strict / weighted pull-ups |
| Olympic (ATH-10) | DB/KB snatch, KB clean, DB/KB high pull, hex-bar jump, hang pulls, high/mid-hang cleans (no bumpers) | power clean / power snatch / power clean & jerk (BYOP files them ADVANCED) | Squat Snatch, Squat Clean, Squat Clean & Jerk (LIB-07) |

SCIENCE/OBSERVED check (10 §1.4): the load-position rule reproduces his library levels exactly for 98 of 176 levelled entries (56 %) and within one level for 157 (89 %); the misses are barbell skill (harder than position says) and machines filed as volume tools.

### 3.2 Davidson zones: confirmed meaning

The coach takes the zones from Dr. Pat Davidson's book *A Coach's Guide to Optimizing Movement* (COACH-ANSWER CAT-04, CAT-10). In his words they are **rotation biases**:

| Zone | Positions (his examples) | Rotation bias | His level reading (CAT-04) | ID |
|---|---|---|---|---|
| **Z1** vertical-low | standing, arms down, load low and close to the body | external rotation | foundational ("closer to your body at the bottom") | CAT-04, CAT-10 |
| **Z2** horizontal | hands in front of you; knee at hip height (halfway through a squat) | **internal rotation, more compressive** | intermediate ("very high-pressure ... but it's safer for you when you push and pull") | CAT-04, CAT-10 |
| **Z3** vertical-high | arms overhead; deep squat (zone number INFERRED: he groups the deep squat with the vertical positions) | external rotation | advanced ("positioning, the amount of stability ... and the skill") | CAT-04, CAT-10 |
| - | **Plyos** | zones do not apply | - | CAT-10 |

**How the generator uses it (v1).** (1) Every loaded, non-plyo exercise carries `davidson_zone` + `rotation_bias` as a tag (02: 280 records; 10 `rotation_bias`; for hips and knees the bias follows depth: deep squat external, half squat internal). (2) **The level comes from load position + skill + stability − machine/cable/seat support (L1-L2), not from the zone number**: a deep goblet squat stays foundational (load in front, low skill) even though its bottom position is a vertical/ER position; a seated, supported overhead press or a lat pulldown is foundational because the seat or machine does the stabilising (INFERRED from CAT-04 L2; round 2). (3) The zone is not used to order or pair stations (05 §1). (4) Levels stay theoretical (CAT-05).

**Lineage** (07 §1.1): no public description of this zone wording was found (web search 2026-10-08); it is consistent with the PRI / Hartman / Davidson pressure model (expansion ≈ external rotation, compression ≈ internal rotation). Treated as the coach's account of the book.

### 3.3 Client levels L1-L3: confirmed definitions

| Level | Who | What it changes | ID |
|---|---|---|---|
| **L1** (novice = newby, "essentially the same") | under about 6-12 months of consistent training; **or** more than 6-12 months off (the body is treated as a beginner; skills come back fast, so exercise level can stay higher); **ex-pros start at L1 only briefly** to acclimate, then move up | starting sets 10-12 (big muscles); acclimation at the long end of his 2-4 weeks (4 weeks in a 12-week plan, PROPOSED); DB/KB/hex/hang Olympic variants; supersets as a fatigue tool when they don't fatigue (ORD-05) | COACH-ANSWER PRG-05, CAT-06, ORD-05 |
| **L2** (intermediate) | consistent training for more than a year | starting sets 15-20; full Olympic scope (ATH-10); contrast eligible for athletes off-season (ATH-12) | COACH-ANSWER PRG-05, ATH-10, ATH-12 |
| **L3** (advanced) | **PROPOSED**: 3+ years consistent and training 4+ days a week now, or a competitive physique/strength athlete | starting sets 20+; 2-week acclimation; default step 3 % (target-seeking); supersets for more stimulus | PROPOSED (he did not define advanced) |
| L4 | retired: competition level changes the athlete profile (sport, position, season) and loads/care (PRG-09), not the volume level | - | PRG-05, PRG-09; retirement PROPOSED |

**Rules.** Explain the level in plain words on screen ("You trained 3 years but took 9 months off, so we start your body at Level 1 for the first block") (PRG-05: "We just have to explain it a little bit better"). **One algorithm** for reps, sets and volume at every level and model: no level-specific rep schemes (PRG-06; the UL upper-day 3×8 → 4×12 rise was a fill error). Athletic 'STARTING / MID / ADVANCED' off-season templates are blocks or levels "depending on whatever is needed" (PRG-04); PROPOSED decision rule: an off-season of 16+ weeks for an L1-L2 athlete runs them as consecutive blocks, otherwise pick by level (06). The L1/L2 boundary is read as **12 months of consistent training** (his intermediate definition is "consistently gone to the gym for over a year"; his "less than 6 months" reads as the core of novice) (INFERRED from PRG-05).

### 3.4 Pending (levels)

- Zone 1 vs zone 3 (both external-rotation, vertical): is the difference only arms low vs arms overhead / deep squat? Does support (seat, machine) bring an overhead exercise down to foundational? (round 2)
- How the generator should use rotation bias: balance it across the week, bias by sport, or only for pain swaps? (round 2; default PROPOSED: tag only, used for pain swaps and to keep both biases in every week)
- Angle cut-offs of the zones (INFERRED in `01_taxonomy.json > F.DZONE`).
- Power clean / power snatch filed INTERMEDIATE by v1 (BYOP files ADVANCED) under ATH-10 "intermediate plus ... full scope" (INFERRED application).

---

## 4. Library and catalog changes

### 4.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| C1 | **Default exercise in every slot plus a dropdown of swaps within the same category.** "That's going to be important." | COACH-ANSWER GEN-04 |
| C2 | **Only BYOP-library items (plus items a coach answer added) can be the default pick**; reference-tab and program-only exercises are dropdown swaps. | COACH-ANSWER CAT-07 (application in 02) |
| C3 | **The client's preference can choose between alternatives**; older/injured lean machine or DB, experienced lean barbell. | COACH-ANSWER EQ-10 |
| C4 | **No implement named → bodyweight → DB → barbell as level rises**, limited by the client's kit. | COACH-ANSWER EQ-09 |
| C5 | **Spelling is corrected in the generator only; his sheets stay as they are.** | COACH-ANSWER FIX-04 |
| C6 | **Program and day names must be generic and understandable** ("no one's going to know what Justice League means"). | COACH-ANSWER FIX-03, ATH-13 |
| C7 | **A short cue per exercise in his voice plus his instruction block at the top.** | COACH-ANSWER GEN-07 |
| C8 | **A video for every exercise** ("we need more links ... that's a lot of work but needs to get done"). | COACH-ANSWER GEN-06 |
| C9 | **Near-duplicates are merged.** | COACH-ANSWER LIB-17 |
| C10 | **No V-squat, ever** (generator never offers it). | COACH-ANSWER GEN-08; OBSERVED SQ |

### 4.2 His decisions on specific items

| Item (verbatim where it matters) | Decision | ID |
|---|---|---|
| 'LEFT TEST'; '5/10/05' (stored as a date) | L-test / L-drill (3-cone); 5-10-5 pro-agility shuttle | LIB-01 |
| 'Push up Stick the Landing' | hands **start on a box and land on the floor**; 'Push up Box Jump' set-up still INFERRED (floor → box) | LIB-02 |
| second 'Low Depth Drop' | the single-leg or weighted variant (new record) | LIB-03 |
| advanced 'Hurdle Hops' | taller hurdles + continuous quick contacts | LIB-04 |
| two MODERATE plyo columns (plate hops, hurdles) | an intermediate athlete takes one from each | LIB-05 |
| throws | no levels, "just do them right"; medball 'ALL LIST' = 1 × 10 per throw (~19 throws) | LIB-06, LIB-22 |
| 'Snatch' / 'Clean' / 'Clean & Jerk' (no 'Power') | full squat versions, renamed **Squat Snatch / Squat Clean / Squat Clean & Jerk**; 'Weighted squat to calf raise' with **any implement** | LIB-07 |
| 'GHD' (in MODERATE and ADVANCED) | no levels; one record | LIB-08 |
| 'Camporini Deadlift'; 'strap rotating in/out' | **removed** | LIB-09 |
| 'Alternating DB/Barbell Deadlifts' | alternating **staggered-stance single-leg** deadlifts (half step back, switch legs each rep) | LIB-09 |
| 'Single Leg Get Ups' | sit-to-stand on one leg from a box/bench = **box pistol** (other foot may touch for balance) | LIB-09 |
| 'Low DB Squats' | DBs **hanging at the sides**, arms down (not goblet, not racked) | LIB-09 |
| 'Kong Row' | **double-KB row from the floor**, hinge stance; for shoulder or back pain; low stimulus, not advanced | LIB-09 |
| 'Pull under' | **lat pull-over** (cable) | LIB-09 |
| 'KB Face Pulls' under VERTICAL PULL | **unanswered**: kept as a swap only, never the default vertical pull | LIB-10 |
| second 'Standing DB Press' | the standing **barbell** press | LIB-11 |
| 'Bench Push ups' | **unanswered**: v0 reading kept (hands on bench FOUNDATIONAL AD13, feet on bench ADVANCED AF11) | LIB-12 |
| push press / push jerk | push press easier (FOUNDATIONAL, incl. DB / single-arm / seesaw); push jerk INTERMEDIATE-ADVANCED | LIB-13 |
| thrusters (Bilateral KD ADVANCED) | conditioning-leaning; quads 1.0 + shoulders 0.5 | LIB-14 |
| leg extensions '-ADVANCED', leg curls 'UNILATERAL' | typos: every level; lying and seated curls are bilateral | LIB-15 |
| upright rows; dips | upright rows = side delts; dips "more tricep than chest but still .5 and .5", push day | LIB-16 |
| near-duplicates (seated DB curls, 'Side Plank' / 'Side Planks') | merged | LIB-17 |
| '21.6 mile run' | the coach calls it "a marathon, don't know when/where we need that"; **flag: a marathon is 26.2 mi**; not offered as a test | LIB-18 |
| CARRY, DRAGS, sling systems (empty) | build them out: carries/drags for athletes and general fitness; slings for advanced athletes and rehab; implements farmer handles, trap bar, KB, sandbag, sled | LIB-19 |
| frontal/transverse lower-body moves ('Hold between knees Squats', Cossacks) | add to the library for court and combat athletes | LIB-20 |
| speed session (Sheet23) | fixed order squirrel jumps → MACH drills / acceleration starts → max velocity; MACH and A-drills added | LIB-21 |
| CARDIO dropdowns (stop at row 122; miss DISTANCE 200-1000 m and CALORIES) | the generator's cardio menus include the **DISTANCE (200-1000 m) and CALORIES** items, kept "logical": grouped by colour (Blue A / Green B / Orange C / lactate clearance), then by unit (time, distance, calories); his sheet is not edited (FIX-04 rule) | FIX-02 |
| 'LEG CURLS' (BYOP) / 'LEG FLEXION' (Sheet25 H11) | LEG FLEXION pool (code KFLEX): machine curl, Nordic, prone DB curl, slider curl, ball curl moved out of hip dominant | CAT-09 |
| VERTICAL PUSH has no machine | add **Seated Machine Shoulder Press** | EQ-05 |
| belt squat | add (no axial load; for clients already loaded or sore that week) | EQ-11 |

### 4.3 Out of scope and retired (02 v1)

- **36 band, chain or weight-releaser items → `out_of_scope`**, each with a non-band replacement: 15 variable-resistance lifts and plyos, 9 band-only exercises, 8 knee-banded anti-rotation chops (→ the coach's 'Hold object Adducted between knees' twins), 4 modifiers (BANDS, CHAINS, WEIGHT RELEASERS, reverse-band). 18 kept records lost their band set-up; 'Assisted Pull-up' and 'Assisted Dips' are '(machine)'. **0 active records use a band.** (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12)
- **10 records retired**: Camporini deadlift, both strap rotating in/out squats (LIB-09), 7 near-duplicates merged into their twins (pull-under → lat pull-over, two conventional deadlifts, two pronated barbell rows, two deficit reverse lunges, BALLISTICS 'drop and jump' → Depth Jump, two weighted drop-release-jump pairs) (LIB-17, LIB-09).
- Kept in the JSON with `record_type` 'out_of_scope' / 'retired' so every crosswalk id still resolves.

### 4.4 New records (02 v1)

| Record | Why | Status |
|---|---|---|
| Seated Machine Shoulder Press | EQ-05 | coach-approved |
| Belt Squat | EQ-11 | coach-approved |
| Low Depth Drop - Single-Leg or Weighted | LIB-03 | coach-approved |
| Beginner Olympic options: hang cleans without bumpers, single-arm DB snatch, KB squat clean, hex-bar squat jump (also in the triple-extension pool) | ATH-10 | coach-approved as options; library placement asked (round 2) |
| MACH drills, A-march / A-skip / A-run, acceleration starts, falling-start accelerations; max-velocity sprint moved from PLYO to SPRINT | LIB-21 | coach-approved; A-drills = warm-up, never volume (ORD-08) |
| Hold-object-between-knees squat, Cossack lateral lunge, split-stance contralateral single-arm KB swing | LIB-20 | coach-approved |
| 9 starter carries and drags (farmer handles, trap bar, KB, sandbag, sled) | LIB-19 | PROPOSED |
| KB curl, table inverted row, prone floor Y/T raises (home gaps: KB-only has no curl; bodyweight-only has no row/raise) | 02_no_equipment_subset | PROPOSED |

### 4.5 Catalog in numbers (02 v1)

913 records; **707 active exercise-like records** (ATHLETIC 236, RESISTANCE 289, CONTROL 81, FUNCTIONAL 21, CARDIO 80); 360 default candidates; 351 selectable in a BYOP dropdown, 215 reference-only, 121 program-only, 2 added by coach answers, 9 PROPOSED. Laterality: bilateral 401, unilateral 139, alternating 71. Plane: sagittal 524, transverse 80, frontal 45, multi 37. Constraint 1/2/3/4/5: 281/212/144/42/28. 136 of 707 active records carry a video link. 383 records carry a `v1_changes` log (608 entries, question ID + change + evidence).

**New per-record fields**: `generator` (eligible, pools, default_candidate, why), `volume_credit` (per set, `counts_toward_muscle_volume`, unilateral `set_counting`, `by_pool`), `constraint_level`, `davidson_zone`, `axial_spinal_load`, `population_rules`, `athletic_quality` + `plyo_method` (as named; `plyo_methods_available`), `implement_load` (medball ≤ 20 lb), `coach_cues`, `speed_session`, `plyo_moderate_track`, `delt_head`, `level.generator_min_level`, `modality_v1` (any erg), `warmup_role_v1`.

### 4.6 Pending (library)

- LIB-10 (KB face pulls → rear delts?) and LIB-12 (bench push-ups hands vs feet) unanswered (round 2).
- LIB-18: 21.6 mi vs 26.2 mi marathon (round 2: proposal = remove it; the Hinshaw half-marathon plan stays the longest run).
- Add belt squat, seated machine shoulder press, the ATH-10 beginner Olympic options and the home-gap fixes to the MASTER EXERCISE LIBRARY, with a level (round 2).
- ~120 program-only exercises (e.g. 'SL RDL' 49 uses, 'JM PRESS', seal rows): swap-only until he adds them to BYOP (CAT-07 application).
- The 9 PROPOSED carries/drags and which slot they feed (core block, warm-up or conditioning); POSTERIOR OBLIQUE and LATERAL SUBSYSTEM still empty.
- Videos: 571 of 707 active records without a link; 85 exercises he actually uses have none: film those first (13 §7.3).
- Spanish names (`name_es`) for every record (GEN-01).
- Front raises sit in the 'ABdution' side-raise pool (never asked).

---

## 5. The volume engine

Full version: `12_volume_algorithm_v1.md` / `.json` (research, engine, pseudo-code, four computed examples), with the coach-side corrections recorded in `03_volume_dosing.md` (v1 conflicts 1-6) and §0.3 above. The coach asked for this ("go find some charts ... match them with my experience", VOL-01; "what would be the best algorithm for us?", UNI-01; "I need this tool ... to figure out the percentages", VOL-06), so every number he did not give is PROPOSED.

### 5.1 Confirmed rules (one page)

| # | Rule | ID |
|---|---|---|
| V1 | Unit = **weekly hard sets per muscle**. A hard set = a working set at 1-3 RIR, 5-30 reps; warm-up sets and A-drills never count. | VOL-04, VOL-13, ORD-08 |
| V2 | **Main mover 1.0, helpers 0.25.** Dips 0.5 triceps + 0.5 chest. Thrusters 1.0 quads + 0.5 shoulders. Leg extension and leg curl count fully. | VOL-09, LIB-16, LIB-14 |
| V3 | **A 10/10 unilateral set = 1 set** to the primary muscle (RFE lunge → quads); alternating lifts count the same way. | UNI-01, UNI-07, PRG-07 |
| V4 | **Athletic work never counts** toward muscle sets (plyos, ballistics, throws, Olympic lifts, sprints, COD). | VOL-10 |
| V5 | **Starting weekly sets**: beginner **10-12**, intermediate **15-20**, advanced **20+**. 15-20 = maintenance to a little growth; 20-25 = growth; 5 too little, 40 too much. | VOL-01, UNI-01 |
| V6 | **Priority muscle**: +4 to +6 sets on the start, cap about 25-30, 1-2 at a time; its exercise goes first in its session. | VOL-02, ORD-04 |
| V7 | **Pain**: that muscle or pattern -30 to -50 %, move it to constrained machines or split grips, or drop the exercise; a bilateral lift swapped to unilateral keeps its sets "ideally, but adjust accordingly". | VOL-03, UNI-08, EQ-03 |
| V8 | **Weekly increase = 3, 5 or 7 % of that muscle's weekly sets, chosen by the person's state** (fatigue, life, response), never by muscle size; the coach can adjust it; **10 % a week is too much**. Load and volume load are tracked, not driven by %. | VOL-04, VOL-05, UNI-05 |
| V9 | **Bank the fraction; add a whole set when the bank reaches 1.** The tool computes the percentages; the client never sees them. | VOL-06 |
| V10 | **New sets go to the first exercise of the day for that muscle, then the next**: 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3. **3-4 exercises per muscle group per day.** | VOL-07 |
| V11 | **Small muscles at the end of a session** (biceps after a back day) get extra volume as a **bonus exercise**. | VOL-07 |
| V12 | **Focus 1 / Focus 2** may hit the same muscle, 2-3 sets each, to bring a priority up to target; optional days are add-ons or separate (ideally separate). | ORD-10, ORD-11 |
| V13 | **Calves 3 sets every leg day** (single-leg on a ramp/plate/deficit, or bilateral); **rear delts get their own sets**; **about 2 core exercises** per session. | VOL-17 |
| V14 | **Default sets when blank**: 3 on compounds, 2 on isolation; **2 per slot in athletic templates**. | VOL-16 |
| V15 | **Session size**: resistance sessions 5-7 exercises (45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); off-season field athletes up to 10-12; athletes/bodybuilders/powerlifters ~1.5 h (max 2 h); general/weight loss 45-60 min; unilateral time must be accounted for. | VOL-08, VOL-16, VOL-17, UNI-09 |
| V16 | **Unilateral volume progresses like bilateral.** | UNI-05 |
| V17 | **Unbalanced templates are not intended**: balance to the targets; a V-taper bias is allowed when the athlete wants it. | VOL-18 |
| V18 | **Week-to-week adjustment** from logged EFFORT and HOW IT FELT: 'Felt a PAIN' → swap within the category or lower the level; EFFORT 9-10 → hold or cut sets; EFFORT ≤ 6 → add. | GEN-05 |
| V19 | **Smooth weekly increases** for hypertrophy and general clients; **2-week steps and waves** for fight or competition prep. | PER-10 |
| V20 | **The tool learns from everyone's data over time** ("it just gets better and better"); priority numbers adjusted "over time" from data. | VOL-01, VOL-02 |

### 5.2 Counting: the credit map (coach count; `12 > counting.credit_map`)

| Category | 1.0 | 0.5 | 0.25 | Status |
|---|---|---|---|---|
| Bilateral knee dominant (squat, leg press, hack, belt squat) | quads | - | glutes, adductors | VOL-09; glute/adductor values PROPOSED |
| Unilateral knee dominant (split squat, lunge, step-up) | quads | - | glutes, adductors | UNI-01 ("mostly quads"); values PROPOSED |
| Hip dominant (deadlift, RDL, SL RDL, back extension) | hamstrings | - | glutes | VOL-09, UNI-01 (helper 0.25); 0.5 co-mover alternative PROPOSED as a switch (round 2) |
| Glute isolation (hip thrust, bridge, kickback, abduction) | glutes | - | hamstrings | PROPOSED |
| Leg flexion (curl, Nordic, slider/ball curl) | hamstrings | - | - | CAT-09, VOL-09 |
| Leg extension | quads | - | - | VOL-09 |
| Horizontal push | chest | - | triceps, front delts | VOL-09 (his bench example) |
| Vertical push | front delts | - | side delts, triceps | VOL-09 |
| Dips | - | triceps, chest | - | LIB-16 |
| Thruster | quads | shoulders (front delts) | - | LIB-14 |
| Horizontal pull (incl. Kong row) | lats/upper back | - | biceps, rear delts | VOL-09, LIB-09 |
| Vertical pull | lats/upper back | - | biceps | VOL-09 |
| Lat pull-over ('Pull under') | lats/upper back | - | - | LIB-09 |
| Isolation (fly, side raise / upright row, rear-delt fly / face pull, curl, triceps, calf raise) | target muscle | - | forearms on curls | VOL-09, LIB-16 |
| Core | abs/obliques | - | - | CAT-08 |
| Plyo, ballistic, throw, Olympic, sprint, COD | **none** (own budget, §9) | | | VOL-10 |

Other conventions: MYO set = 2 hard sets, only on the last machine or isolation exercise (INFERRED; VOL-15). The engine **steers on the coach count** and also stores the **Pelland count** (indirect sets 0.5; the best-fitting count in Pelland et al. 2026) so the data can later show which predicts progress better (PROPOSED; SCIENCE). Reps are stored as text, never numbers or dates (OBSERVED: Sheets turned '12/12' and '5-10-5' into dates).

### 5.3 Starting table (aesthetics / hypertrophy; coach count; `12 > starting_table`)

| Muscle | Class (CAT-02) | Fill policy | L1 start | L2 start | L3 start | Cap L1 / L2 / L3 | Priority start add / cap | Tag |
|---|---|---|---|---|---|---|---|---|
| Quads, hamstrings (hinge + leg flexion), glutes, chest, lats/upper back | big | target (athletes: glutes by credit) | **10** | **15** | **20** | 14 / 22 / 25 | +4 / +5 / +6; cap 18 (L1), 26 (L2, chest 26-28), 30 (L3) | starts COACH-ANSWER VOL-01; caps, L3 start = low end of "20+", per-level priority split PROPOSED |
| Side delts, biceps, triceps | small | target (athletes: credit) | 8 | 12 | 15 | 12 / 18 / 22 | +4; cap 16 / 22 / 26 | ~80 % of big-muscle start PROPOSED |
| Calves | small | target | **3 sets every leg day** (6-12) | same | 3-4 per leg day | 16 / 18 / 24 | +4; cap 20 / 22 / 26 | COACH-ANSWER VOL-17; caps PROPOSED |
| Rear delts | small | target (own sets) | 4 | 6 | 8 | 8 / 12 / 16 | +4; cap 12 / 16 / 20 | own sets COACH-ANSWER VOL-17; numbers PROPOSED |
| Abs / obliques | small | core block | **2 exercises × 2 sets per session, first** | same | 2 × 2-3 | 16 / 20 / 20 | - | COACH-ANSWER VOL-17, ATH-11; counting PROPOSED |
| Front delts, traps, forearms, adductors, neck | unplaced | floor: credit only, reported, never filled | - | - | - | - | direct slot only if chosen | CAT-02 gap; PROPOSED |

**L1 priority cap** (PROPOSED; coverage audit 2026-10-08): the L1 cap + 4 sets (big 18, small 16, calves 20, rear delts 12). Before the audit no L1 priority cap existed, so a beginner's priority muscle (10 + 4 = 14) started at the non-priority cap of 14 and could never grow. His "cap about 25-30" (VOL-02) is read as the L2-L3 ceiling.

**Why small muscles start at ~80 % (PROPOSED).** Time: with 5-7 exercises a session, a 4 × 60-min beginner week holds about 78 working sets (computed in 12 §5.1), so every muscle at 10-12 does not fit until supersets are used; untrained arms grow about as well from multi-joint lifts alone (Gentil 2015, SCIENCE); 8-12 sets sit in Pelland's high-to-intermediate efficiency tiers. One switch in the JSON sets them equal to the big muscles if he prefers. **Floors**: big muscles 4, small 2 (≈ research maintenance), unless a sport profile removes a muscle on purpose (PROPOSED).

**Goal, phase and population modifiers** (multiply the starts; `12 > goal_phase_modifiers`; factors PROPOSED unless tagged):

| Situation | Lower | Upper | Small | Notes | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding | 1.0 | 1.0 | 1.0 | same-pattern pairing allowed | VOL-01, UNI-06 |
| Strength / powerlifting | 1.0 | 1.0 | 0.75 | preference moves reps on big lifts; weekly sets similar | VOL-12 |
| General fitness, weekend-warrior athletic | 0.8 | 0.8 | 0.8 | 45-60 min; cross-pattern | UNI-09, UNI-06, ATH-13 |
| Fat loss | 0.8 | 0.8 | 0.8 | + 3 aerobic sessions/week; step ≤ 3 % in a calorie deficit (PROPOSED, 06) | ATH-07 |
| Bootcamp | timed circuits, not set-based | | | 5-7 stations × 3-5 rounds × 30-50 s, 35-45 min | PRG-03 |
| Field/court athlete off-season | 0.7 | 0.5 | credit only | resistance = 3-4 exercises after core, plyo and Olympic work | VOL-08, VOL-17, UNI-02 |
| Strength-type athlete off-season (linemen, wrestlers, rugby, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6 | "more resistance" group | ATH-03 |
| Athlete pre-season | 0.6 | 0.4 | credit | more speed/power, less volume | PER-08 |
| Athlete in-season | 0.4-0.5 | 0.3-0.4 | credit | 2 days/week, step 0 %, minimal bilateral | PER-08, UNI-10; SCIENCE Bickel 2011, Spiering 2021 |
| Boxer / striker, high-punching weeks | as profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | **reduce, never cut** | ATH-04 |
| Older adult (60+) | as goal | as goal | as goal | default step 3 %; extra volume on constraint 4-5 machines; maintenance floor 70 % | EQ-03, EQ-04, ATH-09; SCIENCE Borde 2015, Fragala 2019, Bickel 2011 |
| Sex | - | - | - | **no sex-based rules** | ATH-09, GEN-02 |

### 5.4 The weekly step: 3, 5 or 7 %, chosen by the person

**Confirmed frame**: one step per person per week, applied to every muscle's weekly sets; never by muscle size; coach can adjust; 10 %/week is too much (VOL-04, VOL-05, UNI-05). **Mechanism** (PROPOSED; §0.3 decision):

**(a) Gates, checked first** (COACH-ANSWER GEN-05 unless tagged):

| Gate | Effect |
|---|---|
| "10 - I'm done" | logbook: that exercise -1 set next week; on 2+ exercises → hold for everyone. Check-in only (per-day rating): any day rated 10 → hold, and -1 set on that day (the set most recently added) |
| Median EFFORT ≥ 9 for the week | hold |
| 'Felt a PAIN' | pain protocol (§5.7); that muscle 0 % |
| Fewer than half the planned sessions done | repeat the week (hold) (PROPOSED) |
| Hold two weeks in a row, or 'Felt a PAIN' on 2+ exercises in one week | deload next week (PROPOSED) |
| Median EFFORT ≤ 6 | at least +5 %, and raise load or reps first |

**(b) The step table for the weekly check-in** (13 §2.3; PROPOSED; every cell coach-editable):

| Average session EFFORT ↓ / Life this week → | Better than usual | Normal | Harder than usual | Much harder (sick, travel, no sleep) |
|---|---|---|---|---|
| 1-6 ('Way Too Easy' … 'Broke a Sweat') | +7 % | +7 % | +5 % | hold |
| 7-8 ('That was tough' / 'That was perfect' = the target) | +5 % | +5 % | +3 % | hold |
| 9 ('That was terrible') | +3 % | hold | hold | hold |

**(c) EFFORT is read against the set's target** (PROPOSED; 03 tension 24): "leave 1 rep in the tank" is RPE 9 on the RIR scale, but the BYOP menu calls 9 'That was terrible'. So the client rates each set or session against what the plan asked: **'8 - That was perfect' = I hit the target RIR**, 9 = harder than planned, 10 = failed or wrecked. Without this, a client doing exactly what he asks (1 RIR) logs 9 and the plan never grows. (Round 2.)

**(d) Before any check-ins (static plans)** (PROPOSED; 12 §3.7): default **5 %**; **3 %** if any of: high stress, under 6 h sleep, physically hard job or heavy sport practice, age 60+, back from a 6+ month layoff (first block), pain declared; **7 % never before check-ins earn it**. Target-seeking: the plan uses the smallest of 3/5/7 % that lands the cap in the final phase, so L1 and L2 run 5 % and **L3 runs 3 %** (at 5 % an advanced lifter hits the cap by week 7, too early for "last weeks hardest").

**(e) Ceilings and limits**: the **person's total weekly resistance sets must rise less than 10 %** week over week (exempt: returning from a deload to the pre-deload volume; block-boundary swaps that add no sets) (UNI-05; exemptions PROPOSED). When several muscles would release a banked set in the same week and the total would reach +10 %, the muscles with the smallest bank wait one week (PROPOSED, 06 §7.1). The coach (or a client he allows) may **set the step by hand from 0 to 7 %** (§0.3). Phase limits: 12-week acclimation weeks ≤ 3 %; 8-week weeks 1-4 ≤ 5 %; maintenance blocks 0 %; in-season 0 %; fight/competition prep may step every 2 weeks (PER-10) (limits PROPOSED). While a priority runs, other muscles ≤ 3 %/week (PROPOSED).

**(f) The readiness score** (12 §3.7; PROPOSED as the logbook / learning score): R = 0.40 × effort + 0.20 × completion + 0.20 × performance + 0.20 × life; R ≥ 85 → 7 %, 70-84 → 5 %, 55-69 → 3 %, < 55 → hold. Checks (12 §3.7; life scored normal 70, poor 40, good 100): all EFFORT 8, all sets done, flat lifts, normal life → R 76 → 5 %; EFFORT 7, lifts up, good life → 94 → 7 %; EFFORT 8, 80 % done, flat, poor sleep/stress → 66 → 3 %; EFFORT 8, 60 % done, lifts down, poor life → 54 → hold. Used when full logbook data exists (v1.1+), and fitted to outcomes in the learning phase (§5.9).

**SCIENCE behind a person-based step**: life stress slows strength gains (Bartholomew 2008) and recovery (Stults-Kolehmainen 2014); short sleep lowers multi-joint force (Knowles 2018); autoregulated loading works as well as fixed percentages (Hickmott 2022); people misjudge RIR by about one rep, so effort is used as a trend (Halperin 2022). At 15-20 sets, 3 % ≈ +0.5 set/week, 5 % ≈ +0.8, 7 % ≈ +1.1: about RP's "+1 set per week" at the top end; big jumps (+30-60 %, Barsuhn 2024; +4-6 sets every 2 weeks, Enes 2023/24) add strain without reliably adding growth. In other sports the "10 % rule" is weakly supported (Nielsen 2013; Gabbett 2016 vs Impellizzeri 2021): a sensible ceiling, not a target.

### 5.5 Banking and placement (where each new set goes)

```
every week, for each target muscle m (priority first, then big, then small):
    bank[m] += step x weekly_sets[m]
    while bank[m] >= 1 and weekly_sets[m] + 1 <= cap[m]:
        if the person's total would rise >= 10 % this week: stop (smallest banks wait)        # UNI-05
        if not place_set(m): bank[m] = min(bank[m], 1.99); break                              # no room
        bank[m] -= 1
    if weekly_sets[m] >= cap[m]: bank[m] = 0; progress load / reps / intensifiers instead

place_set(m):
    1 day:          rotate through the days that train m as a main mover (A, then B ...)           # PROPOSED
    2 laterality:   bilateral share > 3 points below target -> a bilateral exercise; > 3 above -> unilateral   # PROPOSED (UNI-02 x VOL-07)
    3 in the day:   the first exercise (session order) whose sets < the first exercise's sets; if all equal, the first   # VOL-07
    4 limits:       sets per exercise <= 4 (L1) / 5 (L2-L3), isolation <= 4, minimum 2;
                    m's sets per session <= 11 fractional (priority 14); session minutes <= the client's limit   # PROPOSED; SCIENCE ~11
    5 no room:      superset the lower/upper pairs if that frees the time                           # ORD-05
                    small muscle -> bonus exercise (2 sets, same category) on the optional day, else the shortest training day   # VOL-07, ORD-10
                    big muscle   -> Focus slot (2 sets) on the optional day, else a day that already trains the region           # ORD-11
                    else the bank waits; progress by load, reps, MYO (last machine/isolation), supersets                         # VOL-15
    6 hard rules:   core first; hip + push / knee + pull; no second axial day; row before pulldown; power before strength;
                    no bands; exercises fixed inside the block                                      # ATH-11, UNI-11, PER-04, ORD-01, ORD-03, EQ-01, PER-02
```

**Computed check** (team venv, `scratchpad/brain_v1/checks.py`): the in-day rule gives exactly his sequence **2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 → 4/4/3**. Reference curves for one big muscle in a static 12-week plan (acclimation ≤ 3 %, then the planned step):

| Level | Step | Weeks 1-12 (weekly sets) | Cap reached |
|---|---|---|---|
| L1 | 3 % (wk 2-4), 5 % | 10, 10, 10, 10, 11, 11, 12, 13, 13, 14, 14, 14 | week 10 |
| L2 | 3 % (wk 2-3), 5 % | 15, 15, 15, 16, 17, 18, 19, 20, 21, 22, 22, 22 | week 10 |
| L3 | 3 % | 20, 20, 21, 21, 22, 23, 23, 24, 25, 25, 25, 25 | week 9 |

These match 06 §7.1. Once a muscle is at its cap the "hardest" last weeks are harder by load, reps and intensifiers, not more sets. The chat example "chest 20 → 22 sets" is a +10 % week; at 5 % the engine reaches 22 in two weeks (+1, +1) (computed; COACH-CHAT vs UNI-05).

**Two A-days in one week** (A1 Monday, A2 Thursday): added sets alternate between them so both stay balanced (PROPOSED; round 2).

### 5.6 Session limits and the time model

| Limit | Value | Tag |
|---|---|---|
| Resistance exercises per session | 5-7 ("usually 7" at 60 min); 45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 | COACH-ANSWER VOL-08, VOL-16 |
| Field athlete, off-season, far from competition | up to 10-12: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance (12 excluding the core block = 14 with it) | COACH-ANSWER VOL-08, VOL-17; counting INFERRED |
| Exercises per muscle group on its day | 3-4 (split days); on 5-7-exercise full-body days each muscle gets 1-2 and the rest comes from frequency, Focus and bonus slots | VOL-07; full-body reading PROPOSED (round 2) |
| Session length | athletes, bodybuilders, powerlifters, pros ~90 min (max 120); general / weight loss 45-60; bootcamp 35-45; non-competitive athletic 60 (PROPOSED); older/injured 45-60 (PROPOSED) | COACH-ANSWER UNI-09, PRG-03 |
| Outside the exercise cap, inside the time budget | warm-up, core block, conditioning finisher; a superset of two small isolations counts as one station | PROPOSED (05 §7.2) |
| Per muscle per session | soft 11 fractional sets, priority 14 | SCIENCE Remmert (~11), RP (8-12); values PROPOSED |

**Time model** (PROPOSED; minutes per working set including rest): warm-up 8 per session (ORD-08: 5 min cardio + drills); core set 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 × bilateral, UNI-09 "has to be accounted for"); isolation 1.75 (unilateral 2.5); plyo/ballistic 1.5; Olympic 3.0; throw 1.25; supersetted pair × 0.65. Capacity for mixed hypertrophy work: **45 min ≈ 13-14 sets, 60 ≈ 19-20, 75 ≈ 25-26, 90 ≈ 31-32**; supersets add ~25-35 %. 05 §7.4 carries a slightly finer per-station model; both agree within a few minutes on his filled days (AESTHETICS Day 1 ≈ 51 min straight).

### 5.7 Pain and injury

| Trigger | Action | Tag |
|---|---|---|
| Pain area at intake | affected muscle/pattern starts at 50-70 % (-30 to -50 %); its exercises move to constraint 4-5 machines or split grips; painful positions excluded; that muscle's step 0 until 2 pain-free weeks | VOL-03, EQ-03; 2-week rule PROPOSED |
| 'Felt a PAIN' once | next exposure: swap within the category to a more constrained, split-grip or unilateral variant, or one level down; keep the sets if possible | UNI-08, GEN-05 |
| Same slot again | that slot -30 to -50 %; muscle step 0; removed sets may move to a pain-free exercise for the same muscle (hinge pain → leg curl + hip thrust) | VOL-03; move PROPOSED |
| Third time | drop the exercise for the block; flag for the coach (and "see a professional" in self-serve) | VOL-03 |
| Pain and laterality | shift the bilateral share 20 points toward the pain-free side (low-back pain under axial load → unilateral/belt squat/machines; knee/hip pain in single-leg → bilateral machines) | UNI-02 ("adjust accordingly"), EQ-11; 20 points PROPOSED |
| 'Felt the WRONG muscle' | change one variable in the same category; volume unchanged | GEN-05, PER-02 |
| "Couldn't do it" | one level down or an assisted version; volume unchanged | GEN-05 |
| His observed pain text | '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help' (MM 05 A6) | OBSERVED |

### 5.8 His numbers against the research (12 §2.2)

| His number | Research | Verdict |
|---|---|---|
| Beginner 10-12 (VOL-01) | top of Pelland 2026's high-efficiency tier (5-10 → next detectable gain every ~6 sets); Schoenfeld 2017's best band (10+); floor of Baz-Valle 2022's 12-20 | **Matches** |
| Intermediate 15-20 = "maintenance to some growth" (VOL-01, UNI-01) | Pelland intermediate tier (11-18); Baz-Valle standard; Aube 2022 best at 18 | **Matches as a productive baseline**; true maintenance needs far less (Spiering 2021, Bickel 2011) |
| Growth 20-25, advanced 20+ | Pelland lower-efficiency tier (19-29): more growth, each step costs ~11 more sets | **Matches for trained people, for limited periods** |
| Priority cap 25-30 (VOL-02) | edge of Pelland lower/lowest tiers; inside RP priority ranges (chest MRV*P 24-32+) | **Matches for 1-2 muscles** with others held back |
| "5 too little, 40 too much" | 5 = Pelland minimum dose; 40 = lowest efficiency, little data | **Matches** |
| "10 %/week too much" | no direct trial; set-increase studies favour small, individual steps | **Supported indirectly** |
| Deload "about half the sets" (PER-05) | Bell 2023 Delphi (cut sets and proximity to failure); Rogerson 2024 (79 % cut sets, every ~5.6 weeks) | **In the middle of practice** |
| 4-6-week maintenance at 50-70 % (PER-01) | Bickel 2011 (1/3 dose kept size in young adults; older adults need more), Spiering 2021 | **Well supported**; older adults keep ≥ 70 % (PROPOSED) |

Counting note: Pelland counts indirect sets at 0.5; the coach counts helpers at 0.25. For chest, quads, hamstrings and back both counts are almost equal; for glutes, arms and delts the coach count is lower for the same program (hence the dual count, §5.2).

### 5.9 How the engine learns (PROPOSED; 12 §3.14, 13 §7.5)

- **Log** (only for people who choose the check-in or logbook): per exercise DONE, reps or "hit target", WEIGHT USED or SCORE, EFFORT (his menu), HOW IT FELT (his menu), pain area; per week sleep, stress, energy, body weight, reason for missed sessions; per block the tests ticked.
- **Tune, in order**: each person's step band → each person's cap (the weekly sets where lifts stall and EFFORT climbs for 2+ weeks become next block's cap minus 1-2) → each person's next start → population tables by level × goal × age band × sport (a cell changes only after ~200+ completed blocks **and with the coach's approval**; no sex-based cells) → helper credit 0.25 vs 0.5 → readiness weights.
- **Guardrails the learning can never remove**: weekly increase < 10 %; pain protocol; deload ≈ half; spine loaded once a week; core first default; older-adult exclusions; no bands / variable resistance; priority cap 30; locked Blaze rules and coaches' added rules (GEN-08). Parameter sets are versioned; research data only from consenting adults (13 §7.5).

### 5.10 Pending (volume)

PROPOSED - PENDING COACH APPROVAL (12 §7, 03, 06): small muscles at ~80 %; rear delts 4/6/8; glute credit on hinges (default 0.25 by his helper rule; 0.5 co-mover alternative) and squats/lunges (0.25); the L1 priority cap (L1 cap + 4); the L3 definition; the step table (or the R score) and the EFFORT-against-target reading; the before-logs step; acclimation ≤ 3 % and 8-week ≤ 5 %; no fixed deload; next-cycle ×1.05 / cap +1; maintenance base and 50/60/70 % split; non-priority ≤ 3 %; per-session ceilings; the core block counted to abs; the time model; two A-days alternating; bonus-exercise placement; V-taper mechanism (side delts + lats up, chest held; PROPOSED); heavy low-rep unilateral option parameters (UNI-04: optional; PROPOSED 4-6 per side on split squats, step-ups and single-leg RDLs for L2+ athletes or on request). **Retired**: every big = 3 % / small = 7 % mapping (`generator_spec_v0.json > rule_tables.muscles.list[*].rate`, `.focus_rule`, `progression.engine.rates`; 03 §9.6 v0; 06 size tiers), helpers 0.5, glutes 1.0 from every hinge/lunge, glutes 0.5 on hinges as the default (v1 draft; retired by the coverage audit), release chunks of 1-2 sets, round-robin placement, "≤ 2 exercises per muscle per session", the v0 peak-week table and L4, the 0.85 × W1 deload, athletic sets as 0.5 fatigue sets.

---

## 6. Bilateral vs unilateral

The coach called this relationship "very important" (COACH-CHAT). His answers now define it.

### 6.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| B1 | **The share runs from 90/10 to 10/90 by athlete**, adjustable, and pain adjusts it. "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." | UNI-02 |
| B2 | **Bodybuilders and powerlifters**: about 50/50 at the start ("a small foundation"), then 80/20 or 90/10 bilateral as the program drives size and strength. | UNI-02 |
| B3 | **Field athletes with change of direction** (tennis, soccer, basketball, football skill): 80-90 % unilateral in the gym; bilateral = health/strength foundation of tissues and joints. | UNI-02, UNI-03 |
| B4 | **Upper body follows the same logic.** | UNI-03 |
| B5 | **In season, bilateral work is minimal** (maintain strength and potentiation; unilateral keeps range of motion and health). | UNI-10 |
| B6 | **Contralateral load pulls you into the hip** (COD athletes: football route runners, soccer, basketball, tennis; also builds missing hip range); **ipsilateral helps you out of the hip** (sprint acceleration: ipsilateral step-ups); for **bodybuilders and powerlifters both are health accessories**, mostly in the first 2-4 weeks, kept later only "if there is anything bugging them". | CAT-13 |
| B7 | **More frontal/transverse unilateral work** (lateral lunges, Cossacks, lateral step-ups, rotational lunges) for court and combat athletes; little for aesthetics. | UNI-12 |
| B8 | **Same-pattern pairing** (squat + lunge) drives a muscle harder (high-level athletes, aesthetics); **cross-pattern** (squat + single-leg hinge) keeps bootcamp clients less sore so they can train more often. "This is a rule by goal." | UNI-06 |
| B9 | **10/10 = 1 set**; alternating = unilateral; unilateral progresses like bilateral. | UNI-01, UNI-07, UNI-05 |
| B10 | **Unilateral reps are moderate-to-high by default**; heavy low-rep unilateral is an option the athlete or coach can switch on. | UNI-04 |
| B11 | **Pain swap bilateral → unilateral keeps the sets "ideally, but adjust accordingly".** | UNI-08 |
| B12 | **Unilateral work takes longer and must be accounted for in the session.** | UNI-09 |
| B13 | **'Split stance ALWAYS contralateral'** (his own library rule, G83). | OBSERVED |

### 6.2 The slider (bilateral share of lower-body knee- and hip-dominant compound sets; leg flexion, leg extension and isolation excluded)

| Profile | Block start (wks 1-4) | Later blocks / off-season | Pre-season | In-season | Upper body | Tag |
|---|---|---|---|---|---|---|
| Bodybuilder, powerlifter (L2-L3) | **50/50** | **80/20 → 90/10** by the peak | - | - | same logic: ~50/50 in weeks 1-4 → 80/20-90/10 (upper numbers PROPOSED; his templates run mostly bilateral up top, OBSERVED) | COACH-ANSWER UNI-02, UNI-03 ("same logic"), CAT-13 *(coverage audit: upper was 80-90 % from week 1)* |
| Field/court COD athletes (tennis, soccer, basketball, football skill, hockey) | **20/80** | **15/85** | 15/85 | **10/90** | 20/80 | COACH-ANSWER UNI-02, UNI-10 (numbers inside his 80-90 %) |
| Beginner aesthetics / general (L1) | 50/50 | 50/50 → 60/40 in later cycles | - | - | 70/30 | PROPOSED |
| Weekend-warrior athletic, bootcamp | 50/50 (cross-pattern) | 50/50 | - | - | 60/40 | PROPOSED |
| Sprinters / acceleration | 40/60 | 40/60 | 30/70 | 20/80 | 40/60 | PROPOSED (force need + ipsilateral step-ups) |
| Strength-type athletes (linemen, wrestlers, rugby, throwers) | 60/40 | 60/40 | 40/60 | 25/75 | 60/40 | PROPOSED (ATH-03) |
| Baseball / softball | 50/50 (OBSERVED 4 + 4 sets) | 50/50 | 35/65 | **20/80** (UNI-10 overrides his ~55/45 in-season sheet) | 30/70 (pitchers less overhead) | OBSERVED; COACH-ANSWER UNI-10, ATH-08; rest PROPOSED |
| Combat (boxing, MMA, karate) | 40/60 | 40/60 | 30/70 | 20/80 | 30/70 rotational | PROPOSED |
| Older / injured | 60/40 on constrained machines + supported unilateral | | | | 70/30 | COACH-ANSWER EQ-03; numbers PROPOSED |
| Pain | 20 points toward the pain-free side | | | | | COACH-ANSWER UNI-02; 20 points PROPOSED |

Per-sport values for all 27 profiles: `04_profiles.json > bilateral_unilateral_model` (04 §5.11). The coach slider can override any cell (UNI-02 "adjustable").

### 6.3 Inside the unilateral share: contralateral vs ipsilateral (CAT-13; percentages PROPOSED)

| Population | Contra / ipsi use | Default |
|---|---|---|
| COD athletes (football, soccer, basketball, tennis) | contralateral to get into the hip and build range; both to get in and out quickly | ~70 % of loaded unilateral sets contralateral |
| Sprinters (100 m) | ipsilateral step-ups for the acceleration take-off ("I need them to get out of the hip really quick") | ~60 % of unilateral sets ipsilateral |
| Bodybuilders, powerlifters | health accessory for hips and low back (rotational forces lost in bilateral training) | weeks 1-4 mostly; later only if something bothers them |
| General, weight loss, older | not stated | PROPOSED: alternate contra and ipsi by block (one small variable, PER-02); not asked in round 2 |
| Split stance | always contralateral (OBSERVED G83) | rule |

### 6.4 Frontal / transverse unilateral share (UNI-12; numbers PROPOSED, 04)

About **45-50 %** of unilateral lower-body sets for basketball, tennis, soccer, MMA, hockey and combat sports; about 10 % for aesthetics. Moves: lateral lunge, Cossack lunge, lateral step-up (frontal), rotational lunge, hold-between-knees squat, split-stance contralateral KB swing (LIB-20).

### 6.5 Engine mechanics (PROPOSED unless tagged)

1. **Placement filter**: when a big lower (or upper) muscle earns a set, it goes to the bilateral or unilateral group that is more than 3 points off target; then VOL-07 order inside the group (§5.5).
2. **Block-boundary stance swap**: when moving from 50/50 to 80/20 (bodybuilders, week 5) the engine moves sets to bilateral lifts and, because unilateral lifts keep a 2-set floor, changes one variable on one or two lifts at the block change (e.g. Bulgarian split squat → hack squat; alternating staggered-stance DB deadlift → reverse hyper / 45° back extension, which also keeps the spine budget) (12 example 5.2; PER-02).
3. **Slot conversion for athletes** (05 §4.5): convert bilateral stations to unilateral stations of the same dominance, starting with the second weekly exposure, until the share matches; keep at least one bilateral exposure a week off-season unless pain or the season says otherwise.
4. **Equipment swaps that change laterality** are counted on their true side and flagged `laterality_shift` (10 CR-25).

### 6.6 Evidence

OBSERVED (11 §3.7, 04): his written programs mostly sit near 50 % bilateral (BYOP 4-day templates 1 bilateral + 1 unilateral per pattern; UL/PPL 50-53 %; aesthetics tracks 49-54 %; baseball 45-48 % every block incl. in-season; strength tracks 67-70 %; boxing weeks 3-8 37.5 %; MM athletic 27-50 %); bilateral before unilateral in 225 of 231 sessions. SCIENCE: unilateral training improves single-leg jumps more, bilateral training improves bilateral strength more; sprint and COD differences unreliable (Liao 2022, 14 studies). Contralateral loading raised gluteus medius activity in a dynamic lunge (Stastny 2015); the into/out-of-the-hip vocabulary matches the PRI / Hartman school (07 §1.2).

### 6.7 Pending

Which athletes get same-pattern days (PROPOSED: high-level athletes who need more stimulus to grow, plus size-focused off-season athletes from the ATH-03 "more resistance" group); a hip-range screen vs sport-only choice of contra/ipsi (PROPOSED: sport only); whether the 50/50 → 80/20 move happens at the block change or week by week (PROPOSED: at the week-5 block change); whether COD athletes at 80-90 % unilateral train each bilateral pattern only once a week (PROPOSED: yes, at low sets); every PROPOSED cell in 6.2-6.4.

---

## 7. Training variables

Full version: `11_training_variables.md` / `.json` (25 variables, LV / VP / QM rules, two worked examples re-run with 12's engine) and `10b_equipment_variables_science.md` (evidence).

### 7.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| T1 | **Reps by size**: small muscles 12-30 (20s, MAX, MYO); big muscles 5-15, "a mix". **40-rep sets are not a default**: only as an optional CrossFit / AMRAP-style workout. | VOL-11 |
| T2 | **Preference** ("lighter, more sets" vs powerlifting "heavier, fewer reps") moves the rep range on **big compound lifts only**; weekly sets stay similar; small muscles stay high-rep. | VOL-12 |
| T3 | **RIR is his effort scale**: 1-3 RIR on every working set ("leave 1 in the tank"); RPE is shown beside it as an explanation; % stays in his strength and Olympic templates. **MAX / MAX REPS = technical failure, only on small-muscle or bodyweight work.** Never to failure on heavy compounds. | VOL-13, GEN-08, PER-09 |
| T4 | **Rest**: hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed; supersets rest after the pair. | VOL-14 |
| T5 | **MYO sets only on the last exercise**, machine or isolation. | VOL-15 |
| T6 | **Unilateral lifts moderate-to-high reps** by default; heavy low-rep unilateral as an option. | UNI-04 |
| T7 | **Notation**: '10/10' = 10 per side (one set); a bilateral 10/10 written on purpose = a set of 10 then another set of 10. **'12/10/8 -20'** = 12 reps mid weight, 10 heavier, 8 heaviest, then drop to a light set of 20. | PRG-07, UNI-01 |
| T8 | **VOL 1 / VOL 2 / VOL 3** (compound 12-15 / 8-12 / 6-8; isolation 10-12 / 15 / MAX) = one rep phase per off-season block, for all athletes. | PER-11 |
| T9 | **One algorithm** for rep, set and volume rises at every level and model. | PRG-06 |
| T10 | **Blocks of 4-6 weeks**: same exercises inside a block; the next block changes one or two of grip, stance, implement, range of motion or rep range, never all at once. | PER-02 |
| T11 | **A/B lead-lift weeks** (squat-led / hinge-led; bench / overhead) are available in any program for people who want variety; not needed otherwise. | PER-03 |
| T12 | **The second time a slot comes up in a week, it is a different exercise from the same category**; and the spine is loaded once a week. | PER-04 |
| T13 | **Order**: row before pulldown (horizontal before vertical), always; **'the work' first** even when it is vertical; **power before strength**; small muscle first only when it is the client's priority; **core first** by default, movable. | ORD-01, ORD-02, ORD-03, ORD-04, ATH-11 |
| T14 | **Strength roles**: the work (1 RIR) / the accessory (2 RIR) / the nuance (MAX) / the survival (done no matter what). | ORD-07 |
| T15 | **Supersets are a fatiguing and density tool**: short sessions; advanced clients who need more stimulus; off-season VO2 max / mitochondrial work; beginners who don't fatigue on straight sets. | ORD-05 |
| T16 | **Contrast / French contrast and complexes**: intermediate+ athletes, off-season only, heavy lift ~78-85 %, no rest inside the complex. | ATH-12 |
| T17 | **Warm-up always** (5 min any cardio + A-drills or mobility); A-drills are warm-up, never volume. | ORD-08 |
| T18 | **Strength template**: main lift 80/80/85/85/90/90 % at RPE 7 → 10; Olympic 75 → 80 → 85 → 90 % with 4×8 → 4×6 → 4×6 → 4×4. "I just want to make sure it's correct." | PER-09 |
| T19 | **Speed is a variable, ROM is a variable, load is a variable, volume is a variable**; heavier = slower, lighter = faster; quality of movement matters as much as quantity. | COACH-CHAT |
| T20 | **No variable resistance** (bands, chains, weight releasers) for now; speed work uses straight weight. | EQ-12, EQ-01 |

### 7.2 The variable stack (v1; `11_training_variables.json > variables`)

```
EXERCISE   = pattern · implement/constraint (1-5) · load position + Davidson zone (rotation bias) · load laterality (contra/ipsi)
             · stance/base · grip · feet/body · ROM · end range · plane (incl. core segment) · axial load
DOSE       = load · speed/intent · tempo · sets x reps · effort (RIR) · rest/density/pairing · frequency
ATHLETIC   = force phase · plyo method stage · plyo vs ballistic share (ground contact) · medball mass · box/hurdle height
CONDITION  = duration · work:rest · pace (Blue A / Green B / Orange C, lactate clearance)
RELATIONS  = bilateral:unilateral share (V22) · same/cross-pattern pairing (V24, new) · weekly axial budget (V25, new) · exercise level (derived)
RETIRED    = V17 accommodating resistance (EQ-12)
```

### 7.3 Rep matrix (goal × exercise class; his menu labels; `03 §9.9`)

| Exercise class | Aesthetics / hypertrophy | Strength / powerlifting | Athletic | Fat loss | General / weekend warrior |
|---|---|---|---|---|---|
| Main bilateral compound | '8 to 12 Reps' (L1 '10 to 15'); L2+ may run '12/10/8 -20' | his % template (PER-09); 'the work' ladder at '1RIR'; speed work 'FAST RPE6 or about 60-70%' | VOL 1 → 2 → 3 by block (PER-11); pre-season '1 to 3' - '4 to 6' | '10 to 15' → '8 to 12' | '10 to 15' |
| Machine / stable compound | '15 Reps' / '10 to 15'; MYO only if last | '6 to 8' at 2 RIR | '8 to 12' | '15 Reps' | '15 Reps' |
| Unilateral compound (alternating the same) | '8 to 12' per side; heavy '4 to 6' only with the toggle | '8 to 12' per side | '6 to 8' per side, or contrast (L2+ off-season) | '8 to 12' / '10/10' | '10 to 15' per side |
| Big-muscle isolation (leg ext, leg curl, flies) | '15 Reps' - '20 Reps'; MYO if last | '8 to 12' ('3x8') | '8 to 12' / MYO finisher | '15' → '20' (40 only in the AMRAP style) | '15 Reps' |
| Small-muscle isolation | '15' - '20' (12-30); rear delts '20 to 30'; last set 'MAX' | '8 to 12'; triceps '20 Reps' | '10 to 15' | arms '30'; 40 only in the AMRAP style | '15 to 20' |
| Calves (3 sets every leg day) | '15' - '20', last set 'MAX'; single-leg or bilateral | '10 to 15' | '8 to 12' heavy single-leg | '15 to 20' | '15 to 20' |
| Core (~2 exercises, first) | '10 to 15' or 20-60 s | '8 to 12' | by plane; 20-50 s; more rotational where the sport needs it | circuit 30-50 s | '10 to 15' / time |
| Olympic | - | % template | L1 + early L2: DB/KB snatch, hex-bar jump, hang pull / hang clean '6 to 8'; L2+ hang/power '3 to 5', full lifts '1 to 3' - '3 to 5' | - | L1 variants |

Preference styles (VOL-12): `volume_lighter` = one bracket up on big compounds, 1-2 min rest; `balanced` = matrix; `heavy_powerlifting` = one bracket down on the first lift of each day (5×3, 5×4, 6×4 rows), 3-5 min rest, never MAX on compounds; **weekly sets unchanged** (v0 ×1.1 / ×0.85 retired). Rep stores and REPS menu additions (PROPOSED, N-OUT-01): '1 to 3', '3 to 5', '25 to 30', per side, seconds, metres, contacts, throws, calories, rounds.

### 7.4 Effort (how the client sees it; text PROPOSED, EN + ES)

| Target RIR | RPE | Plain words |
|---|---|---|
| 3 | 7 | hard; 3 more clean reps were possible |
| 2 | 8 | very hard; 2 more clean reps |
| 1 | 9 | "leave 1 in the tank" |
| 0 ('MAX') | 10 | technical failure (small-muscle or bodyweight last sets only) |

His EFFORT menu ('1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', **'8 - That was perfect'** the bullseye, '9 - That was terrible', "10 - I'm done") and HOW IT FELT ('Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it") are kept verbatim (OBSERVED LIB AX:AY). **EFFORT is rated against the set's target RIR** (PROPOSED, §5.4c). Deload sets 3+ RIR (PER-05). Speed work 'FAST RPE6 or about 60-70%' (OBSERVED 4T N17). Plyos, throws, sprints at maximum intent and stopped when quality drops. A ramp inside the 1-3 band (acclimation 2-3, drive 1-2, hardest 1) is PROPOSED only (06), not a rule (VOL-13).

### 7.5 Load-velocity (lightest/fastest → heaviest/slowest; `11 §2`, 10 §5)

| Zone | Examples (OBSERVED) | Load | Dose (PROPOSED / SCIENCE) | Stop rule |
|---|---|---|---|---|
| Max velocity / reactive | ' Max velocity running (top speed)'; squirrel jumps; repeated hops | body mass | contacts 5-10 × 2-4; sprints 10-30 m × 3-6 | contact lengthens, height drops |
| Speed / starting strength | medball passes, rotations, overhead throws; COD 'EASY TURN' → 'HARD TURN' | medball 8-10 lb passes/rotations, 6-10 overhead, 6-8 sit-up, 10-20 slams; **never over 20 lb** (EQ-06) | 1 × 10 per throw (ALL LIST, LIB-22) | throw slows, head drifts |
| Speed-strength | 'Hex bar squat jumps', 'DB Squat Jumps', weighted stick the landing | **10-20 % body weight** (EQ-15) | 3-6 × 3-5 | jump height or speed clearly drops (EQ-15) |
| Strength-speed | 'FAST ...' lifts, KB swings | 'FAST RPE6 or about 60-70%', **straight weight** (EQ-12) | 2-3 × 6-10 | first slower rep ('same speed for all reps') |
| Accelerative (Olympic) | 'Hang cleans @ 75%' → '@ 90%' | % (PER-09) | 4×8 → 4×4 as written; PROPOSED: full catch lifts capped at 3-5 reps per set at the same weekly reps | speed loss, catch breaks |
| Contrast heavy member | '78% of 1RM whatever squat immediately into tuck jumps ...' | 78-85 % (ATH-12) | 2-4 heavy + 5 jumps × 3-4 rounds, no rest inside | jump quality |
| Absolute strength | 'the work' '1RIR' | 1 RIR, % template | 3-7 × 1-6 | RIR 1-2 |
| Hypertrophy | '1-3 RIR aka RPE 7+' | RIR | 3-5 × 5-15 (big), 12-30 (small) | RIR 1-3 |
| Local-fatigue machines / isolation | 'LEG PRESS' "local fatigue ... not so much systemic"; 'MYO SET' | MAX / MYO (last exercise only) | 2-3 × 15-30 | technical failure allowed on isolation/constraint ≥ 4, last exercise |

Retired: the chains/bands zone and the band/chain loads ('around 50%', 'around 70%') stay OBSERVED only (EQ-12). The DB drop-release jump ('BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP', ~20 % BW) is not variable resistance and stays (10b). Box and hurdle heights: depth drops low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12 in+ advanced (EQ-16).

### 7.6 Variation policy

- **Inside a block** (4-6 weeks): exercises fixed; only sets, reps, load and RIR move (PER-02). Mid-block swaps only for 'Felt a PAIN', 'Felt the WRONG muscle', "Couldn't do it" (GEN-05) or the client's own dropdown choice (GEN-04, EQ-10).
- **Between blocks**: change one or two small variables per slot, never all at once (PER-02). Order of smallest perturbation (INFERRED from his ladders): grip → feet/body → stance → load laterality (contra ↔ ipsi) → load position → ROM / end range → implement / constraint → tempo → rep bracket (e.g. VOL 1 → VOL 2).
- **Within the week**: the second exposure of a slot is a different exercise of the same category and, for squats and hinges, the non-axial one (PER-04).
- **A/B weeks** for clients who tick "I like variety" (PER-03; intake toggle PROPOSED).
- **Conditioning** is the exception: never the same colour twice in a week (OBSERVED AE A5).
- **CAT-12** (variants built by changing one detail of a library exercise): not understood by the coach; v1 keeps "named library exercises first; one-detail variants only as the between-block change" PROPOSED and re-asks it in plain words.

SCIENCE: planned variation can help; random rotation can hurt (Kassiano 2022); RP keeps exercises constant within a mesocycle.

### 7.7 Ordering rules (hard / house / default)

| Rule | Status | Evidence |
|---|---|---|
| Never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped | **hard (GEN-08)** | COACH-ANSWER GEN-08 |
| Core block first (movable) | **default**, user may move it after plyos, after strength or to the end | ATH-11 |
| Row before pulldown; horizontal push before vertical push | **hard**, BYOP is the reference (FAT BURN / 4T / boxing pulldown-first not followed) | ORD-01; BYOP 13/13, 15/15 |
| 'The work' first, regardless of direction | hard | ORD-02 |
| Athletic / Olympic before strength | hard (contrast stations excepted, ATH-12) | ORD-03; BYOP 12/12 |
| Plyo / throws / COD / sprint before Olympic | hard | OBSERVED N5 48/51 |
| Bilateral before unilateral (same region) | hard (machine MYO finisher exempt) | OBSERVED R5 225/231 |
| Hip dominant + push, knee dominant + pull in mixed sessions | hard | UNI-11, ORD-06 |
| Isolation first only for a priority muscle | default | ORD-04 |
| MYO only on the last exercise (machine/isolation); 'MAX' only on small-muscle or bodyweight work | hard | VOL-15, VOL-13 |
| Speed session order: squirrel jumps → MACH / acceleration starts → max velocity | hard | LIB-21 |
| Landing (receive) before reactive jumping; bilateral before unilateral plyos | default | CAT-10 |
| Leg extension before leg curl; isolation follows its day (biceps/rear delts on pull days, triceps/side delts on push days) | default | OBSERVED |
| Conditioning last, except a fighter's/hybrid opening aerobic block (real aerobic work) or the day's sprint block | default | ORD-09 |
| Constraint rises through the session (free and fast first, machines last) | default | OBSERVED C1 (Spearman 0.72-0.78) |

Why horizontal before vertical: the coach states it as his order (COACH-CHAT, ORD-01) without a reason; reading it as "zone 2 (safer to push and pull) before zone 3" is INFERRED. SCIENCE: whatever comes first in a session gets more reps and quality (Simão 2012), which supports power first, the work first and a priority muscle first.

### 7.8 Quality of movement (QM rules, 11 §6; INFERRED unless tagged)

A rep counts only if it meets the position and ROM standard ('MAXIMAL UPRIGHT POSTURE' for squats, OBSERVED SQ A9); speed sets stop at the first slower rep ('same speed for all reps'); landings 'Drop & Stick - Hold for 3 seconds' (OBSERVED); load goes up only after 'Felt the RIGHT muscles', EFFORT ≤ 8 and full ROM; "every time they do a set, they do it correctly and they do it with effort" (VOL-14); a client who cannot hold upright posture in a back- or front-loaded squat goes back to a front-loaded version next block (CAT-04 application).

### 7.9 Pending (variables)

Olympic reps for full catch lifts (3-5 per set PROPOSED) and the % basis (1RM of that exact variant, PROPOSED); the 40-rep option's home (AMRAP / CrossFit; "high-raw athletes" read as HYROX, INFERRED); whether a load-position step or a contra → ipsi swap counts as a "small variable" between blocks (INFERRED yes); French contrast 4th member without a reverse band (bodyweight pogo / repeat squat jumps, PROPOSED); speed-lift effort label ('1RIR' in STRENGTH-8 vs 'FAST RPE6' in STRENGTH-12, open v0 item); whether a superset may pair two exercises for the same muscle for advanced clients (PROPOSED: no, except contrast and finisher pairs).

---

## 8. Equipment and constraint

Full version: `10_equipment_model.md` / `.json` (implements, constraint scale, 8 + 2 profiles, substitution lists for every slot × profile, client rules CR-01 … CR-35, 438-item exercise index) and 10b.

### 8.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| E1 | **No bands anywhere** ("I don't program anything with bands"; band chops "worthless"); **no variable resistance** (bands, chains, weight releasers) "for now ... We will work with that later on." | EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 |
| E2 | **Intake equipment options**: full commercial gym, basic gym, home gym (rack + barbell + DBs), home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit (his list minus bands). | EQ-01 |
| E3 | **Ideal home kit**: adjustable DBs + bench + pull-up bar + 8-10 lb medball (people have different things). | EQ-02 |
| E4 | **Constraint scale 1-5 approved** (§8.2). | EQ-13 |
| E5 | **Machines are not ranked** ("they have different brands, angles"); hack squat and leg press are more constrained, the Smith machine less; the **belt squat** is for people who should not be loaded axially (already loaded or sore that week); **GHD / reverse hyper** if available and the client feels the right muscles. | EQ-11 (NOT RIGHT to v0's ranking) |
| E6 | **Older, injured and high-volume clients** collect volume "in a safe place with more constraints": compounds and isolation lean machine/cable; they **never** get overhead squat, snatch, low-bar squat or depth jumps. | EQ-03 |
| E7 | **A foundational older/injured client may use machines filed MODERATE/ADVANCED** (leg press, pendulum, hip thrust machine): safety beats the level label. | EQ-04 |
| E8 | **Add a seated machine shoulder press** to VERTICAL PUSH. | EQ-05 |
| E9 | **Medball weights**: slams 10-20 lb (slam ball), overhead throws 6-10 lb, sit-up throws 6-8 lb, passes/rotations 8-10 lb; lighter for youth and older clients; heavier only for specific uses (medball hang clean, wall balls); **never over 20 lb**. | EQ-06 |
| E10 | **No medball**: substitute, don't skip: plyo push-ups (pressing), fast cable rotations, or the no-ball 'fake medball slam' (no band chops). | EQ-07 |
| E11 | **No leg extension / leg curl machine**: swap (sissy squat or DB leg extension for quads; Nordics, slider or swiss-ball curls for hamstrings), no bands. | EQ-08 |
| E12 | **No implement named** → bodyweight → DB → barbell as level rises, within the kit. | EQ-09 |
| E13 | **Alternatives** ('Squats or Leg Press'): pick by client (older/injured → machine or DB, experienced → barbell) **and the client's own preference**. | EQ-10 |
| E14 | **Aerobic work on any tool** (run, bike, rower, ski erg); track by calories, time or distance (keep distance); "doing the block is the important part ... see any changes week to week". | EQ-14 |
| E15 | **Loaded jumps 10-20 % of body weight**; too heavy when jump height or speed clearly drops. **Box/hurdle heights**: low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12 in+ advanced. | EQ-15, EQ-16 |
| E16 | **Machines and cables make any position easier** (they do the stabilising). | CAT-04 |
| E17 | Machines = many reference points (sit, feet down, move hands or feet) → push a lot, safer → people going up in volume, injured, older; barbells most skilled; DB, KB, medballs in between. | COACH-CHAT |

### 8.2 The constraint scale (approved; EQ-13)

| Level | Definition (his approval) | Examples | Suits |
|---|---|---|---|
| **5** | seated machine with back pad, fixed path | leg press, leg extension, seated leg curl, machine calf raise, machine row, machine chest press, seated machine shoulder press, bike | older/frail, pain, high-volume finishers, MYO sets |
| **4** | plate-loaded machine, Smith, chest-supported free weight | pendulum, hack squat (back-supported), Smith machine (least constrained of level 4, EQ-11), lat pulldown, assisted pull-up machine, seal/chest-supported rows, belt squat, GHD | beginners on pulls (on-ramp), volume clients, older/injured |
| **3** | cable, or DB/free weight supported by a bench or floor | cable chest press, DB bench press, box squat, glute bridge, incline push-up, floor core | beginners, hypertrophy accessories, pain regressions |
| **2** | standing free weights | front squat, barbell deadlift, standing DB press, push-up, goblet squat, every loaded lunge, hang pulls and Olympic lifts | strength main lifts, athletes, intermediate+ |
| **1** | bodyweight, ballistic, reactive (open space, hanging, single-leg free) | pull-ups, handstand push-ups, pistol, push press, KB swing, all plyos and sprints | athletes (athletic slots, main lifts), advanced bodyweight skill |

Order inside level 4 (GRD-4, from EQ-11): hack squat / pendulum more constrained than the Smith machine. Machine roles: ON-RAMP (pulldown, assisted pull-up, machine row), VOLUME TOOL (leg press, pendulum, hack, hip-thrust machine), ISOLATION (leg extension, leg curl, calf). OBSERVED usage: athletes' programs are almost machine-free (5 of 949 items) and medball-rich; physique programs about a quarter machine; CrossFit barbell.

### 8.3 Client rules (10 `client_rules`; v1)

| Client | Main lifts | Accessories | Key rules | Tag |
|---|---|---|---|---|
| Athlete | constraint 1-2 (barbell, hex bar, DB, KB) | machines only as the last 1-2 slots | athletic slots at max intent; Olympic work for everyone in athletic training (§9.5) | ATH-10; OBSERVED |
| Hypertrophy | 1-2 free-weight lead lifts, then constraint 3-5 | machines + cables ~30-35 % | failure / MYO only on constraint ≥ 4 or isolation, last exercise; **no medball except warm-up** | VOL-15, ATH-05 |
| Strength | barbell (constraint 2), the four roles | DB, machine, cable | speed work with straight weight | ORD-07, EQ-12 |
| Fat loss / bootcamp / general | 2-3 | DB, bodyweight, KB | circuits for bootcamp (PRG-03) | PRG-03 |
| Older (60+, PROPOSED threshold) / injured / high-volume | **4-5** | **4-5** | never overhead squat, snatch, low-bar squat, depth jumps; few plyos unless asked; MODERATE/ADVANCED machines open from foundational | EQ-03, EQ-04, ATH-09 |
| Pain flag | +1 to +2 constraint on that region; split grips; unilateral | | then -30-50 %, then drop the exercise | VOL-03, UNI-08 |
| Beginner | front-loaded zone-1 lifts (goblet, zercher, hex, suitcase, landmine) + leg machines; on-ramp pulls | | seated presses before standing; push press foundational, push jerk L2+ | CAT-04, LIB-13 |
| Youth | technique loads; zones 1-2 | | some Olympic lifts from the floor allowed; medball lighter | ATH-09, EQ-06 |
| Small-muscle slots | DB first, then cable/machine | | low skill, more reps | CAT-02 |
| Leg-flexion slot | seated curl → DB / ball / slider curls → Nordic (advanced) | | counts as hamstring sets | CAT-09 |
| Everyone | machines not ranked; client preference decides between listed alternatives; **never V-squat** | | | EQ-11, EQ-10, GEN-08 |

### 8.4 Access profiles (intake) and gaps (10 §3.1, §3.3)

| # | Profile id | Kit | Main slots with no as-written option |
|---|---|---|---|
| 1 | `FULL_GYM` | full commercial gym incl. specialty machines | none |
| 2 | `BASIC_GYM` | no specialty machines/bars (keeps 91 % of the menu) | none (loses pendulum, GHD, hex bar, landmine, hip-thrust machine, belt squat) |
| 3 | `HOME_BARBELL` | barbell + rack + plates + bench + DBs (pull-up bar on the rack) | throws, leg extension, cable chops |
| 4 | `HOME_DB_BENCH` | DBs + adjustable bench (51 % of the menu) | throws, **vertical pull** (DB pullover partial; buy a doorway bar), leg extension (DB leg extension on a box), cable chops |
| 5 | `KB_ONLY` | 1-2 kettlebells + household | throws, vertical pull, leg extension, delts, biceps (KB curl PROPOSED), triceps, chops |
| 6 | `BODYWEIGHT` | floor, wall, stairs, chair, towel, outdoor space (33 %) | throws, **vertical pull and biceps (true gaps)**, horizontal pull needs a sturdy table, leg extension, delts (household load), triceps, chops |
| 7 | `HOTEL_GYM` | light-moderate DBs, bench, stability ball, treadmill/bike | throws, vertical pull, leg extension, chops |
| 8 | `FIELD_TRACK_KIT` | medballs, slam balls, cones, mini hurdles, boxes, field/track | pulls, leg extension, delts, biceps, triceps, chops |
| derived | `FULL_FACILITY` | full gym + platform/bumpers, turf/runway, hurdles, belt squat, sled | none |
| derived | `FIELD_TRACK_NO_KIT` | runway, steps, turf, nothing carried | throws, both pulls, leg extension, delts, arms, chops |

Removed: `BANDS_ONLY` (a client who owns only bands is a BODYWEIGHT client), band tokens, `HOME_DB_BENCH_BANDS` → `HOME_DB_BENCH`, `BOOTCAMP_OUTDOOR` → `FIELD_TRACK_KIT`, `TRACK_FIELD` → `FIELD_TRACK_NO_KIT` (EQ-01). Add-ons ranked for a bodyweight client by slots unlocked: dumbbells > barbell set > kettlebell > TRX > pull-up bar > medball. **Never infer equipment from a template name** (the NO ACCESS tabs read the full gym menus) (OBSERVED).

### 8.5 Substitution (v1, no bands; 10 §3.4, 10b §9.3)

```
fill_slot(slot, client):
  pool = library[slot.bucket] filtered by kit, eligibility (soft level), population rules (older/injured never-list),
         pain filters, client exclusions, no out_of_scope records
  if empty: his own 'X or Y' alternates that fit the kit ('Sqats or Leg Press', 'machine or db flies', 'Deadlifts (DB or Barbell)' ...)
  if empty: same pattern, other implement class (machine -> cable -> DB -> KB -> bodyweight); flag level_shift
  if empty and the slot is a machine isolation: the coach's swaps (EQ-08); fallback 'just add 2 more rounds' to the paired compound (OBSERVED)
  if empty: athletic: Olympic -> hex-bar jump -> KB swing/clean -> DB snatch -> bodyweight jump (flag intent_shift);
            no medball -> plyo push-ups / fast cable rotations / fake medball slam (EQ-07)
            resistance: nearest pattern (flag pattern_gap) + add the missing item to a buy list
  score: default_candidate (BYOP library first, CAT-07) + his staples + client preference (EQ-10)
         - |constraint - client band| - skill above level - pain penalty + continuity inside the block (PER-02)
  laterality change -> flag laterality_shift and rebalance the bilateral:unilateral share
```

No-equipment fixes (PROPOSED, 02_no_equipment_subset, 10): DB pullover + 1-2 extra row sets + "buy a doorway bar" note for home DB clients without a bar; KB curl for KB-only; table inverted row and prone floor Y/T raises for bodyweight-only; reverse Nordic, foot-assisted pull-up, eccentric-only Nordic, seated DB calf raise, ball-squeeze dead bug, seated Smith press as non-library replacements for removed band options (all PROPOSED - whether non-library items may be offered at all is CAT-12's question).

### 8.6 Pending (equipment)

Hack squat and pendulum at constraint 4 or 5 (EQ-11 says "more constraint" than Smith; v1: 4, ordered above Smith); whether the hinge follows the same once-a-week axial rule and which lifts count as axial (§10.4); which squat fills the second squat day at home or in a hotel with no machines (PROPOSED: a single-leg squat such as split squat, step-up or box pistol); belt squat, seated machine shoulder press and the beginner Olympic options as library rows; the 8 knee-banded FBS items replaced by their 'Hold object Adducted between knees' twins (ball/pad squeeze) (done in v1; confirm); 'high rows' in EQ-06 read as HYROX (INFERRED); equipment preference as an intake question (machines / free weights / DBs / no preference, PROPOSED).

---

## 9. Athletes

Full version: `04_athlete_profiles.md` / `04_profiles.json` (27 profiles + 24 position/phase variants, each a weekly set budget per category with season multipliers, injury rules and rationale).

### 9.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| A1 | **Plyo vs ballistic is set by the sport's ground-contact time**: "the longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement." Long ground time (karate, fighters) → more ballistics; short (sprinters) → more plyos; basketball "a good mix"; baseball "more ballistics and rotational forces", sprinting, "not necessarily a high level of plyos". Both ends always present. | ATH-01, CAT-10 |
| A2 | **Programs start more ballistic and gradually become more plyometric** (connective-tissue tolerance and structure). | CAT-10 |
| A3 | **Plyo method**: receive and pause → receive then create (stick, then jump or hop) → repeated receive/create (hops). Not a zone; unnamed yet. Unilateral plyos are harder than bilateral. | CAT-10, CAT-11 |
| A4 | **Plyo volume ranking**: basketball ≈ volleyball > sprinters > football skill positions > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf. | ATH-02 |
| A5 | **More resistance (strength/size)**: football linemen, wrestlers, rugby, heavyweight fighters, throwers. **More speed/power**: sprinters, basketball, skill positions, volleyball. | ATH-03 |
| A6 | **Boxers / strikers: reduce pressing and arm volume when punching volume is high; never cut it to zero.** | ATH-04 |
| A7 | **Medball volume**: high for baseball, boxing, MMA, tennis, golf (rotational); moderate for basketball and football; **none in the main workout for aesthetics/bodybuilders** (warm-up only). | ATH-05 |
| A8 | **Change-of-direction route names are for every athlete**, tiered by turn angle (easy / moderate / hard turns). | ATH-06 |
| A9 | **Aerobic sessions/week**: 3 general and fat loss; 2 athletes in season; 4 aesthetics/bodybuilders, plus long walks after workouts. | ATH-07 |
| A10 | **Pitchers**: less overhead pressing, more arm care, rotational throws kept light. | ATH-08 |
| A11 | **Older population**: few plyos unless they ask; **no sex-based rules** (age, foundation, goal, injuries); **youth may do some Olympic lifts from the floor** according to their program. | ATH-09 |
| A12 | **Everyone in athletic training gets Olympic lifts**: beginners and "beginning intermediates" do DB/KB snatches, hex-bar jumps, hang pulls and hang cleans without bumpers; intermediate+, advanced and pros do "the full scope". | ATH-10 |
| A13 | **Contrast / French contrast / complexes**: intermediate+ athletes, off-season only, heavy lift ~78-85 %, no rest inside the complex. | ATH-12 |
| A14 | **'Justice League' was a marketing name** for a non-competitive, all-round athletic program (adults, youth and kids): "good health all around and just having a body that performs well". | ATH-13 |
| A15 | **Seasons**: off-season most volume (strength + plyos); pre-season more speed/power, less volume; in-season 2 days/week, low volume (sprints for speed athletes; strength maintenance or high jumps for others); post-season recovery and general work. In season bilateral work stays minimal. | PER-08, UNI-10 |
| A16 | **VOL 1 / 2 / 3 rep phases** (compound 12-15 / 8-12 / 6-8) one per off-season block, for every athlete. | PER-11 |
| A17 | **High school, college and pro need about the same plan**; loads and speeds differ per athlete; pros need "a higher level and a little bit more care for their body because of contracts". Baseball Thursday = strength. | PRG-09 |
| A18 | **Field athletes off-season far from competition**: up to 10-12 exercises (2 core, 2-4 plyo/ballistic, 2-3 Olympic/power, 3-4 resistance); core first. | VOL-08, VOL-17, ATH-11 |
| A19 | **Athletic work never counts toward muscle sets** (own units: contacts, throws, cuts, metres, power reps). | VOL-10 |
| A20 | **Speed session order** squirrel jumps → MACH drills / acceleration starts → max velocity; medball 'ALL LIST' = 1 × 10 per throw. | LIB-21, LIB-22 |
| A21 | **Strength/aesthetics need bilateral drive; field/COD athletes 80-90 % unilateral**; contralateral into the hip for COD athletes, ipsilateral step-ups for acceleration. | UNI-02, CAT-13 |
| A22 | **Recreational sport** → general sport only (no position, no season); **competitive** → sport, position, season. | GEN-02 |

### 9.2 The ground-contact model (04 `ground_contact_model`; class map PROPOSED)

| Class | Ground contact | Sports | Plyo share of power work, block end (PROPOSED) | Block start (−15, floor 20; PROPOSED) |
|---|---|---|---|---|
| 1 very short | ~0.10-0.16 s (sprinting, bounding, repeated hops) | track sprinters (jumpers), distance runners | **75 %** | 60 % |
| 2 short | ~0.15-0.25 s (fast SSC: approach/block jumps, first steps, sharp cuts) | volleyball, football skill, soccer | **60 %** | 45 % |
| 3 mixed | short jumps and cuts mixed with planted pushes | basketball ("a good mix"), tennis, football big-skill, youth, weekend warriors | **50 %** | 35 % |
| 4 long | planted rotational or pushing actions, well over 0.25 s | baseball, softball, hockey, linemen, MMA | **40 %** | 25 % |
| 5 very long / grounded | striking from stance, swinging, grappling | boxing, kickboxing, karate, golf, wrestling, BJJ | **25 %** | 20 % |
| - | older adults | only if asked | 0-10 % | - |
| - | aesthetics / bodybuilding | no plyo block | - | - |

"Power work" = plyometric (short contact) + ballistic (long contact or single effort: loaded/box/broad/squat jumps, medball throws). Anchors (OBSERVED, re-counted by ground contact in 04 §2.6): his baseball blocks 36-44 % plyo side, boxer weeks 3-6 30 %, MM athletic levels 8-33 % (throw-dominant). SCIENCE: fast stretch-shortening cycle under ~250 ms vs slow SSC over ~250 ms (Schmidtbleicher's split; Flanagan & Comyns 2008); sprint contacts ~0.14-0.16 s in acceleration, shorter at top speed. **Ranking check** (04 §5.12): applied to fast-reactive plyometric contacts, the targets follow ATH-02 by construction, and his own programs agree (boxer 31 fast contacts/week vs baseball 37-74), although the boxer does more total jump contacts (113-129) than baseball.

**Which exercises are which** (PROPOSED; round 2): ballistic = squat jumps, box jumps, broad jumps, loaded/hex-bar jumps, march and step-up jumps, medball throws; plyometric = pogo/ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; landings (stick) = the receive stage that teaches plyometrics.

### 9.3 Plyo method stages (CAT-10, CAT-11; name and weeks PROPOSED)

| Stage | What | Examples | 12-week plan | 8-week plan |
|---|---|---|---|---|
| 1 Receive & pause ("Land") | absorb and stick, 3 s hold | stick-the-landing, depth drop & stick, 'Push up Stick the Landing' (hands from a box to the floor, LIB-02) | weeks 1-3 (ballistic-biased mix) | weeks 1-2 |
| 2 Receive then create ("Land & go") | stick, then one jump or hop | depth drop to jump, drop into box jump, stick then hop | weeks 4-7 | weeks 3-5 |
| 3 Repeated receive / create ("Repeat") | continuous rebounds | repeated hops, hurdle hops (taller + continuous = advanced, LIB-04), pogos, bounds | weeks 8-12 at the sport's target share | weeks 6-8 |

Rules: bilateral before unilateral inside each stage (unilateral harder, CAT-10); unloaded before loaded (10-20 % BW, EQ-15); heights per EQ-16; an intermediate athlete takes one plyo from each MODERATE track (plate hops, hurdles, LIB-05); 4-6-week maintenance blocks stay at the current stage; L2-L3 athletes may start at stage 2 (PROPOSED). Suggested name: **"Receive-Create stages"** (RC1 / RC2 / RC3) (PROPOSED; CAT-11 "I don't know what to call it yet"). Contacts per session stay under NSCA's lower bands (L1 80, L2 100, L3 120); 2-3 plyo sessions a week off-season, 48-72 h apart for the same area; masters 3-4 days apart (SCIENCE).

### 9.4 Sport matrix v1 (baseline = off-season build week; `04_profiles.json > profiles[]`; numbers PROPOSED unless OBSERVED)

| Profile | ATH-03 group | Contact class | Plyo:ballistic (end) | Plyometric contacts/wk (fast-reactive) | Throws/wk | COD cuts/wk | Olympic sets/wk | Bilat/unilat start → end (in-season) | Aerobic off / in |
|---|---|---|---|---|---|---|---|---|---|
| Basketball | speed/power | 3 | 50:50 | T5 100-140 | T2 80-120 | T4 120-160 | 6-10 | 20/80 → 10/90 (10/90) | 3 / 2 |
| Volleyball | speed/power | 2 | 60:40 | T5 100-140 | T2 60-100 | T2 50-70 | 6-10 | 40/60 → 30/70 (20/80) | 3 / 2 |
| Football skill (WR/DB/RB) | speed/power | 2 | 60:40 | T4 80-110 | T2 60-100 | T4 120-160 | 6-10 | 20/80 → 10/90 (10/90) | 3 / 2 |
| Football big skill (LB/TE/FB/S) | speed/power | 3 | 50:50 | T3 60-90 | T2 70-110 | T3 80-100 | 8-12 | 30/70 → 20/80 (10/90) | 3 / 2 |
| Football linemen | more resistance | 4 | 40:60 | T2 20-40 | T2 80-120 | T2 40-50 | 8-12 | 50/50 → 40/60 (30/70) | 3 / 2 |
| Soccer | speed/power | 2 | 60:40 | T4 70-95 | T1 20-40 | T4 120-160 | 2-6 | 20/80 → 10/90 (10/90) | 3.5 / 2 |
| Tennis / racket | rotational power | 3 | 50:50 | T3 45-70 | T3 150-200 | T3 100-120 | 2-6 | 20/80 → 10/90 (10/90) | 3 / 2 |
| Baseball (position) | rotational power | 4 | 40:60 (OBSERVED 36-44 %) | T2 35-60 | T3 170-200 (OBSERVED 176-192) | T1 10-30 | 6-16 (every block, ATH-10) | 50/50 → 40/60 (20/80) | 2 / 2 |
| Softball | rotational power | 4 | 40:60 | T2 35-60 | T3 160-200 | T1 10-30 | 2-6 | 50/50 → 40/60 (20/80) | 2 / 2 |
| Ice hockey | speed/power | 4 | 40:60 | T2 25-45 | T2 70-100 | T1 20-30 | 6-10 | 20/80 → 10/90 (10/90) | 3.5 / 2 |
| Golf | rotational power | 5 | 25:75 | T1 0-15 | T3 150-200 | T0 | 2-6 | 30/70 → 20/80 (20/80) | 3 / 2 |
| Track sprinter | speed/power | 1 | 75:25 | T4 90-120 | T1 40-60 | T0 | 8-12 | 40/60 → 30/70 (20/80) | 2 / 2 |
| Distance runner | health | 1 | 75:25 | T1 10-25 | T0 | T0 | 1-4 | 20/80 (10/90) | run plan |
| Boxing | combat | 5 | 25:75 (OBSERVED 30 %) | T1 15-30 (OBSERVED 31) | T4 190-380 (OBSERVED) | T0-T1 | 9-12 (OBSERVED) | 40/60 → 30/70 (20/80) | 3 / 2 |
| Kickboxing / Muay Thai | combat | 5 | 25:75 | T2 20-40 | T3 220-260 | T2 35-50 | 4-8 | 30/70 → 20/80 (20/80) | 3.5 / 2 |
| Karate / Taekwondo | combat | 5 | 25:75 | T1 15-30 | T3 180-220 | T2 55-70 | 2-6 | 30/70 → 20/80 (20/80) | 3.5 / 2 |
| MMA | combat | 4 | 40:60 | T3 55-80 | T3 150-200 | T2 40-50 | 7-11 | 40/60 → 30/70 (20/80) | 4 / 2 |
| Wrestling | more resistance | 5 | 25:75 | T2 20-40 | T3 150-200 | T2 40-50 | 6-10 | 50/50 → 40/60 (30/70) | 4 / 2 |
| BJJ / grappling | combat | 5 | 25:75 | T2 20-35 | T2 80-120 | T0 | 2-6 | 50/50 → 40/60 (30/70) | 3 / 2 |
| Youth athlete | health | 3 | 50:50 | T2 30-60 | T2 50-80 | T2 35-50 | 2-6 (floor lifts allowed, ATH-09) | 50/50 (40/60) | 2 / 2 |
| Weekend warrior (non-competitive athletic) | health | 3 | 50:50 | T3 40-70 | T2 64-96 (OBSERVED template) | T2 48-64 (OBSERVED) | 6-10 (L1 variants) | 50/50 → 40/60 | 3 / - |
| Powerlifting | size/strength | - | - | T1 (OBSERVED 18 'EASY') | 0 | 0 | 0 | 50/50 → 90/10 | 2 (PROPOSED) |
| Bodybuilding / aesthetics | size/strength | - | no plyo block | 0 | 0 (warm-up only) | 0 | 0 | 50/50 → 80/20 | **4 + walks** |
| Fat loss | health | - | - | 0 | 0 | 0 | 0 | 50/50 | **3** |
| General population | health | - | - | 0 | T1 20-40 | 0-20 | 0-3 | 50/50 | **3** |
| CrossFit competitor / hybrid | size/strength / health | - | - | in WODs | WOD wall balls/slams | 0 | 0-24 by month (OBSERVED) | observed | by level grid |

Tier scales (04 §4): plyometric contacts T1 1-25, T2 26-50, T3 51-80, T4 81-110, T5 111-150 (fast-reactive, high amplitude); all jump contacts (NSCA safety check) T1 1-40 … T5 221-320; throws T1 1-60 … T5 421-600; cuts T1 1-30 … T5 181-260. Rugby forwards → lineman profile, backs → big-skill; heavyweight fighters move toward "more resistance" by body weight; track & field throwers = variant (04, INFERRED).

### 9.5 Olympic lifts for everyone in athletic training (ATH-10)

| Level | What | Notes |
|---|---|---|
| L1 and "beginning intermediates" | DB/KB snatch (incl. single-arm DB snatch from the floor), KB clean / KB squat clean, DB/KB high pull, hex-bar squat jump, hang pulls, high/mid-hang cleans lowered under control (no bumpers needed); push press (DB or barbell; the easier rung, LIB-13) | FOUNDATIONAL options (02, 10 ADD-ATH10-1..4); push press moved here by the coverage audit (LIB-13 files it as the easier, foundational press) |
| L2+ ("intermediate plus and advanced and pros ... the full scope") | power clean, power snatch, power clean & jerk (INTERMEDIATE), push jerk (INT-ADV), Squat Snatch / Squat Clean / Squat Clean & Jerk (ADVANCED exercise level) | LIB-07, LIB-13 |
| Youth | some Olympic lifts from the floor "according to their program" | ATH-09 (v0 "no floor lifts" retired) |
| Older / injured / high-volume | no snatch variants; DB/KB cleans, hang pulls, hex-bar jumps only if asked | EQ-03, ATH-09 |
| Without bumpers | hang variants lowered under control; DB/KB; hex-bar jumps | ATH-10 |
| Dose | his ramp 'Hang cleans @ 75%' 4×8 → '@ 80%' 4×6 → '@ 85%' 4×6 → '@ 90%' 4×4 (PER-09). Science check (06 §5.4): 8 reps per set is high for full catch lifts (common guidance 3-5 at 75-85 %); fine for DB/KB and pull variants. PROPOSED: cap Squat Clean / Squat Snatch at 3-5 reps per set at the same weekly reps (e.g. 6×5 @ 75 %); % from that lift's own 1RM | PER-09; PROPOSED |
| In season | ATH-10 vs his baseball in-season block (no Olympic): PROPOSED a light 2×3 piece once a week, dropped in congested game weeks | round 2 |

### 9.6 Medball (ATH-05, EQ-06, EQ-07, LIB-06, LIB-22)

Light balls for speed (8-10 lb passes/rotations; 6-10 overhead; 6-8 sit-up; slams 10-20; never over 20 lb; lighter for youth and older); no levels, "just do them right"; dose 1 × 10 per throw, R/L pairs; a throwing slot may be the whole ~19-throw 'ALL LIST' (~200 throws); none for aesthetics except the dynamic medball warm-up; no medball → plyo push-ups, fast cable rotations, fake medball slam. Throws count on the **ballistic** side of the plyo:ballistic split (04, INFERRED; round 2).

### 9.7 Aerobic work (ATH-07, ORD-09, EQ-14)

| Population | Sessions/week | Content | Tag |
|---|---|---|---|
| General, fat loss | **3** | one Blue A, one Green B, one Orange C (never the same colour twice) | ATH-07; OBSERVED AE A5 |
| Aesthetics / bodybuilders (the whole physique family) | **4 + long walks after workouts** | C, B, A + a second easy C (only 3 colours exist); walks 20-30 min easy, on top | ATH-07; 4th colour and walk dose PROPOSED |
| Athletes in season | **2** | plus sprints for speed athletes | ATH-07, PER-08 |
| Athletes off-season | 2-4 by sport (04): baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4 | + sprint buy-outs; off-season VO2 work also through supersets (ORD-05) | PROPOSED |
| Athletes pre-season | 2 | speed/power emphasis | PROPOSED |
| Powerlifters | 2 | Orange C | PROPOSED |
| Fighters | daily | the opening cardio is a real aerobic block (Orange/easy) | ORD-09 |
| Fat-loss circuits | finisher, not a separate session | after lifting; rounds 3 → 5, work 30 → 50 s (OBSERVED) | PRG-11 |
| Endurance event | per plan | the Chris Hinshaw half-marathon plan as-is, half marathon only | PRG-12 |

Any erg works; track calories, time or distance with one unit per block (the menus carry the DISTANCE 200-1000 m and CALORIES items, FIX-02); level unlock C → C+B → C+B+A → lactate clearance (OBSERVED CrossFit grid; L3 unlocks lactate clearance for competitors, PROPOSED); steady cardio ≤ 40 min ('max 40 min of steady', OBSERVED). Long-walk dose PROPOSED: 20-30 min easy after lifting, on top of the sessions.

### 9.8 Seasons (PER-08, UNI-10, PER-11; multipliers PROPOSED, 04 §7, 12 §3.4)

| Phase | Resistance volume | Athletic content | Bilateral | Other |
|---|---|---|---|---|
| Off-season (early → build → late) | most volume (field/court lower × 0.7, upper × 0.5 of the gym start; strength-type 0.9 / 0.8) | start ballistic → plyometric; RC1 → RC3; VOL 1 → VOL 2 → VOL 3 one per block; Olympic every block; contrast L2+ | slider start → end (§6.2) | STARTING / MID / ADVANCED templates as blocks or levels (PRG-04) |
| Pre-season | less volume (resistance × 0.6 lower / 0.4 upper, or the 4-6-week season-change maintenance block at ~60 %; round 2) | more speed/power; sprints | lower | 1-2-week taper before the opener (volume -40-60 %, intensity kept; SCIENCE Bosquet 2007) |
| In-season | ~2 days/week, low volume (× 0.4-0.5 lower, 0.3-0.4 upper), step 0 % | sprints for speed athletes; strength maintenance or high jumps for others; game-heavy sports PROPOSED: gym plyos about half, COD only if the sport lacks it | **minimal** (10/90-20/80) | 2 aerobic sessions; lighter weeks around congested games |
| Post-season | recovery and general work | arm care, mobility, easy aerobic (OBSERVED baseball 'wk 8') | - | then the next off-season |

### 9.9 Special populations and sport rules

| Group | Rule | ID |
|---|---|---|
| Boxers / strikers | high-punching weeks: pressing, vertical pulling and arm isolation × 0.5-0.7 (PROPOSED factor), never zero; keep rows and rotational throws | ATH-04 |
| Pitchers | less overhead pressing (VPUSH −), more arm care (rear delts/cuff +), light rotational throws | ATH-08 |
| Older adults (60+ PROPOSED) | few plyos unless asked (landings and low ankle hops allowed, PROPOSED); constrained machines; never overhead squat, snatch, low-bar squat, depth jumps (incl. high depth drops, INFERRED); maintenance floor 70 %; default step 3 % | ATH-09, EQ-03 |
| Youth | some Olympic lifts from the floor (age/level threshold PROPOSED: 14+ after a block of hang work); lighter medballs; no research data leaves the phone (13) | ATH-09, EQ-06 |
| Sex | no rules by sex anywhere (female-athlete landing rule, softball rationale and sex-based bone-stress list removed; landing rules now by ACL history, landing screen and training age) | ATH-09, GEN-02 |
| Competition level | high school = college = pro in plan structure; loads, speeds and care differ; pros more care (PROPOSED: step ≤ 5 %, no true 1RM tests, coach review before each block) | PRG-09 |
| Weekend warrior | profile `weekend_warrior`: non-competitive athletic adults and youth; also where recreational players of any sport land; 60 min (PROPOSED); L1 Olympic variants unless experienced | ATH-13, GEN-02 |
| Injury hotspots (04 §9, 23 codes) | e.g. GROIN (Copenhagen planks), HAMSTRING (Nordics/slider curls; keep one max-velocity exposure), ACL (landings first), PATELLAR (cap rebounds), LOW_BACK_ROTATIONAL (anti-rotation before rotation), SHOULDER_THROWER, SHOULDER_STRIKER (reduce, not cut), NECK (no library column yet) | OBSERVED + SCIENCE; sex terms removed |

### 9.10 Pending (athletes)

Every PROPOSED number in 9.2-9.9 (class map, contact tiers, throws, Olympic sets, aerobic off-season counts, season multipliers, older/youth thresholds); the ballistic vs plyometric classification of library jumps and whether medball throws are "ballistic"; whether the ATH-02 ranking is about fast-reactive contacts (v1 reading); method-stage timing and name; in-season Olympic piece; whether game-heavy sports subtract game load in season (N-ATH-07); off-season aerobic counts; Olympic reps for power athletes (stop at 2-5 when the bar slows, PROPOSED); rugby and track & field throwers as dedicated profiles or mapped (INFERRED mapping kept); what "more care for pros" changes; COD in baseball and in-season weeks (05 open 11.2-15; PROPOSED: baseball base-running COD 10-30 cuts/week off-season, none in season).

---

## 10. Session and week templates

Full version: `05_session_architecture.md` / `05_templates.json` (27 observed templates as slot sequences, 30 generator split templates for 2-6 days × 6 families plus variants, each with stored checks: pairing, order, axial budget, caps, time).

### 10.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| W1 | **Core first, for everyone**: about 2 exercises right after the warm-up ("that'll give you a good warm-up"); the user may move the core block after the plyos, after strength or to the end. | ATH-11 (NOT RIGHT to v0), VOL-17 |
| W2 | **Hip dominant (back of the lower body) + push (front of the upper body); knee dominant + pull**, in every session that mixes lower and upper work, full body and bootcamps included, to avoid bleed-over and allow more total work. | UNI-11, ORD-06 |
| W3 | **Bootcamp Option 1 Tue/Fri** ('Bilateral HD' → 'Vertical Pull' → 'Unilateral KD' → 'Horizontal Push') **was a mistake**: hinge + push, knee + pull. | ORD-06 |
| W4 | **Load the spine once a week**: one squat day; the other knee-dominant day leg press or belt squat; deadlifts load the spine too. | PER-04, EQ-11 |
| W5 | **Second weekly exposure of a slot = a different exercise of the same category.** | PER-04 |
| W6 | **Same-pattern pairing** (squat + lunge) to drive a muscle harder (high-level athletes, aesthetics); **cross-pattern** (squat + single-leg hinge) for bootcamp and less soreness. | UNI-06 |
| W7 | **Row before pulldown, horizontal before vertical; 'the work' first; power before strength; small muscle first only as a priority.** | ORD-01, ORD-02, ORD-03, ORD-04 |
| W8 | **Warm-up always** (5 min any cardio + A March / Skip / Run or mobility such as KB book openers); A-drills never count as volume. | ORD-08 |
| W9 | **Supersets** = fatigue and density tool (short time; advanced clients who need more; off-season VO2/mitochondrial work; beginners who don't fatigue). | ORD-05 |
| W10 | **Strength roles**: the work / the accessory / the nuance / the survival. | ORD-07 |
| W11 | **Fighters' and hybrid opening cardio is a real aerobic block.** | ORD-09 |
| W12 | **Optional days** (Calves, Cardio, Core, Focus 1, Focus 2): add-ons or separate days, ideally separate; Focus slots may hit the same muscle, 2-3 sets each. | ORD-10, ORD-11 |
| W13 | **Session size**: resistance 5-7 exercises (45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); field athletes off-season up to 10-12 (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance). | VOL-08, VOL-16, VOL-17 |
| W14 | **Session length**: athletes, bodybuilders, powerlifters, pros ~90 min (max 2 h); weight loss and everyday clients 45 min-1 h. | UNI-09 |
| W15 | **Bootcamp** = timed circuits: 3-5 rounds × 30-50 s per station, 5-7 stations, 35-45 min; 4, 5 or 6 sessions a week all fine. | PRG-03 |
| W16 | **Calves 3 sets every leg day; rear delts their own sets.** | VOL-17 |
| W17 | **PPL weekdays are flexible** ("we don't really know what days they're going to really need"). | PRG-02 |
| W18 | **Fat Burn circuits are finishers after lifting.** | PRG-11 |
| W19 | **Contrast** stations for L2+ athletes off-season (the jump right after the heavy lift, no rest inside). | ATH-12 |
| W20 | **No medball for aesthetics** except in the warm-up; **COD for every athlete**; **Olympic work in every athletic week**. | ATH-05, ATH-06, ATH-10 |

### 10.2 The session order (v1 tiers)

| Tier | Block | Content | Rule / ID |
|---|---|---|---|
| 0 | Warm-up | 5 min any cardio + A-drills (lower/athletic days) or mobility (press days); running warm-up before sprints; dynamic medball warm-up (the only medball use for aesthetics) | always, never counted (ORD-08, ATH-05) |
| 0.5 | Skill | CrossFit / hybrid skill work | after core (INFERRED) |
| 1 | **Core block** | ~2 exercises: one thorax, one pelvis; planes rotate across the week; more rotational core where the sport needs it | first by default, movable (ATH-11, VOL-17, CAT-08); submaximal when first, ~2 sets, short of failure (PROPOSED) |
| 2 | Plyo / ballistic / sprint | 2-4 stations for field athletes; speed session order squirrel jumps → MACH / acceleration starts → max velocity | ATH-01, LIB-21 |
| 3 | Throws | medball (none for aesthetics) | ATH-05 |
| 4 | COD | every athlete, by turn angle | ATH-06 |
| 5 | Olympic / power | before any strength work; contrast complexes here for L2+ off-season | ORD-03, ATH-10, ATH-12 |
| 6 | The work + its paired upper lift | main lower lift paired with its opposite-surface upper lift (hip + push, knee + pull); horizontal before vertical | ORD-02, UNI-11, ORD-01 |
| 7 | Secondary pair | unilateral lower + the other upper vector | OBSERVED BYOP; UNI-11 |
| 8 | Isolation / Focus | arm and delt work matching the day; leg extension before leg curl; **calves 3 sets each leg day**; **rear delts own station**; MYO only last | VOL-17, VOL-15, ORD-04 |
| 9 | Conditioning | buy-out, circuit, WOD last; a fighter's/hybrid aerobic block or sprint block may open the day | ORD-09, PRG-11 |

### 10.3 Pairing and day grammars

| Grammar | Day types | Use | Status |
|---|---|---|---|
| G1 SAME_PATTERN | A = [BKD \| HPULL] + [UKD \| VPULL] (+ quad iso, biceps, rear delt, calves); B = [BHD \| HPUSH] + [UHD \| VPUSH] (+ leg curl, triceps, side delt, calves) | physique 3-6 days; strength; high-level athletes needing more stimulus | OBSERVED BYOP AESTHETICS/ATHLETIC; UNI-06 |
| G2 CROSS_PATTERN | A = [BKD \| HPULL] + [UHD \| VPUSH]; B = [BHD \| HPUSH] + [UKD \| VPULL] | bootcamp, fat loss, general, **athletes by default**, in-season, 2-3-day plans | OBSERVED BOOTCAMP 1 A days; **B days corrected** (ORD-06) |
| G3 BASEBALL_PARTS | Mon [BKD \| HPULL] / UHD + biceps + calves; Tue [BHD \| HPUSH] / UKD + triceps + shoulders; Thu as Mon with VPULL; Fri as Tue with VPUSH; core first, then Part A ballistics, OLY, Parts C/D, buy-out | in-sport athletes (baseball/softball) | OBSERVED; ATH-11 moves core first |
| G4 UPPER_LOWER | Lower 1 squat-led (axial squat, non-axial hinge); Lower 2 hinge-led (axial hinge, leg press); Upper H pull → H push → V pull → V push + arms + side and rear delts | when UL is requested | OBSERVED + PER-04, ORD-01, VOL-17 |
| G5 PPL | push / pull / legs; Legs 1 squat-led, Legs 2 hinge-led; weekdays flexible | 5-6 days, advanced physique | OBSERVED + PRG-02, PER-04 |
| G6 CONJUGATE_4ROLE | ME lower / ME upper / DE lower / DE upper, each the work → the nuance (paired with the work) → the accessory → the survival | strength | ORD-07; nuance position and vector INFERRED (squat-led → pull, hinge-led → push) |
| G7 QUALITY_DAY | CrossFit knee + snatch / pull + clean / hip + snatch / push + clean | CrossFit | OBSERVED |
| G8 ATHLETIC_THEMED | jump day = hip + pushes; medball day = knee + pulls | off-season athlete variant | re-wired by UNI-11 (vertical vectors swapped) |

The vertical vector is no longer a free choice: it follows the lower pattern it is paired with (UNI-11). Upper/lower and PPL splits do not mix lower and upper in one session, so W2 does not apply to them. Same-pattern athletes (PROPOSED): high-level athletes who need more stimulus to grow (his trigger, UNI-06) and size-focused off-season athletes from the ATH-03 "more resistance" group.

### 10.4 Axial loading once a week (PER-04, EQ-11)

| Item | Rule | Status |
|---|---|---|
| Budget | one axial squat exposure + one axial hinge exposure per week | PER-04 (hinge reading INFERRED from "I'm probably going to load it with the deadlifts as well") |
| Axial (HIGH) | barbell back / front / high-bar / low-bar / zercher / overhead / Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings | INFERRED list (02 `axial_spinal_load`) |
| MODERATE | goblet / DB / KB front-loaded squats, hack squat, pendulum (shoulder pads), landmine squat | allowed on the second day only if the client is not sore and not already loaded that week (INFERRED encoding, 02) |
| NONE / LOW (second exposure) | leg press, belt squat; hip thrust (bar or machine), glute bridge, 45° back extension, reverse hyper, GHD hip extension, cable pull-through, KB swing; single-leg DB work | PER-04, EQ-11; hinge pool PROPOSED |
| Soreness switch | an athlete already loaded on the back that week, or sore, switches to the belt squat | EQ-11 |
| Spacing (4-6 days) | axial squat Monday (A1), axial hinge Friday (B2); Tuesday (B1) non-axial hinge, Thursday (A2) leg press / belt squat | PROPOSED |
| Not counted | Olympic lifts and loaded jumps (light, fast, short sets) | PROPOSED; round 2 |
| Powerlifters | PROPOSED exception: a second, light technique squat or deadlift is allowed (their sport is the bilateral lift) | PROPOSED; round 2 |
| Home / hotel without machines | the second squat day is a single-leg squat (split squat, step-up, box pistol) | PROPOSED |
| OBSERVED conflict | the non-competitive athletic program (sheet tab 'JUSTICE LEAGUE') wrote a Monday front squat + Thursday low-bar back squat (two axial squats); no longer reproduced | PER-04 |
| Check | every v1 template counts its axial exposures: all ≤ 1 squat + 1 hinge (05 §8.7) | computed |

### 10.5 Session sizes and lengths

| Session type | Exercises | Length | Default sets | ID |
|---|---|---|---|---|
| Resistance (physique, general, strength accessories) | 5-7; 45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 | general 45-60 min; bodybuilders/powerlifters ~90 (max 120) | 3 compound / 2 isolation / 3 calves | VOL-08, VOL-16, UNI-09 |
| Field athlete off-season | up to 10-12 + the 2-exercise core block | ~90 min (max 120) | **2 per slot** (3 at 90 min) | VOL-08, VOL-17, VOL-16 |
| Non-competitive athletic | ~10 slots (OBSERVED: that program's Monday) | 60 min (PROPOSED) | 2 per slot | ATH-13 |
| Strength | the four roles + survival isolations | ~90 min | his template | ORD-07 |
| Bootcamp | 5-7 stations × 3-5 rounds × 30-50 s | 35-45 min incl. warm-up and core | time-based | PRG-03 |
| In-season athlete | 2 days a week, short | PROPOSED 45-60 min | 2 | PER-08 |
| Optional day | Focus 1, Focus 2, core, calves if a priority, aerobic | separate day preferred | Focus 2-3 sets each | ORD-10, ORD-11 |

**Counting convention** (PROPOSED): warm-up, core block and conditioning finishers sit outside the exercise cap and inside the time budget; a superset of two small isolations counts as one station. Under this count his two athlete answers agree: VOL-08's "max maybe 12" excludes core; VOL-17's "12 to 14" includes the 2 core exercises.

**Time-overflow rule** (PROPOSED): sets added through the block (VOL-07) eventually push a session past its length; the generator first supersets the lower/upper pairs and small isolations (ORD-05 short-time case), then applies the cut order.

| Family | Cut first (in order) | Never cut |
|---|---|---|
| Aesthetics | Focus → arm isolation (delt stays as a superset partner) → quad/ham isolation → the second non-axial bilateral on 2-3-day plans | each bilateral + paired upper, each unilateral + paired upper, calves, one rear-delt station a week, the core block |
| Athletic | 2nd plyo / sprint → COD (keep for COD sports) → leg curl → second pair to 2 sets | core block, 1 plyo/ballistic, the Olympic lift, the work + paired upper, calves, one rear-delt station a week |
| Strength | the nuance → the accessory | the work and the survival (ORD-07: survival is "done no matter what") |
| Bootcamp | 7th station → rounds 5 → 3 | every primary pattern across the week, calves, the week's rear-delt station |

### 10.6 Supersets, contrast and circuits

| Use case (ORD-05) | Who | Trigger |
|---|---|---|
| Short session | anyone | minutes below what the station list needs (`superset_below_minutes`) |
| More stimulus | advanced (L3) lifters and athletes who no longer fatigue enough | L3 + preference |
| Aerobic capacity | off-season athletes (VO2 max, mitochondrial work) | athletic family + off-season |
| Beginners who don't fatigue | L1 clients ("they really enjoy it because they feel they're getting more fatigued") | L1 + preference |

What to pair: the W2 pairs (knee lift + pull, hip lift + push) and isolation pairs (biceps + rear delts, triceps + side delts, calves + delts); never two lower compounds; never a heavy lift with a fatiguing lift for the same muscle except contrast. Intermediate with time = straight sets (INFERRED from the four cases). **Contrast** (ATH-12): L2+ off-season, heavy 78-85 %, "immediately" into the jump, no rest inside the complex (SCIENCE: PAPE studies favour several minutes of rest; immediate French contrast is an established coaching method, kept as he writes it). **Bootcamp circuits** (PRG-03): 7 stations at 4 × 50 s ≈ 43 min; 6 stations at 5 × 45 s ≈ 44 min (05 time model).

### 10.7 The week

- **Shape**: A1, B1, OPT, A2, B2, OPT, OFF (Mon-Sun) for 4-6 days (OBSERVED); A1/A2 (and B1/B2) are the same day type with **different exercises**: one axial exposure, one non-axial (PER-04). At least one full OFF day (Sunday) (OBSERVED; INFERRED rule). Consecutive days alternate lower dominance (OBSERVED).
- **4-day plans become 5-6 days by adding optional days, not more heavy sessions** (OBSERVED 'ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK'); in-sport athletes stay at 2-4 days.
- **Frequency** (OBSERVED, INFERRED as rule): with ≥ 4 resistance days every lower pattern ≥ 2x/week, push ≥ 2x, pull ≥ 2x, each upper vector ≥ 1x; with 2-3 days every primary pattern ≥ 1x. Exemptions: conjugate strength, CrossFit, in-season minimal bilateral (UNI-10), boxers reduce pressing (ATH-04).
- **Strength**: Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper (OBSERVED). **PPL**: any weekdays (PRG-02). **Bootcamp**: 4 = A, B, aerobic, A, B, aerobic; 5 = rolling A/B (A-B-A-B-A, next week B-A-B-A-B, PROPOSED); 6 = Bootcamp 1-2-3, 1-2-3 (OBSERVED). **In season**: 2 days.
- **Aerobic placement**: separate days first, add-ons after lifting second (ORD-10); never the same colour twice (OBSERVED); each template's `aerobic_ATH07` block in 05 says how many sessions its week holds and how many are add-ons or walks.
- **Buy-outs** (OBSERVED BASEBALL Part E): 1-3 short maximal bouts on 2-4 days a week in athletic sessions of 75+ min; none in deloads (PER-05).

### 10.8 Generator split templates (summary; `05_templates.json > generator_split_templates[family][days]`)

Every day opens with the warm-up and `core x2` (movable). `[A | B]` = W2 pair; `*` = the week's axial exposure, `~` = non-axial; `(60+)` = only at that length or longer.

| Family | Pairing | Default length | 2 days | 3 days | 4 days | 5-6 days |
|---|---|---|---|---|---|---|
| Muscle & Physique | same pattern | 60 min general, ~90 bodybuilders | A [BKD* \| HPULL] [UKD \| VPULL] [BHD~ \| HPUSH] + calves, rear delt; B mirror | OBSERVED 3 DAY BUILDER: A squat + pull, B deadlift + push, C both bilaterals non-axial | **A1 squat* + pull, B1 hip thrust~ + push, OPT, A2 leg press~ + pull, B2 deadlift* + push, OPT, OFF**; alt UL | + 1-2 optional days; alt PPL × 2 |
| Athletic Performance | cross pattern (same-pattern variant) | ~90 competitive, 60 non-competitive | A core → plyo → throw → COD → Olympic → [BKD* \| HPULL] → [UHD \| VPUSH] → calves + rear delt → buy-out; B mirror; 2-day in-season variant | OBSERVED STARTING S1 jump + knee + pull, S2 medball + hip + push, S3 Olympic + strength | A1/B1/OPT/A2/B2/OPT/OFF; BASEBALL Parts variant | + optional days; in-sport athletes stay at 2-4 |
| Strength | same pattern; the four roles | ~90 | FB_ME / FB_DE | squat / press / deadlift | **ME lower Mon, ME upper Wed, DE lower Thu, DE upper Sat** (OBSERVED) + A/B lead-lift weeks | + optional days, never a 3rd heavy lower day |
| Fat loss / bootcamp / general | cross pattern | 45-60 gym; 35-45 circuits | A [BKD \| HPULL] [UHD \| VPUSH]; B [BHD \| HPUSH] [UKD \| VPULL] (corrected) | Bootcamp 1-2-3 circuits | gym A/B or bootcamp circuits; FAT BURN variant with circuit finishers | 5 rolling A/B; 6 = 1-2-3 × 2 |
| Hybrid / CrossFit | cross-pattern accessories | 60-90 | HY_1 / HY_2 | class squat / press / deadlift | CrossFit competitor days | HYBRID 5 days; class 6 |
| No equipment | the goal's skeleton filtered by kit (not a goal of its own) | - | - | - | - | - |

All 30 templates and their variants were regenerated in v1 with stored checks; across 66 check runs there are 0 pairing, order, axial or cap failures beyond documented observed-design exemptions (05 §8.7).

### 10.9 Pending (sessions)

Core-first dose (submaximal when first; PROPOSED); the cap counting convention (core outside the 12); whether full-body days may give each muscle 1-2 exercises instead of 3-4 (PROPOSED yes); axial: same day or two days for squat and deadlift, which lifts count, powerlifter exception, second squat without machines; same-pattern athletes; strength 'nuance' vector and position; 4th aerobic session for aesthetics (PROPOSED: a second easy Orange, walks on top; all physique clients, his "4 for aesthetics bodybuilders"); calves 3 sets on every leg day also for athletes on 4-day full-body plans (12 sets/week): his rule stands as the default; whether he meant that for athletes is parked for a later round (04 question 11.2); where the small-muscle bonus exercise goes (PROPOSED: optional-day Focus slot, else the end of the shortest day); A-days twice a week: alternate added sets (PROPOSED); buy-outs on every 60+ min athletic session (open v0); vertical press for physique/fat-loss clients (open v0); COD in BASEBALL / in-season weeks.

---

## 11. Plan types

Full version: `06_periodization.md` / `.json` (§7 plan-length model with computed curves, §8 skeletons mode × family, §12 science).

### 11.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| P1 | **4-6-week plans are maintenance / transition** (vacation 1-2 weeks, travel, moving, off-season → on-season, a planned maintenance phase) at about **50-70 % of the volume**, "to recover and not push too hard". There is no 6-week loading plan. | PER-01 (NOT RIGHT to v0) |
| P2 | **8-week plan**: "the first 4 weeks are going to be mainly your body getting used to it, and then the next 4 weeks are going to be you driving it hard ... An 8-week program is a program that wants to modify you, so you have to start hard." | PER-01 |
| P3 | **12-week plan (his preferred)**: weeks 1 to 2-4 getting used to the movements; the next 4-6 weeks driving hard, "not all the way to the top"; the last weeks hardest ("more tired, more stimulus, more changes, more adaptations"). | PER-01 |
| P4 | **Repeated 12-week cycles start one level higher**: "start at a 2 and end at an 11". | PER-01 |
| P5 | **Week-by-week mode** with no set length: "Just keep me in line, kind of thing, and then it does it by itself." | PER-01 |
| P6 | **Yearly mode**: hard work in winter; the last couple of weeks of the year (New Year's, Christmas) automatically maintenance; quarter themes (§11.5). | PER-01 |
| P7 | **Not conjugate or anything set in stone, but with "good sound science behind it".** | PER-01 |
| P8 | **Blocks of 4-6 weeks**; exercises fixed inside a block; 1-2 small variables change at the next block. | PER-02 |
| P9 | **Deload = about half the sets, same exercises, lighter load or 3+ RIR, no buy-out or finisher.** | PER-05 |
| P10 | **Level up a slot at the end of a block** on '8 - That was perfect' or easier, no pain. | PER-06 |
| P11 | **Tests by checkbox at the start of a block** (strength, cardio, speed ...) or "No need for testing"; the plan reminds them when the test comes. | PER-07 |
| P12 | **Athlete seasons**: off-season most volume; pre-season more speed/power, less volume; in-season ~2 days, low volume; post-season recovery. | PER-08 |
| P13 | **His strength %-template and Olympic ramp** are the default for strength-focused plans. | PER-09 |
| P14 | **Smooth weekly increases** for hypertrophy and general clients; **2-week steps and waves** for fight/competition prep. | PER-10 |
| P15 | **VOL 1 → VOL 2 → VOL 3**, one per off-season block, for every athlete. | PER-11 |
| P16 | **Off-season STARTING / MID / ADVANCED** = consecutive blocks or athlete levels, "depends on whatever is needed". | PRG-04 |

### 11.2 The plan modes (`06 > plan_length_model.modes`; splits PROPOSED)

| Mode | When | Shape | Weekly step | Deload | Tests |
|---|---|---|---|---|---|
| **C12** 12-week cycle (preferred) | default when 12+ weeks are available | acclimation weeks 1-3 (L1/returning/ex-pro 1-4; L3 1-2) → drive to week 9 (L3 to week 8) → hardest weeks 10-12 (L3 9-12) | acclimation ≤ 3 %, then the person's 3/5/7 % | none at a fixed week; triggered by check-ins; week 1 of the next cycle is a deload (skipped after a maintenance block) | week 12 if ticked |
| **C8** 8-week | a shorter plan that "wants to modify you" | start about 10 % above the level start; weeks 1-4 adapt; weeks 5-8 drive | weeks 1-4 ≤ 5 %, then the person's step | triggered only; next plan opens with a deload or maintenance | week 8 if ticked |
| **MAINT** 4-6-week maintenance / transition | vacation, travel, moving, season change, planned maintenance | flat volume at 50 / 60 / 70 % of the last block's final 4 loading weeks (new clients: of the level start); loads kept, sets cut; RIR 2-3; no intensifiers; exercises can switch to what is available | 0 % | it is the recovery | none unless ticked |
| **WBW** week-by-week | "keep me in line" | the same phases run without an end date; a block boundary every 4-6 weeks; a cycle counter steps the start up after ~12 loading weeks | from the weekly check-in (requires it) | triggered; at the latest after 12 loading weeks | at block boundaries if ticked |
| **YEAR** yearly | a whole year | four quarters, each ~one 12-week cycle + a transition/test week; holiday maintenance weeks 51-52 | per quarter | transitions weeks 13, 26, 39 | weeks 13, 26, 50 if ticked |
| **PREP** fight / competition | a fight, meet or competition date | 2-week steps and waves (OBSERVED boxer: base weeks 1-2, conversion in 2-week steps, week-7 accessory unload, week-8 peak); 1-2-week taper when the date is fixed | same average step in 2-week steps | taper | the event |
| **SEASON** athlete | competitive athlete with season dates | off-season (most volume, VOL 1 → 3) → pre-season (less volume, more speed/power, taper) → in-season (2 days, low volume) → post-season (recovery) | off-season person's step; pre-season 0-3 %; in-season 0 % | taper before the opener; recovery week post-season | end of off- and pre-season blocks if ticked |

### 11.3 Reference curves (one big muscle, static plan; computed with the venv, = 06 §7.1)

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L1 phase | acc | acc | acc | acc | drive | drive | drive | drive | drive | hard | hard | hard |
| L1 sets | 10 | 10 | 10 | 10 | 11 | 11 | 12 | 13 | 13 | 14 | 14 | 14 |
| L2 phase | acc | acc | acc | drive | drive | drive | drive | drive | drive | hard | hard | hard |
| L2 sets | 15 | 15 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 22 | 22 |
| L3 phase | acc | acc | drive | drive | drive | drive | drive | drive | hard | hard | hard | hard |
| L3 sets | 20 | 20 | 21 | 21 | 22 | 23 | 23 | 24 | 25 | 25 | 25 | 25 |
| RIR (L2, PROPOSED inside 1-3) | 2-3 | 2-3 | 2-3 | 1-2 | 1-2 | 1-2 | 1-2 | 1-2 | 1-2 | 1 | 1 | 1 |

L1 and L2 climb about 40-47 % and reach their caps in week 10; L3 climbs 25 % at 3 %. With check-ins, the steps move faster or slower. Whole-set rounding makes single-muscle steps look bigger than the step (one set on 10 = +10 %), so the 10 % guardrail is checked on the person's **total** weekly sets and releases are staggered (PROPOSED, 06 §7.1).

**8-week** (start × 1.10): L1 11, 11, 12, 12, 13, 13, 14, 14; L2 17, 17, 18, 19, 20, 21, 22, 22; L3 22, 22, 23, 24, 24, 25, 25, 25 (06 §7.2). **Maintenance** (06 §7.3): L2 base 21.75 → 11 (50 %), 13 (60 %), 15 (70 %); older adults ≥ 70 %. A 3 × 60-min hotel week holds only ~42 % of a 156-set bodybuilding week (12 §5.4): the engine says so and offers a 4th short session, 75-min sessions or supersets.

### 11.4 Repeated cycles (P4; step PROPOSED)

Next start = previous start × 1.05; next cap = previous cap + 1 (max 25 non-priority, 30 priority); after holds, pain or a maintenance block the start repeats.

| Level | Cycle 1 | Cycle 2 | Cycle 3 | Cycle 4 |
|---|---|---|---|---|
| L1 | 10 → 14 | 11 → 15 | 12 → 16 | 13 → 17 |
| L2 | 15 → 22 | 16 → 23 | 17 → 24 | 18 → 25 |
| L3 | 20 → 25 | 21 → 25 | 22 → 25 | 23 → 25 (cap by week 4) |

L1/L2 match "start at a 2 and end at an 11" exactly; L3 hits the 25 ceiling earlier each cycle, so for advanced lifters "one level higher" must come from load, intensifiers or a rotating priority muscle (cap ~30) (PROPOSED; round 2).

### 11.5 Yearly mode (PER-01 text; structure PROPOSED)

| Quarter | Weeks | Theme (his words) | Resistance (PROPOSED) | Aerobic (PROPOSED) |
|---|---|---|---|---|
| Q1 Jan-Mar | 1-13 | "really hard work, but it's a lot more cardio ... so you can start the year cutting down so you can get into summer" | 12-week cycle at the level start (no step up in a calorie deficit); step ≤ 3 %; supersets and finisher circuits for density | goal default + 1 |
| Q2 Apr-Jun | 14-26 | "losing body fat and starting to get in shape" / "a mix in between building up a little bit more muscle and keeping your body fat down" | cycle one step up; 2 acclimation weeks; peak in late June | goal default |
| Q3 Jul-Sep | 27-39 | "maintaining the way your body looks and staying healthy" | two ~6-week maintenance blocks at the level start (≈ 66-80 % of the Q2 peak, inside both 50-70 % and "15-20 = maintenance") | goal default; outdoor activity counts |
| Q4 Oct-mid Dec | 40-50 | "building muscle, like wintertime" (less cardio) | cycle one more step up; growth range; priorities allowed; test week 50 if ticked | goal default − 1 (min 2) + walks |
| Holidays | 51-52 | "it just automatically puts you in maintenance" | ~60 % (50-70 %) of Q4's final weeks, any equipment, RIR 2-3 | walks / any activity |

Computed L2 year (06 §7.6): Q1 15 → 20; Q2 16 → 23; Q3 15 flat; Q4 17 → 24; holidays 14. **Ambiguities for round 2**: "this second half of the year, the second quarter" (read as Apr-Jun); which quarter carries the main fat loss (Q1, Q2 or both); what "maintain" means in Q3; whether volume should step up during the Q1 cut (SCIENCE: a deficit blunts muscle gain, not strength gain, Murphy & Koehler 2022); northern-hemisphere / Christmas anchor vs the user's own summer, Semana Santa, Thanksgiving and vacation weeks; athletes in yearly mode follow their season calendar instead (INFERRED).

### 11.6 Deload, taper and transitions (06 §6; placement PROPOSED)

| Rule | v1 |
|---|---|
| Dose | about **half the sets of the current week** (round up, min 1 per exercise), same exercises (Olympic lifts kept at half the sets and light technique loads), lighter load or 3+ RIR, no buy-outs, finishers, MYO or supersets; plyos = landings / low amplitude at about half the contacts and throws; conditioning easy Orange only (PER-05; athletic/conditioning parts PROPOSED) |
| When | no fixed deload week inside 12- or 8-week plans; **triggered** by 2 holds in a row, median EFFORT ≥ 9 two weeks running, 'Felt a PAIN' on 2+ exercises in one week, or performance down on 3+ main lifts for 2 exposures; after a triggered deload resume at the volume of 2 weeks before; **week 1 of the next cycle is a deload** (skipped after a maintenance block) |
| Taper | before a season opener, event or fight: 1-2 weeks, volume -40-60 %, intensity and frequency kept, no new exercises (SCIENCE Bosquet 2007, Pritchard 2016) |
| Recovery week | post-season / end of a throwing block: arm care, mobility, easy aerobic, no main lifts (OBSERVED baseball) |
| Vacation 1-2 weeks | ~50 % with what is available, or full rest; return at the previous start (SCIENCE Bosquet 2013, Hwang 2017) |
| In-season | no planned deload; lighter weeks around congested games |
| Retired v0 | fixed deloads (week 8 of 8, week 7 of 12), the 0.85 × W1 deload, "6 weeks = first half of 12", "8 = 7 + deload/test", "12 = 6 + deload + 5", STEP mode as the default for strength/athletes/hybrid |

### 11.7 The science behind each shape (06 §7.7)

| Shape | Evidence | Verdict |
|---|---|---|
| 2-4 acclimation weeks | Damas 2016 (hypertrophy signal mostly after ~3 weeks once damage drops); repeated-bout effect | supported (low step, 2-3 RIR) |
| Drive hard, hardest last weeks | more weekly sets → more growth with diminishing returns (Pelland 2026, Enes 2023/24); periodization model matters little when volume is equal (Grgic 2017, Moesgaard 2022, Harries 2015); planned beats unplanned for strength (Williams 2017) | supported: volume ramp to a level cap, then load/intensity |
| No fixed deload | deloads in practice every ~5.6 weeks (Rogerson 2024); planned or autoregulated both acceptable (Bell 2023); a mid-program week off did not change growth (Coleman 2024) | plausible with triggers (open) |
| 8 weeks start hard | trained people do well starting from their previous volume (Scarpelli 2022, Barsuhn 2024) | supported for people coming from training; after a layoff prefer 12 weeks |
| 4-6-week maintenance 50-70 % | Bickel 2011, Spiering 2021, Bosquet 2013, Ogasawara 2013 | well supported; older ≥ 70 % |
| Repeat cycles one level higher | Scarpelli 2022; Pelland 2026 (each step costs more sets) | supported with a ceiling |
| Week-by-week | responsive planning (Kiely 2012); autoregulation ≈ % plans (Hickmott 2022) | supported when weekly check-ins exist |
| Yearly + holidays | no controlled annual trials for general clients (Afonso 2017); cut phases protect rather than grow muscle (Murphy & Koehler 2022); holiday weight gain small but persistent (Yanovski 2000) | a coaching choice with sensible support |
| Steps & waves for prep | taper evidence (Bosquet 2007, Pritchard 2016); no hypertrophy advantage for any model (Grgic 2017) | supported as a peaking tool |
| Returning after a layoff; ex-pros | strength and skill persist longer than size; regaining takes ~half the time off (Psilander 2019, Blocquiaux 2020) | supported: L1 volume, exercise level kept, level-up check after the first block |
| Strength %-template | main lift within ~1-4 points of the RPE chart; Olympic 4×8 @ 75 % high for full catch lifts | consistent; Olympic flagged (§9.5) |

### 11.8 Pending (plans)

Quarter themes and calendar anchor; 8-week split (4 + 4 per his first statement, vs "good stimulus for the last 5 weeks"; "start hard" = +10 % sets PROPOSED); 12-week week split and acclimation cap; deload placement and dose base (half of the current week PROPOSED, vs his written deloads at 0.75-1.0 × week 1, OBSERVED); advanced lifters at the ceiling; pre-season = the "season change" maintenance block or a separate block (PROPOSED: the same 4-6-week block at ~60 % with speed/power emphasis plus taper); a season that starts before the requested plan ends (PROPOSED: run to the season date, taper, then switch to in-season); PRG-04 decision rule (16+ weeks off-season and L1-L2 → consecutive blocks); fight-camp complexes vs ATH-12 "off-season only"; whether the light 20 in '12/10/8 -20' counts as a hard set (PROPOSED yes: 4 sets).

---

## 12. Testing

### 12.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| X1 | The athlete or coach picks what to test **at the start of a block** by checkbox ("Your strength, your cardio, your speed?"), or "No need for testing". | PER-07 |
| X2 | At the end of the block the plan says "All right, it's time for your test. Get ready. This test is going to be this day." | PER-07 |
| X3 | Test items in his library: 'LEFT TEST' = L-test (3-cone); '5/10/05' = 5-10-5 pro agility; CARDIO 'DISTANCE TEST' / 'SPEED TEST'; 'LVL 5 = Work up to 1RM' (CrossFit); STRENGTH-8 'TEST' weeks. | LIB-01, OBSERVED |
| X4 | **'21.6 mile run'** = what he calls a marathon, "don't know when/where we need that": not a default test (a marathon is 26.2 mi; flagged). | LIB-18 |
| X5 | 'WEIGHT USED or SCORE': SCORE = times, rounds or distances for conditioning. | PRG-08 |
| X6 | Aerobic tests on any erg, tracked by distance, calories or time. | EQ-14 |

### 12.2 Test menu (06 §6.1; level split and dose PROPOSED)

| Checkbox | Options | Notes |
|---|---|---|
| Strength | L1: a rep max (5-8RM) or e1RM from logged reps on 2-3 main lifts; L2-L3: 3RM or 'Work up to 1RM' | e1RM (Epley) from the logbook when no test is wanted; pros: no true 1RM (PROPOSED) |
| Cardio | 1-mile max-effort run, the CARDIO list 'DISTANCE TEST' / 'SPEED TEST', or an erg time trial (calories, time or distance) | the 21.6-mile item is not offered |
| Speed / agility | 10-30 m sprint, 5-10-5, L-test | athletes |
| Jumps | countermovement or broad jump | athletes (INFERRED practice) |
| Body | body weight (now an intake field), optional photos or girths | GEN-02; photos PROPOSED |
| None | "No need for testing" | default when nothing is ticked |

**When** (PROPOSED): the last week of the block (12-week: week 12; 8-week: week 8; yearly: weeks 13, 26, 50; week-by-week: at a block boundary); the test day replaces that week's top sets and the rest of the week runs at ~50-70 % of its sets; strength tests 48-72 h after the last hard lower session; none in maintenance blocks unless ticked. **Reminders**: at block start (confirm the ticks), 7 days before and the day before; static plans print the test day and a "get ready" line the week before.

### 12.3 Pending (testing)

The test catalogue and test-week dose (PROPOSED); the 21.6-mile item (remove, 26.2 or keep; round 2); whether results feed % prescriptions automatically (PROPOSED yes for barbell main lifts and Olympic lifts when the client enters a recent best).

---

## 13. The generator

Machine-readable twin: `generator_spec_v1.json` (inputs schema with EN/ES i18n keys, rule tables, engine parameters, template references, plan-type shapes, coach-rule hook format, check-in contract, validation checks). Everything below follows the coach's GEN answers; mechanisms he did not specify are PROPOSED.

### 13.1 Confirmed product rules

| # | Rule | ID |
|---|---|---|
| G1 | **Users**: clients, coaches, trainers, strength and conditioning coaches, anyone. | GEN-01 |
| G2 | **Language**: starts in English with a toggle to Spanish for "the whole thing". | GEN-01 |
| G3 | **Intake**: remove sex; replace training age with **training experience in years**; for sport goals open sport and position when they train for a sport; **recreational sport → general sport only** (no position, no season); add **body weight**. | GEN-02 |
| G4 | **Output format is undecided**: ideas he raised: a PDF people can screenshot, something easy on the phone, maybe a Google Sheet, no full app, maybe a website plus an open-source repo. He doubts in-tool tracking: "They should be tracking it themselves, however they want". | GEN-03 |
| G5 | **Default exercise in every slot + dropdowns** to swap within the category. | GEN-04 |
| G6 | **Adjust week to week** from logged EFFORT and HOW IT FELT ('Felt a PAIN' → swap or lower the level; EFFORT 9-10 → hold or cut; EFFORT ≤ 6 → add). | GEN-05 |
| G7 | **A video for every exercise** (more links needed). | GEN-06 |
| G8 | **A short cue per exercise in his voice + his instruction block at the top.** | GEN-07 |
| G9 | **Hard rules**: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped; **and coaches can add their own rules**. | GEN-08 |
| G10 | **Plan types offered**: 4-6-week maintenance/transition, 8 weeks, 12 weeks, week by week, a year. **Tests by checkbox.** | PER-01, PER-07 |
| G11 | **Levels explained in plain words**; ex-pros at L1 only briefly. | PRG-05 |
| G12 | **Generic, understandable program names**; spelling corrected in the generator only. | FIX-03, FIX-04 |
| G13 | **Client preference can choose between alternatives**; core block movable; optional days separate or added on; A/B variety weeks for those who want them. | EQ-10, ATH-11, ORD-10, PER-03 |
| G14 | **The tool computes the percentages**; it learns from everyone's data over time. | VOL-06, VOL-01 |

### 13.2 Intake form v1 (`generator_spec_v1.json > inputs_schema`)

Screen order follows the express path; "Full" fields appear behind "More options". Every label and option has an i18n key (`intake.<field>.label`, `intake.<field>.opt.<value>`) with EN and ES strings (Spanish PROPOSED, to be approved by the coach or a coach he trusts).

| Field | EN label / ES label | Type and options | Shown if / required | Source |
|---|---|---|---|---|
| F00 lang | Language / Idioma | en (default), es | always | GEN-01 |
| F06 units | Units / Unidades | lb, kg (default by region) | always | PROPOSED (N-PROD-12) |
| F01 safety | Before we start / Antes de empezar | chest pain or heart condition; surgery or fracture in the last 6 months; pregnant or gave birth in the last 6 months; injury under treatment; a doctor told you not to train → any yes: no automatic plan, refer to a professional or the coach | always, required | PROPOSED (N-IN-04) |
| F02 age | Age / Edad | 10-90 | required | v0; older/youth rules (ATH-09) |
| F05 body_weight | Body weight / Peso corporal | number + unit | **required** | GEN-02 ("weight is going to be important"); loaded jumps 10-20 % BW (EQ-15) |
| ~~F04 sex~~ | removed | - | - | GEN-02, ATH-09 |
| F07 goal | Main goal / Objetivo principal | build muscle (aesthetics/bodybuilding); get stronger (strength/powerlifting); athletic performance; lose fat; general fitness and health; hybrid / CrossFit | required | v0 families; ATH-13 |
| F07b format | How do you like to train? / ¿Cómo te gusta entrenar? | gym sessions; bootcamp-style circuits | goal ∈ lose fat, general fitness | PRG-03; PROPOSED |
| F11a competitive | Do you compete in a sport? / ¿Compites en un deporte? | yes (competitive); recreational; no sport | goal = athletic performance | GEN-02 |
| F11 sport | Sport / Deporte | profile list (27 profiles, `04_profiles.json > profiles[].id`) | competitive: full list; recreational: general sport list → profile `weekend_warrior` + sport tag | GEN-02, ATH-13 |
| F12 position | Position / Posición | profile variants (e.g. pitcher, lineman, skill) | competitive only | GEN-02, ATH-08 |
| F13 level_of_play | Level of play / Nivel | high school, college, pro, masters, amateur | competitive only; modifier on loads, step and care, not a separate profile | PRG-09 |
| F14 season | Season / Temporada | next season starts on (date); in season until (date); competition / fight date; no season (→ off-season) | competitive only, required | GEN-02; dates over phase picker PROPOSED (N-IN-06) |
| F15 practice | Practice load / Carga de práctica | practice days/week, game days | competitive only, optional | PROPOSED (N-ATH-07) |
| F17 experience | Training experience / Experiencia de entrenamiento | years of consistent training (0-30); months off in the last 2 years; former competitive / pro athlete (yes/no) → level L1-L3 with a plain-words reason | required | GEN-02, PRG-05 |
| F42 recovery | Your usual week / Tu semana habitual | sleep (< 6 h, 6-7, 7-8, 8+); stress (low, normal, high); physically hard job or other sport load (yes/no) | required (3 taps) | PROPOSED (sets the before-logs step, §5.4d) |
| F09 priority | Muscles to bring up (max 2) / Músculos a priorizar (máx. 2) | his FOCUS list: quads, glutes, hamstrings, back, chest, shoulders (side / rear / front), biceps, triceps, calves, core; V-taper bias (side delts + lats) | optional | VOL-02, VOL-18, OBSERVED AZ |
| F10 lift_style | How do you like to lift? / ¿Cómo te gusta levantar? | lighter, more reps; balanced; heavier, fewer reps (powerlifting style) | optional, default balanced | VOL-12 |
| F22 days | Training days per week / Días por semana | 2-6 | required | v0 |
| F23 weekdays | Which days? / ¿Qué días? | Mon-Sun multi | optional | v0; PRG-02 |
| F24 minutes | Session length / Duración de la sesión | 30, 45, 60, 75, 90 (+105, 120 for competitive athletes) | required; default by population (§10.5) | UNI-09; 105/120 PROPOSED |
| F25 plan_mode | Plan type / Tipo de plan | 12 weeks (recommended); 8 weeks; 4-6-week maintenance / transition; week by week; full year | required | PER-01 |
| F25b maint_reason | Why a maintenance block? / ¿Por qué un bloque de mantenimiento? | vacation / limited equipment (50 %); travel, moving or season change (60 %); planned maintenance (70 %) | plan_mode = maintenance | PER-01; factors PROPOSED |
| F25c previous_cycles | Blaze Camp 12-week cycles completed / Ciclos de 12 semanas completados | 0, 1, 2, 3+ (+ "last one ended with holds or pain") | optional | PER-01 ("start at a 2"); replaces v0 F40 |
| F26 start | Start date / Fecha de inicio | date (default next Monday) | optional | v0 |
| F26b tests | What do you want to test at the end of the block? / ¿Qué quieres medir al final del bloque? | strength; cardio; speed / agility; jumps; body weight / measurements; no need for testing | optional, default none | PER-07 |
| F27 equipment | Where do you train? / ¿Dónde entrenas? | full commercial gym; basic gym; home gym (rack + barbell + DBs); home DBs + bench; kettlebells only; bodyweight only; hotel gym; field / track / outdoor kit | required | EQ-01 (no bands) |
| F28 extras | Anything else you have? / ¿Tienes algo más? | add-ons ranked by slots unlocked (pull-up bar, medball, kettlebell, TRX, box, hurdles, hex bar, landmine, bumpers/platform, belt squat, sled ...) | optional | 10 `intake` |
| F29 machines | Machines available / Máquinas disponibles | leg press, pendulum, hack squat, belt squat, leg extension, leg curl (seated/lying), lat pulldown, assisted pull-up, row machine, chest press, shoulder press machine, cable stack, Smith, GHD / 45° / reverse hyper | gym profiles | EQ-11 (not ranked) |
| F29b preference | Equipment you prefer / Equipo que prefieres | machines; free weights; dumbbells; no preference | optional | EQ-10; PROPOSED |
| F30-F34 | heaviest DB pair; medball weights owned (≤ 20 lb); box height; running space; cardio options (run, treadmill, bike, rower, ski erg, none) | | optional | EQ-06, EQ-16, EQ-14 |
| F35 pain | Anything hurting? / ¿Te duele algo? | none; neck; shoulder; elbow; wrist/hand; upper back; lower back; hip/groin; knee; ankle/foot; other | required | VOL-03 |
| F36 pain_detail | Tell us more / Cuéntanos más | side; mild / moderate / severe (severe → refer); worse with overhead, deep knee bend, impact, twisting, bending forward, gripping, running | per area | PROPOSED (N-IN-05) |
| F38 exclusions | Anything you won't do? / ¿Algo que no harás? | running, jumping, barbell, lunges, overhead pressing, floor work, machines, other | optional | v0 |
| F43 output_mode | How do you want to follow it? / ¿Cómo quieres seguirlo? | just the plan (no tracking); plan + 1-minute weekly check-in; plan + full logbook | default "just the plan"; check-in required for week-by-week | PROPOSED (GEN-03 vs GEN-05) |
| F44 prefs | Preferences / Preferencias | core block: start (default) / after plyos / after strength / end; optional days: own day (recommended) / add to training days; "I like variety" (A/B weeks); heavy unilateral sets (athletes/coach); supersets when I don't feel tired | optional | ATH-11, ORD-10, PER-03, UNI-04, ORD-05 |
| F03 growth_stage | (youth athletes) | pre / around / after the growth spurt / not sure | age < 18 and athletic | v0; PROPOSED |
| F39 role | Who is this plan for? / ¿Para quién es el plan? | me; a client (coach mode) + coach rule packs | optional | GEN-01, GEN-08 |
| F41 email | Email (optional) / Correo (opcional) | delivery only | optional; no account in the MVP | v0; 13 |

**Express path** (12 taps-to-plan): F00, F01, F02, F05, F07, F11a/F11/F14 (athletes), F17, F22, F24, F25, F27, F35. **Derived values** (`generator_spec_v1.json > derived_values`): family, profile (+ variant), client level and its reason keys, ladder, season phase, plan shape, week layout, constraint band, equipment kit, start sets per muscle, bilateral share target, athletic budget, before-logs step, test week, aerobic sessions.

### 13.3 Decision pipeline (pseudo-code v1)

```
generate_plan(intake, model, coach_rule_packs):

  # 0 SAFETY ------------------------------------------------------------------------------------
  if any(intake.F01) or 'severe' in intake.F36: return refer(intake)                     # PROPOSED (N-IN-04)

  # 1 WHO IS THIS -------------------------------------------------------------------------------
  family  = GOAL_MAP[F07] (+ F07b bootcamp format)                                       # 6 families
  profile = SPORT_PROFILE[F11, F12] if competitive else ('weekend_warrior' if recreational else GOAL_PROFILE[F07])   # GEN-02, ATH-13
  level, reason_keys = level_from_experience(F17.years, F17.months_off, F17.former_pro)   # PRG-05: <12 mo -> L1; >1 yr -> L2;
                                                                                          # L3 PROPOSED; 6-12+ mo off -> L1 body; ex-pro L1 one block
  phase   = season_phase(F14, F15, F26) if competitive else None                          # PER-08
  band    = CONSTRAINT_BAND[client_family(family, age, pain, volume)]                     # EQ-03, EQ-13
  kit     = expand(F27 + F28 + F29 + F30..F34)                                            # never infer from template names
  step0   = before_logs_step(F42, age, layoff, pain)                                      # 5 % default, 3 % if stressed/60+/returning/pain
  rules   = layer(LOCKED, BLAZE_DEFAULTS, coach_rule_packs, client_prefs=F44, F29b)       # GEN-08 (13 §7.2)

  # 2 SHAPE AND WEEK ----------------------------------------------------------------------------
  shape   = PLAN_MODE[F25](level, family, phase, F25b, F25c)                              # PER-01: C12 / C8 / MAINT / WBW / YEAR (+ PREP, SEASON)
  week    = SPLIT[family][F22] (variant: same-pattern | cross-pattern | Parts | in-season)  # 05; UNI-06
  days    = place_on_weekdays(week, F23)                                                  # axial squat Mon / axial hinge Fri PROPOSED
  for day: stations = warmup + core_block(position=F44.core) + athletic_prefix(profile, phase)
                      + olympic(level) + pairs(hip+push, knee+pull) + isolation(calves 3, rear delt) + conditioning
           enforce: axial budget (1 squat + 1 hinge / week), row before pulldown, the work first, power before strength,
                    caps (5-7 resistance; athletes <= 12 + core), minutes(F24) -> superset first, then cut order

  # 3 WEEKLY SETS PER MUSCLE --------------------------------------------------------------------
  for m in MUSCLES:
      start[m] = START[m][level] x GOAL_PHASE_FACTOR[family, phase][region(m)]            # VOL-01; 12 §3.3-3.4
      if m in F09: start[m] += {L1: 4, L2: 5, L3: 6}[level]; cap[m] = PRIORITY_CAP          # VOL-02; split PROPOSED
      if m in pain_muscles: start[m] *= 0.5-0.7                                           # VOL-03
      if shape == C8: start[m] *= 1.10                                                    # PER-01 "start hard" (PROPOSED size)
      if shape == MAINT: start[m] = factor(F25b, age) x last_block_avg[m]                 # PER-01 50-70 %
      if F25c > 0 and last cycle clean: start[m] *= 1.05; cap[m] += 1                     # PER-01 "start at a 2"
  share = BILATERAL_SHARE[profile][phase] (+ pain shift)                                  # UNI-02, UNI-10
  athletic = AthleticBudget(profile, phase, level): plyo share by ground-contact class (start -15 -> target),
             method stage by week, contacts <= NSCA per session, throws tier, COD tier, Olympic sets   # ATH-01, CAT-10/11, ATH-10
  fit week 1: default sets (3 compound / 2 isolation / 3 calves; athletic slots 2), trim / add to reach start (VOL-07 order)

  # 4 EXERCISES (fixed for the block) -----------------------------------------------------------
  for slot: pool = catalog[slot.bucket] filtered by kit, soft level (load position, machines easier), population rules
                   (older/injured never: OH squat, snatch, low-bar, depth jumps; aesthetics: no throws), pain, exclusions,
                   status == active (no bands, no out_of_scope)
            default = argmax(default_candidate (BYOP library), his staples, preference F29b, constraint fit, continuity)
            dropdown = same-category alternatives                                                       # GEN-04, EQ-10
            second weekly exposure = different exercise of the same category (non-axial for squat/hinge)  # PER-04
            unilateral picks: contra (COD) / ipsi (acceleration) / health accessory weeks 1-4 (BB/PL)      # CAT-13

  # 5 DOSE ---------------------------------------------------------------------------------------
  reps = REP_MATRIX[family][class] (VOL 1/2/3 by block for athletes; F10 moves big compounds only)    # VOL-11, VOL-12, PER-11
  effort = RIR 1-3 (MAX only small-muscle/bodyweight last sets; MYO only last machine/isolation)        # VOL-13, VOL-15
  rest = REST[class] (1-2 min hypertrophy, 3-6 strength, as prescribed athletic)                        # VOL-14
  load = % only for barbell main lifts and Olympic lifts when a recent best exists; RIR words otherwise  # PER-09; PROPOSED

  # 6 WEEK TO WEEK -------------------------------------------------------------------------------
  for week k:
      if deload_due(k): emit deload(current, 0.5); continue                                # PER-05 (triggers PROPOSED)
      step = step0 if F43 == 'plan_only' else checkin_step(checkin[k-1])                   # 13 step table inside 12's gates
      step = min(step, phase_cap(shape, k), coach_cap, 0.07)                               # acclimation <= 3 %, 8-wk wks 1-4 <= 5 %
      for m: bank, then place_set(m) in VOL-07 order until total rise < 10 %                # VOL-06, VOL-07, UNI-05
      apply HOW IT FELT: pain swap/cut/drop; wrong muscle -> one variable; couldn't -> one level down   # GEN-05, VOL-03
      if block boundary: change 1-2 small variables per slot; level-up slots logged '8' or easier, no pain; rebalance share  # PER-02, PER-06
      athletic: method stage and plyo share advance; contacts/throws by week                  # CAT-10/11

  # 7 TESTS, AUDIT, RENDER -----------------------------------------------------------------------
  tests: ticked items in the last week of the block + reminders                            # PER-07
  audit: validation_checks (13.6); every number stamped with model_version; every pick has 'why' keys
  render: codes only -> word lists (EN/ES) -> phone view / day image / PDF / sheet          # GEN-01; 13 §7
```

### 13.4 Coach-added rules (GEN-08; mechanism PROPOSED, 13 §7.2)

| Layer | Owner | Changeable? | Contents |
|---|---|---|---|
| 1 Locked | the coach | no (only in a fork, which is then not Blaze Camp) | never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped (GEN-08); no bands or variable resistance (EQ-01, EQ-12); athletic sets never count as muscle sets (VOL-10); weekly increase < 10 % (UNI-05); older/injured never-list (EQ-03); no sex-based rules (ATH-09) |
| 2 Blaze defaults | the coach | yes, by a coach rule pack | starting sets (VOL-01), helper credit 0.25 (VOL-09), spine once a week (PER-04), calves 3 sets per leg day (VOL-17), session lengths (UNI-09), bilateral shares, plyo shares, every PROPOSED number |
| 3 Coach rule pack | the coach using the tool | yes | e.g. "youth under 15: no Olympic lifts from the floor" (a pack may be stricter than the Blaze default, which allows some floor lifts for youth, ATH-09); "tennis: lower body 85 % unilateral"; "hip thrust machine first on glute days"; "never Bulgarian split squats for client X" |
| 4 Client preferences | the client | yes, inside the layers above | dropdown swaps (EQ-10), core position (ATH-11), variety (PER-03), optional days (ORD-10) |

**Rule format** (`rulepack/1`): `{"id", "when": {"all"|"any": [{"fact", "op", "value"}]}, "then": {"action", ...}, "note_key"}`. Facts: intake fields, derived values, `week.n`, `week.phase`, `day.type`, `slot.category`, `exercise.tags`. Ops: eq, ne, lt, lte, gt, gte, in, not_in, contains. **Closed action list**: exclude_exercise, exclude_tag, exclude_equipment, prefer_exercise_in_slot, set_unilateral_share, set_muscle_weekly_range, cap_weekly_step, fix_weekly_step, add_slot, remove_slot, move_block, set_rest, set_rep_range, add_note. Precedence: locked > coach pack > Blaze defaults > client preference; inside one layer the more specific `when` wins, then the later rule, and the UI flags the conflict. Before saving, the coach previews the effect on 3 sample clients. Coach-added exercises must carry every CAT-01 tag and their own video link.

### 13.5 Adaptation from check-ins (GEN-05 with the GEN-03 tension; PROPOSED)

**Resolution** (13 §2): separate **tracking** (writing down every set; optional, anywhere: notebook, notes app, the sheet) from **checking in** (one short screen a week). The plan works without either; the check-in is what lets the tool choose 3, 5 or 7 % by the person's state (VOL-05).

| Level | What the user does | What the tool does | Phase |
|---|---|---|---|
| 0 Just the plan | follows it; tracks in a notebook or not at all | the planned rise from the before-logs step (§5.4d) and the plan shape; nothing to read | MVP |
| 1 Weekly check-in (no account, ~1 min) | sessions done; effort per session (his EFFORT menu); how it felt (default 'Felt the RIGHT muscles', tap an exercise to change); anything hurting (area, better/same/worse); how life was (better / normal / harder / much harder); optional best set or test result | the step table (§5.4b) inside the gates (§5.4a); pain, wrong-muscle and couldn't-do-it rules; early deload; writes next week | v1.1 (required for week-by-week) |
| 2 Full logbook | his columns per exercise: 'WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?' | as level 1 per exercise, plus weight history; the R score (§5.4f) | v1.1 phone / MVP in the downloaded sheet (no adaptation) |
| 3 Coach-connected (account) | as 1 or 2, visible to their coach | coach sees check-ins, gets a flag when 'Felt a PAIN' repeats, edits the plan | v2 |

What the user reads after a check-in: "Next week: +1 set on Back Squat (Monday, first exercise). Leg Press stays at 2 sets. Your shoulder: Barbell Bench Press is swapped for Machine Chest Press this week." (VOL-06: no percentages shown). Pain two weeks running or "worse" → the plan keeps going around it and says to see a professional (or the coach, if connected) (INFERRED safety). SCIENCE: simple self-reports track training load well (Saw 2016; Foster 2001); autoregulation is at least as good as fixed plans (Graham & Cleather 2021; Zhang 2021; Hickmott 2022); comparable products (RP Hypertrophy app, JuggernautAI, Volt, Fitbod) adapt from similar inputs (RESEARCH).

### 13.6 Validation checks before a plan is shown (v1)

| Check | Rule | Source |
|---|---|---|
| V1 safety | any F01 yes (incl. an injury under treatment) or F36 severe pain → refer, no plan (the v0 field F37 no longer exists; its "diagnosed / in rehab" case is F01 `injury_in_treatment`) | PROPOSED |
| V2 days | fewer weekdays than training days → ask | v0 |
| V3 short athletes | athlete with 30 min → warning (athletic prefix needs time) | v0 |
| V4 youth | under 18: L1-L2 exercise levels by default, floor Olympic lifts only per program (ATH-09), lighter medballs, no research data | ATH-09; PROPOSED |
| V5 older | 60+ (PROPOSED): constraint 4-5 bias, never OH squat / snatch / low-bar / depth jumps, few plyos unless asked, step ≤ 3 %, maintenance ≥ 70 % | EQ-03, ATH-09 |
| V6 season | plan longer than the weeks to the season → run to the season date, taper, switch to in-season | PER-08; PROPOSED |
| V7 no equipment + muscle goal | warn about vertical pull, biceps, throws; show the buy list | 10 |
| V8 priorities | > 2 priority muscles → keep 2 | VOL-02 |
| V9 bands | no exercise, swap or kit token uses a band, chain or releaser | EQ-01, EQ-12 |
| V10 axial | ≤ 1 axial squat + ≤ 1 axial hinge per week | PER-04 |
| V11 pairing | every mixed session: hip + push, knee + pull | UNI-11, ORD-06 |
| V12 order | warm-up → core (unless moved) → athletic → Olympic → strength; row before pulldown; the work first | ATH-11, ORD-01..03 |
| V13 caps | resistance ≤ 7 (8-9 at 75-90 min); athletes ≤ 12 + core; minutes ≤ F24 (or superset) | VOL-08, UNI-09 |
| V14 counting | athletic work credits no muscle; helpers 0.25; 10/10 = 1 set | VOL-09, VOL-10, UNI-01 |
| V15 step | no week raises the person's total resistance sets by 10 % or more | UNI-05 |
| V16 aesthetics | no medball in the main workout | ATH-05 |
| V17 effort | no MAX on heavy compounds; MYO only last on machine/isolation | GEN-08, VOL-13, VOL-15 |
| V18 calves / rear delts / core | calves 3 sets each leg day; a rear-delt station each week; ~2 core exercises each session | VOL-17 |
| V19 Olympic | every athletic week has an Olympic-lift variant matched to level | ATH-10 |
| V20 V-squat | never | GEN-08 |

### 13.7 What is the coach's and what is ours

| Component | Status |
|---|---|
| Taxonomy and lenses, big/small lists, LEG FLEXION, core rule, levels by load position, Davidson zones as rotation biases, starting volumes, priority range, pain rule, person-based 3/5/7 %, bank-and-release, VOL-07 placement, 0.25 helpers, dips/thrusters, 10/10, athletic never counts, bilateral:unilateral logic and anchors, contra/ipsi meaning and use, pairing, axial once a week, core first, ordering, supersets as a fatigue tool, session sizes and lengths, plan shapes, deload half, tests by checkbox, seasons, ground-contact rule, Olympic for all athletes, medball rules, aerobic counts, no bands, machines not ranked, older/injured rules, no sex rules, intake changes, default + dropdown, coach rules | **coach** (COACH-ANSWER) |
| Small-muscle starts, caps, per-level priority split, glute credit values, readiness score and step table, EFFORT-vs-target reading, before-logs step, acclimation and 8-week caps, deload placement, cycle step, maintenance split, time model, share numbers he did not give, plyo class map and stage weeks, contact/throw/Olympic targets, season multipliers, older/youth thresholds, output modes, product, licences, Spanish strings | **ours** (PROPOSED), each a configurable table entry pending round 2 |

---

## 14. Product and output (summary of `13_product_options.md`; all PROPOSED)

| Topic | Recommendation |
|---|---|
| **What to build** | **Option B, built in phases from Option A**: a bilingual plan **website** (not an app) that builds the plan on the person's phone, shows a clean day view, and exports "save this day as an image" (his screenshot idea), a printable PDF (one week per page), and a Google Sheets / Excel file with his BYOP columns ('WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?'); then the optional weekly check-in; **open source (Option D) once he approves v1**. |
| Why | the only option that honours both GEN-03 (no forced tracking) and GEN-05 (adjust from effort); the only way to choose 3/5/7 % by the person's state (VOL-05); the only path to the learning he wants (VOL-01); phone-first without an app; Spanish throughout; almost free to run. |
| Tracking levels | 0 plan only (MVP) → 1 one-minute check-in, no account (v1.1) → 2 full logbook (v1.1) → 3 coach-connected accounts (v2). |
| Data | stays on the phone (IndexedDB) with a backup code; share links never carry age, weight or pain; iPhone users "Add to Home Screen" (Safari deletes site data after 7 days of non-use; home-screen apps exempt, RESEARCH). |
| Spanish | every word from EN/ES word lists; neutral Latin American Spanish with the English gym term in brackets where gyms use it ("Empuje de cadera (Hip Thrust)"); AI draft + approval by him or a coach he trusts; missing lines fall back to English and are listed. |
| Coach rules | four layers (§13.4); rule packs as files in the MVP, accounts in v2. |
| Videos | silent 10-30 s clips (work in both languages); film the **85 exercises he uses that have no video** first (one 3-4 h session); approved public videos meanwhile; privacy-enhanced YouTube embeds. |
| Learning data | nothing by default; opt-in, anonymous, adults (18+) only, from v2, after a lawyer's review (GDPR Art. 9 health data, Washington MHMDA, FTC HBNR, COPPA; RESEARCH). |
| Licences (default) | engine **Apache-2.0**; model data **CC BY 4.0**; his videos and cues **all rights reserved**; the Blaze Camp name protected (trademark note). Share-alike alternative: AGPL-3.0 + CC BY-SA 4.0. Raw sheet dumps never published. |
| Stack | static TypeScript single-page web app (PWA) on Cloudflare Pages; IndexedDB; i18n word lists; print CSS; DOM-to-PNG; ExcelJS (spike: dropdowns surviving Google import); Sheets API (drive.file) and Supabase only in v2. Engine: pure, deterministic `generate / adapt / explain / validate`; plans stamped with `model_version`. |
| Roadmap and effort (INFERRED, one full-time developer) | Phase 0 freeze model v1 + 5 graded sample plans (2-3 weeks; ~5 h of his time) → Phase 1 MVP Option A (10-14 dev-weeks) → Phase 1.1 check-in, logbook, week-by-week, offline (+3.5-5) → Phase 2 accounts, coach mode, Drive export, consented data, open-source release (8-12 + legal) → Phase 3 learning with every change approved by him. Running cost ~$10-20/year until v2. |
| Risks | engine misreads his style (golden plans as tests; "why" on every pick); injury (safety screen, pain rules, machine bias, disclaimer); check-ins ignored (plan works without); iPhone data loss (home screen, backup code); Spanish quality; missing videos; health-data law; copies of the open model (trademark, publish after approval). |
| Decisions for him | N-PROD-01 … N-PROD-12 (13 §11), folded into round 2 (R2-GEN). |

---

## 15. Science lineage (short; `07_science_lineage.md`, 12 §2, 06 §12, 10b)

| Layer | Source | How it shows | Verdict |
|---|---|---|---|
| Library architecture | **Dr. Pat Davidson, Rethinking the Big Patterns** (13 patterns in Control / Athletic / Resistance; stance × plane × load × velocity) | LIB row 4 'CONTROL' / 'ATHLETIC' / 'RESISTANCE'; 11 of 13 RTBP patterns map onto BYOP columns | FAITHFUL (strongest lineage) |
| Levels / zones | **Davidson, A Coach's Guide to Optimizing Movement** (named by the coach) | zones as rotation biases (CAT-04, CAT-10) | ADAPTED; his wording not found publicly; consistent with the PRI/Hartman/Davidson expansion-compression model |
| Into / out of the hip | PRI / Bill Hartman / Davidson school | contra into the hip, ipsi out (CAT-13); Stastny 2015 EMG | ADAPTED |
| Dose | **Dr. Mike Israetel / RP** (MEV/MAV/MRV, 5-30 reps, RIR, SFR, set increases) | 15-20 sets, small muscles more reps, RIR, leg-press "local fatigue" | ADAPTED (person-based 3/5/7 % and VOL-07 placement are his own) |
| Volume research | Schoenfeld 2017, 2019; Baz-Valle 2022; Barbalho 2020; Aube 2022; **Pelland et al. 2026** (67 studies; fractional 0.5 count fits best; efficiency tiers); Remmert (per-session ~11); Enes 2023/24; Scarpelli 2022; Barsuhn 2024 | his starts and caps match (§5.8) | supports his numbers |
| Maintenance / deload | Spiering 2021; Bickel 2011; Bell 2023 Delphi; Rogerson 2024; Coleman 2024 | 50-70 % maintenance; deload ≈ half | supports |
| Unilateral vs bilateral | Liao 2022 (14 studies) | bilateral → bilateral strength; unilateral → single-leg jumps | supports his split |
| Athletic layer | Verkhoshansky (plyometrics), Cometti → Dietz (French contrast), Zatsiorsky → Westside (ME/DE), NSCA plyo guidance, Mach drills, Sheppard & Young (COD vs agility); fast vs slow SSC ~250 ms (Schmidtbleicher; Flanagan & Comyns 2008) | ground-contact rule (ATH-01), force phases, contrast at 78-85 % | ADAPTED / FAITHFUL |
| Older adults | Borde 2015; NSCA (Fragala 2019) | machines, few plyos | supports EQ-03, ATH-09 |
| Periodization | Grgic 2017, Harries 2015, Williams 2017, Moesgaard 2022, Damas 2016, Issurin 2010, Kiely 2012 | 12-week shape, VOL 1/2/3 blocks | supports; the shapes' value is a gradual ramp, a hard finish and built-in recovery |
| Borrowed wholesale | Chris Hinshaw half-marathon plan; Westside structure in the strength track | | BORROWED / ECHO |
| Not used | 5/3/1, Texas Method, Prilepin (his Olympic and 90 % weeks exceed Prilepin in places) | | not his lineage (COACH-CHAT) |

Scorecard (07 §14, unchanged by v1): FAITHFUL 38 %, ADAPTED 43 %, OWN 20 %, CONFLICT 7 % of 138 concepts; all conflicts are loading parameters, not the taxonomy. **His own contributions** (keep as editable rules): the lunge triad, four force phases in his order, two jumping tracks, COD graded by turn severity, the squat ladder by upright posture, knee + pull / hip + push pairing, the Blue/Green/Orange aerobic system, the work / accessory / nuance / survival, the quality × month × level grid, pain = substitute first, the EFFORT scale with 8 as the bullseye, the receive → create plyo method, ground-contact-based plyo:ballistic, person-based 3/5/7 %, first-exercise-first set addition. **Remaining tensions**: in-season he keeps volume and drops intensity in the baseball sheet vs maintenance research (keep intensity, cut volume) - now resolved by PER-08/UNI-10 (low volume, 2 days); Olympic 4 × 8 @ 75 % (flagged); French contrast "immediately" vs PAPE rest (kept as written); no taper after the boxer's week-8 peak (taper added when a date is set); 1:1:1 aerobic colours are not polarised endurance training (fine for team and strength clients).

---

## 16. Still-open items

### 16.1 Unanswered, skipped, not understood

| ID | Item | What v1 does meanwhile |
|---|---|---|
| LIB-10 | 'KB Face Pulls' under VERTICAL PULL: move to rear delts? | swap only, never the default vertical pull; rear-delt credit INFERRED |
| LIB-12 | 'Bench Push ups': hands or feet on the bench? | v0 reading: hands on bench FOUNDATIONAL (AD13), feet on bench ADVANCED (AF11) |
| PRG-01 (skip) | What 'NO ACCESS' means on the two hidden tabs | generic names on hold; never infer equipment from them |
| FIX-01 (skip) | NO ACCESS - AESTHETICS Tuesday 'Unilateral HD' dropdown points to LEG CURLS | treated as a miswire (INFERRED); generator wires Unilateral HD to the single-leg hinge list |
| CAT-12 (not understood) | May the tool make a variant by changing one detail of a library exercise? | named library exercises first; one-detail variants only between blocks (PROPOSED) |

### 16.2 Tensions inside his answers

| Tension | v1 default | Round 2 |
|---|---|---|
| GEN-03 "track themselves" vs GEN-05 "adjust from logs" (RIGHT) | static plan by default + optional check-in (§13.5) | yes |
| PER-01 quarter wording ("second half of the year, the second quarter"; Q1 and Q2 both fat loss?) | Q2 = Apr-Jun; Q1 cut at the level start; Q2 cut + a little muscle (§11.5) | yes |
| CAT-04 / CAT-10: zones 1 and 3 are both external-rotation (vertical) positions; deep squat zone; overhead "advanced" but supported overhead is FOUNDATIONAL in BYOP | zone = tag; level = load position + skill + stability − support (§3.2) | yes |
| LIB-18 '21.6 mile run' = "a marathon" (a marathon is 26.2 mi) | not offered | yes |
| VOL-08 "max maybe 12" vs VOL-17 "12 to 14" | 12 excluding the 2 core exercises | yes |
| VOL-07 "3-4 exercises per muscle per day" vs VOL-08/16 "5-7 exercises per session" on full-body days | 1-2 per muscle on full-body days, 3-4 on split days | yes |
| LIB-14 thrusters 0.5 shoulders vs VOL-09 helpers 0.25 | 0.5 (specific answer wins) | folded into the counting question |
| LIB-20 (RIGHT, listed strap rotations) vs LIB-09 (remove strap rotating in/out) | removed (LIB-09 is explicit) | no |
| ATH-10 everyone gets Olympic lifts vs his baseball in-season block with none | light 2×3 piece once a week in season | yes |
| UNI-10 minimal bilateral in season vs his baseball in-season ~55/45 | UNI-10 wins (answer over sheet): 20/80 | no |
| ATH-07 aesthetics 4 sessions vs the cheat sheet "3 a week, never the same colour twice" | 4th = a second easy Orange (or the walks) | yes |
| EFFORT menu ('9 - That was terrible') vs "leave 1 in the tank" (= RPE 9) | rate EFFORT against the target | yes |
| PER-05 "half the sets" vs his written deloads at 0.75-1.0 × week 1 | half of the current week | yes |
| PER-04 "load it once per week" + "probably ... with the deadlifts as well" | one axial squat + one axial hinge, different days | yes |

### 16.3 PROPOSED register (where each lives)

Volume (§5.10; 12 §7): small-muscle starts, rear delts, glute credit, L3 definition, step table / R score, EFFORT reading, before-logs step, acclimation/8-week caps, no fixed deload, cycles, maintenance split, non-priority 3 %, per-session ceilings, core block counting, time model, A-day alternation, bonus placement, V-taper, heavy unilateral parameters. Bilateral (§6): shares for profiles he did not name, contra/ipsi percentages, frontal/transverse share, pain shift, slot conversion. Levels (§3): L3, zone use. Library (§4.6): new rows, carries/drags, home-gap fixes. Variables (§7.9): Olympic rep cap, French contrast 4th member. Equipment (§8.6): non-library replacements, preference question, hack/pendulum constraint. Athletes (§9.10): class map, stage weeks and name, contact/throw/Olympic targets, aerobic off-season, season multipliers, thresholds, in-season Olympic. Sessions (§10.9): core dose, cap counting, axial details, same-pattern athletes, calves for athletes. Plans (§11.8): splits, yearly structure, pre-season, deload placement. Tests (§12.3). Generator (§13): safety screen, recovery questions, output modes, rule-pack format, validation thresholds. Product (§14): everything.

### 16.4 Integration to-do for the file owners (found while assembling v1)

| File | Fix needed | Basis |
|---|---|---|
| `12_volume_algorithm_v1` | hand-set step 0-7 % (not 0-10 %); athletic-template default sets 2; drop "RIR toward 1" as a rule; Olympic full scope from L2 (not L3); exercises by session length (45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); priority split +4/+5/+6 in both §3.3 and §3.5; plyo share table superseded by 04's class map; plyo stage weeks by plan length; "full Snatch" → "Squat Snatch" | §0.3; 03 conflicts 1-6 |
| `01_taxonomy.json`, `12_volume_algorithm_v1` | hinge glute credit 0.5 → **0.25** (the adopted default since the coverage audit; 02 already uses 0.25); keep 0.5 only as the round-2 switch; re-run 12's worked examples (glutes get more direct hip-thrust/bridge sets to reach target) | §0.3; COACH-ANSWER VOL-09, UNI-01 |
| `04_profiles.json`, `12_volume_algorithm_v1` | bodybuilder/powerlifter **upper-body** share: start about 50/50 in weeks 1-4, then 80/20-90/10 (same logic as the lower body, UNI-03), not 80-90 % bilateral from week 1 | §6.2; COACH-ANSWER UNI-02, UNI-03 |
| `05_templates.json` | `taxonomy_id_01` still cites `RP.HD.ISO` (resolve as retired alias → `RP.LF`) | 01 `_meta.retired_ids` |
| `10_equipment_model.json` | bucket code `ISO_LEG_FLEXION` is crosswalked to `RP.LF`; zone tags in 02 were not rebuilt from 10 v1 | 01 digest; 02 verifier |
| `09_generator_inputs.md`, `generator_spec_v0.json` | v0 ids (`athlete_generic`, `HOME_DB_BENCH_BANDS`, `BANDS_ONLY`, `BOOTCAMP_OUTDOOR`, `TRACK_FIELD`), the F04 sex field and v0 training-age buckets: superseded by `generator_spec_v1.json` | GEN-02, EQ-01, ATH-13 |
| `synthesis/_build_04` | render scripts unpatched (re-running `render.py` would undo both v1 verification passes; rounding bug in `build_profiles.derive()`) | 04 verifier |
| `synthesis/_build_10` | build scripts lack the v1 verification fixes; re-run `patch_10_v1_verify.py` after any rebuild | 10 verifier |
| `01_taxonomy.json` | credit keys are lower case while muscle ids are upper case (engineer must map) | 01 verifier |
| `03_volume_dosing.md` §9.11 | uses 12's per-sport plyo share; align to 04's class map | §0.3 |

### 16.5 Round 2

`round2_questions.json` holds the next questions (6 sections, 45 questions, ids `R2-…`), each with a concrete proposal he can accept or correct by voice in under a minute. It covers the unanswered and skipped items, CAT-12 re-asked in plain words, every PROPOSED decision that changes engine behaviour or the product, and the tensions above.

---

## Appendix A. His labels (verbatim) → canonical names (v1)

| Verbatim (his spelling) | Canonical | Basis |
|---|---|---|
| 'TRIPPLE EXTENSION' | triple extension | FIX-04 |
| 'SAGITAL' | sagittal | FIX-04 |
| 'INTERMIDIATE' / 'MODERATE' | intermediate (exercise level L2) | FIX-04 |
| 'BILATERAL HIP DOMNANT' | bilateral hip dominant | FIX-04 |
| 'ABdution' | side-delt (abduction) slot; rear delts tracked apart | VOL-17 |
| 'NOVICE', 'NEWBY' | Level 1 (the same thing) | PRG-05 |
| 'INTERMEDIATE' (client) | Level 2 | PRG-05 |
| 'STARTING / MID / ADVANCED OFF SEASON' | blocks or athlete levels, as needed | PRG-04 |
| 'JUSTICE LEAGUE' | Athletic Performance - Non-Competitive (weekend athletes, adults and youth); profile `weekend_warrior` | ATH-13, FIX-03 |
| 'LEFT TEST' | L-test / L-drill (3-cone) | LIB-01 |
| '5/10/05' (stored as a date) | 5-10-5 pro-agility shuttle | LIB-01 |
| 'Snatch', 'Clean', 'Clean & Jerk' | Squat Snatch, Squat Clean, Squat Clean & Jerk | LIB-07 |
| 'Pull under' | lat pull-over (cable) | LIB-09 |
| 'Kong Row' / 'con row' | double-KB row from the floor (pain-friendly, low stimulus) | LIB-09 |
| 'Single Leg Get Ups' | box pistol (single-leg sit-to-stand) | LIB-09 |
| 'Low DB Squats' | DB squat with the DBs hanging at the sides | LIB-09 |
| 'Alternating DB/Barbell Deadlifts' | alternating staggered-stance single-leg deadlift | LIB-09 |
| 'Camporini Deadlifts', 'strap rotating in/out' | removed | LIB-09 |
| 'LEG CURLS' / 'LEG FLEXION' (Sheet25 H11) | LEG FLEXION (`RP.LF`, knee flexion) | CAT-09 |
| 'ZONE 1/2/3' (cable curls, triceps) | Davidson zone (rotation bias) | CAT-10 |
| 'ZONE 1/2/3' (Sheet23 plyos: 'Receive pause/creat' … 'Repeat receive create') | plyo method stages (not zones; name pending) | CAT-10, CAT-11 |
| 'GET INTO THE HIP' / 'GET OUT OF THE HIP' | contralateral / ipsilateral load | CAT-13 |
| '12/10/8 -20' | pyramid 12 (mid) / 10 (heavier) / 8 (heaviest), then a light 20 | PRG-07 |
| '10/10' | 10 per side (one set) | PRG-07, UNI-01 |
| 'VOL 1' / 'VOL 2' / 'VOL 3' | athlete rep phases, one per block | PER-11 |
| 'the work' / 'the accessory' / 'the nuance' / 'the survival' | strength roles 1-4 | ORD-07 |
| 'MYO SET' | 15 + 5 × 5 with short pauses; last exercise, machine or isolation; counts as 2 sets | VOL-15; INFERRED count |
| 'WEIGHT USED or SCORE' | load, or times / rounds / distances for conditioning | PRG-08 |
| '21.6 mile run' | his "marathon" (flag: a marathon is 26.2 mi); not offered | LIB-18 |
| 'FULL TIME' / 'HALF TIME' (CrossFit) | competitor / class member | PRG-10 |
| 'Buy out' | conditioning finisher (CA.BUY) | OBSERVED |
| 'LACTATE CLERANCE', 'BEGGINER', 'RECCOMENDED', 'Coppenhaggen', 'Harmstring', 'Glidder', 'Sqats', 'presercibe', 'INTENSIONALLY' | lactate clearance, beginner, recommended, Copenhagen, hamstring, glider/slider, squats, prescribe, intentionally | FIX-04 |

---

## Appendix B. How this file was built and checked

- **Read in full first**: `coach_answers_full.md` (all 140 entries) and `coach_answers.md`. Verdict chips counted with the team venv (84 RIGHT, 18 PARTLY, 4 NOT RIGHT, 30 text-only, 2 SKIP, 2 unanswered).
- **Read for v1**: the v1 sections, changelogs, pending lists and generator-facing rules of 01, 02, 03, 04, 05, 06, 07, 10, 10b and 11; 12 and 13 in full; the v0 master (archived unchanged as `BLAZE_CAMP_BRAIN_v0.md`, md5 identical to the pre-v1 file); `generator_spec_v0.json`; `08_open_questions_for_coach.md` (P1 questions, to drop the answered ones).
- **Recomputed** with the team venv (`scratchpad/brain_v1/checks.py`): the VOL-07 placement sequence (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 → 4/4/3); the 12-week reference curves for L1/L2/L3 (identical to 06 §7.1); the plyo start → end shares from the class map; the R-score cases; 20 → 22 = +10 %.
- **Cross-file conflicts** resolved in §0.3 and mirrored in `generator_spec_v1.json > _meta.integration_decisions`; fixes owed by other files listed in §16.4.
- **Retired ideas** (size-based 3/5/7 %, helper 0.5, bands/chains/releasers, plyo zones as an exercise property, core after the power block by default, sex-based rules, 'Justice League' as a program name, hack squat ranked last, 6 weeks = 5 + deload, NOVICE below NEWBY, L4) appear in this file only as retired entries, v0 history or verbatim cell quotes.
- **Not done here**: no Google Sheet was opened or changed; no synthesis file outside this file, `generator_spec_v1.json` and `round2_questions.json` was edited.
- **Coverage audit (2026-10-08)**: every one of the 138 answered questions was traced to a section here and a key in `generator_spec_v1.json`; the table and every fix are in `coverage_matrix.md`. Fixes made in this file: hinge glute credit 0.5 → 0.25 (§0.3, §2.4, §5.2, §5.10, §16.4); bodybuilder/powerlifter upper-body share follows the lower-body logic (§6.2); an L1 priority cap (§5.3); FIX-02 cardio menus (§4.2, §9.7); the V1 safety check no longer cites the removed F37 (§13.6); the P6 cross-reference (§11.1); the L1 acclimation length tagged PROPOSED (§3.3); 'Justice League' kept only as a sheet-tab quote (§10.4, §10.5); the youth example rule marked as stricter than the Blaze default (§13.4); push press offered from L1 in the Olympic/power slot (§9.5, LIB-13). The spec gained `rule_tables.taxonomy`, `rule_tables.library_decisions`, `rule_tables.strength_template`, `rule_tables.warmup`, `rule_tables.core_block` and smaller keys listed in the matrix.
