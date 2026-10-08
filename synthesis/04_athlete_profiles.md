# Athlete & goal profiles: how emphasis changes by sport and goal (v1)

Deliverable 04 of the Blaze Camp model synthesis, **version v1 (2026-10-08): the coach's questionnaire answers (`coach_answers_full.md`, 138 of 140 answered) are applied and override every earlier inference from the sheets.** Companion machine-readable file: `04_profiles.json` (same folder). Inputs: every program decode under `analysis/programs/`, the library, reference and equipment decodes, and the coach answers. Numbers are recomputed by script: `synthesis/_build_04/` (`python3 render.py` regenerates both files; `profiles_v1.py` holds every v1 change on top of the frozen v0 data in `profiles_data.py`; `v1_power_mix.py` re-counts the coach's athletic work by ground contact; the v0 scripts and outputs are frozen in `_build_04/v0/`). Nothing in Google Sheets was opened for writing.

## v1 - coach answers applied

Every change below cites the question ID in `coach_answers_full.md`. Where the coach confirmed a direction but not the numbers, the numbers are marked **PROPOSED - PENDING COACH APPROVAL**.

| question ID(s) | what changed in this document |
|---|---|
| ATH-01 / CAT-10 | Plyo vs ballistic is decided by the sport's ground-contact time. New per-profile attribute `ground_contact` (class 1-5) and a derived plyo : ballistic split of power sets (PROPOSED map 75/60/50/40/25 % plyo, floor 20, ceiling 80); new BALL category (ballistic jumps) split out of PLYO; programs start ballistic and become more plyometric. |
| ATH-01 (observed re-count) | The coach's written athletic work was re-classified by ground contact (v1_power_mix.py): BASEBALL blocks 36-44% plyo, BOXER weeks 3-6 30%, MM athletic 8-33% - these anchor the class map. |
| ATH-02 | Confirmed plyo ranking is now enforced by construction on a new PLYOMETRIC-contacts dial (fast-SSC, high amplitude): basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf. The v0 scale (all jump contacts) is kept as the NSCA safety check. Resolves v0 open questions 1-3. |
| ATH-03 | Resistance vs speed/power groups encoded per profile (`ath03_group`); rugby mapped to lineman / big-skill profiles, heavyweight fighters by body weight, track & field throwers added as a variant. |
| UNI-02 / UNI-03 / UNI-10 | Bilateral : unilateral share per profile on the 90/10 <-> 10/90 scale with block-start, block-end and in-season values (bodybuilders / powerlifters 50/50 -> 80/20-90/10; field / COD athletes 80-90% unilateral; in-season bilateral minimal); upper body follows the same logic; weekly set budgets re-split to the mid-block value. |
| CAT-13 | Contralateral (into the hip: COD sports - football, soccer, basketball, tennis) vs ipsilateral (out of the hip: sprint acceleration, ipsilateral step-ups); contra/ipsi as health accessories for bodybuilders / powerlifters mostly in weeks 1-4. |
| UNI-12 | Frontal / transverse share of unilateral lower sets per profile (high for basketball, tennis, soccer, MMA and other court / combat athletes; low for aesthetics). |
| UNI-06 / UNI-11 / ORD-06 | Pairing: same-pattern for aesthetics and high-level athletes, cross-pattern for bootcamp / general; hip-dominant + push and knee-dominant + pull in full-body and bootcamp days (Bootcamp Option 1 Tue/Fri wiring corrected). |
| ATH-04 | Boxers (and, by extension, strikers) REDUCE pressing, vertical pulling and arm isolation when punching volume is high - never cut to zero; SHOULDER_STRIKER rule and boxing budget changed (HPUSH 3, VPULL 3, arms 2 + 2). |
| ATH-05 / EQ-06 / EQ-07 / LIB-22 | Medball volume by sport: high for baseball, boxing, MMA, tennis, golf; moderate for basketball and football; none in the main workout for aesthetics (warm-up only); ball never over 20 lb; no band chops; a throwing slot can be the whole ~19-throw list. |
| ATH-07 / ORD-09 | Aerobic sessions/week: 3 general and fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts; fighters get a real aerobic block; athlete off-season counts PROPOSED. |
| ATH-08 | Pitcher variant confirmed: less overhead pressing, more arm care, rotational throws kept light. |
| ATH-09 / GEN-02 | No sex-based logic anywhere (female-athlete landing rule, softball rationale and bone-stress list removed; v0 open question 14 answered): age, foundation, goal and injuries decide. Older clients: few plyos unless asked. Youth: some Olympic lifts from the floor. |
| ATH-10 / LIB-07 / LIB-13 | Everyone in athletic training gets Olympic lifts by level (L1 DB/KB snatch, hex-bar jumps, hang pulls/cleans; L2+ full 'Squat' lifts); Olympic dose raised where it was optional or zero (baseball 0.6 -> 8, golf, soccer, tennis, karate, BJJ, youth, distance runner). |
| ATH-12 | Contrast / complexes: L2+ athletes, off-season only, ~78-85%, no rest inside the complex. |
| ATH-13 / FIX-03 | The 'Justice League' name is retired: the profile is now 'All-around athletic / weekend warrior (non-competitive adults and youth)' (`weekend_warrior`, was `athlete_generic`); the sheet tab is cited only as a source. |
| PER-08 | In-season content by athlete type: speed athletes -> sprints, most others -> strength maintenance, some -> high jumps; about 2 lifting days; minimal bilateral; 2 aerobic sessions. |
| PRG-09 | High school, college and pro baseball (and other) athletes share the same plan; loads and speeds differ; pros get more care. Competition level is a modifier, not a profile. Thursday = strength. |
| EQ-03 / EQ-04 / EQ-11 | Older, injured and high-volume clients collect volume on constrained machines (compounds and isolation); never overhead squat, snatch, low-bar squat, depth jumps; new HIGH_VOLUME_CONSTRAINT rule; hack squat no longer 'deprioritised' (machines are not ranked). |
| EQ-01 / EQ-12 | No bands or variable resistance in any generator rule (banded neck, banded adduction, chained / banded pulls, 'reverse banded' squirrel jumps written unbanded). |
| VOL-09 / UNI-01 / VOL-10 | Muscle credit map: helpers 0.25 (was 0.5); unilateral knee-dominant credits quads 1.0, glutes 0.25; athletic sets credit no muscle. Per-muscle table recomputed. |
| VOL-17 / ATH-11 | Calves 3 sets every leg day, rear delts their own sets, about 2 core exercises for athletes; core FIRST in every session (movable). Weekly budgets updated. |
| VOL-08 / VOL-16 / UNI-09 | Session caps and length per population added to the assembly rules (field athletes off-season up to 10-12 exercises; resistance-only 5-7; ~1.5 h athletes, 45-60 min general). |
| PER-01 / PER-05 / PER-07 / PER-10 / PER-11 | Plan-length shapes rewritten: 4-6-week maintenance / transition at 50-70% volume, 8-week = 4 adapt + 4 drive, 12-week = 2-4 acclimation + 4-6 build + hardest last weeks, repeated cycles one level higher, week-by-week and yearly modes; deload ~half the sets; tests by checkbox; VOL 1/2/3 per block for all athletes. |
| ORD-08 | A-drills are warm-up, not volume: the MM UPPER/LOWER and PPL rows in section 2 now show 0% athletic share (A-drill sets moved out of the totals). |
| ATH-06 / LIB-21 | Route-tree COD names are for every athlete, tiered by turn angle; MACH drills and the fixed speed-session order go into the library (resolves v0 questions 4-5 except reactive agility). |
| VOL-11 / PRG-07 / UNI-04 | 40-rep sets are an optional AMRAP / CrossFit style only; '12/10/8 -20' pyramid and '10/10' per-side meanings recorded; heavy low-rep unilateral work optional. |
| PRG-04 / PRG-05 / PRG-06 | STARTING / MID / ADVANCED can be blocks or levels as needed; levels L1-L3 defined by training experience in years; rep/set rises must follow one sound algorithm for every model. |
| PRG-10 / PRG-12 / LIB-18 | CrossFit FULL TIME = competitor, HALF TIME = class member; Chris Hinshaw plan used as-is for the half marathon only; the '21.6 mile run' is the coach's 'marathon' (flag: 26.2 mi). |

**Still pending (not decided by the answers):**

* Ground-contact class per sport and the class -> plyo-share map (75/60/50/40/25) are PROPOSED - need coach approval, especially basketball = 50/50 ('good mix'), karate / boxing 25/75 and distance runners.
* Per-sport bilateral : unilateral values for sports the coach did not name (baseball, softball, golf, sprinters, linemen, wrestlers, volleyball, combat) are PROPOSED.
* Athlete OFF-season aerobic sessions (ATH-07 only fixes in-season = 2) are PROPOSED at 2-4 by sport.
* Doses for rear delts (4-6 sets/week), core for non-athletes (1 exercise/session) and striker press reduction (30-50% of base) are PROPOSED.
* Plyo method stage timing per plan length is PROPOSED (the coach described the order, not the weeks).
* Older-adult age threshold (PROPOSED 60+) not given by the coach.
* Added by the v1 verification (PROPOSED): the exercise-count consolidation rule for athlete days over the 12-exercise cap (5.3b), the clamp of OBSERVED budgets to their plyometric band (boxer = karate, 5.12), contrast allowed through the pre-season build (section 7), and the hinge credit (hamstrings and glutes 1.0 each, 5.6) - questions 11.2 #11-13.
* Added by the second v1 verification (PROPOSED): field-court pre-season multipliers (resistance 0.8, PLYO 1.2) and in-season multipliers (about half the weekly sets: resistance / core 0.5, PLYO 0.4, THROW 0.6) re-based on PER-08; BALL multipliers per season phase; combat base phase with L1 Olympic variants and an about-4-week adapt part (PER-01); Olympic substitutes without snatch variants for older / injured athletes; the powerlifting second lower day non-axial (PER-04) - questions 11.2 #14-16.
* Still open from v0 (not in the questionnaire): youth maturation input (Q15), neck library column (Q16, carries/drags confirmed by LIB-19), golf / tennis / hockey template choice (Q17), core plane rotation by day (Q12), lactate-clearance sports (Q13), position splits beyond pitchers (Q19), reactive-agility list (Q5), the hybrid 'AMRAP' row, CrossFit WOD count at level 4.
* Volume per muscle: the per-person 3/5/7% weekly rate, landmarks and set-addition order live in the volume engine (03 v1 / 12_volume_algorithm_v1); this file only carries the profile baselines.

New questions these answers raise are in section 11.2.

## 0. How to read this

* Evidence labels: **OBSERVED** = read from the coach's sheets (tab + cell or decoded program). **COACH-ANSWER <ID>** = the coach's questionnaire answer (authoritative). **INFERRED** = analyst reasoning. **SCIENCE** = external literature (section 12, [S#]). **PROPOSED** = analyst proposal grounded in science or the coach's own numbers, PENDING COACH APPROVAL.
* Coach labels are quoted verbatim with their typos ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT', 'CLERANCE'); our own names use correct spelling. The BYOP tab named 'JUSTICE LEAGUE' is called the **weekend-warrior tab** here (a marketing name - COACH-ANSWER ATH-13).
* **Unit of work = one working set** (a movement inside a superset/complex counts its own sets; one medball throw line of 10 = 1 set; a 10/10 per-side set = 1 set - COACH-ANSWER UNI-01 / PRG-07). Shares are % of weekly working sets. Athletic share is shown with and without throws.
* **Conditioning is not in sets.** It is counted in sessions per week by colour: **A** blue short/high, **B** green moderate 1-3 min, **C** orange long/low, **LC** lactate clearance ('AEROBIC CAPACITY CHEAT SHEET'); session counts per population are COACH-ANSWER ATH-07.
* **Power work (v1)** = PLYO + JLK (plyometric side: short ground contact, incl. the landings that teach it) + BALL + THROW (ballistic side: long contact or single effort). The plyo share of power sets is the dial the coach's ground-contact rule controls (ATH-01).
* **Category codes** (the coach's slot grammar): `PLYO` = high-amplitude PLYOMETRIC work = short ground contact, reactive (hops, bounds, hurdle hops, depth/drop jumps, repeated jumps) plus the landing drills that teach it (method stage 1 'receive and pause'); library 'PLYOS' + 'FULL JUMPING' (COACH-ANSWER ATH-01 / CAT-10: 'the longer they're on the ground, the less it is going to be plyo'); `JLK` = low-amplitude PLYOMETRIC work (fastest stretch-shortening: ankle hops, pogos, squirrel jumps, plate hops; jump rope tracked in minutes); BYOP library heading 'JUMPING ANKLE' F5 / ankle-hop block C124-C136 ('JUMPING LIMITED KNEE' is the MASTER_MODEL Sheet23 heading E1/G1). The coach files squirrel jumps under PLYOS 'ADVANCED' / 'FULL JUMPING' (G126-G127, J9-J10): under the v1 ground-contact model they are plyometric either way; `THROW` = medball throws = upper-body / rotational BALLISTICS ('THROWING'; the 'MEDBALL CHEAT SHEET' 'ALL LIST' = one pass of ~19 throws x 10, LIB-22); no levels on throws, 'just do them right' (LIB-06); ball never over 20 lb (EQ-06); none in the main workout for aesthetics clients (ATH-05); `COD` = change of direction ('CHANGE OF DIRECTION'): the route-tree names are for EVERY athlete, tiered EASY / MOD. / HARD TURN by turn angle (COACH-ANSWER ATH-06); `SPRINT` = sprint / acceleration (no BYOP slot yet; MACH drills and the fixed speed-session order squirrel jumps -> MACH / acceleration starts -> max velocity are to be added to the library, LIB-21); `TE` = Olympic lifts / triple extension ('TRIPPLE EXTENSION'): EVERY athlete in athletic training gets them (COACH-ANSWER ATH-10) - L1 = DB/KB snatches, hex-bar jumps, hang pulls / hang cleans (no bumpers needed); L2+ = full lifts ('Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' - LIB-07) and power variants; push press easier, push jerk L2-L3 (LIB-13); `BKD` = 'Bilateral KD'; `BHD` = 'Bilateral HD'; `UKD` = 'Unilateral KD'; `UHD` = 'Unilateral HD'; `HPUSH` = 'Horizontal Push'; `VPUSH` = 'Vertical Push'; `HPULL` = 'Horizontal Pull'; `VPULL` = 'Vertical Pull'; `ISO_QUAD` = 'Leg Extensions'; `ISO_HAM` = 'Leg Curls' / Nordic; `ISO_CHEST` = 'Flies'; `ISO_SIDE` = 'ABdution' (side raises); `ISO_REAR` = 'Reverse Flies' / ER / face pull - rear delts get their OWN sets (COACH-ANSWER VOL-17); `ISO_BICEP` = 'Bicep'; `ISO_TRICEP` = 'Tricep'; `ISO_CALF` = 'Calves' - 3 sets every leg day, single-leg (ramp / plate / deficit) or bilateral (COACH-ANSWER VOL-17); `ISO_NECK` = neck (NO library column); `ISO_GRIP` = grip / carries / drags (library CARRY / DRAGS columns BA/BB hold only sub-headings, no exercises); `CORE` = 'Core' (CORE THORAX / CORE PELVIS / FUNCTIONAL slings) - done FIRST in the session as the warm-up, movable by the user (COACH-ANSWER ATH-11); about 2 core exercises for athletes (VOL-17); `FOCUS` = 'Focus 1' / 'Focus 2' (FULL FOCUS LIST); `BALL` = BALLISTIC jumps (NEW in v1) = long ground contact or single maximal effort: loaded jumps (DB / hex-bar / squat jumps, loaded 10-20% body weight - EQ-15), box jumps, broad jumps, march jumps, step-up jumps (COACH-ANSWER ATH-01 / CAT-10; split out of the v0 PLYO bucket).
* **Nominal reps** (used only to check that a set budget lands in its tier): PLYO 8 (plyometric + landing contacts per set ('6 to 8 Reps' weekend-warrior tab; depth drops 1x8 MM athletic)); JLK 20 (low-amplitude contacts per set (ankle hops '10/10', squirrel 20-40)); THROW 10 (throws per set (MEDBALL CHEAT SHEET '1' x '10')); COD 7 (planned cuts per set ('6 to 8 Reps' on 'DIG/OUT')); SPRINT 60 (metres at >90% per set (3 x 20 m)); TE 4 (reps per set (Olympic/pull work 2-6)); BALL 5 (loaded / single-effort jump reps per set ('5 DB squat jumps', '5 broad jumps', 'HEX bar loaded Jumps' 4-6)). Plyometric contacts = PLYO sets x 8 x (1 - landing share). OBSERVED profiles carry their observed counts.

## 1. Headline findings

1. COACH-ANSWER ATH-01 / CAT-10: what decides plyos vs ballistics is how long the sport keeps the athlete on the ground - short contacts (sprinters) -> more plyos, long contacts (karate, fighters, baseball) -> more ballistics, basketball 'a good mix'; programs start ballistic and become plyometric. v1 encodes a `ground_contact` class (1-5) per sport and derives the plyo share of power sets (PROPOSED map 75 / 60 / 50 / 40 / 25%, floor 20, ceiling 80). OBSERVED anchors from a re-count of his own programs by ground contact: BASEBALL blocks 44% / 36% / 44% plyo side, BOXER weeks 3-6 30%, MM athletic STARTING / MID / ADVANCED 33% / 8% / 9% (throw-dominant).
2. COACH-ANSWER ATH-02 (ranking confirmed): basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf. v1 applies it to FAST-reactive plyometric contacts (the ground-contact definition): the boxer's 113-129 weekly jump contacts are mostly ballistic jumps (66) and landings (24), only 31 are fast-reactive, below baseball's 37 / 58 / 74 - so the coach's own programs agree with his ranking once contacts are classified his way. Targets follow the ranking by construction (section 5.12).
3. COACH-ANSWER UNI-02 / UNI-03 / UNI-10: bilateral : unilateral runs from 90/10 to 10/90 by athlete, goal, phase and pain - bodybuilders / powerlifters about 50/50 at the start then 80/20-90/10 bilateral, field / change-of-direction athletes 80-90% unilateral, bilateral minimal in season; unilateral = health and rotational foundation, bilateral = driving force; upper body the same. OBSERVED today: 26-32% unilateral in strength / conjugate, ~50% in the BYOP 4-day templates, 43-47% in baseball (every block, including in-season), 50-75% in the MM athletic blocks, 63% HYBRID. v1 sets block-start / block-end / in-season values per profile (section 5.11).
4. COACH-ANSWER CAT-13 / UNI-12 / UNI-06: contralateral loading pulls you INTO the hip (change-of-direction athletes: football, soccer, basketball, tennis), ipsilateral helps you OUT of the hip (sprint acceleration - ipsilateral step-ups); for bodybuilders / powerlifters contra/ipsi work is a health accessory mostly in weeks 1-4. Court and combat athletes get more frontal / transverse unilateral work, aesthetics clients little. Same-pattern pairing (squat + lunge) drives a muscle harder (aesthetics, high-level athletes); cross-pattern pairing keeps bootcamp clients less sore.
5. COACH-ANSWER ATH-05 / EQ-06: medball volume is high for baseball, boxing, MMA, tennis and golf, moderate for basketball and football, and NONE in the main workout for aesthetics clients (warm-up only); balls never over 20 lb. OBSERVED volumes: 176-192 throws/week in baseball (block means; single weeks 70-290; 45-63% transverse), 190 -> 380 for the boxer, 210 -> 400 -> 420 in the MM athletic blocks (210 and 420 ASSUMED from 'ALL LIST'), 64-96 in the BYOP athletic template at 2 sets.
6. COACH-ANSWER ATH-10 / ATH-12 / ATH-09: everyone in athletic training gets Olympic lifts (L1: DB/KB snatches, hex-bar jumps, hang pulls / cleans without bumpers; L2+: full 'Squat' lifts), youth may do some from the floor; contrast / complexes only for L2+ athletes in the off-season at ~78-85%. v1 raises the Olympic dose where it was optional or zero (baseball 0.6 -> 8 sets, golf, soccer, tennis, karate, BJJ, youth, distance runners).
7. COACH-ANSWER ATH-07 / ORD-09: aerobic sessions per week = 3 for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics / bodybuilders plus long walks after workouts; fighters get a real aerobic block, not a warm-up. OBSERVED today: physique colour C 2x/week; fat loss C 2x + 2 metabolic circuits (12 -> 33 min work); boxer one A + one C; baseball only short A-type buy-outs (10-39 s, 3-4 bouts/week); HYBRID one A + one C; CrossFit 2-4 by level + 1-4 WODs.
8. COACH-ANSWER ATH-04: boxers REDUCE pressing and arm volume when punching volume is high - 'don't completely cut it'. OBSERVED: the boxing tab removed horizontal push, vertical pull and arm isolation in weeks 3-8; v1 keeps HPUSH 3, VPULL 3 and 2 + 2 arm sets in the boxing budget and applies the same reduce-not-cut rule to the other strikers.
9. COACH-ANSWER PER-08: in season, speed athletes sprint, most others maintain strength, some keep high jumps; about 2 lifting days, low volume, bilateral minimal, 2 aerobic sessions; pre-season = more speed / power, less volume (PER-08 RIGHT) - the v1 season multipliers (section 7) follow this, not the observed baseball volumes. OBSERVED (BASEBALL; season labels INFERRED from dates): off-season = new menu every week, '12/10/8/8', OLY late; pre-season = +47% jump contacts, x3 sprint sets, contrast complexes, OLY 75 -> 90%, resistance flat then +2.6 / +3.8 / +3.7% per week, DELOAD (-31% resistance, -46% all sets); in-season = flat 4 x 10, no compound below 8 reps, no Olympic lifts, two alternating proven menus.
10. COACH-ANSWER ATH-09 / GEN-02: no rule depends on sex - age, foundation (training experience), goal and injuries decide. v1 removed the female-athlete landing rule, the softball 'female populations' rationale and the sex-based bone-stress list. Older clients get few plyos unless they ask; older, injured and high-volume clients collect volume on constrained machines and never get the overhead squat, snatch, low-bar squat or depth jumps (EQ-03).
11. COACH-ANSWER PRG-09: high school, college and pro athletes need the same things; loads and speeds change, pros get more care (contracts), college athletes adapt as much as they can, high school athletes 'just have to do a lot of work'. Competition level is therefore a modifier on loads and progression, not a separate profile.
12. COACH-ANSWER ATH-13: the 'Justice League' tab was a marketing name for a weekend-warrior program (non-competitive athletic adults and youth). The profile is now 'All-around athletic / weekend warrior' (`weekend_warrior`), and it is also where recreational players of any sport land (GEN-02).
13. OBSERVED athletic share of weekly working sets (excluding medball throws): 0% in every physique, bootcamp and fat-loss template and - after COACH-ANSWER ORD-08 (A-drills are warm-up) - 0% in the gym UPPER/LOWER and PPL examples too; 5% strength/conjugate (one 3x6 'EASY' plyo); 16% HYBRID; 16-22% BASEBALL; 32% BYOP athletic at the coach's 2-sets dose; 28% -> 19% -> 15% across the MM athletic STARTING / MID / ADVANCED blocks; 36% for the boxer's conversion weeks.
14. OBSERVED + INFERRED: the BYOP templates share one resistance skeleton (knee + pull / hip + push, bilateral -> unilateral -> isolation, every pattern 2x/week - pairing confirmed by UNI-11 / ORD-06) and swap the PREFIX: athletic slots for athletes, calves / biceps / triceps for physique, cardio slots for bootcamp. BASEBALL (Parts A-E) and BOXING (3x10 base -> complexes) are structurally different programs that reuse the same 8-pattern vocabulary, so 'one skeleton, many dials' is an INFERRED modelling choice.
15. COACH-ANSWER VOL-09 / VOL-10 / UNI-01 / VOL-17: helpers get 0.25 set (not 0.5), a 10/10 unilateral set is 1 set credited mainly to the primary muscle, athletic sets never count toward muscles, calves get 3 sets every leg day, rear delts their own sets and athletes about 2 core exercises a session. The per-muscle table (5.6) is recomputed with the 0.25 map; weekly budgets now carry the calves / rear-delt / core sets the coach says he always had athletes do but never wrote.
16. COACH-ANSWER ATH-11: core goes FIRST, as the warm-up, for everybody (movable after the plyos or the strength block if the user prefers) - replacing the v0 reading (BYOP core on optional days; BASEBALL core second; MM STARTING first / second / last). OBSERVED core-by-plane: BASEBALL rotates 'LATERAL CORE' (Mon), 'Transverse core' (Tue/Fri), 'Sagital core' (Thu) -> 48% transverse, 24% sagittal, 22% frontal sets.
17. COACH-ANSWER ATH-06 / LIB-21: the route-tree COD names are for every athlete, tiered by turn angle, and MACH drills plus the fixed speed-session order go into the library. OBSERVED: change of direction is zero in every MASTER_MODEL program; only the BYOP athletic template has COD (4 slots/week = 48-64 cuts at 2 sets); sprinting has no BYOP slot.
18. OBSERVED: 'level' moved volume in opposite directions by population - athletes STARTING -> MID -> ADVANCED: working sets -19% and -18%, jump contacts -51% and -55%, throws +90% and +5%; gym clients NOVICE -> NEWBY -> INTERMEDIATE: weekly sets +18-23% and +13-14%. COACH-ANSWER PRG-04 says STARTING / MID / ADVANCED are blocks or levels 'depending on whatever is needed', PRG-05 defines L1-L3 by training experience in years, and PRG-06 asks for one sound rep/set algorithm for every model (the upper-day rep rise was a fill error).
19. OBSERVED combat phasing (boxer): 2-week hypertrophy base (3 x 10 on all 8 patterns, no plyos) -> 6-week conversion (exercise list replaced, contrast complexes of the 'ALL ABOUT SQUATS' 'FRENCH CONTRAST' type - the boxing tab never uses that term, 2-week steps, wk 7 accessory mini-deload while the hinge complex / clean & press / row superset rise 3 -> 4 -> 6 sets, wk 8 peak). Steps and waves for fight prep are confirmed (PER-10).
20. OBSERVED injury logic the coach already uses (and confirmed by VOL-03 / UNI-08 / EQ-03): joint pain -> unilateral and split grips (DB/KB) first, cut the pattern 30-50%, machines, or drop the exercise; throwers press mostly with DBs / landmine / single-arm (barbell overhead pressing appears 3 times in the baseball year); Copenhagen planks appear in the athletic, boxing and baseball programs. SCIENCE adds Nordics (-51% hamstring injuries), Copenhagen (-41% groin problems), landing-first neuromuscular training (about -50% non-contact ACL injuries), jumper's-knee volume caps (44.6% prevalence in volleyball, 31.9% in basketball).
21. MATRIX v1: 27 profiles and 24 position/phase variants, each a weekly set budget per category (PLYO, JLK, BALL, THROW, COD, SPRINT, TE, 8 resistance patterns, isolations, CORE, FOCUS) so shares, muscle sets, plyo:ballistic split and contact checks are computed, not asserted. Off-season main days land at 16.3-44 sets and an estimated 41-80 minutes (PROPOSED time heuristic), inside the coach's 1.5 h (max 2 h) athlete cap; the general-population profile sits at about 43 min against the 45-60 min general cap, fat loss at about 62 min, just over it (UNI-09). v1 verification: by EXERCISE COUNT most athlete profiles exceed the coach's 10-12 cap (VOL-08) when each category gets its own exercises - 5.3b adds the check and a PROPOSED consolidation rule.
22. Library gaps the profiles need: a SPRINT slot and MACH drills (confirmed LIB-21), a plyo / ballistic / landing tag on every athletic item (new, ATH-01), REPS units for contacts / metres / seconds / per-side, neck exercises, CARRY and DRAGS items (confirmed LIB-19), a rear-delt slot (VOL-17), frontal / transverse lower-body moves (LIB-20), reactive agility drills and equipment tags.

## 2. OBSERVED: what each population actually gets in the coach's programs

### 2.1 Share of weekly working sets

Representative programs (BYOP templates at the stated set assumption; MASTER_MODEL programs as written, with the decode's assumptions where a cell was blank). Lower uni % = unilateral share of lower-body compound sets. v1: the MM UPPER/LOWER and PPL rows exclude their A-drill sets from the totals (A-drills are warm-up, not volume - COACH-ANSWER ORD-08).

| program | population | weekly sets | athletic % excl. throws | athletic % incl. throw-sets | compound % | isolation % | core % | focus % | lower uni % | knee/hip sets | push/pull sets | compound:iso |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated) | aesthetics / physique | 102 | 0 | 0 | 51 | 31.4 | 5.9 | 11.8 | 50 | 16/16 | 16/12 | 1.6 |
| BYOP 3 DAY BUILDER (+optional) | aesthetics 3-day | 80 | 0 | 0 | 48.8 | 17.5 | 11.2 | 22.5 | 42.9 | 12/11 | 9/9 | 2.8 |
| BYOP PPL 6-day @3 sets | bodybuilding split | 126 | 0 | 0 | 52.4 | 42.9 | 0 | 4.8 | 50 | 18/18 | 24/18 | 1.2 |
| BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3 | bootcamp / general fitness | 108 | 0 | 0 | 44.4 | 38.9 | 5.6 | 11.1 | 50 | 18/18 | 12/12 | 1.1 |
| BYOP BOOTCAMP 2 (6 sessions) @3 | bootcamp / conditioning | 72 | 0 | 0 | 66.7 | 25 | 8.3 | 0 | 50 | 12/12 | 12/12 | 2.7 |
| BYOP ATHLETIC 4-day @2 (coach dose) | athletic template (weekend warrior / any athlete) | 96 | 31.8 | 37.5 | 33.3 | 16.7 | 4.2 | 8.3 | 50 | 12/12 | 8/8 | 2 |
| BYOP WEEKEND-WARRIOR tab (sheet tab 'JUSTICE LEAGUE'; partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots) | weekend warrior / all-around athletic (partly filled example) | 96 | 31.8 | 37.5 | 33.3 | 16.7 | 4.2 | 8.3 | 50 | 12/12 | 8/8 | 2 |
| BYOP NO ACCESS ATHLETIC (as wired) | athlete (hidden copy; UHD miswired to LEG CURLS) | 96 | 31.8 | 37.5 | 29.2 | 20.8 | 4.2 | 8.3 | 33.3 | 12/12 | 8/8 | 1.4 |
| MM UPPER/LOWER NOVICE (4d) | general gym | 76 | 0 | 0 | 52.6 | 47.4 | 0 | 0 | 50 | 12/12 | 12/12 | 1.1 |
| MM UPPER/LOWER NEWBY (4d) | general gym | 90 | 0 | 0 | 53.3 | 46.7 | 0 | 0 | 50 | 18/18 | 12/12 | 1.1 |
| MM UPPER/LOWER INTERMEDIATE (4d) | general gym | 102 | 0 | 0 | 58.8 | 41.2 | 0 | 0 | 46.7 | 22/20 | 16/14 | 1.4 |
| MM PPL NOVICE (6d) | bodybuilding split | 96 | 0 | 0 | 47.9 | 50 | 2.1 | 0 | 50 | 12/12 | 18/12 | 1 |
| MM PPL NEWBY (6d) | bodybuilding split | 118 | 0 | 0 | 50.8 | 47.5 | 1.7 | 0 | 50 | 18/18 | 20/16 | 1.1 |
| MM PPL INTERMEDIATE (6d) | bodybuilding split | 134 | 0 | 0 | 53.7 | 44.8 | 1.5 | 0 | 46.7 | 22/20 | 24/18 | 1.2 |
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

Reading (INFERRED): three clusters. (1) **Physique / fat loss / bootcamp / gym**: no athletic work, isolation 19-47% of sets, core optional or circuit-only (v1: core goes first for everybody - ATH-11). (2) **Strength / CrossFit strength months**: 80-90% compound. (3) **Athletes and fighters**: athletic work 15-36% of non-throw sets plus large throw volumes; strikers' pressing reduced (v1: reduced, not cut - ATH-04).

### 2.2 Athletic dose by sub-type (weekly)

| program | athletic sets by type (decode buckets) | lower-body jump contacts / week | medball throws / week | COD | sprint | triple extension / Olympic |
|---|---|---|---|---|---|---|
| BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated) | - | 0 | 0 | 0 | 0 | 0 |
| BYOP 3 DAY BUILDER (+optional) | - | 0 | 0 | 0 | 0 | 0 |
| BYOP PPL 6-day @3 sets | - | 0 | 0 | 0 | 0 | 0 |
| BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3 | - | 0 | 0 | 0 | 0 | 0 |
| BYOP BOOTCAMP 2 (6 sessions) @3 | - | 0 | 0 | 0 | 0 | 0 |
| BYOP ATHLETIC 4-day @2 (coach dose) | PLYO 12, THROW 8, COD 8, TRIPLE_EXT 8 | 72-96 high (est.) | 64-96 | 48-64 cuts | none | 8 sets |
| BYOP WEEKEND-WARRIOR tab (sheet tab 'JUSTICE LEAGUE'; partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots) | PLYO 10, JUMP_LIMITED_KNEE 2, THROW 8, COD 8, TRIPLE_EXT 8 | ~60-80 high + ~12-16 low (est.: PLYO 10 / JLK 2 sets x '6 to 8 Reps') | 64-96 | 48-64 | none | 8 ('Power Clean') |
| BYOP NO ACCESS ATHLETIC (as wired) | PLYO 12, THROW 8, COD 8, TRIPLE_EXT 8 | 72-96 (est.) | 64-96 | 48-64 | none | 8 |
| MM UPPER/LOWER NOVICE (4d) | - | A-drills 72 per leg per lower day (144/wk at 2 lower days) - warm-up only (ORD-08), excluded from the totals | 0 | 0 | A-drills = warm-up (ORD-08) | 0 |
| MM UPPER/LOWER NEWBY (4d) | - | A-drills 90 per leg per lower day (180/wk) - warm-up only (ORD-08), excluded from the totals | 0 | 0 | A-drills = warm-up (ORD-08) | 0 |
| MM UPPER/LOWER INTERMEDIATE (4d) | - | A-drills 64 per leg per lower day (128/wk) - warm-up only (ORD-08), excluded from the totals | 0 | 0 | A-drills = warm-up (ORD-08) | 0 |
| MM PPL NOVICE (6d) | - | A-drills - warm-up only (ORD-08), excluded from the totals | 0 | 0 | A-drills = warm-up (ORD-08) | 0 |
| MM PPL NEWBY (6d) | - | A-drills - warm-up only (ORD-08), excluded from the totals | 0 | 0 | A-drills = warm-up (ORD-08) | 0 |
| MM PPL INTERMEDIATE (6d) | - | A-drills - warm-up only (ORD-08), excluded from the totals | 0 | 0 | A-drills = warm-up (ORD-08) | 0 |
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

| block (season) | jump contacts (v0 'high-amplitude') | low-amplitude contacts | vertical / horizontal / lateral contacts | unilateral contacts | landings | throws sagittal / transverse | core sets frontal / sagittal / transverse |
|---|---|---|---|---|---|---|---|
| B1 off-season (7 wk) | 102.6 | 96.6 | 146.6 / 38.3 / 14.3 | 70.6 | 14.3 | 97.9 / 80.0 | 2.1 / 3.1 / 5.6 |
| B2 pre-season (7 wk) | 151.4 | 89.3 | 200.4 / 28.9 / 11.4 | 97.7 | 12.9 | 70.6 / 121.7 | 3.7 / 3.1 / 7.3 |
| B3 in-season (8 wk) | 135.1 | 66.2 | 134.1 / 35.5 / 31.8 | 78.4 | 12.6 | 69.8 / 106.5 | 3.6 / 4.2 / 8.1 |
| all training weeks (share) | 61% | 39% | 75% / 16% / 9% | 39% | 6% | 43% / 57% | 22% / 24% / 48% (+6% unspecified) |

Classification rules (INFERRED, keyword based): lateral = 'lateral', 'side to side', 'skater'; horizontal = 'broad', 'bound', 'forward', 'hurdle', 'march jump'; unilateral = single leg / split / staggered / lunge / RFE / FFE / march / bound; low-amplitude = the JUMPING LIMITED KNEE bucket, ankle hops, squirrel jumps. Upper-body plyo push-ups (230 contacts over the year) are excluded.

### 2.3 Conditioning and core as written

| program | conditioning (colour per AEROBIC CAPACITY CHEAT SHEET) | core |
|---|---|---|
| BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated) | 2 'Cardio' slots (client pick) | 2 'Core' slots (client pick) |
| BYOP 3 DAY BUILDER (+optional) | 3 'Cardio' slots | 3 'Core' slots |
| BYOP PPL 6-day @3 sets | none | none |
| BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3 | 2 cardio slots | 2 |
| BYOP BOOTCAMP 2 (6 sessions) @3 | 6 cardio bouts (one per session) | 2 |
| BYOP ATHLETIC 4-day @2 (coach dose) | 2 'Aerobic Capacity' (client colour) | 2 slots (client pick) |
| BYOP WEEKEND-WARRIOR tab (sheet tab 'JUSTICE LEAGUE'; partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots) | 2 slots | 2 slots |
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
| MM athletic STARTING -> MID -> ADVANCED ('First 8 weeks (8wk1) adaptation focus' ...); blocks or levels 'depends on whatever is needed' (PRG-04) | volume down, intensity/specificity up | working sets 89 -> 72 -> 59; resistance 44 -> 44 -> 24; jump contacts 146 -> 71 -> 32; low 0 -> 120 -> 100; throws 210 -> 400 -> 420 (210/420 ASSUMED from 'ALL LIST'); core 20 -> 14 -> 26; deadlift 3x6 -> 2x6-8 -> 3x1 '1RIR' |
| MM UPPER/LOWER NOVICE -> NEWBY -> INTERMEDIATE | volume up | weekly resistance sets 76 -> 90 -> 102; lower compounds 2x12 -> 3x10 -> 4x8; upper compounds 3x8 -> 3x10 -> 4x12 (PRG-06: 'probably a fill error'); isolation 2-3 x 20 / 'MAX REPS' fixed |
| MM PPL NOVICE -> NEWBY -> INTERMEDIATE | volume up; most reps down | sets per rotation 47 -> 58 -> 66; push/pull compounds 3x15 -> 3-4x10 -> 4x8 except pull-ups 3x15 -> 4x10 -> 5x12 and dips 3x8 -> 3x10 -> 4x'MAX'; legs 2x8 -> 3x10 -> 4x8 |
| BOXER wk1-2 -> wk3-8 | base -> conversion | working sets (excl. throws) 80 -> 113 / 113 / 117 / 117 / 104 (wk7) / 136 (wk8); resistance 66 -> 50-68; athletic 0 -> 38-48; throws 190 -> 380; contacts 0 -> 258-306; sprint rounds 0 -> 5,5,6,6,7,8 |
| BASEBALL Block 1 -> 2 -> 3 (season reading INFERRED from dates) | build -> intensify -> maintain | AP_PLYO sets 9 -> 16.3 -> 14.6; sprint sets 1 -> 3.1 -> 1.8; throws 178 -> 192 -> 176; resistance sets/week ~72 -> 74-84 -> 64-76; main lifts '12/10/8/8' -> '8/6/4/4','6/6/5/4' -> 4x10; plyo side of power sets 44% -> 36% -> 44% (v1 re-count) |
| BASEBALL B2 DELOAD WEEK | deload recipe (PER-05 confirmed: about half the sets) | resistance 84 -> 58 (-31%); all sets 151 -> 82 (-46%); athletic 1-2 sets; no buy-out; no OLY; everything 3 x 8 |
| CROSSFIT macro A10:M17 | quality sequencing | RESISTANCE -> STRENGTH -> POWER -> TEST per ~4-month block; aerobic & WOD levels 1 -> 4 inside each block |
| 4 TRACKS plan shapes (A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING') | 8- and 12-week products (PER-01 replaces their shape - section 8) | 8 wk = 7 loading + deload/test; 12 wk = 6 + 'MID DELOAD' / 'A WEEK LOWER' + 5; weekly set growth +4.75-5.2% (12-wk tracks) |

### 2.5 The plyo question - answered by the coach

v0 asked whether the boxer's 113-129 jump contacts/week were 'a lot' (open questions 1-3). The coach answered with a different dial (COACH-ANSWER ATH-01): plyo vs ballistic depends on how long the sport keeps the athlete on the ground; fighters, karate and baseball players get more ballistics, sprinters more plyos, basketball a good mix; 'both of those ranges are important'. Re-counting his written programs by ground contact (section 2.6) shows his own programs already follow that rule: the boxer's high-amplitude contacts are mostly ballistic jumps and landings, and the fast-reactive part (31/week) is below the baseball blocks (37-74), matching his ranking boxing < baseball (ATH-02). The v0 high / low amplitude split stays as a separate dial: low-amplitude squirrel jumps and rope (1,227 contacts/week for the boxer) are plyometric (the fastest SSC) but stiffness work, not jumping volume.

### 2.6 Ground-contact re-count of the coach's athletic work (v1)

OBSERVED sets and reps per week from the decode JSONs; the class of each exercise is INFERRED by keyword from the coach's rule (`v1_power_mix.py`): RECEIVE = landings / sticks (plyo method stage 1); PLYO = short-contact reactive (stage 2-3; low = ankle hops, squirrel jumps, plate hops, rope; upper = plyo push-ups); BALLISTIC = medball throws + loaded / single-effort jumps. Sprint, Olympic and COD work are outside the split.

| program | landings sets (reps) | fast-reactive high sets (contacts) | low-amplitude sets (contacts) | upper plyo sets (contacts) | ballistic jump sets (reps) | throw sets (throws) | plyo side of power sets |
|---|---|---|---|---|---|---|---|
| BASEBALL B1 (off-season, 7 wk) | 1.4 (17) | 2.9 (37) | 4.9 (97) | 0.9 (9) | 3.9 (51) | 8.7 (178) | 44% |
| BASEBALL B2 (pre-season, 7 wk) | 0.9 (13) | 5.4 (58) | 5.6 (82) | 0 (0) | 10 (87) | 11.3 (192) | 36% |
| BASEBALL B3 (in-season, 8 wk) | 2.1 (20) | 6.2 (74) | 3.9 (66) | 1.1 (11) | 5.1 (49) | 11.6 (176) | 44% |
| BOXER weeks 3-6 | 3 (24) | 5 (31) | 12 (1227) | 0 (0) | 9 (66) | 38 (380) | 30% |
| MM athletic STARTING | 0 (0) | 9 (94) | 0 (0) | 3 (48) | 5 (52) | 19 (210) | 33% |
| MM athletic MID | 2 (16) | 0 (0) | 2 (120) | 0 (0) | 6 (55) | 40 (400) | 8% |
| MM athletic ADVANCED | 1 (8) | 0 (0) | 3 (100) | 0 (0) | 1 (24) | 38 (420) | 9% |

Reading: the coach's baseball year sits at 36-44% plyo (more ballistics and rotation, as he says for baseball), the boxer at 30% (more ballistics for a fighter), and the generic MM athletic blocks become MORE ballistic as they advance because the throw lists grow (33% -> 8% -> 9%) - the opposite of his within-program rule 'start more ballistic, then more plyometric' (CAT-10), so v1 follows the rule, not that ladder.

## 3. Profile calculus v1 (COACH-ANSWER rules first, then INFERRED)

**Confirmed by the coach:**

1. **Ground contact sets the plyo : ballistic split** (ATH-01, CAT-10); programs start ballistic and become plyometric; plyo method stages receive & pause -> receive then create -> repeated receive / create (not a 'plyo zone', CAT-11); unilateral plyos are harder (CAT-10).
2. **Bilateral : unilateral on the 90/10 <-> 10/90 scale** by goal, phase and pain (UNI-02 / UNI-03 / UNI-10); contralateral for change of direction, ipsilateral for acceleration, contra/ipsi as early-block health accessories for size/strength (CAT-13); more frontal / transverse unilateral for court and combat athletes (UNI-12).
3. **Same-pattern vs cross-pattern pairing is a goal rule** (UNI-06); hip-dominant + push, knee-dominant + pull everywhere (UNI-11, ORD-06).
4. **Medball by sport, none for aesthetics, <= 20 lb** (ATH-05, EQ-06); **Olympic lifts for every athletic trainee by level** (ATH-10); **contrast for L2+ off-season** (ATH-12).
5. **Aerobic sessions 3 / 2 / 4 (+ walks)** (ATH-07); fighters' opening cardio is a real block (ORD-09).
6. **Strikers reduce, never cut, pressing** (ATH-04); **pitchers: less overhead pressing, more arm care, light rotational throws** (ATH-08).
7. **No sex-based rules**; age, foundation, goal, injuries (ATH-09); older clients few plyos unless asked; older / injured / high-volume clients on constrained machines, never OHS / snatch / low-bar / depth jumps (EQ-03); youth some Olympic lifts from the floor (ATH-09).
8. **In season**: speed athletes sprint, most others maintain strength, some jump; about 2 lifting days; bilateral minimal (PER-08, UNI-10).
9. **Same needs across high school / college / pro**; loads, speeds and care differ (PRG-09).
10. **Resistance vs speed/power groups** (ATH-03): more resistance training (strength / size): football linemen, wrestlers, rugby (forwards -> lineman profile, backs -> big-skill profile), heavyweight fighters (body-weight intake moves a combat profile here), track & field throwers (variant); more speed and power: sprinters, basketball, football skill positions, volleyball (and soccer, football big-skill, ice hockey, track jumpers - INFERRED); rotational power + ballistics: baseball, softball, golf, tennis (ATH-01: 'more ballistics and rotational forces' for baseball); combat (ballistic-leaning power + conditioning): boxing, kickboxing, karate, MMA, BJJ (wrestling sits in the 'more resistance' group, ATH-03); size / strength (no athletic block): bodybuilding / aesthetics, powerlifting (and the CrossFit competitor - INFERRED); health / general: general population, fat loss, older adults, weekend warriors, youth (and the hybrid product and distance runners - INFERRED).

**Session rules from the answers** (they apply inside every profile):

* warm-up always (5 min any cardio + A March / Skip / Run or mobility); A-drills are warm-up, not volume (COACH-ANSWER ORD-08)
* CORE FIRST as part of the warm-up, movable after the plyos or the strength block if the user prefers (COACH-ANSWER ATH-11; replaces the v0 'core second / optional days' reading)
* order: core -> plyo / ballistics -> Olympic / power -> strength -> resistance accessories -> isolation (power before strength, ORD-03; the main lift first, ORD-02; horizontal pull before vertical pull, ORD-01)
* field athletes off-season: up to 10-12 exercises (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); resistance-only sessions about 5-7 exercises (COACH-ANSWER VOL-08 / VOL-16 / VOL-17)
* session length: athletes, bodybuilders, powerlifters about 1.5 h (max 2 h); general / weight-loss clients 45-60 min (COACH-ANSWER UNI-09); bootcamps 35-45 min, timed circuits 3-5 rounds x 30-50 s, 5-7 stations (PRG-03)
* pairing: hip-dominant (lower posterior) with upper push (anterior), knee-dominant with pull, in full-body and bootcamp days alike (COACH-ANSWER UNI-11 / ORD-06 - the Bootcamp Option 1 Tue/Fri wiring was a mistake)
* axial spinal loading once a week: squat on one day, leg press / belt squat on the other; deadlifts also load the spine (COACH-ANSWER PER-04, EQ-11)
* calves 3 sets every leg day; rear delts get their own sets; about 2 core exercises for athletes (COACH-ANSWER VOL-17)
* supersets are a fatigue / density tool: short sessions, advanced athletes needing more stimulus, off-season VO2 / mitochondrial work, beginners who do not fatigue (COACH-ANSWER ORD-05)
* optional days (Calves, Cardio, Core, Focus 1, Focus 2) can be add-ons or separate days - ideally separate (COACH-ANSWER ORD-10)
* athletic sets (plyos, ballistics, throws, Olympic lifts, sprints, COD) never count toward muscle weekly sets (COACH-ANSWER VOL-10)

**INFERRED from the sheets (still valid):**

1. **One skeleton, many dials** - a sport changes (a) which athletic slots precede the resistance block, (b) sets per slot, (c) which resistance slots are reduced or doubled, (d) exercise selection inside each slot (direction, laterality, plane, implement, contra/ipsi), (e) conditioning colours, (f) season multipliers.
2. **Upper and lower ballistics on different days** when athletic volume is high (OBSERVED BASEBALL Part A: 'Upper Ballistics/plyo' Mon/Thu, 'LOWER ballistics/plyo' Tue/Fri; MM MID/ADVANCED alternate jump days and medball days).
3. **Level per slot, not per person** (OBSERVED weekend-warrior tab mixes FOUNDATIONAL landings with ADVANCED power cleans; CAT-05 / CAT-06).
4. **Sport specificity mostly by selection and reduction**: rotational and frontal demand through exercise choice inside existing slots (baseball 'In-out of hip' scoops, Copenhagen, lateral step-ups 'IPSILATERAL loading'), pressing reduced for strikers, barbell bench never written for baseball, fat-loss jumping limited to circuit jacks / burpees.

**Generator assembly steps (v1):**

1. Intake (COACH-ANSWER GEN-02): goal; competitive sport -> sport + position + season, recreational -> general sport only (weekend-warrior profile); training experience in YEARS (-> L1 / L2 / L3, PRG-05); age; body weight; days; session length; equipment; injuries / pain; priority muscles; rep-style preference; plan type. NO sex field (GEN-02, ATH-09).
2. Pick the profile (+ position variant), season phase and competition level (high school / college / pro = same plan, different loads - PRG-09). A competitive sport without a profile uses the nearest profile by ground-contact class and ATH-03 group (PROPOSED).
3. Weekly set budget per category = profile.weekly_sets (v1 off-season build baseline) x season multiplier x the volume engine's person-based weekly rate (3 / 5 / 7% of weekly sets chosen by fatigue, life and response, never 10%/week - VOL-04 / VOL-05 / UNI-05; see 03 v1 / 12_volume_algorithm_v1). Plan type shapes the curve (PER-01): 4-6-week maintenance at 50-70% volume, 8-week = 4 adapt + 4 drive, 12-week = 2-4 acclimation + 4-6 build + hardest last weeks.
4. Power block: split power sets plyo : ballistic by the ground-contact class (ATH-01; map PROPOSED), start ballistic-biased and move to the target (CAT-10); plyo method stage 1 -> 2 -> 3 across the block; unilateral plyos after bilateral; medball volume by sport, none for aesthetics, ball <= 20 lb (ATH-05 / EQ-06); Olympic lifts for every athletic trainee at their level (ATH-10); contrast only L2+ off-season (ATH-12).
5. Resistance block: bilateral : unilateral share from the profile (block start -> end, in-season value; UNI-02 / UNI-10), the same logic for upper-body pressing and pulling (UNI-03); contralateral for COD athletes, ipsilateral for acceleration, contra/ipsi as early-block health accessories for size/strength clients (CAT-13); frontal / transverse unilateral share for court and combat athletes (UNI-12); pain moves the share or the machine choice (VOL-03).
6. Session order (COACH-ANSWER ATH-11, ORD-01..03, ORD-08): warm-up -> CORE FIRST (movable) -> plyo / ballistics -> Olympic / power -> main strength lift -> resistance accessories -> isolation (calves 3 sets every leg day, rear delts own sets - VOL-17); hip-dominant with push, knee-dominant with pull (UNI-11 / ORD-06); axial spinal loading once a week (PER-04); fighters open conditioning days with a real aerobic block (ORD-09).
7. Session caps (COACH-ANSWER VOL-08 / VOL-16 / VOL-17 / UNI-09): resistance-only 5-7 exercises; field athletes off-season up to 10-12 (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); about 1.5 h for athletes, bodybuilders and powerlifters (max 2 h), 45-60 min for general / weight-loss clients, 35-45 min bootcamps. Over budget -> supersets (ORD-05: also a fatigue tool) or fewer sets per slot, never drop the athletic prefix of an athlete profile. Over the EXERCISE cap -> consolidate athletic work into fewer exercises with more sets, a separate speed block for COD / sprint, supersets for calves / rear delts / arms, Focus on optional days (PROPOSED, section 5.3b).
8. Fill each slot with a DEFAULT exercise plus a dropdown of same-category swaps (GEN-04), filtered by level, equipment (no bands / variable resistance - EQ-01 / EQ-12), age and injury rules (older / injured / high-volume -> constrained machines; never OHS, snatch, low-bar squat, depth jumps - EQ-03), and client preference (EQ-10). Hard rules (GEN-08) + coach-added rules.
9. Dose reps by category and rep zone (VOL 1 / 2 / 3 per block for athletes - PER-11; STRENGTH; POWER; MYO last - VOL-15; RIR primary - VOL-13); athletic slots in contacts / throws / cuts / metres; deload = about half the sets (PER-05); tests chosen by checkbox at block start, or none (PER-07).
10. Audit: muscle sets vs targets (helpers 0.25, athletic sets excluded - VOL-09 / VOL-10); plyometric contacts vs the ATH-02 ranking band; all jump contacts vs the NSCA per-session guide; throws vs the ATH-05 tier; aerobic sessions 3 / 2 / 4 (+ walks) by population (ATH-07); estimated minutes vs the session-length cap.

**Level modifiers:**

| ladder | evidence | per step | rule |
|---|---|---|---|
| athlete_ladder | OBSERVED MM 'EXAMPLE ATHLETIC FULL BODY SPLI' STARTING -> MID -> ADVANCED; COACH-ANSWER PRG-04: these can be back-to-back off-season blocks OR athlete levels - 'depends on whatever is needed' | working_sets: -19% then -18%; jump_contacts_all: -51% then -55%; low_amplitude_contacts: 0 -> 120 -> 100; throws: +90% then +5% (STARTING 210 and ADVANCED 420 rest on reading 'ALL LIST' as the 19-throw MEDBALL CHEAT SHEET; only MID's 400 is fully written); plyo_share_of_power_sets: 33% -> 8% -> 9% (v1 re-count: the blocks get MORE ballistic, the opposite of the coach's within-program rule CAT-10 - they are throw-dominant); resistance_sets: 0% then -45%; core_sets: -30% then +86%; main_lift_reps: 6-8 -> 6-8 -> 1 (deadlift 3x6 / 2x'6/8' / 'DEADLIFTS (1RIR)' 3x1); sets_per_line: STARTING mostly 3 (range 1-5) -> MID mostly 2 (range 1-4) -> ADVANCED 1-3 | INFERRED from OBSERVED: a higher athlete level = less volume, more intensity, more single-leg / reactive work and more throws; not confirmed as a rule (PRG-04 'depends'); the volume engine (03 v1 / 12) decides sets per person |
| gym_ladder | OBSERVED MM UPPER/LOWER and PPL NOVICE -> NEWBY -> INTERMEDIATE; COACH-ANSWER PRG-05 (L1 / L2 / L3 by training experience), PRG-06 (the upper-day rep rise was 'probably a fill error' - rep and set rises must follow one sound algorithm for every model) | weekly_resistance_sets: +18-23% then +13-14% (OBSERVED); starting_sets_per_muscle: beginner 10-12, intermediate 15-20, advanced 20+ (COACH-ANSWER VOL-01); compound_reps: OBSERVED both directions (UL upper 3x8 -> 4x12 was a fill error per PRG-06); the generator uses one rep logic for all models; isolation: arms 20 / 'MAX REPS', leg ext/curl 20 and calves 'MAX REPS' (OBSERVED) | for physique / general clients a higher level = MORE sets (OBSERVED, consistent with VOL-01) |
| library_level_per_slot | OBSERVED weekend-warrior tab + AESTHETICS fills; COACH-ANSWER CAT-05 / CAT-06 | - | level is chosen per slot (FOUNDATIONAL / MODERATE / ADVANCED blocks inside each dropdown), not once per athlete; levels add options and never remove them, and are 'still very theoretical' (CAT-05); client level and exercise level are separate (CAT-06); load position sets exercise level (front-loaded = foundational, on the body = intermediate, behind / overhead = advanced; machines and cables easier - CAT-04, Davidson zones are rotation biases - vertical positions (arms down / standing, arms overhead, deep squat) = external-rotation bias, horizontal (hands in front, knee at hip height) = zone 2 internal-rotation bias, compressive - and do not apply to plyos, CAT-10); the levels are a guide only - do not over-rely on them (CAT-05) |
| experience_levels | COACH-ANSWER PRG-05 / GEN-02 | - | L1 novice = under about 6-12 months of training; L2 intermediate = consistent for over a year; L3 advanced; more than 6-12 months off -> body treated as L1 (skills come back fast); ex-pros start L1 only briefly |

## 4. Tier scales (INFERRED boundaries, OBSERVED anchors)

| dial | T0 | T1 | T2 | T3 | T4 | T5 | observed anchors |
|---|---|---|---|---|---|---|---|
| PLYOMETRIC contacts / week (fast-reactive, high amplitude) - the ATH-02 dial (NEW v1) | 0-0 | 1-25 | 26-50 | 51-80 | 81-110 | 111-150 | BOXER wk3-6 (tuck jumps, drop into box jumps) = 31; BASEBALL B1 off-season = 37; BASEBALL B2 pre-season = 58; BASEBALL B3 in-season = 74; MM ATH STARTING (depth jumps, repeat jumps, lunge jumps) = 94; MM ATH MID / ADVANCED = 0 (squirrel jumps only = low amplitude) |
| ALL lower-body jump contacts / week (landings + plyometric + ballistic jumps; v0 'high-amplitude') | 0-0 | 1-40 | 41-100 | 101-160 | 161-220 | 221-320 | conjugate STRENGTH-8 'EASY' 3x6 = 18; HYBRID-8 jumps 3x6 x2 (assumed) = 36; MM ATH ADVANCED = 32; MM ATH MID = 71; BYOP ATHLETIC / weekend-warrior template @2 sets (6 slots x 2 x 6-8) = 72-96; BASEBALL B1 off-season = 103; BOXER wk3-8 = 113-129; BASEBALL B3 in-season = 135; MM ATH STARTING = 146; BASEBALL B2 pre-season = 151; BASEBALL single training weeks (range) = 28-201 (8 weeks at 174-201 = T4) |
| low-amplitude contacts / week | 0-0 | 1-60 | 61-120 | 121-200 | 201-320 | 321-600 | BASEBALL B3 = 66; BASEBALL B2 = 89; BASEBALL B1 = 97; MM ATH ADVANCED = 100; MM ATH MID = 120; BOXER wk3-8 = 142-177 (+ jump rope 720-1440 est.) |
| medball throws / week | 0-0 | 1-60 | 61-150 | 151-250 | 251-420 | 421-600 | BYOP ATHLETIC @2 (4 slots x 2 x 8-12) = 64-96; BASEBALL B3/B1/B2 = 176/178/192; BASEBALL single training weeks (range) = 70-290; BOXER wk1-2 = 190; MM ATH STARTING (ASSUMED: 'ALL LIST' = 19-throw MEDBALL CHEAT SHEET) = 210; BOXER wk3-8 = 380; MM ATH MID = 400; MM ATH ADVANCED (ASSUMED: 2 x 'ALL LIST') = 420 |
| planned cuts / week | 0-0 | 1-30 | 31-70 | 71-120 | 121-180 | 181-260 | BYOP ATHLETIC @2 (4 slots x 2 x 6-8) = 48-64; every MASTER_MODEL program (athletic, boxing, baseball) = 0 |
| triple-extension / Olympic sets / week | 0-0 | 1-5 | 6-10 | 11-16 | 17-24 | 25-40 | MM ATH = 4-6; HYBRID-8 = 4-8; CF class = 6; BYOP ATHLETIC @2 = 8; BOXER wk3-8 = 9-12; BASEBALL optional OLY = 16; CF competitor power months = 20-24 |
| sprint metres / week at >90% | none | drills only (A March / A Skip / A Run, falling starts) | 1-150 | 151-300 | 301-600 | 601-1200 | MM UPPER/LOWER + PPL (A-drills 6-9 sets per lower day) = T1; BASEBALL ('30m acceleration sprint', 'accelerations baseball starts') = T2; Sheet24 half marathon hill sprints 6-10 reps x 8-20 s (8x8, 10x8, 8x10, 10x10, 6x10 + 2x20 s) / flat 40-80 m = T2 |

* v1: two jump scales. (1) PLYOMETRIC contacts / week (fast-SSC, high amplitude: hops, bounds, hurdle hops, depth/drop jumps, repeated jumps; landings, ballistic jumps and low-amplitude ankle work excluded) is the dial the coach's sport ranking applies to (COACH-ANSWER ATH-02 / ATH-01); its OBSERVED anchors come from the v1 ground-contact re-count: BOXER wk3-6 31, BASEBALL B1 / B2 / B3 37 / 58 / 74, MM ATH STARTING 94. (2) ALL lower-body JUMP contacts / week (landings + plyometric + ballistic jumps = the v0 'high-amplitude' measure, comparable with the NSCA per-session guide 80-100 / 100-120 / 120-140) is kept as a safety check. Boundaries are INFERRED; per-sport targets are PROPOSED and follow the confirmed ranking basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf.
* Throws: v1 tiers per sport follow COACH-ANSWER ATH-05: high (T3+) baseball, boxing, MMA, tennis, golf; moderate (T2) basketball, football; none for aesthetics.
* Plane need: 0 = none beyond sagittal; 1 = some (warm-up / variety); 2 = regular (1 slot per session); 3 = priority (every session + plyo/COD/core mix).
* Resistance rep zones: **VOL 1** '12-15 Reps' compound / '10-12 Reps' isolation (OBSERVED BASEBALL legend row 20); VOL 1 / 2 / 3 = early / mid / late off-season blocks for ALL athletes (COACH-ANSWER PER-11); **VOL 2** '8-12 Reps' compound / '15 REPS' isolation (row 21); **VOL 3** '6-8 Reps' compound / 'MAX REPS' isolation (row 22); **STRENGTH** 2-5 reps, 4-8 sets, '(1 RIR) RPE 8+', '*REST 3-6 MIN BETWEEN SETS' (OBSERVED 'ALL ABOUT SQUATS' strength menu D15:E26); the CROSSFIT 'STRENGTH' levels are higher-rep: FULL TIME 'LVL 1 = 3 SETS x 7' -> 'LVL 4 = 6 SETS x 4', HALF TIME 3x7 -> 3x4 -> 'LVL 5 = Work up to 1RM'; **POWER/SPEED** 1-5 reps fast: contrast / complexes, 'FAST RPE6 or about 60-70%' (4 TRACKS N17/N21), loaded jumps, OLY 3x3-6x3; **MYO** '15/5/5/5/5/5' = 40 reps (OBSERVED 'ALL ABOUT SQUATS' B27 '**MYO SET - ADVANCED' in the free-weight hypertrophy squat menu, explained in A30; also '2 sets LEG PRESS MYO' AESTHETICS-12 and 'MYO SET' leg extensions in the weekend-warrior tab G12). The free-weight MYO squat is an OBSERVED exception; the generator rule is the coach's confirmed one: MYO only on the last exercise, on machines or isolation (COACH-ANSWER VOL-15); **PYRAMID** '12/10/8 -20' = 12 reps mid weight, 10 heavier, 8 heaviest, then drop to a light 20 (COACH-ANSWER PRG-07); '10/10' = per side; **40-REP** 40-rep sets are NOT a default (coach is not a fan): only as an optional CrossFit / AMRAP style (COACH-ANSWER VOL-11); **UNILATERAL** unilateral lifts normally moderate-to-high reps; heavy low-rep unilateral work is an optional add-on when the athlete or coach wants it (COACH-ANSWER UNI-04); unilateral progresses like bilateral (UNI-05).
* Conditioning colours: **A** Blue A4C2F4 'Short Duration '/'High Intensity': '15/45', '20/40', '30/30', '40/20', '45/15' work:rest, 3-8 min between blocks; **B** Green B6D7A8 'Moderate Duration'/'Moderate Intensity': 1-3 min bouts at 1:1-1:3; **C** Orange F9CB9C 'Long Duration'/'Low intensity': '4+ Minutes', active or :30-3 min rest; **LC** 'LACTATE CLEARANCE' surge-and-float (level 4 only); **rule** 'Never do the same color workout in the same week ... one of each color ... total of 3 Aerobic capacity workouts per week' (AEROBIC CAPACITY CHEAT SHEET A5); level unlock C -> C,B -> C,B,A -> LACTATE CLERANCE (CROSSFIT D21:D24); **sessions_v1** 3 / week general and fat loss, 2 / week athletes in season, 4 / week aesthetics + long walks after workouts (COACH-ANSWER ATH-07).

**Ground-contact classes (NEW v1).** Rule = COACH-ANSWER ATH-01; class per sport = INFERRED; plyo share per class = PROPOSED - PENDING COACH APPROVAL (floor 20%, ceiling 80%). SCIENCE: fast stretch-shortening cycle = ground contact under about 250 ms, slow SSC = over about 250 ms (Schmidtbleicher's split, used by Flanagan & Comyns 2008 to prescribe plyometrics by contact time and reactive strength index [S32]); sprint contacts average about 0.14-0.16 s in acceleration and shorten toward maximal velocity, and faster accelerators show shorter contacts [S33].

| class | label | typical contact | sports (v1) | plyo : ballistic of power sets (PROPOSED) |
|---|---|---|---|---|
| 1 | very short | about 0.10-0.16 s per contact (sprinting: ~0.14-0.16 s in acceleration, shorter at top speed [S33]; bounding, repeated hops) | Track sprinter, Distance runner | 75 : 25 |
| 2 | short | about 0.15-0.25 s (fast stretch-shortening [S32]: approach / block jumps, first steps, sharp cuts) | Volleyball, American football - skill, Soccer | 60 : 40 |
| 3 | mixed | short jumps and cuts mixed with planted, longer pushes (over 0.25 s = slow SSC [S32]) | Basketball, American football - big skill, Tennis, Youth athlete, All-around athletic / weekend warrior | 50 : 50 |
| 4 | long | planted rotational or pushing actions, well over 0.25 s on the ground (stride-plant-rotate, skating push, stance blocks) | Baseball - position players, American football - linemen, Softball, Ice hockey, MMA | 40 : 60 |
| 5 | very long / grounded | feet stay on the ground for most of the action or contact is sustained (striking from stance, swinging, grappling) | Boxing, Golf, Kickboxing / Muay Thai, Karate / Taekwondo, Wrestling, BJJ / submission grappling | 25 : 75 |

**Plyo method stages:** plyo method stages (the coach has not named this yet - it is NOT a plyo zone, COACH-ANSWER CAT-11; 'zones' are Davidson rotation zones and do not apply to plyos, CAT-10). stage 1 'receive and pause' (stick-the-landing drills, depth drops with a 3 s stick, 'Push up Stick the Landing' (hands start on a box and land on the floor, LIB-02)) -> stage 2 'receive then create (one response)' (stick the landing then jump / hop, depth drop to jump, drop into box jump) -> stage 3 'repeated receive / create' (repeated hops, hurdle hops (taller hurdles + continuous quick contacts = advanced, LIB-04), pogos, bounds). Rules: the stage is a way of PERFORMING a jump ('more like the way I want the plyos to be done'), not a fixed property of the exercise: the same hurdle hop can be done stick-and-pause, single response or repeated - COACH-ANSWER CAT-11; programs START more ballistic and gradually become more plyometric (connective-tissue tolerance and structure) - COACH-ANSWER CAT-10; unilateral plyos are harder than bilateral ones; progress bilateral -> unilateral inside each stage - COACH-ANSWER CAT-10; PROPOSED timing (pending): 12-week plan = weeks 1-3 stage 1 + ballistic-biased mix (plyo share -15 points, floor 20), weeks 4-7 stage 2, weeks 8-12 stage 3 at the sport's target share; 8-week plan = weeks 1-2 / 3-5 / 6-8; 4-6-week maintenance blocks stay at the current stage; L2-L3 athletes may start at stage 2.

## 5. The sport / goal matrix (v1)

Baseline = **off-season build** week, mid-block (bilateral share = the mid-point of the block-start and block-end values). Apply season multipliers (section 7), the plan-type shape (section 8) and the person-based weekly rate of the volume engine. 'Evidence' says where the weekly SET BUDGET comes from; the v1 adjustments listed in each card (section 6) are COACH-ANSWER rules, with doses marked PROPOSED where the coach gave a direction only. Plane-need scores, emphasis %, colour mixes and ranges are analyst classifications unless a cell or answer is cited.

### 5.1 Dial overview

| profile | evidence | ground contact class | plyo:ballistic target (v1 budget plyo %) | plyometric tier (target contacts/wk) | all jump contacts tier (/wk) | low-amp contacts/wk | throws tier (/wk) | COD tier (cuts/wk) | sprint | Olympic / TE (sets/wk) | ATH-03 group | bilateral/unilateral % start -> end (in-season) | plane need F/T (0-3) | aerobic sessions/wk off / in season |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | OBSERVED + INFERRED/ASSUMED parts | 4 | 40:60 (44%) | T2 (35-60) | T3 (100-150) | 65-100 | T3 (170-200) | T1 (10-30) | T2 | T2 (ATH-10 standard; observed T1, T3 with the optional OLY piece) (6-16) | rotational power | 50/50 -> 40/60 (in-season 20/80) | 2/3 | 2 / 2 |
| Boxing | OBSERVED | 5 | 25:75 (30%) | T1 (15-30) | T3 (110-130) | 140-180 | T4 (190-380) | T0-T1 (0-30, reactive) | T1 | T2-T3 (9-12) | combat | 40/60 -> 30/70 (in-season 20/80) | 2/3 | 3 / 2 |
| CrossFit - competitor | OBSERVED + INFERRED/ASSUMED parts | - | - | n/a (-) | T1 (0-60) | 200-500 | T2 (wall balls / slams in WODs) (50-150) | T0 (0-0) | T1-T2 | T4 (power months) / T0 (strength months) (0-24) | size strength | 50/50 -> 70/30 (in-season 60/40) | 1/1 | see 5.8 / - |
| Hybrid athlete (strength - athletic - 'crossfitish') | OBSERVED + INFERRED/ASSUMED parts | - | - | n/a (-) | T1 (30-40) | 0-0 | T0 (0-0) | T0 (0-0) | conditioning A | T1-T2 (4-8) | health | observed | 1/1 | see 5.8 / - |
| Powerlifting / max strength | OBSERVED | - | - | n/a (-) | T1 (18-18) | 0-0 | T0 (0-0) | T0 (0-0) | T0 | T0 (0-0) | size strength | 50/50 -> 90/10 | 0/0 | 2 / - |
| Bodybuilding / aesthetics | OBSERVED + INFERRED/ASSUMED parts | - | - | n/a (-) | T0 (0-0) | 0-0 | T0 (0-0) | T0 (0-0) | T0-T1 | T0 (0-0) | size strength | 50/50 -> 80/20 | 0/0 | 4 / - |
| Fat loss / body toning | OBSERVED | - | - | n/a (-) | T0 (0-0) | 0-100 | T0 (0-0) | T0 (0-0) | T0 | T0 (0-0) | health | 50/50 -> 50/50 | 1/1 | 3 / - |
| Basketball | INFERRED (observed analog) | 3 | 50:50 (50%) | T5 (100-140) | T4 (170-230) | 80-120 | T2 (80-120) | T4 (120-160, reactive) | T3 | T2 (6-10) | speed power | 20/80 -> 10/90 (in-season 10/90) | 3/2 | 3 / 2 |
| Volleyball | INFERRED | 2 | 60:40 (60%) | T5 (100-140) | T4 (165-225) | 100-160 | T2 (60-100) | T2 (50-70, reactive) | T2 | T2 (6-10) | speed power | 40/60 -> 30/70 (in-season 20/80) | 2/2 | 3 / 2 |
| American football - skill (WR / DB / RB) | INFERRED (observed analog) | 2 | 60:40 (60%) | T4 (80-110) | T3 (120-160) | 100-140 | T2 (60-100) | T4 (120-160, reactive) | T4 | T2 (6-10) | speed power | 20/80 -> 10/90 (in-season 10/90) | 3/2 | 3 / 2 |
| American football - big skill (LB / TE / FB / S) | INFERRED | 3 | 50:50 (50%) | T3 (60-90) | T3 (105-145) | 60-100 | T2 (70-110) | T3 (80-100, reactive) | T4 | T2 (8-12) | speed power | 30/70 -> 20/80 (in-season 10/90) | 2/2 | 3 / 2 |
| American football - linemen (OL / DL) | INFERRED | 4 | 40:60 (39%) | T2 (20-40) | T2 (35-50) | 0-40 | T2 (80-120) | T2 (40-50, reactive) | T2 | T2 (8-12) | resistance | 50/50 -> 40/60 (in-season 30/70) | 2/1 | 3 / 2 |
| Soccer (outfield) | INFERRED | 2 | 60:40 (60%) | T4 (70-95) | T3 (120-160) | 100-140 | T1 (20-40) | T4 (120-160, reactive) | T4 | T1 (2-6) | speed power | 20/80 -> 10/90 (in-season 10/90) | 3/2 | 3.5 / 2 |
| Softball | INFERRED (observed analog) | 4 | 40:60 (38%) | T2 (35-60) | T2 (50-65) | 70-100 | T3 (160-200) | T1 (10-30) | T2 | T1 (2-6) | rotational power | 50/50 -> 40/60 (in-season 20/80) | 2/3 | 2 / 2 |
| Ice hockey (skaters) | INFERRED | 4 | 40:60 (40%) | T2 (25-45) | T2 (55-75) | 60-100 | T2 (70-100) | T1 (20-30, reactive) | T3 | T2 (6-10) | speed power | 20/80 -> 10/90 (in-season 10/90) | 3/3 | 3.5 / 2 |
| Tennis (and racket sports) | INFERRED | 3 | 50:50 (50%) | T3 (45-70) | T2 (60-80) | 160-200 | T3 (150-200) | T3 (100-120, reactive) | T2 | T1 (2-6) | rotational power | 20/80 -> 10/90 (in-season 10/90) | 3/3 | 3 / 2 |
| Golf | INFERRED | 5 | 25:75 (22%) | T1 (0-15) | T1 (10-15) | 30-50 | T3 (150-200) | T0 (0-0) | T0 | T1 (2-6) | rotational power | 30/70 -> 20/80 (in-season 20/80) | 2/3 | 3 / 2 |
| Track sprinter (100-200 m; jumpers as variant) | INFERRED | 1 | 75:25 (75%) | T4 (90-120) | T3 (110-150) | 160-220 | T1 (40-60) | T0 (0-0) | T5 | T2 (8-12) | speed power | 40/60 -> 30/70 (in-season 20/80) | 1/1 | 2 / 2 |
| Distance runner (5 km - marathon) | INFERRED (observed analog) | 1 | 75:25 (74%) | T1 (10-25) | T1 (35-45) | 150-200 | T0 (0-0) | T0 (0-0) | T2 | T1 (1-4) | health | 20/80 -> 20/80 (in-season 10/90) | 2/1 | see 5.8 / run plan |
| Kickboxing / Muay Thai | INFERRED (observed analog) | 5 | 25:75 (25%) | T2 (20-40) | T2 (40-55) | 80-120 | T3 (220-260) | T2 (35-50, reactive) | T1 | T2 (4-8) | combat | 30/70 -> 20/80 (in-season 20/80) | 3/3 | 3.5 / 2 |
| Karate / Taekwondo | INFERRED (observed analog) | 5 | 25:75 (25%) | T1 (15-30) | T2 (35-50) | 80-120 | T3 (180-220) | T2 (55-70, reactive) | T2 | T1 (2-6) | combat | 30/70 -> 20/80 (in-season 20/80) | 3/3 | 3.5 / 2 |
| MMA | INFERRED (observed analog) | 4 | 40:60 (40%) | T3 (55-80) | T3 (95-130) | 100-140 | T3 (150-200) | T2 (40-50, reactive) | T1-T2 | T2 (7-11) | combat | 40/60 -> 30/70 (in-season 20/80) | 2/3 | 4 / 2 |
| Wrestling | INFERRED | 5 | 25:75 (25%) | T2 (20-40) | T2 (45-60) | 40-60 | T3 (150-200) | T2 (40-50, reactive) | T1 | T2 (6-10) | resistance | 50/50 -> 40/60 (in-season 30/70) | 2/3 | 4 / 2 |
| BJJ / submission grappling | INFERRED | 5 | 25:75 (25%) | T2 (20-35) | T2 (70-90) | 0-40 | T2 (80-120) | T0 (0-0) | T0 | T1 (2-6) | combat | 50/50 -> 40/60 (in-season 30/70) | 2/2 | 3 / 2 |
| General population / longevity | INFERRED (observed analog) | - | - | T0 (0-0) | T0 (0-0) | 0-20 | T1 (20-40) | T0-T1 (0-20) | T1 | T0-T1 (0-3) | health | 50/50 -> 50/50 | 1/1 | 3 / - |
| Youth athlete (multi-sport, pre/circa/post-PHV) | INFERRED | 3 | 50:50 (50%) | T2 (30-60) | T2 (85-115) | 60-100 | T2 (50-80) | T2 (35-50, reactive) | T2 | T1 (2-6) | health | 50/50 -> 50/50 (in-season 40/60) | 2/2 | 2 / 2 |
| All-around athletic / weekend warrior (non-competitive adults and youth) | COACH-ANSWER + OBSERVED template | 3 | 50:50 (50%) | T3 (40-70) | T2 (72-96) | 20-60 | T2 (64-96) | T2 (48-64) | T0-T1 | T2 (6-10) | health | 50/50 -> 40/60 | 1/2 | 3 / - |

Aerobic column: in season 2 = COACH-ANSWER ATH-07; general / fat loss 3 and aesthetics 4 (+ walks) = ATH-07; every athlete OFF-season count and the powerlifting 2 are PROPOSED (ATH-07 does not cover them). Bilateral : unilateral values are COACH-ANSWER UNI-02 anchors (bodybuilding / powerlifting, tennis-type COD athletes) or PROPOSED on that scale (section 5.11).

### 5.2 Weekly set budget per category (v1 encodable recipe)

| profile | PLYO | JLK | BALL | THROW | COD | SPRINT | TE | BKD | BHD | UKD | UHD | HPUSH | VPUSH | HPULL | VPULL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 5.2 | 4.9 | 3.9 | 8.7 | 2 | 3 | 8 | 5.5 | 6 | 9 | 5 | 5.1 | 5.1 | 4.6 | 4 |
| Boxing | 8 | 12 | 9 | 38 | 0 | 3 | 9 | 2.5 | 7 | 14 | 3.5 | 3 | 3 | 3 | 3 |
| CrossFit - competitor | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 7 | 5 | 5 | 6 | 6 | 6 | 6 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 6 | 0 | 0 | 0 | 0 | 0 | 4.9 | 5.4 | 2.7 | 5.4 | 8.1 | 4.7 | 3.9 | 5.4 | 1.1 |
| Powerlifting / max strength | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 7 | 6 | 3 | 2.5 | 12.6 | 3.4 | 7.4 | 7.6 |
| Bodybuilding / aesthetics | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 8 | 8 | 4 | 4 | 6 | 10 | 6 | 6 |
| Fat loss / body toning | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 9 | 6.5 | 10.5 | 5 | 9.8 | 3.2 | 6.5 | 7.5 |
| Basketball | 17.5 | 5 | 12.5 | 10 | 18 | 4 | 8 | 2 | 2 | 12.5 | 9.5 | 4 | 2 | 6 | 4 |
| Volleyball | 19 | 6.5 | 9 | 8 | 9 | 2 | 8 | 4 | 4 | 8 | 8 | 3 | 3 | 6 | 4 |
| American football - skill (WR / DB / RB) | 14 | 6 | 5.5 | 8 | 18 | 9 | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 4 | 4 |
| American football - big skill (LB / TE / FB / S) | 11.5 | 4 | 6.5 | 9 | 12 | 6 | 10 | 3 | 3 | 11.5 | 8 | 6 | 3 | 6 | 4 |
| American football - linemen (OL / DL) | 5.5 | 1 | 0 | 10 | 6 | 4 | 10 | 7 | 7 | 10 | 6.5 | 10 | 4 | 10 | 4 |
| Soccer (outfield) | 12 | 6 | 9 | 3 | 18 | 9 | 4 | 2 | 2 | 10 | 10 | 2 | 2 | 3 | 2 |
| Softball | 7 | 4 | 0 | 18 | 2 | 3 | 4 | 6 | 6 | 8.5 | 6 | 4 | 3 | 5 | 4 |
| Ice hockey (skaters) | 5 | 4 | 5 | 8.5 | 4 | 3 | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 6 | 3 |
| Tennis (and racket sports) | 8.5 | 9 | 0 | 17.5 | 15 | 3 | 4 | 1.5 | 2 | 9.5 | 9.5 | 3 | 2 | 6 | 3 |
| Golf | 1.5 | 3.5 | 0 | 17.5 | 0 | 0 | 4 | 1.5 | 3 | 9 | 4.5 | 2 | 2 | 6 | 3 |
| Track sprinter (100-200 m; jumpers as variant) | 14.5 | 9.5 | 3 | 5 | 0 | 12 | 10 | 4 | 4 | 8 | 8 | 2 | 2 | 3 | 2 |
| Distance runner (5 km - marathon) | 2.5 | 9 | 4 | 0 | 0 | 2 | 2 | 1 | 2.5 | 9.5 | 5 | 2 | 0 | 3 | 0 |
| Kickboxing / Muay Thai | 4 | 5 | 3 | 24 | 6 | 3 | 6 | 2 | 4 | 11 | 7 | 2 | 3 | 6 | 3 |
| Karate / Taekwondo | 3 | 5 | 4 | 20 | 9 | 3 | 4 | 2 | 4 | 11 | 7 | 3 | 2 | 6 | 3 |
| MMA | 10 | 6 | 6.5 | 17.5 | 6 | 3 | 9 | 3.5 | 5 | 9.5 | 6 | 4 | 3 | 7 | 5 |
| Wrestling | 4.5 | 2.5 | 3.5 | 17.5 | 6 | 2 | 8 | 4.5 | 6 | 7 | 5.5 | 4 | 3 | 8 | 6 |
| BJJ / submission grappling | 5 | 1 | 8 | 10 | 0 | 0 | 4 | 3 | 4.5 | 5.5 | 4 | 3 | 2 | 6 | 6 |
| General population / longevity | 0 | 1 | 0 | 3 | 0 | 0 | 0 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 8.5 | 4 | 6.5 | 6 | 6 | 4 | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 10 | 2 | 4 | 8 | 8 | 0 | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 |

Compare profiles by **contacts / throws / cuts (5.4-5.5), not by set counts**: the OBSERVED boxer's PLYO sets are 5-rep jumps inside complexes and 8-rep landings, its 38 THROW sets are single-throw lines of 10; BASEBALL throw sets are mostly '10/10' per side (~20 throws per set). The OBSERVED profiles' PLYO / JLK / BALL split comes from the ground-contact re-count (2.6); INFERRED profiles use the nominal reps in section 0. The pre-v1 budgets are kept in the JSON as `weekly_sets_v0`.

| profile | ISO_QUAD | ISO_HAM | ISO_CHEST | ISO_SIDE | ISO_REAR | ISO_BICEP | ISO_TRICEP | ISO_CALF | ISO_NECK | ISO_GRIP | CORE | FOCUS | total | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 0 | 3 | 0 | 4.6 | 6 | 8.7 | 6.3 | 12 | 0 | 0 | 16 | 0 | 136.6 | OBSERVED + v1 adjustments |
| Boxing | 6 | 9 | 0 | 6 | 4 | 2 | 2 | 12 | 0 | 0 | 17 | 0 | 176 | OBSERVED + v1 adjustments |
| CrossFit - competitor | 3 | 3 | 0 | 3 | 4 | 1.5 | 1.5 | 6 | 0 | 0 | 8 | 0 | 78 | OBSERVED + v1 adjustments |
| Hybrid athlete (strength - athletic - 'crossfitish') | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 9 | 0 | 0 | 12.9 | 8.1 | 81.6 | OBSERVED + v1 adjustments |
| Powerlifting / max strength | 0 | 0 | 0 | 0 | 4 | 3 | 0 | 6 | 0 | 0 | 8 | 0 | 73.5 | OBSERVED + v1 adjustments |
| Bodybuilding / aesthetics | 4 | 4 | 0 | 4 | 4 | 4 | 4 | 12 | 0 | 0 | 8 | 12 | 108 | OBSERVED + v1 adjustments |
| Fat loss / body toning | 3 | 3 | 0 | 5 | 4 | 6.5 | 2.5 | 6 | 0 | 0 | 14.2 | 0 | 102.2 | OBSERVED + v1 adjustments |
| Basketball | 0 | 4 | 0 | 0 | 4 | 0 | 0 | 12 | 0 | 0 | 16 | 4 | 157 | INFERRED set budget + v1 adjustments |
| Volleyball | 4 | 3 | 0 | 0 | 6 | 0 | 0 | 12 | 0 | 0 | 16 | 4 | 146.5 | INFERRED set budget + v1 adjustments |
| American football - skill (WR / DB / RB) | 0 | 6 | 0 | 0 | 4 | 0 | 0 | 12 | 4 | 0 | 16 | 3 | 151.5 | INFERRED set budget + v1 adjustments |
| American football - big skill (LB / TE / FB / S) | 0 | 4 | 0 | 3 | 4 | 0 | 2 | 12 | 4 | 0 | 16 | 0 | 148.5 | INFERRED set budget + v1 adjustments |
| American football - linemen (OL / DL) | 0 | 3 | 0 | 4 | 4 | 0 | 4 | 12 | 4 | 0 | 16 | 4 | 146 | INFERRED set budget + v1 adjustments |
| Soccer (outfield) | 2 | 6 | 0 | 0 | 4 | 0 | 0 | 12 | 0 | 0 | 16 | 2 | 136 | INFERRED set budget + v1 adjustments |
| Softball | 0 | 3 | 0 | 3 | 6 | 8 | 5 | 12 | 0 | 0 | 16 | 0 | 133.5 | INFERRED set budget + v1 adjustments |
| Ice hockey (skaters) | 0 | 3 | 0 | 2 | 4 | 0 | 0 | 12 | 3 | 0 | 16 | 2 | 118.5 | INFERRED set budget + v1 adjustments |
| Tennis (and racket sports) | 0 | 3 | 0 | 0 | 6 | 0 | 0 | 12 | 0 | 4 | 16 | 2 | 136.5 | INFERRED set budget + v1 adjustments |
| Golf | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 9 | 0 | 2 | 12 | 0 | 84.5 | INFERRED set budget + v1 adjustments |
| Track sprinter (100-200 m; jumpers as variant) | 0 | 6 | 0 | 0 | 4 | 0 | 0 | 12 | 0 | 0 | 16 | 3 | 128 | INFERRED set budget + v1 adjustments |
| Distance runner (5 km - marathon) | 0 | 2 | 0 | 0 | 4 | 0 | 0 | 9 | 0 | 0 | 12 | 0 | 69.5 | INFERRED set budget + v1 adjustments |
| Kickboxing / Muay Thai | 0 | 4 | 0 | 0 | 4 | 0 | 0 | 12 | 4 | 0 | 16 | 0 | 129 | INFERRED set budget + v1 adjustments |
| Karate / Taekwondo | 0 | 4 | 0 | 0 | 4 | 0 | 0 | 12 | 0 | 0 | 16 | 3 | 125 | INFERRED set budget + v1 adjustments |
| MMA | 0 | 3 | 0 | 0 | 4 | 0 | 0 | 12 | 4 | 3 | 16 | 0 | 143 | INFERRED set budget + v1 adjustments |
| Wrestling | 0 | 0 | 0 | 0 | 4 | 2 | 0 | 12 | 6 | 4 | 16 | 0 | 132 | INFERRED set budget + v1 adjustments |
| BJJ / submission grappling | 0 | 2 | 0 | 0 | 4 | 2 | 0 | 9 | 4 | 4 | 12 | 0 | 99 | INFERRED set budget + v1 adjustments |
| General population / longevity | 0 | 0 | 0 | 2 | 4 | 2 | 2 | 9 | 0 | 0 | 6 | 0 | 52 | INFERRED set budget + v1 adjustments |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 9 | 0 | 0 | 12 | 0 | 78 | INFERRED set budget + v1 adjustments |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 4 | 4 | 0 | 4 | 4 | 0 | 0 | 12 | 0 | 0 | 16 | 8 | 124 | OBSERVED + v1 adjustments |

### 5.3 Computed weekly shares (from 5.2)

| profile | weekly sets | athletic % | athletic % excl. throws | PLYO/JLK/BALL/THROW/COD/SPRINT/TE % | power sets | plyo % of power | compound % | isolation % | core % | focus % | lower uni % | pull per push | knee/hip sets | sets per main day (upper bound) | est. min per main day (PROPOSED heuristic) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 136.6 | 26.1 | 21.1 | 3.8/3.6/2.9/6.4/1.5/2.2/5.9 | 22.7 | 44 | 32.4 | 29.7 | 11.7 | 0 | 54.9 | 0.8 | 14.5/14 | 34.1 | 69 |
| Boxing | 176 | 44.9 | 29.7 | 4.5/6.8/5.1/21.6/0/1.7/5.1 | 67 | 30 | 22.2 | 23.3 | 9.7 | 0 | 64.8 | 1 | 22.5/19.5 | 44 | 80 |
| CrossFit - competitor | 78 | 0 | 0 | 0/0/0/0/0/0/0 | 0 | - | 61.5 | 28.2 | 10.3 | 0 | 41.7 | 1 | 15/15 | 19.5 | 51 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 81.6 | 13.4 | 13.4 | 7.4/0/0/0/0/0/6 | 6 | - | 45 | 15.9 | 15.8 | 9.9 | 62.5 | 0.8 | 10.8/10.8 | 16.3 | 41 |
| Powerlifting / max strength | 73.5 | 4.1 | 4.1 | 4.1/0/0/0/0/0/0 | 3 | - | 67.3 | 17.7 | 10.9 | 0 | 29.7 | 0.9 | 10/8.5 | 18.4 | 49 |
| Bodybuilding / aesthetics | 108 | 0 | 0 | 0/0/0/0/0/0/0 | 0 | - | 48.1 | 33.3 | 7.4 | 11.1 | 33.3 | 0.8 | 16/16 | 27 | 63 |
| Fat loss / body toning | 102.2 | 0 | 0 | 0/0/0/0/0/0/0 | 0 | - | 56.8 | 29.4 | 13.9 | 0 | 50 | 1.1 | 22.5/14.5 | 25.6 | 62 |
| Basketball | 157 | 47.8 | 44.2 | 11.1/3.2/8/6.4/11.5/2.5/5.1 | 45 | 50 | 26.8 | 12.7 | 10.2 | 2.5 | 84.6 | 1.7 | 14.5/15.5 | 39.2 | 74 |
| Volleyball | 146.5 | 42 | 38.6 | 13/4.4/6.1/5.5/6.1/1.4/5.5 | 42.5 | 60 | 27.3 | 17.1 | 10.9 | 2.7 | 66.7 | 1.7 | 16/15 | 36.6 | 70 |
| American football - skill (WR / DB / RB) | 151.5 | 45.2 | 42.2 | 9.2/4/3.6/5.3/11.9/5.9/5.3 | 33.5 | 60 | 25.1 | 17.2 | 10.6 | 2 | 83.3 | 1.3 | 12/18 | 37.9 | 71 |
| American football - big skill (LB / TE / FB / S) | 148.5 | 39.7 | 35.8 | 7.7/2.7/4.4/6.1/8.1/4/6.7 | 31 | 50 | 30 | 19.5 | 10.8 | 0 | 76.5 | 1.1 | 14.5/15 | 37.1 | 72 |
| American football - linemen (OL / DL) | 146 | 25 | 19.5 | 3.8/0.7/0/6.8/4.1/2.7/6.8 | 16.5 | 39 | 40.1 | 21.2 | 11 | 2.7 | 54.1 | 1 | 17/16.5 | 36.5 | 76 |
| Soccer (outfield) | 136 | 44.9 | 43.6 | 8.8/4.4/6.6/2.2/13.2/6.6/2.9 | 30 | 60 | 24.3 | 17.6 | 11.8 | 1.5 | 83.3 | 1.2 | 14/18 | 34 | 64 |
| Softball | 133.5 | 28.5 | 17.3 | 5.2/3/0/13.5/1.5/2.2/3 | 29 | 38 | 31.8 | 27.7 | 12 | 0 | 54.7 | 1.3 | 14.5/15 | 33.4 | 67 |
| Ice hockey (skaters) | 118.5 | 31.6 | 26.4 | 4.2/3.4/4.2/7.2/3.4/2.5/6.8 | 22.5 | 40 | 32.9 | 20.3 | 13.5 | 1.7 | 83.3 | 1.5 | 12/15 | 29.6 | 61 |
| Tennis (and racket sports) | 136.5 | 41.8 | 33.2 | 6.2/6.6/0/12.8/11/2.2/2.9 | 35 | 50 | 26.7 | 18.3 | 11.7 | 1.5 | 84.4 | 1.8 | 11/14.5 | 34.1 | 66 |
| Golf | 84.5 | 31.4 | 13.4 | 1.8/4.1/0/20.7/0/0/4.7 | 22.5 | 22 | 36.7 | 17.8 | 14.2 | 0 | 75 | 2.2 | 10.5/7.5 | 28.2 | 59 |
| Track sprinter (100-200 m; jumpers as variant) | 128 | 42.2 | 39.8 | 11.3/7.4/2.3/3.9/0/9.4/7.8 | 32 | 75 | 25.8 | 17.2 | 12.5 | 2.3 | 66.7 | 1.2 | 12/18 | 32 | 62 |
| Distance runner (5 km - marathon) | 69.5 | 28.1 | 28.1 | 3.6/12.9/5.8/0/0/2.9/2.9 | 15.5 | 74 | 33.1 | 21.6 | 17.3 | 0 | 80.6 | 1.5 | 10.5/9.5 | 23.2 | 50 |
| Kickboxing / Muay Thai | 129 | 39.5 | 25.7 | 3.1/3.9/2.3/18.6/4.7/2.3/4.7 | 36 | 25 | 29.5 | 18.6 | 12.4 | 0 | 75 | 1.8 | 13/15 | 32.2 | 64 |
| Karate / Taekwondo | 125 | 38.4 | 26.7 | 2.4/4/3.2/16/7.2/2.4/3.2 | 32 | 25 | 30.4 | 16 | 12.8 | 2.4 | 75 | 1.8 | 13/15 | 31.2 | 62 |
| MMA | 143 | 40.6 | 32.3 | 7/4.2/4.5/12.2/4.2/2.1/6.3 | 40 | 40 | 30.1 | 18.2 | 11.2 | 0 | 64.6 | 1.7 | 13/14 | 35.8 | 70 |
| Wrestling | 132 | 33.3 | 23.1 | 3.4/1.9/2.7/13.3/4.5/1.5/6.1 | 28 | 25 | 33.3 | 21.2 | 12.1 | 0 | 54.3 | 2 | 11.5/11.5 | 33 | 67 |
| BJJ / submission grappling | 99 | 28.3 | 20.2 | 5.1/1/8.1/10.1/0/0/4 | 24 | 25 | 34.3 | 25.3 | 12.1 | 0 | 55.9 | 2.4 | 8.5/10.5 | 33 | 68 |
| General population / longevity | 52 | 7.7 | 2 | 0/1.9/0/5.8/0/0/0 | 4 | - | 44.2 | 36.5 | 11.5 | 0 | 50 | 1.2 | 6/6 | 17.3 | 43 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 78 | 50 | 45.8 | 10.9/5.1/8.3/7.7/7.7/5.1/5.1 | 25 | 50 | 20.5 | 14.1 | 15.4 | 0 | 50 | 1 | 4/4 | 26 | 50 |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 124 | 32.3 | 27.6 | 8.1/1.6/3.2/6.5/6.5/0/6.5 | 24 | 50 | 25.8 | 22.6 | 12.9 | 6.5 | 56.2 | 1 | 12/12 | 31 | 61 |

Session-time heuristic (PROPOSED): 10 min warm-up + ~1.25 min per athletic or core set, ~2.5 min per compound set, ~1.5 min per isolation / focus set, all sets on main days. Every profile lands under the coach's 1.5 h athlete / bodybuilder / powerlifter session (max 2 h); the general-population profile sits at about 43 min against the 45-60 min general cap, but the fat-loss profile lands at about 62 min (67 with unilateral time, 5.3b) - slightly OVER the 60 min cap for weight-loss clients (UNI-09), partly because its circuit stations (finishers, PRG-11) are counted; the generator trims accessory sets or supersets them (ORD-05) to fit.

### 5.3b Session load check: exercise count (VOL-08) and unilateral time (UNI-09) - NEW in the v1 verification

The time check above passes, but the coach also caps the NUMBER of exercises: resistance-only sessions about 5-7 (VOL-08 / VOL-16; +1 core exercise first = cap 8 here, ATH-11), field athletes in the off-season up to 10-12, 'max maybe 12' (VOL-08; VOL-17 lists about 2 core + 2-4 plyo / ballistic + 2-3 Olympic / power + 3-4 resistance). Heuristic (PROPOSED): 2 sets per athletic, core, isolation or focus exercise and 3 per compound (VOL-16 defaults), a medball 'Throwing' block = 1 exercise however many throws it lists (LIB-22), Focus slots on the optional days when the profile has them (ORD-10). Minutes add 50% time to unilateral lower sets (UNI-09: 'it has to be accounted for').

| profile | main + optional days | est. exercises per main day | cap | check | est. min per main day (5.3 -> with unilateral x1.5) |
|---|---|---|---|---|---|
| Baseball - position players | 4 + 0 | 15.1 | 12 | OVER | 69 -> 73 |
| Boxing | 4 + 0 | 16.6 | 12 | OVER | 80 -> 85 |
| CrossFit - competitor | 4 + 1 | 7.8 | 8 | ok | 51 -> 54 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 5 + 0 | 6.9 | 8 | ok | 41 -> 44 |
| Powerlifting / max strength | 4 + 0 | 7.1 | 8 | ok | 49 -> 51 |
| Bodybuilding / aesthetics | 4 + 2 | 9.8 | 8 | OVER | 63 -> 66 |
| Fat loss / body toning | 4 + 2 | 10.4 (incl. circuit stations, which are finishers - PRG-11) | 8 | OVER | 62 -> 67 (cap 60) |
| Basketball | 4 + 2 | 17.1 | 12 | OVER | 74 -> 81 |
| Volleyball | 4 + 2 | 16.1 | 12 | OVER | 70 -> 75 |
| American football - skill (WR / DB / RB) | 4 + 2 | 17.0 | 12 | OVER | 71 -> 77 |
| American football - big skill (LB / TE / FB / S) | 4 + 2 | 16.6 | 12 | OVER | 72 -> 78 |
| American football - linemen (OL / DL) | 4 + 2 | 15.1 | 12 | OVER | 76 -> 81 |
| Soccer (outfield) | 4 + 2 | 16.0 | 12 | OVER | 64 -> 71 |
| Softball | 4 + 0 | 13.7 | 12 | OVER | 67 -> 72 |
| Ice hockey (skaters) | 4 + 2 | 12.9 | 12 | OVER | 61 -> 67 |
| Tennis (and racket sports) | 4 + 2 | 14.1 | 12 | OVER | 66 -> 72 |
| Golf | 3 + 2 | 10.4 | 12 | ok | 59 -> 65 |
| Track sprinter (100-200 m; jumpers as variant) | 4 + 2 | 14.6 | 12 | OVER | 62 -> 67 |
| Distance runner (5 km - marathon) | 3 + 0 | 10.3 | 12 | ok | 50 -> 56 |
| Kickboxing / Muay Thai | 4 + 0 | 12.5 | 12 | ok | 64 -> 69 |
| Karate / Taekwondo | 4 + 0 | 12.5 | 12 | ok | 62 -> 68 |
| MMA | 4 + 0 | 14.9 | 12 | OVER | 70 -> 75 |
| Wrestling | 4 + 0 | 13.5 | 12 | OVER | 67 -> 71 |
| BJJ / submission grappling | 3 + 0 | 13.9 | 12 | OVER | 68 -> 71 |
| General population / longevity | 3 + 2 | 7.9 | 8 | ok | 43 -> 45 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 3 + 0 | 12.1 | 12 | ok | 50 -> 52 |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 4 + 2 | 13.2 | 12 | OVER | 61 -> 64 |

Reading: the v1 additions the coach asked for (core first with about 2 exercises, calves 3 sets every leg day, rear delts' own sets, Olympic lifts for every athlete) fit the time cap but push most athlete days past 12 exercises when every category gets its own exercises at 2 sets. The weekly SET budgets stay; the generator must assemble them into fewer exercises. Assembly rule when a day is over the cap (PROPOSED - PENDING COACH APPROVAL): (1) consolidate - 3 sets on fewer plyo / ballistic / Olympic exercises instead of 2 sets on more (same weekly dose); (2) run COD and SPRINT as their own speed block in the fixed order squirrel jumps -> MACH / acceleration starts -> max velocity (LIB-21), on a separate day or as the extension of the warm-up; (3) superset calves, rear delts and arm isolation with the main lifts (ORD-05: supersets compress time and fatigue); (4) move Focus and extra isolation to the optional days (ORD-10, ideally separate days); never drop core-first or the athletic prefix of an athlete profile. Question 11.2 #11 asks the coach.

### 5.4 Plyometrics by profile

| profile | ATH-02 rank | plyometric target (fast-reactive) | all jump contacts | low-amplitude | vertical/horizontal/lateral % | unilateral % | landing % | force phases / method stages | library tracks | check |
|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 7 | T2: 35-60 | T3 (OBSERVED block means 103 / 151 / 135): 100-150 | 65-100 | 75/16/9 | 39 | 6 | all four; landings 'Stick the landing' early in blocks; contrast jumps after heavy lifts pre-season | PLYOS, JUMPING LIMITED KNEE (ankle hops: 43% of 'calfs' slots), FULL JUMPING (pre-season) | observed: 37 (B1) / 58 (B2) / 74 (B3) fast-reactive + 17 / 13 / 20 landings; ballistic jumps 51 / 87 / 49 |
| Boxing | 10 | T1: 15-30 | T3 (OBSERVED 113-129 = landings 24 + ballistic jumps 66 + fast-reactive 31): 110-130 | 140-180 | 85/15/0 | 62 | 8 | landings (weighted depth drops x8, stage 1) -> single-leg march jumps / DB squat jumps / broad jumps (ballistic) -> reactive squirrel jumps, 4 hops, tuck jumps, rope (plyometric); the observed 'REVERSE BANDED' squirrel jumps are written unbanded by the generator (no bands, EQ-01) | PLYOS (landings), FULL JUMPING (squirrel jumps = 'FASTEST SSC'), jump rope | observed: 31 fast-reactive (tuck jumps, drop into box jumps) + 24 landings + 66 ballistic-jump reps; 1,227 low-amplitude incl. rope |
| CrossFit - competitor | - | n/a: - | T1 (in WODs): 0-60 | 200-500 | 90/10/0 | 10 | 0 | - | double-unders (low amplitude), box jumps inside WODs | observed: no plyo slot; skill 'T2B/ DUBS' TUESD and 'H.S./ DUBS' FRID in JUN/JUL/NOV/MAR/APR; 4 skill days in DEC/JAN; none in AUG/SEPT/OCT/FEB/MAY; 'DUBS' on MON only in the CLASS split |
| Hybrid athlete (strength - athletic - 'crossfitish') | - | n/a: - | T1: 30-40 | 0-0 | 85/15/0 | 0 | 29 | landing -> loaded landing -> reactive -> concentric -> repeated SSC (8-week ladder; landings = wk1-2 = 2 of 7 loading weeks) | PLYOS, FULL JUMPING | observed: Tue/Fri 'JUMPS' (no sets/reps on the rows; 3x6 ASSUMED - if the tab's global SETS 2,2,2,3,3,3,4,4 / REPS 6,8,10,6,8,10,6,8 rows 71-72 apply, it is 24-60 contacts/week, mean ~41 over wk1-7): 'Depth drops' -> 'Weighted depth drops' -> 'depth drop to jump' -> 'weighted depth drops to jump' -> 'box jumps' -> 'repeat hurdle hops' |
| Powerlifting / max strength | - | n/a: - | T1: 18-18 | 0-0 | 100/0/0 | 0 | 30 | landing -> reactive (as a potentiator for the dynamic-effort lift) | PLYOS | observed: Thu 'the work' 3 x 6 'EASY': 'WEIGHTED DEPTH DROP', 'DEPTH DROP & JUMP', 'HIGH SQUAT JUMPS', 'REPEAT HIGH JUMPS' |
| Bodybuilding / aesthetics | - | n/a: - | T0: 0-0 | 0-0 | - | 0 | 0 | - | - | observed: no athletic slot; MM UPPER/LOWER and PPL carry A-drills only |
| Fat loss / body toning | - | n/a: - | T0: 0-0 | 0-100 | - | 0 | 0 | - | - | observed: only 'Jumping Jacks' and 'Burpees' inside circuits |
| Basketball | 1 | T5: 100-140 | T4: 170-230 | 80-120 | 55/20/25 | 45 | 15 | all four; REBOUNDING (repeat hops/jumps, hurdle hops) is the signature phase | PLYOS, FULL JUMPING, JUMPING LIMITED KNEE (ankle stiffness) | sets x nominal = 119 plyometric / 202 all jumps / 100 low (T5/T4/T2) |
| Volleyball | 1 | T5: 100-140 | T4: 165-225 | 100-160 | 75/10/15 | 30 | 20 | landing first every block (high landing load on the jumping knee); approach jumps = DELIVER; block jumps = REBOUNDING | PLYOS, FULL JUMPING, JUMPING LIMITED KNEE | sets x nominal = 122 plyometric / 197 all jumps / 130 low (T5/T4/T3) |
| American football - skill (WR / DB / RB) | 3 | T4: 80-110 | T3: 120-160 | 100-140 | 35/40/25 | 60 | 15 | all four; horizontal bounds and single-leg lateral hops | PLYOS, FULL JUMPING ('Bounding'), JUMPING LIMITED KNEE | sets x nominal = 95 plyometric / 140 all jumps / 120 low (T4/T3/T2) |
| American football - big skill (LB / TE / FB / S) | - | T3: 60-90 | T3: 105-145 | 60-100 | 40/40/20 | 45 | 20 | all four | PLYOS, FULL JUMPING | sets x nominal = 74 plyometric / 124 all jumps / 80 low (T3/T3/T2) |
| American football - linemen (OL / DL) | - | T2: 20-40 | T2: 35-50 | 0-40 | 40/50/10 | 25 | 30 | landing + DELIVER (onto box, short broad jumps); little REBOUNDING (body mass) | PLYOS (FOUNDATIONAL / MODERATE) | sets x nominal = 31 plyometric / 44 all jumps / 20 low (T2/T2/T1) |
| Soccer (outfield) | 4 | T4: 70-95 | T3: 120-160 | 100-140 | 30/40/30 | 60 | 15 | all four, unilateral emphasis | PLYOS, FULL JUMPING ('Bounding'), JUMPING LIMITED KNEE | sets x nominal = 82 plyometric / 141 all jumps / 120 low (T4/T3/T2) |
| Softball | - | T2: 35-60 | T2: 50-65 | 70-100 | 65/20/15 | 40 | 15 | landing block length set by landing competency / ACL history (ATH-09: no sex-based rules) | PLYOS, JUMPING LIMITED KNEE | sets x nominal = 48 plyometric / 56 all jumps / 80 low (T2/T2/T2) |
| Ice hockey (skaters) | 8 | T2: 25-45 | T2: 55-75 | 60-100 | 25/30/45 | 65 | 15 | lateral bounds (skater jumps), single-leg lateral stick -> rebound | PLYOS (lateral hurdle hops G93/G94), JUMPING LIMITED KNEE (lateral plate hops G50-G52) | sets x nominal = 34 plyometric / 65 all jumps / 80 low (T2/T2/T2) |
| Tennis (and racket sports) | 6 | T3: 45-70 | T2: 60-80 | 160-200 | 30/25/45 | 55 | 15 | split-step pogo (low amplitude) + lateral rebound | JUMPING LIMITED KNEE, PLYOS lateral | sets x nominal = 58 plyometric / 68 all jumps / 180 low (T3/T2/T3) |
| Golf | 11 | T1: 0-15 | T1: 10-15 | 30-50 | 80/10/10 | 30 | 30 | landing + DELIVER (CMJ / box jumps) for lower-body RFD | PLYOS FOUNDATIONAL | sets x nominal = 8 plyometric / 12 all jumps / 70 low (T1/T1/T2) |
| Track sprinter (100-200 m; jumpers as variant) | 2 | T4: 90-120 | T3: 110-150 | 160-220 | 40/55/5 | 60 | 10 | REBOUNDING + bounding; depth jumps for stiffness | FULL JUMPING ('Bounding', 'Hurdle Hops', 'Depth Jumps'), JUMPING LIMITED KNEE (ankle stiffness) | sets x nominal = 104 plyometric / 131 all jumps / 190 low (T4/T3/T3) |
| Distance runner (5 km - marathon) | - | T1: 10-25 | T1: 35-45 | 150-200 | 50/45/5 | 55 | 10 | low-amplitude REBOUNDING (pogos), skips, bounds | JUMPING LIMITED KNEE / JUMPING ANKLE | sets x nominal = 18 plyometric / 40 all jumps / 180 low (T1/T1/T3) |
| Kickboxing / Muay Thai | - | T2: 20-40 | T2: 40-55 | 80-120 | 55/20/25 | 65 | 10 | single-leg reactive (switch-kick hops, skips) + landings | JUMPING LIMITED KNEE, PLYOS, jump rope | sets x nominal = 29 plyometric / 47 all jumps / 100 low (T2/T2/T2) |
| Karate / Taekwondo | 10 | T1: 15-30 | T2: 35-50 | 80-120 | 45/30/25 | 65 | 10 | low-amplitude bounce (stance rhythm) + explosive single-leg entries | JUMPING LIMITED KNEE, PLYOS FOUNDATIONAL/MODERATE | sets x nominal = 22 plyometric / 44 all jumps / 100 low (T1/T2/T2) |
| MMA | 5 | T3: 55-80 | T3: 95-130 | 100-140 | 45/35/20 | 50 | 15 | level changes / shots (horizontal), sprawls (landing), reactive hops | PLYOS, FULL JUMPING, JUMPING LIMITED KNEE | sets x nominal = 68 plyometric / 112 all jumps / 120 low (T3/T3/T2) |
| Wrestling | 9 | T2: 20-40 | T2: 45-60 | 40-60 | 40/50/10 | 40 | 20 | penetration steps, level changes (horizontal DELIVER), sprawl landings | PLYOS | sets x nominal = 29 plyometric / 54 all jumps / 50 low (T2/T2/T1) |
| BJJ / submission grappling | 9 | T2: 20-35 | T2: 70-90 | 0-40 | 50/50/0 | 30 | 30 | landing + DELIVER | PLYOS FOUNDATIONAL | sets x nominal = 28 plyometric / 80 all jumps / 20 low (T2/T2/T1) |
| General population / longevity | - | T0: 0-0 | T0: 0-0 | 0-20 | 60/20/20 | 30 | 50 | low-amplitude only after landing control | JUMPING ANKLE (bilateral) | sets x nominal = 0 plyometric / 0 all jumps / 20 low (T0/T0/T1) |
| Youth athlete (multi-sport, pre/circa/post-PHV) | - | T2: 30-60 | T2: 85-115 | 60-100 | 40/30/30 | 40 | 35 | TAKING IN FORCES dominant; wide variety of jumps and landings at moderate volume | PLYOS FOUNDATIONAL, JUMPING ANKLE | sets x nominal = 44 plyometric / 100 all jumps / 80 low (T2/T2/T2) |
| All-around athletic / weekend warrior (non-competitive adults and youth) | - | T3: 40-70 | T2 (template @2 sets, estimate): 72-96 | 20-60 | 100/0/0 | 33 | 30 | landings (stage 1, 'receive and pause') even for an athlete who power cleans (level per slot); mix = the 3 observed picks (2 depth drops + ankle hops); a wider mix is INFERRED | PLYOS, JUMPING ANKLE | observed: 6 plyo slots x 2 sets x '6 to 8 Reps' (estimate); weekend-warrior tab Mon = 'Medium Depth Drop' + 'Ankle Hops ', Tue = 'SL Depth Drops' |

### 5.5 Throwing, change of direction, sprint, Olympic lifts

| profile | throws / wk (ATH-05 tier) | throw plane % | COD (ATH-06: route names for every athlete) | sprint | Olympic / triple extension (ATH-10) |
|---|---|---|---|---|---|
| Baseball - position players | T3 170-200 | tra 57 sag 43 | T1 10-30; max 'MOD. TURN'; reactive no | T2 60-150 m; 0-30 m accelerations, 'accelerations baseball starts' (OBSERVED), base-running curve (INFERRED) | T2 (ATH-10 standard; observed T1, T3 with the optional OLY piece) 6-16 sets (v1 budget 8); L1: DB snatch from the floor, KB / DB high pulls (OBSERVED); L2+: hang clean / hang snatch @75 -> 80 -> 85 -> 90% (OBSERVED 'OPTIONAL PIECE', now standard off- and pre-season - COACH-ANSWER ATH-10 / PER-09); none observed in season |
| Boxing | T4 190-380 | tra 53 sag 47 | T0-T1 0-30; max 'EASY TURN'; reactive yes | T1 0-60 m; high-knee runs inside complexes; sprinting is used as conditioning ('Sprint 20/ Recover 40') | T2-T3 9-12 sets (v1 budget 9); 'Clean Pull/ hang Power Clean', 'DB snatches', 'Hang Power Clean & Press' |
| CrossFit - competitor | T2 (wall balls / slams in WODs) 50-150 | sag 90 tra 10 | T0 0-0; max '-'; reactive no | T1-T2 0-150 m; sprint WODs only | T4 (power months) / T0 (strength months) 0-24 sets (v1 budget 0); 'Squat Snatch' / 'Squat Clean & Jerk' (LIB-07 naming); POWER L1 3x3 -> L4 6x3 |
| Hybrid athlete (strength - athletic - 'crossfitish') | T0 0-0 | - | T0 0-0; max '-'; reactive no | conditioning A 0-0 m; Tue 'SPEED' 10-15 x 15-20 s sprint / 30-40 s walk, then 5-10 x 30 s / 2 min | T1-T2 4-8 sets (v1 budget 4.9); clean Mon / snatch Thu rotating pull -> power -> squat variants, 'heavy' in every week except wk1 ('2x 2 clean pulls, 2 power cleans') |
| Powerlifting / max strength | T0 0-0 | - | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T0 0-0 sets (v1 budget 0); - |
| Bodybuilding / aesthetics | T0 0-0 | - | T0 0-0; max '-'; reactive no | T0-T1 0-0 m; A March / A Skip / A Run primer on lower days (MM UPPER/LOWER, PPL) | T0 0-0 sets (v1 budget 0); - |
| Fat loss / body toning | T0 0-0 | - | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T0 0-0 sets (v1 budget 0); - |
| Basketball | T2 80-120 | sag 60 tra 40 | T4 120-160; max 'HARD TURN'; reactive yes | T3 180-300 m; 5-20 m accelerations + short flying 10 m (court = 28 m) | T2 6-10 sets (v1 budget 8); hang power variants; trap-bar / DB jumps for tall athletes |
| Volleyball | T2 60-100 | sag 50 tra 50 | T2 50-70; max 'MOD. TURN'; reactive yes | T2 60-120 m; 3-10 m first steps | T2 6-10 sets (v1 budget 8); hang power clean / snatch pulls |
| American football - skill (WR / DB / RB) | T2 60-100 | sag 50 tra 50 | T4 120-160; max 'HARD TURN'; reactive yes | T4 400-600 m; acceleration 0-20 yd + max velocity 20-40 yd flying | T2 6-10 sets (v1 budget 8); power clean / hang snatch |
| American football - big skill (LB / TE / FB / S) | T2 70-110 | sag 60 tra 40 | T3 80-100; max 'HARD TURN'; reactive yes | T4 300-400 m; 0-20 yd accelerations | T2 8-12 sets (v1 budget 10); power clean, clean pulls |
| American football - linemen (OL / DL) | T2 80-120 | sag 70 tra 30 | T2 40-50; max 'MOD. TURN'; reactive yes | T2 100-160 m; 0-10 yd starts from stance | T2 8-12 sets (v1 budget 10); power clean, high pull |
| Soccer (outfield) | T1 20-40 | tra 60 sag 40 | T4 120-160; max 'HARD TURN'; reactive yes | T4 400-600 m; max velocity 1x/week minimum (hamstring protection) + accelerations | T1 2-6 sets (v1 budget 4); jump shrugs / hang pulls |
| Softball | T3 160-200 | tra 60 sag 40 | T1 10-30; max 'MOD. TURN'; reactive no | T2 60-150 m; home-to-first, 0-20 m | T1 2-6 sets (v1 budget 4); hang pulls |
| Ice hockey (skaters) | T2 70-100 | tra 70 sag 30 | T1 20-30; max 'MOD. TURN'; reactive yes | T3 150-200 m; on-land accelerations or bike sprints | T2 6-10 sets (v1 budget 8); power clean / hang snatch |
| Tennis (and racket sports) | T3 150-200 | tra 70 sag 30 | T3 100-120; max 'HARD TURN'; reactive yes | T2 80-150 m; 3-10 m starts | T1 2-6 sets (v1 budget 4); jump shrug / hang pull |
| Golf | T3 150-200 | tra 80 sag 20 | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T1 2-6 sets (v1 budget 4); L1 Olympic variants: jump shrug / hex-bar jump / DB snatch (ATH-10: everyone in athletic training) |
| Track sprinter (100-200 m; jumpers as variant) | T1 40-60 | sag 85 tra 15 | T0 0-0; max '-'; reactive no | T5 600-1000 m; acceleration, max velocity, speed endurance by event (track sessions) | T2 8-12 sets (v1 budget 10); power clean / power snatch from hang |
| Distance runner (5 km - marathon) | T0 0-0 | - | T0 0-0; max '-'; reactive no | T2 80-150 m; hill sprints 6-10 reps x 8-20 s (8x8, 10x8, 8x10, 10x10, 6x10 + 2x20 s), flat sprints 4x40 m + 2x60 m / 4x60 + 2x80 m / 6x80 m (OBSERVED Sheet24) | T1 1-4 sets (v1 budget 2); - |
| Kickboxing / Muay Thai | T3 220-260 | tra 60 sag 40 | T2 35-50; max 'MOD. TURN'; reactive yes | T1 0-60 m; conditioning only | T2 4-8 sets (v1 budget 6); hang power clean, DB snatch |
| Karate / Taekwondo | T3 180-220 | tra 60 sag 40 | T2 55-70; max 'MOD. TURN'; reactive yes | T2 60-120 m; short explosive entries 3-5 m | T1 2-6 sets (v1 budget 4); jump shrug / DB snatch |
| MMA | T3 150-200 | tra 55 sag 45 | T2 40-50; max 'MOD. TURN'; reactive yes | T1-T2 0-100 m; conditioning sprints | T2 7-11 sets (v1 budget 9); power clean, clean pull |
| Wrestling | T3 150-200 | tra 55 sag 45 | T2 40-50; max 'MOD. TURN'; reactive yes | T1 0-60 m; - | T2 6-10 sets (v1 budget 8); power clean, high pull |
| BJJ / submission grappling | T2 80-120 | tra 50 sag 50 | T0 0-0; max '-'; reactive no | T0 0-0 m; - | T1 2-6 sets (v1 budget 4); hang pulls / KB swings |
| General population / longevity | T1 20-40 | sag 50 tra 50 | T0-T1 0-20; max 'EASY TURN'; reactive no | T1 0-0 m; A March / A Skip as movement literacy | T0-T1 0-3 sets (v1 budget 0); 'BodyWeight Squat to calf raise', 'Hex bar squat to calf raise' |
| Youth athlete (multi-sport, pre/circa/post-PHV) | T2 50-80 | sag 50 tra 50 | T2 35-50; max 'MOD. TURN'; reactive yes | T2 100-150 m; short sprints and games | T1 2-6 sets (v1 budget 4); L1 Olympic variants (DB / KB snatch, hang pulls) and SOME lifts from the floor according to the program (COACH-ANSWER ATH-09 reverses the v0 'no Olympic lifts from the floor') |
| All-around athletic / weekend warrior (non-competitive adults and youth) | T2 64-96 | sag 50 tra 50 | T2 48-64; max 'per slot level'; reactive no | T0-T1 0-0 m; no sprint slot ('Max velocity running (top speed)' only inside PLYOS ADVANCED) | T2 6-10 sets (v1 budget 8); 'Power Clean' 2 x '6 to 8 Reps' (weekend-warrior tab); L1 clients get DB / KB snatches and hang pulls (ATH-10) |

Medball rules (COACH-ANSWER): by_sport: high for baseball, boxing, MMA, tennis and golf (rotational); moderate for basketball and football; NONE in the main workout for aesthetics / bodybuilders (warm-up only) - COACH-ANSWER ATH-05; weights: passes / rotations 8-10 lb (speed), slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients; never more than 20 lb (a heavier ball only for something specific like a heavy med-ball hang clean or wall balls) - COACH-ANSWER EQ-06; no_ball: no medball -> plyo push-ups (pressing), fast cable rotations or the 'fake medball slam'; never band chops (COACH-ANSWER EQ-07); list: a 'Throwing' slot can be the whole 'ALL LIST' = one pass of the ~19 throws at 1 x 10 each (~200 throws) - COACH-ANSWER LIB-22. Olympic lifts by level (COACH-ANSWER): rule: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); L1: DB / KB snatches, hex-bar jumps, hang pulls, hang cleans (no bumper plates needed) - ATH-10; L2: power and hang variants with the barbell, push press (easier than the jerk, LIB-13); full lifts and the push jerk (intermediate / advanced, LIB-13) introduced; L3: full lifts: 'Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' (LIB-07), push jerk (LIB-13), %-template OLY 75 -> 80 -> 85 -> 90% at 4x8 -> 4x6 -> 4x6 -> 4x4 (PER-09); youth: foundational lists, but SOME Olympic lifts from the floor according to the program (COACH-ANSWER ATH-09 reverses the v0 'no Olympic lifts from the floor' rule); never: older / injured / high-volume clients never get the snatch, overhead squat, low-bar squat or depth jumps (COACH-ANSWER EQ-03); INFERRED: when such a client is in athletic training (ATH-10), the Olympic slot uses hang pulls, high pulls, hex-bar jumps or KB swings - no snatch variants, including DB / KB snatches (question 11.2 #15). level_note: the exercise names in the Olympic column of the table above are the L2+ defaults; an L1 athlete of any sport gets the L1 list (COACH-ANSWER ATH-10). contrast / French contrast and complexes: L2+ athletes, OFF-SEASON only, heavy lift at about 78-85%, no rest inside the complex (COACH-ANSWER ATH-12).

### 5.6 Resistance emphasis and computed weekly sets per muscle

Per-muscle sets are COMPUTED from 5.2 with the v1 credit map: 1.0 to the main mover, **0.25 to helpers** (COACH-ANSWER VOL-09, was 0.5), unilateral knee-dominant = quads 1.0 + glutes 0.25 (UNI-01), athletic sets credit nothing (VOL-10). Exercise-level overrides on top of the category map: dips = 0.5 triceps + 0.5 chest (COACH-ANSWER LIB-16, push day); thrusters = 1.0 quads + 0.5 shoulders (LIB-14); a 10/10 per-side set and an alternating set = 1 set (UNI-01 / UNI-07 / PRG-07). Hip-dominant patterns (BHD / UHD) credit hamstrings 1.0 AND glutes 1.0 because both are prime hip extensors - INFERRED, the coach has not ruled on it (by analogy with UNI-01 he may prefer one primary muscle; question 11.2 #13). Targets per muscle come from the volume engine: beginner 10-12, intermediate 15-20, advanced 20+ sets/week, 15-20 = maintenance to some growth, 20-25 = growth, priority +4-6 (cap about 25-30), pain -30-50% / machines / drop the exercise (COACH-ANSWER VOL-01 / VOL-02 / VOL-03; the engine later learns from user data). The 'target' column below is the v0 analyst band per profile (INFERRED) - DESCRIPTIVE of the budget only, NOT a generator target (retired as a target in v1); for athletes the coach notes field athletes 'don't need to get bigger and stronger that much' (UNI-02).

| profile | H/S/P % | rep zone | target sets/muscle/wk (v0 band) | quads | glutes | hams | chest | lats/UB | front d. | side d. | rear d. | biceps | triceps | calves | abs | neck | grip |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 45/35/20 | VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10) | big 8-16, small 5-13 | 14.5 | 14.6 | 14 | 6.4 | 10.1 | 6.4 | 5.9 | 7.2 | 10.9 | 8.9 | 12 | 16 | 0 | 0 |
| Boxing | 25/35/40 | base 3 x 10; conversion 3-8 reps heavy + complexes ('3-5-5-5', '4-5-5-5/5') | big 3-25, small 1-6 | 22.5 | 14.6 | 19.5 | 3.8 | 7 | 3.8 | 6.8 | 4.8 | 3.5 | 3.5 | 12 | 17 | 0 | 0 |
| CrossFit - competitor | 20/45/35 | STRENGTH L1 3x7 -> L4 6x4 (FULL TIME); RESISTANCE 2x10 / 3x10 only | big 4-21, small 1-12 | 15 | 15 | 15 | 7.5 | 13 | 7.5 | 4.5 | 5.5 | 4.5 | 4.5 | 6 | 8 | 0 | 0 |
| Hybrid athlete (strength - athletic - 'crossfitish') | 30/50/20 | 3-week waves REPS 6,8,10 at SETS 2,2,2,3,3,3,4,4 | big 5-28, small 2-12 | 10.8 | 13.5 | 10.8 | 5.7 | 7.5 | 5.1 | 1 | 5.4 | 1.6 | 2.2 | 9 | 12.9 | 0 | 0 |
| Powerlifting / max strength | 20/60/20 | M.E. 5,4,3,2,1,3,2,1 @ '1RIR'; D.E. 3,3,2,1,3,2,1,1 'FAST'; accessory 3x6 '2RIR'; nuance 'MAX'; survival 'ALL' | big 3-18, small 0-16 | 10 | 11 | 8.5 | 13.5 | 16 | 6.6 | 0.9 | 5.9 | 6.8 | 4 | 6 | 8 | 0 | 0 |
| Bodybuilding / aesthetics | 80/15/5 | compounds 8-15 (mean ~12), single-joint 20, calves 15, MYO last on machines / isolation (VOL-15); '1-2 RIR' (RIR primary, VOL-13); preference moves the compound rep range only (VOL-12) | big 9-21, small 3-16 | 16 | 15 | 16 | 8.5 | 13 | 11.5 | 6.5 | 5.5 | 7 | 8 | 12 | 8 | 0 | 0 |
| Fat loss / body toning | 85/10/5 | compounds 15/12 -> 8-10; isolation 15 -> 20 (the observed 40-rep sets are retired as a default - optional AMRAP style only, COACH-ANSWER VOL-11) | big 7-20, small 3-15 | 22.5 | 16.4 | 14.5 | 10.6 | 15 | 5.7 | 5.8 | 5.6 | 10 | 5.8 | 6 | 14.2 | 0 | 0 |
| Basketball | 25/40/35 | main lift 3-6 (VOL 3 / STRENGTH), secondary 8-12 (VOL 2), isolation 15-20 | big 8-16, small 3-8 | 14.5 | 15.1 | 15.5 | 4.5 | 11 | 3 | 0.5 | 5.5 | 2.5 | 1.5 | 12 | 16 | 0 | 0 |
| Volleyball | 25/40/35 | main 3-6, secondary 8-12, quad isometric/slow 3x30-45 s | big 6-14, small 3-9 | 16 | 15 | 15 | 3.8 | 11.5 | 3.8 | 0.8 | 7.5 | 2.5 | 1.5 | 12 | 16 | 0 | 0 |
| American football - skill (WR / DB / RB) | 20/40/40 | STRENGTH main lifts, contrast (heavy -> jump) 1-2x/week (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12) | big 8-14, small 2-6 | 12 | 15 | 18 | 4.5 | 9 | 3 | 0.5 | 5 | 2 | 1.5 | 12 | 16 | 4 | 0 |
| American football - big skill (LB / TE / FB / S) | 25/45/30 | STRENGTH + VOL 2 | big 10-16, small 3-8 | 14.5 | 14.6 | 15 | 6.8 | 11 | 4.5 | 3.8 | 5.5 | 2.5 | 4.3 | 12 | 16 | 4 | 0 |
| American football - linemen (OL / DL) | 30/50/20 | STRENGTH 3-5 + VOL 2 8-12 for mass | big 12-22, small 4-12 | 17 | 17.8 | 16.5 | 11 | 15 | 6.5 | 5 | 6.5 | 3.5 | 7.5 | 12 | 16 | 4 | 0 |
| Soccer (outfield) | 20/40/40 | STRENGTH low volume (3 x 3-5) + contrast (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12) | big 6-13, small 1-5 | 14 | 15 | 18 | 2.5 | 6 | 2.5 | 0.5 | 4.8 | 1.3 | 1 | 12 | 16 | 0 | 0 |
| Softball | 45/35/20 | as baseball | big 8-16, small 4-12 | 14.5 | 15.6 | 15 | 4.8 | 10.5 | 4 | 3.8 | 7.3 | 10.3 | 6.8 | 12 | 16 | 0 | 0 |
| Ice hockey (skaters) | 25/45/30 | STRENGTH + VOL 2 | big 8-15, small 1-6 | 12 | 15 | 15 | 4.5 | 10 | 3 | 2.5 | 5.5 | 2.3 | 1.5 | 12 | 16 | 3 | 0 |
| Tennis (and racket sports) | 25/40/35 | VOL 2 + STRENGTH | big 6-13, small 3-9 | 11 | 14.3 | 14.5 | 3.5 | 10.5 | 2.8 | 0.5 | 7.5 | 2.3 | 1.3 | 12 | 16 | 0 | 4 |
| Golf | 25/40/35 | VOL 2 + STRENGTH lower body | big 4-12, small 1-5 | 10.5 | 10.1 | 7.5 | 2.5 | 10 | 2.5 | 0.5 | 5.5 | 2.3 | 1 | 9 | 12 | 0 | 2 |
| Track sprinter (100-200 m; jumpers as variant) | 15/45/40 | STRENGTH 3-5 + POWER | big 6-15, small 1-6 | 12 | 15 | 18 | 2.5 | 6 | 2.5 | 0.5 | 4.8 | 1.3 | 1 | 12 | 16 | 0 | 0 |
| Distance runner (5 km - marathon) | 10/55/35 | STRENGTH 3-6 reps heavy (running economy without mass) | big 3-9, small 0-6 | 10.5 | 10.1 | 9.5 | 2 | 4 | 0.5 | 0 | 4.8 | 0.8 | 0.5 | 9 | 12 | 0 | 0 |
| Kickboxing / Muay Thai | 20/40/40 | as boxing | big 5-17, small 1-5 | 13 | 14.3 | 15 | 2.8 | 10 | 3.5 | 0.8 | 5.5 | 2.3 | 1.3 | 12 | 16 | 4 | 0 |
| Karate / Taekwondo | 20/35/45 | POWER + STRENGTH low volume (weight classes) | big 4-15, small 1-5 | 13 | 14.3 | 15 | 3.5 | 10 | 2.8 | 0.5 | 5.5 | 2.3 | 1.3 | 12 | 16 | 0 | 0 |
| MMA | 20/45/35 | STRENGTH + POWER (weight class) | big 6-17, small 1-7 | 13 | 14.3 | 14 | 4.8 | 13 | 4 | 0.8 | 5.8 | 3 | 1.8 | 12 | 16 | 4 | 3 |
| Wrestling | 15/55/30 | STRENGTH (relative strength, weight class) | big 7-20, small 2-8 | 11.5 | 14.4 | 11.5 | 4.8 | 15 | 4 | 0.8 | 6 | 5.5 | 1.8 | 12 | 16 | 6 | 4 |
| BJJ / submission grappling | 30/50/20 | STRENGTH + VOL 2 | big 4-15, small 2-7 | 8.5 | 10.6 | 10.5 | 3.5 | 13 | 2.8 | 0.5 | 5.5 | 5 | 1.3 | 9 | 12 | 4 | 4 |
| General population / longevity | 60/25/15 | 10-15 beginners, 6-12 later; power at 40-60% 1RM moved fast | big 3-9, small 2-5 | 6 | 7.5 | 6 | 3.5 | 7 | 2.8 | 2.5 | 4.8 | 3.5 | 3.3 | 9 | 6 | 0 | 0 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 40/40/20 | technique first, 8-15 reps, bodyweight / light DB | big 2-6, small 1-3 | 4 | 5 | 4 | 2.5 | 4.5 | 2.5 | 0.5 | 2.5 | 1 | 1 | 9 | 12 | 0 | 0 |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 40/40/20 | '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions | big 6-14, small 2-8 | 12 | 10 | 12 | 5 | 9 | 5 | 5 | 5 | 2 | 2 | 12 | 16 | 0 | 0 |

| profile | pairing | contra / ipsi (CAT-13) | frontal/transverse share of unilateral lower sets (UNI-12) | priorities | avoid / reduce | push:pull target |
|---|---|---|---|---|---|---|
| Baseball - position players | 'bkd' + 'uhd', 'bhd' + 'ukd' (OBSERVED cross-pattern); pull with knee days, push with hip days (OBSERVED; COACH-ANSWER UNI-11) | both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED | 35% | staggered-stance DL and box jumps; copenhagen planks / adductors; isolation AMRAP ('MAX', 35% of small-muscle sets) | barbell bench (none written); barbell overhead beyond occasional strict press | 1.2 : 1 by sets (DB/landmine pressing dominant; barbell overhead press 3x in the year) |
| Boxing | contrast-complex squat day (Tue L22) and hinge day (Fri L46); deadlift + '3 min Jump Rope' (the boxing tab never says 'French contrast' - the label is INFERRED from the matching 'ALL ABOUT SQUATS' G16 'FRENCH CONTRAST' heavy -> jump -> loaded jump -> banded jump pattern; the banded jump is out of scope - no variable resistance, EQ-12 - so the generator ends on a bodyweight jump) (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12) | contralateral for getting into the hip in stance (INFERRED from CAT-13 COD logic); 'Db contralateral LOW step up' is written in the boxing tab (OBSERVED) | 40% | lower body and posterior chain 16-32 sets; leg ext / leg curls heavy (6&6) and light (20/20) in the same week; Copenhagen + unilateral DL | heavy pressing and arm volume when punching volume is high: REDUCE it (about 30-50% of base, PROPOSED), never cut it (COACH-ANSWER ATH-04; the boxing tab removed it in weeks 3-8 = OBSERVED) | OBSERVED wk3-8: 3 press sets (clean & press) : 3 row sets; v1 generator: HPUSH 3, VPUSH 3, HPULL 3, VPULL 3 + 2 + 2 arm sets (ATH-04) |
| CrossFit - competitor | LB with KNEE DOM / HIP DOM days, UB with PULL / PUSH days | health accessory (CAT-13 size/strength logic, INFERRED for CrossFit) | 10% | squat, deadlift, press, pull strength; gymnastics skill T2B / handstands / double-unders | working to failure: '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' | 1 : 1 |
| Hybrid athlete (strength - athletic - 'crossfitish') | squat day -> 'UNI HD'; deadlift day -> 'UNI KD' (opposite dominance) | - | 10% | core inside tri-sets (OBSERVED; v1 generator puts core first, movable - ATH-11) | - | 1.2 : 1 |
| Powerlifting / max strength | opposite-dominance accessory (squat M.E. -> snatch-grip DL, OBSERVED); unilateral contra / ipsi accessories mostly weeks 1-4 (CAT-13) | contra / ipsi lunges and step-ups as health accessories in weeks 1-4, then bilateral; kept later only if something bugs the lifter (COACH-ANSWER CAT-13) | 5% | box squats '(D)BOX' / '(T&G)BOX', deficit pulls (OBSERVED); the chained / banded pulls in the conjugate draft are out of scope - no variable resistance (COACH-ANSWER EQ-12); pulling every day | - | 1.07 : 1 |
| Bodybuilding / aesthetics | knee + pull / hip + push (OBSERVED; UNI-11); same-pattern pairing (squat + lunge) to drive the muscle harder (COACH-ANSWER UNI-06) | contra / ipsi accessories mostly in the first 2-4 weeks, then mostly bilateral (COACH-ANSWER CAT-13); same-pattern pairing (squat + lunge) to drive the muscle (UNI-06) | 10% | Focus 1 / Focus 2 slots can both hit the same priority muscle, 2-3 sets each, to bring it to its weekly target (COACH-ANSWER ORD-11); priority = +4-6 sets/week, cap about 25-30 (VOL-02); machines for SFR (the sheet's 'LEG PRESS' / 'PENDULUM' 'LOVE IT' notes are OBSERVED opinions, not a ranking); no machine ranking - hack squat / leg press more constrained, Smith less (EQ-11); calves first only when calves are the priority (ORD-04); balance chest (6-8 sets/week in the observed templates) up to the weekly target - the V-taper bias is optional, per athlete (COACH-ANSWER VOL-18) | 'V-SQUAT' (never - GEN-08); medball throwing in the main workout (warm-up only - COACH-ANSWER ATH-05) | 1.3 : 1 |
| Fat loss / body toning | A/B lower days (leg-press-led -> leg ext finisher; deadlift-led -> leg curl finisher) | cross-pattern pairing so clients are less sore and can train more often (COACH-ANSWER UNI-06) | 20% | the block is titled 'MUSCLE BUILDING' | jumping for heavy / deconditioned clients | 0.93 : 1 |
| Basketball | knee + pull / hip + push (BYOP ATHLETIC) | contralateral 'a lot' for getting into and out of the hip (COACH-ANSWER CAT-13) | 45% | single-leg strength (RFE, step-ups, lateral step-ups); hamstring eccentric (Nordic); calf/soleus + tibialis | deep heavy back squat volume in tall athletes when knees are flagged (use box / trap bar) | 1 : 1.7 (pull-biased) |
| Volleyball | BYOP ATHLETIC | contralateral for lateral block footwork (INFERRED from CAT-13) | 30% | posterior cuff / scapular (ISO_REAR); quad tendon loading (slow/isometric); calves | heavy barbell overhead for hitters with shoulder flags (landmine / DB) | 1 : 1.7 |
| American football - skill (WR / DB / RB) | BYOP ATHLETIC; contrast complexes from 'ALL ABOUT SQUATS' French contrast (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12) | contralateral for route cuts (COACH-ANSWER CAT-13: 'football players ... running and changing directions, routes'); ipsilateral step-ups for acceleration (CAT-13) | 40% | hamstrings (Nordic) and hip extension; neck | - | 1 : 1.3 |
| American football - big skill (LB / TE / FB / S) | BYOP ATHLETIC | contralateral for COD (CAT-13), ipsilateral for acceleration | 35% | neck; posterior chain; upper-back mass | - | 1 : 1.1 |
| American football - linemen (OL / DL) | BYOP ATHLETIC; heavy bilateral emphasis | health accessory (INFERRED) | 30% | horizontal push strength; neck/traps; posterior chain | high-amplitude depth jumps for >130 kg athletes | 1 : 1 |
| Soccer (outfield) | BYOP ATHLETIC | contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration | 45% | Nordic 2x/week; Copenhagen 3x/week pre-season; single-leg strength | upper-body hypertrophy volume beyond maintenance | 1 : 1.25 |
| Softball | as baseball | as baseball (INFERRED) | 35% | posterior shoulder; eccentric biceps (pitchers) | barbell overhead | 1 : 1.3 |
| Ice hockey (skaters) | BYOP ATHLETIC; frontal-plane lunges in UKD ('Side Lunges' AL12, 'Curtsy Lunges ' AL21; Cossack is NOT in the BYOP UKD list - it appears only in MASTER_MODEL: 'Cosak lateral lunges' ('(NOT DONE) RESISTANCE PATTERNS ' C47) and 'Medball Reach forward Lateral Cosak lunge' / 'Medball Reach UP Lateral Cosak lunge' (ballistics warm-up A8/A11)) | contralateral for crossovers and lateral pushes (INFERRED from CAT-13) | 50% | adductor eccentric strength (Copenhagen); hip abduction/ER power; neck | - | 1 : 1.5 |
| Tennis (and racket sports) | BYOP ATHLETIC | contralateral 'definitely' (COACH-ANSWER CAT-13) | 50% | posterior cuff / ER; wrist extensors; lateral hip | heavy barbell overhead | 1 : 1.8 |
| Golf | contralateral / ipsilateral loaded lunges and step-ups ('GET INTO THE HIP' / 'GET OUT OF THE HIP') | into / out of the hip loaded lunges and step-ups ('GET INTO THE HIP' / 'GET OUT OF THE HIP'), lead leg into, trail leg out (INFERRED) | 40% | lead-leg block; hip rotation strength; thoracic rotation mobility | high-volume loaded flexion-rotation | 1 : 2.25 |
| Track sprinter (100-200 m; jumpers as variant) | BYOP ATHLETIC | ipsilateral step-ups for the acceleration take-off ('get out of the hip', COACH-ANSWER CAT-13) | 10% | Nordic / hamstring eccentric; calf-Achilles stiffness; hip flexors | upper-body hypertrophy beyond need | 1 : 1.25 |
| Distance runner (5 km - marathon) | lower body first; day pairing hip-dominant + push, knee-dominant + pull (COACH-ANSWER UNI-11 / ORD-06) | ipsilateral step-ups for push-off (INFERRED) | 15% | soleus / calf; hip abductors; hamstrings | high-rep hypertrophy volume | 1 : 1.5 |
| Kickboxing / Muay Thai | as boxing | contralateral (INFERRED from CAT-13) | 45% | frontal-plane lunges; Copenhagen; neck (clinch); hip flexor (knees/kicks) | heavy horizontal pressing volume when striking volume is high: reduce, not cut (COACH-ANSWER ATH-04 rule extended to strikers - INFERRED) | 1 : 1.8 |
| Karate / Taekwondo | as boxing | contralateral (INFERRED) | 45% | hamstring length-strength (high kicks); hip flexor strength; adductors | heavy horizontal pressing volume when striking volume is high: reduce, not cut (COACH-ANSWER ATH-04 rule extended to strikers - INFERRED) | 1 : 1.8 |
| MMA | boxing structure but pulling kept (grappling) | contralateral for level changes and sprawls (INFERRED from CAT-13) | 45% | pulling strength + grip; neck; posterior chain | heavy bench volume (punching) beyond maintenance | 1 : 1.7 |
| Wrestling | emphasis: hinge and pulling volume (more pull than push); day pairing hip-dominant + push, knee-dominant + pull (COACH-ANSWER UNI-11 / ORD-06) | health accessory (INFERRED) | 35% | isometric grip; neck (eccentric/isometric); carries and drags (CARRY/DRAGS headings - need exercises) | - | 1 : 2 |
| BJJ / submission grappling | emphasis: pulling volume (pull-dominant push:pull); day pairing hip-dominant + push, knee-dominant + pull (COACH-ANSWER UNI-11 / ORD-06) | health accessory (INFERRED) | 30% | grip endurance (static); neck; hip mobility | - | 1 : 2.4 |
| General population / longevity | full body each session (BOOTCAMP 1, re-wired as hip + push / knee + pull - COACH-ANSWER ORD-06 / UNI-11) | cross-pattern pairing, less soreness (UNI-06); contralateral lunges as the default variant (INFERRED) | 20% | leg strength + power; posture (pulls); balance | - | 1 : 1.2 |
| Youth athlete (multi-sport, pre/circa/post-PHV) | full body; day pairing hip-dominant + push, knee-dominant + pull (COACH-ANSWER UNI-11 / ORD-06) | both, light (INFERRED) | 30% | movement competency; landing mechanics | maximal loading; depth jumps > ~30 cm circa-PHV (INFERRED heuristic) | 1 : 1 |
| All-around athletic / weekend warrior (non-competitive adults and youth) | knee + pull (Mon/Thu) / hip + push (Tue/Fri) (OBSERVED; COACH-ANSWER UNI-11 / ORD-06); cross-pattern pairing for less soreness (UNI-06) | cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED) | 30% | vary the second weekly exposure (Front Squats Mon -> Low Bar Back Squat Thu, OBSERVED; PER-04 confirmed: a different exercise, and squat only once a week - the other day leg press / belt squat) | - | 1 : 1 |

The frontal / transverse shares are PROPOSED numbers on the COACH-ANSWER UNI-12 direction (more for basketball, tennis, soccer, MMA and other court / combat athletes; little for aesthetics).

### 5.7 Planes and core

Core goes **first** in every session as the warm-up, movable by the user (COACH-ANSWER ATH-11); about 2 core exercises for athletes (VOL-17); thorax vs pelvis vs both, in any plane (CAT-08).

| profile | frontal need | transverse need | core sets/wk (v1) | core plane % | region | mode |
|---|---|---|---|---|---|---|
| Baseball - position players | 2 | 3 | 16 | transverse 48 sagittal 24 frontal 22 unspecified 6 | thorax + pelvis + both | 'LATERAL CORE' Mon, 'Transverse core' Tue/Fri, 'Sagital core' Thu (OBSERVED) |
| Boxing | 2 | 3 | 17 | sagittal 40 transverse 30 frontal 30 | thorax + pelvis + both | OBSERVED: situps/T2B, Russian twists, side planks, Copenhagen, swiss-ball knee tucks, star toe touches, slider runners |
| CrossFit - competitor | 1 | 1 | 8 | sagittal 70 frontal 15 transverse 15 | pelvis (T2B) + both (hollow) | OBSERVED: skill-integrated; v1 generator: core FIRST as the warm-up, movable (COACH-ANSWER ATH-11; dose PROPOSED) |
| Hybrid athlete (strength - athletic - 'crossfitish') | 1 | 1 | 12.9 | sagittal 60 frontal 20 transverse 20 | integrated | OBSERVED: tri-set partner, never standalone; v1 generator: core FIRST as the warm-up, movable into the tri-sets if the user prefers (COACH-ANSWER ATH-11) |
| Powerlifting / max strength | 0 | 0 | 8 | sagittal 50 frontal 25 transverse 25 | both | core first, 1 exercise per session (ATH-11; dose PROPOSED) - none written in the sheet (OBSERVED gap) |
| Bodybuilding / aesthetics | 0 | 0 | 8 | sagittal 50 frontal 25 transverse 25 | client choice | core first as the warm-up (ATH-11), 1 exercise per session (dose PROPOSED); OBSERVED on the optional days |
| Fat loss / body toning | 1 | 1 | 14.2 | sagittal 45 transverse 30 frontal 25 | both | OBSERVED: circuits only (situps, bicycle crunches, plank taps, side planks, mountain climbers, plank hip turns); v1 generator: core FIRST in every session as the warm-up, movable (COACH-ANSWER ATH-11), circuits stay as finishers (PRG-11) |
| Basketball | 3 | 2 | 16 | sagittal 30 frontal 35 transverse 35 | both | static anti-rotation / anti-lateral flexion first, then dynamic |
| Volleyball | 2 | 2 | 16 | sagittal 35 frontal 25 transverse 40 | both | anti-extension (spike arch) + rotation |
| American football - skill (WR / DB / RB) | 3 | 2 | 16 | sagittal 30 frontal 35 transverse 35 | both | anti-rotation + contact bracing |
| American football - big skill (LB / TE / FB / S) | 2 | 2 | 16 | sagittal 35 frontal 30 transverse 35 | both | static bracing first |
| American football - linemen (OL / DL) | 2 | 1 | 16 | sagittal 40 frontal 30 transverse 30 | both | static bracing / carries |
| Soccer (outfield) | 3 | 2 | 16 | sagittal 30 frontal 40 transverse 30 | pelvis + both | Copenhagen + anti-rotation |
| Softball | 2 | 3 | 16 | transverse 45 sagittal 25 frontal 30 | both | as baseball |
| Ice hockey (skaters) | 3 | 3 | 16 | sagittal 25 frontal 35 transverse 40 | both | anti-rotation + Copenhagen |
| Tennis (and racket sports) | 3 | 3 | 16 | sagittal 25 frontal 30 transverse 45 | both | anti-rotation -> rotation; anti-extension (serve) |
| Golf | 2 | 3 | 12 | sagittal 20 frontal 25 transverse 55 | both | Pallof holds -> chops (FUNCTIONAL 'ANTERIOR OBLIQUE SYSTEM') |
| Track sprinter (100-200 m; jumpers as variant) | 1 | 1 | 16 | sagittal 40 frontal 30 transverse 30 | both | anti-extension + hip flexion |
| Distance runner (5 km - marathon) | 2 | 1 | 12 | sagittal 30 frontal 40 transverse 30 | both | static |
| Kickboxing / Muay Thai | 3 | 3 | 16 | sagittal 25 frontal 30 transverse 45 | both | rotation + clinch bracing |
| Karate / Taekwondo | 3 | 3 | 16 | sagittal 30 frontal 30 transverse 40 | both | rotation |
| MMA | 2 | 3 | 16 | sagittal 35 frontal 30 transverse 35 | both | static + bridging |
| Wrestling | 2 | 3 | 16 | sagittal 35 frontal 30 transverse 35 | both | static/isometric + bridging |
| BJJ / submission grappling | 2 | 2 | 12 | sagittal 40 frontal 30 transverse 30 | both (flexion endurance for guard) | static first |
| General population / longevity | 1 | 1 | 6 | sagittal 40 frontal 30 transverse 30 | both | static first |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 2 | 2 | 12 | sagittal 40 frontal 30 transverse 30 | both | static first |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 1 | 2 | 16 | sagittal 34 frontal 33 transverse 33 | client pick | core FIRST in every session as the warm-up, about 2 exercises, movable (COACH-ANSWER ATH-11 / VOL-17); OBSERVED template put 'Core' on the optional days (v0) |

### 5.8 Conditioning (aerobic sessions and colour mix per week)

COACH-ANSWER ATH-07: 3 sessions/week for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics / bodybuilders plus long walks after workouts. Fighters' opening cardio is a real aerobic block (ORD-09). Any erg works; track distance, calories or time (EQ-14). Athletes' OFF-season counts and every colour split are PROPOSED / INFERRED.

| profile | A (blue) | B (green) | C (orange) | LC | sessions/wk (off-season or default) | in season | walks after workouts | formats | evidence |
|---|---|---|---|---|---|---|---|---|---|
| Baseball - position players | 1 | 0 | 1 | 0 | 2 | 2 | - | 'Buy out' 1-3 bouts of 10-20 cal bike/row/ski or 15-30 s run (SPEED POWER 10-39 s); recovery week only: 'Paced Cardio - easy' 4 x 10 min (C) | OBSERVED; OBSERVED buy-outs (A, 10-39 s finishers) stay on top as finishers; sessions PROPOSED |
| Boxing | 1 | 1 | 1 | 0 | 3 | 2 | - | 'Sprint 20/ Recover 40' rounds 5,5,6,6,7,8 (first on Friday); 'Cardio of any choice' 20-40 min; '3 min Jump Rope' between deadlift sets; wk1-2: '20 sec fast/ 40 sec slow' + '20 min' easy | OBSERVED + COACH-ANSWER ORD-09 (the opening cardio on Tue/Fri is a real aerobic block); OBSERVED A 'Sprint 20/ Recover 40' + C 20-40 min; ORD-09: the opening cardio is a real aerobic block; off-season 3 PROPOSED |
| CrossFit - competitor | level 3+ | level 2+ | level 1+ | level 4 | OBSERVED by level: 2 / 2 / 3 / 4 aerobic sessions + 1-4 WODs | - | - | - | OBSERVED; OBSERVED by level: 2 / 2 / 3 / 4 aerobic sessions + 1-4 WODs |
| Hybrid athlete (strength - athletic - 'crossfitish') | 1 | 0 | 1 | 0 | OBSERVED A 1 (Tue sprint intervals) + C 1 (Fri '15-40 min' easy = a real aerobic block, ORD-09) | - | - | Tue sprint intervals (150-300 s work); Fri '15-40 min constant cardo easy'; 'AMRAP' 12,15,16,17,18,19,20,20 (row 70; day and unit not written - Sat placement and minutes INFERRED) | OBSERVED; the Friday '15-40 min constant cardo easy' is a real aerobic block (COACH-ANSWER ORD-09); OBSERVED A 1 (Tue sprint intervals) + C 1 (Fri '15-40 min' easy = a real aerobic block, ORD-09) |
| Powerlifting / max strength | 0 | 0 | 2 | 0 | 2 | - | - | none written (OBSERVED); PROPOSED: 2 colour-C sessions (ATH-07 does not cover strength clients) | OBSERVED absence; PROPOSED; not covered by ATH-07: PROPOSED 2 colour-C sessions for work capacity |
| Bodybuilding / aesthetics | 1 | 1 | 2 | 0 | 4 | - | yes | COACH-ANSWER ATH-07: 4 aerobic sessions + long walks after workouts; OBSERVED: BYOP 'Cardio' slot on the 2 'Optional' days; MM 4 TRACKS AESTHETICS-8: '30-40 mi slow/steady CARDIO' WEDNESDAY & SATURDAY; MM UL/PPL 'max 40 min of steady' Wed/Sat | COACH-ANSWER ATH-07 (count); colour split PROPOSED; COACH-ANSWER ATH-07: 4 sessions + long walks after workouts; colour split PROPOSED (the cheat sheet's one-of-each rule assumes 3) |
| Fat loss / body toning | 1 | 1 | 1 | 0 | 3 | - | - | COACH-ANSWER ATH-07: 3 aerobic sessions (one of each colour, cheat-sheet rule); OBSERVED: Wed/Sat 30-40 min steady (C); 4-station circuits 3x30 s -> 5x50 s (12 -> 33 min work/week) as finishers after lifting (PRG-11) | COACH-ANSWER ATH-07 + OBSERVED; COACH-ANSWER ATH-07: 3 sessions; circuits stay as finishers after lifting (PRG-11) |
| Basketball | 1.5 | 1 | 0.5 | 0 | 3 | 2 | - | repeat sprints 15/45 -> 20/40 -> 30/30 (A); 1-2 min court shuttles 1:1-1:2 (B); early off-season 20-30 min easy (C) | INFERRED |
| Volleyball | 2 | 0.5 | 0.5 | 0 | 3 | 2 | - | rally repeats 5-10 s work / 15-20 s rest (A); early off-season C | INFERRED |
| American football - skill (WR / DB / RB) | 2 | 0.5 | 0.5 | 0 | 3 | 2 | - | play repeats 5-6 s work : 30-40 s rest (1:5-1:6), 10-15 reps x 2-3 'drives'; C only in early off-season | INFERRED from SCIENCE |
| American football - big skill (LB / TE / FB / S) | 2 | 0.5 | 0.5 | 0 | 3 | 2 | - | 5-6 s : 30-40 s repeats | INFERRED |
| American football - linemen (OL / DL) | 2 | 0.5 | 0.5 | 0 | 3 | 2 | - | 5 s : 30-40 s | INFERRED |
| Soccer (outfield) | 1 | 1.5 | 1 | 0 | 3.5 | 2 | - | RSA 6-10 x 20-30 m (A); VO2max 4 x 4 min / 1-3 min bouts (B); off-season base runs (C) | INFERRED - highest aerobic need of the team sports |
| Softball | 1 | 0 | 1 | 0 | 2 | 2 | - | buy-outs as baseball | INFERRED |
| Ice hockey (skaters) | 1 | 1 | 0.5 | 1 | 3.5 | 2 | - | shift simulation 30-45 s hard : 2-4 min easy (B with long rest); LACTATE CLEARANCE surges; off-season C base | INFERRED from SCIENCE |
| Tennis (and racket sports) | 1.5 | 1 | 0.5 | 0 | 3 | 2 | - | point simulation 5-10 s : 20-25 s (A); games blocks 1-3 min (B); multi-hour match base (C) | INFERRED |
| Golf | 0 | 1 | 2 | 0 | 3 | 2 | - | walking / cycling 30-45 min (C) | INFERRED |
| Track sprinter (100-200 m; jumpers as variant) | 1 | 0 | 1 | 0 | 2 | 2 | - | 100/200: alactic only, tempo runs as C; 400 m/hurdles: LACTATE CLEARANCE + speed endurance | INFERRED |
| Distance runner (5 km - marathon) | 0.5 | 0.5 | 2 | 0 | the running plan is the aerobic work (OBSERVED Sheet24: 2 runs/week; PROPOSED 3rd easy session) | run plan | - | OBSERVED Sheet24 (2 runs/week, day 1 + day 2): longest run 3 -> 12 mi, split a.m./p.m. days, progression runs, hill/flat sprints, intervals, '1-mile at max effort' tests wk 10/14, cut-backs wk 3/6/8/12/18, taper wk 21 'Tapering: 6 miles, comfortable pace' | OBSERVED run content (borrowed model, 2 runs/week); the colour split A 0.5 / B 0.5 / C 2 (= 3 sessions) is INFERRED; the running plan is the aerobic work (OBSERVED Sheet24: 2 runs/week; PROPOSED 3rd easy session) |
| Kickboxing / Muay Thai | 1 | 1 | 1 | 0.5 | 3.5 | 2 | - | HIA ~2 s / LIA ~2 s / pauses ~5 s, fighting:non-fighting 1:1; 3 x 3 min rounds (B) | INFERRED from SCIENCE |
| Karate / Taekwondo | 1.5 | 1 | 1 | 0 | 3.5 | 2 | - | efforts ~8-10 s at 1:1 to 1:4; techniques 0.3-1.8 s | INFERRED from SCIENCE |
| MMA | 1 | 1 | 1 | 1 | 4 | 2 | - | striking 12-24 s bursts at 1:3-1:7; grappling 35-75 s at ~1:1; 5-min round simulations (LC) | INFERRED from SCIENCE |
| Wrestling | 1 | 1 | 1 | 1 | 4 | 2 | - | 2-3 min period simulations (B / LC); short burst repeats | INFERRED |
| BJJ / submission grappling | 0.5 | 1.5 | 1 | 0.5 | 3 | 2 | - | rolling rounds 5-6 min (B/LC); C base | INFERRED |
| General population / longevity | 0 | 1 | 2 | 0 | 3 | - | - | C 2 x 20-40 min + B 1x (level 2+) | COACH-ANSWER ATH-07 (count = 3); colours INFERRED; COACH-ANSWER ATH-07: 3 sessions |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 1 | 0 | 1 | 0 | 2 | 2 | - | games and relays | INFERRED |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 1 | 1 | 1 | 0 | 3 | - | - | 'Aerobic Capacity' Wed/Sat from the CARDIO list (B7:B122: speed intervals, distance intervals, tests) - OBSERVED 2 slots; MM: 'WEDNESDAYS & SATURDAYS max 40 min of steady' | OBSERVED slots + COACH-ANSWER ATH-07 (3 for general clients); COACH-ANSWER ATH-07 general rule (3); the observed template has 2 'Aerobic Capacity' slots |

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
| All-around athletic / weekend warrior (non-competitive adults and youth) | PAIN_GENERAL |

### 5.10 Position and phase variants

| profile | variant | evidence | weekly set delta vs v1 base | computed | notes |
|---|---|---|---|---|---|
| Baseball - position players | Baseball - pitchers | COACH-ANSWER ATH-08 (RIGHT: pitchers get less overhead pressing, more arm care, rotational throws kept light); calendar row 16 'PITCHERS/CATCHERS' vs 'POSITIONS' (OBSERVED) | VPUSH -3, VPULL -1, ISO_REAR +3, ISO_GRIP +3, THROW -4, COD -2, SPRINT -2 | total 130.6; athletic 21.2%; plyometric ~39 | less overhead pressing (ATH-08); arm care block (posterior cuff, scapular, forearm) every week, not only in recovery weeks (ATH-08); rotational medball kept LIGHT; overhead slams / plyo push-ups off on bullpen and start days (ATH-08 + INFERRED); lead-leg eccentric single-leg work (FFE lunges, lateral step-ups); starters: 1 colour-C flush the day after a start (INFERRED) |
| Baseball - position players | Baseball - catchers | INFERRED | BKD -3, UHD +3, ISO_REAR +3 | total 139.6; athletic 25.6%; plyometric ~39 | limit loaded deep-squat volume (box squats to parallel); hip IR/ER mobility daily; lateral 'block' plyos (lateral plate hops) |
| CrossFit - competitor | CrossFit - class member | OBSERVED 'CLASS PROGRAMMING SPLIT' + HALF TIME table | - | - | 6 class days, each 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD'; squat MON, press TUES, deadlift THURS at 3 sets x 7 -> 4 reps, 1RM in week 8; snatch TUES, clean FRID at 3 x 4 -> 1; weekly lifting = 9 strength + 6 power sets; the WOD is the main stimulus |
| Powerlifting / max strength | Strength 12-week (percent + RPE) | OBSERVED STRENGTH-12 | - | - | % 80 -> 90 then 'MID DELOAD'; unilateral = opposite pattern ('STAGGERED STANCE DL' on squat days); no plyos, no vertical press, isolation 3x8 + 'TATE PRESS' 3x20 |
| Bodybuilding / aesthetics | Aesthetics 12-week PPL (6 days) | OBSERVED AESTHETICS-12 | - | - | 20-35 sets per muscle per week (OBSERVED; only track above 15-20); the v1 generator caps at the coach's landmarks - advanced 20+, growth 20-25, priority +4-6 up to about 25-30 (COACH-ANSWER VOL-01 / VOL-02); WK7 'A WEEK LOWER'; supersets + MYO from WK9; high-volume track: collect the volume on constrained machines (COACH-ANSWER EQ-03) |
| Bodybuilding / aesthetics | Aesthetics 3-day builder | OBSERVED '3 DAY BUILDER' | - | - | 5 slots/main day; drops Bicep, Leg Extensions, Tricep, ABdution; keeps Leg Curls + Calves; Focus 6 slots/week |
| Fat loss / body toning | Bootcamp option 1 | OBSERVED | - | - | AESTHETICS slots re-paired so each session is a complete full-body dose (knee + hip, push + pull); tab title 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'; Tue/Fri wiring (hinge + vertical pull, lunge + horizontal push) was a mistake: hip-dominant + push, knee-dominant + pull (COACH-ANSWER ORD-06); cross-pattern pairing so clients are less sore (UNI-06); Wed/Sat Calves, Cardio, Core, Focus 1, Focus 2 (add-ons or separate days, ideally separate - ORD-10) |
| Fat loss / body toning | Bootcamp option 2 | OBSERVED | - | - | 4, 5 or 6 sessions a week (COACH-ANSWER PRG-03); timed circuits: 3-5 rounds x 30-50 s per station, 5-7 stations, 35-45 min total (PRG-03); no SETS/REPS columns in the sheet (OBSERVED) |
| Basketball | Guards / wings | INFERRED | COD +2, SPRINT +2, PLYO -2 | total 159; athletic 48.4%; plyometric ~105 | more unilateral, lateral and horizontal jumps; ~41 game jumps (backcourt) |
| Basketball | Forwards / centers | INFERRED | PLYO +2, COD -6, SPRINT -2, BKD +2, BHD +2, HPUSH +2 | total 157; athletic 43.9%; plyometric ~133 | more bilateral vertical + landing volume (rebounding, ~79 game jumps frontcourt); more strength/mass for post play; body-mass-scaled contacts: cap depth-jump height |
| Volleyball | Setter | INFERRED | PLYO -4, JLK +3, THROW -2 | total 143.5; athletic 40.8%; plyometric ~96 | jumps most per point but lower amplitude (jump sets) |
| Volleyball | Libero / DS | INFERRED | PLYO -16, COD +6, SPRINT +2, THROW -4 | total 134.5; athletic 36.8%; plyometric ~19 | plyo T2; lateral/dive landings; COD T3 reactive |
| American football - skill (WR / DB / RB) | Quarterback | INFERRED | PLYO -8, COD -6, SPRINT -3, VPUSH -2, ISO_REAR +6, THROW +2 | total 140.5; athletic 38.1%; plyometric ~41 | overhead thrower: SHOULDER_THROWER + ELBOW_THROWER rules; rotational medball only |
| American football - skill (WR / DB / RB) | Kicker / punter | INFERRED | PLYO -12, COD -12, SPRINT -5, UKD +3, UHD +3 | total 128.5; athletic 30.7%; plyometric ~14 | single-leg strength, hip flexor and adductor capacity (HIP_FLEXOR, GROIN_ADDUCTOR) |
| Soccer (outfield) | Goalkeeper | INFERRED | SPRINT -6, COD -6, THROW +4, VPUSH +1, ISO_REAR +3 | total 132; athletic 40.2%; plyometric ~82 | lateral/vertical diving plyos (lateral 45%); overhead/rotational distribution throws; shoulder + hip care |
| Softball | Softball pitcher (windmill) | INFERRED + SCIENCE | ISO_BICEP +2, ISO_REAR +3, ISO_GRIP +3, THROW -3 | total 138.5; athletic 25.3%; plyometric ~48 | windmill loads the shoulder like baseball pitching and the biceps eccentrically; tournament weekends can mean 1,200-1,500 pitches in 3 days: schedule lifting around them |
| Ice hockey (skaters) | Goalie | INFERRED | SPRINT -3, PLYO -6, THROW -4, COD +2 | total 108.5; athletic 25.3%; plyometric ~0 | frontal-plane pushes, hip IR/ER mobility, adductor capacity (butterfly) |
| Track sprinter (100-200 m; jumpers as variant) | Jumpers (LJ/TJ/HJ) | INFERRED | PLYO +6, SPRINT -4 | total 130; athletic 43.1%; plyometric ~148 | plyo T4-T5, unilateral take-off emphasis |
| Track sprinter (100-200 m; jumpers as variant) | 400 m / hurdles | INFERRED | - | - | add LC and B conditioning; hurdlers add hip mobility |
| Track sprinter (100-200 m; jumpers as variant) | Throwers (shot / discus / hammer / javelin) | COACH-ANSWER ATH-03 names throwers in the 'more resistance' group; deltas INFERRED | PLYO -6, SPRINT -8, THROW +10, BKD +4, BHD +4, HPUSH +3 | total 135; athletic 37%; plyometric ~61 | resistance group: more bilateral strength and size; event-specific throws are ballistics (heavier implements stay <= 20 lb for medballs, EQ-06) |
| General population / longevity | Older adults (age threshold PROPOSED 60+, or foundation / injury based) | COACH-ANSWER ATH-09 / EQ-03 + SCIENCE (NSCA older-adult position stand) | - | - | few plyos unless the client asks (ATH-09); no sex-based rules - age, foundation, goal and injuries decide (ATH-09); compounds and isolation on constrained machines / cables (EQ-03); machines filed MODERATE / ADVANCED are fine (EQ-04); never overhead squat, snatch, low-bar squat or depth jumps (EQ-03); 2-3 days/week, 2-3 sets per major muscle group, 8-10 exercises; power at 40-60% 1RM (30-60% if frail) - SCIENCE (the generator keeps the coach's session cap: resistance-only about 5-7 exercises + core first, 45-60 min - COACH-ANSWER VOL-08 / VOL-16 / UNI-09); sit-to-stand, step-ups, balance every session (SCIENCE); age threshold not given by the coach: PROPOSED 60+ or foundation / injury based; vertical push gets a seated machine shoulder press option (COACH-ANSWER EQ-05) |
| All-around athletic / weekend warrior (non-competitive adults and youth) | MM athletic STARTING (off-season block 1) | OBSERVED | - | - | 3 days, 89 working sets, 146 jump contacts (94 plyometric by the v1 re-count), 210 throws (ASSUMED: the cell says only 'ALL LIST'; 210 = the 19-throw ballistics 'MEDBALL CHEAT SHEET', 17 x 10 + 2 x 20), resistance 44 sets; plyo share of power sets 33% |
| All-around athletic / weekend warrior (non-competitive adults and youth) | MM athletic MID | OBSERVED | - | - | 4 days, 72 sets, 71 jump + 120 low-amplitude contacts, 400 throws (10 rotational x 2x10 twice); plyo share 8% (throw-dominant) |
| All-around athletic / weekend warrior (non-competitive adults and youth) | MM athletic ADVANCED | OBSERVED | - | - | 4 days, 59 sets, 32 jump + 100 low, 420 throws (ASSUMED: 2 x 'ALL LIST' = 2 x 210), resistance 24, 'DEADLIFTS (1RIR)' 3x1; plyo share 9%; PRG-04: STARTING / MID / ADVANCED are back-to-back blocks OR levels - 'depends on whatever is needed' |

Boxer base phase (OBSERVED wk1-2): THROW 19, BKD 6, BHD 6, UKD 6, UHD 6, HPUSH 6, VPUSH 6, HPULL 6, VPULL 6, ISO_QUAD 6, ISO_HAM 6, ISO_BICEP 3, ISO_TRICEP 3, CORE 14.  CrossFit power month (OBSERVED SEPT): TE 24 (plus aerobic L4 + WODs L4 + TEST).

### 5.11 Bilateral : unilateral model (NEW v1)

* Scale: share of lower-body compound sets that are BILATERAL : UNILATERAL, anywhere from 90/10 to 10/90 (COACH-ANSWER UNI-02); upper body follows the same logic for pressing and pulling (UNI-03); coach-adjustable.
* Why: 'the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces' (UNI-02).
* bodybuilders / powerlifters: about 50/50 at the start (unilateral as a small health foundation), then 80/20 -> 90/10 bilateral (COACH-ANSWER UNI-02).
* field / change-of-direction athletes (tennis example): 80-90% unilateral in the gym; bilateral = health foundation for connective tissue and joints (COACH-ANSWER UNI-02).
* in-season athletes: bilateral kept minimal (maintain strength and potentiation), unilateral keeps ranges of motion and health (COACH-ANSWER UNI-10).
* pain or injury moves the share (usually toward unilateral / split grips, or to machines) - COACH-ANSWER UNI-02, VOL-03, MASTER_MODEL athletic A6.
* Engine: share(week) = start + (end - start) x week_fraction across the off-season block (the coach's set-addition order adds sets to the FIRST exercise first, VOL-07, and bilateral slots come first, so the bilateral share rises naturally for size/strength goals); in-season value replaces it during the season; pain overrides; the weekly-set baseline in section 5.2 uses the mid-block value (PROPOSED). For profiles whose share moves TOWARD unilateral (field / COD athletes, e.g. basketball 20/80 -> 10/90), the share target decides where an added set goes: when adding it to the first (bilateral) exercise would move the share away from the week's target, it goes to the first unilateral exercise instead (PROPOSED - reconciles VOL-07 with UNI-02).
* Contra / ipsi and pairing: **contralateral**: load in the hand opposite the working leg pulls you INTO the hip (eccentric coil); used for change-of-direction athletes who must get in and out of the hip quickly and need the range (football route runners, soccer, basketball 'a lot', tennis 'definitely') - COACH-ANSWER CAT-13. **ipsilateral**: load on the same side helps you OUT of the hip; used for sprint acceleration (e.g. ipsilateral step-ups for a 100 m sprinter's take-off) - COACH-ANSWER CAT-13. **size_strength**: bodybuilders / powerlifters: contra/ipsi lunges and step-ups are HEALTH accessories (hips, low back, the rotational forces lost in symmetrical lifting), mostly in the first 2-4 weeks of a program, then mostly bilateral; kept as an accessory later only if something bugs them - COACH-ANSWER CAT-13. **pairing**: same-pattern pairing (squat + lunge) drives one muscle harder for aesthetics and high-level athletes who need more stimulus; cross-pattern pairing (squat + single-leg RDL) for bootcamp / general clients so they are less sore and can train more often - COACH-ANSWER UNI-06.

| profile | block start (bi/uni %) | block end | in season | 5.2 baseline (mid-block) | OBSERVED in the coach's program | evidence |
|---|---|---|---|---|---|---|
| Baseball - position players | 50/50 | 40/60 | 20/80 | 45/55 | 56/44 | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Boxing | 40/60 | 30/70 | 20/80 | 35/65 | 44/56 | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| CrossFit - competitor | 50/50 | 70/30 | 60/40 | 60/40 | 50/50 | PROPOSED on the COACH-ANSWER UNI-02 scale; competition-month value PROPOSED; pain adjusts (UNI-02 / VOL-03) |
| Hybrid athlete (strength - athletic - 'crossfitish') | - | - | - | 38/62 | 38/62 | OBSERVED split kept (no coach rule for this product) |
| Powerlifting / max strength | 50/50 | 90/10 | - | 70/30 | 68/32 | COACH-ANSWER UNI-02; no season; pain adjusts (UNI-02 / VOL-03) |
| Bodybuilding / aesthetics | 50/50 | 80/20 | - | 65/35 | 50/50 | COACH-ANSWER UNI-02; no season; pain adjusts (UNI-02 / VOL-03) |
| Fat loss / body toning | 50/50 | 50/50 | - | 50/50 | 51/49 | PROPOSED on the COACH-ANSWER UNI-02 scale; no season; pain adjusts (UNI-02 / VOL-03) |
| Basketball | 20/80 | 10/90 | 10/90 | 15/85 | - | COACH-ANSWER UNI-02; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Volleyball | 40/60 | 30/70 | 20/80 | 35/65 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| American football - skill (WR / DB / RB) | 20/80 | 10/90 | 10/90 | 15/85 | - | COACH-ANSWER UNI-02; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| American football - big skill (LB / TE / FB / S) | 30/70 | 20/80 | 10/90 | 25/75 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| American football - linemen (OL / DL) | 50/50 | 40/60 | 30/70 | 45/55 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Soccer (outfield) | 20/80 | 10/90 | 10/90 | 15/85 | - | COACH-ANSWER UNI-02; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Softball | 50/50 | 40/60 | 20/80 | 45/55 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Ice hockey (skaters) | 20/80 | 10/90 | 10/90 | 15/85 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Tennis (and racket sports) | 20/80 | 10/90 | 10/90 | 15/85 | - | COACH-ANSWER UNI-02; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Golf | 30/70 | 20/80 | 20/80 | 25/75 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Track sprinter (100-200 m; jumpers as variant) | 40/60 | 30/70 | 20/80 | 35/65 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Distance runner (5 km - marathon) | 20/80 | 20/80 | 10/90 | 20/80 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Kickboxing / Muay Thai | 30/70 | 20/80 | 20/80 | 25/75 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Karate / Taekwondo | 30/70 | 20/80 | 20/80 | 25/75 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| MMA | 40/60 | 30/70 | 20/80 | 35/65 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| Wrestling | 50/50 | 40/60 | 30/70 | 45/55 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| BJJ / submission grappling | 50/50 | 40/60 | 30/70 | 45/55 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| General population / longevity | 50/50 | 50/50 | - | 50/50 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; no season; pain adjusts (UNI-02 / VOL-03) |
| Youth athlete (multi-sport, pre/circa/post-PHV) | 50/50 | 50/50 | 40/60 | 50/50 | - | PROPOSED on the COACH-ANSWER UNI-02 scale; in-season minimal bilateral = COACH-ANSWER UNI-10; pain adjusts (UNI-02 / VOL-03) |
| All-around athletic / weekend warrior (non-competitive adults and youth) | 50/50 | 40/60 | - | 45/55 | 50/50 | PROPOSED on the COACH-ANSWER UNI-02 scale; no season; pain adjusts (UNI-02 / VOL-03) |

### 5.12 ATH-02 ranking check (computed)

The coach confirmed this order of plyo volume. v1 targets are set so the mid-points never increase down the list (checked in `build_profiles.py`: PASS). Budget = sets x nominal contacts; observed = the ground-contact re-count.

| coach rank | profile | plyometric target / wk (PROPOSED) | mid | v1 budget (nominal) | observed in the coach's programs |
|---|---|---|---|---|---|
| 1 | Basketball | 100-140 | 120 | 119 | - |
| 1 | Volleyball | 100-140 | 120 | 122 | - |
| 2 | Track sprinter (100-200 m; jumpers as variant) | 90-120 | 105 | 104 | - |
| 3 | American football - skill (WR / DB / RB) | 80-110 | 95 | 95 | - |
| 4 | Soccer (outfield) | 70-95 | 82.5 | 82 | - |
| 5 | MMA | 55-80 | 67.5 | 68 | - |
| 6 | Tennis (and racket sports) | 45-70 | 57.5 | 58 | - |
| 7 | Baseball - position players | 35-60 | 47.5 | 37 (observed budget) | 37 (B1) / 58 (B2) / 74 (B3) fast-reactive + 17 / 13 / 20 landings; ballistic jumps 51 / 87 / 49 |
| 8 | Ice hockey (skaters) | 25-45 | 35 | 34 | - |
| 9 | Wrestling | 20-40 | 30 | 29 | - |
| 9 | BJJ / submission grappling | 20-35 | 27.5 | 28 | - |
| 10 | Boxing | 15-30 | 22.5 | 31 (observed budget) | 31 fast-reactive (tuck jumps, drop into box jumps) + 24 landings + 66 ballistic-jump reps; 1,227 low-amplitude incl. rope |
| 10 | Karate / Taekwondo | 15-30 | 22.5 | 22 | - |
| 11 | Golf | 0-15 | 7.5 | 8 | - |

v1 verification: the check above passes on target MID-POINTS, but NOT on the v1 BUDGETS: the boxer's OBSERVED budget (31 fast-reactive contacts) sits above the INFERRED wrestling (29) and BJJ (28) budgets and the karate budget (22), while the coach ranks wrestling / BJJ above boxing and boxing = karate (ATH-02). Generator rule (PROPOSED - PENDING COACH APPROVAL): profiles whose budget is an OBSERVED program are clamped to their PROPOSED target band when a plan is generated, and boxing's fast-reactive dose is set equal to karate's (about 22/week; the landings and ballistic jumps of the observed program stay). The OBSERVED budget is kept in the tables as evidence. Baseball's observed budget (37) sits inside its band and keeps the order.

### 5.13 Population modifiers: age, experience, competition level (NEW v1)

| modifier | rule | evidence |
|---|---|---|
| sex | no rule in this document depends on sex: the coach programs by age, foundation (training experience), goal and injuries; 'the rules kind of apply to everybody' (COACH-ANSWER ATH-09; GEN-02 drops sex from the intake) | COACH-ANSWER ATH-09 / GEN-02 |
| training experience | training experience in years (GEN-02 / PRG-05): L1 novice = under about 6-12 months; L2 intermediate = over 1 year consistent; L3 advanced; more than 6-12 months off -> the body is treated as L1 (skills come back fast); ex-pros start at L1 only briefly | COACH-ANSWER PRG-05 / GEN-02 |
| older clients | older clients: few plyos unless they ask for them (COACH-ANSWER ATH-09); compounds AND isolation lean to constrained machines / cables; never overhead squat, snatch, low-bar squat or depth jumps (EQ-03); machines filed MODERATE/ADVANCED are fine for them (EQ-04). Age threshold not given by the coach: PROPOSED 60+ or any client whose foundation / injuries call for it | COACH-ANSWER ATH-09 / EQ-03 / EQ-04; threshold PROPOSED |
| youth | youth: foundational lists, some Olympic lifts from the floor according to the program (ATH-09); growth-spurt caps stay INFERRED | COACH-ANSWER ATH-09 |
| injured / high-volume | injured clients and clients carrying high volume collect that volume 'in a safe place with more constraints' (constraint 4-5 machines) - COACH-ANSWER EQ-03 | COACH-ANSWER EQ-03 |
| competition level | high school, college and pro athletes need the same things; only loads and speeds change per athlete (COACH-ANSWER PRG-09); high school: 'just have to do a lot of work' - same template, general work capacity and technique (PROPOSED: no separate profile); college: 'trying to adapt as much as they can' - full progression (PROPOSED); pro: 'a higher level and a little bit more care for their body because of contracts' - PROPOSED: weekly volume increase kept at the low end of the person-based 3/5/7% rate, injury rules applied first, testing optional | COACH-ANSWER PRG-09 (+ PROPOSED encoding) |
| body weight | new intake field (GEN-02): loads loaded jumps at 10-20% of body weight, too heavy when jump height or speed drops (EQ-15); heavy athletes (e.g. >130 kg linemen) avoid high-amplitude depth jumps; moves combat athletes toward the 'more resistance' group as heavyweights (ATH-03) | COACH-ANSWER GEN-02 / EQ-15 / ATH-03 + INFERRED |
| in-season content | rule: in-season: about 2 lifting days a week, low volume (PER-08 assumption confirmed RIGHT); what fills it depends on the athlete (COACH-ANSWER PER-08); speed: speed athletes -> sprints (max-velocity / acceleration exposures); strength_maintenance: most other athletes -> maintenance of strength (bilateral kept minimal, UNI-10); jumps: some athletes -> high jumps (low-volume, high-quality jumping); also: 2 aerobic sessions (ATH-07); no contrast (ATH-12 = off-season only); deload = about half the sets (PER-05) | COACH-ANSWER PER-08 / UNI-10 / ATH-07 / ATH-12 / PER-05 |

## 6. Profile cards (rationale, template, v1 adjustments, season overrides, what is still open)

### Baseball - position players  (`baseball_position`)

* **Evidence:** OBSERVED (MASTER_MODEL 'BASEBALL', Block 1 off-season means) + INFERRED position deltas; v1: COACH-ANSWER PRG-09 (high school = college = pro), ATH-08 (pitchers), ATH-10 (Olympic lifts standard)
* **Template:** MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'
* **Days:** 4 main + 0 optional (Mon/Tue/Thu/Fri written (OBSERVED); Wed + weekend left for practice/games (INFERRED)) - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); COD +2 and SPRINT +2 INFERRED for position players; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED B1 means; COD 2 and SPRINT 3 are INFERRED additions for position players (observed COD = 0, AP_SPRINT = 1.0)
* **v1 adjustments:** PLYO split into PLYO (plyometric + landings) / JLK (low amplitude) / BALL (ballistic jumps) from the OBSERVED re-count (COACH-ANSWER ATH-01); TE 0.6 -> 8 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 45/55 bilateral/unilateral (mid-block of 50/50 -> 40/60; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 4.6 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 6: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 11.4 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** The only fully-written athlete year in the workbook (24 week-grids). Template for rotational / overhead sports. High school, college and pro players get the same plan; loads and speeds change per athlete, pros get more care, college players adapt as much as they can, high school players 'just have to do a lot of work' (COACH-ANSWER PRG-09). Thursday = strength (PRG-09).
* **Ground contact / power mix:** class 4 (long); plyo : ballistic target 40% plyo, v1 budget 44%; observed B1 44% / B2 36% / B3 44% plyo side (sets); start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 40/60 (in-season 20/80); contra / ipsi: both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED; frontal/transverse unilateral share 35%
* **Aerobic:** 2 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance + short accelerations / base-running sprints (PER-08); minimal bilateral (UNI-10)
* **Plyo notes:** OBSERVED: lower plyos in Part A Tue/Fri; jumps also replace resistance slots on 'Speed' days ('DB Squat Jumps', 'broad jumps', 'Suitcase DB RFE lunge jumps')
* **Throw notes:** upper ballistics Mon/Thu Part A; rotational scoops 'In-out of hip', half-kneeling slams; throws also sit in the core Part
* **COD notes:** INFERRED for position players: crossover/first-step and lateral shuffles (observed program has none; open question)
* **Season overrides:** in_season: OBSERVED in Block 3 (season reading INFERRED from dates): same 4 days, Part C 4 x 10 (4 x 8 in wk1-2), no OLY, '1x 30 Sec Fast Run' / cal-sprint buy-outs; v1 generator: about 2 lifting days, strength maintenance + accelerations (PER-08), bilateral share 20% (UNI-10), 2 aerobic sessions (ATH-07); numbers = the v1 field_court in_season multipliers (resistance 0.5, core 0.5, PLYO 0.4, THROW 0.6, SPRINT 0.6-0.8 - PROPOSED); the observed 4-day in-season volume is kept as evidence (question 11.2 #14)
* **Still open:** Catcher variant is INFERRED (not asked). The observed year keeps about 55/45 bilateral/unilateral even in-season; v1 applies the coach's rule (minimal bilateral in-season, UNI-10) - confirm for baseball.

### Boxing  (`boxing`)

* **Evidence:** OBSERVED (MASTER_MODEL 'EXAMPLE BOXING 8 WEEK BUILD UP', weeks 3-6 mean = conversion phase; weeks 1-2 = base); v1: COACH-ANSWER ATH-04 (reduce, not cut, pressing / arm volume), ORD-09 (real aerobic block), ATH-01 / ATH-02 (more ballistics; boxing near the bottom of the plyo ranking)
* **Template:** MM BOXING build-up (Mon/Tue/Thu/Fri; medball list Mon/Thu, conditioning first Tue/Fri)
* **Days:** 4 main + 0 optional (Wed/Sat/Sun empty: boxing practice (INFERRED)) - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED weeks 3-6 mean (component sets: every movement in a complex counts its own sets; each medball throw = 1 set of 10)
* **v1 adjustments:** PLYO split into PLYO (plyometric + landings) / JLK (low amplitude) / BALL (ballistic jumps) from the OBSERVED re-count (COACH-ANSWER ATH-01); lower compound sets re-split to 35/65 bilateral/unilateral (mid-block of 40/60 -> 30/70; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); pressing / pulling / arm isolation reduced, not cut: HPUSH 3, VPULL 3, ISO_BICEP 2, ISO_TRICEP 2 (COACH-ANSWER ATH-04; amounts PROPOSED, observed wk3-8 = 0); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED)
* **Why (INFERRED unless stated):** Coach's only fighter program; defines the striker template (base -> conversion), the medball dose and the striker pressing rule. v1: the generator keeps some pressing, pulling and arm work when punching volume is high (ATH-04); the build-up's fast-reactive plyometric contacts (31/week) sit at the top of the boxing range, its other jump contacts are ballistic jumps and landings (v1 re-count).
* **Ground contact / power mix:** class 5 (very long / grounded); plyo : ballistic target 25% plyo, v1 budget 30%; observed 30% plyo side (sets; 92% of plyo-side REPS are low-amplitude squirrel jumps and rope); start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 40/60 -> 30/70 (in-season 20/80); contra / ipsi: contralateral for getting into the hip in stance (INFERRED from CAT-13 COD logic); 'Db contralateral LOW step up' is written in the boxing tab (OBSERVED); frontal/transverse unilateral share 40%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** fight camp: strength maintenance at low volume, conditioning peaks (INFERRED; PER-08 'strength maintenance' for non-speed athletes)
* **Plyo notes:** OBSERVED: high-intensity contacts per session 28-32 (vs 48.7 athletic STARTING); bilateral max-effort jumps (tuck jumps, DB squat jumps, broad jumps) appear only as 5-rep components of the two complexes (L22, L46); outside them the high-amplitude work is 'Weighted Depth Drops' x8 (landing), 'Single Leg to high march jump' 6/6 and 'Drop into Box Jumps' x8. Mix recomputed wk3-6 (298 contacts): 85% vertical / 15% horizontal (broad jumps + high-knee runs) / 0% lateral, 62% unilateral, 8% landings ('Single Leg to high march jump' counted vertical here; under the BASEBALL keyword rule, where 'march jump' = horizontal, the split would be 73/27). v1 ground-contact re-count: of the 113-129 weekly jump contacts only 31 are fast-reactive (tuck jumps, drop into box jumps); the rest are ballistic jumps (66: march jumps, DB squat jumps, broad jumps) and landings (24) - 'more ballistics' for a fighter (COACH-ANSWER ATH-01), and boxing near the bottom of the plyo ranking (ATH-02).
* **COD notes:** OBSERVED 0 COD; footwork and reactive work happen in boxing practice (INFERRED)
* **Season overrides:** camp: INFERRED: PLYO x0.6, rope kept, throws ~230, lifting 2-3 days, pressing still reduced not cut (ATH-04); note: observed wk7 mini-deload, wk8 peak; steps and waves for fight prep (PER-10)
* **SCIENCE:** boxing is predominantly aerobic with high lactate (post-bout ~11.8 mmol/L); elite activity:rest about 18:1

### CrossFit - competitor  (`crossfit_competitor`)

* **Evidence:** OBSERVED (MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' macro grid + FULL TIME table; weekly sets = JULY strength month)
* **Template:** CF macro: plan[quality][month] = level; dose = FULL TIME table
* **Days:** 4 main + 1 optional (MON/TUESD/THURS/FRID core; SAT = extra AEROBIC session in the aerobic level 3-4 months (AUG/SEPT/NOV/DEC/MAY), plus a SAT WOD in MAY (TEST/PEAK month, G144 'YES'); no SAT lifting in any month grid; WED/SUN 'OFF' (OBSERVED)) - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED JULY (STRENGTH L4 6x4 + RESISTANCE L2 with ILLUSTRATIVE 3-exercise LB/UB sessions). Power months (AUG/SEPT/DEC) replace all of it with 20-24 Olympic sets. WOD, skill and aerobic sessions come on top (not sets).
* **v1 adjustments:** lower compound sets re-split to 60/40 bilateral/unilateral (mid-block of 50/50 -> 70/30; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 6: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 0 -> 8: core first every session, 1 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Quality x month x level is the coach's master abstraction; the competitor gets volume progression (add sets), the class member intensification (cut reps). FULL TIME = competitor, HALF TIME = class member (COACH-ANSWER PRG-10). 40-rep / AMRAP sets belong here as an option (VOL-11).
* **Ground contact / power mix:** not applicable - no athletic power block (observed product; plyo work kept as written)
* **Bilateral : unilateral:** 50/50 -> 70/30 (in-season 60/40); contra / ipsi: health accessory (CAT-13 size/strength logic, INFERRED for CrossFit); frontal/transverse unilateral share 10%
* **Aerobic:** OBSERVED by level: 2 / 2 / 3 / 4 aerobic sessions + 1-4 WODs
* **In season (PER-08):** competition season = the macro's TEST / PEAK month (OBSERVED)
* **Plyo notes:** INFERRED: box-jump volume lives inside WODs
* **SCIENCE:** CrossFit injury reviews: shoulder 6.7-40.6% of injuries (gymnastics), low back 12.9-36% (powerlifting movements)
* **Still open:** Number of WODs at 'LVL 4 = wods a week' (not asked).

### Hybrid athlete (strength - athletic - 'crossfitish')  (`hybrid`)

* **Evidence:** OBSERVED ('(NOT DONE) 4 TRACKS PROGRAMMING' HYBRID 8-week, mean of weeks 1-7, assumed sets where blank)
* **Template:** HYBRID-8: Mon squat + clean + 'UNI RDL/ CORE/ UNI GB', Tue sprint + bench/core + jumps, Thu deadlift + snatch + lunge/row/core, Fri easy cardio + jumps + 'uni RDL/ core/ OH press', Sat squat + lunge/T2B/press tri-set; an 'AMRAP' 12 -> 20 row (row 70) is not tied to any day
* **Days:** 5 main + 0 optional (WED/SUN off (INFERRED from absence)) - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED HYBRID-8 assumed buckets, weeks 1-7 mean (accessories = FOCUS)
* **v1 adjustments:** ISO_CALF 0 -> 9: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED)
* **Why (INFERRED unless stated):** Observed general 'athletic gym' product.
* **Ground contact / power mix:** not applicable - no athletic power block (observed product; plyo work kept as written)
* **Bilateral : unilateral:** observed; contra / ipsi: -; frontal/transverse unilateral share 10%
* **Aerobic:** OBSERVED A 1 (Tue sprint intervals) + C 1 (Fri '15-40 min' easy = a real aerobic block, ORD-09)
* **Still open:** What does the 'AMRAP' row 12..20 apply to?

### Powerlifting / max strength  (`powerlifting_strength`)

* **Evidence:** OBSERVED ('(NOT DONE) 4 TRACKS PROGRAMMING' STRENGTH-8 conjugate, mean of loading weeks; STRENGTH-12 as variant)
* **Template:** STRENGTH-8: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival'; Mon lower M.E., Wed upper M.E., Thu plyo + lower D.E., Sat upper D.E.
* **Days:** 4 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED STRENGTH-8 v04 loading-week means (squat-week / hinge-week alternation averaged)
* **v1 adjustments:** lower compound sets re-split to 70/30 bilateral/unilateral (mid-block of 50/50 -> 90/10; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 6: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 0 -> 8: core first every session, 1 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Coach's conjugate-style product for strength clients.
* **Ground contact / power mix:** not applicable - no athletic power block (observed product; plyo work kept as written)
* **Bilateral : unilateral:** 50/50 -> 90/10; contra / ipsi: contra / ipsi lunges and step-ups as health accessories in weeks 1-4, then bilateral; kept later only if something bugs the lifter (COACH-ANSWER CAT-13); frontal/transverse unilateral share 5%
* **Aerobic:** 2 colour-C sessions/week (PROPOSED - strength clients are not covered by ATH-07)
* **In season (PER-08):** meet peak (INFERRED)
* **Axial loading (PER-04):** the coach loads the spine about once a week (squat one day, leg press / belt squat the other; deadlifts also load the spine). OBSERVED STRENGTH-8 squats twice in a squat week (Mon M.E. + Thu D.E. box squat) and pulls in the hinge week; v1 generator: the second lower day uses a non-axial knee-dominant lift (belt squat / leg press) unless the lifter is peaking for a meet and must practise the squat (INFERRED - question 11.2 #16)

### Bodybuilding / aesthetics  (`bodybuilding_aesthetics`)

* **Evidence:** OBSERVED (BYOP 'AESTHETICS - FULL BODY - 4 DAYS' coach convention + optional days; MM AESTHETICS-8/12 and PPL as variants)
* **Template:** BYOP AESTHETICS 4-day A/B/OPT (A: Calves, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Bicep, Leg Extensions; B: Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, Tricep, ABdution)
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED slot skeleton; set counts ASSUMED from the coach's PARTIAL fill (Day 1 complete: calves 3 x '15 Reps', compounds 3, 'Ez Bar Curls' / 'Leg Extensions' 2 x '20 Reps'; Day 2 only 'DB Deadlifts' 3, 'Push Ups ' 3, 'DB Push press' 5 x '6 to 8 Reps' and a set-less 'Staggered Stance DL w/ DB '; Days 3-4 and both 'Optional' blocks unfilled) extrapolated to every slot
* **v1 adjustments:** lower compound sets re-split to 65/35 bilateral/unilateral (mid-block of 50/50 -> 80/20; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 6 -> 8: core first every session, 1 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Defines the resistance skeleton every other template reuses.
* **Ground contact / power mix:** not applicable - no athletic power block (medball only as a warm-up for aesthetics clients, ATH-05)
* **Bilateral : unilateral:** 50/50 -> 80/20; contra / ipsi: contra / ipsi accessories mostly in the first 2-4 weeks, then mostly bilateral (COACH-ANSWER CAT-13); same-pattern pairing (squat + lunge) to drive the muscle (UNI-06); frontal/transverse unilateral share 10%
* **Aerobic:** 4 sessions/week; long walks after workouts - COACH-ANSWER ATH-07
* **SCIENCE:** Schoenfeld 2017: graded dose-response up to ~10+ sets/muscle/week

### Fat loss / body toning  (`fat_loss`)

* **Evidence:** OBSERVED (MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO' weeks 1-4 mean incl. circuits; BYOP BOOTCAMP options as variants)
* **Template:** FAT BURN: Mon lower, Tue upper, Wed cardio, Thu lower, Fri upper, Sat cardio; 2 'CIRCUITS RECCOMENDED' per week
* **Days:** 4 main + 2 optional (Wed/Sat '30-40 mi slow/steady CARDIO') - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments); OBSERVED lifting block + circuit stations (round count applied to every station), weeks 1-4 mean
* **v1 adjustments:** lower compound sets re-split to 50/50 bilateral/unilateral (mid-block of 50/50 -> 50/50; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 6: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED)
* **Why (INFERRED unless stated):** Fat loss = hypertrophy lifting + steady cardio + metabolic circuits (OBSERVED).
* **Ground contact / power mix:** not applicable - no athletic power block (medball only as a warm-up for aesthetics clients, ATH-05)
* **Bilateral : unilateral:** 50/50 -> 50/50; contra / ipsi: cross-pattern pairing so clients are less sore and can train more often (COACH-ANSWER UNI-06); frontal/transverse unilateral share 20%
* **Aerobic:** 3 sessions/week - COACH-ANSWER ATH-07

### Basketball  (`basketball`)

* **Evidence:** INFERRED (no basketball program in the sheets). Ordering anchor OBSERVED in the coach's own words: 'basketball players need more plyos'.
* **Template:** BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (4 main x 10 slots + Wed/Sat optional) with a SPRINT slot added
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 17.5 / JLK 5 / BALL 12.5 / THROW 10 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 3 (target plyo share 50%, PROPOSED); TE 6 -> 8 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 15/85 bilateral/unilateral (mid-block of 20/80 -> 10/90; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 4 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 8 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Highest jump and landing frequency of the team sports, short accelerations and constant lateral COD -> the top plyo tier and a high COD tier, moderate throws.
* **Ground contact / power mix:** class 3 (mixed); plyo : ballistic target 50% plyo, v1 budget 50%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 20/80 -> 10/90 (in-season 10/90); contra / ipsi: contralateral 'a lot' for getting into and out of the hip (COACH-ANSWER CAT-13); frontal/transverse unilateral share 45%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** guards: sprint exposures; bigs: high jumps at low volume; everyone: strength maintenance (PER-08)
* **Plyo notes:** Plyo slots: 2 per A day and 2 per B day (template has 2 + 1). Count game jumps in-season: backcourt ~41, frontcourt ~79 jumps per game.
* **Throw notes:** moderate medball volume (COACH-ANSWER ATH-05): chest pass / overhead / step-forward throws; rotational for contact strength
* **COD notes:** defensive slides (library 'Shuffles' L13), closeouts, 5-10-5 (date-coerced cell L92 = 5/10/05, LIB-01); route-tree names tiered by turn angle (ATH-06); ~1,000 movement changes per game
* **Season overrides:** in_season: {"PLYO": 0.35, "JLK": 0.6, "COD": 0.3, "SPRINT": 0.5, "resistance": 0.7, "days": "2-3 lifts/week"}; pre_intensify: {"PLYO": 1.0, "note": "already at T5: shift mix toward reactive/unilateral rather than more contacts"}
* **SCIENCE:** time-motion: backcourt 41 +/- 6, frontcourt 79 +/- 5 jumps per game; ~1,050 activity changes per game, ~5% of live time sprinting; jumper's knee prevalence 31.9% in basketball (Lian 2005); NSCA plyo volume guide 80-100 / 100-120 / 120-140 contacts per session (beginner / intermediate / advanced)

### Volleyball  (`volleyball`)

* **Evidence:** INFERRED (no volleyball program in the sheets)
* **Template:** BYOP ATHLETIC 4-day; second A-day plyo slot = approach/block jump; ISO_REAR added for the hitting shoulder
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 19 / JLK 6.5 / BALL 9 / THROW 8 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 2 (target plyo share 60%, PROPOSED); TE 6 -> 8 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 35/65 bilateral/unilateral (mid-block of 40/60 -> 30/70; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); CORE 8 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Jump frequency per match rivals basketball but vertical/bilateral and with less running -> top plyo tier, low sprint/COD, shoulder care. Coach confirms basketball = volleyball at the top of the plyo ranking (ATH-02).
* **Ground contact / power mix:** class 2 (short); plyo : ballistic target 60% plyo, v1 budget 60%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 40/60 -> 30/70 (in-season 20/80); contra / ipsi: contralateral for lateral block footwork (INFERRED from CAT-13); frontal/transverse unilateral share 30%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** high jumps at low volume + strength maintenance (PER-08); count match jumps first
* **Plyo notes:** vertical, mostly bilateral approach/block takeoffs; setters jump the most per point (~0.6-0.7 jumps/point)
* **Throw notes:** overhead slams / overhead throws (spike pattern) + rotational
* **COD notes:** short lateral shuffles, block footwork, dig reactions
* **Season overrides:** in_season: {"PLYO": 0.3, "JLK": 0.5, "resistance": 0.7, "note": "match/practice jumps dominate"}
* **SCIENCE:** hitters 19.7-80, middles 52.5-77.2, setter ~104.5 jumps per match (semi-pro male); jumper's knee prevalence 44.6% in elite volleyball (Lian 2005); shoulder overuse mostly from spiking

### American football - skill (WR / DB / RB)  (`football_skill`)

* **Evidence:** INFERRED. Note: the coach's COD library is mostly the receiver route tree ('FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL') plus 'Shuffles', 'LEFT TEST' (INFERRED: L-test) and a date-coerced 5-10-5 cell - OBSERVED.
* **Template:** BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 14 / JLK 6 / BALL 5.5 / THROW 8 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 2 (target plyo share 60%, PROPOSED); TE 6 -> 8 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 15/85 bilateral/unilateral (mid-block of 20/80 -> 10/90; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 8 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Highest sprint and route-COD demand; short 5-6 s plays with long rests -> alactic conditioning, horizontal/lateral plyos.
* **Ground contact / power mix:** class 2 (short); plyo : ballistic target 60% plyo, v1 budget 60%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 20/80 -> 10/90 (in-season 10/90); contra / ipsi: contralateral for route cuts (COACH-ANSWER CAT-13: 'football players ... running and changing directions, routes'); ipsilateral step-ups for acceleration (CAT-13); frontal/transverse unilateral share 40%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** sprints (speed athletes, PER-08) + strength maintenance
* **Throw notes:** moderate medball volume (COACH-ANSWER ATH-05)
* **COD notes:** route tree EASY -> MOD. -> HARD TURN for every athlete (COACH-ANSWER ATH-06); DBs: backpedal-break and reactive mirror
* **Season overrides:** in_season: {"PLYO": 0.4, "COD": 0.3, "SPRINT": 0.5, "resistance": 0.75, "days": "2 lifts (Mon/Tue after game + Wed/Thu)"}
* **SCIENCE:** play duration ~5.3-5.7 s, rest ~33 s between plays, exercise:rest ~1:5.9; Nordic programmes cut hamstring injuries up to 51%

### American football - big skill (LB / TE / FB / S)  (`football_big_skill`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 11.5 / JLK 4 / BALL 6.5 / THROW 9 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 3 (target plyo share 50%, PROPOSED); TE 9 -> 10 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 25/75 bilateral/unilateral (mid-block of 30/70 -> 20/80; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 8 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Between skill players and linemen on every dial.
* **Ground contact / power mix:** class 3 (mixed); plyo : ballistic target 50% plyo, v1 budget 50%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 30/70 -> 20/80 (in-season 10/90); contra / ipsi: contralateral for COD (CAT-13), ipsilateral for acceleration; frontal/transverse unilateral share 35%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance + short accelerations (PER-08)
* **Throw notes:** moderate medball volume (COACH-ANSWER ATH-05)
* **Season overrides:** in_season: {"PLYO": 0.4, "COD": 0.3, "resistance": 0.75}

### American football - linemen (OL / DL)  (`football_lineman`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day with fewer plyo slots and more resistance slots
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 5.5 / JLK 1 / BALL 0 / THROW 10 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 4 (target plyo share 40%, PROPOSED); TE 9 -> 10 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 45/55 bilateral/unilateral (mid-block of 50/50 -> 40/60; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 8 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** 'Some need more resistance training' end of the athlete spectrum.
* **Ground contact / power mix:** class 4 (long); plyo : ballistic target 40% plyo, v1 budget 39%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 40/60 (in-season 30/70); contra / ipsi: health accessory (INFERRED); frontal/transverse unilateral share 30%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance (PER-08)
* **Throw notes:** moderate medball volume (COACH-ANSWER ATH-05); chest pass / squat-to-chest pass = punch/strike pattern
* **COD notes:** 5-10 yd, kick-slide, pull-and-turn
* **Season overrides:** in_season: {"resistance": 0.8, "PLYO": 0.5}

### Soccer (outfield)  (`soccer`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 12 / JLK 6 / BALL 9 / THROW 3 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 2 (target plyo share 60%, PROPOSED); TE 3 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 15/85 bilateral/unilateral (mid-block of 20/80 -> 10/90; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 9 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Most turns and running of any sport here; hamstring and groin are the dominant injury drivers.
* **Ground contact / power mix:** class 2 (short); plyo : ballistic target 60% plyo, v1 budget 60%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 20/80 -> 10/90 (in-season 10/90); contra / ipsi: contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration; frontal/transverse unilateral share 45%
* **Aerobic:** 3.5 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** sprints (max velocity weekly, hamstring protection) + strength maintenance (PER-08)
* **COD notes:** ~726 turns per match, 609 of them 0-90 degrees -> most work in EASY/MOD. TURN plus reactive
* **Season overrides:** in_season: {"PLYO": 0.4, "COD": 0.3, "SPRINT": 0.8, "resistance": 0.6, "days": "2 lifts/week (MD+2 strength, MD-3/4 power)"}
* **SCIENCE:** 726 +/- 203 turns per match (EPL); Copenhagen programme -41% groin problems; Nordic programmes -51% hamstring injuries

### Softball  (`softball`)

* **Evidence:** INFERRED from OBSERVED BASEBALL (same skeleton) + SCIENCE on windmill pitching
* **Template:** MM BASEBALL 4-day Parts A-E
* **Days:** 4 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 7 / JLK 4 / BALL 0 / THROW 18 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 4 (target plyo share 40%, PROPOSED); TE 1 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 45/55 bilateral/unilateral (mid-block of 50/50 -> 40/60; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 4 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 3 -> 6: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 11 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Same rotational / overhead demands as baseball; landing work is set by landing competency and injury history, never by sex (COACH-ANSWER ATH-09).
* **Ground contact / power mix:** class 4 (long); plyo : ballistic target 40% plyo, v1 budget 38%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 40/60 (in-season 20/80); contra / ipsi: as baseball (INFERRED); frontal/transverse unilateral share 35%
* **Aerobic:** 2 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance + accelerations (PER-08)
* **Season overrides:** in_season: v1 field_court in_season multipliers (about 2 lifting days, low volume - COACH-ANSWER PER-08; numbers PROPOSED); bilateral share 20% (UNI-10)
* **SCIENCE:** windmill pitching produces shoulder/elbow loads comparable to baseball pitching

### Ice hockey (skaters)  (`hockey`)

* **Evidence:** INFERRED
* **Template:** BYOP ATHLETIC 4-day; lateral plyo emphasis; Copenhagen fixed
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 5 / JLK 4 / BALL 5 / THROW 8.5 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 4 (target plyo share 40%, PROPOSED); TE 6 -> 8 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 15/85 bilateral/unilateral (mid-block of 20/80 -> 10/90; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 9 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Skating = hip extension + abduction + external rotation -> frontal/transverse priority; adductor deceleration drives groin strains.
* **Ground contact / power mix:** class 4 (long); plyo : ballistic target 40% plyo, v1 budget 40%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 20/80 -> 10/90 (in-season 10/90); contra / ipsi: contralateral for crossovers and lateral pushes (INFERRED from CAT-13); frontal/transverse unilateral share 50%
* **Aerobic:** 3.5 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance (PER-08)
* **Throw notes:** rotational scoops / side slams = shot pattern
* **COD notes:** on-land transfer is limited; agility lives on the ice
* **Season overrides:** in_season: {"PLYO": 0.5, "resistance": 0.7, "days": "2 lifts/week"}
* **SCIENCE:** shifts 30-80 s with 4-5 min recovery; pre-season adduction strength 18% lower in players who later had groin injuries

### Tennis (and racket sports)  (`tennis`)

* **Evidence:** INFERRED
* **Template:** MM BASEBALL-style Parts (upper ballistics + lower ballistics days, core by plane) or BYOP ATHLETIC 4-day
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 8.5 / JLK 9 / BALL 0 / THROW 17.5 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 3 (target plyo share 50%, PROPOSED); TE 3 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 15/85 bilateral/unilateral (mid-block of 20/80 -> 10/90; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); CORE 9 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Rotation both directions + lateral COD + overhead serve -> high throws (transverse), high COD, frontal/transverse priority.
* **Ground contact / power mix:** class 3 (mixed); plyo : ballistic target 50% plyo, v1 budget 50%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 20/80 -> 10/90 (in-season 10/90); contra / ipsi: contralateral 'definitely' (COACH-ANSWER CAT-13); frontal/transverse unilateral share 50%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance; tournament weeks = 1-2 short sessions (INFERRED)
* **Throw notes:** high medball volume (COACH-ANSWER ATH-05): forehand/backhand rotational scoops both sides + overhead (serve)
* **COD notes:** 1.6-4 direction changes per point, every ~3 s
* **Season overrides:** in_season: {"PLYO": 0.5, "COD": 0.4, "resistance": 0.7, "note": "tournament weeks = 1-2 short sessions"}
* **SCIENCE:** players change direction ~1.6 times per point (every ~2.7-3.1 s); elbow 21.4%, shoulder 19.4%, lumbar 17.3% of tennis injuries

### Golf  (`golf`)

* **Evidence:** INFERRED
* **Template:** 3-day full body (UPPER/LOWER-style) with BASEBALL-style rotational medball block
* **Days:** 3 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 1.5 / JLK 3.5 / BALL 0 / THROW 17.5 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 5 (target plyo share 25%, PROPOSED); TE 3 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 25/75 bilateral/unilateral (mid-block of 30/70 -> 20/80; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 9: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 3 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 9 -> 12: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Clubhead speed tracks rotational power and lower-body RFD; the coach's into/out-of-hip medball matrix is the most golf-specific tool in the library.
* **Ground contact / power mix:** class 5 (very long / grounded); plyo : ballistic target 25% plyo, v1 budget 22%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 30/70 -> 20/80 (in-season 20/80); contra / ipsi: into / out of the hip loaded lunges and step-ups ('GET INTO THE HIP' / 'GET OUT OF THE HIP'), lead leg into, trail leg out (INFERRED); frontal/transverse unilateral share 40%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance; none the day before a round
* **Throw notes:** high medball volume (COACH-ANSWER ATH-05): half-kneeling 2x2 matrix 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP', 'OUT OF THE LEFT LEG/HIP', 'INTO THE RIGHT LEG/HIP' (ballistics D65-D68), step-back rotational chest pass
* **Season overrides:** in_season: {"THROW": 0.6, "resistance": 0.7, "days": "2 sessions, none the day before a round"}
* **SCIENCE:** rotational power correlates with clubhead speed; low back is the most common golf injury; lumbar compression up to ~8x body weight

### Track sprinter (100-200 m; jumpers as variant)  (`track_sprinter`)

* **Evidence:** INFERRED (sprint itself is the sport; the S&C profile is what the generator writes)
* **Template:** BYOP ATHLETIC 4-day with SPRINT slots as the anchor
* **Days:** 4 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 14.5 / JLK 9.5 / BALL 3 / THROW 5 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 1 (target plyo share 75%, PROPOSED); TE 9 -> 10 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 35/65 bilateral/unilateral (mid-block of 40/60 -> 30/70; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 6 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 8 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Sprinting is the S&C priority; plyos are horizontal and stiffness-oriented; hamstrings are the injury driver. Speed / power group (COACH-ANSWER ATH-03): more plyos than ballistics, 'even though they will have ballistics' (ATH-01); ipsilateral step-ups for the take-off (CAT-13); sprints in season (PER-08).
* **Ground contact / power mix:** class 1 (very short); plyo : ballistic target 75% plyo, v1 budget 75%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 40/60 -> 30/70 (in-season 20/80); contra / ipsi: ipsilateral step-ups for the acceleration take-off ('get out of the hip', COACH-ANSWER CAT-13); frontal/transverse unilateral share 10%
* **Aerobic:** 2 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** sprints (COACH-ANSWER PER-08); jumpers: high jumps
* **Throw notes:** overhead backward / forward throws = triple extension
* **Season overrides:** in_season: {"PLYO": 0.5, "resistance": 0.6, "TE": 0.5}
* **SCIENCE:** most hamstring strains occur in late swing at high speed; Nordic programmes -51%

### Distance runner (5 km - marathon)  (`distance_runner`)

* **Evidence:** INFERRED + OBSERVED analog (Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' + 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.')
* **Template:** 2-3 strength sessions/week + the running plan (Sheet24: 2 runs/week x 21 weeks)
* **Days:** 3 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 2.5 / JLK 9 / BALL 4 / THROW 0 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 1 (target plyo share 75%, PROPOSED); TE 0 -> 2 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 20/80 bilateral/unilateral (mid-block of 20/80 -> 20/80; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 6 -> 9: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 6 -> 12: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Strength and plyos are there for running economy and tissue capacity, not mass. PRG-12: the Chris Hinshaw half-marathon plan is used as-is, for the half marathon only. LIB-18: the cardio list's '21.6 mile run' is what the coach calls 'a marathon' - flag: a marathon is 26.2 mi (42.2 km).
* **Ground contact / power mix:** class 1 (very short); plyo : ballistic target 75% plyo, v1 budget 74%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 20/80 -> 20/80 (in-season 10/90); contra / ipsi: ipsilateral step-ups for push-off (INFERRED); frontal/transverse unilateral share 15%
* **Aerobic:** the running plan is the aerobic work (OBSERVED Sheet24: 2 runs/week; PROPOSED 3rd easy session) (in season run plan)
* **In season (PER-08):** race season: strength 1x/week maintenance (INFERRED)
* **SCIENCE:** strength (high load) + plyometric training 2-3x/week for 8-12 weeks improves running economy

### Kickboxing / Muay Thai  (`kickboxing_muay_thai`)

* **Evidence:** INFERRED from OBSERVED boxing template
* **Template:** MM BOXING build-up structure
* **Days:** 4 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 4 / JLK 5 / BALL 3 / THROW 24 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 5 (target plyo share 25%, PROPOSED); lower compound sets re-split to 25/75 bilateral/unilateral (mid-block of 30/70 -> 20/80; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 12 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Boxing plus kicks and clinch: more single-leg, frontal and transverse work, neck.
* **Ground contact / power mix:** class 5 (very long / grounded); plyo : ballistic target 25% plyo, v1 budget 25%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 30/70 -> 20/80 (in-season 20/80); contra / ipsi: contralateral (INFERRED from CAT-13); frontal/transverse unilateral share 45%
* **Aerobic:** 3.5 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** fight camp strength maintenance (PER-08)
* **COD notes:** angles, pivots, in-out
* **SCIENCE:** elite kickboxing HIA 2.2 s, LIA 2.3 s, pauses 5.4 s; fighting:non-fighting 1:1

### Karate / Taekwondo  (`karate_taekwondo`)

* **Evidence:** INFERRED; ordering anchor OBSERVED in coach's words ('boxers and karate athletes don't need that many plyos')
* **Template:** MM BOXING build-up structure
* **Days:** 4 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 3 / JLK 5 / BALL 4 / THROW 20 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 5 (target plyo share 25%, PROPOSED); TE 3 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 25/75 bilateral/unilateral (mid-block of 30/70 -> 20/80; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 3 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 10 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Coach: 'the more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos' (ATH-01) and boxing = karate near the bottom of the plyo ranking (ATH-02) -> long ground-contact class, plyometric P1, high throws. v1 lowers the v0 low-amplitude bounce target (200-260 -> 80-120): stance bounce is practised in the sport itself (INFERRED).
* **Ground contact / power mix:** class 5 (very long / grounded); plyo : ballistic target 25% plyo, v1 budget 25%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 30/70 -> 20/80 (in-season 20/80); contra / ipsi: contralateral (INFERRED); frontal/transverse unilateral share 45%
* **Aerobic:** 3.5 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance (PER-08)
* **SCIENCE:** karate official matches: high-intensity actions 1.5 s, effort 10 s / rest 16 s; taekwondo effort 8 s / pause 8 s (1:1)

### MMA  (`mma`)

* **Evidence:** INFERRED; ordering anchor OBSERVED in coach's words ('MMA fighters need a lot more plyos [than boxers], not as much as basketball')
* **Template:** MM BOXING build-up structure + grappling pull/grip/neck
* **Days:** 4 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 10 / JLK 6 / BALL 6.5 / THROW 17.5 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 4 (target plyo share 40%, PROPOSED); lower compound sets re-split to 35/65 bilateral/unilateral (mid-block of 40/60 -> 30/70; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 10 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** MMA above tennis and below soccer on plyos (COACH-ANSWER ATH-02); fighters get 'a lot more ballistics and plyos' (ATH-01); adds grappling pulling, grip, neck and horizontal (shot) power.
* **Ground contact / power mix:** class 4 (long); plyo : ballistic target 40% plyo, v1 budget 40%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 40/60 -> 30/70 (in-season 20/80); contra / ipsi: contralateral for level changes and sprawls (INFERRED from CAT-13); frontal/transverse unilateral share 45%
* **Aerobic:** 4 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** fight camp strength maintenance (PER-08)
* **Throw notes:** high medball volume (COACH-ANSWER ATH-05): rotational + overhead slams (ground-and-pound / takedown finish)
* **SCIENCE:** MMA high:low intensity ~1:2-1:4; grappling ~1:1, striking up to 1:7

### Wrestling  (`wrestling`)

* **Evidence:** INFERRED
* **Template:** MM BOXING build-up structure with pulling, grip, neck, carries/drags
* **Days:** 4 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 4.5 / JLK 2.5 / BALL 3.5 / THROW 17.5 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 5 (target plyo share 25%, PROPOSED); lower compound sets re-split to 45/55 bilateral/unilateral (mid-block of 50/50 -> 40/60; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 10 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Pulling, grip, neck and relative strength dominate; plyos are horizontal and moderate. 'More resistance' group (COACH-ANSWER ATH-03); wrestling / BJJ rank above boxing / karate on plyos (ATH-02).
* **Ground contact / power mix:** class 5 (very long / grounded); plyo : ballistic target 25% plyo, v1 budget 25%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 40/60 (in-season 30/70); contra / ipsi: health accessory (INFERRED); frontal/transverse unilateral share 35%
* **Aerobic:** 4 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance (PER-08)
* **Throw notes:** rotational slams + overhead backward throws (suplex pattern)
* **COD notes:** shot/sprawl reactions
* **SCIENCE:** neck-injured wrestlers show weaker neck flexion/extension; cervical work is mostly eccentric/isometric

### BJJ / submission grappling  (`bjj_grappling`)

* **Evidence:** INFERRED
* **Template:** 3-day strength + grip/neck accessories
* **Days:** 3 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 5 / JLK 1 / BALL 8 / THROW 10 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 5 (target plyo share 25%, PROPOSED); TE 3 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 45/55 bilateral/unilateral (mid-block of 50/50 -> 40/60; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 9: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 9 -> 12: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Least ballistic combat sport: strength, grip and isometric endurance.
* **Ground contact / power mix:** class 5 (very long / grounded); plyo : ballistic target 25% plyo, v1 budget 25%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 40/60 (in-season 30/70); contra / ipsi: health accessory (INFERRED); frontal/transverse unilateral share 30%
* **Aerobic:** 3 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** strength maintenance (PER-08)
* **SCIENCE:** BJJ demands high handgrip strength/endurance and isometric low-back strength; moderate glycolytic demand

### General population / longevity  (`general_population`)

* **Evidence:** INFERRED from OBSERVED UPPER/LOWER + BOOTCAMP 1 (full-body sessions) + SCIENCE (NSCA older-adult position); v1: COACH-ANSWER ATH-07 (3 aerobic sessions), ATH-09 (older: few plyos unless asked), EQ-03 (constrained machines; never OHS / snatch / low-bar / depth jumps)
* **Template:** BOOTCAMP OPTION 1-style full body (each session = knee + hip, push + pull, bilateral + unilateral)
* **Days:** 3 main + 2 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 0 / JLK 1 / BALL 0 / THROW 3 sets (no sport ground-contact class - plyos only if the client asks, ATH-09; the residual low ankle hops and light medball throws were split with the class-5 default of 25% plyo, PROPOSED); lower compound sets re-split to 50/50 bilateral/unilateral (mid-block of 50/50 -> 50/50; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 2 -> 9: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED)
* **Why (INFERRED unless stated):** Health and longevity: strength + power + balance + aerobic base; athletic patterns only as movement literacy.
* **Ground contact / power mix:** not a sport profile: plyos only if the client asks (COACH-ANSWER ATH-09); power work = light medball throws (ballistic) + low ankle hops
* **Bilateral : unilateral:** 50/50 -> 50/50; contra / ipsi: cross-pattern pairing, less soreness (UNI-06); contralateral lunges as the default variant (INFERRED); frontal/transverse unilateral share 20%
* **Aerobic:** 3 sessions/week - COACH-ANSWER ATH-07
* **Throw notes:** light medball chest pass / scoop as power training
* **COD notes:** stepping / shuffles for balance
* **SCIENCE:** NSCA older adults: 2-3 days/week, 2-3 sets per major muscle group, power at 40-60% 1RM

### Youth athlete (multi-sport, pre/circa/post-PHV)  (`youth_athlete`)

* **Evidence:** INFERRED + SCIENCE (Lloyd & Oliver)
* **Template:** BYOP ATHLETIC 4-day cut to 2-3 days, mostly FOUNDATIONAL library blocks (levels are still theoretical, CAT-05)
* **Days:** 3 main + 0 optional - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** INFERRED set budget (analyst), sized to the coach's observed session budget; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 8.5 / JLK 4 / BALL 6.5 / THROW 6 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 3 (target plyo share 50%, PROPOSED); TE 2 -> 4 sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED); lower compound sets re-split to 50/50 bilateral/unilateral (mid-block of 50/50 -> 50/50; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 0 -> 9: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 2: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 6 -> 12: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Exposure to every athletic pattern at foundational levels; landing competency before rebound volume.
* **Ground contact / power mix:** class 3 (mixed); plyo : ballistic target 50% plyo, v1 budget 50%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 50/50 (in-season 40/60); contra / ipsi: both, light (INFERRED); frontal/transverse unilateral share 30%
* **Aerobic:** 2 sessions/week off-season (PROPOSED - ATH-07 fixes only the in-season count) / in season 2 (COACH-ANSWER ATH-07)
* **In season (PER-08):** sport season: 1-2 short sessions, strength maintenance (INFERRED)
* **COD notes:** games-based, tag, reactive
* **Season overrides:** circa_PHV: {"PLYO": 0.6, "SPRINT": 0.8, "resistance": 1.0}
* **SCIENCE:** two plyo sessions/week suffice for low training age; 3-4 once competent (Lloyd & Oliver)

### All-around athletic / weekend warrior (non-competitive adults and youth)  (`weekend_warrior`)

* **Evidence:** COACH-ANSWER ATH-13 (the program was 'for weekend warriors: people that wanted to be athletic, but they didn't need to compete ... a good mix of everything') + OBSERVED slots (BYOP 'ATHLETIC - FULL BODY - 4 DAYS A') + the PARTIAL fill of the weekend-warrior tab (sheet tab name 'JUSTICE LEAGUE', a marketing name - ATH-13): Monday's 10 slots and Tuesday's plyo slot at 2 sets, Thursday 'Low Bar Back Squat' with no sets, the other 38 of 50 weekly slots 'CHOOSE 👇' - '2 sets per slot' is the coach's athletic-template default (VOL-16); MM 'EXAMPLE ATHLETIC FULL BODY SPLI' as level ladder
* **Template:** BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
* **Days:** 4 main + 2 optional (title of hidden copy: '4 to 6 DAYS A WEEK') - optional days can be add-ons or separate days, ideally separate (ORD-10)
* **Weekly sets source:** OBSERVED (computed from the program decode volume JSON); v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)
* **v1 adjustments:** power block rebuilt: PLYO 10 / JLK 2 / BALL 4 / THROW 8 sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class 3 (target plyo share 50%, PROPOSED); lower compound sets re-split to 45/55 bilateral/unilateral (mid-block of 50/50 -> 40/60; COACH-ANSWER UNI-02 anchors, sport values PROPOSED); ISO_CALF 4 -> 12: 3 sets every leg day (COACH-ANSWER VOL-17); ISO_REAR 0 -> 4: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED); CORE 4 -> 16: core first every session, 2 exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)
* **Why (INFERRED unless stated):** Non-competitive athletic adults (and youth, kids): 'good health all around and just having a body that performs well' (COACH-ANSWER ATH-13). Also the fallback for a recreational player of any sport (GEN-02: recreational -> general sport only, no position / season). Competitive athletes whose sport has no profile use the nearest sport profile by ground-contact class and ATH-03 group (PROPOSED).
* **Ground contact / power mix:** class 3 (mixed); plyo : ballistic target 50% plyo, v1 budget 50%; start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)
* **Bilateral : unilateral:** 50/50 -> 40/60; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED); frontal/transverse unilateral share 30%
* **Aerobic:** 3 sessions/week - COACH-ANSWER ATH-07 general rule (treating non-competitive weekend warriors as 'general' clients is INFERRED)

## 7. Season families (phase multipliers on the baseline)

### field_court - basketball, volleyball, American football, soccer, baseball, softball, hockey, tennis, track sprint (as 'competition' season)

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| off_early_GPP | 2-4 after the post-season | PLYO 0.5, JLK 0.8, BALL 1.0 (programs start more ballistic - CAT-10; PROPOSED), THROW 0.8, COD 0.5, SPRINT 0.5, TE 0.5, resistance 1.0, core 1.0 | plyo method stage 1 'receive and pause' (stick the landing) and a BALLISTIC-biased power mix (programs start more ballistic - COACH-ANSWER CAT-10); bilateral : unilateral at the block-start value; contra / ipsi accessories (CAT-13); COD 'EASY TURN' only; Olympic L1 variants (DB / KB snatch, hang pulls) - ATH-10; rep zone VOL 1 (PER-11); conditioning C + B (build the base) | INFERRED from OBSERVED boxer wk1-2 base (3x10, zero plyos), MM athletic STARTING notes A41-A45 'Bring athletes back to feeling/moving great', BASEBALL B1 '12/10/8/8' |
| off_build | 4-8 | PLYO 1.0, JLK 1.0, BALL 1.0, THROW 1.0, COD 1.0, SPRINT 1.0, TE 1.0, resistance 1.0, core 1.0 | rep zone VOL 1 -> VOL 2 ('12/10/8/8' pyramids) - PER-11 confirmed for all athletes; plyo method stage 2 'receive then create'; Olympic lifts are STANDARD, not optional (COACH-ANSWER ATH-10): L1 variants or full lifts by level; contrast / complexes for L2+ athletes (ATH-12: off-season only, ~78-85%); new weekly exercise menu each week in the observed baseball block (BASEBALL B1 menu overlap <= 0.15); the generator default is the coach's block rule instead: exercises fixed for 4-6 weeks, small variables change between blocks (PER-02); day tags 'Speed' Mon / 'strength' Tue / 'speed' Fri (OBSERVED); Thursday = strength (PRG-09) | OBSERVED BASEBALL Block 1 (the block itself carries no season label; reading it as off/soft season is INFERRED from its 2022 cell dates against the coach's calendars) |
| pre_intensify | 4-8 ending 1 week before first game | v1 generator (COACH-ANSWER PER-08: pre-season = more speed / power, LESS volume; numbers PROPOSED): PLYO 1.2 capped at the top of the profile's plyometric band, JLK 0.9, BALL 1.0, THROW 1.0, COD 1.1 (INFERRED), SPRINT up to +50% metres for sprint-heavy sports (INFERRED cap), TE standard, not optional (COACH-ANSWER ATH-10): %-based 75 -> 80 -> 85 -> 90% at 4x8 -> 4x6 -> 4x6 -> 4x4 (PER-09 confirmed), resistance 0.8, core 1.0 (core-first dose unchanged) - computed on the 12 field-court profiles, weekly sets fall about 3-12%. OBSERVED baseball Block 2 (evidence only, retired as the default because it ADDS about 16% volume): PLYO 1.45 (high contacts 151/103), JLK 0.9 (89/97), THROW 1.1 (192/178), SPRINT 3.0 (sets 1.0 -> 3.1 on a small base), resistance 1.08 (RP+ISO ~72 -> ~78) rising +3-4%/week for the last 3 loading weeks, core 1.35 (11.4 -> 15.6 sets) | rep zone VOL 3 and below ('8/6/4/4', '6/6/5/4', '4/4/4/4'); contrast and complexes ('Heavy front squats' + 'KB squat cleans'; '5 of each' x 5 rounds) - L2+ athletes only (ATH-12 says 'off-season only': v1 treats this pre-season build as the late off-season because the coach's own block 2 uses contrast - INFERRED, question 11.2 #12; never in season); OBSERVED baseball: Part C/D sets 4 -> 5 for the last 3 weeks; final week = DELOAD: resistance -31%, all sets -46%, athletic 1-2 sets, no buy-out, no OLY, 3 x 8 everywhere (B2 'DELOAD WEEK'); COD adds 'MOD. TURN' / 'HARD TURN' and reactive agility (INFERRED); plyo method stage 3 'repeated receive / create' at the sport's target plyo share (CAT-10); deload = about half the sets, same exercises, lighter / 3+ RIR, no buy-out (COACH-ANSWER PER-05) | OBSERVED BASEBALL Block 2 (B1 -> B2 deltas); reading Block 2 as 'PRE SEASON' is INFERRED from dates (Jan - early Mar 2023) and the closing 'DELOAD WEEK' |
| in_season | whole competitive season | v1 generator (COACH-ANSWER PER-08: about 2 lifting days a week, low volume; numbers PROPOSED): resistance 0.5 (2 of the 4 off-season days, strength maintenance; profile overrides 0.6-0.8 where 2-3 days are written), core 0.5 (core first on each lifting day - ATH-11 / VOL-17), calves 3 sets per leg day (VOL-17), PLYO 0.4 (low-volume, high-quality jumps; games supply contacts), JLK 0.5, BALL 0.5, THROW 0.6 (rotational sports keep throws for maintenance), COD 0.5 (INFERRED), SPRINT 1.0 for speed athletes (sprints are their in-season content - PER-08) and 0.6-0.8 for other field sports, never 0 (INFERRED, hamstring protection), TE 0 (OBSERVED: no OLY in-season) - computed on the 12 field-court profiles, weekly sets fall about 49-54%. OBSERVED baseball Block 3 (evidence only, retired as the default - question 11.2 #14): 4 days, PLYO 1.3 (135/103), JLK 0.7 (66/97), THROW 1.0 (176/178), SPRINT 1.8 (sets 1.0 -> 1.8), resistance 1.0 (~72 -> ~72), core 1.4 (11.4 -> 16.4 sets); bilateral share minimal (COACH-ANSWER UNI-10) - use each profile's in-season value from section 5.11 (10-30% bilateral by sport; numbers PROPOSED) (TE 0 in season is OBSERVED (baseball); whether light L1 variants stay in season is open (section 11.2)) | about 2 lifting days a week, low volume (COACH-ANSWER PER-08); content by athlete type: speed athletes -> sprints; most others -> strength maintenance; some -> high jumps (COACH-ANSWER PER-08); bilateral work minimal, unilateral keeps range and health (UNI-10); 2 aerobic sessions a week (ATH-07); no contrast (ATH-12); OBSERVED baseball in-season: main lifts flat 4 x 10 (4 x 8 early), no compound below 8 reps, no Olympic lifts, two alternating proven weekly menus, short buy-outs ('1x 30 Sec Fast Run', '2x 15 cal bike sprint'); INFERRED for jump/run-dominant sports whose games already supply contacts (basketball, volleyball, soccer): PLYO x0.3-0.5, keep 1 max-velocity exposure for hamstring protection | OBSERVED BASEBALL Block 3 (week labels dated 'March 20 - 26' .. '04/24 to 04/28'; that these dates are 'IN SEASON' is INFERRED by matching them to the coach's season calendars rows 4-17 - the block has no season label) |
| post_season_recovery | 1-2 | PLYO 0, JLK 0, BALL 0, THROW 0, COD 0, SPRINT 0, TE 0, resistance 0.3, core 0.6 | arm care + mobility + easy colour-C cardio; no athletic work | OBSERVED recovery-week CONTENT from BASEBALL Block 1 'wk 8' (24 sets: 'Kettlebell arm bars', 'Half kneeling shoulder roll', 'floor windchield wipers', 'Paced Cardio - easy' 4 x '10 min'; the 'OPTIONAL PIECE' 'OLY' 4 x 6 label is still there with no exercise). That week sits at the END OF BLOCK 1, between Block 1 and Block 2 - not after a season - so using it as the post-season template is INFERRED |

### combat - boxing, kickboxing/Muay Thai, karate/taekwondo, MMA, wrestling, BJJ

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| base_GPP | 2 (OBSERVED; about 4 in an 8-week plan - see rules) | PLYO 0, JLK 0, BALL 0.5 (ballistic-first start - CAT-10; PROPOSED), THROW 0.5, COD 0, SPRINT 0, TE 0.5 = L1 Olympic variants (DB / KB snatch, hang pulls, hex-bar jumps: everyone in athletic training gets Olympic lifts - COACH-ANSWER ATH-10; dose PROPOSED; OBSERVED boxer wk1-2 = 0), resistance hypertrophy 3 x 10 on all 8 patterns 2x/week incl. horizontal push and vertical pull, core 0.8 (OBSERVED 14 vs 17 core sets) | upper/lower split Mon/Thu legs, Tue/Fri upper; one medball list (19 throws x 10 = 190); 1 colour-A ('20 sec fast/ 40 sec slow') + 1 colour-C ('20 min' easy) per week; the opening cardio on conditioning days is a REAL aerobic block for fighters, not a warm-up (COACH-ANSWER ORD-09); stage-1 'receive and pause' landing drills may be added at low volume ('the beginning of a program might have a lot more receiving' - COACH-ANSWER CAT-10; PROPOSED - the OBSERVED boxer base has no jumps); length: OBSERVED 2 weeks inside the boxer's 8-week build, but the generator's 8-week shape is COACH-ANSWER PER-01 (about 4 weeks getting used to it, 4 weeks driving hard), so the base / adapt part runs about 4 weeks unless a fight date forces it shorter (PROPOSED); fight prep keeps 2-week steps and waves (PER-10) | OBSERVED 'EXAMPLE BOXING 8 WEEK BUILD UP' weeks 1-2 (yellow FFFF00) |
| conversion_build | 6 | PLYO 1.0, JLK 1.0, BALL 1.0, THROW 1.0, COD 1.0, SPRINT 1.0, TE 1.0, resistance 1.0, core 1.0 | exercise list replaced (phase change, +41% component sets); 2-week steps: sets constant for 2 weeks; the deadlift complex '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' (L46), 'Hang Power Clean & Press' (L35) and 'Single Leg swiss ball knee tuck in + DB rows' (L20) are the levers: 3 sets wk3-6 -> 4 (wk7) -> 6 (wk8); the squat complex '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (L22) goes 3 -> 2 (wk7) -> 3 (wk8); wk 7 = accessory mini-deload (eleven rows 3 -> 2 sets: L12-L14, L21-L23, L32, L36, L37, L45, L48); wk 8 = peak (dark red CC0000): hinge complex, clean & press and DB-row superset 6 sets, 'Sprint 20/ Recover 40' 8 rounds, deadlift + rope 4 sets; strikers: when punching volume is high, horizontal push, vertical pull and arm isolation are REDUCED, not cut (COACH-ANSWER ATH-04; the boxing tab removed them in weeks 3-8 = OBSERVED); contrast complexes are an off-season / build tool for L2+ (ATH-12); steps and waves (not smooth ramps) for fight prep (PER-10) | OBSERVED boxing weeks 3-8 (EA9999 -> E06666 -> CC0000 heat ramp) |
| fight_camp | 6-8 before a bout | PLYO 0.6, JLK 1.0, BALL 0.6, THROW 0.6, COD 1.0, SPRINT 0.8, TE 0.6, resistance 0.6, core 0.8 | lifting 2-3 days, 2 sets per slot, keep 1 heavy and 1 fast exposure per pattern; conditioning = round simulations (colour B / LC) matched to the sport's round length; taper last 7-10 days: volume -40-60%, intensity kept; weight cut: no new exercises in the final 3 weeks; press / arm volume stays reduced but never zero (ATH-04); bilateral share minimal (UNI-10) - each profile's in-season value from section 5.11 (20% strikers / MMA, 30% wrestling / BJJ; PROPOSED) | INFERRED (no camp program in the sheets); SCIENCE: maintain strength/power with low volume while sport-specific conditioning peaks |
| post_fight | 1-2 | all 0.3 | easy colour C, mobility, injury check | INFERRED |

### strength - powerlifting / strength track

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| 8_week | - | - | GENERATOR SHAPE = COACH-ANSWER PER-01 (NOT RIGHT for the 7 + 1 reading): first 4 weeks adapting, next 4 driving hard, start hard; the OBSERVED shape below is an example only, retired as a default. OBSERVED: 7 loading weeks, WK8 = 'TEST' (max-effort days) + 'DELOAD' (dynamic days); three UNLABELLED coloured rows over WK1-WK8 (E4:L6): green B6D7A8 5,5,4,4,3,3,2,1; pink EAD1DC 5,4,3,2,1,3,2,1; blue CFE2F3 3,3,2,1,3,2,1,1 - the day rows only say 'SEE'. Reading pink = M.E. reps, blue = D.E. reps, green = sets is INFERRED (the B column fixes 'the work' at 5 sets Mon/Wed/Thu and 3 Sat); volume flat or falling, intensity rising | OBSERVED STRENGTH-8 / '(NOT DONE) EXAMPLE CONJUGATE' |
| 12_week | - | - | GENERATOR SHAPE = COACH-ANSWER PER-01 (preferred plan): 2-4 weeks acclimation, 4-6 weeks driving hard 'not all the way to the top', last weeks hardest; a repeated cycle starts one level higher; the OBSERVED 6 + mid-deload + 5 shape below is an example only, retired as a default. OBSERVED: % 80,80,85,85,90,90 then 'MID DELOAD' WK7; RPE 7,7,7,8,8,9,7,8,9,9,9,10; SETS 4,4,5,5,6,6,3,5,6,6,7,7; REPS 5,5,4,4,3,3,4,4,3,3,2,2; main-lift sets +5.2%/week; PER-09 confirmed: the %-template (OLY 75 -> 80 -> 85 -> 90% with 4x8 -> 4x6 -> 4x6 -> 4x4; 4 TRACKS % / RPE / sets / reps rows) is the default for strength-focused plans | OBSERVED STRENGTH-12 |
| meet_peak | - | - | last 2-3 weeks: accessories -50%, singles at RPE 8-9, plyo 'EASY' kept or dropped | INFERRED |
| bilateral_share | - | - | start about 50/50 with contra/ipsi health accessories in weeks 1-4, end 90/10 bilateral; unilateral accessory kept later only if something bugs the lifter | COACH-ANSWER UNI-02 / CAT-13 |

### physique - bodybuilding / aesthetics / fat loss / bootcamp

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| 8_week | - | - | COACH-ANSWER PER-01: 8 weeks = first 4 weeks adapting, next 4 driving hard ('an 8-week program wants to modify you, so you have to start hard'); OBSERVED AESTHETICS-8 example: SETS 2,3,3,3,4,4,5 per exercise, REPS 12,10,8 waves, '1-2 RIR', WK8 'DELOAD WEEK' | COACH-ANSWER PER-01 + OBSERVED AESTHETICS-8 |
| 12_week | - | - | COACH-ANSWER PER-01 (preferred plan): 2-4 weeks acclimation, 4-6 weeks driving hard 'not all the way to the top', last weeks hardest; a repeated 12-week cycle starts one level higher (1 -> 10, then 2 -> 11); OBSERVED AESTHETICS-12 example: SETS 3,3,3,4,4,4,3,4,4,4,4,5; WK7 'A WEEK LOWER'; WK9-12 supersets, '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; A/B weeks rotate variants (A/B lead-lift weeks are optional, for variety seekers - PER-03); bilateral share 50/50 -> 80/20 (adjustable to 90/10) across the block (UNI-02); contra/ipsi accessories mostly in weeks 1-4 (CAT-13) | COACH-ANSWER PER-01 / PER-03 / UNI-02 + OBSERVED AESTHETICS-12 |
| 4_week_fat_loss | - | - | weekly lifting sets 60,60,64,70 (circuits excluded); compound reps 15/12 -> 8-10; leg isolation 4x15 -> 3x20 -> 2-3x40, arm isolation 2x30 -> 3x40, side raises 3x15 -> 4x20; circuits 3x30 s -> 5x50 s (two 4-station circuits/week); variation upgrade at WK3; no deload; the 40-rep sets (2-3x40, 3x40) are not a default any more: optional AMRAP / CrossFit style only (COACH-ANSWER VOL-11); circuits stay as finishers after lifting (PRG-11); v1: this is an OBSERVED 4-week BUILDING block - under COACH-ANSWER PER-01 a stand-alone 4-6-week PLAN is a maintenance / transition block at about 50-70% volume, so the generator uses this progression only as weeks inside an 8- or 12-week fat-loss plan (INFERRED) | OBSERVED FAT BURN + COACH-ANSWER VOL-11 / PRG-11 / PER-01 |
| 4_6_week_maintenance | - | - | 4-6-week plans are maintenance / transition blocks (vacation, travel, season change, moving) at about 50-70% of the usual volume | COACH-ANSWER PER-01 |

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
| pre_PHV | - | - | 2-3 sessions/week of 30-60 min; wide range of jumps/landings at moderate volume (T2), games-based COD/sprint; bodyweight + light DB/medball resistance at FOUNDATIONAL levels; L1 Olympic variants (DB / KB snatch, hang pulls) - ATH-09 / ATH-10 | SCIENCE (Lloyd & Oliver youth physical development; NSCA youth position) |
| circa_PHV | - | - | high-amplitude plyos -30-50%, no depth jumps above ~30 cm; technique emphasis, flexibility/ROM maintenance; watch knee/heel pain via 'HOW IT FELT?' = 'Felt a PAIN' | SCIENCE for the risk (growth-related apophysitis: Osgood-Schlatter, Sever's); the -30-50% and ~30 cm caps are INFERRED analyst heuristics, not literature thresholds |
| post_PHV | - | - | progress toward the adult sport profile; barbell and Olympic lifts with technical competency - and SOME Olympic lifts from the floor are allowed earlier according to the program (COACH-ANSWER ATH-09) | SCIENCE |

### general - general population / longevity / older adults

| phase | weeks | multipliers | rules | evidence |
|---|---|---|---|---|
| continuous_blocks | - | - | COACH-ANSWER PER-01: 12-week plans preferred; repeated 12-week cycles start one level higher; an open-ended week-by-week mode that 'keeps me in line'; a yearly mode (quarter themes, holiday weeks = automatic maintenance - see 06_periodization v1); 4-6-week maintenance / transition blocks at 50-70% volume; no seasons; tests chosen by checkbox at block start, or none (PER-07) | INFERRED from OBSERVED UPPER/LOWER levels + SCIENCE (NSCA older-adult position stand) |

Per-sport overrides on top of the family multipliers are in each profile card and in `profiles[].season_overrides` / `in_season_content` in the JSON. COACH-ANSWER PER-08 fixes in-season content by athlete type; the INFERRED override that jump- and run-dominant team sports cut gym plyos to x0.3-0.5 in season (games supply contacts) but keep one max-velocity sprint exposure per week stays.

## 8. Plan length shapes (COACH-ANSWER PER-01 replaces the v0 reading; detail in 06_periodization v1)

| plan | shape | evidence |
|---|---|---|
| 4-6 weeks | maintenance / transition block (vacation 1-2 weeks, travel, off-season -> in-season, moving): about 50-70% of the usual volume to recover without pushing | COACH-ANSWER PER-01 (replaces the v0 '6 weeks = first 6 of the 12-week shape') |
| 8 weeks | first 4 weeks getting used to it, next 4 weeks driving hard; 'an 8-week program wants to modify you, so you have to start hard' | COACH-ANSWER PER-01 |
| 12 weeks (preferred) | 2-4 weeks acclimation -> 4-6 weeks driving hard 'not all the way to the top' -> last weeks hardest (most fatigue, stimulus and adaptation); a second 12-week cycle starts one level higher (1 -> 10, then 2 -> 11) | COACH-ANSWER PER-01 |
| week-by-week | open-ended mode with no fixed length; the engine keeps the person in line | COACH-ANSWER PER-01 |
| yearly | quarter themes and holiday weeks set to maintenance automatically (see 06_periodization v1 for the coach's quarter description, flagged there as ambiguous) | COACH-ANSWER PER-01 |
| deload / tests | deload = about half the sets, same exercises, lighter / 3+ RIR, no buy-out (PER-05); tests chosen by checkbox at block start, or 'no need for testing' (PER-07); blocks 4-6 weeks with small variable changes between blocks (PER-02) | COACH-ANSWER PER-02 / PER-05 / PER-07 |
| OBSERVED examples | 8 weeks = 7 progressive + week 8 'DELOAD WEEK' / 'TEST' (AESTHETICS-8, STRENGTH-8, CONJUGATE, CrossFit class); 12 weeks = 6 + week 7 deload + 5 (STRENGTH-12, AESTHETICS-12); athlete 8-week build = 2 base + 6 conversion in 2-week steps, wk7 mini-deload, wk8 peak (boxer); 8-week season blocks, pre-season ends with a deload (BASEBALL) | OBSERVED |

## 9. Injury hotspot library (selection rules)

| code | evidence | sports | source / mechanism | generator rules |
|---|---|---|---|---|
| PAIN_GENERAL | OBSERVED | all | MASTER_MODEL 'EXAMPLE ATHLETIC FULL BODY SPLI' A6: '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'; UPPER/LOWER and PPL A7 give the grip rule only (no 'going unilateral'); BYOP 'HOW IT FELT?' FEELING list AY8:AY11 = 'Felt the RIGHT muscles' / 'Felt the WRONG muscle' / 'Felt a PAIN' / 'Couldn't do it' | COACH-ANSWER VOL-03: cut that muscle or pattern 30-50%, move it to machines or split grips, keep it moving - or drop the exercise altogether if it is too much; swap fixed-grip barbell/bar -> DB/KB/handles in the same pattern; swap bilateral -> unilateral in the same pattern (MASTER_MODEL athletic A6); keep the sets ideally, 'but you have to adjust accordingly' (UNI-08); pain moves the bilateral : unilateral share (UNI-02); 'Felt a PAIN' -> swap within the category or lower the level (GEN-05 RIGHT); if twice in a slot: swap, then cut sets, then drop a library level (INFERRED order) |
| SHOULDER_THROWER | OBSERVED + SCIENCE | baseball, softball, volleyball, tennis, football QB, handball | OBSERVED BASEBALL: no barbell BENCH press is named (horizontal pressing = DB, bottoms-up, alternating, top-down; 'fast banded assisted bench press' B2W5/B2W7 names no implement; banded work is out of scope, EQ-12); vertical push is mostly single-arm / half-kneeling / landmine / seesaw / DB push press, BUT barbell overhead pressing is written 3 times ('barbell press' 4 x '8/8' B1W2 AE34 and B1W3 AW34, 'barbell overhead strict press' 4 x 8 B2W1 Q52) plus 'arnold presses' B3W3; recovery week 'Kettlebell arm bars', 'Half kneeling shoulder roll'. SCIENCE: pitchers carry up to 60% of shoulder and 40% of elbow injuries at college/pro level; posterior cuff weakness and total-rotation deficits are risk factors. | pressing = DB / alternating / landmine ('Kneeling Landmine Press' AA93, 'Sesaw Db Press' AA91, alternating presses AD126-AD129; AD130 is 'Push ups (1 hand Higher)'); heavy barbell overhead only occasionally (the coach writes it 3x in a 24-week baseball year, never in-season); pitchers: less overhead pressing, more arm care, rotational throws kept light (COACH-ANSWER ATH-08); add ISO_REAR (posterior cuff / 'Bent over DB Reverse flies' AH10, 'Seated DB Reverse Flies' AH15) 2x/week; limit hanging vertical-pull volume to sets that keep 2 RIR (open question: coach); throwing-day rule: medball rotational OK, overhead slams and plyo push-ups not on bullpen days (INFERRED) |
| SHOULDER_STRIKER | OBSERVED (boxer) + COACH-ANSWER ATH-04 | boxing, kickboxing, MMA, karate/TKD | OBSERVED boxing wk3-8: zero horizontal push, zero vertical pull, zero arm isolation; only 'DB rows', the press in 'Hang Power Clean & Press', and side/front raises; DB 'sesaw' presses elsewhere | when punching volume is high, bring HPUSH, VPULL and arm-isolation volume DOWN (PROPOSED: to about 30-50% of the base-phase sets) - never to zero (COACH-ANSWER ATH-04: 'don't completely cut it'); keep HPULL (rows) and ISO_SIDE / ISO_REAR for scapular balance; presses that remain = alternating DB / push press |
| SHOULDER_GYMNASTIC | SCIENCE | CrossFit | CrossFit injury reviews: shoulder 6.7-40.6% of injuries, most often in gymnastic movements; low back most often in powerlifting movements | cap kipping/high-volume hanging work in skill blocks; keep strict pulling strength (VPULL) >= kipping volume; ISO_REAR 2x/week |
| ELBOW_THROWER | SCIENCE | baseball pitcher, softball pitcher, javelin, QB | UCL load in overhead throwing; softball windmill shoulder/elbow loads comparable to baseball, high eccentric biceps load | forearm/grip and wrist-flexor work (ISO_GRIP) 2x/week; softball pitchers: eccentric biceps emphasis in ISO_BICEP; count medball overhead throws as arm load on high-pitch days |
| ELBOW_LATERAL_RACKET | SCIENCE | tennis | elbow is the most common tennis injury site (21.4%), shoulder 19.4%, lumbar 17.3% | wrist-extensor isometric/eccentric (ISO_GRIP) 2-3x/week; neutral-grip DB pressing |
| WRIST_HAND | INFERRED + SCIENCE | boxing, CrossFit, gymnastics-heavy | - | prefer DB/KB neutral grips over front-rack barbell for strikers; limit front-squat rack volume when wrist pain flagged |
| NECK | SCIENCE (gap in coach library) | wrestling, BJJ, MMA, American football, rugby, Muay Thai clinch, hockey | wrestlers with neck injuries show weaker neck flexion/extension; most cervical work in wrestling is eccentric/isometric | add ISO_NECK 2x/week (isometric 4-way, then plate or manual eccentric; no bands - EQ-01) - NO library column exists: create one; progress static -> dynamic like the core plane ladder |
| LOW_BACK_ROTATIONAL | OBSERVED (core ladder) + SCIENCE | golf, tennis, baseball, softball, hockey, throwers | golf swing lumbar compression up to ~8x body weight; low back = most common golf injury. OBSERVED coach: core difficulty ladder SAGITAL -> FRONTAL -> TRANSVERSE; FUNCTIONAL 'ANTERIOR OBLIQUE SYSTEM' Pallof holds and chops | anti-rotation static first (Pallof holds BC46-BC49) before rotational dynamic (chops BC9/BC13/BC17, 'Woodchoppers', 'Cable Machine Oblique Rotations'); hip rotation (into/out-of-hip) emphasis so rotation comes from the hips, not the lumbar spine (medball half-kneeling 2x2 matrix); avoid high-volume loaded flexion+rotation (e.g. weighted Russian twists) when back pain is flagged |
| LOW_BACK_LOADING | SCIENCE + OBSERVED pain rule | powerlifting, CrossFit, linemen, wrestling | - | axial loading once a week: squat one day, leg press / belt squat the other; deadlifts count as axial (COACH-ANSWER PER-04); belt squat when the back was already loaded that week or is sore (EQ-11); rotate hinge variants (hex/DB/KB) when flagged; box squats ('(D)BOX') to control depth; core = static anti-extension/anti-flexion first |
| GROIN_ADDUCTOR | OBSERVED (coach uses it) + SCIENCE | soccer, hockey, kickboxing, karate/TKD, MMA, football, tennis | OBSERVED: Copenhagen planks in MM athletic MID F66 and ADVANCED J24 ('DB side raises + Copenhagen plank :50 sec each side'), boxing L13 ('Copenhagen Plank & Unilateral DL') and BASEBALL ('COpenhagen plank' AK30/E48, 'copenhagen plank' DH48/DQ65/BO66, 'Copenhagen raises' S66). SCIENCE: Copenhagen adduction programme 3x/week pre-season and 1x/week in-season cut groin problems by 41% in male football players (Harøy 2019) | 'Coppenhaggen Plank' (R47 / O165) 3x/week pre-season, 1-2x/week in-season; adductor-integrated chops / Pallofs ('Hold object Adducted between knees'); banded adduction variants are out of scope (no bands, EQ-01 / EQ-07); frontal / transverse unilateral work (lateral lunges, cossacks, lateral step-ups) - UNI-12 |
| HIP_FLEXOR | SCIENCE | sprinters, soccer, kickers, karate/TKD, Muay Thai | - | loaded hip-flexion (FOCUS slot) 1-2x/week; A March / A Skip progressions |
| HIP_FAI_DEEP_FLEXION | SCIENCE | hockey goalie, baseball/softball catcher, hockey skaters | - | limit loaded deep hip flexion volume (box squats to parallel); hip IR/ER mobility in warm-up; more UHD than deep BKD |
| LEAD_HIP_GLUTE | SCIENCE | golf, baseball, softball, tennis | - | lateral hip strength: 'Side Lunges' AL12, 'Step ups (Forward & Side)' AL19, contralateral-loaded lunges; medball half-kneeling scoops labelled 'INTO THE LEFT LEG/HIP' / 'INTO THE RIGHT LEG/HIP' (ballistics MEDBALL CHEAT SHEET D65/D68) both sides |
| HAMSTRING | SCIENCE + OBSERVED library | sprinters, soccer, American football, rugby, baseball base-runners, basketball | Nordic hamstring exercise programmes reduce hamstring injuries by up to 51% (van Dyk 2019); most strains occur in late swing at high speed | 'Nordic Curl' (AN91) or slider/swiss-ball curls (AN18/AN19) 1-2x/week year-round; keep at least one max-velocity sprint exposure per week in every phase; hip-extension strength (RDL / staggered stance DL) |
| ACL_LANDING_CUTTING | SCIENCE + OBSERVED progression | basketball, soccer, volleyball, football, handball, youth, any athlete with ACL history or poor landing control | neuromuscular training (plyometrics + strength + proximal control) cuts non-contact ACL injury risk by about half (the trials were run in female athletes; the generator applies the rule by landing competency and injury history, never by sex - COACH-ANSWER ATH-09) | plyo method stage 1 first: 'STICK THE LANDING BILATERAL' -> 'UNILATERAL' -> weighted (OBSERVED ballistics tab; CAT-10); COD 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN' only after landing competency; single-leg strength + hip abductor work every week; athletes with an ACL history, a poor landing screen or a low training age: double the stage-1 landing block (INFERRED; replaces the v0 sex-based rule - ATH-09) |
| PATELLAR_TENDON | SCIENCE | volleyball, basketball, jumpers | jumper's knee prevalence 44.6% in elite volleyball and 31.9% in basketball (Lian 2005) | cap REBOUNDING (phase 4) contacts; never stack max approach jumps + depth jumps on the same day; heavy slow quad work / isometrics (ISO_QUAD 'Leg Extensions', 'Sissy Squats' AK18) 2x/week; in-season: count game/practice jumps before adding gym plyos |
| ANKLE_SPRAIN | SCIENCE + OBSERVED library | basketball, volleyball, soccer, tennis, football | - | ankle-dominant track (the 'JUMPING ANKLE' ankle-hop block C124-C136 under 'TRIPPLE EXTENSION', same list as Sheet23 'FOUNDATINONAL - AP - JUMPING LIMITED KNEE' E2:E12; lateral plate hops G50-G52) 2x/week; single-leg landings with lateral component |
| ACHILLES_CALF | SCIENCE | tennis, basketball, runners, masters athletes, racket sports | - | 'Standing Calf raises (use deficit)' AU9 / bent-knee soleus 2-3x/week; progress JLK volume <= 10-20%/week (INFERRED) |
| BONE_STRESS | SCIENCE | distance runners, youth, athletes with low energy availability | - | plyo low-amplitude only until 6+ weeks of tolerance; progress total impact load gradually; heavy strength training is protective |
| GROWTH_APOPHYSIS | SCIENCE | youth circa-PHV | - | reduce high-amplitude plyos and depth drops during growth spurts (INFERRED caps); no maximal loading; foundational lists, with some Olympic lifts from the floor allowed by program (COACH-ANSWER ATH-09) |
| DECONDITIONED_JOINTS | INFERRED + OBSERVED | fat loss, general population, bootcamp | OBSERVED FAT BURN circuits use only bodyweight/DB moves; jumping jacks and burpees are the only contacts | no plyos beyond low-amplitude until body mass and landing control allow; constrained machines / supported variants first (constraint 4-5), free weights later (EQ-03 / EQ-13) |
| FALLS_BONE_DENSITY | SCIENCE (NSCA older-adult position statement) | older adults | - | few plyos unless the client asks (COACH-ANSWER ATH-09); compounds and isolation on constrained machines / cables; never overhead squat, snatch, low-bar squat or depth jumps (COACH-ANSWER EQ-03); power work at 40-60% 1RM moved explosively (SCIENCE); balance + sit-to-stand + step-ups every session; 2-3 sets per major muscle group, 2-3 days/week (SCIENCE) |
| HIGH_VOLUME_CONSTRAINT | COACH-ANSWER EQ-03 / EQ-04 | aesthetics high-volume tracks, older clients, injured clients | 'If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints' | compounds and isolation lean to constrained machines (constraint scale 4-5, EQ-13; hack squat / leg press more constrained than Smith; belt squat avoids axial load; GHD / reverse hyper if available and the client feels the right muscles - no machine ranking, brands and angles differ, EQ-11); never overhead squat, snatch, low-bar squat or depth jumps; vertical push: seated machine shoulder press for older / injured clients (EQ-05); the client's preference picks between equivalent alternatives (EQ-10) |

## 10. Library and template gaps the profiles need

| gap | evidence | needed by |
|---|---|---|
| No SPRINT slot in any BYOP template | OBSERVED: in BYOP only ' Max velocity running (top speed)' (PLYOS ADVANCED G128 and FULL JUMPING J11). MASTER_MODEL has Sheet23 '✅ MACH DRILLS' / '✅ Acceleration starts' (B48/B49), the cheat-sheet 'RUNNING WARMUP', UL/PPL A-drills, BASEBALL '30m acceleration sprint'. COACH-ANSWER LIB-21: add MACH drills, speed-session order fixed (squirrel jumps -> MACH / acceleration starts -> max velocity) | soccer, football skill, track, basketball, baseball position players; every speed athlete in season (PER-08) |
| No ground-contact / plyo-vs-ballistic tag on the athletic library items (NEW in v1) | COACH-ANSWER ATH-01 / CAT-10 make the split a programming variable; the library only has PLYOS / FULL JUMPING / JUMPING ANKLE / THROWING columns; v1 classifies by keyword (v1_power_mix.py, INFERRED) | every athletic profile (the generator needs a PLYO / BALL / JLK / landing tag per item; the plyo METHOD STAGE is a way of performing a jump chosen per block, not a fixed property of the exercise - COACH-ANSWER CAT-11; only items whose name fixes it, e.g. 'Stick the landing', carry a default stage) |
| REPS menu cannot express contacts, throws per side, metres, seconds or 1-3 reps | OBSERVED AW8:AW14 '4 to 6 Reps' .. '20 Reps', 'MYO SET' | every athletic profile |
| No neck exercises | OBSERVED: none in the library or programs; not asked in the questionnaire | wrestling, BJJ, MMA, football, Muay Thai, hockey |
| CARRY and DRAGS headings have no exercises | OBSERVED BA/BB columns hold only sub-headings (CARRY: 'PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; DRAG: 'SAGITAL', 'FRONTAL'); carries are programmed in BASEBALL (E47, S65, W49) and CONTROL PATTERNS (B10). COACH-ANSWER LIB-19: build them out (athletes, general fitness; slings for advanced athletes and rehab; farmer handles, trap bar, KB, sandbag, sled) | wrestling, BJJ, MMA, linemen, general population |
| Rear-delt / external-rotation work has no own slot | OBSERVED: reverse flies share the 'ABdution' list; COACH-ANSWER VOL-17: rear delts need their own sets | every profile (throwers and racket athletes first) |
| Frontal / transverse lower-body moves missing from the main library | COACH-ANSWER LIB-20: add 'Hold between knees Squats', cossacks etc. from RESISTANCE PATTERNS for court and combat athletes (strap rotations excluded - LIB-09); UNI-12 | basketball, tennis, soccer, MMA, hockey, combat |
| Reactive agility is defined but not programmed | OBSERVED AGILITYCOD tab ('Agility: Reactive in nature - Incognitive Competence' vs 'COD: Proactive in nature - Cognitive Competence'; empty headings 'HOPS IN PLACE', 'KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'RUNNING ROUTES', 'ROUTE TREE'); COD list pre-planned only: 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'Shuffles' (EASY TURN), 'DIG/OUT', 'LEFT TEST' (MOD. TURN), 'COMEBACK/CURL' + date cell L92 = 5-10-5 (HARD TURN). ATH-06: the route names serve every athlete, tiered by turn angle | basketball, soccer, football, tennis, combat |
| No observed COD in any MASTER_MODEL program | OBSERVED AP_COD = 0 in athletic, boxing, baseball | decide whether sport practice covers COD |
| No equipment tags on the library | OBSERVED; equipment answers EQ-01..16 (no bands, constraint scale 1-5) | home / no-gym clients; youth; older adults |

## 11. Open questions

### 11.1 Status of the v0 questions

| # | v0 question | status | resolution |
|---|---|---|---|
| 1 | Plyo scale: is the boxer's 113-129 high-amplitude + 142-177 low-amplitude contacts/week (plus jump rope) the CEILING for boxing, a typical dose, or 'a lot'? The whole T1-T5 scale is anchored on it. | ANSWERED - ATH-01 / ATH-02 | The ranking is about fast-reactive plyometric volume; the boxer example sits just above the PROPOSED boxing band 15-30 (31 fast-reactive contacts/week), its other contacts are ballistic jumps and landings; the generator clamps it to the band (section 5.12). |
| 2 | Do you agree with roughly 220-300 high-amplitude contacts/week for an off-season basketball player, 160-200 for MMA, 60-90 for karate/TKD? Or should 'more plyos' mean more sessions/frequency rather than more contacts per week? | ANSWERED (ranking) / PROPOSED (numbers) - ATH-02 | Basketball and volleyball top; targets re-anchored on the plyometric dial (basketball 100-140, MMA 55-80, karate 15-30 fast-reactive contacts/week) - numbers pending approval. |
| 3 | When you say boxers/karate need fewer plyos, do you mean fewer HIGH-amplitude jumps (depth jumps, max jumps) while keeping low-amplitude bouncing (rope, squirrel jumps, ankle hops) high, as the boxing example does? | ANSWERED - ATH-01 | Fewer plyos for boxers / karate = more ballistics because they stay on the ground; low-amplitude bounce stays sport-practised. |
| 4 | Should every field/court sport get a dedicated SPRINT slot (and should 'MACH DRILLS' / 'Acceleration starts' from Sheet23 and the cheat-sheet 'RUNNING WARMUP' move into the BYOP library)? Today sprint only appears as A-drills, 'Falling start accelerations', baseball accelerations, or conditioning intervals. | ANSWERED - LIB-21 / PER-08 | MACH drills and acceleration starts go into the library; speed athletes sprint in season. |
| 5 | Your MASTER_MODEL programs contain zero change-of-direction work. Is COD left to sport practice for in-season athletes? Should non-football athletes still use the receiver route tree ('FADE' ... 'COMEBACK/CURL'), or do soccer/basketball/tennis need their own COD and reactive-agility list? | PARTLY - ATH-06 | Route-tree names for every athlete, tiered by turn angle; a reactive-agility list is still open. |
| 6 | Medball dose: athletes/fighters get 176-420 throws/week in your examples but the BYOP template at 2 sets gives 64-96. What weekly throw target do you want per sport, and does a 'Throwing' slot mean one throw or the whole 19-throw list? | ANSWERED - ATH-05 / LIB-22 | Throws by sport (high / moderate / none); a slot can be the whole ~19-throw list at 1 x 10. |
| 7 | Strikers: is dropping horizontal push, vertical pull and arm isolation after the base phase a rule for every striking sport (boxing, kickboxing, karate), and should MMA keep pulling for grappling? | ANSWERED - ATH-04 | Reduce, not cut, pressing / arm volume when punching volume is high. |
| 8 | Baseball/softball: do pitchers, catchers and position players get different templates (your pro calendar separates 'PITCHERS/CATCHERS' from 'POSITIONS')? What changes for pitchers on throwing days? | ANSWERED - ATH-08 | Pitchers: less overhead pressing, more arm care, light rotational throws. Catchers remain INFERRED. |
| 9 | In-season for game-heavy sports (basketball, volleyball, soccer, football, hockey): how many lifts per week, and should game/practice jumps and sprints be subtracted from the plyo/sprint budget? | ANSWERED - PER-08 | About 2 lifting days in season; content by athlete type. Subtracting game jumps stays INFERRED. |
| 10 | Should athletic sets (plyos, throws, cuts, cleans) count toward the 15-20 sets per muscle per week, partly (e.g. quads/calves), or not at all? | ANSWERED - VOL-10 | Athletic sets never count toward muscles. |
| 11 | Confirm the level rule: athletes get LESS volume and more intensity/specificity as they advance (MM athletic ladder), while physique clients get MORE sets (UPPER/LOWER, PPL ladders)? | PARTLY - PRG-04 / PRG-06 | STARTING / MID / ADVANCED = blocks or levels as needed; one sound algorithm for every model. |
| 12 | Core: should every athlete profile rotate planes by day like BASEBALL ('LATERAL CORE' / 'Transverse core' / 'Sagital core'), with more transverse for rotational sports (golf, tennis, baseball) and more frontal for skating/cutting sports? | PARTLY - ATH-11 / CAT-08 | Core first for everybody; plane rotation by day not asked - still open. |
| 13 | Conditioning: the athletic template has 2 'Aerobic Capacity' slots, the cheat sheet says 3 (one per colour). Which sports should use lactate clearance (MMA, hockey, 400 m?), and is colour A (short/high) the only conditioning for baseball/football? | ANSWERED - ATH-07 | 3 / 2 / 4 sessions (+ walks); lactate-clearance sports still open. |
| 14 | Female athletes in landing/cutting sports: should the generator automatically lengthen the 'TAKING IN FORCES' landing block (ACL risk), and limit 'HARD TURN' COD until landing competency is shown? | ANSWERED - ATH-09 | No sex-based rules; landing work by competency and injury history. |
| 15 | Youth: do you want maturation stage (pre / circa / post growth spurt) as a UI input, with reduced depth jumps and FOUNDATIONAL-only library levels during the growth spurt? | OPEN | Youth maturation input not asked; ATH-09 allows some Olympic lifts from the floor. |
| 16 | Neck, grip, carries and drags: should the library get a NECK column and filled CARRY/DRAGS columns for wrestling, BJJ, MMA, football and hockey? | PARTLY - LIB-19 | Carries and drags confirmed; a neck column was not asked. |
| 17 | Golf, tennis and hockey: build them on the BASEBALL Part-A/B/C/D/E template (upper and lower ballistics on alternate days, core by plane) or on the BYOP ATHLETIC 4-day template? | OPEN | Template choice for golf / tennis / hockey not asked. |
| 18 | Distance runners: keep the Chris Hinshaw half-marathon plan as the running backbone (it is a borrowed model), or build your own run progression with the aerobic colour system? | ANSWERED - PRG-12 | Chris Hinshaw plan as-is, half marathon only. |
| 19 | Position variants in the UI: basketball guard/big, volleyball hitter/setter/libero, football skill/big-skill/line/QB/specialist, soccer outfield/GK, hockey skater/goalie, baseball position/pitcher/catcher, softball pitcher - are these the right splits? | PARTLY - GEN-02 / ATH-08 | Competitive athletes give sport + position + season; only the pitcher split is confirmed. |
| 20 | Season input: which of your baseball calendars (high school, fall ball, pro, pro weekly with 'PEAK'/'DELOAD') should the generator use as the default season model for other sports? | ANSWERED - PRG-09 | Calendars are 'just whatever I wrote'; high school = college = pro. |

### 11.2 New questions raised by the answers

1. Your sport ranking (ATH-02) puts boxing near the bottom, but your 8-week boxing build-up writes more total jump contacts (113-129/week) than your baseball off-season block (103). v1 reads the ranking as FAST-reactive plyometric contacts only (boxer 31/week vs baseball 37-74), with landings and loaded / single-effort jumps counted as ballistics. Is that how you rank sports?
2. Do medball throws count on the BALLISTIC side of your plyo : ballistic split (as v1 encodes), or do you mean only loaded / single-effort jumps when you say 'ballistics'?
3. Ground-contact classes and plyo share: basketball 'a good mix' = 50/50? Volleyball, soccer, football skill 60/40? Baseball, MMA, hockey 40/60? Boxing, karate, golf, grapplers 25/75? Sprinters 75/25?
4. Calves 3 sets every leg day (VOL-17) gives 12 sets/week on a 4-day full-body athletic template, on top of ankle hops. Intended for athletes too, or only on 2 leg-focused days?
5. Your observed baseball year runs about 55/45 bilateral/unilateral in every block, including in-season; your rule (UNI-10) says minimal bilateral in-season. For baseball, which wins - and what bilateral share do you want for linemen, wrestlers and sprinters?
6. Athletes in the OFF-season: how many aerobic sessions a week (you gave 2 for in-season, 3 general, 4 aesthetics)?
7. Olympic lifts in season: everyone in athletic training gets them (ATH-10), but the baseball in-season block has none. Keep them out in season, or keep light L1 variants?
8. From what age do the older-client rules start (few plyos unless asked; machines; no snatch / OHS / low-bar / depth jumps)? And does 'few plyos unless they ask' still allow landing drills and low ankle hops?
9. Rugby and track & field throwers are in your 'more resistance' group (ATH-03) but not in the sheets: map rugby to the lineman / big-skill profiles and throwers to a track variant (as v1 does), or build their own?
10. Pros 'need a little bit more care because of contracts' (PRG-09): what should change in practice - slower weekly progression, more recovery checks, no max testing?
11. Exercise count: with core first (about 2 exercises), calves every leg day, rear delts and Olympic lifts added, most athlete days come to 13-17 exercises at 2 sets each (section 5.3b), above your 'max maybe 12'. Should the generator use fewer exercises with 3 sets each, move change of direction and sprints to their own speed block or day, and superset calves / rear delts with the main lifts?
12. Contrast / complexes are 'off-season only' (ATH-12), but your baseball block 2 (dated pre-season) uses them. Does 'off-season' include the pre-season build for this rule?
13. Hip-dominant lifts (deadlifts, RDLs, hip thrusts): count 1 full set for BOTH hamstrings and glutes (v1), or 1 set for the main muscle and 0.25 for the other, like the RFE lunge (UNI-01)?
14. Pre-season and in-season volume: your baseball year keeps 4 lifting days in season with as many jumps and more core than the off-season, and raises resistance volume pre-season; your rule (PER-08) says pre-season = more speed / power with less volume, in season about 2 days at low volume. v1 follows PER-08 (in season about half the weekly sets). Is baseball an exception?
15. Older or injured clients in athletic training: everyone gets Olympic lifts (ATH-10), but they never get the snatch (EQ-03). Does that also exclude DB / KB snatches, leaving hang pulls, high pulls, hex-bar jumps and KB swings?
16. Powerlifters and the once-a-week axial rule (PER-04): your conjugate example squats twice in a squat week (max-effort Monday + box-squat speed Thursday). Should a powerlifter's second lower day be belt squat / leg press, or is a competitive lifter an exception?

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
* [S20] Neuromuscular training cuts non-contact ACL injury risk ~50% (trials in female athletes; the generator applies it by landing competency and injury history, never by sex - COACH-ANSWER ATH-09): [https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf](https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf)
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
* [S32] Flanagan & Comyns 2008, Strength Cond J: ground-contact time and the reactive strength index to prescribe fast stretch-shortening-cycle (plyometric) training; fast SSC under ~250 ms vs slow SSC (Schmidtbleicher): [https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi/](https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi/)
* [S33] Sprint acceleration kinematics: faster early accelerators show shorter ground-contact times; contacts ~0.14-0.16 s in acceleration (JSSM 2003 field-sport athletes; Swansea sprint data): [https://www.jssm.org/jssm-02-144.xml%3EFulltext](https://www.jssm.org/jssm-02-144.xml%3EFulltext)
* [S31] Schoenfeld et al. 2017 dose-response: 10+ weekly sets per muscle > 5-9 > <5: [https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf](https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf)

Coach sources: OBSERVED = the decoded tabs named in each row (`analysis/programs/prog_*.md` and `prog_*.volume.json`, `analysis/library/L1-L4_*`, `analysis/reference/*`); COACH-ANSWER = `coach_answers_full.md` (2026-10-08).

## Verification log (v0 fact-check, 2026-10-08, before the coach answers)

Kept for traceability. Where a v0 item conflicts with a coach answer, the answer wins and section 'v1 - coach answers applied' says what changed (for example C-20 squirrel-jump classification is superseded by the ground-contact model, and the 'JUSTICE LEAGUE' label in R-2 / C-3 now refers to the weekend-warrior tab).

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

## v1 verification log

Adversarial check, 2026-10-08, of the v1 update of this file and `04_profiles.json` against `coach_answers_full.md` (re-read in full) and `coach_answers.md`. Method: every answer relevant to profiles was traced into the tables, cards, rules, season families and the JSON (not only the changelog); grep sweeps over both files for the retired ideas; per-muscle sets, weekly totals, bilateral shares and plyo shares recomputed with python from `profiles[].weekly_sets` and `muscle_credit_map` (0 mismatches against the stored derived values). No Google Sheet was opened for writing.

**Answers checked and found correctly reflected (no change needed):** CAT-02, CAT-05, CAT-06, CAT-08, CAT-09 (leg curls / Nordics in their own ISO_HAM bucket), CAT-10, CAT-13; UNI-01, UNI-02, UNI-03, UNI-04, UNI-05, UNI-06, UNI-07, UNI-08, UNI-10, UNI-11, UNI-12; VOL-01, VOL-02, VOL-03, VOL-04, VOL-05 (no size-based 3/5/7% mapping anywhere; person-based rate only), VOL-07 (pointer to the volume engine), VOL-09 (0.25 helpers in the map and every recomputed muscle total), VOL-10, VOL-11, VOL-12, VOL-13, VOL-15, VOL-16, VOL-17, VOL-18; PER-02, PER-03, PER-04, PER-05, PER-07, PER-08, PER-09, PER-10, PER-11; ATH-01, ATH-02 (targets), ATH-03 (profiles), ATH-04, ATH-05, ATH-06, ATH-08, ATH-09 (no sex-based rule left; remaining 'female' hits are the retirement notes, the v0 question text and the SCIENCE trial population), ATH-10, ATH-12 (off-season and in-season rows), ATH-13 / FIX-03 ('Justice League' only as a cited sheet-tab name and in the v0 log); ORD-01, ORD-02, ORD-03, ORD-04, ORD-05, ORD-06, ORD-08, ORD-09, ORD-10, ORD-11; EQ-01, EQ-04, EQ-06, EQ-07, EQ-08, EQ-10, EQ-12 (no band / chain / weight-releaser substitute; banded items appear only as OBSERVED citations marked out of scope), EQ-14, EQ-15; GEN-02, GEN-04, GEN-05, GEN-08; LIB-01, LIB-02, LIB-04, LIB-06, LIB-07, LIB-18, LIB-19, LIB-20, LIB-21, LIB-22; PRG-03, PRG-04, PRG-05, PRG-06, PRG-07, PRG-09, PRG-10, PRG-11, PRG-12; FIX-04. PER-01: the 4-6 / 8 / 12-week shapes, week-by-week and yearly modes are right in section 8, the physique family and the JSON `plan_length_shapes` (no '6 weeks = 5 + deload' anywhere).

**Problems found and fixed in this pass (md + JSON):**

* V-1 ATH-11 (core first): four places still described the v0 placement as the profile's core mode - Hybrid 'tri-set partner, never standalone', Fat loss 'circuits only', CrossFit 'skill-integrated', weekend warrior 'optional days' (5.7, the Hybrid row of 5.6, JSON `core.mode` / `resistance.priorities`). Now OBSERVED placement + 'v1 generator: core FIRST, movable'. JSON `core.slots_wk` still held the v0 slot counts (e.g. weekend warrior 2 against 16 core sets): recomputed from the v1 core budget, v0 kept as `slots_wk_v0`.
* V-2 ATH-07 (aerobic): 19 athlete cards labelled the OFF-season count 'COACH-ANSWER ATH-07' although the coach fixed only the in-season count (2); now 'off-season (PROPOSED) / in season 2 (COACH-ANSWER ATH-07)'; powerlifting 2 marked PROPOSED; the weekend-warrior 'general' mapping marked INFERRED; legend added under 5.1; JSON `aerobic_sessions_wk.note` labelled the same way.
* V-3 PER-01 (plan shapes): the strength season family still presented '7 loading weeks + WK8 TEST/DELOAD' and '6 + MID DELOAD + 5' as the 8- and 12-week shapes. The PER-01 generator shape now leads each row and the observed shapes are marked as examples retired as defaults (md section 7, JSON `season_families.strength`, `plan_length_shapes.observed_examples.note`).
* V-4 UNI-10 consistency: the field-court in-season row fixed 'bilateral 10-20%' and the combat fight-camp row '20% or less', contradicting the per-profile in-season values (linemen, wrestling, BJJ 30/70; youth 40/60). Both rows now point to each profile's 5.11 value.
* V-5 ATH-12: the pre-season row used contrast complexes although the coach confirmed 'off-season only'. Kept (the coach's own block 2 does it) but labelled INFERRED (pre-season = late off-season), never in season; question 11.2 #12.
* V-6 ATH-02 on budgets: the ranking check passed on target mid-points only; on the v1 budgets the boxer's OBSERVED 31 fast-reactive contacts sit above wrestling (29), BJJ (28) and karate (22), against 'wrestling / BJJ > boxing = karate'. Added the finding and a PROPOSED clamp (observed budgets clamped to their band when generating; boxer = karate, about 22) - 5.12, 11.1 Q1, JSON `ath02_ranking_check.budget_check`.
* V-7 VOL-08 / VOL-16 / VOL-17 / UNI-09 (session load): only time was checked. New 5.3b exercise-count check: 18 of 27 profiles exceed the coach's exercise cap (athletes 12, resistance-only 5-7 + core = 8) when each category gets its own exercises; the fat-loss profile is also over the 60 min weight-loss cap (62, 67 with unilateral time) although the text said 'at or just under'. Unilateral time (x1.5) added. PROPOSED consolidation rule added to 5.3b and assembly step 7; headline 21 corrected; question 11.2 #11; JSON `session_load_check` and `derived.est_exercises_per_main_day / exercise_cap / exercise_cap_check / est_minutes_per_main_day_unilateral_x1_5`.
* V-8 VOL-09 / LIB-16 / LIB-14 / UNI-01 (credit): the exercise-level credits the coach gave (dips 0.5 triceps + 0.5 chest; thrusters 1.0 quads + 0.5 shoulders) were missing; added (5.6 text, JSON `muscle_credit_rules`). The hinge double credit (hamstrings 1.0 + glutes 1.0 on BHD / UHD) was unlabelled: now marked INFERRED, question 11.2 #13.
* V-9 VOL-01 / VOL-02 / VOL-03: the v0 'target sets/muscle/wk' bands in 5.6 (e.g. boxing 'small 1-6') could be read as generator targets; marked descriptive-only and retired as targets; JSON gets `muscle_volume_targets` (10-12 / 15-20 / 20+, 15-20 / 20-25 landmarks, priority +4-6 cap 25-30, pain -30-50%, person-based 3/5/7%) and `resistance.sets_bands_status` per profile.
* V-10 CAT-11 (plyo method stages): the library-gap row asked for 'a method stage per item', i.e. a fixed exercise property; reworded - the stage is a way of performing a jump chosen per block, only name-fixed items (e.g. 'Stick the landing') carry a default; the CAT-11 rule added to the method-stage rules (md section 4, JSON `plyo_method_stages.rules`, `library_gaps`).
* V-11 ATH-03: ATH-03 group membership lists did not match the profiles' own `ath03_group` (wrestling listed in both 'resistance' and 'combat'; hockey, football big-skill, CrossFit, hybrid and distance runners missing). Lists aligned (section 3 item 10, JSON `ath03_groups`).
* V-12 ATH-09 / EQ-03: the older-adult variant was titled '65+' while the threshold is PROPOSED 60+ (not given by the coach) - retitled. General-population card said it used 'ground-contact class 5' although the profile has no class: reworded (plyos only if asked; class-5 split used only as a default for the residual ankle hops / throws).
* V-13 LIB-13 / ATH-10: push jerk appeared only at L3 in the Olympic-by-level rule while the coach calls it intermediate / advanced: L2 now introduces it (md 5.5, JSON `olympic_by_level.L2`).
* V-14 EQ-11 / EQ-13 / CAT-04 / CAT-05: HIGH_VOLUME_CONSTRAINT now cites the 1-5 constraint scale (4-5) and the coach's GHD / reverse-hyper condition ('if available and they feel the right muscles'); the level rule now spells out Davidson's rotation biases (vertical = external-rotation bias, horizontal = zone 2 internal-rotation, compressive) and that levels are a guide only.
* V-15 'Still pending' list and section 11.2 extended with the new PROPOSED items (questions #11-13).

**Not changed (noted):** golf sits in the 'general' season family (no seasons) while its card carries in-season content - pre-existing v0 modelling choice, outside the coach answers. The JSON `observed_populations[6].source_key` keeps 'BYOP JUSTICE LEAGUE' because it is the decode's source key, not a program name.

**Build-script caveat:** these fixes were applied directly to `04_athlete_profiles.md` and `04_profiles.json` (Edit and python). `synthesis/_build_04/` (render.py, profiles_v1.py, build_profiles.py) was NOT patched, so re-running `python3 render.py` would revert them until the same changes are made in the scripts (flagged in JSON `_meta.post_render_edits`).

## v1 verification log - pass 2 (2026-10-08)

Second adversarial check of the v1 update (this file and `04_profiles.json`), run after the first pass above. Method: `coach_answers_full.md` (140 questions, 138 answered) and `coach_answers.md` re-read in full; every answer that bears on profiles traced into the tables, cards, season families, injury library and the JSON, not only the changelog; the retired-idea grep repeated over both files (python regex over every md line and every JSON string); per-muscle sets, weekly totals, bilateral and plyo shares recomputed with python from `profiles[].weekly_sets` and `muscle_credit_map`; the proposed season multipliers simulated on the 12 field-court profiles. No Google Sheet was opened.

**Answers relevant to profiles (traced):** CAT-02, CAT-04, CAT-05, CAT-06, CAT-08, CAT-09, CAT-10, CAT-11, CAT-13; UNI-01 to UNI-12; VOL-01, VOL-02, VOL-03, VOL-04, VOL-05, VOL-07, VOL-08, VOL-09, VOL-10, VOL-11, VOL-12, VOL-13, VOL-15, VOL-16, VOL-17, VOL-18; PER-01 to PER-11; ATH-01 to ATH-13; ORD-01 to ORD-11; EQ-01, EQ-03, EQ-04, EQ-05, EQ-06, EQ-07, EQ-08, EQ-10, EQ-11, EQ-12, EQ-13, EQ-14, EQ-15, EQ-16; GEN-02, GEN-04, GEN-05, GEN-08; LIB-02, LIB-04, LIB-06, LIB-07, LIB-08, LIB-09, LIB-13, LIB-14, LIB-16, LIB-18, LIB-19, LIB-20, LIB-21, LIB-22; PRG-03 to PRG-07, PRG-09 to PRG-12; FIX-03. Not profile-relevant (engine, product or library only): CAT-01, CAT-03, CAT-07, CAT-12, VOL-06, VOL-14, EQ-02, EQ-09, GEN-01, GEN-03, GEN-06, GEN-07, LIB-01, LIB-03, LIB-05, LIB-10 to LIB-12, LIB-15, LIB-17, PRG-01, PRG-02, PRG-08, FIX-01, FIX-02, FIX-04. Everything not listed below was found correctly reflected (pass 1 fixes V-1 to V-15 re-checked and still in place).

**Retired-idea sweep (both files):**

* Size-based 3 / 5 / 7% mapping: no rule left; every mention is the person-based rate (VOL-04 / VOL-05 / UNI-05; md sections 'Still pending', assembly step 3, 5.13 pro row; JSON `assembly_rules[2]`, `muscle_volume_targets.weekly_rate`, `competition_level.pro`).
* 0.5 helper credit: none in `muscle_credit_map` (helpers 0.25); remaining 0.5 values are the coach's own exercise overrides (dips 0.5 triceps + 0.5 chest - LIB-16; thrusters 0.5 shoulders - LIB-14).
* Band / chain / weight-releaser substitutes: none; hits are OBSERVED citations marked out of scope and the 'no bands' / 'never band chops' rules.
* Plyo zones as an exercise property: none; only 'NOT a plyo zone' (CAT-11) and the Davidson rotation-zone definition (CAT-04 / CAT-10).
* Core after the power block as the default: none; the v0 / OBSERVED placements are labelled as replaced by core-first (ATH-11).
* Sex-based rules: none; hits are the retirement notes, v0 question 14 and the SCIENCE trial populations.
* 'Justice League' as a program name: none; only the cited sheet-tab name, the changelog and the logs. Cross-file: `09_generator_inputs.md` (2 hits) and `generator_spec_v0.json` (1 hit) still use the retired profile id `athlete_generic` - outside this file's scope, flagged for their owners.
* Hack squat ranked last: none ('no machine ranking', EQ-11).
* 6 weeks = 5 + deload: none; 4-6-week plans are maintenance / transition (PER-01); the observed 7 + 1 and 6 + 1 + 5 shapes are labelled examples retired as defaults.

**Problems found and fixed in this pass (md + JSON):**

* P-1 PER-08 (pre-season 'more speed / power, less volume'; in season 'about 2 days, low volume' - both confirmed RIGHT): the field-court season multipliers still came from the observed baseball year and RAISED volume - simulated on the 12 field-court profiles, pre-season added about +16% weekly sets (resistance 1.08 rising +3-4%/week, PLYO 1.45, core 1.35) and in season kept about 93-104% of the off-season sets (resistance 1.0 at 4 days, PLYO 1.3, core 1.4); softball had no override so it inherited them, and baseball's override was text only. Re-based (PROPOSED numbers): pre-season resistance 0.8, PLYO 1.2 capped at the band, core 1.0, sprint up to +50% (weekly sets -3 to -12%); in season resistance / core 0.5, PLYO 0.4, JLK / BALL 0.5, THROW 0.6, sprint 1.0 for speed athletes and 0.6-0.8 for others (weekly sets -49 to -54%). The observed numbers stay as evidence (`multipliers_observed`); baseball and softball cards point to the new defaults; headline 9 updated; question 11.2 #14.
* P-2 ATH-01 / CAT-10: the new BALL (ballistic) category had no multiplier in any season phase, so 'start ballistic, then plyometric' had no number. BALL added to every field-court and combat phase (1.0 early off-season, 0.5 in season and combat base, 0 post-season; PROPOSED).
* P-3 ATH-10 / CAT-10 / PER-01 (combat base phase): TE 0 contradicted 'everyone in athletic training gets Olympic lifts' - now 0.5 = L1 variants (dose PROPOSED); optional stage-1 landing drills noted; the observed 2-week base is reconciled with the PER-01 8-week shape (about 4 adapt weeks unless a fight date forces less; PROPOSED).
* P-4 PER-01: the physique family presented the observed 4-week FAT BURN building block as a phase while stand-alone 4-6-week plans are maintenance / transition at 50-70% volume; now used only as weeks inside an 8- or 12-week plan (INFERRED).
* P-5 VOL-15: the rep-zone legend (md section 4, JSON `scales.resistance_rep_zones.MYO`) still said restricting MYO to machines / isolation was 'INFERRED, not the coach's rule' although the coach confirmed it; reworded (the free-weight MYO squat is an OBSERVED exception).
* P-6 UNI-11 / ORD-06: the 5.6 pairing column read 'hinge + pull dominant' (wrestling) and 'pull dominant' (BJJ), i.e. a hip + pull pairing the coach rejects; now 'emphasis' plus the hip + push / knee + pull pairing; general population, youth and distance runner pairings made explicit.
* P-7 ATH-10 vs EQ-03: everyone in athletic training gets Olympic lifts, but older / injured / high-volume clients never snatch - INFERRED resolution (hang pulls, high pulls, hex-bar jumps, KB swings; no DB / KB snatch), question 11.2 #15; and the sport rows' Olympic names (power clean, hang snatch) are now marked as L2+ defaults (L1 gets the L1 list) in 5.5 and `profiles[].triple_ext.level_note`.
* P-8 PER-04: the powerlifting profile's observed conjugate squats twice in a squat week; the axial-once-a-week rule is now applied in the card and JSON `resistance.axial_rule` (second lower day non-axial unless peaking; INFERRED), question 11.2 #16.
* P-9 VOL-01 / VOL-02: the Aesthetics 12-week PPL variant carried the observed 20-35 sets per muscle with no cap; now capped at the coach's landmarks (advanced 20+, growth 20-25, priority up to about 25-30).
* P-10 VOL-08 / VOL-16 / UNI-09: the older-adult variant's SCIENCE '8-10 exercises' now yields to the coach's resistance-only cap (about 5-7 + core first, 45-60 min).
* P-11 EQ-11: the bodybuilding priorities quoted the sheet's 'LOVE IT' machine notes as a selection reason; now labelled OBSERVED opinions, not a ranking.
* P-12 EQ-05 (RIGHT, seated machine shoulder press for older / injured clients) was missing; added to the older-adult variant and HIGH_VOLUME_CONSTRAINT.
* P-13 VOL-07 vs UNI-02: 'add the set to the first exercise' (usually the bilateral lift) would push field / COD athletes toward bilateral against their 20/80 -> 10/90 target; PROPOSED rule in 5.11 and JSON `bilateral_unilateral_model.engine`: the share target decides where an added set goes.
* P-14 Numbers: `build_profiles.derive()` rounds per-muscle sets inside the summing loop, so 45 JSON values (29 cells of the 5.6 table) were 0.1 off (e.g. boxing biceps / triceps 3.6 -> 3.5, baseball glutes 14.7 -> 14.6, rear delts 7.1 -> 7.2, powerlifting chest 13.4 -> 13.5); re-summed with one final rounding - md table and JSON now match the recomputation exactly (0 mismatches).
* P-15 'Still pending' list, section 11.2 (#14-16), JSON `v1_pending`, `open_questions.new_v1` and `verification_log_v1.pass_2` updated.

**Not changed (noted):** golf sits in the 'general' season family while its card carries in-season content (v0 modelling choice). GEN-05 (adjust from logged effort, RIGHT) vs GEN-03 (the coach is unsure people should track with the tool) is a product question for the generator docs, not a profile rule. `_build_04` scripts are still unpatched (pass 1 caveat applies to pass 2 as well, including the rounding bug in `derive()`); re-running `render.py` would revert both passes.
