# RESISTANCE PATTERNS EXERCISES LIBRARY: decoded

Source: **BLAZE CAMP MASTER MODEL**, tab `'(NOT DONE) RESISTANCE PATTERNS EXERCISES LIBRARY'`. The xlsx export cuts the name to 31 characters, so the dump calls it `'(NOT DONE) RESISTANCE PATTERNS '`. The tab's sheetId is 1916067449. All the data sits in A1:L117.
Companion data file: `resistance_patterns.json`. It holds 161 exercise records, 39 variable-modifier records, 68 header cells, 4 note cells, 59 hyperlinks and 3 test formulas.
Labels: **OBSERVED** means read straight from the sheet. **INFERRED** means it is my interpretation. Quoted labels are the coach's own words, typos included.

---

## 0. TL;DR

1. This tab is the coach's **biomechanical taxonomy** for resistance training. It is a design document. It is not a dropdown source. It has **0 data validations**. I checked this two ways: in the xlsx export, and live through the Sheets API. The "59" number matches the tab's **59 hyperlinks**: 56 YouTube demo videos plus 3 links to other tabs.
2. Hierarchy (OBSERVED): `BODY REGION → PATTERN → LATERALITY × PLANE → (sub-group / variable group) → exercises ordered easy → hard`.
3. Level is coded only by **cell colour** in a traffic-light scheme: green `93C47D`/`B6D7A8` = foundational, yellow `FFE599` = intermediate, red `E06666` = advanced. It is consistent across every coloured column. It matches the BYOP MASTER EXERCISE LIBRARY level blocks for **48 of 52** exercises that have a BYOP twin with a level.
4. An exercise is not a single item. It is a **base pattern plus a stack of variables**. The coach lists those variables explicitly as blocks: `FEET POSITIONING VARIATIONS`, `GET INTO/OUT OF THE HIP` (contralateral vs ipsilateral loading), `LOW/MID` vs `HIGH LOADING VARIATION`, `HAND PLACEMENT`, `FEET POSITION`, `STANCES`, `ROM VARIABLE`, `END RANGE BEHAVIOR VARIABLE`, `LOADING VARIABLES`, and the `'*ANY'` box-squat template. Real program tabs write exercises as exactly these stacks, e.g. `'RFE & FFE contralateral lunge double DB front rack loaded'`.
5. **Big-muscle work is organized by biomechanics; small-muscle work by muscle.** Columns A–I are patterns × laterality × plane. Column K replaces the plane header with `SHOULDERS`, `BICEPS`, `TRICEPS`. These two groups line up with the coach's own buckets: "bigger muscles", "smaller muscles" and "biomechanics".
6. About 60% of the grid is unfinished. Every upper-body FRONTAL/TRANSVERSE block is empty, `HALF KNEELING VARIATIONS` is empty, and the upper-body VIDEO columns are empty. 99 of 161 exercises have no colour. The `TEST FORMULA` is a working prototype of a random exercise picker, and it can return blanks or headers.

---

## 1. Physical layout (OBSERVED)

```
col:   A (exercise)                  B     C (exercise / variables)            D     E                     F     G                 H     I                     J     K                       L
r1     'UNDER CONSTRUCTION' (FFFF00)
r5     'LOWER BODY MECHANICS' (FF0000)                                               'UPPER BODY MECHANICS' (EA9999)
r6     'KNEE DOMINANT'               VIDEO                                       VIDEO 'VERTICAL PUSH'       VIDEO 'MID RANGE PUSH'  VIDEO 'HORIZONTAL PUSH'     VIDEO 'SHOULDERS/BICEP/TRICEP' VIDEO
r7     'BILATERAL SAGITAL -SEE        'UNILATERAL SAGITAL'                             'BILATERAL SAGITAL'          'BILATERAL SAGITAL'     'BILATERAL SAGITAL'          'SHOULDERS'
        CHEAT SHEET *ALL ABOUT SQUATS'
r8-30  23 squats  G→Y→R              C8 note → ALL ABOUT LUNGES                    E8-E15 presses G→Y→R         G8-G14 incline /        I8-I15 presses G→Y→R         K8-K22 shoulder iso
                                     C9 'FEET POSITIONING VARIATIONS' C10-C18      E16 'HALF KNEELING            landmine / viking       I16 'HAND PLACEMENT' I17-21   K23 'BICEPS' K24-K30
                                     C19-C26 'GET INTO/OUT OF THE HIP' (4 tiers)       VARIATIONS' (EMPTY)       (no colours)            I22 'FEET POSITION' I23-28   K31 'TRICEPS' K32-K43
                                     C27-C30 'LOW/MID LOADING VARIATION'                                                                 I29 'UNILATERAL SAGITAL' I30-34
r32-36 'SPECIALTY VARIATIONS' A33-36 C31-C36 'HIGH LOADING VARIATION'
r37-41 'Leg Extensiona' A39-41       C37 'SINGLE LEG' C38-C39
r46    'BILATERAL FRONTAL' A47-49    'UNILATERAL FRONTAL' C47                      'BILATERAL FRONTAL' (EMPTY)  'BILATERAL FRONTAL'(EMPTY) 'BILATERAL FRONTAL' (EMPTY)
r53    'BILATERAL TRANSVERSE' A54-55 'UNLATERAL TRANSVERSE' (EMPTY)                'BILATERAL TRANSVERSE'(EMPTY) ...(EMPTY)          ...(EMPTY)
r59    'HIP DOMINANT' (C27BA0)                                                     'VERTICAL PULL'              'HORIZONTAL PULL'
r60    'BILATERAL SAGITAL'  VIDEO    'UNILATERAL SAGITAL'                    VIDEO 'BILATERAL SAGITAL'          'BILATERAL SAGITAL'
r61-79 14 hinges G→Y→R               C61 'BILATERAL LOADING' C62-64 (staggered)    E61-E75 pulldowns→pull-ups   G61-G70 rows
       A75 'POWERLIFTING Speacialty  C70 'UNILATERAL LOADING ' C71-C74 into/out                                 G73 'UNILATERAL SAGITAL' G74-79
       LIFT ' A76 sumo               C76 'UNLATERAL TRANSVERSE' C77
       A77 'SPEED SPECIALS' A78-79
r80    '**SEE MORE IN BALLISTICS&PLYOS or ALL ABOUT LUNGES' (2 links)
r81-94 'ROM VARIABLE' A82-85 / 'END RANGE BEHAVIOR VARIABLE' A87-89 /                                         G82 'STANCES' G83-G85
       'LOADING VARIABLES' A91-94
r110   'TEST FORMULA'  A112, A114, A117 = INDEX(...RANDBETWEEN...) pickers
```

Structural observations:

- Every exercise column is paired with a **VIDEO** column on its right (A/B, C/D, E/F, G/H, I/J, K/L). Only B and D contain links. F, H, J and L have a `VIDEO` header and no content.
- **Rows 5–55 pair KNEE DOMINANT with the PUSH patterns, and rows 59–94 pair HIP DOMINANT with the PULL patterns.** This could be just a layout convenience, or it could be the coach's day structure (squat + push, hinge + pull). INFERRED; it is an open question.
- The plane blocks repeat at fixed rows: sagittal at row 7, frontal at row 46, transverse at row 53. Each pattern is meant to get all three planes, at both bilateral and unilateral. The full matrix is laid out and mostly unfilled.

## 2. The hierarchy, level by level

| Level | Values in this tab (verbatim) | Canonical | Notes |
|---|---|---|---|
| 1 Region | `LOWER BODY MECHANICS`, `UPPER BODY MECHANICS` | lower / upper | The word "MECHANICS" signals the biomechanical framing. |
| 2 Pattern | `KNEE DOMINANT`, `HIP DOMINANT`, `VERTICAL PUSH`, `MID RANGE PUSH`, `HORIZONTAL PUSH`, `VERTICAL PULL`, `HORIZONTAL PULL`, `SHOULDERS/BICEP/TRICEP` | knee_dominant, hip_dominant, vertical_push, mid_range_push, horizontal_push, vertical_pull, horizontal_pull, small-muscle isolation | `MID RANGE PUSH` (incline, landmine, viking) is **new compared with BYOP**, which files incline pressing under HORIZONTAL PUSH. There is no "MID RANGE PULL" counterpart yet. |
| 3 Laterality × Plane | `BILATERAL SAGITAL`, `UNILATERAL SAGITAL`, `BILATERAL FRONTAL`, `UNILATERAL FRONTAL`, `BILATERAL TRANSVERSE`, `UNLATERAL TRANSVERSE` (typo) | {bilateral, unilateral} × {sagittal, frontal, transverse} | In BYOP, laterality is `BILATERAL SYMMETRICAL` / `BILATERAL` / `UNILATERAL`. Plane is new in this tab. |
| 4 Sub-group | `SPECIALTY VARIATIONS`, `Leg Extensiona`, `SINGLE LEG`, `POWERLIFTING Speacialty LIFT `, `SPEED SPECIALS`, `BILATERAL LOADING`, `UNILATERAL LOADING `, `HALF KNEELING VARIATIONS` | | These are groupings inside a laterality × plane block. |
| 4′ Variable group | `FEET POSITIONING VARIATIONS`, `GET INTO THE HIP VARIATIONS - MODERATE/HARDER`, `GET OUT OF THE HIP (VARIATIONS) - MODERATE/HARDER`, `LOW/MID LOADING VARIATION`, `HIGH LOADING VARIATION`, `HAND PLACEMENT`, `FEET POSITION`, `STANCES`, `ROM VARIABLE`, `END RANGE BEHAVIOR VARIABLE`, `LOADING VARIABLES` | see §5 | These list **modifiers**, not exercises. This is the grammar. |
| 5 Exercise | 161 cells | | Within a block, ordered easy → hard and colour-coded. |

### What "plane" means to this coach (INFERRED, strongly supported)

The plane is the **direction of the force the athlete has to manage**. It is not the direction the body travels.

- `BILATERAL FRONTAL` holds ordinary sagittal squats with a sideways force added: `'Hip banded tube bands'`, `'Left or Right hip banded out '`, and `'Hold between knees Squats'` (adductor squeeze).
- `BILATERAL TRANSVERSE` holds squats with a strap that rotates the hips: `'Whats that strap rotating in'` / `'... rotating out'`.
- `UNLATERAL TRANSVERSE` under hip dominant holds `'Split stance contralateral KB swings'`. A sagittal swing becomes transverse because the off-centre load held in the opposite hand creates rotation.
- ALL ABOUT LUNGES states the same rule: `'Stance loads the FRONT TO BACK'`, `'Load position loads UP/DOWN & SIDE2SIDE'`, `'Movement orientations/guidance loads AROUND'`. In other words, stance creates the sagittal demand, load position creates the vertical and frontal demand, and movement orientation creates the transverse demand.
- One contradiction: `'lateral step up'` (C18) is filed under UNILATERAL SAGITAL even though the athlete steps sideways.

## 3. Colour = level (traffic light)

| Colour | Where | Meaning | Evidence |
|---|---|---|---|
| `93C47D` green | A8–A17 squats | **FOUNDATIONAL** | Matches BYOP `RP - BS - KNEE DOMINANT` FOUNDATIONAL block (Bodyweight, Box, Goblet, Foam-roller/Yoga-ball, Low DB, Landmine, Hex, Flipped hex). |
| `B6D7A8` light green | E8–E9, I8–I10, I30–I31, A61–A66, feet I23–I24, ROM A82, end-range A87 | **FOUNDATIONAL** | Matches BYOP (seated presses, floor press, cable chest press, kneeling push-ups, bridges, reverse hyper, pull-through, KB deadlifts). |
| `FFE599` light yellow | A18–A24, E10–E12, I11–I12, I32–I33, A67–A71, I25–I26, A83, A88 | **INTERMEDIATE / MODERATE** | Matches BYOP `MODERATE` / `INTERMIDIATE` (front rack, zercher, front, high and low bar; GHD, 45° extension, hex/DB/conventional deadlift). C8 uses the same yellow as a note box, not a level. |
| `E06666` light red | A25–A30, A33, A35, A36, E13–E15, I13–I15, I27–I28, I34, A72–A74, A76, A84–A85, A89, A94 | **ADVANCED** | Matches BYOP ADVANCED (box squat methods; wide-grip, snatch-grip and sumo deadlifts; good mornings; DB/barbell bench; standing press). |
| none / `theme0` | everything else | **not rated yet** | 99 exercises. In the JSON their level comes from a BYOP cross-reference or is INFERRED, and confidence is recorded. |

Agreement check against BYOP: **48 matches and 4 mismatches**. The mismatches are E10, E11 and E12 (Z-press DB/barbell and kneeling DB press), which this tab marks yellow while BYOP has only two tiers (FOUNDATIONAL/ADVANCED) for vertical push. That is a refinement, not a contradiction. The fourth is I11 `'Bench pushups'`, which BYOP itself lists under both FOUNDATIONAL and ADVANCED.

### What moves an exercise from green to yellow to red (INFERRED from the coloured columns)

| Pattern | Green (foundational) | Yellow (intermediate) | Red (advanced) | What drives difficulty |
|---|---|---|---|---|
| Bilateral squat (A) | bodyweight, box, plate-reach counterbalance, goblet, wall/ball-supported goblet, hex bar, low DB, landmine | double KB front rack, high zercher DB/BB, zercher, front, high-bar, low-bar | box + `touch & go`/`Deload` × none/`banded`/`reverse banded`; SSB, pinned, overhead | **Load position** (centre/low → front/zercher → back) plus **method stacking** (box, end-range behaviour, accommodating resistance). Note that low-bar is yellow even though ALL ABOUT SQUATS ranks it "HARDEST". Red is reserved for the variable-stacked "methods", not just a harder bar position. |
| Bilateral hinge (A) | glute bridge (floor/feet-elevated), reverse hyper, cable pull-through, single/double KB deadlift | GHD, 45° hip extension, hex bar deadlift, DB deadlift, shoulder-width barbell deadlift | wide-grip and snatch-grip deadlift, barbell good morning, sumo | **Load magnitude/implement** (KB → hex/DB → barbell), then **ROM increased through grip width**, then **bar-on-back hinge**. |
| Vertical push (E) | seated DB, seated barbell | DB Z-press, barbell Z-press, kneeling DB | kneeling barbell, standing DB, standing barbell | **Base of support**: seated with back support → seated unsupported → tall kneeling → standing. Within a base, a barbell is harder than DBs. |
| Horizontal push (I) | DB floor press, standing cable press, kneeling push-up | bench push-up, push-up | diamond push-up, DB bench, barbell bench | **ROM** (floor-limited → full) and **free-weight stability on a bench**. |
| Unilateral horizontal push (I29) | alternating DB floor press, alternating cable press | kneeling and full push-up with one hand higher | alternating DB bench | Same as above, plus asymmetry. |
| Feet position (I22) | feet on bench, feet on wall | feet on raisers/plates, feet on floor | feet in air (hollow, bent or straight legs) | **How much of the trunk position is provided** (blocked → athlete-managed → no base). |
| ROM variable (A81) | Elevated | Floor | Deficit, `*RDL` | Shorter ROM → standard → longer / defined by end range. |
| End-range behaviour (A86) | Dead stop | Touch & go | `*RDL` | Full reset → stretch-shortening rebound → continuous tension, eccentric first. |

Rule of thumb for the generator (INFERRED): **difficulty = base pattern difficulty + Σ(difficulty of each stacked variable)**. Things that make an exercise harder are: less external stability, longer ROM, higher or more posterior load, a heavier-capable implement, less rest at end range, and accommodating resistance. Each colour step corresponds to one or two of these moving up.

## 4. Videos and links (OBSERVED)

- 59 hyperlinks: **56 YouTube** (youtu.be or shorts) and **3 internal links** in the xlsx export (A7 → `ALL ABOUT SQUATS`, C8 → `(NOT DONE) ALL ABOUT LUNGES`, A80 → `(NOT DONE) ALL ABOUT BALLISTICS`).
- The live sheet uses rich-text partial links. Only the substrings "ALL ABOUT SQUATS" and "ALL ABOUT LUNGES" are linked. A80 has two links: chars 14–29 go to BALLISTICS & PLYOS and chars 34+ go to ALL ABOUT LUNGES. The export dropped the second one.
- 53 of 161 exercises have a demo video:
  - Bilateral squat: 19/23. Missing: A26, A27, A28, A30.
  - Specialty: 4/4. Leg extensions: 3/3.
  - Lunges and single-leg: 11/11. Cossack: 1/1.
  - Hinges: 12/14. Missing: A62, A65.
  - Sumo: 1/1. Swings: 2/2.
  - Frontal/transverse squats, staggered deadlifts and all upper-body exercises (E, G, I, K): 0.
- 3 videos illustrate **variables**, not exercises: B83 `Floor`, B84 `Deficit`, B88 `Touch & go`. This tells us the coach thinks of these variables as teachable, stand-alone concepts.
- Each video URL is stored on its exercise record (`video_url`, `video_cell`). The full list is in `hyperlinks[]`.

## 5. The variable-modifier system (exercise = base pattern + variables)

The coach did not list every combination. He listed **base exercises** and then, separately, the **variables** that can be stacked on them. Here is every variable block in the tab.

### 5.1 `FEET POSITIONING VARIATIONS` (C9 → C10–C18): stance geometry for unilateral knee-dominant work

`front foot elevated lunge (FFE)`, `Stationary lunge`, `reverse lunge`, `rear foot against wall lunge`, `Rear foot elevated lunge (RFE)`, `Front and Rear foot elevated lunge`, `forward lunge`, `forward step up`, `lateral step up`.
This changes the **ROM and stance** of a lunge: front-foot elevation adds front-hip and knee flexion, rear-foot elevation shifts load onto the front leg, and doing both gives the maximum ROM. It also changes whether the movement is static (stationary), decelerative (forward) or propulsive (reverse, step-up). The ALL ABOUT LUNGES `PROPULSION` list (`FFE`, `FLOOR`, `RFE`) is the same idea.

### 5.2 `GET INTO THE HIP` / `GET OUT OF THE HIP`: contralateral vs ipsilateral loading

| Cell | Header (verbatim) | Value | Difficulty |
|---|---|---|---|
| C20 | `GET INTO THE HIP VARIATIONS - MODERATE` | `Contralateral loading ` | MODERATE |
| C22 | `GET OUT OF THE HIP - MODERATE` | `Ipsilateral loading ` | MODERATE |
| C24 | `GET INTO THE HIP VARIATIONS - HARDER` | `Front racked db or kb contralateral loading` | HARDER |
| C26 | `GET OUT OF THE HIP VARIATIONS - HARDER` | `Front racked db or kb Ipsilateral loading` | HARDER |
| C72 | `GET INTO THE HIP VARIATIONS` (under `UNILATERAL LOADING `, hip dominant) | `Contralateral loading ` | n/a |
| C74 | `GET OUT OF THE HIP` (hip dominant) | `Ipsilateral loading ` | n/a |
| G83 | `STANCES` | `Split stance ALWAYS contralateral` | rule |
| G84 / G85 | `STANCES` | `Half kneeling same side leg up` / `Half kneeling opposite side leg up` | n/a |

**Biomechanics (INFERRED; in line with Pat Davidson's "into/out of the hip" language):**

- **Contralateral** means the load is in the hand opposite the front (stance) leg. The load sits on the far side of the stance hip, which **increases the adduction and internal-rotation moment** on that hip. The pelvis is pulled *into* the stance hip, which then has to accept and control that position (glute max, glute med/min, adductors) and push out of it. This matches gait, where the opposite arm swings with the leg. The coach also writes `'Split stance ALWAYS contralateral'` for rows, which is the gait rule.
- **Ipsilateral** means the load is on the same side as the stance leg. The centre of mass shifts over or outside the stance foot, which **reduces the adduction moment and biases the hip *out* (toward abduction and external rotation)**. Demand moves to the trunk on the opposite side (QL, obliques) to keep the trunk upright.
- **Load height scales difficulty.** Suitcase (hanging) is `MODERATE`. Front-racked is `HARDER`, because the lever on the trunk is longer and the centre of mass is higher. This is ALL ABOUT LUNGES' `'Load position loads UP/DOWN & SIDE2SIDE'`.
- The ballistics tab uses the same vocabulary for half-kneeling medball scoops: `'Half kneeling Right Facing LEFT LEG UP rotational scoop'` → `'INTO THE LEFT LEG/HIP'`; `'Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop'` → `'OUT OF THE RIGHT LEG/HIP'`; `'F/B Staggered stance medball cross throw down'` → `'TRANSVERSE INTO THE HIP'`; `'Reverse lunge inside floor slam'` → `'UNILATERAL OUT OF HIP'`. So "into/out of the hip" is a **cross-library concept** that connects resistance, ballistics and core.
- Program tabs use it as a modifier: `'ffe lunges - contralateral loading'`, `'Front foot elevated ipsilateral lunge'`, `'db contralateral step up'`, `'Lateral Step ups IPSILATERAL loading'`, `'Staggered stance DB dl - Medial pressure - contralateral loading'`, `'Max speed banded lat pull downs half kneeling ipsilateral'`.

### 5.3 `LOW/MID LOADING VARIATION` and `HIGH LOADING VARIATION` (C27–C36): load position for lunges

- LOW/MID: `Plate reach `, `Goblet loading`, `Double kb or Db`.
- HIGH: `Barbell high zercher racked`, `Barbell zercher racked`, `Barbell Front squat racked`, `Barbell back squat racked`, `Barbell overhead `.

The HIGH list follows the same order as the squat loading continuum in ALL ABOUT SQUATS: `Hex Bar Squat` EASIEST → `Goblet` EASIER → `High Zercher` EASY → `Zercher` MODERATE → `Front Squat/ SSB Bar` HARD → `High Bar` HARDER → `Low Bar` HARDEST → `Overhead` VERY HARD. That cheat sheet defines the scale in its own words: `'**THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN'`. **The load-position ladder is shared between bilateral and unilateral knee-dominant patterns.** ALL ABOUT LUNGES extends it with `Contralateral/Ipsilateral/Double` × `Suitcase / on shoulder / High zercher`, plus `Zercher barbell`, `Front racked barbell` and `Back racked barbell`.

### 5.4 `HAND PLACEMENT` (I16 → I17–I21)

`supinated`, `neutral`, `pronated`, `wide grip`, `narrow grip`. These are listed under horizontal push, but the same variable produces most of the upper-body entries elsewhere:

- Lat pulldowns: wide, supinated, pronated, wide MAG, rope, close.
- Assisted pull-ups: close, pronated, supinated.
- Barbell rows: supinated vs pronated.
- Curls: hammer, supinated, pronated × DB, EZ, barbell.
- Triceps pushdowns: pronated, supinated, rope-neutral, V-grip.
- Deadlifts: shoulder-width, wide, snatch. Here grip width works as a ROM lever.

### 5.5 `FEET POSITION` (I22 → I23–I28), colour-graded

Green: `feet on bench`, `feet on wall`. Yellow: `feet on raisers or plates`, `feet on floor`. Red: `feet in air (hollow bent legs)`, `feet in air (hollow legs str8)`.
G8 `'Incline DB bench press feet on wall'` shows this modifier stacked on a base exercise. The vertical-pull list uses the same idea with leg position (`feet behind you` → `feet in front of you` → `knees up` → `L sit`), so it is effectively a general **"trunk-demand" variable**.

### 5.6 `STANCES` (G82 → G83–G85)

`Split stance ALWAYS contralateral`, `Half kneeling same side leg up`, `Half kneeling opposite side leg up`. These sit under horizontal pull, and they are what make single-arm rows athletic. The empty `HALF KNEELING VARIATIONS` (E16) shows the coach meant to do the same for pressing.

### 5.7 `ROM VARIABLE`, `END RANGE BEHAVIOR VARIABLE` and `LOADING VARIABLES` (A81–A94, under HIP DOMINANT)

| Variable | Green | Yellow | Red | No colour |
|---|---|---|---|---|
| ROM | `Elevated` | `Floor` (video) | `Deficit` (video), `*RDL` | |
| End range | `Dead stop` | `Touch & go` (video) | `*RDL` | |
| Loading | | | `*RDL` | `WEIGHT RELEASERS`, `CHAINS`, `BANDS` |

- These apply to deadlifts, and the coach also uses them elsewhere:
  - Box squats: `touch & go` vs `Deload`, with `banded` / `reverse banded`.
  - `Pinned Squats`.
  - BYOP's `Deficit Push-ups`.
  - Program tabs: `'DB alternating Deficit Reverse lunges from plate'`, `'HEAVY DEFICIT DEADLIFT'`, `'2x 5 heavy touch and go cleans'`.
- `*RDL` appears as the last, red item in **all three** lists. My best reading (INFERRED) is that the RDL is the extreme setting of each variable: ROM set by hamstring end range instead of the floor, never touching down (no dead stop or touch), and loaded from the top so the eccentric comes first. This needs the coach's confirmation.
- The ALL ABOUT SQUATS cheat sheet explains the loading variables:
  - `BOTTOM BANDED`: "Bands are designed for speed/velocity", about 50%, for "SOMEBODY THAT CAN'T YIELD DOWN INTO A SQUAT CORRECTLY".
  - `REVERSE BANDED`: "ACCELERATES MAX PROPULSION", for "SOMEBODY THAT IS SLOW ON THE WAY UP".
  - `BOTTOM CHAINS`: "Chains are designed for magnitude influence, loading", "INTENSIONALLY SLOW YOU DOWN", about 70%.
  - `WEIGHT RELEASERS`: "I HAVE NO IDEA" in all three columns. This is still unresolved.

### 5.8 Implicit variables visible in the exercise names

- **Implement:** BW, DB, KB, barbell, hex bar, flipped hex, SSB, EZ bar, landmine/viking handle, cable, machine, band, rings/TRX/Smith, plate, foam roller/Swiss ball.
- **Base of support / body position:** seated, Z (floor), tall kneeling, half kneeling, standing, supine floor, supine bench, incline bench, prone chest-supported, bent-over hinge, plank, kneeling plank, hanging.
- **Laterality detail:** bilateral, alternating ("one up/one down", "one forward/one back"), offset ("one hand higher"), single-arm, coach tags `(uni)`, `(bi)`, `(bi or uni)`.
- **Body angle:** for inverted rows, `Incline` vs `Paralell` "reverse pushup". The coach frames the inverted row as a mirror of the push-up.
- **Intent:** `SPEED SPECIALS` (swings), and BYOP's `'Touch and Go fast'`.
- **Template wildcard:** `Box *ANY Squat …`. The `*ANY` means "use any squat loading from above", so the coach is already writing **parametrised exercises**.

## 6. The generative grammar

### 6.1 Formal spec (INFERRED from §2–§5; slot values are the coach's)

```
EXERCISE := REGION · PATTERN · LATERALITY · PLANE · STANCE/BASE · IMPLEMENT · LOAD_POSITION · LOAD_LATERALITY
            · HAND_PLACEMENT · FEET/BODY_POSITION · ROM · END_RANGE · ACCOMMODATING · PLANE_PERTURBATION · INTENT

REGION        ∈ {lower, upper}
PATTERN       ∈ {knee_dominant(squat|lunge|step-up|single-leg squat|knee-ext), hip_dominant(bridge|hip-ext|hinge|deadlift|swing),
                 vertical_push, mid_range_push, horizontal_push, vertical_pull, horizontal_pull,
                 [small-muscle] shoulders(lat raise|front raise|upright row|reverse fly|face pull|Y|T), biceps(curl), triceps(kickback|pushdown|lying ext|overhead ext)}
LATERALITY    ∈ {bilateral, unilateral (split/staggered/single-leg/single-arm), alternating, offset}
PLANE         ∈ {sagittal, frontal, transverse}   -- the force vector the athlete must manage
STANCE/BASE   ∈ {bilateral symmetrical, staggered, split (FFE|RFE|both|wall|floor), single leg, lateral/cossack, sumo,
                 seated-supported, seated-floor(Z), tall kneeling, half kneeling (same|opposite side), standing,
                 supine floor, supine bench, incline bench, prone chest-supported, bent-over, plank, kneeling plank, hanging}
IMPLEMENT     ∈ {BW, DB, 2xDB, KB, 2xKB, barbell, hex, flipped hex, SSB, EZ, landmine, viking handle, cable, machine, band, rings/TRX/Smith, plate}
LOAD_POSITION ∈ ladder: {none, counterbalance(plate reach), sides/low/suitcase, goblet, front rack, high zercher, zercher, back high bar, back low bar, overhead}
LOAD_LATERALITY ∈ {bilateral, contralateral ("INTO the hip"), ipsilateral ("OUT of the hip")}  x height {suitcase=MODERATE, front-rack=HARDER}
HAND_PLACEMENT ∈ {supinated, neutral, pronated, wide, narrow, snatch, alternating, one-hand-higher}
FEET/BODY_POS ∈ {feet on bench, feet on wall, feet on raisers, feet on floor, hollow bent, hollow straight; feet behind, feet in front, knees up, L-sit; incline vs parallel body}
ROM           ∈ {elevated, floor, deficit, RDL(end-range), box, pins}
END_RANGE     ∈ {dead stop, touch & go, deload (box), RDL(continuous)}
ACCOMMODATING ∈ {none, bands, reverse bands, chains, weight releasers}
PLANE_PERTURBATION ∈ {none, lateral band at hips, one hip banded out, adduction squeeze, rotational strap in/out}
INTENT        ∈ {strength/hypertrophy (default), SPEED (ballistic)}
```

### 6.2 Constraints a generator needs (INFERRED from where each block sits in the tab)

- `LOAD_LATERALITY ≠ bilateral` requires a unilateral stance (split, staggered, single leg, half kneeling) and a single implement or two unequal ones. The rule `Split stance ⇒ contralateral` applies to pulls (G83).
- `FEET POSITION` applies only to supine or inclined pressing. The leg-position version applies to hanging pulls.
- `ROM ∈ {elevated, deficit, RDL}` and `END_RANGE ∈ {dead stop, touch & go, RDL}` apply to hinges and deadlifts. `box`, `pins` and `deload` apply to squats. `deficit` also applies to lunges and push-ups.
- `ACCOMMODATING ∈ {bands, chains, reverse bands}` needs a barbell or hex bar and an advanced level. Bands go with speed intent at about 50%; chains go with stiffness at about 70% (ALL ABOUT SQUATS).
- `LOAD_POSITION overhead` caps load (load_ceiling moderate) and raises skill to high.
- Small-muscle patterns (column K) ignore plane. Their variety comes from grip × implement × shoulder position.
- Level gate: the green, yellow and red variable settings must not push the summed difficulty past the client's level.

### 6.3 Re-deriving the tab from the grammar

| Cell | Raw | Derivation |
|---|---|---|
| A8 | `Air squat` | squat · bilateral · sagittal · BW · load none · ROM full |
| A11 | `goblet squat` | squat · … · DB/KB · goblet |
| A13 | `Hex bar squats` | squat · … · hex · sides |
| A22 | `front squat` | squat · … · barbell · front rack |
| A24 | `low bar back squat` | squat · … · barbell · back low bar |
| A27 | `Box *ANY Squat touch & go reverse banded` | squat · ANY implement/position · ROM box · END touch & go · ACCOM reverse bands |
| A30 | `Box *ANY Squat Deload reverse banded` | squat · ANY · ROM box · END deload · ACCOM reverse bands |
| A35 | `Pinned Squats ` | squat · barbell · ROM pins · END dead stop |
| A47 | `Hip banded tube bands` | squat · bilateral · **frontal** · PERTURB lateral band at hips |
| A54 | `Whats that strap rotating in` | squat · bilateral · **transverse** · PERTURB strap internal rotation |
| C14 | `Rear foot elevated lunge (RFE)` | lunge · unilateral · sagittal · STANCE split RFE |
| C15 + C24 | (program tab) `RFE & FFE contralateral lunge double DB front rack loaded` | lunge · split FFE+RFE · LOAD_LAT contralateral · front rack · 2xDB |
| C17 + C22 | (program) `Lateral Step ups IPSILATERAL loading` | step-up · lateral · ipsilateral |
| A62 | `Elevated feet on bench glute bridge` | bridge · FEET on bench (ROM ↑) |
| A69 | `HexBar Deadlift` | deadlift · hex · sides · ROM floor · END dead stop (default) |
| A73 | `Snatch grip barbell deadlift` | deadlift · barbell · HAND snatch (ROM ↑) |
| A76 | `Summo Deadlift` | deadlift · STANCE sumo |
| C63 + C72 | (BASEBALL) `Staggered stance DB dl - Medial pressure - contralateral loading` | deadlift · staggered · 1xDB contralateral ("into the hip") |
| C77 | `Split stance contralateral KB swings` | hinge (ballistic) · split · contralateral single-arm · **transverse** · INTENT speed |
| E10 | `DB Z press on floor ` | vertical push · BASE seated-floor (Z) · DB |
| E15 | `Standing Barbell press` | vertical push · BASE standing · barbell |
| G8 | `Incline DB bench press feet on wall` | mid-range push · incline bench · DB · FEET wall |
| I30 | `One up/one down Alternating DB floor press` | horizontal push · alternating · floor (ROM) · 2xDB |
| I33 | `Pushups one hand higher` | push-up · offset hands |
| E62 | `Lat pull downs supinated grip` | vertical pull · seated · cable · HAND supinated |
| E74 | `Strict pull ups L sit` | vertical pull · hanging · BW · BODY L-sit |
| G65 | `Paralell reverse pushup (rings/trx/…)` | horizontal pull · inverted · BODY parallel |
| G79 | `Half kneeling cable row` | horizontal pull · single arm · STANCE half kneeling (same/opposite) |
| K29 | `Barbell supinated curls` | biceps · barbell · HAND supinated |
| K42 | `Db overhead tricep ext (bi or uni)` | triceps · overhead shoulder position · DB · LAT bi or uni |

### 6.4 Size of the space the grammar opens (INFERRED counts, valid combinations only)

- **Lunges:** 9 feet-positioning bases × (4 into/out options + 3 low/mid + 5 high = 12 loadings) ≈ **108** exercises. The sheet lists 9 + 12 cells.
- **Bilateral squats:** 8 load positions (ALL ABOUT SQUATS) × ROM {free, box, pins} × end range {touch & go, deload/dead stop} × accommodating {none, bands, reverse bands, chains}. After removing invalid combinations this is roughly 8 + 8×2×4 + 8 ≈ **80**. The sheet lists 23 + 4.
- **Deadlifts:** implements {1 KB, 2 KB, DB, hex, barbell} × grip {shoulder, wide, snatch; barbell only} × ROM {elevated, floor, deficit, RDL} × end range {dead stop, touch & go, RDL} × loading {none, bands, chains, weight releasers; barbell/hex only} × stance {bilateral, staggered, sumo} gives **several hundred**. The sheet lists 14 + 3 + 1.
- **Horizontal push:** implement {DB, barbell, cable, BW} × base {floor, bench, standing, kneeling plank, plank} × hand placement (5) × feet position (6) × laterality {bilateral, alternating, offset} is again several hundred valid options.

**Takeaway:** the coach's library works as a seed set plus a rule set. A generator should store base exercises and variable tables, not a flat list. It should also check every combination it produces against a video or approved list, because not every combination is coachable.

### 6.5 Pseudo-code for selecting a resistance slot

```
pick(pattern, laterality, plane, level, equipment, goal, history):
    pool = bases[pattern][laterality][plane] filtered by equipment and base_level <= level
    base = choose(pool, avoid=history[-N weeks], prefer=goal_bias)       # replaces RANDBETWEEN
    budget = level_budget[level] - base.difficulty
    for var in applicable_variables(base):                                # FEET POS, HAND, STANCE, LOAD_LAT, ROM, END_RANGE, ACCOM...
        v = choose(var.values where v.difficulty <= budget and v fits goal/sport)
        budget -= v.difficulty
    return render_name(base, chosen_vars), sets_reps(pattern, muscle_size, goal, level)
```

Sport flavour (INFERRED, consistent with the coach's brief): basketball and MMA get more unilateral, frontal and transverse slots, into/out-of-hip loading, and `SPEED SPECIALS` with bands/reverse bands. Powerlifting-style clients get `POWERLIFTING Speacialty LIFT`, end-range and ROM variables, and chains. Boxing and karate get transverse anti-rotation work through STANCES (half kneeling, split stance contralateral) rather than plyos.

## 7. Muscle size and rep logic as the tab encodes it

- Columns A–I are compound **patterns** (quads, glutes, hamstrings, back, chest = "big"). Column K is **small-muscle isolation**. In the JSON this gives 111 big, 34 small and 16 mixed (vertical, mid-range push and diamond push-up).
- Leg extensions (A38 `Leg Extensiona` sub-group) are a big muscle trained in single-joint isolation. For rep selection they behave like a small-muscle exercise (10–20 reps, or `MYO SET`). INFERRED.
- The rep guesses in the JSON use the coach's BYOP rep vocabulary (`4 to 6`, `6 to 8`, `8 to 12`, `10 to 15`, `15`, `20`, `MYO SET`) and ALL ABOUT SQUATS:
  - Hypertrophy: 3–4×8–15 at about 1 RIR.
  - Strength: 4–8×2–5.
  - Myo set: `15/5/5/5/5/5`.
- Barbell compounds get 3–8 reps. DB/KB and machine compounds get 6–15. Bodyweight foundational work and isolation get 10–20+. Speed and box methods get 2–5 fast reps.

## 8. TEST FORMULA (A110–A117): the generator prototype

| Cell | Formula | Cached value at export | Notes |
|---|---|---|---|
| A112 | `=INDEX(A8:A33,RANDBETWEEN(1,ROWS(A8:A33)),1)` (array) | `high zercher DB Squat` | Pool of 26 rows: 23 squats, blank **A31**, header **A32 `SPECIALTY VARIATIONS`**, and A33. About 7.7% of draws return garbage. |
| A114 | same formula as A112 | `''` (empty) | **It actually returned blank A31.** That is the bug in action. A second, independent draw can also repeat A112. |
| A117 | `=INDEX(A13:A36,RANDBETWEEN(1,ROWS(A13:A36)),1)` | `Box *ANY Squat Deload reverse banded` | Skips the 5 easiest entries (A8–A12), so it acts as a crude "not beginner" window. It still includes A31 and A32. |

What it tells us (INFERRED): the coach wants slot filling done automatically. A slot is "pick a knee-dominant bilateral-sagittal exercise". A level is approximated by a row window. Problems with the current version:

- It can return blanks and headers.
- It doesn't filter by colour, level or equipment.
- RANDBETWEEN is volatile and redraws on every edit, so a published program would keep changing.
- It doesn't de-duplicate or keep history.

A real generator should use tagged records (this JSON) with seeded selection.

## 9. Data validations: what they are and aren't

- This tab has **no dropdowns**. The xlsx has no `<dataValidations>`, and the live API shows no `dataValidation` on A1:AA1079. The "59" is the hyperlink count.
- Dropdowns exist in **BYOP program tabs**. Each exercise slot is a `list` validation pointing at one MASTER EXERCISE LIBRARY category column. Examples: `'MASTER EXERCISE LIBRARY'!$AI$7:$AI$122` (bilateral knee dominant), `$AL$7:$AL$42` (unilateral knee dominant), `$AN$7:$AN$122` (hip dominant), `$AA$7:$AA$122` (vertical push), `$AD$7:$AD$162` (horizontal push), `$U$7:$U$122` (vertical pull), `$X$7:$X$162` (horizontal pull). Sets, reps and effort come from `$AV`/`$AW`/`$AX`.
- In practice: **BYOP = slot → category column (dropdown); this tab = the finer taxonomy that those category columns should eventually come from.** Once finished, each `pattern × laterality × plane × level` block here would become one dropdown source or one generator pool.

## 10. Cross-classification conflicts with BYOP (to reconcile)

- **Incline pressing:** BYOP puts it under HORIZONTAL PUSH (ADVANCED). This tab puts it under MID RANGE PUSH.
- **`Kneeling Landmine Press`:** BYOP has it in `RP - UL - VERTICAL PUSH` (unilateral). This tab has it in MID RANGE PUSH / BILATERAL SAGITAL (G14).
- **Face pulls:** BYOP has `KB Face Pulls ` under VERTICAL PULL FOUNDATIONAL. This tab has them under SHOULDERS (K19).
- **Vertical push tiers:** BYOP has 2 (FOUNDATIONAL/ADVANCED). This tab has 3.
- **`Bench Push ups`:** listed in both BYOP FOUNDATIONAL and ADVANCED. This tab marks it yellow.
- **Staggered-stance deadlifts:** BYOP calls them `RP - UL - HIP DOMINANT` FOUNDATIONAL. This tab files them under UNILATERAL SAGITAL > `BILATERAL LOADING`, with no colour.
- **Duplicates:** BYOP lists `Standing DB Press` twice (AA50/AA51), where the second is probably meant to be barbell. This tab lists `goblet squat` (A11) and `Goblet squat` (A17) with different videos.

## 11. What is unfinished (OBSERVED)

1. Tab status: `(NOT DONE)` in the tab name, and A1 `UNDER CONSTRUCTION`.
2. **Empty plane blocks:**
   - `BILATERAL FRONTAL` for E46, G46 and I46 (vertical, mid-range and horizontal push).
   - `BILATERAL TRANSVERSE` for E53, G53 and I53.
   - `UNLATERAL TRANSVERSE` C53 (knee dominant).
   - Hip dominant (bilateral) and both pulls have no frontal or transverse rows at all.
   - Unilateral pushes have no frontal or transverse blocks.
3. `HALF KNEELING VARIATIONS` (E16) is a header with no items.
4. **Levels missing** for 99 of 161 exercises: all of C (lunges and single leg), G (mid-range push), K (isolation), E61–E75 (vertical pull), G61–G79 (horizontal pull), A34 (sissy), A39–A41 (leg extensions), A47–A55 (frontal/transverse squats), A78–A79 (swings) and C62–C77. Modifier colours exist only for FEET POSITION, ROM and END RANGE.
5. **Videos missing:** 108 of 161 exercises have none. Upper-body VIDEO columns F, H, J and L are empty.
6. **Patterns or exercises in BYOP but not here:**
   - Hamstring isolation: `LEG CURLS`, Nordic curl, stiff-leg DL, DB hamstring curls, swiss ball curls.
   - Glutes: hip thrusts (barbell, machine, sandbag, DB), single-leg glute bridges.
   - `CALVES`.
   - Pushing: dips, flies, pike push-ups / handstand push-ups, push press / push jerk, thrusters.
   - Knee-dominant machines: hack squat, leg press, pendulum squat.
   - Pulling: seal rows, renegade rows, unilateral lat pulldowns.
   - `CARRY` / `DRAGS`.
   - There is no "MID RANGE PULL" to match MID RANGE PUSH.
7. Semantics still open: `WEIGHT RELEASERS` (coach: "I HAVE NO IDEA" in ALL ABOUT SQUATS), `*RDL`, and `HIGH LOADING VARIATION` (does "high" mean heavy or high position?).
8. TEST FORMULA is a prototype with the bugs described in §8.
9. Typos to keep verbatim but normalise in code: `SAGITAL`, `UNLATERAL`, `UNDERSTNADING`, `Fliped`, `Leg Extensiona`, `Cosak`, `Speacialty`, `Summo`, `suported`, `Paralell`, `extentions`, and probably `Sealed` and `Kong`. Several cells have trailing spaces (`'Pinned Squats '`, `'Contralateral loading '`, `'Barbell overhead '`, …).

## 12. How the JSON is organized

- `exercises[]` (161): one record per exercise cell.
  - Required fields: `name_raw`, `name_clean`, `source`, `cell`, `column_header_rows` (literal rows 1–6), `section_path` (the effective header chain with cells and colours), `family`, `category` (verbatim header chain), `category_canonical`, `sub_pattern`, `laterality`, `plane`, `level` (`colour`, `normalized`, `basis` = OBSERVED colour / BYOP cross-ref / INFERRED, `confidence`), `level_block_colour`, `primary_muscles`, `secondary_muscles`, `muscle_size_class`, `equipment`, `no_equipment_ok`, `load_ceiling`, `skill_demand`, `impact_or_plyo_intensity`, `typical_rep_range_guess`, `inferred_fields`, `notes`.
  - Extra fields: `joint_action`, `equipment_detail`, `grammar` (the variable decomposition), `video_url`, `video_cell`, `byop_crossref[]`, `duplicate_of`.
- `variable_modifiers[]` (39): the group header, the canonical variable and value, `applies_to`, the difficulty label or colour, the effect (INFERRED), and any video.
- `section_headers[]`, `note_cells[]`, `hyperlinks[]` (all 59), `test_formulas[]`, and `_meta` (counts, colour legend, data-validation note).
