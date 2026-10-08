# BLAZE CAMP BRAIN: how Blaze Camp programs (the model)

**What this is.** The master document of the Blaze Camp model: how the coach (Blaze Camp, IG @BLAZECAMP) thinks about programming, decoded from his two workbooks ('BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL' and 'BLAZE CAMP MASTER MODEL') and his own answers. It is written for two readers. The coach should be able to check every rule against what he believes. The engineer should be able to build the program generator (client enters basic info → 6-, 8- or 12-week plan in this coach's style) from it, with `generator_spec_v0.json` as the machine-readable twin of section 13.

**Version.** v1, 2026-10-08. Built from `coach_answers.md` (read first; authoritative), every file in `synthesis/` (01-11, incl. the equipment team's 10, 10b, 11) and `analysis/equipment/ordering_audit.md` sections 1 and 4. Nothing in Google Sheets was opened for writing.

---

## 0. How to read this

### 0.1 Evidence tags (on every rule)

| Tag | Meaning | Weight |
|---|---|---|
| **[COACH]** | The coach's written answer in `coach_answers.md` (cited CAT-01 … CAT-09). | Authoritative. Overrides everything below it. |
| **[CHAT]** | The coach's spoken statements relayed in the brief (close paraphrase, not a transcript). | Authoritative in meaning; exact wording not certified. |
| **[OBS]** | Read from a sheet cell, colour, dropdown or count. Labels are quoted verbatim with his typos ('TRIPPLE', 'SAGITAL', 'INTERMIDIATE', 'DOMNANT', 'ABdution', 'CLERANCE', 'RECCOMENDED'). Our own names use correct spelling. | Strong, but the sheets are partly unfinished ('(NOT DONE)' tabs, mostly empty BYOP templates). |
| **[INF]** | The team's derivation. A default the coach must confirm before it is shown to clients as his rule. | Weakest. Every [INF] number is a configurable default. |
| **[SCI]** | Published evidence (references in `07_science_lineage.md` §18 and `10b_equipment_variables_science.md` §12). | Used to fill gaps and flag tensions, never to overrule [COACH]/[CHAT]. |

**Cell shorthand.** BYOP = 'BUILD YOUR OWN PROGRAM' workbook; MM = 'BLAZE CAMP MASTER MODEL'; LIB = BYOP 'MASTER EXERCISE LIBRARY' (bare cells like `AI98` are LIB); JL = BYOP 'JUSTICE LEAGUE'; 4T = MM '(NOT DONE) 4 TRACKS PROGRAMMING'; SQ = MM 'ALL ABOUT SQUATS'; RP-tab = MM '(NOT DONE) RESISTANCE PATTERNS '; BA = '(NOT DONE) ALL ABOUT BALLISTICS'; LU = '(NOT DONE) ALL ABOUT LUNGES'; OL = '(NOT DONE) ALL ABOUT OLYMPIC LI'; AE = 'AEROBIC CAPACITY CHEAT SHEET'; S23 = 'Sheet23'; CF = 'EXAMPLE CROSSFIT SPLIT'; MM 00/05/07 = 'EXAMPLE UPPERLOWER SPLIT' / 'EXAMPLE ATHLETIC FULL BODY SPLI' / 'EXAMPLE BOXING 8 WEEK BUILD UP'; UL / PPL = the MM upper/lower and push/pull/legs examples.

### 0.2 Where the full version of each section lives

| Section here | Full version (synthesis/ unless noted) |
|---|---|
| 1 Philosophy | `coach_answers.md`; 01 §0; 07 §0 |
| 2 Segmentation model | `01_taxonomy.md` / `.json` (88 nodes, 42 facets, 634-row crosswalk) |
| 3 Library, counts | `02_exercise_catalog.md` / `.json` (901 records), `02_no_equipment_subset.md`, `02_exercise_catalog_crosswalk.json` |
| 4 Levels: Davidson zone model | `10_equipment_model.md` §1.4; `11_training_variables.md` §1.2 |
| 5 Volume & dosing | `03_volume_dosing.md` / `03_volume_rules.json` |
| 6 Bilateral vs unilateral | `11_training_variables.md` §3.7; `ordering_audit.md` N3/N18; `05_session_architecture.md` §4.1 |
| 7 Training variables | `11_training_variables.md` / `.json`; `10b_equipment_variables_science.md` |
| 8 Equipment & constraint | `10_equipment_model.md` / `.json`; `10b` §1-3, §9 |
| 9 Athlete/goal emphasis | `04_athlete_profiles.md` / `04_profiles.json` |
| 10 Session & week templates | `05_session_architecture.md` / `05_templates.json`; `analysis/equipment/ordering_audit.md` |
| 11 Periodization | `06_periodization.md` / `.json` |
| 12 Science lineage | `07_science_lineage.md`; `10b` |
| 13 Generator | this file + `generator_spec_v0.json`; intake form `09_generator_inputs.md` |
| 14 Gaps & questions | `08_open_questions_for_coach.md`; `coach-questions.html` (140 questions) |

The requested 10-part structure maps as follows: 1 Philosophy = §1; 2 Segmentation = §2; 3 Library = §3 (+ §4 levels); 4 Volume & dosing = §5 (+ §6 bilateral/unilateral, §7 training variables); 5 Emphasis matrix = §9 (+ §8 equipment); 6 Templates = §10; 7 Periodization = §11; 8 Lineage = §12; 9 Generator = §13; 10 Gaps & questions = §14. The four extra sections asked for are §6 (bilateral vs unilateral), §8 (equipment & constraints), §7 (training variables) and §4 (Davidson zone model for levels).

### 0.3 The coach's answers and what they changed (corrections to the synthesis files)

| ID | Coach's answer (`coach_answers.md`) | Effect on the model | Synthesis files corrected here |
|---|---|---|---|
| CAT-01 | Tag every exercise on all lenses at once: "this is the whole taxonomy of each exercise ... we can segment by whatever we need ... This is huge." | One record per exercise carrying every facet (family, pattern, laterality, plane, zone, implement, constraint, muscles, level, intent). Volume is credited by the exercise picked, not by the slot. | none (01/02 already do this) |
| CAT-02 | Big = quads, glutes, hamstrings, lats/upper back, chest. Small = biceps, triceps, side/rear delts, calves, forearms, abs. "That's right." | Size classes for reps and the 3/5/7 % ramp: big-lower 3 %, big-upper 5 %, small 7 % [INF mapping]. Front delts, traps, adductors, neck stay **unplaced** (indirect credit only). | **06 and 07 (rule 20) "MEDIUM 5 %" tier for triceps/side delts is retired**; 03 "front delts = small" becomes "unplaced". |
| CAT-03 | "Biomechanics is just the definition of the whole thing; it doesn't have its own bucket of exercises." | Biomechanics is the variable grammar of every exercise, not a category. | 01 §0/§4.1 reading "biomechanics as a lens bucket" is reworded: biomechanics organises multi-joint work, but no exercise bucket is called biomechanics; the FUNCTIONAL 'BIOMECHANICS SYSTEM' column is treated as a core/anti-rotation bucket. |
| CAT-04 | Level = skill + stability demand **and load positioning**: front-loaded = foundational; on the body = intermediate; behind the body = advanced; Davidson zones 1 (low, close) / 2 (horizontal) / 3 (overhead); machines/cables make it easier. | New position-zone field; operative exercise levels (20 overrides); explains arm 'Zone 1/2/3' labels and "horizontal before vertical" [INF link]. (§4) | 02 catalog `level.primary` must be replaced by the operative level for 20 items (C-17). |
| CAT-05 | Levels add options, never remove them. "The levels are still very theoretical, so we don't need to rely heavily on them." | Level is a soft eligibility ceiling and a ranking input, never a gate; never a variation engine. | 06 "promote a tier at block boundaries" becomes optional (VP-12). |
| CAT-06 | Client level and exercise level are separate axes. "That's right." | Client level sets the dose; exercise level is chosen per slot. | none (confirms the sheets) |
| CAT-07 | BYOP MASTER EXERCISE LIBRARY = single source of truth, "as far as I was able to take it so far." | Menus come from LIB columns; reference tabs supply the variable grammar and candidate additions. | none |
| CAT-08 | Core: trunk moves on the pelvis (thorax), pelvis moves on the trunk (pelvis), then both; each in any plane. Toes to bar and Copenhagen planks are "more complicated cases". | Core = segment × plane × static/dynamic; the hard cases are tagged `both` and kept out of the foundational ladder. | 07 rule 4 / T11 "core level = plane" softened: segment first, plane as the difficulty ladder. |
| CAT-09 | Leg curls, Nordics, slider curls are **not** hip dominant: a flexion-of-the-leg segment, "kind of like bicep curls". | New segment LEG FLEXION (his own word, MM Sheet25 H11 'LEG FLEXION'); credits hamstrings, never hinge volume; 9 curl items removed from 'Bilateral HD' draws. | **01 "keep leg curls under HIP" and node RP.HD.ISO, and 03/05 bucket ISO_HAM on hip days, are renamed LEG FLEXION (ISO_LEG_FLEXION).** |
| Chat | Week to week: add sets of the same work, same load, more exercises (chest 20 → 22). | Bank-and-chunk release rule (§7.3). | 03 release at 0.75 set → 1.0 set (11 rule). |
| Chat | Don't "confuse the muscle": same exercises over a block, small variables change in the next block. | Block-fixed menus by default (VP-1); A/B weeks only as an option. | **06 hypertrophy skeletons "A/B variants every week" and 07 rule 27 / T3 "default weekly_AB" are demoted to options.** |
| Chat | Order: row before overhead pull; horizontal push before vertical push; power → power-strength → strength → resistance patterns. | House rule in the ordering algorithm (§7.5). | none |
| Chat | Bilateral vs unilateral VOLUME relationship is very important. | First-class variable with targets and a placement rule (§6). | none (new section) |
| Chat | Machines = many reference points → safer, more volume, injured/older; barbell most skilled; medball passes light 8-10 lb. | Constraint scale and client rules (§8). | 10b's 6-8 lb split for rotational/chest passes stays an option, not the default. |

Remaining cross-file disagreements and the default this document adopts are in §14.2.

---

## 1. The philosophy in one page (in the coach's own terms)

**What the coach said** [CHAT unless marked]:

* "Different athletes need different things." Basketball players need the most plyos; MMA fighters a lot (fewer than basketball); boxers and karate athletes not that many. Some populations need more resistance training, some more power and explosiveness with athletic patterns. "Play with the volume." "If you understand my library and match it to the programming you'll understand how my brain works."
* "The hardest thing is the categorization": bigger muscles, smaller muscles, biomechanics; athletic patterns, resistance patterns, core.
* Lineage: Dr. Pat Davidson + Dr. Mike Israetel + the science of training from first principles, **not** somebody's packaged model (5/3/1, Texas Method, Prilepin's chart).
* Dose: ~15-20 sets per muscle per week; more for a muscle you want to grow, fewer with injury or pain; ramp week by week by ~3, 5 or 7 % depending on muscle size; smaller muscles take more reps (you can't go heavy), bigger muscles a mix; everyone picks between 5 and 30 reps; some prefer more sets with less weight, some powerlifting style; adjust to the goal.
* Week to week: count the week's sets per muscle; to progress, do more sets of the same thing next week at the same load, with different exercises for more volume and variety (chest 20 → 22).
* Don't confuse the muscle: same exercises over the block; change small variables in the next block.
* Order: power first (athletics) → power-strength → strength → resistance patterns; row before overhead pull, horizontal push before vertical push.
* Equipment: machines have many reference points (sit, feet down, move hands or feet), so you can push a lot and it is safer: better for people going up in volume, injured or older. Barbells are the most skilled; DB, KB and medballs in between. "Speed is a variable, range of motion is a variable, load is a variable, volume is a variable." The heavier, the slower; to go fast you don't need much weight (medball passes 8-10 lb). Quality of movement matters as much as quantity.
* The bilateral vs unilateral volume relationship is very important.

**The model in twelve sentences** (each is expanded later; tags show how sure we are):

1. **Classify first, then dose.** Every exercise is a base pattern plus stacked variables, tagged on every lens at once [COACH CAT-01, CAT-03]. Family (athletic / resistance / control, plus cardio and functional) decides what quality is trained, its dose unit and its place in the session [OBS LIB row 4 'PATTERN'].
2. **A slot = CATEGORY × PURPOSE.** The CATEGORY ('Unilateral KD') is the Davidson half: a pattern and position. The PURPOSE ('Quads/Glutes') is the Israetel half: the muscle credited. The generator places patterns and audits muscles [OBS BYOP program rows; reading INF].
3. **Big muscles are organised by biomechanics, small muscles by muscle** [OBS LIB AI-AR vs AH, AS-AU; COACH CAT-02].
4. **Exercise level = skill + stability + where the load sits** (Davidson zones 1-3), made easier by machines and cables; levels only add options and are soft; client level ≠ exercise level [COACH CAT-04/05/06].
5. **One resistance skeleton, many dials.** Every BYOP template shares the same 8-pattern skeleton (knee + pull / hip + push; bilateral → unilateral → isolation; every pattern 2x/week in the 4- and 6-day templates); goals and sports swap the prefix (athletic slots, small-muscle isolation, cardio) and turn dials [OBS; reading INF].
6. **A session is a budget of about 20 working sets** (7 slots for physique, 10 for athletes at 2 sets each); athletes pay for athletic slots by dropping sets per slot and isolation, not by growing the session [OBS AESTHETICS Day 1 = 19 sets; JL Monday = 20].
7. **Fast before slow, free before constrained:** plyo → throw → COD → triple extension → bilateral lower + horizontal upper → unilateral lower + vertical upper → isolation → core → conditioning [OBS 12/12 BYOP athletic days; CHAT].
8. **Volume progresses in whole sets of the same work**, at about +0.5 set per muscle per week on average (the 3/5/7 % read as big-lower 3 / big-upper 5 / small 7 %) [CHAT + OBS whole-set steps; mapping INF].
9. **Blocks are stable; variety is small and deliberate:** fixed menus inside a block, one small variable per slot between blocks, conditioning colours rotate weekly [CHAT + OBS BYOP, BOXING weeks 3-8; his week-by-week tabs vary more, §7.4].
10. **Levels move volume in opposite directions:** gym clients add sets as they advance (UL 76 → 90 → 102 sets/week); athletes lose sets and gain intensity, specificity and throws (89 → 72 → 59, excluding throws) [OBS].
11. **The sport dial is mostly about amplitude and type of athletic work**, not a single "plyo count": rebounding / high-amplitude jumps, low-amplitude stiffness work, ballistic throws, COD, sprint, and the athletic vs resistance share [OBS boxer vs generic athlete; INF reading].
12. **A deload is the same plan, smaller** (back to about week-1 volume, intensifiers removed) [OBS]; pain is handled by substitution first (split grips, unilateral, machines), set cuts second [OBS MM 05 A6, MM 00 A7].

---

## 2. The segmentation model (tree + the three lenses)

### 2.1 Two cuts plus a variable stack

```
STEP 1  FAMILY (LIB row 4 'PATTERN'; Sheet23 codes AP / RP / CT-CP)  -> what QUALITY is trained, dose unit, session position
        ATHLETIC   'AP'  PURPOSE = a quality ('SPEED/POWER', 'CHANGE OF DIRECTION')  dosed in contacts / throws / cuts / seconds; FIRST
        RESISTANCE 'RP'  PURPOSE = a muscle ('QUADS', 'BACK', 'CHEST/FRONT DELTS')    dosed in sets x reps near failure; MIDDLE
        CONTROL    'CT'/'CP' PURPOSE = 'CORE'                                          dosed in reps / time / 'Accumulate'; primer, finisher or optional day
        CARDIO     (no code) PURPOSE = 'CARDIO'                                        self-dosing items; A/B/C colour system
        FUNCTIONAL (no code) slings / carries / drags                                  only the anterior oblique system is populated; wired to no slot
STEP 2  ORGANISING LENS inside the family
        big muscles, every multi-joint movement, all athletic and core work -> organised by biomechanics (joint dominance x laterality;
        push/pull x vector; force phase; turn angle; core segment x plane)
        small muscles -> organised by muscle: 'SIDE RAISES', 'BICEP', 'TRICEP', 'CALVES' (one unlevelled list each)
        NOTE [COACH CAT-03]: "biomechanics" is the definition of the whole thing, not a bucket of exercises.
STEP 3  EXERCISE LEVEL inside the bucket (FOUNDATIONAL / MODERATE / ADVANCED) = skill + stability + load-position zone (§4)
STEP 4  VARIABLES stacked on the base: stance, load position, 'GET INTO / OUT OF THE HIP', grip, feet/body, ROM, end range,
        bands/chains, plane perturbation, implement/constraint, tempo, intent (§7)
STEP 5  THE SLOT = PURPOSE (muscle or quality credited) x CATEGORY (bucket the exercise is drawn from)
```
[OBS structure: LIB rows 1/3/4/6, RP-tab A5:I94, S23 row 1; reading INF; CAT-03 COACH]

### 2.2 Canonical tree (stable IDs; 01 has every node with labels and level drivers)

IDs are `FAMILY.PATTERN[.LANE[.SUBLANE]]`. `[P]` = proposed node implied by his sheets with no library column yet. **Corrected per CAT-09:** knee flexion leaves hip dominant.

```
AP  Athletic patterns
    AP.TEX   Triple extension / Olympic (DRILL, PULL, PWR, SQ, JERK[P])      'TRIPPLE EXTENSION' (LIB C)
    AP.JMP   Jumping: LK limited-knee/ankle ('JUMPING ANKLE' C124 block, plate hops G44+),
             PLY landing -> box -> hurdle ('PLYOS' G), FULL ('FULL JUMPING': reactive, depth, loaded, squirrel, sprinting)
    AP.UBP   Upper-body plyos [P] (plyo push-ups)          AP.SPD  Sprint & mechanics [P] (MECH A-drills/MACH, ACC, MAXV)
    AP.THR   Medball throws: BS sagittal, ROT, INT (with a lower pattern), HIP (half-kneeling into/out of a hip), TRUNK, SPEC
    AP.COD   Change of direction (pre-planned; 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN')     AP.AGI  Agility (reactive) [no items]
RP  Resistance patterns
    RP.KD    Knee dominant: BS bilateral (squat family, AI) | UL unilateral (lunge/split squat/step-up/SL squat, AL) | ISO knee extension (AM)
    RP.HD    Hip dominant: BS bilateral (hinge/bridge/thrust/back ext., AN minus 9 curls) | UL unilateral (staggered/SL hinge, SL bridge, AQ)
    RP.LF    LEG FLEXION (knee flexion: leg curls, Nordics, slider/ball curls; AR + 9 AN items)  [COACH CAT-09; replaces RP.HD.ISO]
    RP.PU    Push: V vertical (BS, UL) | M mid-range [P] (incline, landmine, viking; 'MID RANGE PUSH' RP-tab G6) | H horizontal (BS, UL, ISO flies [P])
    RP.PL    Pull: V vertical (BS, UL, ISO pull-over/pull-under [P]) | H horizontal (BS, UL) | M mid-range [P, gap]
    RP.SM    Small-muscle isolation: DELT (SIDE, REAR [P], FRONT [P]) | TRAP [P] | BI | TRI | CALF
CO  Control (core)   CT thorax moves | CP pelvis moves | CB both  [COACH CAT-08]  x plane (SAGITAL/FRONTAL/TRANSVERSE) x static/dynamic
CA  Conditioning     A blue | B green | C orange | LC lactate clearance | BUY buy-out | WOD | CIRC circuit
FN  Functional       AOS anterior oblique (CHOP, AROT Pallof, PLANK, CRUNCH[empty]) | POS | LSS | CARRY | DRAG  (headers only except AOS)
X   Meta buckets     FOCUS ('Focus 1'/'Focus 2' -> FULL FOCUS LIST AZ) | PREP | SKILL | TEST
```

### 2.3 The three lenses and where they meet

| | Organised by biomechanics | Organised by muscle |
|---|---|---|
| ATHLETIC (AP) | everything (phase, height, base, turn, start position); PURPOSE is a quality | none |
| RESISTANCE, big muscles | KD, HD (BS/UL/ISO), LF, PU.V/M/H, PL.V/H | only through PURPOSE credit and the FOCUS menu |
| RESISTANCE, small muscles | vertical push (delts own it through 'SHOULDERS/TRAPS' AA6) | DELT, BI, TRI, CALF (one unlevelled list each) |
| CONTROL (CO) | segment × plane × static/dynamic | FOCUS 'CORE 👇' |
| FUNCTIONAL (FN) | slings, carries, drags | none |

Generator rule [INF]: **place patterns, audit muscles.** On athletic rows PURPOSE and CATEGORY are the same word ('Plyo'/'Plyo') because the purpose is a quality; on small-muscle rows they collapse too ('Bicep'/'Bicep').

### 2.4 Program slot vocabulary (BYOP) → library range → node → muscle credit

Wiring is [OBS] (data validations); credits are [INF] from his PURPOSE labels (1.0 prime / 0.5 synergist).

| PURPOSE (verbatim) | CATEGORY (verbatim) | LIB range | Node | Credit |
|---|---|---|---|---|
| 'Quads' | 'Bilateral KD' | AI7:AI122 | RP.KD.BS | quads 1.0, glutes 0.5 |
| 'Quads/Glutes' | 'Unilateral KD' | AL7:AL42 | RP.KD.UL | quads 1.0, glutes 1.0 |
| 'Quads' | 'Leg Extensions' | AM7:AM9 | RP.KD.ISO | quads 1.0 |
| 'Hamstring' | 'Bilateral HD' | AN7:AN122 (draw minus 9 curl items, CAT-09) | RP.HD.BS | hamstrings 1.0, glutes 1.0 |
| 'Hamstring/Glutes' | 'Unilateral HD' | AQ7:AQ42 (NO ACCESS tabs miswired to AR7:AR42) | RP.HD.UL | hamstrings 1.0, glutes 1.0 |
| 'Hamstrings' | 'Leg Curls' | AR7:AR10 (+ LEG FLEXION home options) | RP.LF | hamstrings 1.0 (LEG FLEXION segment) |
| 'Back' | 'Horizontal Pull' | X7:X162 | RP.PL.H | back 1.0, rear delts 0.5, biceps 0.5 |
| 'Back ' | 'Vertical Pull' | U7:U122 | RP.PL.V | back 1.0, biceps 0.5 |
| 'Chest' | 'Horizontal Push' (PPL also 'Incline', 'Flies', 'Dips') | AD7:AD162 | RP.PU.H (incline → RP.PU.M [P]; flies → ISO [P]) | chest 1.0, front delts 0.5, triceps 0.5 |
| 'Chest/Shoulders' | 'Vertical Push' | AA7:AA122 | RP.PU.V | front delts 1.0, side delts 0.5, triceps 0.5 |
| 'Shoulders/Traps' | 'ABdution' (PPL 'Reverse Flies') | AH7:AH42 | RP.SM.DELT (side; rear for reverse flies/face pulls) | side delts 1.0 (rear delts 1.0 for rear-delt items) |
| 'Bicep' / 'Tricep' / 'Calves' | same | AS7:AS42 / AT7:AT42 / AU7:AU13 | RP.SM.BI / TRI / CALF | target 1.0 |
| 'Plyo' / 'Throwing' / 'COD' / 'Tripple Extension' | same | G7:G162 / K7:K87 / L7:L242 / C7:C242 | AP.JMP / AP.THR / AP.COD / AP.TEX (C124 picks = AP.JMP.LK) | athletic exposure only |
| 'Core' | (blank) | O7:O283 | CO.CT / CO.CP / CO.CB by pick | abs/obliques 1.0 |
| 'Cardio' / 'Aerobic Capacity' | (blank) | B7:B122 (B7:B335 only in BOOTCAMP - OPTION 2 E7/E12/E22/E27) | CA | bouts |
| 'Focus 1' / 'Focus 2' | (blank) | AZ7:AZ335 | X.FOCUS | the muscle the client picks |

**A slot fixes the library column, not the movement** [OBS]: 27 item groups sit in another node's column (leg extension machines in all three AI blocks; 9 of 33 AN options are knee-flexion curls; flies in AD; push press/jerk and thrusters in AA; 'KB Face Pulls ' in VERTICAL PULL; front raises and reverse flies in 'ABdution'; plyo push-ups and max-velocity sprinting in PLYOS). **Credit volume by the exercise picked** (01 §6.2).

### 2.5 Big vs small muscles and dose classes

| Class | Muscles | Rule | Evidence |
|---|---|---|---|
| BIG | quads, glutes, hamstrings, lats/upper back, chest | several pattern lanes each, levelled lists; reps "a mix" | [COACH CAT-02]; [OBS] LIB structure; FULL FOCUS LIST splits 5 big / 5 small |
| SMALL | biceps, triceps, side delts, rear delts, calves, forearms, abs | one unlevelled list each; more reps | [COACH CAT-02]; his own label 'SMALLER ISOLATIONS' (MM BASEBALL C19) |
| UNPLACED | front delts, traps, adductors, hip abductors, erectors, neck, rotator cuff | indirect credit only; no own weekly target until placed | not in CAT-02; no LIB group (gap) |

Dose follows **size × exercise class**, not size alone [OBS]: BIG_COMP (squats, hinges, lunges, presses, rows, pull-ups: 6-15 reps, levels); **BIG_ISO** (leg extension, leg curl, flies, straight-arm pull-down: dosed like small muscles: 2 × '20 Reps' AESTHETICS D9, 'MYO SET' JL G12, 15 → 40 in FAT BURN, but '3x8' in the 4T strength block); SMALL_ISO (15-20, 'MAX REPS', 30-40 in fat loss; but PPL side raises 3 × 15 → 4 × 8 → 4 × 8 by level and 'TATE PRESS' '3x20' in STRENGTH-12); SMALL_COMP (dips, upright rows, push press); CONTROL (time, 'Accumulate', reps); ATHLETIC (contacts, throws, cuts, bouts). The coach's own column names are 'COMPOUND' vs 'SMALLER ISOLATIONS' (MM BASEBALL B19:C19).

### 2.6 Facets that must be separate fields (one meaning per field)

| Facet | Why it must be split | Values |
|---|---|---|
| `position_zone` | 'ZONE' has five meanings [OBS] | 1 / 2 / 3 (Davidson load position, §4) |
| `library_level` / `operative_level` | LIB row 3 'ZONE' holds 'EASY'/'MODERATE'/'HARD'/'ADVANCED'/'FOUNDATIONAL'/'ANY' | F / I / A (+ any) |
| `plyo_zone` | S23 C34:D36 'ZONE 1' 'Receive pause/creat' → 'ZONE 2' 'Receive/create' → 'ZONE 3 ' 'Repeat receive create' | Z1 / Z2 / Z3 |
| `arm_zone` | 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (AS12); explained by CAT-04 as arm position | 1 / 2 / 3 |
| `aerobic_colour`, `energy_zone` | AE 'A'/'B'/'C' + 'LACTATE CLERANCE'; BASEBALL 'SPEED ENDURANCE' '>40 Secs' / 'SPEED POWER' '10-39 Secs' / 'SPEED STRENGTH & POWER' '0-12 Secs' | A/B/C/LC; SE/SP/SSP |
| (do not use) | S23 column-A 'ZONE 1/2/3' row bands (A2:A28) follow row position, not load position (its ZONE 1 rows hold overhead lifts) | unresolved (CAT-10) |
| `plane_motion` vs `plane_demand` | 'BILATERAL FRONTAL' = squat + hip band; 'BILATERAL TRANSVERSE' = squat + rotating strap; 'Stance loads the FRONT TO BACK' / 'Load position loads UP/DOWN & SIDE2SIDE' / 'Movement orientations/guidance loads AROUND' (LU A17:A19) | sagittal / frontal / transverse / multi |
| `stance` vs `load_laterality` | two independent axes: stance BS / UL / alternating / staggered / offset; load contralateral = 'GET INTO THE HIP', ipsilateral = 'GET OUT OF THE HIP' (RP-tab C19:C26); 'Split stance ALWAYS contralateral' (G83) | enums |
| `core_segment`, `core_mode` | [COACH CAT-08]; CONTROL PATTERNSCORE 'CORE THORAX' / 'CORE PELVIS' / 'BOTH' × 'DYNAMIC'/'STATIC' | thorax / pelvis / both; static / dynamic |
| `force_phase`, `intent_type` | BA row 24 'TAKING IN FORCES' → 'DELIVER FORCES FAST' → 'AMORTIZATION OF FORCES' → 'REBOUNDING '; BA A22/D22 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' vs 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' | P1-P4; ballistic / plyometric |
| `difficulty_driver` | "harder" means something different in every bucket [OBS]: Olympic = technical complexity and start position; jumps = height, base, load, contact type; COD = turn angle; upper resistance = remove support (seated → Z floor → kneeling → standing → inverted); lower bilateral = load position front → back; unilateral and isolation = no tiers, difficulty from stance × load position × load laterality; core = segment and plane | per node |

---

## 3. The library: what is in it, counts, how levels work

### 3.1 The live library is the single source of truth [COACH CAT-07]

The BYOP 'MASTER EXERCISE LIBRARY' (LIB) is laid out as one column per bucket, with header rows that carry his grammar [OBS]: row 1 = bucket name ('BILATERAL KNEE DOMINANT'), row 3 'ZONE' = difficulty label per column ('EASY', 'MODERATE', 'HARD', 'ADVANCED', 'FOUNDATIONAL', 'ANY'), row 4 'PATTERN' = family ('ATHLETIC', 'RESISTANCE', 'CONTROL', 'CARDIO', 'FUNCTIONAL'), row 6 'PURPOSE' = quality or muscle. Level blocks run down each levelled column (FOUNDATIONAL → MODERATE/'INTERMIDIATE' → ADVANCED).

| LIB columns | Bucket (verbatim) | Levelled? | Notes |
|---|---|---|---|
| B | 'CARDIO' | blocks (incl. DISTANCE / SPEED TESTS, 'CALORIES' 10-50 cals) | rows B123:B141 reachable only from BOOTCAMP 2 |
| C | 'TRIPPLE EXTENSION' (+ 'JUMPING ANKLE' block from C124) | yes | hang pulls → power → full Olympic lifts; BW squat-to-calf-raise drills |
| G (+ J 'FULL JUMPING') | 'PLYOS' | yes | landings → box → hurdles; ADVANCED holds squirrel jumps, max-velocity running, DB plyos |
| K | 'THROWING' | no ('AP - THROWING') | 20 medball throws, R/L pairs |
| L | 'CHANGE OF DIRECTION' | 'EASY TURN' / 'MOD. TURN' / 'HARD TURN' | receiver route tree + 'Shuffles', 'LEFT TEST', '5-10-5' (stored as a date) |
| O-Q / R-T | 'CORE THORAX' / 'CORE PELVIS' | by plane (SAGITAL easy → FRONTAL → TRANSVERSE hard) | the 'BOTH' region exists only in MM CONTROL PATTERNSCORE |
| U / X | 'VERTICAL PULL' / 'HORIZONTAL PULL' | FOUNDATIONAL + ADVANCED (no middle tier) | FOUNDATIONAL vertical pull = 9/12 machines (on-ramp) |
| AA / AD | 'VERTICAL PUSH' / 'HORIZONTAL PUSH' | yes (VPUSH no middle tier) | push press/jerk filed FOUNDATIONAL (conflict, §4.5) |
| AH | 'SIDE RAISES' (slot 'ABdution') | no | mixes side, rear and front delt work |
| AI / AL / AM | 'BILATERAL KNEE DOMINANT' / 'UNILATERAL KNEE DOMINANT' / 'LEG EXTENSIONS' | AI levelled; AL, AM not | leg press, pendulum, hack filed ADVANCED |
| AN / AQ / AR | 'BILATERAL HIP DOMNANT' / 'UNILATERAL HIP DOMINANT' / 'LEG CURLS' | AN levelled; AQ, AR not | 9 knee-flexion items inside AN (now LEG FLEXION) |
| AS / AT / AU | 'BICEP' / 'TRICEP' / 'CALVES' | no | small-muscle lists |
| AV / AW / AX / AY | SETS / REPS / EFFORT / 'FEELING' menus | - | logbook dropdowns (§3.5) |
| AZ | FULL FOCUS LIST ('MUSCLE FOCUS OPTIONS') | by muscle header ('QUADS 👇' … 'CALVES 👇') | 51 items under 10 muscle headers; feeds 'Focus 1'/'Focus 2' |
| BA / BB | 'CARRY' / 'DRAGS' | headers only | sub-headings 'PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; 'SAGITAL', 'FRONTAL'; no exercises |
| BC-BE | 'FUNCTIONAL BIOMECHANICS SYSTEM': 'ANTERIOR OBLIQUE SYSTEM' / 'POSTERIOR OBLIQUE SYSTEM' / 'LATERAL SUBSYSTEM' | AOS levelled by position ('chop down' → 'midline' → 'up') | only AOS has items (12 chops on a 3 × 4 grid, 4 Pallof holds, 1 plank); no dropdown reads them |

Reference tabs ([OBS], several hidden: see §14.1) supply the variable grammar and candidate additions: Sheet23 (flat precursor library with 'LEVEL - FAMILY - SYMMETRY - PATTERN' headers such as 'FOUNDATIONAL - RP - BS - VERTICAL PUSH'), RESISTANCE PATTERNS (variable blocks), ALL ABOUT SQUATS (load ladder, menus, machine ratings, band/chain diagnosis), BALLISTICS (force phases, MEDBALL CHEAT SHEET), OLYMPIC (start-position ladder), LUNGES (stance/load/orientation triad), AGILITYCOD (COD vs agility), CONTROL PATTERNSCORE (core grid), AEROBIC CAPACITY CHEAT SHEET (colours).

### 3.2 Counts (from `02_exercise_catalog.json`, 4,009 source rows merged into 901 records) [OBS counts; tags INF]

| record_type | n | | status | n |
|---|---|---|---|---|
| exercise | 641 | | live library, selectable in a BYOP dropdown | 359 |
| conditioning prescription | 68 | | live library, no dropdown reads it | 29 |
| test | 14 | | reference tabs only | 286 |
| drill | 14 | | program tabs only | 227 |
| complex (superset / contrast / circuit) | 63 | | | |
| generic choice ('X or Y') | 30 | | | |
| modifier (stacked variable) | 55 | | | |
| heading / rule | 16 | | | |

Exercise-like records (737) by family: ATHLETIC 244 (89 selectable), RESISTANCE 312 (217), CONTROL 81 (18), FUNCTIONAL 20 (0 selectable), CARDIO 80 (34). By minimum equipment tier: T0 bodyweight/household 265, T1 minimal kit 69, T2 home weights 230, T3 gym 173. Laterality: bilateral 418, unilateral 156, alternating 68, n/a 95. Plane: sagittal 544, transverse 86, frontal 46, multi 41.

| Pattern (catalog code) | Records | Selectable | F / I / A / any / unrated |
|---|---|---|---|
| BKD bilateral knee dominant | 48 | 34 | 13 / 12 / 16 / 3 / 4 |
| UKD unilateral knee dominant | 21 | 14 | 0 / 1 / 0 / 15 / 5 |
| KEXT leg extensions | 3 | 1 | 1 / 0 / 0 / 2 / 0 |
| BHD bilateral hip dominant | 36 | 29 | 11 / 9 / 9 / 2 / 5 |
| UHD unilateral hip dominant | 13 | 10 | 9 / 1 / 0 / 2 / 1 |
| KFLEX leg curls (now LEG FLEXION; + 9 AN items) | 5 | 2 | 0 / 0 / 0 / 2 / 3 |
| HPULL / VPULL | 32 / 29 | 18 / 23 | 6/5/10/5/6 ; 13/0/7/4/5 |
| HPUSH / MRPUSH / VPUSH | 31 / 5 / 26 | 26 / 1 / 18 | 6/5/9/7/4 ; 0/4/0/1/0 ; 6/0/7/5/8 |
| SHLD / BIC / TRI / CALF | 21 / 20 / 16 / 6 | 14 / 14 / 9 / 4 | almost all 'any' |
| CT / CP / CB core | 32 / 24 / 23 | 12 / 6 / 0 | 12/10/3 ; 9/6/4 ; 6/4/4 |
| PLYO / ANKLE / TX | 90 / 13 / 40 | 38 / 10 / 16 | 10/27/32 ; 10/0/0 ; 7/11/12 |
| THROW / COD / SPRINT | 40 / 16 / 10 | 16 / 9 / 0 | throws unlevelled; COD 7/3/2 by turn; sprint has no BYOP slot |
| CARDIO | 80 | 34 | 10/2/16/34/18 |
| AOS functional | 17 | 0 | 9/4/4 |

### 3.3 Library vs real usage [OBS]

* Only 358 of the 737 exercise-type records can be picked from a BYOP dropdown; 228 exist only in MM reference tabs and 134 only in program tabs. The program-only ones are heavily used: 'SL RDL' / 'Single Leg Deadlift' (49 uses), 'JM PRESS', 'Neutral grip lat pull down', 'Pull under' (16 each), 'Hang cleans/snatch @ %' (12 each), seal rows, A-drills, bike/row/ski calorie sprints, slider hamstring runners. **What he writes is about twice what BYOP offers.**
* His staples (uses across all programs, incl. inside complexes): Front Squat 66, Deadlift (implement unnamed) 65, Single-Arm DB/KB Row 60, Pull-up 54, DB Lateral Raise 52, SL RDL 49, Staggered-Stance DL 48, Barbell Bench 48, Leg Press 45, Leg Extension 45.
* Only 145 of the 322 selectable library exercises appear in any of his programs; for the other 177 every dose default is a guess [INF].
* Every muscle, implement, skill, impact and rep-range tag is [INF] (322/322 selectable records). Only 81 of 322 have a coach video link.
* 93 hand-reviewed duplicate merges; 34 exercises repeated across BYOP dropdown cells; 37 records cross-filed under more than one pattern (thrusters in VERTICAL PUSH and KNEE DOMINANT; dips chest vs 'TRICEP 👇'; side plank under thorax and pelvis).
* Coach preference conflicts inside the library [OBS SQ G35:I41]: hack squat "I PERSONALLY DON'T LIKE IT" but selectable at MODERATE and ADVANCED; leg press and pendulum 'LOVE IT' but only in the ADVANCED knee-dominant block; V-squat ("I don't presercibe the use of these, ever") correctly absent; 'WEIGHT RELEASERS' 'I HAVE NO IDEA' still listed as a loading variable.
* Data hygiene: Sheets turned '12/12', '8/8', '6-8', '3-4' and the 5-10-5 shuttle into dates. Store reps as text.

### 3.4 Exercise = base + stacked variables [OBS RP-tab, SQ, LU; COACH CAT-01/03]

He writes exercises in a fixed word order: 'Box *ANY Squat touch & go reverse banded' (RP-tab A27), 'Front racked db or kb contralateral loading' (C24), 'RFE & FFE contralateral lunge double DB front rack loaded'. RESISTANCE PATTERNS lists the variables as colour-graded blocks (green → yellow → red): 'FEET POSITIONING VARIATIONS', 'GET INTO THE HIP' / 'GET OUT OF THE HIP', 'LOW/MID LOADING VARIATION' vs 'HIGH LOADING VARIATION', 'HAND PLACEMENT', 'FEET POSITION', 'STANCES', 'ROM VARIABLE', 'END RANGE BEHAVIOR VARIABLE', 'LOADING VARIABLES'. The catalog stores 55 such modifiers so the generator can create variety by attaching one variable instead of storing every combination. Render template [INF]: `[INTENT] [ACCOMMODATING] [STANCE/ROM tool] [LATERALITY] [IMPLEMENT] [LOAD POSITION] [PATTERN] [GRIP] [FEET] [END RANGE]`.

### 3.5 The logbook menus (the client's feedback channel) [OBS LIB AV:AY]

* SETS 1-8 + 'SUPERSET W/ 👇' (never used in a filled cell).
* REPS '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'. No 1-3, no 25-30, no per side, no seconds, metres, contacts or calories (gap, N-OUT-01).
* EFFORT '1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', '8 - That was perfect' (the bullseye), '9 - That was terrible', "10 - I'm done".
* 'FEELING' / 'HOW IT FELT?': 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it". Plus 'WEIGHT USED or SCORE' (free text; JL holds cues 'LATERAL', 'SINGLE ARM', 'OUCH') and 'DONE?'.
* No client has logged anything yet (every EFFORT cell reads 'CHOOSE 👇'); every feedback rule is designed, not observed.

### 3.6 How levels work, in short

* **Exercise level** is a property of the exercise inside its bucket: FOUNDATIONAL / MODERATE ('INTERMIDIATE') / ADVANCED, driven by skill + stability + load-position zone (§4) [COACH CAT-04]. Levels **add** options (a higher-level client keeps every lower one) and are soft [COACH CAT-05].
* **Client level** is a separate axis that sets the **dose** [COACH CAT-06; OBS: UL/PPL 'NOVICE' gets leg press and barbell deadlifts that LIB files ADVANCED; JL mixes FOUNDATIONAL landings with an ADVANCED power clean].
* Client level scales in the sheets [OBS]: gym 'NOVICE' (green 93C47D) < 'NEWBY' (yellow FFD966) < 'INTERMEDIATE' (orange F6B26B), so NOVICE sits **below** NEWBY; athletic 'STARTING OFF SEASON WORKOUTS' (green) / ' MID OFF SEASON WORKOUTS' (yellow) / ' ADVANCED OFF SEASON WORKOUTS' (red); aerobic 'BEGGINER' / ' INTERMEDIATE' / ' ADVANCED'; CrossFit 'LVL 1'-'LVL 4' (+ 'LVL 5 = Work up to 1RM'). Generator scale L1-L4 [INF]: L1 = NOVICE/STARTING/BEGGINER/LVL 1; L2 = NEWBY/MID/INTERMEDIATE (aerobic)/LVL 2; L3 = INTERMEDIATE (gym)/ADVANCED (athletic, aerobic)/LVL 3; L4 = competitive (no gym sheet has it)/LVL 4. Caveat: STARTING/MID/ADVANCED may be three consecutive off-season blocks rather than levels (PRG-04, contradiction C-14).
* How a client is placed in a level is **not written anywhere** (N-IN-01). Default [INF]: training age (L1 < 1 yr, L2 1-3, L3 3-5, L4 5+ or competitive), down one level after a layoff, capped at L2 without landing control or 5 push-ups (09 D2).

---

## 4. Levels: the Pat Davidson zone model [COACH CAT-04]

### 4.1 The coach's rule

> "Mostly skill and stability demand, AND load POSITIONING. Load in front of you / front-loaded = foundational (goblet squat, front-loaded zercher) - people need to learn to be upright. Load closer to and on your body = intermediate (barbell front squat). Load behind your body = advanced (barbell back squat). Based on Dr. Pat Davidson's book 'A Coach's Guide to Optimizing Movement' ZONES: Zone 1 = closer to the body at the bottom (e.g. arms low) - easiest; Zone 2 = horizontal (high-pressure, but safer to push and pull) - intermediate; Zone 3 = overhead/vertical - most advanced (more positioning, stability and skill needed). Machines or cables change this: easier, because the machine/cable does the stabilizing work." (`coach_answers.md`, lightly cleaned)

Note: the zone definitions are the coach's own wording of Davidson; the book itself was not read by the team (08 §5.1).

### 4.2 The zones, with his own ladders

| Zone | Load / arm position | Level | Lower body (his ladders) | Upper-body vectors | Arm isolation |
|---|---|---|---|---|---|
| **1** | low, in front, at the sides, close to the body; arms low | FOUNDATIONAL | SQ A10:D11 'Hex Bar Squat' 'EASIEST', 'Goblet Squat' 'EASIER', 'High Zercher Squat' 'EASY', 'Zercher Squat' 'MODERATE'; suitcase loads (LU C22:C24), high zercher (C28:C30); RP-tab 'LOW/MID LOADING VARIATION' ('Plate reach ', 'Goblet loading', 'Double kb or Db'); deadlifts from the floor (bar low, in front) | none written | rope pushdown 'Zone 1' (S23 AP6); curls with arms by the sides ('Zone1', AO5) |
| **2** | horizontal; load racked on the front of the body | INTERMEDIATE | SQ E10:E11 'Front Squat/ SSB Bar' 'HARD'; front-racked DB/KB (RP-tab C23:C26 'HARDER'); LU 'on shoulder' (C25:C27), 'Front racked barbell' (C32) | horizontal push and pull (bench, push-ups, rows, flies, chest press): "high-pressure, but safer to push and pull" | arms in front ('Zone 2', AO5; reading INF) |
| **3** | overhead / vertical, or **behind** the body | ADVANCED | SQ F10:H11 'High Bar Squat' 'HARDER', 'Low Bar Squat' 'HARDEST', 'Overhead Squat' 'VERY HARD '; LU 'Back racked barbell' (C33); RP-tab 'HIGH LOADING VARIATION' ending 'Barbell overhead ' | vertical push and pull (overhead press, pulldown, pull-up, hanging) | 'Overhead DB Tricep Extension' (AP4); 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' (AP5); rope overhead 'Zone 3' (AP6) |

**Machines and cables shift every zone easier** [COACH]. Proof in his own library [OBS]: every machine-guided or assisted vertical pull (zone 3) is FOUNDATIONAL (U9-U18: 6 pulldown grips + assisted pull-up machine), while the free versions are ADVANCED (U46-U52); 'HORIZONTAL PULL' FOUNDATIONAL is 3/5 'Machine Row'.

Only the barbell can load zone 3 **behind** the body (back squat, good morning, barbell calf raise); that is one reason it sits at the advanced end of every ladder [INF, 10 §1.2]. Reading the S23 squat ladder's own heading: '**THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN' (SQ A9) [OBS].

### 4.3 How well the rule reproduces his library [OBS test, `10_equipment_model.md` §1.4]

Rule tested: position level (zone 1 → F, 2 → I, 3 or behind → A; unloaded → by skill) minus guidance (machine/assisted −2, cable/suspension/supported −1), floor F. Result on 176 levelled resistance/athletic entries: **98 exact (56 %), 157 within one level (89 %)**. It reproduces the FBS chop ladder 12/12, vertical pulls 17/19 and unilateral hinges 8/8. Disagreements by cause: library harder because of barbell skill/stability (32), other variables such as ROM, support or implement size (20), machine filed as a volume tool (12); library easier because the item is guided or unloaded (8) or is a zone-3 unguided lift filed low (6, the only true conflicts).

### 4.4 Operative levels: where his answer overrides his library

The generator uses `operative_level` and keeps `library_level` for display. 20 overrides [COACH CAT-04 applied; per-item mapping INF]:

| Direction | Cells | Exercises | Reason |
|---|---|---|---|
| F → **A** | AA11, AA12, AA13, AA14 | 'DB Push press', 'Barbell push press', 'DB Push Jerk', 'Barbell Push Jerk' | standing, unguided overhead = zone 3 (RP-tab E13:E15 also colours standing presses red) |
| I → **A** | AI49, AI50 | 'High Bar Back Squat', 'Low Bar Back Squat' | load behind the body |
| I → **F** | AI47, AI48 | 'High Zercher DB Squats', 'High Zercher Barbell Squats' | front-loaded zercher is his foundational anchor |
| I/A → **F** | AI52, AI97, AI98, AI99, AI55, AI101, AD50, AN51, AN52, AN54, AN55, AN100 | hack squats, 'Leg press', 'Pendulum Squat', leg extension machines, 'Machine flies', 'Hip Thrust Machine', 'Machine Good Mornings', machine leg curls, 'Hyper extensions ' | the machine does the stabilising; the library level marked their VOLUME-TOOL role, not difficulty |

Flagged but **not** overridden (open): seal rows X50:X53 ADVANCED though chest-supported; barbell hinges AN92:AN99 ADVANCED (barbell skill explains it); ball/slider curls FOUNDATIONAL; hanging core ('Toes to bar' O15, 'Knees to chest' O16, 'Hanging Rotational Knee/Leg Raises' O130) FOUNDATIONAL though zone 3 (core follows the segment/plane rule, CAT-08); dips (hands low, shoulders behind: ambiguous); seated presses come out at level 2 under the formula (calibration needed).

### 4.5 Rules the generator follows

| ID | Rule | Tag |
|---|---|---|
| LV-1 | A client at level L may use every exercise with operative level ≤ L. Never remove foundational options from an advanced client. | COACH CAT-05 |
| LV-2 | Levels are soft: an eligibility ceiling and a ranking input; constraint band, goal, equipment and pain rules decide among eligible options. | COACH CAT-05 |
| LV-3 | Client level and exercise level are independent: an advanced athlete still gets foundational landings when the slot or a pain flag asks for them. | COACH CAT-06; OBS JL |
| LV-4 | Operative level = library level except the 20 overrides above. Machines (constraint ≥ 4, low skill) are eligible at every client level. | COACH + INF |
| LV-5 / VP-10 | Progress along the zone ladder at most one step per block (goblet/zercher → front squat → back squat; pushdown → overhead extension; horizontal → vertical emphasis), or one step down for pain, age or regression. A machine/cable version counts as an easier step of the same zone. | COACH CAT-04; INF |
| LV-6 | The zone explains the order he states: horizontal (zone 2, "safer to push and pull") before vertical (zone 3). Show it to clients as a house rule until he confirms the reason. | INF from CAT-04 |
| LV-13 | Heavy loading lives in the safest zone the client owns: absolute and accelerative strength defaults to zone 1-2 positions; zone 3 (back-loaded, overhead) only when level and posture allow. | INF from CAT-04 |
| QM-11 | A client who cannot hold 'MAXIMAL UPRIGHT POSTURE' in a zone 2-3 squat goes back to a zone 1 front-loaded version for the next block, whatever the client level. | INF from CAT-04 + SQ A9 |

Open: whether skill is added on top of the zone (10 says no, the front squat stays intermediate; 11 adds +1 for Olympic lifts, ballistic overhead lifts and hanging pulls) → contradiction C-16, question N-CAT-12. Default here: use `operative_level` for eligibility; use the +skill heuristic only to rank unrated items.

---

## 5. Volume & dosing rules

Full version: `03_volume_dosing.md` / `03_volume_rules.json` (every observed program view, every rule as a JSON default). Numbers marked [OBS] are recomputed from the sheets; all targets are [INF] defaults.

### 5.1 Counting conventions (read before any number)

| Item | Convention | Tag |
|---|---|---|
| Hard set | 5-30 reps at ≤ 4 RIR (his 5-30 range); a 'MYO SET' (15 + 5 × 5 = 40 reps) counts as 2 | CHAT range; INF |
| Muscle credit | 1.0 to the prime mover, 0.5 to each clear synergist (Pelland et al. found fractional counting fits hypertrophy best) | INF + SCI |
| Knee flexion | leg curls, Nordics, slider/ball curls credit hamstrings 1.0 in LEG FLEXION; never hinge volume | COACH CAT-09 |
| Unilateral set | '10/10' = one set (both sides) | INF (UNI-01 pending) |
| Athletic exposure | contacts, throws, cuts, sprint bouts and Olympic reps are counted separately and **not** toward the 15-20; they cost 0.5 set each against a lower-body fatigue budget | INF (VOL-10 pending); SCI mixed |
| Volume load | weight × reps × sets (his words) is logged and shown, never steered on; compare only within one exercise and rep bracket | CHAT definition; INF |
| Reps storage | text, never numbers or dates | OBS date corruption |

### 5.2 Exercises and working sets per session [OBS]

| Context | Exercises / session | Working sets / session |
|---|---|---|
| Physique full body (BYOP AESTHETICS, PPL, BOOTCAMP 1) | 7 | 19 (AESTHETICS Day 1: 7 exercises, 19 sets); 17-21 |
| Short / 3-day / BOOTCAMP 2 / FAT BURN | 5 | ~15 (assumed); FAT BURN 14-18 + circuit |
| Athletic (BYOP ATHLETIC, JL) | 10 (4-5 athletic + 5-6 resistance) | 20 at 2 sets per slot (JL Monday: 10 athletic + 10 resistance); 2 sets on all 11 filled JL cells |
| BASEBALL | median 9 (6-11) | median 29 (22-51; supersets, tri-sets, complexes) |
| Strength tracks | 4 ('the work' / 'the accessory' / 'the nuance' / 'the survival') | 11-16 |
| Optional day | 5 ('Calves', 'Cardio'/'Aerobic Capacity', 'Core', 'Focus 1', 'Focus 2') | ~12 (assumed) + 1 cardio bout |
| MM UL / PPL by level | lower 10 (3 A-drills + 7 lifts), upper 8; push/pull 6 | UL NOV 20/24, NEW 30/24, INT 32/27 |

**The most stable number in his work is a ~20-working-set session** [OBS]. Athletes keep it and pay for athletic slots by going from 3 to 2 sets per slot and by moving calves and arms to the optional days [OBS BYOP ATHLETIC vs AESTHETICS]. Sets per exercise: 2-4 almost everywhere (3 compounds, 2 isolation on physique days; 2 on everything in the athletic template; 4 in BASEBALL Parts C/D); maxima 4 (FAT BURN), 5 (AESTHETICS, BASEBALL late pre-season), 6 (boxer week 8, STRENGTH-12), 7 (STRENGTH-12 weeks 11-12); menu max 8.

### 5.3 Weekly totals and what level does to them [OBS]

| Program | Weekly sets |
|---|---|
| MM UL 'NOVICE' → 'NEWBY' → 'INTERMEDIATE' (4 d) | 76 → 90 → 102 resistance (+18-23 %, then +13-14 %) |
| MM PPL NOV → NEW → INT (6 d) | 94 → 116 → 132 (3-day: 47 / 58 / 66) |
| MM athletic STARTING → MID → ADVANCED | 89 → 72 → 59 excluding throws (component count); 108 → 112 → 97 including throw sets; written SETS cells summed once per line ≈ 61 → 53-55 → 44 |
| BYOP AESTHETICS 4 main days / + 2 optional | 78 / 102 (coach-default fill) |
| BYOP ATHLETIC @2 / @3 sets | 80 / 120 (44 / 66 resistance) |
| MM FAT BURN WK1 → WK4 | 60 → 60 → 64 → 70 (+ circuits) |
| MM AESTHETICS-12 wk1 / wk6 / wk12 | 96 / 128 / 158 (148 + 10 superset finishers) |
| BASEBALL block means | 105-151 total; deload 82 |

**Level moves volume in opposite directions** [OBS]: gym clients add sets; athletes lose sets and gain intensity, specificity, single-leg/reactive work and throws (high-amplitude contacts 146 → 71 → 32; throws 210 → 400 → 420, where 210 and 420 read 'ALL LIST' as the 19-throw cheat sheet; heaviest hinge 3 × 6 → 'DEADLIFTS (1RIR)' 3 × 1).

### 5.4 Weekly sets per muscle

**Where his programs land** [OBS, 58 comparable views, fractional convention]: quads and hamstrings sit in his 15-20 band about 40 % of the time; glutes exceed 20 in 62 % of views (every lower slot credits them); chest reaches 15-20 in only 3 of 58 views; rear delts (median 3; under 6 sets in 49 of 58 views, except PPL 6-12 and AESTHETICS-12 9-20), calves (median 3) and abs (often 0 outside athletic programs) are chronically low. Upper body reaches 15-20 only in 6-day PPL and AESTHETICS-12; in 4-day templates his lever is 'Focus 1'/'Focus 2' (+12 to +18 sets/week available). Athletes run low upper-body volume by design (chest median 4; the boxer 0 after week 2).

**Medians by goal family** [OBS]: hypertrophy quads 16, glutes 21, hams 12, chest 10, back 12, side delts 8, rear delts 5, biceps 10.5, triceps 12, calves 3, abs 0. Athletic (incl. baseball, boxing, hybrid): quads 16, glutes 22.6, hams 17.6, chest 4, back 6, biceps 4, triceps 4, calves 3, abs 15.8.

**Generator targets: hypertrophy / aesthetics, peak week (fractional sets/week)** [INF]. The coach's 15-20 is read as the **end of a block**, with week 1 back-solved: `start = round(peak / (1 + rate)^(loading_weeks − 1))`, clamped to the floor (pending N-VOL-01).

| Muscle | Class (rate) | L1 | L2 | L3 | L4 | 8-week starts L1-L4 | Cap L1-L2 / L3 / L4 |
|---|---|---|---|---|---|---|---|
| quads | big lower (3 %) | 12 | 16 | 18 | 20 | 10 / 13 / 15 / 17 | 20 / 22 / 24 |
| hamstrings | big lower (3 %) | 10 | 14 | 16 | 18 | 8 / 12 / 13 / 15 | 20 / 22 / 24 |
| glutes (mostly indirect) | big lower (3 %) | 14 | 18 | 21 | 24 | 12 / 15 / 18 / 20 | cap +4 |
| chest | big upper (5 %) | 10 | 14 | 16 | 18 | 7 / 10 / 12 / 13 | 18 / 20 / 22 |
| lats / upper back | big upper (5 %) | 12 | 14 | 18 | 20 | 9 / 10 / 13 / 15 | 18 / 20 / 22 |
| side delts | small (7 %) | 8 | 12 | 14 | 16 | 5 / 8 / 9 / 11 | 14 / 16 / 18 |
| rear delts | small (7 %) | 4 | 6 | 8 | 10 | 3 / 4 / 5 / 7 | 10 / 12 / 14 |
| biceps, triceps | small (7 %) | 8 | 10 | 14 | 16 | 5 / 7 / 9 / 11 | 14 / 16 / 18 |
| calves | small (7 %) | 6 | 8 | 12 | 14 | 4 / 5 / 8 / 9 | 14 / 16 / 18 |
| abs / obliques | small (7 %) | 4 | 6 | 8 | 10 | 3 / 4 / 5 / 7 | 10 / 12 / 14 |
| front delts, traps, adductors, neck | unplaced | indirect only | | | | | cap only |

Why: L1 matches his 'NOVICE' lower body (quads 12); L2-L3 bring quads/hamstrings into 15-20 at the peak; upper-body peaks sit a little above his template medians because his own 15-20 statement and the science both say 6-8 chest sets is too low for an aesthetics client; floors stop the generator from reproducing his zero cells for calves, rear delts and abs [INF].

**Other goals, L2 peak** [INF, anchored on OBS programs]:

| Muscle | Strength | Athlete base / power / in-season | Fat loss | General / bootcamp |
|---|---|---|---|---|
| quads | 12 | 16 / 14 / 10 | 14 | 14 |
| hamstrings | 12 | 16 / 14 / 10 | 12 | 12 |
| glutes | 16 | 20 / 18 / 14 | 18 | 18 |
| chest | 14 | 9 / 6 / 4 | 8 | 8 |
| back | 14 | 12 / 8 / 8 | 12 | 12 |
| side delts | 4 | 6 / 6 / 6 | 6 | 8 |
| rear delts | 4 | 4 / 4 / 4 | 4 | 4 |
| biceps / triceps | 8 / 10 | 9 / 4 / 4 | 8 / 8 | 10 / 10 |
| calves | 4 | 4 / 4 (+ contacts) / 4 | 6 | 8 |
| abs/obliques | 6 | 14 / 16 / 14 (+ throws) | 10 (circuits) | 6 |

Level multipliers: strength, fat loss, general L1 × 0.75, L2 × 1.0, L3 × 1.1, L4 × 1.15. Athletes L1 × 1.0, L2 × 1.0, L3 × 0.9, L4 × 0.75 on resistance volume, intensity rising instead [INF from OBS ladder; C-14: if STARTING/MID/ADVANCED are blocks, not levels, this multiplier changes]. Floors: max(maintenance, 4) for big muscles, 2-4 for small, unless the sport profile removes the muscle (a striker's pressing) [INF; SCI Spiering 2021 maintenance].

**Priority ("the muscle you want to grow")** [CHAT + INF]: up to 2 priority muscles per block; peak +4 (L1-L2) to +6 (L3-L4) sets; rate one class up (3 → 5 → 7 %, max 7 %); cap +6, never above RP MRV*P. Deliver the extra sets in his order: (a) 'Focus 1'/'Focus 2' slots on optional days (2-3 sets each); (b) +1 set on existing slots; (c) a second exercise of the same category on a main day (PPL 'Incline'/'Flies'/'Dips'); (d) for small muscles, move the slot to the start of the session ('Calves' first on AESTHETICS A days, side raises first on AESTHETICS-12 push days). Non-priority muscles of the same region hold their start value.

**Pain** [OBS rule text + INF mechanics]: '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff' (MM 05 A6; UL/PPL A7 without 'going unilateral'), plus "fewer sets with pain". Escalation: declared pain → same-pattern split-grip / unilateral / machine variant, affected muscles start at floor volume, rep bracket one notch up, no MYO/AMRAP, impact filter for lower-limb joints, rate 0 until 2 pain-free weeks; 'Felt a PAIN' once → swap next exposure, same sets; twice → −50 % sets on that slot, move the sets to a pain-free pattern for the same muscle; three times → remove the slot, flag for coach review.

### 5.5 Rep ranges

**His statements and menus** [CHAT + OBS]: "everybody picks between 5 and 30 reps"; small muscles "a lot more reps because you can't really go that heavy"; big muscles "a mix". BASEBALL legend (A19:C22): 'VOL 1' '12-15 Reps' compound / '10-12 Reps' 'SMALLER ISOLATIONS' → 'VOL 2' '8-12 Reps' / '15 REPS' → 'VOL 3' '6-8 Reps' / 'MAX REPS': **as compound reps fall, isolation reps rise.** SQ hypertrophy menu 3 × 15 … 5 × 8 (+ 'Max air squats', + 3 × MYO for advanced); strength menu 5 × 3 … 8 × 2, '(1 RIR)', '*REST 3-6 MIN BETWEEN SETS'; "****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus" (SQ A5).

**What he actually does** [OBS]:
* Single-joint = more reps (15-20, 'MAX REPS', 'MYO SET'), including big-muscle isolation (leg extensions 2 × 20 and MYO). Compounds 6-15 (mean ~10-12 physique, ~10 baseball, 6-8 heavy/athletic, 1-5 only in strength/peak blocks).
* The rule bends with goal and level: STRENGTH-12 runs most isolations at '3x8' (but 'TATE PRESS' '3x20', N15); PPL delt isolation gets heavier with level (side raises 3 × 15 → 4 × 8 → 4 × 8; reverse flies and upright rows 3 × 15 → 3 × 10 → 4 × 8) while curls, triceps, leg extensions and leg curls stay at 20 and calves at 'MAX REPS'.
* Level effects are lift by lift, not one direction: PPL push presses and DB rows 15 → 10 → 8; PPL legs 8 → 10 → 8; pulldown 15 → 10 → 12; pull-ups 3 × 15 → 4 × 10 → 5 × 12; dips 8 → 10 → 'MAX'; UL lower compounds 2 × 12 → 3 × 10 → 4 × 8 but **UL upper compounds 3 × 8 → 3 × 10 → 4 × 12 (reps up; possible fill error, open)**.
* FAT BURN: compound mean 11.0 → 8.9 over 4 weeks while isolation goes 19 → 35 (leg ext/curl 4 × 15 → 3 × 20 → 2 × 40 → 3 × 40), above his own 5-30 [OBS; flag].
* Athletic days by role (JL): plyo, COD, power clean, main squat '6 to 8 Reps'; throws, rows, lunges, pull-ups '8 to 12 Reps'; finisher 'MYO SET'.

**Rep matrix for the generator** [INF; his menu labels, new labels in italics]:

| Exercise class | Hypertrophy | Strength | Athletic power | Fat loss | General |
|---|---|---|---|---|---|
| Main bilateral compound | '8 to 12 Reps' (L1 '10 to 15'/'15 Reps'; L3+ waves 12/10/8) | ME *'1 to 3'* - '4 to 6' (5-4-3-2-1 ladder); DE 2-3 'FAST' 60-70 % | '4 to 6' / '6 to 8' (VOL 3); pre-season *'1 to 3'* | '10 to 15' → '8 to 12' over the block | '10 to 15' |
| Machine / stable compound | '15 Reps' or '10 to 15'; MYO at L3+ | '6 to 8' @ 2 RIR | '8 to 12' | '15 Reps' | '15 Reps' |
| Unilateral compound | '8 to 12' per side (*'N/N'*) | '8 to 12' per side ('8/8' 'ALL') | '6 to 8' per side heavy, or contrast | '8 to 12' / *'10/10'* | '10 to 15' per side |
| Big-muscle isolation (leg ext, leg curl, flies) | '15 Reps' - '20 Reps'; 'MYO SET' L3+ | '8 to 12' ('3x8') | '8 to 12' or MYO finisher | 15 → 20 → *40* (as FAT BURN) | '15 Reps' |
| Small-muscle isolation | '15 Reps' - '20 Reps'; rear delts *'20 to 30'*; last set 'MAX' | '8 to 12' 'ALL'; triceps '20 Reps' | '10 to 15' | arms *30* → *40*; side raises 15 → 20 | *'15 to 20'* |
| Calves | '15 Reps' - '20 Reps', last set 'MAX' | '10 to 15' | covered by contacts; '8 to 12' heavy single leg | *'15 to 20'* | *'15 to 20'* |
| Core | '10 to 15' or *'20-60 s'* / *'Accumulate N min'* | '8 to 12' | by plane; 'UNBROKEN' sets | circuit *'30-50 s'* | '10 to 15' / time |
| Plyo (contacts per set) | - | 'EASY' 3 × 6 | landings 6-8 (Z1, 3 s stick); single response 5-8 (Z2); rebound 10-20 (Z3); squirrel/ankle 20-40 | - | - |
| Throws | - | - | 10 per side per set (sit-up throws 20) | - | - |
| Olympic | - | '4 to 6' → *'1 to 3'* | pulls '6 to 8'; hang power 3-5; L4 *'1 to 3'* | - | - |

Size modifier [CHAT + INF]: small muscles and single-joint lifts floor at 10 reps, prefer 15-20, last set may be 'MAX'; big muscles use the full spectrum across the week (≈ 25 % heavy 5-10, 50 % moderate 10-20, 25 % light 20-30: bilateral slot heavier, unilateral and machine slots moderate, isolation light; SCI RP).

Preference style [CHAT + INF]: `volume_lighter` ("more sets of squats with less weight") = one bracket up, +10 % weekly sets, 60-120 s rest; `balanced` = matrix default, 90-150 s; `heavy_powerlifting` ("heavier on the weight and fewer reps") = one bracket down, strength-menu rows on the first slot of each day, −15 % weekly sets, 3-5 min rest, never AMRAP on compounds.

### 5.6 Effort

| Cue (verbatim, cell) | Decoded target |
|---|---|
| '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' (MM 00 A4) | 1 RIR on working sets |
| '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM 00 A6) | 1-3 RIR |
| 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+' (SQ A13) | 1 RIR = RPE 9 on the RIR scale, so the RPE floor is looser than the RIR (open) |
| '1-2 RIR' (4T AESTHETICS-8 col D) | RPE 8-9 |
| 'the work' '1RIR' → 'the accessory' '2RIR' → 'the nuance' 'MAX' → 'the survival' 'ALL' (CONJUGATE M13:M16, 4T M9:M24) | effort rises as complexity and systemic cost fall; on Thursday the plyo row ('EASY') takes the first position, so the words follow the exercise's role, not the row name |
| RPE row 7,7,7,8,8,9,7,8,9,9,9,10 (STRENGTH-12) | strength main lift RPE climbs across the wave |
| 'FAST RPE6 or about 60-70%' (4T N17) | speed work ~4 RIR, max bar speed |
| EFFORT '8 - That was perfect' (LIB AX15) | client bullseye ≈ RPE 8 ≈ 2 RIR |
| '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' (CF A4) | progressive overload, not failure |

Generator defaults [INF]: heavy compounds 1-2 RIR; secondary compounds 2 RIR; isolation last set 0-1 RIR or 'MAX'; strength main lift RPE 7 → 9 across a wave (10 only in a test week); speed work RPE 6; plyos 'EASY' with full quality; deload RPE 6-7. 'MAX'/'ALL'/'MYO' only on the last one or two slots [OBS N13: 13 of 13 MYO cells on the last exercise]; the generator further restricts technical failure to isolation or constraint ≥ 4 machines [INF; his 4T sheets also put 'MAX'/'ALL' on pull-ups, DB rows, RFE lunges and staggered-stance DL, so this is a coach setting].

### 5.7 Rest [OBS SQ B28/E28/H28; rest elsewhere not written]

'*REST 1-2 MIN BETWEEN SETS' (hypertrophy) · '*REST 3-6 MIN BETWEEN SETS' (strength) · '*REST AS PRESCRIBED' (athletic). Intervals carry their own work:rest (AE). Defaults [INF + SCI]: hypertrophy compounds 90-150 s, isolation 60-90 s, strength main lifts 180-360 s, Olympic 120-180 s, superset rounds 60-120 s, plyo work:rest 1:5-1:10 (depth jumps 5-10 s between reps, 2-3 min between sets), buy-outs ~2 min ('3x 10 cal bike sprint (2 min rest)'). Contrast complexes: 'immediately' between members as he writes; 3-5 min between rounds [OBS + INF].

### 5.8 Athletic dosing [OBS]

| Quality | What his programs prescribe |
|---|---|
| Plyo contacts | BYOP ATHLETIC @2 sets 72-96/week (A days 24-32); MM athletic STARTING 146 high-intensity (48.7 per session), MID 71 high + 120 low-amplitude, ADVANCED 32 + 100; boxer weeks 3-8 113-129 high + 142-177 low (+ jump rope; **248-264 high if squirrel jumps are counted the way he files them**, PLYOS 'ADVANCED'/'FULL JUMPING'); BASEBALL block means 199-241 total (high 103/151/135; single weeks reach 174-201); strength track 18 ('EASY' 3 × 6). Per session 18-77 on average, but single sessions reach 100-146. |
| Medball throws | 1 × 10 per throw (sit-up throws 1 × 20), R/L pairs; BYOP @2 64-96/week; BASEBALL block means 176-192 (single weeks 70-290; 45-63 % transverse); boxer 190 → 380; MM athletic 210 → 400 → 420 |
| COD cuts | BYOP 4 slots/week, JL 'DIG/OUT' 2 × '6 to 8 Reps' → 48-64 cuts/week at 2 sets; **zero in every MM program** |
| Sprint | buy-outs 1-3 bouts of 10-20 cal or 15-30 s ('SPEED POWER' '10-39 Secs'), ~3-4/week in BASEBALL; boxer 'Sprint 20/ Recover 40' 5 → 8 rounds; HYBRID 10-15 × 15 s (1:2) → 30 s (1:4) 'fastest'; A-drills 2-4 × 8-12 per leg before UL/PPL lower days. No BYOP sprint slot. |
| Olympic / triple extension | JL 'Power Clean' 2 × '6 to 8 Reps'; BASEBALL 'OPTIONAL PIECE' 'OLY' 'Hang cleans @ 75%' 4 × 8 → '@ 80%' 4 × 6 → '@ 85%' 4 × 6 → '@ 90%' 4 × 4 (never in-season, never in deloads; exceeds Prilepin, flag); MM athletic 3 × 8 mid-weight → 'Power Cleans' 3 × 3; boxer 'Clean Pull/ hang Power Clean' 3 × 8 |
| Energy zones | 'SPEED ENDURANCE' '>40 Secs'; 'SPEED POWER' '10-39 Secs'; 'SPEED STRENGTH & POWER' '0-12 Secs' (BASEBALL E20:F22) |

Reading [INF]: athletic work is dosed by count and quality, resistance by sets × reps near failure. Plyos 1-3 sets of 5-10 contacts (rebound/squirrel 20-40); throws 1-2 × 10 per side; Olympic 2-4 × 3-8; cuts 2 × 6-8; sprints by bout duration. Per-session contacts sit at or below NSCA beginner bands (80-100) on average, which is conservative [SCI].

### 5.9 Conditioning [OBS AE]

| Colour (verbatim) | Duration / intensity | Work | Rest |
|---|---|---|---|
| Blue 'A' (A4C2F4) | 'Short Duration ' / 'High Intensity' | '15/45', '20/40', '30/30', '40/20', '45/15 Work:Rest' seconds; 10 × '10X10m Sprints' | '3 Minutes' … '8 Minutes' between blocks |
| Green 'B' (B6D7A8) | 'Moderate Duration' / 'Moderate Intensity' | '1 Minute' - '3 Minutes' | '1:1', '1:2', '1:3 Work:Rest' |
| Orange 'C' (F9CB9C) | 'Long Duration' / 'Low intensity' | '4+ Minutes'; 1-5+ miles | 'Active', ':30 sec' … '3 Minutes' |
| 'LACTATE CLERANCE' | surge-and-float, e.g. '1 min MODERATE/20 Sec FASTEST/ 2 Min EASY' × '4 (NO REST)' | 16 formats | sets rest 1-3 min |

Rules [OBS]: '***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week' (AE A5); '**Follow Running Warmups'; level unlock 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE' (CF D21:D24); progression adds volume/density first, then pace (FAST/FASTEST/SPRINT) with volume back down. In practice most templates schedule 2 sessions ('WEDNESDAYS & SATURDAYS max 40 min of steady', MM 00 A5); exceptions: 3 DAY BUILDER (3 'Cardio' slots), BOOTCAMP 2 (6), CrossFit grids 2/2/3/4 by level, BASEBALL buy-outs only. Generator default [INF]: L1 2 × C; L2 2-3 (C + B); L3 3 (C + B + A, never the same colour twice); L4 3-4 (+ lactate clearance); aesthetics 2 × C 30-40 min Wed/Sat; fat loss 2 × C + 2 circuits; athletes 1-2 aerobic + 3-5 buy-outs; steady cardio ≤ 40 min on non-lifting days or after lifting. Open: 2 vs 3 (ATH-07).

---

## 6. Bilateral vs unilateral volume (the coach's emphasis)

[CHAT] "The bilateral vs unilateral VOLUME relationship is very important." He has not said what the relationship is. Everything below is what the sheets show [OBS] and the defaults we derive [INF].

### 6.1 What the sheets show

**Structure: the templates build in a 1 : 1 balance.** Every 4-day and 6-day BYOP template gives each lower pattern one bilateral and one unilateral slot per exposure (2 + 2 per pattern per week): 'Bilateral KD' + 'Unilateral KD' on knee days, 'Bilateral HD' + 'Unilateral HD' on hip days [OBS]. The 3 DAY BUILDER is 4 bilateral : 3 unilateral (57 %; its Day 3 is BKD + BHD + UKD, BYOP 01 C23:C27). The NO ACCESS tabs read 4 : 2 (67 %) only because their 'Unilateral HD' slots are miswired to LEG CURLS (E12/E33, E19/E46 → AR7:AR42).

**Shares of lower-body resistance sets in his written programs** [OBS, computed; Olympic lifts, swings and loaded jumps excluded as athletic exposure; knee flexion reported separately per CAT-09]:

| Program | Bilateral share of sets | Sets bi-knee / bi-hip / uni-knee / uni-hip |
|---|---|---|
| UL and PPL, all three levels | 50-53 % | NOVICE 2/2/2/2 → NEWBY 3/3/3/3 → INTERMEDIATE 4/4/4/3 (sets as tabulated in 11 §3.7) |
| 4T AESTHETICS-8 / AESTHETICS-12 | 49 % / 54 % | 48/48/52/48 ; 163/48/90/90 |
| FAT BURN 'MUSCLE BUILDING' / 'CIRCUITS RECCOMENDED' | 55 % / 36 % | 27/27/24/20 ; 9/0/16/0 |
| 4T STRENGTH-8 / CONJUGATE / STRENGTH-12 (items) | 68 % / 70 % / 67 % | 49/42/24/18 ; 52/46/24/18 |
| BASEBALL Block 1 / 2 / 3 | 47.5 % / 44.7 % / 46.8 % | 44/32/52/32 ; 55/33/60/49 ; 40/48/52/48 |
| BOXING weeks 1-2 / weeks 3-8 | 50 % / 37.5 % (17 % if the two contrast complexes are not counted as bilateral) | 6/6/6/6 ; 3/6/12/3 |
| MM athletic STARTING / MID / ADVANCED | 43 % / 27 % / 50 % (items 40 / 33 / 40 %) | 3/3/5/3 ; 0/4/6/5 ; 0/5/3/2 |
| HYBRID | 100 % by sets is an artefact (unilateral tri-sets carry no set count); 43 % of items, 63 % unilateral share of compound sets (04) | - |

**Library and usage counts** [OBS counts, INF tags]: selectable lower-body compounds are mostly bilateral (BKD 34 + BHD 29 = 63 vs UKD 14 + UHD 10 = 24 selectable), but unilateral lists are unlevelled and almost every lunge is written implement-free and loaded through the 'LOADING' list (LU C21:C33), so UKD has 13 options in every equipment profile. In program line items (catalog `observed_in_programs_count`, incl. complexes) bilateral lower lifts are used 317 times and unilateral 248 times (≈ 56 % bilateral; BHD may still include cross-filed curls). Upper body is mostly bilateral (selectable HPUSH 21 bilateral / 4 alternating / 1 unilateral; VPUSH 15 / 2 / 1; HPULL 15 / 1 / 2; VPULL 22 / 0 / 1), with single-arm DB/KB rows (60 uses) the most-used unilateral upper lift.

**Doses for unilateral work** [OBS]: 'Reverse Lunges ' 3 × '8 to 12 Reps' (AESTHETICS D6), FFE lunges 2 × '8 to 12 Reps' (JL), '8/8'-'12/12' per side across MM programs, 4T 'the survival' 2 × '8/8' 'ALL' (RFE lunges / staggered DL), 'slow eccentric deficit Lunges (no weigths)' (BASEBALL EL52). Unilateral work is moderate-to-high reps and is where he puts 'MAX'/'ALL' effort in the strength tracks.

**Order and pairing** [OBS, `ordering_audit.md`]:

| Regularity | Count |
|---|---|
| R5 bilateral before unilateral of the same region | 225 / 231 sessions (97 %); KD 102/106, HD 84/85; breaks: machine MYO finisher last, 'Camporini DL', a boxing step-up |
| N3 unilateral of the **same** pattern as the bilateral lift (BKD + UKD, BHD + UHD) | 49 sessions (BKD+UKD 29, BHD+UHD 20): BYOP aesthetics/athletic, STRENGTH-8 |
| N3 unilateral of the **opposite** pattern (BKD + UHD, BHD + UKD) | 113 sessions (BKD+UHD 56, BHD+UKD 57): BASEBALL (44 + 46, every labelled week), BOOTCAMP 1 and 2, STRENGTH-12, HYBRID |
| N18 bilateral lower lift paired with the **horizontal** upper vector; unilateral with the **vertical** | BYOP bilateral + H 29 vs + V 2; unilateral + V 24 vs + H 2. MASTER MODEL mixed (bilateral + H 70, + V 68; unilateral + H 16, + V 12) because BASEBALL moves the vertical vectors to Thu/Fri |
| R9 knee-dominant with a pull, hip-dominant with a push | 160 / 193 sessions; 186 / 222 lower-upper pairs (BASEBALL 92/92; BYOP 100 %) |

**Other signals** [OBS]: pain → 'going unilateral' for athletes (MM 05 A6); '*LUNGES are a UNILATERAL KNEE DOMINANT MOVEMENT' and 'Lunges are great potentiators of the squat patterns' (LU A3, A13); the 4T AESTHETICS-8 lunge varies one variable per week ('FFE CONTRA LUNGES' → 'FFE IPSI LUNGES' → 'RFE CONTRA LUNGES' → 'RFE IPSI LUNGES', E38:H38); unilateral emphasis rises with athleticism but not monotonically with level (MM athletic MID 75 % unilateral → ADVANCED 50 %).

**Reading** [INF]: (1) the default is a 1 : 1 balance; (2) strength tracks tilt bilateral (60-70 %) because 'the work' and 'the accessory' are bilateral lifts; (3) athletes tilt unilateral as the phase gets more specific (boxer conversion, BASEBALL pre-season Block 2); (4) pain shifts load toward unilateral; (5) aesthetics days double the day's pattern (same dominance) for local volume, while athletic, bootcamp and in-season days cross patterns so each session is complete; (6) the heaviest pair (bilateral lower + horizontal upper, zone 2) goes first and the more positional pair (unilateral lower + vertical upper, zone 3) second.

### 6.2 Generator rules [INF unless tagged]

| Rule | Default |
|---|---|
| Target bilateral share of lower-body sets (per lower pattern) | hypertrophy / general / bootcamp 50 %; strength 60-70 %; athlete off-season base 50 %; athlete conversion / pre-season 40-45 %; athlete in-season 45-50 %; fat-loss circuits 35-50 %; pain in a lower-body joint: shift toward unilateral, keeping sets and lowering load and reps per side |
| Placement | when a big lower muscle earns a set, it goes to the side (bilateral or unilateral) that is below target; ties go bilateral (R5 order) |
| Same vs opposite dominance | same dominance for muscle-focus days repeated twice a week (G1); opposite dominance when every session must stand alone (bootcamp, 2-3 days a week, in-season athletes, heavy/fast bilateral main lift) (G2/G3) |
| Vector pairing | A1/A2 = bilateral lower + horizontal upper; B1/B2 = unilateral lower + vertical upper (BYOP pattern); athletic families may use the BASEBALL pattern (Part C bilateral + one upper compound; Part D unilateral + two isolations) |
| Order | bilateral before unilateral (hard rule, 97 %); machine MYO finisher exempt |
| Counting | '10/10' = 1 set; knee flexion is not in the hinge share (CAT-09) |
| Equipment swaps | a swap that turns a bilateral slot unilateral (pistol squat, SL RDL at home) is counted on its true side and flagged `laterality_shift`; rebalance elsewhere if the target is broken (10 CR-25) |
| Session time | the 05 time model charges 2.5 min per unilateral set (both sides) vs 2.25 per bilateral hypertrophy set (~1.1x); the questionnaire assumption is that unilateral work takes about twice as long (UNI-09 pending), so keep the factor configurable |

### 6.3 Open decisions (all pending on the questionnaire page; not re-listed here)

UNI-01 (counting a unilateral set), UNI-02 (bilateral share by goal), UNI-03 (upper-body unilateral share), UNI-04 (moderate-to-high reps only?), UNI-05 (does unilateral volume progress by reps per side first?), UNI-06 (same vs opposite pairing by goal), UNI-07 (alternating = unilateral?), UNI-08 (pain swap keeps or cuts sets), UNI-09 (time cost), UNI-10 (does unilateral rise toward the season?), UNI-11 (bilateral + horizontal / unilateral + vertical intentional?), UNI-12 (frontal/transverse unilateral work for court and combat athletes); new N-SES-02 (is knee + pull / hip + push a rule? RP-tab lays knee-dominant next to the pushes) and N-SES-03. Cross-file contradiction C-19 (HYBRID share): use the item-based figure.

---

## 7. Training variables

Full version: `11_training_variables.md` / `.json` (23 variables, LV/VP/QM rules, the engine and its worked examples) and `10b_equipment_variables_science.md` (evidence).

### 7.1 The variable set [OBS grammar + CHAT + COACH]

```
EXERCISE  = PATTERN · IMPLEMENT/CONSTRAINT · POSITION ZONE · LOAD LATERALITY · STANCE/BASE · GRIP · FEET/BODY · ROM · END RANGE
            · ACCOMMODATING · PLANE (incl. core segment)
DOSE      = LOAD · SPEED/INTENT · TEMPO · VOLUME (sets x reps x weeks) · EFFORT · DENSITY/REST · FREQUENCY
ATHLETIC  = FORCE PHASE · PLYO ZONE · INTENT · IMPLEMENT (medball mass, box/drop/hurdle height)
CONDITION = DURATION · WORK:REST · PACE (colour A/B/C)
RELATIONS = BILATERAL:UNILATERAL balance per lower pattern · EXERCISE LEVEL (derived from zone, constraint, skill)
```
"Speed is a variable, range of motion is a variable, load is a variable ... Volume is a variable" [CHAT]. Unwritten slots take defaults: bilateral, standing, floor ROM, no bands, controlled tempo to 1-2 RIR [INF].

| ID | Variable | Coach's words / ladder (verbatim) | How it is used | Field (default) |
|---|---|---|---|---|
| V01 | Load | 'HEAVY BARBELL' / 'LIGHT BARBELL ' (SQ A44/A47); '%' 80,80,85,85,90,90 (4T O3:T3); 'Hang cleans @ 75%'; '78% of 1RM'; "The heavier I go, the slower I'm going to be" | a consequence of rep target and effort; % only for barbell main lifts, Olympic lifts, speed work and contrast; never kg for DBs | `load = f(rep_bracket, rir)`; log `load_kg` + `notes` |
| V02 | Speed / intent | 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' / 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'; 'FAST RPE6 or about 60-70%'; 'Front squats - light weights - same speed for all reps' | speed is a variable ON an exercise ('HEAVY' one day, 'FAST' another); produced by a lighter load + intent | `velocity_intent` ∈ max/power/strength/controlled/isolation; concentric always max intent |
| V03 | Tempo | 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT'; 'slow eccentric deficit Lunges (no weigths)'; 'Drop & Stick - Hold for 3 seconds' | words, never 4-digit tempos; 'slow' replaces load when there is none | `tempo` (controlled default; never slow on power work) |
| V04 | ROM | 'ROM VARIABLE' 'Elevated' (green) / 'Floor' (yellow) / 'Deficit' / '*RDL' (red); 'Elevated Push ups (for full ROM)'; 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' | full ROM default; partial/mid range on fast and strength work; deficits as progression | `rom` + per-exercise `rom_effect` ('Elevated' is ambiguous) |
| V05 | End range | 'Dead stop' / 'Touch & go' / '*RDL' (RP-tab A86:A89) | how he controls the stretch-shortening cycle | `end_range` (dead stop first for beginners) |
| V06 | Volume | chat 20 → 22 chest sets; SETS 1-8; REPS menu; SQ A5 "don't go too far into changing it" | primary weekly lever; unit = sets per muscle per week | §7.3 engine |
| V07 | Density / rest / pairing | '*REST 1-2 MIN …' / '*REST 3-6 MIN …' / '*REST AS PRESCRIBED'; 'Superset - same reps'; 'AMRAP' | rest follows goal; density is primary only for fat loss, hybrid, conditioning | `rest_s`, `pairing` |
| V08 | Effort | §5.6 | effort rises as complexity falls | `rir_target` by class |
| V09 | Frequency | '… 4 DAYS A WEEK', '3 DAY BUILDER', 'PUSHPULLLEGS - 3 or 6 DAYS A WK'; 'WEDNESDAYS & SATURDAYS' | each main pattern 2x/week (3-day accepts 1x for VPULL, VPUSH, UHD, leg curls, calves) | `exposures_per_pattern` = 2 |
| V10 | Selection / constraint | machines "a lot of reference points ... it's safer"; "barbells are more skilled"; 'LOVE IT' / "I PERSONALLY DON'T LIKE IT" | the slot fixes the pattern; client and kit pick implement and constraint | `constraint_level` 1-5 (§8) |
| V11 | Variation | "you don't want to always be trying to 'confuse' the muscle"; 'A WEEK'/'B WEEK'; 'FFE CONTRA' → 'FFE IPSI' → 'RFE CONTRA' → 'RFE IPSI' | skeleton fixed; one small variable at a time | `variation_mode` (§7.4) |
| V12 | Order | "rowing before an overhead pull ... horizontal push before vertical push"; "power first ... power strength ... strength ... resistance" | fast/free first, slow/constrained last | `tier` (§7.5) |
| V13 | Position zone | CAT-04 zones; SQ ladder; arm 'Zone 1/2/3' | main difficulty driver | `position_zone` 1-3 (§4) |
| V14 | Load laterality | 'GET INTO THE HIP VARIATIONS - MODERATE' 'Contralateral loading ' / 'GET OUT OF THE HIP - MODERATE' 'Ipsilateral loading ' / '- HARDER' 'Front racked db or kb contralateral loading'; 'Split stance ALWAYS contralateral'; medball 'INTO THE LEFT LEG/HIP' | moves frontal demand into or out of the stance hip; one implement is enough | `laterality` ∈ bilateral/contra/ipsi/alternating/offset |
| V15 | Stance / base | 'Stance loads the FRONT TO BACK' (LU A17); seated → Z/floor → kneeling → standing (RP-tab E8:E15); 'Half kneeling same side leg up' / 'opposite side' | removing base raises difficulty without load | `stance` |
| V16 | Grip, feet/body | 'HAND PLACEMENT' supinated/neutral/pronated/wide/narrow; 'FEET POSITION' bench/wall (green) → plates/floor → 'feet in air' (red); pain rule fixed → split grips | cheapest in-block variety and first pain lever | `grip`, `feet` |
| V17 | Accommodating resistance | 'BOTTOM BANDED' '*PROLONG THE DURATION OF MAX PROPULSION', 'around 50%'; 'REVERSE BANDED' '*ACCELERATES MAX PROPULSION'; 'BOTTOM CHAINS' '*INTENSIONALLY SLOW YOU DOWN', 'around 70%'; 'WEIGHT RELEASERS' 'I HAVE NO IDEA' | diagnosis → tool: can't yield → bottom bands; slow out of the hole → reverse bands; must stay stiff → chains | `accommodating` (advanced barbell only) |
| V18 | Plane & core segment | 'Movement orientations/guidance loads AROUND'; core grid TRANSVERSE/SAGITAL/FRONTAL × DYNAMIC/STATIC × THORAX/PELVIS/BOTH; CAT-08 | frontal/transverse demand via bands, off-axis loads, cables, throws | `plane`, `core_segment`, `core_mode` |
| V19 | Plyo force phase, zone, height | 'TAKING IN FORCES' → 'DELIVER FORCES FAST' → 'AMORTIZATION OF FORCES' → 'REBOUNDING '; Z1 'Receive pause/creat' → Z3 'Repeat receive create'; 'Low Box Jumps (half shin)' / 'Mid Box Jump (up to knee)' / 'High Depth Drop (above hip)'; 'Bigger plates start at lateral bilateral plate hops' | the athletic ROM/end-range ladder; added load is the last step | `force_phase`, `plyo_zone`, `height_cm` |
| V20 | Medball mass | chat "light, 8-10 lb"; 'this but hugging a light medball' (MM 05 K13); no weight in any cell | light ball, max speed | `medball_lb` (§8.7) |
| V21 | Conditioning | blue A / green B / orange C; 'Never do the same color workout in the same week' | the one place he requires weekly variety | §5.9 |
| V22 | Bilateral : unilateral | §6 | kept when sets are added | `bilat_share_target` |
| V23 | Exercise level | CAT-04/05/06 | derived, never a gate | `operative_level` |

### 7.2 Load-velocity: lightest/fastest → heaviest/slowest

| Zone | Coach examples [OBS] | Load as written | Dose [INF] | Stop rule [INF] |
|---|---|---|---|---|
| Z-A max velocity / reactive | ' Max velocity running (top speed)'; squirrel jumps under '*FASTEST SSC*'; 'REBOUNDING ' | body mass or less (band-assisted) | contacts 5-10 × 2-4; sprints 10-30 m × 3-6 | contact lengthens, height drops, heel lands |
| Z-B starting strength / speed | medball 'Chest pass', 'Overhead throw', 'Rotational Scoop R' 1 × 10; COD 'EASY TURN' → 'HARD TURN' | 'light medball'; chat 8-10 lb | 1-2 × 10 per side | throw slows, head drifts, spine side-bends |
| Z-C speed-strength | 'Hex bar squat jumps', 'DB Squat Jumps'; 'Really high jump squats LOAD & jump hard'; 'WEIGHTED STICK THE LANDING' | unspecified DBs / hex bar | 3-6 × 3-5; DB jumps 10-20 % body mass | jump height drops |
| Z-D strength-speed | 'FAST ...' lifts 'FAST RPE6 or about 60-70%'; 'BOTTOM BANDED' ~50 %; 'Russian kb swing' / 'American kb swing' ('SPEED SPECIALS') | %, RPE 6 | 2-3 × 6-10 | first slower rep ('same speed for all reps') |
| Z-E accelerative (Olympic) | 'Hang cleans @ 75%' → '@ 90%'; 'Power Clean' | % | 3-6 × 1-3 with a speed-loss stop (his 4 × 8 / 2 × 6-8 open, N-VOL-10) | speed loss, catch breaks |
| Z-F stiffness (chains) | 'BOTTOM CHAINS' ~70 %; 'HEAVY CHAINED DEADLIFT' | % | 3-5 × 1-5 | bar path or brace breaks |
| Z-G contrast heavy member | '78% of 1RM whatever squat immediately into tuck jumps...'; '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' | %, 'Heavy' | 2-4 heavy + 5 jumps × 3-4 rounds | jump quality |
| Z-H absolute strength | 'the work' '1RIR'; 'DEADLIFTS (1RIR)'; SQ strength menu | 1 RIR, % | 3-7 × 1-6 | RIR 1-2 |
| Z-I hypertrophy compounds | '1-2 RIR' 12/10/8; SQ hypertrophy menu | RIR | 3-5 × 6-15 | RIR 1-2 (0-1 on machines, last set) |
| Z-J local-fatigue machines and isolation | 'LEG PRESS' 'LOVE IT' ("local fatigue ... not so much systemic fatigue"); 'MYO SET' '15/5/5/5/5/5'; 'MAX REPS' | MAX / ALL / MYO | 2-3 × 15-30 / MYO | technical failure allowed (isolation or constraint ≥ 4, last exercise) |

Rules [CHAT + OBS; wording INF]: LV-1 every slot carries a velocity zone before an exercise; choose the heaviest implement that does not slow the intended movement. LV-2 speed goal → light implement + maximal intent; heavy and fast meet only in contrast stations (LV-6). LV-4 speed sets end when speed drops (no device: first visibly slower rep or about half the reps possible). LV-5 accommodating resistance only by diagnosis and eligibility (intermediate+, barbell + rack + bands/chains, strength/athletic goal); weight releasers not used; the DB drop-release jump (~20 % body mass, BA C40 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP') is the eccentric-overload tool. LV-7 concentric always maximal; eccentric natural/fast on athletic work, ~1-2 s strength, 2-3 s hypertrophy; never slow eccentrics on throws, jumps, Olympic or dynamic-effort work. LV-8 prescription format follows the implement (% barbell main/Olympic/speed; RIR everything else; words for plyos; mass for medballs). LV-9 athletes get one speed and one strength exposure per lower pattern per week (BASEBALL 'Speed' Mon / 'strength' Tue; JL 'Front Squats' Mon / 'Low Bar Back Squat' Thu). LV-11 older/frail clients get fast-concentric machine work at 40-60 % 1RM before jumps [SCI]. LV-12 no barbell = a zone shift, not a missing quality (Olympic → hex-bar jump → KB swing/clean → DB snatch/jump → 'BodyWeight Squat to calf raise' or broad jump; flag `zone_shift`).

### 7.3 The weekly set-progression engine

**What the coach said vs what the sheets show** [CHAT + OBS]: he adds sets "of the same thing" at the same load, spread over different exercises, ramping ~3/5/7 % by muscle size. The sheets never write a %; they add **whole sets every 2-3 weeks** (AESTHETICS-8 2,3,3,3,4,4,5; AESTHETICS-12 3,3,3,4,4,4,3,4,4,4,4,5; STRENGTH-12 4,4,5,5,6,6,3,5,6,6,7,7; HYBRID 2,2,2,3,3,3,4,4). Block averages: +4.75 %/week (AESTHETICS-12), +5.2 % (STRENGTH-12), +5.3 % (FAT BURN), +3.8 % (BOXING weeks 3-8); the 8-week tracks from a 2-set start run faster (+16.5 % AESTHETICS-8, +10.4 % HYBRID); BASEBALL pre-season +2.6 to +3.8 %; in-season flat. Step weeks themselves are +20 to +50 %.

**Engine** [INF; one rule reconciles chat + sheets]:

| Component | Rule |
|---|---|
| Unit | weekly hard sets per muscle (fractional credit, §5.1) |
| Rate by size | big lower (quads, glutes, hamstrings) **3 %**; big upper (chest, lats/upper back) **5 %**; small (biceps, triceps, side and rear delts, calves, forearms, abs) **7 %**; unplaced muscles none. Focus muscle one class up (max 7 %). Why big = smaller %: at his typical volumes every class then gains ~+0.5 set/week (quads 16 × 3 % = 0.48, chest 10 × 5 % = 0.50, biceps 8 × 7 % = 0.56), i.e. +1 set every ~2 weeks, his observed cadence; the reverse mapping would push glutes 21 → 31 in 7 weeks. [mapping INF; CAT-02 classes COACH; VOL-05 pending] |
| Target | `target_k = start × (1 + rate)^(k − 1)`, k = loading-week index (deload weeks skipped) |
| Bank, then chunk | release nothing until `target − current ≥ 1.0` set; then add `clamp(round_half_up(0.10 × current), 1, 2)` sets: +1 up to 14 sets, +2 from 15 sets, followed by hold weeks. Reproduces the chat: chest at 20 sets on its base 5 % → W2 target 21.0 → +2 → **22**, W3 hold. |
| Readiness gate (logbook) | RED ('Felt a PAIN' or "10 - I'm done") → no release, pain swap first, −1 set, rate 0 until 2 clean exposures; AMBER ('9 - That was terrible' or 'Felt the WRONG muscle') → hold, bank keeps accruing; GREEN (EFFORT 6-8, right muscles) → release; EASY (EFFORT 1-5) → raise load or reps first, not sets |
| Placement | fixed block menu of 2-3 exercises per muscle; new sets round-robin across them ("with different exercises"); small muscles take their isolation slot first; big lower muscles respect the bilateral : unilateral target (§6); an exercise that gets a new set keeps its load that week ("let's say I keep the load the same"), all others use double progression; synergist credits recomputed; overflow → 'Focus 1'/'Focus 2' |
| Caps | per muscle by size and level (§5.4); per session ≤ 10 fractional sets per muscle [SCI ~11]; per exercise 5 (hypertrophy compound), 4 (isolation, fat loss, athletic), 7 (strength 'the work'); ≤ 2 exercises per muscle per session, ≤ 3 per week; session totals L1 15 / L2 20 / L3 22 / L4 24 (athletic incl. athletic sets 24-30); week-over-week total ≤ +10 % except one muscle's +2 step and planned phase changes (his own product steps are +20-50 %: smooth vs step is a coach choice) |
| Load progression | double progression (hold load until every set hits the top of the bracket at target RIR, then +2.5-5 kg lower / +1-2.5 kg upper / next DB pair; reset reps); strength main lifts +5 % every 2 weeks with RPE 7 → 9; home DB clients progress reps → tempo → ROM → sets before load |
| Volume load | logged, shown, never steered on; e1RM (Epley) for progress checks across a load jump; fatigue flag when sets rose but VL per set fell ≥ 10 % for 2 exposures |
| Goal modifiers | hypertrophy = class rate on sets; fat loss ≤ 3 % on sets + isolation reps stepped + circuit density; strength = load-led, sets ~5 %, accessories hold; athlete off/pre-season = quality and exposure first (plyo zone, force phase, contacts +10-15 % per 2-week step), resistance 0-3 %; in-season frozen; pain 0 % |
| Modes | SMOOTH (this engine, default) or TEMPLATE STEP (+1 set per exercise every 2-3 weeks as in his 12-week products) [PER-10 pending] |

**Worked check** (11 §3.12, L2 aesthetics, chest focus, 6 weeks): chest 16 → 18 → 18 → 20 → 20 → 22 (cap 24); quads 16 → 16 → 16 → 16 (AMBER hold) → 18 → 18; biceps 10 → 10 → 11 → 12 → 13 → 14; next plan opens with a deload at round(min(0.85 × W1, 0.75 × peak)) = chest 14, quads 14, biceps 9.

**Deload** [OBS shapes; rule INF]: same exercises and frequency; sets back to about week-1 volume = `round(min(0.85 × W1, 0.75 × peak))`; RPE 6-7; no MYO / AMRAP / supersets / contrast / buy-outs / Olympic; plyos 1-2 sets of landings (contacts −50-70 %). His deloads: AESTHETICS-12 week 7 = 100 % of week-1 sets (−25 % from peak); STRENGTH-12 week 7 = 75 % of week 1 (−50 % work sets); BASEBALL 'DELOAD WEEK' resistance 58 = 76 % of block week 1 (−31 %; −46 % of all sets), which replays the 'WEEK 7' menu with bands, complexes, myo sets and 'heavy'/'weighted' versions stripped. None goes below 60 % of week 1. A 40-60 % cut is reserved for a pre-competition taper. Early deload triggers: 2 consecutive weeks with EFFORT 9-10 on ≥ 30 % of logged sets; 'Felt a PAIN' on ≥ 2 slots in a week; load or reps falling on ≥ 3 main lifts for 2 exposures. After a deload restart at the wave-1 midpoint, never at the last peak.

### 7.4 Variation policy ("don't confuse the muscle")

**His rule** [CHAT]: "you don't want to always be trying to 'confuse' the muscle ... not a lot of new things, more like looking at the same over the same block, and in the next block you can change some small variables." [OBS SQ A5] "don't go too far into changing it, you may ruin the stimulus." Conditioning is the exception: 'Never do the same color workout in the same week'.

**What his sheets do** [OBS, 1,670 week-to-week slot transitions]: the slot skeleton almost never changes, but the exercise inside it changes in 78 % of transitions (SAME 22.1 %, SAME + small variable 47.7 %, implement swap 14.0 %, pattern swap 38.3 %). Three styles: two-menu A/B (4T 12-week tracks: 78.5-81.3 % of changes return to the exercise of two weeks before), one small variable per week (AESTHETICS-8 lunges; HYBRID 81 % same-or-small), and a new weekly menu inside a fixed slot and speed zone (BASEBALL ≈ 5 exercises per slot per block). Novelty sits in the athletic and power tiers (power tier 3.5 % SAME, power-strength 0 %); isolation and resistance patterns are the most stable. His newest, generator-facing material is block-fixed by construction: every BYOP template is a single week; BOXING uses one exercise list for weeks 3-8; the ATHLETIC levels are one template each ('First 8 weeks (8wk1)').

| ID | Policy | Tag |
|---|---|---|
| VP-1 | Block = fixed menu (4-6 weeks; 6-week plan = 1 block; 8 = 2 × 4; 12 = 2 × 6 or 3 × 4). Weekly change limited to sets, reps, load, RIR. | CHAT + OBS BYOP/BOXING; SCI |
| VP-2 | Optional two-menu A/B for strength and fat-loss tracks or variety-seeking clients (lead lift alternates squat ↔ hinge or bench ↔ overhead). | OBS 4T 'A WEEK'/'B WEEK', audit N8; option (PER-03) |
| VP-3 | Zone-constant rotation only in athletic accessory slots (plyo, throw, loaded jump, speed variants); skill anchors (Olympic lift, main squat/hinge/press, main sprint drill) fixed ≥ 8 weeks. | OBS BASEBALL; SCI; stricter than his practice (open) |
| VP-4 / VP-5 | At a block boundary each slot changes ONE small variable (or nothing); full replacement for ≤ 1/3 of slots. A small change = one colour step, one REPS-menu notch, ±1 constraint, one zone step, one stance step, one plyo zone, one Olympic start height. | CHAT; INF magnitude |
| VP-6 | Within-week twins are not confusion: the two weekly exposures of a slot may use twins of one category (front-loaded early week, back-loaded later; speed twin vs strength twin). | OBS JL E8/E35; PER-04 pending |
| VP-7 | Mid-block swaps only for: 'Felt a PAIN' (pain swap), 'Felt the WRONG muscle' twice (one variable), "Couldn't do it" (one level down / assisted), two GREEN exposures with no progress (one variable). Never for soreness or novelty. | OBS dropdowns; INF |
| VP-8 | ≤ 2 distinct exercises per slot per block for non-athletic goals; ≤ 3 exercises per muscle per week; no new exercise in a deload week. | INF |
| VP-9 | Cadence by family: hypertrophy block-fixed (A/B optional); strength A/B lead-lift rotation; fat loss 2-week mini-blocks (FAT BURN upgrade at week 3); athletes off-season zone-constant rotation in accessories, anchors fixed; pre-season replay earlier menus (overlap up to 0.81); in-season two familiar menus alternating (0.54-0.89). | OBS |
| VP-10 / VP-11 | Position-zone step and core ladder (thorax → pelvis → both; sagittal → frontal → transverse; static → dynamic) are between-block levers, one step per block. | COACH CAT-04/08; INF order |
| VP-12 | Levels are not a variation engine: promote a slot one level only after two exposures at EFFORT ≤ 8, 'Felt the RIGHT muscles', no pain; it then counts as that slot's one small variable. | COACH CAT-05/06; INF trigger |

Between-block variable order (smallest perturbation first) [INF from his ladders]: grip → feet/body → stance → load laterality → position zone → ROM / end range → implement / constraint → tempo → rep bracket → accommodating resistance.

### 7.5 Ordering rules with compliance statistics

Source: `analysis/equipment/ordering_audit.md` (466 sessions from 17 tabs; BYOP = the generator-facing templates) [OBS counts; decisions INF].

| ID | Rule | All sessions | BYOP | Where it breaks | Generator decision |
|---|---|---|---|---|---|
| R1 | Horizontal pull before vertical pull | 19/67 (28 %) | 13/13; MM UL + PPL 6/6 | FAT BURN 0/8, 4T 0/38, BOXING 0/2 (pulldown written above the row) | default H → V ([CHAT] house rule; INF reason: zone 2 before zone 3); ORD-01 |
| R2 | Horizontal push before vertical push | 29/49 (59 %) | 15/15 | CONJUGATE / 4T STRENGTH overhead weeks ('HEAVY OH PRESS' is 'the work'); 4T AESTHETICS 'Arnold press' weeks | default H → V; override when the vertical lift is the session's priority ('the work'); ORD-02 |
| R3 | Athletic / power before strength | 128/155 (83 %) | 12/12 | contrast complexes; plyos typed in BASEBALL strength slots; HYBRID Tuesday jumps after bench | hard rule except contrast stations |
| R4 | Olympic / triple extension before heavy strength | 49/78 (63 %) | 12/12; BASEBALL 32/40 | HYBRID 'STRENGTH' (B74) above 'OLY/ POWER' (B75) 16/16; light DB snatch as a late shoulder accessory | hard rule when the Olympic lift is the power priority; ORD-03 |
| R5 | Bilateral before unilateral (same region) | 225/231 (97 %) | 100 % | machine MYO finisher; 'Camporini DL'; boxing step-up | hard rule (machine finisher exempt) |
| R6 | Compound before isolation | 227/301 (75 %) | athletic 100 %; aesthetics 50 % | 'Calves' first on AESTHETICS A days; side raises first on 19/24 4T push days | default; isolation first only for a declared priority small muscle; ORD-04 |
| R7 | Big before small muscles | 178/244 (73 %) | mixed | as R6; regions alternate inside the isolation block | compound block → isolation block |
| R8 | Alternate lower / upper (full body) | 165/193 (85 %) | 4-day 100 % | CONJUGATE / 4T strength lower days; BOOTCAMP 2 | default L-U-L-U; strength lower days exempt |
| R9 | Knee-dominant with pull, hip-dominant with push | 160/193 (83 %); pairs 186/222 | 100 % (00/03/04/07/08); BASEBALL 92/92 | BOOTCAMP 1 Tue/Fri; 3-DAY Day 3; conjugate lower days | default; N-SES-02 |
| R10-core | Core at the end or on a separate day | 22/165 (13 %) | 100 % (optional days) | athletes: core is Part B after ballistics and before strength (BASEBALL 112 items) | split by family: aesthetics separate/last; athletes primer after the athletic block; N-SES-01 |
| R10-cond | Conditioning last or on a separate day | 107/121 (88 %) | 100 % | BOXING opens with cardio (4/4); HYBRID Friday; BOOTCAMP 2 mid-session | default; easy aerobic or the day's sprint stimulus may go first |
| N1 | Arm isolation follows the day's upper pattern | biceps 79/136 pull-only sessions vs triceps 2; triceps 73/99 push-only vs biceps 3 | yes | BOOTCAMP 2 antagonist filler | default |
| N2 / KF-1 | Lower isolation matches the day; LEG FLEXION after the hinge lifts; leg extension before leg curl | quad iso on KD days 10 vs 1; ham iso on HD days 11 vs 1; ext before curl 12/14 | yes | BOXING weeks 1-2 | default; never fill a BHD/UHD slot with a curl (CAT-09) |
| N5 | Inside the power block: plyo / throws / COD / sprint before Olympic | 48/51 | 'Plyo','Plyo','Throwing','COD' above 'Tripple Extension' | 3 sessions | hard rule |
| N6 | Landing / stick before reactive jumps | 11/13 | - | bilateral before single-leg plyo only 12/21 (not a rule) | default |
| N8 | Weekly A/B swap of the lead lift | FAT BURN, CONJUGATE, 4T (up to 11 lead changes in 12 weeks) | n/a (days repeat) | - | VP-2 option |
| N10 | Prep first ('Any Cardio Equipment' 5 min; 'KB Book openers ' before pressing; A-drills before squatting) | UL 6 + 3, PPL 9 + 3 sessions | - | - | tier 0 |
| N11 | 'the work' (1RIR) → 'the accessory' (2RIR) → 'the nuance' (MAX) → 'the survival' (ALL) | CONJUGATE M13:M16, 4T M9:M24 | - | outranks R1/R2 | strength backbone |
| N12 | Contrast: heavy → fast of the same pattern, 'immediately' | 11 instances | - | the one intended break of R3 | athletic/strength, off/pre-season, intermediate+ |
| N13 | MYO only on the last exercise; 'MAX'/'ALL' only on the last two slots | 13/13 MYO cells | JL G12 | - | hard rule |
| N14 | Supersets pair non-competing patterns | BASEBALL 'Superset - same reps' ×19; 4T ×8; MM 05 ×7 | 'SUPERSET W/ 👇' unused | same-muscle pairs only as contrast or late-block finishers | default |
| N16 | Squat before hinge when both are bilateral | 54/84 | - | every hinge-first session is in a weekly-alternating program | default unless A/B week |
| N18 | Bilateral lower + horizontal vector; unilateral + vertical | BYOP 29 vs 2 / 24 vs 2 | yes | BASEBALL moves V to Thu/Fri | BYOP-derived templates |
| C1 | Constraint rises through the session | BYOP athletic 1.0 at slot 1 → 3.8-3.9 at slots 9-10 (Spearman 0.72-0.78); JL 1,1,3,1,1,2,3,1,1,5 | yes | 4T AESTHETICS-12 reverses it | sort key 2 after tier |
| C2 | Reps rise as constraint and isolation rise | Spearman 0.72 over 21 filled BYOP slots | yes | - | rep matrix |

**Ordering algorithm** [INF]: (1) sort by tier: 0 prep → 1 reactive (landing before rebound) → 2 throws → 3 COD/sprint → 3b core primer (athletic families; BASEBALL Part B sits above the 'OPTIONAL PIECE' 'OLY' row) → 4 power-strength (triple extension / Olympic) → 5 bilateral lower + horizontal upper → 6 unilateral lower + vertical upper → 7 isolation (arm matching the day; LEG FLEXION after the hinge; leg extension before curl) → 8 core finisher (aesthetics) → 9 conditioning; (2) inside a tier sort by ascending constraint, then zone 2 before zone 3; (3) overrides in order: contrast stations, priority lift = 'the work', declared priority small muscle first, conditioning first only as the day's sprint stimulus or an easy C warm-up; (4) MYO/AMRAP only on the last exercise, 'MAX'/'ALL' only on the last two slots.

### 7.6 Quality-of-movement rules (summary of QM-1 … QM-11) [OBS cues + INF rules]

QM-1 set termination by zone (speed/power: first slower rep; strength RIR 1-2; hypertrophy RIR 1-2, 0-1 on machines last set; isolation/MYO technical failure last set only; deload RIR 3-4). QM-2 a rep counts only if it meets the position and ROM standard ('MAXIMAL UPRIGHT POSTURE'; full lockout and stretch); the first rep that misses ends the set. QM-3 'same speed for all reps' as the velocity-loss proxy. QM-4 add load only after 'Felt the RIGHT muscles', EFFORT ≤ 8 and full ROM. QM-5 "Couldn't do it" → one level down or assisted, volume unchanged; 'Felt a PAIN' → pain rule before any volume cut. QM-6 medball gate: slower throw, head drift or side-bend → 2 lb lighter. QM-7 plyo zone gating: Z1 → Z2 only after two sessions of clean 3-s sticks; a height or box change resets to the simpler pattern ('Bigger plates start at lateral bilateral plate hops'). QM-8 Olympic skill ladder (high → mid → low hang → floor; power before squat receive; never to failure). QM-9 fatigue-sensitive work first; an athlete who logged EFFORT 9-10 keeps the athletic block but at −1 set. QM-10 move a slot one constraint level up (or one zone down) when position fails late in a session. QM-11 upright posture is the foundational standard (§4.5).

---

## 8. Equipment & constraint model

Full version: `10_equipment_model.md` / `.json` (28 implements, 11 access profiles, ordered substitution lists for 33 slots × 11 profiles, 28 client rules, 432-item exercise index) and `10b_equipment_variables_science.md`.

### 8.1 The coach's view [CHAT + COACH]

Machines have many reference points (sit down, feet on the ground, move the hands or the feet), so you can push a lot and it is safer: better for people going up in volume, injured or older. Free weights are very different; barbells are the most skilled; DBs, KBs and medballs sit in between. Clients will state what equipment they have, so the model must be ready with references and substitutions. Machines and cables make any position zone easier because they do the stabilising [COACH CAT-04].

### 8.2 The constraint scale (external reference points, Davidson's "ground") [INF scale; examples OBS]

| Level | Definition | Examples from his library | Suits |
|---|---|---|---|
| 5 | seated or lying, pad-supported, fixed path | 'Leg press' AI98, 'Leg Extensions' AM9, 'Seated leg curls' AR9, 'Machine Calf Raises' AU13, 'Machine Row Close Grip' X9, 'Machine bench press' AD14, bike calories | frail/older, pain, high-volume finishers, MYO/near-failure sets |
| 4 | plate-loaded / fixed-path machine; seated or leaning cable; chest-supported free weight; wall/ball-supported squat | 'Pendulum Squat' AI99, 'Hack Squats' AI97, 'Lat Pulldown Wide Grip' U9, 'Assisted Pull-Up Machine Pronated Grip' U17, 'Seal DB Rows Supinated Grip' X52, GHD | beginners learning a pull (on-ramp), volume clients, older/injured |
| 3 | standing cable; free weight supported by bench or floor; box as a depth reference; floor core | 'Cable Standing Chest Press' AD9, 'DB Bench Press' AD94, 'Box Squats' AI13, 'Glute Bridges' AN9, 'Incline Push-ups' AD12, 'Plank' O10 | beginners, hypertrophy accessories, pain regressions |
| 2 | free weight or bodyweight, standing, no external support | 'Front Squats' AI46, 'Barbell Deadlifts' AN92, 'Standing DB Press' AA50, 'Push Ups' AD47, 'Goblet KB/DB Squats' AI11, every UKD lunge, hang pulls and Olympic lifts | strength main lifts, athletes, intermediate+ |
| 1 | open space: hanging, inverted, single-leg free, ballistic, reactive | strict/weighted pull-ups U46:U52, 'Handstand Push ups' AA52, 'Pistol Squats' AL13, 'DB Push press' AA11, KB swing AN20, all plyos | athletes (athletic slots, main lifts), advanced bodyweight skill |

Library means [OBS tags]: machines 4.43 (0 % high-skill entries), cables 3.17, DB/KB 2.32 (4 % high skill), barbell family 2.20 (45 % high skill, 51 % high stability demand). FOUNDATIONAL blocks average 2.98 (34 % machine/cable) and ADVANCED 2.21 (39 % barbell); upper body removes constraint with level (vertical pull 3.5 → 1.0) while lower body files machines higher (leg press, pendulum, hack in ADVANCED as volume tools).

Rules: GRD-1 constraint is the primary equipment axis; each slot gets a target band per client family; out-of-band options are penalised, not banned. GRD-2 remove ONE reference per block (support seated → kneeling → standing; base bilateral → split → single-leg; implement machine → cable → DB → barbell; path fixed → free; tempo controlled → fast; zone 1 → 2 → 3) [OBS RP-tab E8:E15 colour ladder + COACH CAT-04; rule INF]. GRD-3 direction by goal: hypertrophy holds or raises constraint on the sets that carry volume; athletes lower it on main and athletic slots until everything but finishers is 1-2; pain raises it +1 to +2 on the affected region. Machine roles: **ON-RAMP** (assisted pull-up, pulldown, machine row: library FOUNDATIONAL), **VOLUME TOOL** (leg press, pendulum, hack, hip-thrust and good-morning machines), **ISOLATION** (leg extension, leg curl, calf machine).

### 8.3 Who gets machines vs free weights

**What his programs use** [OBS, MM line items; canonical constraint]:

| Population | Mean constraint | Constraint 4-5 | Fast / ballistic items | Medball items | Top implements |
|---|---|---|---|---|---|
| gen pop (UL, PPL, FAT BURN) | 2.81 | 36 % | 2 % | 0 % | DB 33 %, barbell 18 %, machine 18 %, cable 15 % |
| strength / powerlifting | 2.56 | 22 % | 16 % | 0 % | barbell 37 %, DB 35 %, machine 11 % |
| athletes | 2.00 | 11 % | 45 % | 13 % | DB 29 %, bodyweight-ballistic 14.5 %, barbell 13 %, medball 13 %, **machine 0.5 % (5 of 949 items)** |
| hybrid | 1.89 | 0 % | 36 % | 0 % | barbell 41 %, DB 28 % |
| boxing | 2.37 | 24 % | 30 % | 8 % | weeks 1-2 a gym template (14 % machines); weeks 3-8 athletic (56 % fast) |
| CrossFit | 2.04 | 0 % | 32 % | 0 % | barbell the only loaded implement named |

"If you read the workouts you can understand them by their equipment usage" [CHAT] holds: athletic programs are near machine-free and medball-rich; physique programs are about a quarter machine; CrossFit is barbell.

**Client rules** (`10_equipment_model.json > client_rules`, CR-01 … CR-28; [INF] unless tagged):

| Client | Main lifts | Accessories / isolation | Key rules |
|---|---|---|---|
| Athlete (CR-01) | constraint 1-2 (barbell, hex bar, DB, KB) | machines only as the last 1-2 slots (≤ 5 % of items) | athletic slots bodyweight / props / light medball at max intent; medball 10-20 % of items; fast/ballistic 40-50 % [OBS targets] |
| Hypertrophy (CR-02) | 2-4, 1-2 free-weight lead lifts per session | 3-5 | machine + cable 30-35 % of items; DB 30-45 %; failure / MYO only on constraint ≥ 4 or isolation, last exercise |
| Strength (CR-03) | barbell (constraint 2), 'the work' → 'the accessory' → 'the nuance' → 'the survival' | DB, machine, cable | barbell 35-40 %, fast items 10-20 % (FAST/banded days) |
| Power / speed goal (CR-04) | lightest implement that still needs max effort; heaviest that does not slow the movement | - | stop at visible slowing |
| Fat loss / bootcamp / general (CR-05) | 2-3 | DB, bodyweight, KB; machines on muscle-building days | circuits ~70 % bodyweight, ~20 % DB |
| Hybrid / CrossFit (CR-06) | barbell dominant + DB, KB, pull-up bar, wall ball, ergs | - | no machines; Olympic hang/power variants with % |
| Older / frail ≥ 65 (CR-10) | **4-5** | 4-5 | pendulum, leg press, selectorised press/row/pulldown, assisted pull-up, leg extension, seated leg curl, bike; zone 1 loads; no Olympic lifts, depth jumps, hurdle hops, bounding; fast-concentric machine work at 40-60 % 1RM before any jumps [CHAT "older" + COACH CAT-04 + SCI NSCA] |
| Pain flag (CR-12/13) | +1 to +2 constraint on that region | | order: split grips → unilateral (athletes) → +constraint → load toward zone 1 → pain-free range → only then cut sets [OBS MM 05 A6 + CHAT + COACH]; lower-limb pain removes depth jumps, high depth drops, hurdle hops, bounding, running intervals |
| Volume block (CR-14) | | added sets go to constraint ≥ 4 options of the same pattern | keep load, add sets, MYO on the last machine only [CHAT] |
| Beginner (CR-15) | eligible F; zone 1 first (goblet, zercher, hex, suitcase, landmine) + leg machines | on-ramp pulls (pulldown U9-U14, assisted U16-U18, machine row X9-X11; at home band-assisted) | seated presses before standing; push press/jerk operatively ADVANCED |
| Intermediate / advanced (CR-16/17) | F/I (+ zone 2) / F/I/A (+ zone 3, back-loaded, overhead, hanging) | remove one reference per block | advanced: accommodating resistance, contrast stations, DB plyos, full Olympic lifts |
| Youth < 15 (CR-18) | technique loads, no maximal lifts, no full Olympic lifts from the floor; zones 1-2 | | medball 4-6 lb; foundational/moderate bodyweight plyos |
| Small-muscle slots (CR-28) | | DB first, then cable/machine/band; low skill; more reps | [COACH CAT-02 + OBS 55 % DB/KB] |
| Leg flexion slot (CR-27) | | seated curl (lengthened) → DB / swiss ball / slider / medball curls → Nordic (advanced) → banded rolling curls | counts as knee-flexion hamstring sets [COACH CAT-09] |
| Always (CR-22/23/26) | knee-dominant machine rank **Pendulum > Leg press > Hack**, never V-squat; hack-only gym → free-weight main squat + hack as accessory | | failure only at constraint ≥ 4 or isolation; machines eligible at every client level |

### 8.4 Access profiles, gaps and minimum kit [INF profiles; coverage counts computed]

| Profile | Kit | Main slots with no as-written library option |
|---|---|---|
| FULL_FACILITY | platform, turf/track, full machine line | none |
| FULL_GYM | big-box gym incl. specialty machines | none (lacks drop-area Olympic lifts, hurdles, runway) |
| BASIC_GYM | no specialty machines/bars | none (loses hex bar, landmine, pendulum, GHD, hurdles, hip-high box) |
| HOME_BARBELL | barbell + rack + plates + bench + DBs (+ bar on rack) | throwing, leg extension, functional chops |
| HOME_DB_BENCH_BANDS | DBs + adjustable bench + bands with door anchor | throwing, vertical pull (bands only), leg extension |
| KB_ONLY | 1-2 kettlebells + household | throwing, vertical pull, leg ext, side/rear delt, biceps, triceps, chops |
| BANDS_ONLY | bands + door anchor + household | throwing, horizontal and vertical pull, leg ext, delts, biceps, triceps |
| BODYWEIGHT ('no access') | floor, wall, step, chair, towel, outdoor space | throwing, horizontal pull (table row only), **vertical pull, biceps (true gaps)**, leg ext, delts, triceps, chops |
| HOTEL_GYM | light-moderate DBs, bench, stability ball, treadmill/bike | throwing, vertical pull, leg ext, chops |
| BOOTCAMP_OUTDOOR | medballs, slam balls, cones, mini hurdles, boxes, bands, field | pulls, leg ext, delts, biceps, triceps |
| TRACK_FIELD | runway, steps, turf | throwing, both pulls, leg ext, delts, biceps, triceps, chops |

* A basic commercial gym loses almost nothing. Home DBs + bench + bands keeps about half the menu. 'Leg Extensions' (AM, 1 machine option) and the BYOP 'Leg Curls' wiring (AR, 2 machines) never survive without equipment as written; the LEG FLEXION segment gives home clients slider, ball, Nordic and DB curls. UKD is 13/13 options everywhere (lunges are written implement-free).
* **NO ACCESS is not equipment-filtered** [OBS]: the two hidden 'NO ACCESS' tabs read the same gym menus (plus the AR miswire and a prefilled 'Leg extensions'). Never infer equipment from a template name; filter from intake only.
* **Smallest kit that covers every pattern** [INF]: DBs + adjustable bench + bands with a door anchor + doorway pull-up bar; plus an 8-10 lb medball and a box/step for athletes. Add-ons ranked by slots unlocked for a bodyweight client: dumbbells (opens horizontal pull, delts, biceps, triceps) > barbell set > TRX > kettlebell > bands > pull-up bar (vertical pull) > medball (throwing).
* Tiers in the catalog: T0 bodyweight/household, T1 minimal kit, T2 home weights, T3 gym (`02_exercise_catalog.json > equipment.min_access_tier`); crosswalk to the 11 profiles and to 10b's P1-P5 in `09_generator_inputs.md` §4.4.

### 8.5 Substitution logic

**His own swaps first** [OBS, 42 'X or Y' strings with cells in `10 > coach_alternates`]: 'Machine Dips or dips' (×20), 'Any Cardio Equipment' (×15), 'machine or db flies' (×12), 'machine rows or db rows' (×12), 'LAT PULL DOWN/PULL UP' (×9), 'machine or db Reverse flies' (×8), 'Ez bar curls or barbell' (×8), 'Sqats or Leg Press' (×6), 'Deadlifts (DB or Barbell)' (×6), 'Reverse Lunges (Bodyweight or DBs)' (×6), 'Cable or DB side raises', 'Bench Press (DB or Barbell)', 'Pull ups or Lat pull down', 'Overhead Press (DB or Barbell)', 'Curls (any kind)', 'Tricep (any kind)', 'DB Rows or Row machine', 'RDL/Good morning', 'toes to bar or knees to chest', '3x 10 cal row sprint or ski', and the cell-level ladders 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' (cable → band → bodyweight) and **'leg press or just add 2 more rounds to front squats'** (a missing machine becomes +2 sets of the free-weight lift of the same pattern). Gen-pop tabs write the free weight first ('Sqats or Leg Press'); the bodybuilding 12-week track writes the machine first.

**Algorithm** [INF; `10b` §9.3, `10` §3.4]:
```
fill_slot(slot, client):
  candidates = library[slot.bucket] filtered by client kit, operative level <= client ceiling, exclusions, pain filters
  if empty: candidates = coach 'X or Y' alternates for this bucket that fit the kit
  if empty: candidates = same pattern, other implement class (machine -> cable -> DB -> band -> BW), any level; flag level_shift
  if empty and slot is a machine isolation (leg ext / leg curl): add 2 sets to the preceding same-pattern compound; flag machine_slot_absorbed
  if empty: zone-preserving substitute (athletic: Olympic -> hex jump -> KB swing -> DB snatch -> BW jump, flag zone_shift)
            or nearest pattern (resistance, flag pattern_gap) + add the missing item to a buy list
  score: + coach preference ('LOVE IT', his alternates, his staples) - |constraint - client band| + lengthened bias for isolation
         - skill penalty above the client's level - pain penalty (fixed grip / bilateral on a flagged region)
         + continuity bonus inside a block (VP-1)  ; laterality change -> flag laterality_shift (CR-25)
```
Flags shown to the client: `same_pattern`, `partial`, `zone_shift`, `pattern_gap`, `laterality_shift`, `misfiled_not_this_pattern` (e.g. 'KB Face Pulls ' U20 is not a vertical pull).

### 8.6 Load-velocity prescriptions by intent

| Intent zone | Implements | His prescriptions [OBS] | Science dose [SCI] |
|---|---|---|---|
| reactive / starting speed | bodyweight; boxes, plates, hurdles as targets; reverse band | 'EASY' plyos ('DEPTH DROP & JUMP', 'HIGH SQUAT JUMPS', 'REPEAT HIGH JUMPS' × 6); 2 × '6 to 8 Reps'; 'Hurdle hops' 2 × 20 | 5-10 contacts × 2-4; drop height ~20-40 cm; contacts < 250 ms |
| speed-strength | medball, slam ball, light DB / hex loaded jumps | 'MB fast chest pass ' 10; 'Really high jump squats LOAD & jump hard' 8; 'DB Squat Jumps' / 'Hex bar squat jumps' 12/10/8/8 | 3-6 × 3-5; jump squats body mass to ~30 % 1RM; hex ~20 % squat 1RM |
| strength-speed | barbell (Olympic, dynamic effort), KB swings, bands | 'Hang cleans @ 75%' 4 × 8 → '@ 90%' 4 × 4; 'FAST RPE6 or about 60-70%' (also on 'LEG PRESS'); bands 'around 50% so you can move fast'; 'Front squats - light weights - same speed for all reps'; 'Fast KB swings' | power clean ≥ 70 %; DE 50-60 % bar + 20-30 % band, 6-10 × 2-3; stop at ~20 % velocity loss |
| accelerative / absolute strength | barbell, hex bar, weighted bodyweight | '1RIR' on 'the work'; 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+', '*REST 3-6 MIN BETWEEN SETS'; '78% of 1RM' contrast; chains 'around 70%' | ≥ 80-85 % 1RM, 1-6 reps × 3-6, 3-5 min |
| hypertrophy | DB, cable, machine, barbell | '(1 RIR) *RPE8+', '*REST 1-2 MIN BETWEEN SETS'; '1-3 RIR aka RPE 7+'; VOL 1/2/3 | 5-30 reps ≤ 4 RIR; 2-3 s eccentric, max-intent concentric |
| local-fatigue machine | leg press, pendulum, selectorised isolation | LEG PRESS "local fatigue of the quads/legs and not have so much systemic fatigue failure"; '2 sets LEG PRESS MYO - 15-5-5-5-5-5' | near-failure work kept on constraint ≥ 4 [INF] |

**Medball rule** [CHAT + SCI; no ball weight is written in any cell]: adults 8 lb on chest and rotational passes, 8-10 lb on overhead, sit-up-to-overhead, scoop and backward throws (his "light, 8-10 lb so force is produced with speed"); slams 10-20 lb [INF]; female athletes or < 60 kg −2 lb; youth < 15 and older/beginner clients 4-6 lb; quality gate: slower throw, head drift or spine side-bend → −2 lb; never above 10 lb on rotational/chest throws. Dose 1 × 10 per throw (sit-up throws 1 × 20), R/L pairs. Science would start rotational/chest passes at 6-8 lb for smaller clients: an option until EQ-06 is answered.

**Other loads** [OBS + SCI]: DB-loaded jumps ~10-20 % body mass total; DB drop-release jumps ~20 % (BA C40, LIB G136); Olympic start-position ladder high hang → mid hang → low hang → floor, catch ladder pull → power (front rack) → snatch/jerk (overhead) → squat; without bumpers use hang/power cleans lowered under control or the no-barbell ladder; accommodating resistance only for intermediate+ barbell clients in full-gym profiles (never home, novice or pain); tempo: never slow eccentrics on throws, jumps, Olympic or DE work; slow eccentrics for control blocks, pain and light home equipment ('Goblet squat slow', 'SLOW FRONT SQUATS', 'slow eccentric deficit Lunges (no weigths)').

### 8.7 The coach's machine preferences [OBS SQ G35:I41]

| Rank | Machine | Verdict (verbatim) | Generator |
|---|---|---|---|
| 1 | PENDULUM | 'LOVE IT': 'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these' | first choice for knee-dominant machine volume |
| 2 | LEG PRESS | 'LOVE IT': 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' | default knee machine; MYO sets; 'FAST' 60-70 % option; swap pair 'Sqats or Leg Press' |
| 3 | HACK SQUAT | "I PERSONALLY DON'T LIKE IT": "Most hack squat machines don't have the right strength profile for me ... I know there are amazing people out there having great results with them." | fallback only |
| never | V-SQUAT | "DON'T LIKE IT": "Always tight on lower back & knees, so I don't presercibe the use of these, ever." | never |

Context: 'This model is based on free weight squats, leg presses and machines will be covered at the end' (SQ A4). Unrated machines are neutral: rank by constraint fit and usage; seated leg curl above lying (lengthened position [SCI]). Never sell a machine as "better for growth" (machines ≈ free weights for hypertrophy [SCI]).

---

## 9. Athlete / goal emphasis matrix

Full version: `04_athlete_profiles.md` / `04_profiles.json` (27 profiles + 23 position/phase variants, each a weekly set budget per category in his slot grammar, with season multipliers, injury rules and rationale).

### 9.1 The principle: one skeleton, many dials [OBS + INF]

He does not write a different program per sport. The BYOP templates share one resistance skeleton and swap the **prefix**: 4-5 athletic slots for athletes, calves/biceps/triceps for physique, cardio slots for bootcamp [OBS]. The two sport programs he actually wrote reuse the same 8-pattern vocabulary in different grammars: BASEBALL is a Parts A-E grid (ballistics → core by plane → optional OLY → bkd + uhd / bhd + ukd supersets → buy-out); BOXING is a 2-week upper/lower 3 × 10 base followed by 6 weeks of complex-based full-body days [OBS]. Treating a sport as a set of dials on the skeleton is our modelling choice [INF]. The dials: (a) which athletic slots precede the resistance block and how many; (b) sets per slot; (c) which resistance slots are dropped or doubled (sport specificity by **removal**: the boxer loses horizontal push, vertical pull and arm isolation after the base; baseball never writes a barbell bench); (d) exercise selection inside slots (direction, laterality, plane, implement); (e) conditioning colours; (f) season multipliers.

**Athletic share of weekly working sets, excluding medball throws** [OBS]: 0 % physique/bootcamp/fat loss; 11-17 % gym UL/PPL (A-drills only); 5 % strength/conjugate; 16 % HYBRID; 16-22 % BASEBALL; 32 % BYOP ATHLETIC at 2 sets; 28 % → 19 % → 15 % across MM athletic STARTING/MID/ADVANCED; 36 % for the boxer's conversion weeks.

### 9.2 The plyo question, answered from the data

| Program | High-amplitude contacts/week | Low-amplitude/week | High-intensity per session |
|---|---|---|---|
| MM athletic STARTING (3 d) | 146 | 0 | 48.7 |
| MM athletic MID (4 d) | 71 | 120 | 17.8 |
| MM athletic ADVANCED (4 d) | 32 | 100 | 8.0 |
| BOXER weeks 3-6 | 113-129 (**248-264 if squirrel jumps count as he files them**) | 177 (+ ~1,080 rope contacts est.) | 28-32 |
| BASEBALL block means B1 / B2 / B3 | 103 / 151 / 135 (single weeks up to 174-201) | 97 / 89 / 66 | 26-38 |

**Reading** [OBS numbers; INF interpretation]: measured as total contacts the boxer is **not** low. "Boxers need fewer plyos" shows up as timing (zero plyos in the 2 base weeks), type (single-leg reactive squirrel jumps, rope, landings) and packaging (bilateral max-effort jumps only as 5-rep members of two complexes). So the matrix uses **separate dials**: high-amplitude rebounding contacts, low-amplitude stiffness contacts, ballistic throws, COD cuts, sprint metres, triple-extension sets, and the athletic vs resistance share. Caveat: the high/low split is the analyst's; if squirrel jumps are "real" plyos the whole scale must be re-anchored (N-CAT-13, N-ATH-02). BASEBALL's contact mix (4,690 contacts in a year): 75 % vertical / 16 % horizontal / 9 % lateral; 39 % unilateral; 6 % landings; 39 % low-amplitude; throws 57 % transverse; core 48 % transverse / 24 % sagittal / 22 % frontal.

### 9.3 Tier scales (INF boundaries, OBS anchors)

| Dial (per week) | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| High-amplitude plyo contacts | 0 | 1-40 | 41-100 | 101-160 | 161-220 | 221-320 |
| Low-amplitude contacts | 0 | 1-60 | 61-120 | 121-200 | 201-320 | 321-600 |
| Medball throws | 0 | 1-60 | 61-150 | 151-250 | 251-420 | 421-600 |
| Planned cuts | 0 | 1-30 | 31-70 | 71-120 | 121-180 | 181-260 |
| Triple-extension / Olympic sets | 0 | 1-5 | 6-10 | 11-16 | 17-24 | 25-40 |
| Sprint metres at > 90 % | none | drills only | 1-150 | 151-300 | 301-600 | 601-1200 |

Anchors: strength 18 contacts (T1); MM ADVANCED 32; MM MID 71; BYOP @2 72-96 (T2); BASEBALL B1 103, boxer 113-129, MM STARTING 146, BASEBALL B2 151 (T3); BASEBALL single weeks 174-201 (T4, observed); T5 has no observed week and is reserved for basketball, the sport he named first.

### 9.4 The matrix (baseline = off-season build week; `04_profiles.json > profiles[]`)

| Profile | Evidence | High-amp plyo (contacts/wk) | Low-amp | Throws | COD | Sprint | Triple ext. | Resistance H/S/P % | Lower uni % | Conditioning / wk |
|---|---|---|---|---|---|---|---|---|---|---|
| Basketball | INF | **T5** (220-300) | 140-220 | T1 (30-60) | T4 (120-160) | T3 | T2 | 25/40/35 | 55 | A 1.5, B 1, C 0.5 |
| Volleyball | INF | T5 (200-280) | 100-160 | T2 | T2 | T2 | T2 | 25/40/35 | 50 | A 2, C 0.5 |
| Football skill (WR/DB/RB) | INF | T4 (170-220) | 100-140 | T1 | T4 | T4 | T2 | 20/40/40 | 50 | A 2, C 0.5 |
| Football big skill | INF | T3 (130-160) | 60-100 | T1 | T3 | T4 | T2 | 25/45/30 | 38 | A 2, C 0.5 |
| Football linemen | INF | T2 (80-100) | 0-40 | T2 | T2 | T2 | T2 | 30/50/20 | 33 | A 2, C 0.5 |
| Soccer (outfield) | INF | T4 (160-200) | 100-140 | T1 | T4 | T4 | T1 | 20/40/40 | 50 | A 1, B 1.5, C 1 |
| **MMA** | INF | **T4** (160-200) | 100-140 | T3 (150-200) | T2 | T1-T2 | T2 | 20/45/35 | 42 | A 1, B 1.5, C 1, LC 1 |
| Kickboxing / Muay Thai | INF | T3 (110-150) | 160-220 | T3 (220-260) | T2 | T1 | T2 | 20/40/40 | 63 | A 1, B 1, C 1, LC 0.5 |
| **Boxing** | OBS | **T3** build (113-129; T5 if squirrel jumps count) / T2 camp | 140-180 | T4 (190-380) | T0-T1 | T1 | T2-T3 | 25/35/40 | 56 | A 1, C 1 |
| **Karate / Taekwondo** | INF | **T2** (60-90) | 200-260 | T3 (180-220) | T2 | T2 | T1 | 20/35/45 | 63 | A 2, B 1, C 0.5 |
| Wrestling | INF | T2 (80-100) | 40-60 | T3 | T2 | T1 | T2 | 15/55/30 | 39 | A 1, B 1.5, C 1, LC 1 |
| BJJ / grappling | INF | T1 (30-40) | 0-40 | T2 | T0 | T0 | T1 | 30/50/20 | 41 | A 0.5, B 1.5, C 1, LC 0.5 |
| Baseball (position) | OBS + INF | T3 (100-150) | 65-100 | T3 (170-200) | T1 | T2 | T1 (T3 with OLY) | 45/35/20 | 44 | A 3.5 (buy-outs) |
| Softball | INF | T3 | 70-100 | T3 | T1 | T2 | T1 | 45/35/20 | 46 | A 3, C 0.5 |
| Ice hockey | INF | T3 | 60-100 | T2 | T1 | T3 | T2 | 25/45/30 | 50 | A 1, B 1, C 0.5, LC 1 |
| Tennis / racket | INF | T3 | 160-200 | T2 | T3 | T2 | T1 | 25/40/35 | 55 | A 2, B 1, C 0.5 |
| Golf | INF | T1 | 30-50 | T2 | T0 | T0 | T1 | 25/40/35 | 50 | B 0.5, C 2 |
| Track sprinter | INF | T3-T4 | 160-220 | T1-T2 | T0 | **T5** | T2 | 15/45/40 | 50 | A 1, C 0.5 |
| Distance runner | INF | T1 | 150-200 | T0 | T0 | T2 | T0 | 10/55/35 | 50 | A 0.5, B 0.5, C 2 |
| CrossFit competitor | OBS + INF | T1 (in WODs) | 200-500 | T2 | T0 | T1-T2 | T4 power months | 20/45/35 | 50 | by level (C → +B → +A → LC) |
| Hybrid | OBS + INF | T1 | 0 | T0 | T0 | A conditioning | T1-T2 | 30/50/20 | 63 | A 1, C 1 |
| Powerlifting / strength | OBS | T1 (18) | 0 | T0 | T0 | T0 | T0 | 20/60/20 | 32 | none |
| Bodybuilding / aesthetics | OBS + INF | T0 | 0 | T0 | T0 | T0-T1 | T0 | 80/15/5 | 50 | C 2 |
| Fat loss | OBS | T0 | 0-100 | T0 | T0 | T0 | T0 | 85/10/5 | 49 | C 2 + 2 circuits |
| General population | INF | T0 | 0-40 | T1 | T0-T1 | T1 | T0-T1 | 60/25/15 | 50 | B 1, C 2 |
| Youth athlete | INF | T2 (50-80) | 60-100 | T2 | T2 | T2 | T1 | 40/40/20 | 50 | A 1, C 1 |
| Generic athlete (BYOP ATHLETIC) | OBS + INF | T2 (72-96) | 0-40 | T2 (64-96) | T2 (48-64) | T0-T1 | T2 | 40/40/20 | 50 | client pick |

H/S/P = hypertrophy / strength / power share of resistance emphasis [INF]. The plyo ordering basketball > MMA > boxing/karate reproduces his statement **with the boxer as the T3 anchor**, which holds only under the analyst's squirrel-jump convention. Resistance axis [INF]: linemen, wrestling/BJJ (pull : push 2.0-2.4 : 1, neck + grip), powerlifting at the "more resistance" end; basketball, volleyball, football skill, soccer, sprinters and karate (athletic 46-52 % of weekly sets) at the "more power" end; baseball, softball, golf, tennis are rotational-power profiles (throws T2-T3, transverse core 45-55 %).

### 9.5 Seasons and levels for athletes

**Season multipliers** (field/court family; `04_profiles.json > season_families`) [OBS BASEBALL deltas where marked; INF otherwise]:

| Phase | Plyo | Low-amp | Throws | COD | Sprint | TE/Olympic | Resistance | Core | Rules |
|---|---|---|---|---|---|---|---|---|---|
| off-season early (2-4 wk) | 0.5 | 0.8 | 0.8 | 0.5 | 0.5 | 0.5 | 1.0 | 1.0 | landings and 'DELIVER FORCES FAST' only; 'EASY TURN'; VOL 1 |
| off-season build (4-8 wk) | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | VOL 1 → VOL 2 ('12/10/8/8'); new weekly menu; OLY introduced late at 75 → 80 % [OBS B1] |
| pre-season (ends 1 wk before games) | **1.45** [OBS 151/103] | 0.9 | 1.1 | 1.2 | 3.0 (cap +50 % metres) | %-based 75 → 90 % | 1.08, +3-4 %/wk last 3 weeks | 1.35 | VOL 3 ('8/6/4/4'); contrast/complexes; Part C/D 4 → 5 sets; final DELOAD (−31 % resistance, −46 % all) [OBS B2] |
| in-season | 1.3 baseball-type [OBS]; **0.3-0.5 for jump/run sports whose games supply contacts** [INF] | 0.7 | 1.0 | 0.5 | 1.8 baseball; 0.6-0.8 field (never 0) | **0** (no OLY) | 1.0 at 4 days [OBS]; 0.6-0.8 at 2-3 days | 1.4 | flat 4 × 10, no compound below 8 reps, two alternating proven menus [OBS B3] |
| post-season (1-2 wk) | 0 | 0 | 0 | 0 | 0 | 0 | 0.3 | 0.6 | arm care + mobility + easy C (content OBS from BASEBALL B1 'wk 8') |

Combat family: base (2 wk; zero plyos, one 19-throw medball list, 3 × 10 hypertrophy on all 8 patterns, 1 A + 1 C) [OBS boxer] → conversion (6 wk; new exercise list, contrast complexes, 2-week steps, week-7 accessory mini-deload while the hinge complex, clean & press and row superset rise 3 → 4 → 6 sets, week-8 peak; horizontal push, vertical pull and arm isolation removed) [OBS boxer; removal as a rule for all strikers INF] → fight camp (INF: lifting 2-3 days, 2 sets per slot, one heavy + one fast exposure per pattern, round-simulation conditioning, 7-10 day taper, no new exercises in the last 3 weeks) → post-fight (all × 0.3) [INF].

**Level ladders** [OBS]: athletes STARTING → MID → ADVANCED: working sets −19 % then −18 %; high-amplitude contacts −51 % then −55 %; low-amplitude 0 → 120 → 100; throws +90 % then +5 %; main-lift reps 6-8 → 1; sets per line mostly 3 → 2 → 1-3. Gym clients NOVICE → NEWBY → INTERMEDIATE: weekly sets +18-23 % then +13-14 %; compound reps lift by lift (§5.5); arm and leg isolation fixed at 20 / 'MAX REPS'. Exercise level is chosen per slot in both.

### 9.6 Injury hotspots → selection rules (`04_profiles.json > injury_library`, 23 codes)

| Code | Sports | Rule (OBS where cited, else INF/SCI) |
|---|---|---|
| PAIN_GENERAL | all | his pain rule: split grips, unilateral, then cut sets, then drop a level |
| SHOULDER_THROWER | baseball, softball, volleyball, tennis, QB | pressing DB / alternating / landmine / seesaw [OBS: no barbell bench in BASEBALL; barbell overhead pressing only 3 times in the year]; rear-delt/cuff work 2x/week; recovery-week arm care ('Kettlebell arm bars', 'Half kneeling shoulder roll') |
| SHOULDER_STRIKER | boxing, kickboxing, MMA, karate | drop HPUSH and VPULL after the base; keep rows, side and rear delts [OBS boxer] |
| GROIN_ADDUCTOR | soccer, hockey, kickboxing, karate, MMA, football, tennis | Copenhagen planks [OBS in MM athletic, boxing, BASEBALL] 3x/week pre-season, 1-2x in-season [SCI −41 % groin problems] |
| HAMSTRING | sprinters, field sports, base-runners | Nordic or slider curls 1-2x/week year-round [SCI up to −51 %]; keep one max-velocity sprint exposure per week in every phase |
| ACL_LANDING_CUTTING | basketball, soccer, volleyball, female athletes, youth | landings first ('STICK THE LANDING BILATERAL' → 'UNILATERAL' → weighted [OBS BA]); 'HARD TURN' only after landing competency; female athletes double the landing block [INF] |
| PATELLAR_TENDON | volleyball, basketball, jumpers | cap rebounding contacts; never stack max approach jumps + depth jumps the same day; count game jumps first in season |
| LOW_BACK_ROTATIONAL | golf, tennis, baseball, hockey, throwers | anti-rotation static (Pallof holds) before rotational dynamic; rotation from the hips (half-kneeling 'INTO THE LEFT LEG/HIP' matrix) |
| NECK | wrestling, BJJ, MMA, football, rugby, hockey | create a NECK column (none exists); isometric → eccentric |
| GROWTH_APOPHYSIS / BONE_STRESS / FALLS_BONE_DENSITY | youth circa-PHV / runners / older adults | fewer depth drops and FOUNDATIONAL only during the growth spurt [INF caps]; low-amplitude until tolerance; power at 40-60 % 1RM + balance and step-ups [SCI NSCA] |

---

## 10. Session & week templates

Full version: `05_session_architecture.md` / `05_templates.json` (27 observed templates as slot sequences, 30 generator split templates, time model, frequency checks) and `analysis/equipment/ordering_audit.md`.

### 10.1 The master session order (tiers) [OBS; strict in BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' on all 4 days]

| Tier | Block | Buckets | Evidence |
|---|---|---|---|
| 0 | PREP | general warm-up, pattern prep, skill | 'Any Cardio Equipment' 1 × '5 Minutes' opens every UL/PPL session; A-drills ('A March' → 'A Skip' → 'A Run') before squatting; 'KB Book openers ' before pressing; CrossFit 'WARMUP/SKILL' first |
| 1 | REACTIVE / ELASTIC | plyo, limited-knee jumps, sprint | BYOP 'Plyo' rows 1-2; BASEBALL Part A; landing before rebound (11/13) |
| 2 | BALLISTIC UPPER / TRUNK | medball throws | BYOP 'Throwing' after 'Plyo' |
| 3 | CHANGE OF DIRECTION | COD | BYOP 'COD' after 'Throwing' (the only place COD is programmed) |
| 3b | CORE PRIMER (athletic families) | core by plane | BASEBALL Part B always above the 'OPTIONAL PIECE' 'OLY' row; MM primers ('Hollow rocks', 'Med Ball Rockers', cross connects) before cleans/snatches |
| 4 | POWER-STRENGTH | 'Tripple Extension' / Olympic / loaded jumps | last athletic slot in BYOP (12/12); BASEBALL OLY between Part B and Part C |
| 5 | MAIN | bilateral lower + first upper compound (horizontal in BYOP) | BYOP resistance slots 1-2 (29 vs 2); BASEBALL Part C superset |
| 6 | SECONDARY | unilateral lower + vertical upper (BYOP) / + two isolations (BASEBALL Part D) | 24 vs 2 in BYOP |
| 7 | ISOLATION | arm matching the day, LEG FLEXION after hinges, leg extension before curl, Focus | last slots; MYO only on the last |
| 8 | CORE FINISHER (aesthetics) | core | '50 situps + 50 crunches + 50 reverse crunches'; BYOP core lives on optional days |
| 9 | CONDITIONING | buy-out, circuit, WOD | BASEBALL Part E 'Buy out' last 65/65; class 'WOD' last |

The coach's sentence it implements [CHAT]: "power first (athletics), then the power-strength training, then strength training, then the resistance movements". **Named exceptions** the generator must allow [OBS]: small muscle first as a priority ('Calves' first on AESTHETICS A days; side raises or 'Arnold press' first on AESTHETICS-12 push days); core early in athletic programs; conditioning first (boxing 4/4 day types; HYBRID Tue/Fri) when it is the day's sprint stimulus or an easy C warm-up; contrast stations (jump right after the heavy lift); interleaved delt isolation in MM PPL; cardio mid-session in BOOTCAMP 2; HYBRID lists strength above the Olympic lift (open, ORD-03); FAT BURN / 4T / boxing write the pulldown before the row (parent-template rule, open).

### 10.2 Pairing rules and the eight day grammars [OBS]

* **Horizontal pull rides with knee-dominant work, horizontal push with hip-dominant work**: 20 of 23 classifiable template-days (exceptions HYBRID Thursday, HYBRID Saturday, STRENGTH-8); audit R9 160/193 sessions. INFERRED rationale: hinges and rows both load grip, lats and erectors, so they go on different days.
* **The vertical vector is free**: V_SAME (knee day gets both pulls, hip day both pushes: BYOP), V_CROSS (knee day H pull + V push: BOOTCAMP 1, MM athletic MID/ADV), V_ROTATE (one vector per day: BASEBALL Mon H pull, Tue H push, Thu V pull, Fri V push).
* **Lower pairing: same or opposite dominance** (§6): BOOTCAMP 1 re-pairs exactly the same 14 slots as AESTHETICS ('Unilateral KD' ↔ 'Unilateral HD', 'Vertical Pull' ↔ 'Vertical Push' swapped between days) so every session is a complete full body: direct evidence that he re-pairs slots for context.

| Grammar | Day types | Observed in | Generator use [INF] |
|---|---|---|---|
| G1 FOCUS_AB | A = BKD + HPULL + UKD + VPULL (+ quad iso, biceps); B = BHD + HPUSH + UHD + VPUSH (+ leg flexion, triceps, delts) | BYOP AESTHETICS, 3 DAY BUILDER D1-D2, BYOP ATHLETIC, NO ACCESS | hypertrophy 4-6 days |
| G2 CROSSED_COMPLETE | A = BKD + HPULL + UHD + VPUSH; B = BHD + VPULL + UKD + HPUSH | BOOTCAMP 1 (BOOTCAMP 2 over 3 sessions) | bootcamp, fat loss, any 2-3-day plan |
| G3 BASEBALL_PARTS | Mon BKD + HPULL / UHD + biceps + calves; Tue BHD + HPUSH / UKD + triceps + shoulders; Thu as Mon with VPULL; Fri as Tue with VPUSH; Part A ballistics, Part B core by plane, optional OLY, Part E buy-out | BASEBALL (96 sessions) | in-sport athletes |
| G4 UPPER_LOWER | lower = all four lower patterns + 3 isolations; upper = H push + V pull + H pull + V press (or upright rows / side raises) + arms/delts | MM UL, AESTHETICS-8, FAT BURN | UL requested |
| G5 PPL | push / pull / legs (legs = all four lower patterns) | BYOP PPL, MM PPL, AESTHETICS-12 | 5-6 days, advanced physique |
| G6 CONJUGATE_4SLOT | ME lower / ME upper / DE lower / DE upper, each 'the work' → 'the accessory' → 'the nuance' → 'the survival' | STRENGTH-8/-12, CONJUGATE | strength |
| G7 QUALITY_DAY | CrossFit knee + snatch / pull + clean / hip + snatch / push + clean | CrossFit grids | CrossFit |
| G8 ATHLETIC_THEMED | jump day = hip + H push + V pull; medball day = knee + H pull + V push (STARTING reverses the themes) | MM athletic levels | off-season athlete variant |

### 10.3 The week [OBS]

* **Rhythm: A, B, OPT, A, B, OPT, OFF** (Mon-Sun) for 4-6 days: two full-body day types 72 h apart, optional blocks on Wednesday and Saturday, Sunday off. The same day type repeats exactly in BYOP (Day 3 = Day 1). Strength: Mon ME lower / Wed ME upper / Thu DE lower / Sat DE upper. PPL: push / pull / legs twice. Consecutive days alternate lower dominance (HYBRID Thu/Fri is the exception).
* **Optional block** (fill FCE5CD): 'Calves', 'Cardio'/'Aerobic Capacity', 'Core', 'Focus 1', 'Focus 2'. A 4-day plan becomes 5 or 6 days by adding these blocks, **not** more heavy sessions ('ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK'). In-sport athletes stay at 4 days (BASEBALL, boxing leave Wed and the weekend for the sport).
* **Frequency invariant**: with ≥ 4 resistance days every lower pattern ≥ 2x/week, push ≥ 2x, pull ≥ 2x, each upper vector ≥ 1x. The 3 DAY BUILDER keeps BKD, BHD, HPULL, HPUSH, UKD at 2x and lets VPULL, VPUSH, UHD (+ leg curls, calves) fall to 1x. Broken by design: CrossFit competitor (1x each, WODs carry the rest), STRENGTH-12 (no vertical press), boxing weeks 3-8 (removal), FAT BURN / AESTHETICS-8 weeks without an overhead press.
* **Second weekly exposure** [OBS examples; rule INF]: twins of the same category ('Front Squats' Monday JL E8 → 'Low Bar Back Squat' Thursday JL E35; 'Medium Depth Drop' Monday → 'SL Depth Drops' Tuesday); BASEBALL gives each lower pattern one speed day and one strength day; FAT BURN swaps leg press ↔ deadlift between Monday and Thursday.
* **Conditioning days**: steady C on Wed/Sat ('max 40 min'); athletic sprint work first on a speed day or last as a 1-3 bout 'Buy out' (none in deloads).
* **Core placement by family**: BYOP aesthetics/athletic on optional days; BASEBALL Part B after the ballistics with planes rotating ('LATERAL CORE' Mon, 'Transverse core' Tue/Fri, 'Sagital core' Thu); MM athletic as primer and finisher; HYBRID inside tri-sets; FAT BURN in circuits; strength tracks none.

### 10.4 Supersets, contrast and complexes [OBS]

'SUPERSET W/ 👇' exists in the SETS menu but is never used. Written forms: BASEBALL Part C 'Superset - same reps' (bilateral lower + upper compound), Part D tri-set (unilateral + 2 isolations); HYBRID tri-sets with core ('FE contra/ DB rows/core'); contrast pairs ('SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs'); French contrast ('78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps', filed 'OFF SEASON'; boxing '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps', '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs'); '5 of each' complexes; 'DEADLIFTS (1-2RIR) + 3 min Jump Rope'; mechanical-drop supersets in AESTHETICS-12 weeks 9-12 ('front squats + Superset with 15 squats with no weight every set'); FAT BURN 4-station timed circuits (cardio station first, regions alternate); AMRAP; Tabata. Generator [INF]: pair under 60 min or when the family default is paired; never pair two lower compounds or a heavy lift with a fatiguing lift for the same muscle (contrast stations excepted); keep his immediate-transition contrast format as written (science gap sent as a question, not silently changed).

### 10.5 Session length [no tab states a duration; model INF]

Time model calibrated on his own filled days puts his product days at 50-65 min (AESTHETICS Day 1 51 min, JL Monday 61, STRENGTH-8 Monday 58, BASEBALL Monday 61 / 73 with OLY), so **60 min = the reference**.

| Minutes | Aesthetics | Athletic | Strength | Fat loss / bootcamp | Hybrid |
|---|---|---|---|---|---|
| 30 | 4 as 2 supersets (BKD/HPULL, UKD/VPULL), ~12 sets | 5-6: 1 plyo + triple ext. + 2 supersets at 2 sets | 'the work' + 'the accessory' | 5 incl. cardio (BOOTCAMP 2 size) | Oly or strength + 10-12 min AMRAP |
| 45 | 5-6 straight or 7 supersetted, ~15-16 sets | 7-8: drop the 2nd plyo / ABdution and COD | + 'the nuance' | 5 lifts + short circuit | strength + Oly + tri-set |
| **60** | **7, ~19-21 sets (OBS)** | **10 at 2 sets, ~20 (OBS)** | **4 (OBS)** | **7 or 5 + circuit (OBS)** | **4-6 stations (OBS)** |
| 75 | 8-9: + Focus + core | 10 + core block + buy-out | + plyo primer or 2nd survival | 7 + circuit | + A/C piece |
| 90 | 9-10: + 2 Focus + core or + 20-min C; cap ~26-30 sets | 10 + core + buy-out + optional OLY | + 15-20 min C | 7 + circuit + 20-30 min C | skill + power + strength + resistance + WOD |

**Cut first** (partly OBS from the 4 → 3-day and BOOTCAMP 1 → 2 cuts): aesthetics arm and side-delt isolation → leg extension → vertical vector and single-leg hinge to 1x/week; keep 'Leg Curls' (no hinge flexes the knee) and calves; never cut bilateral lower + horizontal upper + lunge. Athletic: the 10th slot → COD (absent in every MM example) → isolation → 2nd upper vector; keep 1 plyo + triple extension + bilateral lower + horizontal upper + unilateral. Strength: 'the survival' → 'the nuance'. **Add first** when long: Focus → core → isolation for the muscle furthest below target → C cardio (aesthetics); core primer → buy-out → optional OLY → isolation pair (athletic). Caps: ≤ 10 exercises (11 with a buy-out); ~20 straight sets or ~28-30 paired sets.

### 10.6 Generator split templates (60-min reference; `05_templates.json > generator_split_templates[family][days]`)

| Family | 2 days | 3 days | 4 days | 5 / 6 days |
|---|---|---|---|---|
| Aesthetics | FB_A [BKD/HPULL] [UHD/VPUSH] [BHD light/biceps] + iso; FB_B mirror (G2, INF) | 3 DAY BUILDER D1 calves, [BKD/HPULL], [UKD/VPULL], biceps, quad iso; D2 [BHD/HPUSH], [UHD/VPUSH], leg flexion, triceps, delts; D3 [BKD/HPULL], [BHD/HPUSH], UKD (OBS content; weekdays INF) | **BYOP AESTHETICS A, B, OPT, A, B, OPT, OFF (OBS)**; alt UL | + 1 or 2 optional blocks (OBS framing); alt PPL × 2 at ~2 sets/slot |
| Athletic | ATH_1 plyo → throw → core primer → triple ext. → [BKD/HPULL] → [UHD/VPUSH] → buy-out; ATH_2 mirror with ankle/reactive plyo + COD (INF) | MM STARTING S1 jump + knee / S2 medball + hip / S3 strength + Oly (OBS structure) | **BYOP ATHLETIC (OBS)**: A = Plyo, Plyo, Throwing, COD, Tripple Extension, BKD, HPULL, UKD, VPULL, Leg Extensions ('MYO SET'); B = Plyo, Throwing, COD, Tripple Extension, BHD, HPUSH, UHD, VPUSH, Leg Curls; alt BASEBALL Parts | + optional blocks; in-sport athletes stay at 4 |
| Strength | ME_FULL / DE_FULL with A/B lead lift (INF) | Squat / Press / Deadlift days (CrossFit class trio, OBS skeleton) | **ME lower Mon, ME upper Wed, DE lower Thu, DE upper Sat (OBS)** | + optional blocks, never a 3rd heavy lower day |
| Fat loss / bootcamp | BOOTCAMP 1 A + B, C cardio on own days | BOOTCAMP 2 1A / 2A / 3A | **BOOTCAMP 1 (OBS)** or FAT BURN (lower A/B, upper 1/2, Wed/Sat 30-40 min C, circuits) | BOOTCAMP 2 six sessions 1A..3B (OBS) |
| Hybrid / CrossFit | HY_1 / HY_2 (INF) | class Squat / Press / Deadlift (OBS) | CrossFit competitor days (OBS) | HYBRID 5 days (OBS); class 6 days |
| No equipment | not a goal: keep the goal's skeleton and filter slots by kit; layouts in 05 §8.6 only as fallback | | | |

Automatic frequency check passes for every aesthetics, BYOP athletic, fat-loss and 2-3-day strength/hybrid split; remaining flags reproduce his own designs (STRENGTH-12 has no vertical press: add one for non-powerlifters [INF]; STARTING has no horizontal press except plyo push-ups; HYBRID deadlifts once a week).

---

## 11. Periodization: 6-, 8- and 12-week skeletons

Full version: `06_periodization.md` / `06_periodization.json` (15 levers, 25 skeletons with 205 week rows, D1-D11 rules, quality ladders, autoregulation). Corrections applied here: the "MEDIUM 5 %" tier is retired (CAT-02); weekly A/B variants are an option, not the default (chat); the release rule is 11's bank-and-chunk.

### 11.1 How he plans [OBS]

* **Qualities × levels × time, not exercises.** 'EXAMPLE CROSSFIT SPLIT' A10:M17 is a 7-quality × 12-month grid of levels 1-4, with dose tables: 'FULL TIME' adds sets (strength 3 × 7 → 4 × 6 → 5 × 5 → 6 × 4) and 'HALF TIME' keeps 3 sets and cuts reps (3 × 7 → 3 × 4 → 'Work up to 1RM'). Generator data model: `plan[quality][period] = level; dose = table[population][quality][level]`.
* **Blocks that end in a peak run base/hypertrophy → strength → power → test**: CrossFit 'RESISTANCE' → 'STRENGTH' → 'POWER' → 'TEST/PEAK'; boxer 3 × 10 base → athletic conversion; BASEBALL off-season build → pre-season potentiation → in-season maintenance (season labels INF from dates).
* **Volume moves in whole-set steps inside rep waves** (12 → 10 → 8 in 3-week waves; HYBRID ascends 6 → 8 → 10); big muscles progress by load and sets, small muscles by reps and effort (FAT BURN; BASEBALL VOL legend).
* **Gym clients and athletes progress in opposite directions** (§5.3).
* **Athletic work stays in every training phase**; what changes is the zone, the amplitude and whether a resistance slot becomes its speed version.
* **Intensifiers come late**: MYO, max-rep finishers and complexes in the last phase of hypertrophy plans (AESTHETICS-12 weeks 9-12) and in conversion / pre-season phases of athletic plans; never in deloads or the boxer's base weeks. Exceptions: 'MYO SET' preset on leg extensions in BYOP ATHLETIC week 1; BASEBALL upper-body supersets and banded lifts in all three blocks.

### 11.2 Plan-length shapes

| Length | Shape | Status |
|---|---|---|
| **8 weeks** | weeks 1-7 load in 2-3-week steps; week 8 = 'DELOAD WEEK' (AESTHETICS-8) or 'TEST' (ME days) + 'DELOAD' (DE days) (STRENGTH-8). Exceptions he wrote: boxing build-up ends week 8 at its peak (CC0000), HYBRID-8 has no deload, CrossFit class week 8 = 1RM test only. | OBS |
| **12 weeks** | weeks 1-6 load (wave 1); week 7 'MID DELOAD' (STRENGTH-12 U3) / 'A WEEK LOWER' (AESTHETICS-12 U33); weeks 8-12 wave 2 restarting at the wave-1 middle dose (AESTHETICS-12: new menu + intensifiers; STRENGTH-12: same A/B menu); week 12 = peak (7 × 2 @ RPE 10; 5 sets + '3 sets LEG PRESS MYO'). | OBS |
| **6 weeks** | no example. Default = weeks 1-6 of the 12-week shape, ending at the wave-1 peak (STRENGTH-12 WK6 highlighted FFF2CC); the **next** plan opens with a deload. Standalone variant: 5 loading + deload/test. | INF (PER-01, N-PER-01) |
| Athlete 8-week build | 2-week base + 6-week conversion in 2-week steps, week 7 mini-deload, week 8 peak | OBS boxer |
| Athlete season | 8-week grids per block; pre-season ends with a deload week; in-season flat with no planned deload | OBS BASEBALL |

### 11.3 Volume index by week (week 1 = 100; `06_periodization.json > skeletons`)

| Skeleton | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | W10 | W11 | W12 | Deload / test |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HYPERTROPHY_12 | 100 | 100 | 100 | 133 | 133 | 133 | 100 | 133 | 133 | 133 | 133 | 167 | W7 deload |
| HYPERTROPHY_8 | 100 | 133 | 133 | 133 | 167 | 167 | 167 | 60* | | | | | W8 deload |
| HYPERTROPHY_6 | 100 | 100 | 100 | 133 | 133 | 133 | | | | | | | ends at peak |
| STRENGTH_12 | 100 | 100 | 125 | 125 | 150 | 150 | 75 | 125 | 150 | 150 | 175 | 175 | W7 deload |
| STRENGTH_8 | 100 | 100 | 96 | 96 | 93 | 93 | 89 | 18 | | | | | W8 test |
| FAT_LOSS_8 | 100 | 100 | 107 | 117 | 107 | 117 | 125 | 60* | | | | | W8 deload |
| HYBRID_8 | 100 | 100 | 100 | 150 | 150 | 150 | 200 | 200 | | | | | none (ends at peak) |
| GENERAL_BEGINNER_8 | 100 | 100 | 100 | 118 | 118 | 118 | 118 | 65* | | | | | W8 deload |
| ATHLETE_OFF_8 (resistance / total sets) | 100/100 | 100/100 | 86/141 | 86/141 | 86/146 | 86/146 | 76/130 | 103/170 | | | | | phase change at W3, W7 mini-deload, W8 peak (boxer shape) |
| ATHLETE_PRE_8 (resistance / total) | 100/100 | 97/97 | 99/98 | 100/98 | 103/111 | 107/118 | 111/124 | 76/67 | | | | | W8 deload |
| ATHLETE_IN_SEASON (resistance) | 100 | 106 | 106 | 100 | 94 | 100 | 89 | 106 | | | | | none; repeat A/B menu pairs |

\* 06 set these deload rows at ~60 % of week 1. **This document's deload rule supersedes them**: `round(min(0.85 × W1, 0.75 × peak))`, i.e. about 85 % of week 1 (§7.3), which matches every deload he wrote (none below 60 % of week 1). The full table (25 skeletons incl. 6- and 12-week versions of every family, plus TRANSITION) is in 06 §8.7.

### 11.4 Levers and which one leads [OBS levers; matrix INF]

L01 sets · L02 reps (waves) · L03 load % (only STRENGTH-12, the Olympic piece, contrast, dynamic effort) · L04 effort (RIR/RPE/'MAX'/'ALL'/'EASY') · L05 exercise level · L06 variation (one Davidson variable) · L07 density · L08 methods (MYO, supersets, contrast, bands/chains) · L09 frequency · L10 quality sequence · L11 athletic dose · L12 plyo zone · L13 aerobic zone · L14 slot quality (speed vs strength version) · L15 session budget.

| Goal / phase | Primary levers | Held |
|---|---|---|
| Hypertrophy | sets + reps; methods only in the last phase; variation between blocks (A/B optional) | session budget |
| Strength | reps + load % + effort (RPE 7 → 9 → 10); conjugate variant rotation | sets rise or fall to keep 14-25 main-lift reps per session |
| Fat loss | density (circuits 3 × 30 s → 5 × 50 s, ×2.78 work) + sets on compounds + reps on isolation | - |
| Hybrid | frequency (WODs 1 → 4, aerobic 2 → 4) + density + reps | - |
| Athlete off-season | quality sequence (base → conversion), athletic dose (+1 set / round per 2 weeks), plyo zone Z1 → Z2 | resistance sets ~flat |
| Athlete pre-season | reps (VOL 3), load % (OLY 75 → 90 %), athletic dose peak, slot quality, complexes | sets rise only in the last 2-3 weeks |
| Athlete in-season | slot quality (speed/strength alternation), two familiar menus | sets frozen at 4 on Parts C/D, reps 8-10, no OLY |
| Deload / taper | cut sets and athletic dose (−50-65 % contacts) | exercises, frequency |

### 11.5 Deload, test, taper (resolved defaults)

| Rule | Default | Tag |
|---|---|---|
| Placement | 8 weeks → week 8 (deload; strength = test on ME days + deload on DE days); 12 weeks → week 7 + test/deload as week 1 of the next plan; 6 weeks → ends at the peak, next plan opens with a deload | OBS shapes (6 INF) |
| Dose | same template, same exercises, ~week-1 volume `round(min(0.85 × W1, 0.75 × peak))`, main lifts ~3 × 8 @ RPE ~7, no intensifiers/buy-outs/Olympic, athletic Part A 1-2 sets, contacts −50-70 %, conditioning C only | OBS shapes; unified rule INF |
| Recovery week (throwers, end of an off-season block) | arm care + mobility + easy cardio ('Kettlebell arm bars' 3 × '10/10', 'Half kneeling shoulder roll' 3 × '8/8', 'Paced Cardio - easy' 4 × '10 min'), no main lifts | OBS BASEBALL B1 'wk 8' |
| Fighter build-up | week 7 unloads accessories (11 rows 3 → 2 sets) while 3 key rows ramp 3 → 4, week 8 peaks (6 sets) | OBS boxer |
| No written deload | FAT BURN (4 weeks), HYBRID-8, CrossFit macro (test months instead), athletic level templates, in-season | OBS; generator inserts deloads only by plan-length rule or autoregulation |
| After a peak with nothing written (boxer week 8, AESTHETICS-12 week 12) | always append a deload or taper week if the plan continues | INF (SCI T12) |
| Taper before a season / fight | 1-2 weeks, volume −40-60 %, intensity and frequency kept, no new exercises | INF + SCI; OBS shape (BASEBALL pre-season deload before Block 3) |
| Tests | strength 'Work up to 1RM' (HALF TIME LVL 5) or ME 'TEST'; aerobic 'DISTANCE TEST' / 'SPEED TEST' items and a 1-mile max effort (Hinshaw plan); athletic 5-10-5 / CMJ / broad jump / 10 m [INF usage] | OBS items |
| Early deload | 2 weeks of EFFORT 9-10 on ≥ 30 % of logged sets, or 'Felt a PAIN' on ≥ 2 slots, or performance falling on ≥ 3 main lifts | INF |

### 11.6 Intensity across a plan [OBS where cited]

* Strength main lift: % 80, 80, 85, 85, 90, 90 (weeks 1-6, 4T O3:T3); RPE 7, 7, 7, 8, 8, 9, 7, 8, 9, 9, 9, 10; sets 4, 4, 5, 5, 6, 6, 3, 5, 6, 6, 7, 7; reps 5, 5, 4, 4, 3, 3, 4, 4, 3, 3, 2, 2 (STRENGTH-12). Weeks 8-12 % are not written; infer from the RPE chart (5 @ RPE 7 ≈ 78.6 %, his 80 %).
* Hypertrophy compounds: 1-2 RIR ('1-2 RIR' AESTHETICS-8); 06 proposes 2 RIR in the first week of each wave then 1 RIR [INF; VOL-13 pending: the sheets show a static target].
* Olympic piece: 'Hang cleans @ 75%' 4 × 8 → '@ 80%' 4 × 6 → '@ 85%' 4 × 6 → '@ 90%' 4 × 4 (% of which max is open).
* Athletic work: max intent with full quality; landings 'Drop & Stick - Hold for 3 seconds'; plyos on a conjugate strength day 'EASY'.

### 11.7 Athletic-quality ladders [OBS lists; progression INF]

1. **Plyos**: force phases 'TAKING IN FORCES' (stick) → 'DELIVER FORCES FAST' (jump onto) → 'AMORTIZATION OF FORCES' → 'REBOUNDING ' (repeat), paralleled by plyo zones Z1 → Z2 → Z3 (he never links the two lists); within a phase bilateral → unilateral, unloaded → weighted, no drop → drop, hop → jump, reverse-banded last; 2-week hold per rung (HYBRID: 'Depth drops' → 'Weighted depth drops' → 'depth drop to jump' → 'weighted depth drops to jump' → 'box jumps' × 2 → 'repeat hurdle hops' × 2); STRENGTH-8 cycles 'WEIGHTED DEPTH DROP' → 'DEPTH DROP & JUMP' → 'HIGH SQUAT JUMPS' → 'REPEAT HIGH JUMPS' every 4 weeks. Default [INF]: weeks 1-2 Z1 landings, 3-4 Z2 single responses, 5+ Z3 rebounds for sports that need them; low-amplitude reactive work (squirrel, ankle, rope) for combat sports; contacts +10-15 % per 2-week step.
2. **Throws** have no level ('AP - THROWING'); levers are list sessions per week and sets (boxer 190 → 380; MM 210 → 400 → 420); throws stay in season.
3. **Olympic lifts**: skill ladder high → mid → low hang → floor, power catch before squat catch; % ramp 75 → 90; BASEBALL keeps them under 'OPTIONAL PIECE' from Block 1 week 6 through Block 2, never in-season, never in the deload.
4. **Sprint / conditioning**: density first (10-15 × 15 s at 1:2 → 20 s → 30 s at 1:4; boxer 20/40 rounds 5 → 8), then zone; 'SPEED STRENGTH & POWER' work pre-season, 'SPEED POWER' buy-outs all year.
5. **COD**: 'EASY TURN' → 'MOD. TURN' → 'HARD TURN' across blocks; reactive agility ('Agility: Reactive in nature - Incognitive Competence') after pre-planned COD ('COD: Proactive in nature - Cognitive Competence') [timing INF].
6. **Core**: segment thorax → pelvis → both, plane sagittal → frontal → transverse, static → dynamic, one step per block; inside a week rotate planes by day like BASEBALL.
7. **Aerobic**: unlock C → C + B → C + B + A → lactate clearance by level; volume/density first, then pace.

### 11.8 Autoregulation from the logbook [OBS dropdown values; actions INF]

| Logged | Next week |
|---|---|
| EFFORT 1-5 ('Way Too Easy' … 'Easyish') | load or reps up first (double progression), then the scheduled set release |
| EFFORT 6-8 ('Broke a Sweat' … '8 - That was perfect') | on target: follow the plan, release sets as scheduled |
| EFFORT 9 'That was terrible' | hold sets (AMBER), load −~5 % if repeated |
| EFFORT 10 "I'm done" | −1 set on that slot; counts toward the early-deload trigger |
| 'Felt the RIGHT muscles' | keep the exercise; eligible for a level step at the next block |
| 'Felt the WRONG muscle' | change one variable (stance, zone, grip) in the same column |
| 'Felt a PAIN' | pain rule (split grip → unilateral → +constraint → zone down), −1 set, rate 0 until 2 pain-free exposures |
| "Couldn't do it" | one level down in the same column or an assisted version; dose unchanged |

---

## 12. Science lineage (short)

Full version: `07_science_lineage.md` (138 concepts mapped with verdicts, 32 first-principles rules, sources with URLs) and `10b_equipment_variables_science.md` (evidence for every equipment and variable rule). Note: 07 rules 20 (medium tier), 22 (deload −40-50 %) and 27 (weekly A/B default) predate the coach's answers and are superseded here.

| Layer | Source | How it shows in his sheets | Verdict |
|---|---|---|---|
| Library architecture (families, patterns) | **Dr. Pat Davidson, *Rethinking the Big Patterns* (RTBP)**: 13 motor patterns in Control / Athletic / Resistance families; stance × plane × load × velocity; Jacksonian dissolution (sagittal → frontal → transverse) | LIB row 4 'CONTROL' / 'ATHLETIC' / 'RESISTANCE'; MM tab names 'CONTROL PATTERNS/CORE', 'ATHLETIC PATTERNS EXERCISE LIBRARY', 'RESISTANCE PATTERNS EXERCISES LIBRARY'; 11 of 13 RTBP patterns map one-to-one onto BYOP columns (breathing is the one left out) | FAITHFUL (strongest lineage) |
| Levels by load position | **Davidson, *A Coach's Guide to Optimizing Movement*** (named by the coach, CAT-04): zones 1-3 | squat ladder, arm 'Zone 1/2/3', machine on-ramps | ADAPTED (his wording of the zones; book not read by the team) |
| Into / out of the hip, half-kneeling matrix | PRI / Bill Hartman / Davidson | 'GET INTO THE HIP' (contralateral) / 'GET OUT OF THE HIP' (ipsilateral); medball 'INTO THE LEFT LEG/HIP' | ADAPTED (MODERATE/HARDER grading is his own) |
| Dose layer | **Dr. Mike Israetel / Renaissance Periodization**: MEV/MAV/MRV landmarks, 5-30 reps, RIR, stimulus-to-fatigue ratio, set increases across a mesocycle | "15-20 sets per muscle", "5-30 reps", small muscles more reps, leg-press "local fatigue ... not so much systemic"; but static RIR, whole-set steps every 2-3 weeks and exercises that change between blocks (RP keeps them fixed, descends RIR, adds ~1 set/week) | ADAPTED |
| Athletic layer | Verkhoshansky (plyometrics, shock method); Cometti → Dietz (French contrast, triphasic); Zatsiorsky → Westside (ME/DE, box, bands, chains); NSCA plyo guidelines; Gerard Mach drills; Sheppard & Young (agility vs COD) | force phases (in his own order: deliver before amortization), 'FRENCH CONTRAST' at 78 % with goblet squats, conjugate tracks, A-drills, 'COD: Proactive' vs 'Agility: Reactive' | ADAPTED / FAITHFUL |
| Borrowed wholesale | Chris Hinshaw half-marathon plan (Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW '); Westside structure in the strength track | - | BORROWED / ECHO |
| Packaged models he names | 5/3/1 ('5-3-2'), Texas Method, Prilepin's chart ('Polkin') | no trace of 5/3/1 or Texas Method; his Olympic piece and STRENGTH-12 90 % weeks exceed Prilepin | not used |

**Scorecard** (138 concepts): FAITHFUL 38 %, ADAPTED 43 %, OWN 20 %, CONFLICT 7 %, BORROWED/ECHO 1 %, GAP 2 %. All conflicts concern loading parameters, not the taxonomy, so **the generator can trust his categorisation and must make his loading parameters configurable**.

**His own contributions** (keep each as an editable rule): the lunge triad ('Stance loads the FRONT TO BACK' / 'Load position loads UP/DOWN & SIDE2SIDE' / 'Movement orientations/guidance loads AROUND'); the diagnosis → bands/chains map; four force phases in his order; two jumping tracks; COD graded by turn severity on the route tree; the squat ladder by upright posture; knee + pull / hip + push pairing with bilateral/unilateral crossing; levels that move volume in opposite directions; an isolation/muscle layer bolted onto Davidson's patterns + the FOCUS list; the blue/green/orange aerobic system; 'the work / the accessory / the nuance / the survival'; the quality × month × level grid; pain rule = substitute first; EFFORT scale with 8 as bullseye; functional slings with an adduction squeeze; 'MID RANGE PUSH'; "exercise = seed + variables".

**Tensions to decide (coach vs evidence)** [SCI; defaults INF]: in-season he keeps 4 × 8-10 and drops intensity, while maintenance research says keep intensity and cut volume (toggle `in_season_style`); static RIR vs RP's descending RIR; per-session plyo contacts bunched (single sessions of 100-146) vs NSCA bands; Olympic % volume above Prilepin; French contrast at 78 % and 'immediately' vs ≥ 80 % and 3-5 min; shallow deloads (−25 %) vs ~50 % in the literature (his own baseball deload −46 % matches); no taper after the boxer's week-8 overreach; 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' misreads the size principle (recruitment follows load and effort); chains: research found ~10 % faster bars at matched load, opposite to 'INTENSIONALLY SLOW YOU DOWN'; 1:1:1 aerobic colours are not the polarised 80/20 endurance distribution (fine for team and strength clients).

**Key links** (all in 07 §18): RTBP athletic/control/resistance seminar pages (https://rtbp.inspire360.com/rtbp/athletic-patterns, https://rtbp.inspire360.com/rtbp/control-patterns, https://rtbp.inspire360.com/rtbp/resistance-patterns), RTBP certification curriculum (https://rtbp.inspire360.com/rtbp/certification), Davidson platform (https://www.drpatdavidson.net/rtbp-platform), RTBP course review (https://zaccupples.com/pat-davidsons-rethinking-the-big-patterns-course-review/), Davidson podcast on *A Coach's Guide to Optimizing Movement* (https://robbiebourke.podbean.com/e/episode-245-pat-davidson-a-coaches-guide-to-optimizing-movement-part-1/); RP volume landmarks (https://rpstrength.com/training-volume-landmarks-muscle-growth/), RP set increases within a mesocycle (https://rpstrength.com/expert-advice/in-defense-of-set-increases-within-the-hypertrophy-mesocycle), RP hypertrophy guide (https://rpstrength.com/blogs/articles/complete-hypertrophy-training-guide), *Scientific Principles of Strength Training* (https://www.jtsstrength.com/blog/scientific-principles-of-strength-training); split-squat load placement (https://blog.pre-script.com/how-to-select-the-right-load-placement-for-your-split-squat/), contralateral/ipsilateral EMG (https://pubmed.ncbi.nlm.nih.gov/25968228/); French contrast (https://nsca.com/contentassets/916a5692979346ce9a3a83c08c67e1e1/nsca-coach-9.4.3-the-french-contrast-method-theory-and-application.pdf); NSCA plyometric design (https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/).

---

## 13. The generator: inputs → decision pipeline

Machine-readable twin: `generator_spec_v0.json` (same folder). Intake form in full: `09_generator_inputs.md` (41 fields, 20 derived values, 16 checks, crosswalks). Everything in this section is [INF] unless tagged; every number is a default the coach can change in one place.

### 13.1 Inputs

**Express path (12 questions)**: F01 safety check · F02 age · F07 goal (`muscle`, `strength`, `athlete`, `fat_loss`, `hybrid`, `general`) · F11 sport and F14 season (athletes only) · F17 training age · F22 days per week (2-6) · F24 session length (30/45/60/75/90) · F25 plan length (6/8/12) · F27 equipment profile (11 profiles) · F35 pain areas · F41 email (delivery only).

**Full form adds**: F03 growth stage (youth) · F04 sex · F05 body weight · F08 second goal · F09 up to 2 focus muscles (his FOCUS headers 'QUADS 👇' … 'CORE 👇') · F10 lift style (`volume_lighter` / `balanced` / `heavy_powerlifting`, his words) · F12 position · F13 competition level · F15 weekly practice load · F16 weight cut / race distance · F18 recent frequency · F19 ability checklist (pull-ups, push-ups, pain-free squat depth, 3-s landing hold, Olympic coaching, barbell comfort, pain-free sprint) · F20 recent bests (for % prescriptions) · F21 aerobic base · F23 weekdays · F26 start date · F28 extra equipment · F29 gym machines · F30 heaviest DB pair · F31 medball weights owned · F32 box height · F33 running space · F34 cardio modality · F36 pain detail (side, severity, worse with overhead / deep knee bend / impact / twisting / bending / gripping / running) · F37 diagnosed/rehab · F38 exclusions · F39 coach review · F40 previous Blaze Camp plan.

### 13.2 Decision pipeline (pseudo-code)

```
generate_plan(intake):

  # 0. SAFETY GATE ----------------------------------------------------------------------------
  if any(intake.F01) or intake.F37 or 'severe' in intake.F36: return refer_to_coach(intake)          # V1

  # 1. WHO IS THIS? (derived values D1-D8) ------------------------------------------------------
  family   = GOAL_MAP[F07]                          # HYPERTROPHY | STRENGTH | ATHLETE | FAT_LOSS | HYBRID | GENERAL
  profile  = SPORT_MAP[F11, F12] if athlete else GOAL_PROFILE[F07]   # 04_profiles.json > profiles[id]
  level    = place_level(F17, F18, F13, F19)          # L1 <1 yr, L2 1-3, L3 3-5, L4 5+/competitive; -1 after layoff;
                                                      # cap L2 without landing control or 5 push-ups      (N-IN-01 pending)
  ladder   = 'athlete' if family == ATHLETE else 'gym' # athletes: higher level = less volume, more intensity
  phase    = season_phase(F14, F15, F25, F26)          # OFF_EARLY | OFF_BUILD | PRE | IN | TRANSITION | CAMP
  client_family = pick(athlete, hypertrophy, strength, beginner, older_or_pain, fat_loss)   # 10 client_families
  band     = CONSTRAINT_BAND[client_family]           # athletes main 1-2; hypertrophy 2-4/3-5; older 4-5 ...
  kit      = expand(F27 profile kit + F28 + F29 + F30 + F31 + F32 + F33 + F34)   # never infer from template names

  # 2. PICK THE TEMPLATE (skeleton + week) ------------------------------------------------------
  shape    = SKELETON[family][phase][F25]             # 06 skeletons: 8 = 7 load + deload/test; 12 = 6 + deload + 5;
                                                      # 6 = first half of 12, ends at peak (next plan opens with a deload)
  week     = SPLIT[family][F22]                       # 05 generator_split_templates; default A,B,OPT,A,B,OPT,OFF
  if profile.template == 'BASEBALL_PARTS': week = G3   # baseball/softball (tennis/golf INF)
  if profile.template == 'BOXING_BUILD':  week = boxer base (2 wk) -> conversion
  days     = place_on_weekdays(week, F23, game_days)  # same day type 72 h apart; no same lower dominance on consecutive days
  for day in days: stations = reference_60min(day)     # tiers 0-9 (section 10.1); slot = PURPOSE x CATEGORY
           stations = fit_to_time(stations, F24)       # cut order / add order (section 10.5)
           stations = add_athletic_prefix(profile)     # plyo/throw/COD/sprint/triple-ext slots by sport dial (section 9)

  # 3. ALLOCATE WEEKLY SETS PER MUSCLE AND PER BUCKET -------------------------------------------
  for muscle in MUSCLES:                               # 11 accounting muscles + unplaced (indirect only)
      peak  = PEAK_TARGET[goal][muscle][level]  (x level multiplier for non-hypertrophy goals; x phase multiplier)
      if muscle in F09[:2]: peak += 4 if level <= L2 else 6 ; rate = one class up (max 7 %)
      rate  = RATE[size_class(muscle)]               # big lower 3 %, big upper 5 %, small 7 %   (VOL-05 pending)
      start = max(floor[muscle], round(peak / (1 + rate) ** (loading_weeks - 1)))
      cap   = CAP[size_class][level] (+6 focus, never above RP MRV*P)
  athletic_week = profile.dials x season_multiplier[phase] x level_ladder   # contacts (high / low), throws, cuts,
                                                                            # sprint metres, triple-ext sets
  distribute sets to slots: session budget ~20 straight sets (15/20/22/24 by level; athletic 24-30 incl. athletic sets),
      2-4 sets per slot (athletes 2 -> 3 by level/season rather than more slots), <= 10 fractional sets per muscle per session,
      bilateral:unilateral share per lower pattern = BILAT_TARGET[goal][phase] (section 6)
  if pain region: affected muscles start at floor; rate 0 until 2 pain-free weeks

  # 4. CHOOSE EXERCISES (per slot, fixed for the block) -----------------------------------------
  for slot in stations:
      pool = library[slot.bucket]                     # LIB column; LEG FLEXION items only in leg-flexion slots (CAT-09)
      pool = [e for e in pool if e.operative_level <= ceiling(level, F19)]     # levels ADD options (CAT-05)
      pool = filter_kit(pool, kit); pool = filter_pain(pool, F35, F36); pool = filter_exclusions(pool, F38)
      if not pool: pool = substitution_ladder(slot, kit)    # his 'X or Y' -> same pattern other implement -> absorb
                                                            # machine slot (+2 sets to the compound) -> zone_shift / pattern_gap + buy list
      pick = argmax(score(e)): coach usage (his staples) + coach preference ('LOVE IT'; never V-squat; hack last)
                               - |constraint - band| + zone fit (zone 1-2 for heavy loads; one zone step per block)
                               + lengthened bias for isolation - skill above level - pain penalty
      second weekly exposure = twin of the same category (front-loaded early week, back-loaded later; or speed vs strength twin)
      athletic slots: pick by force phase / plyo zone of the week; medball mass by throw type and person
      record laterality; flag laterality_shift if a swap changed it

  # 5. SET REPS, EFFORT, REST, LOAD FORMAT -------------------------------------------------------
  for slot: reps   = REP_MATRIX[goal][exercise_class]        # size x class; VOL 1 -> 3 inverse for compound vs isolation
                     shifted by F10 style (volume_lighter: one bracket up; heavy_powerlifting: one bracket down)
            effort = EFFORT_BY_CLASS (compounds 1-2 RIR; isolation last set 0-1 / 'MAX'; speed RPE 6; plyos 'EASY')
            rest   = REST[goal][class] ('*REST 1-2 MIN', '*REST 3-6 MIN', '*REST AS PRESCRIBED')
            load   = % only for barbell main lifts / Olympic / speed / contrast (needs F20), else RIR; DB never in kg
            MYO / 'MAX' / 'ALL' only on the last 1-2 slots and (generator) only on isolation or constraint >= 4

  # 6. ORDER EACH SESSION ------------------------------------------------------------------------
  sort by tier (0 prep ... 9 conditioning); inside a tier by ascending constraint, then zone 2 before zone 3
  apply allowed overrides: contrast station; 'the work' priority lift; declared priority small muscle first; easy C / sprint first
  validate: R5 bilateral before unilateral; H before V (house rule); knee+pull / hip+push; frequency invariant; >= 1 OFF day

  # 7. PROGRESS WEEK TO WEEK ---------------------------------------------------------------------
  for loading week k: per muscle target = start x (1 + rate) ** (k - 1); bank = target - current
         readiness gate from last week's log (RED / AMBER / GREEN / EASY)
         if GREEN and bank >= 1: add clamp(round(0.10 x current), 1, 2) sets, round-robin over the muscle's menu,
            respecting the bilateral:unilateral target, per-exercise and per-session caps; overflow -> Focus slots
         exercises with no new set: double progression (reps to top of bracket at target RIR, then load)
         athletic: quality first (plyo zone Z1 -> Z2 -> Z3 in 2-week rungs; contacts +10-15 % per step), resistance 0-3 %
         strength: load +5 % every 2 weeks, RPE 7 -> 9; fat loss: compounds <= 3 %, isolation reps stepped, circuit density up
         in-season: frozen
  variation: menu fixed inside the block (VP-1); A/B weeks only if VP-2 chosen; athletic accessories may rotate drills
             inside the same velocity zone (VP-3); next block changes ONE small variable per slot (VP-4, order section 7.4)

  # 8. DELOAD / TEST / TAPER ---------------------------------------------------------------------
  planned: per shape (8 -> W8; 12 -> W7 (+ W12 peak/test); 6 -> next plan W1)
  dose: same exercises, round(min(0.85 x W1, 0.75 x peak)) sets, RPE 6-7, no MYO / supersets / contrast / buy-outs / Olympic,
        plyos 1-2 sets of landings, conditioning C only
  early: 2 weeks EFFORT 9-10 on >= 30 % of sets, or PAIN on >= 2 slots, or falling performance on >= 3 main lifts
  athletes: taper 1-2 weeks before the season or fight (volume -40-60 %, intensity kept); recovery week for throwers

  # 9. AUDIT AND RENDER --------------------------------------------------------------------------
  audit: sets per muscle vs targets/caps/floors; contacts, throws, cuts vs the sport tiers; NSCA per-session contact caps
         (80/100/120/140 by level); conditioning colours never repeated in a week; bilateral share; frequency invariant
  render in his words: slot labels ('Bilateral KD', 'Tripple Extension' shown as typed), REPS menu labels, EFFORT scale,
         his instruction lines ('*Always leave 1 rep in the tank...', pain line); reps stored as text; units for athletic work
```

### 13.3 Validation checks before a plan is released (from 09 §3)

Safety gate (V1); fewer weekdays than days (V2); 2-day strength/hybrid warning (V3); 30-min athlete warning (V4); youth < 15 (V5: foundational/moderate bodyweight plyos, no maximal lifts, no floor Olympic lifts, medball 4-6 lb); 65+ (V6: constraint 4-5, no Olympic lifts, depth jumps, hurdle hops or bounding); plan longer than the weeks to the season (V7: cut and taper, or switch to in-season at the season date); in-season 12-week plan (V8: maintenance skeleton); sport needs throws and no medball (V9: flag the gap, add to buy list, no silent quality swap); no equipment + muscle goal (V10: warn about vertical pull, biceps, throwing); > 2 focus muscles (V11); 'other' sport → generic athlete (V12); lower-limb pain + jump sport (V13: impact filter); no running (V14: machine conditioning); strength goal excluding barbells (V15); hybrid ≤ 3 days → 'HALF TIME' dose (V16).

### 13.4 What is the coach's and what is ours (for the engineer)

| Component | Status |
|---|---|
| Families, buckets, slot grammar, library menus, session order, pairing, week rhythm, optional blocks, deload shape, logbook menus, machine ratings, pain rule text, medball "light 8-10 lb", sport ranking basketball > MMA > boxing/karate, size classes, levels add options | **coach** ([COACH]/[CHAT]/[OBS]) |
| 3/5/7 % mapping to size classes; peak-week targets; bank-and-chunk release; readiness gate; caps and floors; level placement; sport tiers T0-T5 and numbers for 19 profiles; season multipliers; time model and cut order; deload formula; rep matrix numbers; exercise ranking; contacts per session caps | **ours** ([INF]) → configurable defaults pending the questions in §14 |

---

## 14. Known gaps in the sheets + top 15 questions for the coach

### 14.1 Gaps in the sheets [OBS absence]

1. **Hidden tabs**: eight MM tabs are hidden ('EXAMPLE UPPERLOWER SPLIT', 'EXAMPLE PUSHPULLLEGS SPLIT', 'EXAMPLE BOXING 8 WEEK BUILD UP', 'ALL ABOUT SQUATS', '(NOT DONE) ALL ABOUT BALLISTICS', '(NOT DONE) ALL ABOUT OLYMPIC LI', 'AGILITYCOD PATTERNS', 'CONTROL PATTERNSCORE'). The gym level ladder, the boxer sport anchor, the machine ratings, the only written rest rules, French contrast, the force phases, the medball list and the core 'BOTH' region all come from them. Nobody knows whether hidden means retired.
2. **Mostly empty templates**: AESTHETICS has Day 1 and part of Day 2 filled; JL 11 of 50 weekly slots; every other BYOP template reads 'CHOOSE 👇'. Doses for 177 of 322 selectable exercises are guesses; all exercise tags are ours; 81 of 322 have a video.
3. **Only two named-sport programs** (BASEBALL, boxing; plus CrossFit). Basketball, MMA, karate, football, soccer and the rest are extrapolated.
4. **No sprint slot** in any BYOP template (only ' Max velocity running (top speed)' inside PLYOS ADVANCED); MACH drills / acceleration starts live only in Sheet23 and programs.
5. **COD is in every BYOP athletic day but in none of his written programs**; the list is mostly the American-football receiver route tree; reactive agility is defined but never programmed.
6. **REPS menu cannot express** 1-3 reps, 25-30 reps, per side, seconds, metres, contacts, throws or calories.
7. **No library groups** for traps, front delts (as a target), adductors, hip abductors, erectors, forearms/grip, neck or rotator cuff; no neck exercises at all; CARRY and DRAGS are headings only; POSTERIOR OBLIQUE and LATERAL SUBSYSTEM empty; FUNCTIONAL wired to no slot.
8. **No equipment column**; the NO ACCESS tabs are not equipment-filtered and miswire 'Unilateral HD' to LEG CURLS.
9. **No session durations, no starting-load guidance, no warm-up-set guidance, no client-level placement method, no safety screen, no plan chaining** after week 6/8/12, no skeletons for distance runners (beyond the borrowed Hinshaw plan), youth, older adults, fight camp or a 12-week pre-season.
10. **No client logs** yet (EFFORT/'HOW IT FELT?' all 'CHOOSE 👇'): every feedback rule is designed, not observed. No instruction lines on the BYOP tabs (they exist only on MM examples).
11. **Data problems**: dates instead of reps; the 5-10-5 stored as a date; duplicates and cross-filings; library levels that contradict CAT-04 (push press/jerk FOUNDATIONAL, leg machines ADVANCED, back squat MODERATE); BYOP 'Clean '/'Snatch ' identity unclear; 'KB Face Pulls ' under VERTICAL PULL.
12. **No back-test**: the generator has never regenerated one of his own plans (JL Monday, BASEBALL Block 1 week 1, BOXING weeks 1-2) from client inputs.

### 14.2 Cross-file contradictions and the default this document adopts

| ID | Topic | Default adopted here | Settle with |
|---|---|---|---|
| C-01 | 3/5/7 % mapping | big lower 3 / big upper 5 / small 7 (03, 11); 06/07 "medium" tier retired (CAT-02) | VOL-05, N-VOL-04 |
| C-02 | release threshold | 1.0 set, then chunk 1-2 (11) | VOL-06, N-VOL-03 |
| C-03 | deload size (five rules) | round(min(0.85 × W1, 0.75 × peak)); 40-60 % only for tapers | PER-05 |
| C-04 / C-05 | focus extra, non-focus ceiling | +4/+6, cap +6; caps by size and level | VOL-02, N-VOL-05 |
| C-06 | weekly increase limit | ≤ +10 % total sets (SMOOTH); his +20-50 % STEP as an option | N-VOL-03 |
| C-07 | 6-week shape | 6 loading weeks ending at the peak; standalone 5 + deload/test as option | PER-01, N-PER-01 |
| C-08 | leg curls | LEG FLEXION segment (CAT-09); 01/03/05 bucket names updated here | answered |
| C-09 | core vs Olympic order (athletes) | core primer **before** the Olympic piece (BASEBALL Part B, MM primers), after plyo/throws/COD | N-SES-01 |
| C-10 | variety inside a block | block-fixed (chat); A/B optional | PER-02/03/04 |
| C-11 | RIR across a block | static 1-2 RIR compounds; descending RIR as an option | VOL-13 |
| C-12 | aerobic sessions/week | 2 at L1, 2-3 at L2, 3 at L3, 3-4 at L4 | ATH-07 |
| C-13 | medball weights | 8 lb passes/rotations, 8-10 lb overhead/sit-up/scoop, slams 10-20; lighter for youth/older/small | EQ-06 |
| C-14 | STARTING/MID/ADVANCED | treated as client levels (L1-L3) for athletes with the athlete ladder; may become a block sequence | PRG-04 |
| C-15 | athletic day length | 60-65 min (05 model) | VOL-08, N-SES-04 |
| C-16 / C-17 | level formula; two level fields | `operative_level` (library + 20 overrides) for eligibility; +skill only to rank unrated items | N-CAT-12, EQ-04 |
| C-18 | front delts | unplaced, indirect only | N-CAT-03 |
| C-19 | HYBRID bilateral share | item-based (43 % bilateral items) | - |
| C-20…C-24 | vocabularies (goals, phases, equipment, levels, days) | one crosswalk: `09_generator_inputs.md` §4 | N-IN-02, N-SES-06 |
| C-25 | missing skeletons | fallbacks in 09 §4.6 | N-ATH-09/17/18 |
| C-26 | squirrel jumps | analyst low-amplitude split kept, flagged everywhere | N-CAT-13 |
| C-27 | COD in athlete plans | keep the slot in off-season, 2nd in the cut order | N-ATH-05 |

### 14.3 The existing questionnaire

The page `coach-questions.html` ('Blaze Camp Model Questions') already holds **140 questions** in 11 sections: CAT 13, LIB 22, VOL 18, EQ 16, PRG 12, UNI 12, ATH 13, ORD 11, PER 11, GEN 8, FIX 4. Only CAT-01 to CAT-09 are answered (`coach_answers.md`). `08_open_questions_for_coach.md` adds **104 new questions** (32 P1, 64 P2, 8 P3; IDs N-CAT, N-VOL, N-ATH, N-SES, N-PER, N-IN, N-OUT), lists 12 page questions whose "We assume" text is now stale (VOL-05 medium tier, PER-05 "about half the sets", PER-08 in-season 2 days, PER-01, ORD-06, EQ-06, VOL-16, VOL-13, ATH-02, ATH-06, GEN-08, CAT-09) and a 38-item guess register. They are not re-listed here.

### 14.4 Top 15 questions to ask first (ordered by how much of the generator they unblock)

| # | IDs | Question (plain words) | Unblocks |
|---|---|---|---|
| 1 | N-CAT-01 | The hidden MASTER MODEL tabs (upper/lower and PPL levels, boxing, ALL ABOUT SQUATS, ballistics, Olympic, agility, core): still how you think today? | level ladder, sport anchor, machine ratings, rest, force phases, core regions |
| 2 | VOL-04, VOL-05, N-VOL-04 | 3/5/7 %: is it big lower 3, big upper 5, small 7? Applied to weekly sets per muscle? Every muscle, or only the focus muscle? | the progression engine |
| 3 | N-VOL-01 | Is 15-20 sets per muscle where a client starts in week 1, or where the block ends? | every weekly set number |
| 4 | VOL-06, N-VOL-02, N-VOL-03 | Is +2 sets at ~20 sets then a hold week your normal step (+1 at 10-14 sets)? Does an exercise that gains a set keep its load that week? | release rule, load rule |
| 5 | UNI-02, UNI-10, UNI-06, UNI-11, N-SES-02 | Bilateral vs unilateral: are ~50 % (general/aesthetics), 60-70 % (strength), 40-45 % (athlete conversion) your targets? Same vs opposite dominance by goal? Knee + pull / hip + push and bilateral + horizontal as rules? | the relationship you called "very important" |
| 6 | N-IN-01, N-IN-02, PRG-04, PRG-05 | How should a client be placed in a level, is NOVICE below NEWBY, is there a 4th level, and are STARTING/MID/ADVANCED levels or three consecutive off-season blocks? | start volume, caps, reps; athlete ladder |
| 7 | N-CAT-13, N-ATH-02, ATH-01, ATH-02 | Plyo dial: are squirrel jumps "real" plyos or low-amplitude bouncing? Is the boxer's 113-129 high + 142-177 low contacts a week typical, a ceiling or a lot? Weekly contacts for basketball, MMA, boxing, karate? | the sport dial for every profile |
| 8 | PER-01, N-PER-01 | 6-week plans: end at a peak (next plan opens with a deload) or 5 + deload/test? What happens when a plan ends and the next one starts? | plan shapes, chaining |
| 9 | PER-05 | Deload: back to about week-1 volume, same exercises, ~RPE 7, no extras (what you wrote), or about half the sets? Early deload from EFFORT 9-10 / PAIN logs? | deload rule |
| 10 | PER-02, PER-03, PER-04 | Block length (4 or 6 weeks)? Is the 4 TRACKS A/B-week pattern "the same over the block"? Second weekly exposure: same exercise or a twin (front squat Monday, back squat Thursday)? | variation policy |
| 11 | N-CAT-12, EQ-04 (+ 10 §7 Q2-Q4) | Re-file by your zone rule: push press/jerk and back squats → ADVANCED, high zercher and leg machines → FOUNDATIONAL? Is skill added on top of the zone? | exercise eligibility |
| 12 | N-SES-01, ATH-11 | In athlete sessions, does core come before or after the Olympic/triple-extension piece? Core every session, or only on optional days? | session order |
| 13 | N-ATH-04, N-ATH-05, ATH-06 | Sprint slot for field/court athletes? Keep COD in every athletic plan or leave it to practice? | athletic templates |
| 14 | N-IN-04, N-IN-05 | Health screen that sends some clients to you first; how detailed is the pain question? | safety, self-serve flow |
| 15 | N-OUT-12 | Will you write or grade 3-5 sample plans (beginner fat loss, intermediate aesthetics, off-season basketball, boxer, home DB client) so we can test the generator against you? | validation of everything |

Close runners-up: EQ-06 (medball weight by throw and person), VOL-13 (1 vs 2 RIR), N-CAT-08 (dose leg flexion like hamstrings or like biceps?), N-CAT-03 (traps, front delts, adductors, neck), N-VOL-10 (Olympic reps per set and % of which max), ATH-07 (2 vs 3 aerobic sessions), N-ATH-07 (subtract game jumps in season).

---

## Appendix A. His labels (verbatim) → canonical names

| Verbatim (with his spelling) | Canonical |
|---|---|
| 'TRIPPLE EXTENSION', 'Tripple Extension' | triple extension |
| 'SAGITAL', 'Sagital core' | sagittal |
| 'INTERMIDIATE' | intermediate (library level MODERATE) |
| 'BILATERAL HIP DOMNANT' | bilateral hip dominant |
| 'ABdution' | abduction (side delts; slot also holds rear/front delt items) |
| 'LACTATE CLERANCE' | lactate clearance |
| 'CIRCUITS RECCOMENDED', 'I reccomend' | recommended |
| 'BEGGINER WORKOUTS' | beginner |
| 'NEWBY' | newbie (level 2, above 'NOVICE') |
| 'Harmstring', 'Coppenhaggen Plank', 'Glidder' | hamstring, Copenhagen plank, glider/slider |
| 'UNILARTERAL' (CARRY sub-heading) | unilateral |
| 'INTENSIONALLY', 'Weght', 'presercibe', 'direclty', 'indivitual', 'weigths', 'DEAFLITS', 'Sqats', 'kne domminant' | intentionally, weight, prescribe, directly, individual, weights, deadlifts, squats, knee-dominant |
| 'calfs' | calves |
| 'LEG FLEXION' (Sheet25 H11) | knee flexion segment (CAT-09) |
| 'the work' / 'the accessory' / 'the nuance' / 'the survival' | strength-session roles 1-4 |
| 'VOL 1' / 'VOL 2' / 'VOL 3' | BASEBALL rep zones (compound vs 'SMALLER ISOLATIONS') |
| 'Buy out' | conditioning finisher (CA.BUY) |
| 'MYO SET' | myo-reps: 15 + 5 × 5 with ~3 s pauses (SQ A30) |
