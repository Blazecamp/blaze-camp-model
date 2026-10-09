# BLAZE CAMP BRAIN v1.1: the coach's confirmed system

**What this is.** The master document of the Blaze Camp model: how the coach (Blaze Camp, IG @BLAZECAMP) classifies, doses, orders and periodizes training, written so that (1) the coach can check every rule against what he believes and (2) an engineer can build the plan generator (people enter basic info and get a 12-week, 8-week, maintenance, week-by-week or yearly plan in his style). The machine-readable twin is `generator_spec_v1.json` (version 1.1.0). The next questions for the coach are in `round3_questions.json`.

**Version.** v1.1, 2026-10-08. Built on the coach's round-2 answers (`coach_answers_round2.md`: 45 round-2 questions plus the two round-1 leftovers LIB-10 and LIB-12) and his request of the same day to cover every popular US sport (swimming included) and a "stay athletic and active" path for the general population (pickleball, HYROX). **Authority order: round-2 answers > round-1 answers (`coach_answers_full.md`) > his chat statements > everything else** (sheets, science, team decisions). The v1 master is archived unchanged as `BLAZE_CAMP_BRAIN_v1.md` (and v0 as `BLAZE_CAMP_BRAIN_v0.md`). This version was assembled from the v1.1 synthesis files 01, 02, 03, 04, 05, 06, 11, 12 and 13 and checked against `coach_answers_round2.md`, read in full. No Google Sheet was opened for writing. Every round-2 answer is traced to a section here and a key in the spec in `coverage_matrix_round2.md`.

**Start here.** Section **0b** lists what round 2 changed and the resolutions the coach should see. Sections 1-16 carry the rules in place; superseded v1 rules are marked "retired" with the round-2 ID that retired them.

**How each section reads.** Confirmed rules first (with the question ID that set them), then the supporting evidence, then anything PROPOSED or pending. Numbers that the coach did not give are always marked.

### Evidence labels

| Label | Meaning | Weight |
|---|---|---|
| **COACH-R2 <ID>** | The coach's round-2 answer (`coach_answers_round2.md`), e.g. COACH-R2 R2-VOL-06. LIB-10 and LIB-12 are the round-1 leftovers answered there. A RIGHT chip with no text makes our proposal his rule; RIGHT with words, PARTLY and NOT RIGHT mean his words define the rule. | **Highest.** |
| **COACH-ANSWER <ID>** | The coach's round-1 questionnaire answer (`coach_answers_full.md`), e.g. COACH-ANSWER VOL-07. | Authoritative unless round 2 changed it. |
| **COACH-CHAT** | His statements relayed in chat (`coach_answers.md`; **COACH-CHAT 2026-10-08** = his request for every popular US sport, swimming, pickleball and HYROX, quoted in §9.10; 06 v1.1 calls it "COACH-R2 REQ"). | Authoritative in meaning; an answer wins where they differ. |
| **APPROVED** | A PROPOSED item he marked RIGHT in round 2 (always shown with its COACH-R2 ID). | His rule. |
| **OBSERVED** | Read from a sheet cell, tab, colour or dropdown; labels quoted verbatim with his spelling ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT'). | Evidence of how he has written programs. |
| **SCIENCE** | Published research or a named practitioner source (references in 07, 10b, 12, 13, 04). | Fills gaps and checks his numbers; never overrules an answer. |
| **RESEARCH** | Product, price, platform or legal facts from public pages (13, accessed 2026-10-08). | Re-check before acting. |
| **INFERRED** | The team's reasoning from the sheets or answers. | A default until he confirms. |
| **PROPOSED** | Short for **PROPOSED - PENDING COACH APPROVAL**: our design where he asked us to propose or left a gap. | Ships only after his yes. |
| **LEGAL REVIEW** | Health-check, release and disclaimer wording that must go to a lawyer before it ships (13 §12). | Placeholder only. |
| **DORMANT** | Kept as an archive of sheet content, never used by the generator (variable resistance, EQ-01 / EQ-12). | None. |

**Cell shorthand.** BYOP = 'BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL' workbook; MM = 'BLAZE CAMP MASTER MODEL'; LIB = BYOP 'MASTER EXERCISE LIBRARY'; SQ = MM 'ALL ABOUT SQUATS'; 4T = MM '(NOT DONE) 4 TRACKS PROGRAMMING'; AE = 'AEROBIC CAPACITY CHEAT SHEET'; S23 = 'Sheet23'; JL = the BYOP tab 'JUSTICE LEAGUE' (a tab name only: the program is "Athletic Performance - Non-Competitive", COACH-ANSWER ATH-13, FIX-03).

### Where the full version of each section lives

| Section here | Full version (in `synthesis/` unless noted) |
|---|---|
| 1 Philosophy | `coach_answers_round2.md`, `coach_answers_full.md`, `coach_answers.md`; 01 §0; 07 §0 |
| 2 Segmentation | `01_taxonomy.md` / `.json` v1.1 (91 nodes, 47 facets, 255 values) |
| 3 Levels | 01 §1-2 (F.DZONE, F.LOADPOS); `10_equipment_model.md` §1.4; `11_training_variables.md` v1.1 §1.2; 12 §3.2 |
| 4 Library | `02_exercise_catalog.md` / `.json` v1.1 (939 records, 732 active), `02_no_equipment_subset.md` v1.1 |
| 5 Volume engine | `12_volume_algorithm_v1.md` / `.json` (content v1.1: stairway, check-in, floor 10, research on 20-30 sets, worked examples); `03_volume_dosing.md` / `03_volume_rules.json` v1.1 |
| 6 Bilateral vs unilateral | 12 §3.11; 11 §3.7; 04 v1.1 `bilateral_unilateral_model`; 05 §4.5 |
| 7 Training variables | `11_training_variables.md` / `.json` v1.1; `10b_equipment_variables_science.md` |
| 8 Equipment | `10_equipment_model.md` / `.json` (v1; round 2 applied here and in 02); 10b |
| 9 Athletes and "stay athletic and active" | `04_athlete_profiles.md` / `04_profiles.json` v1.1 (127 profiles: 93 competitive, 31 recreational, 3 goal; 81 variants; 52 picker sports; 26 activities) |
| 10 Sessions and weeks | `05_session_architecture.md` / `05_templates.json` v1.1 (30 split templates rebuilt for R2-SES-05) |
| 11-12 Plans, tests | `06_periodization.md` / `.json` v1.1 |
| 13 Generator | this file §13 + `generator_spec_v1.json` 1.1.0 |
| 14 Product | `13_product_options.md` v1.1 |
| 15 Science | `07_science_lineage.md`; 10b; 12 §2 (incl. §2.11 on "20-30 sets") and §8; 06 §12; 04 references |
| 16 Open items | this file §16; `round3_questions.json`; `coverage_matrix_round2.md` |

---

## 0. What changed since v0 (short; v1 history - the v1.1 changes are in §0b)

### 0.1 The answers in numbers

140 questions: **84 RIGHT**, **18 PARTLY** (UNI-08, UNI-09, VOL-02, VOL-17, ATH-07, ATH-09, ATH-13, ORD-05, ORD-10, EQ-10, LIB-02, LIB-07, LIB-13, LIB-16, PRG-02, PRG-03, PRG-04, PRG-06), **4 NOT RIGHT** (PER-01 plan shapes, ATH-11 core placement, EQ-11 machine ranking, EQ-12 variable resistance), **30 answered in words without a chip**, **2 skipped** (PRG-01, FIX-01), **2 unanswered** (LIB-10, LIB-12; both answered in round 2). Counted with the team venv from `coach_answers_full.md`.

### 0.2 The 24 changes that moved the generator most in v1 († = changed again by round 2, see §0b)

| # | v0 (team inference) | v1 (coach's rule) | ID |
|---|---|---|---|
| 1 † | Weekly 3 / 5 / 7 % picked by muscle size | One 3, 5 or 7 % step per **person** per week; coach can set it; 10 %/week is "way too much" (**v1.1: the stairway**, §5.4) | VOL-05, UNI-05, VOL-04 |
| 2 | 15-20 sets read as the peak week; start back-solved | **Starting** sets: beginner 10-12, intermediate 15-20, advanced 20+; 15-20 = maintenance to some growth, 20-25 = growth | VOL-01, UNI-01 |
| 3 † | Helpers 0.5; glutes 1.0 from every hinge and lunge | Helpers **0.25**; dips 0.5 / 0.5; athletic work never counts (**v1.1: KB swings count 0; thruster 1 / 0.5 / 0.25**) | VOL-09, LIB-16, VOL-10 |
| 4 | Release 1-2 sets at a time, round-robin | Bank the fraction, add **one** whole set, to the **first exercise of the day first** (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3) | VOL-06, VOL-07 |
| 5 † | Max 2 exercises per muscle per session | **3-4 exercises per muscle group per day**; bonus exercise for small muscles (**v1.1: full-body days 2-4, never 1**) | VOL-07 |
| 6 | Bilateral share 35-70 % by goal | A **90/10 ↔ 10/90 slider** by athlete, phase and pain | UNI-02, UNI-03, UNI-10 |
| 7 | Contralateral loading as the default | Contralateral pulls you **into** the hip; ipsilateral helps you **out** of it | CAT-13 |
| 8 | Core primer for athletes only | **Core first for everyone** (the warm-up), movable (**v1.1: light 2 × 2; core supersets anywhere**) | ATH-11 |
| 9 | Vertical vector free; Bootcamp 1 Tue/Fri as written | **Hip-dominant + push, knee-dominant + pull**; Bootcamp 1 Tue/Fri was a mistake | UNI-11, ORD-06 |
| 10 † | Two squat exposures a week | **Load the spine once a week** (**v1.1: heavy squat and heavy deadlift on two different days, approved list**) | PER-04, EQ-11 |
| 11 † | 6 = 5 + deload; 8 = 7 + deload/test; 12 = 6 + mid deload + 5 | 4-6 weeks = maintenance; 8 weeks start hard; 12 weeks preferred (**v1.1: every plan a stairway; no deload inside a block**) | PER-01 |
| 12 † | Deload back to ~week-1 volume | Deload = **about half the sets** (**v1.1: half of the hardest week, only between blocks**) | PER-05 |
| 13 † | Plyo zones Z1-Z3 as an exercise property | A **method** (receive & pause → receive then create → repeated) (**v1.1: "Receive-Create stages", approved**) | CAT-10, CAT-11 |
| 14 | "Zone" = level | Davidson zones are **rotation biases**; level from **load position**, skill and stability (**v1.1: approved**) | CAT-04, CAT-10 |
| 15 | Bands, chains, weight releasers | **None** anywhere for now | EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 |
| 16 | Machine ranking | **Not ranked**; belt squat = no axial load | EQ-11 |
| 17 † | Olympic lifts for intermediate+ only | **Everyone in athletic training** gets Olympic lifts (**v1.1: up to 4 × a week; 60+ off by default**) | ATH-10 |
| 18 | Plyo dial by contact counts | Plyo vs ballistic set by **ground-contact time** (**v1.1: shares approved**) | ATH-01, ATH-02 |
| 19 | Sex on the form | **No sex field, no sex-based rules** | GEN-02, ATH-09 |
| 20 | Levels L1-L4 | **L1-L3** by years of training; 6-12+ months off → L1 body | PRG-05 |
| 21 † | 60-min reference session | 5-7 exercises (45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); field athletes up to 10-12 (**v1.1: 12 + the 2-exercise core block**) | VOL-08, VOL-16, UNI-09 |
| 22 | Medball for everyone | **No medball for aesthetics** except warm-up; never over 20 lb | ATH-05, EQ-06 |
| 23 † | 2-3 aerobic sessions by level | 3 general, 2 athletes in season, 4 aesthetics + walks (**v1.1: adjustable by the user; athletes by sport**) | ATH-07 |
| 24 † | Output = a Google Sheet | Undecided; PROPOSED website (**v1.1: approved, with fewest clicks, macro views, screenshots**) | GEN-03 |

### 0.3 Cross-file decisions this master takes

Where two synthesis files disagree, the generator follows the column "Adopted" until the coach decides. Every row is mirrored in `generator_spec_v1.json > _meta.integration_decisions`. v1 rows settled by round 2 keep their row with the new status; v1.1 rows are added at the end.

| Topic | One file says | Another says | Adopted here | Status |
|---|---|---|---|---|
| Hand-set weekly step | 12 v1: coach may set 0-10 % | 03: 0-7 % | **0-7 % by hand; the person's total weekly sets strictly below +10 %** | COACH-ANSWER UNI-05, VOL-05; COACH-R2 R2-VOL-01 ("never more than 7 % a week") |
| Default sets in athletic templates | 12 v1: 3 / 2 / 3 | 03, 05: 2 per slot | **2 per slot in athletic templates**; 3 compound / 2 isolation / 3 calves elsewhere | COACH-ANSWER VOL-16 |
| RIR in the hardest weeks | 12 v1: "RIR toward 1" | 03: 1-3 RIR always, no ramp | **1-3 RIR on every working set**; v1.1 plans a drift from 3 to 1 RIR inside that band so the weeks feel like "2 → 11" (PROPOSED; flagged against VOL-13, round 3) | COACH-ANSWER VOL-13; COACH-R2 R2-PER-05 |
| Exercises per resistance session | 12 v1: 5-7, 8 PROPOSED | 03, 05: by length | **45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9**; full-body days grow with 2-4 exercises per muscle group (R2-SES-05) | COACH-ANSWER VOL-08, VOL-16; COACH-R2 R2-SES-05 |
| Priority add by level | v1 master: +4 / +5 / +6 | 12 v1.1: +4 (L1-L2) / +6 (L3) | **+4 L1, +4 L2, +6 L3** (12 v1.1 computed every table and example on it; inside his +4-6) | PROPOSED (changed in v1.1) |
| Full Olympic lifts | 12 v1: L3 only | 03, 04, 06, 10: L2+ | **L1 and early L2: DB/KB snatch, hex-bar jumps, hang pulls/cleans; L2+: full scope** | COACH-ANSWER ATH-10; 12 v1.1 fixed |
| Glute credit on hinges | 01, 12 v1: 0.5 | 02: 0.25 | **0.25** on squats, lunges, deadlifts and RDLs; hip thrusts and bridges 1.0; **KB swings 0** | **Settled**: COACH-R2 R2-VOL-05 |
| Plyo share by sport | 12 v1: per-sport start → end | 04: class map 75/60/50/40/25 % | **Class map = end-of-block share of jump and throw work; each block starts 15 points more ballistic** (v1's "floor 20" dropped: he approved the plain rule; 04 v1.1 still floors class 5 at 20 %, §16.4) | **Settled**: COACH-R2 R2-ATH-01 |
| Weekly jump-contact targets | 03 §9.11 totals | 04 §5.1 tier dials | **04's two dials**; 03's totals as an upper reference | PROPOSED |
| Plyo method stage weeks | 12 v1: 1-2 / 3-5 / 6+ | 04: by plan length | **12-week 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8** | **Settled**: COACH-R2 R2-ATH-03 |
| Weekly step mechanism | 12 v1: readiness score R | 13 v1: effort × life table | **v1.1: the planned stairway**; the optional check-in moves the step from effort, completion and pain only (his table without its life column); R retired | **Settled** by COACH-R2 R2-PER-03/04, R2-VOL-01/03, R2-GEN-04; life-column drop flagged |
| Field-athlete exercise cap | VOL-08 "max maybe 12" | VOL-17 "12 to 14" | **12 + the 2-exercise core block** | **Settled**: COACH-R2 R2-SES-04 |
| Thruster credit | VOL-09 helpers 0.25 | LIB-14 0.5 shoulders | **1.0 quads + 0.5 shoulders + 0.25 glutes** | **Settled**: COACH-R2 R2-VOL-05 |
| 'JUSTICE LEAGUE' program name | 01 | 05, 11 | **"Athletic Performance - Non-Competitive"**; profile `weekend_warrior` | COACH-ANSWER ATH-13, FIX-03 |
| Equipment profile ids | v0 ids | 10 v1 | **10 v1 ids** | COACH-ANSWER EQ-01 |
| Leg-flexion bucket id | RP.HD.ISO | RP.LF | **RP.LF** | COACH-ANSWER CAT-09 |
| **v1.1** 60+ default for low ankle hops | 05 v1.1: "landing drills and low ankle hops are fine" | 04 (flag F9), 06, 12, 03, 11, 02 v1.1: hops opt-in | **Landing drills (step-down and stick, no rebound) stay by default; low ankle hops, other plyos, Olympic lifts and depth jumps are opt-in with his warning** (ankle hops are on his approved plyometric list) | COACH-R2 R2-ATH-08 + R2-ATH-02; stricter reading INFERRED; round 3 |
| **v1.1** Swimming contact class | 12 v1.1 §3.13 text: class 4 (40 %) | 04 v1.1 sport verification: class 5 (25 %) | **Class 5 (25 % at block end, 10 % at start)**: starts and turns are single big efforts = ballistic by his definition | COACH-R2 R2-ATH-02; class INFERRED; round 3 |
| **v1.1** Olympic-lift percentages | 06, 11, 12 v1.1: "% only if that lift was tested" | 13 v1.1 / spec output: no % by default even when tested; coach opt-in | **Both hold together**: a % may appear only when that exact lift has a tested best (approved R2-GEN-06 proposal) and only if a coach switches it on, or for competitive weightlifters' own programming; everyone else gets RPE/RIR and "move it fast" | COACH-R2 R2-GEN-06, R2-ATH-05; coach opt-in PROPOSED (13 N-PROD-20) |
| **v1.1** Muscle groups for "2-4 exercises per muscle" | 12 v1.1: his FOCUS headers, glutes and hamstrings separate | 05 v1.1 templates: glutes + hamstrings = one "hips" group | **05's grouping runs the templates** (hips, shoulders = delts + traps); 12's separate count is reported; round 3 asks | COACH-R2 R2-SES-05; grouping INFERRED |
| **v1.1** The failed set | 12 v1.1: a separate optional 'Failed' answer (hold, -1 set, lighter) | 13 v1.1: his own "Couldn't do it" is the failed option | **His "Couldn't do it"** (one level down or assisted, sets unchanged, GEN-05); no extra button until he asks | COACH-R2 R2-VOL-02 ("we can add a fail with it if we need to"); 13 N-PROD-19 |
| **v1.1** Depth jumps and snatches for 60+ who opt in | 04 GP-4: depth jumps stay off even with the opt-in | 02 v1.1, 12: R2-ATH-08 opt-in covers them; EQ-03 "never" kept for injured / high-volume clients | **R2-ATH-08 wins over EQ-03 for older adults** (round 2 > round 1): opt-in with the warning; overhead squat and low-bar squat stay "never" | COACH-R2 R2-ATH-08; COACH-ANSWER EQ-03; round 3 |

---

## 0b. What changed in v1.1

### 0b.1 The round-2 answers in numbers

47 answers (45 round-2 questions + LIB-10 and LIB-12): **38 RIGHT** (20 with no words, 18 with words that add to the rule: R2-VOL-04, -06, -07, R2-SES-03, -06, R2-ATH-04, -05, -08, R2-PER-01, -02, -05, -06, -07, R2-GEN-02, -03, -06, -07, -08), **3 PARTLY** (R2-VOL-02 effort 10, R2-SES-05 full-body days, R2-PER-04 12-week shape), **2 NOT RIGHT** (R2-PER-03 "4 + 4 / start hard", R2-GEN-04 lifestyle questions), **4 answered in words without a chip** (R2-VOL-03 no check-in, R2-VOL-05 glute credit, LIB-10 face pulls, and **R2-VOL-08, which he did not understand**). Counted with the team venv from `coach_answers_round2.md`.

### 0b.2 The changes that move the generator most

| # | v1 | v1.1 (the coach's rule) | ID | Where |
|---|---|---|---|---|
| 1 | One 3 / 5 / 7 % step a week chosen by the person's state; 12-week acclimation ≤ 3 %; 8-week "start hard" × 1.10 with 4 + 4 | **Every plan is a stairway**: small steps in the first half, slightly bigger after the halfway week ("but not too much"), the hardest weeks last; on 12 weeks "the last 4 weeks are going to be brutal". Planned steps 3 % to the halfway week, 5 % after, scaled per muscle (λ) so the peak lands on its cap in the last week (numbers PROPOSED) | COACH-R2 R2-PER-03 (NOT RIGHT), R2-PER-04 (PARTLY) | §5.4, §11 |
| 2 | "Start at a 2 and end at an 11" read as sets | **A felt level of overall volume and loading**, ending "a little bit past your limits"; shown as a 2 → 11 stair level per week; planned effort drifts 3 → 1 RIR inside his 1-3 band (drift PROPOSED) | COACH-R2 R2-PER-05 | §5.4, §11.3 |
| 3 | Plan-only users stepped by an intake rate (5 % / 3 % for stress, short sleep, physical job) | **No check-in = no adaptation**: the plan runs its planned stairway ("there is no data to go off of") | COACH-R2 R2-VOL-03 | §5.4, §13.5 |
| 4 | Intake asked sleep, stress, physical job; check-in asked "how was life" | **No lifestyle questions anywhere** ("I just need the workouts here"). The approved check-in table is used **without its life column**: the step comes from effort, completion and pain only (resolution flagged) | COACH-R2 R2-GEN-04 (NOT RIGHT) vs R2-VOL-01 (RIGHT) | §5.4, §13.2, §13.5 |
| 5 | Effort 10 = "failed or wrecked" | **Effort 10 = "the max I can do, not a fail ... but it was successful"**; his "Couldn't do it" covers a failed set | COACH-R2 R2-VOL-02 (PARTLY) | §5.4, §7.4 |
| 6 | Small muscles 8 / 12 / 15, caps 12 / 18 / 22; floors 4 / 2 | **"I don't think anybody needs less than 10 sets a week per muscle"**: floor 10 per trained muscle in training blocks; small muscles 10 / 12 / 15 on the same caps as big muscles (14 / 22 / 25); priority 18 / 26-28 / 30; "all customizable"; an optional **Pro setting** above 30 (PROPOSED) | COACH-R2 R2-VOL-04, R2-VOL-06 | §5.3 |
| 7 | - | **"Most people train around 20 to 30 sets per muscle per week"** researched: fits what trained people work up to counting indirect work; high as "what most people do" (direct-set surveys ≈ 8-17); no number changes | COACH-R2 R2-VOL-06 | §5.8 |
| 8 | Hinge glutes 0.25 (0.5 switch); KB swings glutes 1.0; thruster 1 / 0.5 | **Squats, lunges, deadlifts, RDLs: glutes 0.25; hip thrusts and bridges 1.0; KB swings are ballistic and never glute volume; thruster 1.0 quads / 0.5 shoulders / 0.25 glutes** | COACH-R2 R2-VOL-05 | §5.2 |
| 9 | Triggered deload inside a block; week 1 of the next cycle a deload | **No deload or maintenance week inside a block.** A block is completed; if it cannot be, the person cancels it → maintenance phase → a whole new block. Deload (half of the hardest week) only between blocks | COACH-R2 R2-VOL-07 | §11.6 |
| 10 | Maintenance block of 4-6 weeks | **Maintenance length chosen and extendable**; at its end: keep maintaining / change the plan / start a training block. Pre-season = a 4-6-week block at ~60 % of off-season sets with more speed and power + a 1-2-week taper (approved) | COACH-R2 R2-PER-06 | §11.2, §11.6 |
| 11 | Year with ambiguous quarters | **The year plan is for the general population ("stay in shape")**, approved, on the user's calendar and **fully tunable** (re-order blocks, more or less cardio, a winter powerlifting-style block) | COACH-R2 R2-PER-01, R2-PER-02 | §11.5 |
| 12 | Tests in the last week | **Test before the block (or week 1) and at the end, never during it; never from zero** (5RM / 3RM or 80-90 % efforts, never a 1RM or a max mile without a completed block) | COACH-R2 R2-PER-07 | §12 |
| 13 | Full-body days 1-2 exercises per muscle (PROPOSED) | **"There's never one exercise"**: 2-4 exercises per muscle group on its day, full-body days included; days run longer | COACH-R2 R2-SES-05 (PARTLY) | §10 |
| 14 | Axial once a week (squat) | **Heavy squat and heavy deadlift on two different days**; non-axial hinge, leg press or belt squat on the other days; the counted axial list approved | COACH-R2 R2-SES-01, R2-SES-02 | §10.4 |
| 15 | Core first ~2 exercises | **Light core opener 2 × 2 short of failure** (approved); **core supersets or monster sets may be added anywhere** | COACH-R2 R2-SES-03 | §10.1 |
| 16 | Aerobic counts fixed by population | **Every aerobic count is adjustable up or down by the user**; aesthetics 4 incl. a second Orange + walks (approved); athletes off-season 2-4 by sport (approved) | COACH-R2 R2-SES-06, R2-ATH-06 | §9.7 |
| 17 | Plyo shares, lists, stage name and weeks PROPOSED | **Approved**: shares by sport, ballistic vs plyometric lists, "Receive-Create stages" with their weeks; game-heavy in-season reductions | COACH-R2 R2-ATH-01, -02, -03, -07 | §9.2-9.3, §9.8 |
| 18 | Olympic lifts once a week in season (proposal) | **Up to 4 × a week**: clean days are squat-pattern days, snatch days are hinge-pattern days; full squat cleans / snatches 3-5 reps "with the coach's eye" on speed; weight by RPE / RIR; explained as power output | COACH-R2 R2-ATH-04, R2-ATH-05, R2-GEN-06 | §9.5 |
| 19 | Older clients: few plyos unless asked | **60+: no Olympic lifts, plyos or depth jumps by default; optional with the warning** "Make sure that you have a fitness professional to help you understand what this means." Youth floor Olympic lifts from ~14 after a hang block | COACH-R2 R2-ATH-08 | §9.9 |
| 20 | Library open items | KB face pulls = shoulder work; bench push-ups both versions; 21.6-mile run removed; library additions approved; **one-detail variations between blocks, never invented exercises**; zones and level rule approved; 'NO ACCESS' = a self-serve version | COACH-R2 R2-LIB-01 … -08, LIB-10, LIB-12 | §2, §3, §4 |
| 21 | Output undecided | **Approved path** (website → check-in → open source) with **fewest clicks, phone-first, Block / Week / Day macro views, screenshot a whole block or a week, videos optional** | COACH-R2 R2-GEN-02 | §14 |
| 22 | Safety screen PROPOSED | **PAR-Q-style health check for clients; coaches may bypass it with a legal warning; everyone accepts a liability release every time** | COACH-R2 R2-GEN-03 | §13.2 |
| 23 | Season by dates (PROPOSED) | **Season start date + practice and game days** (approved); the tool works out off-, pre- and in-season | COACH-R2 R2-GEN-05 | §9.8, §13.2 |
| 24 | Five sample plans | **Seven sample plans he will grade**: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs | COACH-R2 R2-GEN-07 | §14.3 |
| 25 | 27 profiles | **Every popular US sport, swimming included** (52 picker sports, 127 profiles) and a **"Stay athletic and active" door** for gen pop (pickleball, HYROX, padel, tennis, golf, rec leagues, running, hiking and more; 26 activities) | COACH-CHAT 2026-10-08 | §9.4, §9.10, §9.11 |

### 0b.3 Resolutions the coach should see (answers that pull against each other)

| # | Tension | Resolution in v1.1 | Round 3 |
|---|---|---|---|
| 1 | **R2-VOL-01** approved a step table with "life was harder / better" cells; **R2-GEN-04** then rejected every lifestyle input | Keep the effort rows, **drop every life cell**; the step comes from effort, sessions done and pain only. Someone who was ill logs fewer sessions (repeat the week) or high effort (hold). INFERRED (the later, more specific answer decides) | R3-VOL-02 |
| 2 | **Rear delts 4 / 6 / 8 own sets** (R2-VOL-04, RIGHT) vs **"nobody needs less than 10"** (R2-VOL-06) | Keep 4 / 6 / 8 direct rear-delt sets and read the floor on his **SHOULDERS/TRAPS** group (side-delt work 10 / 12 / 15 + rear-delt work + face pulls is well above 10). INFERRED | R3-VOL-01 |
| 3 | **R2-VOL-08 not understood** | Default kept and marked: when a day type runs twice a week, added sets alternate Monday's first exercise, then Thursday's; a small-muscle bonus exercise goes on the optional day, else on a day that already trains that muscle group | R3-VOL-03 (re-asked with an example) |
| 4 | **"2 → 11" felt climb** (R2-PER-05) vs **VOL-13 "1-3 RIR, no planned ramp"** | A planned drift 3 → 2 → 1-2 → 1 RIR that never leaves his 1-3 band; intensifiers only in the last week. PROPOSED | R3-VOL-04 |
| 5 | **His approved check-in numbers (+5 % / +7 %)** vs **small steps early** (R2-PER-03) | The check-in is read against the stairway: on target = the planned step, too easy = planned + 2 points (max 7 %). First half: +3 % / +5 %; from the halfway week exactly his table. PROPOSED | R3-VOL-04 |
| 6 | **60+ "landing drills and low ankle hops still OK"** (approved proposal) vs **his words "no plyos by default"** and ankle hops on his plyometric list (R2-ATH-02) | Stricter reading: landing drills stay by default; low ankle hops join the opt-in. Depth jumps and snatches follow R2-ATH-08 (opt-in with warning), overhead and low-bar squats stay "never" (EQ-03) | R3-ATH-02 |
| 7 | **Floor of 10** (R2-VOL-06) vs **maintenance 50-70 %** (PER-01) and athlete budgets | The floor applies to **training blocks**; maintenance phases, pre-season and in-season are not floored; field athletes' credit-only muscles are not floored, but their trained chest and back rise from 7.5 to 10. INFERRED | R3-VOL-01 |
| 8 | **Holiday weeks switch to maintenance** (R2-PER-02) vs **never maintenance inside a block** (R2-VOL-07) | The year planner places marked weeks between blocks; a week marked after a block started ends that block early (cancel → maintenance → new block) unless the user removes the mark. PROPOSED | R3-PER-01 |
| 9 | **Recovery week**: "week 1 of the next cycle is a deload" (approved R2-VOL-07 proposal) vs "maintenance ... at the end of a block" | One recovery week between two completed blocks, counted as an extra week (a 12-week block + 1 = a 13-week quarter). PROPOSED | R3-PER-01 |
| 10 | **R2-SES-05 "2-4 per muscle"** vs **R2-SES-04 "12 + 2 core"** for field athletes | 2-4 exercises for each muscle group **trained that day** (knee + pull day / hip + push day); athletic stations do not count toward the resistance part; the cross pattern then leaves 2 plyo/ballistic stations + 1 Olympic lift on a 12-cap day. INFERRED | R3-SES-01 |
| 11 | **'high rows'** in today's request | Read as **HYROX**, the fitness race (supported by his round-1 answers EQ-06 "CrossFit, or ... high rows?" next to wall balls, and VOL-11 "high-raw athletes" doing 40-rep sets). INFERRED | R3-ATH-03 |
| 12 | **R2-GEN-06** "% for Olympic lifts when they enter a recent best" (approved) vs his words "they don't necessarily need to go by percentage unless you're a competitive Olympic lifter" | No % on Olympic lifts unless that exact lift was tested **and** a coach switches it on (or competitive weightlifting). PROPOSED | - (product default) |

### 0b.4 His request of 2026-10-08: every popular US sport, swimming, pickleball and HYROX

> "For the athletes, all of the different popular sports in the United States are there. Include swimming as well. And for the general population, make sure that you include pickleball because that's a very popular sport right now. Gen Pop and general fitness people are wanting to do things like high rows and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." (COACH-CHAT 2026-10-08)

| What | Result (04 v1.1 + spec 1.1.0) |
|---|---|
| Popular US sports | **All 45 sports of the coverage list present** (own profiles, or padel as a tennis variant), plus routed extras (figure skating, competitive dance, fencing, other racket sports, bowling, skateboarding, competitive surfing, speed skating): **52 sports in the picker** in 5 groups, **146 position / event / discipline choices**, 127 profiles (93 competitive) |
| Swimming | first-class: sprint (50-100), middle (200-400 / IM) and distance (800-1500 / open water) profiles, 5 stroke variants, plus diving, water polo and lap swimming; 3 dryland days + 1 optional; the pool is the aerobic work (0 extra gym sessions by default, adjustable); shoulder care every session; class 5 (mostly ballistic start and turn power); a 2-week dryland taper before the main championship meet (§9.11) |
| Gen pop "stay athletic and active" | a new goal tile **"Stay athletic and active"** with an activity picker (up to 2): pickleball, HYROX, tennis, padel, golf, rec leagues (basketball, soccer, softball, flag football, volleyball, ice hockey, ultimate, kickball), running, hiking / rucking, cycling, lap swimming, ski prep, surf / paddle, dance and fitness classes, triathlon, rowing, CrossFit-style classes, combat-fitness classes, climbing, a first obstacle race, "a bit of everything" (weekend warrior) and routed extras: **26 activities**, each with its own profile or route, plus active-aging 50+ / 60+ and youth overlays (§9.10) |
| Pickleball | recreational (`rec_pickleball`) and competitive (`pickleball_competitive` with a senior 60+ variant): lateral first steps, split-step reactions, rotation both ways, calves / Achilles, shoulder and elbow care; a 50+ joint-care block; the 60+ defaults switch on automatically |
| HYROX | for fitness (`hyrox_fitness`, the gen-pop path he asked for) and competitive (`hyrox_competitive`): race = 8 × 1 km runs, each followed by a station; plan = strength days + hybrid days with run intervals and station circuits; 4 aerobic sessions (PROPOSED) |

---

## 1. The philosophy in his words

### 1.1 What he said (short quotes; the full text is in `coach_answers_round2.md` and `coach_answers_full.md`)

| Topic | His words | ID |
|---|---|---|
| Taxonomy | "this is the whole taxonomy of each exercise ... we can segment by whatever we need ... This is huge." | CAT-01 |
| Biomechanics | "biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises." | CAT-03 |
| Levels | "Mostly, skill and stability demand ... Also, in the positioning"; machines and cables "easier because the machine or the cable is doing the work for you." | CAT-04 |
| Levels are soft | "The levels are still very theoretical, so we don't need to rely heavily on them." | CAT-05 |
| How much volume | "15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation." | UNI-01 |
| The floor | "I don't think anybody needs less than 10 sets a week per muscle." "8 sets a week is probably just barely maintenance ... the little muscles also grow the same idea." | R2-VOL-06, R2-VOL-04 |
| What people do | "I think most people train around that: 20 to 30 sets per muscle per week. I believe so, but you can do some research and figure it out." More than 30 "should probably be for a very advanced person. Maybe we can add a pro level." | R2-VOL-06 |
| Customizable | "Yeah, but this is all customizable." | R2-VOL-06 |
| Learning | "This eventually will be something that learns from the data of all the people that use it." | VOL-01 |
| The stairway | "the 8-week plan should gradually go up like steps up a stairway. That's how every program should be ... When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan." | R2-PER-03 |
| Hardest last | "on a 12-week program, the last 4 weeks are going to be brutal ... week by week, it just gets gradually worse. I mean worse, meaning better, more volume." | R2-PER-04 |
| 2 → 11 | "I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets ... The last week might feel like an 11 ... you've pushed yourself a little bit past your limits." | R2-PER-05 |
| 10 % is too much | "It can progress week by week by 10 %. That's way too much." | UNI-05 |
| No check-in | "If they don't check in, the plan doesn't change. There is no data to go off of." | R2-VOL-03 |
| Workouts only | "I just need the workouts here. There's no need to talk about sleep or stress or anything else." | R2-GEN-04 |
| Effort 10 | "10 should be like, 'That was the max I can do, not a fail' ... I gave it all I had, but it was successful." | R2-VOL-02 |
| Blocks are completed | "It should never be thrown in the middle of a block ... If they can't complete it, they should cancel the block and start a maintenance phase ... then ... start a whole new block." | R2-VOL-07 |
| The tool does the math | "I need this tool that we're building eventually to figure out the percentages." | VOL-06 |
| Where sets go | "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning." | VOL-07 |
| Never one exercise | "full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day ... there's never one exercise." | R2-SES-05 |
| Bilateral vs unilateral | "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." | UNI-02 |
| Pairing | "If I'm doing the back of my lower body, then the opposite would be the front of my upper body ... keep as far away as I can from bleeding over." | UNI-11 |
| Spine | "I would rather just load it once per week and load it correctly." (round 2: heavy squat and heavy deadlift on two different days, RIGHT) | PER-04, R2-SES-01 |
| Core | "we need all the core work to be done first ... that'll give you a good warm-up." Core supersets: "It should be optional to be thrown anywhere." | ATH-11, R2-SES-03 |
| KB swings | "kettlebell swings are not glutes ... mostly supposed to be used for the ballistic movements, not for resistance training." | R2-VOL-05 |
| Athletes | "The more time on the ground ... the more ballistics and less plyos." "everyone gets Olympic lifts." | ATH-01, ATH-10 |
| Olympic lifts | "it could be done four times a week. Some days are about cleans, and some days are about snatches ... I take snatches a little bit more hingy than squatty." | R2-ATH-04 |
| Older adults | "we're not going to need them to be doing any Olympic lifting, plyos, depth jumps ... but it should be an additional option ... 'Make sure that you have a fitness professional to help you understand what this means.'" | R2-ATH-08 |
| Plyos | "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." | CAT-10 |
| Cardio | "You can always say, 'I need more cardio,' and then it just adds it ... less cardio, it takes away ... it can always be adjustable." | R2-SES-06 |
| Testing | "they should not test during the weeks, during the block ... you should not go from not training to a one-rep max test ... test at 80%, 90%, but not at 100%." | R2-PER-07 |
| The year | "this is for the general population that wants to just stay in shape ... They can just switch it around ... ramp it up to powerlifting style." | R2-PER-01, R2-PER-02 |
| Equipment | "I don't do bands." "I don't want to rank them because they have different brands, angles." | EQ-01, EQ-11 |
| Pain | cut 30-50 %, machines, "maybe even drop the exercise altogether if it's too much." | VOL-03 |
| People, not labels | "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." | ATH-09 |
| Effort | "I like RIR in my model, so that's what I'm going to be using." | VOL-13 |
| The product | "The fewer clicks, the better ... the macro view of the week, the macro view of the block, and the macro view per day ... they can just screenshot their 12 weeks." "They can just look up the videos on their own on YouTube." | R2-GEN-02 |
| Safety and liability | "If you're a client, then we take them through the park queue [PAR-Q] ... I want to be able to bypass it if I'm a coach ... We want everyone that's using it, every time they're going to get it, to release liability." | R2-GEN-03 |
| Everyone can be athletic | "all of the different popular sports in the United States ... Include swimming as well ... pickleball ... high rows [HYROX] ... they want to stay athletic and active." | COACH-CHAT 2026-10-08 |
| Users | "clients, coaches, trainers, strength and conditioning coaches, anyone"; English first with a full Spanish toggle (neutral Latin American Spanish approved). | GEN-01, R2-GEN-08 |
| Lineage | Dr. Pat Davidson + Dr. Mike Israetel + first-principles science, not packaged models (5/3/1, Texas Method, Prilepin). | COACH-CHAT |

### 1.2 The model in sixteen sentences

1. **Classify first, then dose.** Every exercise is tagged on every lens at once: family, pattern, laterality, plane, size class, muscles, equipment, constraint, load position, level (COACH-ANSWER CAT-01, CAT-03).
2. **A slot is CATEGORY × PURPOSE.** The category ('Unilateral KD') is the Davidson half (a pattern and a position); the purpose ('Quads/Glutes') is the Israetel half (the muscle credited). The generator places patterns and audits muscles (OBSERVED BYOP rows; INFERRED reading).
3. **Big muscles are organised by pattern, small muscles by muscle** (COACH-ANSWER CAT-02; OBSERVED LIB columns).
4. **Exercise level = skill + stability + where the load sits**, made easier by a seat, machine or cable; zones are rotation-bias tags, not levels; levels add options, never gate (COACH-ANSWER CAT-04, CAT-05, CAT-06; COACH-R2 R2-LIB-02, R2-LIB-03).
5. **Count weekly hard sets per muscle**: main mover 1.0, helpers 0.25 (glutes 0.25 on squats, lunges, deadlifts and RDLs), 10/10 = one set; athletic work never counts, KB swings included (COACH-ANSWER VOL-09, UNI-01, VOL-10; COACH-R2 R2-VOL-05).
6. **Start where the person is** (10-12 / 15-20 / 20+; small muscles 10 / 12 / 15) and **never below 10 sets a week per trained muscle**; caps 14 / 22 / 25 (priority 18 / 26-28 / 30), all customizable (COACH-ANSWER VOL-01; COACH-R2 R2-VOL-04, R2-VOL-06).
7. **Every plan climbs a stairway**: small steps first, slightly bigger after the halfway week, the hardest weeks last; it feels like a 2 in week 1 and an 11 at the end; the tool turns the steps into whole sets, added to the first exercise of the day first (COACH-R2 R2-PER-03, R2-PER-04, R2-PER-05; COACH-ANSWER VOL-06, VOL-07).
8. **The plan works with no tracking; no check-in = no change.** An optional one-minute check-in (effort, sessions done, pain) moves the next step; nothing about sleep, stress or life is asked (COACH-R2 R2-GEN-01, R2-VOL-01, R2-VOL-03, R2-GEN-04).
9. **Bilateral drives force, unilateral keeps the body healthy and rotational**: the share slides from 90/10 to 10/90 by athlete, phase and pain (COACH-ANSWER UNI-02).
10. **Every session**: warm-up → light core (2 × 2) → athletic work → Olympic/power → the work with its opposite-surface partner (hip + push, knee + pull) → secondary pair → isolation → conditioning; **2-4 exercises per muscle group on its day, never 1** (COACH-ANSWER ATH-11, ORD-01..08, UNI-11; COACH-R2 R2-SES-03, R2-SES-05).
11. **Heavy squat and heavy deadlift on two different days**; the other lower days are non-axial (hip thrust, back extension, leg press, belt squat) (COACH-R2 R2-SES-01, R2-SES-02).
12. **Blocks are completed**: same exercises for 4-6 weeks, one detail may change at the next exercise block, never an invented exercise; no deload or maintenance week inside a block; a block that cannot be finished is cancelled → maintenance (length chosen) → a whole new block (COACH-ANSWER PER-02; COACH-R2 R2-LIB-01, R2-VOL-07, R2-PER-06).
13. **Athletes: the sport's ground time sets plyo vs ballistic** (approved shares by sport); programs start ballistic and become plyometric through the Receive-Create stages; Olympic lifts up to 4 × a week, cleans on squat days and snatches on hinge days (COACH-ANSWER ATH-01, CAT-10, ATH-10; COACH-R2 R2-ATH-01..05).
14. **Everyone can train athletic**: every popular US sport (swimming included) has its profile, and gen-pop people who "want to stay athletic and active" (pickleball, HYROX, rec leagues ...) get the non-competitive athletic plan with their activity's demands (COACH-ANSWER ATH-13; COACH-CHAT 2026-10-08).
15. **Safety beats labels**: a health check (coaches may bypass it with a warning) and a release every time; 60+ get no Olympic lifts, plyos or depth jumps unless they choose them with a warning; tests never from zero; pain cuts 30-50 % or drops the exercise (COACH-R2 R2-GEN-03, R2-ATH-08, R2-PER-07; COACH-ANSWER EQ-03, VOL-03).
16. **No bands, no variable resistance, no machine ranking, no sex-based rules; the tool does the math and learns** under fixed guardrails and the coach's approval (COACH-ANSWER EQ-01, EQ-12, EQ-11, ATH-09, VOL-06, VOL-01).

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
| S7 | **Athletic patterns never count toward muscle volume** (plyos, ballistics incl. KB swings, throws, Olympic lifts, sprints, change of direction); they have their own units. | COACH-ANSWER VOL-10; COACH-R2 R2-VOL-05 |
| S8 | **The BYOP MASTER EXERCISE LIBRARY is the single source of truth**; Sheet23 and RESISTANCE PATTERNS are older drafts used for levels and grammar. | COACH-ANSWER CAT-07 |
| S9 | **Speed (sprint and running mechanics) is a library category** (squirrel jumps → MACH drills / acceleration starts → max velocity, fixed order). | COACH-ANSWER LIB-21 |
| S10 | **Carries, drags and sling systems are to be built out**: carries and drags for athletes and general fitness; slings for advanced athletes and rehab. | COACH-ANSWER LIB-19 |
| S11 | **One-detail variations, never invented exercises.** His library exercises are always the main pick; between exercise blocks the tool may change one detail (which hand holds the weight, grip, stance, implement, range) and show it as '<library name> - <detail>', e.g. 'Reverse lunge - dumbbell in opposite hand'. | COACH-R2 R2-LIB-01 (APPROVED; answers CAT-12) |
| S12 | **KB face pulls are shoulder work** (side / rear delts / traps), done mainly on pull or shoulder days and adjustable; a swap, never the main vertical pull. | COACH-R2 R2-LIB-04, LIB-10 |

### 2.2 Two cuts plus a variable stack

```
STEP 1  FAMILY (what QUALITY is trained, its dose unit, its place in the session)
        ATHLETIC  AP  purpose = a quality ('SPEED/POWER', 'CHANGE OF DIRECTION'); contacts / throws / cuts / metres; never muscle sets (VOL-10)
        RESISTANCE RP purpose = a muscle ('QUADS', 'BACK'); sets x reps at 1-3 RIR; counted per muscle (VOL-09)
        CONTROL   CO  purpose = 'CORE'; thorax / pelvis / both x plane x static/dynamic (CAT-08); light opener first (ATH-11, R2-SES-03)
        CARDIO    CA  blue A / green B / orange C / lactate clearance; any erg (EQ-14)
        FUNCTIONAL FN carries, drags, slings (LIB-19; build-out pending)
STEP 2  ORGANISING LENS inside the family (CAT-02, CAT-03)
        big muscles + all athletic and core work -> by pattern (knee/hip x bilateral/unilateral, leg extension, LEG FLEXION;
                                                  push/pull x vertical / mid-range / horizontal; phase, height, turn, plane)
        small muscles -> by muscle ('SIDE RAISES', 'BICEP', 'TRICEP', 'CALVES'; rear delts tracked apart, VOL-17; KB face pulls here, R2-LIB-04)
        biomechanics  -> NOT a bucket: the description on every record
STEP 3  EXERCISE LEVEL inside the bucket = skill + stability + load position; seat/machine/cable easier; soft default (section 3)
STEP 4  VARIABLES on the base exercise: stance, load position, into/out of the hip, grip, feet/body, ROM, end range,
        implement/constraint, axial load, tempo, intent. One detail may change between exercise blocks (R2-LIB-01).
        Bands/chains/releasers: DORMANT (EQ-01, EQ-12)
STEP 5  THE SLOT = PURPOSE (muscle or quality credited) x CATEGORY (bucket the exercise is drawn from)
```

### 2.3 Canonical tree (v1.1; stable IDs, full node list in `01_taxonomy.json > nodes`, 91 nodes)

```
AP  Athletic      TEX triple extension / Olympic (DRILL, PULL, PWR, SQ = Squat Snatch / Squat Clean / Squat Clean & Jerk, JERK;
                      clean family vs snatch family F.OLYFAM, R2-ATH-04)
                  JMP jumping (LK limited-knee/ankle; PLY landing -> box -> hurdle; FULL reactive/depth/loaded/squirrel)
                  UBP upper-body plyos | SPD sprint & mechanics (MECH A-drills/MACH, ACC, MAXV) [confirmed LIB-21]
                  THR medball throws (BS, ROT, INT, HIP into/out of a hip, TRUNK, SPEC) | COD pre-planned | AGI reactive
                  (split-step reaction drill PROPOSED, v1.1 sports)
RP  Resistance    KD knee dominant (BS bilateral, UL unilateral, ISO leg extension)
                  HD hip dominant (BS hinge/bridge/thrust/back extension, UL single-leg hinge/bridge)
                  LF LEG FLEXION (knee flexion; lanes MACH / BW PROPOSED) [CAT-09; replaces RP.HD.ISO]
                  PU push (V vertical BS/UL; M mid-range [PROPOSED node]; H horizontal BS/UL/ISO fly)
                  PL pull (V vertical BS/UL/ISO lat pull-over = 'Pull under' [LIB-09]; H horizontal BS/UL; M [PROPOSED])
                  SM small muscles (DELT SIDE / REAR / FRONT incl. KB face pulls [R2-LIB-04]; TRAP [PROPOSED]; BI; TRI; CALF;
                     NECK [PROPOSED node, v1.1 sports])
CO  Control       CT thorax moves | CP pelvis moves | CB both [confirmed CAT-08]  x plane x static/dynamic
CA  Conditioning  A blue | B green | C orange | LC lactate clearance | BUY buy-out | WOD | CIRC circuit
FN  Functional    AOS anterior oblique (CHOP, AROT Pallof, PLANK, CRUNCH) | POS | LSS | CARRY | DRAG  [build-out LIB-19]
X   Meta          FOCUS ('Focus 1'/'Focus 2') | PREP (warm-up) | SKILL | TEST
```

Retired ids (resolve as aliases): `RP.HD.ISO` → `RP.LF`; `F.PZONE` → `F.PMETHOD`; `ZONE_ARM` → `ZONE_DAVIDSON`; muscle `FOREARMS_NECK_CUFF` → `FOREARMS` + `NECK_CUFF` (`01_taxonomy.json > _meta.retired_ids`).

### 2.4 Program slots (BYOP PURPOSE × CATEGORY) → node → credit (v1.1)

Wiring OBSERVED (data validations); credit = COACH-ANSWER VOL-09 (main mover 1.0, helpers 0.25) with his exercise-level exceptions and COACH-R2 R2-VOL-05. **Credit follows the exercise picked, not the slot** (library columns hold off-pattern items).

| PURPOSE | CATEGORY | LIB range | Node | Credit per set |
|---|---|---|---|---|
| 'Quads' | 'Bilateral KD' | AI7:AI122 | RP.KD.BS | quads 1.0; glutes 0.25 (R2-VOL-05), adductors 0.25 (PROPOSED) |
| 'Quads/Glutes' | 'Unilateral KD' | AL7:AL42 | RP.KD.UL | quads 1.0 ("mostly for quads", UNI-01); glutes 0.25 (R2-VOL-05); 10/10 = 1 set |
| 'Quads' | 'Leg Extensions' | AM7:AM9 | RP.KD.ISO | quads 1.0 |
| 'Hamstring' | 'Bilateral HD' | AN7:AN122 | RP.HD.BS | hamstrings 1.0; glutes 0.25 (R2-VOL-05); hip thrusts and bridges: glutes 1.0; **KB swings: no muscle credit (ballistic, R2-VOL-05)** |
| 'Hamstring/Glutes' | 'Unilateral HD' | AQ7:AQ42 | RP.HD.UL | hamstrings 1.0; glutes 0.25 (R2-VOL-05); single-leg bridges/thrusts glutes 1.0 |
| 'Hamstrings' | 'Leg Curls' | AR7:AR10 + LEG FLEXION items | RP.LF | hamstrings 1.0 (CAT-09) |
| 'Back' | 'Horizontal Pull' | X7:X162 | RP.PL.H | lats/upper back 1.0; biceps 0.25, rear delts 0.25 |
| 'Back ' | 'Vertical Pull' | U7:U122 | RP.PL.V | lats/upper back 1.0; biceps 0.25 (lat pull-over: back 1.0 only); KB face pulls moved out (R2-LIB-04) |
| 'Chest' | 'Horizontal Push' (PPL 'Incline', 'Flies', 'Dips') | AD7:AD162 | RP.PU.H (M, ISO) | chest 1.0; triceps 0.25, front delts 0.25; **dips 0.5 triceps + 0.5 chest, on push days** (LIB-16); bench push-ups both ways (R2-LIB-05) |
| 'Chest/Shoulders' | 'Vertical Push' | AA7:AA122 | RP.PU.V | front delts 1.0; side delts 0.25, triceps 0.25 |
| 'Shoulders/Traps' | 'ABdution' / 'Reverse Flies' | AH7:AH42 | RP.SM.DELT | side delts 1.0 (upright rows too, LIB-16); rear delts 1.0 on rear-delt items (own sets, VOL-17); **KB / cable face pulls: rear delts 1.0 + side delts 0.25** (R2-LIB-04, LIB-10; split PROPOSED) |
| 'Bicep' / 'Tricep' / 'Calves' | same | AS / AT / AU | RP.SM.BI / TRI / CALF | target 1.0; calves 3 sets every leg day (VOL-17) |
| 'Plyo' / 'Throwing' / 'COD' / 'Tripple Extension' | same | G / K / L / C | AP.JMP / THR / COD / TEX | none: contacts, throws, cuts, power reps (VOL-10) |
| 'Core' | (blank) | O7:O283 | CO.CT / CP / CB | abs/obliques 1.0; light opener first (ATH-11, R2-SES-03) |
| 'Cardio' / 'Aerobic Capacity' | (blank) | B7:B122 | CA | sessions and bouts, not sets |
| 'Focus 1' / 'Focus 2' | (blank) | AZ7:AZ335 | X.FOCUS | the muscle picked; 2-3 sets each, both may hit the same muscle (ORD-11) |

Exercise-level exceptions: **thrusters** quads 1.0 + shoulders 0.5 + glutes 0.25 (LIB-14, COACH-R2 R2-VOL-05: "that's good math"); **dips** 0.5 / 0.5 (LIB-16); **leg extension / leg curl** count fully (VOL-09); **'Pull under'** = lat pull-over, back 1.0 (LIB-09); **Kong row** counts as a row but is used for shoulder/back pain clients, not to fill back volume (LIB-09; use PROPOSED); **KB swings** (Russian, American, split-stance single-arm) are ballistic power reps with 0 muscle sets; they live in the triple-extension / ballistic pool and never default into a hip-dominant slot (R2-VOL-05; pool placement INFERRED, 02 v1.1). Push press / push jerk count to shoulders only in the VERTICAL PUSH slot; in the triple-extension slot they are power reps (VOL-10).

### 2.5 Facets that are separate fields (one meaning per field; full list `01_taxonomy.json > facets`, 47 facets / 255 values)

| Facet | Values | v1.1 status | ID |
|---|---|---|---|
| `F.LEVEL` (exercise level) | L1 foundational, L2 intermediate, L3 advanced, L0 no level (throws, GHD, leg ext/curl, small-muscle lists) | soft default, never a gate; from load position + skill + stability − support | CAT-04, CAT-05; R2-LIB-02 |
| `F.CLIENT` (client level) | Level 1 / 2 / 3 (+ optional Pro setting, not a level) | separate axis from F.LEVEL | CAT-06, PRG-05; R2-VOL-06 |
| `F.LOADPOS` | SIDES, GOBLET, COUNTER, HIGH_ZERCHER, ZERCHER, FRONT_RACK, BACK_HIGH, BACK_LOW, OVERHEAD, SHOULDER | carries the level band | CAT-04 |
| `F.DZONE` (Davidson zone) | Z1 vertical-low (ER bias), Z2 horizontal (IR bias, compressive), Z3 vertical-high (ER bias) | **approved**: a tag, not a level; used to pick swaps when something hurts; both biases every week | R2-LIB-02, R2-LIB-03 |
| `F.PMETHOD` (plyo execution method) | RC1 Land, RC2 Land & Go, RC3 Repeat | **"Receive-Create stages", name and weeks approved** | CAT-10, CAT-11; R2-ATH-03 |
| `F.INTENT` | BALLISTIC (long contact / one big effort, KB swings included), PLYOMETRIC (short, bouncy contacts), SPEED_STRENGTH, MAX_STRENGTH | lists approved | ATH-01; R2-ATH-02, R2-VOL-05 |
| `F.OLYFAM` (new v1.1) | CLEAN (squat-pattern days), SNATCH (hinge-pattern days), JERK (either day, INFERRED) | new | R2-ATH-04 |
| `F.LOADLAT` | DOUBLE, CONTRA (into the hip), IPSI (out of the hip), SINGLE | use case per record | CAT-13 |
| `F.AXIAL` / `F.SPINEDAY` (new v1.1) | counted heavy spine lift / second-day option if not sore / not counted | **approved list** | R2-SES-01, R2-SES-02 |
| `F.DETAIL` (new v1.1) | which hand holds the weight, grip, stance, implement, range | the one-detail variation axis | R2-LIB-01 |
| `F.CONSTRAINT` | 1-5 (approved scale, §8.2) | approved | EQ-13 |
| `F.ROLE` | PRIMER, CORE_BLOCK (light opener; core supersets anywhere), ATHLETIC_BLOCK, MAIN, SECONDARY, ISOLATION, FINISHER, OPTIONAL_DAY ... + strength roles the work / accessory / nuance / survival | confirmed | ATH-11, ORD-07; R2-SES-03, R2-SES-04 |
| `F.WEEKTYPE` | training week, end-test week, recovery week (between blocks only), maintenance week (maintenance phase only), taper | no deload or maintenance week inside a block | R2-VOL-07, R2-PER-06, R2-PER-07 |
| `F.SEASON` | OFF, PRE (4-6 weeks ~60 % + taper), IN, POST | from the season start date + practice and game days | R2-PER-06, R2-GEN-05, R2-ATH-07 |
| `F.ACCOM` | BANDS, REV_BANDS, CHAINS, RELEASERS | **DORMANT** | EQ-01, EQ-12 |
| `F.PERTURB` | ADDUCT (active); HIP_BAND DORMANT; STRAP removed | | EQ-01, LIB-09 |
| core | segment (CT/CP/CB) × plane × static/dynamic | confirmed | CAT-08 |
| others kept | F.PHASE (force phase P1-P4), F.TURN (COD), F.OLY (start position/receive), F.STANCE, F.ORIENT, F.GRIP, F.BODYPOS, F.ROM, F.END, F.ABAND (A/B/C/LC; count adjustable, R2-SES-06), F.EZONE, F.VOL (VOL 1/2/3) | | OBSERVED |

### 2.6 One record per exercise (required fields)

**Required on every exercise** (COACH-ANSWER CAT-01): `family`, `node_id` (pattern), `laterality`, `plane`, `size_class`, `muscle_credit` (empty for athletic work), `implement[]`, `level`. **Also carried**: `constraint_level` 1-5, `davidson_zone` + `rotation_bias` + `use_v1_1` (swap selector when something hurts), `load_position`, `load_laterality` + use case, `axial_spinal_load` + `spine_day_v1_1`, `athletic_quality` + `receive_create_stage` + `contact_class_v1_1` (ballistic / plyometric / receive), `olympic_v1_1` (family, frequency, reps rule), `older_default_excluded` (60+) + warning key, `population_rules`, `variation_v1_1.axes` (one-detail axes), `generator` {eligible, pools, default_candidate, why}, `coach_cues`, `video_url` (optional, R2-GEN-02), `name_raw` / `name_clean` / `name_es` (neutral Latin American Spanish with the English gym term in brackets, R2-GEN-08), `status` (active / dormant / out_of_scope / retired / proposed_v1_1), `sport_use_v1_1`, and an evidence tag per field. Schema: `01_taxonomy.json > proposed_cleanup.record_schema`; implementation: `02_exercise_catalog.json` v1.1.

### 2.7 Pending (segmentation)

| Item | Proposal | Status |
|---|---|---|
| Size class of front delts, traps, adductors, neck (CAT-02 left them open) | front delts SMALL (credit only), traps SMALL, adductors BIG (credit only), neck SMALL (PROPOSED node RP.SM.NECK for collision, grappling and fighting sports; no muscle credit) | PROPOSED |
| Toes to bar, hanging knees to chest; Copenhagen plank | toes to bar / knees to chest → CO.CP; V-up → CO.CB; Copenhagen → CO.CB frontal static + adductor credit | PROPOSED |
| Lanes inside LEG FLEXION | RP.LF.MACH (seated/lying curls), RP.LF.BW (slider, ball, DB, Nordic) | PROPOSED |
| Mid-range push / pull nodes; plane of motion vs plane of demand; A/B/C tag on every cardio item | open from v0 | OPEN (low priority) |
| ~~CAT-12 one-detail variants~~ | answered: R2-LIB-01 (S11) | CLOSED |

---

## 3. Levels

### 3.1 Exercise level: confirmed rules

| # | Rule | ID |
|---|---|---|
| L1 | **Level = skill + stability demand + where the load sits.** Load in front / low = foundational; close to and on the body = intermediate; behind the body or overhead = advanced. | COACH-ANSWER CAT-04 |
| L2 | **A seat, machine or cable makes any position easier** ("the machine or the cable is doing the work for you"): a deep goblet squat stays foundational, and a seated DB shoulder press or a lat pulldown is foundational even though it is overhead. | COACH-ANSWER CAT-04; COACH-R2 R2-LIB-02 (APPROVED) |
| L3 | **Levels add options and never remove them**, and they are "still very theoretical": a soft default, never a gate. | COACH-ANSWER CAT-05 |
| L4 | **Client level (how much volume) and exercise level (how hard the movement is) are separate.** | COACH-ANSWER CAT-06 |
| L5 | **Safety beats the level label**: foundational older/injured clients may use machines filed MODERATE/ADVANCED. | COACH-ANSWER EQ-04, CAT-04 |
| L6 | **No levels on throws or the GHD**; leg extensions and leg curls at every level. | COACH-ANSWER LIB-06, LIB-08, LIB-15 |
| L7 | **Push press is the easier rung; push jerk is intermediate/advanced.** | COACH-ANSWER LIB-13 |
| L8 | **A slot moves up a level at the end of a block** when it felt '8 - That was perfect' or easier with no pain. | COACH-ANSWER PER-06 |
| L9 | **Bench push-ups both ways**: hands on the bench = foundational (easier); feet on the bench = advanced (harder). | COACH-R2 R2-LIB-05, LIB-12 |
| L10 | **New library items and their levels (approved)**: belt squat (foundational, knee dominant); seated machine shoulder press (foundational, vertical push); hang clean, single-arm DB snatch, KB squat clean and hex-bar jump (foundational, triple extension); KB curl, table row and floor Y/T raises for home clients. | COACH-R2 R2-LIB-07 |

**His ladders, as applied** (OBSERVED ladders; levels per CAT-04; 02 `level.generator_min_level`):

| Pattern | Foundational (L1) | Intermediate (L2) | Advanced (L3) |
|---|---|---|---|
| Bilateral knee dominant | goblet (deep goblet included, R2-LIB-02), front-loaded zercher, hex-bar squat, low DB squat (DBs at the sides), leg press, pendulum, hack, belt squat (R2-LIB-07) | barbell front squat, SSB | high-bar and low-bar back squat, overhead squat |
| Vertical push | seated machine shoulder press (R2-LIB-07), seated DB press (R2-LIB-02), push press (LIB-13) | push jerk (LIB-13), Z-press | standing barbell overhead press (LIB-11), handstand push-up |
| Vertical pull | lat pulldowns (R2-LIB-02), assisted pull-up machine | - | strict / weighted pull-ups |
| Olympic (ATH-10) | DB/KB snatch, single-arm DB snatch, KB clean / KB squat clean, DB/KB high pull, hex-bar jump, hang pulls, hang cleans (R2-LIB-07) | power clean / power snatch / power clean & jerk; intermediates get the full scope (ATH-10) | Squat Snatch, Squat Clean, Squat Clean & Jerk (LIB-07) |
| Push-ups | bench push-up, hands on the bench (R2-LIB-05) | push-up | bench push-up, feet on the bench (R2-LIB-05) |

SCIENCE/OBSERVED check (10 §1.4): the load-position rule reproduces his library levels exactly for 98 of 176 levelled entries (56 %) and within one level for 157 (89 %); the misses are barbell skill (harder than position says) and machines filed as volume tools. No catalog level changed in v1.1: his round-2 examples already held (02 v1.1).

### 3.2 Davidson zones: confirmed meaning (APPROVED, COACH-R2 R2-LIB-02, R2-LIB-03)

The coach takes the zones from Dr. Pat Davidson's book *A Coach's Guide to Optimizing Movement* (COACH-ANSWER CAT-04, CAT-10). In his words they are **rotation biases**:

| Zone | Positions (his examples) | Rotation bias | ID |
|---|---|---|---|
| **Z1** vertical-low | standing, arms down, load low and close to the body | external rotation | CAT-04, CAT-10; R2-LIB-02 |
| **Z2** horizontal | hands in front of you; knee at hip height (halfway through a squat) | **internal rotation, more compressive** | CAT-04, CAT-10; R2-LIB-02 |
| **Z3** vertical-high | arms overhead; deep squat | external rotation | CAT-04, CAT-10; R2-LIB-02 |
| - | **Plyos** | zones do not apply | CAT-10 |

**How the generator uses it (v1.1, approved).** (1) Every loaded, non-plyo exercise carries `davidson_zone` + `rotation_bias` as a tag (02 v1.1: 196 records carry `use_v1_1`). (2) **The level comes from load position + skill + stability, made easier by a seat, machine or cable, not from the zone number** (R2-LIB-02). (3) **Keep both rotation biases in every week, and use the bias to pick a swap when something hurts; not by sport for now** (R2-LIB-03). (4) The zone is not used to order or pair stations (05 §1). (5) Levels stay theoretical (CAT-05).

**Lineage** (07 §1.1): no public description of this zone wording was found (web search 2026-10-08); it is consistent with the PRI / Hartman / Davidson pressure model (expansion ≈ external rotation, compression ≈ internal rotation). Treated as the coach's account of the book.

### 3.3 Client levels L1-L3: confirmed definitions

| Level | Who | What it changes | ID |
|---|---|---|---|
| **L1** (novice = newby) | under about 6-12 months of consistent training; **or** more than 6-12 months off (the body is treated as a beginner; skills come back fast, so exercise level can stay higher); **ex-pros start at L1 only briefly** | starts 10 (big) / 10 (small, by the floor); caps 14; on the 12-week stairway the first set is usually added in week 6 (λ 0.76; earlier weeks climb by load, reps and RIR); DB/KB/hex/hang Olympic variants; supersets when they don't fatigue (ORD-05); tests submax only (no completed block yet) | COACH-ANSWER PRG-05, CAT-06, ORD-05; COACH-R2 R2-VOL-04, R2-VOL-06, R2-PER-07 |
| **L2** (intermediate) | consistent training for more than a year | starts 15 (big) / 12 (small); caps 22; full Olympic scope (ATH-10); contrast eligible for athletes off-season (ATH-12) | COACH-ANSWER PRG-05, ATH-10, ATH-12; COACH-R2 R2-VOL-04 |
| **L3** (advanced) | **PROPOSED**: 3+ years consistent and training 4+ days a week now, or a competitive physique/strength athlete | starts 20 (big) / 15 (small); caps 25; small stairway steps (λ 0.50: 1.5 % / 2.5 %) so the cap lands in the last week; the "11" also comes from heavier loads, intensifiers and a rotating priority muscle up to 30 | PROPOSED (he did not define advanced); COACH-R2 R2-PER-05 |
| **Pro setting** (optional, not a level) | L3 only, chosen by the coach, or by a client who is "really adamant about growing that muscle" | **one** priority muscle may pass 30, up to 35 (PROPOSED number); others ≤ 3 %/week; weekly check-in required; a warning shown | COACH-R2 R2-VOL-06 ("Maybe we can add a pro level"); numbers PROPOSED |
| L4 | retired: competition level changes the athlete profile (sport, position, season) and loads/care (PRG-09), not the volume level | - | PRG-05, PRG-09 |

**Rules.** Explain the level in plain words on screen ("You trained 3 years but took 9 months off, so we start your body at Level 1 for the first block") (PRG-05). **One algorithm** for reps, sets and volume at every level and model (PRG-06). Athletic 'STARTING / MID / ADVANCED' off-season templates are blocks or levels "depending on whatever is needed" (PRG-04); PROPOSED decision rule: an off-season of 16+ weeks for an L1-L2 athlete runs them as consecutive blocks. The L1/L2 boundary is read as **12 months of consistent training** (INFERRED from PRG-05). **Retired by round 2**: "L1 acclimation 4 weeks at ≤ 3 %" and "L3 default step 3 % (target-seeking)": every level runs the same stairway, scaled by λ (R2-PER-03, R2-PER-04).

### 3.4 Pending (levels)

- Angle cut-offs of the zones (INFERRED in `01_taxonomy.json > F.DZONE`).
- Power clean / power snatch filed INTERMEDIATE (BYOP files ADVANCED) under ATH-10 "intermediate plus ... full scope" (INFERRED application).
- The L3 definition and the Pro setting numbers (PROPOSED).
- ~~Zone 1 vs zone 3, support lowering an overhead lift, rotation-bias use~~: answered (R2-LIB-02, R2-LIB-03).

---

## 4. Library and catalog changes

### 4.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| C1 | **Default exercise in every slot plus a dropdown of swaps within the same category.** "That's going to be important." | COACH-ANSWER GEN-04 |
| C2 | **Only BYOP-library items (plus items a coach answer added) can be the default pick**; reference-tab and program-only exercises are dropdown swaps; the ~120 exercises that live only in his programs (SL RDL, JM press, seal rows ...) stay swaps until he adds them. | COACH-ANSWER CAT-07; COACH-R2 R2-LIB-07 |
| C3 | **The client's preference can choose between alternatives**; older/injured lean machine or DB, experienced lean barbell. | COACH-ANSWER EQ-10 |
| C4 | **No implement named → bodyweight → DB → barbell as level rises**, limited by the client's kit. | COACH-ANSWER EQ-09 |
| C5 | **Spelling is corrected in the generator only; his sheets stay as they are.** | COACH-ANSWER FIX-04 |
| C6 | **Program and day names must be generic and understandable.** | COACH-ANSWER FIX-03, ATH-13 |
| C7 | **A short cue per exercise in his voice plus his instruction block at the top.** | COACH-ANSWER GEN-07 |
| C8 | **Videos are optional** (supersedes v1's "a video for every exercise" as a launch requirement): his own video where one exists, otherwise a "Watch how" link that opens a YouTube search; "send us your video" for the library he will build. | COACH-R2 R2-GEN-02; COACH-ANSWER GEN-06 (history) |
| C9 | **Near-duplicates are merged.** | COACH-ANSWER LIB-17 |
| C10 | **No V-squat, ever.** | COACH-ANSWER GEN-08; OBSERVED SQ |
| C11 | **One-detail variations between blocks, never invented exercises** (S11). | COACH-R2 R2-LIB-01 |
| C12 | **Spanish names**: neutral Latin American Spanish with the English gym word in brackets ('Empuje de cadera (Hip Thrust)'); he or a coach he trusts approves every line. | COACH-R2 R2-GEN-08 |

### 4.2 His decisions on specific items

| Item (verbatim where it matters) | Decision | ID |
|---|---|---|
| 'LEFT TEST'; '5/10/05' | L-test / L-drill (3-cone); 5-10-5 pro-agility shuttle | LIB-01 |
| 'Push up Stick the Landing' | hands **start on a box and land on the floor** | LIB-02 |
| second 'Low Depth Drop' | the single-leg or weighted variant (new record) | LIB-03 |
| advanced 'Hurdle Hops' | taller hurdles + continuous quick contacts | LIB-04 |
| two MODERATE plyo columns | an intermediate athlete takes one from each | LIB-05 |
| throws | no levels, "just do them right"; medball 'ALL LIST' = 1 × 10 per throw | LIB-06, LIB-22 |
| 'Snatch' / 'Clean' / 'Clean & Jerk' | full squat versions: **Squat Snatch / Squat Clean / Squat Clean & Jerk**; 3-5 reps per set (R2-ATH-05) | LIB-07; R2-ATH-05 |
| 'GHD' | no levels; one record | LIB-08 |
| 'Camporini Deadlift'; 'strap rotating in/out' | **removed** | LIB-09 |
| 'Alternating DB/Barbell Deadlifts' | alternating staggered-stance single-leg deadlifts | LIB-09 |
| 'Single Leg Get Ups' | box pistol | LIB-09 |
| 'Low DB Squats' | DBs hanging at the sides | LIB-09 |
| 'Kong Row' | double-KB row from the floor; pain-friendly, low stimulus | LIB-09 |
| 'Pull under' | lat pull-over (cable) | LIB-09 |
| **'KB Face Pulls' under VERTICAL PULL** | **shoulder work (side / rear delts / traps), mainly on pull or shoulder days, adjustable; a swap, never the main vertical pull**; credit rear delts 1.0 + side delts 0.25 (split PROPOSED) | **LIB-10, R2-LIB-04** |
| second 'Standing DB Press' | the standing **barbell** press | LIB-11 |
| **'Bench Push ups'** | **both: hands on the bench = foundational; feet on the bench = advanced** (two records) | **LIB-12, R2-LIB-05** |
| push press / push jerk | push press easier (FOUNDATIONAL); push jerk INTERMEDIATE-ADVANCED | LIB-13 |
| thrusters | conditioning-leaning; **quads 1.0 + shoulders 0.5 + glutes 0.25** | LIB-14; R2-VOL-05 |
| **KB swings** | **ballistic / athletic power reps, never glute volume** ("not for resistance training"); rotational swing stays a core drill | **R2-VOL-05** |
| leg extensions '-ADVANCED', leg curls 'UNILATERAL' | typos | LIB-15 |
| upright rows; dips | side delts; dips 0.5 / 0.5 on push days | LIB-16 |
| near-duplicates | merged | LIB-17 |
| **'21.6 mile run'** | **removed from plans and tests**; the longest run stays the half-marathon plan (Chris Hinshaw), used as-is | **R2-LIB-06** (LIB-18 history) |
| CARRY, DRAGS, sling systems (empty) | build them out | LIB-19 |
| frontal/transverse lower-body moves | add for court and combat athletes | LIB-20 |
| speed session (Sheet23) | squirrel jumps → MACH drills / acceleration starts → max velocity | LIB-21 |
| CARDIO dropdowns | menus include DISTANCE (200-1000 m) and CALORIES, grouped by colour then unit | FIX-02 |
| 'LEG CURLS' / 'LEG FLEXION' | LEG FLEXION pool | CAT-09 |
| VERTICAL PUSH has no machine | **Seated Machine Shoulder Press** (foundational) | EQ-05; R2-LIB-07 |
| belt squat | **Belt Squat** (foundational; no axial load; second squat day) | EQ-11; R2-LIB-07, R2-SES-02 |
| beginner Olympic options | **Hang Clean, Single-Arm DB Snatch, KB Squat Clean, Hex-Bar Jump Squat** (foundational triple extension, default candidates) | ATH-10; R2-LIB-07 |
| home gaps | **Kettlebell Curl, Table Row (inverted row under a sturdy table), Floor Prone Y / T Raises** (coach-approved) | R2-LIB-07 |
| **'NO ACCESS' tabs** | **a self-serve version without coach access, using the full gym library**; its Tuesday 'Unilateral HD' points to the single-leg hinge list (AQ7:AQ42), not leg curls | **R2-LIB-08** (answers PRG-01, FIX-01) |

### 4.3 Out of scope and retired (02 v1.1)

- **36 band, chain or weight-releaser items → `out_of_scope`**, each with a non-band replacement; **0 active records use a band** (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12).
- **11 records retired**: the v1 ten (Camporini deadlift, both strap rotating squats, 7 near-duplicates) plus **'Distance Test: 21.6 mile Run'** (R2-LIB-06).
- Kept in the JSON with `record_type` 'out_of_scope' / 'retired' so every crosswalk id still resolves.

### 4.4 New records (02 v1.1)

| Record | Why | Status |
|---|---|---|
| Seated Machine Shoulder Press; Belt Squat | EQ-05, EQ-11 | **coach-approved, foundational** (R2-LIB-07) |
| Low Depth Drop - Single-Leg or Weighted | LIB-03 | coach-approved |
| Hang Clean, Single-Arm DB Snatch, KB Squat Clean, Hex-Bar Jump Squat | ATH-10 | **coach-approved, foundational triple extension, default candidates** (R2-LIB-07) |
| Kettlebell Curl, Table Row, Floor Prone Y / T Raises | home gaps | **coach-approved** (R2-LIB-07) |
| Bench Push-Up - Feet on Bench (decline) | LIB-12 | **coach-approved, advanced** (R2-LIB-05) |
| MACH drills, A-march / A-skip / A-run, acceleration starts; max-velocity sprint moved to SPRINT | LIB-21 | coach-approved; A-drills = warm-up, never volume |
| Hold-object-between-knees squat, Cossack lateral lunge, split-stance contralateral single-arm KB swing (ballistic) | LIB-20; R2-VOL-05 | coach-approved |
| 9 starter carries and drags | LIB-19 | PROPOSED |
| **22 PROPOSED additions for the new sports** (swap only, never default, no bands): side-lying DB and cable external rotation, scapular push-up, dead hang, DB wrist extension, streamline hold, streamline squat jump, sled rope pull, wall ball (≤ 20 lb), sandbag walking lunge, SkiErg / rower distance pieces, compromised run, burpee broad jump, ruck walk, split-step reaction drill, single-leg balance reach, tibialis raise, seated / bent-knee calf raise, neck isometric holds, plate neck flexion / extension, wall sit | COACH-CHAT 2026-10-08 (swimming, pickleball, HYROX, collision sports) | PROPOSED (02 v1.1 §2.8) |

### 4.5 Catalog in numbers (02 v1.1)

**939 records; 732 active exercise-like records** (707 v1 − 1 retired + 26 new); crosswalk references 3,824, 0 unresolved; 0 duplicate active names; 0 band set-ups; 0 athletic records counting toward muscle volume; 0 medballs over 20 lb. Contact classes on every jump and throw: 68 ballistic, 70 plyometric, 12 receive; Receive-Create stage on all 96 PLYO / ANKLE jumps; `olympic_v1_1` on 39 Olympic-type lifts (16 clean family, 18 snatch family, 4 jerks, 1 loaded jump); `older_default_excluded` (60+) on 140 records; `spine_day_v1_1` on 158 records (25 counted heavy spine lifts); `variation_v1_1.axes` on 553 records; `sport_use_v1_1` tags on 38 existing records (swimming 18, pickleball 19, HYROX 16 tagged records in all); 615 records carry a `v1_1_changes` log (1,420 entries).

### 4.6 Pending (library)

- **Wall balls** (HYROX, CrossFit): count like a thruster (1.0 / 0.5 / 0.25) or as conditioning with no sets? v1.1 counts no sets (conditioning) (02 10.3).
- **KB swings' home**: the triple-extension / ballistic pool plus a 0-set swap in the hip-dominant slot (INFERRED); or conditioning / warm-up?
- **HYROX stations** (sled push / pull, burpee broad jumps, wall balls, ergs, compromised runs): conditioning slot or athletic slots (decides placement and whether the 60+ jump rule applies).
- **Neck and grip work** for collision, grappling and climbing sports: library node RP.SM.NECK (PROPOSED), no muscle credit.
- **Jerks** on Olympic days: clean days, snatch days or their own overhead-power piece (v1.1: either day, INFERRED).
- **14-, 17- and 20-mile distance tests** in the CARDIO list are longer than the half-marathon plan he approved as the longest run (R2-LIB-06): offered or not? (02 10.3 #5; default: not offered).
- **Split-step for 60+**: kept as a no-hop "ready step" by default (02 10.3 #3; INFERRED).
- ~120 program-only exercises stay swap-only until he adds them to BYOP (CAT-07, R2-LIB-07).
- POSTERIOR OBLIQUE and LATERAL SUBSYSTEM still empty; the 9 PROPOSED carries/drags need a slot.
- Videos: optional (R2-GEN-02); the 85 exercises he uses without a link stay a backlog, not a blocker.
- Spanish names (`name_es`) for every record, in his approved format (R2-GEN-08); still to be written and approved.
- Front raises sit in the 'ABdution' side-raise pool (never asked).

---

## 5. The volume engine

Full version: `12_volume_algorithm_v1.md` / `.json` (content v1.1: research, the stairway, the check-in, pseudo-code, four worked examples recomputed with the v1.1 prototype), with the coach-side record in `03_volume_dosing.md` v1.1. The coach asked for this ("go find some charts ... match them with my experience", VOL-01; "I need this tool ... to figure out the percentages", VOL-06; "you can do some research and figure it out", R2-VOL-06), so every number he did not give is PROPOSED.

### 5.1 Confirmed rules (one page)

| # | Rule | ID |
|---|---|---|
| V1 | Unit = **weekly hard sets per muscle**. A hard set = a working set at 1-3 RIR, 5-30 reps; warm-up sets and A-drills never count; the light core-opener sets count toward abs. | VOL-04, VOL-13, ORD-08; R2-SES-03 |
| V2 | **Main mover 1.0, helpers 0.25.** Squats, lunges, deadlifts and RDLs give glutes 0.25; hip thrusts and bridges 1.0. Dips 0.5 triceps + 0.5 chest. **Thruster 1.0 quads + 0.5 shoulders + 0.25 glutes.** Leg extension and leg curl count fully. | VOL-09, LIB-16, LIB-14; **R2-VOL-05** |
| V3 | **A 10/10 unilateral set = 1 set** to the primary muscle; alternating lifts count the same way. | UNI-01, UNI-07, PRG-07 |
| V4 | **Athletic work never counts** toward muscle sets (plyos, ballistics, throws, Olympic lifts, sprints, COD). **KB swings are ballistic: 0 muscle sets** ("kettlebell swings are not glutes"). | VOL-10; **R2-VOL-05** |
| V5 | **Starting weekly sets**: big muscles beginner **10-12**, intermediate **15-20**, advanced **20+** (engine 10 / 15 / 20); **small muscles 10 / 12 / 15** (the L1 8 is lifted by the floor: "8 sets a week is probably just barely maintenance ... the little muscles also grow the same idea"); **rear delts 4 / 6 / 8 of their own sets**. 15-20 = maintenance to a little growth; 20-25 = growth; 5 too little, 40 too much. | VOL-01, UNI-01; **R2-VOL-04** |
| V5b | **Floor of 10**: "I don't think anybody needs less than 10 sets a week per muscle." Every target muscle starts at 10 or more in a training block (exemptions in §5.3). | **R2-VOL-06** |
| V5c | **"Most people train around 20 to 30 sets per muscle per week"**: researched in 12 §2.11 (§5.8 here); no number changes. | **R2-VOL-06** |
| V6 | **Caps per 12-week plan: 14 / 22 / 25 by level; priority 18 / 26-28 / 30**; "this is all customizable"; above 30 only for a very advanced person through an optional **Pro setting** (one muscle, up to 35, PROPOSED). **Priority muscle**: +4 to +6 sets on the start, 1-2 at a time, its exercise first in its session; **while 1-2 priorities are pushed, the other muscles grow at most 3 % a week.** | VOL-02, ORD-04; **R2-VOL-06** |
| V7 | **Pain**: that muscle or pattern -30 to -50 %, constrained machines or split grips, or drop the exercise; a bilateral lift swapped to unilateral keeps its sets "ideally, but adjust accordingly". | VOL-03, UNI-08, EQ-03 |
| V8 | **The stairway**: every plan climbs in weekly steps, a % of each muscle's weekly sets, one rule for every person (never by muscle size): "a little bit smaller" in the first weeks, "a little bit higher, but not too much" after the halfway point, the hardest weeks last ("the last 4 weeks are going to be brutal" on 12 weeks). **Never more than 7 % a week; the person's total weekly resistance sets rise by less than 10 %.** | VOL-04, VOL-05, UNI-05; **R2-PER-03, R2-PER-04, R2-VOL-01** |
| V9 | **Bank the fraction; add a whole set when the bank reaches 1.** The tool computes the percentages; the client never sees them. | VOL-06 |
| V10 | **New sets go to the first exercise of the day for that muscle, then the next**: 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3. **3-4 exercises per muscle group per day on split days; 2-4 on full-body days, never 1.** | VOL-07; **R2-SES-05** |
| V11 | **Small muscles at the end of a session** get extra volume as a **bonus exercise**. | VOL-07 |
| V12 | **Focus 1 / Focus 2** may hit the same muscle, 2-3 sets each; optional days are add-ons or separate (ideally separate). | ORD-10, ORD-11 |
| V13 | **Calves 3 sets every leg day** (and at least 10 a week, PROPOSED: a 4th set or the optional-day 'Calves' slot with fewer than 4 leg days); **rear delts get their own sets**; **2 core exercises × 2 sets first**, short of failure. | VOL-17; R2-VOL-06; R2-SES-03 |
| V14 | **Default sets when blank**: 3 on compounds, 2 on isolation; **2 per slot in athletic templates**. | VOL-16 |
| V15 | **Session size**: resistance sessions 5-7 exercises (45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); full-body days grow with 2-4 exercises per muscle group ("it might be a little longer day"); off-season field athletes **up to 12 exercises + the 2-exercise core block**; athletes/bodybuilders/powerlifters ~1.5 h (max 2 h); general/weight loss 45-60 min; unilateral time must be accounted for. | VOL-08, VOL-16, VOL-17, UNI-09; **R2-SES-04, R2-SES-05** |
| V16 | **Unilateral volume progresses like bilateral.** | UNI-05 |
| V17 | **Unbalanced templates are not intended**: balance to the targets; a V-taper bias when the athlete wants it. | VOL-18 |
| V18 | **The plan works with no tracking; the optional check-in moves the step** (table in §5.4c): effort mostly 1-6 → more, 7-8 → as planned, 9 → hold, any 10 → hold and -1 set that day, under half the sessions → repeat the week. **Inputs: effort, sessions done and pain only.** | GEN-05; **R2-GEN-01, R2-VOL-01, R2-GEN-04** |
| V19 | **No check-in = no adaptation**: the plan runs its planned stairway ("there is no data to go off of"). | **R2-VOL-03** |
| V20 | **Effort 10 = "the max I could do, but successful"** (0 RIR), not a fail. | **R2-VOL-02** |
| V21 | **Smooth weekly increases** for hypertrophy and general clients; **2-week steps and waves** for fight or competition prep. | PER-10 |
| V22 | **Next block after a completed block: start × 1.05, cap + 1** (never above 25, or 30 for a priority). | **R2-VOL-06** (APPROVED) |
| V23 | **The tool learns from everyone's data over time**; priority numbers adjusted "over time" from data. | VOL-01, VOL-02 |

### 5.2 Counting: the credit map (coach count; `12 > counting.credit_map`)

| Category | 1.0 | 0.5 | 0.25 | Status |
|---|---|---|---|---|
| Bilateral knee dominant (squat, leg press, hack, belt squat) | quads | - | glutes, adductors | VOL-09; glutes 0.25 **COACH-R2 R2-VOL-05**; adductors PROPOSED |
| Unilateral knee dominant (split squat, lunge, step-up) | quads | - | glutes, adductors | UNI-01 ("mostly quads"); glutes **R2-VOL-05** |
| Hip dominant (deadlift, RDL, SL RDL, back extension) | hamstrings | - | glutes | **R2-VOL-05** ("a quarter"); the v1 0.5 co-mover switch is retired |
| Glute isolation (hip thrust, bridge, kickback, abduction) | glutes | - | hamstrings | **R2-VOL-05** (hip thrusts, bridges = 1 set); hamstrings 0.25 VOL-09 |
| Leg flexion (curl, Nordic, slider/ball curl) | hamstrings | - | - | CAT-09, VOL-09 |
| Leg extension | quads | - | - | VOL-09 |
| Horizontal push | chest | - | triceps, front delts | VOL-09 |
| Vertical push | front delts | - | side delts, triceps | VOL-09 |
| Dips | - | triceps, chest | - | LIB-16 |
| Thruster | quads | shoulders (front delts) | glutes | LIB-14; **R2-VOL-05** (1 / 0.5 / 0.25) |
| Horizontal pull (incl. Kong row) | lats/upper back | - | biceps, rear delts | VOL-09, LIB-09 |
| Vertical pull | lats/upper back | - | biceps | VOL-09 |
| Lat pull-over ('Pull under') | lats/upper back | - | - | LIB-09 |
| Face pull (cable or KB) | rear delts | - | side delts | **R2-LIB-04, LIB-10** ("shoulder work"); split PROPOSED |
| Isolation (fly, side raise / upright row, rear-delt fly, curl, triceps, calf raise) | target muscle | - | forearms on curls | VOL-09, LIB-16 |
| Core | abs/obliques | - | - | CAT-08 |
| Plyo, ballistic (**KB swing included**), throw, Olympic, sprint, COD | **none** (own budget, §9) | | | VOL-10; **R2-VOL-05** |

Other conventions: MYO set = 2 hard sets, only on the last machine or isolation exercise (INFERRED; VOL-15). The engine **steers on the coach count** and also stores the **Pelland count** (indirect sets 0.5) for research (PROPOSED). Reps are stored as text, never numbers or dates (OBSERVED). **What the glute rule does**: with every compound at 0.25, a physique plan reaches its glute start only with direct glute work (hip-thrust family or Focus slots); 03 recomputed all 61 observed program views (only glutes change: hypertrophy-family median 9 → 6).

### 5.3 Starting table (aesthetics / hypertrophy; coach count; `12 > starting_table`)

| Muscle | Class (CAT-02) | Fill policy | L1 start | L2 start | L3 start | Cap L1 / L2 / L3 | Priority start add / cap | Tag |
|---|---|---|---|---|---|---|---|---|
| Quads, hamstrings (hinge + leg flexion), glutes, chest, lats/upper back | big | target (field athletes: glutes by credit) | **10** | **15** | **20** | **14 / 22 / 25** | +4 / +4 / +6; cap **18 / 26 (chest 26-28) / 30** | starts VOL-01; caps and priority caps **R2-VOL-06 (APPROVED, customizable)**; L3 start (low end of "20+") and the add split PROPOSED |
| Side delts, biceps, triceps | small | target (field athletes: credit) | **10** | **12** | **15** | **14 / 22 / 25** | +4 / +4 / +6; cap 18 / 26 / 30 | L2-L3 starts **R2-VOL-04 (APPROVED)**; L1 10 by the floor (**R2-VOL-06**); same caps as big muscles INFERRED from "the little muscles also grow the same idea" |
| Calves | small | target | **3 sets every leg day, at least 10 a week** | same | 3-4 per leg day, at least 10 | 14 / 22 / 25 | +4; cap 18 / 26 / 30 | VOL-17; floor R2-VOL-06; the 10-a-week top-up PROPOSED |
| Rear delts | small | target (own sets) | **4** own | **6** own | **8** own | 8 / 12 / 16 | +4; cap 12 / 16 / 20 | own sets 4 / 6 / 8 **R2-VOL-04 (APPROVED)**; caps PROPOSED; **floor read on the SHOULDERS/TRAPS group (flagged)** |
| Abs / obliques | small | core block | **2 exercises × 2 sets per session, first, short of failure** | same | same | 16 / 20 / 20 | - | VOL-17, ATH-11; **R2-SES-03** |
| Front delts, traps, forearms, adductors, neck | unplaced | floor: credit only, reported, never filled | - | - | - | - | direct slot only if chosen | CAT-02 gap; PROPOSED |

**The floor of 10 (COACH-R2 R2-VOL-06).** Every **target** muscle starts at 10 or more in any training block, after the goal and phase factors. **Not floored**: maintenance phases, pre-season and in-season blocks (maintenance by his own definition, PER-01, R2-PER-06), a pain-reduced muscle (VOL-03 wins), credit-only muscles of field athletes (UNI-02) and floor muscles (INFERRED reading; round 3 R3-VOL-01). Calves reach 10 by 3 sets per leg day plus a fourth set (or the optional-day 'Calves' slot) with fewer than 4 leg days (PROPOSED). Abs reach 10+ through the core opener at 3+ sessions a week. Consequence in the templates (05 §8.7.1, INFERRED time model): at 2 sets per exercise, 2-3-day plans, upper/lower weeks and the CrossFit-style class leave some muscles at 2-9 weekly sets; the engine lifts them in week 1, so those first days run about +2-4 min in most 4-6-day plans and +10-25 min (up to ~39) on the longest day of 2-3-day plans.

**Rear delts vs the floor (flagged).** He approved 4 / 6 / 8 rear-delt sets of their own (R2-VOL-04) and also said nobody needs less than 10 per muscle (R2-VOL-06). v1.1 keeps 4 / 6 / 8 direct sets and checks the floor on his **SHOULDERS/TRAPS** muscle group (his FOCUS header joins the delts): side-delt work (10 / 12 / 15) plus rear-delt work plus face pulls is well above 10 (INFERRED). Rows also give rear delts 0.25 a set, so their own count reaches 5-7 at L1. Round 3 asks (R3-VOL-01).

**Goal, phase and population modifiers** (multiply the starts, round half up, then the floor of 10; `12 > goal_phase_modifiers`; factors PROPOSED unless tagged):

| Situation | Lower | Upper | Small | Notes | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding | 1.0 | 1.0 | 1.0 | same-pattern pairing allowed; 4 aerobic sessions, adjustable | VOL-01, UNI-06; R2-SES-06 |
| Strength / powerlifting | 1.0 | 1.0 | 0.75, then floor 10 | preference moves reps on big lifts; 2 easy (Orange) aerobic | VOL-12; R2-ATH-06 |
| General fitness, weekend-warrior athletic, **"stay athletic and active"** (rec pickleball, HYROX for fitness, rec leagues ...) | 0.8 | 0.8 | 0.8, then floor 10 | 45-60 min (longer on full-body days); cross-pattern; athletic work from the activity's 04 profile | UNI-09, UNI-06, ATH-13; COACH-CHAT 2026-10-08 |
| Fat loss | 0.8 | 0.8 | 0.8, then floor 10 | + 3 aerobic sessions, adjustable; standalone fat-loss blocks use the normal stairway (the v1 "≤ 3 % in a deficit" is retired); in the year's Q1 cut the sets stay at the starting level | ATH-07; R2-SES-06, R2-PER-01 |
| Bootcamp | timed circuits, not set-based | | | two circuits of 4-6 stations, 3 rounds × 35-50 s, 35-45 min, every muscle group 2 stations | PRG-03; R2-SES-05 |
| Field/court athlete off-season | 0.7 | 0.5, **then floor 10** | credit only | resistance is 3-4 exercises after core, plyo and Olympic work; the floor lifts trained chest and back from 7.5 to 10 at L2 (flagged) | VOL-08, VOL-17, UNI-02; R2-VOL-06 |
| Strength-type athlete off-season (linemen, wrestlers, rugby, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6, then floor 10 | "more resistance" group | ATH-03 |
| Athlete pre-season | about **0.6 of off-season sets**, flat | | credit | 4-6 weeks, more speed and power, 1-2-week taper; not floored | **R2-PER-06 (APPROVED)** |
| Athlete in-season | 0.4-0.5 | 0.3-0.4 | credit | 2 days/week, flat; game-heavy sports: gym plyos ~half, no extra COD, sprints only for speed athletes, hard day ≥ 48 h before a game | PER-08, UNI-10; **R2-ATH-07** |
| Boxer / striker, high-punching weeks | as profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | **reduce, never cut** | ATH-04 |
| Older adult (60+) | as goal | as goal | as goal | stairway steps capped at 3 % (PROPOSED: an age rule, not a lifestyle input); extra volume on constraint 4-5 machines; **no Olympic lifts, plyos or depth jumps by default** (opt-in with his warning); maintenance ≥ 70 % | EQ-03, EQ-04; **R2-ATH-08**; SCIENCE Borde 2015, Fragala 2019, Bickel 2011 |
| Youth | as goal | as goal | as goal | Olympic lifts from the floor from about 14, after one block of hang work | **R2-ATH-08** |
| Sex | - | - | - | **no sex-based rules** | ATH-09, GEN-02 |

### 5.4 The stairway: planned weekly steps, and how a check-in changes them

**His rule** (R2-PER-03, R2-PER-04, R2-PER-05; VOL-04, VOL-05): every plan climbs "like steps up a stairway"; the step is a % of each muscle's weekly sets, one rule for every person; his 3 / 5 / 7 % vocabulary (VOL-04, R2-VOL-01) supplies the numbers.

**(a) The planned stairway (the math; 12 §3.7.1; numbers PROPOSED)**

```
halfway week          h = ceil(N / 2)                                   (N = weeks in the training block)
standard step into w  s_w = 3 %  if 2 <= w <= h      ("a little bit smaller")
                      s_w = 5 %  if h <  w <= N      ("a little bit higher, but not too much")
planned growth        G(N) = product over w = 2..N of (1 + s_w)
scale factor          lambda = 1 if start x G(N) <= cap; otherwise lambda in (0, 1) solves start x product(1 + lambda s_w) = cap
                      (every step of that muscle shrinks by the same factor so its planned peak lands on its cap in week N)
planned target        T(1) = start;  T(w) = T(w-1) x (1 + lambda s_w)
whole sets            add one set each time T(w) - current sets >= 1   (VOL-06)
limits                planned step <= 7 %; other muscles <= 3 % while a priority runs (R2-VOL-06);
                      older adults (60+) <= 3 % (PROPOSED); total weekly resistance sets strictly below +10 % (UNI-05)
```

| Plan length N | Halfway week | Step into weeks 2..h | Step after h | Growth G(N) at standard steps | Stair level by week (2 → 11, display) |
|---|---|---|---|---|---|
| 4 | 2 | 3 % | 5 % | × 1.136 | 2 · 4.1 · 7.5 · 11 |
| 6 | 3 | 3 % | 5 % | × 1.228 | 2 · 3.3 · 4.6 · 6.7 · 8.9 · 11 |
| 8 | 4 | 3 % | 5 % | × 1.328 | 2 · 2.9 · 3.9 · 4.8 · 6.3 · 7.9 · 9.4 · 11 |
| 10 | 5 | 3 % | 5 % | × 1.437 | 2 · 2.7 · 3.5 · 4.2 · 4.9 · 6.1 · 7.4 · 8.6 · 9.8 · 11 |
| 12 | 6 | 3 % | 5 % | × 1.554 | 2 · 2.6 · 3.2 · 3.8 · 4.4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 |
| 16 | 8 | 3 % | 5 % | × 1.817 | 2 · 2.4 · 2.9 · 3.3 · 3.8 · 4.2 · 4.7 · 5.1 · 5.8 · 6.6 · 7.3 · 8 · 8.8 · 9.5 · 10.3 · 11 |

**Planned weekly sets (no check-in; whole sets; recomputed with the team venv for this file, identical to 12 §3.7.1 and 06 §7.1-7.2):**

| Plan | Muscle (start → cap) | λ | Early / late step | Weeks 1 → N |
|---|---|---|---|---|
| 12 wk | L1 big / small 10 → 14 | 0.76 | 2.28 % / 3.80 % | 10 · 10 · 10 · 10 · 10 · 11 · 11 · 12 · 12 · 12 · 13 · 14 |
| 12 wk | L2 big 15 → 22 | 0.87 | 2.60 % / 4.33 % | 15 · 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 |
| 12 wk | L3 big 20 → 25 | 0.50 | 1.50 % / 2.51 % | 20 · 20 · 20 · 20 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 25 |
| 12 wk | L2 small 12 → 22 | 1.00 | 3 % / 5 % | 12 · 12 · 12 · 13 · 13 · 13 · 14 · 15 · 16 · 16 · 17 · 18 |
| 12 wk | L3 small 15 → 25 | 1.00 | 3 % / 5 % | 15 · 15 · 15 · 16 · 16 · 17 · 18 · 19 · 20 · 21 · 22 · 23 |
| 12 wk | L2 rear delts 6 → 12 | 1.00 | 3 % / 5 % | 6 · 6 · 6 · 6 · 6 · 6 · 7 · 7 · 8 · 8 · 8 · 9 |
| 12 wk | L2 priority 19 → 28 | 0.88 | 2.63 % / 4.39 % | 19 · 19 · 20 · 20 · 21 · 21 · 22 · 23 · 24 · 25 · 26 · 28 |
| 12 wk | L3 priority 26 → 30 | 0.32 | 0.96 % / 1.60 % | 26 · 26 · 26 · 26 · 27 · 27 · 27 · 28 · 28 · 29 · 29 · 30 |
| 8 wk | L1 big / small 10 → 14 | 1.00 | 3 % / 5 % | 10 · 10 · 10 · 10 · 11 · 12 · 12 · 13 |
| 8 wk | L2 big 15 → 22 | 1.00 | 3 % / 5 % | 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19 |
| 8 wk | L3 big 20 → 25 | 0.78 | 2.35 % / 3.91 % | 20 · 20 · 20 · 21 · 22 · 23 · 24 · 25 |
| 8 wk | L2 priority 19 → 28 | 1.00 | 3 % / 5 % | 19 · 19 · 20 · 20 · 21 · 22 · 24 · 25 |

A 12-week L2 big muscle goes 15 → 22 with its last four weeks at 19, 20, 21, 22 ("brutal"); an L3 needs only +25 %, so its steps are half-size; an 8-week plan starts at the normal start (no "start hard") and gives less growth volume than twelve weeks. **L1 note (flag):** on 12 weeks an L1 muscle adds its first set in week 6, so the early "steps" show in reps, load and RIR, not sets. **Total check:** every L1 muscle starts at 10 and releases together, so the L1 total would hit +10.0 % in week 6 (12 weeks) and week 5 (8 weeks); the **release staggering** (smallest banks wait one week, PROPOSED) keeps it strictly below 10 %.

**(b) "Start at a 2, end at an 11" (R2-PER-05)**: how the week feels (overall volume and loading), not the set count. Each week shows a stair level `level(w) = 2 + 9 × A(w) / A(N)`, where A adds 1 per early step and 5/3 per late step (display PROPOSED). Planned effort drifts **inside his 1-3 RIR band**: 12 weeks: weeks 1-6 3 RIR, 7-9 2 RIR, 10-11 1-2 RIR, week 12 1 RIR + intensifiers (MYO on the last machine/isolation, supersets): "a little bit past your limits". Lifters already at their caps get the 11 from heavier loads, intensifiers and a rotating priority muscle up to 30 (APPROVED proposal). **Flag**: VOL-13 said "1-3 RIR, no planned RIR ramp"; this drift stays inside 1-3 but is planned (PROPOSED; R3-VOL-04).

**(c) The optional weekly check-in: effort, completion and pain only (R2-VOL-01 approved; life column removed by R2-GEN-04)**

| This week's check-in | Next week's step | His approved number (late half) | Tag |
|---|---|---|---|
| Effort mostly 1-6 ("too easy") | the planned step **+ 2 points**, max 7 % | +7 % | R2-VOL-01 |
| Effort mostly 7-8 ("That was tough" / "That was perfect") | the planned step | +5 % | R2-VOL-01 |
| Effort mostly 9 | **hold** (0 %) | hold | R2-VOL-01 |
| Any "10 - I'm done" (= the max I could do, successful) | **hold**, and remove 1 set from the day it happened (that exercise); that muscle's planned target drops by the removed set (PROPOSED) | hold, -1 set | R2-VOL-01, R2-VOL-02 |
| "Couldn't do it" on an exercise (the failed set) | one level down or an assisted version next week, sets unchanged | - | GEN-05; R2-VOL-02 ("we can add a fail"); 13 N-PROD-19 |
| Under half the planned sessions done | **repeat the week** (the stairway waits; the block becomes one week longer, PROPOSED) | repeat | R2-VOL-01 |
| 'Felt a PAIN' | pain protocol (§5.7); that muscle 0 % | - | VOL-03 |
| **No check-in** | **the planned step** (the plan does not change) | - | **R2-VOL-03** |

Always: never more than 7 % in a week; other muscles ≤ 3 % while a priority runs; total weekly resistance sets strictly below +10 %. **Read against the stairway**: in the first half the same rows give +3 % ("perfect") and +5 % ("too easy"), because those weeks' steps are "a little bit smaller"; from the halfway week the rows give exactly his table (PROPOSED; R3-VOL-04). "Effort mostly" = the median of the session ratings; a single 10 is handled first.

**The life column is removed (flag, R3-VOL-02).** His approved table also had "+5 % if life was harder", "+3 % if life was harder", "+3 % only if life was better" and "life much harder (sick, travel, no sleep): hold". He then rejected lifestyle inputs: "I just need the workouts here. There's no need to talk about sleep or stress or anything else" (R2-GEN-04, NOT RIGHT). The later, more specific answer decides the life cells: **the step is decided from effort, completion and pain only.** A person who was ill simply logs fewer sessions (repeat the week) or high effort (hold).

**How effort is read (R2-VOL-02, PARTLY).** '8 - That was perfect' = "I hit the target the plan gave me"; '9 - That was terrible' = harder than planned; **'10' = "That was the max I can do, not a fail ... I gave it all I had, but it was successful"** (0 RIR); a set that could not be completed is "Couldn't do it" (his own HOW IT FELT option).

**(d) Ceilings.** Planned step ≤ 7 % (R2-VOL-01); total weekly resistance sets strictly below +10 % (UNI-05; exempt, PROPOSED: the first week after a recovery week or a maintenance phase, and block-boundary swaps that add no sets); a hand-set step by the coach (or a client he allows) runs 0-7 %; 10 % is never offered as a step.

**(e) Retired by round 2.** The readiness score R = 0.40 effort + 0.20 completion + 0.20 performance + 0.20 life and its bands (life rejected, R2-GEN-04); the planned rate before logs (5 % default; 3 % for high stress, under 6 h sleep, a physical job, 60+, layoff or pain) and the intake recovery question F42 (R2-GEN-04, R2-VOL-03; age and pain keep their own rules in §5.3 and §5.7); "7 % only once logs earn it"; target-seeking; the 12-week acclimation cap (≤ 3 %) and the 8-week weeks-1-4 cap (≤ 5 %) with its × 1.10 start (R2-PER-03, R2-PER-04); the "hold 2 weeks in a row → deload next week" gate and every triggered mid-block deload (R2-VOL-07).

**SCIENCE behind a person-based, gradual step**: autoregulated loading works as well as fixed percentages (Hickmott 2022); people misjudge RIR by about one rep, so effort is used as a trend (Halperin 2022); at 15-20 sets, 3 % ≈ +0.5 set/week and 5 % ≈ +0.8: about RP's "+1 set per week" at the top end; big jumps (+30-60 %, Barsuhn 2024; +4-6 sets every 2 weeks, Enes 2023/24) add strain without reliably adding growth; the "10 % rule" in other sports is weakly supported (Nielsen 2013; Gabbett 2016 vs Impellizzeri 2021): a sensible ceiling, not a target.

### 5.5 Banking and placement (where each new set goes)

```
week 1:  T[m] = start[m]
every week w (stairway week; a repeated week does not advance it):
    T[m] = min(cap[m], T[m] x (1 + step[m, w]))        # planned step, or the check-in row (5.4c)
    while T[m] - weekly_sets[m] >= 1 and weekly_sets[m] + 1 <= cap[m]:
        if the person's total would rise >= 10 % this week: stop (smallest banks wait)        # UNI-05
        if not place_set(m): break                                                            # no room: bank waits
    if weekly_sets[m] >= cap[m]: progress load / reps / intensifiers instead
    a hold leaves T unchanged; a '10' removes one set and lowers T by one (PROPOSED)

place_set(m):
    1 day:          alternate the days that train m as a main mover; when a day type runs twice a week:
                    day A's first exercise, then day B's first exercise                                    # R2-VOL-08 default (not understood)
    2 laterality:   bilateral share > 3 points below target -> a bilateral exercise; > 3 above -> unilateral   # PROPOSED (UNI-02 x VOL-07)
    3 in the day:   the first exercise (session order) whose sets < the first exercise's sets; if all equal, the first   # VOL-07
    4 limits:       sets per exercise <= 4 (L1) / 5 (L2-L3), isolation <= 4, minimum 2;
                    m's sets per session <= 11 fractional (priority 14); session minutes <= the client's limit   # PROPOSED; SCIENCE ~11
    5 no room:      superset the lower/upper pairs if that frees the time                                     # ORD-05
                    small muscle -> bonus exercise (2 sets, same category) on the optional day first (Focus slot);
                                    else on a day that already trains that muscle group (its 2nd-4th exercise), never as its only one   # VOL-07, R2-SES-05
                    big muscle   -> Focus slot (2 sets) on the optional day, else a day that already trains the region   # ORD-11
                    else the bank waits; progress by load, reps, MYO (last machine/isolation), supersets                  # VOL-15
    6 hard rules:   light core opener first; hip + push / knee + pull; heavy squat and heavy deadlift on different days;
                    row before pulldown; power before strength; no bands; exercises fixed inside the exercise block   # R2-SES-01..03, UNI-11, ORD-01, ORD-03, EQ-01, PER-02
```

**Computed check** (team venv): the in-day rule gives exactly his sequence **2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 → 4/4/3**. The chat example "chest 20 → 22" is a +10 % week; on the stairway an L2 lifter reaches it over several weeks (12 v1.1 recomputed: 20 → 21 in week 3, 22 in week 5 in its worked chat check). **The stairway does not restart at an exercise-block boundary** (weeks 5 and 9 on 12 weeks): it runs through the whole plan (INFERRED from R2-PER-04, R2-VOL-07).

**R2-VOL-08, re-asked in plain words (R3-VOL-03).** Example: a 4-day plan has "Day A" on Monday and Thursday. When the engine adds one more back set, does it go to Monday's first back exercise this week and Thursday's first back exercise the next time, so both days stay even? And when biceps need 2 extra sets but every training day is full, do they go on the optional Saturday as a bonus exercise, or onto a day that already trains biceps?

### 5.6 Session limits and the time model

| Limit | Value | Tag |
|---|---|---|
| Resistance exercises per session | 45 min ≈ 5, 60 ≈ 6-7 ("usually 7"), 75-90 ≈ 8-9 | VOL-08, VOL-16 |
| **Full-body days** | **every muscle group trained that day gets 2-4 exercises, never 1**; the day "might be a little longer"; full-body days grow to 7-10 resistance exercises (L1 4-day full body ≈ 55-80 min, L2 77-90 min) | **R2-SES-05 (PARTLY)**; minutes INFERRED |
| Muscle groups for that rule | his FOCUS headers; the 05 templates count glutes + hamstrings as one "hips" group and delts + traps as "shoulders" (INFERRED; 12 lists glutes and hamstrings apart); calves keep one exercise × 3 sets per leg day; core = the opener; a field athlete's credit-only muscles are not "trained that day" | INFERRED; R3-SES-01 |
| Where a muscle cannot get 2 exercises on a day | train it on fewer days with 2 exercises each rather than 1 exercise on more days | PROPOSED |
| Field athlete, off-season | **up to 12 exercises + the 2-exercise core block** (2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance + calves); warm-up drills never count; a superset of two small isolations counts as one | VOL-08, VOL-17; **R2-SES-04 (APPROVED)** |
| Session length | athletes, bodybuilders, powerlifters, pros ~90 min (max 120); general / weight loss 45-60 (full-body days 55-80); bootcamp 35-45; non-competitive athletic 60 (PROPOSED); older/injured 45-60 (PROPOSED) | UNI-09, PRG-03; R2-SES-05 |
| Outside the exercise cap, inside the time budget | warm-up, core opener, conditioning finisher | PROPOSED (05 §7.2) |
| Per muscle per session | soft 11 fractional sets, priority 14 | SCIENCE Remmert (~11), RP (8-12); PROPOSED |

**Time model** (PROPOSED; minutes per working set including rest): warm-up 8 per session (ORD-08); core set 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 × bilateral, UNI-09); isolation 1.75 (unilateral 2.5); plyo/ballistic 1.5; Olympic 3.0; throw 1.25; supersetted pair × 0.65; **+ 1.0 min changeover per exercise (0.5 inside a superset pair; new in v1.1)**. Check against his BYOP day 1 (7 exercises, 19 sets, OBSERVED): 8 + 7 + 19 × ~2.3 ≈ 59 min, his 60-minute session. **Capacity with the core opener: 45 min ≈ 5 exercises / 11 sets, 60 ≈ 7 / 17, 75 ≈ 8 / 23, 90 ≈ 9-10 / 29**; supersets add ~25-35 % (v1's 13-14 / 19-20 / 25-26 / 31-32 left out the opener and the changeovers).

### 5.7 Pain and injury

| Trigger | Action | Tag |
|---|---|---|
| Pain area at intake | affected muscle/pattern starts at 50-70 % (the floor of 10 does not apply); its exercises move to constraint 4-5 machines or split grips; painful positions excluded; that muscle's step 0 until 2 pain-free weeks | VOL-03, EQ-03; 2-week rule PROPOSED |
| 'Felt a PAIN' once | next exposure: swap within the category to a more constrained, split-grip or unilateral variant, or one level down; keep the sets if possible; that muscle 0 % that week | UNI-08, GEN-05 |
| Same slot again | that slot -30 to -50 %; removed sets may move to a pain-free exercise for the same muscle | VOL-03; move PROPOSED |
| Third time | drop the exercise for the block; flag for the coach (and "see a professional" in self-serve) | VOL-03 |
| Pain on 2+ exercises in one week, or pain two weeks running / "worse" | the **block-at-risk offer** (keep going, or cancel the block and start a maintenance phase), never an automatic mid-block deload | **R2-VOL-07**; offer PROPOSED |
| Rotation bias | keep external- and internal-rotation positions every week; use the bias to pick a swap when something hurts | **R2-LIB-03** |
| Pain and laterality | shift the bilateral share 20 points toward the pain-free side | UNI-02, EQ-11; 20 points PROPOSED |
| 'Felt the WRONG muscle' | change one variable or one detail in the same category (never an invented exercise); volume unchanged | GEN-05, PER-02; R2-LIB-01 |
| "Couldn't do it" | one level down or an assisted version; volume unchanged (the failed-set answer) | GEN-05; R2-VOL-02 |
| His observed pain text | '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help' (MM 05 A6) | OBSERVED |

### 5.8 His numbers against the research (12 §2.2, §2.11)

| His number | Research | Verdict |
|---|---|---|
| Beginner 10-12 (VOL-01) | top of Pelland 2026's high-efficiency tier; Schoenfeld 2017's best band (10+); floor of Baz-Valle 2022's 12-20 | **Matches** |
| Intermediate 15-20 = "maintenance to some growth" | Pelland intermediate tier (11-18); Aube 2022 best at 18 | **Matches as a productive baseline**; true maintenance needs far less (Spiering 2021, Bickel 2011) |
| Growth 20-25, advanced 20+ | Pelland lower-efficiency tier (19-29) | **Matches for trained people, for limited periods** |
| **Floor 10 "for everybody"** (R2-VOL-06) | Schoenfeld 2017: 10+ weekly sets beat 5-9 for growth; maintenance can need far less | **Matches for growth blocks**; not needed for maintenance (hence the exemptions) |
| **"Most people train 20-30 sets per muscle per week"** (R2-VOL-06) | Surveys: Hackett 2013 (127 competitive bodybuilders: ~16 sets per muscle in one session, mostly once a week; ~30+ for the twice-a-week minority); Baz-Valle 2026 (56 drug-tested elite bodybuilders: 8-17 direct sets per muscle per week); Teixeira 2018 (105 trained gym-goers, helpers counted as full sets: 8 to 50-80 by muscle). Dose-response: Schoenfeld 2019 (most growth at ~30-45), Pelland 2026 (19-29 lower efficiency, 30-42 lowest), Enes 2023/24 (adding +4-6 every 2 weeks from 22 gave no extra growth), RP MRV ranges | **As "what trained people work up to, counting indirect work", 20-30 fits; as "what most people do", it is high** (direct-set surveys ≈ 8-17). His caps already sit inside it (22 / 25; priority 26-30); above 30 the evidence is thin, which supports an opt-in Pro setting. **No number changes.** |
| Priority cap 25-30 (VOL-02) | edge of Pelland lower/lowest tiers; RP chest MRV*P 24-32+ | **Matches for 1-2 muscles** with others held back (≤ 3 %/week, R2-VOL-06) |
| "5 too little, 40 too much" | 5 = Pelland minimum dose; 40 = lowest efficiency | **Matches** |
| "10 %/week too much" | no direct trial; small individual steps favoured | **Supported indirectly** |
| Deload "about half the sets" (PER-05, R2-VOL-07) | Bell 2023 Delphi; Rogerson 2024 (79 % cut sets) | **In the middle of practice** |
| 4-6-week maintenance at 50-70 % | Bickel 2011, Spiering 2021 | **Well supported**; older adults keep ≥ 70 % (PROPOSED) |

Counting note: Pelland counts indirect sets at 0.5; the coach counts helpers at 0.25. For chest, quads, hamstrings and back both counts are almost equal; for glutes, arms and delts the coach count is lower for the same program (hence the dual count, §5.2).

### 5.9 How the engine learns (PROPOSED; 12 §3.14, 13 §7.5)

- **Two delivery modes** (R2-GEN-01, R2-VOL-03): no tracking → the planned stairway, nothing adapts; the optional ~1-minute weekly check-in → next week's step (required for week-by-week). **No sleep, stress, energy or life questions** (R2-GEN-04). Learning uses only people who opt in.
- **Log**: per exercise DONE, reps or "hit target", WEIGHT USED or SCORE, EFFORT (his menu; 10 = successful max), HOW IT FELT (his menu; "Couldn't do it" = failed), pain location; per week sessions done; per block the tests ticked at the start and repeated at the end. Computed: weekly sets (coach and Pelland counts), planned target and λ per muscle, steps used, holds, repeated weeks, "10"s, pain events, adherence, e1RM (Epley), rep PRs.
- **Tune, in order**: each person's step scale (λ) → each person's cap (the weekly sets where lifts stall and holds / "10"s cluster become next block's cap minus 1-2) → each person's next start (× 1.05 after a completed block, the same after a cancelled one) → population tables by level × goal × age band × sport (a cell changes only after ~200+ completed blocks **and with the coach's approval**; no sex-based cells) → helper credit 0.25 vs 0.5.
- **Guardrails the learning can never remove**: planned step ≤ 7 %, total < +10 %/week; no deload or maintenance inside a block; floor of 10 per trained muscle in training blocks; pain protocol; deload ≈ half of the hardest week, between blocks; heavy squat and heavy deadlift on different days; core opener first by default; older-adult defaults (power work only when chosen, with the warning); no bands / variable resistance; priority cap 30 (Pro setting excepted); locked Blaze rules and coaches' added rules (GEN-08). Parameter sets are versioned; research data only from consenting adults (13 §7.5).

### 5.10 Pending (volume)

PROPOSED - PENDING COACH APPROVAL (12 §7, 03, 06): **the stairway numbers** (3 % / 5 %, the λ peak anchoring, the stair-level display) and the check-in read against the stairway (R3-VOL-04); the planned 3 → 1 RIR drift (R3-VOL-04); the life-column drop (R3-VOL-02); rear delts vs the floor and the floor for athletes and maintenance (R3-VOL-01); the R2-VOL-08 default (R3-VOL-03); the "2-4 per muscle" grouping and the field-athlete fit (R3-SES-01); a "10" lowering the planned target by one set; a repeated week making the block one week longer; the block-at-risk offer and its triggers; the same start after a cancelled block; small muscles on the big-muscle caps; the Pro setting (L3, one muscle, up to 35, check-in required); calves to 10 a week; older adults' steps ≤ 3 %; the 1-minute changeover; release staggering; the L3 definition; the priority add split (+4 / +4 / +6); per-session ceilings (11 / 14) and per-exercise maxima (4 / 5); the core counted to abs; V-taper mechanism; heavy low-rep unilateral parameters (UNI-04). **Retired in v1.1**: the readiness score; the before-logs intake rate and F42; target-seeking; acclimation and 8-week phase caps; × 1.10 "start hard"; triggered mid-block deloads; hinge glutes 0.5; KB-swing glute credit; small starts 8 and small caps 12 / 18 / 22; floors 4 / 2. **Retired in v1** (still retired): size-based 3 / 5 / 7 %, helpers 0.5, glutes 1.0 from every hinge/lunge, release chunks of 1-2 sets, round-robin placement, "≤ 2 exercises per muscle per session", the v0 peak-week table and L4, the 0.85 × W1 deload, athletic sets as 0.5 fatigue sets.

---

## 6. Bilateral vs unilateral

The coach called this relationship "very important" (COACH-CHAT). His round-1 answers define it; round 2 did not change the slider itself, but four round-2 answers act on it: the two spine days (R2-SES-01/02: the second squat and hinge days lean on non-axial and single-leg work), "2-4 exercises per muscle group" (R2-SES-05: a day's 2-4 exercises are usually one bilateral + one or two unilateral), the older-adult defaults (R2-ATH-08) and the new sport and activity profiles (COACH-CHAT 2026-10-08).

### 6.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| B1 | **The share runs from 90/10 to 10/90 by athlete**, adjustable, and pain adjusts it. "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." | UNI-02 |
| B2 | **Bodybuilders and powerlifters**: about 50/50 at the start, then 80/20 or 90/10 bilateral as the program drives size and strength. | UNI-02 |
| B3 | **Field athletes with change of direction** (tennis, soccer, basketball, football skill): 80-90 % unilateral in the gym. | UNI-02, UNI-03 |
| B4 | **Upper body follows the same logic.** | UNI-03 |
| B5 | **In season, bilateral work is minimal.** | UNI-10 |
| B6 | **Contralateral load pulls you into the hip** (COD athletes); **ipsilateral helps you out of the hip** (sprint acceleration); for **bodybuilders and powerlifters both are health accessories**, mostly in the first 2-4 weeks. | CAT-13 |
| B7 | **More frontal/transverse unilateral work** for court and combat athletes; little for aesthetics. | UNI-12 |
| B8 | **Same-pattern pairing** drives a muscle harder (high-level athletes, aesthetics); **cross-pattern** keeps bootcamp clients less sore. "This is a rule by goal." | UNI-06 |
| B9 | **10/10 = 1 set**; alternating = unilateral; unilateral progresses like bilateral (the same stairway). | UNI-01, UNI-07, UNI-05; R2-PER-03 |
| B10 | **Unilateral reps are moderate-to-high by default**; heavy low-rep unilateral is an option. | UNI-04 |
| B11 | **Pain swap bilateral → unilateral keeps the sets "ideally, but adjust accordingly".** | UNI-08 |
| B12 | **Unilateral work takes longer and must be accounted for.** | UNI-09 |
| B13 | **'Split stance ALWAYS contralateral'** (his own library rule, G83). | OBSERVED |
| B14 | **The heavy days stay bilateral and spinal, the other lower days do not**: heavy squat one day, heavy deadlift another; leg press, belt squat, hip thrust, back extension, reverse hyper and single-leg DB work fill the other lower days. | R2-SES-01, R2-SES-02 |

### 6.2 The slider (bilateral share of lower-body knee- and hip-dominant compound sets; leg flexion, leg extension and isolation excluded)

| Profile | Block start (wks 1-4) | Later blocks / off-season | Pre-season | In-season | Upper body | Tag |
|---|---|---|---|---|---|---|
| Bodybuilder, powerlifter (L2-L3) | **50/50** | **80/20 → 90/10** by the peak | - | - | same logic: ~50/50 in weeks 1-4 → 80/20-90/10 (upper numbers PROPOSED) | UNI-02, UNI-03, CAT-13 |
| Field/court COD athletes (tennis, soccer, basketball, football skill, hockey, lacrosse, field hockey, ultimate, rugby backs and sevens) | **20/80** | **15/85** (04: 10/90 at block end) | 15/85 | **10/90** | 20/80 | UNI-02, UNI-10 (numbers inside his 80-90 %); new sports INFERRED (04 v1.1) |
| **Recreational COD sports and racket play** (rec soccer, basketball, flag football, ultimate, hockey; rec tennis, pickleball, padel) | **30/70** | **20/80** | - | - | 30/70 | UNI-02 (recreational one step more bilateral than competitive); PROPOSED (04 v1.1 flag F11) |
| Beginner aesthetics / general (L1) | 50/50 | 50/50 → 60/40 in later cycles | - | - | 70/30 | PROPOSED |
| Weekend warrior, "stay athletic and active" without a COD sport (golf, HYROX for fitness, hiking, cycling, lap swim ...), bootcamp | 50/50 (cross-pattern) | 50/50 → 40/60 (04 by activity) | - | - | 60/40 | PROPOSED |
| Sprinters / acceleration, jumpers | 40/60 | 30/70 | 30/70 | 20/80 | 40/60 | PROPOSED (force need + ipsilateral step-ups) |
| Strength-type athletes (linemen, wrestlers, rugby forwards, throwers, judo) | 60/40 → 50/50 | 40/60 | 40/60 | 25/75-30/70 | 60/40 | PROPOSED (ATH-03) |
| Baseball / softball | 50/50 (OBSERVED 4 + 4 sets) | 40/60 | 35/65 | **20/80** (UNI-10 overrides his ~55/45 sheet) | 30/70 (pitchers less overhead) | OBSERVED; UNI-10, ATH-08 |
| Combat (boxing, MMA, karate, taekwondo, kickboxing) | 40/60-30/70 | 30/70-20/80 | 30/70 | 20/80 | 30/70 rotational | PROPOSED |
| Swimming, water polo, rowing, endurance cycling | 40/60-55/45 | 40/60-65/35 | 50/50 | 30/70-50/50 | same logic | PROPOSED (04 v1.1: pushes off the block and wall are bilateral and staggered; strokes are rotational) |
| Older / injured | 60/40 on constrained machines + supported unilateral | | | | 70/30 | EQ-03; numbers PROPOSED |
| Pain | 20 points toward the pain-free side | | | | | UNI-02; 20 points PROPOSED |

Per-profile values for all 127 profiles: `04_profiles.json` v1.1 `profiles[].bilateral_unilateral` (04 §5.11; consistency check C22 holds the recreational COD rule). The coach slider can override any cell (UNI-02 "adjustable").

### 6.3 Inside the unilateral share: contralateral vs ipsilateral (CAT-13; percentages PROPOSED)

| Population | Contra / ipsi use | Default |
|---|---|---|
| COD athletes (football, soccer, basketball, tennis, lacrosse, pickleball, padel) | contralateral to get into the hip and build range; both to get in and out quickly | ~70 % of loaded unilateral sets contralateral |
| Sprinters (100 m) | ipsilateral step-ups for the acceleration take-off ("I need them to get out of the hip really quick") | ~60 % of unilateral sets ipsilateral |
| Bodybuilders, powerlifters, swimmers, rowers | health accessory for hips and low back (rotational forces lost in bilateral training); a swimmer's kick start is a staggered stance (INFERRED) | weeks 1-4 mostly; later only if something bothers them |
| General, weight loss, older | not stated | PROPOSED: alternate contra and ipsi by exercise block (one detail, R2-LIB-01) |
| Split stance | always contralateral (OBSERVED G83) | rule |

### 6.4 Frontal / transverse unilateral share (UNI-12; numbers PROPOSED, 04)

About **45-50 %** of unilateral lower-body sets for basketball, tennis, soccer, MMA, hockey and combat sports, and for pickleball and padel players (lateral first steps); about 10 % for aesthetics and swimmers. Moves: lateral lunge, Cossack lunge, lateral step-up (frontal), rotational lunge, hold-between-knees squat, split-stance contralateral KB swing (ballistic, LIB-20, R2-VOL-05).

### 6.5 Engine mechanics (PROPOSED unless tagged)

1. **Placement filter**: when a big lower (or upper) muscle earns a set, it goes to the bilateral or unilateral group that is more than 3 points off target; then VOL-07 order inside the group (§5.5).
2. **Exercise-block stance swap**: when moving from 50/50 to 80/20 (bodybuilders, week 5) the engine moves sets to bilateral lifts and changes one detail on one or two lifts at the exercise-block change (e.g. Bulgarian split squat → hack squat), keeping the two-spine-days rule (R2-LIB-01, R2-SES-01; 12 example 5.2).
3. **Slot conversion for athletes** (05 §4.5): convert bilateral stations to unilateral stations of the same dominance, starting with the second weekly exposure (the non-axial day), until the share matches; keep at least one bilateral exposure a week off-season unless pain or the season says otherwise.
4. **Equipment swaps that change laterality** are counted on their true side and flagged `laterality_shift` (10 CR-25).
5. **"2-4 exercises per muscle group"** (R2-SES-05) is filled with the share in mind: on a knee + pull day, e.g. squat (bilateral) + split squat or step-up (unilateral) + leg extension.

### 6.6 Evidence

OBSERVED (11 §3.7, 04): his written programs mostly sit near 50 % bilateral; bilateral before unilateral in 225 of 231 sessions. SCIENCE: unilateral training improves single-leg jumps more, bilateral training improves bilateral strength more; sprint and COD differences unreliable (Liao 2022, 14 studies). Contralateral loading raised gluteus medius activity in a dynamic lunge (Stastny 2015); the into/out-of-the-hip vocabulary matches the PRI / Hartman school (07 §1.2).

### 6.7 Pending

Which athletes get same-pattern days (PROPOSED: high-level athletes who need more stimulus, size-focused off-season athletes; R3-SES-01 asks whether the athlete default stays cross-pattern under the 12 cap); a hip-range screen vs sport-only choice of contra/ipsi (PROPOSED: sport only); 50/50 → 80/20 at the week-5 exercise-block change (PROPOSED); COD athletes at 80-90 % unilateral train each bilateral pattern once a week (PROPOSED: yes, at low sets); the recreational COD shares (04 flag F11); every PROPOSED cell in 6.2-6.4.

---

## 7. Training variables

Full version: `11_training_variables.md` / `.json` v1.1 (25 variables, LV / VP / QM rules, worked examples re-run with 12's v1.1 engine) and `10b_equipment_variables_science.md`.

### 7.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| T1 | **Reps by size**: small muscles 12-30 (20s, MAX, MYO); big muscles 5-15, "a mix". **40-rep sets are not a default**: only as an optional CrossFit / AMRAP-style or HYROX-style workout. | VOL-11; HYROX reading INFERRED |
| T2 | **Preference** moves the rep range on **big compound lifts only**; weekly sets stay similar; small muscles stay high-rep. | VOL-12 |
| T3 | **RIR is his effort scale**: 1-3 RIR on every working set; RPE is shown beside it; **MAX = technical failure, only on small-muscle or bodyweight work.** Never to failure on heavy compounds. | VOL-13, GEN-08, PER-09 |
| T4 | **Rest**: hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed. | VOL-14 |
| T5 | **MYO sets only on the last exercise**, machine or isolation. | VOL-15 |
| T6 | **Unilateral lifts moderate-to-high reps** by default; heavy low-rep unilateral as an option. | UNI-04 |
| T7 | **Notation**: '10/10' = 10 per side; '12/10/8 -20' = pyramid then a light 20. | PRG-07, UNI-01 |
| T8 | **VOL 1 / VOL 2 / VOL 3** = one rep phase per off-season block, for all athletes. | PER-11 |
| T9 | **One algorithm** for rep, set and volume rises at every level and model. | PRG-06 |
| T10 | **Exercise blocks of 4-6 weeks**: same exercises inside; the next block changes one or two of grip, stance, implement, range of motion or rep range, never all at once; **a one-detail library variation shown as '<name> - <detail>' is allowed; never an invented exercise.** | PER-02; **R2-LIB-01** |
| T11 | **A/B lead-lift weeks** for people who want variety. | PER-03 |
| T12 | **The second time a slot comes up in a week, it is a different exercise of the same category**; heavy squat and heavy deadlift on different days. | PER-04; R2-SES-01 |
| T13 | **Order**: row before pulldown, always; **'the work' first**; **power before strength**; small muscle first only as a priority; **light core opener first** by default (2 × 2, short of failure), movable; **core supersets or monster sets may be added anywhere**. | ORD-01..04, ATH-11; **R2-SES-03** |
| T14 | **Strength roles**: the work (1 RIR) / the accessory (2 RIR) / the nuance (MAX) / the survival (done no matter what). | ORD-07 |
| T15 | **Supersets are a fatiguing and density tool**. | ORD-05 |
| T16 | **Contrast / French contrast and complexes**: intermediate+ athletes, off-season only, ~78-85 %, no rest inside. | ATH-12 |
| T17 | **Warm-up always** (5 min any cardio + A-drills or mobility); A-drills never volume. | ORD-08 |
| T18 | **Strength template**: main lift 80/80/85/85/90/90 % at RPE 7 → 10; **Olympic**: DB/KB and pull variants keep 4×8 @75 % → 4×6 → 4×6 → 4×4 @90 %; **full squat cleans and snatches 3-5 reps per set with the same weekly reps** (e.g. 6×5), "the coach's eye and how the athlete's feeling to make sure that they're fast and powerful". | PER-09; **R2-ATH-05** |
| T19 | **Speed is a variable, ROM is a variable, load is a variable, volume is a variable**; heavier = slower, lighter = faster. | COACH-CHAT |
| T20 | **No variable resistance** for now. | EQ-12, EQ-01 |
| T21 | **Effort 10 = "the max I can do ... but it was successful"** (0 RIR), not a fail; "Couldn't do it" = the failed set. | **R2-VOL-02** |
| T22 | **Weight guidance in reps-in-reserve words with the RPE number** and a week-1 tip ("pick a weight you could lift 2-3 more times"); **% only with a recent tested best**; if lifts or maxes are not tested, RPE / RIR. **Olympic lifts are explained as power output**; they "don't necessarily need to go by percentage unless you're a competitive Olympic lifter" (competitive weightlifting = its own programming). | **R2-GEN-06** |

### 7.2 The variable stack (v1.1; `11_training_variables.json > variables`)

```
EXERCISE   = pattern · implement/constraint (1-5) · load position + Davidson zone (rotation bias) · load laterality (contra/ipsi)
             · stance/base · grip · feet/body · ROM · end range · plane (incl. core segment) · axial load (two spine days)
             · one detail (F.DETAIL: which hand holds the weight, grip, stance, implement, range; R2-LIB-01)
DOSE       = load · speed/intent · tempo · sets x reps · effort (RIR, planned drift 3 -> 1 inside 1-3) · rest/density/pairing · frequency
ATHLETIC   = force phase · Receive-Create stage · plyo vs ballistic share (ground contact, approved) · Olympic family (clean / snatch day)
             · medball mass · box/hurdle height
CONDITION  = duration · work:rest · pace (Blue A / Green B / Orange C, lactate clearance) · sessions per week (user-adjustable)
RELATIONS  = bilateral:unilateral share (V22) · same/cross-pattern pairing (V24) · weekly spine days (V25) · exercises per muscle group (2-4) · exercise level (derived)
RETIRED    = V17 accommodating resistance (EQ-12)
```

### 7.3 Rep matrix (goal × exercise class; his menu labels; `03 §9.9`)

| Exercise class | Aesthetics / hypertrophy | Strength / powerlifting | Athletic | Fat loss | General / weekend warrior / stay athletic |
|---|---|---|---|---|---|
| Main bilateral compound | '8 to 12 Reps' (L1 '10 to 15'); L2+ may run '12/10/8 -20' | his % template (PER-09); 'the work' at '1RIR'; speed work 'FAST RPE6 or about 60-70%' | VOL 1 → 2 → 3 by block (PER-11); pre-season '1 to 3' - '4 to 6' | '10 to 15' → '8 to 12' | '10 to 15' |
| Machine / stable compound | '15 Reps' / '10 to 15'; MYO only if last | '6 to 8' at 2 RIR | '8 to 12' | '15 Reps' | '15 Reps' |
| Unilateral compound | '8 to 12' per side; heavy '4 to 6' only with the toggle | '8 to 12' per side | '6 to 8' per side, or contrast (L2+ off-season) | '8 to 12' / '10/10' | '10 to 15' per side |
| Big-muscle isolation | '15 Reps' - '20 Reps'; MYO if last | '8 to 12' | '8 to 12' / MYO finisher | '15' → '20' (40 only in the AMRAP style) | '15 Reps' |
| Small-muscle isolation | '15' - '20' (12-30); rear delts '20 to 30'; last set 'MAX' | '8 to 12'; triceps '20 Reps' | '10 to 15' | arms '30' | '15 to 20' |
| Calves (3 sets every leg day) | '15' - '20', last set 'MAX' | '10 to 15' | '8 to 12' heavy single-leg | '15 to 20' | '15 to 20' |
| Core (light opener, 2 × 2) | '10 to 15' or 20-60 s, short of failure | '8 to 12' | by plane; 20-50 s | circuit 30-50 s | '10 to 15' / time |
| Olympic | - | % template only for competitive weightlifting (own program, v2) | L1 + early L2: DB/KB snatch, single-arm DB snatch, KB squat clean, hex-bar jump, hang pull / hang clean 4×8 → 4×4 ramp; L2+ power / hang-power '3 to 5', full squat lifts **3-5 reps** (R2-ATH-05) | - | L1 variants; 60+ off by default |
| HYROX-style stations (stay athletic) | - | - | - | - | by time, distance, reps or calories (sled, wall balls, carries, sandbag lunges, ergs) as conditioning finishers (PROPOSED) |

Preference styles (VOL-12): `volume_lighter`, `balanced`, `heavy_powerlifting`; **weekly sets unchanged**. Rep stores and REPS menu additions (PROPOSED): '1 to 3', '3 to 5', '25 to 30', per side, seconds, metres, contacts, throws, calories, rounds.

### 7.4 Effort (how the client sees it; EN + ES; copy PROPOSED)

| Target RIR | RPE | Plain words |
|---|---|---|
| 3 | 7 | hard; 3 more clean reps were possible |
| 2 | 8 | very hard; 2 more clean reps |
| 1 | 9 | "leave 1 in the tank" |
| 0 ('MAX') | 10 | technical failure (small-muscle or bodyweight last sets only) |

His EFFORT menu ('1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', **'8 - That was perfect'** the bullseye = "I hit the target the plan gave me", '9 - That was terrible' = harder than planned, **"10 - I'm done" = "the most I could do, and I made it"**, R2-VOL-02) and HOW IT FELT ('Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', **"Couldn't do it" = the failed set**) are kept verbatim (OBSERVED LIB AX:AY). Deload sets 3+ RIR (PER-05, R2-VOL-07). Speed work 'FAST RPE6 or about 60-70%'. Plyos, throws, sprints at maximum intent and stopped when quality drops. **The planned RIR of each week follows the stairway inside 1-3 RIR** (12 weeks: 3 RIR in weeks 1-6, 2 in 7-9, 1-2 in 10-11, 1 + intensifiers in week 12; PROPOSED, flagged against VOL-13; R3-VOL-04).

### 7.5 Load-velocity (lightest/fastest → heaviest/slowest; `11 §2`, 10 §5)

| Zone | Examples (OBSERVED) | Load | Dose (PROPOSED / SCIENCE) | Stop rule |
|---|---|---|---|---|
| Max velocity / reactive | ' Max velocity running (top speed)'; squirrel jumps; repeated hops | body mass | contacts 5-10 × 2-4; sprints 10-30 m × 3-6 | contact lengthens, height drops |
| Speed / starting strength | medball passes, rotations, overhead throws; COD 'EASY TURN' → 'HARD TURN' | medball 8-10 lb passes/rotations, 6-10 overhead, 6-8 sit-up, 10-20 slams; **never over 20 lb** (EQ-06) | 1 × 10 per throw | throw slows, head drifts |
| Speed-strength (ballistic) | 'Hex bar squat jumps', 'DB Squat Jumps', KB swings (ballistic, R2-VOL-05) | **10-20 % body weight** (EQ-15) | 3-6 × 3-5 | jump height or speed clearly drops |
| Strength-speed | 'FAST ...' lifts | 'FAST RPE6 or about 60-70%', **straight weight** (EQ-12) | 2-3 × 6-10 | first slower rep |
| Accelerative (Olympic) | 'Hang cleans @ 75%' → '@ 90%' | RPE / bar speed; % only with that lift's own tested best and a coach opt-in | DB/KB and pulls 4×8 → 4×4; **full squat catches 3-5 reps per set at the same weekly reps** (R2-ATH-05); power / hang-power catches 3-5 (INFERRED) | speed loss, catch breaks |
| Contrast heavy member | '78% of 1RM whatever squat immediately into tuck jumps ...' | 78-85 % (ATH-12) | 2-4 heavy + 5 jumps × 3-4 rounds | jump quality |
| Absolute strength | 'the work' '1RIR' | 1 RIR, % template | 3-7 × 1-6 | RIR 1-2 |
| Hypertrophy | '1-3 RIR aka RPE 7+' | RIR | 3-5 × 5-15 (big), 12-30 (small) | RIR 1-3 |
| Local-fatigue machines / isolation | 'LEG PRESS' "local fatigue"; 'MYO SET' | MAX / MYO (last exercise only) | 2-3 × 15-30 | technical failure allowed on isolation/constraint ≥ 4, last exercise |

Retired: the chains/bands zone and band/chain loads stay OBSERVED only (EQ-12). Box and hurdle heights: depth drops low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12 in+ advanced (EQ-16).

### 7.6 Variation policy

- **Inside an exercise block** (4-6 weeks): exercises fixed; only sets, reps, load and RIR move (PER-02). Mid-block swaps only for 'Felt a PAIN', 'Felt the WRONG muscle', "Couldn't do it" or the client's own dropdown choice (GEN-04, GEN-05, EQ-10).
- **Between exercise blocks**: change one or two small variables per slot, never all at once (PER-02); **a one-detail library variation is allowed and shown as '<library name> - <detail>'; the tool never invents an exercise** (R2-LIB-01). Order of smallest perturbation (INFERRED from his ladders): grip → feet/body → stance → load laterality (contra ↔ ipsi) → load position → ROM / end range → implement / constraint → tempo → rep bracket.
- **Within the week**: the second exposure of a slot is a different exercise of the same category; for squats and hinges the non-axial one (heavy squat and heavy deadlift on different days, R2-SES-01).
- **A/B weeks** for clients who tick "I like variety" (PER-03).
- **Conditioning**: never the same colour twice in a week (OBSERVED AE A5), except the approved second easy Orange for aesthetics (R2-SES-06).
- The **stairway does not restart** at an exercise-block boundary (INFERRED from R2-PER-04, R2-VOL-07).

SCIENCE: planned variation can help; random rotation can hurt (Kassiano 2022); RP keeps exercises constant within a mesocycle.

### 7.7 Ordering rules (hard / house / default)

| Rule | Status | Evidence |
|---|---|---|
| Never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped | **hard (GEN-08)** | COACH-ANSWER GEN-08 |
| Light core opener first (2 × 2, short of failure), movable; core supersets / monster sets may be added anywhere | **default + allowed add-on** | ATH-11; **R2-SES-03** |
| Row before pulldown; horizontal push before vertical push | **hard** | ORD-01 |
| 'The work' first, regardless of direction | hard | ORD-02 |
| Athletic / Olympic before strength | hard (contrast excepted) | ORD-03 |
| Plyo / throws / COD / sprint before Olympic | hard | OBSERVED N5 48/51 |
| Bilateral before unilateral (same region) | hard (machine MYO finisher exempt) | OBSERVED R5 225/231 |
| Hip dominant + push, knee dominant + pull in mixed sessions | hard | UNI-11, ORD-06 |
| **Clean-family Olympic lift on squat-pattern (knee) days, snatch-family on hinge-pattern (hip) days** | default | **R2-ATH-04** |
| Heavy squat and heavy deadlift on two different days | **hard** | **R2-SES-01, R2-SES-02** |
| Isolation first only for a priority muscle | default | ORD-04 |
| MYO only on the last exercise (machine/isolation); 'MAX' only on small-muscle or bodyweight work | hard | VOL-15, VOL-13 |
| Speed session order: squirrel jumps → MACH / acceleration starts → max velocity | hard | LIB-21 |
| Landing (receive) before reactive jumping; bilateral before unilateral plyos (Receive-Create stages) | default | CAT-10; R2-ATH-03 |
| Leg extension before leg curl; isolation follows its day; KB face pulls on pull or shoulder days | default | OBSERVED; R2-LIB-04, LIB-10 |
| Conditioning last, except a fighter's/hybrid opening aerobic block or the day's sprint block | default | ORD-09 |
| Constraint rises through the session (free and fast first, machines last) | default | OBSERVED C1 |

### 7.8 Quality of movement (QM rules, 11 §6; INFERRED unless tagged)

A rep counts only if it meets the position and ROM standard ('MAXIMAL UPRIGHT POSTURE' for squats, OBSERVED SQ A9); speed sets stop at the first slower rep; Olympic lifts stop when the bar slows or the catch breaks ("fast and powerful", R2-ATH-05); landings 'Drop & Stick - Hold for 3 seconds' (OBSERVED); load goes up only after 'Felt the RIGHT muscles', EFFORT ≤ 8 and full ROM; a client who cannot hold upright posture in a back- or front-loaded squat goes back to a front-loaded version next exercise block (CAT-04 application).

### 7.9 Pending (variables)

The planned 3 → 1 RIR drift (R3-VOL-04); barbell power / hang-power catches at 3-5 reps (INFERRED); whether a load-position step or a contra → ipsi swap counts as a "small variable" between blocks (INFERRED yes); French contrast 4th member without a reverse band (PROPOSED: bodyweight pogo / repeat squat jumps); speed-lift effort label ('1RIR' vs 'FAST RPE6', open v0 item); whether a superset may pair two exercises for the same muscle for advanced clients (PROPOSED: no, except contrast and finisher pairs); HYROX station dosing (time, distance, reps or calories; PROPOSED, R3-ATH-03); the coach opt-in for Olympic percentages (13 N-PROD-20).

---

## 8. Equipment and constraint

Full version: `10_equipment_model.md` / `.json` (implements, constraint scale, 8 + 2 profiles, substitution lists, client rules CR-01 … CR-35) and 10b. 10 was not re-issued in round 2; the round-2 equipment decisions are applied here, in 02 v1.1 and in the spec.

### 8.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| E1 | **No bands anywhere**; **no variable resistance** (bands, chains, weight releasers) "for now". | EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 |
| E2 | **Intake equipment options**: full commercial gym, basic gym, home gym (rack + barbell + DBs), home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit. | EQ-01 |
| E3 | **Ideal home kit**: adjustable DBs + bench + pull-up bar + 8-10 lb medball. | EQ-02 |
| E4 | **Constraint scale 1-5 approved** (§8.2). | EQ-13 |
| E5 | **Machines are not ranked**; hack squat and leg press are more constrained, the Smith machine less; the **belt squat** is for people who should not be loaded axially (already loaded or sore that week) and is a default **second squat day** option; **GHD / reverse hyper** if available. | EQ-11; R2-SES-02 |
| E6 | **Older, injured and high-volume clients** collect volume "in a safe place with more constraints": compounds and isolation lean machine/cable; **never overhead squat or low-bar squat**; **injured and high-volume clients never snatch or depth jump**; **older adults (60+) get no Olympic lifts, plyos or depth jumps by default, and may switch them on with the warning** "Make sure that you have a fitness professional to help you understand what this means." | EQ-03; **R2-ATH-08** (round 2 wins for older adults) |
| E7 | **A foundational older/injured client may use machines filed MODERATE/ADVANCED.** | EQ-04 |
| E8 | **Seated machine shoulder press** in VERTICAL PUSH (foundational). | EQ-05; R2-LIB-07 |
| E9 | **Medball weights**: slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, passes/rotations 8-10 lb; lighter for youth and older; heavier only for specific uses (medball hang clean, **wall balls for CrossFit / HYROX**); **never over 20 lb**. | EQ-06 |
| E10 | **No medball**: substitute, don't skip. | EQ-07 |
| E11 | **No leg extension / leg curl machine**: swap (no bands). | EQ-08 |
| E12 | **No implement named** → bodyweight → DB → barbell as level rises. | EQ-09 |
| E13 | **Alternatives**: pick by client and the client's own preference. | EQ-10 |
| E14 | **Aerobic work on any tool**; track calories, time or distance. | EQ-14 |
| E15 | **Loaded jumps 10-20 % of body weight**; **box/hurdle heights** per EQ-16. | EQ-15, EQ-16 |
| E16 | **Machines and cables make any position easier.** | CAT-04; R2-LIB-02 |
| E17 | Machines = many reference points → safer → people going up in volume, injured, older; barbells most skilled. | COACH-CHAT |
| E18 | **Home additions approved**: KB curl (KB-only), table row (bodyweight horizontal pull under a sturdy table), floor prone Y / T raises (bodyweight shoulder isolation). | **R2-LIB-07** |
| E19 | **'NO ACCESS' = a self-serve version** (no coach access, full gym library), not a no-equipment program; never infer equipment from a template name. | **R2-LIB-08** |

### 8.2 The constraint scale (approved; EQ-13)

| Level | Definition | Examples | Suits |
|---|---|---|---|
| **5** | seated machine with back pad, fixed path | leg press, leg extension, seated leg curl, machine calf raise, machine row, machine chest press, seated machine shoulder press, bike | older/frail, pain, high-volume finishers, MYO sets |
| **4** | plate-loaded machine, Smith, chest-supported free weight | pendulum, hack squat, Smith machine, lat pulldown, assisted pull-up machine, chest-supported rows, belt squat, GHD | beginners on pulls, volume clients, older/injured |
| **3** | cable, or DB/free weight supported by a bench or floor | cable chest press, DB bench press, box squat, glute bridge, incline (hands-on-bench) push-up, floor core, floor Y/T raises | beginners, hypertrophy accessories, pain regressions |
| **2** | standing free weights | front squat, barbell deadlift, standing DB press, push-up, goblet squat, every loaded lunge, hang pulls and Olympic lifts | strength main lifts, athletes, intermediate+ |
| **1** | bodyweight, ballistic, reactive | pull-ups, handstand push-ups, pistol, push press, KB swing (ballistic), all plyos and sprints | athletes, advanced bodyweight skill |

### 8.3 Client rules (10 `client_rules`; v1.1)

| Client | Main lifts | Accessories | Key rules | Tag |
|---|---|---|---|---|
| Athlete | constraint 1-2 | machines only as the last 1-2 slots | athletic slots at max intent; Olympic lifts for everyone in athletic training, up to 4 × a week (§9.5) | ATH-10; R2-ATH-04 |
| Hypertrophy | 1-2 free-weight lead lifts, then constraint 3-5 | machines + cables ~30-35 % | failure / MYO only on constraint ≥ 4 or isolation, last exercise; **no medball except warm-up** | VOL-15, ATH-05 |
| Strength | barbell, the four roles | DB, machine, cable | speed work with straight weight; powerlifters may add a light technique squat or deadlift | ORD-07, EQ-12; R2-SES-02 |
| Fat loss / bootcamp / general / stay athletic | 2-3 | DB, bodyweight, KB | circuits for bootcamp; HYROX stations as conditioning (PROPOSED) | PRG-03 |
| Older (60+) / injured / high-volume | **4-5** | **4-5** | never OH squat or low-bar squat; injured / high-volume never snatch or depth jump; 60+ power work (Olympic, plyos, depth jumps) off by default, opt-in with the warning; landing drills (step-down and stick) stay | EQ-03, EQ-04; R2-ATH-08 |
| Pain flag | +1 to +2 constraint on that region; split grips; unilateral; pick swaps by rotation bias | | then -30-50 %, then drop | VOL-03, UNI-08; R2-LIB-03 |
| Beginner | front-loaded zone-1 lifts + leg machines; on-ramp pulls; seated or machine presses before standing | | push press foundational, push jerk L2+ | CAT-04, LIB-13; R2-LIB-02 |
| Youth | technique loads | | Olympic lifts from the floor from about 14, after one hang block; lighter medballs | R2-ATH-08, EQ-06 |
| Small-muscle slots | DB first, then cable/machine | | KB face pulls as shoulder work on pull or shoulder days | CAT-02; R2-LIB-04 |
| Leg-flexion slot | seated curl → DB / ball / slider curls → Nordic | | counts as hamstring sets | CAT-09 |
| Everyone | machines not ranked; client preference decides; **never V-squat** | | | EQ-11, EQ-10, GEN-08 |

### 8.4 Access profiles (intake) and gaps (10 §3.1, §3.3; v1.1 home fixes)

| # | Profile id | Kit | Main slots with no as-written option |
|---|---|---|---|
| 1 | `FULL_GYM` | full commercial gym incl. specialty machines | none |
| 2 | `BASIC_GYM` | no specialty machines/bars | none |
| 3 | `HOME_BARBELL` | barbell + rack + plates + bench + DBs | throws, leg extension, cable chops |
| 4 | `HOME_DB_BENCH` | DBs + adjustable bench | throws, **vertical pull** (DB pullover partial; buy a doorway bar), leg extension (DB leg extension on a box), cable chops |
| 5 | `KB_ONLY` | 1-2 kettlebells + household | throws, vertical pull, leg extension, triceps, chops (**KB curl approved**, R2-LIB-07) |
| 6 | `BODYWEIGHT` | floor, wall, stairs, chair, table, towel, outdoor space | throws, **vertical pull and biceps (true gaps)**, leg extension, triceps, chops (**table row and floor Y/T raises approved**, R2-LIB-07) |
| 7 | `HOTEL_GYM` | light-moderate DBs, bench, stability ball, treadmill/bike | throws, vertical pull, leg extension, chops |
| 8 | `FIELD_TRACK_KIT` | medballs, slam balls, cones, mini hurdles, boxes | pulls, leg extension, delts, biceps, triceps, chops |
| derived | `FULL_FACILITY` | full gym + platform/bumpers, turf/runway, hurdles, belt squat, sled | none |
| derived | `FIELD_TRACK_NO_KIT` | runway, steps, turf, nothing carried | throws, both pulls, leg extension, delts, arms, chops |

Removed: `BANDS_ONLY`, band tokens, `HOME_DB_BENCH_BANDS` → `HOME_DB_BENCH`, `BOOTCAMP_OUTDOOR` → `FIELD_TRACK_KIT`, `TRACK_FIELD` → `FIELD_TRACK_NO_KIT` (EQ-01). Add-ons ranked for a bodyweight client by slots unlocked: dumbbells > barbell set > kettlebell > TRX > pull-up bar > medball. HYROX training adds sled, SkiErg, rower and a wall ball when available (PROPOSED; F28 extras). **Never infer equipment from a template name** (R2-LIB-08).

### 8.5 Substitution (v1.1, no bands; 10 §3.4, 10b §9.3)

```
fill_slot(slot, client):
  pool = library[slot.bucket] filtered by kit, eligibility (soft level), population rules (EQ-03 never-list; 60+ power work
         only if opted in, R2-ATH-08), pain filters (rotation bias picks the swap, R2-LIB-03), client exclusions,
         status active (no out_of_scope, no proposed_v1_1 as default)
  if empty: his own 'X or Y' alternates that fit the kit ('Sqats or Leg Press', 'machine or db flies' ...)
  if empty: same pattern, other implement class (machine -> cable -> DB -> KB -> bodyweight); flag level_shift
  if empty and the slot is a machine isolation: the coach's swaps (EQ-08); fallback 'just add 2 more rounds' (OBSERVED)
  if empty: athletic: Olympic -> hex-bar jump -> KB clean / KB swing (ballistic) -> DB snatch -> bodyweight jump (flag intent_shift);
            no medball -> plyo push-ups / fast cable rotations / fake medball slam (EQ-07)
            resistance: nearest pattern (flag pattern_gap) + add the missing item to a buy list
  between exercise blocks: a one-detail variation of the same library exercise is allowed (R2-LIB-01); never an invented exercise
  score: default_candidate (BYOP library first, CAT-07) + his staples + client preference (EQ-10)
         - |constraint - client band| - skill above level - pain penalty + continuity inside the block (PER-02)
  laterality change -> flag laterality_shift and rebalance the bilateral:unilateral share
```

No-equipment fixes: **KB curl (KB-only), table row and floor Y/T raises (bodyweight-only) are coach-approved library items** (R2-LIB-07); DB pullover + extra rows + "buy a doorway bar" note for home DB clients; reverse Nordic, foot-assisted pull-up, eccentric-only Nordic, seated DB calf raise, ball-squeeze dead bug, seated Smith press stay non-library swaps only (R2-LIB-01: library exercises are the main pick; never invented).

### 8.6 Pending (equipment)

Hack squat and pendulum at constraint 4 or 5 (v1: 4, above Smith); which squat fills the second squat day at home or in a hotel with no machines (PROPOSED: a single-leg squat; a goblet squat if not sore, R2-SES-02); the 8 knee-banded FBS items replaced by ball/pad squeeze twins (done; confirm, N-PROD-11); equipment preference as an intake question (F29b, PROPOSED); HYROX kit (sled, SkiErg, rower, wall ball) as add-ons and their substitutes when missing (PROPOSED); 'high rows' = HYROX (INFERRED; R3-ATH-03).

---

## 9. Athletes, every popular US sport, and "stay athletic and active"

Full version: `04_athlete_profiles.md` / `04_profiles.json` v1.1: **127 profiles** (93 competitive, 31 recreational, 3 goal) and 81 position / phase variants, each a weekly set budget per category with season overrides, ground-contact class, aerobic counts, injury rules, sample weeks and rationale; plus the sport picker registry (**52 sports**, 146 position / event / discipline choices), the activity registry (**26 "stay athletic and active" activities**), age overlays and consistency checks C1-C22. Periodization by sport: 06 v1.1 §8.2.5-8.2.7. Session level: 05 v1.1 §8.2, §8.8, §8.9.

### 9.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| A1 | **Plyo vs ballistic is set by the sport's ground-contact time**: long ground time → more ballistics; short → more plyos; both ends always present. | ATH-01, CAT-10 |
| A2 | **Programs start more ballistic and gradually become more plyometric**; **each block starts 15 points more ballistic** than its end share. | CAT-10; **R2-ATH-01** |
| A3 | **Plyo shares by sport (share of jump and throw work that is plyometric by the end of a block), APPROVED**: sprinters 75 %; volleyball, soccer, football skill 60 %; basketball, tennis, football big-skill, weekend warriors 50 %; baseball, softball, hockey, linemen, MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ, golf 25 %. "Your sport ranking is read as fast, bouncy contacts, not total jumps." | **R2-ATH-01** |
| A4 | **Ballistic (longer contact or one big effort)**: squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws (and KB swings). **Plyometric (short, bouncy contacts)**: pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps. **Stick-the-landing drills are the "receive" stage.** APPROVED. | **R2-ATH-02**; R2-VOL-05 |
| A5 | **"Receive-Create stages"** (1 Land, 2 Land & Go, 3 Repeat): 12-week plan weeks 1-3 / 4-7 / 8-12; 8-week plan 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2. APPROVED. Unilateral plyos are harder than bilateral. | **R2-ATH-03**; CAT-10, CAT-11 |
| A6 | **Plyo volume ranking**: basketball ≈ volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf. | ATH-02 |
| A7 | **More resistance (strength/size)**: football linemen, wrestlers, rugby, heavyweight fighters, throwers. **More speed/power**: sprinters, basketball, skill positions, volleyball. | ATH-03 |
| A8 | **Boxers / strikers: reduce pressing and arm volume when punching volume is high; never cut it to zero.** | ATH-04 |
| A9 | **Medball volume**: high for baseball, boxing, MMA, tennis, golf; moderate for basketball and football; **none in the main workout for aesthetics/bodybuilders**. | ATH-05 |
| A10 | **Change-of-direction route names are for every athlete**, tiered by turn angle. | ATH-06 |
| A11 | **Aerobic sessions/week, APPROVED and adjustable by the user**: general / fat loss 3; aesthetics 4 (a second easy Orange) + optional walks; athletes in season 2, pre-season 2; **off-season by sport**: baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4; powerlifters 2 easy (Orange). | ATH-07; **R2-ATH-06, R2-SES-06** |
| A12 | **Pitchers**: less overhead pressing, more arm care, rotational throws kept light. | ATH-08 |
| A13 | **Older adults (60+): no Olympic lifts, plyos or depth jumps by default; "an additional option if they want to do it", with the warning** "Make sure that you have a fitness professional to help you understand what this means." **Youth may lift from the floor from about 14, after one block of hang work.** No sex-based rules. | **R2-ATH-08**; ATH-09 |
| A14 | **Everyone in athletic training gets Olympic lifts**: beginners DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate+ the full scope; **up to 4 × a week**: clean days are squat-pattern days, snatch days are hinge-pattern days ("snatches a little bit more hingy than squatty"). | ATH-10; **R2-ATH-04** |
| A15 | **Full squat cleans and snatches use 3-5 reps per set with the same weekly reps**; DB/KB and pull variants keep his 4×8 → 4×4 ramp; "the coach's eye and how the athlete's feeling to make sure that they're fast and powerful". | **R2-ATH-05** |
| A16 | **Contrast / French contrast / complexes**: intermediate+ athletes, off-season only, ~78-85 %, no rest inside. | ATH-12 |
| A17 | **'Justice League' was a marketing name** for a non-competitive, all-round athletic program (adults, youth and kids). | ATH-13 |
| A18 | **Seasons**: off-season most volume; **pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power, ending with a 1-2-week taper before the first game** (APPROVED; length adjustable); in-season 2 days/week, low volume; post-season recovery. In season bilateral work stays minimal. | PER-08, UNI-10; **R2-PER-06** |
| A19 | **In season, game-heavy sports** (basketball, volleyball, soccer, football, hockey): gym plyos at about half, no extra change-of-direction work, sprints only for speed athletes, the one hard gym day at least 48 hours before a game. APPROVED. | **R2-ATH-07** |
| A20 | **Season calendar from the next season start date (or "in season until") plus practice and game days per week**; the tool works out off-, pre- and in-season. APPROVED. | **R2-GEN-05** |
| A21 | **VOL 1 / 2 / 3 rep phases** one per off-season block, for every athlete. | PER-11 |
| A22 | **High school, college and pro need about the same plan**; pros need more care. | PRG-09 |
| A23 | **Field athletes off-season far from competition: up to 12 exercises + the 2-exercise core block** (2-4 plyo/ballistic, 2-3 Olympic/power, 3-4 resistance); light core first. APPROVED. | VOL-08, VOL-17, ATH-11; **R2-SES-04** |
| A24 | **Athletic work never counts toward muscle sets.** | VOL-10 |
| A25 | **Speed session order** squirrel jumps → MACH drills / acceleration starts → max velocity; medball 'ALL LIST' = 1 × 10 per throw. | LIB-21, LIB-22 |
| A26 | **Strength/aesthetics need bilateral drive; field/COD athletes 80-90 % unilateral.** | UNI-02, CAT-13 |
| A27 | **Recreational sport → the activity only (no position, no season); competitive → sport, position, season start date, practice and game days.** | GEN-02; R2-GEN-05 |
| A28 | **Every popular US sport is in the picker, swimming included; gen pop who "want to stay athletic and active" (pickleball, HYROX ...) get their own door.** | **COACH-CHAT 2026-10-08** |
| A29 | **Competitive Olympic weightlifting is its own programming** (percentage-based, "completely different but kind of the same"). | **R2-GEN-06** |

### 9.2 The ground-contact model (04 `ground_contact_model`; shares APPROVED, classes of unnamed sports INFERRED/PROPOSED)

| Class | Ground contact | Sports he named (R2-ATH-01) | Other sports placed by the same rule (04 v1.1; INFERRED / PROPOSED) | Plyo share, block end | Block start |
|---|---|---|---|---|---|
| 1 very short | ~0.10-0.16 s (sprinting, bounding, repeated hops) | sprinters | 400 m, hurdles, long / triple jump, middle distance, distance and cross-country runners, triathlon, run for fitness | **75 %** | 60 % |
| 2 short | ~0.15-0.25 s (fast SSC: approach jumps, first steps, sharp cuts) | volleyball, soccer, football skill | flag football, lacrosse field players, field hockey field players, rugby sevens, ultimate cutters, high jump, pole vault, gymnastics, cheer flyers / tumblers, competitive dance, figure skating | **60 %** | 45 % |
| 3 mixed | short jumps and cuts mixed with planted pushes | basketball, tennis, football big-skill, weekend warriors | beach volleyball, pickleball, padel, rugby backs, goalkeepers (soccer, lacrosse, field hockey), javelin, freestyle ski / snowboard, HYROX, OCR, youth, most recreational court and field play | **50 %** | 35 % |
| 4 long | planted rotational or pushing actions, well over 0.25 s | baseball, softball, hockey, linemen, MMA | QB, kicker / punter, rugby forwards, cheer bases, throwers, diving, alpine ski, cycling, rec softball / kickball | **40 %** | 25 % |
| 5 very long / grounded | striking from stance, swinging, grappling | boxing, karate, kickboxing, wrestling, BJJ, golf | **swimming** (starts and turns = single big efforts with long contacts = ballistic by R2-ATH-02; v1.1 sport verification moved it from class 4), water polo, rowing, judo, taekwondo, weightlifting, strongman, climbing, hiking / rucking, surf / paddle, rec combat fitness | **25 %** | 10 % |
| - | older adults (60+) | - | power work only when chosen (§9.9) | only if chosen | - |
| - | aesthetics / bodybuilding, powerlifting | - | no plyo block (medball warm-up only for aesthetics) | - | - |

"Power work" = plyometric (short contact) + ballistic (long contact or single effort: loaded/box/broad/squat jumps, medball throws, KB swings); the share is counted over **jump and throw** work (R2-ATH-01). **Block start = end − 15 points** as approved; v1's PROPOSED "floor 20 %" is dropped (04 v1.1 still floors class 5 at 20 %: integration fix, §16.4). Recreational profiles take their activity's class (04 merge decision M-REC-CLASS, flag F5; "a bit of everything" stays 50 %) (PROPOSED; R3-ATH-04). SCIENCE: fast stretch-shortening cycle under ~250 ms vs slow over ~250 ms (Schmidtbleicher; Flanagan & Comyns 2008); sprint contacts ~0.14-0.16 s in acceleration.

### 9.3 Receive-Create stages (APPROVED, COACH-R2 R2-ATH-03)

| Stage | What | Examples | 12-week plan | 8-week plan |
|---|---|---|---|---|
| RC1 **Land** (receive and pause) | absorb and stick, 3 s hold | stick-the-landing, depth drop & stick, 'Push up Stick the Landing' (hands from a box to the floor, LIB-02) | weeks 1-3 | weeks 1-2 |
| RC2 **Land & Go** (receive then create) | stick, then one jump or hop | depth drop to jump, drop into box jump, stick then hop | weeks 4-7 | weeks 3-5 |
| RC3 **Repeat** (repeated receive / create) | continuous rebounds | repeated hops, hurdle hops (taller + continuous = advanced, LIB-04), pogos, bounds | weeks 8-12 at the sport's share | weeks 6-8 |

Rules: restart at RC1 each off-season; hold the current stage in maintenance and pre-season blocks; intermediate and advanced athletes may start at RC2; bilateral before unilateral inside each stage (CAT-10); unloaded before loaded (10-20 % BW, EQ-15); heights per EQ-16; an intermediate athlete takes one plyo from each MODERATE track (LIB-05). Contacts per session stay under NSCA's lower bands (L1 80, L2 100, L3 120); 2-3 plyo sessions a week off-season, 48-72 h apart; masters 3-4 days apart (SCIENCE).

### 9.4 Sport matrix v1.1: every sport in the picker (summary of `04_profiles.json` v1.1; numbers computed from the profiles)

Columns: profiles behind the sport (positions pick the profile); contact class and plyo share at block end; aerobic gym sessions a week off-season (pre-season and in-season 2 for every sport that has a season, except where the sport's practice is the aerobic work = 0); bilateral share block start → block end (in-season); Olympic exposures a week off-season (L1 variants; 60+ off by default); season type (06 §8.2.5: A game-heavy team, B diamond, C meet / championship, D combat with a date, E tournament individual, F endurance / event race, G strength / physique meet or show, H seasonal outdoor). Numbers for sports he named in round 2 follow his approved rows; every other value is INFERRED / PROPOSED in 04 v1.1 (R3-ATH-04).

| Group | Sport | Profiles (positions / events) | Class → plyo end | Aerobic off-season | Bilateral start → end (in-season) | Olympic / wk | Season |
|---|---|---|---|---|---|---|---|
| Team field and court | American football | QB, RB, skill (WR / CB / S), big skill (FB / TE / LB), OL, DL (+ edge), lineman, K / P | 2-4 → 60 % skill, 50 % big skill, 40 % linemen / QB / K-P | 3 | skill 20/80 → 10/90; linemen 50/50 → 40/60 (30/70) | 4 | A |
| | Flag football | one profile (+ QB variant) | 2 → 60 % | 3 | 20/80 → 10/90 (10/90) | 4 | A |
| | Basketball | guard, wing (base), big | 3 → 50 % | 3 | 20-30/80-70 → 10-20/90-80 (10/90) | 4 | A |
| | Baseball | position player, pitcher, catcher, infield, outfield | 4 → 40 % | 2 | 50/50 → 40/60 (20/80) | 4 | B |
| | Softball | position (+ catcher), pitcher | 4 → 40 % | 2 | 50/50 → 40/60 (20/80) | 2 | B |
| | Soccer | goalkeeper, defender (+ fullback), midfielder (base, + wide mid), forward | 2 (GK 3) → 60 % (GK 50 %) | 3-4 | 20/80 → 10/90 (10/90) | 2 | A |
| | Ice hockey | forward (base), defense, goalie | 4 → 40 % | 3-4 | 20/80 → 10/90 (10/90) | 4 | A |
| | Volleyball (indoor) | outside / opposite (base), middle, setter, libero | 2 → 60 % | 3 | 40/60 → 30/70 (20/80) | 4 | A |
| | Beach volleyball | one profile (+ blocker, defender) | 3 → 50 % (sand slows the take-off) | 3 | 30/70 → 20/80 (10/90) | 4 | A |
| | Lacrosse | men's and women's attack, midfield, defense, goalie (+ FOGO, LSM, draw) | 2-3 → 60 % (defense / goalie 50 %) | 3-4 | 20-30/80-70 → 10-20/90-80 (10/90) | 4 | A |
| | Field hockey | field player (+ forward / mid / defender), goalkeeper | 2-3 → 60 % (GK 50 %) | 3 | 20-30/80-70 → 10-20/90-80 (10/90) | 3 | A |
| | Rugby | forwards (+ front row, lock, back row), backs (+ halves, centres, back three), sevens | 2-4 → 40 % forwards, 50 % backs, 60 % sevens | 3-4 | forwards 50/50 → 40/60; backs / sevens 30-20/70-80 → 20-10/80-90 | 4 | A |
| | Cheerleading / STUNT | bases and back spots, flyers and tumblers | 2-4 → 40 % bases, 60 % flyers | 2 | 50/50-30/70 → 40/60-20/80 | 3-4 | A |
| | Ultimate | handler, cutter | 2-3 → 50-60 % | 3-4 | 20/80 → 10/90 (10/90) | 3 | A |
| | Competitive dance / drill (routed) | flyers-and-tumblers profile | 2 → 60 % | 2 | 30/70 → 20/80 | 3 | C |
| Aquatic, endurance and track | **Swimming** | sprint (50-100), middle (200-400 / IM), distance (800-1500 / open water); strokes free, back, breast, fly, IM | **5 → 25 %** | **0** (the pool is the aerobic work; 0-1 adjustable) | 40-50/60-50 → 40-60/60-40 (30-50/70-50) | 2-3 | C |
| | Diving | springboard (base), platform | 4 → 40 % | 2 | 50/50 → 60/40 (40/60) | 3 | C |
| | Water polo | field player, center, goalkeeper | 5 → 25 % | 0 | 40-55/60-45 → 35-60/65-40 | 3 | A |
| | Track and field | sprints, 400, hurdles (+ 400 H), jumps (+ triple), high jump, pole vault, throws (+ hammer), javelin, 800-1500 (+ steeple), distance | 1-4 → 75 % sprints / jumps / runners, 60 % HJ / PV, 50 % javelin, 40 % throwers | 2 (runners 0) | 20-60/80-40 → 20-70/80-30 (10-25/90-75) | 2-4 | C |
| | Cross country and road running | cross country, distance runner (5K-10K, half, marathon, + trail / ultra) | 1 → 75 % | 0 (his Hinshaw half-marathon plan used as-is; no 21.6-mile run) | 20/80 → 20/80 (10/90) | 2 | F |
| | Triathlon | one profile | 1 → 75 % | 0 | 30/70 → 30/70 (20/80) | 2 | F |
| | Cycling | endurance (+ indoor, MTB), sprint (+ BMX) | 4 → 40 % | 0 endurance, 2 sprint | 50-60/50-40 → 50-70/50-30 | 3-4 | F |
| | Rowing (crew) | one profile (+ sweep, sculling) | 5 → 25 % | 0 | 55/45 → 65/35 (40/60) | 3 | C |
| | Skiing / snowboarding | alpine (+ speed, snowboard race), freestyle | 3-4 → 40-50 % | 2-3 | 35-40/65-60 → 30-35/70-65 | 4 | H |
| | Figure skating, skateboarding, surfing, speed skating (routed) | gymnastics / freestyle / alpine profiles | 2-4 | 2-3 | as the routed profile | 2-4 | C / H |
| Combat | Wrestling | one profile (+ Greco, heavyweight) | 5 → 25 % | 4 | 50/50 → 40/60 (30/70) | 3 | C / D |
| | Boxing | one profile (+ heavyweight) | 5 → 25 % | 3 | 40/60 → 30/70 (20/80) | 3 | D |
| | MMA | one profile (+ heavyweight) | 4 → 40 % | 4 | 40/60 → 30/70 (20/80) | 3 | D |
| | BJJ / grappling | one profile (+ no-gi) | 5 → 25 % | 3 | 50/50 → 40/60 (30/70) | 1 | D |
| | Judo | one profile (+ heavyweight) | 5 → 25 % | 4 | 50/50 → 40/60 (30/70) | 3 | D |
| | Karate; Taekwondo | karate (+ kata); taekwondo (+ poomsae) | 5 → 25 % | 3 | 30/70 → 20/80 (20/80) | 1 | D |
| | Kickboxing / Muay Thai | one profile | 5 → 25 % | 4 (his 3-4) | 30/70 → 20/80 (20/80) | 2 | D |
| | Fencing (routed) | tennis profile | 3 → 50 % | 3 | 20/80 → 10/90 | 1 | E |
| Strength and fitness | Powerlifting | one profile | no plyo block | 2 easy (Orange) | 50/50 → 90/10 | 0 | G |
| | Olympic weightlifting | scaffold profile (its own %-based program, v2) | 5 → 25 % | 2 | 60/40 → 85/15 | 4 (the sport) | G |
| | Strongman | one profile | 5 → 25 % | 2 | 50/50 → 80/20 | 2 | G |
| | CrossFit (competitive) | one profile | in WODs | 2 (by level grid) | 50/50 → 70/30 | 4 (power months) | F |
| | HYROX (competitive) | one profile | 3 → 50 % | 4 (race block exception, flag F6) | 40/60 → 30/70 | 2 | F |
| | Obstacle course racing | one profile | 3 → 50 % | 4 (race block exception) | 30/70 → 20/80 | 2 | F |
| | Bodybuilding / physique | one profile (divisions as variants) | no plyo block | 4 incl. a 2nd Orange + walks | 50/50 → 80/20 | 0 | G |
| | Gymnastics | artistic | 2 → 60 % | 2 | 40/60 → 30/70 | 2 | C |
| | Climbing / bouldering | one profile | 5 → 25 % | 2 | 40/60 → 30/70 | 1 | H |
| Racket and club | Tennis | one profile | 3 → 50 % | 3 | 20/80 → 10/90 (10/90) | 1 | E |
| | **Pickleball (tournament)** | one profile (+ senior 60+ variant) | 3 → 50 % | 3 | 20/80 → 10/90 (10/90) | 1 (senior: 0 by default) | E |
| | Padel (tournament) | tennis profile + padel variant | 3 → 50 % | 3 | 20/80 → 10/90 | 1 | E |
| | Golf | one profile | 5 → 25 % | 3 | 30/70 → 20/80 (20/80) | 1 | E |
| | Badminton / squash / racquetball / table tennis; bowling (routed) | tennis; golf profiles | 3; 5 | 3 | as the routed profile | 1 | E |
| Any sport, under 18 | youth athlete overlay | growth-spurt caps, foundational lists, floor Olympic lifts from ~14 after a hang block | as the sport | as the sport | as the sport | as the sport | as the sport |

Coverage check (04 `coverage`, all_present = true): all 45 sports of the coverage list are present with their own profiles (padel as a tennis variant); 8 extra sports are routed to the nearest profile until one is written (INFERRED). Rugby forwards = more resistance (ATH-03); heavyweight fighters move toward "more resistance" by body weight; track throwers have their own profile (class 4 corrects the v1 variant that inherited the sprinter's class).

### 9.4b Dose tiers of the original 27 profiles (04 v1, kept; † = updated by round 2)

| Profile | ATH-03 group | Contact class | Plyo:ballistic (end) † | Plyometric contacts/wk | Throws/wk | COD cuts/wk | Olympic sets/wk | Aerobic off / in † |
|---|---|---|---|---|---|---|---|---|
| Basketball | speed/power | 3 | 50:50 (APPROVED) | T5 100-140 | T2 80-120 | T4 120-160 | 6-10 | 3 / 2 |
| Volleyball | speed/power | 2 | 60:40 | T5 100-140 | T2 60-100 | T2 50-70 | 6-10 | 3 / 2 |
| Football skill | speed/power | 2 | 60:40 | T4 80-110 | T2 60-100 | T4 120-160 | 6-10 | 3 / 2 |
| Football big skill | speed/power | 3 | 50:50 | T3 60-90 | T2 70-110 | T3 80-100 | 8-12 | 3 / 2 |
| Football linemen | more resistance | 4 | 40:60 | T2 20-40 | T2 80-120 | T2 40-50 | 8-12 | 3 / 2 |
| Soccer | speed/power | 2 | 60:40 | T4 70-95 | T1 20-40 | T4 120-160 | 2-6 | 3-4 / 2 |
| Tennis / racket | rotational power | 3 | 50:50 | T3 45-70 | T3 150-200 | T3 100-120 | 2-6 | 3 / 2 |
| Baseball (position) | rotational power | 4 | 40:60 (OBSERVED 36-44 %) | T2 35-60 | T3 170-200 | T1 10-30 | 6-16 | 2 / 2 |
| Softball | rotational power | 4 | 40:60 | T2 35-60 | T3 160-200 | T1 10-30 | 2-6 | 2 / 2 |
| Ice hockey | speed/power | 4 | 40:60 | T2 25-45 | T2 70-100 | T1 20-30 | 6-10 | 3-4 / 2 |
| Golf | rotational power | 5 | 25:75 | T1 0-15 | T3 150-200 | T0 | 2-6 | 3 / 2 |
| Track sprinter | speed/power | 1 | 75:25 | T4 90-120 | T1 40-60 | T0 | 8-12 | 2 / 2 |
| Distance runner | endurance (PROPOSED group) | 1 | 75:25 | T1 10-25 | T0 | T0 | 1-4 | run plan (0 gym) |
| Boxing | combat | 5 | 25:75 (OBSERVED 30 %) | T1 15-30 | T4 190-380 (OBSERVED) | T0-T1 | 9-12 (OBSERVED) | 3 / 2 |
| Kickboxing / Muay Thai | combat | 5 | 25:75 | T2 20-40 | T3 220-260 | T2 35-50 | 4-8 | 3-4 / 2 |
| Karate / Taekwondo | combat | 5 | 25:75 | T1 15-30 | T3 180-220 | T2 55-70 | 2-6 | 3-4 / 2 |
| MMA | combat | 4 | 40:60 | T3 55-80 | T3 150-200 | T2 40-50 | 7-11 | 4 / 2 |
| Wrestling | more resistance | 5 | 25:75 | T2 20-40 | T3 150-200 | T2 40-50 | 6-10 | 4 / 2 |
| BJJ / grappling | combat | 5 | 25:75 | T2 20-35 | T2 80-120 | T0 | 2-6 | 3 / 2 |
| Youth athlete | health | 3 | 50:50 | T2 30-60 | T2 50-80 | T2 35-50 | 2-6 (floor lifts from ~14) | 2 / 2 |
| Weekend warrior | health | 3 | 50:50 (APPROVED) | T3 40-70 | T2 64-96 | T2 48-64 | 6-10 (L1 variants) | 3 / - |
| Powerlifting | size/strength | - | - | T1 | 0 | 0 | 0 | 2 easy Orange (APPROVED) |
| Bodybuilding / aesthetics | size/strength | - | no plyo block | 0 | 0 (warm-up only) | 0 | 0 | 4 + walks (APPROVED, adjustable) |
| Fat loss | health | - | - | 0 | 0 | 0 | 0 | 3 |
| General population | health | - | - | 0 | T1 20-40 | 0-20 | 0-3 | 3 |
| CrossFit competitor / hybrid | size/strength / health | - | - | in WODs | WOD wall balls / slams | 0 | 0-24 by month (OBSERVED) | by level grid |

Tier scales (04 §4): plyometric contacts T1 1-25 … T5 111-150; all jump contacts (NSCA safety check) T1 1-40 … T5 221-320; throws T1 1-60 … T5 421-600; cuts T1 1-30 … T5 181-260. The coach-derived weekly sets of these 27 profiles are unchanged in v1.1 (only aerobic counts, glute credit and the weekend-warrior resistance block rebased on R2-SES-05 changed).

### 9.5 Olympic lifts for everyone in athletic training (ATH-10; R2-ATH-04, R2-ATH-05, R2-ATH-08, R2-GEN-06)

| Item | Rule | ID |
|---|---|---|
| Who | everyone in athletic training; L1 and "beginning intermediates": DB/KB snatch, **single-arm DB snatch**, KB clean / **KB squat clean**, DB/KB high pull, **hex-bar jump**, hang pulls, **hang clean** (no bumpers needed), push press; intermediate+ the full scope (power and hang-power versions, push jerk, Squat Snatch / Squat Clean / Squat Clean & Jerk) | ATH-10, LIB-07, LIB-13; R2-LIB-07 |
| How often | **up to 4 × a week**; **clean family on squat-pattern (knee) days, snatch family on hinge-pattern (hip) days**; jerks either day (INFERRED); observed basis: BASEBALL Block 2 Mon/Thu cleans, Tue/Fri snatches | **R2-ATH-04** |
| Reps | DB/KB and pull variants keep his ramp 4×8 @75 % → 4×6 @80 % → 4×6 @85 % → 4×4 @90 %; **full squat cleans and snatches 3-5 reps per set with the same weekly reps** (e.g. 6×5 @75 %); barbell power / hang-power catches follow the 3-5 rule (INFERRED); stop when the bar slows | **R2-ATH-05**; PER-09 |
| Load | RPE / RIR and bar speed; the plan explains them as **power output** ("move it fast; if it slows down or your technique breaks, it's too heavy"); a % only when that exact lift has a tested best and a coach switches it on (PROPOSED, 13 N-PROD-20); % from that lift's own max | **R2-GEN-06**, R2-ATH-05 |
| Competitive weightlifters | their own percentage-based program type (v2); until then the picker offers the athletic strength-and-power plan (13 N-PROD-17, PROPOSED) | R2-GEN-06 |
| In season | a light piece (2 × 3 hang power clean or DB snatch), dropped in heavy game weeks | R2-ATH-04 (APPROVED proposal) |
| Youth | from the floor from about 14, after one block of hang work | **R2-ATH-08** |
| Older (60+) | **none by default**; an option with the warning (§9.9); injured / high-volume clients never snatch (EQ-03) | **R2-ATH-08**; EQ-03 |
| Without bumpers | hang variants lowered under control; DB/KB; hex-bar jumps | ATH-10 |
| Endurance athletes | a small dose (2-3 sets, 1-2 exposures: hex-bar jumps, hang pulls, KB squat clean) (PROPOSED; 04 aquatic O10) | ATH-10 |

### 9.6 Medball (ATH-05, EQ-06, EQ-07, LIB-06, LIB-22)

Light balls for speed (8-10 lb passes/rotations; 6-10 overhead; 6-8 sit-up; slams 10-20; never over 20 lb; lighter for youth and older); no levels, "just do them right"; dose 1 × 10 per throw, R/L pairs; a throwing slot may be the whole ~19-throw 'ALL LIST'; none for aesthetics except the dynamic medball warm-up; no medball → plyo push-ups, fast cable rotations, fake medball slam. **Medball throws are ballistic** and count in the plyo:ballistic share of jump **and throw** work (R2-ATH-01, R2-ATH-02, APPROVED). Wall balls (HYROX / CrossFit) are conditioning, not muscle sets (PROPOSED, §4.6).

### 9.7 Aerobic work (ATH-07, ORD-09, EQ-14; R2-SES-06, R2-ATH-06)

**Every count below is a default the user can raise or lower** ("I need more cardio ... it just adds it ... less cardio, it takes away", R2-SES-06): the week view has a "Cardio: less · as planned · more" control.

| Population | Sessions/week (default) | Content | Tag |
|---|---|---|---|
| General, fat loss, "stay athletic and active" | **3** | one Blue A, one Green B, one Orange C; a moderate 45-60+ min session of the activity may replace up to 2 of the 3 (PROPOSED, R3-ATH-05) | ATH-07; R2-SES-06 |
| Aesthetics / bodybuilders (the whole physique family) | **4 + optional walks** | Blue, Green, Orange + **a second easy Orange** (long, low); walks 20-30 min easy after workouts | **R2-SES-06 (APPROVED)** |
| Athletes off-season | **2-4 by sport (APPROVED)**: baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4; other sports from their 04 profile (lacrosse, rugby, ultimate 3-4; cheer, gymnastics, climbing 2 ...) | + sprint buy-outs; VO2 work also through supersets (ORD-05) | **R2-ATH-06** |
| Athletes pre-season / in season | **2** | speed/power emphasis; sprints for speed athletes | **R2-ATH-06**, ATH-07 |
| Sports whose practice is the aerobic work | **0 extra gym sessions** (0-1 adjustable): swimming, water polo, running, cross country, triathlon, endurance cycling, rowing | the pool / run / ride / row is the conditioning | PROPOSED (04 v1.1; R3-ATH-01) |
| HYROX / OCR (race-specific block) | **4** (A + B + C + a second C) + 2 station circuits as finishers | running ≈ half of the race; kept at 4 even in the race block (flag F6) | PROPOSED (R3-ATH-03) |
| Powerlifters | **2 easy (Orange)** | | **R2-ATH-06** |
| Fighters | daily | the opening cardio is a real aerobic block | ORD-09 |
| Fat-loss circuits | finisher, not a separate session | rounds 3 → 5, work 30 → 50 s (OBSERVED) | PRG-11 |
| Endurance event | per plan | the Chris Hinshaw half-marathon plan as-is (the longest run; 21.6 miles removed) | PRG-12; R2-LIB-06 |

Any erg works; track calories, time or distance with one unit per block; never the same colour twice in a week (OBSERVED AE A5) except the approved second Orange; level unlock C → C+B → C+B+A → lactate clearance (OBSERVED CrossFit grid); steady cardio ≤ 40 min (OBSERVED). When a user adds a 5th or 6th session, Orange repeats first (PROPOSED).

### 9.8 Seasons (PER-08, UNI-10, PER-11; R2-PER-06, R2-ATH-07, R2-GEN-05; 06 §8.2)

**Calendar.** Competitive athletes give the next season start date (or "in season until", or a competition / fight / meet date) plus practice days and game days per week (R2-GEN-05). The tool works out: off-season blocks (stairways, VOL 1 → 3) → **pre-season 4-6 weeks** ending at the first game → in-season → post-season. The hard gym day sits ≥ 48 h before a game (R2-ATH-07). Meet and race sports (swimming, track, running, triathlon, rowing, skiing) peak at the **end** of the season, so an optional championship / goal-race date sets the taper (PROPOSED, 04 aquatic O4; R3-ATH-01).

| Phase | Resistance volume | Athletic content | Bilateral | Other |
|---|---|---|---|---|
| Off-season | most volume: stairway blocks (field/court lower × 0.7, upper × 0.5 of the gym start, then the floor of 10 for trained muscles; strength-type 0.9 / 0.8) | start ballistic → plyometric; RC1 → RC3; VOL 1 → 2 → 3 one per block; Olympic up to 4 ×/week; contrast L2+ | slider start → end (§6.2) | STARTING / MID / ADVANCED as blocks or levels (PRG-04) |
| **Pre-season** | **4-6 weeks at about 60 % of off-season sets**, flat, not floored | **more speed and power**; sprints; RC stage held | lower | **1-2-week taper before the first game** (1 week for a 4-5-week pre-season, 2 for 6; volume -40-60 %, intensity kept; SCIENCE Bosquet 2007) |
| In-season | 2 days/week, low volume (× 0.4-0.5 lower, 0.3-0.4 upper), flat (0 %) | **game-heavy sports**: gym plyos about half, no extra COD, sprints only for speed athletes, hard day ≥ 48 h before a game; Olympic 2 × 3 light, out in heavy game weeks | **minimal** (10/90-20/80) | 2 aerobic sessions; a heavy game week (3+ games, or 2 + travel) keeps only the light day (PROPOSED) |
| Post-season | recovery and general work (OBSERVED baseball 'wk 8'), then a maintenance phase or general work | arm care, mobility, easy aerobic | - | then the next off-season |

**Season types for every sport (06 §8.2.5).** A **game-heavy team** (football, flag, basketball, volleyball indoor and beach, soccer, hockey [named]; lacrosse, field hockey, rugby, ultimate, cheer, water polo [INFERRED same rule]); B **diamond** (baseball, softball: throws and plyos held at maintenance in season); C **meet / championship** (swimming and diving, track and field, cross country, gymnastics, rowing, wrestling, figure skating, competitive dance: championship taper 1-3 weeks); D **combat with a date** (boxing, MMA, kickboxing, karate, taekwondo, judo, BJJ: off-season blocks between fights; fight prep 6-8 weeks in 2-week steps and waves + 1-2-week taper); E **tournament individual** (tennis, golf, competitive pickleball, padel, other racket sports: a 3-5-day lighter run-in before key tournaments, PROPOSED); F **endurance / event racing** (running, triathlon, cycling, HYROX, OCR, CrossFit competitions: the strength stairway beside the sport's own plan, taper by distance); G **strength and physique** (powerlifting, strongman, Olympic weightlifting [own programming], bodybuilding / physique: meet taper or show prep); H **seasonal outdoor** (alpine skiing / snowboarding, climbing, surfing, skateboarding: a pre-season block before the season, then 2 gym days); I **gen-pop "stay athletic and active"**: no season (§9.10). Extending the game-heavy rule to the INFERRED sports is a round-3 confirmation (R3-ATH-04).

### 9.9 Special populations and sport rules

| Group | Rule | ID |
|---|---|---|
| Boxers / strikers | high-punching weeks: pressing, vertical pulling and arm isolation × 0.5-0.7 (PROPOSED factor), never zero | ATH-04 |
| Pitchers | less overhead pressing, more arm care, light rotational throws | ATH-08 |
| **Older adults (60+)** | **no Olympic lifts, plyos or depth jumps by default; each is an option the person (or coach) can switch on, with the warning "Make sure that you have a fitness professional to help you understand what this means"** (copy C7); by default the "athletic" part is landing drills (step-down and stick, no rebound: the receive stage), balance, reactive stepping without a hop, light medball throws and fast-intent work on machines; **low ankle hops are opt-in** (they are on his plyometric list, R2-ATH-02; stricter reading of the approved proposal, flag F9); never overhead squat or low-bar squat (EQ-03); constrained machines; stairway steps ≤ 3 % (PROPOSED); maintenance ≥ 70 %; submax tests only | **R2-ATH-08**, R2-ATH-02; EQ-03, EQ-04; R3-ATH-02 |
| **Active aging 50-59 (recreational)** | stay-athletic plan with joint-care selection: knee-friendly strength, calf / Achilles work every leg day, posterior cuff, low-impact plyos only (no depth jumps, hurdle hops or bounds by default) (PROPOSED; 04 `age_50_plus`) | R3-ATH-02 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work; lighter medballs; growth-spurt caps; no research data leaves the phone | **R2-ATH-08**; EQ-06 |
| Sex | no rules by sex anywhere | ATH-09, GEN-02 |
| Competition level | high school = college = pro in structure; loads, speeds and care differ; pros: step ≤ 5 %, no true 1RM tests, coach review before each block (PROPOSED) | PRG-09 |
| Weekend warrior | profile `weekend_warrior`: non-competitive athletic adults and youth ("a good mix of everything"); 60 min (PROPOSED); L1 Olympic variants unless experienced | ATH-13, GEN-02 |
| Injury hotspots (04 injury library; new v1.1 codes incl. KNEE_DEGENERATIVE_COURT, SHOULDER_SWIMMER, FALLS_COURT, ACHILLES_CALF) | e.g. GROIN (Copenhagen planks), HAMSTRING (Nordics/slider curls), ACL (landings first), PATELLAR (cap rebounds), SHOULDER_SWIMMER (pull ≥ 1.5 × push, posterior cuff 2-3 ×/week with DB / cable / KB, never bands), KNEE_DEGENERATIVE_COURT (pain-free depth, slow eccentrics, no loaded pivoting under fatigue), NECK (PROPOSED node) | OBSERVED + SCIENCE |

### 9.10 Stay athletic and active (gen pop): pickleball, HYROX and more (COACH-CHAT 2026-10-08; ATH-13)

> "Gen Pop and general fitness people are wanting to do things like high rows and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." (COACH-CHAT 2026-10-08)

**Who and how they get in.** Gen-pop and general-fitness people with no competitive season who want to stay athletic. A goal tile **"Stay athletic and active / Mantenerme atlético y activo"** opens an activity picker (pick up to two; the first leads); people who chose "Lose fat" or "General fitness" also see a one-line link "Do you also play something (pickleball, HYROX, tennis ...)? Add it". No position, no season dates (GEN-02). Optional: play days, and for event-type activities an event date (PROPOSED). The engine family is athletic, recreational branch (13 §13; spec F07 'active', F11r).

**What the plan contains (his non-competitive athletic program as the template, ATH-13; 04 `stay_athletic_standard`):**

| Part of each main day | Dose | Tag |
|---|---|---|
| Warm-up | 5 min any cardio + A-drills / mobility; never counted | ORD-08 |
| Core opener | 2 exercises × 2 sets, light, short of failure; core supersets optional anywhere | ATH-11; R2-SES-03 |
| Some power: jumps | 1-2 stations × 2 sets; plyo vs ballistic by the activity's contact class (each block 15 points more ballistic at the start); Receive-Create stages | ATH-01, CAT-10; R2-ATH-01..03 |
| Some power: throws | 0-1 medball station (more for racket sports and golf); ≤ 20 lb | ATH-05, EQ-06 |
| Some agility | 0-1 change-of-direction station (EASY → MOD. TURN; HARD TURN for L2+ under 60); one light footwork station a week even for linear activities (PROPOSED) | ATH-06 |
| Olympic / triple extension | 1 station × 2 sets on most main days (up to 4 a week): clean variants on squat days, snatch variants on hinge days; L1 = hang clean, KB squat clean, single-arm DB snatch, hex-bar jump, hang pulls; explained as power | ATH-10; R2-ATH-04, R2-GEN-06 |
| Resistance | 2-4 exercises per muscle group trained that day; hip + push / knee + pull; cross-pattern; heavy squat and heavy deadlift on different days; general factor × 0.8, **floor 10**, **stairway** | UNI-06, UNI-11; R2-SES-01/02/05, R2-VOL-06, R2-PER-03/04 |
| Calves and rear delts | calves 3 sets every leg day; rear delts / KB face pulls their own sets | VOL-17; R2-LIB-04 |
| Aerobic | 3 a week (Blue, Green, Orange), adjustable; the activity itself may count (PROPOSED) | ATH-07; R2-SES-06 |

**How much by days** (04, PROPOSED): 2 days → about 4 athletic stations a day + the activity; **3 days = the default for most activities** (4-5 athletic stations a day, resistance on the 05 3-day template: heavy squat day, non-axial hinge day, heavy deadlift day); 4 days = his own weekend-warrior template (2 jumps + 1 throw + 1 COD + 1 Olympic a day, 2 optional days). Weekly ranges across the 18 stay-active profiles: fast plyometric contacts 0-56 (60+ default 0), throws 0-80, cuts 0-56, Olympic sets 0-8 (60+ default 0), aerobic 3 (adjustable 2-5); athletic work ≈ 9-28 % of weekly sets.

**Play days (PROPOSED; R3-ATH-05).** Play or activity days are entered like practice or game days: the hardest gym day sits ≥ 48 h before the heaviest play day; weeks with 3+ play sessions drop the extra agility drills and halve the plyos (R2-ATH-07 logic extended); a moderate 45-60+ min session of the activity can replace up to 2 of the 3 aerobic sessions.

**Event date (PROPOSED; R3-ATH-05).** A first HYROX race, a pickleball tournament, a 10K: the last block's hardest weeks end 1 week before the event, then a 1-week taper at about half the sets, intensity kept. No date → the normal stairway or year.

**The year.** The approved gen-pop year (§11.5) stays the default and is fully tunable: an activity block can be dropped where the user wants it (e.g. a pickleball-season block in spring, a HYROX block before a race) (R2-PER-01, R2-PER-02).

**The activities (spec F11r, 26 entries; 04 v1.1 profiles):**

| Activity | Profile | Class → plyo end | What leads |
|---|---|---|---|
| **Pickleball** | `rec_pickleball` (competitive counterpart `pickleball_competitive`) | 3 → 50 % (PROPOSED) | lateral first steps, split-step reactions, rotation both ways, single-leg control, calves / Achilles, shoulder and elbow care; many players are 50+ (joint-care block) and 60+ (defaults switch on) |
| **HYROX** (fitness / first race) | `hyrox_fitness` (competitive `hyrox_competitive`) | 3 → 50 % (PROPOSED) | 2 strength days (squat + pull / deadlift + push) + 2 hybrid days (run intervals or compromised running + a station circuit); 4 aerobic sessions (A + B + C + a second C); 2 station circuits a week as finishers, not muscle sets; wall balls with the race ball (≤ 20 lb) |
| Tennis; padel; badminton / squash / racquetball / table tennis (routed) | `rec_tennis`; `rec_padel`; → `rec_tennis` | 3 → 50 % | as pickleball, bigger court |
| Golf; disc golf, bowling (routed) | `rec_golf`; → `rec_golf` | 5 → 25 % | rotation, hip and trunk, light throws |
| Rec league (basketball, soccer, softball, flag football, volleyball, ice hockey, ultimate, kickball, other) | `rec_basketball`, `rec_soccer`, `rec_softball`, `rec_flag_football`, `rec_volleyball`, `rec_hockey`, `rec_ultimate`, `rec_kickball`, `rec_league` | the league sport's class | the league sport's demands; no position; COD sports 30/70 → 20/80 bilateral |
| Running for fitness; trail running (routed) | `run_fitness` | 1 → 75 % | tissue capacity, calves / Achilles, single-leg strength; the run is the aerobic work |
| Hiking / rucking | `hike_ruck` | 5 → 25 % | carries, step-ups, eccentric quads |
| Cycling / indoor cycling; mountain biking (routed) | `cycling_fitness` | 4 → 40 % | hips, trunk, upper-body balance; bone-loading jumps (under 60) |
| Lap swimming | `lap_swim` | 5 → 25 % | shoulder care, pulling, legs and bone loading |
| Ski / snowboard season prep | `ski_snow_prep` | 4 → 40 % | eccentric quads, lateral work, a pre-season block before the trip |
| Surf / paddle; kayak / wakeboard (routed) | `surf_paddle` | 5 → 25 % | pulling, pop-up power, shoulder care |
| Dance and fitness classes | `dance_fitness` | 3 → 50 % | landing quality, single-leg control |
| Triathlon for fitness; rowing / indoor rowing | `rec_triathlon`; `rec_rowing` | 1; 5 | the sport is the aerobic work |
| CrossFit-style classes | `crossfit_class` | - | his class model (warm-up → light core → skill → strength / power → WOD) |
| Boxing / kickboxing / martial-arts classes; climbing gym; first obstacle race | `rec_combat_fitness`; `rec_climbing`; `rec_ocr` (added in the v1.1 sport verification) | 5; 5; 3 | rotational throws / antagonist pushing and grip / pulling, grip and carries |
| "A bit of everything" | `weekend_warrior` (his former 'Justice League' program) | 3 → 50 % (APPROVED) | "a good mix of everything" |
| Age overlays (automatic from age) | `active_aging_50plus`, `active_aging_60plus`, `youth_general_athletic` | 60+: power work only when chosen | §9.9 |

**What it is not**: not competitive (no position, no season dates, no pre-/in-season blocks); no contrast complexes by default (L2+ off-season athletes only, ATH-12); not aesthetics (medball throws stay in the main workout); no 1RM or max-mile tests from zero (R2-PER-07); no lifestyle questions (R2-GEN-04).

### 9.11 Swimming (dryland), in short (COACH-CHAT 2026-10-08: "Include swimming as well")

| Item | Rule (04 v1.1 swimming profiles; 06 §8.2.5; 05 sport dial) | Tag |
|---|---|---|
| Profiles | sprint (50-100), middle (200-400 / IM), distance (800-1500 / open water); stroke variants free, back, breast, fly, IM; plus diving, water polo and lap swimming | INFERRED + SCIENCE |
| Week | **3 dryland days (A knee + pull, B hip + push, C full) + 1 optional Focus day**; 2 for younger / lower-level swimmers; pool sessions around them (dryland ≥ 4 h from a hard pool session when possible) | PROPOSED; R3-ATH-01 |
| Aerobic | **0 extra gym aerobic sessions by default** (0-1, user-adjustable): the pool is the aerobic work | R2-SES-06 (adjustable); default PROPOSED |
| Power | **class 5 (25 % plyometric at block end, 10 % at start)**: starts and turns are single big efforts with long contacts (block ~0.7-0.8 s, wall ~0.3 s) = ballistic by his definition; a small ankle block stays for bone; box / squat / broad jumps, streamline squat jumps, overhead and rotational medball throws (4-8 lb) | R2-ATH-01, R2-ATH-02; class INFERRED (flag F10) |
| Olympic lifts | 2-3 exposures a week (hang clean / power clean, single-arm DB snatch; L1 variants); the distance profile avoids the barbell snatch | ATH-10; R2-ATH-04 |
| Strength | strength 45 % / power 30 % / strength-endurance 15 % / hypertrophy 10 %; **pull sets ≥ 1.5 × push sets**; horizontal pull before vertical (ORD-01); rear delts their own sets | INFERRED; ORD-01, VOL-17 |
| Shoulder care | posterior cuff and scapular work 2-3 × a week with DB, cable or KB (side-lying DB external rotation, prone floor Y / T raises, KB face pulls); **never bands** (swim dryland usually uses bands: every band move has a DB / cable / KB swap) | EQ-01; R2-LIB-04, R2-LIB-07 |
| Season | two macrocycles a year (short course Sep-Mar, long course Apr-Aug); off-season dryland stairway blocks → pre-season 4-6 weeks at ~60 % → in-season 2 days → **a 2-week dryland taper lined up with the swim coach's pool taper before the main championship meet; 1 week or none before smaller meets**; swimmers train through early meets | R2-PER-06; SCIENCE Bosquet 2007, Aouani 2024; length PROPOSED; R3-ATH-01 |
| Sport load | yardage is **not** asked (no lifestyle / load inputs, R2-GEN-04); a hard pool week reaches the plan only through the check-in (effort, completion, pain) | R2-GEN-04, R2-VOL-01 |
| Sample plan | "Swimming" is the first of the seven sample plans he will grade (R2-GEN-07): competitive high-school / club / college swimmer, middle-distance default, off-season C12 skeleton (or pre-season when the first meet is ≤ 6 weeks away) | R2-GEN-07; mapping PROPOSED |

### 9.12 Pending (athletes)

Round 3 (`round3_questions.json`): swimming dryland days, aerobic default, class 5 and taper (R3-ATH-01); 60+ defaults incl. low ankle hops and the 50+ racket-player rules (R3-ATH-02); HYROX reading and dosing (R3-ATH-03); classes, aerobic counts and the in-season game-heavy rule for the sports he did not name, and recreational players' class (R3-ATH-04); play days and the gen-pop event date (R3-ATH-05). Still PROPOSED: contact / throw / Olympic tiers; season multipliers; what "more care for pros" changes; COD in baseball; fight-camp complexes vs ATH-12; Olympic weightlifting's own template (04 R3-08); taekwondo class (4 vs 5); medball for sports outside ATH-05; neck work; the new ath03 group "endurance"; HYROX / OCR keeping 4 aerobic sessions in the race block (flag F6); run plans other than the half marathon; Spanish sport, position and activity names (approval line by line, R2-GEN-08).

---

## 10. Session and week templates

Full version: `05_session_architecture.md` / `05_templates.json` v1.1 (27 observed templates as slot sequences; **30 generator split templates for 2-6 days × 6 families, rebuilt by script for R2-SES-05**, each with stored checks: pairing, order, spine days, caps, exercises per muscle group, time). An independent audit of 145 day types found 0 issues; the engine fixture loads all 30 templates and 1,821 stations.

### 10.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| W1 | **Core first, for everyone, as a light opener**: 2 exercises × 2 sets, short of failure, right after the warm-up ("that'll give you a good warm-up"); the user may move it; **coaches and users may add core supersets or monster sets anywhere** ("It should be optional to be thrown anywhere"). | ATH-11, VOL-17; **R2-SES-03** |
| W2 | **Hip dominant + push; knee dominant + pull**, in every session that mixes lower and upper work, full body and bootcamps included. | UNI-11, ORD-06 |
| W3 | **Bootcamp Option 1 Tue/Fri was a mistake**: hinge + push, knee + pull. | ORD-06 |
| W4 | **Two spine days**: **heavy squat one day (Monday), heavy deadlift another day (Friday)**; Tuesday a non-spinal hinge (hip thrust, back extension, reverse hyper); Thursday leg press or belt squat. APPROVED. | PER-04, EQ-11; **R2-SES-01** |
| W5 | **The counted spine list (APPROVED)**: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. **Not counted**: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum: fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. | **R2-SES-02** |
| W6 | **Second weekly exposure of a slot = a different exercise of the same category.** | PER-04 |
| W7 | **Same-pattern pairing** (squat + lunge) to drive a muscle harder; **cross-pattern** (squat + single-leg hinge) for bootcamp and less soreness. | UNI-06 |
| W8 | **Row before pulldown, horizontal before vertical; 'the work' first; power before strength; small muscle first only as a priority.** | ORD-01..04 |
| W9 | **Warm-up always**; A-drills never count as volume. | ORD-08 |
| W10 | **Supersets** = fatigue and density tool. | ORD-05 |
| W11 | **Strength roles**: the work / the accessory / the nuance / the survival. | ORD-07 |
| W12 | **Fighters' and hybrid opening cardio is a real aerobic block.** | ORD-09 |
| W13 | **Optional days** (Calves, Cardio, Core, Focus 1, Focus 2): ideally separate days. | ORD-10, ORD-11 |
| W14 | **Exercises per muscle group on its day: 3-4 on split days; 2-4 on full-body days, never 1** ("so it might be a little longer day. It could start really short ... there's never one exercise"). | VOL-07; **R2-SES-05 (PARTLY)** |
| W15 | **Session size**: resistance 5-7 exercises (45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9), more on full-body days; **field athletes off-season up to 12 exercises + the 2-exercise core block**; warm-up drills never count; a superset of two small isolations counts as one. | VOL-08, VOL-16, VOL-17; **R2-SES-04, R2-SES-05** |
| W16 | **Session length**: athletes, bodybuilders, powerlifters, pros ~90 min (max 2 h); weight loss and everyday clients 45 min-1 h (longer on full-body days). | UNI-09; R2-SES-05 |
| W17 | **Bootcamp** = timed circuits, 3-5 rounds × 30-50 s, 35-45 min; v1.1: **two circuits a day of 4-6 stations** (inside his 5-7), 3 rounds × 35-50 s, so every muscle group gets 2 stations. | PRG-03; R2-SES-05 (application INFERRED) |
| W18 | **Calves 3 sets every leg day; rear delts their own sets; KB face pulls = the second shoulder exercise on knee + pull days.** | VOL-17; R2-LIB-04, LIB-10 |
| W19 | **PPL weekdays are flexible.** | PRG-02 |
| W20 | **Fat Burn circuits are finishers after lifting.** | PRG-11 |
| W21 | **Contrast** stations for L2+ athletes off-season. | ATH-12 |
| W22 | **No medball for aesthetics** except in the warm-up; **COD for every athlete**; **Olympic work in every athletic week, up to 4 days: clean on knee / squat days, snatch on hip / hinge days**. | ATH-05, ATH-06, ATH-10; **R2-ATH-04** |
| W23 | **Aerobic sessions are adjustable up or down by the user**; the week view carries "less · as planned · more". | **R2-SES-06** |
| W24 | **KB swings are ballistic**: in the power block, never in the non-axial hinge pool. | **R2-VOL-05** |
| W25 | **No deload or maintenance week inside a block** (the week skeleton never inserts one). | **R2-VOL-07** |

### 10.2 The session order (v1.1 tiers)

| Tier | Block | Content | Rule / ID |
|---|---|---|---|
| 0 | Warm-up | 5 min any cardio + A-drills (lower/athletic days) or mobility (press days); dynamic medball warm-up (the only medball use for aesthetics) | ORD-08, ATH-05 |
| 0.5 | Skill | CrossFit / hybrid skill work | INFERRED |
| 1 | **Core opener** | 2 exercises × 2 sets, short of failure: one thorax, one pelvis; planes rotate across the week | ATH-11, VOL-17, CAT-08; **R2-SES-03** |
| 2 | Plyo / ballistic / sprint | 2-4 stations for field athletes (2 on a cross-pattern 12-cap day); Receive-Create stage of the week | ATH-01, LIB-21; R2-ATH-03 |
| 3 | Throws | medball (none for aesthetics) | ATH-05 |
| 4 | COD | every athlete, by turn angle | ATH-06 |
| 5 | Olympic / power | before any strength work; clean family on knee days, snatch family on hip days; contrast complexes here for L2+ off-season | ORD-03, ATH-10, ATH-12; R2-ATH-04 |
| 6 | The work + its paired upper lift | main lower lift with its opposite-surface upper lift (hip + push, knee + pull); heavy squat or heavy deadlift only on its own day | ORD-02, UNI-11, ORD-01; R2-SES-01 |
| 7 | Secondary pair | unilateral lower + the other upper vector | OBSERVED BYOP; UNI-11 |
| 8 | Second exercise per group, isolation / Focus | the 2nd-4th exercise of each group trained that day (R2-SES-05); arm and delt work matching the day; calves 3 sets each leg day; rear-delt station; MYO only last | VOL-17, VOL-15, ORD-04; R2-SES-05 |
| 9 | Conditioning | buy-out, circuit, WOD last; core supersets / monster sets may sit anywhere | ORD-09, PRG-11; R2-SES-03 |

### 10.3 Pairing, day grammars and "2-4 per muscle group"

| Grammar | Day types | Use | Status |
|---|---|---|---|
| G1 SAME_PATTERN | knee day = quads 3, back 2, shoulders 2 (rear delt + KB face pull), biceps 2, calves; hip day = hips 3, chest 2, shoulders 2, triceps 2, calves | physique 3-6 days; strength; high-level athletes | OBSERVED BYOP; UNI-06; R2-SES-05 |
| G2 CROSS_PATTERN | A = [BKD \| HPULL] + [UHD \| VPUSH] + a lighter second exercise for each lower group (leg extension, leg curl), as in his BOOTCAMP 1 A day; B mirror | bootcamp, fat loss, general, stay athletic, **athletes by default**, in-season, 2-3-day plans | OBSERVED; ORD-06; R2-SES-05 |
| G3 BASEBALL_PARTS | Mon [BKD \| HPULL] / UHD + biceps + calves; Tue [BHD \| HPUSH] / UKD + triceps + shoulders; Thu / Fri the same with VPULL / VPUSH; **Part F** = each group's second exercise (INFERRED, R2-SES-05) | baseball / softball | OBSERVED; ATH-11 |
| G4 UPPER_LOWER | Lower 1 heavy squat (non-axial hinge); Lower 2 heavy deadlift (leg press); Upper H pull → H push → V pull → V push + arms + side and rear delts | when UL is requested | OBSERVED; R2-SES-01 |
| G5 PPL | push / pull / legs; Legs 1 heavy squat, Legs 2 heavy deadlift; weekdays flexible | 5-6 days, advanced physique; sample plan | PRG-02; R2-SES-01; R2-GEN-07 |
| G6 CONJUGATE_4ROLE | ME lower / ME upper / DE lower / DE upper, each the work → the nuance → the accessory → the survival | strength (kept as written; some muscles have one exercise, flagged) | ORD-07 |
| G7 QUALITY_DAY | CrossFit knee + snatch / pull + clean / hip + snatch / push + clean | CrossFit | OBSERVED |
| G8 ATHLETIC_THEMED | jump day = hip + pushes; medball day = knee + pulls | off-season athlete variant | UNI-11 |
| **G9 CROSSFIT_CLASS** (new) | warm-up → light core → skill → strength / power → WOD; his HALF TIME (class) and FULL TIME (competitor) tables, WOD level and aerobic level | CrossFit-style class and the "CrossFit-style bootcamp" sample plan; HYROX hybrid days (run + stations WOD) | OBSERVED OT17 / OT18; R2-GEN-07 |

**Counting "2-4 exercises per muscle group" (R2-SES-05).** Muscle groups follow his FOCUS headers; the templates count **glutes + hamstrings together as "hips"** and **front / side / rear delts + traps as "shoulders"** (INFERRED; 12 lists glutes and hamstrings apart; R3-SES-01); calves keep one exercise × 3 sets per leg day (the second calf exercise starts at 1 set = his 3 sets); core = the opener. Where a muscle cannot get 2 exercises on a day, it is trained on fewer days with 2 exercises each (PROPOSED). **Field athletes**: 2-4 exercises for each muscle group **trained that day**; athletic stations do not count toward the resistance part; with the cross pattern 2 exercises per group use 9 of the 12 counted slots, leaving 2 plyo/ballistic stations + 1 Olympic lift; his own same-pattern athletic template leaves 3-4 + 1 (R3-SES-01). Conjugate four-role days stay as written (flagged).

### 10.4 Spine: heavy squat and heavy deadlift on two different days (APPROVED, R2-SES-01, R2-SES-02)

| Item | Rule | Status |
|---|---|---|
| Budget | **one heavy (axial) squat day + one heavy (axial) deadlift day a week, on different days** | **APPROVED** R2-SES-01 |
| Counted (axial) | barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings (02 v1.1: 25 counted records, 17 named + 8 INFERRED barbell / trap-bar variants) | **APPROVED** R2-SES-02 |
| Second day, if not sore | goblet squat, hack squat, pendulum (02: 29 second-day options) | **APPROVED** R2-SES-02 |
| Not counted | leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps | **APPROVED** R2-SES-02 |
| Powerlifters | may add a light technique squat or deadlift | **APPROVED** R2-SES-02 |
| Spacing (4-6 days) | heavy squat Monday (A1), heavy deadlift Friday (B2); Tuesday (B1) non-axial hinge; Thursday (A2) leg press / belt squat | **APPROVED** R2-SES-01 |
| Soreness switch | an athlete already loaded or sore switches to the belt squat | EQ-11 |
| Home / hotel without machines | the second squat day is a single-leg squat (split squat, step-up, box pistol) or a goblet squat if not sore | PROPOSED |
| Weightlifters, strongman | heavy back squat day + heavy pull day; front squat light-moderate (same exception as powerlifters); yoke with the squat day, heavy farmers with the deadlift day | PROPOSED (04 combat Q2, Q13) |
| Check | every v1.1 template: ≤ 1 heavy squat + ≤ 1 heavy hinge a week, never on the same day | computed (05 §8.7) |

### 10.5 Session sizes and lengths (v1.1)

| Session type | Exercises | Length | Default sets | ID |
|---|---|---|---|---|
| Resistance split days (physique, strength accessories) | 5-7 at 45-60 min; 8-9 at 75-90 min; 3-4 per muscle group | general 45-60; bodybuilders/powerlifters ~90 (max 120) | 3 compound / 2 isolation / 3 calves | VOL-08, VOL-16, UNI-09 |
| **Full-body days** | **2-4 per muscle group trained that day** → 7-10 resistance exercises + core opener | estimated twice (05 §8.7): aesthetics 60-min days ~63 min at the block start, ~94 late; fat-loss gym ~60 at 60 min, ~51 at 45 | 2 per exercise at the start, then the stairway adds | **R2-SES-05** |
| Field athlete off-season | **up to 12 + the 2-exercise core block** | ~90 min (max 120); athletic 60-min days ~63-66, 90-min ~84 | **2 per slot** (3 at 90 min) | VOL-08, VOL-17, VOL-16; **R2-SES-04** |
| Non-competitive athletic / stay athletic | ~10 slots | 60 min (PROPOSED); 56-90 by activity (04) | 2 per slot | ATH-13 |
| Strength | the four roles + survival isolations | ~90 min | his template | ORD-07 |
| Bootcamp | two circuits of 4-6 stations × 3 rounds × 35-50 s | ~43-45 min incl. warm-up and core | time-based | PRG-03; R2-SES-05 |
| CrossFit-style class | warm-up → light core → skill → strength / power → WOD | ~67-68 min | his class tables | OBSERVED; R2-GEN-07 |
| In-season athlete | 2 days a week; 2 exercises per group at 1-2 sets ≈ 12 exercises (~56 min) | PROPOSED 45-60 min | 1-2 | PER-08; R2-SES-05 |
| Optional day | Focus 1, Focus 2, core, calves, aerobic | separate day preferred | Focus 2-3 sets each | ORD-10, ORD-11 |

**Floor of 10 vs the 2-set start (05 §8.7.1).** At 2 sets per exercise, plans that train a muscle once or twice a week give it only 4-8 weekly sets; the volume engine adds the missing sets in week 1, so the first days run longer than "about the chosen length" (about +2-4 min in most 4-6-day plans, +10-25 min (up to ~39) on the longest day of 2-3-day plans, upper/lower weeks and the CrossFit-style class). Flagged in R3-VOL-01.

**Counting convention** (APPROVED R2-SES-04): warm-up drills never count; the core block sits outside the 12; a superset of two small isolations counts as one station.

**Time-overflow rule** (PROPOSED): sets added through the block push a session past its length; the generator first supersets the lower/upper pairs and small isolations (ORD-05), then applies the cut order, and **never cuts a muscle group to one exercise** (R2-SES-05).

| Family | Cut first (in order) | Never cut |
|---|---|---|
| Aesthetics | Focus → a third exercise of a group → the second non-axial bilateral on 2-3-day plans | each group's 2 exercises, calves, one rear-delt station a week, the core opener |
| Athletic | 2nd plyo / sprint → COD (keep for COD sports) → second pair to 2 sets | core opener, 1 plyo/ballistic, the Olympic lift, the work + paired upper, each group's 2 exercises, calves |
| Strength | the nuance → the accessory | the work and the survival (ORD-07) |
| Bootcamp | rounds 5 → 3 → the 6th station of a circuit | 2 stations per group, calves, the week's rear-delt station |

### 10.6 Supersets, contrast and circuits

| Use case (ORD-05) | Who | Trigger |
|---|---|---|
| Short session | anyone | minutes below what the station list needs |
| More stimulus | advanced (L3) lifters and athletes | L3 + preference |
| Aerobic capacity | off-season athletes | athletic family + off-season |
| Beginners who don't fatigue | L1 clients | L1 + preference |
| **Core supersets / monster sets** | any session, coach or user choice ("optional to be thrown anywhere") | **R2-SES-03**; coach rule action add_core_superset |

What to pair: the W2 pairs and isolation pairs (biceps + rear delts, triceps + side delts, calves + delts); never two lower compounds; never a heavy lift with a fatiguing lift for the same muscle except contrast. **Contrast** (ATH-12): L2+ off-season, 78-85 %, "immediately" into the jump. **Bootcamp circuits**: two circuits of 4-6 stations, 3 rounds × 35-50 s, ~43-45 min (05 time model); his FAT BURN ramp (3 × 30 s → 5 × 50 s) fits only with fewer stations (05 open question).

### 10.7 The week

- **Shape**: A1, B1, OPT, A2, B2, OPT, OFF for 4-6 days (OBSERVED); A1/A2 (and B1/B2) are the same day type with **different exercises**: one heavy spine exposure, one non-axial (R2-SES-01). At least one full OFF day. Consecutive days alternate lower dominance.
- **4-day plans become 5-6 days by adding optional days, not more heavy sessions**; in-sport athletes stay at 2-4 days.
- **Frequency**: with ≥ 4 resistance days every lower pattern ≥ 2×/week, push ≥ 2×, pull ≥ 2×; with 2-3 days every primary pattern ≥ 1×; on full-body days each group trained gets 2-4 exercises (R2-SES-05).
- **Strength**: Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper (OBSERVED). **PPL**: any weekdays. **Bootcamp**: 4 = A, B, aerobic, A, B, aerobic; 5 = rolling A/B (PROPOSED); 6 = Bootcamp 1-2-3, 1-2-3 (OBSERVED). **In season**: 2 days, the hard day ≥ 48 h before a game (R2-ATH-07). **Stay athletic**: gym days placed around the play days (PROPOSED).
- **Olympic days**: up to 4 a week; clean on the knee / squat days, snatch on the hip / hinge days (R2-ATH-04).
- **Aerobic placement**: separate days first, add-ons second; counts adjustable (R2-SES-06); never the same colour twice except the aesthetics second Orange.
- **Buy-outs** (OBSERVED BASEBALL Part E): 1-3 short maximal bouts on 2-4 days a week in athletic sessions of 75+ min; none in recovery weeks.
- **No deload or maintenance week inside a block** (R2-VOL-07); the recovery week sits between blocks (§11.6).

### 10.8 Generator split templates (summary; `05_templates.json > generator_split_templates[family][days]`)

Every day opens with the warm-up and the core opener (2 × 2, movable). `[A | B]` = W2 pair; `*` = the week's heavy spine exposure, `~` = non-axial.

| Family | Pairing | Default length | 2 days | 3 days | 4 days | 5-6 days |
|---|---|---|---|---|---|---|
| Muscle & Physique | same pattern | 60 general, ~90 bodybuilders | A [BKD* \| HPULL] [UKD \| VPULL] + 2nd exercises per group; B [BHD* \| HPUSH] mirror (2 per group) | 3-day builder: A squat* + pull, B non-axial hinge + push, C deadlift* + both | **A1 squat* + pull, B1 hip thrust~ + push, OPT, A2 leg press~ + pull, B2 deadlift* + push, OPT, OFF** (2-4 per group; the full-body aesthetics sample plan) | + optional days; alt PPL × 2 (the PPL sample plan) |
| Athletic Performance (field / court / combat / aquatic; non-competitive; stay athletic) | cross pattern (same-pattern variant) | ~90 competitive, 60 non-competitive | A core → plyo → throw → COD → Olympic (clean) → [BKD* \| HPULL] → [UHD \| VPUSH] → 2nd exercises → calves + rear delt; B mirror (snatch, deadlift*); in-season 2-day | S1 heavy squat day, S2 non-axial hinge day, S3 heavy deadlift day | A1/B1/OPT/A2/B2/OPT/OFF; BASEBALL Parts variant (+ Part F); swimming dryland 3-4 days | + optional days |
| Strength | same pattern; four roles | ~90 | FB_ME / FB_DE | squat / press / deadlift | ME lower Mon, ME upper Wed, DE lower Thu, DE upper Sat + A/B lead-lift weeks | + optional days |
| Fat loss / bootcamp / general | cross pattern | 45-60 gym; 35-45 circuits | A / B with 2 per group (leg extension / leg curl as the lighter second exercise) | Bootcamp 1-2-3 (two circuits a day) | gym A/B or bootcamp circuits (the bootcamp sample plan); FAT BURN finishers | 5 rolling A/B; 6 = 1-2-3 × 2 |
| Hybrid / CrossFit (incl. HYROX hybrid days) | class model | 60-90 | HY_1 / HY_2 | class squat / press / deadlift | CrossFit competitor days; **'crossfit_style_bootcamp'** alternative (the CrossFit-style bootcamp sample plan) | HYBRID 5 days; class 6 |
| No equipment | the goal's skeleton filtered by kit; 'NO ACCESS' is not this (R2-LIB-08) | - | - | - | - | - |

All 30 templates and their variants were regenerated in v1.1 with stored checks; 0 pairing, order, spine, per-group, calf, rear-delt, cap or Olympic failures beyond documented exemptions (conjugate four-role days, CrossFit class model, in-season minimal bilateral, strength 3-day press rotation) (05 §8.7).

### 10.9 Pending (sessions)

Round 3: the "2-4 per muscle group" grouping (hips, shoulders) and the field-athlete default under the 12 cap (R3-SES-01). Still PROPOSED (05 §11.3): the cross-pattern lighter second exercise (leg extension / leg curl); bootcamp as two circuits vs one 7-station circuit; conjugate days with one exercise for some muscles; in-season days at ~12 exercises × 1-2 sets; the 1-minute changeover; the time-overflow rule; rolling A/B for 5-session bootcamp weeks; 105/120-min options; buy-outs on every 60+ min athletic session; vertical press for physique / fat-loss clients; CrossFit WOD days by month or by level; sprints off by default for clients over 60 (treated like plyos).

---

## 11. Plan types

Full version: `06_periodization.md` / `.json` v1.1 (§7 plan-length model with computed curves, §8 skeletons mode × family, §8.2 sports and stay-active, §12 science, §14.3 new questions).

### 11.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| P1 | **Every plan is a stairway**: "the steps are a little bit smaller" in the first weeks, "a little bit higher, but not too much" after the halfway point, the hardest weeks last; "that goes for every plan". The v1 8-week "4 adapting + 4 driving" and "start hard" are retired. | **R2-PER-03 (NOT RIGHT to 4 + 4 / start hard)** |
| P2 | **12-week plan (his preferred)**: "the last 4 weeks are going to be brutal ... week by week, it just gets gradually worse. I mean worse, meaning better, more volume." | PER-01; **R2-PER-04** |
| P3 | **"Start at a 2 and end at an 11"** = the felt level of overall volume and loading, "not the amount of sets"; the last week "a little bit past your limits". Advanced lifters at the ceiling climb by heavier loads, intensifiers and a rotating priority muscle. | PER-01; **R2-PER-05** |
| P4 | **Next block after a completed block: start × 1.05, cap + 1 set** (never above 25; priority 30); "all customizable". | **R2-VOL-06 (APPROVED)** |
| P5 | **Week-by-week mode** with no set length ("Just keep me in line ... it does it by itself"); **it needs the weekly check-in**. | PER-01; **R2-GEN-01** |
| P6 | **Yearly plan = the general population's "stay in shape" plan**: Jan-Mar hard work + more cardio, start cutting (sets stay at the starting level); Apr-Jun summer shape (keep losing fat while building a little muscle); Jul-Sep maintain at about 70 %; Oct-mid-Dec build muscle, less cardio; last 2 weeks of December automatic maintenance. Athletes follow their season instead. | PER-01; **R2-PER-01 (APPROVED)** |
| P7 | **The year follows the user's calendar and is fully tunable**: own hemisphere; own vacation and holiday weeks (Christmas, Semana Santa, Thanksgiving ...) switch to maintenance; re-order or change blocks; more or less cardio; e.g. a deep-winter powerlifting-style block. | **R2-PER-02** |
| P8 | **Not conjugate or anything set in stone, but with "good sound science behind it".** | PER-01 |
| P9 | **Exercise blocks of 4-6 weeks**; exercises fixed inside; 1-2 small variables or one detail change at the next exercise block. | PER-02; R2-LIB-01 |
| P10 | **No deload or maintenance week inside a block.** "No matter what the athlete puts, they need to be able to manage their block and complete it." | **R2-VOL-07** |
| P11 | **A block that cannot be completed is cancelled → a maintenance phase → a whole new block.** | **R2-VOL-07** |
| P12 | **Deload = about half the sets of the hardest (last) week, same exercises, 3+ RIR**; only between blocks. | PER-05; **R2-VOL-07** |
| P13 | **Maintenance phases have a chosen length and can be extended; at their end the plan asks: keep going on maintenance / change the plan / start a block of training.** 50-70 % of the volume (PER-01). | PER-01; **R2-PER-06** |
| P14 | **Pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power, ending with a 1-2-week taper**; its length can be changed. | **R2-PER-06 (APPROVED)** |
| P15 | **Level up a slot at the end of a block** on '8 - That was perfect' or easier, no pain. | PER-06 |
| P16 | **Tests before the block (or week 1) and at the end, never during it; never from zero** (§12). | PER-07; **R2-PER-07** |
| P17 | **Athlete seasons**: off-season most volume; pre-season (P14); in-season ~2 days, low volume (game-heavy reductions); post-season recovery. | PER-08; R2-ATH-07 |
| P18 | **His strength %-template and Olympic ramp** are the default for strength-focused plans (Olympic: 3-5 reps on full lifts). | PER-09; R2-ATH-05 |
| P19 | **Smooth weekly increases** for hypertrophy and general clients; **2-week steps and waves** for fight/competition prep. | PER-10 |
| P20 | **VOL 1 → VOL 2 → VOL 3**, one per off-season block. | PER-11 |
| P21 | **Off-season STARTING / MID / ADVANCED** = consecutive blocks or athlete levels, "depends on whatever is needed". | PRG-04 |

### 11.2 The plan modes (`06 > plan_length_model.modes`; spec `plan_types`)

| Mode | When | Shape | Steps | Recovery / deload | Tests | Tag |
|---|---|---|---|---|---|---|
| **C12** 12-week block (preferred) | default for every goal with ≥ 12 weeks; repeated back-to-back one step up | stairway: ACCLIMATION (L1 1-4, L2 1-3, L3 1-2) → DRIVE to week 8 → **HARDEST 9-12** ("brutal"); exercise blocks 1-4 / 5-8 / 9-12 | 3 % weeks 2-6, 5 % weeks 7-12, λ-scaled (big muscles L1 0.76, L2 0.87, L3 0.50) | **none inside**; one recovery week after it when another block follows | baseline before or in week 1; end test week 12 | R2-PER-03/04/05, R2-VOL-07, R2-PER-07; steps PROPOSED |
| **C8** 8-week block | a shorter plan | the same stairway from the level start: ACCLIMATION (L1 1-3, L2 1-2, L3 1) → DRIVE to week 5 → HARDEST 6-8; exercise blocks 1-4 / 5-8 | 3 % weeks 2-4, 5 % weeks 5-8 (L3 λ 0.78) | none inside; one recovery week after it | baseline / week 1; end test week 8 | R2-PER-03; phase weeks PROPOSED |
| Short training block (4-6 weeks) | inside a tuned year or set by a coach | a stairway with N = 4-6 (§5.4 table) | 3 % / 5 % | none inside | start / end | R2-PER-03 ("that goes for every plan"); PROPOSED |
| **MAINT** maintenance phase | a cancelled block; the end of a block when the person or coach asks; vacation, travel, moving; marked holiday weeks; the last 2 weeks of December; year Q3; the athlete's season change | flat at 50-70 % of the last block's final 4 weeks (not floored); loads kept, sets cut; RIR 2-3; no intensifiers | 0 % | it is the recovery; the next block starts at week 1 | none unless ticked | PER-01; **R2-PER-06** (length chosen 1-8, extendable, end prompt), R2-VOL-07; factor split PROPOSED |
| **WBW** week-by-week | "keep me in line" | rolling 12-week stairways back to back (one week shown at a time), each followed by a recovery week and the next one a step up; exercise blocks every 4 weeks | planned stairway; the weekly check-in (required) moves the step; a week without it runs the planned step | the recovery week every 13th week; never inside a stairway | start and end of each stairway | PER-01; R2-GEN-01, R2-VOL-03, R2-VOL-07; rolling 12 PROPOSED |
| **YEAR** yearly gen-pop plan | the general population, a plan for the whole year | Q1 12-week block (cut; sets at the starting level) + recovery week; Q2 12-week block one step up + recovery week; Q3 maintenance ~70 % (13 weeks); Q4 11-week build block; weeks 51-52 automatic maintenance; tunable | per block | weeks 13 and 26; Q3 and weeks 51-52 maintenance | week 1 and the last week of each training block (12, 25, 50) | **R2-PER-01, R2-PER-02**; layout PROPOSED |
| **PREP** event / fight / competition | a fight, meet, race, show or tournament date | fights and meets: 2-week steps and waves (OBSERVED boxer); **gen-pop events (HYROX race, tournament, 10K): the normal stairway timed so its hardest weeks end 1 week before, then a 1-week taper** (PROPOSED) | same average step | taper (1-2 weeks; gen pop 1) | the event | PER-10; COACH-CHAT 2026-10-08; R3-ATH-05 |
| **SEASON** competitive athlete | sport, position, season start date, practice and game days | off-season stairway blocks (VOL 1 → 3) → **pre-season 4-6 weeks ~60 %, speed/power, 1-2-week taper** → in-season 2 days (game-heavy rule) → post-season recovery | off-season stairway; pre- and in-season flat | recovery week between off-season blocks; taper ends the pre-season | start and end of each off-season block | PER-08, PER-11, PRG-04, UNI-10; **R2-GEN-05, R2-PER-06, R2-ATH-07** |

### 11.3 Reference curves (one big muscle; computed with the team venv; = 12 §3.7.1 and 06 §7.1-7.2)

**12-week block** (no check-in; with check-ins the step moves from effort, completion and pain):

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Stair level (display) | 2 | 2.6 | 3.2 | 3.8 | 4.4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| L1 phase | acc | acc | acc | acc | drive | drive | drive | drive | **hard** | **hard** | **hard** | **hard** |
| L1 sets (λ 0.76) | 10 | 10 | 10 | 10 | 10 | 11 | 11 | 12 | 12 | 12 | 13 | 14 |
| L2 phase | acc | acc | acc | drive | drive | drive | drive | drive | **hard** | **hard** | **hard** | **hard** |
| L2 sets (λ 0.87) | 15 | 15 | 15 | 16 | 16 | 17 | 17 | 18 | 19 | 20 | 21 | 22 |
| L3 phase | acc | acc | drive | drive | drive | drive | drive | drive | **hard** | **hard** | **hard** | **hard** |
| L3 sets (λ 0.50) | 20 | 20 | 20 | 20 | 21 | 21 | 22 | 22 | 23 | 23 | 24 | 25 |
| Planned RIR (inside 1-3, PROPOSED) | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 1-2 | 1-2 | 1 + intensifiers |
| Receive-Create stage (athletes) | RC1 | RC1 | RC1 | RC2 | RC2 | RC2 | RC2 | RC3 | RC3 | RC3 | RC3 | RC3 |
| Events | baseline test; exercise block 1 | | | | exercise block 2 (one-detail changes; BB/PL 50/50 → 80/20) | | bigger steps from here | | exercise block 3; HARDEST | | | the "11"; end test; then the end-of-block choice |

**8-week block** (from the level start; no × 1.10): L1 10 · 10 · 10 · 10 · 11 · 12 · 12 · 13; L2 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19; L3 (λ 0.78) 20 · 20 · 20 · 21 · 22 · 23 · 24 · 25; stair 2 · 2.9 · 3.9 · 4.8 · 6.3 · 7.9 · 9.4 · 11; RIR 3 · 3 · 3 · 3 · 2 · 2 · 1-2 · 1 + intensifiers; RC1 weeks 1-2, RC2 3-5, RC3 6-8.

**Reading.** L1 and L2 climb 40 % and 47 % and L3 25 %; λ lands every level's peak on its cap in week 12, so the biggest weeks are the last 4. In the first half the sets barely move (L1 adds its first set in week 6): the stair climbs there through load and RIR. Every week at least one dial moves up (a set, the load or reps, or the RIR target) (PROPOSED, from R2-PER-04/05). Total-rise check (5 big + 5 small muscles): L2 at most +7.4 %, L3 +5.3 %; the L1 total would reach +10.0 % in week 6 without release staggering (PROPOSED).

### 11.4 Repeated blocks (P4; APPROVED step)

| Level | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|
| L1 | 10 → 14 (λ 0.76) | 11 → 15 (λ 0.70) | 12 → 16 (λ 0.65) | 13 → 17 (λ 0.60) |
| L2 | 15 → 22 (λ 0.87) | 16 → 23 (λ 0.82) | 17 → 24 (λ 0.78) | 18 → 25 (λ 0.74) |
| L3 | 20 → 25 (λ 0.50) | 21 → 25 (λ 0.39) | 22 → 25 (λ 0.29) | 23 → 25 (λ 0.19) |

L1 and L2 climb one set per block at both ends; λ keeps every block's peak in week 12 but shrinks the steps as the start nears the ceiling, so for advanced lifters "one level higher" comes from heavier loads, intensifiers (MYO, supersets) and a rotating priority muscle up to 30 (APPROVED, R2-PER-05); the optional Pro setting goes above 30 (R2-VOL-06, PROPOSED numbers). After a **cancelled** block the start repeats (PROPOSED).

### 11.5 The yearly gen-pop plan ("stay in shape"; APPROVED R2-PER-01, tunable R2-PER-02)

| Quarter | Weeks | Theme (approved) | Resistance (layout PROPOSED) | Aerobic | Last week / tests |
|---|---|---|---|---|---|
| Q1 Jan-Mar | 1-13 | **hard work + more cardio, start cutting** | 12-week block, **sets stay at the starting level** (no set stairway in the cut); the stair climbs by cardio, density (finisher circuits, supersets), load and RIR; HARDEST 9-12 | goal default + 1 (e.g. 3 → 4) | week 13 recovery week; test week 12 if ticked |
| Q2 Apr-Jun | 14-26 | **summer shape: keep losing fat while building a little muscle** | 12-week stairway one step up (start × 1.05, cap + 1); HARDEST 22-25 | goal default | week 26 recovery week; test week 25 |
| Q3 Jul-Sep | 27-39 | **maintain at about 70 % of the volume** | maintenance phase, 70 % of Q2's final 4 weeks, flat, RIR 2-3; one exercise change mid-quarter (PROPOSED) | goal default; outdoor activity counts | - |
| Q4 Oct-mid-Dec | 40-50 | **build muscle, less cardio** | 11-week stairway one more step up (priorities allowed); ACCLIMATION 40-42, DRIVE 43-46, HARDEST 47-50; no recovery week before it (Q3 was maintenance) | goal default − 1 (min 2) + optional walks | test week 50 |
| Holidays | 51-52 | **automatic maintenance** | about 60 % (50-70 %) of Q4's final 4 weeks; any equipment | walks / any activity | - |

**Tuning (R2-PER-02).** Hemisphere: southern-hemisphere users shift the year by 6 months (PROPOSED shift); own holiday and vacation weeks are marked by the user, switch to maintenance and are placed **between blocks** (blocks shortened or shifted, never below 4 weeks; a week marked inside a running block ends that block early unless the mark is removed, PROPOSED, R3-PER-01); drag blocks to other quarters or change a block's goal (build, cut, maintain, athletic, strength); more or less cardio per block; a winter strength block (the STRENGTH %-template inside the stairway, less cardio); a "stay athletic" activity block or an event peak (§9.10). Guardrails that stay: every training block is a stairway; no maintenance inside a block; a recovery week between two back-to-back blocks; the floor of 10 inside training blocks.

**A year for an L2 reference big muscle** (computed; layout PROPOSED): Q1 weeks 1-12 at 15; week 13 recovery 8; Q2 weeks 14-25: 16 · 16 · 16 · 17 · 17 · 18 · 18 · 19 · 20 · 21 · 22 · 23; week 26 recovery 12; Q3 weeks 27-39 at 15 (70 % of 21.5); Q4 weeks 40-50: 17 · 17 · 17 · 18 · 18 · 19 · 20 · 21 · 22 · 22 · 24; weeks 51-52 at 13 (60 % of 22.25).

### 11.6 Blocks, deloads, maintenance, taper and transitions (06 §6, §7.0.2)

```
TRAINING BLOCK (a stairway: week 1 feels like a '2' ... the last week feels like an '11')
  baseline test before the block or in week 1 (if ticked; submax if no completed block)
  weeks run in order; holds, repeated weeks and pain swaps are allowed; NO deload or maintenance week inside
  |
  +-- block COMPLETED -> end test in the last week (if ticked) -> END-OF-BLOCK CHOICE (copy 'block.done'):
  |      (a) next block (default for week-by-week, year and repeat plans):
  |          RECOVERY WEEK (about half the sets of the hardest week, same exercises, 3+ RIR)
  |          -> next block week 1 at start x 1.05, cap + 1
  |      (b) maintenance phase (choose its length) -> see below
  |      (c) change the plan
  |
  +-- block CANNOT be completed -> the person or coach taps CANCEL (the plan only offers it; copy 'block.cannot_finish')
         -> MAINTENANCE PHASE (choose the weeks, 1-8; add weeks any time)
         -> END-OF-MAINTENANCE PROMPT: 'Keep maintaining' | 'Change your plan' | 'Start a training block'   (copy 'maint.end')
         -> a whole new block from week 1 at the SAME start as the cancelled block (no recovery week: maintenance was the recovery)
```

| Rule | v1.1 | Tag |
|---|---|---|
| Nothing inside a block | no deload and no maintenance week is ever inserted into a block; holds, repeated weeks (under half the sessions) and pain swaps change the step, not the structure | **R2-VOL-07** |
| Block-at-risk offer | with check-ins the plan offers "keep going" or "stop the block and start maintenance" when it sees: 2 holds in a row; effort mostly 9-10 two weeks in a row; under half the sessions 2 weeks running; 'Felt a PAIN' on 2+ exercises in one week; pain two weeks running or "worse"; or the person taps "I can't finish this block". Without check-ins there are no signals and the block runs as planned | R2-VOL-07, R2-VOL-03; triggers PROPOSED |
| Recovery week (between two completed blocks) | about **half the sets of the hardest (last) week** (round up, min 1 per exercise), same exercises, lighter load or 3+ RIR, no buy-outs, finishers, MYO or supersets; plyos only low-amplitude landings at about half the contacts; Olympic lifts at half the sets with light technique loads; conditioning Orange only; counted as an extra week (a 12-week block + 1 = a 13-week quarter); none when a maintenance phase follows or precedes | PER-05; **R2-VOL-07** ("half of the current (hardest) week" approved); counting PROPOSED (R3-PER-01) |
| Maintenance phase | length chosen (default 4, 1-8), extendable; end prompt; 50 % vacation / limited kit / marked holiday weeks, 60 % travel / moving / season change / after a cancelled block, 70 % planned maintenance and year Q3; older adults ≥ 70 %; flat, RIR 2-3; not floored; with no answer at the end it keeps maintaining (PROPOSED) | PER-01; **R2-PER-06**; factors PROPOSED |
| Vacation and holiday weeks | maintenance weeks (50 % with what is available, or full rest); placed between blocks; a week marked inside a running block ends that block early unless removed | PER-01; R2-PER-02, R2-VOL-07; placement PROPOSED |
| Taper | the last 1-2 weeks before a season opener, event or fight: volume about -40-60 %, intensity and frequency kept, no new exercises; athletes inside the 4-6-week pre-season; swimmers' main championship meet: 2 weeks lined up with the pool taper (PROPOSED); gen-pop events: 1 week (PROPOSED) | **R2-PER-06**; SCIENCE Bosquet 2007, Pritchard 2016, Aouani 2024 |
| Post-season recovery week | arm care, mobility, easy aerobic, no main lifts (OBSERVED baseball 'wk 8'), then general work or a maintenance phase | OBSERVED; PER-08 |
| In-season | no planned deload; flat; game-heavy rule; heavy game weeks keep only the light day (PROPOSED) | PER-08, UNI-10; R2-ATH-07 |
| Repeat week | under half of the week's sessions (with a check-in): repeat that week; with a fixed date ahead (season, event, booked test) the step is held instead so the block still ends on time (PROPOSED) | **R2-VOL-01** |
| Retired | v0 fixed deloads; v1 triggered mid-block deloads (D6) and "resume at the volume of 2 weeks before"; "week 1 of the next cycle is a deload" inside the next block's 12 weeks; 8-week "start hard" | R2-VOL-07, R2-PER-03 |

### 11.7 The science behind each shape (06 §7.7, §12)

| Shape | Evidence | Verdict |
|---|---|---|
| Gradual stairway, small steps first | Damas 2016 (hypertrophy signal mostly after ~3 weeks once damage drops); repeated-bout effect; big jumps add strain without more growth (Barsuhn 2024, Enes 2023/24) | supported |
| Hardest weeks last | more weekly sets → more growth with diminishing returns (Pelland 2026); periodization model matters little when volume is equal (Grgic 2017, Moesgaard 2022); planned beats unplanned for strength (Williams 2017) | supported: volume ramp to a level cap, then load / intensity |
| No deload inside a block; deload between blocks | deloads in practice every ~5.6 weeks (Rogerson 2024); planned or autoregulated both acceptable (Bell 2023); a mid-program week off did not change growth (Coleman 2024) | plausible; his rule keeps blocks whole and puts recovery between them |
| Maintenance 50-70 % | Bickel 2011, Spiering 2021, Bosquet 2013, Ogasawara 2013 | well supported; older ≥ 70 % |
| Repeat blocks one level higher | Scarpelli 2022; Pelland 2026 | supported with a ceiling |
| Week-by-week | responsive planning (Kiely 2012); autoregulation ≈ % plans (Hickmott 2022) | supported when weekly check-ins exist |
| Yearly + holidays | no controlled annual trials for general clients (Afonso 2017); cut phases protect rather than grow muscle (Murphy & Koehler 2022); holiday weight gain small but persistent (Yanovski 2000) | a coaching choice with sensible support |
| Pre-season taper | Bosquet 2007 meta-analysis (about 2 weeks, volume -41-60 %, intensity kept); swimming taper (Aouani 2024) | supported |
| Testing from 5RM, not 1RM, when untrained | a 5RM predicts the 1RM well (Reynolds 2006) | supported |

### 11.8 Pending (plans)

Round 3: the recovery week as an extra week and holiday weeks marked inside a running block (R3-PER-01); the gen-pop event date (R3-ATH-05); the swimming championship taper (R3-ATH-01). Still PROPOSED: phase weeks of the 8-week plan; the stair-level display; the maintenance factor split and default answer; the block-at-risk triggers; the same start after a cancelled block; the "repeat week makes the block longer" rule; the PRG-04 decision rule; fight-camp complexes vs ATH-12; the rest-of-test-week dose; the hemisphere shift; release staggering; "a block whose last 4 weeks were mostly holds repeats its start" (06 D12).

---

## 12. Testing

### 12.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| X1 | The athlete or coach picks what to test **at the start of a block** by checkbox (strength, cardio, speed and agility, jumps, body weight), or "No need for testing". **The menu is approved.** | PER-07; **R2-PER-07** |
| X2 | **Test before the block (or at its beginning) and at the end; never during the block** ("they should not test during the weeks, during the block"). The end test replaces that week's top sets. | **R2-PER-07** |
| X3 | **Never from zero**: anyone who has not finished a block of training (new, untrained, or back after 6+ months off) never tests a 1-rep max or a max-effort mile; strength by a 5-rep max (or 3-rep max), cardio and speed at 80-90 % effort ("not at 100%"). | **R2-PER-07** |
| X4 | **Reminders** at block start, 7 days before and the day before ("All right, it's time for your test. Get ready."). APPROVED. | PER-07; R2-PER-07 |
| X5 | Test items in his library: 'LEFT TEST' = L-test (3-cone); '5/10/05' = 5-10-5 pro agility; CARDIO 'DISTANCE TEST' / 'SPEED TEST'; 'LVL 5 = Work up to 1RM' (CrossFit). | LIB-01, OBSERVED |
| X6 | **The '21.6 mile run' is removed from plans and tests**; the longest run is the half-marathon plan (Chris Hinshaw), used as-is. | **R2-LIB-06** |
| X7 | 'WEIGHT USED or SCORE': SCORE = times, rounds or distances for conditioning. | PRG-08 |
| X8 | Aerobic tests on any erg, tracked by distance, calories or time. | EQ-14 |

### 12.2 Test menu (06 §6.1; APPROVED menu, doses PROPOSED)

| Checkbox | Options | From zero (no completed block) | Notes |
|---|---|---|---|
| Strength | beginners a 5-8-rep max (5RM default); intermediate and up a 3RM or 'Work up to 1RM' **only at the end of a completed block**; e1RM (Epley) from the rep max or the logbook | 5RM or 3RM (beginners 5-8RM); never a 1RM | pros: no true 1RM (PROPOSED); 60+: submax only (PROPOSED); SCIENCE Reynolds 2006 |
| Cardio | 1-mile run or an erg time trial (calories, time or distance); the CARDIO list 'DISTANCE TEST' / 'SPEED TEST' | 80-90 % effort (e.g. a 1-mile at a hard but controlled pace); never an all-out mile | the 21.6-mile item is removed; the 14 / 17 / 20-mile distance items are not offered by default (PROPOSED, §4.6) |
| Speed / agility | 10-30 m sprint, 5-10-5, L-test | 80-90 % | athletes |
| Jumps | countermovement or broad jump | as is | athletes; not for 60+ by default (R2-ATH-08) |
| Body | body weight, optional photos or girths | - | photos PROPOSED |
| None | "No need for testing" (default) | - | - |

**When**: 12-week block: baseline before or in week 1 (the light "2" week), end test in week 12; 8-week: week 1 and week 8; maintenance: none unless ticked; week-by-week: start and end of each stairway; year: week 1 and the last week of each training block (12, 25, 50); athletes: start and end of each off-season block. The previous block's end test is the next block's baseline. The rest of the test week runs at about 50-70 % of its sets; strength tests 48-72 h after the last hard lower session (PROPOSED). Static plans print the test day and a "get ready" line in the week before; a screenshot of the block shows the test weeks (R2-GEN-02).

### 12.3 Pending (testing)

The rest-of-test-week dose and spacing (PROPOSED); whether results feed % prescriptions automatically (v1.1: barbell main lifts with a recent tested best; Olympic lifts only with a coach opt-in, §9.5); the 14 / 17 / 20-mile CARDIO items; the borrowed half-marathon plan keeps its own cut-back weeks and max-effort mile tests as written, while the Blaze strength block beside it follows the stairway and tests only at start and end (PROPOSED; 04 aquatic O7).

---

## 13. The generator

Machine-readable twin: `generator_spec_v1.json` 1.1.0 (inputs schema `intake/2` with EN/ES i18n keys and LEGAL REVIEW copy placeholders, rule tables, the stairway, template references, plan types, coach-rule hooks, the check-in contract `checkin/2`, validation checks, output views). Everything below follows the coach's answers; mechanisms he did not specify are PROPOSED.

### 13.1 Confirmed product rules

| # | Rule | ID |
|---|---|---|
| G1 | **Users**: clients, coaches, trainers, strength and conditioning coaches, anyone. | GEN-01 |
| G2 | **Language**: English first with a full Spanish toggle; **neutral Latin American Spanish with the English gym word in brackets; he or a coach he trusts approves every line; pounds in the US, kilograms elsewhere, switchable.** | GEN-01; **R2-GEN-08** |
| G3 | **Intake**: no sex field; **training experience in years**; body weight; competitive sport → sport, position, **season start date + practice and game days**; recreational → the activity only. | GEN-02; **R2-GEN-05** |
| G4 | **The product path is approved**: a phone-friendly website (not an app) first, then the weekly check-in, then open source (Apache-2.0 code, CC BY 4.0 model; his videos, cues and the Blaze Camp name stay his). | GEN-03; **R2-GEN-02** |
| G5 | **Fewest clicks, phone first, macro views of the block, the week and the day with easy visibility toggles; a coach can screenshot a whole 12-week block or one week and send it.** | **R2-GEN-02** |
| G6 | **Videos are optional**: people can look up videos on YouTube; his own videos are added as they exist; "send us your video". | **R2-GEN-02** |
| G7 | **Health check**: clients go through a PAR-Q-style screen; the approved refer list (chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said no) means no automatic plan. **Coaches can choose to run it with their client or bypass it** ("I want to be able to bypass it if I'm a coach"), with a legal warning to follow their own onboarding. | **R2-GEN-03** |
| G8 | **Liability release: everyone, client or coach, accepts it every time they get a plan.** | **R2-GEN-03** |
| G9 | **Workouts only: no sleep, stress, job or other lifestyle questions**, in the intake or the check-in. | **R2-GEN-04 (NOT RIGHT to the 3 taps)** |
| G10 | **Default exercise in every slot + dropdowns** to swap within the category. | GEN-04 |
| G11 | **The plan works with no tracking; an optional weekly check-in adjusts the next week; week-by-week needs it; no check-in = no change.** | GEN-05; **R2-GEN-01, R2-VOL-03** |
| G12 | **Weight guidance by reps in reserve (with the RPE number)** and a week-1 tip; % only with a recent tested best; **Olympic lifts explained as power output**. | **R2-GEN-06** |
| G13 | **A short cue per exercise in his voice + his instruction block at the top.** | GEN-07 |
| G14 | **Hard rules**: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped; **and coaches can add their own rules**. | GEN-08 |
| G15 | **Plan types offered**: 12 weeks (recommended), 8 weeks, maintenance (weeks chosen, extendable), week by week (with the check-in), a full year (non-competitive goals; tunable). **Tests by checkbox, before and at the end.** | PER-01, PER-07; R2-PER-01/02/06/07, R2-GEN-01 |
| G16 | **Levels explained in plain words**; ex-pros at L1 only briefly. | PRG-05 |
| G17 | **Generic, understandable program names**; spelling corrected in the generator only. | FIX-03, FIX-04 |
| G18 | **Client preference can choose between alternatives**; core block movable; optional days separate or added on; A/B variety weeks; **cardio more or less**; **60+ power work opt-in with the warning**. | EQ-10, ATH-11, ORD-10, PER-03; R2-SES-06, R2-ATH-08 |
| G19 | **The tool computes the percentages**; it learns from everyone's data over time. | VOL-06, VOL-01 |
| G20 | **Every popular US sport in the picker, swimming included, and a "Stay athletic and active" door** (pickleball, HYROX ...). | **COACH-CHAT 2026-10-08** |
| G21 | **He will grade seven sample plans** (swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs); his grades become automatic tests; tags reviewed in one sheet. | **R2-GEN-07** |

### 13.2 Intake form v1.1 (`generator_spec_v1.json > inputs_schema`, `intake/2`)

One question per screen with big auto-advancing buttons, defaults, and "More options" folded away (R2-GEN-02). Every label and option has an i18n key with EN and ES strings (Spanish PROPOSED, to be approved, R2-GEN-08). Start flow (12 steps): landing (language, units) → role → health → about you → goal → sport or activity → schedule → plan type and tests → equipment → pain → more options → release and build.

| Field | EN label / ES label | Type and options | Shown if / required | Source |
|---|---|---|---|---|
| F00 lang, F06 units | Language / Idioma; Units / Unidades | en (default), es; lb, kg (default by region) | top-right switches | GEN-01; **R2-GEN-08** |
| **F39 role** | Who is this plan for? / ¿Para quién es el plan? | **me; a client (I'm a coach or trainer)** → routes the health check, the release version and coach rule packs | **first tap, required** | GEN-01, GEN-08; **R2-GEN-03** |
| **F45 health route** | Health check for your client / Chequeo de salud de tu cliente | **run the health check (PAR-Q) with my client now; skip: I'm a fitness professional and screen clients with my own onboarding** (shows the coach warning `warn.coach_bypass`) | F39 = client, required; never on the client door | **R2-GEN-03**; flow PROPOSED; copy LEGAL REVIEW |
| **F01 health check** | Health check / Chequeo de salud | approved refer list: chest pain or a heart condition ("fainting" added, PROPOSED); surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said not to train → any yes: **no automatic plan**, refer message; "None of these apply to me" / "Some apply" buttons (no pre-set answers); PAR-Q route: our own short screen written with a lawyer + a link to the official PAR-Q+ (the official PAR-Q+ is "All rights reserved", official versions only, no Spanish listed; PROPOSED, R3-GEN-01) | F39 = me, or F45 = coach_screen; required | **R2-GEN-03**; LEGAL REVIEW |
| F02 age | Age / Edad | 10-90 | required | 60+ and youth rules (R2-ATH-08) |
| F05 body_weight | Body weight / Peso corporal | number + unit | **required** | GEN-02; loaded jumps 10-20 % BW (EQ-15) |
| F17 experience | Training experience / Experiencia de entrenamiento | years of consistent training; months off in the last 2 years; former competitive / pro athlete → level L1-L3 with a plain-words reason | required | GEN-02, PRG-05 |
| F07 goal | Main goal / Objetivo principal | build muscle; get stronger; train for my sport; **stay athletic and active** (new; pickleball, HYROX, tennis, golf, rec leagues, running, hiking ...); lose fat; general fitness and health; hybrid / CrossFit | required | v0 families; ATH-13; **COACH-CHAT 2026-10-08** |
| F07b format | How do you like to train? | gym sessions; bootcamp-style circuits | goal ∈ lose fat, general | PRG-03 |
| F11a competitive | Do you compete in a sport? | yes; I play for fun (→ F11r); no sport, I just want to be athletic (→ weekend_warrior + age overlays) | goal = train for my sport (goal = stay athletic sets "recreational") | GEN-02, ATH-13 |
| F11 sport | Sport / Deporte | **52 sports in 5 groups** (team field and court; aquatic, endurance and track; combat; strength and fitness; racket and club) with search, EN / ES names; every choice names its profile; "not listed? pick the closest type" | competitive, required | GEN-02; COACH-CHAT 2026-10-08; 04 v1.1 |
| F12 position | Position / Posición | 146 position / event / discipline choices (e.g. swimming: event group sprint / middle / distance + main stroke; lacrosse men's / women's then position) → profile (+ variant); skipping uses the sport default | competitive, optional | GEN-02, ATH-08 |
| F13 level_of_play | Level of play / Nivel | youth, high school, college, pro, masters, amateur (swimming adds age-group / club) | competitive | PRG-09 |
| F14 season | Season / Temporada | **my next season starts on (date); I'm in season until (date); competition, fight or meet date; no season right now** | competitive, required | GEN-02; **R2-GEN-05 (APPROVED)** |
| F15 practice | Practice and games / Prácticas y partidos | **practice days per week + game (match, meet, fight) days** → the hard gym day ≥ 48 h before a game | competitive, **required** | **R2-GEN-05**; R2-ATH-07 |
| **F11r activity** | What do you play or do? / ¿Qué practicas? | **26 activities** (pick up to 2, the first leads): pickleball, HYROX, tennis, padel, golf, rec league (+ league sport), running, hiking / rucking, cycling, lap swimming, ski / snowboard prep, surf / paddle, dance and fitness classes, triathlon, rowing, CrossFit-style classes, combat-fitness classes, climbing gym, first obstacle race, "a bit of everything" + routed extras; optional play days and (event-type activities) an event date (PROPOSED) | goal = stay athletic, or F11a = recreational, or the "I also play something" link | **COACH-CHAT 2026-10-08**; GEN-02 |
| F09 priority | Muscles to bring up (max 2) | his FOCUS list; V-taper bias | optional | VOL-02, VOL-18 |
| F10 lift_style | How do you like to lift? | lighter, more reps; balanced; heavier, fewer reps | optional | VOL-12 |
| F22 days, F23 weekdays | Training days per week; which days | 2-6; Mon-Sun | required / optional | v0; PRG-02 |
| F24 minutes | Session length | 30-90 (+105, 120 for competitive athletes, PROPOSED); full-body days with 2-4 exercises per group may need 55-80 min: the schedule screen says so and offers longer sessions, more days or a split | required | UNI-09; **R2-SES-05** |
| F25 plan_mode | Plan type / Tipo de plan | 12 weeks (recommended); 8 weeks; **maintenance / transition (you choose the weeks; can extend)**; **week by week (needs the weekly check-in)**; **a full year (stay in shape; you can tune it; non-competitive goals only)** | required | PER-01; **R2-PER-01/02/06, R2-GEN-01** |
| F25b maint_reason; **F25d maint_weeks** | Why a maintenance block?; How many maintenance weeks? | vacation / limited kit (50 %), travel / moving / season change (60 %), planned (70 %); **1-8 weeks, default 4, extendable** | F25 = maintenance | PER-01; **R2-PER-06** |
| F25c previous_cycles | Blaze Camp blocks completed | 0, 1, 2, 3+ (+ "the last one had holds or pain") → next start × 1.05, cap + 1 after a completed block; the same start after a cancelled block (or one that ended in holds / pain, PROPOSED) | optional | **R2-VOL-06** |
| F26 start | Start date | date | optional | v0 |
| F26b tests | What do you want to test? (before you start and at the end) | strength; cardio; speed / agility; jumps; body weight / measurements; no need for testing; **never from zero** (5RM / 3RM, 80-90 % efforts until a block is completed) | optional | PER-07; **R2-PER-07** |
| F27-F34 equipment | Where do you train?; extras; machines; preference; DB / medball / box / running space / cardio options | his list minus bands; HYROX extras (sled, SkiErg, rower, wall ball) | required / optional | EQ-01, EQ-10, EQ-11 |
| F35 pain, F36 pain_detail | Anything hurting?; tell us more | areas; side, severity (severe → refer), worse with ... | required / per area | VOL-03 |
| F38 exclusions | Anything you won't do? | running, jumping, barbell, lunges, overhead pressing, floor work, machines, other | optional | v0 |
| F43 output_mode | How do you want to follow it? | **just the plan (no tracking)**; plan + a 1-minute weekly check-in; plan + full logbook | default "just the plan"; check-in required for week-by-week | **R2-GEN-01, R2-VOL-03** |
| F44 prefs | Preferences | core block position (start default; core supersets anywhere in coach mode); optional days separate / add-on; variety A/B; heavy single-leg sets; supersets when I don't feel tired; **cardio less / as planned / more**; **60+: add Olympic lifts / jumps (with the warning)** | optional | ATH-11, ORD-10, PER-03, UNI-04, ORD-05; **R2-SES-03, R2-SES-06, R2-ATH-08** |
| F03 growth_stage | (youth athletes) | pre / around / after the growth spurt / not sure | age < 18 and athletic | PROPOSED |
| F41 email | Email (optional) | delivery only; no account in the MVP | optional | 13 |
| **F46 release** | Liability release / Descargo de responsabilidad | client, coach or minor version (a parent or guardian accepts under 18); full text, **unticked** "I have read and accept" box, separate Build button; record {text version, language, role, time, plan id} kept on the phone and printed on every image, PDF and sheet | **everyone, before every plan build or rebuild, including each new block** (interpretation PROPOSED, R3-GEN-01) | **R2-GEN-03**; LEGAL REVIEW |
| ~~F42 recovery~~ | removed | ~~sleep; stress; physically hard job or other sport~~ | - | **R2-GEN-04** |
| ~~F04 sex~~ | removed | - | - | GEN-02, ATH-09 |

**Express path** (taps INFERRED, 13 §12.6): client with a gym goal about 13-14 taps; "stay athletic and active" 14-16; competitive athlete 20-22; coach with the bypass on by default 11-13. **Derived values** (`generator_spec_v1.json > derived_values`, D1-D14): family (stay athletic → athletic, recreational), profile (+ variant, age overlay; 7-step mapping), client level and its reason keys, season phase, plan shape (stairway), week layout, constraint band, kit, start sets per muscle (floor 10), bilateral share target, athletic budget, **D12 = the planned stairway step** (was the before-logs step from F42; retired), test weeks (before / week 1 and end), aerobic sessions (profile default ± the user's choice).

### 13.3 Decision pipeline (pseudo-code v1.1)

```
generate_plan(intake, model, coach_rule_packs):

  # 0 SAFETY AND CONSENT -----------------------------------------------------------------------
  if F39 == 'self' or F45 == 'coach_screen':
      if any(F01 refer items) or 'severe' in F36: return refer(intake)               # R2-GEN-03 (approved refer list)
  else:  # F45 == 'coach_own_sop'
      show warn.coach_bypass; screening is the coach's responsibility (release.coach)  # R2-GEN-03
  if 'severe' in F36: return refer(intake)
  require F46 accepted for THIS build (client / coach / guardian version)          # R2-GEN-03: every time

  # 1 WHO IS THIS (workouts only: no sleep, stress or job inputs, R2-GEN-04) ---------------------
  family  = GOAL_MAP[F07] (+ F07b); F07 == 'active' -> athletic, recreational      # COACH-CHAT 2026-10-08
  profile = D2_profile(F11, F12, F11r, F11a, F02)                                     # 04 v1.1: sport -> position -> profile/variant;
                                                                                      # activity -> profile; none -> weekend_warrior; age overlays
  level, reason_keys = level_from_experience(F17)                                     # PRG-05; L3 PROPOSED; Pro setting opt-in (R2-VOL-06)
  phase   = season_phase(F14, F15, F26) if competitive else None                      # R2-GEN-05: start date + practice/game days
  band    = CONSTRAINT_BAND[client_family(family, age, pain, volume)]                 # EQ-03, EQ-13
  kit     = expand(F27 + F28 + F29 + F30..F34)                                        # never inferred from template names (R2-LIB-08)
  rules   = layer(LOCKED, BLAZE_DEFAULTS, coach_rule_packs, client_prefs=F44, F29b)   # GEN-08

  # 2 SHAPE AND WEEK ----------------------------------------------------------------------------
  shape   = PLAN_MODE[F25](level, family, phase, F25b, F25d, F25c)                    # stairway C12 / C8 / MAINT / WBW / YEAR (+ PREP, SEASON)
  week    = SPLIT[family][F22] (variant: same-pattern | cross-pattern | Parts | in-season | class model)   # 05 v1.1
  days    = place_on_weekdays(week, F23, game/play days)                             # heavy squat Mon / heavy deadlift Fri; hard day >= 48 h before a game
  for day: stations = warmup + core_opener(2x2, position=F44.core) + athletic_prefix(profile, phase)
                      + olympic(level, day pattern: clean on knee days, snatch on hip days; 60+ only if opted in)
                      + pairs(hip+push, knee+pull) + 2-4 exercises per muscle group trained that day
                      + isolation(calves 3, rear delt / KB face pull) + conditioning
           enforce: two spine days, row before pulldown, the work first, power before strength,
                    caps (field athletes <= 12 + core), minutes(F24) -> superset first, then cut order; never 1 exercise per group

  # 3 WEEKLY SETS PER MUSCLE --------------------------------------------------------------------
  for m in MUSCLES:
      if previous block completed: start[m] = round_half_up(previous_start[m] x 1.05); cap[m] += 1 (max 25 / 30)   # R2-VOL-06
      elif previous block cancelled: start[m] = previous_start[m]                                                   # PROPOSED
      else: start[m] = round_half_up(START[m][level] x GOAL_PHASE_FACTOR[family, phase][region(m)])                 # VOL-01, R2-VOL-04
      if m in F09 (new priority): start[m] += {L1: 4, L2: 4, L3: 6}[level]; cap[m] = PRIORITY_CAP[level]           # VOL-02; split PROPOSED
      if target(m) and shape is a training block: start[m] = max(start[m], 10)                                     # R2-VOL-06 floor 10
      if m in pain_muscles: start[m] x= 0.5-0.7                                                                    # VOL-03 (pain wins over the floor)
      if shape == MAINT: start[m] = factor(F25b, age) x last_block_final4_avg[m]   (flat, no floor)                 # PER-01, R2-PER-06
      if phase == PRE:   start[m] = 0.6 x off_season_sets[m]                       (flat, no floor)                 # R2-PER-06
  share = BILATERAL_SHARE[profile][phase] (+ pain shift)                                                            # UNI-02, UNI-10
  athletic = AthleticBudget(profile, phase, level): plyo share by class (start = end - 15 -> end, over jumps AND throws),
             Receive-Create stage by week, contacts <= NSCA per session, throws, COD, Olympic up to 4/week                # R2-ATH-01..05
  fit week 1: default sets (3 compound / 2 isolation / 3 calves; athletic slots 2), add to reach start (VOL-07 order)

  # 4 EXERCISES (fixed for the exercise block) --------------------------------------------------
  for slot: pool = catalog[slot.bucket] filtered by kit, soft level (load position, seat/machine/cable easier), population rules
                   (EQ-03 never-list; 60+ power work only if opted in), pain (rotation bias picks the swap), exclusions, active only
            default = argmax(BYOP library first, his staples, preference F29b, constraint fit, continuity)
            dropdown = same-category alternatives                                                       # GEN-04, EQ-10
            second weekly exposure = different exercise of the same category (non-axial on the non-spine day)  # PER-04, R2-SES-01
            at an exercise-block change: 1-2 small changes or one detail ('<name> - <detail>'), never invented  # PER-02, R2-LIB-01

  # 5 DOSE ---------------------------------------------------------------------------------------
  reps = REP_MATRIX[family][class] (VOL 1/2/3 for athletes; F10 moves big compounds only; full squat Olympic lifts 3-5)
  effort = planned RIR of the week inside 1-3 (3 -> 1 drift, PROPOSED); MAX only small-muscle/bodyweight last sets; MYO last only
  load_hint = RIR words + RPE number; % only for barbell main lifts with a recent tested best;
              Olympic lifts: 'power' (RPE / bar speed); % only with that lift's tested best AND a coach opt-in       # R2-GEN-06

  # 6 WEEK TO WEEK (no deload or maintenance inside the block: R2-VOL-07) -------------------------
  for week k:
      planned = stairway_step(m, k)                                     # 3 % to week ceil(N/2), 5 % after, x lambda; 60+ <= 3 %
      step = planned if no check-in (F43 == plan_only or missed)        # R2-VOL-03
             else checkin_row(effort, sessions, pain) read against planned  # R2-VOL-01 without life (R2-GEN-04)
      step = min(step, 0.07, coach_cap); others <= 0.03 while a priority runs  # R2-VOL-01, R2-VOL-06
      T[m] = min(cap, T[m] x (1 + step)); place whole sets in VOL-07 order until total rise < 10 %   # VOL-06, VOL-07, UNI-05
      apply HOW IT FELT: pain swap/cut/drop; wrong muscle -> one detail; couldn't -> one level down    # GEN-05, VOL-03
      if block_at_risk(check-ins): offer 'keep going' | 'stop the block and start maintenance'          # R2-VOL-07 (PROPOSED triggers)
      at an exercise-block boundary: one-detail changes; rebalance share; the stairway continues
      athletic: Receive-Create stage and plyo share advance                                              # R2-ATH-03

  # 7 END, TESTS, AUDIT, RENDER ------------------------------------------------------------------
  tests: ticked items before the block (or week 1) and in the last week; never mid-block; never from zero   # R2-PER-07
  block end: 'next block' (recovery week at half the hardest week -> start x1.05, cap +1) | maintenance (weeks chosen) | change plan
  maintenance end: keep maintaining | change plan | start a training block                                  # R2-PER-06
  audit: validation_checks (13.6); every number stamped with model_version; every pick has 'why' keys
  render: codes only -> word lists (EN/ES) -> Block / Week / Day views, images, PDF, sheet; release line on every export  # R2-GEN-02
```

### 13.4 Coach-added rules (GEN-08; mechanism PROPOSED, 13 §7.2)

| Layer | Owner | Changeable? | Contents |
|---|---|---|---|
| 1 Locked | the coach | no (only in a fork, which is then not Blaze Camp) | never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped (GEN-08); no bands or variable resistance; athletic sets never count as muscle sets; weekly increase < 10 % and planned step ≤ 7 %; **no deload or maintenance week inside a block** (R2-VOL-07); **never a 1RM or max-effort test from zero** (R2-PER-07); older/injured never-list (EQ-03) and 60+ power work only by opt-in with the warning (R2-ATH-08); no sex-based rules; **no lifestyle inputs** (R2-GEN-04); the release before every build (R2-GEN-03) |
| 2 Blaze defaults | the coach | yes, by a coach rule pack | starting sets, floor of 10, caps (all "customizable", R2-VOL-06), helper credit 0.25, the two spine days, calves 3 sets per leg day, session lengths, bilateral shares, plyo shares, aerobic counts, stairway step sizes, every PROPOSED number |
| 3 Coach rule pack | the coach using the tool | yes | e.g. "youth under 15: no Olympic lifts from the floor"; "tennis: lower body 85 % unilateral"; "add core supersets on every lower day" (R2-SES-03); "pin my video for this exercise" (R2-GEN-02); "show Olympic percentages for this athlete" (R2-GEN-06, PROPOSED) |
| 4 Client preferences | the client | yes, inside the layers above | dropdown swaps (EQ-10), core position (ATH-11), variety (PER-03), optional days (ORD-10), **cardio less / more** (R2-SES-06), **60+ opt-in with the warning** (R2-ATH-08), maintenance length (R2-PER-06), year tuning (R2-PER-02) |

**Rule format** (`rulepack/1`): `{"id", "when": {"all"|"any": [{"fact", "op", "value"}]}, "then": {"action", ...}, "note_key"}`. Facts: intake fields F00-F46, activity and sport ids, derived values D1-D14, `week.n`, `week.phase`, `day.type`, `slot.category`, `exercise.tags`. **Closed action list**: exclude_exercise, exclude_tag, exclude_equipment, prefer_exercise_in_slot, set_unilateral_share, set_muscle_weekly_range, cap_weekly_step, fix_weekly_step, add_slot, remove_slot, move_block, set_rest, set_rep_range, add_note, **add_core_superset** (R2-SES-03), **pin_video_link** (R2-GEN-02), **show_olympic_percentages** (R2-GEN-06; PROPOSED), **set_aerobic_sessions** (R2-SES-06). Precedence: locked > coach pack > Blaze defaults > client preference. Before saving, the coach previews the effect on 3 sample clients. Coach-added exercises carry every CAT-01 tag; a video link is optional (R2-GEN-02).

### 13.5 Adaptation from check-ins (APPROVED as a mechanism, R2-GEN-01, R2-VOL-01; life column removed, R2-GEN-04)

**Resolution** (13 §2): tracking (writing every set; optional, anywhere) is separate from checking in (one short screen a week). The plan works without either (R2-GEN-01); **without a check-in the next week is exactly the planned stairway week** (R2-VOL-03).

| Level | What the user does | What the tool does | Phase |
|---|---|---|---|
| 0 Just the plan | follows it; tracks in a notebook or not at all | the planned stairway; nothing to read | MVP |
| 1 Weekly check-in (no account, ~1 min; `checkin/2`) | which sessions were done; effort per session (his EFFORT menu; 10 = "the most I could do, and I made it"); how it felt (default 'Felt the RIGHT muscles'; "Couldn't do it" = the failed set); anything hurting (area, better / same / worse); optional best set or test result. **No "how was life" question.** | the step table read against the stairway (§5.4c); pain, wrong-muscle and couldn't-do-it rules; the block-at-risk offer; writes next week | phase 1.1 (required for week-by-week) |
| 2 Full logbook | his columns per exercise: 'WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?' | as level 1 per exercise, plus weight history | phase 1.1 phone / MVP in the downloaded sheet (no adaptation) |
| 3 Coach-connected (account) | as 1 or 2, visible to their coach | coach sees check-ins, gets a flag when 'Felt a PAIN' repeats, edits the plan | v2 |

What the user reads after a check-in: "Next week: +1 set on Back Squat (Monday, first exercise). Leg Press stays at 2 sets. Your shoulder: Barbell Bench Press is swapped for Machine Chest Press this week." (VOL-06: no percentages shown). Block-level prompts: `block.cannot_finish` (keep going / stop the block and start maintenance), `maint.end` (keep maintaining +1 / +2 / +4 weeks / change my plan / start a training block), `block.done` (next block / maintenance / change my plan). SCIENCE: simple self-reports track training load well (Saw 2016; Foster 2001); autoregulation is at least as good as fixed plans (Graham & Cleather 2021; Hickmott 2022); comparable products (RP Hypertrophy app, JuggernautAI, Volt, Fitbod) adapt from similar inputs (RESEARCH).

### 13.6 Validation checks before a plan is shown (v1.1)

| Check | Rule | Source |
|---|---|---|
| V1 safety | any F01 refer item or F36 severe pain → refer, no plan; **the F01 part is skipped only when F45 = coach_own_sop** (the coach warning was shown and the coach release is used) | R2-GEN-03 |
| V2 days | fewer weekdays than training days → ask | v0 |
| V3 short athletes | athlete with 30 min → warning | v0 |
| V4 youth | under 18: L1-L2 exercise levels by default; Olympic lifts from the floor from ~14 after a hang block; lighter medballs; guardian release; no research data | R2-ATH-08; R2-GEN-03 |
| V5 older | 60+: constraint 4-5 bias; never OH squat or low-bar squat; **no Olympic lifts, plyos (low ankle hops included) or depth jumps unless F44 opt-in, with warning C7 shown**; step ≤ 3 % (PROPOSED); maintenance ≥ 70 %; submax tests | EQ-03; **R2-ATH-08** |
| V6 season | plan longer than the weeks to the season → run to the date (pre-season 4-6 weeks + taper), then in-season | PER-08; R2-PER-06, R2-GEN-05 |
| V7 no equipment + muscle goal | warn about vertical pull, biceps, throws; show the buy list | 10 |
| V8 priorities | ≤ 2 priority muscles | VOL-02 |
| V9 bands | no exercise, swap or kit token uses a band, chain or releaser | EQ-01, EQ-12 |
| V10 spine | ≤ 1 heavy squat + ≤ 1 heavy deadlift (counted list) per week, **never on the same day** | **R2-SES-01, R2-SES-02** |
| V11 pairing | every mixed session: hip + push, knee + pull | UNI-11, ORD-06 |
| V12 order | warm-up → core opener (unless moved) → athletic → Olympic → strength; row before pulldown; the work first | ATH-11, ORD-01..03 |
| V13 caps | resistance ≤ 7 at 60 min (8-9 at 75-90) except full-body days; athletes ≤ 12 + the 2-exercise core block; minutes ≤ F24 (or superset, then the schedule warning) | VOL-08; **R2-SES-04** |
| V14 counting | athletic work (KB swings included) credits no muscle; helpers 0.25; glutes 0.25 on compounds; thruster 1 / 0.5 / 0.25; 10/10 = 1 set | VOL-09, VOL-10; **R2-VOL-05** |
| V15 step | planned step ≤ 7 %; no week raises total resistance sets by 10 % or more | UNI-05; **R2-VOL-01** |
| V16 aesthetics | no medball in the main workout | ATH-05 |
| V17 effort | no MAX on heavy compounds; MYO only last on machine/isolation; planned RIR inside 1-3 | GEN-08, VOL-13, VOL-15 |
| V18 minimums | calves 3 sets each leg day; a rear-delt station each week; 2 core exercises each session | VOL-17 |
| V19 Olympic | every athletic week has a level-matched Olympic variant (unless 60+ without opt-in); ≤ 4 exposures; clean on knee days, snatch on hip days | ATH-10; **R2-ATH-04, R2-ATH-08** |
| V20 V-squat | never | GEN-08 |
| **V21 release** | F46 accepted for this build (client, coach or guardian version); no plan otherwise | **R2-GEN-03** |
| **V22 floor** | every target muscle ≥ 10 weekly sets in a training block (exemptions: maintenance, pre-season, in-season, pain-reduced, credit-only, rear-delt own sets read on the shoulders group) | **R2-VOL-06** |
| **V23 exercises per group** | no muscle group trained on a day has only 1 exercise (calves and the core opener excepted; conjugate four-role days flagged) | **R2-SES-05** |
| **V24 block structure** | no deload or maintenance week inside a training block; the recovery week only between blocks | **R2-VOL-07** |
| **V25 tests** | tests only before / in week 1 and in the last week; no 1RM or max-effort mile without a completed block | **R2-PER-07** |
| **V26 inputs** | the intake and the check-in contain no sleep, stress, job or life field | **R2-GEN-04** |

### 13.7 What is the coach's and what is ours

| Component | Status |
|---|---|
| Taxonomy and lenses, big/small lists, LEG FLEXION, core rule, levels by load position (seat/machine/cable easier), zones as rotation-bias tags, starting volumes (big and small), the floor of 10, caps and priority caps, pain rule, the stairway shape (small steps first, hardest last, "brutal" last 4 weeks), "2 → 11" as felt level, the check-in rows (without life), no check-in = no change, effort 10 = successful max, bank-and-release, VOL-07 placement, 0.25 helpers and glutes, KB swings ballistic, thrusters, dips, 10/10, athletic never counts, bilateral:unilateral logic, contra/ipsi, pairing, two spine days and the axial list, light core opener + core supersets anywhere, 2-4 exercises per muscle group, field-athlete 12 + 2, ordering, supersets, session sizes, no deload inside a block, cancel → maintenance → new block, maintenance length and end prompt, pre-season 60 % + taper, next block × 1.05 / cap + 1, gen-pop year and its tuning, tests before / end and never from zero, seasons and start-date intake, plyo shares and lists, Receive-Create stages, Olympic up to 4 × / 3-5 reps / power language, 60+ and youth rules, aerobic counts and their adjustability, medball rules, no bands, machines not ranked, no sex rules, workouts-only intake, PAR-Q + coach bypass + release every time, the product path, fewest clicks, macro views, screenshots, optional videos, Spanish, seven sample plans, coach rules | **coach** (COACH-ANSWER / COACH-R2) |
| Stairway step sizes (3 % / 5 %) and λ, stair-level display, RIR drift, check-in read against the stairway, release staggering, block-at-risk triggers, same start after a cancel, recovery-week counting, maintenance factor split, Pro numbers, L3 definition, priority split, small muscles on big caps, the life-column drop, rear-delt floor reading, muscle grouping for "2-4", time model, share numbers he did not give, classes / aerobic counts / in-season rules of sports he did not name, stay-active play-day and event-date rules, HYROX dosing, swimming dryland defaults, 60+ low ankle hops reading, Olympic % opt-in, output layouts, PAR-Q route and release wording, licences, Spanish strings | **ours** (PROPOSED / INFERRED), each a configurable table entry; the blocking ones are in round 3 |

---

## 14. Product and output (summary of `13_product_options.md` v1.1)

### 14.1 What he approved and what it means (R2-GEN-02, R2-GEN-03, R2-GEN-06, R2-GEN-08)

| Topic | v1.1 |
|---|---|
| **What to build** | **APPROVED**: phase 1 a bilingual plan **website** (not an app) that builds the plan on the phone (images, PDF, Google Sheets / Excel download with his BYOP columns) → phase 1.1 the optional weekly check-in and logbook → **open source after he approves v1** (engine Apache-2.0; model data CC BY 4.0; his videos, cues and the Blaze Camp name all rights reserved). |
| **Fewest clicks** | one question per screen; big auto-advancing buttons; smart defaults; "More options" folded; nothing asked that the engine does not use (R2-GEN-04); client gym goal ~13-14 taps; stay-active 14-16; competitive athlete 20-22; coach 11-13 (INFERRED counts). |
| **Macro views** | one sticky **BLOCK \| WEEK \| DAY** toggle with "show" chips (exercises, sets × reps, effort, rest, cues, cardio, jumps and throws, sets per muscle). Clients land on today's Day view, coaches on the Block view (PROPOSED). The **Block view** shows the whole 12 weeks: one compact table per training day (exercises down the side, weeks across, exercise-block changes at weeks 5 and 9 marked), under a **stairway bar** with each week's 2 → 11 level and the test weeks. |
| **Screenshots and exports** | **Save block as image** (per training day or the whole block), **save week as image**, save day as image, the phone's share sheet (text it, WhatsApp it), print / PDF (block or week layouts), xlsx with his columns, share link, calendar. Exports carry the language, units, plan name, model version, **release line** and "not medical advice"; never age, weight, pain or health answers. |
| **Videos** | **optional**: his own video where one exists; otherwise a "Watch how" link that opens a YouTube search (nothing embedded); a note that the video is not made by Blaze Camp and a "send us your video" line (`[VIDEO_CONTACT]` placeholder). No phase waits for filming; the 85 exercises he uses without a link are a backlog. |
| **Health check and release** | §13.2 (F39, F45, F01, F46): clients → PAR-Q-style screen; coaches → run it or bypass with the warning; **everyone accepts the release before every plan build or rebuild**; copy C0-C15 in EN / ES marked LEGAL REVIEW. |
| **Weight guidance** | "Leave 2 reps in the tank (2 RIR · RPE 8)", the number following the week of the stairway; week-1 tip "pick a weight you could lift 2-3 more times"; % only with a recent tested best on barbell main lifts; Olympic lifts as power ("move it fast; if it slows down or your technique breaks, it's too heavy"); competitive weightlifting is its own program type (v2). |
| **Spanish** | **APPROVED**: neutral Latin American Spanish with the English gym word in brackets; he or a coach he trusts approves every line; lb in the US, kg elsewhere, switchable; legal text reviewed in both languages. |
| **Tiers** | self-serve (anyone, no coach access: his 'NO ACCESS', R2-LIB-08) and coached (coach mode in the MVP: rule packs, health-check bypass; coach-connected accounts in v2); free vs paid still open (N-PROD-09). |
| **Data** | stays on the phone (IndexedDB) with a backup code; health answers and release records never leave the device in the MVP; opt-in anonymous adult research data only from v2 after a lawyer's review. |
| **Stack** | static TypeScript single-page web app (PWA) on Cloudflare Pages; IndexedDB; i18n word lists; print CSS; DOM-to-PNG; ExcelJS; engine pure and deterministic (`generate / adapt / explain / validate`), plans stamped with `model_version`. |
| **Roadmap and effort** (INFERRED, one full-time developer) | Phase 0: freeze the model v1.1 + the seven sample plans he grades (golden tests) → Phase 1 MVP **11-16 developer-weeks** (was 10-14; new: health check and release, macro views and block image, sport and activity picker) → Phase 1.1 check-in, logbook, week-by-week, offline (+3.5-5) → Phase 2 accounts, coach mode, Drive export, consented data, open-source release → Phase 3 learning with every change approved by him. |

### 14.2 Decisions still open for him (13 §11)

N-PROD-08 learning data (adults only, opt-in, v2, after legal review: default as proposed); N-PROD-09 free vs paid; N-PROD-10 plan names shown to users; N-PROD-11 the 8 knee-band core exercises (default: ball or pad squeeze); **N-PROD-13 release "every time"** (each build or rebuild incl. each new block; not on re-opening or check-ins: in R3-GEN-01); N-PROD-14 where "send us your video" goes; **N-PROD-15 PAR-Q+ licence vs our own lawyer-written screen** (R3-GEN-01); N-PROD-16 release record on the phone + exports vs a server log; N-PROD-17 the picker fallback for competitive Olympic weightlifting; N-PROD-18 event dates for stay-active users (R3-ATH-05); N-PROD-19 the failed answer (resolved here: his "Couldn't do it"); N-PROD-20 Olympic % coach opt-in (default here: off unless tested and switched on).

### 14.3 The seven sample plans he will grade (R2-GEN-07; mapping PROPOSED; 04, 05, 06 v1.1)

| Sample plan | Default intake | Profile / template | Mode / skeleton | What it shows |
|---|---|---|---|---|
| **Swimming** | competitive swimmer (high school / club / college), middle distance, 3 dryland days | `swimming_middle` (sprint / distance alternatives; main stroke variant); athletic.3 or .4 (cross pattern) | SEASON: ATHLETE_OFF_C12 (or ATHLETE_PRE_6 when the first meet is ≤ 6 weeks away) | class 5 power work, shoulder care every session, Olympic 2-3 ×, 0 extra gym cardio, 2-week championship taper |
| **Football** | high-school player, skill position (or lineman), off-season | `football_skill` (QB, RB, big skill, OL, DL, K/P alternatives); athletic.4 (A1/B1/A2/B2) | ATHLETE_OFF_C12 | VOL 1 → 3, plyo end 60 % (linemen 40 %), aerobic 3, Olympic up to 4 ×, pre-season 4-6 weeks, game-heavy in-season rule |
| **Soccer** | off-season or pre-season player | `soccer` (midfielder base; defender, forward, GK); athletic.4 | ATHLETE_OFF_C12 / ATHLETE_PRE_6 | plyo end 60 %, aerobic 3-4, contralateral unilateral loading, game-heavy in-season rule |
| **CrossFit-style bootcamp** | gen-pop class member | `crossfit_class`; hybrid_crossfit.4 alternative 'crossfit_style_bootcamp' (class model, HALF TIME levels) | C12_HYBRID | warm-up → light core → skill → strength / power → WOD; the floor of 10 means longer first days (§10.5) |
| **Bootcamp** | gen-pop, 3-6 sessions a week | `fat_loss` + bootcamp format; fat_loss_bootcamp.4 alternative 'bootcamp_circuit' (two circuits a day) or .6 | C12_GENERAL (BOOTCAMP row) | the stairway in rounds and seconds; every muscle group 2 stations |
| **Full-body aesthetics** | gen-pop L1-L2 | `bodybuilding_aesthetics` (aesthetics_3day variant); aesthetics.4 (A1/B1/A2/B2 + optional days), same pattern | C12_HYPERTROPHY (full-body template) | 2-4 exercises per muscle group per day; stairway 3 → 5 %; 4 aerobic incl. a 2nd Orange; HARDEST 9-12 with MYO on the last isolation |
| **Push / pull / legs** | L2 | `bodybuilding_aesthetics` (aesthetics_12wk_ppl); aesthetics.6 'ppl_x2' | C12_HYPERTROPHY (PPL template) | split days 3-4 exercises per muscle; heavy squat and heavy deadlift on different leg days; HARDEST 9-12 |

He wrote "five" but listed seven; the team plans for seven (INFERRED). These replace the five v1 sample intakes in `samples/intakes/`; intakes for the new list still have to be written (Phase 0).

---

## 15. Science lineage (short; `07_science_lineage.md`, 12 §2 and §8, 06 §12, 04 references, 10b)

| Layer | Source | How it shows | Verdict |
|---|---|---|---|
| Library architecture | **Dr. Pat Davidson, Rethinking the Big Patterns** | LIB row 4 'CONTROL' / 'ATHLETIC' / 'RESISTANCE'; 11 of 13 RTBP patterns map onto BYOP columns | FAITHFUL (strongest lineage) |
| Levels / zones | **Davidson, A Coach's Guide to Optimizing Movement** (named by the coach) | zones as rotation-bias tags; level from load position and support (CAT-04, CAT-10; R2-LIB-02/03 approved) | ADAPTED; his wording not found publicly; consistent with the PRI/Hartman/Davidson expansion-compression model |
| Into / out of the hip | PRI / Bill Hartman / Davidson school | contra into the hip, ipsi out (CAT-13); Stastny 2015 EMG | ADAPTED |
| Dose | **Dr. Mike Israetel / RP** (MEV/MAV/MRV, 5-30 reps, RIR, set increases) | 15-20 sets, RIR, small step increases, MRV-like caps | ADAPTED (the stairway shape and VOL-07 placement are his own) |
| Volume research | Schoenfeld 2017, 2019; Baz-Valle 2022; Aube 2022; **Pelland et al. 2026**; Remmert; Enes 2023/24; Scarpelli 2022; Barsuhn 2024 | his starts, floor and caps match (§5.8) | supports his numbers |
| **"20-30 sets" surveys (new v1.1)** | Hackett, Johnson, Chow 2013 (127 competitive bodybuilders); Baz-Valle et al. 2026 (56 drug-tested elite bodybuilders); Teixeira et al. 2018 (105 trained gym-goers) | 20-30 fits trained people counting indirect work; direct-set surveys ≈ 8-17 (§5.8) | partly supports his statement; no number changes |
| Maintenance / deload | Spiering 2021; Bickel 2011; Bell 2023 Delphi; Rogerson 2024; Coleman 2024 | 50-70 % maintenance; deload ≈ half, between blocks | supports |
| Testing | **Reynolds 2006** (a 5RM predicts the 1RM well) | 5RM / 3RM from zero (R2-PER-07) | supports |
| Taper | Bosquet 2007 meta-analysis (about 2 weeks, volume -41-60 %, intensity kept); Pritchard 2016; **Aouani 2024** (swimming) | pre-season taper 1-2 weeks; swimming championship taper | supports |
| Unilateral vs bilateral | Liao 2022 (14 studies) | bilateral → bilateral strength; unilateral → single-leg jumps | supports his split |
| Athletic layer | Verkhoshansky, Cometti → Dietz (French contrast), Zatsiorsky → Westside, NSCA plyo guidance, Mach drills, Sheppard & Young; fast vs slow SSC ~250 ms (Schmidtbleicher; Flanagan & Comyns 2008) | ground-contact rule, approved shares, Receive-Create stages, contrast at 78-85 % | ADAPTED / FAITHFUL |
| **New sports (v1.1)** | 04 v1.1 references (swimming block / wall contact times, swimmer-shoulder prevalence, team-sport injury and concussion data); **Davids 2026** (HYROX demands: aerobic base, anaerobic power, local muscular endurance, maximal strength); **SFIA 2025** (pickleball the fastest-growing US sport, 24.3 million players in 2025, strong 65+ engagement); K34 (pickleball injuries mostly in adults 50+; falls, wrist fractures, Achilles ruptures) | sport profiles, 50+ / 60+ rules, HYROX overlay | supports the defaults; 12 claims spot-checked (10 verified, 2 only in part; the pickleball "~70 % of max HR" claim reworded to moderate intensity with vigorous bursts; the NCAA swimmer-shoulder shares flagged unverified) |
| Older adults | Borde 2015; NSCA (Fragala 2019) | machines, power work by choice | supports EQ-03, R2-ATH-08 |
| Periodization | Grgic 2017, Harries 2015, Williams 2017, Moesgaard 2022, Damas 2016, Issurin 2010, Kiely 2012 | the stairway with the hardest weeks last, VOL 1/2/3 blocks | supports; the value is a gradual ramp, a hard finish and recovery between blocks |
| Borrowed wholesale | Chris Hinshaw half-marathon plan (the longest run, used as-is); Westside structure in the strength track | | BORROWED / ECHO |
| Not used | 5/3/1, Texas Method, Prilepin | | not his lineage (COACH-CHAT) |

Scorecard (07 §14, unchanged): FAITHFUL 38 %, ADAPTED 43 %, OWN 20 %, CONFLICT 7 % of 138 concepts. **His own contributions** (keep as editable rules): the lunge triad, four force phases in his order, two jumping tracks, COD graded by turn severity, the squat ladder by upright posture, knee + pull / hip + push pairing, the Blue/Green/Orange aerobic system, the work / accessory / nuance / survival, the quality × month × level grid, pain = substitute first, the EFFORT scale with 8 as the bullseye and 10 as a successful max, the receive → create plyo method (Receive-Create stages), ground-contact-based plyo:ballistic, first-exercise-first set addition, **the stairway with "brutal" last weeks and the felt 2 → 11**, **"blocks are completed" (cancel → maintenance → new block)**, **the two spine days**, **"never one exercise per muscle"**. **Remaining tensions**: Olympic 4 × 8 @ 75 % (kept only for DB/KB and pulls; full lifts 3-5, R2-ATH-05); French contrast "immediately" vs PAPE rest (kept as written); 1:1:1 aerobic colours are not polarised endurance training (fine for team and strength clients; endurance athletes follow their own sport plan); his "20-30 sets for most people" is high against direct-set surveys (§5.8).

---

## 16. Still-open items

### 16.1 Unanswered, skipped, not understood (status after round 2)

| ID | Item | Status |
|---|---|---|
| **R2-VOL-08** | where a new set goes when a day type runs twice a week, and where a small-muscle bonus exercise goes | **not understood** ("I don't understand this question"); the default is kept and marked (§5.5); **re-asked in plain words with an example: R3-VOL-03** |
| LIB-10 | KB face pulls | **answered** (shoulder work on pull or shoulder days; R2-LIB-04) |
| LIB-12 | bench push-ups | **answered** (both: hands on bench foundational, feet on bench advanced; R2-LIB-05) |
| PRG-01, FIX-01 (skipped) | 'NO ACCESS' tabs; its Unilateral HD dropdown | **answered** by R2-LIB-08 (a self-serve version; Unilateral HD → the single-leg hinge list) |
| CAT-12 (not understood) | one-detail variants | **answered** by R2-LIB-01 (approved) |
| R2-VOL-05, R2-VOL-03 (no chip) | glute credit; no check-in | answered in words and applied (§5.2, §5.4) |

### 16.2 Tensions inside his answers

Round-2 tensions and their v1.1 resolutions are in **§0b.3** (life column, rear delts vs the floor, R2-VOL-08, RIR drift, check-in vs stairway, 60+ hops, floor vs maintenance, holiday weeks, recovery week, field-athlete fit, 'high rows', Olympic %). Round-1 tensions after round 2:

| v1 tension | Status after round 2 |
|---|---|
| GEN-03 "track themselves" vs GEN-05 "adjust from logs" | **settled**: works with no tracking; optional check-in; no check-in = no change (R2-GEN-01, R2-VOL-03) |
| PER-01 quarter wording | **settled**: approved gen-pop year (R2-PER-01) |
| Zones 1 and 3 both external rotation; supported overhead lifts foundational | **settled** (R2-LIB-02) |
| LIB-18 '21.6 mile run' | **settled**: removed (R2-LIB-06) |
| VOL-08 "max maybe 12" vs VOL-17 "12 to 14" | **settled**: 12 + the 2-exercise core block (R2-SES-04) |
| VOL-07 "3-4 per muscle" vs full-body days | **settled**: 2-4 per muscle group, never 1 (R2-SES-05) |
| LIB-14 thrusters | **settled**: 1.0 / 0.5 / 0.25 (R2-VOL-05) |
| ATH-10 Olympic for all vs the baseball in-season block | **settled**: in season a light 2 × 3, up to 4 × a week off-season (R2-ATH-04) |
| ATH-07 aesthetics 4 vs "never the same colour twice" | **settled**: a second easy Orange; counts adjustable (R2-SES-06) |
| EFFORT '9 - That was terrible' vs "leave 1 in the tank" | **settled in part**: rate against the target; 10 = successful max (R2-VOL-02) |
| PER-05 "half the sets" vs written deloads at 0.75-1.0 × week 1 | **settled**: half of the hardest week, between blocks only (R2-VOL-07) |
| PER-04 "load it once per week" + deadlifts | **settled**: two spine days (R2-SES-01, R2-SES-02) |
| UNI-10 minimal bilateral in season vs baseball ~55/45 | UNI-10 wins (answer over sheet): 20/80 |
| LIB-20 strap rotations vs LIB-09 removal | removed (LIB-09 explicit) |

### 16.3 PROPOSED register (where each lives)

Volume (§5.10; 12 §7): stairway step sizes and λ, stair-level display, RIR drift, check-in read against the stairway, a "10" lowering the target, repeat week lengthening the block, block-at-risk triggers, same start after a cancel, Pro numbers, priority split, small muscles on big caps, calves to 10, 60+ steps ≤ 3 %, release staggering, time model and changeover, per-session ceilings, L3 definition, rear-delt floor reading, the life-column drop. Bilateral (§6): shares for profiles he did not name, recreational COD shares, contra/ipsi percentages, frontal/transverse share, pain shift. Levels (§3): L3, Pro. Library (§4.6): wall balls, KB-swing home, HYROX stations, neck, jerks, long distance tests, 22 sport additions, carries/drags. Variables (§7.9): power-catch reps, French contrast 4th member, HYROX station dosing. Equipment (§8.6): second squat day at home, HYROX kit. Athletes (§9.12): classes / aerobic counts / in-season rule of unnamed sports, recreational class rule, 60+ hops reading, 50+ racket rules, swimming defaults and taper, HYROX overlay, play days, event dates, fight camps. Sessions (§10.9): "2-4" grouping, cross-pattern second exercise, bootcamp two circuits, athlete default under the 12 cap, in-season size. Plans (§11.8): recovery-week counting, holiday weeks inside a block, maintenance split and default answer, hemisphere shift, 8-week phase weeks. Tests (§12.3): rest-of-week dose, long distance items. Generator (§13): health-screen route, release timing and record, cardio repeat order, Olympic % opt-in, intake copy. Product (§14): layouts, landing views, licences, legal copy.

### 16.4 Integration to-do for the file owners (found while assembling v1.1)

| File | Fix needed | Basis |
|---|---|---|
| `05_session_architecture.md` (changelog row 7, §6.15, §8.2, §8.9 table) and `05_templates.json` (rules.older_adults_R2ATH08, station `older_default` strings, ~49 places) | 60+ default still says "landing drills and low ankle hops are fine": move low ankle hops to the opt-in (landing drills stay) | R2-ATH-08 + R2-ATH-02; 04 flag F9; this file §0.3, §9.9 |
| `12_volume_algorithm_v1.md` §3.13 and `.json` `athletic.plyo_share_by_sport.other_sports` / `classes_04.examples` | swimming listed as class 4 (25 → 40 %): now class 5 (10 → 25 %) | 04 v1.1 sport verification (flag F10) |
| `04_profiles.json` `ground_contact_model.floor` = 20 (class 5 profiles start at 20 %) | approved rule is "each block starts 15 points more ballistic": class 5 starts at 10 % (as 12, 06 and the spec use) | R2-ATH-01; this file §0.3 |
| `04_profiles.json` genpop GP-4 / `active_aging_60plus` | depth jumps kept off even with the opt-in and snatch never offered for 60+: R2-ATH-08 makes Olympic lifts, plyos and depth jumps an opt-in with the warning (EQ-03 "never" stays for injured / high-volume clients, overhead and low-bar squats) - or keep the stricter reading as a Blaze default if the coach says so (R3-ATH-02) | R2-ATH-08 vs EQ-03 |
| `04_athlete_profiles.md` / `04_profiles.json` `headline_findings_v1_1` | counts still say 124 profiles / 49 sports / 17 activities (pre-verification); `_meta.counts_v1_1` has the current 127 / 52 / 26 | 04 sport verification |
| `13_product_options.md` §13 | intro still calls the ids provisional and 04 "v1"; the F11r table maps kickball → weekend_warrior and says padel has no profile: final ids are in the spec (rec_kickball; padel = tennis + padel_competitive variant; 52 sports, 26 activities) | sports merge, spec 1.1.0 |
| `06_periodization.md` §8.2.5 swimming paragraph | "2-3 dryland days, 0-1 aerobic gym sessions": align to 04 v1.1 (3 dryland days + 1 optional, 2 for younger swimmers; 0 extra aerobic by default, 0-1 adjustable) | 04 v1.1 `dryland_realism_v1_1` |
| `06`, `11`, `12` v1.1 (Olympic load wording) | "% only if the athlete tested that lift" vs 13 / spec "no % by default even when tested; coach opt-in": both hold; add "and a coach switches it on" | R2-GEN-06; this file §0.3 |
| `12_volume_algorithm_v1` §3.10 vs `05` §4.7 | "2-4 per muscle group": 12 lists glutes and hamstrings apart, 05 counts them as "hips" | R2-SES-05; R3-SES-01 |
| `engine/CONTRACTS.md`, `samples/intakes/*.json` | intake `recovery` (sleep, stress, job) fields → `intake/2` and `checkin/2`; the five v1 sample intakes → the seven R2-GEN-07 plans; shape logic: stairway phases, no × 1.10, recovery week outside the block, block-at-risk offer instead of D6, maintenance length and end prompt, RC weeks, Olympic 4-day split | R2-GEN-04, R2-GEN-07, R2-PER-03/04, R2-VOL-07, R2-PER-06, R2-ATH-03/04 |
| `synthesis/_build_04/render.py` | stale (v1): re-running it would drop v1.1; v1.1 is built by the merge scripts | 04 `_meta.build` |
| `03_volume_dosing.md` observed program totals | still count KB swings as written in the resistance totals (library category); only their muscle credit changed | R2-VOL-05 |
| `02_exercise_catalog` CARDIO list | 14-, 17- and 20-mile distance tests are longer than the half-marathon plan he approved as the longest run: keep out of default tests (02 10.3 #5) | R2-LIB-06 |
| `02_exercise_catalog_crosswalk.json` | AF11 / Z4 still map to the original bench push-up id; the split into hands-on / feet-on records lives in the catalog | R2-LIB-05, LIB-12 |
| `10_equipment_model.md` / `.json` | not re-issued for round 2: client rules for older adults (R2-ATH-08 opt-in), 'NO ACCESS' (R2-LIB-08), home additions (R2-LIB-07), belt squat as the second squat day (R2-SES-02) | round 2 |
| `generator_spec_v1.json` | updated in this step (see `_meta.v1_1_changelog`, step "master v1.1") | - |

### 16.5 Round 3

`round3_questions.json` holds **12 questions** (5 sections, ids `R3-…`), only those that block the engine or the product, each in plain words with a concrete proposal he can accept or correct by voice:

| ID | Question (short) | Blocks | From |
|---|---|---|---|
| R3-VOL-01 | Floor of 10: rear delts keep 4 / 6 / 8 of their own sets with the floor read on the whole shoulders group? Floor only in training blocks (not maintenance, pre- or in-season)? Field athletes' trained chest and back up to 10? | engine start sets, every template's week 1 | R2-VOL-04 vs R2-VOL-06; 04 F2 / F3; 12 §7 |
| R3-VOL-02 | The check-in without the "life" cells: step from effort, sessions done and pain only? | check-in contract | R2-VOL-01 vs R2-GEN-04 |
| R3-VOL-03 | R2-VOL-08 in plain words, with an example | set placement | R2-VOL-08 (not understood) |
| R3-VOL-04 | The stairway numbers (3 % to halfway, 5 % after, scaled to land on the cap in the last week), the check-in read against them, and the planned 3 → 1 RIR drift | the core weekly math | R2-PER-03/04/05, R2-VOL-01 vs VOL-13 |
| R3-SES-01 | "2-4 exercises per muscle": glutes + hamstrings as one "hips" group and delts as "shoulders"? Field athletes: 2-4 per group trained that day inside the 12 cap (cross pattern) or his same-pattern athletic template? | every template | R2-SES-05 vs R2-SES-04; 05 §11.3; 12 vs 05 |
| R3-PER-01 | The recovery week between two finished blocks as an extra week; a holiday marked inside a running block ends that block; when the plan offers (never forces) "stop this block" | block calendar, year plan, check-in | R2-VOL-07, R2-PER-02; 06 §14.3 #1-2 |
| R3-ATH-01 | Swimming: 3 dryland days + 1 optional (2 for younger), 0 extra gym cardio, class 5 (mostly ballistic), 2-week championship taper | the swimming sample plan | COACH-CHAT 2026-10-08; 04 F10, aquatic O4 / O9; 06 §14.3 #6 |
| R3-ATH-02 | 60+ defaults (landing drills only; low ankle hops, plyos, Olympic lifts, depth jumps opt-in) and the 50+ pickleball / padel / tennis rules | older adults, pickleball | R2-ATH-08 vs R2-ATH-02; 04 F9, R3-07, R3-11, GP-4 |
| R3-ATH-03 | 'High rows' = HYROX; HYROX plan: 4 aerobic sessions + 2 station circuits as finishers, not muscle sets; wall balls and 40-rep sets | the HYROX path | COACH-CHAT 2026-10-08; EQ-06, VOL-11; 04 F6, GP-5 |
| R3-ATH-04 | The contact classes, aerobic counts and in-season rule for the sports he did not name; recreational players take their activity's class | every new sport profile | 04 R3-01, R3-03, R3-04 |
| R3-ATH-05 | Stay athletic and active: play days, the activity counting as cardio, an optional event date with a 1-week taper | the stay-active path | 04 GP-1, GP-7, O6; 06 §14.3 #5; 13 N-PROD-18 |
| R3-GEN-01 | Health check and release: our own short screen written with a lawyer (+ a link to the official PAR-Q+); the release accepted at every build or rebuild incl. each new block | launch | R2-GEN-03; 13 N-PROD-13, -15, -16 |

Not asked (defaults kept, can be raised later): the Pro setting numbers; the block-at-risk triggers; the same start after a cancelled block; Olympic % opt-in (13 N-PROD-20); the failed answer (his own "Couldn't do it", 13 N-PROD-19); "send us your video" contact; competitive Olympic weightlifting template (v2); Spanish names (approved process, lines to come); neck work; taekwondo class; run plans beyond the half marathon.

---

## Appendix A. His labels (verbatim) → canonical names (v1.1)

| Verbatim (his spelling) | Canonical | Basis |
|---|---|---|
| 'TRIPPLE EXTENSION' | triple extension | FIX-04 |
| 'SAGITAL' | sagittal | FIX-04 |
| 'INTERMIDIATE' / 'MODERATE' | intermediate (exercise level L2) | FIX-04 |
| 'BILATERAL HIP DOMNANT' | bilateral hip dominant | FIX-04 |
| 'ABdution' | side-delt (abduction) slot; rear delts tracked apart; KB face pulls live here | VOL-17; R2-LIB-04 |
| 'NOVICE', 'NEWBY' | Level 1 (the same thing) | PRG-05 |
| 'INTERMEDIATE' (client) | Level 2 | PRG-05 |
| 'STARTING / MID / ADVANCED OFF SEASON' | blocks or athlete levels, as needed | PRG-04 |
| 'JUSTICE LEAGUE' | Athletic Performance - Non-Competitive; profile `weekend_warrior`; the "A bit of everything" tile of "Stay athletic and active" | ATH-13, FIX-03; COACH-CHAT 2026-10-08 |
| 'NO ACCESS' (two hidden tabs) | **a self-serve version without coach access, full gym library** (not no-equipment) | **R2-LIB-08** |
| 'LEFT TEST' | L-test / L-drill (3-cone) | LIB-01 |
| '5/10/05' (stored as a date) | 5-10-5 pro-agility shuttle | LIB-01 |
| 'Snatch', 'Clean', 'Clean & Jerk' | Squat Snatch, Squat Clean, Squat Clean & Jerk (3-5 reps per set) | LIB-07; R2-ATH-05 |
| 'Hang cleans @ 75%' … '@ 90%' | the 4×8 → 4×4 ramp, kept for DB/KB and pull variants | PER-09; R2-ATH-05 |
| 'Pull under' | lat pull-over (cable) | LIB-09 |
| 'Kong Row' / 'con row' | double-KB row from the floor | LIB-09 |
| 'KB Face Pulls' (under VERTICAL PULL) | shoulder work (side / rear delts / traps) on pull or shoulder days | LIB-10; R2-LIB-04 |
| 'Bench Push ups' | two records: hands on bench (foundational), feet on bench (advanced) | LIB-12; R2-LIB-05 |
| 'Single Leg Get Ups' | box pistol | LIB-09 |
| 'Low DB Squats' | DB squat with the DBs hanging at the sides | LIB-09 |
| 'Alternating DB/Barbell Deadlifts' | alternating staggered-stance single-leg deadlift | LIB-09 |
| 'Camporini Deadlifts', 'strap rotating in/out' | removed | LIB-09 |
| 'LEG CURLS' / 'LEG FLEXION' | LEG FLEXION (`RP.LF`) | CAT-09 |
| 'ZONE 1/2/3' (cable curls, triceps) | Davidson zone (rotation-bias tag) | CAT-10; R2-LIB-02 |
| 'ZONE 1/2/3' (Sheet23 plyos: 'Receive pause/creat' … 'Repeat receive create') | **Receive-Create stages** RC1 Land / RC2 Land & Go / RC3 Repeat | CAT-10, CAT-11; **R2-ATH-03** |
| 'GET INTO THE HIP' / 'GET OUT OF THE HIP' | contralateral / ipsilateral load | CAT-13 |
| '12/10/8 -20' | pyramid 12 / 10 / 8, then a light 20 | PRG-07 |
| '10/10' | 10 per side (one set) | PRG-07, UNI-01 |
| 'VOL 1' / 'VOL 2' / 'VOL 3' | athlete rep phases, one per block | PER-11 |
| 'the work' / 'the accessory' / 'the nuance' / 'the survival' | strength roles 1-4 | ORD-07 |
| 'MYO SET' | 15 + 5 × 5 with short pauses; last exercise; counts as 2 sets | VOL-15; INFERRED count |
| 'WEIGHT USED or SCORE' | load, or times / rounds / distances | PRG-08 |
| "10 - I'm done" | the most I could do, and I made it (0 RIR; not a fail) | R2-VOL-02 |
| "Couldn't do it" | the failed set (one level down or assisted next time) | GEN-05; R2-VOL-02 |
| "start at a 2 and end at an 11" | the felt level of the week (overall volume and loading), shown as the stair level | R2-PER-05 |
| '21.6 mile run' | removed from plans and tests (his "marathon"; a marathon is 26.2 mi) | LIB-18; **R2-LIB-06** |
| 'park queue' (spoken) | PAR-Q (Physical Activity Readiness Questionnaire) | R2-GEN-03 |
| 'high rows' / 'high-raw athletes' (spoken) | HYROX (fitness race) | INFERRED (COACH-CHAT 2026-10-08, EQ-06, VOL-11); R3-ATH-03 |
| 'FULL TIME' / 'HALF TIME' (CrossFit) | competitor / class member | PRG-10 |
| 'Buy out' | conditioning finisher (CA.BUY) | OBSERVED |
| 'LACTATE CLERANCE', 'BEGGINER', 'RECCOMENDED', 'Coppenhaggen', 'Harmstring', 'Glidder', 'Sqats', 'presercibe', 'INTENSIONALLY' | lactate clearance, beginner, recommended, Copenhagen, hamstring, glider/slider, squats, prescribe, intentionally | FIX-04 |

---

## Appendix B. How this file was built and checked

**v1.1 (2026-10-08)**
- **Read in full first**: `coach_answers_round2.md` (47 entries: 45 round-2 questions + LIB-10, LIB-12). Verdicts counted with the team venv: 38 RIGHT (20 with no words, 18 with words), 3 PARTLY, 2 NOT RIGHT, 4 answered in words without a chip (R2-VOL-08 not understood).
- **Read for v1.1**: the v1.1 change logs, resolution tables, pending lists and generator-facing rules of 01, 02, 03, 04 (incl. the sports merge and the sport verification), 05, 06, 11, 12 and 13; `generator_spec_v1.json` (incl. its `_meta.v1_1_changelog` pending cross-references); the coach's request of 2026-10-08 (every popular US sport, swimming, pickleball, HYROX).
- **Recomputed** with the team venv: the stairway λ and whole-set curves for 8 and 12 weeks (L1 / L2 / L3 big, small, rear delts, priorities) - identical to 12 §3.7.1 and 06 §7.1-7.2; the per-sport summary in §9.4 from `04_profiles.json` v1.1 (127 profiles) and the spec's F11 picker (52 sports).
- **Cross-file decisions** for round 2 added to §0.3 and mirrored in `generator_spec_v1.json > _meta.integration_decisions`; fixes owed by other files listed in §16.4.
- **Retired ideas** (readiness score and life input, intake sleep / stress / job, target-seeking, acclimation and 8-week caps, × 1.10 start, triggered or mid-block deloads, effort 10 = fail, KB-swing glute credit, hinge glutes 0.5, small starts 8 and small caps, floors 4 / 2, 1-2 exercises per muscle on full-body days, a once-a-week Olympic cap, mid-block tests, 1RM or max mile from zero, videos as a launch requirement, the 21.6-mile run) appear in this file only as retired entries, v1 history or verbatim cell quotes.
- **Coverage**: every round-2 answer (R2-* plus LIB-10 and LIB-12) is traced to a section here and a key in the spec in `coverage_matrix_round2.md`.
- **Not done here**: no Google Sheet was opened or changed; no synthesis file was edited (their remaining fixes are in §16.4); this step wrote `BLAZE_CAMP_BRAIN.md`, `BLAZE_CAMP_BRAIN_v1.md` (archive copy of v1), `generator_spec_v1.json`, `coverage_matrix_round2.md` and `round3_questions.json`.

**v1 (2026-10-08, history)**: built from `coach_answers_full.md` (138 of 140 answered) and `coach_answers.md`, the v1 synthesis files and the v0 master (archived as `BLAZE_CAMP_BRAIN_v0.md`); the VOL-07 placement sequence and the v1 12-week curves were recomputed; a coverage audit traced all 138 answered questions to the master and the spec (`coverage_matrix.md`) and fixed hinge glute credit 0.5 → 0.25, the bodybuilder upper-body share, the L1 priority cap, FIX-02 cardio menus, the V1 safety check, the P6 cross-reference, the L1 acclimation tag, 'Justice League' as a sheet-tab quote, the youth example rule and push press from L1.
