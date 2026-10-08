# Athlete & goal profiles: how emphasis changes by sport and goal

Deliverable 04 of the Blaze Camp model synthesis. Companion machine-readable file: `04_profiles.json` (same folder). Inputs: every program decode under `analysis/programs/` (BYOP aesthetics, 3-day, PPL, bootcamps, athletic, JUSTICE LEAGUE, NO ACCESS copies; MASTER_MODEL upper/lower, PPL, fat burn, athletic off-season STARTING/MID/ADVANCED, boxing build-up, BASEBALL 3 blocks, CrossFit macro and class, 4 TRACKS strength/aesthetics/hybrid, conjugate draft, Sheet24 half marathon), the library and reference decodes (`analysis/library/`, `analysis/reference/`) and the equipment decode. Numbers were recomputed from the decode volume JSONs with the same counting convention; the build scripts and intermediate JSON are in `synthesis/_build_04/` (`python3 render.py` regenerates both files). Nothing in Google Sheets was opened for writing.

## 0. How to read this

* **OBSERVED** = read from the coach's sheets (tab + cell or decoded program). **INFERRED** = analyst reasoning, written so the coach can correct it. **SCIENCE** = external literature (sources in section 12, tagged [S#]).
* Coach labels are quoted verbatim with their typos ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT', 'CLERANCE'); my own names use correct spelling.
* **Unit of work = one working set** (same convention as every program decode: a movement inside a superset/complex counts its own sets; one medball throw line of 10 = 1 set; per-side reps = 1 set). Shares are % of weekly working sets. Because a 19-throw medball list adds 19 'sets' of light work, athletic share is shown both **including** and **excluding** throws.
* **Conditioning is not in sets.** It is counted in sessions per week by the coach's colour code: **A** blue short/high, **B** green moderate 1-3 min, **C** orange long/low, **LC** lactate clearance ('AEROBIC CAPACITY CHEAT SHEET').
* **Category codes** (the coach's slot grammar): `PLYO` = high-amplitude plyos (library 'PLYOS' + 'FULL JUMPING'); `JLK` = low-amplitude / ankle (BYOP library heading 'JUMPING ANKLE' F5 and the ankle-hop block C124-C136; 'JUMPING LIMITED KNEE' is only a MASTER_MODEL Sheet23 heading, E1/G1; squirrel jumps / pogos are put here by the ANALYST - the coach files ' Squirrel jumps' and 'Single leg squirrel jumps' under PLYOS 'ADVANCED' / 'FULL JUMPING' G126-G127 / J9-J10 and Sheet23 'ADVANCED - AP -JUMPING' I2-I3); `THROW` = medball throws ('THROWING'); `COD` = change of direction / agility ('CHANGE OF DIRECTION'); `SPRINT` = sprint / acceleration (NO dedicated BYOP slot today); `TE` = triple extension / Olympic ('TRIPPLE EXTENSION'); `BKD` = 'Bilateral KD'; `BHD` = 'Bilateral HD'; `UKD` = 'Unilateral KD'; `UHD` = 'Unilateral HD'; `HPUSH` = 'Horizontal Push'; `VPUSH` = 'Vertical Push'; `HPULL` = 'Horizontal Pull'; `VPULL` = 'Vertical Pull'; `ISO_QUAD` = 'Leg Extensions'; `ISO_HAM` = 'Leg Curls' / Nordic; `ISO_CHEST` = 'Flies'; `ISO_SIDE` = 'ABdution' (side raises); `ISO_REAR` = 'Reverse Flies' / ER / face pull; `ISO_BICEP` = 'Bicep'; `ISO_TRICEP` = 'Tricep'; `ISO_CALF` = 'Calves'; `ISO_NECK` = neck (NO library column); `ISO_GRIP` = grip / carries / drags (library CARRY / DRAGS columns BA/BB hold only sub-headings, no exercises); `CORE` = 'Core' (CORE THORAX / CORE PELVIS / FUNCTIONAL slings); `FOCUS` = 'Focus 1' / 'Focus 2' (FULL FOCUS LIST).
* **Nominal reps** used only to check that an INFERRED set budget lands in the intended tier: PLYO 8 (high-amplitude contacts per set ('6 to 8 Reps' JUSTICE LEAGUE; depth drops 1x8 MM athletic)); JLK 20 (low-amplitude contacts per set (ankle hops '10/10', squirrel 20-40)); THROW 10 (throws per set (MEDBALL CHEAT SHEET '1' x '10')); COD 7 (planned cuts per set ('6 to 8 Reps' on 'DIG/OUT')); SPRINT 60 (metres at >90% per set (3 x 20 m)); TE 4 (reps per set (Olympic/pull work 2-6)). They do not apply to the OBSERVED profiles, which carry the observed counts.

## 1. Headline findings

1. OBSERVED + INFERRED: the BYOP templates share one resistance skeleton (knee+pull / hip+push, bilateral -> unilateral -> isolation, every pattern 2x/week) and swap the PREFIX: 4-5 athletic slots for athletes, calves/biceps/triceps for physique, cardio slots for bootcamp. The two sport programs he actually wrote are NOT that template: BASEBALL is a Parts A-E grid (ballistics -> core by plane -> optional OLY -> bkd+uhd / bhd+ukd supersets -> buy-out) and BOXING is an upper/lower 3x10 base followed by complex-based full-body days - but both reuse the same 8-pattern vocabulary. Treating a sport profile as a set of dials on the skeleton is therefore an INFERRED modelling choice, not something the coach states.
2. OBSERVED athletic share of weekly working sets (excluding medball throws): 0% in every physique, bootcamp and fat-loss template; 11-17% in the gym UPPER/LOWER and PPL examples (A-drills only); 5% strength/conjugate (one 3x6 'EASY' plyo); 16% HYBRID; 16-22% BASEBALL; 32% BYOP ATHLETIC at the coach's 2-sets dose; 28% -> 19% -> 15% across the MM athletic STARTING/MID/ADVANCED blocks; 36% for the boxer's conversion weeks.
3. OBSERVED medball volume is the largest athletic item in the athlete/fighter programs: 176-192 throws/week in baseball as block means (single weeks 70-290; 45-63% transverse), 190 -> 380 for the boxer, 210 -> 400 -> 420 in the MM athletic blocks (210 and 420 are ASSUMED expansions: the STARTING/ADVANCED cells say only 'ALL LIST', read as the 19-throw ballistics 'MEDBALL CHEAT SHEET' = 17 x 10 + 2 x 20). The BYOP athletic template at 2 sets per slot only delivers about 64-96.
4. OBSERVED high-amplitude plyo contacts: no program's average week exceeds ~151 (strength 18, hybrid ~36, MM advanced 32, MM mid 71, BYOP @2 72-96, baseball block means 103/151/135, boxer 113-129, MM starting 146), BUT single BASEBALL weeks reach 174-201 (8 of 22 training weeks: B1W1 178, B2W2 174, B2W6 174, B2W7 195, B3W1 186, B3W3 190, B3W5 185, B3W7 201); in-season Block 3 alternates ~185-201 weeks with 36-80 weeks. So T4 (161-220) IS observed at week level in the coach's own baseball programming; only T5 (221-320) is an extrapolation, reserved for the sport the coach named as plyo-heaviest (basketball, then volleyball).
5. OBSERVED: the boxer is NOT low on plyo contacts against the generic athlete example (258-306 total/week in weeks 3-8 vs 132-191 for MM athletic MID/ADVANCED). 'Boxers need fewer plyos' shows up as timing (zero plyos in the 2 base weeks), type (single-leg reactive squirrel jumps, jump rope, landings) and packaging (bilateral max-effort jumps - tuck jumps, DB squat jumps, broad jumps - appear only as 5-rep components of the two complexes; outside them it is weighted depth drops x8, single-leg high march jumps 6/6 and drop-into-box jumps x8; 28-32 high-intensity contacts per session vs 48.7 in MM STARTING). The matrix encodes this as a separate high-amplitude and low-amplitude dial. CAVEAT: the high/low split is the ANALYST's - the coach files ' Squirrel jumps' and 'Single leg squirrel jumps' under PLYOS 'ADVANCED' / 'FULL JUMPING' (library G126-G127, J9-J10; Sheet23 'ADVANCED - AP -JUMPING' I2-I3, '*FASTEST SSC*' B43); counted as high-amplitude the way he files them, the boxer's wk3-6 high-amplitude contacts are 248-264/week (wk7 206, wk8 211), still above every MM athletic block counted the same way (STARTING 146, MID 191, ADVANCED 132 once their squirrel and plate jumps - also filed under PLYOS - are moved to high).
6. OBSERVED plyo mix in the only fully written athlete year (BASEBALL, 4,690 lower-body contacts): 75% vertical, 16% horizontal, 9% lateral; 39% unilateral; 6% landings; 39% low-amplitude (ankle hops). Field and court sports in the matrix shift this toward horizontal/lateral and unilateral (soccer 40/30 horizontal/lateral, hockey 45% lateral, football skill 60% unilateral).
7. OBSERVED: change-of-direction work is zero in every MASTER_MODEL program (athletic, boxing, baseball); only the BYOP athletic template has COD (4 slots/week = 48-64 cuts at 2 sets) and its list is mostly the American-football receiver route tree ('FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL') plus 'Shuffles', 'LEFT TEST' and a date-coerced 5-10-5 cell (L92). Sprinting has no BYOP slot at all (only 'Max velocity running' inside PLYOS ADVANCED). Both are the biggest structural gaps for field/court profiles.
8. OBSERVED set counts, INFERRED muscle credit (analyst 1.0/0.5 map, see 5.6): athletes keep legs at 12-26 resistance sets/week (glutes highest under that map) while upper-body muscles often sit at 2-10; only the aesthetics tracks run 15-35 sets on most muscles. The coach's '15-20 sets per muscle' is applied to the muscles a goal cares about, and athletic sets are extra exposure on top.
9. OBSERVED unilateral share of lower-body compound sets: 26-32% strength/conjugate, ~50% in the BYOP 4-day templates (structural; 43% in the 3 DAY BUILDER, 33% in the miswired NO ACCESS copy), 43-47% baseball, 50-75% in the MM athletic blocks (STARTING 55, MID 75, ADVANCED 50) and 63% HYBRID. Unilateral emphasis rises with athleticism; it does NOT rise monotonically with level (MID 75% -> ADVANCED 50%).
10. OBSERVED core-by-plane: BASEBALL rotates 'LATERAL CORE' (Mon), 'Transverse core' (Tue/Fri), 'Sagital core' (Thu) -> 48% transverse, 24% sagittal, 22% frontal sets; BYOP uses plane as difficulty (sagittal = EASY, frontal = MODERATE, transverse = HARD); physique leaves core optional, fat loss trains it only in circuits, strength tracks write none.
11. OBSERVED conditioning by population: physique = colour C 2x/week ('30-40 mi slow/steady CARDIO'); fat loss = C 2x + 2 metabolic circuits (12 -> 33 min work); boxer = one A ('Sprint 20/ Recover 40' 5 -> 8 rounds) + one C (20-40 min); baseball = only short A-type buy-outs (10-39 s, 3-4 bouts/week); HYBRID = one A + one C; CrossFit = C -> C,B -> C,B,A -> lactate clearance by level, 2-4 sessions + 1-4 WODs.
12. OBSERVED: 'level' moves volume in opposite directions by population. Athletes STARTING -> MID -> ADVANCED: working sets -19% and -18%, high-amplitude contacts -51% and -55%, throws +90% and +5%, main-lift reps 6-8 -> 1. Gym clients NOVICE -> NEWBY -> INTERMEDIATE: weekly sets +18-23% and +13-14%, but compound reps move BOTH ways - UPPER/LOWER lower compounds 2x12 -> 3x10 -> 4x8 while its upper compounds go 3x8 -> 3x10 -> 4x12 (reps up); PPL push/pull 3x15 -> 3-4x10 -> 4x8 except pull-ups 3x15 -> 4x10 -> 5x12, PPL legs 2x8 -> 3x10 -> 4x8. Arm and leg isolation stays at 20 / 'MAX REPS'; PPL delt isolation does not (side raises 3x15 -> 4x8).
13. OBSERVED seasons (BASEBALL; the three blocks carry no season label - off-season / pre-season / in-season is INFERRED from their cell dates against the coach's calendars): off-season = new menu every week, '12/10/8/8', OLY introduced late; pre-season = +47% high-amplitude contacts, x3 sprint sets, contrast complexes, OLY 75 -> 90%, resistance flat 74-76 for four weeks then +2.6/+3.8/+3.7% per week over the last three loading weeks, then a DELOAD (-31% resistance, -46% all sets); in-season = flat 4 x 10, no compound below 8 reps, no Olympic lifts, two alternating proven weekly menus; recovery week = arm care + 4 x 10 min easy cardio.
14. OBSERVED combat phasing (boxer): 2-week hypertrophy base (3 x 10 on all 8 patterns, no plyos) -> 6-week conversion (exercise list replaced, contrast complexes of the 'ALL ABOUT SQUATS' 'FRENCH CONTRAST' type - the boxing tab itself never uses that term, 2-week steps, wk 7 accessory mini-deload while the hinge complex / clean & press / row superset rise 3 -> 4 -> 6 sets, wk 8 peak), and horizontal push, vertical pull and arm isolation are removed after the base.
15. OBSERVED injury logic the coach already uses: joint pain -> unilateral and split grips (DB/KB) first; throwers press mostly with DBs/landmine/single-arm (no barbell bench is named, but barbell overhead pressing appears 3 times in the baseball year: 'barbell press' B1W2/B1W3, 'barbell overhead strict press' B2W1); Copenhagen planks appear in the athletic, boxing and baseball programs; machines for low systemic fatigue ('LEG PRESS'/'PENDULUM' 'LOVE IT', 'V-SQUAT' never). SCIENCE adds fixed accessories the matrix wires in: Nordics (-51% hamstring injuries), Copenhagen (-41% groin problems), landing-first neuromuscular training (~-50% ACL in female athletes), jumper's-knee volume caps (44.6% prevalence in volleyball, 31.9% in basketball).
16. MATRIX (INFERRED): 27 profiles and 23 position/phase variants, each written as a weekly set budget per category in the coach's own slot grammar (PLYO, JLK, THROW, COD, SPRINT, TE, 8 resistance patterns, isolations, CORE, FOCUS) so the shares, muscle sets and contact checks are computed, not asserted. Eight profiles are numerically OBSERVED (baseball, boxer, CrossFit, hybrid, strength, aesthetics, fat loss, generic athlete).
17. MATRIX plyo order (high-amplitude tier): basketball and volleyball T5 (~224/week) > football skill, soccer, MMA T4 (168-192) > baseball, boxer, hockey, tennis, kickboxing, sprinter, football big-skill T3 (101-160) > karate/TKD, wrestling, linemen, youth, generic athlete T2 > golf, BJJ, distance, strength, hybrid T1 > physique, fat loss, general population T0. This reproduces the coach's 'basketball > MMA > boxing/karate' statement with the observed boxer as the T3 anchor - which holds ONLY under the analyst's choice to count squirrel jumps as low-amplitude; counted the way the coach files them (PLYOS 'ADVANCED' / 'FULL JUMPING') the boxer's 248-264 high-amplitude contacts/week sit in T5, and the scale would have to be re-anchored (open questions 1 and 3).
18. MATRIX 'more resistance' vs 'more power' axis: linemen (46% compound sets, strength 50%), wrestling/BJJ (pull:push 2.0-2.4:1, neck + grip), powerlifting (89% compound) sit at the resistance end; basketball, volleyball, football skill, soccer, sprinters and karate (athletic sets 46-52% of weekly work, power 35-45% of resistance emphasis) at the power end; baseball, softball, golf and tennis are rotational-power profiles (throws T2-T3, transverse core 45-55%).
19. The coach's set budget per session (OBSERVED: ~19-21 physique, 20 BYOP athletic @2, median 29 baseball, 23-39 boxer component sets) is the hard constraint. The INFERRED off-season budgets land at 25-33 sets per main day for 4-day athlete profiles (upper bound, if core/focus/calves stay on main days; 14-23 for golf, BJJ, distance, youth and general population), i.e. the upper end of what he writes; the generator should scale sets per slot 2 -> 3 by level and season instead of adding slots.
20. Library gaps the profiles need (OBSERVED absence): a SPRINT slot (MACH drills / acceleration starts live in MASTER_MODEL only: Sheet23, the cheat-sheet 'RUNNING WARMUP', UL/PPL A-drills, BASEBALL accelerations), REPS units for contacts / metres / seconds / per-side / 1-3 reps, neck exercises, CARRY and DRAGS library items (headings exist with sub-headings only; carries are programmed in BASEBALL, drags nowhere), a rear-delt/external-rotation slot for throwers, reactive agility drills, and equipment tags.

## 2. OBSERVED: what each population actually gets in the coach's programs

### 2.1 Share of weekly working sets

Representative programs (BYOP templates at the stated set assumption; MASTER_MODEL programs as written, with the decode's assumptions where a cell was blank). Lower uni % = unilateral share of lower-body compound sets.

| program | population | weekly sets | athletic % excl. throws | athletic % incl. throw-sets | compound % | isolation % | core % | focus % | lower uni % | knee/hip sets | push/pull sets | compound:iso |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated) | aesthetics / physique | 102 | 0 | 0 | 51 | 31.4 | 5.9 | 11.8 | 50 | 16/16 | 16/12 | 1.6 |
| BYOP 3 DAY BUILDER (+optional) | aesthetics 3-day | 80 | 0 | 0 | 48.8 | 17.5 | 11.2 | 22.5 | 42.9 | 12/11 | 9/9 | 2.8 |
| BYOP PPL 6-day @3 sets | bodybuilding split | 126 | 0 | 0 | 52.4 | 42.9 | 0 | 4.8 | 50 | 18/18 | 24/18 | 1.2 |
| BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3 | bootcamp / general fitness | 108 | 0 | 0 | 44.4 | 38.9 | 5.6 | 11.1 | 50 | 18/18 | 12/12 | 1.1 |
| BYOP BOOTCAMP 2 (6 sessions) @3 | bootcamp / conditioning | 72 | 0 | 0 | 66.7 | 25 | 8.3 | 0 | 50 | 12/12 | 12/12 | 2.7 |
| BYOP ATHLETIC 4-day @2 (coach dose) | generic athlete | 96 | 31.8 | 37.5 | 33.3 | 16.7 | 4.2 | 8.3 | 50 | 12/12 | 8/8 | 2 |
| BYOP JUSTICE LEAGUE (partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots) | athlete (partly filled example) | 96 | 31.8 | 37.5 | 33.3 | 16.7 | 4.2 | 8.3 | 50 | 12/12 | 8/8 | 2 |
| BYOP NO ACCESS ATHLETIC (as wired) | athlete (hidden copy; UHD miswired to LEG CURLS) | 96 | 31.8 | 37.5 | 29.2 | 20.8 | 4.2 | 8.3 | 33.3 | 12/12 | 8/8 | 1.4 |
| MM UPPER/LOWER NOVICE (4d) | general gym | 88 | 13.6 | 13.6 | 45.5 | 40.9 | 0 | 0 | 50 | 12/12 | 12/12 | 1.1 |
| MM UPPER/LOWER NEWBY (4d) | general gym | 108 | 16.7 | 16.7 | 44.4 | 38.9 | 0 | 0 | 50 | 18/18 | 12/12 | 1.1 |
| MM UPPER/LOWER INTERMEDIATE (4d) | general gym | 118 | 13.6 | 13.6 | 50.8 | 35.6 | 0 | 0 | 46.7 | 22/20 | 16/14 | 1.4 |
| MM PPL NOVICE (6d) | bodybuilding split | 108 | 11.1 | 11.1 | 42.6 | 44.4 | 1.9 | 0 | 50 | 12/12 | 18/12 | 1 |
| MM PPL NEWBY (6d) | bodybuilding split | 136 | 13.2 | 13.2 | 44.1 | 41.2 | 1.5 | 0 | 50 | 18/18 | 20/16 | 1.1 |
| MM PPL INTERMEDIATE (6d) | bodybuilding split | 150 | 10.7 | 10.7 | 48 | 40 | 1.3 | 0 | 46.7 | 22/20 | 24/18 | 1.2 |
| MM ATHLETIC STARTING (3d) | athlete off-season block 1 | 108 | 28.1 | 40.7 | 26.9 | 13.9 | 18.5 | 0 | 55 | 11/18 | 3/6 | 1.9 |
| MM ATHLETIC MID (4d) | athlete off-season block 2 | 112 | 19.4 | 48.2 | 25 | 14.3 | 12.5 | 0 | 75 | 9/11 | 6/6 | 1.8 |
| MM ATHLETIC ADVANCED (4d) | athlete off-season block 3 | 97 | 15.3 | 48.5 | 14.4 | 10.3 | 26.8 | 0 | 50 | 5/7 | 2/2 | 1.4 |
| MM BOXER wk1-2 (base) | boxer | 99 | 0 | 19.2 | 48.5 | 18.2 | 14.1 | 0 | 50 | 18/18 | 12/12 | 2.7 |
| MM BOXER wk7 (mini-deload) | boxer | 142 | 36.5 | 53.5 | 22.5 | 12.7 | 11.3 | 0 | 50 | 16/18 | 4/4 | 1.8 |
| MM BOXER wk8 (peak) | boxer | 174 | 35.3 | 49.4 | 26.4 | 12.6 | 11.5 | 0 | 44.1 | 21/28 | 6/6 | 2.1 |
| MM BASEBALL Block 1 (off-season) | baseball | 107.3 | 15.6 | 22.5 | 41.6 | 25.3 | 10.6 | 0 | 44.4 | 14.3/14.4 | 10.3/8.6 | 1.6 |
| MM BASEBALL Block 2 (pre-season) | baseball | 130.1 | 21.5 | 28.4 | 39.1 | 20.7 | 12 | 0 | 43.3 | 16.6/17.1 | 10.7/9.4 | 1.9 |
| MM BASEBALL Block 3 (in-season) | baseball | 121.2 | 19.4 | 27.1 | 37.5 | 21.9 | 13.5 | 0 | 47.2 | 12.5/16 | 10.5/8.5 | 1.7 |
| MM BASEBALL B2 'DELOAD WEEK' | baseball | 82 | 12.2 | 20.7 | 45.1 | 25.6 | 8.5 | 0 | 49 | 12.5/12 | 6/6.5 | 1.8 |
| MM CROSSFIT class (HALF TIME) | CrossFit class member | 15 | 40 | 40 | 60 | 0 | 0 | 0 | 0 | 3/3 | 3/0 | - |
| MM STRENGTH-8 conjugate | strength / powerlifting | 56 | 5.4 | 5.4 | 89.3 | 5.4 | 0 | 0 | 31.6 | 10.4/8.6 | 16/15 | 16.7 |
| MM STRENGTH-12 (% + RPE) | strength | 58.2 | 0 | 0 | 69.1 | 30.9 | 0 | 0 | 26 | 14.4/14.7 | 11.1/6 | 2.2 |
| MM AESTHETICS-8 (upper/lower) | aesthetics | 65.2 | 0 | 0 | 77.6 | 6.6 | 0 | 15.8 | 50 | 13.7/13.7 | 9.4/13.7 | 11.8 |
| MM AESTHETICS-12 PPL | aesthetics (high volume) | 121.4 | 0 | 0 | 61.1 | 38.9 | 0 | 0 | 45.1 | 25.7/13.3 | 17.1/23.2 | 1.6 |
| MM HYBRID-8 | hybrid | 68.7 | 15.9 | 15.9 | 53.7 | 0 | 18.8 | 11.8 | 62.7 | 10.9/10.9 | 8.6/6.6 | - |
| MM BOXER wk3-6 mean (conversion) | boxer | 153 | 35.7 | 51.6 | 21.6 | 15.7 | 11.1 | 0 | 55.6 | 21/21 | 3/3 | 1.4 |
| MM FAT BURN wk1-4 mean (lifting + circuits) | fat loss / toning | 92 | 0 | 0 | 62.8 | 21.7 | 15.4 | 0 | 48.7 | 22/14.8 | 13/14 | 2.9 |
| MM CROSSFIT competitor - strength months | CrossFit competitor | 52 | 0 | 0 | 79.4 | 20.6 | 0 | 0 | 51.7 | 13/13 | 10.3/10.3 | 3.9 |
| MM CROSSFIT competitor - power months | CrossFit competitor | 21.3 | 100 | 100 | 0 | 0 | 0 | 0 | 0 | 0/0 | 0/0 | - |

Reading (INFERRED): three clusters. (1) **Physique / fat loss / bootcamp**: no athletic work, isolation 19-43% of sets, compound:isolation 1.0-2.9, core optional or circuit-only. (2) **Strength / CrossFit strength months**: 80-90% compound, almost no isolation or athletic work. (3) **Athletes and fighters**: athletic work 15-36% of non-throw sets plus large throw volumes, resistance shrinks toward legs, upper-body pressing is cut for strikers.

### 2.2 Athletic dose by sub-type (weekly)

| program | athletic sets by type | lower-body contacts / week | medball throws / week | COD | sprint | triple extension / Olympic |
|---|---|---|---|---|---|---|
| BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated) | - | 0 | 0 | 0 | 0 | 0 |
| BYOP 3 DAY BUILDER (+optional) | - | 0 | 0 | 0 | 0 | 0 |
| BYOP PPL 6-day @3 sets | - | 0 | 0 | 0 | 0 | 0 |
| BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3 | - | 0 | 0 | 0 | 0 | 0 |
| BYOP BOOTCAMP 2 (6 sessions) @3 | - | 0 | 0 | 0 | 0 | 0 |
| BYOP ATHLETIC 4-day @2 (coach dose) | PLYO 12, THROW 8, COD 8, TRIPLE_EXT 8 | 72-96 high (est.) | 64-96 | 48-64 cuts | none | 8 sets |
| BYOP JUSTICE LEAGUE (partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots) | PLYO 10, JUMP_LIMITED_KNEE 2, THROW 8, COD 8, TRIPLE_EXT 8 | ~60-80 high + ~12-16 low (est.: PLYO 10 / JLK 2 sets x '6 to 8 Reps') | 64-96 | 48-64 | none | 8 ('Power Clean') |
| BYOP NO ACCESS ATHLETIC (as wired) | PLYO 12, THROW 8, COD 8, TRIPLE_EXT 8 | 72-96 (est.) | 64-96 | 48-64 | none | 8 |
| MM UPPER/LOWER NOVICE (4d) | SPRINT 12 | A-drills 72 per leg per lower day (144/wk at 2 lower days) | 0 | 0 | T1 drills 12 sets | 0 |
| MM UPPER/LOWER NEWBY (4d) | SPRINT 18 | A-drills 90 per leg per lower day (180/wk) | 0 | 0 | T1 18 sets | 0 |
| MM UPPER/LOWER INTERMEDIATE (4d) | SPRINT 16 | A-drills 64 per leg per lower day (128/wk) | 0 | 0 | T1 16 sets | 0 |
| MM PPL NOVICE (6d) | SPRINT 12 | A-drills | 0 | 0 | T1 | 0 |
| MM PPL NEWBY (6d) | SPRINT 18 | A-drills | 0 | 0 | T1 | 0 |
| MM PPL INTERMEDIATE (6d) | SPRINT 16 | A-drills | 0 | 0 | T1 | 0 |
| MM ATHLETIC STARTING (3d) | PLYO 17, THROW 19, SPRINT 2, TRIPLE_EXT 6 | 146 high + 0 low (+210 high-knee est.) + 48 upper | 210 (ASSUMED: cell says only 'ALL LIST'; read as the 19-throw ballistics 'MEDBALL CHEAT SHEET', 17x10 + 2x20) | 0 | 2 sets high-knee runs | 6 |
| MM ATHLETIC MID (4d) | PLYO 10, THROW 40, TRIPLE_EXT 4 | 71 high + 120 low | 400 (10 rotational x 2x10, 2 days) | 0 | 0 | 4 |
| MM ATHLETIC ADVANCED (4d) | PLYO 3, JUMP_LIMITED_KNEE 2, THROW 38, TRIPLE_EXT 4 | 32 high + 100 low | 420 (ASSUMED: 2 x 'ALL LIST') | 0 | 0 | 4 ('Power Cleans' 3x3) |
| MM BOXER wk1-2 (base) | THROW 19 | 0 | 190 | 0 | 0 | 0 |
| MM BOXER wk7 (mini-deload) | PLYO 23, JUMP_LIMITED_KNEE 2, THROW 38, SPRINT 4, TRIPLE_EXT 9 | 116 high + 142 low + rope ~720 | 380 | 0 | 4 | 9 |
| MM BOXER wk8 (peak) | PLYO 26, JUMP_LIMITED_KNEE 4, THROW 38, SPRINT 6, TRIPLE_EXT 12 | 116 high + 167 low + rope ~1440 | 380 | 0 | 6 | 12 |
| MM BASEBALL Block 1 (off-season) | PLYO 9, JUMP_LIMITED_KNEE 4.9, THROW 8.7, SPRINT 1, TRIPLE_EXT 0.6 | 103 high + 97 low | 178 (45% transverse) | 0 | 1 set | 0.6 (+16 optional OLY wk6-7) |
| MM BASEBALL Block 2 (pre-season) | PLYO 16.3, JUMP_LIMITED_KNEE 5.6, THROW 11.3, SPRINT 3.1, TRIPLE_EXT 0.6 | 151 high + 89 low | 192 (63% transverse) | 0 | 3.1 sets | 0.6 (+16 optional OLY wk5-8) |
| MM BASEBALL Block 3 (in-season) | PLYO 14.6, JUMP_LIMITED_KNEE 3.9, THROW 11.6, SPRINT 1.8, TRIPLE_EXT 1 | 135 high + 66 low | 176 (60% transverse) | 0 | 1.8 sets | 1.0, no OLY |
| MM BASEBALL B2 'DELOAD WEEK' | PLYO 4, JUMP_LIMITED_KNEE 5, THROW 8 | 90 total | 104 | 0 | 0 | 0 |
| MM CROSSFIT class (HALF TIME) | TRIPLE_EXT 6 | DUBS skill | WOD | 0 | 0 | 6 |
| MM STRENGTH-8 conjugate | PLYO 3 | 18 ('EASY' 3x6) | 0 | 0 | 0 | 0 |
| MM STRENGTH-12 (% + RPE) | - | 0 | 0 | 0 | 0 | 0 |
| MM AESTHETICS-8 (upper/lower) | - | 0 | 0 | 0 | 0 | 0 |
| MM AESTHETICS-12 PPL | - | 0 | 0 | 0 | 0 | 0 |
| MM HYBRID-8 | PLYO 6, TRIPLE_EXT 4.9 | ~36 (3x6 x2, ASSUMED - no sets/reps on the JUMPS rows; the tab's SETS/REPS rows 71-72 would give 24-60, mean ~41) | 0 | 0 | A: 10-15 x 15-30 s | 4-8 'heavy' |
| MM BOXER wk3-6 mean (conversion) | PLYO 26, JUMP_LIMITED_KNEE 3, THROW 38, SPRINT 3, TRIPLE_EXT 9 | 113-129 high + 177 low + rope ~1080 est. (wk3-6; wk7 116 + 142, wk8 116 + 167) | 380 | 0 | 3 sets (high knees in complex) | 9 |
| MM FAT BURN wk1-4 mean (lifting + circuits) | - | jacks/burpees only | 0 | 0 | 0 | 0 |
| MM CROSSFIT competitor - strength months | - | DU skill | WOD only | 0 | 0 | 0 |
| MM CROSSFIT competitor - power months | TRIPLE_EXT 21.3 | DU skill | WOD only | 0 | 0 | 20-24 Olympic sets |
| MM Sheet24 HALF MARATHON (borrowed: 'by CHRIS HINSHAW') | - | 0 (no lifting written) | 0 | 0 | hill sprints 6-10 reps x 8-20 s (wk 1/2/4/6/12) / flat sprints 40-80 m (wk 3/5/8) on some days | 0 |

**BASEBALL plyo / throw / core mix (OBSERVED, per training week, recomputed from the decode's 865 prescription rows (911 entries incl. 46 label-only rows); deload and recovery weeks excluded):**

| block (season) | high-amplitude contacts | low-amplitude contacts | vertical / horizontal / lateral contacts | unilateral contacts | landings | throws sagittal / transverse | core sets frontal / sagittal / transverse |
|---|---|---|---|---|---|---|---|
| B1 off-season (7 wk) | 102.6 | 96.6 | 146.6 / 38.3 / 14.3 | 70.6 | 14.3 | 97.9 / 80.0 | 2.1 / 3.1 / 5.6 |
| B2 pre-season (7 wk) | 151.4 | 89.3 | 200.4 / 28.9 / 11.4 | 97.7 | 12.9 | 70.6 / 121.7 | 3.7 / 3.1 / 7.3 |
| B3 in-season (8 wk) | 135.1 | 66.2 | 134.1 / 35.5 / 31.8 | 78.4 | 12.6 | 69.8 / 106.5 | 3.6 / 4.2 / 8.1 |
| all training weeks (share) | 61% | 39% | 75% / 16% / 9% | 39% | 6% | 43% / 57% | 22% / 24% / 48% (+6% unspecified) |

Classification rules (INFERRED, keyword based): lateral = 'lateral', 'side to side', 'skater'; horizontal = 'broad', 'bound', 'forward', 'hurdle', 'march jump'; unilateral = single leg / split / staggered / lunge / RFE / FFE / march / bound; low-amplitude = the JUMPING LIMITED KNEE bucket, ankle hops, squirrel jumps (squirrel jumps are low-amplitude by ANALYST choice; the coach's library files them under PLYOS 'ADVANCED' / 'FULL JUMPING'). Upper-body plyo push-ups (230 contacts over the year) are excluded.

### 2.3 Conditioning and core as written

| program | conditioning (colour per AEROBIC CAPACITY CHEAT SHEET) | core |
|---|---|---|
| BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated) | 2 'Cardio' slots (client pick) | 2 'Core' slots (client pick) |
| BYOP 3 DAY BUILDER (+optional) | 3 'Cardio' slots | 3 'Core' slots |
| BYOP PPL 6-day @3 sets | none | none |
| BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3 | 2 cardio slots | 2 |
| BYOP BOOTCAMP 2 (6 sessions) @3 | 6 cardio bouts (one per session) | 2 |
| BYOP ATHLETIC 4-day @2 (coach dose) | 2 'Aerobic Capacity' (client colour) | 2 slots (client pick) |
| BYOP JUSTICE LEAGUE (partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots) | 2 slots | 2 slots |
| BYOP NO ACCESS ATHLETIC (as wired) | 2 | 2 |
| MM UPPER/LOWER NOVICE (4d) | 5-min warm-up + optional C Wed/Sat max 40 min | 0 |
| MM UPPER/LOWER NEWBY (4d) | as above | 0 |
| MM UPPER/LOWER INTERMEDIATE (4d) | as above | 0 |
| MM PPL NOVICE (6d) | as above | 'KB Book openers' 1 set/push day |
| MM PPL NEWBY (6d) | as above | 1 set |
| MM PPL INTERMEDIATE (6d) | as above | 1 set |
| MM ATHLETIC STARTING (3d) | optional C Wed/Sat max 40 min | 20 sets (thorax/pelvis/both, frontal side planks) |
| MM ATHLETIC MID (4d) | optional C | 14 sets |
| MM ATHLETIC ADVANCED (4d) | optional C | 26 sets |
| MM BOXER wk1-2 (base) | A '20 sec fast/ 40 sec slow' x1 + C '20 min' x1 | 14 sets |
| MM BOXER wk7 (mini-deload) | A x7 rounds + C | 16 |
| MM BOXER wk8 (peak) | A x8 rounds + C | 20 |
| MM BASEBALL Block 1 (off-season) | buy-outs ~3.3 bouts/wk (A, 10-39 s) | 11 sets/wk; Mon frontal, Tue/Fri transverse, Thu sagittal |
| MM BASEBALL Block 2 (pre-season) | buy-outs ~3.3/wk | 16 sets |
| MM BASEBALL Block 3 (in-season) | buy-outs ~3.8/wk ('1x 30 Sec Fast Run', cal sprints) | 16 sets |
| MM BASEBALL B2 'DELOAD WEEK' | no buy-out | 7 sets |
| MM CROSSFIT class (HALF TIME) | WOD every class day + aerobic LVL 3-4 | skill |
| MM STRENGTH-8 conjugate | none | none |
| MM STRENGTH-12 (% + RPE) | none | none |
| MM AESTHETICS-8 (upper/lower) | C 2 x 30-40 min | none (accessories) |
| MM AESTHETICS-12 PPL | none written | none |
| MM HYBRID-8 | A sprint day + C '15-40 min' + 'AMRAP' 12 -> 20 (row 70, not tied to a day; Sat placement INFERRED) | integrated tri-sets ~13 sets |
| MM BOXER wk3-6 mean (conversion) | A 'Sprint 20/ Recover 40' x5-6 + C 20-40 min + 3 min rope x3 | 16-18 sets |
| MM FAT BURN wk1-4 mean (lifting + circuits) | C 2 x 30-40 min + 2 circuits (12 -> 33 min work) | circuits only (9-15 sets) |
| MM CROSSFIT competitor - strength months | aerobic 2-3 sessions + WODs 0-3 | T2B skill |
| MM CROSSFIT competitor - power months | aerobic 3-4 sessions + WOD days 2-4 (AUG 2 at WOD level 3; SEPT/DEC 4) | skill |
| MM Sheet24 HALF MARATHON (borrowed: 'by CHRIS HINSHAW') | 2 runs/week x 21 weeks: long (C), progression (B/C), intervals (B/A), mile tests wk 10/14, cut-backs wk 3/6/8/12/18, taper wk 21 | none |

### 2.4 Phase, level and season evidence (OBSERVED)

| source | what changes | numbers |
|---|---|---|
| MM athletic STARTING -> MID -> ADVANCED ('First 8 weeks (8wk1) adaptation focus' ...) | volume down, intensity/specificity up | working sets 89 -> 72 -> 59; resistance 44 -> 44 -> 24; high contacts 146 -> 71 -> 32; low 0 -> 120 -> 100; throws 210 -> 400 -> 420 (210/420 ASSUMED from 'ALL LIST'; 400 written as 10 rotational throws x 2 x 10 on 2 days); core 20 -> 14 -> 26; deadlift 3x6 -> 2x6-8 -> 3x1 '1RIR' |
| MM UPPER/LOWER NOVICE -> NEWBY -> INTERMEDIATE | volume up; lower compound reps down, upper compound reps UP | weekly resistance sets 76 -> 90 -> 102; lower compounds 2x12 -> 3x10 -> 4x8; upper compounds (bench, pulldown, OHP) 3x8 -> 3x10 -> 4x12; rows 3x'12/12' fixed; isolation 2-3 x 20 / 'MAX REPS' fixed |
| MM PPL NOVICE -> NEWBY -> INTERMEDIATE | volume up; most reps down | sets per rotation 47 -> 58 -> 66; push/pull compounds 3x15 -> 3-4x10 -> 4x8 except pull-ups 3x15 -> 4x10 -> 5x12 and dips 3x8 -> 3x10 -> 4x'MAX'; legs 2x8 -> 3x10 -> 4x8; delt isolation 3x15 -> 3-4x8-10 -> 4x8; arms 3x20 fixed |
| BOXER wk1-2 -> wk3-8 | base -> conversion | working sets (excl. throws) 80 -> 113 / 113 / 117 / 117 / 104 (wk7) / 136 (wk8); resistance 66 -> 50-68; athletic 0 -> 38-48; throws 190 -> 380; contacts 0 -> 258-306; sprint rounds 0 -> 5,5,6,6,7,8 |
| BASEBALL Block 1 -> 2 -> 3 (season reading INFERRED from dates) | build -> intensify -> maintain | AP_PLYO sets 9 -> 16.3 -> 14.6; sprint sets 1 -> 3.1 -> 1.8; throws 178 -> 192 -> 176; resistance sets/week ~72 -> 74-84 -> 64-76; main lifts '12/10/8/8' -> '8/6/4/4','6/6/5/4' -> 4x10 |
| BASEBALL B2 DELOAD WEEK | deload recipe | resistance 84 -> 58 (-31%); all sets 151 -> 82 (-46%); athletic 1-2 sets; no buy-out; no OLY; everything 3 x 8 |
| CROSSFIT macro A10:M17 | quality sequencing | RESISTANCE -> STRENGTH -> POWER -> TEST per ~4-month block; aerobic & WOD levels 1 -> 4 inside each block |
| 4 TRACKS plan shapes (A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING') | 8- and 12-week products only (no 6-week product is written) | 8 wk = 7 loading + deload/test; 12 wk = 6 + 'MID DELOAD' / 'A WEEK LOWER' + 5; weekly set growth +4.75-5.2% (12-wk tracks) |

### 2.5 The plyo question, answered from the data

The coach's rule: basketball needs the most plyos, MMA a lot (but less than basketball), boxers and karate athletes not that many. The only fighter program in the workbook (boxing) and the generic athlete example give:

| program | high-amplitude contacts / wk | low-amplitude / wk | jump rope (est.) | high-intensity per session | athletic share of non-throw sets |
|---|---|---|---|---|---|
| MM athletic STARTING (3 d) | 146 | 0 | 0 | 48.7 | 28% |
| MM athletic MID (4 d) | 71 | 120 | 0 | 17.8 | 19% |
| MM athletic ADVANCED (4 d) | 32 | 100 | 0 | 8.0 | 15% |
| BOXER wk3-6 | 113-129 | 177 | ~1,080 contacts | 28-32 | 36% |
| BASEBALL B1 / B2 / B3 (block means) | 103 / 151 / 135 | 97 / 89 / 66 | 0 | 26-38 | 16-22% |
| BASEBALL single training weeks | 28-201 (8 weeks at 174-201) | 0-196 | 0 | 7-50 | - |

**Reading (INFERRED):** measured as total contacts, the boxer is not low. What makes the boxer's plyo 'small' is (a) zero plyos in the base phase, (b) max-height bilateral jumps limited to 5-rep sets inside complexes, (c) most contacts are low-amplitude, single-leg, stiffness-type (squirrel jumps 'FASTEST SSC', rope) - but 'low-amplitude' is the analyst's label: the coach files squirrel jumps as PLYOS 'ADVANCED' / 'FULL JUMPING', and counted that way the boxer reaches 248-264 high-amplitude contacts/week in wk3-6. The matrix therefore separates **high-amplitude** from **low-amplitude** contacts and places boxing at T3 high-amplitude in its conversion block (OBSERVED) and T2 in fight camp (INFERRED), karate T2, MMA T4, basketball/volleyball T5. If the coach considers the boxer example 'a lot', the whole scale shifts up by one tier (open question 1).

## 3. Rules the data implies (INFERRED from OBSERVED) - the profile calculus

1. **One skeleton, many dials.** Keep the coach's slot order and pairing; a sport changes (a) how many athletic slots precede the resistance block and which sub-types they are, (b) sets per slot, (c) which resistance slots are dropped or doubled, (d) exercise selection inside each slot (direction, laterality, plane, implement), (e) conditioning colours, (f) season multipliers.
2. **Fixed session budget, redistributed** (OBSERVED: BYOP athletic keeps the ~20-set AESTHETICS session size and pays for 4-5 athletic slots by cutting arm/calf isolation and dropping sets per slot from 3 to 2). Athletic profiles spend 35-52% of weekly sets on athletic work; physique 0%.
3. **Quality first, fast before slow**: plyo -> throw -> COD -> (sprint) -> triple extension -> bilateral -> unilateral -> isolation (OBSERVED in the 8 athletic days of BYOP ATHLETIC + JUSTICE LEAGUE, where core sits on the optional days). BASEBALL Parts A-E put CORE second (ballistics -> core -> OLY -> bilateral -> unilateral + isolation -> buy-out), and MM athletic STARTING puts core first (S3 'Med ball rolls'), second (S2 'Star Supine Cross Connects') and last (S1 'Side Plank presses'), so core position is NOT fixed at the end.
4. **Separate high-amplitude and low-amplitude plyo dials** (boxer finding above). Within each of the four ballistics columns the coach lists bilateral before unilateral, unweighted before weighted, hop before jump (OBSERVED '(NOT DONE) ALL ABOUT BALLISTICS' rows 24-46, tab marked 'UNDER CONSTRUCTION'); the columns 'TAKING IN FORCES' -> 'DELIVER FORCES FAST' -> 'AMORTIZATION OF FORCES' -> 'REBOUNDING ' sit side by side, so reading them as a time sequence (landings before rebound volume) is INFERRED.
5. **Upper and lower ballistics on different days** when athletic volume is high (OBSERVED BASEBALL Part A: 'Upper Ballistics/plyo' Mon/Thu, 'LOWER ballistics/plyo' Tue/Fri; MM MID/ADVANCED alternate jump days and medball days).
6. **Level per slot, not per person** (OBSERVED JUSTICE LEAGUE mixes FOUNDATIONAL landings with ADVANCED power cleans). Population level moves volume down for athletes and up for physique clients (section 2.4).
7. **Rotational and frontal-plane demand is expressed through exercise selection inside existing slots** (OBSERVED: baseball 'In-out of hip' scoops, Copenhagen, lateral step-ups 'IPSILATERAL loading'), plus core plane rotation by day.
8. **Sport specificity by removal** (OBSERVED boxer: horizontal pressing, vertical pulling and arm isolation removed after base; baseball: barbell bench never written; fat loss: no plyometrics beyond 'Jumping Jacks' and 'Burpees' inside circuits).

**Generator assembly steps:**

1. Pick profile (+ variant/position), season phase, client level and plan length (6 / 8 / 12 weeks).
2. Weekly set budget per category = profile.weekly_sets (off-season build baseline) x season multiplier (season_families) x level modifier (athlete ladder or gym ladder).
3. Respect the coach's session budget (OBSERVED): athletic days <= 10 exercises and ~20-30 working sets (BYOP ATHLETIC / JUSTICE LEAGUE; BASEBALL median 9 exercises / 29 sets); physique days ~7 exercises / ~20 sets; optional days 5 slots / ~12 sets. If the budget is exceeded, cut sets per slot first (coach drops 3 -> 2 sets on athletic templates), then isolation slots, never the athletic prefix of an athlete profile.
4. Place slots in the OBSERVED order: plyo -> throw -> COD -> (sprint) -> triple extension -> bilateral lower -> horizontal upper -> unilateral lower -> vertical upper -> isolation (BYOP; core lives on the Wed/Sat optional days); BASEBALL instead puts CORE second: Part A ballistics -> Part B core -> OPTIONAL OLY -> Part C bilateral + upper superset -> Part D unilateral + 2 isolations -> Part E buy-out; knee+pull / hip+push (BYOP) or bkd+uhd / bhd+ukd (BASEBALL); upper ballistics and lower ballistics on different days when athletic volume is high (BASEBALL Part A).
5. Fill each slot from the library column, filtered by: library level for that slot, equipment, injury rules (injury_library), and the profile's plyo direction / laterality / plane targets.
6. Dose reps from the category and the profile rep zone (VOL 1/2/3, STRENGTH, POWER, MYO); athletic slots in contacts / throws / cuts / metres (NOT the BYOP REPS menu, which cannot express them).
7. Progress with the plan-length shapes (OBSERVED 4 TRACKS): 8 weeks = 7 loading + deload/test; 12 weeks = 6 + deload (wk 7) + 5; 6 weeks = the first 6 of the 12-week shape (INFERRED). Athletic blocks step every 2 weeks (boxer); hypertrophy blocks add whole sets every 2-3 weeks (+4.75-5.2%/week average).
8. Audit: resistance sets per muscle vs the profile's sets_big_wk / sets_small_wk; contacts / throws / cuts vs tier ranges; conditioning colours (never the same colour twice in a week for clients on the cheat-sheet rule).

**Level modifiers (OBSERVED ladders):**

| ladder | evidence | per step | rule |
|---|---|---|---|
| athlete_ladder | OBSERVED MM 'EXAMPLE ATHLETIC FULL BODY SPLI' STARTING -> MID -> ADVANCED | working_sets: -19% then -18%; high_amplitude_contacts: -51% then -55%; low_amplitude_contacts: 0 -> 120 -> 100; throws: +90% then +5% (STARTING 210 and ADVANCED 420 rest on reading 'ALL LIST' as the 19-throw MEDBALL CHEAT SHEET; only MID's 400 is fully written); resistance_sets: 0% then -45%; core_sets: -30% then +86%; main_lift_reps: 6-8 -> 6-8 -> 1 (deadlift 3x6 / 2x'6/8' / 'DEADLIFTS (1RIR)' 3x1); sets_per_line: STARTING mostly 3 (range 1-5) -> MID mostly 2 (range 1-4) -> ADVANCED 1-3 | for athletes, a higher level = LESS volume, MORE intensity, more single-leg/reactive and more throws (INFERRED from OBSERVED) |
| gym_ladder | OBSERVED MM UPPER/LOWER and PPL NOVICE -> NEWBY -> INTERMEDIATE | weekly_resistance_sets: +18-23% then +13-14%; compound_reps: NOT one direction: UL lower 2x12 -> 3x10 -> 4x8 (reps down) but UL upper bench/pulldown/OHP 3x8 -> 3x10 -> 4x12 (reps UP); PPL push/pull 3x15 -> 3-4x10 -> 4x8 (down) except pull-ups 3x15 -> 4x10 -> 5x12 and dips 3x8 -> 3x10 -> 4x'MAX'; PPL legs 2x8 -> 3x10 -> 4x8; isolation: arms 20 / 'MAX REPS', leg ext/curl 20 and calves 'MAX REPS' fixed in both tabs; UL side raises/upright rows fixed 3x20; but PPL delt isolation is NOT fixed (side raises 3x15 -> 4x8 -> 4x8, reverse flies and upright rows 3x15 -> 3x10 -> 4x8) | for physique/general clients, a higher level = MORE sets (OBSERVED in every tab); compound reps move both ways (lower-body/PPL compounds down, UL upper compounds up), arm/leg isolation stays at 20/MAX |
| library_level_per_slot | OBSERVED JUSTICE LEAGUE + AESTHETICS fills | - | level is chosen per slot (FOUNDATIONAL / MODERATE / ADVANCED blocks inside each dropdown), not once per athlete; a power-cleaning athlete still gets FOUNDATIONAL landings |

## 4. Tier scales (INFERRED boundaries, OBSERVED anchors)

| dial | T0 | T1 | T2 | T3 | T4 | T5 | observed anchors |
|---|---|---|---|---|---|---|---|
| high-amplitude plyo contacts / week | 0-0 | 1-40 | 41-100 | 101-160 | 161-220 | 221-320 | conjugate STRENGTH-8 'EASY' 3x6 = 18; HYBRID-8 jumps 3x6 x2 (assumed) = 36; MM ATH ADVANCED = 32; MM ATH MID = 71; BYOP ATHLETIC @2 sets (6 slots x 2 x 6-8) = 72-96; BASEBALL B1 off-season = 103; BOXER wk3-8 = 113-129; BASEBALL B3 in-season = 135; MM ATH STARTING = 146; BASEBALL B2 pre-season = 151; BASEBALL single training weeks (range) = 28-201 (8 weeks at 174-201 = T4) |
| low-amplitude contacts / week | 0-0 | 1-60 | 61-120 | 121-200 | 201-320 | 321-600 | BASEBALL B3 = 66; BASEBALL B2 = 89; BASEBALL B1 = 97; MM ATH ADVANCED = 100; MM ATH MID = 120; BOXER wk3-8 = 142-177 (+ jump rope 720-1440 est.) |
| medball throws / week | 0-0 | 1-60 | 61-150 | 151-250 | 251-420 | 421-600 | BYOP ATHLETIC @2 (4 slots x 2 x 8-12) = 64-96; BASEBALL B3/B1/B2 = 176/178/192; BASEBALL single training weeks (range) = 70-290; BOXER wk1-2 = 190; MM ATH STARTING (ASSUMED: 'ALL LIST' = 19-throw MEDBALL CHEAT SHEET) = 210; BOXER wk3-8 = 380; MM ATH MID = 400; MM ATH ADVANCED (ASSUMED: 2 x 'ALL LIST') = 420 |
| planned cuts / week | 0-0 | 1-30 | 31-70 | 71-120 | 121-180 | 181-260 | BYOP ATHLETIC @2 (4 slots x 2 x 6-8) = 48-64; every MASTER_MODEL program (athletic, boxing, baseball) = 0 |
| triple-extension / Olympic sets / week | 0-0 | 1-5 | 6-10 | 11-16 | 17-24 | 25-40 | MM ATH = 4-6; HYBRID-8 = 4-8; CF class = 6; BYOP ATHLETIC @2 = 8; BOXER wk3-8 = 9-12; BASEBALL optional OLY = 16; CF competitor power months = 20-24 |
| sprint metres / week at >90% | none | drills only (A March / A Skip / A Run, falling starts) | 1-150 | 151-300 | 301-600 | 601-1200 | MM UPPER/LOWER + PPL (A-drills 6-9 sets per lower day) = T1; BASEBALL ('30m acceleration sprint', 'accelerations baseball starts') = T2; Sheet24 half marathon hill sprints 6-10 reps x 8-20 s (8x8, 10x8, 8x10, 10x10, 6x10 + 2x20 s) / flat 40-80 m = T2 |

* Tier boundaries are INFERRED, anchored on OBSERVED weekly numbers from the coach's programs (anchors listed). No observed BLOCK MEAN reaches high-amplitude T4, but single BASEBALL weeks do: 8 of 22 training weeks sit at 174-201 high-amplitude contacts (B1W1 178, B2W2 174, B2W6 174, B2W7 195, B3W1 186, B3W3 190, B3W5 185, B3W7 201; in-season B3 alternates ~185-201 weeks with 36-80 weeks). Only T5 (221-320) has no observed week; it is reserved for the jump-dominant sport the coach named first (basketball), so his ordering basketball > MMA > boxing/karate holds by construction.
* Plane need: 0 = none beyond sagittal; 1 = some (warm-up / variety); 2 = regular (1 slot per session); 3 = priority (every session + plyo/COD/core mix).
* Resistance rep zones: **VOL 1** '12-15 Reps' compound / '10-12 Reps' isolation (OBSERVED BASEBALL legend row 20); **VOL 2** '8-12 Reps' compound / '15 REPS' isolation (row 21); **VOL 3** '6-8 Reps' compound / 'MAX REPS' isolation (row 22); **STRENGTH** 2-5 reps, 4-8 sets, '(1 RIR) RPE 8+', '*REST 3-6 MIN BETWEEN SETS' (OBSERVED 'ALL ABOUT SQUATS' strength menu D15:E26); the CROSSFIT 'STRENGTH' levels are higher-rep: FULL TIME 'LVL 1 = 3 SETS x 7' -> 'LVL 4 = 6 SETS x 4', HALF TIME 3x7 -> 3x4 -> 'LVL 5 = Work up to 1RM'; **POWER/SPEED** 1-5 reps fast: contrast / complexes, 'FAST RPE6 or about 60-70%' (4 TRACKS N17/N21), loaded jumps, OLY 3x3-6x3; **MYO** '15/5/5/5/5/5' = 40 reps (OBSERVED 'ALL ABOUT SQUATS' B27 '**MYO SET - ADVANCED' in the free-weight hypertrophy squat menu, explained in A30; also '2 sets LEG PRESS MYO' AESTHETICS-12 and 'MYO SET' leg extensions JUSTICE LEAGUE G12). Restricting MYO to machines/isolation is INFERRED, not the coach's rule.
* Conditioning colours: **A** Blue A4C2F4 'Short Duration '/'High Intensity': '15/45', '20/40', '30/30', '40/20', '45/15' work:rest, 3-8 min between blocks; **B** Green B6D7A8 'Moderate Duration'/'Moderate Intensity': 1-3 min bouts at 1:1-1:3; **C** Orange F9CB9C 'Long Duration'/'Low intensity': '4+ Minutes', active or :30-3 min rest; **LC** 'LACTATE CLEARANCE' surge-and-float (level 4 only); **rule** 'Never do the same color workout in the same week ... one of each color ... total of 3 Aerobic capacity workouts per week' (AEROBIC CAPACITY CHEAT SHEET A5); level unlock C -> C,B -> C,B,A -> LACTATE CLERANCE (CROSSFIT D21:D24).

## 5. The sport / goal matrix

Baseline = **off-season build** week. Apply season multipliers (section 7) and the level ladder for other phases. 'Evidence' says whether the weekly SET BUDGET is OBSERVED (copied from a coach program) or INFERRED (analyst set budget, sized to the coach's session budget, with the rationale in section 6). Even on OBSERVED rows, the H/S/P emphasis %, plane-need scores, contact/throw/cut TARGET ranges and core-plane % are analyst classifications (INFERRED) unless a cell reference or 'observed' note is given (the BASEBALL core-plane % and the observed contact/throw counts are OBSERVED).

### 5.1 Dial overview

| profile | evidence | plyo high tier (contacts/wk) | plyo low (contacts/wk) | throws tier (/wk) | COD tier (cuts/wk) | sprint | triple ext. | resistance emphasis H/S/P % | lower uni % target | plane need F/T (0-3) | core plane % (Sag/Fro/Tra) | conditioning sessions/wk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | OBSERVED + INFERRED/ASSUMED parts | T3 (100-150) | 65-100 | T3 (170-200) | T1 (10-30) | T2 | T1 (T3 with optional OLY) | 45/35/20 | 44 | 2/3 | 24/22/48 | A:3.5 |
| Boxing | OBSERVED | T3 build (OBSERVED, squirrel jumps counted low-amplitude by the analyst; T5 = 248-264 if counted as the coach files them) / T2 camp (INFERRED) (110-130) | 140-180 | T4 (190-380) | T0-T1 (0-30, reactive) | T1 | T2-T3 | 25/35/40 | 56 | 2/3 | 40/30/30 | A:1 C:1 |
| CrossFit - competitor | OBSERVED + INFERRED/ASSUMED parts | T1 (in WODs) (0-60) | 200-500 | T2 (wall balls / slams in WODs) (50-150) | T0 (0-0) | T1-T2 | T4 (power months) / T0 (strength months) | 20/45/35 | 50 | 1/1 | 70/15/15 | A:level 3+ B:level 2+ C:level 1+ LC:level 4 |
| Hybrid athlete (strength - athletic - 'crossfitish') | OBSERVED + INFERRED/ASSUMED parts | T1 (30-40) | 0-0 | T0 (0-0) | T0 (0-0) | conditioning A | T1-T2 | 30/50/20 | 63 | 1/1 | 60/20/20 | A:1 C:1 |
| Powerlifting / max strength | OBSERVED | T1 (18-18) | 0-0 | T0 (0-0) | T0 (0-0) | T0 | T0 | 20/60/20 | 32 | 0/0 | - | none |
| Bodybuilding / aesthetics | OBSERVED + INFERRED/ASSUMED parts | T0 (0-0) | 0-0 | T0 (0-0) | T0 (0-0) | T0-T1 | T0 | 80/15/5 | 50 | 0/0 | 50/25/25 | C:2 |
| Fat loss / body toning | OBSERVED | T0 (0-0) | 0-100 | T0 (0-0) | T0 (0-0) | T0 | T0 | 85/10/5 | 49 | 1/1 | 45/25/30 | C:2 |
| Basketball | INFERRED (observed analog) | T5 (220-300) | 140-220 | T1 (30-60) | T4 (120-160, reactive) | T3 | T2 | 25/40/35 | 55 | 3/2 | 30/35/35 | A:1.5 B:1 C:0.5 |
| Volleyball | INFERRED | T5 (200-280) | 100-160 | T2 (60-100) | T2 (50-70, reactive) | T2 | T2 | 25/40/35 | 50 | 2/2 | 35/25/40 | A:2 C:0.5 |
| American football - skill (WR / DB / RB) | INFERRED (observed analog) | T4 (170-220) | 100-140 | T1 (30-60) | T4 (120-160, reactive) | T4 | T2 | 20/40/40 | 50 | 3/2 | 30/35/35 | A:2 C:0.5 |
| American football - big skill (LB / TE / FB / S) | INFERRED | T3 (130-160) | 60-100 | T1 (50-70) | T3 (80-100, reactive) | T4 | T2 | 25/45/30 | 38 | 2/2 | 35/30/35 | A:2 C:0.5 |
| American football - linemen (OL / DL) | INFERRED | T2 (80-100) | 0-40 | T2 (80-100) | T2 (40-50, reactive) | T2 | T2 | 30/50/20 | 33 | 2/1 | 40/30/30 | A:2 C:0.5 |
| Soccer (outfield) | INFERRED | T4 (160-200) | 100-140 | T1 (10-30) | T4 (120-160, reactive) | T4 | T1 | 20/40/40 | 50 | 3/2 | 30/40/30 | A:1 B:1.5 C:1 |
| Softball | INFERRED (observed analog) | T3 (100-140) | 70-100 | T3 (160-200) | T1 (10-30) | T2 | T1 | 45/35/20 | 46 | 2/3 | 25/30/45 | A:3 C:0.5 |
| Ice hockey (skaters) | INFERRED | T3 (130-160) | 60-100 | T2 (70-100) | T1 (20-30, reactive) | T3 | T2 | 25/45/30 | 50 | 3/3 | 25/35/40 | A:1 B:1 C:0.5 LC:1 |
| Tennis (and racket sports) | INFERRED | T3 (110-140) | 160-200 | T2 (110-150) | T3 (100-120, reactive) | T2 | T1 | 25/40/35 | 55 | 3/3 | 25/30/45 | A:2 B:1 C:0.5 |
| Golf | INFERRED | T1 (20-40) | 30-50 | T2 (80-110) | T0 (0-0) | T0 | T1 | 25/40/35 | 50 | 2/3 | 20/25/55 | B:0.5 C:2 |
| Track sprinter (100-200 m; jumpers as variant) | INFERRED | T3-T4 (140-200) | 160-220 | T1-T2 (50-70) | T0 (0-0) | T5 | T2 | 15/45/40 | 50 | 1/1 | 40/30/30 | A:1 C:0.5 |
| Distance runner (5 km - marathon) | INFERRED (observed analog) | T1 (30-40) | 150-200 | T0 (0-0) | T0 (0-0) | T2 | T0 | 10/55/35 | 50 | 2/1 | 30/40/30 | A:0.5 B:0.5 C:2 |
| Kickboxing / Muay Thai | INFERRED (observed analog) | T3 (110-150) | 160-220 | T3 (220-260) | T2 (35-50, reactive) | T1 | T2 | 20/40/40 | 63 | 3/3 | 25/30/45 | A:1 B:1 C:1 LC:0.5 |
| Karate / Taekwondo | INFERRED (observed analog) | T2 (60-90) | 200-260 | T3 (180-220) | T2 (55-70, reactive) | T2 | T1 | 20/35/45 | 63 | 3/3 | 30/30/40 | A:2 B:1 C:0.5 |
| MMA | INFERRED (observed analog) | T4 (160-200) | 100-140 | T3 (150-200) | T2 (40-50, reactive) | T1-T2 | T2 | 20/45/35 | 42 | 2/3 | 35/30/35 | A:1 B:1.5 C:1 LC:1 |
| Wrestling | INFERRED | T2 (80-100) | 40-60 | T3 (150-200) | T2 (40-50, reactive) | T1 | T2 | 15/55/30 | 39 | 2/3 | 35/30/35 | A:1 B:1.5 C:1 LC:1 |
| BJJ / submission grappling | INFERRED | T1 (30-40) | 0-40 | T2 (60-80) | T0 (0-0) | T0 | T1 | 30/50/20 | 41 | 2/2 | 40/30/30 | A:0.5 B:1.5 C:1 LC:0.5 |
| General population / longevity | INFERRED (observed analog) | T0 (0-0) | 0-40 | T1 (20-40) | T0-T1 (0-20) | T1 | T0-T1 | 60/25/15 | 50 | 1/1 | 40/30/30 | B:1 C:2 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | INFERRED | T2 (50-80) | 60-100 | T2 (50-80) | T2 (35-50, reactive) | T2 | T1 | 40/40/20 | 50 | 2/2 | 40/30/30 | A:1 C:1 |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | OBSERVED + INFERRED/ASSUMED parts | T2 (72-96) | 0-40 | T2 (64-96) | T2 (48-64) | T0-T1 | T2 | 40/40/20 | 50 | 1/2 | 34/33/33 | A:client pick B:client pick C:client pick |

### 5.2 Weekly set budget per category (the encodable recipe)

| profile | PLYO | JLK | THROW | COD | SPRINT | TE | BKD | BHD | UKD | UHD | HPUSH | VPUSH | HPULL | VPULL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 9 | 4.9 | 8.7 | 2 | 3 | 0.6 | 6.9 | 7.4 | 7.4 | 4 | 5.1 | 5.1 | 4.6 | 4 |
| Boxing | 26 | 3 | 38 | 0 | 3 | 9 | 3 | 9 | 12 | 3 | 0 | 3 | 3 | 0 |
| CrossFit - competitor | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 6 | 0 | 0 | 0 | 0 | 4.9 | 5.4 | 2.7 | 5.4 | 8.1 | 4.7 | 3.9 | 5.4 | 1.1 |
| Powerlifting / max strength | 3 | 0 | 0 | 0 | 0 | 0 | 7 | 6 | 3.4 | 2.6 | 12.6 | 3.4 | 7.4 | 7.6 |
| Bodybuilding / aesthetics | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 6 | 6 | 6 | 6 | 10 | 6 | 6 |
| Fat loss / body toning | 0 | 0 | 0 | 0 | 0 | 0 | 9 | 6.8 | 10 | 5 | 9.8 | 3.2 | 6.5 | 7.5 |
| Basketball | 28 | 8 | 4 | 18 | 4 | 6 | 6 | 6 | 8 | 6 | 4 | 2 | 6 | 4 |
| Volleyball | 28 | 6 | 8 | 9 | 2 | 6 | 6 | 6 | 6 | 6 | 3 | 3 | 6 | 4 |
| American football - skill (WR / DB / RB) | 24 | 6 | 4 | 18 | 9 | 6 | 6 | 6 | 6 | 6 | 4 | 2 | 4 | 4 |
| American football - big skill (LB / TE / FB / S) | 18 | 4 | 6 | 12 | 6 | 9 | 8 | 8 | 6 | 4 | 6 | 3 | 6 | 4 |
| American football - linemen (OL / DL) | 12 | 0 | 9 | 6 | 4 | 9 | 10 | 10 | 6 | 4 | 10 | 4 | 10 | 4 |
| Soccer (outfield) | 21 | 6 | 2 | 18 | 9 | 3 | 6 | 6 | 6 | 6 | 2 | 2 | 3 | 2 |
| Softball | 9 | 5 | 9 | 2 | 3 | 1 | 7 | 7 | 7 | 5 | 4 | 3 | 5 | 4 |
| Ice hockey (skaters) | 18 | 4 | 8 | 4 | 3 | 6 | 6 | 6 | 6 | 6 | 4 | 2 | 6 | 3 |
| Tennis (and racket sports) | 15 | 9 | 12 | 15 | 3 | 3 | 4 | 6 | 6 | 6 | 3 | 2 | 6 | 3 |
| Golf | 4 | 2 | 9 | 0 | 0 | 3 | 3 | 6 | 6 | 3 | 2 | 2 | 6 | 3 |
| Track sprinter (100-200 m; jumpers as variant) | 18 | 9 | 6 | 0 | 12 | 9 | 6 | 6 | 6 | 6 | 2 | 2 | 3 | 2 |
| Distance runner (5 km - marathon) | 4 | 9 | 0 | 0 | 2 | 0 | 3 | 6 | 6 | 3 | 2 | 0 | 3 | 0 |
| Kickboxing / Muay Thai | 18 | 9 | 24 | 6 | 3 | 6 | 3 | 6 | 9 | 6 | 2 | 3 | 6 | 3 |
| Karate / Taekwondo | 10 | 12 | 20 | 9 | 3 | 3 | 3 | 6 | 9 | 6 | 3 | 2 | 6 | 3 |
| MMA | 22 | 6 | 16 | 6 | 3 | 9 | 6 | 8 | 6 | 4 | 4 | 3 | 7 | 5 |
| Wrestling | 12 | 3 | 16 | 6 | 2 | 8 | 6 | 8 | 5 | 4 | 4 | 3 | 8 | 6 |
| BJJ / submission grappling | 4 | 0 | 7 | 0 | 0 | 3 | 4 | 6 | 4 | 3 | 3 | 2 | 6 | 6 |
| General population / longevity | 0 | 2 | 3 | 0 | 0 | 0 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 8 | 4 | 6 | 6 | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | 10 | 2 | 8 | 8 | 0 | 8 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |

Compare profiles by **contacts / throws / cuts (5.4-5.5), not by set counts** in this table: the OBSERVED boxer's 26 PLYO sets average ~4.6 high-amplitude contacts per set (5-rep jumps inside complexes, 8-rep landings) plus low-amplitude squirrel sets, and its 38 THROW sets are single-throw lines of 10; BASEBALL throw sets are mostly '10/10' per side (~20 throws per set). INFERRED profiles use the nominal reps in section 0.

| profile | ISO_QUAD | ISO_HAM | ISO_CHEST | ISO_SIDE | ISO_REAR | ISO_BICEP | ISO_TRICEP | ISO_CALF | ISO_NECK | ISO_GRIP | CORE | FOCUS | total | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 0 | 3 | 0 | 4.6 | 0 | 8.7 | 6.3 | 4.6 | 0 | 0 | 11.4 | 0 | 111.3 | OBSERVED |
| Boxing | 6 | 9 | 0 | 6 | 0 | 0 | 0 | 3 | 0 | 0 | 17 | 0 | 153 | OBSERVED |
| CrossFit - competitor | 3 | 3 | 0 | 3 | 0 | 1.5 | 1.5 | 0 | 0 | 0 | 0 | 0 | 60 | OBSERVED |
| Hybrid athlete (strength - athletic - 'crossfitish') | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12.9 | 8.1 | 68.6 | OBSERVED |
| Powerlifting / max strength | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 56 | OBSERVED |
| Bodybuilding / aesthetics | 4 | 4 | 0 | 4 | 0 | 4 | 4 | 12 | 0 | 0 | 6 | 12 | 102 | OBSERVED |
| Fat loss / body toning | 3 | 3 | 0 | 5 | 0 | 6.5 | 2.5 | 0 | 0 | 0 | 14.2 | 0 | 92 | OBSERVED |
| Basketball | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 8 | 4 | 130 | INFERRED set budget |
| Volleyball | 4 | 3 | 0 | 0 | 6 | 0 | 0 | 3 | 0 | 0 | 8 | 4 | 127 | INFERRED set budget |
| American football - skill (WR / DB / RB) | 0 | 6 | 0 | 0 | 0 | 0 | 0 | 3 | 4 | 0 | 8 | 3 | 129 | INFERRED set budget |
| American football - big skill (LB / TE / FB / S) | 0 | 4 | 0 | 3 | 0 | 0 | 2 | 0 | 4 | 0 | 8 | 0 | 121 | INFERRED set budget |
| American football - linemen (OL / DL) | 0 | 3 | 0 | 4 | 0 | 0 | 4 | 0 | 4 | 0 | 8 | 4 | 125 | INFERRED set budget |
| Soccer (outfield) | 2 | 6 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 9 | 2 | 114 | INFERRED set budget |
| Softball | 0 | 3 | 0 | 3 | 3 | 8 | 5 | 4 | 0 | 0 | 11 | 0 | 108 | INFERRED set budget |
| Ice hockey (skaters) | 0 | 3 | 0 | 2 | 0 | 0 | 0 | 0 | 3 | 0 | 9 | 2 | 101 | INFERRED set budget |
| Tennis (and racket sports) | 0 | 3 | 0 | 0 | 6 | 0 | 0 | 3 | 0 | 4 | 9 | 2 | 120 | INFERRED set budget |
| Golf | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 2 | 9 | 0 | 63 | INFERRED set budget |
| Track sprinter (100-200 m; jumpers as variant) | 0 | 6 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 0 | 8 | 3 | 110 | INFERRED set budget |
| Distance runner (5 km - marathon) | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 0 | 6 | 0 | 52 | INFERRED set budget |
| Kickboxing / Muay Thai | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 3 | 4 | 0 | 12 | 0 | 127 | INFERRED set budget |
| Karate / Taekwondo | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 10 | 3 | 115 | INFERRED set budget |
| MMA | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 3 | 10 | 0 | 125 | INFERRED set budget |
| Wrestling | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 6 | 4 | 10 | 0 | 113 | INFERRED set budget |
| BJJ / submission grappling | 0 | 2 | 0 | 0 | 0 | 2 | 0 | 0 | 4 | 4 | 9 | 0 | 69 | INFERRED set budget |
| General population / longevity | 0 | 0 | 0 | 2 | 0 | 2 | 2 | 2 | 0 | 0 | 6 | 0 | 42 | INFERRED set budget |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 52 | INFERRED set budget |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | 4 | 4 | 0 | 4 | 0 | 0 | 0 | 4 | 0 | 0 | 4 | 8 | 96 | OBSERVED |

### 5.3 Computed weekly shares (from 5.2)

| profile | weekly sets | athletic % | athletic % excl. throws | PLYO/JLK/THROW/COD/SPRINT/TE % | compound % | isolation % | core % | focus % | lower uni % | pull per push | knee/hip sets | compound:iso | sets per main day (upper bound) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 111.3 | 25.3 | 19 | 8.1/4.4/7.8/1.8/2.7/0.5 | 40 | 24.4 | 10.2 | 0 | 44.4 | 0.8 | 14.3/14.4 | 1.6 | 27.8 |
| Boxing | 153 | 51.6 | 35.7 | 17/2/24.8/0/2/5.9 | 21.6 | 15.7 | 11.1 | 0 | 55.6 | 1 | 21/21 | 1.4 | 38.2 |
| CrossFit - competitor | 60 | 0 | 0 | 0/0/0/0/0/0 | 80 | 20 | 0 | 0 | 50 | 1 | 15/15 | 4 | 15 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 68.6 | 15.9 | 15.9 | 8.7/0/0/0/0/7.1 | 53.5 | 0 | 18.8 | 11.8 | 62.5 | 0.8 | 10.8/10.8 | - | 13.7 |
| Powerlifting / max strength | 56 | 5.4 | 5.4 | 5.4/0/0/0/0/0 | 89.3 | 5.4 | 0 | 0 | 31.6 | 0.9 | 10.4/8.6 | 16.7 | 14 |
| Bodybuilding / aesthetics | 102 | 0 | 0 | 0/0/0/0/0/0 | 51 | 31.4 | 5.9 | 11.8 | 50 | 0.8 | 16/16 | 1.6 | 25.5 |
| Fat loss / body toning | 92 | 0 | 0 | 0/0/0/0/0/0 | 62.8 | 21.7 | 15.4 | 0 | 48.7 | 1.1 | 22/14.8 | 2.9 | 23 |
| Basketball | 130 | 52.3 | 50.8 | 21.5/6.2/3.1/13.8/3.1/4.6 | 32.3 | 6.2 | 6.2 | 3.1 | 53.8 | 1.7 | 14/16 | 5.2 | 32.5 |
| Volleyball | 127 | 46.5 | 42.9 | 22/4.7/6.3/7.1/1.6/4.7 | 31.5 | 12.6 | 6.3 | 3.1 | 50 | 1.7 | 16/15 | 2.5 | 31.8 |
| American football - skill (WR / DB / RB) | 129 | 51.9 | 50.4 | 18.6/4.7/3.1/14/7/4.7 | 29.5 | 10.1 | 6.2 | 2.3 | 50 | 1.3 | 12/18 | 2.9 | 32.2 |
| American football - big skill (LB / TE / FB / S) | 121 | 45.5 | 42.6 | 14.9/3.3/5/9.9/5/7.4 | 37.2 | 10.7 | 6.6 | 0 | 38.5 | 1.1 | 14/16 | 3.5 | 30.2 |
| American football - linemen (OL / DL) | 125 | 32 | 26.7 | 9.6/0/7.2/4.8/3.2/7.2 | 46.4 | 12 | 6.4 | 3.2 | 33.3 | 1 | 16/17 | 3.9 | 31.2 |
| Soccer (outfield) | 114 | 51.8 | 50.9 | 18.4/5.3/1.8/15.8/7.9/2.6 | 28.9 | 9.6 | 7.9 | 1.8 | 50 | 1.2 | 14/18 | 3 | 28.5 |
| Softball | 108 | 26.9 | 20.2 | 8.3/4.6/8.3/1.9/2.8/0.9 | 38.9 | 24.1 | 10.2 | 0 | 46.2 | 1.3 | 14/15 | 1.6 | 27 |
| Ice hockey (skaters) | 101 | 42.6 | 37.6 | 17.8/4/7.9/4/3/5.9 | 38.6 | 7.9 | 8.9 | 2 | 50 | 1.5 | 12/15 | 4.9 | 25.2 |
| Tennis (and racket sports) | 120 | 47.5 | 41.7 | 12.5/7.5/10/12.5/2.5/2.5 | 30 | 13.3 | 7.5 | 1.7 | 54.5 | 1.8 | 10/15 | 2.2 | 30 |
| Golf | 63 | 28.6 | 16.7 | 6.3/3.2/14.3/0/0/4.8 | 49.2 | 7.9 | 14.3 | 0 | 50 | 2.2 | 9/9 | 6.2 | 21 |
| Track sprinter (100-200 m; jumpers as variant) | 110 | 49.1 | 46.2 | 16.4/8.2/5.5/0/10.9/8.2 | 30 | 10.9 | 7.3 | 2.7 | 50 | 1.2 | 12/18 | 2.8 | 27.5 |
| Distance runner (5 km - marathon) | 52 | 28.8 | 28.8 | 7.7/17.3/0/0/3.8/0 | 44.2 | 15.4 | 11.5 | 0 | 50 | 1.5 | 9/11 | 2.9 | 17.3 |
| Kickboxing / Muay Thai | 127 | 52 | 40.8 | 14.2/7.1/18.9/4.7/2.4/4.7 | 29.9 | 8.7 | 9.4 | 0 | 62.5 | 1.8 | 12/16 | 3.5 | 31.8 |
| Karate / Taekwondo | 115 | 49.6 | 38.9 | 8.7/10.4/17.4/7.8/2.6/2.6 | 33 | 6.1 | 8.7 | 2.6 | 62.5 | 1.8 | 12/16 | 5.4 | 28.8 |
| MMA | 125 | 49.6 | 42.2 | 17.6/4.8/12.8/4.8/2.4/7.2 | 34.4 | 8 | 8 | 0 | 41.7 | 1.7 | 12/15 | 4.3 | 31.2 |
| Wrestling | 113 | 41.6 | 32 | 10.6/2.7/14.2/5.3/1.8/7.1 | 38.9 | 10.6 | 8.8 | 0 | 39.1 | 2 | 11/12 | 3.7 | 28.2 |
| BJJ / submission grappling | 69 | 20.3 | 11.3 | 5.8/0/10.1/0/0/4.3 | 49.3 | 17.4 | 13 | 0 | 41.2 | 2.4 | 8/11 | 2.8 | 23 |
| General population / longevity | 42 | 11.9 | 5.1 | 0/4.8/7.1/0/0/0 | 54.8 | 19 | 14.3 | 0 | 50 | 1.2 | 6/6 | 2.9 | 14 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 52 | 57.7 | 52.2 | 15.4/7.7/11.5/11.5/7.7/3.8 | 30.8 | 0 | 11.5 | 0 | 50 | 1 | 4/4 | - | 17.3 |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | 96 | 37.5 | 31.8 | 10.4/2.1/8.3/8.3/0/8.3 | 33.3 | 16.7 | 4.2 | 8.3 | 50 | 1 | 12/12 | 2 | 24 |

### 5.4 Plyometrics by profile

| profile | high-amplitude target | low-amplitude | vertical/horizontal/lateral % | unilateral % | landing % | force phases | library tracks | check |
|---|---|---|---|---|---|---|---|---|
| Baseball - position players | T3: 100-150 | 65-100 | 75/16/9 | 39 | 6 | all four; landings 'Stick the landing' early in blocks; contrast jumps after heavy lifts pre-season | PLYOS, JUMPING LIMITED KNEE (ankle hops: 43% of 'calfs' slots), FULL JUMPING (pre-season) | observed: block means B1 103 high / 97 low; B2 151 / 89; B3 135 / 66 per training week; single weeks range 28-201 high (8 weeks at 174-201) |
| Boxing | T3 build (OBSERVED, squirrel jumps counted low-amplitude by the analyst; T5 = 248-264 if counted as the coach files them) / T2 camp (INFERRED): 110-130 | 140-180 | 85/15/0 | 62 | 8 | landings (weighted depth drops x8) -> single-leg march jumps -> reactive squirrel jumps (reverse banded) | PLYOS (landings), FULL JUMPING (squirrel jumps = 'FASTEST SSC'), jump rope | observed: wk3-8 113-129 high + 142-177 low + 720-1440 jump-rope contacts (est.); wk1-2 zero |
| CrossFit - competitor | T1 (in WODs): 0-60 | 200-500 | 90/10/0 | 10 | 0 | - | double-unders (low amplitude), box jumps inside WODs | observed: no plyo slot; skill 'T2B/ DUBS' TUESD and 'H.S./ DUBS' FRID in JUN/JUL/NOV/MAR/APR; 4 skill days in DEC/JAN; none in AUG/SEPT/OCT/FEB/MAY; 'DUBS' on MON only in the CLASS split |
| Hybrid athlete (strength - athletic - 'crossfitish') | T1: 30-40 | 0-0 | 85/15/0 | 0 | 29 | landing -> loaded landing -> reactive -> concentric -> repeated SSC (8-week ladder; landings = wk1-2 = 2 of 7 loading weeks) | PLYOS, FULL JUMPING | observed: Tue/Fri 'JUMPS' (no sets/reps on the rows; 3x6 ASSUMED - if the tab's global SETS 2,2,2,3,3,3,4,4 / REPS 6,8,10,6,8,10,6,8 rows 71-72 apply, it is 24-60 contacts/week, mean ~41 over wk1-7): 'Depth drops' -> 'Weighted depth drops' -> 'depth drop to jump' -> 'weighted depth drops to jump' -> 'box jumps' -> 'repeat hurdle hops' |
| Powerlifting / max strength | T1: 18-18 | 0-0 | 100/0/0 | 0 | 30 | landing -> reactive (as a potentiator for the dynamic-effort lift) | PLYOS | observed: Thu 'the work' 3 x 6 'EASY': 'WEIGHTED DEPTH DROP', 'DEPTH DROP & JUMP', 'HIGH SQUAT JUMPS', 'REPEAT HIGH JUMPS' |
| Bodybuilding / aesthetics | T0: 0-0 | 0-0 | - | 0 | 0 | - | - | observed: no athletic slot; MM UPPER/LOWER and PPL carry A-drills only |
| Fat loss / body toning | T0: 0-0 | 0-100 | - | 0 | 0 | - | - | observed: only 'Jumping Jacks' and 'Burpees' inside circuits |
| Basketball | T5: 220-300 | 140-220 | 55/20/25 | 45 | 15 | all four; REBOUNDING (repeat hops/jumps, hurdle hops) is the signature phase | PLYOS, FULL JUMPING, JUMPING LIMITED KNEE (ankle stiffness) | sets x nominal = 224 high / 160 low (T5/T3) |
| Volleyball | T5: 200-280 | 100-160 | 75/10/15 | 30 | 20 | landing first every block (high landing load on the jumping knee); approach jumps = DELIVER; block jumps = REBOUNDING | PLYOS, FULL JUMPING, JUMPING LIMITED KNEE | sets x nominal = 224 high / 120 low (T5/T2) |
| American football - skill (WR / DB / RB) | T4: 170-220 | 100-140 | 35/40/25 | 60 | 15 | all four; horizontal bounds and single-leg lateral hops | PLYOS, FULL JUMPING ('Bounding'), JUMPING LIMITED KNEE | sets x nominal = 192 high / 120 low (T4/T2) |
| American football - big skill (LB / TE / FB / S) | T3: 130-160 | 60-100 | 40/40/20 | 45 | 20 | all four | PLYOS, FULL JUMPING | sets x nominal = 144 high / 80 low (T3/T2) |
| American football - linemen (OL / DL) | T2: 80-100 | 0-40 | 40/50/10 | 25 | 30 | landing + DELIVER (onto box, short broad jumps); little REBOUNDING (body mass) | PLYOS (FOUNDATIONAL / MODERATE) | sets x nominal = 96 high / 0 low (T2/T0) |
| Soccer (outfield) | T4: 160-200 | 100-140 | 30/40/30 | 60 | 15 | all four, unilateral emphasis | PLYOS, FULL JUMPING ('Bounding'), JUMPING LIMITED KNEE | sets x nominal = 168 high / 120 low (T4/T2) |
| Softball | T3: 100-140 | 70-100 | 65/20/15 | 40 | 15 | landing block doubled (ACL risk in female athletes) | PLYOS, JUMPING LIMITED KNEE | sets x nominal = 72 high / 100 low (T2/T2) |
| Ice hockey (skaters) | T3: 130-160 | 60-100 | 25/30/45 | 65 | 15 | lateral bounds (skater jumps), single-leg lateral stick -> rebound | PLYOS (lateral hurdle hops G93/G94), JUMPING LIMITED KNEE (lateral plate hops G50-G52) | sets x nominal = 144 high / 80 low (T3/T2) |
| Tennis (and racket sports) | T3: 110-140 | 160-200 | 30/25/45 | 55 | 15 | split-step pogo (low amplitude) + lateral rebound | JUMPING LIMITED KNEE, PLYOS lateral | sets x nominal = 120 high / 180 low (T3/T3) |
| Golf | T1: 20-40 | 30-50 | 80/10/10 | 30 | 30 | landing + DELIVER (CMJ / box jumps) for lower-body RFD | PLYOS FOUNDATIONAL | sets x nominal = 32 high / 40 low (T1/T1) |
| Track sprinter (100-200 m; jumpers as variant) | T3-T4: 140-200 | 160-220 | 40/55/5 | 60 | 10 | REBOUNDING + bounding; depth jumps for stiffness | FULL JUMPING ('Bounding', 'Hurdle Hops', 'Depth Jumps'), JUMPING LIMITED KNEE (ankle stiffness) | sets x nominal = 144 high / 180 low (T3/T3) |
| Distance runner (5 km - marathon) | T1: 30-40 | 150-200 | 50/45/5 | 55 | 10 | low-amplitude REBOUNDING (pogos), skips, bounds | JUMPING LIMITED KNEE / JUMPING ANKLE | sets x nominal = 32 high / 180 low (T1/T3) |
| Kickboxing / Muay Thai | T3: 110-150 | 160-220 | 55/20/25 | 65 | 10 | single-leg reactive (switch-kick hops, skips) + landings | JUMPING LIMITED KNEE, PLYOS, jump rope | sets x nominal = 144 high / 180 low (T3/T3) |
| Karate / Taekwondo | T2: 60-90 | 200-260 | 45/30/25 | 65 | 10 | low-amplitude bounce (stance rhythm) + explosive single-leg entries | JUMPING LIMITED KNEE, PLYOS FOUNDATIONAL/MODERATE | sets x nominal = 80 high / 240 low (T2/T4) |
| MMA | T4: 160-200 | 100-140 | 45/35/20 | 50 | 15 | level changes / shots (horizontal), sprawls (landing), reactive hops | PLYOS, FULL JUMPING, JUMPING LIMITED KNEE | sets x nominal = 176 high / 120 low (T4/T2) |
| Wrestling | T2: 80-100 | 40-60 | 40/50/10 | 40 | 20 | penetration steps, level changes (horizontal DELIVER), sprawl landings | PLYOS | sets x nominal = 96 high / 60 low (T2/T1) |
| BJJ / submission grappling | T1: 30-40 | 0-40 | 50/50/0 | 30 | 30 | landing + DELIVER | PLYOS FOUNDATIONAL | sets x nominal = 32 high / 0 low (T1/T0) |
| General population / longevity | T0: 0-0 | 0-40 | 60/20/20 | 30 | 50 | low-amplitude only after landing control | JUMPING ANKLE (bilateral) | sets x nominal = 0 high / 40 low (T0/T1) |
| Youth athlete (multi-sport, pre/circa/post-PHV) | T2: 50-80 | 60-100 | 40/30/30 | 40 | 35 | TAKING IN FORCES dominant; wide variety of jumps and landings at moderate volume | PLYOS FOUNDATIONAL, JUMPING ANKLE | sets x nominal = 64 high / 80 low (T2/T2) |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | T2: 72-96 | 0-40 | 100/0/0 | 33 | 67 | landing (FOUNDATIONAL) even for an athlete who power cleans; mix = the 3 observed picks only (2 depth drops + ankle hops), a wider mix is INFERRED | PLYOS, JUMPING LIMITED KNEE | observed: 6 plyo slots x 2 sets x '6 to 8 Reps' (estimate); JUSTICE LEAGUE Mon = 'Medium Depth Drop' + 'Ankle Hops ', Tue = 'SL Depth Drops' |

### 5.5 Throwing, change of direction, sprint, triple extension

| profile | throws / wk | throw plane % | COD | sprint | triple extension / Olympic |
|---|---|---|---|---|---|
| Baseball - position players | T3 170-200 | tra 57 sag 43 | T1 10-30; max 'MOD. TURN'; reactive no | T2 60-150 m; 0-30 m accelerations, 'accelerations baseball starts' (OBSERVED), base-running curve (INFERRED) | T1 (T3 with optional OLY) 1-16 sets; hang clean / hang snatch @75-90% (OPTIONAL PIECE, never in-season) |
| Boxing | T4 190-380 | tra 53 sag 47 | T0-T1 0-30; max 'EASY TURN'; reactive yes | T1 0-60 m; high-knee runs inside complexes; sprinting is used as conditioning ('Sprint 20/ Recover 40') | T2-T3 9-12 sets; 'Clean Pull/ hang Power Clean', 'DB snatches', 'Hang Power Clean & Press' |
| CrossFit - competitor | T2 (wall balls / slams in WODs) 50-150 | sag 90 tra 10 | T0 0-0; max '-'; reactive no | T1-T2 0-150 m; sprint WODs only | T4 (power months) / T0 (strength months) 0-24 sets; full snatch / clean & jerk; POWER L1 3x3 -> L4 6x3 |
| Hybrid athlete (strength - athletic - 'crossfitish') | T0 0-0 | - | T0 0-0; max '-'; reactive no | conditioning A 0-0 m; Tue 'SPEED' 10-15 x 15-20 s sprint / 30-40 s walk, then 5-10 x 30 s / 2 min | T1-T2 4-8 sets; clean Mon / snatch Thu rotating pull -> power -> squat variants, 'heavy' in every week except wk1 ('2x 2 clean pulls, 2 power cleans') |
| Powerlifting / max strength | T0 0-0 | - | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T0 0-0 sets; - |
| Bodybuilding / aesthetics | T0 0-0 | - | T0 0-0; max '-'; reactive no | T0-T1 0-0 m; A March / A Skip / A Run primer on lower days (MM UPPER/LOWER, PPL) | T0 0-0 sets; - |
| Fat loss / body toning | T0 0-0 | - | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T0 0-0 sets; - |
| Basketball | T1 30-60 | sag 60 tra 40 | T4 120-160; max 'HARD TURN'; reactive yes | T3 180-300 m; 5-20 m accelerations + short flying 10 m (court = 28 m) | T2 6-8 sets; hang power variants; trap-bar / DB jumps for tall athletes |
| Volleyball | T2 60-100 | sag 50 tra 50 | T2 50-70; max 'MOD. TURN'; reactive yes | T2 60-120 m; 3-10 m first steps | T2 6-8 sets; hang power clean / snatch pulls |
| American football - skill (WR / DB / RB) | T1 30-60 | sag 50 tra 50 | T4 120-160; max 'HARD TURN'; reactive yes | T4 400-600 m; acceleration 0-20 yd + max velocity 20-40 yd flying | T2 6-8 sets; power clean / hang snatch |
| American football - big skill (LB / TE / FB / S) | T1 50-70 | sag 60 tra 40 | T3 80-100; max 'HARD TURN'; reactive yes | T4 300-400 m; 0-20 yd accelerations | T2 8-10 sets; power clean, clean pulls |
| American football - linemen (OL / DL) | T2 80-100 | sag 70 tra 30 | T2 40-50; max 'MOD. TURN'; reactive yes | T2 100-160 m; 0-10 yd starts from stance | T2 8-10 sets; power clean, high pull |
| Soccer (outfield) | T1 10-30 | tra 60 sag 40 | T4 120-160; max 'HARD TURN'; reactive yes | T4 400-600 m; max velocity 1x/week minimum (hamstring protection) + accelerations | T1 2-4 sets; jump shrugs / hang pulls |
| Softball | T3 160-200 | tra 60 sag 40 | T1 10-30; max 'MOD. TURN'; reactive no | T2 60-150 m; home-to-first, 0-20 m | T1 0-6 sets; hang pulls |
| Ice hockey (skaters) | T2 70-100 | tra 70 sag 30 | T1 20-30; max 'MOD. TURN'; reactive yes | T3 150-200 m; on-land accelerations or bike sprints | T2 6-8 sets; power clean / hang snatch |
| Tennis (and racket sports) | T2 110-150 | tra 70 sag 30 | T3 100-120; max 'HARD TURN'; reactive yes | T2 80-150 m; 3-10 m starts | T1 2-4 sets; jump shrug / hang pull |
| Golf | T2 80-110 | tra 80 sag 20 | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T1 0-3 sets; jump shrug / trap-bar jump (optional) |
| Track sprinter (100-200 m; jumpers as variant) | T1-T2 50-70 | sag 85 tra 15 | T0 0-0; max '-'; reactive no | T5 600-1000 m; acceleration, max velocity, speed endurance by event (track sessions) | T2 8-10 sets; power clean / power snatch from hang |
| Distance runner (5 km - marathon) | T0 0-0 | - | T0 0-0; max '-'; reactive no | T2 80-150 m; hill sprints 6-10 reps x 8-20 s (8x8, 10x8, 8x10, 10x10, 6x10 + 2x20 s), flat sprints 4x40 m + 2x60 m / 4x60 + 2x80 m / 6x80 m (OBSERVED Sheet24) | T0 0-0 sets; - |
| Kickboxing / Muay Thai | T3 220-260 | tra 60 sag 40 | T2 35-50; max 'MOD. TURN'; reactive yes | T1 0-60 m; conditioning only | T2 6-8 sets; hang power clean, DB snatch |
| Karate / Taekwondo | T3 180-220 | tra 60 sag 40 | T2 55-70; max 'MOD. TURN'; reactive yes | T2 60-120 m; short explosive entries 3-5 m | T1 2-4 sets; jump shrug / DB snatch |
| MMA | T3 150-200 | tra 55 sag 45 | T2 40-50; max 'MOD. TURN'; reactive yes | T1-T2 0-100 m; conditioning sprints | T2 8-10 sets; power clean, clean pull |
| Wrestling | T3 150-200 | tra 55 sag 45 | T2 40-50; max 'MOD. TURN'; reactive yes | T1 0-60 m; - | T2 6-10 sets; power clean, high pull |
| BJJ / submission grappling | T2 60-80 | tra 50 sag 50 | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T1 2-4 sets; hang pulls / KB swings |
| General population / longevity | T1 20-40 | sag 50 tra 50 | T0-T1 0-20; max 'EASY TURN'; reactive no | T1 0-0 m; A March / A Skip as movement literacy | T0-T1 0-3 sets; 'BodyWeight Squat to calf raise', 'Hex bar squat to calf raise' |
| Youth athlete (multi-sport, pre/circa/post-PHV) | T2 50-80 | sag 50 tra 50 | T2 35-50; max 'MOD. TURN'; reactive yes | T2 100-150 m; short sprints and games | T1 0-3 sets; dowel/PVC technique; pulls only post-PHV |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | T2 64-96 | sag 50 tra 50 | T2 48-64; max 'per slot level'; reactive no | T0-T1 0-0 m; no sprint slot ('Max velocity running (top speed)' only inside PLYOS ADVANCED) | T2 8-8 sets; 'Power Clean' 2 x '6 to 8 Reps' (JUSTICE LEAGUE) |

### 5.6 Resistance emphasis and computed weekly sets per muscle

Per-muscle sets are COMPUTED from 5.2 with the synthesis muscle-credit map (1.0 prime mover / 0.5 synergist, an analyst convention - INFERRED, not a coach rule; the decodes themselves disagree, e.g. horizontal push credits front delts 1.0 here and in the BYOP decodes but 0.5 in the BASEBALL and MM gym decodes). H/S/P % and 'target sets/muscle/wk' are analyst classifications on every row.

| profile | H/S/P % | rep zone | target sets/muscle/wk | quads | glutes | hams | chest | lats/UB | front d. | side d. | rear d. | biceps | triceps | calves | abs | neck | grip |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 45/35/20 | VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10) | big 8-16, small 5-13 | 14.3 | 22.3 | 14.4 | 7.6 | 8.6 | 10.2 | 7.1 | 2.3 | 13 | 11.3 | 4.6 | 11.4 | 0 | 0 |
| Boxing | 25/35/40 | base 3 x 10; conversion 3-8 reps heavy + complexes ('3-5-5-5', '4-5-5-5/5') | big 3-25, small 1-6 | 21 | 25.5 | 21 | 1.5 | 3 | 3 | 7.5 | 1.5 | 1.5 | 1.5 | 3 | 17 | 0 | 0 |
| CrossFit - competitor | 20/45/35 | STRENGTH L1 3x7 -> L4 6x4 (FULL TIME); RESISTANCE 2x10 / 3x10 only | big 4-21, small 1-12 | 15 | 21 | 15 | 9 | 12 | 12 | 6 | 3 | 7.5 | 7.5 | 0 | 0 | 0 | 0 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 30/50/20 | 3-week waves REPS 6,8,10 at SETS 2,2,2,3,3,3,4,4 | big 5-28, small 2-12 | 10.8 | 18.9 | 10.8 | 6.7 | 6.5 | 8.6 | 1.9 | 2.7 | 3.2 | 4.3 | 0 | 12.9 | 0 | 0 |
| Powerlifting / max strength | 20/60/20 | M.E. 5,4,3,2,1,3,2,1 @ '1RIR'; D.E. 3,3,2,1,3,2,1,1 'FAST'; accessory 3x6 '2RIR'; nuance 'MAX'; survival 'ALL' | big 3-18, small 0-16 | 10.4 | 15.5 | 8.6 | 14.3 | 15 | 16 | 1.7 | 3.7 | 10.5 | 8 | 0 | 0 | 0 | 0 |
| Bodybuilding / aesthetics | 80/15/5 | compounds 8-15 (mean ~12), single-joint 20, calves 15, MYO on machines; '1-2 RIR' | big 9-21, small 3-16 | 16 | 21 | 16 | 11 | 12 | 16 | 9 | 3 | 10 | 12 | 12 | 6 | 0 | 0 |
| Fat loss / body toning | 85/10/5 | compounds 15/12 -> 8-10; isolation 15 -> 20 -> 40 | big 7-20, small 3-15 | 22 | 26.3 | 14.8 | 11.4 | 14 | 13 | 6.6 | 3.2 | 13.5 | 9 | 0 | 14.2 | 0 | 0 |
| Basketball | 25/40/35 | main lift 3-6 (VOL 3 / STRENGTH), secondary 8-12 (VOL 2), isolation 15-20 | big 8-16, small 3-8 | 14 | 23 | 16 | 5 | 10 | 6 | 1 | 3 | 5 | 3 | 4 | 8 | 0 | 0 |
| Volleyball | 25/40/35 | main 3-6, secondary 8-12, quad isometric/slow 3x30-45 s | big 6-14, small 3-9 | 16 | 21 | 15 | 4.5 | 13 | 6 | 1.5 | 9 | 5 | 3 | 3 | 8 | 0 | 0 |
| American football - skill (WR / DB / RB) | 20/40/40 | STRENGTH main lifts, contrast (heavy -> jump) 1-2x/week | big 8-14, small 2-6 | 12 | 21 | 18 | 5 | 8 | 6 | 1 | 2 | 4 | 3 | 3 | 8 | 4 | 0 |
| American football - big skill (LB / TE / FB / S) | 25/45/30 | STRENGTH + VOL 2 | big 10-16, small 3-8 | 14 | 22 | 16 | 7.5 | 10 | 9 | 4.5 | 3 | 5 | 6.5 | 0 | 8 | 4 | 0 |
| American football - linemen (OL / DL) | 30/50/20 | STRENGTH 3-5 + VOL 2 8-12 for mass | big 12-22, small 4-12 | 16 | 25 | 17 | 12 | 14 | 14 | 6 | 5 | 7 | 11 | 0 | 8 | 4 | 0 |
| Soccer (outfield) | 20/40/40 | STRENGTH low volume (3 x 3-5) + contrast | big 6-13, small 1-5 | 14 | 21 | 18 | 3 | 5 | 4 | 1 | 1.5 | 2.5 | 2 | 3 | 9 | 0 | 0 |
| Softball | 45/35/20 | as baseball | big 8-16, small 4-12 | 14 | 22.5 | 15 | 5.5 | 10.5 | 7 | 4.5 | 5.5 | 12.5 | 8.5 | 4 | 11 | 0 | 0 |
| Ice hockey (skaters) | 25/45/30 | STRENGTH + VOL 2 | big 8-15, small 1-6 | 12 | 21 | 15 | 5 | 9 | 6 | 3 | 3 | 4.5 | 3 | 0 | 9 | 3 | 0 |
| Tennis (and racket sports) | 25/40/35 | VOL 2 + STRENGTH | big 6-13, small 3-9 | 10 | 20 | 15 | 4 | 12 | 5 | 1 | 9 | 4.5 | 2.5 | 3 | 9 | 0 | 4 |
| Golf | 25/40/35 | VOL 2 + STRENGTH lower body | big 4-12, small 1-5 | 9 | 16.5 | 9 | 3 | 10.5 | 4 | 1 | 6 | 4.5 | 2 | 0 | 9 | 0 | 2 |
| Track sprinter (100-200 m; jumpers as variant) | 15/45/40 | STRENGTH 3-5 + POWER | big 6-15, small 1-6 | 12 | 21 | 18 | 3 | 5 | 4 | 1 | 1.5 | 2.5 | 2 | 6 | 8 | 0 | 0 |
| Distance runner (5 km - marathon) | 10/55/35 | STRENGTH 3-6 reps heavy (running economy without mass) | big 3-9, small 0-6 | 9 | 16.5 | 11 | 2 | 3 | 2 | 0 | 1.5 | 1.5 | 1 | 6 | 6 | 0 | 0 |
| Kickboxing / Muay Thai | 20/40/40 | as boxing | big 5-17, small 1-5 | 12 | 22.5 | 16 | 3.5 | 9 | 5 | 1.5 | 3 | 4.5 | 2.5 | 3 | 12 | 4 | 0 |
| Karate / Taekwondo | 20/35/45 | POWER + STRENGTH low volume (weight classes) | big 4-15, small 1-5 | 12 | 22.5 | 16 | 4 | 9 | 5 | 1 | 3 | 4.5 | 2.5 | 3 | 10 | 0 | 0 |
| MMA | 20/45/35 | STRENGTH + POWER (weight class) | big 6-17, small 1-7 | 12 | 21 | 15 | 5.5 | 12 | 7 | 1.5 | 3.5 | 6 | 3.5 | 0 | 10 | 4 | 3 |
| Wrestling | 15/55/30 | STRENGTH (relative strength, weight class) | big 7-20, small 2-8 | 11 | 20 | 12 | 5.5 | 14 | 7 | 1.5 | 4 | 9 | 3.5 | 0 | 10 | 6 | 4 |
| BJJ / submission grappling | 30/50/20 | STRENGTH + VOL 2 | big 4-15, small 2-7 | 8 | 15 | 11 | 4 | 12 | 5 | 1 | 3 | 8 | 2.5 | 0 | 9 | 4 | 4 |
| General population / longevity | 60/25/15 | 10-15 beginners, 6-12 later; power at 40-60% 1RM moved fast | big 3-9, small 2-5 | 6 | 10.5 | 6 | 4 | 6 | 5 | 3 | 1.5 | 5 | 4.5 | 2 | 6 | 0 | 0 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 40/40/20 | technique first, 8-15 reps, bodyweight / light DB | big 2-6, small 1-3 | 4 | 7 | 4 | 3 | 4 | 4 | 1 | 1 | 2 | 2 | 0 | 6 | 0 | 0 |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | 40/40/20 | '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions | big 6-14, small 2-8 | 12 | 14 | 12 | 6 | 8 | 8 | 6 | 2 | 4 | 4 | 4 | 4 | 0 | 0 |

| profile | pairing | priorities | avoid / remove | push:pull target |
|---|---|---|---|---|
| Baseball - position players | 'bkd' + 'uhd', 'bhd' + 'ukd'; pull with knee days, push with hip days (OBSERVED) | staggered-stance DL and box jumps; copenhagen planks / adductors; isolation AMRAP ('MAX', 35% of small-muscle sets) | barbell bench (none written); barbell overhead beyond occasional strict press | 1.2 : 1 by sets (DB/landmine pressing dominant; barbell overhead press 3x in the year) |
| Boxing | contrast-complex squat day (Tue L22) and hinge day (Fri L46); deadlift + '3 min Jump Rope' (the boxing tab never says 'French contrast' - the label is INFERRED from the matching 'ALL ABOUT SQUATS' G16 'FRENCH CONTRAST' heavy -> jump -> loaded jump -> banded jump pattern) | lower body and posterior chain 16-32 sets; leg ext / leg curls heavy (6&6) and light (20/20) in the same week; Copenhagen + unilateral DL | horizontal push, vertical pull and arm isolation after the base phase (OBSERVED) | upper body almost removed: 3 press sets (clean & press) : 3 row sets |
| CrossFit - competitor | LB with KNEE DOM / HIP DOM days, UB with PULL / PUSH days | squat, deadlift, press, pull strength; gymnastics skill T2B / handstands / double-unders | working to failure: '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' | 1 : 1 |
| Hybrid athlete (strength - athletic - 'crossfitish') | squat day -> 'UNI HD'; deadlift day -> 'UNI KD' (opposite dominance) | core inside tri-sets | - | 1.2 : 1 |
| Powerlifting / max strength | opposite-dominance accessory (squat M.E. -> snatch-grip DL) | box squats '(D)BOX' / '(T&G)BOX', deficit / chained / banded pulls; pulling every day | - | 1.07 : 1 |
| Bodybuilding / aesthetics | knee + pull / hip + push | Focus 1/2 slots lift the chosen muscle to 15-20+ sets; machines for SFR ('LEG PRESS' / 'PENDULUM' 'LOVE IT') | 'V-SQUAT' (never); 'HACK SQUAT' deprioritised | 1.3 : 1 |
| Fat loss / body toning | A/B lower days (leg-press-led -> leg ext finisher; deadlift-led -> leg curl finisher) | the block is titled 'MUSCLE BUILDING' | jumping for heavy / deconditioned clients | 0.93 : 1 |
| Basketball | knee + pull / hip + push (BYOP ATHLETIC) | single-leg strength (RFE, step-ups, lateral step-ups); hamstring eccentric (Nordic); calf/soleus + tibialis | deep heavy back squat volume in tall athletes when knees are flagged (use box / trap bar) | 1 : 1.7 (pull-biased) |
| Volleyball | BYOP ATHLETIC | posterior cuff / scapular (ISO_REAR); quad tendon loading (slow/isometric); calves | heavy barbell overhead for hitters with shoulder flags (landmine / DB) | 1 : 1.7 |
| American football - skill (WR / DB / RB) | BYOP ATHLETIC; contrast complexes from 'ALL ABOUT SQUATS' French contrast | hamstrings (Nordic) and hip extension; neck | - | 1 : 1.3 |
| American football - big skill (LB / TE / FB / S) | BYOP ATHLETIC | neck; posterior chain; upper-back mass | - | 1 : 1.1 |
| American football - linemen (OL / DL) | BYOP ATHLETIC; heavy bilateral emphasis | horizontal push strength; neck/traps; posterior chain | high-amplitude depth jumps for >130 kg athletes | 1 : 1 |
| Soccer (outfield) | BYOP ATHLETIC | Nordic 2x/week; Copenhagen 3x/week pre-season; single-leg strength | upper-body hypertrophy volume beyond maintenance | 1 : 1.25 |
| Softball | as baseball | posterior shoulder; eccentric biceps (pitchers) | barbell overhead | 1 : 1.3 |
| Ice hockey (skaters) | BYOP ATHLETIC; frontal-plane lunges in UKD ('Side Lunges' AL12, 'Curtsy Lunges ' AL21; Cossack is NOT in the BYOP UKD list - it appears only in MASTER_MODEL: 'Cosak lateral lunges' ('(NOT DONE) RESISTANCE PATTERNS ' C47) and 'Medball Reach forward Lateral Cosak lunge' / 'Medball Reach UP Lateral Cosak lunge' (ballistics warm-up A8/A11)) | adductor eccentric strength (Copenhagen); hip abduction/ER power; neck | - | 1 : 1.5 |
| Tennis (and racket sports) | BYOP ATHLETIC | posterior cuff / ER; wrist extensors; lateral hip | heavy barbell overhead | 1 : 1.8 |
| Golf | contralateral / ipsilateral loaded lunges and step-ups ('GET INTO THE HIP' / 'GET OUT OF THE HIP') | lead-leg block; hip rotation strength; thoracic rotation mobility | high-volume loaded flexion-rotation | 1 : 2.25 |
| Track sprinter (100-200 m; jumpers as variant) | BYOP ATHLETIC | Nordic / hamstring eccentric; calf-Achilles stiffness; hip flexors | upper-body hypertrophy beyond need | 1 : 1.25 |
| Distance runner (5 km - marathon) | lower body first | soleus / calf; hip abductors; hamstrings | high-rep hypertrophy volume | 1 : 1.5 |
| Kickboxing / Muay Thai | as boxing | frontal-plane lunges; Copenhagen; neck (clinch); hip flexor (knees/kicks) | heavy horizontal pressing after base (as boxing) | 1 : 1.8 |
| Karate / Taekwondo | as boxing | hamstring length-strength (high kicks); hip flexor strength; adductors | hypertrophy beyond weight class | 1 : 1.8 |
| MMA | boxing structure but pulling kept (grappling) | pulling strength + grip; neck; posterior chain | heavy bench volume (punching) beyond maintenance | 1 : 1.7 |
| Wrestling | hinge + pull dominant | isometric grip; neck (eccentric/isometric); carries and drags (CARRY/DRAGS headings - need exercises) | - | 1 : 2 |
| BJJ / submission grappling | pull dominant | grip endurance (static); neck; hip mobility | - | 1 : 2.4 |
| General population / longevity | full body each session (BOOTCAMP 1) | leg strength + power; posture (pulls); balance | - | 1 : 1.2 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | full body | movement competency; landing mechanics | maximal loading; depth jumps > ~30 cm circa-PHV | 1 : 1 |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | knee + pull (Mon/Thu) / hip + push (Tue/Fri) | vary the second weekly exposure (Front Squats Mon -> Low Bar Back Squat Thu) | - | 1 : 1 |

### 5.7 Planes and core

| profile | frontal need | transverse need | core slots/wk | core plane % | region | mode |
|---|---|---|---|---|---|---|
| Baseball - position players | 2 | 3 | 4 | transverse 48 sagittal 24 frontal 22 unspecified 6 | thorax + pelvis + both | 'LATERAL CORE' Mon, 'Transverse core' Tue/Fri, 'Sagital core' Thu (OBSERVED) |
| Boxing | 2 | 3 | 5 | sagittal 40 transverse 30 frontal 30 | thorax + pelvis + both | OBSERVED: situps/T2B, Russian twists, side planks, Copenhagen, swiss-ball knee tucks, star toe touches, slider runners |
| CrossFit - competitor | 1 | 1 | 3 | sagittal 70 frontal 15 transverse 15 | pelvis (T2B) + both (hollow) | skill-integrated |
| Hybrid athlete (strength - athletic - 'crossfitish') | 1 | 1 | 6 | sagittal 60 frontal 20 transverse 20 | integrated | tri-set partner, never standalone (OBSERVED) |
| Powerlifting / max strength | 0 | 0 | 0 | - | - | none written (gap) |
| Bodybuilding / aesthetics | 0 | 0 | 2 | sagittal 50 frontal 25 transverse 25 | client choice | optional days |
| Fat loss / body toning | 1 | 1 | 4 | sagittal 45 transverse 30 frontal 25 | both | circuits only (situps, bicycle crunches, plank taps, side planks, mountain climbers, plank hip turns) |
| Basketball | 3 | 2 | 3 | sagittal 30 frontal 35 transverse 35 | both | static anti-rotation / anti-lateral flexion first, then dynamic |
| Volleyball | 2 | 2 | 3 | sagittal 35 frontal 25 transverse 40 | both | anti-extension (spike arch) + rotation |
| American football - skill (WR / DB / RB) | 3 | 2 | 3 | sagittal 30 frontal 35 transverse 35 | both | anti-rotation + contact bracing |
| American football - big skill (LB / TE / FB / S) | 2 | 2 | 3 | sagittal 35 frontal 30 transverse 35 | both | static bracing first |
| American football - linemen (OL / DL) | 2 | 1 | 3 | sagittal 40 frontal 30 transverse 30 | both | static bracing / carries |
| Soccer (outfield) | 3 | 2 | 3 | sagittal 30 frontal 40 transverse 30 | pelvis + both | Copenhagen + anti-rotation |
| Softball | 2 | 3 | 4 | transverse 45 sagittal 25 frontal 30 | both | as baseball |
| Ice hockey (skaters) | 3 | 3 | 3 | sagittal 25 frontal 35 transverse 40 | both | anti-rotation + Copenhagen |
| Tennis (and racket sports) | 3 | 3 | 3 | sagittal 25 frontal 30 transverse 45 | both | anti-rotation -> rotation; anti-extension (serve) |
| Golf | 2 | 3 | 3 | sagittal 20 frontal 25 transverse 55 | both | Pallof holds -> chops (FUNCTIONAL 'ANTERIOR OBLIQUE SYSTEM') |
| Track sprinter (100-200 m; jumpers as variant) | 1 | 1 | 3 | sagittal 40 frontal 30 transverse 30 | both | anti-extension + hip flexion |
| Distance runner (5 km - marathon) | 2 | 1 | 2 | sagittal 30 frontal 40 transverse 30 | both | static |
| Kickboxing / Muay Thai | 3 | 3 | 4 | sagittal 25 frontal 30 transverse 45 | both | rotation + clinch bracing |
| Karate / Taekwondo | 3 | 3 | 4 | sagittal 30 frontal 30 transverse 40 | both | rotation |
| MMA | 2 | 3 | 4 | sagittal 35 frontal 30 transverse 35 | both | static + bridging |
| Wrestling | 2 | 3 | 4 | sagittal 35 frontal 30 transverse 35 | both | static/isometric + bridging |
| BJJ / submission grappling | 2 | 2 | 4 | sagittal 40 frontal 30 transverse 30 | both (flexion endurance for guard) | static first |
| General population / longevity | 1 | 1 | 2 | sagittal 40 frontal 30 transverse 30 | both | static first |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 2 | 2 | 2 | sagittal 40 frontal 30 transverse 30 | both | static first |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | 1 | 2 | 2 | sagittal 34 frontal 33 transverse 33 | client pick | optional days |

### 5.8 Conditioning (colour mix per week)

| profile | A (blue) | B (green) | C (orange) | LC | formats | evidence |
|---|---|---|---|---|---|---|
| Baseball - position players | 3.5 | 0 | 0 | 0 | 'Buy out' 1-3 bouts of 10-20 cal bike/row/ski or 15-30 s run (SPEED POWER 10-39 s); recovery week only: 'Paced Cardio - easy' 4 x 10 min (C) | OBSERVED |
| Boxing | 1 | 0 | 1 | 0 | 'Sprint 20/ Recover 40' rounds 5,5,6,6,7,8 (first on Friday); 'Cardio of any choice' 20-40 min; '3 min Jump Rope' between deadlift sets; wk1-2: '20 sec fast/ 40 sec slow' + '20 min' easy | OBSERVED |
| CrossFit - competitor | level 3+ | level 2+ | level 1+ | level 4 | - | OBSERVED |
| Hybrid athlete (strength - athletic - 'crossfitish') | 1 | 0 | 1 | 0 | Tue sprint intervals (150-300 s work); Fri '15-40 min constant cardo easy'; 'AMRAP' 12,15,16,17,18,19,20,20 (row 70; day and unit not written - Sat placement and minutes INFERRED) | OBSERVED |
| Powerlifting / max strength | 0 | 0 | 0 | 0 | none written | OBSERVED absence; INFERRED add 1-2 colour C for work capacity |
| Bodybuilding / aesthetics | 0 | 0 | 2 | 0 | BYOP: 'Cardio' slot on the 2 'Optional' days (A17/A38, no weekday named); MM 4 TRACKS AESTHETICS-8: '30-40 mi slow/steady CARDIO' WEDNESDAY & SATURDAY; MM UL/PPL: 'max 40 min of steady' Wed/Sat | OBSERVED |
| Fat loss / body toning | 0 | 0 | 2 | 0 | Wed/Sat 30-40 min steady (C); 4-station circuits 3x30 s -> 5x50 s (12 -> 33 min work/week) | OBSERVED |
| Basketball | 1.5 | 1 | 0.5 | 0 | repeat sprints 15/45 -> 20/40 -> 30/30 (A); 1-2 min court shuttles 1:1-1:2 (B); early off-season 20-30 min easy (C) | INFERRED |
| Volleyball | 2 | 0 | 0.5 | 0 | rally repeats 5-10 s work / 15-20 s rest (A); early off-season C | INFERRED |
| American football - skill (WR / DB / RB) | 2 | 0 | 0.5 | 0 | play repeats 5-6 s work : 30-40 s rest (1:5-1:6), 10-15 reps x 2-3 'drives'; C only in early off-season | INFERRED from SCIENCE |
| American football - big skill (LB / TE / FB / S) | 2 | 0 | 0.5 | 0 | 5-6 s : 30-40 s repeats | INFERRED |
| American football - linemen (OL / DL) | 2 | 0 | 0.5 | 0 | 5 s : 30-40 s | INFERRED |
| Soccer (outfield) | 1 | 1.5 | 1 | 0 | RSA 6-10 x 20-30 m (A); VO2max 4 x 4 min / 1-3 min bouts (B); off-season base runs (C) | INFERRED - highest aerobic need of the team sports |
| Softball | 3 | 0 | 0.5 | 0 | buy-outs as baseball | INFERRED |
| Ice hockey (skaters) | 1 | 1 | 0.5 | 1 | shift simulation 30-45 s hard : 2-4 min easy (B with long rest); LACTATE CLEARANCE surges; off-season C base | INFERRED from SCIENCE |
| Tennis (and racket sports) | 2 | 1 | 0.5 | 0 | point simulation 5-10 s : 20-25 s (A); games blocks 1-3 min (B); multi-hour match base (C) | INFERRED |
| Golf | 0 | 0.5 | 2 | 0 | walking / cycling 30-45 min (C) | INFERRED |
| Track sprinter (100-200 m; jumpers as variant) | 1 | 0 | 0.5 | 0 | 100/200: alactic only, tempo runs as C; 400 m/hurdles: LACTATE CLEARANCE + speed endurance | INFERRED |
| Distance runner (5 km - marathon) | 0.5 | 0.5 | 2 | 0 | OBSERVED Sheet24 (2 runs/week, day 1 + day 2): longest run 3 -> 12 mi, split a.m./p.m. days, progression runs, hill/flat sprints, intervals, '1-mile at max effort' tests wk 10/14, cut-backs wk 3/6/8/12/18, taper wk 21 'Tapering: 6 miles, comfortable pace' | OBSERVED run content (borrowed model, 2 runs/week); the colour split A 0.5 / B 0.5 / C 2 (= 3 sessions) is INFERRED |
| Kickboxing / Muay Thai | 1 | 1 | 1 | 0.5 | HIA ~2 s / LIA ~2 s / pauses ~5 s, fighting:non-fighting 1:1; 3 x 3 min rounds (B) | INFERRED from SCIENCE |
| Karate / Taekwondo | 2 | 1 | 0.5 | 0 | efforts ~8-10 s at 1:1 to 1:4; techniques 0.3-1.8 s | INFERRED from SCIENCE |
| MMA | 1 | 1.5 | 1 | 1 | striking 12-24 s bursts at 1:3-1:7; grappling 35-75 s at ~1:1; 5-min round simulations (LC) | INFERRED from SCIENCE |
| Wrestling | 1 | 1.5 | 1 | 1 | 2-3 min period simulations (B / LC); short burst repeats | INFERRED |
| BJJ / submission grappling | 0.5 | 1.5 | 1 | 0.5 | rolling rounds 5-6 min (B/LC); C base | INFERRED |
| General population / longevity | 0 | 1 | 2 | 0 | C 2-3 x 20-40 min; B 1x (level 2+) | INFERRED |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 1 | 0 | 1 | 0 | games and relays | INFERRED |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | client pick | client pick | client pick | 0 | 'Aerobic Capacity' Wed/Sat from the CARDIO list (B7:B122: speed intervals, distance intervals, tests); MM: 'WEDNESDAYS & SATURDAYS max 40 min of steady' | OBSERVED |

### 5.9 Injury hotspots -> selection rules (codes resolve in section 9)

| profile | hotspot codes (priority order) |
|---|---|
| Baseball - position players | SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL |
| Boxing | SHOULDER_STRIKER, WRIST_HAND, NECK, LOW_BACK_ROTATIONAL, GROIN_ADDUCTOR, PAIN_GENERAL |
| CrossFit - competitor | SHOULDER_GYMNASTIC, LOW_BACK_LOADING, WRIST_HAND, PAIN_GENERAL |
| Hybrid athlete (strength - athletic - 'crossfitish') | LOW_BACK_LOADING, SHOULDER_GYMNASTIC, PAIN_GENERAL |
| Powerlifting / max strength | LOW_BACK_LOADING, PAIN_GENERAL |
| Bodybuilding / aesthetics | PAIN_GENERAL |
| Fat loss / body toning | DECONDITIONED_JOINTS, PAIN_GENERAL |
| Basketball | PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL |
| Volleyball | PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| American football - skill (WR / DB / RB) | HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, NECK, PAIN_GENERAL |
| American football - big skill (LB / TE / FB / S) | HAMSTRING, NECK, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, LOW_BACK_LOADING, PAIN_GENERAL |
| American football - linemen (OL / DL) | LOW_BACK_LOADING, NECK, PAIN_GENERAL, ACL_LANDING_CUTTING |
| Soccer (outfield) | HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, HIP_FLEXOR, PAIN_GENERAL |
| Softball | SHOULDER_THROWER, ELBOW_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, PAIN_GENERAL |
| Ice hockey (skaters) | GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, NECK, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| Tennis (and racket sports) | ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL |
| Golf | LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, PAIN_GENERAL |
| Track sprinter (100-200 m; jumpers as variant) | HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING, PAIN_GENERAL |
| Distance runner (5 km - marathon) | ACHILLES_CALF, BONE_STRESS, HAMSTRING, PAIN_GENERAL |
| Kickboxing / Muay Thai | GROIN_ADDUCTOR, HIP_FLEXOR, NECK, SHOULDER_STRIKER, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| Karate / Taekwondo | HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, PAIN_GENERAL |
| MMA | NECK, SHOULDER_STRIKER, LOW_BACK_LOADING, GROIN_ADDUCTOR, WRIST_HAND, PAIN_GENERAL |
| Wrestling | NECK, LOW_BACK_LOADING, PAIN_GENERAL, ACL_LANDING_CUTTING |
| BJJ / submission grappling | NECK, LOW_BACK_LOADING, PAIN_GENERAL |
| General population / longevity | DECONDITIONED_JOINTS, PAIN_GENERAL, FALLS_BONE_DENSITY |
| Youth athlete (multi-sport, pre/circa/post-PHV) | GROWTH_APOPHYSIS, ACL_LANDING_CUTTING, BONE_STRESS, PAIN_GENERAL |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | PAIN_GENERAL |

### 5.10 Position and phase variants

| profile | variant | evidence | weekly set delta vs base | computed | notes |
|---|---|---|---|---|---|
| Baseball - position players | Baseball - pitchers | INFERRED (calendar row 16 separates 'PITCHERS/CATCHERS' from 'POSITIONS' - OBSERVED) | VPUSH -3, VPULL -1, ISO_REAR +6, ISO_GRIP +3, COD -2, SPRINT -2 | total 112.3; athletic 21.5% | arm care block (posterior cuff, scapular, forearm) every week, not only in recovery weeks; rotational medball kept, overhead slams/plyo push-ups off on bullpen and start days; lead-leg eccentric single-leg work (FFE lunges, lateral step-ups) emphasised; starters: 1 colour-C flush the day after a start |
| Baseball - position players | Baseball - catchers | INFERRED | BKD -3, UHD +3, ISO_REAR +3 | total 114.3; athletic 24.7% | limit loaded deep-squat volume (box squats to parallel); hip IR/ER mobility daily; lateral 'block' plyos (lateral plate hops) |
| CrossFit - competitor | CrossFit - class member | OBSERVED 'CLASS PROGRAMMING SPLIT' + HALF TIME table | - | - | 6 class days, each 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD'; squat MON, press TUES, deadlift THURS at 3 sets x 7 -> 4 reps, 1RM in week 8; snatch TUES, clean FRID at 3 x 4 -> 1; weekly lifting = 9 strength + 6 power sets; the WOD is the main stimulus |
| Powerlifting / max strength | Strength 12-week (percent + RPE) | OBSERVED STRENGTH-12 | - | - | % 80 -> 90 then 'MID DELOAD'; unilateral = opposite pattern ('STAGGERED STANCE DL' on squat days); no plyos, no vertical press, isolation 3x8 + 'TATE PRESS' 3x20 |
| Bodybuilding / aesthetics | Aesthetics 12-week PPL (6 days) | OBSERVED AESTHETICS-12 | - | - | 20-35 sets per muscle per week (only track above 15-20); WK7 'A WEEK LOWER'; supersets + MYO from WK9 |
| Bodybuilding / aesthetics | Aesthetics 3-day builder | OBSERVED '3 DAY BUILDER' | - | - | 5 slots/main day; drops Bicep, Leg Extensions, Tricep, ABdution; keeps Leg Curls + Calves; Focus 6 slots/week |
| Fat loss / body toning | Bootcamp option 1 | OBSERVED | - | - | AESTHETICS slots re-paired so each session is a complete full-body dose (knee + hip, push + pull); reason (irregular attendance) INFERRED; tab title 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'; Wed/Sat Calves, Cardio, Core, Focus 1, Focus 2 |
| Fat loss / body toning | Bootcamp option 2 | OBSERVED | - | - | 6 sessions x 5 slots, cardio in every session (6 bouts/week); no SETS/REPS columns |
| Basketball | Guards / wings | INFERRED | COD +2, SPRINT +2, PLYO -2 | total 132; athletic 53%; plyo high ~208 | more unilateral, lateral and horizontal jumps; ~41 game jumps (backcourt) |
| Basketball | Forwards / centers | INFERRED | PLYO +2, COD -6, SPRINT -2, BKD +2, BHD +2, HPUSH +2 | total 130; athletic 47.7%; plyo high ~240 | more bilateral vertical + landing volume (rebounding, ~79 game jumps frontcourt); more strength/mass for post play; body-mass-scaled contacts: cap depth-jump height |
| Volleyball | Setter | INFERRED | PLYO -4, JLK +3, THROW -2 | total 124; athletic 45.2%; plyo high ~192 | jumps most per point but lower amplitude (jump sets) |
| Volleyball | Libero / DS | INFERRED | PLYO -16, COD +6, SPRINT +2, THROW -4 | total 115; athletic 40.9%; plyo high ~96 | plyo T2; lateral/dive landings; COD T3 reactive |
| American football - skill (WR / DB / RB) | Quarterback | INFERRED | PLYO -8, COD -6, SPRINT -3, VPUSH -2, ISO_REAR +6, THROW +2 | total 118; athletic 44.1%; plyo high ~128 | overhead thrower: SHOULDER_THROWER + ELBOW_THROWER rules; rotational medball only |
| American football - skill (WR / DB / RB) | Kicker / punter | INFERRED | PLYO -12, COD -12, SPRINT -5, UKD +3, UHD +3 | total 106; athletic 35.8%; plyo high ~96 | single-leg strength, hip flexor and adductor capacity (HIP_FLEXOR, GROIN_ADDUCTOR) |
| Soccer (outfield) | Goalkeeper | INFERRED | SPRINT -6, COD -6, THROW +4, VPUSH +1, ISO_REAR +3 | total 110; athletic 46.4%; plyo high ~168 | lateral/vertical diving plyos (lateral 45%); overhead/rotational distribution throws; shoulder + hip care |
| Softball | Softball pitcher (windmill) | INFERRED + SCIENCE | ISO_BICEP +2, ISO_REAR +3, ISO_GRIP +3, THROW -3 | total 113; athletic 23%; plyo high ~72 | windmill loads the shoulder like baseball pitching and the biceps eccentrically; tournament weekends can mean 1,200-1,500 pitches in 3 days: schedule lifting around them |
| Ice hockey (skaters) | Goalie | INFERRED | SPRINT -3, PLYO -6, THROW -4, COD +2 | total 90; athletic 35.6%; plyo high ~96 | frontal-plane pushes, hip IR/ER mobility, adductor capacity (butterfly) |
| Track sprinter (100-200 m; jumpers as variant) | Jumpers (LJ/TJ/HJ) | INFERRED | PLYO +6, SPRINT -4 | total 112; athletic 50%; plyo high ~192 | plyo T4-T5, unilateral take-off emphasis |
| Track sprinter (100-200 m; jumpers as variant) | 400 m / hurdles | INFERRED | - | - | add LC and B conditioning; hurdlers add hip mobility |
| General population / longevity | Older adults (65+) | SCIENCE (NSCA older-adult position stand) | - | - | 2-3 days/week, 2-3 sets per major muscle group, 8-10 exercises; power work at 40-60% 1RM (30-60% if frail); sit-to-stand, step-ups, balance every session; no plyos unless cleared; low-amplitude only |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | MM athletic STARTING (off-season block 1) | OBSERVED | - | - | 3 days, 89 working sets, 146 high contacts, 210 throws (ASSUMED: the cell says only 'ALL LIST'; 210 = the 19-throw ballistics 'MEDBALL CHEAT SHEET', 17 x 10 + 2 x 20), resistance 44 sets |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | MM athletic MID | OBSERVED | - | - | 4 days, 72 sets, 71 high + 120 low contacts, 400 throws (10 rotational x 2x10 twice) |
| Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill) | MM athletic ADVANCED | OBSERVED | - | - | 4 days, 59 sets, 32 high + 100 low, 420 throws (ASSUMED: 2 x 'ALL LIST' = 2 x 210), resistance 24, 'DEADLIFTS (1RIR)' 3x1 |

Boxer base phase (OBSERVED wk1-2): THROW 19, BKD 6, BHD 6, UKD 6, UHD 6, HPUSH 6, VPUSH 6, HPULL 6, VPULL 6, ISO_QUAD 6, ISO_HAM 6, ISO_BICEP 3, ISO_TRICEP 3, CORE 14.  CrossFit power month (OBSERVED SEPT): TE 24 (plus aerobic L4 + WODs L4 + TEST).

## 6. Profile cards (rationale, template, season overrides, what to confirm)

### Baseball - position players  (`baseball_position`)

* **Evidence:** OBSERVED (MASTER_MODEL 'BASEBALL', Block 1 off-season means) + INFERRED position deltas
* **Template:** MM BASEBALL 4-day Parts A-E (Part A ballistics, Part B core by plane, OPTIONAL PIECE 'OLY', Part C bilateral + upper compound superset, Part D unilateral + 2 isolation tri-set, Part E 'Buy out')
* **Days:** 4 main + 0 optional (Mon/Tue/Thu/Fri written (OBSERVED); Wed + weekend left for practice/games (INFERRED))
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); COD +2 and SPRINT +2 INFERRED for position players; OBSERVED B1 means; COD 2 and SPRINT 3 are INFERRED additions for position players (observed COD = 0, AP_SPRINT = 1.0)
* **Why (INFERRED unless stated):** The only fully-written athlete year in the workbook (24 week-grids). Used as the template for every rotational / overhead sport.
* **Plyo notes:** OBSERVED: lower plyos in Part A Tue/Fri; jumps also replace resistance slots on 'Speed' days ('DB Squat Jumps', 'broad jumps', 'Suitcase DB RFE lunge jumps')
* **Throw notes:** upper ballistics Mon/Thu Part A; rotational scoops 'In-out of hip', half-kneeling slams; throws also sit in the core Part
* **COD notes:** INFERRED for position players: crossover/first-step and lateral shuffles (observed program has none; open question)
* **Season overrides:** in_season: OBSERVED in Block 3 (its in-season reading is INFERRED from the week dates vs the calendars): same 4 days, Part C 4 x 10 (4 x 8 in wk1-2), no OLY, '1x 30 Sec Fast Run' / cal-sprint buy-outs
* **Confirm with coach:** Do pitchers get a different template from position players (row-16 calendar splits 'PITCHERS/CATCHERS' from 'POSITIONS')? Should position players get COD and sprint slots the observed program does not have?

### Boxing  (`boxing`)

* **Evidence:** OBSERVED (MASTER_MODEL 'EXAMPLE BOXING 8 WEEK BUILD UP', weeks 3-6 mean = conversion phase; weeks 1-2 = base)
* **Template:** MM BOXING build-up (Mon/Tue/Thu/Fri; medball list Mon/Thu, conditioning first Tue/Fri)
* **Days:** 4 main + 0 optional (Wed/Sat/Sun empty: boxing practice (INFERRED))
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); OBSERVED weeks 3-6 mean (component sets: every movement in a complex counts its own sets; each medball throw = 1 set of 10)
* **Why (INFERRED unless stated):** Coach's only fighter program; defines the striker template (base -> conversion), the medball dose and the 'remove pressing/pulling' rule.
* **Plyo notes:** OBSERVED: high-intensity contacts per session 28-32 (vs 48.7 athletic STARTING); bilateral max-effort jumps (tuck jumps, DB squat jumps, broad jumps) appear only as 5-rep components of the two complexes (L22, L46); outside them the high-amplitude work is 'Weighted Depth Drops' x8 (landing), 'Single Leg to high march jump' 6/6 and 'Drop into Box Jumps' x8. Mix recomputed wk3-6 (298 contacts): 85% vertical / 15% horizontal (broad jumps + high-knee runs) / 0% lateral, 62% unilateral, 8% landings ('Single Leg to high march jump' counted vertical here; under the BASEBALL keyword rule, where 'march jump' = horizontal, the split would be 73/27). 'Fewer plyos' for boxers shows up as type (ankle/reactive, single-leg) and packaging, not as a lower count than the generic athlete example.
* **COD notes:** OBSERVED 0 COD; footwork and reactive work happen in boxing practice (INFERRED)
* **Season overrides:** camp: INFERRED: PLYO x0.6 (high 70-80), rope kept, throws ~230, lifting 2-3 days; note: observed wk7 mini-deload, wk8 peak
* **SCIENCE:** boxing is predominantly aerobic with high lactate (post-bout ~11.8 mmol/L); elite activity:rest about 18:1
* **Confirm with coach:** Is the boxer example the ceiling for boxing plyos (113-129 high-amplitude contacts/week) or a typical dose? Is removing bench and pull-ups after week 2 a rule for every striker?

### CrossFit - competitor  (`crossfit_competitor`)

* **Evidence:** OBSERVED (MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' macro grid + FULL TIME table; weekly sets = JULY strength month)
* **Template:** CF macro: plan[quality][month] = level; dose = FULL TIME table
* **Days:** 4 main + 1 optional (MON/TUESD/THURS/FRID core; SAT = extra AEROBIC session in the aerobic level 3-4 months (AUG/SEPT/NOV/DEC/MAY), plus a SAT WOD in MAY (TEST/PEAK month, G144 'YES'); no SAT lifting in any month grid; WED/SUN 'OFF' (OBSERVED))
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); OBSERVED JULY (STRENGTH L4 6x4 + RESISTANCE L2 with ILLUSTRATIVE 3-exercise LB/UB sessions). Power months (AUG/SEPT/DEC) replace all of it with 20-24 Olympic sets. WOD, skill and aerobic sessions come on top (not sets).
* **Why (INFERRED unless stated):** Quality x month x level is the coach's master abstraction; the competitor gets volume progression (add sets), the class member intensification (cut reps).
* **Plyo notes:** INFERRED: box-jump volume lives inside WODs
* **SCIENCE:** CrossFit injury reviews: shoulder 6.7-40.6% of injuries (gymnastics), low back 12.9-36% (powerlifting movements)
* **Confirm with coach:** Is HALF TIME the class/part-time dosing? Number of WODs at 'LVL 4 = wods a week'?

### Hybrid athlete (strength - athletic - 'crossfitish')  (`hybrid`)

* **Evidence:** OBSERVED ('(NOT DONE) 4 TRACKS PROGRAMMING' HYBRID 8-week, mean of weeks 1-7, assumed sets where blank)
* **Template:** HYBRID-8: Mon squat + clean + 'UNI RDL/ CORE/ UNI GB', Tue sprint + bench/core + jumps, Thu deadlift + snatch + lunge/row/core, Fri easy cardio + jumps + 'uni RDL/ core/ OH press', Sat squat + lunge/T2B/press tri-set; an 'AMRAP' 12 -> 20 row (row 70) is not tied to any day
* **Days:** 5 main + 0 optional (WED/SUN off (INFERRED from absence))
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); OBSERVED HYBRID-8 assumed buckets, weeks 1-7 mean (accessories = FOCUS)
* **Why (INFERRED unless stated):** Observed general 'athletic gym' product.
* **Confirm with coach:** What does the 'AMRAP' row 12..20 apply to?

### Powerlifting / max strength  (`powerlifting_strength`)

* **Evidence:** OBSERVED ('(NOT DONE) 4 TRACKS PROGRAMMING' STRENGTH-8 conjugate, mean of loading weeks; STRENGTH-12 as variant)
* **Template:** STRENGTH-8: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival'; Mon lower M.E., Wed upper M.E., Thu plyo + lower D.E., Sat upper D.E.
* **Days:** 4 main + 0 optional
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); OBSERVED STRENGTH-8 v04 loading-week means (squat-week / hinge-week alternation averaged)
* **Why (INFERRED unless stated):** Coach's conjugate-style product for strength clients.
* **Confirm with coach:** Unilateral pairing: same pattern (STRENGTH-8) or opposite (STRENGTH-12/HYBRID)?

### Bodybuilding / aesthetics  (`bodybuilding_aesthetics`)

* **Evidence:** OBSERVED (BYOP 'AESTHETICS - FULL BODY - 4 DAYS' coach convention + optional days; MM AESTHETICS-8/12 and PPL as variants)
* **Template:** BYOP AESTHETICS 4-day A/B/OPT (A: Calves, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Bicep, Leg Extensions; B: Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, Tricep, ABdution)
* **Days:** 4 main + 2 optional
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); OBSERVED slot skeleton; set counts ASSUMED from the coach's PARTIAL fill (Day 1 complete: calves 3 x '15 Reps', compounds 3, 'Ez Bar Curls' / 'Leg Extensions' 2 x '20 Reps'; Day 2 only 'DB Deadlifts' 3, 'Push Ups ' 3, 'DB Push press' 5 x '6 to 8 Reps' and a set-less 'Staggered Stance DL w/ DB '; Days 3-4 and both 'Optional' blocks unfilled) extrapolated to every slot
* **Why (INFERRED unless stated):** Defines the resistance skeleton every other template reuses.
* **SCIENCE:** Schoenfeld 2017: graded dose-response up to ~10+ sets/muscle/week
* **Confirm with coach:** Do Focus sets keep being added until the target muscle reaches 15-20 sets?

### Fat loss / body toning  (`fat_loss`)

* **Evidence:** OBSERVED (MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO' weeks 1-4 mean incl. circuits; BYOP BOOTCAMP options as variants)
* **Template:** FAT BURN: Mon lower, Tue upper, Wed cardio, Thu lower, Fri upper, Sat cardio; 2 'CIRCUITS RECCOMENDED' per week
* **Days:** 4 main + 2 optional (Wed/Sat '30-40 mi slow/steady CARDIO')
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); OBSERVED lifting block + circuit stations (round count applied to every station), weeks 1-4 mean
* **Why (INFERRED unless stated):** Fat loss = hypertrophy lifting + steady cardio + metabolic circuits (OBSERVED).
* **Confirm with coach:** Are 40-rep isolation sets deliberate for fat loss?

### Basketball  (`basketball`)

* **Evidence:** INFERRED (no basketball program in the sheets). Ordering anchor OBSERVED in the coach's own words: 'basketball players need more plyos'.
* **Template:** BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (4 main x 10 slots + Wed/Sat optional) with a SPRINT slot added
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Highest jump and landing frequency of the team sports, short accelerations and constant lateral COD -> the top plyo tier and a high COD tier, moderate throws.
* **Plyo notes:** Plyo slots: 2 per A day and 2 per B day (template has 2 + 1). Count game jumps in-season: backcourt ~41, frontcourt ~79 jumps per game.
* **Throw notes:** chest pass / overhead / step-forward throws; rotational for contact strength
* **COD notes:** defensive slides (library 'Shuffles' L13), closeouts, 5-10-5 (already in the COD list as a date-coerced cell L92 that reads 5/10/05); ~1,000 movement changes per game
* **Season overrides:** in_season: {"PLYO": 0.35, "JLK": 0.6, "COD": 0.3, "SPRINT": 0.5, "resistance": 0.7, "days": "2-3 lifts/week"}; pre_intensify: {"PLYO": 1.0, "note": "already at T5: shift mix toward reactive/unilateral rather than more contacts"}
* **SCIENCE:** time-motion: backcourt 41 +/- 6, frontcourt 79 +/- 5 jumps per game; ~1,050 activity changes per game, ~5% of live time sprinting; jumper's knee prevalence 31.9% in basketball (Lian 2005); NSCA plyo volume guide 80-100 / 100-120 / 120-140 contacts per session (beginner / intermediate / advanced)
* **Confirm with coach:** Is 220-300 high-amplitude contacts/week the right off-season basketball dose (vs the boxer's 113-129)? Guards vs bigs: same template with different picks, or different slot counts?

### Volleyball  (`volleyball`)

* **Evidence:** INFERRED (no volleyball program in the sheets)
* **Template:** BYOP ATHLETIC 4-day; second A-day plyo slot = approach/block jump; ISO_REAR added for the hitting shoulder
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Jump frequency per match rivals basketball but vertical/bilateral and with less running -> top plyo tier, low sprint/COD, shoulder care.
* **Plyo notes:** vertical, mostly bilateral approach/block takeoffs; setters jump the most per point (~0.6-0.7 jumps/point)
* **Throw notes:** overhead slams / overhead throws (spike pattern) + rotational
* **COD notes:** short lateral shuffles, block footwork, dig reactions
* **Season overrides:** in_season: {"PLYO": 0.3, "JLK": 0.5, "resistance": 0.7, "note": "match/practice jumps dominate"}
* **SCIENCE:** hitters 19.7-80, middles 52.5-77.2, setter ~104.5 jumps per match (semi-pro male); jumper's knee prevalence 44.6% in elite volleyball (Lian 2005); shoulder overuse mostly from spiking
* **Confirm with coach:** Volleyball rank vs basketball on plyo dose (equal top tier?)

### American football - skill (WR / DB / RB)  (`football_skill`)

* **Evidence:** INFERRED. Note: the coach's COD library is mostly the receiver route tree ('FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL') plus 'Shuffles', 'LEFT TEST' (INFERRED: L-test) and a date-coerced 5-10-5 cell - OBSERVED.
* **Template:** BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Highest sprint and route-COD demand; short 5-6 s plays with long rests -> alactic conditioning, horizontal/lateral plyos.
* **COD notes:** route tree EASY -> MOD. -> HARD TURN; DBs: backpedal-break and reactive mirror
* **Season overrides:** in_season: {"PLYO": 0.4, "COD": 0.3, "SPRINT": 0.5, "resistance": 0.75, "days": "2 lifts (Mon/Tue after game + Wed/Thu)"}
* **SCIENCE:** play duration ~5.3-5.7 s, rest ~33 s between plays, exercise:rest ~1:5.9; Nordic programmes cut hamstring injuries up to 51%
* **Confirm with coach:** Use the route-tree COD library as-is for non-football athletes?

### American football - big skill (LB / TE / FB / S)  (`football_big_skill`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Between skill players and linemen on every dial.
* **Season overrides:** in_season: {"PLYO": 0.4, "COD": 0.3, "resistance": 0.75}

### American football - linemen (OL / DL)  (`football_lineman`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day with fewer plyo slots and more resistance slots
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** 'Some need more resistance training' end of the athlete spectrum.
* **Throw notes:** chest pass / squat-to-chest pass = punch/strike pattern
* **COD notes:** 5-10 yd, kick-slide, pull-and-turn
* **Season overrides:** in_season: {"resistance": 0.8, "PLYO": 0.5}

### Soccer (outfield)  (`soccer`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Most turns and running of any sport here; hamstring and groin are the dominant injury drivers.
* **COD notes:** ~726 turns per match, 609 of them 0-90 degrees -> most work in EASY/MOD. TURN plus reactive
* **Season overrides:** in_season: {"PLYO": 0.4, "COD": 0.3, "SPRINT": 0.8, "resistance": 0.6, "days": "2 lifts/week (MD+2 strength, MD-3/4 power)"}
* **SCIENCE:** 726 +/- 203 turns per match (EPL); Copenhagen programme -41% groin problems; Nordic programmes -51% hamstring injuries

### Softball  (`softball`)

* **Evidence:** INFERRED from OBSERVED BASEBALL (same skeleton) + SCIENCE on windmill pitching
* **Template:** MM BASEBALL 4-day Parts A-E
* **Days:** 4 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Same rotational/overhead demands as baseball; female populations add ACL-focused landing work.
* **SCIENCE:** windmill pitching produces shoulder/elbow loads comparable to baseball pitching

### Ice hockey (skaters)  (`hockey`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day; lateral plyo emphasis; Copenhagen fixed
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Skating = hip extension + abduction + external rotation -> frontal/transverse priority; adductor deceleration drives groin strains.
* **Throw notes:** rotational scoops / side slams = shot pattern
* **COD notes:** on-land transfer is limited; agility lives on the ice
* **Season overrides:** in_season: {"PLYO": 0.5, "resistance": 0.7, "days": "2 lifts/week"}
* **SCIENCE:** shifts 30-80 s with 4-5 min recovery; pre-season adduction strength 18% lower in players who later had groin injuries

### Tennis (and racket sports)  (`tennis`)

* **Evidence:** INFERRED
* **Template:** MM BASEBALL-style Parts (upper ballistics + lower ballistics days, core by plane) or BYOP ATHLETIC 4-day
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Rotation both directions + lateral COD + overhead serve -> high throws (transverse), high COD, frontal/transverse priority.
* **Throw notes:** forehand/backhand rotational scoops both sides + overhead (serve)
* **COD notes:** 1.6-4 direction changes per point, every ~3 s
* **Season overrides:** in_season: {"PLYO": 0.5, "COD": 0.4, "resistance": 0.7, "note": "tournament weeks = 1-2 short sessions"}
* **SCIENCE:** players change direction ~1.6 times per point (every ~2.7-3.1 s); elbow 21.4%, shoulder 19.4%, lumbar 17.3% of tennis injuries

### Golf  (`golf`)

* **Evidence:** INFERRED
* **Template:** 3-day full body (UPPER/LOWER-style) with BASEBALL-style rotational medball block
* **Days:** 3 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Clubhead speed tracks rotational power and lower-body RFD; the coach's into/out-of-hip medball matrix is the most golf-specific tool in the library.
* **Throw notes:** half-kneeling 2x2 matrix 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP', 'OUT OF THE LEFT LEG/HIP', 'INTO THE RIGHT LEG/HIP' (ballistics D65-D68), step-back rotational chest pass
* **Season overrides:** in_season: {"THROW": 0.6, "resistance": 0.7, "days": "2 sessions, none the day before a round"}
* **SCIENCE:** rotational power correlates with clubhead speed; low back is the most common golf injury; lumbar compression up to ~8x body weight

### Track sprinter (100-200 m; jumpers as variant)  (`track_sprinter`)

* **Evidence:** INFERRED (sprint itself is the sport; the S&C profile is what the generator writes)
* **Template:** BYOP ATHLETIC 4-day with SPRINT slots as the anchor
* **Days:** 4 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Sprinting is the S&C priority; plyos are horizontal and stiffness-oriented; hamstrings are the injury driver.
* **Throw notes:** overhead backward / forward throws = triple extension
* **Season overrides:** in_season: {"PLYO": 0.5, "resistance": 0.6, "TE": 0.5}
* **SCIENCE:** most hamstring strains occur in late swing at high speed; Nordic programmes -51%

### Distance runner (5 km - marathon)  (`distance_runner`)

* **Evidence:** INFERRED + OBSERVED analog (Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' + 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.')
* **Template:** 2-3 strength sessions/week + the running plan (Sheet24: 2 runs/week x 21 weeks)
* **Days:** 3 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Strength and plyos are there for running economy and tissue capacity, not mass.
* **SCIENCE:** strength (high load) + plyometric training 2-3x/week for 8-12 weeks improves running economy
* **Confirm with coach:** Keep the Chris Hinshaw plan as-is, given the 'no packaged models' philosophy?

### Kickboxing / Muay Thai  (`kickboxing_muay_thai`)

* **Evidence:** INFERRED from OBSERVED boxing template
* **Template:** MM BOXING build-up structure
* **Days:** 4 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Boxing plus kicks and clinch: more single-leg, frontal and transverse work, neck.
* **COD notes:** angles, pivots, in-out
* **SCIENCE:** elite kickboxing HIA 2.2 s, LIA 2.3 s, pauses 5.4 s; fighting:non-fighting 1:1

### Karate / Taekwondo  (`karate_taekwondo`)

* **Evidence:** INFERRED; ordering anchor OBSERVED in coach's words ('boxers and karate athletes don't need that many plyos')
* **Template:** MM BOXING build-up structure
* **Days:** 4 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Few high-amplitude jumps (coach), lots of bouncing footwork and rotation -> T2 plyo high, T4 low, T3 throws.
* **SCIENCE:** karate official matches: high-intensity actions 1.5 s, effort 10 s / rest 16 s; taekwondo effort 8 s / pause 8 s (1:1)

### MMA  (`mma`)

* **Evidence:** INFERRED; ordering anchor OBSERVED in coach's words ('MMA fighters need a lot more plyos [than boxers], not as much as basketball')
* **Template:** MM BOXING build-up structure + grappling pull/grip/neck
* **Days:** 4 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Between boxing and basketball on plyos (coach), adds grappling pulling, grip, neck and horizontal (shot) power.
* **Throw notes:** rotational + overhead slams (ground-and-pound / takedown finish)
* **SCIENCE:** MMA high:low intensity ~1:2-1:4; grappling ~1:1, striking up to 1:7
* **Confirm with coach:** MMA plyo target 160-200 high-amplitude contacts/week?

### Wrestling  (`wrestling`)

* **Evidence:** INFERRED
* **Template:** MM BOXING build-up structure with pulling, grip, neck, carries/drags
* **Days:** 4 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Pulling, grip, neck and relative strength dominate; plyos are horizontal and moderate.
* **Throw notes:** rotational slams + overhead backward throws (suplex pattern)
* **COD notes:** shot/sprawl reactions
* **SCIENCE:** neck-injured wrestlers show weaker neck flexion/extension; cervical work is mostly eccentric/isometric

### BJJ / submission grappling  (`bjj_grappling`)

* **Evidence:** INFERRED
* **Template:** 3-day strength + grip/neck accessories
* **Days:** 3 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Least ballistic combat sport: strength, grip and isometric endurance.
* **SCIENCE:** BJJ demands high handgrip strength/endurance and isometric low-back strength; moderate glycolytic demand

### General population / longevity  (`general_population`)

* **Evidence:** INFERRED from OBSERVED UPPER/LOWER + BOOTCAMP 1 (full-body sessions) + SCIENCE (NSCA older-adult position)
* **Template:** BOOTCAMP OPTION 1-style full body (each session = knee + hip, push + pull, bilateral + unilateral)
* **Days:** 3 main + 2 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Health and longevity: strength + power + balance + aerobic base; athletic patterns only as movement literacy.
* **Throw notes:** light medball chest pass / scoop as power training
* **COD notes:** stepping / shuffles for balance
* **SCIENCE:** NSCA older adults: 2-3 days/week, 2-3 sets per major muscle group, power at 40-60% 1RM

### Youth athlete (multi-sport, pre/circa/post-PHV)  (`youth_athlete`)

* **Evidence:** INFERRED + SCIENCE (Lloyd & Oliver)
* **Template:** BYOP ATHLETIC 4-day cut to 2-3 days, FOUNDATIONAL library blocks only
* **Days:** 3 main + 0 optional
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget
* **Why (INFERRED unless stated):** Exposure to every athletic pattern at foundational levels; landing competency before rebound volume.
* **COD notes:** games-based, tag, reactive
* **Season overrides:** circa_PHV: {"PLYO": 0.6, "SPRINT": 0.8, "resistance": 1.0}
* **SCIENCE:** two plyo sessions/week suffice for low training age; 3-4 once competent (Lloyd & Oliver)

### Generic field/court athlete (BYOP athletic template; JUSTICE LEAGUE partial fill)  (`athlete_generic`)

* **Evidence:** OBSERVED slots (BYOP 'ATHLETIC - FULL BODY - 4 DAYS A') + PARTIAL fill: JUSTICE LEAGUE fills only Monday's 10 slots and Tuesday's plyo slot (all 2 sets) plus the Thursday 'Low Bar Back Squat' name with no sets; the other 38 of the 50 weekly slots (and that squat's SETS/REPS) read 'CHOOSE 👇', so '2 sets on every slot' is an ASSUMED extrapolation; MM 'EXAMPLE ATHLETIC FULL BODY SPLI' as level ladder
* **Template:** BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
* **Days:** 4 main + 2 optional (title of hidden copy: '4 to 6 DAYS A WEEK')
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON)
* **Why (INFERRED unless stated):** The default the coach would hand any athlete: every athletic quality 4x/week at 2 sets, the aesthetics resistance skeleton behind it.
* **Confirm with coach:** Is 2 sets per slot the default for every athletic template?

## 7. Season families (phase multipliers on the baseline)

### field_court - basketball, volleyball, American football, soccer, baseball, softball, hockey, tennis, track sprint (as 'competition' season)

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| off_early_GPP | 2-4 after the post-season | PLYO 0.5, JLK 0.8, THROW 0.8, COD 0.5, SPRINT 0.5, TE 0.5, resistance 1.0, core 1.0 | plyo force phase 'TAKING IN FORCES' (stick the landing) and 'DELIVER FORCES FAST' (onto box) only; COD 'EASY TURN' only; TE = FOUNDATIONAL pulls / squat-to-calf-raise; rep zone VOL 1; conditioning C + B (build the base) | INFERRED from OBSERVED boxer wk1-2 base (3x10, zero plyos), MM athletic STARTING notes A41-A45 'Bring athletes back to feeling/moving great', BASEBALL B1 '12/10/8/8' |
| off_build | 4-8 | PLYO 1.0, JLK 1.0, THROW 1.0, COD 1.0, SPRINT 1.0, TE 1.0, resistance 1.0, core 1.0 | rep zone VOL 1 -> VOL 2 ('12/10/8/8' pyramids); new weekly exercise menu each week (BASEBALL B1 menu overlap <= 0.15); optional OLY introduced in the final third at 75% -> 80% x 4 sets (B1 wk 6-7); every slot may take a 'speed' or 'strength' quality; day tags 'Speed' Mon / 'strength' Tue / 'speed' Fri | OBSERVED BASEBALL Block 1 (the block itself carries no season label; reading it as off/soft season is INFERRED from its 2022 cell dates against the coach's calendars) |
| pre_intensify | 4-8 ending 1 week before first game | PLYO 1.45 (OBSERVED B2/B1 high contacts 151/103), JLK 0.9 (89/97), THROW 1.1 (192/178), COD 1.2 (INFERRED; baseball has none), SPRINT 3.0 (OBSERVED sets 1.0 -> 3.1 on a small base; INFERRED cap: +50% metres for sprint-heavy sports), TE optional, %-based 75 -> 80 -> 85 -> 90% (4x8 -> 4x4), resistance 1.08 (OBSERVED RP+ISO ~72 -> ~78), rising +3-4%/week for the last 3 loading weeks, core 1.35 (11.4 -> 15.6 sets) | rep zone VOL 3 and below ('8/6/4/4', '6/6/5/4', '4/4/4/4'); contrast and complexes ('Heavy front squats' + 'KB squat cleans'; '5 of each' x 5 rounds); Part C/D sets 4 -> 5 for the last 3 weeks; final week = DELOAD: resistance -31%, all sets -46%, athletic 1-2 sets, no buy-out, no OLY, 3 x 8 everywhere (B2 'DELOAD WEEK'); COD adds 'MOD. TURN' / 'HARD TURN' and reactive agility (INFERRED) | OBSERVED BASEBALL Block 2 (B1 -> B2 deltas); reading Block 2 as 'PRE SEASON' is INFERRED from dates (Jan - early Mar 2023) and the closing 'DELOAD WEEK' |
| in_season | whole competitive season | PLYO 1.3 for baseball-type sports (OBSERVED B3/B1 135/103); 0.3-0.5 for jump/run-dominant sports whose games supply contacts (INFERRED), JLK 0.7 (66/97), THROW 1.0 (176/178), COD 0.5 (INFERRED), SPRINT 1.8 baseball (sets 1.0 -> 1.8); 0.6-0.8 for field sports, never 0 (INFERRED, hamstring protection), TE 0 (OBSERVED: no OLY in-season), resistance 1.0 (OBSERVED ~72 -> ~72) at 4 days; 0.6-0.8 when lifting drops to 2-3 days (INFERRED), core 1.4 (11.4 -> 16.4 sets) | main lifts flat 4 x 10 (4 x 8 early); no compound set below 8 reps; no Olympic lifts; alternate 2 proven weekly menus (B3 W1 = B1 W1 overlap 0.89; W6 = B1 wk6 0.83); buy-outs short: '1x 30 Sec Fast Run' or '2x 15 cal bike sprint'; INFERRED for jump/run-dominant sports whose games already supply contacts (basketball, volleyball, soccer): PLYO x0.3-0.5, SPRINT keep 1 max-velocity exposure for hamstring protection, lifting 2-3 days | OBSERVED BASEBALL Block 3 (week labels dated 'March 20 - 26' .. '04/24 to 04/28'; that these dates are 'IN SEASON' is INFERRED by matching them to the coach's season calendars rows 4-17 - the block has no season label) |
| post_season_recovery | 1-2 | PLYO 0, JLK 0, THROW 0, COD 0, SPRINT 0, TE 0, resistance 0.3, core 0.6 | arm care + mobility + easy colour-C cardio; no athletic work | OBSERVED recovery-week CONTENT from BASEBALL Block 1 'wk 8' (24 sets: 'Kettlebell arm bars', 'Half kneeling shoulder roll', 'floor windchield wipers', 'Paced Cardio - easy' 4 x '10 min'; the 'OPTIONAL PIECE' 'OLY' 4 x 6 label is still there with no exercise). That week sits at the END OF BLOCK 1, between Block 1 and Block 2 - not after a season - so using it as the post-season template is INFERRED |

### combat - boxing, kickboxing/Muay Thai, karate/taekwondo, MMA, wrestling, BJJ

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| base_GPP | 2 | PLYO 0, JLK 0, THROW 0.5, COD 0, SPRINT 0, TE 0, resistance hypertrophy 3 x 10 on all 8 patterns 2x/week incl. horizontal push and vertical pull, core 0.8 (OBSERVED 14 vs 17 core sets) | upper/lower split Mon/Thu legs, Tue/Fri upper; one medball list (19 throws x 10 = 190); 1 colour-A ('20 sec fast/ 40 sec slow') + 1 colour-C ('20 min' easy) per week | OBSERVED 'EXAMPLE BOXING 8 WEEK BUILD UP' weeks 1-2 (yellow FFFF00) |
| conversion_build | 6 | PLYO 1.0, JLK 1.0, THROW 1.0, COD 1.0, SPRINT 1.0, TE 1.0, resistance 1.0, core 1.0 | exercise list replaced (phase change, +41% component sets); 2-week steps: sets constant for 2 weeks; the deadlift complex '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' (L46), 'Hang Power Clean & Press' (L35) and 'Single Leg swiss ball knee tuck in + DB rows' (L20) are the levers: 3 sets wk3-6 -> 4 (wk7) -> 6 (wk8); the squat complex '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (L22) goes 3 -> 2 (wk7) -> 3 (wk8); wk 7 = accessory mini-deload (eleven rows 3 -> 2 sets: L12-L14, L21-L23, L32, L36, L37, L45, L48); wk 8 = peak (dark red CC0000): hinge complex, clean & press and DB-row superset 6 sets, 'Sprint 20/ Recover 40' 8 rounds, deadlift + rope 4 sets; strikers: horizontal push and vertical pull removed after base (OBSERVED for boxer; INFERRED rule for striking sports) | OBSERVED boxing weeks 3-8 (EA9999 -> E06666 -> CC0000 heat ramp) |
| fight_camp | 6-8 before a bout | PLYO 0.6, JLK 1.0, THROW 0.6, COD 1.0, SPRINT 0.8, TE 0.6, resistance 0.6, core 0.8 | lifting 2-3 days, 2 sets per slot, keep 1 heavy and 1 fast exposure per pattern; conditioning = round simulations (colour B / LC) matched to the sport's round length; taper last 7-10 days: volume -40-60%, intensity kept; weight cut: no new exercises in the final 3 weeks | INFERRED (no camp program in the sheets); SCIENCE: maintain strength/power with low volume while sport-specific conditioning peaks |
| post_fight | 1-2 | all 0.3 | easy colour C, mobility, injury check | INFERRED |

### strength - powerlifting / strength track

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| 8_week | - | - | 7 loading weeks, WK8 = 'TEST' (max-effort days) + 'DELOAD' (dynamic days); three UNLABELLED coloured rows over WK1-WK8 (E4:L6): green B6D7A8 5,5,4,4,3,3,2,1; pink EAD1DC 5,4,3,2,1,3,2,1; blue CFE2F3 3,3,2,1,3,2,1,1 - the day rows only say 'SEE'. Reading pink = M.E. reps, blue = D.E. reps, green = sets is INFERRED (the B column fixes 'the work' at 5 sets Mon/Wed/Thu and 3 Sat); volume flat or falling, intensity rising | OBSERVED STRENGTH-8 / '(NOT DONE) EXAMPLE CONJUGATE' |
| 12_week | - | - | % 80,80,85,85,90,90 then 'MID DELOAD' WK7; RPE 7,7,7,8,8,9,7,8,9,9,9,10; SETS 4,4,5,5,6,6,3,5,6,6,7,7; REPS 5,5,4,4,3,3,4,4,3,3,2,2; main-lift sets +5.2%/week | OBSERVED STRENGTH-12 |
| meet_peak | - | - | last 2-3 weeks: accessories -50%, singles at RPE 8-9, plyo 'EASY' kept or dropped | INFERRED |

### physique - bodybuilding / aesthetics / fat loss / bootcamp

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| 8_week | - | - | SETS 2,3,3,3,4,4,5 per exercise, REPS 12,10,8 waves, '1-2 RIR', WK8 'DELOAD WEEK' | OBSERVED AESTHETICS-8 |
| 12_week | - | - | SETS 3,3,3,4,4,4,3,4,4,4,4,5; WK7 'A WEEK LOWER'; WK9-12 supersets, '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; A/B weeks rotate variants | OBSERVED AESTHETICS-12 |
| 4_week_fat_loss | - | - | weekly lifting sets 60,60,64,70 (circuits excluded); compound reps 15/12 -> 8-10; leg isolation 4x15 -> 3x20 -> 2-3x40, arm isolation 2x30 -> 3x40, side raises 3x15 -> 4x20; circuits 3x30 s -> 5x50 s (two 4-station circuits/week); variation upgrade at WK3; no deload | OBSERVED FAT BURN |

### endurance - distance runners

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| base | - | - | strength 2x/week heavy 3-6 reps + low-amplitude plyos; running mostly colour C | INFERRED + SCIENCE (strength + plyo 2-3x/week for 8-12 weeks improves running economy) |
| build | - | - | 2 run sessions/week: long run + quality (hill sprints 6-10 reps x 8-20 s, flat sprints 40-80 m, intervals '5x200m fast', progression runs); cut-back weeks 3, 6, 8, 12, 18; '1-mile at max effort' tests wk 10 and 14; strength 1-2x/week maintain (INFERRED) | OBSERVED Sheet24 structure (running only - Sheet24 contains no strength work; the strength rule is INFERRED) |
| taper_race | - | - | strength 1x/week low volume; no new plyos 10 days out (INFERRED) | OBSERVED Sheet24 wk 21 taper ('Tapering: 6 miles, comfortable pace', then 'Race day: Half Marathon'); strength/plyo rules INFERRED |

### crossfit - CrossFit competitor / class / hybrid

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| annual_macro | - | - | 3 blocks of ~4 months: RESISTANCE -> STRENGTH -> POWER -> TEST/PEAK; aerobic and WOD levels ramp 1 -> 4 inside each block and reset higher at the next; event month strips all lifting; FULL TIME = add sets; HALF TIME = cut reps at 3 sets + 'LVL 5 = Work up to 1RM' | OBSERVED 'EXAMPLE CROSSFIT SPLIT' A10:M17 |

### youth - youth athletes

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| pre_PHV | - | - | 2-3 sessions/week of 30-60 min; wide range of jumps/landings at moderate volume (T2), games-based COD/sprint; bodyweight + light DB/medball resistance at FOUNDATIONAL levels only | SCIENCE (Lloyd & Oliver youth physical development; NSCA youth position) |
| circa_PHV | - | - | high-amplitude plyos -30-50%, no depth jumps above ~30 cm; technique emphasis, flexibility/ROM maintenance; watch knee/heel pain via 'HOW IT FELT?' = 'Felt a PAIN' | SCIENCE for the risk (growth-related apophysitis: Osgood-Schlatter, Sever's); the -30-50% and ~30 cm caps are INFERRED analyst heuristics, not literature thresholds |
| post_PHV | - | - | progress toward the adult sport profile; introduce barbell and Olympic pulls with technical competency | SCIENCE |

### general - general population / longevity / older adults

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| continuous_blocks | - | - | 4-8 week blocks with an easier week every 4-8 weeks; no seasons | INFERRED from OBSERVED UPPER/LOWER levels + SCIENCE (NSCA older-adult position stand) |

Per-sport overrides on top of the family multipliers are in each profile card (section 6) and in `profiles[].season_overrides` in the JSON. The key INFERRED override: jump- and run-dominant team sports (basketball, volleyball, soccer, football) cut gym plyos to x0.3-0.5 in season because games and practice supply the contacts, but keep one max-velocity sprint exposure per week for hamstring protection.

## 8. Plan length shapes (OBSERVED, apply to every profile)

| plan | shape | source |
|---|---|---|
| 6 weeks | first 6 weeks of the 12-week shape, ending at the wave peak (WK6 column highlighted FFF2CC) | INFERRED from 4 TRACKS STRENGTH-12 |
| 8 weeks | 7 progressive weeks + week 8 'DELOAD WEEK' / 'TEST' | OBSERVED AESTHETICS-8, STRENGTH-8, CONJUGATE, CrossFit class |
| 12 weeks | 6 weeks + week 7 deload ('MID DELOAD' / 'A WEEK LOWER') + 5 weeks with a phase change; peak in week 12 | OBSERVED STRENGTH-12, AESTHETICS-12 |
| athlete 8-week build | 2-week base + 6-week conversion in 2-week steps, week 7 mini-deload, week 8 peak | OBSERVED boxer |
| athlete season block | 8-week grids per season block, pre-season ends with a deload week | OBSERVED BASEBALL |

## 9. Injury hotspot library (selection rules)

| code | evidence | sports | source / mechanism | generator rules |
|---|---|---|---|---|
| PAIN_GENERAL | OBSERVED | all | MASTER_MODEL 'EXAMPLE ATHLETIC FULL BODY SPLI' A6: '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'; UPPER/LOWER and PPL A7 give the grip rule only (no 'going unilateral'); BYOP 'HOW IT FELT?' FEELING list AY8:AY11 = 'Felt the RIGHT muscles' / 'Felt the WRONG muscle' / 'Felt a PAIN' / 'Couldn't do it' | swap fixed-grip barbell/bar -> DB/KB/handles in the same pattern; swap bilateral -> unilateral in the same pattern; if 'Felt a PAIN' twice in a slot: swap within the category, then cut sets, then drop a library level (INFERRED order) |
| SHOULDER_THROWER | OBSERVED + SCIENCE | baseball, softball, volleyball, tennis, football QB, handball | OBSERVED BASEBALL: no barbell BENCH press is named (horizontal pressing = DB, bottoms-up, alternating, top-down; 'fast banded assisted bench press' B2W5/B2W7 names no implement); vertical push is mostly single-arm / half-kneeling / landmine / seesaw / DB push press, BUT barbell overhead pressing is written 3 times ('barbell press' 4 x '8/8' B1W2 AE34 and B1W3 AW34, 'barbell overhead strict press' 4 x 8 B2W1 Q52) plus 'arnold presses' B3W3; recovery week 'Kettlebell arm bars', 'Half kneeling shoulder roll'. SCIENCE: pitchers carry up to 60% of shoulder and 40% of elbow injuries at college/pro level; posterior cuff weakness and total-rotation deficits are risk factors. | pressing = DB / alternating / landmine ('Kneeling Landmine Press' AA93, 'Sesaw Db Press' AA91, alternating presses AD126-AD129; AD130 is 'Push ups (1 hand Higher)'); heavy barbell overhead only occasionally (the coach writes it 3x in a 24-week baseball year, never in-season); add ISO_REAR (posterior cuff / 'Bent over DB Reverse flies' AH10, 'Seated DB Reverse Flies' AH15) 2x/week; limit hanging vertical-pull volume to sets that keep 2 RIR (open question: coach); throwing-day rule: medball rotational OK, overhead slams and plyo push-ups not on bullpen days (INFERRED) |
| SHOULDER_STRIKER | OBSERVED (boxer) + INFERRED generalisation | boxing, kickboxing, MMA, karate/TKD | OBSERVED boxing wk3-8: zero horizontal push, zero vertical pull, zero arm isolation; only 'DB rows', the press in 'Hang Power Clean & Press', and side/front raises; DB 'sesaw' presses elsewhere | after the base phase drop HPUSH and VPULL slots (punching and bag work supply the volume); keep HPULL (rows) and ISO_SIDE/ISO_REAR for scapular balance; presses that remain = alternating DB / push press |
| SHOULDER_GYMNASTIC | SCIENCE | CrossFit | CrossFit injury reviews: shoulder 6.7-40.6% of injuries, most often in gymnastic movements; low back most often in powerlifting movements | cap kipping/high-volume hanging work in skill blocks; keep strict pulling strength (VPULL) >= kipping volume; ISO_REAR 2x/week |
| ELBOW_THROWER | SCIENCE | baseball pitcher, softball pitcher, javelin, QB | UCL load in overhead throwing; softball windmill shoulder/elbow loads comparable to baseball, high eccentric biceps load | forearm/grip and wrist-flexor work (ISO_GRIP) 2x/week; softball pitchers: eccentric biceps emphasis in ISO_BICEP; count medball overhead throws as arm load on high-pitch days |
| ELBOW_LATERAL_RACKET | SCIENCE | tennis | elbow is the most common tennis injury site (21.4%), shoulder 19.4%, lumbar 17.3% | wrist-extensor isometric/eccentric (ISO_GRIP) 2-3x/week; neutral-grip DB pressing |
| WRIST_HAND | INFERRED + SCIENCE | boxing, CrossFit, gymnastics-heavy | - | prefer DB/KB neutral grips over front-rack barbell for strikers; limit front-squat rack volume when wrist pain flagged |
| NECK | SCIENCE (gap in coach library) | wrestling, BJJ, MMA, American football, rugby, Muay Thai clinch, hockey | wrestlers with neck injuries show weaker neck flexion/extension; most cervical work in wrestling is eccentric/isometric | add ISO_NECK 2x/week (isometric 4-way, then banded/plate eccentric) - NO library column exists: create one; progress static -> dynamic like the core plane ladder |
| LOW_BACK_ROTATIONAL | OBSERVED (core ladder) + SCIENCE | golf, tennis, baseball, softball, hockey, throwers | golf swing lumbar compression up to ~8x body weight; low back = most common golf injury. OBSERVED coach: core difficulty ladder SAGITAL -> FRONTAL -> TRANSVERSE; FUNCTIONAL 'ANTERIOR OBLIQUE SYSTEM' Pallof holds and chops | anti-rotation static first (Pallof holds BC46-BC49) before rotational dynamic (chops BC9/BC13/BC17, 'Woodchoppers', 'Cable Machine Oblique Rotations'); hip rotation (into/out-of-hip) emphasis so rotation comes from the hips, not the lumbar spine (medball half-kneeling 2x2 matrix); avoid high-volume loaded flexion+rotation (e.g. weighted Russian twists) when back pain is flagged |
| LOW_BACK_LOADING | SCIENCE + OBSERVED pain rule | powerlifting, CrossFit, linemen, wrestling | - | rotate hinge variants (hex/DB/KB) when flagged; box squats ('(D)BOX') to control depth; core = static anti-extension/anti-flexion first |
| GROIN_ADDUCTOR | OBSERVED (coach uses it) + SCIENCE | soccer, hockey, kickboxing, karate/TKD, MMA, football, tennis | OBSERVED: Copenhagen planks in MM athletic MID F66 and ADVANCED J24 ('DB side raises + Copenhagen plank :50 sec each side'), boxing L13 ('Copenhagen Plank & Unilateral DL') and BASEBALL ('COpenhagen plank' AK30/E48, 'copenhagen plank' DH48/DQ65/BO66, 'Copenhagen raises' S66). SCIENCE: Copenhagen adduction programme 3x/week pre-season and 1x/week in-season cut groin problems by 41% in male football players (Harøy 2019) | 'Coppenhaggen Plank' (R47 / O165) 3x/week pre-season, 1-2x/week in-season; adductor-integrated chops/Pallofs ('Hold object Adducted between knees', 'Knee banded for adduction') |
| HIP_FLEXOR | SCIENCE | sprinters, soccer, kickers, karate/TKD, Muay Thai | - | loaded hip-flexion (FOCUS slot) 1-2x/week; A March / A Skip progressions |
| HIP_FAI_DEEP_FLEXION | SCIENCE | hockey goalie, baseball/softball catcher, hockey skaters | - | limit loaded deep hip flexion volume (box squats to parallel); hip IR/ER mobility in warm-up; more UHD than deep BKD |
| LEAD_HIP_GLUTE | SCIENCE | golf, baseball, softball, tennis | - | lateral hip strength: 'Side Lunges' AL12, 'Step ups (Forward & Side)' AL19, contralateral-loaded lunges; medball half-kneeling scoops labelled 'INTO THE LEFT LEG/HIP' / 'INTO THE RIGHT LEG/HIP' (ballistics MEDBALL CHEAT SHEET D65/D68) both sides |
| HAMSTRING | SCIENCE + OBSERVED library | sprinters, soccer, American football, rugby, baseball base-runners, basketball | Nordic hamstring exercise programmes reduce hamstring injuries by up to 51% (van Dyk 2019); most strains occur in late swing at high speed | 'Nordic Curl' (AN91) or slider/swiss-ball curls (AN18/AN19) 1-2x/week year-round; keep at least one max-velocity sprint exposure per week in every phase; hip-extension strength (RDL / staggered stance DL) |
| ACL_LANDING_CUTTING | SCIENCE + OBSERVED progression | basketball, soccer, volleyball, football, handball, female athletes in all cutting/landing sports, youth | neuromuscular training (plyometrics + strength + proximal control) cuts non-contact ACL injury risk by ~50% in female athletes | plyo force phase 1 first: 'STICK THE LANDING BILATERAL' -> 'UNILATERAL' -> weighted (OBSERVED ballistics tab); COD 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN' only after landing competency; single-leg strength + hip abductor work every week; female athletes: double the phase-1 landing block (INFERRED) |
| PATELLAR_TENDON | SCIENCE | volleyball, basketball, jumpers | jumper's knee prevalence 44.6% in elite volleyball and 31.9% in basketball (Lian 2005) | cap REBOUNDING (phase 4) contacts; never stack max approach jumps + depth jumps on the same day; heavy slow quad work / isometrics (ISO_QUAD 'Leg Extensions', 'Sissy Squats' AK18) 2x/week; in-season: count game/practice jumps before adding gym plyos |
| ANKLE_SPRAIN | SCIENCE + OBSERVED library | basketball, volleyball, soccer, tennis, football | - | ankle-dominant track (the 'JUMPING ANKLE' ankle-hop block C124-C136 under 'TRIPPLE EXTENSION', same list as Sheet23 'FOUNDATINONAL - AP - JUMPING LIMITED KNEE' E2:E12; lateral plate hops G50-G52) 2x/week; single-leg landings with lateral component |
| ACHILLES_CALF | SCIENCE | tennis, basketball, runners, masters athletes, racket sports | - | 'Standing Calf raises (use deficit)' AU9 / bent-knee soleus 2-3x/week; progress JLK volume <= 10-20%/week (INFERRED) |
| BONE_STRESS | SCIENCE | distance runners, youth, female athletes with low energy availability | - | plyo low-amplitude only until 6+ weeks of tolerance; progress total impact load gradually; heavy strength training is protective |
| GROWTH_APOPHYSIS | SCIENCE | youth circa-PHV | - | reduce high-amplitude plyos and depth drops during growth spurts; no maximal loading; FOUNDATIONAL library levels only |
| DECONDITIONED_JOINTS | INFERRED + OBSERVED | fat loss, general population, bootcamp | OBSERVED FAT BURN circuits use only bodyweight/DB moves; jumping jacks and burpees are the only contacts | no plyos beyond low-amplitude until body-mass and landing control allow; machines / supported variants first (higher-constraint pools), free weights later |
| FALLS_BONE_DENSITY | SCIENCE (NSCA older-adult position statement) | older adults | - | power work at 40-60% 1RM moved explosively; balance + sit-to-stand + step-ups every session; 2-3 sets per major muscle group, 2-3 days/week |

## 10. Library and template gaps the profiles need (OBSERVED absence)

| gap | evidence | needed by |
|---|---|---|
| No SPRINT slot in any BYOP template | OBSERVED: in BYOP only ' Max velocity running (top speed)' (PLYOS ADVANCED G128 and FULL JUMPING J11). In MASTER_MODEL sprint work does exist: Sheet23 '✅ MACH DRILLS' / '✅ Acceleration starts' (B48/B49), the cheat-sheet 'RUNNING WARMUP' ('A March', 'A Skip', 'A Runs', 'Falling start accelerations' 5 x '10 yards'), UL/PPL A-drills, BASEBALL '30m acceleration sprint' / 'accelerations baseball starts' | soccer, football skill, track, basketball, baseball position players |
| REPS menu cannot express contacts, throws per side, metres, seconds or 1-3 reps | OBSERVED AW8:AW14 '4 to 6 Reps' .. '20 Reps', 'MYO SET' | every athletic profile |
| No neck exercises | OBSERVED: none in the library or programs | wrestling, BJJ, MMA, football, Muay Thai, hockey |
| CARRY and DRAGS headings have no exercises | OBSERVED BA/BB columns hold only sub-headings (CARRY: 'PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; DRAG: 'SAGITAL', 'FRONTAL'). Carries ARE programmed elsewhere: BASEBALL 'Single side KB carry' (E47, S65) and 'KB Single arm farmer walk carry' (W49), CONTROL PATTERNS 'single side carry' (B10); no drag appears anywhere | wrestling, BJJ, MMA, linemen, general population (grip/anti-lateral flexion) |
| Rear-delt / external-rotation work has no own slot | OBSERVED: reverse flies share the 'ABdution' list; PPL has 'Reverse Flies' slot only | every overhead / throwing sport |
| Reactive agility is defined but not programmed | OBSERVED AGILITYCOD tab ('Agility: Reactive in nature - Incognitive Competence' vs 'COD: Proactive in nature - Cognitive Competence'; it also lists empty headings 'HOPS IN PLACE', 'KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'RUNNING ROUTES', 'ROUTE TREE' with no drills or doses); the COD list is pre-planned only: 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'Shuffles' (EASY TURN), 'DIG/OUT', 'LEFT TEST' (MOD. TURN), 'COMEBACK/CURL' + date cell L92 = 5-10-5 (HARD TURN) | basketball, soccer, football, tennis, combat |
| No observed COD in any MASTER_MODEL program | OBSERVED AP_COD = 0 in athletic, boxing, baseball | decide whether sport practice covers COD |
| No equipment tags on the library | OBSERVED | home / no-gym clients; youth; older adults |

## 11. Open questions for the coach

1. Plyo scale: is the boxer's 113-129 high-amplitude + 142-177 low-amplitude contacts/week (plus jump rope) the CEILING for boxing, a typical dose, or 'a lot'? The whole T1-T5 scale is anchored on it.
2. Do you agree with roughly 220-300 high-amplitude contacts/week for an off-season basketball player, 160-200 for MMA, 60-90 for karate/TKD? Or should 'more plyos' mean more sessions/frequency rather than more contacts per week?
3. When you say boxers/karate need fewer plyos, do you mean fewer HIGH-amplitude jumps (depth jumps, max jumps) while keeping low-amplitude bouncing (rope, squirrel jumps, ankle hops) high, as the boxing example does?
4. Should every field/court sport get a dedicated SPRINT slot (and should 'MACH DRILLS' / 'Acceleration starts' from Sheet23 and the cheat-sheet 'RUNNING WARMUP' move into the BYOP library)? Today sprint only appears as A-drills, 'Falling start accelerations', baseball accelerations, or conditioning intervals.
5. Your MASTER_MODEL programs contain zero change-of-direction work. Is COD left to sport practice for in-season athletes? Should non-football athletes still use the receiver route tree ('FADE' ... 'COMEBACK/CURL'), or do soccer/basketball/tennis need their own COD and reactive-agility list?
6. Medball dose: athletes/fighters get 176-420 throws/week in your examples but the BYOP template at 2 sets gives 64-96. What weekly throw target do you want per sport, and does a 'Throwing' slot mean one throw or the whole 19-throw list?
7. Strikers: is dropping horizontal push, vertical pull and arm isolation after the base phase a rule for every striking sport (boxing, kickboxing, karate), and should MMA keep pulling for grappling?
8. Baseball/softball: do pitchers, catchers and position players get different templates (your pro calendar separates 'PITCHERS/CATCHERS' from 'POSITIONS')? What changes for pitchers on throwing days?
9. In-season for game-heavy sports (basketball, volleyball, soccer, football, hockey): how many lifts per week, and should game/practice jumps and sprints be subtracted from the plyo/sprint budget?
10. Should athletic sets (plyos, throws, cuts, cleans) count toward the 15-20 sets per muscle per week, partly (e.g. quads/calves), or not at all?
11. Confirm the level rule: athletes get LESS volume and more intensity/specificity as they advance (MM athletic ladder), while physique clients get MORE sets (UPPER/LOWER, PPL ladders)?
12. Core: should every athlete profile rotate planes by day like BASEBALL ('LATERAL CORE' / 'Transverse core' / 'Sagital core'), with more transverse for rotational sports (golf, tennis, baseball) and more frontal for skating/cutting sports?
13. Conditioning: the athletic template has 2 'Aerobic Capacity' slots, the cheat sheet says 3 (one per colour). Which sports should use lactate clearance (MMA, hockey, 400 m?), and is colour A (short/high) the only conditioning for baseball/football?
14. Female athletes in landing/cutting sports: should the generator automatically lengthen the 'TAKING IN FORCES' landing block (ACL risk), and limit 'HARD TURN' COD until landing competency is shown?
15. Youth: do you want maturation stage (pre / circa / post growth spurt) as a UI input, with reduced depth jumps and FOUNDATIONAL-only library levels during the growth spurt?
16. Neck, grip, carries and drags: should the library get a NECK column and filled CARRY/DRAGS columns for wrestling, BJJ, MMA, football and hockey?
17. Golf, tennis and hockey: build them on the BASEBALL Part-A/B/C/D/E template (upper and lower ballistics on alternate days, core by plane) or on the BYOP ATHLETIC 4-day template?
18. Distance runners: keep the Chris Hinshaw half-marathon plan as the running backbone (it is a borrowed model), or build your own run progression with the aerobic colour system?
19. Position variants in the UI: basketball guard/big, volleyball hitter/setter/libero, football skill/big-skill/line/QB/specialist, soccer outfield/GK, hockey skater/goalie, baseball position/pitcher/catcher, softball pitcher - are these the right splits?
20. Season input: which of your baseball calendars (high school, fall ball, pro, pro weekly with 'PEAK'/'DELOAD') should the generator use as the default season model for other sports?

## 12. Sources (SCIENCE)

* [S1] Basketball time-motion (jumps per game by position; ~1,050 activities, 5.3% of live time sprinting): Ben Abdelkrim et al. 2007 BJSM and related: [https://bjsm.bmj.com/content/41/2/69](https://bjsm.bmj.com/content/41/2/69)
* [S2] Basketball jumps backcourt 41 +/- 6 vs frontcourt 79 +/- 5 per game (search result, video time-motion): [https://ojs.ub.uni-konstanz.de/cpa/article/view/6622/5981](https://ojs.ub.uni-konstanz.de/cpa/article/view/6622/5981)
* [S3] Volleyball jump counts per match by position (hitters 19.7-80, middles 52.5-77.2, setter ~104.5): [https://reference-global.com/article/10.1515/tperj-2017-0032](https://reference-global.com/article/10.1515/tperj-2017-0032)
* [S4] NSCA plyometric volume guide 80-100 / 100-120 / 120-140 contacts per session (Potach & Chu 2008), up to ~200 for trained adults (Chu & Myer 2013): [https://ojs.ub.uni-konstanz.de/cpa/article/view/6015/5496](https://ojs.ub.uni-konstanz.de/cpa/article/view/6015/5496)
* [S5] Soccer: 726 +/- 203 turns per EPL match, 609 of 0-90 degrees (Bloomfield et al. 2007): [https://jssm.org/06-1-63.p_d_f](https://jssm.org/06-1-63.p_d_f)
* [S6] Tennis: ~1.6 changes of direction per point, every ~2.7-3.1 s: [https://jssm.org/tablejssm-16-489.xml/table004.xml](https://jssm.org/tablejssm-16-489.xml/table004.xml)
* [S7] MMA: high:low intensity 1:2-1:4; grappling ~1:1, striking up to 1:7: [https://pmc.ncbi.nlm.nih.gov/articles/PMC8439691](https://pmc.ncbi.nlm.nih.gov/articles/PMC8439691)
* [S8] Amateur boxing: predominantly aerobic; activity:rest elite 18:1; post-bout lactate ~11.8 mmol/L: [https://lida.sport-iat.de/ta/Record/4042892?lng=en](https://lida.sport-iat.de/ta/Record/4042892?lng=en)
* [S9] Karate kumite / taekwondo effort-pause (karate HIA 1.5 s, 10 s effort : 16 s rest; TKD 8 s : 8 s): [https://pmc.ncbi.nlm.nih.gov/articles/PMC4009084](https://pmc.ncbi.nlm.nih.gov/articles/PMC4009084)
* [S10] Elite kickboxing time-motion: HIA 2.2 s, LIA 2.3 s, pauses 5.4 s; fighting:non-fighting 1:1 (Ouergui): [https://paulogentil.com/pdf/Time-Motion%20Analysis%20of%20Elite%20Male%20Kickboxing%20Competition.pdf](https://paulogentil.com/pdf/Time-Motion%20Analysis%20of%20Elite%20Male%20Kickboxing%20Competition.pdf)
* [S11] Ice hockey shifts 30-80 s with 4-5 min recovery; skating = hip extension, abduction, external rotation: [https://pmc.ncbi.nlm.nih.gov/articles/PMC6224850](https://pmc.ncbi.nlm.nih.gov/articles/PMC6224850)
* [S12] Hockey groin: pre-season adduction strength 18% lower in later-injured players: [https://mikereinold.com/groin-injuries-in-hockey-players/](https://mikereinold.com/groin-injuries-in-hockey-players/)
* [S13] American football: plays ~5.3-5.7 s, ~33 s between plays, exercise:rest ~1:5.9: [https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11701232/](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11701232/)
* [S14] Nordic hamstring exercise programmes reduce hamstring injuries by up to 51% (van Dyk et al. 2019): [https://bjsm.bmj.com/content/53/21/1362](https://bjsm.bmj.com/content/53/21/1362)
* [S15] Copenhagen adduction programme: 41% fewer groin problems (Harøy et al. 2019): [https://bjsm.bmj.com/content/53/3/150.abstract](https://bjsm.bmj.com/content/53/3/150.abstract)
* [S16] Strength + plyometric training 2-3x/week for 8-12 weeks improves running economy (meta-analysis): [https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11052887/](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11052887/)
* [S17] Youth plyometrics: 2 sessions/week for low training age, 3-4 when competent (Lloyd & Oliver): [https://pure.cardiffmet.ac.uk/en/publications/plyometric-training-for-young-athletes/](https://pure.cardiffmet.ac.uk/en/publications/plyometric-training-for-young-athletes/)
* [S18] Wrestling neck injury and cervical strength: [https://scholars.georgiasouthern.edu/en/publications/the-effectiveness-of-cervical-strengthening-in-decreasing-neck-in/](https://scholars.georgiasouthern.edu/en/publications/the-effectiveness-of-cervical-strengthening-in-decreasing-neck-in/)
* [S19] BJJ physical demands (grip, isometric back strength) - NSCA Coach: [https://www.nsca.com/contentassets/246f9b22016841e68ad57b43efe15f32/coach-10.2.6-developing-strength-power-and-endurance-in-the-brazilian-jiu-jitsu-athlete.pdf](https://www.nsca.com/contentassets/246f9b22016841e68ad57b43efe15f32/coach-10.2.6-developing-strength-power-and-endurance-in-the-brazilian-jiu-jitsu-athlete.pdf)
* [S20] Neuromuscular training cuts ACL injury risk ~50% in female athletes: [https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf](https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf)
* [S21] Jumper's knee prevalence: volleyball 44.6%, basketball 31.9% (Lian et al. 2005): [https://pubmed.ncbi.nlm.nih.gov/15722279/](https://pubmed.ncbi.nlm.nih.gov/15722279/)
* [S22] NSCA older adults: 2-3 days/week, 2-3 sets per major muscle group, power at 40-60% 1RM (Fragala et al. 2019): [https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html](https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html)
* [S23] Golf: rotational power and lower-body RFD vs clubhead speed: [https://bmcsportsscimedrehabil.biomedcentral.com/track/pdf/10.1186/s13102-017-0086-9](https://bmcsportsscimedrehabil.biomedcentral.com/track/pdf/10.1186/s13102-017-0086-9)
* [S24] Golf low back injury and lead-hip load: [https://pmc.ncbi.nlm.nih.gov/articles/PMC12358233](https://pmc.ncbi.nlm.nih.gov/articles/PMC12358233)
* [S25] Baseball pitchers: up to 60% of shoulder and 40% of elbow injuries (college/pro); posterior cuff weakness and ROM deficits: [https://pmc.ncbi.nlm.nih.gov/articles/PMC11545345](https://pmc.ncbi.nlm.nih.gov/articles/PMC11545345)
* [S26] CrossFit injury locations: shoulder 6.7-40.6%, low back 12.9-36%: [https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-7/musculoskeletal-injuries-in-crossfitr-a-systematic-review-and-meta-analysis-of-injury-rates-and-locations/](https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-7/musculoskeletal-injuries-in-crossfitr-a-systematic-review-and-meta-analysis-of-injury-rates-and-locations/)
* [S27] Tennis injuries: elbow 21.4%, shoulder 19.4%, lumbar 17.3%: [https://pmc.ncbi.nlm.nih.gov/articles/PMC10594564/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10594564/)
* [S28] Volleyball shoulder injuries mostly overuse from spiking: [https://lida.sport-iat.de/ta/Record/4005400](https://lida.sport-iat.de/ta/Record/4005400)
* [S29] Softball windmill pitching shoulder/elbow loads comparable to baseball; biceps eccentric load: [https://pmc.ncbi.nlm.nih.gov/articles/PMC6704423](https://pmc.ncbi.nlm.nih.gov/articles/PMC6704423)
* [S30] Hamstring injury mechanism in sprinting (late swing / early stance): [https://bmcmusculoskeletdisord.biomedcentral.com/track/pdf/10.1186/s12891-017-1716-9](https://bmcmusculoskeletdisord.biomedcentral.com/track/pdf/10.1186/s12891-017-1716-9)
* [S31] Schoenfeld et al. 2017 dose-response: 10+ weekly sets per muscle > 5-9 > <5: [https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf](https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf)

Coach sources (OBSERVED) are the decoded tabs named in each row; the program decode files are `analysis/programs/prog_*.md` and `prog_*.volume.json`, the library decodes `analysis/library/L1-L4_*`, and the reference decodes `analysis/reference/*`.

## Verification log

Adversarial fact-check, 2026-10-08, against `dumps/BYOP`, `dumps/MASTER_MODEL` and `analysis/` (read-only; no Google Sheet touched). The 04 md/json published at 2026-10-07 22:12 were STALE: `profiles_data.py`, `build_profiles.py` and `render.py` had already been partly corrected (22:21-22:23) but never re-rendered. Every one of those pending script corrections was re-checked against the dumps (one was itself wrong and was fixed, see C-28), further errors were fixed in the same scripts, and both files were regenerated with `python3 render.py`. Items marked [pending] were in the scripts but not in the published files; [new] are this pass.

**Independent recomputations (python on the dumps / decode entries):**

* R-1 BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (C/D columns): Mon/Thu 10 slots (Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions), Tue/Fri 10 slots (PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution), Wed/Sat 5 (Calves, Aerobic Capacity, Core, Focus 1, Focus 2). At 2 sets and excluding 'Aerobic Capacity': 96 sets, athletic 36 = 37.5%, excl. throws 28/88 = 31.8%. CONFIRMED.
* R-2 JUSTICE LEAGUE: only 11 slots carry sets (Mon rows 3-12 + Tue 'SL Depth Drops'), all F = 2.0; Thu row 35 'Low Bar Back Squat' has no sets; 38 of 50 weekly slots are 'CHOOSE 👇'. The doc's 'completed @2' label was WRONG (fixed). 'Medium Depth Drop' = PLYOS FOUNDATIONAL G11, 'Power Clean' = TRIPPLE EXTENSION ADVANCED C92/E10: 'level per slot' CONFIRMED.
* R-3 'EXAMPLE BOXING 8 WEEK BUILD UP' cell by cell: wk1-2 = 99 component sets (RP 48, ISO 18, core 14, 19 throw lines); wk3-8 high-amplitude contacts 113/113/129/129/116/116 (depth drops 3x8, SL march 3x6/6, complex tuck + DB squat jumps 3x10, drop-into-box 1-3x8, broad jumps 3-6x5), low 177/177/177/177/142/167; weekly sets 151/151/155/155/142/174. CONFIRMED; squirrel-jump reclassification gives 248-264 high (new caveat).
* R-4 MM 'EXAMPLE UPPERLOWER SPLIT' / 'EXAMPLE PUSHPULLLEGS SPLIT': weekly resistance sets 76 -> 90 -> 102 and 47 -> 58 -> 66 per rotation CONFIRMED; rep directions NOT uniform (UL upper compounds 3x8 -> 3x10 -> 4x12; PPL legs 2x8 -> 3x10 -> 4x8; PPL delt isolation 15 -> 8) - original 'compound reps 12-15 -> 10 -> 8, isolation fixed' was WRONG.
* R-5 'EXAMPLE FAT BURNBODY TONING PRO': lifting sets 60/60/64/70 CONFIRMED; circuits 3x4x30 s x2 = 12 min -> 5x4x50 s x2 = 33 min CONFIRMED; circuits sit on Mon/Fri (wk1, wk3) and Tue/Thu (wk2, wk4).
* R-6 BASEBALL (decode entries re-aggregated): weekly sets block means 107.3 / 130.1 / 121.2, deload 151 -> 82 (-46%), resistance 84 -> 58 (-31%), high-amplitude block means 102.6 / 151.4 / 135.1, 4,690 contacts, 57% transverse throws, buy-outs 3.3 / 3.3 / 3.75 per week, ankle hops 20 of 46 labelled 'calfs' slots (43%), MAX on 35% of arm/delt isolation sets - CONFIRMED; but single weeks reach 174-201 high-amplitude contacts (8 of 22 training weeks) - the 'never exceed ~151/week' claim was WRONG.
* R-7 4 TRACKS: STRENGTH-8 = 56 sets/week; STRENGTH-12 % 80,80,85,85,90,90,'MID DELOAD', RPE / SETS / REPS rows, AESTHETICS-8 SETS 2,3,3,3,4,4,5, AESTHETICS-12 SETS 3,3,3,4,4,4,3,4,4,4,4,5, HYBRID AMRAP 12..20 / SETS 2..4 / REPS 6,8,10 - CONFIRMED; WK6 column FFF2CC CONFIRMED.
* R-8 Sheet24: 21 weeks x 2 runs, cut-back weeks 3/6/8/12/18, '1-mile at max effort' wk 10/14, longest run 3 -> 12 mi CONFIRMED; hill sprints are 6-10 reps x 8-20 s (not '8-10 x 8-10 s').
* R-9 Library cell references re-read: AA91/AA93, AD126-AD130, AH10/AH15, AK18, AL12/AL19/AL21, AN18/AN19/AN91, AU9, BC9/BC13/BC17, BC46-BC49, R47/O165, G93/G94, G50-G52, C124-C136, AW8:AW14, AY8:AY11 - all CONFIRMED (AD130 is 'Push ups (1 hand Higher)', not an alternating press).

**Corrections:**

* C-1 [pending] Headline 4 + section 4 note + tier anchors: 'high-amplitude contacts never exceed ~151/week' -> block means max 151, but 8 single BASEBALL weeks reach 174-201 (B3 'WEEK 7' 201), so T4 is observed at week level; only T5 is extrapolated.
* C-2 [pending] COD library is not 'literally the receiver route tree': it also holds 'Shuffles' (L13, EASY TURN), 'LEFT TEST' (L47, MOD. TURN) and a date-coerced 5-10-5 cell (L92 / N10, HARD TURN). Headline 7, football card, basketball COD notes, gap table fixed.
* C-3 [pending] JUSTICE LEAGUE relabelled from 'completed @2' to 'partial fill: Mon + 1 Tue slot; 2 sets extrapolated'; contacts re-estimated ~60-80 high + ~12-16 low; generic athlete evidence downgraded to OBSERVED slots + ASSUMED sets; plyo mix limited to the 3 observed picks (100% vertical, 33% unilateral, 67% landings).
* C-4 [pending] Gym ladder: compound reps do NOT all fall with level (UL upper 3x8 -> 3x10 -> 4x12; PPL pull-ups 3x15 -> 4x10 -> 5x12, dips 3x8 -> 3x10 -> 4x'MAX'; PPL legs 2x8 -> 3x10 -> 4x8) and PPL delt isolation is not fixed (side raises 3x15 -> 4x8 -> 4x8). Headline 12, section 2.4, level-modifier table fixed.
* C-5 [pending] UL A-drill contacts were per lower DAY, not per week: 72 / 90 / 64 per leg per day = 144 / 180 / 128 per week.
* C-6 [pending] BASEBALL blocks carry no season label (A24 'BLOCK 1', A41 'BLOCK 2', A59 'BLOCK 3'); off / pre / in-season is INFERRED from the cell dates vs the calendars. Headline 13, section 2.4, season-family evidence fixed; pre-season resistance described as flat 74-76 for four weeks before the +2.6/+3.8/+3.7% climb.
* C-7 [pending] Core order: BYOP puts core on the optional days; BASEBALL puts core SECOND (Part B); MM STARTING puts it first/second/last. The 'isolation -> core' order was not observed (rule 3, assembly step 4).
* C-8 [pending] Rule 8: fat loss is not 'no jumping' - circuits contain 'Jumping Jacks' and 'Burpees'.
* C-9 [pending] Barbell overhead pressing IS written for the baseball player 3 times ('barbell press' AE34, AW34; 'barbell overhead strict press' Q52) plus 'arnold presses' AS70; 'DB-only pressing' and the throwing-shoulder rule were corrected; the one non-DB bench is 'fast banded assisted bench press' (implement unnamed).
* C-10 [pending] PAIN_GENERAL: only the athletic tab (A6) says 'going unilateral'; UL/PPL A7 give the grip rule only. FEELING list quoted from AY8:AY11.
* C-11 [pending] Copenhagen cell refs: MM athletic is F66 / J24 (not D66 / H24, which are SETS cells); BASEBALL cells listed.
* C-12 [pending] Unilateral share does not rise monotonically with level (MM MID 75% -> ADVANCED 50%); BYOP 3 DAY BUILDER 43%, NO ACCESS 33%.
* C-13 [pending] Boxer conversion: the levers are the hinge complex (L46), clean & press (L35) and the DB-row superset (L20) 3 -> 4 -> 6 sets; the squat complex (L22) goes 3 -> 2 -> 3, so 'complexes 3 -> 4 -> 6' was wrong for one of the two complexes; the eleven wk-7 rows that drop 3 -> 2 are listed.
* C-14 [pending] Boxer mix recomputed (85/15/0 vertical/horizontal/lateral, 62% unilateral, 8% landings); max jumps outside the complexes listed. [new] Noted that this counts 'Single Leg to high march jump' as vertical while the BASEBALL rule counts 'march jump' horizontal (73/27 under that rule).
* C-15 [pending] MYO is not machine-only: 'ALL ABOUT SQUATS' B27 '**MYO SET - ADVANCED' sits in the free-weight squat menu (explained A30), plus leg-press MYO (AESTHETICS-12) and leg-extension 'MYO SET' (JUSTICE LEAGUE G12). STRENGTH zone cited to D15:E26; CrossFit strength levels (3x7 -> 6x4) noted as higher-rep.
* C-16 [pending] Sheet24 quotes made verbatim ('Program we use for all Blaze Camp Athletes who are looking to run a half marathon.', 'Tapering: 6 miles, comfortable pace'); the strength/plyo rules in the endurance family are INFERRED (Sheet24 has no lifting).
* C-17 [pending] CARRY / DRAG library columns hold sub-headings ('PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; 'SAGITAL', 'FRONTAL'), not nothing; carries ARE programmed in BASEBALL (E47, W49, S65) and CONTROL PATTERNS (B10); drags appear nowhere. Sprint gap updated with the cheat-sheet 'RUNNING WARMUP' ('Falling start accelerations') and Sheet23 B48/B49.
* C-18 [pending] 'JUMPING ANKLE' block is C124-C136 under the TRIPPLE EXTENSION column (same list as Sheet23 E2:E12); BOOTCAMP 1 is titled 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'; AESTHETICS optional days are 'Optional' (no weekday); 4 TRACKS A1 says '8 WEEKS OF 3 TRACKS ...' and writes no 6-week product; HYBRID 'heavy' is absent in wk1; HYBRID 'AMRAP' row 70 is not tied to Saturday; CrossFit power months have 2-4 WOD days.
* C-19 [new] Headline 1 overstated ('the coach does not write a different program per sport', labelled OBSERVED): BASEBALL (Parts A-E) and BOXING (3x10 upper/lower base -> complexes) are structurally different programs; the 'dials on one skeleton' view is now labelled an INFERRED modelling choice.
* C-20 [new] Squirrel jumps: the doc counted them as low-amplitude without saying the coach files ' Squirrel jumps' / 'Single leg squirrel jumps' under PLYOS 'ADVANCED' / 'FULL JUMPING' (G126-G127, J9-J10; Sheet23 I2-I3). Caveat added to headline 5, section 2.2 rules, section 2.5 reading and the JLK category definition; counted the coach's way the boxer has 248-264 high-amplitude contacts/week in wk3-6 (wk7 206, wk8 211).
* C-21 [new] 'JUMPING LIMITED KNEE' is only a MASTER_MODEL Sheet23 heading (E1/G1); the BYOP library heading is 'JUMPING ANKLE' (F5) - JLK definition corrected.
* C-22 [new] MM athletic throws 210 (STARTING) and 420 (ADVANCED) are ASSUMED expansions of the cell 'ALL LIST' (19-throw ballistics 'MEDBALL CHEAT SHEET', 17x10 + 2x20); flagged in headline 3, section 2.2, 2.4, the throws tier anchors, the athlete ladder and the generic-athlete variants. MID's 400 is fully written.
* C-23 [new] 'French contrast' is the analyst's label for the boxer complexes - the boxing tab never uses the term; the pattern matches 'ALL ABOUT SQUATS' G16 'FRENCH CONTRAST'. Headline 14 and the boxing pairing now say so.
* C-24 [new] STRENGTH-8 rows E4:L6 are three UNLABELLED coloured number rows; reading them as M.E. reps / D.E. reps / sets ladder is INFERRED (was stated as OBSERVED).
* C-25 [new] The post-season recovery phase was evidenced by BASEBALL Block 1 'wk 8', which is the recovery week between Block 1 and Block 2, not a post-season week (it also keeps an empty 'OPTIONAL PIECE' 'OLY' 4 x 6 label); evidence relabelled.
* C-26 [new] Ballistics tab: within-column order (bilateral -> unilateral, unweighted -> weighted, hop -> jump) is OBSERVED; reading the four columns 'TAKING IN FORCES' -> 'REBOUNDING ' as a time sequence is INFERRED (tab is 'UNDER CONSTRUCTION').
* C-27 [new] MM STARTING core position: first in S3 ('Med ball rolls'), second in S2, last in S1 (was 'second and last').
* C-28 [new, corrects a pending edit] CrossFit Saturday: the pending text said 'no WOD or lifting on SAT in any month grid' - MAY has a SAT WOD (G144 'YES'); SAT aerobic sessions occur in AUG/SEPT/NOV/DEC/MAY. Skill days 'T2B/ DUBS' / 'H.S./ DUBS' also occur in MAR and APR, not only JUN/JUL/NOV.
* C-29 [new] Cossack: 'Cosak lateral lunges' exists in '(NOT DONE) RESISTANCE PATTERNS ' C47 (the pending text said it appeared only as a ballistics warm-up lunge).
* C-30 [new] Sheet24 hill sprints corrected to 6-10 reps x 8-20 s (wk12 '6x10sec plus 2x20sec'); distance-runner conditioning: Sheet24 is 2 runs/week, the A/B/C split of 3 sessions is INFERRED.
* C-31 [new] Hybrid 'JUMPS' 3x6 is an assumption (no sets/reps on the row); the tab's global SETS/REPS rows 71-72 would give 24-60 contacts/week (mean ~41).
* C-32 [new] Per-muscle sets (5.6, headline 8) use an analyst credit map; the decodes disagree with each other (front-delt credit for horizontal push 1.0 vs 0.5). Note added; code comment claiming 'the one used by every program decode' corrected.
* C-33 [new] Baseball row count: 865 prescription rows (911 decode entries incl. 46 label-only rows). Baseball in-season override now says OBSERVED in Block 3, season reading INFERRED.
* C-34 [new] Verbatim fixes: 'Focus 1' / 'Focus 2' (not 'Focus 1/2'); 'Shuffles' (not 'Lateral Shuffles'); the medball 2x2 matrix quoted as 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP', 'OUT OF THE LEFT LEG/HIP', 'INTO THE RIGHT LEG/HIP' (ballistics D65-D68); AGILITYCOD formation headings ('KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'HOPS IN PLACE', 'RUNNING ROUTES', 'ROUTE TREE') added to the reactive-agility gap.
* C-35 [new] SCIENCE check: S4 (NSCA 80-100 / 100-120 / 120-140 contacts per session), S14 (Nordics up to -51%), S15 (Copenhagen -41%), S20 (~-50% ACL), S21 (44.6% / 31.9% jumper's knee), S22 (40-60% 1RM power), S31 (Schoenfeld dose-response), golf ~8x body-weight lumbar load and hockey -18% adduction strength match the published values; sources were not re-fetched. The youth circa-PHV caps (-30-50% plyos, ~30 cm depth jumps) were presented as SCIENCE but are analyst heuristics - relabelled INFERRED.
* C-36 [new] Headline 8 relabelled (set counts OBSERVED, muscle credit INFERRED); headline 17 now states that the boxer-as-T3 anchor depends on the squirrel-jump classification (T5 if counted the coach's way).
* C-37 [new] Section 5.1 evidence column: profiles whose set budget contains assumed or illustrative cells (CrossFit JULY 'ILLUSTRATIVE 3-exercise' resistance sessions, HYBRID blank-set assumptions) now show 'OBSERVED + INFERRED/ASSUMED parts' instead of plain OBSERVED.
* C-38 [new] BYOP AESTHETICS (bodybuilding profile, 102 sets/week) is also a PARTIAL coach fill (Day 1 complete, 4 of 7 Day-2 slots, rest 'CHOOSE 👇'); the weekly set note now says the counts are an ASSUMED extrapolation.
* Not changed (verified correct): AEROBIC CAPACITY CHEAT SHEET colours / A5 rule / D21:D24 level unlock; BASEBALL VOL legend rows 20-22, core-by-day labels, 'PITCHERS/CATCHERS' E16 vs 'POSITIONS' F16; ALL ABOUT SQUATS machine opinions; CrossFit macro A10:M17 and FULL/HALF TIME tables; NO ACCESS UHD -> LEG CURLS miswire (E19/E46 -> AR); neck exercises absent everywhere.