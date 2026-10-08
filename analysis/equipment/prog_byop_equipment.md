# BYOP - equipment usage & intent sequence of every session (programs 00-08)

Scope: every exercise slot (366 slots in 54 sessions) of the nine BYOP program tabs `AESTHETICS - FULL BODY - 4 DAYS`, `3 DAY BUILDER`, `PUSHPULLLEGS - 3 or 6 DAYS A WK`, `ATHLETIC - FULL BODY - 4 DAYS A`, `JUSTICE LEAGUE`, `BOOTCAMP - OPTION 1`, `BOOTCAMP - OPTION 2`, `NO ACCESS - AESTHETICS - FB - 4` (hidden), `NO ACCESS - ATHLETIC - FB - 4 t` (hidden), resolved through their DATA VALIDATIONS into `MASTER EXERCISE LIBRARY`. Every one of the 427 selectable library cells (391 distinct names) inside a wired range has an equipment / constraint / velocity tag (`_item_classification` in the JSON). Sources: `dumps/BYOP/00-09`, visibility confirmed in `raw/BYOP.xlsx`. Read-only - nothing in Google Sheets was touched.

Companion data: `prog_byop_equipment.json` (same folder) - `{tab: {sessions:[{day, slots:[{order, slot, category, implements, constraint, velocity_intent, ...}]}], implement_mix:{}, constraint_avg_by_position:[]}}` plus `_group_comparison`, `_library_category_profiles`, `_item_classification`, `_meta`.

Evidence tags: **OBSERVED** = read from a cell / validation (tab + cell cited). *INFERRED* = analyst interpretation (all equipment tags, constraint scores and velocity tags are INFERRED from exercise names, because the library has no equipment column). SCIENCE = general exercise-science convention.

## 0. Headline findings

1. **The coach's described order is literally the slot order of the athletic templates (OBSERVED).** `ATHLETIC - FULL BODY - 4 DAYS A` and `JUSTICE LEAGUE` run, on all 4 main days: `Plyo` (x1-2) -> `Throwing` -> `COD` -> `Tripple Extension` -> `Bilateral KD` or `Bilateral HD` -> 3 resistance-pattern slots -> isolation (`Leg Extensions` / `Leg Curls` + `ABdution`). Mapped to tiers speed/power(1) -> power-strength(2) -> strength(3) -> resistance patterns(4) -> isolation(5) the sequence is monotone on 8/8 athletic days. The library itself labels C/G/K row 6 `SPEED/POWER` (C6, G6, K6) and row 4 `ATHLETIC` vs `RESISTANCE` (OBSERVED).
2. **The only filled athletic day confirms it with real exercises (OBSERVED, JUSTICE LEAGUE E3:E12):** `Medium Depth Drop` (box) -> `Ankle Hops ` (BW) -> `Situps to overhead throw` (med ball) -> `DIG/OUT` (field, H6 note `LATERAL`) -> `Power Clean` (barbell) -> `Front Squats` (barbell) -> `Cable Machine UL Rows` (cable, H9 `SINGLE ARM`) -> `Front Foot Elevated Lunges (FFE)` -> `Stricted Pull-ups feet in front ` -> `Leg Extensions` (machine, G12 `MYO SET`, H12 `OUCH`). Velocity intent falls monotonically MAX x4 -> POWER -> STRENGTH -> CONTROLLED x3 -> ISOLATION; reps rise `6 to 8 Reps` -> `8 to 12 Reps` -> `MYO SET`; every set count is 2 (week 1). Equipment goes BW/box/med ball/field -> barbell -> cable/bar -> machine: the session ENDS on the single most-constrained implement.
3. **Horizontal before vertical holds in 100% of sessions that contain both (OBSERVED order):** horizontal pull before vertical pull in 13/13 sessions, horizontal push before vertical push in 15/15. Bilateral before unilateral also never breaks: Bilateral KD before Unilateral KD 14/14, Bilateral HD before Unilateral HD 9/9. Horizontal slots also outnumber vertical ones: 44 horizontal-push/pull slots (`AD` 24 + `X` 20) vs 34 vertical (`AA` 17 + `U` 17) across all main days; PPL push day has 4 `AD`-wired slots (`Horizontal Push`, `Incline`, `Flies`, `Dips`) to 1 `Vertical Push`.
4. **Overall the full power->isolation order holds in 24/39 main sessions.** The 15 exceptions are all explainable: `AESTHETICS` Day 1/Day 3, `3 DAY BUILDER` DAY 1 and the NO ACCESS aesthetics copy open with `Calves` (isolation first, OBSERVED D3 `Machine Calf Raises`); PPL leg days put `Leg Extensions`/`Leg Curls` before `Unilateral HD`; `BOOTCAMP - OPTION 2` puts `Bicep` before `Vertical Push` (2A/2B) and `Cardio` mid-session (3A/3B, E15/E30); the two NO ACCESS tabs break only because of the AR miswire.
5. **Implement mix separates the template families (pool-weighted share of main-day slots, INFERRED tags):** aesthetics (00-02) machine+cable 31%, free weights 46%, BW/field/props/bars 22%, mean constraint 2.82; athletic (03-04) machine+cable 18%, free weights 40%, BW/field/props/bars 42%, constraint 2.17; bootcamp (05-06) 23% / 43% / 31%, constraint 2.56. Aesthetics = most machine & most constrained; athletic = least of both.
6. **The NO ACCESS tabs are NOT equipment-filtered - verified slot by slot (OBSERVED).** Their 88 EXERCISE dropdowns point at exactly the same library ranges as `AESTHETICS - FULL BODY - 4 DAYS` (07) and `ATHLETIC`/`JUSTICE LEAGUE` (08); the only 4 differences are the miswire `Unilateral HD` -> `'MASTER EXERCISE LIBRARY'!$AR$7:$AR$42` (LEG CURLS: `Seated leg curls`, `Lying Leg Curls`) in E12/E33 (07) and E19/E46 (08). Result: the no-access group is the MOST machine-heavy of all (26% machine share vs 23% aesthetics; 12 main slots that can only be filled with a gym machine), and the only exercise pre-typed in `NO ACCESS - ATHLETIC - FB - 4 t` is `Leg extensions` (E12, E39) - a machine. Both tabs are `hidden` and pre-filled with the invalid placeholder `CHOSE 👇`. Whatever 'NO ACCESS' means, it is not 'no equipment' in the current wiring.
7. **Two slot types are 100% machine (OBSERVED ranges), wired in 7 (`AM`) and 8 (`AR`) of the 9 tabs:** `Leg Extensions` -> `AM7:AM9` (1 option, `Leg Extensions`) and `Leg Curls` -> `AR7:AR10` (2 options, `Seated leg curls`, `Lying Leg Curls`). Those 33 slots (14 `AM` + 19 `AR` incl. 4 miswired) have zero home-kit options; a home client hits an empty dropdown. Vertical pull `U7:U122` has 0/20 no-equipment options (best home option needs a pull-up bar), horizontal pull `X7:X162` 0/16, side raises `AH7:AH42` 0/12, bicep `AS7:AS42` 0/14, tricep `AT7:AT42` 0/9, throwing `K7:K87` 0/20 (all need a med ball).
8. **No-equipment coverage is thin everywhere (INFERRED tiers):** main-day slots with at least one zero-equipment option: aesthetics 42/85, athletic 52/80, bootcamp 32/58, no-access 34/68. With a home kit (DB/KB/med ball/bands/TRX/pull-up bar/bench) coverage jumps to 76/85, 72/80, 54/58, 56/68. The gap is closed by DB + pull-up bar + bench; only `AM`/`AR` need a substitution rule.
9. **Library levels encode 'remove the constraint' for the upper body but 'add load' for the lower body (OBSERVED block positions, INFERRED scores).** Mean constraint by block: `VERTICAL PULL` FOUNDATIONAL 3.83 (6 lat pulldowns + 3 assisted pull-up machines) -> ADVANCED 1.0 (7 strict/weighted pull-ups); `HORIZONTAL PULL` 4.0 (3 machine rows, TRX, inverted) -> 2.33 (barbell/seal/renegade rows); `HORIZONTAL PUSH` 2.83/3.0 -> 2.11; `VERTICAL PUSH` 2.33 -> 1.9 -> 1.5 (UNILATERAL). But `BILATERAL KNEE DOMINANT` rises 2.75 -> 2.78 -> 3.43 because `Hack Squats`, `Leg press`, `Pendulum Squat` sit in ADVANCED (AI97-AI99), and `BILATERAL HIP DOMNANT` MODERATE (3.4) holds `Hip Thrust Machine`, `Machine Good Mornings`, `Machine Leg Curls`, `GHD`, `Hyper extensions`. Lower-body machines are positioned as loading/volume tools ('you can push a lot'), upper-body machines as on-ramps.
10. **Velocity is carried by category, not by a load column (OBSERVED + INFERRED).** BYOP has no load/tempo/velocity/ROM field; the only dosing lists are `SETS` (AV8:AV15 = 1-8, AV16 `SUPERSET W/ 👇`), `REPS` (AW8:AW14 `4 to 6 Reps` ... `20 Reps`, `MYO SET`), `EFFORT` (AX8:AX17 1-10) and `FEELING` (AY8:AY11). Speed lives in the athletic categories: `THROWING` 20/20 options are med-ball throws/passes/slams (light, per coach 8-10 lb), `PLYOS` 37/41 unloaded (the 4 loaded jumps `DB Depth drop dbs Jump`, `SL DB depth drop dbs jump`, `DB Ankle hops`, `DB repeat squat jumps` sit only in the ADVANCED block G136:G139), `TRIPPLE EXTENSION` progresses BW pattern (`BodyWeight Squat to calf raise`) -> loaded hang pulls -> full `Power Snatch`/`Power Clean`/`Clean & Jerk` (C91:C96). Speed-strength methods appear in `BILATERAL KNEE DOMINANT` ADVANCED: `Box. Any Squat Touch and Go fast`, `(Banded)`, `(Reverse Banded)` (AI91:AI93). ROM appears only inside names: `Elevated Push ups (for full ROM)` (AD99), `(use deficit)` calf raises (AU9, AU10), elevated-foot lunges (AL15:AL18, AL20).
11. **Rep prescription climbs with constraint/isolation in both filled templates (OBSERVED).** AESTHETICS Day 1/2: `DB Push press` 5 x `6 to 8 Reps` (power, free weight); `Bent Over Barbell Rows` and `Reverse Lunges ` 3 x `8 to 12 Reps`; machine/station work `Leg press`, `Lat Pulldown Pronated Grip`, `Machine Calf Raises` and BW/DB `Push Ups `, `DB Deadlifts` 3 x `15 Reps`; end-of-session isolation `Ez Bar Curls`, `Leg Extensions` 2 x `20 Reps`. JUSTICE LEAGUE: free/fast 6-8, resistance patterns 8-12, machine isolation `MYO SET`. Across the 21 filled slots with reps, Spearman(constraint score, rep midpoint) = 0.72 (INFERRED scores). So: lighter + faster + less constrained = fewer reps; more constrained machine/isolation = higher reps/MYO (matches coach: heavier -> slower, machines -> push more volume safely).
12. **AESTHETICS uses machines as session bookends; JUSTICE LEAGUE uses one machine as the finisher (OBSERVED).** AESTHETICS Day 1 filled = 4/7 machine or station (`Machine Calf Raises`, `Leg press`, `Lat Pulldown Pronated Grip`, `Leg Extensions`; constraint seq 5,5,2,1,4,2,5), Day 2 = 0 machines in the 4 filled slots (`DB Deadlifts`, `Push Ups `, `Staggered Stance DL w/ DB `, `DB Push press`). JUSTICE LEAGUE Monday = 1/10 machine (the last slot), constraint seq 1,1,3,1,1,2,3,1,1,5. Across the 3 athletic-layout tabs (03, 04, 08) the by-position mean constraint climbs from 1.0 at position 1 to 3.5-3.9 at positions 9-10.
13. **Bootcamp splits push/pull planes across days instead of pairing H->V in one session (OBSERVED).** `BOOTCAMP - OPTION 1`: MONDAY/THURSDAY = `Bilateral KD` + `Horizontal Pull` + `Unilateral HD` + `Vertical Push` + `Bicep` + `Calves` + `Leg Extensions`; TUESDAY/FRIDAY = `Bilateral HD` + `Vertical Pull` + `Unilateral KD` + `Horizontal Push` + `Leg Curls` + `Tricep` + `ABdution` - every day pairs a bilateral pattern of one joint with the unilateral pattern of the other. `BOOTCAMP - OPTION 2` is the only tab whose cardio can reach calorie (erg) options: E7/E12/E22/E27 use `B7:B335`, which adds 9 `cals` options (bike/rower/ski, INFERRED) - every other cardio dropdown (`B7:B122`) is 29 running-only options.
14. **Unilateral knee-dominant is the lowest-constraint resistance slot and always sits mid-session (INFERRED score, OBSERVED position).** `AL7:AL42` = 13 options, 11 BW (+ optional DB) and 2 box/step, 0 machine, mean constraint 1.23. It is placed after the bilateral compound and one pull (position 4 in AESTHETICS, 8 in ATHLETIC), producing the dip in the by-position curve (AESTHETICS pos 4 = 1.54; ATHLETIC pos 8 = 1.59). `VERTICAL PUSH` (`AA7:AA122`) has no machine or cable option at all (DB 55%, barbell 35%, BW 10%), so a machine-first client (injured/older) has no machine overhead press available.

## 1. Method

1. **Slot -> category (OBSERVED).** For every row whose EXERCISE cell carries a list validation, the validation range (e.g. `'MASTER EXERCISE LIBRARY'!$AI$7:$AI$122`) gives the library column; the row-1 header of that column (e.g. `BILATERAL KNEE DOMINANT`) is the category. Session = the merged DAY block (`Day 1`, `MONDAY`, `1A`, `Optional` ...). The Thursday block of ATHLETIC/JUSTICE LEAGUE has a blank merged DAY cell (B30:B39) and is labelled by position.
2. **Options (OBSERVED).** All non-blank cells in the range minus separators (`CHOOSE 👇`, `FOUNDATIONAL`, `MODERATE`, `ADVANCED`, `EASY`, `UNILATERAL`, `CORE THORAX`, `CORE PELVIS`, `SPEED INTERVALS`, `DISTANCE INTERVALS`, `DISTANCE TEST`, `SPEED TEST`, `DISTANCE`, `CALORIES`, AZ muscle headers `QUADS 👇` ...). 'Filled' = the cell holds an exercise instead of `CHOOSE 👇` / `CHOSE 👇`; it is matched to its library cell (case-insensitive when typed with different case, e.g. `Leg extensions`).
3. **Implement family (INFERRED from the name, SCIENCE for standard set-ups).** BW, FIELD (open space/track), PROP (box/bench/step/plate obstacle/hurdle/stability ball/sliders/sandbag), MB, DB, KB, BAND, SUSP (TRX/rings), BAR (pull-up/dip bar), BB (barbell, EZ, hex/trap bar, landmine), CABLE (cable column, free line of pull), MACHINE (fixed path or padded seated station - includes lat pulldown, assisted pull-up, GHD, hyperextension bench, reverse hyper), CARDIO_MACHINE.
4. **Constraint score 1-5 (INFERRED rubric built from the coach's definition: 'reference points / constraints: you sit down, put your feet on the ground, move your hands or your feet').** `1 + path + support + reference`, capped at 5. path: 0 free weight/BW, 1 cable/band/suspension/landmine pivot/padded apparatus, 2 machine fixed path. support: 0 single-leg, split, offset, airborne, hanging or open-field; 1 standing bilateral, kneeling, plank/push-up; 2 seated, lying or chest-supported. reference +1 for an explicit contact target (box squat, wall-ball squat, back-to-wall, foot-on-wall). Examples: `Leg press` 5, `Lat Pulldown Pronated Grip` 4, `Cable Machine UL Rows` 3, `Front Squats` 2, `Reverse Lunges ` 1, `Power Clean` 1, `Medium Depth Drop` 1. Filled slot = the exercise's score; unfilled slot = mean of all options in the dropdown (with min-max). Cross-check: against the independent `constraint_level` in the parallel library files `lib_resistance.json` + `lib_athletic_core.json` (same folder, at time of writing) the scores agree with Spearman 0.88 over 426 shared cells; the only >=2-point disagreements are the 4 banded / reverse-banded box squats AI92, AI93, AI95, AI96 (here 4: band + box reference; there 2).
5. **Velocity intent (INFERRED; anchored on library row 6 `SPEED/POWER` for C/G/K and the coach's 'lighter = faster, heavier = slower').** MAX = max velocity/reactive with BW or a light implement; POWER = explosive with external load (Olympic lifts/pulls, push press/jerk, thrusters, KB swing, loaded jumps, 'Touch and Go fast'/banded box squats); STRENGTH = heavy barbell/hex/weighted BW; CONTROLLED = moderate-load resistance pattern; ISOLATION = single joint; CORE; AEROBIC. When reps are filled, a barbell lift at `4 to 6`/`6 to 8 Reps` is STRENGTH, at `8 to 12`+ CONTROLLED (applied to `Bent Over Barbell Rows`, AESTHETICS D5). Unfilled slot = modal intent of its pool.
6. **Slot tier (INFERRED mapping of the coach's sentence 'power first for athletics, then the power-strength training, then strength training, then the resistance movements/patterns').** 1 `PLYOS`/`THROWING`/`CHANGE OF DIRECTION`; 2 `TRIPPLE EXTENSION`; 3 `BILATERAL KNEE DOMINANT`/`BILATERAL HIP DOMNANT`; 4 `HORIZONTAL`/`VERTICAL` `PULL`/`PUSH`, `UNILATERAL KNEE DOMINANT`/`UNILATERAL HIP DOMINANT`; 5 `LEG EXTENSIONS`, `LEG CURLS`, `BICEP`, `TRICEP`, `SIDE RAISES`, `CALVES`; 6 `CORE THORAX`, `CARDIO`, `FULL FOCUS LIST`. A session is 'monotone' when the tier never goes down.
7. **Access tier (INFERRED, for the 'what equipment do you have?' question).** 0 = nothing (BW / floor / wall / open space); 1 = household props (step, box, bench, chair, towel, low obstacle); 2 = home kit (DB, KB, med ball, bands, TRX, pull-up/dip bar, stability ball, sandbag, plates); 3 = barbell family + rack/bench (barbell, EZ, hex, landmine); 4 = commercial gym (cable stack, selectorized/plate-loaded machines, GHD, reverse hyper, calorie erg). Each option gets the minimum tier needed to do it as written.

## 2. Equipment profile of every wired library range (what a slot can offer)

OBSERVED: range, row-1 category, row-4 pattern, row-6 purpose, which tabs use it. INFERRED: everything else. 'No-equip' = options at access tier 0; 'home' = tier <= 2 (DB/KB/MB/bands/TRX/bar/bench); 'BB' = tier <= 3.

| Range | Category (row 1) | Row 4 / Row 6 | Options | Implement family share | Constraint mean (min-max) | No-equip / home / +BB / all | Velocity mix | Machine / cable options | Used by (slots) |
|---|---|---|---|---|---|---|---|---|---|
| `B7:B122` | `CARDIO` | `CARDIO` / `CARDIO` | 29 | FIELD 100% | 1 (1-1) | 29 / 29 / 29 / 29 | AEROBIC 29 | - | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 3; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `B7:B335` | `CARDIO` | `CARDIO` / `CARDIO` | 43 | FIELD 79%, CARDIO_MACHINE 21% | 1.84 (1-5) | 34 / 34 / 34 / 43 | AEROBIC 43 | `10 cals`, `15 cals`, `20 cals`, `25 cals`, `30 cals`, `35 cals`, `40 cals`, `45 cals`, `50 cals` | BOOTCAMP - OPTION 2 4 |
| `C7:C242` | `TRIPPLE EXTENSION` | `ATHLETIC` / `SPEED/POWER` | 33 | BB 55%, BW 42%, DB 3% | 1.61 (1-2) | 14 / 15 / 33 / 33 | POWER 19, MAX 14 | - | ATHLETIC - FULL BODY - 4 DAYS A 4; JUSTICE LEAGUE 4; NO ACCESS - ATHLETIC - FB - 4 t 4 |
| `G7:G162` | `PLYOS` | `ATHLETIC` / `SPEED/POWER` | 41 | PROP 63%, BW 22%, DB 10%, FIELD 5% | 1 (1-1) | 11 / 41 / 41 / 41 | MAX 37, POWER 4 | - | ATHLETIC - FULL BODY - 4 DAYS A 6; JUSTICE LEAGUE 6; NO ACCESS - ATHLETIC - FB - 4 t 6 |
| `K7:K87` | `THROWING` | `ATHLETIC` / `SPEED/POWER` | 20 | MB 100% | 1.95 (1-3) | 0 / 20 / 20 / 20 | MAX 20 | - | ATHLETIC - FULL BODY - 4 DAYS A 4; JUSTICE LEAGUE 4; NO ACCESS - ATHLETIC - FB - 4 t 4 |
| `L7:L242` | `CHANGE OF DIRECTION` | `ATHLETIC` / `CHANGE OF DIRECTION` | 9 | FIELD 100% | 1 (1-1) | 9 / 9 / 9 / 9 | MAX 9 | - | ATHLETIC - FULL BODY - 4 DAYS A 4; JUSTICE LEAGUE 4; NO ACCESS - ATHLETIC - FB - 4 t 4 |
| `O7:O283` | `CORE THORAX` | `CONTROL` / `CORE` | 17 | BW 53%, BAR 24%, CABLE 12%, DB 6%, PROP 6% | 2.29 (1-3) | 9 / 15 / 15 / 17 | CORE 17 | `Woodchoppers`, `Cable Machine Oblique Rotations` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 3; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `U7:U122` | `VERTICAL PULL` | `RESISTANCE` / `BACK` | 20 | MACHINE 50%, BAR 40%, SUSP 5%, KB 5% | 2.85 (1-5) | 0 / 10 / 10 / 20 | CONTROLLED 19, STRENGTH 1 | `Lat Pulldown Wide Grip`, `Lat Pulldown Supinated Grip`, `Lat Pulldown Pronated Grip`, `Lat Pulldown Wide Mag Grips`, `Lat Pulldowns w/ Cable Rope`, `Lat Pulldowns Close Grip`, `Assisted  Pull-Up Machine Close Grip`, `Assisted Pull-Up Machine Pronated Grip`, `Assisted  Pull-Up Machine Supinated Grip`, `Unilateral Lat Pulldowns` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 1; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `X7:X162` | `HORIZONTAL PULL` | `RESISTANCE` / `BACK` | 16 | BB 38%, DB 25%, MACHINE 19%, SUSP 6%, BAR 6%, CABLE 6% | 2.88 (1-5) | 0 / 6 / 12 / 16 | CONTROLLED 10, STRENGTH 6 | `Machine Row Close Grip`, `Machine Row Supinated Grip`, `Machine Row Pronated Grips`, `Cable Machine UL Rows` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 4; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AA7:AA122` | `VERTICAL PUSH` | `RESISTANCE` / `SHOULDERS/TRAPS` | 20 | DB 55%, BB 35%, BW 10% | 1.95 (1-3) | 2 / 13 / 20 / 20 | CONTROLLED 12, POWER 7, STRENGTH 1 | - | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 1; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AD7:AD162` | `HORIZONTAL PUSH` | `RESISTANCE` / `CHEST/FRONT DELTS` | 25 | BW 40%, DB 28%, CABLE 12%, MACHINE 8%, BAR 8%, BB 4% | 2.56 (1-5) | 4 / 19 / 20 / 25 | CONTROLLED 23, STRENGTH 2 | `Cable Standing Chest Press`, `Machine bench press`, `Cable flies`, `Machine flies`, `Alternating Cable Press` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 8; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AH7:AH42` | `SIDE RAISES` | `RESISTANCE` / `SHOULDERS` | 12 | DB 67%, CABLE 17%, BB 8%, MACHINE 8% | 2.67 (2-5) | 0 / 8 / 9 / 12 | ISOLATION 12 | `Inclined Cable Machine Side Raises`, `Cable machine Leaning Side raises`, `Machine reverse fliez` | AESTHETICS - FULL BODY - 4 DAYS 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 4; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AI7:AI122` | `BILATERAL KNEE DOMINANT` | `RESISTANCE` / `QUADS` | 35 | BB 46%, DB 20%, MACHINE 20%, BW 9%, PROP 3%, KB 3% | 3.03 (1-5) | 2 / 12 / 28 / 35 | CONTROLLED 16, STRENGTH 10, POWER 6, ISOLATION 3 | `Leg Extension Machine`, `Hack Squat Machine`, `Leg Extension Machine`, `Hack Squats`, `Leg press`, `Pendulum Squat`, `Leg Extension Machine` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | `RESISTANCE` / `QUADS/GLUTES` | 13 | BW 85%, PROP 15% | 1.23 (1-2) | 7 / 13 / 13 / 13 | CONTROLLED 13 | - | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AM7:AM9` | `LEG EXTENSIONS` | `RESISTANCE` / `QUADS` | 1 | MACHINE 100% | 5 (5-5) | 0 / 0 / 0 / 1 | ISOLATION 1 | `Leg Extensions` | AESTHETICS - FULL BODY - 4 DAYS 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AN7:AN122` | `BILATERAL HIP DOMNANT` | `RESISTANCE` / `GLUTES/HAMSTRINGS` | 33 | MACHINE 27%, BB 27%, PROP 15%, KB 9%, DB 9%, BW 6%, +2 more | 2.94 (2-5) | 1 / 14 / 23 / 33 | CONTROLLED 19, STRENGTH 9, ISOLATION 4, POWER 1 | `Reverse Hyper Extension`, `Cable Pull Through`, `Leg Curl Machine`, `GHD`, `Hip Thrust Machine`, `Machine Good Mornings`, `Machine Leg Curls (Seated and Laying Down)`, `Hyper extensions`, `GHD`, `Machine Leg Curls` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | `RESISTANCE` / `GLUTES/HAMSTRINGS` | 8 | BW 38%, DB 38%, BB 25% | 2 (1-3) | 1 / 6 / 8 / 8 | CONTROLLED 7, STRENGTH 1 | - | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 1; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2 |
| `AR7:AR10` | `LEG CURLS` | `RESISTANCE` / `HAMSTRINGS` | 2 | MACHINE 100% | 5 (5-5) | 0 / 0 / 0 / 2 | ISOLATION 2 | `Seated leg curls`, `Lying Leg Curls` | AESTHETICS - FULL BODY - 4 DAYS 2; 3 DAY BUILDER 1; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 2; NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AR7:AR42` | `LEG CURLS` | `RESISTANCE` / `HAMSTRINGS` | 2 | MACHINE 100% | 5 (5-5) | 0 / 0 / 0 / 2 | ISOLATION 2 | `Seated leg curls`, `Lying Leg Curls` | NO ACCESS - AESTHETICS - FB - 4 2; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AS7:AS42` | `BICEP` | `RESISTANCE` / `BICEP` | 14 | DB 64%, BB 21%, CABLE 7%, SUSP 7% | 2.5 (2-3) | 0 / 10 / 13 / 14 | ISOLATION 14 | `Cable Machine Curls (Zone1, Zone 2, Zone 3` | AESTHETICS - FULL BODY - 4 DAYS 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 4; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2 |
| `AT7:AT42` | `TRICEP` | `RESISTANCE` / `TRICEP` | 9 | CABLE 44%, DB 44%, BB 11% | 2.78 (2-3) | 0 / 4 / 5 / 9 | ISOLATION 9 | `Straight bar pronated tricep extensions`, `Straight Bar Supinated Tricep Extensions`, `Overhead cable tricep extension`, `Cable tricep push downs` | AESTHETICS - FULL BODY - 4 DAYS 2; PUSHPULLLEGS - 3 or 6 DAYS A WK 4; BOOTCAMP - OPTION 1 2; BOOTCAMP - OPTION 2 2; NO ACCESS - AESTHETICS - FB - 4 2 |
| `AU7:AU13` | `CALVES` | `RESISTANCE` / `CALVES` | 5 | DB 40%, BW 20%, BB 20%, MACHINE 20% | 2.6 (2-5) | 0 / 3 / 4 / 5 | ISOLATION 5 | `Machine Calf Raises` | AESTHETICS - FULL BODY - 4 DAYS 4; 3 DAY BUILDER 4; ATHLETIC - FULL BODY - 4 DAYS A 2; JUSTICE LEAGUE 2; BOOTCAMP - OPTION 1 4; NO ACCESS - AESTHETICS - FB - 4 4; NO ACCESS - ATHLETIC - FB - 4 t 2 |
| `AZ7:AZ335` | `FULL FOCUS LIST` | `None` / `MUSCLE FOCUS OPTIONS` | 51 | DB 39%, MACHINE 18%, BB 18%, CABLE 12%, BW 10%, BAR 4% | 2.86 (1-5) | 4 / 29 / 38 / 51 | CONTROLLED 28, ISOLATION 12, STRENGTH 8, CORE 3 | `Leg press`, `Leg extensions`, `Cable side raises`, `assisted pull ups`, `lat pull down`, `Cable rows`, `machine rows`, `cable tricep extensions`, `cable overhead tricep ext`, `assisted dips`, `Hyperextensions`, `Leg curls`, `Lying leg curls`, `Cable flies`, `cable bicep curls` | AESTHETICS - FULL BODY - 4 DAYS 4; 3 DAY BUILDER 6; PUSHPULLLEGS - 3 or 6 DAYS A WK 2; ATHLETIC - FULL BODY - 4 DAYS A 4; JUSTICE LEAGUE 4; BOOTCAMP - OPTION 1 4; NO ACCESS - AESTHETICS - FB - 4 4; NO ACCESS - ATHLETIC - FB - 4 t 4 |

No-equipment options per range (verbatim, stripped) - the generator's fallback list:

- `B7:B122` CARDIO: `2 min Fast - 1 min walk`, `3 min Fast - 2 min walk`, `4 min Fast - 3 min walk`, `5 min fast - 2 min walk`, `6 min fast - 1 min walk`, `1 mile run - 1 min walk`, `2 mile run - 2 min walk`, `3 mile run - 3 min walk`, `1 Mile run`, `3 mile run`, `5 mile run`, `8 mile run`, `11 mile run`, `14 mile run`, `17 mile run`, `20 mile run`, `21.6 mile run`, `Half a mile (800m)`, `1 Mile Run for time`, `3 Miles run for time`, `1 Mile run`, `3 mile run`, `5 mile run`, `8 mile run`, `11 mile run`, `14 mile run`, `17 mile run`, `20 mile run`, `21.6 mile run`
- `B7:B335` CARDIO: `2 min Fast - 1 min walk`, `3 min Fast - 2 min walk`, `4 min Fast - 3 min walk`, `5 min fast - 2 min walk`, `6 min fast - 1 min walk`, `1 mile run - 1 min walk`, `2 mile run - 2 min walk`, `3 mile run - 3 min walk`, `1 Mile run`, `3 mile run`, `5 mile run`, `8 mile run`, `11 mile run`, `14 mile run`, `17 mile run`, `20 mile run`, `21.6 mile run`, `Half a mile (800m)`, `1 Mile Run for time`, `3 Miles run for time`, `1 Mile run`, `3 mile run`, `5 mile run`, `8 mile run`, `11 mile run`, `14 mile run`, `17 mile run`, `20 mile run`, `21.6 mile run`, `200m`, `400m`, `600m`, `800m`, `1000m`
- `C7:C242` TRIPPLE EXTENSION: `BodyWeight Squat to calf raise`, `Lunge to high knee reach`, `Lunge to high knee reach`, `Bilateral symmetrical ankle hop`, `Lateral bilateral ankle hops`, `Forward/reverse bilateral hops`, `Reverse bilateral ankle hops`, `Bilateral Symmetrical  zig-zag jumps`, `Single leg ankle hops`, `Single leg lateral ankle hops`, `Reverse single leg ankle hops`, `Right angle bilateral ankle hops - forward/right/forward/left/forward`, `Right angle single leg ankle Hops`, `Forward/reverse sl ankle hops`
- `G7:G162` PLYOS: `Push up Stick the Landing`, `Ankle Hops`, `SL forward zig-zag jumps`, `Ankle Hops`, `SL Reverse zig-zag jumps`, `Squirrel jumps`, `Single leg squirrel jumps`, `Max velocity running (top speed)`, `Tuck Jumps`, `Bounding`, `Plyo pushups`
- `K7:K87` THROWING: **none**
- `L7:L242` CHANGE OF DIRECTION: `FADE`, `SLANT`, `POST/CORNER`, `FLAT`, `Shuffles`, `DIG/OUT`, `LEFT TEST`, `COMEBACK/CURL`, `2005-05-10 (date; probably '5-10-5' auto-converted)`
- `O7:O283` CORE THORAX: `Plank`, `Crunches`, `Sit ups`, `Side Plank`, `Russian Twists`, `Leg Raises`, `Reverse Crunches`, `V-ups`, `Side Planks`
- `U7:U122` VERTICAL PULL: **none**
- `X7:X162` HORIZONTAL PULL: **none**
- `AA7:AA122` VERTICAL PUSH: `Handstand Push ups`, `Pike Push Ups`
- `AD7:AD162` HORIZONTAL PUSH: `Kneeling Push Ups`, `Push Ups`, `Push ups (Feet on Wall)`, `Diamond Push ups`
- `AH7:AH42` SIDE RAISES: **none**
- `AI7:AI122` BILATERAL KNEE DOMINANT: `Bodyweight Squats`, `Sissy Squats`
- `AL7:AL42` UNILATERAL KNEE DOMINANT: `Stationary Lunges`, `Reverse Lunges`, `Forward  Lunges`, `Side Lunges`, `Pistol Squats`, `Rear Foot Against Wall Lunges`, `Curtsy Lunges`
- `AM7:AM9` LEG EXTENSIONS: **none**
- `AN7:AN122` BILATERAL HIP DOMNANT: `Glute Bridges`
- `AQ7:AQ42` UNILATERAL HIP DOMINANT: `SL Glute Bridges (foot on the ground)`
- `AR7:AR10` LEG CURLS: **none**
- `AR7:AR42` LEG CURLS: **none**
- `AS7:AS42` BICEP: **none**
- `AT7:AT42` TRICEP: **none**
- `AU7:AU13` CALVES: **none**
- `AZ7:AZ335` FULL FOCUS LIST: `Walking Lunges`, `Stationary Lunges`, `Single leg Glute bridge`, `Hip thrusts/ Glute bridges`

## 3. Equipment and constraint by library level block (progression logic)

Block = nearest level separator above the item inside the stacked column (OBSERVED cell in brackets). Constraint/families INFERRED.

| Range | Block (separator cell) | n | Mean constraint | Machine+cable | Families | Velocity |
|---|---|---|---|---|---|---|
| `C7:C242` | `FOUNDATIONAL (C8)` | 7 | 1.86 | 0 | BB 5, BW 2 | MAX 2, POWER 5 |
| `C7:C242` | `MODERATE (C44)` | 9 | 1.89 | 0 | BB 7, DB 1, BW 1 | POWER 8, MAX 1 |
| `C7:C242` | `ADVANCED (C89)` | 6 | 1 | 0 | BB 6 | POWER 6 |
| `C7:C242` | `EASY (C124)` | 11 | 1.55 | 0 | BW 11 | MAX 11 |
| `G7:G162` | `FOUNDATIONAL (G8)` | 7 | 1 | 0 | PROP 5, BW 2 | MAX 7 |
| `G7:G162` | `MODERATE (G44)` | 12 | 1 | 0 | PROP 9, BW 3 | MAX 12 |
| `G7:G162` | `MODERATE (G89)` | 6 | 1 | 0 | PROP 6 | MAX 6 |
| `G7:G162` | `ADVANCED (G124)` | 16 | 1 | 0 | PROP 6, BW 4, DB 4, FIELD 2 | MAX 12, POWER 4 |
| `O7:O283` | `CORE THORAX FOUNDATIONAL (O9)` | 6 | 2.17 | 0 | BW 3, BAR 2, DB 1 | CORE 6 |
| `O7:O283` | `CORE THORAX MODERATE (O45)` | 1 | 2 | 0 | BW 1 | CORE 1 |
| `O7:O283` | `CORE THORAX ADVANCED (O90)` | 3 | 3 | 2 | CABLE 2, BW 1 | CORE 3 |
| `O7:O283` | `CORE PELVIS FOUNDATIONAL (O126)` | 4 | 2.5 | 0 | BW 3, BAR 1 | CORE 4 |
| `O7:O283` | `CORE PELVIS MODERATE (O162)` | 2 | 2 | 0 | BW 1, PROP 1 | CORE 2 |
| `O7:O283` | `CORE PELVIS ADVANCED (O207)` | 1 | 1 | 0 | BAR 1 | CORE 1 |
| `U7:U122` | `FOUNDATIONAL (U8)` | 12 | 3.83 | 9 | MACHINE 9, BAR 1, SUSP 1, KB 1 | CONTROLLED 12 |
| `U7:U122` | `ADVANCED (U44)` | 7 | 1 | 0 | BAR 7 | CONTROLLED 6, STRENGTH 1 |
| `U7:U122` | `UNILATERAL (U89)` | 1 | 4 | 1 | MACHINE 1 | CONTROLLED 1 |
| `X7:X162` | `FOUNDATIONAL (X8)` | 5 | 4 | 3 | MACHINE 3, SUSP 1, BAR 1 | CONTROLLED 5 |
| `X7:X162` | `ADVANCED (X44)` | 9 | 2.33 | 0 | BB 6, DB 3 | STRENGTH 6, CONTROLLED 3 |
| `X7:X162` | `UNILATERAL (X89)` | 2 | 2.5 | 1 | DB 1, CABLE 1 | CONTROLLED 2 |
| `AA7:AA122` | `FOUNDATIONAL (AA8)` | 6 | 2.33 | 0 | DB 3, BB 3 | CONTROLLED 1, STRENGTH 1, POWER 4 |
| `AA7:AA122` | `ADVANCED (AA44)` | 10 | 1.9 | 0 | DB 5, BB 3, BW 2 | CONTROLLED 8, POWER 2 |
| `AA7:AA122` | `UNILATERAL (AA89)` | 4 | 1.5 | 0 | DB 3, BB 1 | CONTROLLED 3, POWER 1 |
| `AD7:AD162` | `FOUNDATIONAL (AD8)` | 6 | 2.83 | 2 | BW 3, CABLE 1, DB 1, MACHINE 1 | CONTROLLED 6 |
| `AD7:AD162` | `MODERATE (AD44)` | 5 | 3 | 2 | BW 2, DB 1, CABLE 1, MACHINE 1 | CONTROLLED 5 |
| `AD7:AD162` | `ADVANCED (AD89)` | 9 | 2.11 | 0 | BW 4, DB 2, BAR 2, BB 1 | CONTROLLED 7, STRENGTH 2 |
| `AD7:AD162` | `UNILATERAL (AD124)` | 5 | 2.6 | 1 | DB 3, CABLE 1, BW 1 | CONTROLLED 5 |
| `AI7:AI122` | `FOUNDATIONAL (AI8)` | 12 | 2.75 | 1 | BB 4, DB 4, BW 2, PROP 1, MACHINE 1 | STRENGTH 3, CONTROLLED 8, ISOLATION 1 |
| `AI7:AI122` | `MODERATE (AI44)` | 9 | 2.78 | 2 | BB 5, MACHINE 2, DB 1, KB 1 | STRENGTH 4, CONTROLLED 4, ISOLATION 1 |
| `AI7:AI122` | `ADVANCED (AI89)` | 14 | 3.43 | 4 | BB 7, MACHINE 4, DB 2, BW 1 | POWER 6, STRENGTH 3, CONTROLLED 4, ISOLATION 1 |
| `AN7:AN122` | `FOUNDATIONAL (AN8)` | 12 | 2.83 | 3 | KB 3, PROP 3, BW 2, MACHINE 2, CABLE 1, MB 1 | CONTROLLED 10, ISOLATION 1, POWER 1 |
| `AN7:AN122` | `MODERATE (AN44)` | 10 | 3.4 | 5 | MACHINE 5, DB 2, BB 2, PROP 1 | CONTROLLED 7, STRENGTH 2, ISOLATION 1 |
| `AN7:AN122` | `ADVANCED (AN89)` | 11 | 2.64 | 2 | BB 7, MACHINE 2, PROP 1, DB 1 | CONTROLLED 2, STRENGTH 7, ISOLATION 2 |
| `AQ7:AQ42` | `FOUNDATIONAL (AQ8)` | 8 | 2 | 0 | BW 3, DB 3, BB 2 | CONTROLLED 7, STRENGTH 1 |

*Reading (INFERRED):* upper-body progressions remove external constraint (pulldown/assisted machine -> strict and weighted pull-ups; machine row/TRX -> barbell rows; supported presses -> standing, Z press, unilateral). Lower-body progressions keep or add machines as the level rises (`Hack Squats`, `Leg press`, `Pendulum Squat` in ADVANCED AI97:AI99; 5 machines in AN MODERATE) and add speed-strength methods (`Box. Any Squat Touch and Go fast`, banded/reverse-banded) - i.e. 'advanced' = more load/velocity capacity, not less stability. Plyos never change implement class (box/plates/hurdles at every level); progression is height (`Low` -> `Medium` -> `High Depth Drop (above hip)`), stance (bilateral -> SL) and, only in ADVANCED, added dumbbells. Triple extension goes BW pattern -> barbell pulls without catch -> full lifts with catch (constraint 1.86 -> 1.89 -> 1.0).

## 4. Session-by-session equipment / intent sequence (every session)

Columns: `#` slot order; slot = PURPOSE / CATEGORY (or DETAIL) verbatim; cell -> wired range; library category; implements = **actual exercise** -> equipment [family] when filled, else the pool's family mix with no-equip/home counts; constraint (actual, or pool mean with range); velocity intent (actual, or pool mode); T = slot tier. Sets x reps shown when filled (OBSERVED).

### 00 - `AESTHETICS - FULL BODY - 4 DAYS` (aesthetics)

Title cell: `AESTHETICS - FULL BODY - 4 DAYS A WEEK`. Main sessions: 4, accessory/optional sessions: 2, slots per main session: [7].

**Day 1** (main, day cell `A3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / Calves` | D3 -> `AU7:AU13` | `CALVES` | **`Machine Calf Raises`** -> calf raise machine [MACHINE] | 5 | ISOLATION | 5 | 3 x 15 Reps |
| 2 | `Quads / Bilateral KD` | D4 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | **`Leg press`** -> leg press machine [MACHINE] | 5 | CONTROLLED | 3 | 3 x 15 Reps |
| 3 | `Back / Horizontal Pull` | D5 -> `X7:X162` | `HORIZONTAL PULL` | **`Bent Over Barbell Rows`** -> barbell, plates [BB] | 2 | CONTROLLED | 4 | 3 x 8 to 12 Reps |
| 4 | `Quads/Glutes / Unilateral KD` | D6 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | **`Reverse Lunges `** -> none (DBs optional) [BW] | 1 | CONTROLLED | 4 | 3 x 8 to 12 Reps |
| 5 | `Back / Vertical Pull` | D7 -> `U7:U122` | `VERTICAL PULL` | **`Lat Pulldown Pronated Grip`** -> lat pulldown station (seat + thigh pad, cable stack) [MACHINE] | 4 | CONTROLLED | 4 | 3 x 15 Reps |
| 6 | `Bicep / Bicep` | D8 -> `AS7:AS42` | `BICEP` | **`Ez Bar Curls`** -> EZ bar [BB] | 2 | ISOLATION | 5 | 2 x 20 Reps |
| 7 | `Quads / Leg Extensions` | D9 -> `AM7:AM9` | `LEG EXTENSIONS` | **`Leg Extensions`** -> leg extension machine [MACHINE] | 5 | ISOLATION | 5 | 2 x 20 Reps |

Sequence check: tiers [5, 3, 4, 4, 4, 5, 5] -> monotone **False** (inversions 4; adjacent breaks: #1 `Calves/Calves` (T5) before `Quads/Bilateral KD` (T3)). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `LLULUUL`. Constraint by position [5, 5, 2, 1, 4, 2, 5] (Spearman vs position -0.206; first half 4, second half 3).

**Day 2** (main, day cell `A10`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | D10 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | **`DB Deadlifts`** -> dumbbells [DB] | 2 | CONTROLLED | 3 | 3 x 15 Reps |
| 2 | `Chest / Horizontal Push` | D11 -> `AD7:AD162` | `HORIZONTAL PUSH` | **`Push Ups `** -> floor [BW] | 2 | CONTROLLED | 4 | 3 x 15 Reps |
| 3 | `Hamstring/Glutes / Unilateral HD` | D12 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | **`Staggered Stance DL w/ DB `** -> dumbbells [DB] | 2 | CONTROLLED | 4 | not set |
| 4 | `Chest/Shoulders / Vertical Push` | D13 -> `AA7:AA122` | `VERTICAL PUSH` | **`DB Push press`** -> dumbbells [DB] | 2 | POWER | 4 | 5 x 6 to 8 Reps |
| 5 | `Hamstrings / Leg Curls` | D14 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Tricep / (blank)` | D15 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Shoulders/Traps / ABdution` | D16 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 4, 4, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `LULULUU`. Constraint by position [2, 2, 2, 2, 5, 2.78, 2.67] (Spearman vs position 0.749; first half 2, second half 3.11).

**Optional** (accessory/optional, day cell `A17`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | D18 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | D19 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | D20 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | D21 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | D22 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**Day 3** (main, day cell `A24`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / Calves` | D24 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Quads / Bilateral KD` | D25 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Back / Horizontal Pull` | D26 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Quads/Glutes / Unilateral KD` | D27 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 5 | `Back / Vertical Pull` | D28 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 6 | `Bicep / Bicep` | D29 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Quads / Leg Extensions` | D30 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [5, 3, 4, 4, 4, 5, 5] -> monotone **False** (inversions 4; adjacent breaks: #1 `Calves/Calves` (T5) before `Quads/Bilateral KD` (T3)). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `LLULUUL`. Constraint by position [2.6, 3.03, 2.88, 1.23, 2.85, 2.5, 5] (Spearman vs position 0.107; first half 2.84, second half 2.9).

**Day 4** (main, day cell `A31`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | D31 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Chest / Horizontal Push` | D32 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | D33 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest/Shoulders / Vertical Push` | D34 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Hamstrings / Leg Curls` | D35 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Tricep / (blank)` | D36 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Shoulders/Traps / ABdution` | D37 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 4, 4, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `LULULUU`. Constraint by position [2.94, 2.56, 2, 1.95, 5, 2.78, 2.67] (Spearman vs position 0.107; first half 2.5, second half 3.1).

**Optional** (accessory/optional, day cell `A38`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | D39 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | D40 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | D41 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | D42 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | D43 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

### 01 - `3 DAY BUILDER` (aesthetics)

Title cell: `AESTHETICS - FULL BODY - 3 DAYS A WEEK`. Main sessions: 3, accessory/optional sessions: 3, slots per main session: [5].

**DAY 1** (main, day cell `A3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / Calves` | D3 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Quads / Bilateral KD` | D4 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Back / Horizontal Pull` | D5 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Quads/Glutes / Unilateral KD` | D6 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 5 | `Back / Vertical Pull` | D7 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |

Sequence check: tiers [5, 3, 4, 4, 4] -> monotone **False** (inversions 4; adjacent breaks: #1 `Calves/Calves` (T5) before `Quads/Bilateral KD` (T3)). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `LLULU`. Constraint by position [2.6, 3.03, 2.88, 1.23, 2.85] (Spearman vs position -0.2; first half 2.81, second half 2.32).

**Optional** (accessory/optional, day cell `A8`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | D8 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | D9 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | D10 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | D11 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | D12 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**DAY 2** (main, day cell `A13`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | D13 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Chest / Horizontal Push` | D14 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | D15 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest/Shoulders / Vertical Push` | D16 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Hamstrings / Leg Curls` | D17 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `LULUL`. Constraint by position [2.94, 2.56, 2, 1.95, 5] (Spearman vs position 0.0; first half 2.75, second half 2.98).

**Optional** (accessory/optional, day cell `A18`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | D18 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | D19 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | D20 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | D21 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | D22 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**DAY 3** (main, day cell `A23`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | D23 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Hamstring / Bilateral HD` | D24 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Back / Horizontal Pull` | D25 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest / Horizontal Push` | D26 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 5 | `Quads/Glutes / Unilateral KD` | D27 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |

Sequence check: tiers [3, 3, 4, 4, 4] -> monotone **True** (inversions 0; adjacent breaks: none). Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `LLUUL`. Constraint by position [3.03, 2.94, 2.88, 2.56, 1.23] (Spearman vs position -1.0; first half 2.98, second half 2.22).

**Optional** (accessory/optional, day cell `A28`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | D28 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | D29 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | D30 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | D31 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | D32 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

### 02 - `PUSHPULLLEGS - 3 or 6 DAYS A WK` (aesthetics (bodybuilding split))

Title cell: `PUSH/PULL/LEGS - 6 DAYS A WK`. Main sessions: 6, accessory/optional sessions: 0, slots per main session: [7].

**MONDAY** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Chest / Horizontal Push` | E3 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 2 | `Chest/Shoulders / Vertical Push` | E4 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 3 | `Chest / Incline` | E5 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19); label-narrowed* BW 50%, DB 50% | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest / Flies` | E6 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19); label-narrowed* DB 33%, CABLE 33%, MACHINE 33% | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 5 | `Chest / Dips` | E7 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19); label-narrowed* BAR 100% | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 6 | `Tricep / Push` | E8 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4); label-narrowed* CABLE 100% | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Tricep / Overhead` | E9 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4); label-narrowed* DB 50%, CABLE 50% | 2.78 (2-3) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [4, 4, 4, 4, 4, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `UUUUUUU`. Constraint by position [2.56, 1.95, 2.56, 2.56, 2.56, 2.78, 2.78] (Spearman vs position 0.797; first half 2.36, second half 2.67).

**TUESDAY** (main, day cell `B10`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Back / Horizontal Pull` | E10 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 2 | `Back / Horizontal Pull` | E11 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Back / Vertical Pull` | E12 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Shoulders/Traps / ABdution` | E13 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |
| 5 | `Shoulders/Traps / Reverse Flies` | E14 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, MACHINE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |
| 6 | `Bicep / Bicep` | E15 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Bicep / Bicep` | E16 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [4, 4, 4, 5, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True. Region string (A athletic, L lower, U upper, X other): `UUUUUUU`. Constraint by position [2.88, 2.88, 2.85, 2.67, 2.67, 2.5, 2.5] (Spearman vs position -0.973; first half 2.87, second half 2.58).

**WEDNESDAY** (main, day cell `B17`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | E17 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Hamstring / Bilateral HD` | E18 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Quads/Glutes / Unilateral KD` | E19 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 4 | `Quads / Leg Extensions` | E20 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 5 | `Hamstrings / Leg Curls` | E21 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Hamstring/Glutes / Unilateral HD` | E22 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 7 | `Focus 1 / (blank)` | E23 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

Sequence check: tiers [3, 3, 4, 5, 5, 4, 6] -> monotone **False** (inversions 2; adjacent breaks: #5 `Hamstrings/Leg Curls` (T5) before `Hamstring/Glutes/Unilateral HD` (T4)). Bilateral KD before Unilateral KD: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `LLLLLLX`. Constraint by position [3.03, 2.94, 1.23, 5, 5, 2, 2.86] (Spearman vs position -0.162; first half 2.4, second half 3.71).

**Thursday** (main, day cell `B24`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Chest / Horizontal Push` | E24 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 2 | `Chest/Shoulders / Vertical Push` | E25 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 3 | `Chest / Incline` | E26 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19); label-narrowed* BW 50%, DB 50% | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest / Flies` | E27 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19); label-narrowed* DB 33%, CABLE 33%, MACHINE 33% | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 5 | `Chest / Dips` | E28 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19); label-narrowed* BAR 100% | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 6 | `Tricep / Push` | E29 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4); label-narrowed* CABLE 100% | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Tricep / Overhead` | E30 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4); label-narrowed* DB 50%, CABLE 50% | 2.78 (2-3) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [4, 4, 4, 4, 4, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `UUUUUUU`. Constraint by position [2.56, 1.95, 2.56, 2.56, 2.56, 2.78, 2.78] (Spearman vs position 0.797; first half 2.36, second half 2.67).

**Friday** (main, day cell `B31`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Back / Horizontal Pull` | E31 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 2 | `Back / Horizontal Pull` | E32 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Back / Vertical Pull` | E33 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Shoulders/Traps / ABdution` | E34 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |
| 5 | `Shoulders/Traps / Reverse Flies` | E35 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, MACHINE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |
| 6 | `Bicep / Bicep` | E36 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Bicep / Bicep` | E37 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [4, 4, 4, 5, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True. Region string (A athletic, L lower, U upper, X other): `UUUUUUU`. Constraint by position [2.88, 2.88, 2.85, 2.67, 2.67, 2.5, 2.5] (Spearman vs position -0.973; first half 2.87, second half 2.58).

**Saturday** (main, day cell `B38`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | E38 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Hamstring / Bilateral HD` | E39 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Quads/Glutes / Unilateral KD` | E40 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 4 | `Quads / Leg Extensions` | E41 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 5 | `Hamstrings / Leg Curls` | E42 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Hamstring/Glutes / Unilateral HD` | E43 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 7 | `Focus 1 / (blank)` | E44 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

Sequence check: tiers [3, 3, 4, 5, 5, 4, 6] -> monotone **False** (inversions 2; adjacent breaks: #5 `Hamstrings/Leg Curls` (T5) before `Hamstring/Glutes/Unilateral HD` (T4)). Bilateral KD before Unilateral KD: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `LLLLLLX`. Constraint by position [3.03, 2.94, 1.23, 5, 5, 2, 2.86] (Spearman vs position -0.162; first half 2.4, second half 3.71).

### 03 - `ATHLETIC - FULL BODY - 4 DAYS A` (athletic)

Title cell: `ATHLETIC - FULL BODY - 4 DAYS A WEEK`. Main sessions: 4, accessory/optional sessions: 2, slots per main session: [10].

**MONDAY** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / Plyo` | E3 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Plyo / Plyo` | E4 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 3 | `Throwing / Throwing` | E5 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 4 | `COD / COD` | E6 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 5 | `Tripple Extension / Tripple Extension` | E7 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 6 | `Quads / Bilateral KD` | E8 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 7 | `Back / Horizontal Pull` | E9 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 8 | `Quads/Glutes / Unilateral KD` | E10 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 9 | `Back / Vertical Pull` | E11 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 10 | `Quads / Leg Extensions` | E12 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 1, 2, 3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `AAAAALULUL`. Constraint by position [1, 1, 1.95, 1, 1.61, 3.03, 2.88, 1.23, 2.85, 5] (Spearman vs position 0.73; first half 1.31, second half 3.0).

**TUESDAY** (main, day cell `B13`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / PLYO` | E13 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Throwing / Throwing` | E14 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 3 | `COD / COD` | E15 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 4 | `Tripple Extension / Tripple Extension` | E16 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 5 | `Hamstring / Bilateral HD` | E17 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 6 | `Chest / Horizontal Push` | E18 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 7 | `Hamstring/Glutes / Unilateral HD` | E19 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 8 | `Chest/Shoulders / Vertical Push` | E20 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 9 | `Hamstrings / Leg Curls` | E21 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 10 | `Shoulders/Traps / ABdution` | E22 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 2, 3, 4, 4, 4, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `AAAALULULU`. Constraint by position [1, 1.95, 1, 1.61, 2.94, 2.56, 2, 1.95, 5, 2.67] (Spearman vs position 0.726; first half 1.7, second half 2.84).

**WEDNESDAY** (accessory/optional, day cell `B23`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E24 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Aerobic Capacity / (blank)` | E25 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E26 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E27 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E28 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**THURSDAY (DAY cell blank in sheet; inferred by position)** (main, day cell `B30`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / Plyo` | E30 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Plyo / Plyo` | E31 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 3 | `Throwing / Throwing` | E32 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 4 | `COD / COD` | E33 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 5 | `Tripple Extension / Tripple Extension` | E34 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 6 | `Quads / Bilateral KD` | E35 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 7 | `Back / Horizontal Pull` | E36 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 8 | `Quads/Glutes / Unilateral KD` | E37 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 9 | `Back / Vertical Pull` | E38 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 10 | `Quads / Leg Extensions` | E39 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 1, 2, 3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `AAAAALULUL`. Constraint by position [1, 1, 1.95, 1, 1.61, 3.03, 2.88, 1.23, 2.85, 5] (Spearman vs position 0.73; first half 1.31, second half 3.0).

**FRIDAY** (main, day cell `B40`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / PLYO` | E40 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Throwing / Throwing` | E41 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 3 | `COD / COD` | E42 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 4 | `Tripple Extension / Tripple Extension` | E43 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 5 | `Hamstring / Bilateral HD` | E44 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 6 | `Chest / Horizontal Push` | E45 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 7 | `Hamstring/Glutes / Unilateral HD` | E46 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 8 | `Chest/Shoulders / Vertical Push` | E47 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 9 | `Hamstrings / Leg Curls` | E48 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 10 | `Shoulders/Traps / ABdution` | E49 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 2, 3, 4, 4, 4, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `AAAALULULU`. Constraint by position [1, 1.95, 1, 1.61, 2.94, 2.56, 2, 1.95, 5, 2.67] (Spearman vs position 0.726; first half 1.7, second half 2.84).

**SATURDAY** (accessory/optional, day cell `B50`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E51 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Aerobic Capacity / (blank)` | E52 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E53 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E54 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E55 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

### 04 - `JUSTICE LEAGUE` (athletic (filled example))

Title cell: `ATHLETIC - FULL BODY - 4 DAYS A WEEK`. Main sessions: 4, accessory/optional sessions: 2, slots per main session: [10].

**MONDAY** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / Plyo` | E3 -> `G7:G162` | `PLYOS` | **`Medium Depth Drop`** -> plyo box / sturdy step [PROP] | 1 | MAX | 1 | 2 x 6 to 8 Reps |
| 2 | `Plyo / Plyo` | E4 -> `G7:G162` | `PLYOS` | **`Ankle Hops `** -> none [BW] | 1 | MAX | 1 | 2 x 6 to 8 Reps |
| 3 | `Throwing / Throwing` | E5 -> `K7:K87` | `THROWING` | **`Situps to overhead throw`** -> medicine ball (light, ~8-10 lb per coach), wall or partner [MB] | 3 | MAX | 1 | 2 x 8 to 12 Reps |
| 4 | `COD / COD` | E6 -> `L7:L242` | `CHANGE OF DIRECTION` | **`DIG/OUT`** -> open field (cones optional) [FIELD] | 1 | MAX | 1 | 2 x 6 to 8 Reps (H note `LATERAL`) |
| 5 | `Tripple Extension / Tripple Extension` | E7 -> `C7:C242` | `TRIPPLE EXTENSION` | **`Power Clean`** -> barbell, bumper plates, platform [BB] | 1 | POWER | 2 | 2 x 6 to 8 Reps |
| 6 | `Quads / Bilateral KD` | E8 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | **`Front Squats`** -> barbell, squat rack [BB] | 2 | STRENGTH | 3 | 2 x 6 to 8 Reps |
| 7 | `Back / Horizontal Pull` | E9 -> `X7:X162` | `HORIZONTAL PULL` | **`Cable Machine UL Rows`** -> cable stack (single handle) [CABLE] | 3 | CONTROLLED | 4 | 2 x 8 to 12 Reps (H note `SINGLE ARM`) |
| 8 | `Quads/Glutes / Unilateral KD` | E10 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | **`Front Foot Elevated Lunges (FFE)`** -> step / plate (front foot), DBs optional [BW] | 1 | CONTROLLED | 4 | 2 x 8 to 12 Reps |
| 9 | `Back / Vertical Pull` | E11 -> `U7:U122` | `VERTICAL PULL` | **`Stricted Pull-ups feet in front `** -> pull-up bar [BAR] | 1 | CONTROLLED | 4 | 2 x 8 to 12 Reps |
| 10 | `Quads / Leg Extensions` | E12 -> `AM7:AM9` | `LEG EXTENSIONS` | **`Leg Extensions`** -> leg extension machine [MACHINE] | 5 | ISOLATION | 5 | 2 x MYO SET (H note `OUCH`) |

Sequence check: tiers [1, 1, 1, 1, 2, 3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `AAAAALULUL`. Constraint by position [1, 1, 3, 1, 1, 2, 3, 1, 1, 5] (Spearman vs position 0.356; first half 1.4, second half 2.4).

**TUESDAY** (main, day cell `B13`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / PLYO` | E13 -> `G7:G162` | `PLYOS` | **`SL Depth Drops`** -> plyo box / sturdy step [PROP] | 1 | MAX | 1 | 2 x 6 to 8 Reps |
| 2 | `Throwing / Throwing` | E14 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 3 | `COD / COD` | E15 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 4 | `Tripple Extension / Tripple Extension` | E16 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 5 | `Hamstring / Bilateral HD` | E17 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 6 | `Chest / Horizontal Push` | E18 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 7 | `Hamstring/Glutes / Unilateral HD` | E19 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 8 | `Chest/Shoulders / Vertical Push` | E20 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 9 | `Hamstrings / Leg Curls` | E21 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 10 | `Shoulders/Traps / ABdution` | E22 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 2, 3, 4, 4, 4, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `AAAALULULU`. Constraint by position [1, 1.95, 1, 1.61, 2.94, 2.56, 2, 1.95, 5, 2.67] (Spearman vs position 0.726; first half 1.7, second half 2.84).

**WEDNESDAY** (accessory/optional, day cell `B23`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E24 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Aerobic Capacity / (blank)` | E25 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E26 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E27 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E28 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**THURSDAY (DAY cell blank in sheet; inferred by position)** (main, day cell `B30`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / Plyo` | E30 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Plyo / Plyo` | E31 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 3 | `Throwing / Throwing` | E32 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 4 | `COD / COD` | E33 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 5 | `Tripple Extension / Tripple Extension` | E34 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 6 | `Quads / Bilateral KD` | E35 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | **`Low Bar Back Squat`** -> barbell, squat rack [BB] | 2 | STRENGTH | 3 | not set |
| 7 | `Back / Horizontal Pull` | E36 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 8 | `Quads/Glutes / Unilateral KD` | E37 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 9 | `Back / Vertical Pull` | E38 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 10 | `Quads / Leg Extensions` | E39 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 1, 2, 3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `AAAAALULUL`. Constraint by position [1, 1, 1.95, 1, 1.61, 2, 2.88, 1.23, 2.85, 5] (Spearman vs position 0.779; first half 1.31, second half 2.79).

**FRIDAY** (main, day cell `B40`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / PLYO` | E40 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Throwing / Throwing` | E41 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 3 | `COD / COD` | E42 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 4 | `Tripple Extension / Tripple Extension` | E43 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 5 | `Hamstring / Bilateral HD` | E44 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 6 | `Chest / Horizontal Push` | E45 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 7 | `Hamstring/Glutes / Unilateral HD` | E46 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 8 | `Chest/Shoulders / Vertical Push` | E47 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 9 | `Hamstrings / Leg Curls` | E48 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 10 | `Shoulders/Traps / ABdution` | E49 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 2, 3, 4, 4, 4, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-push before V-push: True; Bilateral HD before Unilateral HD: True. Region string (A athletic, L lower, U upper, X other): `AAAALULULU`. Constraint by position [1, 1.95, 1, 1.61, 2.94, 2.56, 2, 1.95, 5, 2.67] (Spearman vs position 0.726; first half 1.7, second half 2.84).

**SATURDAY** (accessory/optional, day cell `B50`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E51 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Aerobic Capacity / (blank)` | E52 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E53 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E54 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E55 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

### 05 - `BOOTCAMP - OPTION 1` (bootcamp)

Title cell: `BOOTCAMP - FULL BODY - 4 DAYS A WEEK`. Main sessions: 4, accessory/optional sessions: 2, slots per main session: [7].

**MONDAY** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | E3 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Back / Horizontal Pull` | E4 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | E5 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest/Shoulders / Vertical Push` | E6 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Bicep / Bicep` | E7 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 6 | `Calves / Calves` | E8 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 7 | `Quads / Leg Extensions` | E9 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 4, 4, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). . Region string (A athletic, L lower, U upper, X other): `LULUULL`. Constraint by position [3.03, 2.88, 2, 1.95, 2.5, 2.6, 5] (Spearman vs position 0.071; first half 2.64, second half 3.01).

**TUESDAY** (main, day cell `B10`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | E10 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Back / Vertical Pull` | E11 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Quads/Glutes / Unilateral KD` | E12 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest / Horizontal Push` | E13 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 5 | `Hamstrings / Leg Curls` | E14 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Tricep / (blank)` | E15 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Shoulders/Traps / ABdution` | E16 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 4, 4, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). . Region string (A athletic, L lower, U upper, X other): `LULULUU`. Constraint by position [2.94, 2.85, 1.23, 2.56, 5, 2.78, 2.67] (Spearman vs position -0.179; first half 2.34, second half 3.25).

**WEDNESDAY** (accessory/optional, day cell `B17`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E18 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | E19 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E20 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E21 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E22 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**THURSDAY** (main, day cell `B24`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | E24 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Back / Horizontal Pull` | E25 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | E26 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest/Shoulders / Vertical Push` | E27 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Bicep / Bicep` | E28 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 6 | `Calves / Calves` | E29 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 7 | `Quads / Leg Extensions` | E30 -> `AM7:AM9` | `LEG EXTENSIONS` | **`Leg extensions`** -> leg extension machine [MACHINE] (typed lower-case; matched case-insensitively) | 5 | ISOLATION | 5 | not set |

Sequence check: tiers [3, 4, 4, 4, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). . Region string (A athletic, L lower, U upper, X other): `LULUULL`. Constraint by position [3.03, 2.88, 2, 1.95, 2.5, 2.6, 5] (Spearman vs position 0.071; first half 2.64, second half 3.01).

**FRIDAY** (main, day cell `B31`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | E31 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Back / Vertical Pull` | E32 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Quads/Glutes / Unilateral KD` | E33 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 4 | `Chest / Horizontal Push` | E34 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 5 | `Hamstrings / Leg Curls` | E35 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Tricep / (blank)` | E36 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Shoulders/Traps / ABdution` | E37 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 4, 4, 5, 5, 5] -> monotone **True** (inversions 0; adjacent breaks: none). . Region string (A athletic, L lower, U upper, X other): `LULULUU`. Constraint by position [2.94, 2.85, 1.23, 2.56, 5, 2.78, 2.67] (Spearman vs position -0.179; first half 2.34, second half 3.25).

**SATURDAY** (accessory/optional, day cell `B38`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E39 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | E40 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E41 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E42 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E43 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

### 06 - `BOOTCAMP - OPTION 2` (bootcamp)

Title cell: `BOOTCAMP OPTION 1`. Main sessions: 6, accessory/optional sessions: 0, slots per main session: [5].

**1A** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | E3 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Back / Horizontal Pull` | E4 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | E5 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 4 | `Core / (blank)` | E6 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 5 | `Cardio / (blank)` | E7 -> `B7:B335` | `CARDIO` | pool n=43: FIELD 79%, CARDIO_MACHINE 21% (no-equip 34, home 34) | 1.84 (1-5) | AEROBIC (mode) | 6 | - |

Sequence check: tiers [3, 4, 4, 6, 6] -> monotone **True** (inversions 0; adjacent breaks: none). . Region string (A athletic, L lower, U upper, X other): `LULXX`. Constraint by position [3.03, 2.88, 2, 2.29, 1.84] (Spearman vs position -0.9; first half 2.96, second half 2.04).

**2A** (main, day cell `B8`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | E8 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Chest / Horizontal Push` | E9 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Bicep / Bicep` | E10 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 4 | `Chest/Shoulders / Vertical Push` | E11 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Cardio / (blank)` | E12 -> `B7:B335` | `CARDIO` | pool n=43: FIELD 79%, CARDIO_MACHINE 21% (no-equip 34, home 34) | 1.84 (1-5) | AEROBIC (mode) | 6 | - |

Sequence check: tiers [3, 4, 5, 4, 6] -> monotone **False** (inversions 1; adjacent breaks: #3 `Bicep/Bicep` (T5) before `Chest/Shoulders/Vertical Push` (T4)). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `LUUUX`. Constraint by position [2.94, 2.56, 2.5, 1.95, 1.84] (Spearman vs position -1.0; first half 2.75, second half 2.1).

**3A** (main, day cell `B13`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Back / Vertical Pull` | E13 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 2 | `Quads/Glutes / Unilateral KD` | E14 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 3 | `Cardio / (blank)` | E15 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 4 | `Tricep / Tricep` | E16 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 5 | `Shoulders/Traps / ABdution` | E17 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [4, 4, 6, 5, 5] -> monotone **False** (inversions 2; adjacent breaks: #3 `Cardio/None` (T6) before `Tricep/Tricep` (T5)). . Region string (A athletic, L lower, U upper, X other): `ULXUU`. Constraint by position [2.85, 1.23, 1, 2.78, 2.67] (Spearman vs position -0.2; first half 2.04, second half 2.15).

**1B** (main, day cell `B18`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Quads / Bilateral KD` | E18 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Back / Horizontal Pull` | E19 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | E20 -> `AQ7:AQ42` | `UNILATERAL HIP DOMINANT` | pool n=8: BW 38%, DB 38%, BB 25% (no-equip 1, home 6) | 2 (1-3) | CONTROLLED (mode) | 4 | - |
| 4 | `Core / (blank)` | E21 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 5 | `Cardio / (blank)` | E22 -> `B7:B335` | `CARDIO` | pool n=43: FIELD 79%, CARDIO_MACHINE 21% (no-equip 34, home 34) | 1.84 (1-5) | AEROBIC (mode) | 6 | - |

Sequence check: tiers [3, 4, 4, 6, 6] -> monotone **True** (inversions 0; adjacent breaks: none). . Region string (A athletic, L lower, U upper, X other): `LULXX`. Constraint by position [3.03, 2.88, 2, 2.29, 1.84] (Spearman vs position -0.9; first half 2.96, second half 2.04).

**2B** (main, day cell `B23`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | E23 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Chest / Horizontal Push` | E24 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Bicep / Bicep` | E25 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 4 | `Chest/Shoulders / Vertical Push` | E26 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Cardio / (blank)` | E27 -> `B7:B335` | `CARDIO` | pool n=43: FIELD 79%, CARDIO_MACHINE 21% (no-equip 34, home 34) | 1.84 (1-5) | AEROBIC (mode) | 6 | - |

Sequence check: tiers [3, 4, 5, 4, 6] -> monotone **False** (inversions 1; adjacent breaks: #3 `Bicep/Bicep` (T5) before `Chest/Shoulders/Vertical Push` (T4)). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `LUUUX`. Constraint by position [2.94, 2.56, 2.5, 1.95, 1.84] (Spearman vs position -1.0; first half 2.75, second half 2.1).

**3B** (main, day cell `B28`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Back / Vertical Pull` | E28 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 2 | `Quads/Glutes / Unilateral KD` | E29 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 3 | `Cardio / (blank)` | E30 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 4 | `Tricep / Tricep` | E31 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 5 | `Shoulders/Traps / ABdution` | E32 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [4, 4, 6, 5, 5] -> monotone **False** (inversions 2; adjacent breaks: #3 `Cardio/None` (T6) before `Tricep/Tricep` (T5)). . Region string (A athletic, L lower, U upper, X other): `ULXUU`. Constraint by position [2.85, 1.23, 1, 2.78, 2.67] (Spearman vs position -0.2; first half 2.04, second half 2.15).

### 07 - `NO ACCESS - AESTHETICS - FB - 4` (no-access (hidden))

Title cell: `None`. Main sessions: 4, accessory/optional sessions: 2, slots per main session: [7].

**MONDAY** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / Calves` | E3 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Quads / Bilateral KD` | E4 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Back / Horizontal Pull` | E5 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Quads/Glutes / Unilateral KD` | E6 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 5 | `Back / Vertical Pull` | E7 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 6 | `Bicep / Bicep` | E8 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Quads / Leg Extensions` | E9 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [5, 3, 4, 4, 4, 5, 5] -> monotone **False** (inversions 4; adjacent breaks: #1 `Calves/Calves` (T5) before `Quads/Bilateral KD` (T3)). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `LLULUUL`. Constraint by position [2.6, 3.03, 2.88, 1.23, 2.85, 2.5, 5] (Spearman vs position 0.107; first half 2.84, second half 2.9).

**TUESDAY** (main, day cell `B10`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | E10 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Chest / Horizontal Push` | E11 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | E12 -> `AR7:AR42` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) **MISWIRED to LEG CURLS** | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 4 | `Chest/Shoulders / Vertical Push` | E13 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Hamstrings / Leg Curls` | E14 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Tricep / (blank)` | E15 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Shoulders/Traps / ABdution` | E16 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 5, 4, 5, 5, 5] -> monotone **False** (inversions 1; adjacent breaks: #3 `Hamstring/Glutes/Unilateral HD` (T5) before `Chest/Shoulders/Vertical Push` (T4)). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `LULULUU`. Constraint by position [2.94, 2.56, 5, 1.95, 5, 2.78, 2.67] (Spearman vs position -0.072; first half 3.5, second half 3.1).

**WEDNESDAY** (accessory/optional, day cell `B17`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E18 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | E19 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E20 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E21 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E22 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**THURSDAY** (main, day cell `B24`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / Calves` | E24 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Quads / Bilateral KD` | E25 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 3 | `Back / Horizontal Pull` | E26 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 4 | `Quads/Glutes / Unilateral KD` | E27 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 5 | `Back / Vertical Pull` | E28 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 6 | `Bicep / Bicep` | E29 -> `AS7:AS42` | `BICEP` | pool n=14: DB 64%, BB 21%, CABLE 7%, SUSP 7% (no-equip 0, home 10) | 2.5 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Quads / Leg Extensions` | E30 -> `AM7:AM9` | `LEG EXTENSIONS` | pool n=1: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [5, 3, 4, 4, 4, 5, 5] -> monotone **False** (inversions 4; adjacent breaks: #1 `Calves/Calves` (T5) before `Quads/Bilateral KD` (T3)). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `LLULUUL`. Constraint by position [2.6, 3.03, 2.88, 1.23, 2.85, 2.5, 5] (Spearman vs position 0.107; first half 2.84, second half 2.9).

**FRIDAY** (main, day cell `B31`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Hamstring / Bilateral HD` | E31 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 2 | `Chest / Horizontal Push` | E32 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 3 | `Hamstring/Glutes / Unilateral HD` | E33 -> `AR7:AR42` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) **MISWIRED to LEG CURLS** | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 4 | `Chest/Shoulders / Vertical Push` | E34 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 5 | `Hamstrings / Leg Curls` | E35 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 6 | `Tricep / (blank)` | E36 -> `AT7:AT42` | `TRICEP` | pool n=9: CABLE 44%, DB 44%, BB 11% (no-equip 0, home 4) | 2.78 (2-3) | ISOLATION (mode) | 5 | - |
| 7 | `Shoulders/Traps / ABdution` | E37 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [3, 4, 5, 4, 5, 5, 5] -> monotone **False** (inversions 1; adjacent breaks: #3 `Hamstring/Glutes/Unilateral HD` (T5) before `Chest/Shoulders/Vertical Push` (T4)). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `LULULUU`. Constraint by position [2.94, 2.56, 5, 1.95, 5, 2.78, 2.67] (Spearman vs position -0.072; first half 3.5, second half 3.1).

**SATURDAY** (accessory/optional, day cell `B38`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E39 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Cardio / (blank)` | E40 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E41 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E42 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E43 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

### 08 - `NO ACCESS - ATHLETIC - FB - 4 t` (no-access (hidden))

Title cell: `ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK`. Main sessions: 4, accessory/optional sessions: 2, slots per main session: [10].

**MONDAY** (main, day cell `B3`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / Plyo` | E3 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Plyo / Plyo` | E4 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 3 | `Throwing / Throwing` | E5 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 4 | `COD / COD` | E6 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 5 | `Tripple Extension / Tripple Extension` | E7 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 6 | `Quads / Bilateral KD` | E8 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 7 | `Back / Horizontal Pull` | E9 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 8 | `Quads/Glutes / Unilateral KD` | E10 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 9 | `Back / Vertical Pull` | E11 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 10 | `Quads / Leg Extensions` | E12 -> `AM7:AM9` | `LEG EXTENSIONS` | **`Leg extensions`** -> leg extension machine [MACHINE] (typed lower-case; matched case-insensitively) | 5 | ISOLATION | 5 | not set |

Sequence check: tiers [1, 1, 1, 1, 2, 3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `AAAAALULUL`. Constraint by position [1, 1, 1.95, 1, 1.61, 3.03, 2.88, 1.23, 2.85, 5] (Spearman vs position 0.73; first half 1.31, second half 3.0).

**TUESDAY** (main, day cell `B13`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / PLYO` | E13 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Throwing / Throwing` | E14 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 3 | `COD / COD` | E15 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 4 | `Tripple Extension / Tripple Extension` | E16 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 5 | `Hamstring / Bilateral HD` | E17 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 6 | `Chest / Horizontal Push` | E18 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 7 | `Hamstring/Glutes / Unilateral HD` | E19 -> `AR7:AR42` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) **MISWIRED to LEG CURLS** | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 8 | `Chest/Shoulders / Vertical Push` | E20 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 9 | `Hamstrings / Leg Curls` | E21 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 10 | `Shoulders/Traps / ABdution` | E22 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 2, 3, 4, 5, 4, 5, 5] -> monotone **False** (inversions 1; adjacent breaks: #7 `Hamstring/Glutes/Unilateral HD` (T5) before `Chest/Shoulders/Vertical Push` (T4)). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `AAAALULULU`. Constraint by position [1, 1.95, 1, 1.61, 2.94, 2.56, 5, 1.95, 5, 2.67] (Spearman vs position 0.716; first half 1.7, second half 3.44).

**WEDNESDAY** (accessory/optional, day cell `B23`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E24 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Aerobic Capacity / (blank)` | E25 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E26 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E27 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E28 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

**THURSDAY** (main, day cell `B30`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / Plyo` | E30 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Plyo / Plyo` | E31 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 3 | `Throwing / Throwing` | E32 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 4 | `COD / COD` | E33 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 5 | `Tripple Extension / Tripple Extension` | E34 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 6 | `Quads / Bilateral KD` | E35 -> `AI7:AI122` | `BILATERAL KNEE DOMINANT` | pool n=35: BB 46%, DB 20%, MACHINE 20%, BW 9%, +2 more (no-equip 2, home 12) | 3.03 (1-5) | CONTROLLED (mode) | 3 | - |
| 7 | `Back / Horizontal Pull` | E36 -> `X7:X162` | `HORIZONTAL PULL` | pool n=16: BB 38%, DB 25%, MACHINE 19%, SUSP 6%, +2 more (no-equip 0, home 6) | 2.88 (1-5) | CONTROLLED (mode) | 4 | - |
| 8 | `Quads/Glutes / Unilateral KD` | E37 -> `AL7:AL42` | `UNILATERAL KNEE DOMINANT` | pool n=13: BW 85%, PROP 15% (no-equip 7, home 13) | 1.23 (1-2) | CONTROLLED (mode) | 4 | - |
| 9 | `Back / Vertical Pull` | E38 -> `U7:U122` | `VERTICAL PULL` | pool n=20: MACHINE 50%, BAR 40%, SUSP 5%, KB 5% (no-equip 0, home 10) | 2.85 (1-5) | CONTROLLED (mode) | 4 | - |
| 10 | `Quads / Leg Extensions` | E39 -> `AM7:AM9` | `LEG EXTENSIONS` | **`Leg extensions`** -> leg extension machine [MACHINE] (typed lower-case; matched case-insensitively) | 5 | ISOLATION | 5 | not set |

Sequence check: tiers [1, 1, 1, 1, 2, 3, 4, 4, 4, 5] -> monotone **True** (inversions 0; adjacent breaks: none). H-pull before V-pull: True; Bilateral KD before Unilateral KD: True. Region string (A athletic, L lower, U upper, X other): `AAAAALULUL`. Constraint by position [1, 1, 1.95, 1, 1.61, 3.03, 2.88, 1.23, 2.85, 5] (Spearman vs position 0.73; first half 1.31, second half 3.0).

**FRIDAY** (main, day cell `B40`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Plyo / PLYO` | E40 -> `G7:G162` | `PLYOS` | pool n=41: PROP 63%, BW 22%, DB 10%, FIELD 5% (no-equip 11, home 41) | 1 (1-1) | MAX (mode) | 1 | - |
| 2 | `Throwing / Throwing` | E41 -> `K7:K87` | `THROWING` | pool n=20: MB 100% (no-equip 0, home 20) | 1.95 (1-3) | MAX (mode) | 1 | - |
| 3 | `COD / COD` | E42 -> `L7:L242` | `CHANGE OF DIRECTION` | pool n=9: FIELD 100% (no-equip 9, home 9) | 1 (1-1) | MAX (mode) | 1 | - |
| 4 | `Tripple Extension / Tripple Extension` | E43 -> `C7:C242` | `TRIPPLE EXTENSION` | pool n=33: BB 55%, BW 42%, DB 3% (no-equip 14, home 15) | 1.61 (1-2) | POWER (mode) | 2 | - |
| 5 | `Hamstring / Bilateral HD` | E44 -> `AN7:AN122` | `BILATERAL HIP DOMNANT` | pool n=33: MACHINE 27%, BB 27%, PROP 15%, KB 9%, +4 more (no-equip 1, home 14) | 2.94 (2-5) | CONTROLLED (mode) | 3 | - |
| 6 | `Chest / Horizontal Push` | E45 -> `AD7:AD162` | `HORIZONTAL PUSH` | pool n=25: BW 40%, DB 28%, CABLE 12%, MACHINE 8%, +2 more (no-equip 4, home 19) | 2.56 (1-5) | CONTROLLED (mode) | 4 | - |
| 7 | `Hamstring/Glutes / Unilateral HD` | E46 -> `AR7:AR42` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) **MISWIRED to LEG CURLS** | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 8 | `Chest/Shoulders / Vertical Push` | E47 -> `AA7:AA122` | `VERTICAL PUSH` | pool n=20: DB 55%, BB 35%, BW 10% (no-equip 2, home 13) | 1.95 (1-3) | CONTROLLED (mode) | 4 | - |
| 9 | `Hamstrings / Leg Curls` | E48 -> `AR7:AR10` | `LEG CURLS` | pool n=2: MACHINE 100% (no-equip 0, home 0) | 5 (5-5) | ISOLATION (mode) | 5 | - |
| 10 | `Shoulders/Traps / ABdution` | E49 -> `AH7:AH42` | `SIDE RAISES` | pool n=12: DB 67%, CABLE 17%, BB 8%, MACHINE 8% (no-equip 0, home 8); label-narrowed* DB 67%, CABLE 33% | 2.67 (2-5) | ISOLATION (mode) | 5 | - |

Sequence check: tiers [1, 1, 1, 2, 3, 4, 5, 4, 5, 5] -> monotone **False** (inversions 1; adjacent breaks: #7 `Hamstring/Glutes/Unilateral HD` (T5) before `Chest/Shoulders/Vertical Push` (T4)). H-push before V-push: True. Region string (A athletic, L lower, U upper, X other): `AAAALULULU`. Constraint by position [1, 1.95, 1, 1.61, 2.94, 2.56, 5, 1.95, 5, 2.67] (Spearman vs position 0.716; first half 1.7, second half 3.44).

**SATURDAY** (accessory/optional, day cell `B50`)

| # | Slot (verbatim) | Cell -> range | Category | Implements | Constraint | Velocity | T | Sets x reps |
|---|---|---|---|---|---|---|---|---|
| 1 | `Calves / (blank)` | E51 -> `AU7:AU13` | `CALVES` | pool n=5: DB 40%, BW 20%, BB 20%, MACHINE 20% (no-equip 0, home 3) | 2.6 (2-5) | ISOLATION (mode) | 5 | - |
| 2 | `Aerobic Capacity / (blank)` | E52 -> `B7:B122` | `CARDIO` | pool n=29: FIELD 100% (no-equip 29, home 29) | 1 (1-1) | AEROBIC (mode) | 6 | - |
| 3 | `Core / (blank)` | E53 -> `O7:O283` | `CORE THORAX` | pool n=17: BW 53%, BAR 24%, CABLE 12%, DB 6%, +1 more (no-equip 9, home 15) | 2.29 (1-3) | CORE (mode) | 6 | - |
| 4 | `Focus 1 / (blank)` | E54 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |
| 5 | `Focus 2 / (blank)` | E55 -> `AZ7:AZ335` | `FULL FOCUS LIST` | pool n=51: DB 39%, MACHINE 18%, BB 18%, CABLE 12%, +2 more (no-equip 4, home 29) | 2.86 (1-5) | CONTROLLED (mode) | 6 | - |

*label-narrowed = INFERRED subset of the dropdown whose names match the DETAIL label (PPL `Incline`, `Flies`, `Dips`, tricep `Push`/`Overhead`, `Reverse Flies`, `ABdution`); the sheet itself still offers the whole range.

## 5. Does each session run power/speed -> power-strength -> strength -> resistance patterns -> isolation?

| Tab | Main sessions monotone | Where/why the order breaks (OBSERVED slot labels) |
|---|---|---|
| `AESTHETICS - FULL BODY - 4 DAYS` | 2/4 | Day 1 & Day 3 open with `Calves / Calves` (D3 filled `Machine Calf Raises`); Day 2 & 4 monotone (`Bilateral HD` -> `Horizontal Push` -> `Unilateral HD` -> `Vertical Push` -> `Leg Curls` -> `Tricep` -> `ABdution`). |
| `3 DAY BUILDER` | 2/3 | DAY 1 opens with `Calves / Calves`; DAY 2 and DAY 3 monotone. No isolation on DAY 1/3 beyond calves. |
| `PUSHPULLLEGS - 3 or 6 DAYS A WK` | 4/6 | Push and pull days monotone (compound H -> V -> isolation). Leg days (WEDNESDAY, Saturday) place `Leg Extensions` and `Leg Curls` (rows 20-21, 41-42) before `Unilateral HD` (rows 22, 43), then `Focus 1`. |
| `ATHLETIC - FULL BODY - 4 DAYS A` | 4/4 | All 4 main days monotone; athletic block first, `Tripple Extension` 5th (Mon/Thu) or 4th (Tue/Fri), isolation last. |
| `JUSTICE LEAGUE` | 4/4 | Same as 03 (identical wiring, 0 differences); filled Monday follows it with real exercises. |
| `BOOTCAMP - OPTION 1` | 4/4 | All 4 main days monotone (compound -> patterns -> `Bicep`/`Calves`/`Leg Extensions` or `Leg Curls`/`Tricep`/`ABdution`). |
| `BOOTCAMP - OPTION 2` | 2/6 | 1A/1B monotone (cardio last). 2A/2B: `Bicep` (row 10/25) before `Vertical Push` (row 11/26). 3A/3B: `Cardio` third (E15/E30) between `Unilateral KD` and `Tricep`. |
| `NO ACCESS - AESTHETICS - FB - 4` | 0/4 | MONDAY/THURSDAY open with `Calves` (as AESTHETICS); TUESDAY/FRIDAY break only because the miswired `Unilateral HD` row is a leg curl (tier 5) placed before `Vertical Push`. |
| `NO ACCESS - ATHLETIC - FB - 4 t` | 2/4 | MONDAY/THURSDAY monotone; TUESDAY/FRIDAY break only through the miswired `Unilateral HD` (AR) before `Vertical Push`. |

*Interpretation (INFERRED):* the strict 5-step order is the athletic template's skeleton. The physique/bootcamp templates have no tier-1/2 slots, start at tier 3 (`Bilateral KD`/`Bilateral HD`) and keep the rest of the order, with two deliberate-looking exceptions: calves first on the knee-dominant day (low-cost, possibly a warm-up for ankles before squatting) and bootcamp cardio inserted mid-circuit. Within a tier the observed sub-rules are: plyo (lower-body reactive) before throw (upper-body/trunk ballistic) before COD; horizontal before vertical; bilateral before unilateral; and lower/upper alternation (region strings `LULULUU`, `AAAALULULU`) which also lets one pattern rest while the other works (SCIENCE: non-competing pairing / superset-friendly; the SETS list even offers `SUPERSET W/ 👇`, AV16).

## 6. Implement & constraint mix per program and per family of templates

Pool-weighted share = for every main-day slot, the actual exercise's family (if filled) or the family share of its dropdown, averaged over slots (INFERRED tags).

| Tab | Group | Main slots | Family share (main days) | Filled slots: families | Mean constraint | Slots with a no-equip option | ... with a home-kit option | Slot tiers (main) | Modal velocity (main) |
|---|---|---|---|---|---|---|---|---|---|
| `AESTHETICS - FULL BODY - 4 DAYS` | aesthetics | 28 | MACHINE 31%, DB 29%, BB 16%, BW 14%, CABLE 5%, BAR 2%, +4 more | 11: MACHINE 4, BB 2, BW 2, DB 3 | 2.94 | 12/28 | 24/28 | {'3': 4, '4': 12, '5': 12} | {'CONTROLLED': 15, 'ISOLATION': 12, 'POWER': 1} |
| `3 DAY BUILDER` | aesthetics | 15 | BW 23%, MACHINE 21%, BB 21%, DB 20%, BAR 5%, PROP 4%, +4 more | 0: - | 2.65 | 10/15 | 14/15 | {'3': 4, '4': 9, '5': 2} | {'CONTROLLED': 13, 'ISOLATION': 2} |
| `PUSHPULLLEGS - 3 or 6 DAYS A WK` | aesthetics (bodybuilding split) | 42 | DB 32%, MACHINE 19%, BB 15%, BW 15%, CABLE 10%, BAR 4%, +4 more | 0: - | 2.8 | 20/42 | 38/42 | {'3': 4, '4': 20, '5': 16, '6': 2} | {'CONTROLLED': 26, 'ISOLATION': 16} |
| `ATHLETIC - FULL BODY - 4 DAYS A` | athletic | 40 | BW 17%, MACHINE 17%, BB 15%, DB 14%, PROP 11%, FIELD 11%, +5 more | 0: - | 2.21 | 26/40 | 36/40 | {'1': 14, '2': 4, '3': 4, '4': 12, '5': 6} | {'CONTROLLED': 16, 'MAX': 14, 'ISOLATION': 6, 'POWER': 4} |
| `JUSTICE LEAGUE` | athletic (filled example) | 40 | BB 18%, BW 17%, MACHINE 14%, DB 11%, PROP 11%, FIELD 10%, +5 more | 12: PROP 2, BW 2, MB 1, FIELD 1, BB 3, CABLE 1, BAR 1, MACHINE 1 | 2.12 | 26/40 | 36/40 | {'1': 14, '2': 4, '3': 4, '4': 12, '5': 6} | {'MAX': 14, 'CONTROLLED': 14, 'ISOLATION': 6, 'POWER': 4, 'STRENGTH': 2} |
| `BOOTCAMP - OPTION 1` | bootcamp | 28 | DB 28%, MACHINE 25%, BB 17%, BW 15%, CABLE 6%, BAR 4%, +4 more | 1: MACHINE 1 | 2.86 | 12/28 | 24/28 | {'3': 4, '4': 12, '5': 12} | {'CONTROLLED': 16, 'ISOLATION': 12} |
| `BOOTCAMP - OPTION 2` | bootcamp | 30 | DB 24%, FIELD 17%, BW 16%, BB 14%, MACHINE 9%, CABLE 7%, +6 more | 0: - | 2.29 | 20/30 | 30/30 | {'3': 4, '4': 12, '5': 6, '6': 8} | {'CONTROLLED': 16, 'AEROBIC': 6, 'ISOLATION': 6, 'CORE': 2} |
| `NO ACCESS - AESTHETICS - FB - 4` | no-access (hidden) | 28 | MACHINE 32%, DB 25%, BB 15%, BW 12%, CABLE 6%, BAR 4%, +4 more | 0: - | 3.07 | 10/28 | 22/28 | {'3': 4, '4': 10, '5': 14} | {'ISOLATION': 14, 'CONTROLLED': 14} |
| `NO ACCESS - ATHLETIC - FB - 4 t` | no-access (hidden) | 40 | MACHINE 22%, BW 15%, BB 13%, DB 12%, PROP 11%, FIELD 11%, +5 more | 2: MACHINE 2 | 2.36 | 24/40 | 34/40 | {'1': 14, '2': 4, '3': 4, '4': 10, '5': 8} | {'MAX': 14, 'CONTROLLED': 14, 'ISOLATION': 8, 'POWER': 4} |

| Group | Tabs | Main slots | Machine+cable | Free weights (DB/KB/BB/MB) | BW/field/props/bars | Mean constraint | No-equip coverage | Home-kit coverage | Slots that need a gym machine |
|---|---|---|---|---|---|---|---|---|---|
| aesthetics | `AESTHETICS - FULL BODY - 4 DAYS`, `3 DAY BUILDER`, `PUSHPULLLEGS - 3 or 6 DAYS A WK` | 85 | 31% | 46% | 22% | 2.82 | 42/85 | 76/85 | 9 |
| athletic | `ATHLETIC - FULL BODY - 4 DAYS A`, `JUSTICE LEAGUE` | 80 | 18% | 40% | 42% | 2.17 | 52/80 | 72/80 | 8 |
| bootcamp | `BOOTCAMP - OPTION 1`, `BOOTCAMP - OPTION 2` | 58 | 23% | 43% | 31% | 2.56 | 32/58 | 54/58 | 4 |
| no-access | `NO ACCESS - AESTHETICS - FB - 4`, `NO ACCESS - ATHLETIC - FB - 4 t` | 68 | 30% | 38% | 31% | 2.65 | 34/68 | 56/68 | 12 |

Accessory / optional days (`Calves`, `Cardio` or `Aerobic Capacity`, `Core`, `Focus 1`, `Focus 2`) are identical in every tab that has them: calves `AU7:AU13` (5 options, 1 machine), cardio `B7:B122` (29 running options, 0 equipment), core `O7:O283` (17 options: 9 BW floor, 4 bar, 2 cable, 1 weighted, 1 bench), focus `AZ7:AZ335` (51 options: DB 39%, machine 18%, barbell 18%, cable 12%, BW 10%). Mean constraint of accessory days by position (Calves, Cardio, Core, Focus 1, Focus 2) is identical in all 7 tabs that have them: 2.6, 1, 2.29, 2.86, 2.86.

## 7. Constraint by slot position (main days)

Mean constraint at each position across the tab's main sessions (actual score where filled, else pool mean). INFERRED scores.

| Tab | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 | p9 | p10 | Spearman(pos, constraint) over all main slots |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `AESTHETICS - FULL BODY - 4 DAYS` | 3.13 | 3.15 | 2.22 | 1.54 | 4.21 | 2.51 | 3.83 |  |  |  | 0.147 |
| `3 DAY BUILDER` | 2.86 | 2.84 | 2.59 | 1.91 | 3.03 |  |  |  |  |  | -0.389 |
| `PUSHPULLLEGS - 3 or 6 DAYS A WK` | 2.82 | 2.59 | 2.21 | 3.41 | 3.41 | 2.43 | 2.71 |  |  |  | -0.198 |
| `ATHLETIC - FULL BODY - 4 DAYS A` | 1 | 1.48 | 1.48 | 1.31 | 2.27 | 2.79 | 2.44 | 1.59 | 3.92 | 3.83 | 0.72 |
| `JUSTICE LEAGUE` | 1 | 1.48 | 1.74 | 1.31 | 2.12 | 2.28 | 2.47 | 1.53 | 3.46 | 3.83 | 0.608 |
| `BOOTCAMP - OPTION 1` | 2.98 | 2.87 | 1.61 | 2.25 | 3.75 | 2.69 | 3.83 |  |  |  | -0.035 |
| `BOOTCAMP - OPTION 2` | 2.94 | 2.22 | 1.83 | 2.34 | 2.12 |  |  |  |  |  | -0.535 |
| `NO ACCESS - AESTHETICS - FB - 4` | 2.77 | 2.79 | 3.94 | 1.59 | 3.92 | 2.64 | 3.83 |  |  |  | 0.009 |
| `NO ACCESS - ATHLETIC - FB - 4 t` | 1 | 1.48 | 1.48 | 1.31 | 2.27 | 2.79 | 3.94 | 1.59 | 3.92 | 3.83 | 0.71 |

*Reading:* athletic templates rise from 1.0 to ~3.9 (unconstrained ballistic work first, machine isolation last). Physique templates are flatter because the unilateral slot (constraint 1.2-1.6) sits in the middle and isolation pools (DB raises/curls, constraint 2.5-2.8) are less constrained than the machine-heavy bilateral compound pools (3.0) at the top; the filled AESTHETICS Day 1 shows the coach actually picks machines at both ends (5,5,...,5).

## 8. NO ACCESS tabs - verification

| Check | `NO ACCESS - AESTHETICS - FB - 4` (07) | `NO ACCESS - ATHLETIC - FB - 4 t` (08) |
|---|---|---|
| Sheet state (raw xlsx) | `hidden` | `hidden` |
| Title cell | none in row 1 | A1 `ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK` (ATHLETIC/JUSTICE LEAGUE say `4 DAYS A WEEK`) |
| Layout copied from | tracking layout of `BOOTCAMP - OPTION 1` (identical merged ranges: WEEK/DAY/PURPOSE/CATEGORY/EXERCISE/SETS/REPS/`WEIGHT USED or SCORE`/EFFORT/`HOW IT FELT?`/`DONE?`) with the slot order of `AESTHETICS - FULL BODY - 4 DAYS` | `JUSTICE LEAGUE` (identical merged ranges; DAY B30 filled `THURSDAY` here, blank in 03/04) |
| Slot-by-slot range diff vs visible twin | 2 diffs vs AESTHETICS: E12, E33 `Unilateral HD` -> `AR7:AR42` instead of `AQ7:AQ42` | 2 diffs vs ATHLETIC and vs JUSTICE LEAGUE: E19, E46 `Unilateral HD` -> `AR7:AR42` instead of `AQ7:AQ42` |
| Any equipment filtering (shorter ranges, BW-only column, separate library) | none - same full-gym ranges; the library copies (`Copy of MASTER EXERCISE LIBRARY`, `Copy of Copy of MASTER EXERCISE`) contain no new exercises except `SPEED ENDURANCE TEST` and `Barbell Incline Bench Press` (tab 11) and no no-equipment list | none |
| Machine share of main-day pools (INFERRED) | 32% (AESTHETICS 31%) | 22% (ATHLETIC 17%) |
| Main slots with >=1 no-equipment option | 10/28 | 24/40 |
| Main slots with only gym-machine options | 6 (`Leg Extensions` x2, `Leg Curls` x2, miswired `Unilateral HD` x2) | 6 (same) |
| Pre-filled values | 178 cells `CHOSE 👇` (invalid placeholder) | 244 cells `CHOSE 👇`; E12 and E39 `Leg extensions` (machine) |
| Tracking columns | WEIGHT USED or SCORE, EFFORT (AX), HOW IT FELT? (AY), DONE? | same |

**Verdict (OBSERVED + INFERRED):** the NO ACCESS tabs are hidden copies of the tracking-format templates, not equipment-restricted versions. If 'NO ACCESS' means 'no gym access', the filtering was never built (and the miswire makes them slightly more machine-dependent than the originals). If it means something else (e.g. a tab clients are not given access to, or a template for clients without coach access), the name is unrelated to equipment. Either way, the generator cannot learn a home/no-equipment substitution rule from these tabs - it must come from the per-option access tiers (section 2) and the coach.

## 9. Load, velocity, ROM and volume variables as BYOP encodes them

| Variable (coach's words) | Where it lives in BYOP (OBSERVED) | Generator rule it supports (INFERRED unless marked) |
|---|---|---|
| Speed / velocity ('lighter = faster, heavier = slower'; med ball 8-10 lb) | Category choice: `THROWING` (20 med-ball options), `PLYOS` (41, 37 unloaded), `CHANGE OF DIRECTION` (9 field drills incl. route names `FADE`, `SLANT`, `POST/CORNER`, `DIG/OUT`, `COMEBACK/CURL`), `TRIPPLE EXTENSION` (33). Names: `Max velocity running (top speed)` G128, `Box. Any Squat Touch and Go fast` AI91, push press/jerk AA11:AA14, thrusters AA54:AA55/AI102:AI104, `KB swing` AN20. No load or speed column. | Speed slots get BW or light implements only (med ball default 8-10 lb, per coach); loaded jumps only after the ADVANCED plyo block; Olympic lifts only after hang pulls. Velocity intent should drive load: MAX = BW/light, POWER = moderate load moved fast (MASTER_MODEL `(NOT DONE) 4 TRACKS PROGRAMMING` N17/N21 `FAST RPE6 or about 60-70%` is the coach's own number for fast work). |
| Load ('how much weight') | Only `WEIGHT USED or SCORE` (H) in 4 tracking tabs - free text, used for notes (`LATERAL` H6, `SINGLE ARM` H9, `OUCH` H12 in JUSTICE LEAGUE). `EFFORT` 1-10 (AX8:AX17, e.g. `8 - That was perfect`) is the only intensity scale. | Load is self-selected and reported; generator should prescribe effort targets per tier (e.g. power work far from failure, isolation/MYO near `8 - That was perfect`). |
| Range of motion (full / mid ROM) | Only inside exercise names: `Elevated Push ups (for full ROM)` AD99, `Standing Calf raises (use deficit)` AU9, `Standing DB calf Raises (Use Deficit)` AU10, foot-elevated lunges AL15:AL18, AL20, `Elevated Feet on Bench Glute Bridges` AN10. MASTER_MODEL RESISTANCE PATTERNS has a `ROM VARIABLE` block (A81: `Elevated`, `Floor`, `Deficit`). | Treat ROM as an exercise-variant axis (elevated/floor/deficit), not a separate field. |
| Volume ('sets x reps over time'; 20 -> 22 sets of chest next week) | `SETS` dropdown 1-8 (AV8:AV15) + `SUPERSET W/ 👇` (AV16); `REPS` `4 to 6 Reps`, `6 to 8 Reps`, `8 to 12 Reps`, `10 to 15 Reps`, `15 Reps`, `20 Reps`, `MYO SET` (AW8:AW14). Every tab with a WEEK column shows only `WEEK 1` (e.g. JUSTICE LEAGUE A3; AESTHETICS and 3 DAY BUILDER have no WEEK column; BOOTCAMP - OPTION 2 has the header but no week value) - no week 2+ exists, so week-to-week set progression is NOT encoded anywhere in BYOP. Filled week-1 sets: JUSTICE LEAGUE 2 per slot; AESTHETICS 3 for compounds and `Machine Calf Raises`, 2 for the closing `Ez Bar Curls` / `Leg Extensions`, 5 for `DB Push press`. | Generator must implement the coach's rule itself: keep exercises and load, add sets week to week per muscle (e.g. +2 sets/week), change small variables only between blocks. |
| Constraint / stability ('machines: push a lot, safer; free weights more skilled') | Implicit in exercise choice; levels FOUNDATIONAL/MODERATE/ADVANCED in the stacked columns. Upper-body FOUNDATIONAL blocks are machine/station-heavy (U8 block 9/12 machine, X8 block 3/5 machine). | For `injury`, `older`, or `high-volume` profiles: bias every resistance slot toward the highest-constraint option the client's equipment allows; for athletes: keep athletic slots unconstrained and use machines for the last (isolation) slots - as JUSTICE LEAGUE does. |
| Variety vs consistency ('don't confuse the muscle') | Each slot is a category, so the same slot can be filled with the same exercise all block; the 4-day templates repeat the same slot list twice a week (Day 1 = Day 3, Day 2 = Day 4; MONDAY = THURSDAY, TUESDAY = FRIDAY) with independent dropdowns. Only AESTHETICS Day 1/2 are filled, Day 3/4 still `CHOOSE 👇` - no evidence whether the coach repeats the same exercise or rotates within the category on the second exposure. | Default: same exercise both exposures within a block; rotate within category only at block change (coach's words). Ask coach (open question). |

Filled prescriptions vs constraint/velocity (21 filled slots with reps; Spearman(constraint, rep midpoint) = 0.715, MYO SET coded 25):

| Tab | Exercise | Constraint | Velocity | Sets | Reps |
|---|---|---|---|---|---|
| `AESTHETICS - FULL BODY - 4 DAYS` | `DB Push press` | 2 | POWER | 5 | `6 to 8 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Bent Over Barbell Rows` | 2 | CONTROLLED | 3 | `8 to 12 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Reverse Lunges` | 1 | CONTROLLED | 3 | `8 to 12 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Machine Calf Raises` | 5 | ISOLATION | 3 | `15 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Leg press` | 5 | CONTROLLED | 3 | `15 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Lat Pulldown Pronated Grip` | 4 | CONTROLLED | 3 | `15 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `DB Deadlifts` | 2 | CONTROLLED | 3 | `15 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Push Ups` | 2 | CONTROLLED | 3 | `15 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Ez Bar Curls` | 2 | ISOLATION | 2 | `20 Reps` |
| `AESTHETICS - FULL BODY - 4 DAYS` | `Leg Extensions` | 5 | ISOLATION | 2 | `20 Reps` |
| `JUSTICE LEAGUE` | `Medium Depth Drop` | 1 | MAX | 2 | `6 to 8 Reps` |
| `JUSTICE LEAGUE` | `Ankle Hops` | 1 | MAX | 2 | `6 to 8 Reps` |
| `JUSTICE LEAGUE` | `DIG/OUT` | 1 | MAX | 2 | `6 to 8 Reps` |
| `JUSTICE LEAGUE` | `Power Clean` | 1 | POWER | 2 | `6 to 8 Reps` |
| `JUSTICE LEAGUE` | `Front Squats` | 2 | STRENGTH | 2 | `6 to 8 Reps` |
| `JUSTICE LEAGUE` | `SL Depth Drops` | 1 | MAX | 2 | `6 to 8 Reps` |
| `JUSTICE LEAGUE` | `Situps to overhead throw` | 3 | MAX | 2 | `8 to 12 Reps` |
| `JUSTICE LEAGUE` | `Cable Machine UL Rows` | 3 | CONTROLLED | 2 | `8 to 12 Reps` |
| `JUSTICE LEAGUE` | `Front Foot Elevated Lunges (FFE)` | 1 | CONTROLLED | 2 | `8 to 12 Reps` |
| `JUSTICE LEAGUE` | `Stricted Pull-ups feet in front` | 1 | CONTROLLED | 2 | `8 to 12 Reps` |
| `JUSTICE LEAGUE` | `Leg Extensions` | 5 | ISOLATION | 2 | `MYO SET` |

## 10. What the generator should do with equipment (INFERRED design rules from the evidence above)

1. **Keep the slot skeleton; filter the option list, never the slot.** The coach's templates are fixed slot sequences (category order is the program). Equipment answers should only shrink each slot's option pool (use `access_tier` per option in `_item_classification`).
2. **Substitution ladder when a pool is empty** (needed for `LEG EXTENSIONS` `AM`, `LEG CURLS` `AR`, and at tier 0 also `VERTICAL PULL`, `HORIZONTAL PULL`, `SIDE RAISES`, `BICEP`, `TRICEP`, `CALVES`, `THROWING`): (a) the library's own BW/prop equivalents of the same joint action (`Supine Glidder hamstring curls` AN18, `swiss ball hamstring curls` AN19, `Harmstring MedBall Curls` AN17, `Nordic Curl` AN91 for leg curls; `Sissy Squats` AI100 for leg extensions) - they are filed under BILATERAL HIP / KNEE DOMINANT, so the `Leg Curls` / `Leg Extensions` dropdowns never offer them; (b) the FULL FOCUS LIST `AZ` group of the same muscle (`HAMSTRINGS 👇`: `DB deadlifts`, `Hip thrusts/ Glute bridges`, `Foot on wall db DL`; `QUADS 👇`: `Walking Lunges`, `Stationary Lunges`, `Bulgarian Split squats`); (c) the coach's official swaps (open question).
3. **Equipment questions to ask the client, in order of impact on slot coverage (from section 2):** dumbbells (opens DB rows/presses/raises/curls/triceps - the single biggest unlock), pull-up bar (vertical pull, hanging core), bench/box (bench pressing, step-ups, plyo boxes, hip thrusts), med ball 8-10 lb (all 20 throws), barbell+rack (squat/deadlift/bench/Olympic lifts - 54% of triple-extension options), cable stack, machines (only route for `AM`/`AR` as wired), erg with calorie display (only reachable in `BOOTCAMP - OPTION 2`).
4. **Constraint as a client-profile dial.** Injured / older / volume-seeking (coach) -> pick the highest-constraint option in each resistance pool (machines and supported variants: constraint 4-5); athletes -> leave tier-1/2 slots unconstrained (constraint 1), use free-weight bilateral compounds (2) for strength, finish with machines (5).
5. **Velocity rules.** Tier-1 slots: BW or light implement, low reps (`6 to 8 Reps` observed), 2 sets in week 1; tier-2: barbell or DB at moderate load moved fast; never put a tier-1/2 slot after a tier-3+ slot. Rep ranges should rise down the session (observed 6-8 -> 8-12 -> 15/20/MYO).
6. **Pairing rules.** Horizontal before vertical, bilateral before unilateral, alternate lower/upper (observed without exception).

## 11. Data-quality notes that affect equipment logic (OBSERVED)

- Single-joint machines are listed inside compound categories: `Leg Extension Machine` in AI20/AI55/AI101 (BILATERAL KNEE DOMINANT), `Leg Curl Machine` AN15, `Machine Leg Curls (Seated and Laying Down)` AN54, `Machine Leg Curls` AN100, `DB Harmstring Curls` AN101 (BILATERAL HIP DOMNANT). A client choosing these in the compound slot doubles isolation and drops the bilateral pattern.
- `KB Face Pulls ` (U20) sits in VERTICAL PULL; implement and plane both unusual.
- `Standing DB Press` appears twice (AA50, AA51) - the second was probably meant to be the barbell version, which leaves VERTICAL PUSH without a standing barbell press.
- `Knees to chest` (O16) does not say hanging or seated (equipment = bar or nothing).
- `200m`...`1000m` (B124:B128) do not state run vs row; `10 cals`...`50 cals` (B133:B141) imply an erg; both are only reachable through `B7:B335` (BOOTCAMP - OPTION 2 rows 7/12/22/27).
- `Alternating DB Deadlifts` (AQ13), `Alternating  Barbell Deadlifts` (AQ15), `Camporini Deadlifts` (AQ16): set-up undefined, so stance/constraint is a guess.
- COD `L92` is stored as a date (2005-05-10) - probably the `5-10-5` drill.

## 12. Open questions for the coach

1. What does 'NO ACCESS' mean in `NO ACCESS - AESTHETICS - FB - 4` / `NO ACCESS - ATHLETIC - FB - 4 t` - no gym access, or a tab clients are not given? If no-gym, which exercises should each slot offer (today they offer the full gym library, incl. machine-only `Leg Extensions`/`Leg Curls`)?
2. For a client with no leg-extension / leg-curl machine, what is your standard swap for the `Leg Extensions` and `Leg Curls` slots (e.g. `Sissy Squats`, `Nordic Curl`, slider/ball curls), or should those slots be dropped and the sets moved to another quad/hamstring slot?
3. Minimum home kit you design for: is 'dumbbells + bench + pull-up bar + bands + 8-10 lb med ball' the right baseline? Should `Throwing` slots be removed or replaced when there is no med ball (and no wall)?
4. Why do `AESTHETICS` Day 1/Day 3 (and `3 DAY BUILDER` DAY 1) start with `Calves` before `Bilateral KD`? Warm-up for the ankle, or should calves follow the isolation rule and go last?
5. On the second exposure of the week (Day 3 = Day 1 slots, THURSDAY = MONDAY), do you repeat the same exercise or pick a different one from the same category? Over a 4-week block, should the exercise stay fixed?
6. For older / injured / high-volume clients, do you want every resistance slot pushed to the machine option, or only the compound slots? `VERTICAL PUSH` has no machine or cable option - what overhead press do you give them?
7. In BILATERAL KNEE DOMINANT, `Hack Squats`, `Leg press`, `Pendulum Squat` are in ADVANCED and `Hack Squat Machine` in MODERATE. Is 'advanced' about training age / loading, so a beginner should NOT be given leg press even though it is safer?
8. Med ball weights: 8-10 lb for upper-body passes and rotations - what for `Overhead throw`, slams and `Situps to overhead throw`? Any ball weight by body weight or age?
9. Plyo progression: are the DB-loaded jumps (`DB Depth drop dbs Jump`, `DB repeat squat jumps` ...) only for advanced athletes, and how light should the DBs be?
10. Bootcamp: is `Cardio` in the middle of 3A/3B (between `Unilateral KD` and `Tricep`) intentional (circuit), and which machines do you mean by the `cals` options (bike, rower, ski)? Should the other templates' cardio (`B7:B122`, running only) also reach the distance/calorie options?
11. Week-to-week volume: BYOP only has `WEEK 1`. Do you add sets per muscle each week (e.g. +2), up to what ceiling, and do sets get added to existing slots or as new exercises (your chest example used 'different exercises')?
12. Is the `WEIGHT USED or SCORE` column meant for load (lb) or for notes (`LATERAL`, `SINGLE ARM`, `OUCH`)? Do you want a velocity/speed target (e.g. 'FAST RPE6 or about 60-70%' as in 4 TRACKS) attached to POWER slots?
13. The single-joint machines inside compound categories (`Leg Extension Machine` in AI, leg-curl machines in AN): should a client be allowed to pick them in the `Bilateral KD` / `Bilateral HD` slot?
14. `KB Face Pulls ` under VERTICAL PULL and the duplicate `Standing DB Press` (AA50/AA51): intended exercise and equipment?
