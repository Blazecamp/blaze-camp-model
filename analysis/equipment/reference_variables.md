# Equipment usage and training variables: the coach's grammar (MASTER MODEL reference tabs)

**Scope.** This file covers the eight MASTER MODEL reference tabs: `ALL ABOUT SQUATS` (SQ), `(NOT DONE) RESISTANCE PATTERNS ` (RP), `(NOT DONE) ALL ABOUT BALLISTICS` (BA), `(NOT DONE) ALL ABOUT OLYMPIC LI` (OL), `(NOT DONE) ALL ABOUT LUNGES` (LU), `CONTROL PATTERNSCORE` (CO), `AEROBIC CAPACITY CHEAT SHEET` (AE) and `Sheet23` (S23). Every cell was read. The tabs hold:

* 701 exercise cells
* 63 variable-value cells
* 258 statement or header cells

All of them are in `reference_variables.json`, next to this file.

**Labels.**

* **OBSERVED** means the text was read from a cell. The tab and cell are always given, and quotes are exact, typos included.
* **INFERRED** means analyst interpretation.
* **SCIENCE** means general exercise science, not the coach's words.
* **CHAT** means the coach's words from the workflow brief. They appear in no sheet.

**Related files** (read them; they are not repeated here):

* `analysis/reference/resistance_patterns_notes.md`: the full RP taxonomy and colour levels.
* `analysis/reference/specialty_notes.md`: squat menus, ballistics, olympic lifts, lunges, core and aerobic.
* `analysis/reference/sheet23_notes.md`

This file looks at the same cells through one lens only: **equipment, and the variables that turn one movement into many exercises.**

---

## 0. TL;DR

1. **The coach thinks in a variable stack, not in exercise names.** RP lists stand-alone variable blocks: `'ROM VARIABLE'` (A81), `'END RANGE BEHAVIOR VARIABLE'` (A86), `'LOADING VARIABLES'` (A90), `'HAND PLACEMENT'` (I16), `'FEET POSITION'` (I22), `'STANCES'` (G82), `'FEET POSITIONING VARIATIONS'` (C9), `'GET INTO/OUT OF THE HIP'` (C19-C26, C71-C74) and `'LOW/MID'` / `'HIGH LOADING VARIATION'` (C27, C31). Three of those values have their own demo videos (B83 `Floor`, B84 `Deficit`, B88 `Touch & go`), so the coach teaches variables as concepts. The grammar in §3 is:

   > EXERCISE = PATTERN × IMPLEMENT × EXTERNAL STABILITY × LOAD POSITION × LOAD LATERALITY × STANCE × GRIP × FEET/BODY POSITION × ROM × END-RANGE BEHAVIOUR × ACCOMMODATING RESISTANCE × PLANE PERTURBATION

   The dose adds LOAD MAGNITUDE, SPEED/INTENT and VOLUME.

2. **There are three ways of putting load on the body, and each has its own ladder.**
   * **Load position.** The squat ladder runs `'EASIEST'` `Hex Bar Squat` → `'EASIER'` `Goblet` → `'EASY'` `High Zercher` → `'MODERATE'` `Zercher` → `'HARD'` `Front Squat/ SSB Bar` → `'HARDER'` `High Bar` → `'HARDEST'` `Low Bar` → `'VERY HARD '` `Overhead` (SQ A10:H11). It goes "from most front loaded to most back loaded" (SQ A3).
   * **Load laterality.** Contralateral is `'GET INTO THE HIP'` and ipsilateral is `'GET OUT OF THE HIP'`. Suitcase height is `'MODERATE'` and front-racked is `'HARDER'` (RP C19-C26).
   * **Accommodating resistance.** Bands sit around 50% and chains around 70% (SQ A35:D41).

   LU A17-A19 adds a 3-axis rule: `'Stance loads the FRONT TO BACK'` / `'Load position loads UP/DOWN & SIDE2SIDE'` / `'Movement orientations/guidance loads AROUND'`.

3. **"Bands are for speed, chains are for magnitude," in the coach's words.**
   * `'Bands are designed for speed/velocity'` (SQ C35), at `'around 50% so you can move fast'` (B36).
   * `'Chains are designed for magnitude influence, loading.'` (C39), at `'moderate around 70%'` (B40), and they `'INTENSIONALLY SLOW YOU DOWN'` (A40).

   Each tool has a "WHO NEEDS THIS?" diagnosis (SQ D36/D38/D40). Weight releasers are `'I HAVE NO IDEA'` in all three columns (SQ B41:D41).

4. **The heavier/slower and lighter/faster rule is written down** at SQ A44:A48: `'HEAVY BARBELL'` / `'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS'` vs `'LIGHT BARBELL '` / `'ECCENTRICFAST LESS MUSCLE RECRUITMENT'`. Ballistics and plyos get two separate purposes:
   * `'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST'` / `'*I USE THESE FOR MUSCULAR FORCE PRODUCTION'` (BA A22:A23)
   * `'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'` / `'*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'` (BA D22:D23)

5. **No implement weight appears anywhere.** I searched both workbooks for "lb", "lbs", "kg" and "pound" and found **0 cells**.
   * Loads are written as % (`50%`, `70%`, `78% of 1RM`; program cross-check: `@ 75%`, `about 60-70%`), as RIR/RPE (`(1 RIR) *RPE8+`), or as words (`HEAVY`, `LIGHT`, `light medball`).
   * The coach's "8-10 lb medball" exists **only in chat**.
   * All 35 medball cheat-sheet exercises are dosed `1` set × `10` reps (`20` for the two sit-up throws) with no load (BA A53:B89).

6. **Implement mix across the 701 exercise cells:**

   | Implement | Cells |
   |---|---|
   | bodyweight | 278 |
   | barbell | 98 |
   | dumbbell | 97 |
   | medball | 79 |
   | cable | 44 |
   | kettlebell | 24 |
   | band | 16 |
   | hex bar | 11 |
   | named machines | 38 |

   * 217 cells (31%) need **no equipment at all**.
   * By equipment class: bodyweight 269, handheld free weight 131, bar free weight 114, medball 79, cable 44, machine-guided 38.

7. **Machine opinions cover only four machines** (SQ G33:I41):
   * `LEG PRESS` and `PENDULUM` are `'LOVE IT'`. Leg press gives `'local fatigue of the quads/legs and not have so much systemic fatigue'`, and pendulum is `'my FAVORITE leg/squat/kne domminant machine'`.
   * `HACK SQUAT` is `"I PERSONALLY DON'T LIKE IT"`.
   * `V-SQUAT` is `"DON'T LIKE IT"`, with `"I don't presercibe the use of these, ever."`

   In Sheet23, upper-body machines appear only in foundational columns (`Assisted Pull-Up Machine` T9:T11) or unlabelled-first columns (`Machine Row` AA2:AA4). The big leg machines appear only in `INTERMIDIATE` / `ADVANCED` columns (`Hack Squat Machine` AD8, `Leg Press` AD9/AE9, `Pendulum Squat` AE10). So machines **scaffold** beginners' pulls, and they **add volume** for advanced legs.

8. **The external-stability ladder is colour-coded in the vertical-push column** (RP E8:E15):
   * green: `Seated DB press`, `Seated Barbell press`
   * yellow: `DB Z press on floor `, `Barbell Z press on floor`, `Kneeling DB press`
   * red: `Kneeling barbell press`, `Standing DB press`, `Standing Barbell press`

   Feet position follows the same logic: green `feet on bench`/`wall` → yellow `raisers or plates`/`floor` → red `feet in air` (RP I23:I28). This is the sheet version of the chat's "machines and reference points = safer, push more".

9. **End range and ROM each come as a 3-step ladder.**
   * `ROM VARIABLE`: green `Elevated` → yellow `Floor` → red `Deficit` / `*RDL` (RP A82:A85).
   * `END RANGE BEHAVIOR VARIABLE`: green `Dead stop` → yellow `Touch & go` → red `*RDL` (A87:A89).
   * Plyo key, the same idea: `'Receive pause/creat'` → `'Receive/create'` → `'Repeat receive create'` (S23 D34:D36).

10. **Equipment availability changes what can be built.** I tested reference-tab exercise coverage for 8 inferred equipment profiles (§6).
    * With bodyweight plus household objects there are **0** options for vertical pull, horizontal pull, shoulders, biceps, triceps, calves and medball throws.
    * Adding a pull-up bar opens 10 vertical pulls.
    * Dumbbells open every pattern.
    * **No band-resisted row, pulldown, press or curl exists in the reference tabs.** Bands appear only as accommodating resistance, assistance, or hip perturbation.
    * Unilateral knee-dominant entries (22 distinct) are written **implement-free**, because the load comes from the separate `LOADING` list: 12 values at LU C22:C33, plus RP C20:C36.

11. **Substitution pairs are written by the coach himself.** The reference tabs contain 16 "X or Y" or "X/Y" equipment pairs, for example `'Double kb or Db'` (RP C30), `'(rings/trx/barbell/smith machine)'` (RP G64) and `'Foam roller or swiss ball wall assisted goblet'` (RP A12). Program tabs add 20 more, with machine↔DB the most frequent: `'machine dips or dips'` ×20, `'machine rows or db rows'` ×12 and `'machine or db flies'` ×12.

    A banner rule says: `'When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'` (UPPERLOWER A7, PUSHPULLLEGS A7, ATHLETIC FULL BODY A6 + `'going unilateral'`).

12. **Library order ≠ session order.** Sheet23's column order runs athletic (triple extension → jumping/plyos → throwing → COD), then core, then resistance (bilateral → unilateral → arms/shoulders/calves). That mirrors the chat's "power first → power-strength → strength → resistance patterns". The French contrast (SQ I18) uses a barbell, then bodyweight, then DB/KB, then a band. However, **"horizontal before vertical" is not encoded in any reference tab.** RP and Sheet23 both list vertical before horizontal, so the session order must come from the program tabs.

---

## 1. Coach chat vs what the sheets say

| Coach (CHAT) | Sheet evidence (OBSERVED) | Status |
|---|---|---|
| "Machines have a lot of reference points / constraints ... you can push a lot, and it's safer." | Support removed = colour gets harder: RP E8:E15 (seated green → kneeling/Z yellow → standing red), RP I23:I28 (feet support). Horizontal-pull list starts at `Machine row` (G61) and `Chest suported row` (G62) and ends with free barbell rows (G68:G69). Vertical pull goes `Lat pull downs` (E61:E67) → `Assisted pull up machine` (E68:E70) → `Strict pull ups` (E71:E74) → `Weighted Pull ups` (E75). | Confirmed as an ordering principle. No cell says "safer". |
| "For volume, injuries, older people, more machines are better." | `LEG PRESS` `'LOVE IT'`: `'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure'` (SQ G35:I35). Program banners: joint pain → split grips / unilateral. | Partly. Volume yes; injury and age are not written for machines. |
| "Free weights are different. Barbells are more skilled." | SQ A4 `'This model is based on free weight squats, leg presses and machines will be covered at the end'`. Barbell versions are always the red/last item: E13, E15, I15, A72:A74, A76. The olympic tab is all barbell, with `'TEACHING/ LEARNING THE SKILL'` (OL A4). | Confirmed. |
| "Power first, then power-strength, then strength, then resistance patterns." | Sheet23 header order B1:AR1. French contrast SQ I18. `'*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)'` (S23 B47). | Confirmed as layout. Sessions are the program team's job. |
| "Med ball passes light, 8-10 lb; heavier = slower." | Medball dose `1` × `10` with no load (BA A53:B89). `'LIGHT BARBELL '` / `'ECCENTRICFAST LESS MUSCLE RECRUITMENT'` (SQ A47:A48). | Weight is chat only. |
| "Speed, ROM, load and volume are variables." | `'ROM VARIABLE'`, `'END RANGE BEHAVIOR VARIABLE'`, `'LOADING VARIABLES'` (RP A81:A94). Bands = `'speed/velocity'` (SQ C35). | Confirmed. |
| "Don't confuse the muscle; same over the block, small variables next block." | SQ A5 `"Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus"`. AE A5 `'Never do the same color workout in the same week'`. | Consistent. The variables in §3 are the "small variables". |
| "Horizontal pull before vertical pull; horizontal push before vertical push." | Not in the reference tabs. RP lists `VERTICAL PUSH` (E) before `HORIZONTAL PUSH` (I), and S23 lists vertical (T-W) before horizontal (X-AB). | **Not observable here.** |

---

## 2. Implements: what the coach uses and for what

### 2.1 Inventory (701 exercise cells; full list with examples in JSON `implements[]`)

| Implement | Cells | Where it lives | What the coach uses it for (OBSERVED → INFERRED) |
|---|---|---|---|
| bodyweight | 278 | all plyos, sprints, COD, core, lunges, push-ups, pull-ups, aerobic | Default athletic implement. Unilateral knee-dominant work is written implement-free. |
| barbell | 98 | squat ladder ranks 3-8, all 22 olympic lifts, deadlift family, bench/press, curls | "Most skilled". Heavy = slow eccentric (SQ A44:A45). The last/red step of most ladders. |
| dumbbell | 97 | presses, rows, all arm/shoulder isolation, `Low DB squats`, `high zercher DB Squat`, DB jumps | Split-grip alternative to the barbell. Light DBs for loaded jumps (`DB Depth drop dbs Jump` S23 I12, `DB repeat squat jumps` I15). |
| medball | 79 | BA warm-up (20), BA cheat sheet (35), S23 `AP - THROWING` (20), core | Ballistic implement: passes, throws, scoops, slams. Also a hold position for warm-ups (`front hold`, `hug`, `Reach forward`, `Reach UP`, `down over front leg`). |
| cable | 44 | pulldowns, cable press, face pulls, triceps, pallof, chops | Semi-guided, constant tension. Used for anti-rotation core. |
| kettlebell | 24 | swings (`SPEED SPECIALS` RP A77:A79), KB deadlifts, front rack, windmills, upright row | Ballistic hinge plus offset/rack loading. Always offered as an alternative to DBs (`db or kb`). |
| band | 16 | `banded`, `reverse banded`, `Hip banded tube bands`, `Assisted Pull-Up w bands`, `banded leg extensions on bench` | Speed tool, assistance tool and frontal perturbation. Never the main resistance for a big pattern. |
| hex bar | 11 | `Hex Bar Squat` 'EASIEST', hex deadlift, `Hex bar squat to calf raise` (S23 B4), `bent over hex bar row` | The most forgiving bar. Also used for triple extension. |
| named machines | 38 | see §2.2 | Volume and local fatigue (legs), scaffolding (pulls). |
| landmine / viking | 6 / 1 | `Landmine Squat` (green), standing/kneeling landmine press, `Landline` rotations (CO B15) | Arc path; mid-range push; rotation. |
| EZ bar / SSB | 6 / 2 | curls, skull crushers / `Front Squat/ SSB Bar`, `SSB bar Squats` (red) | Specialty bars. |
| suspension (TRX/rings) | 5 | `TRX Rows`, `Seated Pull ups with Rings or TRX`, `TRX Bicep Curls`, reverse push-ups | Bodyweight pulling when there is no bar. |
| plate, sandbag | 2, 1 | `Plate reach forward squat` (counterbalance), `Swiss ball plate torso rotations`, `Sandbag Hip Thrusts` | Counterbalance and home loading. |
| apparatus | n/a | box (jumps, box squats, step-ups), bench, wall, plates as hop targets, hurdles, swiss/yoga ball, foam roller, glider, pull-up bar, dip station, rotation strap, mini bands | These set ROM, a target or support. They are not load. JSON `exercise_parses[].parse.apparatus`. |

### 2.2 Machines (OBSERVED opinions, SQ G33:I41)

| Machine | `'PERSONAL OPINION'` | `'DETAIL'` (verbatim) | Generator rule (INFERRED) |
|---|---|---|---|
| `LEG PRESS` (G35) | `'LOVE IT'` (H35) | `'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure'` (I35) | Preferred extra quad volume, MYO sets, fatigue-managed leg work. |
| `HACK SQUAT` (G37) | `"I PERSONALLY DON'T LIKE IT"` (H37) | `"Most hack squat machines don't have the right strength profile for me so getting used to a good upright squat might be difficult, I haven't had much success with these myself or with clients, but I know there are amazing people out there having great results with them. "` (I37) | Fallback only. |
| `V-SQUAT` (G39) | `"DON'T LIKE IT"` (H39) | `"Always tight on lower back & knees, so I don't presercibe the use of these, ever."` (I39) | **Exclude.** |
| `PENDULUM` (G41) | `'LOVE IT'` (H41) | `'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these'` (I41) | First choice when available. |

Machines listed with no opinion:

* RP: `Leg extension machine` A39, `Reverse hyper extensions` A63, `GHD` A67, `45 degree hip ext. ` A68, `Assisted pull up machine` ×3 E68:E70, `Machine row` G61, `Pendulum row` G70, `Machine single arm row` G74, `Machine reverse flies` K18.
* S23: `Machine Row` ×3 AA2:AA4, `Leg Extension Machine` AC11/AD11/AE12, `Leg Curl Machine` AF8, `Hip Thrust Machine` AG7, `Machine Good Mornings` AG8, `Machine Leg Curls (Seated and Laying Down)` AG10, `Machine Calf Raises` AR4, plus the hack, leg press and pendulum entries.

Where machines sit by level (S23 column headers): foundational columns hold 9 machine cells (assisted pull-up ×3, machine row ×3, leg extension, reverse hyper, leg curl). INTERMIDIATE columns hold 7, and ADVANCED columns hold 6. **The coach's machines are not a beginner category.** Lower-body plate machines are advanced volume tools. INFERRED, and consistent with the chat: machines let people "go up in volume".

### 2.3 Medball, the coach's speed implement

* **Warm-up** (BA A4 `'DYNAMIC MEDBALL WARMUP DRILLS'`, A6:C13). The ball is a **load-position** tool there:
  * `Reach forward` (counterbalance, A6:A8)
  * `Reach UP` (overhead, A9:A11)
  * `Toe touch to overhead` / `ground to overhead` (A13:A14)
  * `down & back cross reach` / `cross turn` (transverse, A15:A18)
  * `front hold` / `hug goblet` (B6:B7)
  * `down over front leg` (C6:C10)
  * Rule cells: `'*Same lunge variations but medball hug'` / `'... forward'` / `'... up'` (C11:C13)
* **Cheat sheet** (BA A51 `'MEDBALL CHEAT SHEET'`). 35 throws, each with a mechanical `'DESCRIPTION'`, for example:
  * `'Chest pass'` → `'BILATERAL SYMETRICAL PUSH'`
  * `'Overhead throw'` → `'BILATERAL SYMETRICAL PULL DOWN'`
  * `'Rotational Scoop R'` → `'CORE THORAX '`
  * `'Squat to Chest Pass'` → `'BILATERAL SYMETRICAL KNEE DOMINANT & PUSH'`
  * `'RIGHT LEG step forward Chest Pass'` → `'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH'`
  * `'Half kneeling Right Facing LEFT LEG UP rotational scoop'` → `'INTO THE LEFT LEG/HIP'`
  * `'Bent over medball floor slam'` → `'HIP DOMINANT PUSH'`

  So a medball throw is described with the **same pattern vocabulary as resistance training**: push, pull-down, knee dominant, into/out of the hip. One cell adds a height cue: `'Side to side shuffle floor slam (height matters)'` (C80).
* **Dose:** `1` × `10` for every throw, `1` × `20` for `Situps to chest pass` / `Situps to overhead throw` (A70:B71). No load is given. CHAT: 8-10 lb, light, fast.
* SCIENCE: throws allow acceleration through release with no deceleration phase. Light balls (8-10 lb, about 4-6% of an 80 kg athlete's bodyweight) maximise release velocity and rotational power transfer for hitting and throwing sports. Heavier balls shift the work toward force rather than speed.

---

## 3. The variable grammar

```
EXERCISE  = PATTERN · IMPLEMENT · EXTERNAL_STABILITY · LOAD_POSITION · LOAD_LATERALITY · STANCE/BASE
            · GRIP · FEET/BODY_POSITION · ROM · END_RANGE · ACCOMMODATING · PLANE_PERTURBATION
DOSE      = LOAD_MAGNITUDE · SPEED/INTENT · VOLUME (sets x reps x weeks)
ATHLETIC  = FORCE_PHASE · SPEED/INTENT · IMPLEMENT       (plyo / ballistic / throw)
CONDITION = DURATION · WORK:REST · PACE                   (aerobic)
```

**Coach word order (OBSERVED).** Real cells fill the slots like this:

* `'Box *ANY Squat touch & go reverse banded'` (RP A27): ROM tool, implement wildcard, pattern, end range, accommodating.
* `'Front racked db or kb contralateral loading'` (RP C24): load position, implement alternatives, laterality.
* `'Incline DB bench press feet on wall'` (RP G8): base, implement, pattern, feet.
* `'One up/one down Alternating DB floor press'` (RP I30): laterality, implement, ROM, pattern.
* `'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & HOP'` (BA C38): laterality, end range, load on→off, intent.
* `'POWER CLEAN FROM THE LOW HANG (BELLOW KNEE)'` (OL A9): receive depth, pattern, ROM start.

INFERRED render template:

`[INTENT] [ACCOMMODATING] [STANCE/ROM tool] [LOAD LATERALITY] [IMPLEMENT] [LOAD POSITION] [PATTERN] [GRIP] [FEET/BODY] [END RANGE]`

**How often each slot is written in an exercise name (of 701 cells):**

| Slot | Cells |
|---|---|
| stance/base | 300 |
| intent | 213 |
| ROM | 70 |
| load position | 66 |
| end range | 62 |
| grip | 62 |
| plane/rotation | 50 |
| load laterality | 40 |
| feet/body | 24 |
| accommodating | 17 |

Everything not written takes a default: bilateral, standing, floor ROM, no bands, controlled tempo to 1 RIR.

Each variable below gives the coach's labels and values (verbatim), what the coach says it changes, the mechanics (INFERRED / SCIENCE) and its equipment needs. The JSON `variables[]` holds the same content in machine form.

### V01 PATTERN
This is owned by the taxonomy team. It is relevant here because the pattern decides which implements can carry it. A vertical pull needs a bar, cable, band anchor or TRX. A knee-dominant pattern can take anything.

### V02 IMPLEMENT
See §2. Generator rule (INFERRED from CHAT plus SQ A44:A48 and the banners):

1. Pick the pattern.
2. Filter by what the client owns.
3. Bias by profile:
   * volume / injured / older → machine or supported variant
   * athlete → free weight plus ballistic implements
   * joint pain → DB/KB (split grip) or unilateral

### V03 EXTERNAL STABILITY ("reference points")

| Rank | Value | OBSERVED examples (colour = level) |
|---|---|---|
| 1 | machine path | `LEG PRESS`, `PENDULUM` (SQ), `Machine row` (RP G61), `Assisted pull up machine` (E68:E70) |
| 2 | cable | `Cable standing chest press` (I9, green), `Lat pull downs` (E61:E66) |
| 3 | supported free weight (seat, bench, chest pad, floor, wall, box) | `Seated DB press` (E8, green), `DB floor press` (I8, green), `Chest suported row` (G62), `Foam roller or swiss ball wall assisted goblet` (A12, green), `Air box squats` (A9, green) |
| 4 | reduced base (Z-floor, tall kneeling, half kneeling) | `DB Z press on floor ` (E10, yellow), `Kneeling DB press` (E12, yellow), `Kneeling barbell press` (E13, red) |
| 5 | standing free weight | `Standing DB press` (E14, red), `Standing Barbell press` (E15, red) |
| 6 | no base / overhead / airborne | `feet in air (hollow legs str8)` (I28, red), `Overhead squats` (A36, red) |

* **Coach effect** (CHAT): more reference points mean you can push more and it is safer.
* **SCIENCE:** support takes trunk/hip stabilisation away as the limiting factor, so the prime mover can be loaded closer to its own capacity. That improves the stimulus-to-fatigue ratio (Israetel).
* **Generator** (INFERRED):
  * {older, injured, deconditioned, hypertrophy volume} → ranks 1-3.
  * {athlete, advanced} → ranks 4-6 in the first strength slot, with ranks 1-3 kept for accessory volume.

### V04 LOAD POSITION

* SQ A2: `'*The squat is considered a KNEE DOMINANT movement, therefore how we load the weight of the squat can play a big role in how effective it may be'`
* SQ A3: `'**The easiest way for me to define a loading principle is by going from most front loaded to most back loaded, so just try it and let me know'`
* SQ A9: `'**THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN'`
* LU A18: `'Load position loads UP/DOWN & SIDE2SIDE'`

| Rank | SQ row 10 | SQ row 11 | Where the load sits | Implement needed | If missing, nearest owned (INFERRED) |
|---|---|---|---|---|---|
| 1 | `EASIEST` | `Hex Bar Squat` | sides | hex bar | `Low DB squats` (RP A15) |
| 2 | `EASIER` | `Goblet Squat` | chest, hands | DB or KB | `Medball hug goblet squat` (BA B7), `Plate reach forward squat` (RP A10) |
| 3 | `EASY` | `High Zercher Squat` | elbow crease, high | barbell (DB version RP A19) | `high zercher DB Squat` |
| 4 | `MODERATE` | `Zercher Squat` | elbow crease | barbell | high zercher DB |
| 5 | `HARD` | `Front Squat/ SSB Bar` | front rack / SSB | barbell or SSB | `Double front rack kb squat` (RP A18) |
| 6 | `HARDER` | `High Bar Squat` | back, high | barbell + rack | `SSB bar Squats` (RP A33) or machine |
| 7 | `HARDEST` | `Low Bar Squat` | back, low | barbell + rack | as 6 |
| 8 | `VERY HARD ` (H8 `'SPECIAL LOADING VARIATION'`) | `Overhead Squat` | overhead | barbell | `Medball Reach UP` drills (BA A9:A11) |

The lunge loading list is `LU C21 'LOADING'` (12 values):

* `Contralateral Suitcase`, `Ipsilateral Suitcase`, `Duble suitcase`
* `Contralateral on shoulder`, `Ipsilateral on shoulder`, `Double handed on shoulders`
* `Contralateral High zercher`, `Ipsilateral high zercher`, `Double handed high zercher`
* `Zercher barbell`, `Front racked barbell`, `Back racked barbell`

That is 3 heights × 3 lateralities + 3 barbell positions. RP splits the same idea into:

* `'LOW/MID LOADING VARIATION'` (C27): `Plate reach `, `Goblet loading`, `Double kb or Db`
* `'HIGH LOADING VARIATION'` (C31): `Barbell high zercher racked`, `Barbell zercher racked`, `Barbell Front squat racked`, `Barbell back squat racked`, `Barbell overhead `

The HIGH list follows the squat ladder's front → back → overhead order, so **one load-position ladder serves bilateral and unilateral knee-dominant work.**

SCIENCE: the system centre of mass must stay over mid-foot.

* A front load counterbalances, which allows an upright trunk and more knee flexion, so the knee-extensor moment is larger.
* A back load forces the trunk to incline, which moves the moment to the hips.
* An overhead load adds thoracic, shoulder and ankle mobility demands.
* A higher load lengthens the trunk lever compared with a suitcase hold.

### V05 LOAD LATERALITY: "INTO / OUT OF THE HIP"

| Cell | Header (verbatim) | Value (verbatim) |
|---|---|---|
| RP C19 / C20 | `GET INTO THE HIP VARIATIONS - MODERATE` | `Contralateral loading ` |
| RP C21 / C22 | `GET OUT OF THE HIP - MODERATE` | `Ipsilateral loading ` |
| RP C23 / C24 | `GET INTO THE HIP VARIATIONS - HARDER` | `Front racked db or kb contralateral loading` |
| RP C25 / C26 | `GET OUT OF THE HIP VARIATIONS - HARDER` | `Front racked db or kb Ipsilateral loading` |
| RP C71 / C72, C73 / C74 | `GET INTO THE HIP VARIATIONS` / `GET OUT OF THE HIP` (hip dominant) | `Contralateral loading ` / `Ipsilateral loading ` |
| RP G83 | `STANCES` | `Split stance ALWAYS contralateral` |
| RP C76 / C77 | `UNLATERAL TRANSVERSE` | `Split stance contralateral KB swings` |
| BA D65:D68 | (medball) | `INTO THE LEFT LEG/HIP`, `OUT OF THE RIGHT LEG/HIP`, `OUT OF THE LEFT LEG/HIP`, `INTO THE RIGHT LEG/HIP` |
| BA D74 / D76 | (medball) | `TRANSVERSE INTO THE HIP` / `UNILATERAL OUT OF HIP` |

Other laterality values written in names:

* **double:** `Double kb or Db`, `Duble suitcase`, `Double front rack kb squat`
* **alternating:** `One up/one down Alternating DB floor press` (I30), `One forward/one back Alternating cable press` (I31), `Sesaw Db Press` (S23 AJ2)
* **offset:** `Pushups one hand higher` (I33), `offset planks` (CO E11)
* **single implement:** `Single arm Db Row` (G76), `(uni)` / `(bi)` / `(bi or uni)` (K32, K33, K42)

What changes:

* **Contralateral** (INFERRED): the load is opposite the stance leg. That adds an adduction/internal-rotation moment at the stance hip, which must "accept" the pelvis and push out of it. This is gait-like.
* **Ipsilateral** (INFERRED): the load is on the stance side. The hip is biased "out", and the demand moves to the opposite-side trunk.
* **Difficulty** (OBSERVED): suitcase is `MODERATE` and front-racked is `HARDER`.
* **SCIENCE:** off-centre loads create an external frontal-plane moment of load × lever. Contralateral loading raises gluteus medius activity in split squats and step-ups.
* **Equipment note:** this whole family needs **one** implement (one DB, one KB or one medball). It is the most equipment-efficient progression in the system.

### V06 STANCE / BASE OF SUPPORT

* LU A17 `'Stance loads the FRONT TO BACK'`.
* LU A4 `"**Just because they are knee dominant, it doesn't mean that they don't affect the hips... We can bias different foot placement for hip adaptations as much as foot adaptations"`.

The values:

* **`FEET POSITIONING VARIATIONS`** (RP C10:C18): `front foot elevated lunge (FFE)`, `Stationary lunge`, `reverse lunge`, `rear foot against wall lunge`, `Rear foot elevated lunge (RFE)`, `Front and Rear foot elevated lunge`, `forward lunge`, `forward step up`, `lateral step up`.
* **`PROPULSION`** (LU E22:E24): `FFE`, `FLOOR`, `RFE`.
* **Movement orientation** (LU A22:A23, unlabelled): `Front/back`, `Lateral`.
* **`STANCES`** (RP G83:G85): `Split stance ALWAYS contralateral`, `Half kneeling same side leg up`, `Half kneeling opposite side leg up`.
* **Pressing base ladder** (RP E8:E15): seated → Z/floor → kneeling → standing. `HALF KNEELING VARIATIONS` (E16) is an empty header.
* **Names:**
  * Bases: `Staggered stance` (C62:C64), `Summo` (A76), `Bent over` (G66:G69), `Chest suported` (G62), `Seal` (S23 AB6:AB9).
  * Single leg: `SL`, `Pistol`, `Single leg get ups`.
  * Lateral: `Cosak lateral lunges` (C47).
  * Medball facing cues: `Right Facing LEFT LEG UP` (BA C65:C68).

SCIENCE:

* FFE adds front-hip and knee flexion range.
* RFE moves most of the bodyweight onto the front leg.
* Reverse lunges and step-ups are propulsive; forward lunges add braking.

**Equipment:** only a step, plate, bench or wall. INFERRED progression: bilateral → staggered → split (floor) → FFE/RFE → FFE+RFE → single leg.

### V07 HAND PLACEMENT / GRIP

* `'HAND PLACEMENT'` (RP I16): `supinated`, `neutral`, `pronated`, `wide grip`, `narrow grip` (I17:I21).
* In names:
  * `wide mag grips` (E64), `cable rope` (E65), `close grip` (E66)
  * `Shoulder width grip` / `Wide grip` / `Snatch grip` deadlift (A71:A73). Here grip width works as a ROM lever.
  * `palms forward` / `Palms down` / `spill the can` (K8:K10)
  * `hammer` (K11, K24), `V grip` (K37), `Straight bar pronated/Supinated` (K34:K35)
* Joint-pain rule (program banners, OBSERVED): fixed grips → split grips.
* SCIENCE: a fixed bar locks forearm rotation and the shoulder path, while DBs let the joints self-select. This is the cheapest variety lever inside a block, since it changes the angle and not the implement.

### V08 FEET / BODY POSITION (trunk demand)

* **`FEET POSITION`** (RP I22). The colour grades the value:

  | Level | Values |
  |---|---|
  | green | `feet on bench` (I23), `feet on wall` (I24) |
  | yellow | `feet on raisers or plates` (I25), `feet on floor` (I26) |
  | red | `feet in air (hollow bent legs)` (I27), `feet in air (hollow legs str8)` (I28) |

* **Hanging equivalent:** `Strict pull ups feet behind you` → `feet in front of you` → `knees up` → `L sit` (E71:E74).
* **Body angle:** `Incline` vs `Paralell reverse pushup` (G64:G65); `Incline Push-ups`, `Declined Pushups`, `Push ups (Feet on Wall)` (S23).
* SCIENCE: taking the feet off the ground removes leg drive and the pelvic anchor. The trunk must hold a hollow position, which lowers the load the prime mover can handle and adds core work.
* **Equipment:** a bench, wall or plates.

### V09 RANGE OF MOTION

`'ROM VARIABLE'` (RP A81):

| Value | Cell | Colour | Video | Mechanics (INFERRED) |
|---|---|---|---|---|
| `Elevated` | A82 | green | none | Higher start, shorter ROM. Ambiguous; see open questions. |
| `Floor` | A83 | yellow | B83 `[video link removed]` | Standard ROM |
| `Deficit` | A84 | red | B84 `[video link removed]` | Longer ROM, deeper start |
| `*RDL` | A85 | red | none | Range set by hip/hamstring end range, not by the floor |

ROM tools that appear inside names:

* **Box target:** `Air box squats` (A9), `Box *ANY Squat ...` (A25:A30), `OVERHEAD BOX SQUAT` (OL A25).
* **Pins:** `Pinned Squats ` (A35).
* **Elevation:** FFE / RFE (C10, C14, C15), `Elevated feet on bench glute bridge` (A62), `Elevated Push ups (for full ROM)` (S23 Z11).
* **Olympic start height:** `HIGH HANG` → `MID HANG (KNEE)` → `LOW HANG (BELLOW KNEE)` → `FROM THE FLOOR` (OL A7:A10, A21:A24).
* **Olympic receive depth:** POWER → `HANG SQUAT CLEAN` → `SQUAT CLEAN`, and `OVERHEAD BOX SQUAT` → `OVERHEAD SQUAT` → `SQUAT SNATCH` (OL A11:A13, A25:A30), with `'*SQUAT SNATCH HAS ITS OWN MODEL TO WORK AROUND BECAUSE DEPTH ON THE SQUAT NEEDS TO BE ADDRESSED'` (OL B30).
* **Plyo heights:** `Low Box Jumps (half shin)` (S23 F6), `Mid Box Jump (up to knee)` (F7), `Low/Medium Depth Drop` (F2:F4), `High Depth Drop (above hip)` (I9), `Bigger plates start at lateral bilateral plate hops` (G9).
* **Floor-limited pressing:** `DB floor press` (I8), `DB Z press on floor ` (E10), `Floor DB tricep extensions` (K38).
* **LU A12:** `'Lunges are great for finding/gaining/regaining ROM'`.

SCIENCE: long-muscle-length training (deficits, deep ranges) produces equal or more hypertrophy than short ranges. Partials, elevated starts and floor presses allow heavier loads or protect irritated joints.

**Equipment:** blocks, plates, a box or a step. ROM can always be progressed, even at home.

**Generator** (INFERRED, following the CHAT's "same over the block"): keep ROM fixed inside a block and change it between blocks (Elevated → Floor → Deficit). Regress to elevated or floor-limited for injuries.

### V10 END-RANGE BEHAVIOUR

| Value | Cell | Colour | Mechanics |
|---|---|---|---|
| `Dead stop` | RP A87 | green | Rest at the bottom; concentric starts with no elastic help (INFERRED) |
| `Touch & go` | RP A88 (video B88 `[video link removed]`) | yellow | Brief contact, then rebound; stretch-shortening cycle (INFERRED) |
| `*RDL` | RP A89 | red | Never touches; eccentric first (INFERRED) |
| box `touch & go` vs `Deload` | RP A25:A30, S23 AE2:AE7 | red | Deload = sit and release on the box (INFERRED) |
| `Pinned` | RP A35 | red | Dead stop on pins |
| `STICK THE LANDING` → `DOUBLE BOUNCE` → `DROP & ...` → `REPEAT` | BA A26:D40 | n/a | Landing → amortization → rebound |
| `'Receive pause/creat'` → `'Receive/create'` → `'Repeat receive create'` | S23 D34:D36 (`ZONE 1/2/3`, C34:C36) | n/a | The plyo version of dead stop → touch & go → continuous |

BA C21: `'**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE'`.

SCIENCE: a pause longer than about 1-2 s dissipates stored elastic energy. That makes the concentric harder and "purer", which builds strength off the bottom. Touch & go uses the stretch-shortening cycle.

**Equipment:** a floor, pins or a box. Otherwise this is technique-only.

### V11 LOADING VARIABLES / ACCOMMODATING RESISTANCE

`'LOADING VARIABLES'` (RP A90): `WEIGHT RELEASERS`, `CHAINS`, `BANDS`, `*RDL` (A91:A94). `'BANDED/CHAINED SQUAT VARIATIONS'` (SQ A33):

| TYPE | Purpose | VOLUME (load) | DETAIL | WHO NEEDS THIS? |
|---|---|---|---|---|
| `BOTTOM BANDED` (A35) | `'*PROLONG THE DURATION OF MAX PROPULSION'` (A36) | `'Weight should be lower ranges around 50% so you can move fast'` (B36) | `'Yields at bottcom of squat in order to create a faster impulse UPWARDS, tissues are stiffer at top of squat, tissues decrease stiffness on way down to yield. Bands are designed for speed/velocity'` (C35) | `'SOMEBODY THAT CAN\'T YIELD DOWN INTO A SQUAT CORRECTLY OR AT A "GOOD" SPEED'` (D36) |
| `REVERSE BANDED` (A37) | `'*ACCELERATES MAX PROPULSION'` (A38) | `'Weight should be lower ranges and fast speed'` (B38) | `'Helps you have a faster concentric reaction & increase velocity of your against gravity forces'` (C37) | `'SOMEBODY THAT IS SLOW ON THE WAY UP'` (D38) |
| `BOTTOM CHAINS` (A39) | `'*INTENSIONALLY SLOW YOU DOWN'` (A40) | `'Weght can be moderate around 70%'` (B40) | `'Teaching concentric and increase stiffness, less degree of yielding. Chains are designed for magnitude influence, loading.'` (C39) | `'SOMEBODY NEEDING TO STAY STIFF DURING THE WHOLE MOVEMENT ECCENTRIC, AMORTIZATION, AND CONCENTRIC'` (D40) |
| `WEIGHT RELEASERS` (A41) | none | `'I HAVE NO IDEA'` (B41) | `'I HAVE NO IDEA'` (C41) | `'I HAVE NO IDEA'` (D41) |

**Where these appear on exercises:**

* RP: `'Box *ANY Squat touch & go banded'` (A26), `'... reverse banded'` (A27), `'Box *ANY Squat Deload banded'` (A29), `'... reverse banded'` (A30). All four are red.
* S23: AE3:AE7.
* BA: `'BILATERAL/UNILATERAL REVERSE BANDED HOPS/JUMPS'` (D34:D40).
* SQ I18: `'reverse banded squat jumps'`.
* Program cross-check: `'FAST BANDED DL '`, `'FAST BANDED BENCH PRESS'`, `'HEAVY CHAINED DEADLIFT'`, `'FAST CHAINED DL'` (4 TRACKS / CONJUGATE).

**Closest observed relative of weight releasers:** `'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & HOP'` and its variants (BA C38:C44). The athlete drops with load, releases it, then jumps. That is accentuated eccentric loading with dumbbells.

SCIENCE: accommodating resistance matches the ascending strength curve.

* Bands add an overspeed eccentric and reduce lockout deceleration.
* Chains add load progressively.
* Benefits for strength and power are small but positive at moderate loads with fast intent.
* Weight releasers give a supramaximal eccentric followed by a potentiated concentric.

**Equipment:** bands are the only accommodating tool usable at home, for example reverse-banded hops from a pull-up bar. Chains and releasers are gym-only.

**Generator** (INFERRED from D36/D38/D40): diagnosis → tool.

* Can't descend well → bottom bands.
* Slow out of the hole → reverse bands.
* Soft or collapsing → chains.

These are only for intermediate+ athletic or strength goals; every banded RP entry is red.

### V12 LOAD MAGNITUDE / INTENSITY

| Form | Value | Cell |
|---|---|---|
| % | `around 50%` (bands) | SQ B36 |
| % | `around 70%` (chains) | SQ B40 |
| % | `78% of 1RM whatever squat ...` (French contrast) | SQ I18 |
| % (programs) | `Hang cleans @ 75%` | BASEBALL CM33 |
| % (programs) | `FAST RPE6 or about 60-70%` | 4 TRACKS N17 |
| RIR/RPE | `HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+` | SQ A13 |
| RIR/RPE | `STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+` | SQ D13 |
| reps/rest | hypertrophy 3-5 × 8-15, `*REST 1-2 MIN BETWEEN SETS` | SQ A15:B26, B28 |
| reps/rest | strength 4-8 × 2-5, `*REST 3-6 MIN BETWEEN SETS` | SQ D15:E26, E28 |
| technique | `**MYO SET - ADVANCED` 15/5/5/5/5/5 | SQ B27:C27, A30 |
| word | `HEAVY BARBELL` / `LIGHT BARBELL ` | SQ A44 / A47 |
| word (programs) | `light medball`; `Front squats - light weights - same speed for all reps` | ATHLETIC FULL BODY K13; BASEBALL BU33 |
| weight | **none.** 0 cells contain lb, lbs, kg or pound. Medball 8-10 lb is **CHAT only**. | n/a |

SCIENCE:

* Force-velocity: velocity falls as load rises.
* Peak power sits at about 0-30% 1RM for ballistic exercises and about 70-80% for olympic lifts.
* Henneman: heavy loads recruit high-threshold units from rep 1, while light loads reach them only near failure. This matches SQ A44:A48.

### V13 SPEED / INTENT

| Value (verbatim) | Cell | Implements |
|---|---|---|
| `BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST` / `*I USE THESE FOR MUSCULAR FORCE PRODUCTION` | BA A22:A23 | medball, swings, loaded jumps, olympic barbell |
| `PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY` / `*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS` | BA D22:D23 | bodyweight; plates, hurdles and boxes as targets; reverse bands |
| `SPEED SPECIALS` (`Russian kb swing`, `American kb swing`) | RP A77:A79 | kettlebell |
| `*FASTEST SSC*` → `*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)` → `*SPRINT*` | S23 B43:B52 | bodyweight |
| `EASY` / `MODERATE` / `FAST` / `FASTEST` / `SPRINT` | AE C10:I21, I26:I41 | running |
| (programs) `FAST BANDED ...`, `Banded fast LAT PULL DOWNS`, `Max speed banded lat pull downs half kneeling ipsilateral`, `Box. Any Squat Touch and Go fast` | 4 TRACKS F18; ATHLETIC C27, F47; BYOP AK9 | bands, cable |

CHAT: "Go heavier and you go slower ... Quality of movement matters as much as quantity."

SCIENCE: velocity specificity, with intent mattering even under heavy loads. Ballistic means acceleration through release; plyometric means a short-contact stretch-shortening cycle.

**Generator** (INFERRED): a speed goal → light implement + maximal intent. A strength goal → heavy + controlled. A speed cue is combined with heavy load only inside contrast pairs (SQ I18).

### V14 FORCE PHASE (plyo and ballistic; BA row 24)

| Order | Header | Items (verbatim) | Equipment |
|---|---|---|---|
| 1 | `TAKING IN FORCES` | `STICK THE LANDING BILATERAL `, `... UNILATERAL`, `WEIGHTED STICK THE LANDING BILATERAL`, `... UNILATERAL` | none → handheld load |
| 2 | `DELIVER FORCES FAST` | `BILATERAL HOP ON TO`, `BILATERAL JUMP ON TO`, `UNILATERAL HOP ON TO`, `BILATERAL HOP ON TO` | box or plate target |
| 3 | `AMORTIZATION OF FORCES` | `DOUBLE BOUNCE ...` (2), `DROP & DOUBLE BOUNCE ...` (2), `DROP BILATERAL & HOP`, `DROP BILATERAL AND JUMP`, `... DROP WEIGHTED, DELOAD WEIGHT & HOP/JUMP` (4), `FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE` | drop box, releasable DBs, medball |
| 4 | `REBOUNDING ` | `... REPEAT HOPS/JUMPS` (4), `... REVERSE BANDED HOPS/JUMPS` (4) | none → band + overhead anchor |

The equipment rule inside every column (OBSERVED order) is: bodyweight first, then **add** load (`WEIGHTED`) or **remove** load (`REVERSE BANDED`, `DELOAD WEIGHT`) as the last step. **Equipment is a progression lever, not the starting point.**

### V15 PLANE / FORCE DIRECTION and PERTURBATION EQUIPMENT

LU A16:A19: `'THIS IS NOT PERFECT, BUT IT HELPS UNDERSTAND'`, `'Stance loads the FRONT TO BACK'`, `'Load position loads UP/DOWN & SIDE2SIDE'`, `'Movement orientations/guidance loads AROUND'`.

* **Frontal**, made with equipment:
  * `'Hip banded tube bands'` (RP A47) and `'Left or Right hip banded out '` (A48): a mini band.
  * `'Hold between knees Squats'` (A49): an object between the knees.
* **Transverse**, made with equipment:
  * `'Whats that strap rotating in'` / `'... rotating out'` (A54:A55). The coach does not name the product.
  * `'Split stance contralateral KB swings'` (C77): a single KB.
  * Rotational medball throws, `Cable chops` (CO B13), `Landline standing/kneeling rotations` (CO B15), `Swiss ball plate torso rotations` (CO B14).
* **Core grid** (CO A4/H4/O4 × B5/E5): `TRANSVERSE` / `SAGITAL` / `FRONTAL` × `DYNAMIC` / `STATIC` × `CORE THORAX` / `CORE PELVIS` / `BOTH`. Of 52 core cells, 37 need no equipment. Equipment shows up only as cable (pallof, chops, oblique turns), medball (`Med ball from hands` B8, `med ball from feet` B19), landmine, KB (rotation swings, windmills, `turkish gettups`) and a swiss ball with a plate.

SCIENCE: lateral band pull at the hips creates an adduction moment the abductors must resist. Off-axis loads and cable lines create rotational demand.

### V16 VOLUME AND PROGRESSION (pointer; owned by the volume team)

Equipment link (INFERRED):

* The CHAT example "20 → 22 sets of chest with different exercises" means added sets can come from a different implement of the same pattern.
* Machines are the CHAT's tool for "people who want to go up in volume".
* `LEG PRESS` is loved for local, not systemic, fatigue (SQ I35).
* Program cross-check: `'leg press or just add 2 more rounds to front squats'` (4 TRACKS W42). A missing machine can be replaced by **extra sets** of the free-weight lift.

The "small variables" to change between blocks are V02-V11.

### V17 COMPLEX AND SEQUENCE (equipment order in a session)

* **French contrast** (SQ G16 `'FRENCH CONTRAST'`, G15 `'OFF SEASON'`, I18): barbell 78%, then `tuck jumps` (bodyweight), then `Goblet squats` (DB/KB), then `reverse banded squat jumps` (band).
* **Sheet23 header order:**
  1. `AP - TRIPPLE EXT`. Its equipment ladder: `BodyWeight Squat to calf raise` → `Weighted squat to calf raise` → `Hex bar squat to calf raise` → `High/Mid/Low hang clean/snatch pull` → `Power Snatch` / `Power Clean` / `Clean & Jerk`.
  2. `AP - JUMPING` / `PLYOS`
  3. `AP - THROWING`
  4. `AP - COD`
  5. `CT` / `CP`
  6. `RP - BS`
  7. `RP - UL`
  8. `RP - BICEP/TRICEP/SHOULDERS/CALVES`
* **Speed footer** (S23 B43:B52): `*FASTEST SSC*` → `*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)` → `*SPRINT*`.
* **Warm-ups:** `'DYNAMIC MEDBALL WARMUP DRILLS'` (BA A4); `'**Follow Running Warmups'` (AE A4).
* **LU A13:** `'Lunges are great potentiators of the squat patterns'` (INFERRED: a lunge can come before a squat).
* **Program cross-check** (EXAMPLE ATHLETIC FULL BODY C12:C21): `Depth Jump with weight` → `... into high box jump` → `Really high jump squats LOAD & jump hard` → `High Knee Runs FAST` → `HEAVY Single arm rotational half kneeling cable row ...` → `SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs` → ... → `Side Plank presses`.
* **Not found:** horizontal before vertical. The library lists vertical first.

**Generator template** (INFERRED):

1. Warm-up drills (medball, running).
2. Fastest and lightest: plyo, sprint, medball.
3. Power-strength: olympic lifts, banded work, contrast.
4. Heaviest: barbell or hex.
5. Resistance patterns (DB, cable, machine), horizontal before vertical (CHAT).
6. Small muscles and core.

The rule of thumb: the implement gets heavier and the movement slower as the session goes on.

### V18 DURATION / WORK:REST (conditioning; no equipment)

| Colour | Type | Work | Rest |
|---|---|---|---|
| A (blue `A4C2F4`) | `Short Duration ` / `High Intensity` | `Seconds `, `15/45` … `45/15 Work:Rest` | `3 Minutes` … `8 Minutes` |
| B (green `B6D7A8`) | `Moderate Duration` / `Moderate Intensity` | `1 Minute` … `3 Minutes` | `1:1` / `1:2` / `1:3 Work:Rest` |
| C (orange `F9CB9C`) | `Long Duration` / `Low intensity` | `4+ Minutes` | `Active`, `:30 sec` … `3 Minutes` |

* All 59 aerobic cells are running or walking.
* AE A5: `'***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week'`.
* Program cross-check: `'3x 10 cal row sprint or ski'` (BASEBALL AA39). Ergs can stand in for running (INFERRED: useful for clients who cannot run).

---

## 4. Load-velocity continuum (lightest/fastest → heaviest/slowest)

| # | Zone | OBSERVED examples | Load as written |
|---|---|---|---|
| 1 | Max velocity, no external load | `Max velocity running (top speed)` (S23 I4, B52); `Squirrel jumps` `*FASTEST SSC*` (B44); `REVERSE BANDED HOPS/JUMPS` (BA D34:D40) | bodyweight or less (band-assisted) |
| 2 | Light ballistic implement | `Chest pass`, `Overhead throw`, `Rotational Scoop` (BA C53:C69); `Squat Jumps w/ Medicine Ball` (S23 G35) | CHAT 8-10 lb; "light medball" |
| 3 | Loaded jumps and landings | `WEIGHTED STICK THE LANDING` (BA A30/A32); `DB Depth drop dbs Jump` (S23 I12); `DB repeat squat jumps` (I15) | unspecified DBs |
| 4 | KB ballistics | `SPEED SPECIALS` `Russian kb swing`, `American kb swing` (RP A77:A79); `Split stance contralateral KB swings` (C77) | unspecified |
| 5 | Banded speed-strength | `BOTTOM BANDED`, `REVERSE BANDED` (SQ A35/A37); box squats banded (RP A26:A30) | ~50% |
| 6 | Olympic lifts | OL A7:A30; S23 D2:D7 | (programs) 75% |
| 7 | Chains / stiffness | `BOTTOM CHAINS` (SQ A39) | ~70% |
| 8 | Contrast heavy lift | SQ I18 | 78% 1RM |
| 9 | Strength | SQ D15:E26 (5×3 … 8×2) | 1 RIR at 2-5 reps (SCIENCE ≈ 85-93%) |
| 10 | Hypertrophy | SQ A15:B26 (3×15 … 5×8 + `Max air squats`) | 1 RIR at 8-15 reps (SCIENCE ≈ 65-80%) |
| 11 | Local-fatigue machine work | `LEG PRESS` `'LOVE IT'`; `**MYO SET - ADVANCED` | to near failure; low systemic cost |

---

## 5. Equipment as a progression lever (patterns seen across the tabs)

1. **Adding load is the last step, not the first.** Examples: BA phases (bodyweight → `WEIGHTED`); S23 triple extension (`BodyWeight` → `Weighted` → `Hex bar` → barbell pulls → full lifts); vertical pull (cable → assisted machine → bodyweight → `Weighted Pull ups`).
2. **Removing support makes it harder.** Seated → Z → kneeling → standing (RP E8:E15); feet on bench → floor → air (I23:I28); machine row → chest-supported → seal → bent-over (G61:G69).
3. **Bar beats handheld for difficulty.** In every RP colour block with DB and barbell twins, the barbell sits at the same or a higher colour: E8/E9 both green, E12 yellow vs E13 red, E14/E15 both red, I14/I15 both red.
4. **Accommodating resistance is always red/advanced** (RP A26:A30) and always sits on top of a box squat.
5. **Machines appear in all three levels** (S23). Upper machines are foundational; leg machines are intermediate and advanced.

---

## 6. Equipment availability: what a generator can build from the reference tabs

The profiles are INFERRED.

* **Household** means no equipment, a wall, a bench/chair, a box/step, a plate or low object, a slider, and an object to hold between the knees.
* **Coverage** is the number of distinct exercise names in the reference tabs whose required equipment is a subset of the profile. Alternatives written with "or" or "/" count if any one option is owned.
* The full lists are in JSON `equipment_coverage_by_profile`.

| Pattern family | P0 bodyweight + household | P1 + pull-up bar | P2 + bands (home) | P3 + dumbbells | P4 + kettlebells | P5 DB+KB+medball+bands+TRX | P6 garage barbell gym | P7 full gym |
|---|---|---|---|---|---|---|---|---|
| knee dominant bilateral | 7 | 7 | 10 | 17 | 13 | 25 | 62 | 74 |
| knee dominant unilateral | 22 | 22 | 22 | 22 | 22 | 22 | 22 | 22 |
| hip dominant bilateral | 6 | 6 | 6 | 10 | 12 | 17 | 33 | 46 |
| hip dominant unilateral | 3 | 3 | 3 | 6 | 4 | 7 | 12 | 12 |
| vertical push | 2 | 2 | 2 | 10 | 2 | 10 | 17 | 17 |
| mid range push | 0 | 0 | 0 | 2 | 0 | 2 | 5 | 7 |
| horizontal push | 12 | 13 | 12 | 18 | 12 | 19 | 22 | 24 |
| vertical pull | **0** | 10 | 11 | 10 | 11 | 13 | 14 | 33 |
| horizontal pull (bi) | **0** | **0** | **0** | 5 | 1 | 8 | 17 | 24 |
| horizontal pull (uni) | 0 | 0 | 0 | 3 | 2 | 3 | 3 | 8 |
| shoulders | **0** | 0 | 0 | 18 | 1 | 19 | 21 | 25 |
| biceps | **0** | 0 | 0 | 12 | 0 | 13 | 20 | 21 |
| triceps | **0** | 0 | 0 | 11 | 0 | 11 | 13 | 20 |
| calves | **0** | 0 | 0 | 1 | 0 | 1 | 2 | 3 |
| core | 42 | 45 | 45 | 46 | 49 | 58 | 60 | 67 |
| plyo/ballistic jumps | 58 | 58 | 62 | 62 | 58 | 74 | 80 | 80 |
| medball throws | **0** | 0 | 0 | 0 | 0 | 29 | 29 | 29 |
| olympic / triple extension | 2 | 2 | 2 | 2 | 2 | 2 | 38 | 38 |
| sprint / COD / SSC | 14 | 14 | 14 | 14 | 14 | 14 | 14 | 14 |

Reading the table (INFERRED):

* **Bodyweight-only clients** get no pulls, no isolation and no medball work from the reference tabs. The generator needs regressions the coach has not written yet: towel/door rows, band rows, bodyweight curls, calf raises. These are open questions.
* **The lunge family (22) works at every profile.** The coach writes lunges without an implement and loads them through the `LOADING` list (LU C22:C33), so load can be added from whatever the client owns. That also includes a single DB for contralateral/ipsilateral loading.
* **Dumbbells are the minimum kit for full-pattern coverage.** A pull-up bar plus dumbbells covers every pattern family except medball throws, olympic lifts and unilateral vertical pull (cable only).
* **Kettlebell-only** covers hinges and swings well (12) but leaves arms and vertical push almost empty.
* **Bands-only** adds almost nothing as main resistance, because the coach uses bands for speed, assistance and perturbation.
* **Olympic and triple-extension work needs a barbell.** Only `BodyWeight Squat to calf raise` and `Lunge to high knee reach` (S23 B2:B3) are equipment-free.

### Substitution evidence

* **Reference tabs** (16 pairs, coach-written):
  * `'Foam roller or swiss ball wall assisted goblet'` (RP A12)
  * `'Front racked db or kb contralateral loading'` (C24)
  * `'Double kb or Db'` (C30)
  * `'Incline reverse pushup (rings/trx/barbell/smith machine)'` (G64)
  * `'Bent over db or kb row'` (G66)
  * `'feet on raisers or plates'` (I25)
  * `'Db overhead tricep ext (bi or uni)'` (K42)
  * `'Kb windmills - kneeling or standing'` (CO B36)
  * `'Goblet KB/DB Squats'` (S23 AC2)
  * `'DB/ Kb Rows'` (AL2)
  * `'Sumo Squats w/ DB or KB '` (AC10)
  * `'Squats with Foam Roller or Yoga Ball on the wall'` (AC5)
  * `'Seated Pull ups with Rings or TRX'` (T12)
  * `'Medicine or Stability Ball Harmstring Curls'` (AG6)
  * `'Assisted  Pull-Up w bands'` (T8), and others
* **Program tabs** (cross-check):

  | Pair | Count |
  |---|---|
  | `machine dips or dips` | ×20 |
  | `machine or db flies` | ×12 |
  | `machine rows or db rows` | ×12 |
  | `machine or db reverse flies` | ×8 |
  | `ez bar curls or barbell` | ×8 |
  | `Sqats or Leg Press` | ×6 |
  | `Deadlifts (DB or Barbell)` | ×6 |
  | `Reverse lunges (bodyweight or DBs)` | ×6 |
  | `cable or db side raises` | ×4 |
  | `leg press or just add 2 more rounds to front squats` | ×4 |
  | `Bench press (DB or barbell)` | ×3 |
  | `Overhead press (DB or barbell)` | ×3 |
  | `Pull ups or lat pull down` | ×3 |
  | `hex bar or db dl` | ×3 |
  | `DB Rows or Row machine` | ×3 |
  | `DB Reverse Flies or Machine` | ×3 |
  | `3x 10 cal row sprint or ski` | ×3 |
  | `Pull ups or banded assisted pull ups` | ×2 |
  | `def. dl or snatch grip` | ×2 |
  | `... cable row or band row or Bird Dog Row` | ×1 |
* **Rules this implies** (INFERRED):
  * machine ↔ DB is the default swap
  * barbell ↔ DB for every main lift
  * a missing machine → extra sets of the free-weight lift
  * pull-ups ↔ pulldown ↔ band-assisted
  * band ↔ cable for rows and rotations
  * TRX ↔ rings ↔ barbell ↔ smith for inverted rows
  * erg ↔ erg for conditioning

---

## 7. Contradictions, gaps and data notes

* **`Elevated` is ambiguous.** In `ROM VARIABLE` it is green (easier), which suggests a raised start and a shorter ROM. But `'Elevated feet on bench glute bridge'` (A62) and `'Elevated Push ups (for full ROM)'` (S23 Z11) use "elevated" to mean a **longer** ROM.
* **`*RDL` closes all three variable lists** (A85, A89, A94) as the red end, and is never explained.
* **`Low Bar Squat` is ranked differently in two tabs.** It is `'HARDEST'` in the SQ ladder (G10:G11) but yellow in RP (A24). The ladder ranks posture difficulty, not client level.
* **`Weight releasers` are unknown to the coach** (`'I HAVE NO IDEA'` ×3).
* **Mislabelled equipment names:**
  * `'Whats that strap rotating in/out'` (A54:A55): the product is unnamed.
  * `'Kong Rows'` (G77): the implement is unknown and is the only unresolved implement in 701 cells.
  * `'Landline'` (CO B15) is probably "landmine".
* **Lines treated as notes, not exercises:** `'*Same lunge variations but medball hug/forward/up'` (BA C11:C13) are variable rules, not exercises.
* **Auto-converted dates:** `M3` in S23 (2005-05-10) is INFERRED to be the `5-10-5` pro-agility drill. SQ G18 is `3-4` sets (per specialty_notes, live-confirmed).
* **Tabs that are hidden or unfinished:** SQ, BA, OL and CO are hidden. RP, BA, OL and LU say `UNDER CONSTRUCTION`. HALF KNEELING VARIATIONS (RP E16) and every upper-body frontal/transverse block are empty, so the frontal/transverse equipment options exist only for lower body and core.
* **Parser caveat:** 428 of 701 cells have an implement filled by default (INFERRED). Examples: `Lat pull downs` → cable, `Pushups` → bodyweight, `Chest pass` → medball, `Side raises` → dumbbell. The JSON flags each one with `implement_source`.

---

## 8. Open questions for the coach

1. Weight releasers: leave them out, or use them as an advanced eccentric tool (the same physics as BA C38:C44)?
2. Medball weights: is 8-10 lb the default for all throws? What weight for slams and `CORE EXTRAS`, and for youth, women or older clients?
3. What does `*RDL` mean in `ROM VARIABLE`, `END RANGE BEHAVIOR VARIABLE` and `LOADING VARIABLES`?
4. Does `Elevated` (ROM VARIABLE) mean a raised start (shorter ROM), or elevated feet (longer ROM)?
5. Is the squat ladder (Low bar `HARDEST`) a posture-difficulty rank only, separate from client level?
6. What are your opinions on other machines: Smith squats (used in EXAMPLE FAT BURN), hip thrust machine, leg curl, GHD, reverse hyper, belt squat?
7. For older, injured or volume clients, is there a minimum share of machine work, or free-weight lifts they never get (overhead squat, snatch, low bar)?
8. Which home set-ups do clients report? For bodyweight-only clients, what are your pulls, arms and calves (towel rows, band rows, door-frame rows, single-leg calf raises)?
9. Does the joint-pain swap (fixed → split grip) also cover neutral-grip machines and cable handles?
10. Is horizontal-before-vertical an every-session rule? Does it also apply to unilateral work and athletes?
11. What is "that strap rotating in/out" (RP A54:A55)? What is a "Kong Row" (RP G77)?
12. Bands ~50% and chains ~70%: % of what (1RM without bands, or bar weight)? Which band and chain sizes?
13. Can `Box *ANY Squat` take any of the 8 ladder loadings, overhead included (OL A25 `OVERHEAD BOX SQUAT`)?
14. French contrast: there are 4 exercises but 5 rep slots (`3/3/3/3/3`). Should `Goblet squats` be goblet squat **jumps**?
15. Is HOP = small-amplitude ankle contact and JUMP = full triple extension?
16. Is the plyo zone key (`Receive pause/creat` → `Receive/create` → `Repeat receive create`) the same ladder as Dead stop → Touch & go → rebound?
17. Can the A/B/C aerobic colours run on a bike, rower or ski erg for clients who cannot run? Which erg do you prefer?

---

## 9. JSON field guide (`reference_variables.json`)

| Key | Content |
|---|---|
| `_meta` | sources, conventions, tab status, counts, parser note |
| `grammar` | formula, coach word-order examples, render template, defaults, slot fill rates, slot value counts |
| `variables[]` | V01-V18: coach labels (tab, cell, verbatim), values, what each value changes per the coach, mechanical effect (INFERRED), science note, equipment relevance, generator rule |
| `implements[]` | per implement: cell count, family, stability rank and skill rank (INFERRED), velocity profile, coach statements, examples |
| `equipment_class_by_tab`, `equipment_class_by_pattern_family` | counts |
| `machines_coach_opinion[]` | the 4 rated machines plus the unrated list |
| `load_velocity_continuum[]` | 11 zones |
| `equipment_profiles_INFERRED`, `equipment_coverage_by_profile` | profiles P0-P7 and per-pattern coverage with examples |
| `substitution_evidence` | reference-tab pairs, program cross-check pairs, rules |
| `variable_value_cells[]` | all 63 variable-value cells, verbatim, with colour level |
| `statements[]` | all 258 statement/header cells, verbatim, with an interpretation on the key ones |
| `exercise_parses[]` | all 701 exercise cells: tab, cell, verbatim, context (pattern, block, column header, colour level, video, sets/reps) and `parse` with implements, machines, apparatus, implement_source, load_position, load_laterality, stance_base, grip, feet_body_position, rom, end_range, accommodating, intent, plane_perturbation, equipment_class, external_support, equipment_required; plus `pattern_family` |
| `open_questions[]` | the same list as §8 |

---

## Appendix A: verbatim statement inventory for equipment and variables (by tab)

These are the non-header statements that bear on equipment, load, ROM, speed or variables. Pure layout headers (`Sets`, `Reps`, `VIDEO` and similar) are left out here but are kept in JSON `statements[]`.

### ALL ABOUT SQUATS

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A1 | `SQUATS & KNEE DOMINANT MOVEMENTS` | statement |  |
| A2 | `*The squat is considered a KNEE DOMINANT movement, therefore how we load the weight of the squat can play a big role in how effective it may be` | statement |  |
| A3 | `**The easiest way for me to define a loading principle is by going from most front loaded to most back loaded, so just try it and let me know` | statement |  |
| A4 | `***This model is based on free weight squats, leg presses and machines will be covered at the end... Scroll bellow the squats` | statement | Free weights are the base model; machines are an appendix, i.e. the coach thinks in free weights first and adds machines as a separate category. |
| A5 | `****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus` | statement |  |
| A6 | `*****Follow the RIR prescription - REPS IN RESERVE - You will also see RPE` | statement |  |
| A9 | `**THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN` | statement |  |
| A13 | `HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+` | statement |  |
| D13 | `STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+` | statement |  |
| G13 | `ATHLETIC FOCUSED WORKOUTS` | statement |  |
| B28 | `*REST 1-2 MIN BETWEEN SETS` | statement |  |
| E28 | `*REST 3-6 MIN BETWEEN SETS` | statement |  |
| H28 | `*REST AS PRESCRIBED` | statement |  |
| A30 | `**MYO SET is where you do 15 reps, without stopping you just dont move for 3 seconds (resting) then do another 5 reps, breathe/rest 3 seconds, and repeat for 5 sets of those 5 reps... Totalis 40 reps without a stop. You can youtube myoreps and see more info about them.` | statement | Myo set; 3-second rests; local fatigue -> machine/isolation-friendly. |
| A44 | `HEAVY BARBELL` | statement | Heavy barbell is paired with slow eccentric and MORE recruitment. |
| A45 | `ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS` | statement |  |
| A47 | `LIGHT BARBELL ` | statement | Light barbell is paired with fast eccentric and LESS recruitment; this is the sheet version of the chat's 'heavier = slower, lighter = faster'. |
| A48 | `ECCENTRICFAST LESS MUSCLE RECRUITMENT` | statement |  |
| I18 | `78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps` | statement | Equipment order inside one contrast set: barbell -> bodyweight -> DB/KB -> band. |
| C27 | `**MYO SET - ADVANCED` | statement |  |
| G15 | `OFF SEASON` | statement |  |
| G16 | `FRENCH CONTRAST` | statement |  |

### (NOT DONE) RESISTANCE PATTERNS

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A5 | `LOWER BODY MECHANICS` | header |  |
| A6 | `KNEE DOMINANT` | header |  |
| A7 | `BILATERAL SAGITAL -SEE CHEAT SHEET  *ALL ABOUT SQUATS` | cross_reference_note |  |
| A32 | `SPECIALTY VARIATIONS` | header |  |
| A38 | `Leg Extensiona` | header |  |
| A46 | `BILATERAL FRONTAL` | header |  |
| A53 | `BILATERAL TRANSVERSE` | header |  |
| A59 | `HIP DOMINANT` | header |  |
| A60 | `BILATERAL SAGITAL` | header |  |
| A75 | `POWERLIFTING Speacialty LIFT ` | header |  |
| A77 | `SPEED SPECIALS` | header |  |
| A80 | `**SEE MORE IN BALLISTICS&PLYOS or ALL ABOUT LUNGES` | cross_reference_note |  |
| A81 | `ROM VARIABLE` | header |  |
| A86 | `END RANGE BEHAVIOR VARIABLE` | header |  |
| A90 | `LOADING VARIABLES` | header |  |
| A110 | `TEST FORMULA` | test_formula_label |  |
| C7 | `UNILATERAL SAGITAL` | header |  |
| C8 | `*SEE ALL ABOUT LUNGES CHEAT SHEET FOR MORE UNDERSTNADING*` | cross_reference_note |  |
| C9 | `FEET POSITIONING VARIATIONS` | header |  |
| C19 | `GET INTO THE HIP VARIATIONS - MODERATE` | header |  |
| C21 | `GET OUT OF THE HIP - MODERATE` | header |  |
| C23 | `GET INTO THE HIP VARIATIONS - HARDER` | header |  |
| C25 | `GET OUT OF THE HIP VARIATIONS - HARDER` | header |  |
| C27 | `LOW/MID LOADING VARIATION` | header |  |
| C31 | `HIGH LOADING VARIATION` | header |  |
| C37 | `SINGLE LEG` | header |  |
| C46 | `UNILATERAL FRONTAL` | header |  |
| C53 | `UNLATERAL TRANSVERSE` | header |  |
| C60 | `UNILATERAL SAGITAL` | header |  |
| C61 | `BILATERAL LOADING` | header |  |
| C70 | `UNILATERAL LOADING ` | header |  |
| C71 | `GET INTO THE HIP VARIATIONS` | header |  |
| C73 | `GET OUT OF THE HIP` | header |  |
| C76 | `UNLATERAL TRANSVERSE` | header |  |
| E5 | `UPPER BODY MECHANICS` | header |  |
| E6 | `VERTICAL PUSH` | header |  |
| E7 | `BILATERAL SAGITAL` | header |  |
| E16 | `HALF KNEELING VARIATIONS` | header |  |
| E46 | `BILATERAL FRONTAL` | header |  |
| E53 | `BILATERAL TRANSVERSE` | header |  |
| E59 | `VERTICAL PULL` | header |  |
| E60 | `BILATERAL SAGITAL` | header |  |
| G6 | `MID RANGE PUSH` | header |  |
| G7 | `BILATERAL SAGITAL` | header |  |
| G46 | `BILATERAL FRONTAL` | header |  |
| G53 | `BILATERAL TRANSVERSE` | header |  |
| G59 | `HORIZONTAL PULL` | header |  |
| G60 | `BILATERAL SAGITAL` | header |  |
| G73 | `UNILATERAL SAGITAL` | header |  |
| G82 | `STANCES` | header |  |
| I6 | `HORIZONTAL PUSH` | header |  |
| I7 | `BILATERAL SAGITAL` | header |  |
| I16 | `HAND PLACEMENT` | header |  |
| I22 | `FEET POSITION` | header |  |
| I29 | `UNILATERAL SAGITAL` | header |  |
| I46 | `BILATERAL FRONTAL` | header |  |
| I53 | `BILATERAL TRANSVERSE` | header |  |
| K6 | `SHOULDERS/BICEP/TRICEP` | header |  |
| K7 | `SHOULDERS` | header |  |
| K23 | `BICEPS` | header |  |
| K31 | `TRICEPS` | header |  |

### (NOT DONE) ALL ABOUT BALLISTICS

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A2 | `BALLISTICS & PLYOS` | header |  |
| A4 | `DYNAMIC MEDBALL WARMUP DRILLS` | statement |  |
| A5 | `BILATERAL` | header |  |
| B5 | `KNEE DOMINANT BILATERAL` | header |  |
| C5 | `KNEE DOMINANT UNILATERAL` | header |  |
| C21 | `**PULSING/REP BOUNCING IS FOR TRANSITIONAL OR AMMORTIZATION PHASE` | header | Pulsing/bouncing belongs to the amortization phase only. |
| A22 | `BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST` | header |  |
| D22 | `PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY` | header |  |
| A23 | `*I USE THESE FOR MUSCULAR FORCE PRODUCTION` | statement | Ballistics = muscular force production. |
| D23 | `*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS` | statement | Plyos = reactive connective tissue adaptations. |
| A24 | `TAKING IN FORCES` | header |  |
| B24 | `DELIVER FORCES FAST` | header |  |
| C24 | `AMORTIZATION OF FORCES` | header |  |
| D24 | `REBOUNDING ` | header |  |
| A51 | `MEDBALL CHEAT SHEET` | header |  |
| C72 | `SPECIALTIES` | header |  |
| C82 | `CORE EXTRAS` | header |  |

### (NOT DONE) ALL ABOUT OLYMPIC LI

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A4 | `TEACHING/ LEARNING THE SKILL` | header |  |
| A5 | `PROGRESSION MODEL EASY TO HARD` | header |  |
| A6 | `CLEANS` | header |  |
| A14 | `JERK` | header |  |
| A19 | `SNATCH` | header |  |
| B30 | `*SQUAT SNATCH HAS ITS OWN MODEL TO WORK AROUND BECAUSE DEPTH ON THE SQUAT NEEDS TO BE ADDRESSED` | statement | Squat snatch depth is its own ROM problem. |

### (NOT DONE) ALL ABOUT LUNGES

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A3 | `*LUNGES are a UNILATERAL KNEE DOMINANT MOVEMENT` | statement |  |
| A4 | `**Just because they are knee dominant, it doesn't mean that they don't affect the hips... We can bias different foot placement for hip adaptations as much as foot adaptations` | statement | Foot placement biases hip vs foot adaptations. |
| A6 | `BUILDING THOUGHTS....` | statement |  |
| A8 | `Lunges are a propulsive strategy ` | statement | Lunges are propulsive. |
| A9 | `Lunges can be great for targetting prime movers along with frontal/transverse musculature` | statement |  |
| A10 | `Lunges are great for relative movement at the hips` | statement |  |
| A11 | `Lunges are great for strengthening athletic patterns ` | statement |  |
| A12 | `Lunges are great for finding/gaining/regaining ROM` | statement | Lunges are a ROM tool. |
| A13 | `Lunges are great potentiators of the squat patterns` | statement | Lunges potentiate squats -> can be placed before squats. |
| A16 | `THIS IS NOT PERFECT, BUT IT HELPS UNDERSTAND` | statement |  |
| A17 | `Stance loads the FRONT TO BACK` | statement | Stance = sagittal (front/back) loading. |
| A18 | `Load position loads UP/DOWN & SIDE2SIDE` | statement | Load position = vertical and frontal loading. |
| A19 | `Movement orientations/guidance loads AROUND` | statement | Orientation = transverse loading. |
| C21 | `LOADING` | header |  |
| E21 | `PROPULSION` | header |  |

### CONTROL PATTERNSCORE

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A1 | `CONTROL PATTERNS` | header |  |
| A2 | `CORE` | header |  |
| A4 | `TRANSVERSE` | header |  |
| H4 | `SAGITAL` | header |  |
| O4 | `FRONTAL` | header |  |
| B5 | `DYNAMIC` | header |  |
| E5 | `STATIC` | header |  |
| I5 | `DYNAMIC` | header |  |
| L5 | `STATIC` | header |  |
| P5 | `DYNAMIC` | header |  |
| S5 | `STATIC` | header |  |
| A7 | `CORE THORAX` | header |  |
| H7 | `CORE THORAX` | header |  |
| O7 | `CORE THORAX` | header |  |
| A18 | `CORE PELVIS` | header |  |
| H18 | `CORE PELVIS` | header |  |
| O18 | `CORE PELVIS` | header |  |
| H28 | `BOTH` | header |  |
| O28 | `BOTH` | header |  |
| A29 | `BOTH` | header |  |

### AEROBIC CAPACITY CHEAT SHEET

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| A1 | `AEROBIC CAPACITY WORK` | header |  |
| A3 | `*These are only recomendations & samples` | statement |  |
| A4 | `**Follow Running Warmups` | statement |  |
| A5 | `***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week` | statement | One of each colour per week, never the same colour twice. |
| A8 | `BEGGINER WORKOUTS` | header |  |
| D8 | ` INTERMEDIATE WORKOUTS` | header |  |
| G8 | ` ADVANCED WORKOUTS` | header |  |
| B23 | `CHEAT SHEET` | header |  |
| E23 | `RUNNING WARMUP` | header |  |
| G23 | `  LACTATE CLEARANCE ` | header |  |
| A25 | `Short Duration ` | header |  |
| B25 | `Moderate Duration` | header |  |
| C25 | `Long Duration` | header |  |
| A26 | `High Intensity` | header |  |
| B26 | `Moderate Intensity` | header |  |
| C26 | `Low intensity` | header |  |
| A28 | `Seconds ` | statement |  |
| B28 | `1 Minute` | statement |  |
| C28 | `4+ Minutes` | statement |  |
| A29 | `15/45 Work:Rest` | statement |  |
| B29 | `2 Minutes` | statement |  |
| A30 | `20/40 Work:Rest` | statement |  |
| B30 | `3 Minutes` | statement |  |
| A31 | `30/30 Work:Rest` | statement |  |
| A32 | `40/20 Work:Rest` | statement |  |
| A33 | `45/15 Work:Rest` | statement |  |
| A36 | `3 Minutes` | statement |  |
| B36 | `1:1 Work:Rest` | statement |  |
| C36 | `Active` | statement |  |
| E36 | `Add your own as needed...` | statement |  |
| A37 | `4 MInutes` | statement |  |
| B37 | `1:2 Work:Rest` | statement |  |
| C37 | `:30 sec` | statement |  |
| A38 | `5 MInutes` | statement |  |
| B38 | `1:3 Work:Rest` | statement |  |
| C38 | `1 Minute` | statement |  |
| A39 | `6 Minutes` | statement |  |
| C39 | `2 Minutes` | statement |  |
| A40 | `7 Minutes` | statement |  |
| C40 | `3 Minutes` | statement |  |
| A41 | `8 Minutes` | statement |  |

### Sheet23

| Cell | Verbatim | Kind | Interpretation (INFERRED) |
|---|---|---|---|
| B43 | `*FASTEST SSC*` | statement |  |
| B47 | `*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)` | statement | Ballistic/SSC drills are done before sprinting. |
| B51 | `*SPRINT*` | statement |  |
| C34 | `ZONE 1` | statement |  |
| C35 | `ZONE 2` | statement |  |
| C36 | `ZONE 3 ` | statement |  |
| D33 | `Plyo` | statement |  |
| D34 | `Receive pause/creat` | statement |  |
| D35 | `Receive/create` | statement |  |
| D36 | `Repeat receive create` | statement |  |

Sheet23 row-1 headers (B1:AR1, verbatim, in order): `ZONE`; `FOUNDATIONAL - AP - TRIPPLE EXT`; `INTERMEDIATE - AP - TRIPPLE EXT`; `ADVANCED - AP - TRIPPLE EXT`; `FOUNDATINONAL - AP - JUMPING LIMITED KNEE`; `FOUNDATINONAL - AP - PLYOS`; `INTERMEDIATE - AP - JUMPING LIMITED KNEE`; `INTERMEDIATE - AP - PLYOS`; `ADVANCED - AP -JUMPING`; `AP - THROWING`; `FOUNDATIONAL - AP - COD`; `INTERMEDIATE - AP - COD`; `ADVANCED - AP - COD`; `FOUNDATIONAL - CT - SAGITAL`; `INTERMEDIATE - CT - FRONTAL`; `ADVANCED - CT - TRANSVERSE`; `FOUNDATIONAL - CP - SAGITAL`; `INTERMEDIATE - CP - FRONTAL`; `ADVANCED - CP - TRANSVERSE`; `FOUNDATIONAL - RP - BS - VERTICAL PULL`; `ADVANCED - RP - BS - VERTICAL PULL`; `FOUNDATIONAL - RP - BS - VERTICAL PUSH`; `ADVANCED - RP - BS - VERTICAL PUSH`; `RP - BS - FOUNDATIONAL- HORIZONTAL PUSH`; `RP - BS - INTERMEDIATE - HORIZONTAL PUSH`; `RP - BS - ADVANCED HORIZONTAL PUSH`; `RP - BS - HORIZONTAL PULL`; `RP-BS-ADVANCED HORIZONTAL PULL`; `RP - BS - KNEE DOMINANT`; `RP-BS-KNEE DOMINANT-INTERMIDIATE`; `RP-BS-KNEE DOMINANT -ADVANCED`; `RP - BS - HIP DOMINANT`; `RP-BS-HIP DOMINANT-INTERMIDIATE`; `RP-BS-HIP DOMINANT-ADVANCED`; `RP - UL - VERTICAL PULL`; `RP - UL - VERTICAL PUSH`; `RP - UL - HORIZONTAL PUSH`; `RP - UL - HORIZONTAL PULL`; `RP - UL - KNEE DOMINANT`; `RP - UL - HIP DOMINANT`; `RP - BICEP`; `RP - TRICEP`; `RP -SHOULDERS`; `RP - CALVES`.

## Appendix B: all 63 variable-value cells (verbatim)

| Tab | Cell | Group header | Value | Colour level |
|---|---|---|---|---|
| ALL ABOUT SQUATS | A35 | `BANDED/CHAINED SQUAT VARIATIONS` | `BOTTOM BANDED` |  |
| ALL ABOUT SQUATS | A37 | `BANDED/CHAINED SQUAT VARIATIONS` | `REVERSE BANDED` |  |
| ALL ABOUT SQUATS | A39 | `BANDED/CHAINED SQUAT VARIATIONS` | `BOTTOM CHAINS` |  |
| ALL ABOUT SQUATS | A41 | `BANDED/CHAINED SQUAT VARIATIONS` | `WEIGHT RELEASERS` |  |
| (NOT DONE) RESISTANCE PATTERNS | A82 | `ROM VARIABLE` | `Elevated` | green/FOUNDATIONAL |
| (NOT DONE) RESISTANCE PATTERNS | A83 | `ROM VARIABLE` | `Floor` | yellow/INTERMEDIATE |
| (NOT DONE) RESISTANCE PATTERNS | A84 | `ROM VARIABLE` | `Deficit` | red/ADVANCED |
| (NOT DONE) RESISTANCE PATTERNS | A85 | `ROM VARIABLE` | `*RDL` | red/ADVANCED |
| (NOT DONE) RESISTANCE PATTERNS | A87 | `END RANGE BEHAVIOR VARIABLE` | `Dead stop` | green/FOUNDATIONAL |
| (NOT DONE) RESISTANCE PATTERNS | A88 | `END RANGE BEHAVIOR VARIABLE` | `Touch & go` | yellow/INTERMEDIATE |
| (NOT DONE) RESISTANCE PATTERNS | A89 | `END RANGE BEHAVIOR VARIABLE` | `*RDL` | red/ADVANCED |
| (NOT DONE) RESISTANCE PATTERNS | A91 | `LOADING VARIABLES` | `WEIGHT RELEASERS` |  |
| (NOT DONE) RESISTANCE PATTERNS | A92 | `LOADING VARIABLES` | `CHAINS` |  |
| (NOT DONE) RESISTANCE PATTERNS | A93 | `LOADING VARIABLES` | `BANDS` |  |
| (NOT DONE) RESISTANCE PATTERNS | A94 | `LOADING VARIABLES` | `*RDL` | red/ADVANCED |
| (NOT DONE) RESISTANCE PATTERNS | C20 | `GET INTO THE HIP VARIATIONS - MODERATE` | `Contralateral loading ` |  |
| (NOT DONE) RESISTANCE PATTERNS | C22 | `GET OUT OF THE HIP - MODERATE` | `Ipsilateral loading ` |  |
| (NOT DONE) RESISTANCE PATTERNS | C24 | `GET INTO THE HIP VARIATIONS - HARDER` | `Front racked db or kb contralateral loading` |  |
| (NOT DONE) RESISTANCE PATTERNS | C26 | `GET OUT OF THE HIP VARIATIONS - HARDER` | `Front racked db or kb Ipsilateral loading` |  |
| (NOT DONE) RESISTANCE PATTERNS | C28 | `LOW/MID LOADING VARIATION` | `Plate reach ` |  |
| (NOT DONE) RESISTANCE PATTERNS | C29 | `LOW/MID LOADING VARIATION` | `Goblet loading` |  |
| (NOT DONE) RESISTANCE PATTERNS | C30 | `LOW/MID LOADING VARIATION` | `Double kb or Db` |  |
| (NOT DONE) RESISTANCE PATTERNS | C32 | `HIGH LOADING VARIATION` | `Barbell high zercher racked` |  |
| (NOT DONE) RESISTANCE PATTERNS | C33 | `HIGH LOADING VARIATION` | `Barbell zercher racked` |  |
| (NOT DONE) RESISTANCE PATTERNS | C34 | `HIGH LOADING VARIATION` | `Barbell Front squat racked` |  |
| (NOT DONE) RESISTANCE PATTERNS | C35 | `HIGH LOADING VARIATION` | `Barbell back squat racked` |  |
| (NOT DONE) RESISTANCE PATTERNS | C36 | `HIGH LOADING VARIATION` | `Barbell overhead ` |  |
| (NOT DONE) RESISTANCE PATTERNS | C72 | `GET INTO THE HIP VARIATIONS` | `Contralateral loading ` |  |
| (NOT DONE) RESISTANCE PATTERNS | C74 | `GET OUT OF THE HIP` | `Ipsilateral loading ` |  |
| (NOT DONE) RESISTANCE PATTERNS | G83 | `STANCES` | `Split stance ALWAYS contralateral` |  |
| (NOT DONE) RESISTANCE PATTERNS | G84 | `STANCES` | `Half kneeling same side leg up` |  |
| (NOT DONE) RESISTANCE PATTERNS | G85 | `STANCES` | `Half kneeling opposite side leg up` |  |
| (NOT DONE) RESISTANCE PATTERNS | I17 | `HAND PLACEMENT` | `supinated` |  |
| (NOT DONE) RESISTANCE PATTERNS | I18 | `HAND PLACEMENT` | `neutral` |  |
| (NOT DONE) RESISTANCE PATTERNS | I19 | `HAND PLACEMENT` | `pronated` |  |
| (NOT DONE) RESISTANCE PATTERNS | I20 | `HAND PLACEMENT` | `wide grip` |  |
| (NOT DONE) RESISTANCE PATTERNS | I21 | `HAND PLACEMENT` | `narrow grip` |  |
| (NOT DONE) RESISTANCE PATTERNS | I23 | `FEET POSITION` | `feet on bench` | green/FOUNDATIONAL |
| (NOT DONE) RESISTANCE PATTERNS | I24 | `FEET POSITION` | `feet on wall` | green/FOUNDATIONAL |
| (NOT DONE) RESISTANCE PATTERNS | I25 | `FEET POSITION` | `feet on raisers or plates` | yellow/INTERMEDIATE |
| (NOT DONE) RESISTANCE PATTERNS | I26 | `FEET POSITION` | `feet on floor` | yellow/INTERMEDIATE |
| (NOT DONE) RESISTANCE PATTERNS | I27 | `FEET POSITION` | `feet in air (hollow bent legs)` | red/ADVANCED |
| (NOT DONE) RESISTANCE PATTERNS | I28 | `FEET POSITION` | `feet in air (hollow legs str8)` | red/ADVANCED |
| (NOT DONE) ALL ABOUT BALLISTICS | C11 | `KNEE DOMINANT UNILATERAL (medball hold-position rule)` | `*Same lunge variations but medball hug` |  |
| (NOT DONE) ALL ABOUT BALLISTICS | C12 | `KNEE DOMINANT UNILATERAL (medball hold-position rule)` | `*Same lunge variations but medball forward` |  |
| (NOT DONE) ALL ABOUT BALLISTICS | C13 | `KNEE DOMINANT UNILATERAL (medball hold-position rule)` | `*Same lunge variation but medball up` |  |
| (NOT DONE) ALL ABOUT LUNGES | A22 | `(unlabelled) movement orientation` | `Front/back` |  |
| (NOT DONE) ALL ABOUT LUNGES | C22 | `LOADING` | `Contralateral Suitcase` |  |
| (NOT DONE) ALL ABOUT LUNGES | E22 | `PROPULSION` | `FFE` |  |
| (NOT DONE) ALL ABOUT LUNGES | A23 | `(unlabelled) movement orientation` | `Lateral` |  |
| (NOT DONE) ALL ABOUT LUNGES | C23 | `LOADING` | `Ipsilateral Suitcase` |  |
| (NOT DONE) ALL ABOUT LUNGES | E23 | `PROPULSION` | `FLOOR` |  |
| (NOT DONE) ALL ABOUT LUNGES | C24 | `LOADING` | `Duble suitcase` |  |
| (NOT DONE) ALL ABOUT LUNGES | E24 | `PROPULSION` | `RFE` |  |
| (NOT DONE) ALL ABOUT LUNGES | C25 | `LOADING` | `Contralateral on shoulder` |  |
| (NOT DONE) ALL ABOUT LUNGES | C26 | `LOADING` | `Ipsilateral on shoulder` |  |
| (NOT DONE) ALL ABOUT LUNGES | C27 | `LOADING` | `Double handed on shoulders` |  |
| (NOT DONE) ALL ABOUT LUNGES | C28 | `LOADING` | `Contralateral High zercher` |  |
| (NOT DONE) ALL ABOUT LUNGES | C29 | `LOADING` | `Ipsilateral high zercher` |  |
| (NOT DONE) ALL ABOUT LUNGES | C30 | `LOADING` | `Double handed high zercher` |  |
| (NOT DONE) ALL ABOUT LUNGES | C31 | `LOADING` | `Zercher barbell` |  |
| (NOT DONE) ALL ABOUT LUNGES | C32 | `LOADING` | `Front racked barbell` |  |
| (NOT DONE) ALL ABOUT LUNGES | C33 | `LOADING` | `Back racked barbell` |  |

## Appendix C: implement inventory (from `implements[]`)

| Implement | Cells | Family | Stability rank (1 = most guided, INFERRED) | Skill rank (INFERRED) | First examples |
|---|---|---|---|---|---|
| bodyweight | 278 | bodyweight | 4 | 1 | (NOT DONE) RESISTANCE PATTERNS!A8 Air squat; (NOT DONE) RESISTANCE PATTERNS!A9 Air box squats; (NOT DONE) RESISTANCE PATTERNS!A34 SISSY SQUATS |
| barbell | 98 | free weight bar | 5 | 4 | ALL ABOUT SQUATS!C11 High Zercher Squat; ALL ABOUT SQUATS!D11 Zercher Squat; ALL ABOUT SQUATS!E11 Front Squat/ SSB Bar |
| dumbbell | 97 | free weight handheld | 4 | 2 | ALL ABOUT SQUATS!B11 Goblet Squat; (NOT DONE) RESISTANCE PATTERNS!A11 goblet squat; (NOT DONE) RESISTANCE PATTERNS!A12 Foam roller or swiss ball wall assisted goblet |
| medball | 79 | ballistic implement | 6 | 1 | (NOT DONE) ALL ABOUT BALLISTICS!A6 Medball Reach forward reverse lunge; (NOT DONE) ALL ABOUT BALLISTICS!B6 Medball front hold Squat; (NOT DONE) ALL ABOUT BALLISTICS!C6 Medball down over front leg FFE |
| cable | 44 | cable | 2 | 1 | (NOT DONE) RESISTANCE PATTERNS!A64 Cable Pull through; (NOT DONE) RESISTANCE PATTERNS!E61 Lat pull downs wide grip; (NOT DONE) RESISTANCE PATTERNS!E62 Lat pull downs supinated grip |
| kettlebell | 24 | free weight handheld | 4 | 2 | ALL ABOUT SQUATS!B11 Goblet Squat; (NOT DONE) RESISTANCE PATTERNS!A11 goblet squat; (NOT DONE) RESISTANCE PATTERNS!A12 Foam roller or swiss ball wall assisted goblet |
| band | 16 | elastic | 3 | 1 | (NOT DONE) RESISTANCE PATTERNS!A26 Box *ANY Squat touch & go banded; (NOT DONE) RESISTANCE PATTERNS!A27 Box *ANY Squat touch & go reverse banded; (NOT DONE) RESISTANCE PATTERNS!A29 Box *ANY Squat Deload banded |
| any_squat_loading_wildcard | 12 | wildcard | None | None | (NOT DONE) RESISTANCE PATTERNS!A25 Box *ANY Squat touch & go; (NOT DONE) RESISTANCE PATTERNS!A26 Box *ANY Squat touch & go banded; (NOT DONE) RESISTANCE PATTERNS!A27 Box *ANY Squat touch & go reverse banded |
| hex_bar | 11 | free weight bar | 4 | 2 | ALL ABOUT SQUATS!A11 Hex Bar Squat; (NOT DONE) RESISTANCE PATTERNS!A13 Hex bar squats; (NOT DONE) RESISTANCE PATTERNS!A14 Fliped hex bar squats |
| external_load_unspecified | 10 | free weight handheld | 4 | 2 | (NOT DONE) RESISTANCE PATTERNS!E75 Weighted Pull ups; (NOT DONE) ALL ABOUT BALLISTICS!A30 WEIGHTED STICK THE LANDING BILATERAL; (NOT DONE) ALL ABOUT BALLISTICS!A32 WEIGHTED STICK THE LANDING UNILATERAL |
| landmine | 6 | free weight anchored | 3 | 2 | (NOT DONE) RESISTANCE PATTERNS!A16 Landmine Squat; (NOT DONE) RESISTANCE PATTERNS!G13 Standing landmine press; (NOT DONE) RESISTANCE PATTERNS!G14 kneeling landmine press |
| assisted_pullup_machine | 6 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!E68 Assisted pull up machine close grip; (NOT DONE) RESISTANCE PATTERNS!E69 Assisted pull up machine pronated grip; (NOT DONE) RESISTANCE PATTERNS!E70 Assisted pull up machine supinated grip |
| ez_bar | 6 | free weight bar | 4 | 2 | (NOT DONE) RESISTANCE PATTERNS!K27 EZ Bar supinated curls; (NOT DONE) RESISTANCE PATTERNS!K28 EZ bar pronated curls; (NOT DONE) RESISTANCE PATTERNS!K40 EZ bar Skull crusher |
| row_machine | 5 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!G61 Machine row; (NOT DONE) RESISTANCE PATTERNS!G74 Machine single arm row; Sheet23!AA2 Machine Row Close Grip |
| suspension_trx_rings | 5 | suspension | 3 | 2 | (NOT DONE) RESISTANCE PATTERNS!G64 Incline reverse pushup (rings/trx/barbell/smith machine); (NOT DONE) RESISTANCE PATTERNS!G65 Paralell reverse pushup (rings/trx/barbell/smith machine); Sheet23!T12 Seated Pull ups with Rings or TRX |
| leg_extension_machine | 4 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!A39 Leg extension machine; Sheet23!AC11 Leg Extension Machine; Sheet23!AD11 Leg Extension Machine |
| leg_press | 3 | machine | 1 | 1 | ALL ABOUT SQUATS!G35 LEG PRESS; Sheet23!AD9 Leg Press; Sheet23!AE9 Leg press |
| hack_squat_machine | 3 | machine | 1 | 1 | ALL ABOUT SQUATS!G37 HACK SQUAT; Sheet23!AD8 Hack Squat Machine; Sheet23!AE8 Hack Squats |
| ghd | 3 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!A67 GHD; Sheet23!AG4 GHD; Sheet23!AH4 GHD |
| leg_curl_machine | 3 | machine | 1 | 1 | Sheet23!AF8 Leg Curl Machine; Sheet23!AG10 Machine Leg Curls (Seated and Laying Down); Sheet23!AH11 Machine Leg Curls |
| ssb | 2 | free weight bar | 4 | 3 | ALL ABOUT SQUATS!E11 Front Squat/ SSB Bar; (NOT DONE) RESISTANCE PATTERNS!A33 SSB bar Squats |
| pendulum_squat | 2 | machine | 1 | 1 | ALL ABOUT SQUATS!G41 PENDULUM; Sheet23!AE10 Pendulum Squat |
| plate_load | 2 | free weight handheld | 4 | 1 | (NOT DONE) RESISTANCE PATTERNS!A10 Plate reach forward squat; CONTROL PATTERNSCORE!B14 Swiss ball plate torso rotations |
| reverse_hyper | 2 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!A63 Reverse hyper extensions; Sheet23!AF4 Reverse Hyper Extension |
| smith_machine | 2 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!G64 Incline reverse pushup (rings/trx/barbell/smith machine); (NOT DONE) RESISTANCE PATTERNS!G65 Paralell reverse pushup (rings/trx/barbell/smith machine) |
| v_squat | 1 | machine | 1 | 1 | ALL ABOUT SQUATS!G39 V-SQUAT |
| hyperextension_45 | 1 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!A68 45 degree hip ext.  |
| viking_handle | 1 | free weight anchored | 3 | 2 | (NOT DONE) RESISTANCE PATTERNS!G12 Standing viking press |
| pendulum_row | 1 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!G70 Pendulum row |
| reverse_fly_machine | 1 | machine | 1 | 1 | (NOT DONE) RESISTANCE PATTERNS!K18 Machine reverse flies |
| sandbag | 1 | free weight handheld | 4 | 1 | Sheet23!AF9 Sandbag Hip Thrusts |
| hip_thrust_machine | 1 | machine | 1 | 1 | Sheet23!AG7 Hip Thrust Machine |
| good_morning_machine | 1 | machine | 1 | 1 | Sheet23!AG8 Machine Good Mornings |
| calf_machine | 1 | machine | 1 | 1 | Sheet23!AR4 Machine Calf Raises |
