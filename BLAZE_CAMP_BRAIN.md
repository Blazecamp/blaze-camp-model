# BLAZE CAMP BRAIN v1.4: the coach's confirmed system

**What this is.** The master document of the Blaze Camp model: a complete coaching model from the experience of **Coach Lalo (Gerardo Vera), Master NASM coach** (Blaze Camp, IG @BLAZECAMP; BFit Studios Corp.). It is his intellectual property: his way of condensing and consolidating how he classifies, doses, orders and periodizes training, and the workflow he uses to put a program together (COACH-R4 R4-REL-03). It is written so that (1) the coach can check every rule against what he believes and (2) an engineer can build the plan generator. People enter a few answers and get **a complete template at once** (12 weeks, 8 weeks, maintenance, a season or a yearly plan in his style). The plan is sized by the number of exercises per session, is built on his own day templates and has its stairway built in. Then they or their coach edit it as they need. The machine-readable twin is `generator_spec_v1.json` (version 1.4.0).

**Version.** v1.4, 2026-10-13: v1.3 plus the coach's round-5 answers (`coach_answers_round5.md`: 43 answers, including his grades of the 8 sample plans) and his chat answers CH5 (`coach_answers_chat_2026-10-11.md`) and CH6 (`coach_answers_chat_2026-10-13.md`). **Section §0e lists what v1.4 changed**; the rules in sections 1-16 are edited in place where round 5 changed them (each edit names its R5 / CH id). Round 5 and the chats reach the compiled model (`model/` 1.4.0, engine 0.7.0) through the compiler layers `tools/fixture/v06-*.mjs` and `v07-*.mjs`; the row-by-row trace is `coverage_matrix_round5.md`. **Authority order (v1.4): round-5 answers with CH5 and CH6 (the chats on their own subjects) > round-4 answers and CT-01 > CX-01..04 > ... as below.** The v1.3 master is archived as `BLAZE_CAMP_BRAIN_v1_3.md`.

**v1.3 (kept as written).** v1.3, 2026-10-11. Built on the coach's round-4 answers (`coach_answers_round4.md`: 20 answers, read in full first), his clarification on session time (`coach_answers_time_2026-10-10.md`: CT-01) and his clarifications on progression and editing (`coach_answers_codex_2026-10-10.md`: CX-01..04). **Authority order: round-4 answers and CT-01 > CX-01..04 > round-3 answers (`coach_answers_round3.md`) > round-2 answers (`coach_answers_round2.md`) > round-1 answers (`coach_answers_full.md`) > his chat statements (`coach_chat_statements.md`, `coach_answers.md`) > OBSERVED sheet facts > INFERRED / SCIENCE / PROPOSED.** The v1.2 master is archived as `BLAZE_CAMP_BRAIN_v1_2.md` (as it stood before this pass, with the one-row Z-press correction made during the engine v0.5 work); v1.1 as `BLAZE_CAMP_BRAIN_v1_1.md`, v1 as `BLAZE_CAMP_BRAIN_v1.md`, v0 as `BLAZE_CAMP_BRAIN_v0.md`. The synthesis documents 03, 04, 05, 06, 11, 12 and 13 each carry a v1.3 section and in-place edits for the same answers. The machine-readable rule files in `synthesis/*.json` were **not** re-issued in v1.3: the compiler applies the v1.3 rules on top of them (`tools/fixture/v05-*.mjs`), and the compiled runtime model in `model/` (1.3.0, engine 0.5.0) carries them. No Google Sheet was opened for writing. Every round-4, CT and CX answer is traced to a section here and a key in the spec in §0d.5 and, row by row, in `coverage_matrix_round4.md`.

**Start here.** Section **0e** lists what v1.4 changed (round 5, CH5, CH6). Section **0d** lists what v1.3 changed, the readings the coach should see and what is retired. Sections 1-16 carry the rules in place; superseded rules are marked "retired" with the ID that retired them (round 2 in §0b, round 3 in §0c, round 4 / CT-01 / CX in §0d).

**How each section reads.** Confirmed rules first (with the question ID that set them), then the supporting evidence, then anything PROPOSED or pending. Numbers that the coach did not give are always marked.

### Evidence labels

| Label | Meaning | Weight |
|---|---|---|
| **COACH-R4 <ID>** | The coach's round-4 answer (`coach_answers_round4.md`, 2026-10-11), e.g. COACH-R4 R4-SES-05. A RIGHT chip with no text makes our proposal his rule; RIGHT with words, PARTLY and NOT RIGHT mean his words define the rule. | **Highest.** |
| **COACH-CT CT-01** | His clarification of 2026-10-10 (`coach_answers_time_2026-10-10.md`): session time is the user's responsibility. It supersedes earlier answers only on fitting plans into a session length. | **Highest**, with round 4. |
| **COACH-CX CX-01..04** | His clarifications of 2026-10-10 on progression and editable templates (`coach_answers_codex_2026-10-10.md`). They supersede earlier answers only on those subjects. | Authoritative unless round 4 or CT-01 changed it. |
| **COACH-R3 <ID>** | The coach's round-3 answer (`coach_answers_round3.md`, 2026-10-09), e.g. COACH-R3 R3-VOL-04. A RIGHT chip with no text makes our proposal his rule; RIGHT with words and PARTLY mean his words define the rule. | Authoritative unless round 4, CT-01 or CX changed it. |
| **COACH-R2 <ID>** | The coach's round-2 answer (`coach_answers_round2.md`), e.g. COACH-R2 R2-VOL-06. LIB-10 and LIB-12 are the round-1 leftovers answered there. | Authoritative unless round 3 changed it. |
| **COACH-ANSWER <ID>** | The coach's round-1 questionnaire answer (`coach_answers_full.md`), e.g. COACH-ANSWER VOL-07. | Authoritative unless round 2 or 3 changed it. |
| **COACH-CHAT** | His statements relayed in chat (`coach_answers.md`; **COACH-CHAT 2026-10-08** = his request for every popular US sport, swimming, pickleball and HYROX, quoted in §9.10; 06 calls it "COACH-R2 REQ"). | Authoritative in meaning; an answer wins where they differ. |
| **APPROVED** | A PROPOSED item he marked RIGHT in round 2, 3 or 4 (always shown with its COACH-R2 / COACH-R3 / COACH-R4 ID). | His rule. |
| **RETIRED** | A rule or feature a coach answer removed (the ID is given); kept only as a short note so nobody rebuilds it. | None. |
| **OBSERVED** | Read from a sheet cell, tab, colour or dropdown; labels quoted verbatim with his spelling ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT'). | Evidence of how he has written programs. |
| **SCIENCE** | Published research or a named practitioner source (references in 07, 10b, 12, 13, 04). | Fills gaps and checks his numbers; never overrules an answer. |
| **RESEARCH** | Product, price, platform or legal facts from public pages (13, accessed 2026-10-08). | Re-check before acting. |
| **INFERRED** | The team's reasoning from the sheets or answers. | A default until he confirms. |
| **PROPOSED** | Short for **PROPOSED - PENDING COACH APPROVAL**: our design where he asked us to propose or left a gap. | Ships only after his yes. |
| **LEGAL REVIEW** | Health-check, terms, release and disclaimer wording (13 §12; `DISCLAIMER.md` / `DISCLAIMER.es.md`) that must go to a lawyer before it ships. | Placeholder only. |
| **DORMANT** | Kept as an archive of sheet content, never used by the generator (variable resistance, EQ-01 / EQ-12). | None. |

**Cell shorthand.** BYOP = 'BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL' workbook; MM = 'BLAZE CAMP MASTER MODEL'; LIB = BYOP 'MASTER EXERCISE LIBRARY'; SQ = MM 'ALL ABOUT SQUATS'; 4T = MM '(NOT DONE) 4 TRACKS PROGRAMMING'; AE = 'AEROBIC CAPACITY CHEAT SHEET'; S23 = 'Sheet23'; JL = the BYOP tab 'JUSTICE LEAGUE' (a tab name only: the program is "Athletic Performance - Non-Competitive", COACH-ANSWER ATH-13, FIX-03).

### Where the full version of each section lives

| Section here | Full version (in `synthesis/` unless noted) |
|---|---|
| 1 Philosophy | `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_chat_statements.md`, `coach_answers.md`; 01 §0; 07 §0 |
| 2 Segmentation | `01_taxonomy.md` / `.json` v1.1 (91 nodes, 47 facets, 255 values; not re-issued in round 3: the focus groups of R3-SES-01 live in spec `vocab.muscles.focus_groups`) |
| 3 Levels | 01 §1-2 (F.DZONE, F.LOADPOS); `10_equipment_model.md` §1.4; `11_training_variables.md` v1.2 §1.2; 12 v1.2 §3.2 |
| 4 Library | `02_exercise_catalog.md` / `.json` v1.1 (939 records, 732 active; not re-issued in rounds 3 or 4: the v1.3 library rules of §4.1b are applied by the compiler, and the third-party video links were emptied from the JSON), `02_no_equipment_subset.md` v1.1 |
| 5 Volume engine | `12_volume_algorithm_v1.md` / `.json` (v1.3 section first: no time-fitting, the endpoint stairway, allocation over the template slots, the 2-day rule; then the v1.2 content: the approved stairway pattern, groups and the shoulders line, Focus muscles, editing; its time-vs-minimums sections and worked examples are marked retired); `03_volume_dosing.md` v1.3 / `03_volume_rules.json` v1.2 |
| 6 Bilateral vs unilateral | 12 §3.11; 11 §3.7; 04 v1.2 `bilateral_unilateral_model`; 05 §4.5 |
| 7 Training variables | `11_training_variables.md` / `.json` v1.2; `10b_equipment_variables_science.md` |
| 8 Equipment | `10_equipment_model.md` / `.json` (v1; rounds 2 and 3 applied here, in 02 v1.1 and in the spec); 10b |
| 9 Athletes and "stay athletic and active" | `04_athlete_profiles.md` / `04_profiles.json` v1.2 (127 profiles: 93 competitive, 31 recreational, 3 goal; 81 variants; 52 picker sports; 26 activities; a v1.2 group audit on 194 profiles and variants; checks C1-C32) |
| 10 Sessions and weeks | `05_session_architecture.md` v1.3 / `05_templates.json` v1.2 (the 30 split templates; the compiler rebuilds the gym and athletic days on his A / B / C skeletons and push / pull / legs with a rank and an exercise count per day, R4-SES-02 / R4-SES-05; block ids and toggles; superset recommendations; the time-vs-minimums table §8.7.1 is retired) |
| 11-12 Plans, tests | `06_periodization.md` v1.3 / `.json` v1.2 |
| 13 Generator | this file §13 + `generator_spec_v1.json` 1.4.0 (incl. the v1.3 objects listed in §0d.5, `plan_editing`, `legal_and_privacy`); the working engine is `engine/` 0.7.0 (experimental, R4-REL-01) |
| 14 Product | `13_product_options.md` v1.3; `DISCLAIMER.md`, `DISCLAIMER.es.md`, `LICENSE` |
| 15 Science | `07_science_lineage.md`; 10b; 12 §2 (incl. §2.11 on "20-30 sets") and §8; 06 §12; 04 references; 13 references |
| 16 Open items | this file §16 and §0d.3; `coverage_matrix_round3.md` (round 3), `coverage_matrix_round2.md`, `coverage_matrix.md` (history); `coverage_matrix_round4.md` (round 4, CT-01, CX-01..04; the short form is §0d.5) |

---

## 0. What changed since v0 (short; v1 history - the v1.1 changes are in §0b, the v1.2 changes in §0c, the v1.3 changes in §0d)

### 0.1 The answers in numbers

140 questions: **84 RIGHT**, **18 PARTLY** (UNI-08, UNI-09, VOL-02, VOL-17, ATH-07, ATH-09, ATH-13, ORD-05, ORD-10, EQ-10, LIB-02, LIB-07, LIB-13, LIB-16, PRG-02, PRG-03, PRG-04, PRG-06), **4 NOT RIGHT** (PER-01 plan shapes, ATH-11 core placement, EQ-11 machine ranking, EQ-12 variable resistance), **30 answered in words without a chip**, **2 skipped** (PRG-01, FIX-01), **2 unanswered** (LIB-10, LIB-12; both answered in round 2). Counted with the team venv from `coach_answers_full.md`.

### 0.2 The 24 changes that moved the generator most in v1 († = changed again by round 2, see §0b; ‡ = changed again by round 3, see §0c; § = changed again in v1.3, see §0d)

| # | v0 (team inference) | v1 (coach's rule) | ID |
|---|---|---|---|
| 1 †‡§ | Weekly 3 / 5 / 7 % picked by muscle size | One 3, 5 or 7 % step per **person** per week; coach can set it; 10 %/week is "way too much" (**v1.1: the stairway**, §5.4) | VOL-05, UNI-05, VOL-04 |
| 2 | 15-20 sets read as the peak week; start back-solved | **Starting** sets: beginner 10-12, intermediate 15-20, advanced 20+; 15-20 = maintenance to some growth, 20-25 = growth | VOL-01, UNI-01 |
| 3 † | Helpers 0.5; glutes 1.0 from every hinge and lunge | Helpers **0.25**; dips 0.5 / 0.5; athletic work never counts (**v1.1: KB swings count 0; thruster 1 / 0.5 / 0.25**) | VOL-09, LIB-16, VOL-10 |
| 4 | Release 1-2 sets at a time, round-robin | Bank the fraction, add **one** whole set, to the **first exercise of the day first** (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3) | VOL-06, VOL-07 |
| 5 †‡§ | Max 2 exercises per muscle per session | **3-4 exercises per muscle group per day**; bonus exercise for small muscles (**v1.1: full-body days 2-4, never 1**) | VOL-07 |
| 6 | Bilateral share 35-70 % by goal | A **90/10 ↔ 10/90 slider** by athlete, phase and pain | UNI-02, UNI-03, UNI-10 |
| 7 | Contralateral loading as the default | Contralateral pulls you **into** the hip; ipsilateral helps you **out** of it | CAT-13 |
| 8 ‡ | Core primer for athletes only | **Core first for everyone** (the warm-up), movable (**v1.1: light 2 × 2; core supersets anywhere**) | ATH-11 |
| 9 | Vertical vector free; Bootcamp 1 Tue/Fri as written | **Hip-dominant + push, knee-dominant + pull**; Bootcamp 1 Tue/Fri was a mistake | UNI-11, ORD-06 |
| 10 † | Two squat exposures a week | **Load the spine once a week** (**v1.1: heavy squat and heavy deadlift on two different days, approved list**) | PER-04, EQ-11 |
| 11 † | 6 = 5 + deload; 8 = 7 + deload/test; 12 = 6 + mid deload + 5 | 4-6 weeks = maintenance; 8 weeks start hard; 12 weeks preferred (**v1.1: every plan a stairway; no deload inside a block**) | PER-01 |
| 12 †‡ | Deload back to ~week-1 volume | Deload = **about half the sets** (**v1.1: half of the hardest week, only between blocks**) | PER-05 |
| 13 † | Plyo zones Z1-Z3 as an exercise property | A **method** (receive & pause → receive then create → repeated) (**v1.1: "Receive-Create stages", approved**) | CAT-10, CAT-11 |
| 14 | "Zone" = level | Davidson zones are **rotation biases**; level from **load position**, skill and stability (**v1.1: approved**) | CAT-04, CAT-10 |
| 15 | Bands, chains, weight releasers | **None** anywhere for now | EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 |
| 16 | Machine ranking | **Not ranked**; belt squat = no axial load | EQ-11 |
| 17 †‡ | Olympic lifts for intermediate+ only | **Everyone in athletic training** gets Olympic lifts (**v1.1: up to 4 × a week; 60+ off by default**) | ATH-10 |
| 18 ‡ | Plyo dial by contact counts | Plyo vs ballistic set by **ground-contact time** (**v1.1: shares approved**) | ATH-01, ATH-02 |
| 19 | Sex on the form | **No sex field, no sex-based rules** | GEN-02, ATH-09 |
| 20 | Levels L1-L4 | **L1-L3** by years of training; 6-12+ months off → L1 body | PRG-05 |
| 21 †‡§ | 60-min reference session | 5-7 exercises (45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); field athletes up to 10-12 (**v1.1: 12 + the 2-exercise core block**) | VOL-08, VOL-16, UNI-09 |
| 22 | Medball for everyone | **No medball for aesthetics** except warm-up; never over 20 lb | ATH-05, EQ-06 |
| 23 †‡ | 2-3 aerobic sessions by level | 3 general, 2 athletes in season, 4 aesthetics + walks (**v1.1: adjustable by the user; athletes by sport**) | ATH-07 |
| 24 †‡ | Output = a Google Sheet | Undecided; PROPOSED website (**v1.1: approved, with fewest clicks, macro views, screenshots**) | GEN-03 |

### 0.3 Cross-file decisions this master takes

Where two synthesis files disagree, the generator follows the column "Adopted" until the coach decides. Every row is mirrored in `generator_spec_v1.json > _meta.integration_decisions`. Rows settled by a later round keep their row with the new status; v1.1 and v1.2 rows are added at the end.

| Topic | One file says | Another says | Adopted here | Status |
|---|---|---|---|---|
| Hand-set weekly step | 12 v1: coach may set 0-7 % | 03: 0-7 % | **0-7 % by hand, set by the coach at build time; the person's total weekly sets strictly below +10 %** (one whole set may always be added, PROPOSED) | COACH-ANSWER UNI-05, VOL-05; COACH-R2 R2-VOL-01 ("never more than 7 % a week"); v1.2: the check-in maximum is retired with the check-in (COACH-R3 R3-VOL-02); **v1.3: the 7 % and 10 % limits are retired as hard limits** (COACH-CX CX-01; COACH-R4 R4-PRG-02): about 3 % / 5 % stays the default pattern, steps may be faster to reach the planned final sets, and a week that adds more than about 15 % carries a note |
| Default sets in athletic templates | 12 v1: 3 / 2 / 3 | 03, 05: 2 per slot | **2 per slot in athletic templates**; 3 compound / 2 isolation / 3 calves elsewhere | COACH-ANSWER VOL-16 |
| RIR in the hardest weeks | 12 v1: "RIR toward 1" | 03: 1-3 RIR always, no ramp | **1-3 RIR on every working set; the planned drift 3 → 2 → 1-2 → 1 RIR + intensifiers in the last week stays inside that band** | COACH-ANSWER VOL-13; COACH-R2 R2-PER-05; **Settled: APPROVED, COACH-R3 R3-VOL-04** (the VOL-13 flag is closed) |
| Exercises per resistance session | 12 v1: 5-7, 8 PROPOSED | 03, 05: by length | **45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9**; every group gets 2-4 exercises on each day it is trained (full-body days grow) | COACH-ANSWER VOL-08, VOL-16; COACH-R2 R2-SES-05; groups COACH-R3 R3-SES-01; **v1.3: sized by client type, not by minutes** (general / fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6; COACH-R4 R4-SES-02; CT-01); a full-body day is his A or B day of about 6 exercises, up to 8 (R4-SES-05) |
| Priority add by level | v1 master: +4 / +5 / +6 | 12 v1.1: +4 (L1-L2) / +6 (L3) | **v1.2: Focus muscle 1 / 2 (intake) get +1 to +3 extra weekly sets each (default +2) on start and ceiling, bounded by 18 / 26-28 / 30; the +4 / +4 / +6 priority push (others ≤ 3 %) is an optional coach setting only** | **Settled by COACH-R3 R3-SES-01**; default +2 PROPOSED |
| Full Olympic lifts | 12 v1: L3 only | 03, 04, 06, 10: L2+ | **L1 and early L2: DB/KB snatch, hex-bar jumps, hang pulls/cleans; L2+: full scope** | COACH-ANSWER ATH-10; 12 v1.1 fixed |
| Glute credit on hinges | 01, 12 v1: 0.5 | 02: 0.25 | **0.25** on squats, lunges, deadlifts and RDLs; hip thrusts and bridges 1.0; **KB swings 0** | **Settled**: COACH-R2 R2-VOL-05 |
| Plyo share by sport | 12 v1: per-sport start → end | 04: class map 75/60/50/40/25 % | **Class map = end-of-block share of jump and throw work; each block starts 15 points more ballistic** (v1's "floor 20" dropped everywhere: 04 v1.2 removed its class-5 floor, so 25 % sports start at 10 %); R3-ATH-04 adds the remaining sports | **Settled**: COACH-R2 R2-ATH-01; COACH-R3 R3-ATH-04 |
| Weekly jump-contact targets | 03 §9.11 totals | 04 §5.1 tier dials | **04's two dials**; 03's totals as an upper reference | PROPOSED |
| Plyo method stage weeks | 12 v1: 1-2 / 3-5 / 6+ | 04: by plan length | **12-week 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8** | **Settled**: COACH-R2 R2-ATH-03 |
| Weekly step mechanism | 12 v1: readiness score R | 13 v1: effort × life table | **v1.2: the planned stairway only, computed once when the plan is built**; the optional check-in, its step table and the readiness score are retired | **Settled** by COACH-R3 R3-VOL-02, R3-VOL-04 (stairway APPROVED in numbers); history: COACH-R2 R2-PER-03/04, R2-VOL-01/03, R2-GEN-04 |
| Field-athlete exercise cap | VOL-08 "max maybe 12" | VOL-17 "12 to 14" | **12 + the 2-exercise core block; inside it 2-4 exercises for each group trained that day; cross pattern by default (2 jump / throw stations + 1 Olympic lift), the same-pattern athletic template (3-4 jump stations + 1 Olympic lift) for size-focused and high-level athletes** | **Settled**: COACH-R2 R2-SES-04; COACH-R3 R3-SES-01 |
| Thruster credit | VOL-09 helpers 0.25 | LIB-14 0.5 shoulders | **1.0 quads + 0.5 shoulders + 0.25 glutes** | **Settled**: COACH-R2 R2-VOL-05 |
| 'JUSTICE LEAGUE' program name | 01 | 05, 11 | **"Athletic Performance - Non-Competitive"**; profile `weekend_warrior` | COACH-ANSWER ATH-13, FIX-03 |
| Equipment profile ids | v0 ids | 10 v1 | **10 v1 ids** | COACH-ANSWER EQ-01 |
| Leg-flexion bucket id | RP.HD.ISO | RP.LF | **RP.LF** | COACH-ANSWER CAT-09 |
| **v1.1** 60+ default for low ankle hops | 05 v1.1: "landing drills and low ankle hops are fine" | 04 (flag F9), 06, 12, 03, 11, 02 v1.1: hops opt-in | **On by default: landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work. Off by default, switchable with his warning: low ankle hops, other jumps, Olympic lifts, depth jumps. Out: overhead and low-bar squats** | **Settled: APPROVED, COACH-R3 R3-ATH-02** (05 v1.2 fixed) |
| **v1.1** Swimming contact class | 12 v1.1 §3.13 text: class 4 (40 %) | 04 v1.1 sport verification: class 5 (25 %) | **25 % plyometric at block end (10 % at start)**: starts and turns are single big efforts | **Settled: APPROVED, COACH-R3 R3-ATH-01, R3-ATH-04** (12 v1.2 fixed) |
| **v1.1** Olympic-lift percentages | 06, 11, 12 v1.1: "% only if that lift was tested" | 13 v1.1 / spec output: no % by default even when tested; coach opt-in | **Both hold together**: a % may appear only when that exact lift has a tested best and only if a coach switches it on, or for competitive weightlifters' own programming; everyone else gets RPE/RIR and "move it fast" | COACH-R2 R2-GEN-06, R2-ATH-05; coach opt-in PROPOSED (13 N-PROD-20) |
| **v1.1** Muscle groups for "2-4 exercises per muscle" | 12 v1.1: his FOCUS headers, glutes and hamstrings separate | 05 v1.1 templates: glutes + hamstrings = one "hips" group | **FOCUS groups: hips = glutes + hamstrings (RDL + hip thrust + leg curl = 3 hip exercises); shoulders = front + side + rear delts; calves one exercise × 3 sets per leg day; the floor of 10 is counted on the same groups** (glutes and hamstrings keep their own starting lines for display) | **Settled: APPROVED, COACH-R3 R3-SES-01, R3-VOL-01** |
| **v1.1** The failed set | 12 v1.1: a separate optional 'Failed' answer | 13 v1.1: his own "Couldn't do it" | **Retired with the check-in**; "Couldn't do it" stays an option of the HOW IT FELT? column in the downloaded sheet the person keeps | **Settled** by COACH-R3 R3-VOL-02 |
| **v1.1** Depth jumps and snatches for 60+ who opt in | 04 GP-4: depth jumps stay off even with the opt-in | 02 v1.1, 12: R2-ATH-08 opt-in covers them; EQ-03 "never" kept for injured / high-volume clients | **Depth jumps and Olympic lifts: off by default for 60+, switchable with the warning (R3-ATH-02 wins over EQ-03 for older adults). Snatch variants stay out for 60+ (EQ-03; R3-ATH-02 did not name them).** Overhead and low-bar squats stay out; injured / high-volume clients never snatch or depth jump | COACH-R3 R3-ATH-02; COACH-ANSWER EQ-03; snatch reading INFERRED (04 flag G2; round 4) |
| **v1.2** Ceiling vs step size | 12 / 06 / 03 / 11 v1.2: keep about 3 % / 5 % (λ ≤ 1); the ceiling is a maximum | his approved words also say each muscle "reaches its ceiling exactly in the last week" (R3-VOL-04) | **Keep the step sizes; the ceiling is a maximum.** Lines whose range is wider than the standard steps peak below it, still in the last week (12-week L2 / L3 shoulders and arms 12 → 18 and 15 → 23 against 22 / 25; 8-week lines under the 12-week ceilings) | **Settled in v1.3: the planned final sets are reached**; steps may be faster than 3 % / 5 % when needed (COACH-CX CX-01; COACH-R4 R4-PRG-01, R4-PRG-02). The 12-week L2 / L3 shoulders and arms now run 12 → 22 and 15 → 25 (§5.4) |
| **v1.2** Step-2 ceiling of the time policy | 12 prototype (`tvm.py`): keep-time ceiling = week-1 sets + the level's climb (can pass the level ceiling: example 5.1 shoulders 16, biceps 15 against 14) | 12 §3.7.1: the level ceiling holds | **Clamp the keep-time ceiling to the level ceiling (never below week 1 + 2 sets)**; with the clamp the 4 × 60 client of 12 §5.1 also leaves biceps to compound credit; 12's published 5.1 numbers are the unclamped run | **RETIRED in v1.3 with the time policy** (COACH-CT CT-01) |
| **v1.2** Focus groups in the time check | 13 v1.2 / spec: keep the Focus groups trained directly when groups are trimmed | his approved order names "big movers first; arms, calves and rear delts only from compound credit" (R3-SES-02) | **Keep order: Focus and sport-pinned groups (e.g. calves for racket players 50+) → hips, quads, back, chest → shoulders, calves, triceps, biceps**; the coach approved only "big movers first" | **RETIRED in v1.3 with the time check** (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-04: nothing is dropped automatically) |
| **v1.2** Next block one step up with nothing stored | 06 v1.2: ask "Did you just finish a block?" | 12 / 11 v1.2: ask "blocks completed in a row" (0 by default) | **The rebuild asks how many blocks were completed in a row (F25c count) and whether the last one was finished (F25c.last_block_finished)**; each completed block → start × 1.05, ceiling + 1 | R2-VOL-06 (APPROVED step); input PROPOSED (06 §14.5 #2; R3-GEN-01). **v1.3: the next block starts about 5 % above the last block's start, in whole sets, never above the level's top; "ceiling + 1" is retired** (COACH-R4 R4-PRG-04) |
| **v1.2** The year's Q1 cut | R2-PER-01: "start cutting (sets stay at the starting level)" | R3-SES-02 step 4: "the stairway climbs ... never flat" | **Kept**: Q1 sets stay at the starting level (his specific rule for the cut quarter); the week still climbs by cardio, density, load and RIR (the 2 → 11 stair); R3-SES-02's "never flat" is about time-short plans | **Settled in v1.3**: a week or a block may keep the same sets while reps or load progress (COACH-CX CX-02, CX-03); "never flat" is retired with the time policy (CT-01) |
| **v1.2** December holiday maintenance | R2-PER-01: "last 2 weeks of December automatic maintenance" | R3-PER-01: "maintenance weeks are a recommendation. They don't have to be mandatory" | **Printed in the year by default; a recommendation the person can switch off or move** ("automatic" now means "printed by default") | COACH-R3 R3-PER-01; reading INFERRED |
| **v1.2** Week-by-week mode | PER-01 (a plan length he listed); R2-GEN-01 (it needed the check-in) | R3-VOL-02, R3-VOL-04: no check-ins; the whole plan ahead of time | **Retired as a mode; the code is accepted as an alias of the 12-week plan opening on the Week view** | PROPOSED (13 N-PROD-22; 06 §14.5 #1) |
| **v1.2** Pro setting | 12 v1.1: one priority muscle above 30 needed the weekly check-in | R3-VOL-02: no check-ins | **A coach setting at build time** (L3, one priority-push muscle up to 35, a warning shown) | COACH-R2 R2-VOL-06; numbers PROPOSED |
| **v1.2** 'Goalkeepers 50 %' (R3-ATH-04) | 04 v1.1: soccer, lacrosse and field-hockey goalkeepers at 50 % | ice-hockey goalie with hockey (40 %), water-polo goalkeeper with water polo (25 %) | **Read as the field-sport goalkeepers**; the ice-hockey goalie stays 40 %, the water-polo goalkeeper 25 % | PROPOSED reading (04 flag G1) |
| **v1.2** Lacrosse men's defense | 04 v1.1: class 3 (50 %) | R3-ATH-04: "lacrosse 60 %" | **Class 2 (60 % at block end, 45 % at start)**; its jump / throw budget re-split at the same total | COACH-R3 R3-ATH-04 (04 v1.2) |
| **v1.2** Racket players 50+ | 04 v1.2: `age_50_plus.applies_from_age` 50 on the racket profiles (rec pickleball, padel, tennis; competitive pickleball; competitive tennis + padel variant) | the compile step (`tools/fixture/review-v12.mjs` amendSport) turns that text into plyo exclusions at every age (04 flag G4) | **From 50, with no upper age; from 60 the older-adult defaults also apply; the low-impact jump rule applies only when age ≥ 50** (engine fix owed, §16.4) | COACH-R3 R3-ATH-02 |
| **v1.2** Direct side-delt work in the shoulders line | 12 v1.1: side delts a line of their own (10 / 12 / 15) | 12 v1.2: one shoulders line with group credit | **One shoulders line**; it gives an L2 bodybuilder about 3-4 direct side-delt sets a week, so Focus = shoulders or a V-taper bias restores more | COACH-R3 R3-VOL-01; dose flagged PROPOSED (12 §7 #2, 03 tension 30) |
| **v1.2** Group credit | 12 v1.1: rear delts and side delts counted apart | 12 v1.2: a set counts at most 1.0 to a group (a face pull = 1 shoulder set) | **Group credit** for the floor and the stairway (v1.3: the time check is retired); the engine still reports side, rear and front delts and glutes / hamstrings apart for display | PROPOSED (needed by R3-VOL-01; 12 §7 #1) |
| **v1.2** Removing an exercise in the plan editor | 12 v1.2 §3.10.2: the plan is rebuilt with the exercise excluded and its sets move to the group's remaining exercises that day (VOL-07 order) | 13 v1.2 §14.5 / spec `plan_editing.stairway_after_edits`: the remaining exercises keep their planned sets; the removed sets are not moved anywhere automatically | **13 / spec**: a removal is the person's choice ("they can delete certain exercises"), so nothing is moved behind their back; the note shows the group's weekly sets and its floor; moving the sets stays an option the editor may offer | PROPOSED (mechanism; R3-SES-02); v1.3 keeps it: nothing is moved or dropped automatically, the weekly totals are recomputed and the plan is marked edited (COACH-CX CX-04; COACH-R4 R4-SES-04) |
| **v1.2** Block kinds for editing | 05 / 12 v1.2: `warmup`, `core`, `skill`, `athletic`, `olympic`, `resistance`, `focus`, `conditioning` | 13 v1.2 / spec `plan_editing.block_kinds`: `warmup`, `core`, `athletic`, `olympic`, `strength`, `accessory`, `calves`, `finisher`, `cardio` | **One list for the plan contract (the union)**: `warmup` (always on), `core`, `skill`, `athletic`, `olympic`, `strength` (= 05 / 12 `resistance`; edited exercise by exercise), `accessory`, `calves`, `focus` (optional-day Focus slots), `finisher` + `cardio` (= 05 / 12 `conditioning`); every kind but `warmup` and `strength` can be switched off | PROPOSED (R3-SES-02; spec `plan_editing.kind_map_v1_2`) |
| **v1.3** Exercises per group on a full-body day | R2-SES-05: "2-4 exercises per muscle that day ... there's never one exercise"; CT-01 lists "2-4 exercises per group per day" among what stays | R4-SES-05 (NOT RIGHT to both of our options): a full-body day is his A or B day of about 6 exercises, where biceps (A) and triceps (B) have one exercise | **The template wins on A / B days: 1-4 exercises per group, as his template gives them. Split days (push, pull, legs) keep 2-4 per group** | COACH-R4 R4-SES-05; the "1-4" reading INFERRED (§0d.3 #1) |
| **v1.3** The 7th and 8th exercise of an A / B day | R4-SES-05: "an extra small muscle exercise at the end, or a core" | OBSERVED BYOP A / B days: calves, rear delt, side delt | **A day: calves (7th), rear delt (8th). B day: side delt (7th), calves (8th).** How many print follows the client type's count (R4-SES-02) | OBSERVED + PROPOSED order |
| **v1.3** Laterality dial vs the template's slots | UNI-02 / UNI-03: the bilateral share slides 90/10 ↔ 10/90 by athlete, phase and pain | R4-SES-05 names each slot: "bilateral, symmetrical" squat or hinge in slot 2, "unilateral" in slot 4, a two-arm row first on the A day | **The slot keeps its laterality on his A / B / C days, the athletic A / B / C days and push / pull / legs; the dial moves only the slots the template leaves open** (the vertical pull, isolation details, jump stations) | R4-SES-05 (newest); the athletic-day reading INFERRED, open for the coach (§0d.3 #3) |
| **v1.3** Floor of 10 vs 2 training days | R2-VOL-06: "I don't think anybody needs less than 10 sets a week per muscle" | R4-SES-03: with 2 days every big group is trained at about 6-8 weekly sets | **The floor of 10 applies from 3 training days. With 2 days: every big group starts at 6 and tops at 8 (plus a Focus add), the plan says so and suggests a third day** | COACH-R4 R4-SES-03; the exact 6 → 8 PROPOSED |
| **v1.3** HYROX station picks | R3-ATH-03: station circuits with the race stations | R4-LIB-01: of the optional add-ons only wall balls and sled pushes may be primary, in HYROX (maybe CrossFit) | **Round 4 wins on which record is the pick**: wall balls, sled pushes and his own SkiErg / row / burpee stations are picks; sled pull, burpee broad jumps, farmer carry and sandbag lunges are swaps the person can choose | COACH-R4 R4-LIB-01 |
| **v1.3** "Maybe in the CrossFit program" | R4-LIB-01: wall balls and sled pushes "maybe" primary in CrossFit | - | **On for the CrossFit-style class WOD, with one switch that turns it off** | PROPOSED reading |
| **v1.3** Everyone on their own vs the health check | R4-SCP-01: "Everyone should be able to use the plan on their own" | R2-GEN-03, R3-GEN-01: a refer answer in the health check gives no automatic plan | **The release is required for everyone before a plan is generated; the health check stays as approved in round 3 until he says otherwise** | **answered by COACH-R5 R5-GEN-02: a flag does not stop the plan; the plan is built with a clear warning (engine 0.7)** |
| **v1.3** Credit of the "Chest / Shoulders" slot (B day, slot 3) | 12 credit map: a vertical or incline press counts for shoulders | R4-SES-05 slot 3 "shoulder press or an incline press"; R4-LIB-03 incline first | **A 30-45 degree incline press counts 1.0 for chest; a high-incline press counts 1.0 front delts + 0.5 chest + 0.25 triceps** (so chest can reach its planned sets on an A / B week) | PROPOSED numbers, open for the coach (§0d.3 #5); **answered by COACH-R5 R5-VOL-01: a high-incline press counts 1.0 chest + 0.25 front delts + 0.25 triceps** |

---

## 0b. What changed in v1.1 (history; rows that round 3 changed are resolved in §0c)

### 0b.1 The round-2 answers in numbers

47 answers (45 round-2 questions + LIB-10 and LIB-12): **38 RIGHT** (20 with no words, 18 with words that add to the rule: R2-VOL-04, -06, -07, R2-SES-03, -06, R2-ATH-04, -05, -08, R2-PER-01, -02, -05, -06, -07, R2-GEN-02, -03, -06, -07, -08), **3 PARTLY** (R2-VOL-02 effort 10, R2-SES-05 full-body days, R2-PER-04 12-week shape), **2 NOT RIGHT** (R2-PER-03 "4 + 4 / start hard", R2-GEN-04 lifestyle questions), **4 answered in words without a chip** (R2-VOL-03 no check-in, R2-VOL-05 glute credit, LIB-10 face pulls, and **R2-VOL-08, which he did not understand**). Counted with the team venv from `coach_answers_round2.md`.

### 0b.2 The changes that move the generator most (‡ = changed again by round 3, see §0c.2)

| # | v1 | v1.1 (the coach's rule) | ID | Where |
|---|---|---|---|---|
| 1 ‡ | One 3 / 5 / 7 % step a week chosen by the person's state; 12-week acclimation ≤ 3 %; 8-week "start hard" × 1.10 with 4 + 4 | **Every plan is a stairway**: small steps in the first half, slightly bigger after the halfway week ("but not too much"), the hardest weeks last; on 12 weeks "the last 4 weeks are going to be brutal". Planned steps 3 % to the halfway week, 5 % after, scaled per muscle (λ) so the peak lands on its cap in the last week (numbers PROPOSED) | COACH-R2 R2-PER-03 (NOT RIGHT), R2-PER-04 (PARTLY) | §5.4, §11 |
| 2 ‡ | "Start at a 2 and end at an 11" read as sets | **A felt level of overall volume and loading**, ending "a little bit past your limits"; shown as a 2 → 11 stair level per week; planned effort drifts 3 → 1 RIR inside his 1-3 band (drift PROPOSED) | COACH-R2 R2-PER-05 | §5.4, §11.3 |
| 3 ‡ | Plan-only users stepped by an intake rate (5 % / 3 % for stress, short sleep, physical job) | **No check-in = no adaptation**: the plan runs its planned stairway ("there is no data to go off of") | COACH-R2 R2-VOL-03 | §5.4, §13.5 |
| 4 ‡ | Intake asked sleep, stress, physical job; check-in asked "how was life" | **No lifestyle questions anywhere** ("I just need the workouts here"). The approved check-in table is used **without its life column**: the step comes from effort, completion and pain only (resolution flagged) | COACH-R2 R2-GEN-04 (NOT RIGHT) vs R2-VOL-01 (RIGHT) | §5.4, §13.2, §13.5 |
| 5 ‡ | Effort 10 = "failed or wrecked" | **Effort 10 = "the max I can do, not a fail ... but it was successful"**; his "Couldn't do it" covers a failed set | COACH-R2 R2-VOL-02 (PARTLY) | §5.4, §7.4 |
| 6 ‡ | Small muscles 8 / 12 / 15, caps 12 / 18 / 22; floors 4 / 2 | **"I don't think anybody needs less than 10 sets a week per muscle"**: floor 10 per trained muscle in training blocks; small muscles 10 / 12 / 15 on the same caps as big muscles (14 / 22 / 25); priority 18 / 26-28 / 30; "all customizable"; an optional **Pro setting** above 30 (PROPOSED) | COACH-R2 R2-VOL-04, R2-VOL-06 | §5.3 |
| 7 | - | **"Most people train around 20 to 30 sets per muscle per week"** researched: fits what trained people work up to counting indirect work; high as "what most people do" (direct-set surveys ≈ 8-17); no number changes | COACH-R2 R2-VOL-06 | §5.8 |
| 8 | Hinge glutes 0.25 (0.5 switch); KB swings glutes 1.0; thruster 1 / 0.5 | **Squats, lunges, deadlifts, RDLs: glutes 0.25; hip thrusts and bridges 1.0; KB swings are ballistic and never glute volume; thruster 1.0 quads / 0.5 shoulders / 0.25 glutes** | COACH-R2 R2-VOL-05 | §5.2 |
| 9 ‡ | Triggered deload inside a block; week 1 of the next cycle a deload | **No deload or maintenance week inside a block.** A block is completed; if it cannot be, the person cancels it → maintenance phase → a whole new block. Deload (half of the hardest week) only between blocks | COACH-R2 R2-VOL-07 | §11.6 |
| 10 ‡ | Maintenance block of 4-6 weeks | **Maintenance length chosen and extendable**; at its end: keep maintaining / change the plan / start a training block. Pre-season = a 4-6-week block at ~60 % of off-season sets with more speed and power + a 1-2-week taper (approved) | COACH-R2 R2-PER-06 | §11.2, §11.6 |
| 11 ‡ | Year with ambiguous quarters | **The year plan is for the general population ("stay in shape")**, approved, on the user's calendar and **fully tunable** (re-order blocks, more or less cardio, a winter powerlifting-style block) | COACH-R2 R2-PER-01, R2-PER-02 | §11.5 |
| 12 | Tests in the last week | **Test before the block (or week 1) and at the end, never during it; never from zero** (5RM / 3RM or 80-90 % efforts, never a 1RM or a max mile without a completed block) | COACH-R2 R2-PER-07 | §12 |
| 13 ‡ | Full-body days 1-2 exercises per muscle (PROPOSED) | **"There's never one exercise"**: 2-4 exercises per muscle group on its day, full-body days included; days run longer | COACH-R2 R2-SES-05 (PARTLY) | §10 |
| 14 | Axial once a week (squat) | **Heavy squat and heavy deadlift on two different days**; non-axial hinge, leg press or belt squat on the other days; the counted axial list approved | COACH-R2 R2-SES-01, R2-SES-02 | §10.4 |
| 15 | Core first ~2 exercises | **Light core opener 2 × 2 short of failure** (approved); **core supersets or monster sets may be added anywhere** | COACH-R2 R2-SES-03 | §10.1 |
| 16 ‡ | Aerobic counts fixed by population | **Every aerobic count is adjustable up or down by the user**; aesthetics 4 incl. a second Orange + walks (approved); athletes off-season 2-4 by sport (approved) | COACH-R2 R2-SES-06, R2-ATH-06 | §9.7 |
| 17 ‡ | Plyo shares, lists, stage name and weeks PROPOSED | **Approved**: shares by sport, ballistic vs plyometric lists, "Receive-Create stages" with their weeks; game-heavy in-season reductions | COACH-R2 R2-ATH-01, -02, -03, -07 | §9.2-9.3, §9.8 |
| 18 | Olympic lifts once a week in season (proposal) | **Up to 4 × a week**: clean days are squat-pattern days, snatch days are hinge-pattern days; full squat cleans / snatches 3-5 reps "with the coach's eye" on speed; weight by RPE / RIR; explained as power output | COACH-R2 R2-ATH-04, R2-ATH-05, R2-GEN-06 | §9.5 |
| 19 ‡ | Older clients: few plyos unless asked | **60+: no Olympic lifts, plyos or depth jumps by default; optional with the warning** "Make sure that you have a fitness professional to help you understand what this means." Youth floor Olympic lifts from ~14 after a hang block | COACH-R2 R2-ATH-08 | §9.9 |
| 20 | Library open items | KB face pulls = shoulder work; bench push-ups both versions; 21.6-mile run removed; library additions approved; **one-detail variations between blocks, never invented exercises**; zones and level rule approved; 'NO ACCESS' = a self-serve version | COACH-R2 R2-LIB-01 … -08, LIB-10, LIB-12 | §2, §3, §4 |
| 21 ‡ | Output undecided | **Approved path** (website → check-in → open source) with **fewest clicks, phone-first, Block / Week / Day macro views, screenshot a whole block or a week, videos optional** | COACH-R2 R2-GEN-02 | §14 |
| 22 ‡ | Safety screen PROPOSED | **PAR-Q-style health check for clients; coaches may bypass it with a legal warning; everyone accepts a liability release every time** | COACH-R2 R2-GEN-03 | §13.2 |
| 23 | Season by dates (PROPOSED) | **Season start date + practice and game days** (approved); the tool works out off-, pre- and in-season | COACH-R2 R2-GEN-05 | §9.8, §13.2 |
| 24 | Five sample plans | **Seven sample plans he will grade**: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs | COACH-R2 R2-GEN-07 | §14.3 |
| 25 ‡ | 27 profiles | **Every popular US sport, swimming included** (52 picker sports, 127 profiles) and a **"Stay athletic and active" door** for gen pop (pickleball, HYROX, padel, tennis, golf, rec leagues, running, hiking and more; 26 activities) | COACH-CHAT 2026-10-08 | §9.4, §9.10, §9.11 |

### 0b.3 Resolutions the coach should see (answers that pull against each other)

| # | Tension | Resolution in v1.1 | Round 3 (outcome) |
|---|---|---|---|
| 1 | **R2-VOL-01** approved a step table with "life was harder / better" cells; **R2-GEN-04** then rejected every lifestyle input | Keep the effort rows, **drop every life cell**; the step comes from effort, sessions done and pain only. Someone who was ill logs fewer sessions (repeat the week) or high effort (hold). INFERRED (the later, more specific answer decides) | R3-VOL-02: moot, the check-in itself is retired |
| 2 | **Rear delts 4 / 6 / 8 own sets** (R2-VOL-04, RIGHT) vs **"nobody needs less than 10"** (R2-VOL-06) | Keep 4 / 6 / 8 direct rear-delt sets and read the floor on his **SHOULDERS/TRAPS** group (side-delt work 10 / 12 / 15 + rear-delt work + face pulls is well above 10). INFERRED | R3-VOL-01 (PARTLY): rear delts are part of the shoulders group; the floor is counted on the group |
| 3 | **R2-VOL-08 not understood** | Default kept and marked: when a day type runs twice a week, added sets alternate Monday's first exercise, then Thursday's; a small-muscle bonus exercise goes on the optional day, else on a day that already trains that muscle group | R3-VOL-03: approved (RIGHT) |
| 4 | **"2 → 11" felt climb** (R2-PER-05) vs **VOL-13 "1-3 RIR, no planned ramp"** | A planned drift 3 → 2 → 1-2 → 1 RIR that never leaves his 1-3 band; intensifiers only in the last week. PROPOSED | R3-VOL-04: approved |
| 5 | **His approved check-in numbers (+5 % / +7 %)** vs **small steps early** (R2-PER-03) | The check-in is read against the stairway: on target = the planned step, too easy = planned + 2 points (max 7 %). First half: +3 % / +5 %; from the halfway week exactly his table. PROPOSED | R3-VOL-04: moot (no check-in); the stairway itself approved |
| 6 | **60+ "landing drills and low ankle hops still OK"** (approved proposal) vs **his words "no plyos by default"** and ankle hops on his plyometric list (R2-ATH-02) | Stricter reading: landing drills stay by default; low ankle hops join the opt-in. Depth jumps and snatches follow R2-ATH-08 (opt-in with warning), overhead and low-bar squats stay "never" (EQ-03) | R3-ATH-02: approved (ankle hops off by default, switchable) |
| 7 | **Floor of 10** (R2-VOL-06) vs **maintenance 50-70 %** (PER-01) and athlete budgets | The floor applies to **training blocks**; maintenance phases, pre-season and in-season are not floored; field athletes' credit-only muscles are not floored, but their trained chest and back rise from 7.5 to 10. INFERRED | R3-VOL-01: stands (his PARTLY spoke only about rear delts) |
| 8 | **Holiday weeks switch to maintenance** (R2-PER-02) vs **never maintenance inside a block** (R2-VOL-07) | The year planner places marked weeks between blocks; a week marked after a block started ends that block early (cancel → maintenance → new block) unless the user removes the mark. PROPOSED | R3-PER-01: approved |
| 9 | **Recovery week**: "week 1 of the next cycle is a deload" (approved R2-VOL-07 proposal) vs "maintenance ... at the end of a block" | One recovery week between two completed blocks, counted as an extra week (a 12-week block + 1 = a 13-week quarter). PROPOSED | R3-PER-01: approved, and only a recommendation |
| 10 | **R2-SES-05 "2-4 per muscle"** vs **R2-SES-04 "12 + 2 core"** for field athletes | 2-4 exercises for each muscle group **trained that day** (knee + pull day / hip + push day); athletic stations do not count toward the resistance part; the cross pattern then leaves 2 plyo/ballistic stations + 1 Olympic lift on a 12-cap day. INFERRED | R3-SES-01: approved (same-pattern template for size-focused and high-level athletes) |
| 11 | **'high rows'** in today's request | Read as **HYROX**, the fitness race (supported by his round-1 answers EQ-06 "CrossFit, or ... high rows?" next to wall balls, and VOL-11 "high-raw athletes" doing 40-rep sets). INFERRED | R3-ATH-03: confirmed |
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

**v1.2.** Round 3 approved the swimming defaults (R3-ATH-01), the 60+ and racket-50+ rules (R3-ATH-02), the HYROX plan (R3-ATH-03), the shares, cardio and in-season rule of the remaining sports (R3-ATH-04) and the stay-active play days, cardio credit and event dates (R3-ATH-05): §9.9-9.11.

---

## 0c. What changed in v1.2 (history; rows that v1.3 changed are resolved in §0d)

His words that set the direction of round 3: "We're only doing outputs, and people can change accordingly" (R3-VOL-02); "I want them to be able to kick out a program, and that's it. That's the program" (R3-VOL-04); "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01); "I don't want any data kept" (R3-GEN-01).

**Changed again in v1.3 (see §0d).** In §0c.2: row 2 (the planned final sets are now reached; no 7 % cap), row 8 (time vs minimums is retired), row 9 (editing now covers sets on any day or week), row 17 (the release tick is a required gate and a release line is printed on the plan). In §0c.3: rows 1 to 5 are settled or retired (§0d.3). Everything else in §0c stands.

### 0c.1 The round-3 answers in numbers

13 answers (all 13 questions of `round3_questions.json`): **12 RIGHT** (6 with words that add to the rule: R3-VOL-02, R3-VOL-04, R3-SES-01, R3-SES-02, R3-PER-01, R3-GEN-01; 6 with no words, so our proposal is his rule: R3-VOL-03, R3-ATH-01, R3-ATH-02, R3-ATH-03, R3-ATH-04, R3-ATH-05), **1 PARTLY** (R3-VOL-01, rear delts), **0 NOT RIGHT**, nothing skipped or not understood. Counted with the team venv from `coach_answers_round3.md`. The one re-asked round-2 question (R2-VOL-08, not understood) is answered by R3-VOL-03.

### 0c.2 The changes that move the generator most

| # | v1.1 | v1.2 (the coach's rule) | ID | Where |
|---|---|---|---|---|
| 1 | An optional 1-minute weekly check-in (effort, sessions done, pain) moved next week's step; a logbook; week-by-week needed the check-in; opt-in data would tune the model | **Answers in, the whole plan out, once.** No check-ins, no tracking, no adaptive inputs. The plan shows every week ahead of time with its built-in stairway; people and coaches adjust it themselves; a printed "How to adjust this plan" guide replaces the step table | COACH-R3 R3-VOL-02 (RIGHT + words), R3-VOL-04 (RIGHT + words) | §1.2, §5.1, §5.4c, §5.9, §13.5 |
| 2 | Stairway numbers PROPOSED (3 % to the halfway week, 5 % after, λ, RIR drift flagged against VOL-13) | **APPROVED in numbers**: about 3 % a week to the halfway week, about 5 % after it, each trained group's steps sized so it reaches its ceiling in the last week (L2 big muscle 15 → 22, the last four weeks 19, 20, 21, 22); effort 3 RIR → 2 → 1-2 → 1 RIR + intensifiers in the last week, always inside 1-3 RIR | COACH-R3 R3-VOL-04 | §5.4, §7.4, §11.3 |
| 3 | Data on the phone (IndexedDB + backup code); opt-in research data in v2; email field; accounts in v2 | **Nothing kept, anywhere.** No accounts, no server database, no email, no analytics with personal fields; the engine runs in the browser; the person keeps the plan as an image, PDF, sheet, plan link or plan file; the release record is printed, not stored | COACH-R3 R3-GEN-01 | §13.1, §13.2, §14.1 |
| 4 | Rear delts 4 / 6 / 8 own sets (caps 8 / 12 / 16); side delts a line of their own; floor read on SHOULDERS/TRAPS (INFERRED) | **Rear delts are not an individual muscle**: one **shoulders** line (front + side + rear delts) starting 10 / 12 / 15, caps 14 / 22 / 25; the floor of 10 is counted on the group; a rear-delt exercise every week; "add rear delts" is an editing option ("People and coaches should always be able to add more rear delts") | COACH-R3 R3-VOL-01 (PARTLY) | §2.1, §5.1, §5.3 |
| 5 | Groups for "2-4 per muscle" INFERRED (05 hips / shoulders); a second calf exercise at 1 set | **APPROVED**: count the FOCUS groups - hips = glutes + hamstrings (RDL + hip thrust + leg curl = 3 hip exercises), shoulders = front + side + rear delts; **calves one exercise × 3 sets per leg day**; the floor of 10 is read on the groups | COACH-R3 R3-SES-01 | §5.3, §5.6, §10.3 |
| 6 | Field athletes: 2-4 plyo/ballistic + 2-3 Olympic + 3-4 resistance; same-pattern athletes PROPOSED | **2-4 exercises for each group trained that day inside 12 + 2 core**; the **cross pattern** (2 jump / throw stations + 1 Olympic lift) is the default for most athletes; the **same-pattern athletic template** (3-4 jump stations + 1 Olympic lift) is for size-focused and high-level athletes | COACH-R3 R3-SES-01 | §9.1 A23, §10.1, §10.3 |
| 7 | Priority muscles: +4 / +4 / +6 sets on the start, the others ≤ 3 % a week | **Focus muscle 1 and Focus muscle 2** at intake (optional, max 2): **+1 to +3 extra weekly sets each** over the balanced plan (default +2, PROPOSED), on start and ceiling, riding the stairway; the other groups are not slowed; the +4 / +6 push stays only as an optional coach setting; no sex field | COACH-R3 R3-SES-01 (RIGHT + words) | §5.1 V6b, §5.3, §13.2 |
| 8 | Time-overflow rule (superset, then a cut order) when added sets push a day past its length | **Time vs minimums in his approved order**: (1) tell up front and offer another day or longer sessions; (2) if they keep their time, train fewer groups directly (big movers first; arms, calves and shoulder isolation from compound credit); (3) recommend supersets; (4) the stairway always climbs on the trained groups. Never squeeze 2-4 exercises per group into a day that cannot hold them | COACH-R3 R3-SES-02 (RIGHT + words) | §5.6.1, §10.5, §13.3 |
| 9 | The plan changed only through the check-in | **Plan editing**: blocks carry stable ids and on / off flags; a day's athletic block or core block can be switched off; exercises and whole blocks can be added or removed; supersets are recommended per eligible pair; every export says what can be switched off | COACH-R3 R3-SES-02 | §10.10, §13.3, §14.1 |
| 10 | R2-VOL-08 default (not understood) | **APPROVED**: an added set alternates between the two exposures of the same day type (Monday's first back exercise, then Thursday's); small-muscle extras become a short bonus exercise on the optional day, or on a day that already trains that muscle, never as its only exercise that day | COACH-R3 R3-VOL-03 | §5.5 |
| 11 | One recovery week between two completed blocks (counting PROPOSED); in-app "block done" and "maintenance end" prompts; the block-at-risk offer | **The easy week after a block is a recommendation, not mandatory** (an extra week: 12 + 1 = a 13-week quarter); when a block ends it ends and the person builds the next one; holidays are planned between blocks; stopping a block is the person's or coach's call | COACH-R3 R3-PER-01 (RIGHT + words) | §11.1, §11.2, §11.6 |
| 12 | Swimming defaults PROPOSED | **APPROVED**: 3 dryland days + 1 optional (2 for younger or lower-level swimmers), 0 extra gym cardio, jumps mostly ballistic (25 % plyometric at block end), Olympic lifts 2-3 days, shoulder care every session (never bands), a 2-week dryland taper lined up with the swim taper (1 week or none before smaller meets) | COACH-R3 R3-ATH-01 | §9.11 |
| 13 | 60+ stricter reading INFERRED; 50+ racket rules PROPOSED; 60+ steps ≤ 3 % PROPOSED | **APPROVED on / off defaults for 60+** (landing drills, balance, quick stepping, light medball throws, fast machine work on; ankle hops, other jumps, Olympic lifts, depth jumps off and switchable with his warning; overhead and low-bar squats out); **racket players from 50**: knee-friendly strength, calf and Achilles work every leg day, rotator cuff, low-impact jumps only unless switched on; the 60+ ≤ 3 % step cap is **retired** (every trained group reaches its ceiling in the last week) | COACH-R3 R3-ATH-02; R3-VOL-04 | §5.3, §9.9 |
| 14 | 'High rows' = HYROX INFERRED; HYROX plan PROPOSED | **APPROVED**: 2 strength days (squat + pull, deadlift + push) + 2 hybrid days; 4 cardio sessions (Blue, Green, Orange + a second Orange); 2 short station circuits a week as finishers that never count as muscle sets; wall balls with the race ball (≤ 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric | COACH-R3 R3-ATH-03 | §9.10 |
| 15 | Classes, cardio and in-season rule of the sports he did not name INFERRED / PROPOSED | **APPROVED**: plyo shares for every remaining sport; off-season cardio 2-4 like his list, 0 extra for swimmers, runners, rowers and endurance cyclists; the game-heavy in-season rule also for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball; recreational players use their activity's share | COACH-R3 R3-ATH-04 | §9.2, §9.4, §9.7, §9.8 |
| 16 | Stay-active play days, activity cardio credit and event dates PROPOSED | **APPROVED**: the hardest gym day ≥ 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps; a 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets | COACH-R3 R3-ATH-05 | §9.10, §11.2 |
| 17 | PAR-Q-style screen (route PROPOSED); release every time (interpretation PROPOSED); record on the phone | **APPROVED**: a short Blaze Camp health check written by a lawyer in English and Spanish, with a link to the official PAR-Q+; coaches run it or skip it with the legal warning; **one unticked box (use at my own risk + terms and conditions + liability release) every time a plan is built or rebuilt**, including each new block; the record is printed on every export, never stored | COACH-R3 R3-GEN-01 (RIGHT + words) | §13.1, §13.2, §14.1 |
| 18 | Licences: engine Apache-2.0, model CC BY 4.0 | **MIT** to Lalo Vera (doing business as Blaze Camp) and BFit Studios Corp. for the whole repository; README, `LICENSE`, `DISCLAIMER.md` and `DISCLAIMER.es.md` (legally equivalent EN / ES, drafts for a Florida attorney) say: at your own expense and risk; if you use it for other people, have your own liability release | COACH-R3 R3-GEN-01 | §13.1 G27, §14.1 |
| 19 | Product path: website → weekly check-in → open source; MVP 11-16 developer-weeks + phase 1.1 (3.5-5) + accounts | **Website with plan editing and every export → open source under MIT**; no check-in phase, no accounts, no learning phase; MVP 13.5-20 developer-weeks, phase 2 (open source + coach tools without accounts) 5-9 | COACH-R3 R3-VOL-02, R3-VOL-04, R3-GEN-01; estimates INFERRED | §14.1 |
| 20 | Pain: logged 'Felt a PAIN' triggers (swap → cut → drop; block-at-risk); "step 0 until 2 pain-free weeks" | **Pain declared at intake shapes the plan; during the block the printed guide says swap, then cut the sets, then drop the exercise** (the person does it; nothing is logged) | COACH-R3 R3-VOL-02, R3-VOL-04; COACH-ANSWER VOL-03 | §5.7 |

### 0c.3 Readings the coach should see (where two answers pull against each other)

| # | Tension | Reading in v1.2 | Round 4 |
|---|---|---|---|
| 1 | **R3-VOL-04** says both "about 3 % ... about 5 %" and "each muscle's steps are sized so it reaches its ceiling exactly in the last week"; for lines whose ceiling is far above their start both cannot hold | Keep the step sizes; the ceiling is a maximum (12-week L2 / L3 shoulders and arms peak at 18 / 23 under 22 / 25). The alternative is late steps up to his 7 % | yes (12 §7 #16) |
| 2 | **R3-SES-02** minimums vs a 2 × 45-minute week | His minimums cost about 25-30 minutes of lifting per group a week, so 2 × 45 holds one big group (hips) plus pinned calves; the plan says so up front and offers about 105-minute sessions | yes: should very short weeks train the big movers once a week at the floor instead? |
| 3 | **R3-SES-01** Focus muscles vs **R3-SES-02** "arms, calves ... from compound credit" | A Focus muscle stays directly trained when the time check trims groups (PROPOSED) | yes (N-PROD-27) |
| 4 | **R3-SES-02** step 2 vs the level ceiling | The keep-time ceiling is clamped to the level ceiling (PROPOSED) | no (engine detail) |
| 5 | **R2-PER-01** Q1 cut "sets stay at the starting level" vs **R3-SES-02** "never flat" | Kept: the Q1 sets stay flat; the week still gets harder through cardio, density, load and RIR | yes (06 §14.5 #5) |
| 6 | **R2-VOL-06** next block × 1.05 needs a history vs **R3-GEN-01** nothing kept | The rebuild asks "blocks completed in a row" (0 by default) and "did you finish your last block?" | yes (06 §14.5 #2) |
| 7 | **R2-PER-01** "automatic" December maintenance vs **R3-PER-01** "a recommendation" | Printed by default; the person can switch it off or move it | no |
| 8 | **PER-01** week-by-week vs **R3-VOL-02 / R3-VOL-04** no check-ins | Retired as a mode; the code opens a 12-week plan on the Week view | yes (N-PROD-22) |
| 9 | **VOL-01** "learns from the data of all the people" vs **R3-GEN-01** "I don't want any data kept" | Off: the model improves through his reviews and the feedback people choose to send | yes (N-PROD-26) |
| 10 | **EQ-03** "never snatch" (older) vs **R3-ATH-02** "Olympic lifts ... can be switched on" | Clean-family and hang work switchable for 60+; snatch variants stay out (R3-ATH-02 names only overhead and low-bar squats as staying out) | yes (04 G2) |
| 11 | **R3-ATH-04** "goalkeepers 50 %" | Read as soccer, lacrosse and field-hockey goalkeepers; the ice-hockey goalie stays with hockey (40 %), the water-polo goalkeeper with water polo (25 %) | yes (04 G1) |
| 12 | **R3-VOL-01** (PARTLY) spoke only about rear delts | The rest of that proposal stands: the floor of 10 is for training blocks; maintenance, pre-season and in-season keep their lower volume; pain-reduced groups stay cut | no |
| 13 | **R3-VOL-01** one shoulders line vs v1.1's separate side-delt line | Group credit gives an L2 bodybuilder about 3-4 direct side-delt sets a week; Focus = shoulders or a V-taper bias adds more | yes (12 §7 #2) |
| 14 | **PER-07** approved reminders vs **R3-GEN-01** nothing stored | Test weeks are printed in the plan and set as alarms in the downloaded calendar file; no notifications | no |
| 15 | **R3-SES-01** Focus muscles vs field athletes' credit-only groups | Offer Focus muscles to competitive field athletes with a note that the sport work comes first (PROPOSED) | yes (N-PROD-25) |
| 16 | **R3-PER-01** easy weeks are recommendations vs the 13-week year quarters | If the person switches off a recommended easy week, the next block starts a week earlier and the spare week joins the December holidays (PROPOSED) | yes (06 §14.5 #3) |
| 17 | **R3-ATH-01** "2 for younger or lower-level swimmers" | Read as 2 dryland days + 1 optional for age-group swimmers under about 14 or L1 swimmers (threshold PROPOSED) | yes (04 G3) |

### 0c.4 Retired in v1.2 (kept here as one list so nobody rebuilds them)

The weekly check-in and its step table (too easy = planned step + 2 points; 9 = hold; any 10 = hold and -1 set; under half the sessions = repeat the week), the optional 'Failed' answer, the block-at-risk offer and its triggers, tracking levels 1-3 (check-in, phone logbook, coach-connected accounts), the logbook as an engine input, `adapt()`, the week-by-week mode as a check-in mode, the in-app "block done" and "maintenance end" prompts (copy keys `block.done`, `block.cannot_finish`, `maint.end`), level-up read from logs, the pain triggers read from logs and "that muscle's step 0 until 2 pain-free weeks", learning from user data (VOL-01, VOL-02 "adjusted over time from data"), data kept on the phone with a backup code, opt-in research data, accounts and sync, the email field (F41), the output-mode field (F43), the `priority_muscles` intake field (now `focus_muscles`; the old code is an alias), rear delts' own 4 / 6 / 8 sets and side delts as a separate line, the 60+ ≤ 3 % step cap, the time-overflow cut order, the mandatory recovery week between blocks, test reminders as notifications, the Apache-2.0 + CC BY 4.0 licences and 04's class-5 20 % plyo floor. Round-2 retirements stay retired (§0b, §5.4e).

---

## 0d. What changed in v1.3

His words that set the direction: "You need to stop trying to be responsible for the people's time ... We just worry about the amount of exercises within the session ... I want you to not get complicated over the time" (CT-01); "go ahead and increase faster if thats the need, they could edit accordingly" (CX-01); "it should be all editable as they need to" (CX-04); "These are templates that we're giving them for them to add or take away" (R4-SES-02); "We have those two options: push, pull, legs, and the upper/lower days, Day A and Day B. You need to adjust your full-body days to that" (R4-SES-05).

**The short version.** The plan no longer tries to fit a session length. It is sized by the number of exercises, it is built on his own day templates, it comes out complete, and the person edits it. Every trained group reaches its planned final sets. Reps and load are written as a rule the person applies.

### 0d.1 The new answers in numbers

Round 4: 20 answers (all 20 questions of `round4_questions.json`): **15 RIGHT** (9 with words that add to the rule: R4-SES-01, R4-SES-02, R4-SES-03, R4-PRG-04, R4-LIB-01, R4-LIB-03, R4-LIB-05, R4-SCP-01, R4-REL-01; 6 with no words, so our proposal is his rule: R4-PRG-01, R4-PRG-02, R4-PRG-03, R4-LIB-02, R4-LIB-04, R4-SCP-03), **4 PARTLY** (R4-SES-04, R4-SCP-02, R4-REL-02, R4-REL-03: his words define the rule), **1 NOT RIGHT** (R4-SES-05: he rejected both of our options and gave his A / B template), nothing skipped. Plus **CT-01** (one clarification on session time) and **CX-01..04** (three answers on progression and one explanation that the output is an editable template).

### 0d.2 The changes that move the generator most

| # | v1.2 | v1.3 (the coach's rule) | ID | Where |
|---|---|---|---|---|
| 1 | The form asked for a session length (30-120 min). A time check ran before the plan, offered another day or longer sessions, and with "keep my time" trained fewer groups directly. Exercise caps came from minutes. A day over its minutes was an error | **No time-fitting.** The form does not ask for a session length. The plan is sized by exercise count. Each day prints an average time estimate ("about 60-75 min") as information only. Nothing is cut, reshaped or flagged because of time. How long a session takes is up to the person | COACH-CT CT-01; COACH-R4 R4-SES-01 | §5.6, §10.5, §13.2, §13.6 |
| 2 | Exercises per session by minutes (45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9) | **Exercises per session by client type** (not counting the warm-up or the 2 core exercises): general fitness / fat loss 5-7, aesthetics / bodybuilding 6-8, strength 5-6, bootcamp 5-7 stations, field athletes off-season up to 12, older adults 60+ 5-6. A recommendation in a template: the person adds or removes | COACH-R4 R4-SES-02 | §5.6, §10.5 |
| 3 | Full-body days built to "2-4 exercises for every group" (7-10 resistance exercises); day layouts generated | **His own templates are the skeleton.** A day = pull + knee dominant (horizontal pull, squat, vertical pull, lunge, biceps, leg extension). B day = push + hip dominant (horizontal push, hinge or hip thrust, vertical or incline push, single-leg hinge, triceps, leg curl). About 6 exercises, up to 8. Four days = A, B, rest, A, B. Push / pull / legs and his other templates as written | COACH-R4 R4-SES-05 (NOT RIGHT + his words) | §10.3, §10.8 |
| 4 | Two short days: "train fewer muscles directly" (2 × 45 minutes held one big group plus calves) | **Two days a week: every big group is trained, at about 6-8 weekly sets instead of 10.** The plan says so and suggests a third day. Never drop whole muscle groups and never pile on more exercises. One A day and one B day cover every big group. The floor of 10 applies from 3 training days | COACH-R4 R4-SES-03 | §5.3, §5.6 |
| 5 | A keep order and a cut order decided what left the plan | **Nothing is dropped automatically.** The template comes out complete and the person picks what to remove. The plan names the easiest things to remove (finishers, extra jump / throw stations, small-muscle accessories) as a hint | COACH-R4 R4-SES-04 (PARTLY) | §10.10 |
| 6 | Steps held at about 3 % / 5 % (λ ≤ 1). The ceiling was a maximum, so lines with a wide range peaked below it (12-week L2 shoulders and arms 12 → 18 against 22) | **The planned final sets are reached.** About 3 % / 5 % stays the default pattern; steps may be faster when that is what it takes (λ may pass 1). The 12-week L2 shoulders and arms now run 12 → 22 | COACH-CX CX-01; COACH-R4 R4-PRG-01 | §5.4 |
| 7 | Hard limits: planned step ≤ 7 %; total weekly sets strictly below +10 %; release staggering to stay under 10 % | **No hard limit.** A week that adds more than about 15 % carries a clear note: "this week jumps more than usual: adjust if needed" | COACH-CX CX-01; COACH-R4 R4-PRG-02 | §5.4d |
| 8 | "Reaches its ceiling exactly in the last week" | The top number is reached **in the last week when the math allows; one week early and holding it with more reps or load is fine; never earlier** | COACH-R4 R4-PRG-01 | §5.4 |
| 9 | "The stairway climbs ... never flat"; a minimum climb of 2 sets | **A week may keep the same sets when reps or load progress.** At the top, sets stay and reps and load carry the progress. This is not permission to call an unchanged prescription progress | COACH-CX CX-02, CX-03 | §5.4 |
| 10 | Reps written as a range with a planned effort; no rule for when to add load | **Reps and load progress by a rule the person applies**: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Never a promised number per week | COACH-R4 R4-PRG-03 | §7.4, §13.3 |
| 11 | Next block: start × 1.05 and ceiling + 1 | **Next block: start about 5 % above the last block's start, in whole sets, never above the level's top.** Already at the top: sets stay, load and reps progress. "It has to be logical" | COACH-R4 R4-PRG-04 | §5.1 V22, §11.4 |
| 12 | Editing = block switches, add / remove exercises or blocks, supersets | **Everything is editable**: also the sets of any day or week. After an edit the weekly totals are recomputed, the plan is marked edited and no old "validated" stamp stays on it | COACH-CX CX-02, CX-04 | §10.10 |
| 13 | 31 proposed exercises were swaps only until he approved them | **Optional add-ons**: they can be chosen and added, never a template pick. The exception: wall balls and sled pushes may be primary in the HYROX program (maybe CrossFit). Neck work stays proposed | COACH-R4 R4-LIB-01 | §4.1b |
| 14 | Carries and sled work had no dosing rule of their own | **Carries and sleds by distance or time**: 2-4 trips of 20-40 m (or 20-40 s). They are not muscle sets. They sit with core / conditioning | COACH-R4 R4-LIB-02 | §4.1b, §5.2 |
| 15 | A mid-range push (incline, landmine) but no mid-range pull | **Mid-range pull** is its own small category between horizontal and vertical pull (high row, 45-degree row, face-pull angle) | COACH-R4 R4-LIB-03 | §2.3, §4.1b |
| 16 | The vertical-push slot defaulted to an overhead press | **Incline pressing is preferred over overhead pressing** for bodybuilders and the general population. Overhead pressing stays available | COACH-R4 R4-LIB-03 | §4.1b, §10.8 |
| 17 | An equipment swap said nothing about what changed | **A swap prints one short line on what it keeps and what it loses** ("DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch") | COACH-R4 R4-LIB-04 | §8.5 |
| 18 | Video links copied from his sheets (not his videos) | **No third-party video links in the public data.** Each exercise has a "search this exercise on YouTube" link built from its name, and the plan shows the exact name with a one-tap copy. His own videos can be added later | COACH-R4 R4-LIB-05 | §4.1b, §14.1 |
| 19 | The own-risk box was ticked at every build; who may use the plans alone was open | **Everyone may use the plans on their own. Accepting the terms and the release of liability is required before a plan is generated** (no plan without it). A short release line is printed on every plan, in English and Spanish, linking `DISCLAIMER.md` | COACH-R4 R4-SCP-01, R4-SCP-02 (PARTLY) | §13.1 G8, §13.6 |
| 20 | Sport numbers carried mixed evidence tags | **Each sport profile carries one confidence label** in the data and the docs: confirmed by coach, based on a similar sport, or proposed. It is not shown on a plan | COACH-R4 R4-SCP-03 | §9.4 |
| 21 | "The coach (Lalo Vera, Blaze Camp ...)" | **Credit**: a complete coaching model from the experience of Coach Lalo (Gerardo Vera), Master NASM coach; his intellectual property. No "world's best" or injury-prevention claims | COACH-R4 R4-REL-03 (PARTLY) | header, §13.1 G27 |
| 22 | Model v1.2; engine 0.4 fitted plans to minutes; a large two-stage planner was designed | **Model v1.3** = library + categories + rules + sports + his answers + docs. The engine was rebuilt now as 0.5.0 (template-first, no time-fitting) and stays marked experimental. The large planner in `design/PLANNER_SPEC.md` is not built; it stays as research | COACH-R4 R4-REL-01, R4-REL-02 (PARTLY: "I think you can try to build it now") | §14.1 |

### 0d.3 Readings the coach should see (where two answers pull against each other, or a number is ours)

| # | Tension or gap | Reading in v1.3 | Ask him? |
|---|---|---|---|
| 1 | **R4-SES-05** (a 6-exercise A / B day) vs **R2-SES-05** ("there's never one exercise") and CT-01's "what stays: 2-4 exercises per group per day" | On A / B days his template wins: biceps (A day) and triceps (B day) have one exercise, back has two, hips have three. On split days (push, pull, legs) every group keeps 2-4 | yes: confirm |
| 2 | **R4-SES-05** "the days that they do 8 exercises ... an extra small muscle exercise at the end, or a core" does not name them | A day: calves (7th), rear delt (8th). B day: side delt (7th), calves (8th), as in his BYOP sheets. The default count comes from the client type (general 7 of 5-7; aesthetics 7 of 6-8) | yes: order and defaults PROPOSED |
| 3 | **R4-SES-05** names each slot's laterality vs the **UNI-02 / UNI-03** dial (field and court athletes 80-90 % single-leg) | The slot keeps its laterality on gym, athletic and push / pull / legs days. The dial moves only the slots the template leaves open | yes: for athletes |
| 4 | Six exercises a day at 2-5 sets cannot always hold every group at its planned final sets (chest on a 4-day A / B week) | The group gets his bonus exercise on the optional day. With no optional day the group is capped at what its slots hold, and the plan says so up front. Nothing is hidden and nothing is dropped | no (PROPOSED mechanism) |
| 5 | Slot 3 of the B day is "shoulder press or an incline press": which muscle does it count for? | A 30-45 degree incline press counts 1.0 for chest; a high-incline press counts 1.0 front delts + 0.5 chest + 0.25 triceps; an overhead press stays a shoulder exercise. On a week with two B days the first one takes the incline press | **answered (COACH-R5 R5-VOL-01):** a high-incline press counts 1.0 chest + 0.25 front delts + 0.25 triceps |
| 6 | **R4-LIB-01** says "31 exercises"; the library holds them by record status | The 29 former proposals other than neck work, the 2 new mid-range pull records and his own suitcase carry are optional add-ons (32 records in the compiled model). The floor Y / T raise stays a library exercise (he added it in round 2). The 2 neck records stay proposed and are never shown | no |
| 7 | **R4-LIB-01** "Maybe in the CrossFit program" | Wall balls and sled pushes may be picked in the CrossFit-style class WOD. One switch turns it off | yes |
| 8 | **R4-LIB-01** vs **R3-ATH-03** (HYROX circuits with the race stations) | Round 4 wins on which record is the pick: wall balls, sled pushes and his own SkiErg / row / burpee stations. The other race stations are swaps | no |
| 9 | **R4-SCP-01** "Everyone should be able to use the plan on their own" vs the health check approved in round 3 (a refer answer gives no automatic plan) | The release is required for everyone. The health check stays as approved until he says otherwise | **answered (COACH-R5 R5-GEN-02):** it does not stop; it warns |
| 10 | **R4-SCP-01** and minors | A parent or guardian still accepts the release for anyone under 18 (R3-GEN-01; legal review) | no |
| 11 | **CX-01 / R4-PRG-02** (no hard limit) vs **UNI-05** ("10 % ... way too much") and **R2-VOL-01** ("never more than 7 % a week") | The newer answers win where a limit would stop a group short of its final sets. About 3 % / 5 % is still the pattern every plan starts from, so most 12-week plans never pass 10 % in a week (§5.4) | no |
| 12 | **R4-PRG-04** "never above the level's top number" vs **R2-VOL-06** "cap + 1" per completed block | Round 4 wins: the level's top does not rise from block to block | no |
| 13 | **R4-SES-03** "about 6-8" | Big groups start at 6 and top at 8 on a 2-day plan, plus a Focus add; small groups take the same numbers at most; a 2-day maintenance plan holds no line above 8 | no (PROPOSED detail) |
| 14 | **R4-SES-02** gives ranges, not defaults, and names only the warm-up and the 2 core exercises as outside the count | Defaults: general 7, aesthetics 7, strength 6, bootcamp 7 stations, field athletes 12, older adults 6. Non-competitive "stay athletic" days 5-10 (his JUSTICE LEAGUE sheet has 10 slots) and the CrossFit-style class 5-7 are ours. Also outside the count: joint care, skill practice, conditioning, cardio, the cool-down and tests | yes: PROPOSED |
| 15 | **R4-PRG-02** "more than about 15 %" on a small group | One whole set is the smallest step a group can take (6 → 7 is +16.7 %), so a single added set is never noted; two or more sets above 15 %, or the week's total above 15 %, are | no (PROPOSED detail) |
| 16 | **R4-SES-01** "an estimate like about 60-75 minutes" | The printed range is the estimate 10 % each way, rounded to 5 minutes | no (PROPOSED detail) |
| 17 | **R3-SES-02** recommended supersets "so that it's a faster workout" | Stays a recommendation the person switches on. No session length turns supersets on any more | no |
| 18 | **R4-REL-03** "I have a bunch of certifications. You could look them up" | Only "Master NASM coach" is written. Other certifications are added when he lists them; none is invented | **answered (COACH-R5 R5-PUB-02):** "Master NASM coach" only; nothing is added |
| 19 | **R2-PER-01** Q1 cut "sets stay at the starting level" | Now simply allowed: a block may keep its sets while load, reps, cardio and effort progress (CX-02) | no |
| 20 | **R4-SES-05** "We don't necessarily do full-body days (push, pull, legs). That's when you only have, let's say, 3 days a week of training or 2 days a week" | With 4 or more days: the A / B days. With 3 days: his 3-day builder, whose C day mixes push, pull and legs. With 2 days: one A day and one B day, which together train every big group (R4-SES-03) | yes: is 2 days A + B, or two mixed days? |

### 0d.4 Retired in v1.3 (kept here as one list so nobody rebuilds them)

**Time-fitting** (COACH-CT CT-01; COACH-R4 R4-SES-01): the session-length question (F24) and session minutes anywhere in the intake; the time check before the plan (`D15_time_fit`, G25, V28) and its three offers (another day, longer sessions, block switches to save minutes); "keep my time" and the "trained directly / not trained directly (time)" lists; the keep order and the cut order; keep-time ceilings and the step-2 clamp; the 10 % fit tolerance; the 100 % / 110 % day-length rules; exercise caps by minutes (45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); session lengths as limits (W16); "minutes ≤ the chosen length" in set placement and in validation (V3, V13); supersets marked "needed"; the time-vs-minimums tables of 05 §8.7.1 and the worked examples built on minutes (12 §5.1, §5.5); every benchmark metric about minutes. The time parts of R3-SES-02 are superseded; its other parts stand (supersets recommended, blocks switched off, exercises added or removed).

**Fewer groups for short weeks** (COACH-R4 R4-SES-03, R4-SES-04): "train fewer muscles directly", "2 × 45 holds one big group plus calves", pinned groups in a time policy.

**Rate limits** (COACH-CX CX-01; COACH-R4 R4-PRG-02): planned step ≤ 7 %; total weekly resistance sets strictly below +10 %; the one-set allowance and the exemptions under that 10 % check; release staggering to stay under 10 %; λ ≤ 1 and "the ceiling is a maximum"; the hand-set step range 0-7 % as a limit; "others ≤ 3 % a week" while a priority push runs; the two locked rules "weekly increase < 10 %" and "planned step ≤ 7 %".

**Never flat** (COACH-CX CX-02, CX-03): "the stairway climbs ... never flat", the minimum climb of 2 whole sets (calves 1), V29's "never flat" clause.

**Next block "ceiling + 1"** (COACH-R4 R4-PRG-04).

**"2-4 exercises per group, never 1" on full-body days** (COACH-R4 R4-SES-05): replaced by his A / B template there; kept on split days.

**Check-in remnants** still found in v1.2 text: the check-in maximum of 7 %, "7 % only once logs earn it", and the spec's `adaptation` stub as a live object (it stays only as an empty, retired stub the compiler still reads).

**Third-party video links** (COACH-R4 R4-LIB-05) and **"proposed exercises are swaps until approved"** (COACH-R4 R4-LIB-01).

Round-2 and round-3 retirements stay retired (§0b, §0c.4, §5.4e).

### 0d.5 Where each new answer lives

The full trace, with every spec key, the compiled rule that carries the answer and the state of each retired v1.2 key, is `coverage_matrix_round4.md`. The short form:

| Answer | Verdict | The rule in one line | Here | Spec key (`generator_spec_v1.json`) |
|---|---|---|---|---|
| CT-01 | clarification | sized by exercise count; time is an estimate; never a constraint | §5.6, §10.5 | `rule_tables.session_limits.no_time_fitting`, `rule_tables.time_model.use` |
| CX-01 | clarification | reach the planned final sets; faster steps allowed | §5.4 | `rule_tables.rate_engine.progression_v1_3` |
| CX-02 | clarification | the same sets may hold while reps or load progress; sets editable per day and week | §5.4, §10.10 | `rule_tables.rate_engine.progression_v1_3`, `plan_editing.v1_3` |
| CX-03 | clarification | at the top, sets stay; reps and load progress | §5.4 | `rule_tables.rate_engine.progression_v1_3` |
| CX-04 | explanation | the output is a complete, editable template | §10.10 | `plan_editing.v1_3` |
| R4-SES-01 | RIGHT + words | no session-length question; an average estimate only | §13.2 | `inputs_schema.removed_fields`, `rule_tables.time_model.estimate` |
| R4-SES-02 | RIGHT + words | exercises per session by client type | §5.6, §10.5 | `rule_tables.session_limits.session_size` |
| R4-SES-03 | RIGHT + words | 2 days: every big group at about 6-8 weekly sets; suggest a third day | §5.3 | `rule_tables.session_limits.two_day_rule` |
| R4-SES-04 | PARTLY | nothing dropped automatically; the person picks | §10.10 | `rule_tables.session_limits.nothing_dropped` |
| R4-SES-05 | NOT RIGHT + his template | the A / B days and push / pull / legs are the skeleton | §10.3, §10.8 | `template_refs.skeletons_v1_3` |
| R4-PRG-01 | RIGHT | top number in the last week; one week early at most | §5.4 | `rule_tables.rate_engine.progression_v1_3.arrival` |
| R4-PRG-02 | RIGHT | no hard limit; a note above about 15 % | §5.4d | `rule_tables.rate_engine.progression_v1_3.note_above` |
| R4-PRG-03 | RIGHT | reps and load as a rule the person applies | §7.4 | `rule_tables.rate_engine.progression_v1_3.rep_and_load_rule` |
| R4-PRG-04 | RIGHT + words | next block about 5 % above the last start, never above the top | §5.1 V22, §11.4 | `plan_types.cycles.next_block_v1_3` |
| R4-LIB-01 | RIGHT + words | optional add-ons, never template picks (wall balls and sled pushes in HYROX excepted) | §4.1b | `rule_tables.library_decisions.v1_3.optional_addons` |
| R4-LIB-02 | RIGHT | carries and sleds by distance or time; no muscle sets | §4.1b | `rule_tables.library_decisions.v1_3.carries_and_sleds` |
| R4-LIB-03 | RIGHT + words | mid-range pull; incline before overhead | §4.1b | `rule_tables.library_decisions.v1_3.mid_range_pull`, `.incline_first` |
| R4-LIB-04 | RIGHT | a swap says what it keeps and loses | §8.5 | `rule_tables.library_decisions.v1_3.swap_notes` |
| R4-LIB-05 | RIGHT + words | no third-party video links; search link and copy-the-name | §4.1b | `rule_tables.library_decisions.v1_3.video`, `output.videos` |
| R4-SCP-01 | RIGHT + words | everyone may use it; liability released before and after | §13.1 G8 | `legal_and_privacy.liability_gate` |
| R4-SCP-02 | PARTLY | the box must be ticked before the plan shows; a release line on the plan | §13.1 G8, §13.6 | `legal_and_privacy.liability_gate`, `legal_and_privacy.release_line` |
| R4-SCP-03 | RIGHT | a confidence label on every sport profile | §9.4 | `vocab.profile_confidence` |
| R4-REL-01 | RIGHT + words | model v1.3 is the product; the engine is experimental | §14.1 | `_meta.release` |
| R4-REL-02 | PARTLY | build the engine now | §14.1 | `_meta.release` |
| R4-REL-03 | PARTLY | credit: Coach Lalo (Gerardo Vera), Master NASM coach; his intellectual property | header | `legal_and_privacy.credit`, `_meta.credit` |

---

## 0e. What changed in v1.4 (round 5, CH5, CH6; 2026-10-13)

His words that set the direction: "It doesn't stop because we're not taking on any liability, but it should warn them" (R5-GEN-02); "Two full-body days would be more beneficial for this person" (R5-GEN-01); "Nothing should start at their top number. It should all be gradual" (R5-CLS-07); "Make sure you make the core work optional, everything should be adjustable/adaptable" (R5-GRD-06); "they should reach more if needed, no cap until 35" (CH5-03).

**The short version.** A health-check yes now warns instead of stopping the plan. Two training days are two full-body days. Jumps progress from two-leg and low to single-leg and higher. The class uses named community workouts. No group starts at its top. Overhead pressing stays for shoulder health. People may add their own exercise (front-end tool).

### 0e.1 The new answers in numbers

Round 5: 43 answers (`answers_raw_r5/`). 8 are his grades of the sample plans (engine 0.6.0): **A** for 01 swimming, 02 football, 07 push / pull / legs; **B+** for 03 soccer, 04 CrossFit-style class, 05 bootcamp, 06 full-body aesthetics, 08 pickleball; his notes on 03, 04, 05, 06 and 08 are rules. The other 35: **29 RIGHT**, **5 PARTLY** (R5-VOL-01, R5-VOL-09, R5-CLS-03, R5-CLS-07, R5-GEN-02: his words define the rule), **1 NOT RIGHT** (R5-GEN-01: two full-body days, not A + B). Plus **CH5-01..03** (team practices, the athletic arm slot, big groups above the template's slots) and **CH6-01..02** (a dip above the bench; exercises people add themselves).

### 0e.2 The changes that move the generator most

| # | v1.3 | v1.4 (the coach's rule) | ID | Where here |
|---|---|---|---|---|
| 1 | A health-check yes (or severe pain) stops the plan (status refer) | **The plan is built and prints a health warning** in EN and ES: general fitness information, not a plan from a doctor; see a medical professional. It never says which question was a yes. The release gate still runs first. Severe pain: built with the moderate pain rules and the same warning (PROPOSED) | R5-GEN-02 | §13.1 G7, §13.2 F01 / F35-F36, §13.3, §13.6 V1 |
| 2 | 2 days = one A day + one B day | **Two full-body days**, each a knee lift with a pull and a hip lift with a push, both upper vectors and both lower patterns over the two days (slot split PROPOSED) | R5-GEN-01 | §5.1 V25, §5.6.2, §10.1 W30 |
| 3 | High-incline press 1.0 front delts + 0.5 chest (PROPOSED) | **1.0 chest + 0.25 front delts + 0.25 triceps** | R5-VOL-01 | §5.2, §0d.3 #5 |
| 4 | A group may start at its top (bootcamp shoulders) | **No group starts at its top number**; a Focus group starts a little higher | R5-CLS-07 | §5.4 |
| 5 | Big groups held at what the training days hold | A big group reaches its planned final sets, with a bonus exercise if needed; **no group above 35 weekly sets** | CH5-03 | §5.5 |
| 6 | Optional-day bonus never after a press day | A light chest exercise (fly or machine press) may go on the optional day even after a press day | R5-VOL-07 | §5.5 |
| 7 | An athlete's flat press at most 4 sets | 4 by default; more when chest is a Focus muscle or the goal asks | R5-VOL-09 | §5.5 |
| 8 | A one-set shortfall left held | The day's first press takes a 5th set in the last block | R5-VOL-11 | §5.5 |
| 9 | The heavy deadlift may sit at 2 sets | Starts at 3 and takes its group's next set ahead of the other hip lifts | R5-ATH-12 | §5.5 |
| 10 | Jumps by stage only | **Two-leg, symmetrical, low first; single-leg and higher later** (jump rope -> two-leg hops -> easy single-leg hops -> hurdle hop-overs); never a single-leg hurdle hop in the first block. Cutting sports: a lateral or single-leg jump every day, two-foot lateral first | R5-GRD-03, R5-ATH-10 | §9.2, §9.3 |
| 11 | Knee pain: fewer jumps | **Assisted jumps first** (holding a support, never a band); the plan warns to skip jumps above 6 of 10 pain | R5-GRD-08 | §9.9 |
| 12 | Athletic doses climb | Jumps, throws, cuts and sprint metres may hold up to 2 weeks and still reach the block's number | R5-ATH-02 | §9.2 |
| 13 | Incline first for bodybuilders and general population | Also for throwers and volleyball; **overhead pressing stays in the plan for shoulder health** (the engine keeps a weekly overhead press, or one light overhead press as joint care; the general-plan reading is PROPOSED) | R5-ATH-04 | §4.1b, §9.11 |
| 14 | Low-back core for 50+ racket players by hot spot | Low-back core (dead bugs, bird dogs, side planks, Pallof press) **only with reported low-back pain**; otherwise normal core with rotation | R5-ATH-08, R5-LIB-02 | §9.9, §10.2 |
| 15 | The class's WODs of the engine's own | **Named community workouts**: a Girl each week, a Hero once a block, a benchmark every 2-4 weeks, the rest varied (library and scaling PROPOSED) | R5-GRD-04 | §10.6 |
| 16 | Bootcamp station by station | **Some days in rounds (circuits), some station by station** (split PROPOSED) | R5-GRD-05 | §10.6 |
| 17 | One more round late in the block | **Rounds climb in thirds**: 3, then 4, then 5 (12 weeks: 4 / 4 / 4) | R5-CLS-03 | §10.6 |
| 18 | Class small muscles 15-20 reps | 10-12 reps; arms and shoulders near floor + 2, chest and back 14-16, legs full | R5-CLS-05 | §7.3 |
| 19 | Arm slot only for some sports; practices counted as aerobic | **Every athletic A / B day holds the arm slot**; team practices are the athlete's own to account for (one line) | CH5-02, CH5-01 | §9.7, §10.8 |
| 20 | Core block printed as a normal block | **Printed as optional**: "you may switch it off or change it"; everything adjustable | R5-GRD-06 | §10.10 |
| 21 | Sheet exports with third-party links; certifications to be listed | `raw/`, `dumps/`, `analysis/` public, **link-stripped**, checked for client names (none). Credentials: **"Master NASM coach" only** | R5-PUB-01, R5-PUB-02 | header, §14 |
| 22 | (none) | **People may add their own exercise** anywhere, answering one question (the main muscle, or "jump / cardio"), labelled "your exercise: not checked by Blaze Camp rules". For the front-end tool; the official library still needs full tagging and his approval | CH6-02 | §10.10 |

Confirmed as built (no change): R5-VOL-02 (pulling at or above pressing), R5-VOL-03 (side delts at least 4 / 6 / 8), R5-VOL-04 (one biceps and one triceps exercise on A / B days), R5-VOL-05 (A day 7th calves, 8th rear delts; B day 7th side delts, 8th calves), R5-VOL-08 (advanced physique Focus 22, others 16), R5-VOL-10 (racket 50+ calf raise on both days), R5-ATH-01, 03, 05, 07, 09, 11, R5-CLS-01, 02, 04, 06, R5-LIB-01, R5-GEN-03 (default counts: general 7, aesthetics 7, strength 6, bootcamp 7, field athletes 12, older adults 6), CH6-01 (a dip above the bench is fine). All adjustable by the person or coach (CX-04).

### 0e.3 Retired in v1.4

A health-check flag that stops the plan (status refer); one A day + one B day on 2 days; the high-incline press's 1.0 front delts + 0.5 chest; a group starting at its top; the 50+ low-back hot-spot core list without reported pain; team practices counted as aerobic sessions; the certifications placeholder.

### 0e.4 Still open after round 5

Severe pain read as moderate (PROPOSED); which slots go to which full-body day; the four jump levels and their weights; the named-workout library, its scaling and the Hero's week; the bootcamp format split; the weekly light overhead press in general plans; the wording of the health warning (attorney); the Spanish (coach). The engine's open items are in `HANDOFF.md`.

---

## 1. The philosophy in his words

### 1.1 What he said (short quotes; the full text is in `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_round3.md`, `coach_answers_round2.md` and `coach_answers_full.md`)

| Topic | His words | ID |
|---|---|---|
| Taxonomy | "this is the whole taxonomy of each exercise ... we can segment by whatever we need ... This is huge." | CAT-01 |
| Biomechanics | "biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises." | CAT-03 |
| Levels | "Mostly, skill and stability demand ... Also, in the positioning"; machines and cables "easier because the machine or the cable is doing the work for you." | CAT-04 |
| Levels are soft | "The levels are still very theoretical, so we don't need to rely heavily on them." | CAT-05 |
| How much volume | "15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation." | UNI-01 |
| The floor | "I don't think anybody needs less than 10 sets a week per muscle." "8 sets a week is probably just barely maintenance ... the little muscles also grow the same idea." | R2-VOL-06, R2-VOL-04 |
| Shoulders are one group | "I wouldn't categorize the rear delt as an individual muscle ... If you put together all the sets of shoulders, it'll equate to more than 10 sets ... People and coaches should always be able to add more rear delts." | **R3-VOL-01** |
| Focus muscles | "they should be able to choose one of the main muscles that they want to work on the most ... an extra set or two or three ... There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." | **R3-SES-01** |
| What people do | "I think most people train around that: 20 to 30 sets per muscle per week. I believe so, but you can do some research and figure it out." More than 30 "should probably be for a very advanced person. Maybe we can add a pro level." | R2-VOL-06 |
| Customizable | "Yeah, but this is all customizable." | R2-VOL-06 |
| Learning (superseded) | "This eventually will be something that learns from the data of all the people that use it." **Superseded by round 3:** "I don't want any data kept." | VOL-01; **R3-GEN-01** |
| The stairway | "the 8-week plan should gradually go up like steps up a stairway. That's how every program should be ... When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan." | R2-PER-03 |
| Hardest last | "on a 12-week program, the last 4 weeks are going to be brutal ... week by week, it just gets gradually worse. I mean worse, meaning better, more volume." | R2-PER-04 |
| 2 → 11 | "I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets ... The last week might feel like an 11 ... you've pushed yourself a little bit past your limits." | R2-PER-05 |
| The stairway runs by itself | "The program will just have its natural algorithm recommendation of growth throughout it, so anybody can just plug in the numbers of what they want as far as weeks and sport or goals." | **R3-VOL-04** |
| Kick out a program | "I want this to be very simple ... I want them to be able to kick out a program, and that's it. That's the program ... It's already a template, and you need to adjust it as you need to." "This needs to be very simple for them to see the whole thing ahead of time." | **R3-VOL-04** |
| No check-ins | "we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." (Round 2 history: "If they don't check in, the plan doesn't change. There is no data to go off of.") | **R3-VOL-02**; R2-VOL-03 |
| 10 % is too much (now a default, not a limit) | "It can progress week by week by 10 %. That's way too much." **v1.3:** the plan still starts from small steps, but it reaches its final sets: "go ahead and increase faster if thats the need, they could edit accordingly." | UNI-05; **CX-01** |
| Workouts only | "I just need the workouts here. There's no need to talk about sleep or stress or anything else." | R2-GEN-04 |
| Effort 10 | "10 should be like, 'That was the max I can do, not a fail' ... I gave it all I had, but it was successful." | R2-VOL-02 |
| Blocks are completed | "It should never be thrown in the middle of a block ... If they can't complete it, they should cancel the block and start a maintenance phase ... then ... start a whole new block." | R2-VOL-07 |
| When a block ends, it ends | "maintenance weeks are a recommendation. They don't have to be mandatory ... when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." | **R3-PER-01** |
| The tool does the math | "I need this tool that we're building eventually to figure out the percentages." | VOL-06 |
| Where sets go | "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning." | VOL-07 |
| Never one exercise (split days) | "full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day ... there's never one exercise." **v1.3:** on full-body days his A / B template decides (next row); split days keep 2-4. | R2-SES-05; **R4-SES-05** |
| The A day and the B day | "The template is usually 6 exercises for the full-body days because we do that A-day/B-day of upper/lower ... Day A: back, quads, and biceps. It's going to be more pull- and knee-dominant movements. Day B: push with hip-dominant movements ... chest, shoulders, and tricep with hamstrings and glutes ... This is the model that I believe is the greatest one." "Those days ... can run anywhere from 6 exercises to 8 exercises, and that's already a great training day." | **R4-SES-05** |
| Time is the person's | "You need to stop trying to be responsible for the people's time ... We just worry about the amount of exercises within the session ... We can give an average recommendation of what it should take, but we will never know what it's going to take. I want you to not get complicated over the time." "Drop it. We don't need it ... We don't need to be counting their time." | **CT-01**; **R4-SES-01** |
| Templates to add or take away | "This is just our recommendation. These are templates that we're giving them for them to add or take away." "That's something for the athlete to adjust ... they get to pick what they want to keep or what they want to take away." | **R4-SES-02, R4-SES-04** |
| Supersets | "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (His "this is fine" to the time order of round 3 is superseded by CT-01.) | **R3-SES-02**; CT-01 |
| Everything editable | "This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to ... it will be editable, but they might not need to most of the time." Same sets while reps or load progress: "yes but also should be editable if they want to adjust their sets on that week or that day doesnt matter." | **CX-04, CX-02** |
| Switch blocks off | "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance ... or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly." | **R3-SES-02** |
| Bilateral vs unilateral | "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." | UNI-02 |
| Pairing | "If I'm doing the back of my lower body, then the opposite would be the front of my upper body ... keep as far away as I can from bleeding over." | UNI-11 |
| Spine | "I would rather just load it once per week and load it correctly." (round 2: heavy squat and heavy deadlift on two different days, RIGHT) | PER-04, R2-SES-01 |
| Core | "we need all the core work to be done first ... that'll give you a good warm-up." Core supersets: "It should be optional to be thrown anywhere." | ATH-11, R2-SES-03 |
| KB swings | "kettlebell swings are not glutes ... mostly supposed to be used for the ballistic movements, not for resistance training." | R2-VOL-05 |
| Athletes | "The more time on the ground ... the more ballistics and less plyos." "everyone gets Olympic lifts." | ATH-01, ATH-10 |
| Olympic lifts | "it could be done four times a week. Some days are about cleans, and some days are about snatches ... I take snatches a little bit more hingy than squatty." | R2-ATH-04 |
| Older adults | "we're not going to need them to be doing any Olympic lifting, plyos, depth jumps ... but it should be an additional option ... 'Make sure that you have a fitness professional to help you understand what this means.'" (round 3 approved the on / off list) | R2-ATH-08; R3-ATH-02 |
| Plyos | "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." | CAT-10 |
| Cardio | "You can always say, 'I need more cardio,' and then it just adds it ... less cardio, it takes away ... it can always be adjustable." | R2-SES-06 |
| Testing | "they should not test during the weeks, during the block ... you should not go from not training to a one-rep max test ... test at 80%, 90%, but not at 100%." | R2-PER-07 |
| The year | "this is for the general population that wants to just stay in shape ... They can just switch it around ... ramp it up to powerlifting style." | R2-PER-01, R2-PER-02 |
| Equipment | "I don't do bands." "I don't want to rank them because they have different brands, angles." | EQ-01, EQ-11 |
| Optional exercises | "I don't want to make them primary exercises ... they can be optional, and they can be chosen and added, but not primary ones that the program is going to throw at you as part of the template. The only ones that I see that might be primary are wall balls and sled pushes because that's part of High Rocks [HYROX] programming." | **R4-LIB-01** |
| Incline before overhead | "ideally we want to prioritize incline for the pushing instead of overhead pressing, but they're part of the program, and we should have that variability. For bodybuilders ... For the general population, I would rather ... bias incline pressing." | **R4-LIB-03** |
| Pain | cut 30-50 %, machines, "maybe even drop the exercise altogether if it's too much." | VOL-03 |
| People, not labels | "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." | ATH-09 |
| Effort | "I like RIR in my model, so that's what I'm going to be using." | VOL-13 |
| The product | "The fewer clicks, the better ... the macro view of the week, the macro view of the block, and the macro view per day ... they can just screenshot their 12 weeks." "They can just look up the videos on their own on YouTube." Round 4: "make sure that there is an easy way to copy the name ... 'Click here to copy it and put into YouTube.'" | R2-GEN-02; **R4-LIB-05** |
| Safety and liability | "If you're a client, then we take them through the park queue [PAR-Q] ... I want to be able to bypass it if I'm a coach ... We want everyone that's using it, every time they're going to get it, to release liability." | R2-GEN-03 |
| Own risk, nothing kept | "there probably should be a 'use at your own risk' checkbox. I don't know if we should be keeping any kind of data, but I don't want any data kept ... Terms and conditions and liability releases. They should all be in that." | **R3-GEN-01** |
| Release before the plan | "Everyone should be able to use the plan on their own, but all the plans should release liability before and after it gets kicked out." "they need to click it before the plan shows ... It should also be ... outputted in their program somewhere at the bottom or at the top: you've released liability." | **R4-SCP-01, R4-SCP-02** |
| The licence | "there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation) ... you're downloading this at your own expense and risk, and that if you are going to use this for other clients ... you should have your own liability release." | **R3-GEN-01** |
| Everyone can be athletic | "all of the different popular sports in the United States ... Include swimming as well ... pickleball ... high rows [HYROX] ... they want to stay athletic and active." | COACH-CHAT 2026-10-08; 'high rows' = HYROX confirmed, R3-ATH-03 |
| Users | "clients, coaches, trainers, strength and conditioning coaches, anyone"; English first with a full Spanish toggle (neutral Latin American Spanish approved; legal texts "as legally equivalent as possible in English and Spanish"). | GEN-01, R2-GEN-08; R3-GEN-01 |
| Lineage | Dr. Pat Davidson + Dr. Mike Israetel + first-principles science, not packaged models (5/3/1, Texas Method, Prilepin). | COACH-CHAT |
| Whose model this is | "it should talk about this being a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera. Master NASM coach ... This is me and my intellectual property of condensing and consolidating everything and the way I think of the workflows of putting together programming." | **R4-REL-03** |

### 1.2 The model in twenty sentences

1. **Classify first, then dose.** Every exercise is tagged on every lens at once: family, pattern, laterality, plane, size class, muscles, equipment, constraint, load position, level (COACH-ANSWER CAT-01, CAT-03).
2. **A slot is CATEGORY × PURPOSE.** The category ('Unilateral KD') is the Davidson half (a pattern and a position); the purpose ('Quads/Glutes') is the Israetel half (the muscle credited). The generator places patterns and audits muscles (OBSERVED BYOP rows; INFERRED reading).
3. **Big muscles are organised by pattern, small muscles by muscle** (COACH-ANSWER CAT-02; OBSERVED LIB columns).
4. **Exercise level = skill + stability + where the load sits**, made easier by a seat, machine or cable; zones are rotation-bias tags, not levels; levels add options, never gate (COACH-ANSWER CAT-04, CAT-05, CAT-06; COACH-R2 R2-LIB-02, R2-LIB-03).
5. **Count weekly hard sets per FOCUS group**: main mover 1.0, helpers 0.25 (glutes 0.25 on squats, lunges, deadlifts and RDLs), 10/10 = one set; hips = glutes + hamstrings, shoulders = front + side + rear delts; athletic work never counts, KB swings and HYROX station circuits included (COACH-ANSWER VOL-09, UNI-01, VOL-10; COACH-R2 R2-VOL-05; COACH-R3 R3-SES-01, R3-VOL-01, R3-ATH-03).
6. **Start where the person is** (10-12 / 15-20 / 20+; shoulders, biceps, triceps 10 / 12 / 15) and **never below 10 sets a week per trained group** (from 3 training days; with 2 days every big group is trained at about 6-8, R4-SES-03); caps 14 / 22 / 25, all customizable; **Focus muscle 1 and Focus muscle 2 get 1-3 extra sets a week each** on top of the balanced plan (COACH-ANSWER VOL-01; COACH-R2 R2-VOL-04, R2-VOL-06; COACH-R3 R3-VOL-01, R3-SES-01; COACH-R4 R4-SES-03).
7. **Every plan climbs a stairway and reaches its planned final sets**: the default pattern is about 3 % a week to the halfway week and about 5 % after it; steps may be faster when that is what it takes to get there (no hard limit; a note on any week that adds more than about 15 %); the top number arrives in the last week (one week early at most); a week may keep the same sets while reps or load progress; it feels like a 2 in week 1 and an 11 at the end (3 → 2 → 1-2 → 1 RIR + intensifiers, inside 1-3 RIR); the tool turns the steps into whole sets, added to the first exercise of the day first and alternating the two exposures of a day type (COACH-R2 R2-PER-03, R2-PER-04, R2-PER-05; COACH-R3 R3-VOL-04, R3-VOL-03; COACH-CX CX-01, CX-02, CX-03; COACH-R4 R4-PRG-01, R4-PRG-02; COACH-ANSWER VOL-06, VOL-07).
8. **Answers in, the whole plan out; nothing comes back and nothing is kept.** No check-ins, no tracking, no adaptive inputs, no sleep, stress or life questions; people and coaches adjust the plan themselves (COACH-R3 R3-VOL-02, R3-VOL-04, R3-GEN-01; COACH-R2 R2-GEN-04).
9. **Bilateral drives force, unilateral keeps the body healthy and rotational**: the share slides from 90/10 to 10/90 by athlete, phase and pain (COACH-ANSWER UNI-02).
10. **Every session**: warm-up → light core (2 × 2) → athletic work → Olympic/power → the work with its opposite-surface partner (hip + push, knee + pull) → secondary pair → isolation → conditioning. **The day is his template**: the A day is pull + knee dominant (horizontal pull, squat, vertical pull, lunge, biceps, leg extension), the B day is push + hip dominant (horizontal push, hinge or hip thrust, vertical or incline push, single-leg hinge, triceps, leg curl), about 6 exercises and up to 8; push / pull / legs and his other templates as written; on split days every group gets 2-4 exercises; **calves one exercise × 3 sets per leg day** (COACH-ANSWER ATH-11, ORD-01..08, UNI-11; COACH-R2 R2-SES-03, R2-SES-05; COACH-R3 R3-SES-01; COACH-R4 R4-SES-05).
11. **Heavy squat and heavy deadlift on two different days**; the other lower days are non-axial (hip thrust, back extension, leg press, belt squat) (COACH-R2 R2-SES-01, R2-SES-02).
12. **Blocks are completed, and then they end**: same exercises for 4-6 weeks, one detail may change at the next exercise block, never an invented exercise; no deload or maintenance week inside a block; after a block an easy week (about half the sets) is recommended, not required; the person decides when to stop and builds the next plan; holidays go between blocks (COACH-ANSWER PER-02; COACH-R2 R2-LIB-01, R2-VOL-07, R2-PER-06; COACH-R3 R3-PER-01).
13. **Athletes: the sport's ground time sets plyo vs ballistic** (approved shares for every sport); programs start ballistic and become plyometric through the Receive-Create stages; Olympic lifts up to 4 × a week, cleans on squat days and snatches on hinge days; field athletes do their athletic block and then the A / B lifts, inside 12 + 2 core (COACH-ANSWER ATH-01, CAT-10, ATH-10; COACH-R2 R2-ATH-01..05; COACH-R3 R3-ATH-04, R3-SES-01; COACH-R4 R4-SES-02, R4-SES-05).
14. **Everyone can train athletic**: every popular US sport (swimming included) has its profile, and gen-pop people who "want to stay athletic and active" (pickleball, HYROX, rec leagues ...) get the non-competitive athletic plan with their play days, the activity counted as cardio and an optional event date (COACH-ANSWER ATH-13; COACH-CHAT 2026-10-08; COACH-R3 R3-ATH-01, R3-ATH-03, R3-ATH-05).
15. **Safety beats labels**: a short lawyer-written health check (coaches may skip it with a warning); **the terms and the release of liability accepted before every build - no plan without it - and a short release line printed on every plan**; 60+ get landing drills, balance, quick stepping, light medball throws and fast machine work, with jumps, Olympic lifts and depth jumps only when switched on with his warning; racket players from 50 get knee-friendly, low-impact defaults; tests never from zero; pain cuts 30-50 % or drops the exercise (COACH-R4 R4-SCP-01, R4-SCP-02; COACH-R3 R3-GEN-01, R3-ATH-02; COACH-R2 R2-PER-07; COACH-ANSWER EQ-03, VOL-03).
16. **No bands, no variable resistance, no machine ranking, no sex-based rules; the tool does the math and does not learn from users; the repository is MIT-licensed to Lalo Vera, Blaze Camp and BFit Studios Corp., and the model is the intellectual property and coaching experience of Coach Lalo (Gerardo Vera), Master NASM coach** (COACH-R4 R4-REL-03; COACH-ANSWER EQ-01, EQ-12, EQ-11, ATH-09, VOL-06; COACH-R3 R3-GEN-01).
17. **The plan is sized by exercises, not minutes**: general fitness and fat loss 5-7 exercises a session, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes off-season up to 12, older adults 5-6 (not counting the warm-up or the 2 core exercises); the form does not ask for a session length; each day prints an average time estimate as information; nothing is cut, reshaped or flagged because of time (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02). The v1.2 sentence "when the time cannot hold the minimums, the plan says so first" is retired.
18. **The plan is a complete template people edit**: nothing is dropped automatically; the person picks what to remove and the plan names the easiest things to remove; a day's athletic or core block can be switched off (the plan prints the core block as optional: "you may switch it off or change it", COACH-R5 R5-GRD-06), exercises and whole blocks added or removed, the sets of any day or week changed, the suggested supersets taken; after an edit the totals are recomputed and the plan is marked edited (COACH-R3 R3-SES-02; COACH-CX CX-02, CX-04; COACH-R4 R4-SES-04; "It's already a template, and you need to adjust it as you need to", R3-VOL-04).
19. **Reps and load progress by a rule the person applies**, never a promised number per week: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." The next block starts about 5 % above the last block's start, never above the level's top; at the top, sets stay and load and reps progress (COACH-R4 R4-PRG-03, R4-PRG-04; COACH-CX CX-03).
20. **The library has primary exercises and optional add-ons**: the add-ons (carries, sleds, wall balls, reaction drills, swimmer shoulder work, tibialis and soleus raises ...) can be chosen and added but are never template picks, except wall balls and sled pushes in HYROX; carries and sleds are written by distance or time and are not muscle sets; a mid-range pull sits between the horizontal and the vertical pull; incline pressing comes before overhead pressing for bodybuilders and the general population; a swap says what it keeps and loses; videos are a YouTube search with the name ready to copy (COACH-R4 R4-LIB-01..05).

---

## 2. The segmentation model

### 2.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| S1 | **Every exercise is tagged on all lenses at once**: family, pattern, laterality, plane, size class, muscles credited, implement/constraint, level (plus the v1 fields below). The generator can then segment by any of them. | COACH-ANSWER CAT-01 |
| S2 | **Families**: Athletic patterns (AP), Resistance patterns (RP), Control/core (CO: thorax CT, pelvis CP, both CB), Cardio/conditioning (CA), Functional systems (FN: carries, drags, slings). | OBSERVED LIB row 4; CAT-01 |
| S3 | **Big muscles**: quads, glutes, hamstrings, lats/upper back, chest. **Small muscles**: biceps, triceps, side delts, rear delts, calves, forearms, abs. **v1.2**: front, side and rear delts count as one **shoulders** group; rear delts are "not an individual muscle". | COACH-ANSWER CAT-02; **COACH-R3 R3-VOL-01** |
| S4 | **Biomechanics is the description every exercise carries** (plane, laterality, load position, stance, ROM, zone), **not a bucket**. | COACH-ANSWER CAT-03 |
| S5 | **Core**: thorax = the trunk moves on a still pelvis; pelvis = the pelvis/legs move on a still trunk; both at once; each in any plane, static or dynamic. | COACH-ANSWER CAT-08 |
| S6 | **Leg curls, Nordics, slider/ball curls are LEG FLEXION** (node `RP.LF`), not hip dominant; they count fully to hamstrings and never to the hinge pattern. | COACH-ANSWER CAT-09, VOL-09 |
| S7 | **Athletic patterns never count toward muscle volume** (plyos, ballistics incl. KB swings, throws, Olympic lifts, sprints, change of direction); they have their own units. | COACH-ANSWER VOL-10; COACH-R2 R2-VOL-05 |
| S8 | **The BYOP MASTER EXERCISE LIBRARY is the single source of truth**; Sheet23 and RESISTANCE PATTERNS are older drafts used for levels and grammar. | COACH-ANSWER CAT-07 |
| S9 | **Speed (sprint and running mechanics) is a library category** (squirrel jumps → MACH drills / acceleration starts → max velocity, fixed order). | COACH-ANSWER LIB-21 |
| S10 | **Carries, drags and sling systems are to be built out**: carries and drags for athletes and general fitness; slings for advanced athletes and rehab. | COACH-ANSWER LIB-19 |
| S11 | **One-detail variations, never invented exercises.** His library exercises are always the main pick; between exercise blocks the tool may change one detail (which hand holds the weight, grip, stance, implement, range) and show it as '<library name> - <detail>', e.g. 'Reverse lunge - dumbbell in opposite hand'. | COACH-R2 R2-LIB-01 (APPROVED; answers CAT-12) |
| S12 | **KB face pulls are shoulder work** (side / rear delts / traps), done mainly on pull or shoulder days and adjustable; a swap, never the main vertical pull. | COACH-R2 R2-LIB-04, LIB-10 |
| S13 | **FOCUS groups** (his FOCUS headers) are the unit for the floor of 10, "2-4 exercises per group" on split days (v1.3: the time check is retired, CT-01): quads; **hips = glutes + hamstrings** (RDL + hip thrust + leg curl = 3 hip exercises); chest; back; **shoulders = front + side + rear delts** (+ traps for display); biceps; triceps; **calves** (one exercise × 3 sets per leg day); core = the opener. Glutes and hamstrings keep their own lines for starts and display. | **COACH-R3 R3-SES-01, R3-VOL-01** |

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
        small muscles -> by muscle ('SIDE RAISES', 'BICEP', 'TRICEP', 'CALVES'; rear-delt work inside the shoulders group, R3-VOL-01;
                                                  KB face pulls here, R2-LIB-04)
        biomechanics  -> NOT a bucket: the description on every record
STEP 3  EXERCISE LEVEL inside the bucket = skill + stability + load position; seat/machine/cable easier; soft default (section 3)
STEP 4  VARIABLES on the base exercise: stance, load position, into/out of the hip, grip, feet/body, ROM, end range,
        implement/constraint, axial load, tempo, intent. One detail may change between exercise blocks (R2-LIB-01).
        Bands/chains/releasers: DORMANT (EQ-01, EQ-12)
STEP 5  THE SLOT = PURPOSE (muscle or quality credited) x CATEGORY (bucket the exercise is drawn from)
STEP 6  THE FOCUS GROUP the floor and the exercises-per-group rule count on (hips = glutes + hamstrings,
        shoulders = front + side + rear delts; R3-SES-01, R3-VOL-01)
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

**v1.3 addition (COACH-R4 R4-LIB-03).** A **mid-range pull** node, `RP.PL.M` (pattern `MRPULL`), sits between the horizontal pull and the vertical pull: high row, 45-degree row, face-pull angle. It mirrors his mid-range push (incline, landmine). `01_taxonomy.json` was not re-issued; the compiler adds the node and the tags `mid_range_pull` / `mid_range_push`.

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
| 'Shoulders/Traps' | 'ABdution' / 'Reverse Flies' | AH7:AH42 | RP.SM.DELT | side delts 1.0 (upright rows too, LIB-16); rear delts 1.0 on rear-delt items; **KB / cable face pulls: rear delts 1.0 + side delts 0.25** (R2-LIB-04, LIB-10; split PROPOSED); **v1.2: all of it counts to one shoulders group, a set at most 1.0 to the group** (R3-VOL-01; group credit PROPOSED) |
| 'Bicep' / 'Tricep' / 'Calves' | same | AS / AT / AU | RP.SM.BI / TRI / CALF | target 1.0; calves one exercise × 3 sets every leg day (VOL-17; R3-SES-01) |
| 'Plyo' / 'Throwing' / 'COD' / 'Tripple Extension' | same | G / K / L / C | AP.JMP / THR / COD / TEX | none: contacts, throws, cuts, power reps (VOL-10) |
| 'Core' | (blank) | O7:O283 | CO.CT / CP / CB | abs/obliques 1.0; light opener first (ATH-11, R2-SES-03) |
| 'Cardio' / 'Aerobic Capacity' | (blank) | B7:B122 | CA | sessions and bouts, not sets |
| 'Focus 1' / 'Focus 2' | (blank) | AZ7:AZ335 | X.FOCUS | the muscle picked; 2-3 sets each, both may hit the same muscle (ORD-11); they also carry the extra sets of the intake Focus muscle 1 / 2 (R3-SES-01) |

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
| `F.ROLE` | PRIMER, CORE_BLOCK (light opener; core supersets anywhere), ATHLETIC_BLOCK, MAIN, SECONDARY, ISOLATION, FINISHER, OPTIONAL_DAY ... + strength roles the work / accessory / nuance / survival; **v1.2**: plan blocks carry stable ids and kinds (warm-up, core, skill, athletic, Olympic, strength, accessory, calves, focus, finisher, cardio) with on / off flags for editing | confirmed; block ids PROPOSED | ATH-11, ORD-07; R2-SES-03, R2-SES-04; **R3-SES-02** |
| `F.WEEKTYPE` | training week, end-test week, easy week (between blocks only; recommended, not mandatory), maintenance week (maintenance phase only), taper | no deload or maintenance week inside a block | R2-VOL-07, R2-PER-06, R2-PER-07; **R3-PER-01** |
| `F.SEASON` | OFF, PRE (4-6 weeks ~60 % + taper), IN, POST | from the season start date + practice and game days | R2-PER-06, R2-GEN-05, R2-ATH-07 |
| `F.ACCOM` | BANDS, REV_BANDS, CHAINS, RELEASERS | **DORMANT** | EQ-01, EQ-12 |
| `F.PERTURB` | ADDUCT (active); HIP_BAND DORMANT; STRAP removed | | EQ-01, LIB-09 |
| core | segment (CT/CP/CB) × plane × static/dynamic | confirmed | CAT-08 |
| others kept | F.PHASE (force phase P1-P4), F.TURN (COD), F.OLY (start position/receive), F.STANCE, F.ORIENT, F.GRIP, F.BODYPOS, F.ROM, F.END, F.ABAND (A/B/C/LC; count adjustable, R2-SES-06), F.EZONE, F.VOL (VOL 1/2/3) | | OBSERVED |

### 2.6 One record per exercise (required fields)

**Required on every exercise** (COACH-ANSWER CAT-01): `family`, `node_id` (pattern), `laterality`, `plane`, `size_class`, `muscle_credit` (empty for athletic work), `implement[]`, `level`. **Also carried**: `constraint_level` 1-5, `davidson_zone` + `rotation_bias` + `use_v1_1` (swap selector when something hurts), `load_position`, `load_laterality` + use case, `axial_spinal_load` + `spine_day_v1_1`, `athletic_quality` + `receive_create_stage` + `contact_class_v1_1` (ballistic / plyometric / receive), `olympic_v1_1` (family, frequency, reps rule), `older_default_excluded` (60+) + warning key, `population_rules`, `variation_v1_1.axes` (one-detail axes), `generator` {eligible, pools, default_candidate, why}, `coach_cues`, `video_url` (optional, R2-GEN-02), `name_raw` / `name_clean` / `name_es` (neutral Latin American Spanish with the English gym term in brackets, R2-GEN-08), `status` (active / dormant / out_of_scope / retired / proposed_v1_1), `sport_use_v1_1`, and an evidence tag per field. Schema: `01_taxonomy.json > proposed_cleanup.record_schema`; implementation: `02_exercise_catalog.json` v1.1. **v1.2** (not re-issued in 02): the record does not change; rear delts stay a muscle-credit id read inside the shoulders group (R3-VOL-01), and the 60+ / racket-50+ switches act on `older_default_excluded` (R3-ATH-02).

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
| L8 | **A slot moves up a level at the next block** when it felt '8 - That was perfect' or easier with no pain: the person or coach decides when building the next block (the plan's last page says so; no logs are read). | COACH-ANSWER PER-06; **COACH-R3 R3-VOL-02** |
| L9 | **Bench push-ups both ways**: hands on the bench = foundational (easier); feet on the bench = advanced (harder). | COACH-R2 R2-LIB-05, LIB-12 |
| L10 | **New library items and their levels (approved)**: belt squat (foundational, knee dominant); seated machine shoulder press (foundational, vertical push); hang clean, single-arm DB snatch, KB squat clean and hex-bar jump (foundational, triple extension); KB curl, table row and floor Y/T raises for home clients. | COACH-R2 R2-LIB-07 |

**His ladders, as applied** (OBSERVED ladders; levels per CAT-04; 02 `level.generator_min_level`):

| Pattern | Foundational (L1) | Intermediate (L2) | Advanced (L3) |
|---|---|---|---|
| Bilateral knee dominant | goblet (deep goblet included, R2-LIB-02), front-loaded zercher, hex-bar squat, low DB squat (DBs at the sides), leg press, pendulum, hack, belt squat (R2-LIB-07) | barbell front squat, SSB | high-bar and low-bar back squat, overhead squat |
| Vertical push | seated machine shoulder press (R2-LIB-07), seated DB press (R2-LIB-02), push press (LIB-13) | push jerk (LIB-13) | Z-press (advanced, as his sheet and the catalog file it), standing barbell overhead press (LIB-11), handstand push-up |
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
| **L3** (advanced) | **PROPOSED**: 3+ years consistent and training 4+ days a week now, or a competitive physique/strength athlete | starts 20 (big) / 15 (small); caps 25; small stairway steps (λ 0.50: 1.5 % / 2.5 %) so the cap lands in the last week; the "11" also comes from heavier loads, intensifiers and a Focus muscle (or a coach priority push) up to 30 | PROPOSED (he did not define advanced); COACH-R2 R2-PER-05; COACH-R3 R3-SES-01 |
| **Pro setting** (optional, not a level) | L3 only, chosen by the coach, or by a client who is "really adamant about growing that muscle" | a coach setting at build time: **one** priority-push muscle may pass 30, up to 35 (PROPOSED number); ~~others ≤ 3 %/week while it runs~~ (retired in v1.3 with the other rate limits, §0d.2: every trained group reaches its final sets); a warning shown (v1.1's "weekly check-in required" is retired) | COACH-R2 R2-VOL-06 ("Maybe we can add a pro level"); numbers PROPOSED; COACH-R3 R3-VOL-02 |
| L4 | retired: competition level changes the athlete profile (sport, position, season) and loads/care (PRG-09), not the volume level | - | PRG-05, PRG-09 |

**Rules.** Explain the level in plain words on screen ("You trained 3 years but took 9 months off, so we start your body at Level 1 for the first block") (PRG-05). **One algorithm** for reps, sets and volume at every level and model (PRG-06). Athletic 'STARTING / MID / ADVANCED' off-season templates are blocks or levels "depending on whatever is needed" (PRG-04); PROPOSED decision rule: an off-season of 16+ weeks for an L1-L2 athlete runs them as consecutive blocks. The L1/L2 boundary is read as **12 months of consistent training** (INFERRED from PRG-05). **Retired by round 2**: "L1 acclimation 4 weeks at ≤ 3 %" and "L3 default step 3 % (target-seeking)": every level runs the same stairway, scaled by λ (R2-PER-03, R2-PER-04). **Retired by round 3**: level-up read from logs (L8 is now the person's or coach's call at the next build, R3-VOL-02).

### 3.4 Pending (levels)

- Angle cut-offs of the zones (INFERRED in `01_taxonomy.json > F.DZONE`).
- Power clean / power snatch filed INTERMEDIATE (BYOP files ADVANCED) under ATH-10 "intermediate plus ... full scope" (INFERRED application).
- The L3 definition and the Pro setting numbers (PROPOSED; the Pro setting no longer needs a check-in, R3-VOL-02).
- ~~Zone 1 vs zone 3, support lowering an overhead lift, rotation-bias use~~: answered (R2-LIB-02, R2-LIB-03).

---

## 4. Library and catalog changes

### 4.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| C1 | **Default exercise in every slot plus a dropdown of swaps within the same category.** "That's going to be important." | COACH-ANSWER GEN-04 |
| C2 | **Only BYOP-library items (plus items a coach answer added) can be the default pick**; reference-tab and program-only exercises are dropdown swaps; the ~120 exercises that live only in his programs (SL RDL, JM press, seal rows ...) stay swaps until he adds them. | COACH-ANSWER CAT-07; COACH-R2 R2-LIB-07; v1.3: the proposed additions are optional add-ons, never template picks (COACH-R4 R4-LIB-01, §4.1b) |
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

### 4.1b Round-4 library rules (v1.3)

| # | Rule | ID |
|---|---|---|
| C7 | **Primary exercises and optional add-ons.** The exercises that were marked "proposed" (farmer and suitcase carries, sled push and pull, wall balls, sandbag lunges, burpee broad jumps, split-step reaction drills, swimmer shoulder work, tibialis and soleus raises ...) are **allowed as optional add-ons**: they can be chosen and added, and they appear as swaps and in an "Optional add-ons" list on the plan. **No template picks them.** The only exceptions: **wall balls and sled pushes may be primary in the HYROX program** (and in the CrossFit-style class WOD, a PROPOSED reading of "maybe in the CrossFit program", with one switch to turn it off). **Neck work stays proposed** until he decides: never a pick, a swap or an offered add-on. | **COACH-R4 R4-LIB-01 (RIGHT + words)** |
| C8 | **Carries and sled work are written by distance or time, not reps**: 2-4 trips of 20-40 meters (or 20-40 seconds), per side when one-sided. **They are not muscle sets.** They sit with core / conditioning. His own suitcase carry is an optional add-on like the farmer carry, with the same dosing. | **COACH-R4 R4-LIB-02 (RIGHT)** |
| C9 | **Mid-range pull** is its own small category between the horizontal and the vertical pull: high row, 45-degree row, face-pull angle (taxonomy node `RP.PL.M`, pattern `MRPULL`). His templates have no mid-range slot, so a row or a pulldown lists one mid-range pull as a swap when the kit holds one. The two row records added for it are optional add-ons (PROPOSED records); the face pulls keep their place as rear-delt work and carry the tag. | **COACH-R4 R4-LIB-03 (RIGHT)** |
| C10 | **Incline pressing is preferred over overhead pressing** in the vertical / mid-range push slot for bodybuilders and for the general population (goals: build muscle, general fitness, fat loss, and the non-competitive "stay athletic" adult, the last one PROPOSED). **Overhead pressing stays in the program** as a swap: "we should have that variability." Competitive athletes and strength plans keep their own press. | **COACH-R4 R4-LIB-03 (RIGHT + words)**; R4-SES-05 slot 3 |
| C11 | **A swap says what it keeps and what it loses**, in one short line ("DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch"). The same line is printed when the plan's pick stands in for an exercise the person's equipment does not hold. The wording table is PROPOSED. | **COACH-R4 R4-LIB-04 (RIGHT)** |
| C12 | **No third-party video links in the public data.** Every exercise carries a "search this exercise on YouTube" link built from its English name, and the plan shows the exact name with a one-tap copy ("Click here to copy it and put into YouTube"). His own videos can be added later (link kind `coach`). 336 link lists and 188 linked cells were emptied from `02_exercise_catalog.json`; nothing else in that file changed. | **COACH-R4 R4-LIB-05 (RIGHT + words)**; R2-GEN-02 |

**In numbers (compiled model 1.3.0; model 1.4.0 has 742: round 5 added 5 assisted jumps, 3 two-foot lateral jumps and the WOD run station).** 733 exercises: 731 from the library source plus the 2 mid-range pull records. 32 records carry the status "optional add-on": the 29 former proposals other than neck work, the 2 mid-range pull records, and his own suitcase carry (filed with the other carries). 2 neck records stay proposed and hidden. The floor prone Y / T raise is not an add-on: he added it to the library in round 2 (R2-LIB-07).

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
| 9 starter carries and drags | LIB-19 | **optional add-ons** (v1.3, COACH-R4 R4-LIB-01); dosed by distance or time (R4-LIB-02) |
| **22 additions for the new sports** (v1.3: **optional add-ons**, COACH-R4 R4-LIB-01 - chosen and added by the person, never a template pick; wall balls and sled pushes may be primary in HYROX; neck work stays proposed; no bands): side-lying DB and cable external rotation, scapular push-up, dead hang, DB wrist extension, streamline hold, streamline squat jump, sled rope pull, wall ball (≤ 20 lb), sandbag walking lunge, SkiErg / rower distance pieces, compromised run, burpee broad jump, ruck walk, split-step reaction drill, single-leg balance reach, tibialis raise, seated / bent-knee calf raise, neck isometric holds, plate neck flexion / extension, wall sit | COACH-CHAT 2026-10-08 (swimming, pickleball, HYROX, collision sports) | PROPOSED (02 v1.1 §2.8) |

### 4.5 Catalog in numbers (02 v1.1)

**939 records; 732 active exercise-like records** (707 v1 − 1 retired + 26 new); crosswalk references 3,824, 0 unresolved; 0 duplicate active names; 0 band set-ups; 0 athletic records counting toward muscle volume; 0 medballs over 20 lb. Contact classes on every jump and throw: 68 ballistic, 70 plyometric, 12 receive; Receive-Create stage on all 96 PLYO / ANKLE jumps; `olympic_v1_1` on 39 Olympic-type lifts (16 clean family, 18 snatch family, 4 jerks, 1 loaded jump); `older_default_excluded` (60+) on 140 records; `spine_day_v1_1` on 158 records (25 counted heavy spine lifts); `variation_v1_1.axes` on 553 records; `sport_use_v1_1` tags on 38 existing records (swimming 18, pickleball 19, HYROX 16 tagged records in all); 615 records carry a `v1_1_changes` log (1,420 entries).

### 4.6 Pending (library)

- **Wall balls**: settled. In HYROX they may be a primary pick with the race ball, never over 20 lb, inside the station circuits (R3-ATH-03; R4-LIB-01); in the CrossFit-style class WOD they may be picked too (PROPOSED reading of "maybe", one switch); everywhere else they are an optional add-on. They never count as muscle sets.
- **KB swings' home**: the triple-extension / ballistic pool plus a 0-set swap in the hip-dominant slot (INFERRED); or conditioning / warm-up?
- **HYROX stations**: 2 short station circuits a week, finishers that never count as muscle sets, with 40-rep / AMRAP sets only there (R3-ATH-03). **v1.3 (R4-LIB-01):** the circuit's picks are wall balls, sled pushes and his own SkiErg / row / burpee stations; sled pull, burpee broad jumps, farmer carry and sandbag lunges are swaps the person can choose. Carries and sleds are dosed by distance or time (R4-LIB-02). Still open: whether burpee broad jumps fall under the 60+ jump switch (INFERRED yes).
- **Neck work** stays proposed until he decides (R4-LIB-01): never shown. **Grip work** (carries, dead hangs) is an optional add-on with no muscle credit.
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

Full version: `12_volume_algorithm_v1.md` (v1.3 section first, then the v1.2 content: research, the approved stairway pattern, the shoulders line and the focus groups, Focus muscles, plan editing, pseudo-code) / `12_volume_algorithm_v1.json` (v1.2, not re-issued), with the coach-side record in `03_volume_dosing.md` v1.3. The coach asked for this ("go find some charts ... match them with my experience", VOL-01; "I need this tool ... to figure out the percentages", VOL-06; "you can do some research and figure it out", R2-VOL-06), so every number he did not give is PROPOSED. Round 3 approved the stairway pattern in numbers and removed every feedback path: the whole plan is computed once, from a few answers, and shown ahead of time (COACH-R3 R3-VOL-02, R3-VOL-04). **v1.3** removed time-fitting (CT-01), made the planned final sets the thing every group reaches (CX-01, R4-PRG-01) and split the weekly sets over the slots of his own templates (R4-SES-05). The working arithmetic is `engine/progression/stairway.mjs` and `engine/volume.mjs` (engine 0.5.0).

### 5.1 Confirmed rules (one page)

| # | Rule | ID |
|---|---|---|
| V1 | Unit = **weekly hard sets per line, read on the coach's FOCUS groups** (§5.3). A hard set = a working set at 1-3 RIR, 5-30 reps; warm-up sets and A-drills never count; the light core-opener sets count toward abs. | VOL-04, VOL-13, ORD-08; R2-SES-03; **R3-SES-01** |
| V2 | **Main mover 1.0, helpers 0.25.** Squats, lunges, deadlifts and RDLs give glutes 0.25; hip thrusts and bridges 1.0. Dips 0.5 triceps + 0.5 chest. **Thruster 1.0 quads + 0.5 shoulders + 0.25 glutes.** Leg extension and leg curl count fully. **A set counts at most 1.0 to a group** (a face pull is one shoulder set, not 1.25; group credit PROPOSED). | VOL-09, LIB-16, LIB-14; **R2-VOL-05**; R3-VOL-01 |
| V3 | **A 10/10 unilateral set = 1 set** to the primary muscle; alternating lifts count the same way. | UNI-01, UNI-07, PRG-07 |
| V4 | **Athletic work never counts** toward muscle sets (plyos, ballistics, throws, Olympic lifts, sprints, COD). **KB swings are ballistic: 0 muscle sets** ("kettlebell swings are not glutes"). **HYROX station circuits are finishers that never count as muscle sets.** | VOL-10; **R2-VOL-05**; **R3-ATH-03** |
| V5 | **Starting weekly sets**: big lines beginner **10-12**, intermediate **15-20**, advanced **20+** (engine 10 / 15 / 20); **shoulders (front + side + rear delts), biceps and triceps 10 / 12 / 15**; **calves one exercise × 3 sets every leg day**. 15-20 = maintenance to a little growth; 20-25 = growth; 5 too little, 40 too much. **Rear delts are not an individual muscle**: v1.1's own 4 / 6 / 8 sets are retired as a number; every plan keeps a rear-delt exercise each week, rows give rear delts 0.25 a set ("the rear delts also get worked when you do back"), and people and coaches can always add more. | VOL-01, UNI-01; **R2-VOL-04**; **R3-VOL-01 (PARTLY)**, **R3-SES-01** |
| V5b | **Floor of 10, counted on groups**: "I don't think anybody needs less than 10 sets a week per muscle." Every directly trained group - quads, hips (glutes + hamstrings), chest, back, shoulders, biceps, triceps, calves - holds 10 or more in a training block **when there are 3 or more training days** (with 2 days every big group is trained at about 6-8 instead, V25) ("If you put together all the sets of shoulders, it'll equate to more than 10 sets"). Exemptions in §5.3. | **R2-VOL-06**; **R3-VOL-01, R3-SES-01**; **R4-SES-03** |
| V5c | **"Most people train around 20 to 30 sets per muscle per week"**: researched in 12 §2.11 (§5.8 here); no number changes. | **R2-VOL-06** |
| V6 | **Ceilings per 12-week plan: 14 / 22 / 25 by level for every line**; "this is all customizable"; the priority caps **18 / 26-28 / 30** bound the Focus and priority lines; above 30 only for a very advanced person through an optional **Pro setting** (a coach setting at build time: one muscle, up to 35, PROPOSED). | VOL-02, ORD-04; **R2-VOL-06** |
| V6b | **Focus muscle 1 and Focus muscle 2** (intake, optional, never more than 2; any of quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves): **+1 to +3 extra weekly sets each** over the balanced plan ("an extra set or two or three"; default +2, PROPOSED), added to the start **and** to the ceiling so the stairway carries them all block; the Focus exercise goes first in its session; **the other groups are not slowed**. No sex field: "if it's a female and she chooses glutes" is his example of a choice, never a default. The VOL-02 priority push (+4 / +4 / +6, the others ≤ 3 % a week) stays only as an optional coach setting. | **R3-SES-01 (RIGHT + words)**; VOL-02, ORD-04; R2-VOL-06; GEN-02, ATH-09 |
| V7 | **Pain declared at intake**: that group or pattern -30 to -50 %, constrained machines or split grips, painful positions out; a bilateral lift swapped to unilateral keeps its sets "ideally, but adjust accordingly". **During the plan** the printed guide tells the person to swap, then cut the sets, then drop the exercise; nothing is logged. | VOL-03, UNI-08, EQ-03; **R3-VOL-02, R3-VOL-04** |
| V8 | **The stairway (pattern APPROVED in round 3; the endpoint rule is v1.3)**: every plan climbs in weekly steps, a % of each group's weekly sets, one rule for every person (never by muscle size). The default pattern is about **3 % a week until the halfway week** ("a little bit smaller") and about **5 % after it** ("a little bit higher, but not too much"). Each trained group's steps are scaled (λ) so it **reaches its planned final sets**: in the last week when the math allows, one week early at most, never earlier. **Steps may be faster than the pattern when that is what it takes; there is no hard limit.** A week that adds more than about 15 % carries a note. A week may keep the same sets while reps or load progress. The hardest weeks come last ("the last 4 weeks are going to be brutal" on 12 weeks). **Retired as limits: "never more than 7 % a week" and "total below +10 % a week".** | VOL-04, VOL-05; R2-PER-03, R2-PER-04; R3-VOL-04; **CX-01, CX-02, CX-03; R4-PRG-01, R4-PRG-02** |
| V9 | **The tool computes the percentages and turns them into whole sets**; the client never sees the percentages. v1.3: the rounding is half up, and the count is held one set under the top number until the arrival week, so the top is reached in the last week (one week early at most). | VOL-06; **R4-PRG-01** |
| V10 | **New sets go to the first exercise of the day for that group, then the next**: 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3; **when a day type runs twice a week, the added set alternates (Monday's first back exercise this time, Thursday's the next)**. The sets are split over **the slots of his template that train the group** (§5.5). On split days (push, pull, legs) every group gets **2-4 exercises**, never 1; on his A / B days the template gives each group its exercises (back 2, quads 3, hips 3, chest and shoulders 1-2, biceps or triceps 1). | VOL-07; R2-SES-05; **R3-VOL-03, R3-SES-01**; **R4-SES-05** |
| V11 | **Small-muscle extras become a short bonus exercise** on the optional day, or, with no optional day, on a day that already trains that muscle - never as that day's only exercise for it. **Calves never get a second calf exercise on a leg day.** v1.3: when the template's slots cannot hold a group's weekly sets and there is no optional day, the group is capped at what its slots hold **and the plan says so** (nothing is dropped, R4-SES-04). | VOL-07; **R3-VOL-03 (RIGHT), R3-SES-01** |
| V12 | **Focus 1 / Focus 2 slots** on the optional day may hit the same muscle, 2-3 sets each; optional days are add-ons or separate (ideally separate); they also carry the Focus-muscle extras. | ORD-10, ORD-11; R3-SES-01 |
| V13 | **Calves one exercise × 3 sets every leg day** (at least 10 a week, PROPOSED: a 4th set or the optional-day 'Calves' slot with fewer than 4 leg days); **a rear-delt exercise every week inside the shoulders group**; **2 core exercises × 2 sets first**, short of failure. | VOL-17; R2-VOL-06; R2-SES-03; **R3-SES-01, R3-VOL-01** |
| V14 | **Default sets when blank**: 3 on compounds, 2 on isolation; **2 per slot in athletic templates**. | VOL-16 |
| V15 | **Session size by exercise count**, not counting the warm-up or the 2 core exercises: general fitness / fat loss **5-7**, aesthetics / bodybuilding **6-8**, strength **5-6**, bootcamp **5-7 stations**, field athletes off-season **up to 12** (jumps / throws + Olympic + lifts; cross pattern by default: 2 jump / throw stations + 1 Olympic lift; the same-pattern athletic template, 3-4 jump stations + 1 Olympic lift, for size-focused and high-level athletes), older adults 60+ **5-6**. "This is just our recommendation. These are templates that we're giving them for them to add or take away." **Session minutes are not an input and not a limit**; unilateral work still takes longer and the printed time estimate accounts for it. *(Retired: 45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 and the session lengths as limits.)* | **R4-SES-02; CT-01, R4-SES-01**; VOL-08, VOL-16, VOL-17, UNI-09; R2-SES-04; R3-SES-01 |
| V16 | **Unilateral volume progresses like bilateral.** | UNI-05 |
| V17 | **Unbalanced templates are not intended**: balance to the targets; a V-taper bias when the athlete wants it (Focus = shoulders + back). | VOL-18; R3-SES-01 |
| V18 | **Answers in, the whole plan out.** The stairway is computed once and every week is shown ahead of time; **no check-in, no tracking, no adaptive input** changes it; people and coaches adjust the plan themselves; a printed "How to adjust this plan" guide replaces v1.1's check-in table (§5.4c). | **R3-VOL-02, R3-VOL-04**; R2-VOL-03; GEN-03 |
| V19 | **Nothing is stored and nothing is learned from users** ("I don't want any data kept"); the defaults change only when the coach changes them. | **R3-GEN-01** (supersedes VOL-01, VOL-02 "learns from the data") |
| V20 | **Effort 10 = "the max I could do, but successful"** (0 RIR), not a fail: now the helper line of the EFFORT column in the downloaded sheet, never an engine input. | **R2-VOL-02**; R3-VOL-02 |
| V21 | **Smooth weekly increases** for hypertrophy and general clients; **2-week steps and waves** for fight or competition prep. | PER-10 |
| V22 | **Next block after a completed block**: each group starts **about 5 % above the last block's start, rounded to whole sets** (at least one set more while it is below the top, PROPOSED), **never above the level's top number**. A group already at the top keeps its sets, and progress comes from load and reps. A stopped block keeps the same start. Nothing is stored, so the person says how many blocks they completed in a row when they build the next one (PROPOSED input; 0 by default). *(Retired: "cap + 1" per completed block.)* | **R4-PRG-04 (RIGHT: "it has to be logical")**; CX-03; R2-VOL-06; R3-GEN-01 |
| V23 | **No time-fitting.** The plan is never cut, reshaped or flagged because of time. Each day prints an average time estimate as information; how long the session takes is up to the person. *(Retired: v1.2's "time vs minimums" order, §5.6.1. Supersets stay a recommendation; blocks can still be switched off; exercises can still be added or removed.)* | **CT-01; R4-SES-01** (supersede the time parts of R3-SES-02) |
| V24 | **Editing does not break the math**: switching off a day's athletic, Olympic, core or conditioning block changes no muscle-set number (that work never counts, VOL-10); removing or adding exercises, or changing the sets of a day or a week, changes the sets the plan shows; the weekly totals are recomputed and the plan is marked edited (§10.10). | **R3-SES-02**; VOL-10; **CX-02, CX-04** |
| V25 | **Two training days a week**: every big group is still trained, at **about 6-8 weekly sets** instead of 10 (start 6, top 8; PROPOSED exact numbers). The plan says so and suggests a third day. **Never drop whole muscle groups, never pile on more exercises.** The two days are **two full-body days** built from his slots (COACH-R5 R5-GEN-01; was: one A day and one B day). | **R4-SES-03 (RIGHT + words); R5-GEN-01** |
| V26 | **Nothing is dropped automatically.** The template comes out complete. What a template cannot hold is said in plain words (a group capped by its slots, a group under its floor, a group with no exercise of its own). The person decides what to remove; the plan names the easiest things to remove. | **R4-SES-04 (PARTLY)**; CX-04 |
| V27 | **Reps and load progress by a rule the person applies** ("3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8"), never a promised number per week. | **R4-PRG-03 (RIGHT)** |

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
| Face pull (cable or KB) | rear delts | - | side delts | **R2-LIB-04, LIB-10** ("shoulder work"); split PROPOSED; **1.0 to the shoulders group** (group credit, R3-VOL-01) |
| Isolation (fly, side raise / upright row, rear-delt fly, curl, triceps, calf raise) | target muscle | - | forearms on curls | VOL-09, LIB-16 |
| Core | abs/obliques | - | - | CAT-08 |
| Plyo, ballistic (**KB swing included**), throw, Olympic, sprint, COD, **HYROX station circuits** | **none** (own budget, §9) | | | VOL-10; **R2-VOL-05**; **R3-ATH-03** |

**Group credit (PROPOSED; needed by R3-VOL-01 and R3-SES-01).** A group counts a set at most once: group credit = the smaller of 1 and the sum of its member muscles' credits. Shoulders: a side raise, a rear-delt fly, a face pull (rear 1.0 + side 0.25 → 1.0), a vertical press (front 1.0 + side 0.25 → 1.0) and an upright row are one shoulder set each; a thruster 0.5; a horizontal press (front delts 0.25) and a row (rear delts 0.25) 0.25 each. Hips: a hinge, a hip thrust and a leg curl are one hip set each; a squat or lunge 0.25 (glutes). The plan still reports side, rear and front delts and glutes / hamstrings apart for display.

Other conventions: MYO set = 2 hard sets, only on the last machine or isolation exercise (INFERRED; VOL-15). The engine **steers on the coach count** and may show the **Pelland count** (indirect sets 0.5) next to it as a display; nothing is stored (PROPOSED; R3-GEN-01). Reps are stored as text, never numbers or dates (OBSERVED). **What the glute rule does**: with every compound at 0.25, a physique plan reaches its glute start only with direct glute work (hip-thrust family or Focus slots); 03 recomputed all 61 observed program views (only glutes change: hypertrophy-family median 9 → 6).

**v1.3 additions to the credit map.** Carries and sled work credit no muscle (R4-LIB-02). A mid-range pull credits like a row (PROPOSED). In the B day's "Chest / Shoulders" slot a 30-45 degree incline press counts 1.0 for chest; a high-incline press counts 1.0 front delts + 0.5 chest + 0.25 triceps; an overhead press stays a shoulder exercise (PROPOSED numbers, open for the coach, §0d.3 #5). **v1.4 (COACH-R5 R5-VOL-01): a high-incline press counts 1.0 chest + 0.25 front delts + 0.25 triceps** ("Its mostly upper chest for me").

### 5.3 Starting table (aesthetics / hypertrophy; coach count; `12 > starting_table`)

The lines are his FOCUS headers ('QUADS', 'HAMSTRINGS', 'GLUTES', 'CHEST', 'BACK', 'SHOULDERS/TRAPS', 'BICEP', 'TRICEP', 'CALVES', 'CORE'; OBSERVED); the floor of 10 is read on the R3-SES-01 groups.

| Line | Group (floor of 10) | Class (CAT-02) | Fill policy | L1 start | L2 start | L3 start | Cap L1 / L2 / L3 | Focus muscle (+F, default +2) | Tag |
|---|---|---|---|---|---|---|---|---|---|
| Quads | quads | big | target | **10** | **15** | **20** | **14 / 22 / 25** | start + F and cap + F (≤ 18 / 26 / 30) | starts VOL-01; caps **R2-VOL-06 (APPROVED, customizable)**; Focus **R3-SES-01** (default PROPOSED); L3 start (low end of "20+") PROPOSED |
| Hamstrings (hinge + leg flexion) | hips | big | target | **10** | **15** | **20** | **14 / 22 / 25** | same | as above; hips = glutes + hamstrings **R3-SES-01** |
| Glutes | hips | big | target (field athletes: credit) | **10** | **15** | **20** | **14 / 22 / 25** | same | as above |
| Chest | chest | big | target | **10** | **15** | **20** | **14 / 22 / 25** | same (≤ 18 / 28 / 30) | as above |
| Lats / upper back | back | big | target | **10** | **15** | **20** | **14 / 22 / 25** | same | as above |
| **Shoulders** (front + side + rear delts; traps for display) | shoulders | small | target (field athletes: at the floor through the shoulder-care station and presses) | **10** | **12** | **15** | **14 / 22 / 25** | same | L2-L3 starts **R2-VOL-04 (APPROVED)** read on the shoulders group (**R3-VOL-01**: "I just figured the shoulders were what we were talking about"); L1 10 by the floor (**R2-VOL-06**); same caps INFERRED from "the little muscles also grow the same idea" |
| Biceps, triceps | own | small | target (field athletes: credit) | **10** | **12** | **15** | **14 / 22 / 25** | same | **R2-VOL-04**; L1 floor **R2-VOL-06** |
| Calves | calves | small | target | **one exercise × 3 sets every leg day** (at least 10 a week) | same | 3-4 per leg day | 14 / 22 / 25 | +F sets on the existing calf exercise, then the optional-day slot | VOL-17; **R3-SES-01**; floor R2-VOL-06; the 10-a-week top-up PROPOSED |
| Abs / obliques | core | small | core block | **2 exercises × 2 sets per session, first, short of failure** | same | same | 16 / 20 / 20 | - | VOL-17, ATH-11; **R2-SES-03** |
| Traps, forearms, adductors, neck | - | unplaced | floor: credit only, reported, never filled | - | - | - | - | direct slot only if chosen | CAT-02 gap; PROPOSED |

**Retired lines (R3-VOL-01).** Rear delts as a line of their own (v1.1: 4 / 6 / 8 own sets, caps 8 / 12 / 16, priority caps 12 / 16 / 20) and side delts as a separate line (v1.1: 10 / 12 / 15) are merged into the shoulders line. The content rule stays: at least one rear-delt exercise (reverse fly or KB face pull, 2+ sets) every week, and the plan editor offers **"add rear delts"** (a 2-set rear-delt exercise on a pull day). Example 12 §5.2: shoulders 13.25 → 20.25 sets over the block for an L2 bodybuilder, of which about 6-8 rear-delt credit.

**The floor of 10 on groups (COACH-R2 R2-VOL-06; COACH-R3 R3-VOL-01, R3-SES-01).** Every directly trained **group** holds 10 or more sets a week in any training block **with 3 or more training days**, after the goal and phase factors, counted with group credit. **With 2 training days** every big group is trained at about 6-8 weekly sets instead, the plan says so and suggests a third day (COACH-R4 R4-SES-03; §5.6.2). **Not floored**: maintenance phases, pre-season and in-season blocks (maintenance by his own definition, PER-01, R2-PER-06), a pain-reduced group (VOL-03 wins), credit-only lines of field athletes (UNI-02) and floor muscles. His PARTLY verdict on R3-VOL-01 spoke only about rear delts, so the rest of that proposal (floor for training blocks only; field athletes' trained chest and back up to 10) stands (INFERRED). Calves: his minimum is 3 sets per leg day; with fewer than 4 leg days they reach 10 through a 4th set and the optional-day 'Calves' slot (PROPOSED), never through a second calf exercise on a leg day. Abs reach 10+ through the core opener at 3+ sessions a week.

**Week 1 and the template.** A group's week-1 sets are its start for the level, split over the slots of the template that train it (§5.5). Where the slots at their fewest sets already hold more than the start, the group begins there and climbs to its planned final sets; where the slots at their most sets cannot hold the planned number, the group gets the bonus exercise or is capped, and the plan says so (§5.6.3). *(v1.2's "so no line runs flat" reason is retired with R3-SES-02 step 4: a week may keep the same sets, CX-02.)*

**Goal, phase and population modifiers** (multiply the starts, round half up, then the floor of 10 on groups; `12 > goal_phase_modifiers`; factors PROPOSED unless tagged):

| Situation | Lower | Upper | Small | Notes | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding | 1.0 | 1.0 | 1.0 | same-pattern pairing allowed; 4 aerobic sessions, adjustable | VOL-01, UNI-06; R2-SES-06 |
| Strength / powerlifting | 1.0 | 1.0 | 0.75, then floor 10 | preference moves reps on big lifts; 2 easy (Orange) aerobic | VOL-12; R2-ATH-06 |
| General fitness, weekend-warrior athletic, **"stay athletic and active"** (rec pickleball, padel, tennis, HYROX for fitness, rec leagues ...) | 0.8 | 0.8 | 0.8, then floor 10 | cross-pattern; athletic work from the activity's 04 profile; **play days**: the hardest gym day ≥ 48 h before the biggest play day, weeks with 3+ play sessions drop the extra agility drills and half the jumps; **a 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2)**; **optional event date**: the hardest weeks end 1 week before, then 1 easy week at about half the sets | UNI-09, UNI-06, ATH-13; COACH-CHAT 2026-10-08; **R3-ATH-05 (APPROVED)** |
| **Pickleball, padel and tennis players 50+** | as the row above (or their competitive profile) | | | knee-friendly strength; **calf and Achilles work every leg day**; rotator-cuff work (warm-up / shoulder-care station, never bands); **only low-impact jumps** (no depth jumps, hurdle hops or bounds) unless switched on with the warning | **R3-ATH-02 (APPROVED)** |
| **HYROX** | 0.8 | 0.8 | 0.8, then floor 10 | 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions (Blue, Green, Orange + a second Orange); 2 short station circuits a week as finishers (never muscle sets); wall balls with the race ball (never over 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric | **R3-ATH-03 (APPROVED)**; factor PROPOSED |
| Fat loss | 0.8 | 0.8 | 0.8, then floor 10 | + 3 aerobic sessions, adjustable; standalone fat-loss blocks use the normal stairway (the v1 "≤ 3 % in a deficit" is retired); in the year's Q1 cut the sets stay at the starting level | ATH-07; R2-SES-06, R2-PER-01 |
| Bootcamp | timed circuits, not set-based | | | 5-7 stations (R4-SES-02), as two circuits of 4-6 stations where every muscle group gets 2 stations (calves: one station); 3-5 rounds by level × 35-50 s; a class usually runs 35-45 min (his description, not a limit) | PRG-03; R2-SES-05; R3-SES-01; R4-SES-02 |
| Field/court athlete off-season | 0.7 | 0.5, **then floor 10** | biceps, triceps, glutes credit only; **shoulders at the floor** (shoulder-care station + presses, group credit) | resistance is the A / B lifts (without arm isolation) after core, plyo and Olympic work (up to 12 + 2 core; R4-SES-02, R4-SES-05); the floor lifts trained chest and back from 7.5 to 10 at L2 (flagged) | VOL-08, VOL-17, UNI-02; R2-VOL-06; **R3-SES-01, R3-VOL-01** |
| **Competitive swimmers (dryland)** | 0.7 | 0.5, then floor 10 | as field athletes; **shoulder care every session** (external rotation, floor Y / T raises, KB face pulls; never bands) | 3 dryland days + 1 optional (2 for younger or lower-level swimmers); **0 extra cardio** (the pool is the aerobic work; the user can add one); jumps mostly ballistic, 25 % plyometric at block end; Olympic lifts 2-3 days; a 2-week dryland taper lined up with the swim taper before the main meet (1 week or none before smaller meets) | **R3-ATH-01 (APPROVED)**; factors PROPOSED |
| Strength-type athlete off-season (linemen, wrestlers, rugby forwards, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6, then floor 10 | "more resistance" group; the same-pattern athletic template when the goal is size | ATH-03; R3-SES-01 |
| Athlete pre-season | about **0.6 of off-season sets**, flat | | credit | 4-6 weeks, more speed and power, 1-2-week taper; not floored | **R2-PER-06 (APPROVED)** |
| Athlete in-season | 0.4-0.5 | 0.3-0.4 | credit | 2 days/week, flat; **game-heavy sports** (basketball, volleyball, soccer, football, hockey; **+ lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball**): gym plyos ~half, no extra COD, sprints only for speed athletes, hard day ≥ 48 h before a game | PER-08, UNI-10; **R2-ATH-07**; **R3-ATH-04** |
| Boxer / striker, high-punching weeks | as profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | **reduce, never cut** | ATH-04 |
| Older adult (60+) | as goal | as goal | as goal | **the same stairway as everyone** (v1.1's PROPOSED ≤ 3 % step cap is retired: every trained group reaches its planned final sets); **5-6 exercises a session** (R4-SES-02); extra volume on constraint 4-5 machines; **on by default**: landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work; **off by default, switchable with his warning**: low ankle hops, other jumps, Olympic lifts, depth jumps; overhead and low-bar squats out; maintenance ≥ 70 % | EQ-03, EQ-04; R2-ATH-08; **R3-ATH-02 (APPROVED)**, R3-VOL-04; SCIENCE Borde 2015, Fragala 2019, Bickel 2011 |
| Youth | as goal | as goal | as goal | Olympic lifts from the floor from about 14, after one block of hang work | **R2-ATH-08** |
| Sex | - | - | - | **no sex-based rules**; a Focus muscle is the person's choice, never inferred from sex | ATH-09, GEN-02; R3-SES-01 |

### 5.4 The stairway: planned weekly steps, computed once (pattern APPROVED; v1.3: the planned final sets are reached)

**His rule** (R2-PER-03, R2-PER-04, R2-PER-05; VOL-04, VOL-05): every plan climbs "like steps up a stairway"; the step is a % of each line's weekly sets, one rule for every person. **Round 3 approved the numbers**: "Sets grow about 3 % a week until the halfway week and about 5 % after it ... each muscle's steps are sized so it reaches its ceiling exactly in the last week" - "Yeah, but remember that we can just kick out the program designed already without the input of somebody saying how they feel ... The program will just have its natural algorithm recommendation of growth throughout it" (COACH-R3 R3-VOL-04, RIGHT).

**What v1.3 changed** (COACH-CX CX-01, CX-02, CX-03; COACH-R4 R4-PRG-01, R4-PRG-02). Asked whether a plan should finish with fewer sets when the usual steps cannot reach the final number, he said: "no, go ahead and increase faster if thats the need, they could edit accordingly." So the **planned final sets win over the step size**. The 3 % / 5 % pattern stays as the shape every plan starts from. Round 4 then approved three details: reach the top number in the last week when the math allows (one week early is fine, never earlier); no hard limit, with a clear note when a week adds more than about 15 %; and a week may keep the same sets when reps or load progress.

**(a) The planned stairway (the math; pattern APPROVED R3-VOL-04; endpoint COACH-CX CX-01, COACH-R4 R4-PRG-01; kernel `engine/progression/stairway.mjs`)**

```
halfway week          h = ceil(N / 2)                                   (N = weeks in the training block)
default pattern       s_w = 3 %  if 2 <= w <= h      ("a little bit smaller")
                      s_w = 5 %  if h <  w <= N      ("a little bit higher, but not too much")
start                 S = the group's start for the level (+ Focus F); on a 2-day plan 6 for a big group        (§5.3, §5.6.2)
planned final sets    P = the group's top for the level (+ Focus F), whole sets; on a 2-day plan 8             (R4-SES-03)
scale factor          lambda solves  S x product over w = 2..N of (1 + lambda x s_w) = P
                      lambda < 1: smaller steps than the pattern (the range is narrow or the plan is long)
                      lambda > 1: FASTER steps than the pattern - allowed, with no cap on lambda                (CX-01)
curve                 T(1) = S;  T(w) = T(w-1) x (1 + lambda x s_w);  T(N) = P
whole sets            round T(w) half up, but hold the count at least one set under P until the arrival week;
                      the arrival week is the last week (one week early at most); never fewer sets than the week before   (R4-PRG-01)
note                  a week that adds more than about 15 % carries a note; one whole set alone is never noted  (R4-PRG-02; detail PROPOSED)
the template          a week's number is also capped at what the group's slots hold that week (2-5 sets an exercise, 2-4 at L1);
                      what the slots cannot hold goes to the bonus exercise, or the group is capped and the plan says so   (§5.5, §5.6.3)
flat blocks           P = S (the year's cut quarter, a maintenance plan, a group already at its top):
                      the sets stay and reps and load carry the progress                                         (CX-02, CX-03)
```

**Retired from this block in v1.3:** `P = min(C, S x G(N))` with λ never above 1; "planned step ≤ 7 %; total weekly resistance sets strictly below +10 %"; "other lines ≤ 3 % while a priority push runs"; the "time / exercise limits" clause with its minimum climb.

| Plan length N | Halfway week | Step into weeks 2..h | Step after h | Growth G(N) at standard steps | Stair level by week (2 → 11, display) |
|---|---|---|---|---|---|
| 4 | 2 | 3 % | 5 % | × 1.136 | 2 · 4.1 · 7.5 · 11 |
| 6 | 3 | 3 % | 5 % | × 1.228 | 2 · 3.3 · 4.6 · 6.7 · 8.9 · 11 |
| 8 | 4 | 3 % | 5 % | × 1.328 | 2 · 2.9 · 3.9 · 4.8 · 6.3 · 7.9 · 9.4 · 11 |
| 10 | 5 | 3 % | 5 % | × 1.437 | 2 · 2.7 · 3.5 · 4.2 · 4.9 · 6.1 · 7.4 · 8.6 · 9.8 · 11 |
| 12 | 6 | 3 % | 5 % | × 1.554 | 2 · 2.6 · 3.2 · 3.8 · 4.4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 |
| 16 | 8 | 3 % | 5 % | × 1.817 | 2 · 2.4 · 2.9 · 3.3 · 3.8 · 4.2 · 4.7 · 5.1 · 5.8 · 6.6 · 7.3 · 8 · 8.8 · 9.5 · 10.3 · 11 |

**Planned weekly sets (whole sets; one group on its own, computed with the engine kernel for this file; Focus lines carry the default +2):**

| Plan | Group (start → planned final sets) | λ | Weeks 1 → N | Biggest week | Noted weeks |
|---|---|---|---|---|---|
| 12 wk | L1 big / shoulders / arms 10 → 14 | 0.76 | 10 · 10 · 10 · 11 · 11 · 11 · 12 · 12 · 13 · 13 · 13 · 14 | +1 set | none |
| 12 wk | L2 big 15 → 22 | 0.87 | 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 19 · 20 · 21 · 22 | +1 set | none |
| 12 wk | L3 big 20 → 25 | 0.50 | 20 · 20 · 21 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 24 · 25 | +1 set | none |
| 12 wk | L2 shoulders / arms 12 → 22 | 1.39 | 12 · 12 · 13 · 14 · 14 · 15 · 16 · 17 · 18 · 19 · 21 · 22 | +2 sets (10.5 %) | none |
| 12 wk | L3 shoulders / arms 15 → 25 | 1.16 | 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 · 24 · 25 | +2 sets (9.1 %) | none |
| 12 wk | L1 Focus muscle (+2) 12 → 16 | 0.65 | 12 · 12 · 12 · 13 · 13 · 13 · 14 · 14 · 15 · 15 · 15 · 16 | +1 set | none |
| 12 wk | L2 Focus muscle (+2) 17 → 24 | 0.78 | 17 · 17 · 18 · 18 · 19 · 19 · 20 · 21 · 21 · 22 · 23 · 24 | +1 set | none |
| 12 wk | L3 Focus muscle (+2) 22 → 27 | 0.46 | 22 · 22 · 23 · 23 · 23 · 24 · 24 · 25 · 25 · 26 · 26 · 27 | +1 set | none |
| 12 wk | 2-day plan, big group 6 → 8 | 0.65 | 6 · 6 · 6 · 6 · 6 · 7 · 7 · 7 · 7 · 7 · 7 · 8 | +1 set | none |
| 8 wk | L1 big / shoulders / arms 10 → 14 | 1.19 | 10 · 10 · 11 · 11 · 12 · 12 · 13 · 14 | +1 set | none |
| 8 wk | L2 big 15 → 22 | 1.36 | 15 · 16 · 16 · 17 · 18 · 19 · 21 · 22 | +2 sets (10.5 %) | none |
| 8 wk | L3 big 20 → 25 | 0.78 | 20 · 20 · 21 · 21 · 22 · 23 · 24 · 25 | +1 set | none |
| 8 wk | L2 shoulders / arms 12 → 22 | 2.19 | 12 · 13 · 14 · 15 · 16 · 18 · 20 · 22 | +2 sets (12.5 %) | none |
| 8 wk | L3 shoulders / arms 15 → 25 | 1.83 | 15 · 16 · 17 · 18 · 19 · 21 · 23 · 25 | +2 sets (10.5 %) | none |
| 8 wk | L1 Focus muscle (+2) 12 → 16 | 1.01 | 12 · 12 · 13 · 13 · 14 · 14 · 15 · 16 | +1 set | none |
| 8 wk | L2 Focus muscle (+2) 17 → 24 | 1.22 | 17 · 18 · 18 · 19 · 20 · 21 · 23 · 24 | +2 sets (9.5 %) | none |
| 8 wk | L3 Focus muscle (+2) 22 → 27 | 0.72 | 22 · 22 · 23 · 23 · 24 · 25 · 26 · 27 | +1 set | none |
| 6 wk | L2 big 15 → 22 | 1.90 | 15 · 16 · 17 · 18 · 20 · 22 | +2 sets (11.1 %) | none |
| 6 wk | L2 shoulders / arms 12 → 22 | 3.08 | 12 · 13 · 14 · 17 · 19 · 22 | +3 sets (21.4 %) | weeks 4 and 6 |
| 4 wk | L2 big 15 → 22 | 3.15 | 15 · 16 · 19 · 22 | +3 sets (18.8 %) | weeks 3 and 4 |
| 4 wk | L2 shoulders / arms 12 → 22 | 5.19 | 12 · 14 · 17 · 22 | +5 sets (29.4 %) | weeks 2, 3 and 4 |

A 12-week L2 big group goes 15 → 22 with its last four weeks at 19, 20, 21, 22: **his approved example** (R3-VOL-04) still holds. **What changed against v1.2:** the 12-week L2 / L3 shoulders and arms now reach 22 and 25 (v1.2 stopped at 18 and 23), and every 8-week group reaches the same final sets as on 12 weeks, with faster steps. An 8-week plan still starts at the normal start (no "start hard"). **Short blocks with a big target** are where the note shows: a 4-week L2 block adds 3 to 5 sets in one week, and the plan prints "this week jumps more than usual: adjust if needed" on those weeks (R4-PRG-02). **In a plan** the groups take turns, so the week's total climbs a set or two most weeks and the last steps are shared between the last two weeks (PROPOSED staggering; R4-PRG-01 allows one week early). A week's number is also what the template's slots can hold (§5.6.3). **L1 note:** on 12 weeks an L1 group adds its first set in week 4, so the first weeks progress through reps, load and RIR, which is allowed (CX-02).

**(b) "Start at a 2, end at an 11" (R2-PER-05; drift APPROVED R3-VOL-04)**: how the week feels (overall volume and loading), not the set count. Each week shows a stair level `level(w) = 2 + 9 × A(w) / A(N)`, where A adds 1 per early step and 5/3 per late step (the printed number stays a PROPOSED display). The planned effort drifts **inside his 1-3 RIR band** - "effort goes from 3 reps in the tank early, to 2, to 1-2, to 1 + intensifiers in the last week, always inside your 1-3" (APPROVED):

| Week (12-week plan) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Stair level (display) | 2 | 2.6 | 3.2 | 3.8 | 4.4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| Planned effort (inside 1-3 RIR) | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 2 RIR | 2 RIR | 2 RIR | 1-2 RIR | 1-2 RIR | 1 RIR + intensifiers |

In the last week MYO on the last machine or isolation exercise (VOL-15) and supersets (ORD-05) are allowed: "a little bit past your limits". Lifters already at their ceilings get the 11 from heavier loads, intensifiers and a Focus muscle (or a coach priority push) up to 30 (APPROVED R2-PER-05). The v1.1 flag against VOL-13 ("no planned RIR ramp") is **closed** by R3-VOL-04.

**(c) The weekly check-in: RETIRED (COACH-R3 R3-VOL-02, R3-VOL-04).** "We're not going to have check-ins ... I want to take away all check-in info. We're only doing outputs, and people can change accordingly." Gone: the step table read from effort, completion and pain (R2-VOL-01 without its life column); "too easy" = planned step + 2 points; effort 9 = hold; any "10" = hold and -1 set; the optional 'Failed' answer; under half the sessions = repeat the week; the life-column resolution (R3-VOL-02 is moot). The plan follows its planned stairway from week 1 to the last week; nothing adapts and nothing is stored (R3-GEN-01).

**What replaces it: a printed "How to adjust this plan" guide** (his instruction block, GEN-07; wording PROPOSED, EN / ES; "the program will tell you to adjust accordingly", R3-VOL-04):
- Missed most of a week? Repeat that week before moving on.
- A set felt like a true max (no rep left)? Next time take one set off that exercise, or a little weight.
- Everything feels easy? Add weight or reps first; never jump ahead more than one week.
- Something hurts? Use the listed swap, then cut the sets, then drop the exercise (§5.7).
- Life got in the way for several weeks? Stop the block, take the recommended easy week, build a new block (§11.6).

**(d) No rate limit; a note instead (v1.3).** There is no maximum step and no maximum weekly rise (COACH-CX CX-01; COACH-R4 R4-PRG-02: "No hard limit, but the plan prints a clear note when any week adds more than about 15 %"). The note reads "This week jumps more than usual (17 % more sets for Shoulders): adjust if needed", is printed on that week and in "How you progress", and the week is marked in the stairway table. PROPOSED details: a group is noted when it adds 2 or more whole sets and more than 15 %; the week's total is noted above 15 %; one whole set alone is never noted. A coach may still set a slower pattern by hand at build time. A pain area keeps slow steps (about 3 %; VOL-03). **Retired in v1.3:** planned step ≤ 7 % (R2-VOL-01); total weekly resistance sets strictly below +10 % (UNI-05) with its one-set allowance and exemptions; "10 % is never offered as a step"; release staggering to stay under 10 %. **Retired in v1.2:** the 60+ ≤ 3 % cap (older adults are protected through exercise choice, R3-ATH-02, and constrained machines, EQ-03).

**(e) Retired by rounds 2 and 3** (v1.3 retirements are in (a), (d) and §0d.4)**.** Round 2: the readiness score R = 0.40 effort + 0.20 completion + 0.20 performance + 0.20 life and its bands; the planned rate before logs (5 % default; 3 % for high stress, under 6 h sleep, a physical job, 60+, layoff or pain) and the intake recovery question F42; "7 % only once logs earn it"; target-seeking; the 12-week acclimation cap (≤ 3 %) and the 8-week weeks-1-4 cap (≤ 5 %) with its × 1.10 start; the "hold 2 weeks in a row → deload next week" gate and every triggered mid-block deload. Round 3: the check-in step table and everything read from it; the block-at-risk prompt; the older-adult ≤ 3 % step cap.

**SCIENCE behind a person-based, gradual step**: RIR-based loading lets the weight move with the day inside a fixed plan, and autoregulated loading does at least as well as fixed percentages (Graham & Cleather 2021; Helms 2020; Hickmott 2022); people misjudge RIR by about one rep, so the cue is a range, not a promise (Halperin 2022); at 15-20 sets, 3 % ≈ +0.5 set/week and 5 % ≈ +0.8: about RP's "+1 set per week" at the top end; big jumps (+30-60 %, Barsuhn 2024; +4-6 sets every 2 weeks, Enes 2023/24) add strain without reliably adding growth; the "10 % rule" in other sports is weakly supported (Nielsen 2013; Gabbett 2016 vs Impellizzeri 2021): a sensible ceiling, not a target.

### 5.5 Allocation and placement (where the weekly sets go; v1.3)

The plan's own words (`design/ENGINE_V05_PLAN.md`, "How volume is allocated"): weekly sets per group come from the stairway; they are split over the template's slots; each exercise stays inside its set range; credits are recomputed from the actual exercises.

```
1 weekly sets     for each trained group and week: the stairway of §5.4 (start -> planned final sets)                # CX-01, R4-PRG-01
2 split           over the slots of the template that train the group as a main mover, in session order:
                  the next set goes to the exercise with the fewest sets, the earlier one on a tie
                     (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3)                                                    # VOL-07
                  a day type that runs twice a week alternates: Monday's first exercise, then Thursday's           # R3-VOL-03 (APPROVED)
                  main days before the optional day
3 per exercise    2-5 sets (2-4 at L1); isolation on a main day 3 (4 in the hardest weeks)                           # VOL-16; numbers PROPOSED
                  calves: one exercise x 3 sets on every leg day (2-3 on an optional day), never a second
                     calf exercise on a leg day                                                                     # VOL-17, R3-SES-01
4 no room         the coach's bonus exercise on the optional day (2-4 sets; at most 2 added a day, one a group)      # VOL-07, ORD-10, ORD-11; numbers PROPOSED
                  a Focus slot on the optional day for the person's Focus muscle (2-3 sets)                          # ORD-11, R3-SES-01
                  a small-muscle extra on a main day that already trains it (one a day, 2-3 sets),
                     never as that day's only exercise for it                                                       # R3-VOL-03; numbers PROPOSED
                  no optional day and no room: the group is CAPPED at what its slots hold, and the plan SAYS SO
                     (which group, how many sets of how many planned); nothing is dropped, nothing is hidden        # R4-SES-04
5 recount         credits from the actual exercises: main mover 1.0, helpers 0.25, at most 1.0 a set to a group;
                  the plan prints weekly sets per group, week by week                                               # VOL-09; group credit PROPOSED
6 at the top      a group at its planned final sets keeps them; reps and load carry the progress                     # CX-03
7 hard rules      light core opener first (the person may switch it off for a day, §10.10); hip + push / knee + pull;
                  heavy squat and heavy deadlift on different days; row before pulldown; power before strength; no bands;
                  exercises fixed inside the exercise block   # R2-SES-01..03, UNI-11, ORD-01, ORD-03, EQ-01, PER-02
```

**Laterality.** On his A / B / C days, the athletic days and push / pull / legs each slot keeps the laterality his template names (two-leg squat or hinge in slot 2, single-leg in slot 4, a two-arm row first on the A day; R4-SES-05). The bilateral : unilateral dial (§6) moves only the slots the template leaves open.

**Retired from v1.2's placement:** "stop when the person's total would rise 10 % this week"; "session minutes ≤ the chosen length"; the soft per-session set ceilings (11 fractional sets per group, 14 for a Focus line) as a rule (the template's slots and the per-exercise range bound a session now; the research note stays in §5.6); "the line's ceiling becomes what the week holds ... never flat" as a time rule; supersets switched on because a day ran out of minutes.

**Computed check** (team venv): the in-day rule gives exactly his sequence **2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 → 4/4/3**. The chat example "chest 20 → 22" is a +10 % week; on the stairway an L2 lifter reaches it over several weeks. **The stairway does not restart at an exercise-block boundary** (weeks 5 and 9 on 12 weeks): it runs through the whole plan (INFERRED from R2-PER-04, R2-VOL-07).

**R3-VOL-03 (APPROVED, answers R2-VOL-08).** The default re-asked in plain words is now his rule. In 12's worked examples: quads went Goblet squat 2 → 3 (week 6), Leg press 2 → 3 (week 8), DB split squat 2 → 3 (week 11), DB step-up 2 → 3 (week 12) - Monday first, then Thursday, first exercise first (example 5.1); biceps got a 'Cable curl (bonus)' on the optional Thursday in week 8 and triceps a 'Rope pushdown (bonus)' on Friday, a day that already trains triceps (example 5.2); calves never got a second calf exercise on a leg day.

### 5.6 Session size, groups and the time estimate (v1.3)

| Limit | Value | Tag |
|---|---|---|
| **Exercises per session** (not counting the warm-up or the 2 core exercises) | general fitness / fat loss **5-7**; aesthetics / bodybuilding **6-8**; strength **5-6**; bootcamp **5-7 stations**; field athletes off-season **up to 12**; older adults 60+ **5-6**. Recommendations in a template: "They can add 1 if they want to" | **COACH-R4 R4-SES-02 (RIGHT + words)**; CT-01 |
| Default inside each range (what the template prints) | general 7; aesthetics 7; strength 6; bootcamp 7 stations; field athletes 12; older adults 6. Non-competitive "stay athletic" days 5-10 (default 10: his JUSTICE LEAGUE sheet has 10 slots); CrossFit-style class 5-7 around its skill and WOD | PROPOSED (he gave the ranges; "double-check with whatever data is out there and adjust accordingly within those parameters") |
| Outside the count | warm-up; the 2 core exercises; also joint care, skill practice, conditioning and cardio, the cool-down, test rows | R4-SES-02 (the first two); the rest PROPOSED |
| **A full-body day** | his **A day or B day: about 6 exercises, up to 8** (§10.3) | **COACH-R4 R4-SES-05** |
| **Exercises per group on a day** | on an A / B day what his template gives (1-4: back 2, quads 3, hips 3, biceps or triceps 1); on a split day (push, pull, legs) **2-4, never 1** | **R4-SES-05**; R2-SES-05; R3-SES-01 |
| **Groups (APPROVED)** | the FOCUS groups: quads; **hips = glutes + hamstrings** (RDL + hip thrust + leg curl = 3 hip exercises); chest; back; **shoulders = front + side + rear delts** (+ traps); biceps; triceps; **calves = one exercise × 3 sets per leg day**; core = the 2-exercise opener; a field athlete's credit-only line is not "trained that day" | **R3-SES-01 (RIGHT)**, R3-VOL-01 |
| Field athlete, off-season | **up to 12 exercises + the 2-exercise core block**: the athletic block, then the A / B lifts; **cross pattern (default for most athletes): 2 jump / throw stations + 1 Olympic lift; same-pattern athletic template (size-focused and high-level athletes): 3-4 jump stations + 1 Olympic lift**; warm-up drills never count; a superset of two small isolations counts as one | VOL-08, VOL-17; **R2-SES-04 (APPROVED)**; **R3-SES-01 (APPROVED)**; R4-SES-02 |
| Sets per exercise | 2-5 (2-4 at L1); default when blank 3 compound / 2 isolation / 3 calves; 2 per slot in athletic templates | VOL-16; range PROPOSED |
| Per group per session (reference, not a rule in v1.3) | about 11 fractional sets is where one session's return flattens | SCIENCE Remmert (~11), RP (8-12) |
| Core | 2 exercises × 2 sets, short of failure, as the warm-up; optional core supersets or monster sets anywhere; **the person can switch a day's core block off** (the generator never leaves it out) | R2-SES-03; **R3-SES-02** |
| **Session length** | **not an input and not a limit** | **COACH-CT CT-01; COACH-R4 R4-SES-01** |

**The time estimate (information only; CT-01, R4-SES-01).** Each day prints one line, for example "Average time: about 60-75 min (an estimate, for information only)". "We can give an average recommendation of what it should take, but we will never know what it's going to take." The plan is never cut, reshaped or flagged because of it. The arithmetic behind the estimate (PROPOSED numbers; minutes per working set including rest): warm-up 8 per session (ORD-08); core set 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 × bilateral, UNI-09); isolation 1.75 (unilateral 2.5); plyo / ballistic 1.5; Olympic 3.0; throw 1.25; a supersetted pair × 0.65; + 1.0 min changeover per exercise (0.5 inside a superset pair). The printed range is the estimate 10 % each way, rounded to 5 minutes (PROPOSED). Check against his BYOP day 1 (7 exercises, 19 sets, OBSERVED): 8 + 7 + 19 × ~2.3 ≈ 59 min. His typical lengths (athletes, bodybuilders and powerlifters about 90 minutes, general and weight-loss clients 45-60, a bootcamp class 35-45; UNI-09, PRG-03) are descriptions of what sessions usually take, not limits. *(Retired: "capacity" by minutes - 45 min ≈ 5 exercises / 11 sets, 60 ≈ 7 / 17, 75 ≈ 8 / 23, 90 ≈ 9-10 / 29.)*

#### 5.6.1 Time vs minimums: RETIRED (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-03, R4-SES-04)

v1.2 ran a time check before every plan (R3-SES-02: tell up front and offer another day or longer sessions; with the time kept, train fewer groups directly, big movers first; supersets; the stairway climbs, never flat). The coach removed it: "You need to stop trying to be responsible for the people's time ... I want you to not get complicated over the time."

| v1.2 piece | v1.3 |
|---|---|
| The session-length question and the time check | gone; a time estimate is printed as information |
| Offers (another day, longer sessions, switch blocks off to save minutes) | gone; the 2-day plan suggests a third day (§5.6.2) |
| "Keep my time": fewer groups trained directly; keep order; "not trained directly (time)" | gone; nothing is dropped automatically (R4-SES-04) |
| Supersets "needed" for a day to fit | gone; supersets are a recommendation the person switches on (R3-SES-02 stands here) |
| Keep-time ceilings, the minimum climb, "never flat" | gone; every group reaches its planned final sets, or the plan says what its template cannot hold (§5.6.3) |
| The worked examples by minutes (4 × 60, 2 × 45, the class at 4 × 60) and the 30-template table | history only (`BLAZE_CAMP_BRAIN_v1_2.md` §5.6.1; 12 §5.1, §5.5; 05 §8.7.1) |

What stays from R3-SES-02: supersets recommended to save time; a day's athletic or core block can be switched off; exercises and blocks can be added or removed (§10.10).

#### 5.6.2 Two training days a week (COACH-R4 R4-SES-03)

"Every big muscle still gets trained, with fewer weekly sets (about 6-8 instead of 10), and the plan says so and suggests a 3rd day. We do NOT drop whole muscles, and we do NOT pile on more exercises" - "That sounds right ... People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation."

| Item | Rule | Tag |
|---|---|---|
| Days | **two full-body days** (COACH-R5 R5-GEN-01, "Two full-body days would be more beneficial"; was: one A day and one B day). Day 1: horizontal pull + squat (knee + pull) and incline / vertical push + single-leg hinge (hip + push), biceps, leg extension. Day 2: horizontal push + hinge (hip + push) and vertical pull + lunge (knee + pull), triceps, leg curl. Together: both pull and both push vectors, a two-leg and a single-leg knee lift, a two-leg and a single-leg hip lift | R5-GEN-01; R4-SES-05; UNI-11; which slot goes to which day PROPOSED (engine `engine/DECISIONS.md` G-250, G-251) |
| Weekly sets | every big group starts at 6 and tops at 8 (+ the Focus add); small groups take the same numbers at most; a 2-day maintenance plan holds no line above 8 | "about 6-8" R4-SES-03; exact numbers PROPOSED |
| The floor of 10 | applies from 3 training days | R4-SES-03; R2-VOL-06 |
| What the plan says | a plain note up front: with 2 days each big muscle gets about 6-8 sets a week; a third day would bring it to 10 or more | R4-SES-03 |
| Never | drop whole muscle groups; pile on more exercises | R4-SES-03 |

This replaces v1.2's reading of R3-SES-02 step 2 ("train fewer muscles directly") and closes round-4 candidate 2 (very short weeks).

#### 5.6.3 What a template cannot hold (COACH-R4 R4-SES-04; mechanism PROPOSED)

Six to eight exercises a day at 2-5 sets each do not always hold every group at its planned final sets. The plan never drops anything to solve that, and it never hides it:

| Case | What the plan does |
|---|---|
| The slots cannot hold the group's planned sets, and there is an optional day | his bonus exercise on the optional day (2-4 sets), opened at the exercise-block start that first needs it |
| No optional day | the group is capped at what its slots hold; the plan says "Chest: 13 of 25 planned sets - your template holds 13; add a day or an exercise to reach more" |
| The slots hold fewer than the floor (10, or 6 on 2 days) | the plan says the group is under its floor, and by how much |
| The group has no exercise of its own (a field athlete's arms; a line a client type leaves to the compound lifts) | listed as "trained through the compound lifts" |
| The person wants a shorter day | each day lists the easiest things to remove, in this order: the conditioning finisher, extra jump / throw stations, small-muscle accessories, bonus exercises. Always kept by the generator: the 2 core exercises, the main lifts and, for athletes, the first athletic station. The person decides (R4-SES-04: "they get to pick what they want to keep or what they want to take away") |


### 5.7 Pain and injury (intake rules + the printed guide)

The plan cannot react to pain during the block: nothing is logged (COACH-R3 R3-VOL-02, R3-GEN-01). Pain declared at intake shapes the plan; during the block the plan prints what the person (or coach) should do, and they do it themselves ("the program will tell you to adjust accordingly ... you need to adjust it as you need to", R3-VOL-04).

| Trigger | Action | Tag |
|---|---|---|
| Pain area at intake | affected group / pattern starts at 50-70 % (the floor of 10 does not apply); its exercises move to constraint 4-5 machines or split grips; painful positions excluded; that line's ceiling = its start + 1 set (a gentle climb) | VOL-03, EQ-03; climb PROPOSED |
| Printed guide: "an exercise hurts" | 1) swap to the listed alternative in the same category (more constrained, split grip or unilateral) and keep the sets if you can; 2) if it still hurts, cut that exercise's sets by a third to a half; 3) if it still hurts, drop it for the rest of the block (and see a professional) | UNI-08, VOL-03 ("maybe even drop the exercise altogether"); wording PROPOSED |
| Printed guide: "you feel the wrong muscle" / "you can't do it" | change one small variable or one detail in the same category (never an invented exercise) / use the easier listed version or an assisted one; the sets stay | GEN-05, PER-02; R2-LIB-01 |
| Printed guide: "several things hurt in one week" | stop the block and switch to the recommended easy week or a maintenance phase; build a new block when ready; the app never inserts a deload by itself | R2-VOL-07; R3-PER-01 |
| Rotation bias | keep external- and internal-rotation positions every week; the listed swap for a painful exercise uses the other bias (not by sport) | **R2-LIB-03** |
| Pain and laterality (intake) | shift the bilateral share 20 points toward the pain-free side | UNI-02, EQ-11; 20 points PROPOSED |
| His observed pain text | '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help' (MM 05 A6) | OBSERVED |

**Retired in v1.2:** the logged triggers ('Felt a PAIN' once / twice / three times; pain on 2+ exercises in a week → the block-at-risk offer) and "that muscle's step 0 until 2 pain-free weeks": they needed the check-in (R3-VOL-02).

### 5.8 His numbers against the research (12 §2.2, §2.11)

| His number | Research | Verdict |
|---|---|---|
| Beginner 10-12 (VOL-01) | top of Pelland 2026's high-efficiency tier; Schoenfeld 2017's best band (10+); floor of Baz-Valle 2022's 12-20 | **Matches** |
| Intermediate 15-20 = "maintenance to some growth" | Pelland intermediate tier (11-18); Aube 2022 best at 18 | **Matches as a productive baseline**; true maintenance needs far less (Spiering 2021, Bickel 2011) |
| Growth 20-25, advanced 20+ | Pelland lower-efficiency tier (19-29) | **Matches for trained people, for limited periods** |
| **Floor 10 "for everybody"** (R2-VOL-06; on groups, R3-VOL-01) | Schoenfeld 2017: 10+ weekly sets beat 5-9 for growth; maintenance can need far less | **Matches for growth blocks**; not needed for maintenance (hence the exemptions) |
| **"Most people train 20-30 sets per muscle per week"** (R2-VOL-06) | Surveys: Hackett 2013 (127 competitive bodybuilders: ~16 sets per muscle in one session, mostly once a week; ~30+ for the twice-a-week minority); Baz-Valle 2026 (56 drug-tested elite bodybuilders: 8-17 direct sets per muscle per week); Teixeira 2018 (105 trained gym-goers, helpers counted as full sets: 8 to 50-80 by muscle). Dose-response: Schoenfeld 2019 (most growth at ~30-45), Pelland 2026 (19-29 lower efficiency, 30-42 lowest), Enes 2023/24 (adding +4-6 every 2 weeks from 22 gave no extra growth), RP MRV ranges | **As "what trained people work up to, counting indirect work", 20-30 fits; as "what most people do", it is high** (direct-set surveys ≈ 8-17). His caps already sit inside it (22 / 25; Focus / priority 26-30); above 30 the evidence is thin, which supports an opt-in Pro setting. **No number changes.** |
| Priority / Focus cap 25-30 (VOL-02; R3-SES-01) | edge of Pelland lower/lowest tiers; RP chest MRV*P 24-32+ | **Matches for 1-2 muscles**; v1.2: Focus muscles add only 1-3 sets and do not hold the others back; the +4-6 push is a coach setting (v1.3: the others are no longer held to 3 %/week, CX-01) |
| "5 too little, 40 too much" | 5 = Pelland minimum dose; 40 = lowest efficiency | **Matches** |
| "10 %/week too much" | no direct trial; small individual steps favoured | **Supported indirectly** |
| Deload "about half the sets" (PER-05, R2-VOL-07) | Bell 2023 Delphi; Rogerson 2024 (79 % cut sets) | **In the middle of practice** (now a recommended easy week, R3-PER-01) |
| 4-6-week maintenance at 50-70 % | Bickel 2011, Spiering 2021 | **Well supported**; older adults keep ≥ 70 % (PROPOSED) |

Counting note: Pelland counts indirect sets at 0.5; the coach counts helpers at 0.25. For chest, quads, hamstrings and back both counts are almost equal; for glutes, arms and delts the coach count is lower for the same program (hence the optional dual display, §5.2).

### 5.9 What the engine stores and learns: nothing (v1.1 "How the engine learns" RETIRED, R3-GEN-01)

**Outputs only** (COACH-R3 R3-VOL-02, R3-VOL-04, R3-GEN-01): "We're only doing outputs, and people can change accordingly"; "I don't want people to be checking back on their phone in their program"; "I don't want any data kept." The generator takes a few answers, builds the whole plan once and shows every week ahead of time; the person or coach adjusts it (the printed guide, §5.4c; the plan editor, §10.10).

**Retired** (kept as a note so nobody rebuilds them): the two delivery modes (plan only vs the optional weekly check-in); the log schema as an engine input (DONE, reps, WEIGHT USED or SCORE, EFFORT, 'Failed', HOW IT FELT, pain location); tuning each person's step scale, personal cap or next start from logs; tuning the population tables from users' outcomes (~200+ completed blocks per cell); testing 0.25 vs 0.5 helper credit on user data; consent flows and research data. His EFFORT and HOW IT FELT? menus stay only as columns of the downloaded sheet the person keeps (GEN-03: "They should be tracking it themselves"); the tool never reads them back.

**What stays.** The defaults change only when the coach changes them, by hand, in one place (the JSON twins and the spec) - "this is all customizable" (R2-VOL-06) - and coaches may add their own rules (GEN-08). Each approved change ships as a new model version with a changelog (INFERRED). **Guardrails fixed in the generator** (v1.3): no deload or maintenance inside a block; floor of 10 per trained group in training blocks with 3 or more days (about 6-8 for big groups on 2 days); every trained group reaches its planned final sets or the plan says what its template cannot hold; no time-fitting; nothing dropped automatically; the terms and release accepted before a plan is generated; the pain rules (§5.7); the easy week ≈ half of the hardest week, recommended between blocks; heavy squat and heavy deadlift on different days; core opener first by default; older-adult and racket-50+ defaults (power work only when switched on, with the warning); no bands / variable resistance; Focus / priority ceiling 30 (Pro setting excepted); locked Blaze rules and coaches' added rules (GEN-08).

### 5.10 Pending (volume)

**Settled by round 3** (removed from this list): the stairway numbers and the λ peak anchoring, the effort drift (R3-VOL-04); the check-in questions, the life column, the 'Failed' answer, "a 10 lowers the plan", the repeated week and the block-at-risk offer (all retired, R3-VOL-02); rear delts vs the floor (R3-VOL-01: one shoulders group); the "2-4" grouping and calves one exercise × 3 (R3-SES-01); the R2-VOL-08 placement (R3-VOL-03); the Pro setting's check-in requirement (gone); the 60+ ≤ 3 % cap (retired).

**Settled or retired in v1.3** (removed from this list): ceiling vs step size (the planned final sets are reached, CX-01, R4-PRG-01); the 7 % and 10 % limits, the one-set allowance and release staggering under 10 % (no hard limit, a note above about 15 %, R4-PRG-02); the time-policy details and 2 × 45 minutes (no time-fitting, CT-01; the 2-day rule, R4-SES-03); per-session set ceilings as a rule; the next block's "cap + 1" (R4-PRG-04).

**Still PROPOSED - PENDING COACH APPROVAL** (12 §7, 03, 06, 11): **group credit** (a set at most 1.0 to a group); **the shoulders line's direct side-delt dose** (about 3-4 direct side-delt sets for an L2 bodybuilder); **Focus default +2** (range 1-3) on start and ceiling, bounded by 18 / 26-28 / 30, the others not slowed; **the 2-day numbers** (start 6, top 8; small groups the same at most); **the session-size defaults** inside his ranges and what sits outside the count; **the 7th and 8th exercise of the A / B days**; **the allocation details** (2-5 sets an exercise, isolation 3 / 4, the bonus exercise at 2-4 sets, at most 2 added a day, a main-day extra for small muscles); **what the plan says when a template cannot hold a group** (capped, below the floor, credit only); **the credit of the incline press in the "Chest / Shoulders" slot**; **the acceleration-note details** (one set alone is never noted); **"at least one whole set" in the next-block start**; **"blocks completed in a row"** as the rebuild input and the same start after a stopped block; **the printed self-adjust guide** wording (EN / ES); the floor of 10 for field athletes' chest, back and shoulders; small lines on the same ceilings as big ones; calves to 10 a week through a 4th set or the optional-day slot; the Pro setting numbers (L3, one muscle, up to 35); the time-estimate numbers (the 1-minute changeover included) and the width of the printed range; staggering (the groups take turns; the last steps shared between the last two weeks); the L3 definition; the sets-per-exercise range (2-5; 2-4 at L1); the core counted to abs; the V-taper mechanism (Focus = shoulders + back); heavy low-rep unilateral parameters (UNI-04); the stair-level number. **Retired in v1.3**: see §0d.4. **Retired in v1.2**: see §0c.4. **Retired in v1.1** (still retired): the readiness score; the before-logs intake rate and F42; target-seeking; acclimation and 8-week phase caps; × 1.10 "start hard"; triggered mid-block deloads; hinge glutes 0.5; KB-swing glute credit; small starts 8 and small caps 12 / 18 / 22; floors 4 / 2. **Retired in v1** (still retired): size-based 3 / 5 / 7 %, helpers 0.5, glutes 1.0 from every hinge/lunge, release chunks of 1-2 sets, round-robin placement, "≤ 2 exercises per muscle per session", the v0 peak-week table and L4, the 0.85 × W1 deload, athletic sets as 0.5 fatigue sets.

---

## 6. Bilateral vs unilateral

The coach called this relationship "very important" (COACH-CHAT). His round-1 answers define it; round 2 did not change the slider itself, but four round-2 answers act on it: the two spine days (R2-SES-01/02: the second squat and hinge days lean on non-axial and single-leg work), "2-4 exercises per muscle group" (R2-SES-05: a day's 2-4 exercises are usually one bilateral + one or two unilateral), the older-adult defaults (R2-ATH-08) and the new sport and activity profiles (COACH-CHAT 2026-10-08). Round 3 adds the field-athlete layout (cross pattern by default, the same-pattern template for size-focused and high-level athletes, R3-SES-01) and the 60+ / racket-50+ defaults (R3-ATH-02); the slider itself is unchanged.

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

**v1.3: the template's slots keep their laterality (COACH-R4 R4-SES-05).** His template names the laterality of its slots: slot 2 is a two-leg squat or hinge ("bilateral, symmetrical"), slot 4 a single-leg lift, and the A day opens with a two-arm row. On gym A / B / C days, athletic days and push / pull / legs those slots keep it in every exercise block. The slider of §6.2 acts on the slots the template leaves open (the vertical pull, isolation details, jump stations) and through the exercise picked inside a slot; the share is read on those open slots. For field and court athletes, whose targets ask for 80-90 % single-leg work (UNI-02, UNI-03), this is an open question for the coach (§0d.3 #3).

### 6.6 Evidence

OBSERVED (11 §3.7, 04): his written programs mostly sit near 50 % bilateral; bilateral before unilateral in 225 of 231 sessions. SCIENCE: unilateral training improves single-leg jumps more, bilateral training improves bilateral strength more; sprint and COD differences unreliable (Liao 2022, 14 studies). Contralateral loading raised gluteus medius activity in a dynamic lunge (Stastny 2015); the into/out-of-the-hip vocabulary matches the PRI / Hartman school (07 §1.2).

### 6.7 Pending

Which athletes get same-pattern days: **settled by R3-SES-01** (cross pattern by default; the same-pattern athletic template for size-focused and high-level athletes); a hip-range screen vs sport-only choice of contra/ipsi (PROPOSED: sport only); 50/50 → 80/20 at the week-5 exercise-block change (PROPOSED); COD athletes at 80-90 % unilateral train each bilateral pattern once a week (PROPOSED: yes, at low sets); the recreational COD shares (04 flag F11); every PROPOSED cell in 6.2-6.4.

---

## 7. Training variables

Full version: `11_training_variables.md` / `.json` v1.1 (25 variables, LV / VP / QM rules, worked examples re-run with 12's v1.1 engine) and `10b_equipment_variables_science.md`.

### 7.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| T1 | **Reps by size**: small muscles 12-30 (20s, MAX, MYO); big muscles 5-15, "a mix". **40-rep sets are not a default**: only as an optional CrossFit / AMRAP-style workout or **inside the HYROX station circuits** (approved). | VOL-11; **R3-ATH-03** |
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
| T13 | **Order**: row before pulldown, always; **'the work' first**; **power before strength**; small muscle first only as a priority; **light core opener first** by default (2 × 2, short of failure), movable; **core supersets or monster sets may be added anywhere**; the person may switch a day's core block off. | ORD-01..04, ATH-11; **R2-SES-03**; R3-SES-02 |
| T14 | **Strength roles**: the work (1 RIR) / the accessory (2 RIR) / the nuance (MAX) / the survival (done no matter what). | ORD-07 |
| T15 | **Supersets are a fatiguing and density tool**; **the plan recommends them per eligible pair** to save time ("Recommend doing supersets so that it's a faster workout"). | ORD-05; **R3-SES-02** |
| T16 | **Contrast / French contrast and complexes**: intermediate+ athletes, off-season only, ~78-85 %, no rest inside. | ATH-12 |
| T17 | **Warm-up always** (5 min any cardio + A-drills or mobility); A-drills never volume. | ORD-08 |
| T18 | **Strength template**: main lift 80/80/85/85/90/90 % at RPE 7 → 10; **Olympic**: DB/KB and pull variants keep 4×8 @75 % → 4×6 → 4×6 → 4×4 @90 %; **full squat cleans and snatches 3-5 reps per set with the same weekly reps** (e.g. 6×5), "the coach's eye and how the athlete's feeling to make sure that they're fast and powerful". | PER-09; **R2-ATH-05** |
| T19 | **Speed is a variable, ROM is a variable, load is a variable, volume is a variable**; heavier = slower, lighter = faster. | COACH-CHAT |
| T20 | **No variable resistance** for now. | EQ-12, EQ-01 |
| T21 | **Effort 10 = "the max I can do ... but it was successful"** (0 RIR), not a fail; "Couldn't do it" = the failed set. v1.2: both are helper lines of the downloaded sheet's EFFORT and HOW IT FELT? columns, never engine inputs. | **R2-VOL-02**; R3-VOL-02 |
| T22 | **Weight guidance in reps-in-reserve words with the RPE number** and a week-1 tip ("pick a weight you could lift 2-3 more times"); the cue follows the approved drift (3 → 2 → 1-2 → 1 RIR + intensifiers, R3-VOL-04); **% only with a recent tested best**; if lifts or maxes are not tested, RPE / RIR. **Olympic lifts are explained as power output**; they "don't necessarily need to go by percentage unless you're a competitive Olympic lifter" (competitive weightlifting = its own programming). | **R2-GEN-06** |

### 7.2 The variable stack (v1.2; `11_training_variables.json > variables`)

```
EXERCISE   = pattern · implement/constraint (1-5) · load position + Davidson zone (rotation bias) · load laterality (contra/ipsi)
             · stance/base · grip · feet/body · ROM · end range · plane (incl. core segment) · axial load (two spine days)
             · one detail (F.DETAIL: which hand holds the weight, grip, stance, implement, range; R2-LIB-01)
DOSE       = load · speed/intent · tempo · sets x reps · effort (RIR, planned drift 3 -> 1 inside 1-3, approved R3-VOL-04) · rest/density/pairing · frequency
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
| Calves (one exercise × 3 sets every leg day) | '15' - '20', last set 'MAX' | '10 to 15' | '8 to 12' heavy single-leg | '15 to 20' | '15 to 20' |
| Core (light opener, 2 × 2) | '10 to 15' or 20-60 s, short of failure | '8 to 12' | by plane; 20-50 s | circuit 30-50 s | '10 to 15' / time |
| Olympic | - | % template only for competitive weightlifting (own program, v2) | L1 + early L2: DB/KB snatch, single-arm DB snatch, KB squat clean, hex-bar jump, hang pull / hang clean 4×8 → 4×4 ramp; L2+ power / hang-power '3 to 5', full squat lifts **3-5 reps** (R2-ATH-05) | - | L1 variants; 60+ off by default |
| HYROX station circuits (stay athletic) | - | - | - | - | the 2 weekly station-circuit finishers (APPROVED, R3-ATH-03; 40-rep / AMRAP sets only there; never muscle sets); dosed by time, distance, reps or calories (sled, wall balls ≤ 20 lb, carries, sandbag lunges, ergs; units PROPOSED) |

Preference styles (VOL-12): `volume_lighter`, `balanced`, `heavy_powerlifting`; **weekly sets unchanged**. Rep stores and REPS menu additions (PROPOSED): '1 to 3', '3 to 5', '25 to 30', per side, seconds, metres, contacts, throws, calories, rounds.

### 7.4 Effort (how the client sees it; EN + ES; copy PROPOSED)

| Target RIR | RPE | Plain words |
|---|---|---|
| 3 | 7 | hard; 3 more clean reps were possible |
| 2 | 8 | very hard; 2 more clean reps |
| 1 | 9 | "leave 1 in the tank" |
| 0 ('MAX') | 10 | technical failure (small-muscle or bodyweight last sets only) |

His EFFORT menu ('1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', **'8 - That was perfect'** the bullseye = "I hit the target the plan gave me", '9 - That was terrible' = harder than planned, **"10 - I'm done" = "the most I could do, and I made it"**, R2-VOL-02) and HOW IT FELT ('Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', **"Couldn't do it" = the failed set**) are kept verbatim (OBSERVED LIB AX:AY); in v1.2 they are dropdown columns of the downloaded sheet the person keeps, never read back by the tool (R3-VOL-02). Deload sets 3+ RIR (PER-05, R2-VOL-07). Speed work 'FAST RPE6 or about 60-70%'. Plyos, throws, sprints at maximum intent and stopped when quality drops. **The planned RIR of each week follows the stairway inside 1-3 RIR** (12 weeks: 3 RIR in weeks 1-6, 2 in 7-9, 1-2 in 10-11, 1 + intensifiers in week 12; **APPROVED, R3-VOL-04**; the VOL-13 flag is closed).

**Reps and load: the rule the person applies (v1.3; COACH-R4 R4-PRG-03; COACH-CX CX-02, CX-03).** There are no check-ins, so rep and load progress is written as a rule and never as a promised number for a week: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Every lift prints its own line ("Progress: when you hit 12 on every set with 2 left in the tank, add weight next time and start again at 8"); the reps in the tank are that week's planned effort. A fixed-rep lift reads "when every set is done with N left in the tank, add weight next time"; a lift with its reps written per set (12 / 10 / 8) says "the written reps" (these two wordings PROPOSED). A week that keeps its sets progresses through this rule. That is planned progress; an unchanged prescription is never labelled progress (CX-02).

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

- **Inside an exercise block** (4-6 weeks): exercises fixed; only sets, reps, load and RIR move (PER-02). Mid-block swaps only by the person's or coach's own choice: the dropdown swap or the plan editor, following the printed guide when something hurts, hits the wrong muscle or can't be done (GEN-04, GEN-05, EQ-10; R3-SES-02, R3-VOL-02).
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

The planned 3 → 1 RIR drift (**approved**, R3-VOL-04); barbell power / hang-power catches at 3-5 reps (INFERRED); whether a load-position step or a contra → ipsi swap counts as a "small variable" between blocks (INFERRED yes); French contrast 4th member without a reverse band (PROPOSED: bodyweight pogo / repeat squat jumps); speed-lift effort label ('1RIR' vs 'FAST RPE6', open v0 item); whether a superset may pair two exercises for the same muscle for advanced clients (PROPOSED: no, except contrast and finisher pairs); HYROX station dosing units (time, distance, reps or calories; PROPOSED - the circuits themselves are approved, R3-ATH-03); the coach opt-in for Olympic percentages (13 N-PROD-20).

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
| E6 | **Older, injured and high-volume clients** collect volume "in a safe place with more constraints": compounds and isolation lean machine/cable; **never overhead squat or low-bar squat**; **injured and high-volume clients never snatch or depth jump**; **older adults (60+)**: landing drills, balance, quick stepping, light medball throws and fast machine work on; **ankle hops, other jumps, Olympic lifts and depth jumps off by default, switchable with the warning** "Make sure that you have a fitness professional to help you understand what this means" (snatch variants stay out, EQ-03). | EQ-03; **R2-ATH-08** (round 2 wins for older adults); **R3-ATH-02** |
| E7 | **A foundational older/injured client may use machines filed MODERATE/ADVANCED.** | EQ-04 |
| E8 | **Seated machine shoulder press** in VERTICAL PUSH (foundational). | EQ-05; R2-LIB-07 |
| E9 | **Medball weights**: slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, passes/rotations 8-10 lb; lighter for youth and older; heavier only for specific uses (medball hang clean, **wall balls for CrossFit / HYROX**: the race ball, never over 20 lb, R3-ATH-03); **never over 20 lb**. | EQ-06; R3-ATH-03 |
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
| Fat loss / bootcamp / general / stay athletic | 2-3 | DB, bodyweight, KB | circuits for bootcamp; HYROX station circuits as finishers, not muscle sets (APPROVED, R3-ATH-03) | PRG-03; R3-ATH-03 |
| Older (60+) / injured / high-volume | **4-5** | **4-5** | never OH squat or low-bar squat; injured / high-volume never snatch or depth jump; 60+: landing drills, balance, quick stepping, light medball throws and fast machine work on; ankle hops, other jumps, Olympic lifts (snatch variants out) and depth jumps off, switchable with the warning | EQ-03, EQ-04; R2-ATH-08; **R3-ATH-02** |
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

**What a swap keeps and loses (v1.3; COACH-R4 R4-LIB-04).** Every swap in a dropdown, and every pick that stands in for an exercise the person's equipment does not hold, prints one short line: "DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch." The line is built from the catalog's own fields (the muscles credited, the implement, the grip, one limb or two, range, support, plane, level). The wording table is PROPOSED.

### 8.6 Pending (equipment)

Hack squat and pendulum at constraint 4 or 5 (v1: 4, above Smith); which squat fills the second squat day at home or in a hotel with no machines (PROPOSED: a single-leg squat; a goblet squat if not sore, R2-SES-02); the 8 knee-banded FBS items replaced by ball/pad squeeze twins (done; confirm, N-PROD-11); equipment preference as an intake question (F29b, PROPOSED); HYROX kit (sled, SkiErg, rower, wall ball) as add-ons and their substitutes when missing (PROPOSED); 'high rows' = HYROX (confirmed, R3-ATH-03).

---

## 9. Athletes, every popular US sport, and "stay athletic and active"

Full version: `04_athlete_profiles.md` / `04_profiles.json` v1.1: **127 profiles** (93 competitive, 31 recreational, 3 goal) and 81 position / phase variants, each a weekly set budget per category with season overrides, ground-contact class, aerobic counts, injury rules, sample weeks and rationale; plus the sport picker registry (**52 sports**, 146 position / event / discipline choices), the activity registry (**26 "stay athletic and active" activities**), age overlays and consistency checks C1-C22. Periodization by sport: 06 v1.1 §8.2.5-8.2.7. Session level: 05 v1.1 §8.2, §8.8, §8.9.

### 9.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| A1 | **Plyo vs ballistic is set by the sport's ground-contact time**: long ground time → more ballistics; short → more plyos; both ends always present. | ATH-01, CAT-10 |
| A2 | **Programs start more ballistic and gradually become more plyometric**; **each block starts 15 points more ballistic** than its end share. | CAT-10; **R2-ATH-01** |
| A3 | **Plyo shares by sport (share of jump and throw work that is plyometric by the end of a block), APPROVED**: sprinters 75 %; volleyball, soccer, football skill 60 %; basketball, tennis, football big-skill, weekend warriors 50 %; baseball, softball, hockey, linemen, MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ, golf 25 %. "Your sport ranking is read as fast, bouncy contacts, not total jumps." **Round 3, APPROVED for the remaining sports**: 75 % runners; 60 % lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers; 50 % beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX; 40 % rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling; 25 % swimming, water polo, rowing, judo, taekwondo, climbing; recreational players use their activity's share ("a bit of everything" 50 %). | **R2-ATH-01**; **R3-ATH-04** |
| A4 | **Ballistic (longer contact or one big effort)**: squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws (and KB swings). **Plyometric (short, bouncy contacts)**: pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps. **Stick-the-landing drills are the "receive" stage.** APPROVED. | **R2-ATH-02**; R2-VOL-05 |
| A5 | **"Receive-Create stages"** (1 Land, 2 Land & Go, 3 Repeat): 12-week plan weeks 1-3 / 4-7 / 8-12; 8-week plan 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2. APPROVED. Unilateral plyos are harder than bilateral. | **R2-ATH-03**; CAT-10, CAT-11 |
| A6 | **Plyo volume ranking**: basketball ≈ volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf. | ATH-02 |
| A7 | **More resistance (strength/size)**: football linemen, wrestlers, rugby, heavyweight fighters, throwers. **More speed/power**: sprinters, basketball, skill positions, volleyball. | ATH-03 |
| A8 | **Boxers / strikers: reduce pressing and arm volume when punching volume is high; never cut it to zero.** | ATH-04 |
| A9 | **Medball volume**: high for baseball, boxing, MMA, tennis, golf; moderate for basketball and football; **none in the main workout for aesthetics/bodybuilders**. | ATH-05 |
| A10 | **Change-of-direction route names are for every athlete**, tiered by turn angle. | ATH-06 |
| A11 | **Aerobic sessions/week, APPROVED and adjustable by the user**: general / fat loss 3; aesthetics 4 (a second easy Orange) + optional walks; athletes in season 2, pre-season 2; **off-season by sport**: baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4; powerlifters 2 easy (Orange). **Round 3**: the remaining sports 2-4 like this list; **0 extra for swimmers, runners, rowers and endurance cyclists** (their practice is the cardio); HYROX 4; a 45-60+ min session of a stay-active user's activity counts as one of the 3 (up to 2). | ATH-07; **R2-ATH-06, R2-SES-06**; **R3-ATH-04, R3-ATH-01, R3-ATH-03, R3-ATH-05** |
| A12 | **Pitchers**: less overhead pressing, more arm care, rotational throws kept light. | ATH-08 |
| A13 | **Older adults (60+), APPROVED defaults**: landing drills, balance, quick stepping without a hop, light medball throws and fast machine work on; low ankle hops, other jumps, Olympic lifts and depth jumps off, **"an additional option if they want to do it", with the warning** "Make sure that you have a fitness professional to help you understand what this means."; overhead and low-bar squats out. **Racket players 50+**: knee-friendly strength, calf and Achilles work every leg day, rotator cuff, low-impact jumps only unless switched on. **Youth may lift from the floor from about 14, after one block of hang work.** No sex-based rules. | **R2-ATH-08**; **R3-ATH-02**; ATH-09 |
| A14 | **Everyone in athletic training gets Olympic lifts**: beginners DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate+ the full scope; **up to 4 × a week**: clean days are squat-pattern days, snatch days are hinge-pattern days ("snatches a little bit more hingy than squatty"). | ATH-10; **R2-ATH-04** |
| A15 | **Full squat cleans and snatches use 3-5 reps per set with the same weekly reps**; DB/KB and pull variants keep his 4×8 → 4×4 ramp; "the coach's eye and how the athlete's feeling to make sure that they're fast and powerful". | **R2-ATH-05** |
| A16 | **Contrast / French contrast / complexes**: intermediate+ athletes, off-season only, ~78-85 %, no rest inside. | ATH-12 |
| A17 | **'Justice League' was a marketing name** for a non-competitive, all-round athletic program (adults, youth and kids). | ATH-13 |
| A18 | **Seasons**: off-season most volume; **pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power, ending with a 1-2-week taper before the first game** (APPROVED; length adjustable); in-season 2 days/week, low volume; post-season recovery. In season bilateral work stays minimal. | PER-08, UNI-10; **R2-PER-06** |
| A19 | **In season, game-heavy sports** (basketball, volleyball, soccer, football, hockey): gym plyos at about half, no extra change-of-direction work, sprints only for speed athletes, the one hard gym day at least 48 hours before a game. APPROVED; round 3 extends it to lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball (APPROVED). | **R2-ATH-07**; **R3-ATH-04** |
| A20 | **Season calendar from the next season start date (or "in season until") plus practice and game days per week**; the tool works out off-, pre- and in-season. APPROVED. | **R2-GEN-05** |
| A21 | **VOL 1 / 2 / 3 rep phases** one per off-season block, for every athlete. | PER-11 |
| A22 | **High school, college and pro need about the same plan**; pros need more care. | PRG-09 |
| A23 | **Field athletes off-season far from competition: up to 12 exercises + the 2-exercise core block**, with **2-4 exercises for each group trained that day** (knee + pull day, hip + push day); the **cross pattern** is the default for most athletes (the resistance groups take 9 of the 12, leaving 2 jump / throw stations + 1 Olympic lift); the **same-pattern athletic template** (3-4 jump stations + 1 Olympic lift) is for size-focused and high-level athletes; light core first. APPROVED. | VOL-08, VOL-17, ATH-11; **R2-SES-04**; **R3-SES-01** |
| A24 | **Athletic work never counts toward muscle sets.** | VOL-10 |
| A25 | **Speed session order** squirrel jumps → MACH drills / acceleration starts → max velocity; medball 'ALL LIST' = 1 × 10 per throw. | LIB-21, LIB-22 |
| A26 | **Strength/aesthetics need bilateral drive; field/COD athletes 80-90 % unilateral.** | UNI-02, CAT-13 |
| A27 | **Recreational sport → the activity only (no position, no season); competitive → sport, position, season start date, practice and game days.** | GEN-02; R2-GEN-05 |
| A28 | **Every popular US sport is in the picker, swimming included; gen pop who "want to stay athletic and active" (pickleball, HYROX ...) get their own door.** | **COACH-CHAT 2026-10-08** |
| A29 | **Competitive Olympic weightlifting is its own programming** (percentage-based, "completely different but kind of the same"). | **R2-GEN-06** |
| A30 | **Swimming dryland, APPROVED**: 3 dryland gym days + 1 optional (2 for younger or lower-level swimmers); 0 extra gym cardio (the pool is the aerobic work; the user can add one); jumps mostly ballistic, 25 % plyometric at block end; Olympic lifts 2-3 days; shoulder care (external rotation, floor Y / T raises, KB face pulls) every session, never bands; a 2-week dryland taper lined up with the swim coach's taper before the main championship meet, 1 week or none before smaller meets (§9.11). | **R3-ATH-01** |
| A31 | **HYROX, APPROVED** ("high rows" = HYROX): 2 strength days (squat + pull, deadlift + push) + 2 hybrid days; 4 cardio sessions (Blue, Green, Orange + a second Orange); 2 short station circuits a week as finishers that never count as muscle sets; wall balls with the race ball (≤ 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric (§9.10). | **R3-ATH-03** |
| A32 | **Stay athletic and active, APPROVED**: play days (the hardest gym day ≥ 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps); a 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2); optional event date (the hardest weeks end 1 week before, then 1 easy week at about half the sets) (§9.10). | **R3-ATH-05** |
| A33 | **Athletes and gen pop can switch off a day's athletic or core block** (e.g. a pickleball player with sore calves) and add or remove exercises or blocks (§10.10). | **R3-SES-02** |

### 9.2 The ground-contact model (04 `ground_contact_model`; shares APPROVED by sport, R2-ATH-01 and R3-ATH-04)

| Class | Ground contact | Sports he named (R2-ATH-01) | Other sports placed by the same rule (04 v1.2; most now APPROVED by R3-ATH-04, see below) | Plyo share, block end | Block start |
|---|---|---|---|---|---|
| 1 very short | ~0.10-0.16 s (sprinting, bounding, repeated hops) | sprinters | 400 m, hurdles, long / triple jump, middle distance, distance and cross-country runners, triathlon, run for fitness | **75 %** | 60 % |
| 2 short | ~0.15-0.25 s (fast SSC: approach jumps, first steps, sharp cuts) | volleyball, soccer, football skill | flag football, lacrosse field players, field hockey field players, rugby sevens, ultimate cutters, high jump, pole vault, gymnastics, cheer flyers / tumblers, competitive dance, figure skating | **60 %** | 45 % |
| 3 mixed | short jumps and cuts mixed with planted pushes | basketball, tennis, football big-skill, weekend warriors | beach volleyball, pickleball, padel, rugby backs, goalkeepers (soccer, lacrosse, field hockey), javelin, freestyle ski / snowboard, HYROX, OCR, youth, most recreational court and field play | **50 %** | 35 % |
| 4 long | planted rotational or pushing actions, well over 0.25 s | baseball, softball, hockey, linemen, MMA | QB, kicker / punter, rugby forwards, cheer bases, throwers, diving, alpine ski, cycling, rec softball / kickball | **40 %** | 25 % |
| 5 very long / grounded | striking from stance, swinging, grappling | boxing, karate, kickboxing, wrestling, BJJ, golf | **swimming** (starts and turns = single big efforts with long contacts = ballistic by R2-ATH-02; v1.1 sport verification moved it from class 4; 25 % APPROVED, R3-ATH-01), water polo, rowing, judo, taekwondo, weightlifting, strongman, climbing, hiking / rucking, surf / paddle, rec combat fitness | **25 %** | 10 % |
| - | older adults (60+) | - | power work only when chosen (§9.9) | only if chosen | - |
| - | aesthetics / bodybuilding, powerlifting | - | no plyo block (medball warm-up only for aesthetics) | - | - |

"Power work" = plyometric (short contact) + ballistic (long contact or single effort: loaded/box/broad/squat jumps, medball throws, KB swings); the share is counted over **jump and throw** work (R2-ATH-01). **Block start = end − 15 points** as approved; the "floor 20 %" is dropped everywhere (04 v1.2 removed its class-5 floor, so the 25 % sports start at 10 %). **v1.2 (R3-ATH-04, APPROVED)**: his round-3 list confirms these placements - 75 % runners; 60 % lacrosse (men's defense moved from 50 % to 60 % in 04 v1.2), field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers; 50 % beach volleyball, pickleball, padel, rugby backs, goalkeepers (read as soccer, lacrosse and field-hockey goalkeepers, PROPOSED), javelin, HYROX; 40 % rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling; 25 % swimming, water polo, rowing, judo, taekwondo, climbing. Still INFERRED (not in his lists): QB, kicker / punter, freestyle ski / snowboard, OCR, competitive dance, figure skating, weightlifting, strongman, hiking, surf / paddle; the ice-hockey goalie stays with hockey (40 %). Recreational profiles take their activity's share ("a bit of everything" stays 50 %) (APPROVED, R3-ATH-04; 04 flag F5 closed). SCIENCE: fast stretch-shortening cycle under ~250 ms vs slow over ~250 ms (Schmidtbleicher; Flanagan & Comyns 2008); sprint contacts ~0.14-0.16 s in acceleration.

### 9.3 Receive-Create stages (APPROVED, COACH-R2 R2-ATH-03)

| Stage | What | Examples | 12-week plan | 8-week plan |
|---|---|---|---|---|
| RC1 **Land** (receive and pause) | absorb and stick, 3 s hold | stick-the-landing, depth drop & stick, 'Push up Stick the Landing' (hands from a box to the floor, LIB-02) | weeks 1-3 | weeks 1-2 |
| RC2 **Land & Go** (receive then create) | stick, then one jump or hop | depth drop to jump, drop into box jump, stick then hop | weeks 4-7 | weeks 3-5 |
| RC3 **Repeat** (repeated receive / create) | continuous rebounds | repeated hops, hurdle hops (taller + continuous = advanced, LIB-04), pogos, bounds | weeks 8-12 at the sport's share | weeks 6-8 |

Rules: restart at RC1 each off-season; hold the current stage in maintenance and pre-season blocks; intermediate and advanced athletes may start at RC2; bilateral before unilateral inside each stage (CAT-10); unloaded before loaded (10-20 % BW, EQ-15); heights per EQ-16; an intermediate athlete takes one plyo from each MODERATE track (LIB-05). Contacts per session stay under NSCA's lower bands (L1 80, L2 100, L3 120); 2-3 plyo sessions a week off-season, 48-72 h apart; masters 3-4 days apart (SCIENCE).

### 9.4 Sport matrix v1.2: every sport in the picker (summary of `04_profiles.json` v1.2; numbers computed from the profiles)

**Confidence labels (v1.3; COACH-R4 R4-SCP-03).** Every sport profile carries one label, in the data (`profiles.sports[*].confidence`, with its basis) and in the docs: **confirmed by coach** (read from his sheets, or the plan approved by name: swimming R3-ATH-01, HYROX R3-ATH-03) - 23 profiles; **based on a similar sport** (a base profile, a position delta or a reused variant) - 67 profiles; **proposed** (a needs analysis built with his general rules) - 37 profiles. The label is **not shown on a plan**. The source file `04_profiles.json` v1.2 keeps its evidence tags; the compiler derives the label from them.

Columns: profiles behind the sport (positions pick the profile); contact class and plyo share at block end; aerobic gym sessions a week off-season (pre-season and in-season 2 for every sport that has a season, except where the sport's practice is the aerobic work = 0); bilateral share block start → block end (in-season); Olympic exposures a week off-season (L1 variants; 60+ off by default); season type (06 §8.2.5: A game-heavy team, B diamond, C meet / championship, D combat with a date, E tournament individual, F endurance / event race, G strength / physique meet or show, H seasonal outdoor). Numbers for sports he named in rounds 2 and 3 follow his approved rows (R2-ATH-01, R2-ATH-06; R3-ATH-01, R3-ATH-03, R3-ATH-04); the rest is INFERRED / PROPOSED in 04 v1.2.

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
| | Lacrosse | men's and women's attack, midfield, defense, goalie (+ FOGO, LSM, draw) | 2-3 → 60 % (goalie 50 %; men's defense moved to 60 % in v1.2) | 3-4 | 20-30/80-70 → 10-20/90-80 (10/90) | 4 | A |
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
| | HYROX (competitive) | one profile (2 strength + 2 hybrid days + 1 optional, R3-ATH-03) | 3 → 50 % | 4 (APPROVED, R3-ATH-03) | 40/60 → 30/70 | 2 | F |
| | Obstacle course racing | one profile | 3 → 50 % | 4 (by analogy with HYROX, PROPOSED) | 30/70 → 20/80 | 2 | F |
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
| How often | **up to 4 × a week**; **clean family on squat-pattern (knee) days, snatch family on hinge-pattern (hip) days**; jerks either day (INFERRED); observed basis: BASEBALL Block 2 Mon/Thu cleans, Tue/Fri snatches; swimmers 2-3 days (R3-ATH-01) | **R2-ATH-04**; R3-ATH-01 |
| Reps | DB/KB and pull variants keep his ramp 4×8 @75 % → 4×6 @80 % → 4×6 @85 % → 4×4 @90 %; **full squat cleans and snatches 3-5 reps per set with the same weekly reps** (e.g. 6×5 @75 %); barbell power / hang-power catches follow the 3-5 rule (INFERRED); stop when the bar slows | **R2-ATH-05**; PER-09 |
| Load | RPE / RIR and bar speed; the plan explains them as **power output** ("move it fast; if it slows down or your technique breaks, it's too heavy"); a % only when that exact lift has a tested best and a coach switches it on (PROPOSED, 13 N-PROD-20); % from that lift's own max | **R2-GEN-06**, R2-ATH-05 |
| Competitive weightlifters | their own percentage-based program type (v2); until then the picker offers the athletic strength-and-power plan (13 N-PROD-17, PROPOSED) | R2-GEN-06 |
| In season | a light piece (2 × 3 hang power clean or DB snatch), dropped in heavy game weeks | R2-ATH-04 (APPROVED proposal) |
| Youth | from the floor from about 14, after one block of hang work | **R2-ATH-08** |
| Older (60+) | **off by default**; switchable with the warning (§9.9); snatch variants stay out for 60+ and for injured / high-volume clients (EQ-03) | **R2-ATH-08**; **R3-ATH-02**; EQ-03 |
| Without bumpers | hang variants lowered under control; DB/KB; hex-bar jumps | ATH-10 |
| Endurance athletes | a small dose (2-3 sets, 1-2 exposures: hex-bar jumps, hang pulls, KB squat clean) (PROPOSED; 04 aquatic O10) | ATH-10 |

### 9.6 Medball (ATH-05, EQ-06, EQ-07, LIB-06, LIB-22)

Light balls for speed (8-10 lb passes/rotations; 6-10 overhead; 6-8 sit-up; slams 10-20; never over 20 lb; lighter for youth and older); no levels, "just do them right"; dose 1 × 10 per throw, R/L pairs; a throwing slot may be the whole ~19-throw 'ALL LIST'; none for aesthetics except the dynamic medball warm-up; no medball → plyo push-ups, fast cable rotations, fake medball slam. **Medball throws are ballistic** and count in the plyo:ballistic share of jump **and throw** work (R2-ATH-01, R2-ATH-02, APPROVED). Wall balls (HYROX / CrossFit) are conditioning, not muscle sets (HYROX: APPROVED, R3-ATH-03; the race ball, never over 20 lb). Light medball throws stay on for 60+ (R3-ATH-02).

### 9.7 Aerobic work (ATH-07, ORD-09, EQ-14; R2-SES-06, R2-ATH-06)

**Every count below is a default the user can raise or lower** ("I need more cardio ... it just adds it ... less cardio, it takes away", R2-SES-06): the week view has a "Cardio: less · as planned · more" control.

| Population | Sessions/week (default) | Content | Tag |
|---|---|---|---|
| General, fat loss, "stay athletic and active" | **3** | one Blue A, one Green B, one Orange C; **a 45-60+ min session of the activity counts as one of the 3 (up to 2)** | ATH-07; R2-SES-06; **R3-ATH-05 (APPROVED)** |
| Aesthetics / bodybuilders (the whole physique family) | **4 + optional walks** | Blue, Green, Orange + **a second easy Orange** (long, low); walks 20-30 min easy after workouts | **R2-SES-06 (APPROVED)** |
| Athletes off-season | **2-4 by sport (APPROVED)**: baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4; the remaining sports 2-4 like this list (APPROVED, R3-ATH-04; per profile in 04 v1.2: lacrosse, rugby, ultimate 3-4; cheer, gymnastics, climbing 2 ...) | + sprint buy-outs; VO2 work also through supersets (ORD-05) | **R2-ATH-06**; **R3-ATH-04** |
| Athletes pre-season / in season | **2** | speed/power emphasis; sprints for speed athletes | **R2-ATH-06**, ATH-07 |
| Sports whose practice is the aerobic work | **0 extra gym sessions** (the user can add one): swimming, water polo, running, cross country, triathlon, endurance cycling, rowing | the pool / run / ride / row is the conditioning | **APPROVED (R3-ATH-01, R3-ATH-04)** for swimmers, runners, rowers and endurance cyclists; water polo and triathlon by analogy (INFERRED) |
| HYROX (OCR by analogy) | **4** (Blue, Green, Orange + a second Orange) + 2 station circuits a week as finishers (not muscle sets) | running ≈ half of the race; 4 also in the race-specific pre-season (INFERRED from his reason) | **APPROVED (R3-ATH-03)**; OCR PROPOSED |
| Powerlifters | **2 easy (Orange)** | | **R2-ATH-06** |
| Fighters | daily | the opening cardio is a real aerobic block | ORD-09 |
| Fat-loss circuits | finisher, not a separate session | rounds 3 → 5, work 30 → 50 s (OBSERVED) | PRG-11 |
| Endurance event | per plan | the Chris Hinshaw half-marathon plan as-is (the longest run; 21.6 miles removed) | PRG-12; R2-LIB-06 |

Any erg works; track calories, time or distance with one unit per block; never the same colour twice in a week (OBSERVED AE A5) except the approved second Orange; level unlock C → C+B → C+B+A → lactate clearance (OBSERVED CrossFit grid); steady cardio ≤ 40 min (OBSERVED). When a user adds a 5th or 6th session, Orange repeats first (PROPOSED).

### 9.8 Seasons (PER-08, UNI-10, PER-11; R2-PER-06, R2-ATH-07, R2-GEN-05; 06 §8.2)

**Calendar.** Competitive athletes give the next season start date (or "in season until", or a competition / fight / meet date) plus practice days and game days per week (R2-GEN-05). The tool works out: off-season blocks (stairways, VOL 1 → 3) → **pre-season 4-6 weeks** ending at the first game → in-season → post-season. The hard gym day sits ≥ 48 h before a game (R2-ATH-07). Meet and race sports (swimming, track, running, triathlon, rowing, skiing) peak at the **end** of the season, so an optional championship / goal-race date sets the taper (swimming: a 2-week dryland taper lined up with the swim coach's taper before the main championship meet, 1 week or none before smaller meets: APPROVED, R3-ATH-01; other meet sports PROPOSED).

| Phase | Resistance volume | Athletic content | Bilateral | Other |
|---|---|---|---|---|
| Off-season | most volume: stairway blocks (field/court lower × 0.7, upper × 0.5 of the gym start, then the floor of 10 for trained muscles; strength-type 0.9 / 0.8) | start ballistic → plyometric; RC1 → RC3; VOL 1 → 2 → 3 one per block; Olympic up to 4 ×/week; contrast L2+ | slider start → end (§6.2) | STARTING / MID / ADVANCED as blocks or levels (PRG-04) |
| **Pre-season** | **4-6 weeks at about 60 % of off-season sets**, flat, not floored | **more speed and power**; sprints; RC stage held | lower | **1-2-week taper before the first game** (1 week for a 4-5-week pre-season, 2 for 6; volume -40-60 %, intensity kept; SCIENCE Bosquet 2007) |
| In-season | 2 days/week, low volume (× 0.4-0.5 lower, 0.3-0.4 upper), flat (0 %) | **game-heavy sports**: gym plyos about half, no extra COD, sprints only for speed athletes, hard day ≥ 48 h before a game; Olympic 2 × 3 light, out in heavy game weeks | **minimal** (10/90-20/80) | 2 aerobic sessions; a heavy game week (3+ games, or 2 + travel) keeps only the light day (PROPOSED) |
| Post-season | recovery and general work (OBSERVED baseball 'wk 8'), then a maintenance phase or general work | arm care, mobility, easy aerobic | - | then the next off-season |

**Season types for every sport (06 §8.2.5).** A **game-heavy team** (football, basketball, volleyball, soccer, hockey [R2-ATH-07]; flag football, beach volleyball, lacrosse, field hockey, rugby, ultimate [R3-ATH-04, APPROVED]; cheer, water polo [INFERRED same rule]); B **diamond** (baseball, softball: throws and plyos held at maintenance in season); C **meet / championship** (swimming and diving, track and field, cross country, gymnastics, rowing, wrestling, figure skating, competitive dance: championship taper 1-3 weeks); D **combat with a date** (boxing, MMA, kickboxing, karate, taekwondo, judo, BJJ: off-season blocks between fights; fight prep 6-8 weeks in 2-week steps and waves + 1-2-week taper); E **tournament individual** (tennis, golf, competitive pickleball, padel, other racket sports: a 3-5-day lighter run-in before key tournaments, PROPOSED); F **endurance / event racing** (running, triathlon, cycling, HYROX, OCR, CrossFit competitions: the strength stairway beside the sport's own plan, taper by distance); G **strength and physique** (powerlifting, strongman, Olympic weightlifting [own programming], bodybuilding / physique: meet taper or show prep); H **seasonal outdoor** (alpine skiing / snowboarding, climbing, surfing, skateboarding: a pre-season block before the season, then 2 gym days); I **gen-pop "stay athletic and active"**: no season (§9.10). Round 3 approved the game-heavy rule for six more sports (R3-ATH-04); cheer, gymnastics, competitive pickleball, tennis, wrestling and water polo stay INFERRED (not asked).

### 9.9 Special populations and sport rules

| Group | Rule | ID |
|---|---|---|
| Boxers / strikers | high-punching weeks: pressing, vertical pulling and arm isolation × 0.5-0.7 (PROPOSED factor), never zero | ATH-04 |
| Pitchers | less overhead pressing, more arm care, light rotational throws | ATH-08 |
| **Older adults (60+)** | **On by default**: landing drills (step down and stick, no bounce: the receive stage), balance, quick stepping without a hop, light medball throws, fast machine work. **Off by default, each switchable by the person or coach with his warning** "Make sure that you have a fitness professional to help you understand what this means" (copy C7): low ankle hops, other jumps, Olympic lifts, depth jumps (depth jumps move from EQ-03's "never" to switchable for 60+ only). **Out**: overhead squats and low-bar squats; snatch variants stay out (EQ-03; R3-ATH-02 did not name them, reading flagged). Constrained machines; **the same stairway as everyone** (the v1.1 ≤ 3 % cap is retired); maintenance ≥ 70 %; submax tests only | **R3-ATH-02 (APPROVED)**; R2-ATH-08, R2-ATH-02; EQ-03, EQ-04; R3-VOL-04 |
| **Pickleball, padel and tennis players 50+** (recreational or competitive; no upper age) | knee-friendly strength; **calf and Achilles work every leg day** (v1.3: one of his calf raises on a leg day that has no calf exercise; the two Achilles drills are optional add-ons, R4-LIB-01); rotator-cuff work (warm-up or shoulder-care station, never bands); **only low-impact jumps** (no depth jumps, hurdle hops or bounds) unless switched on with the warning (copy C7b; F44 switch for 50-59, the 60+ switch from 60); applied to `rec_pickleball`, `rec_padel`, `rec_tennis`, `pickleball_competitive` and competitive `tennis` (+ padel variant) | **R3-ATH-02 (APPROVED)**; 04 v1.2 `age_50_plus` |
| Active aging 50-59 (other activities) | the stay-athletic plan with joint-care selection (04 `active_aging_50plus`; PROPOSED) | 04 v1.2 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work; lighter medballs; growth-spurt caps | **R2-ATH-08**; EQ-06 |
| Sex | no rules by sex anywhere (a Focus muscle is the person's choice) | ATH-09, GEN-02; R3-SES-01 |
| Competition level | high school = college = pro in structure; loads, speeds and care differ; pros: step ≤ 5 %, no true 1RM tests, coach review before each block (PROPOSED) | PRG-09 |
| Weekend warrior | profile `weekend_warrior`: non-competitive athletic adults and youth ("a good mix of everything"); 60 min (PROPOSED); L1 Olympic variants unless experienced | ATH-13, GEN-02 |
| Injury hotspots (04 injury library; codes incl. KNEE_DEGENERATIVE_COURT, SHOULDER_SWIMMER, FALLS_COURT, ACHILLES_CALF) | e.g. GROIN (Copenhagen planks), HAMSTRING (Nordics/slider curls), ACL (landings first), PATELLAR (cap rebounds), **SHOULDER_SWIMMER (pull ≥ 1.5 × push, shoulder care every dryland session with DB / cable / KB, never bands; R3-ATH-01)**, KNEE_DEGENERATIVE_COURT (pain-free depth, slow eccentrics, no loaded pivoting under fatigue), NECK (PROPOSED node); v1.2: no rule reads logged pain any more (R3-VOL-02) | OBSERVED + SCIENCE; R3-ATH-01 |

### 9.10 Stay athletic and active (gen pop): pickleball, HYROX and more (COACH-CHAT 2026-10-08; ATH-13; APPROVED R3-ATH-03, R3-ATH-05)

> "Gen Pop and general fitness people are wanting to do things like high rows and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." (COACH-CHAT 2026-10-08) - 'high rows' = **HYROX**, confirmed (R3-ATH-03).

**Who and how they get in.** Gen-pop and general-fitness people with no competitive season who want to stay athletic. A goal tile **"Stay athletic and active / Mantenerme atlético y activo"** opens an activity picker (pick up to two; the first leads); people who chose "Lose fat" or "General fitness" also see a one-line link "Do you also play something (pickleball, HYROX, tennis ...)? Add it". No position, no season dates (GEN-02). **Optional: play days, play length and, for event-type activities, an event date (APPROVED, R3-ATH-05).** The engine family is athletic, recreational branch (13 §13; spec F07 'active', F11r).

**What the plan contains (his non-competitive athletic program as the template, ATH-13; 04 `stay_athletic_standard`):**

| Part of each main day | Dose | Tag |
|---|---|---|
| Warm-up | 5 min any cardio + A-drills / mobility; never counted | ORD-08 |
| Core opener | 2 exercises × 2 sets, light, short of failure; core supersets optional anywhere; **the person may switch a day's core block off** | ATH-11; R2-SES-03; **R3-SES-02** |
| Some power: jumps | 1-2 stations × 2 sets; plyo vs ballistic by the activity's share (each block 15 points more ballistic at the start); Receive-Create stages; **the person may switch a day's athletic block off** (e.g. sore calves after a lot of pickleball) | ATH-01, CAT-10; R2-ATH-01..03; R3-ATH-04; **R3-SES-02** |
| Some power: throws | 0-1 medball station (more for racket sports and golf); ≤ 20 lb | ATH-05, EQ-06 |
| Some agility | 0-1 change-of-direction station (EASY → MOD. TURN; HARD TURN for L2+ under 60); one light footwork station a week even for linear activities (PROPOSED) | ATH-06 |
| Olympic / triple extension | 1 station × 2 sets on most main days (up to 4 a week): clean variants on squat days, snatch variants on hinge days; L1 = hang clean, KB squat clean, single-arm DB snatch, hex-bar jump, hang pulls; explained as power; 60+ only when switched on | ATH-10; R2-ATH-04, R2-GEN-06; R3-ATH-02 |
| Resistance | the A / B lifts after the athletic block (v1.3, R4-SES-05; 5-10 exercises a session); hip + push / knee + pull; heavy squat and heavy deadlift on different days; general factor × 0.8, **floor 10 on groups**, **the approved stairway**; Focus muscles optional | UNI-06, UNI-11; R2-SES-01/02/05, R2-VOL-06, R2-PER-03/04; **R3-SES-01, R3-VOL-04** |
| Calves and shoulders | **calves one exercise × 3 sets every leg day** (racket players 50+: pinned); a rear-delt / KB face-pull exercise each week inside the shoulders group | VOL-17; R2-LIB-04; **R3-SES-01, R3-VOL-01, R3-ATH-02** |
| Aerobic | 3 a week (Blue, Green, Orange), adjustable; **a 45-60+ min session of the activity counts as one of the 3 (up to 2)** | ATH-07; R2-SES-06; **R3-ATH-05 (APPROVED)** |

**How much by days** (04, PROPOSED): 2 days → about 4 athletic stations a day + the activity (v1.3: on 2 days every big group is trained at about 6-8 weekly sets and the plan suggests a third day, R4-SES-03); **3 days = the default for most activities** (4-5 athletic stations a day, resistance on the 05 3-day template: heavy squat day, non-axial hinge day, heavy deadlift day); 4 days = his own weekend-warrior template (2 jumps + 1 throw + 1 COD + 1 Olympic a day, 2 optional days). Weekly ranges across the 18 stay-active profiles: fast plyometric contacts 0-56 (60+ default 0), throws 0-80, cuts 0-56, Olympic sets 0-8 (60+ default 0), aerobic 3 (adjustable 2-5); athletic work ≈ 9-28 % of weekly sets.

**Play days (APPROVED, R3-ATH-05).** The person can enter the days they play: **the hardest gym day stays at least 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps**; a 45-60+ min session of the activity counts as one of their 3 cardio sessions (up to 2). Applied to all 30 recreational profiles (04 v1.2; thresholds normalised to 3+).

**Event date (APPROVED, R3-ATH-05).** Optional (a first HYROX race, a pickleball tournament, a 10K): **the hardest weeks end 1 week before, then 1 easy week at about half the sets**, intensity kept. After the event the plan ends and the person builds the next one (R3-PER-01). No date → the normal stairway or year.

**HYROX (APPROVED, R3-ATH-03).** 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions (Blue, Green, Orange + a second Orange: running is about half the race); 2 short station circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as **finishers that never count as muscle sets**; wall balls with the race ball (never over 20 lb); **40-rep / AMRAP sets only inside these circuits**; jumps 50 % plyometric, like basketball. `hyrox_competitive` was restructured to the same 2 + 2 (+1 optional) days; OCR keeps 4 cardio sessions by analogy (PROPOSED).

**The year.** The approved gen-pop year (§11.5) stays the default and is fully tunable: an activity block can be dropped where the user wants it (e.g. a pickleball-season block in spring, a HYROX block before a race) (R2-PER-01, R2-PER-02).

**The activities (spec F11r, 26 entries; 04 v1.2 profiles):**

| Activity | Profile | Plyo share at block end | What leads |
|---|---|---|---|
| **Pickleball** | `rec_pickleball` (competitive counterpart `pickleball_competitive`) | 50 % (APPROVED, R3-ATH-04) | lateral first steps, split-step reactions, rotation both ways, single-leg control, calves / Achilles, shoulder and elbow care; **from 50 the racket defaults** (knee-friendly, low-impact jumps, calves every leg day, rotator cuff), from 60 the older-adult defaults too (R3-ATH-02) |
| **HYROX** (fitness / first race) | `hyrox_fitness` (competitive `hyrox_competitive`) | 50 % (APPROVED, R3-ATH-03) | the approved HYROX plan above |
| Tennis; padel; badminton / squash / racquetball / table tennis (routed) | `rec_tennis`; `rec_padel`; → `rec_tennis` | 50 % (padel APPROVED, R3-ATH-04) | as pickleball, bigger court; racket 50+ defaults |
| Golf; disc golf, bowling (routed) | `rec_golf`; → `rec_golf` | 25 % | rotation, hip and trunk, light throws |
| Rec league (basketball, soccer, softball, flag football, volleyball, ice hockey, ultimate, kickball, other) | `rec_basketball`, `rec_soccer`, `rec_softball`, `rec_flag_football`, `rec_volleyball`, `rec_hockey`, `rec_ultimate`, `rec_kickball`, `rec_league` | the league sport's share (rec soccer 60 %) | the league sport's demands; no position; COD sports 30/70 → 20/80 bilateral |
| Running for fitness; trail running (routed) | `run_fitness` | 75 % | tissue capacity, calves / Achilles, single-leg strength; the run is the aerobic work |
| Hiking / rucking | `hike_ruck` | 25 % | carries, step-ups, eccentric quads |
| Cycling / indoor cycling; mountain biking (routed) | `cycling_fitness` | 40 % | hips, trunk, upper-body balance; bone-loading jumps (under 60) |
| Lap swimming | `lap_swim` | 25 % | shoulder care, pulling, legs and bone loading |
| Ski / snowboard season prep | `ski_snow_prep` | 40 % | eccentric quads, lateral work, a pre-season block before the trip |
| Surf / paddle; kayak / wakeboard (routed) | `surf_paddle` | 25 % | pulling, pop-up power, shoulder care |
| Dance and fitness classes | `dance_fitness` | 50 % | landing quality, single-leg control |
| Triathlon for fitness; rowing / indoor rowing | `rec_triathlon`; `rec_rowing` | 75 %; 25 % | the sport is the aerobic work |
| CrossFit-style classes | `crossfit_class` | - | his class model (warm-up → light core → skill → strength / power → WOD) |
| Boxing / kickboxing / martial-arts classes; climbing gym; first obstacle race | `rec_combat_fitness`; `rec_climbing`; `rec_ocr` | 25 %; 25 %; 50 % | rotational throws / antagonist pushing and grip / pulling, grip and carries |
| "A bit of everything" | `weekend_warrior` (his former 'Justice League' program) | 50 % (APPROVED) | "a good mix of everything" |
| Age overlays (automatic from age) | `active_aging_50plus`, `active_aging_60plus`, `youth_general_athletic` | 60+: power work only when switched on | §9.9 |

Recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); "a bit of everything" stays 50 % (APPROVED, R3-ATH-04; 04 flag F5 closed).

**What it is not**: not competitive (no position, no season dates, no pre-/in-season blocks); no contrast complexes by default (L2+ off-season athletes only, ATH-12); not aesthetics (medball throws stay in the main workout); no 1RM or max-mile tests from zero (R2-PER-07); no lifestyle questions (R2-GEN-04); no check-ins (R3-VOL-02).

### 9.11 Swimming (dryland), in short (COACH-CHAT 2026-10-08: "Include swimming as well"; APPROVED R3-ATH-01)

| Item | Rule (04 v1.2 swimming profiles; 06 v1.2 §8.2.5, §8.2.7; 05 sport dial) | Tag |
|---|---|---|
| Profiles | sprint (50-100), middle (200-400 / IM), distance (800-1500 / open water); stroke variants free, back, breast, fly, IM; plus diving, water polo and lap swimming | INFERRED + SCIENCE |
| Week | **3 dryland gym days (A knee + pull, B hip + push, C full) + 1 optional day; 2 (+1 optional) for younger or lower-level swimmers** (read as under about 14 or L1, PROPOSED); pool sessions around them (dryland ≥ 4 h from a hard pool session when possible) | **R3-ATH-01 (APPROVED)** |
| Aerobic | **0 extra gym aerobic sessions by default**: the pool is the aerobic work (the user can add one) | **R3-ATH-01, R3-ATH-04 (APPROVED)**; R2-SES-06 |
| Power | **jumps mostly ballistic: 25 % plyometric at block end (10 % at start)**: starts and turns are single big efforts with long contacts (block ~0.7-0.8 s, wall ~0.3 s); a small ankle block stays for bone; box / squat / broad jumps, streamline squat jumps, overhead and rotational medball throws (4-8 lb) | **R3-ATH-01 (APPROVED)**; R2-ATH-01, R2-ATH-02 |
| Olympic lifts | **2-3 days a week** (hang clean / power clean, single-arm DB snatch; L1 variants); the distance profile avoids the barbell snatch | **R3-ATH-01 (APPROVED)**; ATH-10; R2-ATH-04 |
| Strength | strength 45 % / power 30 % / strength-endurance 15 % / hypertrophy 10 %; **pull sets ≥ 1.5 × push sets**; horizontal pull before vertical (ORD-01); the shoulders group at the floor through the shoulder-care station and presses | INFERRED; ORD-01; R3-VOL-01 |
| Shoulder care | **every dryland session** (A, B, C, and the pre- and in-season lifts): external rotation, floor Y / T raises, KB face pulls; **never bands** (every band move swim dryland usually uses has a DB / cable / KB swap); 04 v1.2 fixed the v1.1 data (it read 2-3 × a week and missed the B day) | **R3-ATH-01 (APPROVED)**; EQ-01; R2-LIB-04, R2-LIB-07 |
| Season | two macrocycles a year (short course Sep-Mar, long course Apr-Aug); off-season dryland stairway blocks → pre-season 4-6 weeks at ~60 % → in-season 2 days → **a 2-week dryland taper lined up with the swim coach's taper before the main championship meet; 1 week or none before smaller meets**; swimmers train through early meets; the meet date comes from F14 | **R3-ATH-01 (APPROVED)**; R2-PER-06; SCIENCE Bosquet 2007, Aouani 2024 |
| Sport load | yardage is **not** asked (no lifestyle / load inputs, R2-GEN-04) and nothing is checked in (R3-VOL-02): after a hard pool week the swimmer or coach switches off that day's jump block, removes an exercise or repeats the week (§10.10) | R2-GEN-04; **R3-VOL-02, R3-SES-02** |
| Sample plan | "Swimming" is the first of the seven sample plans he will grade (R2-GEN-07): competitive high-school / club / college swimmer, middle-distance default, off-season C12 skeleton (or pre-season when the first meet is ≤ 6 weeks away) | R2-GEN-07; mapping PROPOSED |

### 9.12 Pending (athletes)

**Settled by round 3**: swimming dryland days, aerobic default, plyo share and taper (R3-ATH-01); the 60+ on / off defaults and the racket-50+ rules (R3-ATH-02); HYROX reading and plan (R3-ATH-03); shares, aerobic counts and the game-heavy rule for the sports he did not name, recreational players' share (R3-ATH-04); play days, activity cardio credit and the gen-pop event date (R3-ATH-05). **Still PROPOSED / INFERRED**: 'goalkeepers 50 %' read as the field-sport goalkeepers (04 G1); snatch variants out for 60+ (04 G2); the "younger or lower-level swimmer" threshold (04 G3); the racket plyo exclusions applied at every age by the compile step (04 G4, engine fix); HYROX / OCR keeping 4 cardio sessions in the race-specific pre-season (04 G5; OCR by analogy); the game-heavy rule for cheer, gymnastics, competitive pickleball, tennis and wrestling (not asked); contact / throw / Olympic tiers; season multipliers; what "more care for pros" changes; COD in baseball; fight-camp complexes vs ATH-12; Olympic weightlifting's own template; taekwondo class; medball for sports outside ATH-05; neck work; the ath03 group "endurance"; run plans other than the half marathon; sport-specific extras of the stay-active profiles (finger loads for climbers, pressing for combat classes); Spanish sport, position and activity names (approval line by line, R2-GEN-08).

---

## 10. Session and week templates

Full version: `05_session_architecture.md` v1.3 / `05_templates.json` v1.2 (27 observed templates as slot sequences; 30 generator split templates for 2-6 days × 6 families). **v1.3**: the gym days and the athletic days are built on his A / B / C skeletons and push / pull / legs (R4-SES-05); every counted exercise has a rank and every day prints the exercises up to its client type's count (R4-SES-02); nothing is sized or checked by minutes (CT-01). The JSON file was not re-issued: the compiler layer `tools/fixture/v05-structure.mjs` applies the skeletons, and the compiled `model/templates.json` carries them. Block ids, toggles and superset recommendations stay from v1.2. The time-vs-minimums table of 05 §8.7.1 is retired.

### 10.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| W1 | **Core first, for everyone, as a light opener**: 2 exercises × 2 sets, short of failure, right after the warm-up ("that'll give you a good warm-up"); the user may move it; **coaches and users may add core supersets or monster sets anywhere** ("It should be optional to be thrown anywhere"); **the person may switch a day's core block off** (the generator never leaves it out). | ATH-11, VOL-17; **R2-SES-03**; **R3-SES-02** |
| W2 | **Hip dominant + push; knee dominant + pull**, in every session that mixes lower and upper work, full body and bootcamps included. | UNI-11, ORD-06 |
| W3 | **Bootcamp Option 1 Tue/Fri was a mistake**: hinge + push, knee + pull. | ORD-06 |
| W4 | **Two spine days**: **heavy squat one day (Monday), heavy deadlift another day (Friday)**; Tuesday a non-spinal hinge (hip thrust, back extension, reverse hyper); Thursday leg press or belt squat. APPROVED. | PER-04, EQ-11; **R2-SES-01** |
| W5 | **The counted spine list (APPROVED)**: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. **Not counted**: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum: fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. | **R2-SES-02** |
| W6 | **Second weekly exposure of a slot = a different exercise of the same category.** | PER-04 |
| W7 | **Same-pattern pairing** (squat + lunge) to drive a muscle harder; **cross-pattern** (squat + single-leg hinge) for bootcamp and less soreness; **athletes: cross pattern by default, the same-pattern athletic template for size-focused and high-level athletes**. | UNI-06; **R3-SES-01** |
| W8 | **Row before pulldown, horizontal before vertical; 'the work' first; power before strength; small muscle first only as a priority.** | ORD-01..04 |
| W9 | **Warm-up always**; A-drills never count as volume. | ORD-08 |
| W10 | **Supersets** = fatigue and density tool; **recommended per eligible pair** to save time (shown by default; the person switches them on; no session length turns them on). | ORD-05; **R3-SES-02**; CT-01 |
| W11 | **Strength roles**: the work / the accessory / the nuance / the survival. | ORD-07 |
| W12 | **Fighters' and hybrid opening cardio is a real aerobic block.** | ORD-09 |
| W13 | **Optional days** (Calves, Cardio, Core, Focus 1, Focus 2): ideally separate days. | ORD-10, ORD-11 |
| W14 | **Exercises per group on its day.** On his A / B days the template decides: back 2 (row, pulldown), quads 3 (squat, lunge, leg extension), hips 3 (hinge, single-leg hinge, leg curl), chest and shoulders 1-2 (horizontal push; vertical or incline push), biceps or triceps 1. On split days (push, pull, legs): **2-4 on every day a group is trained, never 1** (usually 3-4). The groups are the FOCUS groups (hips = glutes + hamstrings; shoulders = front + side + rear delts). | **R4-SES-05**; VOL-07; R2-SES-05; R3-SES-01 |
| W15 | **Session size by exercise count** (not counting the warm-up or the 2 core exercises): general fitness / fat loss 5-7, aesthetics / bodybuilding 6-8, strength 5-6, bootcamp 5-7 stations, **field athletes off-season up to 12 + the 2-exercise core block**, older adults 5-6; a recommendation the person adds to or takes away from; warm-up drills never count; a superset of two small isolations counts as one. | **R4-SES-02**; VOL-08, VOL-16, VOL-17; R2-SES-04 |
| W16 | **Session length is not an input and not a limit.** The plan prints an average time estimate per day as information. His typical lengths (athletes, bodybuilders, powerlifters and pros about 90 minutes; weight-loss and everyday clients 45 minutes to 1 hour) describe what sessions usually take. | **CT-01; R4-SES-01**; UNI-09 |
| W17 | **Bootcamp** = timed circuits, 3-5 rounds × 30-50 s, 35-45 min; v1.1: **two circuits a day of 4-6 stations** (inside his 5-7), 3 rounds × 35-50 s, so every muscle group gets 2 stations. | PRG-03; R2-SES-05 (application INFERRED) |
| W18 | **Calves one exercise × 3 sets every leg day (never a second calf exercise); a rear-delt exercise every week inside the shoulders group; KB face pulls = the second shoulder exercise on knee + pull days.** | VOL-17; R2-LIB-04, LIB-10; **R3-SES-01, R3-VOL-01** |
| W19 | **PPL weekdays are flexible.** | PRG-02 |
| W20 | **Fat Burn circuits are finishers after lifting.** | PRG-11 |
| W21 | **Contrast** stations for L2+ athletes off-season. | ATH-12 |
| W22 | **No medball for aesthetics** except in the warm-up; **COD for every athlete**; **Olympic work in every athletic week, up to 4 days: clean on knee / squat days, snatch on hip / hinge days**. | ATH-05, ATH-06, ATH-10; **R2-ATH-04** |
| W23 | **Aerobic sessions are adjustable up or down by the user**; the week view carries "less · as planned · more". | **R2-SES-06** |
| W24 | **KB swings are ballistic**: in the power block, never in the non-axial hinge pool. | **R2-VOL-05** |
| W25 | **No deload or maintenance week inside a block** (the week skeleton never inserts one). | **R2-VOL-07** |
| W26 | **Plan editing**: every block has a stable id; a day's athletic, skill, Olympic, core, accessory, calves, focus, finisher or cardio block can be switched off; exercises and blocks can be added or removed (§10.10). | **R3-SES-02** |
| W27 | **No time-fitting.** *(Retired: v1.2's time check of every template against days × minutes, §5.6.1.)* | **CT-01; R4-SES-01** |
| W28 | **Set placement approved**: Monday's first exercise, then Thursday's; a small-muscle bonus exercise on the optional day or on a day that already trains it, never its only exercise that day. | **R3-VOL-03** |
| W29 | **His templates are the skeleton.** A day = pull + knee dominant: horizontal pull (two-arm), squat, vertical pull, lunge, biceps, leg extension. B day = push + hip dominant: horizontal push, hinge / hip extension / hip thrust, vertical or incline push, single-leg hinge, triceps, leg curl. About 6 exercises, up to 8 ("an extra small muscle exercise at the end, or a core"). 4 days = A, B, rest, A, B. Push / pull / legs is the other option. Day layouts are never invented. | **R4-SES-05 (NOT RIGHT + his template)** |
| W30 | **Two days a week = two full-body days** (R5-GEN-01; was: one A day and one B day); every big group trained at about 6-8 weekly sets; the plan suggests a third day. | **R4-SES-03; R5-GEN-01** |
| W31 | **Nothing is dropped automatically**; each day names the easiest things to remove (finisher, extra jump / throw stations, small-muscle accessories). | **R4-SES-04** |
| W32 | **Incline before overhead** in the vertical / mid-range push slot for bodybuilders and the general population; overhead stays a swap. | **R4-LIB-03** |

### 10.2 The session order (v1.2 tiers; every tier is a block)

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
| 8 | Second exercise per group, isolation / Focus | his template's isolation slots (A day: biceps, leg extension; B day: triceps, leg curl; then calves and a side or rear delt as the 7th and 8th exercise, R4-SES-05); on split days the 2nd-4th exercise of each group (R2-SES-05); calves one exercise × 3 sets each leg day; the week's rear-delt station; MYO only last | VOL-17, VOL-15, ORD-04; R2-SES-05; R3-SES-01 |
| 9 | Conditioning | buy-out, circuit, WOD last (HYROX station circuits here, not muscle sets); core supersets / monster sets may sit anywhere | ORD-09, PRG-11; R2-SES-03; R3-ATH-03 |

Every tier is a **block** with a stable id and kind (warm-up, core, skill, athletic, Olympic, strength, accessory, calves, focus, finisher, cardio); the optional kinds can be switched off by the person (§10.10; R3-SES-02).

### 10.3 Pairing, day grammars and the A / B template

| Grammar | Day types | Use | Status |
|---|---|---|---|
| G1 **A / B days** (his full-body "upper / lower"; v1.3 default) | **A = pull + knee dominant**: row, squat, pulldown, lunge, biceps, leg extension (+ calves, rear delt). **B = push + hip dominant**: press, hinge or hip thrust, vertical or incline press, single-leg hinge, triceps, leg curl (+ side delt, calves). The 3-day builder adds a C day (row, squat, press, hinge, lunge + chest, triceps, biceps) | every gym plan of 2-6 days: physique, general fitness, fat loss, no equipment; athletes after their athletic block | **R4-SES-05**; OBSERVED BYOP; UNI-06, UNI-11 |
| G2 CROSS_PATTERN (bootcamp circuits) | A = [BKD \| HPULL] + [UHD \| VPUSH] + a lighter second exercise for each lower group (leg extension, leg curl), as in his BOOTCAMP 1 A day; B mirror | his bootcamp circuit days as written (Bootcamp 1-2-3; rolling A / B). v1.3: gym and athletic days no longer use this grammar; they use the A / B days | OBSERVED; ORD-06; R2-SES-05; R4-SES-05 |
| G3 BASEBALL_PARTS | Mon [BKD \| HPULL] / UHD + biceps + calves; Tue [BHD \| HPUSH] / UKD + triceps + shoulders; Thu / Fri the same with VPULL / VPUSH; **Part F** = each group's second exercise (INFERRED, R2-SES-05) | baseball / softball | OBSERVED; ATH-11 |
| G4 UPPER_LOWER | Lower 1 heavy squat (non-axial hinge); Lower 2 heavy deadlift (leg press); Upper H pull → H push → V pull → V push + arms + side and rear delts | when UL is requested | OBSERVED; R2-SES-01 |
| G5 PPL | push / pull / legs; Legs 1 heavy squat, Legs 2 heavy deadlift; weekdays flexible | 5-6 days, advanced physique; sample plan | PRG-02; R2-SES-01; R2-GEN-07 |
| G6 CONJUGATE_4ROLE | ME lower / ME upper / DE lower / DE upper, each the work → the nuance → the accessory → the survival | strength (kept as written; some muscles have one exercise, flagged) | ORD-07 |
| G7 QUALITY_DAY | CrossFit knee + snatch / pull + clean / hip + snatch / push + clean | CrossFit | OBSERVED |
| G8 ATHLETIC_THEMED | jump day = hip + pushes; medball day = knee + pulls | off-season athlete variant | UNI-11 |
| **G9 CROSSFIT_CLASS** (new) | warm-up → light core → skill → strength / power → WOD; his HALF TIME (class) and FULL TIME (competitor) tables, WOD level and aerobic level | CrossFit-style class and the "CrossFit-style bootcamp" sample plan; HYROX hybrid days (run + stations WOD) | OBSERVED OT17 / OT18; R2-GEN-07 |

**Counting exercises per group (groups APPROVED, R3-SES-01; v1.3 R4-SES-05).** The groups are his FOCUS groups: **hips = glutes + hamstrings** (RDL + hip thrust + leg curl = 3 hip exercises) and **shoulders = front + side + rear delts** (+ traps for display); **calves keep one exercise × 3 sets per leg day**; core = the opener. **On his A / B days the template gives each group its exercises** (so biceps on the A day and triceps on the B day have one); **on split days every group gets 2-4** (R2-SES-05). **Field athletes**: the athletic block, then the A / B lifts without arm isolation, inside 12 + 2 core; athletic stations do not count as resistance exercises; the default leaves 2 jump / throw stations + 1 Olympic lift, and his **same-pattern athletic template** (3-4 jump stations + 1 Olympic lift) is for size-focused and high-level athletes (APPROVED, R3-SES-01). Conjugate four-role days stay as written (flagged). *(Retired: "where a group cannot get 2 exercises on a day ... the time policy decides".)*

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

### 10.5 Session sizes (v1.3: by exercise count; lengths are estimates)

| Session type | Exercises (not counting the warm-up or the 2 core exercises) | Default sets | ID |
|---|---|---|---|
| General fitness / fat loss, gym days | **5-7** (his A / B day; 7 by default) | 3 compound / 2 isolation / 3 calves | **R4-SES-02**; VOL-16 |
| Aesthetics / bodybuilding | **6-8** (his A / B days; push / pull / legs as his sheet) | 3 compound / 2 isolation / 3 calves | **R4-SES-02, R4-SES-05** |
| Strength | **5-6**: the four roles + survival isolations | his template | **R4-SES-02**; ORD-07 |
| Bootcamp | **5-7 stations**; 3 / 4 / 5 rounds by level (PROPOSED) × 35-50 s | time-based | **R4-SES-02**; PRG-03 |
| Field athlete off-season | **up to 12** (jumps / throws + Olympic + lifts) + the 2-exercise core block | **2 per slot** | **R4-SES-02**; VOL-08, VOL-17, VOL-16; R2-SES-04 |
| Non-competitive athletic / stay athletic | 5-10 (his sheet has 10 slots; range PROPOSED) | 2 per slot | ATH-13 |
| Older adults 60+ | **5-6** | as the goal | **R4-SES-02** |
| CrossFit-style class | warm-up → light core → skill → strength / power → WOD; 5-7 lifts around the skill and the WOD (PROPOSED) | his class tables | OBSERVED; R2-GEN-07 |
| In-season athlete | 2 days a week (the 2-day athletic template, in-season variant) | 1-2 | PER-08 |
| Optional day | Focus 1, Focus 2, calves, core, aerobic; bonus exercises land here | Focus 2-3 sets each | ORD-10, ORD-11 |

**Lengths are estimates, never limits** (CT-01, R4-SES-01). Each day prints "Average time: about 60-75 min (an estimate, for information only)"; the arithmetic is in §5.6. "Sometimes it might be 45 minutes. Sometimes they can take off exercises and make it faster. Sometimes they can add exercises and make it longer. We don't need to be counting their time."

**Counting convention** (APPROVED R2-SES-04; R4-SES-02): warm-up drills never count; the 2 core exercises sit outside the count; a superset of two small isolations counts as one station.

**Time vs minimums: RETIRED** (CT-01; §5.6.1). **Time-overflow rule: RETIRED** (round 3). Nothing is cut or reshaped for time, and nothing is dropped automatically (R4-SES-04).


### 10.6 Supersets, contrast and circuits

| Use case (ORD-05) | Who | Trigger |
|---|---|---|
| To save time | anyone | every plan marks its eligible neighbouring pairs "superset suggested"; the person switches them on. No session length switches them on, and none is ever "needed" (R3-SES-02; CT-01) |
| More stimulus | advanced (L3) lifters and athletes | L3 + preference |
| Aerobic capacity | off-season athletes | athletic family + off-season |
| Beginners who don't fatigue | L1 clients | L1 + preference |
| **Core supersets / monster sets** | any session, coach or user choice ("optional to be thrown anywhere") | **R2-SES-03**; coach rule action add_core_superset |

What to pair: the W2 pairs and isolation pairs (biceps + rear delts, triceps + side delts, calves + delts); never two lower compounds; never a heavy lift with a fatiguing lift for the same muscle except contrast. **Contrast** (ATH-12): L2+ off-season, 78-85 %, "immediately" into the jump. **Bootcamp circuits**: two circuits of 4-6 stations, 3 rounds × 35-50 s, ~43-45 min (05 time model); his FAT BURN ramp (3 × 30 s → 5 × 50 s) fits only with fewer stations (05 open question).

### 10.7 The week

- **Shape**: A1, B1, OPT, A2, B2, OPT, OFF for 4-6 days (OBSERVED; R4-SES-05: "Monday: day A. Tuesday: day B. Wednesday: a rest. Thursday: day A again. Friday: day B. Saturday and Sunday: rest ... on Wednesdays and on Saturdays ... they'll do their cardio ... their accessory movements, like their bonuses"); A1/A2 (and B1/B2) are the same day type with **different exercises**: one heavy spine exposure, one non-axial (R2-SES-01). At least one full OFF day. Consecutive days alternate lower dominance.
- **4-day plans become 5-6 days by adding optional days, not more heavy sessions**; in-sport athletes stay at 2-4 days.
- **Frequency**: with ≥ 4 resistance days every lower pattern ≥ 2×/week, push ≥ 2×, pull ≥ 2×; with 2-3 days every primary pattern ≥ 1×; on his A / B days each group gets the exercises his template gives (R4-SES-05); on split days 2-4 (R2-SES-05).
- **Strength**: Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper (OBSERVED). **PPL**: any weekdays. **Bootcamp**: 4 = A, B, aerobic, A, B, aerobic; 5 = rolling A/B (PROPOSED); 6 = Bootcamp 1-2-3, 1-2-3 (OBSERVED). **In season**: 2 days, the hard day ≥ 48 h before a game (R2-ATH-07). **Stay athletic**: gym days placed around the play days, the hardest at least 48 h before the biggest play day (APPROVED, R3-ATH-05).
- **Olympic days**: up to 4 a week; clean on the knee / squat days, snatch on the hip / hinge days (R2-ATH-04).
- **Aerobic placement**: separate days first, add-ons second; counts adjustable (R2-SES-06); never the same colour twice except the aesthetics second Orange.
- **Buy-outs** (OBSERVED BASEBALL Part E): 1-3 short maximal bouts on 2-4 days a week in competitive athletes' and class sessions (v1.3: no longer tied to a session length; PROPOSED); none in recovery weeks.
- **No deload or maintenance week inside a block** (R2-VOL-07); the easy week (recommended, not mandatory) sits between blocks (§11.6; R3-PER-01).

### 10.8 Generator split templates (v1.3: his skeletons; `05_templates.json > generator_split_templates[family][days]` + the compiler layer `tools/fixture/v05-structure.mjs`)

Every day opens with the warm-up and the core opener (2 × 2, movable). Each counted exercise has a rank; a day prints the exercises up to its client type's count (§5.6). `*` = the week's heavy spine exposure, `~` = non-axial.

**The A / B days (COACH-R4 R4-SES-05; slots 7-8 OBSERVED in his BYOP sheets, their order PROPOSED):**

| Slot | A day = pull + knee dominant | B day = push + hip dominant |
|---|---|---|
| 1 | horizontal pull, two-arm (a row) | horizontal push (bench press or machine chest press) |
| 2 | two-leg knee-dominant (a squat) | two-leg hip-dominant (a deadlift, a hip extension or a hip thrust) |
| 3 | vertical pull (a lat pulldown) | vertical push or an incline press ("more vertical than horizontal"); incline first for bodybuilders and the general population (R4-LIB-03) |
| 4 | single-leg knee-dominant (a lunge) | single-leg hip-dominant (staggered-stance DB deadlift, single-leg hip extension, glute bridge) |
| 5 | biceps curl | triceps extension |
| 6 | leg extension | leg curl |
| 7 | calves (3 sets) | side or rear delt |
| 8 | rear delt | calves (3 sets) |

| Family (exercises a session) | 2 days | 3 days | 4 days | 5-6 days |
|---|---|---|---|---|
| Muscle & Physique (6-8) | A, B | his 3-day builder: A, B, C (C = row, squat, press, hinge, lunge + chest, triceps, biceps) | **A1 squat\*, B1 hip thrust~, rest or optional, A2 leg press~, B2 deadlift\*, optional, OFF** (the full-body aesthetics sample plan) | + optional days (Focus 1, Focus 2, calves, cardio); alternative **push / pull / legs × 2** (the PPL sample plan) |
| General fitness / fat loss (5-7) | A, B | Bootcamp 1-2-3 circuits | A, B, aerobic, A, B (gym), or bootcamp circuits (the bootcamp sample plan); FAT BURN finishers | 5 rolling A / B circuits; 6 = Bootcamp 1-2-3 × 2 |
| Athletic Performance (up to 12; non-competitive 5-10) | athletic A, athletic B: the athletic block (a jump station and an Olympic lift first; a throw on A, agility on B), then the A / B lifts without arm isolation; in-season 2-day variant | S1 athletic A (heavy squat), S2 athletic B (non-axial hinge), S3 athletic C (heavy deadlift, push and pull) | A1 / B1 / optional / A2 / B2 / optional / OFF; BASEBALL Parts and HYROX variants as written; swimming dryland 3-4 days | + optional days |
| Strength (5-6) | FB_ME / FB_DE | squat / press / deadlift | ME lower Mon, ME upper Wed, DE lower Thu, DE upper Sat + A / B lead-lift weeks | + optional days |
| Hybrid / CrossFit (class: 5-7 around the skill and the WOD) | HY_1 / HY_2 | class squat / press / deadlift | CrossFit competitor days; **'crossfit_style_bootcamp'** alternative (the CrossFit-style bootcamp sample plan) | HYBRID 5 days; class 6 |
| No equipment | the goal's skeleton filtered by kit; 'NO ACCESS' is not this (R2-LIB-08) | | | |

**Built on his skeletons in v1.3:** the gym days of the physique, fat-loss and no-equipment families, push / pull / legs × 2, and the athletic days with their variants. **Left as written, only ranked:** strength (the work / the accessory / the nuance / the survival), the hybrid and class days, bootcamp circuits, BASEBALL Parts and HYROX. **Laterality:** each slot keeps the laterality his template names (§5.5). **Push / pull / legs** prints in the order of his sheet (flies before dips; leg extension and leg curl before the single-leg hinge). Checks that hold this: the template skeleton and "nothing dropped" (engine check V30), the session size (V13). The v1.2 statement "all 30 templates regenerated with 2-4 exercises per group" is superseded by this table.


### 10.9 Pending (sessions)

**Settled by round 3**: the grouping (hips, shoulders), calves one exercise and the field-athlete layout (R3-SES-01); set placement (R3-VOL-03). **Settled or retired in v1.3**: the session size (R4-SES-02); the full-body day layout (R4-SES-05); very short weeks (the 2-day rule, R4-SES-03); what gets left out (the person picks, R4-SES-04); the time-vs-minimums estimates, the 10 % fit tolerance, the 105 / 120-minute options and the "needed" superset wording (all retired with time-fitting, CT-01); the cross-pattern lighter second exercise on gym days (the A / B template replaces it). **Still PROPOSED** (05 §11.3-11.4): which blocks may be switched off and their ids; the optional-day Calves slot with fewer than 4 leg days; the 7th and 8th exercise of the A / B days and the session-size defaults; whether the athletic days keep each slot's laterality; the incline press in the "Chest / Shoulders" slot and its credit; bootcamp as two circuits vs one 7-station circuit and its rounds by level; conjugate days with one exercise for some muscles; in-season days; rolling A/B for 5-session bootcamp weeks; buy-outs for competitive athletes and classes only; CrossFit WOD days by month or by level; sprints off by default for clients over 60 (treated like jumps); the stay-active, HYROX and swimming session mappings.

### 10.10 Editing the plan: everything is editable (COACH-R3 R3-SES-02; COACH-CX CX-02, CX-04; COACH-R4 R4-SES-04; options APPROVED, mechanism PROPOSED)

"They should be able to turn off that day's athletic training or that day's core training and just focus on resistance. Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves, or their connective tissues just don't feel like doing any plies and things like that. Then it could be turned off, or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly. The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." (R3-SES-02) "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

"This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to. Ideally, the tool is just so great and smart that edits are probably not going to be needed ... it will be editable, but they might not need to most of the time." (CX-04) "should be editable if they want to adjust their sets on that week or that day doesnt matter" (CX-02)

| Control | What it does | Tag |
|---|---|---|
| **Blocks with stable ids** | every block of every day carries an id that does not change between the weeks of an exercise block, e.g. `blk.A.core.1`, `blk.A.athletic.1`, `blk.A.olympic.1`, `blk.A.strength.2`, `blk.B.calves.1`, `blk.A.finisher.1`; items keep their slot ids, added items get `edit.<n>` | R3-SES-02; format PROPOSED (spec `plan_editing.block_ids`) |
| **Block switch (on / off)** | `core`, `skill`, `athletic` (jumps, throws, agility, sprints), `olympic`, `accessory`, `calves`, `focus` (optional-day Focus slots), `finisher` (conditioning finishers and HYROX station circuits) and `cardio` carry `optional: true, toggle: true` (the union of the 05 / 12 and 13 / spec lists, §0.3); the `warmup` cannot be switched off; the `strength` block (05 / 12 `resistance`) is edited exercise by exercise (or removed as a block); default scope "this day every week of the exercise block", or "this day only"; switched-off blocks stay visible, greyed, and print as "(switched off)" | **R3-SES-02**; per-kind flags PROPOSED |
| What a switch changes | athletic, Olympic, core and conditioning work never count as muscle sets (VOL-10), so switching them off changes no stairway and no weekly set number (the opener's abs credit drops for that day); the day's time estimate drops by that block's minutes | VOL-10; R3-SES-02 |
| **Remove an exercise / a block** | removes it (this day or every week of the block); the remaining exercises keep their planned sets and keep climbing; **the sets of a removed exercise are not moved elsewhere automatically** (13 / spec; 12 v1.2 §3.10.2 would move them to the group's other exercises that day - cross-file decision §0.3); when a removal leaves a group with 1 exercise that day, the editor says so; the person's choice wins | R3-SES-02; R2-SES-05; mechanism PROPOSED |
| **Change the sets** (v1.3) | the sets of any exercise, on one day or in one week or for the rest of the block; the weekly sets per group are recomputed from what is now written | **CX-02, CX-04** |
| **Easiest to remove** (v1.3) | each day prints "Easiest to remove if you want a shorter day (your choice)": the conditioning finisher, then extra jump / throw stations, then small-muscle accessories, then bonus exercises; at most 6 names; nothing is removed by the tool | **R4-SES-04** |
| **Optional add-ons** (v1.3) | the plan lists up to 6 optional add-ons that fit the person (joint care for their pain areas, the add-ons marked for their sport, a farmer carry for general and athletic goals); the person adds one with an edit; carries land in the conditioning block and count no muscle sets | **R4-LIB-01, R4-LIB-02**; list size and order PROPOSED |
| **+ Add an exercise / a block** | the list offers only what the generator could have picked for this person (equipment, level, age and pain rules, exclusions; never V-squat, bands or 60+ power work without the switch and its warning); **rear-delt work is always offered on upper days** ("People and coaches should always be able to add more rear delts"); default sets compound 3, isolation 2, calves 3; an added exercise climbs with its group's stairway from the week it is added; blocks: a core superset or monster set anywhere (R2-SES-03), an accessory block, a cardio session | **R3-SES-02, R3-VOL-01**; R2-SES-03 |
| **Swap** | the same-category dropdown (GEN-04); one-detail variations only (R2-LIB-01) | GEN-04 |
| **Superset suggested** | every eligible pair (knee lift + pull, hip lift + push, biceps + rear delts, triceps + side delts, calves + delts, core supersets) carries `{pair_id, items, minutes_saved, on}`; shown by default ("Recommend doing supersets so that it's a faster workout"); the person switches a pair on - no session length does (CT-01); suggested only between neighbouring exercises, so nothing is reordered; never two lower compounds, never a heavy lift with a fatiguing lift for the same muscle (contrast excepted) | **R3-SES-02**; ORD-05 |
| **Reset** | "Reset to the generated plan" undoes every edit | PROPOSED |
| After an edit | the weekly sets per group are **recomputed**; the plan is **marked edited** (`plan.edited = true`, with the list of edits); the checks run again and their result is stamped "edited" - **no old "validated" stamp stays on a changed plan**; where the edit leaves the template's rules (a trained group under its floor, a day without its core block, a day above its exercise count) the tool lists it as a note - **notes, never refusals, and nothing is repaired behind the person's back**: the locked rules bind what the generator builds and what the "add" list offers, not what people take out of their own plan | **CX-04**; R3-VOL-04, R3-SES-02; mechanism PROPOSED |
| Where edits live | inside the plan (`plan.edits[]` on top of the generated plan); they travel with the plan link and the plan file and are printed in every image, PDF and sheet; Blaze Camp keeps nothing | **R3-GEN-01** |
| What every export says | "You can switch off today's jump / throw block or core block, remove or add exercises or blocks, and do the suggested supersets to save time" (copy C17, `edit.hint`), with the optional blocks and suggested supersets marked, so a coach's screenshot tells the client what they can change | **R3-SES-02** |

The generator still builds every plan by the rules first: the core opener every session, the athletic budget, his template complete, calves on leg days, the floor on every trained group from 3 training days, a stairway that reaches its planned final sets. It does not shorten or trim a plan for anyone. The person does that, with the hints above (R4-SES-04). An editable template is not a guarantee that every possible edit follows the rules (CX-04's record). The engine's edit function is `applyPlanEdits(plan, edits, model)` in `engine/edit.mjs` (`set_sets`, `remove_exercise`, `add_exercise`, `set_block`); the generated plan is never changed in place.

---

## 11. Plan types

Full version: `06_periodization.md` v1.3 / `.json` v1.2 (§7 plan-length model with computed curves, §8 skeletons mode × family, §8.2 sports and stay-active, §12 science; every replaced v1.1 object kept under `retired_v1_1`). v1.3 changes only how the stairway arrives (the planned final sets are reached, CX-01, R4-PRG-01, R4-PRG-02), that a week may keep its sets (CX-02, CX-03) and where the next block starts (R4-PRG-04).

### 11.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| P1 | **Every plan is a stairway**: "the steps are a little bit smaller" in the first weeks, "a little bit higher, but not too much" after the halfway point, the hardest weeks last; "that goes for every plan". **Approved in numbers**: about 3 % a week to the halfway week, about 5 % after it, each trained group at its planned final sets in the last week (one week early at most). **v1.3: the final sets are reached even when that takes faster steps; no hard limit; a note on any week that adds more than about 15 %; a week may keep the same sets while reps or load progress.** The v1 8-week "4 adapting + 4 driving" and "start hard" are retired. | **R2-PER-03 (NOT RIGHT to 4 + 4 / start hard)**; **R3-VOL-04 (RIGHT)**; **CX-01, CX-02; R4-PRG-01, R4-PRG-02** |
| P2 | **12-week plan (his preferred)**: "the last 4 weeks are going to be brutal ... week by week, it just gets gradually worse. I mean worse, meaning better, more volume." | PER-01; **R2-PER-04** |
| P3 | **"Start at a 2 and end at an 11"** = the felt level of overall volume and loading, "not the amount of sets"; the last week "a little bit past your limits"; effort 3 → 2 → 1-2 → 1 RIR + intensifiers (approved). Advanced lifters at the ceiling climb by heavier loads, intensifiers and a Focus muscle (or a coach priority push). | PER-01; **R2-PER-05**; **R3-VOL-04** |
| P4 | **Next block after a completed block: each group starts about 5 % above the last block's start, in whole sets, never above the level's top number**; at the top, sets stay and load and reps progress. Nothing is stored, so the person says how many blocks they completed in a row when they build the next one (PROPOSED input). *(Retired: "cap + 1 set".)* | **R4-PRG-04**; R2-VOL-06; R3-GEN-01 |
| P5 | **Week-by-week mode: retired as a mode.** v1.1: "Just keep me in line ... it does it by itself", run on the weekly check-in (R2-GEN-01). Without check-ins, "keep me in line" is served by the year plan (printed whole) or one block after another; the `week_by_week` code opens a 12-week plan on the Week view (PROPOSED). | PER-01; R2-GEN-01; **R3-VOL-02, R3-VOL-04** |
| P6 | **Yearly plan = the general population's "stay in shape" plan**: Jan-Mar hard work + more cardio, start cutting (sets stay at the starting level); Apr-Jun summer shape (keep losing fat while building a little muscle); Jul-Sep maintain at about 70 %; Oct-mid-Dec build muscle, less cardio; last 2 weeks of December maintenance (**printed by default, a recommendation the person can switch off**, R3-PER-01). Athletes follow their season instead. | PER-01; **R2-PER-01 (APPROVED)**; **R3-PER-01** |
| P7 | **The year follows the user's calendar and is fully tunable**: own hemisphere; own vacation and holiday weeks (Christmas, Semana Santa, Thanksgiving ...) **planned between blocks**; a holiday marked after a block has started ends that block there unless the mark is removed; re-order or change blocks; more or less cardio; e.g. a deep-winter powerlifting-style block. | **R2-PER-02**; **R3-PER-01 (APPROVED)** |
| P8 | **Not conjugate or anything set in stone, but with "good sound science behind it".** | PER-01 |
| P9 | **Exercise blocks of 4-6 weeks**; exercises fixed inside; 1-2 small variables or one detail change at the next exercise block. | PER-02; R2-LIB-01 |
| P10 | **No deload or maintenance week inside a block.** "No matter what the athlete puts, they need to be able to manage their block and complete it." | **R2-VOL-07** |
| P11 | **A block that cannot be completed: the person (or coach) stops it** and builds a maintenance plan or a new block; the app no longer offers or asks (the v1.1 block-at-risk offer needed check-ins). | **R2-VOL-07**; **R3-VOL-02, R3-PER-01** |
| P12 | **After a block, an easy week is recommended, not mandatory**: about half the sets of the hardest (last) week, same exercises, 3+ RIR; it is an extra week (a 12-week block + 1 = a 13-week quarter). "Maintenance weeks are a recommendation. They don't have to be mandatory." | PER-05; **R2-VOL-07**; **R3-PER-01 (APPROVED)** |
| P13 | **When a block ends, it ends**: "when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." The plan's last page recommends the easy week and the next block (or a maintenance plan, or something new); maintenance phases have a chosen length (1-8 weeks), 50-70 % of the volume, and also simply end. | PER-01; **R2-PER-06**; **R3-PER-01** |
| P14 | **Pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power, ending with a 1-2-week taper**; its length can be changed. | **R2-PER-06 (APPROVED)** |
| P15 | **Level up a slot when building the next block** if it felt '8 - That was perfect' or easier with no pain: the person's or coach's call (the plan's last page says so; no logs are read). | PER-06; **R3-VOL-02** |
| P16 | **Tests before the block (or week 1) and at the end, never during it; never from zero** (§12). | PER-07; **R2-PER-07** |
| P17 | **Athlete seasons**: off-season most volume; pre-season (P14); in-season ~2 days, low volume (game-heavy reductions, now also for lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball); post-season recovery; swimmers: a 2-week dryland taper with the swim taper before the main meet. | PER-08; R2-ATH-07; **R3-ATH-04, R3-ATH-01** |
| P18 | **His strength %-template and Olympic ramp** are the default for strength-focused plans (Olympic: 3-5 reps on full lifts). | PER-09; R2-ATH-05 |
| P19 | **Smooth weekly increases** for hypertrophy and general clients; **2-week steps and waves** for fight/competition prep. | PER-10 |
| P20 | **VOL 1 → VOL 2 → VOL 3**, one per off-season block. | PER-11 |
| P21 | **Off-season STARTING / MID / ADVANCED** = consecutive blocks or athlete levels, "depends on whatever is needed". | PRG-04 |
| P22 | **Stay-active event date**: the hardest weeks end 1 week before, then 1 easy week at about half the sets. | **R3-ATH-05 (APPROVED)** |

### 11.2 The plan modes (`06 > plan_length_model.modes`; spec `plan_types`)

| Mode | When | Shape | Steps | Easy week / deload | Tests | Tag |
|---|---|---|---|---|---|---|
| **C12** 12-week block (preferred) | default for every goal with ≥ 12 weeks; repeated back-to-back one step up | stairway: ACCLIMATION (L1 1-4, L2 1-3, L3 1-2) → DRIVE to week 8 → **HARDEST 9-12** ("brutal"); exercise blocks 1-4 / 5-8 / 9-12 | 3 % weeks 2-6, 5 % weeks 7-12, λ-scaled (big lines L1 0.76, L2 0.87, L3 0.50) | **none inside**; after it an easy week is recommended | baseline before or in week 1; end test week 12 | R2-PER-03/04/05, R2-VOL-07, R2-PER-07; **steps APPROVED R3-VOL-04**; R3-PER-01 |
| **C8** 8-week block | a shorter plan | the same stairway from the level start: ACCLIMATION (L1 1-3, L2 1-2, L3 1) → DRIVE to week 5 → HARDEST 6-8; exercise blocks 1-4 / 5-8 | 3 % weeks 2-4, 5 % weeks 5-8 as the pattern, λ-scaled to reach the final sets (big groups L1 1.19, L2 1.36, L3 0.78: faster steps where λ is above 1, CX-01) | none inside; easy week after it recommended | baseline / week 1; end test week 8 | R2-PER-03; R3-VOL-04; phase weeks PROPOSED |
| Short training block (4-6 weeks) | inside a tuned year or set by a coach | a stairway with N = 4-6 (§5.4 table) | the 3 % / 5 % pattern, λ-scaled to reach the final sets; weeks that add more than about 15 % carry the note (R4-PRG-02) | none inside | start / end | R2-PER-03 ("that goes for every plan"); PROPOSED |
| **MAINT** maintenance phase | when the person or coach builds one: after a block (a recommendation, not a requirement), vacation, travel, moving, marked holiday weeks, the last 2 weeks of December (printed by default), year Q3, a season change, a stopped block | flat at 50-70 % of the last block's final 4 weeks (not floored); loads kept, sets cut; RIR 2-3; no intensifiers | 0 % | it is the recovery; the next block starts at week 1 | none unless ticked | PER-01; **R2-PER-06** (length chosen 1-8); **R3-PER-01** (recommendation; it simply ends); factor split PROPOSED |
| ~~**WBW** week-by-week~~ | **retired as a mode** (it needed the weekly check-in) | the code opens a 12-week plan on the Week view (PROPOSED) | - | - | - | PER-01; R2-GEN-01; **R3-VOL-02, R3-VOL-04** |
| **YEAR** yearly gen-pop plan | the general population, a plan for the whole year | Q1 12-week block (cut; sets at the starting level) + easy week; Q2 12-week block one step up + easy week; Q3 maintenance ~70 % (13 weeks); Q4 11-week build block; weeks 51-52 maintenance (printed by default); generated once with all its blocks visible; tunable | per block | weeks 13 and 26 easy weeks (recommended); Q3 and weeks 51-52 maintenance | week 1 and the last week of each training block (12, 25, 50) | **R2-PER-01, R2-PER-02**; **R3-PER-01**; layout PROPOSED |
| **PREP** event / fight / competition | a fight, meet, race, show or tournament date | fights and meets: 2-week steps and waves (OBSERVED boxer); **gen-pop events (HYROX race, tournament, 10K): the normal stairway timed so its hardest weeks end 1 week before, then 1 easy week at about half the sets** | same average step | taper (1-2 weeks; gen pop 1) | the event | PER-10; COACH-CHAT 2026-10-08; **R3-ATH-05 (APPROVED)** |
| **SEASON** competitive athlete | sport, position, season start date, practice and game days | off-season stairway blocks (VOL 1 → 3) → **pre-season 4-6 weeks ~60 %, speed/power, 1-2-week taper** → in-season 2 days (game-heavy rule) → post-season recovery; the plan is printed once from the season dates (off-season blocks + pre-season to the first game), then the athlete builds the in-season plan (PROPOSED) | off-season stairway; pre- and in-season flat | easy week between off-season blocks (recommended); taper ends the pre-season; swimmers: 2-week dryland taper with the swim taper before the main meet | start and end of each off-season block | PER-08, PER-11, PRG-04, UNI-10; **R2-GEN-05, R2-PER-06, R2-ATH-07**; **R3-ATH-01, R3-ATH-04, R3-PER-01** |

### 11.3 Reference curves (one big muscle; v1.3: computed with the engine kernel, `engine/progression/stairway.mjs`)

**12-week block** (computed once; no check-in, R3-VOL-02; steps APPROVED, R3-VOL-04):

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Stair level (display) | 2 | 2.6 | 3.2 | 3.8 | 4.4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| L1 phase | acc | acc | acc | acc | drive | drive | drive | drive | **hard** | **hard** | **hard** | **hard** |
| L1 sets (λ 0.76) | 10 | 10 | 10 | 11 | 11 | 11 | 12 | 12 | 13 | 13 | 13 | 14 |
| L2 phase | acc | acc | acc | drive | drive | drive | drive | drive | **hard** | **hard** | **hard** | **hard** |
| L2 sets (λ 0.87) | 15 | 15 | 16 | 16 | 17 | 17 | 18 | 19 | 19 | 20 | 21 | 22 |
| L3 phase | acc | acc | drive | drive | drive | drive | drive | drive | **hard** | **hard** | **hard** | **hard** |
| L3 sets (λ 0.50) | 20 | 20 | 21 | 21 | 21 | 22 | 22 | 23 | 23 | 24 | 24 | 25 |
| Planned RIR (inside 1-3, APPROVED R3-VOL-04) | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 1-2 | 1-2 | 1 + intensifiers |
| Receive-Create stage (athletes) | RC1 | RC1 | RC1 | RC2 | RC2 | RC2 | RC2 | RC3 | RC3 | RC3 | RC3 | RC3 |
| Events | baseline test; exercise block 1 | | | | exercise block 2 (one-detail changes; BB/PL 50/50 → 80/20) | | bigger steps from here | | exercise block 3; HARDEST | | | the "11"; end test; the block ends (last page: easy week recommended, then build the next) |

**8-week block** (from the level start; no × 1.10; v1.3: every level reaches its final sets): L1 (λ 1.19) 10 · 10 · 11 · 11 · 12 · 12 · 13 · 14; L2 (λ 1.36) 15 · 16 · 16 · 17 · 18 · 19 · 21 · 22; L3 (λ 0.78) 20 · 20 · 21 · 21 · 22 · 23 · 24 · 25; stair 2 · 2.9 · 3.9 · 4.8 · 6.3 · 7.9 · 9.4 · 11; RIR 3 · 3 · 3 · 3 · 2 · 2 · 1-2 · 1 + intensifiers; RC1 weeks 1-2, RC2 3-5, RC3 6-8.

**Reading.** L1 and L2 climb 40 % and 47 % and L3 25 %, on 12 weeks and on 8. λ lands every level on its planned final sets in the last week, so the biggest weeks are the last ones. On 12 weeks the first sets arrive in weeks 3-4 and no week adds more than one set to a big group; on 8 weeks the same climb takes faster steps (L2 adds 2 sets into week 7, +10.5 %). Every week at least one dial moves up (a set, the load or reps, or the RIR target) (PROPOSED, from R2-PER-04/05); a week that keeps its sets is fine when reps or load move (CX-02). The whole sets are rounded half up and held one set under the top until the last week (R4-PRG-01). *(Retired: the total-rise check under 10 % and release staggering; the v1.2 rows differed by a set in a few early weeks because v1.2 banked the fraction instead of rounding it.)*

### 11.4 Repeated blocks (P4; COACH-R4 R4-PRG-04)

| Level (top) | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|
| L1 (14) | 10 → 14 (λ 0.76) | 11 → 14 (λ 0.54) | 12 → 14 (λ 0.35) | 13 → 14 (λ 0.17) |
| L2 (22) | 15 → 22 (λ 0.87) | 16 → 22 (λ 0.72) | 17 → 22 (λ 0.58) | 18 → 22 (λ 0.45) |
| L3 (25) | 20 → 25 (λ 0.50) | 21 → 25 (λ 0.39) | 22 → 25 (λ 0.29) | 23 → 25 (λ 0.19) |

Each completed block raises the start by about 5 % (one whole set at these numbers; at least one set while below the top, PROPOSED) and **the top does not move**: "never above the level's top number" (R4-PRG-04). So the steps get smaller as the start nears the top, and a group that starts at its top (L1 after four blocks: 14 → 14) keeps its sets while load and reps carry the progress (CX-03). For advanced lifters "one level higher" comes from heavier loads, intensifiers (MYO, supersets), a Focus muscle or a coach priority push up to 30 (APPROVED, R2-PER-05; R3-SES-01), or moving up a level; the optional Pro setting goes above 30 (R2-VOL-06, PROPOSED numbers). Nothing is stored, so the rebuild asks how many blocks were completed in a row (PROPOSED). After a **stopped** block the start repeats (PROPOSED). *(Retired: v1.2's "cap + 1" per block, which ran L1 to 13 → 17 and L2 to 18 → 25 by block 4.)*


### 11.5 The yearly gen-pop plan ("stay in shape"; APPROVED R2-PER-01, tunable R2-PER-02)

| Quarter | Weeks | Theme (approved) | Resistance (layout PROPOSED) | Aerobic | Last week / tests |
|---|---|---|---|---|---|
| Q1 Jan-Mar | 1-13 | **hard work + more cardio, start cutting** | 12-week block, **sets stay at the starting level** (no set stairway in the cut); the stair climbs by cardio, density (finisher circuits, supersets), load and RIR; HARDEST 9-12 | goal default + 1 (e.g. 3 → 4) | week 13 easy week (recommended); test week 12 if ticked |
| Q2 Apr-Jun | 14-26 | **summer shape: keep losing fat while building a little muscle** | 12-week stairway one step up (start about 5 % higher, the same top; R4-PRG-04); HARDEST 22-25 | goal default | week 26 easy week (recommended); test week 25 |
| Q3 Jul-Sep | 27-39 | **maintain at about 70 % of the volume** | maintenance phase, 70 % of Q2's final 4 weeks, flat, RIR 2-3; one exercise change mid-quarter (PROPOSED) | goal default; outdoor activity counts | - |
| Q4 Oct-mid-Dec | 40-50 | **build muscle, less cardio** | 11-week stairway one more step up (priorities allowed); ACCLIMATION 40-42, DRIVE 43-46, HARDEST 47-50; no easy week before it (Q3 was maintenance) | goal default − 1 (min 2) + optional walks | test week 50 |
| Holidays | 51-52 | **maintenance (printed by default; a recommendation the person can switch off, R3-PER-01)** | about 60 % (50-70 %) of Q4's final 4 weeks; any equipment | walks / any activity | - |

**Tuning (R2-PER-02).** Hemisphere: southern-hemisphere users shift the year by 6 months (PROPOSED shift); own holiday and vacation weeks are marked by the user, switch to maintenance and are placed **between blocks** (blocks shortened or shifted, never below 4 weeks; a week marked after a block has started ends that block there unless the mark is removed: APPROVED, R3-PER-01); drag blocks to other quarters or change a block's goal (build, cut, maintain, athletic, strength); more or less cardio per block; a winter strength block (the STRENGTH %-template inside the stairway, less cardio); a "stay athletic" activity block or an event peak (§9.10). Guardrails that stay: every training block is a stairway; no maintenance inside a block; an easy week between two back-to-back blocks, recommended (R3-PER-01); the floor of 10 inside training blocks. The Q1 cut keeps flat sets (settled in v1.3: a block may keep its sets while reps, load and cardio progress, COACH-CX CX-02; §0c.3 #5); a switched-off easy week moves the next block a week earlier (§0c.3 #16, PROPOSED).

**A year for an L2 reference big muscle** (computed; layout PROPOSED): Q1 weeks 1-12 at 15; week 13 easy week 8; Q2 weeks 14-25: 16 · 16 · 16 · 17 · 17 · 18 · 18 · 19 · 20 · 21 · 22 · 23; week 26 easy week 12; Q3 weeks 27-39 at 15 (70 % of 21.5); Q4 weeks 40-50: 17 · 17 · 17 · 18 · 18 · 19 · 20 · 21 · 22 · 22 · 24; weeks 51-52 at 13 (60 % of 22.25).

### 11.6 Blocks, the easy week, maintenance, taper and transitions (06 v1.2 §6, §7.0.2)

```
TRAINING BLOCK (a stairway: week 1 feels like a '2' ... the last week feels like an '11'), built once and shown whole
  baseline test before the block or in week 1 (if ticked; submax if no completed block)
  weeks run in order; NO deload or maintenance week inside; the person may edit the plan (switch blocks off, swap,
  remove or add exercises, repeat a week) - the printed stairway itself never changes                (R2-VOL-07; R3-SES-02)
  |
  +-- block ends (its last week, with the end test if ticked) -> THE BLOCK ENDS (R3-PER-01)
  |      the plan's last page (copy plan.next_steps) recommends:
  |        (a) an easy week (about half the sets of the hardest week, same exercises, 3+ RIR) - recommended, not required
  |            -> then build the next block: each group about 5 % above its last start, never above the top (R4-PRG-04)
  |        (b) or build a maintenance plan (choose its weeks, 1-8)
  |        (c) or build something new
  |      building again = the intake again, with the own-risk + terms + release tick (R3-GEN-01)
  |
  +-- the person stops the block early (their call or their coach's; no app signals, no offer)      (R3-VOL-02, R3-PER-01)
  |      -> build a maintenance plan (weeks chosen) or a new block at the SAME start ("Did you finish your last block? No")
  |
  +-- a holiday marked after the block has started -> that block ends there (then maintenance or the easy week, then a new
         block the person builds) unless the mark is removed                                               (R3-PER-01)

MAINTENANCE PHASE (built by the person; flat; 50-70 %) -> it ends; the printed note says: keep maintaining, change the plan,
  or start a training block (his three options; no in-app prompt)                                           (R2-PER-06; R3-PER-01)
```

| Rule | v1.2 | Tag |
|---|---|---|
| Nothing inside a block | no deload and no maintenance week is ever inserted into a block; the printed stairway runs unchanged; a person may still repeat a week or swap a painful exercise themselves (R3-SES-02 editing) | **R2-VOL-07**; R3-VOL-02 |
| Stopping a block | the person's or coach's call; no automatic offer (the v1.1 block-at-risk offer and its triggers - 2 holds, effort 9-10, under half the sessions, pain on 2+ exercises - needed check-ins and are retired) | R2-VOL-07; **R3-VOL-02, R3-PER-01** |
| Easy week (after a block) | **recommended, not mandatory**: about **half the sets of the hardest (last) week** (round up, min 1 per exercise), same exercises, lighter load or 3+ RIR, no buy-outs, finishers, MYO or supersets; plyos only low-amplitude landings at about half the contacts; Olympic lifts at half the sets with light technique loads; conditioning Orange only; **an extra week** (a 12-week block + 1 = a 13-week quarter); none when a maintenance phase follows | PER-05; **R2-VOL-07** (dose); **R3-PER-01 (APPROVED + "a recommendation")**; athletic details PROPOSED |
| Maintenance phase | length chosen (default 4, 1-8); to extend it, rebuild with more weeks; 50 % vacation / limited kit / marked holiday weeks, 60 % travel / moving / season change / after a stopped block, 70 % planned maintenance and year Q3; older adults ≥ 70 %; flat, RIR 2-3; not floored; it ends like every plan (printed next steps) | PER-01; **R2-PER-06**; **R3-PER-01**; factors PROPOSED |
| Vacation and holiday weeks | **planned between blocks**; a week marked after a block started ends that block unless the mark is removed; December weeks 51-52 printed as maintenance by default (switchable) | PER-01; R2-PER-02, R2-VOL-07; **R3-PER-01 (APPROVED)** |
| Taper | the last 1-2 weeks before a season opener, event or fight: volume about -40-60 %, intensity and frequency kept, no new exercises; athletes inside the 4-6-week pre-season; **swimmers' main championship meet: 2 weeks lined up with the pool taper, 1 week or none before smaller meets (APPROVED, R3-ATH-01)**; **gen-pop events: 1 easy week at about half the sets after the hardest weeks end (APPROVED, R3-ATH-05)** | **R2-PER-06**; **R3-ATH-01, R3-ATH-05**; SCIENCE Bosquet 2007, Pritchard 2016, Aouani 2024 |
| Post-season recovery week | arm care, mobility, easy aerobic, no main lifts (OBSERVED baseball 'wk 8'), then general work or a maintenance phase | OBSERVED; PER-08 |
| In-season | no planned deload; flat; game-heavy rule; heavy game weeks keep only the light day (PROPOSED) | PER-08, UNI-10; R2-ATH-07; R3-ATH-04 |
| Next block | after a completed block: each group starts about 5 % above the last block's start, in whole sets, never above the level's top; at the top the sets stay and load and reps progress; after a stopped block: the same start (PROPOSED); the person answers "blocks completed in a row" at the rebuild (nothing stored) | **R4-PRG-04**; R2-VOL-06; R3-GEN-01 |
| Retired | v0 fixed deloads; v1 triggered mid-block deloads (D6) and "resume at the volume of 2 weeks before"; "week 1 of the next cycle is a deload" inside the next block's 12 weeks; 8-week "start hard"; **v1.2**: the block-at-risk offer, the repeat week from check-ins (D13), the end-of-maintenance prompt, the mandatory recovery week, the week-by-week mode | R2-VOL-07, R2-PER-03; **R3-VOL-02, R3-PER-01** |

### 11.7 The science behind each shape (06 §7.7, §12)

| Shape | Evidence | Verdict |
|---|---|---|
| Gradual stairway, small steps first | Damas 2016 (hypertrophy signal mostly after ~3 weeks once damage drops); repeated-bout effect; big jumps add strain without more growth (Barsuhn 2024, Enes 2023/24) | supported |
| Hardest weeks last | more weekly sets → more growth with diminishing returns (Pelland 2026); periodization model matters little when volume is equal (Grgic 2017, Moesgaard 2022); planned beats unplanned for strength (Williams 2017) | supported: volume ramp to a level cap, then load / intensity |
| No deload inside a block; deload between blocks | deloads in practice every ~5.6 weeks (Rogerson 2024); planned or autoregulated both acceptable (Bell 2023); a mid-program week off did not change growth (Coleman 2024) | plausible; his rule keeps blocks whole and puts recovery between them |
| Maintenance 50-70 % | Bickel 2011, Spiering 2021, Bosquet 2013, Ogasawara 2013 | well supported; older ≥ 70 % |
| Repeat blocks one level higher | Scarpelli 2022; Pelland 2026 | supported with a ceiling |
| Week-by-week (retired as a mode, R3-VOL-02) | responsive planning (Kiely 2012); autoregulation ≈ % plans (Hickmott 2022) | the RIR cue gives load autoregulation inside a fixed, printed plan; no check-ins |
| Yearly + holidays | no controlled annual trials for general clients (Afonso 2017); cut phases protect rather than grow muscle (Murphy & Koehler 2022); holiday weight gain small but persistent (Yanovski 2000) | a coaching choice with sensible support |
| Pre-season taper | Bosquet 2007 meta-analysis (about 2 weeks, volume -41-60 %, intensity kept); swimming taper (Aouani 2024) | supported |
| Testing from 5RM, not 1RM, when untrained | a 5RM predicts the 1RM well (Reynolds 2006) | supported |

### 11.8 Pending (plans)

**Settled by round 3**: the easy week as an extra week and only a recommendation (R3-PER-01); holidays between blocks and a mark inside a running block ending it (R3-PER-01); the gen-pop event date (R3-ATH-05); the swimming championship taper (R3-ATH-01); the block-at-risk triggers, the repeat-week rule and 06 D12's "mostly holds" rule (retired with the check-in, R3-VOL-02). **Still PROPOSED** (06 §14.5): the week-by-week alias; the rebuild input ("blocks completed in a row"); a switched-off easy week moving the next block a week earlier; the printed athlete season plan; the Q1 cut reading; ceiling vs step size; phase weeks of the 8-week plan; the stair-level number; the maintenance factor split; the same start after a stopped block; the PRG-04 decision rule; fight-camp complexes vs ATH-12; the rest-of-test-week dose; the hemisphere shift; release staggering.

---

## 12. Testing

### 12.1 Confirmed rules

| # | Rule | ID |
|---|---|---|
| X1 | The athlete or coach picks what to test **at the start of a block** by checkbox (strength, cardio, speed and agility, jumps, body weight), or "No need for testing". **The menu is approved.** | PER-07; **R2-PER-07** |
| X2 | **Test before the block (or at its beginning) and at the end; never during the block** ("they should not test during the weeks, during the block"). The end test replaces that week's top sets. | **R2-PER-07** |
| X3 | **Never from zero**: anyone who has not finished a block of training (new, untrained, or back after 6+ months off) never tests a 1-rep max or a max-effort mile; strength by a 5-rep max (or 3-rep max), cardio and speed at 80-90 % effort ("not at 100%"). | **R2-PER-07** |
| X4 | **Reminders** at block start, 7 days before and the day before ("All right, it's time for your test. Get ready."), APPROVED - **printed in the plan and set as alarms in the downloaded calendar file; no notifications, nothing stored**. | PER-07; R2-PER-07; **R3-GEN-01** |
| X5 | Test items in his library: 'LEFT TEST' = L-test (3-cone); '5/10/05' = 5-10-5 pro agility; CARDIO 'DISTANCE TEST' / 'SPEED TEST'; 'LVL 5 = Work up to 1RM' (CrossFit). | LIB-01, OBSERVED |
| X6 | **The '21.6 mile run' is removed from plans and tests**; the longest run is the half-marathon plan (Chris Hinshaw), used as-is. | **R2-LIB-06** |
| X7 | 'WEIGHT USED or SCORE': SCORE = times, rounds or distances for conditioning. | PRG-08 |
| X8 | Aerobic tests on any erg, tracked by distance, calories or time. | EQ-14 |

### 12.2 Test menu (06 §6.1; APPROVED menu, doses PROPOSED)

| Checkbox | Options | From zero (no completed block) | Notes |
|---|---|---|---|
| Strength | beginners a 5-8-rep max (5RM default); intermediate and up a 3RM or 'Work up to 1RM' **only at the end of a completed block**; e1RM (Epley) from the rep max (the person's own result) | 5RM or 3RM (beginners 5-8RM); never a 1RM | pros: no true 1RM (PROPOSED); 60+: submax only (PROPOSED); SCIENCE Reynolds 2006 |
| Cardio | 1-mile run or an erg time trial (calories, time or distance); the CARDIO list 'DISTANCE TEST' / 'SPEED TEST' | 80-90 % effort (e.g. a 1-mile at a hard but controlled pace); never an all-out mile | the 21.6-mile item is removed; the 14 / 17 / 20-mile distance items are not offered by default (PROPOSED, §4.6) |
| Speed / agility | 10-30 m sprint, 5-10-5, L-test | 80-90 % | athletes |
| Jumps | countermovement or broad jump | as is | athletes; not for 60+ by default (R2-ATH-08) |
| Body | body weight, optional photos or girths | - | photos PROPOSED |
| None | "No need for testing" (default) | - | - |

**When**: 12-week block: baseline before or in week 1 (the light "2" week), end test in week 12; 8-week: week 1 and week 8; maintenance: none unless ticked; year: week 1 and the last week of each training block (12, 25, 50); athletes: start and end of each off-season block. The previous block's end test is the next block's baseline. The rest of the test week runs at about 50-70 % of its sets; strength tests 48-72 h after the last hard lower session (PROPOSED). Every plan prints the test weeks and a "get ready" line in the week before; the calendar file carries the alarms; a screenshot of the block shows the test weeks (R2-GEN-02); the results are the person's own (nothing comes back, R3-GEN-01).

### 12.3 Pending (testing)

The rest-of-test-week dose and spacing (PROPOSED); how a tested best the person enters at the next build feeds % prescriptions (barbell main lifts with a recent tested best; Olympic lifts only with a coach opt-in, §9.5); the 14 / 17 / 20-mile CARDIO items; the borrowed half-marathon plan keeps its own cut-back weeks and max-effort mile tests as written, while the Blaze strength block beside it follows the stairway and tests only at start and end (PROPOSED; 04 aquatic O7).

---

## 13. The generator

Machine-readable twin: `generator_spec_v1.json` 1.3.0 (inputs schema `intake/3` with EN/ES i18n keys and LEGAL REVIEW copy placeholders, the session-length field retired; derived values D1-D14, D15 retired; rule tables with the v1.3 objects - session size, no time-fitting, the 2-day rule, the endpoint stairway, allocation, the library rules; template references with his skeletons; plan types; `plan_editing`; `legal_and_privacy` with the liability gate, the release line and the credit; coach-rule hooks; validation checks; output views). `adaptation` is a RETIRED stub, kept empty only because the compiler still reads it. The working implementation is `engine/` 0.5.0 on the compiled `model/` 1.3.0; it is experimental (R4-REL-01). The large two-stage planner in `design/PLANNER_SPEC.md` is not built and is not planned: it stays as research. Everything below follows the coach's answers; mechanisms he did not specify are PROPOSED.

### 13.1 Confirmed product rules

| # | Rule | ID |
|---|---|---|
| G1 | **Users**: clients, coaches, trainers, strength and conditioning coaches, anyone. | GEN-01 |
| G2 | **Language**: English first with a full Spanish toggle; **neutral Latin American Spanish with the English gym word in brackets; he or a coach he trusts approves every line; legal texts legally equivalent in both languages; pounds in the US, kilograms elsewhere, switchable.** | GEN-01; **R2-GEN-08**; **R3-GEN-01** |
| G3 | **Intake**: no sex field; **no session-length question** (R4-SES-01); **training experience in years**; body weight; competitive sport → sport, position, **season start date + practice and game days**; recreational → the activity only (+ optional play days and event date). | GEN-02; **R2-GEN-05**; R3-ATH-05; **CT-01, R4-SES-01** |
| G4 | **The product path (v1.2)**: a phone-friendly website (not an app) that builds the whole plan, lets people edit it and exports it; then open source under **MIT**. No check-in phase, no accounts, no learning phase (the v1.1 path "website → weekly check-in → open source under Apache-2.0 / CC BY 4.0" is retired). | GEN-03; R2-GEN-02; **R3-VOL-02, R3-VOL-04, R3-GEN-01** |
| G5 | **Fewest clicks, phone first, macro views of the block, the week and the day with easy visibility toggles; a coach can screenshot a whole 12-week block or one week and send it.** | **R2-GEN-02** |
| G6 | **Videos are optional and never third-party links**: every exercise has a "search this exercise on YouTube" link built from its name, and the exact name can be copied with one tap ("Click here to copy it and put into YouTube"); his own videos are added as they exist; "send us your video". | **R2-GEN-02**; **R4-LIB-05** |
| G7 | **Health check (APPROVED route)**: clients answer a **short Blaze Camp health check written by a lawyer in English and Spanish** (his five refer items: chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said no - plus the usual PAR-Q topics) **with a link to the official PAR-Q+** (copyrighted, used unchanged, no Spanish version); any refer answer → the plan is still built, with a health warning (before round 5: no automatic plan) (**v1.4, COACH-R5 R5-GEN-02 "It doesn't stop because we're not taking on any liability, but it should warn them" - the plan is built with a clear health warning, EN / ES, [LEGAL REVIEW]; it never names which answer was a yes; severe pain is planned with the moderate pain rules and the same warning, PROPOSED**). **Coaches run it with their client or skip it** with the legal warning to follow their own onboarding. | **R2-GEN-03**; **R3-GEN-01**; **R5-GEN-02** |
| G8 | **Terms + release of liability + own risk: required before every build.** Everyone may use the plans on their own (R4-SCP-01). Everyone, client or coach, accepts **one unticked box** ("I accept the Terms and the Release of Liability, and I use this plan at my own risk") every time a plan is built or rebuilt, including the start of each new block (not when a saved plan is just reopened); a parent or guardian accepts for anyone under 18. **Without it no plan is generated** ("they need to click it before the plan shows"). **A short release line is printed on every plan** - at the top and the bottom of a full plan, and as a short line on every block, week and day view - in English and Spanish, with the link to `DISCLAIMER.md` / `DISCLAIMER.es.md` ("you've released liability"). The record (text version, language, role, date, plan id, health route, accepted) is **printed on the plan and every export, never stored**. The wording is a draft for attorney review. | **R4-SCP-01, R4-SCP-02 (PARTLY)**; R2-GEN-03; R3-GEN-01 |
| G9 | **Workouts only: no sleep, stress, job or other lifestyle questions**, anywhere. | **R2-GEN-04 (NOT RIGHT to the 3 taps)** |
| G10 | **Default exercise in every slot + dropdowns** to swap within the category. | GEN-04 |
| G11 | **No check-ins, no tracking, no adaptive inputs**: the plan is built once and shown whole; people and coaches change it themselves (G23) or build a new one. | GEN-03; **R3-VOL-02, R3-VOL-04** (retire GEN-05's "adjust from logs" and R2-GEN-01's optional check-in) |
| G12 | **Weight guidance by reps in reserve (with the RPE number)**, a week-1 tip and the approved drift (3 → 2 → 1-2 → 1 RIR + intensifiers); % only with a recent tested best; **Olympic lifts explained as power output**. **Reps and load progress by a rule the person applies** ("When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8"), never a promised number per week. | **R2-GEN-06**; R3-VOL-04; **R4-PRG-03** |
| G13 | **A short cue per exercise in his voice + his instruction block at the top** (now with a "How to adjust this plan" part). | GEN-07; R3-VOL-04 |
| G14 | **Hard rules**: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped by the generator (the person may switch a day's core block off); **and coaches can add their own rules**. | GEN-08; R3-SES-02 |
| G15 | **Plan types offered**: 12 weeks (recommended), 8 weeks, maintenance (weeks chosen), a full year (non-competitive goals; tunable); athletes get a season plan; stay-active users may add an event date. **Week by week is retired as a mode** (the code opens a 12-week plan on the Week view, PROPOSED). Tests by checkbox, before and at the end. | PER-01, PER-07; R2-PER-01/02/06/07; **R3-VOL-02, R3-VOL-04, R3-ATH-05** |
| G16 | **Levels explained in plain words**; ex-pros at L1 only briefly. | PRG-05 |
| G17 | **Generic, understandable program names**; spelling corrected in the generator only. | FIX-03, FIX-04 |
| G18 | **Client preference can choose between alternatives**; core block movable; optional days separate or added on; A/B variety weeks; **cardio more or less**; **Focus muscles**; **60+ and racket-50+ power-work switches with the warning**; superset suggestions shown or hidden. | EQ-10, ATH-11, ORD-10, PER-03; R2-SES-06, R2-ATH-08; **R3-SES-01, R3-ATH-02, R3-SES-02** |
| G19 | **The tool computes the percentages; it does not learn from users** (nothing is kept; the model changes only through the coach's reviews). | VOL-06; **R3-GEN-01** (supersedes VOL-01) |
| G20 | **Every popular US sport in the picker, swimming included, and a "Stay athletic and active" door** (pickleball, HYROX ...). | **COACH-CHAT 2026-10-08** |
| G21 | **He will grade seven sample plans** (swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs; a pickleball gen-pop bonus sample exists); his grades become automatic tests. | **R2-GEN-07** |
| G22 | **No data kept, anywhere**: no accounts, no server database, no email field, no analytics with personal fields; the engine runs in the browser on static files; the person keeps the plan as an image, PDF, sheet, plan link (the plan packed after "#") or plan file; health answers are used on screen for that build only. | **R3-GEN-01** |
| G23 | **Everything is editable**: every block has a stable id and a kind; a day's **athletic block or core block can be switched off** (also skill, Olympic, accessory, calves, focus, finisher, cardio); **exercises and whole blocks can be added or removed**; **the sets of any day or week can be changed**; **supersets are recommended** per eligible pair; a switched-off block prints as "(switched off)"; every export says what can be switched off; after an edit the totals are recomputed and the plan is marked edited; edits travel inside the plan; "Reset" undoes them. | **R3-SES-02**; **CX-02, CX-04**; R3-VOL-01 ("add more rear delts") |
| G24 | **Focus muscle 1 and Focus muscle 2** (optional, max 2) on the goal screen: +1 to +3 extra weekly sets each over a balanced plan; one "Shoulders" choice covers front, side and rear delts. | **R3-SES-01**, R3-VOL-01 |
| G25 | **Sized by exercises, not minutes.** No session length is asked and no time check runs. Each day prints an average time estimate as information. With 2 training days the plan says that every big group gets about 6-8 weekly sets and suggests a third day. *(Retired: the v1.2 time check and its offers.)* | **CT-01; R4-SES-01, R4-SES-02, R4-SES-03** |
| G26 | **The last page says what's next**: the block ends here; recommended: one easy week at about half the sets, then build the next block (one step up); or a maintenance plan; or something new; plan holidays between blocks. | **R3-PER-01** |
| G27 | **The repository**: `LICENSE` = MIT, "Copyright (c) 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation)"; `DISCLAIMER.md` and `DISCLAIMER.es.md` (drafts for a Florida attorney, legally equivalent EN / ES): use at your own expense and risk, not medical advice, no warranty, release of liability, coaches using it for clients need their own release, minors, no data collection. MIT grants no trademark rights in the Blaze Camp name. **How it describes itself (R4-REL-03):** a complete coaching model from the experience of Coach Lalo (Gerardo Vera), Master NASM coach - his intellectual property, his way of condensing and consolidating how he puts programming together - free for anyone to build on; no "world's best" and no injury-prevention claims. **What is released (R4-REL-01):** model v1.3 = library + categories + rules + sport profiles + his answers + docs; the plan-writing engine stays in the repository marked experimental. | **R3-GEN-01**; **R4-REL-01, R4-REL-03** |
| G28 | **Nothing is dropped and everything is said.** The template comes out complete. What it cannot hold is printed in plain words; each day names the easiest things to remove; the person decides. | **R4-SES-04**; CX-04 |

### 13.2 Intake form v1.3 (`generator_spec_v1.json > inputs_schema`, `intake/3`; the session-length field is retired)

One question per screen with big auto-advancing buttons, defaults, and "More options" folded away (R2-GEN-02). Every label and option has an i18n key with EN and ES strings (Spanish PROPOSED, to be approved, R2-GEN-08). Start flow (12 steps): landing (language, units; "Not medical advice. Use at your own risk. Blaze Camp keeps nothing you enter.") → role → health → about you → goal (+ Focus muscles) → sport or activity (+ play days, event date) → schedule (training days and weekdays; **no session length**, R4-SES-01) → plan type and tests → equipment → pain → more options → terms, release and own risk + Build. **The terms and the release must be accepted or no plan is generated** (R4-SCP-02). **Nothing is asked after the build** (R3-VOL-02, R3-VOL-04).

| Field | EN label / ES label | Type and options | Shown if / required | Source |
|---|---|---|---|---|
| F00 lang, F06 units | Language / Idioma; Units / Unidades | en (default), es; lb, kg (default by region) | top-right switches | GEN-01; **R2-GEN-08** |
| **F39 role** | Who is this plan for? / ¿Para quién es el plan? | **me; a client (I'm a coach or trainer)** → routes the health check, the release version and coach rule packs (rule packs are files the coach keeps) | **first tap, required** | GEN-01, GEN-08; **R2-GEN-03**; R3-GEN-01 |
| **F45 health route** | Health check for your client / Chequeo de salud de tu cliente | **run the health check with my client now; skip: I'm a fitness professional and screen clients with my own onboarding** (shows `warn.coach_bypass`) | F39 = client, required; never on the client door | **R2-GEN-03**; **R3-GEN-01 (APPROVED)**; copy LEGAL REVIEW |
| **F01 health check** | Health check / Chequeo de salud | **the short Blaze Camp health check** (lawyer-written, EN / ES): his refer list (chest pain or a heart condition, "fainting" added PROPOSED; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said not to train) + the usual PAR-Q topics → any refer item: **the plan is built with the health warning** (COACH-R5 R5-GEN-02; before round 5: no automatic plan, refer message); "None of these apply to me" / "Some apply" (no pre-set answers); **link to the official PAR-Q+** (`health.parq_link`); answers never stored | F39 = me, or F45 = coach_screen; required | **R2-GEN-03**; **R3-GEN-01 (APPROVED)**; LEGAL REVIEW |
| F02 age | Age / Edad | 10-90 | required | 60+, 50+ racket and youth rules (R2-ATH-08; R3-ATH-02) |
| F05 body_weight | Body weight / Peso corporal | number + unit | **required** | GEN-02; loaded jumps 10-20 % BW (EQ-15) |
| F17 experience | Training experience / Experiencia de entrenamiento | years of consistent training; months off in the last 2 years; former competitive / pro athlete → level L1-L3 with a plain-words reason | required | GEN-02, PRG-05 |
| F07 goal | Main goal / Objetivo principal | build muscle; get stronger; train for my sport; **stay athletic and active**; lose fat; general fitness and health; hybrid / CrossFit | required | v0 families; ATH-13; **COACH-CHAT 2026-10-08** |
| F07b format | How do you like to train? | gym sessions; bootcamp-style circuits | goal ∈ lose fat, general | PRG-03 |
| **F09 focus_muscles** | Focus muscles (optional) / Músculos de enfoque (opcional) | **Focus muscle 1, Focus muscle 2** (two optional single-choice slots, never the same group twice): glutes, quads, hamstrings, back, chest, **shoulders (front, side and rear delts)**, biceps, triceps, calves, core, V-taper (back + shoulders, uses both slots) → **+1 to +3 extra weekly sets each** (default +2, PROPOSED), riding the stairway; intake/2 `priority_muscles` accepted as an alias; old values side_delts / rear_delts map to shoulders | optional, every goal (competitive field athletes PROPOSED, N-PROD-25) | **R3-SES-01**, **R3-VOL-01**; VOL-02, VOL-18 |
| F10 lift_style | How do you like to lift? | lighter, more reps; balanced; heavier, fewer reps | optional | VOL-12 |
| F11a competitive | Do you compete in a sport? | yes; I play for fun (→ F11r); no sport, I just want to be athletic (→ weekend_warrior + age overlays) | goal = train for my sport | GEN-02, ATH-13 |
| F11 sport | Sport / Deporte | **52 sports in 5 groups** with search, EN / ES names; every choice names its profile | competitive, required | GEN-02; COACH-CHAT 2026-10-08; 04 v1.2 |
| F12 position | Position / Posición | 146 position / event / discipline choices → profile (+ variant) | competitive, optional | GEN-02, ATH-08 |
| F13 level_of_play | Level of play / Nivel | youth, high school, college, pro, masters, amateur (swimming adds age-group / club) | competitive | PRG-09 |
| F14 season | Season / Temporada | **my next season starts on (date); I'm in season until (date); competition, fight or meet date** (swimmers: the main championship meet date, so the 2-week dryland taper lands on it); **no season right now** | competitive, required | GEN-02; **R2-GEN-05**; **R3-ATH-01** |
| F15 practice | Practice and games / Prácticas y partidos | **practice days per week + game (match, meet, fight) days** → the hard gym day ≥ 48 h before a game | competitive, **required** | **R2-GEN-05**; R2-ATH-07 |
| **F11r activity** | What do you play or do? / ¿Qué practicas? | **26 activities** (pick up to 2, the first leads): pickleball, HYROX, tennis, padel, golf, rec league (+ league sport), running, hiking / rucking, cycling, lap swimming, ski / snowboard prep, surf / paddle, dance and fitness classes, triathlon, rowing, CrossFit-style classes, combat-fitness classes, climbing gym, first obstacle race, "a bit of everything" + routed extras; **optional play days, play length (`play_minutes`) and, for event-type activities, an event date** | goal = stay athletic, or F11a = recreational, or the "I also play something" link | **COACH-CHAT 2026-10-08**; GEN-02; **R3-ATH-05 (APPROVED)**, R3-ATH-03 |
| F22 days, F23 weekdays | Training days per week; which days | 2-6; Mon-Sun | required / optional | v0; PRG-02 |
| ~~F24 minutes~~ | removed (v1.3) | ~~Session length 30-120 min and the time check~~. An intake that still sends `schedule.session_minutes` is accepted, the value is ignored, and the plan says so | - | **CT-01; R4-SES-01** ("Drop it. We don't need it.") |
| F25 plan_mode | Plan type / Tipo de plan | 12 weeks (recommended); 8 weeks; **maintenance (you choose the weeks)**; **a full year (stay in shape; tunable; non-competitive goals only)**; `week_by_week` retired as a mode (alias: 12 weeks opening on the Week view, PROPOSED) | required | PER-01; R2-PER-01/02/06; **R3-VOL-02, R3-VOL-04, R3-PER-01** |
| F25b maint_reason; **F25d maint_weeks** | Why a maintenance block?; How many maintenance weeks? | vacation / limited kit (50 %), travel / moving / season change (60 %), planned (70 %); **1-8 weeks, default 4** (to add weeks, rebuild with more) | F25 = maintenance | PER-01; **R2-PER-06**; R3-PER-01 |
| F25c previous_cycles | Blaze Camp blocks completed | count 0, 1, 2, 3+ (**blocks completed in a row**, PROPOSED) + **"Did you finish your last block?"** (`last_block_finished`) → each completed block: every group starts about 5 % higher, in whole sets, never above the level's top (R4-PRG-04); a stopped block: the same start (PROPOSED) | optional | **R4-PRG-04**; R2-VOL-06; R3-GEN-01 (nothing stored, so the person tells the tool) |
| F26 start | Start date | date | optional | v0 |
| F26b tests | What do you want to test? (before you start and at the end) | strength; cardio; speed / agility; jumps; body weight / measurements; no need for testing; **never from zero**; reminders printed in the plan and set as alarms in the downloaded calendar file (no notifications, nothing stored) | optional | PER-07; **R2-PER-07**; **R3-GEN-01** |
| F27-F34 equipment | Where do you train?; extras; machines; preference; DB / medball / box / running space / cardio options | his list minus bands; HYROX extras (sled, SkiErg, rower, wall ball) | required / optional | EQ-01, EQ-10, EQ-11 |
| F35 pain, F36 pain_detail | Anything hurting?; tell us more | areas; side, severity (severe → built with the moderate pain rules and the health warning, PROPOSED, R5-GEN-02; before round 5: refer), worse with ... | required / per area | VOL-03 |
| F38 exclusions | Anything you won't do? | running, jumping, barbell, lunges, overhead pressing, floor work, machines, other | optional | v0 |
| F44 prefs | Preferences | core block position (start default; core supersets anywhere); optional days separate / add-on; variety A/B; heavy single-leg sets; supersets when I don't feel tired; **cardio less / as planned / more**; **superset suggestions show (default) / hide**; **60+: include ankle hops, jumps, Olympic lifts and depth jumps (with the warning)**; **racket players 50-59: include depth jumps, hurdle hops and bounds (with the warning; from 60 the older switch covers it)** | optional | ATH-11, ORD-10, PER-03, UNI-04, ORD-05; R2-SES-03, R2-SES-06, R2-ATH-08; **R3-SES-02, R3-ATH-02** |
| F03 growth_stage | (youth athletes) | pre / around / after the growth spurt / not sure | age < 18 and athletic | PROPOSED |
| **F46 release** | Terms, release and own risk / Términos, liberación y propio riesgo | client, coach or minor version (a parent or guardian accepts under 18); a short summary + a link to the full Terms and Release of Liability (lawyer-approved `DISCLAIMER.md` / `DISCLAIMER.es.md`); **one unticked box** (`release.own_risk`: own risk + terms + release) and a separate Build button; record {text version, language, role, time, plan id, health route} **printed on the plan and every export, never stored** | **everyone, before every plan build or rebuild, including each new block; required: no plan is generated without it** | **R4-SCP-01, R4-SCP-02**; R2-GEN-03; R3-GEN-01 (APPROVED); LEGAL REVIEW |
| ~~F43 output_mode~~ | removed | ~~just the plan; plan + weekly check-in; plan + logbook~~ | - | **R3-VOL-02, R3-VOL-04** |
| ~~F41 email~~ | removed | ~~delivery only~~ (sharing goes through the phone's own share sheet) | - | **R3-GEN-01** |
| ~~F42 recovery~~ | removed | ~~sleep; stress; physically hard job or other sport~~ | - | **R2-GEN-04** |
| ~~F04 sex~~ | removed | - | - | GEN-02, ATH-09 |

**Express path** (taps INFERRED, 13 §12.6; v1.3 drops the session-length screen, so each path is one tap shorter than these v1.2 counts): client with a gym goal about 13-14 taps (+2 with Focus muscles); "stay athletic and active" 14-16; competitive athlete 20-22; coach with the skip on by default 11-13. **Derived values** (`generator_spec_v1.json > derived_values`, D1-D14; D15 retired): family (stay athletic → athletic, recreational), profile (+ variant, age overlay; 7-step mapping), client level and its reason keys, season phase, plan shape (stairway; `week_by_week` → fixed_12), week layout, constraint band, kit, **D9 start sets per line** (× modifiers, floor 10 on groups from 3 training days, 6 → 8 for big groups on 2 days, + Focus +F, pain, maintenance, pre-season, next block from F25c), bilateral share target, athletic budget, **D12 = the planned stairway (the 3 % / 5 % pattern scaled so every group reaches its planned final sets; nothing after the build changes it)**, test weeks (before / week 1 and end), **D14 aerobic sessions** (profile default ± the user's choice; the activity counts up to 2; 0 extra where the sport is the cardio), **D15 time fit: RETIRED** (CT-01; the time check is gone, §5.6.1).

### 13.3 Decision pipeline (pseudo-code v1.3)

```
generate_plan(intake, model, coach_rule_packs):                # pure and deterministic; runs in the browser; sends nothing (R3-GEN-01)

  # 0 CONSENT AND SAFETY -------------------------------------------------------------------------
  require F46 accepted for THIS build (one box: terms + release of liability + own risk; client / coach / guardian)
      not accepted -> NO PLAN (status invalid, no weeks); this check runs before anything else          # R4-SCP-01, R4-SCP-02
  if F39 == 'self' or F45 == 'coach_screen':
      if any(F01 refer items) or 'severe' in F36: warn(intake)                       # R5-GEN-02 (was: return refer(intake); R2-GEN-03, R3-GEN-01)
  else:  # F45 == 'coach_own_sop'
      show warn.coach_bypass; screening is the coach's responsibility (release.coach)  # R2-GEN-03; R3-GEN-01
  # health answers are used here only; they never enter the plan, links or exports

  # 1 WHO IS THIS (workouts only: no sleep, stress or job inputs; NO SESSION LENGTH) ---------------
  family  = GOAL_MAP[F07] (+ F07b); F07 == 'active' -> athletic, recreational      # COACH-CHAT 2026-10-08
  profile = D2_profile(F11, F12, F11r, F11a, F02)                                     # 04: sport -> position -> profile/variant;
                                                                                      # activity -> profile; age overlays (60+; racket 50+)
  level, reason_keys = level_from_experience(F17)                                     # PRG-05; L3 PROPOSED
  focus   = F09 (max 2 groups; shoulders = front + side + rear delts)                 # R3-SES-01, R3-VOL-01
  phase   = season_phase(F14, F15, F26) if competitive else None                      # R2-GEN-05
  play    = F11r.play_days, F11r.play_minutes, F11r.event_date                        # R3-ATH-05
  band    = CONSTRAINT_BAND[client_family(family, age, pain, volume)]                 # EQ-03, EQ-13
  kit     = expand(F27 + F28 + F29 + F30..F34)                                        # never inferred from template names (R2-LIB-08)
  rules   = layer(LOCKED, BLAZE_DEFAULTS, coach_rule_packs, client_prefs=F44, F29b)   # GEN-08
  size    = SESSION_SIZE[client type]      # general / fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations,
                                           # field athletes up to 12, older adults 5-6; not counting warm-up or core   # R4-SES-02

  # 2 SHAPE AND WEEK: HIS TEMPLATES ----------------------------------------------------------------
  shape   = PLAN_MODE[F25](level, family, phase, F25b, F25d, F25c)                    # stairway C12 / C8 / MAINT / YEAR (+ PREP, SEASON)
  week    = SPLIT[family][F22]             # his skeletons: A / B (2, 4, 5-6 days), A / B / C (3 days), push / pull / legs,
                                           # athletic A / B / C (the athletic block, then the lifts), strength roles, class, bootcamp, HYROX   # R4-SES-05
  days    = place_on_weekdays(week, F23, game days, play days)                       # heavy squat Mon / heavy deadlift Fri; hard day >= 48 h before a game or the biggest play day
  for day: every exercise of the template has a rank; the day holds the ranks up to `size`; nothing else is taken out   # R4-SES-02, R4-SES-04
           blocks with stable ids and kinds (plan_editing): warm-up, core opener (2 x 2, position F44.core), athletic (profile, phase;
           weeks with 3+ play sessions: no extra agility, half the jumps), Olympic (clean on knee days, snatch on hip days; 60+ only if switched on),
           strength (his slots, each with its laterality), accessory, calves (one exercise x 3 on a leg day), focus, finisher, cardio
           enforce: two spine days, row before pulldown, the work first, power before strength, athletes <= 12 + core
  est_minutes per day = the time model (information only; never compared with anything, never a reason to change the plan)   # CT-01, R4-SES-01

  # 3 WEEKLY SETS PER TRAINED GROUP ----------------------------------------------------------------
  for each trained group g:
      start[g], top[g] = level table x GOAL_PHASE_FACTOR[family, phase]                                    # VOL-01, R2-VOL-04, R2-VOL-06
      if g in focus: start[g] += F; top[g] += F  (F = 1-3, default 2; top <= 18 / 26-28 / 30)              # R3-SES-01
      next block (F25c): start[g] = about 5 % above the last block's start, whole sets, never above top[g]  # R4-PRG-04
      3 or more training days: group floor 10 (hips, shoulders ... with group credit)                       # R2-VOL-06; R3-VOL-01, R3-SES-01
      2 training days: big groups start 6, top 8 (+ F); the plan says so and suggests a third day          # R4-SES-03
      if g in pain_muscles: start[g] x= 0.5-0.7; top[g] = start[g] + 1                                      # VOL-03 (pain wins over the floor)
      if shape == MAINT: start[g] = top[g] = factor(F25b, age) x the last block's final sets  (flat)       # PER-01, R2-PER-06
      if phase == PRE:   start[g] = top[g] = 0.6 x off_season_sets[g]                         (flat)       # R2-PER-06
  schedule[g][1..N] = stairway(start[g], top[g], pattern 3 % / 5 %, lambda free)                           # CX-01: top[g] IS reached
      whole sets; the top number in the last week, one week early at most                                   # R4-PRG-01
      a week that adds more than about 15 % is noted                                                        # R4-PRG-02
  share = BILATERAL_SHARE[profile][phase] (+ pain shift), applied to the slots the template leaves open   # UNI-02, UNI-10; R4-SES-05
  athletic = AthleticBudget(profile, phase, level): plyo share by sport, Receive-Create stage by week,
             contacts <= NSCA per session, throws, COD, Olympic up to 4/week                                # R2-ATH-01..05; R3-ATH-04

  # 4 EXERCISES (fixed for the exercise block) ---------------------------------------------------
  for slot: pool = catalog[slot.bucket] filtered by kit, soft level, population rules, pain, exclusions, active only
            optional add-ons are never picked (wall balls and sled pushes in a HYROX circuit or the class WOD excepted)   # R4-LIB-01
            default = argmax(BYOP library first, his staples, preference F29b, constraint fit, continuity,
                             incline before overhead in the vertical / mid-range push slot for muscle, general, fat-loss
                             and stay-active goals)                                                         # R4-LIB-03
            dropdown = same-category alternatives, each with one line: what it keeps, what it loses         # GEN-04, EQ-10; R4-LIB-04
            a pick that stands in for missing equipment says what it replaces and what is lost              # R4-LIB-04
            video = a YouTube search link built from the name + the exact name to copy                      # R4-LIB-05
            second weekly exposure = different exercise of the same category (non-axial on the non-spine day)  # PER-04, R2-SES-01
            at an exercise-block change: 1-2 small changes or one detail, never invented                    # PER-02, R2-LIB-01

  # 5 DOSE ---------------------------------------------------------------------------------------
  reps = REP_MATRIX[family][class] (VOL 1/2/3 for athletes; F10 moves big compounds only; full squat Olympic lifts 3-5)
  effort = planned RIR of the week inside 1-3 (3 -> 2 -> 1-2 -> 1 + intensifiers, APPROVED R3-VOL-04)
  load_hint = RIR words + RPE number; % only for barbell main lifts with a recent tested best       # R2-GEN-06
  progression = the rule the person applies, on every lift: "When you hit {top} on every set with {N} left in the tank,
                add weight next time and start again at {bottom}"; no number is promised for any week   # R4-PRG-03
  carries and sleds: 2-4 trips of 20-40 m or 20-40 s; no muscle sets                                   # R4-LIB-02

  # 6 THE WHOLE PLAN AT ONCE (no deload inside the block: R2-VOL-07; no check-in: R3-VOL-02 / R3-VOL-04) ------
  for week k = 1..N:
      split schedule[g][k] over the template's slots that train g: the exercise with the fewest sets first, the earlier
          one on a tie; the two exposures of a day type alternate; 2-5 sets an exercise (2-4 at L1)         # VOL-07; R3-VOL-03
      no room: the bonus exercise on the optional day (or a Focus slot); calves never a second exercise;
          else the group is capped at what its slots hold AND THE PLAN SAYS SO                              # R4-SES-04
      a group at its top keeps its sets; reps and load carry the progress                                   # CX-02, CX-03
      superset suggestions between neighbouring eligible pairs; the person switches them on                 # R3-SES-02; CT-01
      at an exercise-block boundary: one-detail changes; the stairway continues
      athletic: Receive-Create stage and plyo share advance; event date: hardest weeks end 1 week before, then 1 easy week   # R2-ATH-03; R3-ATH-05
      each day: exercise_count, est_minutes, the easy-to-remove hints                                        # R4-SES-02, CT-01, R4-SES-04

  # 7 END, TESTS, AUDIT, RENDER ------------------------------------------------------------------
  tests: ticked items before the block (or week 1) and in the last week; never mid-block; never from zero   # R2-PER-07
  last page: plan.next_steps (easy week recommended, then build the next block about 5 % up; or maintenance; or something new;
             holidays between blocks)                                                                       # R3-PER-01; R4-PRG-04
  audit: validation checks (13.6); every number stamped with model_version; every pick has 'why' keys
  render: codes only -> word lists (EN/ES) -> Block / Week / Day views; weekly sets per group, week by week;
          the release line at the top and the bottom and a short line on every view (EN / ES, link to DISCLAIMER.md);
          "How you progress"; "Optional add-ons"; what the template could not hold; the average time per day      # R4-SCP-02, R4-PRG-03, R4-LIB-01, CT-01

  # 8 AFTER THE BUILD (the person's side, outside generate) ----------------------------------------
  applyPlanEdits(plan, edits[]): set the sets of a day or a week, remove / add an exercise, switch a block on / off;
                             totals recomputed; plan.edited = true; the checks re-run and are stamped "edited";
                             notes, never refusals; the generated plan is never changed in place; nothing is stored   # CX-02, CX-04; R3-SES-02, R3-GEN-01
  a new block = this flow again (F46 accepted again)                                                        # R3-PER-01, R4-SCP-02
```

**Retired from the v1.2 pipeline:** step 2's time check (`D15_time_fit`, `plan.time_check`, the offers, "keep the time", `plan.not_trained_directly`); step 6's "step ≤ 7 %", "until total rise < 10 %" and "the line's ceiling = what the week holds (never flat)"; the "not trained directly (time)" list on exports.

### 13.4 Coach-added rules (GEN-08; mechanism PROPOSED, 13 §7.2)

| Layer | Owner | Changeable? | Contents |
|---|---|---|---|
| 1 Locked | the coach | no (only in a fork, which is then not Blaze Camp) | never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped by the generator (GEN-08); no bands or variable resistance; athletic sets never count as muscle sets; **no time-fitting** (CT-01); **nothing dropped automatically** (R4-SES-04); **no deload or maintenance week inside a block** (R2-VOL-07); **never a 1RM or max-effort test from zero** (R2-PER-07); older/injured never-list (EQ-03) and 60+ / racket-50+ power work only by switch with the warning (R2-ATH-08, R3-ATH-02); no sex-based rules; **no lifestyle inputs** (R2-GEN-04); **no feedback inputs after the build** (R3-VOL-02); **no data kept** (R3-GEN-01); **the terms and release accepted before a plan is generated, and the release line on every plan** (R4-SCP-01, R4-SCP-02; R2-GEN-03, R3-GEN-01). *(v1.3 removed "weekly increase < 10 % and planned step ≤ 7 %" from this layer: CX-01, R4-PRG-02.)* |
| 2 Blaze defaults | the coach | yes, by a coach rule pack | starting sets, floor of 10 per group (from 3 training days), caps (all "customizable", R2-VOL-06), the Focus add (+1 to +3), helper credit 0.25, the two spine days, calves one exercise × 3 per leg day, session sizes by client type and their defaults, the A / B day's 7th and 8th exercise, bilateral shares, plyo shares, aerobic counts, the stairway pattern (3 % / 5 %) and the final sets, the 2-day numbers, the acceleration-note threshold (about 15 %), incline first, every PROPOSED number |
| 3 Coach rule pack (a file the coach keeps) | the coach using the tool | yes | e.g. "youth under 15: no Olympic lifts from the floor"; "tennis: lower body 85 % unilateral"; "add core supersets on every lower day" (R2-SES-03); "athletic block off on the day after pickleball" (R3-SES-02); "pin my video for this exercise" (R2-GEN-02); "show Olympic percentages for this athlete" (R2-GEN-06, PROPOSED) |
| 4 Client preferences and edits | the client | yes, inside the layers above | dropdown swaps (EQ-10), core position (ATH-11), variety (PER-03), optional days (ORD-10), **cardio less / more** (R2-SES-06), **Focus muscles** (R3-SES-01), **60+ and racket-50+ switches with the warning** (R2-ATH-08, R3-ATH-02), maintenance length (R2-PER-06), year tuning (R2-PER-02), **play days and event date** (R3-ATH-05), **plan edits: block switches, add / remove, supersets** (R3-SES-02) |

**Rule format** (`rulepack/1`): `{"id", "when": {"all"|"any": [{"fact", "op", "value"}]}, "then": {"action", ...}, "note_key"}`. Facts: intake fields F00-F46, activity and sport ids, derived values D1-D15, `week.n`, `week.phase`, `day.type`, `day.after_play_day`, `slot.category`, `exercise.tags`. **Closed action list**: exclude_exercise, exclude_tag, exclude_equipment, prefer_exercise_in_slot, set_unilateral_share, set_muscle_weekly_range, cap_weekly_step, fix_weekly_step, add_slot, remove_slot, move_block, set_rest, set_rep_range, add_note, **add_core_superset** (R2-SES-03), **pin_video_link** (R2-GEN-02), **show_olympic_percentages** (R2-GEN-06; PROPOSED), **set_aerobic_sessions** (R2-SES-06), **toggle_block** (R3-SES-02; PROPOSED), **recommend_superset** (R3-SES-02; PROPOSED). Precedence: locked > coach pack > Blaze defaults > client preference. Before saving, the coach previews the effect on 3 sample clients. Coach-added exercises carry every CAT-01 tag; a video link is optional (R2-GEN-02). Rule packs are files the coach keeps; nothing is stored by Blaze Camp (R3-GEN-01).

### 13.5 Adaptation from check-ins: RETIRED (COACH-R3 R3-VOL-02, R3-VOL-04)

"We're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." (R3-VOL-02); "I don't want people to be checking back on their phone in their program. I want them to be able to kick out a program, and that's it." (R3-VOL-04)

**Retired** (v1.1 §13.5, approved in round 2 as a mechanism, R2-GEN-01, R2-VOL-01): the one-minute weekly check-in (`checkin/2`: sessions done, effort per session, how it felt, pain, optional results); tracking levels 1-3 (check-in, phone logbook, coach-connected accounts); the step table read against the stairway; the HOW IT FELT? rules applied by the engine; the block-at-risk offer; the in-app prompts `block.cannot_finish`, `maint.end`, `block.done`; `adapt()`; week-by-week on check-ins. The spec keeps `adaptation` only as a RETIRED stub (empty `copy` and `checkin_schema` for the compiler, see §16.4).

**What replaces it** (the person's side; nothing comes back to the tool):

| When | What the plan already does | What the person or coach does |
|---|---|---|
| A hard week (busy, sore, slept badly) | the reps-in-reserve cue lets them go lighter and still do the plan | switch off today's jump / throw block or core block, remove an exercise, or repeat the week |
| It feels too easy | the stairway and the effort cue get harder every week | more weight inside the RIR cue; a coach adds sets or exercises, or rebuilds one level up |
| An exercise hits the wrong muscle | - | swap it in the dropdown (same category, one-detail variations only) |
| Something hurts | intake pain is built in (VOL-03) | the printed guide: swap, then cut the sets, then drop the exercise; see a professional |
| The block can't be finished | - | stop when they decide; build a maintenance plan or a new block ("Did you finish your last block? No" keeps the same start) |
| The block is finished | the last page says what's next | take the recommended easy week, then build the next block one step up (R3-PER-01) |
| They like to log | the downloaded sheet keeps his columns: 'WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?' (with the helper lines `effort.ten` and "Couldn't do it") | log for themselves; the tool never reads it back (GEN-03) |

SCIENCE (13 §2.2): with every set written as "leave N reps in the tank", the load autoregulates inside a fixed plan; RIR-based autoregulation does at least as well as fixed loading for strength (Graham and Cleather 2021; Zhang et al. 2021; Hickmott et al. 2022; Helms et al. 2020). Comparable apps that adapt from feedback (RP Hypertrophy, JuggernautAI, Volt, Fitbod) are subscription apps that keep their users' data (RESEARCH); Blaze Camp deliberately does neither.

### 13.6 Validation checks before a plan is shown (v1.3)

The numbers follow the engine's check list (engine 0.5.0: V1-V37 plus the hard-rule checks H01-H22; `model/rules.json > validation`). v1.2 listed V27-V31 under other names before any of them was built; those rules are still here (see the note under the table). **No check reads minutes.**

| Check | Rule | Source |
|---|---|---|
| V1 safety | **COACH-R5 R5-GEN-02:** any F01 refer item or F36 severe pain → the plan is built with the health warning (severe pain with the moderate pain rules, PROPOSED); status refer is a violation. Before round 5: → refer, no plan; **the F01 part is skipped only when F45 = coach_own_sop** (the coach warning was shown and the coach release is used) | R2-GEN-03; R3-GEN-01 |
| V2 days | fewer weekdays than training days → ask | v0 |
| **V3 no time-fitting** | a plan that carries a session length, a minutes limit, a time check, a time offer or a time warning fails | **CT-01; R4-SES-01** (v1.2's "athlete with 30 min" warning is retired) |
| V4 youth | under 18: L1-L2 exercise levels by default; Olympic lifts from the floor from ~14 after a hang block; lighter medballs; guardian release | R2-ATH-08; R2-GEN-03 |
| V5 older | 60+: constraint 4-5 bias; never OH squat or low-bar squat; landing drills, balance, quick stepping, light medball throws and fast machine work on; **no low ankle hops, other jumps, Olympic lifts or depth jumps unless F44 switch, with warning C7 shown**; snatch variants out (EQ-03); racket players 50+: low-impact jumps only unless switched on (C7b), calf / Achilles every leg day, rotator cuff; maintenance ≥ 70 %; submax tests | EQ-03; R2-ATH-08; **R3-ATH-02**, R3-VOL-04 |
| V6 season | plan longer than the weeks to the season → run to the date (pre-season 4-6 weeks + taper), then in-season | PER-08; R2-PER-06, R2-GEN-05 |
| V7 no equipment + muscle goal | warn about vertical pull, biceps, throws; show the buy list | 10 |
| V8 focus | ≤ 2 Focus groups; each +1 to +3 weekly sets, climbing with the stairway | VOL-02; **R3-SES-01** |
| V9 bands | no exercise, swap or kit token uses a band, chain or releaser | EQ-01, EQ-12 |
| V10 spine | ≤ 1 heavy squat + ≤ 1 heavy deadlift (counted list) per week, **never on the same day** | **R2-SES-01, R2-SES-02** |
| V11 pairing | every mixed session: hip + push, knee + pull | UNI-11, ORD-06 |
| V12 order | warm-up → core opener (unless moved) → athletic → Olympic → strength; row before pulldown; the work first | ATH-11, ORD-01..03 |
| **V13 session size** | a generated day holds no more exercises than its client type's range allows (general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, athletes ≤ 12 + the 2-exercise core block, older adults 5-6). A day under the low end of its range is not an error (a WOD-only class day, a test week, a 60+ day with jumps off) | **R4-SES-02**; VOL-08; R2-SES-04 |
| V14 counting | athletic work (KB swings, HYROX station circuits, carries and sleds included) credits no muscle; helpers 0.25; glutes 0.25 on compounds; thruster 1 / 0.5 / 0.25; 10/10 = 1 set; a set at most 1.0 to a group | VOL-09, VOL-10; **R2-VOL-05**; R3-ATH-03, R3-VOL-01; R4-LIB-02 |
| **V15 final sets reached** | every trained group reaches its planned final sets in the last week, not more than one week early, and never sits under its printed schedule. **No rate limit** | **CX-01; R4-PRG-01** (v1.2's "step ≤ 7 %, total under 10 %" is retired) |
| V16 aesthetics | no medball in the main workout | ATH-05 |
| V17 effort | no MAX on heavy compounds; MYO only last on machine/isolation; planned RIR inside 1-3 (drift approved) | GEN-08, VOL-13, VOL-15; R3-VOL-04 |
| V18 minimums | calves one exercise × 3 sets each leg day; a rear-delt exercise each week inside the shoulders group; 2 core exercises each session as generated | VOL-17; **R3-SES-01, R3-VOL-01** |
| V19 Olympic | every athletic week has a level-matched Olympic variant (unless 60+ without the switch); ≤ 4 exposures; clean on knee days, snatch on hip days | ATH-10; **R2-ATH-04, R2-ATH-08** |
| V20 V-squat | never | GEN-08 |
| **V21 liability gate** | the terms and the release were accepted for this build (client, coach or guardian version) and the plan's stamp says so; **no plan otherwise** (status invalid, no weeks); checked before the health check | **R4-SCP-01, R4-SCP-02**; R2-GEN-03; R3-GEN-01 |
| **V22 floor** | with 3 or more training days every trained FOCUS group ≥ 10 weekly sets in a training block; with 2 days every big group ≥ 6. Exemptions: maintenance, pre-season, in-season, pain-reduced, credit-only, and a group the plan **says** its template cannot hold | **R2-VOL-06**; **R3-VOL-01, R3-SES-01**; **R4-SES-03, R4-SES-04** |
| **V23 exercises per group** | on a split day no trained group has only 1 exercise; on his A / B days 1-4 as the template gives (calves and the core opener excepted; conjugate four-role days flagged) | **R4-SES-05**; R2-SES-05; R3-SES-01 |
| **V24 block structure** | no deload or maintenance week inside a training block; the easy week (recommended) only between blocks | **R2-VOL-07**; R3-PER-01 |
| **V25 tests** | tests only before / in week 1 and in the last week; no 1RM or max-effort mile without a completed block | **R2-PER-07** |
| **V26 inputs** | the intake contains no sleep, stress, job or life field, no check-in or tracking field and no session length that changes the plan; nothing after the build feeds the engine | **R2-GEN-04**; **R3-VOL-02, R3-VOL-04**; CT-01 |
| V27 athletic budget | jumps, throws, agility and sprints inside the profile's budget; the dose never drops inside a stairway block; the Receive-Create stage of the week is respected | ATH-01; R2-ATH-01..03 |
| V28 laterality share (warning) | the bilateral share is near its target on the slots the dial may move; his template's slots keep their own laterality | UNI-02, UNI-03; R4-SES-05 |
| V29 push and pull (warning) | weekly pushing and pulling sets stay in balance | VOL-18 |
| **V30 template skeleton, nothing dropped** | a day built on one of his skeletons holds his slots in his order, each slot with its pattern and laterality; every counted lift is present in every stairway week unless the day says why (an exclusion, pain, play spacing, the 60+ default) | **R4-SES-05, R4-SES-04** |
| **V31 optional add-ons** | an optional add-on or a proposed record is never a template pick; wall balls and sled pushes only in a HYROX station circuit or the class WOD | **R4-LIB-01** |
| **V32 incline first (warning)** | for bodybuilding and general-population plans at least half of the vertical / mid-range push picks of a block are incline or mid-range presses, when the kit holds one | **R4-LIB-03**; threshold PROPOSED |
| **V33 video** | no third-party video link anywhere in the plan: a YouTube search built from the exercise name, or the coach's own video | **R4-LIB-05** |
| **V34 progression rule** | every set-and-rep lift carries its progression rule; no number is promised for a week | **R4-PRG-03** |
| **V35 acceleration note** | a week that adds more than about 15 % carries the note | **R4-PRG-02** |
| **V36 easy to remove** | the day only names what is easiest to remove; nothing is removed; the core block, the main lifts and the first athletic station are never on the list | **R4-SES-04** |
| **V37 carries** | carries and sled work: 2-4 trips of 20-40 m or 20-40 s, no muscle-set credit | **R4-LIB-02** |

**Three v1.2 rules without a plan check of their own** (the website has to hold them): **no data kept** (the build makes no network call carrying intake, plan or release data; links, images and exports carry no age, weight, pain or health answers; R3-GEN-01); **editable** (every block has a stable id and a kind, with on / off flags on the optional kinds; R3-SES-02, CX-04); **the release stamp and the release line on every export** (R3-GEN-01, R4-SCP-02; part of V21). **Retired:** v1.2's "V28 time fit" (CT-01) and the "never flat" clause of "V29 stairway climbs" (CX-02); the rest of that rule lives in V15 and in the hard-rule checks (sets never go down inside a block; the last week is the hardest).

Edited plans (after `applyPlanEdits`) get notes, never refusals: the locked rules bind what the generator builds and what the "add" list offers, not what people take out of their own plan. An edited plan is not judged by the generated-plan size and schedule rules, and it never keeps the "validated" stamp of the plan it came from (CX-04; mechanism PROPOSED).

### 13.7 What is the coach's and what is ours

| Component | Status |
|---|---|
| Taxonomy and lenses, big/small lists, LEG FLEXION, core rule, levels by load position (seat/machine/cable easier), zones as rotation-bias tags, starting volumes (big and small), the floor of 10 on FOCUS groups, hips and shoulders as groups (rear delts inside shoulders), caps and priority caps, Focus muscle 1 / 2 with 1-3 extra sets, pain rule, **the stairway pattern in numbers** (about 3 % to halfway, about 5 % after), **reaching the planned final sets with faster steps when needed, no hard limit, a note above about 15 %, the top number in the last week or one week early, the same sets while reps or load progress, reps and load as a rule the person applies** and the **3 → 1 RIR drift**, "2 → 11" as felt level, **outputs only (no check-ins, no tracking, no data kept)**, effort 10 = successful max, bank-and-release, VOL-07 placement with **day alternation and the bonus exercise rule**, 0.25 helpers and glutes, KB swings ballistic, thrusters, dips, 10/10, athletic never counts (HYROX circuits included), bilateral:unilateral logic, contra/ipsi, pairing, two spine days and the axial list, light core opener + core supersets anywhere, **his A / B template on full-body days and push / pull / legs**, 2-4 exercises per group on split days, **calves one exercise × 3 per leg day**, field-athlete 12 + 2 with the **cross pattern default and the same-pattern template for size / high-level athletes**, ordering, supersets (**recommended**), **no time-fitting, session size by exercise count, the 2-day rule, nothing dropped automatically**, **block switches, add / remove and set editing (everything editable)**, no deload inside a block, **the easy week as a recommendation and "when a block ends, it ends"**, holidays between blocks, pre-season 60 % + taper, the next block about 5 % above the last start and never above the level's top, gen-pop year and its tuning, tests before / end and never from zero, seasons and start-date intake, plyo shares and lists (**every sport**), Receive-Create stages, Olympic up to 4 × / 3-5 reps / power language, **60+ on / off defaults and racket players 50+**, youth rules, aerobic counts and their adjustability (**0 extra where the sport is the cardio; HYROX 4; activity sessions count**), **swimming dryland defaults and taper**, **HYROX plan**, **play days and event dates**, medball rules, no bands, machines not ranked, no sex rules, workouts-only intake, **short lawyer-written health check + PAR-Q+ link + coach skip + the own-risk / terms / release tick required before every build + a release line on every plan**, **optional add-ons that are never template picks (wall balls and sled pushes in HYROX excepted), carries and sleds by distance or time, the mid-range pull, incline before overhead, swaps that say what they keep and lose, YouTube search links with the name to copy, a confidence label on every sport profile, the credit line**, **MIT to Lalo Vera / Blaze Camp / BFit Studios Corp.**, the product path, fewest clicks, macro views, screenshots, optional videos, Spanish, seven sample plans, coach rules | **coach** (COACH-ANSWER / COACH-R2 / COACH-R3 / COACH-R4 / CT-01 / CX) |
| The whole-set rounding and the staggering of the stairway, the stair-level number, group credit, the shoulders line's side-delt dose, the Focus default +2, the session-size defaults and what sits outside the count, the 2-day numbers 6 → 8, slots 7 and 8 of the A / B days, the allocation details (sets per exercise, the bonus exercise) and what the plan says when a template cannot hold a group, the incline-press credit, the acceleration-note details, the time-estimate numbers and the printed range, the add-on list on the plan, the swap-note wording, the release-line wording, the "blocks completed in a row" input, the same start after a stopped block, block ids and per-kind toggle flags, the edit mechanism (scopes, notes not refusals), superset wording, the printed self-adjust guide, easy-week counting in the year, maintenance factor split, Pro numbers, L3 definition, small lines on big-line ceilings, time model, share numbers he did not give, 'goalkeepers' and 60+ snatch readings, the swimmer age threshold, Olympic % opt-in, output layouts, release and health-check wording, Spanish strings | **ours** (PROPOSED / INFERRED), each a configurable table entry; open questions in §0d.3 and §16.6 |

---

## 14. Product and output (summary of `13_product_options.md` v1.3)

### 14.1 What he approved and what it means (R2-GEN-02, R2-GEN-03, R2-GEN-06, R2-GEN-08; R3-VOL-02, R3-VOL-04, R3-SES-02, R3-GEN-01; v1.3: CT-01, CX-04, R4-SES-01, R4-LIB-05, R4-SCP-01, R4-SCP-02, R4-REL-01..03)

| Topic | v1.3 |
|---|---|
| **What to build** | **APPROVED, simplified by round 3**: phase 1 a bilingual plan **website** (not an app) - answers in, the whole plan out, with plan editing and every export (images, PDF, Google Sheets / Excel download with his BYOP columns, plan link, plan file, calendar) → **open source under MIT** once he approves v1. The v1.1 phase 1.1 (weekly check-in, logbook, week-by-week, progress screen), v2 accounts and the learning phase are retired ("I want this to be very simple ... kick out a program, and that's it", R3-VOL-04). |
| **Fewest clicks** | one question per screen; big auto-advancing buttons; smart defaults; "More options" folded; nothing asked that the engine does not use (R2-GEN-04); **nothing asked after the build** (R3-VOL-02); client gym goal ~13-14 taps (+2 with Focus muscles); stay-active 14-16; competitive athlete 20-22; coach 11-13 (INFERRED counts). |
| **Macro views** | one sticky **BLOCK \| WEEK \| DAY** toggle with "show" chips (exercises, sets × reps, effort, rest, cues, cardio, jumps and throws, sets per group). Clients land on today's Day view, coaches on the Block view (PROPOSED). The **Block view** shows the whole 12 weeks (one compact table per training day, exercise-block changes at weeks 5 and 9 marked) under a **stairway bar** with each week's 2 → 11 level and the test weeks; **every week can be opened before it begins** (R3-VOL-04). v1.3: every block prints **weekly sets per group, week by week**, with the planned final sets and a mark on weeks that jump more than usual. |
| **Editing (R3-SES-02; CX-02, CX-04; R4-SES-04)** | **everything is editable**: block switches (core, skill, jump / throw, Olympic, accessory, calves, focus, finisher incl. HYROX circuits, cardio; "this day" or "this day every week of the exercise block"); **change the sets of any exercise on any day or week**; remove an exercise; "+ add exercise" (only what the generator could have picked for this person, plus the optional add-ons; rear-delt work always offered on upper days, R3-VOL-01); add / remove a block (core supersets anywhere, R2-SES-03); swap, with one line on what the swap keeps and loses (R4-LIB-04); superset suggestions; "Reset to the generated plan". Each day names the easiest things to remove. After an edit the weekly sets per group are recomputed, the plan is marked edited and no old "validated" stamp stays - **notes, never refusals**. Edits live inside the plan (link, file, exports). |
| **Time (CT-01; R4-SES-01)** | **no session-length question and no time check.** Each day prints "Average time: about 60-75 min (an estimate, for information only)". The "How to adjust" part says nothing is cut or changed because of time. *(Retired: the schedule-screen time offer and the "Trained directly / Not trained directly (time)" lists, copy C19 and C20.)* |
| **Screenshots and exports** | **Save block as image** (per training day or the whole block), **save week as image**, save day as image, the phone's share sheet (text it, WhatsApp it), print / PDF (block or week layouts), xlsx with his columns, **plan link** (the whole plan, edits included, packed after the "#" so it is never sent to a server), **plan file**, calendar with test-reminder alarms. Exports carry the language, units, plan name, model version, **release stamp + "use at your own risk / not medical advice" line** and **the edit hint** ("You can switch off today's jump / throw block or core block, remove or add exercises or blocks, and do the suggested supersets to save time"); switched-off blocks print as "(switched off)"; never age, weight, pain or health answers. |
| **Videos (R4-LIB-05)** | **no third-party links.** Every exercise has a "Watch how" link that opens a YouTube search built from its English name (nothing embedded), and the plan shows "Name to copy into YouTube" with a one-tap copy (the English gym name, also in a Spanish plan). His own video where one exists (later); a note that the search results are not made by Blaze Camp and a "send us your video" line (`[VIDEO_CONTACT]` placeholder). No phase waits for filming. |
| **Health check, terms, release, own risk** | §13.1 G7-G8, §13.2 (F39, F45, F01, F46): **a short Blaze Camp health check written by a lawyer in English and Spanish, with a link to the official PAR-Q+**; coaches run it with their client or skip it with the warning; **one unticked box (use at my own risk + terms and conditions + release of liability) every build or rebuild, including each new block - required: no plan is generated without it (R4-SCP-02)**; **a short release line at the top and the bottom of every plan and on every view, EN and ES, linking `DISCLAIMER.md` (R4-SCP-01, R4-SCP-02)**; the record is printed, never stored; copy C0-C23 in EN / ES marked LEGAL REVIEW (13 §12.5). |
| **Weight guidance** | "Leave 2 reps in the tank (2 RIR · RPE 8)", the number following the week of the stairway (**3 in the tank early, 2, 1-2, and 1 + a few extra-hard sets in the last week**, APPROVED R3-VOL-04); week-1 tip "pick a weight you could lift 2-3 more times"; % only with a recent tested best on barbell main lifts; Olympic lifts as power ("move it fast; if it slows down or your technique breaks, it's too heavy"); competitive weightlifting is its own program type (later). **Progress line on every lift (R4-PRG-03):** "Progress: when you hit 12 on every set with 2 left in the tank, add weight next time and start again at 8." A section "How you progress" explains the rule, what the sets do, the weeks that jump more than usual and where the next block starts. No number is promised for a week. |
| **Spanish** | **APPROVED**: neutral Latin American Spanish with the English gym word in brackets; he or a coach he trusts approves every line; lb in the US, kg elsewhere, switchable; legal texts legally equivalent in both languages (R3-GEN-01). |
| **Tiers** | self-serve (anyone, no coach access: his 'NO ACCESS', R2-LIB-08) and coached (coach mode: rule packs kept as files, health-check skip; no accounts, R3-GEN-01); free vs paid still open (N-PROD-09). |
| **Data** | **none collected, none kept** (R3-GEN-01): the site is static files; the engine runs on the phone; answers, health check, plan and release tick never leave the device; when the page closes the site forgets the plan (whether it may remember the last plan on that one phone is N-PROD-21); an optional "Save my answers" file stays with the person (PROPOSED). |
| **Licence** | **MIT** for the whole repository: "Copyright (c) 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation)" (`LICENSE`); README and `DISCLAIMER.md` / `DISCLAIMER.es.md` say: not medical advice, at your own expense and risk, no warranty, release of liability, coaches using it for clients need their own release, minors need a guardian, no data collected. Apache-2.0 + CC BY 4.0 are retired. His future videos are hosted separately; MIT grants no trademark rights in the Blaze Camp name (the lawyer confirms whether to register it). |
| **Stack** | static TypeScript single-page web app (PWA) on Cloudflare Pages; **no database, no accounts, no analytics with personal fields**; i18n word lists; print CSS; DOM-to-PNG; ExcelJS; engine pure and deterministic (`generate / applyEdits / explain / validate`), plans stamped with `model_version` (the same answers rebuild the same plan). |
| **Roadmap and effort** (INFERRED, one full-time developer) | Phase 0: freeze model v1.3 + the sample plans he grades (golden tests); the engine (0.5.0) already builds, edits, checks and prints plans as Markdown and JSON → **Phase 1 MVP 13.5-20 developer-weeks** (start flow with the health check and the own-risk tick, Focus muscles, play days / event date, Block / Week / Day views, plan editing, all exports, EN / ES, no accounts, no data kept) → **Phase 2 open source under MIT + coach tools without accounts (rule-pack files, answers files, Olympic weightlifting program type, optional Drive export): 5-9 developer-weeks + legal review** → model updates when he approves a change (no learning from user data). Retired: the check-in increment (3.5-5 weeks) and v2 accounts (8-12 weeks). |
| **Release (R4-REL-01, R4-REL-02)** | **The model is the product** (v1.3, now v1.4 with round 5): library + categories + rules + sport profiles + his answers + docs. The plan-writing engine was rebuilt ("I think you can try to build it now") as engine 0.5.0 and is now 0.7.0 - template-first, no time-fitting - and stays in the repository marked experimental. The website people will see is built after the model and the engine are finished: that is the next step (v1.4). |
| **Credit (R4-REL-03)** | "A complete coaching model from the experience of Coach Lalo (Gerardo Vera), Master NASM coach": his intellectual property and his workflow for putting programming together, free for anyone to build on. No "world's best" and no injury-prevention claims. Other certifications are added when he lists them. |

### 14.2 Decisions still open for him (13 §11)

**Answered by round 3**: N-PROD-02 (check-in step table: retired), N-PROD-05 (licence: MIT), N-PROD-08 (learning data: retired, nothing kept), N-PROD-13 (release every build or rebuild incl. each new block), N-PROD-15 (lawyer-written short screen + PAR-Q+ link), N-PROD-16 (record printed, not stored), N-PROD-18 (event dates approved), N-PROD-19 (the failed answer: retired with the check-in). **Answered or closed in v1.3**: the release box is required before a plan shows (R4-SCP-02); everyone may use the plans (R4-SCP-01); video links (R4-LIB-05); N-PROD-27 is moot (the time check is retired, CT-01). **Still open**: N-PROD-09 free vs paid; N-PROD-10 plan names shown to users; N-PROD-11 the 8 knee-band core exercises (default: ball or pad squeeze); N-PROD-14 where "send us your video" goes; N-PROD-17 the picker fallback for competitive Olympic weightlifting; N-PROD-20 Olympic % coach opt-in (default: off unless tested and switched on). **New (round-4 candidates, §16.6)**: N-PROD-21 remember the last plan on that one phone, or nothing; N-PROD-22 week-by-week as a Week-view alias; N-PROD-23 a cookieless page counter or nothing; N-PROD-24 one box or separate ticks (lawyer's call); N-PROD-25 Focus muscles for competitive field athletes; N-PROD-26 learning from data off for good.

### 14.3 The seven sample plans he will grade (R2-GEN-07; mapping PROPOSED; 04, 05, 06 v1.2)

| Sample plan | Default intake | Profile / template | Mode / skeleton | What it shows |
|---|---|---|---|---|
| **Swimming** | competitive swimmer (high school / club / college), middle distance, 3 dryland days + 1 optional | `swimming_middle` (sprint / distance alternatives; main stroke variant); athletic.3 or .4 (cross pattern) | SEASON: ATHLETE_OFF_C12 (or ATHLETE_PRE_6 when the first meet is ≤ 6 weeks away) | the **approved** dryland defaults (R3-ATH-01): 25 % plyometric at block end, shoulder care every session (no bands), Olympic 2-3 ×, 0 extra gym cardio, 2-week championship taper with the swim taper |
| **Football** | high-school player, skill position (or lineman), off-season | `football_skill` (QB, RB, big skill, OL, DL, K/P alternatives); athletic.4 (A1/B1/A2/B2) | ATHLETE_OFF_C12 | VOL 1 → 3, plyo end 60 % (linemen 40 %), aerobic 3, Olympic up to 4 ×, cross pattern (same-pattern template for linemen / size goals), pre-season 4-6 weeks, game-heavy in-season rule |
| **Soccer** | off-season or pre-season player | `soccer` (midfielder base; defender, forward, GK); athletic.4 | ATHLETE_OFF_C12 / ATHLETE_PRE_6 | plyo end 60 % (GK 50 %), aerobic 3-4, contralateral unilateral loading, game-heavy in-season rule |
| **CrossFit-style bootcamp** | gen-pop class member | `crossfit_class`; hybrid_crossfit.4 alternative 'crossfit_style_bootcamp' (class model, HALF TIME levels) | C12_HYBRID | warm-up → light core → skill → strength / power → WOD; wall balls and sled pushes may be picked in the WOD (R4-LIB-01, PROPOSED reading) |
| **Bootcamp** | gen-pop, 3-6 sessions a week | `fat_loss` + bootcamp format; fat_loss_bootcamp.4 alternative 'bootcamp_circuit' (two circuits a day) or .6 | C12_GENERAL (BOOTCAMP row) | the stairway in rounds and seconds; every group 2 stations (calves one) |
| **Full-body aesthetics** | gen-pop L1-L2 | `bodybuilding_aesthetics` (aesthetics_3day variant); aesthetics.4 (A1/B1/A2/B2 + optional days), same pattern | C12_HYPERTROPHY (full-body template) | his A / B days (6-8 exercises; R4-SES-05); an incline press in the Chest / Shoulders slot (R4-LIB-03); the stairway reaching its final sets; 4 aerobic incl. a 2nd Orange; HARDEST 9-12 with MYO on the last isolation |
| **Push / pull / legs** | L2 | `bodybuilding_aesthetics` (aesthetics_12wk_ppl); aesthetics.6 'ppl_x2' | C12_HYPERTROPHY (PPL template) | split days 3-4 exercises per group; heavy squat and heavy deadlift on different leg days; HARDEST 9-12 |
| *Bonus: pickleball (gen pop)* | 55 years old, stay athletic and active, plays 3+ times a week | `rec_pickleball` (racket 50+ defaults) | C12_GENERAL (stay-active) | play days, the activity as cardio, low-impact jumps, calves / Achilles every leg day; on 2 days the 2-day rule (every big group at about 6-8 weekly sets, a third day suggested; R4-SES-03) |

He wrote "five" but listed seven; the team plans for seven (INFERRED), plus the pickleball bonus. **v1.3:** the eight sample plans in `samples/plans/` are generated by engine 0.5.0 on model 1.3.0 (his templates, no time-fitting, the liability gate, the release line). Their review status is in `samples/STATUS_v0.5.md`; the 94-intake benchmark is in `design/bench/V05.md`. **Round 5:** The coach graded the 8 sample plans in round 5 (engine 0.6.0): A for 01 swimming, 02 football and 07 push / pull / legs; B+ for the other five (COACH-R5 R5-GRD-01 ... 08). **v1.4:** the plans are now generated by engine 0.7.0 on model 1.4.0 with his notes applied; the latest results are at the end of `samples/STATUS_v0.5.md` and in `design/bench/V07.md`.

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
| **Autoregulation inside a fixed plan (v1.2)** | Graham & Cleather 2021; Zhang et al. 2021; Hickmott et al. 2022; Helms et al. 2020 | the RIR cue moves the load with the day while the sets follow the printed stairway; no check-ins (R3-VOL-02, R3-VOL-04) | supports: RIR-based autoregulation does at least as well as fixed loading |
| **Time-efficient training (v1.2)** | Iversen et al. 2021; Weakley et al. 2017; Robbins et al. 2010 | supersets recommended to save time (R3-SES-02) | supports: paired sets save time with similar outcomes |
| Taper | Bosquet 2007 meta-analysis (about 2 weeks, volume -41-60 %, intensity kept); Pritchard 2016; **Aouani 2024** (swimming) | pre-season taper 1-2 weeks; swimming championship taper | supports |
| Unilateral vs bilateral | Liao 2022 (14 studies) | bilateral → bilateral strength; unilateral → single-leg jumps | supports his split |
| Athletic layer | Verkhoshansky, Cometti → Dietz (French contrast), Zatsiorsky → Westside, NSCA plyo guidance, Mach drills, Sheppard & Young; fast vs slow SSC ~250 ms (Schmidtbleicher; Flanagan & Comyns 2008) | ground-contact rule, approved shares, Receive-Create stages, contrast at 78-85 % | ADAPTED / FAITHFUL |
| **New sports (v1.1)** | 04 v1.1 references (swimming block / wall contact times, swimmer-shoulder prevalence, team-sport injury and concussion data); **Davids 2026** (HYROX demands: aerobic base, anaerobic power, local muscular endurance, maximal strength); **SFIA 2025** (pickleball the fastest-growing US sport, 24.3 million players in 2025, strong 65+ engagement); K34 (pickleball injuries mostly in adults 50+; falls, wrist fractures, Achilles ruptures) | sport profiles, 50+ / 60+ rules, HYROX overlay | supports the defaults; 12 claims spot-checked (10 verified, 2 only in part; the pickleball "~70 % of max HR" claim reworded to moderate intensity with vigorous bursts; the NCAA swimmer-shoulder shares flagged unverified) |
| Older adults | Borde 2015; NSCA (Fragala 2019) | machines, power work by choice | supports EQ-03, R2-ATH-08 |
| Periodization | Grgic 2017, Harries 2015, Williams 2017, Moesgaard 2022, Damas 2016, Issurin 2010, Kiely 2012 | the stairway with the hardest weeks last, VOL 1/2/3 blocks | supports; the value is a gradual ramp, a hard finish and recovery between blocks |
| Borrowed wholesale | Chris Hinshaw half-marathon plan (the longest run, used as-is); Westside structure in the strength track | | BORROWED / ECHO |
| Not used | 5/3/1, Texas Method, Prilepin | | not his lineage (COACH-CHAT) |

Scorecard (07 §14, unchanged): FAITHFUL 38 %, ADAPTED 43 %, OWN 20 %, CONFLICT 7 % of 138 concepts. **His own contributions** (keep as editable rules): the lunge triad, four force phases in his order, two jumping tracks, COD graded by turn severity, the squat ladder by upright posture, knee + pull / hip + push pairing, the Blue/Green/Orange aerobic system, the work / accessory / nuance / survival, the quality × month × level grid, pain = substitute first, the EFFORT scale with 8 as the bullseye and 10 as a successful max, the receive → create plyo method (Receive-Create stages), ground-contact-based plyo:ballistic, first-exercise-first set addition, **the stairway with "brutal" last weeks and the felt 2 → 11**, **"blocks are completed" (stop → maintenance or a new block; "when the block ends, it just ends")**, **the two spine days**, **"never one exercise per muscle" on split days (on his A / B days the template decides, R4-SES-05)**, **"kick out a program" with no feedback loop**, **his A / B full-body template (pull + knee dominant, push + hip dominant) and sessions sized by exercise count, with the session's time left to the person (v1.3: CT-01, R4-SES-05; his round-3 time-vs-minimums order is retired, §5.6.1)**, **"maintenance weeks are a recommendation"**. **Remaining tensions**: Olympic 4 × 8 @ 75 % (kept only for DB/KB and pulls; full lifts 3-5, R2-ATH-05); French contrast "immediately" vs PAPE rest (kept as written); 1:1:1 aerobic colours are not polarised endurance training (fine for team and strength clients; endurance athletes follow their own sport plan); his "20-30 sets for most people" is high against direct-set surveys (§5.8).

---

## 16. Still-open items

### 16.1 Unanswered, skipped, not understood (status after round 4)

| ID | Item | Status |
|---|---|---|
| **R2-VOL-08** | where a new set goes when a day type runs twice a week, and where a small-muscle bonus exercise goes | **answered**: re-asked in plain words as R3-VOL-03, **RIGHT** (§5.5) |
| Round 3 (13 questions) | R3-VOL-01 … R3-GEN-01 | **all answered** (12 RIGHT, 1 PARTLY); none skipped, none not understood (§0c.1, §16.5) |
| Round 4 (20 questions), CT-01, CX-01..04 | R4-SES-01 … R4-REL-03; session time; progression and editing | **all answered** (15 RIGHT, 4 PARTLY, 1 NOT RIGHT with his own template); none skipped, none not understood (§0d.1, §0d.5) |
| LIB-10, LIB-12 | KB face pulls; bench push-ups | answered in round 2 (R2-LIB-04, R2-LIB-05) |
| PRG-01, FIX-01 (skipped) | 'NO ACCESS' tabs; its Unilateral HD dropdown | answered by R2-LIB-08 |
| CAT-12 (not understood) | one-detail variants | answered by R2-LIB-01 |
| R2-VOL-05, R2-VOL-03 (no chip) | glute credit; no check-in | answered in words (R2-VOL-03 now superseded by R3-VOL-02: no check-in at all) |

### 16.2 Tensions inside his answers

**Round-2 tensions (§0b.3) and what round 3 did with them:**

| # (§0b.3) | Tension | Status after round 3 |
|---|---|---|
| 1 | Life cells of the approved step table vs no lifestyle inputs | **moot**: the check-in itself is retired (R3-VOL-02) |
| 2 | Rear delts 4 / 6 / 8 own sets vs "nobody needs less than 10" | **settled**: rear delts are part of the shoulders group; the floor is counted on the group (R3-VOL-01) |
| 3 | R2-VOL-08 not understood | **settled**: the default approved (R3-VOL-03) |
| 4 | "2 → 11" felt climb vs VOL-13 "no planned RIR ramp" | **settled**: the 3 → 1 RIR drift inside 1-3 approved (R3-VOL-04) |
| 5 | His check-in numbers vs small steps early | **moot**: no check-in; the stairway numbers approved (R3-VOL-04) |
| 6 | 60+ "low ankle hops still OK" vs "no plyos by default" | **settled**: ankle hops off by default, switchable (R3-ATH-02) |
| 7 | Floor of 10 vs maintenance and athlete budgets | **stands** (R3-VOL-01 PARTLY commented only on rear delts): floor for training blocks only |
| 8 | Holiday weeks vs never maintenance inside a block | **settled**: holidays planned between blocks; a mark inside a running block ends it unless removed (R3-PER-01) |
| 9 | Recovery week counting | **settled**: an extra week (12 + 1), and only a recommendation (R3-PER-01) |
| 10 | "2-4 per muscle" vs the 12 + 2 field-athlete cap | **settled**: 2-4 per group trained that day; cross pattern default; same-pattern template for size / high-level athletes (R3-SES-01); v1.3: on full-body days his A / B template gives each group its exercises (R4-SES-05) |
| 11 | 'High rows' | **settled**: HYROX (R3-ATH-03) |
| 12 | Olympic % "when tested" vs "only for competitive lifters" | unchanged: off unless tested and a coach switches it on (N-PROD-20) |

**Round-3 readings** (two answers pulling against each other, or a gap inside an approved proposal) are in **§0c.3** (17 rows: ceiling vs step size, 2 × 45 minutes, Focus muscles in the time check, the step-2 clamp, the Q1 cut, the rebuild input, December maintenance, week-by-week, learning from data, 60+ snatches, 'goalkeepers', the floor in maintenance, side-delt dose, test reminders, field-athlete Focus muscles, switched-off easy weeks, the swimmer age threshold).

**What v1.3 did with the round-3 readings.** Rows 1 to 5 of §0c.3 are settled or retired: ceiling vs step size (the planned final sets are reached, CX-01); 2 × 45 minutes (the 2-day rule, R4-SES-03; no time limit, CT-01); Focus muscles in the time check and the step-2 clamp (retired with the time check); the Q1 cut (a block may keep its sets, CX-02). Row 6 (the rebuild input) keeps its PROPOSED input with the R4-PRG-04 rule. The other rows stand. **The v1.3 readings are in §0d.3** (20 rows).

**Round-1 tensions after rounds 2 and 3:**

| v1 tension | Status |
|---|---|
| GEN-03 "track themselves" vs GEN-05 "adjust from logs" | **settled by round 3**: people track for themselves in the downloaded sheet; the tool never adapts from logs (R3-VOL-02, R3-VOL-04) |
| VOL-01 "learns from the data of all the people" | **superseded**: "I don't want any data kept" (R3-GEN-01); N-PROD-26 asks whether for good |
| PER-01 quarter wording | **settled**: approved gen-pop year (R2-PER-01) |
| Zones 1 and 3 both external rotation; supported overhead lifts foundational | **settled** (R2-LIB-02) |
| LIB-18 '21.6 mile run' | **settled**: removed (R2-LIB-06) |
| VOL-08 "max maybe 12" vs VOL-17 "12 to 14" | **settled**: 12 + the 2-exercise core block (R2-SES-04) |
| VOL-07 "3-4 per muscle" vs full-body days | **settled**: 2-4 per group, never 1 (R2-SES-05; groups R3-SES-01); **v1.3: that holds on split days; on full-body days his A / B template gives each group its exercises (R4-SES-05)** |
| LIB-14 thrusters | **settled**: 1.0 / 0.5 / 0.25 (R2-VOL-05) |
| ATH-10 Olympic for all vs the baseball in-season block | **settled**: in season a light 2 × 3, up to 4 × a week off-season (R2-ATH-04) |
| ATH-07 aesthetics 4 vs "never the same colour twice" | **settled**: a second easy Orange; counts adjustable (R2-SES-06) |
| EFFORT '9 - That was terrible' vs "leave 1 in the tank" | **settled**: rate against the target; 10 = successful max (R2-VOL-02); now only the sheet's helper text |
| PER-05 "half the sets" vs written deloads at 0.75-1.0 × week 1 | **settled**: half of the hardest week, between blocks only, recommended (R2-VOL-07, R3-PER-01) |
| PER-04 "load it once per week" + deadlifts | **settled**: two spine days (R2-SES-01, R2-SES-02) |
| UNI-10 minimal bilateral in season vs baseball ~55/45 | UNI-10 wins (answer over sheet): 20/80 |
| LIB-20 strap rotations vs LIB-09 removal | removed (LIB-09 explicit) |
| EQ-03 "never depth jumps / snatch" for older clients vs R2-ATH-08 / R3-ATH-02 | depth jumps and Olympic lifts switchable for 60+; snatch variants stay out (reading, §0c.3 #10) |

### 16.3 PROPOSED register (where each lives)

Volume (§5.10; 12 §7): group credit; the shoulders line's side-delt dose; the Focus default +2; the 2-day numbers; the session-size defaults; slots 7 and 8 of the A / B days; the allocation details and the capped-group wording; the incline-press credit; the acceleration-note details; "blocks completed in a row"; the printed self-adjust guide; the field-athlete floor; small lines on big ceilings; calves to 10; Pro numbers; the time-estimate numbers; stairway staggering; L3 definition; the stair-level number. Bilateral (§6): shares for profiles he did not name, recreational COD shares, contra/ipsi percentages, frontal/transverse share, pain shift. Levels (§3): L3, Pro. Library (§4.6): KB-swing home, neck, jerks, long distance tests, the add-on list a plan offers, the two mid-range pull records, the CrossFit "maybe" switch. Variables (§7.9): power-catch reps, French contrast 4th member, HYROX station dosing. Equipment (§8.6): second squat day at home, HYROX kit substitutes. Athletes (§9.12): 'goalkeepers' and 60+ snatch readings, swimmer age threshold, game-heavy rule for the six still-INFERRED profiles (cheer, gymnastics, competitive pickleball, tennis, wrestling), OCR's 4 cardio sessions, contact / throw / Olympic tiers, fight camps. Sessions (§10.9): which blocks may be switched off, superset wording, block ids, laterality on the athletic days, bootcamp two circuits, in-season size, the optional-day Calves slot. Plans (§11.8): week-by-week alias, the rebuild input, easy weeks switched off in the year, the athlete season print, maintenance split and default, hemisphere shift, 8-week phase weeks. Tests (§12.3): rest-of-week dose, long distance items. Generator (§13): intake copy, the edit mechanism (scopes, notes not refusals, the "edited" stamp), the swap-note wording, the health check after R4-SCP-01, the answers file, cardio repeat order, Olympic % opt-in. Product (§14): layouts, landing views, device memory (N-PROD-21), page counter (N-PROD-23), one box vs separate ticks (N-PROD-24), the release-line wording and all legal copy (LEGAL REVIEW).

### 16.4 Integration to-do (v1.3)

| File | What is owed | Basis | Owner |
|---|---|---|---|
| `model/` | ~~recompile (`node tools/compile-model.mjs`)~~ **done in the release check of 2026-10-11** (`RELEASE_CHECK_v1.3.md`): the manifest and the changelog now record spec 1.3.0 and its hash, and nothing else in the compiled model changed (every runtime file is byte for byte the same). Recompile again after any later edit to the spec or to a `synthesis/*.json` source | this pass | lead |
| `synthesis/03_volume_rules.json`, `05_templates.json`, `06_periodization.json`, `11_training_variables.json`, `12_volume_algorithm_v1.json`, `04_profiles.json` | not re-issued in v1.3. They still hold v1.2 objects (session caps by minutes, the time-vs-minimums tables, the 7 % / 10 % limits, planned targets with λ ≤ 1, "cap + 1"). The compiler layers `tools/fixture/v05-structure.mjs`, `v05-library.mjs`, `v05-words.mjs`, `v05-integrate.mjs`, `v05-fix1.mjs` and `v05-fix2.mjs` replace them at compile time. Decide: re-issue the JSON files, or keep the layers as the record | CT-01, CX, round 4 | model owner |
| `tools/compile/i18n.mjs`, `tools/fixture/build-fixture.mjs` | still read `spec.adaptation.copy.strings`, `spec.adaptation.checkin_schema` and every `inputs_schema.fields` label, the retired session-length field included. The spec keeps those keys, marked retired, until the reads are dropped | R3-VOL-02; CT-01 | engine owner |
| `synthesis/01_taxonomy`, `02_exercise_catalog.md`, `10_equipment_model`, `07`, `08`, `09` | not re-issued: the mid-range pull node `RP.PL.M`, the optional add-on status, carries by distance or time, the search-only video rule; `09_generator_inputs.md` is the v0 intake proposal (a status note now points to §13.2) | R4-LIB-01..05 | file owners (next re-issue) |
| `README.md`, `AGENTS.md`, `HANDOFF.md`, `llms.txt`, `MODEL_CARD.md`, `docs/` | rewritten for v1.3 in the same release pass by another step, not by this one. Every spec key path they cite still resolves in spec 1.3.0 (checked, Appendix B). Check once more that they name `BLAZE_CAMP_BRAIN.md` v1.3 and spec 1.3.0 after the recompile | round 4 | repo owner |
| the coach | the open questions of §0d.3 (rows marked "yes") | - | next conversation |

**The v1.2 list (history).** Engine 0.4 and 0.5 worked through the engine, tools, model and sample rows below (`engine/DECISIONS.md` sections E and G; `model/CHANGELOG.md`). The rows about synthesis source files are carried into the table above.


| File | Fix needed | Basis | Owner |
|---|---|---|---|
| `tools/fixture/` (i18n) and the compiler | the compile stops (exit 1, writes nothing) on exactly 26 retired or renamed i18n keys (`checkin.*`, `intake.output_mode.*`, `intake.email.label`, `intake.priority.*`, `maint.end`, `block.cannot_finish`, `block.done`); drop them from the fixture, add the new keys (`intake.focus.*`, `release.own_risk`, `edit.*`, `time.*`, `plan.next_steps`, `health.parq_link`, `privacy.nothing_kept`, `warn.racket_50_impact`) and recompile; **do not restore them in the spec** | R3-VOL-02, R3-GEN-01, R3-SES-01 (spec `_meta.v1_2_changelog[0].pending_cross_refs`) | engine stage B1 |
| `tools/compile/i18n.mjs` (~l. 92, 95), `tools/fixture/build-fixture.mjs` (~l. 105, 107) | still read `spec.adaptation.copy.strings` and `spec.adaptation.checkin_schema` (now empty stubs): drop the reads, then delete the `adaptation` key from the spec | R3-VOL-02 | engine stage B1 |
| `tools/fixture/rules.mjs` | still caps 60+ steps at 3 % | R3-VOL-04 (cap retired) | engine stage B1 |
| `tools/compile/rules.mjs` | still gives rear delts their own targets (4 / 6 / 8, `own_sets: true`) and still carries the retired end-of-maintenance prompt; its stairway limits mirror 12 v1.1 | R3-VOL-01, R3-PER-01 | engine stage B1 |
| `tools/compile/crosscheck.mjs` X01 / X02 / X05 | still compare against the engine's v1.1 rules (rear-delt line, 60+ 3 % cap); expect mismatches until rules.mjs follows 12 v1.2 | R3-VOL-01, R3-VOL-04 | engine stage B1 |
| `tools/compile/templates-profiles.mjs` | recognises the Calves-slot condition only when it contains the word "priority"; 05 v1.2 now says "a Focus muscle" | R3-SES-01 | engine stage B1 |
| `tools/fixture/review-v12.mjs` (amendSport) | turns the racket `age_50_plus` plyo text into plyo exclusions at every age on rec_pickleball / rec_padel / rec_tennis / pickleball_competitive; apply them only when age ≥ 50 | R3-ATH-02 (04 flag G4) | engine stage B1 |
| `model/` | stale against the v1.2 sources: recompile once B1 has fixed the fixture (test 10) | - | engine stage B1 |
| `engine/intake.mjs`, `engine/validate.mjs`, `engine/CONTRACTS.md` | still carry `output_mode`, the check-in, `email` and `priority_muscles` paths; move to `intake/3` (`focus_muscles` with the alias; F25c `last_block_finished` and the count; F11r `play_minutes`; F44 `superset_recommendations`, `racket_50_impact_opt_in`; the one-box release) and `plan/2` (block ids and kinds, toggles, superset recommendations, `time_check`, `not_trained_directly`, edits, `next_steps`); retire `adapt()`, `checkinRow()`, the block offers; add `applyEdits()` and V27-V31 | R3-VOL-02, R3-VOL-04, R3-SES-01, R3-SES-02, R3-PER-01, R3-GEN-01 | engine stages B1-B3 |
| `samples/intakes/*.json`, `samples/plans/` | move the eight intakes to `intake/3` (no output mode, no email; `focus_muscles`; the release own-risk field) and regenerate the plans; `samples/RECHECK_v0.3.md` lists 136 open coach-eye issues found in the v0.3 plans | R3 (all) | engine stages B1 / B4 |
| `synthesis/12_volume_algorithm_v1.md` §5.4 | the maintenance week has no calf exercise on its Tuesday and Friday hip days | R3-SES-01 (calves every leg day) | volume owner |
| `synthesis/01_taxonomy`, `02_exercise_catalog`, `10_equipment_model` | not re-issued in round 3: rear delts inside the shoulders group and the FOCUS groups (01 facets; 02 `muscle_credit` display ids stay); 60+ client rules (R3-ATH-02: depth jumps switchable for 60+, snatch variants out); the racket 50+ selection; wall balls / HYROX stations as finisher conditioning (R3-ATH-03); the `older_default_excluded` list against the new on / off defaults | R3-VOL-01, R3-SES-01, R3-ATH-02, R3-ATH-03 | file owners (next re-issue) |
| `README.md`, `AGENTS.md` | `README.md` still says "Model: v1.1", describes the spec as holding "check-in adaptation" and lists "the weekly check-in screens, and accounts" as not built yet; `AGENTS.md` lists spec 1.1.0: point them to `BLAZE_CAMP_BRAIN.md` v1.2 / spec 1.2.0, the outputs-only product (no check-in, no data kept) and `coverage_matrix_round3.md` (`CONTRIBUTING.md` and `llms.txt` already describe round 3) | R3-VOL-02, R3-GEN-01 | repo owner |
| `generator_spec_v1.json` | synced in this step (see `_meta.v1_2_changelog`, step "master v1.2") | - | done |

### 16.5 Round 3: answered

`round3_questions.json` held 13 questions; every one is answered in `coach_answers_round3.md` (2026-10-09). Where each now lives (full trace: `coverage_matrix_round3.md`):

| ID | His verdict | The rule now (short) | Here |
|---|---|---|---|
| R3-VOL-01 | PARTLY + words | rear delts are part of the shoulders group (front + side + rear); the floor of 10 counted on the group; people and coaches can add more rear delts | §0c.2 #4; §5.1 V5, V5b; §5.3 |
| R3-VOL-02 | RIGHT + words | no check-ins at all; outputs only; people change the plan themselves | §0c.2 #1; §5.4c; §13.5 |
| R3-VOL-03 | RIGHT | added sets alternate between the two exposures of a day type; small-muscle bonus on the optional day or a day that trains it, never its only exercise | §5.1 V10-V11; §5.5 |
| R3-VOL-04 | RIGHT + words | the stairway approved in numbers (3 % / 5 %, ceiling in the last week, RIR drift); the plan kicks out once, whole, with few inputs | §0c.2 #2; §5.4; §11.3 |
| R3-SES-01 | RIGHT + words | FOCUS groups (hips, shoulders), calves one exercise × 3 per leg day, field-athlete layout; Focus muscle 1 / 2 with 1-3 extra sets | §5.1 V6b; §5.3; §5.6; §10.3; §13.2 |
| R3-SES-02 | RIGHT + words | time vs minimums in his order (**superseded by CT-01 in v1.3**; the rest stands); recommend supersets; switch off a day's athletic or core block; add or remove exercises or blocks | §5.6.1; §10.6; §10.10; §13.3 |
| R3-PER-01 | RIGHT + words | the easy week is a recommendation (an extra week); when a block ends it ends; holidays between blocks | §11.1; §11.2; §11.5; §11.6 |
| R3-ATH-01 | RIGHT | swimming dryland defaults and the 2-week taper with the swim taper | §9.11 |
| R3-ATH-02 | RIGHT | 60+ on / off defaults with the switch and warning; racket players 50+ | §9.9; §5.3 |
| R3-ATH-03 | RIGHT | HYROX plan (2 + 2 days, 4 cardio, 2 station circuits as finishers, wall ball ≤ 20 lb, 40-rep sets only in circuits, 50 % plyo) | §9.10; §9.7 |
| R3-ATH-04 | RIGHT | plyo shares for every remaining sport; cardio 2-4 / 0 extra; game-heavy rule for six more sports; recreational = activity share | §9.2; §9.4; §9.7; §9.8 |
| R3-ATH-05 | RIGHT | play days, the activity as cardio (up to 2), optional event date | §9.10; §11.2 |
| R3-GEN-01 | RIGHT + words | lawyer-written short health check EN / ES + PAR-Q+ link; coach skip; one own-risk + terms + release box every build; no data kept; MIT to Lalo Vera / Blaze Camp / BFit Studios Corp.; `DISCLAIMER.md` / `DISCLAIMER.es.md` | §13.1 G7, G8, G22, G27; §13.2; §14.1 |

### 16.5b Round 4, CT-01 and CX-01..04: answered

`round4_questions.json` held 20 questions; every one is answered in `coach_answers_round4.md` (2026-10-11). CT-01 is in `coach_answers_time_2026-10-10.md` and CX-01..04 in `coach_answers_codex_2026-10-10.md`. Where each lives: **§0d.5** (answer, verdict, the rule in one line, the section here, the spec key) and `coverage_matrix_round4.md` (28 rows, with every spec key and the compiled rule).

### 16.6 The v1.2 round-4 candidates: what happened to them (v1.3)

Round 4 was re-scoped after CT-01, so it asked different questions from this list. The last column says where each candidate stands now. **New open questions from v1.3 are in §0d.3** (rows 1, 2, 3, 5, 7, 9, 14, 18 and 20).

| # | Question | Our suggestion | From | Status in v1.3 |
|---|---|---|---|---|
| 1 | **Ceiling vs step size.** Some lines cannot reach their ceiling with your approved steps (an intermediate's shoulders 12 → 18 of 22 in 12 weeks; every 8-week line under the 12-week ceilings). Keep the small steps and stop below the ceiling, or make the late steps bigger (up to your 7 %)? | keep the steps; the ceiling is a maximum | 12 §7 #16; 06 §14.5 #6; 03 t33; 11 Q25 | **answered**: the planned final sets are reached, with faster steps when needed (CX-01; R4-PRG-01, R4-PRG-02) |
| 2 | **Very short weeks.** With your minimums, 2 × 45 minutes holds one big group (hips) plus the calves. Right, or should short weeks train the big movers once a week each at 10 sets? | keep his minimums; say so up front (as built) | 12 §7 #5; 05 §11.4-1; 11 Q23 | **answered**: on 2 days every big group at about 6-8 weekly sets, a third day suggested (R4-SES-03); time is not a limit (CT-01) |
| 3 | **Focus muscles and the time check** (N-PROD-27): a Focus muscle that is an arm or the calves - still trained directly when the time is short? | yes, trim another small group | 13 §11.2 | **moot**: the time check is retired (CT-01) |
| 4 | **Next block one step up**: OK to ask "how many blocks did you finish in a row?" when someone builds the next block (nothing is saved)? | yes, 0 by default | 06 §14.5 #2; 12 §7 #7; 11 Q24 | **partly**: the rule is R4-PRG-04 (about 5 % above the last start, never above the top); the input itself is still PROPOSED |
| 5 | **The Q1 cut**: sets stay at the starting level (your round-2 rule) while the week still gets harder through cardio, density, load and effort - OK with "the stairway always climbs"? | yes | 06 §14.5 #5 | **settled**: a block may keep its sets while reps, load and cardio progress (CX-02) |
| 6 | **Week by week** (N-PROD-22): drop it, or keep the name as the Week view of a 12-week plan? | keep as an alias | 13 §11.2; 06 §14.5 #1 | not asked; default kept (alias) |
| 7 | **Shoulders**: one shoulders line gives an intermediate bodybuilder about 3-4 direct side-delt sets a week. Keep it, or keep a minimum side-delt dose inside the line? | keep; Focus = shoulders or V-taper adds more | 12 §7 #2; 03 t30; 11 Q21 | not asked; default kept |
| 8 | **Focus muscles**: default +2 sets (you said 1 to 3) on the start and the ceiling? | +2 | 12 §7 #3; 11 Q22 | not asked; default kept (+2) |
| 9 | **60+ snatches**: snatch variants stay out for 60+ even when Olympic lifts are switched on? | yes (EQ-03) | 04 G2 | not asked; default kept |
| 10 | **'Goalkeepers 50 %'** = soccer, lacrosse and field-hockey goalkeepers (the ice-hockey goalie stays 40 %, water polo 25 %)? | yes | 04 G1 | not asked; default kept |
| 11 | **Which blocks can be switched off**: core, skill, athletic, Olympic, focus, accessory, calves, finisher and cardio, never the warm-up; strength edited exercise by exercise? | yes | 05 §11.4-4; spec `plan_editing` | **partly**: everything is editable (CX-04); the on / off list is still ours |
| 12 | **Calves with fewer than 4 leg days**: one exercise × 3-4 sets gives 6-8 sets; the rest on the optional day - or may calves stay under 10 in 2-day plans? | the optional-day slot | 05 §11.4-3 | **partly**: on 2-day plans groups sit under 10 by rule (R4-SES-03); the calves top-up is still PROPOSED |
| 13 | **Field athletes' Focus muscles** (N-PROD-25) | offer them with a note that the sport comes first | 13 §11.2 | not asked; default kept |
| 14 | **Learning from data** (N-PROD-26): off for good? | off; the model improves through his reviews | 13 §11.2 | not asked; default kept (off) |
| 15 | **Device memory** (N-PROD-21), **page counter** (N-PROD-23), **one box vs separate ticks** (N-PROD-24, the lawyer's call) | forget by default; nothing; one box | 13 §11.2 | not asked; defaults kept. The release box itself is required (R4-SCP-02) |
| 16 | **Younger or lower-level swimmers** = under about 14, or L1? | yes | 04 G3 | not asked; default kept |
| 17 | **Switched-off easy week in the year**: the next block starts a week earlier and the spare week joins the December holidays? | yes | 06 §14.5 #3 | not asked; default kept |
| 18 | **Athlete season plans**: one printed plan from the season dates (off-season blocks + pre-season to the first game), then the in-season plan built in the app? | yes | 06 §14.5 #4 | not asked; default kept |

Not asked (defaults kept, can be raised later): group credit (an engine detail), the Pro setting numbers, the printed guide wording (comes with the cue-line review), Olympic % opt-in (N-PROD-20), "send us your video" contact, competitive Olympic weightlifting template, Spanish names (approved process, lines to come), neck work, taekwondo class, run plans beyond the half marathon.

---

## Appendix A. His labels (verbatim) → canonical names (v1.2; unchanged in v1.3)

| Verbatim (his spelling) | Canonical | Basis |
|---|---|---|
| 'TRIPPLE EXTENSION' | triple extension | FIX-04 |
| 'SAGITAL' | sagittal | FIX-04 |
| 'INTERMIDIATE' / 'MODERATE' | intermediate (exercise level L2) | FIX-04 |
| 'BILATERAL HIP DOMNANT' | bilateral hip dominant | FIX-04 |
| 'ABdution' | side-delt (abduction) slot inside the shoulders group (rear delts are part of it, not tracked apart); KB face pulls live here | VOL-17; R2-LIB-04; R3-VOL-01 |
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
| "10 - I'm done" | the most I could do, and I made it (0 RIR; not a fail); the helper line of the downloaded sheet's EFFORT column | R2-VOL-02; R3-VOL-02 |
| "Couldn't do it" | the failed set: a HOW IT FELT? option in the downloaded sheet; the printed guide says use the easier listed version next time | GEN-05; R2-VOL-02; R3-VOL-02 |
| "start at a 2 and end at an 11" | the felt level of the week (overall volume and loading), shown as the stair level | R2-PER-05 |
| '21.6 mile run' | removed from plans and tests (his "marathon"; a marathon is 26.2 mi) | LIB-18; **R2-LIB-06** |
| 'park queue' (spoken) | PAR-Q (Physical Activity Readiness Questionnaire); v1.2: a short Blaze Camp health check + a link to the official PAR-Q+ | R2-GEN-03; R3-GEN-01 |
| 'high rows' / 'high-raw athletes' (spoken) | HYROX (fitness race) | **confirmed, R3-ATH-03** (COACH-CHAT 2026-10-08, EQ-06, VOL-11) |
| 'SHOULDERS/TRAPS', 'QUADS', 'HAMSTRINGS', 'GLUTES' ... (FOCUS headers) | the FOCUS groups: hips = glutes + hamstrings, shoulders = front + side + rear delts | R3-SES-01, R3-VOL-01 |
| "main focus muscle 1 / 2" (spoken) | Focus muscle 1 / Focus muscle 2 (intake; +1 to +3 sets each) | R3-SES-01 |
| "kick out a program" (spoken) | the generator outputs the whole plan once (no check-ins, nothing kept) | R3-VOL-04 |
| "maintenance weeks are a recommendation" (spoken) | the easy week / maintenance after a block is recommended, not mandatory | R3-PER-01 |
| 'FULL TIME' / 'HALF TIME' (CrossFit) | competitor / class member | PRG-10 |
| 'Buy out' | conditioning finisher (CA.BUY) | OBSERVED |
| 'LACTATE CLERANCE', 'BEGGINER', 'RECCOMENDED', 'Coppenhaggen', 'Harmstring', 'Glidder', 'Sqats', 'presercibe', 'INTENSIONALLY' | lactate clearance, beginner, recommended, Copenhagen, hamstring, glider/slider, squats, prescribe, intentionally | FIX-04 |

---

## Appendix B. How this file was built and checked

**v1.3 (2026-10-11)**
- **Read in full first**: `design/ENGINE_V05_PLAN.md` (the binding plan), `coach_answers_round4.md` (20 answers), `coach_answers_time_2026-10-10.md` (CT-01), `coach_answers_codex_2026-10-10.md` (CX-01..04). Verdicts counted from the file: 15 RIGHT (9 with words), 4 PARTLY (R4-SES-04, R4-SCP-02, R4-REL-02, R4-REL-03), 1 NOT RIGHT (R4-SES-05).
- **Archive first**: the master was copied to `BLAZE_CAMP_BRAIN_v1_2.md` before any edit (v1.2 as it stood, with the one-row Z-press correction made during the engine v0.5 work).
- **Read for v1.3**: `engine/DECISIONS.md` section G (the decisions of engine 0.5.0), the v0.5 keys of `model/rules.json` (`session.size`, `volume.two_day`, `volume.floor`, `stairway.progression`, `cycles.next_block`, `placement`, `time_model`, `selection.addons`, `conditioning.carry`, `selection.mid_range`, `selection.incline_first`, `legal.gate`, `legal.release_line`, `render.*`, `validation`), the skeletons in `model/templates.json`, the word lists in `model/i18n/`, and the rule sections of 03, 04, 05, 06, 11, 12 and 13.
- **Recomputed** with the engine kernel (`engine/progression/stairway.mjs` `planStairway`; `engine/progression/prescription.mjs` `nextBlockStart`): the 21 stairway rows of §5.4 (12, 8, 6 and 4 weeks; every level; Focus +2; the 2-day plan), the reference curves of §11.3 and the repeated blocks of §11.4. Check: the 12-week L2 big group is still 15 → 22 with its last four weeks at 19, 20, 21, 22 (his approved example).
- **Cross-file decisions** for v1.3 added to §0.3 (8 new rows, 9 older rows updated) and mirrored in `generator_spec_v1.json > _meta.integration_decisions`; the readings the coach should see are §0d.3 (20 rows); the trace of every answer is §0d.5.
- **Spec synced** (`_meta.v1_3_changelog`): version 1.3.0; the session-length field and `D15_time_fit` retired; `rule_tables.session_limits` (`no_time_fitting`, `session_size`, `two_day_rule`, `nothing_dropped`), `time_model.use = estimate_only`, `rate_engine.progression_v1_3` with the planned targets recomputed, `set_placement.allocation_v1_3`, `library_decisions.v1_3`, `template_refs.skeletons_v1_3`, `plan_types.cycles.next_block_v1_3`, `plan_editing.v1_3`, `legal_and_privacy` (`liability_gate`, `release_line`, `credit`), `vocab.profile_confidence`, the pipeline, the validation checks (V1-V37, the engine's list), `open_decisions`. The keys the compiler reads were left as they were: the retired session-length field stays in `inputs_schema.fields`, marked retired; only the two retired time strings were moved out of `output.copy.strings` (the compiled word lists do not change). Retired objects stay at their v1.2 paths with a status that says so, so older references resolve.
- **Synthesis documents**: 03, 04, 05, 06, 11, 12 and 13 each got a v1.3 section (it wins over their later sections), in-place edits of their rule tables, and a "RETIRED in v1.3" or "Changed in v1.3" note under every section the new answers supersede; `09_generator_inputs.md` got a status note. Their rule blocks are the same text as this file's (§4.1b, §5.4-§5.6, §7.4, §10.5, §10.8, §10.10, §11.4).
- **Retired ideas** (the time check and every use of minutes as a limit, "train fewer groups directly", the 7 % and 10 % limits, λ ≤ 1, the minimum climb and "never flat", the next block's "cap + 1", "2-4 exercises per group, never 1" on full-body days, third-party video links) appear in this file only as retired entries, history rows or verbatim quotes (§0d.4).
- **Checks** (python / node): every round-4, CT and CX ID is cited in this file and in the spec; every spec key cited in §0d.5 and in `coverage_matrix_round4.md` exists; every spec key path that `docs/`, `README.md`, `AGENTS.md`, `HANDOFF.md`, `llms.txt`, `MODEL_CARD.md` and the earlier coverage matrices cite, and that resolved in spec 1.2.0, still resolves (1,271 paths, 0 broken); 0 Markdown table rows with a wrong column count in this file and in 03, 04, 05, 06, 11, 12 and 13; the spec parses and keeps its 1-space format; a scan of every spec string for the retired rules finds them only under retired or history keys. **Compile check**: `node tools/compile-model.mjs --out <scratch>` with the edited spec gives `catalog.json`, `rules.json`, `templates.json`, `profiles.json` and the three word lists byte-identical to `model/`; only `manifest.json`, `CHANGELOG.md` and `COMPILE_REPORT.json` differ, by the spec version (1.2.0 → 1.3.0) and the spec's hash. **Tests**: `node --test tests/` gives 1,400 pass, 1 fail, 2 skipped, 4 todo; the one failure is "model/ on disk is the current compile of the sources", which a recompile clears (checked in a scratch copy of the repository: fixture and model rebuilt there, the compile, library and model tests pass).
- **Not done here**: no Google Sheet was opened or changed; no file in `engine/`, `model/`, `tests/`, `samples/` or `tools/` was edited (so `model/` must be recompiled by the lead, §16.4); the `synthesis/*.json` rule files were not re-issued; `README.md`, `AGENTS.md`, `HANDOFF.md`, `llms.txt`, `MODEL_CARD.md` and `docs/` were not edited by this step (another step of the same release rewrote them). This step wrote `BLAZE_CAMP_BRAIN.md`, `BLAZE_CAMP_BRAIN_v1_2.md` (archive copy), `generator_spec_v1.json`, `coverage_matrix_round4.md` and `synthesis/03`, `04`, `05`, `06`, `09`, `11`, `12`, `13` (`.md`).

**v1.2 (2026-10-09)**
- **Read in full first**: `coach_answers_round3.md` (13 answers). Verdicts counted with the team venv: 12 RIGHT (6 with words: R3-VOL-02, R3-VOL-04, R3-SES-01, R3-SES-02, R3-PER-01, R3-GEN-01; 6 without), 1 PARTLY (R3-VOL-01), 0 NOT RIGHT.
- **Archive first**: the v1.1 master was copied unchanged to `BLAZE_CAMP_BRAIN_v1_1.md` before any edit.
- **Read for v1.2**: the v1.2 change logs, resolution tables, verification logs and generator-facing rules of 03, 04, 05, 06, 11, 12 and 13; `generator_spec_v1.json` 1.2.0 with `_meta.v1_2_changelog` and its pending cross-references for the master step; `DISCLAIMER.md`, `DISCLAIMER.es.md` and `LICENSE` (referenced, not rewritten).
- **Recomputed** with the team venv: the 16 stairway rows of §5.4 (8 and 12 weeks; L1 / L2 / L3 big lines, shoulders / arms, Focus +2): λ and whole sets identical to 12 v1.2 §3.7.1 and `12_volume_algorithm_v1.json > stairway.planned_targets_by_level`.
- **Cross-file decisions** for round 3 added to §0.3 and mirrored in `generator_spec_v1.json > _meta.integration_decisions`; fixes owed by other files and the engine are in §16.4; round-4 candidates in §16.6.
- **Spec synced** (step "master v1.2" in `_meta.v1_2_changelog`): `rule_tables.priority`, `weekly_sets` (the shoulders line; rear and side delts retired as lines), `rate_engine` (limits; planned targets = 12 v1.2), `banking`, `pain`, `set_placement`, `session_limits` (field-athlete layout, the time-vs-minimums algorithm), `goal_phase_modifiers`, `athletic`, `conditioning`, `reps`, derived values D9 / D12 / D15, `pipeline[6]`, validation checks, `plan_types` notes (the values the compiler reads untouched), template references, `open_decisions`.
- **Coverage**: every round-3 answer (R3-VOL-01 … R3-GEN-01) is traced to a section here and a key in the spec in `coverage_matrix_round3.md`.
- **Retired ideas** (check-in, step table, readiness, `adapt()`, logbook as input, learning from data, week-by-week mode, block-at-risk offer, end prompts, rear delts' own sets, the 60+ 3 % cap, the time-overflow cut order, Apache-2.0 / CC BY 4.0, the email and output-mode fields) appear in this file only as retired entries, history rows or verbatim quotes.
- **Checks** (team venv / node): every round-3 ID is cited in this file and in the spec; every spec key and master section cited in `coverage_matrix_round3.md` exists; 0 Markdown table rows with a wrong column count; the spec parses, keeps its format and version 1.2.0, and the values the compiler reads are unchanged; the compiler (scratch output) stops on the same 26 retired i18n keys before and after the spec sync and writes nothing; `node --test tests/` gives 698 pass / 7 fail / 6 todo before and after (the same 7 failures, none from these edits).
- **Not done here**: no Google Sheet was opened or changed; no synthesis, engine, tools, samples, README or DISCLAIMER file was edited (their remaining fixes are in §16.4); this step wrote `BLAZE_CAMP_BRAIN.md`, `BLAZE_CAMP_BRAIN_v1_1.md` (archive copy of v1.1), `generator_spec_v1.json` and `coverage_matrix_round3.md`.

**v1.1 (2026-10-08, history)**
- **Read in full first**: `coach_answers_round2.md` (47 entries: 45 round-2 questions + LIB-10, LIB-12). Verdicts counted with the team venv: 38 RIGHT (20 with no words, 18 with words), 3 PARTLY, 2 NOT RIGHT, 4 answered in words without a chip (R2-VOL-08 not understood).
- **Read for v1.1**: the v1.1 change logs, resolution tables, pending lists and generator-facing rules of 01, 02, 03, 04 (incl. the sports merge and the sport verification), 05, 06, 11, 12 and 13; `generator_spec_v1.json` (incl. its `_meta.v1_1_changelog` pending cross-references); the coach's request of 2026-10-08 (every popular US sport, swimming, pickleball, HYROX).
- **Recomputed** with the team venv: the stairway λ and whole-set curves for 8 and 12 weeks (L1 / L2 / L3 big, small, rear delts, priorities) - identical to 12 §3.7.1 and 06 §7.1-7.2; the per-sport summary in §9.4 from `04_profiles.json` v1.1 (127 profiles) and the spec's F11 picker (52 sports).
- **Cross-file decisions** for round 2 added to §0.3 and mirrored in `generator_spec_v1.json > _meta.integration_decisions`; fixes owed by other files listed in §16.4.
- **Retired ideas** (readiness score and life input, intake sleep / stress / job, target-seeking, acclimation and 8-week caps, × 1.10 start, triggered or mid-block deloads, effort 10 = fail, KB-swing glute credit, hinge glutes 0.5, small starts 8 and small caps, floors 4 / 2, 1-2 exercises per muscle on full-body days, a once-a-week Olympic cap, mid-block tests, 1RM or max mile from zero, videos as a launch requirement, the 21.6-mile run) appear in this file only as retired entries, v1 history or verbatim cell quotes.
- **Coverage**: every round-2 answer (R2-* plus LIB-10 and LIB-12) is traced to a section here and a key in the spec in `coverage_matrix_round2.md`.
- **Not done here**: no Google Sheet was opened or changed; no synthesis file was edited (their remaining fixes are in §16.4); this step wrote `BLAZE_CAMP_BRAIN.md`, `BLAZE_CAMP_BRAIN_v1.md` (archive copy of v1), `generator_spec_v1.json`, `coverage_matrix_round2.md` and `round3_questions.json`.

**v1 (2026-10-08, history)**: built from `coach_answers_full.md` (138 of 140 answered) and `coach_answers.md`, the v1 synthesis files and the v0 master (archived as `BLAZE_CAMP_BRAIN_v0.md`); the VOL-07 placement sequence and the v1 12-week curves were recomputed; a coverage audit traced all 138 answered questions to the master and the spec (`coverage_matrix.md`) and fixed hinge glute credit 0.5 → 0.25, the bodybuilder upper-body share, the L1 priority cap, FIX-02 cardio menus, the V1 safety check, the P6 cross-reference, the L1 acclimation tag, 'Justice League' as a sheet-tab quote, the youth example rule and push press from L1.
