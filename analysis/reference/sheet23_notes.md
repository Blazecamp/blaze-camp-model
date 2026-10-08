# MASTER_MODEL › `Sheet23` — decoded

Source: workbook **"BLAZE CAMP MASTER MODEL"** (MASTER_MODEL), tab **`Sheet23`** (unnamed default tab).
Companion data file: `analysis/reference/sheet23.json` — **313 exercise records**, one per non-empty exercise cell (296 unique names).
Cross-referenced against: workbook **"BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"** (BYOP), tab **`MASTER EXERCISE LIBRARY`**.

Conventions: **OBSERVED** = read directly from a cell / format. **INFERRED** = analyst interpretation. Coach labels are quoted verbatim (typos kept: `'TRIPPLE'`, `'SAGITAL'`, `'INTERMIDIATE'`, `'FOUNDATINONAL'`, `'Harmstring'`, `'Coppenhaggen'`, `'Sesaw'`, `'Stricted'`, `'Glidder'`).

---

## 0. TL;DR

* **What it is (INFERRED, strong evidence):** Sheet23 is the **flat precursor / planning menu of the exercise taxonomy** — one column per *LEVEL × FAMILY × PATTERN* bucket, single header row, plain lists. The BYOP `MASTER EXERCISE LIBRARY` is the later, expanded, dropdown-ready version of the same lists: 21 of its "ZONE" header cells literally contain Sheet23's header strings, the exercise lists are copied in the same order with the same typos, and BYOP is a superset: 33 BYOP names are absent from Sheet23 — about 22 genuinely new exercises (push press/jerk, thrusters, KB swing, curtsy lunge, cable/machine flies, …) and about 11 renames, split-outs or variants of Sheet23 items (e.g. `'Deficit Push-ups'`, `'Box. Any Squat Touch and Go fast'`, push-downs + overhead cable extension replacing the Zone-tagged tricep items). Only 3 Sheet23 items are truly absent from BYOP (`'MACH DRILLS'`, `'Acceleration starts'`, `'Broad Jumps'`) plus 3 loose-list jumps with only near matches. Nothing in either workbook references Sheet23 (no dropdowns, links or formulas), while the BYOP programs' dropdowns point at `MASTER EXERCISE LIBRARY` ranges.
* **Header grammar (OBSERVED):** `LEVEL - FAMILY - [SYMMETRY] - PATTERN`, where FAMILY ∈ `AP` (Athletic Patterns), `CT` (Core Thorax), `CP` (Core Pelvis), `RP` (Resistance Patterns); SYMMETRY ∈ `BS` (Bilateral Symmetrical), `UL` (Unilateral); LEVEL ∈ `FOUNDATIONAL` / `INTERMEDIATE` / `ADVANCED` (with typo variants), sometimes missing, sometimes placed after the pattern.
* **"ZONE" has four different meanings** in this coach's sheets (see §3): (1) the green/yellow/red row band in Sheet23 column A — positional, *unresolved*; (2) the **plyo zone key** at C33:D36 — `ZONE 1 'Receive pause/creat'`, `ZONE 2 'Receive/create'`, `ZONE 3 'Repeat receive create'` — a landing → single-response → repeated-response ladder; (3) "Zone 1/2/3" inside isolation exercise names — most likely **arm/limb position** (low → mid → overhead); (4) the BYOP row label `'ZONE'` (A3) — simply the **difficulty-tier row** (`EASY` / `MODERATE` / `ADVANCED` / `HARD` / `ANY`).
* **SSC speed footer (OBSERVED):** `*FASTEST SSC*` (squirrel jumps) → `*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)` (MACH drills, acceleration starts) → `*SPRINT*` (max velocity running) — a speed-session ordering from shortest ground contact to sprinting.
* **Cell M3 is corrupted:** it holds the date `2005-05-10` — Google Sheets auto-converted the text **"5-10-5"** (pro-agility shuttle). The corruption was copied into BYOP (L92, N10).

---

## 1. Physical layout (OBSERVED)

| Item | Value |
|---|---|
| Used range | A1:AR999 (data actually in A1:AR52) |
| Non-empty cells | 394 |
| Frozen | row 1 (`freeze_panes = A2`) |
| Merged cells | none |
| Data validations / dropdowns | none |
| Hyperlinks / comments / conditional formats | none |
| Hidden rows / columns | none |
| Header row | **row 1 only**, all bold, no fill |
| Fills | Only column A (`ZONE`) is coloured: rows 2-9 `B6D7A8` (light green, `ZONE 1`), rows 10-16 `FFF2CC` (light yellow, `ZONE 2`), rows 17-28 `F4CCCC` (light red, `ZONE 3`). One exercise cell has a fill: AP10 `'Tate Press'` `bg=theme0` (theme white — effectively no colour). |
| Regions | (a) main grid B1:AR21; (b) loose list G31:G35; (c) plyo zone key D33 + C34:D36; (d) SSC speed footer B43:B52 |
| Empty column | S (`'ADVANCED - CP - TRANSVERSE'`) has a header and no exercises |

Because there is only **one** header row, every record's `column_header_rows` contains only `row1`. To give downstream code the 6-row context it expects, each record also carries `byop_equivalent_column` + `byop_equivalent_header_rows` (rows 1-6 of the matching BYOP library column: row1 group, row2 `'FILL HERE'`, row3 `ZONE`, row4 `PATTERN`, row5 sub-pattern/laterality/plane, row6 `PURPOSE`).

---

## 2. The header system — `LEVEL - FAMILY - [SYMMETRY] - PATTERN`

### 2.1 Codes (OBSERVED codes; meanings confirmed by BYOP row 4 `PATTERN` / row 5)

| Code | Meaning | BYOP confirmation |
|---|---|---|
| `AP` | **Athletic Patterns** | BYOP row 4 = `'ATHLETIC'` for every AP twin column |
| `CT` | **Core Thorax** | BYOP group `'CORE THORAX'`, row 4 `'CONTROL'`, row 5 `'CORE THORAX SAGITAL/FRONTAL/TRANSVERSE'` |
| `CP` | **Core Pelvis** | BYOP group `'CORE PELVIS'`, row 4 `'CONTROL'` |
| `RP` | **Resistance Patterns** | BYOP row 4 = `'RESISTANCE'` |
| `BS` | **Bilateral Symmetrical** | BYOP row 5 `'BILATERAL SYMMETRICAL'` (upper body) / `'BILATERAL'` (legs, shoulders) |
| `UL` | **Unilateral** | BYOP row 5 `'UNILATERAL'` |
| `COD` | Change of Direction | BYOP group `'CHANGE OF DIRECTION'` |
| `TRIPPLE EXT` | Triple Extension (hip-knee-ankle) | BYOP group `'TRIPPLE EXTENSION'` |

Families map to the generator enum as AP → `ATHLETIC`, CT/CP → `CONTROL`, RP → `RESISTANCE`. Sheet23 contains **no CARDIO, FUNCTIONAL, CARRY or DRAG** buckets — those exist only in BYOP.

### 2.2 Grammar quirks (OBSERVED)

* Word order varies: `'FOUNDATIONAL - RP - BS - VERTICAL PULL'` (level first) vs `'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH'` (level third) vs `'RP-BS-KNEE DOMINANT-INTERMIDIATE'` (level last) vs `'RP - BS - ADVANCED HORIZONTAL PUSH'` (level glued to pattern).
* Level missing on 14 headers: `'AP - THROWING'`, `'RP - BS - HORIZONTAL PULL'`, `'RP - BS - KNEE DOMINANT'`, `'RP - BS - HIP DOMINANT'`, all six `RP - UL - …`, and the four isolation headers (`'RP - BICEP'`, `'RP - TRICEP'`, `'RP -SHOULDERS'`, `'RP - CALVES'`).
  * For the three BS lists with no level (AA, AC, AF) the level is INFERRED **foundational**: each precedes its `INTERMIDIATE`/`ADVANCED` siblings, and BYOP puts the same lists under a `'FOUNDATIONAL'` block label (X8, AI8, AN8) or `'EASY'` (X3).
  * UL, isolation and THROWING are recorded as level **`any`** (INFERRED). BYOP itself labels UL vertical/horizontal pull `'ANY'` (W3, Z3) — but labels the UL hip-dominant block `'FOUNDATIONAL'` (AQ8), see §7.
* Typos: `'FOUNDATINONAL'` (E1, F1), `'TRIPPLE'` (B1-D1), `'SAGITAL'` (N1, Q1), `'INTERMIDIATE'` (AD1, AG1), trailing space in B1, `'AP -JUMPING'` (I1), `'RP -SHOULDERS'` (AQ1).

### 2.3 Full column decoding (43 headers; counts exclude the loose list and footer)

| Col | Header (verbatim) | Level word | Family code | Sym. code | Pattern | Level used | # items | BYOP twin col | BYOP row3 (ZONE) / row4 (PATTERN) / row5 / row6 (PURPOSE) |
|---|---|---|---|---|---|---|---|---|---|
| B | 'FOUNDATIONAL - AP - TRIPPLE EXT ' | FOUNDATIONAL | AP | - | TRIPPLE EXT | foundational | 7 | C | 'EASY' / 'ATHLETIC' / 'TRIPPLE EXTENSION' / 'SPEED/POWER' |
| C | 'INTERMEDIATE - AP - TRIPPLE EXT' | INTERMEDIATE | AP | - | TRIPPLE EXT | intermediate | 9 | D | 'MODERATE' / 'ATHLETIC' / 'TRIPPLE EXTENSION' / 'SPEED/POWER' |
| D | 'ADVANCED - AP - TRIPPLE EXT' | ADVANCED | AP | - | TRIPPLE EXT | advanced | 6 | E | 'ADVANCED' / 'ATHLETIC' / 'TRIPPLE EXTENSION' / 'SPEED/POWER' |
| E | 'FOUNDATINONAL - AP - JUMPING LIMITED KNEE' | FOUNDATINONAL | AP | - | JUMPING LIMITED KNEE | foundational | 11 | F | 'EASY' / 'ATHLETIC' / 'JUMPING ANKLE' / 'SPEED/POWER' |
| F | 'FOUNDATINONAL - AP - PLYOS' | FOUNDATINONAL | AP | - | PLYOS | foundational | 7 | G | 'EASY' / 'ATHLETIC' / 'PLYO' / 'SPEED/POWER' |
| G | 'INTERMEDIATE - AP - JUMPING LIMITED KNEE' | INTERMEDIATE | AP | - | JUMPING LIMITED KNEE | intermediate | 12 | H | 'MODERATE' / 'ATHLETIC' / 'PLYO' / 'SPEED/POWER' |
| H | 'INTERMEDIATE - AP - PLYOS' | INTERMEDIATE | AP | - | PLYOS | intermediate | 6 | I | 'MODERATE' / 'ATHLETIC' / 'PLYO' / 'SPEED/POWER' |
| I | 'ADVANCED - AP -JUMPING' | ADVANCED | AP | - | JUMPING | advanced | 16 | J | 'ADVANCED' / 'ATHLETIC' / 'FULL JUMPING' / 'SPEED/POWER' |
| J | 'AP - THROWING' | - | AP | - | THROWING | any (inferred) | 20 | K | 'AP - THROWING' / 'ATHLETIC' / 'THROWING' / 'SPEED/POWER' |
| K | 'FOUNDATIONAL - AP - COD' | FOUNDATIONAL | AP | - | COD | foundational | 5 | L | 'EASY  ' / 'ATHLETIC' / 'EASY TURN' / 'CHANGE OF DIRECTION' |
| L | 'INTERMEDIATE - AP - COD' | INTERMEDIATE | AP | - | COD | intermediate | 2 | M | 'MODERATE' / 'ATHLETIC' / 'MOD. TURN' / 'CHANGE OF DIRECTION' |
| M | 'ADVANCED - AP - COD' | ADVANCED | AP | - | COD | advanced | 2 | N | 'ADVANCED' / 'ATHLETIC' / 'HARD TURN' / 'CHANGE OF DIRECTION' |
| N | 'FOUNDATIONAL - CT - SAGITAL' | FOUNDATIONAL | CT | - | SAGITAL | foundational | 3 | O | 'EASY' / 'CONTROL' / 'CORE THORAX SAGITAL' / 'CORE' |
| O | 'INTERMEDIATE - CT - FRONTAL' | INTERMEDIATE | CT | - | FRONTAL | intermediate | 1 | P | 'MODERATE' / 'CONTROL' / 'CORE THORAX FRONTAL' / 'CORE' |
| P | 'ADVANCED - CT - TRANSVERSE' | ADVANCED | CT | - | TRANSVERSE | advanced | 3 | Q | 'HARD' / 'CONTROL' / 'CORE THORAX TRANSVERSE' / 'CORE' |
| Q | 'FOUNDATIONAL - CP - SAGITAL' | FOUNDATIONAL | CP | - | SAGITAL | foundational | 4 | R | 'EASY' / 'CONTROL' / 'CORE PELVIS SAGITAL' / 'CORE' |
| R | 'INTERMEDIATE - CP - FRONTAL' | INTERMEDIATE | CP | - | FRONTAL | intermediate | 2 | S | 'MODERATE' / 'CONTROL' / 'CORE PELVIS FRONTAL' / 'CORE' |
| S | 'ADVANCED - CP - TRANSVERSE' | ADVANCED | CP | - | TRANSVERSE | advanced | 0 | T | 'ADVANCED' / 'CONTROL' / 'CORE PELVIS TRANSVERSE' / 'CORE' |
| T | 'FOUNDATIONAL - RP - BS - VERTICAL PULL' | FOUNDATIONAL | RP | BS | VERTICAL PULL | foundational | 12 | U | 'FOUNDATIONAL' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'BACK' |
| U | 'ADVANCED - RP - BS - VERTICAL PULL' | ADVANCED | RP | BS | VERTICAL PULL | advanced | 7 | V | 'ADVANCED' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'BACK' |
| V | 'FOUNDATIONAL - RP - BS - VERTICAL PUSH' | FOUNDATIONAL | RP | BS | VERTICAL PUSH | foundational | 2 | AA | 'FOUNDATIONAL - RP - BS - VERTICAL PUSH' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'SHOULDERS/TRAPS' |
| W | 'ADVANCED - RP - BS - VERTICAL PUSH' | ADVANCED | RP | BS | VERTICAL PUSH | advanced | 8 | AB | 'ADVANCED - RP - BS - VERTICAL PUSH' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'SHOULDERS/TRAPS' |
| X | 'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH' | FOUNDATIONAL | RP | BS | HORIZONTAL PUSH | foundational | 4 | AD | 'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'CHEST/FRONT DELTS' |
| Y | 'RP - BS - INTERMEDIATE - HORIZONTAL PUSH' | INTERMEDIATE | RP | BS | HORIZONTAL PUSH | intermediate | 3 | AE | 'RP - BS - INTERMEDIATE - HORIZONTAL PUSH' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'CHEST/FRONT DELTS' |
| Z | 'RP - BS - ADVANCED HORIZONTAL PUSH' | ADVANCED | RP | BS | HORIZONTAL PUSH | advanced | 10 | AF | 'RP - BS - ADVANCED HORIZONTAL PUSH' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'CHEST/FRONT DELTS' |
| AA | 'RP - BS - HORIZONTAL PULL' | - | RP | BS | HORIZONTAL PULL | foundational (inferred) | 5 | X | 'EASY' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'BACK' |
| AB | 'RP-BS-ADVANCED HORIZONTAL PULL' | ADVANCED | RP | BS | HORIZONTAL PULL | advanced | 9 | Y | 'ADVANCED' / 'RESISTANCE' / 'BILATERAL SYMMETRICAL' / 'BACK' |
| AC | 'RP - BS - KNEE DOMINANT' | - | RP | BS | KNEE DOMINANT | foundational (inferred) | 10 | AI | 'RP - BS - KNEE DOMINANT' / 'RESISTANCE' / 'BILATERAL' / 'QUADS' |
| AD | 'RP-BS-KNEE DOMINANT-INTERMIDIATE' | INTERMIDIATE | RP | BS | KNEE DOMINANT | intermediate | 9 | AJ | 'RP-BS-KNEE DOMINANT-INTERMIDIATE' / 'RESISTANCE' / 'BILATERAL' / 'QUADS' |
| AE | 'RP-BS-KNEE DOMINANT -ADVANCED' | ADVANCED | RP | BS | KNEE DOMINANT | advanced | 11 | AK | 'RP-BS-KNEE DOMINANT -ADVANCED' / 'RESISTANCE' / 'BILATERAL' / 'QUADS' |
| AF | 'RP - BS - HIP DOMINANT' | - | RP | BS | HIP DOMINANT | foundational (inferred) | 11 | AN | 'RP - BS - HIP DOMINANT' / 'RESISTANCE' / 'BILATERAL' / 'GLUTES/HAMSTRINGS' |
| AG | 'RP-BS-HIP DOMINANT-INTERMIDIATE' | INTERMIDIATE | RP | BS | HIP DOMINANT | intermediate | 9 | AO | 'RP-BS-HIP DOMINANT-INTERMIDIATE' / 'RESISTANCE' / 'BILATERAL' / 'GLUTES/HAMSTRINGS' |
| AH | 'RP-BS-HIP DOMINANT-ADVANCED' | ADVANCED | RP | BS | HIP DOMINANT | advanced | 11 | AP | 'RP-BS-HIP DOMINANT-ADVANCED' / 'RESISTANCE' / 'BILATERAL' / 'GLUTES/HAMSTRINGS' |
| AI | 'RP - UL - VERTICAL PULL' | - | RP | UL | VERTICAL PULL | any (inferred) | 1 | W | 'ANY' / 'RESISTANCE' / 'UNILATERAL' / 'BACK' |
| AJ | 'RP - UL - VERTICAL PUSH' | - | RP | UL | VERTICAL PUSH | any (inferred) | 3 | AC | 'RP - UL - VERTICAL PUSH' / 'RESISTANCE' / 'UNILATERAL' / 'SHOULDERS/TRAPS' |
| AK | 'RP - UL - HORIZONTAL PUSH' | - | RP | UL | HORIZONTAL PUSH | any (inferred) | 5 | AG | 'RP - UL - HORIZONTAL PUSH' / 'RESISTANCE' / 'UNILATERAL' / 'CHEST/FRONT DELTS' |
| AL | 'RP - UL - HORIZONTAL PULL' | - | RP | UL | HORIZONTAL PULL | any (inferred) | 2 | Z | 'ANY' / 'RESISTANCE' / 'UNILATERAL' / 'BACK' |
| AM | 'RP - UL - KNEE DOMINANT' | - | RP | UL | KNEE DOMINANT | any (inferred) | 11 | AL | 'RP - UL - KNEE DOMINANT' / 'RESISTANCE' / 'UNILATERAL' / 'QUADS/GLUTES' |
| AN | 'RP - UL - HIP DOMINANT' | - | RP | UL | HIP DOMINANT | any (inferred) | 8 | AQ | 'RP - UL - HIP DOMINANT' / 'RESISTANCE' / 'UNILATERAL' / 'GLUTES/HAMSTRINGS' |
| AO | 'RP - BICEP' | - | RP | - | BICEP | any (inferred) | 14 | AS | 'RP - BICEP' / 'RESISTANCE' / 'None' / 'BICEP' |
| AP | 'RP - TRICEP' | - | RP | - | TRICEP | any (inferred) | 9 | AT | 'RP - TRICEP' / 'RESISTANCE' / 'None' / 'TRICEP' |
| AQ | 'RP -SHOULDERS' | - | RP | - | SHOULDERS | any (inferred) | 10 | AH | 'RP -SHOULDERS' / 'RESISTANCE' / 'BILATERAL' / 'SHOULDERS' |
| AR | 'RP - CALVES' | - | RP | - | CALVES | any (inferred) | 3 | AU | 'RP - CALVES' / 'RESISTANCE' / 'None' / 'CALVES' |

(S = header only, no exercises. Footer B44-B52 and loose list G31:G35 are extra records - see §4, §5.)


### 2.4 Level ladders — what makes a bucket "harder" (lists OBSERVED, the "lever" wording INFERRED)

Reading each pattern's FOUNDATIONAL → INTERMEDIATE → ADVANCED columns side by side shows **what the coach changes to progress a pattern**. These levers are the most useful thing Sheet23 teaches a generator.

| Pattern | Foundational (OBSERVED examples) | Intermediate | Advanced | Progression lever(s) (INFERRED) |
|---|---|---|---|---|
| **Triple extension** (B/C/D) | `'BodyWeight Squat to calf raise'`, `'Lunge to high knee reach'`, `'Hex bar squat to calf raise'`, high/mid hang clean & snatch pulls | same list + `'Weighted squat to calf raise'`, `'Low hang clean pull'`, `'Low hang snatch pull'` | `'Power Snatch'`, `'Power Clean'`, `'Power Clean & Jerk'`, `'Snatch '`, `'Clean '`, `'Clean & Jerk'` | bodyweight → load; pull start height high → mid → low hang; pull-only → power catch → full catch |
| **Jumping, limited knee** (E/G) | ankle hops: bilateral → lateral → forward/reverse → zig-zag → single-leg → right-angle | **plate hops**: bilateral → alternating SL → SL → lateral inner/outer leg → `'Bigger plates start at lateral bilateral plate hops'`; SL zig-zags; `'SL Depth Drops'` | (merges into ADVANCED JUMPING) | obstacle height (floor → plate → bigger plate); base of support (bilateral → alternating → single leg); direction (vertical → sagittal → frontal → multi/right-angle) |
| **Plyos** (F/H) | `'Low Depth Drop'` ×2, `'Medium Depth Drop'`, `'Push up Stick the Landing'`, low/mid box jumps, `'Ankle Hops '` | hurdle hops: bilateral → SL, forward → lateral → right-angle; `' Push up Box Jump '` | (merges into ADVANCED JUMPING) | landing/stick → jump over obstacle; bilateral → single leg |
| **Jumping, full / advanced** (I) | — | — | squirrel jumps (bi/SL), max velocity running, tuck jumps, depth jumps (bi/SL), drop-to-box jump, `'High Depth Drop (above hip)'`, hurdle hops, Bulgarian split jumps, weighted depth-drop → release DBs → jump (bi/SL), DB ankle hops, DB repeat squat jumps, bounding, plyo push-ups | drop height (low → medium → above hip); stick → rebound; add external load / contrast (drop weighted, deload, jump); horizontal velocity (bounding → sprinting) |
| **Throwing** (J, no level) | order: chest pass, overhead throw → rotational R/L → scoops R/L → squat-to-pass → floor slams → step-forward R/L → half-kneeling into/out-of hip → back-to-wall alternating → sit-up throws → rotational downward slam | | | bilateral symmetrical → rotational/sided → split/half-kneeling hip-specific → rebound/repeat (wall, sit-up) — descriptions in BALLISTICS cheat sheet (`'INTO THE LEFT LEG/HIP'`, `'OUT OF THE RIGHT LEG/HIP'`, `'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH'` …) |
| **COD** (K/L/M) | receiver routes `'FADE'`, `'SLANT'`, `'POST/CORNER'`, `'FLAT'` + `'Shuffles'` (BYOP: `'EASY TURN'`) | `'DIG/OUT'`, `'LEFT TEST'` (BYOP: `'MOD. TURN'`) | `'COMEBACK/CURL'`, 5-10-5 (BYOP: `'HARD TURN'`) | **cut angle / deceleration demand**: gentle release → ~45° → ~90° → >135-180° reversal. Categories are American-football **route-tree** names (AGILITYCOD tab: `'RUNNING ROUTES'`, `'ROUTE TREE'`) |
| **Core thorax / pelvis** (N-S) | `SAGITAL` (plank, crunches, sit-ups / leg raises, reverse crunches, V-ups) | `FRONTAL` (side plank / side planks, Copenhagen plank) | `TRANSVERSE` (woodchoppers, cable oblique rotations, Russian twists / *pelvis: empty*) | **level = plane**: sagittal → frontal → transverse (OBSERVED in the header itself) |
| **Vertical pull** (T/U) | 6 lat-pulldown grips, band / machine assisted pull-ups (3 grips), seated ring/TRX pull-ups, `'KB Face Pulls '` | *(no intermediate column)* | strict pull-ups (feet behind / in front / knees to chest / L-sit), chin-ups, wide grip, weighted | external assistance → own bodyweight → added load; body position (L-sit) adds trunk demand |
| **Vertical push** (V/W) | `'Incline Seated DB Press'`, `'Incline Seated Barbell Press'` | *(none)* | Z-press on floor (DB/BB), kneeling (DB/BB), standing DB ×2, handstand push-ups, pike push-ups | **remove support**: back-supported incline → seated on floor → kneeling → standing → inverted bodyweight |
| **Horizontal push** (X/Y/Z) | standing cable press, DB floor press, kneeling push-ups, incline push-ups | incline push-ups, push-ups, bench DB flies | incline DB bench, feet-on-wall push-ups, bench push-ups, diamond, DB bench, barbell bench, dips, weighted dips, decline, deficit (`'Elevated Push ups (for full ROM)'`) | supported / partial range (floor, cable, incline, knees) → full push-up → full-ROM free weights, dips, decline/deficit, load |
| **Horizontal pull** (AA/AB) | machine rows (3 grips), TRX rows, inverted rows | *(none)* | bent-over barbell rows (4 grips), seal rows (BB/DB × sup/pron), renegade rows | chest/machine-supported → unsupported hinge → strict seal rows / anti-rotation (renegade) |
| **Knee dominant BS** (AC/AD/AE) | goblet, bodyweight, box, wall-ball, low DB, landmine, hex bar, flipped hex bar, sumo DB/KB, leg extension | front, high zercher DB/BB, high-bar & low-bar back squat, double-KB front rack, hack squat machine, leg press, leg extension | `'Box.'` methods ×6 (touch-and-go vs deload × none / banded / reverse banded), hack squats, leg press, pendulum, sissy squats, leg extension | self-limiting front loads → axial barbell loading → **intensification methods** (box, bands, reverse bands) + high-stability machines to push quads hard |
| **Hip dominant BS** (AF/AG/AH) | glute bridges, feet-elevated bridges, reverse hyper, cable pull-through, single/double KB deadlift, leg curl machine, sandbag hip thrust, medball/slider/swiss-ball ham curls | DB deadlift, hex-bar deadlift, GHD, shoulder-width deadlift, ball ham curls, hip-thrust machine, machine good morning, DB hip thrust, machine leg curls | Nordic curl, barbell deadlift, GHD, sumo, wide-grip, snatch-grip deadlift, barbell good morning, barbell hip thrust, stiff-leg deadlift, machine leg curls, DB ham curls | floor-supported bridges/light hinge → DB/hex/machines → barbell + grip-width ROM + eccentric (Nordic) |
| **Unilateral** (AI-AN) | no levels; lists run easiest → hardest, e.g. UL knee: stationary → reverse → forward → side lunge → pistol → SL get-ups → FFE → RFE → wall → FFE+RFE → step-ups | | | stance stability, elevation (FFE/RFE), alternating vs single-side |
| **Isolation** (AO-AR) | biceps 14, triceps 9, shoulders 10, calves 3 — no levels | | | grip (sup/pron/neutral), arm position ("Zone", incline vs spider), implement |

Structural gaps (OBSERVED): no INTERMEDIATE column for vertical pull, vertical push or horizontal pull; `'ADVANCED - CP - TRANSVERSE'` (S) is empty; the jumping tracks run two FOUNDATIONAL columns (E limited-knee, F plyos) and two INTERMEDIATE columns (G, H) into **one** ADVANCED column (I).

---

## 3. What "ZONE" means — four contexts

### 3.1 Sheet23 column A — the green / yellow / red row band (OBSERVED layout, meaning UNRESOLVED)

| Rows | Label | Fill | Records in these rows |
|---|---|---|---|
| A1 | `'ZONE'` (bold header) | none | — |
| 2-9 (8 rows) | `'ZONE 1'` | `B6D7A8` light green | 243 |
| 10-16 (7 rows) | `'ZONE 2'` | `FFF2CC` light yellow | 54 |
| 17-28 (12 rows) | `'ZONE 3'` | `F4CCCC` light red | 6 (I17 + J17-J21) |
| outside band | — | — | 10 (G31:G35 loose list, footer B44-B52) |

Facts that constrain the meaning:
* The band boundaries are **fixed row blocks (8 / 7 / 12)** that ignore the content: the first 8 items of *every* column are "ZONE 1"; columns spill into ZONE 2 only because their list is longer than 8 (biceps, squats, rows…); only THROWING (J, 20 items) and ADVANCED JUMPING (I, 16 items) reach ZONE 3. The ZONE 3 band runs to row 28 although the longest list ends at row 21.
* Against the coach's own plyo key (§3.2) the alignment is poor: of 52 in-band jump/landing items, only **10** sit in the row zone that matches their mechanics (cross-tab in `sheet23.json` → `row_zone` vs `plyo_zone_default_inferred`). Examples: `' Squirrel jumps'` (I2) — the coach's own `'*FASTEST SSC*'` repeated hop — sits in a ZONE 1 row; `'SL Depth Drops'` (G12) — a stick-the-landing drill — sits in a ZONE 2 row; all ankle and hurdle hops (continuous) sit in ZONE 1 rows.
* Some partial fit: the ZONE 3 rows of THROWING hold `'Alternating Back to wall Rotational Scoops'`, `'Situps to chest pass'`, `'Situps to overhead throw'` — throws with a genuine catch → re-throw (repeat receive/create) — and I17 `'Plyo pushups'`.
* Within-list difficulty doesn't fit either: AH2 `'Nordic Curl'` (hardest hamstring item) and all six Olympic lifts are "ZONE 1".

Interpretation: **a template scaffold** (the coach pre-coloured a ZONE column, probably intending to tag each row's plyo zone or tier later; the tab was never renamed or finished). `sheet23.json` keeps the band as `row_zone` with `semantics: "UNRESOLVED"`; **do not use it for generation until the coach confirms.**

### 3.2 The plyo zone key — C33:D36 (OBSERVED text, INFERRED meaning)

| Cell | Text (verbatim) | Meaning (INFERRED) | Matching column in `(NOT DONE) ALL ABOUT BALLISTICS` (OBSERVED) |
|---|---|---|---|
| D33 | `'Plyo'` | key title | A2 `'BALLISTICS & PLYOS'` |
| C34 / D34 | `'ZONE 1'` / `'Receive pause/creat'` | land/absorb → **pause** (isometric hold) → produce. Amortization removed; teaches force acceptance. | A24 `'TAKING IN FORCES'` (`'STICK THE LANDING BILATERAL'`, `'WEIGHTED STICK THE LANDING …'`) then B24 `'DELIVER FORCES FAST'` (`'BILATERAL HOP ON TO'`, `'JUMP ON TO'`) |
| C35 / D35 | `'ZONE 2'` / `'Receive/create'` | land and **immediately** produce **once** (single-response, coupled SSC). | C24 `'AMORTIZATION OF FORCES'` (`'DOUBLE BOUNCE …'`, `'DROP BILATERAL & HOP'`, `'… DROP WEIGHTED, DELOAD WEIGHT & JUMP'`) |
| C36 / D36 | `'ZONE 3 '` / `'Repeat receive create'` | **continuous** repeated contacts (multiple-response, reactive/elastic). | D24 `'REBOUNDING '` (`'BILATERAL REPEAT HOPS'`, `'UNILATERAL REPEAT JUMPS'`, `'… REVERSE BANDED HOPS'`) |

Supporting coach statements (BALLISTICS tab): `'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST'` / `'*I USE THESE FOR MUSCULAR FORCE PRODUCTION'` vs `'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'` / `'*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'`, and `'**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE'`. Programs use Zone-1 execution explicitly: `'weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one'` (1 × 8).

**How a generator should use it (INFERRED):** model plyo zone as an **execution modifier**, not an exercise property — the same hurdle hop can be done stick-each-hurdle (Z1), one bounce then reset (Z2) or continuous (Z3). A block can progress Z1 → Z2 → Z3 across weeks while the exercise stays the same. `sheet23.json` supplies a *default* (`plyo_zone_default_inferred`) for the 60 jump/landing items: 10 × Z1 (landings, box jumps), 8 × Z2 (depth jumps, broad jumps, contrast drops), 42 × Z3 (hops, squirrel jumps, bounding, sprint).

### 3.3 "Zone" inside isolation exercise names (OBSERVED text, INFERRED meaning)

* AO5 `'Cable Machine Curls (Zone1, Zone 2, Zone 3'` (closing parenthesis missing)
* AP5 `'Unilateral/Bilateral DB Tricep Extension (Zone 3)'`
* AP6 `'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)'`

Most consistent reading: **arm / limb position zones** — Zone 1 = arm low / at the side (or behind), Zone 2 = arm in front at about shoulder height (midline), Zone 3 = arm overhead. Evidence: (i) BYOP drops AP6 and replaces it with `'Cable tricep push downs'` (arm at side = Zone 1) **and** `'Overhead cable tricep extension'` (arm overhead = Zone 3) — exactly a Zone 1 + Zone 3 split; (ii) AP5 `(Zone 3)` only makes sense as the overhead version; (iii) BYOP `'FUNCTIONAL BIOMECHANICS SYSTEM'` uses the same green → yellow → red colours for chop **height**: `'… chop down'` (`D9EAD3`) → `'… chop midline'` (`FFF2CC`) → `'… chop up'` (`F4CCCC`) — and `FFF2CC` / `F4CCCC` are the exact Zone 2 / Zone 3 fills in Sheet23 column A. Alternative reading: ROM region (lengthened / mid / shortened). Confirm with coach.

### 3.4 BYOP `MASTER EXERCISE LIBRARY` row label `'ZONE'` (OBSERVED)

BYOP A3 = `'ZONE'` (A2 in `Copy of Copy of MASTER EXERCISE`), with A4 `'PATTERN'` and A6 `'PURPOSE'`. Row 3 values are **difficulty tiers**: `'EASY'`, `'MODERATE'`, `'ADVANCED'`, `'HARD'`, `'FOUNDATIONAL'`, `'ANY'` — or a pasted Sheet23 header (`'RP-BS-KNEE DOMINANT-INTERMIDIATE'` …). So in BYOP, **ZONE = level**. Level vocab mapping used everywhere in the JSON: `FOUNDATIONAL`/`FOUNDATINONAL`/`EASY` → foundational; `INTERMEDIATE`/`INTERMIDIATE`/`MODERATE` → intermediate; `ADVANCED`/`HARD` → advanced; `ANY`/none → any.

### 3.5 The coach's colour language (OBSERVED across tabs)

| Context | Green | Yellow | Red |
|---|---|---|---|
| Sheet23 column A | `B6D7A8` ZONE 1 | `FFF2CC` ZONE 2 | `F4CCCC` ZONE 3 |
| EXAMPLE ATHLETIC FULL BODY SPLI row 9 | `93C47D` `'STARTING OFF SEASON WORKOUTS'` | `FFD966` `' MID OFF SEASON WORKOUTS'` | `E06666` `' ADVANCED OFF SEASON WORKOUTS'` |
| BYOP FUNCTIONAL BIOMECHANICS chops | `D9EAD3` chop **down** | `FFF2CC` chop **midline** | `F4CCCC` chop **up** |

Green → yellow → red is consistently "first / easiest / lowest" → "middle" → "last / hardest / highest". (BYOP library block fills are per-category colours, not levels — e.g. all plyos `CC0000`/`F4CCCC`, all core `6FA8DC`/`CFE2F3`.)

---

## 4. SSC speed footer — B43:B52 (OBSERVED)

| Cell | Text | Items (each prefixed ✅) |
|---|---|---|
| B43 | `'*FASTEST SSC*'` | B44 `'✅ Squirrel jumps'`, B45 `'✅ Single leg squirrel jumps my'` |
| B47 | `'*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)'` | B48 `'✅ MACH DRILLS'`, B49 `'✅ Acceleration starts'` |
| B51 | `'*SPRINT*'` | B52 `'✅ Max velocity running (top speed)'` |

Interpretation (INFERRED): a **speed-session sequence ordered by stretch-shortening-cycle speed** (ground-contact time): shortest-contact elastic hops first, then sprint-mechanics drills and acceleration starts "prior to sprint", then max-velocity sprinting. It also shows the coach classifies sprinting as the top of the SSC/jumping ladder — `' Max velocity running (top speed)'` is filed in ADVANCED JUMPING (I4). The trailing `'my'` in B45 looks like a voice-dictation artifact. MACH drills and acceleration starts exist nowhere in the BYOP library. The meaning of the ✅ marks (done? selected? approved?) is not stated.

Records carry `ssc_speed_tier` for B44, B45, B48, B49, B52 and for the grid duplicates I2, I3 (`'*FASTEST SSC*'`) and I4 (`'*SPRINT*'`).

## 5. Loose list G31:G35 (OBSERVED)

`'Depth Drops '`, `'Broad Jumps'`, `'Tuck Jumps '`, `'SL Box Jumps'`, `'Squat Jumps w/ Medicine Ball '` — below the grid, beside the plyo key, outside the ZONE band. They are full-knee jumps, so the column-G header (`'INTERMEDIATE - AP - JUMPING LIMITED KNEE'`) applies by position only (flagged in each record). Four of the five are not in the BYOP library (`'Tuck Jumps'` is, at ADVANCED). Probably a parking lot of jumps to file later.

---

## 6. What Sheet23 is

**Verdict (INFERRED, high confidence): the flat precursor / planning menu of the exercise taxonomy that became BYOP `MASTER EXERCISE LIBRARY`.**

Evidence (OBSERVED):
1. **Verbatim header carry-over.** 21 BYOP header cells contain Sheet23 header strings exactly, typos included, sitting in BYOP's `'ZONE'` row: K3 `'AP - THROWING'`, AA3 `'FOUNDATIONAL - RP - BS - VERTICAL PUSH'`, AB3 `'ADVANCED - RP - BS - VERTICAL PUSH'`, AC3 `'RP - UL - VERTICAL PUSH'`, AD3 `'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH'`, AE3 `'RP - BS - INTERMEDIATE - HORIZONTAL PUSH'`, AF3 `'RP - BS - ADVANCED HORIZONTAL PUSH'`, AG3 `'RP - UL - HORIZONTAL PUSH'`, AH3 `'RP -SHOULDERS'`, AI3 `'RP - BS - KNEE DOMINANT'`, AJ3 `'RP-BS-KNEE DOMINANT-INTERMIDIATE'`, AK3 & AM3 `'RP-BS-KNEE DOMINANT -ADVANCED'`, AL3 `'RP - UL - KNEE DOMINANT'`, AN3 `'RP - BS - HIP DOMINANT'`, AO3 `'RP-BS-HIP DOMINANT-INTERMIDIATE'`, AP3 `'RP-BS-HIP DOMINANT-ADVANCED'`, AQ3 `'RP - UL - HIP DOMINANT'`, AS3 `'RP - BICEP'`, AT3 `'RP - TRICEP'`, AU3 `'RP - CALVES'`.
2. **Same lists, same order, same typos** (`'Harmstring'`, `'Coppenhaggen'`, `'Sesaw'`, `'Stricted'`, `'Glidder'`, `'Standing DB Press'` twice, the duplicated `'Low Depth Drop'`, and the 5-10-5 date corruption). 303 of 313 Sheet23 records match a BYOP cell exactly after trimming/case-folding.
3. **BYOP is a superset and has renames** (`'Box. Any Squat Touch and Go'` → `'… fast'`; `'Elevated Push ups (for full ROM)'` → `'Deficit Push-ups'` in AF18; Zone-tagged tricep items → push-downs + overhead cable extension) — the direction of edit is Sheet23 → BYOP.
4. **Nothing points at Sheet23**: no dropdowns, links, formulas or named ranges in either workbook; the BYOP program tabs' dropdowns reference `MASTER EXERCISE LIBRARY` group columns from row 7 (e.g. `'MASTER EXERCISE LIBRARY'!$AN$7:$AN$122`).
5. It is an un-renamed default tab (`Sheet23`) holding scratch material (zone key, SSC checklist, loose jump list) next to `(NOT DONE) …` tabs.

What BYOP added when it decomposed the flat headers: a 6-row header (`row1` group, `'FILL HERE'`, `'ZONE'`=level, `'PATTERN'`=family, sub-pattern/laterality/plane, `'PURPOSE'`=target muscle or quality), stacked level blocks with `'CHOOSE 👇'` for dropdowns, and new buckets (the shoulders list re-titled `'SIDE RAISES'`; CARDIO, LEG EXTENSIONS, LEG CURLS, CARRY, DRAGS, FUNCTIONAL BIOMECHANICS SYSTEM, SETS/REPS/EFFORT/FEELING, FULL FOCUS LIST). The two BYOP tabs `Copy of MASTER EXERCISE LIBRARY` and `Copy of Copy of MASTER EXERCISE` are, by their names, copies made *from* the master (not precursors); they keep the same Sheet23 strings in their ZONE rows.

**So for the generator:** Sheet23 is the cleanest statement of the *bucket grid* (LEVEL × FAMILY × SYMMETRY × PATTERN) and of the coach's progression levers; BYOP `MASTER EXERCISE LIBRARY` is the current, larger exercise inventory plus the PURPOSE (target-muscle) layer. Use BYOP as the inventory and Sheet23 as the taxonomy/level reference; reconcile with the differences below.

---

## 7. Cross-reference: Sheet23 vs BYOP `MASTER EXERCISE LIBRARY`

Matching = exact after trim + case-fold + whitespace collapse + removing ✅. Generated by script from the dumps; every row below is OBSERVED except the "relation" wording.

Re-categorizations (OBSERVED, not just level changes):
* Sheet23 `'FOUNDATINONAL - AP - JUMPING LIMITED KNEE'` → BYOP side column F `'JUMPING ANKLE'` (`'EASY'`) **and** an `'EASY'` block at C124 *inside the TRIPPLE EXTENSION group*; Sheet23 `'INTERMEDIATE - AP - JUMPING LIMITED KNEE'` → BYOP `'PLYO'` (H, `'MODERATE'`) inside the PLYOS group. "Limited knee" was renamed "jumping ankle" at the easy level and merged into plyos at the moderate level.
* Sheet23 `'INTERMEDIATE - AP - PLYOS'` (hurdle hops) becomes a **second `'MODERATE'`** block in BYOP G89 (so BYOP's PLYOS group has two MODERATE blocks).
* Sheet23 `'ADVANCED - AP -JUMPING'` → BYOP `'FULL JUMPING'` (J).
* COD levels → BYOP `'EASY TURN'` / `'MOD. TURN'` / `'HARD TURN'` (row 5).
* BS legs/shoulders: BYOP row 5 says `'BILATERAL'`, not `'BILATERAL SYMMETRICAL'` (upper-body pulls/pushes keep `'BILATERAL SYMMETRICAL'`).
* Knee-flexion and knee-extension isolation get their own BYOP columns (`'LEG CURLS'` AR, `'LEG EXTENSIONS'` AM) while the old items stay in the hip/knee lists.
* `'Bench Push ups'` is moved into BYOP's FOUNDATIONAL horizontal-push block (AD13) while staying in the ADVANCED side column (AF11).
* `'Leg Press'` (intermediate) is dropped from BYOP's moderate knee-dominant block; only the advanced `'Leg press'` survives.
* BYOP labels the UL hip-dominant list `'FOUNDATIONAL'` (AQ8) — Sheet23 gave it no level.


### 7.1 Counts

- Sheet23 exercise records: **313** (313 cells)
- exact (after trim/case-fold): 303
- renamed / replaced / related only: 7
- MISSING from BYOP MASTER EXERCISE LIBRARY: 3

### A. Sheet23 entries with NO exact match in BYOP MASTER EXERCISE LIBRARY

| Sheet23 cell | Raw text | Sheet23 header | Closest BYOP item(s) / what happened |
|---|---|---|---|
| B45 | '✅ Single leg squirrel jumps my' | *FASTEST SSC* | G127 'Single leg squirrel jumps' (same exercise - raw Sheet23 text has a stray trailing word 'my'); J10 'Single leg squirrel jumps' (same exercise (ADVANCED side column)) |
| B48 | '✅ MACH DRILLS' | *FAST BALLISTIC/WARMUP/SSC* (prior to sprint) | none - genuinely absent |
| B49 | '✅ Acceleration starts' | *FAST BALLISTIC/WARMUP/SSC* (prior to sprint) | none - genuinely absent |
| G31 | 'Depth Drops ' | INTERMEDIATE - AP - JUMPING LIMITED KNEE | G9 'Low Depth Drop' (nearest: 'Low Depth Drop'); G56 'SL Depth Drops' (nearest: 'SL Depth Drops') |
| G32 | 'Broad Jumps' | INTERMEDIATE - AP - JUMPING LIMITED KNEE | none - genuinely absent |
| G34 | 'SL Box Jumps' | INTERMEDIATE - AP - JUMPING LIMITED KNEE | G13 'Low Box Jumps (half shin)' (nearest: 'Low Box Jumps (half shin)'); G14 'Mid Box Jump (up to knee)' ('Mid Box Jump (up to knee)') |
| G35 | 'Squat Jumps w/ Medicine Ball ' | INTERMEDIATE - AP - JUMPING LIMITED KNEE | J22 'DB repeat squat jumps' (nearest loaded repeat-jump variant: 'DB repeat squat jumps' (ADVANCED)) |
| AE2 | 'Box. Any Squat Touch and Go' | RP-BS-KNEE DOMINANT -ADVANCED | AI91 'Box. Any Squat Touch and Go fast' (renamed: adds 'fast'); AK9 'Box. Any Squat Touch and Go fast' (renamed: adds 'fast') |
| AP5 | 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' | RP - TRICEP | AT11 'Overhead DB Tricep Extension' (possible replacement: 'Overhead DB Tricep Extension' already exists; the (Zone 3) variant was dropped) |
| AP6 | 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' | RP - TRICEP | AT16 'Overhead cable tricep extension' (replaced by 'Overhead cable tricep extension' (Zone 3 part)); AT17 'Cable tricep push downs' (replaced by 'Cable tricep push downs' (Zone 1 part)) |

### B. Level differences by exercise name (all Sheet23 occurrences vs all BYOP occurrences)

| Name (Sheet23 raw) | Sheet23 cells -> level | BYOP cells -> block label | Difference |
|---|---|---|---|
| 'Bench Push ups' | Z4 -> ADVANCED (advanced) | AD13 -> 'FOUNDATIONAL'; AF11 -> 'RP - BS - ADVANCED HORIZONTAL PUSH' | BYOP adds foundational |
| 'Leg Press' | AD9 -> INTERMIDIATE (intermediate); AE9 -> ADVANCED (advanced) | AI98 -> 'ADVANCED'; AK16 -> 'RP-BS-KNEE DOMINANT -ADVANCED' | BYOP drops intermediate |
| 'SL Glute Bridges (foot on the ground)' | AN2 -> (no level word) (any) | AQ9 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'SL Glute Bridges (foot on bench)' | AN3 -> (no level word) (any) | AQ10 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'SL Hip thrusts' | AN4 -> (no level word) (any) | AQ11 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'Staggered Stance DL w/ DB ' | AN5 -> (no level word) (any) | AQ12 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'Alternating DB Deadlifts' | AN6 -> (no level word) (any) | AQ13 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'Staggered Stance DL w/ Barbell' | AN7 -> (no level word) (any) | AQ14 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'Alternating  Barbell Deadlifts' | AN8 -> (no level word) (any) | AQ15 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |
| 'Camporini Deadlifts' | AN9 -> (no level word) (any) | AQ16 -> 'FOUNDATIONAL' | BYOP adds foundational / BYOP drops any |

Note: 'any' for Sheet23 means the header carries no level word (UL / isolation / THROWING columns). Loose-list (G31:G35) and footer (B43+) cells are excluded from the Sheet23 level set when the name also exists in the grid.

### C. BYOP MASTER EXERCISE LIBRARY exercise items (cols C-AU) NOT in Sheet23

| BYOP cell | Raw text | BYOP group (row1) / subgroup / block label | bg | Relation to Sheet23 |
|---|---|---|---|---|
| O13 | 'Weighted Situps' | CORE THORAX / CORE THORAX / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| O15 | 'Toes to bar' | CORE THORAX / CORE THORAX / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| O16 | 'Knees to chest' | CORE THORAX / CORE THORAX / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| O209 | 'Hanging rotational knees to chest' | CORE THORAX / CORE PELVIS / ADVANCED | 6FA8DC | Q5: BYOP adds 'Hanging rotational knees to chest' as CORE PELVIS ADVANCED (transverse) |
| R91 | 'Hanging rotational knees to chest' | CORE PELVIS / - / ADVANCED | 6FA8DC | Q5: same - CORE PELVIS ADVANCED block |
| T9 | 'Hanging rotational knees to chest' | CORE PELVIS / - / ADVANCED | CFE2F3 | Q5: same - 'ADVANCED / CORE PELVIS TRANSVERSE' side column |
| AA11 | 'DB Push press' | VERTICAL PUSH / - / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AA12 | 'Barbell push press' | VERTICAL PUSH / - / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AA13 | 'DB Push Jerk' | VERTICAL PUSH / - / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AA14 | 'Barbell Push Jerk' | VERTICAL PUSH / - / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AA54 | 'DB Thrusters' | VERTICAL PUSH / - / ADVANCED | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AA55 | 'Barbell Thrusters' | VERTICAL PUSH / - / ADVANCED | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AA94 | 'Single arm DB thrusters' | VERTICAL PUSH / - / UNILATERAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AD14 | 'Machine bench press' | HORIZONTAL PUSH / - / FOUNDATIONAL | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AD49 | 'Cable flies' | HORIZONTAL PUSH / - / MODERATE | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AD50 | 'Machine flies' | HORIZONTAL PUSH / - / MODERATE | 6FA8DC | NEW in BYOP (no Sheet23 ancestor) |
| AF18 | 'Deficit Push-ups' | HORIZONTAL PUSH / - / RP - BS - ADVANCED HORIZONTAL PUSH | CFE2F3 | Z11: renamed in ADVANCED side column to 'Deficit Push-ups' |
| AH19 | 'Cable machine Leaning Side raises ' | SIDE RAISES / - / RP -SHOULDERS | EAD1DC | AQ7: probably the same exercise renamed 'Cable machine Leaning Side raises ' |
| AH20 | 'Machine reverse fliez' | SIDE RAISES / - / RP -SHOULDERS | EAD1DC | NEW in BYOP (no Sheet23 ancestor) |
| AI9 | 'Box. Zercher squat Touch and Go' | BILATERAL KNEE DOMINANT / - / FOUNDATIONAL | FFD966 | NEW in BYOP (no Sheet23 ancestor) |
| AI10 | 'Box. Goblet squat Touch and Go' | BILATERAL KNEE DOMINANT / - / FOUNDATIONAL | FFD966 | NEW in BYOP (no Sheet23 ancestor) |
| AI56 | 'Landmine Hack Squat ' | BILATERAL KNEE DOMINANT / - / MODERATE | FFD966 | NEW in BYOP (no Sheet23 ancestor) |
| AI91 | 'Box. Any Squat Touch and Go fast' | BILATERAL KNEE DOMINANT / - / ADVANCED | FFD966 | AE2: renamed: adds 'fast' |
| AI102 | 'DB thrusters' | BILATERAL KNEE DOMINANT / - / ADVANCED | FFD966 | NEW in BYOP (no Sheet23 ancestor) |
| AI103 | 'Barbell Thrusters' | BILATERAL KNEE DOMINANT / - / ADVANCED | FFD966 | NEW in BYOP (no Sheet23 ancestor) |
| AI104 | 'Single arm DB thruster' | BILATERAL KNEE DOMINANT / - / ADVANCED | FFD966 | NEW in BYOP (no Sheet23 ancestor) |
| AJ19 | 'Landmine Hack Squat ' | BILATERAL KNEE DOMINANT / - / RP-BS-KNEE DOMINANT-INTERMIDIATE | FFF2CC | NEW in BYOP (no Sheet23 ancestor) |
| AK9 | 'Box. Any Squat Touch and Go fast' | BILATERAL KNEE DOMINANT / - / RP-BS-KNEE DOMINANT -ADVANCED | FFF2CC | AE2: renamed: adds 'fast' |
| AL20 | 'Elevated Reverse Lunge' | UNILATERAL KNEE DOMINANT / - / RP - UL - KNEE DOMINANT | FFE599 | NEW in BYOP (no Sheet23 ancestor) |
| AL21 | 'Curtsy Lunges ' | UNILATERAL KNEE DOMINANT / - / RP - UL - KNEE DOMINANT | FFE599 | NEW in BYOP (no Sheet23 ancestor) |
| AM9 | 'Leg Extensions' | LEG EXTENSIONS / - / RP-BS-KNEE DOMINANT -ADVANCED | FFD966 | AC11: BYOP adds a separate LEG EXTENSIONS column: 'Leg Extensions'; AD11: 'Leg Extensions'; AE12: 'Leg Extensions' |
| AN20 | 'KB swing' | BILATERAL HIP DOMNANT / - / FOUNDATIONAL | 93C47D | NEW in BYOP (no Sheet23 ancestor) |
| AN55 | 'Hyper extensions ' | BILATERAL HIP DOMNANT / - / MODERATE | 93C47D | NEW in BYOP (no Sheet23 ancestor) |
| AO18 | 'Hyper extensions ' | BILATERAL HIP DOMNANT / - / RP-BS-HIP DOMINANT-INTERMIDIATE | D9EAD3 | NEW in BYOP (no Sheet23 ancestor) |
| AR9 | 'Seated leg curls' | LEG CURLS / - / (no level label) | 93C47D | AF8: BYOP adds a separate LEG CURLS column: 'Seated leg curls'; AG10: 'Seated leg curls'; AH11: 'Seated leg curls' |
| AR10 | 'Lying Leg Curls' | LEG CURLS / - / (no level label) | 93C47D | AF8: 'Lying Leg Curls'; AG10: 'Lying Leg Curls'; AH11: 'Lying Leg Curls' |
| AT16 | 'Overhead cable tricep extension' | TRICEP / - / RP - TRICEP | FCE5CD | AP6: replaced by 'Overhead cable tricep extension' (Zone 3 part) |
| AT17 | 'Cable tricep push downs' | TRICEP / - / RP - TRICEP | FCE5CD | AP6: replaced by 'Cable tricep push downs' (Zone 1 part) |
| AU9 | 'Standing Calf raises (use deficit)' | CALVES / - / RP - CALVES | EAD1DC | AR3: deficit version 'Standing Calf raises (use deficit)' |
| AU10 | 'Standing DB calf Raises (Use Deficit)' | CALVES / - / RP - CALVES | EAD1DC | AR2: deficit version 'Standing DB calf Raises (Use Deficit)' |

Unique BYOP names (cols C-AU) not in Sheet23 (renames included): **33**

### D. BYOP columns with no Sheet23 counterpart at all

- **SETS** (9 cells): AV8 '1.0'; AV9 '2.0'; AV10 '3.0'; AV11 '4.0'; AV12 '5.0'; AV13 '6.0'; AV14 '7.0'; AV15 '8.0'; AV16 'SUPERSET W/ 👇'
- **REPS** (7 cells): AW8 '4 to 6 Reps'; AW9 '6 to 8 Reps'; AW10 '8 to 12 Reps'; AW11 '10 to 15 Reps'; AW12 '15 Reps'; AW13 '20 Reps'; AW14 'MYO SET'
- **EFFORT** (10 cells): AX8 '1 - Way Too Easy'; AX9 '2 - Way Too Easy'; AX10 '3 - Too Easy'; AX11 '4 - Easy'; AX12 '5 - Easyish'; AX13 '6 - Broke a Sweat'; AX14 '7 - That was tough'; AX15 '8 - That was perfect'; AX16 '9 - That was terrible'; AX17 '10 - I'm done'
- **FEELING** (4 cells): AY8 'Felt the RIGHT muscles'; AY9 'Felt the WRONG muscle'; AY10 'Felt a PAIN'; AY11 'Couldn't do it'
- **FULL FOCUS LIST** (61 cells): AZ8 'QUADS 👇'; AZ9 'Goblet squats heels elevated'; AZ10 'Leg press'; AZ11 'Zercher squats'; AZ12 'Back squats'; AZ13 'Walking Lunges'; AZ14 'Stationary Lunges'; AZ15 'Bulgarian Split squats'; AZ16 'Leg extensions'; AZ44 'SHOULDERS/TRAPS 👇'; AZ45 'Bd overhead Press'; AZ46 'barbell overhead press'; AZ47 'High incline db press'; AZ48 'Incline db press'; AZ49 'Incline barbell press'; AZ50 'DB side raises'; AZ51 'Cable side raises'; AZ52 'DB upright rows'; AZ53 'Barbell upright rows'; AZ89 'BACK 👇'; AZ90 'Pull ups'; AZ91 'assisted pull ups'; AZ92 'lat pull down'; AZ93 'Db rows'; AZ94 'Cable rows'; AZ95 'machine rows'; AZ124 'TRICEP 👇'; AZ125 'DB overhead tricep ext'; AZ126 'cable tricep extensions'; AZ127 'cable overhead tricep ext'; AZ128 'dips'; AZ129 'assisted dips'; AZ164 'GLUTES 👇'; AZ165 'Single leg Glute bridge'; AZ166 'Barbell hip thrust'; AZ204 'HAMSTRINGS 👇'; AZ205 'DB deadlifts'; AZ206 'Barbell deadlifts'; AZ207 'Hyperextensions'; AZ208 'Hip thrusts/ Glute bridges'; AZ209 'Staggered stance DL'; AZ210 'Foot on wall db DL'; AZ211 'Leg curls'; AZ212 'Lying leg curls'; AZ244 'CHEST 👇'; AZ245 'Incline db press'; AZ246 'bench press'; AZ247 'db bench press'; AZ248 'DB flies'; AZ249 'Cable flies'; AZ250 'Incline barbell press'; AZ284 'CORE 👇'; AZ285 'Weighted situps'; AZ286 'weighted decline situps'; AZ287 'Weighted russian twists'; AZ311 'BICEP 👇'; AZ312 'Incline bench bicep curls'; AZ313 'supine bicep curls'; AZ314 'cable bicep curls'; AZ331 'CALVES 👇'; AZ332 'DB Standing calf raises'
- **CARRY** (4 cells): BA8 'PROPULSIVE'; BA10 'STATIONARY'; BA13 'BILATERAL'; BA14 'UNILARTERAL'
- **DRAGS** (2 cells): BB8 'SAGITAL'; BB10 'FRONTAL'
- **FUNCTIONAL BIOMECHANICS SYSTEM** (28 cells): BC8 'CHOPS'; BC9 'Hold object Adducted between knees rotational crunch chop down'; BC10 'Hold object Adducted between knees kneeling cable or banded crunch down'; BC11 'Knee banded for adduction, half kneeling crunch down into active knee'; BC12 'Knee banded for adduction, split standing down crunch into active knee '; BC13 'Hold object Adducted between knees rotational crunch chop midline'; BC14 'Hold object Adducted between knees kneeling cable or banded crunch midline'; BC15 'Knee banded for adduction, half kneeling crunch midline into active knee'; BC16 'Knee banded for adduction, split standing midline crunch into active knee '; BC17 'Hold object Adducted between knees rotational crunch chop up'; BC18 'Hold object Adducted between knees kneeling cable or banded crunch up'; BC19 'Knee banded for adduction, half kneeling crunch up into active knee'; BC20 'Knee banded for adduction, split standing up crunch into active knee '; BC44 'INTEGRATED WITH PUSH & LEGS'; BC45 'ANTI ROTATIONS'; BC46 'Hold object Adducted between knees floor supine cable or band anti-rotational pallof hold'; BC47 'Hold object Adducted between knees, kneeling cable or band anti-rotational pallof hold'; BC48 'Knee banded for adduction, half kneeling Pallof hold'; BC49 'Knee banded for adduction, split standing pallof hold'; BC89 'INTEGRATED WITH PUSH & LEGS'; BC90 'PLANKS'; BC91 'Supine offset plank with contralateral banded or cable adduction'; BC124 'INTEGRATED WITH PUSH & LEGS'; BC125 'CRUNCHES'; BD8 'BRIDGES'; BD9 'INTEGRATIONS WITH PULL & LEGS'; BE8 'SIDE LYING'; BE9 'INTEGRATIONS LEGS & DELTS'


---

## 8. Data-quality issues inside Sheet23 (OBSERVED; suggested fixes INFERRED)

| Cell(s) | Issue | Suggested reading |
|---|---|---|
| M3 | Value is the date `2005-05-10` (format `m/d/yy`) | **"5-10-5"** pro-agility shuttle, auto-converted by Google Sheets; same corruption copied to BYOP L92, N10. (Same Sheets behaviour turned rep strings into 2021 dates in EXAMPLE ATHLETIC E18/E19/B28.) Store as text. |
| L3 | `'LEFT TEST'` | Probably the **L-test / L-drill (3-cone)**; possibly dictation error. |
| W6 / W7 | `'Standing DB Press'` twice | W7 most likely `'Standing Barbell Press'` (column alternates DB / Barbell). Copied into BYOP AA50/51, AB13/14. |
| F2 / F3 | `'Low Depth Drop'` twice | Placeholder for an unnamed variant (single-leg? weighted?). |
| F8 / G11 | `'Ankle Hops '` in FOUNDATIONAL PLYOS and INTERMEDIATE LIMITED KNEE | Same as E2 family; generic duplicate. |
| B3-B8 / C3-C8 | Six items listed at both FOUNDATIONAL and INTERMEDIATE triple extension | Intentional overlap (the intermediate list = foundational list + load + low-hang pulls). |
| X5 / Y2 | `'Incline Push-ups'` at FOUNDATIONAL and INTERMEDIATE | Overlap. |
| AC11 / AD11 / AE12 | `'Leg Extension Machine'` at all three knee-dominant levels | Level-agnostic isolation. |
| AD9 / AE9, AD8 / AE8 | `'Leg Press'`/`'Leg press'`, `'Hack Squat Machine '`/`'Hack Squats'` at INTERMIDIATE and ADVANCED | Overlap (same machines). |
| AG4 / AH4 | `'GHD'` at INTERMIDIATE and ADVANCED; label is only the machine name | GHD raise vs GHD back/hip extension unclear. |
| AF10 / AF12 / AG6 | medball / swiss-ball / "Medicine or Stability Ball" hamstring curls across two levels | Near-duplicates. |
| AF8 / AG10 / AH11 | three leg-curl-machine entries across three levels | Near-duplicates; BYOP later adds a LEG CURLS column. |
| AO7 / AO9 | `'Seated Db Bicep Curls'` vs `'Seated DB Curls '` | Near-duplicate. |
| O2 / R2 | `'Side Plank '` (CT FRONTAL) and `'Side Planks '` (CP FRONTAL) | Same exercise used for thorax and pelvis frontal. |
| Q5 | `'Hanging Rotational Knee/Leg Raises'` (rotational) under `'FOUNDATIONAL - CP - SAGITAL'`; S (CP TRANSVERSE) empty | Likely misfiled; BYOP adds `'Hanging rotational knees to chest'` to CORE PELVIS ADVANCED/TRANSVERSE. |
| T13 | `'KB Face Pulls '` in FOUNDATIONAL VERTICAL PULL | Face pull = horizontal pull / rear delt; "KB" unusual. |
| Z4 | `'Bench Push ups'` ADVANCED here, FOUNDATIONAL in BYOP block AD13 | Hands-on-bench (easy) vs feet-on-bench (hard) ambiguity. |
| AB10 | `'Renegade Rows'` filed under BS but alternating | Laterality inconsistency. |
| Y4 | `'Bench DB Flies '` (isolation) in an INTERMEDIATE compound list | Category mixing. |
| H6, F5, I17 | Upper-body plyos (`'Push up Box Jump'`, `'Push up Stick the Landing'`, `'Plyo pushups'`) inside lower-body jumping/plyo columns | Plyo columns are "plyo" in general, not lower-body only. |
| I4, B52 | `' Max velocity running (top speed)'` inside ADVANCED JUMPING | Sprint treated as top of SSC ladder. |
| G9 | `'Bigger plates start at lateral bilateral plate hops'` | A progression rule, not an exercise. |
| AE6 | `'Box. Squat Deload (banded)'` drops "Any" | Same family as AE5/AE7. |
| AO5 | `'Cable Machine Curls (Zone1, Zone 2, Zone 3'` missing `)` | — |
| AP6 | `'…Extensionw/ Rope…'` | missing space. |
| B45 | `'… squirrel jumps my'` | stray word. |
| N2 | blank first row in CT SAGITAL | list starts at N3. |
| AD10 | blank gap row | — |
| Typos kept verbatim in `name_raw` | `'Harmstring'` (AF10, AG6, AH12), `'Coppenhaggen'` (R3), `'Sesaw'` (AJ2), `'Stricted'` (U2, U3), `'Glidder'` (AF11), `'Goodmornings'` (AH8), `'sL'` (G4) | corrected in `name_clean` |

## 9. What this means for the program generator (INFERRED)

1. **Bucket key = (family, pattern, symmetry, level).** Sheet23 gives 43 such buckets (42 populated). A day template can request e.g. `RP/BS/KNEE DOMINANT/intermediate` + `RP/UL/HIP DOMINANT/any` + `CT/transverse` + `AP/PLYOS/foundational`, and the generator picks from `sheet23.json` (or the larger BYOP inventory) filtered by equipment (`equipment`, `no_equipment_ok`).
2. **Level progression across a 6/8/12-week plan** can follow the levers in §2.4: e.g. core sagittal → frontal → transverse; vertical push incline → floor/kneeling → standing → inverted; knee dominant goblet/box → barbell → box-method/bands; plyo landing → hurdle → depth/weighted.
3. **Plyo dosing has two independent dials:** exercise level (F/E → G/H → I) and execution zone (Z1 stick → Z2 single response → Z3 repeated). Athlete type (basketball ≫ MMA > boxing/karate per the coach) should scale **contacts per week** and how fast athletes are moved to Z3 — `impact_or_plyo_intensity` and `plyo_zone_default_inferred` support that.
4. **Speed days** can be ordered with the SSC footer: fastest-SSC hops → MACH/acceleration → max velocity.
5. **Volume accounting:** ATHLETIC records are flagged `muscle_size_class: "n/a"` (count contacts/throws/reps, not hypertrophy sets). RESISTANCE records carry `big` / `small` / `mixed` so weekly sets-per-muscle (the coach's ~15-20) and the "small muscles → more reps" rule can be applied via `primary_muscles`; CONTROL (core) is `small`.
6. **Rep guesses** follow the coach's own BYOP REPS dropdown buckets (`'4 to 6 Reps'`, `'6 to 8 Reps'`, `'8 to 12 Reps'`, `'10 to 15 Reps'`, `'15 Reps'`, `'20 Reps'`, `'MYO SET'`) and, where available, his prescriptions in other tabs (medball 1-2 × 10, sit-up throws × 20, squirrel jumps 1 × 40, power cleans 3 × 3, depth-drop stick 1 × 8).

## 10. Field guide to `sheet23.json`

| Field | Status | Notes |
|---|---|---|
| `name_raw`, `cell`, `source` | OBSERVED | `name_raw` is the exact cell text; for M3 it is the Python repr of the stored date. |
| `column_header_rows` | OBSERVED | only `row1` exists in Sheet23. |
| `header_parsed` | OBSERVED tokens | level word / family code / symmetry code / pattern split from the header; footer records carry `footer_section_label`. |
| `byop_equivalent_column`, `byop_equivalent_header_rows`, `coach_target_muscles_byop` | OBSERVED (in BYOP) | the matching BYOP column and its rows 1-6; row 6 = coach's PURPOSE label (e.g. `'GLUTES/HAMSTRINGS'`, `'SPEED/POWER'`). |
| `family`, `category`, `category_header_verbatim` | decoded from header (OBSERVED code, mapping confirmed by BYOP) | footer → `category: "SSC SPEED LIST"`. |
| `level` `{raw, normalized, source}` | OBSERVED when the header has a level word, else INFERRED (source says why) | |
| `laterality`, `plane` | OBSERVED when the header states BS/UL or a plane and the record agrees; otherwise INFERRED (listed in `inferred_fields`) | |
| `level_block_colour` | OBSERVED | exercise-cell fill; null everywhere except AP10 (`theme0`). |
| `row_zone` | OBSERVED position / colour, meaning UNRESOLVED | see §3.1. |
| `plyo_zone_default_inferred` | INFERRED | 60 jump/landing records. |
| `ssc_speed_tier` | OBSERVED for footer items and their grid duplicates | |
| `coach_description_other_tab` | OBSERVED (BALLISTICS medball cheat sheet) | throws only. |
| `duplicate_of` | OBSERVED duplicates / INFERRED near-duplicates | |
| `byop_cross_reference` | OBSERVED matches; `related` wording INFERRED | includes BYOP cell, fill, block label, normalized level, and `level_difference`. |
| `sub_pattern`, muscles, `muscle_size_class`, `equipment`, `no_equipment_ok`, `load_ceiling`, `skill_demand`, `impact_or_plyo_intensity`, `typical_rep_range_guess` | INFERRED | always listed in `inferred_fields`. |

Size classes used: big = quads, glutes, hamstrings, adductors, lats, upper back, traps, lower back, chest; small = biceps, triceps, front/side/rear delts, calves, forearms, brachialis, abs, obliques, TVA, QL, hip flexors, rotator cuff, hip abductors. Hex/trap bar, EZ bar and landmine are mapped to `barbell`; plates, hurdles, sliders, swiss balls, sandbags, pull-up/dip bars to `other`.

## 11. Open questions for the coach

1. **Column A "ZONE" band** (green rows 2-9, yellow 10-16, red 17-28): what was it meant to tag? Plyo zone per row, difficulty within each list, or something else? It currently doesn't line up with the exercises in it (e.g. squirrel jumps in ZONE 1, SL depth drops in ZONE 2).
2. **Plyo zones** `'Receive pause/creat'` / `'Receive/create'` / `'Repeat receive create'`: is the zone a way of *performing* any jump (so one hurdle hop can be done in all three zones) or a property of the exercise? How many weeks do you keep an athlete in each zone, and does that differ for basketball vs MMA vs boxing?
3. **"Zone" in `'Cable Machine Curls (Zone1, Zone 2, Zone 3'` and the tricep items**: does Zone mean arm position (low / shoulder height / overhead), or range of motion (stretched / mid / shortened)?
4. **SSC footer** ✅ items: is this the fixed order of a speed session (fastest SSC → MACH drills & acceleration starts → max velocity)? What do the check marks mean? Should MACH drills and acceleration starts be added to the master library?
5. **M3**: confirm it is the **5-10-5** pro-agility drill. And `'LEFT TEST'` — is it the **L-test / 3-cone L drill**?
6. **W7** second `'Standing DB Press'` — was it meant to be **Standing Barbell Press**? **F3** second `'Low Depth Drop'` — which variant?
7. **Missing levels**: should vertical pull, vertical push and horizontal pull get an INTERMEDIATE list? Should `'ADVANCED - CP - TRANSVERSE'` hold `'Hanging Rotational Knee/Leg Raises'` (currently in FOUNDATIONAL - CP - SAGITAL)?
8. **Unilateral and isolation lists have no level**. Is the list order your easy → hard order (e.g. stationary lunge → … → FFE+RFE)? BYOP calls the UL hip list `'FOUNDATIONAL'` — is that intended for all UL hip items?
9. **`'Bench Push ups'`**: hands on bench (easier, foundational) or feet on bench (harder, advanced)? It is advanced in Sheet23 and foundational in BYOP.
10. **`'KB Face Pulls '`** under vertical pull — is it intentionally a vertical-pull accessory, and what is the KB setup?
11. **`'GHD'`** — glute-ham raise, back extension, or hip extension? And what separates the intermediate from the advanced GHD?
12. **`'Box. Any Squat …'` methods**: confirm "Touch and Go" vs "Deload" (= dead-stop / sit and relax on box) and banded vs reverse-banded. When does BYOP's `'… Touch and Go fast'` apply (dynamic-effort day)?
13. **Loose list G31:G35** (`'Depth Drops '`, `'Broad Jumps'`, `'Tuck Jumps '`, `'SL Box Jumps'`, `'Squat Jumps w/ Medicine Ball '`): which bucket and level should each go to?
14. **`'Camporini Deadlifts'`, `'Single Leg Get Ups'`, `'Alternating DB/Barbell Deadlifts'`, `'Low DB Squats'`**: what is the exact setup (for video/cue fields)?
15. Is **Sheet23 still used**, or fully replaced by the BYOP `MASTER EXERCISE LIBRARY`? If replaced, should the generator treat BYOP as the only inventory and Sheet23 only as the level/progression reference?
