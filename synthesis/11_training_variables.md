# 11 · Training variables model (Blaze Camp) - v1

**What this is.** The model of the *training variables* the coach manipulates, with a generator rule for each one. It covers:

* load, speed/intent, tempo and range of motion;
* volume (sets x reps, volume load), density/rest/pairing, effort and frequency;
* exercise selection, variation and order;
* load position and position zone (rotation bias), load laterality (contralateral / ipsilateral), stance, grip and feet;
* the athletic-only variables (plyo force phase and method stage, plyo vs ballistic share, medicine-ball mass) and conditioning;
* four relationships: the bilateral : unilateral share, same / cross-pattern pairing, the weekly axial-loading budget and the derived exercise level.

Beyond the definitions it gives the load-velocity rules, the week-to-week volume progression (restated from the authoritative engine in `12_volume_algorithm_v1`) with two re-computed worked examples, the variation policy ("don't confuse the muscle"), the ordering rules with compliance statistics, and the quality-of-movement rules. The machine-readable twin is `11_training_variables.json` in the same folder. It holds the required keys `variables`, `load_velocity_rules`, `progression_engine`, `variation_policy` and `ordering_rules`, plus the supporting tables and `v1_coach_answers_applied`.

**Who it is for.** The coach, to confirm that this is how he thinks: every claim is tagged and cited. The engineer, to encode it: every rule has an ID and a default.

**Version.** v1, 2026-10-08. The coach answered 138 of 140 questions (`coach_answers_full.md`). **His answers override every inference from the sheets and every earlier team decision.** Where he was unsure or asked the team to propose, the rule is marked **PROPOSED - PENDING COACH APPROVAL** (short form: PROPOSED). The volume engine is defined in `12_volume_algorithm_v1.md`/`.json`; this file restates it for the variables model and is kept consistent with it (differences found are listed in 7.2).

---

## v1 - coach answers applied

Every change below cites the question IDs that caused it. Sections, tables, examples and JSON fields were rewritten in place; nothing below is a patch on top of old rules.

1. **Weekly rate is chosen by the person, not by muscle size.** 3 / 5 / 7 % of that muscle's weekly sets, picked each week from the person's state (effort trend, completion, performance, sleep/stress); the coach can override. Every big = 3 % / small = 7 % mapping and the 'focus = one class up' rule are retired. *(VOL-04, VOL-05, UNI-05; see 3.3, V06, JSON `progression_engine.rates`)*
2. **10 % per week is a ceiling, not a step.** The person's total weekly resistance sets never rise more than 10 % week over week. *(UNI-05; see 3.3, 3.8)*
3. **Release = one whole set per bank unit.** Bank the fraction every week; add a set when the bank reaches 1. The v0 'chunk = round(10 % x current), 1-2 sets' is retired; the chat's 20 → 22 now takes two weeks at 5 % (+1, +1). *(VOL-06, UNI-05, VOL-04; see 3.4)*
4. **Where a new set goes: the coach's order.** 3-4 exercises per muscle on its day; add to the first exercise in session order, then the next (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); days rotate; small muscles that sit at the end of a session get a bonus exercise; a full big muscle gets a Focus slot. Retires v0's round robin and '<= 2 exercises per muscle per session'. *(VOL-07, ORD-10, ORD-11; see 3.6, VP-8, caps)*
5. **Helper credit 0.25** (was 0.5). Dips 0.5 triceps / 0.5 chest; thruster 1.0 quads / 0.5 shoulders; leg curl and leg extension count fully. A 10/10 unilateral set = 1 set, mostly for quads. Athletic patterns (plyos, ballistics, throws, Olympic lifts, sprints, COD) never count toward muscles. *(VOL-09, LIB-16, LIB-14, UNI-01, UNI-07, VOL-10; see 3.2, V06)*
6. **Volume landmarks from the coach.** Start: beginner 10-12, intermediate 15-20, advanced 20+; 15-20 = maintenance to some growth, 20-25 = growth; priority +4-6 (cap about 25-30, 1-2 muscles); pain -30-50 %, machines, or drop the exercise. Research charts are in 12 §2; the tool learns later from users' data. *(VOL-01, VOL-02, VOL-03, UNI-01; see 3.8)*
7. **Readiness gates follow GEN-05.** EFFORT 9-10 → hold or cut; EFFORT <= 6 → add; 'Felt a PAIN' → swap in category / constrain / drop; v0's per-muscle RED/AMBER/GREEN/EASY gate is replaced by the person-level readiness score of 12 (PROPOSED weights). *(GEN-05, VOL-03, UNI-08; see 3.5)*
8. **Bilateral : unilateral on a 90/10 ↔ 10/90 scale** by athlete, goal, phase and pain: bodybuilders/powerlifters about 50/50 for the first 2-4 weeks, then 80/20-90/10; field/COD athletes 80-90 % unilateral; in-season minimal bilateral; pain shifts it. Unilateral = health and rotational foundation; bilateral = the driving force. Upper body follows the same logic. Replaces v0's 35-70 % bilateral targets. *(UNI-02, UNI-03, UNI-10, CAT-13; see 3.7, V22)*
9. **Contralateral / ipsilateral loading is a variable with use cases.** Contralateral pulls you INTO the hip (COD athletes: football, soccer, basketball, tennis; also to build missing range); ipsilateral helps you OUT of the hip (sprint acceleration: ipsilateral step-ups); for bodybuilders/powerlifters both are health accessories, mostly in weeks 1-4. *(CAT-13, UNI-12; see V14, 3.7)*
10. **Pairing is a variable (new V24).** Same pattern (squat + lunge) drives one muscle harder (high-level, aesthetics); cross pattern (squat + single-leg hinge) keeps bootcamp and general clients fresh. Hip dominant pairs with push, knee dominant with pull, in full body and bootcamps (anterior/posterior split to avoid bleed-over). *(UNI-06, UNI-11, ORD-06; see V24, 5)*
11. **Axial loading once a week (new V25).** One axial squat a week (the other squat exposure = leg press or belt squat); deadlifts also load the spine, so one axial hinge a week. The 'Athletic Performance - Non-Competitive' tab's (BYOP 'JUSTICE LEAGUE', cited JL) Monday front squat + Thursday low-bar back squat is no longer reproduced. *(PER-04, EQ-11; see V25, VP-6, LV-9)*
12. **Variation policy confirmed.** Exercises fixed for a 4-6-week block; between blocks change one or two small variables (grip, stance, implement, ROM, rep range), never all at once; the second weekly exposure of a slot is a different exercise of the same category; A/B lead-lift weeks are optional for clients who want variety, in any program. *(PER-02, PER-03, PER-04; see 4)*
13. **No bands and no variable resistance anywhere.** Bands, reverse bands, chains and weight releasers are out of the generator; banded substitutes removed from every swap ladder (band row, band-assisted pull-up, band chops, banded leg extension, mini bands). The sheet cells stay as OBSERVED record only. V17 is retired; LV-5 is retired. *(EQ-01, EQ-02, EQ-07, EQ-08, EQ-12; see V17, V18, LV-5, 4.4)*
14. **Ordering confirmed, BYOP is the reference.** Row before pulldown always; 'the work' first even when vertical; power before strength; isolation first only for a priority muscle; core FIRST by default (movable by the user). *(ORD-01, ORD-02, ORD-03, ORD-04, ATH-11; see 5, V12)*
15. **Supersets are a fatigue/density tool**: short time, advanced clients who need more stimulus, off-season VO2/mitochondrial work, beginners who do not fatigue. *(ORD-05; see V07, N14)*
16. **Session limits.** Resistance-only 5-7 exercises; field athletes off-season up to 10-12 (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); about 1.5 h (max 2 h) for athletes, bodybuilders, powerlifters, 45-60 min for general/weight loss; unilateral work costs more time. Calves 3 sets every leg day; rear delts their own sets; about 2 core exercises. *(VOL-08, VOL-16, VOL-17, UNI-09; see 3.8)*
17. **Plan shapes and deloads.** 4-6 weeks = maintenance/transition at about 50-70 % volume; 8 weeks = start hard, 4 adapting + 4 driving; 12 weeks (preferred) = 2-4 acclimation, 4-6 driving, last weeks hardest; repeated cycles start one level higher; week-by-week and yearly modes; deload = about half the sets, lighter; tests by checkbox or none. *(PER-01, PER-05, PER-07; see 3.10)*
18. **Position zones are rotation biases (Davidson).** Vertical positions (arms down/standing, arms overhead, deep squat) = external-rotation bias; horizontal (hands in front, knee at hip height) = zone 2 = internal-rotation bias, compressive. Level: front-loaded/low = foundational, on the body/horizontal = intermediate, behind/overhead = advanced; machines/cables easier. Zones do NOT apply to plyos. Levels stay theoretical. *(CAT-04, CAT-05, CAT-10; see 1.2, V13, V23)*
19. **Plyo 'zones' are method stages, not zones**: receive & pause → receive then create → repeated receive/create (name pending; PROPOSED 'Receive-Create stages' RC1-RC3). Unilateral plyos are harder. Plyo vs ballistic is set by the sport's ground-contact time; programs start ballistic and become plyometric. *(CAT-10, CAT-11, ATH-01, ATH-02; see V19, LV-14, QM-7)*
20. **Medball weights confirmed**: slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, passes/rotations light (8-10 lb), lighter for youth/older, never over 20 lb; no medball for aesthetics/bodybuilders except warm-up. Throws have no levels. *(EQ-06, ATH-05, LIB-06; see V20, LV-3)*
21. **Olympic lifts for everyone in athletic training** (beginners: DB/KB snatches, hex-bar jumps, hang pulls/cleans; intermediate+ full lifts; youth may lift from the floor); the % ramp 75 → 90 with 4 x 8 → 4 x 4 is the strength-plan default. Full lifts are named 'Squat Snatch' / 'Squat Clean' / 'Squat Clean & Jerk'. *(ATH-10, ATH-09, PER-09, LIB-07; see LV-4, LV-12, QM-8)*
22. **Contrast confirmed**: intermediate+ athletes, off-season, heavy member about 78-85 %, no rest inside the complex. *(ATH-12; see LV-6)*
23. **Effort and rest confirmed**: 1-3 RIR always; MAX = technical failure only on small-muscle or bodyweight work; MYO only on the last machine/isolation exercise; rest 1-2 min hypertrophy (up to 3), 3-6 min strength; 40-rep sets only as a CrossFit/AMRAP option. *(VOL-13, VOL-15, VOL-14, VOL-11; see V07, V08, QM-1, QM-2)*
24. **Equipment answers**: constraint scale 1-5 approved; machines are not ranked (brands differ; hack squat and leg press more constrained than Smith; belt squat avoids axial loading; GHD/reverse hyper if available and felt in the right muscles); older/injured/high-volume clients → constrained machines and never overhead squat, snatch, low-bar squat or depth jumps; client preference may choose between alternatives. *(EQ-13, EQ-11, EQ-03, EQ-04, EQ-10; see V10, CA-2, CA-12)*
25. **Library answers used here**: push press is easier, push jerk intermediate/advanced; 'Pull under' = lat pull-over; 'Camporini Deadlift' and 'strap rotating in/out' removed; 'Single Leg Get Ups' = box pistol; 'Low DB squats' = DBs hanging at the sides (zone 1); 'Alternating DB/Barbell Deadlifts' = alternating staggered-stance single-leg deadlifts; '12/10/8 -20' = pyramid then a light 20; '10/10' = per side. *(LIB-13, LIB-09, PRG-07; see CA-1, V13, V15, 3.9)*
26. **Levels**: L1 (novice = newby), L2, L3; client level and exercise level stay separate; level up at the end of a block when logs read '8 - That was perfect' or easier with no pain; one algorithm for every model and level. *(PRG-05, CAT-06, PER-06, PRG-06; see VP-12, 3.8)*
27. **Generic names**: 'JUSTICE LEAGUE' was only a marketing name for a weekend-warrior program (non-competitive athletic adults and youth). The program is named 'Athletic Performance - Non-Competitive' (the same name as 05 v1); cell citations keep JL = the BYOP tab 'JUSTICE LEAGUE', because that is the tab name in the sheet. *(ATH-13, FIX-03; see abbreviations, prose)*
28. **Worked examples re-run with the v1 engine of 12**: Example A = L2 bodybuilding-style aesthetics client, chest priority, 8 weeks (50/50 with contra/ipsi accessories in weeks 1-4, 80/20 from the week-5 block change); Example B = basketball guard, 12-week off-season (12 exercises a day, 21-25 % bilateral, VOL 1/2/3 rep phases by block). The v0 6-week plans are now maintenance shapes, so both examples changed length. *(all of the above; engine = 12_volume_algorithm_v1; see 3.12, 3.13)*

**Still pending**

* **No answer yet:** LIB-10 ('KB Face Pulls ' under VERTICAL PULL, LIB U20), LIB-12 ('Bench Push ups': hands or feet on the bench). **Skipped:** PRG-01 (what 'NO ACCESS' means), FIX-01 (the NO ACCESS 'Unilateral HD' → LEG CURLS dropdown; CA-4 stays an INFERRED miswire).
* **CAT-12 not understood by the coach** ('I don't really understand the question'): whether the generator may build variants from the exercise grammar or only pick named library exercises. v1 keeps 'named exercises first, grammar only for the one or two small changes between blocks' as PROPOSED and re-asks in plain words (section 8).
* **GEN-03 vs GEN-05**: output format is open and the coach doubts in-tool tracking, but adjusting from logged EFFORT is RIGHT. v1 follows 12's PROPOSED two modes: a static plan from the intake, and an optional adaptive weekly check-in.
* **PROPOSED - PENDING COACH APPROVAL (from 12, used here):** readiness-score weights and bands; the planned rate before any logs; non-priority muscles <= 3 % while a priority runs; 8-week start x1.10; acclimation cap 3 %; per-session ceiling 11 fractional sets (14 priority); per-exercise max 4 (L1) / 5 (L2-L3); small muscles at ~80 % of the big start; profile shares not given by the coach (sprinters, strength-type athletes, baseball, combat, older, the 20-point pain shift); ~70 % contralateral for COD athletes; plyo share by sport; RC1-RC3 week mapping; the time model.
* **INFERRED in this file, to confirm:** the one-axial-hinge reading of 'I'm probably going to load it with the deadlifts as well'; unilateral DB hinges are not counted as axial; the zone reason for horizontal-before-vertical; LV-9 with only one axial exposure; the position-zone and laterality steps as between-block 'small variables'.
* **Still open from v0 and not on the questionnaire:** athletes' weekly drill rotation, 'mid range of motion', tempo, stopping a speed set, 'Elevated' and '*RDL', the seated-press level (open questions 12-17; v0 Q7, Q10, Q11, Q12, Q19, Q21).

**The coach's answers used in this file, and what each one changed:**

| ID | Coach's answer (coach_answers_full.md) | Effect in this model |
|---|---|---|
| CAT-02 | Big = quads, glutes, hamstrings, lats/upper back, chest; small = biceps, triceps, side and rear delts, calves, forearms, abs (RIGHT). | Size class now sets only the default rep range (VOL-11) and the small-muscle start (~80 %, PROPOSED in 12). It no longer sets the weekly rate (VOL-05). |
| CAT-04 / CAT-10 | Level = skill + stability + load position (front-loaded foundational, on the body intermediate, behind/overhead advanced; machines/cables easier). Zones (Davidson) are rotation biases: vertical positions (arms down, overhead, deep squat) = external-rotation bias; horizontal (hands in front, knee at hip height) = zone 2 = internal-rotation bias, compressive. Zones do not apply to plyos. | V13 carries zone + rotation bias + load position; V23 level heuristic kept as INFERRED; plyo 'zones' renamed method stages (V19). |
| CAT-05 / CAT-06 | Levels add options, are theoretical, do not rely on them; client level and exercise level are separate (RIGHT). | Levels never gate; client level sets the dose only. |
| CAT-07 | The BYOP MASTER EXERCISE LIBRARY is the single source of truth (RIGHT). | BYOP order and menus are the reference for ordering (ORD-01) and exercise picks. |
| CAT-08 / CAT-09 | Core: thorax / pelvis / both, any plane. Leg curls, nordics, slider curls = a leg-flexion segment, not hip dominant. | Unchanged from v0: core segment ladder (VP-11); LEG FLEXION segment (KF-1). |
| CAT-11 | Not really plyo zones; 'I don't know what to call it yet'. | V19 `plyo_method_stage` (PROPOSED name RC1-RC3), not a zone. |
| CAT-12 | 'I don't really understand the question.' | Grammar-built variants stay PROPOSED; re-asked (section 8). |
| CAT-13 | Contralateral pulls into the hip (COD athletes: football, soccer, basketball, tennis; builds missing range); ipsilateral helps out of the hip (sprint acceleration, ipsilateral step-ups); bodybuilders/powerlifters use them as health accessories mostly in the first 2-4 weeks, kept later only if something bugs them. | V14 use cases; contra/ipsi split inside the unilateral share (3.7). |
| UNI-01 / UNI-07 | 10/10 = 10 per side = 1 set, counted mostly for quads; alternating = unilateral. 15-20 sets = maintenance to some growth, 20-25 = growth; 40 too much, 5 too little. | Counting (3.2); landmarks (3.8). |
| UNI-02 / UNI-03 / UNI-10 | Bilateral:unilateral 90/10 ↔ 10/90 by athlete; bodybuilders/powerlifters ~50 → 80/20-90/10; field/COD athletes 80-90 % unilateral; in-season minimal bilateral; adjustable; pain adjusts; unilateral = health/rotation, bilateral = force; upper body same. | V22 rewritten; profile table (3.7). |
| UNI-04 | RIGHT, 'yes and no': usually moderate-to-high reps per side; heavy low-rep unilateral optional if athlete or coach wants it. | Unilateral default 8/8-12/12; `heavy_unilateral` toggle (3.9). |
| UNI-05 | Unilateral progresses like bilateral; 3-5 % by the person; 10 %/week is too much. | One progression rule for both; 10 % ceiling. |
| UNI-06 / UNI-11 / ORD-06 | Same vs cross pattern is a rule by goal. Hip dominant + push, knee dominant + pull (posterior lower with anterior upper) to avoid bleed-over; same model for full body and bootcamps; the Bootcamp 1 crossing was a mistake. | New V24 pairing; R9 hard rule; N18 stays OBSERVED only. |
| UNI-08 / UNI-09 | Pain swap to unilateral: keep sets ideally, adjust accordingly (PARTLY). Session about 1.5 h for athletes/bodybuilders/powerlifters (max 2 h), 45-60 min general; unilateral time must be accounted for (PARTLY). | Pain rule (3.5); time model of 12 (unilateral set = 1.5 x). |
| UNI-12 | More frontal/transverse unilateral work for court and combat athletes (RIGHT). | V14/V18 and Example B (lateral lunge, skater hop, lateral bound). |
| VOL-01 / VOL-02 / VOL-03 | Start 10-12 / 15-20 / 20+; priority +4-6, cap about 25-30; pain -30-50 %, machines, maybe drop the exercise. | Starts and caps (3.8); pain protocol (3.5). |
| VOL-04 / VOL-05 / VOL-06 | 3/5/7 % of weekly sets per muscle (RIGHT), load and volume load tracked, not driven by %; 'it doesn't really go by muscle... it's more on what's going on with the person'; bank the fraction (RIGHT); the tool should figure out the percentages. | Person-based rate (3.3); bank and release one set (3.4); VL logged, never steered on. |
| VOL-07 | 3-4 exercises per muscle per day; add to the first exercise, then the next (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); small muscles at the end get a bonus exercise. | Placement (3.6). |
| VOL-08 / VOL-16 / VOL-17 | About 7 exercises (5-7) for resistance sessions; field athletes off-season up to 10-12; default 3 sets compounds, 2 isolation; calves 3 sets each leg day; rear delts own sets; about 2 core exercises. | Session limits (3.8); Examples A and B. |
| VOL-09 / LIB-14 / LIB-16 | Helpers 0.25, not 0.5; thruster 1.0 quads + 0.5 shoulders; dips 0.5 triceps + 0.5 chest. | Credit map (3.2). |
| VOL-10 | Plyos, Olympic lifts, sprints, throws never count toward muscles. | Athletic budget separate (3.2, 3.13). |
| VOL-11 / VOL-12 | Small muscles 12-30 reps, big 5-15 (RIGHT); 40-rep sets only as a CrossFit/AMRAP-style option. Preference moves the rep range on big compound lifts only (RIGHT). | Rep rules (3.9; Z-I/Z-J). |
| VOL-13 / VOL-14 / VOL-15 | 1-3 RIR, MAX = technical failure only on small-muscle or bodyweight work; RIR is his scale (RPE explained alongside). Rest 1-2 min hypertrophy (1-3 ok), 3-6 strength, athletic as prescribed, supersets rest after the pair. MYO only last, machine/isolation. | V07, V08, QM-1, QM-2. |
| VOL-18 | Chest vs side-delt imbalance not intended; balance it, allow a V-taper bias when the athlete wants it. | Balance by targets; bias = a priority muscle. |
| PER-01 / PER-05 / PER-07 | 4-6-week plans = maintenance/transition at about 50-70 %; 8 weeks start hard (4 adapting + 4 driving); 12 weeks preferred (2-4 acclimation, 4-6 driving, last weeks hardest; next cycle one level higher); week-by-week and yearly modes. Deload about half the sets, lighter (RIGHT). Tests by checkbox or none. | Plan shapes and deload (3.10). |
| PER-02 / PER-03 / PER-04 | Block 4-6 weeks, change one or two of grip, stance, implement, ROM, rep range, never all at once (RIGHT). A/B weeks for clients who want variety (RIGHT). Second exposure = different exercise (RIGHT); do not load the spine twice a week: squat once, leg press the other day; deadlifts also load it. | Variation policy (4); V25 axial loading. |
| PER-06 / PER-08 / PER-09 / PER-10 / PER-11 | Level up at block end on '8 - That was perfect' or easier, no pain; season roles (in-season sprints for speed athletes, strength maintenance or jumps for others); Olympic ramp 75 → 90 % with 4 x 8 → 4 x 4; smooth increases for hypertrophy, steps/waves for fight prep; VOL 1/2/3 rep phases for athletes (all RIGHT). | VP-12, LV-4, QM-8, rep bracket step (4.4). |
| ORD-01 / ORD-02 / ORD-03 / ORD-04 | Row before pulldown always; the work first; power before strength; isolation first = priority (all RIGHT). | R1-R4, R6 hard or default rules (5). |
| ORD-05 | Supersets when time is short, for advanced athletes who need more work, for off-season VO2/mitochondrial work, and for beginners who do not fatigue: 'a tool to fatigue the heart more and compress the time' (PARTLY). | V07, N14. |
| ORD-07 / ORD-08 / ORD-09 / ORD-10 / ORD-11 | Work/accessory/nuance/survival; warm-up always, A-drills not volume; fighters' cardio-first is a real aerobic block; optional days add-on or separate (ideally separate); Focus slots may hit the same muscle (RIGHT / PARTLY). | N10, N11, R10-cond, placement fallbacks. |
| ATH-01 / ATH-02 | More ground time (karate, fighters) → more ballistics; less (sprinters) → more plyos; basketball a mix; baseball ballistics + rotation + sprints, few plyos. Plyo ranking confirmed. | LV-14; Example B plyo share. |
| ATH-04 / ATH-05 / ATH-07 | Boxers: reduce, never cut, pressing/arm volume when punching is high; no medball for aesthetics except warm-up; aerobic 3 (general/fat loss), 2 (athletes in season), 4 (aesthetics/bodybuilders) + walks after workouts. | V20, V21, goal modifiers (3.3: boxer row, pressing and arms x 0.5-0.7, never zero). |
| ATH-09 / ATH-10 / ATH-12 | Older: few plyos unless asked; no sex-based rules; youth may Olympic lift from the floor. Everyone in athletic training gets Olympic lifts. Contrast for intermediate+ athletes off-season at about 78-85 %, no rest inside. | LV-6, LV-11, LV-12, QM-8. |
| ATH-11 | NOT RIGHT to 'core after the power block': core first for everybody, as a warm-up; the user may move it. | V12, R10-core, order algorithm. |
| ATH-13 / FIX-03 | 'Justice League' was a marketing name for a weekend-warrior program (non-competitive athletic adults and youth); names must be generic. | Program renamed 'Athletic Performance - Non-Competitive' (as in 05 v1); cell citations keep JL = the verbatim tab name. |
| EQ-01 / EQ-02 / EQ-07 / EQ-08 / EQ-12 | No bands anywhere; band chops 'worthless'; no variable resistance for now (bands, chains, weight releasers). | V17 retired; LV-5 retired; band options removed. |
| EQ-03 / EQ-04 / EQ-10 / EQ-11 / EQ-13 | Older/injured/high-volume → constrained machines, never overhead squat, snatch, low-bar or depth jumps; foundational clients may use the 'advanced' machines; client preference may choose; machines not ranked (hack/leg press more constrained than Smith; belt squat non-axial; GHD/reverse hyper if they feel right); constraint scale 1-5 approved. | V10, CA-2, CA-12. |
| EQ-06 / EQ-15 / EQ-16 | Medball: slams 10-20 lb, overhead 6-10, sit-up 6-8, lighter for youth/older, nothing over 20 lb. Loaded jumps 10-20 % BW, too heavy when height/speed drop. Box heights low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12+ in advanced (all RIGHT). | V19, V20, LV-3, Z-C. |
| LIB-06 / LIB-07 / LIB-08 / LIB-09 / LIB-13 | No levels on throws or GHD; full lifts get the word 'Squat'; library clarifications (Camporini and strap rotation removed; pull under = lat pull-over; box pistol; low DB squats; alternating staggered-stance deadlifts); push press easier, push jerk intermediate/advanced. | V15, V23, CA-1, LV-12. |
| PRG-05 / PRG-06 / PRG-07 | L1/L2/L3 (novice = newby; under 6-12 months; >1 year consistent = intermediate; 6-12 months off → body treated as beginner); one algorithm for every model; '12/10/8 -20' = pyramid then a light 20; '10/10' = per side. | Levels; 3.9 rep ladder. |
| GEN-03 / GEN-05 / GEN-08 | Output format open, doubts in-tool tracking; adjust from logged EFFORT and HOW IT FELT (RIGHT); hard rules RIGHT (never to failure on heavy compounds, no V-squat, power before strength, horizontal before vertical, core never skipped) + coaches can add their own rules. | Two delivery modes (3.5); the five hard rules listed in the ordering algorithm (section 5, step 7); no V-squat (V10, CA-12); coach rules layer. |
| GEN-04 / EQ-05 / EQ-09 | Default exercise per slot + dropdown swaps in the category (RIGHT); a seated machine shoulder press for older/injured clients (RIGHT); unnamed implement defaults bodyweight → DB → barbell as level rises, limited by kit (RIGHT). | V10 notes; CA-1. |
| ATH-06 / LIB-04 / LIB-21 / LIB-22 | COD route names for every athlete, tiered easy / moderate / hard turns; advanced hurdle hops = taller hurdles + continuous quick contacts; speed-session order fixed (squirrel jumps → MACH / acceleration → max velocity); medball 'ALL LIST' = 1 x 10 per throw (all RIGHT). | 2.3 COD row; V19; ordering algorithm step 6; LV-3. |
| PRG-03 / PRG-11 | Bootcamp: timed circuits 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min, 4-6 sessions a week all fine (PARTLY); fat-burn circuits = finisher (RIGHT). | V07; session length (3.8). |

**Status labels**

| Label | Meaning |
|---|---|
| **COACH-ANSWER &lt;ID&gt;** | The coach's own answer in `coach_answers_full.md` (2026-10-08), cited by question ID (VOL-07, UNI-02 ...). Authoritative. A RIGHT verdict with no text makes our assumption his rule; PARTLY or NOT RIGHT means his words define the rule. Conflicts with the sheets are listed in 7.1. |
| **OBSERVED** | Read from a cell, cited as tab + cell and quoted verbatim, typos included ('INTENSIONALLY', 'Tripple', 'presercibe'). Abbreviations: SQ = 'ALL ABOUT SQUATS', RP = '(NOT DONE) RESISTANCE PATTERNS ', BA = '(NOT DONE) ALL ABOUT BALLISTICS', LU = '(NOT DONE) ALL ABOUT LUNGES', OL = '(NOT DONE) ALL ABOUT OLYMPIC LI', AE = 'AEROBIC CAPACITY CHEAT SHEET', S23 = 'Sheet23', 4T = '(NOT DONE) 4 TRACKS PROGRAMMING', CF = 'EXAMPLE CROSSFIT SPLIT', MM 00/02/05/07 = MASTER MODEL tabs 00 UPPER/LOWER, 02 BASEBALL, 05 ATHLETIC FULL BODY, 07 BOXING; BYOP 00 = 'AESTHETICS - FULL BODY - 4 DAYS'; LIB = BYOP 'MASTER EXERCISE LIBRARY'; JL = the BYOP tab 'JUSTICE LEAGUE' (verbatim tab name; the program is now called 'Athletic Performance - Non-Competitive', ATH-13, FIX-03). |
| **COACH-CHAT** | His earlier chat statements (`coach_answers.md`), relayed as a close paraphrase: quote marks do not certify exact words. |
| **INFERRED** | Our derivation. The coach must confirm it before it is shown to clients as his rule. |
| **SCIENCE** | Published evidence. `[S##]` resolves in `10b_equipment_variables_science.md` section 12; named studies (Pelland 2026, Schoenfeld, RP ...) in `12_volume_algorithm_v1.md` section 8. |
| **PROPOSED** | PROPOSED - PENDING COACH APPROVAL: our design where he asked us to propose (volume algorithm, output format) or did not decide. Most come from 12; the list is in 12 section 7 and in "Still pending" above. |

**Read before this file (not repeated here).** `12_volume_algorithm_v1.md` (the volume engine and the research charts the coach asked for), `05_session_architecture.md` v1 (sessions, pairing, axial budget, templates), `analysis/equipment/reference_variables.*` (variable grammar), `analysis/equipment/ordering_audit.*` (466 sessions, rules R1-R11 and N1-N18), `analysis/equipment/prog_*_equipment.*` and `lib_*.json` (implement, constraint and velocity tags), `03_volume_dosing.md`, `06_periodization.md`, `10b_equipment_variables_science.md` (evidence).

---

## 0. Short answers

| Question | Answer |
|---|---|
| What variables does the coach use? | 25, in layers. **EXERCISE** = pattern x implement/constraint x load position and position zone (rotation bias) x load laterality (contra / ipsi) x stance/base x grip x feet/body x ROM x end-range behaviour x plane (incl. core segment). **DOSE** = load x speed/intent x tempo x volume (sets x reps) x effort x density/rest/pairing x frequency. **ATHLETIC** = force phase, plyo method stage, plyo vs ballistic share, medball mass. **CONDITIONING** = duration x work:rest x pace. **RELATIONS** = the bilateral : unilateral share, same / cross-pattern pairing (new V24), the weekly axial-loading budget (new V25) and the derived exercise level. Accommodating resistance (bands, chains, weight releasers) is out (COACH-ANSWER EQ-01, EQ-12). He writes them as colour-graded blocks: 'ROM VARIABLE' (RP A81), 'END RANGE BEHAVIOR VARIABLE' (A86), 'HAND PLACEMENT' (I16), 'FEET POSITION' (I22), 'STANCES' (G82). CAT-01: tagging every exercise on all lenses "is the whole taxonomy of each exercise ... This is huge." |
| What makes an exercise harder? | COACH-ANSWER CAT-04: skill and stability demand plus **where the load sits**. Front-loaded / low = foundational ("people need to learn how to be more upright"); close to and on the body = intermediate (barbell front squat); behind the body or overhead = advanced (barbell back squat). Machines and cables make any position easier. COACH-ANSWER CAT-10: Davidson's zones are **rotation biases**: vertical positions (arms down / standing, arms overhead, deep squat) are external-rotation biased; horizontal positions (hands in front, knee at hip height) are zone 2, internal-rotation biased and compressive. Zones do not apply to plyos. CAT-05: "The levels are still very theoretical, so we don't need to rely heavily on them" - never a gate. |
| Is "heavier = slower, lighter = faster" in the sheets? | Yes. 'HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' vs 'LIGHT BARBELL ' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (SQ A44:A48); 'FAST RPE6 or about 60-70%' (4T N17); 'Front squats - light weights - same speed for all reps' (MM 02 BU33). COACH-ANSWER EQ-06 adds the medball weights: slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, passes and rotations light (8-10 lb, chat), never above 20 lb. His band and chain loads ('around 50%', 'around 70%', SQ B36/B40) stay as OBSERVED record only (EQ-12). |
| How does volume progress? | **His answers (VOL-04/05/06/07, UNI-05):** the weekly increase is 3, 5 or 7 % *of that muscle's weekly sets*, chosen by **what is going on with the person** (fatigue, life, response), never by muscle size; the coach can adjust it; 10 % a week "is way too much". Bank the fraction and add a whole set when it reaches 1. The new set goes to the **first exercise** for that muscle in that day's order, then the next (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); a small muscle that sits at the end of the session gets a **bonus exercise**. Starts: beginner 10-12, intermediate 15-20, advanced 20+ sets per muscle per week; 15-20 = maintenance to some growth, 20-25 = growth; priority +4-6 (cap about 25-30). The chat's "20 → 22 chest sets" is a 10 % week: the engine reaches 22 in two weeks at 5 % (section 3.4). Engine details: 12. |
| What is the bilateral : unilateral rule? | **His answer (UNI-02, UNI-03, UNI-10):** a slider from 90/10 to 10/90 by athlete, goal, phase and pain. "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." Bodybuilders and powerlifters start a block near 50/50 and move to 80/20-90/10; field and change-of-direction athletes stay 80-90 % unilateral (tennis "80% or 90%"); in season bilateral is minimal; the same logic runs for the upper body. OBSERVED: his written programs mostly sit near 50 % (section 3.7), which is the block start or the general default. |
| Contralateral or ipsilateral? | **His answer (CAT-13):** contralateral load pulls you **into** the hip (change-of-direction athletes: football routes, soccer, basketball, tennis; also to build missing hip range); ipsilateral helps you **out of** the hip (sprint acceleration: ipsilateral step-ups). For bodybuilders and powerlifters both are health accessories, mostly in the first 2-4 weeks, then the program turns bilateral-dominant and keeps one only "if there is anything bugging them". |
| "Don't confuse the muscle"? | **Confirmed (PER-02, RIGHT):** exercises fixed for a 4-6-week block; next block change one or two small variables (grip, stance, implement, ROM, rep range), never all at once. The second time a slot comes up in the week it is a different exercise of the same category (PER-04). A/B weekly menus are an option for clients who want variety, in any program (PER-03). His week-by-week tabs vary more (section 4.2: 22 % of 1,670 slot transitions keep the identical exercise). |
| How often may the spine be loaded? | **His answer (PER-04):** "I would rather just load it once per week and load it correctly." One axial squat a week, the other squat exposure on a leg press or belt squat; "I'm probably going to load it with the deadlifts as well", so one axial hinge a week (as operationalised in 05 6.4). The belt squat is the tool when an athlete is already loaded or sore (EQ-11). Whether the squat day and the deadlift day may be two days is open question 4. |
| Does "horizontal before vertical" hold? | **Confirmed as a hard rule with BYOP as the reference (ORD-01, RIGHT):** row before pulldown, always (BYOP pull 13/13 and push 15/15 sessions; across all 466 audited sessions only 28 % / 59 %). 'The work' comes first even when it is vertical (ORD-02). Power before strength (ORD-03). Core FIRST by default, movable by the user (ATH-11, NOT RIGHT to v0's 'core after the power block'). Hip dominant pairs with push, knee dominant with pull, to avoid bleed-over (UNI-11, ORD-06). |
| Other ordering rules that hold? | Bilateral before unilateral **97 %** (225/231); athletic before strength **83 %** (BYOP 12/12); lower/upper alternation **85 %**; squat+pull / hinge+push **84 % of pairs** (186/222); compound before isolation **75 %** (isolation first only for a priority muscle, ORD-04); conditioning last **88 %**; leg extension before leg curl 12/14; isolation follows the day (biceps on pull days 79 vs 2); constraint rises through the session. |
| When does a set stop? | **His answer (VOL-13):** 1-3 RIR ("leave 1 in the tank"); RIR is his scale, RPE is explained alongside. 'MAX' = technical failure, only on small-muscle or bodyweight work; MYO only on the last machine or isolation exercise (VOL-15). Speed work keeps 'same speed for all reps'; landings 'Drop & Stick - Hold for 3 seconds'; squats with 'MAXIMAL UPRIGHT POSTURE'. Generator (section 6): stop rules by zone, plus a position standard that sends a client back to a front-loaded version. |

---

## 1. The variable set: how the coach defines and uses each one

### 1.1 Grammar (OBSERVED structure, `reference_variables.md` section 3; lenses per CAT-01/CAT-03)

```
EXERCISE  = PATTERN · IMPLEMENT/CONSTRAINT · LOAD_POSITION + POSITION_ZONE (rotation bias) · LOAD_LATERALITY (contra/ipsi)
            · STANCE/BASE · GRIP · FEET/BODY_POSITION · ROM · END_RANGE · PLANE (incl. CORE_SEGMENT)
DOSE      = LOAD_MAGNITUDE · SPEED/INTENT · TEMPO · VOLUME (sets x reps x weeks) · EFFORT · DENSITY/REST/PAIRING · FREQUENCY
ATHLETIC  = FORCE_PHASE · PLYO_METHOD_STAGE · PLYO:BALLISTIC SHARE · SPEED/INTENT · IMPLEMENT (+ medball mass, box/drop/hurdle height)
CONDITION = DURATION · WORK:REST · PACE (colour A/B/C)
RELATIONS = BILATERAL:UNILATERAL share · PAIRING (same/cross pattern, anterior/posterior) · AXIAL LOADING budget · EXERCISE LEVEL (derived)
RETIRED   = ACCOMMODATING (bands, reverse bands, chains, weight releasers): OBSERVED record only (EQ-01, EQ-12)
```

* **CAT-01 (COACH-ANSWER).** Tagging every exercise on all lenses at once "is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge."
* **CAT-03 (COACH-ANSWER).** "Biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises." In this model biomechanics is the EXERCISE line above, not a category.
* **CAT-12 (COACH-ANSWER):** "I don't really understand the question." Whether the generator may build new variants from this grammar is re-asked in plain words (open question 10). Until he answers, the generator picks named library exercises (CAT-07: the BYOP library is the single source of truth) and uses the grammar only to describe the one or two small changes between blocks (PROPOSED).
* **Write-out frequency.** How often each slot is written inside the 701 reference-tab exercise names (OBSERVED count): stance/base 300, intent 213, ROM 70, load position 66, end range 62, grip 62, plane/rotation 50, load laterality 40, feet/body 24, accommodating 17.
* **Defaults.** Unwritten slots take a default: bilateral, standing, floor ROM, no bands or variable resistance, controlled tempo, 1-3 RIR.
* **Word order.** The coach's word order gives the render template (INFERRED). Example: 'Front racked db or kb contralateral loading' (RP C24). Template: `[INTENT] [STANCE/ROM tool] [LATERALITY] [IMPLEMENT] [LOAD POSITION] [PATTERN] [GRIP] [FEET] [END RANGE]`.
* **Lineage.** Speed, ROM, load and volume are variables in his own words (COACH-CHAT). Position, stability and laterality follow Dr. Pat Davidson (CAT-04 and CAT-10 name *A Coach's Guide to Optimizing Movement*); the volume logic follows Dr. Mike Israetel / RP and the research charts in 12 section 2.

### 1.2 Position zones, load position and exercise level (COACH-ANSWER CAT-04 + CAT-10)

The coach gave two linked descriptions. The v1 model keeps them as **two properties of each exercise**.

**(a) Load position sets the level (CAT-04).** "The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright. The load closer to and on your body is more intermediate. The loading behind your body, for example, for back squat, would be more advanced." Machines and cables "change it because it's easier because the machine or the cable is doing the work for you".

| Load position | Level | Lower body (SQ A10:H11; LU C21:C33) | Upper body | Source |
|---|---|---|---|---|
| Front-loaded / low / at the sides | FOUNDATIONAL | 'Hex Bar Squat' 'EASIEST', 'Goblet Squat' 'EASIER', 'High Zercher Squat' 'EASY', 'Zercher Squat' 'MODERATE'; 'Low DB squats' = DBs hanging at the sides (LIB-09) | arms-down isolation (pushdown, standing curl) | COACH-ANSWER CAT-04, LIB-09 + OBSERVED |
| Close to and on the body / horizontal | INTERMEDIATE | 'Front Squat/ SSB Bar' 'HARD'; front-racked lunge loading | horizontal push and pull (zone 2, "safer for you when you push and pull") | COACH-ANSWER CAT-04 + OBSERVED |
| Behind the body / overhead | ADVANCED | 'High Bar Squat' 'HARDER', 'Low Bar Squat' 'HARDEST', 'Overhead Squat' 'VERY HARD '; 'Back racked barbell' lunges (LU C33) | vertical push and pull; overhead triceps extension | COACH-ANSWER CAT-04 + OBSERVED |

**(b) Position zone = rotation bias (CAT-10).** "The zones come from Dr. Pat Davidson's book ... which is essentially external rotation biases at the vertical. If I raise my hands up, or if I'm in a deep squat, and then if I'm standing, it's also external rotational bias ... If I'm in a horizontal plane, like if my knee is at the level of my hips (I'm halfway through a squat), or if my hands are in front of me horizontally, then that is a zone 2 or an internal rotation bias, which is more compressive. It doesn't apply to the plyos."

| Zone | Position (limbs / joints) | Bias | Typical exercises | Tag |
|---|---|---|---|---|
| 1 | arms down by the sides, standing | external rotation | pushdowns, curls with the arms down, suitcase carries, standing calf raise | COACH-ANSWER CAT-10, CAT-04 (zone 1 = "closer to your body at the bottom") |
| 2 | hands in front horizontally; knee at hip height (half squat) | internal rotation, compressive | bench, push-up, rows, half-depth squats, curls with the arms in front | COACH-ANSWER CAT-10 |
| 3 | arms overhead; deep squat | external rotation | overhead press, pulldown, pull-up, overhead triceps extension; full-depth squat | COACH-ANSWER CAT-10 (overhead numbered zone 3 in CAT-04); the deep squat numbered 3 is INFERRED from Davidson |

**Where the word ZONE appears in his sheets (OBSERVED), and what it now means:**

* The arm-zone labels 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (S23 AO5; LIB AS12), 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' (S23 AP5) and 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' (S23 AP6) are arm positions (down / in front / overhead): CAT-10 settles v0's question 22.
* LIB row 3 'ZONE' (A3) holds each column's difficulty: 'EASY', 'MODERATE', 'HARD' (Q3), 'ADVANCED', 'FOUNDATIONAL', 'ANY' (C3:Z3). That is the library level (V23).
* The plyo key 'ZONE 1/2/3' = 'Receive pause/creat' / 'Receive/create' / 'Repeat receive create' (S23 C34:D36) is **not** a zone (CAT-10, CAT-11): it is the plyo method stage (V19).
* The Sheet23 column-A bands 'ZONE 1' (A2:A9), 'ZONE 2' (A10:A16), 'ZONE 3' (A17:A28) still match neither reading: the ZONE 1 rows hold 'Lat Pulldown Wide Grip' (T2), 'Standing DB Press' (W6) and 'Weighted Pull ups ' (U8), all overhead. They stay unresolved and unused.

**How (a) and (b) combine (INFERRED).** For upper-body vectors the two agree: horizontal = zone 2 = intermediate, overhead = zone 3 = advanced, which is also a reason behind row-before-pulldown. For squats they can disagree: a deep goblet squat is front-loaded (foundational by CAT-04) but in the deep-squat zone (CAT-10). The generator takes the **level from the load position** and stores the **zone as a separate rotation-bias tag** until the coach says otherwise (open question 2).

**Exercise level heuristic (V23, INFERRED; never a gate, CAT-05).** `level = load_position_step − support + skill`, clipped to 1-3:

* support: −1 for a cable, a DB on a bench or a seated base; −2 for a padded machine (constraint 4-5);
* skill: +1 for Olympic lifts, ballistic overhead lifts and hanging bodyweight pulls.

Calibration against the coach's own placements (v0 computation, still valid): 7 of 11 match ('Goblet KB/DB Squats' AI11, 'Front Squats' AI46, 'Lat Pulldown ...' U9:U14, 'Assisted Pull-Up Machine ...' U16:U18, 'Machine Row ...' X9:X11, 'Stricted Pull-ups ...' U46:U49, 'Standing DB Press' AA50). The three conflicts are now settled by his answers: push press is "easier", push jerk "intermediate/advance" (LIB-13, CA-1); leg press / pendulum / hip thrust machine are volume tools any client may use (EQ-04, CA-2); back-loaded squats are advanced (CA-6). The seated-press misfit stays open (open question 17). No levels on throws or GHD (LIB-06, LIB-08).

**Client level vs exercise level (CAT-06, RIGHT).** The client's level (L1/L2/L3, PRG-05) sets the dose (starts, caps, rep bracket); the exercise level is chosen per slot. Levels "add options" (CAT-05): a higher-level client keeps every lower-level exercise.

### 1.3 Master table

"Min. kit" is the least equipment a client needs to *manipulate* that variable.

| ID | Variable | Coach's words (verbatim, cell or answer) | How the coach uses it | Values / ladder (easy → hard) | Generator field and default | Min. kit | Status |
|---|---|---|---|---|---|---|---|
| V01 | **Load magnitude** | 'HEAVY BARBELL' / 'LIGHT BARBELL ' (SQ A44/A47); '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM 00 A6); '%' row 80, 80, 85, 85, 90, 90 (4T N3:T3); 'Hang cleans @ 75%' (MM 02 CM33); '78% of 1RM whatever squat immediately into tuck jumps...' (SQ I18); 'this but hugging a light medball' (MM 05 K13); chat: "The heavier I go, the slower I'm going to be" | Load is a consequence of the rep target and the effort target. He writes % only for barbell main lifts, Olympic lifts, speed work and contrast; everything else is a word or RIR. The client logs it in 'WEIGHT USED or SCORE' (JL H2). | words LIGHT -> HEAVY; % 60-70 (speed) -> 75-90 (Olympic ramp, PER-09) -> 78-85 (contrast, ATH-12) -> 80-90 (strength wave). The sheet's 50 % (bands) and ~70 % (chains) are OBSERVED record only: no variable resistance (EQ-12) | `load = f(rep_bracket, rir_target)`; prescription format by implement (LV-8); log `load_kg` numerically plus a free `notes` field; load and volume load are tracked, never driven by a % (VOL-04); client preference moves the rep range on big compound lifts only (VOL-12) | any | OBSERVED + COACH-CHAT + COACH-ANSWER VOL-04, VOL-12, PER-09 |
| V02 | **Speed / intent (concentric)** | 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' / 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' (BA A22/D22); 'FAST RPE6 or about 60-70%' (4T N17); 'Max speed banded lat pull downs half kneeling ipsilateral' (MM 05 F47); '12/12 powerful turns' (MM 02 V30); 'Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run' (MM 02 DI29); chat: "As long as you can generate the force with a lot of speed, then you're training your body to move at that speed" | Speed is a variable ON an exercise: the same lift is 'HEAVY ...' one day and 'FAST ...' another. It is produced by a lighter load plus an intent word. The banded variant in his cell ('Max speed banded lat pull downs', MM 05 F47) is out of scope (EQ-01): the generator uses a light cable or DB version. | EASY -> MODERATE -> FAST -> FASTEST -> SPRINT (AE C10:I41); '*FASTEST SSC*' -> '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' -> '*SPRINT*' (S23 B43:B52) | `velocity_intent` in {max, power, strength, controlled, isolation}; concentric intent is always maximal (FV-2, [S37][S38]) | none | OBSERVED + COACH-CHAT; bands out (COACH-ANSWER EQ-01) |
| V03 | **Tempo (eccentric speed, pauses, holds)** | 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (SQ A45/A48); 'slow eccentric deficit Lunges (no weigths)' (MM 02 EL52); 'weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one' (MM 05 F12); MYO set 'you just dont move for 3 seconds' (SQ A30) | Written as words, never as a 4-digit tempo. 'Slow' replaces load when there is none (EL52). Holds appear on landings and isometrics. | natural/fast (athletic) -> controlled -> slow eccentric -> pause / iso hold | `tempo` in {natural_fast, controlled_2s, slow_ecc_3_5s, pause, iso_hold}; default controlled; never slow on power work (TEMPO-4) | none | OBSERVED words; seconds INFERRED |
| V04 | **Range of motion (full / mid / lengthened / short)** | 'ROM VARIABLE': 'Elevated' (green) / 'Floor' (yellow) / 'Deficit' (red) / '*RDL' (red) (RP A81:A85); 'Elevated Push ups (for full ROM)' (LIB AD99); 'Standing Calf raises (use deficit)' (LIB AU9); 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' (MM 07 L14); 'Lunges are great for finding/gaining/regaining ROM' (LU A12); chat: "full ranges of motion, mid ranges of motion, those are understandings of more mechanical work" | Full ROM is the default on isolation and machine work. Partial ranges (1/4, box, pins, hang heights) appear on fast or strength work. ROM is changed with deficits, boxes and elevation, not with a different implement. | short (elevated start / box / pins / high hang) -> floor -> deficit / lengthened | `rom` in {partial_short, mid_range, full, lengthened}; `rom_effect` (+/0/-) stored per exercise because 'Elevated' is ambiguous (I7; 10b F7) | step, plates, box | OBSERVED + COACH-CHAT |
| V05 | **End-range behaviour** | 'END RANGE BEHAVIOR VARIABLE': 'Dead stop' (green) / 'Touch & go' (yellow) / '*RDL' (red) (RP A86:A89); 'Box. Any Squat Touch and Go fast' (LIB AI91); plyo key 'Receive pause/creat' -> 'Receive/create' -> 'Repeat receive create' (S23 D34:D36), which the coach now calls a way of doing plyos, not a zone (CAT-10, CAT-11) | How he controls the stretch-shortening cycle: dead stop builds strength off the bottom, touch & go uses the rebound. | dead stop -> touch & go -> continuous / rebound | `end_range` in {dead_stop, touch_and_go, continuous}; dead stop first for beginners and in the first athletic block | floor, box, pins | OBSERVED |
| V06 | **Volume (sets x reps over time; volume load = sets x reps x weight)** | VOL-04: the 3/5/7 % is 'of weekly sets per muscle (your chest example: 20 → 22 sets at the same load)' (RIGHT); UNI-01: 'I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation'; VOL-07: 'I'm adding sets to the things that matter most'; SETS 1-8 + 'SUPERSET W/ 👇' (LIB AV8:AV16); REPS '4 to 6 Reps' ... '20 Reps', 'MYO SET' (LIB AW8:AW14); "****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus" (SQ A5) | The primary weekly lever. The unit is hard sets per muscle per week; the person's state picks a 3, 5 or 7 % weekly increase (VOL-05); volume load is logged as his description of total work, not steered on (VOL-04). | start beginner 10-12 / intermediate 15-20 / advanced 20+ (VOL-01); 15-20 maintenance to some growth, 20-25 growth (UNI-01); priority +4-6, cap about 25-30 (VOL-02); +3/5/7 % a week by the person, never above 10 % (UNI-05) | `hard_sets[muscle][week]` (fractional: 1.0 main mover, 0.25 helpers, dips 0.5/0.5, thruster 1.0/0.5; glutes 0.5 on hinges as a PROPOSED exception (3.2); leg curl and leg extension 1.0; 10/10 = 1 set; athletic patterns 0); bank and release one set (3.4); `volume_load[exercise][week]` logged (3.9) | any | COACH-ANSWER VOL-01, VOL-04, VOL-05, VOL-06, VOL-07, VOL-09, VOL-10, UNI-01 + OBSERVED |
| V07 | **Density / rest / pairing** | '*REST 1-2 MIN BETWEEN SETS' (hypertrophy) / '*REST 3-6 MIN BETWEEN SETS' (strength) / '*REST AS PRESCRIBED' (athletic) (SQ B28/E28/H28); 'Superset - same reps' (MM 02 Part C); 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' (MM 07 L12); '3x 10 cal bike sprint (2 min rest)' (MM 02 BY39); 'AMRAP' (4T D70:L70); ORD-05: superset when time is short, for advanced athletes who need more stimulus, for off-season VO2/mitochondrial work and for beginners who don't fatigue: 'It's a tool to use to fatigue the heart more and compress the time' | Rest follows the goal (VOL-14: hypertrophy 1-2 min, up to 3; strength 3-6 min; athletic as prescribed; supersets rest after the pair). Supersets are a fatigue and density tool with four use cases (ORD-05), paired lower/upper by the anterior/posterior rule (V24). Density is the primary lever for fat loss, hybrid and conditioning. | long rest (strength) -> moderate (hypertrophy) -> paired (superset) -> circuit / AMRAP | `rest_s` by zone; `pairing` in {straight, superset_lower_upper, complex, circuit}; superset ON when time is short, the client is L3 or an off-season athlete with a VO2 goal, or an L1 client reports low fatigue (EFFORT <= 6); OFF for an intermediate with enough time (INFERRED); bootcamp circuits 3-5 rounds x 30-50 s per station, 5-7 stations, 35-45 min in total; 4, 5 or 6 sessions a week all work ("there are different options", PRG-03); fat-burn circuits are a finisher after the lifting (PRG-11) | timer | OBSERVED + COACH-ANSWER VOL-14, ORD-05, PRG-03, PRG-11 |
| V08 | **Effort (RIR / RPE / EFFORT 1-10)** | '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' (MM 00 A4); '...Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM 00 A6); 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+' (SQ A13); 'the work' '1RIR' (4T M9/D9); 'EASY' (4T D17); EFFORT '1 - Way Too Easy' ... '8 - That was perfect' ... "10 - I'm done" (LIB AX8:AX17); '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' (CF A4) | His model is RIR (VOL-13); RPE is explained alongside. 1-3 RIR always ('leave 1 in the tank'). MAX / MAX REPS = technical failure, only on small-muscle or bodyweight work; MYO only on the last machine or isolation exercise (VOL-15); plyos are 'EASY'. The client self-rates EFFORT 1-10 and 8 is the bullseye. | EASY -> 3 RIR -> 2 RIR -> 1 RIR -> MAX (small-muscle or bodyweight work only, VOL-13) / MYO (last machine or isolation, VOL-15) | `rir_target` by exercise class (QM-1); the EFFORT log drives the readiness gates and score (3.5) | none | OBSERVED + COACH-ANSWER VOL-13, VOL-15 |
| V09 | **Frequency** | tab titles '... 4 DAYS A WEEK', '3 DAY BUILDER', 'PUSHPULLLEGS - 3 or 6 DAYS A WK'; Day 3 = Day 1 slot lists; 'I reccomend doing it WEDNESDAYS & SATURDAYS max 40 min of steady' (MM 00 A5); 'a total of 3 Aerobic capacity workouts per week' (AE A5) | Each main pattern 2x/week in the 4-day, 6-day, athletic and bootcamp templates; the second exposure of a slot is a different exercise of the same category (PER-04), and for squats and hinges the non-axial one (V25). Aerobic sessions a week: 3 general/fat loss, 2 athletes in season, 4 aesthetics/bodybuilders, plus walks after workouts (ATH-07). | 1x -> 2x per pattern per week | `days_per_week`, `exposures_per_pattern` (default 2); the second exposure uses a different exercise (PER-04) and respects the axial budget (V25); `aerobic_sessions` by goal (ATH-07) | none | OBSERVED + COACH-ANSWER PER-04, ATH-07 |
| V10 | **Exercise selection: pattern x implement x external stability (constraint)** | chat: "machines ... have a lot of reference points ... you can push a lot, but it's also safer"; "The barbells are more skilled"; CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work'; EQ-11: 'I don't want to rank them because they have different brands, angles... Probably more constraint would be a hack squat and a leg press. Less constraint would be a Smith machine... Belt squats are for people that you don't need to load them axially'; EQ-03: 'I'd rather they collect that volume in a safe place with more constraints'; RP E8:E15 colour ladder; 'LEG PRESS' 'LOVE IT', 'PENDULUM' 'LOVE IT', 'HACK SQUAT' "I PERSONALLY DON'T LIKE IT" (SQ G35:H41; superseded as a ranking by EQ-11; the V-squat stays out by the GEN-08 hard rule) | The slot fixes the pattern; client profile, kit and preference (EQ-10) pick the implement and constraint level. Machines are not ranked against each other (EQ-11). Machines have two roles: ON-RAMP (assisted pull-up, machine row) and VOLUME TOOL (leg press, pendulum); older, injured and high-volume clients collect volume on constrained machines and never get overhead squat, snatch, low-bar squat or depth jumps (EQ-03). | constraint 5 (seated machine with back pad) -> 4 (plate-loaded / Smith / chest-supported) -> 3 (cable or DB on a bench) -> 2 (standing free weights) -> 1 (bodyweight, ballistic, reactive) (COACH-ANSWER EQ-13: RIGHT) | `constraint_level` 1-5 (lib_*.json); population preset bands (10b EQ-2); `client_preference` may choose between alternatives (EQ-10); no machine ranking (EQ-11); knee flexion is its own segment (CAT-09) | per pattern (lib_* tiers) | OBSERVED + COACH-CHAT + COACH-ANSWER EQ-03, EQ-04, EQ-10, EQ-11, EQ-13 |
| V11 | **Variation (exercise choice over time)** | chat: "you don't want to always be trying to 'confuse' the muscle ... not a lot of new things, more like looking at the same over the same block, and in the next block you can change some small variables"; 'A WEEK' / 'B WEEK' (4T O33:P33); 'FFE CONTRA LUNGES' -> 'FFE IPSI LUNGES' -> 'RFE CONTRA LUNGES' -> 'RFE IPSI LUNGES' (4T E38:H38); PER-02 (RIGHT): exercises fixed for the 4-6-week block, next block change one or two of grip, stance, implement, ROM or rep range, never all at once; PER-03: 'sometimes athletes and people want more variety... If they don't really need a lot of variety, then they don't have it' | The slot skeleton and the exercises stay fixed for a 4-6-week block (PER-02). Between blocks one or two small variables change. A/B weekly menus are an option for clients who want variety, in any program (PER-03); his week-by-week tabs vary more (4.2). | fixed -> A/B two-menu -> one variable per week -> new weekly menu inside a fixed zone | `variation_mode` in {block_fixed (default), ab_two_menu (variety seekers), zone_constant_rotation (athletic accessory slots)} (section 4) | none | COACH-ANSWER PER-02, PER-03 + OBSERVED |
| V12 | **Order** | chat: "I usually start with ... rowing before I do an overhead pull. I do a horizontal push before I do a vertical push"; "power first for athletics, and then ... the power strength training of it, and then strength training, and then the resistance movements"; ATH-11: 'we need all the core work to be done first. Ideally, start with the core work that'll give you a good warm-up... if they want to be able to move the core work... that's fine too' | Warm-up, then core first (movable), then fast and free work, then slow and constrained work; bilateral before unilateral; compound before isolation unless a priority muscle; horizontal pull before vertical pull; 'the work' first; power before strength. | tier 0 warm-up -> core block (first by default, ATH-11) -> 1 reactive -> 2 throws -> 3 COD -> 4 Olympic / power-strength -> 5 bilateral + its paired upper lift -> 6 unilateral + its paired upper lift -> 7 isolation -> 8 conditioning | `tier` per slot; `core_position` in {first (default), after_power, after_strength, end} (user choice); section 5 rules | none | COACH-ANSWER ORD-01, ORD-02, ORD-03, ORD-04, ATH-11 + OBSERVED + COACH-CHAT |
| V13 | **Position zone (Davidson): rotation bias + load position** | CAT-10: 'external rotation biases at the vertical. If I raise my hands up, or if I'm in a deep squat, and then if I'm standing... or my hands are down. If I'm in a horizontal plane, like if my knee is at the level of my hips (I'm halfway through a squat), or if my hands are in front of me horizontally, then that is a zone 2 or an internal rotation bias, which is more compressive. It doesn't apply to the plyos.' CAT-04: 'The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright'; 'The load closer to and on your body is more intermediate'; 'The loading behind your body, for example, for back squat, would be more advanced'; zone 2 'very high-pressure, like horizontal, but it's safer for you when you push and pull'; 'When it's machines or cables, it changes because it's easier'. SQ A3 'from most front loaded to most back loaded'; SQ A10:H11 'EASIEST' Hex Bar ... 'VERY HARD ' Overhead; 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (S23 AO5; LIB AS12); 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' (S23 AP5); 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' (S23 AP6); S23 A2:A28 'ZONE 1/2/3' row bands (the word only, 1.2) | Two linked properties. (1) The limb/joint position sets the zone and its rotation bias: arms down or standing (zone 1) and arms overhead or deep squat (zone 3) are external-rotation biased; hands in front or knee at hip height (zone 2) is internal-rotation biased and compressive. (2) The load position sets the level: front-loaded / low = foundational ('learn to be upright'), on the body / horizontal = intermediate, behind the body / overhead = advanced; machines and cables make any position easier. Not used for plyos. 'HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN' (SQ A9). | load position: low / front / at the sides (hex bar, goblet, zercher, 'Low DB squats' = DBs hanging at the sides, LIB-09) -> on the body (front squat, SSB; horizontal push and pull) -> behind or overhead (high bar, low bar, overhead squat; vertical push and pull). Zone (rotation bias): zone 1 ER (arms down, standing) / zone 2 IR, compressive (hands in front, half squat) / zone 3 ER (overhead, deep squat). Numbering the deep squat and overhead positions zone 3 is INFERRED from Davidson's model; the coach names them only as external-rotation positions (CAT-10) | `position_zone` in {1, 2, 3} and `rotation_bias` in {ER, IR} per exercise (not for plyos, CAT-10); `load_position` in {front_low, on_body, behind_overhead}; machine/cable lowers effective difficulty; one step is a possible between-block variable (VP-10, INFERRED); never a gate ('the levels are still very theoretical', CAT-05) | 1 DB/KB already gives zones 1-2 for lower body | COACH-ANSWER CAT-04, CAT-10, CAT-05 + OBSERVED |
| V14 | **Load laterality: contralateral / ipsilateral (into / out of the hip)** | CAT-13: 'Contralateral exercises are usually to pull me into the hip... my eccentric going down is getting into the coiling of the body'; 'ipsilateral... To get out, that right hand is going to help me get pulled out of the hip'; 'it's more for change-of-direction athletes... football players... soccer players... basketball players, a lot... tennis, definitely'; 'Sometimes they don't have the ranges of motion, so we help them by creating those'; sprinter: 'when we do the ipsilateral, it's ipsilateral step-ups... I don't need them to get into the hip; I need them to get out of the hip really quick'; powerlifters and bodybuilders: 'as accessory movements in order to keep them healthy... much more of that at the beginning of their program... up to 4, maybe... If there is anything bugging them... I leave it as an accessory'. Sheets: 'GET INTO THE HIP VARIATIONS - MODERATE' 'Contralateral loading ' / 'GET OUT OF THE HIP - MODERATE' 'Ipsilateral loading ' / '- HARDER' 'Front racked db or kb contralateral loading' (RP C19:C26); 'Split stance ALWAYS contralateral' (RP G83); 'FFE CONTRA LUNGES' -> 'FFE IPSI LUNGES' (4T E38:F38) | Use cases (CAT-13): contralateral load for change-of-direction athletes who must get in and out of the hip quickly (football routes, soccer, basketball, tennis) and to build missing hip range; ipsilateral load to drive out of the hip, e.g. ipsilateral step-ups for sprint acceleration; for bodybuilders and powerlifters both are health accessories that restore the rotation bilateral lifting loses, mostly in weeks 1-4, then kept only if something bugs them. One implement is enough. | double (bilateral load) -> contralateral / ipsilateral (MODERATE, RP C20 / C22; suitcase-style hold INFERRED) -> front-racked contralateral / ipsilateral (HARDER, RP C24 / C26) | `laterality` in {bilateral_double, contra, ipsi, alternating, offset}; `contra_share` of loaded unilateral sets by profile: COD athletes ~70 % contra, sprinters ~60 % ipsi step-ups, bodybuilders/powerlifters contra/ipsi accessories in weeks 1-4 (percentages PROPOSED, 12 3.11) | 1 DB/KB/medball | COACH-ANSWER CAT-13, UNI-12 + OBSERVED; percentages PROPOSED |
| V15 | **Stance / base of support** | 'Stance loads the FRONT TO BACK' (LU A17); 'FEET POSITIONING VARIATIONS' (RP C9:C18); 'Half kneeling same side leg up' / 'Half kneeling opposite side leg up' (RP G84:G85); seated -> Z/floor -> kneeling -> standing (RP E8:E15); LIB-09: 'Single Leg Get Ups' = sit on a box and stand on one leg ('almost like an assisted pistol or a box pistol'); 'Alternating DB/Barbell Deadlifts' = half step back, staggered-stance single-leg deadlift, alternating legs | Removing base raises difficulty without load. Lunge stance (FFE/RFE) is varied week to week in AESTHETICS-8. | bilateral -> staggered -> split -> FFE/RFE -> FFE+RFE -> single leg; seated -> kneeling -> standing | `stance` enum | step / bench / wall | OBSERVED |
| V16 | **Grip and feet / body position** | 'HAND PLACEMENT': 'supinated', 'neutral', 'pronated', 'wide grip', 'narrow grip' (RP I16:I21); 'FEET POSITION': 'feet on bench'/'feet on wall' (green) -> 'feet on raisers or plates'/'feet on floor' (yellow) -> 'feet in air (hollow bent legs)'/'feet in air (hollow legs str8)' (red) (RP I22:I28); pain rule 'getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips)' (MM 00 A7) | Grip is the cheapest in-block variety lever and the first pain lever (split grips; then machines, -30-50 % or drop the exercise, VOL-03). Feet position grades trunk demand on presses. Grip is one of the coach's named between-block variables (PER-02). | split grip (pain) <-> fixed grip; feet supported -> unsupported | `grip`, `feet` enums | bench / wall | OBSERVED + COACH-ANSWER PER-02, VOL-03 |
| V17 | **Accommodating resistance (RETIRED from the generator)** | 'BOTTOM BANDED' '*PROLONG THE DURATION OF MAX PROPULSION', 'Weight should be lower ranges around 50% so you can move fast', 'Bands are designed for speed/velocity'; 'REVERSE BANDED' '*ACCELERATES MAX PROPULSION'; 'BOTTOM CHAINS' '*INTENSIONALLY SLOW YOU DOWN', 'Weght can be moderate around 70%'; 'WEIGHT RELEASERS' 'I HAVE NO IDEA' (SQ A35:D41); 'LOADING VARIABLES' (RP A90:A94) | OBSERVED record only. The coach: 'We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on' (EQ-12) and 'I don't program anything with bands' (EQ-01). The diagnosis-to-tool rule (bands / reverse bands / chains) is kept for a later version. | none (fixed for v1) | `accommodating` = none for every exercise; banded / reverse-banded / chained / weight-released variants are filtered out of every pool | n/a | OBSERVED record; RETIRED by COACH-ANSWER EQ-01, EQ-12 |
| V18 | **Plane / perturbation, incl. core segment** | 'Movement orientations/guidance loads AROUND' (LU A19); core grid 'TRANSVERSE' / 'SAGITAL' / 'FRONTAL' x 'DYNAMIC'/'STATIC' x 'CORE THORAX' / 'CORE PELVIS' / 'BOTH' (CONTROL PATTERNSCORE A4/H4/O4, B5/E5, A7/A18/A29); CAT-08: 'trunk on core (thorax moves), or pelvis on core (pelvis moves), then both at the same time; each can be done in different planes'; ATH-11: core first; VOL-17: 'about 2 core exercises'; 'Hip banded tube bands' (RP A47) is OBSERVED only (no bands, EQ-01) | Frontal and transverse demand added with off-axis loads, cables, unilateral frontal-plane lifts (lateral lunge, cossack, lateral step-up, 'Hold between knees Squats': more for court and combat athletes, UNI-12; the RESISTANCE PATTERNS frontal/transverse moves join the main library, LIB-20) and rotational throws. Core is organised by which segment moves, then by plane and static/dynamic; a core block of about 2 exercises opens every session (ATH-11, VOL-17). | core segment thorax -> pelvis -> both; plane sagittal -> frontal -> transverse (S23 'FOUNDATIONAL - CT - SAGITAL', 'INTERMEDIATE - CT - FRONTAL', 'ADVANCED - CT - TRANSVERSE'); static -> dynamic (INFERRED) | `plane` enum; `core_segment` in {thorax, pelvis, both}; `core_mode` in {static, dynamic} | cable or medball for loaded rotation (37 of 52 core cells need nothing); no mini bands (EQ-01) | OBSERVED + COACH-ANSWER CAT-08, ATH-11, VOL-17, UNI-12, LIB-20 |
| V19 | **Plyo force phase, method stage (not a zone), plyo vs ballistic, box/drop/hurdle height** | CAT-10: 'Your body and your connective tissue need to learn how to receive forces before we teach it how to create... receive and pause... receive and then create, like stick-the-landing and then jump... repetitively receiving and creating forces can be like hops and jumps'; 'it's harder if it's unilateral hops or jumps'; 'The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement'; 'they start the programs with more ballistic movements, and then slowly and gradually we go into more plyometric movements'; CAT-11: 'it's not necessarily a plyo zone. I don't know what to call it yet'; ATH-01: 'The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos'. Sheets: 'TAKING IN FORCES' -> 'DELIVER FORCES FAST' -> 'AMORTIZATION OF FORCES' -> 'REBOUNDING ' (BA A24:D24); 'ZONE 1' 'Receive pause/creat' / 'ZONE 2' 'Receive/create' / 'ZONE 3 ' 'Repeat receive create' (S23 C34:D36); 'Low Box Jumps (half shin)' / 'Mid Box Jump (up to knee)' / 'High Depth Drop (above hip)' (LIB G13 / G14 / G133) | The athletic equivalent of the ROM and end-range ladders. A block starts more ballistic (longer ground contact, concentric-led) and becomes more plyometric (short, reactive contacts); inside each method stage bilateral comes before unilateral. The sport's ground-contact time sets the plyo:ballistic mix (ATH-01). Older clients get few plyos unless they ask (ATH-09). | method stage: receive & pause -> receive then create -> repeated receive/create (PROPOSED name RC1 / RC2 / RC3); bilateral -> unilateral; ballistic -> plyometric; heights low 6-12 in / medium 12-18 in / high above hip, hurdles 6 in moderate, 12+ in advanced (EQ-16); advanced hurdle hops = taller hurdles and continuous, quick-contact reps (LIB-04); upper body: 'Push up Stick the Landing' starts with the hands on a box and lands them on the floor (LIB-02), a receive-and-pause drill; loaded jumps 10-20 % body weight, too heavy when height or speed drops (EQ-15) | `force_phase`, `plyo_method_stage` (RC1-RC3, can change inside a block), `plyo_share` (plyo / (plyo + ballistic) sets) by sport (12 3.13, PROPOSED), `height_in`; contacts counted separately, never as muscle sets (VOL-10) | box, plates, hurdles | COACH-ANSWER CAT-10, CAT-11, ATH-01, ATH-09, EQ-15, EQ-16, LIB-04, LIB-02 + OBSERVED; stage name and week mapping PROPOSED |
| V20 | **Medicine-ball mass** | chat: "those med ball upper body passes don't need to be heavy; they need to be light, 10 lbs., 8 lbs."; EQ-06 (RIGHT): slams 10-20 lb (slam ball), overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients; 'I don't think there's any need for anything more than 20 lbs.'; ATH-05: 'If you're a bodybuilder, you don't need to do med ball throwing. That might be something for warming up'; LIB-06: 'No levels in throws, just do them right'; 'this but hugging a light medball' (MM 05 K13); cheat-sheet dose '1' x '10' (BA A53:B71) | Light ball, maximal speed. No mass is written in any cell (0 lb/kg cells in both workbooks). | passes and rotations 8-10 lb (chat); overhead throws 6-10 lb; sit-up throws 6-8 lb; slams 10-20 lb; youth and older clients lighter; never above 20 lb (heavier only for specific work such as a heavy medball hang clean or wall balls); no levels (LIB-06) | `medball_lb` by throw type and person (LV-3); no throwing block for aesthetics / bodybuilding goals (warm-up only, ATH-05) | medball (+ wall or partner) | COACH-ANSWER EQ-06, ATH-05, LIB-06 + COACH-CHAT |
| V21 | **Conditioning: duration x work:rest x pace** | Blue 'A' 'Short Duration ' / 'High Intensity'; Green 'B' 'Moderate Duration' / '1:1 Work:Rest', '1:2', '1:3'; Orange 'C' 'Long Duration' / 'Low intensity' (AE A24:C41; letters A24/B24/C24); '***Never do the same color workout in the same week...' (AE A5); ATH-07: 3 aerobic sessions a week for general/fat-loss clients, 2 for athletes in season, 4 for aesthetics/bodybuilders, plus long walks after workouts; EQ-14: any erg; calories, time or distance; ORD-09: fighters' cardio-first blocks are real aerobic work | Its own variable set (owned by 03 section 7 / 06 L13). The one place he REQUIRES weekly variety. | C -> C+B -> C+B+A -> lactate clearance | see 03 section 9.12; `aerobic_sessions` 3 / 2 / 4 by goal (ATH-07); any erg, tracked by calories, time or distance (EQ-14); with 4 sessions one of the 3 colours must repeat, against AE A5 'Never do the same color workout in the same week' (the answer wins; which colour repeats is open in 03 and 05); the DISTANCE TEST '21.6 mile run' is what the coach calls a marathon (LIB-18: "dont know when/where we need that"); a marathon is 26.2 mi, so the label is flagged and the test is left out until he places it (PROPOSED) | running space or any erg | OBSERVED + COACH-ANSWER ATH-07, EQ-14, ORD-09, LIB-18 |
| V22 | **Bilateral : unilateral volume balance** | UNI-02: 'A powerlifter or bodybuilder needs to get bigger and stronger... the unilateral stays at the beginning just as a small foundation, maybe 50. It then turns more into an 80/20 or 90/10'; 'If it's a tennis player... [unilateral] can be more like 80% or 90%... because I don't want them to lose their rotational forces and skills'; 'It should be a range anywhere from one side, like 90/10, to the other side, 10/90'; 'sometimes the athletes might have some type of pain or some type of injury... we need to adjust accordingly'; 'the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces'; UNI-03 (same answer for the upper body); UNI-10: 'keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season'; '*LUNGES are a UNILATERAL KNEE DOMINANT MOVEMENT' (LU A3); 'When there are joint pains, usually going unilateral...' (MM 05 A6) | A slider from 90/10 to 10/90 (bilateral/unilateral share of lower-body knee- and hip-dominant compound sets; the same logic for upper push/pull), set by athlete type, goal, phase and pain. Bilateral = the driving force (bigger and stronger); unilateral = the health and rotational foundation. His written programs mostly sit near 50 % (3.7), which is the start of a bodybuilder's block and the general default; field/COD athletes sit at 10-20 % bilateral. | 90/10 (powerlifter/bodybuilder at the peak) -> 80/20 -> 50/50 (block start, general, beginners) -> 40/60 (sprinters, combat) -> 20/80 (COD athlete off-season) -> 10/90 (COD athlete in season); pain shifts it toward the pain-free side | `bilat_share_target[profile][phase]` (lower and upper, 3.7), coach-adjustable slider; new sets go to the side that is more than 3 points below target (3.6); at a block boundary a stance change may swap a lift's laterality to reach the target (PER-02) | none (most library lunges name no implement and can be done with body weight) | COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13 + OBSERVED shares; numbers he did not give PROPOSED |
| V23 | **Exercise level (derived)** | CAT-04 (skill + stability + load position; machines/cables easier); CAT-05 'The levels are still very theoretical, so we don't need to rely heavily on them'; CAT-06 client level and exercise level are separate; library row 3 'ZONE' labels 'EASY' / 'MODERATE' / 'HARD' / 'ADVANCED' / 'FOUNDATIONAL' / 'ANY' (LIB C3:Z3; 'HARD' at Q3); LIB-13: 'push press is easier, push jerk is more technical but its more intermediate/advance'; EQ-04: foundational older or injured clients may use the machines filed MODERATE/ADVANCED; LIB-06 / LIB-08: no levels on throws or GHD | A property of each exercise, not of the client. Levels add options; they never remove lower-level exercises. | FOUNDATIONAL / EASY -> MODERATE / INTERMEDIATE -> ADVANCED / HARD | `exercise_level_score = f(skill_demand, stability / constraint_level, load_position)` (INFERRED); used to rank and to size a between-block step, never to gate ('the levels are still very theoretical', CAT-05); no level on throws or GHD (LIB-06, LIB-08); leg extensions and leg curls are available at every level (LIB-15) | n/a | COACH-ANSWER CAT-04, CAT-05, CAT-06, LIB-13, EQ-04, LIB-15; formula INFERRED |
| V24 | **Pairing: same / cross pattern, anterior / posterior** | UNI-06: 'This is a rule by goal. If I want them to be in a bootcamp, for example, I don't want them to get too sore so they can do the bootcamp more often. If they are a high-level athlete... I have to make sure I drive a lot harder into that muscle'; UNI-11: 'If I'm doing the back of my lower body, then the opposite would be the front of my upper body. That'll allow me to keep as far away as I can from bleeding over problems'; ORD-06: 'hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps' | Two linked choices. Lower pairing by goal: same pattern (squat + lunge) to drive one muscle harder; cross pattern (squat + single-leg hinge) for less soreness. Upper pairing is fixed: posterior lower (hip dominant) with anterior upper (push), knee dominant with pull, so paired work does not bleed over. | cross pattern (bootcamp, general, fat loss, athletes by default, in season) <-> same pattern (aesthetics, bodybuilding, strength, athletes who need size) | `lower_pairing` in {same, cross} by goal (05 4.2); `upper_pair` = push for hip-dominant, pull for knee-dominant (hard rule R9); supersets use these pairs (V07) | none | COACH-ANSWER UNI-06, UNI-11, ORD-06 + OBSERVED (R9, N3) |
| V25 | **Axial (spinal) loading exposure** | PER-04: 'I ideally don't want... to have them squat twice a week... I can do one day of squatting and the other day of leg pressing. I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well'; EQ-11: 'Belt squats are for people that you don't need to load them axially... If you have an athlete that already has been loaded on their back that week... switch over to the belt squat' | A property of each lift (does the load compress the spine?) and a weekly budget. One axial squat a week; the other squat exposure is leg press or belt squat; deadlifts also load the spine, so the team reads it as one axial hinge a week (INFERRED, as in 05 6.4). | non-axial (leg press, belt squat, hip thrust, back extension, reverse hyper, GHD, cable pull-through) -> axial (barbell squats, barbell or trap-bar deadlifts and RDLs, good mornings); hack squat and pendulum unclassified (shoulder pads) | `axial` true/false per exercise; weekly check: <= 1 axial squat + <= 1 axial hinge exposure (05 6.4); a sore or already-loaded athlete swaps to the belt squat (EQ-11) | leg press or belt squat for the second squat exposure (bodyweight / DB unilateral work at home) | COACH-ANSWER PER-04, EQ-11; one-hinge reading and lift list INFERRED |

### 1.4 Notes the table cannot hold

**V01 Load.** He never prescribes an absolute load. Load follows the rep bracket and the effort target ('The lower the reps, the higher the weight', MM 00 A6). Percentages appear only for barbell main lifts and Olympic lifts (the STRENGTH-12 header 80 → 90 %, 4T O3:T3; the Olympic ramp 75 → 90 % with 4 x 8 → 4 x 4, confirmed in PER-09), speed work ('about 60-70%') and contrast (~78-85 %, ATH-12). Load and volume load are tracked, never driven by a percentage (VOL-04). A client's preference ('lighter, more sets' vs 'heavier, fewer reps') moves the rep range on the big compound lifts only (VOL-12). The BYOP log column 'WEIGHT USED or SCORE' (JL H2) is free text; the generator needs a numeric `load_kg` plus a `notes` field (INFERRED); SCORE = times, rounds or distances (PRG-08).

**V02 Speed/intent vs V03 tempo.** "Speed" has two senses in his sheets: intended concentric velocity ('FAST', 'max speed', 'powerful turns') and cadence ('slow', 'ECCENTRIC SLOW', 'Hold for 3 seconds'). They are stored separately. SCIENCE says intent matters as much as actual speed [S37][S38], so every concentric phase is cued "as fast as you can". Only the eccentric is slowed on purpose, e.g. 'slow eccentric deficit Lunges (no weigths)' (MM 02 EL52), his own home-client tool (10b TEMPO-3). Tempo defaults stay open (open question 14).

**V04 ROM.** Full ROM on isolation and machine work ('FULL RANGE OF MOTION', MM 07 L14); mid or partial range on fast and strength work ('1/4 SQUATS', boxes, hang positions); lengthened range as a progression ('Deficit', 'Elevated Push ups (for full ROM)'). SCIENCE: full ROM is the safe default [S64][S65]; hypertrophy partials belong at the lengthened end [S66][S67]; mid ranges transfer to jumping and sprinting [S71]. ROM is one of the coach's named between-block variables (PER-02). What 'mid ranges of motion' means is open question 13.

**V06 Volume counting (COACH-ANSWER VOL-09, VOL-10, UNI-01, UNI-07, LIB-14, LIB-16, CAT-09; full map in 3.2).**

* 1 hard set = 1.0 to the main mover and **0.25** to each helper (v0 used 0.5): "I would suggest a 0.25 to the helpers, not a 0.5." One PROPOSED exception, inherited from 12: glutes get 0.5 on hip-dominant lifts as a co-mover of hip extension (3.2; open question 5).
* Dips 0.5 triceps + 0.5 chest ("more tricep than chest but still .5 and .5"); thrusters 1.0 quads + 0.5 shoulders.
* Leg curls, nordics and slider curls credit hamstrings 1.0 in the LEG FLEXION segment, never hinge volume (CAT-09). Leg extensions credit quads 1.0.
* A unilateral '10/10' = 10 per side = **one** set, counted "mostly for quads" on lunges. Alternating lifts count like unilateral ones.
* Plyos, Olympic lifts, sprints, throws and COD **never** count toward muscles: "counting towards muscles is more for resistance patterns, not for athletic patterns." They have their own budget (contacts, throws, reps, meters).
* The engine stores the Pelland count (indirect 0.5) beside the coach count for later research comparison (12 3.1, PROPOSED). Example A shows the difference is largest for glutes.
* Reps are stored as text: Sheets turned '12/12', '8/8' and '6-8' into dates in many cells. '12/10/8 -20' = a pyramid (12 mid weight, 10 heavier, 8 heaviest) then a light 20 (PRG-07).

**V08 Effort.** RIR is his scale; RPE is shown alongside (VOL-13). Targets: compounds 1-3 RIR ('leave 1 in the tank'); small-muscle and bodyweight work may go to 'MAX' (technical failure) on the last set; MYO only on the last machine or isolation exercise (VOL-15); speed work RPE 6 ('FAST RPE6'); plyos 'EASY'; deload 3+ RIR. The client's EFFORT scale ('8 - That was perfect' = bullseye) drives the readiness gates (3.5).

**V09 Frequency.** Default 2 exposures per pattern per week; the second exposure is a different exercise of the same category (PER-04) and, for squats and hinges, the non-axial one (V25). PPL can run on any 3 days (PRG-02). Aerobic sessions a week: 3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders, plus walks after workouts (ATH-07).

**V10 Selection.** The coach-native swap ladder, from his own "X or Y" cells, minus every band option (EQ-01, EQ-07, EQ-08):

1. machine ↔ DB ('machine rows or db rows', 16 cells; 'Machine Dips or dips' x20);
2. barbell ↔ DB ('Deadlifts (DB or Barbell)');
3. pull-up ↔ pulldown ↔ assisted pull-up **machine** (his 'banded assisted pull ups' option is removed);
4. cable → bodyweight ('HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row', MM 05 C16, without the band row);
5. missing machine → +2 sets of the free-weight lift ('leg press or just add 2 more rounds to front squats', 4T W42);
6. no leg extension / leg curl machine → sissy squats; nordics, slider or swiss-ball curls (EQ-08, no banded leg extension);
7. no medball → plyo push-ups, fast cable rotations or the 'fake medball slam' (EQ-07; band chops are "worthless").

Machines are not ranked against each other ("they have different brands, angles", EQ-11). Hack squat and leg press are more constrained than a Smith machine; the belt squat avoids axial loading; GHD and reverse hyper if available and the client feels the right muscles. Older, injured and high-volume clients collect volume on constrained machines and never get overhead squat, snatch, low-bar squat or depth jumps (EQ-03). The client's preference may choose between alternatives (EQ-10). The constraint scale 1-5 is approved (EQ-13).

* **Default and swaps (GEN-04, RIGHT).** Every slot gets a default exercise plus a dropdown of swaps inside the same category.
* **Unnamed implement (EQ-09, RIGHT).** When the name carries no implement ('lunges', 'deadlifts', 'rows', 'calf raises'), the default climbs bodyweight → DB → barbell as the client's level rises, limited by the equipment the client has.
* **Seated machine press (EQ-05, RIGHT).** VERTICAL PUSH gets a seated machine shoulder press for older and injured clients (constraint 5).
* **No V-squat (GEN-08, RIGHT: 'no V-squat' is one of his hard rules).** Not ranking machines (EQ-11) does not bring it back: the V-squat is never offered ('V-SQUAT' "DON'T LIKE IT", "I don't presercibe the use of these, ever.", SQ G39:I39).

**V14 Load laterality (CAT-13).** His mechanism, in his words: with a contralateral load "I'm getting help being pulled into the hip, and then I have to create forces away from the hip"; with an ipsilateral load "that right hand is going to help me get pulled out of the hip". Use cases are in 3.7 (table "Inside the unilateral share"). The sheet ladder is 'GET INTO THE HIP VARIATIONS - MODERATE' 'Contralateral loading ' / 'GET OUT OF THE HIP - MODERATE' 'Ipsilateral loading ' / '- HARDER' front-racked versions (RP C19:C26), and 4 TRACKS rotates it week to week: 'FFE CONTRA LUNGES' → 'FFE IPSI LUNGES' → 'RFE CONTRA LUNGES' → 'RFE IPSI LUNGES' (4T E38:H38). Whether contra vs ipsi should come from a hip-range screen or from the sport alone is open question 8.

**V18 Core segment (CAT-08).** Three segments: the trunk moves on a still pelvis ('CORE THORAX'), the pelvis moves on a still trunk ('CORE PELVIS'), or both ('BOTH'); each in any plane ('TRANSVERSE', 'SAGITAL', 'FRONTAL'), static or dynamic. Toes-to-bar and Copenhagen planks are "a little bit more complicated" and are tagged `both`. **Position (ATH-11, NOT RIGHT to v0):** about 2 core exercises open every session as part of the warm-up; the user may move the block after the plyos, after strength or to the end. Some athletes need more rotational core (VOL-17).

**V22 Bilateral : unilateral.** Section 3.7 gives the profile table, the observed shares and the placement rule. UNI-04 (RIGHT, "yes and no"): unilateral lifts default to moderate-to-high reps per side ('8/8'-'12/12'); heavy low-rep unilateral work is an option the athlete or coach can switch on. UNI-05: unilateral progresses like bilateral. UNI-08 (PARTLY): when pain moves a lift to unilateral, keep the sets "ideally, but you have to adjust accordingly". UNI-09 (PARTLY): unilateral work takes longer and "has to be accounted for" (time model: 1.5 x a bilateral set, PROPOSED).

**V24 Pairing (new).** Lower pairing is a rule by goal (UNI-06): same pattern (squat + lunge) drives one muscle harder for high-level and aesthetics clients; cross pattern (squat + single-leg hinge) keeps bootcamp and general clients less sore so they can train more often. Upper pairing is fixed (UNI-11, ORD-06): "If I'm doing the back of my lower body, then the opposite would be the front of my upper body. That'll allow me to keep as far away as I can from bleeding over problems." Hip dominant + push, knee dominant + pull, for full body and bootcamps; the Bootcamp 1 Tue/Fri crossing was "not intentional".

**V25 Axial loading (new).** A property of each lift (does the load compress the spine?) and a weekly budget: at most one axial squat and one axial hinge exposure a week (PER-04, as read in 05 6.4). Axial lifts (INFERRED list, 05): barbell back / front / high-bar / low-bar / zercher / overhead / Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Non-axial: leg press, belt squat, hip thrust, glute bridge, back extension, reverse hyper, GHD, cable pull-through, KB swing (non-axial hinge pool PROPOSED in 05). Hack squat and pendulum load the spine through the shoulder pads and stay unclassified. Single-leg and staggered-stance DB deadlifts are treated as non-axial here (INFERRED; open question 4).

---

## 2. The load-velocity trade-off: rule set

### 2.1 What the coach says and writes

* COACH-CHAT: "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster that I can be." "If an athlete wants to go faster, then you don't need a lot of weight." "You need to understand everything that has to do with the quality of the movement as much as the quantity."
* OBSERVED (SQ A44:A48): 'HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS'; 'LIGHT BARBELL ' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT'.
* OBSERVED: 'FAST RPE6 or about 60-70%' (4T N17), applied to barbell lifts and to 'LEG PRESS' (4T O17); 'Front squats - light weights - same speed for all reps' (MM 02 BU33).
* OBSERVED (BA A22:D23): 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' / '*I USE THESE FOR MUSCULAR FORCE PRODUCTION'; 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' / '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'.
* COACH-ANSWER ATH-01 / CAT-10: "The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement"; programs "start ... with more ballistic movements, and then slowly and gradually we go into more plyometric movements". EQ-06: medballs never above 20 lb. EQ-15: loaded jumps 10-20 % of body weight, too heavy when jump height or speed clearly drops. PER-09: Olympic lifts 75 → 80 → 85 → 90 %.
* OBSERVED record only (EQ-12, "No variable resistance should be available in this for now"): 'Bands are designed for speed/velocity' at 'around 50% so you can move fast' (SQ C35/B36); 'BOTTOM CHAINS' '*INTENSIONALLY SLOW YOU DOWN', 'Weght can be moderate around 70%' (SQ A39, A40, B40).
* SCIENCE: bar velocity vs %1RM R² ≈ 0.98 [S35]; load-velocity profiles [S36]; velocity specificity [S40]; intent [S37][S38]; velocity loss [S39]; fast SSC < ~250 ms ground contact (12 2.10).

### 2.2 The continuum: lightest/fastest → heaviest/slowest

Coach examples and the load as written are OBSERVED. The science load range comes from [S34]-[S47] (10b FV-4). Dose and stop rules are INFERRED unless a coach answer is cited. Zone Z-F (chains) is retired.

| # | Zone | Coach examples (OBSERVED) | Load as written | Load range (SCIENCE) | Reps x sets (INFERRED) | Stop rule (INFERRED, section 6) |
|---|---|---|---|---|---|---|
| Z-A | Max velocity / reactive (no external load) | ' Max velocity running (top speed)' (LIB G128); '✅ Squirrel jumps' under '*FASTEST SSC*' (S23 B43:B44); 'REBOUNDING ' repeats (reverse-banded hops are out, EQ-01) | body mass or less | body mass | contacts 5-10 x 2-4; sprints 10-30 m x 3-6 | contact lengthens, height drops, heel lands |
| Z-B | Starting strength / speed (light implement) | medball 'Chest pass', 'Overhead throw', 'Rotational Scoop R' (BA C53, C54, C57), dose '1' x '10' (BA A53:B69); COD 'EASY TURN' -> 'HARD TURN' (LIB L5 / N5) | 'light medball'; passes/rotations 8-10 lb (chat); overhead 6-10 lb, sit-up 6-8 lb (EQ-06) | 2-4.5 kg ball by throw type [S48]-[S54] | 1-2 x 10 per side | throw slows, head drifts, spine side-bends [S54] |
| Z-C | Speed-strength (loaded jumps, light ballistics) | 'Hex bar squat jumps', 'DB Squat Jumps' (MM 02); 'Really high jump squats LOAD & jump hard' (MM 05 C14); 'WEIGHTED STICK THE LANDING' (BA A30) | unspecified DBs / hex bar | body mass to ~30 % 1RM; hex ~20 % squat 1RM [S43][S45]; DB jumps 10-20 % BM (COACH-ANSWER EQ-15) | 3-6 x 3-5 | jump height drops |
| Z-D | Strength-speed (dynamic effort, KB ballistics, Olympic derivatives) | 'FAST ...' lifts @ 'FAST RPE6 or about 60-70%' (4T N17); 'Russian kb swing' / 'American kb swing' ('SPEED SPECIALS', RP A77:A79); hang pulls; box squats 'Touch and Go fast' without bands ('BOTTOM BANDED' ~50 % is OBSERVED only, EQ-12) | %, RPE 6 | 40-65 % [S95][S101] | 2-3 x 6-10 | first slower rep ('same speed for all reps') |
| Z-E | Accelerative strength (Olympic lifts, heavy-fast) | 'Hang cleans @ 75%' -> '@ 90%' (MM 02 OLY rows; PER-09 RIGHT: 75 -> 80 -> 85 -> 90 % with 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4); 'Power Clean' (JL E7) | % | 60-80 % (HPC peak power 65-80 % [S46]) | strength-focused plans: 4 x 8 -> 4 x 4 at 75-90 % (PER-09); power-focused athletes: 3-4 x 2-5 with the speed-loss stop (INFERRED, open question 1) | speed loss or catch position breaks |
| Z-F | Stiffness / magnitude (chains) - RETIRED (EQ-12) | 'BOTTOM CHAINS' ~70 %; 'HEAVY CHAINED DEADLIFT' (4T H9) | % | >= 80 % total load for a strength effect [S94] | 3-5 x 1-5 | not generated in v1 (no variable resistance) |
| Z-G | Contrast heavy member | '78% of 1RM whatever squat immediately into tuck jumps...' (SQ I18); '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (MM 07 L22); ATH-12 (RIGHT): intermediate+ athletes, off-season, ~78-85 %, no rest inside the complex | %, 'Heavy' | 78-85 % [S60] | 2-4 heavy + 5 jumps x 3-4 rounds | jump quality |
| Z-H | Absolute strength | 'the work' '1RIR' (4T M9/D9); 'DEADLIFTS (1RIR)' (MM 05 J15); STRENGTH menu 5x3 ... 8x2 (SQ D15:E26) | 1RIR, %, HEAVY | >= 80-85 % | 3-7 x 1-6 | RIR 1-2 |
| Z-I | Hypertrophy compounds | '1-2 RIR' 12/10/8 (4T col D, O32); SQ hypertrophy menu 3x15 ... 5x8 | RIR | ~65-80 % | 3-5 x 6-15 | RIR 1-2 (free weight); 0-1 on machines, last set |
| Z-J | Local-fatigue machine and isolation | 'LEG PRESS' 'LOVE IT' ('local fatigue ... not have so much systemic fatigue', SQ H35/I35); 'MYO SET' '15/5/5/5/5/5' (SQ B27); 'MAX REPS'; VOL-11: 40-rep sets only as a CrossFit / AMRAP option | MAX / ALL / MYO | 30-70 % near failure [S19] | 2-3 x 15-30 / MYO | MYO only on the last machine or isolation exercise (VOL-15); MAX = technical failure only on small-muscle or bodyweight work (VOL-13) |

### 2.3 Intent → load, by library category (the categories the generator fills)

Profile counts are OBSERVED tags from `lib_athletic_core.json` and `lib_resistance.json`; the mapping is INFERRED unless a coach answer is cited.

| Library category (coach label) | Velocity profile of its items | Default implement | Default load | Intent cue | Coach anchor |
|---|---|---|---|---|---|
| 'PLYOS' (LIB G) | 33 reactive; 4 DB-loaded jumps only in ADVANCED (G136:G139) | body weight; box/plates/hurdles as targets | none; DB ~10-20 % BM only at ADVANCED | 'BE REACTIVE & BOUNCY'; method stage RC1 -> RC3; bilateral before unilateral (CAT-10) | BA D22 |
| 'JUMPING ANKLE' / limited knee (LIB C126:C136, G46:G57) | reactive, low amplitude | body weight; plates | none | stiff, short contacts | 'Bigger plates start at lateral bilateral plate hops' (G53) |
| 'THROWING' (LIB K) | 20/20 speed-strength, all medball | medball | passes/rotations 8-10 lb, overhead 6-10, sit-up 6-8, slams 10-20, never > 20 lb (EQ-06); no levels (LIB-06); none for aesthetics (ATH-05) | 'BE EXPLOSIVELY & FAST' | BA A22; MM 05 K13 |
| 'CHANGE OF DIRECTION' (LIB L) | 9 starting strength/speed | none | none | proactive COD before reactive agility; the route names (FADE, SLANT, POST ...) serve every athlete, tiered by turn angle easy / moderate / hard (ATH-06, RIGHT) | LIB L5 'EASY TURN' -> M5 'MOD. TURN' -> N5 'HARD TURN'; AGILITYCOD D2 'COD: Proactive in nature - Cognitive Competence' vs D1 'Agility: Reactive in nature - Incognitive Competence' |
| 'TRIPPLE EXTENSION' (LIB C) | 33 items: 16 strength-speed, 11 reactive (ankle hops C126:C136), 3 speed-strength, 3 starting strength/speed | BW -> 'Weighted' -> hex bar -> barbell pulls -> power/full lifts ('Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk', LIB-07); everyone in athletic training: L1 DB/KB snatch, hex-bar jumps, hang pulls/cleans; intermediate and up (L2-L3) the full scope (ATH-10) | heaviest load that keeps the movement fast; Olympic % ramp 75 -> 90 (PER-09) | heavy-but-fast | S23 B2:D7; MM 02 OLY rows |
| Box-squat speed methods (LIB AI91:AI96) | strength-speed | barbell + box; no bands (EQ-01, EQ-12) | 50-60 % | 'Touch and Go fast' | SQ B36/C35 |
| KB swing ('SPEED SPECIALS') | strength-speed / speed-strength | KB | moderate KB | hip snap | RP A77:A79 |
| Bilateral KD/HD main lifts | absolute / accelerative | barbell, hex bar, leg press / belt squat; front-loaded before back-loaded by level (CAT-04); one axial squat + one axial hinge a week (PER-04) | RIR 1-3; athletes by block VOL 1 12-15 -> VOL 2 8-12 -> VOL 3 6-8 reps (PER-11); aesthetics 8-15; a client's preference moves the reps on big compound lifts only (VOL-12) | max intent, controlled eccentric | 4T col D; JL G8 '6 to 8 Reps' |
| Resistance patterns (UKD/UHD/H/V push-pull) | 259/283 library entries controlled tempo | DB/cable/machine by constraint preset | RIR 1-3, 8-15 reps (unilateral '8/8'-'12/12'; heavy low-rep unilateral as an option, UNI-04) | max intent concentric | MM 00 A6 |
| LEG FLEXION (knee flexion: leg curls, nordics, slider curls; CAT-09) | isolation-type flexion segment | machine ('Seated leg curls' / 'Lying Leg Curls', LIB AR9:AR10); at home 'Supine Glidder hamstring curls' (AN18), 'swiss ball hamstring curls' (AN19), 'Nordic Curl' (AN91) | '15 Reps'-'20 Reps', last set 'MAX'; nordics by eccentric control | controlled, full ROM, lengthened bias (seated > lying [S69]) | LIB AR7:AR10; 9 knee-flexion items the library files under 'BILATERAL HIP DOMNANT' (AN15, AN17, AN18, AN19, AN50, AN54, AN91, AN100, AN101); Sheet25 H11 |
| Isolation (LEG EXTENSIONS, arms, delts, calves) | isolation | machine/cable/DB | small muscles 12-30 reps (VOL-11), 'MAX' on the last set of small-muscle work (VOL-13), MYO last (VOL-15); calves 3 sets every leg day, rear delts their own sets (VOL-17) | controlled, full ROM, near failure | LIB AW13:AW14; 4T W61 |
| Core ('CONTROL') | n/a; both 'powerful turns' and 'slow' written | body weight; cable/medball/plate | 'heavy plate russian twists' (MM 02 I48) | first in the session (ATH-11), about 2 exercises (VOL-17); segment- and plane-specific (CAT-08) | CONTROL PATTERNSCORE grid |

OBSERVED corroboration that load follows intent: in the filled BYOP slots reps rise with constraint (Spearman 0.72 over 21 slots); in the MASTER MODEL fast or ballistic intent is 44 % of athlete lines vs 2 % of gen-pop lines (`prog_mm_equipment`).

### 2.4 Rules (LV-x)

| ID | Rule | Status |
|---|---|---|
| LV-1 | Every slot carries a velocity zone (Z-A ... Z-J) before it carries an exercise. Choose the heaviest implement that does not slow the intended movement. If the client's implement would slow it, drop the load or move one zone down the continuum. | COACH-CHAT + OBSERVED SQ A44:A48; wording INFERRED |
| LV-2 | Speed goal -> light implement + maximal intent. Never pair a speed cue with a heavy load except inside a contrast station (LV-6). | OBSERVED 'light weights - same speed for all reps' (MM 02 BU33), 'FAST RPE6 or about 60-70%' (4T N17); SCIENCE [S37][S40] |
| LV-3 | Medball mass by throw type (EQ-06, RIGHT): upper-body passes and rotations light, 8-10 lb (COACH-CHAT); overhead throws 6-10 lb; sit-up throws 6-8 lb; slams 10-20 lb (slam ball); youth and older clients lighter; never above 20 lb except for a specific heavy-medball skill (hang clean, wall balls). Quality gate: slower throw, head drift or spine side-bend -> 2 lb lighter (QM-6). Dose 1 x 10 per throw (1 x 20 sit-up throws); the 'ALL LIST' is one pass of 1 x 10 through every throw (LIB-22, RIGHT). No throwing block for aesthetics or bodybuilding clients; warm-up only (ATH-05). Throws have no levels (LIB-06). | COACH-ANSWER EQ-06, ATH-05, LIB-06 + COACH-CHAT + OBSERVED dose BA A53:B71; quality gate SCIENCE [S54] |
| LV-4 | Speed sets end when speed drops ('same speed for all reps'). With no device: stop at the first visibly slower rep. Olympic lifts in strength-focused plans follow the coach's ramp 75 -> 80 -> 85 -> 90 % with 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4 (PER-09); the speed stop can end a set early. For power-focused athletes the generator caps Olympic sets at 2-5 reps (INFERRED; open question 1). Loaded jumps and dynamic effort 3-6, plyos 5-10 contacts, throws 5-10. | COACH-ANSWER PER-09 + OBSERVED MM 02 BU33 + SCIENCE [S39]; power-athlete cap INFERRED |
| LV-5 | RETIRED in v1. Accommodating resistance (bottom bands, reverse bands, chains) and weight releasers, including the DB drop-release jump ('BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP', BA C40), are not generated. The sheet's diagnosis rule (SQ A35:D41) is kept as OBSERVED record for a later version. | COACH-ANSWER EQ-01, EQ-12 ('No variable resistance should be available in this for now') |
| LV-6 | Heavy and fast meet only in contrast: heavy squat 78-85 % x 2-4 -> tuck jumps x 5 -> DB squat jumps (10-20 % BW, EQ-15) x 5 -> squirrel jumps x 5 (MM 07 L22), no rest inside the complex, 3-5 min between rounds. Intermediate+ athletes, off-season. The heavy squat counts as the week's axial squat (V25, INFERRED). | COACH-ANSWER ATH-12, EQ-15 + OBSERVED SQ I18, MM 07 L22/L46, MM 05 C17; SCIENCE [S60][S61] |
| LV-7 | Concentric intent is always maximal. Eccentric speed by zone: natural/fast on athletic work, ~1-2 s on strength, 2-3 s on hypertrophy. Never a slow eccentric on throws, jumps, Olympic or dynamic-effort work. Total rep <= ~10 s. | SCIENCE [S98]-[S100]; OBSERVED 'ECCENTRICFAST' / 'ECCENTRIC SLOW' (SQ A48/A45) |
| LV-8 | Load-prescription format follows the implement: % for barbell main lifts, Olympic lifts and speed work; RIR for every other resistance exercise; words ('EASY', 'LOAD & jump hard') for plyos and jumps; mass for medballs. Never kg for DBs: prescribe by RIR and log the weight used. | OBSERVED (prog_mm_equipment section 7) |
| LV-9 | Each lower pattern may get one speed exposure and one strength exposure per week in athletic plans (same slot, different quality, e.g. BASEBALL 'Speed' Monday / 'strength' Tuesday), but only one of them may be axial (PER-04): the other is a belt squat, leg press, hex-bar jump, loaded jump or KB swing. The 'Athletic Performance - Non-Competitive' tab's 'Front Squats' Monday (JL E8) + 'Low Bar Back Squat' Thursday (JL E35) is no longer reproduced. | OBSERVED BASEBALL day tags; JL E8/E35; COACH-ANSWER PER-04, EQ-11; the speed/strength split INFERRED |
| LV-10 | Load-velocity sets the rep ceiling: no set in zones A-E goes past the speed-loss stop; hypertrophy and isolation sets (Z-I, Z-J) are RIR-bound instead. | INFERRED from LV-4 + 03 section 5 |
| LV-11 | Older and frail clients get velocity work as a fast concentric on constrained machines at 40-60 % 1RM, few plyos unless they ask for them, and never overhead squat, snatch, low-bar squat or depth jumps. | COACH-ANSWER ATH-09, EQ-03; SCIENCE [S12][S41] (10b FV-9) |
| LV-12 | Everyone in athletic training gets Olympic work (ATH-10). No barbell or a beginner means a zone shift, not a missing quality: full lifts -> hang power -> hang pulls/cleans -> hex-bar jump -> KB swing/clean -> DB/KB snatch -> 'BodyWeight Squat to calf raise' (LIB C9) or broad jump. L1 and beginning intermediates ("hang cleans and just these things without bumpers"): DB/KB snatches, hex-bar jumps, hang pulls/cleans; intermediate and up (L2-L3, "the more intermediate plus and advanced and pros"): the full scope, from hang power versions to the full lifts named 'Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' (LIB-07), climbing the skill ladder of QM-8. Youth may lift from the floor (ATH-09). Flag `zone_shift` to the client. | COACH-ANSWER ATH-10, ATH-09, LIB-07 + OBSERVED library behaviour; SCIENCE [S43][S45][S47]; v1 verification: the earlier 'L2+ hang power, L3 full lifts' split held the full lifts back from intermediates, against ATH-10 (I14) |
| LV-13 | Heavy loading lives in the position the client owns: absolute and accelerative work defaults to front-loaded or on-the-body positions (hex bar, goblet, zercher, front squat; horizontal press and row) and moves to back-loaded or overhead positions only when level and posture allow. Horizontal (zone 2, 'safer for you when you push and pull') carries the heaviest upper-body loads. | COACH-ANSWER CAT-04, CAT-10; rule wording INFERRED |
| LV-14 | Plyo vs ballistic mix by ground-contact time: sports with long ground contact (karate, boxing, wrestling, baseball) get more ballistic work; short-contact sports (sprinters, jumpers) more plyos; basketball and volleyball a mix. Every block starts more ballistic and ends more plyometric. Share table by sport in 12 3.13 (e.g. basketball 45 % -> 60 % plyo sets; PROPOSED). | COACH-ANSWER ATH-01, ATH-02, CAT-10; SCIENCE (fast SSC < ~250 ms); shares PROPOSED |

---

## 3. Weekly volume progression (restated from `12_volume_algorithm_v1`)

**12 is the authoritative engine.** This section states the rules as variables-model rules and shows them on two clients; every number in 3.4, 3.12 and 3.13 was computed with 12's reference prototype (`vol_engine_v1.py`, imported unchanged). The research charts the coach asked for ("go find charts ... and match them with my experience", VOL-01) are in 12 section 2: his beginner 10-12, intermediate 15-20, growth 20-25 and priority cap 25-30 all sit inside the published dose-response ranges (Schoenfeld 2017, Baz-Valle 2022, Pelland 2026, RP landmarks), and the tool is designed to learn from users' data later (12 3.14).

### 3.1 What the coach answered vs what the sheets show

| Source | Content |
|---|---|
| COACH-ANSWER VOL-04 (RIGHT) | The 3/5/7 % is "of weekly sets per muscle (your chest example: 20 → 22 sets at the same load)". Load and volume load are tracked, not driven by percentages. |
| COACH-ANSWER VOL-05 | "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person ... they're going to have to somehow be able to adjust accordingly, or their coach to adjust accordingly." |
| COACH-ANSWER UNI-05 | "The progressions might be 3%, 5%, depending on ... how tired they are, and a lot of things, but it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program." Unilateral progresses like bilateral. |
| COACH-ANSWER VOL-06 (RIGHT) | Bank the fraction, add a whole set at 1: "you round up, you round down. That's fine. But I don't really need them to be figuring out the percentages. I need this tool ... to figure out the percentages." |
| COACH-ANSWER VOL-07 | "Usually, I have about 3 to 4 exercises per muscle group per day ... if there are 3 exercises and I need to add an extra set of volume, then I add it to the first exercise on the list ... 2 sets of 1, 2 sets of 2, and 2 sets of 3. The next week would be 3 sets of 1 ... I'm adding sets to the things that matter most." Small muscles at the end of a session: "we need to get more bicep done as a bonus exercise". |
| COACH-ANSWER VOL-01, VOL-02, VOL-03, UNI-01 | Start beginner 10-12, intermediate 15-20, advanced 20+; "15 to 20 sets ... a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation"; 40 sets of chest "way too much", 5 "too little"; priority +4-6, cap about 25-30; pain -30-50 %, machines, "maybe even drop the exercise altogether". |
| COACH-CHAT (earlier) | "~15-20 sets/muscle/week baseline ... weekly ramps ~3/5/7 % depending on muscle size". **The size part is superseded by VOL-05.** |
| OBSERVED (06 section 2.3) | No % anywhere in the sheets. Sets are integers added as +1 set per exercise every 2-3 weeks: AESTHETICS-8 2, 3, 3, 3, 4, 4, 5 (4T E32:K32); AESTHETICS-12 3, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 5 (4T O31:Z31); STRENGTH-12 4, 4, 5, 5, 6, 6, 3, 5, 6, 6, 7, 7 (4T O5:Z5); HYBRID 2, 2, 2, 3, 3, 3, 4, 4 (4T E71:L71). Long-run averages +4.75 %/week (AESTHETICS-12), +5.2 % (STRENGTH-12), +5.3 % (FAT BURN): inside his 3-7 %. |
| OBSERVED (BOXING) | One exercise list for weeks 3-8 (column L); only the weekly SETS columns change. Weekly totals 66, 66, 69, 69, 62, 76 (MM 07 E7:J48). |

### 3.2 Unit and accounting

**Primary unit:** weekly hard sets per muscle: working sets at 1-3 RIR with 5-30 reps (VOL-13); warm-up sets and A-drills never count (ORD-08); a MYO set counts 2 (INFERRED; last machine or isolation exercise only, VOL-15). The credit map below is copied from `12_volume_algorithm_v1.json > counting.credit_map` at build time, so the two files cannot drift:

| Category (12 credit map) | 1.0 | 0.5 | 0.25 (helpers) | Tag |
|---|---|---|---|---|
| BKD | quads | - | glutes, adductors | COACH-ANSWER VOL-09; glute value PROPOSED - PENDING COACH APPROVAL |
| UKD | quads | - | glutes, adductors | COACH-ANSWER UNI-01 (mostly quads), VOL-09; glute value PROPOSED - PENDING COACH APPROVAL |
| BHD | hamstrings | glutes | - | glute 0.5 PROPOSED - PENDING COACH APPROVAL: a deliberate exception to VOL-09's 0.25 helper rule (glutes treated as a co-mover of hip extension, not a helper); open question 5 |
| UHD | hamstrings | glutes | - | glute 0.5 PROPOSED - PENDING COACH APPROVAL: same exception as BHD; open question 5 |
| GLUTE_ISO | glutes | - | hamstrings | PROPOSED - PENDING COACH APPROVAL |
| LEG_FLEXION | hamstrings | - | - | COACH-ANSWER CAT-09, VOL-09 |
| LEG_EXTENSION | quads | - | - | COACH-ANSWER VOL-09 |
| HPUSH | chest | - | triceps, front_delts | COACH-ANSWER VOL-09 |
| VPUSH | front_delts | - | side_delts, triceps | COACH-ANSWER VOL-09 |
| DIPS | - | triceps, chest | - | COACH-ANSWER LIB-16 |
| THRUSTER | quads | front_delts | - | COACH-ANSWER LIB-14 |
| HPULL | lats_upper_back | - | biceps, rear_delts | COACH-ANSWER VOL-09 |
| VPULL | lats_upper_back | - | biceps | COACH-ANSWER VOL-09 |
| PULLOVER ('Pull under' = lat pull-over) | lats_upper_back | - | - | COACH-ANSWER LIB-09 |
| ISOLATION | target muscle 1.0 (fly->chest, side raise/upright row->side delts, reverse fly/face pull->rear delts, curls->biceps (+forearms 0.25), triceps iso->triceps, calf raise->calves) | - | - | COACH-ANSWER VOL-09, LIB-16 |
| CORE | abs_obliques | - | - | COACH-ANSWER CAT-08 |
| ATHLETIC (plyo, ballistic, throw, Olympic, sprint, COD) | none - own budget | - | - | COACH-ANSWER VOL-10 |

* **Unilateral:** '10/10' = one set (UNI-01); alternating = unilateral (UNI-07). Time cost 1.5 x a bilateral set (UNI-09; factor PROPOSED).
* **Athletic exposure:** contacts, throws, cuts, sprint bouts and Olympic reps are tracked in their own budget (3.13), never as muscle sets (VOL-10). v0's "0.5 per athletic set against a lower-body fatigue budget" is retired (I13).
* **Volume load:** VL(exercise, week) = Σ load x reps (the coach's "weight x reps x sets"), logged from 'WEIGHT USED or SCORE'. **Logged and shown, never steered on** (VOL-04). DBs count both dumbbells; machines the stack value; bodyweight reps only unless body mass is logged (body weight is now an intake field, GEN-02).
* **Strength proxy:** best-set e1RM (Epley: load x (1 + reps/30)) for progress checks across a load jump.

### 3.3 The weekly rate: 3 %, 5 % or 7 %, chosen by the person (COACH-ANSWER VOL-05)

**Retired (COACH-ANSWER VOL-05).** v0 RATE_TABLE: BIG lower 3 % / BIG upper 5 % / SMALL 7 %, focus = one class up (max 7 %). Retired by COACH-ANSWER VOL-05: 'It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person.' v0's CAT-02-based class table, the 06 'MEDIUM 5 %' tier and "focus = one class up" are all gone. CAT-02's big/small lists now set only the default rep range (VOL-11: small muscles 12-30, big 5-15) and the small-muscle start (~80 % of the big start, PROPOSED in 12).

**The rule.** One rate for the person each week, applied as a % of each muscle's current weekly sets (VOL-04). Muscle-level gates (pain, '10 - I'm done' on that muscle's exercises) can only lower it for that muscle. The coach (or the client, if allowed) can set it by hand from 0 to 10 % (VOL-05, GEN-08); a hand-set 10 % is the ceiling for a single week, not a plan step, since a run of 10 % weeks is what the coach calls "way too much" (UNI-05). **10 % a week is a hard ceiling** on the person's total weekly resistance sets (UNI-05; exemptions PROPOSED: returning from a deload, block swaps that add no sets).

**How the engine picks the rate (PROPOSED, 12 3.7).** Hard gates first (3.5). Then a readiness score `R = 0.40·E + 0.20·C + 0.20·P + 0.20·L` (E = effort fit, '8 - That was perfect' = 70, ≤ 6 = 100; C = % of planned sets DONE; P = main lifts up / flat / down; L = weekly sleep, stress and energy check-in):

| Readiness score R | Weekly rate | Plain meaning | Tag |
|---|---|---|---|
| >= 85 | 7 % | fresh, everything done, lifts going up, life calm | COACH-ANSWER VOL-05 (person-based); bands PROPOSED (12 3.7) |
| 70-84 | 5 % | on target: EFFORT around '8 - That was perfect', sessions done | COACH-ANSWER VOL-05; bands PROPOSED |
| 55-69 | 3 % | busy or tired week, still training | COACH-ANSWER UNI-05, VOL-05; bands PROPOSED |
| < 55 | 0 % (hold) | life is in the way: keep the volume, add nothing | COACH-ANSWER GEN-05; bands PROPOSED |

Before any logs (a static plan): 5 % by default; 3 % for high stress, under 6 h sleep, a physical job or heavy sport load, age 60+, back from a 6+ month layoff, or declared pain; 7 % is never given before logs earn it; the plan uses the smallest rate that puts the peak in its final phase (so advanced lifters default to 3 %). SCIENCE behind the inputs: RIR accuracy and autoregulation (Helms 2016, Halperin 2022, Hickmott 2022), life stress and sleep (Bartholomew 2008, Stults-Kolehmainen 2014, Knowles 2018) - 12 2.6.

Goal and phase modifiers (12 3.4, 3.12):

| Goal / phase | Primary progression variable | Rate |
|---|---|---|
| Hypertrophy / aesthetics | weekly sets per muscle; double progression (reps -> load) on every exercise that did not get a new set | the person's 3/5/7 %; non-priority muscles <= 3 % while a priority runs (PROPOSED) |
| Strength / powerlifting | main-lift load and % ramp (4T O3:T3, PER-09); weekly sets stay similar; preference moves the reps on the big lifts (VOL-12) | the person's rate on sets; accessories hold |
| General fitness, weekend-warrior athletic, fat loss | sets on compounds, isolation by reps; circuit density; 3 aerobic sessions a week (ATH-07) | the person's rate; starts x0.8 (PROPOSED, 12 3.4) |
| Athlete off-season / pre-season | quality and exposure: plyo method stage, plyo:ballistic share, contacts, Olympic % ramp; resistance supports | the person's rate on resistance, inside athlete caps (base x1.3, PROPOSED) |
| Athlete in-season | maintenance: sprints for speed athletes, strength maintenance or jumps for others (PER-08); bilateral minimal (UNI-10) | 0 % |
| Fight or competition prep | 2-week steps and waves instead of smooth weekly adds (PER-10) | same average, stepped |
| Boxer / striker in high-punching weeks | pressing and arm-isolation sets brought "down, down, down" but never cut to zero (ATH-04: "I don't need to cut it all the way"); rows and rotational throws kept | pressing and arms x 0.5-0.7 of the profile (factor PROPOSED, 12 3.4); 0 % on those muscles while punching volume is high |
| 12-week acclimation weeks / 8-week weeks 1-4 | getting used to the movements; 8-week plans start x1.10 ('you have to start hard') | <= 3 % / <= 5 % (PROPOSED) |
| 4-6-week maintenance / transition | volume at 50-70 % of the last block (PER-01); RIR 2-3 | 0 % |
| Older adult (60+) | extra volume on constrained machines (EQ-03); few plyos unless asked (ATH-09) | default 3 % before logs (PROPOSED) |
| Pain on the muscle | swap in category -> more constrained / split grip / unilateral -> -30-50 % -> drop the exercise (VOL-03, UNI-08) | 0 % until 2 pain-free weeks (PROPOSED) |

### 3.4 From % to whole sets: bank, then release one set (COACH-ANSWER VOL-06)

```
bank[m] += rate × current_weekly_sets[m]            # every week, every target muscle
while bank[m] ≥ 1 and current[m] + 1 ≤ cap[m]:
    place one set (3.6); bank[m] −= 1
if current[m] ≥ cap[m]: bank[m] = 0                  # at cap: progress load / reps / intensifiers instead
if no room anywhere: bank[m] = min(bank[m], 1.99)    # the bank waits
```

v0's release of a "chunk" of round(10 % x current) sets (1-2 at once) is retired: it was built to reproduce the chat's 20 → 22 in one week, which is a +10 % week, the ceiling the coach called "way too much" (UNI-05). One whole set per bank unit is his VOL-06 rule. Computed (uncapped, one muscle, rate held constant):

| Weekly sets now (W1) | First added set at 3 % | at 5 % | at 7 % | Sets in W5 at 3 / 5 / 7 % (no cap) | Sets in W9 at 3 / 5 / 7 % (no cap) |
|---|---|---|---|---|---|
| 8 | W6 | W4 | W3 | 8 / 9 / 10 | 10 / 11 / 13 |
| 10 | W5 | W3 | W3 | 11 / 12 / 13 | 12 / 14 / 16 |
| 12 | W4 | W3 | W3 | 13 / 14 / 15 | 15 / 17 / 20 |
| 15 | W4 | W3 | W2 | 16 / 18 / 19 | 18 / 22 / 25 |
| 18 | W3 | W3 | W2 | 20 / 21 / 23 | 22 / 26 / 30 |
| 20 | W3 | W2 | W2 | 22 / 24 / 26 | 25 / 29 / 34 |
| 22 | W3 | W2 | W2 | 24 / 26 / 28 | 27 / 32 / 37 |
| 25 | W3 | W2 | W2 | 28 / 30 / 32 | 31 / 36 / 42 |

**The chat's 20 → 22 (computed).** chest from 20 sets, W1 → W5: at 3 % 20, 20, 21, 21, 22; at 5 % 20, 21, 22, 23, 24; at 7 % 20, 21, 22, 24, 26. At 5 % chest goes 20 → 21 → 22 in two weeks; only a 10 % week would do it in one. Whether a one-off +2 step is fine is open question 3.

**The coach's add order (VOL-07), reproduced by the engine's own `pick_in_day` on three exercises of one day, one set a week:** 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 → 4/4/3 → 4/4/4. That is exactly his 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3.

### 3.5 Readiness gates (COACH-ANSWER GEN-05: adjust week to week from logged EFFORT and HOW IT FELT)

The gates use the BYOP log: 'EFFORT' (LIB AX8:AX17; JL I2) and 'HOW IT FELT?' (JL J2; LIB AY8:AY11). v0's per-muscle RED/AMBER/GREEN/EASY table is replaced by these person-level gates plus the readiness score (3.3).

| Gate | Trigger (verbatim dropdown values) | Next week | Status |
|---|---|---|---|
| HOLD (person) | median weekly EFFORT >= 9 ('9 - That was terrible') or "10 - I'm done" on 2+ exercises | 0 % for everyone this week; the bank keeps nothing new. | COACH-ANSWER GEN-05 ('EFFORT 9-10 → hold or cut sets next week') |
| CUT (exercise) | "10 - I'm done" on one exercise | That exercise -1 set next week. | COACH-ANSWER GEN-05 |
| PAIN | 'Felt a PAIN' | Swap inside the category to a more constrained, split-grip or unilateral variant, keeping the sets if possible (UNI-08); the second time -30-50 % on that slot; the third time drop the exercise for the block and flag for review (VOL-03). That muscle 0 %. | COACH-ANSWER GEN-05, VOL-03, UNI-08; 3-step order PROPOSED |
| ADD | median weekly EFFORT <= 6 ('6 - Broke a Sweat' or easier) | Rate at least 5 %, and raise load or reps first. | COACH-ANSWER GEN-05 ('EFFORT ≤ 6 → add') |
| WRONG / COULDN'T | 'Felt the WRONG muscle' / "Couldn't do it" | Change one variable in the same category / regress one exercise level or use an assisted version; volume unchanged. | COACH-ANSWER GEN-05 assumption, PER-02 |
| DELOAD | 2 holds in a row | Deload next week (about half the sets, PER-05). | PROPOSED (12 3.7) |

**Two delivery modes (PROPOSED, 12 3.14).** The coach is unsure clients should track inside the tool ("They should be tracking it themselves", GEN-03) but confirmed adjusting from logged effort (GEN-05). 12 resolves it with a **static** plan computed up front from the intake rate, and an optional **adaptive** plan driven by a 30-second weekly check-in (required for the week-by-week mode).

### 3.6 Placement: where a new set goes (COACH-ANSWER VOL-07, ORD-10, ORD-11)

1. Block menu. Each muscle's exercises are fixed in week 1 for the 4-6-week block; nothing new appears mid-block except a bonus or Focus slot (PER-02, VP-1).
2. Day. Rotate through the days that train the muscle as the main mover (day A, then day B, ...). (PROPOSED; VOL-07 shows the order inside one day.)
3. Laterality group. For big lower and upper muscles: if the current bilateral share is more than 3 points below the profile target, the set goes to a bilateral exercise; more than 3 points above, to a unilateral one; otherwise no preference (3.7). Leg flexion and leg extension are outside the share (CAT-09). (Filter PROPOSED.)
4. The coach's order inside the day: add to the first exercise in session order whose sets are below the first exercise's; if all are equal, add to the first. This gives 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3: 'I'm adding sets to the things that matter most' (VOL-07).
5. Limits: sets per exercise 4 (L1) or 5 (L2-L3), isolation 4, Focus slots 3; the muscle's fractional sets per session <= 11 (priority 14); session minutes <= the client's limit (3.8).
6. No room: (a) superset the lower/upper pairs on that day if that frees the time (ORD-05); (b) a small muscle gets a bonus exercise (2 sets) on the optional day, else on the training day with the fewest exercises (VOL-07, ORD-10); (c) a big muscle gets a Focus slot (2 sets) on the optional day (ORD-11); (d) still no room: the bank waits (max 1.99) and progress comes from load, reps, MYO on the last machine/isolation and supersets.
7. One lever per exercise per week. An exercise that gets a new set holds its load and rep target that week; the others progress by double progression (3.9). VOL-04: '20 → 22 sets at the same load'.
8. Helper credit. A set added to a compound also credits its helpers at 0.25 (bench +1 -> triceps +0.25, front delts +0.25); dips credit 0.5 + 0.5. Helper spill-over may take a muscle up to ~1 set over its cap; it is reported, never topped up with direct sets.
9. Hard rules before any add: core first; hip dominant + push, knee dominant + pull; no second axial-loaded squat or hinge in the week; row before pulldown; power before strength; no bands or variable resistance (ATH-11, UNI-11, ORD-06, PER-04, ORD-01, ORD-03, EQ-12).
10. Floors. A big muscle never drops below 4 sets and a small one below 2 unless the sport profile removes it on purpose (credit-only muscles for field athletes). (PROPOSED)

### 3.7 The bilateral : unilateral share (COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13)

**The coach's rule.** "It should be a range anywhere from one side, like 90/10, to the other side, 10/90 ... Also, keeping in mind that sometimes the athletes might have some type of pain or some type of injury ... we need to adjust accordingly. Yeah. Again, the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-02; the same answer for the upper body, UNI-03.) Powerlifters and bodybuilders: "the unilateral stays at the beginning just as a small foundation, maybe 50. It then turns more into an 80/20 or 90/10." Field athletes such as a tennis player: "80% or 90% unilateral work in the gym because I don't want them to lose their rotational forces and skills." In season: "keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season" (UNI-10, RIGHT). It must be adjustable (a coach slider).

**Definition.** Share = bilateral sets ÷ (bilateral + unilateral sets) in the lower-body knee- and hip-dominant compound slots. Leg flexion, leg extension and other isolation are excluded (CAT-09). The same logic runs for upper-body push and pull (alternating = unilateral).

**Targets by profile** (the coach's anchor points; numbers he did not give are PROPOSED in 12 3.11):

| Profile / phase | Target bilateral share (% of lower-body knee- and hip-dominant compound sets) | Evidence | Status |
|---|---|---|---|
| Bodybuilder / powerlifter (L2-L3) | 50 in weeks 1-4 -> 80-90 by the peak; upper 80-90 | UNI-02 ('maybe 50. It then turns more into an 80/20 or 90/10'); CAT-13 (contra/ipsi health accessories first 2-4 weeks) | COACH-ANSWER UNI-02, CAT-13 (lower); upper 80-90 PROPOSED (the coach gave the upper body 'the same' logic, UNI-03, but no number; I15, open question 9) |
| Field / court COD athletes (tennis, soccer, basketball, football skill) | off-season 20 -> 15; pre-season 15; in-season 10; upper 20 | UNI-02 ('80% or 90% unilateral work in the gym'); UNI-10 (in-season bilateral minimal) | COACH-ANSWER UNI-02, UNI-10 |
| Beginner aesthetics / general (L1) | 50 -> 60 in later cycles; upper 70 | OBSERVED BYOP 50 % (6 of 9 templates as wired), UL/PPL 50-53 % | PROPOSED |
| Weekend-warrior athletic, bootcamp | 50 (cross pattern); upper 60 | OBSERVED BYOP ATHLETIC / JL 50 %; UNI-06 | COACH-ANSWER UNI-06; numbers PROPOSED |
| Sprinters / acceleration | off 40, pre 30, in 20; upper 40 | force need + ipsilateral step-ups (CAT-13) | PROPOSED |
| Strength-type athletes (linemen, wrestlers, rugby, throwers) | off 60, pre 40, in 25; upper 60 | ATH-03 'more resistance' group | PROPOSED |
| Baseball / softball | off 50, pre 35, in 20; upper 30 (pitchers: less overhead) | OBSERVED BASEBALL 45-48 % (4 + 4 sets); ATH-08 | OBSERVED + PROPOSED |
| Combat (boxing, MMA, karate) | off 40, pre 30, in 20; upper 30 rotational | OBSERVED BOXING 50 % -> 37.5 % | PROPOSED |
| Older / injured | 60 on constrained machines with supported unilateral work; upper 70 | EQ-03 | COACH-ANSWER EQ-03; numbers PROPOSED |
| Pain in a lower-body joint | shift 20 points toward the pain-free side (low-back pain under axial bilateral loads -> unilateral, belt squat, machines; knee or hip pain in single-leg positions -> bilateral machines) | UNI-02 ('adjust accordingly'), MM 05 A6 'going unilateral' | COACH-ANSWER UNI-02; 20 points PROPOSED |

**Inside the unilateral share: contralateral vs ipsilateral (COACH-ANSWER CAT-13, UNI-12).**

| Who | Contralateral (into the hip) | Ipsilateral (out of the hip) | Tag |
|---|---|---|---|
| Change-of-direction athletes: football routes, soccer, basketball, tennis (CAT-13 names them) | default for loaded single-leg work: ~70 % of loaded unilateral sets contralateral (into the hip); also to build hip range they lack | used too, to get out of the hip quickly; the frontal-plane lunge moves contra → ipsi in Example B's block 3 | COACH-ANSWER CAT-13; ~70 % PROPOSED (12 3.11) |
| Sprinters / acceleration | less | ipsilateral step-ups for a strong take-off ('I need them to get out of the hip really quick'), about 60 % of loaded unilateral sets | COACH-ANSWER CAT-13; ~60 % PROPOSED |
| Bodybuilders, powerlifters | health accessory, mostly weeks 1-4 | health accessory, mostly weeks 1-4 | COACH-ANSWER CAT-13 (health accessories mostly weeks 1-4, keep one later only if something bugs them) |
| Court and combat athletes | frontal / transverse unilateral work (lateral lunge, cossack, lateral step-up) | same | COACH-ANSWER UNI-12 |

**Observed bilateral share of lower-body resistance sets (OBSERVED computation, unchanged from v0).** Bilateral = bilateral knee- and hip-dominant lifts; unilateral = lunges, step-ups, single-leg hinges; Olympic lifts, KB swings and loaded jumps excluded; knee flexion reported separately. MASTER MODEL rows use `sets_numeric_est`; BYOP rows count slots. Script `bilat_uni.py` (section 9).

| Book | Program | Variant | Bilateral share of sets | Bilateral share of items (or slots) | Sets: bi-knee / bi-hip / uni-knee / uni-hip | Knee-flexion iso (separate) |
|---|---|---|---|---|---|---|
| MM | 4T AESTHETICS | 12-week columns O:Z | 54.0 % | 54.3 % | 163 / 48 / 90 / 90 | 17 |
| MM | 4T AESTHETICS | 8-week columns E:L | 49.0 % | 50.0 % | 48 / 48 / 52 / 48 | 0 |
| MM | 4T HYBRID | weeks E:L | 100.0 % | 42.9 % | 46 / 23 / 0 / 0 | 0 |
| MM | 4T STRENGTH | 12-week columns O:Z | n/a (no set counts) | 66.7 % | 0 / 0 / 0 / 0 | 0 |
| MM | 4T STRENGTH | 8-week columns E:L | 68.4 % | 60.0 % | 49 / 42 / 24 / 18 | 0 |
| MM | ATHLETIC FULL BODY | ADVANCED OFF SEASON WORKOUTS | 50.0 % | 40.0 % | 0 / 5 / 3 / 2 | 0 |
| MM | ATHLETIC FULL BODY | MID OFF SEASON WORKOUTS | 26.7 % | 33.3 % | 0 / 4 / 6 / 5 | 2 |
| MM | ATHLETIC FULL BODY | STARTING OFF SEASON WORKOUTS | 42.9 % | 40.0 % | 3 / 3 / 5 / 3 | 3 |
| MM | BASEBALL | BLOCK 1 | 47.5 % | 47.5 % | 44 / 32 / 52 / 32 | 4 |
| MM | BASEBALL | BLOCK 2 | 44.7 % | 43.8 % | 55 / 33 / 60 / 49 | 4 |
| MM | BASEBALL | BLOCK 3 | 46.8 % | 46.8 % | 40 / 48 / 52 / 48 | 8 |
| MM | BOXING 8 WEEK BUILD UP | Weeks 1-2 | 50.0 % | 50.0 % | 6 / 6 / 6 / 6 | 6 |
| MM | BOXING 8 WEEK BUILD UP | Weeks 3-8 | 37.5 % | 37.5 % | 3 / 6 / 12 / 3 | 6 |
| MM | CONJUGATE (NOT DONE) | 8 WEEK CYCLE | 70.0 % | 60.0 % | 52 / 46 / 24 / 18 | 0 |
| MM | CROSSFIT SPLIT | CLASS PROGRAMMING SPLIT (P1) | n/a (no set counts) | 100.0 % | 0 / 0 / 0 / 0 | 0 |
| MM | CROSSFIT SPLIT | COMPETE CROSSFIT SPLIT (monthly grid) | n/a (no set counts) | 100.0 % | 0 / 0 / 0 / 0 | 0 |
| MM | FAT BURN / BODY TONING | CIRCUITS RECCOMENDED | 36.0 % | 33.3 % | 9 / 0 / 16 / 0 | 0 |
| MM | FAT BURN / BODY TONING | MUSCLE BUILDING | 55.1 % | 50.0 % | 27 / 27 / 24 / 20 | 12 |
| MM | PUSH/PULL/LEGS | INTERMEDIATE | 53.3 % | 50.0 % | 4 / 4 / 4 / 3 | 3 |
| MM | PUSH/PULL/LEGS | NEWBY | 50.0 % | 50.0 % | 3 / 3 / 3 / 3 | 3 |
| MM | PUSH/PULL/LEGS | NOVICE | 50.0 % | 50.0 % | 2 / 2 / 2 / 2 | 2 |
| MM | UPPER/LOWER | INTERMEDIATE | 53.3 % | 50.0 % | 4 / 4 / 4 / 3 | 3 |
| MM | UPPER/LOWER | NEWBY | 50.0 % | 50.0 % | 3 / 3 / 3 / 3 | 3 |
| MM | UPPER/LOWER | NOVICE | 50.0 % | 50.0 % | 2 / 2 / 2 / 2 | 2 |
| BYOP | AESTHETICS - FULL BODY - 4 DAYS | slots, equal sets assumed | 50.0 % | 4 bi / 4 uni slots | - | 2 slots |
| BYOP | 3 DAY BUILDER | slots, equal sets assumed | 57.1 % | 4 bi / 3 uni slots | - | 1 slots |
| BYOP | NO ACCESS - AESTHETICS - FB - 4 | slots, equal sets assumed | 66.7 % | 4 bi / 2 uni slots | - | 4 slots |
| BYOP | ATHLETIC - FULL BODY - 4 DAYS A | slots, equal sets assumed | 50.0 % | 4 bi / 4 uni slots | - | 2 slots |
| BYOP | JUSTICE LEAGUE (now 'Athletic Performance - Non-Competitive') | slots, equal sets assumed | 50.0 % | 4 bi / 4 uni slots | - | 2 slots |
| BYOP | NO ACCESS - ATHLETIC - FB - 4 t | slots, equal sets assumed | 66.7 % | 4 bi / 2 uni slots | - | 4 slots |
| BYOP | PUSHPULLLEGS - 3 or 6 DAYS A WK | slots, equal sets assumed | 50.0 % | 4 bi / 4 uni slots | - | 2 slots |
| BYOP | BOOTCAMP - OPTION 1 | slots, equal sets assumed | 50.0 % | 4 bi / 4 uni slots | - | 2 slots |
| BYOP | BOOTCAMP - OPTION 2 | slots, equal sets assumed | 50.0 % | 4 bi / 4 uni slots | - | 0 slots |

**Reading (v1).** The coach's written programs sit near 50 % because they are mostly general, aesthetics-block-start and non-competitive athletic templates (BYOP 50 % in 6 of 9 tabs as wired; the NO ACCESS tabs read 67 % only because of the CA-4 miswire; the 3 DAY BUILDER reads 57 %). Strength tracks tilt bilateral (60-70 %), athletes tilt unilateral as the phase gets more specific (BOXING 50 % → 37.5 %, BASEBALL Block 2 44.7 %). His answers go further than his sheets for change-of-direction athletes (80-90 % unilateral): the answer wins (CA-10).

**Placement rule (12 3.9; filter PROPOSED).** A new big-muscle set goes to the bilateral group when the share is more than 3 points below target, to the unilateral group when more than 3 points above, otherwise no preference; then the VOL-07 order picks the exercise. At a block boundary the share can move by moving sets and by a stance change that swaps a lift's laterality (PER-02), as in Example A week 5. Pain shifts the target about 20 points toward the pain-free side (PROPOSED).

### 3.8 Starts, caps and session limits

| Item | Value | Source |
|---|---|---|
| Starting weekly sets per muscle | big muscles L1 10 / L2 15 / L3 20 (coach: beginner 10-12, intermediate 15-20, advanced 20+); small muscles ~80 % (8 / 12 / 15, PROPOSED); rear delts 4 / 6 / 8 (PROPOSED); calves 3 sets each leg day; core block ~2 exercises x 2 sets | COACH-ANSWER VOL-01, VOL-17; 12 3.3 |
| Level caps (non-priority) | big 14 / 22 / 25 (L1 / L2 / L3); small 12 / 18 / 22; rear delts 8 / 12 / 16; calves 16 / 18 / 24; abs 16 / 20 / 20 | PROPOSED (12 3.3); 15-20 maintenance to some growth, 20-25 growth (UNI-01) |
| Priority muscle | start +4 (L1-L2) or +6 (L3); cap about 25-30 (L2 26-28, L3 30); 1-2 priority muscles at a time; first in its session | COACH-ANSWER VOL-02, ORD-04; level split PROPOSED |
| Weekly increase | 3 / 5 / 7 % by the person (VOL-05); never above 10 % on the person's total weekly resistance sets (exempt: return from a deload, block swaps that add no sets) | COACH-ANSWER UNI-05; exemptions PROPOSED |
| Per session, per muscle | about 11 fractional sets (priority 14) | SCIENCE Remmert ~11; RP 8-12; values PROPOSED |
| Per exercise, per session | min 2; max 4 (L1) / 5 (L2-L3); isolation max 4; Focus slots 2-3 | COACH-ANSWER VOL-16 (defaults 3 compounds / 2 isolation), ORD-11; limits PROPOSED |
| Exercises per muscle on its day | 3-4 (VOL-07); a small muscle that sits at the end of the session gets a bonus exercise | COACH-ANSWER VOL-07 |
| Exercises per session | resistance-only usually about 7, 5-7 for hard aesthetics work (VOL-08, VOL-16); by session length 45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9 (VOL-08 assumption, RIGHT), so 8 on a 75-90-min or full-body day with calves; field athletes off-season up to 10-12 (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance) | COACH-ANSWER VOL-08, VOL-16, VOL-17; whether the 2-exercise core block counts inside the 8-9 for non-athletes INFERRED (I16) |
| Session length | athletes, bodybuilders, powerlifters ~90 min (max 120); general and weight loss 45-60; bootcamp 35-45; unilateral set = 1.5 x a bilateral set of time | COACH-ANSWER UNI-09, PRG-03; time factor PROPOSED |
| Plyo contacts per session | L1 80 / L2 100 / L3 120 (his own sessions run lower) | SCIENCE NSCA (12 3.13) |
| Contacts week over week | <= +10-15 % except at a planned method-stage change | SCIENCE ACWR (criticised; 12 2.5); INFERRED |

### 3.9 Load progression and volume-load tracking

| Item | Rule | Evidence |
|---|---|---|
| Double progression (default) | Hold load until every working set reaches the top of the rep bracket at the target RIR; then add load (barbell lower +2.5-5 kg, upper +1-2.5 kg; DB the next pair; machine the next plate) and reset reps to the bottom of the bracket. | SCIENCE ACSM +2-10 % [S80]; OBSERVED 'The lower the reps, the higher the weight' (MM 00 A6) |
| The coach's own rep-flattening ladder | '12/10/8 -20' = a pyramid: 12 reps at a mid weight, 10 heavier, 8 the heaviest, then drop to a light 20 (4 sets) (PRG-07). Inside a wave the back sets catch up with the top set before sets are added: AESTHETICS-12 '12/10/8 -20' (wk 1-3) -> '12/12/10-20' (wk 4-5) -> '12/12/12-20' (wk 6), with sets 3, 3, 3, 4, 4, 4 (4T O31:T32); wave 2 '15/12/10/8-20' -> '12/12/10/10-20' -> '12/12/12/12-20' -> '15/15/12/12/12' (V32:Z32). | OBSERVED + COACH-ANSWER PRG-07 |
| Strength main lifts | % and RPE wave: 80, 80, 85, 85, 90, 90 % with RPE 7, 7, 7, 8, 8, 9, sets 4, 4, 5, 5, 6, 6 and reps 5, 5, 4, 4, 3, 3 (4T O3:T6); +5 % every 2 weeks; week 7 'MID DELOAD' RPE 7. Olympic lifts in strength plans: 75 -> 80 -> 85 -> 90 % with 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4 (PER-09). (The week-7 'MID DELOAD' is his OBSERVED 4 TRACKS layout; v1 deloads on triggers or in week 1 of the next cycle, 3.10.) | OBSERVED + COACH-ANSWER PER-09 |
| Coarse home increments | Home DB clients progress reps, then tempo (slow eccentric), then ROM (deficit), then sets, before load (10b TEMPO-3). Coach example: 'slow eccentric deficit Lunges (no weigths)' (MM 02 EL52). | OBSERVED example + SCIENCE |
| Volume load use | (1) show the client that work is rising; (2) fatigue flag when sets rose but VL per set fell >= 10 % on the same exercise and bracket for 2 exposures (feeds the deload triggers); (3) never compare VL across rep brackets or across a load jump: use best-set e1RM (Epley) there. Load and VL are tracked, never driven by a % (VOL-04). | COACH-ANSWER VOL-04 + COACH-CHAT definition; SCIENCE [S73]; INFERRED rules |
| Rep range by muscle size and preference | Small muscles 12-30 reps (20s, MAX, MYO); big muscles 5-15 mixed (VOL-11). A client's preference ('lighter, more sets' vs 'heavier, fewer reps') moves the rep range on the big compound lifts only; weekly sets stay similar (VOL-12). 40-rep sets only as a CrossFit / AMRAP option. | COACH-ANSWER VOL-11, VOL-12 |
| Unilateral reps | Default moderate-to-high reps per side ('8/8' to '12/12'); heavy low-rep unilateral work is an option the athlete or coach can switch on (`heavy_unilateral`). Unilateral volume progresses like bilateral (UNI-05). | COACH-ANSWER UNI-04, UNI-05 |

### 3.10 Plan shapes and deloads (COACH-ANSWER PER-01, PER-05, PER-07)

PER-01 was NOT RIGHT on v0's 6 / 8 / 12-week shapes. His words: 4-6-week plans are for transitions ("maintenance phase ... vacation ... transitioning from off-season to on-season, they're traveling, and they're moving") at about 50-70 % volume; "An 8-week program is a program that wants to modify you, so you have to start hard"; "I like, personally, on my model, the 12-week programs"; the next 12 weeks start one level higher ("start at a 2 and end at an 11"); plus a week-by-week mode and a yearly mode. Tests are chosen by checkbox at the start of a block, or none (PER-07).

**Plan shapes (COACH-ANSWER PER-01; week splits PROPOSED in 12 3.12).**

* 12-week plan (preferred): no fixed deload inside; weeks 1-3 acclimation (2 for L3, 4 for L1 or returning), 4-9 driving, 10-12 hardest; the first week of the next cycle is a deload, or a 4-6-week maintenance block follows (PER-01; week split PROPOSED).
* 8-week plan: starts hard (x1.10 on the start); weeks 1-4 adapting, 5-8 driving; next plan opens with a deload (PER-01; x1.10 PROPOSED).
* 4-6-week plan = maintenance / transition (vacation, travel, season change, moving): flat at 50-70 % of the last block (50 vacation or limited kit, 60 travel/moving/season change, 70 planned maintenance; older adults >= 70 %) (PER-01; splits PROPOSED).
* Week-by-week mode: same phases, block boundary every 4-6 weeks, deload on triggers or after 12 loading weeks at the latest; yearly mode: quarter themes, last 2 weeks of December automatic maintenance (PER-01; limits PROPOSED).
* Athletes before competition: 1-2-week taper, volume -40-60 %, intensity kept (06 D10); in season 0 % (PER-08).

**Deload triggers** (PROPOSED, 12 3.12; there is no fixed deload inside an 8- or 12-week plan). Any of:

* 2 holds in a row (median EFFORT >= 9 or "10 - I'm done" on 2+ exercises)
* median EFFORT >= 9 two weeks in a row
* 'Felt a PAIN' on >= 2 different slots in one week
* performance down on >= 3 main lifts for 2 exposures (or the VL fatigue flag on >= 3 exercises)

**Dose** (COACH-ANSWER PER-05). `deload_sets = about 0.5 x the current week's sets (round up, minimum 1 per exercise); same exercises; lighter load or 3+ RIR; no buy-out, finisher, MYO or supersets; plyos only low-amplitude landings at about half the contacts; conditioning easy (orange) only`.

* Observed basis: his written deloads are shallower (AESTHETICS-12 wk7 = 100 % of wk1 sets/exercise; STRENGTH-12 wk7 = 75 %; BASEBALL 'DELOAD WEEK' = 76 % of block wk1; 03 9.8); the coach's answer 'about half the sets' wins.
* Taper: a pre-competition taper (40-60 % volume, intensity kept) is separate from the deload.
* Restart: after a triggered deload resume at the volume of 2 weeks before it; after a planned cycle the next start is one step higher (start x1.05, cap +1; PER-01 'start at a 2 and end at an 11'), or the same start after holds, pain or a maintenance block (step size PROPOSED).
* Status: COACH-ANSWER PER-01, PER-05; timing and restart PROPOSED (12 3.12).

### 3.11 Engine pseudo-code (the reference arithmetic is 12's `vol_engine_v1.py`)

```
# reference arithmetic: vol_engine_v1.py (= 12_volume_algorithm_v1 prototype), driven by engine_sim_v4.py
for each week w of the plan:
    if deload_due(w): emit deload(current, factor=0.5); continue        # PER-05; triggers 3.10
    rate = plan_rate if mode == 'static' else readiness_rate(log[w-1])  # VOL-05: one rate for the PERSON (3.3)
    rate = min(rate, phase_cap(plan, w), 0.10)                          # acclimation 3 %, 8-wk weeks 1-4 5 %, ceiling 10 % (UNI-05)
    for m in muscles (priority first, then big, then small):
        r = 0 if m in pain_frozen else (min(rate, 0.03) if priority_running and m not in priority else rate)
        bank[m] += r * weekly_sets[m]                                   # VOL-04: % of weekly sets per muscle
        while bank[m] >= 1 and weekly_sets[m] + 1 <= cap[m]:            # VOL-06: whole sets only
            if total_sets_after_add > 1.10 * total_sets_last_week: break
            if not place_set(m): bank[m] = min(bank[m], 1.99); break    # 3.6 (VOL-07 order, fallbacks)
            bank[m] -= 1
        if weekly_sets[m] >= cap[m]: bank[m] = 0; progress load/reps/intensifiers
    apply_gates(log)                                                     # GEN-05: '10 - I'm done' -1 set; pain protocol
    for each exercise e with no new set: double_progression(e)           # 3.9
    log volume_load(e, w)                                                # tracked, never steered on (VOL-04)
    if block_boundary(w): change 1-2 small variables; rebalance bilateral share  # PER-02, UNI-02
```

### 3.12 Worked example A: bodybuilding-style aesthetics client, chest priority, 8 weeks

**Client.** 30 y, L2 (3 years of consistent training), bodybuilding-style aesthetics goal, **priority = chest**, commercial gym, 4 training days x 75 min + 2 optional Focus days x 45 min, **8-week plan** (PER-01: "start hard"; first 4 weeks adapting, next 4 driving). No pain at intake.

**Layout (05 v1 4-day physique layout, same-pattern pairing for aesthetics, UNI-06).** Mon A1 = the week's **axial squat** ('Front Squats') + pull; Tue B1 = non-axial hinge ('Hyper extensions ') + push, chest press first because chest is the priority (ORD-04); Thu A2 = the coach's own Day-1 picks with the **leg press** as the second, non-axial squat exposure (BYOP 00 D4:D9; PER-04); Fri B2 = the coach's own Day-2 picks with 'DB Deadlifts' as the week's **axial hinge** (BYOP 00 D10:D13); Wed and Sat = optional days with Focus 1 and Focus 2 both on chest (ORD-10 "ideally separate days", ORD-11). Core block first every day (ATH-11); calves 3 sets every leg day and moved to the end (VOL-17, ORD-04); a rear-delt exercise on both pull days (VOL-17). Weeks 1-4 carry contralateral and ipsilateral lunges and single-leg deadlifts as **health accessories** (CAT-13), at about 50/50 (UNI-02).

**Starts and caps** (12 3.3: L2 big 15, small 12, rear delts 6, calves 3 per leg day; chest +4 priority; 8-week start x 1.10, PROPOSED):

|  | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Start (L2 x 1.10; chest +4 priority) | 17 | 17 | 17 | 21 | 17 | 13 | 13 | 13 | 7 | 12 | 16 |
| Cap | 22 | 22 | 22 | 26 | 22 | 18 | 18 | 18 | 12 | 18 | 20 |

**Week 1** (after the week-1 fit of 12 section 4):

* **Mon**: 'Plank' (LIB O10) 2 · 'Side Plank ' (LIB P9) 2 · 'Front Squats' (LIB AI46) *axial 3 · 'Machine Row Close Grip' (LIB X9) 4 · 'Front Foot Elevated Lunges (FFE)' 10/10, contralateral DB (LIB AL15; 4T E38 'FFE CONTRA LUNGES') 3 · 'Lat Pulldown Supinated Grip ' (LIB U10) 4 · 'Leg Extensions' (LIB AM9) 2 · 'Hammer Db Curls' (LIB AS13) 4 · 'Seated DB Reverse Flies' (LIB AH15) 2 · 'Standing Calf raises (use deficit)' (LIB AU9) 3
* **Tue**: 'Leg Raises' (LIB R9) 2 · 'Side Planks ' (LIB S9) 2 · 'DB Bench Press' (LIB AD94) 4 · 'Hyper extensions ' (LIB AN55) ~non-axial 3 · 'Alternating DB Deadlifts' 10/10 (LIB AQ13) 3 · 'Incline Seated DB Press' (LIB AA9) 3 · 'Lying Leg Curls' (LIB AR10) 2 · 'Overhead cable tricep extension' (LIB AT16) 4 · 'Seated Lateral Raises w/ DB ' (LIB AH9) 4 · 'Calf Raises w/ DB ' (LIB AU11) 3
* **Thu**: 'Plank' (LIB O10) 2 · 'Side Plank ' (LIB P9) 2 · 'Leg press' (BYOP 00 D4) ~non-axial 3 · 'Bent Over Barbell Rows' (BYOP 00 D5) 4 · 'Reverse Lunges ' 10/10, ipsilateral DB (BYOP 00 D6; RP C22) 3 · 'Lat Pulldown Pronated Grip' (BYOP 00 D7) 4 · 'Leg Extensions' (BYOP 00 D9) 2 · 'Ez Bar Curls' (BYOP 00 D8) 4 · 'Machine reverse fliez' (LIB AH20) 2 · 'Machine Calf Raises' (BYOP 00 D3, moved to the end) 3
* **Fri**: 'Leg Raises' (LIB R9) 2 · 'Side Planks ' (LIB S9) 2 · 'Push Ups ' (BYOP 00 D11) 4 · 'DB Deadlifts' (BYOP 00 D10) *axial 3 · 'Staggered Stance DL w/ DB ' 10/10, contralateral DB (BYOP 00 D12; RP C20) 3 · 'DB Push press' (BYOP 00 D13; coach: 5 x '6 to 8 Reps') 5 · 'Seated leg curls' (LIB AR9) 2 · 'Cable tricep push downs' (LIB AT17) 3 · 'Cable machine Leaning Side raises ' (LIB AH19) 4 · 'Standing DB calf Raises (Use Deficit)' (LIB AU10) 3
* **Wed**: 'Crunches' (LIB O11) 2 · Focus 1: 'Incline db press' (LIB AZ245) 3 · Focus 2: 'Cable flies' (LIB AZ249) 3 · Focus: 'Hip Thrust Machine' (LIB AN51) 2 · 'Inclined Cable Machine Side Raises' (LIB AH14) (bonus) 2
* **Sat**: 'Woodchoppers' (LIB Q9) 2 · Focus 1: 'Incline db press' (LIB AZ245) 3 · Focus 2: 'DB flies' (LIB AZ248) 3 · Focus: 'Hip Thrust Machine' (LIB AN51) 2

**Weekly sets per muscle (coach count) and the rate used to build each week from the week before:**

| Wk | phase | rate | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets | lower bilateral share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | adapt | - | 16 | 17 | 13 | 20 | 16 | 12 | 12.5 | 12 | 6 | 12 | 20 | 121 | 0.50 |
| 2 | adapt | 5 % | 16 | 17 | 13 | 21 | 16 | 12 | 12.75 | 12 | 6 | 12 | 20 | 122 | 0.50 |
| 3 | adapt | 5 % | 16 | 18 | 13 | 22 | 16 | 12 | 13 | 12 | 6 | 12 | 20 | 124 | 0.50 |
| 4 | adapt | 5 % | 15 | 18 | 12.75 | 22 | 17 | 14.25 | 14 | 14 | 6.25 | 13 | 20 | 130 | 0.48 |
| 5 | drive | 3 % | 16 | 19 | 13.5 | 22 | 17 | 14.25 | 14 | 14 | 6.25 | 13 | 20 | 132 | 0.76 |
| 6 | drive | 7 % | 16 | 19 | 13.5 | 22 | 18 | 14.5 | 14 | 14 | 6.5 | 13 | 20 | 133 | 0.76 |
| 7 | drive | hold | 16 | 19 | 13.5 | 22 | 18 | 14.5 | 14 | 14 | 6.5 | 13 | 20 | 133 | 0.76 |
| 8 | drive | 5 % | 17 | 20 | 14.25 | 22 | 19 | 16.75 | 14 | 14 | 7.5 | 14 | 20 | 140 | 0.78 |

**The log behind the rates (assumed).** W2-W4: '8 - That was perfect', all done (5 %; the 8-week plan caps weeks 1-4 at 5 %). W3: the leg press logged "10 - I'm done" → W4 leg press -1 set and quads held (GEN-05). W4: a poor-sleep, high-stress week → W5 at 3 %. W5: EFFORT 7 with rep PRs → W6 at 7 %. W6: median EFFORT 9 → W7 hold. While chest is the priority every other muscle is limited to 3 % (PROPOSED).

**Engine log:**

| Week | Engine log (adds, holds, swaps; verbatim from the run) |
|---|---|
| 2 | chest add Tue 'DB Bench Press' (LIB AD94) |
| 3 | chest add Fri 'Push Ups ' (BYOP 00 D11); hamstrings add Tue 'Lying Leg Curls' (LIB AR10) |
| 4 | W3 log 'Leg press' logged '10 - I'm done': -1 set on that exercise, quads held this week (GEN-05); chest no room (session/time cap); glutes no room (session/time cap); back add Mon 'Machine Row Close Grip' (LIB X9); biceps bonus Wed 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (LIB AS12) (bonus); triceps add Fri 'Cable tricep push downs' (LIB AT17); side_delts bonus Sat 'Inclined Cable Machine Side Raises' (LIB AH14) (bonus); calves add Mon 'Standing Calf raises (use deficit)' (LIB AU9) |
| 5 | block 2 swap Tue 'Alternating DB Deadlifts' -> 'Reverse Hyper Extension'; block 2 swap Thu 'Reverse Lunges ' -> 'Belt squat'; block 2 move 1 set 'Front Foot Elevated Lunges (FFE)' -> 'Front Squats'; block 2 grip Mon 'Machine Row Close Grip' -> 'Machine Row Pronated Grips'; block 2 grip Mon 'Lat Pulldown Supinated Grip ' -> 'Lat Pulldowns Close Grip'; lower bilateral share 0.48 -> 0.78 target 0.80 from week 5; chest no room (session/time cap); quads add Mon 'Front Foot Elevated Lunges (FFE)' 10/10, contralateral DB (LIB AL15; 4T E38 'FFE CONTRA LUNGES'); hamstrings add Fri 'DB Deadlifts' (BYOP 00 D10) *axial; glutes no room (session/time cap) |
| 6 | chest no room (session/time cap); glutes no room (session/time cap); back add Thu 'Bent Over Barbell Rows' (BYOP 00 D5) |
| 7 | chest no room (session/time cap); glutes no room (session/time cap) |
| 8 | chest no room (session/time cap); quads add Thu 'Leg press' (BYOP 00 D4) ~non-axial; hamstrings add Tue 'Hyper extensions ' (LIB AN55) ~non-axial; glutes no room (session/time cap); back add Mon 'Lat Pulldowns Close Grip' (LIB U14) [block-2 grip change]; biceps bonus Sat 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (LIB AS12) (bonus); triceps no room (session/time cap); side_delts no room (session/time cap); rear_delts add Mon 'Seated DB Reverse Flies' (LIB AH15); calves add Tue 'Calf Raises w/ DB ' (LIB AU11) |

**Chest and quads exercise by exercise (session order):**

| Week | Chest: Tue / Fri / Wed Focus / Sat Focus (session order) | Quads: Mon / Thu (bilateral, unilateral, leg ext.) |
|---|---|---|
| 1 | 4 · 4 · 3/3 · 3/3 | 3/3/2 · 3/3/2 |
| 2 | 5 · 4 · 3/3 · 3/3 | 3/3/2 · 3/3/2 |
| 3 | 5 · 5 · 3/3 · 3/3 | 3/3/2 · 3/3/2 |
| 4 | 5 · 5 · 3/3 · 3/3 | 3/3/2 · 2/3/2 |
| 5 | 5 · 5 · 3/3 · 3/3 | 4/3/2 · 2/3/2 |
| 6 | 5 · 5 · 3/3 · 3/3 | 4/3/2 · 2/3/2 |
| 7 | 5 · 5 · 3/3 · 3/3 | 4/3/2 · 2/3/2 |
| 8 | 5 · 5 · 3/3 · 3/3 | 4/3/2 · 3/3/2 |

**Week 8:**

* **Mon**: 'Plank' (LIB O10) 2 · 'Side Plank ' (LIB P9) 2 · 'Front Squats' (LIB AI46) *axial 4 · 'Machine Row Pronated Grips' (LIB X11) [block-2 grip change] 5 · 'Front Foot Elevated Lunges (FFE)' 10/10, contralateral DB (LIB AL15; 4T E38 'FFE CONTRA LUNGES') 3 · 'Lat Pulldowns Close Grip' (LIB U14) [block-2 grip change] 5 · 'Leg Extensions' (LIB AM9) 2 · 'Hammer Db Curls' (LIB AS13) 4 · 'Seated DB Reverse Flies' (LIB AH15) 3 · 'Standing Calf raises (use deficit)' (LIB AU9) 4
* **Tue**: 'Leg Raises' (LIB R9) 2 · 'Side Planks ' (LIB S9) 2 · 'DB Bench Press' (LIB AD94) 5 · 'Hyper extensions ' (LIB AN55) ~non-axial 4 · 'Reverse Hyper Extension' (LIB AN11) ~non-axial [block-2 stance swap for 'Alternating DB Deadlifts'] 3 · 'Incline Seated DB Press' (LIB AA9) 3 · 'Lying Leg Curls' (LIB AR10) 3 · 'Overhead cable tricep extension' (LIB AT16) 4 · 'Seated Lateral Raises w/ DB ' (LIB AH9) 4 · 'Calf Raises w/ DB ' (LIB AU11) 4
* **Thu**: 'Plank' (LIB O10) 2 · 'Side Plank ' (LIB P9) 2 · 'Leg press' (BYOP 00 D4) ~non-axial 3 · 'Bent Over Barbell Rows' (BYOP 00 D5) 5 · 'Belt squat' (EQ-11: no axial load; no library cell) ~non-axial [block-2 stance swap for 'Reverse Lunges '] 3 · 'Lat Pulldown Pronated Grip' (BYOP 00 D7) 4 · 'Leg Extensions' (BYOP 00 D9) 2 · 'Ez Bar Curls' (BYOP 00 D8) 4 · 'Machine reverse fliez' (LIB AH20) 2 · 'Machine Calf Raises' (BYOP 00 D3, moved to the end) 3
* **Fri**: 'Leg Raises' (LIB R9) 2 · 'Side Planks ' (LIB S9) 2 · 'Push Ups ' (BYOP 00 D11) 5 · 'DB Deadlifts' (BYOP 00 D10) *axial 4 · 'Staggered Stance DL w/ DB ' 10/10, contralateral DB (BYOP 00 D12; RP C20) 3 · 'DB Push press' (BYOP 00 D13; coach: 5 x '6 to 8 Reps') 5 · 'Seated leg curls' (LIB AR9) 2 · 'Cable tricep push downs' (LIB AT17) 4 · 'Cable machine Leaning Side raises ' (LIB AH19) 4 · 'Standing DB calf Raises (Use Deficit)' (LIB AU10) 3
* **Wed**: 'Crunches' (LIB O11) 2 · Focus 1: 'Incline db press' (LIB AZ245) 3 · Focus 2: 'Cable flies' (LIB AZ249) 3 · Focus: 'Hip Thrust Machine' (LIB AN51) 2 · 'Inclined Cable Machine Side Raises' (LIB AH14) (bonus) 2 · 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (LIB AS12) (bonus) 2
* **Sat**: 'Woodchoppers' (LIB Q9) 2 · Focus 1: 'Incline db press' (LIB AZ245) 3 · Focus 2: 'DB flies' (LIB AZ248) 3 · Focus: 'Hip Thrust Machine' (LIB AN51) 2 · 'Inclined Cable Machine Side Raises' (LIB AH14) (bonus) 2 · 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (LIB AS12) (bonus) 2

Minutes in week 8: Mon 66.8, Tue 64.6, Thu 70.8, Fri 66.8, Wed 34.2, Sat 34.2 min; supersets on Fri, Tue, Mon.

**What happened, rule by rule.**

* **Person-based rate (VOL-05).** The same week's rate applies to every muscle; chest (the priority) used it in full, the others at most 3 %. Total resistance sets went 121 → 140 (+15.7 % in 8 weeks); no week rose more than 5.3 %, well under the 10 % ceiling (UNI-05).
* **Bank and VOL-07 order.** Chest went 20 → 21 → 22 in weeks 2-3: the first set went to 'DB Bench Press' on Tuesday (the first chest exercise of the week's first chest day), the next to 'Push Ups ' on Friday (day rotation). From week 3 every chest exercise was at its maximum (presses 5, Focus slots 3) and every training day already held 8 resistance exercises, so the bank waited and chest progressed by load and reps (DB bench table below). Chest ends at 22 of its 26 cap. Whether the generator may swap a non-priority exercise for a second chest exercise on the chest day is open question 19.
* **Bonus exercises (VOL-07).** Biceps, which sit at the end of the pull days, got 'Cable Machine Curls (Zone1, Zone 2, Zone 3' as a 2-set bonus on the optional days (weeks 4 and 8); side delts got a cable side raise bonus. Supersets switched on Monday, Tuesday and Friday when the time ran short (ORD-05).
* **GEN-05 gate.** The week-3 "10 - I'm done" on the leg press cut that exercise by one set and held quads for a week (16 → 15), then the bank refilled it.
* **Block change at week 5 (PER-02, UNI-02, CAT-13).** The lower share moved 0.48 → 0.78 (target 0.80) by two stance swaps that keep the axial budget, 'Reverse Lunges ' → belt squat (no axial load, EQ-11) and 'Alternating DB Deadlifts' → 'Reverse Hyper Extension' (LIB AN11), plus one set moved from the contralateral FFE lunge to the front squat. Two grip changes completed the block's small variables ('Machine Row Close Grip' → 'Machine Row Pronated Grips', 'Lat Pulldown Supinated Grip ' → 'Lat Pulldowns Close Grip'). The contralateral FFE lunge and the contralateral staggered-stance deadlift stay as the health accessories CAT-13 describes; because the share then sat inside the ±3-point band, the VOL-07 order gave the lunge back its set in week 5, and the share settled at 0.76-0.78. Whether the 50/50 → 80/20 move should happen at the block change or gradually is open question 9.
* **Glutes stayed short of their start** (13-14.25 vs 17) although the engine added a 'Hip Thrust Machine' Focus slot on both optional days: with helpers at 0.25, squats and lunges give glutes little credit. Counted Pelland's way the same plan meets the start:

| Count | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Coach count (helpers 0.25), W1 | 16 | 17 | 13 | 20 | 16 | 12 | 12.5 | 12 | 6 | 12 | 20 |
| Pelland count (indirect 0.5), W1 | 16 | 18 | 16 | 20 | 16 | 16 | 18 | 14 | 8 | 12 | 20 |
| Coach count, W8 | 17 | 20 | 14.25 | 22 | 19 | 16.75 | 14 | 14 | 7.5 | 14 | 20 |
| Pelland count, W8 | 17 | 21 | 17.5 | 22 | 19 | 21.5 | 20 | 16 | 10 | 14 | 20 |

* That is open question 5 (and 12's decision 3).

**Volume load, 'DB Bench Press' on Tuesday** ('8 to 12 Reps' at 1-2 RIR; one lever per exercise per week; INFERRED illustration):

| Week | Sets | Reps | Load (both DBs, kg) | VL (kg) | Best-set e1RM (Epley, kg) | Lever used |
|---|---|---|---|---|---|---|
| 1 | 4 | 10/10/9/9 | 60 | 2,280 | 80.0 | baseline, 1-2 RIR |
| 2 | 5 | 10/10/9/9/9 | 60 | 2,820 | 80.0 | +1 set this week: load and rep target held |
| 3 | 5 | 11/11/10/10/10 | 60 | 3,120 | 82.0 | no new set: reps +1 (double progression) |
| 4 | 5 | 12/12/11/11/11 | 60 | 3,420 | 84.0 | no new set: reps +1 (double progression) |
| 5 | 5 | 12/12/12/12/12 | 60 | 3,600 | 84.0 | no new set: reps +1 (double progression) |
| 6 | 5 | 10/9/9/9/9 | 64 | 2,944 | 85.3 | top of the 8-12 bracket last week: load +4 kg (next DB pair), reps reset |
| 7 | 5 | 11/10/10/10/10 | 64 | 3,264 | 87.5 | no new set: reps +1 (double progression); hold week for volume (median EFFORT 9 in W6) |
| 8 | 5 | 12/11/11/11/11 | 64 | 3,584 | 89.6 | no new set: reps +1 (double progression) |

VL climbs 58 % to week 5, then falls 18 % in week 6 although the client got stronger (e1RM 84.0 → 85.3 kg): VL is logged and shown, never steered on, and progress across a load jump is checked with e1RM (3.9).

**Next plan, week 1 (deload, about half the sets, PER-05):** quads 10, hams 11.5, glutes 8, chest 14, back 11, biceps 8.75, triceps 7.75, side d. 7.25, rear d. 4.5, calves 8, abs 10; 80 resistance sets vs 140 in W8. Same exercises, 3+ RIR, no MYO, supersets or finishers.

### 3.13 Worked example B: basketball guard, 12-week off-season

**Client.** 19 y basketball guard, competitive, off-season, L2 (2+ years of structured training), 4 days x 90 min, **12-week plan** (PER-01, his preferred shape). Intake per GEN-02: sport + position + season, body weight, training experience in years (no sex field). Basketball gets "a good mix of ballistics and plyos" (ATH-01) and the top plyo volume (ATH-02).

**Session shape (VOL-08, VOL-17, 05 v1 athletic cross-pattern layout).** Every day = core block (2) → athletic block (2 jumps or 1 jump + 1 COD, 1 throw, 1 Olympic derivative) → two resistance pairs → calves → one small exercise = **12 exercises** (his maximum for an off-season field athlete). Cross-pattern pairing (UNI-06, the 05 v1 athletic default), hip + push and knee + pull (UNI-11). One axial squat (Mon 'Front Squats') and one axial hinge (Fri 'Hex Bar Deadlifts') a week (PER-04); the second squat exposure is the box pistol (LIB-09), the second hinge a contralateral staggered-stance deadlift. Lower share about 20/80 (UNI-02 "80% or 90%" unilateral; 12's COD profile 0.20 at the start, 0.15 later), upper about 20/80; loaded single-leg work mostly contralateral (CAT-13), plus frontal-plane lunges (UNI-12).

**Base and caps** (12 3.4 field athlete off-season: lower x 0.7, upper x 0.5; glutes and arms credit only; rear delts their own sets; calves 3 per leg day; PROPOSED factors):

|  | quads | hams | chest | back | rear d. | calves | glutes, biceps, triceps, side delts |
|---|---|---|---|---|---|---|---|
| Base (L2 15 x 0.7 lower / x 0.5 upper, round half up) | 11 | 11 | 8 | 8 | 6 | 12 | credit only |
| Cap (base x 1.3) | 14 | 14 | 10 | 10 | 8 | 14 | - |

**Week 1:**

* **Mon**: 'Plank' (LIB O10) 2 · 'Coppenhaggen Plank' (LIB S10) 2 · 'Medium Depth Drop' (JL E3) 3 · 'Ankle Hops ' (JL E4) 2 · 'Situps to overhead throw' (JL E5), 6-8 lb 2 · 'Power Clean' (JL E7), from the high hang 3 · 'Front Squats' (JL E8) *axial 2 · 'Cable Machine UL Rows' 10/10 (JL E9) 2 · Single-leg RDL 8/8, contralateral DB (generic; no library cell) 2 · 'Kneeling Landmine Press' 8/8 (LIB AA93) 2 · Single-leg 'Standing Calf raises (use deficit)' 12/12 (LIB AU9) 3 · 'Seated DB Reverse Flies' (LIB AH15) 2
* **Tue**: 'Woodchoppers' (LIB Q9) 2 · 'Side Planks ' (LIB S9) 2 · 'SL Depth Drops' (JL E13) 3 · 'Shuffles' (LIB L13) 2 · 'Rotational Scoop R' / 'L' (LIB K13/K14), 8 lb 2 · 'High hang snatch pull' (LIB C14) 3 · 'Staggered Stance DL w/ DB ' 8/8, contralateral DB (LIB AQ12; RP C20) 2 · 'Alternating Flat Bench Press' (LIB AD127; UNI-07) 4 · 'Rear Foot Elevated Lunges (RFE)' 8/8, contralateral DB (LIB AL16; RP C20) 3 · 'Unilateral Lat Pulldowns ' 10/10 (LIB U91) 2 · Single-leg 'Calf Raises w/ DB ' 12/12 (LIB AU11) 3 · 'Nordic Curl' (LIB AN91), assisted 2
* **Thu**: 'Plank' (LIB O10) 2 · 'Coppenhaggen Plank' (LIB S10) 2 · 'Mid Box Jump (up to knee)' (LIB G14) 3 · 'Bilateral Lateral Hurdle Hops' (LIB I11) 2 · 'Overhead throw' (LIB K10), 6-10 lb 2 · 'High hang clean pull' (LIB C12) 3 · 'Single Leg Get Ups' 6/6 (LIB AL14 = box pistol, LIB-09) 3 · 'DB/ Kb Rows' 10/10 (LIB X91) 2 · 'Alternating DB Deadlifts' 8/8 (LIB AQ13) 2 · 'Alternating Db press' (LIB AA92; UNI-07) 2 · Single-leg 'Standing Calf raises (use deficit)' 12/12 (LIB AU9) 3 · 'Machine reverse fliez' (LIB AH20) 2
* **Fri**: 'Woodchoppers' (LIB Q9) 2 · 'Side Planks ' (LIB S9) 2 · DB squat jump, stick (10-20 % body weight, EQ-15; generic) 3 · 'DIG/OUT' (JL E6) 2 · Half-kneeling rotational scoops (LIB K21:K24), 8 lb 2 · 'Power Snatch' (LIB E9), from the high hang 3 · 'Hex Bar Deadlifts' (LIB AN47) *axial 2 · 'Push Ups ' (BYOP 00 D11) 3 · 'Side Lunges' 8/8, contralateral DB (LIB AL12; RP C20; frontal plane, UNI-12) 2 · 'Stricted Pull-ups feet in front ' (JL E11) 2 · Single-leg 'Calf Raises w/ DB ' 12/12 (LIB AU11) 3 · 'Supine Glidder hamstring curls' (LIB AN18) 2

**Weekly resistance sets (coach count), shares, and the rate used to build each week:**

| Wk | phase | rate | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets | lower bilateral | upper bilateral | contra / ipsi share of loaded single-leg sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | accl | - | 10 | 12 | 6.5 | 7 | 8 | 2 | 2.75 | 1 | 5 | 12 | 16 | 57 | 0.22 | 0.26 | 64 % / 0 % |
| 2 | accl | 3 % | 10 | 12 | 6.5 | 7 | 8 | 2 | 2.75 | 1 | 5 | 12 | 16 | 57 | 0.22 | 0.26 | 64 % / 0 % |
| 3 | accl | 3 % | 10 | 12 | 6.5 | 7 | 8 | 2 | 2.75 | 1 | 5 | 12 | 16 | 57 | 0.22 | 0.26 | 64 % / 0 % |
| 4 | drive | 5 % | 11 | 13 | 7.25 | 7 | 8 | 2 | 2.75 | 1 | 5 | 13 | 16 | 60 | 0.25 | 0.26 | 67 % / 0 % |
| 5 | drive | 5 % | 11 | 13 | 7.25 | 8 | 9 | 2.25 | 3 | 1 | 5.25 | 13 | 16 | 62 | 0.25 | 0.24 | 67 % / 0 % |
| 6 | drive | 7 % | 12 | 14 | 8 | 8 | 9 | 2.25 | 3 | 1 | 6.25 | 14 | 16 | 66 | 0.23 | 0.24 | 71 % / 0 % |
| 7 | drive | 3 % | 12 | 14 | 8 | 8 | 10 | 2.5 | 3 | 1 | 6.25 | 14 | 16 | 67 | 0.23 | 0.23 | 71 % / 0 % |
| 8 | drive | 5 % | 13 | 14 | 8.25 | 9 | 10 | 2.5 | 3.25 | 1 | 6.25 | 14 | 16 | 69 | 0.22 | 0.26 | 67 % / 0 % |
| 9 | drive | hold | 13 | 14 | 8.25 | 9 | 10 | 2.5 | 3.25 | 1 | 6.25 | 14 | 16 | 69 | 0.22 | 0.26 | 56 % / 11 % |
| 10 | final | 5 % | 14 | 14 | 8.5 | 9 | 10 | 2.5 | 3.25 | 1 | 6.25 | 14 | 16 | 70 | 0.21 | 0.26 | 53 % / 16 % |
| 11 | final | 5 % | 14 | 14 | 8.5 | 10 | 10 | 2.5 | 3.5 | 1 | 7.25 | 14 | 16 | 72 | 0.21 | 0.29 | 53 % / 16 % |
| 12 | final | 5 % | 14 | 14 | 8.5 | 10 | 10 | 2.5 | 3.5 | 1 | 7.25 | 14 | 16 | 72 | 0.21 | 0.29 | 53 % / 16 % |

Rates: weeks 2-3 acclimation (capped at 3 %); week 7 = a travel week (3 %); week 8 median EFFORT 9 → week 9 hold. Minutes in week 12: Mon 85.8, Tue 83.1, Thu 83.2, Fri 77.8 min; supersets on Tue.

**Engine log and block changes:**

| Week | Engine log (verbatim from the run) |
|---|---|
| 2 | - |
| 3 | - |
| 4 | quads add Mon 'Front Squats' (JL E8) *axial; hamstrings add Mon Single-leg RDL 8/8, contralateral DB (generic; no library cell); calves add Mon Single-leg 'Standing Calf raises (use deficit)' 12/12 (LIB AU9) |
| 5 | block 2 compound rep phase VOL 1 (12-15) -> VOL 2 (8-12) PER-11; block 2 lower bilateral target 0.20 -> 0.15 12 3.11; block 2 change Tue 'Rear Foot Elevated Lunges (RFE)' 8/8, contralateral DB -> 'Rear Foot Elevated Lunges (RFE)' 8/8, front-racked contralateral DB; chest add Tue 'Alternating Flat Bench Press' (LIB AD127; UNI-07); back add Mon 'Cable Machine UL Rows' 10/10 (JL E9) |
| 6 | quads add Tue 'Rear Foot Elevated Lunges (RFE)' 8/8, front-racked contralateral DB (RP C24; block-2 laterality step); hamstrings add Tue 'Staggered Stance DL w/ DB ' 8/8, contralateral DB (LIB AQ12; RP C20); rear_delts add Mon 'Seated DB Reverse Flies' (LIB AH15); calves add Tue Single-leg 'Calf Raises w/ DB ' 12/12 (LIB AU11) |
| 7 | hamstrings at cap; back add Tue 'Unilateral Lat Pulldowns ' 10/10 (LIB U91); calves at cap |
| 8 | quads add Thu 'Single Leg Get Ups' 6/6 (LIB AL14 = box pistol, LIB-09); chest add Fri 'Push Ups ' (BYOP 00 D11) |
| 9 | block 3 compound rep phase VOL 2 (8-12) -> VOL 3 (6-8) PER-11; block 3 change Fri 'Side Lunges' 8/8, contralateral DB -> 'Side Lunges' 8/8, ipsilateral DB |
| 10 | quads add Fri 'Side Lunges' 8/8, ipsilateral DB (LIB AL12; RP C22; block-3 laterality step, 'out of the hip'); hamstrings at cap; back at cap; calves at cap |
| 11 | chest add Fri 'Push Ups ' (BYOP 00 D11); rear_delts add Thu 'Machine reverse fliez' (LIB AH20) |
| 12 | quads at cap; hamstrings at cap; back at cap; calves at cap |

**Athletic budget (its own units, never muscle sets, VOL-10):**

| Wk | Jump sets | Plyo / ballistic sets | Plyo share (planned → actual) | Plyo method stage (PROPOSED name) | Plyo contacts / week (per session) | Throws / week | Olympic: sets per week x reps @ %1RM (4 slots) | Compound rep phase (PER-11) |
|---|---|---|---|---|---|---|---|---|
| 1 | 17 | 8 / 9 | 45 % → 47 % | RC1 receive & pause | 48 (12) | 80 | 12 x 5 @ 75 % | VOL 1 (12-15) |
| 2 | 17 | 8 / 9 | 46 % → 47 % | RC1 receive & pause | 48 (12) | 80 | 12 x 5 @ 75 % | VOL 1 (12-15) |
| 3 | 17 | 8 / 9 | 48 % → 47 % | RC1 receive & pause | 48 (12) | 80 | 12 x 5 @ 75 % | VOL 1 (12-15) |
| 4 | 19 | 9 / 10 | 49 % → 47 % | RC2 receive then create | 72 (18) | 80 | 12 x 4 @ 80 % | VOL 1 (12-15) |
| 5 | 19 | 10 / 9 | 50 % → 53 % | RC2 receive then create | 80 (20) | 80 | 12 x 4 @ 80 % | VOL 2 (8-12) |
| 6 | 19 | 10 / 9 | 52 % → 53 % | RC2 receive then create | 80 (20) | 80 | 12 x 4 @ 80 % | VOL 2 (8-12) |
| 7 | 19 | 10 / 9 | 53 % → 53 % | RC2 receive then create | 80 (20) | 80 | 12 x 3 @ 85 % | VOL 2 (8-12) |
| 8 | 21 | 11 / 10 | 55 % → 52 % | RC3 repeated receive/create | 110 (27.5) | 80 | 12 x 3 @ 85 % | VOL 2 (8-12) |
| 9 | 21 | 12 / 9 | 56 % → 57 % | RC3 repeated receive/create | 120 (30) | 80 | 12 x 3 @ 85 % | VOL 3 (6-8) |
| 10 | 21 | 12 / 9 | 57 % → 57 % | RC3 repeated receive/create | 120 (30) | 80 | 12 x 2 @ 90 % | VOL 3 (6-8) |
| 11 | 21 | 12 / 9 | 59 % → 57 % | RC3 repeated receive/create | 120 (30) | 80 | 12 x 2 @ 90 % | VOL 3 (6-8) |
| 12 | 21 | 13 / 8 | 60 % → 62 % | RC3 repeated receive/create | 130 (32.5) | 80 | 12 x 2 @ 90 % | VOL 3 (6-8) |

**What happened, rule by rule.**

* **Resistance supports, athletics lead.** Resistance sets went 57 → 72 (+26 % over 12 weeks; largest weekly rise +6.5 %) and the target muscles reached their athlete caps between weeks 6 and 11 (hamstrings and calves week 6, back week 7, quads week 10, chest week 11); the "driving hard" weeks come from the athletic side (plyo share, method stage, contacts, Olympic %), which is how the coach describes athletes ("athletes that are field athletes don't need to get bigger and stronger that much", UNI-02).
* **Bilateral : unilateral.** Lower 21-25 % bilateral and upper 23-29 %: the low edge of his 80-90 % unilateral. Each bilateral pattern appears once a week (Monday squat, Friday hex-bar deadlift); whether a COD athlete should keep both bilateral patterns twice a week at lower sets is open question 6.
* **Contra / ipsi (CAT-13).** About two thirds of loaded single-leg sets are contralateral in blocks 1-2 (near the PROPOSED ~70 %); block 3 turns the frontal-plane lunge ipsilateral ('out of the hip'), giving about 53 % contra / 16 % ipsi.
* **Variation (PER-02, PER-11).** Exercises stay fixed inside each 4-week block. Week 5: the compound rep phase moves VOL 1 (12-15) → VOL 2 (8-12) and the RFE lunge goes front-racked (RP C24, 'HARDER'); week 9: VOL 2 → VOL 3 (6-8) and the side lunge goes ipsilateral.
* **Plyos (CAT-10, CAT-11, ATH-01).** The block starts more ballistic and ends more plyometric (plyo share 47 % → 62 % of jump sets, PROPOSED basketball band 45 → 60 %); the method stage moves receive & pause → receive then create → repeated receive/create (PROPOSED names RC1-RC3), bilateral before single-leg inside each stage. Contacts peak at 32.5 per session, far under the NSCA L2 guide of 100; his own sessions run at 18-77 counted contacts.
* **Olympic lifts (ATH-10, PER-09).** Everyone in athletic training gets them. Under ATH-10 an intermediate (L2) athlete may use the full scope, up to the full squat lifts; this example keeps high-hang power versions and pulls in all three blocks, which is the run's INFERRED choice for a 19-year-old's first planned off-season, not a level limit (LV-12). The % ramp is the coach's 75 → 90 %; reps per set fall 5 → 2 by the speed-loss rule for a power athlete (INFERRED; his strength-plan default is 4 x 8 → 4 x 4, open question 1).
* **Medballs (EQ-06).** 8 lb for rotational scoops, 6-8 lb for sit-up throws, 6-10 lb overhead.

---

## 4. Variation policy ("don't confuse the muscle")

### 4.1 The coach's rule

* COACH-CHAT: "Having a lot of variables is usually good, but you don't want to always be trying to 'confuse' the muscle ... not a lot of new things, more like looking at the same over the same block, and in the next block you can change some small variables."
* **COACH-ANSWER PER-02 (RIGHT):** exercises stay fixed for the 4-6-week block; next block change one or two of grip, stance, implement, range of motion or rep range; never all at once.
* **COACH-ANSWER PER-03 (RIGHT):** the weekly A/B swap is "mostly in those [strength and fat-loss tracks], but also can be ... week A and week B essentially in different programs. We just have to understand that sometimes athletes and people want more variety ... If they don't really need a lot of variety, then they don't have it."
* **COACH-ANSWER PER-04 (RIGHT):** the second time a slot comes up in the week it is a different exercise of the same category, and the spine is loaded once a week ("one day of squatting and the other day of leg pressing").
* **COACH-ANSWER PER-06 (RIGHT):** a client moves up a level in a slot at the end of a block if it felt like '8 - That was perfect' or easier with no pain.
* OBSERVED: "****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus" (SQ A5); '***Never do the same color workout in the same week' (AE A5): conditioning is the one place he *requires* weekly variety.
* COACH-ANSWER CAT-05 / CAT-06: levels add options and are "very theoretical"; client level and exercise level are separate. "Change some small variables" therefore does **not** mean "move up a level" by default (VP-12).

### 4.2 What the sheets actually do: variation audit (OBSERVED counts, unchanged from v0)

**Method.** For every multi-week program, each slot (same day + same row, or BASEBALL Part + index) was compared week to week (cell-validated sessions in `prog_mm_equipment.json`; deload and empty weeks skipped). Each transition is one of **SAME** (identical text), **SMALL_VARIABLE** (same pattern and implement, different variant), **IMPLEMENT_SWAP** or **PATTERN_SWAP**. Spelling noise lands in SMALL_VARIABLE, so SAME is a lower bound. Script `variation_audit.py` (section 9).

| Program / variant | Transitions | SAME | SAME + SMALL | IMPL. SWAP | PATTERN SWAP | Changes that return to the w−2 exercise (A/B) | Slots with ≤ 2 distinct exercises | Mean distinct exercises per slot |
|---|---|---|---|---|---|---|---|---|
| 4T AESTHETICS-12 | 343 | 48.7 % | 60.9 % | 66 | 68 | 81.3 % | 53 % of 32 | 2.53 over 11.7 wk |
| 4T STRENGTH-12 | 176 | 18.8 % | 31.2 % | 0 | 121 | 78.5 % | 62 % of 16 | 2.69 over 12.0 wk |
| 4T AESTHETICS-8 | 110 | 27.3 % | 38.2 % | 0 | 68 | 27.3 % | 22 % of 18 | 3.67 over 7.1 wk |
| 4T STRENGTH-8 | 90 | 20.0 % | 25.6 % | 2 | 65 | 40.0 % | 33 % of 15 | 3.80 over 7.0 wk |
| CONJUGATE (draft) | 90 | 20.0 % | 21.1 % | 2 | 69 | 41.7 % | 40 % of 15 | 3.73 over 7.0 wk |
| 4T HYBRID | 105 | 32.4 % | 81.0 % | 14 | 6 | 19.7 % | 40 % of 15 | 4.40 over 8.0 wk |
| FAT BURN | 66 | 18.2 % | 27.3 % | 0 | 48 | 33.3 % | 27 % of 22 | 2.91 over 4.0 wk |
| BASEBALL Block 1 (off-season) | 212 | 10.8 % | 50.9 % | 43 | 61 | 2.0 % | 17 % of 41 | 5.46 over 6.2 wk |
| BASEBALL Block 2 (pre-season) | 223 | 4.0 % | 48.9 % | 42 | 72 | 17.4 % | 9 % of 43 | 5.23 over 6.2 wk |
| BASEBALL Block 3 (in-season) | 255 | 9.8 % | 50.2 % | 65 | 62 | 29.5 % | 10 % of 40 | 5.17 over 7.4 wk |
| **All** | **1,670** | **22.1 %** (369) | **47.7 %** | **234 (14.0 %)** | **640 (38.3 %)** |  |  |  |

By tier (all programs):

| Tier | Transitions | SAME | SMALL_VARIABLE | IMPLEMENT_SWAP | PATTERN_SWAP |
|---|---|---|---|---|---|
| T1 power | 200 | 3.5 % | 100 | 14 | 79 |
| T2 power-strength | 125 | 0.0 % | 54 | 16 | 55 |
| T3 strength | 256 | 16.8 % | 77 | 21 | 115 |
| T4 resistance patterns | 522 | 30.7 % | 105 | 54 | 203 |
| T5 isolation | 389 | 28.0 % | 33 | 81 | 166 |
| core | 97 | 10.3 % | 31 | 34 | 22 |
| conditioning | 81 | 49.4 % | 27 | 14 | 0 |

**Block-fixed by construction** (no week-by-week exercise columns), all OBSERVED: BOXING's week 1-2 list (column D) and week 3-8 list (column L), 6 weeks on one list; the ATHLETIC FULL BODY levels ('First 8 weeks (8wk1) adaptation focus:', MM 05 A41); UPPER/LOWER and PPL; every BYOP template (single week; in the 4-day tabs the third training day repeats the first; the 3 DAY BUILDER's Day 3 is its own mixed day, BYOP 01 C23:C27).

**Reading.** His stated rule, now confirmed (PER-02), is what his newest, generator-facing material does: BYOP, BOXING, the ATHLETIC levels. His week-by-week tabs keep the slot pattern but change the exercise in 78 % of transitions, in three styles: a two-menu A/B (4T 12-week tracks, FAT BURN, conjugate; 78.5-81.3 % of the 12-week tracks' changes return to the exercise of two weeks before), one small variable per week (AESTHETICS-8 lunges 'FFE CONTRA' → 'FFE IPSI' → 'RFE CONTRA' → 'RFE IPSI', 4T E38:H38), and a new weekly menu inside a fixed slot and speed zone (BASEBALL, about 5 exercises per slot per block). PER-03 keeps A/B as an option for variety seekers; the BASEBALL style stays unconfirmed (open question 12).

### 4.3 Policy for the generator

| ID | Rule | Status |
|---|---|---|
| VP-1 | Block = fixed menu for 4-6 weeks (8-week plan = 2 x 4; 12-week = 3 x 4 or 2 x 6; week-by-week = a boundary every 4-6 weeks). Block boundaries are where exercises change; the 12-week phases of 12 3.12 (acclimation 1-3, driving 4-9, hardest 10-12) set the rate limits and need not coincide with them. Each slot keeps its exercise inside the block; weekly change is limited to sets, reps, load and RIR. | COACH-ANSWER PER-02 (RIGHT) + COACH-CHAT; OBSERVED BYOP, BOXING wk 3-8, ATHLETIC 'First 8 weeks (8wk1)' (MM 05 A41); SCIENCE [S81][S83][S85] |
| VP-2 | Optional two-menu A/B weeks for any program when the client wants variety: menu A on odd weeks, menu B on even weeks, each fixed for the block; in strength and fat-loss tracks the lead lift alternates squat <-> hinge or bench <-> overhead press. Off by default. | COACH-ANSWER PER-03 + OBSERVED 4T 'A WEEK'/'B WEEK' (O33:P33), audit N8 |
| VP-3 | Zone-constant rotation only in athletic accessory slots (plyo, throw, loaded jump, Part-C speed variants), and only if the coach confirms it (open question 12): the drill or implement may change weekly while velocity zone and pattern stay fixed. The plyo method stage (receive & pause -> receive then create -> repeated) is a way of performing the same jump and may move inside a block (CAT-11). Skill anchors (Olympic lift, main squat/hinge/press, main sprint drill) stay fixed for the block (PER-02) and >= 8 weeks for strength and athletic goals (SCIENCE). | OBSERVED BASEBALL (4.2); COACH-ANSWER PER-02, CAT-11; SCIENCE [S82][S83][S15]; flag I6 |
| VP-4 | At a block boundary each slot changes one or two small variables, never all at once: the coach names grip, stance, implement, ROM and rep range. Full pattern-level replacement for <= 1/3 of slots. Pick from the between-block order (4.4), smallest perturbation first. A stance change may swap a lift's laterality when the profile's bilateral share moves (V22). | COACH-ANSWER PER-02 (RIGHT); 06 L06; 10b VARI-2, GRD-2; laterality swap PROPOSED (12 3.9) |
| VP-5 | Size of a 'small' change: one colour step on his ladders (green -> yellow -> red); one notch on the REPS menu ('10 to 15 Reps' <-> '8 to 12 Reps'); +/-1 constraint level; one stance step; one load-position step (VP-10); one plyo method stage; one Olympic start-height rung. Two variables at most on one slot (PER-02). | OBSERVED ladders (RP colours, SQ A10:H11, LU, OL A5:A30, S23); COACH-ANSWER PER-02; magnitude INFERRED |
| VP-6 | The second time a slot comes up in the week it uses a different exercise of the same category (PER-04). For squats and hinges the second exposure is the non-axial one: leg press or belt squat for the squat, a non-axial hinge (hip thrust, back extension, reverse hyper, GHD, cable pull-through) for the hinge (V25). A speed twin vs a strength twin is allowed if only one is axial (LV-9). A muscle's 3-4 menu exercises on its day are fixed variety, not 'confusion'. | COACH-ANSWER PER-04 (RIGHT), EQ-11, VOL-07; OBSERVED JL E8/E35 (no longer reproduced); non-axial hinge pool PROPOSED (05 6.4) |
| VP-7 | Mid-block swap triggers (the only ones): 'Felt a PAIN' -> swap in category to a more constrained, split-grip or unilateral variant (UNI-08), then -30-50 %, then drop the exercise (VOL-03); 'Felt the WRONG muscle' twice -> change one variable; "Couldn't do it" -> one level down or an assisted version; two exposures with no rep or load progress at a good readiness -> change one variable. Never swap for soreness or novelty. | COACH-ANSWER GEN-05, VOL-03, UNI-08 + OBSERVED dropdowns (LIB AY8:AY11); SCIENCE [S25][S85] |
| VP-8 | Anti-confusion guardrails: <= 2 distinct exercises per slot per block for non-athletic goals (A/B max); 3-4 exercises per muscle on its day (VOL-07) plus bonus or Focus slots; no new exercise in a deload week; soreness is not a target. Replaces v0's '<= 3 exercises per muscle per week'. | COACH-ANSWER VOL-07; INFERRED from 4.2; SCIENCE [S85][S86] |
| VP-9 | Cadence by family: hypertrophy and general block-fixed (A/B only on request); smooth weekly increases for hypertrophy and general clients, 2-week steps and waves for fight or competition prep (PER-10); strength A/B lead-lift rotation as an option; athletes block-fixed with the VOL 1 -> VOL 2 -> VOL 3 rep phases by block (PER-11) and the plyo method stage moving inside the block (CAT-11); a weekly drill rotation inside a fixed velocity zone only if the coach confirms it (open question 12); in-season maintenance menus (PER-08). | COACH-ANSWER PER-10, PER-03 + OBSERVED (06 section 10 cadence; 4.2) |
| VP-10 | Load position is a possible between-block lever (CAT-04): one block may move a lift one step (goblet/zercher -> front squat -> back squat; pushdown (arms down) -> overhead extension (arms overhead)) or one step back for pain, age or a regression; a machine or cable version is an easier step. Treated as a 'small variable' only by INFERENCE: PER-02 names grip, stance, implement, ROM and rep range, and the coach says the levels are theoretical (CAT-05). | COACH-ANSWER CAT-04, CAT-05, CAT-10; use as a small variable INFERRED |
| VP-11 | Core ladder between blocks (CAT-08): segment thorax -> pelvis -> both; plane sagittal -> frontal -> transverse; static -> dynamic. One step per block. Core is never skipped (GEN-08) and opens the session by default (ATH-11). | COACH-ANSWER CAT-08, GEN-08, ATH-11; OBSERVED S23 CT/CP headers; order INFERRED |
| VP-12 | Levels are not a variation engine (CAT-05): never promote a slot just because a block ended. Promote one level at the end of a block when the logs read '8 - That was perfect' or easier with no pain (PER-06), and treat it as that slot's small variable for the next block. | COACH-ANSWER CAT-05, CAT-06, PER-06 (RIGHT) |
| VP-13 | Laterality moves at block boundaries by profile: bodybuilders and powerlifters start a block at about 50/50 with contra/ipsi accessories, then move to 80/20-90/10 (keeping one unilateral accessory only if something bugs them); athletes move toward unilateral as the season gets closer (UNI-10). Pain can move it any week (UNI-02). | COACH-ANSWER UNI-02, UNI-10, CAT-13 |

### 4.4 Between-block variable order (which small variable to change first)

The coach named five (PER-02): grip, stance, implement, range of motion, rep range. The others are INFERRED small variables from his ladders (open question 11). One or two per slot per block, smallest perturbation first.

| Order | Variable | Example of one step | Coach ladder / answer |
|---|---|---|---|
| 1 | Grip / hand placement (coach-named) | pronated -> neutral pulldown | RP I16:I21; 'Neutral grip lat pull down' (4T P46); PER-02 |
| 2 | Feet / body position | feet on bench -> floor | RP I22:I28 (INFERRED as a small variable) |
| 3 | Stance / base (coach-named) | FFE -> RFE; seated -> kneeling press; a stance change may swap laterality | RP C10:C18, E8:E15; PER-02 |
| 4 | Load laterality (contra / ipsi) | contralateral -> ipsilateral; suitcase -> front rack | RP C19:C26; CAT-13 (INFERRED as a small variable) |
| 5 | Load position / zone | goblet -> front squat; pushdown -> overhead extension | SQ A10:H11; S23 AO5:AP6; CAT-04 (INFERRED as a small variable) |
| 6 | ROM / end range (coach-named) | floor -> deficit; dead stop -> touch & go | RP A81:A89; PER-02 |
| 7 | Implement / constraint (coach-named) | machine -> cable -> DB -> barbell (athletes, healthy) or the reverse (pain, older, volume); client preference may choose (EQ-10) | RP G61 -> G68; chat; PER-02, EQ-03 |
| 8 | Tempo | controlled -> slow eccentric (home or control phases) | 'slow eccentric deficit Lunges' (MM 02 EL52) (INFERRED as a small variable) |
| 9 | Rep range (coach-named) | one notch down for compounds, up for isolation, in a new wave; athletes VOL 1 (12-15) -> VOL 2 (8-12) -> VOL 3 (6-8) by block | BASEBALL 'VOL 1' -> 'VOL 3' (MM 02 A20:C22); PER-02, PER-11 |

### 4.5 Within-week variety that is NOT confusion

* The second exposure of a slot is a different exercise of the same category (PER-04), and for squats and hinges the non-axial one: front squat Monday, leg press or belt squat Thursday. The coach's own 'Front Squats' Monday (JL E8) + 'Low Bar Back Squat' Thursday (JL E35) loaded the spine twice and is no longer reproduced.
* Bilateral landing first, then single-leg: 'Medium Depth Drop' (JL E3) Monday → 'SL Depth Drops' (JL E13) Tuesday ("it's harder if it's unilateral hops", CAT-10).
* In BASEBALL each lower pattern gets one *speed* day and one *strength* day (LV-9); only one of the two may be axial.
* A muscle's 3-4 exercises on its day (VOL-07) are fixed variety; new sets go to them in session order (3.6).

---

## 5. Ordering rules, with compliance statistics

Source: `ordering_audit.md` (466 sessions from 17 tabs; every exception listed there with cells), plus `prog_byop_equipment` and `prog_mm_equipment`. **BYOP = the generator-facing templates and, by CAT-07 and ORD-01, the reference.** The last column gives the coach's answer that settled each rule (v0 listed these as pending).

| ID | Rule | All sessions | BYOP templates | Where it breaks (OBSERVED cause) | Generator decision (v1) | Coach answer |
|---|---|---|---|---|---|---|
| R1 | Horizontal pull before vertical pull | 19/67 (28 %) | 13/13 (100 %); MM UL and PPL 6/6 | FAT BURN 0/8, 4T 0/38, BOXING 0/2: 'Lat pull downs' written above 'Rows' (4T O46/O47) | Hard rule: horizontal pull before vertical pull, always (BYOP is the reference; FAT BURN / 4T / BOXING pulldown-first is not followed). INFERRED reason from CAT-04/10: zone 2 (horizontal, 'safer for you when you push and pull') before zone 3 (overhead). | ORD-01 RIGHT |
| R2 | Horizontal push before vertical push | 29/49 (59 %) | 15/15 (100 %) | CONJUGATE / 4T STRENGTH overhead weeks ('HEAVY OH PRESS' is 'the work'); 4T AESTHETICS-12 'Arnold press' weeks | Default H -> V; 'the work' comes first whatever its direction (ORD-02). | ORD-02 RIGHT |
| R3 | Athletic / power work before strength | 128/155 (83 %) | 12/12 | contrast complexes (11, N12); plyos typed in BASEBALL strength slots; HYBRID Tuesday 'JUMPS' after 'BENCH PRESS' | Hard rule except COMPLEX stations (LV-6). | - |
| R4 | Olympic / triple extension before heavy strength | 49/78 (63 %) | 12/12; BASEBALL 32/40 ('OLY' rows above 'bkd'/'bhd') | HYBRID 'STRENGTH' (B74) above 'OLY/ POWER' (B75) 16/16; light DB snatch / high pull used as late 'shoulders' accessories | Hard rule: power before strength (HYBRID's strength-before-OLY is not followed); light ballistic accessories may sit late. | ORD-03 RIGHT |
| R5 | Bilateral before unilateral (same region) | 225/231 (97 %); KD 102/106, HD 84/85 | 100 % | machine MYO finisher last (4T W61); 'Camporini DL' (removed from the library, LIB-09) / step-up cases | Hard rule (machine finisher exempt). | - |
| R6 | Compound before isolation | 227/301 (75 %) | athletic 100 %; aesthetics 50 % | 'Calves' slot 1 on aesthetics A days (00 D3 'Machine Calf Raises'); 4T side raises first on 19/24 push days | Default; isolation first only for a declared priority muscle (calves, side delts...). | ORD-04 RIGHT |
| R7 | Big muscles before small muscles | 178/244 (73 %) | mixed | same as R6; inside the isolation block regions alternate ('Bicep' row 8 before 'Leg Extensions' row 9) | Compound block -> isolation block; alternate regions inside it. | - |
| R8 | Alternate lower / upper (full body) | 165/193 (85 %); adjacent pairs 380/409 | 4-day 100 % | CONJUGATE / 4T STRENGTH lower days ('the work' -> 'the accessory'); BOOTCAMP 2 '2A' | Default L-U-L-U in full-body templates; pairs may be supersetted when time is short, for advanced clients, off-season VO2 work or beginners who do not fatigue. | ORD-05 PARTLY |
| R9 | Knee-dominant with pull, hip-dominant with push | 160/193 (83 %); pairs 186/222 (KD+PULL 104, HD+PUSH 82 vs HD+PULL 27, KD+PUSH 9) | 00/03/04/07/08 100 %; BASEBALL 92/92 | BOOTCAMP 1 Tue/Fri inverse; 3-DAY Day 3; conjugate lower days | Hard rule for full body and bootcamps: hip dominant (posterior lower) with push (anterior upper), knee dominant with pull, to avoid bleed-over. The BOOTCAMP 1 Tue/Fri crossing was a mistake; no crossed variant. | UNI-11, ORD-06 RIGHT |
| R10-core | Core at the end or on a separate day (OBSERVED); v1: core FIRST | 22/165 (13 %) | 100 % (core only on 'Optional' days) | athletes: core is Part B after ballistics, before strength (BASEBALL 112 items); HYBRID core in supersets | Core FIRST in every session as part of the warm-up (about 2 exercises); the user may move it after the plyos, after strength or to the end. Replaces v0's split by family. | ATH-11 NOT RIGHT to v0 |
| R10-cond | Conditioning last or on a separate day | 107/121 (88 %) | 100 % | BOXING opens with cardio (4/4); HYBRID Friday; BOOTCAMP 2 mid-session | Default last / separate; a fighter's cardio-first block is a real aerobic block. | ORD-09 RIGHT |
| R11 | Weekly vector rotation | 29 program/level blocks | 4-day: knee+pull day and hip+push day, each 2x/week | BASEBALL H Mon/Tue, V Thu/Fri; BOOTCAMP crossed planes | By template (05 section 6.1). | - |
| N1 | Arm isolation follows the day's upper pattern | pull-only: biceps 79/136 vs triceps 2; push-only: triceps 73/99 vs biceps 3 | yes | BOOTCAMP 2 antagonist filler | Default. | - |
| N2 | Lower isolation matches the lower pattern | KD-only days: quad iso 10 vs ham iso 1; HD-only days: ham iso 11 vs quad iso 1 | 'Leg Extensions' on KD days, 'Leg Curls' on HD days | - | Default. Under CAT-09 the 'ham iso' is the LEG FLEXION segment: it rides on hip days but is not hip-dominant volume. | - |
| KF-1 | Knee flexion (LEG FLEXION segment) comes after the hinge lifts, and leg extension comes before leg curl when both are in one session | leg extension before leg curl 12/14 (N17) | 'Leg Curls' row after 'Vertical Push' on HD days (00 C14) | BOXING wk 1-2 ('Leg curls' D13 above 'Leg Extentions' D14) | Default; never fill a 'Unilateral HD' or 'Bilateral HD' slot with a curl (NO ACCESS miswire, FIX-01 skipped; the 9 knee-flexion items in LIB AN; CAT-09). | CAT-09; FIX-01 skipped |
| N3 | Unilateral lower: same pattern (aesthetics) vs opposite pattern (athletic, bootcamp) | same 49 (BKD+UKD 29, BHD+UHD 20) vs cross 113 (BKD+UHD 56, BHD+UKD 57) | aesthetics same; athletic BYOP same | - | By goal: same pattern to drive a muscle harder (high-level, aesthetics); cross pattern for less soreness (bootcamp, general; athletes by default in 05 v1). | UNI-06 (no chip; 'Correct. This is a rule by goal') |
| N5 | Inside the power block: plyo / throws / COD / sprint before Olympic | 48/51 | 'Plyo','Plyo','Throwing','COD' above 'Tripple Extension' | 3 sessions | Hard rule. | - |
| N6 | Landing / stick before reactive jumps | 11/13 | - | bilateral before single-leg plyo only 12/21, so not a rule | Default (QM-7). | - |
| N8 | Weekly A/B swap of the lead lift | FAT BURN, CONJUGATE, 4T STRENGTH and AESTHETICS (up to 11 lead changes in 12 weeks) | n/a (days repeat exactly) | - | Optional A/B for clients who want variety, in any program (VP-2). | PER-03 RIGHT |
| N10 | Prep first ('Any Cardio Equipment' 5 min; 'KB Book openers ' before pressing; A-drills before squatting) | UL 6+3, PPL 9+3 sessions | - | - | Warm-up always: 5 min any cardio + A-drills or mobility; A-drills do not count as volume. | ORD-08 RIGHT |
| N11 | Hierarchy 'the work' (1RIR) -> 'the accessory' (2RIR) -> 'the nuance' (MAX) -> 'the survival' (ALL) | CONJUGATE M13:M16, 4T M9:M24 | - | outranks R1/R2 | Strength family backbone: the work (1 RIR) -> the accessory (2 RIR) -> the nuance (MAX) -> the survival (done no matter what). | ORD-07 RIGHT |
| N12 | Contrast: heavy -> fast of the same pattern | 11 instances | - | the one systematic, intended break of R3 | LV-6: intermediate+ athletes, off-season, ~78-85 %, no rest inside the complex. | ATH-12 RIGHT |
| N13 | MYO sets only on the last exercise; 'MAX' / 'ALL' only on the last two slots ('the nuance' / 'the survival') | 13 of 13 MYO cells; 'MAX'/'ALL' at 4T D11:D12, D15:D16, D20, D23 and CONJUGATE D15:D16, D19:D20, D24 (3rd-4th of 4 slots) | JL G12 'MYO SET' on 'Leg Extensions' | - | Hard rule: MYO only on the last machine/isolation exercise (VOL-15); MAX only on small-muscle or bodyweight work (VOL-13). | VOL-15, VOL-13 RIGHT |
| N14 | Supersets pair non-competing patterns | BASEBALL 'Superset - same reps' x19; 4T x8; MM 05 x7 | 'SUPERSET W/ 👇' option (unused) | same-muscle supersets only as contrast or late-block aesthetic finishers | Supersets are a fatigue/density tool (ORD-05); the default pair is the V24 lower/upper pair; same-muscle supersets only as contrast (open question 7). | ORD-05 PARTLY |
| N16 | Squat before hinge when both are bilateral | 54/84 | - | every hinge-first session is in a weekly-alternating program | Default unless A/B week. | - |
| N18 | Bilateral lower lift with the horizontal vector; unilateral with the vertical | BYOP 29 vs 2 and 24 vs 2; MASTER MODEL 70 vs 68 | yes | BASEBALL moves the vertical vectors to Thu/Fri | OBSERVED pattern only. UNI-11 was asked about it and the coach answered with the anterior/posterior pairing (R9), not with horizontal/vertical, so N18 is not a rule; the vertical vector follows the lower lift it is paired with (05 v1). | UNI-11 (answered as R9) |
| C1 | Constraint rises through the session (free and fast first, machines last) | BYOP athletic templates: constraint 1.0 at position 1 -> mean 3.8-3.9 over positions 9-10 (Spearman vs position 0.72-0.78 on the template sessions; 0.36 on JL's filled Monday); JL E3:E12 1,1,3,1,1,2,3,1,1,5; MM athletes 1.58 -> 2.54; UL/PPL 2.4 -> 3.2 | yes | 4T AESTHETICS-12 reverses it (3.78 -> 3.46) | Default sort key 2 after tier. | - |
| C2 | Reps rise as constraint and isolation rise | Spearman 0.72 over 21 filled BYOP slots ('DB Push press' 5 x '6 to 8 Reps' ... 'Leg Extensions' 2 x '20 Reps' / 'MYO SET') | yes | - | Rep matrix (03 9.9). | - |
| Z1 | Horizontal (zone 2, internal-rotation bias) before overhead (zone 3) inside a session; v0 also read it across the week | H -> V in every BYOP session (R1/R2); JL squat Monday 'Front Squats' (E8) -> Thursday 'Low Bar Back Squat' (E35) | yes (n = 1 for the weekly part) | conjugate overhead 'the work' weeks | INFERRED from CAT-04/10; the reason behind R1/R2 only. Its weekly part (front squat Monday, back squat Thursday) is superseded by PER-04 (one axial squat a week). | CAT-04/10; PER-04 |
| AX1 | At most one axial squat and one axial hinge exposure a week | JL Monday 'Front Squats' (E8) + Thursday 'Low Bar Back Squat' (E35) = 2 axial squats (OBSERVED) | AESTHETICS has a 'Bilateral HD' slot on Day 2 (D10 'DB Deadlifts') and Day 4 (D31, unfilled 'CHOOSE 👇', same AN7:AN122 dropdown): copying Day 2 into Day 4 would give two axial hinges | his own 'Athletic Performance - Non-Competitive' tab (two axial squats) | Hard rule (V25): the second exposure is leg press / belt squat or a non-axial hinge. | PER-04 RIGHT, EQ-11 |

**Generator ordering algorithm (COACH-ANSWER where cited; the rest INFERRED; 05 v1 3.5 + 10b ORD-1..7):**

1. Sort stations by tier: 0 warm-up (5 min cardio + A-drills or mobility, ORD-08) -> core block, about 2 exercises (ATH-11; user may move it) -> 1 reactive (landing before rebound; bilateral before unilateral) -> 2 throws -> 3 COD -> 4 Olympic / power-strength and 'the work' -> 5 bilateral lower + its paired upper lift -> 6 unilateral lower + its paired upper lift -> 7 isolation (priority muscle may go first, ORD-04; arm matching the day; LEG FLEXION after the hinge lifts; leg extension before leg curl) -> 8 conditioning.
2. Pairs follow V24: hip dominant + push, knee dominant + pull (R9). Inside a tier, horizontal before vertical (R1/R2), then ascending constraint (C1).
3. Overrides, in order: COMPLEX / contrast stations (LV-6); 'the work' first even when vertical (R2); declared priority muscle first; easy aerobic first for fighters (ORD-09).
4. MYO only on the last machine or isolation exercise (VOL-15); 'MAX' only on small-muscle or bodyweight work (VOL-13); AMRAP only in CrossFit-style formats (VOL-11).
5. Weekly checks: <= 1 axial squat and <= 1 axial hinge (V25); the second exposure of a slot is a different exercise (PER-04); calves 3 sets each leg day and rear delts their own sets (VOL-17).
6. Speed sessions keep his fixed order: squirrel jumps → MACH drills / acceleration starts → max velocity (LIB-21, RIGHT).
7. Hard rules the generator never breaks (GEN-08, RIGHT): never to failure on heavy compounds (QM-2); no V-squat (V10); power before strength (R3/R4); horizontal before vertical (R1/R2); core is never skipped (VP-11). Coaches may add their own rules on top (GEN-08: "options for a coach to add their own rules"); a coach rule may tighten these, the five above stay on.

**Why horizontal before vertical.** The order is now his rule (ORD-01, RIGHT), so the generator no longer needs a reason to apply it. Two readings stay compatible with it: SCIENCE (10b section 7) puts higher-intensity, more-muscle work first, and the first exercise gains most strength [S87]-[S89]; COACH-ANSWER CAT-04 / CAT-10 (INFERRED link) makes horizontal zone 2 ("safer for you when you push and pull") and overhead zone 3 ("more positioning ... stability ... skill"). N18 (bilateral lower with the horizontal vector, unilateral with the vertical; BYOP 29 vs 2 and 24 vs 2) is kept as an OBSERVED pattern only: asked about it (UNI-11), the coach answered with the anterior/posterior pairing (R9).

---

## 6. Quality-of-movement constraints

### 6.1 What the coach writes and says (OBSERVED / COACH-CHAT / COACH-ANSWER)

| Theme | Verbatim (cell or answer) |
|---|---|
| Quality as a variable | COACH-CHAT: "You need to understand everything that has to do with the quality of the movement as much as the quantity of the movement." Machines let people "push without having to worry about stabilization of anything or getting it wrong". |
| Position standard | '**THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN' (SQ A9); CAT-04: front-loaded is foundational because 'people need to learn to be upright'. |
| Effort ceiling | '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' (MM 00 A4); 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM 00 A6); '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' (CF A4). |
| Where failure is allowed | 'MAX REPS' / 'MAX' / 'ALL' / 'MYO SET' only on the last one or two slots of a session: 'the nuance' / 'the survival' accessories (4T D11 'MAX' on 'PULL UPS' / 'DB ROWS 8/8', D12 'ALL' on 'RFE LUNGES' / 'STAGGERED STANCE DL', D15 'MAX' on 'ALT INCLINE DB BENCH', D16 'ALL' on 'BICEP CURLS'), calf and isolation finishers ('MAX REPS', MM 00 B23) and machine MYO sets (JL G12; 4T W61). Never on 'the work' or a barbell main lift. |
| Speed maintenance | 'Front squats - light weights - same speed for all reps' (MM 02 BU33); 'FAST RPE6 or about 60-70%' (4T N17); 'This is NOT a sprint, this is a fast run' (MM 02 DI29). |
| Landing quality | 'weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one' (MM 05 F12); 'STICK THE LANDING BILATERAL ' (BA A26); force phase 'TAKING IN FORCES' first (BA A24). |
| Reactive quality | 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' (BA D22); '**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE' (BA C21). |
| Diagnosis by movement quality | Bands for 'SOMEBODY THAT CAN'T YIELD DOWN INTO A SQUAT CORRECTLY OR AT A "GOOD" SPEED' (SQ D36); 'SOMEBODY THAT IS SLOW ON THE WAY UP' (D38); 'SOMEBODY NEEDING TO STAY STIFF DURING THE WHOLE MOVEMENT ECCENTRIC, AMORTIZATION, AND CONCENTRIC' (D40). Bands are out of scope in v1 (EQ-01, EQ-12); the diagnosis is kept as record. |
| Range standard | 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' (MM 07 L14); 'Side Raises FULL ROM' (MM 02 BB74); 'Elevated Push ups (for full ROM)' (LIB AD99). |
| Intent cues | '12/12 powerful turns' (MM 02 V30); 'Really high jump squats LOAD & jump hard' (MM 05 C14); 'Side to side shuffle floor slam (height matters)' (BA C80). |
| Skill progression | 'TEACHING/ LEARNING THE SKILL' / 'PROGRESSION MODEL EASY TO HARD' (OL A4:A5): high hang -> mid hang -> low hang -> floor; power before squat catch. |
| Client self-screen | 'Felt the RIGHT muscles' / 'Felt the WRONG muscle' / 'Felt a PAIN' / "Couldn't do it" (LIB AY8:AY11, header 'FEELING' AY1; program column 'HOW IT FELT?' JL J2); EFFORT '8 - That was perfect' (LIB AX15); coach note 'OUCH' (JL H12). |
| Pain rule | '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff' (MM 05 A6). |
| Effort model (coach answer) | VOL-13: 'I like RIR in my model, so that's what I'm going to be using. We can also add the explanation of RIR and kind of mix it with RPE... Everything in training is kind of subjective.' |

### 6.2 What the science adds (SCIENCE)

* Velocity loss inside a set shapes the adaptation [S39]: stopping at 20 % velocity loss gave similar squat strength gains to 40 % (no significant difference) and a better CMJ (+9.5 % vs +3.5 %) with 40 % fewer reps; 40 % gave more hypertrophy and shifted fibres away from type IIX.
* Intent produces velocity-specific adaptations even when the bar cannot move fast [S37]; maximal intended velocity nearly doubled bench 1RM gains vs half speed [S38].
* Proximity to failure matters for hypertrophy, little for strength [S21]; failure vs 1-2 RIR adds a trivial growth effect at a higher fatigue cost [S20]. The safe place for failure is a high-constraint machine or isolation (10b EQ-3).
* Free-weight injuries mostly involve dropped weights [S11]: technical failure on barbell lifts is the risk point.
* Plyometric quality: fast SSC contacts ~100-250 ms with small joint excursions [S57]; drop height is the intensity dial, ~30-40 cm optimal by RSI [S58][S59]; landing before reactive work matches 'TAKING IN FORCES' first.
* Heavier medballs make the head drift and the spine side-bend, which kills the hip contribution [S54].
* RIR scale: RPE 8 = 2 RIR, RPE 9 = 1 RIR (Zourdos 2016, via 03 5.3).

### 6.3 Generator rules (QM-x)

| ID | Rule | Status |
|---|---|---|
| QM-1 | Set termination by zone. Zones A-E (speed and power): stop at the first visibly slower rep or a form change (plyos 5-10 contacts, throws 5-10, loaded jumps 3-6; Olympic sets by the PER-09 ramp in strength plans, 2-5 reps for power athletes). Strength and hypertrophy compounds: 1-3 RIR. Small-muscle and bodyweight work: MAX (technical failure) on the last set allowed. MYO on the last machine/isolation exercise. Deload: 3+ RIR. | COACH-ANSWER VOL-13 (1-3 RIR), PER-09 + OBSERVED effort cells + SCIENCE [S39][S20][S21] |
| QM-2 | A rep counts only if it meets the position and ROM standard (full ROM by default; 'MAXIMAL UPRIGHT POSTURE' on squats; full lockout and stretch on isolation). The first rep that misses the standard ends the set: that is technical failure. MAX only on small-muscle or bodyweight work (VOL-13); MYO only on the last machine or isolation exercise (VOL-15); never on 'the work' or a barbell main lift. | COACH-ANSWER VOL-13, VOL-15, CAT-04 + OBSERVED SQ A9; rule N13; definition INFERRED |
| QM-3 | Velocity-loss proxy without a device: cue 'same speed for all reps'. With a device: VL 10-20 % for power and speed, 20-30 % for strength, 30-40 % allowed for hypertrophy. | OBSERVED MM 02 BU33; SCIENCE [S39]; thresholds INFERRED |
| QM-4 | Quality gate before load goes up: add load (double progression) only if the last exposure logged 'Felt the RIGHT muscles', EFFORT <= 8 and full ROM. Otherwise hold the load. | INFERRED from the BYOP dropdowns |
| QM-5 | Regression on failure to perform: "Couldn't do it" -> one level down in the same column or an assisted version (no bands: machine or bodyweight assistance), volume unchanged. 'Felt a PAIN' -> swap in category (split grip, unilateral, +1 constraint, one load-position step back, pain-free ROM) keeping the sets if possible; then -30-50 %; then drop the exercise (VOL-03, UNI-08). | COACH-ANSWER VOL-03, UNI-08, EQ-01 + OBSERVED MM 00 A7 / MM 05 A6; CAT-04 |
| QM-6 | Medball quality gate (LV-3): slower throw, head drift or spine side-bend -> 2 lb lighter. | COACH-ANSWER EQ-06 + SCIENCE [S54] + COACH-CHAT |
| QM-7 | Plyo method-stage gating (not 'zones', CAT-11): receive & pause -> receive then create only after two sessions of clean 3-s sticks (no knee collapse, quiet landing); -> repeated receive/create only after clean single responses; bilateral before unilateral inside each stage (unilateral is harder, CAT-10). A height or box change resets to the simpler pattern ('Bigger plates start at lateral bilateral plate hops'). Stop a set when contact time visibly lengthens or the heel drops. | COACH-ANSWER CAT-10, CAT-11, EQ-16 + OBSERVED MM 05 F12, BA A24:D24, LIB G53; SCIENCE [S57]-[S59] |
| QM-8 | Olympic skill ladder: hang pulls before a power catch; high -> mid -> low hang -> floor; power before squat receive ('Squat Snatch', 'Squat Clean', LIB-07). Never to failure; strength plans follow the 75 -> 90 % ramp with 4 x 8 -> 4 x 4 (PER-09) and stop a set early when the bar slows; technique sets in deloads. Older or injured clients never snatch (EQ-03); youth may lift from the floor (ATH-09). | COACH-ANSWER PER-09, LIB-07, EQ-03, ATH-09 + OBSERVED OL A5:A30, LIB C tiers |
| QM-9 | Fatigue-sensitive work first. R3/R4/N5 exist so quality work is done fresh. An athlete who logged EFFORT 9-10 in the previous session keeps the athletic block but cuts it by one set. | INFERRED from section 5 + 03 9.13 |
| QM-10 | Machines for quality under fatigue: if a client cannot keep position on a free-weight version late in a session or block, move that slot up one constraint level (or one load-position step back) rather than lowering effort. Older, injured and high-volume clients collect their volume on constrained machines (EQ-03). | COACH-ANSWER EQ-03, CAT-04 + COACH-CHAT; 10b EQ-1/EQ-5 |
| QM-11 | Upright posture is the foundational standard: a client who cannot hold 'MAXIMAL UPRIGHT POSTURE' in an on-the-body or back-loaded squat goes back to a front-loaded version (goblet, zercher, 'Low DB squats' with the DBs hanging at the sides) for the next block, whatever the client's level. | COACH-ANSWER CAT-04 ('people need to learn how to be more upright'), LIB-09 + OBSERVED SQ A9; rule INFERRED |

---

## 7. Disagreements and decisions

### 7.1 Where the coach's answers and the sheets disagree (the answers win)

| ID | Issue | Coach's answer | Sheet evidence (OBSERVED) | Decision |
|---|---|---|---|---|
| CA-1 | Overhead pressing filed as FOUNDATIONAL | LIB-13: 'push press is easier, push jerk is more technical but its more intermediate/advance'; CAT-04: overhead = advanced | 'DB Push press', 'Barbell push press', 'DB Push Jerk', 'Barbell Push Jerk' in VERTICAL PUSH FOUNDATIONAL (LIB AA11:AA14); RP E13:E15 marks the kneeling barbell press and both standing presses red (E06666) | Resolved by LIB-13: push press (DB and barbell) stays available from FOUNDATIONAL for athletic clients; push jerks are INTERMEDIATE/ADVANCED. Non-athletic beginners still start overhead pressing seated (zone 3 with support); older and injured clients get the seated machine shoulder press (EQ-05). |
| CA-2 | Leg machines filed as ADVANCED/MODERATE | CAT-04: machines easier; EQ-04 (RIGHT): foundational older/injured clients may use them; EQ-11: machines are not ranked | 'Hack Squats', 'Leg press', 'Pendulum Squat' in BILATERAL KNEE DOMINANT ADVANCED (LIB AI97:AI99); 'Hip Thrust Machine', 'Machine Good Mornings' in MODERATE | Resolved: the library level marks the VOLUME-TOOL role, not difficulty; any client may get them (EQ-04); the generator ranks them by constraint and client preference, never by a machine ranking (EQ-10, EQ-11). |
| CA-3 | Back-loaded and barbell lifts given to novices | CAT-04: load behind the body = advanced; CAT-06: client level and exercise level are separate | UL/PPL 'NOVICE' get 'Deadlifts (DB or Barbell)' and 'Sqats or Leg Press' (MM 00/06) | No conflict once the two axes are separate: the novice gets the dose of a novice; the exercise choice follows posture and equipment. |
| CA-4 | Knee flexion wired as hip dominant | CAT-09: leg curls, nordics, slider curls are NOT hip dominant | NO ACCESS tabs wire 'Unilateral HD' to `AR7:AR42` (LEG CURLS) in 07 E12/E33 and 08 E19/E46 (the LEG CURLS column is headed 'UNILATERAL', LIB AR5). Every 'Bilateral HD' dropdown draws `AN7:AN122` ('BILATERAL HIP DOMNANT'), which holds 9 knee-flexion items: AN15 'Leg Curl Machine', AN17 'Harmstring MedBall Curls', AN18 'Supine Glidder hamstring curls', AN19 'swiss ball hamstring curls', AN50 'Medicine or Stability Ball Harmstring Curls', AN54 'Machine Leg Curls (Seated and Laying Down)', AN91 'Nordic Curl', AN100 'Machine Leg Curls', AN101 'DB Harmstring Curls' | Still treated as a miswire (INFERRED from CAT-09; FIX-01 was skipped by the coach). Generator: 'Unilateral HD' always draws from AQ; 'Bilateral HD' draws from AN minus its 9 knee-flexion items; curls only in the LEG FLEXION segment. |
| CA-5 | Size tiers for the weekly rate | VOL-05: the weekly rate 'doesn't really go by muscle' | 06 section 4.2 puts triceps and front/side delts in a MEDIUM 5 % tier | Moot: both the 06 MEDIUM tier and the 03 size mapping are retired; the rate is chosen by the person (3.3). |
| CA-6 | Back squat filed below advanced | CAT-04: load behind the body = advanced (barbell back squat) | 'Low Bar Squat' 'HARDEST' (SQ G10:G11), but 'low bar back squat' yellow in RP A24 and 'Low Bar Back Squat' in the MODERATE block (LIB AI50, next to 'Front Squats' AI46) | Follow CAT-04 and the squat ladder: back-loaded squats are advanced, front squat intermediate; low-bar squats are never given to older, injured or high-volume clients (EQ-03). |
| CA-7 | Reference tabs list vertical before horizontal | CAT-04: horizontal = zone 2 (intermediate), overhead = zone 3 (advanced) | RP 'VERTICAL PUSH' (E) before 'HORIZONTAL PUSH' (I); Sheet23 vertical (T-W) before horizontal (X-AB) | Library order is not session order; sessions follow R1/R2 and Z1. |
| CA-8 | Core cases the thorax/pelvis rule does not settle | CAT-08: toes to bar and Copenhagen planks are more complicated cases | 'Hanging rotational knees to chest' is the only CORE PELVIS TRANSVERSE item (LIB T9); 'Toes to bar' is CORE THORAX in the library (LIB O15) but CORE PELVIS in CONTROL PATTERNSCORE (I18; 'SL toes to bar' B21); 'Coppenhaggen Plank' appears only in the library, under CORE PELVIS FRONTAL (LIB S10) | Tag them `core_segment = both`; keep them out of the foundational core ladder. |
| CA-9 | 'ZONE' means several things | CAT-10: zones are Davidson's rotation biases (vertical = ER, horizontal = zone 2 = IR, compressive) and do not apply to plyos; CAT-11: the plyo key is not really a zone | Sheet23 A2:A28 'ZONE 1/2/3' rows (green/yellow/red bands); plyo 'ZONE 1/2/3' (S23 C34:C36) = receive/create key; curl/triceps 'Zone 1/2/3' (S23 AO5, AP5, AP6) | Three fields: `position_zone` + `rotation_bias` (V13), `plyo_method_stage` (V19, renamed) and the library difficulty label (V23). The arm-zone labels on curls and triceps mean arm position (down / in front / overhead), as CAT-10 describes. The Sheet23 column-A row band stays unresolved and unused. |
| CA-10 | Athletes' observed bilateral share | UNI-02: field/COD athletes 80-90 % unilateral; UNI-10: in season bilateral minimal | BOXING 50 % -> 37.5 %; BASEBALL 44.7-47.5 %; BYOP ATHLETIC / JL 50 % (3.7) | The answer wins: COD athletes 10-20 % bilateral (Example B runs at 21-25 % lower, 23-29 % upper, the low edge of his 80-90 % unilateral); his written athletic templates are read as the general / non-competitive athletic default. |
| CA-11 | Two axial squats a week | PER-04: squat once, leg press the other day; deadlifts also load the spine | JL E8 'Front Squats' Monday + E35 'Low Bar Back Squat' Thursday (two axial squats); AESTHETICS fills only its Day-2 'Bilateral HD' slot ('DB Deadlifts', 00 D10); Day 4 (D31) is unfilled | Not reproduced: second exposures are leg press / belt squat or a non-axial hinge (V25, VP-6, LV-9). Whether the axial squat and the axial hinge may sit on two different days is open question 4. |
| CA-12 | Hack squat ranked last | EQ-11 NOT RIGHT: 'I don't want to rank them because they have different brands, angles' | 'HACK SQUAT' "I PERSONALLY DON'T LIKE IT" (SQ G37:H37); 'V-SQUAT' "DON'T LIKE IT", "I don't presercibe the use of these, ever." (SQ G39:I39) | No machine ranking; client preference picks between alternatives (EQ-10). Hack squat and pendulum stay out of the non-axial pool until classified (05 6.4). The V-squat is the exception: never offered, because 'no V-squat' is a GEN-08 hard rule (RIGHT), not a ranking. |
| CA-13 | Core position | ATH-11 NOT RIGHT: core first for everybody, movable | BYOP core only on 'Optional' days; BASEBALL core after the power block (Part B) | Core block first in every session; the user may move it. |
| CA-14 | Olympic reps | PER-09 RIGHT: 75 -> 90 % with 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4 in strength-focused plans | JL 'Power Clean' 2 x '6 to 8 Reps' (E7:G7); BASEBALL OLY rows | The coach's ramp is the strength-plan default (v0 question 24 answered for strength plans); power-focused athletes keep the speed-loss cap as INFERRED until open question 1 is answered. |
| CA-15 | Calves first and missing rear-delt / calf sets | ORD-04: first only when that muscle is a priority; VOL-17: calves 3 sets every leg day, rear delts their own sets ('It wasn't intentional') | 'Calves' slot 1 on aesthetics A days (00 D3); about 3 indirect rear-delt sets a week in BYOP | Calves at the end unless a priority; calves on every leg day; a rear-delt station on pull days (Example A). |

### 7.2 Inconsistencies across the team's files (decisions taken here)

| # | Issue | Decision |
|---|---|---|
| I1 | Size-to-rate mapping: chest/back 5 %, triceps 7 % (03) vs chest/back 3 %, triceps 5 % (06) | Superseded by VOL-05: no size-to-rate mapping at all; the rate is the person's (3.3). |
| I2 | Deload depth: 0.85 x W1 (03) vs 0.6 x previous week (06) vs 50-60 % (10b VOL-7) vs 'about half the sets' (PER-05 assumption) | Resolved by PER-05: about half the sets of the current week, lighter (3.10); 40-60 % stays only for a pre-competition taper. |
| I3 | Release threshold: 0.75 set (03) vs 1.0 set (06; VOL-06 wording put to the coach) | Resolved by VOL-06 (RIGHT): release at 1.0. |
| I4 | Weekly step: +1 set every 2-3 weeks (sheets) vs +2 sets in one week (chat) vs a separate 'coach lane' (previous draft) | Superseded: VOL-06 (whole sets) + UNI-05 (10 % is too much). One set per bank unit; v0's 10 % chunk is retired; 20 -> 22 takes two weeks at 5 %. |
| I5 | 'Keep the same over the block' vs weekly rotation in BASEBALL / 4T | Resolved by PER-02 / PER-03: block-fixed default; A/B only for variety seekers; zone-constant rotation for athletic accessories stays INFERRED (open question 12). |
| I6 | Skill anchors frozen >= 8 weeks (10b VARI-3) vs BASEBALL rotating front/back/zercher squat in Part C weekly | Freeze kept for skill anchors (SCIENCE), now also backed by PER-02 (exercises fixed for the 4-6-week block); BASEBALL's weekly accessory-drill rotation stays unconfirmed (open question 12). |
| I7 | 'Elevated' = easier (green, RP A82) vs 'Elevated Push ups (for full ROM)' (LIB AD99) | Store `rom_effect` per exercise. |
| I8 | Previous draft cited the JUSTICE LEAGUE squat twins as 'AI46 / AI50 in JL' | Corrected: JL E8 'Front Squats' (Monday) and JL E35 'Low Bar Back Squat' (Thursday); AI46/AI50 are the library cells. |
| I9 | 03 lists front delts as SMALL; CAT-02 leaves front delts unplaced | Front delts: no direct target, indirect credit only, until placed (VOL-05). |
| I10 | 12 v1 priority start at L2: +5 in its §3.3 table and example 5.2 (15 + 5 = 20) vs +4 in its §3.5 text, pseudo-code and JSON `priority.start_add.L2` | This file uses +4 (machine-readable value) in Example A; flagged to the 12 owner. |
| I11 | 12 v1 example 5.3 bases (quads/hamstrings 10, chest 6, back 8) do not follow one rounding of 15 x 0.7 = 10.5 and 15 x 0.5 = 7.5; no rounding rule is written | This file rounds half up (chest/back 8, quads/hamstrings 11) and proposes round-half-up as the rule; flagged to the 12 owner. |
| I12 | v0 11 capped 'exercises per muscle per session <= 2' and '<= 3 per muscle per week' (VP-8) | Retired by VOL-07: 3-4 exercises per muscle on its day. |
| I13 | v0 11 counted athletic sets 0.5 against a lower-body fatigue budget | Retired by VOL-10: athletic work has its own budget (contacts, throws, reps, meters), never mixed with muscle sets. |
| I14 | Olympic lifts by level: 12 v1 (3.13 table) and the first v1 draft of LV-12 read 'L2+ hang power, L3 full lifts'; 05 v1 gives L2-L3 the full lifts and 03 v1 (change 44) already corrected the same split | Follows ATH-10: beginners and beginning intermediates use DB/KB snatches, hex-bar jumps, hang pulls/cleans; intermediate and up (L2-L3) get the full scope (LV-12). Flagged to the 12 owner. |
| I15 | 12 v1 3.11 tags the bodybuilder / powerlifter upper-body share '80-90 % bilateral' as COACH UNI-02; the coach gave no upper-body number (UNI-03 repeats the field-athlete answer: 'the same' logic) | This file marks the upper number PROPOSED (3.7). Whether a bodybuilder's upper share also starts near 50/50 in weeks 1-4 is open question 9. Flagged to the 12 owner. |
| I16 | 'Exercises per session': 12 v1 3.10 marks '8' (a full-body day with calves, or a 90-min session) as PROPOSED | VOL-08's assumption, which the coach marked RIGHT, already scales the count by session length (45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9 exercises), so 8 at 75-90 min is COACH-ANSWER VOL-08. Whether the 2-exercise core block counts inside that number for non-athletes is INFERRED (it counts inside the field-athlete 10-12 in VOL-08 / VOL-17). |

---

## 8. Open questions for the coach

Only questions that are still open or that his answers raise. "NEW" = not yet asked; the rest name the questionnaire item or the v0 question they continue.

1. **Olympic reps for power athletes (NEW)** [NEW (follows PER-09)]. You confirmed 75 → 80 → 85 → 90 % with 4 x 8 → 4 x 6 → 4 x 6 → 4 x 4 for strength-focused plans (PER-09). For a basketball player or sprinter, do the cleans and snatches keep 6-8 reps per set, or should each set stop at 2-5 reps when the bar slows?
2. **Zones: load position or joint position? (NEW)** [NEW (follows CAT-04, CAT-10)]. CAT-04 says front-loaded = foundational and behind the body = advanced, while CAT-10 says the deep squat and overhead are the same external-rotation zone. Where does a deep goblet squat sit: foundational (front-loaded) or an advanced zone (deep squat)? Does the level follow where the load is, or how deep / high the joints go?
3. **20 → 22 in one week (NEW)** [NEW (VOL-04 vs UNI-05)]. Your chest example (20 → 22 sets next week) is +10 %, which you also called 'way too much' (UNI-05). Was it an illustration of 'add sets of the same thing', so 20 → 22 over two weeks at 5 % is right, or is a one-off +2 step fine at about 20 sets?
4. **Which lifts load the spine? (NEW)** [NEW (follows PER-04)]. You squat once and probably deadlift once a week (PER-04). (a) May the squat day and the deadlift day be two different days (two spine-loading days a week), or should both sit on the same day? (b) Do single-leg and staggered-stance DB deadlifts, DB RDLs and hack squats count as loading the spine, or only barbell / trap-bar squats and deadlifts?
5. **Glutes with 0.25 helper credit (NEW)** [NEW evidence on 12 decision 3]. With helpers at 0.25, squats and lunges give glutes very little credit. (The engine already counts glutes 0.5 on deadlifts, RDLs and other hinges as a PROPOSED exception to your 0.25: is a hinge's glute work 'helper' work to you, or main-mover work?) In a 4-day full-body plan glutes stayed at 13-14 sets against a start of 17, even with two hip-thrust Focus slots (Example A); counted Pelland's way (indirect 0.5) the same plan gives glutes 16-17.5. Should squats and lunges count more for glutes, should the glute target be lower, or should every physique plan carry direct glute work?
6. **10-20 % bilateral in practice (NEW)** [NEW (follows UNI-02, PER-04)]. For a COD athlete at 80-90 % unilateral, the second weekly squat and hinge become single-leg lifts (box pistol, staggered-stance deadlift), so each bilateral pattern appears once a week (Example B). Is that what you want, or should both bilateral patterns stay twice a week at lower sets?
7. **Same-muscle supersets (NEW)** [NEW (follows ORD-05)]. You use supersets to fatigue people more (ORD-05). For advanced clients, may a superset pair two exercises for the same muscle (e.g. bench + fly), or always a lower + upper pair?
8. **Contra or ipsi by screen? (NEW)** [NEW (follows CAT-13)]. You use contralateral loading to help athletes 'get into the hip' when they lack range (CAT-13). Should the generator choose contralateral vs ipsilateral from a simple hip-range screen, or only by sport (COD → contra, sprint start → ipsi)?
9. **50/50 → 80/20 timing (NEW)** [NEW (follows UNI-02, CAT-13)]. For bodybuilders and powerlifters, should the move from about 50/50 to 80/20-90/10 happen at the block change (week 5), or a little each week? And for the upper body ('the same' logic, UNI-03): does their pressing and pulling also start near 50/50 in weeks 1-4, or stay 80-90 % bilateral from the start (the team's PROPOSED number)?
10. **Grammar-built exercises (re-ask of CAT-12)** [CAT-12 (not understood)]. Can the tool make a new variant by changing one detail of a library exercise (for example 'Reverse Lunges' → 'Reverse Lunges with the dumbbell in the opposite hand'), or should it only use exercises written in your library?
11. **Small variables between blocks** [PER-02 (follow-up)]. PER-02 names grip, stance, implement, range of motion and rep range. Are a load-position step (goblet → front squat) and a contra → ipsi swap also 'small variables'?
12. **Athletes' weekly rotation** [v0 Q7 (open)]. BASEBALL changes the exercise in a slot almost every week (about 5 per slot per 8 weeks). Deliberate for athletes ('same speed zone, new drill'), even though PER-02 keeps exercises fixed for a block? Should the main squat, deadlift and Olympic lift stay the same for 8+ weeks?
13. **Mid range of motion** [v0 Q10 (open)]. Does 'mid ranges of motion' mean partials for athletes (1/4 squats, hang positions, box squats) or partial reps at the stretched end for muscle growth?
14. **Tempo** [v0 Q11 (open)]. Is 2-3 s down and fast up your default for hypertrophy? When do you use slow eccentrics: beginners, home clients with light weights, pain?
15. **Stopping a speed set** [v0 Q12 (open)]. 'Same speed for all reps': should a client stop a speed set as soon as the reps slow down, even with reps left?
16. **'Elevated' and '*RDL'** [v0 Q19 (open)]. In 'ROM VARIABLE', does 'Elevated' mean a raised start (shorter range) or raised feet (longer range)? What does '*RDL' mean as the red value in all three variable lists?
17. **Seated presses** [v0 Q21 (narrowed by LIB-13, EQ-04)]. Your zones make overhead advanced and seats easier. Are seated DB presses foundational (as filed) or intermediate?
18. **KB Face Pulls / Bench Push ups** [LIB-10, LIB-12 (no answer yet)]. 'KB Face Pulls ' sits under VERTICAL PULL (LIB U20): move it to rear delts? 'Bench Push ups': hands on the bench (easier) or feet on the bench (harder)?
19. **A priority muscle in a full-body plan (NEW)** [NEW (follows VOL-07, VOL-02, VOL-08)]. In Example A (4 full-body days + 2 optional Focus days) chest reached 22 sets by week 3 and could not go higher: both presses were at 5 sets, all four Focus slots at 3, and every training day already had 8 resistance exercises. Its cap is 26. You use 3-4 exercises per muscle on its day (VOL-07). For a priority muscle, may the generator swap one non-priority exercise on that day (for example the vertical push on the chest day) for a second chest exercise, or should the client move to a split with a chest day?

**v0's open questions that his answers settled:**

| v0 open question | Answered by |
|---|---|
| Q1 3/5/7 % classes | VOL-05: by the person, not the muscle |
| Q2 20 -> 22 step | VOL-06 + UNI-05 (follow-up = open question 3) |
| Q3 'with different exercises' | VOL-07: onto the existing exercises in session order, bonus exercise for small muscles |
| Q4 'keep the load the same' | VOL-04 RIGHT: 20 → 22 sets at the same load |
| Q5 volume load | VOL-04: tracked, not driven by % |
| Q6 block length | PER-02: 4-6 weeks, one or two small variables (follow-up = open question 11) |
| Q8 A/B weeks | PER-03: optional for variety seekers |
| Q9 why H before V | ORD-01/02 confirm the order; the zone reason stays INFERRED |
| Q13 medball weight | EQ-06 |
| Q14 chains | EQ-12: no variable resistance |
| Q15 deload depth | PER-05: about half the sets |
| Q16 RIR target | VOL-13: 1-3 RIR |
| Q17 isolation first | ORD-04: priority only |
| Q18 rest | VOL-14 |
| Q20 bilateral : unilateral | UNI-02, UNI-05, UNI-10 |
| Q22 arm zones | CAT-10: arm position = rotation-bias zone |
| Q23 knee-flexion volume | VOL-09 (counts fully) + VOL-05 (person rate) |
| Q24 power clean reps | PER-09 for strength plans (follow-up = open question 1) |

---

## 9. Method, files and reproducibility

**Read for this v1:** `coach_answers_full.md` in full and `coach_answers.md` (first; authoritative); `12_volume_algorithm_v1.md` and `.json` in full (the authoritative engine); `05_session_architecture.md` v1 (axial budget, pairing, generic names); the v0 of this file and its sources (`tv11/data_11.py`, `build_11.py`, `11_template.md`, `engine_sim_v2.py`, `bilat_uni.py`, `variation_audit.py`); `dumps/` for every new cell citation.

**New computations (session scratchpad `tv11_v1/`, read-only on the repo):**

* `engine_sim_v4.py` imports 12's prototype `vol_engine_v1.py` unchanged (md5 7b5bc34d4a2c62cc5766591a6f59e545) and computes the bank table, the chat check, the VOL-07 order demo and Examples A and B → `engine_examples_v4.json`.
* `data_11_v1.py` is an overlay on the v0 data: every v0 entry not overridden is carried over unchanged; every override cites the coach answer behind it.
* `build_11_v1.py` renders this file and `11_training_variables.json` from one source (it also copies 12's credit map and share profiles at build time), so the tables, the JSON and 12 cannot drift.
* `bilat_uni.py` and `variation_audit.py` (v0, OBSERVED computations) are re-used as they were.

No Google Sheet was opened or modified.

---

## Verification log

**v1 (2026-10-08).**

* **Coach answers.** `coach_answers_full.md` read in full (140 questions: LIB-10 and LIB-12 unanswered; PRG-01 and FIX-01 skipped) and `coach_answers.md`. Script check: 115 distinct question IDs are cited in the MD and JSON, and all 115 exist in `coach_answers_full.md`. Every 'ID RIGHT / PARTLY / NOT RIGHT' claim in the MD was compared with the coach's verdict chip: one mismatch was found and fixed (N3 said 'UNI-06 RIGHT'; UNI-06 has no chip, his words are 'Correct. This is a rule by goal').
* **Engine.** `12_volume_algorithm_v1.md` and `.json` read in full. The worked examples, the bank table, the chat check and the VOL-07 order demo are computed by `engine_sim_v4.py`, which imports 12's prototype `vol_engine_v1.py` unchanged (md5 7b5bc34d4a2c62cc5766591a6f59e545, checked before and after the runs); every number in 3.4, 3.12 and 3.13 comes from `engine_examples_v4.json`. The credit map (3.2) and the share profiles in the JSON are copied from 12's JSON at build time. Starts, level caps, priority add and caps, rate bands, the 10 % ceiling and the deload dose were compared with 12's JSON and match; two inconsistencies inside 12 are recorded as I10 and I11.
* **Continuation of an interrupted run.** A previous v1 run had left `data_11_v1.py` and `engine_sim_v3.py` but no rendered output. Its simulation was re-run and reproduced byte-identically before it was revised (v4: the bodybuilder 50/50 → 80/20 block change in Example A; at most 12 exercises a day, library names, rep phases and block changes in Example B; the VOL-07 demo; the Pelland count). Its data overlay was reviewed line by line against the coach's answers and corrected (the D31 error below, the naming, I11, VP-1, VP-3, VP-9, QM-11, Z1, V23, the rep phases on main lifts, the open questions).
* **Cell citations.** 207 quoted-name + cell pairs (LIB, JL, BYOP 00) in the rendered MD were matched against `dumps/` by script: 198 match exactly; the other 9 are v0 range citations whose first cell differs by design (e.g. 'MYO SET' (LIB AW8:AW14)). Every new v1 citation was read in the dump: RP C19:C26, 4T E38:H38, BYOP 00 C3:D14 and C24:D37 (validation D10 D31 → AN7:AN122), JL E3:G13 and E35, LIB U9:U18, U91, X9:X11, X91, AA9, AA92, AA93, AD94, AD127, AH9:AH20, AI46, AL12:AL16, AM9, AN9:AN16, AN47, AN51, AN55, AN91, AN93, AQ9:AQ16, AR9:AR10, AS12:AS13, AT9, AT16:AT17, AU9:AU12, AZ244:AZ250, C9:C15, E9:E14, G9:G15, I9:I14, K10, K13:K14, K21:K24, K27, L5:N5, L13, O10:O11, P9, Q9, R9, S9:S10. **Found and fixed:** AESTHETICS D31 (Day-4 'Bilateral HD') is unfilled 'CHOOSE 👇'; the interrupted draft said 'DB Deadlifts' sat on Day 2 and Day 4 (CA-11, AX1). The belt squat has no cell in either workbook and is cited to EQ-11 only.
* **Retired-content scan** of the rendered MD (the v0 correction table excluded): every remaining mention of size-based rates, 0.5 synergist credit, the 10 % chunk, round-robin placement, bands, chains, weight releasers, plyo 'zones', 'core after the power block', the RED/AMBER/GREEN gate, 6-week loading plans, the 0.85 x W1 deload and the two-axial-squat week is a RETIRED note, an OBSERVED quote or the change log. No 'WW' citation remains; 'JUSTICE LEAGUE' appears only as the verbatim tab name.
* **Session rules inside the examples** (script over the engine's slots and weekly snapshots): at most one axial squat and one axial hinge in every week of both examples; the core block opens every training day; every lower/upper pair is hip dominant + push or knee dominant + pull; Example B lists 12 exercises a day (VOL-08 maximum) and at most 85.8 min; Example A 8 resistance exercises on training days (12's maximum for a full-body day with calves) and at most 70.8 min of its 75; the largest week-over-week rise in total resistance sets is +5.3 % (A) and +6.5 % (B), under the 10 % ceiling.
* No Google Sheet was opened or modified; `dumps/`, `analysis/` and the other synthesis files were read only. Only `synthesis/11_training_variables.md` and `.json` were written.

**v0 adversarial fact-check corrections (kept for the record; the cells and quotes they fixed are still valid).**

| ID | Where | Was | Now | Evidence |
|---|---|---|---|---|
| FC-01 | What changed #2; CAT-04 effect; 1.2; V13; CA-9 | CAT-04 position zones 'explain' the Sheet23 column-A 'ZONE 1/2/3' rows (A2:A28) | They explain the arm-zone labels only; the Sheet23 row bands follow row position and stay unresolved | S23 ZONE 1 rows hold 'Lat Pulldown Wide Grip' (T2), 'Standing DB Press' (W6), 'Weighted Pull ups ' (U8): overhead lifts from FOUNDATIONAL and ADVANCED columns; ZONE 3 rows hold only I17 'Plyo pushups' and J17:J21 medball throws |
| FC-02 | Short answers; V08; QM table 'Where failure is allowed'; N13; ordering algorithm | 'MAX' / 'ALL' / 'MYO SET' only on isolation and the last exercise | 'MAX'/'ALL' sit on the last two slots ('the nuance' / 'the survival'): pull-ups, DB rows, alt incline DB bench, RFE/FFE lunges, staggered-stance DL, curls; MYO only last; generator restriction to isolation / constraint >= 4 marked INFERRED | 4T D11 'MAX' (E11 'PULL UPS'), D12 'ALL' (E12 'RFE LUNGES'), D15 'MAX' (E15 'ALT INCLINE DB BENCH'), D16 'ALL' (E16 'BICEP CURLS'), D20, D23; CONJUGATE D15:D16, D19:D20, D24 |
| FC-03 | LV-3; V20 ladder; Example B medball note; open question 13 | '8-10 lb is the coach's default for adult overhead, sit-up and scoop throws; 6-8 lb for rotational and chest passes' | The coach's 8-10 lb was said for upper-body passes and rotations; adults start at 8 lb on those; the 6-8 lb split is a SCIENCE option pending EQ-06 | Task relay / coach_answers.md: 'medball upper-body passes/rotations should be light (8-10 lb)'; 10b flag F3 records the same conflict |
| FC-04 | CAT-09 effect; CA-4; KF-1; 2.3 LEG FLEXION row | NO ACCESS wiring 'confirmed as an error'; only the 'Unilateral HD' slot guarded | Miswire is INFERRED from CAT-09; 'Bilateral HD' draws (AN7:AN122) must also drop the 9 knee-flexion items the library files under 'BILATERAL HIP DOMNANT'; those items become LEG FLEXION home options | LIB AN15, AN17, AN18, AN19, AN50, AN54, AN91, AN100, AN101; LIB AR5 'UNILATERAL'; BYOP 07 E12/E33, 08 E19/E46 -> AR7:AR42 |
| FC-05 | Short answers; V22; 3.7 reading 1; 3.7 targets | 'every BYOP template gives bilateral and unilateral lower patterns equal slots (50 %)'; 'BYOP 50 % in 7 of 9 templates' | Equal in the 4-day/6-day templates; 3 DAY BUILDER 4:3 (57 %); 6 of 9 at 50 % as wired (8 of 9 after the CA-4 fix) | BYOP 01 C4, C6, C13, C15, C23, C24, C27 (Day 3 = BKD, BHD, H-pull, H-push, UKD); bilat_uni.json BYOP rows |
| FC-06 | 3.1 OBSERVED (BOXING) | 'Literally "same exercises, more sets"' | Weekly totals 66, 66, 69, 69, 62, 76 (excl. medball/cardio lines): rising with a week-7 dip | MM 07 E7:J48 recomputed |
| FC-07 | 2.3 'CHANGE OF DIRECTION' anchor; Z-B | AGILITYCOD 'EASY TURN' -> 'HARD TURN' | LIB L5 'EASY TURN' -> M5 'MOD. TURN' -> N5 'HARD TURN'; AGILITYCOD D1/D2 for agility vs COD | AGILITYCOD has no 'TURN' cell (A1:H14 read in full) |
| FC-08 | 2.3 'TRIPPLE EXTENSION' profile | '16 strength-speed + 11 reactive' | 33 items: 16 strength-speed, 11 reactive, 3 speed-strength, 3 starting strength/speed | lib_athletic_core.json force_velocity_zone, column C |
| FC-09 | 1.4 V10 swap ladder | 'machine rows or db rows' x12 | 16 cells, 12 with exactly that text | 4T P47, R47, T47, V47:Z47, P63, R63, T63, V63 (exact); W63:Z63 add '(5 sets - 15/12/12/12/10)' |
| FC-10 | LV-7; 2.1; Z-B; Z-J | (SQ A45/A48) for 'ECCENTRICFAST' / 'ECCENTRIC SLOW'; (SQ A40/B40) for 'BOTTOM CHAINS'; (BA A53:A71) for throw names | (SQ A48/A45); (SQ A39, A40, B40); names at BA C53, C54, C57, dose A53:B69; Z-J cites SQ H35/I35 and B27 | cell-by-cell read |
| FC-11 | CA-1 | 'RP E13:E15 marks standing presses red' | E13 is 'Kneeling barbell press'; E14:E15 the standing presses; all three red | RP E13:E15 bg=E06666 |
| FC-12 | CA-8 | 'library and CONTROL PATTERNSCORE disagree on toes to bar and Copenhagen' | Toes to bar: CORE THORAX in LIB O15 vs CORE PELVIS in CONTROL PATTERNSCORE I18; Copenhagen only in the library ('Coppenhaggen Plank', LIB S10) | CONTROL PATTERNSCORE has no Copenhagen cell |
| FC-13 | C1 | '3.5-3.9 at positions 9-10 (Spearman ~0.6-0.72)' | 3.8-3.9; Spearman 0.72-0.78 on template sessions, 0.36 on JL's filled Monday | prog_byop_equipment.md sequence checks (lines 396-549) |
| FC-14 | Short answers; 4.2 reading | '4 TRACKS is a stable two-menu A/B (79-81 %)' | Only the 12-week tracks (78.5-81.3 %); the 8-week tracks and HYBRID 20-40 % | variation_audit.json by_program |
| FC-15 | 3.12 Example A block menu | generic 'DB bench press', 'Incline DB press', 'Cable fly' | library names 'DB Bench Press' (LIB AD94), 'Incline db press' (LIB AZ245, CHEST focus list), 'Cable flies' (LIB AZ249) | Day 4 'Horizontal Push' draws AD7:AD162; 'Focus 1/2' draw AZ7:AZ335 (BYOP 00 validations) |
| FC-16 | 3.13 Example B | doses presented next to 'the coach's own JUSTICE LEAGUE Monday picks' without saying they differ from his | Note that JL writes 2 sets of '6 to 8 Reps' / '8 to 12 Reps' / 'MYO SET' (F3:G12); the table's doses are INFERRED; power-clean rep conflict = new open question 24; 'Thursday' is positional (JL B30 is blank) | JL F3:G12; raw/BYOP.xlsx JL B30 = ' ' |
| FC-17 | 4.2 'Block-fixed by construction' | 'Every BYOP template: only WEEK 1; Day 3 = Day 1 and THURSDAY = MONDAY' | Single-week templates; third training day repeats the first in the 4-day tabs; 3 DAY BUILDER Day 3 is its own mixed day | BYOP 00 A3:A38, 01 C23:C27, JL B3:B57 |
| FC-18 | V14, V19, V21, V22, V23, LV-12 | suitcase called the MODERATE loading; heights uncited; AE A25:C41; 'unilateral work is implement-free'; row-3 labels missing 'HARD'; 'Squat to calf raise' | suitcase marked INFERRED; LIB G13/G14/G133; AE A24:C41; 'most library lunges name no implement'; 'HARD' (Q3) added; 'BodyWeight Squat to calf raise' (LIB C9) | RP C19:C26; LIB G13, G14, G133, Q3, C9; AE A24:C24 |
| FC-19 | 3.7 reading 3 | BOXING weeks 3-8 '37.5 %' with no caveat | 37.5 % counts the contrast complexes L22/L46 as bilateral; 17 % without them | prog_mm_equipment.json families for MM 07 L10:L47 |
| FC-20 | 6.2 [S39] | 'gave the same squat strength as 40 %' | 'similar squat strength gains (no significant difference)' | Pareja-Blanco 2017 reports a non-significant difference, not identical gains |
| FC-21 | Status legend (COACH-CHAT) | double-quoted chat text read as verbatim | Legend says the relay is a close paraphrase, so quote marks do not certify exact words | The long forms of the volume, 'confuse' and quality quotes match no file in the repo; their short forms match analysis/equipment/reference_variables.json and the task relay |

---

## v1 verification log

**Adversarial check of this v1 update, 2026-10-08.** `coach_answers_full.md` (140 questions) and `coach_answers.md` were re-read in full. Every answer that bears on a training variable was traced to the tables, rules, examples and JSON fields that should carry it. A mention in the change log alone did not count. Edits were made in place in this file and in `11_training_variables.json`. No Google Sheet was opened, and no other file was written.

**Answers checked against this topic (grouped; where each now lives):**

* **Volume:**
  * VOL-01..18 → 3.2-3.9, V06-V08, caps.
  * UNI-01, UNI-04, UNI-05, UNI-07, UNI-08, UNI-09 → 3.2, 3.5, 3.9, V22.
  * PER-05 (deload), PER-09 / PER-11 (rep and % ramps) → 3.9, 3.10, LV-4.
* **Laterality and pairing:**
  * UNI-02, UNI-03, UNI-10, UNI-12 → 3.7, V22, V18.
  * CAT-13 → V14, 3.7.
  * UNI-06, UNI-11, ORD-06 → V24, R9.
* **Session and order:**
  * ORD-01..11 and ATH-11 → V12, section 5.
  * VOL-08, VOL-16, VOL-17, UNI-09 → 3.8.
  * GEN-08 → section 5, step 7.
  * LIB-21 → section 5, step 6.
* **Variation and periodization:**
  * PER-01..04, PER-06..08, PER-10 → 3.10, section 4, V25.
  * CAT-05, CAT-06, PRG-05, PRG-06 → V23, VP-12.
* **Positions and levels:**
  * CAT-04, CAT-10 → 1.2, V13.
  * CAT-11 → V19.
  * LIB-13, LIB-15, LIB-06, LIB-08 → V23, CA-1.
* **Athletic work:**
  * ATH-01..13 → V19-V21, LV-3, LV-11, LV-12, LV-14, 3.3, 3.13.
  * EQ-06, EQ-15, EQ-16 → V19, V20.
  * LIB-02, LIB-04, LIB-07, LIB-22 → V19, LV-3, LV-12.
* **Equipment:**
  * EQ-01..14 → V10, V16, V17, CA-2, CA-12, QM-5, QM-10.
  * GEN-04 → V10 notes.
* **Library and programs:**
  * LIB-09, LIB-14, LIB-16, LIB-18, LIB-20 → 3.2, V15, V18, V21.
  * PRG-02, PRG-03, PRG-07, PRG-08, PRG-11 → V07, V09, 3.9.
* **Generator:**
  * GEN-02 → Example B intake.
  * GEN-03, GEN-05 → 3.5.
  * CAT-12 → open question 10.

**Problems found and fixed:**

| # | Problem (where) | Fix (MD + JSON) | Coach answer |
|---|---|---|---|
| VF-1 | LV-12 and the 2.3 'TRIPPLE EXTENSION' row held the full Olympic lifts back to L3: 'L2+ hang power; L3 full lifts'. That contradicts ATH-10 ("the more intermediate plus and advanced and pros are going to be doing the full scope") and change 21 of this file. | L1 and beginning intermediates: DB/KB snatches, hex-bar jumps, hang pulls/cleans. L2-L3: the full scope. Example B now states that its high-hang choice is an INFERRED choice, not a level limit. New I14 flags the same split in 12. | ATH-10 |
| VF-2 | 'No V-squat' was missing. It is one of the GEN-08 hard rules (RIGHT), and CA-12's 'no machine ranking' could have read as allowing it. The other GEN-08 hard rules were scattered. | Added to the V10 notes and the V10 JSON generator, and to the CA-12 decision. Ordering algorithm step 7 now lists all five GEN-08 hard rules plus the coach-rules layer. | GEN-08, EQ-11 |
| VF-3 | CA-12 cited 'HACK SQUAT' at SQ H38. | The dump shows G37:H37 ('HACK SQUAT', "I PERSONALLY DON'T LIKE IT"). 'V-SQUAT' is now cited at G39:I39, including "I don't presercibe the use of these, ever." | EQ-11 |
| VF-4 | ATH-04 (boxers: reduce, never cut, pressing and arm volume) appeared only in the answers table, whose effect column pointed to 'goal modifiers'. The goal-modifier table had no such row. | Added the row 'Boxer / striker in high-punching weeks' to 3.3 and to JSON `rates.goal_modifiers`: pressing and arms x 0.5-0.7, never zero (factor PROPOSED, as in 12 3.4). | ATH-04 |
| VF-5 | The credit map gave glutes 0.5 on BHD/UHD, tagged only 'PROPOSED'. It did not say that this departs from the coach's 0.25 helper rule, which is the retired-0.5 pattern. | Now tagged as a deliberate PROPOSED exception (glutes as a co-mover of hip extension). V06, the 1.4 notes and open question 5 now ask him directly. The values are unchanged and still match 12. | VOL-09 |
| VF-6 | The bodybuilder / powerlifter upper-body share '80-90' was tagged COACH-ANSWER UNI-02. The coach gave no upper number; UNI-03 repeats the field-athlete text ('the same' logic). | The upper number is marked PROPOSED in 3.7, JSON `targets[0]` and `profiles_12[0]`. Open question 9 is extended. New I15 flags 12. | UNI-02, UNI-03 |
| VF-7 | 'Exercises per session: 8 PROPOSED'. VOL-08's assumption, marked RIGHT, already gives 75-90 min ≈ 8-9 exercises. | The cap row now cites the time ladder as COACH-ANSWER VOL-08. Whether the 2-exercise core block counts inside the 8-9 for non-athletes is marked INFERRED. Example A's 8 resistance exercises + 2 core in 66-71 min is that case. New I16. | VOL-08, VOL-16, VOL-17 |
| VF-8 | The JSON key `V19_plyo_phase_zone_height` (`key` 'plyo_phase_zone_height') still named the retired plyo 'zone'. | Renamed to `V19_plyo_phase_method_stage_height` / 'plyo_phase_method_stage_height', with a `renamed_from` note. A grep of synthesis/, analysis/, BLAZE_CAMP_BRAIN.md and generator_spec_v0.json found no other reference to the old key. | CAT-10, CAT-11 |
| VF-9 | JSON `rates.retired_v0_rate_table` was a plain list with live-looking numeric `rate_pct` fields (BIG 3 / 5, SMALL 7). Its UNPLACED row still read 'credited 0.5 from presses / hinges'. | Wrapped as {`retired`: true, `status`, `rows`}, with the fields renamed `v0_rate_pct_RETIRED` and `v0_focus_rate_pct_RETIRED`. The 0.5 text now reads 0.25 since VOL-09. `retired`: true was also added to V17, LV-5 and Z-F (with a status). | VOL-05, VOL-09, EQ-12 |
| VF-10 | The JSON observed-share row for the BYOP 'JUSTICE LEAGUE' tab carried no generic program name. | Added `program_generic_name` = 'Athletic Performance - Non-Competitive'. | ATH-13, FIX-03 |
| VF-11 | Relevant answers had no rule anywhere in the file: GEN-04, EQ-05, EQ-09, ATH-06, LIB-02, LIB-04, LIB-15, LIB-18, LIB-20, LIB-21, LIB-22, PRG-03, PRG-11. | Added to V10 (default + dropdown swaps; implement default bodyweight → DB → barbell; seated machine shoulder press), CA-1, the 2.3 COD row (routes for every athlete by turn angle), V19 (advanced hurdle hops; box-start push-up landing), V23 (leg extensions and curls at every level), V21 (the '21.6 mile run' = his 'marathon', flagged; a marathon is 26.2 mi), V18 (the frontal/transverse moves join the library), ordering step 6 (speed-session order), LV-3 ('ALL LIST' 1 x 10), V07 (bootcamp 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min; fat-burn circuits as a finisher). The answers table has 3 new rows, and `questionnaire_ids_referenced` was updated. | as listed |
| VF-12 | 3.3 let the coach hand-set 0-10 % with no qualifier, which could read as permission for 10 % steps. | Clarified: a hand-set 10 % is a one-week ceiling, not a plan step. | UNI-05 |
| VF-13 | V21 gave aesthetics clients 4 aerobic sessions without noting the clash with the cheat sheet's 'Never do the same color workout in the same week' (3 colours). | Noted. The answer wins, and which colour repeats stays open (03, 05). | ATH-07 |
| VF-14 | Duplicated wording in the contra/ipsi table (3.7). | Cleaned. | - |

**Retired-idea scan (MD and JSON, after the fixes):**

* **Size-based 3/5/7 %:** found only in the RETIRED banner (3.3), change 1, CA-5, I1 and the JSON `retired_mapping` / `retired_v0_rate_table` (`retired`: true). 'Priority first, then big, then small' in 3.11 is the order in which muscles are processed, not a rate.
* **0.5 helper credit:** none left. The remaining 0.5 values are dips 0.5 / 0.5 and thruster shoulders 0.5 (the coach's own numbers), the labelled PROPOSED glute exception, the Pelland comparison count, and v0 history.
* **Bands, chains, weight releasers:** found only in V17 / LV-5 / Z-F (all RETIRED), OBSERVED quotes marked out of scope, and the 'removed' notes in the swap ladder. None appear in a default, a swap, an example or a JSON generator field.
* **Plyo zones as a fixed exercise property:** none. V19 is a method stage that can change inside a block. 'ZONE' survives only in OBSERVED quotes (S23 C34:D36) and the coach's own CAT-11 words. The JSON key is renamed.
* **Core after the power block as the default:** none. It appears only as OBSERVED (R10-core, CA-13) and in the change log. Every training day of both examples opens with the core block.
* **Sex-based rules:** none. Example B's intake says there is no sex field, and population rules use age, foundation, goal and injuries (ATH-09).
* **'Justice League' as a program name:** none. JL is used only as the verbatim tab name in cell citations, with the generic name given alongside.
* **Hack squat ranked last:** none. It appears only in the CA-12 title and the OBSERVED cell; the decision is no ranking (V-squat excluded by GEN-08).
* **6-week plan = 5 weeks + deload:** none. 4-6 weeks = maintenance / transition at about 50-70 % (3.10).

**Mechanical checks:**

* Every Markdown table row has its header's column count (script: 0 mismatches).
* The JSON parses, with the same top-level key order and formatting (indent 1, UTF-8) as before.
* 126 distinct question IDs are cited across the MD and JSON, and all exist in `coach_answers_full.md`.
* Every 'ID RIGHT / PARTLY / NOT RIGHT' claim matches the coach's chip. The only hit is the earlier log line that records the N3 / UNI-06 fix.

**Not changed, on purpose:**

* The engine numbers in 3.4, 3.12 and 3.13 were not re-run, because no fix changes a rule the runs use. VF-1 widens the allowed Olympic choices, VF-4 does not apply to either example, and VF-5 to VF-7 are relabels with unchanged values.
* The credit-map values and share numbers still equal 12's JSON. Only the tags differ (VF-5, VF-6).

**Flagged to the 12 owner:** I14 (Olympic level split in 12 3.13), I15 (bodybuilder upper-share tag in 12 3.11), I16 ('8 PROPOSED' in 12 3.10).
