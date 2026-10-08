# 05 - Session and week architecture (Blaze Camp) - v1

**What this is.** How the coach builds a training *session* (which slots, in what order, paired how) and a training *week* (which day types, on which weekdays, with which optional, conditioning and OFF days). It does three things:

1. It catalogues every template he has built, from both workbooks, as slot sequences in one bucket vocabulary (section 2, unchanged OBSERVED evidence).
2. It states the rules that govern sessions and weeks. In v1 these rules come first from **the coach's own answers** (138 of 140 questions answered on 2026-10-08), and only then from what the sheets show.
3. It turns those rules into generator-ready week splits for 2, 3, 4, 5 and 6 days per week, for six goal families, with variants, scaled from 30 to 90 minutes (120 for competitive athletes).

The machine-readable companion is `05_templates.json` in this folder (v1). It holds the bucket vocabulary, the observed templates, the v1 rules, the time model, the 30 regenerated split templates with their variants, the recomputed checks for every template and the open questions.

**Audience.** Two readers:
- the coach, who should be able to say "yes, that is how I do it" or "no, change this";
- the engineer who will encode the generator.

**Evidence tags (on every claim).**
- **COACH-ANSWER <ID>** = the coach's own answer in `coach_answers_full.md` (question ID cited). It overrides every sheet inference and every earlier team decision.
- **OBSERVED** = read from a cell, label, colour, merge or dropdown in the coach's sheets. Tab and cell are cited.
- **INFERRED** = my reasoning from the observed material, or my application of a coach answer to a case he did not name. Each one is a proposal the coach can overrule.
- **SCIENCE** = general training-science literature (listed in section 12).
- **PROPOSED** = a team proposal where the coach asked us to propose or did not decide. Always **PENDING COACH APPROVAL**.

**Sources.** `coach_answers_full.md` (read in full) and `coach_answers.md` (his earlier chat statements); every decode file in `analysis/programs/`, `analysis/library/` and `analysis/reference/`; the equipment/ordering audit in `analysis/equipment/`; the sibling synthesis files `03_volume_dosing.md` (dose and level numbers) and `06_periodization.md` (plan shapes). The v1 templates and every number in sections 7-8 were recomputed with python (project venv) by a build script that also checks each template. Nothing in Google Sheets was opened for writing.

**Labels.** Coach labels are quoted verbatim with their typos ('Tripple Extension', 'ABdution', 'DOMNANT', 'Sagital', 'RECCOMENDED', 'ACCESORY'). My own names are spelled correctly. Generator-facing program and day names are generic and plain (COACH-ANSWER FIX-03), for example 'JUSTICE LEAGUE' becomes 'Athletic Performance - Non-Competitive' (COACH-ANSWER ATH-13). Tab names stay verbatim where they are cited as evidence.

**One important absence (OBSERVED).** No tab in either workbook states how long a session lasts. v1 session lengths come from the coach's answers (UNI-09, PRG-03, VOL-08). Minute estimates per template come from the time model in section 7 and are INFERRED.

---

## v1 - coach answers applied

### What changed (one line each, with the question IDs)

| # | Change | Coach answer | Where |
|---|---|---|---|
| 1 | **Core first, for everyone.** Every session of every family opens with a core block right after the warm-up: about 2 exercises. The user may move it after the plyos, after strength or to the end. Replaces "core primer only in athletic programs" and "core on optional days for hypertrophy". | ATH-11 (NOT RIGHT to v0), VOL-17 | 3.1, 6.10, all templates |
| 2 | **Pairing rule is universal and slot-level.** In any session that mixes lower and upper work, hip-dominant (back of the lower body) goes with a push (front of the upper body) and knee-dominant goes with a pull. Reason: no bleed-over, more total work across the week. Also for full body and bootcamps. | UNI-11, ORD-06 | 4.1, all templates |
| 3 | **BOOTCAMP 1 Tue/Fri was a mistake.** 'Bilateral HD' -> 'Vertical Pull' -> 'Unilateral KD' -> 'Horizontal Push' becomes hinge + horizontal push, single-leg squat + vertical pull. The G2 grammar is redefined. | ORD-06, UNI-11 | 2.1 note, 4.4, 8.4 |
| 4 | **The vertical vector is no longer "free".** It follows the lower pattern it is paired with. The athletic themed days (G8) and HYBRID Saturday are re-wired. | UNI-11 | 4.4, 6.1 |
| 5 | **Same-pattern vs cross-pattern is a rule by goal.** Same pattern (squat + lunge) to drive a muscle harder: physique, bodybuilding, strength, high-level athletes who need more stimulus to grow. Cross pattern (squat + single-leg hinge) for less soreness: bootcamp, fat loss, general fitness, athletes by default, in season. The athletic default switches to cross pattern; the BYOP same-pattern athletic grammar stays as a variant. | UNI-06 | 4.2, 8.1-8.2 |
| 6 | **Row before pulldown, horizontal before vertical, everywhere.** FAT BURN / 4 TRACKS / boxing pulldown-first is not followed. | ORD-01 (+ coach chat) | 3.3 |
| 7 | **"The work" first**, even when it is vertical. | ORD-02 | 3.3 |
| 8 | **Power before strength**, always (HYBRID's strength-before-OLY is not followed). | ORD-03 | 3.1, 8.5 |
| 9 | **Calves / side raises first only when that muscle is a priority.** Default position: end of the session. | ORD-04 | 3.4, templates |
| 10 | **Supersets are a fatigue and time tool** with four use cases: short session; advanced athlete who needs more stimulus; off-season VO2max / mitochondrial work; beginner who does not fatigue. Intermediate with enough time = straight sets (INFERRED from the four cases). | ORD-05 | 5 |
| 11 | **The work / the accessory / the nuance / the survival** confirmed (1 RIR / 2 RIR / MAX / done no matter what). Strength cut order changed: the survival is never cut first. | ORD-07 | 6.14, 7.6 |
| 12 | **Warm-up always** (5 min any cardio + A-drills or mobility). A-drills never count as volume or toward the exercise cap. | ORD-08 | 6.11 |
| 13 | **Fighters' cardio-first blocks are real aerobic work.** | ORD-09 | 3.4, 6.7 |
| 14 | **Optional days**: add-on or separate, ideally separate. **Focus slots** may hit the same muscle, 2-3 sets each, to bring a priority muscle to its weekly target. | ORD-10, ORD-11 | 6.6 |
| 15 | **Set-addition order**: the first exercise of the day first, then the next (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); 3-4 exercises per muscle group per day; small muscles at the end get a bonus exercise. Retires the v0 "at most 2 exercises per muscle per session". The weekly 3/5/7% rate is chosen by the person's state, never by muscle size. | VOL-07, VOL-05, VOL-06 | 6.13 |
| 16 | **Session length and caps by population.** Athletes, bodybuilders, powerlifters, pros about 90 min (max 2 h); general / weight loss 45-60 min; bootcamp 35-45 min. Resistance-only 5-7 exercises (45 min ~5, 60 min ~6-7, 75-90 min ~8-9). Field athletes off-season up to 10-12: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance. Replaces the v0 "everyone at 60 min" anchor. | UNI-09, VOL-08, VOL-16, VOL-17, PRG-03 | 7 |
| 17 | **Calves 3 sets every leg day; rear delts get their own sets.** A rear-delt station is added on pull days; after the v1 verification every family has calves on every leg day at every length and at least one rear-delt station a week at its default lengths. | VOL-17 | templates |
| 18 | **Axial loading once a week per pattern.** One axial squat and one axial hinge a week; the second squat exposure is leg press or belt squat, the second hinge exposure is non-axial (hinge pool PROPOSED). | PER-04, EQ-11 | 6.4, templates |
| 19 | **Second weekly exposure = a different exercise** (confirmed), now also non-axial for squats and hinges. Blocks of 4-6 weeks with one or two small variable changes; A/B lead-lift weeks optional for variety seekers. | PER-04, PER-02, PER-03 | 6.3 |
| 20 | **Bootcamp = timed circuits**: 4, 5 or 6 sessions a week; 5-7 stations x 3-5 rounds x 30-50 s; 35-45 min. Bootcamp circuit day types added. | PRG-03 | 5, 8.4 |
| 21 | **PPL weekdays flexible.** | PRG-02 | 8.1 |
| 22 | **Levels L1 / L2 / L3.** Novice = newby (same) = under about 6-12 months; intermediate = consistent for over a year; more than 6-12 months off = body treated as L1; ex-pros start L1 briefly. | PRG-05 | 1, JSON `levels` |
| 23 | **One algorithm for every level and model**; no level-specific rep schemes in templates (the UL upper-day pattern was a fill error). | PRG-06 | 8, 9 |
| 24 | **Dose notation**: '12/10/8 -20' = pyramid (12 mid, 10 heavier, 8 heaviest) then drop to a light 20 (4 sets); '10/10' = per side on unilateral work (1 set). | PRG-07, UNI-01 | 1 |
| 25 | **Generic program names**; 'JUSTICE LEAGUE' = a marketing name for a non-competitive (weekend-warrior) athletic program for adults and youth. | FIX-03, ATH-13 | 1, JSON `program_names` |
| 26 | **Aerobic sessions per week**: 3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts (the whole Muscle & Physique family; verification pass 2). | ATH-07 | 6.7, 8.1 |
| 27 | **Olympic work for everyone in athletic training** (L1: DB/KB snatch, hex-bar jumps, hang pulls / hang cleans; L2-L3 full lifts) - every athletic week at every length, the BASEBALL Parts week included (verification pass 2); youth may lift from the floor; older clients few plyos unless they ask; no sex-based rules. | ATH-10, ATH-09 | 8.2 sport dial |
| 28 | **Sport dial on ground-contact time** (long ground contact -> more ballistics; short -> more plyos); programs start ballistic and become plyometric; the plyo method progression is not a "zone". | ATH-01, ATH-02, CAT-10, CAT-11 | 8.2 |
| 29 | **Boxers: reduce, never cut** pressing and arm volume when punching volume is high. | ATH-04 | 6.1, 8.2 |
| 30 | **No medball for aesthetics** except as warm-up; medballs never over 20 lb. | ATH-05, EQ-06 | templates |
| 31 | **COD stays for every athlete**, tiered by turn angle. Every generated athletic week from 60 min carries COD (hip days from 60, knee days from 75, 3-day S1 from 60; verification pass 2). | ATH-06 | 8.2 |
| 32 | **Contrast / French contrast**: L2+ athletes off-season, about 78-85%, no rest inside the complex (keep the coach's immediate format). | ATH-12 | 5 |
| 33 | **Deload** = about half the sets, same exercises, lighter, no buy-out or finisher. **Tests** by checkbox at block start, or none. **Plan shapes** (4-6 week maintenance, 8, 12, week-by-week, yearly) follow PER-01 (details in 06). | PER-05, PER-07, PER-01 | 6.12 |
| 34 | **Laterality dial** (bilateral:unilateral 90/10 to 10/90 by athlete, phase and pain); contralateral loading pulls into the hip (COD athletes), ipsilateral helps out of the hip (sprint acceleration). | UNI-02, UNI-03, UNI-10, CAT-13 | 4.5 |
| 35 | **Volume credit from the exercise picked**: helpers 0.25, dips 0.5/0.5, 10/10 = 1 set, athletic patterns never count - so ankle hops in the BASEBALL 'calfs' slot no longer count as calf sets. | VOL-09, VOL-10, LIB-16, UNI-01 | 9 |
| 36 | **No bands, no variable resistance** in any pool (banded pulldowns, band-assisted pull-ups, band chops removed); 'Camporini Deadlift' and 'strap rotating in/out' removed; 'Pull under' = lat pull-over. | EQ-01, EQ-07, EQ-08, EQ-12, LIB-09 | 8.6, templates |
| 37 | **All 30 split templates regenerated** (2-6 days x 6 families) plus variants, each with recomputed checks: pattern frequency, slot-level pairing, axial budget, core-first and horizontal-before-vertical order, power before strength, exercise caps and a time estimate. No template fails a check except documented observed-design exemptions. | all of the above | 8, JSON |

### Still pending

- **PRG-01 (skipped):** what 'NO ACCESS' means on the two hidden tabs. Their generic names are on hold.
- **FIX-01 (skipped):** the NO ACCESS - AESTHETICS Tuesday 'Unilateral HD' dropdown that points at LEG CURLS.
- **LIB-10 / LIB-12 (no answer):** 'KB Face Pulls' under VERTICAL PULL; 'Bench Push ups' hands vs feet on the bench.
- **PROPOSED - PENDING COACH APPROVAL:** the non-axial hinge pool; axial squat Monday / axial hinge Friday spacing; a submaximal core block when it opens the session; the exercise-cap counting convention; the time-overflow rule (superset first, then cut); the rolling A/B order for 5-session bootcamp weeks; 105/120-minute options for competitive athletes; default laterality shares beyond the coach's anchor points; the role mapping of other families onto work / accessory / nuance / survival.
- **INFERRED applications to confirm:** the strength lower-day 'nuance' vector and position under UNI-11; the dynamic-effort speed lift as the week's only axial exposure of its pattern; which athletes get same-pattern days; the COD day placement (hip days from 60 min, knee days from 75, 3-day S1) and whether BASEBALL / in-season weeks need COD (11.2-15); the short 2-set Olympic piece that keeps Olympic work in 60-75-min BASEBALL Parts weeks (ATH-10).
- **v0 questions not covered by the questionnaire:** 11 (buy-outs on every 60+ min athletic session), 16 (the 3-day cut), 17 (fixed strength layout), 19 (default for 5-6 day hypertrophy), 20 (minimum home kit), 24 (vertical press optional for physique / fat loss), 25 (CrossFit WOD days by month or by level).
- **New questions raised by the answers:** section 11.2.

---

## 0. The short answers (v1)

| Question | Answer |
|---|---|
| How is a session ordered? | **WARM-UP -> CORE BLOCK -> PLYO / BALLISTIC / SPRINT -> THROWS -> COD -> OLYMPIC / POWER -> THE WORK + its paired upper lift -> secondary pairs -> ISOLATION -> CONDITIONING.** Warm-up always (COACH-ANSWER ORD-08). Core first for everyone, movable (ATH-11). Power before strength (ORD-03). The work first, even when vertical (ORD-02). Row before pulldown, horizontal before vertical (ORD-01). A small muscle goes first only when it is the client's priority (ORD-04). |
| How are slots paired? | **Hip-dominant with a push, knee-dominant with a pull**, in every session that mixes lower and upper work, at slot level (COACH-ANSWER UNI-11, ORD-06). The unilateral lower lift is the **same** pattern as the bilateral one for growth goals (squat + lunge) and the **opposite** pattern for bootcamp, fat loss, general fitness and athletes (squat + single-leg hinge) (UNI-06). BOOTCAMP 1 Tue/Fri was a wiring mistake and is corrected (ORD-06). |
| Exercises per session? | Resistance-only: **5-7** (VOL-16); by length **45 min ~5, 60 min ~6-7, 75-90 min ~8-9** (VOL-08). Field athletes off-season: **up to 10-12** = 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance (VOL-08, VOL-17). Bootcamp: **5-7 stations** (PRG-03). Strength: the four roles (OBSERVED) plus survival isolations. |
| How long is a session? | Athletes, bodybuilders, powerlifters, pros **about 90 min, max 2 h**; general / weight loss **45-60 min** (UNI-09); bootcamp **35-45 min** (PRG-03). |
| How do sets grow? | Weekly by 3, 5 or 7% of the muscle's weekly sets, chosen by the person's state (VOL-05); each new set goes to the **first exercise of the day for that muscle, then the next** (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3) (VOL-07). |
| Week shape? | **A1, B1, OPT, A2, B2, OPT, OFF** (Mon-Sun) for 4-6 days (OBSERVED shape). In v1 the two A days and the two B days differ: one axial squat and one axial hinge a week, the other exposures leg press / belt squat and a non-axial hinge (COACH-ANSWER PER-04). PPL weekdays are flexible (PRG-02). Bootcamp 4, 5 or 6 sessions a week (PRG-03). In season: 2 days (PER-08). |
| Optional days? | The 5-slot block (OBSERVED) - core, Focus 1, Focus 2, calves if they are a priority, one aerobic session. **Separate days preferred, add-ons allowed** (ORD-10). A 4-day plan becomes 5 or 6 days by adding optional days, not heavy sessions (OBSERVED). |
| Aerobic sessions? | **3** general / fat loss, **2** athletes in season, **4** aesthetics / bodybuilders **+ long walks after workouts** (ATH-07). Separate days first, then add-ons (ORD-10). |
| Supersets? | A fatigue and time tool (ORD-05): short sessions, advanced athletes who need more stimulus, off-season VO2max / mitochondrial work, beginners who do not fatigue. Pairs are the UNI-11 pairs and isolation pairs. Contrast complexes for L2+ athletes off-season with no rest inside the complex (ATH-12). |
| Core? | First in every session (about 2 exercises), movable (ATH-11, VOL-17). |
| Calves, rear delts? | Calves 3 sets every leg day; rear delts their own sets (VOL-17). |

---

## 1. Vocabulary: bucket IDs and notation

Every slot, from either workbook, maps to one canonical **bucket**. The table in `05_templates.json > bucket_ids` lists, for each bucket, the coach labels that point to it and the library column. Short list:

| Family | Buckets |
|---|---|
| Athletic patterns ('AP') | AP_PLYO (variant 'upper' = plyo push-ups), AP_JUMP_LIMITED_KNEE, AP_SPRINT, AP_THROW, AP_COD, AP_TRIPLE_EXT. They never count toward muscle sets (COACH-ANSWER VOL-10) |
| Resistance patterns ('RP') | RP_BKD, RP_BHD, RP_UKD, RP_UHD, RP_HPUSH ('Incline' and 'Dips' are details of it), RP_VPUSH, RP_HPULL, RP_VPULL |
| Isolation | ISO_QUAD, ISO_HAM (knee flexion is its own segment, COACH-ANSWER CAT-09), ISO_CHEST, ISO_SIDE_REAR_DELT (side / rear / front; v1: rear delts get their own station, COACH-ANSWER VOL-17), ISO_BICEP, ISO_TRICEP, ISO_CALF (3 sets every leg day, VOL-17) |
| Core ('CONTROL') | CT_CORE_THORAX, CP_CORE_PELVIS, CORE_OTHER ('BOTH' / unspecified), CORE_ANY (the BYOP 'Core' slot, where the generator still has to pick CT or CP). v1: these fill the **core block** that opens every session (COACH-ANSWER ATH-11) |
| Conditioning | COND_AEROBIC (cheat-sheet colours C/B/A), COND_SPRINT_BUYOUT, COND_CIRCUIT, COND_WOD |
| Other | FOCUS (also 'ACCESSORIES' / 'UPPER ACCESORY' / 'LOWER ACCESORY'), SKILL, WARMUP_GENERAL, WARMUP_PREP, FUNCTIONAL (carries/drags; never wired), RECOVERY_ARM_CARE, COMPLEX (contrast/complex station with members), TEST, DELOAD, OFF |

**Crosswalk to the taxonomy.** These are the same analyst codes used in the decode files. `synthesis/01_taxonomy.json` (crosswalk group G25) maps each one to its hierarchical ID, for example RP_BKD = RP.KD.BS, RP_UHD = RP.HD.UL, ISO_SIDE_REAR_DELT = RP.SM.DELT, AP_JUMP_LIMITED_KNEE = AP.JMP.LK, COND_SPRINT_BUYOUT = CA.BUY. `05_templates.json > bucket_ids[*].taxonomy_id_01` carries that mapping for the 28 buckets that have one. The rest (WARMUP_*, SKILL, COMPLEX, TEST, DELOAD, OFF, COND_CIRCUIT, COND_WOD, CORE_ANY, RECOVERY_ARM_CARE) are session-building IDs only.

**Notation used below (v1).**
- `->` = next station.
- `[A | B]` = a UNI-11 pair: a lower pattern and its opposite-surface upper lift (hip + push, knee + pull). Done as straight sets, or as a superset when an ORD-05 use case applies.
- `<A + B>` = an isolation superset or a BASEBALL Part D tri-set. `{X > Y}` = contrast or complex done "directly into" (ATH-12).
- `*` / `~` = the week's axial / non-axial exposure of a squat or hinge pattern (PER-04).
- `(60+)` = station included only when the session is at least 60 min. `|` inside a slot (sheet quotes) = alternatives.

**Dose notation (COACH-ANSWER PRG-07, UNI-01).**
- '12/10/8 -20' = a pyramid: 12 reps at a mid weight, 10 heavier, 8 heaviest, then drop to a light 20-rep set (4 working sets).
- '10/10' on a unilateral exercise = 10 reps each side = 1 set. If a bilateral lift is written 10/10 on purpose, it means a set of 10 and then another set of 10.
- 'MYO SET' = 15 + 5x5 with short pauses, last exercise, machine or isolation (VOL-15). 40-rep sets and AMRAPs only in CrossFit / hybrid styles (VOL-11).
- 'Zone' (COACH-ANSWER CAT-04, CAT-10) = Pat Davidson's rotation-bias zones (vertical positions = external-rotation bias; horizontal = zone 2, internal-rotation bias, compressive). It is an exercise property that feeds the exercise level in 01/02, it does not order or pair stations in this file, and it never applies to plyos; levels are still theoretical (CAT-05). The plyo method progression (receive & pause -> receive then create -> repeated) is not a zone (CAT-11).

### 1.1 Levels and program names (v1)

**Levels (COACH-ANSWER PRG-05; L3 INFERRED).**

| Level | Who |
|---|---|
| L1 | Novice = 'newby' (the coach uses both for the same thing): under about 6-12 months of training. Also anyone back after more than 6-12 months off (the body is treated as L1; skills come back fast). Ex-pros start at L1 briefly to acclimate, then move up. |
| L2 | Intermediate: has trained consistently for over a year. |
| L3 | Advanced: several years of consistent training and high work capacity (INFERRED; not defined by the coach). |

The MM examples' 'NOVICE' and 'NEWBY' columns are both L1 and 'INTERMEDIATE' is L2. Client level and exercise level are separate axes (CAT-06); levels add options and never remove them, and the coach says they are "still very theoretical" (CAT-05). One algorithm drives rep, set and volume progression for every level (PRG-06).

**Program names (COACH-ANSWER FIX-03, ATH-13; names PROPOSED, Spanish names in the JSON for the EN/ES toggle, GEN-01).** Tab names stay verbatim when cited as evidence; the generator shows generic names: 'AESTHETICS - FULL BODY - 4 DAYS' -> *Muscle & Physique - Full Body A/B*; '3 DAY BUILDER' -> *Muscle & Physique - Full Body 3 Days*; 'PUSHPULLLEGS' -> *Push / Pull / Legs*; 'ATHLETIC - FULL BODY' -> *Athletic Performance - Full Body*; 'JUSTICE LEAGUE' -> *Athletic Performance - Non-Competitive* (weekend athletes, adults and youth); 'BOOTCAMP - OPTION 1 / 2' -> *Bootcamp - Full Body A/B* / *Bootcamp - 3-Session Rotation*; 'EXAMPLE FAT BURNBODY TONING PRO' -> *Fat Loss & Toning*; 4 TRACKS -> *Strength / Bodybuilding / Hybrid 8 or 12 Weeks*; 'NO ACCESS' tabs -> pending (PRG-01 skipped). Days are named by what they train ("Day A1 - squat + pull").

---

## 2. Every observed template as a slot sequence

### 2.1 BYOP workbook (dropdown templates)

**OT01 'AESTHETICS - FULL BODY - 4 DAYS'** (C1 'AESTHETICS - FULL BODY - 4 DAYS A WEEK'). OBSERVED. Day 1 is filled, Day 2 is partly filled.

| Day type | Slots (coach label -> bucket) |
|---|---|
| A = Day 1 / Day 3 (EFEFEF) | 'Calves' ISO_CALF -> 'Bilateral KD' RP_BKD -> 'Horizontal Pull' RP_HPULL -> 'Unilateral KD' RP_UKD -> 'Vertical Pull' RP_VPULL -> 'Bicep' ISO_BICEP -> 'Leg Extensions' ISO_QUAD |
| B = Day 2 / Day 4 (CCCCCC) | 'Bilateral HD' RP_BHD -> 'Horizontal Push' RP_HPUSH -> 'Unilateral HD' RP_UHD -> 'Vertical Push' RP_VPUSH -> 'Leg Curls' ISO_HAM -> 'Tricep' ISO_TRICEP -> 'ABdution' ISO_SIDE_REAR_DELT |
| OPT 'Optional' (FCE5CD) | 'Calves' -> 'Cardio' -> 'Core' -> 'Focus 1' -> 'Focus 2' |
| Week (from the hidden twin OT07) | Mon A, Tue B, **Wed OPT**, Thu A, Fri B, **Sat OPT**, **Sun 'OFF'** |
| Filled dose | Day 1: 'Machine Calf Raises' 3 x '15 Reps'; 'Leg press' 3 x '15 Reps'; 'Bent Over Barbell Rows' 3 x '8 to 12 Reps'; 'Reverse Lunges ' 3 x '8 to 12 Reps'; 'Lat Pulldown Pronated Grip' 3 x '15 Reps'; 'Ez Bar Curls' 2 x '20 Reps'; 'Leg Extensions' 2 x '20 Reps'. Day 2: 'DB Deadlifts' 3 x '15 Reps'; 'Push Ups ' 3 x '15 Reps'; 'Staggered Stance DL w/ DB ' (D12) with SETS/REPS still 'CHOOSE 👇'; 'DB Push press' 5 x '6 to 8 Reps'; rows 14-16 unfilled. Day 1 totals 7 exercises / 19 sets (recomputed). |

**v1 notes.** Calves move to the end unless calves are a priority (COACH-ANSWER ORD-04); a core block opens both days (ATH-11); the second A and B of the week are the non-axial exposures (PER-04); calves 3 sets on both days and a rear-delt station on A (VOL-17).

**OT02 '3 DAY BUILDER'** (C1 'AESTHETICS - FULL BODY - 3 DAYS A WEEK'). OBSERVED, empty template. Each DAY is followed by an 'Optional' block.

| Day type | Slots |
|---|---|
| D1 (EFEFEF) | ISO_CALF -> RP_BKD -> RP_HPULL -> RP_UKD -> RP_VPULL |
| D2 (CCCCCC) | RP_BHD -> RP_HPUSH -> RP_UHD -> RP_VPUSH -> ISO_HAM ('Leg Curls', the only isolation that survives the cut) |
| D3 (FFF2CC, a third day type) | RP_BKD -> RP_BHD -> RP_HPULL -> RP_HPUSH -> RP_UKD |
| Frequency | BKD, BHD, HPULL, HPUSH, UKD 2x/week; VPULL, VPUSH, UHD 1x |

**OT03 'PUSHPULLLEGS - 3 or 6 DAYS A WK'** (A1 'PUSH/PULL/LEGS - 6 DAYS A WK'). OBSERVED, empty template. 7 slots every day; Thu-Sat repeat Mon-Wed; 'SUNDAY' 'OFF'.

| Day type | Slots |
|---|---|
| PUSH | 'Horizontal Push' RP_HPUSH -> 'Vertical Push' RP_VPUSH -> 'Incline' RP_HPUSH -> 'Flies' ISO_CHEST -> 'Dips' RP_HPUSH -> 'Push' ISO_TRICEP -> 'Overhead' ISO_TRICEP |
| PULL | 'Horizontal Pull' RP_HPULL -> 'Horizontal Pull' RP_HPULL -> 'Vertical Pull' RP_VPULL -> 'ABdution' ISO_SIDE (side) -> 'Reverse Flies' ISO_SIDE (rear) -> 'Bicep' -> 'Bicep' |
| LEGS | RP_BKD -> RP_BHD -> RP_UKD -> ISO_QUAD -> ISO_HAM -> RP_UHD -> 'Focus 1' FOCUS |

**OT04 'ATHLETIC - FULL BODY - 4 DAYS A'** (A1 '... 4 DAYS A WEEK'). OBSERVED, template. Its filled instance is OT04b 'JUSTICE LEAGUE' - only a marketing name for a non-competitive athletic program for weekend athletes, adults and youth (COACH-ANSWER ATH-13); generic name *Athletic Performance - Non-Competitive* (FIX-03); the hidden copy is OT04c, titled '... 4 to 6 DAYS A WEEK', with a miswire (E19/E46 'Unilateral HD' -> `AR7:AR42` LEG CURLS); OT04c's only filled exercise cells are E12/E39 'Leg extensions'. In OT04 and OT04b the Thursday block (rows 30-39) has no day label (B30:B39 is merged and blank); 'THURSDAY' is written only in OT04c, so "Thu" in OT04/OT04b is read from position.

| Day type | Slots |
|---|---|
| A = MON/THU | 'Plyo' AP_PLYO -> 'Plyo' AP_PLYO -> 'Throwing' AP_THROW -> 'COD' AP_COD -> 'Tripple Extension' AP_TRIPLE_EXT -> RP_BKD -> RP_HPULL -> RP_UKD -> RP_VPULL -> ISO_QUAD (G12 'MYO SET') |
| B = TUE/FRI | 'PLYO' AP_PLYO -> AP_THROW -> AP_COD -> AP_TRIPLE_EXT -> RP_BHD -> RP_HPUSH -> RP_UHD -> RP_VPUSH -> ISO_HAM -> ISO_SIDE_REAR_DELT |
| OPT = WED/SAT | 'Calves' -> 'Aerobic Capacity' -> 'Core' -> 'Focus 1' -> 'Focus 2' |
| JUSTICE LEAGUE Monday (filled) | 'Medium Depth Drop' 2 x 6-8; 'Ankle Hops ' 2 x 6-8; 'Situps to overhead throw' 2 x 8-12; 'DIG/OUT' 2 x 6-8 (H6 'LATERAL'); 'Power Clean' 2 x 6-8; 'Front Squats' 2 x 6-8; 'Cable Machine UL Rows' 2 x 8-12 (H9 'SINGLE ARM'); 'Front Foot Elevated Lunges (FFE)' 2 x 8-12; 'Stricted Pull-ups feet in front ' 2 x 8-12; 'Leg Extensions' 2 x 'MYO SET' (H12 'OUCH'). 10 exercises, 20 sets (10 athletic + 10 resistance). Thursday E35 'Low Bar Back Squat'; Tuesday E13 'SL Depth Drops'. |

**v1 notes.** The generator's athletic default becomes cross pattern (COACH-ANSWER UNI-06); this same-pattern grammar stays as the variant for athletes who need size. Monday front squat + Thursday low-bar back squat are two axial squats; v1 makes Thursday a leg press / belt squat (PER-04). Core block first (ATH-11).

**OT05 'BOOTCAMP - OPTION 1'** (A1 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'). OBSERVED, empty logbook except E30 'Leg extensions' on Thursday (verified in raw rows 3-45).

| Day type | Slots |
|---|---|
| A = MON/THU | RP_BKD -> RP_HPULL -> **RP_UHD** -> **RP_VPUSH** -> ISO_BICEP -> ISO_CALF -> ISO_QUAD |
| B = TUE/FRI | RP_BHD -> **RP_VPULL** -> **RP_UKD** -> RP_HPUSH -> ISO_HAM -> ISO_TRICEP -> ISO_SIDE_REAR_DELT |
| OPT = WED/SAT | the 5-slot optional block |

The key observation: it uses the **same 14 resistance slots as OT01, re-paired**. 'Unilateral KD' <-> 'Unilateral HD' and 'Vertical Pull' <-> 'Vertical Push' swap days. As a result **every session is a complete full-body dose**: knee and hip, push and pull, bilateral and unilateral.

**v1 (COACH-ANSWER ORD-06, UNI-11):** the Tue/Fri wiring was not intentional - "You should read hinge and then push: hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." The corrected B day is 'Bilateral HD' + 'Horizontal Push', 'Unilateral KD' + 'Vertical Pull'. Monday/Thursday already follow the rule.

**OT06 'BOOTCAMP - OPTION 2'** (A1 reads 'BOOTCAMP OPTION 1', a copy-paste leftover). OBSERVED, empty template with no SETS/REPS columns.

| Session | Slots |
|---|---|
| 1A / 1B | RP_BKD -> RP_HPULL -> RP_UHD -> 'Core' -> 'Cardio' (`B7:B335`, which includes the 200m-1000m and calorie options) |
| 2A / 2B | RP_BHD -> RP_HPUSH -> ISO_BICEP (between the two presses) -> RP_VPUSH -> 'Cardio' |
| 3A / 3B | RP_VPULL -> RP_UKD -> **'Cardio' mid-session** (`B7:B122`) -> ISO_TRICEP -> ISO_SIDE_REAR_DELT |
| Week | 1A, 2A, 3A, 1B, 2B, 3B, 'SUNDAY' 'OFF'. Reading it as 3 sessions a week is INFERRED. |

Each A-cycle hits all 8 primary patterns once. Compared with OT05 it drops ISO_CALF, ISO_QUAD, ISO_HAM and FOCUS.

**v1 notes.** The A1 title is fixed to Option 2 (COACH-ANSWER FIX-03). 4, 5 or 6 sessions a week are all valid, run as timed circuits of 5-7 stations x 3-5 rounds x 30-50 s in 35-45 min (PRG-03). Its pairs already follow UNI-11. Calves are added to each session (VOL-17).

**OT07 'NO ACCESS - AESTHETICS - FB - 4'** (hidden). OBSERVED. It is OT01 as a logbook, with weekday labels: MONDAY A, TUESDAY B, WEDNESDAY optional, THURSDAY A, FRIDAY B, SATURDAY optional, SUNDAY 'OFF'. E12/E33 'Unilateral HD' point at `AR7:AR42` (LEG CURLS). It is **not** an equipment-restricted template.

### 2.2 MASTER_MODEL gym examples (hand-typed, filled)

**OT08 'EXAMPLE UPPERLOWER SPLIT'** (hidden; three levels: 'NOVICE' green, 'NEWBY' yellow, 'INTERMEDIATE' orange). OBSERVED.

- LOWER ('LOWER BODY WORKOUT', ADAY): 'Any Cardio Equipment' 5 min -> 'A March' -> 'A Skip' -> 'A Run' -> RP_BKD 'Sqats or Leg Press' -> RP_BHD 'Deadlifts (DB or Barbell)' -> RP_UKD 'Reverse Lunges (Bodyweight or DBs)' -> RP_UHD 'Single Leg Deadlift' -> ISO_QUAD -> ISO_HAM -> ISO_CALF 'MAX REPS'.
  That is 10 lines after the warm-up.
- UPPER ('UPPER BODY WORKOUT', BDAY): 5 min cardio -> RP_HPULL 'Dumbbell Rows' -> RP_HPUSH 'Bench Press' -> RP_VPULL -> RP_VPUSH -> ISO_BICEP 'MAX REPS' -> ISO_TRICEP -> 'DB Side Raises' -> 'DB Upright Rows'.
  The upper day alternates pull and push and **starts with a pull**.
- Week (INFERRED from A5): Mon L, Tue U, Wed cardio, Thu L, Fri U, Sat cardio, Sun off.
- **v1:** 'NOVICE' and 'NEWBY' are the same level (L1) and 'INTERMEDIATE' is L2 (COACH-ANSWER PRG-05). The upper day's reps rising with level (3x8 -> 3x10 -> 4x12) was a fill error, not a rule (PRG-06). The A-drills are warm-up, not exercises (ORD-08).

**OT09 'EXAMPLE PUSHPULLLEGS SPLIT'** (hidden). OBSERVED.

- PUSH: 5 min cardio -> 'KB Book openers ' -> incline DB bench -> **'Side raises'** -> barbell bench -> 'Dips' -> overhead triceps.
- PULL: cardio -> DB rows -> **'DB Reverse Flies or Machine '** -> pulldown/pull-ups -> **'DB upright rows'** -> 2 curls.
- LEGS: the same 11 lines as the UL lower day. Newby and intermediate doses are identical; novice reps differ (PPL novice 2 x 8 and 8/8 vs UL novice 2 x 12 and 12/12).
- Delt isolation is **interleaved between compounds**. There is **no vertical press** anywhere.

**OT10 'EXAMPLE FAT BURNBODY TONING PRO'** (visible; B4 'MUSCLE BUILDING', B36 'CIRCUITS RECCOMENDED'). OBSERVED, 4 weeks.

| Day type | Slots |
|---|---|
| LOWER A | 'LEG PRESS' RP_BKD -> deadlift RP_BHD (spelled 'DEALIFTS' D8 in WK1, 'DEADLIFTS' J8 in WK3) -> lunge RP_UKD -> 'SL RDL' RP_UHD -> 'LEG EXTENSIONS' ISO_QUAD |
| LOWER B | deadlift RP_BHD -> 'SQUATS SMITH MACHINE' RP_BKD -> lunge -> 'SL RDL' -> 'LEG CURLS' ISO_HAM. The lead pattern decides the finisher. |
| U1 (press-led) | RP_HPUSH -> RP_VPULL -> RP_VPUSH, upright row or 'SIDE RAISES' (WK2 Fri) -> RP_HPULL -> biceps |
| U2 (pull-led) | RP_VPULL -> RP_HPUSH -> RP_HPULL -> side raises, upright rows or overhead press -> triceps |
| Pull order | In every FAT BURN upper day the **vertical pull comes before the horizontal pull** (audit R1: 0 of 8 sessions put the row first). |
| Vertical press | A true vertical press appears in only **2 of the 8** upper sessions: WK1 Tuesday D14 'DB OVERHEAD PRESS' and WK4 Tuesday M15 'OVERHEAD PRESS'. The other six use 'UPRIGHT ROWS' or 'SIDE RAISES' in that slot, so **WK2 and WK3 contain no vertical press at all** (recounted from the dump). 'Upright rows' is filed in the library under the Focus list 'SHOULDERS/TRAPS 👇' (AZ52-AZ53), not under VERTICAL PUSH (AA). |
| Week | Mon lower, Tue upper, **Wed cardio**, Thu lower, Fri upper, **Sat cardio**. The A/B variant flips every week. |
| v1 | Row first, then pulldown (COACH-ANSWER ORD-01); the circuits are finishers (PRG-11); lead-lift A/B weeks optional (PER-03). |
| Circuits | 4 stations, round count written on the first one: Mon/Fri in odd weeks, Tue/Thu in even weeks. Mon: 'Jumping Jacks', 'Bodyweight reverse lunges', 'Situps', 'Dumbbell overhead press'. Fri: 'Plank shoulder taps', 'Dumbbell curl to press', 'Bicycle crunches', 'Burpees'. Tue: 'Pushups', 'Dumbbell hammer curls', 'Side plank', 'Other side plank'. Thu: 'Mountain climbers', 'Bodyweight forward lunges', 'Plank Hip turns', 'Bodyweight squats'. Rounds x work: 3 x '30 secs' -> 4 x 35 -> 4 x 40 -> 5 x 50. |

### 2.3 MASTER_MODEL athletic and combat examples

**OT11-OT13 'EXAMPLE ATHLETIC FULL BODY SPLI'**: three levels side by side ('STARTING' 3 workouts, ' MID' 4, ' ADVANCED' 4). OBSERVED; verified in raw. Under the STARTING column the coach writes the block's purpose (A41:A45, OBSERVED): 'First 8 weeks (8wk1) adaptation focus:' / 'Bring athletes back to feeling/moving great' / 'Start ramping up volume of work at highest biomechanical demand' / 'Introduce more specific unilateral demands' / 'Drive more strength/power/speed'. So the STARTING sessions are an 8-week block; the length of the MID and ADVANCED blocks is not written.

| Workout | Sequence |
|---|---|
| Starting S1 (jump + knee) | weighted depth jump -> depth jump into box jump -> loaded jump squats -> 'High Knee Runs FAST' -> HEAVY single-arm row (RP_HPULL) -> **{hex-bar squat > 10 repeat jump squats}** -> **{heavy ipsilateral FFE lunge > lunge jumps}** -> sesaw push press (RP_VPUSH) -> {box step-up jumps > nordic curls} -> side plank presses |
| Starting S2 (medball + hip) | '*MEDBALLS ' 'ALL LIST' -> cross connects -> 'KB Swings + 12/12 Single leg Glute bridges' (RP_BHD + RP_UHD) -> banded fast single-arm pulldowns (RP_VPULL) -> staggered DB snatch -> plyo push-ups (the week's H push) -> Tabata flutter kicks / hip turns |
| Starting S3 (strength + Oly) | 'Med ball rolls' (core first) -> HEAVY Camporini DL -> HEAVY walking lunges -> 'SUPERSET: Low Hang Power Cleans (mid weight) ' + 'Heavy Snatch grip DL' -> tri-set dead bugs + front + side raises -> leg ext + leg curl superset |
| Mid M1 / Adv A1 (jump day) | landing 1 x 8 'Drop & Stick - Hold for 3 seconds' -> M1: jumps / squirrel jumps -> core primer 'Hollow rocks'; A1: core primer 'Med Ball Rockers' **before** the jump ('Single Leg to march jumps', H14) -> M1: 'Heavy DB bench presses' -> 'Heavy Deadlifts' -> 'Pull ups or Lat pull downs' -> paired arm and leg isolation. A1: 'DEADLIFTS (1RIR)' 3 x 1 -> 'Unilateral Deadlift DB loaded' -> core superset, **no upper-body lift at all**. |
| Mid M2/M4, Adv A2/A4 (medball day) | throw list -> cross connects (A2 has none: '*MEDBALLS' 'ALL LIST' goes straight to 'Heavy DB rows') -> M2: 'Heavy Power Cleans' -> 'Lateral Step ups IPSILATERAL loading' -> 'Db Staggered Hang Snatch ' (no upper compound). M4/A2: 'Heavy DB rows' -> 'RFE & FFE contralateral lunge...' -> 'DB overhead sesaw alternating press' -> 'DB side raises + Copenhagen plank' -> '50 situps + 50 crunches + 50 reverse crunches'. A4: 'Heel raises & fast/rythmic/1/4 SQUATS' -> step-ups -> hang snatch -> weighted low plank. |
| Adv A3 | squirrel / plate jumps -> 'Hollow rocks' -> 'Power Cleans' 3 x 3 -> 'HEAVY GLUTE BRIDGES' -> curls & kickbacks -> 'Plate core & leg extensions' |
| Mid M3 | landing -> rockers -> SL march jumps -> hex-bar loaded jumps -> 'Bench glute Bridge & fast alternating DB sesaw floor press' (hip + H push in one cell) -> unilateral DL -> banded pulldowns -> tri-set SL glute bridge + curls + skulls |

Level trend: working sets 89 -> 72 -> 59 per week. These are counts of the OBSERVED SETS cells under the decode's convention (every member of a superset counts its own sets, throws excluded, Tabata = 8); as written the totals are 81 / 71 / 59. I re-derived 35+24+30, 21+10+25+16 and 14+19+17+9 from the dump. Two readings are convention choices: M4's '2 to 4' sets are counted as 3, and A4's 'Heel raises & fast/rythmic/1/4 SQUATS' as one movement. If that cell is counted as two members, the way M1's 'Heavy curls & Heavy tricep kickbakcs' is, A4 = 11 and Advanced = 61 (pass-2 recount). Movements per session (excluding throws) fall from about 10 to about 7.5 on average. "Heavier and faster" is INFERRED from the labels ('HEAVY', '1RIR', 'Power Cleans' 3 x 3).

**v1 notes.** 'STARTING / MID / ADVANCED' are back-to-back blocks or athlete levels "depending on whatever is needed" (COACH-ANSWER PRG-04). 'Camporini DL' is removed from the library (LIB-09); banded pulldowns and S1's 'band row' option are out (EQ-01). S1 gains a COD station from 60 min in generated plans (ATH-06; the sheet has none). In generated plans the vertical vectors follow UNI-11 (S1's push press becomes a vertical pull; S2's pulldown becomes a press; MID/ADVANCED jump days take pushes and medball days pulls). Olympic work goes before strength (ORD-03); the S3 'Med ball rolls' core-first order is now the rule (ATH-11).

**OT14-OT15 'EXAMPLE BOXING 8 WEEK BUILD UP'** (hidden; 'BLAZE CAMP FIGHTER -  8 WEEK BUILD UP '). OBSERVED. Mon / Tue / Thu / Fri; Wednesday and the weekend are empty (INFERRED: sport practice).

| Phase | Mon | Tue | Thu | Fri |
|---|---|---|---|---|
| Wk 1-2 (base, lifts 3 x 10) | **20/40 intervals first** -> sit-ups/T2B -> front squat -> deadlift -> reverse lunge -> SL RDL -> leg curl -> leg ext | medballs (19 x 10) -> DB bench -> pulldowns -> DB OH press -> seal rows -> curls -> skulls | sit-ups -> same lower day | **easy cardio 20 min first** -> core -> DB bench -> pulldowns -> DB OH press -> seal rows (no curls or skull crushers on Friday) |
| Wk 3-8 (conversion) | medballs -> weighted depth drops -> SL high march jump -> clean pull / hang power clean -> lateral box step-up IPSILATERAL -> **'DEADLIFTS (1-2RIR) + 3 min Jump Rope'** -> Copenhagen & unilateral DL -> leg ext/curl | **20-40 min cardio first** -> SL knee tuck + DB rows -> DB snatches -> **'3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps'** -> Jefferson lunge | medballs -> SL squirrel jumps (REVERSE BANDED) -> side + front raises -> rocker + hops + knee tucks -> hang power clean & press -> Bulgarian + SL deficit calf raise -> leg ext/curl | **'Sprint 20/ Recover 40' first** (5 -> 8 rounds) -> drop into box jumps + star toe touches -> **'4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs'** -> contralateral low step-up -> slider runners + hamstring runners |

After week 2 there is **no horizontal push, no vertical pull and no arm isolation** (OBSERVED).

**v1 (COACH-ANSWER ATH-04, ORD-09):** "don't completely cut it... We just need to bring the volume down, down, down" - pressing and arm volume is reduced, not removed, when punching volume is high. The cardio that opens boxing days is a real aerobic block, not a warm-up. Thursday's 'SL squirrel jumps (REVERSE BANDED)' is out as written (EQ-12: no variable resistance); the unbanded jump stays. The week 1-2 upper days put the pulldown before the seal rows; generated plans put the row first (ORD-01).

### 2.4 BASEBALL (OT16): the coach's most developed program

OBSERVED in 24 week-grids (3 blocks x 8); verified in raw rows 42-58. Four days a week; Wednesday and the weekend are free.

| Part | MONDAY ('Speed') | TUESDAY ('strength') | THURSDAY (no tag) | FRIDAY ('speed') |
|---|---|---|---|---|
| A | 'Upper Ballistics/plyo' AP_THROW (pair) | 'LOWER ballistics/plyo' AP_PLYO (pair) | 'Upper Ballistics/plyo' | 'LOWER ballistics/plyo' |
| B | 'LATERAL CORE' (frontal) | 'Transverse core' | 'Sagital core' | 'Transverse core' |
| OPTIONAL PIECE (D5A6BD) | 'OLY' hang clean @ % | 'OLY' hang snatch @ % | hang clean | hang snatch |
| C (superset) | 'bkd' + 'horiz pull' | 'bhd' + 'horiz push' | 'bkd' + 'vert pull' | 'bhd' + 'vert push' |
| D (tri-set) | 'uhd' + 'bicep' + 'calfs' | 'ukd' + 'tricep' + 'shoulders' | 'uhd' + 'bicep' + 'calfs' | 'ukd' + 'tricep' + 'shoulders' |
| E (FFF2CC) | 'Buy out' | 'Buy out' | 'Buy out' | 'Buy out' |

How the template is filled (OBSERVED unless marked):
- Sets are written once per Part. The second row of Part C reads 'Superset - same reps' (19 cells), 'Superset - max reps' (5 cells) or 'heavy Max reps' (6 cells, all on Thursday 'vert pull' rows), or carries its own rep number (recounted in the dump).
- The day tags (row under Part E) read 'Speed' (Mon), 'strength' (Tue), 'speed' (Fri); **Thursday is never tagged**. The tags are written in only **11 of the 24** week-grids (Block 1 wk 2-5; Block 2 'WK 1', 'wk 2', 'wk 4'; Block 3 week 2, 4, 5, 7; recounted: 33 tag cells). The main lift follows the tag: speed/contrast on Monday's squat (15/22 weeks) and Friday's hinge (19/22), strength on Tuesday's hinge (19/22). Thursday's squat is a strength lift in 16/22 weeks, so "Thursday = strength" is INFERRED.
- Slots are often filled with a ballistic version of the pattern: jump squats in 'bkd' (15 of 57 filled 'bkd' rows), KB swings in 'bhd', ankle hops or hurdle hops in 'calfs' (20 of 46 filled calf rows = 43%; my label-based recount from the dump gives 16 of 39, 41%).
- The OPTIONAL PIECE 'OLY' ('Hang cleans @ 75%' ...) appears only in Block 1 wk 6-8 (wk 8 holds 'OLY' 4 x 6 with no exercise named) and Block 2 wk 5 to 'WEEK 8'; Block 3 (in-season) never has it. It always sits **below Part B** (core) and above Part C.
- DELOAD WEEK keeps the template at 3 x 8, with Part A at 1-2 sets, no buy-out and no Oly.
- **v1:** Part B (core) moves before Part A by default (COACH-ANSWER ATH-11; the athlete may move it back). The calf-slot hops are plyo contacts and no longer count as calf sets (VOL-10); 3 resistance calf sets are added on each leg day (VOL-17). The calendar is the same for high school, college and pro; load and speed differ per athlete (PRG-09).
- Block 1 'wk 8' is a recovery week instead: 'Kettlebell arm bars', 'Half kneeling shoulder roll', 'Paced Cardio - easy' 4 x '10 min'.
- Block 3 (in-season, dated 'March 20 - 26' to '04/24 to 04/28') has **no deload or recovery week**: its 'WEEK 8' (DM60) is a normal loaded week with buy-outs. Block 2 labels its grids 'WK 1', 'wk 2', 'wk 4', 'wk 5', 'wk 6', 'WEEK 7', 'WEEK 8', 'DELOAD WEEK' (there is no 'wk 3').

### 2.5 CrossFit (OT17, OT18)

**OT17 'COMPETE CROSSFIT SPLIT'** is a quality-by-month grid. OBSERVED. The days carry these labels:
- MON: 'AEROBIC C.', 'STRENGTH' 'KNEE DOM', 'POWER' 'SNATCH', 'RESISTANCE' 'LB', 'WODs'.
- TUESD: 'SKILL' 'T2B/ DUBS', 'PULL', 'CLEAN', 'UB', WOD.
- THURS: aerobic, 'HIP DOM', 'SNATCH', 'LB' (+ skill 'T2B/ DUBS' in DEC/JAN and 'WODs' in SEPT, DEC, JAN, MAY).
- FRID: 'H.S./ DUBS', 'PUSH', 'CLEAN', 'UB', WOD.
- SAT: aerobic 'YES' in the level-3 and level-4 aerobic months (AUG, SEPT, NOV, DEC, MAY); a Saturday WOD only in MAY.
- **WED and SUN 'OFF' in every month** (the only gap: JANUARY's TEST/PEAK row leaves WED blank, the event month).

Which rows are active changes by month: resistance months, strength months, power months and test months. Aerobic work sits on the lower-body days (Mon/Thu), plus Tue at aerobic level 4. WOD days by month (recounted from the dump; WOD level from row 16):
- WOD level 2 (APRIL, JULY, OCT): Tue + Fri, matching 'LVL 2 = 2 wods a week'.
- WOD level 3: AUG Tue + Fri only (2 days, one short of 'LVL 3 = 3 wods a week'); NOV Mon + Tue + Fri; MAY Mon + Thu + Sat (no Tue/Fri WOD).
- WOD level 4 (SEPT, DEC): Mon + Tue + Thu + Fri.
- JAN (event month, no WOD level written in M16): Mon + Tue + Thu + Fri. FEB, MARCH, JUNE: no WODs.
- Skill is not tied to the WOD level: 'T2B/ DUBS' Tue + 'H.S./ DUBS' Fri in MARCH, APRIL, JUNE, JULY, NOV; all four days in DEC and JAN; no skill row in AUG, SEPT, OCT, FEB, MAY.
So "WODs on the upper-body days, spreading to Mon/Thu at higher levels" is only a tendency (INFERRED); the generator should take WOD days from the month grid, not from a level rule.

**OT18 'CLASS PROGRAMMING SPLIT'**. OBSERVED; verified in raw P1:V16.
- Session order: 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD'.
- MON 'SQUAT' + 'DUBS' + aerobic 'LVL 4'; TUES 'PRESS' + 'SNATCH'; THURS 'DEADLIFT' + 'GYMNASTICS' + 'LVL 3'; FRID 'CLEAN'. WED and SAT columns are blank; reading them as WOD-only days is INFERRED from the 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD' header. Sunday is not listed.
- S4:S11 hold codes '1/1' ... '4/4', '5' for WK 1-8 (typed as dates). Reading them as strength/power levels with WK 8 = 'LVL 5 = Work up to 1RM' is INFERRED (decode).

### 2.6 4 TRACKS and conjugate (OT19-OT24)

The tab is named '(NOT DONE) 4 TRACKS PROGRAMMING', but its own title cell reads A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING' (three tracks: A3 'STRENGTH', A30 'AESTHETICS', A69 'HYBRID'), and A2 says '*This is what I sell online to my athletes and coach them through it dependent on their goals' (OBSERVED). INFERRED: despite the '(NOT DONE)' tab name, these tracks represent what the coach actually sells.

| Track | Week | Day sequence (slot buckets) |
|---|---|---|
| OT19 STRENGTH-8 'conjugate style training' | Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper | ME lower: 'the work' squat or hinge (alternates weekly) -> 'the accessory' the opposite bilateral (3x6 '2RIR') -> 'the nuance' 'PULL UPS' / 'DB ROWS 8/8' ('MAX') -> 'the survival' unilateral of the **same** dominance ('ALL'). ME upper: heavy press -> row/pull-up -> 'ALT INCLINE DB BENCH' -> 'BICEP CURLS'. DE lower: **plyo is 'the work'** (3x6 'EASY') -> fast squat/deadlift -> pull -> unilateral. DE upper: fast press -> pull -> incline DB. |
| OT20 STRENGTH-12 | same days | ME lower: 'the work' (HIGH BAR SQUAT / RDL A/B) -> 'the accessory' opposite bilateral -> 'the nuance' '3x8' unilateral **opposite** to the work -> 'the survival' '3x8' isolation of the **same** muscle as the work. Upper: press -> pull (V in A weeks, H in B weeks) -> 'TATE PRESS' 3x20 / 'CABLE FLIES' -> 'SIDE RAISES'/'CURLS' / 'JM PRESS'. **No vertical press anywhere.** Week 7 'MID DELOAD'. |
| OT21 AESTHETICS-8 'bodybuilding style' | Mon L, Tue U, **Wed cardio**, Thu L, Fri U, **Sat cardio** | Lower: squat + deadlift (order alternates weekly in weeks 1-6; week 7 repeats deadlift first: K35 'DEADLIFTS' over K37 'BACK SQUATS') -> lunge ladder 'FFE CONTRA' -> 'FFE IPSI' -> 'RFE CONTRA' -> 'RFE IPSI' -> 'RFE' -> 'RFE & FFE' -> 'SL RDL' -> 'ACCESSORIES'. Upper: {DB bench <-> unilateral pulldown} -> {DB OH press or upright rows <-> machine-supported row or DB rows} -> 'ACCESSORIES'. The vertical press is there only in weeks 1, 4 and 5 ('DB OVERHEAD PRESS' / 'OVERHEAD PRESS'); weeks 2, 3, 6 and 7 use 'UPRIGHT ROWS' instead, so those weeks have **no vertical press**. Everything '1-2 RIR'; week 8 'DELOAD WEEK'. |
| OT22 AESTHETICS-12 (PPL x2) | Mon push, Tue legs, Wed pull, Thu push, Fri legs, Sat pull | Push: **side raises first** -> incline/flat bench -> flies -> dips -> 2 triceps. Legs (Tuesday): front squat -> leg press -> deadlift -> lunges -> staggered DL. Friday legs differ: only week 1 has 'DEADLIFTS' (O59); weeks 2-8 replace it with 'Staggered DL' and end with 'LEg Extensions', and weeks 9-12 Friday are 'RFE Lunges (bulgarian)' -> 'Staggered stance unilateral deadlifts' -> 'Leg extension one leg at a time' -> 'leg curls one leg at a time' -> '2 sets LEG PRESS MYO - 15-5-5-5-5-5', so **Friday has no bilateral hinge from week 2 on**. Pull: pulldown -> rows -> 'Pull under' -> face pulls/upright row -> curls. Week 7 'A WEEK LOWER'. Weeks 9-12 add mechanical-drop supersets and '2 sets LEG PRESS MYO - 15-5-5-5-5-5'. |
| OT23 HYBRID 'strenght - athletic - crossfitish training' (5 days) | Mon, Tue, Thu, Fri, Sat; Wed and Sun not listed | Mon: 'STRENGTH' squats -> 'OLY/ POWER' cleans -> 'UNI RDL/ CORE/ UNI GB' -> DB rows. Tue: **'A/C' 'SPEED' sprints first** -> '3x6 - DB bench press/ core' -> 'JUMPS' -> lower accessory. Thu: deadlifts ('KD' sic) -> snatches -> 'LUNGES/ ROWS' tri-set with core -> upper accessory. Fri: **'15-40 min constant cardo easy' first** -> jumps -> 'uni RDL/ core/ OH press' -> lower accessory. Sat: squats ('KD REPS') -> 'UNI KD' circuit, e.g. 'FF & RFE Lunge goblet / T2B/ hand switch pushups' -> 'FB ' 'VEr pull/ hor push'. The 'AMRAP' 12->20 row (D70) is a header at the top of the HYBRID block; tying it to the Saturday circuit is INFERRED. |
| OT24 '(NOT DONE) EXAMPLE CONJUGATE' | as OT19 | Earlier draft of OT19 (A1 'UNDER CONSTRUCTION'). It **does** have a sets/reps ladder: two rows E9:L10 (5,4,3,2,1,3,2,1 and 3,3,2,1,3,2,1,1), which equal rows 5-6 of STRENGTH-8's three-row ladder E4:L6. Differences: 'the accessory' 4 sets (vs 3), Saturday 'the work' 5 sets (vs 3), Wednesday ME press alternates 'HEAVY BENCH PRESS' / 'HEAVY OH PRESS' every week, 60 sets per week (vs 56). |

**v1 notes on 4 TRACKS / conjugate.** 'The work' / 'the accessory' / 'the nuance' / 'the survival' are confirmed (COACH-ANSWER ORD-07); the pulldown-first orders of AESTHETICS-8 (pulldown in pair 1, row in pair 2) and AESTHETICS-12 pull days are not followed - row before pulldown (ORD-01); 'FAST BANDED BENCH PRESS' becomes a fast bench press without bands (EQ-12); the work comes first even when it is the overhead press (ORD-02); HYBRID's Olympic lifts move before strength (ORD-03) and its Saturday knee day takes pulls instead of the push (UNI-11); its Saturday squats are the second squat exposure and become non-axial (PER-04); its Friday easy cardio is a real aerobic block (ORD-09); 'Pull under' = lat pull-over (LIB-09); side raises first only when delts are a priority (ORD-04).

### 2.7 Fragments (OT25)

All OBSERVED:
- **Sheet25** lists a leg day as four headers: 'BILATERAL HIP DOMINANT', 'UNILATERAL KNE DOMINANT', 'LEG FLEXION', 'BILATERAL KNEE DOMINANT'. There is **no unilateral hip-dominant** header. 'LEG FLEXION' as its own bucket is confirmed (COACH-ANSWER CAT-09).
- **'(NOT DONE) RESISTANCE PATTERNS '** lays out knee-dominant rows next to the push patterns and hip-dominant rows next to the pull patterns. That is the opposite of the BYOP day pairing. I treat it as layout only; the coach's pairing rule (UNI-11) confirms the BYOP pairing.
- **'AEROBIC CAPACITY CHEAT SHEET'** says '***Never do the same color workout in the same week ... a total of 3 Aerobic capacity workouts per week'. It also has a 7-drill running warm-up. v1: sessions per week by population (COACH-ANSWER ATH-07).
- **The ballistics tab** has a dynamic medball warm-up.
- **Sheet24** is a half-marathon plan with 2 runs a week. It is credited to someone else: A1 'HALF MARATHON PROGRAM by CHRIS HINSHAW ', A2 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.' It is an adopted external plan, not the coach's own model.

---

## 3. Ordering rules

### 3.1 The master order (v1 tiers)

| Tier | Name | Buckets | Rule | Evidence |
|---|---|---|---|---|
| 0 | WARM-UP | WARMUP_GENERAL, WARMUP_PREP | Always written: 5 min any cardio + A March / A Skip / A Run (lower and athletic days) or mobility such as 'KB Book openers ' (press days). Never counted as volume or toward the exercise cap. | COACH-ANSWER ORD-08; OBSERVED 'Any Cardio Equipment' 1 x '5 Minutes' |
| 0.5 | SKILL (CrossFit / hybrid only) | SKILL | After the core block | OBSERVED class 'WARMUP/SKILL'; position INFERRED from ATH-11 |
| 1 | CORE BLOCK | CT_CORE_THORAX, CP_CORE_PELVIS, CORE_OTHER | About 2 exercises (one thorax, one pelvis; planes rotate across the week). First by default for every client; the user may move it after the plyos, after strength or to the end. | COACH-ANSWER ATH-11 ("we need all the core work to be done first... that'll give you a good warm-up"), VOL-17 |
| 2 | PLYO / BALLISTIC / SPRINT | AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_SPRINT | 2-4 stations for field athletes, together with throws and COD; ballistic vs plyo share by ground-contact time | OBSERVED BYOP 'Plyo'; COACH-ANSWER VOL-08, VOL-17, ATH-01 |
| 3 | THROWS | AP_THROW | Medball ballistics; none for aesthetics except as warm-up | OBSERVED BYOP 'Throwing'; COACH-ANSWER ATH-05 |
| 4 | COD | AP_COD | Every athlete, tiered by turn angle | OBSERVED BYOP 'COD'; COACH-ANSWER ATH-06 |
| 5 | OLYMPIC / POWER | AP_TRIPLE_EXT, COMPLEX | Always before strength | COACH-ANSWER ORD-03; OBSERVED BYOP 'Tripple Extension', BASEBALL 'OLY' before Part C |
| 6 | THE WORK + PAIRED UPPER | RP_BKD / RP_BHD + an upper compound | The day's main lift first, even when it is vertical; each upper compound sits beside the lower pattern of the opposite surface; horizontal before vertical | COACH-ANSWER ORD-02, UNI-11, ORD-01 |
| 7 | SECONDARY PAIRS | RP_UKD / RP_UHD + the other upper vector | Unilateral lower + its opposite-surface upper vector | OBSERVED BYOP slots 3-4; COACH-ANSWER UNI-11 |
| 8 | ISOLATION / FOCUS | ISO_*, FOCUS | Calves 3 sets every leg day, rear delts their own sets; a small muscle goes first only when it is the client's priority | COACH-ANSWER VOL-17, ORD-04 |
| 9 | CONDITIONING | COND_SPRINT_BUYOUT, COND_CIRCUIT, COND_WOD | Buy-out, circuit or WOD last; a fighter's or HYBRID Friday aerobic block may open the day | OBSERVED BASEBALL Part E, class 'WOD'; COACH-ANSWER ORD-09 |

**What changed from v0.** v0 put PREP first and a core primer at tier 3b only for athletic programs, with core otherwise on optional days or as a finisher. The coach marked that NOT RIGHT (ATH-11): core goes first for everyone. v0 kept the pull order per parent workbook; the coach confirmed row first everywhere (ORD-01). v0 left HYBRID's strength-before-OLY as an open question; power goes first (ORD-03).

SCIENCE: whatever is done first in a session gets more reps and better quality (Simão et al. 2012). That supports power first, the work first and a priority muscle first. INFERRED: a tiring core block could take quality away from the maximal jumps, sprints or Olympic lifts that follow it, and the coach uses the first-position core block as a warm-up. So the generator keeps that block submaximal, about 2 sets each and short of failure, and allows harder core work (Tabata, the '50 situps + 50 crunches + 50 reverse crunches' finisher) only when the block is moved to the end (PROPOSED - PENDING COACH APPROVAL).

### 3.2 Verification across every observed template (OBSERVED; v1 status added)

| Template | Followed the v0 order? | Deviation (OBSERVED) | v1 status |
|---|---|---|---|
| OT04 BYOP ATHLETIC (+ JL, NO ACCESS) | 4/4 days | none | core block added first (ATH-11) |
| OT01 BYOP AESTHETICS | 2/4 | A days open with 'Calves' | calves first only if a priority (ORD-04) |
| OT02 3 DAY BUILDER | 2/3 | DAY 1 opens with 'Calves' | as OT01 |
| OT03 BYOP PPL | partly | legs: isolations before 'Unilateral HD'; push: 'Dips' after 'Flies', 'Vertical Push' before 'Incline' | push day re-ordered horizontal before vertical; legs order kept as an allowed lower-only order |
| OT05 BOOTCAMP 1 | 2/4 | Tue/Fri 'Bilateral HD' -> 'Vertical Pull' -> 'Unilateral KD' -> 'Horizontal Push' | **mistake, corrected** (ORD-06) |
| OT06 BOOTCAMP 2 | 2/6 | 2A 'Bicep' between the presses; 3A 'Cardio' third | allowed in circuit format (PRG-03) |
| OT08/OT09 UL, PPL | all | delt isolation interleaved in PPL | interleaving only as a priority / superset choice |
| OT10 FAT BURN | all lifting days | pulldown before row in 8/8 upper days | **row first** (ORD-01) |
| OT11-OT13 athletic | most | S3 core first; M2 snatch after step-ups; contrast pairs | core first is now the rule; Olympic before strength (ORD-03); contrast kept (ATH-12) |
| OT14-OT15 boxing | partial | conditioning first on four day types | real aerobic blocks (ORD-09) |
| OT16 BASEBALL | constant | core (Part B) after the ballistics (Part A) | core moves before Part A by default (ATH-11), movable back |
| OT19-OT24 4 TRACKS / conjugate | constant grammar | HYBRID strength before the Olympic lift; jumps after the bench | **power first** (ORD-03) |

Corroborating counts from the parallel audit (`analysis/equipment/ordering_audit.json`, OBSERVED): athletic before strength BYOP 12/12, BASEBALL 77/92, 4 TRACKS 15/23; power before heavy strength BYOP 12/12, BASEBALL 32/40, 4 TRACKS 0/16 (HYBRID); bilateral before unilateral 225 sessions; compound before isolation 227 sessions.

### 3.3 Rules inside a tier

| Rule | Status |
|---|---|
| Row before pulldown; horizontal before vertical for pulls and pushes | **COACH-ANSWER ORD-01** + coach chat ("row before overhead/vertical pull; horizontal push before vertical push"). Replaces the v0 split by workbook (FAT BURN 0/8, 4 TRACKS 0/38, boxing 0/2 put the pulldown first - OBSERVED, now not followed). |
| 'The work' first, regardless of direction (overhead-press weeks: OH press before the incline bench) | **COACH-ANSWER ORD-02** |
| Power before strength | **COACH-ANSWER ORD-03** |
| Landing / stick before reactive jumping; across a program, receive & pause -> receive then create -> repeated receive/create; more ballistic early, more plyometric later | COACH-ANSWER CAT-10, CAT-11; OBSERVED audit N6 11/13. The coach has not named this progression yet and says it is **not** a "plyo zone". |
| Bilateral jumps before single-leg jumps | WEAK OBSERVED (12/21); single-leg plyos are harder (COACH-ANSWER CAT-10) |
| Speed work in a fixed order: squirrel jumps -> MACH drills / acceleration starts -> max velocity; MACH drills go into the library | COACH-ANSWER LIB-21 (RIGHT); OBSERVED Sheet23 |
| Two plyo stations in one session take one exercise from each MODERATE plyo track (plate hops, hurdles) | COACH-ANSWER LIB-05 (RIGHT); OBSERVED JUSTICE LEAGUE Monday (landing + ankle hops) |
| Never two lower compounds back to back in a full-body session; lower and upper alternate | COACH-ANSWER UNI-11 ("If I do quads and hamstrings, that might bleed over"); OBSERVED audit R8 |
| Squat before hinge on a lower-only day, unless the day is hinge-led | OBSERVED (54 of 84); hinge-led second lower day added by PER-04 |
| Leg extension before leg curl | OBSERVED (12/14) |
| Isolation follows its compound day: quad isolation, biceps and rear delts on knee + pull days; hamstring curl, triceps and side delts on hip + push days | OBSERVED audit N1/N2 (biceps in 79 of 136 pull-only sessions; triceps in 73 of 99 push-only sessions); delt placement INFERRED from the UNI-11 surface logic. BOOTCAMP 2's biceps-on-press-day is kept as observed; the hybrid family puts its one weekly rear-delt station on the hip + push day (HY2) because the knee + pull day is full at 60 min (INFERRED, v1 verification). |

### 3.4 Exceptions

**Kept (each now tied to a coach answer):**
1. **Small muscle first** - only when that muscle is the client's declared priority (COACH-ANSWER ORD-04). OBSERVED cases: 'Calves' first on AESTHETICS A days and 3-DAY D1; side raises / 'Arnold press' first on AESTHETICS-12 push days.
2. **Conditioning first** - a fighter's aerobic block is real aerobic work, not a warm-up (COACH-ANSWER ORD-09); a sprint block can be the day's speed stimulus (OBSERVED boxing, HYBRID Tue).
3. **Contrast and complex stations** - a jump right after the heavy lift that primes it, for L2+ athletes off-season at about 78-85%, with no rest inside the complex (COACH-ANSWER ATH-12). OBSERVED: Starting A17/A18, boxing L22/L46, BASEBALL Block 2 Part C, 'ALL ABOUT SQUATS' 'FRENCH CONTRAST'.
4. **Core block moved** - after the plyos, after strength or to the end, at the user's choice (COACH-ANSWER ATH-11).
5. **Cardio mid-session** - inside bootcamp circuits (OBSERVED BOOTCAMP 2 3A; COACH-ANSWER PRG-03).

**Retired:**
- core primer only in athletic programs (v0 tier 3b) -> core first for everyone (ATH-11);
- core only on optional days for hypertrophy -> core first on every main day (ATH-11);
- pulldown first in FAT BURN / 4 TRACKS-derived sessions -> row first (ORD-01);
- HYBRID strength before the Olympic lift -> power first (ORD-03);
- calves first on every aesthetics A day -> only when calves are a priority (ORD-04);
- interleaved delt isolation by default -> only as a priority or superset choice.

### 3.5 Generator ordering rule (v1)

1. Warm-up (always, ORD-08).
2. Core block (default first, ATH-11; honour the user's chosen position).
3. Skill (hybrid only), then athletic tiers 2-4 in order (sprint work as squirrel jumps -> MACH / acceleration -> max velocity, LIB-21).
4. Olympic / power (ORD-03).
5. The work + its paired upper lift (ORD-02, UNI-11), then the secondary pair; horizontal before vertical inside each vector (ORD-01).
6. Isolation and Focus; a small muscle moves to the front of the resistance block only when it is the client's priority (ORD-04).
7. Conditioning last, except a fighter / hybrid aerobic block or a sprint block that opens the day (ORD-09).

---

## 4. Pairing rules

### 4.1 The coach's rule (COACH-ANSWER UNI-11, ORD-06)

**In any session that mixes lower and upper work, a hip-dominant pattern (the back of the lower body) goes with a push (the front of the upper body), and a knee-dominant pattern goes with a pull.** In the coach's words: "If I'm doing the back of my lower body, then the opposite would be the front of my upper body. That'll allow me to keep as far away as I can from bleeding over problems... You can do a lot of work throughout the week and more volume throughout your program." (UNI-11). And: "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06).

What this means for the generator:
- The rule is **slot level**. Each upper compound carries a `pair` label with the lower pattern it belongs to (P1, P2, P3), and every generated template is checked against it (JSON `checks.per_day.pairing_flags`; all empty).
- It holds for full body, bootcamp, athletic, strength compressions and hybrid days. It does not apply to upper/lower or push/pull/legs splits, which do not mix lower and upper work in one session.
- The **vertical vector is no longer a free choice.** It follows the lower pattern it is paired with. v0's V_SAME / V_CROSS / V_ROTATE options become consequences of the lower pairing mode (4.2).
- v0 counted the rule at day level ("20 of 23 template-days"). That count is now only evidence that the coach already did this most of the time (OBSERVED): BASEBALL 92/92, BYOP aesthetics/athletic 100%, BOOTCAMP 2 6/6. The deviations are now either corrected mistakes (BOOTCAMP 1 Tue/Fri, ORD-06) or re-wired by the rule: HYBRID Saturday's push moves to Tuesday/Friday, the MM jump/medball vertical vectors swap, and the STRENGTH-8 lower-day pull is reconsidered (INFERRED, 6.14).

### 4.2 Same pattern vs cross pattern is a rule by goal (COACH-ANSWER UNI-06)

| Mode | What | Use for | Evidence |
|---|---|---|---|
| **Same pattern** | Bilateral and unilateral of the same dominance on one day (squat + lunge; hinge + single-leg hinge). The knee day then carries both pulls and the hip day both pushes. | Physique / bodybuilding, powerlifting / strength, and high-level athletes who demand more of their muscles to grow: "If they are a high-level athlete and they're demanding more of their muscles... I have to make sure I drive a lot harder into that muscle" | COACH-ANSWER UNI-06; OBSERVED BYOP aesthetics/athletic, STRENGTH-8 survival |
| **Cross pattern** | Bilateral of one dominance + unilateral of the other (squat + single-leg hinge). The day carries one pull (with the knee lift) and one push (with the hip lift). | Bootcamp, fat loss, general fitness, athletes by default, in season, 2-3-day plans: "I don't want them to get too sore so they can do the bootcamp more often" | COACH-ANSWER UNI-06; OBSERVED BOOTCAMP 1 A days, BASEBALL, STRENGTH-12 nuance, HYBRID Monday |
| **All four** | Lower-only days with all four lower patterns | Upper/lower and push/pull/legs | OBSERVED OT08, OT09, OT21, OT22 |

Change from v0: v0's default gave athletes the BYOP same-pattern grammar for 4-6 days. The coach confirmed that athletes pair squat + single-leg RDL (UNI-06), so the v1 athletic default is cross pattern. The same-pattern athletic grammar stays as a variant for high-level athletes who need more stimulus to grow (the coach's own trigger, UNI-06) and for athletes whose goal is size off-season (INFERRED: the "more resistance" group of ATH-03 - linemen, wrestlers, rugby, heavyweights, throwers; open question 11.2-10).

### 4.3 Observed evidence (kept from v0, OBSERVED)

| Template-day | Bilateral | Unilateral | Relation |
|---|---|---|---|
| OT01 / OT04 / OT07 A and B days; OT02 D1 and D2 | BKD / BHD | UKD / UHD | SAME |
| OT05 BOOTCAMP 1 A / B; OT06 1A | BKD / BHD | UHD / UKD | OPPOSITE |
| OT16 BASEBALL (every labelled week) | 'bkd' / 'bhd' | 'uhd' / 'ukd' | OPPOSITE (audit N3: BKD+UHD 44, BHD+UKD 46) |
| OT20 STRENGTH-12 lower days | work + opposite accessory | 'the nuance' opposite to the work | OPPOSITE |
| OT23 HYBRID Mon / Thu | BKD / BHD | 'UNI HD' / 'UNI KD' | OPPOSITE |
| OT19/OT24 STRENGTH-8 lower days | work + opposite accessory | 'the survival' same as the work | SAME |
| OT11 Starting S1 / S2; OT12 M3, OT13 A1 | BKD / BHD | UKD / UHD | SAME |
| OT08, OT09, OT10, OT14, OT21; OT22 Tuesday | BKD + BHD | UKD + UHD | all four |
| OT22 AESTHETICS-12 Friday (weeks 2-12) | BKD only | UKD + UHD | no bilateral hinge |

Upper vector with the lower pattern, day level (OBSERVED, v0 count): knee + horizontal pull in 11 template-days, hip + horizontal push in 9, 3 exceptions (HYBRID Thursday, HYBRID Saturday, STRENGTH-8). Audit R9: 160 of 193 sessions overall. Audit N18: in BYOP the bilateral lift sits next to the horizontal vector 29 times vs 2, and the unilateral lift next to the vertical vector 24 times vs 2.

### 4.4 Day grammars (v1)

| ID | Grammar | Observed in | v1 status |
|---|---|---|---|
| G1 SAME_PATTERN | A = [BKD \| HPULL] + [UKD \| VPULL] (+ quad, biceps, rear delt, calves); B = [BHD \| HPUSH] + [UHD \| VPUSH] (+ leg curl, triceps, side delt, calves) | OT01, OT02 D1-D2, OT04, OT07 | OBSERVED; consistent with UNI-11 |
| G2 CROSS_PATTERN | A = [BKD \| HPULL] + [UHD \| VPUSH]; B = [BHD \| HPUSH] + [UKD \| VPULL] | OT05 A days; OT06 over 3 sessions | A days OBSERVED; **B days corrected** (the sheet's B = BHD + VPULL + UKD + HPUSH was a mistake, COACH-ANSWER ORD-06) |
| G3 BASEBALL_PARTS | Mon [BKD \| HPULL] / UHD + biceps + calves; Tue [BHD \| HPUSH] / UKD + triceps + shoulders; Thu [BKD \| VPULL]; Fri [BHD \| VPUSH] | OT16 | OBSERVED; consistent with UNI-11; core (Part B) first by ATH-11 |
| G4 UPPER_LOWER | Lower 1 squat-led (axial squat, non-axial hinge); Lower 2 hinge-led (axial hinge, leg press); Upper: H pull -> H push -> V pull -> V push + arms + side and rear delts | OT08, OT10, OT14, OT21 | OBSERVED + PER-04, ORD-01, VOL-17 |
| G5 PPL | push / pull / legs; Legs 1 squat-led, Legs 2 hinge-led; weekdays flexible | OT03, OT09, OT22 | OBSERVED + PRG-02, PER-04 |
| G6 CONJUGATE_4ROLE | ME lower / ME upper / DE lower / DE upper: 'the work' -> 'the nuance' paired with the work -> 'the accessory' -> 'the survival' | OT19, OT20, OT24 | roles COACH-ANSWER ORD-07; nuance position and vector INFERRED from UNI-11, PENDING (6.14) |
| G7 QUALITY_DAY | CrossFit: knee + snatch / pull + clean / hip + snatch / push + clean | OT17, OT18 | OBSERVED (single-region strength days) |
| G8 ATHLETIC_THEMED | jump day = hip + pushes; medball day = knee + pulls | OT12 M1/M3/M4, OT13 A2 | **re-wired**: the observed days put the vertical pull on the jump/hip day and the vertical press on the medball/knee day; the generator swaps them (UNI-11) |

### 4.5 Laterality dial (COACH-ANSWER UNI-02, UNI-03, UNI-08, UNI-10, CAT-13)

Each lower (and upper) compound slot names a dominance. Its laterality - bilateral or unilateral - is set so that the week's bilateral:unilateral share of sets matches the client's dial. The dial runs from 90/10 to 10/90 (UNI-02). The coach's logic: unilateral work is the health and rotational foundation; bilateral work is the driving force for size and strength.

| Population | Share (bilateral : unilateral) | Evidence |
|---|---|---|
| Bodybuilders / powerlifters | about 50/50 at the start, moving to 80/20 - 90/10. Contralateral / ipsilateral work is a health accessory, mostly in the first 2-4 weeks, kept later only if something bothers them. | COACH-ANSWER UNI-02, CAT-13 |
| Field / COD athletes (tennis, soccer, basketball, football skill positions) | 10/90 - 20/80 | COACH-ANSWER UNI-02, UNI-03 |
| Athletes in season | minimal bilateral | COACH-ANSWER UNI-10 |
| Pain or injury | adjusted case by case; a painful bilateral lift swapped for a unilateral one keeps its sets "ideally" | COACH-ANSWER UNI-02, UNI-08 |
| Upper body | same logic | COACH-ANSWER UNI-03 |

**Contralateral vs ipsilateral** (COACH-ANSWER CAT-13): contralateral load pulls the athlete *into* the hip (change-of-direction athletes: football, soccer, basketball, tennis); ipsilateral load helps *out of* the hip (sprint acceleration, for example ipsilateral step-ups). The unilateral stations carry a `loading` note for this.

**Slot conversion** (PROPOSED - PENDING COACH APPROVAL): convert bilateral stations to unilateral stations of the same dominance, starting with the second weekly exposure, until the weekly share matches the dial. Keep at least one bilateral exposure a week off-season unless pain or the season says otherwise. The set math lives in `12_volume_algorithm_v1`.

### 4.6 Generator pairing rule (v1)

| Situation | Grammar |
|---|---|
| Physique / bodybuilding, 3-6 days | G1 same pattern |
| Physique, 2 days | complete sessions: same-pattern lead pair + the other bilateral (non-axial) paired with its opposite-surface vector |
| Bootcamp, fat loss, general fitness, no-equipment | G2 cross pattern (gym straight sets or timed circuits) |
| Athletes (default) | G2 cross pattern with the athletic layout |
| High-level athletes who need more stimulus to grow (UNI-06); size-focused athletes off-season (INFERRED, ATH-03) | G1 same-pattern variant |
| In-sport Parts week | G3 |
| In season | 2-day cross pattern, minimal bilateral |
| Upper/lower or PPL requested | G4 / G5 |
| Strength | G6 |
| CrossFit | G7 + cross-pattern accessories |

---

## 5. Supersets, contrast, complexes and circuits

### 5.1 The coach's rule (COACH-ANSWER ORD-05)

"The supersetting is more like a fatiguing principle... It's a tool to use to fatigue the heart more and compress the time." Four use cases:

| Use case | Who | Generator trigger |
|---|---|---|
| Short session | anyone | session minutes below the length the station list needs (templates mark this with `superset_below_minutes`) |
| More stimulus | advanced (L3) athletes and lifters who no longer fatigue enough | level L3 + client preference |
| Aerobic capacity | athletes in the off-season working on VO2max and mitochondrial capacity | athletic family + off-season phase |
| Beginners who do not fatigue | L1 clients who are not getting fatigued by straight sets and enjoy it | level L1 + client preference |

INFERRED from the four cases: an intermediate (L2) with enough time trains straight sets by default.

**What to pair:** the UNI-11 pairs (knee lift + pull, hip lift + push) and isolation pairs (biceps + rear delts, triceps + side delts, calves + delts). **Never** two lower compounds, and never a heavy lift with a fatiguing lift for the same muscle - except the contrast complexes below. Athletic families may use the BASEBALL grammar (Part C = bilateral lower + one upper compound 'Superset - same reps'; Part D = unilateral + two isolations). Hybrid sessions do the paired accessory in the strength lift's rest period (OBSERVED HYBRID '3x6 - DB bench press/ core').

**Time-overflow rule** (PROPOSED - PENDING COACH APPROVAL): sets are added week by week (VOL-07). When that pushes a session past its length, the generator first supersets the lower/upper pairs (the coach's short-time use case), then applies the cut order (7.6).

### 5.2 Contrast and complexes (COACH-ANSWER ATH-12)

Contrast / French contrast is for L2+ athletes, off-season only, with the heavy lift at about 78-85% and no rest inside the complex. This closes v0 question 23: the coach's 'directly into' / 'immediately into' format stays as written. SCIENCE: the post-activation literature favours several minutes of rest before the explosive set (Seitz & Haff 2016); immediate-transition French contrast is an established coaching method, so this is a known method and not an error.

### 5.3 Bootcamp circuits (COACH-ANSWER PRG-03)

"We just have to make sure we keep those time circuits: 3 to 5 rounds, 30 to 50 seconds in each station... probably around 5 to 7 stations... anywhere from a 35-minute to a 45-minute workout total."

| Item | Value | Evidence |
|---|---|---|
| Sessions per week | 4, 5 or 6 (also 2-3 for fat-loss clients) | PRG-03 |
| Stations | 5-7, order by UNI-11 pairs: [squat \| row], [single-leg hinge \| press] or [hinge \| push], [single-leg squat \| pull], then a metabolic station, calves, an arm or delt station | PRG-03, UNI-11, VOL-17 |
| Dose | 3-5 rounds x 30-50 s per station | PRG-03; OBSERVED FAT BURN progression 3 x 30 s -> 4 x 35 -> 4 x 40 -> 5 x 50 |
| Session | 35-45 min including the 5-min warm-up and the core block | PRG-03, ORD-08, ATH-11 |
| Time check | 7 stations fit at 4 x 50 s (about 43 min); 6 stations at 5 x 45 s (about 44 min) | INFERRED time model |

### 5.4 Observed vocabulary (OBSERVED, kept from v0)

| Type | Verbatim evidence | Use |
|---|---|---|
| Superset flag | 'SUPERSET W/ 👇' (BYOP SETS option AV16) | Never used in a filled cell; the v1 output uses it to mark a pair |
| Non-competing pair (lower + upper) | BASEBALL Part C 'Superset - same reps' (19x), 'Superset - max reps' (5x), 'heavy Max reps' (6x, Thursday vertical pull), 'PART C 4x', 'SUPER SET 4X', '3x super set' | Bilateral lower + upper compound share the set count |
| Tri-set: unilateral + 2 isolations | BASEBALL Part D ('uhd'+'bicep'+'calfs'; 'ukd'+'tricep'+'shoulders') | Sets inherited from row 1 |
| Tri-set: unilateral + core + upper | HYBRID 'UNI RDL/ CORE/ UNI GB', 'FE contra/ DB rows/core', 'uni RDL/ core/ OH press' | v1: core moves to the core block; the pair stays |
| Strength + core | HYBRID '3x6 - DB bench press/ core' | Core in the rest period |
| Contrast pair | 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' ('3+10'); the ipsilateral FFE lunge into lunge jumps; BASEBALL 'Heavy front squats' + 'KB squat cleans', 'Barbell deadlift' + 'Broad jumps' | Heavy lift, then an explosive version of the same pattern |
| French contrast | 'ALL ABOUT SQUATS' I18 '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps' (filed 'OFF SEASON'); boxing '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps', '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' | Heavy -> max jump -> loaded jump -> fastest. v1: the banded member is out (EQ-12); substitute an unloaded or assisted-free fast jump |
| n-of-each complex | BASEBALL 'front squats/high jumps/hex bar squat jumps/ banded assisted hops' 5 x '5 of each' | Rounds = sets (banded member out, EQ-12) |
| Plyo into eccentric | 'Lateral mid size box step up jumps directly into nordic curls' | |
| Strength + conditioning | 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' | Rope in the rest period |
| Isolation pair | 'Heavy curls & Heavy tricep kickbakcs', 'Superset: leg ext. leg curls (MID WEIGHT)', 'Slider Runners + Slider Hamstring Runners' | Finisher |
| Isolation + core | 'DB side raises + Copenhagen plank :50 sec each side', 'SUPERSET: Dead bugs + Front Raises + Side Raises', 'Plate core & leg extensions' | v1: core moves to the block unless the user keeps it here |
| Mechanical-drop superset | 'front squats + Superset with 15 squats with no weight every set'; 'bench press + superset with max pushup set'; 'incline bench press + superset with a set of max bench dips...' | AESTHETICS-12 weeks 9-12 |
| Myo set | 'MYO SET' (15 + 5x5 with 3 s pauses); '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; 'ALL ABOUT SQUATS' A27 '**MYO SET - ADVANCED' | Last exercise, machine or isolation (COACH-ANSWER VOL-15); advanced free-weight squat exception OBSERVED |
| Pyramid + drop | '12/10/8 -20' | 12 mid, 10 heavier, 8 heaviest, then a light 20 (COACH-ANSWER PRG-07) |
| Timed circuit | FAT BURN 4 stations, 3-5 rounds x 30-50 s | Finisher (COACH-ANSWER PRG-11); bootcamp sessions (PRG-03) |
| AMRAP / 40-rep sets | HYBRID 'AMRAP' 12 -> 20 | CrossFit / hybrid styles only (COACH-ANSWER VOL-11) |
| Tabata | '20 on/ 10 off - TABATA TIMER - Flutter kicks & Hip Turns' | Core interval (end-position core only, PROPOSED) |

SCIENCE: non-competing (agonist-antagonist or upper/lower) pairing keeps volume load while cutting session time (Robbins et al. 2010; Weakley et al. 2017; Iversen et al. 2021). Weakley et al. (2017) also report higher perceived intensity and physiological load per minute for supersets and tri-sets than for traditional sets, which fits the coach's "fatiguing principle".

---

## 6. Across the week

### 6.1 Vector rotation

v1 rule: every upper vector appears at least once a week. Same-pattern weeks give each vector 2x (knee days both pulls, hip days both pushes); cross-pattern A/B weeks give each vector 2x across A and B. Boxers keep pressing and pull-ups at reduced volume when punching volume is high (COACH-ANSWER ATH-04), replacing v0's OBSERVED "H push and V pull removed after week 2" as a rule. The vertical press for physique and fat-loss clients is still an open question (11.1, question 24): FAT BURN weeks 2-3 and AESTHETICS-8 weeks 2, 3, 6, 7 use upright rows or side raises in that slot (OBSERVED).

OBSERVED per template (kept from v0):

| Template | Mon | Tue | Thu | Fri | Option |
|---|---|---|---|---|---|
| OT01 / OT04 | H pull + V pull | H push + V push | = Mon | = Tue | same pattern |
| OT05 | H pull + V push | V pull + H push (mistake, ORD-06) | = Mon | = Tue | cross (corrected) |
| OT16 | H pull | H push | V pull | V push | rotate |
| OT08 UL | all four vectors on every upper day | | | | all four |
| OT10 FAT BURN | H push, V pull, H pull every upper day; vertical press only WK1 and WK4 Tuesday | | | | three vectors + delt slot |
| OT21 AESTHETICS-8 | pair 1 H push <-> V pull; pair 2 V push or upright row <-> H pull (vertical press weeks 1, 4, 5 only) | | | | crossed pairs |
| OT19 / OT20 | the press rotates bench / high incline / OH press (ME) and fast bench / fast DB OH press / push press (DE); pulls alternate H/V | | | | A/B weeks |
| OT15 boxing weeks 3-8 | only H pull + V push | | | | v1: reduce, never cut (ATH-04) |

### 6.2 Frequency invariant

| Status | Rule |
|---|---|
| OBSERVED in OT01, OT04, OT05, OT06, OT16; INFERRED as a rule | With 4 or more resistance days, every lower pattern at least 2x a week, push at least 2x, pull at least 2x, each upper vector at least 1x. With 2-3 days, every primary pattern at least 1x. |
| v1 addition (COACH-ANSWER PER-04) | The two weekly exposures of a squat or hinge pattern differ: one axial, one non-axial (6.4). |
| Documented exemptions | Conjugate strength (two lower days, each pattern 1-2x - OBSERVED design); CrossFit class and competitor (one strength pattern per day; WODs carry the rest - INFERRED); strength 3-day H/V rotation by A/B week (OBSERVED); in season minimal bilateral (COACH-ANSWER UNI-10). |

`05_templates.json` runs the check on every v1 template; results are in 8.7. SCIENCE: training each muscle at least twice a week is modestly better than once for hypertrophy (Schoenfeld et al. 2016); with weekly volume equated, frequency matters little (Schoenfeld, Grgic & Krieger 2019).

### 6.3 Variation between the two weekly exposures (COACH-ANSWER PER-04, PER-02, PER-03)

- **Rule.** The second weekly exposure of a slot uses a different exercise from the same category (PER-04, RIGHT), and for squats and hinges the non-axial one (6.4).
- **Blocks.** Exercises stay fixed for a 4-6-week block; between blocks change one or two small variables (grip, stance, implement, range of motion, rep range), never all at once (PER-02, RIGHT).
- **A/B lead-lift weeks** (squat-led / hinge-led; bench / overhead) are optional, for clients who want variety (PER-03).
- **Client choice.** Every slot gets a default exercise plus a dropdown of swaps within the category (GEN-04); the client's preference can choose between alternatives (EQ-10).
- **OBSERVED examples:** JUSTICE LEAGUE (now 'Athletic Performance - Non-Competitive') Monday 'Front Squats' (AI46), Thursday 'Low Bar Back Squat' (AI50) - two axial squats, which the generator no longer reproduces (Thursday becomes leg press / belt squat); Monday 'Medium Depth Drop', Tuesday 'SL Depth Drops'; BASEBALL speed variant one day, strength variant the other; FAT BURN leg press <-> deadlift swap each week; in-season BASEBALL re-uses earlier menus.

### 6.4 Axial loading once a week (COACH-ANSWER PER-04)

"I ideally don't want... to have them squat twice a week... I can do one day of squatting and the other day of leg pressing. I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well." (PER-04)

| Item | Rule | Evidence |
|---|---|---|
| Budget | one axial squat exposure + one axial hinge exposure a week | COACH-ANSWER PER-04 |
| Axial lifts | barbell back / front / high-bar / low-bar / zercher / overhead / Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings | INFERRED list |
| Second squat exposure | leg press or belt squat ("Belt squats are for people that you don't need to load them axially") | COACH-ANSWER PER-04, EQ-11 |
| Hack squat / pendulum | constrained machines the client may prefer (machines are not ranked) but they load the spine through shoulder pads, so they stay out of the non-axial pool until the coach confirms | COACH-ANSWER EQ-11; classification INFERRED, open question |
| Second hinge exposure | non-axial: hip thrust (bar on the hips or machine), glute bridge, 45-degree back extension, reverse hyper, GHD hip extension, cable pull-through, KB swing as a ballistic hinge | PROPOSED - PENDING COACH APPROVAL |
| Soreness switch | an athlete already loaded on the back that week, or sore, switches to the belt squat | COACH-ANSWER EQ-11 |
| Older / injured / high-volume | constrained machines; never overhead squat, snatch, low-bar squat or depth jumps | COACH-ANSWER EQ-03 |
| Spacing in 4-6 day plans | axial squat Monday (A1), axial hinge Friday (B2), 4 days apart; Tuesday (B1) non-axial hinge, Thursday (A2) leg press. Alternative: axial hinge Tuesday. | PROPOSED - PENDING COACH APPROVAL |
| Check | every v1 template counts its axial exposures; all are at most 1 squat + 1 hinge (8.7) | recomputed |

Still open: whether Olympic lifts, loaded jumps, light front-loaded bootcamp squats and shoulder-pad machines count toward the budget, and whether powerlifters are an exception (11.2).

### 6.5 Week skeletons and day spacing

- **A1 / B1 / OPT / A2 / B2 / OPT / OFF** (OBSERVED shape: BYOP, BASEBALL, BOOTCAMP 1, FAT BURN, AESTHETICS-8). In v1, A1 and A2 (and B1 and B2) are the same day type with different exercises: one is the axial exposure, the other the non-axial one (PER-04).
- **Consecutive days alternate lower dominance** (knee day, then hip day) in BYOP, BASEBALL, CrossFit and boxing (OBSERVED). HYBRID breaks it (Thursday deadlifts, Friday single-leg RDL).
- **Strength ME/DE:** Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper (OBSERVED); same-region sessions 72 h apart.
- **PPL:** push / pull / legs (BYOP) or push / legs / pull (AESTHETICS-12); weekdays flexible (COACH-ANSWER PRG-02).
- **Bootcamp:** 4, 5 or 6 sessions a week (PRG-03). 4 = A, B, aerobic, A, B, aerobic; 5 = rolling A/B (A-B-A-B-A, next week B-A-B-A-B) (PROPOSED); 6 = Bootcamp 1-2-3, 1-2-3 (OBSERVED BOOTCAMP 2 order).
- **In season:** 2 days a week, low volume (COACH-ANSWER PER-08).
- **CrossFit:** Mon knee, Tue pull, Thu hip, Fri push; aerobic and WOD days by the month grid (OBSERVED).

### 6.6 Optional days and Focus slots (COACH-ANSWER ORD-10, ORD-11)

- **OBSERVED block:** 'Calves', 'Cardio' / 'Aerobic Capacity', 'Core', 'Focus 1', 'Focus 2' (BYOP 'Optional', FCE5CD), on Wednesday and Saturday; the NO ACCESS athletic title '... 4 to 6 DAYS A WEEK' makes the optional days explicit.
- **Separate or add-on:** "Both. You can throw them in as add-ons, or you can do them on separate days. Ideally, separate days, so they don't get in the way." (ORD-10). The generator defaults to separate days and offers add-on mode.
- **v1 content:** warm-up -> core -> Focus 1 -> Focus 2 -> calves (only if they are a priority; main leg days already carry 3 sets, VOL-17) -> one aerobic session.
- **Focus slots:** both may hit the same muscle, 2-3 sets each, to bring a priority muscle up to its weekly target (ORD-11, RIGHT). They are also where the VOL-07 small-muscle bonus exercise goes when it does not fit the main day (PROPOSED placement).
- **Generator's own restriction** (INFERRED, unchanged): no heavy bilateral lift in an optional block, even though the coach's Focus menu offers 'Back squats' AZ12, 'Zercher squats' AZ11, 'Leg press' AZ10 and 'barbell overhead press' AZ46 (OBSERVED). This now also protects the axial budget (PER-04).

### 6.7 Conditioning days (COACH-ANSWER ATH-07, ORD-09, ORD-10, EQ-14)

| Population | Aerobic sessions per week | Evidence |
|---|---|---|
| General / fat loss | 3 | COACH-ANSWER ATH-07 |
| Athletes in season | 2 | COACH-ANSWER ATH-07 |
| Aesthetics / bodybuilders | 4 + long walks after workouts | COACH-ANSWER ATH-07 |
| Athletes off-season | 2 | OBSERVED BYOP 'Aerobic Capacity' x2; PROPOSED default |
| Powerlifters | 2 | PROPOSED |
| CrossFit | by the month grid (2-4 by aerobic level) | OBSERVED OT17 |

Placement: separate days first, then add-ons after lifting (ORD-10). Each JSON template carries `aerobic_ATH07`: the sessions its week layout already holds (an optional day counts 1) and the add-ons still needed for the population (v1 verification; for example aesthetics 5-day holds 1, fat-loss 6-day and PPL x2 hold 0). Never the same cheat-sheet colour twice in a week ('***Never do the same color workout in the same week', OBSERVED); a 4th aesthetics session is an open question (11.2). Any erg works (bike, rower, ski); track time, calories or distance and watch the week-to-week change (EQ-14). A fighter's aerobic block that opens the day is real aerobic work (ORD-09). OBSERVED placements kept from v0: BYOP 'Cardio' on the Wed/Sat optional blocks and inside every BOOTCAMP 2 session; UL/PPL '... WEDNESDAYS & SATURDAYS max 40 min of steady'; FAT BURN and AESTHETICS-8 Wed/Sat '30-40 mi slow/steady CARDIO'; boxing and HYBRID conditioning first; BASEBALL buy-outs only.

### 6.8 OFF days (OBSERVED)

- Sunday 'OFF' (F4CCCC) in 7 of the 9 BYOP program tabs (PPL, ATHLETIC, JUSTICE LEAGUE, BOOTCAMP 1 and 2, both NO ACCESS tabs). 'AESTHETICS - FULL BODY - 4 DAYS' and '3 DAY BUILDER' have no weekday labels and no 'OFF' row.
- CrossFit: Wednesday and Sunday 'OFF' every month. HYBRID: Wednesday and Sunday empty. STRENGTH tracks: Tuesday, Friday and Sunday empty. BASEBALL and boxing: Wednesday, Saturday and Sunday empty (sport, INFERRED).

**Rule (INFERRED, unchanged).** At least one full OFF day a week (Sunday).

### 6.9 'Buy out' finishers (OBSERVED in BASEBALL)

- **What it is:** Part E (FFF2CC), 1-3 short maximal bouts ('2x 15 cal bike sprint', '3x 10 cal row sprint or ski', '1x 30 Sec Fast Run', '1 X 12 Cal' bike/SkiErg/row).
- **Weekly dose:** 0-5 bouts a week, block means 3.3 / 3.3 / 3.8 over loaded weeks, filled on 2-4 of the 4 days (recounted in v0).
- **Not a buy-out:** 'Fast run/ walk back or 3 min walk/rest - This is NOT a sprint' is a Part A sprint.
- **Rule.** Athletic sessions of 75+ min may end with 1-3 bouts on 2-4 days a week; none in deload weeks (COACH-ANSWER PER-05: no buy-out or finisher in a deload). Whether every 60+ min athletic session should carry one is still open (question 11).

### 6.10 Core placement (COACH-ANSWER ATH-11, VOL-17, CAT-08)

**Rule.** Every session of every family opens with the core block right after the warm-up: "Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff... Some athletes like to do it at the end, so that's why I want them to be able to move it around." (ATH-11). About 2 core exercises (VOL-17).

- **Content:** one thorax exercise (trunk moves on a still pelvis) and one pelvis exercise (pelvis/legs move on a still trunk) (CAT-08); planes rotate through the week (OBSERVED BASEBALL: frontal Monday, transverse Tuesday/Friday, sagittal Thursday); more rotational core for athletes who need it (VOL-17).
- **Dose when first** (PROPOSED - PENDING COACH APPROVAL): submaximal, about 2 sets each, short of failure. Harder core only when the block is moved to the end.
- **Short sessions:** 1 core exercise at 30 min (INFERRED).
- **OBSERVED placements (v0, now superseded as defaults):** BYOP aesthetics/bootcamp - optional days only; MM UL/PPL - none; FAT BURN - circuits; MM athletic - primer + paired + finisher; BASEBALL - Part B after the ballistics; HYBRID - inside tri-sets; CrossFit - 'SKILL' 'T2B/ DUBS'.

### 6.11 Warm-ups (COACH-ANSWER ORD-08)

Always written: 5 min any cardio + pattern prep. Pattern prep = 'A March' / 'A Skip' / 'A Run' on lower and athletic days, mobility such as 'KB Book openers ' 1 x '8/8' before pressing, the 7-drill running warm-up before sprint work, the dynamic medball warm-up (the only medball use for aesthetics clients, ATH-05), 'WARMUP/SKILL' in CrossFit classes (all OBSERVED). Warm-up items never count toward volume or toward the exercise cap.

### 6.12 Deload, test weeks and plan shapes (COACH-ANSWER PER-01, PER-05, PER-07; details in 06)

- **Deload** (PER-05, RIGHT): same exercises and architecture, about half the sets, lighter load or 3+ RIR, no buy-out or finisher. A recovery week (BASEBALL Block 1 'wk 8': arm care + easy cardio, OBSERVED) is a separate option.
- **Tests** (PER-07): chosen by checkbox at the start of the block (strength, cardio, speed) or "no need for testing". When chosen, the final week holds a test day in place of one session.
- **Plan shapes** (PER-01, NOT RIGHT to v0): 4-6-week blocks are maintenance or transition (vacation, travel, season change, moving) at about 50-70% volume on the same templates; 8-week = 4 weeks adapting + 4 weeks driving hard, starting hard; 12-week (preferred) = 2-4 weeks acclimation, 4-6 weeks driving hard, hardest last weeks; repeated 12-week cycles start one level higher; an open week-by-week mode; a yearly mode with quarter themes and holiday weeks in maintenance. The v0 rules "8 = 7 + deload/test" and "12 = 6 + deload + 5" are retired as defaults; the OBSERVED tab endings stay as evidence (AESTHETICS-8 'DELOAD WEEK', STRENGTH-8 'TEST'/'DELOAD', STRENGTH-12 'MID DELOAD', BASEBALL Block 2 'DELOAD WEEK', HYBRID and Block 3 without one).

### 6.13 Set addition (COACH-ANSWER VOL-07, VOL-05, VOL-06)

- **Exercises per muscle:** "Usually, I have about 3 to 4 exercises per muscle group per day." The v0 cap "at most 2 exercises per muscle per session" is retired.
- **Order:** when a muscle needs one more set, it goes to the first exercise for that muscle in session order; the next added set goes to the second, then the third, then back to the first: **2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3**. Equivalent rule: the exercise with the fewest sets, earliest first. "I'm adding sets to the things that matter most... usually in the beginning... because I put all my energy into it."
- **Small muscles at the end:** a small muscle trained after the big ones (biceps after rows, pull-overs and pulldowns) gets extra volume as a **bonus exercise**, not more sets on a fatigued finisher (VOL-07). Placement: Focus slot or the next session where the muscle is fresh (PROPOSED).
- **Rate:** 3, 5 or 7% of the muscle's weekly sets per week, chosen by the person's state (fatigue, life, response) and adjustable by the coach - **not** by muscle size (VOL-05); 10% a week is too much (UNI-05). Fractions are banked until they make a whole set (VOL-06). The percentage engine lives in `12_volume_algorithm_v1`.
- **Two sessions of the same day type** (A1 Monday, A2 Thursday): added sets alternate between them so the week stays even (PROPOSED; open question 11.2).

Pseudo-code:

```
def add_set(day, muscle):
    ex = [e for e in day.exercises if e.primary_muscle == muscle]
    target = min(ex, key=lambda e: (e.sets, e.position))   # fewest sets, earliest first
    target.sets += 1
```

### 6.14 The work / the accessory / the nuance / the survival (COACH-ANSWER ORD-07)

| Role | Meaning | Effort |
|---|---|---|
| The work | the main lift, first in the session (ORD-02) | 1 RIR |
| The accessory | a supporting lift | 2 RIR |
| The nuance | weak-point, unilateral or variation work | MAX |
| The survival | isolation or joint-health work, done no matter what | - |

- **Use:** the backbone of strength plans; strength day types use these roles. Other families map onto them (PROPOSED): work = the work; paired upper and secondary lifts = accessory; Focus and unilateral weak-point work = nuance; calves, rear delts and joint-health isolation = survival.
- **Consequence for the cut order:** because the survival is done no matter what, a short strength session cuts the nuance first and then the accessory, and keeps the work and the survival (v0 cut the survival first).
- **Pairing inside strength days (INFERRED application of UNI-11, PENDING):** the OBSERVED STRENGTH-8 lower day puts a pull ('PULL UPS' / 'DB ROWS 8/8' MAX) after the hinge accessory every week. In v1 the nuance pairs with the work lift and sits right after it: a pull in squat-led weeks (as observed), a push in hinge-led weeks. The dynamic-effort speed lift is the week's only axial exposure of its pattern, and the max-effort accessory of the other pattern is non-axial (PER-04).

---

## 7. Session budget and session length

### 7.1 Session length by population (COACH-ANSWER UNI-09, PRG-03)

| Population | Length | Evidence |
|---|---|---|
| Competitive athletes (field, court, combat), bodybuilders, powerlifters, pros | about 90 min, max 2 h | COACH-ANSWER UNI-09 |
| General / weight loss / everyday people | 45-60 min | COACH-ANSWER UNI-09 |
| Bootcamp | 35-45 min | COACH-ANSWER PRG-03 |
| Non-competitive athletic adults and youth | 60 min | PROPOSED |
| Older / injured | 45-60 min, constrained machines | PROPOSED (EQ-03) |

The intake (09, F24) offers 30/45/60/75/90 min. Adding 105 and 120 min for competitive athletes is PROPOSED (UNI-09 allows up to 2 h).

### 7.2 Exercise caps (COACH-ANSWER VOL-08, VOL-16, VOL-17, PRG-03)

| Session type | Cap | Evidence |
|---|---|---|
| Resistance-only | 5-7 exercises for hard work; 45 min ~5, 60 min ~6-7, 75-90 min ~8-9 | VOL-16, VOL-08 (RIGHT) |
| Field athletes off-season, far from competition | up to 10-12: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance | VOL-08, VOL-17 |
| Bootcamp | 5-7 stations | PRG-03 |
| Strength | the four roles at 60 min (OBSERVED); 6-7 with survival isolations at 90 min | INFERRED |

**Counting convention** (PROPOSED - PENDING COACH APPROVAL): the warm-up, the core block and conditioning finishers are outside the cap but inside the time budget; a superset of two small-muscle isolations counts as one station. Open: VOL-17 says the field-athlete layout reaches "12 to 14" while VOL-08 says "max maybe 12" (11.2).

**Unilateral time** (COACH-ANSWER UNI-09, PARTLY): unilateral work takes longer and must be accounted for. v1 accounts for it in the time model (2.5-2.75 min per unilateral set vs 2.25-2.5 bilateral) instead of a 1.5-slot multiplier.

### 7.3 Observed session sizes (OBSERVED, kept from v0)

Exercise counts are OBSERVED slot counts. Set counts are OBSERVED only where the coach typed sets; for the empty BYOP templates they are ASSUMED at 2-3 per slot.

| Template | Exercises / session | Working sets / session |
|---|---|---|
| 3 DAY BUILDER, BOOTCAMP 2, FAT BURN | 5 | ~15 (assumed); 10-12 + cardio (assumed); 14-18 + circuit (observed) |
| BYOP AESTHETICS, BYOP PPL, BOOTCAMP 1 | 7 | 19 observed on AESTHETICS Day 1; 17-21 (assumed); 18-21 (assumed) |
| MM PPL push/pull; MM UL upper | 6; 8 | 16-23; 24-27 |
| MM UL lower / PPL legs (incl. 3 A-drills) | 10 (7 without the A-drills, which are not exercises in v1, ORD-08) | 20-32 |
| BYOP ATHLETIC / JUSTICE LEAGUE | 10 | 20 (2 sets per slot) |
| BASEBALL | median 9 (6-11) | median 29 (supersets / tri-sets) |
| MM athletic | 4-13 movements excl. throws | 9-35 |
| STRENGTH-8 / -12 | 4 (3 on STRENGTH-8 / CONJUGATE DE upper) | STRENGTH-8 14 / 15 / 16 / 11 (56 a week); CONJUGATE 60 a week |
| HYBRID | 4-6 stations | 8-22 |
| Optional day | 5 | ~12 + 1 cardio bout (assumed) |

### 7.4 Time-cost model (INFERRED; rests COACH-ANSWER VOL-14; set durations SCIENCE)

| Item | Minutes |
|---|---|
| Warm-up | 5 general + 2-3 pattern prep (ORD-08) |
| Core block | about 3 per exercise (2 sets x 1.25 + 0.5 setup); 2 exercises = about 6 |
| Hypertrophy compound set (rest 1-2 min, VOL-14) | 2.25 per set + 1 setup; 2.5 at 90-min sessions (rest ~2 min; VOL-14 allows up to 3) |
| Unilateral set | 2.5 per set + 1 (2.75 at 90 min) |
| Strength set (rest 3-6 min, VOL-14) | 4.0 per set + 2 setup |
| Heavy athletic compound | 3.0 per set + 1 |
| Isolation set (~60 s rest) | 1.75 per set + 0.5 (1.9 at 90 min) |
| Plyo / ankle hops / COD set | 1.5 + 0.5 |
| Throw set | 1.25 + 0.5; the full 19-throw list (LIB-22) about 18 min, 6-8 throws about 8 min |
| Olympic set | 2.5 + 2 setup |
| Superset (per component set) | 1.75 + 1 per pair; a pair with a strength lift = the strength lift + 1 (the partner fits in the rest) |
| Buy-out / WOD / skill / aerobic add-on | 4 / 12-15 / 5-8 / 20-30 |
| Bootcamp circuit | 5 warm-up + core (2 x 2 rounds x 50 s) + rounds x stations x (work + 15 s) + (rounds - 1) x 1.5 |
| Sets range 'a-b' | a below 90 min, b at 90 min |

Calibration on the coach's own sessions (v0 model output, unchanged): AESTHETICS Day 1 51 min straight / 40 supersetted (without core); JUSTICE LEAGUE Monday 61; STRENGTH-8 Monday ME lower 58; BASEBALL B2 'WK 1' Monday 61; BOOTCAMP 2 1A 35-40; FAT BURN WK1 Monday + circuit 57; HYBRID Monday WK1 / WK7 42 / 60. v1 adds the core block (about 6 min) and the always-written warm-up to every session.

**Headroom.** Starting sessions sit at or slightly above their length at week 1 (v1 estimates in 8.7). Sets added through the block (VOL-07) push them over, which triggers the time-overflow rule (supersets first, then the cut order) - PROPOSED.

### 7.5 Stations by session length (v1)

| Minutes | Aesthetics | Athletic | Strength | Fat loss / bootcamp | Hybrid / CrossFit |
|---|---|---|---|---|---|
| 30 | 3 stations: [BKD \| HPULL], [UKD \| VPULL], calves; 2 sets; 1 core exercise | core 1, plyo, Olympic, 2 supersets | the work + the survival | circuit 5 stations x 3 rounds | Olympic or strength + 10-min AMRAP |
| 45 | 5 exercises as 2 supersets + calves + rear delt on A days (~46 min; 4-6-day A/B days - the 2-day days, 3-day Day C, upper/lower and PPL x2 days estimate ~50-60 min and go through the time-overflow rule and the cut order) | core, plyo, throw, Olympic, 2 supersets, calves (~48 min) | the work + nuance + survival | gym 5 exercises as 2 supersets + calves, + rear delt on A days (~42-46 min); circuit 6-7 stations (35-45 min) | core, skill, Olympic, [strength \| pull], WOD 10 |
| **60** | **7 stations / 8 exercises**: 4 compounds, quad or ham isolation, [arm \| delt] superset, calves (~63 min) | **8-9 stations**: core 2, plyo, throw, COD on hip days (ATH-06), Olympic, 4 compounds at 2 sets, <calves + rear delt> on knee days (~58-64 min) | 4 roles + calves | gym 7 stations / 8 exercises (~63 min) | core, skill, Olympic, 2 pairs, calves in the strength lift's rest, rear delt once a week, WOD 12 (~56-64 min) |
| 75 | 8 stations straight (~64 min, leaves room for added sets) | + COD on knee days, leg curl, buy-out (~71 min) | + survival isolations | gym + longer finisher | + calves |
| 90 | 9 stations: 4 sets on compounds, Focus for the day's lead or priority muscle, longer rests (~90 min) | 10 stations / 11 exercises: + 2nd plyo or sprint, 3 sets per slot (~97 min) | all roles + calves / rear delts (~56-65 min on 4-day days; heavy rests fill the rest) | - | + longer skill and WOD (~75-86 min); aerobic add-ons only on 2-hour days |

### 7.6 What to cut first, what to add first (v1)

**First step everywhere when time is short:** superset the lower/upper pairs and the small isolations (COACH-ANSWER ORD-05).

| Family | Cut order | Never cut |
|---|---|---|
| Aesthetics | Focus -> arm isolation (delt stays as the superset partner) -> quad or hamstring isolation -> the second (non-axial) bilateral on 2-3-day plans | each bilateral + its paired upper lift, each unilateral + its paired upper lift, calves (VOL-17), at least one rear-delt station a week (VOL-17), the core block (ATH-11) |
| Athletic | 2nd plyo / sprint -> COD (keep for COD sports) -> leg curl -> the second pair drops to 2 sets | core block, 1 plyo/ballistic, the Olympic lift where the day has one (ATH-10), the work + its paired upper lift, calves, at least one rear-delt station a week (VOL-17) |
| Strength | the nuance -> the accessory | the work and the survival (ORD-07) |
| Bootcamp | the 7th station -> rounds 5 -> 3 | any primary pattern across the week, calves, the week's rear-delt station |

| Family | Add order when time is long |
|---|---|
| Aesthetics | compound sets 3 -> 4; Focus for the day's lead muscle or the priority muscle (VOL-07, ORD-11); aerobic add-on or a long walk (ATH-07) |
| Athletic | a third set per slot; COD and a second plyo / sprint; buy-out (2-4 days a week); leg curl; rear delts on the hip day too |
| Strength | survival isolations (calves, rear delts); the full 2-exercise core block; aerobic on a separate day |

SCIENCE (weak): a per-session ceiling of roughly 6-11 hard sets per muscle is a practitioner heuristic with limited direct trial evidence; Schoenfeld et al. 2017 is about the weekly dose-response. Same-pattern days (squat + lunge + leg extension) put about 8-11 quad sets in one 90-min session, inside that range. The weekly numbers belong to the volume engine (03 / 12).

### 7.7 Reconciliation with `03_volume_dosing.md`

03 gives sets per session by length and level; this file gives station selection, order, pairing and time. Where they differ, set counts come from 03 / 12 and station selection from here. v0's 60-min anchor and v0 03's 75-min athletic anchor are both replaced by the population lengths in 7.1.

---

## 8. Generator-ready split templates (2-6 days x 6 goal families) - regenerated in v1

**How to read this section.**
- Every day opens with the warm-up (not shown) and the core block (`core x2`), which the user may move (ATH-11).
- `[A | B]` = a UNI-11 pair (lower pattern + its opposite-surface upper lift). It is done as straight sets, or as a superset when the session is short (30-45 min) or another ORD-05 use case applies.
- `<A + B>` = an isolation superset (or a BASEBALL Part D tri-set).
- `*` = the week's axial exposure of that pattern; `~` = the non-axial exposure (leg press / belt squat, or the non-axial hinge pool) (PER-04).
- `(60+)`, `(75+)`, `(90+)` = included only at that session length or longer. Sets: compounds 3 (4 at 90 min), isolation 2 (3 at 90), calves 3, athletic slots 2 (3 at 90) - starting sets; they grow by the VOL-07 order.
- `calves 3` = 3 sets of calves on every leg day (VOL-17). `rear delt` / `side delt` = separate stations (VOL-17).
- Every template, its variants and its checks are in `05_templates.json > generator_split_templates`. The build script checked each one (8.7).
- Evidence: day content tagged OBSERVED where it comes from a coach template; the v1 changes are tagged with the coach answer that caused them; whatever is neither is INFERRED or PROPOSED.

### 8.1 Muscle & Physique (aesthetics / bodybuilding) - same pattern (UNI-06)

Default lengths: 60 min general physique, about 90 min bodybuilders (UNI-09). Aerobic: 4 a week + long walks after workouts for the whole family (COACH-ANSWER ATH-07: "4 for aesthetics bodybuilders"; the earlier v1 split that gave general physique clients 3 was withdrawn in verification pass 2 - open question 11.2-11 asks whether general physique clients are meant). The week layouts below hold only 0-3 aerobic sessions (5-day: 1; PPL x2: 0), so the rest are add-ons after lifting or long walks; each template's `aerobic_ATH07` block in the JSON gives the count. No medball except as warm-up (ATH-05). Rear delts get their own station from 45 min (VOL-17).

| Days | Week (Mon..Sun) | Day types | Evidence |
|---|---|---|---|
| 2 | A, aerobic, OFF, B, aerobic, OPT (or aerobic), OFF | **A - squat + pull (complete):** core x2 -> [BKD* \| HPULL] -> [UKD \| VPULL] -> [BHD~ \| HPUSH] (light pair) -> <calves 3 + rear delt (45+)> -> <quad iso + biceps> (75+). **B - hinge + push (complete):** core x2 -> [BHD* \| HPUSH] -> [UHD \| VPUSH] -> [BKD~ \| HPULL] -> <calves 3 + side delt (60+)> -> <leg curl + triceps> (75+). | INFERRED (no 2-day template exists); each day carries both bilaterals (the second one non-axial, PER-04) so every pattern is trained in two days; pairs by UNI-11 |
| 3 | A, OPT, B, OPT, C, aerobic, OFF | **A - squat + pull:** core x2 -> [BKD* \| HPULL] -> [UKD \| VPULL] -> quad iso (60+) -> <biceps (60+) + rear delt (45+)> -> calves 3 -> Focus (90+). **B - deadlift + push:** core x2 -> [BHD* \| HPUSH] -> [UHD \| VPUSH] -> leg curl (60+) -> <triceps + side delt> (60+) -> calves 3 -> Focus (90+). **C - both bilaterals, non-axial:** core x2 -> [BKD~ \| HPULL] -> [BHD~ \| HPUSH] -> UKD -> <side delt (60+) + rear delt (45+)> -> calves 3 -> Focus (90+). | Day content OBSERVED (OT02 3 DAY BUILDER D1/D2/D3); calves move to the end (ORD-04); Day C non-axial (PER-04); Mon/Wed/Fri INFERRED. Alternative: PPL once a week on any 3 days (PRG-02). |
| 4 | A1, B1, OPT, A2, B2, OPT, OFF | **A1 - squat + pull (axial squat):** core x2 -> [BKD* \| HPULL] -> [UKD \| VPULL] -> quad iso (60+) -> <biceps (60+) + rear delt (45+)> -> calves 3 -> Focus (90+). **B1 - hip thrust + push:** core x2 -> [BHD~ \| HPUSH] -> [UHD \| VPUSH] -> leg curl (60+) -> <triceps + side delt> (60+) -> calves 3 -> Focus (90+). **A2 - leg press + pull:** as A1 with BKD~. **B2 - deadlift + push:** as B1 with BHD*. **OPT:** core -> Focus 1 -> Focus 2 -> calves if a priority -> aerobic. | OBSERVED (OT01 A/B; weekdays OT07) + v1 rules; axial squat Monday / axial hinge Friday PROPOSED. Alternative: upper/lower (OT08 / OT21): Lower 1 squat-led core x2 -> BKD* -> BHD~ -> UKD -> UHD -> quad iso -> leg curl -> calves 3; Lower 2 hinge-led (BHD* first, BKD~); Upper core x2 -> HPULL -> HPUSH -> VPULL -> VPUSH -> <biceps + triceps> -> <side + rear delt>; Wed/Sat aerobic. |
| 5 | A1, B1, OPT, A2, B2, OFF, OFF | as 4 days with one optional day (separate day preferred, ORD-10) | INFERRED from the OBSERVED '4 to 6 DAYS A WEEK' framing |
| 6 | A1, B1, OPT, A2, B2, OPT, OFF | as 4 days with both optional days | OBSERVED. Alternative PPL x2 with flexible weekdays (PRG-02): Push core x2 -> HPUSH -> HPUSH (incline) -> VPUSH -> fly -> dips -> triceps -> side delt (75+); Pull core x2 -> HPULL -> HPULL -> VPULL -> lat pull-over (75+) -> rear delt -> side delt -> biceps -> biceps (75+); Legs 1 squat-led (BKD*, BHD~); Legs 2 hinge-led (BHD*, BKD~). |

### 8.2 Athletic Performance (field / court / combat; non-competitive adults and youth) - cross pattern by default (UNI-06)

Default lengths: about 90 min competitive (max 2 h), 60 min non-competitive (UNI-09; 60 PROPOSED). Rear delts get their own station on the knee + pull days from 60 min (VOL-17). COD is in every athletic week from 60 min: hip (B) days from 60 min, knee (A) days from 75, the 3-day S1 from 60 (COACH-ANSWER ATH-06; day placement INFERRED, verification pass 2). Layout per session (VOL-08, VOL-17): core x2 -> 2-4 plyo/ballistic (plyo, throw, COD, 2nd plyo or sprint) -> Olympic + the work (2-3) -> 3-4 resistance (paired upper, secondary pair, calves) -> buy-out (75+). Olympic work in every session family (ATH-10). Athletic patterns never count toward muscle sets (VOL-10).

| Days | Week (Mon..Sun) | Day types | Evidence |
|---|---|---|---|
| 2 | A, sport, sport, B, sport, OPT, OFF | **A - squat + pull:** core x2 -> plyo -> throw (60+) -> ankle/limited-knee plyo (90+) -> COD (75+) -> Olympic (clean family) -> [BKD* \| HPULL] -> [UHD \| VPUSH] -> <calves 3 + rear delt (60+)> -> buy-out (75+). **B - deadlift + push:** core x2 -> plyo -> throw (60+) -> sprint (90+) -> COD (60+) -> Olympic (snatch family) -> [BHD* \| HPUSH] -> [UKD \| VPULL] -> <calves 3 + leg curl (75+)> -> buy-out (75+). **In-season variant (PER-08, UNI-10):** IS_A core x2 -> sprint for speed athletes, otherwise jumps or nothing (strength maintenance only) (PER-08) -> light Olympic -> [UKD \| HPULL] -> [UHD \| VPUSH] -> <calves 3 + rear delt>; IS_B core x2 -> jumps (same PER-08 choice) -> light Olympic -> [BHD~ \| HPUSH] -> [UKD \| VPULL] -> calves 3; 2 aerobic sessions as add-ons around sport practice (ATH-07). Calves stay at 3 sets in season (VOL-17). | INFERRED; BYOP athletic slot list (OBSERVED) re-wired by UNI-06 / UNI-11 / ATH-11 / PER-04 |
| 3 | S1, sport, S2, sport, S3, OPT, OFF | **S1 - jump + knee + pull:** core x2 -> 2 plyos (weighted depth jump / depth jump into box jump - no depth jumps for older / injured / high-volume clients, EQ-03; loaded jump squats) -> sprint (75+) -> COD (60+; not in the OBSERVED sheet, added for ATH-06) -> Olympic (75+) -> [BKD* \| HPULL] (L2+: hex-bar squat directly into repeat jump squats) -> [UKD \| VPULL] (ipsilateral FFE lunge; L2+: into lunge jumps) -> nordic curl -> calves 3. **S2 - medball + hip + push:** core x2 -> throw list -> plyo push-ups -> Olympic (staggered DB snatch) -> [BHD~ (KB swings) \| HPUSH] -> [UHD (SL glute bridge) \| VPUSH] -> calves 3. **S3 - Olympic + strength:** core x2 -> Olympic (low hang power clean) -> [BHD* (snatch-grip DL) \| HPUSH] -> [UKD (walking lunges) \| HPULL] -> <quad iso + leg curl> -> side/front + rear delt -> calves 3. | Session structure OBSERVED (OT11 'STARTING'); v1: S1's push press -> vertical pull and S2's banded pulldowns -> vertical press (UNI-11, EQ-01); 'Camporini DL' removed (LIB-09); Olympic before strength (ORD-03); S3's press is kept at every length so the hinge and the lunge are never back to back (UNI-11); Mon/Wed/Fri INFERRED |
| 4 | A1, B1, OPT, A2, B2, OPT, OFF | **A1 / A2 - squat (A1 axial, A2 leg press / belt squat) + pull** and **B1 / B2 - hinge (B1 non-axial, B2 axial deadlift) + push**, as the 2-day A and B. **OPT:** core, Focus 1, Focus 2, calves if a priority, aerobic capacity. | OBSERVED default product (OT04) re-wired to cross pattern (UNI-06). **Same-pattern variant** for high-level athletes who need more stimulus to grow (COACH-ANSWER UNI-06) and size-focused athletes (INFERRED from ATH-03): A = [BKD \| HPULL] + [UKD \| VPULL]; B = [BHD \| HPUSH] + [UHD \| VPUSH] (the OBSERVED BYOP grammar). **BASEBALL Parts variant** (OBSERVED OT16, core first by ATH-11; a second core exercise from 75 min, VOL-17): Mon core -> throws -> OLY (every length: 2 sets below 90 min, 4 @ 75->90% at 90 - so the week always has Olympic work, ATH-10) -> [BKD~ speed \| HPULL] -> <UHD + biceps + calves> -> buy-out; Tue core -> plyos -> OLY (75+) -> [BHD* \| HPUSH] -> <UKD + triceps + side delt> -> calves 3 (no calf slot in the sheet; added by VOL-17) -> buy-out; Thu as Mon with [BKD* \| VPULL]; Fri as Tue with [BHD~ speed \| VPUSH] and rear delt. No COD slot in the sheet (open question 11.2-15). |
| 5 | A1, B1, OPT, A2, B2, OFF, OFF | as 4 days with one optional day | INFERRED from OT04c '4 to 6 DAYS A WEEK'; in-sport athletes stay at 2-4 days (OBSERVED BASEBALL / boxing) |
| 6 | A1, B1, OPT, A2, B2, OPT, OFF | as 4 days with both optional days | OBSERVED |

**Sport dial (v1).** `05_templates.json > generator_split_templates.athletic.sport_dial`. Contact numbers per sport stay in `03_volume_dosing.md`; the weekly plyo budget is still open (question 13).

| Sport / group | Plyo vs ballistic | Other levers | Evidence |
|---|---|---|---|
| Ground-contact rule | longer on the ground -> more ballistics; shorter -> more plyos; both ends always present; programs start ballistic and become plyometric | method progression receive & pause -> receive then create -> repeated (not a zone) | COACH-ANSWER ATH-01, CAT-10, CAT-11 |
| Ranking (most -> least plyo) | basketball ~ volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ~ karate > golf | | COACH-ANSWER ATH-02 |
| Sprinters | more plyos than ballistics | ipsilateral step-ups for acceleration; sprints in season | ATH-01, CAT-13, PER-08 |
| Basketball / volleyball | a good mix | high COD; 80-90% unilateral; more frontal/transverse work | ATH-01, ATH-06, UNI-02, UNI-12 |
| Football skill / soccer / tennis | mix leaning plyo | 80-90% unilateral, contralateral loading (into the hip); more frontal/transverse work; tennis high throws | UNI-02, CAT-13, UNI-12, ATH-05 |
| MMA / fighters / karate / boxing | more ballistics, fewer plyos, some plyos always | pressing and arm volume reduced (never cut) when punching volume is high; cardio-first = real aerobic block; high rotational throws; more frontal/transverse unilateral work (MMA) | ATH-01, ATH-04, ORD-09, ATH-05, UNI-12 |
| Baseball | ballistics + rotational + sprinting, few plyos | pitchers: less overhead pressing, more arm care, light rotational throws; same calendar for high school, college and pro; Olympic work every week (ATH-10); no COD in the sheet (open) | ATH-01, ATH-08, PRG-09, ATH-10; OBSERVED OT16 |
| Linemen / wrestlers / rugby / heavyweights / throwers | - | more resistance; same-pattern variant off-season (sport list INFERRED; the coach's trigger is a high-level athlete who needs more stimulus, UNI-06) | ATH-03, UNI-06 |
| Golf | least plyo | high rotational throws | ATH-02, ATH-05 |
| Non-competitive adults and youth | moderate | L1 Olympic variants unless experienced; 60 min (PROPOSED) | ATH-13 |
| Older adults | few plyos unless they ask | no snatch; constrained machines | ATH-09, EQ-03 |
| Youth | - | some Olympic lifts from the floor allowed | ATH-09 |
| Everyone | - | no sex-based rules: age, foundation, goal and injuries | ATH-09 |

### 8.3 Strength (the work / accessory / nuance / survival, ORD-07)

Default length about 90 min (UNI-09). A/B lead-lift weeks (OBSERVED). One axial squat and one axial hinge a week (PER-04): the max-effort day takes one pattern, the dynamic-effort speed lift the other; the accessory of the other pattern is non-axial (INFERRED application, PENDING; powerlifter exception is an open question).

| Days | Week | Day types (week A shown; week B swaps squat <-> hinge and the paired vectors) | Evidence |
|---|---|---|---|
| 2 | FB_ME, OFF, OFF, FB_DE, OFF, OPT, OFF | **FB_ME:** core x2 -> [BKD* (the work, 1 RIR) \| HPULL (nuance)] -> [BHD~ (accessory) \| HPUSH (upper work)] -> UHD (survival, 60+) -> calves 3 -> rear delt (75+). **FB_DE:** core x2 -> plyo (the work, 'EASY') -> [BHD* speed \| VPUSH fast] -> [UKD \| VPULL] -> calves 3 -> triceps (75+). | INFERRED compression of OT19/OT20; the hinge accessory goes before the upper press so the hinge is not followed by the single-leg hinge (UNI-11) |
| 3 | SQUAT, OFF, PRESS, OFF, DEADLIFT, OPT, OFF | **Squat:** core x2 -> BKD* -> BHD~ -> UKD (nuance) -> quad iso -> calves 3. **Press:** core x2 -> HPUSH or VPUSH by A/B week (the work first, ORD-02) -> HPULL / VPULL -> incline -> <biceps + rear delt>. **Deadlift:** core x2 -> plyo (75+) -> BHD* -> BKD~ -> UHD -> leg curl -> calves 3. | OBSERVED class trio skeleton (OT18); fill INFERRED; non-axial second bilateral (PER-04) |
| 4 | ME_LOWER, OFF, ME_UPPER, DE_LOWER, OFF, DE_UPPER, OFF | **ME lower (week A):** core x2 -> [BKD* the work \| HPULL nuance] -> BHD~ accessory -> UKD survival -> calves 3. **ME upper:** core x2 -> press (the work) -> HPULL (accessory) -> incline (nuance) -> <biceps + rear delt> (survival). **DE lower (week A):** core x2 -> plyo (the work) -> [BHD* speed \| HPUSH] -> UHD -> calves 3. **DE upper:** core x2 -> fast press -> VPULL -> incline -> <triceps + side delt>. Week B: ME lower hinge-led [BHD* \| HPUSH] -> BKD~ -> UHD; DE lower squat speed [BKD* \| HPULL] -> UKD. | OBSERVED days (OT19/OT20 Mon/Wed/Thu/Sat) + ORD-07 roles; nuance position and vector INFERRED from UNI-11 |
| 5 | ME_LOWER, OPT, ME_UPPER, DE_LOWER, OFF, DE_UPPER, OFF | + 1 optional day | INFERRED (never a third heavy lower day) |
| 6 | ME_LOWER, OPT, ME_UPPER, DE_LOWER, OPT, DE_UPPER, OFF | + 2 optional days | INFERRED |

### 8.4 Fat loss / bootcamp / general fitness - cross pattern (UNI-06)

Two formats: **gym** (straight sets, 45-60 min, UNI-09) and **bootcamp circuit** (5-7 stations x 3-5 rounds x 30-50 s, 35-45 min, PRG-03). 3 aerobic sessions a week (ATH-07); the 4-, 5- and 6-session weeks hold 2, 1 and 0 of them, so the rest are add-ons or long walks (`aerobic_ATH07` in the JSON). The same applies to the no-equipment family (8.6), whose 3- and 5-day weeks hold 1 run.

| Days | Week | Day types | Evidence |
|---|---|---|---|
| 2 | A, OFF, aerobic, B, aerobic, aerobic, OFF | **A:** core x2 -> [BKD \| HPULL] -> [UHD \| VPUSH] -> quad iso (60+) -> <biceps (60+) + rear delt (45+)> -> calves 3. **B (corrected):** core x2 -> [BHD \| HPUSH] -> [UKD \| VPULL] -> leg curl (60+) -> <triceps + side delt> (60+) -> calves 3. | OBSERVED OT05 A; B corrected by COACH-ANSWER ORD-06 / UNI-11 |
| 3 | Bootcamp 1, aerobic, Bootcamp 2, aerobic, Bootcamp 3, aerobic, OFF | **1:** core -> [BKD \| HPULL] -> UHD -> metabolic -> calves -> rear delt. **2:** core -> [BHD \| HPUSH] -> biceps -> VPUSH -> metabolic -> calves. **3:** core -> [VPULL \| UKD] -> metabolic -> triceps -> side delt -> calves. Circuits (5 x 45 s, about 44 min) or gym straight sets. | OBSERVED (OT06 1A/2A/3A; pairs already follow UNI-11); core moved to the start (ATH-11) |
| 4 | A, B, aerobic, A, B, aerobic, OFF | gym A / B as the 2-day; third aerobic session as an add-on or a long walk | OBSERVED (OT05, corrected). **Bootcamp-circuit variant (PRG-03):** BC_A core -> [BKD \| HPULL] -> [UHD \| VPUSH] -> metabolic -> calves -> biceps; BC_B core -> [BHD \| HPUSH] -> [UKD \| VPULL] -> metabolic -> calves -> side or rear delt; 7 stations at 4 x 50 s (about 43 min). **FAT BURN variant (OBSERVED OT10):** lower A/B + U1/U2 with a 4-station circuit finisher (PRG-11), row before pulldown (ORD-01), core first (ATH-11), lead-lift A/B weeks optional (PER-03). |
| 5 | BC_A, BC_B, BC_A, BC_B, BC_A, aerobic, OFF | rolling A/B circuits (next week B-A-B-A-B) | COACH-ANSWER PRG-03 (5 sessions is an option); rolling order PROPOSED |
| 6 | Bootcamp 1, 2, 3, 1, 2, 3, OFF | 1B-3B repeat 1A-3A with a different exercise pick (OBSERVED); aerobic as 10-20 min add-ons or long walks (ATH-07, ORD-10) | OBSERVED (OT06 order, 'SUNDAY' 'OFF'); PRG-03 |

**Axial note.** Bootcamp and fat-loss stations use goblet / DB / bodyweight / leg-press variants. A barbell squat or deadlift in these plans counts as the week's axial exposure of that pattern (PER-04). Whether light front-loaded squats count at all is open (11.2).

### 8.5 Hybrid / CrossFit

Order (v1): warm-up -> core block -> skill -> Olympic / power -> strength -> accessories -> WOD (ATH-11, ORD-03; the HYBRID tab listed strength before the Olympic lift). Accessories follow UNI-11 and are done in the strength lift's rest period (OBSERVED HYBRID tri-set style). AMRAPs and 40-rep sets live here only (VOL-11). Calves get 3 sets on every leg day at every length (VOL-17); under 75 min they are done in the strength lift's rest period, the way the HYBRID tab does its accessories (INFERRED application). One rear-delt station a week (HY2 or the class squat day, VOL-17).

| Days | Week | Day types | Evidence |
|---|---|---|---|
| 2 | HY1, OFF, OFF, HY2, OFF, aerobic, OFF | **HY1:** core x2 -> skill -> Olympic (clean) -> [BKD* \| HPULL] -> [UHD \| VPUSH] -> calves 3 -> WOD / AMRAP 12-20. **HY2:** core x2 -> skill -> Olympic (snatch) -> [BHD* \| HPUSH] -> [UKD \| VPULL] -> calves 3 -> rear delt -> A-colour sprints. | INFERRED from HYBRID Mon/Thu (OT23) + class order (OT18) |
| 3 | SQUAT, OFF, PRESS, OFF, DEADLIFT, aerobic, OFF | **Squat:** core x2 -> skill 'DUBS' -> [BKD* \| HPULL (60+)] -> UHD (60+) -> calves 3 -> rear delt -> WOD. **Press:** core x2 -> skill -> Olympic 'SNATCH' -> VPUSH 'PRESS' (the work) -> VPULL (60+) -> WOD. **Deadlift:** core x2 -> 'GYMNASTICS' -> Olympic 'CLEAN' -> [BHD* \| HPUSH (60+)] -> UKD (60+) -> calves 3 -> WOD. Aerobic L3/L4 add-ons only on 2-hour days, otherwise separate. | OBSERVED class skeleton (OT18); accessories INFERRED, paired by UNI-11 |
| 4 | MON, TUESD, OFF, THURS, FRID, aerobic at L3-4 (WOD only in MAY), OFF | OT17 competitor days (knee + snatch / pull + clean / hip + snatch / push + clean); rows activate by month; v1 session order as above; squat Monday + deadlift Thursday = one axial exposure each; the knee and hip days add calves 3 and the week one rear-delt station (VOL-17) | OBSERVED (OT17); v1 order ATH-11 / ORD-03; PER-04; VOL-17 |
| 5 | MON, TUE, OFF, THU, FRI, SAT, OFF | **Mon** = HY1. **Tue:** core x2 -> sprints 'A/C' 'SPEED' -> jumps (moved before the bench, ORD-03) -> [HPUSH '3x6 DB bench' \| UHD lower accessory] -> calves. **Thu** = HY2. **Fri:** easy aerobic 15-40 min first (real aerobic block, ORD-09) -> core x2 -> jumps -> [UHD 'uni RDL' \| VPUSH 'OH press'] -> BHD~ -> calves. **Sat:** core x2 -> [BKD~ 'KD REPS' (second squat exposure: leg press / belt squat) \| HPULL] -> [UKD lunges \| VPULL pull-ups] -> calves 3 -> AMRAP. | OBSERVED (OT23) re-wired: Olympic first (ORD-03), Saturday push -> pulls (UNI-11), second squat non-axial (PER-04) |
| 6 | SQUAT, PRESS, WOD, DEADLIFT, CLEAN/PUSH, WOD, OFF | class split; Wed/Sat WOD-only classes (core -> skill -> WOD) | OBSERVED (OT18 MON-SAT; WED/SAT blank, WOD-only reading INFERRED) |

### 8.6 No-equipment

No no-equipment template exists (OBSERVED). The hidden 'NO ACCESS' tabs wire the full gym menus; what 'NO ACCESS' means is still pending (PRG-01 skipped). The generator keeps the cross-pattern fat-loss / bootcamp skeleton and filters each slot to bodyweight. **No bands anywhere** (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12).

| Days | Week | Basis |
|---|---|---|
| 2 | A_BW, OFF, run, B_BW, OFF, run, OFF | fat-loss A / B (corrected) with bodyweight pools |
| 3 | Bootcamp 1-2-3 BW, run | OT06 rotation, bodyweight |
| 4 | A_BW, B_BW, run, A_BW, B_BW, run, OFF | fat-loss A / B, bodyweight |
| 5 | BC_A, BC_B, BC_A, BC_B, BC_A (BW), run | rolling A/B circuits (PROPOSED) |
| 6 | Bootcamp 1-2-3, 1-2-3 BW | OT06 six sessions |

Substitution ladder. The library items are OBSERVED (cells cited); the mapping is INFERRED; band options are removed (EQ-01).

| Bucket | No-equipment options |
|---|---|
| RP_BKD | 'Bodyweight Squats' AI12, 'Squats with Foam Roller or Yoga Ball on the wall' AI14, 'Sissy Squats' AI100 |
| RP_BHD | 'Glute Bridges' AN9, 'Elevated Feet on Bench Glute Bridges' AN10, 'Supine Glidder hamstring curls' AN18 |
| RP_UKD | All AL lunges (AL9-AL21); 'Single leg get ups' = box pistol (LIB-09) |
| RP_UHD | 'SL Glute Bridges (foot on the ground)' AQ9, '(foot on bench)' AQ10, 'SL Hip thrusts' AQ11 |
| RP_HPUSH | 'Kneeling Push Ups' -> 'Incline Push-ups' -> 'Push Ups ' -> 'Push ups (Feet on Wall)' / 'Diamond Push ups' / 'Declined Pushups' -> 'Push ups (1 hand Higher)' |
| RP_VPUSH | 'Pike Push Ups' AA53 -> 'Handstand Push ups' AA52 |
| RP_HPULL | 'Inverted Rows' X13, 'TRX Rows' X12 (need a bar, a table or a suspension trainer) |
| RP_VPULL | 'Seated Pull ups with Rings or TRX' U19; pull-ups if there is a bar. With no bar: an extra horizontal pull (INFERRED). The band-assisted option U15 is out (EQ-01). |
| ISO_QUAD / ISO_HAM / ISO_CALF | sissy squats (EQ-08); nordics, slider or swiss-ball curls (EQ-08); 'Standing Calf raises (use deficit)', single-leg |
| ISO_BICEP / ISO_TRICEP / ISO_SIDE_REAR_DELT | No bodyweight option in the library (OBSERVED). Use DBs or KBs if the client has any; otherwise 'TRX Bicep Curls' (AS), 'Diamond Push ups' AD93 for triceps, prone Y/T raises for rear delts (INFERRED). No band work. |
| AP_THROW | Needs a med ball (never over 20 lb). Without one: plyo push-ups or the no-ball "fake medball slam" (EQ-07); never band chops. |
| COND_AEROBIC | The running options in B9-B47; walk-run for beginners |

### 8.7 Recomputed checks (v1, from `05_templates.json`)

Checked by the build script for every template and variant at the family's default lengths: weekly exposures of the 8 primary patterns; axial exposures (squat / hinge); stations per main day (the cap); estimated minutes; slot-level pairing (UNI-11); core block first; horizontal before vertical unless the vertical lift is the work; Olympic before the work. **No template has a pairing, order, axial or cap failure.** The only flags are documented observed-design exemptions. Recomputed after the v1 verification fixes (calves on every leg day, a weekly rear-delt station, no hinge-then-lunge back to back; see the v1 verification log); an independent audit also checks calves 3 sets on every leg day, at least one rear-delt station a week, no two lower compounds back to back in a mixed session and no medball in aesthetics. Its only remaining flag is the conjugate ME lower day (a lower-dominant day, OBSERVED design; 11.2 question 9). Re-run again after verification pass 2 (COD in every athletic week from 60 min, Olympic work in every BASEBALL Parts week, about 2 core exercises in the BASEBALL Parts and WOD-only days); the rows below are regenerated from the JSON.

| Family | Days | Min | BKD BHD UKD UHD HPUSH VPUSH HPULL VPULL | Axial sq/hinge | Stations per main day | Est. min | Result |
|---|---|---|---|---|---|---|---|
| aesthetics | 2 | 60 | 2 2 1 1 2 1 2 1 | 1/1 | 6-6 | 64-64 | ok |
| aesthetics | 2 | 90 | 2 2 1 1 2 1 2 1 | 1/1 | 7-7 | 94-94 | ok |
| aesthetics | 3 | 60 | 2 2 2 1 2 1 2 1 | 1/1 | 6-7 | 63-64 | ok |
| aesthetics | 3 | 90 | 2 2 2 1 2 1 2 1 | 1/1 | 9-9 | 90-95 | ok |
| aesthetics | 4 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 7-7 | 64-64 | ok |
| aesthetics | 4 | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 9-9 | 90-90 | ok |
| aesthetics | 4 (upper lower) | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 6-7 | 60-61 | ok |
| aesthetics | 4 (upper lower) | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 7-8 | 79-83 | ok |
| aesthetics | 5 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 7-7 | 64-64 | ok |
| aesthetics | 5 | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 9-9 | 90-90 | ok |
| aesthetics | 6 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 7-7 | 64-64 | ok |
| aesthetics | 6 | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 9-9 | 90-90 | ok |
| aesthetics | 6 (ppl x2) | 60 | 2 2 2 2 6 2 4 2 | 1/1 | 6-7 | 49-60 | ok |
| aesthetics | 6 (ppl x2) | 90 | 2 2 2 2 6 2 4 4 | 1/1 | 7-8 | 74-85 | ok |
| athletic | 2 | 60 | 1 1 1 1 1 1 1 1 | 1/1 | 8-9 | 64-64 | ok |
| athletic | 2 | 90 | 1 1 1 1 1 1 1 1 | 1/1 | 10-10 | 97-97 | ok |
| athletic | 2 (in season variant) | 60 | 0 1 2 1 1 1 1 1 | 0/0 | 7-7 | 54-58 | exempt - COACH-ANSWER UNI-10: minimal bilateral in season |
| athletic | 2 (in season variant) | 90 | 0 1 2 1 1 1 1 1 | 0/0 | 7-7 | 64-68 | exempt - COACH-ANSWER UNI-10: minimal bilateral in season |
| athletic | 3 | 60 | 1 2 2 1 2 1 2 1 | 1/1 | 8-9 | 58-63 | ok |
| athletic | 3 | 90 | 1 2 2 1 2 1 2 1 | 1/1 | 8-11 | 84-88 | ok |
| athletic | 4 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 8-9 | 64-64 | ok |
| athletic | 4 | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 10-10 | 97-97 | ok |
| athletic | 4 (same pattern variant) | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 8-9 | 64-64 | ok |
| athletic | 4 (same pattern variant) | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 10-10 | 97-97 | ok |
| athletic | 4 (baseball parts variant) | 60 | 2 2 2 2 1 1 1 1 | 1/1 | 5-5 | 64-64 | ok |
| athletic | 4 (baseball parts variant) | 90 | 2 2 2 2 1 1 1 1 | 1/1 | 5-6 | 74-81 | ok |
| athletic | 5 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 8-9 | 64-64 | ok |
| athletic | 5 | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 10-10 | 97-97 | ok |
| athletic | 6 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 8-9 | 64-64 | ok |
| athletic | 6 | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 10-10 | 97-97 | ok |
| strength | 2 | 90 | 1 2 1 1 1 1 1 1 | 1/1 | 7-7 | 83-95 | ok |
| strength | 3 | 90 | 2 2 1 1 2 0 1 0 | 1/1 | 5-6 | 62-68 | exempt - A/B weeks: the accessory pull rotates H/V (OBSERVED); A/B weeks: the press day rotates H/V push (OBSERVED OT19/OT20) |
| strength | 4 | 90 | 1 2 1 1 4 1 2 1 | 1/1 | 5-5 | 56-64 | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week |
| strength | 4 (week B) | 90 | 2 1 1 1 4 1 2 1 | 1/1 | 5-5 | 56-64 | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week |
| strength | 5 | 90 | 1 2 1 1 4 1 2 1 | 1/1 | 5-5 | 56-64 | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week |
| strength | 6 | 90 | 1 2 1 1 4 1 2 1 | 1/1 | 5-5 | 56-64 | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week |
| fat loss bootcamp | 2 | 45 | 1 1 1 1 1 1 1 1 | 0/0 | 3-4 | 42-46 | ok |
| fat loss bootcamp | 2 | 60 | 1 1 1 1 1 1 1 1 | 0/0 | 7-7 | 64-64 | ok |
| fat loss bootcamp | 3 | 45 | 1 1 1 1 1 1 1 1 | 0/0 | 6-6 | 44-44 | ok |
| fat loss bootcamp | 3 | 60 | 1 1 1 1 1 1 1 1 | 0/0 | 6-6 | 44-44 | ok |
| fat loss bootcamp | 4 | 45 | 2 2 2 2 2 2 2 2 | 0/0 | 3-4 | 42-46 | ok |
| fat loss bootcamp | 4 | 60 | 2 2 2 2 2 2 2 2 | 0/0 | 7-7 | 64-64 | ok |
| fat loss bootcamp | 4 (bootcamp circuit) | 45 | 2 2 2 2 2 2 2 2 | 0/0 | 7-7 | 43-43 | ok |
| fat loss bootcamp | 4 (bootcamp circuit) | 60 | 2 2 2 2 2 2 2 2 | 0/0 | 7-7 | 43-43 | ok |
| fat loss bootcamp | 5 | 45 | 3 2 2 3 2 3 3 2 | 0/0 | 7-7 | 43-43 | ok |
| fat loss bootcamp | 5 | 60 | 3 2 2 3 2 3 3 2 | 0/0 | 7-7 | 43-43 | ok |
| fat loss bootcamp | 6 | 45 | 2 2 2 2 2 2 2 2 | 0/0 | 6-6 | 44-44 | ok |
| fat loss bootcamp | 6 | 60 | 2 2 2 2 2 2 2 2 | 0/0 | 6-6 | 44-44 | ok |
| hybrid crossfit | 2 | 60 | 1 1 1 1 1 1 1 1 | 1/1 | 3-4 | 60-64 | ok |
| hybrid crossfit | 2 | 90 | 1 1 1 1 1 1 1 1 | 1/1 | 4-5 | 81-86 | ok |
| hybrid crossfit | 3 | 60 | 1 1 1 1 1 1 1 1 | 1/1 | 3-3 | 56-62 | ok |
| hybrid crossfit | 3 | 90 | 1 1 1 1 1 1 1 1 | 1/1 | 3-4 | 76-84 | ok |
| hybrid_crossfit | 4 | - | day types in OT17 (not recomputed) | - | - | - | - |
| hybrid crossfit | 5 | 60 | 2 2 2 3 2 2 2 2 | 1/1 | 2-4 | 45-64 | ok |
| hybrid crossfit | 5 | 90 | 2 2 2 3 2 2 2 2 | 1/1 | 3-5 | 45-86 | ok |
| hybrid crossfit | 6 | 60 | 1 1 1 1 2 2 1 1 | 1/1 | 0-3 | 31-62 | exempt - OBSERVED class model: one strength pattern per day; WODs carry the rest (INFERRED) |
| hybrid crossfit | 6 | 90 | 1 1 1 1 2 2 1 1 | 1/1 | 0-4 | 37-84 | exempt - OBSERVED class model: one strength pattern per day; WODs carry the rest (INFERRED) |
| no equipment | 2 | 45 | 1 1 1 1 1 1 1 1 | 0/0 | 3-4 | 42-46 | ok |
| no equipment | 2 | 60 | 1 1 1 1 1 1 1 1 | 0/0 | 7-7 | 64-64 | ok |
| no equipment | 3 | 45 | 1 1 1 1 1 1 1 1 | 0/0 | 6-6 | 44-44 | ok |
| no equipment | 3 | 60 | 1 1 1 1 1 1 1 1 | 0/0 | 6-6 | 44-44 | ok |
| no equipment | 4 | 45 | 2 2 2 2 2 2 2 2 | 0/0 | 3-4 | 42-46 | ok |
| no equipment | 4 | 60 | 2 2 2 2 2 2 2 2 | 0/0 | 7-7 | 64-64 | ok |
| no equipment | 5 | 45 | 3 2 2 3 2 3 3 2 | 0/0 | 7-7 | 43-43 | ok |
| no equipment | 5 | 60 | 3 2 2 3 2 3 3 2 | 0/0 | 7-7 | 43-43 | ok |
| no equipment | 6 | 45 | 2 2 2 2 2 2 2 2 | 0/0 | 6-6 | 44-44 | ok |
| no equipment | 6 | 60 | 2 2 2 2 2 2 2 2 | 0/0 | 6-6 | 44-44 | ok |

---

## 9. Generator algorithm (v1)

1. **Inputs:** goal family; days per week (2-6); session minutes (30/45/60/75/90, plus 105/120 for competitive athletes - PROPOSED, UNI-09); experience level L1/L2/L3 (PRG-05); equipment; sport + position + season if competitive, general sport if recreational (GEN-02); body weight (GEN-02); plan type (4-6-week maintenance / 8 / 12 / week-by-week / yearly, PER-01); priority muscles; pain areas; rep-style preference; laterality overrides; coach-added rules (GEN-08). No sex field (GEN-02, ATH-09).
2. **Week:** take `generator_split_templates[family][days].week_layout`, or the variant the sport, phase or preference selects (same-pattern athletic, BASEBALL Parts, in season, upper/lower, PPL x2 with flexible weekdays, bootcamp circuit). Optional days are separate by default, add-ons on request (ORD-10). Place the aerobic sessions per ATH-07.
3. **Sessions:** keep stations with `include_from_minutes` <= minutes; resolve set ranges; write the warm-up (ORD-08); put the core block first unless the user moved it (ATH-11).
4. **Pairing and supersets:** keep the UNI-11 pairs. Superset them when the session is short, when an L3 athlete needs more stimulus, when an off-season athlete is doing VO2max / mitochondrial work, or when an L1 client does not fatigue (ORD-05). Otherwise use straight sets.
5. **Order:** warm-up -> core block -> plyo / ballistic -> throws -> COD -> Olympic / power (ORD-03) -> the work (ORD-02) + paired upper -> secondary pairs (horizontal before vertical, ORD-01) -> isolation (a small muscle first only if it is the priority, ORD-04) -> conditioning (a fighter / hybrid aerobic block may open the day, ORD-09).
6. **Validate the week:** pattern frequency; slot-level pairing; axial budget <= 1 squat + 1 hinge (PER-04); each upper vector >= 1x; calves 3 sets every leg day and at least one rear-delt station a week at the chosen length (VOL-17); aerobic sessions per ATH-07 (`aerobic_ATH07`); exercise cap and time estimate for the population (VOL-08, UNI-09, PRG-03); >= 1 OFF day; coach-added rules (GEN-08).
7. **Fill exercises:** a default exercise in every slot plus a dropdown of swaps in the same category (GEN-04). Filter by level (levels add options, CAT-05), equipment (no bands, no variable resistance - EQ-01, EQ-12), pain (machines, split grips or drop the exercise - VOL-03) and client preference (EQ-10). Older, injured or high-volume clients get constrained machines and never overhead squat, snatch, low-bar squat or depth jumps (EQ-03). The second weekly exposure is a different exercise, non-axial for squats and hinges (PER-04). The laterality dial sets bilateral vs unilateral (UNI-02).
8. **Dose:** starting weekly sets per muscle by level and goal from the volume engine (03 / 12). Credit the exercise picked, not the slot: primary 1.0, helpers 0.25 (VOL-09), dips 0.5 triceps / 0.5 chest (LIB-16), 10/10 unilateral = 1 set (UNI-01), athletic patterns 0 (VOL-10). The BYOP menus contain off-pattern items, for example 'Leg Extension Machine' in 'Bilateral KD' (OBSERVED). Effort in RIR (VOL-13); rests 1-2 min (up to 3) for hypertrophy and 3-6 min for strength (VOL-14).
9. **Progress:** each week add 3, 5 or 7% of the muscle's weekly sets, chosen by the person's state (VOL-05); bank fractions into whole sets (VOL-06); place each new set by the VOL-07 order (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); give small muscles a bonus exercise (VOL-07). Adjust from logged effort and how it felt (GEN-05) only when the user chooses to log: the coach is unsure whether tracking belongs in the tool (GEN-03), so without logs the plan follows its preset progression (PROPOSED - PENDING COACH APPROVAL). If a session overflows its length, superset first, then cut (PROPOSED).
10. **Periodise** (details in 06): blocks of 4-6 weeks with small variable changes between them (PER-02); 8-week = 4 adapting + 4 driving hard; 12-week = 2-4 acclimation + 4-6 hard + hardest last weeks; repeated cycles start one level higher; 4-6-week maintenance at about 50-70% volume; deload = about half the sets, same architecture, no finisher (PER-05); tests by checkbox or none (PER-07); A/B lead-lift weeks optional (PER-03); one algorithm for every level (PRG-06).

---

## 10. What this says about how the coach thinks

1. **The slot skeleton is the program; the exercise is a choice inside it** (OBSERVED, confirmed by GEN-04: "pick the default and be able to do the drop-downs").
2. **An athlete program is a muscle program with an athletic prefix** (OBSERVED: OT04 is OT01 with Plyo / Throwing / COD / 'Tripple Extension' added). In v1 the prefix sits after the core block, and every athlete gets Olympic work (ATH-10).
3. **Balance is structural, and the coach can say why.** Hip with push and knee with pull keeps paired work "as far away as I can from bleeding over problems", so the client can do more work across the week (UNI-11). Same-pattern days drive a muscle harder; cross-pattern days keep bootcamp clients fresh enough to come back (UNI-06). The spine gets one heavy squat and one heavy hinge a week (PER-04).
4. **Order follows what matters most.** Core first as a warm-up (ATH-11), power before strength (ORD-03), the work first (ORD-02); the new sets go to the first exercise "because I put all my energy into it" (VOL-07).
5. **Fatigue is a tool, not a by-product.** Supersets compress fatigue for those who need more of it - the advanced athlete, the off-season engine, the beginner who does not feel it (ORD-05) - and save time for those who have little.
6. **Session size is set by the person, not by a fixed hour.** About 90 minutes for athletes and physique competitors, 45-60 for everyday clients, 35-45 for bootcamps (UNI-09, PRG-03). Within that, 5-7 hard exercises, up to 10-12 for a field athlete far from competition (VOL-08, VOL-16).
7. **The week has a fixed rhythm** (OBSERVED): two hard pairs, recovery or optional days between and after them, Sunday off. Optional days are better as their own days (ORD-10).
8. **Everything is adjustable to the person.** Pain, life and response change the rate, the laterality and the exercise (VOL-03, VOL-05, UNI-02, UNI-08); he expects the system to learn from data over time (VOL-01, VOL-02).

---

## 11. Open questions

### 11.1 Status of the v0 questions

| # | v0 question (short) | Status | Answered by |
|---|---|---|---|
| 1 | Same vs opposite lower pairing | CLOSED - a rule by goal | UNI-06 |
| 2 | Horizontal pull with knee days, push with hip days | CLOSED - deliberate (bleed-over); BOOTCAMP 1 Tue/Fri was a mistake | UNI-11, ORD-06 |
| 3 | Vertical vector same vs crossed | CLOSED - follows the lower pattern | UNI-11 |
| 4 | Supersets | CLOSED - fatigue / time tool, four use cases | ORD-05 |
| 5 | Small muscle first | CLOSED - priority only | ORD-04 |
| 6 | Session length, what to cut | CLOSED - 90 / 45-60 min; exercises by length | UNI-09, VOL-08 |
| 7 | Optional days; complete 2-day sessions | PARTLY - add-on or separate (ideally separate); complete 2-day sessions INFERRED | ORD-10 |
| 8 | 2 vs 3 aerobic sessions | PARTLY - 3 / 2 / 4 by population; colour rule for a 4th open | ATH-07 |
| 9 | Conditioning placement | CLOSED - fighter aerobic block first, buy-outs last, cardio inside circuits | ORD-09, PRG-03 |
| 10 | Core placement | CLOSED - core first for everyone, movable | ATH-11 |
| 11 | Buy-out on every 60+ min athletic session | OPEN | - |
| 12 | COD | CLOSED - every athlete, tiered by turn angle | ATH-06 |
| 13 | Plyos by sport | PARTLY - ground-contact model and ranking confirmed; weekly contacts per sport open | ATH-01, ATH-02 |
| 14 | Boxing upper body | CLOSED - reduce, never cut | ATH-04 |
| 15 | Second weekly exposure | CLOSED - different exercise, non-axial | PER-04 |
| 16 | Why the 3-day cut keeps leg curls | OPEN | - |
| 17 | Fixed strength layout; squat + deadlift on one day | OPEN (PER-04 makes this more important, see 11.2) | - |
| 18 | HYBRID order | CLOSED - power first | ORD-03 |
| 19 | 5-6 day hypertrophy default | PARTLY - PPL days flexible; default still open | PRG-02 |
| 20 | No-equipment kit and swaps | PARTLY - no bands; sissy squats / nordics / slider curls; minimum kit unknown | EQ-01, EQ-02, EQ-07, EQ-08 |
| 21 | Deloads | CLOSED - half the sets, same exercises, lighter, no finisher | PER-05 |
| 22 | Pull order | CLOSED - row first, always | ORD-01 |
| 23 | Contrast rest | CLOSED - no rest inside the complex | ATH-12 |
| 24 | Vertical press optional for physique / fat loss | OPEN | - |
| 25 | CrossFit WOD days by month or by level | OPEN | - |

### 11.2 New questions raised by the answers

1. **Axial scope (PER-04).** Do Olympic lifts (cleans, snatches), loaded jumps, light front-loaded bootcamp squats (goblet, DB) and shoulder-pad machines (hack squat, pendulum) count toward the once-a-week axial budget? Are powerlifters an exception (they normally squat and deadlift twice a week)?
2. **Axial spacing (PER-04).** Should the week's one axial squat and one axial deadlift be on the same day (one "spine day") or on different days? We propose squat Monday and deadlift Friday, leg press Thursday, a non-axial hinge Tuesday.
3. **Non-axial hinge (PER-04).** Approve this pool for the second hinge exposure: hip thrust (bar on the hips or machine), glute bridge, 45-degree back extension, reverse hyper, GHD hip extension, cable pull-through, KB swing?
4. **Second squat without a leg press (PER-04).** At home, in a hotel or in a CrossFit box with no leg press or belt squat, what replaces the second squat - a light front-loaded squat, a single-leg squat, or nothing?
5. **Core-first dose (ATH-11).** When core opens the session before jumps, sprints or Olympic lifts, should it stay light (about 2 sets, not to failure) so it warms up rather than tires the trunk, with harder core only when moved to the end?
6. **Cap counting (VOL-08 vs VOL-17).** VOL-08 caps field athletes at 12 exercises; VOL-17 says the layout reaches "12 to 14". Does the 12 exclude the 2 core exercises? Do warm-up drills and a superset of two small isolations count as exercises?
7. **Set addition with two A days (VOL-07).** When day A appears twice a week (Monday and Thursday), does the added set go to Monday's first exercise only, or to both A sessions (which adds 2 sets a week)?
8. **Small-muscle bonus (VOL-07).** Where does the bonus exercise go: the end of the same session, the Focus slot on an optional day, or the next session where that muscle is fresh?
9. **Strength pairing (UNI-11 vs STRENGTH-8).** Your strength track puts a pull ('the nuance') on the lower day every week, deadlift weeks included. Should deadlift-led days switch that to a push (hip + push), and should the nuance sit right after 'the work' instead of after 'the accessory'? Note: moving it up puts 'the accessory' and 'the survival' (a hinge and a lunge) back to back, while your sheet order had the pull between them.
10. **Which athletes get same-pattern days (UNI-06).** You said a high-level athlete who demands more of his muscles to grow gets the same-pattern push ("drive a lot harder into that muscle"). Is that every L3 athlete in the off-season, or only those whose goal is size (linemen, wrestlers, rugby, heavyweights, throwers)?
11. **Fourth aerobic session (ATH-07 vs the cheat sheet).** Aesthetics clients now get 4 aerobic sessions + long walks, but the cheat sheet says never the same colour twice and 3 a week. Is the 4th an easy repeat colour, or are the post-workout long walks the 4th? Does "4 for aesthetics bodybuilders" cover general physique clients too (we assume yes), or only competitive bodybuilders (then general physique clients get 3)? Do bootcamp circuits count toward a fat-loss client's 3?
12. **Calves and rear delts in short sessions (VOL-17 + VOL-08).** In a 45-60 min session, may calves and rear delts be supersetted with another small-muscle exercise so the session stays at 6-7 stations?
13. **Hybrid / CrossFit calves and rear delts (VOL-17).** In 60-min hybrid or class sessions we do the 3 calf sets in the strength lift's rest period and put one rear-delt station on one day a week. OK, or would you rather shorten the WOD?
14. **Tracking (GEN-03 vs GEN-05).** You marked 'adjust week to week from logged effort' RIGHT, but you are unsure clients should track in the tool. Should adjustment run only for users who choose to log, with a preset progression for everyone else?
15. **COD placement (ATH-06).** Every generated athletic week from 60 min now has COD (hip days from 60 min, knee days from 75, the 3-day S1 from 60). Your STARTING sessions and the BASEBALL sheet have none. Should BASEBALL and in-season weeks get a COD station too, or does sport practice cover it?

---

## 12. Sources and science references

**Coach answers (AUTHORITATIVE):** `coach_answers_full.md` (138 of 140 questions, 2026-10-08) and `coach_answers.md` (chat statements). Question IDs are cited as COACH-ANSWER <ID>.

**Coach material** (all read-only):
- BYOP tabs 00-08 and 09 (library wiring).
- MASTER_MODEL tabs 'EXAMPLE UPPERLOWER SPLIT', 'EXAMPLE PUSHPULLLEGS SPLIT', 'EXAMPLE FAT BURNBODY TONING PRO', 'EXAMPLE ATHLETIC FULL BODY SPLI', 'EXAMPLE BOXING 8 WEEK BUILD UP', 'BASEBALL', 'EXAMPLE CROSSFIT SPLIT', '(NOT DONE) 4 TRACKS PROGRAMMING', '(NOT DONE) EXAMPLE CONJUGATE', 'AEROBIC CAPACITY CHEAT SHEET', 'ALL ABOUT SQUATS', '(NOT DONE) ALL ABOUT BALLISTICS', '(NOT DONE) RESISTANCE PATTERNS ', 'Sheet24', 'Sheet25'.
- All of it via the decode files in `analysis/`, plus the raw spot-checks listed at the top.

**Science** (general literature, cited from knowledge; not re-verified against full texts in this session):
- Simão R, et al. (2012). Exercise order in resistance training. *Sports Medicine* 42(3):251-265.
- Schoenfeld BJ, Ogborn D, Krieger JW (2016). Effects of resistance training frequency on measures of muscle hypertrophy: a systematic review and meta-analysis. *Sports Medicine* 46(11):1689-1697.
- Schoenfeld BJ, Ogborn D, Krieger JW (2017). Dose-response relationship between weekly resistance training volume and increases in muscle mass. *Journal of Sports Sciences* 35(11):1073-1082.
- Schoenfeld BJ, Grgic J, Krieger J (2019). How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis of studies examining the effects of resistance training frequency. *Journal of Sports Sciences* 37(11):1286-1295 (volume-equated frequency).
- Robbins DW, Young WB, Behm DG, Payne WR (2010). Agonist-antagonist paired set resistance training: a brief review. *Journal of Strength and Conditioning Research* 24(10):2873-2882.
- Weakley JJS, et al. (2017). The effects of traditional, superset, and tri-set resistance training structures on perceived intensity and physiological responses. *European Journal of Applied Physiology* 117:1877-1889.
- Iversen VM, et al. (2021). No time to lift? Designing time-efficient training programs for strength and hypertrophy: a narrative review. *Sports Medicine* 51:2079-2095.
- Seitz LB, Haff GG (2016). Factors modulating post-activation potentiation of jump, sprint, throw, and upper-body ballistic performances: a systematic review with meta-analysis. *Sports Medicine* 46(2):231-240.
- Haff GG, Triplett NT (eds.) (2016). *Essentials of Strength Training and Conditioning*, 4th ed. (exercise order; plyometric contacts per session).
- Israetel M, Hoffmann J, Davis M, Feather J (2021). *Scientific Principles of Hypertrophy Training* (Renaissance Periodization), for the MEV/MAV/MRV volume landmarks. (Israetel, Hoffmann & Smith is the author team of the separate *Scientific Principles of Strength Training*, 2015.)

---

## Verification log - v0 pass 1 (history)

*These two v0 logs record how the OBSERVED content was fact-checked. Where they mention rules or open questions, the v1 rules and section 11 above take precedence.*

Adversarial fact-check run on 2026-10-07. Every OBSERVED claim was checked against `dumps/BYOP`, `dumps/MASTER_MODEL`, sheet visibility in `raw/*.xlsx` (openpyxl, read-only) and the decode files in `analysis/`. No Google Sheet was opened. `05_templates.json` was patched to match; its `_meta.verification.changes` lists the same items.

### Numbers recomputed independently from the dumps (python on the dump files)

| Claim | Recomputed | Result |
|---|---|---|
| AESTHETICS Day 1 = 7 exercises / 19 sets | 7 / 19 | confirmed |
| JUSTICE LEAGUE Monday = 10 exercises / 20 sets (10 athletic + 10 resistance) | 10 / 20 | confirmed |
| MM UL sets: lower 20-32, upper 24-27 | lower 20 / 30 / 32, upper 24 / 24 / 27 (novice / newby / intermediate) | confirmed |
| FAT BURN weekly sets 60, 60, 64, 70 | 60, 60, 64, 70 | confirmed |
| STRENGTH-8 56 sets/week; CONJUGATE 60 | 56; 60 | confirmed |
| BASEBALL exercises per session median 9 (6-11) | own grid parser: median 9, range 6-11 (counting the OLY row) | confirmed |
| BASEBALL 'Superset - same reps' 19x, 'Superset - max reps' 5x | 19, 5 | confirmed |
| BASEBALL calf slot ballistic ~43% | decode 20/46 = 43%; label-based recount 16/39 = 41% | confirmed (approx.) |
| BASEBALL buy-outs "3-4 bouts a week" | 0-5 per week; block means 3.3 / 3.3 / 3.8 only over loaded weeks; filled on 2-4 of the 4 days | **corrected** |
| CrossFit aerobic sessions 2/2/3/4 at levels 1-4 | Mon+Thu at L1-2, + Sat at L3, + Tue + Sat at L4 | confirmed |
| Athletic example 89 -> 72 -> 59 sets/week | 35+24+30 / 21+10+25+16 / 14+19+17+9 under the component-set convention | confirmed, but **relabelled** as computed, not OBSERVED |
| Boxing week 7: eleven rows drop 3 -> 2 sets | 11 rows | confirmed |

### Corrections made

1. **Sunday 'OFF' "in every BYOP tab"** was wrong. It appears in 7 of 9 program tabs; 'AESTHETICS - FULL BODY - 4 DAYS' and '3 DAY BUILDER' have no weekday or OFF labels (6.7, JSON `off_days`).
2. **Horizontal-before-vertical pull** was wrong. The doc said FAT BURN, 4 TRACKS and boxing "flip the lead each week". In fact they put the **vertical pull first every time** (audit R1: 0/8, 0/38, 0/2), while BYOP, UL and PPL put the row first (19/19). This is a workbook-level split. Rewritten in 3.3, added as generator step 6 in 3.5, open question 22 added, and the FAT BURN pull order noted in 2.2.
3. **Tiers 5/6 evidence** was overstated. "Bilateral + horizontal upper / unilateral + vertical upper" is BYOP-only. BASEBALL Part C pairs the bilateral lift with V on Thu/Fri, and Part D pairs the unilateral lift with two isolations. MASTER_MODEL bilateral+H vs +V is 70 vs 68 (audit N18). Fixed in 3.1 and in the section 5 superset rule.
4. **Audit counts mis-copied:** R9 BASEBALL 91/91 -> **92/92**; R8 BASEBALL 90/91 -> **91/92**; N18 MASTER_MODEL 70 vs 67 -> **70 vs 68**. Added the overall R9 figure (160/193) and the weak tabs, so "20 of 22" is no longer read as universal (0, 4.2).
5. **Audit N6** "bilateral before single-leg" was presented as OBSERVED; it holds in only 12/21 sessions. Split it out as WEAK (3.3).
6. **Sheet25** was listed as an "all four patterns" leg day. It has no unilateral hip-dominant header (2.7, 4.1).
7. **MM athletic Mid/Advanced descriptions** merged days inaccurately. M1 orders bench before deadlift; A1 and A3 have no upper-body lift; M2 and A4 have no upper compound; A3 was missing. Table rewritten; G8 and the lower-pairing matrix narrowed to the days that actually fit (2.3, 4.1, 4.3).
8. **Starting S1** has 3 jumps, not "2 plyos" (8.2).
9. **BASEBALL Thursday 'strength'** was presented as OBSERVED. Thursday is never tagged; 16/22 Thursday main lifts are strength lifts, so this is INFERRED (2.4). Also listed exactly which weeks carry the OPTIONAL PIECE OLY.
10. **BASEBALL "DB-only pressing"** was wrong. The bench is DB-only, but 'barbell press' (2 rows) and 'barbell overhead strict press' (1 row) exist (8.2, JSON sport dial).
11. **Buy-out dose list (JSON)** included 'Fast run/ walk back or 3 min walk/rest' (DI29, DL47, CC48). That is a Part A 'LOWER ballistics/plyo' sprint, not a Part E buy-out. Removed and noted. The weekly dose was restated as a mean with a 0-5 range, and the generator rule changed from "every session" to "2-4 days a week", which is what the coach does (6.6, 6.8).
12. **"All buy-outs in 'SPEED POWER'"** softened: 10-12 cal bouts overlap 'SPEED STRENGTH & POWER' '0-12 Secs'.
13. **Week shape "OBSERVED in ... MM UL ... and BASEBALL"** was overstated. The UL week is inferred from the A5 note, and BASEBALL has no optional blocks. The 5-day optional reading is marked INFERRED (0).
14. **CrossFit:** 'SAT aerobic and WOD at levels 3-4' corrected (Saturday WOD only in MAY). "WODs and skill on upper days" qualified (they spread to Mon/Thu at WOD levels 3-4). Class "WED/SAT WOD only" marked INFERRED (the columns are blank). "Class tests in week 8" marked INFERRED (the cell holds '5') (2.5, 6.11, JSON OT17/OT18/hybrid 6-day).
15. **HYBRID 'AMRAP' 12->20** is a header row (D70). Its link to the Saturday circuit is now marked INFERRED. "Wed and Sun off" changed to "not listed". The A/C colour mapping for HYBRID and boxing conditioning is marked INFERRED (2.6, 5, 6.6).
16. **"Consecutive days never repeat the same lower dominance"** was too strong. HYBRID runs hip-dominant Thu ('DEADLIFTS') then Fri ('uni RDL...') (6.4).
17. **BYOP conditioning "only on Wed/Sat optional blocks"** ignored BOOTCAMP 2, which has 'Cardio' in every session (6.6).
18. **No-equipment overclaim:** the BOOTCAMP 2 menus do **not** have bodyweight options "in every slot". AS (bicep), AT (tricep) and AH (side raises) are all equipment-based, except 'TRX Bicep Curls'. A substitution row was added for those slots (8.6, JSON).
19. **Session sizes:** set counts for empty templates (3 DAY BUILDER, BYOP PPL, BOOTCAMP 1/2, optional day) are now marked "(assumed)". MM athletic movements corrected to 4-13 (excluding throws) (7.1, JSON `session_budget`).
20. **Time model:** the ALL ABOUT SQUATS strength column is 2-5 reps, not 3-6. The BASEBALL "73 with OLY" calibration is flagged hypothetical (B2 'WK 1' has no OLY) (7.2).
21. **Evidence tags in section 8:** aesthetics 3-day (weekday mapping and "45-min version" INFERRED), athletic 3-day (weekday placement INFERRED), strength 3-day (the class trio sits Mon/Tue/Thu; Mon/Wed/Fri INFERRED), fat-loss 6-day (weekday mapping INFERRED), hybrid 6-day (Sunday not listed).
22. **Smaller fixes:** OT01 Day 2 now lists 'Staggered Stance DL w/ DB ' (sets 'CHOOSE 👇'); BOOTCAMP 1 "empty" except E30 'Leg extensions'; FAT BURN deadlift labels quoted verbatim ('DEALIFTS'); MM PPL legs "copied verbatim" corrected (novice reps differ); boxing Friday weeks 1-2 has no curls or skull crushers; Sheet24 credited to 'CHRIS HINSHAW' (external plan); tier 7 "every template" now names its exceptions; OT19 vs OT20 press rotation separated; OT08 frequency evidence marked as depending on an inferred week.

### Science checks

- Simão 2012, Schoenfeld 2016/2017, Robbins 2010, Weakley 2017, Iversen 2021, Seitz & Haff 2016 and Haff & Triplett 2016: citations are plausible as given.
- **Frequency claim:** the "volume-equated frequency matters little" half needs Schoenfeld, Grgic & Krieger 2019, which is now added. "Consistent with the coach raising sets per slot when frequency drops" was unsupported (no sheet shows it) and is now marked INFERRED.
- **Israetel citation fixed:** *Scientific Principles of Hypertrophy Training* is by Israetel, Hoffmann, Davis & Feather (2021). Israetel, Hoffmann & Smith wrote the separate strength-training book.
- **Per-session ceiling:** "6-10 hard sets per muscle per session" is a weak practitioner heuristic. Schoenfeld 2017 is a weekly dose-response and does not support it; reworded.
- **Contrast training:** the PAPE literature favours several minutes of rest, but the coach writes 'directly into' / 'immediately into'. The doc now keeps the coach's format, flags the gap, and adds open question 23 instead of turning his practice into the textbook version.
- **NSCA plyometric guidance** in the JSON sport dial (80-100 / 100-120 / 120-140 contacts per session) matches the NSCA per-session recommendation. It was left unchanged.

---

## Verification log - v0 pass 2 (history)

A second adversarial fact-check ran on 2026-10-08, after the pass above. Every OBSERVED claim was re-read against `dumps/BYOP` and `dumps/MASTER_MODEL`. Grids were rebuilt from the dumps with python. Sheet visibility was re-checked in `raw/*.xlsx` (openpyxl, read-only), and `analysis/equipment/ordering_audit.md` was cross-read. No Google Sheet was opened. `05_templates.json` was patched to match; its `_meta.verification_pass_2.changes` lists the same items.

### Numbers recomputed independently (python on the dump files)

| Claim | Recomputed | Result |
|---|---|---|
| AESTHETICS Day 1 = 7 exercises / 19 sets | 7 / 19 | confirmed |
| JUSTICE LEAGUE Monday = 10 exercises / 20 sets (10 + 10) | 10 / 20 (10 athletic + 10 resistance) | confirmed |
| FAT BURN weekly sets 60, 60, 64, 70; 14-18 per session | sessions WK1 15/15/15/15, WK2 14/16/14/16, WK3 15/17/15/17, WK4 17/18/17/18 | confirmed |
| STRENGTH-8 56 sets/week; CONJUGATE 60 | 14+15+16+11 = 56; 15+16+16+13 = 60 | confirmed (per-day values added to 7.1) |
| BASEBALL buy-out block means 3.3 / 3.3 / 3.8 | weekly bouts B1 0,5,2,5,5,3,3,(0); B2 4,2,4,3,3,3,4,(deload 0); B3 3,4,3,4,5,3,5,3 -> 23/7, 23/7, 30/8 | confirmed; per-week list added |
| BASEBALL Part C 2nd row 'Superset - same reps' 19 / 'max reps' 5 | 19 / 5, **plus 'heavy Max reps' 6** | **incomplete -> fixed** |
| BASEBALL day tags 'Speed' / 'strength' / 'speed' | 33 tag cells in only 11 of 24 grids | **coverage added** |
| BASEBALL calf slot hops 16 of 39 (label-based) | 13 'calfs' + 3 'calf' rows = 16 hops; 40 filled rows minus 1 misaligned (P37 'Bicep hammer Curls') = 39 | confirmed |
| BASEBALL exercises per session median 9 | own rough grid parser: median 9 | confirmed |
| CrossFit aerobic sessions 2/2/3/4 at levels 1-4 | MAR/JUN 2; APR/JUL/OCT 2; MAY/AUG/NOV 3; SEPT/DEC 4 | confirmed |
| CrossFit "WODs/skill on upper days, spreading to Mon/Thu at WOD levels 3-4 (SEPT, NOV, DEC, JAN, MAY)" | AUG (level 3) Tue/Fri only; NOV Mon/Tue/Fri; MAY Mon/Thu/Sat; JAN has no WOD level; skill unrelated to WOD level | **wrong -> rewritten** |
| FAT BURN "all four vectors on every upper day" | true vertical press in 2 of 8 upper sessions; none in WK2-3 | **wrong -> fixed** |
| Boxing week 7: eleven rows 3 -> 2 sets | 11 | confirmed |
| MM athletic 89 -> 72 -> 59 | same under the stated convention; Advanced = 61 if A4's '&' cell is split like M1's | sensitivity noted |

### Corrections made

1. **Session order: core primer vs Olympic lift.** The master order put the core primer after TRIPLE EXTENSION/OLY (tier "4b"). No observed session does that. BASEBALL Part B always sits above the 'OPTIONAL PIECE' 'OLY' row (CI31 -> CI33 -> CI34; BC49 -> BC51 -> BC52). MM M2/A3/A4 and boxing weeks 3-8 Thursday put core before the clean/snatch, and A1/M3 put it even before the jumps. The tier is renamed 3b and moved before tier 4 in section 0, 3.1, 6.9, the 2-day athletic template (8.2), JSON `master_order_string`/`tiers` and the athletic 2-day stations.
2. **Tier 5 "BYOP resistance slots 1-2 always carry the horizontal vector"** was false. BOOTCAMP 1 Tue/Fri slot 2 is 'Vertical Pull' (D11/D32), with 'Horizontal Push' 4th. Section 3.2 had BOOTCAMP 1 at "4/4, none"; corrected to 2/4. The audit (R9, Q7) already flagged it.
3. **Upper pairing "20 of 22"** missed HYBRID Saturday. That is a knee day, its label row C101 reads 'VEr pull/ hor push', and its circuit carries push-ups or DB bench in weeks 1, 3, 5, 7. The count is now 20 of 23, explicitly day-level, with the BOOTCAMP 1 slot-level failure noted (0, 4.2, open question 2, JSON).
4. **"All four lower patterns on every lower day" for AESTHETICS-12 (OT22)** was false. Friday has 'DEADLIFTS' only in week 1; weeks 2-12 have no bilateral hinge. A matrix row was added, and 2.6, 4.1, 4.3 G5 and 6.2 were qualified.
5. **Vertical press.** "All four vectors" for FAT BURN (6.1) and the G4 grammar was false: FAT BURN WK2-3 and AESTHETICS-8 weeks 2, 3, 6, 7 have no vertical press ('UPRIGHT ROWS' / 'SIDE RAISES' instead; upright rows are filed under the Focus list AZ52-AZ53). Exemptions were added (2.2, 2.6, 4.3, 6.1, 6.2). The INFERRED "V press >= 1x" default was softened, and open question 24 added.
6. **Jump/medball dominance theme.** "Jump day = hip, medball day = knee" (4.1, G8) holds only in MID/ADVANCED. In STARTING, S1 (jump) is knee and S2 (medball) is hip.
7. **CONJUGATE "no sets ladder"** was false. E9:L10 hold a two-row ladder equal to STRENGTH-8 rows 5-6. Other differences were listed (Saturday 'the work' 5 sets) (2.6, JSON OT24).
8. **CrossFit Saturday** "aerobic/WOD at levels 3-4" in 8.5 and the JSON hybrid 4-day layout was corrected: Saturday WOD only in MAY. WOD and skill days are now listed by month (2.5, 6.4, JSON OT17 + hybrid 4; Thursday skill/WOD slots added). Open question 25 added.
9. **Myo set "only on the last 1-2 exercises, machine or isolation"** omitted 'ALL ABOUT SQUATS' A27 3 x '15/5/5/5/5/5' '**MYO SET - ADVANCED' in the free-weight squat column (5, JSON).
10. **BASEBALL bench.** "one unnamed 'fast banded assisted bench press'" -> two rows (DL52, CC53) (8.2, JSON).
11. **BASEBALL block endings / 8-week rule.** Block 3 (in-season) has no deload or recovery week. HYBRID (8 weeks) has no deload/test week. Boxing week 7 is a mini-deload and week 8 a peak. Section 6.11 and JSON `deload_test_architecture` were qualified. JSON OT16 in-season dose "main lifts 4x10" corrected: 4 x 8 in weeks 1-2, '10/10/8/8' in week 3, 4 x 10 in weeks 4-8.
12. **'THURSDAY' label.** BYOP ATHLETIC and JUSTICE LEAGUE leave B30:B39 blank; only the hidden NO ACCESS copy writes 'THURSDAY'. Noted in 0, 2.1 and JSON OT04/OT04b. OT04c's only filled cells ('Leg extensions' E12/E39) added.
13. **Optional-block rule** "never holds bilateral heavy lifts" is labelled as the generator's own choice. The coach's Focus menu offers 'Back squats' AZ12, 'Zercher squats' AZ11, 'Leg press' AZ10, 'barbell overhead press' AZ46 (6.5, JSON).
14. **Isolation-follows-compound** now cites the BOOTCAMP 2 inverse ('Bicep' on press day 2A, 'Tricep' on pull day 3A) and the full N1 counts (3.3, JSON).
15. **Evidence tags tightened:** strength 4-day Tue/Fri/Sun and HYBRID Wed/Sun are "not listed" (OFF INFERRED); fat-loss 5-day layout INFERRED; athletic 4-day `[ | ]` pairings INFERRED (BYOP lists straight slots); OT08's weekday layout INFERRED in 8.1; CrossFit "WODs carry the rest" INFERRED; JSON boxing A/C colours INFERRED; JSON CrossFit "JANUARY Wednesday is the event start" changed to INFERRED.
16. **Smaller fixes:**
    - STRENGTH "4 slots (3 on DE upper)" applies to STRENGTH-8/CONJUGATE only; STRENGTH-12 DE upper has 4, and its accessory sets are unwritten.
    - OT19 upper-day pull is not a strict H/V alternation.
    - AESTHETICS-8 lead lift alternates in weeks 1-6 only.
    - A1 puts rockers before the jump; A2 has no cross connects.
    - PPL push puts 'Vertical Push' before 'Incline', and the 'Flies' dropdown is the whole AD list.
    - 'Reverse Lunges (Bodyweight or DBs)' quoted in full.
    - Section 10 #2: arms removed from the main days, not moved to optional days.
17. **Missed items added:**
    - 4 TRACKS A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING' and A2 '*This is what I sell online to my athletes...' (2.6).
    - MM athletic A41:A45 'First 8 weeks (8wk1) adaptation focus' (2.3).
    - JSON `tier_note`: bucket_ids put RP_VPUSH/RP_VPULL at tier 5 while `tiers[]` puts the second upper vector at tier 6; the sort must use slot position.

### Science checks (pass 2)

- All ten references were re-checked for author, year, journal and pages, from knowledge and not against the full texts. They are correct as listed, including Weakley et al. 2017 *EJAP* 117:1877-1889 and Iversen et al. 2021 *Sports Med* 51:2079-2095.
- **Seitz & Haff 2016** use the term "post-activation potentiation", not PAPE. Their meta-analysis favoured longer recovery (about 5-7 min) over short recovery. The text now says so. It also says that immediate-transition French-contrast complexes are an established coaching method, so the coach's format is kept and is not called an error.
- Frequency (Schoenfeld 2016/2019), exercise order (Simão 2012), paired sets (Robbins 2010, Weakley 2017, Iversen 2021) and the NSCA plyometric contact ranges were re-read in context. No other change was needed.

---

## Verification log - v1 (2026-10-08)

- `coach_answers_full.md` was read in full; every answer listed in the task (ORD-01..11, ATH-11, UNI-06/09/11, PER-04, VOL-07/08/16/17, PRG-02/03/05/06/07, FIX-03, ATH-13) plus the related answers that touch session architecture (ATH-01/02/04/05/06/07/09/10/12, CAT-08/09/10/11/13, EQ-01/03/06/07/08/10/11/12/14, LIB-06/07/09/13/16/19/22, PER-01/02/03/05/07/08, PRG-04/09/11, UNI-01/02/03/05/08/10/12, VOL-03/05/06/09/10/11/13/14/15) was applied and cited.
- The 30 split templates and their variants were rebuilt by a python script (project venv) that also checks them: weekly exposures of the 8 primary patterns, slot-level pairing (UNI-11), axial exposures (PER-04), core block first (ATH-11), horizontal before vertical unless the vertical lift is the work (ORD-01, ORD-02), Olympic before the work (ORD-03), the station cap by length (VOL-08) and a time estimate (UNI-09, PRG-03). Result: no failures; the only flags are the documented observed-design exemptions in 8.7.
- Scan for retired ideas: no band or variable-resistance option in any generator pool (verbatim sheet quotes that contain 'banded' remain as evidence only); no size-based 3%/7% rule; helpers 0.25; no "core after the power block" default; no pulldown-first default; no hack-squat ranking; 'JUSTICE LEAGUE' appears only as a cited tab name with its generic name.
- OBSERVED content (sections 2, 3.2, 4.3, 5.4, 6.1, 6.8, 6.9, 7.3) is unchanged from the v0 fact-checks below, except for added v1 notes.

---

## v1 verification log

*Adversarial check of the v1 update to this file and `05_templates.json`, run on 2026-10-08 after the v1 log above. `coach_answers_full.md` and `coach_answers.md` were re-read in full. Each coach answer that touches session or week architecture was checked against the rules, the tables, the worked templates, the JSON stations and the recomputed checks, not only against the changelog. Fixes were made in place. The JSON template fixes were made by rebuilding the templates with a patched copy of the v1 build script and re-running its checks; nothing was hand-typed into the check tables. No Google Sheet was opened.*

### Coach answers checked

| Area | Answers | Result |
|---|---|---|
| Order | ORD-01, ORD-02, ORD-03, ORD-04, ORD-08, ORD-09, ATH-11, CAT-08 | Reflected in rules, templates and JSON. Core first for everyone and movable, warm-up always, row before pulldown, the work first, power before strength, calves / side raises first only for a priority. |
| Pairing | UNI-11, ORD-06, UNI-06 | Reflected at slot level. BOOTCAMP 1 Tue/Fri corrected. Same pattern by goal, cross pattern for bootcamp, fat loss and athletes. **Two templates still put two lower compounds back to back in a mixed session; fixed (items 6-7).** |
| Supersets, contrast, circuits | ORD-05, ATH-12, PRG-03, PRG-11 | Reflected (four use cases; L2+ off-season contrast with no rest; 5-7 stations x 3-5 rounds x 30-50 s in 35-45 min; circuits are finishers). |
| Session size | UNI-09, VOL-08, VOL-16, VOL-17 | Lengths and caps reflected. **VOL-17 was only partly applied: calves were missing or 90+ only on some leg days, in-season calves were 2 sets, and several weeks had no rear-delt sets at their default length; fixed (items 1-4).** |
| Week | PER-04, EQ-11, EQ-03, PER-02, PER-03, PRG-02, ORD-10, ORD-11, PER-08, UNI-10 | Axial budget (at most 1 squat + 1 hinge) holds in every template. Belt squat and leg press are the second squat exposure. Optional days are separate by default. **PER-08 in-season wording fixed (item 5).** |
| Aerobic | ATH-07, EQ-14, ORD-09 | Rule stated, **but many week layouts hold fewer sessions than the target (aesthetics 5-day holds 1 vs 3-4; fat-loss 6-day and PPL x2 hold 0) with no note; fixed (item 8).** |
| Volume hooks | VOL-05, VOL-06, VOL-07, VOL-09, VOL-10, UNI-01, LIB-16, UNI-05 | Reflected: 3/5/7% chosen by the person's state; 2/2/2 -> 4/3/3 add order; helpers 0.25; dips 0.5/0.5; 10/10 = 1 set; athletic patterns 0. |
| Athletes | ATH-01, ATH-02, ATH-04, ATH-05, ATH-06, ATH-08, ATH-09, ATH-10, ATH-13, CAT-10, CAT-11, CAT-13, UNI-02, UNI-03, UNI-12, PRG-04, PRG-09 | Reflected in the sport dial and templates. **EQ-03 / ATH-09 limits (older clients: few plyos; never depth jumps) were missing from the plyo stations; added (item 9).** |
| Plan shapes, deload, tests | PER-01, PER-05, PER-07 | Reflected in 6.12 and the JSON `v1_rule`. **But the JSON block was still headed `status: OBSERVED`, with the observed 8- and 12-week endings as bare keys next to the v1 rule; fixed (item 10).** |
| Equipment | EQ-01, EQ-02, EQ-07, EQ-08, EQ-10, EQ-12, EQ-06, LIB-09 | No band or variable-resistance option is in any generator pool. **Five observed templates quoted banded items without saying they are out; v1 notes added (item 11).** |
| Levels, names, dose notation | PRG-05, PRG-06, PRG-07, FIX-03, CAT-05, CAT-06, VOL-11, VOL-15 | Reflected. |
| Generator | GEN-01, GEN-02, GEN-04, GEN-05, GEN-08, GEN-03 | Reflected, **except the GEN-03 / GEN-05 conflict on tracking, which step 9 ignored; fixed (item 12).** |

### Retired ideas: scan of both files (markdown and every JSON string)

| Retired idea | Result |
|---|---|
| Size-based 3/5/7% (big = 3%, small = 7%) | Gone. Only "not by muscle size" (VOL-05) remains. |
| 0.5 helper credit | Gone. Helpers 0.25; the only 0.5 is the dips 0.5/0.5 rule (LIB-16). |
| Band / chain / weight-releaser substitutes | None in any generator pool. Banded wording survives only in verbatim OBSERVED quotes, and each of those templates now says the item is out (EQ-01, EQ-12). |
| Plyo zones as a fixed exercise property | Gone. The method progression is described as "not a zone" (CAT-10, CAT-11). |
| Core after the power block as the default | Gone. Core first in every family; v0 placements are labelled superseded. |
| Sex-based rules | None. "No sex-based rules" (ATH-09); no sex field in the inputs (GEN-02). |
| 'Justice League' as a program name | Only as a cited tab name. The generator name is *Athletic Performance - Non-Competitive* (ATH-13, FIX-03). |
| Hack squat ranked last | Gone. Machines are not ranked (EQ-11). Hack squat / pendulum stay out of the non-axial squat pool only because of shoulder-pad loading (INFERRED, open question 11.2-1). |
| 6-week = 5 weeks + deload (and 8 = 7 + 1, 12 = 6 + 1 + 5) | Gone from the rules. Kept only as OBSERVED tab endings, now explicitly labelled evidence-only, with the v0 rules listed as retired (JSON `deload_test_architecture.retired_v0_rules`). |

### Problems found and fixed

1. **Calves on every leg day (COACH-ANSWER VOL-17).** Three gaps:
   - The hybrid / CrossFit leg days had calves only at 90+ min.
   - The hybrid 5-day Saturday leg day had none.
   - The BASEBALL Parts variant had none on its Tue/Fri leg days. The sheet has no calf slot on those days, although the 2.4 note already said calves were added.

   All three now carry 3 sets at every length. In hybrid sessions under 75 min the calf sets go in the strength lift's rest period, the way the HYBRID tab does its accessories (INFERRED; question 11.2-13).
2. **In-season calves were 2 sets** while the station note said 3. Now 3 (VOL-17).
3. **Rear delts every week (COACH-ANSWER VOL-17).** At their default lengths several weeks had no rear-delt station:
   - athletic 2/4/5/6-day and the same-pattern variant at 60 min (the non-competitive default);
   - the in-season variant;
   - every hybrid week;
   - fat-loss and no-equipment 2/4-day at 45 min;
   - aesthetics at 45 min.

   Fixes:
   - athletic knee + pull days: rear delt from 60 min;
   - aesthetics A days and 3-day Day C, fat-loss and no-equipment A days: rear delt from 45 min;
   - in-season A day: rear delt added;
   - hybrid: one station on HY2 and on the class squat day.

   Cut orders now say calves and the week's rear-delt station are never cut.
4. **Cut / add orders and the stations-by-length table** listed "rear delt" as an early cut for athletes. Updated in 7.5, 7.6 and the JSON `session_length_model`.
5. **In-season slot (COACH-ANSWER PER-08).** The note read "others: jumps". It now reads: speed athletes keep sprints; other athletes keep strength maintenance (the slot may be dropped) or jumps.
6. **Athletic 3-day S3 at 60 min** dropped its press, which put the snatch-grip deadlift and the walking lunges back to back. That is the bleed-over UNI-11 avoids. The press is now kept at every length (~63 min).
7. **Strength 2-day FB_ME** ran hinge accessory -> single-leg hinge back to back. The hinge accessory now comes before the upper press, so lower and upper alternate (INFERRED order).
8. **Aerobic sessions (COACH-ANSWER ATH-07).** Every JSON template and variant now has an `aerobic_ATH07` block:
   - sessions in the week layout (an optional day counts 1);
   - the population target;
   - add-ons still needed;
   - how to add them (separate day if a full OFF day remains, otherwise an add-on after lifting, or long walks for bodybuilders).

   Pointers were added in 6.7, 8.1 and 8.4.
9. **Older / injured clients on athletic plyo stations (COACH-ANSWER ATH-09, EQ-03).** Every plyo station now says older clients get few plyos unless they ask, and older / injured / high-volume clients never do depth jumps. The S1 depth-jump station names a substitute.
10. **JSON `rules.deload_test_architecture`.** The status now says the v1 rule governs and the observed 8/12-week endings are evidence only. A `retired_v0_rules` entry lists the retired 8 = 7 + 1, 12 = 6 + 1 + 5 and 6 = 5 + 1 shapes (PER-01).
11. **Observed-template v1 notes.**
    - Notes added where they were missing: OT04c, OT07 (PRG-01 / FIX-01 skipped), OT09, OT14, OT17, OT18, OT20.
    - Banded items explicitly retired: OT12 banded pulldowns, OT15 reverse-banded squirrel jumps, OT16 banded deadlifts / bench / hops, OT19 'FAST BANDED BENCH PRESS', OT25 reverse-banded squat jumps (EQ-01, EQ-12).
12. **GEN-03 vs GEN-05.** Step 9 assumed every client logs effort. It now adjusts from logs only when the user chooses to log, and otherwise follows the preset progression (PROPOSED - PENDING COACH APPROVAL). Asked as question 11.2-14.
13. **Smaller fixes.**
    - The BASEBALL Parts Tue OLY is marked (75+), as in the JSON.
    - The isolation-follows-compound rule notes the hybrid rear-delt placement.
    - Changelog row 17 is updated.
    - Question 11.2-9 now notes the accessory / survival adjacency that the INFERRED conjugate re-order creates.

### Checks recomputed (python, project venv)

- Templates rebuilt with the v1 build logic plus the fixes above. The checks were then re-run for every template and variant at each family's default lengths: pattern exposures, axial budget, slot pairing, core first, H before V, Olympic before the work, the cap and the time estimate. All results are "ok" or a documented observed-design exemption. The 8.7 table was regenerated from the JSON; a renderer that reproduced the previous table exactly was used, so only the changed rows moved.
- An independent audit script also checked:
  - calves at 3 sets on every leg day;
  - at least one rear-delt station a week;
  - no two lower compounds back to back in a mixed session;
  - no medball in aesthetics;
  - no band text in any station.

  Its only remaining flag is the conjugate ME lower day: the max-effort lower day is lower-dominant, the OBSERVED design already puts squat and hinge back to back, and question 11.2-9 is open. Circuit calf stations are dosed in rounds (3-5 x 30-50 s), not sets, by design (PRG-03).
- Time impact of the fixes:
  - athletic 60-min knee days ~64 min (cap tolerance 65);
  - BASEBALL Parts Tue/Fri ~64 / ~78 min at 60 / 90;
  - fat-loss / no-equipment A days at 45 min ~46 min;
  - hybrid HY2 ~60 min and the class squat day ~56 min at 60;
  - all within the existing 8% tolerance.

### Not changed (flagged)

- Strength plans at 60 min (not a default length) have no rear-delt station on the 2-day FB_ME. The default is 90 min.
- GEN-01 (full Spanish toggle): this file carries Spanish names for programs, optional days and aerobic days only. Day-type labels are not yet translated; that belongs to the generator spec.
- Backups of both files from before this check are in the session scratchpad (`05_templates.pre_v1verify.json`, `05_session_architecture.pre_v1verify.md`).

---

## v1 verification log (pass 2)

*This was a second adversarial check of the v1 update to this file and to `05_templates.json`, run on 2026-10-08 after the first v1 verification log above. Both `coach_answers_full.md` and `coach_answers.md` were re-read in full. Every answer that touches session or week architecture was checked against the rules, the tables, the worked templates, the JSON stations and the recomputed checks, not only against the changelogs.*

*The JSON templates were fixed by rebuilding them with a patched copy of the v1 build script, `build_templates_v1c.py`. That script reproduces the previously installed templates exactly before the patches are applied. It was then merged into the file, and all checks were re-run. Non-template JSON text was patched with python. Nothing was hand-typed into a check table, and no Google Sheet was opened.*

### Coach answers checked

| Area | Answers | Result |
|---|---|---|
| Order | ORD-01, ORD-02, ORD-03, ORD-04, ORD-08, ORD-09, ATH-11, CAT-08, LIB-21, LIB-05 | Rules, templates and JSON already reflected these, with three exceptions, now fixed: **LIB-21 (fixed speed-session order) and LIB-05 (one plyo from each MODERATE track) were missing from the ordering rules** (fix 6); **OT14, OT21 and OT22 quoted pulldown-first orders without a v1 note** (fix 7). |
| Pairing | UNI-11, ORD-06, UNI-06 | Pairing was right at slot level. **The same-pattern athletic variant was tied only to size sports, an INFERRED reading. The coach's own trigger is "a high-level athlete... demanding more of their muscles"** (fix 4). |
| Supersets, contrast, circuits | ORD-05, ATH-12, PRG-03, PRG-11 | Reflected. |
| Session size | UNI-09, VOL-08, VOL-16, VOL-17 | Lengths and caps were reflected. **VOL-17 "about 2 core exercises" was not met in the BASEBALL Parts days (1 core exercise) or in the hybrid WOD-only class (1)** (fix 2). |
| Week | PER-04, EQ-11, EQ-03, PER-02, PER-03, PRG-02, ORD-10, ORD-11, PER-08, UNI-10 | Reflected. The axial budget holds in every template. |
| Aerobic | ATH-07, EQ-14, ORD-09 | **The JSON gave aesthetics clients two targets: "general physique 3 / bodybuilder 4". The 0 table, 6.7, `rules.conditioning_days` and bucket COND_AEROBIC all say "4 aesthetics / bodybuilders"** (fix 3). |
| Athletes | ATH-01, ATH-02, ATH-03, ATH-04, ATH-05, ATH-06, ATH-08, ATH-09, ATH-10, ATH-12, ATH-13, CAT-10, CAT-11, CAT-13, UNI-02, UNI-03, UNI-12, PRG-04, PRG-09 | Three gaps, now fixed:<br>- **ATH-10 was broken in the BASEBALL Parts variant: at 60 min its week had no Olympic work** (fix 1).<br>- **ATH-06 / changelog row 31 ("COD stays for every athlete") was not true in the templates. No 60-min athletic week (the non-competitive default) and no 3-day week at any length had a COD station** (fix 5).<br>- **UNI-12 frontal / transverse work was missing for MMA** (fix 8). |
| Plan shapes, deload, tests | PER-01, PER-05, PER-07 | Reflected. **The JSON deload `architecture_rule` still read as a rule ("conditioning and Oly removed"), but dropping the Olympic piece is OBSERVED, not PER-05** (fix 9). |
| Equipment | EQ-01, EQ-02, EQ-06, EQ-07, EQ-08, EQ-10, EQ-11, EQ-12, LIB-09 | No band or variable-resistance option is in any generator pool. **Four banded verbatims had no v1 note: OT11 'band row', JSON superset types 6-7, the STRENGTH-8 'FAST BANDED BENCH PRESS' rotation row, and the BASEBALL pressing profile** (fix 8). |
| Levels, names, notation | PRG-05, PRG-06, PRG-07, FIX-03, ATH-13, CAT-04, CAT-05, CAT-06, VOL-11, VOL-15 | Reflected. **The sport-dial source still read "renamed 'JUSTICE LEAGUE'"** (fix 9). Section 1 now says what 'zone' means (Davidson rotation-bias zones; not a session variable; never for plyos). |
| Volume hooks | VOL-04, VOL-05, VOL-06, VOL-07, VOL-09, VOL-10, UNI-01, UNI-05, LIB-16 | Reflected: rate by the person's state; the 2/2/2 -> 4/3/3 add order; helpers 0.25; dips 0.5/0.5; 10/10 = 1 set; athletic patterns 0. |
| Generator | GEN-01, GEN-02, GEN-03, GEN-04, GEN-05, GEN-08 | Reflected. The GEN-03 / GEN-05 conflict is handled as PROPOSED. |

### Retired ideas: scan of both files (the markdown above the v0 history logs, and every JSON string)

| Retired idea | Result |
|---|---|
| Size-based 3/5/7% | Gone. The only rate rule is "chosen by the person's state, not by muscle size" (VOL-05). |
| 0.5 helper credit | Gone. Helpers are credited 0.25. The only 0.5 values are the dips 0.5/0.5 rule, tier and setup numbers. |
| Band / chain / weight-releaser substitutes | None in any generator pool. Every remaining "band" string is an OBSERVED verbatim with a v1 "out" note, or a "no bands" rule. The only "chain" hit is "anterior chain". |
| Plyo zones as a fixed exercise property | Gone. The only hit is "not a plyo zone". |
| Core after the power block as the default | Gone. The one JSON hit cites it as the v0 rule the coach marked NOT RIGHT. |
| Sex-based rules | None. The hits are "no sex-based rules" and "no sex field". |
| Justice League as a program name | It appears only as a cited tab name or as evidence. The generator name is *Athletic Performance - Non-Competitive*. |
| Hack squat ranked last | Gone. |
| 6-week = 5 + deload | The only hit is the JSON `retired_v0_rules` entry. |

### Problems found and fixed

1. **ATH-10, Olympic work in the BASEBALL Parts week.**
   - Problem: the OLY piece was set to 75+ min on all four days, so a 60-min week had no Olympic lift.
   - Fix: Mon/Thu now keep it at every length. It runs at 2 sets below 90 min (L1 variants allowed) and at the observed 4 sets @ 75->90% at 90 min. Tue/Fri stay at 75+ as observed.
   - Time: Mon/Thu run ~64.5 min at 60 and ~74 at 90.
2. **VOL-17, about 2 core exercises.**
   - The BASEBALL Parts days now add a second core exercise from 75 min (the other region of Part B, CAT-08). The single observed Part B slot stays below 75 min.
   - The hybrid 6-day WOD-only class now has 2 core exercises.
3. **ATH-07, aerobic target for aesthetics.**
   - Every aesthetics `aerobic_ATH07` block now says 4 + long walks for the whole family, and its add-on count was recomputed. The family notes and 8.1 were updated.
   - The earlier split is withdrawn. Open question 11.2-11 now asks whether general physique clients are meant.
4. **UNI-06, same-pattern athletes.**
   - Updated: `use_when`, the pairing rules (JSON `rules.pairing` and md 4.2 / 4.6), the sport dial, changelog row 5, and question 11.2-10.
   - The variant now covers high-level athletes who need more stimulus (the coach's words). The size-sport list is labelled INFERRED.
5. **ATH-06, COD in every athletic week.**
   - Hip (B) days now carry COD from 60 min, and knee (A) days from 75 min.
   - The 3-day S1 gains a COD station from 60 min. The OBSERVED STARTING sheet has none.
   - Every athletic week from 60 min now has COD. B days at 60 min run ~64 min, which is within tolerance.
   - The day placement is INFERRED. New question 11.2-15 asks about BASEBALL and in-season weeks, which still have no COD.
6. **LIB-21 / LIB-05.**
   - Added to 3.3, 3.5, `rules.ordering.within_tier_rules` and bucket AP_SPRINT: the fixed speed-session order (squirrel jumps -> MACH drills / acceleration -> max velocity) and "one plyo from each MODERATE track".
7. **ORD-01 notes.** OT14 (boxing weeks 1-2), OT21 (AESTHETICS-8) and OT22 (AESTHETICS-12 pull day) now say that the pulldown-first order is not followed.
8. **EQ-01 / EQ-12 and UNI-12.**
   - v1 "out" notes were added to OT11 'band row', the boxing 'REVERSE BANDED' squirrel jumps (md 2.3), JSON superset types 6-7, the STRENGTH-8 rotation row and the BASEBALL pressing profile.
   - The MMA profile and the football / soccer / tennis row now carry frontal / transverse unilateral work.
9. **Wording.**
   - The sport-dial JUSTICE LEAGUE source was clarified.
   - The deload `architecture_rule` is labelled as the OBSERVED v0 reading under the PER-05 `v1_rule`.
   - The RP_BHD non-axial pool now lists the KB swing, as the rules and 6.4 do.
   - The v0 INFERRED "grip / erectors" pairing rationale is marked superseded by the coach's UNI-11 reason.
   - Changelog rows 26, 27, 31 and 36 were updated ('strap rotating in/out' removed, LIB-09).
   - 7.5 now gives the athletic 60/75-min content with COD.
   - "Still pending" lists the new INFERRED items.

### Checks recomputed (python, project venv)

- **Rebuild check.** `build_templates_v1c.py` reproduces the previously installed templates before its patches. The only differences were one evidence string and the separately merged sport dial, and both were preserved. After the patches, the installed templates equal the rebuilt ones.
- **Build checks.** These were re-run for every template and variant at the default lengths: exposures, axial budget, slot pairing, core first, H before V, Olympic before the work, caps and time.
  - Result: "ok", or a documented observed-design exemption only.
  - The 8.7 table was regenerated from the JSON and matches it row for row. Changed rows: athletic 2/3/4/5/6-day and the same-pattern variant at 60 min (8-9 stations, ~64 min), athletic 3-day at 90 min (up to 11 stations, ~84-88 min), BASEBALL Parts (5 stations, ~64 min at 60; ~74-81 min at 90), and the hybrid 6-day WOD days (~31 / ~37 min).
- **First-pass independent audit.** Re-run with unchanged results: calves at 3 sets on every leg day, a weekly rear-delt station, no medball in aesthetics, and no band text in any station. Its only flag is still the conjugate ME lower day (question 11.2-9).
- **New pass-2 audit.** It checks:
  - Olympic work in every athletic week at 60, 75 and 90 min (now passes everywhere);
  - COD in every athletic week (passes, except the in-season and BASEBALL Parts variants, which are flagged as question 11.2-15);
  - about 2 core exercises from 45 min (passes);
  - aesthetics aerobic target = 4 (passes);
  - no sex field (passes);
  - time per day at 45-90 min.
- **Time flags outside the default lengths.**
  - Aesthetics at 45 min: the 2-day, 3-day Day C, upper/lower and PPL x2 days run ~50-60 min. This is now stated in 7.5 and in the JSON `slots_by_length`, and the time-overflow rule plus the cut order handle it.
  - Strength 2-day at 60 min: ~72-75 min. 90 min is the strength default.

### Not changed (flagged)

- **Strength ME lower days.** These still put the non-axial accessory and the survival lunge back to back. The coach's sheet puts squat and hinge back to back instead. This stays as question 11.2-9.
- **In-season and BASEBALL Parts weeks.** These have no COD station: the sheet has none, and sport practice may cover it (question 11.2-15).
- **Davidson zones.** These are explained in section 1 but not used to order or pair stations, because the coach says the levels are still theoretical (CAT-05).
- **GEN-01 (Spanish toggle).** Unchanged from the first log: only program, optional-day and aerobic-day names carry Spanish.
- **Backups and scripts.** Backups of both files from before this pass are in the session scratchpad (`05_templates.pre_v1verify_pass2.json`, `05_session_architecture.pre_v1verify_pass2.md`). The patch scripts are there too (`build_templates_v1c.py`, `patch_v1verify_pass2.py`, `audit2.py`).
