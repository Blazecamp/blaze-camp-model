# Equipment usage in the MASTER EXERCISE LIBRARY, columns S-BE

**Source:** BYOP workbook ("BUILD YOUR OWN PROGRAM"), tab `MASTER EXERCISE LIBRARY`, columns **S through BE**. I read it from `dumps/BYOP/09_MASTER_EXERCISE_LIBRARY.columns.txt`.

**Companion data:** `lib_resistance.json`, which has 378 records:
- **373 exercise cells.** Every non-label cell in S..BE, excluding the dosing dropdown columns AV-AY.
- **5 category stubs** for sub-lists that have labels but no exercises: CARRY, DRAGS, BD, BE and BC125 `CRUNCHES`.

**Evidence labels:**
- **OBSERVED**: read from a cell, with tab and cell cited.
- **INFERRED**: my interpretation.
- **SCIENCE**: textbook exercise science, not the coach's words.

Exercise names are quoted verbatim, typos included. Every equipment, constraint and force-velocity tag is **INFERRED from the exercise name**, because the library holds no equipment column. Each record lists its inferred fields in `inferred_fields`.

---

## 0. Scope and counts (OBSERVED)

| Item | Count |
|---|---|
| Exercise cells in S..BE | **373**. Label cells excluded: 60 (`CHOOSE 👇`, level block headers, AZ group headers, BA-BE sub-type labels). |
| Unique exercise names (case/space-insensitive) | **267** |
| Unique (category, level, name) entries, used for every distribution below | **283** |
| Categories (row-1 headers) | `CORE PELVIS` (S-T only; R lies outside this range), `VERTICAL PULL`, `HORIZONTAL PULL`, `VERTICAL PUSH`, `HORIZONTAL PUSH`, `SIDE RAISES`, `BILATERAL KNEE DOMINANT`, `UNILATERAL KNEE DOMINANT`, `LEG EXTENSIONS`, `BILATERAL HIP DOMNANT`, `UNILATERAL HIP DOMINANT`, `LEG CURLS`, `BICEP`, `TRICEP`, `CALVES`, `FULL FOCUS LIST`, `CARRY`, `DRAGS`, `FUNCTIONAL BIOMECHANICS SYSTEM` |
| Not exercises | AV `SETS`, AW `REPS`, AX `EFFORT`, AY `FEELING`. These are dosing dropdowns and are covered by the vocabulary team. |
| Implement not named at all | **96 / 283** (34%). Examples: every `UNILATERAL KNEE DOMINANT` lunge, `Glute Bridges`, `Front Squats`, `Leg Extensions` (AM9), `Dips `. |
| Ambiguous implement | **93 / 283** (33%). Either the name allows several implements (`Goblet KB/DB Squats`, `DB/ Kb Rows`, `Sumo Squats w/ DB or KB `, `Seated Pull ups with Rings or TRX`, `Box. Any Squat ...`, `... cable or band ...`), or the load is left open. |

How the level was read for each record:
- **Master stacks** (U, X, AA, AD, AI, AN): from the block header above the item (`FOUNDATIONAL`, `MODERATE`, `ADVANCED`, `UNILATERAL`).
- **Level-view columns**: from row 3 (for example AF3 `RP - BS - ADVANCED HORIZONTAL PUSH`).
- **`FUNCTIONAL BIOMECHANICS SYSTEM`** (BC): from cell colour, INFERRED. D9EAD3 means foundational, FFF2CC intermediate and F4CCCC advanced, following the coach's traffic light.
- **Columns with no level labels** (AH, AL, AR-AU, AZ): `any`.
- **AM**: row 3 reads `RP-BS-KNEE DOMINANT -ADVANCED`, the same text as AK3, so it is probably a copy-paste. AM is treated as `any`.

---

## 1. How the tags work

### 1.1 Constraint level, 1 to 5

This is the task's rubric, refined to match the coach's own definition: "a lot of reference points ... you sit down, put your feet on the ground, and move your hands or your feet".

| Level | Meaning | Library examples |
|---|---|---|
| 5 | Seated or lying in a selectorized machine with pads; fixed path | `Machine Row Close Grip`, `Machine bench press`, `Leg Extension Machine`, `Seated leg curls`, `Machine reverse fliez`. **`Leg press`** is plate-loaded but scored 5 because it is seated on a back pad with a fixed sled. |
| 4 | Plate-loaded or fixed-path machine; supported cable (seated pulldown, cable lateral raise leaning on the stack); chest-supported free weight | `Hack Squat Machine `, `Pendulum Squat`, `Lat Pulldown Wide Grip`, `Seal DB Rows ...`, `GHD`, `Hyper extensions `, `Spider Curls` |
| 3 | Standing cable; free weight supported by a bench or the floor; a box, wall or bench used as a depth or position reference | `Cable Standing Chest Press`, `DB Bench Press`, `DB Press on floor`, `Box. Goblet squat Touch and Go`, `Incline Push-ups`, `Glute Bridges`, `Landmine Squats` |
| 2 | Free weight or bodyweight, standing or closed-chain, with no external support | `Front Squats`, `Barbell Deadlifts`, `Standing DB Press`, `Push Ups `, `Bodyweight Squats`, all lunges, `DB Curls` |
| 1 | Open space: hanging, inverted, single-leg free, ballistic, or an unstable base | strict pull-up variants, `Handstand Push ups`, `Dips `, `Pistol Squats `, `Sissy Squats`, `DB Push press`, `Barbell Push Jerk`, thrusters, `KB swing`, `Renegade Rows` |

Two refinements to the task's rubric, both INFERRED:
- Bodyweight work on the floor or a bench (bridges, kneeling push-ups, incline push-ups) scores **3**, not 1, because the floor and bench are reference points.
- A box adds about one level. The coach puts box squats in **FOUNDATIONAL**, and ALL ABOUT SQUATS frames the box as a teaching constraint.

Mean constraint by implement class, over the 283 entries:

| Implement class | Mean constraint |
|---|---|
| machine | 4.43 |
| cable | 3.17 |
| cable-or-band (functional) | 2.53 |
| DB/KB | 2.32 |
| barbell-family | 2.20 |
| bodyweight | 2.12 |

### 1.2 Other tag fields

- **`stability_demand`, `skill_demand`, `load_ceiling`**: low, moderate or high, judged from the name. Barbell compounds have a high load ceiling. Most DB and selectorized work is moderate. Bodyweight, band and small-muscle isolation work is low.
- **`velocity_intent`**: the intended concentric speed.
  - `max_velocity`: jerks, `KB swing`, `Box. Any Squat Touch and Go fast`.
  - `fast`: push press, thrusters, banded or reverse-banded box squats.
  - `slow`: isometrics and the eccentric-only `Nordic Curl`.
  - `controlled`: everything else.
- **`force_velocity_zone`** (SCIENCE: the strength-velocity continuum as used in velocity-based training) means the zone where the exercise naturally lands at its usual load:
  - `absolute_strength`: barbell, hex and weighted-bodyweight compounds that are loaded heavy.
  - `accelerative_strength`: the default for loaded compounds in the 6-15 rep range.
  - `strength_speed`: loaded ballistic lifts and banded or speed box squats at about 50-70%.
  - `speed_strength`: light ballistic, i.e. `KB swing`.
  - `n/a`: isolation, core control, eccentric-only.
- **`suitable_for`**: computed from the tags with transparent rules (INFERRED):
  - `high_volume`: isolation or constraint >= 3, skill not high, not ballistic, stability not high.
  - `injured/pain`: constraint >= 3, low skill, controlled tempo, stability not high, and not a dip.
  - `older_adult`: low skill, not ballistic, and either constraint >= 3, or constraint 2 with low stability.
  - `beginner`: low skill, constraint >= 2, not ballistic.
  - `athlete_power`: fast intent, strength-speed or speed-strength zone, or an absolute-strength compound.
  - `no_gym`: can be done with DB + bench + bands, or with bodyweight only.
- **Equipment tiers** (`available_at_tier`) were checked against each exercise's `implement_requirement_groups` (AND of OR-groups):
  - **full_gym**: everything.
  - **commercial_basic**: barbell, rack and bench, DB, a few KB, cable stack, selectorized machines, common plate-loaded machines (leg press, hack squat), Smith, pull-up/dip station, assisted machine, 45-degree hyper bench, EZ bar, bands, TRX, stability ball. It has **no** hex bar, SSB, landmine, GHD, reverse hyper, pendulum, hip-thrust or good-morning machine, sled, sandbag or chains.
  - **home_db_bench_bands**: DBs, an adjustable bench, resistance bands with a door anchor, and household items (wall, step, chair, towel).
  - **home_plus_doorway_bar**: the home tier plus a pull-up bar.
  - **bands_only**: bands plus household items.
  - **bodyweight_only**: household items only.
- **`substitutes_by_equipment`** has five keys: `no_barbell`, `no_machine`, `bodyweight_only`, `db_only`, `bands_only`.
  - Each key is either `same exercise (already fits)` or a pick from the movement-family table.
  - Each pick has a `basis`:
    - `OBSERVED-lib`: an exercise that already exists in this library, with its cell.
    - `OBSERVED-MM`: something the coach wrote in the MASTER MODEL workbook.
    - `INFERRED`
  - Each pick has a `viability`: `viable`, `partial` or `none`.
  - The pick is level-matched: `F` options for foundational, intermediate and any; `A` options for advanced or high-skill exercises.

---

## 2. Implements and constraint per category

The table counts unique (category, level, name) entries, so duplicates in the level-view columns are not double-counted.

| group | n | machine | cable | barbell-family | DB/KB | bodyweight (+loaded, +TRX/rings) | band / cable-or-band / other | mean constraint (1-5) | constraint >=4 | constraint =1 | high skill |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `CORE PELVIS` | 3 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 3 (100%) | 0 (0%) | 2.33 | 0% | 33% | 33% |
| `VERTICAL PULL` | 20 | 10 (50%) | 0 (0%) | 0 (0%) | 1 (5%) | 9 (45%) | 0 (0%) | 2.65 | 50% | 35% | 15% |
| `HORIZONTAL PULL` | 16 | 3 (19%) | 1 (6%) | 6 (38%) | 4 (25%) | 2 (12%) | 0 (0%) | 3.19 | 44% | 6% | 6% |
| `VERTICAL PUSH` | 19 | 0 (0%) | 0 (0%) | 7 (37%) | 10 (53%) | 2 (11%) | 0 (0%) | 1.74 | 0% | 42% | 26% |
| `HORIZONTAL PUSH` | 27 | 2 (7%) | 3 (11%) | 1 (4%) | 7 (26%) | 14 (52%) | 0 (0%) | 2.74 | 7% | 7% | 7% |
| `SIDE RAISES` | 12 | 1 (8%) | 2 (17%) | 1 (8%) | 8 (67%) | 0 (0%) | 0 (0%) | 2.75 | 25% | 0% | 0% |
| `BILATERAL KNEE DOMINANT` | 35 | 7 (20%) | 0 (0%) | 16 (46%) | 8 (23%) | 4 (11%) | 0 (0%) | 2.60 | 23% | 11% | 31% |
| `UNILATERAL KNEE DOMINANT` | 13 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 13 (100%) | 0 (0%) | 1.92 | 0% | 8% | 8% |
| `LEG EXTENSIONS` | 1 | 1 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 5.00 | 100% | 0% | 0% |
| `BILATERAL HIP DOMNANT` | 33 | 9 (27%) | 1 (3%) | 9 (27%) | 6 (18%) | 7 (21%) | 1 (3%) | 2.88 | 27% | 3% | 15% |
| `UNILATERAL HIP DOMINANT` | 8 | 0 (0%) | 0 (0%) | 2 (25%) | 3 (38%) | 3 (38%) | 0 (0%) | 2.38 | 0% | 0% | 12% |
| `LEG CURLS` | 2 | 2 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 5.00 | 100% | 0% | 0% |
| `BICEP` | 14 | 0 (0%) | 1 (7%) | 3 (21%) | 9 (64%) | 1 (7%) | 0 (0%) | 2.50 | 7% | 0% | 0% |
| `TRICEP` | 9 | 0 (0%) | 4 (44%) | 1 (11%) | 4 (44%) | 0 (0%) | 0 (0%) | 2.78 | 0% | 0% | 0% |
| `CALVES` | 5 | 2 (40%) | 0 (0%) | 1 (20%) | 2 (40%) | 0 (0%) | 0 (0%) | 2.60 | 20% | 0% | 0% |
| `FULL FOCUS LIST` | 49 | 9 (18%) | 6 (12%) | 8 (16%) | 16 (33%) | 10 (20%) | 0 (0%) | 2.88 | 22% | 4% | 12% |
| `FUNCTIONAL BIOMECHANICS SYSTEM` | 17 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 17 (100%) | 2.53 | 0% | 0% | 0% |
| **ALL** | 283 | 46 (16%) | 18 (6%) | 55 (19%) | 78 (28%) | 68 (24%) | 18 (6%) | 2.66 | 19% | 10% | 13% |

What the table shows (OBSERVED counts; interpretation INFERRED):

- **`VERTICAL PUSH` has no machines and no cables.** 19 entries: 10 DB/KB, 7 barbell, 2 bodyweight. It has the lowest mean constraint (1.74) of any resistance category, and 42% of its entries are ballistic or open-space (level 1).
  - It is built from **7 DB/barbell pairs**: incline seated, push press, push jerk, Z-press, kneeling, standing, thrusters.
  - Its progression variable is the **base of support**: seated → floor → kneeling → standing → inverted. A machine shoulder press does not appear.
- **`VERTICAL PULL` is either machine or bodyweight.** 10/20 are machine (lat pulldown ×6 grips, assisted pull-up machine ×3 grips, `Unilateral Lat Pulldowns `) and 9/20 are bodyweight or suspension.
  - It contains **no barbell and almost no free weight**; the only free-weight entry is `KB Face Pulls `, which is misfiled.
- **`HORIZONTAL PULL` covers the whole spectrum**: 3 machine rows (constraint 5), 2 seal rows with barbell and 2 with DB (chest-supported, 4), 4 bent-over barbell rows (2), and `Renegade Rows` (1).
- **`UNILATERAL KNEE DOMINANT` names no implement in any of its 13 items.** This is the most equipment-robust category: all 13 are available at every tier. The coach loads lunges through a separate variable list (RESISTANCE PATTERNS C19-C36).
- **`LEG EXTENSIONS` and `LEG CURLS` are 100% machine.** They are the only categories with a single implement.
- **`FUNCTIONAL BIOMECHANICS SYSTEM` (BC) is all "cable or band"**: 17/17. The coach writes both options into the names (`kneeling cable or banded crunch`, `cable or band anti-rotational pallof hold`). It is the only category that is equipment-flexible by design.

---

## 3. Does FOUNDATIONAL lean on machines and ADVANCED on barbell or bodyweight skill?

**Answer: yes overall. But the rule is upper-body specific, and it reverses for the legs.**

| group | n | machine | cable | barbell-family | DB/KB | bodyweight (+loaded, +TRX/rings) | band / cable-or-band / other | mean constraint (1-5) | constraint >=4 | constraint =1 | high skill |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **FOUNDATIONAL** (6 levelled categories) | 53 | 16 (30%) | 2 (4%) | 7 (13%) | 12 (23%) | 15 (28%) | 1 (2%) | 2.98 | 32% | 9% | 6% |
| **INTERMEDIATE** (6 levelled categories) | 24 | 8 (33%) | 1 (4%) | 7 (29%) | 5 (21%) | 3 (12%) | 0 (0%) | 3.00 | 33% | 0% | 12% |
| **ADVANCED** (6 levelled categories) | 61 | 6 (10%) | 0 (0%) | 24 (39%) | 12 (20%) | 19 (31%) | 0 (0%) | 2.21 | 16% | 28% | 34% |
| **ANY** (6 levelled categories) | 12 | 1 (8%) | 2 (17%) | 1 (8%) | 7 (58%) | 1 (8%) | 0 (0%) | 2.67 | 8% | 8% | 0% |

Across the 6 categories that have explicit levels (OBSERVED level blocks):

| Level | Mean constraint | Constraint >=4 | Machine or cable | Constraint = 1 | High skill | Barbell-family |
|---|---|---|---|---|---|---|
| FOUNDATIONAL | **2.98** | 32% | 34% | 9% | 6% | 13% |
| ADVANCED | **2.21** | 16% | 10% | **28%** | **34%** | **39%** |
| MODERATE/INTERMEDIATE | 3.00 | 33% | **38%** | 0% | 12% | 29% |

The MODERATE/INTERMEDIATE row is also the most machine-heavy of the three.

By category and level:

| group | n | machine | cable | barbell-family | DB/KB | bodyweight (+loaded, +TRX/rings) | band / cable-or-band / other | mean constraint (1-5) | constraint >=4 | constraint =1 | high skill |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `VERTICAL PULL` / foundational | 12 | 9 (75%) | 0 (0%) | 0 (0%) | 1 (8%) | 2 (17%) | 0 (0%) | 3.50 | 75% | 0% | 0% |
| `VERTICAL PULL` / advanced | 7 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 7 (100%) | 0 (0%) | 1.00 | 0% | 100% | 43% |
| `VERTICAL PULL` / any | 1 | 1 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 4.00 | 100% | 0% | 0% |
| `HORIZONTAL PULL` / foundational | 5 | 3 (60%) | 0 (0%) | 0 (0%) | 0 (0%) | 2 (40%) | 0 (0%) | 4.00 | 60% | 0% | 0% |
| `HORIZONTAL PULL` / advanced | 9 | 0 (0%) | 0 (0%) | 6 (67%) | 3 (33%) | 0 (0%) | 0 (0%) | 2.78 | 44% | 11% | 11% |
| `HORIZONTAL PULL` / any | 2 | 0 (0%) | 1 (50%) | 0 (0%) | 1 (50%) | 0 (0%) | 0 (0%) | 3.00 | 0% | 0% | 0% |
| `VERTICAL PUSH` / foundational | 6 | 0 (0%) | 0 (0%) | 3 (50%) | 3 (50%) | 0 (0%) | 0 (0%) | 1.67 | 0% | 67% | 50% |
| `VERTICAL PUSH` / advanced | 9 | 0 (0%) | 0 (0%) | 3 (33%) | 4 (44%) | 2 (22%) | 0 (0%) | 1.67 | 0% | 33% | 22% |
| `VERTICAL PUSH` / any | 4 | 0 (0%) | 0 (0%) | 1 (25%) | 3 (75%) | 0 (0%) | 0 (0%) | 2.00 | 0% | 25% | 0% |
| `HORIZONTAL PUSH` / foundational | 6 | 1 (17%) | 1 (17%) | 0 (0%) | 1 (17%) | 3 (50%) | 0 (0%) | 3.33 | 17% | 0% | 0% |
| `HORIZONTAL PUSH` / intermediate | 5 | 1 (20%) | 1 (20%) | 0 (0%) | 1 (20%) | 2 (40%) | 0 (0%) | 3.20 | 20% | 0% | 0% |
| `HORIZONTAL PUSH` / advanced | 11 | 0 (0%) | 0 (0%) | 1 (9%) | 2 (18%) | 8 (73%) | 0 (0%) | 2.18 | 0% | 18% | 18% |
| `HORIZONTAL PUSH` / any | 5 | 0 (0%) | 1 (20%) | 0 (0%) | 3 (60%) | 1 (20%) | 0 (0%) | 2.80 | 0% | 0% | 0% |
| `BILATERAL KNEE DOMINANT` / foundational | 12 | 1 (8%) | 0 (0%) | 4 (33%) | 4 (33%) | 3 (25%) | 0 (0%) | 2.75 | 17% | 0% | 0% |
| `BILATERAL KNEE DOMINANT` / intermediate | 9 | 2 (22%) | 0 (0%) | 5 (56%) | 2 (22%) | 0 (0%) | 0 (0%) | 2.67 | 22% | 0% | 33% |
| `BILATERAL KNEE DOMINANT` / advanced | 14 | 4 (29%) | 0 (0%) | 7 (50%) | 2 (14%) | 1 (7%) | 0 (0%) | 2.43 | 29% | 29% | 57% |
| `BILATERAL HIP DOMNANT` / foundational | 12 | 2 (17%) | 1 (8%) | 0 (0%) | 3 (25%) | 5 (42%) | 1 (8%) | 2.75 | 17% | 8% | 0% |
| `BILATERAL HIP DOMNANT` / intermediate | 10 | 5 (50%) | 0 (0%) | 2 (20%) | 2 (20%) | 1 (10%) | 0 (0%) | 3.20 | 50% | 0% | 0% |
| `BILATERAL HIP DOMNANT` / advanced | 11 | 2 (18%) | 0 (0%) | 7 (64%) | 1 (9%) | 1 (9%) | 0 (0%) | 2.73 | 18% | 0% | 45% |
| `UNILATERAL HIP DOMINANT` / foundational | 8 | 0 (0%) | 0 (0%) | 2 (25%) | 3 (38%) | 3 (38%) | 0 (0%) | 2.38 | 0% | 0% | 12% |
| `CORE PELVIS` / intermediate | 2 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 2 (100%) | 0 (0%) | 3.00 | 0% | 0% | 0% |
| `CORE PELVIS` / advanced | 1 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 1 (100%) | 0 (0%) | 1.00 | 0% | 100% | 100% |
| `FUNCTIONAL BIOMECHANICS SYSTEM` / foundational | 9 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 9 (100%) | 2.56 | 0% | 0% | 0% |
| `FUNCTIONAL BIOMECHANICS SYSTEM` / intermediate | 4 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 4 (100%) | 2.50 | 0% | 0% | 0% |
| `FUNCTIONAL BIOMECHANICS SYSTEM` / advanced | 4 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 4 (100%) | 2.50 | 0% | 0% | 0% |

The pattern (INFERRED from the counts above):

1. **Upper-body pulls follow the coach's statement exactly.**
   - `VERTICAL PULL` FOUNDATIONAL is 9/12 machine (mean constraint 3.5). ADVANCED is 7/7 bodyweight strict or weighted pull-ups (mean 1.0, 43% high skill).
   - `HORIZONTAL PULL` FOUNDATIONAL is 3/5 machine and 2/5 suspension or bar (mean 4.0). ADVANCED is 6/9 barbell and 3/9 DB (0 machines).
   - So machines are where the pull pattern is learned, and free bodyweight or barbell is where it is earned.
2. **`HORIZONTAL PUSH`** goes from cable, machine, floor press and kneeling or incline push-ups at FOUNDATIONAL (mean 3.33), to push-ups plus flies at MODERATE (cable and machine flies included), to **73% bodyweight-skill** at ADVANCED. The ADVANCED bodyweight items are decline, feet-on-wall, diamond, deficit and dips; the rest of the block is DB and barbell bench (mean 2.18, 0 machines).
3. **The legs invert the rule.**
   - Lower-body machines sit at **MODERATE and ADVANCED**, not FOUNDATIONAL:
     - `BILATERAL KNEE DOMINANT` machines by level: FOUNDATIONAL 1/12 (only `Leg Extension Machine`), MODERATE 2/9 (`Hack Squat Machine `, `Leg Extension Machine`), ADVANCED **4/14** (`Hack Squats`, `Leg press`, `Pendulum Squat`, `Leg Extension Machine`).
     - `BILATERAL HIP DOMNANT` machines and cables by level: FOUNDATIONAL 3/12, **MODERATE 5/10** (`GHD`, `Hip Thrust Machine`, `Machine Good Mornings`, `Machine Leg Curls (Seated and Laying Down)`, `Hyper extensions `), ADVANCED 2/11.
   - Foundational legs are bodyweight, goblet, box, landmine and hex bar (`Bodyweight Squats`, `Box Squats`, `Goblet KB/DB Squats`, `Landmine Squats`, `Hex Bar Squats`), plus bridges and KB deadlifts.
   - This fits the coach's other reason for machines, **"for people who want to go up in volume"**, and ALL ABOUT SQUATS I35 on `LEG PRESS`: "Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure". For the legs, machines are **volume and local-fatigue tools for trained people**, not a beginner on-ramp. The beginner on-ramp for legs is the **box** and the **goblet/hex/landmine** loads. All 9 box squats are in AI: 3 are FOUNDATIONAL constraint tools (`Box. Zercher squat Touch and Go`, `Box. Goblet squat Touch and Go`, `Box Squats`) and 6 are ADVANCED speed or band methods (AI91-AI96). The same implement serves both ends of the ladder. ALL ABOUT SQUATS ranks hex bar `EASIEST` and goblet `EASIER`.
4. **`VERTICAL PUSH` FOUNDATIONAL is the least constrained FOUNDATIONAL block in the library** (mean 1.67; 4/6 ballistic). Every other foundational block scores 2.38-4.00, and its own ADVANCED block is no lower (1.67). The cause is that `DB Push press`, `Barbell push press`, `DB Push Jerk` and `Barbell Push Jerk` are filed under FOUNDATIONAL (AA11-AA14), next to the two seated presses. The coach's own traffic light in RESISTANCE PATTERNS E8-E15 makes seated presses green and standing presses red. Either the push press and jerk are mis-levelled, or "foundational" here means "foundational athletic pattern". **Open question.**
5. **Unilateral work is mostly unlevelled.** 33 of the 117 `any`-level entries are unilateral, because U, X, AA and AD put all unilateral options in one `UNILATERAL` block with zone `ANY`. AL and AQ have no levels either. The coach does not progress unilateral work by level; he progresses it by **stance and load position** (RESISTANCE PATTERNS FEET POSITIONING, GET INTO/OUT OF THE HIP).
6. **Suitability follows level** (rule-based, INFERRED):

   | Level | Beginner-suitable | Injured/pain-suitable | Athlete-power | No-gym capable |
   |---|---|---|---|---|
   | FOUNDATIONAL | 41/53 (77%) | 30/53 | 7/53 | 17/53 |
   | ADVANCED | 10/61 (16%) | 10/61 | 17/61 | 25/61 |

   Advanced has more no-gym options than foundational because so many advanced entries are bodyweight-skill (pull-ups, decline, deficit and feet-on-wall push-ups, HSPU, pistols).

---

## 4. Big vs small muscles: is isolation done on machines, cables and DBs?

| group | n | machine | cable | barbell-family | DB/KB | bodyweight (+loaded, +TRX/rings) | band / cable-or-band / other | mean constraint (1-5) | constraint >=4 | constraint =1 | high skill |
|---|---|---|---|---|---|---|---|---|---|---|---|
| big-muscle compound categories (pulls, pushes, knee/hip dominant) | 204 | 39 (19%) | 7 (3%) | 48 (24%) | 49 (24%) | 60 (29%) | 1 (0%) | 2.65 | 22% | 12% | 17% |
| big muscle, isolation (`LEG EXTENSIONS`, `LEG CURLS`) | 3 | 3 (100%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 5.00 | 100% | 0% | 0% |
| small muscles (`SIDE RAISES`, `BICEP`, `TRICEP`, `CALVES`, focus-list equivalents) | 53 | 4 (8%) | 11 (21%) | 7 (13%) | 29 (55%) | 2 (4%) | 0 (0%) | 2.62 | 11% | 2% | 0% |
| core / functional | 23 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 6 (26%) | 17 (74%) | 2.57 | 4% | 4% | 4% |

| group | n | machine | cable | barbell-family | DB/KB | bodyweight (+loaded, +TRX/rings) | band / cable-or-band / other | mean constraint (1-5) | constraint >=4 | constraint =1 | high skill |
|---|---|---|---|---|---|---|---|---|---|---|---|
| compound | 184 | 30 (16%) | 5 (3%) | 48 (26%) | 45 (24%) | 55 (30%) | 1 (1%) | 2.53 | 20% | 14% | 18% |
| isolation | 76 | 16 (21%) | 13 (17%) | 7 (9%) | 33 (43%) | 7 (9%) | 0 (0%) | 3.01 | 24% | 1% | 1% |
| core_control | 23 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 6 (26%) | 17 (74%) | 2.57 | 4% | 4% | 4% |

- **Yes. Isolation is done with machines, cables and DBs.**
  - Isolation entries: 38% machine or cable, 43% DB/KB, 9% barbell-family (EZ curls, barbell curls, barbell front raise, barbell calf raise), and only 9% bodyweight.
  - Their mean constraint is 3.01, against 2.53 for compound entries, and only 1% of isolation entries are high-skill.
- **Small muscles are DB-first.** This covers 53 entries: `SIDE RAISES`, `BICEP`, `TRICEP`, `CALVES` and their focus-list equivalents.
  - 55% are DB/KB, 28% machine or cable, 13% barbell-family (EZ bar, barbell curl, barbell front raise, barbell calf raise) and 4% bodyweight.
  - **0% are high skill.** The only constraint-1 item is the focus-list `dips` (AZ128) under `TRICEP 👇`.
  - `TRICEP` (AT) is the most cable-heavy at 4/9: 3 pushdowns plus the overhead cable extension.
- **Big-muscle isolation (`LEG EXTENSIONS`, `LEG CURLS`) is 100% machine** at constraint 5. This matches the coach's split between "bigger muscles", "smaller muscles" and "biomechanics": big muscles get patterns, plus one machine isolation slot each for quads and hamstrings.
- **Big-muscle compounds use every implement.** 24% barbell, 24% DB/KB, 29% bodyweight, 23% machine or cable. **All 18 absolute-strength entries are big-muscle compounds** (barbell, hex or weighted bodyweight).
- In practice for a generator: small-muscle slots can always be filled from DBs, which covers 8/12 side raises, 9/14 biceps, 4/9 triceps and 3/5 calves. Bands are the only no-DB fallback (section 7). Bodyweight-only has **no** biceps or lateral-raise option at all.

---

## 5. Speed, load and force-velocity in the resistance library

**What the coach says.** All of the following are OBSERVED in the MASTER MODEL workbook:

| Source | What it says |
|---|---|
| ALL ABOUT SQUATS A44-A48 | `'HEAVY BARBELL'` → `'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS'`; `'LIGHT BARBELL '` → `'ECCENTRICFAST LESS MUSCLE RECRUITMENT'` |
| ALL ABOUT SQUATS, bands (B36, C35) | `'Weight should be lower ranges around 50% so you can move fast'`; `'Bands are designed for speed/velocity'` |
| ALL ABOUT SQUATS, chains (C39, A40, B40) | `'Chains are designed for magnitude influence, loading'`, `'*INTENSIONALLY SLOW YOU DOWN'`, `'Weght can be moderate around 70%'` |
| (NOT DONE) 4 TRACKS PROGRAMMING, `'FAST RPE6 or about 60-70%'` (N17, N21) | The same lifts appear with a **`HEAVY` or `FAST` prefix**: `'HEAVY BENCH PRESS'` (E13) vs `'FAST BANDED BENCH PRESS'` / `'FAST DB OH PRESS'` (E21, F21) |
| CONJUGATE | `'HEAVY DEADLIFT'` / `'FAST DEADLIFT'`, `'HEAVY (D)BOX HIGH BAR SQUAT'` / `'FAST HIGH BAR (D)BOX'` |
| BASEBALL BU33 | `'Front squats - light weights - same speed for all reps'` |

This is the user's rule ("the heavier I go, the slower; the lighter, the faster") written into the sheets.

**In the program sheets, speed is a modifier on an existing exercise.** In the library, speed has almost no entries of its own:

| What | Count |
|---|---|
| Velocity intent | 259/283 controlled, **16 fast or max-velocity**, 8 slow (isometric or eccentric) |
| Force-velocity zone | 137 accelerative strength, 18 absolute strength, 15 strength-speed, 1 speed-strength, 0 starting-strength or reactive, 112 n/a |

**Where the fast entries are:** `DB Push press` (AA11, foundational); `Barbell push press` (AA12, foundational); `DB Push Jerk` (AA13, foundational); `Barbell Push Jerk` (AA14, foundational); `DB Thrusters` (AA54, advanced); `Barbell Thrusters` (AA55, advanced); `Single arm DB thrusters` (AA94, any); `Box. Any Squat Touch and Go fast` (AI91, advanced); `Box. Any Squat Touch and Go (Banded)` (AI92, advanced); `Box. Any Squat Touch and Go (Reverse Banded)` (AI93, advanced); `Box. Squat Deload (banded)` (AI95, advanced); `Box. Any Squat Deload (reverse banded)` (AI96, advanced); `DB thrusters` (AI102, advanced); `Barbell Thrusters` (AI103, advanced); `Single arm DB thruster` (AI104, advanced); `KB swing` (AN20, foundational).

Those fast entries fall in 3 categories. `VERTICAL PUSH`: push press, jerks and thrusters. `BILATERAL KNEE DOMINANT` ADVANCED: the box speed methods and thrusters. `BILATERAL HIP DOMNANT` FOUNDATIONAL: `KB swing`.

**Absolute-strength entries:** `Weighted Pull ups` (U52); `Barbell bench Press` (AD95); `Weighted Dips` (AD97); `Hex Bar Squats` (AI17); `Flipped Hex Bar Squats` (AI18); `Front Squats` (AI46); `High Bar Back Squat` (AI49); `Low Bar Back Squat` (AI50); `Hex Bar Deadlifts` (AN47); `Shoulder Wide Grip Deadlift` (AN49); `Barbell Deadlifts` (AN92); `Sumo Deadlifts` (AN94); `Wide Grip Barbell Deadlift` (AN95); `Snatch Grip Barbell Deadlift` (AN96); `Back squats` (AZ12); `barbell overhead press` (AZ46); `Barbell deadlifts` (AZ206); `bench press` (AZ246).

Consequences for the generator (INFERRED):

- **Velocity must be a variable on the slot, not a property of the exercise.** One exercise (`Barbell bench Press`, `Front Squats`, `Barbell Deadlifts`) gets `HEAVY` (about 80-90%, slow, low reps) or `FAST` (about 50-70%, maximal intent, often banded) depending on the block.
- **Bands are the coach's speed implement and chains are his strength implement.** A client who has bands but no barbell can still do the speed variable: banded pulldowns ('Banded fast LAT PULL DOWNS Single Arm'), banded KB swings, reverse-banded jumps.
- **Light implements live in the ATHLETIC columns**, which another team covers: C `TRIPPLE EXTENSION`, G `PLYOS`, K `THROWING`. This resistance range holds no med-ball entries except `Harmstring MedBall Curls`, which is a bodyweight curl on a ball. The user's 8-10 lb med-ball rule belongs to the throwing slots, not to these columns.
- **Range of motion (ROM) is also encoded as a variable in the names.** Of the 283 entries:
  - 18 are `mid`: floor presses, hip thrusts and bridges, and isometric core holds.
  - 11 are `variable`: the box squats, where box height sets depth, and `Cable Machine Curls (Zone1, Zone 2, Zone 3`.
  - 3 are `end_range`: floor glute bridges.
  - Several `full` entries carry a deficit or extra-ROM note in `rom_notes`: `Elevated Push ups (for full ROM)`, `Deficit Push-ups`, `Elevated Reverse Lunge`, both `(use deficit)` calf raises, `Flipped Hex Bar Squats `, `Wide Grip Barbell Deadlift`, `Snatch Grip Barbell Deadlift`, and the FFE/RFE lunges.
  - RESISTANCE PATTERNS A81-A89 make ROM (`Elevated` → `Floor` → `Deficit`) and end range (`Dead stop` → `Touch & go`) explicit, colour-graded variables.

---

## 6. Availability tiers: how much of the coach's menu survives

The table counts unique names per category that can be done **as written** at each equipment tier. Ambiguous implements count as available if any alternative is available.

| category | unique names | full gym | commercial basic | home DB+bench+bands | home + doorway bar | bands only | bodyweight only |
|---|---|---|---|---|---|---|---|
| `CORE PELVIS` | 3 | 3 (100%) | 3 (100%) | 2 (67%) | 3 (100%) | 2 (67%) | 2 (67%) |
| `VERTICAL PULL` | 20 | 20 (100%) | 20 (100%) | **0** (0%) | 8 (40%) | **0** (0%) | **0** (0%) |
| `HORIZONTAL PULL` | 16 | 16 (100%) | 16 (100%) | 4 (25%) | 4 (25%) | **0** (0%) | **0** (0%) |
| `VERTICAL PUSH` | 19 | 19 (100%) | 18 (95%) | 12 (63%) | 12 (63%) | 2 (11%) | 2 (11%) |
| `HORIZONTAL PUSH` | 25 | 25 (100%) | 25 (100%) | 17 (68%) | 17 (68%) | 10 (40%) | 10 (40%) |
| `SIDE RAISES` | 12 | 12 (100%) | 12 (100%) | 8 (67%) | 8 (67%) | **0** (0%) | **0** (0%) |
| `BILATERAL KNEE DOMINANT` | 33 | 33 (100%) | 28 (85%) | 13 (39%) | 13 (39%) | 3 (9%) | 3 (9%) |
| `UNILATERAL KNEE DOMINANT` | 13 | 13 (100%) | 13 (100%) | 13 (100%) | 13 (100%) | 13 (100%) | 13 (100%) |
| `LEG EXTENSIONS` | 1 | 1 (100%) | 1 (100%) | **0** (0%) | **0** (0%) | **0** (0%) | **0** (0%) |
| `BILATERAL HIP DOMNANT` | 32 | 32 (100%) | 26 (81%) | 8 (25%) | 8 (25%) | 4 (12%) | 4 (12%) |
| `UNILATERAL HIP DOMINANT` | 8 | 8 (100%) | 8 (100%) | 6 (75%) | 6 (75%) | 3 (38%) | 3 (38%) |
| `LEG CURLS` | 2 | 2 (100%) | 2 (100%) | **0** (0%) | **0** (0%) | **0** (0%) | **0** (0%) |
| `BICEP` | 14 | 14 (100%) | 14 (100%) | 9 (64%) | 9 (64%) | **0** (0%) | **0** (0%) |
| `TRICEP` | 9 | 9 (100%) | 9 (100%) | 4 (44%) | 4 (44%) | **0** (0%) | **0** (0%) |
| `CALVES` | 5 | 5 (100%) | 5 (100%) | 3 (60%) | 3 (60%) | 1 (20%) | 1 (20%) |
| `FULL FOCUS LIST` | 49 | 49 (100%) | 49 (100%) | 23 (47%) | 25 (51%) | 5 (10%) | 5 (10%) |
| `FUNCTIONAL BIOMECHANICS SYSTEM` | 17 | 17 (100%) | 17 (100%) | 17 (100%) | 17 (100%) | 17 (100%) | **0** (0%) |
| **ALL** | 267 | 267 (100%) | 255 (96%) | 135 (51%) | 146 (55%) | 59 (22%) | 42 (16%) |

- **A commercial basic gym loses only 12 of 267 names (4%).** All 12 need specialty kit:
  - Hex bar: `Hex Bar Squats`, `Flipped Hex Bar Squats `, `Hex Bar Deadlifts`.
  - Landmine: `Landmine Squats`, `Landmine Hack Squat `, `Kneeling Landmine Press`.
  - Specialty machines: `Pendulum Squat`, `Hip Thrust Machine`, `Machine Good Mornings`, `Reverse Hyper Extension`, `GHD`.
  - Sandbag: `Sandbag Hip Thrusts`.
- **At home with DB + bench + bands, about half survives as written** (135/267, 51%). Adding a doorway bar raises that to 146.
  - **Categories at 0 as written: `VERTICAL PULL` (0/20), `LEG EXTENSIONS` (0/1), `LEG CURLS` (0/2).** Every one of them has a band or DB substitute in section 7.
- **Bands only: 59/267 (22%).** **Bodyweight only: 42/267 (16%).**
  - At both tiers, `VERTICAL PULL`, `HORIZONTAL PULL`, `SIDE RAISES`, `BICEP`, `TRICEP`, `LEG EXTENSIONS` and `LEG CURLS` drop to **0 as written**.
  - `FUNCTIONAL BIOMECHANICS SYSTEM` drops to 0 at bodyweight only.

---

## 7. Substitution ladders by equipment availability, per category

The ladder runs **full gym → commercial basic → home (DB + bench + bands) → bands only → bodyweight only**.

Picks are taken from the library first (cell given), then from the MASTER MODEL workbook (OBSERVED-MM), then INFERRED. Level-matched F and A options are stored per record in `substitutes_by_equipment`.

Flags:
- **⛔ NONE**: no exercise of the same pattern is possible at that tier.
- **◐ PARTIAL**: the pattern survives, but load, specificity or a household fixture is a compromise.

| Category | Full gym | Commercial basic | Home: DB + bench + bands | Bands only | Bodyweight only |
|---|---|---|---|---|---|
| `VERTICAL PULL` | all 20. F: `Lat Pulldown ...` (U9-U14), `Assisted Pull-Up Machine ...` (U16-U18). A: strict pull-up variants (U46-U51), `Weighted Pull ups ` (U52). UL: `Unilateral Lat Pulldowns ` (U91) | 20/20 (TRX version if TRX is present) | 0/20 as written. **Band lat pulldown** from a high door anchor. OBSERVED-MM: `'Banded fast LAT PULL DOWNS Single Arm'` (EXAMPLE ATHLETIC FULL BODY SPLI C27), `'Max speed banded lat pull downs half kneeling ipsilateral'` (F47). With a doorway bar: `Assisted  Pull-Up w bands` (U15), strict pull-ups, `Chin Ups` (8/20). DB only: ◐ DB pullover (INFERRED) | band pulldowns (needs a high anchor) | **⛔ NONE.** No vertical pull without a bar or anchor. Fallback: `Inverted Rows` (X13) under a table, which is a horizontal pull. **Recommend a doorway bar or bands.** |
| `HORIZONTAL PULL` | all 16 | 16/16 (seal bench improvised on boxes) | `DB/ Kb Rows` (X91); `Seal DB Rows ...` (X52/X53) as an incline-bench chest-supported row; `Renegade Rows` (X54) | band row. OBSERVED-MM `'... cable row or band row or Bird Dog Row'`. Athletic version: half-kneeling single-arm band row, `'Split stance ALWAYS contralateral'` (RESISTANCE PATTERNS G83) | ◐ inverted row under a sturdy table. The coach's `'Incline/Paralell reverse pushup (rings/trx/barbell/smith machine)'` (RESISTANCE PATTERNS G64/G65) |
| `VERTICAL PUSH` | all 19 | 18/19 (no landmine) | 12/19. Every barbell press has a DB twin: `Incline Seated DB Press` (AA9), `DB Z Press on floor` (AA46), `Kneeling DB Press` (AA48), `Standing DB Press` (AA50), `DB Push press` (AA11), `DB Push Jerk` (AA13), `DB Thrusters` (AA54), `Sesaw Db Press` (AA91) | band overhead press (INFERRED); `Pike Push Ups` (AA53); `Handstand Push ups` (AA52). ◐ ballistic: band thruster | `Pike Push Ups` (AA53) → `Handstand Push ups` (AA52). ◐ No loaded ballistic overhead push: use fast-intent pike push-ups, or med-ball throws if a ball exists |
| `HORIZONTAL PUSH` | all 25 | 25/25 | 17/25. `DB Press on floor` (AD10), `DB Bench Press` (AD94), `Incline DB Bench Press` (AD91), `Bench DB Flies ` (AD48), the alternating DB presses, all push-ups | push-up family (10/25) + band chest press / band fly (INFERRED; mirrors `Cable Standing Chest Press` AD9 and `Cable flies` AD49) | `Kneeling Push Ups` (AD11) → `Incline Push-ups` (AD12) → `Push Ups ` (AD47) → `Declined Pushups` (AD98), `Deficit Push-ups` (AF18), `Push ups (Feet on Wall)` (AD92), `Diamond Push ups` (AD93). ◐ flies: slider/towel fly |
| `SIDE RAISES` (abduction, front, rear) | all 12 | 12/12 | 8/12, all the DB versions (AH9-AH12, AH15-AH18) | band lateral, front and rear raises; band pull-apart / face pull (INFERRED) | **⛔ NONE for lateral and front raises** (household weight only). ◐ rear delt: prone floor Y/T (from RESISTANCE PATTERNS K21-K22) |
| `BILATERAL KNEE DOMINANT` | all 33 | 28/33. Loses hex ×2, landmine ×2, `Pendulum Squat` | 13/33. `Goblet KB/DB Squats` (AI11), `Box. Goblet squat Touch and Go` (AI10), `Low DB Squats` (AI15), `High Zercher DB Squats ` (AI47), `Sumo Squats w/ DB or KB ` (AI19), `DB thrusters` (AI102) | ◐ band squat. Coach's `'reverse banded squat jumps'` (ALL ABOUT SQUATS I18) | F: `Bodyweight Squats` (AI12), `Box Squats` (AI13). A: ◐ bilateral bodyweight is too light, so overload moves to `Pistol Squats ` (AL13) / `Sissy Squats` (AI100) |
| `UNILATERAL KNEE DOMINANT` | all 13 | 13/13 | 13/13, DB-loaded contralateral / ipsilateral / double (RESISTANCE PATTERNS C19-C30) | 13/13 (band under the front foot, INFERRED) | 13/13. **The most equipment-proof category.** |
| `LEG EXTENSIONS` (+ `Leg Extension Machine`) | machine | machine | **`'DB leg extensions on box'`** (RESISTANCE PATTERNS A41, with video B41) | **`'banded leg extensions on bench'`** (RESISTANCE PATTERNS A40, with video B40) | `Sissy Squats` (AI100), assisted at a door frame |
| `BILATERAL HIP DOMNANT` | all 32 | 26/32. Loses `Hex Bar Deadlifts`, `GHD`, `Reverse Hyper Extension`, `Hip Thrust Machine`, `Machine Good Mornings`, `Sandbag Hip Thrusts` | 8/32. `DB Deadlifts` (AN46), `DB Hip Thrusts` (AN53), `DB Harmstring Curls` (AN101), bridges, slider curls, `Nordic Curl` (AN91). A: go unilateral, e.g. `Staggered Stance DL w/ DB ` (AQ12), `'heavy rear foot on wall db deadlift'` | ◐ band pull-through, band deadlift, band good morning (INFERRED); `Banded rolling hamstring curls` (OBSERVED-MM) | `Glute Bridges` (AN9), `Elevated Feet on Bench Glute Bridges` (AN10), `Supine Glidder hamstring curls` (AN18, towel), `Nordic Curl` (AN91, couch anchor). ◐ No loaded hinge: bodyweight single-leg RDL |
| `UNILATERAL HIP DOMINANT` | all 8 | 8/8 | 6/8, the DB versions plus bridges | ◐ band staggered RDL; SL bridges and thrusts | `SL Glute Bridges ...` (AQ9/AQ10), `SL Hip thrusts` (AQ11). ◐ hinge |
| `LEG CURLS` | machine (AR9, AR10) | machine | `DB Harmstring Curls` (AN101) | **`'Banded rolling hamstring curls'`** (MASTER_MODEL BASEBALL) | `Supine Glidder hamstring curls` (AN18) → `Nordic Curl` (AN91) |
| `BICEP` | all 14 | 14/14 | 9/14 DB curls (+ `TRX Bicep Curls` if TRX) | band curl (INFERRED) | **⛔ NONE.** Towel isometric; `Chin Ups` (U50) only if a bar exists |
| `TRICEP` | all 9 | 9/9 | 4/9. `DB Kickbacks (Uni/Bi)` (AT10), `Overhead DB Tricep Extension` (AT11), `Floor DB Skullcrushers` (AT12), `Tate Press` (AT15) | **`'overhead band tricep ext'`** (OBSERVED-MM) + band pushdown | ◐ `Diamond Push ups` (AD93), bench dips, bodyweight skull crusher on a table edge |
| `CALVES` | all 5 | 5/5 | 3/5 (`Standing DB calf Raises (Use Deficit)` AU10) | single-leg deficit calf raise on a step / band calf raise | single-leg deficit calf raise on a step (bodyweight form of AU9) |
| `CORE PELVIS` (S-T) | 3/3 | 3/3 | 2/3. `Hanging rotational knees to chest` (T9) needs a bar → use `Reverse Crunches` (R10) / `Leg Raises` (R9) | 2/3 | 2/3 + R-column swaps |
| `FUNCTIONAL BIOMECHANICS SYSTEM` (BC) | cable | cable | band (allowed by every name) | 17/17 band | ◐ no line of pull. CONTROL PATTERNSCORE `'dead bugs'` (B29), `'bird dogs'` (B30), `'offset planks'` (E11) as stand-ins |
| `CARRY` (stub: BA `PROPULSIVE`/`STATIONARY` × `BILATERAL`/`UNILARTERAL`) | trap-bar / farmer-handle / sandbag carries | DB/KB farmer and suitcase carries | DB farmer / suitcase / front-rack carry | **⛔ NONE** (nothing to carry) | **⛔ NONE** (loaded backpack or water jugs only) |
| `DRAGS` (stub: BB `SAGITAL`/`FRONTAL`) | sled, forwards/backwards and lateral | ◐ often no sled: plate on a towel, or a band-resisted walk | ◐ band-resisted walks; lateral band walk for frontal | ◐ same | **⛔ NONE** (towel/backpack drag at best) |

**Pattern × tier combinations that have no viable option:**

| Tier | No viable option |
|---|---|
| Bodyweight only | vertical pull, lateral/front raise, biceps, carry, drag |
| Bands only | carry |

Weak but possible:
- Bodyweight only: horizontal pull (needs a table), triceps, loaded hinge, advanced bilateral squat, the functional anti-rotation work, flies.
- DB only: vertical pull.

**Smallest equipment set that gives full coverage (INFERRED):** DBs + adjustable bench + bands with a door anchor + a doorway pull-up bar. With that set every pattern in this range has at least one exercise that matches its level. The exceptions are carries above DB weight, sled drags, and maximal-load barbell work.

---

## 8. Reading workouts by their equipment (supporting evidence)

To check the user's claim "you can understand the workouts based on their equipment usage", I ran a keyword scan of every text cell in the coach's program tabs.

Method:
- The share is the % of implement-bearing cells that mention each implement.
- One cell can mention several implements.
- This is an OBSERVED count, but it is crude; the athletic-library tabs are included for contrast.

| Tab | Implement-bearing cells | Machine | Medball | Barbell | DB | Bodyweight |
|---|---|---|---|---|---|---|
| MASTER_MODEL `BASEBALL` | 617 | **0%** | 10% | 20% | 23% | 46% |
| `EXAMPLE BOXING 8 WEEK BUILD UP` | 49 | 12% | 12% | 20% | 24% | 41% |
| `EXAMPLE ATHLETIC FULL BODY SPLI` | 67 | 4% | **19%** | 16% | 28% | 40% |
| `(NOT DONE) 4 TRACKS PROGRAMMING` | 635 | 23% | 0% | 34% | 20% | 20% |
| `EXAMPLE PUSHPULLLEGS SPLIT` | 55 | 27% | 0% | 29% | 40% | 20% |
| `EXAMPLE UPPERLOWER SPLIT` | 40 | 22% | 0% | 32% | 48% | 22% |
| `EXAMPLE FAT BURNBODY TONING PRO` | 88 | 23% | 0% | 14% | 22% | 41% |

Other columns:
- `4 TRACKS PROGRAMMING` is also 16% cable.
- `EXAMPLE CROSSFIT SPLIT` is **96% barbell**.
- The BYOP logbooks are excluded. They are mostly empty dropdowns, and their few implement words are slot labels such as `Leg Extensions` and `Leg Curls`.

The pattern (INFERRED): **athletic programs have almost no machines and add med balls; aesthetic and gym programs have about a quarter machine mentions.** The equipment mix alone is enough to classify a program as athletic or physique. The template order the user describes (power/athletic implements first, then power-strength, strength, and resistance patterns) is covered by the program-structure team. This scan only confirms that the implement mix moves with that goal.

---

## 9. Data-quality issues that affect equipment tagging (OBSERVED)

- **`Standing DB Press` is written twice in a row** (AA50/AA51 and AB13/AB14). Every other vertical-push entry is a DB/Barbell pair, so the second copy is almost certainly `Standing Barbell Press` (RESISTANCE PATTERNS E15). It is tagged as DB as written, with a note.
- **`KB Face Pulls ` (U20)** is filed under VERTICAL PULL FOUNDATIONAL. Face pulls are normally a cable or band upper-back / rear-delt exercise, and RESISTANCE PATTERNS K19/K20 file them under SHOULDERS. Both the implement and the category are uncertain.
- **`GHD`** appears in both MODERATE (AN48) and ADVANCED (AN93). The library does not say whether it is a hip extension or a glute-ham raise.
- **`Bench Push ups`** appears in FOUNDATIONAL (AD13) and ADVANCED (AF11). Hands-on-bench and feet-on-bench are opposite difficulties.
- **`Hack Squat Machine `** (AI52) and **`Hack Squats`** (AI97) are both in the library, although the coach writes `"I PERSONALLY DON'T LIKE IT"` (ALL ABOUT SQUATS H37). `V-SQUAT` is marked `"I don't presercibe the use of these, ever"` and is correctly absent. `PENDULUM` is `'my FAVORITE ... machine'` and `LEG PRESS` is `'LOVE IT'`.
- **`Leg Extension Machine`** appears at all 3 AI levels (AI20, AI55, AI101) and in both views, besides its own column AM (`Leg Extensions`). NO ACCESS ATHLETIC (E12, E39) and BOOTCAMP OPTION 1 (E30) prefill `'Leg extensions'` (L4 slot-wiring notes). Every 4-day template also has a dedicated `Leg Extensions` slot, so the coach programs knee-extension isolation in almost every week.
- **The `LEG CURLS` header AR5 says `UNILATERAL`**, but both items are machine curls that are normally bilateral.
- **The library does not record the load for 34% of entries**, for example `Box Squats`, `Glute Bridges`, every lunge and `Stiff Leg Deadlift`. The generator has to pick the load implement from the client's equipment and level. That fits the coach's "exercise = base + variables" grammar (RESISTANCE PATTERNS §5).
- **`Camporini Deadlifts` (AQ16)** is undefined. Programs link a demo video (`https://www.youtube.com/watch?v=cRU0RQ1KTfg`) and write `'HEAVY: Camporini DL'`.

---

## 10. Proposed generator rules for equipment (INFERRED, consistent with the coach)

1. **Filter, then match level.** For each slot (category + level), keep the exercises whose `implement_requirement_groups` fit the client's kit. If none fit, take `substitutes_by_equipment[key]` for the most restrictive missing item, at the slot's level (F/A).
2. **Constraint follows the client profile.** For `injured/pain`, `older_adult`, or "wants more volume", choose constraint >= 3, then 4-5 where machines exist. This applies to *all* levels for these clients, including the leg machines the coach files under ADVANCED. For athletes in a power phase, choose constraint 1-2 free weight with fast intent.
3. **Speed is a slot variable.** `HEAVY` means slow concentric, low reps, about 80-90%. `FAST` means about 50-70%, banded if bands exist, maximal intent, 2-5 reps. The exercise stays the same.
4. **Keep the menu stable within a block.** Equipment swaps happen only when kit changes, never for "variety". This follows the coach's "don't confuse the muscle" rule. Volume progresses by adding sets of the same exercises week to week (e.g. 20 → 22 chest sets). New exercises are added only to carry the extra sets, and they come from the same category and the same constraint level.
5. **Horizontal before vertical.** The coach rows before he does an overhead pull, and does a horizontal push before a vertical push. This is a session-ordering rule, owned by the program team; equipment tags do not change it.
6. **Home clients.** Ask about a doorway bar and a band door anchor before generating. Without them, vertical pull and arm isolation have no faithful option.

---

## 11. Open questions for the coach

1. VERTICAL PUSH FOUNDATIONAL (AA11-AA14) contains 'DB Push press', 'Barbell push press', 'DB Push Jerk' and 'Barbell Push Jerk', which are standing ballistic lifts. Your RESISTANCE PATTERNS traffic light (E8-E15) makes seated presses green and standing presses red. Are push press and jerk really foundational, maybe as a foundational athletic pattern, or should they move to ADVANCED?
2. Lower-body machines ('Leg press', 'Pendulum Squat', 'Hack Squats', 'Hip Thrust Machine', 'Machine Good Mornings') are filed under MODERATE/ADVANCED, but you say machines suit injured, older and high-volume clients. May the generator give these machines to a FOUNDATIONAL client who is older or injured?
3. AA50/AA51 and AB13/AB14 both say 'Standing DB Press'. Is the second one 'Standing Barbell Press'?
4. 'KB Face Pulls ' (U20) sits in VERTICAL PULL FOUNDATIONAL. Is it really a kettlebell exercise, or a cable/band face pull? Should it move to SIDE RAISES / rear delts (RESISTANCE PATTERNS K19 'Face pulls')?
5. 'GHD' appears in both MODERATE (AN48) and ADVANCED (AN93). Is one the GHD hip extension and the other the glute-ham raise?
6. 'Bench Push ups' appears in FOUNDATIONAL (AD13) and ADVANCED (AF11). Does it mean hands on the bench (easier) or feet on the bench (harder)?
7. 34% of library entries name no implement: every lunge in AL, 'Box Squats', 'Glute Bridges', 'Stiff Leg Deadlift', 'Leg Extensions' (AM9), 'Standing Calf raises (use deficit)', 'Bulgarian Split squats'. What is your default load implement per level (e.g. bodyweight → DB → barbell), and should the generator pick the load from the client's equipment?
8. Home or no-gym clients: what is the minimum equipment you require (doorway pull-up bar? bands with a door anchor? DBs?) What do you prescribe for vertical pull, lateral raises and biceps when a client has nothing at all?
9. 'Hack Squat Machine ' and 'Hack Squats' are in the library, but ALL ABOUT SQUATS says 'I PERSONALLY DON'T LIKE IT'. Should the generator rank pendulum and leg press above hack squat, or drop the hack squat?
10. Speed in resistance slots: should athletes get 'FAST' versions of library lifts (about 50-70%, banded) as in 4 TRACKS / CONJUGATE? In which weeks or blocks? What load do you use for 'Box. Any Squat Touch and Go fast'?
11. When weekly sets go up (e.g. 20 → 22 chest sets), do the extra sets go to the same exercises, or to a new exercise from the same category? If a new exercise, may it use a different implement or constraint level (e.g. machine → DB)?
12. What do 'Zone1, Zone 2, Zone 3' mean in 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (AS12)? Pulley height, arm angle, or ROM segment?
13. What is the 'Camporini Deadlifts' (AQ16), and which implement does it use? What alternates in 'Alternating DB Deadlifts' / 'Alternating  Barbell Deadlifts'?
14. CARRY (BA) and DRAGS (BB) have labels but no exercises. Which implements do you use (farmer handles, trap bar, KB, sandbag, sled)? What is your home substitute for drags?
15. VERTICAL PUSH has no machine or cable option at all. Is that deliberate, or should a seated machine shoulder press be added for injured or older clients? The only fixed-path press now is 'Kneeling Landmine Press' (AA93), in the unilateral block.
16. The LEG CURLS header (AR5) says 'UNILATERAL'. Do you want single-leg machine curls?
17. Do you agree with the constraint scale? It scores floor and bench bodyweight work (bridges, kneeling or incline push-ups) and box squats as 'supported' (3), and hanging, inverted and ballistic work as least constrained (1).
