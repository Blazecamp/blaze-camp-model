# Coach-eye review, round 9: 03 Soccer (midfielder, L2, 3 days, 6-week off-season + 2-week pre-season; engine 0.7.0)

**Grade: A-** (coach's round-5 grade: B+; target reached). His note on this plan was "We don't start people in unilateral hurdle hops ... start with jump rope then bilateral high hops, then unilateral easy hops to then hurdle hop overs". The jump menu now follows it in its main lines:
- **Off-season (weeks 1-6):** every lower-body jump is two-footed and low: lateral step hops, lateral plate hops, a two-foot lateral jump, a lateral jump onto a low box, and ankle hops.
- **Pre-season (weeks 7-8):** bilateral hurdle hops (lateral and right-angle) and a single-leg broad jump.
- **No single-leg hurdle hop anywhere.**

The other round-5 answers are in:
- the heavy hinge starts at 3 (R5-ATH-12);
- a lateral jump on every training day (R5-ATH-10);
- the core is printed optional;
- team practices are left to the player (CH5-01).

What keeps it from A is a few minors on the jump details (m1-m3), no overhead press for a field athlete (m4), and the carried list.

Reviewed: `samples/plans/03-soccer.en.md`, `.es.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`), plus `samples/intakes/03-soccer.json`.
- Warnings: `v6_season` (2 pre-season weeks), `slot_held_groups`, `athletic_capacity` (jumps 80 %), `laterality_capped` (51 / 20).

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-GRD-03: jumps two-leg, symmetrical, low → single-leg, higher; no single-leg hurdle hops first | Block 1: all two-leg and low. Block 2: bilateral hurdle hops + single-leg broad jump. No single-leg hurdle hops. | Applied (details m1-m3) |
| R5-ATH-10: a single-leg or lateral jump every training day; two-foot lateral first | Mon: lateral step hops + lateral plate hops. Wed: two-foot lateral jump. Fri: two-foot lateral jump onto a box (weeks 2-5), then a single-leg broad jump (weeks 7-8). | Applied |
| R5-ATH-12: heavy deadlift starts at 3 and leads the hips | Fri Hex Bar `3 4 4 4 4 4` (was 2). The hyperextension steps in week 4. | Applied |
| R5-ATH-02: athletic doses hold ≤ 2 weeks and reach the block's number | Climb weeks 1-5. Week 6 (end test) and week 1 (baseline) are lighter (m6). | Applied, apart from the test weeks |
| R5-ATH-11: no hard cardio on the eve of sprints or the heavy hinge | Thursday's run is Orange before Friday's top-speed sprints and hex bar. Blue sits on Saturday. | Applied |
| R5-ATH-04: overhead pressing kept for health | No overhead press in 8 weeks (m4). | Not in scope as built (throwers / volleyball / swimmers only) |
| R5-VOL-02: pull ≥ press | Back 10 → 14, chest 10 → 11. | Applied |
| R5-VOL-09: athlete flat press ≤ 4 | Fri Barbell Bench 4 × 6 weeks; Wed Flat DB Bench 3 → 4. | Applied |
| R5-GRD-06 / CH5-01 / CH5-02 | Core optional; "does not count your 2 team practices"; arm slot held and said. | Applied |

## Round-5 review items (the last 03 review): status

| R5 # | Status in r9 |
|---|---|
| m1 arm copy contradicted the plan | **Fixed** ("one exercise of their own ... held at its sets"). |
| m2 shoulders 12 against a final of 11 | **Fixed**: the table prints 11 / 11. |
| m3 Nordic once a week, "easiest to remove" | **Open** (m7). |
| m4 bench 4 vs hex 2 | **Fixed** by R5-ATH-12: hex 3 → 4 in week 2. |
| m5 rep bracket changes inside the block | **Open** (m8): leg extension, Tate press, curl and lateral raise move 10-12 → 10-15 / 8-12 in week 4. |
| m6 week-6 test drops (sprints 440 → 120 m) | **Open** (m6). |
| m7 plyo share flat ~60 % | **Open** (m9; G-139). |
| m8 single-leg forward hurdle hops in block 1 | **Fixed** by R5-GRD-03 / G-253. |
| m9 two identical Orange runs back to back | **Fixed**: Tue Green, Thu Orange, Sat Blue. |
| m10 lateral raise after the calf raise | **Open** (m10). |
| m11 hang power clean → low-hang clean pull (two details) | **Open** (m11). |
| m12 calves 9 in weeks 1-3 | Open question (m12). |
| m13 no contralateral load cue | **Open** (m13). |
| m14 two-leg share; core plane | Open question (m14). |
| m15 Spanish | **Mostly clean** (m15). |

---

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Weeks 1-6, all four lower-body jump stations | **New.** Every jump in the 6-week off-season block is a **two-foot lateral** drill: step hops, plate hops, the lateral jump, the lateral box jump, plus ankle hops. There is no vertical or forward jump (squat jump, box jump, broad jump) for a midfielder who heads the ball and accelerates, and no jump rope (his first step). The menu is the sum of R5-ATH-10 (a lateral jump each day, +8) and the level cap. Nothing balances the directions. | R5-GRD-03 ("start with jump rope then bilateral ... hops"); CAT-10 planes; "adjust accordingly for athletics" | minor | `select.mjs`: when every day already has its lateral jump, the day's second jump station leans to a sagittal / vertical drill. Allow jump rope as a level-1 ankle-track pick. |
| m2 | Wed Two-Foot Lateral Jump, weeks 1-8 | **New.** The same drill for all 8 weeks, across the block change into pre-season (only the contacts move: 8 a set). The other days change at week 7. | PER-02; R2-LIB-01; G-264 | minor | One jump station per day moves on at a block change when the stage moves (RC2 → RC3). |
| m3 | Pre-season (weeks 7-8): Fri Single-Leg Broad Jump | **New, small.** The plan goes from two-leg low (weeks 1-6) straight to a single-leg, higher drill. It skips his "unilateral easy hops" step (single-leg ankle or line hops). A 2-week pre-season makes this hard to avoid. | R5-GRD-03 | minor | With one block left, take level 3 (easy single-leg) before level 4. |
| m4 | Upper body, 8 weeks | No overhead press. The vertical-push slot is the alternating incline DB press in both blocks. R5-ATH-04 was about throwers and volleyball, but his words are general: "overhead pressing should be included for health ... to reach up and have that range of motion". | R5-ATH-04 (spirit); G-252 scope | minor | Widen `incline_overhead.keep_overhead` to every athletic profile that takes incline-first, or add the one-slot joint-care overhead press. |
| m5 | Copy, EN: "Two-Foot Lateral Step Hops (quick, side to side over a low step)" in the tables; JSON id `two-foot-lateral-box-jump` | **New, small.** The name says "step hops"; the id and the swap lines elsewhere say "box jump". Fine for the reader; confusing in the data. | Data hygiene | minor | Align the id and the display name. |
| m6 | Week 6 (end test): sprints 2 → 1 set (440 → 120 m), jumps 96 → 54, Olympic 3 → 2 sets | (Carried.) The athletic work halves in the week the lifting peaks, with no line saying why (see 02 m2). | R5-ATH-02; R2-PER-07 | minor | A test-week line, or keep the non-test days' doses. |
| m7 | Wed Nordic Hamstring Curl, 2 sets once a week | (Carried.) The profile asks "Nordic 2x / week". It is still listed as easiest to remove. | profile injuries | minor | A second Nordic exposure for soccer; keep it out of `easy_to_remove`. |
| m8 | Leg extension, curl, Tate press, lateral raise, week 4 | (Carried.) The rep bracket changes inside the block (10-12 → 10-15 / 8-12). | R4-PRG-03 | minor | Keep a lift's bracket for its exercise block. |
| m9 | Plyo share 61 % in week 1 → 61 % at the end | (Carried, open G-139.) It does not start more ballistic. | R2-ATH-01; G-139 | minor (open) | Drive the station choice from `plyo_share`. |
| m10 | Wed order: the lateral raise prints after the calf raise | (Carried.) His B day puts the shoulder work before the calves (R5-VOL-05: side delts 7th, calves 8th). | R5-VOL-05 | minor | Order shoulder isolation before calves. |
| m11 | Pre-season Monday: Hang Power Clean → Low-Hang Clean Pull | (Carried.) Position and catch both change. | R2-LIB-01 | minor | Keep the lift and change one detail. |
| m12 | Calves 9 in weeks 1-3 | (Carried, open.) Under 10 by the per-leg-day rule. | R3-SES-01 vs H17 | minor (open) | None. |
| m13 | Step-up, RFE, side lunge | (Carried.) No contralateral (one-DB) load cue for a COD athlete. | CAT-13 | minor | A contralateral cue for `field_court` single-leg lifts. |
| m14 | Two-leg share 51 % vs 20 %; core plane | (Carried, open Q2 / Q11.) | STATUS Q2, Q11 | minor (open) | None. |
| m15 | Spanish | (Carried.) "Prueba L de tres conos (L-Drill)" names a training drill as a test. The rest reads naturally; the round-5 lines (practices, optional core) are right. | R2-GEN-08 | minor | Rename the drill in `tools/compile/es/exercises.mjs`. |

**Count: 0 blockers, 0 majors, 15 minors** (m9, m12 and m14 are open questions).

## Fresh checks (as Lalo)

- **His S1 / S2 / S3 athletic days.** Core first, then the athletic block (jumps, throws, COD and sprints), then power, then strength. Horizontal before vertical. Knee lifts with pulls, hip lifts with pushes. A clean on the squat day and a snatch on the hinge day.
- **Season.** The plan says up front that the last 2 weeks are pre-season, with fewer sets and more speed: 76 → 44 sets, jumps and sprints held.
- **Stairway.** 59 → 76 sets in 6 weeks; no group step over 15 %. RIR goes 3 → 2 → 1-2 → 1.
- **Liability.** The release line (accepted in Spanish) prints at the top in EN and ES. Every exercise has a search link.

## The one change that lifts it to A

Balance the block-1 jump menu: one lateral jump a day as now, and the second station a two-foot vertical or forward drill, with jump rope allowed (m1). Move the Wednesday drill on at the block change (m2).
