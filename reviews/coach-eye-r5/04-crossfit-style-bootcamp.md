# Coach-eye review, round 5: sample 04, CrossFit-style class (4 days + optional WOD day, box kit, 8 weeks), engine 0.6

**Grade: B+.** Small tweaks only. Both round-4 majors are fixed in the engine. The resistance layer no longer reads like a physique plan: quads and hips now lead at 18, back and chest stop at 15 / 14, and the arms and shoulders stop near the floor (G-113). The extra station is now a second knee-dominant lift on the squat day, not a curl. Saturday no longer carries a chest press, and every "What changes" line prints the real from → to sets. The class skeleton, the Olympic ladder, the core opener, the pairing and the spine days are all his. What is left is polish. The strength ladder still steps in pairs, and the test weeks are stacked. The squat day carries 3 knee lifts. The WODs grow by minutes, and the rounded weekly table runs 1-2 sets past "Final sets" without saying so. Most of these are round-4 minors that are still open. None would stop Lalo from handing this plan to a class member.

Files reviewed: `samples/plans/04-crossfit-style-bootcamp.en.md` and `.json` (engine 0.6.0, model 1.3.0, `validation.ok: true`, no warnings), intake `samples/intakes/04-crossfit-style-bootcamp.json`. The client is 35, L2, 2 years consistent, `previous_cycles.count: 0`. Goal `active`, activity `crossfit_class`. He trains Mon/Tue/Thu/Fri for 8 weeks with a HOME_BARBELL box kit, no machines. Template `hybrid_crossfit.4 / crossfit_style_bootcamp`, session size class 5-7. There is no `.es.md` for this sample.

Measured against: CH5-01..03, R4-SES-02/04/05, R4-PRG-01..04, R4-LIB-01..05, R4-SCP-01/02, CT-01, CX-01..04, R3-VOL-03/04, R3-SES-01, R2-PER-07, R2-SES-01/03, H01-H22, V30-V37. His own sheet is MASTER MODEL 'EXAMPLE CROSSFIT SPLIT' > 'CLASS PROGRAMMING SPLIT' (MON squat + DUBS, TUES press + snatch, THURS deadlift + gymnastics, FRID clean). The HALF TIME table sets strength at 3x7 → 3x4 → 1RM and power at 3x4 → 3x1. RESISTANCE is L1-2 = 2-3 x 10. Decoded in `analysis/programs/prog_mm_crossfit_tracks.md` §1.4 / §1.9. Session length was not judged (CT-01). The open coach questions at the end of `samples/STATUS_v0.5.md` (Q10-Q14) and the open items of G-119 / G-139 / G-199 are rated minor at most. That includes G-119(4), the class member's tops.

---

## Round-4 majors: status

| R4 # | Problem | Status in 0.6 | Evidence |
|---|---|---|---|
| M1 | Volume priorities upside down: arms / pressing at 18 with bodybuilding isolation, quads held at 15 of 18, a bonus curl on Monday | **Fixed** (the numbers are G-113, PROPOSED, open as G-119(4)) | Final sets: quads 18, hips 18, back 15, chest 14, shoulders 12, biceps 11, triceps 11, calves 8. Quads climb every week (12 → 18) and arrive in week 7. The Monday bonus is now a quad lift (FFE split squat, then heels-elevated goblet squat). There is no bonus curl, Tate press, skullcrusher or second fly. The only part of the round-4 fix hint still open is the isolation rep bracket (15-20 instead of his RESISTANCE 10): minor m6 below. |
| M2 | Saturday chest press (bonus) went 2 → 4 in one week; the change list said "+1"; chest's final sets hung on the optional day | **Fixed** | Saturday holds core, the WOD and the Green session only, with no lifting bonus. Chest reaches 14 on the main days. Change lines read "+1 set on Incline Barbell Bench Press (Thursday): 4 → 5 sets" (G-164 / G-190). The largest per-exercise step anywhere is +1 set. |

Round-4 minors fixed along the way:
- m10: every block-2 change is one detail (hammer curl + 1-s squeeze, kickback + squeeze, hang → floor snatch and clean, slider → ball curl, seated → standing curl, weighted → decline sit-up, A-march → A-skip), with one exception (m4 below).
- m11 in part: line 3 is now the class-member WOD line (G-170). Line 2 is still competitor copy.
- m13: the Copenhagen plank is the opener once a week (Monday). Thursday opens with a side plank and a leg raise.
- M2's change-list wording is fixed.

Still open from round 4: m1 (paired strength ladder), m2 (sets above HALF TIME, for discussion), m3 / m4 / m5 (test week shape, mile placement, week-1 1RM wording), m6 (WOD growth), m7 (aerobic colours), m8 (inverted row three times a week), m9 (pull-ups 3x10), m12 (calves +16.7 % with no note), m14 (helper overshoot) and m15 (`CLEAN/PUSH` key, G-179). They are listed again below and stay minor.

## What the plan does (week 1 → week 8)

| Day | His class split | Plan, in order (after warm-up and the 2 x 2 core opener) | Exercises |
|---|---|---|---|
| Mon | SQUAT + DUBS | DU skill · **front squat** (test + 2, then 4-5 sets) · inverted row · step-up · pull-up · FFE split squat (bonus; goblet squat heels-elevated in block 2) · DB calf raise · cross-body hammer curl · WOD AMRAP 10 → 20 min | 7 |
| Tue | PRESS + SNATCH | hang power snatch (power snatch in block 2) · **strict OHP** (test + 2, then 3) · flat DB bench · DB fly · DB kickback · DB lateral raise · WOD EMOM 12 → 20 min | 6 (5 in week 8) |
| Wed | (off) | Orange (C) rower 30-40 min; 1-mile test in weeks 1 and 8 | - |
| Thu | DEADLIFT + GYMNASTICS | T2B skill · **deadlift** (test + 2, then 4-5) · incline barbell bench · alternating staggered-stance DB SLDL · OH DB triceps ext · slider / ball hamstring curl · barbell calf raise · WOD for time 10 → 15 min | 6 |
| Fri | CLEAN | hang power clean (power clean in block 2) · inverted row + squeeze · split squat · chin-up · seated / standing DB curl · chest-to-thighs reverse fly · supinated lateral raise · WOD AMRAP 10 → 20 min | 7 (6 in week 8) |
| Sat | WOD (optional) | core opener · WOD EMOM 20 → 28 min · Green (B) bike 20-30 min | 0 lifts |

Weekly sets 74 → 76 → 78 → 80 · 84 → 87 → 94 → 94. Every step is +2.6 % to +8 % for the total. Groups follow the planned schedule and reach their final sets in week 7, then hold in week 8 (R4-PRG-01). The largest realized group step is quads +13.3 % (week 6) and hips +13.8 % (week 7, 16.25 → 18.5). Calves +16.7 % in week 5 is the only one above 15 % (m12). RIR runs 3/3/3/3/2/2/1-2/1, with one MYO set a day in week 8 on the day's last small-muscle exercise.

### Checklist

| Check | Result |
|---|---|
| His class template, slot for slot | **Yes.** Squat Mon, press + snatch Tue, deadlift Thu, clean Fri, WOD-only Sat. DUBS with the squat, gymnastics (T2B) with the deadlift. Squat and deadlift are 3 days apart. Each class day reads warm-up/skill → strength/power → WOD (OT18). The engine's class stations follow his slots: work lift first, its paired upper group, then the second pattern lift, the second upper lift, calves and the arm slot (CH5-02 / R4-SES-05 slot 5: biceps Mon/Fri, triceps Tue/Thu). |
| Exercise count | 5-7 every class day (R4-SES-02 bootcamp / class 5-7). |
| Choices | Good box picks: front squat, strict press, conventional deadlift, hang → floor Olympic lifts, step-up, split squat, staggered-stance SLDL. The isolation picks (fly, kickback, supinated lateral raise, chest-to-thighs reverse fly) are template data from his PPL sheet, and they are logical once the tops are low. See m6. |
| Order | Core first (H05). Power before strength (Tue, Fri; H03). Row before pull-up / chin-up (H04). Tue strict press before the flat DB bench is the day's main `work` (D-30, allowed). |
| Pairing | Knee + pull (Mon, Fri). Hip + push (Thu, with the incline press, R4-LIB-03). Press-only Tue as his sheet has it (H06). |
| Spine | One counted heavy squat (Mon) and one counted heavy hinge (Thu), on separate days (H07). |
| Sets per exercise | 2-5. Main lifts 4-5 (above his HALF TIME 3: m2, for discussion). Accessories 2-4. |
| Weekly sets | Every group ≥ 10 except calves, which take one exercise per leg day (R3-SES-01). Every group reaches its planned final sets. Nothing is capped or below the floor. |
| Stairway | Clean. No week drops and no group arrives before week 7. Week 8 prints "Same sets: ... add a little load or reps" (CX-02 / CX-03). |
| Progression as a rule | Yes (R4-PRG-03). "When you hit 20 on every set with 3 left in the tank, add weight next time and start again at 15". The next-block rule (R4-PRG-04) and the template/edit lines (CX-04) are printed. |
| WOD / conditioning | Real CrossFit pieces at scaled loads: KB 26-35 lb, DB thruster 25-35 lb, barbell thruster 45-65 lb, ball ≤ 20 lb (H11). Wall balls appear only in the class WOD (R4-LIB-01 / G-26). No muscle-set credit (H09). Movements rotate in block 2. Growth: m7. |
| Olympic dosing | Exactly his HALF TIME power column: 3x4, 3x4, 3x3, 3x3, 3x2, 3x2, 3x1, none in week 8. "Move it fast ... no percentages" is printed. |
| Block change | One detail per exercise, except the Monday bonus (m4). |
| Liability line | Top and bottom of the plan, with the disclaimer link (R4-SCP-01 / 02, H20). |

---

## Problems

### Blockers

None.

### Major

None. Both round-4 majors are fixed in the engine. Everything still open is a round-4 minor, an open coach question (G-113 / G-119(4), Q14) or selection and copy polish.

### Minor

| # | Where | Problem | Rule (coach id) | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Main lifts weeks 1-8: front squat, OHP and deadlift at 7, 7, 6, 6, 5, 5, 4, test | His class code steps strength one week ahead of power: 7, 6, 6, 5, 5, 4, 4, then the 1RM. The plan pairs the steps. The power ladder does match his. (round-4 m1) | OBSERVED CLASS PROGRAMMING SPLIT S4:S11 (§1.9) | minor | `dose.mjs`, `crossfit_class`: read the strength level from the offset code table ('1/1', '2/1', '2/2', ...), not from the paired-week ladder. |
| m2 | Front squat 2+T, 4, 4, 4, 5, 5, 5, T+4; deadlift 2+T, 4, 4, 4, 4, 4, 5, T+4 | His class member's HALF TIME table keeps 3 sets and progresses by reps. The plan climbs the main lifts to 5 sets, as his FULL TIME competitor table does. The stairway rules allow this (CX-01). For discussion only. (round-4 m2) | OBSERVED HALF TIME (§1.4); CX-01 | minor | Optional `hold_sets` flag on class `work` stations, so the added quad / hip sets go to the second and third lifts. |
| m3 | Monday, weeks 1-8: front squat + step-up + bonus FFE split squat (block 2: heels-elevated goblet squat), 13 of the week's 18 quad sets in week 7; Friday holds one knee lift (5 sets) | The squat day carries 3 knee-dominant lifts and most of the quad volume, followed by an AMRAP with box jumps. Friday, the other knee + pull day, has room: 6 lifts in week 8, and its single-leg slot is the week's only other quad lift. Allowed (1-4 exercises a group, H18). But the bonus would spread better on Friday, and Monday's heavy squat would stay the focus. | R4-SES-05 (A day = 1 two-leg + 1 single-leg knee lift; extras are small-muscle or core); H18; R3-VOL-03 (spread over exposures) | minor | In `volume.planWeeklySets` bonus placement for `hybrid_crossfit`, open a big group's bonus on the training day of that pattern that holds the fewest exercises and sets for it (Friday), not on the work-lift day. |
| m4 | Block change, Monday bonus: FFE split squat (single-leg) → goblet squat, heels elevated (two-leg) | Laterality and stance both change. That is two details, against G-134's "keep the old one's laterality". Every other block-2 change is a clean one-detail change. | R2-LIB-01 / PER-02 (one detail); G-134 | minor | In `select.mjs` block change, apply the `s6.block_change` laterality rule to `x01` bonus slots too (FFE → deficit reverse lunge or RFE split squat). |
| m5 | Week 8 (and week 1): 3 rep max / 1RM tests Mon, Tue, Thu and the 1-mile test Wed, at peak sets (94) with MYO sets. The longest WODs follow the tests: Mon AMRAP 20 min after the front-squat test, Thu 6 rounds for time after the deadlift test. The mile sits the day before the deadlift max (rules `tests.cardio_day: lightest_or_aerobic_day` picks Wednesday). | His class week 8 is "work up to 1RM" only. The plan follows the approved R2-PER-07 wording (the test replaces the top set) and D-17, so this stays minor, but results are taken at peak fatigue. (round-4 m3 + m4) | R2-PER-07; D-17; OBSERVED class WK 8 '5' | minor | On test days, hold the WOD at its block-start minutes and drop that day's MYO. In `shape.mjs`, choose the cardio test day so it is not the day before a lower-body strength test (Saturday here). |
| m6 | Arm and shoulder isolation: hammer curl 4 x 15-20 per side, kickback 4 x 15-20 per side, OH triceps ext 4 x 15-20, fly 3-4 x 15, two lateral raises and a reverse fly at 15-20 | Volumes are now logical, but the dosing is still bodybuilding style for a class member. His CrossFit RESISTANCE is 2-3 x 10. The template's `ISO_BICEP` / `ISO_TRICEP` hint is 2 sets, and the arm exercises start at 4 because the floor of 10 asks for it (H17). | OBSERVED RESISTANCE L1-2 (§1.4); G-113 / G-119(4) open | minor | In `dose.mjs`, give class-family isolation work the 10-12 bracket. Let the floor's extra set go to the second arm exercise first, so each holds 3, not 4 + 3. |
| m7 | WODs: Mon AMRAP 10 → 20 min; Tue EMOM 12 → 20; Thu for time 10 → 15; Sat EMOM 20 → 28. The block table at the top prints only each block's first week ("10 → 15 min", Tue "12 min"). | Conditioning grows by length, up to double, while lifting sets climb 27 % and RIR drops. The overview table hides the real end points (CX-04). This is inside D-20's PROPOSED 10-20 / 20-30 min ranges. (round-4 m6) | D-20 (PROPOSED); OBSERVED §1.5 / §1.12 (INFERRED: his levels add WODs and zones); CX-04 | minor | Cap WOD minute growth at about +30 % across a block and climb the rest by density (E-173 already supports it). In `render.mjs`, print the block table's WOD range from the block's first to its last week. |
| m8 | Mon and Fri: inverted row both days, both blocks; the Thu (block 1) or Tue (block 2) WOD adds 12 / 10 more inverted rows. "Add weight next time" on a body-weight row. | The same horizontal pull up to 3 times a week with a full barbell, DB and KB kit, and no body-weight progression note (the pull-up has one). (round-4 m8) | R4-SES-05 slot 1 (variety from the variant); R4-PRG-03 | minor | In `select.mjs`, do not repeat a slot's exercise id on both exposures when the kit has another two-arm row (barbell bent-over, DB / KB row, Kong row). Attach `note.bodyweight_progression` ("feet higher, then a vest") to rows. Keep the WOD from picking the week's lifting row. |
| m9 | Pull-up 3 x 10 and chin-up 3-4 x 10 at 3 → 1 RIR, all 8 weeks | 10 strict pull-ups with 3 in the tank is a 13-rep max. That is ambitious for a 2-year class member. The assist note helps. "Add weight next time" reads oddly on a body-weight lift. (round-4 m9) | VOL-13 / effort band; R4-PRG-03 | minor | In `dose.mjs`, give strict body-weight vertical pulls 6-10 reps at L2 with the double-progression rule. |
| m10 | Weekly table: hips "16 16 19 19" against "Final sets 18"; shoulders "13 ... 14" against 12 from week 1; biceps "12" against 11. `meta.stairway[0].over_top` is empty. | Helper credit takes three groups past their final sets (hips 18.5, shoulders 13.5, biceps 11.75). Whole-set rounding then prints a hips step of 16 → 19 (+19 %) that is really +13.8 %. The plan does not say so. Sample 05 now prints an "above the usual top" line for the same situation. (round-4 m14) | H10; R4-PRG-02; CX-04 | minor | In `volume.planWeeklySets`, count helper credit before the last direct set. Fill `over_top` when a realized group passes its top by ≥ 0.5 set, and print the line as in 05. Print the table to one decimal, or with the "rounded" note next to the overshoot. |
| m11 | Calves 6 → 7 in week 5 (+16.7 %), no note; 4 calf sets on Monday from week 5 and on Thursday from week 7 | Below the PROPOSED two-whole-set note minimum. Calves are "one exercise x 3 sets per leg day" in R3-SES-01; the plan reaches 4. (round-4 m12) | R4-PRG-02; R3-SES-01; `stairway.progression.note_min_whole_sets` (PROPOSED) | minor | Keep it, or cap `ISO_CALF` at 3 sets unless the calves' final sets need it. Leave `note_min_whole_sets` on the coach list. |
| m12 | Week 1: "3 rep max or work up to a 1 rep max" on three lifts and a 1-mile test, with `previous_cycles.count: 0` | 2 years of consistent training makes it defensible (`from_zero_if` does not fire). But his words were "if they haven't finished a block ... test at 80 %, 90 %". A first plan could default to the 3RM wording. (round-4 m5) | R2-PER-07; H19 | minor | In `rules.tests`, offer `rm_3_or_5` in week 1 when `previous_cycles.count` is 0 and `just_finished_block` is false. Keep the 1RM option for the end test. |
| m13 | Basic Instruction line 2: "to be competitive, you MUST be ... as good as possible in EACH modality" | Competitor copy for a non-competing class member. Line 3 is now the class-member line (G-170). Line 2 is his verbatim text, so the fix is to choose the line, not to rewrite it. (round-4 m11, part) | OBSERVED 'COMPETE CROSSFIT SPLIT' A3:A7; CX-04 | minor | In `rules.render.v6.class_member_instruction`, drop line 2 for `former_competitor: false` class members, or ask the coach for a class-member line (PROPOSED). |
| m14 | Aerobic: Wed Orange (C), Sat Green (B); no A or lactate-clearance work. Orange runs 30 → 40 min in block 1 and resets to 30 min in week 5, printed as the same "long / easy rower". His split puts aerobic on the squat and deadlift days (LVL 4 / LVL 3). | The WODs cover the high end, so this is acceptable. The week-5 reset reads as a drop because the harder interval structure behind it (`11-min run / 2-min walk`) is not printed. (round-4 m7) | OBSERVED §1.5 / §1.9; AEROBIC CHEAT SHEET | minor | Print the colour's structure on the Orange line, as the Green line already does. Optionally add one line: "the WODs are your A (short, intense) work". |
| m15 | Week 8 day titles: Tuesday "Push day" and Friday "Single-leg squat + pull day" (the Olympic lift is off) | The class day changes its name in the test week, so a member looking for "Clean + pull day" will not find it. The internal key is still `CLEAN/PUSH` under the label "Clean + pull day" (G-179, round-4 m15). | E-199; engine consistency | minor | In `render.day_title_from_lead_lift`, keep the class day's template label when the only change is a block that ends (no power level 5). Rename the key to `CLEAN/PULL` in the template layer. |

Known open coach questions, not raised as issues: the class member's tops (G-119(4)), pulling against pressing (Q14), anti-rotation core picks (Q11), circuit rounds (Q13, not used here).

---

## What Lalo would like

- **His class split, day for day,** with the skill on the days his sheet names and squat and deadlift 3 days apart. The WOD closes every class.
- **The resistance layer now serves the athlete.** Legs lead (18 / 18), back and chest sit at 15 / 14, and arms and shoulders sit near the floor. The extra station is a second knee lift, not a curl.
- **Olympic dosing is his HALF TIME power column exactly,** hang → floor between blocks, with his "move it fast, no percentages" copy.
- **Order and pairing are right.** Core first and light, power before strength, rows before vertical pulls, knee + pull and hip + push, incline on the hip day (R4-LIB-03).
- **The stairway is honest and clean.** Even steps, arrival in week 7, a hold in the test week. Every change line prints its real from → to sets.
- **Progression is a rule the person applies,** with the next-block and template/edit lines (R4-PRG-03 / 04, CX-04).
- **WODs are real box pieces** at sensible scaled loads, with no muscle-set credit. Wall balls appear only where he allowed them.
- **Library and safety rules hold.** Optional add-ons are dosed by distance or reps (R4-LIB-01 / 02), every swap says what it keeps and loses (R4-LIB-04), and every exercise has a YouTube search link with the name to copy (R4-LIB-05). The release is printed at the top and the bottom. Nothing is cut for time, and each day only names what is easiest to remove (CT-01, R4-SES-04).
