# Coach-eye review, round 9: 05 Bootcamp (L2, 3 days, dumbbells + kettlebells, 8 weeks; engine 0.7.0)

**Grade: A-** (coach's round-5 grade: B+; target reached). His note on this plan was "vary bootcamp into circuit training ... sometimes ... in rounds". It is done cleanly:
- Each week holds both formats: "In rounds: go through every station once, rest, and repeat" and "Station by station: do all 3 sets of a station ..., then move to the next one".
- The formats flip at the block change, and the plan says so up front.

The other round-5 answers are in:
- Rounds climb in thirds: 3 / 4 / 5 (weeks 1-3, 4-6, 7-8; R5-CLS-03).
- The free pull-up station is a dumbbell hip thrust (R5-CLS-02).
- The cardio station is plain cardio (R5-CLS-06).
- No group starts at its top (R5-CLS-07).
- The two big steps (+33 % in week 4, +25 % in week 7) and the early below-floor weeks are said honestly.

What is left are small copy and selection items.

Reviewed: `samples/plans/05-bootcamp.en.md`, `.es.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`), plus `samples/intakes/05-bootcamp.json`.
- Warnings: `acceleration` (wk 4, wk 7), `circuit_rounds_floor`, `circuit_rounds_thirds`, `circuit_over_top` (hips 18.75 / 18), `V7` (pull-up bar, TRX), `no_vertical_pull`, `bootcamp_format`.

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-GRD-05: vary the format (station by station and in rounds) | Block 1: Mon and Fri in rounds, Wed station by station. Block 2: flipped. Every station line and dose says which ("3 rounds x 35 s" / "3 sets x 35 s"). | Applied |
| R5-CLS-03: rounds 3 / 4 / 5 in thirds | `3 3 3 · 4 4 4 · 5 5` (8 weeks split 3 / 3 / 2). "These are a guide: add or take away a round." | Applied |
| R5-CLS-02: hip thrust or bridge in the free pull-up station | Mon **Dumbbell Hip Thrust** (`why.circuit_free_station_hips`). Pressing leads pulling by one station, as he accepted. | Applied (copy, m1) |
| R5-CLS-06: plain cardio in the cardio station | Jump rope (Mon), burpees (Wed), jumping jacks (Fri). | Applied |
| R5-CLS-07: nothing starts at its top | Shoulders start at 10.5 (3 rounds); every group climbs. Hips go to 18.75 over a top of 18, said with what to do. | Applied |
| R5-GRD-06: core optional | Printed on every core block. | Applied |
| R5-GEN-03: bootcamp 7 stations | 7 stations a day. | Applied |
| R5-VOL-02: pull ≥ press | Back 9 → 15 = chest 9 → 15. Pressing stations 4, pulling 3 + the hip-thrust stand-in (accepted). | Applied |

## Round-5 review items (the last 05 review): status

| R5 # | Status in r9 |
|---|---|
| m1 hips the smallest group, no hip thrust | **Fixed**: hip thrust; hips 11 → 18.75. |
| m2 flat 6 weeks, then +25 % | **Changed by R5-CLS-03**: now flat 3 / 3 / 2 with +33 % and +25 %. That is his model, and it is said. |
| m3 shoulders above their top | **Fixed** (R5-CLS-07); the over-top group is now hips, said (m6). |
| m4 the same chest-supported row twice a week | **Open** (m3). |
| m5 Copenhagen plank as a gen-pop opener | **Open** (m4). |
| m6 overhead press with no incline option | **Open** (m5). |
| m7 / m8 instead-of lines | **Partly**: Friday's row says "instead of Single-Arm Lat Pulldown" (8 times); Monday's hip thrust has no line (m1). |
| m9 added stations inside his slot order | Not re-checked. |
| m10 `easy_to_remove` empty | **Open** (m7). |
| m11 odd defaults (supinated lateral raise, rear-foot-on-wall RDL) | **Open** (m8). |
| m12 cardio swap lines | Not re-checked. |
| m13 "skip the jump, throw or cardio station" with no jump or throw | **Open** (m9). |
| m14 calves row missing | Not re-checked. |
| m15 copy, EN / ES | **Open** (m10). |

---

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | "Before you start": "With this equipment the plan has no vertical pull ...: its place is taken by a row or a rear-delt fly." Mon station 5 Dumbbell Hip Thrust carries no line. | **New (copy).** Since R5-CLS-02, Monday's free station is a hip thrust, not a row or a fly. Nothing on the hip thrust tells the member it stands in for the pull-up. | R5-CLS-02; R4-LIB-04 (one line on a swap) | minor | `warning.no_vertical_pull`: "a hip thrust (Monday) and a row (Friday)". Give the stand-in an `instead_of` note: "Hip thrust in the pull-up station (no bar): more hip work; a bar brings the pull-up back". |
| m2 | Station by station: "3 sets of 35 s with 15 s of rest between sets, then the next station" (deadlift, floor press, OH press ...) | **New.** 15 s between sets of the same loaded lift is effectively 2 minutes of continuous work on one muscle. In his "horizontal" set-by-set training the rest between sets is closer to 30-60 s. A member will drop the load to survive it, and the rest is not adjustable. | R5-GRD-05 reading (PROPOSED split, G-259); VOL-14 rest | minor | `supersets.v7.bootcamp_format`: station-by-station rest 30-45 s (cardio station 15 s); say "rest about 30 s between sets". |
| m3 | Mon station 2 and Fri station 1: Chest-Supported Row (both blocks); Fri also Bent-Over DB Row | (Carried.) The same row twice a week, and two horizontal rows on Friday. | R2-LIB-01; R5-LIB-01 (two-arm bent-over and chest-supported DB rows are both regular picks now) | minor | Monday takes the two-arm bent-over row, Friday the chest-supported row and a different second pull (single-arm row or reverse fly). |
| m4 | Mon core Copenhagen Plank, 8 weeks | (Carried.) A hard adductor hold as the opener for a 42-year-old general client. | R2-SES-03 | minor | A plank or dead bug opener for gen-pop. |
| m5 | Wed Alternating DB Overhead Press → Seesaw Press | (Carried.) No incline option (the kit's bench is not a weight bench), and the plan does not say why incline-first is not met. Overhead is fine for health (R5-ATH-04). | R4-LIB-03 | minor | One line: "incline needs an adjustable bench". |
| m6 | Hips 18.75 over a top of 18 in weeks 7-8 | (Said.) "keep its stations at 4 rounds when the others do more" is clear. Hips are the only over-top group because the hip-thrust stand-in adds a third hip station. | R5-CLS-07; R4-PRG-04 | minor | Fine as said; or keep the stand-in at 4 rounds by default. |
| m7 | `day.easy_to_remove` empty on all three days | (Carried.) R4-SES-04 asks each day to name what is easiest to remove. A circuit day could name the curl, the lateral raise or the cardio station. | R4-SES-04; V36 | minor | Fill `easy_to_remove` for circuit days (small-muscle stations, then the cardio station). |
| m8 | Fri DB Lateral Raise (supinated, palms up); Mon Rear-Foot-on-Wall RDL | (Carried.) Odd defaults where his sheet names DB lateral raises and the staggered-stance DB deadlift. | CAT-07 | minor | Rank the plain records first for gen-pop. |
| m9 | "In a circuit you can skip the jump, throw or cardio station" | (Carried.) This plan has no jump or throw station. | Copy | minor | Name only the station kinds the plan holds. |
| m10 | Copy | (Carried.)<br>- EN: "Optional upgrade: pull-up bar or suspension trainer (TRX) would add" should be "a pull-up bar or a TRX".<br>- EN: "Week 4 jumps more than usual" reads as plyometrics; the ES "sube" is better.<br>- ES: "agregaría" should be "agregarían". | Copy; H14 | minor | Fix the strings in `model/i18n`. |

**Count: 0 blockers, 0 majors, 10 minors.**

## Fresh checks (as Lalo)

- **His bootcamp day**, 7 stations:
  - Mon: squat, row, hinge, cardio, hip, biceps, single-leg.
  - Wed: hinge, press, biceps, push-up, overhead, cardio, triceps.
  - Fri: row, split squat, cardio, push-up, row, triceps, side delts.
  - Core comes first.
- **The steps.** The rounds carry the stairway: 54 → 72 → 90 sets. Every step is said, and the weeks under the 10-set floor are named with the week they end.
- **The formats** are printed per circuit and in the dose. The member always knows which one today is.
- **Spanish.** The new lines read naturally: "En rondas", "Estación por estación", "sube más de lo habitual", and the hip line.

## The one change that lifts it to A

Fix the no-vertical-pull line and name the hip-thrust stand-in (m1). Give station-by-station sets a real rest (m2). Change one of the two chest-supported rows (m3).
