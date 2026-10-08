# MASTER MODEL specialty reference tabs: the coach's principles

Companion to `specialty.json` (same folder). This document covers ten tabs of **BLAZE CAMP MASTER MODEL**:

* ALL ABOUT SQUATS
* (NOT DONE) ALL ABOUT BALLISTICS & PLYOS
* (NOT DONE) ALL ABOUT OLYMPIC LIFTING
* (NOT DONE) ALL ABOUT LUNGES
* (NOT DONE) ATHLETIC PATTERNS EXERCISE LIBRARY
* CONTROL PATTERNS/CORE
* AGILITY/COD PATTERNS
* AEROBIC CAPACITY CHEAT SHEET
* Sheet24 (half marathon)
* Sheet25

**Conventions**

* Text in 'single quotes' is the coach's own label, copied exactly, typos included.
* Plain text is the analyst's wording.
* **OBSERVED** means it was read directly from a cell.
* **INFERRED** means analyst interpretation, usually standard training science, which the coach has not confirmed.

---

## 0. Provenance and data health

| Tab (live title) | xlsx title | Visibility | Status | Non-empty cells | Records in JSON |
|---|---|---|---|---|---|
| ALL ABOUT SQUATS | same | **hidden** | finished | 162 | 21 (+2 `methods`, 26 `prescription_menus` rows) |
| (NOT DONE) ALL ABOUT BALLISTICS & PLYOS | (NOT DONE) ALL ABOUT BALLISTICS | **hidden** | 'UNDER CONSTRUCTION' | 201 | 100 |
| (NOT DONE) ALL ABOUT OLYMPIC LIFTING | (NOT DONE) ALL ABOUT OLYMPIC LI | **hidden** | 'UNDER CONSTRUCTION' | 29 | 22 |
| (NOT DONE) ALL ABOUT LUNGES | same | visible | 'UNDER CONSTRUCTION' | 34 | 17 (variables) |
| (NOT DONE) ATHLETIC PATTERNS EXERCISE LIBRARY | (NOT DONE) ATHLETIC PATTERNS EX | visible | 'UNDER CONSTRUCTION' | 5 | 0 (4 category stubs) |
| CONTROL PATTERNS/CORE | CONTROL PATTERNSCORE | **hidden** | unfinished (frontal plane mostly empty) | 72 | 52 |
| AGILITY/COD PATTERNS | AGILITYCOD PATTERNS | **hidden** | stub | 10 | 7 |
| AEROBIC CAPACITY CHEAT SHEET | same | visible | finished | 239 | 59 |
| Sheet24 | same | visible | finished (borrowed program) | 45 | 42 |
| Sheet25 | same | visible | scratch sketch | 12 | 8 |

**Coverage check.** All 809 non-empty cells in these tabs are accounted for. Each one is used by a record, a method, a menu, a principle or a header. `_meta.unaccounted_cells` is empty, and `all_cells` keeps every cell verbatim with its background colour.

**Live verification.** These tabs were re-read live through the Sheets API (`formattedValue`, `hyperlink`, `note`, formulas). They contain no hyperlinks, notes, formulas, dropdowns or images. The xlsx drawing parts are empty. **No video links exist here**, unlike the BYOP library and the RESISTANCE PATTERNS tab.

**Cells that Google Sheets auto-converted to dates.** These are the coach's typed ranges. The values below were confirmed live:

| Cell | Export value | Displayed | Meaning |
|---|---|---|---|
| SQUATS G18 | 2022-03-04 | '3-4' | French contrast: 3-4 sets |
| AEROBIC G13 | 2022-04-06 | '4-6' | advanced green: 4-6 sets |
| AEROBIC G14 | 2022-03-05 | '3-5' | advanced green: 3-5 sets |
| AEROBIC G15 | 2022-02-04 | '2-4' | advanced green: 2-4 sets |
| AEROBIC E31 | 2022-10-10 | '10/10' | single-leg hops: 10 each leg |

The generator must store ranges as text.

**Links from other tabs.** The coach uses these tabs as help pages. OBSERVED hyperlinks:

* RESISTANCE PATTERNS A7 'BILATERAL SAGITAL -SEE CHEAT SHEET *ALL ABOUT SQUATS' links to the squat tab.
* RESISTANCE PATTERNS C8 '*SEE ALL ABOUT LUNGES CHEAT SHEET...' links to the lunge tab.
* RESISTANCE PATTERNS A80 '**SEE MORE IN BALLISTICS&PLYOS or ALL ABOUT LUNGES' links to the ballistics tab.
* EXAMPLE ATHLETIC FULL BODY SPLIT J20/C24/J38 '*MEDBALL(S)' link to the medball cheat sheet.
* EXAMPLE PUSH/PULL/LEGS D40/H40/L40 'HELP' link to the squat tab.

**Two outside "models" appear**, which goes against the coach's own rule of building from first principles. OBSERVED:

* Sheet24 is titled 'HALF MARATHON PROGRAM by CHRIS HINSHAW '.
* The squat tab's MYO SET says 'You can youtube myoreps'. Myo-reps is Borge Fagerli's method.

The aerobic tab's title 'AEROBIC CAPACITY' is also the name of Hinshaw's company (INFERRED link).

---

## 1. ALL ABOUT SQUATS (finished; the coach's most complete theory tab)

### 1.1 Definition and the loading ladder

OBSERVED banner (A1-A6, cyan):

* 'SQUATS & KNEE DOMINANT MOVEMENTS'
* '*The squat is considered a KNEE DOMINANT movement, therefore how we load the weight of the squat can play a big role in how effective it may be'
* '**The easiest way for me to define a loading principle is by going from most front loaded to most back loaded'
* '***This model is based on free weight squats, leg presses and machines will be covered at the end'
* '****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus'
* '*****Follow the RIR prescription - REPS IN RESERVE - You will also see RPE'

A9 (grey) states what the ladder measures: '**THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN'.

| Rank | Label (row 10) | Squat (row 11) | Where the load sits | BYOP level of the same lift |
|---|---|---|---|---|
| 1 | 'EASIEST' | 'Hex Bar Squat' | at the sides (centre of mass) | FOUNDATIONAL (AI17) |
| 2 | 'EASIER' | 'Goblet Squat' | front, at the chest | FOUNDATIONAL (AI11) |
| 3 | 'EASY' | 'High Zercher Squat' | front, high in the elbow crease | MODERATE (AI47/48) |
| 4 | 'MODERATE' | 'Zercher Squat' | front, elbow crease (lower) | only 'Box. Zercher squat Touch and Go' (FOUNDATIONAL) |
| 5 | 'HARD' | 'Front Squat/ SSB Bar' | front rack, or cambered SSB | MODERATE (AI46) |
| 6 | 'HARDER' | 'High Bar Squat' | back, high | MODERATE (AI49) |
| 7 | 'HARDEST' | 'Low Bar Squat' | back, low | MODERATE (AI50) |
| 8 | 'VERY HARD ' (H8 'SPECIAL LOADING VARIATION') | 'Overhead Squat' | overhead | not in BYOP |

**Why the order works (INFERRED biomechanics).**

1. In a squat, the athlete-plus-bar centre of mass must stay over mid-foot.
2. A load in front of the trunk is a counterweight. It lets the hips sink between the heels while the torso stays vertical. That gives more knee flexion and a larger knee-extensor (quad) moment, which is the "knee dominant" stimulus the coach wants.
3. Moving the load back (high bar, then low bar) forces the trunk to incline to keep the bar over mid-foot. The hip-extensor moment grows and the squat becomes more hinge-like. Low bar is the most hip-biased, powerlifting-style variation.
4. Overhead is a separate 'SPECIAL' case. It needs thoracic extension, shoulder flexion and ankle dorsiflexion all at once.
5. The hex bar is first even though the load is not "front". The load at the sides puts the centre of mass right over the feet, so it is the most forgiving position.

**Key distinction for the generator.** The ladder ranks *posture difficulty*, not program level. BYOP files front, high-bar and low-bar squats all as MODERATE. 'HARDEST' does not mean advanced.

Suggested use (INFERRED):

* Start beginners or people with poor upright posture at ranks 1-2.
* For a quad/knee-dominant goal, use ranks 1-5.
* For a powerlifting-style goal ("heavier, fewer reps"), use ranks 6-7.
* Use rank 8 only for athletes who are also on the snatch progression (§3).

### 1.2 RIR / RPE rules (OBSERVED)

* Both the hypertrophy and the strength menus say '(1 RIR)'. Hypertrophy adds '*RPE8+' and strength adds 'RPE 8+'.
* A6 makes RIR the primary rule: 'Follow the RIR prescription'.
* INFERRED note: on the RIR-based RPE scale (Zourdos/Helms), 1 RIR is RPE 9, and RPE 8 is 2 RIR. Read 'RPE8+' as "never easier than 2 RIR, aim for 1". The coach should confirm (open question).
* The ATHLETIC menu has no RIR. Power work is done fast and nowhere near failure (INFERRED, standard practice).
* INFERRED science: proximity to failure is what makes a set count for hypertrophy (the "effective reps" idea). That is why the coach can let reps range from 5 to 30 if sets end about 1 RIR. For strength at 2-5 reps, 1 RIR keeps load high without the technique breakdown and fatigue that grinding to failure causes.

### 1.3 Set/rep menus (OBSERVED, cells A13:H28)

| Row | Hypertrophy sets x reps | Total reps | Strength sets x reps | Total reps |
|---|---|---|---|---|
| 15 | 3 x 15 | 45 | 5 x 3 | 15 |
| 16 | 3 x 12 | 36 | 6 x 3 | 18 |
| 17 | 3 x 10 | 30 | 5 x 4 | 20 |
| 18 | 3 x 8 | 24 | 6 x 4 | 24 |
| 19 | 4 x 15 | 60 | 7 x 3 | 21 |
| 20 | 4 x 12 | 48 | 6 x 4 | 24 |
| 21 | 4 x 10 | 40 | 8 x 2 | 16 |
| 22 | 4 x 8 | 32 | 7 x 2 | 14 |
| 23 | 4 x 15 + 'Max air squats' | 60+ | 4 x 4 | 16 |
| 24 | 4 x 12 + 'Max air squats' | 48+ | 4 x 5 | 20 |
| 25 | 4 x 10 + 'Max air squats' | 40+ | 5 x 5 | 25 |
| 26 | 5 x 8 + 'Max air squats' | 40+ | 6 x 4 | 24 |
| 27 | 3 x '15/5/5/5/5/5' '**MYO SET - ADVANCED' | 120 | - | - |

* Exercise cell: 'Whatever Squat'. Any squat from the ladder fits any menu, so the menu sets the dose and the ladder sets the exercise.
* Rest: hypertrophy '*REST 1-2 MIN BETWEEN SETS'; strength '*REST 3-6 MIN BETWEEN SETS'; athletic '*REST AS PRESCRIBED'.

**Structure (INFERRED, high-interest).** Both menus have exactly 12 rows (15-26). The hypertrophy rows form three 4-row waves:

* Each wave runs reps 15, then 12, then 10, then 8. Intensity rises week to week and reps per set fall.
* Each new wave adds volume: 3 sets, then 4 sets, then 4-5 sets plus a max-rep finisher.

This looks like a **12-week linear-wave plan: one row per week, three 4-week blocks**. Cutting at row 6, 8 or 12 gives the coach's 6-, 8- and 12-week products.

The strength rows can be read the same way:

* Block 1 (rows 15-18) accumulates: 15, then 18, then 20, then 24 reps.
* Block 2 (rows 19-22) intensifies toward doubles: 21, 24, 16, 14.
* Block 3 (rows 23-26) re-accumulates at 4-5 reps: 16, 20, 25, 24.

This is the coach's "volume ramps gradually week by week", expressed in sets:

* Inside a block, hard sets per session stay flat and load rises.
* Between blocks, sets rise by +1 per session. That is +33% (3 to 4), then a finisher, then +25% (4 to 5).

These steps are much larger than the 3/5/7% weekly increments the coach described. In practice:

* A 3-7% weekly ramp has to come from load or reps.
* Or it has to come from weekly set totals summed across several exercises for the muscle. For example, 15 sets/week + 5% ≈ +1 set every 1-2 weeks.

(Open question.)

### 1.4 MYO SET (OBSERVED A27:C27 and A30, red FF0000 definition box)

> 'MYO SET is where you do 15 reps, without stopping you just dont move for 3 seconds (resting) then do another 5 reps, breathe/rest 3 seconds, and repeat for 5 sets of those 5 reps... Totalis 40 reps without a stop.'

* That is 40 reps per MYO set, prescribed as 3 MYO sets, labelled ADVANCED.
* Elsewhere the coach uses it on the **leg press**: 4 TRACKS W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'. It is also a BYOP rep option (AW14 'MYO SET').
* INFERRED science: after the 15-rep activation set the muscle is near failure. Every short mini-set is then made of high-recruitment "effective reps", so you get a lot of stimulus in little time.
* The fatigue is local, so it suits stable machines (leg press, pendulum, leg extension). It is a poor fit for heavy free-weight squats, where a technical breakdown is risky.
* Generator rule: MYO only for advanced trainees, only on machine or isolation slots.

### 1.5 Athletic squat work: 'OFF SEASON' and 'FRENCH CONTRAST' (OBSERVED G13:I18)

* Header 'ATHLETIC FOCUSED WORKOUTS'. G15 'OFF SEASON' and G16 'FRENCH CONTRAST' are both yellow FFE599.
* Row 18: sets '3-4', reps '3/3/3/3/3'.
* I18: '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps'.
* INFERRED: this is Cal Dietz-style French contrast:
  1. Heavy compound.
  2. Bodyweight plyo.
  3. Loaded jump.
  4. Assisted (overspeed) plyo.
* It works through post-activation performance enhancement: the heavy set raises neural drive, and the contrast teaches the athlete to express that force fast.
* It is filed as an OFF-SEASON tool, where there is enough recovery for high-intensity complexes.
* Anomalies (open questions):
  * Five rep slots for four exercises.
  * 'Goblet squats' where the classic method uses a loaded *jump*.
  * No in-season prescription.

### 1.6 Banded / chained / weight-releaser logic (OBSERVED A33:D41)

| TYPE | Purpose (row below) | VOLUME | DETAIL | WHO NEEDS THIS? |
|---|---|---|---|---|
| 'BOTTOM BANDED' | '*PROLONG THE DURATION OF MAX PROPULSION' | 'Weight should be lower ranges around 50% so you can move fast' | 'Yields at bottcom of squat in order to create a faster impulse UPWARDS, tissues are stiffer at top of squat, tissues decrease stiffness on way down to yield. Bands are designed for speed/velocity' | 'SOMEBODY THAT CAN'T YIELD DOWN INTO A SQUAT CORRECTLY OR AT A "GOOD" SPEED' |
| 'REVERSE BANDED' | '*ACCELERATES MAX PROPULSION' | 'Weight should be lower ranges and fast speed' | 'Helps you have a faster concentric reaction & increase velocity of your against gravity forces' | 'SOMEBODY THAT IS SLOW ON THE WAY UP' |
| 'BOTTOM CHAINS' | '*INTENSIONALLY SLOW YOU DOWN' | 'Weght can be moderate around 70%' | 'Teaching concentric and increase stiffness, less degree of yielding. Chains are designed for magnitude influence, loading.' | 'SOMEBODY NEEDING TO STAY STIFF DURING THE WHOLE MOVEMENT ECCENTRIC, AMORTIZATION, AND CONCENTRIC' |
| 'WEIGHT RELEASERS' | - | 'I HAVE NO IDEA' | 'I HAVE NO IDEA' | 'I HAVE NO IDEA' (all red) |

The coach's vocabulary is Pat Davidson-like: yielding, stiffness, impulse, propulsion.

* **Bands are for velocity.**
  * Bottom-anchored bands pull the bar down faster (an overspeed eccentric that forces a quick, correct yield). Their tension grows toward lockout, so the athlete must keep accelerating instead of slowing near the top. That is how they "prolong" max propulsion.
  * Reverse (overhead-anchored) bands take load off the bottom, where the athlete is weakest. The athlete can leave the hole faster: they "accelerate" max propulsion.
* **Chains are for magnitude and stiffness.** Their mass piles up as the bar rises and drops off on the floor at the bottom. The athlete moves deliberately slower (~70%) and stays stiff through the eccentric, the amortization and the concentric.

Diagnostic-to-tool map for the generator:

* can't descend well → bottom bands
* slow out of the hole → reverse bands
* collapses or gets soft at the bottom → chains

BYOP files banded and reverse-banded box squats as **ADVANCED**.

**Weight releasers (INFERRED, for the coach to confirm).** Weight releasers are accentuated eccentric loading (AEL):

* Hooks add extra load for the descent only, then fall off at the bottom, so the concentric is lighter.
* Effects: higher eccentric force and greater stretch-shortening potentiation of the concentric. They train braking strength.
* Logical "who": strong, technically sound athletes who need eccentric/braking capacity and a better SSC, for example jumpers and change-of-direction athletes.

The coach already uses the same physics in plyos: ballistics C38-C44 'DROP WEIGHTED, DELOAD WEIGHT & HOP/JUMP'.

### 1.7 Machine preferences (OBSERVED G33:I41), turned into generator rules

| Machine | 'PERSONAL OPINION' | Detail (verbatim, abridged) | Generator rule (INFERRED) |
|---|---|---|---|
| 'LEG PRESS' | 'LOVE IT' | 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' | preferred machine for extra quad volume, MYO sets |
| 'HACK SQUAT' | 'I PERSONALLY DON'T LIKE IT' | 'Most hack squat machines don't have the right strength profile for me...' | allowed but deprioritised |
| 'V-SQUAT' | 'DON'T LIKE IT' | 'Always tight on lower back & knees, so I don't presercibe the use of these, ever.' | **exclude** |
| 'PENDULUM' | 'LOVE IT' | 'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried.' | first choice when available |

INFERRED science: the leg-press comment is Mike Israetel's stimulus-to-fatigue ratio (SFR). A machine gives high local quad stimulus with little axial or systemic fatigue, so more weekly quad volume becomes recoverable.

BYOP agrees in an interesting way. Leg press, hack squats and pendulum sit in the knee-dominant **ADVANCED** block, so "advanced" in BYOP includes advanced hypertrophy tools, not only skill.

### 1.8 Tempo and recruitment note (OBSERVED A44:A48, unlabelled)

* 'HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS'
* 'LIGHT BARBELL ' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT'

INFERRED: this is Henneman's size principle. Heavy loads recruit high-threshold motor units from the first rep, and a heavy bar descends slowly. Science nuance: light loads also reach high recruitment when taken close to failure, which is why the 15-30 rep range still builds muscle at 1 RIR.

---

## 2. BALLISTICS & PLYOS (UNDER CONSTRUCTION, but the theory is there)

### 2.1 Ballistic vs plyometric: two purposes (OBSERVED)

* A22 (red EA9999): 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST'. A23: '*I USE THESE FOR MUSCULAR FORCE PRODUCTION'. This covers columns A-C.
* D22 (mauve): 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'. D23: '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'. This covers column D.

INFERRED science:

* **Ballistic** means maximal intent to accelerate through takeoff or release, with no deceleration phase. Contacts are longer and muscle-driven, and the work trains rate of force development.
* **Plyometric** means a fast stretch-shortening cycle (short ground contact). The work trains tendon and fascia stiffness and elastic return, measured by the reactive strength index.

This split is exactly the lever the coach describes for sports:

* basketball → more plyos
* boxers / karate → fewer plyos
* MMA → in between

The **plyometric (REBOUNDING) volume** is what should scale with sport. Ballistic and medball work can stay high for striking and rotational sports (INFERRED mapping, open question).

### 2.2 The 4-phase force progression (OBSERVED headers, row 24, orange F9CB9C)

'TAKING IN FORCES', then 'DELIVER FORCES FAST', then 'AMORTIZATION OF FORCES', then 'REBOUNDING '.

| Phase | Items in coach order (verbatim) | Progression inside the column |
|---|---|---|
| 1 TAKING IN FORCES (eccentric / landing) | 'STICK THE LANDING BILATERAL ', 'STICK THE LANDING UNILATERAL', 'WEIGHTED STICK THE LANDING BILATERAL', 'WEIGHTED STICK THE LANDING UNILATERAL' | bilateral to unilateral, then bodyweight to weighted |
| 2 DELIVER FORCES FAST (concentric, landing minimised) | 'BILATERAL HOP ON TO', 'BILATERAL JUMP ON TO', 'UNILATERAL HOP ON TO', 'BILATERAL HOP ON TO' (dup.) | hop to jump, bilateral to unilateral (2x2 grid; the 4th cell is probably meant to be 'UNILATERAL JUMP ON TO') |
| 3 AMORTIZATION OF FORCES (transition / coupling) | 'DOUBLE BOUNCE BILATERAL', 'DOUBLE BOUNCE UNILATERAL', 'DROP & DOUBLE BOUNCE BILATERAL', 'DROP & DOUBLE BOUNCE UNILATERAL', 'DROP BILATERAL & HOP', 'DROP BILATERAL AND JUMP', 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & HOP', 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP', 'UNILATERAL DROP WEIGHTED, DELOAD WEIGHT & HOP', 'UNILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP', 'FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE' | in place, then from a drop, then from a weighted drop with the load released; bilateral before unilateral; hop before jump |
| 4 REBOUNDING (repeated SSC) | 'BILATERAL REPEAT HOPS', 'UNILATERAL REPEAT HOPS', 'BILATERAL REPEAT JUMPS', 'UNILATERAL REPEAT JUMPS', 'BILATERAL REVERSE BANDED HOPS', 'UNILATERAL REVERSE BANDED HOPS', 'BILATERAL REVERSE BANDED JUMPS', 'UNILATERAL REVERSE BANDED JUMPS' | hops before jumps, bilateral before unilateral, then band-assisted (overspeed) |

Phase-3 rule, C21 (green): '**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE'.

**Why this order (INFERRED).** It is the standard landing-first plyometric progression:

1. First teach the tissues to absorb force (landing mechanics, eccentric strength).
2. Then produce force without the landing cost (jumping *onto* a box).
3. Then shorten the switch from eccentric to concentric (double bounces, drop-and-go).
4. Only then do repeated reactive contacts, which carry the highest tendon load per rep.

**HOP vs JUMP.** The coach writes both words in every phase, so they mean different things. INFERRED:

* hop = small-amplitude, ankle- and stiffness-driven, short contact
* jump = full triple-extension amplitude

This contradicts track terminology, where "hop" means same-leg takeoff and landing (open question).

Generator rules (INFERRED, mirrored in record fields `force_phase_rank`, `row_order_in_phase` and `level`):

1. Never prescribe phase-4 unilateral jumps before the athlete owns phase-1 unilateral landings.
2. Volume (contacts) is set by phase. Phases 1-3 use low reps with full recovery (quality). Phase 4 uses contacts (10-20 per set).
3. Within any phase, progress in this order:
   * bilateral before unilateral
   * unloaded before weighted
   * no drop before a drop
   * hop before jump
   * assisted (reverse band) last, as a speed tool, not a regression

Cross-check with BYOP: its plyo levels agree. Depth drops and box jumps are FOUNDATIONAL, plate and hurdle hops are MODERATE, depth jumps and DB drop-release jumps are ADVANCED.

### 2.3 Dynamic medball warm-up (OBSERVED A4:C18)

Three sub-headers (mauve): 'BILATERAL', 'KNEE DOMINANT BILATERAL', 'KNEE DOMINANT UNILATERAL'.

* **Column A ('BILATERAL')** holds 13 drills built as *base movement x medball reach direction*:
  * bases: reverse lunge, forward lunge, lateral 'Cosak' (Cossack) lunge, toe touch, ground-to-overhead
  * reach directions: forward, UP, down-and-back cross reach, cross turn
  * The header probably refers to the two-handed symmetrical reach, since most items are lunges (open question).
* **Column B** holds 2 squats: front hold, hug goblet.
* **Column C** holds 5 lunge bases with the ball 'down over front leg': FFE, reverse, forward, stationary, RFE.
* Three rule cells follow:
  * '*Same lunge variations but medball hug'
  * '*Same lunge variations but medball forward'
  * '*Same lunge variation but medball up'
  * The JSON expands them into 15 `derived_variant` records, clearly flagged.

INFERRED: this is the same load-position logic as the lunge tab, 'Load position loads UP/DOWN & SIDE2SIDE'. The reach direction steers where the body is loaded:

* down over the front leg → the front hip and hip flexion
* up → extension, lats and thorax
* cross reach or turn → transverse rotation into the hips

It is a Pat Davidson-style warm-up that "puts the pelvis and ribcage through their positions" before loading.

### 2.4 Medball cheat sheet (OBSERVED A51:D89)

It doses every throw at **'1' set x '10'**, and **1 x 20** for the two sit-up throws. Every DESCRIPTION is a pattern tag. Their grammar is:

[stance modifier] + [symmetry] + [plane] + [pattern] + [hip direction]

The tags are:

* 'BILATERAL SYMETRICAL PUSH'
* 'BILATERAL SYMETRICAL PULL DOWN'
* 'CORE THORAX '
* 'BILATERAL SYMETRICAL KNEE DOMINANT & PUSH'
* 'TRANSVERSE PULL DOWN'
* 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH' and 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PULL DOWN'
* 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP', 'OUT OF THE LEFT LEG/HIP', 'INTO THE RIGHT LEG/HIP'
* 'TRANSVERSE CORE THORAX', 'BILATERAL CORE THORAX'
* 'FRONTAL PULL DOWN', 'TRANSVERSE INTO THE HIP', 'UNILATERAL OUT OF HIP', 'HIP DOMINANT PUSH'

Rows 78-81 have no tag.

**Order = biomechanical complexity, not difficulty.** The list runs:

1. bilateral sagittal throws
2. rotational R/L pairs
3. squat-integrated throws
4. rotational slams
5. step-forward R/L throws
6. the **half-kneeling 2x2 matrix**: facing R or L, crossed with left leg up or right leg forward, giving INTO or OUT OF each hip
7. back-to-wall scoops
8. sit-up throws

Then come 'SPECIALTIES' (9 items) and 'CORE EXTRAS' (7 medball core items, which the JSON files as CONTROL).

BYOP's THROWING column (K9:K27) is **the same 19-item list in the same order**, plus 'Rotational Downward Slam Throw'. Its ZONE row says 'AP - THROWING' instead of a level, so throws are **level-free (any)**.

INFERRED: "into the hip" means the pelvis rotates toward that femur (hip internal rotation and adduction), and "out of the hip" means it rotates away (external rotation and abduction). That is Pat Davidson / PRI-style thinking. The coach trains rotational power *through a specific hip in a specific direction*, always in R/L pairs. That matters for baseball, combat and racket sports (INFERRED).

---

## 3. OLYMPIC LIFTING: 'TEACHING/ LEARNING THE SKILL', 'PROGRESSION MODEL EASY TO HARD'

OBSERVED order (A6:A30):

* **'CLEANS'**: power clean from high hang, then mid hang (knee), then low hang (below knee), then floor; then hang squat clean, then low hang squat clean, then squat clean.
* **'JERK'**: OH press, then OH push press, then OH push jerk, then OH split jerk.
* **'SNATCH'**: standing drop power snatch; power snatch from high hang, mid hang, low hang, then floor; overhead box squat; overhead squat; standing drop overhead squat; high hang squat snatch; low hang squat snatch; squat snatch. B30 adds: '*SQUAT SNATCH HAS ITS OWN MODEL TO WORK AROUND BECAUSE DEPTH ON THE SQUAT NEEDS TO BE ADDRESSED'.

The rules are explicit in the ordering:

1. **Start position moves down the body**: high hang, then mid hang, then low hang, then floor. A longer pull is more technical.
2. **Power (partial-depth) receive before squat (full-depth) receive.**
3. **Overhead before speed**: press, then push press, then push jerk, then split jerk.
4. **Snatch depth is earned separately**: overhead box squat, then overhead squat, then drop-under, then squat snatches.

Combined with BYOP's TRIPPLE EXTENSION column:

* FOUNDATIONAL = clean and snatch *pulls* from the high and mid hang
* MODERATE adds low-hang pulls
* ADVANCED = 'Power Snatch', 'Power Clean', 'Power Clean & Jerk', 'Snatch ', 'Clean ', 'Clean & Jerk'

This gives the generator a full ladder:

1. pulls (foundational)
2. hang power variants (intermediate, INFERRED)
3. floor and squat variants (advanced)

Dosing is not in this tab. EXAMPLE CROSSFIT SPLIT doses 'POWER' as LVL 1 = 3 SETS x 3, then 4x3, 5x3, 6x3 (half-time: 3x4 down to 3x1).

Gaps:

* no 'high hang squat clean'
* no 'mid hang squat snatch'
* no squat-snatch depth model yet

---

## 4. LUNGES (UNDER CONSTRUCTION): the 3-variable framework

OBSERVED definitions:

* '*LUNGES are a UNILATERAL KNEE DOMINANT MOVEMENT'
* '**Just because they are knee dominant, it doesn't mean that they don't affect the hips... We can bias different foot placement for hip adaptations as much as foot adaptations'

'BUILDING THOUGHTS....':

* 'Lunges are a propulsive strategy '
* '...great for targetting prime movers along with frontal/transverse musculature'
* '...great for relative movement at the hips'
* '...great for strengthening athletic patterns '
* '...great for finding/gaining/regaining ROM'
* '...great potentiators of the squat patterns'

'THIS IS NOT PERFECT, BUT IT HELPS UNDERSTAND':

* **'Stance loads the FRONT TO BACK'**
* **'Load position loads UP/DOWN & SIDE2SIDE'**
* **'Movement orientations/guidance loads AROUND'**

Variable columns:

* **Column A** (header is a blank space): 'Front/back', 'Lateral'. This is movement orientation, which loads AROUND (INFERRED mapping).
* **'LOADING'** (C22:C33), 12 positions on three axes:
  * height: suitcase (low), then on shoulder (high), then high zercher (front-high), then zercher, front rack, back rack
  * side: 'Contralateral', 'Ipsilateral' or 'Duble' / 'Double handed'
  * implement: DB/KB, then barbell
* **'PROPULSION'** (E22:E24): 'FFE', 'FLOOR', 'RFE'. This is stance or foot elevation, which loads FRONT TO BACK (INFERRED mapping).

**INFERRED science.**

* **Stance:** foot elevation changes how load is shared between the front and rear leg, and the range of motion.
  * FFE gives the front leg deeper hip and knee flexion (ROM).
  * RFE puts most of the load on the front leg and stretches the rear hip flexors.
* **Load position:**
  * Height changes the trunk and bracing demand. Low suitcase is the easiest and most stable; high front positions demand an upright, braced trunk.
  * Side bias creates a frontal/transverse moment. A contralateral load raises gluteus medius / lateral-hip demand on the front leg because the pelvis must not drop toward the loaded side. An ipsilateral load stresses foot and knee alignment and the trunk's lateral flexors.
* **Orientation:** lateral and other non-sagittal steps load the hip "around" (adduction/abduction, rotation).

**For the generator:** a lunge = orientation x load position x stance. The coach does not enumerate the combinations (2 x 12 x 3 = 72). The JSON stores the 17 variables (`record_type: lunge_variable`).

BYOP 'UNILATERAL KNEE DOMINANT' (AL9:AL21) is the concrete exercise list: stationary, reverse, forward, side, pistol, SL get-ups, FFE, RFE, rear foot against wall, FFE+RFE, step-ups, elevated reverse, curtsy.

---

## 5. CONTROL PATTERNS / CORE: thorax / pelvis / both x plane x dynamic / static

OBSERVED grid:

* Columns: plane groups 'TRANSVERSE' (B/E), 'SAGITAL' (I/L), 'FRONTAL' (P/S), each split into 'DYNAMIC' and 'STATIC'.
* Rows: region 'CORE THORAX' (rows 7-16), 'CORE PELVIS' (18-25), 'BOTH' (28-37).

| Region \ plane-mode | TRANSVERSE DYNAMIC | TRANSVERSE STATIC | SAGITAL DYNAMIC | SAGITAL STATIC | FRONTAL DYNAMIC | FRONTAL STATIC |
|---|---|---|---|---|---|---|
| CORE THORAX | 10 (Russian twists, med ball from hands, cable oblique turns, single side carry, plank to side plank, up/down planks, cable chops, swiss ball plate rotations, 'Landline' rotations, KB rotation swings no hip thrust) | 5 (bench pallof plank, pallof press, pallof hold, shoulder taps, offset planks) | 1 (Crunches) | 1 (Crunch hold) | **empty** | **empty** |
| CORE PELVIS | 8 (hip turns, med ball from feet, windshield wipers, SL toes to bar, knees to chest, flutter kicks, leg raises, glute bridge march) | 2 (plank alternating feet raises, March) | 3 (Toes to bar, Knees to chest, Supine leg raises) | **empty** | **empty** | **empty** |
| BOTH | 9 (dead bugs, bird dogs, plank supermans, cross connect rolls/rocking, break dancers, 'turkish gettups', bear crawl, KB windmills, Star V-ups) | 4 (plank supermans, bird dogs, dead bugs, cross connect) | 3 (V-ups, Supermans, Situp) | 3 (L sit hold, Low plank, High plank) | **empty** | 3 (Elbow side plank, Elbow oblique sit, High side plank) |

**The taxonomy (INFERRED science).** The coach classifies core work by *which segment moves*:

* the thorax over a fixed pelvis (crunch, twist)
* the pelvis under a fixed thorax (leg raise, toes to bar, hip turns)
* both segments together (V-ups, dead bugs, bird dogs)

He then classifies by *plane* and by *whether the trunk produces motion (DYNAMIC) or resists it (STATIC)*, i.e. anti-rotation, anti-extension and anti-lateral flexion. That replaces "upper abs / lower abs / obliques" with a segment x plane x mode grid. It is the core version of his athletic-pattern thinking. The same structure exists in BYOP:

* O-Q: CORE THORAX SAGITAL / FRONTAL / TRANSVERSE
* R-T: CORE PELVIS SAGITAL / FRONTAL / TRANSVERSE

In BYOP the **plane is the difficulty**. ZONE row:

* SAGITAL = 'EASY'
* FRONTAL = 'MODERATE'
* TRANSVERSE = 'HARD'/'ADVANCED'

So the generator should progress core sagittal, then frontal, then transverse, and static before dynamic (INFERRED for the static/dynamic part).

Anomalies (kept verbatim, open questions):

* 'single side carry' (usually frontal) is filed under TRANSVERSE.
* 'knees to chest' and 'leg raises' appear under TRANSVERSE pelvis as well as SAGITAL pelvis.
* 5 exercises appear in both the dynamic and static columns. INFERRED: as moving reps vs end-position holds.
* The frontal plane is almost empty.

---

## 6. AGILITY vs COD

OBSERVED:

* 'Agility: Reactive in nature - Incognitive Competence'
* 'COD: Proactive in nature - Cognitive Competence'

INFERRED: this is the Sheppard and Young (2006) distinction.

* **Agility** reacts to a stimulus that is not known in advance: a defender, a ball, a call. It is performed at the "unconscious competence" stage of skill learning. "Incognitive" most likely means unconscious.
* **COD** is pre-planned and consciously executed.
* Programming consequence: COD drills (routes, formations) build the mechanics. Agility needs a reactive cue (partner, light, coach call) and cannot be written as a fixed drill.

Listed patterns (no definitions in the sheet):

* 'HOPS IN PLACE'
* 'KRUMRIE FORMATION', 'MUNOZ FORMATION'. INFERRED, low confidence: both are names of Cincinnati Bengals linemen, so possibly football footwork formations.
* 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION' (hop grids)
* 'RUNNING ROUTES', 'ROUTE TREE'

BYOP's CHANGE OF DIRECTION column grades the receiver route tree by turn severity: 'EASY TURN' (fade, slant, post/corner, flat, shuffles), 'MOD. TURN' (dig/out, 'LEFT TEST'), 'HARD TURN' (comeback/curl, plus a date cell that is the 5-10-5 shuttle).

---

## 7. AEROBIC CAPACITY CHEAT SHEET (finished)

### 7.1 Rules (OBSERVED, cyan)

* '*These are only recomendations & samples'
* '**Follow Running Warmups'
* '***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week'

### 7.2 The colour system (OBSERVED cheat sheet A24:C41; the same colours fill the workout rows)

| Letter | Colour | Duration | Intensity | Work bouts | Rest |
|---|---|---|---|---|---|
| 'A' | **Blue** A4C2F4 | 'Short Duration ' | 'High Intensity' | 'Seconds ': '15/45', '20/40', '30/30', '40/20', '45/15' Work:Rest | '3 Minutes' to '8 Minutes' (INFERRED: between blocks) |
| 'B' | **Green** B6D7A8 | 'Moderate Duration' | 'Moderate Intensity' | '1 Minute', '2 Minutes', '3 Minutes' | '1:1', '1:2', '1:3' Work:Rest |
| 'C' | **Orange** F9CB9C | 'Long Duration' | 'Low intensity' | '4+ Minutes' | 'Active', ':30 sec', '1 Minute', '2 Minutes', '3 Minutes' |

Level ladder (OBSERVED in EXAMPLE CROSSFIT SPLIT D21:D24):

* 'LVL 1 = C'
* 'LVL 2 = C, B'
* 'LVL 3 = C,B, A'
* 'LVL 4 = LACTATE CLERANCE'

So the base (orange) comes first, moderate intervals (green) are added second, high-intensity work (blue) third, and lactate clearance last.

INFERRED science:

* Orange builds the aerobic base: mitochondrial and capillary density, stroke volume, and fat oxidation at low intensity.
* Green is VO2max-type interval work: 1-3 min bouts with 1:1 to 1:3 rest.
* Blue is short, high-intensity repeats that tax glycolytic power and repeat-sprint ability. The 10 x 10 m sprints are alactic.

Rotating one of each per week, and never repeating a colour, keeps all three energy-system qualities moving while capping high-intensity stress at one session a week (a polarised-style distribution).

### 7.3 Workout grid, by level (OBSERVED A8:I21)

Pace scale used (INFERRED order): EASY < MODERATE < FAST < FASTEST < SPRINT.

| Colour | 'BEGGINER' | ' INTERMEDIATE' | ' ADVANCED' |
|---|---|---|---|
| Blue | 10 x 10 m MODERATE; 10 x 15/45 EASY; 10 x 20/40 EASY | 10 x 10 m MODERATE; 10 x **30/30** MODERATE; 10 x **40/20** MODERATE | 10 x 10 m **SPRINT**; 10 x 15/45 **FAST**; 10 x 20/40 **FAST** |
| Green | 5 x 1'/3' FAST; 5 x 2'/4' FAST; 5 x 3'/3' MODERATE | **7** x 1'/3' MODERATE; **7** x 2'/4' FAST; 5 x 3'/3' FAST | **4-6** x 1'/3' FASTEST; **3-5** x 2'/4' FASTEST; **2-4** x 3'/3' FASTEST |
| Orange | 4 x 5'/:30 EASY; 3 x 8'/1' EASY; 2 x 11'/2' EASY; 1 / 2 / 3 mile EASY | **6** x 5'/:30, **4** x 8'/1', **3** x 11'/2' MODERATE; 1 mile FAST, 3 mile MODERATE, 5 mile EASY | 4 x 5'/:30, 3 x 8'/1', 2 x 11'/2' **FASTEST**; 1 / 3 / 5+ mile FASTEST |

**The coach's progression logic, read off the grid (INFERRED).**

1. **Beginner to intermediate raises VOLUME or DENSITY at moderate pace.**
   * Orange running time rises from about 20-24 min to about 30-33 min.
   * Green sets rise from 5 to 7.
   * Blue work:rest moves from 1:3/1:2 to 1:1/2:1.
2. **Intermediate to advanced raises INTENSITY and drops volume back to beginner levels.**
   * Paces become FAST/FASTEST/SPRINT.
   * Set counts become ranges ('4-6', '3-5', '2-4'), which suggests autoregulation: stop when pace drops.

This is the same "volume first, then intensity" logic as the squat waves.

### 7.4 Lactate clearance (OBSERVED G23:I41; level 4)

Four formats:

| Rows | Sets | Reps | Pattern |
|---|---|---|---|
| 26-29 | 1 | '4 (NO REST)' | surge-and-float cycles, e.g. '1 min MODERATE/20 Sec FASTEST/ 2 Min EASY' (≈13-14 min total) |
| 30-33 | '2 - Rest 1 min btwn SETS' | '2 (NO REST)' | short cycles, e.g. ':30 sec MODERATE/20 Sec FASTEST/ 1 Min EASY' (≈8-11 min) |
| 34-37 | '3 - Rest 2 min btwn SETS' | '2 (NO REST)' | e.g. '2 Min FAST/ 2 Min EASY' up to '5 Min FAST/ 1 Min EASY' (≈28-40 min) |
| 38-41 | '4 - Rest 3 min btwn SETS' | 1 | e.g. '2 Min FASTEST/ 4 Min MODERATE' up to '5 Min FASTEST' (≈29-33 min) |

INFERRED science: the athlete surges above lactate threshold, then "floats" at moderate or easy pace without stopping. This trains the body to clear and reuse lactate while still moving (Brooks' lactate shuttle), which is exactly what CrossFit and fight rounds demand.

### 7.5 Running warm-up (OBSERVED D25:F32)

Seven drills, in this order:

1. 2 x 10 yd 'A March'
2. 2 x 10 yd 'A Skip'
3. 2 x 10 yd 'A Runs'
4. 2 x 10 yd 'Bilateral forward hops'
5. 2 x 10 yd 'Bilateral backward hops'
6. 2 x '10/10' 'Single leg in place hops'
7. 5 x 10 yd 'Falling start accelerations'

E36 adds: 'Add your own as needed...'.

INFERRED: the order runs mechanics, then pogo stiffness, then acceleration. It is a RAMP-style warm-up that rehearses the running positions and "wakes up" the elastic tissues.

---

## 8. HALF MARATHON (Sheet24): 'HALF MARATHON PROGRAM by CHRIS HINSHAW '

OBSERVED: 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.' The whole plan is stored as CSV text: 'Week,Day,Workout Detail'.

**Structure:** 21 weeks x **2 run sessions per week**.

**Day types.** There are seven:

* continuous distance runs (3 up to 11 miles)
* **split days**, e.g. '4 miles (2 miles a.m. + 2 miles p.m.)', up to '12 miles (7 miles a.m. + 5 miles p.m.)'
* progression runs ('easy, moderate, hard')
* hill sprints (8-10 x 8-10 s, '6x10sec plus 2x20sec', full recovery)
* flat sprints (40-80 m, full recovery)
* intervals ('5x200m fast', '4x (150m at fast pace w/ 250m walking rest)')
* '1-mile at max effort' tests in weeks 10 and 14

Some sessions are **undefined**: 'Workouts involving distances and paces' in weeks 11, 13, 15, 19 and 20, plus 'Varied distance workouts' and similar.

**Long-run arc:** 3 → 4 → 2 → 4 → 5 → 3 → 6 → 4 → 6 → 7 → 7 → 6 → 7 → 8 → 9 → 10 → 10 → 6 → 11 → 12 miles. Week 21 is the taper (6 miles comfortable), then race day.

INFERRED principles:

* Low run frequency, which leaves room for strength training.
* One quality (speed) day plus one volume day.
* Double days build weekly mileage without a single long, damaging bout.
* Hill sprints are a low-impact way to build stride power and tendon stiffness.
* Volume is cut back every few weeks (weeks 3, 6, 8, 12 and 18), which acts as a deload.

---

## 9. Sheet25 and the ATHLETIC PATTERNS stub

**Sheet25** (untitled scratch) lists four lower-body slot headers in row 11:

* 'BILATERAL HIP DOMINANT' ('rdl', 'hip thrust')
* 'UNILATERAL KNE DOMINANT' ('lunges', 'bulgarians')
* 'LEG FLEXION' ('ham curls')
* 'BILATERAL KNEE DOMINANT' ('squats', 'goblet squats', 'leg press')

INFERRED: a leg-day template of one exercise per category. Hip hinge, unilateral knee, knee-flexion isolation and bilateral knee together cover the quads, glutes and hamstrings in two directions each.

**(NOT DONE) ATHLETIC PATTERNS EXERCISE LIBRARY** has only 'UNDER CONSTRUCTION', 'TRIPPLE EXTENSIONS', 'CHANGE OF DIRECTION', 'THROWING' and 'Jumping'. These are the planned athletic buckets and match BYOP's ATHLETIC columns. No exercises yet.

---

## 10. Cross-cutting rules the generator can take from these tabs (INFERRED synthesis)

1. **Two separate axes per exercise.** Pattern/biomechanics comes from the category, and difficulty comes from the level. A posture-difficulty ladder (squats), a start-position ladder (olympic), a force-phase ladder (plyos) and a plane ladder (core) are all *progressions inside a category*.
2. **Volume, then intensity** (squat waves, aerobic levels). Inside a block hold the sets and raise the load. Between blocks add sets or add a finisher.
3. **Goal decides the menu, not the exercise.** Any ladder squat can go into hypertrophy (8-15 reps, 3-5 sets, 1-2 min rest, 1 RIR), strength (2-5 reps, 4-8 sets, 3-6 min rest, 1 RIR) or athletic (complexes, rest as prescribed).
4. **Diagnose, then choose the tool.**
   * slow out of the hole → reverse bands
   * can't yield → bottom bands
   * soft or collapsing → chains
   * wants hypertrophy with low systemic cost → leg press or pendulum, MYO
5. **Hard exclusions and preferences**: V-squat never; hack squat deprioritised; pendulum and leg press preferred.
6. **Plyo dose by phase and sport.**
   * Landing comes before rebounding.
   * Bilateral comes before unilateral.
   * Rebounding (plyometric) volume scales with sport demand (basketball high, MMA medium, boxing/karate low).
   * Ballistic and medball work can stay high for striking and rotation (INFERRED, to confirm).
7. **Throws are level-free** and always come in R/L pairs, 1 x 10 each (1 x 20 for sit-up throws).
8. **Core**: pick by region (thorax / pelvis / both) x plane x mode. Progress sagittal, then frontal, then transverse.
9. **Aerobic**: 3 sessions a week, one of each colour. Unlock colours by level: C, then C+B, then C+B+A, then lactate clearance. Always do the running warm-up first.

---

## 11. Verbatim typos (keep in labels, correct in canonical names)

| Coach's spelling | Correct spelling |
|---|---|
| 'SAGITAL' | sagittal |
| 'TRIPPLE EXTENSIONS' | triple |
| 'BEGGINER' | beginner |
| 'recomendations' | recommendations |
| 'MInutes' | minutes |
| 'CLERANCE' | clearance (CrossFit tab) |
| 'Cosak' | Cossack |
| 'revere lunge' | reverse |
| 'stationay' | stationary |
| 'Duble suitcase' | double |
| 'BELLOW KNEE' | below |
| 'turkish gettups' | get-ups |
| 'Landline' | landmine |
| 'AMMORTIZATION' | amortization |
| 'SYMETRICAL' | symmetrical |
| 'INTENSIONALLY' | intentionally |
| 'Weght' | weight |
| 'bottcom' | bottom |
| 'presercibe' | prescribe |
| 'kne domminant' | knee dominant |
| 'Totalis' | total is |
| 'GOIN' | going |
| 'Scroll bellow' | below |
| 'UNILATERAL KNE DOMINANT' | knee |
| 'targetting' | targeting |
| 'Incognitive' | unconscious |
| 'Harmstring' | hamstring (BYOP) |
