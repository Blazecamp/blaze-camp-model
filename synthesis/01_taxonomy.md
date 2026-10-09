# 01 · The Blaze Camp taxonomy: how the coach segments training

**What this is.** The single reference for *how Blaze Camp (IG @BLAZECAMP) buckets every exercise, slot and dose word*. It covers the families, patterns, lanes, levels and variables he uses, a crosswalk from every label he has typed to one canonical ID, and a cleaned-up version that keeps his intent. It is written for two readers: **the coach**, who should recognise his own thinking in it and correct it, and **the engineer** who will build the generator (4-6 / 8 / 12-week, week-by-week or yearly plans) and needs stable IDs and unambiguous fields. **This is v1.1**: the coach's round-1 answers (138 of 140) and his round-2 answers (`coach_answers_round2.md`, 2026-10-08; authority: round 2 > round 1 > everything else) are applied throughout, together with his request the same day to cover every popular US sport, swimming, and the gen-pop 'stay athletic and active' options (pickleball, HYROX); the v1.1 changes are listed in the next section, the v1 changes after them.

**Companion file.** `01_taxonomy.json` (same folder) holds everything below in machine form: 91 tree nodes, 47 facets with 255 values, 641 crosswalk rows (905 individual label strings), 18 muscles, the library column map, 44 item reassignments, 16 gaps (each with a v1 status), the cleanup proposal, 18 science references, the 20 v0 open questions with their v1 status and 9 new questions. It also holds the v1.1 changelog (`_meta.v1_1_round2_applied`) and pending list (`_meta.v1_1_pending`), the v1 changelog (`_meta.v1_coach_answers_applied`), the v1 pending list (`_meta.v1_pending`) and the retired ids (`_meta.retired_ids`). The JSON carries an integrity check: every crosswalk target resolves to a real node or facet, and no retired id is still referenced.

**Evidence tags used everywhere.**
- **COACH-ANSWER <ID>**: the coach's own answer in the questionnaire (`coach_answers_full.md`, 2026-10-08), cited by question ID (e.g. COACH-ANSWER CAT-09).
- **COACH-R2 <ID>**: his round-2 answer (`coach_answers_round2.md`, 2026-10-08), e.g. COACH-R2 R2-LIB-02; the two round-1 leftovers he answered in round 2 are cited as COACH-R2 LIB-10 / LIB-12. Round 2 overrides round 1. These answers are authoritative: they override every sheet inference and every earlier team decision. A RIGHT verdict with no text makes the team's assumption his rule.
- **OBSERVED**: printed in one of his sheets (tab + cell cited). Labels are quoted verbatim, typos and trailing spaces kept (`'TRIPPLE'`, `'SAGITAL'`, `'INTERMIDIATE'`, `'DOMNANT'`, `'ABdution'`, `'FOUNDATIONAL  '`).
- **INFERRED**: my reasoning from the sheets.
- **PROPOSED**: a node or field that does not exist yet but that his own sheets point to. **PROPOSED - PENDING COACH APPROVAL** marks a team proposal where the coach asked the team to decide or left the point open.
- **DORMANT**: kept only as an archive of sheet content; the generator does not use it (variable resistance, COACH-ANSWER EQ-01 / EQ-12).
- **SCIENCE**: outside literature (ids `SCI-n`, listed in Appendix A).
- **CHAT-relayed**: coach sentences that a sibling analysis quoted from another workflow brief (`analysis/equipment/reference_variables.json`). They are not in a sheet and not in this task's brief, so treat them as secondary evidence.
- **Tab names are citations only.** A sheet tab name such as `'JUSTICE LEAGUE'` appears below only to locate a cell. It is never a program name: the coach called it a marketing name (COACH-ANSWER ATH-13) and wants general, understandable names (FIX-03). The generator calls that program 'All-around athletic / weekend warrior (non-competitive adults and youth)', profile `weekend_warrior` in `04_profiles.json`.

Sources read: every file in `analysis/library/`, `analysis/reference/`, `analysis/programs/` and `analysis/equipment/`, plus the raw dumps and xlsx for every header, block label and colour quoted here; for v1 also `coach_answers_full.md` (all 140 questions, 138 answered) and `coach_answers.md` (his earlier chat statements). Nothing in Google Sheets was touched.

---

## v1.1 - round-2 answers applied

The coach answered round 2 on 2026-10-08 (`coach_answers_round2.md`). Round 2 overrides round 1. Where a round-2 answer changed a v1 statement, the statement is rewritten in place (tables, facets, JSON); the v1 wording survives only in the v1 changelog below (annotated) or in `*_v1` JSON fields. He also asked that every popular US sport (swimming included) and the gen-pop 'stay athletic and active' options (pickleball, HYROX) be covered: the sport profiles live in `04_profiles.json`, and this taxonomy adds the node and facets those sports and the round-2 answers need.

### What changed in v1.1 (question IDs)

1. **R2-LIB-02, R2-LIB-03.** Zones are tags, never the level: the level comes from load position, skill and stability, made easier by a seat, machine or cable (a deep goblet squat stays foundational; a seated DB press or a lat pulldown is foundational though overhead). Zones 1 and 3 = vertical, external-rotation positions; zone 2 = horizontal, internal-rotation (approved as written). Keep both rotation biases every week and use the bias to pick swaps when something hurts; not by sport. F.LEVEL, F.DZONE, F.ZONE_SENSES, the RP.PU.V / RP.PL.V / RP.PU.H level drivers, section 0 and section 2.1 rewritten (the v1 'level read through the zones' is retired).
2. **R2-ATH-03.** F.PMETHOD is named **Receive-Create stages**: 1 Land, 2 Land & Go, 3 Repeat; 12-week block weeks 1-3 / 4-7 / 8-12, 8-week block 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2 (codes RECEIVE_PAUSE / RECEIVE_CREATE / REPEAT_RC unchanged).
3. **R2-ATH-01, R2-ATH-02.** The plyo : ballistic shares by sport are approved (04_profiles). Per exercise: ballistic = squat, box, broad, loaded or hex-bar jumps and medball throws; plyometric = pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; stick-the-landing drills = the receive stage (F.INTENT, AP.JMP; every catalog jump and throw is tagged).
4. **R2-ATH-04, R2-ATH-05, R2-GEN-06.** Olympic lifts up to 4 x a week: clean days (squat-leaning) and snatch days (hinge-leaning) - new facet **F.OLYFAM**; full squat cleans / snatches 3-5 reps per set, DB / KB and pulls keep the 4 x 8 @ 75 % -> 4 x 4 @ 90 % ramp; weight by RPE / RIR and bar speed (power output), % only for competitive Olympic lifters (AP.TEX, F.OLY).
5. **R2-ATH-08.** 60+: no Olympic lifts, plyos or depth jumps by default - an opt-in with the warning 'Make sure that you have a fitness professional to help you understand what this means.'; youth from the floor from about 14, after one block of hang work (AP.TEX, AP.JMP, F.OLY). EQ-03 'never' stays for injured / high-volume clients.
6. **R2-VOL-05.** Squats, lunges, deadlifts and RDLs give glutes 0.25 (approved; the v1 PROPOSED hinge glutes 0.5 is retired in RP, RP.HD.BS, RP.HD.UL and the slot table); thrusters 1.0 quads + 0.5 shoulders + 0.25 glutes; KB swings are ballistic and never count as glute sets (AN20 reassignment, 'SPEED SPECIALS' crosswalk note).
7. **R2-SES-01, R2-SES-02.** Heavy squat and heavy deadlift on two different days; the counted list (barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings) and the 'second day if not sore' list (goblet, hack, pendulum) are approved - F.AXIAL rewritten, new facet **F.SPINEDAY**.
8. **R2-LIB-01.** The library exercise is the main pick; between blocks ONE detail changes (which hand holds the weight, grip, stance, implement, range), shown as '<library name> - <detail>'; never an invented exercise - new facet **F.DETAIL**, principle 8.1-5.
9. **R2-LIB-04 / LIB-10, R2-LIB-05 / LIB-12, R2-LIB-06, R2-LIB-07, R2-LIB-08.** KB face pulls = shoulder work in RP.SM.DELT.REAR (swap only, pull or shoulder days); bench push-ups both (hands on bench = L1, feet on bench = L3); the 21.6-mile run removed; belt squat and seated machine shoulder press FOUNDATIONAL, hang clean / single-arm DB snatch / KB squat clean / hex-bar jump added, KB curl / table row / floor Y-T raises for home clients; NO ACCESS = the self-serve version (no coach access, full gym library) and its Unilateral HD slot reads AQ.
10. **R2-VOL-07, R2-PER-06, R2-PER-07, R2-GEN-05, R2-SES-03, R2-SES-04, R2-SES-06, R2-ATH-06, R2-ATH-07.** Facets that describe plans: F.WEEKTYPE - no deload or maintenance week inside a block (cancel -> maintenance -> new block; maintenance length chosen and extendable); testing before / at the end of a block only. F.SEASON - pre-season 4-6 weeks at about 60 % of off-season sets + a 1-2-week taper; season start date + practice / game days; game-heavy in-season sports get about half the gym plyos. F.ROLE - a light core opener (2 x 2), optional core supersets / monster sets anywhere; field athletes 12 exercises + 2 core. F.ABAND - cardio sessions adjustable; aesthetics 4 including a second Orange.
11. **Sport expansion (coach request 2026-10-08; PROPOSED).** New node **RP.SM.NECK** (neck isolation, PROPOSED; the 04_profiles 'No neck exercises' gap); AP.AGI gets its first item (Split-Step Reaction Drill: pickleball, tennis, padel, court sports); notes on AP.THR (wall ball), CA (HYROX pieces, ruck walk), FN.CARRY / FN.DRAG (HYROX), CO.CB / CO.CP, RP.SM.CALF, RP.KD.BS / RP.KD.UL, AP.UBP, AP.TEX.JERK. The exercises themselves are PROPOSED-ADDITION records in `02_exercise_catalog.json` (section 2.8 there); the sport profiles are in `04_profiles.json`.
12. **v1.1 adversarial check (2026-10-08): R2-VOL-01 to R2-VOL-04, R2-VOL-06, R2-GEN-01, R2-GEN-04, R2-PER-03 to R2-PER-05, R2-SES-04, R2-SES-05.** The first v1.1 pass called these 'not taxonomy items', but this file still carried their v1 wording: F.SIZE, 3.2 and changelog 23 said the weekly step follows 'the person's state (fatigue, life, response)'; F.DOSE EFFORT read 10 against the old scale; F.DOSE FEELING called logging 'still open'; F.CLIENT C4 ('Work up to 1RM') had no test rule; the DELOAD / MID DELOAD / DELOAD WEEK / TEST values had no generator meaning; the 4.6 session-size row said 10-12 exercises including core; the 3.2 volume note kept the v1 landmarks only. All rewritten in place (markdown and JSON); the stairway, no-check-in, effort-10 and lifestyle resolutions are stated where the words appear; the rear-delt 4 / 6 / 8 vs floor-10 reconciliation is flagged (pending).

### Still pending (v1.1)

- **R2-VOL-08:** not understood by the coach; not a taxonomy item (the default stays: alternate the first exercise; bonus on the optional day).
- **CAT-02:** size class of front delts, traps, adductors and neck (the neck now has a PROPOSED node with no credit).
- **CAT-08:** homes of toes to bar and the Copenhagen plank (PROPOSED).
- **CAT-09:** LEG FLEXION lanes RP.LF.MACH / RP.LF.BW (PROPOSED).
- **VOL-09 / UNI-01:** adductor credit 0.25 on knee-dominant work (PROPOSED; glutes are settled by R2-VOL-05).
- **v0 open:** mid-range push / pull nodes, plane of motion vs demand, A/B/C colour tags on cardio items, slots for the functional systems.
- **R2-ATH-04 (INFERRED parts):** F.OLYFAM: the jerks' day and the hex-bar jump's day are INFERRED.
- **R2-SES-02 (INFERRED parts):** F.SPINEDAY membership beyond the named lifts (barbell / trap-bar variants, other front-loaded squats) is INFERRED.
- **Sport expansion:** the RP.SM.NECK node and the PROPOSED-ADDITION exercises need the coach's approval.
- **R2-VOL-04 / R2-VOL-06 (flag):** rear delts 4 / 6 / 8 sets of their own vs 'nobody needs less than 10 sets a week per muscle' - PROPOSED reading: rear-delt sets sit on top of the SHOULDERS/TRAPS group, which keeps the floor of 10 (the volume files own the rule).
- **R2-VOL-01 + R2-GEN-04 (resolution to confirm):** the approved check-in table is used without its 'life' columns, because the coach does not want sleep / stress / life questions.
- **new:** see section 9.3.

## v1 - coach answers applied (round 1; kept as history, annotated where round 2 changed it)

The coach answered 138 of the 140 questions (2026-10-08). His answers override the sheets and the v0 team decisions. Every change below has been made in place, in the tables, examples and JSON fields, not only listed here. Where his answer asked the team to decide, the result is marked PROPOSED - PENDING COACH APPROVAL.

### What changed (question IDs)

1. **CAT-01.** Every exercise is tagged on all lenses at once: family, pattern, laterality, plane, size class, main muscles, equipment and level, plus the v1 fields below. The record schema (8.3) marks these tags as required, so the generator can segment the library by any of them.
2. **CAT-02.** Size classes are now the coach's rule. BIG = quads, glutes, hamstrings, lats/upper back, chest. SMALL = biceps, triceps, side delts, rear delts, calves, forearms, abs. Front delts, traps, adductors and neck are still unclassified (PROPOSED placements, pending).
3. **CAT-03.** Biomechanics is the description every exercise carries (plane, laterality, load position, stance, ROM, zone), not a bucket of exercises. The FN family is renamed 'Functional systems (carries, drags, slings)'.
4. **CAT-04, CAT-10.** Exercise level = skill + stability demand + load position (in front / low -> on the body -> behind the body or overhead), read through Pat Davidson's zones; machines and cables lower it. New facet F.DZONE: Z1 vertical-low (arms down, standing), Z2 horizontal (hands in front, knee at hip height), Z3 vertical-high (arms overhead, deep squat). Z1 and Z3 carry an external-rotation bias; Z2 carries an internal-rotation bias and is compressive. F.LOADPOS values get level bands, and the RP.KD.BS level driver is rewritten (goblet / zercher L1, front squat L2, back squat L3). **[v1.1: the zone is a tag, not the level - COACH-R2 R2-LIB-02]**
5. **CAT-05.** Levels add options and never remove them, and they are still theoretical. The generator uses exercise level and client level as soft defaults (ordering, suggestions), never as a gate.
6. **CAT-06, PRG-05.** Client level and exercise level stay separate (confirmed). Client levels are renamed Level 1 / 2 / 3; NOVICE and NEWBY describe the same kind of client (under about 6-12 months of training, or back after more than 6-12 months off).
7. **CAT-07.** The BYOP 'MASTER EXERCISE LIBRARY' is the single source of truth. Sheet23 and RESISTANCE PATTERNS are older drafts, used only for levels and the exercise grammar.
8. **CAT-08.** Core rule confirmed: CO.CT = the trunk moves on a still pelvis, CO.CP = the pelvis/legs move on a still trunk, CO.CB = both at once, each in any plane (static or dynamic). CO.CB is now a confirmed region. Toes to bar and the Copenhagen plank are 'more complicated' (PROPOSED homes, pending).
9. **CAT-09.** New LEG FLEXION node RP.LF (knee flexion: leg curls, Nordics, slider / ball curls), separate from hip dominant and organised like bicep curls. It replaces RP.HD.ISO (retired id, kept as an alias) and counts toward hamstrings, never toward the hinge pattern. Lanes RP.LF.MACH and RP.LF.BW are PROPOSED.
10. **CAT-10, CAT-11.** The Sheet23 plyo 'ZONE 1/2/3' is not a zone. Facet F.PZONE is replaced by F.PMETHOD, a neutral 'plyo execution method' axis: receive and pause -> receive then create -> repeated receive/create, mapped to the four force phases. The coach has not named it yet. Unilateral plyos are harder than bilateral, and programs start with more receiving. **[v1.1: named 'Receive-Create stages' - COACH-R2 R2-ATH-03]**
11. **CAT-10.** F.ZONE_SENSES rewritten. ZONE_ARM becomes ZONE_DAVIDSON (the cable curl / triceps 'Zone 1/2/3' are Davidson arm-position zones); ZONE_PLYO points to F.PMETHOD; ZONE_BAND (Sheet23 column A) is re-read as Davidson zones used as a level band (INFERRED).
12. **CAT-12, PER-02.** The coach did not understand the 'grammar' question, so the base + variables grammar (8.3-8.4) stays a team proposal, to be re-asked in plain words. PER-02 (RIGHT) does confirm how it is used: exercises stay fixed for a 4-6 week block, and the next block changes one or two of grip, stance, implement, range of motion or rep range, never all at once. **[v1.1: the one-detail variation rule is approved - COACH-R2 R2-LIB-01, F.DETAIL]**
13. **CAT-13.** F.LOADLAT rewritten in the coach's words: a contralateral load pulls you INTO the hip, an ipsilateral load helps you OUT of it. Use cases: change-of-direction sports (football route runners, soccer, basketball, tennis); sprint acceleration (ipsilateral step-ups); bodybuilders and powerlifters as a health accessory, mostly in the first 2-4 weeks. The v0 'contralateral is the default' assumption is retired.
14. **ATH-01, CAT-10.** Ballistic vs plyometric is defined by ground-contact time: longer on the ground = ballistic, shorter = plyometric. The sport's own ground-contact time sets the ratio, and programs start ballistic and become more plyometric. F.INTENT and the sport-dial table (4.6) are updated.
15. **EQ-01, EQ-02, EQ-07, EQ-08, EQ-12.** No bands and no variable resistance. F.ACCOM becomes a DORMANT future axis that the generator does not use; the BAND implement is dormant; every banded, reverse-banded or chained item is out of scope; F.PERTURB=HIP_BAND is dormant; the banded worked example is rewritten.
16. **LIB-09.** F.PERTURB=STRAP removed ('strap rotating in/out' taken away). 'Camporini Deadlifts' removed. 'Pull under' = lat pull-over (RP.PL.V.ISO renamed). 'Kong Rows', 'Low DB Squats', 'Single Leg Get Ups' and 'Alternating DB/Barbell Deadlifts' are described and placed (6.2).
17. **LIB-06, LIB-08.** Throws and GHD have no levels (L0). The two GHD entries (AN48 MODERATE, AN93 ADVANCED) become one record.
18. **LIB-15.** The '-ADVANCED' label on leg extensions (AM3) and the 'UNILATERAL' label on leg curls (AR5) are typos: both are available at every level.
19. **LIB-16.** Dips are credited 0.5 triceps / 0.5 chest and programmed on push days. Upright rows stay side-delt work.
20. **LIB-17.** Near-duplicates merged: 'Side Plank ' (thorax) + 'Side Planks ' (pelvis) become one record (PROPOSED CO.CB, frontal, static); the seated DB curl entries AS14 / AS16 become one record.
21. **VOL-09, UNI-01, LIB-14.** The default helper credit is 0.25 (was 0.5) in every node and in the slot table. Horizontal and mid-range pushing credit chest 1.0 with front delts and triceps as helpers at 0.25, as in the coach's own VOL-09 example (bench: chest main mover, triceps and front delts helpers); the row-6 label 'CHEST/FRONT DELTS' no longer gives front delts 1.0. Unilateral knee dominant = quads 1.0, glutes 0.25. Hinges = hamstrings 1.0, glutes 0.5 (PROPOSED - PENDING COACH APPROVAL, the volume engine's value; the v0 glutes 1.0 is retired). Thrusters = quads 1.0 + front delts ('shoulders') 0.5: the thruster-specific answer LIB-14 (RIGHT) governs over the general helper rule, the same choice as `12_volume_algorithm_v1.md`. **[v1.1: hinge glutes 0.25, thrusters + glutes 0.25, KB swings 0 - COACH-R2 R2-VOL-05]**
22. **VOL-10.** Athletic patterns (jumps, throws, Olympic lifts, sprints, COD) never count toward muscle volume: every AP default muscle credit is emptied, and ankle hops in calf slots are not calf sets.
23. **VOL-05, VOL-11.** Muscle size no longer picks the weekly 3/5/7 % ramp (the person's state does). Size class still sets the organising lens and the default rep range (small 12-30, big 5-15 mixed). 40-rep sets only as a CrossFit / AMRAP option. **[v1.1: 'the person's state' = only what a check-in shows - effort, completion, pain (R2-VOL-01 without its life columns, R2-GEN-04); no check-in = the planned stairway (R2-VOL-03, R2-PER-03 / R2-PER-04)]**
24. **EQ-13, EQ-11, EQ-03, EQ-04.** F.CONSTRAINT uses the approved 1-5 scale. Machines are not ranked by preference: hack squat and leg press are more constrained than the Smith machine, the belt squat avoids axial load, GHD / reverse hyper only if available and felt in the right muscles. Safety beats the level label for older and injured clients.
25. **PER-04, EQ-11.** New facet F.AXIAL (axial spinal load HIGH / LOW / NONE), so the generator can load the spine heavily once a week (squat; deadlifts also count) and use leg press or belt squat for the second exposure. **[v1.1: two heavy spine days and the counted list approved - COACH-R2 R2-SES-01 / R2-SES-02, F.SPINEDAY]**
26. **LIB-07, LIB-13, ATH-10, ATH-09.** Full lifts renamed Squat Snatch / Squat Clean / Squat Clean & Jerk; 'Weighted squat to calf raise' takes any implement. Push press is the easier rung, push jerk intermediate/advanced. Everyone in athletic training gets Olympic lifts (beginners: DB/KB snatches and cleans, hex-bar jumps, hang pulls and hang cleans); youth may lift from the floor. **[v1.1: clean / snatch days, reps and load guidance (R2-ATH-04 / R2-ATH-05 / R2-GEN-06); 60+ opt-in and youth from about 14 (R2-ATH-08); library additions (R2-LIB-07)]**
27. **LIB-01, LIB-02, LIB-03, LIB-04, LIB-11, LIB-18, LIB-19, LIB-21, LIB-22, ATH-06, EQ-06, EQ-16.** Label decodes confirmed: 'LEFT TEST' = L-test and the date cell = 5-10-5; 'Push up Stick the Landing' = hands start on a box and land on the floor; the second 'Low Depth Drop' = single-leg or weighted; advanced hurdle hops = taller and continuous; the second 'Standing DB Press' = barbell; '21.6 mile run' = what the coach calls a marathon (flag: a marathon is 26.2 mi); carries, drags and slings to be built out; speed category confirmed; medball ALL LIST = 1 x 10 each, ball never over 20 lb; COD routes for every athlete; box and hurdle heights. **[v1.1: the 21.6-mile run is removed - COACH-R2 R2-LIB-06]**
28. **ATH-11, ORD-07, ORD-08, ORD-10, ORD-11, VOL-17.** F.ROLE: the core block comes first by default (movable), about 2 core exercises; the work / accessory / nuance / survival roles are confirmed; a warm-up is always written and A-drills are not volume; optional days are add-ons or separate days (ideally separate); focus slots take 2-3 sets; calves get 3 sets every leg day and rear delts get their own sets.
29. **ATH-13, FIX-03, FIX-04.** 'JUSTICE LEAGUE' is only a marketing tab name: the generator calls it 'All-around athletic / weekend warrior (non-competitive adults and youth)' (profile `weekend_warrior`, the same name as `04_athlete_profiles.md`), and the tab name survives only in cell citations. Spellings are corrected in the generator, never in the sheets.
30. **crosswalk.** Every crosswalk row that pointed to RP.HD.ISO, F.PZONE, ZONE_ARM, a banded or chained value or the strap now points to RP.LF, F.PMETHOD, ZONE_DAVIDSON or a dormant / removed value. The coach's own 'LEG FLEXION' label (Sheet25 H11) now maps to RP.LF. New rows: the 'JUSTICE LEAGUE' tab name, the strap, 'Lat pull unders', 'Kong Rows', 'banded leg extensions on bench', 'Pull under' and the sibling code 'ISO_LEG_FLEXION'. Integrity re-checked (every target resolves, no retired id referenced).

### Still pending

- **CAT-11:** A name for the plyo execution method axis (placeholder: 'plyo execution method', F.PMETHOD). [v1.1: answered - 'Receive-Create stages', R2-ATH-03]
- **CAT-12:** The exercise-grammar question, to be re-asked in plain words. [v1.1: the practical rule is approved - R2-LIB-01]
- **CAT-02:** Size class of front delts, traps, adductors and neck. PROPOSED - PENDING COACH APPROVAL: front delts SMALL, traps SMALL, adductors BIG, neck SMALL.
- **CAT-08:** Homes of toes to bar and the Copenhagen plank. PROPOSED - PENDING COACH APPROVAL: toes to bar CO.CP (pelvis moves), Copenhagen plank CO.CB frontal static with adductor credit.
- **CAT-09:** Lanes inside LEG FLEXION. PROPOSED - PENDING COACH APPROVAL: RP.LF.MACH (machine curls) and RP.LF.BW (bridge curls, DB curls, Nordic).
- **CAT-04, CAT-10:** Davidson-zone angle cut-offs and how much a zone weighs in the level (INFERRED; levels are theoretical per CAT-05). The zone model could not be checked against public Davidson material; it rests on the coach's account of the book. [v1.1: the zone no longer weighs in the level - R2-LIB-02]
- **LIB-10:** KB Face Pulls (U20) -> rear delts: unanswered. [v1.1: answered - shoulder work, R2-LIB-04 / LIB-10]
- **LIB-12:** 'Bench Push ups': hands or feet on the bench: unanswered. [v1.1: answered - both versions, R2-LIB-05 / LIB-12]
- **LIB-14 vs VOL-09:** Thrusters are credited 0.5 front delts (LIB-14 is the more specific answer and wins over the general 0.25 helper rule); the coach can confirm in round 2 (9.2 Q6). [v1.1: answered - 1.0 / 0.5 / 0.25, R2-VOL-05]
- **PRG-05:** The month boundary between Level 1 and Level 2 (PROPOSED ~6-12 months).
- **Glute credit (no coach answer):** hinges give glutes 0.5 and hip-thrust / bridge items 1.0 (PROPOSED - PENDING COACH APPROVAL, the values of `12_volume_algorithm_v1.json`); `02_exercise_catalog.json` still uses 0.25 for hinge glutes. [v1.1: answered - glutes 0.25 on squats, lunges, deadlifts and RDLs; KB swings 0; R2-VOL-05]
- **v0 open:** Still unanswered from v0: mid-range push / pull nodes (RP.PU.M, RP.PL.M), plane of motion vs plane of demand, core level = plane, A/B/C colour tags on every cardio item, slots for the functional systems.
- **EQ-01, EQ-12:** Variable resistance stays dormant until the coach reopens it.
- **PER-04:** F.AXIAL membership beyond squats and deadlifts is INFERRED. [v1.1: answered - the counted list, R2-SES-02]
- **PRG-01, FIX-01:** Skipped by the coach ('NO ACCESS' meaning; the miswired Unilateral HD dropdown). [v1.1: answered - the self-serve version; AQ, R2-LIB-08]

New questions raised by the answers are in section 9.2. Retired ids: `RP.HD.ISO` -> `RP.LF`, `F.PZONE` -> `F.PMETHOD`, `F.ZONE_SENSES=ZONE_ARM` -> `ZONE_DAVIDSON`, muscle `FOREARMS_NECK_CUFF` -> `FOREARMS` + `NECK_CUFF` (`_meta.retired_ids` in the JSON).

---

## 0. The coach's brain in one page

The coach told us the hardest part is the categorisation, and he named two sets of buckets: *"bigger muscles, smaller muscles, biomechanics"* and *"(changing) athletic patterns, resistance patterns, core"*. The sheets show that these are **two different cuts applied one after the other**, plus a stack of variables:

```
STEP 1  FAMILY  (library row 4 'PATTERN'; zone codes AP / RP / CT-CP)  = what QUALITY is trained and HOW it is dosed
        ATHLETIC  'AP'   purpose = a quality ('SPEED/POWER', 'CHANGE OF DIRECTION')   dosed in contacts / throws / seconds, first among the lifts; never muscle volume (VOL-10)
        RESISTANCE 'RP'  purpose = a muscle ('QUADS', 'BACK', 'CHEST/FRONT DELTS'...) dosed in sets x reps near failure, counted per muscle
        CONTROL   'CT'/'CP' purpose = 'CORE'                                          dosed in time / 'Accumulate' / reps; first in the session by default (ATH-11)
        CARDIO    (no code) purpose = 'CARDIO'                                        self-dosing items, A/B/C colour bands
        FUNCTIONAL (no code) carries / drags / slings                                 unfinished, no slot yet; build-out confirmed (LIB-19)

STEP 2  ORGANISING LENS inside the family  = how the library LISTS are cut (COACH-ANSWER CAT-01 / CAT-02 / CAT-03)
        big muscles   -> by pattern: KD/HD x bilateral/unilateral (+ leg extension, LEG FLEXION); push/pull x vertical/
                         mid-range/horizontal; athletic patterns (phase, height, base, turn, start position) and core
                         (thorax/pelvis/both x plane x static/dynamic) are cut the same way
        small muscles -> by muscle: 'SIDE RAISES', 'BICEP', 'TRICEP', 'CALVES' (one unlevelled list each)
        biomechanics  -> NOT a bucket: the description every exercise carries (plane, laterality, load position,
                         stance, ROM, Davidson zone); every exercise is tagged on every lens at once (CAT-01)

STEP 3  LEVEL inside the bucket (FOUNDATIONAL / MODERATE / ADVANCED) = skill + stability + load position; seats,
        machines and cables lower it (CAT-04; R2-LIB-02: the Davidson zone is a tag, not the level). A soft default (CAT-05)
STEP 4  VARIABLES stacked on the base exercise (stance, load position, 'into'/'out of' the hip, grip, feet/body position,
        ROM, end range, plane perturbation, implement/constraint, axial load). Bands/chains: DORMANT (EQ-01, EQ-12)
STEP 5  THE SLOT = PURPOSE (muscle or quality credited)  x  CATEGORY (bucket the exercise is drawn from)
```

Read the slot line twice. Every program row he builds has two labels, for example PURPOSE `'Quads/Glutes'` and CATEGORY `'Unilateral KD'`. That pair is where his two influences meet. The CATEGORY is the Pat Davidson half: choose a position and pattern. The PURPOSE is the Mike Israetel half: count the muscle (section 4).

Headline facts the generator must respect (details in the sections):
1. **Two cuts, not one list.** Big muscles and all athletic/core work are listed by pattern; small muscles by muscle (OBSERVED: library AI–AR vs AS–AU and AH; RESISTANCE PATTERNS column K `'SHOULDERS/BICEP/TRICEP'` replaces the plane headers with muscle names). Biomechanics describes every exercise and is not a bucket (COACH-ANSWER CAT-03); every exercise is tagged on all lenses at once (CAT-01).
2. **His own word for small muscles is in the sheets** (class lists confirmed: COACH-ANSWER CAT-02): BASEBALL legend B19:C19 `'COMPOUND'` vs `'SMALLER ISOLATIONS'`, with reps that move in opposite directions (VOL 1 `'12-15 Reps'`/`'10-12 Reps'` → VOL 3 `'6-8 Reps'`/`'MAX REPS'`).
3. **Big-muscle isolation is a third dose class.** Leg extensions and leg curls (now the LEG FLEXION node, CAT-09) are big muscles but are usually dosed like small ones (2 × `'20 Reps'` AESTHETICS D9, `'MYO SET'` JUSTICE LEAGUE G12, 2-3 × 20 in UL/PPL). Flies have no written dose in BYOP. The high-rep rule is goal- and level-dependent, for small muscles too:
   - In the 4 TRACKS 12-week strength block the dose is written once per row in column N and the exercises sit in O:Z. Leg extensions, leg curls, side raises, curls, cable flies and JM press are all `'3x8'` (N12, N16, N20, N23, N24; `'LEG EXT'` O12/O20, `'SIDE RAISES'` O16, `'CABLE FLIES'` O23, `'JM PRESS'` O24). The one isolation kept high there is `'TATE PRESS'` at `'3x20'` (N15/O15).
   - In PPL the delt isolations drop with client level: side raises 3 × 15 → 4 × 8 → 4 × 8 (B17/F17/J17), reverse flies 3 × 15 → 3 × 10 → 4 × 8 (row 27), upright rows 3 × 15 → 3 × 10 → 4 × 8 (row 29). Curls, triceps, leg extensions and leg curls stay at 20, and calves stay at `'MAX REPS'`.
4. **An exercise is a base pattern plus variables.** He writes them in a fixed order (`'Box *ANY Squat touch & go reverse banded'` - the banded part is DORMANT in v1, EQ-01 / EQ-12; `'Lateral Step ups IPSILATERAL loading'`). The RESISTANCE PATTERNS tab lists the variables as their own blocks. The coach did not understand our grammar question (CAT-12), so the grammar stays a team proposal.
5. **"Plane" means the direction of the force the athlete has to manage.** A squat with a hip band is filed `'BILATERAL FRONTAL'`; `'Stance loads the FRONT TO BACK'`, `'Load position loads UP/DOWN & SIDE2SIDE'`, `'Movement orientations/guidance loads AROUND'` (ALL ABOUT LUNGES A17:A19).
6. **Level is a property of the exercise inside its bucket, not of the person.** The client level (NOVICE/NEWBY/INTERMEDIATE, STARTING/MID/ADVANCED, LVL 1-5; v1 names Level 1/2/3) is a separate axis that changes dose (confirmed: COACH-ANSWER CAT-06, PRG-05). The coach defines exercise level as skill + stability + load position, with seats, machines and cables easier (CAT-04; COACH-R2 R2-LIB-02: the Davidson zone is only a tag), and says levels are still theoretical (CAT-05).
7. **The sport dial lives on athletic facets that the library does not store yet**: force phase (`'TAKING IN FORCES'` … `'REBOUNDING '`), ballistic vs plyometric set by ground-contact time (COACH-ANSWER ATH-01), the Receive-Create stages (1 Land → 2 Land & Go → 3 Repeat; CAT-10 / CAT-11, named in COACH-R2 R2-ATH-03; not a zone), throw type, turn severity.
8. **The word `'ZONE'` had five meanings**; the coach's answers resolve them (CAT-04, CAT-10, CAT-11): Davidson position zones (F.DZONE), the Receive-Create stages, which are not a zone (F.PMETHOD, R2-ATH-03), the level row, the energy zones, and a Sheet23 colour band (INFERRED: Davidson zones used as levels).
9. **No bands and no variable resistance for now** (COACH-ANSWER EQ-01, EQ-12): bands, chains and weight releasers become a dormant axis.
10. **Knee flexion is its own LEG FLEXION segment** (`RP.LF`, COACH-ANSWER CAT-09), not hip dominant, and athletic work never counts toward muscle volume (VOL-10).

---

## 1. The canonical tree (stable IDs)

**How IDs are built.** `FAMILY.PATTERN[.LANE[.SUBLANE]]`. The family codes reuse the coach's own (`AP`, `RP`; `CO` for his CONTROL family with `CT`/`CP` regions). Lanes reuse his `BS`/`UL` codes and add `ISO` for the isolation column he puts beside a big-muscle group (`'LEG EXTENSIONS'` next to knee dominant). v1: `'LEG CURLS'` is no longer a hip-dominant lane but its own pattern, `RP.LF` LEG FLEXION (COACH-ANSWER CAT-09; his own Sheet25 word). IDs never change when exercises are added; new exercises attach to a node. `X.*` are meta buckets (focus menu, warm-up, skill, tests), not movement families. A node marked `[PROPOSED]` is implied by his sheets but has no library column yet.

```
AP                 Athletic Patterns
  AP.TEX             Triple extension / Olympic lifting
    AP.TEX.DRILL       Extension drills (squat/lunge to calf raise / high-knee)
    AP.TEX.PULL        Clean & snatch pulls from the hang
    AP.TEX.PWR         Power-receive Olympic lifts
    AP.TEX.SQ          Full / squat-receive Olympic lifts (Squat Snatch / Squat Clean / Squat Clean & Jerk)
    AP.TEX.JERK        Overhead drive / jerk ladder
  AP.JMP             Lower-body jumping & plyometrics (all jump tracks)
    AP.JMP.LK          Limited-knee / ankle-stiffness jumping
    AP.JMP.PLY         Landing -> box -> hurdle plyometrics
    AP.JMP.FULL        Full jumping (reactive / depth / loaded / horizontal)
  AP.UBP             Upper-body plyometrics  [OBSERVED items / PROPOSED node]
  AP.SPD             Sprint & running mechanics  [OBSERVED items / category confirmed, LIB-21]
    AP.SPD.MECH        Running mechanics drills (A-drills, MACH)
    AP.SPD.ACC         Acceleration
    AP.SPD.MAXV        Max-velocity sprinting
  AP.THR             Medball throwing
    AP.THR.BS          Bilateral symmetrical sagittal throws
    AP.THR.ROT         Rotational throws (thorax)
    AP.THR.INT         Throws integrated with a lower-body pattern
    AP.THR.HIP         Half-kneeling hip-specific rotation (into / out of a hip)
    AP.THR.TRUNK       Trunk-driven / repeat-catch throws
    AP.THR.SPEC        Specialty throws (not in BYOP)
  AP.COD             Change of direction (pre-planned)
  AP.AGI             Agility (reactive)
RP                 Resistance Patterns
  RP.KD              Knee dominant
    RP.KD.BS           Bilateral knee dominant (squat family)
    RP.KD.UL           Unilateral knee dominant (lunge / split squat / step-up / single-leg squat)
    RP.KD.ISO          Knee-extension isolation (big-muscle isolation)
  RP.HD              Hip dominant
    RP.HD.BS           Bilateral hip dominant (hinge / bridge / thrust / back extension)
    RP.HD.UL           Unilateral hip dominant (staggered / single-leg hinge, SL bridge)
  RP.LF              Leg flexion (knee flexion: leg curls, Nordics, slider/ball curls)  [COACH-ANSWER CAT-09; replaces RP.HD.ISO]
    RP.LF.MACH         Machine leg curls (seated / lying)  [PROPOSED lane]
    RP.LF.BW           Bodyweight / free-weight curls (bridge curls, DB curls, Nordic)  [PROPOSED lane]
  RP.PU              Push
    RP.PU.V            Vertical push (overhead)
      RP.PU.V.BS         Vertical push - bilateral symmetrical
      RP.PU.V.UL         Vertical push - unilateral / alternating
    RP.PU.M            Mid-range push (incline / landmine / viking)  [OBSERVED in MM; PROPOSED as a BYOP node]
    RP.PU.H            Horizontal push
      RP.PU.H.BS         Horizontal push - bilateral symmetrical
      RP.PU.H.UL         Horizontal push - unilateral / alternating / offset
      RP.PU.H.ISO        Chest fly (big-muscle isolation)  [OBSERVED items / PROPOSED lane]
  RP.PL              Pull
    RP.PL.V            Vertical pull
      RP.PL.V.BS         Vertical pull - bilateral
      RP.PL.V.UL         Vertical pull - unilateral
      RP.PL.V.ISO        Straight-arm lat isolation (lat pull-over; 'pull under', LIB-09)  [OBSERVED items / PROPOSED lane]
    RP.PL.H            Horizontal pull (rows)
      RP.PL.H.BS         Horizontal pull - bilateral
      RP.PL.H.UL         Horizontal pull - unilateral / single arm
    RP.PL.M            Mid-range pull (incline / high row)  [PROPOSED (gap)]
  RP.SM              Small-muscle isolation (muscle-organised)
    RP.SM.DELT         Shoulders (deltoid isolation)
      RP.SM.DELT.SIDE    Side delt (abduction)
      RP.SM.DELT.REAR    Rear delt (horizontal abduction / external rotation)  [OBSERVED items / PROPOSED lane]
      RP.SM.DELT.FRONT   Front delt (flexion)  [OBSERVED items / PROPOSED lane]
    RP.SM.TRAP         Traps / upright row  [PROPOSED]
    RP.SM.BI           Biceps (elbow flexion)
    RP.SM.TRI          Triceps (elbow extension)
    RP.SM.CALF         Calves (plantar flexion)
    RP.SM.NECK         Neck (isolation)  [PROPOSED v1.1]
CO                 Control Patterns (core)
  CO.CT              Core thorax (trunk moves on a still pelvis)  [rule confirmed, CAT-08]
  CO.CP              Core pelvis (pelvis/legs move on a still trunk)
  CO.CB              Core both (thorax and pelvis move / brace together)  [confirmed region, CAT-08]
CA                 Aerobic capacity & conditioning
  CA.A               A / blue - short duration, high intensity
  CA.B               B / green - moderate duration, moderate intensity
  CA.C               C / orange - long duration, low intensity
  CA.LC              Lactate clearance (surge-and-float)
  CA.BUY             Buy-out sprint finisher
  CA.WOD             Mixed-modal WOD
  CA.CIRC            Metabolic circuit
FN                 Functional systems (carries, drags, slings) - not a 'biomechanics' bucket (CAT-03)
  FN.AOS             Anterior oblique system
    FN.AOS.CHOP        Chops (adducted, rotational crunch)
    FN.AOS.AROT        Anti-rotation (Pallof) with adduction
    FN.AOS.PLANK       Planks with adduction
    FN.AOS.CRUNCH      Crunches (empty)
  FN.POS             Posterior oblique system
  FN.LSS             Lateral subsystem
  FN.CARRY           Carries
  FN.DRAG            Drags
X                  Meta buckets (not exercise families)  [INFERRED]
  X.FOCUS            Specialisation menu (muscle focus)
  X.PREP             Warm-up / primer
  X.SKILL            Skill practice (CrossFit gymnastics)
  X.TEST             Tests
```


### 1.1 Every node, with the coach's labels, library source and level driver

The **level driver** column answers the coach's real question: *what does "harder" mean in this bucket?* It differs by bucket, and it is the most useful thing the sheets teach a generator.

| ID | Canonical name | Coach's own labels (verbatim, where) | Organising lens | Size class | Library source | Level driver (what makes it harder) | Dose unit | Status |
|---|---|---|---|---|---|---|---|---|
| **AP** | Athletic Patterns | 'ATHLETIC' (BYOP row 4, C4:N4); 'AP' (zone codes, e.g. K3 'AP - THROWING'; Sheet23 headers); 'ATHLETIC PATTERNS' (BASEBALL E19); '(NOT DONE) ATHLETIC PATTERNS EXERCISE LIBRARY' (MM tab 21); 'SPEED/POWER' (BYOP row 6 C:K); 'CHANGE OF DIRECTION' (BYOP row 6 L:N) | quality + biomechanics | n/a (exposure, not hypertrophy sets) | BYOP:'MASTER EXERCISE LIBRARY' C,G,K,L (+ side views D-F,H-J,M-N) | per sub-pattern (technical complexity, force/height, base of support, turn angle) - see children | contacts / throws / reps at max intent / bout seconds (BASEBALL legend E19:F22) | OBSERVED - Programmed FIRST in every athletic session (BYOP ATHLETIC/JUSTICE LEAGUE rows 3-7, 13-16), after the core block that v1 places first by default (COACH-ANSWER ATH-11). PURPOSE row names a quality, not a muscle. - Athletic patterns never count toward muscle volume (COACH-ANSWER VOL-10: 'counting towards muscles is more for resistance patterns, not for athletic patterns'); they are tracked as contacts, throws, reps and metres. Every AP node therefore has an empty default_muscle_credit in v1. |
| **RP** | Resistance Patterns | 'RESISTANCE' (BYOP row 4, U4:AU4); 'RP' (zone codes AA3:AU3; Sheet23); 'RESISTANCE PATTERNS' (BASEBALL A19); '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' (MM tab 13) | biomechanics (big muscles) + muscle (small muscles) | big + small | BYOP:'MASTER EXERCISE LIBRARY' U:AU (+ AZ focus list) | per pattern - see children | working sets x reps near failure (1-3 RIR) | OBSERVED - v1: muscles named in the slot PURPOSE / library row 6 get 1.0; clear helpers get 0.25 (COACH-ANSWER VOL-09, was 0.5). Where the coach's own example names a helper, it stays a helper even if row 6 names it: bench / horizontal and mid-range pushing = chest 1.0, front delts and triceps 0.25 (VOL-09 example), although row 6 reads 'CHEST/FRONT DELTS'. Thrusters: quads 1.0 + front delts ('shoulders') 0.5 + glutes 0.25 (LIB-14 confirmed and completed by COACH-R2 R2-VOL-05). Exceptions set by the coach: dips 0.5 triceps / 0.5 chest (LIB-16); unilateral sets count once per side pair, 10/10 = 1 set (UNI-01). Exercise-level credits live in 02_exercise_catalog.json. Node defaults follow the counting map of `12_volume_algorithm_v1.json` (counting.credit_map), v1.1: squats, lunges, deadlifts and RDLs give glutes 0.25 - COACH-R2 R2-VOL-05 approved a quarter set for glutes ('that's good math'; the v1 PROPOSED hinge 0.5 and the v0 1.0 are retired); KB swings count nothing - they are ballistic, not glute work (R2-VOL-05); knee-dominant work gives adductors 0.25 (still PROPOSED). |
| **CO** | Control Patterns (core) | 'CONTROL' (BYOP row 4 O4:T4); 'CONTROL PATTERNS' / 'CORE' (MM 'CONTROL PATTERNSCORE' A1/A2); 'CT' / 'CP' (Sheet23 N1:S1); 'CORE' (BYOP row 6 O6:T6; program PURPOSE 'Core') | biomechanics (region x plane x static/dynamic) | small (abs/obliques) - own family | BYOP:'MASTER EXERCISE LIBRARY' O (stack incl. pelvis copy O124:O209), P,Q,R,S,T | plane SAGITAL -> FRONTAL -> TRANSVERSE as the default order (OBSERVED BYOP row 3/5 O:T; Sheet23 N1:S1); levels are theoretical (COACH-ANSWER CAT-05) | time / 'Accumulate' totals / reps / 'unbroken' | OBSERVED - Core rule (COACH-ANSWER CAT-08): trunk moves on a still pelvis = CO.CT; pelvis/legs move on a still trunk = CO.CP; both at the same time = CO.CB; each can be trained in any plane. Core comes FIRST in the session by default as the warm-up, movable by the user (ATH-11); about 2 core exercises per session (VOL-17). |
| **CA** | Aerobic capacity & conditioning | 'CARDIO' (BYOP B1/B4/B6); 'Cardio' / 'Aerobic Capacity' (program PURPOSE); 'AEROBIC CAPACITY WORK' (MM AEROBIC A1); 'AEROBIC C.' / 'AEROBIC CAP.' / 'AEROBIC CAPACITY' (CrossFit); 'A/C' (4 TRACKS HYBRID B80/B92); 'Buy out' (BASEBALL Part E) | energy system (A blue / B green / C orange / lactate clearance) | n/a | BYOP:'MASTER EXERCISE LIBRARY' B (B7:B122 in 8 tabs; B7:B335 in BOOTCAMP - OPTION 2 E7/E12/E22/E27) | client level unlocks colours: 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE' (CrossFit D21:D24); within colour: volume/density first, then pace (AEROBIC A8:I21) | self-dosing item text (time / distance / calories / work:rest) | OBSERVED - No PATTERN/level rows; no REPS dropdown on cardio rows (L4_slot_wiring 4.4). v1.1: PROPOSED HYROX pieces (SkiErg and rower distance pieces, compromised run, burpee broad jump) and the ruck walk (an easy Orange option for hiking / rucking); the 21.6-mile run is removed (R2-LIB-06). |
| **FN** | Functional systems (carries, drags, slings) | 'FUNCTIONAL' (BYOP BC4:BE4); 'FUNCTIONAL BIOMECHANICS SYSTEM' (BYOP BC1); 'CARRY' (BA1); 'DRAGS' (BB1) / 'DRAG' (BB6) | sling / integration | n/a (integration) | BYOP:'MASTER EXERCISE LIBRARY' BA, BB, BC, BD, BE (never wired to a program slot) | chop direction down -> midline -> up (green/yellow/red) and position supine -> tall kneeling -> half kneeling -> split standing (BC9:BC20, BC46:BC49) | reps / holds (not written) | OBSERVED (skeleton; only AOS populated) - unfinished layer with no slot in any template; build-out confirmed (COACH-ANSWER LIB-19) - v1: not a 'biomechanics' bucket - biomechanics is the description every exercise carries (COACH-ANSWER CAT-03). To be built out (COACH-ANSWER LIB-19): carries and drags for athletes and general fitness; sling systems for advanced athletes and rehab; implements farmer handles, trap bar, KB, sandbag, sled. Band options inside the existing sling items ('cable or band', 'Knee banded for adduction') are dormant: cable or a held object only (EQ-01). |
| **X** | Meta buckets (not exercise families) | - | meta | - | - | - | - | INFERRED - Containers the coach uses that are not movement families: specialisation menu, warm-up/primer, skills, tests. |
| **AP.TEX** | Triple extension / Olympic lifting | 'TRIPPLE EXTENSION' (BYOP C1, C5:E5); 'Tripple Extension' (program PURPOSE/CATEGORY); '... - AP - TRIPPLE EXT' (Sheet23 B1:D1); 'TRIPPLE EXTENSIONS' (MM tab 21 J5); 'OLY' / 'OPTIONAL PIECE' (BASEBALL); 'OLY/ POWER' (HYBRID); 'POWER' / 'PWR' (CrossFit) | biomechanics (hip-knee-ankle extension) + technical complexity | n/a | BYOP:'MASTER EXERCISE LIBRARY' C8 FOUNDATIONAL C9:C15 (7) / C44 MODERATE C46:C54 (9) / C89 ADVANCED C91:C96 (6); D,E side views | technical complexity and start position, not load: drills -> hang pulls (high -> mid -> low hang) -> power receive -> squat receive (OBSERVED, L1 sec.6). COACH-ANSWER ATH-10: everyone in athletic training gets Olympic lifts - beginners and early intermediates: DB/KB snatches and cleans, hex-bar jumps, hang pulls and hang cleans; intermediate+, advanced and pros: the full lifts. Youth may lift from the floor when the program calls for it (ATH-09). | reps (3-8) at heavy-but-fast intent; % in BASEBALL OLY 75->90% (4 x 8 @75 % -> 4 x 6 -> 4 x 6 -> 4 x 4 @90 %, confirmed as the strength-plan default, COACH-ANSWER PER-09) | OBSERVED - Column C also stacks the JUMPING ANKLE block (C124) - that block belongs to AP.JMP.LK. Exposure only, never muscle volume (COACH-ANSWER VOL-10). Injured / high-volume clients never get the snatch (EQ-03). v1.1 (COACH-R2 R2-ATH-04 / R2-ATH-05 / R2-GEN-06): Olympic lifts up to 4 x per week - clean days (cleans = more squat-pattern) and snatch days (snatches = more hinge-pattern); full squat cleans / snatches 3-5 reps per set (same weekly reps), DB / KB and pull variants keep the 4 x 8 @ 75 % -> 4 x 4 @ 90 % ramp, with the coach's eye on speed; the weight is picked by RPE / RIR and bar speed (power output), % only for competitive Olympic lifters (their own programming). R2-LIB-07 adds hang clean, single-arm DB snatch, KB squat clean and hex-bar jump to the library (FOUNDATIONAL). Youth from the floor from about 14, after one block of hang work; older adults (60+) get no Olympic lifts by default - an opt-in with a warning (R2-ATH-08). The catalog tags every Olympic lift with its family and day (F.OLYFAM). |
| **AP.TEX.DRILL** | Extension drills (squat/lunge to calf raise / high-knee) | 'BodyWeight Squat to calf raise' C9; 'Lunge to high knee reach' C10; 'Hex bar squat to calf raise' C11; 'Weighted squat to calf raise' C46; COACH-ANSWER LIB-07: 'weighted squats to calf raise can be done with any tool' | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' C9:C11, C46:C48 | bodyweight -> weighted -> hex bar | reps | OBSERVED |
| **AP.TEX.PULL** | Clean & snatch pulls from the hang | 'High hang clean pull' C12; 'Mid hang clean pull' C13; 'Low hang clean pull' C53; '... snatch pull' C14/C15/C54 | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' C12:C15, C49:C54 | start height high -> mid -> low hang (MM OLYMPIC 'PROGRESSION MODEL EASY TO HARD' A5:A30) | reps | OBSERVED |
| **AP.TEX.PWR** | Power-receive Olympic lifts | 'Power Snatch' C91; 'Power Clean' C92; 'Power Clean & Jerk' C93; 'POWER CLEAN FROM THE HIGH HANG' ... (MM OLYMPIC A7:A10, A20:A24) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' C91:C93 | high hang -> mid hang -> low hang -> floor; power before squat receive | reps 1-5 'heavy' | OBSERVED |
| **AP.TEX.SQ** | Full / squat-receive Olympic lifts (Squat Snatch, Squat Clean, Squat Clean & Jerk) | 'Snatch ' C94; 'Clean ' C95; 'Clean & Jerk' C96; 'HANG SQUAT CLEAN' / 'SQUAT SNATCH' (MM OLYMPIC A11:A13, A25:A30); '*SQUAT SNATCH HAS ITS OWN MODEL TO WORK AROUND BECAUSE DEPTH ON THE SQUAT NEEDS TO BE ADDRESSED' (OLYMPIC B30); COACH-ANSWER LIB-07: 'full squat version yes add squat word to them' -> 'Snatch ' C94 = Squat Snatch, 'Clean ' C95 = Squat Clean, 'Clean & Jerk' C96 = Squat Clean & Jerk | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' C94:C96 | receive depth: overhead box squat -> overhead squat -> drop -> squat snatch | reps 1-3 | OBSERVED |
| **AP.TEX.JERK** | Overhead drive / jerk ladder | 'JERK' (OLYMPIC A14); 'OH PRESS' -> 'OH PUSH PRESS' -> 'OH PUSH JERK' -> 'OH SPLIT JERK' (A15:A18); 'DB Push press' / 'Barbell push press' / 'DB Push Jerk' / 'Barbell Push Jerk' (BYOP AA11:AA14, filed under VERTICAL PUSH FOUNDATIONAL) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' AA11:AA14 (cross-listed); MM OLYMPIC A14:A18 | press -> push press -> push jerk -> split jerk (OBSERVED, OLYMPIC A15:A18). COACH-ANSWER LIB-13: 'push press is easier, push jerk is more technical but its more intermediate/advance' -> push press L1-L2, push jerk L2-L3. | reps 5-8 (AESTHETICS 'DB Push press' 5 x '6 to 8 Reps') | OBSERVED (ladder) / INFERRED (node placement) - BYOP files push press/jerk as resistance VERTICAL PUSH FOUNDATIONAL (AA11:AA14); the OLYMPIC tab files the same ladder as the jerk progression. Cross-list. Credit follows the slot: picked in a Vertical Push slot it is credited like RP.PU.V; in an athletic slot it is exposure only (COACH-ANSWER VOL-10). v1.1: jerks belong to either day (the coach splits clean days and snatch days only, R2-ATH-04; INFERRED). |
| **AP.JMP** | Lower-body jumping & plyometrics (all jump tracks) | 'PLYOS' (BYOP G1); 'Plyo' / 'PLYO' (program); 'Jumping' (MM tab 21 A10); 'LOWER ballistics/plyo' (BASEBALL); 'JUMPS' (HYBRID D82/D93); 'BALLISTICS & PLYOS' (MM tab 14 A2); 'Plyo' (Sheet23 D33) | biomechanics (force acceptance -> SSC speed) + quality | n/a | BYOP:'MASTER EXERCISE LIBRARY' G (4 blocks), C124 block | force magnitude (drop/box/hurdle height: low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12+ in advanced - COACH-ANSWER EQ-16), base of support (bilateral -> alternating -> single-leg; unilateral is harder - COACH-ANSWER CAT-10), direction (forward -> lateral -> reverse -> zig-zag/right-angle), load (BW -> DB, 10-20 % of body weight - EQ-15), contact type (stick -> onto -> rebound) - L1 sec.6. The execution method (F.PMETHOD) is a separate axis, not a level (CAT-11). | contacts (1 landing / hop / jump = 1) | OBSERVED - Three tracks that converge at FULL JUMPING (Sheet23 E/F/G/H/I). Plyos vs ballistics: the longer the ground contact, the more ballistic (COACH-ANSWER CAT-10, ATH-01) - see F.INTENT. Programs start with more ballistic and more 'receive and pause' work, then become more plyometric (CAT-10). Exposure only (VOL-10). Older adults (60+): no plyos or depth jumps by default - an opt-in with a warning (COACH-R2 R2-ATH-08, supersedes ATH-09 'few plyos unless they ask'); injured / high-volume clients never get depth jumps (EQ-03). v1.1: every jump is tagged ballistic / plyometric / receive (COACH-R2 R2-ATH-02: ballistic = squat, box, broad, loaded or hex-bar jumps; plyometric = pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; stick-the-landing = receive) and carries its Receive-Create stage (R2-ATH-03, F.PMETHOD). |
| **AP.JMP.LK** | Limited-knee / ankle-stiffness jumping | 'FOUNDATINONAL - AP - JUMPING LIMITED KNEE' (Sheet23 E1); 'INTERMEDIATE - AP - JUMPING LIMITED KNEE' (Sheet23 G1); 'JUMPING ANKLE' (BYOP F5); 'EASY' block C124 (BYOP); 'MODERATE' block G44 (plate hops); 'HOPS IN PLACE' (AGILITYCOD A5); 'DUBS' (CrossFit skill); 'Bigger plates start at lateral bilateral plate hops' (G53 - a rule, not an exercise) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' C126:C136 (11), G46:G57 (12 incl. note), G15/G55 'Ankle Hops ', G138 'DB Ankle hops' | floor -> plate -> bigger plate (resets to lateral bilateral); bilateral -> single-leg; one direction -> right-angle/zig-zag | contacts | OBSERVED - Split across two BYOP segments (C under TRIPPLE EXTENSION, G under PLYOS) - see gaps. |
| **AP.JMP.PLY** | Landing -> box -> hurdle plyometrics | 'FOUNDATINONAL - AP - PLYOS' (Sheet23 F1); 'INTERMEDIATE - AP - PLYOS' (Sheet23 H1); 'PLYO' (BYOP G5:I5); 'FOUNDATIONAL' G8 / second 'MODERATE' G89 | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' G9:G15 (7), G91:G96 (6) | Low -> Medium -> High depth drop; half-shin -> knee box; bilateral -> single-leg hurdles; forward -> lateral -> right angle | contacts | OBSERVED - COACH-ANSWER LIB-03: the second 'Low Depth Drop' was meant to be single-leg or weighted. LIB-04: advanced 'Hurdle Hops' = taller hurdles and continuous quick-contact reps. LIB-05: pick one from each MODERATE plyo column (plate hops G44, hurdles G89). |
| **AP.JMP.FULL** | Full jumping (reactive / depth / loaded / horizontal) | 'ADVANCED - AP -JUMPING' (Sheet23 I1); 'FULL JUMPING' (BYOP J5); 'ADVANCED' G124 | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' G126:G141 (16) | a collection, not a ladder: squirrel, tuck, depth, drop-to-box, high depth drop, hurdle hops, split jumps, DB drop-release, DB ankle hops, DB repeat squat jumps, bounding (+ two cross-bucket items: max velocity running, plyo push-ups) | contacts | OBSERVED |
| **AP.UBP** | Upper-body plyometrics | 'Push up Stick the Landing' G12 (FOUNDATIONAL) - COACH-ANSWER LIB-02: the hands start on a box and land on the floor; ' Push up Box Jump ' G95 (MODERATE); 'Plyo pushups' G141 (ADVANCED); 'Plyo Push ups - one side raised' (MM ATHLETIC C29); 'Upper Ballistics/plyo' (BASEBALL Part A, mostly throws) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' G12, G95, G141 (filed inside lower-body PLYOS) | stick the landing (box -> floor) -> push-up box jump -> repeated plyo push-ups (COACH-ANSWER LIB-02) | contacts (hand) | OBSERVED items / PROPOSED node - Coach files them inside the lower-body plyo column (Sheet23 F5/H6/I17). v1.1: Plyometric Push-Ups are tagged plyometric (repeated), the push-up box jump ballistic, stick-the-landing receive (R2-ATH-02, INFERRED for the push-ups). |
| **AP.SPD** | Sprint & running mechanics | '*SPRINT*' (Sheet23 B51); ' Max velocity running (top speed)' (BYOP G128; Sheet23 I4, B52); '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' (Sheet23 B47); 'RUNNING WARMUP' (AEROBIC E23); 'A March' / 'A Skip' / 'A Run(s)' (AEROBIC F26:F28; UL/PPL lower days); 'Falling start accelerations' (AEROBIC) | biomechanics + SSC speed | - | BYOP:'MASTER EXERCISE LIBRARY' G128 only (inside PLYOS ADVANCED); Sheet23 B43:B52 footer | mechanics drills (march -> skip -> run) -> acceleration -> max velocity (Sheet23 footer order) | reps per side / yards / seconds | OBSERVED items / library category confirmed (COACH-ANSWER LIB-21: add MACH drills to the library; the speed-session order squirrel jumps -> MACH drills / acceleration starts -> max velocity is fixed). In-season, speed athletes keep sprints (PER-08). - No BYOP column or slot. |
| **AP.SPD.MECH** | Running mechanics drills (A-drills, MACH) | '✅ MACH DRILLS' (Sheet23 B48); 'A March' / 'A Skip' / 'A Run'; 'High Knee Runs FAST' (MM ATHLETIC C15) | biomechanics | - | - | march -> skip -> run | yards or reps/side | OBSERVED items |
| **AP.SPD.ACC** | Acceleration | '✅ Acceleration starts' (Sheet23 B49); 'Falling start accelerations' (AEROBIC); 'accelerations baseball starts' / '30m acceleration sprint' (BASEBALL) | biomechanics | - | - | - | reps x metres | OBSERVED items |
| **AP.SPD.MAXV** | Max-velocity sprinting | ' Max velocity running (top speed)' G128; '*SPRINT*' | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' G128 | - | reps x metres | OBSERVED |
| **AP.THR** | Medball throwing | 'THROWING' (BYOP K1/K5; MM tab 21 A8); 'AP - THROWING' (BYOP K3; Sheet23 J1); 'Throwing' (program); 'MEDBALL CHEAT SHEET' (MM tab 14 A51); '*MEDBALLS' (MM ATHLETIC/BOXING); 'MED BALL VARIATIONS' (BOXING F50); 'Upper Ballistics/plyo' (BASEBALL Part A) | biomechanics (stance x symmetry x plane x hip direction) | - | BYOP:'MASTER EXERCISE LIBRARY' K9:K28 (20, no levels) | no levels - COACH-ANSWER LIB-06: 'No levels in throws, just do them right'. The cheat-sheet order is biomechanical complexity (OBSERVED): bilateral sagittal -> rotational R/L -> squat-integrated -> propulsive step -> half-kneeling into/out of hip -> wall/sit-up; it is not a progression to enforce. | throws (1 x 10; sit-up throws 1 x 20 - MEDBALL CHEAT SHEET A53:B71); 'ALL LIST' = one pass of 1 x 10 each (COACH-ANSWER LIB-22). Ball 8-10 lb for passes and rotations, heavier only for specific uses (medball cleans, wall balls), never over 20 lb (EQ-06). No medball throwing in aesthetics / bodybuilding main work - warm-up only (ATH-05). | OBSERVED - No medball: substitute plyo push-ups (pressing), fast cable rotations or the no-ball 'fake medball slam' - never band chops ('Band chops are, to me, worthless', COACH-ANSWER EQ-07). v1.1: PROPOSED Wall Ball (medball squat-to-target throw, HYROX / CrossFit; EQ-06 names wall balls; max 20 lb), counted as throws. |
| **AP.THR.BS** | Bilateral symmetrical sagittal throws | 'BILATERAL SYMETRICAL PUSH' (D53); 'BILATERAL SYMETRICAL PULL DOWN' (D54) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' K9:K10 | - | throws | OBSERVED - Descriptions from MM '(NOT DONE) ALL ABOUT BALLISTICS' col D. |
| **AP.THR.ROT** | Rotational throws (thorax) | 'CORE THORAX ' (D55:D58); 'TRANSVERSE PULL DOWN' (D60) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' K11:K14, K16, K28 | - | throws | OBSERVED - Descriptions from MM '(NOT DONE) ALL ABOUT BALLISTICS' col D. |
| **AP.THR.INT** | Throws integrated with a lower-body pattern | 'BILATERAL SYMETRICAL KNEE DOMINANT & PUSH' (D59); 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH' (D61:D62); 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PULL DOWN' (D63:D64) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' K15, K17:K20 | - | throws | OBSERVED - Descriptions from MM '(NOT DONE) ALL ABOUT BALLISTICS' col D. |
| **AP.THR.HIP** | Half-kneeling hip-specific rotation (into / out of a hip) | 'INTO THE LEFT LEG/HIP' (D65); 'OUT OF THE RIGHT LEG/HIP' (D66); 'OUT OF THE LEFT LEG/HIP' (D67); 'INTO THE RIGHT LEG/HIP' (D68) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' K21:K24 | - | throws | OBSERVED - Descriptions from MM '(NOT DONE) ALL ABOUT BALLISTICS' col D. |
| **AP.THR.TRUNK** | Trunk-driven / repeat-catch throws | 'TRANSVERSE CORE THORAX' (D69); 'BILATERAL CORE THORAX' (D70:D71) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' K25:K27 | - | throws | OBSERVED - Descriptions from MM '(NOT DONE) ALL ABOUT BALLISTICS' col D. |
| **AP.THR.SPEC** | Specialty throws (not in BYOP) | 'SPECIALTIES' (C72); 'FRONTAL PULL DOWN' (D73); 'TRANSVERSE INTO THE HIP' (D74:D75); 'UNILATERAL OUT OF HIP' (D76); 'HIP DOMINANT PUSH' (D77) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' none (MM tab 14 C73:C81 only) | - | throws | OBSERVED - Descriptions from MM '(NOT DONE) ALL ABOUT BALLISTICS' col D. |
| **AP.COD** | Change of direction (pre-planned) | 'CHANGE OF DIRECTION' (BYOP L1, L6); 'COD' (program; Sheet23 K1:M1); 'Change of Direction ' (AGILITYCOD A1); 'COD: Proactive in nature - Cognitive Competence' (AGILITYCOD D2); 'RUNNING ROUTES' / 'ROUTE TREE' (AGILITYCOD A12/A14) | biomechanics (cut angle / deceleration) | - | BYOP:'MASTER EXERCISE LIBRARY' L8 FOUNDATIONAL L9:L13 (5) / L44 MODERATE L46:L47 (2) / L89 ADVANCED L91:L92 (2) | turn severity: 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN' (BYOP L5:N5) | reps / cuts | OBSERVED - COACH-ANSWER ATH-06: the football route names are for every athlete, tiered by turn angle. LIB-01: 'LEFT TEST' = the L-test (3-cone) and the date cell L92/N10 = the 5-10-5 pro agility drill. |
| **AP.AGI** | Agility (reactive) | 'Agility: Reactive in nature - Incognitive Competence' (AGILITYCOD D1) only. The same tab also lists 'HOPS IN PLACE' (A5), 'KRUMRIE FORMATION' (A7), 'MUNOZ FORMATION' (C7), 'EIGHT SQUARE PLYOMETRIC FORMATION' (E7) and 'FOUR SQUARE FORMATION' (H7). These are named footwork/hop drills, crosswalked to AP.COD / AP.JMP.LK (INFERRED), not agility labels. | quality (perception-action) | - | - | - | - | OBSERVED definition / no exercises - Defined but empty; no slot. v1.1: first PROPOSED item - Split-Step Reaction Drill (split-step, then shuffle / crossover / drop-step on a cue) for pickleball, tennis, padel and other court sports (catalog PROPOSED-ADDITION). |
| **RP.KD** | Knee dominant | 'KNEE DOMINANT' (RESISTANCE PATTERNS A6); 'KNEE DOM' (CrossFit MON); 'KD' (HYBRID C74); 'KD REPS' (C98); 'SQUATS & KNEE DOMINANT MOVEMENTS' (ALL ABOUT SQUATS A1); 'LOWER BODY MECHANICS' (region, RESISTANCE PATTERNS A5) | biomechanics | big (quads; glutes secondary) | BYOP:'MASTER EXERCISE LIBRARY' AI, AL, AM | see lanes | sets x reps | OBSERVED |
| **RP.KD.BS** | Bilateral knee dominant (squat family) | 'BILATERAL KNEE DOMINANT' (BYOP AI1); 'RP - BS - KNEE DOMINANT' (AI3; Sheet23 AC1); 'RP-BS-KNEE DOMINANT-INTERMIDIATE' (AJ3; Sheet23 AD1); 'RP-BS-KNEE DOMINANT -ADVANCED' (AK3; Sheet23 AE1); 'Bilateral KD' (program CATEGORY); 'bkd' (BASEBALL); 'BILATERAL SAGITAL -SEE CHEAT SHEET  *ALL ABOUT SQUATS' (RESISTANCE PATTERNS A7); 'BILATERAL KNEE DOMINANT' (Sheet25 J11) | biomechanics | big | BYOP:'MASTER EXERCISE LIBRARY' AI8 FOUNDATIONAL AI9:AI20 (12) / AI44 MODERATE AI46:AI56 (9) / AI89 ADVANCED AI91:AI104 (14) | COACH-ANSWER CAT-04: load position - load in front of you / low (goblet, zercher, DBs at the sides, hex bar) = foundational, because people need to learn to be upright; load on the body (barbell front squat) = intermediate; load behind the body (barbell back squat) = advanced; overhead = advanced ('VERY HARD', ALL ABOUT SQUATS H11). Machines (leg press, hack squat, pendulum, belt squat) are easier because the machine stabilises (CAT-04) and are open to every level when safety calls for them (EQ-04). The 8-step ALL ABOUT SQUATS posture ladder (A10:H11) gives the finer rank. Box methods: dead stop -> touch & go. Banded / reverse-banded box squats are out of scope while variable resistance is dormant (EQ-01, EQ-12). Levels are theoretical (CAT-05). | sets x reps (compound) | OBSERVED - BYOP files high-bar and low-bar back squats MODERATE (AI49:AI50) and leg press / pendulum ADVANCED (AI98:AI99) (OBSERVED); the generator follows the coach's v1 rule above and keeps the labels for traceability. Machines are not ranked by preference (COACH-ANSWER EQ-11): hack squat and leg press are more constrained than the Smith machine; use whichever machine feels right; the belt squat is for clients who should not be loaded axially (EQ-11, PER-04). The V-squat stays excluded (OBSERVED 'I don't presercibe the use of these, ever'; GEN-08 hard rule). The sheet ratings (ALL ABOUT SQUATS G35:H41: leg press and pendulum 'LOVE IT', hack squat "I PERSONALLY DON'T LIKE IT") stay as OBSERVED history but no longer rank the machines. 'Low DB Squats' (AI15) = DBs hanging at the sides, arms down - not goblet, not racked (COACH-ANSWER LIB-09). Older / injured / high-volume clients never get the overhead squat or the low-bar squat (EQ-03). Squats load the spine axially: the heavy squat and the heavy deadlift go on two different days (COACH-R2 R2-SES-01); goblet, hack and pendulum are fine on the second day if not sore (R2-SES-02, F.SPINEDAY). v1.1: belt squat = FOUNDATIONAL (COACH-R2 R2-LIB-07); every squat with hip extension credits glutes 0.25 (R2-VOL-05); PROPOSED wall sit (skiing, older adults). |
| **RP.KD.UL** | Unilateral knee dominant (lunge / split squat / step-up / single-leg squat) | 'UNILATERAL KNEE DOMINANT' (BYOP AL1); 'RP - UL - KNEE DOMINANT' (AL3; Sheet23 AM1); 'Unilateral KD' (program); 'ukd' (BASEBALL); 'UNI KD' (HYBRID B100); 'UNILATERAL KNE DOMINANT' (Sheet25 E11); 'UNILATERAL SAGITAL' (RESISTANCE PATTERNS C7); 'UNILATERAL FRONTAL' (C46); 'UNLATERAL TRANSVERSE' (C53); '*LUNGES are a UNILATERAL KNEE DOMINANT MOVEMENT' (ALL ABOUT LUNGES A3) | biomechanics | big | BYOP:'MASTER EXERCISE LIBRARY' AL9:AL21 (13, no level label) | no level blocks; difficulty = stance (FEET POSITIONING VARIATIONS / PROPULSION FFE-FLOOR-RFE) x load position & load laterality ('GET INTO THE HIP' / 'GET OUT OF THE HIP' MODERATE -> front-racked HARDER -> barbell HIGH LOADING) - RESISTANCE PATTERNS C9:C36, ALL ABOUT LUNGES | sets x reps per side | OBSERVED - 'Single Leg Get Ups' (AL14) = a box pistol: sit on a box, bench or chair and stand up on one leg, the other foot only touching for balance or held off the ground (COACH-ANSWER LIB-09). Counting: 3 x 10/10 = 3 sets, credited mostly to quads (COACH-ANSWER UNI-01); alternating lunges count the same way (UNI-07). Unilateral work progresses like bilateral work (UNI-05); heavy low-rep unilateral sets are an optional style (UNI-04). Load laterality use cases: see F.LOADLAT (COACH-ANSWER CAT-13). v1.1: PROPOSED sandbag walking lunge (HYROX station). |
| **RP.KD.ISO** | Knee-extension isolation (big-muscle isolation) | 'LEG EXTENSIONS' (BYOP AM1); 'Leg Extensions' (program); 'Leg Extensiona' (RESISTANCE PATTERNS A38); 'LEG EXT' (4 TRACKS); 'Leg Extension Machine' (AI20/AI55/AI101 - inside AI) | biomechanics (joint action) | big muscle, isolation dose | BYOP:'MASTER EXERCISE LIBRARY' AM9 (1); AI20, AI55, AI101 (cross-listed) | none - available at every level; the '-ADVANCED' label in AM3 is a copy typo (COACH-ANSWER LIB-15) | usually high reps / MYO SET (2-3 x 20, 'MYO SET'); but '3x8' in the 4 TRACKS strength block (N12/N20) and 3 x 10 in BOXING weeks 1-2 | OBSERVED - No machine: sissy squats (EQ-08); banded leg extensions are out (EQ-08: 'I don't want any bands in the program'). Counts fully toward quads (VOL-09). |
| **RP.HD** | Hip dominant | 'HIP DOMINANT' (RESISTANCE PATTERNS A59); 'HIP DOM' (CrossFit THURS); 'HD' (HYBRID 'UNI HD') | biomechanics | big (glutes, hamstrings) | BYOP:'MASTER EXERCISE LIBRARY' AN, AQ (AR and the curls inside AN moved to RP.LF, COACH-ANSWER CAT-09) | see lanes | sets x reps | OBSERVED - v1: knee flexion (leg curls, Nordics, slider / ball curls) is no longer hip-dominant volume - it is the LEG FLEXION node RP.LF (COACH-ANSWER CAT-09). |
| **RP.HD.BS** | Bilateral hip dominant (hinge / bridge / thrust / back extension) | 'BILATERAL HIP DOMNANT' (BYOP AN1); 'RP - BS - HIP DOMINANT' (AN3; Sheet23 AF1); 'RP-BS-HIP DOMINANT-INTERMIDIATE' (AO3; Sheet23 AG1); 'RP-BS-HIP DOMINANT-ADVANCED' (AP3; Sheet23 AH1); 'Bilateral HD' (program); 'bhd' (BASEBALL); 'BILATERAL HIP DOMINANT' (Sheet25 B11); 'POWERLIFTING Speacialty LIFT ' / 'SPEED SPECIALS' (RESISTANCE PATTERNS A75/A77) | biomechanics | big | BYOP:'MASTER EXERCISE LIBRARY' AN8 FOUNDATIONAL AN9:AN20 (12) / AN44 MODERATE AN46:AN55 (10) / AN89 ADVANCED AN91:AN101 (11) | implement (KB -> hex/DB -> barbell), then ROM via grip width (wide, snatch), bar-on-back (good morning), sumo; ROM 'Elevated'->'Floor'->'Deficit'; end range 'Dead stop'->'Touch & go'; '*RDL' extreme (RESISTANCE PATTERNS A61:A94). GHD has no level (COACH-ANSWER LIB-08): the MODERATE AN48 and ADVANCED AN93 entries become one L0 record. GHD and reverse hyper only if available and felt in the right muscles (EQ-11). Hip thrust machine (AN51) is easier than its MODERATE label because the machine stabilises (CAT-04, EQ-04). | sets x reps (compound) | OBSERVED - 9 of 33 options are knee-flexion curls (-> RP.LF, COACH-ANSWER CAT-09). Barbell deadlifts and good mornings load the spine axially (PER-04, F.AXIAL). v1.1 credit: hamstrings 1.0, glutes 0.25 (COACH-R2 R2-VOL-05: a quarter set for glutes on deadlifts and RDLs; it replaces the v1 PROPOSED glutes 0.5, which was the value `12_volume_algorithm_v1.json` counting.credit_map uses for hinges). The v0 glutes 1.0 (read from the row-6 label 'GLUTES/HAMSTRINGS') is retired: the slot PURPOSE names hamstrings first ('Hamstring' / 'Hamstring/Glutes'), the coach counts a unilateral lift 'mostly' for its first muscle (UNI-01), and `03_volume_dosing.md` retired the v0 glutes-1.0-from-every-hinge map. Hip-thrust / bridge / kickback items credit glutes 1.0 at exercise level (12 GLUTE_ISO, PROPOSED). The catalog already gives hinge glutes 0.25; the volume engine's 0.5 is to be aligned. KB swings count 0 sets (ballistic, R2-VOL-05). |
| **RP.HD.UL** | Unilateral hip dominant (staggered / single-leg hinge, SL bridge) | 'UNILATERAL HIP DOMINANT' (BYOP AQ1); 'RP - UL - HIP DOMINANT' (AQ3; Sheet23 AN1); 'Unilateral HD' (program); 'uhd' (BASEBALL); 'UNI HD' (HYBRID B76/B94); 'UNILATERAL SAGITAL' (RESISTANCE PATTERNS C60); 'BILATERAL LOADING' (C61); 'UNILATERAL LOADING ' (C70); 'UNLATERAL TRANSVERSE' (C76) | biomechanics | big | BYOP:'MASTER EXERCISE LIBRARY' AQ8 'FOUNDATIONAL' AQ9:AQ16 (8) | only a FOUNDATIONAL label; difficulty via stance (staggered with BILATERAL LOADING -> single-leg) and load laterality ('GET INTO THE HIP' contralateral / 'GET OUT OF THE HIP' ipsilateral) | sets x reps per side | OBSERVED - 'Alternating DB Deadlifts' (AQ13) / 'Alternating  Barbell Deadlifts' (AQ15) = alternating staggered-stance single-leg deadlifts: half a step back, deadlift on the front leg, switch, keep alternating (COACH-ANSWER LIB-09). 'Camporini Deadlifts' (AQ16) is removed (LIB-09: 'you can ignore that one'). Wired to AR (LEG CURLS) in both NO ACCESS tabs (OBSERVED); COACH-R2 R2-LIB-08: NO ACCESS is the self-serve version (no coach access, full gym library) and this slot reads the single-leg hinge list (AQ). v1.1 credit: hamstrings 1.0, glutes 0.25 (COACH-R2 R2-VOL-05: a quarter set for glutes on deadlifts and RDLs; it replaces the v1 PROPOSED glutes 0.5, which was the value `12_volume_algorithm_v1.json` counting.credit_map uses for hinges). The v0 glutes 1.0 (read from the row-6 label 'GLUTES/HAMSTRINGS') is retired: the slot PURPOSE names hamstrings first ('Hamstring' / 'Hamstring/Glutes'), the coach counts a unilateral lift 'mostly' for its first muscle (UNI-01), and `03_volume_dosing.md` retired the v0 glutes-1.0-from-every-hinge map. Hip-thrust / bridge / kickback items credit glutes 1.0 at exercise level (12 GLUTE_ISO, PROPOSED). The catalog already gives hinge glutes 0.25; the volume engine's 0.5 is to be aligned. KB swings count 0 sets (ballistic, R2-VOL-05). |
| **RP.LF** | Leg flexion (knee flexion: leg curls, Nordics, slider / ball curls) | 'LEG FLEXION' (Sheet25 H11 - the coach's own name for this slot); 'LEG CURLS' (BYOP AR1); 'Leg Curls' (program CATEGORY); 'LEG CURLS' (4 TRACKS); slider / swiss-ball / medball / Nordic / machine curls filed inside AN; COACH-ANSWER CAT-09: 'they shouldn't go in the hip-dominant movements. They should go in more of a flexion of the leg, kind of like bicep curls' | biomechanics (joint action: knee flexion), organised like a small-muscle isolation list (COACH-ANSWER CAT-09) | big muscle (hamstrings), isolation dose | BYOP:'MASTER EXERCISE LIBRARY' AR9:AR10 (2); AN15, AN17:AN19, AN50, AN54, AN91, AN100, AN101 (filed in BILATERAL HIP DOMINANT, moved here) | none for machine curls - available at every level (COACH-ANSWER LIB-15; the 'UNILATERAL' label in AR5 is a typo). Bodyweight curls get harder from bridge curls (slider / swiss ball / medball) to the eccentric Nordic curl (OBSERVED AN91 ADVANCED). Levels are theoretical (CAT-05). | usually high reps / MYO / '6 & 6' heavy-light; '3x8' in the 4 TRACKS strength block (N12/N20, 'LEG CURLS' P12) | COACH-ANSWER CAT-09 (node) / PROPOSED - PENDING COACH APPROVAL (lanes) - New in v1; replaces RP.HD.ISO (retired id kept as an alias). Knee flexion counts 1.0 toward hamstrings (leg curls count fully, VOL-09) and never toward the hinge pattern. The coach asked the team to 'find the right segmentations': lanes RP.LF.MACH and RP.LF.BW are PROPOSED - PENDING COACH APPROVAL. No curl machine: Nordics, slider or swiss-ball curls (COACH-ANSWER EQ-08). |
| **RP.LF.MACH** | Machine leg curls (seated / lying) | 'Seated leg curls' AR9; 'Lying Leg Curls' AR10; 'Leg Curl Machine' AN15; 'Machine Leg Curls (Seated and Laying Down)' AN54; 'Machine Leg Curls' AN100 | biomechanics (joint action) | big muscle, isolation dose | BYOP:'MASTER EXERCISE LIBRARY' AR9:AR10, AN15, AN54, AN100 | none - every level (COACH-ANSWER LIB-15); constraint 5 (seated machine with back pad, EQ-13) | high reps / MYO SET on the last exercise (VOL-15) | PROPOSED - PENDING COACH APPROVAL (lane) |
| **RP.LF.BW** | Bodyweight and free-weight leg curls (bridge curls, DB curls, Nordic) | 'Harmstring MedBall Curls' AN17; 'Supine Glidder hamstring curls' AN18; 'swiss ball hamstring curls' AN19; 'Medicine or Stability Ball Harmstring Curls' AN50; 'DB Harmstring Curls' AN101; 'Nordic Curl' AN91 | biomechanics (joint action) | big muscle, isolation dose | BYOP:'MASTER EXERCISE LIBRARY' AN17:AN19, AN50, AN101, AN91 | bridge curls (slider / ball / medball) -> DB curl -> Nordic (eccentric, OBSERVED ADVANCED) | sets x reps; Nordic as low-rep eccentric work (INFERRED) | PROPOSED - PENDING COACH APPROVAL (lane) - The no-machine swap for the leg-curl slot (COACH-ANSWER EQ-08). |
| **RP.PU** | Push | 'PUSH' (CrossFit FRID; HYBRID C81; AESTHETICS-12 M38/M54); 'UPPER BODY MECHANICS' (region, RESISTANCE PATTERNS E5) | biomechanics | big (chest) + small-with-pattern (front delts, triceps) | BYOP:'MASTER EXERCISE LIBRARY' AA, AD | see vectors | sets x reps | OBSERVED |
| **RP.PU.V** | Vertical push (overhead) | 'VERTICAL PUSH' (BYOP AA1; RESISTANCE PATTERNS E6); 'FOUNDATIONAL - RP - BS - VERTICAL PUSH' (AA3; Sheet23 V1); 'ADVANCED - RP - BS - VERTICAL PUSH' (AB3; Sheet23 W1); 'RP - UL - VERTICAL PUSH' (AC3; Sheet23 AJ1); 'Vertical Push' (program); 'vert push' (BASEBALL); 'OH PUSH' (HYBRID B95); 'PRESS' (CrossFit class TUES) | biomechanics | small-with-pattern (front/side delts, triceps) | BYOP:'MASTER EXERCISE LIBRARY' AA8 'FOUNDATIONAL  ' AA9:AA14 (6) / AA44 ADVANCED AA46:AA55 (10) / AA89 UNILATERAL AA91:AA94 (4) | base of support: seated with back support -> Z press on floor -> tall kneeling -> standing -> inverted; DB before barbell at each base (RESISTANCE PATTERNS E8:E15 green/yellow/red). COACH-ANSWER CAT-04 / COACH-R2 R2-LIB-02: overhead pressing needs more stability and skill, but the level comes from load position, skill and stability - a seated DB shoulder press or the seated machine shoulder press is FOUNDATIONAL (R2-LIB-02, R2-LIB-07); zone 3 is only a tag. A seated machine shoulder press is added for older and injured clients (EQ-05). | sets x reps (compound) | OBSERVED - Library also holds incline seated presses (-> RP.PU.M), push press/jerk (-> AP.TEX.JERK) and thrusters (complex). COACH-ANSWER LIB-11: the second 'Standing DB Press' (AA51) is a Standing Barbell Press. LIB-13: push press easier, push jerk intermediate/advanced. LIB-14: thrusters are conditioning-leaning, quads 1.0 + front delts ('shoulders') 0.5 (the thruster-specific answer wins over the general 0.25 helper rule of VOL-09); COACH-R2 R2-VOL-05 confirmed it and added glutes 0.25. v1.1: seated machine shoulder press = FOUNDATIONAL (COACH-R2 R2-LIB-07). |
| **RP.PU.V.BS** | Vertical push - bilateral symmetrical | 'BILATERAL SYMMETRICAL' (AA5/AB5); 'BS' | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' AA9:AA14, AA46:AA55 | - | - | OBSERVED |
| **RP.PU.V.UL** | Vertical push - unilateral / alternating | 'UNILATERAL' (AA89, AC5); 'RP - UL - VERTICAL PUSH' (AC3) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' AA91:AA94 | seesaw -> alternating -> landmine -> single-arm thruster | - | OBSERVED |
| **RP.PU.M** | Mid-range push (incline / landmine / viking) | 'MID RANGE PUSH' (RESISTANCE PATTERNS G6); 'Incline' (PPL DETAIL); 'HIGH INCLINE PRESS' (4 TRACKS STRENGTH-8); 'High incline db press' / 'Incline db press' / 'Incline barbell press' (BYOP AZ47:AZ49, AZ245, AZ250) | biomechanics | big (upper chest) + small (front delts) | RESISTANCE PATTERNS G8:G14 (uncoloured); BYOP:'MASTER EXERCISE LIBRARY' AA9:AA10, AD91, AD126, AA93 (scattered) | not rated (RESISTANCE PATTERNS G column has no colours) | sets x reps | OBSERVED in MM; PROPOSED as a BYOP node - BYOP folds it into VERTICAL PUSH (incline seated) and HORIZONTAL PUSH ADVANCED (incline DB bench). v1: credit chest 1.0, front delts 0.25, triceps 0.25 (VOL-09 helper default, as for bench); the incline credit question itself is still open (G5). |
| **RP.PU.H** | Horizontal push | 'HORIZONTAL PUSH' (BYOP AD1; RESISTANCE PATTERNS I6); 'Horizontal Push' (program; copy tab L1); 'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH' (AD3; Sheet23 X1); 'RP - BS - INTERMEDIATE - HORIZONTAL PUSH' (AE3; Sheet23 Y1); 'RP - BS - ADVANCED HORIZONTAL PUSH' (AF3; Sheet23 Z1); 'RP - UL - HORIZONTAL PUSH' (AG3; Sheet23 AK1); 'horiz push' (BASEBALL); 'BENCH PRESS' (HYBRID D81) | biomechanics | big (chest) + front delts/triceps | BYOP:'MASTER EXERCISE LIBRARY' AD8 FOUNDATIONAL AD9:AD14 (6) / AD44 MODERATE AD46:AD50 (5) / AD89 ADVANCED AD91:AD99 (9) / AD124 UNILATERAL AD126:AD130 (5) | ROM and stability: floor / cable / kneeling / incline push-up -> full push-up (+ flies) -> free-weight bench, dips, decline, deficit; feet position bench/wall -> raisers/floor -> in air (RESISTANCE PATTERNS I8:I28). COACH-ANSWER CAT-04/CAT-10: horizontal pushing is Davidson zone 2 (hands in front) - internal-rotation biased and compressive (a tag, not the level, R2-LIB-02), but 'safer for you when you push and pull'. | sets x reps (compound) | OBSERVED - Only upper pattern with 3 tiers in BYOP. Dips (AD96:AD97): 0.5 triceps / 0.5 chest, programmed on push days (COACH-ANSWER LIB-16). 'Bench Push ups': both versions (COACH-R2 R2-LIB-05 / LIB-12) - hands on the bench = foundational (AD13), feet on the bench = advanced (AF11 / Sheet23 Z4). v1 credit: chest 1.0, front delts 0.25, triceps 0.25 (COACH-ANSWER VOL-09 bench example: front delts and triceps are helpers). |
| **RP.PU.H.BS** | Horizontal push - bilateral symmetrical | 'BILATERAL SYMMETRICAL' (AD5:AF5) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' AD9:AD14, AD46:AD47, AD91:AD99 | - | - | OBSERVED |
| **RP.PU.H.UL** | Horizontal push - unilateral / alternating / offset | 'UNILATERAL' (AD124; AG5); 'RP - UL - HORIZONTAL PUSH' (AG3); 'UNILATERAL SAGITAL' (RESISTANCE PATTERNS I29) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' AD126:AD130 | alternating floor/cable -> one-hand-higher push-up -> alternating DB bench | - | OBSERVED |
| **RP.PU.H.ISO** | Chest fly (big-muscle isolation) | 'Flies' (PPL DETAIL); 'Bench DB Flies ' AD48 / 'Cable flies' AD49 / 'Machine flies' AD50; 'CABLE FLIES' / 'low to high FLIES' (4 TRACKS) | biomechanics (joint action) | big muscle, isolation dose | BYOP:'MASTER EXERCISE LIBRARY' AD48:AD50 (inside MODERATE) | - | INFERRED high reps by analogy with leg extensions; the only written fly dose is '3x8' ('CABLE FLIES' O23, dose N23, 4 TRACKS strength block) | OBSERVED items / PROPOSED lane |
| **RP.PL** | Pull | 'PULL' (CrossFit TUESD; AESTHETICS-12 M49/M64) | biomechanics | big (back) + biceps/rear delts | BYOP:'MASTER EXERCISE LIBRARY' U, X | see vectors | sets x reps | OBSERVED |
| **RP.PL.V** | Vertical pull | 'VERTICAL PULL' (BYOP U1; RESISTANCE PATTERNS E59); 'FOUNDATIONAL - RP - BS - VERTICAL PULL' (Sheet23 T1); 'ADVANCED - RP - BS - VERTICAL PULL' (Sheet23 U1); 'RP - UL - VERTICAL PULL' (Sheet23 AI1); 'Vertical Pull' (program); 'vert pull' (BASEBALL) | biomechanics | big (lats/upper back) | BYOP:'MASTER EXERCISE LIBRARY' U8 FOUNDATIONAL U9:U20 (12) / U44 ADVANCED U46:U52 (7) / U89 'UNILATERAL  ' U91 (1) | external assistance removed: pulldown / assisted machine -> strict bodyweight (body position feet behind -> in front -> knees in chest -> L-sit; grip) -> weighted. 'Assisted  Pull-Up w bands' (U15) is out of scope (no bands, COACH-ANSWER EQ-01). Overhead pulling is Davidson zone 3 as a tag only: a lat pulldown is FOUNDATIONAL (COACH-R2 R2-LIB-02). | sets x reps (compound) | OBSERVED - 'KB Face Pulls ' U20 -> RP.SM.DELT.REAR: shoulder work (side / rear delts / traps), a rear-delt option and a swap only, never the main vertical pull (COACH-R2 R2-LIB-04, LIB-10). Row before pulldown is the confirmed order (ORD-01). |
| **RP.PL.V.BS** | Vertical pull - bilateral | 'BILATERAL SYMMETRICAL' (U5/V5) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' U9:U20, U46:U52 | - | - | OBSERVED |
| **RP.PL.V.UL** | Vertical pull - unilateral | 'UNILATERAL' (W5); 'ANY' (W3); 'RP - UL - VERTICAL PULL' | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' U91 | - | - | OBSERVED |
| **RP.PL.V.ISO** | Straight-arm lat isolation (lat pull-over) | 'Pull under' / 'pull under' (4 TRACKS AESTHETICS-12 O48:V48, O64:V64); 'Lat pull unders' (RESISTANCE PATTERNS E67); 'LAT PULL OVERS' / 'Cable lat pull over' (BASEBALL); COACH-ANSWER LIB-09: 'The pull under is really called a pull over. If you're doing it on a cable machine with your lats, you're doing a lat pull over.' | biomechanics (joint action) | big muscle, isolation dose | - | - | INFERRED high reps (no written dose isolates the pull-under) | OBSERVED items / PROPOSED lane - Not in BYOP library. |
| **RP.PL.H** | Horizontal pull (rows) | 'HORIZONTAL PULL' (BYOP X1; RESISTANCE PATTERNS G59); 'RP - BS - HORIZONTAL PULL' (Sheet23 AA1); 'RP-BS-ADVANCED HORIZONTAL PULL' (Sheet23 AB1); 'RP - UL - HORIZONTAL PULL' (Sheet23 AL1); 'Horizontal Pull' (program); 'horiz pull' (BASEBALL); 'HOR PULL' / 'HOR ROW' (HYBRID B77/B88) | biomechanics | big (lats/upper back, rear delts) | BYOP:'MASTER EXERCISE LIBRARY' X8 FOUNDATIONAL X9:X13 (5) / X44 ADVANCED X46:X54 (9) / X89 UNILATERAL X91:X92 (2) | support removed: machine / TRX / inverted -> free-standing hinge rows -> seal rows -> renegade; 'STANCES' (split stance ALWAYS contralateral, half kneeling same/opposite) for single-arm. Rows are Davidson zone 2 (hands in front, CAT-04/CAT-10). | sets x reps (compound) | OBSERVED - 'Kong Rows' (RESISTANCE PATTERNS G77) = two kettlebells on the floor, wide stance, hinge down, row them off the floor and set them down each rep - low stimulus, used for shoulder or back pain and to strengthen the hinge position (COACH-ANSWER LIB-09). Horizontal pull before vertical pull (ORD-01). v1.1: Table Row (inverted row under a sturdy table) added for home clients (COACH-R2 R2-LIB-07). |
| **RP.PL.H.BS** | Horizontal pull - bilateral | 'BILATERAL SYMMETRICAL' (X5/Y5) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' X9:X13, X46:X54 | - | - | OBSERVED - 'Renegade Rows' X54 is alternating (-> UL lane). |
| **RP.PL.H.UL** | Horizontal pull - unilateral / single arm | 'UNILATERAL' (X89; Z5); 'ANY' (Z3); 'UNILATERAL SAGITAL' (RESISTANCE PATTERNS G73); 'STANCES' (G82) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' X91:X92 | stance: split (contralateral) / half-kneeling same / opposite | - | OBSERVED |
| **RP.PL.M** | Mid-range pull (incline / high row) | - | biomechanics | big | - | - | - | PROPOSED (gap) - No counterpart to 'MID RANGE PUSH' exists anywhere; listed only so the push/pull grid is symmetric. Coach to confirm. |
| **RP.SM** | Small-muscle isolation (muscle-organised) | 'SHOULDERS/BICEP/TRICEP' (RESISTANCE PATTERNS K6); 'SMALLER ISOLATIONS' (BASEBALL C19); 'RP - BICEP' / 'RP - TRICEP' / 'RP - CALVES' / 'RP -SHOULDERS' (zone codes); 'the survival' (4 TRACKS, partly) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AH, AS, AT, AU | none - single unlevelled list per muscle; variety via grip x implement x arm position ('Zone 1/2/3') | usually high reps / MAX / MYO / 'ALL' effort; level- and goal-dependent ('3x8' in the 4 TRACKS strength block; PPL side raises down to 4 x 8) | OBSERVED |
| **RP.SM.DELT** | Shoulders (deltoid isolation) | 'SIDE RAISES' (BYOP AH1); 'RP -SHOULDERS' (AH3; Sheet23 AQ1); 'SHOULDERS' (AH6; RESISTANCE PATTERNS K7); 'Shoulders/Traps' (program PURPOSE); 'shoulders' (BASEBALL); 'SHOULDERS/TRAPS 👇' (AZ44) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AH9:AH20 (12) | none | usually 15-20+ reps (UL 3 x 20; PPL NOVICE 3 x 15); but 4 x 8 for PPL NEWBY/INTERMEDIATE side raises (F17/J17) and '3x8' in the 4 TRACKS strength block (N16) | OBSERVED - One list mixes lateral raises, front raises and reverse flies. |
| **RP.SM.DELT.SIDE** | Side delt (abduction) | 'ABdution' (program CATEGORY); 'Side raises' / 'DB side raises' / 'Cable side raises' | muscle (joint action) | small | BYOP:'MASTER EXERCISE LIBRARY' AH9, AH11, AH14, AH16, AH17, AH19 | - | - | OBSERVED |
| **RP.SM.DELT.REAR** | Rear delt (horizontal abduction / external rotation) | 'Reverse Flies' (PPL DETAIL); 'face pulls' (4 TRACKS); 'KB Face Pulls ' (BYOP U20, filed under VERTICAL PULL) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AH10, AH15, AH20, U20 | - | - | OBSERVED items / PROPOSED lane - Rear delts get their own sets on lifting days (COACH-ANSWER VOL-17: 'Rear delts and calves need to get their own sets and reps'). 'KB Face Pulls ' (U20) belong here: shoulder work, programmed on pull or shoulder days, adjustable (COACH-R2 R2-LIB-04, LIB-10). v1.1 also adds the coach-approved Floor Prone Y / T Raises (R2-LIB-07) and PROPOSED external-rotation work (side-lying DB / cable external rotation; catalog ARMCARE, not counted). |
| **RP.SM.DELT.FRONT** | Front delt (flexion) | 'Front Raises w/ DB' AH12; 'Front Raises w/ Barbell' AH13; 'DB Front Raises Supinated Grip' AH18 | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AH12, AH13, AH18 (AH16 hammer side/front) | - | - | OBSERVED items / PROPOSED lane |
| **RP.SM.TRAP** | Traps / upright row | 'SHOULDERS/TRAPS' (AA6); 'DB upright rows' / 'Barbell upright rows' (AZ52:AZ53); 'UPRIGHT ROWS' (4 TRACKS, FAT BURN) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AZ52:AZ53 (focus list only) | - | - | PROPOSED - upright rows are side-delt work in the ABdution slot (LIB-16 assumption stands; the PARTLY verdict addressed dips only); traps are unclassified (CAT-02). - The coach puts upright rows in the 'ABdution' / 'Shoulders/Traps' slot; traps are named but never a separate list. |
| **RP.SM.BI** | Biceps (elbow flexion) | 'BICEP' (BYOP AS1/AS6); 'RP - BICEP' (AS3; Sheet23 AO1); 'Bicep' (program); 'bicep' / 'biceps' (BASEBALL); 'BICEPS' (RESISTANCE PATTERNS K23); 'BICEP 👇' (AZ311) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AS9:AS22 (14) | none; grip x implement grid (RESISTANCE PATTERNS K24:K30) | usually 15-20+ reps / MAX; '3x8' curls in the 4 TRACKS strength block (N16, 'CURLS' P16) and 3 x 8 'ALL' in STRENGTH-8 (row 16) | OBSERVED - COACH-ANSWER LIB-17: the seated DB curl near-duplicates ('Seated Db Bicep Curls' AS14, 'Seated DB Curls ' AS16) merge into one record. 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (AS12) = cable curls with the arm in Davidson zone 1, 2 or 3 (CAT-10). v1.1: Kettlebell Curl added for home clients (COACH-R2 R2-LIB-07). |
| **RP.SM.TRI** | Triceps (elbow extension) | 'TRICEP' (BYOP AT1/AT6); 'RP - TRICEP' (AT3; Sheet23 AP1); 'Tricep' (program); 'tricep' / 'triceps' (BASEBALL); 'TRICEPS' (RESISTANCE PATTERNS K31); 'TRICEP 👇' (AZ124); 'Push' / 'Overhead' (PPL DETAIL) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AT9:AT17 (9) | none; arm position = Davidson zone (zone meaning: COACH-ANSWER CAT-10). Pushdown with the arms down = zone 1, overhead extension = zone 3 (Sheet23 AP5 '(Zone 3)'; the rope item AP6 is marked '(Zone 1 and Zone 3)'); the exercise-to-zone mapping is INFERRED | usually 15-20+ reps ('TATE PRESS' '3x20', N15); 'JM PRESS' '3x8' (N24) | OBSERVED |
| **RP.SM.CALF** | Calves (plantar flexion) | 'CALVES' (BYOP AU1/AU6); 'RP - CALVES' (AU3; Sheet23 AR1); 'Calves' (program); 'calfs' / 'calf' / 'CALF' (BASEBALL); 'CALVES 👇' (AZ331) | muscle | small | BYOP:'MASTER EXERCISE LIBRARY' AU9:AU13 (5) | none; deficit ROM ('(use deficit)') | 15 / MAX REPS | OBSERVED - v1 (COACH-ANSWER VOL-17): calves get 3 sets every leg day (single-leg on a ramp/plate, deficit, or bilateral) and are treated like any other muscle. BASEBALL fills ~43% of 'calfs' slots with ankle hops (AP.JMP.LK): 17 of 40 filled calf slots after re-aligning the shifted label at P37, 16 of 40 as printed (OBSERVED); those hops are athletic exposure, not calf sets (VOL-10). v1.1: PROPOSED bent-knee (soleus) calf raise counts as calves; the PROPOSED tibialis raise sits beside it and counts nothing (shin is not one of the 10 groups). |
| **RP.SM.NECK** | Neck (isolation) | - | muscle | unclassified (COACH-ANSWER CAT-02 leaves the neck unplaced) | - | isometric 4-way holds (hand / partner resistance) -> loaded plate flexion / extension on a bench (04_profiles injury_library NECK; SCIENCE) | seconds per direction / reps | PROPOSED (v1.1) - New in v1.1 for collision and grappling sports (football, wrestling, rugby, ice hockey, lacrosse, BJJ / judo, MMA, Muay Thai): 04_profiles lists 'No neck exercises' as a library gap and an ISO_NECK category. Two PROPOSED-ADDITION exercises in the catalog (neck isometric holds 4-way; plate neck flexion / extension); not counted as muscle sets; no bands (EQ-01). Pending coach approval. |
| **CO.CT** | Core thorax (trunk moves on a still pelvis) | 'CORE THORAX' (BYOP O1, O8; CONTROL PATTERNSCORE A7/H7/O7); 'CT' (Sheet23 N1:P1); 'CORE THORAX SAGITAL' / 'CORE THORAX FRONTAL' / 'CORE THORAX TRANSVERSE' (O5:Q5) | biomechanics | small | BYOP:'MASTER EXERCISE LIBRARY' O9 FOUNDATIONAL O10:O16 (6) / O45 MODERATE O47 (1) / O90 ADVANCED O92:O94 (3) | plane SAG ('EASY') -> FRO ('MODERATE') -> TRA ('HARD') | time / reps / accumulate | OBSERVED - Rule confirmed (COACH-ANSWER CAT-08). 'Toes to bar' / 'Knees to chest' (O15:O16) are filed here in BYOP but the rule puts them in CO.CP - the coach calls toes to bar 'a little bit more complicated' (PROPOSED CO.CP, pending). |
| **CO.CP** | Core pelvis (pelvis / legs move on a still trunk) | 'CORE PELVIS' (BYOP R1, O124; CONTROL PATTERNSCORE A18/H18/O18); 'CP' (Sheet23 Q1:S1); 'CORE PELVIS SAGITAL' / 'FRONTAL' / 'TRANSVERSE' (R5:T5) | biomechanics | small | BYOP:'MASTER EXERCISE LIBRARY' O126 FOUNDATIONAL O127:O130 (4) / O162 MODERATE O164:O165 (2) / O207 ADVANCED O209 (1); original R8:R91 | plane SAG -> FRO -> TRA | time / reps | OBSERVED - Rule confirmed (COACH-ANSWER CAT-08). 'Coppenhaggen Plank' (O165) is 'a little bit more complicated' (PROPOSED: CO.CB frontal static + adductor credit, pending). v1.1: PROPOSED Single-Leg Balance Reach (court sports, older adults; filed CO.CP by the CAT-08 rule, INFERRED). |
| **CO.CB** | Core both (thorax and pelvis move or brace together) | 'BOTH' (CONTROL PATTERNSCORE A29/H28/O28) | biomechanics | small | MM CONTROL PATTERNSCORE B29:B37, E29:E32, I28:I30, L28:L30, S28:S30 | not graded | time / reps | OBSERVED in MM; confirmed as a region (COACH-ANSWER CAT-08: 'Then both at the same time'); absent from BYOP - Dead bugs, bird dogs, V-ups, planks, side planks, Turkish get-ups, bear crawl. The merged 'Side Plank(s)' record lives here (LIB-17, PROPOSED). v1.1: PROPOSED Streamline Hold (hollow body, arms locked overhead) for swimmers. |
| **CA.A** | A / blue - short duration, high intensity | 'A' (AEROBIC A24, bg A4C2F4); 'Short Duration ' (A25); 'High Intensity' (A26); '15/45' ... '45/15 Work:Rest' | energy_system | - | - | beginner -> intermediate: denser work:rest; -> advanced: pace SPRINT/FAST | work:rest seconds | OBSERVED |
| **CA.B** | B / green - moderate duration, moderate intensity | 'B' (B24, bg B6D7A8); 'Moderate Duration' (B25); 'Moderate Intensity' (B26); '1 Minute'..'3 Minutes', '1:1'..'1:3' | energy_system | - | - | 5 -> 7 sets, then '4-6'/'3-5'/'2-4' at FASTEST | minutes | OBSERVED |
| **CA.C** | C / orange - long duration, low intensity | 'C' (C24, bg F9CB9C); 'Long Duration' (C25); 'Low intensity' (C26); '4+ Minutes'; '30-40 mi slow/steady CARDIO' (FAT BURN; 4 TRACKS); '15-40 min constant cardo easy' (HYBRID 'DISTANCE') | energy_system | - | - | running time ~20 -> ~33 min, then pace | minutes / miles | OBSERVED |
| **CA.LC** | Lactate clearance (surge-and-float) | '  LACTATE CLEARANCE ' (AEROBIC G23); 'LVL 4 = LACTATE CLERANCE' (CrossFit) | energy_system | - | - | level 4 only | minutes, no rest within | OBSERVED |
| **CA.BUY** | Buy-out sprint finisher | 'Buy out' (BASEBALL Part E, bg FFF2CC) | energy_system | - | - | - | 1-3 bouts of 10-20 cal or 15-30 s | OBSERVED - Energy zone = 'SPEED POWER' 10-39 s. |
| **CA.WOD** | Mixed-modal WOD | 'WODs' / 'WODS' / 'WOD' (CrossFit) | energy_system | - | - | 'LVL 1 = 1 a week' ... 'LVL 4 = wods a week' | sessions per week | OBSERVED |
| **CA.CIRC** | Metabolic circuit | 'CIRCUITS RECCOMENDED' (FAT BURN B36); '20 on/ 10 off - TABATA TIMER' (MM ATHLETIC C30; A30 'TABATA'); 'AMRAP' (HYBRID D70) | energy_system | - | - | rounds 3->5, work 30->50 s | rounds x seconds | OBSERVED - Bootcamp circuits: 3-5 rounds x 30-50 s per station, about 5-7 stations, a 35-45 minute session, any number of sessions a week (COACH-ANSWER PRG-03). FAT BURN circuits are a finisher after lifting (PRG-11). |
| **FN.AOS** | Anterior oblique system | 'ANTERIOR OBLIQUE SYSTEM' (BC6); 'INTEGRATED WITH PUSH & LEGS' (BC44, BC89, BC124) | sling | - | BYOP:'MASTER EXERCISE LIBRARY' BC8:BC125 | chop direction + position (see facets) | - | OBSERVED |
| **FN.AOS.CHOP** | Chops (adducted, rotational crunch) | 'CHOPS' (BC8) | sling | - | BYOP:'MASTER EXERCISE LIBRARY' BC9:BC20 (12 = 3 directions x 4 positions) | down (green) -> midline (yellow) -> up (red) | - | OBSERVED |
| **FN.AOS.AROT** | Anti-rotation (Pallof) with adduction | 'ANTI ROTATIONS' (BC45) | sling | - | BYOP:'MASTER EXERCISE LIBRARY' BC46:BC49 (4) | floor supine -> kneeling -> half kneeling -> split standing | - | OBSERVED |
| **FN.AOS.PLANK** | Planks with adduction | 'PLANKS' (BC90) | sling | - | BYOP:'MASTER EXERCISE LIBRARY' BC91 (1) | - | - | OBSERVED |
| **FN.AOS.CRUNCH** | Crunches (empty) | 'CRUNCHES' (BC125) | sling | - | - | - | - | OBSERVED (empty) |
| **FN.POS** | Posterior oblique system | 'POSTERIOR OBLIQUE SYSTEM' (BD6); 'BRIDGES' (BD8); 'INTEGRATIONS WITH PULL & LEGS' (BD9) | sling | - | - | - | - | OBSERVED (empty) |
| **FN.LSS** | Lateral subsystem | 'LATERAL SUBSYSTEM' (BE6); 'SIDE LYING' (BE8); 'INTEGRATIONS LEGS & DELTS' (BE9) | sling | - | - | - | - | OBSERVED (empty) |
| **FN.CARRY** | Carries | 'CARRY' (BA1/BA6); 'PROPULSIVE' / 'STATIONARY' (BA8/BA10); 'BILATERAL' / 'UNILARTERAL' (BA13/BA14); 'single side carry' (CONTROL PATTERNSCORE B10, TRANSVERSE/THORAX/DYNAMIC) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' BA (no exercises) | - | distance / time | OBSERVED (empty) - v1.1: the LIB-19 PROPOSED starters (farmer carry, farmer hold, front-rack / overhead KB carry, sandbag carry) are used by HYROX (200 m farmer carry), OCR and wrestling (catalog `sport_use_v1_1`). |
| **FN.DRAG** | Drags | 'DRAGS' (BB1); 'DRAG' (BB6); 'SAGITAL' / 'FRONTAL' (BB8/BB10) | biomechanics | - | BYOP:'MASTER EXERCISE LIBRARY' BB (no exercises) | - | distance | OBSERVED (empty) - v1.1: the LIB-19 PROPOSED sled push / drags plus a PROPOSED hand-over-hand Sled Rope Pull (HYROX station). |
| **X.FOCUS** | Specialisation menu (muscle focus) | 'FULL FOCUS LIST' (AZ1); 'MUSCLE FOCUS OPTIONS' (AZ6); 'Focus 1' / 'Focus 2' (program); 'ACCESSORIES' (4 TRACKS AESTHETICS-8); 'UPPER ACCESORY' / 'LOWER ACCESORY' (HYBRID) | muscle | - | BYOP:'MASTER EXERCISE LIBRARY' AZ8:AZ332 (51 items in 10 groups) | none | sets added to the chosen muscle | OBSERVED - The coach's 'more sets for the muscle you want to grow' lever: a priority muscle gets about +4-6 sets a week, capped around 25-30 (COACH-ANSWER VOL-02, PARTLY: 'that's the idea'). Focus slots may hit the same muscle, 2-3 sets each (COACH-ANSWER ORD-11); medball is never a focus option for aesthetics (ATH-05). |
| **X.PREP** | Warm-up / primer | 'DYNAMIC MEDBALL WARMUP DRILLS' (BALLISTICS A4); 'RUNNING WARMUP' (AEROBIC E23); '**Follow Running Warmups' (AEROBIC A4); 'Any Cardio Equipment' 1 x '5 Minutes' (UL/PPL); 'WARMUP/SKILL' (CrossFit class R3); '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' | meta | - | - | - | time / yards / reps | OBSERVED - A warm-up is always written: 5 min any cardio + A March / Skip / Run or mobility; A-drills do not count as volume (COACH-ANSWER ORD-08). Core work doubles as the warm-up when it opens the session (ATH-11). |
| **X.SKILL** | Skill practice (CrossFit gymnastics) | 'SKILL' / 'SKILLS' (CrossFit); 'T2B/ DUBS' / 'H.S./ DUBS'; 'GYMNASTICS' / 'DUBS' (class) | quality | - | - | - | practice | OBSERVED |
| **X.TEST** | Tests | 'TEST' (4 TRACKS / CONJUGATE); 'TEST/PEAK' (CrossFit); 'LVL 5 = Work up to 1RM'; 'DISTANCE TEST' (BYOP B24 and again B89 - duplicate block) / 'SPEED TEST' (B44); 'SPEED ENDURANCE TEST' only in tab 'Copy of Copy of MASTER EXERCISE' B27 (not in the live library); '1-mile at max effort' (Sheet24) | meta | - | BYOP:'MASTER EXERCISE LIBRARY' B24:B33, B44:B47, B89:B98 | - | result | OBSERVED - '21.6 mile run' (B33, B98): removed from plans and tests (COACH-R2 R2-LIB-06; the v1 flag: he called it a marathon, which is 26.2 mi). Tests are chosen by checkbox at block start, or no testing (PER-07); v1.1 (COACH-R2 R2-PER-07): test before the block (or in week 1) and at the end, never mid-block; untrained people never test a 1RM or a max mile from zero - a 5RM / 3RM or 80-90 % efforts. |


### 1.2 Program slot vocabulary → node (BYOP templates)

These are all the slot types used in the nine BYOP program tabs. Each one is a PURPOSE / CATEGORY pair wired to one library column (OBSERVED in the data validations, `analysis/library/L4_slot_wiring.md`):

| PURPOSE (verbatim) | CATEGORY / DETAIL (verbatim) | Library range | Node | Default muscle credit (v1: 1.0 named muscle / 0.25 helper, COACH-ANSWER VOL-09; athletic slots never count, VOL-10) |
|---|---|---|---|---|
| `'Quads'` | `'Bilateral KD'` | AI7:AI122 | RP.KD.BS | quads 1.0, glutes 0.25 (COACH-R2 R2-VOL-05), adductors 0.25 (PROPOSED - PENDING COACH APPROVAL, as in `12_volume_algorithm_v1.json`); thrusters quads 1.0 + shoulders 0.5 + glutes 0.25 (R2-VOL-05) |
| `'Quads/Glutes'` | `'Unilateral KD'` | AL7:AL42 | RP.KD.UL | quads 1.0, glutes 0.25, adductors 0.25 ('mostly for quads', COACH-ANSWER UNI-01; 'I don't necessarily count it for glutes'; v1.1: the glute 0.25 is approved by COACH-R2 R2-VOL-05, the adductor value stays PROPOSED); 3 x 10/10 = 3 sets |
| `'Quads'` | `'Leg Extensions'` | AM7:AM9 | RP.KD.ISO | quads 1.0 |
| `'Hamstring'` | `'Bilateral HD'` | AN7:AN122 | RP.HD.BS | hamstrings 1.0, glutes 0.25 (COACH-R2 R2-VOL-05; the v1 PROPOSED 0.5 and the v0 glutes 1.0 from library row 6 `'GLUTES/HAMSTRINGS'` are retired); hip-thrust / bridge items credit glutes 1.0 at exercise level; KB swings 0 (ballistic, R2-VOL-05) |
| `'Hamstring/Glutes'` | `'Unilateral HD'` | AQ7:AQ42 (AR7:AR42 in both NO ACCESS tabs as wired; COACH-R2 R2-LIB-08: NO ACCESS is the self-serve version and this slot reads AQ) | RP.HD.UL | hamstrings 1.0, glutes 0.25 (COACH-R2 R2-VOL-05); 3 x 10/10 = 3 sets (UNI-01) |
| `'Hamstrings'` | `'Leg Curls'` | AR7:AR10 | RP.LF (LEG FLEXION, CAT-09) | hamstrings 1.0 |
| `'Back'` | `'Horizontal Pull'` | X7:X162 | RP.PL.H | back 1.0, rear delts 0.25, biceps 0.25 |
| `'Back '` (trailing space) | `'Vertical Pull'` | U7:U122 | RP.PL.V | back 1.0, biceps 0.25 |
| `'Chest'` | `'Horizontal Push'` | AD7:AD162 | RP.PU.H | chest 1.0, front delts 0.25, triceps 0.25 (COACH-ANSWER VOL-09 bench example) |
| `'Chest'` | `'Incline'` (PPL) | AD7:AD162 | RP.PU.M (proposed) | chest 1.0, front delts 0.25, triceps 0.25 (VOL-09 default; incline credit still open, G5) |
| `'Chest'` | `'Flies'` (PPL) | AD7:AD162 | RP.PU.H.ISO | chest 1.0 |
| `'Chest'` | `'Dips'` (PPL) | AD7:AD162 | RP.PU.H | triceps 0.5, chest 0.5, on push days (COACH-ANSWER LIB-16) |
| `'Chest/Shoulders'` | `'Vertical Push'` | AA7:AA122 | RP.PU.V | front delts 1.0, side delts 0.25, triceps 0.25 |
| `'Shoulders/Traps'` | `'ABdution'` | AH7:AH42 | RP.SM.DELT.SIDE | side delts 1.0 |
| `'Shoulders/Traps'` | `'Reverse Flies'` (PPL) | AH7:AH42 | RP.SM.DELT.REAR | rear delts 1.0, back 0.25; rear delts get their own sets (VOL-17); the KB face pull is shoulder work in this slot (COACH-R2 R2-LIB-04, LIB-10) |
| `'Bicep'` | `'Bicep'` | AS7:AS42 | RP.SM.BI | biceps 1.0 |
| `'Tricep'` | (blank) / `'Tricep'` / `'Push'` / `'Overhead'` | AT7:AT42 | RP.SM.TRI | triceps 1.0 |
| `'Calves'` | `'Calves'` / (blank) | AU7:AU13 | RP.SM.CALF | calves 1.0; 3 sets every leg day (VOL-17) |
| `'Plyo'` | `'Plyo'` / `'PLYO'` | G7:G162 | AP.JMP (track by pick) | athletic exposure only - never muscle volume (VOL-10) |
| `'Throwing'` | `'Throwing'` | K7:K87 | AP.THR | athletic exposure only (VOL-10) |
| `'COD'` | `'COD'` | L7:L242 | AP.COD | athletic exposure only (VOL-10) |
| `'Tripple Extension'` | `'Tripple Extension'` | C7:C242 | AP.TEX (or AP.JMP.LK for C124 picks) | athletic exposure only (VOL-10); KB swings are ballistic power work here, never glute sets (R2-VOL-05) |
| `'Core'` | (blank) | O7:O283 | CO.CT, CO.CP or CO.CB by pick (CAT-08) | abs/obliques 1.0; first in the session by default, movable (ATH-11) |
| `'Cardio'` / `'Aerobic Capacity'` | (blank) | B7:B122 (B7:B335 in BOOTCAMP - OPTION 2 E7/E12/E22/E27) | CA | bouts, not sets |
| `'Focus 1'` / `'Focus 2'` | (blank) | AZ7:AZ335 | X.FOCUS | the muscle the client picks |

Two OBSERVED properties of this grammar matter for the engineer, plus one v1 rule:
- **On the athletic rows, PURPOSE and CATEGORY are the same word** (`'Plyo'`/`'Plyo'`). On resistance rows PURPOSE is a muscle and CATEGORY is a pattern. Athletic slots are defined by a quality; resistance slots by a muscle × pattern pair.
- **A slot fixes the library column, not the movement.** Several columns contain items that belong to another node (leg extensions in AI, leg curls in AN, flies in AD, push press in AA, face pulls in U; full list in section 6.2). Count volume by the picked exercise's node, not by the slot.
- **Default plus dropdown (COACH-ANSWER GEN-04).** The generator picks a default exercise for every slot and keeps the dropdown so the client can swap within the same category; client preference may choose between listed alternatives (EQ-10).

All the other slot grammars (BASEBALL `'bkd'`/`'uhd'` and Parts A–E, CrossFit `'KNEE DOM'`/`'LB'`, 4 TRACKS `'the work'`…`'the survival'`, HYBRID `'UNI HD'`/`'OLY/ POWER'`) are crosswalked in section 5. The session-position roles they express are facet `F.ROLE`.

---

## 2. The axes he buckets by (facets)

Every exercise record carries one value for each facet that applies to it (COACH-ANSWER CAT-01: every exercise on every lens at once). The tree says *where an exercise lives*; the facets say *how it is performed and what it trains*. There are 47 facets with 255 values. v1.1: `F.OLYFAM` (Olympic family and day, R2-ATH-04), `F.SPINEDAY` (spine-loading day class, R2-SES-02) and `F.DETAIL` (one-detail variation, R2-LIB-01) are new, and `F.PMETHOD` is named (Receive-Create stages, R2-ATH-03). v1: `F.PZONE` is replaced by `F.PMETHOD`; `F.DZONE` (Davidson position zone) and `F.AXIAL` (axial spinal load) are new; `F.ACCOM` is DORMANT; `F.CONSTRAINT` uses the coach's approved scale.

| Facet ID | Axis | Applies to | Values (codes) |
|---|---|---|---|
| `F.LEVEL` | Exercise tier (level of the exercise inside its bucket) | every AP/RP/CO/FN record | L1, L2, L3, L0 |
| `F.CLIENT` | Client level (Level 1 / 2 / 3 - dose tier of a whole program) | programs / client profile | C1, C2, C3, C4 |
| `F.REGION` | Body region | RP (and AP where relevant) | LOWER, UPPER, TRUNK, WHOLE |
| `F.DOM` | Joint dominance (lower) / direction x vector (upper) | RP, AP.JMP | KNEE, HIP, ANKLE, KNEE_FLEX, PUSH_V, PUSH_M, PUSH_H, PULL_V, PULL_H |
| `F.LAT` | Laterality of the stance / limbs | RP, AP, CO | BS, UL, ALT, STAG, OFFSET |
| `F.LOADLAT` | Load laterality ('into' / 'out of' the hip) | RP.KD.UL, RP.HD.UL, RP.PL.H.UL, AP.THR, FN | DOUBLE, CONTRA, IPSI, SINGLE |
| `F.PLANE` | Plane | every family | SAG, FRO, TRA, MULTI |
| `F.CMODE` | Core mode (static vs dynamic) | CO, FN | DYN, STA |
| `F.SIZE` | Muscle size class | RP (CO treated as small) | BIG, SMALL |
| `F.XCLASS` | Exercise class / dose class | every record | BIG_COMP, BIG_ISO, SMALL_ISO, SMALL_COMP, CONTROL, ATHLETIC, COND |
| `F.QUALITY` | Quality trained (PURPOSE row for non-muscle work) | AP, CA, programs | SPEED_POWER, COD, AEROBIC, CORE, STRENGTH, HYPERTROPHY, SKILL, WOD, TEST |
| `F.INTENT` | Intent: ballistic vs plyometric (and speed vs strength) | AP, fast RP | BALLISTIC, PLYOMETRIC, SPEED_STRENGTH, MAX_STRENGTH |
| `F.PHASE` | Force phase (plyo/ballistic progression) | AP.JMP, AP.UBP | P1, P2, P3, P4 |
| `F.PMETHOD` | Receive-Create stages (plyo execution stage; named and timed by the coach, COACH-R2 R2-ATH-03) | AP.JMP, AP.UBP (execution modifier on any jump, hop or plyo push-up) | RECEIVE_PAUSE, RECEIVE_CREATE, REPEAT_RC |
| `F.DZONE` | Davidson position zone (rotation bias) | RP (upper body: arm position; lower body: hip/knee position), CO and FN holds; NOT plyometrics (COACH-ANSWER CAT-10) | Z1, Z2, Z3 |
| `F.SSC` | SSC speed tier (speed-session order) | AP.JMP, AP.SPD | FASTEST, FAST, SPRINT |
| `F.TURN` | Turn severity (COD level) | AP.COD | EASY_TURN, MOD_TURN, HARD_TURN |
| `F.OLY` | Olympic start position & receive | AP.TEX | HIGH_HANG, MID_HANG, LOW_HANG, FLOOR, POWER, SQUAT |
| `F.OLYFAM` | Olympic lift family and day (v1.1) | AP.TEX (Olympic lifts and derivatives) | CLEAN, SNATCH, JERK, LOADED_JUMP |
| `F.STANCE` | Stance / base of support | RP, AP.THR, FN | FFE, FLOOR, RFE, FFE_RFE, WALL, STEP, SPLIT_CONTRA, HK_SAME, HK_OPP, TALL_KNEEL, SEATED, Z_FLOOR, STANDING, SUPINE, HANGING, PLANK, SUMO, LATERAL |
| `F.ORIENT` | Movement orientation (lunges) | RP.KD.UL | FB, LAT, CURTSY |
| `F.LOADPOS` | Load position | RP.KD (BS & UL), RP.HD, AP.THR warm-ups | SIDES, GOBLET, COUNTER, HIGH_ZERCHER, ZERCHER, FRONT_RACK, BACK_HIGH, BACK_LOW, OVERHEAD, SHOULDER |
| `F.IMPL` | Implement | every record | BW, DB, KB, BB, MB, CABLE, MACHINE, BAND (DORMANT - no bands, EQ-01), SUSP, BAR, PROP, FIELD, ERG |
| `F.CONSTRAINT` | External stability / constraint | RP mainly | C1, C2, C3, C4, C5 |
| `F.AXIAL` | Axial spinal load | RP.KD.BS, RP.HD.BS, loaded RP.KD.UL / RP.HD.UL, RP.PU.V (standing), AP.TEX | HIGH, LOW, NONE |
| `F.SPINEDAY` | Spine-loading day class (v1.1) | RP.KD.BS, RP.HD.BS, loaded RP.KD.UL / RP.HD.UL, AP.TEX | COUNTED, SECOND_DAY_OK, NOT_COUNTED |
| `F.GRIP` | Hand placement / grip | RP upper, RP.HD.BS (grip width) | SUP, NEU, PRO, WIDE, NARROW, SNATCH |
| `F.BODYPOS` | Feet / body position (trunk demand) | RP push (supine/incline), RP.PL.V (hanging) | FEET_BENCH, FEET_WALL, FEET_RAISERS, FEET_FLOOR, FEET_AIR, HANG_BEHIND, HANG_FRONT, HANG_KNEES, HANG_LSIT |
| `F.ROM` | Range of motion | RP.HD.BS, RP.KD, RP.PU.H, AP.JMP, AP.TEX | ELEVATED, FLOOR, DEFICIT, RDL, BOX, PINS, FULL, HEIGHT |
| `F.END` | End-range behaviour | RP.HD.BS, RP.KD.BS, AP.JMP | DEAD_STOP, TOUCH_GO, RDL, STICK, BOUNCE |
| `F.DETAIL` | One-detail variation between blocks (v1.1) | every library exercise (RP, CO, FN, AP jumps and throws) | LOAD_HAND, GRIP, STANCE, IMPLEMENT, RANGE |
| `F.ACCOM` | Variable resistance (bands, chains, weight releasers) - DORMANT | RP.KD.BS, RP.HD.BS, AP.JMP | BANDS, REV_BANDS, CHAINS, RELEASERS |
| `F.PERTURB` | Plane perturbation | RP.KD.BS, FN | HIP_BAND (DORMANT, EQ-01), ADDUCT (the only active value), STRAP (REMOVED, LIB-09) |
| `F.ZONE_SENSES` | The word 'ZONE' (meanings resolved by COACH-ANSWER CAT-10 / CAT-11) | labels | ZONE_LEVEL, ZONE_PLYO (not a zone: points to F.PMETHOD, CAT-11), ZONE_DAVIDSON, ZONE_BAND, ZONE_ENERGY |
| `F.CHOPDIR` | Chop direction (anterior oblique) | FN.AOS.CHOP | DOWN, MID, UP |
| `F.FNPOS` | Developmental position | FN, CO | SUPINE, KNEEL, HALF_KNEEL, SPLIT_STAND |
| `F.CARRY` | Carry mode x loading | FN.CARRY | PROPULSIVE, STATIONARY, BILATERAL, UNILATERAL |
| `F.ABAND` | Aerobic colour band | CA | A, B, C, LC |
| `F.PACE` | Pace | CA | EASY, MODERATE, FAST, FASTEST, SPRINT |
| `F.CFORMAT` | Cardio library format | CA (library items) | SPEED_INTERVALS, DISTANCE_INTERVALS, DISTANCE_TEST, SPEED_TEST, DISTANCE, CALORIES |
| `F.EZONE` | Athletic energy zone (bout duration) | AP, CA.BUY | SE, SP, SSP |
| `F.VOL` | Resistance volume zone | RP | VOL1, VOL2, VOL3 |
| `F.ROLE` | Slot role inside a session | programs | PRIMER, ATHLETIC_BLOCK, MAIN, SECONDARY, UNILATERAL, ISOLATION, CORE_BLOCK, OPTIONAL_OLY, FINISHER, OPTIONAL_DAY, SPECIALISE |
| `F.DAYINTENT` | Day / lift intent tag | programs | SPEED, STRENGTH |
| `F.SEASON` | Season phase | programs (athletes) | OFF SEASON, SOFT SEASON, SOFT OFF SEASON, PRE SEASON, IN SEASON, PLAYOFFS, POST SEASON, FALL BALL, PITCHERS/CATCHERS, POSITIONS, PEAK, DELOAD, OFF |
| `F.WEEKTYPE` | Week type | programs | A WEEK, B WEEK, BWEEK, A WEEK LOWER, MID DELOAD, DELOAD WEEK, DELOAD, TEST |
| `F.DOSE` | Dose vocabulary (pointer) | every slot | SETS, REPS, EFFORT, FEELING, LOAD_WORDS |


### 2.1 The axes that carry most of his thinking

**Laterality has two parts: stance and load.** (`F.LAT`, `F.LOADLAT`.) Library row 5 gives the stance laterality: `'BILATERAL SYMMETRICAL'` for the upper body, `'BILATERAL'` for lower body and shoulders, `'UNILATERAL'`. The RESISTANCE PATTERNS tab adds a second, independent axis: **which hand holds the load relative to the working leg**.
- `'GET INTO THE HIP VARIATIONS - MODERATE'` = `'Contralateral loading '`
- `'GET OUT OF THE HIP - MODERATE'` = `'Ipsilateral loading '`
- the `'- HARDER'` versions are front-racked (C19:C26)
- `'Split stance ALWAYS contralateral'` is a rule for single-arm rows (G83)

The ballistics tab uses the same language for throws: `'INTO THE LEFT LEG/HIP'`, `'OUT OF THE RIGHT LEG/HIP'` (D65:D68). One more stance case: staggered stance with both hands loaded is filed `'BILATERAL LOADING'` *under* `'UNILATERAL SAGITAL'` (C60:C61). So "unilateral" alone is not enough information.

**What the coach means (COACH-ANSWER CAT-13).** A contralateral load *pulls you into the hip*: on the way down it helps you coil into the stance hip, and then you have to create force away from it. With an ipsilateral load, getting into the hip is harder because you balance the opposite side, and the load *helps pull you out of the hip*. INFERRED joint mechanics, consistent with his words: contralateral load draws the pelvis toward the stance femur (adduction and internal rotation, controlled by the stance-side abductors and external rotators); ipsilateral load biases it away (SCI-7, SCI-17, SCI-18).

**When he uses each (COACH-ANSWER CAT-13).**
- *Change-of-direction athletes* (football players running routes, soccer, basketball, tennis): contralateral and ipsilateral work so they get in and out of the hip quickly and build ranges they lack.
- *Sprinters / acceleration*: ipsilateral step-ups, to drive out of the hip and create force forward ("internal rotation on the leg, but external rotation on the hip").
- *Bodybuilders and powerlifters*: a health accessory that restores the rotation that bilateral symmetrical lifting loses; more of it in the first 2-4 weeks, then the program turns bilateral-symmetrical dominant; kept later only if something bothers them, including while peaking.
- There is no global default between the two (the v0 'contralateral is the default' assumption is retired). The bilateral:unilateral share itself (90/10 ↔ 10/90 by athlete and phase, UNI-02 / UNI-03) is a program dial, not a facet.

**Plane: the plane the body moves in vs. the plane the athlete must resist.** (`F.PLANE`.) Three pieces of OBSERVED evidence show that his "plane" is mostly the second one:
- `'BILATERAL FRONTAL'` holds ordinary squats with a sideways force added: `'Hip banded tube bands'`, `'Left or Right hip banded out '`, `'Hold between knees Squats'` (A46:A49). v1: the band versions are DORMANT (EQ-01); the held-object squat joins the main library (LIB-20).
- `'BILATERAL TRANSVERSE'` holds squats with a rotating strap (A53:A55). v1: removed (COACH-ANSWER LIB-09: 'you can take that one away').
- A contralateral split-stance KB swing is `'UNLATERAL TRANSVERSE'` (C76:C77).

The lunge tab states the rule outright (A17:A19). For core, the plane *is* the level in the sheets: `'CORE THORAX SAGITAL'` = `'EASY'`, `'... FRONTAL'` = `'MODERATE'`, `'... TRANSVERSE'` = `'HARD'` (O3:Q5; Sheet23 N1:S1). v1 keeps that as the default order only, since levels are theoretical (CAT-05); the core rule itself is which segment moves (CAT-08). The generator should store `plane_motion` and `plane_demand` separately (SCI-8 is the closest external model: force-vector training).

**Level: the exercise's tier vs. the person's level.** (`F.LEVEL` vs `F.CLIENT`.) **The coach's definition (COACH-ANSWER CAT-04):** level is mostly skill and stability demand, plus *where the load sits*. A goblet squat or a front-loaded zercher is foundational ('people need to learn how to be more upright'); load on the body (barbell front squat) is intermediate; load behind the body (barbell back squat) is advanced. In round 1 he described this through Pat Davidson's zones (`F.DZONE`: zone 1 close to the body, arms low; zone 2 horizontal, 'very high-pressure ... but it's safer for you when you push and pull'; overhead / vertical 'more advanced'). Round 2 settles it (COACH-R2 R2-LIB-02): the zone is a tag on the exercise, and the level comes from load position, skill and stability - a deep goblet squat stays foundational, and a seated DB shoulder press or a lat pulldown is foundational even though overhead. Machines and cables make any of it easier 'because the machine or the cable is doing the work for you'. He adds that levels are still very theoretical (CAT-05): levels add options and never take any away, so the generator treats level as a soft default, never a gate. Client level and exercise level are separate (CAT-06). In the library, the level is a block label inside one bucket (`'FOUNDATIONAL'` at row 8, `'MODERATE'` at row 44, `'ADVANCED'` at row 89; the zone codes say `'INTERMEDIATE'`/`'INTERMIDIATE'`; `'EASY'`/`'HARD'`/`'ANY'` also appear). In the example programs, the level is the person: `'NOVICE'`/`'NEWBY'`/`'INTERMEDIATE'` (UL/PPL), `'STARTING'`/`' MID'`/`' ADVANCED OFF SEASON WORKOUTS'`, `'BEGGINER'`/`' INTERMEDIATE'`/`' ADVANCED WORKOUTS'`, CrossFit `'LVL 1'`…`'LVL 5'`. All of them use a green/yellow/red traffic light. The exception is UL/PPL, where the third tier `'INTERMEDIATE'` is orange F6B26B, not red. v1: the generator calls the client levels Level 1 / 2 / 3; NOVICE and NEWBY are the same kind of client (COACH-ANSWER PRG-05). OBSERVED proof that the two are independent (confirmed: COACH-ANSWER CAT-06):
- the UL levels change only the dose, and the PPL levels almost only the dose. PPL has one swap: NOVICE gets `'Cable Lat pulldown'` (C28), NEWBY and INTERMEDIATE get `'Pull ups or Cable Lat pull down'` (G28/K28);
- NOVICE is given 'Sqats or Leg Press' and 'Deadlifts (DB or Barbell)', although the library files leg press and barbell deadlifts ADVANCED and DB deadlifts MODERATE;
- JUSTICE LEAGUE pairs a FOUNDATIONAL `'Medium Depth Drop'` with an ADVANCED `'Power Clean'` on the same day.

Gym levels *add* volume as the client advances: 76 → 90 → 102 weekly sets. That is the UL split recomputed from the SETS cells, assuming the A and B days each run twice a week (4 days is INFERRED; the tab names only 'ADAY'/'BDAY'). The PPL split with each day once gives 47 → 58 → 66. Both counts leave out the 1 × '5 Minutes' cardio warm-up, the A March/Skip/Run drills and the PPL 'KB Book openers ' set.

Reps do not move in one direction, and they differ lift by lift:

| Template | Lift (cells) | NOVICE → NEWBY → INTERMEDIATE (sets × reps) |
|---|---|---|
| UL lower | squats / leg press, deadlifts (rows 17-18) | 2 × 12 → 3 × 10 → 4 × 8 |
| UL upper | bench, pull-ups / pulldown, OH press (rows 29-31) | 3 × 8 → 3 × 10 → 4 × 12 |
| UL | DB rows (row 28) | 3 × 12/12 at every level |
| PPL push | incline DB bench, barbell bench (rows 16, 18) | 3 × 15 → 4 or 3 × 10 → 4 × 8 |
| PPL pull | DB rows (row 26) | 3 × '15/15' → 4 × 10/10 → 4 × 8/8 |
| PPL pull | lat pulldown / pull-ups (row 28) | 3 × 15 → 4 × 10 → 5 × 12 |
| PPL legs | squats / leg press, deadlifts (rows 40-41) | 2 × 8 → 3 × 10 → 4 × 8 |
| PPL | dips (row 19) | 3 × 8 → 3 × 10 → 4 × 'MAX' |
| PPL | side raises, reverse flies, upright rows (rows 17, 27, 29) | 3 × 15 → 4 × 8 or 3 × 10 → 4 × 8 |

Isolation that stays put: curls, triceps, leg extensions and leg curls are 20 at every level, and calves are 'MAX REPS'.

v1: these are OBSERVED sheet doses, not rules. The coach calls the UL upper-day rise (3 × 8 → 3 × 10 → 4 × 12) 'probably a fill error' and wants one sound progression rule for reps, sets and volume across every athlete, level and model (COACH-ANSWER PRG-06); the dose rules live in `03_volume_dosing.md` and `12_volume_algorithm_v1.md`.

Athletic levels *cut* non-throw volume and raise intensity, but they *raise* medball throw volume. The sibling count gives 89 → 72 → 59 sets per week; it splits superset components and excludes medball throws and conditioning. Summing the printed SETS cells and leaving out the throws (the 'ALL LIST' rows A24/H20/H38 and the 20 itemised 2 × 10 throw rows in MID, D25:D34 and D52:D61) and the Tabata row gives 61 → 51 (+2-4) → 44, over 3 → 4 → 4 sessions. Counting every numeric SETS cell, throws included, gives 62 → 91 (+2-4) → 46, so MID is the biggest week. Medball throws per week rise 210 → 400 → 420 (sibling count, reproduced here: one 'ALL LIST' pass of the 19-throw cheat sheet = 210 throws). Only the non-throw sets fall with level.

**Level driver per bucket.** (Tree column "level driver".) v1 gives one common definition (CAT-04 above); inside each bucket the sheets still show what "harder" means:
- triple extension: technical complexity and start position (pull → power catch → squat catch; high → mid → low hang → floor); everyone in athletic training gets Olympic lifts, beginners through DB/KB snatches and cleans, hex-bar jumps and hang pulls (COACH-ANSWER ATH-10); push press easier than push jerk (LIB-13)
- jumps: height, base of support (unilateral harder, CAT-10), load and contact type; the plyo execution method is a separate axis (CAT-11)
- COD: turn angle (`'EASY TURN'`/`'MOD. TURN'`/`'HARD TURN'`), for every athlete (ATH-06)
- throws and GHD: no levels (COACH-ANSWER LIB-06, LIB-08)
- upper-body resistance: removing external support (machine/assisted → bodyweight → weighted; seated → floor Z press → kneeling → standing → inverted) (v1.1: not the arm's Davidson zone - the zone is a tag, COACH-R2 R2-LIB-02)
- lower-body bilateral resistance: load position in front → on the body → behind / overhead (CAT-04), then box methods; machines are easier, not harder (CAT-04), whatever block BYOP files them in
- unilateral and isolation lists: no tiers at all; difficulty comes from stance × load position × load laterality; leg extensions and leg curls at every level (LIB-15)
- core: plane as the default order (levels are theoretical, CAT-05)
- functional chops: direction (down/midline/up) and developmental position

**Intent and force phase.** These are the athletic axes the sport dial needs (`F.INTENT`, `F.PHASE`, `F.PMETHOD`, `F.SSC`). The ballistics tab gives two purposes:
- `'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST'` / `'*I USE THESE FOR MUSCULAR FORCE PRODUCTION'`
- `'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'` / `'*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'`

It also gives four force phases: `'TAKING IN FORCES'` → `'DELIVER FORCES FAST'` → `'AMORTIZATION OF FORCES'` → `'REBOUNDING '`. Sheet23 adds three steps it labels `'ZONE 1/2/3'` (`'Receive pause/creat'`, `'Receive/create'`, `'Repeat receive create'`) and an SSC speed order (`'*FASTEST SSC*'` → `'*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)'` → `'*SPRINT*'`). v1 stored none of these on library items (gap G7); v1.1 stores the R2-ATH-02 class and the R2-ATH-03 stage on every jump in the catalog.

v1 (COACH-ANSWER CAT-10, CAT-11, ATH-01):
- The three Sheet23 steps are **not zones**. They are the way he wants plyos done: first receive and pause (the body and connective tissue learn to receive force before creating it; stick-the-landing drills), then receive and create once, then repeatedly receive and create (hops, repeat jumps). The 'create only' step in between (jump onto a box, `'DELIVER FORCES FAST'`) he does not dwell on, since every exercise creates force. He named it in round 2: **Receive-Create stages** (`F.PMETHOD`; 1 Land, 2 Land & Go, 3 Repeat; 12-week block weeks 1-3 / 4-7 / 8-12, 8-week 1-2 / 3-5 / 6-8; restart each off-season; COACH-R2 R2-ATH-03).
- **Ballistic vs plyometric is ground-contact time**: 'The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement.' The sport's own ground-contact time sets the ratio: karate and fighters more ballistics, sprinters more plyos, basketball a mix, baseball ballistics + rotational throws + sprinting with few plyos. Both ends always stay in. Programs start more ballistic and become more plyometric (CAT-10). Science agrees with the cut: fast SSC < ~250 ms contacts vs slow SSC (SCI-11).
- Unilateral plyos are harder than bilateral ones. Davidson zones do not apply to plyos.

v1.1 (COACH-R2 R2-ATH-01 / R2-ATH-02 / R2-ATH-03):
- The plyo : ballistic shares by sport are approved (in `04_profiles.json`).
- Per exercise: ballistic = longer contact or one big effort (squat, box, broad, loaded or hex-bar jumps, medball throws); plyometric = short, bouncy contacts (pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps); stick-the-landing drills = the receive stage. The catalog tags every jump and throw (`contact_class_v1_1`).
- The receive -> create progression is named **Receive-Create stages** (1 Land, 2 Land & Go, 3 Repeat), timed per block (12 weeks: 1-3 / 4-7 / 8-12; 8 weeks: 1-2 / 3-5 / 6-8), restarted each off-season, held in maintenance blocks; intermediate / advanced athletes may start at stage 2.
- Older adults (60+): no Olympic lifts, plyos or depth jumps by default - an opt-in with the warning 'Make sure that you have a fitness professional to help you understand what this means.' (R2-ATH-08).

**Loading variables.** Implement, load position, stance, grip, body position, ROM, end range, accommodating resistance, perturbation and constraint. They are listed as headed blocks in RESISTANCE PATTERNS:
- `'FEET POSITIONING VARIATIONS'`, `'HAND PLACEMENT'`, `'FEET POSITION'`, `'STANCES'`
- `'ROM VARIABLE'` (`'Elevated'`/`'Floor'`/`'Deficit'`/`'*RDL'`)
- `'END RANGE BEHAVIOR VARIABLE'` (`'Dead stop'`/`'Touch & go'`/`'*RDL'`)
- `'LOADING VARIABLES'` (`'WEIGHT RELEASERS'`/`'CHAINS'`/`'BANDS'`) - DORMANT in v1

The squat tab adds the 8-step load-position ladder (`'EASIEST'` hex bar … `'VERY HARD '` overhead), which v1 groups into the coach's three level bands (in front → on the body → behind / overhead, CAT-04), and the band/chain diagnosis (`'BOTTOM BANDED'` for `'SOMEBODY THAT CAN'T YIELD DOWN INTO A SQUAT'`, `'REVERSE BANDED'` for `'SOMEBODY THAT IS SLOW ON THE WAY UP'`, `'BOTTOM CHAINS'` for `'SOMEBODY NEEDING TO STAY STIFF'`). **v1: no variable resistance for now** (COACH-ANSWER EQ-01: 'I don't do bands ... I don't really want to talk about variable resistance in any of this right now because it's so complicated'; EQ-12: 'No variable resistance should be available in this for now. We will work with that later on.'). `F.ACCOM` is kept only as a DORMANT archive so it can be switched on later. His wildcard `'Box *ANY Squat …'` shows he already thinks in *base + variables*.

**Constraint / equipment.** CHAT-relayed: *"Machines have a lot of reference points / constraints … you can push a lot, and it's safer"*; *"Barbells are more skilled"*; *"For people who want to go up in volume, people who have injuries, or people who are older, more machines are usually better"*; *"If you read the workouts you can understand them by their equipment usage."* There is no equipment column in any sheet, so `F.IMPL` was INFERRED from names. v1: the coach approved the 1-5 constraint scale (COACH-ANSWER EQ-13: 5 seated machine with back pad, 4 plate-loaded / Smith / chest-supported, 3 cable or DB on a bench, 2 standing free weights, 1 bodyweight, ballistic, reactive). He does not rank machines (EQ-11): hack squat and leg press are more constrained than the Smith machine, the belt squat avoids axial loading, GHD and reverse hyper only if available and felt in the right muscles. Older, injured or high-volume clients collect volume in constrained machines and never get the overhead squat, snatch, low-bar squat or depth jumps (EQ-03; v1.1: for older adults the snatch, all Olympic lifts, plyos and depth jumps become an opt-in with a warning, R2-ATH-08); safety beats the level label (EQ-04). New facet `F.AXIAL` lets the generator load the spine heavily only once a week (squat; deadlifts also count) and use leg press or belt squat for the second exposure (PER-04); v1.1 (COACH-R2 R2-SES-01 / R2-SES-02): heavy squat and heavy deadlift on two different days, with the coach's counted list (`F.SPINEDAY`).

**The meanings of `'ZONE'`, resolved** (`F.ZONE_SENSES`; COACH-ANSWER CAT-04, CAT-10, CAT-11):
1. the level row (BYOP A3). INFERRED v1: he calls it 'ZONE' because level is partly Davidson position for him (v1.1: R2-LIB-02 separates them - the zone is a tag, not the level).
2. **Davidson position zones** (`F.DZONE`), from Pat Davidson's book *A Coach's Guide to Optimizing Movement*: the cable curl `'Zone1, Zone 2, Zone 3'` (AS12) and the Sheet23 tricep items. In the coach's words the zones are rotation biases. *Vertical* positions - hands down / standing (zone 1), hands overhead or a deep squat (zone 3; the deep squat's zone number is INFERRED, the coach only groups it with the vertical positions) - carry an **external-rotation bias**. *Horizontal* positions - hands in front of you, or the knee at hip height halfway through a squat (zone 2) - carry an **internal-rotation bias and are more compressive**. v1.1 (COACH-R2 R2-LIB-02): zones are tags, not levels - the level comes from load position, skill and stability; seats, machines and cables lower it. They do not apply to plyos. Use (R2-LIB-03): keep both rotation biases every week and pick a swap with the other bias when something hurts; not by sport.
3. the Sheet23 plyo `'ZONE 1/2/3'` (C34:D36): **not a zone** (CAT-11) - the plyo execution method (`F.PMETHOD`).
4. the green/yellow/red band in Sheet23 column A (rows 2-28): INFERRED v1 - most likely the same Davidson zones used as a level band (green = zone 1); not needed by the generator (v1.1: levels are not set from zones, R2-LIB-02).
5. the energy zones (BASEBALL `'SPEED ENDURANCE'`/`'SPEED POWER'`/`'SPEED STRENGTH & POWER'`; aerobic `'A'`/`'B'`/`'C'`).

### 2.2 Every facet, every value, every verbatim label

#### F.LEVEL - Exercise tier (level of the exercise inside its bucket)

*Applies to:* every AP/RP/CO/FN record. *Question it answers:* How demanding is this exercise relative to its siblings: skill, stability, load position, constraint (the Davidson zone is a tag, COACH-R2 R2-LIB-02)? *Evidence:* OBSERVED (labels) + COACH-ANSWER CAT-04, CAT-05, CAT-06.

> v1 (COACH-ANSWER CAT-04): level = skill + stability demand + load position - in front of you / low = foundational, on the body = intermediate, behind the body or overhead = advanced ; seats, machines and cables lower it because they do the stabilising. v1.1 (COACH-R2 R2-LIB-02): the Davidson zone (F.DZONE) is only a tag - it does not set the level (the v1 'read through the zones' wording is retired). COACH-ANSWER CAT-05: levels add options and never remove them, and they are still theoretical - the generator uses them as a soft default, never as a gate. CAT-06: exercise level and client level (F.CLIENT) are separate. Throws and GHD have no level (LIB-06, LIB-08); leg extensions and leg curls are available at every level (LIB-15). BYOP block labels stay OBSERVED; where they disagree with the coach's rule (back squats AI49:AI50 filed MODERATE; leg press AI98 / pendulum AI99 ADVANCED; hip thrust machine AN51 MODERATE), the generator follows the rule. Moving up (COACH-ANSWER PER-06, RIGHT): a client moves up a level in a slot at the end of a block when the exercise felt like '8 - That was perfect' or easier, with no pain.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `L1` | Foundational | 'FOUNDATIONAL' (block rows 8, e.g. AI8); 'FOUNDATIONAL  ' (AA8, 2 trailing spaces); 'FOUNDATINONAL' (Sheet23 E1/F1); 'EASY' (row 3 C3/G3/O3/R3/X3; C124); 'EASY  ' (L3); green 93C47D / B6D7A8 (RESISTANCE PATTERNS cells; EXAMPLE ATHLETIC 'STARTING' header; AEROBIC 'BEGGINER' header) | OBSERVED | entry tier: load in front / low, or a supported / seated / machine / cable version (CAT-04, COACH-R2 R2-LIB-02) |
| `L2` | Intermediate | 'MODERATE' (block rows 44; row 3 D3/H3/I3/M3/P3/S3); 'INTERMEDIATE' (Sheet23 C1/G1/H1/L1/O1/R1; AE3); 'INTERMIDIATE' (AJ3/AO3; Sheet23 AD1/AG1); yellow FFE599 / FFF2CC / FFD966 | OBSERVED | middle tier: load on the body; often KEEPS the foundational options and adds harder ones (triple extension) |
| `L3` | Advanced | 'ADVANCED' (block rows 89/124; row 3 E3/J3/N3/T3/V3/Y3); 'HARD' (Q3); red E06666 / F4CCCC | OBSERVED | top tier: load behind the body or overhead (unsupported), most skill and stability; usually REPLACES the list in BYOP |
| `L0` | Any / unlevelled | 'ANY' (W3/Z3); 'UNILATERAL' / 'UNILATERAL  ' (block labels U89/X89/AA89/AD124); 'AP - THROWING' (K3); 'RP -SHOULDERS' / 'RP - BICEP' / 'RP - TRICEP' / 'RP - CALVES' (no level word); COACH-ANSWER LIB-06 throws: 'No levels in throws, just do them right'; COACH-ANSWER LIB-08 GHD: 'no levels on this'; COACH-ANSWER LIB-15: leg extensions and leg curls at every level | OBSERVED | no difficulty ladder in the sheet; difficulty comes from facets (load position, stance...) |

#### F.CLIENT - Client level (Level 1 / 2 / 3 - dose tier of a whole program)

*Applies to:* programs / client profile. *Question it answers:* How trained is the person? (changes DOSE and almost never the exercise list in the MM gym templates: UL lists identical across levels; PPL swaps NOVICE 'Cable Lat pulldown' C28 for 'Pull ups or Cable Lat pull down' G28/K28) *Evidence:* OBSERVED + COACH-ANSWER CAT-06, PRG-05.

> v1 (COACH-ANSWER PRG-05): the generator says Level 1 / Level 2 / Level 3 and explains them. 'NOVICE' and 'NEWBY' name the same kind of client for the coach (the v0 'NOVICE below NEWBY' question is closed): under ~6-12 months of training, or more than 6-12 months off (the body is treated as a beginner; skills come back fast). Intermediate = consistently training for over a year. Ex-pros start at Level 1 only briefly. Intake asks training experience in years (GEN-02). Client level is separate from exercise level (CAT-06) and never locks exercises (CAT-05). OBSERVED dose behaviour unchanged: gym levels ADD volume (UL 76 -> 90 -> 102 weekly sets, A/B days x2; PPL 47 -> 58 -> 66); athletic levels CUT non-throw sets (printed 61 -> 51 (+2..4) -> 44; sibling convention 89 -> 72 -> 59) while medball throws rise 210 -> 400 -> 420. COACH-ANSWER PRG-04 (PARTLY): the MM 'STARTING / MID / ADVANCED OFF SEASON' columns can be read as three athlete levels or as three back-to-back off-season blocks - 'Depends on whatever is needed'; the C1-C3 mapping is one reading, not the only one. COACH-ANSWER PRG-06 (PARTLY): the UL upper-day rep rise 8 -> 10 -> 12 is 'probably a fill error or just a different program'; the generator must not copy it and uses one sound rep / set / volume progression rule for every athlete and level.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `C1` | Level 1 (entry) | 'NOVICE' (UL/PPL, green 93C47D); 'STARTING OFF SEASON WORKOUTS' (MM ATHLETIC A9, green); 'BEGGINER WORKOUTS' (AEROBIC A8, green); 'LVL 1' (CrossFit); COACH-ANSWER PRG-05: novice / newbie = under about 6-12 months of training, or back after > 6-12 months off | OBSERVED | lowest volume, simplest dose |
| `C2` | Level 2 (developing) | 'NEWBY' (UL/PPL, yellow FFD966); ' MID OFF SEASON WORKOUTS' (D9, yellow); ' INTERMEDIATE WORKOUTS' (AEROBIC D8, yellow); 'LVL 2'; PROPOSED - PENDING COACH APPROVAL: about 6-12 months to 1 year of consistent training | OBSERVED | more sets / density |
| `C3` | Level 3 (trained) | 'INTERMEDIATE' (UL/PPL, orange F6B26B); ' ADVANCED OFF SEASON WORKOUTS' (H9, red E06666); ' ADVANCED WORKOUTS' (AEROBIC G8, red); 'LVL 3' / 'LVL 4'; '**MYO SET - ADVANCED' (ALL ABOUT SQUATS C27; INFERRED as a client tier - it may only mark an advanced technique); COACH-ANSWER PRG-05: 'somebody that has consistently gone to the gym for over a year' | OBSERVED | athletic: fewer non-throw sets and exercises, heavier/faster (e.g. 'DEADLIFTS (1RIR)' 3 x 1, 'Power Cleans' 3 x 3), but MORE medball throws (210 -> 400 -> 420 per week); gym: more sets, reps move lift by lift - UL lower 12 -> 10 -> 8, UL upper (bench / pulldown / OH press) 8 -> 10 -> 12, PPL push presses and DB rows 15 -> 10 -> 8, PPL legs (squat/leg press, deadlift) 8 -> 10 -> 8, PPL pulldown 15 -> 10 -> 12, PPL dips 8 -> 10 -> MAX; PPL delt isolations also fall (side raises 3x15 -> 4x8 -> 4x8; reverse flies, upright rows 3x15 -> 3x10 -> 4x8); curls, triceps, leg extensions, leg curls stay at 20 and calves at MAX REPS |
| `C4` | Test/peak | 'LVL 5 = Work up to 1RM' (CrossFit HALF TIME) | OBSERVED | test. v1.1 (COACH-R2 R2-PER-07): tests run before the block (or in week 1) and at its end, never mid-block; 'work up to a 1RM' only after a completed block - an untrained person tests a 5RM or 3RM and runs timed tests at an 80-90 % effort, never all-out from zero |

#### F.REGION - Body region

*Applies to:* RP (and AP where relevant). *Question it answers:* Which half of the body carries the pattern? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `LOWER` | Lower body | 'LOWER BODY MECHANICS' (RESISTANCE PATTERNS A5); 'LB' (CrossFit RESISTANCE); 'LOWER ballistics/plyo' (BASEBALL); 'LOWER BODY WORKOUT' / 'LEG DAY WORKOUT' / 'LEGS' (MM); 'LOWER ACCESORY' (HYBRID) | OBSERVED | - |
| `UPPER` | Upper body | 'UPPER BODY MECHANICS' (E5); 'UB'; 'Upper Ballistics/plyo'; 'UPPER BODY WORKOUT'; 'UPPER ACCESORY' | OBSERVED | - |
| `TRUNK` | Trunk | 'CORE'; 'CONTROL' | OBSERVED | - |
| `WHOLE` | Whole body / integrated | 'FB ' (HYBRID B101); 'FULL BODY' (BYOP titles); 'FUNCTIONAL' | OBSERVED | - |

#### F.DOM - Joint dominance (lower) / direction x vector (upper)

*Applies to:* RP, AP.JMP. *Question it answers:* Which joint or line of force leads the pattern? *Evidence:* OBSERVED.

> CHAT-relayed (analysis/equipment/reference_variables.json): 'I usually do rowing (horizontal pull) before an overhead (vertical) pull, horizontal push before vertical push.'

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `KNEE` | Knee dominant | 'KNEE DOMINANT'; 'KD'; 'KNEE DOM' | OBSERVED | quads-led |
| `HIP` | Hip dominant | 'HIP DOMINANT'; 'HIP DOMNANT' (AN1); 'HD'; 'HIP DOM' | OBSERVED | glute/hamstring-led |
| `ANKLE` | Ankle / limited knee | 'JUMPING LIMITED KNEE'; 'JUMPING ANKLE' | OBSERVED | calf/tendon stiffness-led |
| `KNEE_FLEX` | Knee flexion (leg flexion) | 'LEG FLEXION' (Sheet25 H11); 'LEG CURLS' (BYOP AR1); COACH-ANSWER CAT-09 | OBSERVED + COACH-ANSWER CAT-09 | hamstring-led knee flexion; RP.LF; not hip dominant |
| `PUSH_V` | Vertical push | 'VERTICAL PUSH'; 'vert push'; 'OH PUSH' | OBSERVED | - |
| `PUSH_M` | Mid-range push | 'MID RANGE PUSH'; 'Incline' | OBSERVED (MM only) | - |
| `PUSH_H` | Horizontal push | 'HORIZONTAL PUSH'; 'horiz push' | OBSERVED | - |
| `PULL_V` | Vertical pull | 'VERTICAL PULL'; 'vert pull' | OBSERVED | - |
| `PULL_H` | Horizontal pull | 'HORIZONTAL PULL'; 'horiz pull'; 'HOR PULL'; 'HOR ROW' | OBSERVED | - |

#### F.LAT - Laterality of the stance / limbs

*Applies to:* RP, AP, CO. *Question it answers:* Do both limbs do the same thing? *Evidence:* OBSERVED.

> Program slots for the LOWER body split BS and UL into separate slots; for the UPPER body the UL lane sits inside the same dropdown (U89/X89/AA89/AD124). v1: alternating counts like unilateral (COACH-ANSWER UNI-07); a 10/10 set = 1 set (UNI-01). The bilateral:unilateral share (90/10 <-> 10/90) is a program / profile dial, not a facet value: unilateral = health and rotational foundation, bilateral = the driving force (UNI-02, UNI-03; see 04/11). Bodybuilders and powerlifters start near 50/50 and move to about 80/20-90/10 bilateral; field and change-of-direction athletes (e.g. tennis) keep about 80-90 % unilateral; the upper body follows the same logic; pain or injury adjusts the share; the exact numbers are adjustable (UNI-02, UNI-03). For athletes the unilateral share rises toward the season and bilateral work stays minimal in-season (UNI-10). Same-pattern pairing (squat + lunge) drives one muscle harder for high-level and aesthetics clients; cross-pattern pairing (squat + single-leg RDL) keeps bootcamp clients less sore (UNI-06).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `BS` | Bilateral symmetrical | 'BILATERAL SYMMETRICAL' (U5:AF5); 'BILATERAL' (AH5, AI5, AM5, AN5; RESISTANCE PATTERNS headers); 'BS' (zone codes); 'BILATERAL SYMETRICAL' (BALLISTICS) | OBSERVED | both limbs, same action |
| `UL` | Unilateral | 'UNILATERAL' (W5, Z5, AC5, AG5, AL5, AQ5, AR5); 'UL' (zone codes); 'UNI' (HYBRID); 'SL' / 'Single leg' / 'Single arm' (names); 'UNLATERAL' (RESISTANCE PATTERNS C53/C76 typo); 'UNILARTERAL' (BA14 typo) | OBSERVED | one limb works |
| `ALT` | Alternating | 'Alternating' (names); 'sesaw' / 'Sesaw' (names); 'One up/one down' (RESISTANCE PATTERNS I30); 'Alternating DB Deadlifts' / 'Alternating  Barbell Deadlifts' (AQ13/AQ15) = alternating staggered-stance single-leg deadlifts (COACH-ANSWER LIB-09) | OBSERVED in names | limbs take turns |
| `STAG` | Staggered / split stance with bilateral load | 'BILATERAL LOADING' (RESISTANCE PATTERNS C61, under UNILATERAL SAGITAL); 'Staggered Stance DL w/ DB ' (AQ12) | OBSERVED | stance biased to one leg, both hands loaded |
| `OFFSET` | Offset / asymmetric | 'one hand higher' (RESISTANCE PATTERNS I33); 'offset planks' (CONTROL PATTERNSCORE E11); 'Supine offset plank' (BC91) | OBSERVED in names | asymmetric base or load |

#### F.LOADLAT - Load laterality ('into' / 'out of' the hip)

*Applies to:* RP.KD.UL, RP.HD.UL, RP.PL.H.UL, AP.THR, FN. *Question it answers:* Which hand holds the load relative to the working (front/stance) leg? *Evidence:* OBSERVED labels + COACH-ANSWER CAT-13 (meaning and use); INFERRED joint mechanics.

> Use cases (COACH-ANSWER CAT-13): (1) change-of-direction athletes - football players running routes, soccer, basketball, tennis - use contralateral and ipsilateral loading to get in and out of the hip quickly and to build ranges they lack; (2) sprinters / acceleration: ipsilateral step-ups to drive out of the hip; (3) bodybuilders and powerlifters: contra/ipsi work is a health accessory that restores the rotation bilateral symmetrical lifting loses - more of it in the first 2-4 weeks, then the program turns bilateral-symmetrical dominant; kept later only if something bothers them, including while peaking. There is no global default between contra and ipsi (the v0 'contralateral default' assumption is retired). Split-stance single-arm rows stay 'ALWAYS contralateral' (OBSERVED G83). Difficulty still grows with load HEIGHT: suitcase (ALL ABOUT LUNGES C22:C24, INFERRED link) -> front-racked '... - HARDER' (RESISTANCE PATTERNS C23:C26) -> barbell 'HIGH LOADING VARIATION' (C31:C36); 'LOW/MID LOADING VARIATION' = plate reach, goblet, double KB/DB (C27:C30).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `DOUBLE` | Bilateral / double load | 'Duble suitcase' (LUNGES C24); 'Double handed on shoulders' (C27); 'Double handed high zercher' (C30); 'Double kb or Db' (RESISTANCE PATTERNS C30) | OBSERVED | symmetric load |
| `CONTRA` | Contralateral = INTO the hip | 'GET INTO THE HIP VARIATIONS - MODERATE' (C19); 'Contralateral loading ' (C20, C72); 'GET INTO THE HIP VARIATIONS - HARDER' (C23); 'Front racked db or kb contralateral loading' (C24); 'Contralateral Suitcase' / 'on shoulder' / 'High zercher' (LUNGES C22/C25/C28); 'Split stance ALWAYS contralateral' (G83); 'INTO THE LEFT LEG/HIP' / 'INTO THE RIGHT LEG/HIP' (BALLISTICS D65/D68); 'TRANSVERSE INTO THE HIP' (D74:D75); 'CONTRA' (4 TRACKS lunges) | OBSERVED | COACH-ANSWER CAT-13: the load pulls you INTO the hip - on the way down it helps you coil into the stance hip, then you must create force away from it. INFERRED mechanics: the pelvis is drawn toward the stance femur (adduction / internal rotation), which the stance-side abductors and external rotators control. |
| `IPSI` | Ipsilateral = OUT OF the hip | 'GET OUT OF THE HIP - MODERATE' (C21); 'Ipsilateral loading ' (C22, C74); 'GET OUT OF THE HIP VARIATIONS - HARDER' (C25); 'Front racked db or kb Ipsilateral loading' (C26); 'Ipsilateral Suitcase' / 'on shoulder' / 'high zercher' (LUNGES); 'OUT OF THE RIGHT LEG/HIP' / 'OUT OF THE LEFT LEG/HIP' (D66/D67); 'UNILATERAL OUT OF HIP' (D76); 'IPSILATERAL' / 'IPSI' (programs) | OBSERVED | COACH-ANSWER CAT-13: getting into the hip is harder (you balance the opposite side), and the load helps pull you OUT of the hip to drive force forward - e.g. ipsilateral step-ups for sprint acceleration ('internal rotation on the leg, but external rotation on the hip'). |
| `SINGLE` | Single implement, unilateral action | 'Single arm' / 'SINGLE ARM' (JUSTICE LEAGUE H9) | OBSERVED | - |

#### F.PLANE - Plane

*Applies to:* every family. *Question it answers:* In which plane is the force the athlete must create or RESIST? *Evidence:* OBSERVED.

> For this coach the plane is the direction of the force to be managed, not only the direction the body travels: 'Stance loads the FRONT TO BACK', 'Load position loads UP/DOWN & SIDE2SIDE', 'Movement orientations/guidance loads AROUND' (ALL ABOUT LUNGES A17:A19); frontal squats = squat + lateral band (RESISTANCE PATTERNS A47:A49; the band versions are DORMANT, EQ-01). Core: plane == level (SAG easy -> FRO moderate -> TRA hard) as the sheets' default order only (levels are theoretical, CAT-05). v1 (COACH-ANSWER UNI-12, RIGHT): basketball, tennis, soccer and MMA athletes get more frontal / transverse unilateral work (lateral lunges, cossacks, lateral step-ups, rotational lunges); aesthetics clients get little.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SAG` | Sagittal | 'SAGITAL' (O5, R5; CONTROL PATTERNSCORE H4; BB8); 'Sagital core' (BASEBALL); 'BILATERAL SAGITAL' / 'UNILATERAL SAGITAL' (RESISTANCE PATTERNS); 'FOUNDATIONAL - CT - SAGITAL' (Sheet23 N1) | OBSERVED | front-to-back |
| `FRO` | Frontal | 'FRONTAL' (P5, S5; O4; BB10); 'LATERAL CORE' (BASEBALL); 'BILATERAL FRONTAL' / 'UNILATERAL FRONTAL' (A46/C46); 'Lateral' (LUNGES A23); 'FRONTAL PULL DOWN' (BALLISTICS D73) | OBSERVED | side-to-side / anti-lateral-flexion |
| `TRA` | Transverse | 'TRANSVERSE' (Q5, T5; A4); 'Transverse core' (BASEBALL); 'BILATERAL TRANSVERSE' / 'UNLATERAL TRANSVERSE' (A53/C53/C76); 'TRANSVERSE PULL DOWN' / 'TRANSVERSE CORE THORAX' (BALLISTICS); 'Rotational' (names) | OBSERVED | rotation / anti-rotation |
| `MULTI` | Multi-planar | zig-zag / right-angle hops (C130, C134, G96); COD routes | INFERRED | - |

#### F.CMODE - Core mode (static vs dynamic)

*Applies to:* CO, FN. *Question it answers:* Does the trunk produce motion or resist it? *Evidence:* OBSERVED in MM only (BYOP core columns carry no static/dynamic tag).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `DYN` | Dynamic | 'DYNAMIC' (CONTROL PATTERNSCORE B5/I5/P5) | OBSERVED | produces motion (crunch, twist, leg raise) |
| `STA` | Static | 'STATIC' (E5/L5/S5); 'hold' / 'plank' (names) | OBSERVED | resists motion (anti-extension / anti-lateral-flexion / anti-rotation) |

#### F.SIZE - Muscle size class

*Applies to:* RP (CO treated as small). *Question it answers:* Is the prime mover a 'bigger' or a 'smaller' muscle? *Evidence:* COACH-ANSWER CAT-02 (class membership) + OBSERVED (coach term SMALLER ISOLATIONS; structure).

> Unclassified by the coach (CAT-02 left them open): front delts, traps, adductors, neck - PROPOSED - PENDING COACH APPROVAL: front delts SMALL (dosed like the other delts, trained mostly by pressing), traps SMALL, adductors BIG, neck SMALL. v1: size class decides the organising lens and the default rep range; it no longer decides the weekly 3/5/7 % ramp, which follows the person's state (COACH-ANSWER VOL-05). v1.1: every plan is a stairway - small steps in the first weeks, slightly bigger after the halfway point, the hardest weeks last (COACH-R2 R2-PER-03 / R2-PER-04; 'start at a 2, end at an 11' is perceived effort, not set counts, R2-PER-05). No check-in = no change: the plan follows its planned stairway ('there is no data to go off of', R2-VOL-03). With a check-in the step comes from effort, completion and pain only: the coach rejected sleep / stress / life inputs (R2-GEN-04), so the approved R2-VOL-01 table is used without its 'life' columns (resolution flagged in the v1.1 adversarial check). The step rules live in `03_volume_dosing.md` / `12_volume_algorithm_v1.md`. v1.1 (COACH-R2 R2-VOL-04 / R2-VOL-06): nobody needs fewer than 10 weekly sets per muscle - small muscles grow by the same idea (8 is barely maintenance); most people train about 20-30 sets per muscle per week; the caps are approved but customizable, and more than 30 only for very advanced people (maybe an optional 'pro' level; the coach asked the team to research it). Flag: R2-VOL-04 also approved rear delts at 4 / 6 / 8 sets of their own - read as rear-delt work on top of the SHOULDERS/TRAPS group's sets, so the floor of 10 holds for the group (PROPOSED reconciliation, PENDING COACH; the volume files own it).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `BIG` | Bigger muscles | COACH-ANSWER CAT-02: quads, glutes, hamstrings, lats/upper back, chest; 'QUADS', 'QUADS/GLUTES', 'GLUTES/HAMSTRINGS', 'HAMSTRINGS', 'BACK', 'CHEST/FRONT DELTS' (row 6); 'COMPOUND' (BASEBALL B19); 'QUADS 👇','GLUTES 👇','HAMSTRINGS 👇','BACK 👇','CHEST 👇' (AZ) | COACH-ANSWER CAT-02 | organised by BIOMECHANICS: several pattern lanes per muscle (BS + UL + ISO), levelled; default reps 5-15, mixed (COACH-ANSWER VOL-11) |
| `SMALL` | Smaller muscles | COACH-ANSWER CAT-02: biceps, triceps, side and rear delts, calves, forearms, abs; 'SHOULDERS', 'BICEP', 'TRICEP', 'CALVES' (row 6); 'SMALLER ISOLATIONS' (BASEBALL C19); 'SHOULDERS/BICEP/TRICEP' (RESISTANCE PATTERNS K6); 'SHOULDERS/TRAPS 👇','TRICEP 👇','BICEP 👇','CALVES 👇','CORE 👇' (AZ) | COACH-ANSWER CAT-02 | organised by MUSCLE: one unlevelled isolation list each; default reps 12-30 (COACH-ANSWER VOL-11) |

#### F.XCLASS - Exercise class / dose class

*Applies to:* every record. *Question it answers:* How should this exercise be dosed? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `BIG_COMP` | Big-muscle compound | 'COMPOUND' (BASEBALL); 'the work' / 'the accessory' (4 TRACKS) | OBSERVED | coach default 5-15 reps, mixed (COACH-ANSWER VOL-11); the sheets go to 2-5 for strength and athletic work: hypertrophy 3-5 x 8-15 and strength 4-8 x 2-5 (ALL ABOUT SQUATS A15:F26), 4 TRACKS main lift 5 -> 2 reps at RPE 7 -> 10 (O4:Z6), athletic heavy lifts down to 3 x 1 (MM ATHLETIC H15:J15). VOL 1 '12-15' -> VOL 2 '8-12' -> VOL 3 '6-8' per block for athletes (PER-11). RIR is the primary effort scale, 1-3 RIR (VOL-13). Client preference ('lighter, more sets' vs 'heavier, fewer reps') moves only the compound rep range (VOL-12). Default 3 sets when blank (VOL-16). |
| `BIG_ISO` | Big-muscle isolation | 'LEG EXTENSIONS', 'LEG CURLS', 'Flies', 'Pull under' | OBSERVED | usually dosed like small muscles: 2 x '20 Reps' (AESTHETICS D9), 'MYO SET' (JUSTICE LEAGUE G12), 2-3 x 20 (UL/PPL rows 21-22 / 44-45), 4 x 15 -> 3 x 20 -> 2-3 x 40 (FAT BURN row 11). Exceptions: the 4 TRACKS 12-week strength block doses its isolations at '3x8' (dose in column N: N12/N20/N23; exercises in O:Z: 'LEG EXT' O12/O20, 'LEG CURLS' P12, 'CABLE FLIES' O23); BOXING weeks 1-2 give leg extensions / leg curls 3 x 10 and weeks 3-8 '6 & 6' (K14). The high-rep rule is goal-dependent. Counts fully toward its muscle (leg extension -> quads, leg curl -> hamstrings, COACH-ANSWER VOL-09). 40-rep sets (FAT BURN) are disliked: only a CrossFit / AMRAP style option (VOL-11). Default 2 sets when blank (VOL-16). |
| `SMALL_ISO` | Small-muscle isolation | 'SMALLER ISOLATIONS' (BASEBALL C19); 'the survival' (4 TRACKS) | OBSERVED | VOL 1 '10-12' -> VOL 2 '15 REPS' -> VOL 3 'MAX REPS' (inverse of compounds); 'ALL'/'MAX' effort. Not always high reps: '3x8' for side raises, curls and JM press in the 4 TRACKS strength block (N16/N24) against 'TATE PRESS' '3x20' (N15); PPL side raises 3 x 15 -> 4 x 8 -> 4 x 8 and reverse flies / upright rows 3 x 15 -> 3 x 10 -> 4 x 8 across NOVICE -> NEWBY -> INTERMEDIATE. Coach default 12-30 reps, 20s, MAX, myo sets (COACH-ANSWER VOL-11); MYO SET only on the last exercise, machines/isolation (VOL-15); no 40-rep sets except as a CrossFit / AMRAP option. |
| `SMALL_COMP` | Small-muscle compound | dips for triceps, upright rows, push press (programs) | INFERRED + COACH-ANSWER LIB-16 | compound rep ranges, credited to the small muscle: dips 0.5 triceps / 0.5 chest (COACH-ANSWER LIB-16); upright rows -> side delts; push press -> delts |
| `CONTROL` | Core / control | 'CORE'; 'Accumulate'; 'unbroken' | OBSERVED | time, accumulate totals, reps; about 2 core exercises per session, first by default (COACH-ANSWER VOL-17, ATH-11) |
| `ATHLETIC` | Athletic exposure | 'SPEED/POWER'; 'ATHLETIC PATTERNS' | OBSERVED + COACH-ANSWER VOL-10 | contacts / throws / reps / metres at max intent; NEVER counted toward muscle volume (COACH-ANSWER VOL-10) |
| `COND` | Conditioning | 'CARDIO' | OBSERVED | self-dosing time / distance / calories |

#### F.QUALITY - Quality trained (PURPOSE row for non-muscle work)

*Applies to:* AP, CA, programs. *Question it answers:* Which physical quality is the target? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SPEED_POWER` | Speed / power | 'SPEED/POWER' (C6:K6, fill CC4125); 'POWER ' / 'PWR' (CrossFit); 'Speed' / 'speed' (BASEBALL day tag); 'FAST' (programs); 'SPEED SPECIALS' (RESISTANCE PATTERNS A77) | OBSERVED | - |
| `COD` | Change of direction | 'CHANGE OF DIRECTION' (L6:N6, fill 8E7CC3) | OBSERVED | - |
| `AEROBIC` | Aerobic capacity | 'CARDIO' (B6); 'AEROBIC C.'; 'A/C' | OBSERVED | - |
| `CORE` | Core control | 'CORE' (O6:T6) | OBSERVED | - |
| `STRENGTH` | Maximal strength | 'STRENGTH' (CrossFit; HYBRID B74); 'STRNGTH' (class P13); 'strength' (BASEBALL day tag); 'M.E.' (4 TRACKS N9); 'HEAVY' (programs) | OBSERVED | - |
| `HYPERTROPHY` | Hypertrophy / resistance | 'RESISTANCE' (CrossFit, green); 'MUSCLE BUILDING' (FAT BURN B4); 'bodybuilding style' (4 TRACKS C30); 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+' (ALL ABOUT SQUATS A13) | OBSERVED | - |
| `SKILL` | Skill | 'SKILL' / 'SKILLS' | OBSERVED | - |
| `WOD` | Mixed-modal conditioning | 'WODs' | OBSERVED | - |
| `TEST` | Test / peak | 'TEST/PEAK'; 'TEST' | OBSERVED | - |

#### F.INTENT - Intent: ballistic vs plyometric (and speed vs strength)

*Applies to:* AP, fast RP. *Question it answers:* Is the goal muscular force production or reactive/elastic return? *Evidence:* OBSERVED.

> CHAT-relayed: 'The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster that I can be.' v1 sport rule (COACH-ANSWER ATH-01): the ballistic:plyometric ratio follows the sport's own ground-contact time - more time on the ground (karate, fighters) -> more ballistics, fewer plyos; less (sprinters) -> more plyos; basketball a mix; baseball ballistics + rotational throws + sprinting, few plyos. Both ends always stay in the program. Programs start more ballistic and become more plyometric (CAT-10). The per-sport ground-contact attribute lives in 04_profiles.json (the shares by sport are approved, COACH-R2 R2-ATH-01). v1.1 (COACH-R2 R2-ATH-02, approved): ballistic = longer contact or one big effort - squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws; plyometric = short, bouncy contacts - pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; stick-the-landing drills are the receive stage (F.PMETHOD stage 1). KB swings are ballistic, never resistance work (R2-VOL-05).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `BALLISTIC` | Ballistic | 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' (BALLISTICS A22); '*I USE THESE FOR MUSCULAR FORCE PRODUCTION' (A23) | OBSERVED + COACH-ANSWER CAT-10, ATH-01 | max acceleration through release / take-off with a LONGER ground contact, muscle-driven force production (COACH-ANSWER CAT-10, ATH-01: 'The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement'). SCIENCE: slow SSC (contact > ~250 ms) or no rebound (SCI-11). |
| `PLYOMETRIC` | Plyometric | 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' (D22); '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS' (D23) | OBSERVED + COACH-ANSWER CAT-10, ATH-01 | SHORT ground contact, reactive and elastic: tendon stiffness / connective-tissue adaptation (COACH-ANSWER CAT-10, ATH-01). SCIENCE: fast SSC, contact < ~250 ms (SCI-11). |
| `SPEED_STRENGTH` | Speed-strength (fast loaded) | 'FAST RPE6 or about 60-70%' (4 TRACKS N17/N21); 'Box. Any Squat Touch and Go fast' (AI91); 'Weight should be lower ranges around 50% so you can move fast' (ALL ABOUT SQUATS B36) | OBSERVED | dynamic effort |
| `MAX_STRENGTH` | Max effort | 'M.E.' (N9/N13); 'HEAVY'; '1RIR'; 'MAX' | OBSERVED | - |

#### F.PHASE - Force phase (plyo/ballistic progression)

*Applies to:* AP.JMP, AP.UBP. *Question it answers:* Which part of the stretch-shortening cycle is being trained? *Evidence:* OBSERVED.

> Within each phase: bilateral -> unilateral, unloaded -> weighted, no drop -> drop, hop -> jump. COACH-ANSWER CAT-10 confirms receive-before-create as the plyo teaching order; F.PMETHOD collapses the four phases into the coach's three execution steps (P2 'create' only is the in-between step he does not dwell on). 'REVERSE BANDED HOPS/JUMPS' are out of scope while variable resistance is dormant (EQ-01, EQ-12).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `P1` | Taking in forces | 'TAKING IN FORCES' (BALLISTICS A24); 'STICK THE LANDING ...' | OBSERVED | landing / eccentric absorption |
| `P2` | Deliver forces fast | 'DELIVER FORCES FAST' (B24); '... HOP ON TO' / 'JUMP ON TO' | OBSERVED | concentric with landing cost removed (onto a box) |
| `P3` | Amortization of forces | 'AMORTIZATION OF FORCES' (C24); 'DOUBLE BOUNCE'; 'DROP ... & HOP/JUMP'; 'DROP WEIGHTED, DELOAD WEIGHT & ...'; '**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE' (C21) | OBSERVED | shorten the eccentric-concentric switch |
| `P4` | Rebounding | 'REBOUNDING ' (D24); 'REPEAT HOPS/JUMPS'; 'REVERSE BANDED HOPS/JUMPS' | OBSERVED | repeated reactive contacts; the reverse-banded versions are DORMANT (no variable resistance, EQ-01, EQ-12) |

#### F.PMETHOD - Receive-Create stages (plyo execution stage; named and timed by the coach, COACH-R2 R2-ATH-03)

*Applies to:* AP.JMP, AP.UBP (execution modifier on any jump, hop or plyo push-up). *Question it answers:* How is each contact performed: absorb and hold, absorb then produce once, or absorb and produce repeatedly? *Evidence:* OBSERVED (Sheet23 C34:D36) + COACH-ANSWER CAT-10, CAT-11; COACH-R2 R2-ATH-03 (name and timing).

> Not a zone and not a level (COACH-ANSWER CAT-11: 'it's not necessarily a plyo zone'). v1.1 (COACH-R2 R2-ATH-03, approved): the coach's name is 'Receive-Create stages' - stage 1 Land (RECEIVE_PAUSE), stage 2 Land & Go (RECEIVE_CREATE), stage 3 Repeat (REPEAT_RC). Timing: 12-week block weeks 1-3 / 4-7 / 8-12; 8-week block weeks 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2. Every jump in the catalog carries the stage its name implies (`athletic_quality.receive_create_stage`); the program sets the stage per block. Program default (CAT-10): early weeks hold more RECEIVE_PAUSE work, then RECEIVE_CREATE, then REPEAT_RC. Unilateral is harder than bilateral at every step (CAT-10). Davidson zones do not apply to plyos (CAT-10). Replaces F.PZONE: Z1 -> RECEIVE_PAUSE, Z2 -> RECEIVE_CREATE, Z3 -> REPEAT_RC.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `RECEIVE_PAUSE` | Stage 1 - Land (receive and pause) | 'ZONE 1' / 'Receive pause/creat' (Sheet23 C34:D34); 'Drop & Stick - Hold for 3 seconds'; 'STICK THE LANDING ...' (BALLISTICS); COACH-ANSWER CAT-10: 'first receive and pause ... stick-the-landing drills' | OBSERVED + COACH-ANSWER CAT-10 | land and hold; the body and connective tissue learn to receive force before creating it; front-loaded at the start of a program; = F.PHASE P1 |
| `RECEIVE_CREATE` | Stage 2 - Land & Go (receive then create once) | 'ZONE 2' / 'Receive/create' (C35:D35); COACH-ANSWER CAT-10: 'stick-the-landing and then jump, or stick-the-landing and then hop' | OBSERVED + COACH-ANSWER CAT-10 | land, then produce one jump or hop; = F.PHASE P3 (P2 'DELIVER FORCES FAST', create only, is the in-between step) |
| `REPEAT_RC` | Stage 3 - Repeat (repeated receive and create) | 'ZONE 3 ' / 'Repeat receive create' (C36:D36); COACH-ANSWER CAT-10: 'repetitively receiving and creating forces can be like hops and jumps' | OBSERVED + COACH-ANSWER CAT-10 | continuous repeated contacts (repeat hops / jumps); = F.PHASE P4 'REBOUNDING' |

#### F.DZONE - Davidson position zone (rotation bias)

*Applies to:* RP (upper body: arm position; lower body: hip/knee position), CO and FN holds; NOT plyometrics (COACH-ANSWER CAT-10). *Question it answers:* Where are the arms (or the hips and knees) relative to the trunk, and which rotation bias does that position create? *Evidence:* COACH-ANSWER CAT-04, CAT-10 (attributed by the coach to Dr. Pat Davidson, 'A Coach's Guide to Optimizing Movement'); angle cut-offs INFERRED.

> v1.1 (COACH-R2 R2-LIB-02, approved): the zone is a tag on the exercise, not its level - the level comes from load position, skill and stability, made easier by a seat, machine or cable (a deep goblet squat stays foundational; a seated DB shoulder press or a lat pulldown is foundational even though overhead). R2-LIB-03 (approved): keep both rotation biases in every week and use the bias to pick swaps when something hurts; not set by sport. Machines and cables lower the demand of any zone (CAT-04). Zones do not apply to plyos (CAT-10). Upper body (the v1 reading, retired as a level rule by R2-LIB-02): the zone order matches the coach's horizontal-before-vertical exercise order (row / bench Z2 before pull-up / overhead press Z3, ORD-01), but it does not set the level. Lower body: level follows load position (F.LOADPOS bands); the zone describes the rotation bias of the depth reached (half squat Z2, deep squat Z3). Angle bands for tagging (INFERRED; they no longer drive levels): upper body Z1 = arm below ~45-60 deg of flexion/abduction, Z2 = ~60-120 deg (in front of the chest), Z3 = above ~120 deg (overhead); lower body Z1 = hips extended, Z2 = thigh about horizontal, Z3 = hips below the knees. SCIENCE check 2026-10-08: public descriptions of these exact zones were not found; the rotation-bias reading is consistent with the PRI / Hartman / Davidson pressure model (expansion ~ external rotation, compression ~ internal rotation) cited in 07_science_lineage.md [D10].

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `Z1` | Zone 1 - vertical, low | COACH-ANSWER CAT-04: 'Zone 1 would be closer to your body at the bottom, with your arms'; COACH-ANSWER CAT-10: 'if I'm standing, it's also external rotational bias ... or my hands are down'; 'Cable Machine Curls (Zone1, ...' (BYOP AS12); 'Zone 1' in '(Zone 1 and Zone 3)' (Sheet23 AP6, rope pushdown) | COACH-ANSWER CAT-04, CAT-10 + OBSERVED labels | arms down by the sides / standing tall, hips extended; external-rotation bias; a tag only - the level comes from load position, skill and stability (COACH-R2 R2-LIB-02) |
| `Z2` | Zone 2 - horizontal | COACH-ANSWER CAT-10: 'if my knee is at the level of my hips (I'm halfway through a squat), or if my hands are in front of me horizontally, then that is a zone 2 or an internal rotation bias, which is more compressive'; COACH-ANSWER CAT-04: 'Zone 2 would be very high-pressure, like horizontal, but it's safer for you when you push and pull. That is more intermediate work.' | COACH-ANSWER CAT-04, CAT-10 | hands in front around shoulder height (rows, bench, push-ups) / thigh about horizontal (half squat); internal-rotation bias, compressive, high pressure but safe to push and pull; a tag only (COACH-R2 R2-LIB-02) |
| `Z3` | Zone 3 - vertical, high | COACH-ANSWER CAT-10: 'external rotation biases at the vertical. If I raise my hands up, or if I'm in a deep squat'; COACH-ANSWER CAT-04: 'Overhead or vertical would be more advanced, with the positioning, the amount of stability that you need, and the skill'; '(Zone 3)' overhead tricep extension (Sheet23 AP5) | COACH-ANSWER CAT-04, CAT-10 + OBSERVED labels | arms overhead / deep squat (hips deep in flexion); external-rotation bias; a tag only - an overhead exercise is not advanced because of its zone (COACH-R2 R2-LIB-02: a seated DB press or a lat pulldown is foundational). The coach groups the deep squat with the vertical, external-rotation positions; numbering it zone 3 is INFERRED, and it does not raise a squat's level (a goblet squat to full depth stays L1: lower-body level follows F.LOADPOS) |

#### F.SSC - SSC speed tier (speed-session order)

*Applies to:* AP.JMP, AP.SPD. *Question it answers:* How short is the ground contact? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `FASTEST` | Fastest SSC | '*FASTEST SSC*' (Sheet23 B43) - squirrel jumps | OBSERVED | shortest contact; first |
| `FAST` | Fast ballistic / warm-up SSC | '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' (B47) - MACH drills, acceleration starts | OBSERVED | before sprinting |
| `SPRINT` | Sprint | '*SPRINT*' (B51) - max velocity running | OBSERVED | top of the ladder |

#### F.TURN - Turn severity (COD level)

*Applies to:* AP.COD. *Question it answers:* How sharp is the cut? *Evidence:* OBSERVED.

> The route names are for every athlete, not only football, tiered by turn angle (COACH-ANSWER ATH-06). Angles INFERRED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `EASY_TURN` | Easy turn | 'EASY TURN' (L5); 'FADE','SLANT','POST/CORNER','FLAT','Shuffles' | OBSERVED | <=45 deg or rounded (angle INFERRED) |
| `MOD_TURN` | Moderate turn | 'MOD. TURN' (M5); 'DIG/OUT'; 'LEFT TEST' = the L-test, 3-cone (COACH-ANSWER LIB-01) | OBSERVED + COACH-ANSWER LIB-01 | ~90 deg (INFERRED) |
| `HARD_TURN` | Hard turn | 'HARD TURN' (N5); 'COMEBACK/CURL' (L91); date cell L92 / N10 / Sheet23 M3 = 2005-05-10 = the '5-10-5' pro agility drill, typed and turned into a date by Sheets (COACH-ANSWER LIB-01) | OBSERVED + COACH-ANSWER LIB-01 | 135-180 deg reversal (INFERRED) |

#### F.OLY - Olympic start position & receive

*Applies to:* AP.TEX. *Question it answers:* From where and how deep? *Evidence:* OBSERVED.

> COACH-ANSWER ATH-10: everyone in athletic training gets Olympic lifts; beginners and early intermediates hang pulls / hang cleans and DB/KB snatches and cleans (no bumpers needed); intermediate+ the full lifts. Youth may lift from the floor (ATH-09; from about 14, after a hang block, COACH-R2 R2-ATH-08). Full lifts are named Squat Snatch / Squat Clean / Squat Clean & Jerk (LIB-07). v1.1 (COACH-R2 R2-ATH-04 / R2-ATH-05 / R2-GEN-06): Olympic lifts up to 4 x per week - clean days (cleans = more squat-pattern) and snatch days (snatches = more hinge-pattern); full squat cleans / snatches 3-5 reps per set (same weekly reps), DB / KB and pull variants keep the 4 x 8 @ 75 % -> 4 x 4 @ 90 % ramp, with the coach's eye on speed; the weight is picked by RPE / RIR and bar speed (power output), % only for competitive Olympic lifters (their own programming). R2-LIB-07 adds hang clean, single-arm DB snatch, KB squat clean and hex-bar jump to the library (FOUNDATIONAL). Youth from the floor from about 14, after one block of hang work; older adults (60+) get no Olympic lifts by default - an opt-in with a warning (R2-ATH-08). The catalog tags every Olympic lift with its family and day (F.OLYFAM).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `HIGH_HANG` | High hang | 'FROM THE HIGH HANG' (OLYMPIC A7/A21); 'High hang ... pull' (C12/C14) | OBSERVED | easiest start |
| `MID_HANG` | Mid hang (knee) | 'FROM THE MID HANG (KNEE)' (A8/A22); 'Mid hang ...' (C13/C15) | OBSERVED | - |
| `LOW_HANG` | Low hang (below knee) | 'FROM THE LOW HANG (BELLOW KNEE)' (A9); '(BELLOW THE KNEE)' (A23); 'Low hang ...' (C53/C54) | OBSERVED | - |
| `FLOOR` | Floor | 'FROM THE FLOOR' (A10/A24) | OBSERVED | hardest start |
| `POWER` | Power receive | 'POWER ...' (A7:A10, A20:A24; C91:C93) | OBSERVED | partial depth, learned first |
| `SQUAT` | Squat receive | 'SQUAT ...' / 'Snatch ' / 'Clean ' (C94:C96; A11:A13, A28:A30) | OBSERVED | full depth, last |


#### F.OLYFAM - Olympic lift family and day (v1.1)

*Applies to:* AP.TEX (Olympic lifts and derivatives). *Question it answers:* Is this a clean-day (squat-leaning) or a snatch-day (hinge-leaning) lift, and how is it dosed? *Evidence:* COACH-R2 R2-ATH-04 / R2-ATH-05 / R2-GEN-06.

> Up to 4 x per week across clean and snatch days (R2-ATH-04). Reps (R2-ATH-05): full squat cleans / snatches 3-5 per set with the same weekly reps (e.g. 6 x 5 @ 75 %); DB / KB and pull variants keep the 4 x 8 @ 75 % -> 4 x 4 @ 90 % ramp; the coach's eye on speed. Load (R2-GEN-06): RPE / RIR and bar speed (power output); % of a tested max only for competitive Olympic lifters, whose programming is its own track. Older adults (60+): off by default, opt-in with a warning (R2-ATH-08). Catalog field `olympic_v1_1`.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `CLEAN` | Clean family - clean day | COACH-R2 R2-ATH-04: 'Some days are about cleans, and some days are about snatches or snatch style. I take them as more of a squatty pattern and a hinging pattern.' | COACH-R2 R2-ATH-04 | cleans, hang / power / squat cleans, clean pulls, KB squat clean, clean & jerk: squat-leaning |
| `SNATCH` | Snatch family - snatch day | COACH-R2 R2-ATH-04: 'I take snatches a little bit more hingy than squatty' | COACH-R2 R2-ATH-04 | snatches, snatch pulls, DB / KB snatches, high pulls (INFERRED), overhead-squat receiving drills: hinge-leaning |
| `JERK` | Jerk / overhead drive | (none - INFERRED class) | INFERRED | push / split jerks: either day (the coach splits cleans and snatches only) |
| `LOADED_JUMP` | Loaded jump (beginner Olympic option) | COACH-ANSWER ATH-10: 'hex bar jumps' | COACH-ANSWER ATH-10; day INFERRED | hex-bar jump squat: squat-leaning, contacts |

#### F.STANCE - Stance / base of support

*Applies to:* RP, AP.THR, FN. *Question it answers:* What is the body standing/sitting/kneeling on? *Evidence:* OBSERVED.

> Vertical push difficulty = base of support: seated -> Z floor -> tall kneeling -> standing (RESISTANCE PATTERNS E8:E15 green/yellow/red). 'Lunges are a propulsive strategy ' (LUNGES A8). 'HALF KNEELING VARIATIONS' (E16) is an empty header.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `FFE` | Front-foot elevated | 'front foot elevated lunge (FFE)' (C10); 'FFE' (LUNGES E22 'PROPULSION') | OBSERVED | more front-hip/knee ROM |
| `FLOOR` | Floor split stance | 'FLOOR' (E23); 'Stationary lunge' / 'reverse' / 'forward' | OBSERVED | - |
| `RFE` | Rear-foot elevated | 'Rear foot elevated lunge (RFE)' (C14); 'RFE' (E24); 'RFE Lunges (bulgarian)' | OBSERVED | more load on front leg |
| `FFE_RFE` | Both elevated | 'Front and Rear foot elevated lunge' (C15); 'RFE & FFE ...' (programs) | OBSERVED | max ROM |
| `WALL` | Rear foot against wall | 'rear foot against wall lunge' (C13) | OBSERVED | - |
| `STEP` | Step-up (forward / lateral) | 'forward step up' / 'lateral step up' (C17/C18) | OBSERVED | propulsive |
| `SPLIT_CONTRA` | Split stance (always contralateral load) | 'Split stance ALWAYS contralateral' (G83) | OBSERVED | - |
| `HK_SAME` | Half kneeling, same-side leg up | 'Half kneeling same side leg up' (G84); '... LEFT LEG UP ...' (K21/K23) | OBSERVED (G84) / INFERRED (mapping of the K21/K23 throw names to "same side") | - |
| `HK_OPP` | Half kneeling, opposite-side leg up | 'Half kneeling opposite side leg up' (G85); '... RIGHT LEG FORWARD ...' (K22/K24) | OBSERVED (G85) / INFERRED (K22/K24 mapping) | - |
| `TALL_KNEEL` | Tall kneeling | 'Kneeling DB press' (E12); 'kneeling cable or banded' (BC10) | OBSERVED | cable option only; the band option is DORMANT (EQ-01) |
| `SEATED` | Seated (supported) | 'Seated DB press' (E8); 'Incline Seated ...' (AA9:AA10) | OBSERVED | most external support |
| `Z_FLOOR` | Seated on floor (Z press) | 'DB Z press on floor ' (E10) | OBSERVED | - |
| `STANDING` | Standing | 'Standing DB press' (E14) | OBSERVED | - |
| `SUPINE` | Supine | 'floor supine' (BC46); 'Supine ...' | OBSERVED | - |
| `HANGING` | Hanging | 'Hanging ...' (O130, O209); 'Strict pull ups ...' | OBSERVED | - |
| `PLANK` | Plank / push-up | 'Plank', 'Push Ups' | OBSERVED | - |
| `SUMO` | Sumo / wide | 'Summo Deadlift' (A76); 'Sumo ...' | OBSERVED | - |
| `LATERAL` | Lateral / Cossack | 'Cosak lateral lunges' (C47); 'Side Lunges' | OBSERVED | - |

#### F.ORIENT - Movement orientation (lunges)

*Applies to:* RP.KD.UL. *Question it answers:* Which way does the body travel? *Evidence:* OBSERVED.

> 'Movement orientations/guidance loads AROUND' (A19).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `FB` | Front / back | 'Front/back' (LUNGES A22) | OBSERVED | sagittal |
| `LAT` | Lateral | 'Lateral' (A23) | OBSERVED | frontal |
| `CURTSY` | Curtsy / crossover | 'Curtsy Lunges ' (AL21) | OBSERVED item / PROPOSED value | transverse-ish |

#### F.LOADPOS - Load position

*Applies to:* RP.KD (BS & UL), RP.HD, AP.THR warm-ups. *Question it answers:* Where does the weight sit on the body? *Evidence:* OBSERVED + COACH-ANSWER CAT-04.

> 'THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN' (A9). Ladder = posture difficulty, NOT program level (BYOP files front/high/low bar all MODERATE). Groups: 'LOW/MID LOADING VARIATION' (C27) vs 'HIGH LOADING VARIATION' (C31). v1 level bands (COACH-ANSWER CAT-04): load in front / low = foundational ('people need to learn how to be more upright'), on the body = intermediate, behind the body = advanced. The 1-8 rank stays as the finer posture order. Older / injured / high-volume clients never get the overhead squat or low-bar squat (EQ-03).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SIDES` | Sides / suitcase (hex) | 'Hex Bar Squat' 'EASIEST' (ALL ABOUT SQUATS A11); 'Suitcase' (LUNGES); 'Low DB Squats' (AI15) = DBs hanging at the sides, arms down (COACH-ANSWER LIB-09) | OBSERVED | rank 1; L1 band (low / at the sides, Davidson zone 1) - COACH-ANSWER CAT-04 |
| `GOBLET` | Goblet / hug | 'Goblet Squat' 'EASIER'; 'Goblet loading' (RESISTANCE PATTERNS C29); 'medball hug' | OBSERVED | rank 2; L1 band (in front) - COACH-ANSWER CAT-04 |
| `COUNTER` | Counterbalance reach | 'Plate reach ' (C28) | OBSERVED | LOW/MID; L1 band (in front) - COACH-ANSWER CAT-04 |
| `HIGH_ZERCHER` | High zercher | 'High Zercher Squat' 'EASY'; 'Barbell high zercher racked' (C32) | OBSERVED | rank 3; L1 band (in front) - COACH-ANSWER CAT-04 |
| `ZERCHER` | Zercher | 'Zercher Squat' 'MODERATE'; 'Barbell zercher racked' (C33); 'Zercher barbell' (LUNGES C31) | OBSERVED | rank 4; L1 band (in front) - COACH-ANSWER CAT-04 |
| `FRONT_RACK` | Front rack / SSB | 'Front Squat/ SSB Bar' 'HARD'; 'Barbell Front squat racked' (C34); 'Front racked ...' (C24/C26) | OBSERVED | rank 5; L2 band (on the body) - COACH-ANSWER CAT-04 |
| `BACK_HIGH` | Back, high bar | 'High Bar Squat' 'HARDER' | OBSERVED | rank 6; L3 band (behind the body) - COACH-ANSWER CAT-04 |
| `BACK_LOW` | Back, low bar | 'Low Bar Squat' 'HARDEST' | OBSERVED | rank 7 (most hip-biased); L3 band (behind the body) - COACH-ANSWER CAT-04 |
| `OVERHEAD` | Overhead | 'Overhead Squat' 'VERY HARD ' / 'SPECIAL LOADING VARIATION'; 'Barbell overhead ' (C36) | OBSERVED | rank 8; L3 band (overhead) - COACH-ANSWER CAT-04 |
| `SHOULDER` | On shoulder | 'Contralateral on shoulder' / 'Ipsilateral on shoulder' / 'Double handed on shoulders' (LUNGES C25:C27) | OBSERVED | L2 band (on the body) - COACH-ANSWER CAT-04 |

#### F.IMPL - Implement

*Applies to:* every record. *Question it answers:* What provides the resistance? *Evidence:* OBSERVED in exercise names (the library has no equipment column).

> CHAT-relayed: 'Machines have a lot of reference points / constraints ... you can push a lot, and it's safer.' 'Free weights are very different. Barbells are more skilled.' 'For people who want to go up in volume, people who have injuries, or people who are older, more machines are usually better'. v1: client preference may choose between listed alternatives (COACH-ANSWER EQ-10); with no implement in the name, default by client and equipment, bodyweight -> DB -> barbell as level rises (EQ-09).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `BW` | Bodyweight | 'BodyWeight', 'Bodyweight' | OBSERVED in names | - |
| `DB` | Dumbbell | 'DB', 'Db', 'dbs' | OBSERVED in names | - |
| `KB` | Kettlebell | 'KB', 'Kb', 'kb' | OBSERVED in names | - |
| `BB` | Barbell (incl. EZ, hex, SSB, landmine) | 'Barbell', 'Hex bar', 'EZ', 'SSB', 'Landmine' | OBSERVED in names | - |
| `MB` | Medicine ball | 'Medball', 'Med ball', 'MedBall' | OBSERVED in names | 8-10 lb for passes and rotations; heavier only for specific uses (medball cleans, wall balls); never over 20 lb (COACH-ANSWER EQ-06) |
| `CABLE` | Cable | 'Cable' | OBSERVED in names | - |
| `MACHINE` | Machine | 'Machine', 'Leg press', 'Pendulum', 'Hack', 'GHD' | OBSERVED in names | not ranked by preference or brand (COACH-ANSWER EQ-11); see F.CONSTRAINT |
| `BAND` | Band (DORMANT) | 'Band(ed)' | OBSERVED in names | DORMANT - no bands anywhere for now (COACH-ANSWER EQ-01: 'I don't program anything with bands'; EQ-02, EQ-07, EQ-08). Band substitutes are replaced by non-band options (catalog / equipment model). |
| `SUSP` | Suspension / rings / TRX | 'TRX', 'rings' | OBSERVED in names | - |
| `BAR` | Pull-up / dip bar | 'Pull-ups', 'Dips', 'Toes to bar' | OBSERVED in names | - |
| `PROP` | Box / plate / hurdle / bench / ball / sliders | 'Box', 'plate', 'Hurdle', 'swiss ball', 'Glidder', 'Sandbag' | OBSERVED in names | - |
| `FIELD` | Open space / track | routes, runs | OBSERVED in names | - |
| `ERG` | Cardio machine | 'cals' (B133:B141) | OBSERVED in names | - |

#### F.CONSTRAINT - External stability / constraint

*Applies to:* RP mainly. *Question it answers:* How much does the equipment hold the body (reference points)? *Evidence:* COACH-ANSWER EQ-13 (scale approved); member examples INFERRED.

> Machines are not ranked by preference or brand (COACH-ANSWER EQ-11: 'I don't want to rank them because they have different brands, angles'). Older, injured or high-volume clients collect volume in high-constraint options and never get the overhead squat, snatch, low-bar squat or depth jumps (EQ-03); a FOUNDATIONAL older or injured client can use any machine whatever its library tier (EQ-04). Pain or injury: cut that muscle or pattern 30-50 %, move it to machines or split grips, or drop the exercise if it is too much (VOL-03). OBSERVED BYOP pattern kept for reference: upper-body levels REMOVE constraint (machine -> free), lower-body ADVANCED ADDS high-capacity machines (prog_byop_equipment sec.0 #9); the coach's v1 rule is that machines lower the demand (CAT-04).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `C1` | Bodyweight, ballistic, reactive | COACH-ANSWER EQ-13 scale '1 = bodyweight, ballistic, reactive' | COACH-ANSWER EQ-13 | sprints, jumps, throws, bodyweight drills, Olympic lifts as ballistic work (members INFERRED) |
| `C2` | Standing free weights | COACH-ANSWER EQ-13 '2 = standing free weights' | COACH-ANSWER EQ-13 | front / back squats, deadlifts, standing DB press, DB lunges (members INFERRED) |
| `C3` | Cable or DB on a bench | COACH-ANSWER EQ-13 '3 = cable or DB on a bench' | COACH-ANSWER EQ-13 | cable rows and presses, DB bench press, seated DB press (members INFERRED) |
| `C4` | Plate-loaded / Smith / chest-supported | COACH-ANSWER EQ-13 '4 = plate-loaded / Smith / chest-supported'; COACH-ANSWER EQ-11: 'Less constraint would be a Smith machine' | COACH-ANSWER EQ-13, EQ-11 | Smith squat, chest-supported row, hip thrust machine, belt squat (members INFERRED) |
| `C5` | Seated machine with back pad | COACH-ANSWER EQ-13 '5 = seated machine with back pad'; COACH-ANSWER EQ-11: 'more constraint would be a hack squat and a leg press' | COACH-ANSWER EQ-13, EQ-11 | leg press, hack squat, pendulum, leg extension, seated / lying leg curl, machine chest / shoulder press (members INFERRED) |

#### F.AXIAL - Axial spinal load

*Applies to:* RP.KD.BS, RP.HD.BS, loaded RP.KD.UL / RP.HD.UL, RP.PU.V (standing), AP.TEX. *Question it answers:* Does the load compress the spine (bar on the back or front rack, heavy pull from the floor)? *Evidence:* COACH-ANSWER PER-04, EQ-11; COACH-R2 R2-SES-01 / R2-SES-02 (counted list approved); other members INFERRED.

> Generator rule (COACH-R2 R2-SES-01, approved; refines PER-04): heavy squat and heavy deadlift on two different days (e.g. squat Monday, deadlift Friday); the other days use a non-axial hinge (hip thrust, back extension, reverse hyper) and leg press or belt squat. Counted lifts (R2-SES-02, approved): barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Not counted: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum are fine on the second day if not sore; powerlifters may add a light technique squat or deadlift. An athlete already loaded on the back, or sore, switches to the belt squat (EQ-11). F.SPINEDAY holds the class. New in v1 - not a sheet column.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `HIGH` | High axial load | COACH-ANSWER PER-04: 'the squat pattern (which is a lot of loading, also axial, meaning on your spine)'; COACH-ANSWER PER-04: 'I'm probably going to load it with the deadlifts as well' | COACH-ANSWER PER-04 (squats, deadlifts); other members INFERRED | barbell back / front / zercher / overhead squats, Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings (all counted, COACH-R2 R2-SES-02); INFERRED high but not counted: barbell lunges or split squats with the bar on the back, standing barbell press, Olympic lifts from the floor (Olympic lifts are not counted, R2-SES-02) |
| `LOW` | Low axial load | (none - INFERRED class) | INFERRED | DBs/KBs at the sides or goblet, landmine, hip thrusts (load on the hips), loaded carries, hack squat / pendulum (shoulder pads, back supported) |
| `NONE` | No axial load | COACH-ANSWER EQ-11: 'Belt squats are for people that you don't need to load them axially'; COACH-ANSWER PER-04: 'one day of squatting and the other day of leg pressing' | COACH-ANSWER EQ-11, PER-04 | belt squat, leg press, leg extension / curl and other back-supported machines, bodyweight work |


#### F.SPINEDAY - Spine-loading day class (v1.1)

*Applies to:* RP.KD.BS, RP.HD.BS, loaded RP.KD.UL / RP.HD.UL, AP.TEX. *Question it answers:* Does this lift count as one of the two heavy spine-loading lifts of the week, is it fine on the other day, or does it not count? *Evidence:* COACH-R2 R2-SES-01 / R2-SES-02.

> Sits beside F.AXIAL (how much the spine is loaded): F.SPINEDAY says how the generator counts it. Powerlifters may add a light technique squat or deadlift (R2-SES-02). Catalog field `axial_spinal_load.spine_day_v1_1`.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `COUNTED` | Counted heavy spine lift | COACH-R2 R2-SES-02 (approved list): barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings | COACH-R2 R2-SES-02 | the heavy squat day and the heavy deadlift day (two different days, R2-SES-01) |
| `SECOND_DAY_OK` | Second-day option if not sore | COACH-R2 R2-SES-02: goblet squat, hack squat and pendulum: fine on the second day if not sore | COACH-R2 R2-SES-02 (other front-loaded DB / KB / landmine squats INFERRED) | the second knee-dominant exposure when the client is not sore |
| `NOT_COUNTED` | Not counted | COACH-R2 R2-SES-02: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps | COACH-R2 R2-SES-02 | any day |

#### F.GRIP - Hand placement / grip

*Applies to:* RP upper, RP.HD.BS (grip width). *Question it answers:* How do the hands hold? *Evidence:* OBSERVED ('HAND PLACEMENT', RESISTANCE PATTERNS I16).

> Pain rule: 'When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help' (MM UL/PPL A7; MM ATHLETIC A6 adds 'going unilateral').

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SUP` | Supinated | 'supinated' (I17); 'Supinated Grip' | OBSERVED | - |
| `NEU` | Neutral / hammer / rope | 'neutral' (I18); 'Hammer', 'rope' | OBSERVED | - |
| `PRO` | Pronated | 'pronated' (I19) | OBSERVED | - |
| `WIDE` | Wide | 'wide grip' (I20); 'Wide Grip', 'Wide Mag Grips' | OBSERVED | on deadlifts = longer ROM |
| `NARROW` | Narrow / close | 'narrow grip' (I21); 'Close Grip' | OBSERVED | - |
| `SNATCH` | Snatch grip | 'Snatch grip barbell deadlift' (A73) | OBSERVED | longest hinge ROM |

#### F.BODYPOS - Feet / body position (trunk demand)

*Applies to:* RP push (supine/incline), RP.PL.V (hanging). *Question it answers:* How much of the trunk position is supplied? *Evidence:* OBSERVED ('FEET POSITION', I22).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `FEET_BENCH` | Feet on bench | 'feet on bench' (I23, green) | OBSERVED | L1 |
| `FEET_WALL` | Feet on wall | 'feet on wall' (I24, green); 'Incline DB bench press feet on wall' (G8) | OBSERVED | L1 |
| `FEET_RAISERS` | Feet on raisers/plates | 'feet on raisers or plates' (I25, yellow) | OBSERVED | L2 |
| `FEET_FLOOR` | Feet on floor | 'feet on floor' (I26, yellow) | OBSERVED | L2 |
| `FEET_AIR` | Feet in air (hollow) | 'feet in air (hollow bent legs)' / '(hollow legs str8)' (I27:I28, red) | OBSERVED | L3 |
| `HANG_BEHIND` | Feet behind (hanging) | 'Strict pull ups feet behind you'; 'Stricted Pull-ups feet behind' | OBSERVED | - |
| `HANG_FRONT` | Feet in front | '... feet in front' | OBSERVED | - |
| `HANG_KNEES` | Knees in chest | 'Knees in chest' | OBSERVED | - |
| `HANG_LSIT` | L-sit | 'L Sit'; 'Strict pull ups L sit' (E74) | OBSERVED | hardest |

#### F.ROM - Range of motion

*Applies to:* RP.HD.BS, RP.KD, RP.PU.H, AP.JMP, AP.TEX. *Question it answers:* How long is the range / where does the rep start? *Evidence:* OBSERVED ('ROM VARIABLE', A81).

> CHAT-relayed: 'Ranges of motion, full ranges of motion, mid ranges of motion, those are understandings of more mechanical work.'

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `ELEVATED` | Elevated (shorter) | 'Elevated' (A82, green) | OBSERVED | L1 |
| `FLOOR` | Floor (standard) | 'Floor' (A83, yellow, video) | OBSERVED | L2 |
| `DEFICIT` | Deficit (longer) | 'Deficit' (A84, red, video); 'Deficit Push-ups' (AF18); '(use deficit)' (AU9:AU10) | OBSERVED | L3 |
| `RDL` | RDL end range | '*RDL' (A85, A89, A94, red) | OBSERVED | extreme; meaning to confirm |
| `BOX` | Box depth target | 'Box. ...' (AI9:AI10, AI91:AI96); 'Box *ANY Squat ...' | OBSERVED | - |
| `PINS` | Pins | 'Pinned Squats ' (A35) | OBSERVED | - |
| `FULL` | Full ROM cue | '(for full ROM)' (AD99); '(FULL RANGE OF MOTION)' (BOXING) | OBSERVED | - |
| `HEIGHT` | Drop / box / hurdle height | 'Low' / 'Medium' / 'High Depth Drop (above hip)'; '(half shin)' / '(up to knee)' | OBSERVED + COACH-ANSWER EQ-16 | plyo intensity: low drop/box ~6-12 in, medium ~12-18 in, high = above hip; hurdles 6 in moderate, 12+ in advanced (COACH-ANSWER EQ-16) |

#### F.END - End-range behaviour

*Applies to:* RP.HD.BS, RP.KD.BS, AP.JMP. *Question it answers:* What happens at the turnaround? *Evidence:* OBSERVED ('END RANGE BEHAVIOR VARIABLE', A86).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `DEAD_STOP` | Dead stop | 'Dead stop' (A87, green); 'Deload' (box, AI94:AI96 - INFERRED to mean sit/pause on the box); '(D)BOX' (CONJUGATE) | OBSERVED | L1; full reset |
| `TOUCH_GO` | Touch & go | 'Touch & go' (A88, yellow, video); 'Touch and Go' (AI9:AI10, AI91:AI93); '(T&G)BOX' | OBSERVED | L2; rebound |
| `RDL` | RDL / continuous | '*RDL' (A89, red) | OBSERVED | L3 |
| `STICK` | Stick / hold | 'STICK THE LANDING'; 'Hold for 3 seconds' | OBSERVED | plyo RECEIVE_PAUSE (F.PMETHOD) |
| `BOUNCE` | Double bounce / repeat | 'DOUBLE BOUNCE'; 'REPEAT' | OBSERVED | plyo RECEIVE_CREATE / REPEAT_RC (F.PMETHOD) |


#### F.DETAIL - One-detail variation between blocks (v1.1)

*Applies to:* every library exercise (RP, CO, FN, AP jumps and throws). *Question it answers:* Which single detail may change when the next block repeats a library exercise? *Evidence:* COACH-R2 R2-LIB-01 (+ COACH-ANSWER PER-02).

> The library exercise is always the main pick; between blocks the tool changes ONE detail and shows it as '<library name> - <detail>'; it never invents an exercise and never changes two details at once (PER-02: 1-2 small changes between 4-6 week blocks). Catalog field `variation_v1_1.axes` (axes INFERRED per record).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `LOAD_HAND` | Which hand holds the weight | COACH-R2 R2-LIB-01 example: 'Reverse lunge - dumbbell in the opposite hand' | COACH-R2 R2-LIB-01 | contra / ipsilateral / both (see F.LOADLAT) |
| `GRIP` | Grip | COACH-R2 R2-LIB-01 | COACH-R2 R2-LIB-01 | see F.GRIP |
| `STANCE` | Stance | COACH-R2 R2-LIB-01 | COACH-R2 R2-LIB-01 | see F.STANCE |
| `IMPLEMENT` | Implement | COACH-R2 R2-LIB-01 | COACH-R2 R2-LIB-01 | see F.IMPL (never a band, EQ-01) |
| `RANGE` | Range | COACH-R2 R2-LIB-01 | COACH-R2 R2-LIB-01 | see F.ROM / F.END; for jumps the box / hurdle / drop height |

#### F.ACCOM - Variable resistance (bands, chains, weight releasers) - DORMANT

*Applies to:* RP.KD.BS, RP.HD.BS, AP.JMP. *Question it answers:* Is the load curve changed? *Evidence:* OBSERVED ('LOADING VARIABLES', A90; 'BANDED/CHAINED SQUAT VARIATIONS', ALL ABOUT SQUATS A33).

> DORMANT FUTURE AXIS - the generator does not use it. COACH-ANSWER EQ-01: 'I don't program anything with bands ... I don't really want to talk about variable resistance in any of this right now because it's so complicated'; EQ-12: 'No variable resistance should be available in this for now. We will work with that later on.' The values below are kept only as an archive of the sheet content so the axis can be switched on later without restructuring.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `BANDS` | Bottom banded (DORMANT) | 'BOTTOM BANDED' (ALL ABOUT SQUATS A35); 'BANDS' (A93); '(Banded)' (AI92, AI95) | OBSERVED | DORMANT (EQ-01, EQ-12). Sheet meaning: '*PROLONG THE DURATION OF MAX PROPULSION'; ~50%; for 'SOMEBODY THAT CAN'T YIELD DOWN INTO A SQUAT' |
| `REV_BANDS` | Reverse banded (DORMANT) | 'REVERSE BANDED' (A37); '(Reverse Banded)' (AI93, AI96); 'REVERSE BANDED HOPS/JUMPS' | OBSERVED | DORMANT (EQ-01, EQ-12). Sheet meaning: '*ACCELERATES MAX PROPULSION'; for 'SOMEBODY THAT IS SLOW ON THE WAY UP' |
| `CHAINS` | Bottom chains (DORMANT) | 'BOTTOM CHAINS' (A39); 'CHAINS' (A92); 'CHAINED DEADLIFT' | OBSERVED | DORMANT (EQ-01, EQ-12). Sheet meaning: '*INTENSIONALLY SLOW YOU DOWN'; ~70%; stiffness |
| `RELEASERS` | Weight releasers (DORMANT) | 'WEIGHT RELEASERS' (A91; ALL ABOUT SQUATS 'I HAVE NO IDEA'); 'DROP WEIGHTED, DELOAD WEIGHT & JUMP' (BALLISTICS) | OBSERVED | DORMANT (EQ-01, EQ-12). Sheet meaning: unresolved |

#### F.PERTURB - Plane perturbation

*Applies to:* RP.KD.BS, FN. *Question it answers:* Is a sideways or rotational force added to a sagittal lift? *Evidence:* OBSERVED.

> v1: only ADDUCT (held object) stays active. The frontal / transverse resistance blocks therefore have few items until the coach adds non-band ones (LIB-20).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `HIP_BAND` | Lateral band at hips (DORMANT) | 'Hip banded tube bands' (A47); 'Left or Right hip banded out ' (A48) | OBSERVED | DORMANT (band; COACH-ANSWER EQ-01). Sheet meaning: makes a squat FRONTAL |
| `ADDUCT` | Adduction squeeze | 'Hold between knees Squats' (A49); 'Hold object Adducted between knees' (BC9...); 'Knee banded for adduction' (BC11...) | OBSERVED | active only as 'hold an object between the knees'; the 'Knee banded for adduction' variants are dormant (EQ-01). Frontal moves like 'Hold between knees Squats' join the main library for court and combat athletes (COACH-ANSWER LIB-20) |
| `STRAP` | Rotational strap (REMOVED) | 'Whats that strap rotating in' / '... out' (A54:A55) | OBSERVED | REMOVED (COACH-ANSWER LIB-09: 'The strap rotating in and out, you can take that one away, doesn't matter'). Sheet meaning: makes a squat TRANSVERSE |

#### F.ZONE_SENSES - The word 'ZONE' (meanings resolved by COACH-ANSWER CAT-10 / CAT-11)

*Applies to:* labels. *Question it answers:* Which 'zone' is meant? *Evidence:* OBSERVED + COACH-ANSWER CAT-04, CAT-10, CAT-11.

> One field per meaning: F.LEVEL, F.PMETHOD, F.DZONE, F.EZONE / F.ABAND.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `ZONE_LEVEL` | Level row | 'ZONE' (BYOP A3; copy A2) | OBSERVED | row 3 = exercise tier (F.LEVEL). INFERRED v1: the coach names this row 'ZONE' because, for him, level is partly Davidson position (CAT-04); v1.1: R2-LIB-02 separates them - the zone is a tag, not the level |
| `ZONE_PLYO` | Sheet23 plyo 'ZONE 1/2/3' - not a zone | 'ZONE 1/2/3' + 'Receive...' (Sheet23 C34:D36) | OBSERVED + COACH-ANSWER CAT-11 | F.PMETHOD (COACH-ANSWER CAT-11: 'not necessarily a plyo zone'; v1.1: named 'Receive-Create stages', COACH-R2 R2-ATH-03) |
| `ZONE_DAVIDSON` | Davidson position zone (arm / hip position, rotation bias) | 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (AS12); '(Zone 3)' / '(Zone 1 and Zone 3)' (Sheet23 AP5/AP6) | OBSERVED text + COACH-ANSWER CAT-10 (meaning) | F.DZONE: Zone 1 arms down / standing, Zone 2 hands in front / knee at hip height, Zone 3 overhead / deep squat (was INFERRED arm position; now confirmed; numbering the deep squat zone 3 is INFERRED - the coach groups it with the vertical, external-rotation positions) |
| `ZONE_BAND` | Sheet23 column-A colour band | 'ZONE 1' rows 2-9 / 'ZONE 2' rows 10-16 / 'ZONE 3' rows 17-28 (Sheet23 A) | OBSERVED | INFERRED v1: most likely the same Davidson zones used as a level band (green = zone 1 / foundational, yellow = zone 2, red = zone 3), since the coach answered the 'green/yellow/red rows' question with Davidson's zones (CAT-10). Not needed by the generator. v1.1: a reading of the old sheet only - levels are not set from zones (COACH-R2 R2-LIB-02). |
| `ZONE_ENERGY` | Energy zones | 'SPEED ENDURANCE' / 'SPEED POWER' / 'SPEED STRENGTH & POWER' (BASEBALL); 'A'/'B'/'C' (AEROBIC) | OBSERVED | F.EZONE / F.ABAND |

#### F.CHOPDIR - Chop direction (anterior oblique)

*Applies to:* FN.AOS.CHOP. *Question it answers:* Which direction does the chop travel? *Evidence:* OBSERVED text and colour.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `DOWN` | Down | '... chop down' (BC9:BC12, green D9EAD3) | OBSERVED | L1 (INFERRED from colour) |
| `MID` | Midline | '... midline' (BC13:BC16, yellow FFF2CC) | OBSERVED | L2 |
| `UP` | Up | '... up' (BC17:BC20, red F4CCCC) | OBSERVED | L3 |

#### F.FNPOS - Developmental position

*Applies to:* FN, CO. *Question it answers:* How high is the centre of mass / how narrow the base? *Evidence:* OBSERVED order.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SUPINE` | Supine floor | 'floor supine' (BC46) | OBSERVED | 1 |
| `KNEEL` | Tall kneeling | 'kneeling' (BC10, BC47) | OBSERVED | 2 |
| `HALF_KNEEL` | Half kneeling | 'half kneeling' (BC11, BC48) | OBSERVED | 3 |
| `SPLIT_STAND` | Split standing | 'split standing' (BC12, BC49) | OBSERVED | 4 |

#### F.CARRY - Carry mode x loading

*Applies to:* FN.CARRY. *Question it answers:* Travelling or not; one or two hands? *Evidence:* OBSERVED headers, no exercises.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `PROPULSIVE` | Propulsive (travelling) | 'PROPULSIVE' (BA8) | OBSERVED | - |
| `STATIONARY` | Stationary | 'STATIONARY' (BA10) | OBSERVED | - |
| `BILATERAL` | Two hands | 'BILATERAL' (BA13) | OBSERVED | - |
| `UNILATERAL` | One hand | 'UNILARTERAL' (BA14) | OBSERVED | - |

#### F.ABAND - Aerobic colour band

*Applies to:* CA. *Question it answers:* Which energy-system band? *Evidence:* OBSERVED.

> '***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week' (AEROBIC A5). v1: sessions per week depend on the client - 3 for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics / bodybuilders plus long walks after workouts (COACH-ANSWER ATH-07). Any colour can run on a bike, rower, ski erg or treadmill, tracked by calories, time or distance (EQ-14). v1.1: the number of aerobic sessions is adjustable up or down by the user ('I need more cardio' adds one; less removes one); aesthetics clients get 4 including a second easy Orange, plus optional walks (COACH-R2 R2-SES-06); athletes by sport (R2-ATH-06).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `A` | Blue - short/high | 'A' (A24) | OBSERVED | - |
| `B` | Green - moderate | 'B' (B24) | OBSERVED | - |
| `C` | Orange - long/low | 'C' (C24) | OBSERVED | - |
| `LC` | Lactate clearance | '  LACTATE CLEARANCE ' (G23) | OBSERVED | - |

#### F.PACE - Pace

*Applies to:* CA. *Question it answers:* How fast? *Evidence:* OBSERVED (AEROBIC C/F/I columns).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `EASY` | Easy | 'EASY' | OBSERVED | - |
| `MODERATE` | Moderate | 'MODERATE' | OBSERVED | - |
| `FAST` | Fast | 'FAST' | OBSERVED | - |
| `FASTEST` | Fastest | 'FASTEST' | OBSERVED | - |
| `SPRINT` | Sprint | 'SPRINT' | OBSERVED | - |

#### F.CFORMAT - Cardio library format

*Applies to:* CA (library items). *Question it answers:* How is the item written? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SPEED_INTERVALS` | Speed intervals | 'SPEED INTERVALS' (B8) | OBSERVED | x min fast - y min walk |
| `DISTANCE_INTERVALS` | Distance intervals | 'DISTANCE INTERVALS' (B14) | OBSERVED | miles + walk |
| `DISTANCE_TEST` | Distance test | 'DISTANCE TEST' (B24, B89 duplicate) | OBSERVED | -> X.TEST |
| `SPEED_TEST` | Speed (endurance) test | 'SPEED TEST' (B44); 'SPEED ENDURANCE TEST' (copy B27) | OBSERVED | -> X.TEST |
| `DISTANCE` | Distance repeats | 'DISTANCE' (B123) | OBSERVED | 200-1000 m |
| `CALORIES` | Calories | 'CALORIES' (B132) | OBSERVED | 10-50 cal erg |

#### F.EZONE - Athletic energy zone (bout duration)

*Applies to:* AP, CA.BUY. *Question it answers:* How long is each bout? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SE` | Speed endurance | 'SPEED ENDURANCE' '>40 Secs' (BASEBALL E20:F20) | OBSERVED | - |
| `SP` | Speed power | 'SPEED POWER' '10-39 Secs' (E21:F21) | OBSERVED | - |
| `SSP` | Speed strength & power | 'SPEED STRENGTH & POWER' '0-12 Secs' (E22:F22) | OBSERVED | overlaps SP at 10-12 s |

#### F.VOL - Resistance volume zone

*Applies to:* RP. *Question it answers:* Which rep zone (compound vs smaller isolation move inversely)? *Evidence:* OBSERVED (BASEBALL A19:C22).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `VOL1` | VOL 1 | 'VOL 1' '12-15 Reps' (compound) / '10-12 Reps' (smaller isolation) | OBSERVED | - |
| `VOL2` | VOL 2 | 'VOL 2' '8-12 Reps' / '15 REPS' | OBSERVED | - |
| `VOL3` | VOL 3 | 'VOL 3' '6-8 Reps' / 'MAX REPS' | OBSERVED | - |

#### F.ROLE - Slot role inside a session

*Applies to:* programs. *Question it answers:* What job does this slot do in the day? *Evidence:* OBSERVED.

> CHAT-relayed: 'power first for athletics, and then the power-strength training of it, then strength training, and then the resistance movements and resistance patterns.' v1 order (COACH-ANSWER ORD-08, ATH-11, ORD-03, VOL-17): warm-up (5 min any cardio + A-drills or mobility, always written) -> core (about 2 exercises, doubling as the specific warm-up) -> plyo / ballistic -> Olympic / power -> strength -> resistance accessories; core is movable (after the plyos or after strength). That the short general warm-up comes before the core block is INFERRED from ORD-08 + ATH-11. An isolation (calves, side raises) goes first only when that muscle is a priority, as priority / pre-fatigue (ORD-04). v1.1: the core opener stays light - 2 exercises x 2 sets short of failure as a warm-up - and coaches or users may add core supersets or monster sets anywhere (COACH-R2 R2-SES-03); field athletes: up to 12 exercises plus the 2-exercise core block, warm-up drills never count, a superset of two small isolations counts as one (R2-SES-04).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `PRIMER` | Primer / warm-up | 'Part A' (BASEBALL); 1-set landings / squirrel jumps (MM ATHLETIC); 'Any Cardio Equipment' 5 min | OBSERVED | first; a warm-up is always written (5 min any cardio + A-drills or mobility); A-drills are not volume (COACH-ANSWER ORD-08) |
| `ATHLETIC_BLOCK` | Athletic block | 'Plyo','Throwing','COD','Tripple Extension' rows 3-7 (BYOP ATHLETIC) | OBSERVED | before resistance |
| `MAIN` | Main lift | 'the work' (4 TRACKS M9, fill CC4125); 'Part C' row 1 (BASEBALL); 'STRENGTH' (HYBRID); 'M.E.' | OBSERVED | 'the work' = main lift at ~1 RIR, always first among the lifts (COACH-ANSWER ORD-02, ORD-07) |
| `SECONDARY` | Opposite-pattern secondary | 'the accessory' (M10, CC0000); 'Part C' row 2 pull/push | OBSERVED | 'the accessory' = supporting lift at ~2 RIR (COACH-ANSWER ORD-07) |
| `UNILATERAL` | Unilateral / variation | 'the nuance' (M11, E69138); 'Part D' row 1 (uhd/ukd); 'UNI HD' / 'UNI KD' tri-sets | OBSERVED | 'the nuance' = weak-point, unilateral or variation work at MAX (COACH-ANSWER ORD-07) |
| `ISOLATION` | Isolation finisher | 'the survival' (M12, F1C232); 'Part D' rows 2-3 (bicep/calfs/tricep/shoulders) | OBSERVED | last, highest effort ('ALL','MAX'); 'the survival' = isolation or joint-health work done no matter what (COACH-ANSWER ORD-07) |
| `CORE_BLOCK` | Core block | 'Part B' (BASEBALL); 'Core' (optional days) | OBSERVED | FIRST by default - core work opens every session as the warm-up; the user may move it after the plyos or after strength (COACH-ANSWER ATH-11); about 2 core exercises (VOL-17) |
| `OPTIONAL_OLY` | Optional Olympic piece | 'OPTIONAL PIECE' / 'OLY' (BASEBALL, D5A6BD) | OBSERVED | - |
| `FINISHER` | Conditioning finisher | 'Part E' / 'Buy out' (FFF2CC) | OBSERVED | - |
| `OPTIONAL_DAY` | Optional / mid-week day | 'Optional' (AESTHETICS/3 DAY BUILDER); WEDNESDAY / SATURDAY (athletic, bootcamp) | OBSERVED | Calves, Cardio/Aerobic Capacity, Core, Focus 1, Focus 2; add-on or separate day, ideally separate (COACH-ANSWER ORD-10) |
| `SPECIALISE` | Specialisation | 'Focus 1' / 'Focus 2'; 'ACCESSORIES'; 'UPPER ACCESORY' / 'LOWER ACCESORY' | OBSERVED | focus slots, 2-3 sets each, may hit the same priority muscle (COACH-ANSWER ORD-11) |

#### F.DAYINTENT - Day / lift intent tag

*Applies to:* programs. *Question it answers:* Is the main lift today a speed or a strength exposure? *Evidence:* OBSERVED.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SPEED` | Speed day | 'Speed' (BASEBALL Mon); 'speed' (Fri); 'FAST RPE6 or about 60-70%'; D.E. (implied) | OBSERVED | - |
| `STRENGTH` | Strength day | 'strength' (Tue); 'M.E.' | OBSERVED + COACH-ANSWER PRG-09 | BASEBALL Thursday (untagged in the sheet) is a strength day (COACH-ANSWER PRG-09) |

#### F.SEASON - Season phase

*Applies to:* programs (athletes). *Question it answers:* Where in the year? *Evidence:* OBSERVED.

> v1.1: pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power, ending with a 1-2-week taper (COACH-R2 R2-PER-06, approved; its length can be changed); competitive athletes give the next season start date (or 'in season until') plus practice and game days, and the tool works out the phases (R2-GEN-05); in season, game-heavy sports get about half the gym plyos (R2-ATH-07).

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `OFF SEASON` | Off Season | 'OFF SEASON' | OBSERVED: BASEBALL F6:H6, K6, A13, J13:K13, S9:AM9, B16:D16, AV16:AZ16. Also ALL ABOUT SQUATS G15, MM ATHLETIC A9/D9/H9 ('... OFF SEASON WORKOUTS') and BOXING E4/E16/E28/E41 ('... OFF SEASON WORK'). The only season word used outside BASEBALL | - |
| `SOFT SEASON` | Soft Season | 'SOFT SEASON' | OBSERVED: BASEBALL only (F5:H5, I6:J6, B13, AN10:BC10) | - |
| `SOFT OFF SEASON` | Soft Off Season | 'SOFT OFF SEASON' | OBSERVED: BASEBALL only (A16) | - |
| `PRE SEASON` | Pre Season | 'PRE SEASON' | OBSERVED: BASEBALL only (A6, A9:E9) | - |
| `IN SEASON` | In Season | 'IN SEASON' | OBSERVED: BASEBALL only (B6:C6, C13:H13, F9:R9, G16:AQ16) | - |
| `PLAYOFFS` | Playoffs | 'PLAYOFFS' | OBSERVED: BASEBALL only (D6) | - |
| `POST SEASON` | Post Season | 'POST SEASON' | OBSERVED: BASEBALL only (E6, I13, AT16:AU16) | - |
| `FALL BALL` | Fall Ball | 'FALL BALL' | OBSERVED: BASEBALL only (AN9:BC9) | - |
| `PITCHERS/CATCHERS` | Pitchers/Catchers | 'PITCHERS/CATCHERS' | OBSERVED: BASEBALL only (E16) | INFERRED: a player-group reporting marker (pitchers and catchers report first), not a season phase |
| `POSITIONS` | Positions | 'POSITIONS' | OBSERVED: BASEBALL only (F16) | INFERRED: position-player reporting marker, not a season phase |
| `PEAK` | Peak | 'PEAK' | OBSERVED: BASEBALL only (BA16) | - |
| `DELOAD` | Deload | 'DELOAD' | OBSERVED: BASEBALL BB16:BC16 as a calendar phase; also a week type (4 TRACKS L17/L21, CONJUGATE L21/L25) | OBSERVED label only: the generator never puts a deload or maintenance week inside a block (COACH-R2 R2-VOL-07); a block is completed, or cancelled into a maintenance phase whose length is chosen and extendable (R2-PER-06) |
| `OFF` | Off | 'OFF' | OBSERVED: BASEBALL AR16:AS16 (calendar weeks off). The 'OFF' cells in BYOP program tabs are rest days | - |

#### F.WEEKTYPE - Week type

*Applies to:* programs. *Question it answers:* What kind of week? *Evidence:* OBSERVED.

> v1: A/B lead-lift weeks are optional, for clients who want variety (COACH-ANSWER PER-03); deload = about half the sets, same exercises, lighter (PER-05); tests are picked by checkbox at block start, or none (PER-07). v1.1 (COACH-R2 R2-VOL-07): never a deload or maintenance week inside a block - blocks are completed; a client who cannot complete one cancels it, does a maintenance phase (length chosen and extendable, ending with 'keep maintaining / change the plan / start a training block', R2-PER-06), then starts a whole new block. Tests: before the block (or week 1) and at the end, never mid-block (R2-PER-07). The sheet's DELOAD / MID DELOAD labels stay as OBSERVED history.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `A WEEK` | A Week | 'A WEEK' | OBSERVED: 4 TRACKS O33, Q33, S33 only | - |
| `B WEEK` | B Week | 'B WEEK' | OBSERVED: 4 TRACKS P33, R33 only | - |
| `BWEEK` | Bweek | 'BWEEK' | OBSERVED: 4 TRACKS T33 only | - |
| `A WEEK LOWER` | A Week Lower | 'A WEEK LOWER' | OBSERVED: 4 TRACKS U33 only | - |
| `MID DELOAD` | Mid Deload | 'MID DELOAD' | OBSERVED: 4 TRACKS U3 only | OBSERVED label only: the generator never puts a deload or maintenance week inside a block (COACH-R2 R2-VOL-07); a block is completed, or cancelled into a maintenance phase whose length is chosen and extendable (R2-PER-06) |
| `DELOAD WEEK` | Deload Week | 'DELOAD WEEK' | OBSERVED: 4 TRACKS L35; BASEBALL DU42 | OBSERVED label only: the generator never puts a deload or maintenance week inside a block (COACH-R2 R2-VOL-07); a block is completed, or cancelled into a maintenance phase whose length is chosen and extendable (R2-PER-06) |
| `DELOAD` | Deload | 'DELOAD' | OBSERVED: 4 TRACKS L17/L21; CONJUGATE L21/L25; BASEBALL BB16:BC16 | OBSERVED label only: the generator never puts a deload or maintenance week inside a block (COACH-R2 R2-VOL-07); a block is completed, or cancelled into a maintenance phase whose length is chosen and extendable (R2-PER-06) |
| `TEST` | Test | 'TEST' | OBSERVED: 4 TRACKS L9/L13; CONJUGATE J3/L13/L17 | test before the block (or in week 1) and in its last week; never mid-block (COACH-R2 R2-PER-07) |

#### F.DOSE - Dose vocabulary (pointer)

*Applies to:* every slot. *Question it answers:* What dose words exist? *Evidence:* OBSERVED.

> Detailed in the dosing synthesis; listed here only so every label is crosswalked.

| Code | Value | Coach labels (verbatim, where) | Evidence | Generator meaning |
|---|---|---|---|---|
| `SETS` | SETS menu | 1-8 (AV8:AV15); 'SUPERSET W/ 👇' (AV16) | OBSERVED | 'SUPERSET W/ 👇' = a fatigue / density tool: short sessions, advanced athletes needing more stimulus, off-season VO2 / mitochondrial work, beginners who do not fatigue (COACH-ANSWER ORD-05) |
| `REPS` | REPS menu | '4 to 6 Reps'; '6 to 8 Reps'; '8 to 12 Reps'; '10 to 15 Reps'; '15 Reps'; '20 Reps'; 'MYO SET' | OBSERVED | '10/10' = 10 per side, one set (COACH-ANSWER UNI-01, PRG-07); '12/10/8 -20' = pyramid 12 mid / 10 heavier / 8 heaviest, then a light 20 (PRG-07); 'MYO SET' only on the last machine / isolation exercise (VOL-15) |
| `EFFORT` | EFFORT 1-10 | '1 - Way Too Easy' ... '8 - That was perfect', '9 - That was terrible', "10 - I'm done" | OBSERVED | bullseye 8; EFFORT 9-10 -> hold or cut sets next week, <= 6 -> add (COACH-ANSWER GEN-05, RIGHT); RIR is the primary effort scale (VOL-13). v1.1 (COACH-R2 R2-VOL-02, PARTLY): '8 - That was perfect' = hit the target the plan gave and 9 = harder than planned, as proposed (the coach corrected only 10; 8 and 9 INFERRED as kept); 10 = 'the max I can do, not a fail' - successful, nothing left (the sheet label "10 - I'm done" stays OBSERVED; the tool explains it this way); a separate 'failed' option may be added. The approved check-in table (R2-VOL-01): effort 1-6 -> +7 %, 7-8 -> +5 %, 9 -> hold, 10 -> hold and remove 1 set from that day; never more than 7 % a week; repeat the week when under half the sessions were done - used without its 'life' modifiers (R2-GEN-04). No check-in = the planned stairway (R2-VOL-03). |
| `FEELING` | HOW IT FELT? | 'Felt the RIGHT muscles'; 'Felt the WRONG muscle'; 'Felt a PAIN'; "Couldn't do it" | OBSERVED | swap / regress triggers: 'Felt a PAIN' -> swap within the category or lower the level (COACH-ANSWER GEN-05). Whether clients log this inside the tool is still open (GEN-03: 'I don't know if people want to track it'). v1.1: logging is an optional weekly check-in (COACH-R2 R2-GEN-01: the plan works with no tracking at all); it asks effort, how it felt / completion and anything hurting - no sleep, stress or life questions (R2-GEN-04). 'Felt a PAIN' still drives the swap. |
| `LOAD_WORDS` | Load/effort words | '1RIR'; '2RIR'; '1-2 RIR'; 'MAX'; 'ALL'; 'EASY'; 'HEAVY'; '(MID WEIGHT)'; 'MAX REPS'; 'Accumulate'; 'unbroken' | OBSERVED | - |


---

## 3. Bigger muscles vs smaller muscles

### 3.1 Which muscles are which, in his system

| Muscle ID | Muscle | Size class | Coach labels (verbatim) | Primary nodes (1.0 credit) | Secondary / athletic exposure | Note |
|---|---|---|---|---|---|---|
| `QUADS` | Quadriceps | BIG (COACH-ANSWER CAT-02) | 'QUADS' (AI6, AJ6:AK6, AM6); 'Quads' (PURPOSE); 'QUADS/GLUTES' (AL6) / 'Quads/Glutes'; 'QUADS 👇' (AZ8) | RP.KD.BS, RP.KD.UL, RP.KD.ISO | AP.JMP, AP.COD, AP.TEX (athletic exposure, never counted - VOL-10) | Row-6 fill for quads is NOT uniform: AI6 'QUADS' is yellow FFD966, AJ6:AM6 are red E06666. 'Red = anterior chain' is INFERRED (hamstring/glute cells AN6:AR6 are all blue 6D9EEB). |
| `GLUTES` | Glutes | BIG (COACH-ANSWER CAT-02) | 'GLUTES 👇' (AZ164); inside 'QUADS/GLUTES', 'GLUTES/HAMSTRINGS', 'Quads/Glutes', 'Hamstring/Glutes' | hip-thrust / bridge / kickback items inside RP.HD.BS / RP.HD.UL (exercise-level 1.0; thrusts and bridges approved, COACH-R2 R2-VOL-05; kickbacks INFERRED) | RP.HD.BS, RP.HD.UL (0.25, COACH-R2 R2-VOL-05; the v1 PROPOSED 0.5 is retired - adversarial check); RP.KD.BS (0.25, R2-VOL-05), RP.KD.UL (0.25, COACH-ANSWER UNI-01); KB swings 0 (ballistic, R2-VOL-05) | never a slot of its own; always paired with quads or hamstrings in a PURPOSE label. v1: lunges count 'mostly for quads' (COACH-ANSWER UNI-01), so glutes get only the 0.25 helper credit from knee-dominant work; hinges give glutes 0.25 (v1.1, COACH-R2 R2-VOL-05: a quarter set on squats, lunges, deadlifts and RDLs; the v1 PROPOSED 0.5 and the v0 glutes 1.0 from every hinge are retired); KB swings count nothing (ballistic, R2-VOL-05) |
| `HAMSTRINGS` | Hamstrings | BIG (COACH-ANSWER CAT-02) | 'HAMSTRINGS' (AR6); 'GLUTES/HAMSTRINGS' (AN6:AQ6); 'Hamstring' / 'Hamstrings' / 'Hamstring/Glutes' (PURPOSE); 'HAMSTRINGS 👇' (AZ204) | RP.HD.BS, RP.HD.UL, RP.LF | AP.SPD (athletic exposure, never counted - VOL-10) | AN6:AR6 are all blue 6D9EEB (OBSERVED); reading blue as a 'posterior chain' colour is INFERRED |
| `BACK` | Lats / upper back | BIG (COACH-ANSWER CAT-02) | 'BACK' (U6:Z6); 'Back' / 'Back ' (PURPOSE); 'BACK 👇' (AZ89) | RP.PL.V, RP.PL.H, RP.PL.V.ISO | AP.TEX pulls (exposure, never counted - VOL-10) | - |
| `CHEST` | Chest | BIG (COACH-ANSWER CAT-02) | 'CHEST/FRONT DELTS' (AD6:AG6); 'Chest' (PURPOSE); 'CHEST 👇' (AZ244) | RP.PU.H, RP.PU.M, RP.PU.H.ISO | dips (0.5, COACH-ANSWER LIB-16), AP.UBP (exposure, never counted - VOL-10) | - |
| `FRONT_DELTS` | Front delts | unclassified (CAT-02 open) - PROPOSED SMALL | 'CHEST/FRONT DELTS'; 'SHOULDERS/TRAPS' (AA6); 'Chest/Shoulders' (PURPOSE) | RP.PU.V, RP.SM.DELT.FRONT | RP.PU.H, RP.PU.M | trained mostly through pressing; PROPOSED - PENDING COACH APPROVAL: SMALL, dosed like the other delts |
| `SIDE_DELTS` | Side delts | SMALL (COACH-ANSWER CAT-02) | 'SHOULDERS' (AH6); 'Shoulders/Traps' + 'ABdution'; 'SHOULDERS/TRAPS 👇' (AZ44) | RP.SM.DELT.SIDE, RP.SM.TRAP | RP.PU.V (0.25) | - |
| `REAR_DELTS` | Rear delts | SMALL (COACH-ANSWER CAT-02) | 'Reverse Flies' (PPL DETAIL) | RP.SM.DELT.REAR | RP.PL.H (0.25) | only PPL gives them a slot (OBSERVED); v1: they get their own sets on lifting days (COACH-ANSWER VOL-17) |
| `TRAPS` | Upper traps | unclassified (CAT-02 open) - PROPOSED SMALL | 'SHOULDERS/TRAPS' / 'Shoulders/Traps' | RP.SM.TRAP | AP.TEX pulls (exposure) | named, never isolated |
| `BICEPS` | Biceps | SMALL (COACH-ANSWER CAT-02) | 'BICEP' (AS1/AS6); 'Bicep'; 'BICEP 👇'; 'BICEPS' (RESISTANCE PATTERNS K23) | RP.SM.BI | RP.PL.* (0.25) | - |
| `TRICEPS` | Triceps | SMALL (COACH-ANSWER CAT-02) | 'TRICEP' (AT1/AT6); 'Tricep'; 'TRICEP 👇' (AZ124, includes dips); 'TRICEPS' (K31) | RP.SM.TRI | RP.PU.* (0.25), dips (0.5, COACH-ANSWER LIB-16) | - |
| `CALVES` | Calves | SMALL (COACH-ANSWER CAT-02) | 'CALVES' (AU1/AU6); 'Calves'; 'CALVES 👇' (AZ331); 'calfs' (BASEBALL) | RP.SM.CALF | AP.JMP.LK, AP.JMP (athletic exposure, never counted - VOL-10) | athletic templates move calves off training days (OBSERVED); v1: 3 sets every leg day (COACH-ANSWER VOL-17) |
| `ABS_OBLIQUES` | Abs / obliques (core) | SMALL (COACH-ANSWER CAT-02; own family CO) | 'CORE' (O6:T6); 'Core'; 'CORE 👇' (AZ284) | CO.CT, CO.CP, CO.CB, FN.AOS | AP.THR (exposure, never counted - VOL-10) | - |
| `ADDUCTORS` | Adductors | unclassified (CAT-02 open) - PROPOSED BIG | (none) - appear only inside names: 'Hold object Adducted between knees', 'Coppenhaggen Plank', 'Hold between knees Squats', 'Cosak lateral lunges' | FN.AOS | CO.CP / CO.CB (Copenhagen, PROPOSED), RP.KD.BS / RP.KD.UL (0.25 helper, PROPOSED as in `12_volume_algorithm_v1.json`; lateral / cossack lunges) | GAP: no coach muscle group; PROPOSED - PENDING COACH APPROVAL: BIG (large muscle mass, trained by squats, lunges and Copenhagen work) |
| `HIP_ABDUCTORS` | Glute med / hip abductors | unlisted | (none) - 'Hip banded tube bands' (band, dormant), 'SIDE LYING' (BE8), side planks | FN.LSS | RP.KD.UL (contralateral loading) | GAP |
| `ERECTORS` | Lower back / erectors | unlisted | (none) - 'GHD', 'Hyper extensions ', 'Reverse Hyper Extension' | RP.HD.BS | - | GAP |
| `FOREARMS` | Forearms / grip | SMALL (COACH-ANSWER CAT-02) | COACH-ANSWER CAT-02 (listed among the small muscles) | - | RP.SM.BI (reverse / hammer curls), FN.CARRY | no forearm list in the library yet |
| `NECK_CUFF` | Neck, rotator cuff | unclassified (neck: CAT-02 open, PROPOSED SMALL); rotator cuff unlisted | (none) | - | - | GAP: no exercises or groups (was FOREARMS_NECK_CUFF; forearms are now their own SMALL muscle). v1.1: a PROPOSED node RP.SM.NECK and two PROPOSED neck exercises (catalog), no credit; PROPOSED external-rotation (cuff) work sits in the catalog's ARMCARE bucket, not counted |


**How the class is decided.**
- **COACH-ANSWER CAT-02 (v1) confirms the classes:** big = quads, glutes, hamstrings, lats/upper back, chest; small = biceps, triceps, side and rear delts, calves, forearms, abs. He left front delts, traps, adductors and neck open; v1 PROPOSES front delts SMALL, traps SMALL, adductors BIG, neck SMALL (PENDING COACH APPROVAL).
- **OBSERVED structure (the v0 inference, now confirmed).** Every muscle the library cuts by biomechanics is "big": several pattern columns per muscle, with bilateral compound lists levelled FOUNDATIONAL/MODERATE/ADVANCED and a unilateral lane and an isolation column beside them. Those muscles are quads, glutes, hamstrings, back and chest.
- Every muscle that gets one unlevelled, muscle-named list is "small": side raises, biceps, triceps, calves.
- The FULL FOCUS LIST (AZ) uses the same ten groups and splits exactly five big (`'QUADS 👇'`, `'BACK 👇'`, `'GLUTES 👇'`, `'HAMSTRINGS 👇'`, `'CHEST 👇'`) and five small (`'SHOULDERS/TRAPS 👇'`, `'TRICEP 👇'`, `'BICEP 👇'`, `'CALVES 👇'`, `'CORE 👇'`).
- The delts are the exception: "small with a pattern". They also own VERTICAL PUSH through PURPOSE `'SHOULDERS/TRAPS'` (AA6). Side and rear delts are SMALL (CAT-02); front delts are unclassified (PROPOSED SMALL).
- **Core** is small by dose but has its own family (CONTROL).
- **Forearms** are SMALL (CAT-02) but have no list yet. **Adductors, hip abductors, lower back, neck and rotator cuff** have no group anywhere (gap G10). Adductors and abductors only appear inside exercise names (`'Hold object Adducted between knees'`, `'Coppenhaggen Plank'`, `'Hip banded tube bands'`).

### 3.2 What each class implies (dose classes)

The coach said: *"smaller muscles are going to take a lot more reps because you can't really go that heavy, and bigger muscles are going to take more of a mix."* He confirmed the defaults (COACH-ANSWER VOL-11): small muscles 12-30 reps (20s, MAX, myo sets), big muscles 5-15 mixed; he dislikes 40-rep sets (a CrossFit / AMRAP style option only). The sheets agree as a default, with two refinements. The dose follows **muscle size × exercise class**, not size alone. And it also moves with **goal and client level**: the 4 TRACKS strength block runs most isolations at `'3x8'`, and PPL takes side raises, reverse flies and upright rows down to 4 × 8 for NEWBY/INTERMEDIATE clients. The high-rep rule is a default, not a law.

| Dose class (`F.XCLASS`) | Members | Sets observed | Reps observed | Effort words | Levels? | Evidence |
|---|---|---|---|---|---|---|
| `BIG_COMP` big-muscle compound | squats, hinges, lunges, presses, rows, pull-ups | 3/slot (AESTHETICS Day 1); 2/slot (JUSTICE LEAGUE); 2→3→4 by client level (UL lower); 4→7 on the main lift (4 TRACKS STRENGTH-12) | `'15 Reps'`, `'8 to 12 Reps'`, `'6 to 8 Reps'`; VOL 1 `'12-15'` → VOL 2 `'8-12'` → VOL 3 `'6-8'`; strength menus 2-5; PPL by level: push presses and DB rows 15 → 10 → 8, legs 8 → 10 → 8, pulldown 15 → 10 → 12 (table in 2.1) | `'1-3 RIR'`, `'1RIR'`, `'2RIR'`, `'HEAVY'` | yes (bilateral lists) | BYOP AESTHETICS D4:D13, JUSTICE LEAGUE F/G3:12; BASEBALL A19:C22; ALL ABOUT SQUATS A13:H28 |
| `BIG_ISO` big-muscle isolation | leg extension, leg curl, chest fly, straight-arm pull-down | 2-4 (FAT BURN B11 4 × 15) | 2 × `'20 Reps'`; `'MYO SET'` (15 + 5×5 = 40); 2-3 × 20 (UL/PPL); 15 → 20 → 40 (FAT BURN; the coach dislikes 40-rep sets, VOL-11); 3 × 10 (BOXING weeks 1-2); `'6 & 6'` heavy / `'20/20'` light in the same boxing week; but `'3x8'` in the 4 TRACKS strength block (dose N12/N20/N23; exercises `'LEG EXT'` O12/O20, `'CABLE FLIES'` O23) | `'OUCH'` (JUSTICE LEAGUE H12), `'FULL RANGE OF MOTION'` | no | AESTHETICS D9; JUSTICE LEAGUE G12; UL rows 21-22; FAT BURN; BOXING |
| `SMALL_ISO` small-muscle isolation | side/rear/front raises, curls, triceps, calves | 2-4 (PPL NEWBY/INTERMEDIATE side raises 4 sets) | 2 × `'20 Reps'`; 3 × `'15 Reps'` calves (AESTHETICS D3); VOL 1 `'10-12'` → VOL 2 `'15 REPS'` → VOL 3 `'MAX REPS'` (inverse of compounds); 30-40 (FAT BURN); `'3x20'` `'TATE PRESS'` (4 TRACKS N15); `'3x8'` side raises / curls (N16) and 3 × 8 curls at `'ALL'` (STRENGTH-8 row 16); PPL side raises 3 × 15 → 4 × 8 → 4 × 8 and reverse flies / upright rows 3 × 15 → 3 × 10 → 4 × 8 by client level | `'MAX'`, `'ALL'`, `'MAX REPS'` | no | AESTHETICS D8; BASEBALL C19:C22; 4 TRACKS |
| `SMALL_COMP` small muscle, multi-joint | dips (0.5 triceps / 0.5 chest, LIB-16), upright rows (side delts), push press (delts) | 3-5 | 6-15 (push press 5 × `'6 to 8 Reps'`) | as compounds | – | AESTHETICS D13 |
| `CONTROL` core | thorax / pelvis / both | 1-5 | `':30 sec./ :30 sec.'`, `'Accumulate 2 minutes on each side'`, `'12/12 powerful turns'`, `'50 unbroken'`, Tabata | – | plane | BASEBALL Part B; MM ATHLETIC |
| `ATHLETIC` exposure (never muscle volume, VOL-10) | jumps, throws, COD, Olympic | 1-3 (primers 1) | `'6 to 8 Reps'` (BYOP); throws 1 × 10 (sit-up throws 1 × 20); squirrel jumps 1 × 40; landings 1 × 8 with a 3 s hold; power cleans 3 × 3 | `'EASY'` (plyos), `'heavy'` (Oly), max intent | per bucket | MEDBALL CHEAT SHEET A53:B71; MM ATHLETIC; 4 TRACKS |

Further OBSERVED implications:
- **Big muscles get several patterns per week; small muscles get one slot plus spill-over.** Quads get BKD + UKD + leg extension on every A day. Hamstrings and glutes get BHD + UHD + leg curl on every B day. Biceps, triceps and side delts get one slot each and otherwise rely on rows and presses (AESTHETICS).
- **Weekly sets mostly land where the class predicts (INFERRED, assumption-dependent).** The AESTHETICS tab writes doses only on Day 1 and part of Day 2 (D3:F13). Day 2 rows 12 and 14-16 and all of Days 3-4 are still `'CHOOSE 👇'`. With the sibling's v0 "coach convention" fill, the big lower-body muscles reach his 15-20 band (v1 landmarks: beginner 10-12, intermediate 15-20, advanced 20+, COACH-ANSWER VOL-01; v1.1: never under 10 a week for any muscle, most people 20-30, COACH-R2 R2-VOL-04 / R2-VOL-06) (quads 16, hamstrings 16, glutes 21), while chest (11), back (12) and the small muscles (biceps 10, side delts 9, rear delts 3, calves 6-12) sit below it. That fill sets unset compounds and calves to 3 sets and unset isolation to 2, copies Day 1 to Day 3 and Day 2 to Day 4, and uses the v0 0.5 synergist credit with glutes 1.0 from every hinge. These v0 figures are retired: recounted with the v1 credits (helpers 0.25, VOL-09; hinge glutes 0.5, then PROPOSED - v1.1: 0.25 approved, COACH-R2 R2-VOL-05, so the glute figure below is lower in v1.1), `03_volume_dosing.md` section 3 gives the same 4-day view quads 16, hamstrings 16, glutes 9, chest 6, back 12, side delts 6.5, rear delts 1.5, biceps 7, triceps 8, calves 6. Glutes fall the most, because most of their sets are helper credit. These are not the coach's written doses. The `'Focus 1'`/`'Focus 2'` slots (FULL FOCUS LIST, organised by muscle) are the lever to raise them (`analysis/programs/prog_byop_aesthetics.md` A.4).
- **When days are cut, the isolation whose joint action no compound covers survives.** Going from 4 to 3 days drops arms, side raises and leg extensions but keeps `'Leg Curls'` and `'Calves'` (3 DAY BUILDER).
- **Calves are special in athletic templates.** The calf slot moves off training days to the optional day (ATHLETIC). BASEBALL fills about 43% of `'calfs'` slots with ankle hops. Recount: 42 cells are labelled 'calfs' / 'calf' / 'CALF' and 40 of them hold an exercise. 16 of those 40 are ankle hops as printed (40%); 17 of 40 (42.5%) after re-aligning the shifted label at P37. v1 answer: it does not - athletic work never counts toward muscle volume (COACH-ANSWER VOL-10) - and calves get 3 sets every leg day (VOL-17). Rear delts also get their own sets (VOL-17).
- **Size class no longer sets the 3/5/7 % ramp.** In chat he had said *"depending on the size of the muscle"*; in the questionnaire he retired that mapping (COACH-ANSWER VOL-05: "It doesn't really go by muscle ... It's just more on what's going on with the person"). The weekly rate follows the person's response, not muscle size, and is client- or coach-adjustable; 10 %/week is too much (UNI-05). v1.1: every plan is a stairway - small steps in the first weeks, slightly bigger after the halfway point, the hardest weeks last (COACH-R2 R2-PER-03 / R2-PER-04; 'start at a 2, end at an 11' is perceived effort, not set counts, R2-PER-05). No check-in = no change: the plan follows its planned stairway ('there is no data to go off of', R2-VOL-03). With a check-in the step comes from effort, completion and pain only: the coach rejected sleep / stress / life inputs (R2-GEN-04), so the approved R2-VOL-01 table is used without its 'life' columns (resolution flagged in the v1.1 adversarial check). The step rules live in `03_volume_dosing.md` / `12_volume_algorithm_v1.md`. (The v1 wording 'fatigue, life, response' is retired.) Size class still sets the organising lens and the default rep range (VOL-11); the volume rules live in `03_volume_dosing.md` / `12_volume_algorithm_v1.md`.

---

## 4. The three lenses and how they intersect

### 4.1 Lens A: "bigger muscles / smaller muscles / biomechanics"

These are not three peer buckets. The coach confirmed it (COACH-ANSWER CAT-03): *"biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises."* Biomechanics describes every exercise (plane, laterality, load position, stance, ROM, Davidson zone). The big/small cut decides how the library lists are organised: **by pattern for anything multi-joint, by muscle for single-joint small-muscle work**. And every exercise carries every lens at once, so the generator can segment by any of them (CAT-01: "This is huge."):
- **Pattern lists** (OBSERVED headers): `'LOWER BODY MECHANICS'` / `'UPPER BODY MECHANICS'` → `'KNEE DOMINANT'`, `'HIP DOMINANT'`, `'VERTICAL PUSH'`, `'MID RANGE PUSH'`, `'HORIZONTAL PUSH'`, `'VERTICAL PULL'`, `'HORIZONTAL PULL'` → `'BILATERAL/UNILATERAL'` × `'SAGITAL/FRONTAL/TRANSVERSE'` → variable blocks (RESISTANCE PATTERNS A5:I94). Core and athletic work are cut the same way (planes, regions, force phases, start positions), never by muscle.
- **Muscle** (OBSERVED headers): `'SHOULDERS/BICEP/TRICEP'` (K6) with `'SHOULDERS'`, `'BICEPS'`, `'TRICEPS'` replacing the plane headers; library `'SIDE RAISES'`, `'BICEP'`, `'TRICEP'`, `'CALVES'`; zone codes `'RP - BICEP'`, `'RP - TRICEP'`, `'RP - CALVES'`, `'RP -SHOULDERS'` with no level word.
- **Big vs small** therefore decides *which organising principle applies* (sec. 3). For big muscles the muscle appears only as the slot's PURPOSE credit and in the FOCUS menu.

### 4.2 Lens B: "athletic patterns / resistance patterns / core"

These *are* peer buckets, and they are his families (library row 4 `'ATHLETIC'`, `'RESISTANCE'`, `'CONTROL'`; codes `'AP'`, `'RP'`, `'CT'`/`'CP'`). Row 4 also carries `'CARDIO'` (B4) and `'FUNCTIONAL'` (BC4:BE4). INFERRED, since the sheets carry no dates: FUNCTIONAL looks like the newest layer, because it is unpopulated and wired to no slot. The coach confirmed it should be built out (COACH-ANSWER LIB-19): carries and drags for athletes and general fitness, sling systems for advanced athletes and rehab. The family decides four things:

| | ATHLETIC (AP) | RESISTANCE (RP) | CONTROL (CO) |
|---|---|---|---|
| PURPOSE row means | a quality: `'SPEED/POWER'`, `'CHANGE OF DIRECTION'` | a muscle: `'QUADS'`, `'BACK'`, `'CHEST/FRONT DELTS'` … | `'CORE'` |
| Dose unit | contacts / throws / reps at max intent; bout seconds (`'SPEED STRENGTH & POWER'` `'0-12 Secs'`) | sets × reps near failure (`'1-3 RIR'`) | time, `'Accumulate'`, reps, `'unbroken'` |
| Where in the session | first among the lifts (`'Plyo'` → `'Throwing'` → `'COD'` → `'Tripple Extension'` before any resistance slot, on all 12 of 12 athletic days: ATHLETIC, JUSTICE LEAGUE and NO ACCESS - ATHLETIC, 4 days each); v1: after the core block | middle: bilateral → horizontal → unilateral → vertical → isolation | OBSERVED: primer (`'Part B'`), finisher, optional day, or tri-set partner. v1: **first by default** as the warm-up, movable after the plyos or after strength (COACH-ANSWER ATH-11) |
| Counted toward weekly sets per muscle? | **no** (COACH-ANSWER VOL-10): tracked as contacts, throws, reps and metres | yes | as abs/obliques |

The coach's word *"changing athletic patterns"* is reproduced verbatim from the brief. INFERRED: it is either "athletic patterns" or "change of direction, athletic patterns"; both map to `AP`.

### 4.3 How the lenses intersect

|  | Organised by pattern (biomechanics describes all of them) | Organised by muscle |
|---|---|---|
| ATHLETIC (AP) | all: TEX, JMP, UBP, SPD, THR, COD (quality PURPOSE) | none |
| RESISTANCE - big muscles | KD (BS/UL/ISO), HD (BS/UL), LF (leg flexion), PU.V/M/H, PL.V/H | via PURPOSE tags + FOCUS menu only |
| RESISTANCE - small muscles | VERTICAL PUSH for delts only | SM.DELT, SM.BI, SM.TRI, SM.CALF |
| CONTROL (CO) | CT / CP / BOTH x plane x static/dynamic | FOCUS 'CORE 👇' (3 weighted items) |
| FUNCTIONAL (FN) | carries / drags / slings | none |

- Lens B picks the FAMILY (row 4: ATHLETIC / RESISTANCE / CONTROL, plus CARDIO and FUNCTIONAL) = what quality a slot trains and how it is dosed.
- Lens A's size cut (bigger / smaller muscles, COACH-ANSWER CAT-02) picks how the library LIST is organised inside RESISTANCE: big muscles by pattern (joint dominance x laterality, push/pull x vector), small muscles by muscle (one unlevelled list each).
- 'Biomechanics' is not a third bucket (COACH-ANSWER CAT-03): it is the description every exercise carries - plane, laterality, load position, stance, ROM, Davidson zone - in every family.
- Athletic patterns and core are also organised by pattern (force phase, start position, turn angle, plane, region), never by muscle; their PURPOSE row names a quality ('SPEED/POWER', 'CHANGE OF DIRECTION', 'CORE') and athletic work never counts toward muscle volume (VOL-10).
- The program slot is the intersection: PURPOSE (muscle credited, Israetel lens) x CATEGORY (pattern bucket, Davidson lens).


Three slots show how the intersection reads in practice:
- `'Quads'`/`'Bilateral KD'` (RP, big, pattern-organised)
- `'Bicep'`/`'Bicep'` (RP, small, muscle: PURPOSE and CATEGORY collapse into one word)
- `'Plyo'`/`'Plyo'` (AP, quality: PURPOSE is a quality, so again one word)

INFERRED rule: **the generator places patterns and audits muscles.**

### 4.4 Why it is built this way (SCIENCE and the coach's named sources)

- **Pat Davidson → pattern lists and the biomechanical description of every exercise** (SCI-7). Davidson teaches movement as positions, reference points and constraints. He looks at the pelvis and ribcage moving relative to each other, at hip rotation ("into" vs "out of" a hip) and at the planes a load challenges. The coach's sheets use exactly this vocabulary:
  - `'GET INTO THE HIP'` / `'GET OUT OF THE HIP'`
  - CORE THORAX vs CORE PELVIS vs BOTH (which segment moves)
  - `'Stance loads the FRONT TO BACK'`
  - the half-kneeling medball matrix
  - adduction-integrated chops (`'Hold object Adducted between knees'`)
  - the CHAT-relayed definition of machines as "reference points / constraints"
  - v1: **the zones** - the coach names Davidson's book *A Coach's Guide to Optimizing Movement* as the source of his level positioning and of the rotation biases (COACH-ANSWER CAT-04, CAT-10; `F.DZONE`). The exact zone wording was not found in public summaries of Davidson's work, so it rests on the coach's account; the closest public parallel is the PRI / Hartman / Davidson pressure model (expansion ~ external rotation, compression ~ internal rotation; SCI-18).
  - v1: **into / out of the hip** in the coach's own words and use cases (CAT-13; section 2.1)

  Organising big movements this way lets one bucket (e.g. `RP.KD.UL`) generate many exercises by changing one variable at a time. That is his *"same pattern, different variable"* habit. AESTHETICS-12 A/B weeks swap only the variant (cable vs DB side raise, incline vs flat bench); where a slot does change pattern, it alternates between the two halves of a pair (squat week / hinge week in STRENGTH-8; leg press ↔ deadlift in the same FAT BURN row).
- **Mike Israetel → muscle accounting** (SCI-1 to SCI-6). Hypertrophy is local to a muscle, and its dose is weekly hard sets per muscle within individual landmarks (MEV → MRV), raised across a mesocycle and then deloaded (SCIENCE; the coach's own blocks have no deload inside - a block is completed, or cancelled into a maintenance phase, COACH-R2 R2-VOL-07). Load can vary from roughly 6 to 30+ reps if sets are close to failure (SCI-4, SCI-5). The coach's PURPOSE row, the FOCUS menu, his *"15-20 sets per week"*, the `'MYO SET'` (myo-reps), the EFFORT scale's bull's-eye `'8 - That was perfect'`, `'1-3 RIR'`, and `'LEG PRESS'` `'LOVE IT'` (*"local fatigue … not so much systemic"*, i.e. stimulus-to-fatigue ratio) all come from this lens.
- **First principles → athletic family and its axes.**
  - Force-velocity: CHAT-relayed *"The heavier I go, the slower I'm going to be"*, so athletic work goes first and light.
  - Stretch-shortening-cycle physiology: ballistic vs plyometric purpose, SSC speed tiers (SCI-11).
  - Landing-before-rebound tissue progression: the four force phases (SCI-12).
  - Weightlifting derivatives: hang pulls before catches (SCI-13).
  - Pre-planned vs reactive agility: `'COD: Proactive in nature'` vs `'Agility: Reactive in nature'` (SCI-14).
  - Intensity distribution in aerobic work: one blue, one green, one orange session per week (SCI-15). This is an even 1:1:1 split by session. It is *not* the polarised ~80/20 low-to-high distribution that Seiler's endurance evidence favours, so it parallels the idea of zones, not the distribution.
  - The size principle: `'HEAVY BARBELL'` → more motor units recruited (SCI-16). The coach's `'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS'` / `'ECCENTRICFAST LESS MUSCLE RECRUITMENT'` is his own tempo claim, not part of the size principle.
  - Core as anti-movement (SCI-9): his STATIC/DYNAMIC split.
  - Myofascial slings (SCI-10): the FUNCTIONAL BIOMECHANICS SYSTEM.
- **Why the two lenses need each other.** A small muscle is trained by essentially one joint action, so its pattern and its muscle are the same thing, and one list per muscle is enough. A big muscle is trained by many patterns (quads by squats, lunges, step-ups, leg extensions, jumps, sprints), so you need biomechanics to *choose* and muscle to *count*. The coach has built both halves; they just are not joined in one record yet.

### 4.5 Where outside models crept in (honest note for the coach)

He wants segmentation built from first principles, not from packaged models. The segmentation itself is his. Several *methods* inside it are borrowed, and the taxonomy keeps them as variables or methods, not as program templates:
- **Conjugate** (Westside): `'conjugate style training'`, `'M.E.'`, `'(D)BOX'`/`'(T&G)BOX'`, bands and chains (v1: bands and chains are DORMANT, EQ-01 / EQ-12; he does not need the generator to be conjugate, PER-01).
- **French contrast / triphasic** (Cal Dietz): `'FRENCH CONTRAST'` (ALL ABOUT SQUATS G16). Triphasic runs eccentric → isometric → concentric, with a reactive block after. His force phases (`'TAKING IN FORCES'` → `'DELIVER FORCES FAST'` → `'AMORTIZATION OF FORCES'` → `'REBOUNDING '`) only loosely parallel it, and in a different order.
- **Myo-reps** (Borge Fagerli): `'MYO SET'`, *"You can youtube myoreps"*.
- **Chris Hinshaw's half-marathon plan** (Sheet24, `'HALF MARATHON PROGRAM by CHRIS HINSHAW '`), used as-is for the half marathon only (COACH-ANSWER PRG-12). The aerobic tab title `'AEROBIC CAPACITY'` also matches his company's name.

### 4.6 Where the sport dial sits on this taxonomy (v1: partly confirmed by ATH-01 / ATH-02; v1.1: R2-ATH-01 / R2-ATH-02 / R2-ATH-03 / R2-ATH-04)

*"Basketball more plyos, boxers/karate fewer, MMA in between."* No sheet writes these sport values. v1: the coach confirmed the plyo ranking (ATH-02) and named the mechanism - the sport's ground-contact time (ATH-01). The per-sport values live in `04_profiles.json`; each knob below is a node or facet defined above.

| Knob | Node / facet | Evidence that the knob exists |
|---|---|---|
| Ballistic : plyometric ratio | `F.INTENT` (BALLISTIC = longer ground contact, PLYOMETRIC = shorter) × the sport's ground-contact time | COACH-ANSWER ATH-01: karate / fighters more ballistics, sprinters more plyos, basketball a mix, baseball ballistics + rotational + sprinting; CAT-10: programs start ballistic and become more plyometric. |
| Rebounding (plyometric) contact volume | AP.JMP × `F.PHASE=P4` / `F.INTENT=PLYOMETRIC` / `F.PMETHOD=REPEAT_RC` | Ballistics tab purposes and phases. The boxer example does **not** have fewer contacts than the generic athletic program (113-129 high + 142-177 low-amplitude per week vs 146/191/132). The difference is amplitude and type (`prog_mm_athletic_boxing.md` 4.4). |
| Ballistic / rotational power | AP.THR (AP.THR.HIP, ROT), AP.TEX, `F.INTENT=BALLISTIC` | The boxer (190-380 throws/week) and the generic athletic example (210-420) keep big medball volumes; BASEBALL (70-290/week) puts rotational throws on every upper day. |
| Change of direction | AP.COD × `F.TURN` | Every BYOP athletic day has a COD slot, yet the MM athletic, boxing and baseball programs contain no COD work at all. |
| Speed | AP.SPD | MACH drills, acceleration starts and max velocity appear only in Sheet23 and the programs; v1: a library category (LIB-21); in-season, speed athletes keep sprints (PER-08). |
| Athletic vs resistance share of the session | slot budget (10 slots on athletic days, 4-5 of them AP) | ATHLETIC template; JUSTICE LEAGUE 10 athletic / 10 resistance sets. v1: off-season field athletes up to 10-12 exercises - about 2 core + 2-4 plyo / ballistic + 2-3 Olympic / power + 3-4 resistance; resistance-only sessions about 5-7 (COACH-ANSWER VOL-08, VOL-17). v1.1: up to 12 exercises PLUS the 2-exercise core block (14 in all; warm-up drills never count; a superset of two small isolations counts as one, COACH-R2 R2-SES-04); on full-body days every muscle trained gets 2-4 exercises, never one (R2-SES-05). |
| Plane emphasis | `F.PLANE` on CO and RP | BASEBALL core rotation: transverse on 2 of 4 days. |
| Pattern reduction | RP.PU.H, RP.PL.V, RP.SM | Boxer weeks 3-8 drop all horizontal pushing and vertical pulling (OBSERVED). v1: reduce pressing and arm volume when punching volume is high, never cut it to zero (COACH-ANSWER ATH-04). |
| Receive-Create stage (v1.1) | `F.PMETHOD` | COACH-R2 R2-ATH-03: stages 1 Land, 2 Land & Go, 3 Repeat by block week; intermediate / advanced athletes may start at stage 2. |
| Olympic day (v1.1) | `F.OLYFAM` | COACH-R2 R2-ATH-04: clean days (squat-leaning) and snatch days (hinge-leaning), up to 4 x a week. |
| Age gates (v1.1) | AP.TEX, AP.JMP | COACH-R2 R2-ATH-08: 60+ no Olympic lifts / plyos / depth jumps by default (opt-in with a warning); youth from the floor from about 14. |

v1.1: the shares by sport are approved (COACH-R2 R2-ATH-01) and every catalog jump / throw carries its R2-ATH-02 class, so the dial now has a tag to grip. The sport list now covers every popular US sport, swimming in depth, and the gen-pop 'stay athletic and active' options (pickleball, HYROX, padel, hiking, skiing ...) in `04_profiles.json`; the exercises those sports needed (swimming dryland, HYROX stations, court-sport footwork and balance, neck and grip work) are PROPOSED-ADDITION records in the catalog.

---

## 5. Crosswalk: every label variant → canonical ID

**Relation legend:**
- `equals`: same bucket
- `alias`: spelling, case or space variant
- `level` / `facet`: the label is a value of a facet, not a bucket
- `umbrella`: the label covers several nodes
- `part`: the label is a subset of a node
- `conflict`: another sheet maps it differently
- `artefact`: UI or structural text, not taxonomy

"Where" cites workbook, tab and cell. Spaces are shown exactly (labels in back-ticks). There are 641 rows in 25 groups, covering 905 individual label strings (v1 added rows for the 'JUSTICE LEAGUE' tab name, the strap, 'Lat pull unders', 'Kong Rows', 'banded leg extensions on bench', 'Pull under' and the sibling code 'ISO_LEG_FLEXION', and re-pointed every row that used a retired or dormant value). The same rows are in the JSON (`crosswalk`) with the same fields; rows that list several labels are split in the JSON field `labels_split`.

#### G01 BYOP library row 1 (category / 'Segment')

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `CARDIO` | BYOP 'MASTER EXERCISE LIBRARY' B1 | row-1 category | CA | equals | OBSERVED | - |
| `TRIPPLE EXTENSION` | BYOP 'MASTER EXERCISE LIBRARY' C1 (merged C1:F1) | row-1 category | AP.TEX (+ AP.JMP.LK for the C124 'EASY' block) | umbrella | OBSERVED | typo 'TRIPPLE' |
| `PLYOS` | BYOP 'MASTER EXERCISE LIBRARY' G1 (merged G1:J1) | row-1 category | AP.JMP (AP.JMP.PLY + AP.JMP.LK + AP.JMP.FULL; also AP.UBP, AP.SPD.MAXV items) | umbrella | OBSERVED | - |
| `THROWING` | BYOP 'MASTER EXERCISE LIBRARY' K1 | row-1 category | AP.THR | equals | OBSERVED | - |
| `CHANGE OF DIRECTION` | BYOP 'MASTER EXERCISE LIBRARY' L1 (merged L1:N1) | row-1 category | AP.COD | equals | OBSERVED | - |
| `CORE THORAX` | BYOP 'MASTER EXERCISE LIBRARY' O1 (merged O1:Q1); also O8 block label | row-1 category | CO.CT | equals | OBSERVED | dropdown O7:O283 also covers CORE PELVIS |
| `CORE PELVIS` | BYOP 'MASTER EXERCISE LIBRARY' R1 (merged R1:T1); also O124 block label | row-1 category | CO.CP | equals | OBSERVED | - |
| `VERTICAL PULL` | BYOP 'MASTER EXERCISE LIBRARY' U1 | row-1 category | RP.PL.V | equals | OBSERVED | - |
| `HORIZONTAL PULL` | BYOP 'MASTER EXERCISE LIBRARY' X1 | row-1 category | RP.PL.H | equals | OBSERVED | - |
| `VERTICAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AA1 | row-1 category | RP.PU.V | equals | OBSERVED | holds incline seated presses (RP.PU.M), push press/jerk (AP.TEX.JERK), thrusters |
| `HORIZONTAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AD1 | row-1 category | RP.PU.H | equals | OBSERVED | holds flies (RP.PU.H.ISO) and incline DB bench (RP.PU.M) |
| `Horizontal Push` | (copy tabs) BYOP 'Copy of MASTER EXERCISE LIBRARY' L1 / 'Copy of Copy of MASTER EXERCISE' L1 | row-1 category | RP.PU.H | alias | OBSERVED | title case in the copy tabs |
| `SIDE RAISES` | BYOP 'MASTER EXERCISE LIBRARY' AH1 | row-1 category | RP.SM.DELT | equals | OBSERVED | holds side, front and rear delt work |
| `BILATERAL KNEE DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AI1 (merged AI1:AK1) | row-1 category | RP.KD.BS | equals | OBSERVED | - |
| `UNILATERAL KNEE DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AL1 | row-1 category | RP.KD.UL | equals | OBSERVED | - |
| `LEG EXTENSIONS` | BYOP 'MASTER EXERCISE LIBRARY' AM1 | row-1 category | RP.KD.ISO | equals | OBSERVED | - |
| `BILATERAL HIP DOMNANT` | BYOP 'MASTER EXERCISE LIBRARY' AN1 (merged AN1:AP1) | row-1 category | RP.HD.BS | alias | OBSERVED | typo 'DOMNANT' |
| `UNILATERAL HIP DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AQ1 | row-1 category | RP.HD.UL | equals | OBSERVED | - |
| `LEG CURLS` | BYOP 'MASTER EXERCISE LIBRARY' AR1 | row-1 category | RP.LF | equals | OBSERVED | COACH-ANSWER CAT-09: knee flexion is its own LEG FLEXION segment (was RP.HD.ISO) |
| `BICEP` | BYOP 'MASTER EXERCISE LIBRARY' AS1 | row-1 category | RP.SM.BI | equals | OBSERVED | - |
| `TRICEP` | BYOP 'MASTER EXERCISE LIBRARY' AT1 | row-1 category | RP.SM.TRI | equals | OBSERVED | - |
| `CALVES` | BYOP 'MASTER EXERCISE LIBRARY' AU1 | row-1 category | RP.SM.CALF | equals | OBSERVED | - |
| `SETS` | BYOP 'MASTER EXERCISE LIBRARY' AV1 | row-1 category | F.DOSE=SETS | facet | OBSERVED | - |
| `REPS` | BYOP 'MASTER EXERCISE LIBRARY' AW1 | row-1 category | F.DOSE=REPS | facet | OBSERVED | - |
| `EFFORT` | BYOP 'MASTER EXERCISE LIBRARY' AX1 | row-1 category | F.DOSE=EFFORT | facet | OBSERVED | - |
| `FEELING` | BYOP 'MASTER EXERCISE LIBRARY' AY1 | row-1 category | F.DOSE=FEELING | facet | OBSERVED | shown as 'HOW IT FELT?' in programs |
| `FULL FOCUS LIST` | BYOP 'MASTER EXERCISE LIBRARY' AZ1 | row-1 category | X.FOCUS | equals | OBSERVED | - |
| `CARRY` | BYOP 'MASTER EXERCISE LIBRARY' BA1 | row-1 category | FN.CARRY | equals | OBSERVED | no exercises |
| `DRAGS` | BYOP 'MASTER EXERCISE LIBRARY' BB1 | row-1 category | FN.DRAG | equals | OBSERVED | no exercises |
| `FUNCTIONAL BIOMECHANICS SYSTEM` | BYOP 'MASTER EXERCISE LIBRARY' BC1 (merged BC1:BE1) | row-1 category | FN (FN.AOS + FN.POS + FN.LSS) | umbrella | OBSERVED | - |
| `Segment` | (copy tabs) BYOP 'Copy of MASTER EXERCISE LIBRARY' A1 / 'Copy of Copy of MASTER EXERCISE' A1 | row-1 category | (field name for row 1 = category/segment) | artefact | OBSERVED | names row 1 as a field |

#### G02 BYOP rows 2-7 + separators (structural labels)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `ZONE` | BYOP 'MASTER EXERCISE LIBRARY' A3 (copy A2) | structural / separator | F.ZONE_SENSES=ZONE_LEVEL (row 3 = exercise tier) | artefact | OBSERVED | - |
| `PATTERN` | BYOP 'MASTER EXERCISE LIBRARY' A4 (copy A3) | structural / separator | (row 4 = family: AP/RP/CO/CA/FN) | artefact | OBSERVED | - |
| `PURPOSE` | BYOP 'MASTER EXERCISE LIBRARY' A6 (copy A5) | structural / separator | (row 6 = muscle credited or quality) | artefact | OBSERVED | - |
| `FILL HERE` | BYOP 'MASTER EXERCISE LIBRARY' row 2 of every dropdown-source column (black fill, near-white text) | structural / separator | (none - placeholder/instruction strip) | artefact | OBSERVED | AQ2 'FILL HERE ' has a trailing space |
| `CHOOSE 👇` | BYOP 'MASTER EXERCISE LIBRARY' row 7 of every column + rows 45/46/90/91/125/163/208 inside stacks | structural / separator | (dropdown placeholder - selectable!) | artefact | OBSERVED | filter out |
| `CHOSE 👇` | (program tabs) 422 cells in the two hidden NO ACCESS tabs | structural / separator | (typo placeholder, invalid in every list) | artefact | OBSERVED | - |
| `FOUNDATIONAL` | BYOP 'MASTER EXERCISE LIBRARY' block labels C8, G8, L8, O9, O126, R8, U8, X8, AD8, AI8, AN8, AQ8 | structural / separator | F.LEVEL=L1 | level | OBSERVED | selectable inside dropdowns |
| `FOUNDATIONAL  ` | BYOP 'MASTER EXERCISE LIBRARY' AA8 (2 trailing spaces) | structural / separator | F.LEVEL=L1 | alias | OBSERVED | - |
| `MODERATE` | BYOP 'MASTER EXERCISE LIBRARY' block labels C44, G44, G89 (second!), L44, O45, O162, R44, AD44, AI44, AN44 | structural / separator | F.LEVEL=L2 | level | OBSERVED | G44 = AP.JMP.LK plate hops; G89 = AP.JMP.PLY hurdles |
| `ADVANCED` | BYOP 'MASTER EXERCISE LIBRARY' block labels C89, G124, L89, O90, O207, R89, U44, X44, AA44, AD89, AI89, AN89 | structural / separator | F.LEVEL=L3 | level | OBSERVED | - |
| `EASY` | BYOP 'MASTER EXERCISE LIBRARY' C124 block label (JUMPING ANKLE) | structural / separator | AP.JMP.LK + F.LEVEL=L1 | level | OBSERVED | re-uses the word EASY as a block label |
| `UNILATERAL` | BYOP 'MASTER EXERCISE LIBRARY' block labels X89, AA89, AD124 | structural / separator | F.LAT=UL (+ F.LEVEL=L0) | facet | OBSERVED | a laterality lane used as a level block |
| `UNILATERAL  ` | BYOP 'MASTER EXERCISE LIBRARY' U89 (2 trailing spaces) | structural / separator | F.LAT=UL | alias | OBSERVED | - |
| `SPEED INTERVALS` | BYOP 'MASTER EXERCISE LIBRARY' B8 | structural / separator | CA + F.CFORMAT=SPEED_INTERVALS | facet | OBSERVED | band B/C by item (INFERRED) |
| `DISTANCE INTERVALS` | BYOP 'MASTER EXERCISE LIBRARY' B14 | structural / separator | CA + F.CFORMAT=DISTANCE_INTERVALS | facet | OBSERVED | - |
| `DISTANCE TEST` | BYOP 'MASTER EXERCISE LIBRARY' B24 and B89 (duplicate block) | structural / separator | X.TEST + F.CFORMAT=DISTANCE_TEST | facet | OBSERVED | - |
| `SPEED TEST` | BYOP 'MASTER EXERCISE LIBRARY' B44 | structural / separator | X.TEST + F.CFORMAT=SPEED_TEST | facet | OBSERVED | - |
| `SPEED ENDURANCE TEST` | (copy tab) BYOP 'Copy of Copy of MASTER EXERCISE' B27 | structural / separator | X.TEST + F.CFORMAT=SPEED_TEST | alias | OBSERVED | renamed in copy; matches BASEBALL 'SPEED ENDURANCE' |
| `Cardio` | (copy tab) BYOP 'Copy of Copy of MASTER EXERCISE' B2/B4 | structural / separator | CA | alias | OBSERVED | - |
| `DISTANCE` | BYOP 'MASTER EXERCISE LIBRARY' B123 (outside B7:B122 dropdowns) | structural / separator | CA + F.CFORMAT=DISTANCE | facet | OBSERVED | - |
| `CALORIES` | BYOP 'MASTER EXERCISE LIBRARY' B132 (outside B7:B122 dropdowns) | structural / separator | CA + F.CFORMAT=CALORIES | facet | OBSERVED | - |
| `SUPERSET W/ 👇` | BYOP 'MASTER EXERCISE LIBRARY' AV16 | structural / separator | F.DOSE=SETS (pairing marker) | facet | OBSERVED | - |
| `QUADS 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ8 | structural / separator | X.FOCUS -> muscle QUADS | equals | OBSERVED | - |
| `SHOULDERS/TRAPS 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ44 | structural / separator | X.FOCUS -> muscles DELTS + TRAPS | equals | OBSERVED | includes incline presses |
| `BACK 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ89 | structural / separator | X.FOCUS -> muscle BACK | equals | OBSERVED | - |
| `TRICEP 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ124 | structural / separator | X.FOCUS -> muscle TRICEPS | equals | OBSERVED | includes dips |
| `GLUTES 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ164 | structural / separator | X.FOCUS -> muscle GLUTES | equals | OBSERVED | - |
| `HAMSTRINGS 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ204 | structural / separator | X.FOCUS -> muscle HAMSTRINGS | equals | OBSERVED | includes hip thrusts / deadlifts |
| `CHEST 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ244 | structural / separator | X.FOCUS -> muscle CHEST | equals | OBSERVED | includes incline presses |
| `CORE 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ284 | structural / separator | X.FOCUS -> muscle ABS_OBLIQUES | equals | OBSERVED | - |
| `BICEP 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ311 | structural / separator | X.FOCUS -> muscle BICEPS | equals | OBSERVED | - |
| `CALVES 👇` | BYOP 'MASTER EXERCISE LIBRARY' AZ331 | structural / separator | X.FOCUS -> muscle CALVES | equals | OBSERVED | - |
| `PROPULSIVE` | BYOP 'MASTER EXERCISE LIBRARY' BA8 | structural / separator | FN.CARRY + F.CARRY=PROPULSIVE | facet | OBSERVED | - |
| `STATIONARY` | BYOP 'MASTER EXERCISE LIBRARY' BA10 | structural / separator | FN.CARRY + F.CARRY=STATIONARY | facet | OBSERVED | - |
| `BILATERAL` | BYOP 'MASTER EXERCISE LIBRARY' BA13 | structural / separator | FN.CARRY + F.CARRY=BILATERAL | facet | OBSERVED | - |
| `UNILARTERAL` | BYOP 'MASTER EXERCISE LIBRARY' BA14 | structural / separator | FN.CARRY + F.CARRY=UNILATERAL | alias | OBSERVED | typo |
| `SAGITAL` | BYOP 'MASTER EXERCISE LIBRARY' BB8 | structural / separator | FN.DRAG + F.PLANE=SAG | facet | OBSERVED | typo 'SAGITAL' |
| `FRONTAL` | BYOP 'MASTER EXERCISE LIBRARY' BB10 | structural / separator | FN.DRAG + F.PLANE=FRO | facet | OBSERVED | - |
| `CHOPS` | BYOP 'MASTER EXERCISE LIBRARY' BC8 | structural / separator | FN.AOS.CHOP | equals | OBSERVED | - |
| `ANTI ROTATIONS` | BYOP 'MASTER EXERCISE LIBRARY' BC45 | structural / separator | FN.AOS.AROT | equals | OBSERVED | - |
| `PLANKS` | BYOP 'MASTER EXERCISE LIBRARY' BC90 | structural / separator | FN.AOS.PLANK | equals | OBSERVED | - |
| `CRUNCHES` | BYOP 'MASTER EXERCISE LIBRARY' BC125 | structural / separator | FN.AOS.CRUNCH | equals | OBSERVED | empty |
| `INTEGRATED WITH PUSH & LEGS` | BYOP 'MASTER EXERCISE LIBRARY' BC44, BC89, BC124 | structural / separator | FN.AOS (integration tag) | facet | OBSERVED | label or empty sub-list (open question) |
| `BRIDGES` | BYOP 'MASTER EXERCISE LIBRARY' BD8 | structural / separator | FN.POS | part | OBSERVED | - |
| `INTEGRATIONS WITH PULL & LEGS` | BYOP 'MASTER EXERCISE LIBRARY' BD9 | structural / separator | FN.POS (integration tag) | facet | OBSERVED | - |
| `SIDE LYING` | BYOP 'MASTER EXERCISE LIBRARY' BE8 | structural / separator | FN.LSS | part | OBSERVED | - |
| `INTEGRATIONS LEGS & DELTS` | BYOP 'MASTER EXERCISE LIBRARY' BE9 | structural / separator | FN.LSS (integration tag) | facet | OBSERVED | - |

#### G03 BYOP row 3 ZONE values

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `EASY` | BYOP 'MASTER EXERCISE LIBRARY' C3, F3, G3, O3, R3, X3 | row 3 'ZONE' (level / zone code) | F.LEVEL=L1 | level | OBSERVED | - |
| `EASY  ` | BYOP 'MASTER EXERCISE LIBRARY' L3 (2 trailing spaces) | row 3 'ZONE' (level / zone code) | F.LEVEL=L1 | alias | OBSERVED | - |
| `MODERATE` | BYOP 'MASTER EXERCISE LIBRARY' D3, H3, I3, M3, P3, S3 | row 3 'ZONE' (level / zone code) | F.LEVEL=L2 | level | OBSERVED | - |
| `ADVANCED` | BYOP 'MASTER EXERCISE LIBRARY' E3, J3, N3, T3, V3, Y3 | row 3 'ZONE' (level / zone code) | F.LEVEL=L3 | level | OBSERVED | - |
| `HARD` | BYOP 'MASTER EXERCISE LIBRARY' Q3 | row 3 'ZONE' (level / zone code) | F.LEVEL=L3 | alias | OBSERVED | only use of HARD as a level |
| `FOUNDATIONAL` | BYOP 'MASTER EXERCISE LIBRARY' U3 | row 3 'ZONE' (level / zone code) | F.LEVEL=L1 | level | OBSERVED | - |
| `ANY` | BYOP 'MASTER EXERCISE LIBRARY' W3, Z3 | row 3 'ZONE' (level / zone code) | F.LEVEL=L0 | level | OBSERVED | unilateral pull lanes |
| `AP - THROWING` | BYOP 'MASTER EXERCISE LIBRARY' K3 | row 3 'ZONE' (level / zone code) | AP.THR + F.LEVEL=L0 | equals | OBSERVED | - |
| `FOUNDATIONAL - RP - BS - VERTICAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AA3 | row 3 'ZONE' (level / zone code) | RP.PU.V.BS + F.LEVEL=L1 | equals | OBSERVED | - |
| `ADVANCED - RP - BS - VERTICAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AB3 | row 3 'ZONE' (level / zone code) | RP.PU.V.BS + F.LEVEL=L3 | equals | OBSERVED | - |
| `RP - UL - VERTICAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AC3 | row 3 'ZONE' (level / zone code) | RP.PU.V.UL + F.LEVEL=L0 | equals | OBSERVED | - |
| `RP - BS - FOUNDATIONAL- HORIZONTAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AD3 | row 3 'ZONE' (level / zone code) | RP.PU.H.BS + F.LEVEL=L1 | equals | OBSERVED | level in 3rd position |
| `RP - BS - INTERMEDIATE - HORIZONTAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AE3 | row 3 'ZONE' (level / zone code) | RP.PU.H.BS + F.LEVEL=L2 | equals | OBSERVED | - |
| `RP - BS - ADVANCED HORIZONTAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AF3 | row 3 'ZONE' (level / zone code) | RP.PU.H.BS + F.LEVEL=L3 | equals | OBSERVED | - |
| `RP - UL - HORIZONTAL PUSH` | BYOP 'MASTER EXERCISE LIBRARY' AG3 | row 3 'ZONE' (level / zone code) | RP.PU.H.UL + F.LEVEL=L0 | equals | OBSERVED | - |
| `RP -SHOULDERS` | BYOP 'MASTER EXERCISE LIBRARY' AH3 | row 3 'ZONE' (level / zone code) | RP.SM.DELT + F.LEVEL=L0 | equals | OBSERVED | - |
| `RP - BS - KNEE DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AI3 | row 3 'ZONE' (level / zone code) | RP.KD.BS (+ L1 for the first block) | equals | OBSERVED | - |
| `RP-BS-KNEE DOMINANT-INTERMIDIATE` | BYOP 'MASTER EXERCISE LIBRARY' AJ3 | row 3 'ZONE' (level / zone code) | RP.KD.BS + F.LEVEL=L2 | equals | OBSERVED | typo 'INTERMIDIATE' |
| `RP-BS-KNEE DOMINANT -ADVANCED` | BYOP 'MASTER EXERCISE LIBRARY' AK3 and AM3 | row 3 'ZONE' (level / zone code) | RP.KD.BS + F.LEVEL=L3 (AK); RP.KD.ISO + F.LEVEL=L0 (AM - copy typo) | equals | OBSERVED + COACH-ANSWER LIB-15 | AM3 copied from AK3: typo confirmed (COACH-ANSWER LIB-15); leg extensions at every level |
| `RP - UL - KNEE DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AL3 | row 3 'ZONE' (level / zone code) | RP.KD.UL + F.LEVEL=L0 | equals | OBSERVED | - |
| `RP - BS - HIP DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AN3 | row 3 'ZONE' (level / zone code) | RP.HD.BS (+ L1 first block) | equals | OBSERVED | - |
| `RP-BS-HIP DOMINANT-INTERMIDIATE` | BYOP 'MASTER EXERCISE LIBRARY' AO3 | row 3 'ZONE' (level / zone code) | RP.HD.BS + F.LEVEL=L2 | equals | OBSERVED | - |
| `RP-BS-HIP DOMINANT-ADVANCED` | BYOP 'MASTER EXERCISE LIBRARY' AP3 | row 3 'ZONE' (level / zone code) | RP.HD.BS + F.LEVEL=L3 | equals | OBSERVED | - |
| `RP - UL - HIP DOMINANT` | BYOP 'MASTER EXERCISE LIBRARY' AQ3 | row 3 'ZONE' (level / zone code) | RP.HD.UL (AQ8 block says FOUNDATIONAL) | equals | OBSERVED | - |
| `(blank)` | BYOP 'MASTER EXERCISE LIBRARY' AR3 | row 3 'ZONE' (level / zone code) | RP.LF (no code) | artefact | OBSERVED | proposed 'RP - LEG FLEXION' (COACH-ANSWER CAT-09) |
| `RP - BICEP` | BYOP 'MASTER EXERCISE LIBRARY' AS3 | row 3 'ZONE' (level / zone code) | RP.SM.BI + F.LEVEL=L0 | equals | OBSERVED | - |
| `RP - TRICEP` | BYOP 'MASTER EXERCISE LIBRARY' AT3 | row 3 'ZONE' (level / zone code) | RP.SM.TRI + F.LEVEL=L0 | equals | OBSERVED | - |
| `RP - CALVES` | BYOP 'MASTER EXERCISE LIBRARY' AU3 | row 3 'ZONE' (level / zone code) | RP.SM.CALF + F.LEVEL=L0 | equals | OBSERVED | - |

#### G04 BYOP row 4 PATTERN (family)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `CARDIO` | BYOP 'MASTER EXERCISE LIBRARY' B4 | row 4 'PATTERN' | CA | equals | OBSERVED | - |
| `ATHLETIC` | BYOP 'MASTER EXERCISE LIBRARY' C4:N4 | row 4 'PATTERN' | AP | equals | OBSERVED | - |
| `CONTROL` | BYOP 'MASTER EXERCISE LIBRARY' O4:T4 | row 4 'PATTERN' | CO | equals | OBSERVED | - |
| `RESISTANCE` | BYOP 'MASTER EXERCISE LIBRARY' U4:AU4; also stray T4/U4 in copy tab | row 4 'PATTERN' | RP | equals | OBSERVED | - |
| `FUNCTIONAL` | BYOP 'MASTER EXERCISE LIBRARY' BC4:BE4 | row 4 'PATTERN' | FN | equals | OBSERVED | - |

#### G05 BYOP row 5 (sub-pattern / plane / laterality)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `TRIPPLE EXTENSION` | BYOP 'MASTER EXERCISE LIBRARY' C5:E5 | row 5 | AP.TEX | equals | OBSERVED | - |
| `JUMPING ANKLE` | BYOP 'MASTER EXERCISE LIBRARY' F5 | row 5 | AP.JMP.LK | equals | OBSERVED | = Sheet23 'JUMPING LIMITED KNEE' |
| `PLYO` | BYOP 'MASTER EXERCISE LIBRARY' G5:I5 | row 5 | AP.JMP.PLY (G, I) / AP.JMP.LK (H plate hops) | umbrella | OBSERVED | - |
| `FULL JUMPING` | BYOP 'MASTER EXERCISE LIBRARY' J5 | row 5 | AP.JMP.FULL | equals | OBSERVED | - |
| `THROWING` | BYOP 'MASTER EXERCISE LIBRARY' K5 | row 5 | AP.THR | equals | OBSERVED | - |
| `EASY TURN` | BYOP 'MASTER EXERCISE LIBRARY' L5 | row 5 | AP.COD + F.TURN=EASY_TURN (+L1) | facet | OBSERVED | - |
| `MOD. TURN` | BYOP 'MASTER EXERCISE LIBRARY' M5 | row 5 | AP.COD + F.TURN=MOD_TURN (+L2) | facet | OBSERVED | - |
| `HARD TURN` | BYOP 'MASTER EXERCISE LIBRARY' N5 | row 5 | AP.COD + F.TURN=HARD_TURN (+L3) | facet | OBSERVED | - |
| `CORE THORAX SAGITAL` | BYOP 'MASTER EXERCISE LIBRARY' O5 | row 5 | CO.CT + F.PLANE=SAG (+L1) | facet | OBSERVED | - |
| `CORE THORAX FRONTAL` | BYOP 'MASTER EXERCISE LIBRARY' P5 | row 5 | CO.CT + F.PLANE=FRO (+L2) | facet | OBSERVED | - |
| `CORE THORAX TRANSVERSE` | BYOP 'MASTER EXERCISE LIBRARY' Q5 | row 5 | CO.CT + F.PLANE=TRA (+L3) | facet | OBSERVED | - |
| `CORE PELVIS SAGITAL` | BYOP 'MASTER EXERCISE LIBRARY' R5 | row 5 | CO.CP + F.PLANE=SAG (+L1) | facet | OBSERVED | - |
| `CORE PELVIS FRONTAL` | BYOP 'MASTER EXERCISE LIBRARY' S5 | row 5 | CO.CP + F.PLANE=FRO (+L2) | facet | OBSERVED | - |
| `CORE PELVIS TRANSVERSE` | BYOP 'MASTER EXERCISE LIBRARY' T5 | row 5 | CO.CP + F.PLANE=TRA (+L3) | facet | OBSERVED | - |
| `BILATERAL SYMMETRICAL` | BYOP 'MASTER EXERCISE LIBRARY' U5:V5, X5:Y5, AA5:AB5, AD5:AF5 | row 5 | F.LAT=BS | facet | OBSERVED | upper-body spelling |
| `BILATERAL` | BYOP 'MASTER EXERCISE LIBRARY' AH5, AI5:AK5, AM5, AN5:AP5 | row 5 | F.LAT=BS | alias | OBSERVED | lower-body / shoulder spelling |
| `UNILATERAL` | BYOP 'MASTER EXERCISE LIBRARY' W5, Z5, AC5, AG5, AL5, AQ5, AR5 | row 5 | F.LAT=UL | facet | OBSERVED + COACH-ANSWER LIB-15 | AR5 on machine leg curls = copy typo (COACH-ANSWER LIB-15) |
| `(blank)` | BYOP 'MASTER EXERCISE LIBRARY' AS5, AT5, AU5 | row 5 | (no laterality on small-muscle lists) | artefact | OBSERVED | copy tab fills 'RESISTANCE' in T4/U4 |

#### G06 BYOP row 6 PURPOSE (quality or muscle)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `CARDIO` | BYOP 'MASTER EXERCISE LIBRARY' B6 (93C47D) | row 6 'PURPOSE' | F.QUALITY=AEROBIC | facet | OBSERVED | - |
| `SPEED/POWER` | BYOP 'MASTER EXERCISE LIBRARY' C6:K6 (CC4125) | row 6 'PURPOSE' | F.QUALITY=SPEED_POWER | facet | OBSERVED | - |
| `CHANGE OF DIRECTION` | BYOP 'MASTER EXERCISE LIBRARY' L6:N6 (8E7CC3) | row 6 'PURPOSE' | F.QUALITY=COD | facet | OBSERVED | - |
| `CORE` | BYOP 'MASTER EXERCISE LIBRARY' O6:T6 (93C47D) | row 6 'PURPOSE' | muscle ABS_OBLIQUES / F.QUALITY=CORE | facet | OBSERVED | - |
| `BACK` | BYOP 'MASTER EXERCISE LIBRARY' U6:Z6 (F9CB9C) | row 6 'PURPOSE' | muscle BACK (lats/upper back) | facet | OBSERVED | - |
| `SHOULDERS/TRAPS` | BYOP 'MASTER EXERCISE LIBRARY' AA6:AC6 (CC0000) | row 6 'PURPOSE' | muscles FRONT_DELTS (+SIDE_DELTS, TRAPS) | facet | OBSERVED | program slot calls it 'Chest/Shoulders' |
| `CHEST/FRONT DELTS` | BYOP 'MASTER EXERCISE LIBRARY' AD6:AG6 (93C47D) | row 6 'PURPOSE' | muscles CHEST + FRONT_DELTS | facet | OBSERVED | program slot 'Chest' |
| `SHOULDERS` | BYOP 'MASTER EXERCISE LIBRARY' AH6 (EAD1DC) | row 6 'PURPOSE' | muscle SIDE_DELTS (+REAR/FRONT by pick) | facet | OBSERVED | program slot 'Shoulders/Traps' |
| `QUADS` | BYOP 'MASTER EXERCISE LIBRARY' AI6 (FFD966), AJ6:AK6, AM6 (E06666) | row 6 'PURPOSE' | muscle QUADS | facet | OBSERVED | AI6 is yellow FFD966, AJ6:AM6 red E06666; 'red = anterior chain' is INFERRED |
| `QUADS/GLUTES` | BYOP 'MASTER EXERCISE LIBRARY' AL6 (E06666) | row 6 'PURPOSE' | muscles QUADS + GLUTES | facet | OBSERVED | - |
| `GLUTES/HAMSTRINGS` | BYOP 'MASTER EXERCISE LIBRARY' AN6:AQ6 (6D9EEB) | row 6 'PURPOSE' | muscles GLUTES + HAMSTRINGS | facet | OBSERVED | blue 6D9EEB (OBSERVED; 'posterior chain' meaning INFERRED); program slot calls AN 'Hamstring' |
| `HAMSTRINGS` | BYOP 'MASTER EXERCISE LIBRARY' AR6 (6D9EEB) | row 6 'PURPOSE' | muscle HAMSTRINGS | facet | OBSERVED | - |
| `BICEP` | BYOP 'MASTER EXERCISE LIBRARY' AS6 | row 6 'PURPOSE' | muscle BICEPS | facet | OBSERVED | - |
| `TRICEP` | BYOP 'MASTER EXERCISE LIBRARY' AT6 | row 6 'PURPOSE' | muscle TRICEPS | facet | OBSERVED | - |
| `CALVES` | BYOP 'MASTER EXERCISE LIBRARY' AU6 | row 6 'PURPOSE' | muscle CALVES | facet | OBSERVED | - |
| `MUSCLE FOCUS OPTIONS` | BYOP 'MASTER EXERCISE LIBRARY' AZ6 | row 6 'PURPOSE' | X.FOCUS | equals | OBSERVED | - |
| `CARRY` | BYOP 'MASTER EXERCISE LIBRARY' BA6 | row 6 'PURPOSE' | FN.CARRY | equals | OBSERVED | - |
| `DRAG` | BYOP 'MASTER EXERCISE LIBRARY' BB6 | row 6 'PURPOSE' | FN.DRAG | equals | OBSERVED | - |
| `ANTERIOR OBLIQUE SYSTEM` | BYOP 'MASTER EXERCISE LIBRARY' BC6 | row 6 'PURPOSE' | FN.AOS | equals | OBSERVED | - |
| `POSTERIOR OBLIQUE SYSTEM` | BYOP 'MASTER EXERCISE LIBRARY' BD6 | row 6 'PURPOSE' | FN.POS | equals | OBSERVED | - |
| `LATERAL SUBSYSTEM` | BYOP 'MASTER EXERCISE LIBRARY' BE6 | row 6 'PURPOSE' | FN.LSS | equals | OBSERVED | - |

#### G07 BYOP program PURPOSE labels (slot credit)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `Calves` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | RP.SM.CALF / muscle CALVES | equals | OBSERVED | - |
| `Quads` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscle QUADS (slots 'Bilateral KD', 'Leg Extensions') | equals | OBSERVED | - |
| `Quads/Glutes` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscles QUADS + GLUTES (slot 'Unilateral KD') | equals | OBSERVED | - |
| `Hamstring` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscles HAMSTRINGS (+GLUTES per library row 6) (slot 'Bilateral HD') | equals | OBSERVED | singular |
| `Hamstrings` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscle HAMSTRINGS (slot 'Leg Curls' -> RP.LF) | equals | OBSERVED | plural |
| `Hamstring/Glutes` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscles HAMSTRINGS + GLUTES (slot 'Unilateral HD') | equals | OBSERVED | - |
| `Back` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscle BACK (slot 'Horizontal Pull') | equals | OBSERVED | always horizontal pull |
| `Back ` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscle BACK (slot 'Vertical Pull') | equals | OBSERVED | trailing space; always vertical pull |
| `Chest` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscle CHEST (slots 'Horizontal Push', PPL 'Incline', 'Flies', 'Dips') | equals | OBSERVED | dips credit 0.5 chest / 0.5 triceps (COACH-ANSWER LIB-16) |
| `Chest/Shoulders` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscles FRONT_DELTS (+CHEST) (slot 'Vertical Push') | equals | OBSERVED | library row 6 says 'SHOULDERS/TRAPS' |
| `Shoulders/Traps` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | muscles SIDE_DELTS / REAR_DELTS (+TRAPS) (slots 'ABdution', 'Reverse Flies') | equals | OBSERVED | library row 6 says 'SHOULDERS' |
| `Bicep` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | RP.SM.BI / muscle BICEPS | equals | OBSERVED | - |
| `Tricep` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | RP.SM.TRI / muscle TRICEPS | equals | OBSERVED | - |
| `Core` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | CO (CO.CT, CO.CP or CO.CB by pick) | equals | OBSERVED | no CATEGORY; CO.CB 'both' is a confirmed region (COACH-ANSWER CAT-08); core first in the session by default (ATH-11) |
| `Cardio` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | CA | equals | OBSERVED | aesthetics/bootcamp wording |
| `Aerobic Capacity` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | CA | equals | OBSERVED | athletic wording |
| `Focus 1` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | X.FOCUS | equals | OBSERVED | - |
| `Focus 2` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | X.FOCUS | equals | OBSERVED | - |
| `Plyo` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | AP.JMP | equals | OBSERVED | - |
| `Throwing` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | AP.THR | equals | OBSERVED | - |
| `COD` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | AP.COD | equals | OBSERVED | - |
| `Tripple Extension` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | AP.TEX (+ AP.JMP.LK via C124 block) | equals | OBSERVED | typo |
| `OFF` | BYOP program tabs 00-08, PURPOSE column | slot PURPOSE (what the slot is credited to) | (rest day) | equals | OBSERVED | - |

#### G08 BYOP program CATEGORY / DETAIL labels (slot pattern)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `Bilateral KD` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.KD.BS | equals | OBSERVED | dropdown AI7:AI122 |
| `Unilateral KD` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.KD.UL | equals | OBSERVED | AL7:AL42 |
| `Leg Extensions` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.KD.ISO | equals | OBSERVED | AM7:AM9 |
| `Bilateral HD` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.HD.BS | equals | OBSERVED | AN7:AN122 |
| `Unilateral HD` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.HD.UL | equals | OBSERVED | AQ7:AQ42 (AR7:AR42 in the NO ACCESS tabs as wired; COACH-R2 R2-LIB-08: should read AQ) |
| `Leg Curls` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.LF | equals | OBSERVED | AR7:AR10; COACH-ANSWER CAT-09 |
| `Horizontal Pull` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PL.H | equals | OBSERVED | X7:X162 |
| `Vertical Pull` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PL.V | equals | OBSERVED | U7:U122 |
| `Horizontal Push` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PU.H | equals | OBSERVED | AD7:AD162 |
| `Vertical Push` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PU.V | equals | OBSERVED | AA7:AA122 |
| `Incline` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PU.M (proposed); wired to RP.PU.H list | equals | OBSERVED | PPL; AD7:AD162 |
| `Flies` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PU.H.ISO; wired to RP.PU.H list | equals | OBSERVED | PPL; AD7:AD162 |
| `Dips` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.PU.H (credit 0.5 triceps / 0.5 chest) | equals | OBSERVED + COACH-ANSWER LIB-16 | PPL; AD7:AD162; push day (LIB-16) |
| `ABdution` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.DELT.SIDE | equals | OBSERVED | typo for Abduction; AH7:AH42 |
| `Reverse Flies` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.DELT.REAR | equals | OBSERVED | PPL; AH7:AH42 |
| `Bicep` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.BI | equals | OBSERVED | AS7:AS42 |
| `Tricep` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.TRI | equals | OBSERVED | BOOTCAMP 2 only |
| `Push` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.TRI (pushdown, arm at side) | equals | OBSERVED | PPL; AT7:AT42 |
| `Overhead` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.TRI (overhead extension) | equals | OBSERVED | PPL; AT7:AT42 |
| `Calves` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | RP.SM.CALF | equals | OBSERVED | AU7:AU13 |
| `Plyo` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | AP.JMP | equals | OBSERVED | G7:G162 |
| `PLYO` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | AP.JMP | equals | OBSERVED | Tue/Fri rows; G7:G162 |
| `Throwing` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | AP.THR | equals | OBSERVED | K7:K87 |
| `COD` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | AP.COD | equals | OBSERVED | L7:L242 |
| `Tripple Extension` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | AP.TEX | equals | OBSERVED | C7:C242 |
| `(blank)` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | (Tricep, Calves, Core, Cardio, Focus rows) | equals | OBSERVED | - |
| `OFF` | BYOP program tabs 00-08, CATEGORY (PPL: DETAIL) column | slot CATEGORY / DETAIL (pattern) | (rest) | equals | OBSERVED | - |

#### G09 BYOP program day / title / tracking labels

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `Day 1 / Day 2 / Day 3 / Day 4` | BYOP program tabs 00-08 - AESTHETICS day blocks | program scaffolding | (day A = 1,3 knee+pull; B = 2,4 hip+push) | artefact | OBSERVED | - |
| `DAY 1 / DAY 2 / DAY 3` | BYOP program tabs 00-08 - 3 DAY BUILDER | program scaffolding | (D1 knee+pull, D2 hip+push, D3 mixed) | artefact | OBSERVED | - |
| `Optional` | BYOP program tabs 00-08 - AESTHETICS / 3 DAY BUILDER | program scaffolding | F.ROLE=OPTIONAL_DAY | artefact | OBSERVED | - |
| `MONDAY ... SUNDAY / Thursday / Friday / Saturday / ' '` | BYOP program tabs 00-08 - PPL, ATHLETIC, JUSTICE LEAGUE, BOOTCAMP 1, NO ACCESS | program scaffolding | (weekday) | artefact | OBSERVED | Thursday DAY cell is ' ' in ATHLETIC/JUSTICE LEAGUE |
| `1A / 2A / 3A / 1B / 2B / 3B` | BYOP program tabs 00-08 - BOOTCAMP - OPTION 2 | program scaffolding | (A/B rotation sessions) | artefact | OBSERVED | - |
| `WEEK 1` | BYOP program tabs 00-08 - all tabs with a WEEK column | program scaffolding | (only week ever written) | artefact | OBSERVED | - |
| `AESTHETICS - FULL BODY - 4 DAYS A WEEK` | BYOP program tabs 00-08 - title C1/A1 | program scaffolding | (template: physique, full body) | artefact | OBSERVED | - |
| `AESTHETICS - FULL BODY - 3 DAYS A WEEK` | BYOP program tabs 00-08 - 3 DAY BUILDER title | program scaffolding | (template) | artefact | OBSERVED | - |
| `PUSH/PULL/LEGS - 6 DAYS A WK` | BYOP program tabs 00-08 - PPL title | program scaffolding | (template) | artefact | OBSERVED | tab says '3 or 6 DAYS' |
| `ATHLETIC - FULL BODY - 4 DAYS A WEEK` | BYOP program tabs 00-08 - ATHLETIC / JUSTICE LEAGUE title | program scaffolding | (template: AP prefix + RP) | artefact | OBSERVED | JUSTICE LEAGUE uses the same title; generator name 'All-around athletic / weekend warrior (non-competitive adults and youth)' for that tab (COACH-ANSWER ATH-13; profile `weekend_warrior`) |
| `ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK` | BYOP program tabs 00-08 - NO ACCESS - ATHLETIC title | program scaffolding | (template) | artefact | OBSERVED | - |
| `BOOTCAMP - FULL BODY - 4 DAYS A WEEK` | BYOP program tabs 00-08 - BOOTCAMP 1 title | program scaffolding | (template) | artefact | OBSERVED | - |
| `BOOTCAMP OPTION 1` | BYOP program tabs 00-08 - BOOTCAMP - OPTION 2 A1 (wrong title) | program scaffolding | (template) | artefact | OBSERVED | copy error |
| `WEIGHT USED or SCORE` | BYOP program tabs 00-08 - tracking column H | program scaffolding | (free text: load, cues 'LATERAL','SINGLE ARM','OUCH') | artefact | OBSERVED + COACH-ANSWER PRG-08 | SCORE = times, rounds or distances for conditioning (PRG-08) |
| `HOW IT FELT?` | BYOP program tabs 00-08 - tracking column J | program scaffolding | F.DOSE=FEELING | artefact | OBSERVED | - |
| `DONE?` | BYOP program tabs 00-08 - tracking column K | program scaffolding | (checkbox) | artefact | OBSERVED | - |
| `LATERAL` | BYOP program tabs 00-08 - JUSTICE LEAGUE H6 (on 'DIG/OUT') | program scaffolding | F.PLANE=FRO cue for AP.COD | artefact | OBSERVED | coach cue in WEIGHT column |
| `SINGLE ARM` | BYOP program tabs 00-08 - JUSTICE LEAGUE H9 | program scaffolding | F.LAT=UL cue | artefact | OBSERVED | - |
| `OUCH` | BYOP program tabs 00-08 - JUSTICE LEAGUE H12 (on MYO SET leg extensions) | program scaffolding | (effort note) | artefact | OBSERVED | - |
| `JUSTICE LEAGUE` | BYOP tab name '04_JUSTICE_LEAGUE' | program scaffolding | (template: 'All-around athletic / weekend warrior (non-competitive adults and youth)', profile `weekend_warrior`) | artefact | OBSERVED + COACH-ANSWER ATH-13 | marketing name only (ATH-13); names must be general (FIX-03); kept only in cell citations |

#### G10 MASTER_MODEL 'Sheet23' headers (precursor bucket grid)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `FOUNDATIONAL - AP - TRIPPLE EXT ` | MASTER_MODEL 'Sheet23' B1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.TEX + L1 | equals | OBSERVED | - |
| `INTERMEDIATE - AP - TRIPPLE EXT` | MASTER_MODEL 'Sheet23' C1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.TEX + L2 | equals | OBSERVED | - |
| `ADVANCED - AP - TRIPPLE EXT` | MASTER_MODEL 'Sheet23' D1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.TEX + L3 | equals | OBSERVED | - |
| `FOUNDATINONAL - AP - JUMPING LIMITED KNEE` | MASTER_MODEL 'Sheet23' E1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.JMP.LK + L1 | equals | OBSERVED | - |
| `FOUNDATINONAL - AP - PLYOS` | MASTER_MODEL 'Sheet23' F1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.JMP.PLY + L1 | equals | OBSERVED | - |
| `INTERMEDIATE - AP - JUMPING LIMITED KNEE` | MASTER_MODEL 'Sheet23' G1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.JMP.LK + L2 | equals | OBSERVED | - |
| `INTERMEDIATE - AP - PLYOS` | MASTER_MODEL 'Sheet23' H1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.JMP.PLY + L2 | equals | OBSERVED | - |
| `ADVANCED - AP -JUMPING` | MASTER_MODEL 'Sheet23' I1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.JMP.FULL + L3 | equals | OBSERVED | - |
| `AP - THROWING` | MASTER_MODEL 'Sheet23' J1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.THR + L0 | equals | OBSERVED | - |
| `FOUNDATIONAL - AP - COD` | MASTER_MODEL 'Sheet23' K1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.COD + L1 | equals | OBSERVED | - |
| `INTERMEDIATE - AP - COD` | MASTER_MODEL 'Sheet23' L1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.COD + L2 | equals | OBSERVED | - |
| `ADVANCED - AP - COD` | MASTER_MODEL 'Sheet23' M1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | AP.COD + L3 | equals | OBSERVED | - |
| `FOUNDATIONAL - CT - SAGITAL` | MASTER_MODEL 'Sheet23' N1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | CO.CT + SAG + L1 | equals | OBSERVED | - |
| `INTERMEDIATE - CT - FRONTAL` | MASTER_MODEL 'Sheet23' O1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | CO.CT + FRO + L2 | equals | OBSERVED | - |
| `ADVANCED - CT - TRANSVERSE` | MASTER_MODEL 'Sheet23' P1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | CO.CT + TRA + L3 | equals | OBSERVED | - |
| `FOUNDATIONAL - CP - SAGITAL` | MASTER_MODEL 'Sheet23' Q1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | CO.CP + SAG + L1 | equals | OBSERVED | - |
| `INTERMEDIATE - CP - FRONTAL` | MASTER_MODEL 'Sheet23' R1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | CO.CP + FRO + L2 | equals | OBSERVED | - |
| `ADVANCED - CP - TRANSVERSE` | MASTER_MODEL 'Sheet23' S1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | CO.CP + TRA + L3 (empty column) | equals | OBSERVED | - |
| `FOUNDATIONAL - RP - BS - VERTICAL PULL` | MASTER_MODEL 'Sheet23' T1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PL.V.BS + L1 | equals | OBSERVED | - |
| `ADVANCED - RP - BS - VERTICAL PULL` | MASTER_MODEL 'Sheet23' U1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PL.V.BS + L3 | equals | OBSERVED | - |
| `FOUNDATIONAL - RP - BS - VERTICAL PUSH` | MASTER_MODEL 'Sheet23' V1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.V.BS + L1 | equals | OBSERVED | - |
| `ADVANCED - RP - BS - VERTICAL PUSH` | MASTER_MODEL 'Sheet23' W1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.V.BS + L3 | equals | OBSERVED | - |
| `RP - BS - FOUNDATIONAL- HORIZONTAL PUSH` | MASTER_MODEL 'Sheet23' X1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.H.BS + L1 | equals | OBSERVED | - |
| `RP - BS - INTERMEDIATE - HORIZONTAL PUSH` | MASTER_MODEL 'Sheet23' Y1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.H.BS + L2 | equals | OBSERVED | - |
| `RP - BS - ADVANCED HORIZONTAL PUSH` | MASTER_MODEL 'Sheet23' Z1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.H.BS + L3 | equals | OBSERVED | - |
| `RP - BS - HORIZONTAL PULL` | MASTER_MODEL 'Sheet23' AA1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PL.H.BS + L1 (inferred) | equals | OBSERVED | - |
| `RP-BS-ADVANCED HORIZONTAL PULL` | MASTER_MODEL 'Sheet23' AB1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PL.H.BS + L3 | equals | OBSERVED | - |
| `RP - BS - KNEE DOMINANT` | MASTER_MODEL 'Sheet23' AC1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.KD.BS + L1 (inferred) | equals | OBSERVED | - |
| `RP-BS-KNEE DOMINANT-INTERMIDIATE` | MASTER_MODEL 'Sheet23' AD1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.KD.BS + L2 | equals | OBSERVED | - |
| `RP-BS-KNEE DOMINANT -ADVANCED` | MASTER_MODEL 'Sheet23' AE1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.KD.BS + L3 | equals | OBSERVED | - |
| `RP - BS - HIP DOMINANT` | MASTER_MODEL 'Sheet23' AF1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.HD.BS + L1 (inferred) | equals | OBSERVED | - |
| `RP-BS-HIP DOMINANT-INTERMIDIATE` | MASTER_MODEL 'Sheet23' AG1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.HD.BS + L2 | equals | OBSERVED | - |
| `RP-BS-HIP DOMINANT-ADVANCED` | MASTER_MODEL 'Sheet23' AH1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.HD.BS + L3 | equals | OBSERVED | - |
| `RP - UL - VERTICAL PULL` | MASTER_MODEL 'Sheet23' AI1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PL.V.UL + L0 | equals | OBSERVED | - |
| `RP - UL - VERTICAL PUSH` | MASTER_MODEL 'Sheet23' AJ1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.V.UL + L0 | equals | OBSERVED | - |
| `RP - UL - HORIZONTAL PUSH` | MASTER_MODEL 'Sheet23' AK1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PU.H.UL + L0 | equals | OBSERVED | - |
| `RP - UL - HORIZONTAL PULL` | MASTER_MODEL 'Sheet23' AL1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.PL.H.UL + L0 | equals | OBSERVED | - |
| `RP - UL - KNEE DOMINANT` | MASTER_MODEL 'Sheet23' AM1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.KD.UL + L0 | equals | OBSERVED | - |
| `RP - UL - HIP DOMINANT` | MASTER_MODEL 'Sheet23' AN1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.HD.UL + L0 | equals | OBSERVED | - |
| `RP - BICEP` | MASTER_MODEL 'Sheet23' AO1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.SM.BI | equals | OBSERVED | - |
| `RP - TRICEP` | MASTER_MODEL 'Sheet23' AP1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.SM.TRI | equals | OBSERVED | - |
| `RP -SHOULDERS` | MASTER_MODEL 'Sheet23' AQ1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.SM.DELT | equals | OBSERVED | - |
| `RP - CALVES` | MASTER_MODEL 'Sheet23' AR1 | flat bucket header LEVEL-FAMILY-[SYMMETRY]-PATTERN | RP.SM.CALF | equals | OBSERVED | - |
| `ZONE` | MASTER_MODEL 'Sheet23' A1 | zone / speed keys | F.ZONE_SENSES=ZONE_BAND (INFERRED v1: Davidson zones as a level band) | artefact | OBSERVED | COACH-ANSWER CAT-10: the zones come from Pat Davidson's book; reading the band as zone = level colour is INFERRED |
| `ZONE 1` | MASTER_MODEL 'Sheet23' A2:A9 | zone / speed keys | F.ZONE_SENSES=ZONE_BAND (green B6D7A8; INFERRED v1: Davidson zone as level band) | artefact | OBSERVED | COACH-ANSWER CAT-10: the zones come from Pat Davidson's book; reading the band as zone = level colour is INFERRED |
| `ZONE 2` | MASTER_MODEL 'Sheet23' A10:A16 | zone / speed keys | F.ZONE_SENSES=ZONE_BAND (yellow FFF2CC; INFERRED v1: Davidson zone as level band) | artefact | OBSERVED | COACH-ANSWER CAT-10: the zones come from Pat Davidson's book; reading the band as zone = level colour is INFERRED |
| `ZONE 3` | MASTER_MODEL 'Sheet23' A17:A28 | zone / speed keys | F.ZONE_SENSES=ZONE_BAND (red F4CCCC; INFERRED v1: Davidson zone as level band) | artefact | OBSERVED | COACH-ANSWER CAT-10: the zones come from Pat Davidson's book; reading the band as zone = level colour is INFERRED |
| `Plyo` | MASTER_MODEL 'Sheet23' D33 | zone / speed keys | AP.JMP (title of the plyo execution-method key; not a zone, CAT-11) | equals | OBSERVED + COACH-ANSWER CAT-11 | - |
| `ZONE 1 / Receive pause/creat` | MASTER_MODEL 'Sheet23' C34:D34 | zone / speed keys | F.PMETHOD=RECEIVE_PAUSE | facet | OBSERVED + COACH-ANSWER CAT-10/CAT-11 | not a zone - plyo execution method (CAT-11) |
| `ZONE 2 / Receive/create` | MASTER_MODEL 'Sheet23' C35:D35 | zone / speed keys | F.PMETHOD=RECEIVE_CREATE | facet | OBSERVED + COACH-ANSWER CAT-10/CAT-11 | not a zone (CAT-11) |
| `ZONE 3  / Repeat receive create` | MASTER_MODEL 'Sheet23' C36:D36 | zone / speed keys | F.PMETHOD=REPEAT_RC | facet | OBSERVED + COACH-ANSWER CAT-10/CAT-11 | not a zone (CAT-11) |
| `*FASTEST SSC*` | MASTER_MODEL 'Sheet23' B43 | zone / speed keys | F.SSC=FASTEST (squirrel jumps; AP.JMP.FULL) | facet | OBSERVED | - |
| `*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)` | MASTER_MODEL 'Sheet23' B47 | zone / speed keys | F.SSC=FAST (AP.SPD.MECH, AP.SPD.ACC; X.PREP) | facet | OBSERVED | - |
| `*SPRINT*` | MASTER_MODEL 'Sheet23' B51 | zone / speed keys | F.SSC=SPRINT (AP.SPD.MAXV) | facet | OBSERVED | - |
| `✅ MACH DRILLS` | MASTER_MODEL 'Sheet23' B48 | zone / speed keys | AP.SPD.MECH | equals | OBSERVED | - |
| `✅ Acceleration starts` | MASTER_MODEL 'Sheet23' B49 | zone / speed keys | AP.SPD.ACC | equals | OBSERVED | - |
| `loose list ('Depth Drops ', 'Broad Jumps', 'Tuck Jumps ', 'SL Box Jumps', 'Squat Jumps w/ Medicine Ball ')` | MASTER_MODEL 'Sheet23' G31:G35 | zone / speed keys | AP.JMP (track unassigned) | part | OBSERVED | - |

#### G11 MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS' headers & variables

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `UNDER CONSTRUCTION` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A1 | taxonomy header / variable | (status) | artefact | OBSERVED | - |
| `LOWER BODY MECHANICS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A5 | taxonomy header / variable | F.REGION=LOWER (RP.KD, RP.HD) | facet | OBSERVED | - |
| `UPPER BODY MECHANICS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E5 | taxonomy header / variable | F.REGION=UPPER (RP.PU, RP.PL, RP.SM) | facet | OBSERVED | - |
| `KNEE DOMINANT` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A6 | taxonomy header / variable | RP.KD | equals | OBSERVED | - |
| `VERTICAL PUSH` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E6 | taxonomy header / variable | RP.PU.V | equals | OBSERVED | - |
| `MID RANGE PUSH` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' G6 | taxonomy header / variable | RP.PU.M | equals | OBSERVED | - |
| `HORIZONTAL PUSH` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' I6 | taxonomy header / variable | RP.PU.H | equals | OBSERVED | - |
| `SHOULDERS/BICEP/TRICEP` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' K6 | taxonomy header / variable | RP.SM | equals | OBSERVED | - |
| `VIDEO` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' B6, D6, F6, H6, J6, L6, B60, D60 | taxonomy header / variable | (video column) | artefact | OBSERVED | - |
| `BILATERAL SAGITAL -SEE CHEAT SHEET  *ALL ABOUT SQUATS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A7 | taxonomy header / variable | RP.KD.BS + F.PLANE=SAG | equals | OBSERVED | - |
| `UNILATERAL SAGITAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C7 | taxonomy header / variable | RP.KD.UL + F.PLANE=SAG | equals | OBSERVED | - |
| `BILATERAL SAGITAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E7 / G7 / I7 | taxonomy header / variable | RP.PU.V.BS / RP.PU.M / RP.PU.H.BS + SAG | equals | OBSERVED | - |
| `SHOULDERS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' K7 | taxonomy header / variable | RP.SM.DELT | equals | OBSERVED | - |
| `FEET POSITIONING VARIATIONS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C9 | taxonomy header / variable | F.STANCE (lunge stances) | facet | OBSERVED | - |
| `HALF KNEELING VARIATIONS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E16 | taxonomy header / variable | F.STANCE=HK_* (empty) | facet | OBSERVED | - |
| `HAND PLACEMENT` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' I16 | taxonomy header / variable | F.GRIP | facet | OBSERVED | - |
| `GET INTO THE HIP VARIATIONS - MODERATE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C19 | taxonomy header / variable | F.LOADLAT=CONTRA + F.LEVEL=L2 | facet | OBSERVED | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip |
| `GET OUT OF THE HIP - MODERATE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C21 | taxonomy header / variable | F.LOADLAT=IPSI + F.LEVEL=L2 | facet | OBSERVED | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip |
| `GET INTO THE HIP VARIATIONS - HARDER` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C23 | taxonomy header / variable | F.LOADLAT=CONTRA + F.LOADPOS=FRONT_RACK + L3 | facet | OBSERVED | - |
| `GET OUT OF THE HIP VARIATIONS - HARDER` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C25 | taxonomy header / variable | F.LOADLAT=IPSI + F.LOADPOS=FRONT_RACK + L3 | facet | OBSERVED | - |
| `LOW/MID LOADING VARIATION` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C27 | taxonomy header / variable | F.LOADPOS in {COUNTER, GOBLET, SIDES} | facet | OBSERVED | - |
| `HIGH LOADING VARIATION` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C31 | taxonomy header / variable | F.LOADPOS in {HIGH_ZERCHER .. OVERHEAD} (barbell) | facet | OBSERVED | - |
| `FEET POSITION` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' I22 | taxonomy header / variable | F.BODYPOS | facet | OBSERVED | - |
| `BICEPS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' K23 | taxonomy header / variable | RP.SM.BI | equals | OBSERVED | - |
| `TRICEPS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' K31 | taxonomy header / variable | RP.SM.TRI | equals | OBSERVED | - |
| `UNILATERAL SAGITAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' I29 | taxonomy header / variable | RP.PU.H.UL | equals | OBSERVED | - |
| `SPECIALTY VARIATIONS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A32 | taxonomy header / variable | RP.KD.BS (SSB, pinned, overhead, sissy) + F.LEVEL=L3 | part | OBSERVED | - |
| `SINGLE LEG` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C37 | taxonomy header / variable | RP.KD.UL (pistol / single-leg squat) | part | OBSERVED | - |
| `Leg Extensiona` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A38 | taxonomy header / variable | RP.KD.ISO | alias | OBSERVED | - |
| `BILATERAL FRONTAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A46 | taxonomy header / variable | RP.KD.BS + F.PLANE=FRO (+F.PERTURB=ADDUCT; HIP_BAND dormant) | facet | OBSERVED | hip-band squats dormant (EQ-01); 'Hold between knees Squats' joins the main library (COACH-ANSWER LIB-20) |
| `UNILATERAL FRONTAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C46 | taxonomy header / variable | RP.KD.UL + F.PLANE=FRO | facet | OBSERVED | - |
| `BILATERAL FRONTAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E46 / G46 / I46 | taxonomy header / variable | RP.PU.* + F.PLANE=FRO (empty) | facet | OBSERVED | - |
| `BILATERAL TRANSVERSE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A53 | taxonomy header / variable | RP.KD.BS + F.PLANE=TRA (F.PERTURB=STRAP removed) | facet | OBSERVED | the only items were the strap squats, removed (COACH-ANSWER LIB-09): block empty |
| `UNLATERAL TRANSVERSE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C53 | taxonomy header / variable | RP.KD.UL + F.PLANE=TRA (empty) | facet | OBSERVED | - |
| `BILATERAL TRANSVERSE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E53 / G53 / I53 | taxonomy header / variable | RP.PU.* + F.PLANE=TRA (empty) | facet | OBSERVED | - |
| `HIP DOMINANT` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A59 | taxonomy header / variable | RP.HD | equals | OBSERVED | - |
| `VERTICAL PULL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E59 | taxonomy header / variable | RP.PL.V | equals | OBSERVED | - |
| `HORIZONTAL PULL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' G59 | taxonomy header / variable | RP.PL.H | equals | OBSERVED | - |
| `BILATERAL SAGITAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A60 / E60 / G60 | taxonomy header / variable | RP.HD.BS / RP.PL.V.BS / RP.PL.H.BS + SAG | equals | OBSERVED | - |
| `UNILATERAL SAGITAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C60 | taxonomy header / variable | RP.HD.UL + SAG | equals | OBSERVED | - |
| `BILATERAL LOADING` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C61 | taxonomy header / variable | RP.HD.UL + F.LAT=STAG + F.LOADLAT=DOUBLE | facet | OBSERVED | - |
| `UNILATERAL LOADING ` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C70 | taxonomy header / variable | RP.HD.UL + F.LOADLAT in {CONTRA, IPSI} | facet | OBSERVED | - |
| `GET INTO THE HIP VARIATIONS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C71 | taxonomy header / variable | F.LOADLAT=CONTRA | facet | OBSERVED | COACH-ANSWER CAT-13 |
| `GET OUT OF THE HIP` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C73 | taxonomy header / variable | F.LOADLAT=IPSI | facet | OBSERVED | COACH-ANSWER CAT-13 |
| `UNILATERAL SAGITAL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' G73 | taxonomy header / variable | RP.PL.H.UL | equals | OBSERVED | - |
| `POWERLIFTING Speacialty LIFT ` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A75 | taxonomy header / variable | RP.HD.BS (sumo) + F.STANCE=SUMO + L3 | part | OBSERVED | - |
| `UNLATERAL TRANSVERSE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' C76 | taxonomy header / variable | RP.HD.UL + F.PLANE=TRA (contralateral split-stance swings) | facet | OBSERVED | - |
| `SPEED SPECIALS` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A77 | taxonomy header / variable | RP.HD.BS + F.INTENT=BALLISTIC (KB swings) | part | OBSERVED | KB swings: ballistic, 0 muscle sets (COACH-R2 R2-VOL-05) |
| `**SEE MORE IN BALLISTICS&PLYOS or ALL ABOUT LUNGES` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A80 | taxonomy header / variable | (link) | artefact | OBSERVED | - |
| `ROM VARIABLE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A81 | taxonomy header / variable | F.ROM | facet | OBSERVED | - |
| `STANCES` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' G82 | taxonomy header / variable | F.STANCE (SPLIT_CONTRA, HK_SAME, HK_OPP) | facet | OBSERVED | - |
| `END RANGE BEHAVIOR VARIABLE` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A86 | taxonomy header / variable | F.END | facet | OBSERVED | - |
| `LOADING VARIABLES` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A90 | taxonomy header / variable | F.ACCOM (DORMANT) | facet | OBSERVED + COACH-ANSWER EQ-12 | variable resistance dormant (EQ-01, EQ-12) |
| `Elevated / Floor / Deficit / *RDL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A82 / A83 / A84 / A85 | taxonomy header / variable | F.ROM=ELEVATED / FLOOR / DEFICIT / RDL | facet | OBSERVED | - |
| `Dead stop / Touch & go / *RDL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A87 / A88 / A89 | taxonomy header / variable | F.END=DEAD_STOP / TOUCH_GO / RDL | facet | OBSERVED | - |
| `WEIGHT RELEASERS / CHAINS / BANDS / *RDL` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A91 / A92 / A93 / A94 | taxonomy header / variable | F.ACCOM=RELEASERS / CHAINS / BANDS (all DORMANT) / (RDL) | facet | OBSERVED + COACH-ANSWER EQ-12 | dormant future axis (EQ-01, EQ-12) |
| `supinated / neutral / pronated / wide grip / narrow grip` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' I17:I21 | taxonomy header / variable | F.GRIP=SUP / NEU / PRO / WIDE / NARROW | facet | OBSERVED | - |
| `feet on bench / feet on wall / feet on raisers or plates / feet on floor / feet in air (hollow bent legs) / feet in air (hollow legs str8)` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' I23:I28 | taxonomy header / variable | F.BODYPOS=FEET_* | facet | OBSERVED | - |
| `Split stance ALWAYS contralateral / Half kneeling same side leg up / Half kneeling opposite side leg up` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' G83 / G84 / G85 | taxonomy header / variable | F.STANCE=SPLIT_CONTRA / HK_SAME / HK_OPP | facet | OBSERVED | - |
| `TEST FORMULA` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A110 | taxonomy header / variable | (random picker prototype =INDEX(...RANDBETWEEN...)) | artefact | OBSERVED | - |
| `Whats that strap rotating in / Whats that strap rotating out` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A54 / A55 | taxonomy header / variable | F.PERTURB=STRAP (removed) | facet | OBSERVED + COACH-ANSWER LIB-09 | removed: 'you can take that one away' |
| `Lat pull unders` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' E67 | item under VERTICAL PULL | RP.PL.V.ISO | alias | OBSERVED + COACH-ANSWER LIB-09 | = lat pull-over |
| `Kong Rows` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' G77 | item under HORIZONTAL PULL | RP.PL.H.BS | part | OBSERVED + COACH-ANSWER LIB-09 | double-KB row from the floor; low stimulus; shoulder / back pain |
| `banded leg extensions on bench` | MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY' A40 | item under Leg Extensiona | RP.KD.ISO + F.IMPL=BAND (DORMANT) | part | OBSERVED + COACH-ANSWER EQ-08 | out of scope: 'I don't want any bands in the program' |

#### G12 MASTER_MODEL 'CONTROL PATTERNSCORE'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `CONTROL PATTERNS` | MASTER_MODEL 'CONTROL PATTERNSCORE' A1 | core grid axis | CO | equals | OBSERVED | - |
| `CORE` | MASTER_MODEL 'CONTROL PATTERNSCORE' A2 | core grid axis | CO | equals | OBSERVED | - |
| `TRANSVERSE` | MASTER_MODEL 'CONTROL PATTERNSCORE' A4 | core grid axis | F.PLANE=TRA | facet | OBSERVED | - |
| `SAGITAL` | MASTER_MODEL 'CONTROL PATTERNSCORE' H4 | core grid axis | F.PLANE=SAG | facet | OBSERVED | - |
| `FRONTAL` | MASTER_MODEL 'CONTROL PATTERNSCORE' O4 | core grid axis | F.PLANE=FRO | facet | OBSERVED | - |
| `DYNAMIC` | MASTER_MODEL 'CONTROL PATTERNSCORE' B5 / I5 / P5 | core grid axis | F.CMODE=DYN | facet | OBSERVED | - |
| `STATIC` | MASTER_MODEL 'CONTROL PATTERNSCORE' E5 / L5 / S5 | core grid axis | F.CMODE=STA | facet | OBSERVED | - |
| `CORE THORAX` | MASTER_MODEL 'CONTROL PATTERNSCORE' A7 / H7 / O7 | core grid axis | CO.CT | equals | OBSERVED | - |
| `CORE PELVIS` | MASTER_MODEL 'CONTROL PATTERNSCORE' A18 / H18 / O18 | core grid axis | CO.CP | equals | OBSERVED | - |
| `BOTH` | MASTER_MODEL 'CONTROL PATTERNSCORE' A29 / H28 / O28 | core grid axis | CO.CB | equals | OBSERVED | confirmed region (COACH-ANSWER CAT-08) |
| `single side carry` | MASTER_MODEL 'CONTROL PATTERNSCORE' B10 | item filed TRANSVERSE / CORE THORAX / DYNAMIC | CO.CT + TRA + DYN (and FN.CARRY) | conflict | OBSERVED | carry also has its own BYOP column BA |
| `Toes to bar / Knees to chest` | MASTER_MODEL 'CONTROL PATTERNSCORE' I18:I19 | item filed SAGITAL / CORE PELVIS / DYNAMIC | CO.CP (PROPOSED by the coach rule; cross-list CO.CT) | conflict | OBSERVED + COACH-ANSWER CAT-08 | BYOP files them CORE THORAX (O15:O16); coach: toes to bar is 'a little bit more complicated' - pending |

#### G13 MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' (ballistics & medball)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `BALLISTICS & PLYOS` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A2 | ballistics theory | AP.JMP + AP.THR + AP.UBP | umbrella | OBSERVED | - |
| `DYNAMIC MEDBALL WARMUP DRILLS` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A4 | ballistics theory | X.PREP (medball reach x lunge/squat base) | equals | OBSERVED | - |
| `BILATERAL` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A5 | ballistics theory | X.PREP + F.LAT=BS (two-hand reach) | facet | OBSERVED | - |
| `KNEE DOMINANT BILATERAL` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' B5 | ballistics theory | X.PREP + RP.KD.BS base | facet | OBSERVED | - |
| `KNEE DOMINANT UNILATERAL` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' C5 | ballistics theory | X.PREP + RP.KD.UL base | facet | OBSERVED | - |
| `**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' C21 | ballistics theory | F.PHASE=P3 rule | facet | OBSERVED | - |
| `BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A22 | ballistics theory | F.INTENT=BALLISTIC | facet | OBSERVED | = longer ground contact (COACH-ANSWER ATH-01, CAT-10) |
| `*I USE THESE FOR MUSCULAR FORCE PRODUCTION` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A23 | ballistics theory | F.INTENT=BALLISTIC | facet | OBSERVED | - |
| `PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D22 | ballistics theory | F.INTENT=PLYOMETRIC | facet | OBSERVED | = shorter ground contact (COACH-ANSWER ATH-01, CAT-10) |
| `*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D23 | ballistics theory | F.INTENT=PLYOMETRIC | facet | OBSERVED | - |
| `TAKING IN FORCES` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A24 | ballistics theory | F.PHASE=P1 | facet | OBSERVED | - |
| `DELIVER FORCES FAST` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' B24 | ballistics theory | F.PHASE=P2 | facet | OBSERVED | - |
| `AMORTIZATION OF FORCES` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' C24 | ballistics theory | F.PHASE=P3 | facet | OBSERVED | - |
| `REBOUNDING ` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D24 | ballistics theory | F.PHASE=P4 | facet | OBSERVED | - |
| `MEDBALL CHEAT SHEET` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A51 | ballistics theory | AP.THR | equals | OBSERVED | - |
| `DESCRIPTION` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D51 | ballistics theory | (pattern tag column) | artefact | OBSERVED | - |
| `BILATERAL SYMETRICAL PUSH` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D53 | ballistics theory | AP.THR.BS + F.LAT=BS + PUSH | equals | OBSERVED | - |
| `BILATERAL SYMETRICAL PULL DOWN` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D54 | ballistics theory | AP.THR.BS + PULL DOWN | equals | OBSERVED | - |
| `CORE THORAX ` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D55:D58 | ballistics theory | AP.THR.ROT + CO.CT link + F.PLANE=TRA | equals | OBSERVED | - |
| `BILATERAL SYMETRICAL KNEE DOMINANT & PUSH` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D59 | ballistics theory | AP.THR.INT (+RP.KD.BS base) | equals | OBSERVED | - |
| `TRANSVERSE PULL DOWN` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D60 | ballistics theory | AP.THR.ROT + F.PLANE=TRA | equals | OBSERVED | - |
| `PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D61:D62 | ballistics theory | AP.THR.INT + F.STANCE=STEP | equals | OBSERVED | - |
| `PROPULSIVE STEP WITH BILATERAL SYMETRICAL PULL DOWN` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D63:D64 | ballistics theory | AP.THR.INT + F.STANCE=STEP | equals | OBSERVED | - |
| `INTO THE LEFT LEG/HIP` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D65 | ballistics theory | AP.THR.HIP + F.LOADLAT=CONTRA-like (hip direction INTO, left) | equals | OBSERVED | COACH-ANSWER CAT-13 semantics: into the hip |
| `OUT OF THE RIGHT LEG/HIP` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D66 | ballistics theory | AP.THR.HIP + OUT (right) | equals | OBSERVED | - |
| `OUT OF THE LEFT LEG/HIP` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D67 | ballistics theory | AP.THR.HIP + OUT (left) | equals | OBSERVED | - |
| `INTO THE RIGHT LEG/HIP` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D68 | ballistics theory | AP.THR.HIP + INTO (right) | equals | OBSERVED | - |
| `TRANSVERSE CORE THORAX` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D69 | ballistics theory | AP.THR.TRUNK + TRA | equals | OBSERVED | - |
| `BILATERAL CORE THORAX` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D70:D71 | ballistics theory | AP.THR.TRUNK + BS | equals | OBSERVED | - |
| `SPECIALTIES` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' C72 | ballistics theory | AP.THR.SPEC | equals | OBSERVED | - |
| `FRONTAL PULL DOWN` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D73 | ballistics theory | AP.THR.SPEC + FRO | equals | OBSERVED | - |
| `TRANSVERSE INTO THE HIP` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D74:D75 | ballistics theory | AP.THR.SPEC + TRA + INTO | equals | OBSERVED | - |
| `UNILATERAL OUT OF HIP` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D76 | ballistics theory | AP.THR.SPEC + UL + OUT | equals | OBSERVED | - |
| `HIP DOMINANT PUSH` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' D77 | ballistics theory | AP.THR.SPEC (+RP.HD base) | equals | OBSERVED | - |
| `CORE EXTRAS` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' C82 | ballistics theory | CO (medball core: ab rolls, v-ups, plank rockers, hanging knees/toes to bar) | equals | OBSERVED | - |
| `STICK THE LANDING ... / HOP ON TO / DOUBLE BOUNCE / DROP ... / REPEAT ... / REVERSE BANDED ...` | MASTER_MODEL '(NOT DONE) ALL ABOUT BALLISTICS' A30/A32 etc. | ballistics theory | AP.JMP + F.PHASE + F.PMETHOD + F.LAT (+ F.ACCOM, DORMANT) | facet | OBSERVED | reverse-banded rows out of scope (EQ-01, EQ-12) |

#### G14 MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LIFTING'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `TEACHING/ LEARNING THE SKILL` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A4 | olympic progression | AP.TEX | equals | OBSERVED | - |
| `PROGRESSION MODEL EASY TO HARD` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A5 | olympic progression | AP.TEX level driver | equals | OBSERVED | - |
| `CLEANS` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A6 | olympic progression | AP.TEX.PWR + AP.TEX.SQ (clean) | equals | OBSERVED | - |
| `JERK` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A14 | olympic progression | AP.TEX.JERK | equals | OBSERVED | - |
| `SNATCH` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A19 | olympic progression | AP.TEX.PWR + AP.TEX.SQ (snatch) | equals | OBSERVED | - |
| `... FROM THE HIGH HANG / MID HANG (KNEE) / LOW HANG (BELLOW KNEE) / FLOOR` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A7:A10 / A21:A24 | olympic progression | F.OLY=HIGH_HANG / MID_HANG / LOW_HANG / FLOOR + POWER | equals | OBSERVED | - |
| `HANG SQUAT CLEAN / LOW HANG SQUAT CLEAN / SQUAT CLEAN / HIGH HANG SQUAT SNATCH / LOW HANG SQUAT SNATCH / SQUAT SNATCH` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A11:A13 / A28:A30 | olympic progression | AP.TEX.SQ + F.OLY=SQUAT | equals | OBSERVED | - |
| `OH PRESS / OH PUSH PRESS / OH PUSH JERK / OH SPLIT JERK` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A15:A18 | olympic progression | AP.TEX.JERK ladder | equals | OBSERVED | - |
| `STANDING DROP POWER SNATCH / STANDING DROP OVERHEAD SQUAT` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A20 / A27 | olympic progression | AP.TEX (receive-speed drills) | equals | OBSERVED | - |
| `OVERHEAD BOX SQUAT / OVERHEAD SQUAT` | MASTER_MODEL '(NOT DONE) ALL ABOUT OLYMPIC LI' A25:A26 | olympic progression | AP.TEX.SQ depth prep (and F.LOADPOS=OVERHEAD) | equals | OBSERVED | - |

#### G15 MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `*LUNGES are a UNILATERAL KNEE DOMINANT MOVEMENT` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' A3 | lunge variable grammar | RP.KD.UL | facet | OBSERVED | - |
| `Lunges are a propulsive strategy ` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' A8 | lunge variable grammar | RP.KD.UL (propulsive) | facet | OBSERVED | - |
| `Stance loads the FRONT TO BACK` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' A17 | lunge variable grammar | F.STANCE -> F.PLANE=SAG demand | facet | OBSERVED | - |
| `Load position loads UP/DOWN & SIDE2SIDE` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' A18 | lunge variable grammar | F.LOADPOS + F.LOADLAT -> FRO demand | facet | OBSERVED | - |
| `Movement orientations/guidance loads AROUND` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' A19 | lunge variable grammar | F.ORIENT -> TRA demand | facet | OBSERVED | - |
| `LOADING` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' C21 | lunge variable grammar | F.LOADPOS x F.LOADLAT | facet | OBSERVED | - |
| `PROPULSION` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' E21 | lunge variable grammar | F.STANCE (FFE / FLOOR / RFE) | facet | OBSERVED | - |
| `Front/back / Lateral` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' A22 / A23 | lunge variable grammar | F.ORIENT=FB / LAT | facet | OBSERVED | - |
| `Contralateral Suitcase / Ipsilateral Suitcase / Duble suitcase / Contralateral on shoulder / Ipsilateral on shoulder / Double handed on shoulders / Contralateral High zercher / Ipsilateral high zercher / Double handed high zercher / Zercher barbell / Front racked barbell / Back racked barbell` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' C22:C33 | lunge variable grammar | F.LOADLAT (CONTRA/IPSI/DOUBLE) x F.LOADPOS (SIDES/SHOULDER/HIGH_ZERCHER/ZERCHER/FRONT_RACK/BACK) | facet | OBSERVED | - |
| `FFE / FLOOR / RFE` | MASTER_MODEL '(NOT DONE) ALL ABOUT LUNGES' E22:E24 | lunge variable grammar | F.STANCE=FFE / FLOOR / RFE | facet | OBSERVED | - |

#### G16 MASTER_MODEL 'AGILITYCOD PATTERNS' and '(NOT DONE) ATHLETIC PATTERNS EX'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `Change of Direction ` | MASTER_MODEL 'AGILITYCOD' A1 | athletic category list | AP.COD | equals | OBSERVED | - |
| `Agility: Reactive in nature - Incognitive Competence` | MASTER_MODEL 'AGILITYCOD' D1 | athletic category list | AP.AGI | equals | OBSERVED | - |
| `COD: Proactive in nature - Cognitive Competence` | MASTER_MODEL 'AGILITYCOD' D2 | athletic category list | AP.COD | equals | OBSERVED | - |
| `HOPS IN PLACE` | MASTER_MODEL 'AGILITYCOD' A5 | athletic category list | AP.JMP.LK | equals | OBSERVED | - |
| `KRUMRIE FORMATION / MUNOZ FORMATION` | MASTER_MODEL 'AGILITYCOD' A7 / C7 | athletic category list | AP.COD (formation drills; undefined) | part | OBSERVED | - |
| `EIGHT SQUARE PLYOMETRIC FORMATION / FOUR SQUARE FORMATION` | MASTER_MODEL 'AGILITYCOD' E7 / H7 | athletic category list | AP.JMP.LK (multi-directional hop grids) | part | OBSERVED | - |
| `RUNNING ROUTES / ROUTE TREE` | MASTER_MODEL 'AGILITYCOD' A12 / A14 | athletic category list | AP.COD (the BYOP COD items are receiver routes) | equals | OBSERVED | - |
| `TRIPPLE EXTENSIONS` | MASTER_MODEL 'ATHLETIC PATTERNS EX' J5 | athletic category list | AP.TEX | alias | OBSERVED | - |
| `CHANGE OF DIRECTION` | MASTER_MODEL 'ATHLETIC PATTERNS EX' N5 | athletic category list | AP.COD | equals | OBSERVED | - |
| `THROWING` | MASTER_MODEL 'ATHLETIC PATTERNS EX' A8 | athletic category list | AP.THR | equals | OBSERVED | - |
| `Jumping` | MASTER_MODEL 'ATHLETIC PATTERNS EX' A10 | athletic category list | AP.JMP | equals | OBSERVED | - |

#### G17 MASTER_MODEL 'ALL ABOUT SQUATS'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `SQUATS & KNEE DOMINANT MOVEMENTS` | MASTER_MODEL 'ALL ABOUT SQUATS' A1 | squat theory | RP.KD (esp. RP.KD.BS) | equals | OBSERVED | - |
| `EASIEST / EASIER / EASY / MODERATE / HARD / HARDER / HARDEST / VERY HARD ` | MASTER_MODEL 'ALL ABOUT SQUATS' A10:H11 | squat theory | F.LOADPOS rank 1-8 (posture difficulty, NOT F.LEVEL) | facet | OBSERVED | - |
| `SPECIAL LOADING VARIATION` | MASTER_MODEL 'ALL ABOUT SQUATS' H8 | squat theory | F.LOADPOS=OVERHEAD | facet | OBSERVED | - |
| `HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+` | MASTER_MODEL 'ALL ABOUT SQUATS' A13 | squat theory | F.QUALITY=HYPERTROPHY (dose menu) | facet | OBSERVED | - |
| `STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+` | MASTER_MODEL 'ALL ABOUT SQUATS' D13 | squat theory | F.QUALITY=STRENGTH (dose menu) | facet | OBSERVED | - |
| `ATHLETIC FOCUSED WORKOUTS` | MASTER_MODEL 'ALL ABOUT SQUATS' G13 | squat theory | F.QUALITY=SPEED_POWER (dose menu) | facet | OBSERVED | - |
| `OFF SEASON / FRENCH CONTRAST` | MASTER_MODEL 'ALL ABOUT SQUATS' G15 / G16 | squat theory | F.SEASON=OFF SEASON + complex method (RP.KD.BS -> AP.JMP) | facet | OBSERVED + COACH-ANSWER ATH-12 | contrast / complexes: intermediate+ athletes, off-season only, heavy lift at about 78-85 %, no rest within the complex (ATH-12) |
| `MYO SET / **MYO SET - ADVANCED` | MASTER_MODEL 'ALL ABOUT SQUATS' C27 ('**MYO SET - ADVANCED', 3 x '15/5/5/5/5/5' in A27:B27) / A30 (definition) | squat theory | F.DOSE=REPS 'MYO SET' (+F.CLIENT=C3) | facet | OBSERVED | - |
| `BANDED/CHAINED SQUAT VARIATIONS` | MASTER_MODEL 'ALL ABOUT SQUATS' A33 | squat theory | F.ACCOM (DORMANT) | facet | OBSERVED + COACH-ANSWER EQ-12 | dormant (EQ-01, EQ-12) |
| `BOTTOM BANDED / REVERSE BANDED / BOTTOM CHAINS / WEIGHT RELEASERS` | MASTER_MODEL 'ALL ABOUT SQUATS' A35 / A37 / A39 / A41 | squat theory | F.ACCOM=BANDS / REV_BANDS / CHAINS / RELEASERS (all DORMANT) | facet | OBSERVED + COACH-ANSWER EQ-12 | dormant (EQ-01, EQ-12) |
| `LEG PRESS / HACK SQUAT / V-SQUAT / PENDULUM` | MASTER_MODEL 'ALL ABOUT SQUATS' G35 / G37 / G39 / G41 | squat theory | RP.KD.BS machines (sheet opinions kept as history; not ranked - COACH-ANSWER EQ-11; V-squat excluded) | part | OBSERVED + COACH-ANSWER EQ-11 | hack squat and leg press more constrained than Smith (EQ-11) |
| `HEAVY BARBELL / LIGHT BARBELL ` | MASTER_MODEL 'ALL ABOUT SQUATS' A44 / A47 | squat theory | F.INTENT (heavy = slow eccentric, more recruitment) | facet | OBSERVED | - |

#### G18 MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `AEROBIC CAPACITY WORK` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A1 | aerobic system | CA | equals | OBSERVED | - |
| `BEGGINER WORKOUTS /  INTERMEDIATE WORKOUTS /  ADVANCED WORKOUTS` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A8 / D8 / G8 | aerobic system | F.CLIENT=C1 / C2 / C3 | level | OBSERVED | - |
| `INTENSITY/PACE` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' C9 / F9 / I9 | aerobic system | F.PACE | facet | OBSERVED | - |
| `EASY / MODERATE / FAST / FASTEST / SPRINT` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' C10:I21 | aerobic system | F.PACE values | facet | OBSERVED | - |
| `A / B / C` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A24 / B24 / C24 | aerobic system | CA.A / CA.B / CA.C | equals | OBSERVED | - |
| `Short Duration  / Moderate Duration / Long Duration` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A25 / B25 / C25 | aerobic system | CA.A / CA.B / CA.C | equals | OBSERVED | - |
| `High Intensity / Moderate Intensity / Low intensity` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A26 / B26 / C26 | aerobic system | CA.A / CA.B / CA.C | equals | OBSERVED | - |
| `  LACTATE CLEARANCE ` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' G23 | aerobic system | CA.LC | equals | OBSERVED | - |
| `RUNNING WARMUP` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' E23 | aerobic system | X.PREP + AP.SPD.MECH | equals | OBSERVED | - |
| `A March / A Skip / A Runs / Bilateral forward hops / Bilateral backward hops / Single leg in place hops / Falling start accelerations` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' F26:F32 | aerobic system | AP.SPD.MECH x3, AP.JMP.LK x3, AP.SPD.ACC | part | OBSERVED | - |
| `CHEAT SHEET` | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' B23 | aerobic system | (header) | artefact | OBSERVED | - |

#### G19 MASTER_MODEL 'Sheet25' (leg-day slot sketch)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `BILATERAL HIP DOMINANT` | MASTER_MODEL 'Sheet25' B11 | slot header | RP.HD.BS | equals | OBSERVED | - |
| `UNILATERAL KNE DOMINANT` | MASTER_MODEL 'Sheet25' E11 | slot header | RP.KD.UL | alias | OBSERVED | - |
| `LEG FLEXION` | MASTER_MODEL 'Sheet25' H11 | slot header | RP.LF | equals | OBSERVED + COACH-ANSWER CAT-09 | the coach's own name for the new node (CAT-09) |
| `BILATERAL KNEE DOMINANT` | MASTER_MODEL 'Sheet25' J11 | slot header | RP.KD.BS | equals | OBSERVED | - |

#### G20 MASTER_MODEL 'BASEBALL' (Parts, slot codes, legend, tags)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `RESISTANCE PATTERNS` | MASTER_MODEL 'BASEBALL' A19 | baseball program grammar | RP | equals | OBSERVED | legend |
| `COMPOUND` | MASTER_MODEL 'BASEBALL' B19 | baseball program grammar | F.XCLASS=BIG_COMP (rep column) | facet | OBSERVED | - |
| `SMALLER ISOLATIONS` | MASTER_MODEL 'BASEBALL' C19 | baseball program grammar | F.XCLASS=SMALL_ISO / F.SIZE=SMALL | facet | OBSERVED | the coach's own 'smaller muscles' term |
| `ATHLETIC PATTERNS` | MASTER_MODEL 'BASEBALL' E19 | baseball program grammar | AP | equals | OBSERVED | - |
| `VOL 1 / VOL 2 / VOL 3` | MASTER_MODEL 'BASEBALL' A20:A22 | baseball program grammar | F.VOL=VOL1 / VOL2 / VOL3 | facet | OBSERVED | - |
| `SPEED ENDURANCE '>40 Secs' / SPEED POWER '10-39 Secs' / SPEED STRENGTH & POWER '0-12 Secs'` | MASTER_MODEL 'BASEBALL' E20:F22 | baseball program grammar | F.EZONE=SE / SP / SSP | facet | OBSERVED | - |
| `Part A` | MASTER_MODEL 'BASEBALL' A28 etc. | baseball program grammar | F.ROLE=PRIMER (athletic block) | facet | OBSERVED | - |
| `Part B` | MASTER_MODEL 'BASEBALL' A30 etc. | baseball program grammar | F.ROLE=CORE_BLOCK | facet | OBSERVED | BASEBALL puts core after the Part A power block; that placement is not the default: core comes first by default, movable (COACH-ANSWER ATH-11, NOT RIGHT on the Part B reading) |
| `OPTIONAL PIECE` | MASTER_MODEL 'BASEBALL' CI33 etc. | baseball program grammar | F.ROLE=OPTIONAL_OLY | facet | OBSERVED | - |
| `Part C` | MASTER_MODEL 'BASEBALL' A33 etc. | baseball program grammar | F.ROLE=MAIN + SECONDARY (bilateral lower + upper compound superset) | facet | OBSERVED | - |
| `Part D` | MASTER_MODEL 'BASEBALL' A36 etc. | baseball program grammar | F.ROLE=UNILATERAL + ISOLATION (tri-set) | facet | OBSERVED | - |
| `Part E` | MASTER_MODEL 'BASEBALL' Part E rows | baseball program grammar | F.ROLE=FINISHER | facet | OBSERVED | - |
| `PART C / PART D` | MASTER_MODEL 'BASEBALL' AY68 / AY71 | baseball program grammar | (stray labels) | artefact | OBSERVED | - |
| `Upper Ballistics/plyo` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | AP.THR (mostly) + AP.UBP | umbrella | OBSERVED | Mon/Thu Part A |
| `LOWER ballistics/plyo` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | AP.JMP (+AP.JMP.LK, AP.SPD) | umbrella | OBSERVED | Tue/Fri Part A |
| `LATERAL CORE` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | CO + F.PLANE=FRO | facet | OBSERVED | Mon Part B |
| `Transverse core` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | CO + F.PLANE=TRA | facet | OBSERVED | Tue/Fri Part B |
| `Sagital core` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | CO + F.PLANE=SAG | facet | OBSERVED | Thu Part B; typo |
| `OLY` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | AP.TEX (hang clean / hang snatch @ %) | equals | OBSERVED | - |
| `bkd` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.KD.BS | equals | OBSERVED | - |
| `bhd` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.HD.BS | equals | OBSERVED | - |
| `ukd` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.KD.UL | equals | OBSERVED | - |
| `uhd` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.HD.UL (often filled with RP.LF curls) | equals | OBSERVED | - |
| `horiz pull` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.PL.H | equals | OBSERVED | - |
| `horiz push` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.PU.H | equals | OBSERVED | - |
| `vert pull` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.PL.V | equals | OBSERVED | - |
| `vert push` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.PU.V | equals | OBSERVED | - |
| `bicep / biceps` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.SM.BI | alias | OBSERVED | - |
| `tricep / triceps` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.SM.TRI | alias | OBSERVED | about 20-22% filled with push-up/dip variants (recount: 8 of 40 filled 'tricep'/'triceps' slots as printed) |
| `calfs / calf / CALF` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.SM.CALF (~43% filled with AP.JMP.LK ankle hops: 17 of 40 after label re-alignment, 16 of 40 as printed) | alias | OBSERVED | ankle hops are athletic exposure, not calf sets (COACH-ANSWER VOL-10); calves 3 sets every leg day (VOL-17) |
| `shoulders` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | RP.SM.DELT (recount: 12 of 40 filled slots, 30%, hold presses, rows, high pulls or DB snatches; 14 of 40, 35%, if push-ups and shoulder taps are added) | equals | OBSERVED | - |
| `Buy out` | MASTER_MODEL 'BASEBALL' label cols | baseball program grammar | CA.BUY (+F.EZONE=SP) | equals | OBSERVED | - |
| `Speed / strength / speed` | MASTER_MODEL 'BASEBALL' P40/T40/AB40 etc. | baseball program grammar | F.DAYINTENT=SPEED / STRENGTH / SPEED (main lower lift) | facet | OBSERVED | Thursday untagged in the sheet; Thursday = strength (COACH-ANSWER PRG-09) |
| `PART B 4X / PART C 4x / PART D 4X / SUPER SET 4X / 3x super set / 2x / 4x / 5x / 3 each side / 3 or 4 / Accumulate` | MASTER_MODEL 'BASEBALL' sets cells | baseball program grammar | F.DOSE=SETS (round counts) | facet | OBSERVED | - |
| `PRE SEASON / IN SEASON / PLAYOFFS / POST SEASON / OFF SEASON / SOFT SEASON / FALL BALL / SOFT OFF SEASON / PITCHERS/CATCHERS / POSITIONS / PEAK / DELOAD / OFF` | MASTER_MODEL 'BASEBALL' rows 4-17 | baseball program grammar | F.SEASON values | facet | OBSERVED | - |
| `BLOCK 1 / BLOCK 2 / BLOCK 3` | MASTER_MODEL 'BASEBALL' A24 / A41 / A59 | baseball program grammar | (mesocycle) | artefact | OBSERVED | - |
| `DELOAD WEEK` | MASTER_MODEL 'BASEBALL' DU42 | baseball program grammar | F.WEEKTYPE=DELOAD WEEK | facet | OBSERVED | - |
| `DONE / done / ' DONE'` | MASTER_MODEL 'BASEBALL' week grids | baseball program grammar | (delivery marker) | artefact | OBSERVED | - |

#### G21 MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `AEROBIC C.` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | CA (F.QUALITY=AEROBIC) | equals | OBSERVED | - |
| `SKILL` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | X.SKILL | equals | OBSERVED | - |
| `STRENGTH` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | F.QUALITY=STRENGTH (RP main lifts) | facet | OBSERVED | - |
| `POWER / POWER ` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | AP.TEX (F.QUALITY=SPEED_POWER) | equals | OBSERVED | - |
| `RESISTANCE` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | F.QUALITY=HYPERTROPHY (RP accessories) | facet | OBSERVED | - |
| `WODs / WODS` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | CA.WOD | equals | OBSERVED | - |
| `TEST/PEAK` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:A17 | CrossFit quality x level grammar | X.TEST | equals | OBSERVED | - |
| `FULL TIME / HALF TIME` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A19 / Q19 | CrossFit quality x level grammar | F.CLIENT population (FULL TIME = competitor, HALF TIME = class member; COACH-ANSWER PRG-10) | facet | OBSERVED + COACH-ANSWER PRG-10 | the missing 4th track is still unknown |
| `LVL 1 .. LVL 5 = ...` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A20:E24, Q20:U25 | CrossFit quality x level grammar | F.CLIENT=C1..C4 per quality | level | OBSERVED | - |
| `LVL 1 = C / LVL 2 = C, B / LVL 3 = C,B, A / LVL 4 = LACTATE CLERANCE` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' D21:D24 | CrossFit quality x level grammar | CA.C / +CA.B / +CA.A / CA.LC | level | OBSERVED | - |
| `AEROBIC CAP.` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' D20 / T20 | CrossFit quality x level grammar | CA | alias | OBSERVED | - |
| `KNEE DOM` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | RP.KD.BS (squat strength) | equals | OBSERVED | - |
| `HIP DOM` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | RP.HD.BS (deadlift strength) | equals | OBSERVED | - |
| `PULL` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | RP.PL (plane not named) | umbrella | OBSERVED | - |
| `PUSH` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | RP.PU (plane not named) | umbrella | OBSERVED | - |
| `LB` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | F.REGION=LOWER accessory (RP.KD.UL/RP.HD.UL/ISO - INFERRED) | umbrella | OBSERVED | - |
| `UB` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | F.REGION=UPPER accessory | umbrella | OBSERVED | - |
| `SNATCH / CLEAN` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | AP.TEX (snatch / clean) | equals | OBSERVED | - |
| `T2B/ DUBS` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | X.SKILL = CO.CP (toes to bar) + AP.JMP.LK (double-unders) | umbrella | OBSERVED | - |
| `H.S./ DUBS` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | X.SKILL = RP.PU.V (handstand) + AP.JMP.LK | umbrella | OBSERVED | - |
| `YES / TYES / OFF` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | (scheduled / typo / rest) | artefact | OBSERVED | - |
| `MON / TUESD / WED / THURS / FRID / SAT / SUN` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' monthly grids | CrossFit quality x level grammar | (weekday) | artefact | OBSERVED | - |
| `CLASS PROGRAMMING SPLIT / EXAMPLE CROSSFIT STYLE PROGRAMMING MODEL` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' P1 / R2 | CrossFit quality x level grammar | (template) | artefact | OBSERVED | - |
| `WARMUP/SKILL / STRENGTH/POWER / WOD` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' R3 / S3 / T3 | CrossFit quality x level grammar | X.PREP+X.SKILL / F.QUALITY=STRENGTH+AP.TEX / CA.WOD | umbrella | OBSERVED | - |
| `STRNGTH / PWR / SKILLS / AEROBIC CAPACITY` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' P13:P16 | CrossFit quality x level grammar | F.QUALITY=STRENGTH / AP.TEX / X.SKILL / CA | equals | OBSERVED | - |
| `SQUAT / PRESS / DEADLIFT / SNATCH / CLEAN / DUBS / GYMNASTICS` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' Q12:V15 | CrossFit quality x level grammar | RP.KD.BS / RP.PU.V / RP.HD.BS / AP.TEX / AP.TEX / AP.JMP.LK / X.SKILL | equals | OBSERVED | - |
| `WK 1 .. WK 8; '1/1' .. '4/4', '5' (date-coerced)` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' Q4:S11 | CrossFit quality x level grammar | strength level / power level per week (INFERRED) | level | OBSERVED | - |
| `COMPETE CROSSFIT SPLIT / EVENT DATE JAN 12-15th / EXAMPLE PLAN BUILDING FOR WODAPALOOZA` | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A1 / I1 / A2 | CrossFit quality x level grammar | (template) | artefact | OBSERVED | - |

#### G22 MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' + '(NOT DONE) EXAMPLE CONJUGATE'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `STRENGTH / conjugate style training` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' A3 / C3 | track / slot-role grammar | track: F.QUALITY=STRENGTH (conjugate) | facet | OBSERVED | - |
| `AESTHETICS / bodybuilding style` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' A30 / C30 | track / slot-role grammar | track: F.QUALITY=HYPERTROPHY | facet | OBSERVED | - |
| `HYBRID / strenght - athletic - crossfitish training` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' A69 / C69 | track / slot-role grammar | track: AP + RP + CA | facet | OBSERVED | - |
| `the work` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' M9:M24 (CC4125) | track / slot-role grammar | F.ROLE=MAIN | facet | OBSERVED | - |
| `the accessory` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' M10.. (CC0000) | track / slot-role grammar | F.ROLE=SECONDARY (opposite dominance) | facet | OBSERVED | - |
| `the nuance` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' M11.. (E69138) | track / slot-role grammar | F.ROLE=UNILATERAL (variation / weak point) | facet | OBSERVED | - |
| `the survival` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' M12.. (F1C232) | track / slot-role grammar | F.ROLE=ISOLATION | facet | OBSERVED | - |
| `M.E.` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' N9 / N13 | track / slot-role grammar | F.INTENT=MAX_STRENGTH | facet | OBSERVED | - |
| `FAST RPE6 or about 60-70%` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' N17 / N21 | track / slot-role grammar | F.INTENT=SPEED_STRENGTH | facet | OBSERVED | - |
| `LOAD: 1RIR / 2RIR / MAX / ALL / EASY / 1-2 RIR` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D col | track / slot-role grammar | F.DOSE=LOAD_WORDS | facet | OBSERVED | - |
| `(D)BOX / (T&G)BOX` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' exercise cells | track / slot-role grammar | F.END=DEAD_STOP / TOUCH_GO + F.ROM=BOX | facet | OBSERVED | - |
| `FFE CONTRA LUNGES / FFE IPSI LUNGES / RFE CONTRA LUNGES / RFE IPSI LUNGES / RFE & FFE LUNGES` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' exercise cells | track / slot-role grammar | RP.KD.UL + F.STANCE x F.LOADLAT | facet | OBSERVED | - |
| `ACCESSORIES` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' exercise cells | track / slot-role grammar | X.FOCUS | equals | OBSERVED | - |
| `PUSH / LEGS / PULL` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' M38 / M43 / M49 / M54 / M64 | track / slot-role grammar | day type: RP.PU+RP.SM.TRI+DELT / RP.KD+RP.HD / RP.PL+RP.SM.BI+DELT | umbrella | OBSERVED | - |
| `A WEEK / B WEEK / BWEEK / A WEEK LOWER` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' row 33 | track / slot-role grammar | F.WEEKTYPE | facet | OBSERVED | - |
| `MID DELOAD / DELOAD WEEK / DELOAD / TEST` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' U3 / L35 / L17, L21 / L9, L13 (N3:T3 holds the % row); CONJUGATE J3, L13:L25 | track / slot-role grammar | F.WEEKTYPE | facet | OBSERVED | - |
| `STRENGTH` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B74/B81/B86/B98 | track / slot-role grammar | F.ROLE=MAIN (HYBRID) | facet | OBSERVED | - |
| `KD / KD REPS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' C74/C98 | track / slot-role grammar | RP.KD.BS | equals | OBSERVED | - |
| `KD` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' C86 | track / slot-role grammar | RP.HD.BS (label slip on deadlifts) | conflict | OBSERVED | - |
| `PUSH` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' C81 | track / slot-role grammar | RP.PU.H (bench) | equals | OBSERVED | - |
| `OLY/ POWER` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B75/B82/B87/B93/B99 | track / slot-role grammar | AP.TEX (cleans/snatches) and AP.JMP ('JUMPS') | umbrella | OBSERVED | - |
| `UNI HD` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B76/B94 | track / slot-role grammar | RP.HD.UL (tri-set with CO + RP.HD.UL bridge / RP.PU.V) | equals | OBSERVED | - |
| `HOR PULL` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B77 | track / slot-role grammar | RP.PL.H | alias | OBSERVED | - |
| `UNI KD/ HOR ROW` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B88 | track / slot-role grammar | RP.KD.UL + RP.PL.H (tri-set + core) | umbrella | OBSERVED | - |
| `OH PUSH` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B95 | track / slot-role grammar | RP.PU.V | alias | OBSERVED | - |
| `UNI KD` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B100 | track / slot-role grammar | RP.KD.UL | alias | OBSERVED | - |
| `FB  / VEr pull/ hor push` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B101 / C101 | track / slot-role grammar | F.REGION=WHOLE circuit: RP.PL.V + RP.PU.H (+CO.CP T2B) | umbrella | OBSERVED | - |
| `A/C` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' B80 / B92 | track / slot-role grammar | CA | alias | OBSERVED | - |
| `SPEED` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D80 | track / slot-role grammar | CA.A (sprint intervals 15-30 s) | equals | OBSERVED | - |
| `DISTANCE` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D92 | track / slot-role grammar | CA.C ('15-40 min constant cardo easy') | equals | OBSERVED | - |
| `SQUATS / DEADLIFTS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D74/D86/D98 | track / slot-role grammar | RP.KD.BS / RP.HD.BS | equals | OBSERVED | - |
| `CLEANS / SNATCHES` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D75/D87 | track / slot-role grammar | AP.TEX | equals | OBSERVED | - |
| `JUMPS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D82/D93 | track / slot-role grammar | AP.JMP | equals | OBSERVED | - |
| `UNI RDLs / UNI RDLS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D76/D94 | track / slot-role grammar | RP.HD.UL | equals | OBSERVED | - |
| `LUNGES/ ROWS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D88 | track / slot-role grammar | RP.KD.UL + RP.PL.H | umbrella | OBSERVED | - |
| `STEP UPS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D100 | track / slot-role grammar | RP.KD.UL | equals | OBSERVED | - |
| `BENCH PRESS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D81 | track / slot-role grammar | RP.PU.H | equals | OBSERVED | - |
| `OH press` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D95 | track / slot-role grammar | RP.PU.V | equals | OBSERVED | - |
| `DB ROWS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D77 | track / slot-role grammar | RP.PL.H | equals | OBSERVED | - |
| `UPPER ACCESORY` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D78/D90 | track / slot-role grammar | X.FOCUS (upper) | equals | OBSERVED | - |
| `LOWER ACCESORY` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D83/D96 | track / slot-role grammar | X.FOCUS (lower) | equals | OBSERVED | - |
| `AMRAP / SETS / REPS` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D70 / D71 / D72 | track / slot-role grammar | CA.CIRC (AMRAP minutes - INFERRED) / F.DOSE | facet | OBSERVED | - |
| `CONJUGATE SPLIT / 8 WEEK CYCLE / TEST` | MASTER_MODEL '(NOT DONE) EXAMPLE CONJUGATE' A2/F2/J3 | track / slot-role grammar | (template; week-6 TEST unexplained) | artefact | OBSERVED | - |
| `Pull under / pull under` | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' O48:V48, O64:V64 | track / slot-role grammar | RP.PL.V.ISO | alias | OBSERVED + COACH-ANSWER LIB-09 | 'really called a pull over' (lat pull-over) |

#### G23 MASTER_MODEL gym templates (UL, PPL, FAT BURN)

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `UPPER / LOWER SPLIT` | MASTER_MODEL UL A1 | gym template grammar | (template) | artefact | OBSERVED | - |
| `PUSH / PULL / LEGS SPLIT` | MASTER_MODEL PPL A1 | gym template grammar | (template) | artefact | OBSERVED | - |
| `NOVICE / NEWBY / INTERMEDIATE` | MASTER_MODEL UL/PPL | gym template grammar | F.CLIENT=C1 / C2 / C3 (dose tiers; same exercises) | level | OBSERVED + COACH-ANSWER PRG-05 | renamed Level 1 / 2 / 3 by column position; as words, novice and newbie mean the same kind of beginner (PRG-05) |
| `ADAY / BDAY / CDAY` | MASTER_MODEL UL/PPL | gym template grammar | (day codes) | artefact | OBSERVED | - |
| `LOWER BODY WORKOUT / UPPER BODY WORKOUT` | MASTER_MODEL UL | gym template grammar | F.REGION=LOWER / UPPER day | facet | OBSERVED | - |
| `PUSH DAY WORKOUT / PULL DAY WORKOUT / LEG DAY WORKOUT` | MASTER_MODEL PPL | gym template grammar | day type push / pull / legs | facet | OBSERVED | - |
| `HELP` | MASTER_MODEL UL/PPL | gym template grammar | (link to 'ALL ABOUT SQUATS') | artefact | OBSERVED | - |
| `Basic Instruction:` | MASTER_MODEL UL/PPL A3 | gym template grammar | (rules block: 1-3 RIR, cardio Wed/Sat, pain rule) | artefact | OBSERVED | - |
| `Any Cardio Equipment` | MASTER_MODEL UL/PPL | gym template grammar | X.PREP (5-min general warm-up; CA.C modality) | equals | OBSERVED | - |
| `A March / A Skip / A Run` | MASTER_MODEL UL/PPL | gym template grammar | AP.SPD.MECH | equals | OBSERVED | - |
| `KB Book openers ` | MASTER_MODEL PPL | gym template grammar | CO.CT (thoracic rotation) / X.PREP | equals | OBSERVED | - |
| `MUSCLE BUILDING` | MASTER_MODEL FAT BURN B4 | gym template grammar | F.QUALITY=HYPERTROPHY (RP block) | facet | OBSERVED | - |
| `CIRCUITS RECCOMENDED` | MASTER_MODEL FAT BURN B36 | gym template grammar | CA.CIRC | equals | OBSERVED + COACH-ANSWER PRG-11 | a finisher after lifting, not a separate session (PRG-11) |
| `30-40 mi slow/steady CARDIO` | MASTER_MODEL FAT BURN / 4 TRACKS | gym template grammar | CA.C ('mi' = minutes, INFERRED) | equals | OBSERVED | - |
| `WK 1 / WK2 / WK3 / WK4` | MASTER_MODEL FAT BURN | gym template grammar | (weeks) | artefact | OBSERVED | - |

#### G24 MASTER_MODEL 'EXAMPLE ATHLETIC FULL BODY SPLI' + 'EXAMPLE BOXING 8 WEEK BUILD UP'

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `ATHLETIC FULL BODY SPLIT` | MASTER_MODEL ATHLETIC A1 | athletic example grammar | (template) | artefact | OBSERVED | - |
| `STARTING OFF SEASON WORKOUTS /  MID OFF SEASON WORKOUTS /  ADVANCED OFF SEASON WORKOUTS` | MASTER_MODEL ATHLETIC A9 / D9 / H9 | athletic example grammar | F.CLIENT=C1 / C2 / C3 (+F.SEASON=OFF SEASON) | level | OBSERVED | - |
| `WORKOUT` | MASTER_MODEL ATHLETIC | athletic example grammar | (session header) | artefact | OBSERVED | - |
| `*MEDBALLS / ALL LIST / SEE LIST` | MASTER_MODEL ATHLETIC/BOXING | athletic example grammar | AP.THR (whole 19-throw list) | equals | OBSERVED | - |
| `MED BALL VARIATIONS` | MASTER_MODEL BOXING F50 | athletic example grammar | AP.THR | equals | OBSERVED | - |
| `SUPERSET: / Superset` | MASTER_MODEL ATHLETIC/BOXING | athletic example grammar | (pairing) | facet | OBSERVED | - |
| `HEAVY / HEAVY: / Heavy` | MASTER_MODEL ATHLETIC/BOXING | athletic example grammar | F.INTENT=MAX_STRENGTH | facet | OBSERVED | - |
| `(MID WEIGHT)` | MASTER_MODEL ATHLETIC | athletic example grammar | F.DOSE=LOAD_WORDS | facet | OBSERVED | - |
| `FAST` | MASTER_MODEL ATHLETIC/BOXING | athletic example grammar | F.INTENT=SPEED_STRENGTH / AP | facet | OBSERVED | - |
| `20 on/ 10 off - TABATA TIMER / TIME BASED` | MASTER_MODEL ATHLETIC C30 / B30 (A30 = 'TABATA') | athletic example grammar | CA.CIRC (core Tabata) | equals | OBSERVED | - |
| `unbroken / UNBROKEN` | MASTER_MODEL BOXING | athletic example grammar | F.DOSE=LOAD_WORDS (continuous) | facet | OBSERVED | - |
| `IPSILATERAL loading / contralateral` | MASTER_MODEL ATHLETIC/BOXING | athletic example grammar | F.LOADLAT=IPSI / CONTRA | facet | OBSERVED | COACH-ANSWER CAT-13 semantics and use cases (F.LOADLAT) |
| `(FULL RANGE OF MOTION)` | MASTER_MODEL BOXING | athletic example grammar | F.ROM=FULL | facet | OBSERVED | - |
| `(REVERSE BANDED)` | MASTER_MODEL BOXING | athletic example grammar | F.ACCOM=REV_BANDS (on plyos; DORMANT) | facet | OBSERVED + COACH-ANSWER EQ-12 | out of scope (EQ-01, EQ-12) |
| `BLAZE CAMP FIGHTER -  8 WEEK BUILD UP ` | MASTER_MODEL BOXING A1 | athletic example grammar | (template; striking-sport example) | artefact | OBSERVED | - |
| `MONDAY / TUESDAY / THURSDAY / FRIDAY OFF SEASON WORK` | MASTER_MODEL BOXING E4/E16/E28/E41 | athletic example grammar | F.SEASON=OFF SEASON | facet | OBSERVED | - |
| `Week 1 .. Week 8 (yellow -> light red -> red -> dark red)` | MASTER_MODEL BOXING | athletic example grammar | (week intensity heat map) | artefact | OBSERVED | - |
| `First 8 weeks (8wk1) adaptation focus: ...` | MASTER_MODEL ATHLETIC A41:A45 | athletic example grammar | (block intent notes) | artefact | OBSERVED | - |

#### G25 Sibling decode codes (analysis/ files) -> canonical

| Label (verbatim) | Where | Context | Maps to | Relation | Evidence | Note |
|---|---|---|---|---|---|---|
| `RP_BKD` | analysis/programs/* bucket | analyst code | RP.KD.BS | alias | ANALYST | - |
| `RP_UKD` | programs | analyst code | RP.KD.UL | alias | ANALYST | - |
| `ISO_QUAD` | programs | analyst code | RP.KD.ISO | alias | ANALYST | - |
| `RP_BHD` | programs | analyst code | RP.HD.BS | alias | ANALYST | - |
| `RP_UHD` | programs | analyst code | RP.HD.UL | alias | ANALYST | - |
| `ISO_HAM` | programs | analyst code | RP.LF | alias | ANALYST | - |
| `ISO_LEG_FLEXION` | 10_equipment_model.json (v1 bucket code) | analyst code | RP.LF | alias | ANALYST + COACH-ANSWER CAT-09 | v1 sibling code for the LEG FLEXION segment |
| `RP_HPUSH` | programs | analyst code | RP.PU.H (incline presses -> RP.PU.M under the proposal) | alias | ANALYST | - |
| `RP_VPUSH` | programs | analyst code | RP.PU.V | alias | ANALYST | - |
| `RP_HPULL` | programs | analyst code | RP.PL.H | alias | ANALYST | - |
| `RP_VPULL` | programs | analyst code | RP.PL.V | alias | ANALYST | - |
| `ISO_CHEST` | programs | analyst code | RP.PU.H.ISO | alias | ANALYST | - |
| `ISO_SIDE_REAR_DELT` | programs | analyst code | RP.SM.DELT (.SIDE / .REAR / .FRONT by exercise) | alias | ANALYST | - |
| `ISO_DELT` | programs | analyst code | RP.SM.DELT | alias | ANALYST | - |
| `ISO_BICEP` | programs | analyst code | RP.SM.BI | alias | ANALYST | - |
| `ISO_TRICEP` | programs | analyst code | RP.SM.TRI | alias | ANALYST | - |
| `ISO_CALF` | programs | analyst code | RP.SM.CALF | alias | ANALYST | - |
| `ISO_LAT` | programs | analyst code | RP.PL.V.ISO | alias | ANALYST | - |
| `RP_VPULL_PULLOVER` | programs | analyst code | RP.PL.V.ISO | alias | ANALYST | - |
| `RP_UHD_BRIDGE` | programs | analyst code | RP.HD.UL (single-leg bridge) | alias | ANALYST | - |
| `RP_HPUSH_TRI` | programs | analyst code | RP.PU.H (triceps credit) | alias | ANALYST | - |
| `RP_BHD_HYPER` | programs | analyst code | RP.HD.BS (back extension) | alias | ANALYST | - |
| `AP_PLYO` | programs | analyst code | AP.JMP.PLY / AP.JMP.FULL | alias | ANALYST | - |
| `AP_PLYO_UPPER` | programs | analyst code | AP.UBP | alias | ANALYST | - |
| `AP_JUMP_LIMITED_KNEE` | programs | analyst code | AP.JMP.LK | alias | ANALYST | - |
| `AP_THROW` | programs | analyst code | AP.THR | alias | ANALYST | - |
| `AP_COD` | programs | analyst code | AP.COD | alias | ANALYST | - |
| `AP_SPRINT` | programs | analyst code | AP.SPD | alias | ANALYST | - |
| `AP_TRIPLE_EXT` | programs | analyst code | AP.TEX | alias | ANALYST | - |
| `CT_CORE_THORAX` | programs | analyst code | CO.CT | alias | ANALYST | - |
| `CP_CORE_PELVIS` | programs | analyst code | CO.CP | alias | ANALYST | - |
| `CORE_OTHER` | programs | analyst code | CO.CB (mostly 'BOTH' items) or unspecified CO | alias | ANALYST | - |
| `CORE_CT_or_CP` | programs | analyst code | CO.CT \| CO.CP | alias | ANALYST | - |
| `COND_AEROBIC` | programs | analyst code | CA.A / CA.B / CA.C / CA.LC | alias | ANALYST | - |
| `COND_SPRINT_BUYOUT` | programs | analyst code | CA.BUY (sprint intervals -> CA.A) | alias | ANALYST | - |
| `FUNCTIONAL` | programs | analyst code | FN | alias | ANALYST | - |
| `FOCUS` | programs | analyst code | X.FOCUS | alias | ANALYST | - |
| `NONE_PRESCRIBED` | programs | analyst code | (empty slot) | alias | ANALYST | - |
| `bilateral_knee_dominant / unilateral_knee_dominant / knee_extension_isolation` | analysis/library/L4_slot_wiring.md sec.3 | analyst code | RP.KD.BS / RP.KD.UL / RP.KD.ISO | alias | ANALYST | - |
| `bilateral_hip_dominant / unilateral_hip_dominant / knee_flexion_isolation` | L4_slot_wiring | analyst code | RP.HD.BS / RP.HD.UL / RP.LF | alias | ANALYST | - |
| `horizontal_pull / vertical_pull / horizontal_push / vertical_push` | L4_slot_wiring; L2 category_canonical | analyst code | RP.PL.H / RP.PL.V / RP.PU.H / RP.PU.V | alias | ANALYST | - |
| `shoulder_abduction_raises / side_raises_shoulder_isolation` | L4_slot_wiring; L2 | analyst code | RP.SM.DELT | alias | ANALYST | - |
| `biceps / triceps / calves` | L4_slot_wiring | analyst code | RP.SM.BI / RP.SM.TRI / RP.SM.CALF | alias | ANALYST | - |
| `plyometrics / throws / change_of_direction / triple_extension` | L4_slot_wiring | analyst code | AP.JMP / AP.THR / AP.COD / AP.TEX | alias | ANALYST | - |
| `core_thorax / core_pelvis` | L2 category_canonical | analyst code | CO.CT / CO.CP | alias | ANALYST | - |
| `muscle_focus (specialisation)` | L4_slot_wiring | analyst code | X.FOCUS | alias | ANALYST | - |
| `cardio` | L4_slot_wiring | analyst code | CA | alias | ANALYST | - |
| `PLYOS / TRIPLE EXTENSION / CARDIO / THROWING / CHANGE OF DIRECTION` | L1 category_canonical | analyst code | AP.JMP / AP.TEX / CA / AP.THR / AP.COD | alias | ANALYST | - |
| `triple_extension_lifts / jumping_limited_knee (ankle) / jumping_limited_knee (plate hops) / plyos (landing / box) / plyos (hurdles) / full_jumping` | L1 progression_track | analyst code | AP.TEX / AP.JMP.LK / AP.JMP.LK / AP.JMP.PLY / AP.JMP.PLY / AP.JMP.FULL | alias | ANALYST | - |
| `BILATERAL KNEE DOMINANT / UNILATERAL KNEE DOMINANT / LEG EXTENSIONS / BILATERAL HIP DOMINANT / UNILATERAL HIP DOMINANT / LEG CURLS / BICEP / TRICEP / CALVES` | L3 category_canonical | analyst code | RP.KD.BS / RP.KD.UL / RP.KD.ISO / RP.HD.BS / RP.HD.UL / RP.LF / RP.SM.BI / RP.SM.TRI / RP.SM.CALF | alias | ANALYST | - |
| `canonical_zone 'LEVEL\|FAMILY\|LATERALITY or REGION\|PATTERN[\|PLANE]'` | L2 zone.canonical_zone | analyst code | node id + F.LEVEL + F.LAT/F.PLANE | alias | ANALYST | - |


---

## 6. The library mapped onto the tree

### 6.1 Column and level-block map (BYOP `'MASTER EXERCISE LIBRARY'`)

The BYOP 'MASTER EXERCISE LIBRARY' is the single source of truth (COACH-ANSWER CAT-07: 'as far as I was able to take it so far'); Sheet23 and RESISTANCE PATTERNS are older drafts, used only for levels and the exercise grammar. Only the left-most stacked column of each category is a dropdown source. The side-by-side level views are never wired; use them only as labels (OBSERVED, `L4_slot_wiring.md`). The block-label rows (`'FOUNDATIONAL'`, `'MODERATE'`, …) and the `'CHOOSE 👇'` rows are selectable inside every dropdown and must be filtered out.

| Col | Row-1 category (verbatim) | Dropdown range(s) | Blocks: label cell 'label' -> item rows (n) [level] | Canonical node(s) |
|---|---|---|---|---|
| B | `CARDIO` | B7:B122 (8 tabs); B7:B335 (BOOTCAMP - OPTION 2 E7/E12/E22/E27) | B8 `SPEED INTERVALS` -> B9:B13 (5) [L0]; B14 `DISTANCE INTERVALS` -> B15:B17 (3) [L0]; B24 `DISTANCE TEST` -> B25:B33 (9) [L0]; B44 `SPEED TEST` -> B45:B47 (3) [L0]; B89 `DISTANCE TEST (duplicate)` -> B90:B98 (9) [L0]; B123 `DISTANCE` -> B124:B128 (5) [L0]; B132 `CALORIES` -> B133:B141 (9) [L0] | CA (+X.TEST for the test blocks) |
| C | `TRIPPLE EXTENSION` | C7:C242 | C8 `FOUNDATIONAL` -> C9:C15 (7) [L1]; C44 `MODERATE` -> C46:C54 (9) [L2]; C89 `ADVANCED` -> C91:C96 (6) [L3]; C124 `EASY` -> C126:C136 (11) [L1] | AP.TEX (C8-C96); AP.JMP.LK (C124 block) |
| G | `PLYOS` | G7:G162 | G8 `FOUNDATIONAL` -> G9:G15 (7) [L1]; G44 `MODERATE` -> G46:G57 (12) [L2]; G89 `MODERATE` -> G91:G96 (6) [L2]; G124 `ADVANCED` -> G126:G141 (16) [L3] | AP.JMP.PLY (G8, G89); AP.JMP.LK (G44); AP.JMP.FULL (G124) |
| K | `THROWING` | K7:K87 | - `(no block)` -> K9:K28 (20) [L0] | AP.THR (no levels, COACH-ANSWER LIB-06) |
| L | `CHANGE OF DIRECTION` | L7:L242 | L8 `FOUNDATIONAL` -> L9:L13 (5) [L1]; L44 `MODERATE` -> L46:L47 (2) [L2]; L89 `ADVANCED` -> L91:L92 (2) [L3] | AP.COD |
| O | `CORE THORAX (+ CORE PELVIS copy)` | O7:O283 | O9 `FOUNDATIONAL` -> O10:O16 (6) [L1]; O45 `MODERATE` -> O47 (1) [L2]; O90 `ADVANCED` -> O92:O94 (3) [L3]; O126 `FOUNDATIONAL (pelvis)` -> O127:O130 (4) [L1]; O162 `MODERATE (pelvis)` -> O164:O165 (2) [L2]; O207 `ADVANCED (pelvis)` -> O209 (1) [L3] | CO.CT (O8 block) / CO.CP (O124 block) |
| U | `VERTICAL PULL` | U7:U122 | U8 `FOUNDATIONAL` -> U9:U20 (12) [L1]; U44 `ADVANCED` -> U46:U52 (7) [L3]; U89 `UNILATERAL  ` -> U91 (1) [L0] | RP.PL.V (.BS / .UL) |
| X | `HORIZONTAL PULL` | X7:X162 | X8 `FOUNDATIONAL` -> X9:X13 (5) [L1]; X44 `ADVANCED` -> X46:X54 (9) [L3]; X89 `UNILATERAL` -> X91:X92 (2) [L0] | RP.PL.H (.BS / .UL) |
| AA | `VERTICAL PUSH` | AA7:AA122 | AA8 `FOUNDATIONAL  ` -> AA9:AA14 (6) [L1]; AA44 `ADVANCED` -> AA46:AA55 (10) [L3]; AA89 `UNILATERAL` -> AA91:AA94 (4) [L0] | RP.PU.V (.BS / .UL) |
| AD | `HORIZONTAL PUSH` | AD7:AD162 | AD8 `FOUNDATIONAL` -> AD9:AD14 (6) [L1]; AD44 `MODERATE` -> AD46:AD50 (5) [L2]; AD89 `ADVANCED` -> AD91:AD99 (9) [L3]; AD124 `UNILATERAL` -> AD126:AD130 (5) [L0] | RP.PU.H (.BS / .UL / .ISO) |
| AH | `SIDE RAISES` | AH7:AH42 | - `(no block)` -> AH9:AH20 (12) [L0] | RP.SM.DELT (.SIDE / .REAR / .FRONT) |
| AI | `BILATERAL KNEE DOMINANT` | AI7:AI122 | AI8 `FOUNDATIONAL` -> AI9:AI20 (12) [L1]; AI44 `MODERATE` -> AI46:AI56 (9) [L2]; AI89 `ADVANCED` -> AI91:AI104 (14) [L3] | RP.KD.BS |
| AL | `UNILATERAL KNEE DOMINANT` | AL7:AL42 | - `(no block)` -> AL9:AL21 (13) [L0] | RP.KD.UL |
| AM | `LEG EXTENSIONS` | AM7:AM9 | - `(no block)` -> AM9 (1) [L0] | RP.KD.ISO (every level; AM3 label typo, LIB-15) |
| AN | `BILATERAL HIP DOMNANT` | AN7:AN122 | AN8 `FOUNDATIONAL` -> AN9:AN20 (12) [L1]; AN44 `MODERATE` -> AN46:AN55 (10) [L2]; AN89 `ADVANCED` -> AN91:AN101 (11) [L3] | RP.HD.BS (knee-flexion curls AN15, AN17:AN19, AN50, AN54, AN91, AN100, AN101 -> RP.LF) |
| AQ | `UNILATERAL HIP DOMINANT` | AQ7:AQ42 | AQ8 `FOUNDATIONAL` -> AQ9:AQ16 (8) [L1 (label) / L0 (meaning)] | RP.HD.UL (AQ16 'Camporini Deadlifts' removed, LIB-09) |
| AR | `LEG CURLS` | AR7:AR10 (AR7:AR42 wired from 'Unilateral HD' in the NO ACCESS tabs; COACH-R2 R2-LIB-08: that slot reads AQ) | - `(no block)` -> AR9:AR10 (2) [L0] | RP.LF (COACH-ANSWER CAT-09; was RP.HD.ISO) |
| AS | `BICEP` | AS7:AS42 | - `(no block)` -> AS9:AS22 (14) [L0] | RP.SM.BI |
| AT | `TRICEP` | AT7:AT42 | - `(no block)` -> AT9:AT17 (9) [L0] | RP.SM.TRI |
| AU | `CALVES` | AU7:AU13 | - `(no block)` -> AU9:AU13 (5) [L0] | RP.SM.CALF |
| AZ | `FULL FOCUS LIST` | AZ7:AZ335 | AZ8..AZ331 `10 muscle headers` -> AZ9:AZ332 (51) [L0] | X.FOCUS |
| BA | `CARRY` | (not wired) | BA8/BA10/BA13/BA14 `PROPULSIVE / STATIONARY / BILATERAL / UNILARTERAL` -> - (0) [-] | FN.CARRY |
| BB | `DRAGS` | (not wired) | BB8/BB10 `SAGITAL / FRONTAL` -> - (0) [-] | FN.DRAG |
| BC | `FUNCTIONAL BIOMECHANICS SYSTEM / ANTERIOR OBLIQUE SYSTEM` | (not wired) | BC8 `CHOPS` -> BC9:BC20 (12) [colour L1/L2/L3]; BC45 `ANTI ROTATIONS` -> BC46:BC49 (4) [L1]; BC90 `PLANKS` -> BC91 (1) [L1]; BC125 `CRUNCHES` -> - (0) [-] | FN.AOS |
| BD | `POSTERIOR OBLIQUE SYSTEM` | (not wired) | BD8 `BRIDGES` -> - (0) [-] | FN.POS |
| BE | `LATERAL SUBSYSTEM` | (not wired) | BE8 `SIDE LYING` -> - (0) [-] | FN.LSS |
| D,E,F,H,I,J,M,N,P,Q,S,T,V,W,Y,Z,AB,AC,AE,AF,AG,AJ,AK,AO,AP | `(side-by-side level views)` | (never wired) | - | same node as their stacked twin; use only for labels |
| R | `CORE PELVIS (original)` | (never wired; content copied to O124:O209) | R8/R44/R89 `FOUNDATIONAL / MODERATE / ADVANCED` -> R9:R91 (7) [L1-L3] | CO.CP |


### 6.2 Items that live in the wrong bucket (move to their canonical node, keep a cross-listing)

v1 rows from the coach's answers (LIB-02, LIB-07, LIB-08, LIB-09, LIB-11, LIB-15, LIB-17, LIB-18, EQ-01) follow the original rows; v1.1 updates the KB swing (R2-VOL-05), thrusters (R2-VOL-05), KB face pulls (R2-LIB-04 / LIB-10) and the 21.6-mile run (R2-LIB-06), and adds the bench push-up split (R2-LIB-05). Cells were re-checked in the dumps.

| Cell(s) | Item (verbatim) | Filed under | Canonical node | Why |
|---|---|---|---|---|
| AI20, AI55, AI101 | Leg Extension Machine | RP.KD.BS (all 3 blocks) | RP.KD.ISO | single-joint knee extension inside the squat list; picking it empties the squat slot (prog_byop_aesthetics 0.2) |
| AN15, AN54, AN100 | Leg Curl Machine / Machine Leg Curls (Seated and Laying Down) / Machine Leg Curls | RP.HD.BS | RP.LF (RP.LF.MACH, PROPOSED lane) | knee flexion, not a hinge (COACH-ANSWER CAT-09) |
| AN17, AN18, AN19, AN50, AN101 | 'Harmstring MedBall Curls' / 'Supine Glidder hamstring curls' / 'swiss ball hamstring curls' / 'Medicine or Stability Ball Harmstring Curls' / 'DB Harmstring Curls' | RP.HD.BS | RP.LF (RP.LF.BW, PROPOSED lane) - the bodyweight options the Leg Curls slot never offered | knee flexion (+ bridge for ball/slider curls); COACH-ANSWER CAT-09; the no-machine swap (EQ-08) |
| AN91 | Nordic Curl | RP.HD.BS ADVANCED | RP.LF (RP.LF.BW) - eccentric knee flexion, hardest bodyweight curl | COACH-ANSWER CAT-09 |
| AN20 | KB swing | RP.HD.BS FOUNDATIONAL | AP (ballistic power work, F.INTENT=BALLISTIC; 0 muscle sets) - kept as a swap in RP.HD.BS ('SPEED SPECIALS', RESISTANCE PATTERNS A77) | ballistic hinge; COACH-R2 R2-VOL-05: 'kettlebell swings are not glutes ... mostly supposed to be used for the ballistic movements, not for resistance training' |
| AD48, AD49, AD50 | Bench DB Flies / Cable flies / Machine flies | RP.PU.H MODERATE | RP.PU.H.ISO | horizontal adduction isolation; PPL has a 'Flies' DETAIL |
| AA9, AA10 | Incline Seated DB Press / Incline Seated Barbell Press | RP.PU.V FOUNDATIONAL | RP.PU.M (proposed) | 'MID RANGE PUSH' in RESISTANCE PATTERNS G6 |
| AD91, AD126 | Incline DB Bench Press / Alternating Incline DB Bench Press | RP.PU.H ADVANCED / UL | RP.PU.M (proposed) | same |
| AA93 | Kneeling Landmine Press | RP.PU.V.UL | RP.PU.M (UL) | RESISTANCE PATTERNS files landmine under MID RANGE PUSH (G13:G14) |
| AA11:AA14 | DB/Barbell Push press, DB/Barbell Push Jerk | RP.PU.V FOUNDATIONAL | AP.TEX.JERK (cross-listed with RP.PU.V); push press easier (L1-L2), push jerk intermediate/advanced (L2-L3) | leg-driven ballistic; OLYMPIC tab jerk ladder A14:A18; COACH-ANSWER LIB-13 |
| AA54, AA55, AA94; AI102:AI104 | DB/Barbell Thrusters, Single arm DB thruster(s) | RP.PU.V ADVANCED/UL and RP.KD.BS ADVANCED | complex RP.KD.BS + RP.PU.V (conditioning-leaning): quads 1.0 + front delts ('shoulders') 0.5 + glutes 0.25 (COACH-R2 R2-VOL-05) | listed in two columns; COACH-ANSWER LIB-14 (RIGHT: conditioning-leaning, 1.0 quads / 0.5 shoulders) - the specific answer wins over the general 0.25 helper rule (VOL-09) |
| U20 | KB Face Pulls  | RP.PL.V FOUNDATIONAL | RP.SM.DELT.REAR (COACH-R2 R2-LIB-04, LIB-10: shoulder work, swap only; pull or shoulder days) | rear-delt movement; RESISTANCE PATTERNS lists 'Face pulls' under SHOULDERS (K19) |
| X54 | Renegade Rows | RP.PL.H.BS ADVANCED | RP.PL.H.UL (alternating) + CO (anti-rotation) | alternating, not bilateral symmetrical |
| AH12, AH13, AH18 | Front Raises w/ DB / w/ Barbell / DB Front Raises Supinated Grip | RP.SM.DELT ('ABdution' slot) | RP.SM.DELT.FRONT | shoulder flexion, not abduction |
| AH10, AH15, AH20 | Bent over DB Reverse flies / Seated DB Reverse Flies / Machine reverse fliez | RP.SM.DELT | RP.SM.DELT.REAR | PPL 'Reverse Flies' DETAIL |
| G12, G95, G141 | Push up Stick the Landing / Push up Box Jump / Plyo pushups | AP.JMP (lower-body PLYOS) | AP.UBP | upper-body plyometrics |
| G128 |  Max velocity running (top speed) | AP.JMP.FULL | AP.SPD.MAXV | coach files sprinting at the top of the SSC ladder ('*SPRINT*') |
| G15, G55 | Ankle Hops  | AP.JMP.PLY FOUNDATIONAL / AP.JMP.LK MODERATE | AP.JMP.LK | limited-knee track |
| G53 | Bigger plates start at lateral bilateral plate hops | AP.JMP.LK (as an item) | (progression rule - not an exercise) | - |
| C126:C136 | 11 ankle-hop drills (EASY block) | AP.TEX column | AP.JMP.LK | Sheet23 'FOUNDATINONAL - AP - JUMPING LIMITED KNEE' |
| O15, O16 | Toes to bar / Knees to chest | CO.CT FOUNDATIONAL | CO.CP by the coach's rule (COACH-ANSWER CAT-08); toes to bar is 'more complicated' - PROPOSED, pending | pelvis moves on a fixed thorax |
| O130 / R12 | Hanging Rotational Knee/Leg Raises | CO.CP SAGITAL FOUNDATIONAL | CO.CP + F.PLANE=TRA - conflict | rotational item in the sagittal block |
| O129 | V-ups | CO.CP | CO.CB ('BOTH', CONTROL PATTERNSCORE I28) | - |
| O164, O165 (S9/S10) | Side Planks / Coppenhaggen Plank | CO.CP FRONTAL | Side Planks: merged with CORE THORAX 'Side Plank ' (P9/O47) into one record, PROPOSED CO.CB frontal static (COACH-ANSWER LIB-17); Copenhagen plank 'more complicated' (CAT-08) - PROPOSED CO.CB frontal static + adductor credit | CONTROL PATTERNSCORE files side planks under BOTH |
| AD96, AD97 | Dips / Weighted Dips | RP.PU.H ADVANCED | RP.PU.H, credited 0.5 triceps / 0.5 chest (COACH-ANSWER LIB-16) | 'dips i would say more tricep than chest but still .5 and .5 done in push day or push exercise' |
| AI100 | Sissy Squats | RP.KD.BS ADVANCED | RP.KD.ISO-like (knee-dominant, hips extended) | bodyweight substitute for leg extensions (COACH-ANSWER EQ-08: no machine -> sissy squats; no banded leg extensions) |
| AS12 | Cable Machine Curls (Zone1, Zone 2, Zone 3 | RP.SM.BI | RP.SM.BI + F.DZONE (arm in Davidson zone 1, 2 or 3) | 'Zone' = Davidson position zone (COACH-ANSWER CAT-10; was INFERRED) |
| AN48, AN93 (side views AO11, AP11) | GHD | RP.HD.BS MODERATE and ADVANCED | RP.HD.BS, one L0 record | COACH-ANSWER LIB-08: 'no levels on this'; only if available and felt in the right muscles (EQ-11) |
| AQ16 | Camporini Deadlifts | RP.HD.UL | (removed) | COACH-ANSWER LIB-09: 'For the Camporini deadlift, you can ignore that one.' |
| AQ13, AQ15 | Alternating DB Deadlifts / Alternating  Barbell Deadlifts | RP.HD.UL | RP.HD.UL + F.LAT=ALT (staggered stance) | COACH-ANSWER LIB-09: half a step back, deadlift on one leg, switch legs, keep alternating |
| AL14 | Single Leg Get Ups | RP.KD.UL | RP.KD.UL (box pistol) | COACH-ANSWER LIB-09: stand up from a box / bench / chair on one leg; the other foot only for balance or off the ground |
| AI15 | Low DB Squats | RP.KD.BS FOUNDATIONAL | RP.KD.BS + F.LOADPOS=SIDES (Davidson zone 1 as a tag; L1 by load position, COACH-R2 R2-LIB-02) | COACH-ANSWER LIB-09: DBs hanging at the sides, arms down - not goblet, not racked |
| RESISTANCE PATTERNS G77 | Kong Rows | HORIZONTAL PULL (MM) | RP.PL.H.BS (low stimulus; shoulder / back pain; hinge strength) | COACH-ANSWER LIB-09: two KBs on the floor, wide stance, hinge, row them off the floor and set them down |
| RESISTANCE PATTERNS A54:A55 | Whats that strap rotating in / out | RP.KD.BS BILATERAL TRANSVERSE | (removed; F.PERTURB=STRAP removed) | COACH-ANSWER LIB-09: 'you can take that one away' |
| 4 TRACKS O48:V48, O64:V64; RESISTANCE PATTERNS E67 | Pull under / pull under / Lat pull unders | (programs; VERTICAL PULL in MM) | RP.PL.V.ISO = lat pull-over (cable) | COACH-ANSWER LIB-09: 'The pull under is really called a pull over' |
| C94, C95, C96 | Snatch  / Clean  / Clean & Jerk | AP.TEX ADVANCED | AP.TEX.SQ named Squat Snatch / Squat Clean / Squat Clean & Jerk | COACH-ANSWER LIB-07: 'full squat version yes add squat word to them' |
| AA50, AA51 | Standing DB Press (twice) | RP.PU.V ADVANCED | AA50 Standing DB Press; AA51 = Standing Barbell Press | COACH-ANSWER LIB-11 |
| AS14, AS16 | Seated Db Bicep Curls / Seated DB Curls  | RP.SM.BI | RP.SM.BI, one record | near-duplicates merged (COACH-ANSWER LIB-17) |
| P9 / O47 (thorax); S9 / R46 / O164 (pelvis) | Side Plank  / Side Planks  | CO.CT FRONTAL and CO.CP FRONTAL | one record, PROPOSED CO.CB frontal static | near-duplicates merged (COACH-ANSWER LIB-17); CONTROL PATTERNSCORE files side planks under BOTH |
| AM3, AR5 | RP-BS-KNEE DOMINANT -ADVANCED / UNILATERAL (labels) | RP.KD.ISO / RP.LF | L0 - every level | copy typos (COACH-ANSWER LIB-15) |
| G12 | Push up Stick the Landing | AP.JMP (PLYOS FOUNDATIONAL) | AP.UBP, F.PMETHOD=RECEIVE_PAUSE | COACH-ANSWER LIB-02: the hands start on a box and land on the floor |
| B33, B98 | 21.6 mile run | CA (DISTANCE TEST) | (removed - COACH-R2 R2-LIB-06) | COACH-ANSWER LIB-18: 'thats a marathon, dont know when/where we need that' - flag: a marathon is 26.2 mi; v1.1: removed from plans and tests (COACH-R2 R2-LIB-06) |
| U15; AI92, AI93, AI95, AI96 (+ AK10, AK11, AK13, AK14 side views); RESISTANCE PATTERNS A26, A27, A29, A30, A40, A47, A48; BALLISTICS D34:D40 | Assisted  Pull-Up w bands / Box. ... (Banded) / (Reverse Banded) / banded leg extensions on bench / Hip banded tube bands / REVERSE BANDED HOPS / JUMPS | various | (out of scope - DORMANT) | no bands and no variable resistance (COACH-ANSWER EQ-01, EQ-08, EQ-12) |
| AD13, AF11 (Sheet23 Z4) | Bench Push ups | RP.PU.H FOUNDATIONAL (AD13) and the ADVANCED level view (AF11) | two records in RP.PU.H.BS: hands on the bench = L1 (AD13), feet on the bench = L3 (AF11 / Sheet23 Z4) | COACH-R2 R2-LIB-05 / LIB-12: both versions - hands on the bench foundational, feet on the bench advanced |
| BC10:BC20, BC46:BC49, BC91 | '... cable or banded ...' / 'Knee banded for adduction ...' / '... banded or cable adduction' | FN.AOS | FN.AOS with the cable / held-object option only; knee-band variants DORMANT | no bands (COACH-ANSWER EQ-01) |


---

## 7. Gaps and contradictions in the current categorisation

**G1. Two names for one level system, plus five meanings of 'ZONE'.**

- *Evidence (OBSERVED):* Level words EASY/FOUNDATIONAL/FOUNDATINONAL, MODERATE/INTERMEDIATE/INTERMIDIATE, ADVANCED/HARD, ANY; 'ZONE' = level row (A3), plyo execution zone (Sheet23 C34:D36), arm-position zone (AS12), unexplained colour band (Sheet23 A2:A28), energy zones (BASEBALL / AEROBIC).
- *Why it matters (INFERRED):* A generator reading 'ZONE 2' or 'MODERATE' cannot know which axis is meant.
- *Proposal:* One level field (L0-L3); separate fields F.PMETHOD (plyo execution method), F.DZONE (Davidson position zone), F.ABAND (aerobic band), F.EZONE (energy zone).
- *v1 (coach answers):* Resolved (COACH-ANSWER CAT-04, CAT-10, CAT-11): Davidson zones -> F.DZONE; plyo 'zones' -> F.PMETHOD (not a zone); ZONE_BAND read as Davidson-zone level band (INFERRED).

**G2. Exercise tier vs client level are conflated in vocabulary but independent in practice.**

- *Evidence (OBSERVED):* NOVICE/NEWBY/INTERMEDIATE change only the dose in UL, and almost only the dose in PPL. PPL has one swap: NOVICE 'Cable Lat pulldown' (C28) vs 'Pull ups or Cable Lat pull down' (G28/K28). NOVICE gets 'Sqats or Leg Press' and 'Deadlifts (DB or Barbell)' although BYOP files leg press and barbell deadlifts ADVANCED and DB deadlifts MODERATE; JUSTICE LEAGUE mixes FOUNDATIONAL plyos with an ADVANCED power clean; the 'NOVICE' column sits below the 'NEWBY' column (column order only: the coach uses both words for a beginner, PRG-05).
- *Why it matters (INFERRED):* If 'level' is one field the generator will lock beginners out of good tools (leg press) and lock advanced athletes out of foundational landings.
- *Proposal:* Two fields: F.LEVEL (exercise) and F.CLIENT (person). Client level caps per-node tier, not globally.
- *v1 (coach answers):* Resolved (COACH-ANSWER CAT-06, PRG-05): two separate fields; client levels named Level 1/2/3 by column position (NOVICE column = Level 1, NEWBY = Level 2, INTERMEDIATE = Level 3); as words, novice and newbie mean the same kind of beginner.

**G3. Level means different things per bucket and is missing where it matters.**

- *Evidence (OBSERVED):* TEX = complexity/start position; JMP = height/base/load; COD = turn angle; core = plane; upper RP = remove external support; lower RP = load position then methods/machines; UL lanes and all isolation lists unlevelled; VERTICAL PULL / VERTICAL PUSH / HORIZONTAL PULL have no INTERMEDIATE; AQ is labelled FOUNDATIONAL as a whole.
- *Why it matters (INFERRED):* A single 'difficulty' number is meaningless across buckets.
- *Proposal:* Keep tiers but store the 'level_driver' per node (in the JSON) and let UL/ISO derive difficulty from facets (load position, stance, load laterality).
- *v1 (coach answers):* Addressed (COACH-ANSWER CAT-04): one definition - skill + stability + load position, machines easier (v1.1: the Davidson zone is a tag, not part of the level, COACH-R2 R2-LIB-02); per-bucket drivers stay. CAT-05: levels are theoretical, soft defaults only.

**G4. Mixed lists: isolation, ballistic and other-pattern items live inside compound columns.**

- *Evidence (OBSERVED):* Leg extension in all 3 AI blocks; 9 of 33 AN options are knee-flexion curls; flies in AD; push press/jerk and thrusters in AA; thrusters again in AI; KB face pulls in U; front raises and reverse flies in the 'ABdution' list; upper-body plyos and sprinting inside lower-body PLYOS.
- *Why it matters (INFERRED):* The slot no longer guarantees the movement pattern; weekly volume per bucket is wrong if counted by slot.
- *Proposal:* Tag every item with its true node (REASSIGN table) and keep a 'cross_listed_in' list so the dropdown behaviour is preserved.
- *v1 (coach answers):* Partly resolved: knee-flexion curls leave AN for RP.LF (COACH-ANSWER CAT-09); dips credited 0.5/0.5 (LIB-16); push press / jerk levels (LIB-13); face pulls = shoulder work (v1.1, COACH-R2 R2-LIB-04 / LIB-10).

**G5. MID RANGE PUSH exists in the theory tab but not in the library.**

- *Evidence (OBSERVED):* RESISTANCE PATTERNS G6 'MID RANGE PUSH' (incline DB/barbell/cable, viking, landmine); BYOP scatters these into VERTICAL PUSH FOUNDATIONAL (AA9:AA10), HORIZONTAL PUSH ADVANCED (AD91), UL vertical push (AA93); AZ files incline presses under both SHOULDERS/TRAPS and CHEST; 4 TRACKS uses 'HIGH INCLINE PRESS' as a main lift; PPL has an 'Incline' DETAIL slot.
- *Why it matters (INFERRED):* Incline pressing is credited inconsistently (chest vs delts) and its level is contradictory (foundational seated incline vs advanced incline bench).
- *Proposal:* Add RP.PU.M with chest 1.0 / front delts 1.0. Leave RP.PL.M as an open question (no evidence).
- *v1 (coach answers):* Open (no answer on mid-range push itself). The v0 credit proposal is superseded by VOL-09: until the coach answers, RP.PU.M credits chest 1.0 with front delts and triceps as 0.25 helpers, like bench.

**G6. Core: region conflicts, missing 'BOTH', rigid level = plane.**

- *Evidence (OBSERVED):* Toes to bar / knees to chest: BYOP CT (O15:O16) vs CONTROL PATTERNSCORE CP (I18:I19); V-ups CP vs BOTH; side planks CP vs BOTH; 'Hanging Rotational Knee/Leg Raises' sits in SAGITAL foundational; Sheet23 S (ADVANCED CP TRANSVERSE) empty; BYOP has no 'BOTH' region and no static/dynamic tag; frontal plane nearly empty everywhere.
- *Why it matters (INFERRED):* A plane-driven core progression will mis-level items and can't produce anti-rotation (static transverse) work at foundational level (e.g. Pallof holds are FN-green).
- *Proposal:* Adopt CONTROL PATTERNSCORE's 3-axis grid (region x plane x mode) as the core facets; keep 'plane SAG->FRO->TRA' as the DEFAULT progression, not the definition of level.
- *v1 (coach answers):* Mostly resolved (COACH-ANSWER CAT-08): CT / CP / CB x plane confirmed; toes to bar and Copenhagen plank 'more complicated' (PROPOSED, pending); side planks merged (LIB-17).

**G7. The jumping system is split across two segments and three tracks.**

- *Evidence (OBSERVED):* Ankle/limited-knee track: C124 block (under TRIPPLE EXTENSION) + G44 block (under PLYOS); landing/hurdle track G8 (labelled FOUNDATIONAL) + G89 (labelled MODERATE). G44 (plate hops, limited-knee track) and G89 (hurdles) are two different blocks that are both labelled MODERATE; FULL JUMPING G124 also holds sprinting and plyo push-ups; MACH drills and acceleration starts exist only in Sheet23; force phases, the Sheet23 plyo 'ZONE 1/2/3' steps (v1: a plyo execution method, not a zone and not an exercise property, CAT-11) and ballistic-vs-plyometric purpose live only in the theory tab.
- *Why it matters (INFERRED):* The sport dial (basketball more, boxing/karate less, MMA between) has nothing to grip: no field says 'rebounding contact' vs 'landing'.
- *Proposal:* One AP.JMP node with three tracks (LK, PLY, FULL) + facets F.PHASE, F.PMETHOD, F.INTENT, F.SSC on every jump item; AP.SPD and AP.UBP as their own nodes.
- *v1 (coach answers):* Resolved for the dials (COACH-ANSWER CAT-10, CAT-11, ATH-01, LIB-21): F.PMETHOD, ground-contact ballistic vs plyometric, AP.SPD confirmed as a category. v1.1: the stages are named and timed (R2-ATH-03) and every jump / throw is tagged ballistic / plyometric / receive in the catalog (R2-ATH-02).

**G8. Plane has two meanings and is mostly unfilled for resistance work.**

- *Evidence (OBSERVED):* Theory: plane = direction of the force resisted ('Stance loads the FRONT TO BACK' ...; frontal squat = squat + hip band). Library: every resistance list is sagittal except side lunge / curtsy / lateral step-up; 'lateral step up' filed UNILATERAL SAGITAL; all upper-body FRONTAL/TRANSVERSE blocks empty.
- *Why it matters (INFERRED):* Athletes who need frontal/transverse resistance (MMA, basketball) cannot be served by plane filtering.
- *Proposal:* Store plane_of_motion and plane_of_demand separately; populate demand via F.PERTURB and F.LOADLAT (contra/ipsi).
- *v1 (coach answers):* The plane definition is still open (no answer). LIB-20 adds frontal / transverse lower-body moves to the library, minus bands and the strap, and UNI-12 (RIGHT) says who gets them: more for basketball, tennis, soccer and MMA, little for aesthetics clients.

**G9. Laterality vocabulary is overloaded.**

- *Evidence (OBSERVED):* 'BILATERAL SYMMETRICAL' (upper) vs 'BILATERAL' (lower); 'UNILATERAL' is both a laterality (row 5) and a level block (U89, X89, AA89, AD124); staggered stance with two-hand load is 'BILATERAL LOADING' under UNILATERAL SAGITAL; alternating/offset only in names; load laterality (contra/ipsi) separate from stance laterality.
- *Why it matters (INFERRED):* Filters on 'unilateral' return the wrong sets.
- *Proposal:* F.LAT (BS/UL/ALT/STAG/OFFSET) + F.LOADLAT (DOUBLE/CONTRA/IPSI/SINGLE) as two facets.
- *v1 (coach answers):* Resolved (COACH-ANSWER CAT-13, UNI-07): load laterality semantics and use cases; alternating = unilateral.

**G10. Muscle tags disagree between library and program, and several muscles have no home.**

- *Evidence (OBSERVED):* 'SHOULDERS/TRAPS' (AA6) vs slot 'Chest/Shoulders'; 'SHOULDERS' (AH6) vs 'Shoulders/Traps'; 'GLUTES/HAMSTRINGS' (AN6) vs slot 'Hamstring'; dips chest (PPL) vs triceps (AZ); incline chest vs shoulders (AZ); hip thrusts glutes vs hamstrings (AZ); no rear-delt slot outside PPL; no adductors, abductors, erectors, forearms, neck, rotator cuff.
- *Why it matters (INFERRED):* 15-20 sets/muscle accounting is impossible to reproduce exactly.
- *Proposal:* Canonical muscle list (MUSCLES) with credit weights per node; keep coach labels as aliases.
- *v1 (coach answers):* Partly resolved (COACH-ANSWER CAT-02, LIB-16, VOL-17): big/small lists, dips credit, rear delts get own sets; front delts, traps, adductors, neck still unclassified.

**G11. Conditioning has two taxonomies that do not meet.**

- *Evidence (OBSERVED):* Library CARDIO sub-blocks (SPEED INTERVALS, DISTANCE ..., CALORIES) carry no A/B/C colour; the AEROBIC cheat sheet (A/B/C + lactate clearance) has no library; BASEBALL uses energy zones (SPEED ENDURANCE / SPEED POWER / SPEED STRENGTH & POWER) and 'Buy out'; CrossFit uses WODs and levels; cheat sheet asks 3 sessions/week, athletic templates give 2; DISTANCE and CALORIES blocks unreachable from B7:B122.
- *Why it matters (INFERRED):* The generator cannot satisfy 'one of each colour per week' from library picks.
- *Proposal:* Tag every CA item with F.ABAND and F.EZONE; treat formats as F.CFORMAT.
- *v1 (coach answers):* Open in the taxonomy (A/B/C tags); 3 / 2 / 4 aerobic sessions per week by population is a profile rule (ATH-07). The cardio dropdowns are to be extended so the DISTANCE (200-1000 m) and CALORIES blocks can be picked, 'just make sure they're logical' (COACH-ANSWER FIX-02); any colour can run on any erg, tracked by calories, time or distance (EQ-14).

**G12. FUNCTIONAL layer, carries and drags are skeletons with no slot.**

- *Evidence (OBSERVED):* Only ANTERIOR OBLIQUE SYSTEM has items (17); POSTERIOR OBLIQUE / LATERAL SUBSYSTEM / CARRY / DRAGS are headers only; none is wired to any program tab; 'single side carry' is filed as CORE THORAX TRANSVERSE DYNAMIC in CONTROL PATTERNSCORE.
- *Why it matters (INFERRED):* These ideas cannot reach a client today.
- *Proposal:* Keep as nodes (FN.*) with status 'unpopulated'; allow them to fill CO and X.PREP slots once populated.
- *v1 (coach answers):* Build-out confirmed (COACH-ANSWER LIB-19): carries and drags for athletes and general fitness; slings for advanced athletes and rehab.

**G13. Throwing and COD are levelled differently from everything else.**

- *Evidence (OBSERVED):* THROWING: 'AP - THROWING' (no level), ordered by biomechanical complexity, sides always R/L; SPECIALTIES and CORE EXTRAS not in BYOP. COD: football receiver routes graded by turn; agility (reactive) defined but empty; formations undefined.
- *Why it matters (INFERRED):* COD for non-football athletes and throw progression need rules.
- *Proposal:* AP.THR children by description grammar; F.HIPDIR/F.LOADLAT; AP.COD with F.TURN; AP.AGI unpopulated.
- *v1 (coach answers):* Resolved (COACH-ANSWER LIB-06, ATH-06, LIB-01): throws have no levels; COD routes for every athlete by turn angle; L-test and 5-10-5 decoded.

**G14. Program slot grammars are all different.**

- *Evidence (OBSERVED):* BYOP PURPOSE/CATEGORY ('Quads'/'Bilateral KD'), PPL DETAIL ('Incline','Flies','Dips','Push','Overhead','Reverse Flies'), BASEBALL codes ('bkd','uhd','horiz pull', Part A-E), CrossFit ('KNEE DOM','HIP DOM','LB','UB'), 4 TRACKS roles ('the work' ... 'the survival'), HYBRID ('UNI HD','OLY/ POWER','A/C', 'KD' on deadlifts), gym templates (no labels at all).
- *Why it matters (INFERRED):* There is no single slot vocabulary to generate into.
- *Proposal:* Everything crosswalks to node IDs (sec. 6) plus F.ROLE for session position.
- *v1 (coach answers):* Unchanged (crosswalk to node ids + F.ROLE); slot roles confirmed (ORD-07).

**G15. Spelling, spacing and copy drift.**

- *Evidence (OBSERVED):* 'TRIPPLE', 'DOMNANT', 'INTERMIDIATE', 'FOUNDATINONAL', 'SAGITAL', 'UNLATERAL', 'UNILARTERAL', 'ABdution', 'Harmstring', 'Back ' vs 'Back', 'FOUNDATIONAL  ', 'UNILATERAL  ', 'EASY  ', 'CHOSE 👇', date-corrupted '5-10-5'; three library copies disagree (Machine bench press, Barbell Incline Bench Press, SPEED ENDURANCE TEST, truncated plyos).
- *Why it matters (INFERRED):* Exact-match parsing breaks.
- *Proposal:* Normalise with strip()/case-fold and the crosswalk; never edit the coach's sheets.
- *v1 (coach answers):* Resolved (COACH-ANSWER FIX-04): correct spelling in the generator, never in the sheets.

**G16. Equipment / constraint is a coach axis with no field.**

- *Evidence (OBSERVED):* CHAT-relayed: 'If you read the workouts you can understand them by their equipment usage'; machines = constraints/safer/volume; free weights = skill. Library has no equipment column; NO ACCESS tabs use the full gym lists (v1.1, COACH-R2 R2-LIB-08: NO ACCESS = the self-serve version without coach access, full gym library).
- *Why it matters (INFERRED):* Home/no-gym clients and injured/older clients cannot be filtered.
- *Proposal:* F.IMPL + F.CONSTRAINT on every record (sibling equipment analysis already scores them).
- *v1 (coach answers):* Resolved (COACH-ANSWER EQ-13, EQ-11, EQ-01): approved 1-5 constraint scale; machines not ranked; no bands; F.AXIAL added (PER-04); v1.1: counted spine lifts approved (R2-SES-02, F.SPINEDAY).


---

## 8. A cleaned-up model that stays faithful to his intent

### 8.1 Principles

1. Keep the coach's two-level slot logic: PURPOSE (muscle/quality credited) x CATEGORY (pattern bucket). Do not replace it with a muscle-only or exercise-only model.
2. Keep his families and codes (AP, RP, CT/CP, BS, UL) and his level words in the UI; use the canonical IDs underneath.
3. One meaning per field. Level, plyo execution method, Davidson position zone, aerobic band, energy zone, plane of motion, plane of demand, stance laterality and load laterality are separate fields.
4. An exercise lives in exactly one canonical node; dropdown behaviour is preserved with a 'cross_listed_in' list.
5. Base exercise + variables (his 'Box *ANY Squat ...' grammar) instead of a flat list wherever he already listed variables (lunges, squats, hinges, presses). Variables are the block-to-block lever: exercises stay fixed for a 4-6 week block, and the next block changes one or two of grip, stance, implement, ROM or rep range, never all at once (COACH-ANSWER PER-02). v1.1 (COACH-R2 R2-LIB-01, approved): the library exercise stays the main pick; between blocks the tool changes one detail - which hand holds the weight, grip, stance, implement or range - shown as '<library name> - <detail>' (e.g. 'Reverse Lunge - dumbbell in the opposite hand'), and never invents an exercise (F.DETAIL).
6. Nothing is deleted from the sheets' record: unfinished buckets (FN.*, AP.AGI, RP.PU.M, RP.PL.M) stay as nodes marked 'unpopulated'/'proposed'; removed or dormant items (strap, Camporini, bands, chains, weight releasers) stay in the archive with a status.
7. Biomechanics describes every exercise; it is not a bucket (COACH-ANSWER CAT-03).
8. Every exercise carries every lens at once so the generator can segment by any of them (COACH-ANSWER CAT-01).
9. Levels are soft defaults that add options and never lock exercises (COACH-ANSWER CAT-05).
10. No bands and no variable resistance for now: F.ACCOM is a dormant axis (COACH-ANSWER EQ-01, EQ-12).


### 8.2 Node changes

| Action | Target | Detail |
|---|---|---|
| ADD | `RP.PU.M` | Mid-range push - from RESISTANCE PATTERNS G6; receives AA9:AA10, AD91, AD126, AA93. |
| ADD | `RP.PU.H.ISO` | Chest fly lane - receives AD48:AD50; matches PPL 'Flies'. |
| ADD | `RP.PL.V.ISO` | Straight-arm lat lane: 'Pull under' = lat pull-over (COACH-ANSWER LIB-09), 'Lat pull unders', pull-overs. |
| SPLIT | `RP.SM.DELT -> .SIDE / .REAR / .FRONT (+ RP.SM.TRAP)` | Matches PPL 'ABdution' vs 'Reverse Flies' and RESISTANCE PATTERNS K column (side raises, front raises, reverse flies, face pulls, upright rows). |
| ADD | `CO.CB` | 'BOTH' region from CONTROL PATTERNSCORE - confirmed (COACH-ANSWER CAT-08). |
| MOVE | `C124 block -> AP.JMP.LK; G44 block -> AP.JMP.LK` | Unify the limited-knee track (Sheet23 E1/G1). |
| ADD | `AP.SPD (MECH / ACC / MAXV)` | Sprint mechanics and speed (Sheet23 footer, RUNNING WARMUP, A-drills). Confirmed as a library category (COACH-ANSWER LIB-21). |
| ADD | `AP.UBP` | Upper-body plyos out of the lower-body PLYOS list. |
| ADD | `AP.TEX.JERK` | Jerk ladder; push press/jerk cross-listed from VERTICAL PUSH. |
| ADD | `CA.A / CA.B / CA.C / CA.LC / CA.BUY / CA.WOD / CA.CIRC` | Conditioning bands and formats. |
| ADD | `RP.LF (replaces RP.HD.ISO)` | LEG FLEXION (knee flexion) as its own pattern, organised like bicep curls (COACH-ANSWER CAT-09); lanes RP.LF.MACH / RP.LF.BW PROPOSED; 'LEG FLEXION' is the coach's own Sheet25 word. |
| OPEN | `RP.PL.M` | Mid-range pull - only for symmetry; coach to confirm. |
| RENAME | `FN` | 'Functional systems (carries, drags, slings)' - no 'biomechanics' bucket (COACH-ANSWER CAT-03); build-out confirmed (LIB-19). |
| DORMANT | `F.ACCOM; F.IMPL=BAND; F.PERTURB=HIP_BAND` | No bands, chains or weight releasers for now (COACH-ANSWER EQ-01, EQ-12). |
| REMOVE | `F.PERTURB=STRAP; 'Camporini Deadlifts' (AQ16)` | COACH-ANSWER LIB-09. |
| REPLACE | `F.PZONE -> F.PMETHOD` | Plyo execution method, not a zone (COACH-ANSWER CAT-10, CAT-11); v1.1: named 'Receive-Create stages' (COACH-R2 R2-ATH-03). |
| ADD | `F.DZONE, F.AXIAL` | Davidson position zone with rotation bias (CAT-04, CAT-10); axial spinal load (PER-04, EQ-11). |
| ADD | `RP.SM.NECK` | Neck isolation - PROPOSED v1.1 for collision and grappling sports (04_profiles 'No neck exercises' gap, ISO_NECK); no credit. |
| ADD | `F.OLYFAM, F.SPINEDAY, F.DETAIL` | Olympic family and day (COACH-R2 R2-ATH-04); spine-loading day class (R2-SES-01 / R2-SES-02); one-detail variation between blocks (R2-LIB-01). |
| RENAME | `F.PMETHOD` | Name: 'Receive-Create stages' (COACH-R2 R2-ATH-03); codes unchanged (RECEIVE_PAUSE / RECEIVE_CREATE / REPEAT_RC = stages 1 / 2 / 3). |
| RETIRE (wording) | `level read through Davidson zones` | COACH-R2 R2-LIB-02: the zone is a tag; the level comes from load position, skill and stability (F.LEVEL, F.DZONE). |


### 8.3 One record per exercise: the fields

Each library exercise becomes one record with these fields. Every field carries its own evidence tag (OBSERVED from a block label or colour, COACH-ANSWER <ID>, INFERRED or PROPOSED).

- **REQUIRED on every exercise (COACH-ANSWER CAT-01): family, node_id (pattern), laterality, plane, size_class, muscle_credit, implement[], level**
- `node_id` (canonical tree)
- `cross_listed_in` [library columns / slots]
- `family` (AP/RP/CO/CA/FN)
- `level` (L0-L3) + level_basis (block label / coach rule CAT-04 / inferred) - a soft default (CAT-05)
- `client_level_hint` (Level 1-3, optional, soft - never a lock, CAT-05)
- `laterality` (BS/UL/ALT/STAG/OFFSET)
- `load_laterality` (DOUBLE/CONTRA/IPSI/SINGLE) + use_case (COD / acceleration / health accessory, CAT-13)
- `plane_motion` / plane_demand
- `region` / joint_dominance (incl. KNEE_FLEX) / vector
- `davidson_zone` (Z1/Z2/Z3) + rotation_bias (ER/IR) - not for plyos (CAT-04, CAT-10); a tag, not the level, and the swap selector when something hurts (COACH-R2 R2-LIB-02 / R2-LIB-03)
- `size_class` + dose_class (BIG_COMP/BIG_ISO/SMALL_ISO/SMALL_COMP/CONTROL/ATHLETIC/COND)
- `muscle_credit` {muscle: 1.0 | 0.5 (dips, LIB-16; thruster shoulders, LIB-14 / R2-VOL-05) | 0.25 helper (VOL-09; glutes on squats, lunges, deadlifts, RDLs and thrusters, R2-VOL-05)}; 0 for KB swings (ballistic, R2-VOL-05); empty for athletic patterns (VOL-10)
- `quality` (SPEED_POWER/COD/AEROBIC/CORE/STRENGTH/HYPERTROPHY ...)
- `intent` (BALLISTIC/PLYOMETRIC/SPEED_STRENGTH/MAX_STRENGTH) + contact_time (long = ballistic, short = plyometric, ATH-01)
- `force_phase` (P1-P4)
- `plyo_method_default` (RECEIVE_PAUSE / RECEIVE_CREATE / REPEAT_RC = Receive-Create stages 1 Land / 2 Land & Go / 3 Repeat, COACH-R2 R2-ATH-03) - only what the exercise name itself implies (e.g. 'Drop & Stick' = RECEIVE_PAUSE); for any other jump the program phase sets the method (more receiving early, CAT-10). Not a fixed exercise property, not a zone and not a level (CAT-11)
- `ssc_tier`
- `turn` (COD)
- `oly_start` / oly_receive
- `stance`
- `orientation`
- `load_position` (+rank, + level band CAT-04)
- `grip`
- `body_position`
- `rom`
- `end_range`
- `axial_load` (HIGH/LOW/NONE, PER-04)
- `contact_class` (ballistic / plyometric / receive) - COACH-R2 R2-ATH-02; on every jump and throw (catalog `contact_class_v1_1`)
- `receive_create_stage` (1 Land / 2 Land & Go / 3 Repeat, as named; the program sets it per block) - COACH-R2 R2-ATH-03
- `oly_family` + day (CLEAN = squat-leaning / SNATCH = hinge-leaning / JERK / LOADED_JUMP) + reps and load guidance - COACH-R2 R2-ATH-04 / R2-ATH-05 / R2-GEN-06 (F.OLYFAM)
- `older_default_excluded` (60+: off by default, opt-in with a warning) - COACH-R2 R2-ATH-08
- `spine_day` (COUNTED / SECOND_DAY_OK / NOT_COUNTED) - COACH-R2 R2-SES-02 (F.SPINEDAY)
- `variation_axes` (the one detail allowed to change between blocks) - COACH-R2 R2-LIB-01 (F.DETAIL)
- `sport_use` (sports that use the item; plain names mapped to 04_profiles ids) - v1.1, INFERRED
- `accommodating` (DORMANT - EQ-01, EQ-12)
- `perturbation` (ADDUCT only active)
- `implement[]` (BAND dormant)
- `constraint` (1-5, approved scale EQ-13)
- `aerobic_band` / energy_zone / cardio_format
- `status` (active / dormant / removed / pending)
- `name_raw` (verbatim) / name_clean (spelling corrected in the generator only, FIX-04) / `name_es` (Spanish name for the full English/Spanish toggle, COACH-ANSWER GEN-01; v1.1 format approved: neutral Latin American Spanish with the English gym term in brackets, e.g. 'Empuje de cadera (Hip Thrust)', R2-GEN-08)
- `video_url` (the coach's own video where one exists; more links still to be recorded, COACH-ANSWER GEN-06; v1.1: videos are optional - people can look them up, R2-GEN-02)
- `coach_cue` (a short cue in his voice; the program also carries his instruction block, COACH-ANSWER GEN-07)
- `source` cells
- `evidence` per field (OBSERVED / COACH-ANSWER <ID> / INFERRED / PROPOSED)

Code grammar: NODE[.LANE]|L#|LAT|PLANE e.g. 'RP.KD.UL|L0|UL|SAG' + variables {stance:RFE, load_lat:CONTRA, load_pos:FRONT_RACK, impl:DB} -> renders 'RFE contralateral DB front rack lunge' (his own word order: 'RFE & FFE contralateral lunge double DB front rack loaded').


### 8.4 Code grammar and worked examples

`NODE|LEVEL|LATERALITY|PLANE` + variables. These examples use exercises he wrote himself:

| Coach's text (verbatim, where) | Canonical code | Variables |
|---|---|---|
| `'Box *ANY Squat touch & go reverse banded'` (RESISTANCE PATTERNS A27, red) | `RP.KD.BS\|L1-L3\|BS\|SAG` | rom=BOX, end=TOUCH_GO, load_pos=ANY (his own wildcard; the level follows the load position, CAT-04), accom=REV_BANDS **DORMANT** (EQ-01, EQ-12): the generator renders 'Box squat, touch & go' |
| `'Lateral Step ups IPSILATERAL loading'` (MM ATHLETIC F37 MID workout 2; J41 ADVANCED workout 4) | `RP.KD.UL\|L0\|UL\|FRO(motion)` | stance=STEP, orient=LAT, load_lat=IPSI ('OUT OF THE HIP': the load helps drive out of the hip, CAT-13), impl=DB |
| `'FFE CONTRA LUNGES'` → `'RFE IPSI LUNGES'` (4 TRACKS AESTHETICS-8 wk1 → wk4) | `RP.KD.UL\|L0\|UL\|SAG` | stance FFE → RFE, load_lat CONTRA → IPSI: a progression written as variable changes |
| `'Half kneeling Right Facing LEFT LEG UP rotational scoop'` (BYOP K21) = `'INTO THE LEFT LEG/HIP'` (BALLISTICS D65) | `AP.THR.HIP\|L0\|BS\|TRA` | stance=HK, hip_dir=INTO (left), impl=MB 8-10 lb (EQ-06), dose 1 × 10, no level (LIB-06), no muscle credit (VOL-10) |
| `'weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one'` (MM ATHLETIC F12, MID workout 1; also F41 and J12, capitalised 'Weighted') | `AP.JMP.PLY\|L1-L3\|BS\|SAG` | phase=P1 'TAKING IN FORCES', plyo_method=RECEIVE_PAUSE (CAT-10), impl=DB (10-20 % body weight, EQ-15), intent=PLYOMETRIC (landing); no Davidson zone (not for plyos) |
| `'Incline DB bench press feet on wall'` (RESISTANCE PATTERNS G8) | `RP.PU.M\|L1\|BS\|SAG` | base=incline bench, body_pos=FEET_WALL (green), impl=DB, constraint=3 (DB on a bench, EQ-13) |
| `'Goblet KB/DB Squats'` (BYOP AI11) | `RP.KD.BS\|L1\|BS\|SAG` | load_pos=GOBLET (in front = foundational, CAT-04), depth zone Z3 at the bottom (deep squat, external-rotation bias, CAT-10; zone number INFERRED; the zone describes the bias and does not raise the level), axial=LOW, credit quads 1.0 / glutes 0.25 (R2-VOL-05) / adductors 0.25 (adductor value PROPOSED) |
| `'Low Bar Back Squat'` (BYOP AI50, filed MODERATE) | `RP.KD.BS\|L3\|BS\|SAG` | load_pos=BACK_LOW (behind the body = advanced, CAT-04; BYOP label kept as history), axial=HIGH, counted heavy spine lift (PER-04; R2-SES-02), never for older / injured / high-volume clients (EQ-03) |
| `'Seated leg curls'` (BYOP AR9) | `RP.LF.MACH\|L0\|BS\|SAG` | joint=KNEE_FLEX (CAT-09), constraint=5 (EQ-13), axial=NONE, credit hamstrings 1.0, every level (LIB-15) |
| `'Cable Machine Curls (Zone1, Zone 2, Zone 3'` (BYOP AS12) | `RP.SM.BI\|L0\|BS\|SAG` | davidson_zone=Z1 / Z2 / Z3 by arm position (CAT-10), impl=CABLE, constraint=3 |
| `'Hold object Adducted between knees rotational crunch chop up'` (BYOP BC17, red) | `FN.AOS.CHOP\|L3\|BS\|TRA` | chop_dir=UP, fn_pos=SUPINE (INFERRED), perturb=ADDUCT |
| `'DIG/OUT'` + note `'LATERAL'` (JUSTICE LEAGUE E6/H6) | `AP.COD\|L2\|-\|FRO` | turn=MOD_TURN, dose 2 × `'6 to 8 Reps'` |

### 8.5 What should *not* change

- His slot skeletons and session order (v1: core first by default, ATH-11; then athletic; bilateral → horizontal → unilateral → vertical → isolation; knee+pull / hip+push pairing, confirmed and explained: back-of-the-legs work pairs with front-of-the-upper-body work so fatigue does not bleed over, also for full body and bootcamps, COACH-ANSWER UNI-11, ORD-06; same-pattern pairing such as squat + lunge for high-level and aesthetics clients who need more stimulus, cross-pattern pairing for bootcamps so clients stay less sore, UNI-06). These are the program, not the taxonomy.
- His words and colours in anything the client sees: `'FOUNDATIONAL'`/`'MODERATE'`/`'ADVANCED'`, green/yellow/red, `'EASY TURN'`, `'GET INTO THE HIP'`.
- Leg curls keep their full hamstring credit (VOL-09). v0 kept them under HIP; the coach overruled that (COACH-ANSWER CAT-09), so they now form the LEG FLEXION node `RP.LF` with joint action KNEE_FLEX.
- Unfinished ideas (FUNCTIONAL slings, carries, drags, agility, `'HALF KNEELING VARIATIONS'`, empty plane blocks). They stay as nodes marked unpopulated, so filling them later needs no restructuring. The same holds for variable resistance: DORMANT, not deleted (EQ-12: 'We will work with that later on').

---

## 9. Open questions for the coach

### 9.1 The v0 questions and their v1 status

1. Core region: are 'Toes to bar' and 'Knees to chest' CORE THORAX (BYOP O15:O16) or CORE PELVIS (CONTROL PATTERNSCORE I18:I19)? Should BYOP get the 'BOTH' region (dead bugs, bird dogs, V-ups, planks) and the STATIC/DYNAMIC split? **v1:** ANSWERED (COACH-ANSWER CAT-08): rule = which segment moves; 'BOTH' confirmed; toes to bar and Copenhagen plank are 'more complicated' (PROPOSED CO.CP and CO.CB, pending).
2. Core level: is level really the same as plane (SAGITAL easy -> FRONTAL moderate -> TRANSVERSE hard), or is plane just your default order? Can a static transverse drill (Pallof hold) be foundational? **v1:** OPEN (not asked directly); CAT-05 says levels are theoretical, so plane stays the default order, not a gate.
3. Mid-range push: should 'MID RANGE PUSH' (incline presses, landmine, viking) become its own library category and slot? Do incline sets count for chest, delts, or both? Is there a 'mid-range pull'? **v1:** OPEN (unanswered).
4. Shoulders: should 'ABdution' stay one list, or split into side delts (abduction), rear delts (reverse flies, face pulls) and front delts (front raises)? Where do upright rows and traps belong? **v1:** PARTLY ANSWERED: rear delts get their own sets (VOL-17); upright rows = side delts (LIB-16 assumption stands); face pulls were still PENDING in v1 (LIB-10). **v1.1:** face pulls = shoulder work, a rear-delt option (COACH-R2 R2-LIB-04 / LIB-10).
5. Isolation inside compound lists: should a client be able to pick 'Leg Extension Machine' in the 'Bilateral KD' slot, or a leg curl in the 'Bilateral HD' slot? If not, the generator will move them to the isolation lanes. **v1:** PARTLY ANSWERED: curls leave the hinge list (CAT-09); leg extensions in the squat list unanswered - the generator moves them to RP.KD.ISO and keeps a cross-listing.
6. Knee flexion: is 'LEG CURLS' (you also called it 'LEG FLEXION' in Sheet25) part of the hip-dominant family in your head, or its own knee-flexion bucket? Do curls count as hamstring volume 1:1 with hinges? **v1:** ANSWERED (COACH-ANSWER CAT-09, VOL-09): its own LEG FLEXION segment, counted 1:1 toward hamstrings, not the hinge.
7. Jumping tracks: confirm the three tracks - ankle/limited-knee (ankle hops, plate hops), landing->box->hurdle plyos, and full jumping - and that sprinting is the top of the SSC ladder. Should MACH drills, acceleration starts and A-drills get their own 'speed' category in the library? **v1:** PARTLY ANSWERED (LIB-21): speed gets its own library category; the three jump tracks were not contradicted.
8. Force phases and plyo zones: is 'TAKING IN FORCES -> DELIVER FORCES FAST -> AMORTIZATION -> REBOUNDING' a progression across weeks, and 'ZONE 1/2/3' (receive-pause-create / receive-create / repeat) a way of performing ANY jump? Which of these is the dial you turn for basketball vs MMA vs boxing/karate? **v1:** ANSWERED (COACH-ANSWER CAT-10, CAT-11): receive -> create is a way of doing plyos (F.PMETHOD), not a zone; the sport dial is ground-contact time (ATH-01). **v1.1:** named 'Receive-Create stages' and timed (R2-ATH-03); the shares by sport approved (R2-ATH-01).
9. Ballistic vs plyometric: is the sport rule 'basketball = more PLYOMETRIC (rebounding) volume; boxers/karate = fewer rebounds but keep BALLISTIC and rotational medball work; MMA in between'? **v1:** ANSWERED (COACH-ANSWER ATH-01): ratio set by the sport's ground-contact time; ranking confirmed (ATH-02).
10. Plane: do you define plane by the direction of the force the athlete has to resist (hip band = frontal squat, rotating strap = transverse squat) rather than the direction the body moves? Should 'lateral step up' be frontal? **v1:** OPEN (unanswered).
11. Into / out of the hip: confirm contralateral load = 'GET INTO THE HIP' and ipsilateral = 'GET OUT OF THE HIP', and that suitcase is MODERATE, front-racked HARDER, barbell HIGH LOADING. Does the same into/out logic define the half-kneeling medball matrix? **v1:** ANSWERED (COACH-ANSWER CAT-13) for meaning and use; the suitcase / front-racked grading was not contradicted.
12. Size classes: are your 'bigger muscles' quads, glutes, hamstrings, back and chest, and your 'smaller muscles' delts, biceps, triceps, calves (and core)? Where do traps, adductors, lower back and forearms go? **v1:** ANSWERED (COACH-ANSWER CAT-02) except front delts, traps, adductors, neck.
13. Big-muscle isolation (leg extension, leg curl, flies, pull-overs): dose like small muscles (2 x 20, MYO SET) as your sheets show? Do they count fully toward the 15-20 sets for that muscle? **v1:** ANSWERED (VOL-09, VOL-11): leg extension / curl count fully; high reps by default; 40-rep sets only as a CrossFit / AMRAP option.
14. Levels: are exercise tier (FOUNDATIONAL/MODERATE/ADVANCED in the library) and client level (NOVICE/NEWBY/INTERMEDIATE, STARTING/MID/ADVANCED, LVL 1-4) two separate things? Is NOVICE below NEWBY? Can a beginner get leg press if it sits in ADVANCED? **v1:** ANSWERED (CAT-06, PRG-05, EQ-04): separate axes; NOVICE = NEWBY; machines open to every level when safety calls for it.
15. Missing intermediate tiers: should vertical pull, vertical push and horizontal pull get a MODERATE list (RESISTANCE PATTERNS already shows a yellow tier for Z-press and kneeling press)? Should unilateral lists stay unlevelled with difficulty coming from load position and stance? **v1:** CLOSED by CAT-05 (levels are theoretical): no new MODERATE lists needed; unilateral difficulty from load position, stance and load laterality.
16. 'ZONE': which meaning should the generator use where - level row, plyo zone, cable 'Zone 1/2/3' arm position, the Sheet23 column-A colour band (meaning?), or energy zone? **v1:** ANSWERED (COACH-ANSWER CAT-10, CAT-11): see F.ZONE_SENSES.
17. Conditioning: should every library cardio item be tagged with your A (blue) / B (green) / C (orange) colour? Are 'Buy out' sprints (BASEBALL) and WODs (CrossFit) separate categories or just formats of A/B? **v1:** OPEN in the taxonomy; aerobic sessions per week answered elsewhere (ATH-07).
18. Functional layer: should the anterior/posterior oblique and lateral subsystems, carries and drags get program slots (warm-up, core slot, or paired with push/pull days)? What goes under 'INTEGRATED WITH PUSH & LEGS' - a label or a list still to fill? **v1:** PARTLY ANSWERED (LIB-19): who they are for; slots still open.
19. Equipment / constraint: do you want every exercise tagged with implement and a constraint score (machine = high constraint, free weight = low), and should constraint be a dial for older/injured/high-volume clients? **v1:** ANSWERED (EQ-13, EQ-03, EQ-11).
20. Source of truth: is the BYOP 'MASTER EXERCISE LIBRARY' the live inventory, with Sheet23 and RESISTANCE PATTERNS as design references? Which copy tab edits should be merged back ('Barbell Incline Bench Press', 'SPEED ENDURANCE TEST')? **v1:** ANSWERED (COACH-ANSWER CAT-07): BYOP library is the single source of truth.

### 9.2 New questions raised by the answers (round 2)

1. Davidson zones vs your library (CAT-04): overhead work is 'more advanced', yet BYOP has a FOUNDATIONAL overhead block (seated incline DB press, lat pulldowns, assisted pull-ups). Does support (seat, machine, cable) bring an overhead exercise down to foundational, as your 'machines or cables ... it's easier' comment suggests? **v1.1:** ANSWERED (COACH-R2 R2-LIB-02): yes - a seat, machine or cable makes it easier; the zone is a tag, not the level.
2. Rotation bias (CAT-10): how should the generator use it? Balance zone-2 work (internal-rotation bias, compressive: rows, bench, half squats) with zone-1/3 work (external-rotation bias: arms down, overhead, deep squat) across the week, bias it by sport or position, or use it only when something hurts? **v1.1:** ANSWERED (COACH-R2 R2-LIB-03): keep both biases in every week and use the bias to pick swaps when something hurts; not by sport.
3. Plyo execution method (CAT-10/11): how many weeks before an athlete moves from receive-and-pause to receive-then-create to repeated, and does it restart every block or every season? **v1.1:** ANSWERED (COACH-R2 R2-ATH-03): 12-week block weeks 1-3 / 4-7 / 8-12, 8-week 1-2 / 3-5 / 6-8; restart each off-season; hold in maintenance; intermediate / advanced may start at stage 2.
4. Ground-contact rule at exercise level (ATH-01): which library jumps count as ballistic (e.g. squat jumps, box jumps, broad jumps) and which as plyometric (pogo hops, hurdle hops, depth jumps)? **v1.1:** ANSWERED (COACH-R2 R2-ATH-02): ballistic = squat, box, broad, loaded / hex-bar jumps, medball throws; plyometric = pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; stick-the-landing = receive.
5. Contralateral / ipsilateral for everyone else (CAT-13): what default do general-fitness, weight-loss and older clients get (none, contralateral, alternate)? Does the same in/out logic apply to single-arm upper-body work beyond 'split stance ALWAYS contralateral'? **v1.1:** not asked in round 2; still open.
6. Thrusters: LIB-14 (RIGHT) credits shoulders 0.5, while VOL-09 gives helpers 0.25. v1 applies 0.5, reading the shoulders in a thruster as a co-mover rather than a helper (the specific answer wins). Is that right? **v1.1:** ANSWERED (COACH-R2 R2-VOL-05): yes - and add glutes 0.25.
7. Axial loading (PER-04): besides squats and deadlifts, which lifts count as loading the spine (good mornings, barbell lunges or split squats, standing barbell press, heavy carries, hack squat / pendulum shoulder pads)? **v1.1:** ANSWERED (COACH-R2 R2-SES-02): counted = barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings; not counted = leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps; goblet / hack / pendulum fine on the second day if not sore.
8. Level 1 vs Level 2 (PRG-05): after how many months of consistent training does a client move from Level 1 to Level 2? **v1.1:** not asked in round 2; still open.
9. Glute credit (VOL-09, UNI-01): you count a lunge "mostly for quads". For hinges (RDL, deadlift, single-leg RDL), should a set count fully for hamstrings and half for glutes (the current proposal), fully for both, or as a 0.25 helper for glutes? Hip thrusts and bridges would count fully for glutes. **v1.1:** ANSWERED (COACH-R2 R2-VOL-05): a quarter set for glutes on squats, lunges, deadlifts and RDLs; hip thrusts and bridges count fully; KB swings count nothing (ballistic).

### 9.3 New questions raised in v1.1

1. Neck work (sport expansion): collision and grappling sports usually train the neck. Should neck exercises be part of your programs for football, wrestling, rugby, hockey, BJJ and MMA, and should they count toward a muscle group? (PROPOSED node RP.SM.NECK.)
2. Jerks (F.OLYFAM): you split Olympic days into clean days (squatty) and snatch days (hingy). Where do push / split jerks go - with the cleans, with the snatches, or as their own overhead-power piece?
3. HYROX / CrossFit stations (wall balls, sled pull, burpee broad jumps): conditioning items (CA) or athletic work (AP.THR, AP.JMP) when a gen-pop client trains for a HYROX race?


---

## Appendix A. Science references

- **SCI-1** Israetel M, Davis M, Feather J, Hoffmann J - Scientific Principles of Hypertrophy Training (Renaissance Periodization, 2021). (Chad Wesley Smith co-wrote the earlier *Scientific Principles of Strength Training*, 2015, not this book.) Muscle-specific volume landmarks (MV, MEV, MAV, MRV), weekly sets per muscle, set progression across a mesocycle then deload, stimulus-to-fatigue ratio (SFR). Basis for counting sets per MUSCLE and for small muscles tolerating more sets/frequency.
- **SCI-2** Schoenfeld BJ, Ogborn D, Krieger JW (2017) J Sports Sci 35(11):1073-1082 - dose-response of weekly sets and hypertrophy. Graded dose-response: 10 or more sets/muscle/week produced more growth than fewer than 5 or 5-9. This is consistent with the coach's 15-20 sets/muscle/week target but does not establish it on its own: the meta-analysis did not test 15-20 as a separate band.
- **SCI-3** Baz-Valle E et al. (2022) J Hum Kinet 81:199-210 - training volume and hypertrophy. Suggests ~12-20 weekly sets per muscle as a practical range for trained people.
- **SCI-4** Schoenfeld BJ, Grgic J, Van Every DW, Plotkin DL (2021) Sports 9(2):32 - the repetition continuum re-examined. Hypertrophy is similar across a wide load range (roughly 6-30+ reps) when sets are taken close to failure. Supports 'everyone picks between 5 and 30 reps' and higher reps for isolation/small muscles.
- **SCI-5** Refalo MC et al. (2023) Sports Med 53:649-665 - proximity to failure and hypertrophy. Sets need to end reasonably close to failure; supports the coach's 1-3 RIR rule and the EFFORT '8 - That was perfect' bullseye.
- **SCI-6** Zourdos MC et al. (2016) JSCR 30(1):267-275; Helms ER et al. (2016) SCJ 38(4):42-49 - RIR-based RPE. RPE 10 = 0 RIR, 9 = 1 RIR, 8 = 2 RIR, 7 = 3 RIR. On this scale the coach's 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+' (ALL ABOUT SQUATS A13) is loose, because 1 RIR = RPE 9. His '1-3 RIR ... aka RPE 7+' (UL/PPL A6) matches. Keep his labels verbatim and store RIR as the primary field.
- **SCI-7** Davidson P - Rethinking the Big Patterns (RTBP) course and the book *A Coach's Guide to Optimizing Movement* (the coach's named source for the zones, COACH-ANSWER CAT-04 / CAT-10), and his teaching. Movement understood through positions, reference points/constraints, relative pelvis-thorax motion, hip internal/external rotation ('into'/'out of' a hip) and planes; load position and stance change the demand. Basis for bucketing big movements and athletic work by BIOMECHANICS rather than muscle. v1: the coach's zones (vertical = external-rotation bias; horizontal zone 2 = internal-rotation bias, compressive) are attributed to this book; the zone wording was not found in public summaries, so it rests on the coach's account (`F.DZONE`).
- **SCI-8** Contreras B, Cronin J, Schoenfeld BJ et al. (2013) SCJ 35(2):17-22 - force vectors in hip-extension exercises. Exercises classified by the direction of the load vector relative to the body; parallels the coach's reading of plane as the direction of the force resisted.
- **SCI-9** McGill SM (2010) SCJ 32(3):33-46 - core training. Anti-extension / anti-lateral-flexion / anti-rotation ('static') vs flexion/rotation ('dynamic') - parallels CONTROL PATTERNSCORE's STATIC/DYNAMIC x plane grid.
- **SCI-10** Vleeming A et al. (1995) Spine 20(7):753-758; Lee D - The Pelvic Girdle (myofascial slings). Anterior oblique, posterior oblique and lateral subsystems - the FUNCTIONAL BIOMECHANICS SYSTEM columns.
- **SCI-11** Flanagan EP, Comyns TM (2008) SCJ 30(5):32-38 - fast SSC and reactive strength index. Fast SSC (<250 ms contacts) vs slow SSC; parallels 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' vs 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' and the SSC speed tiers. v1: grounds the coach's ground-contact rule (COACH-ANSWER ATH-01, CAT-10): long contact = ballistic, short contact = plyometric.
- **SCI-12** Dietz C, Peterson B (2012) Triphasic Training. Eccentric -> isometric -> concentric blocks (a reactive/peaking block follows), plus French contrast. The coach's 'TAKING IN FORCES -> DELIVER FORCES FAST -> AMORTIZATION -> REBOUNDING' is a loose parallel in a different order. His 'FRENCH CONTRAST' (ALL ABOUT SQUATS G16) is an outside model he has absorbed.
- **SCI-13** Suchomel TJ, Comfort P, Stone MH (2015) Sports Med 45(6):823-839 - weightlifting pulling derivatives. Pulls from the hang as foundational, catch variations later; matches the TRIPPLE EXTENSION ladder.
- **SCI-14** Sheppard JM, Young WB (2006) J Sports Sci 24(9):919-932 - agility classification. Pre-planned change of direction vs reactive agility - the coach's 'COD: Proactive' vs 'Agility: Reactive' definitions.
- **SCI-15** Seiler S (2010) IJSPP 5(3):276-291 - intensity distribution in endurance training. Intensity zones distributed across the week. Caution: Seiler's evidence favours a POLARISED distribution, with roughly 80% of sessions or time at low intensity and little at moderate. The coach's rule (AEROBIC A5: one blue, one green, one orange session, 3 per week) is an even 1:1:1 split, so it shares the idea of zones but not Seiler's distribution.
- **SCI-16** Henneman size principle (classic motor-unit physiology). Motor units are recruited small to large as force demand rises, so heavier loads recruit more high-threshold units. That supports 'HEAVY BARBELL' (ALL ABOUT SQUATS A44). 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (A45/A48) is the coach's own tempo claim and is not part of the size principle. With light loads, moving faster or getting closer to failure also raises recruitment.
- **SCI-17** Stastny P et al. (2015) J Strength Cond Res 29(11):3177-3187 - dumbbell-carrying position in split squats and walking lunges. Contralateral loading raised gluteus medius activity in the dynamic forward lunge but not in the static split squat. Supports the coach's contralateral 'into the hip' use for change-of-direction athletes (CAT-13); via 07_science_lineage.md [P4].
- **SCI-18** Postural Restoration Institute / Bill Hartman / Pat Davidson pressure model (expansion vs compression; via 07_science_lineage.md [P1][D10]). Expansion ~ external rotation, compression ~ internal rotation. The closest public parallel to the coach's zone rotation bias (CAT-10); practitioner model, not peer-reviewed evidence.


## Appendix B. JSON field guide (`01_taxonomy.json`)

| Key | Content |
|---|---|
| `_meta` | sources, evidence tags, counts, integrity check (`unknown_tokens_in_crosswalk` and `retired_ids_still_referenced` must be empty); v1: `v1_coach_answers_applied[]` (ids, change), `v1_pending[]`, `retired_ids{}`, `v1_verification` (adversarial check: method, answers checked, fixes) |
| `coach_statements_in_brief` | the coach's words this taxonomy answers (verbatim, kept) |
| `coach_statements_superseded[]` | v1: chat statements that a questionnaire answer replaced or refined (the size-based 3/5/7 % ramp, VOL-05; the 15-20 sets band, VOL-01) |
| `nodes[]` | `id`, `parent`, `name`, `kind` (family/pattern/track/lane/vector/subtype/region/band/format/sling/muscle_bucket/meta), `coach_labels[]` (verbatim + cell), `organizing_lens`, `size_class`, `library[]`, `level_driver`, `dose_unit`, `default_muscle_credit{}`, `status`, `notes`, `program_slot_labels[]` |
| `facets[]` | `id`, `name`, `applies_to`, `question`, `values[]` (`code`, `name`, `coach_labels[]`, `evidence`, `meaning`, optional `status` = dormant / removed), `evidence`, `notes`, optional `status` (F.ACCOM = dormant) |
| `muscles[]` | canonical muscle list with size class, coach labels, primary nodes and exposure nodes |
| `library_column_map[]` | each BYOP library column → blocks (label cell, label, item rows, count, level) → node |
| `item_reassignments[]` | items filed in one column that belong to another node |
| `crosswalk[]` | `group`, `label` (verbatim), `labels_split[]`, `source` (workbook/tab/cell), `context`, `maps_to` (node ids and/or `F.FACET=VALUE`), `relation`, `evidence`, `note` |
| `lenses` | the two named lenses, how they intersect, matrix |
| `gaps_and_contradictions[]` | `id`, `title`, `evidence`, `impact`, `proposal`, `v1_status` |
| `proposed_cleanup` | principles, node changes, record schema, code grammar, `should_not_change` (v1 verification: section 8.5 in machine form) |
| `science[]` | SCI-n references |
| `open_questions[]` | v1: objects `{v0_question, v1_status}` |
| `open_questions_v1_new[]` | new questions raised by the answers (round 2) |
| `open_questions_v1_new_status_v1_1[]` | v1.1: the round-2 status of each of those questions (`index`, `v1_1_status`) |
| `open_questions_v1_1_new[]` | v1.1: new questions raised by the round-2 answers and the sport expansion |
| `_meta.v1_1_round2_applied[]` / `_meta.v1_1_pending[]` / `_meta.v1_1_verification` | v1.1 changelog (ids, change), pending list and verification checks |


## Verification log

An adversarial fact-check on 2026-10-07 checked this file and `01_taxonomy.json` against the raw dumps (`dumps/BYOP`, `dumps/MASTER_MODEL`), the xlsx files and the `analysis/` decodes. Nothing in Google Sheets was touched.

**What was checked**
- Every library cell cited in sections 1.1, 2.2, 6.1 and 6.2. Every block range and item count in the 28-column library map was recounted: 0 mismatches.
- All 436 crosswalk rows that cite an explicit cell, matched label by label against the dumps.
- Every label in all 634 crosswalk rows was searched for in the dumps. The only ones not found are summary rows ("LVL 1 .. LVL 5") and sibling codes (G25).
- The slot table (1.2) against the data validations of all 9 BYOP program tabs.
- Every cited cell in the MM theory tabs: RESISTANCE PATTERNS, BALLISTICS, LUNGES, SQUATS, OLYMPIC, CONTROL, AGILITYCOD, Sheet23, Sheet24, Sheet25, AEROBIC.
- The program examples behind the dose claims: UL, PPL, ATHLETIC, BOXING, 4 TRACKS, CrossFit, BASEBALL.

**Numbers recomputed independently** (python on the dumps / xlsx)

| Claim | Recomputed | Verdict |
|---|---|---|
| Gym levels 76 → 90 → 102 weekly sets | UL: (14+24)×2, (21+24)×2, (24+27)×2 = 76 / 90 / 102, assuming the A and B days each run twice a week (the tab only says 'ADAY'/'BDAY'; 4 days is INFERRED from the Wed/Sat cardio note). PPL with each day once: 47 / 58 / 66 | confirmed (under the 4-day assumption) |
| Athletic levels 89 → 72 → 59 | Sum of the printed SETS cells, excluding medball 'ALL LIST' rows and Tabata: 61 / 51 (+2-4 for '2 to 4') / 44 over 3 / 4 / 4 sessions. 89/72/59 needs the sibling convention (superset components split) | direction confirmed; numbers relabelled as convention-dependent |
| 9 of 33 bilateral-hip options are knee-flexion curls | AN15, AN17:AN19, AN50, AN54, AN91, AN100, AN101 = 9; AN items = 12+10+11 = 33 | confirmed |
| FULL FOCUS LIST = 51 items in 10 groups | 8+9+6+5+2+8+6+3+3+1 = 51 | confirmed |
| BASEBALL fills 43% of calf slots with ankle hops | 42 calf-labelled cells, 40 filled. 16 are hops as printed (40%); 17 after re-aligning the shifted P37 label (42.5%) | confirmed approximately; exact fractions added |
| BASEBALL 'tricep' slots 22% push-up/dip | 8 of 40 filled = 20% as printed | approximately; recount added |
| JSON integrity (88 nodes, 42 facets, 236 values, 634 rows, 896 strings, 25 groups) | identical | confirmed |
| Cardio dropdown B7:B122 in 8 tabs | 8 tabs (00, 01, 03, 04, 05, 06, 07, 08) | confirmed |
| JUSTICE LEAGUE 10 athletic / 10 resistance sets | Monday rows 3-12: 5×2 + 5×2 | confirmed |

**Corrections made** (md and JSON unless noted)
1. X.TEST: B89 is a second 'DISTANCE TEST', not 'SPEED ENDURANCE TEST'. That label exists only in the 'Copy of Copy of MASTER EXERCISE' tab, at B27.
2. Client level vs exercise list: PPL is *not* dose-only. NOVICE gets 'Cable Lat pulldown' (C28); NEWBY and INTERMEDIATE get 'Pull ups or Cable Lat pull down' (G28/K28). Fixed in 2.1, F.CLIENT and G2.
3. F.CLIENT C3 "gym: more sets, fewer reps" was half wrong. UL upper compounds go 8 → 10 → 12 reps as the level rises, while UL lower and PPL go down.
4. "Same green/yellow/red traffic light": the UL/PPL third tier is orange F6B26B.
5. The athletic 89/72/59 figures are now labelled as a counting convention, with the as-printed sums.
6. AESTHETICS weekly sets per muscle (quads 16, glutes 21, …) were presented as "the coach's own doses". Days 3-4 and most of Day 2 are 'CHOOSE 👇', so the figures depend on the sibling's fill assumptions. Relabelled INFERRED with those assumptions.
7. "All 8/8 athletic days" → 12/12: the NO ACCESS - ATHLETIC tab was omitted. The order Plyo → Throwing → COD → Tripple Extension holds on all 12.
8. G7: "G8 + G89 (two blocks both labelled MODERATE)" was wrong. G8 is FOUNDATIONAL; the two MODERATE blocks are G44 (plate hops) and G89 (hurdles).
9. F.SEASON: the same citation (BASEBALL + ALL ABOUT SQUATS + ATHLETIC/BOXING) had been pasted onto every value, but only 'OFF SEASON' occurs outside BASEBALL. Each value now carries its own cells. 'PITCHERS/CATCHERS' (E16) and 'POSITIONS' (F16) are flagged as INFERRED reporting groups, not season phases.
10. F.WEEKTYPE: the same blanket citation was pasted onto every value. Each now cites its own cells: 'A WEEK', 'B WEEK', 'BWEEK', 'A WEEK LOWER' and 'MID DELOAD' exist only in 4 TRACKS.
11. Big-muscle isolation dose (headline 3, F.XCLASS, 3.2): flies have no written dose in BYOP. In the 4 TRACKS strength track every isolation, big or small, is 3 × 8 ('LEG EXT' N12/N20, 'CABLE FLIES' N23, 'SIDE RAISES' N16). The high-rep rule is goal-dependent and must not be hard-coded.
12. F.XCLASS BIG_COMP "4-15 reps" → 2-15. The sheets prescribe strength 4-8 × 2-5 (ALL ABOUT SQUATS D15:E26), main lifts down to 2 reps (4 TRACKS O6:Z6) and 3 × 1 deadlifts (MM ATHLETIC H15:J15). That is below the coach's spoken 5-rep floor.
13. QUADS row-6 colour: AI6 is yellow FFD966, not red. "Red = anterior chain" is now marked INFERRED.
14. Inferences that had been tagged OBSERVED are now tagged INFERRED:
    - the PZONE examples;
    - '5-10-5' (the cell is the date 2005-05-10);
    - the half-kneeling same/opposite mapping of K21:K24;
    - 'Deload' = dead stop;
    - '**MYO SET - ADVANCED' as a client tier;
    - 'suitcase = MODERATE' in F.LOADLAT, which comes from LUNGES; RESISTANCE PATTERNS C19:C22 names no implement.
15. AP.AGI: 'KRUMRIE' / 'MUNOZ FORMATION' were listed as agility labels while the crosswalk maps them to AP.COD. They are footwork drills; the node now lists only the D1 definition and names all five drills in the tab, including the omitted 'EIGHT SQUARE' / 'FOUR SQUARE' formations.
16. Wrong cell citations fixed:
    - MM ATHLETIC A15 / A29 / A30 → C15 / C29 / C30 (column A holds sets);
    - HYBRID C98 is 'KD REPS';
    - CrossFit 'STRNGTH' P12 → P13, and P12:P15 → P13:P16;
    - 'AEROBIC CAP.' "A19 area" → D20 / T20;
    - MYO SET A27 → C27 (A30 = definition);
    - 'MID DELOAD / DELOAD WEEK / DELOAD / TEST' N3:T3 (which holds the % row) → U3 / L35 / L17, L21 / L9, L13.
17. JSON `labels_split` had stripped the coach's trailing and leading spaces in 7 rows. Restored verbatim: 'ZONE 3 ', 'VERY HARD ', 'LIGHT BARBELL ', ' INTERMEDIATE WORKOUTS', ' ADVANCED WORKOUTS', 'Short Duration ', 'FB '.
18. Science:
    - SCI-2 supports ≥10 sets/week, not specifically 15-20.
    - SCI-6: the coach's '(1 RIR) *RPE8+' is loose on the RIR-RPE scale, where 1 RIR = RPE 9.
    - SCI-12: triphasic is eccentric → isometric → concentric; the coach's force phases are a loose parallel in a different order.
    - SCI-15: the coach's 1:1:1 colour rule is *not* Seiler's polarised ~80/20 distribution.
    - SCI-16: the size principle supports "heavy = more recruitment", not "slow eccentric = more recruitment".
    - 2.1 hip mechanics: contralateral load drives the stance hip into adduction and internal rotation, which the abductors and external rotators must control; it is not adductor demand.

**Checked and left unchanged:** library columns, rows 3-6 labels and colours; every level-block range and count; the slot wiring (1.2); the reassignment table (6.2); RESISTANCE PATTERNS, LUNGES, BALLISTICS, OLYMPIC, CONTROL, SQUATS and AEROBIC citations; the boxing claims (weeks 3-8 drop horizontal push and vertical pull; no COD work in MM ATHLETIC, BOXING or BASEBALL); BASEBALL legend B19:F22 and day tags P40/T40/AB40 (Thursday untagged); the full tab names '(NOT DONE) ... EXERCISE(S) LIBRARY', which come from the live sheet names via `analysis/reference` (the xlsx export truncates them to 31 characters).

### Second pass (2026-10-08)

A second adversarial check re-read every cell quoted in sections 0-4, 6-8 and Appendix A against `dumps/BYOP` and `dumps/MASTER_MODEL`. The dumps leave out whitespace-only cells, so those were checked in the raw xlsx (for example the `' '` DAY cell B30 in ATHLETIC and JUSTICE LEAGUE). The JSON was checked against the md. Nothing in Google Sheets was touched.

**Numbers recomputed independently** (python on the dumps)

| Claim | Recomputed | Verdict |
|---|---|---|
| UL weekly sets 76 / 90 / 102 | (14+24)×2, (21+24)×2, (24+27)×2 without the cardio warm-up and A-drills | confirmed |
| PPL weekly sets 47 / 58 / 66 | 15+18+14, 17+20+21, 19+23+24 without the warm-up, A-drills and 'KB Book openers ' | confirmed; exclusions now stated |
| "PPL compounds drop 15 → 10 → 8" | push presses and DB rows 15 → 10 → 8; legs 8 → 10 → 8 (B40/F40/J40); pulldown 15 → 10 → 12 (row 28); dips 8 → 10 → 'MAX' | **wrong for half the lifts**; corrected |
| "Isolation stays at 20 / MAX REPS" | PPL side raises 3×15 → 4×8 → 4×8 (row 17); reverse flies and upright rows 3×15 → 3×10 → 4×8 (rows 27, 29) | **wrong**; corrected |
| MM athletic printed SETS 61 / 51 / 44 | 61 / 51 (+'2 to 4') / 44 without throws; 62 / 91 (+2-4) / 46 with every numeric SETS cell. MID's 51 also drops 20 itemised 2 × 10 throw rows (40 sets), not only 'ALL LIST' rows. Throws per week 210 / 400 / 420 | numbers right, but "the direction holds either way" was **wrong**; corrected |
| 4 TRACKS "every isolation 3 × 8" | '3x8' in N11/N12/N16/N19/N20/N23/N24, but 'TATE PRESS' is '3x20' (N15) | **wrong**; corrected |
| BASEBALL calf slots | 42 labels, 40 filled, 16 ankle hops (17 after the P37 shift) | confirmed |
| BASEBALL tricep slots | 8 of 40 push-up/dip variants | confirmed |
| BASEBALL shoulder slots "30%" | 12 of 40 presses/rows/high pulls/DB snatches (30%); 14 of 40 with push-ups and shoulder taps | confirmed; exact counts added |
| Crosswalk | 432 rows with a parseable cell citation re-matched label against cell value. The only mismatches are summary rows ('LVL 1 .. LVL 5', 'WK 1 .. WK 8', pattern lists) | confirmed |
| Library block counts, FULL FOCUS LIST (51), AN curls (9 of 33), slot table vs validations (all 9 tabs), athletic-first order (12 of 12 days) | recounted | confirmed |

**Corrections made** (md and JSON unless noted)
1. F.CLIENT C3, its note, section 2.1 and the 3.2 BIG_COMP row: PPL reps are now listed lift by lift in a table in 2.1. Pass-1 correction 3 ("UL lower and PPL go down") was itself only half right.
2. F.CLIENT C3, headline 3, F.XCLASS SMALL_ISO, the 3.2 SMALL_ISO row and the node dose fields for RP.SM, RP.SM.DELT, RP.SM.BI and RP.SM.TRI. Small-muscle isolation is not always high-rep:
   - PPL side raises, reverse flies and upright rows drop to 4 × 8 by client level;
   - the 4 TRACKS strength block uses '3x8' for side raises, curls and JM press.
3. 4 TRACKS dose cells (headline 3, F.XCLASS BIG_ISO, 3.2 BIG_ISO, RP.KD.ISO, RP.HD.ISO):
   - The '3x8' dose sits in column N and the exercise names in O:Z. 'LEG EXT' is O12/O20, not N12/N20.
   - 'TATE PRESS' '3x20' (N15) is the exception, so "every isolation, big or small, is 3 × 8" was wrong. Pass-1 correction 11 is superseded.
   - Also added: BOXING weeks 1-2 dose leg extensions and leg curls at 3 × 10, and FAT BURN dose them at 4 × 15.
4. Athletic levels (2.1, F.CLIENT note and C3):
   - Only the non-throw sets fall with level.
   - Medball throws rise 210 → 400 → 420 a week, and with throws counted MID is the biggest level (62 / 91 / 46).
   - The rows excluded from the 61 / 51 / 44 sums are now named.
5. RP.PU.H.ISO and RP.PL.V.ISO "high reps" was presented as observed. It is now INFERRED: the only written fly dose is '3x8' (CABLE FLIES O23, dose N23), and no sheet doses the pull-under on its own.
6. Section 8.4 citations: 'M2/A4' and 'M1' were sibling session codes, not cells. They are now MM ATHLETIC F37 / J41 ('Lateral Step ups IPSILATERAL loading') and F12, plus F41 and J12 (the weighted depth drops). md only, since the JSON has no worked-example table.
7. SCI-1 authors: *Scientific Principles of Hypertrophy Training* (RP, 2021) is by Israetel, Davis, Feather and Hoffmann. Chad Wesley Smith co-wrote the 2015 strength book, not this one.
8. Inferences that had been tagged OBSERVED are now tagged INFERRED:
   - "He later added CARDIO and FUNCTIONAL" and "FUNCTIONAL = newest layer": the sheets carry no dates, and CARDIO is column B.
   - "blue = posterior chain colour": now matches the existing INFERRED tag on "red = anterior chain".
9. RP.KD.BS: added the coach's own machine ratings (ALL ABOUT SQUATS G35:H41).
   - Leg press and pendulum are 'LOVE IT'; pendulum is his 'FAVORITE'.
   - Hack squat is "I PERSONALLY DON'T LIKE IT", and the V-squat is never prescribed.
   - The generator should not treat every "high-capacity machine" in ADVANCED as interchangeable.
10. Crosswalk G20 'shoulders': the rounded 30% is replaced by the exact recount.

**Checked and left unchanged:**
- the client-level labels and colours (UL/PPL A10/E10/I10 and B10/F10/J10, MM ATHLETIC A9/D9/H9, AEROBIC A8/D8/G8);
- the CrossFit level grid (D21:D24, R25);
- every RESISTANCE PATTERNS, LUNGES, BALLISTICS, OLYMPIC, CONTROL, AGILITYCOD, Sheet23 and Sheet25 citation;
- AEROBIC A5/A8:I41 and the A/B/C bands;
- BASEBALL legend, OLY 75-90%, day tags and season cells;
- 4 TRACKS role colours, RPE/sets/reps rows (O4:Z6), week types and HYBRID labels;
- BOXING week colours (FFFF00 → EA9999 → E06666 → CC0000);
- FAT BURN doses and circuits;
- science references SCI-2 to SCI-16 (bibliographic details and the pass-1 relevance notes), and the INFERRED hip-mechanics note in 2.1;
- the throw totals cited in 4.6 (boxer 190-380, generic athletic 210-420, BASEBALL 70-290, with one 0-throw week).

### v1 update (2026-10-08)

The coach's answers (`coach_answers_full.md`, 138 of 140) were applied to this file and to `01_taxonomy.json` with a python script that edits the JSON first and then regenerates every JSON-mirrored table row that changed (sections 1.1, 2, 2.2, 3.1, 5, 6.1, 6.2, 7), so the md and the JSON agree. Prose sections were edited by hand. Nothing in Google Sheets was touched.

**Checked**
- JSON integrity: every crosswalk target resolves to a node or facet value (prefix codes like `HK_*` / `FEET_*` allowed); no row still references `RP.HD.ISO` or `F.PZONE`. Counts: 90 nodes, 44 facets, 243 values, 641 crosswalk rows, 905 label strings, 18 muscles, 44 item reassignments.
- Cells cited for the new v1 rows were re-read in `dumps/BYOP/09_MASTER_EXERCISE_LIBRARY.txt` and `dumps/MASTER_MODEL/`: GHD AN48 / AN93 (side views AO11 / AP11); 'Alternating DB Deadlifts' AQ13, 'Alternating  Barbell Deadlifts' AQ15, 'Camporini Deadlifts' AQ16; 'Single Leg Get Ups' AL14; 'Low DB Squats' AI15; back squats AI49 / AI50 (MODERATE); leg press AI98, pendulum AI99 (ADVANCED); hip thrust machine AN51; 'Standing DB Press' AA50 / AA51; 'Seated Db Bicep Curls' AS14 / 'Seated DB Curls ' AS16; 'Side Plank ' P9 / O47 and 'Side Planks ' S9 / R46 / O164; '21.6 mile run' B33 / B98; 'Assisted  Pull-Up w bands' U15; banded box squats AI92 / AI93 / AI95 / AI96; RESISTANCE PATTERNS 'Kong Rows' G77, 'Lat pull unders' E67, strap A54:A55, banded items A26 / A27 / A29 / A30 / A40 / A47 / A48; BALLISTICS reverse-banded D34:D40; 4 TRACKS 'Pull under' O48:V48 / O64:V64.
- Davidson zones: a web search (2026-10-08) found no public description of the coach's zone wording; the facet therefore cites the coach's answers and marks the angle cut-offs INFERRED.

**Not changed:** OBSERVED labels, colours and cell citations; BYOP block labels where they disagree with the coach's level rule (kept for traceability, the generator follows the rule).

## v1 verification log

*Adversarial check of the v1 update (2026-10-08): this file, `01_taxonomy.json`, and the Davidson-zones and contralateral / ipsilateral parts of `07_science_lineage.md`. `coach_answers_full.md` (all 140 entries) and `coach_answers.md` were re-read in full first. Every edit was made in place: tables, examples and JSON fields, not only this log. Nothing in Google Sheets was touched.*

**Answers relevant to the taxonomy, and how each is now reflected**

| Answers | Where they live | Result of the check |
|---|---|---|
| CAT-01, CAT-03, CAT-05, CAT-06, CAT-07 | 0, 4.1-4.3, F.LEVEL, F.CLIENT, 6.1, 8.1, 8.3 | correct |
| CAT-02 (size classes) | F.SIZE, 3.1, muscles[] | correct; front delts / traps / adductors / neck PROPOSED, pending |
| CAT-04, CAT-10 (Davidson zones and levels) | F.DZONE, F.LEVEL, F.LOADPOS, F.ZONE_SENSES, RP.KD.BS / RP.PU.* level drivers, 07 1.1 / B16 / C1 / rule 5 | correct: vertical (arms down, overhead, deep squat) = external-rotation bias, horizontal = zone 2 = internal-rotation bias and compressive; in front / low -> on the body -> behind / overhead; machines and cables easier; not for plyos; theoretical. Fixed: the triceps pushdown = zone 1 / overhead = zone 3 mapping was tagged COACH-ANSWER; it is INFERRED from CAT-10 plus the Sheet23 labels |
| CAT-08, CAT-09, LIB-15, LIB-17 | CO.*, RP.LF, 6.2 | correct. Fixed: the crosswalk 'Core' slot now maps to CO.CT, CO.CP or CO.CB |
| CAT-10, CAT-11 (plyo method, not a zone) | F.PMETHOD, F.PHASE, F.ZONE_SENSES, 07 C8 / rule 10 | correct. Fixed: the facet summary table now says ZONE_PLYO is not a zone; record field `plyo_method_default` now says it is only what the exercise name implies, the program phase sets it otherwise, and it is not a fixed exercise property |
| CAT-12, PER-02 | changelog 12, 8.1 principle 5 | Fixed: PER-02 (RIGHT: fixed exercises for 4-6 weeks, then change one or two of grip / stance / implement / ROM / rep range) was missing; added as the use of the variable grammar |
| CAT-13 (contralateral / ipsilateral) | 2.1, F.LOADLAT, 8.4 examples, 07 1.2 / B2 / rule 7 | correct in this file. Fixed in 07: 'weeks 1-4' -> 'the first 2-4 weeks', and 'kept later only if something bothers them' added to B2 and rule 7 |
| UNI-01, UNI-04, UNI-05, UNI-07 | RP.KD.UL, F.LAT, slot table, F.DOSE | correct |
| UNI-02, UNI-03, UNI-10, UNI-06 | F.LAT note, 8.5 | Fixed: UNI-10 (bilateral minimal in season) and UNI-06 (same-pattern pairing for high-level / aesthetics, cross-pattern for bootcamp) were missing |
| UNI-11, ORD-06 | 8.5 | correct; ported to JSON `proposed_cleanup.should_not_change` (8.5 had no JSON twin) |
| UNI-12 | F.PLANE note, G8 | Fixed: was missing (more frontal / transverse unilateral work for basketball, tennis, soccer, MMA) |
| VOL-09 (helpers 0.25) | slot table, nodes, record schema | **Fixed - contradiction left in tables and JSON:** horizontal push and incline gave front delts 1.0 although the coach's own VOL-09 example names bench front delts as a helper. RP.PU.H and RP.PU.M now credit chest 1.0, front delts 0.25, triceps 0.25 (slot table, node rows, JSON `default_muscle_credit`, G5) |
| LIB-14 (thrusters) | changelog 21, pending, RP.PU.V, 6.2, 9.2 Q6 | **Fixed:** the file applied the general 0.25 rule over the thruster-specific RIGHT answer (1.0 quads, 0.5 shoulders), and disagreed with `12_volume_algorithm_v1.md`. Now 0.5, with the round-2 question kept as a confirmation |
| LIB-16, VOL-10, VOL-11, VOL-15, VOL-16, VOL-17 | F.XCLASS, AP nodes, RP.SM.*, F.ROLE | correct (dips 0.5 / 0.5; athletic never counted; 40-rep sets only CrossFit / AMRAP; calves 3 sets every leg day; rear delts own sets; about 2 core exercises) |
| VOL-04, VOL-05, UNI-05 | 3.2, F.SIZE, `coach_statements_superseded` | correct. Fixed: the verbatim brief statement 'ramp 3/5/7% per week by muscle size' in JSON `coach_statements_in_brief` is now marked SUPERSEDED in place |
| VOL-01, VOL-02, VOL-08 | 3.2, 4.6 | correct |
| VOL-03 | F.CONSTRAINT | Fixed: pain rule (cut 30-50 %, machines / split grips, or drop the exercise) added |
| ATH-11, ORD-07, ORD-08, ORD-10, ORD-11 | F.ROLE, CO, X.PREP | correct (core first by default, movable). Fixed in 07: rule 8 still placed core at the end ('athletic days may place core as Part B'); now core first by default, v0 placement marked retired |
| ORD-04 | F.ROLE note | Fixed: missing (an isolation goes first only when that muscle is a priority) |
| ORD-05 | F.DOSE SETS | correct |
| ATH-01, ATH-02, CAT-10 (ballistic vs plyometric) | F.INTENT, 4.6, 07 D1 / rule 9 | correct |
| ATH-04, ATH-05, ATH-06, ATH-09, ATH-10, LIB-07, LIB-13 | 4.6, AP.TEX, AP.THR, AP.COD, F.OLY | correct |
| ATH-07, EQ-14 | F.ABAND note | Fixed: the sheet quote '3 Aerobic capacity workouts per week' stood alone; added 3 / 2 / 4 sessions by client and any erg by calories, time or distance |
| ATH-12 | crosswalk 'OFF SEASON / FRENCH CONTRAST' | Fixed: added (intermediate+, off-season, ~78-85 %) |
| ATH-13, FIX-03 | evidence tags, changelog 29, crosswalk | Fixed: the generic name differed from `04_athlete_profiles.md`; now 'All-around athletic / weekend warrior (non-competitive adults and youth)', profile `weekend_warrior`. A rule now states that tab names appear only as cell citations |
| EQ-01, EQ-02, EQ-08, EQ-12 | F.ACCOM, F.IMPL, F.PERTURB, 6.2, 8.4 | correct in the detail tables. Fixed: the facet summary table listed BAND, HIP_BAND and STRAP with no status; now DORMANT / REMOVED |
| EQ-07 | AP.THR | Fixed: missing; no-medball substitutes (plyo push-ups, fast cable rotations, no-ball slam), never band chops |
| EQ-03, EQ-04, EQ-05, EQ-06, EQ-09, EQ-10, EQ-11, EQ-13, EQ-15, EQ-16 | F.CONSTRAINT, F.IMPL, F.AXIAL, RP.KD.BS, AP.JMP | correct; hack squat is not ranked (sheet opinion kept only as OBSERVED history) |
| PER-04 | F.AXIAL | correct |
| PER-06 | F.LEVEL note | Fixed: missing (move up a level at block end when the lift felt '8 - That was perfect' or easier, no pain) |
| PER-03, PER-05, PER-07, PER-08, PER-11 | F.WEEKTYPE, X.TEST, AP.SPD, F.VOL | correct |
| PRG-05, GEN-02, GEN-04, GEN-08 | F.CLIENT, 1.2, RP.KD.BS | correct (V-squat excluded) |
| PRG-07, PRG-08 | F.DOSE, crosswalk | PRG-07 correct. Fixed: PRG-08 (SCORE = times, rounds or distances) added to the 'WEIGHT USED or SCORE' row |
| LIB-01-LIB-04, LIB-06, LIB-08, LIB-09, LIB-11, LIB-18-LIB-22 | 6.2, nodes, facets | correct (Squat Snatch / Clean / Clean & Jerk; Camporini and strap removed; pull-over; Kong row; low DB squats; box pistol; alternating staggered deadlifts; push-up stick landing box -> floor; marathon flag 26.2 mi; no levels on throws or GHD) |
| LIB-10, LIB-12, PRG-01, FIX-01 | pending lists | correctly left pending / skipped |

**Retired ideas grep (md + JSON, after fixes)**
- size-based 3/5/7 %: every remaining mention says it is retired or superseded (VOL-05).
- 0.5 helper credit: the only 0.5 credits left are dips (LIB-16) and thrusters (LIB-14), plus "was 0.5" history.
- band / chain / weight-releaser substitutes: every banded, chained or reverse-banded item is DORMANT or out of scope, including the summary table; no band substitute is offered anywhere.
- plyo zones as a fixed exercise property: none; F.PMETHOD is an execution method, and the record field is now explicit.
- core after the power block as the default: none in this file; fixed in 07 rule 8.
- sex-based rules: none (0 hits).
- 'Justice League' as a program name: none; the tab name appears only in cell citations, as stated in the evidence tags.
- hack squat ranked last: none; machines are not ranked (EQ-11).
- 6-week = 5 weeks + deload: none (0 hits).

**JSON integrity (python, after fixes).** 90 nodes, 44 facets, 243 values, 641 crosswalk rows. Every crosswalk node token resolves; facet tokens resolve except the prefix wildcards `F.STANCE=HK_*` and `F.BODYPOS=FEET_*` (allowed, as before). Retired ids (`RP.HD.ISO`, `F.PZONE`, `ZONE_ARM`, `FOREARMS_NECK_CUFF`) appear only in "was / replaces" history text. No orphan parents. Every JSON change has its md twin (node rows, facet notes, gaps, item reassignments, changelog, pending, round-2 question, crosswalk notes).

**Davidson zones: checked again.** Two more web searches (2026-10-08) found no public description of Davidson's zone 1 / 2 / 3 wording or of a Hartman zone model with the same rotation biases. The facet keeps citing the coach's answers, with the angle cut-offs INFERRED. The doc's mapping (zone 2 = compression = internal-rotation bias) matches the coach's own words, so it is internally consistent.

**Left open, with a reason**
- Hip-dominant glute credit: this file gives glutes 1.0 (row-6 label 'GLUTES/HAMSTRINGS') and `12_volume_algorithm_v1.md` proposes 0.5. Neither is a coach answer. Both rows are now marked PROPOSED, with a note to reconcile.
- JSON `default_muscle_credit` keys (`lats_upper_back`, lower case) do not match `muscles[].id` (`BACK`, upper case). This is a v0 naming mismatch that the engineer must map; it does not contradict any answer.
- `07_science_lineage.md` outside the zones / contra-ipsi scope is still v0 in places that do not contradict the grep list, for example F3 (knee + pull / hip + push: the coach's reason is now known, UNI-11), F11 (the Front Squat Mon -> Low Bar Back Squat Thu example puts two axial squat days in one week, which PER-04 now avoids) and Q16. These are flagged for the owner of that section; the retired ideas from the grep list (H1, T4, rules 3, 8, 16 and 20, Q8, Q12) were marked in place.

### Pass 2 (2026-10-08): second adversarial check

*`coach_answers_full.md` (140 entries) and `coach_answers.md` were re-read in full. This file, `01_taxonomy.json`, and the Davidson-zones and contralateral / ipsilateral parts of `07_science_lineage.md` were checked again. The grep for retired ideas was also run over the whole of 07, because no other topic owns that file. Every fix was made in place, in tables, examples and JSON fields. The JSON was edited with python (indent and encoding kept; it round-trips byte for byte before the edits). Nothing in Google Sheets was touched.*

**Answers relevant to the taxonomy (all checked):** CAT-01 to CAT-13; UNI-01 to UNI-07, UNI-10 to UNI-12; VOL-01 to VOL-03, VOL-05, VOL-08 to VOL-13, VOL-15 to VOL-17; PER-01 (07 only), PER-02 to PER-09, PER-11; ATH-01, ATH-02, ATH-04 to ATH-07, ATH-09 to ATH-13; ORD-01 to ORD-08, ORD-10, ORD-11; EQ-01 to EQ-16; GEN-01 to GEN-08; LIB-01 to LIB-22; PRG-01, PRG-03 to PRG-12; FIX-01 to FIX-04. The 12 answers not cited before the log (UNI-08, UNI-09, VOL-04, VOL-06, VOL-07, VOL-14, VOL-18, PER-10, ATH-03, ATH-08, ORD-09, PRG-02) are about dosing, session time or programs, not about categories. They live in 03, 05, 06 and 12.

**Problems found and fixed in this pass**

| # | Answer(s) | Problem | Fix (where) |
|---|---|---|---|
| 1 | VOL-09, UNI-01 (no answer on glutes) | Hinges still gave glutes **1.0** (v0 reading of row-6 'GLUTES/HAMSTRINGS'). `03_volume_dosing.md` names this exact map as the retired v0 analyst map, `12_volume_algorithm_v1.json` counts hinge glutes at 0.5 (PROPOSED), and `02_exercise_catalog.json` uses 0.25. That made three different values, and the taxonomy's was the retired one. | RP.HD / RP.HD.BS / RP.HD.UL now give hamstrings 1.0 and glutes 0.5 (PROPOSED - PENDING COACH APPROVAL, the counting engine's value). Hip-thrust / bridge items give glutes 1.0 at exercise level. Knee-dominant nodes add adductors 0.25 (PROPOSED, as in 12). Fixed in: slot table 1.2, node rows 1.1, RP rule, muscles table 3.1 (GLUTES, ADDUCTORS), changelog 21, pending list, JSON `nodes[].default_muscle_credit` / notes, `muscles[]`. The 02 catalog's 0.25 is flagged for the catalog owner. |
| 2 | VOL-09 | Section 3.2 said the v0 AESTHETICS figures (glutes 21) "would fall slightly" under the 0.25 helper credit. In fact glutes fall to about 9 (03 section 3). | Now labelled as retired v0 figures, with the v1 recount from `03_volume_dosing.md` (quads 16, hamstrings 16, glutes 9, chest 6, back 12...). |
| 3 | LIB-14 | Record schema `muscle_credit` listed 0.5 only for dips. | Now also lists thruster shoulders (LIB-14) and hinge glutes (PROPOSED). md 8.3 + JSON `record_schema`. |
| 4 | CAT-04, CAT-05, CAT-10 | F.DZONE gave Z3 "default L3" with "deep squat" in the same cell. A generator could rate any deep squat ADVANCED, but a goblet squat is foundational (CAT-04). The deep squat's zone number was also presented as the coach's word, while he only groups it with the vertical, external-rotation positions. | Z1-Z3: the zone sets the default level for the **arm** position only, and lower-body level follows load position (F.LOADPOS). Deep squat = zone 3 is now marked INFERRED. Fixed in: F.DZONE, ZONE_DAVIDSON, 2.1, goblet worked example 8.4, JSON. The same INFERRED mark was added in 07 (1.1 zone row, changelog 1). |
| 5 | ORD-08, ATH-11 | F.ROLE gave the order core -> plyo ..., while PRIMER also said "first". | Order is now warm-up (always written) -> core (doubles as the specific warm-up, movable) -> plyo / ballistic -> Olympic / power -> strength -> accessories. That the short warm-up comes before core is INFERRED. md + JSON. |
| 6 | EQ-01, EQ-12 | F.PHASE P4 ('REVERSE BANDED HOPS/JUMPS') and F.STANCE TALL_KNEEL ('kneeling cable or banded') had no dormant mark. | Both now say the band variant is DORMANT. md + JSON. |
| 7 | CAT-11 | Gap G7 still said "plyo zones ... live only in the theory tab". | Now: the Sheet23 'ZONE 1/2/3' steps, a plyo execution method, not a zone and not an exercise property. md + JSON. |
| 8 | PRG-05 | G2 said "'NOVICE' sits below 'NEWBY'" next to "NOVICE = NEWBY". | Clarified: the columns map to Level 1 / 2 / 3 by position, and as words novice and newbie mean the same beginner. Fixed in G2 and the crosswalk row 'NOVICE / NEWBY / INTERMEDIATE'. md + JSON. |
| 9 | PRG-04, PRG-06 | F.CLIENT and the 2.1 rep table presented STARTING / MID / ADVANCED only as client levels. They also presented the UL upper-day rep rise 8 -> 10 -> 12 as a pattern, which the coach calls "probably a fill error". | F.CLIENT note and 2.1 now carry both answers: the levels-or-blocks reading ('depends'), and one sound progression rule, so the fill error is not copied. md + JSON. |
| 10 | ATH-11 | Crosswalk row 'Part B' (BASEBALL core after the power block) had no note. | Note added: not the default; core first by default, movable. md + JSON. |
| 11 | PRG-09, PRG-10, PRG-11, PRG-03, PRG-12, PER-09, VOL-02, FIX-02, GEN-05, GEN-03 | Confirmed answers still tagged INFERRED or missing: 'Thursday untagged' (now strength); FULL TIME / HALF TIME (competitor / class member); FAT BURN circuits (a finisher); bootcamp circuits (3-5 rounds x 30-50 s, 5-7 stations, 35-45 min); Hinshaw plan used as-is; Olympic % template; priority muscle +4-6 sets, cap ~25-30; cardio dropdown extension; EFFORT / HOW IT FELT adjust rules. | F.DAYINTENT STRENGTH, crosswalk rows, CA.CIRC, X.FOCUS, AP.TEX dose, G11, F.DOSE EFFORT / FEELING, 4.5. md + JSON. |
| 12 | GEN-01, GEN-06, GEN-07 | The one-record-per-exercise schema had no Spanish name, video link or coach cue field. | Fields `name_es` (PROPOSED), `video_url` and `coach_cue` added. md 8.3 + JSON `record_schema`. |
| 13 | UNI-02, UNI-03 | F.LAT only pointed to the bilateral:unilateral dial. | It now states the coach's numbers: bodybuilders / powerlifters about 50/50 -> 80/20-90/10, field / COD athletes about 80-90 % unilateral, upper body the same, pain adjusts, adjustable. md + JSON. |

**07_science_lineage.md: retired ideas still written as active rules (missed by pass 1, now marked in place)**
- Variable resistance as a live generator rule: B10 ("bands/chains for ADVANCED barbell lifts"), D5 (reverse-banded jumps), D7, H11, rule 23 ("bands/chains may appear from week 1") and rule 31 (the whole accommodating-resistance rule). All are now DORMANT (EQ-01, EQ-12), and contribution 2 is noted as dormant.
- Hack squat deprioritised: B15 ("deprioritise hack squat") and rule 26 ("deprioritizations (hack squat) are hard filters"). Both now say machines are not ranked (EQ-11, NOT RIGHT). The V-squat exclusion stays (GEN-08).
- 6-week = 5 + deload: rule 21 (plan shapes) and H4. Both are rewritten to PER-01 (NOT RIGHT): 4-6-week maintenance / transition at about 50-70 % volume; 8 = 4 adapting + 4 driving hard; 12 = 2-4 + 4-6 + hardest last weeks [v1.1: these plan shapes are retired - every plan is a stairway, COACH-R2 R2-PER-03 / R2-PER-04]; repeated cycles start one level higher; week-by-week and yearly modes. The opening line now says "the generator", not "the 6/8/12-week generator".
- Core after the power block: F1 now notes that the BASEBALL Part B placement is not the default (ATH-11); rule 8 was already fixed.
- Other direct contradictions fixed while there: T3, rule 27, F11, Q11 and section 0 #6 (variation default 'weekly_AB' and the two-axial-squats example), now PER-02 / PER-03 / PER-04. D7, T7, rule 12 and Q7 (contrast: off-season only, intermediate+, 78-85 %, no rest within, ATH-12). Rule 25 (aerobic sessions 3 / 2 / 4 by population, ATH-07; the 4-session case breaks the one-of-each-colour rule, flagged). F3, rule 30 and Q16 (the coach's reason for knee + pull / hip + push, UNI-11, ORD-06). D16 (Thursday = strength, PRG-09).

**Retired-ideas grep after the fixes (01 md + JSON + whole 07)**
- Size-based 3/5/7 %: only as "retired / superseded" (01 changelog 23, F.SIZE, 3.2, `coach_statements_superseded`; 07 H1, T4, rule 20, Q12).
- 0.5 helper credit: none. The only 0.5 credits are dips (LIB-16), thruster shoulders (LIB-14) and hinge glutes (PROPOSED, a secondary-mover value from the volume engine, not a helper value), plus "was 0.5" history.
- Band / chain / weight-releaser substitutes: none active. Every banded or chained item, including the facet values, F.PHASE P4, TALL_KNEEL, the 07 rules and the generator columns, is DORMANT or out of scope. No band substitute is offered (EQ-07, EQ-08: never band chops, no banded leg extensions).
- Plyo zones as a fixed exercise property: none. F.PMETHOD is an execution method, `plyo_method_default` is name-implied only, and G7 has been fixed.
- Core after the power block as the default: none. The remaining 'Part B' mentions are OBSERVED BASEBALL citations, and each now carries the ATH-11 note.
- Sex-based rules: 0 hits in 01; in 07 the only hit is a study title (S27, male football players).
- 'Justice League' as a program name: none. Every mention is a cell or tab citation, under the evidence-tag rule; the generator name is 'All-around athletic / weekend warrior', matching 04.
- Hack squat ranked last: none in 01; in 07 it is retired in B15 and rule 26. The sheet opinion is kept as OBSERVED history.
- 6-week = 5 weeks + deload: none in 01; in 07 it is retired in rule 21 and H4.

**JSON integrity (python, after the fixes).** 90 nodes, 44 facets, 243 values, 641 crosswalk rows, 905 label strings, 18 muscles, 44 item reassignments. Every crosswalk node and facet token resolves (prefix wildcards `HK_*` and `FEET_*` allowed). Retired ids appear only in "was / replaces" text. No orphan parents. No node gives glutes 1.0. Every node note, facet note, facet value meaning, crosswalk note and record-schema line touched in this pass has an identical md twin. Five older text pairs differ only in wording (AP.AGI note, F.SEASON note, the shoulders crosswalk note, G2 and G7 evidence); the meaning is the same.

**Davidson zones.** Two more web searches (2026-10-08) for Davidson's zone wording, and for the expansion / compression ↔ external / internal rotation pairing, found no public source. The zones stay "the coach's account of the book". The rotation-bias pairing matches the coach's own words (zone 2 = internal rotation, compressive), so the model is internally consistent but not externally verified.

**Left open**
- Hinge glute credit: 0.5 (12, now also 01) vs 0.25 (02 catalog); no coach answer. Ask in round 2.
- With 4 aerobic sessions a week for aesthetics clients (ATH-07), the sheet rule "one of each colour, never the same colour twice" cannot hold. Which colour the 4th session takes is open.
- `default_muscle_credit` keys (lower case) vs `muscles[].id` (upper case): a v0 naming mismatch for the engineer to map.

## v1.1 verification log (2026-10-08)

Built by two re-runnable python scripts that start from the untouched v1 files (`apply_tax.py`, `apply_tax_b.py`, kept in the builder's scratchpad); every edit is applied to the markdown and to the JSON together, and the v1 changelog, pending list and verification logs are annotated, never rewritten. Nothing in Google Sheets was touched.

**Counts.** 91 nodes (+ RP.SM.NECK), 47 facets (+ F.OLYFAM, F.SPINEDAY, F.DETAIL), 255 facet values, 641 crosswalk rows (unchanged), 45 item reassignments (+ the bench push-up split). Crosswalk tokens that do not resolve to a node or facet: none. Orphan parents: none.

**Retired ideas - grep of the live text (markdown outside the history blocks / JSON outside the history keys).**

| retired idea | markdown | JSON |
|---|---|---|
| 'name pending' / 'NAME PENDING' for the plyo axis | 0 | 0 |
| LIB-10 / LIB-12 'unanswered' or 'PENDING' | 0 | 0 |
| hinge glutes 0.5 as a live value | 0 | 0 |
| level 'read through' Davidson zones | 0 | 0 |
| 21.6 mile run as a test | 0 | 0 |
| older 'few plyos unless they ask' as a live rule | 0 | 0 |
| bands as an active option | 0 | 0 |

**Round-2 answers checked against this file.** R2-LIB-01 (F.DETAIL, principle 5), R2-LIB-02 / R2-LIB-03 (F.LEVEL, F.DZONE, F.ZONE_SENSES, section 0, 2.1, RP.PU.V / RP.PL.V / RP.PU.H drivers, G3), R2-LIB-04 / LIB-10 (RP.PL.V, RP.SM.DELT.REAR, U20, G4, 9.1 Q4), R2-LIB-05 / LIB-12 (RP.PU.H, new reassignment row), R2-LIB-06 (X.TEST, B33 / B98), R2-LIB-07 (RP.KD.BS, RP.PU.V, RP.PL.H, RP.SM.BI, AP.TEX), R2-LIB-08 (RP.HD.UL, slot table, crosswalk, library map, G16), R2-VOL-05 (RP, RP.HD.BS, RP.HD.UL credits, slot table, thrusters, AN20, SPEED SPECIALS, 8.3), R2-VOL-07 / R2-PER-06 / R2-PER-07 (F.WEEKTYPE, F.SEASON, X.TEST), R2-SES-01 / R2-SES-02 (F.AXIAL, F.SPINEDAY, RP.KD.BS, G16, 8.4), R2-SES-03 / R2-SES-04 (F.ROLE), R2-SES-06 (F.ABAND), R2-ATH-01 / R2-ATH-02 (F.INTENT, AP.JMP, 2.1, 4.6), R2-ATH-03 (F.PMETHOD, 2.1, G7, 8.2, 8.3), R2-ATH-04 / R2-ATH-05 / R2-GEN-06 (AP.TEX, F.OLY, F.OLYFAM), R2-ATH-07 (F.SEASON), R2-ATH-08 (AP.TEX, AP.JMP, F.OLY, 2.1), R2-GEN-02 / R2-GEN-08 (8.3 video and Spanish fields). Not taxonomy items: R2-VOL-01 to R2-VOL-04, R2-VOL-06, R2-VOL-08, R2-PER-01 to R2-PER-05, R2-SES-05, R2-GEN-01, R2-GEN-03, R2-GEN-04, R2-GEN-07 (they live in the volume, periodization, session and product files).

## v1.1 verification log - adversarial check (2026-10-08)

`coach_answers_round2.md` re-read in full. The first v1.1 pass marked R2-VOL-01 to R2-VOL-04, R2-VOL-06, R2-PER-03 to R2-PER-05, R2-SES-05, R2-GEN-01 and R2-GEN-04 as 'not taxonomy items', but this file still carried the v1 wording on exactly those answers. Every fix below is in the markdown and in `01_taxonomy.json` together (changed JSON values keep the old text in `*_before_check`; the v1 changelog / pending entries now carry `v1_1_status`, matching the markdown annotations). Nothing in Google Sheets was touched; crosswalk and node ids unchanged.

| answer | finding | fix (markdown + JSON) |
|---|---|---|
| R2-GEN-04, R2-VOL-01, R2-VOL-03, R2-PER-03 / R2-PER-04 / R2-PER-05 | F.SIZE note, 3.2 and changelog 23 (JSON: F.SIZE notes, `coach_statements_superseded`, `coach_statements_in_brief`) said the weekly step follows 'the person's state (fatigue, life, response)'. | Rewritten: every plan is a stairway; no check-in = no change; a check-in step comes from effort, completion and pain only. **Resolution flagged:** the approved R2-VOL-01 table is used without its 'life' columns because the coach rejected sleep / stress / life questions (pending list). |
| R2-VOL-02 | F.DOSE EFFORT read '10' only through the old GEN-05 rule. | 10 = 'the max I can do, not a fail' (successful); separate 'failed' option possible; the OBSERVED label "10 - I'm done" stays verbatim. |
| R2-GEN-01 | F.DOSE FEELING: logging 'still open'. | Optional weekly check-in; no lifestyle questions. |
| R2-VOL-04 / R2-VOL-06 | 3.2 kept only the v1 landmarks (beginner 10-12 ...); the glute recount still assumed the PROPOSED hinge 0.5. | Floor of 10 sets per muscle, most people 20-30, caps customizable, 'pro' level to research; the 0.5 recount annotated. **Flag:** rear delts 4 / 6 / 8 own sets vs the floor of 10 (PROPOSED reading: on top of SHOULDERS/TRAPS; pending). |
| R2-VOL-05 | The 3.1 muscles table (JSON `muscles` GLUTES) still credited hinges 'glutes 0.5, PROPOSED' and called thrust / bridge 1.0 PROPOSED - missed by the first pass's 'hinge glutes 0.5 as a live value: 0' grep. | Hinges 0.25 (R2-VOL-05), thrusts / bridges 1.0 approved, KB swings 0. |
| R2-VOL-07, R2-PER-06, R2-PER-07 | F.WEEKTYPE values MID DELOAD / DELOAD WEEK / DELOAD / TEST and F.SEASON DELOAD had no generator meaning; F.CLIENT C4 'LVL 5 = Work up to 1RM' meant just 'test'; SCI-1 / section 4.4 describe a deload inside the mesocycle. | Meanings: OBSERVED label only, never generated inside a block; tests before / at the end, never mid-block; 1RM only after a completed block (5RM / 3RM, 80-90 % efforts for the untrained). SCI-1 / 4.4 annotated. |
| R2-SES-04 / R2-SES-05 | 4.6 session-size row: 'up to 10-12 exercises - about 2 core + ...'. | Up to 12 exercises plus the 2-exercise core block (14); full-body days give every trained muscle 2-4 exercises. |
| R2-PER-03 / R2-PER-04 | v1 log (pass 2) still quoted '8 = 4 adapting + 4 driving hard; 12 = 2-4 + 4-6'. | Annotated as retired (stairway). |
| R2-LIB-01 to R2-LIB-08, LIB-10, LIB-12, R2-ATH-01 to R2-ATH-08, R2-SES-01 to R2-SES-03, R2-SES-06, R2-GEN-02, R2-GEN-05, R2-GEN-06, R2-GEN-08 | Re-checked in their nodes / facets (the first pass's list). | OK |
| Coach request 2026-10-08 (sports) | 4.6 note and changelog 11 point to `04_profiles.json` and the catalog's PROPOSED-ADDITION records; AP.AGI split-step. | OK (the split-step's 60+ no-hop default is recorded in the catalog). |

Retired ideas - live text after the fixes (markdown outside history blocks / JSON outside history keys): acclimation / start-hard / target-seeking 0 / 0; deload inside a block 0 / 0 (DELOAD labels now say 'never inside a block'); life / sleep / stress inputs 0 / 0 (remaining hits are the new 'no sleep / stress / life' statements); effort 10 = fail 0 / 0; KB swing glute credit 0 / 0; one exercise per muscle on full-body days 0 / 0; Olympic once-a-week cap 0 / 0 (F.AXIAL 'once a week' only in the annotated v1 changelog); mid-block tests 0 / 0; 1RM for the untrained 0 / 0; mandatory videos 0 / 0; hinge glutes 0.5 as a live value 0 / 0 (after the muscles-table fix).
