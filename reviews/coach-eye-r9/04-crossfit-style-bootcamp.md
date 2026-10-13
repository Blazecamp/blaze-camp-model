# Coach-eye review, round 9: 04 CrossFit-style class member (L2, 4 days + optional WOD Saturday, 8 weeks; engine 0.7.0)

**Grade: B+** (coach's round-5 grade: B+; target A- **not reached**). His note was "use the WODs that are popular in the crossfit community, girl wods once a week and hero wods only 1 a block, popular benchmark wods every 2-4 weeks, keep it varied". The named-workout part is done well:
- A Girl every week: Diane, Elizabeth, Isabel, Karen, Nancy, Kelly, Chelsea, Fran.
- One Hero: Murph, in week 6.
- Benchmarks in weeks 3 and 7: The Chief, Death by Burpees.
- Each is scaled for an L2 member and printed with its standard.

Two of his round-5 answers are not applied:
- **"Keep it varied" (M1).** The engine's own WODs repeat, unchanged, for 4-8 weeks.
- **Small muscles at 10-12 reps, not 15-20 (M2).** He confirmed this for the class member's extra lifting in R5-CLS-05. Every accessory still prints 15-20.

Both are quick to fix. With them, this plan is an A-.

Reviewed: `samples/plans/04-crossfit-style-bootcamp.en.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`, no warnings), plus `samples/intakes/04-crossfit-style-bootcamp.json`. There is no Spanish file.

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-GRD-04: Girls weekly, a Hero once a block, a benchmark every 2-4 weeks | Girls in weeks 1-8, Murph in week 6, The Chief in week 3, Death by Burpees in week 7. All at L2 with the standard printed. | Applied (but see m1: 5 of the 11 named workouts sit on the optional Saturday) |
| R5-GRD-04: "keep it varied" | The non-named WODs repeat (M1). | **Not applied** |
| R5-CLS-05: class member's tops, small muscles at 10-12 reps | Tops: arms 10 → 11, shoulders 11 → 12, chest 11 → 14, back 12 → 15, legs 12 → 18. Reps: every small-muscle item is 15-20 (M2). | Tops applied; **reps not applied** |
| R5-CLS-01: lunge on the clean + pull day | Fri Stationary Lunge (split squat) 3 → 5. | Applied |
| R5-CLS-04: wall balls and sled pushes in the class workout, with a switch | Wall balls in Karen, Kelly and the Tuesday EMOM (14-20 lb, "never over 20 lb"). The switch exists in data (`addons.primary_exceptions.enabled`) but the plan does not tell the member it can be turned off (m2). | Applied (switch not visible) |
| R5-CLS-07: nothing starts at its top | Shoulders 11 → 12 (were 12 → 12); every group climbs. | Applied |
| R5-GRD-06: core optional | Printed on every core block. | Applied |
| R5-VOL-02: pull ≥ press | Back 15 ≥ chest 14. | Applied |

## Round-5 review items (the last 04 review): status

| R5 # | Status in r9 |
|---|---|
| m1 strength steps paired with power, not one week ahead | **Open** (m3). |
| m2 main lifts climb to 5 sets (his half-time table holds 3) | For discussion (m4). |
| m3 Monday: three knee lifts (front squat, step-up, bonus goblet squat from week 5) | **Open** (m5). |
| m4 block change on the Monday bonus changes two details | **Moot**: the bonus now opens in week 5 as a goblet squat. |
| m5 tests at peak sets; long WODs after the tests | **Open** (m6). |
| m6 bodybuilding dosing on arm / shoulder isolation | **Open, and now a coach answer** (M2). |
| m7 WODs grow by length; the overview hides the end | **Open** (m7): Mon AMRAP 10 → 20 min. |
| m8 inverted row up to 3 times a week | **Open** (m8). |
| m9 pull-up 3 × 10 at 3 RIR | **Open** (m9); the WODs scale pull-ups to jumping pull-ups (m10). |
| m10 helper credit takes groups past their finals | **Open** (m11). |
| m11 calves 4 sets against "1 exercise × 3" | **Open** (m12). |
| m12 1RM wording in a first plan | **Open** (m13): 18 occurrences. |
| m13 competitor copy line | **Open** (m14). |
| m14 aerobic colours | Acceptable. |
| m15 week-8 day titles change | Not re-checked. |

---

## Problems

### Blockers

None.

### Major

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| M1 | Non-named WODs, weeks 1-8 | **The class workout is not varied.**<br>- **Monday:** the same AMRAP (toes-to-bar, Russian KB swing, knee-height box jump) every week, 10 → 20 min, with a calorie station added from week 5.<br>- **Thursday:** the same for-time workout (calorie row / bike / ski, barbell thruster, inverted row) in weeks 1, 2 and 4, then burpees / slam / calories / thruster in weeks 5-8.<br>- **Friday:** the same AMRAP in weeks 2-3 and in weeks 5-8.<br>- **Tuesday:** the same EMOM in weeks 1, 3 and 4.<br>- **Saturday:** the same EMOM in weeks 1, 2 and 4.<br>His answer was explicit: "keep it varied". A class member who meets the same Monday workout 8 times is not doing his CrossFit-style class. The named workouts fill only one slot a week (plus the Hero and benchmark weeks). | R5-GRD-04 "keep it varied"; R2-LIB-01 (variety) | major | `classwork`: generate each non-named WOD per week from the day's movement pool. The format (AMRAP / EMOM / for time / chipper) and at least two of its movements rotate week to week. A repeat is allowed only as a deliberate retest (say so: "same as week 2 - beat your score"). Keep the length progression. |
| M2 | Every small-muscle item: Mon Cross-Body Hammer Curl 4 × 15-20 / side; Tue Flat DB Fly 3-4 × 15, DB Triceps Kickback 4 × 15-20 / side, DB Lateral Raise 2 × 15-20; Thu Overhead DB Triceps Extension 4 × 15-20; Fri Seated DB Curl 3 → 4 × 15-20, Reverse Fly 2 × 15-20, Supinated Lateral Raise 2 × 15-20; calf raises 15-20 | **R5-CLS-05 not applied to the reps.** He approved "Arms and shoulders near the 10-set floor plus about 2. Chest and back 14-16. Legs reach their full number. **Small muscles at 10-12 reps, not 15-20.**" The set tops are in (G-113). The rep part is not recorded in DECISIONS or the rules and is not in the plan. (This was r5 m6, now a coach answer.) | R5-CLS-05; OBSERVED class RESISTANCE "2-3 × 10" | major | `rules.reps`: a class-member modifier (`hybrid_crossfit` family, recreational / class activity) that sets ISO / small-muscle items to 10-12. Record it as a G-entry with R5-CLS-05, and add a test on sample 04. |

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Sat "WOD class + cardio (optional)": The Chief (wk 3), **Nancy (wk 5)**, **Murph (wk 6)**, Death by Burpees (wk 7), **Fran (wk 8)** | **New.** In weeks 5 and 8 the week's only Girl, and the block's Hero, sit on the optional day. Skip Saturday and the week has no Girl and the block has no Hero. | R5-GRD-04 | minor | Place the weekly Girl and the block's Hero on a training day; the optional day takes the benchmark or a repeat. |
| m2 | Wall balls in the WODs | **New, small.** The switch R5-CLS-04 asked for is a data flag only. The member is never told that wall balls (and sled pushes) can be turned off. | R5-CLS-04 | minor | One line in "How to adjust": "Wall balls and sled pushes in the WODs are optional: swap them for ...". |
| m3 | Main lifts 7, 7, 6, 6, 5, 5, 4, test | (Carried.) His class code steps strength one week ahead of power. | OBSERVED class split | minor | `dose.mjs` class ladder. |
| m4 | Front squat and deadlift climb to 5 sets | (Carried, for discussion.) His half-time table keeps 3 and progresses by reps. | OBSERVED HALF TIME | minor (open) | Ask. |
| m5 | Mon: front squat + step-up + bonus Goblet Squat (heels elevated) from week 5 | (Carried.) Three knee lifts on the squat day, then an AMRAP with box jumps. Friday holds one knee lift. | R3-VOL-03 | minor | Put the quads' bonus on Friday, after the lunge. |
| m6 | Weeks 1 and 8 | (Carried.) Front squat, OHP and deadlift tests on Mon / Tue / Thu, the mile on Wed, at peak sets; the longest WODs follow the tests. | R2-PER-07; `tests.cardio_day` | minor | A short WOD on a test day. |
| m7 | WOD lengths: Mon 10 → 20 min, Sat Murph 45 min | (Carried.) Conditioning doubles by length while lifting climbs; the block overview prints only each block's first week. | R4-PRG-01; copy | minor | Print the range; cap the length growth. |
| m8 | Inverted row Mon and Fri every week, plus in the Thursday WOD (weeks 1, 2, 4) and the Tuesday EMOM (weeks 5, 8) | (Carried.) | Variety | minor | A different horizontal pull on one day. |
| m9 | Pull-up 3 × 10 at 3 RIR | (Carried.) A 13-rep max for a 2-year member. | VOL-13 | minor | 6-8 reps, or a weighted / assisted note. |
| m10 | Fran, Murph and Chelsea scaled to **jumping pull-ups**, while the member does strict pull-ups 3 × 10 and chin-ups 3-4 × 10 in the strength block | **New.** The scaling contradicts the strength prescription. A member who can do 3 × 10 strict pull-ups does Fran with strict or kipping pull-ups (reduced reps), not jumping ones. | Consistency; R5-GRD-04 "scaled for a class member" | minor | Read the WOD scaling from the plan's own pull-up level (strict or banded-free reduced reps first). |
| m11 | Weekly table vs finals | (Carried.) Helper credit takes hips, shoulders and biceps past their finals. | R4-PRG-04 | minor | Count helper credit before the last step. |
| m12 | Calves 3 → 4 sets on Mon and Thu | (Carried.) | R3-SES-01 | minor | Hold the calf raise at 3. |
| m13 | "3 rep max or work up to a 1 rep max", weeks 1 and 8 | (Carried.) | R2-PER-07 | minor | 3RM wording in a first plan. |
| m14 | Basic Instruction line 2: "to be competitive, you MUST be ... as good as possible in EACH modality" | (Carried.) Competitor copy for a class member. | Copy choice | minor | Choose the class-member line. |
| m15 | Diane: "21-15-9 Dumbbell Deadlift (30-45 lb dumbbells)" | **New, small.** A 2-year member's Diane is usually a barbell deadlift at a scaled load (135 / 95 or so). The DB version avoids a counted heavy hinge (H07), which is right, but 30-45 lb dumbbells make it a light conditioning piece. Say why. | R5-GRD-04 scaling; H07 | minor | Print "dumbbells because your heavy deadlift is Thursday", or allow a light barbell deadlift (≤ 50 % of the test) on a non-hinge day. |

**Count: 0 blockers, 2 majors, 15 minors** (m4 is for discussion).

## Fresh checks (as Lalo)

- **His class days.** Squat + double-unders, press + snatch, deadlift + toes-to-bar, clean + pull with the lunge, and the Saturday WOD class. Core first, the skill block, power before strength, the WOD last.
- **Tops (R5-CLS-05).** Legs 18, back 15, chest 14, shoulders 12, arms 11: as he set them.
- **H11.** Wall balls 14-20 lb, "never over 20 lb". No medball over 20 lb.
- **The named workouts.** Each has the community standard, the scaled line for his level and "write down your time: you will meet it again". This is exactly the community feel he asked for.

## The one change that lifts it to A-

Vary the engine's own WODs week to week (M1), and put the class member's small muscles at 10-12 reps (M2). Then move the Girl and the Hero off the optional Saturday (m1).
