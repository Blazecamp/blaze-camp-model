// engine/version.mjs - owner B4. Bump on every behaviour change of the engine.
// 0.4.0 (stage B1, coach_answers_round3.md): lines and FOCUS groups, the time check (R3-SES-02), the v1.3 time model, no check-ins.
// 0.4.0 (stage B2): athletic work - stages per exercise block, the athletic stairway, R3-ATH-01 .. 05 defaults (engine/athletic.mjs).
// 0.4.0 (stage B3): selection, variation and rendering - concrete one-detail block changes, intensifiers in the last week only,
//   aerobic sessions by the client's tools, the use-at-your-own-risk line, the printed time check / block switches / supersets.
// 0.4.0 (stage B4): integration - pipeline from clean + the 1,578-intake sweep (0 failing error checks on both models); the class
//   model keeps its lifts, cross-stage seams fixed (throws, in-season Olympic, V19, lone stations, added fills, athletic raise,
//   joint care, room cuts, tests spread), honest schedule copy (DECISIONS E-64 ... E-80).
// 0.4.0 (fix round 1 / F2): athletic work - the plyo share held per week, the tracks' stations from the block's peak targets, stage
//   cues and drills, throws / COD / sprint doses, the sport's Olympic ceiling (DECISIONS E-97 ... E-109).
// 0.4.0 (fix round 1 / F3): selection, dosing and the printed plan - the laterality dial, low-back picks, delt stations by the Focus,
//   level fallbacks, MYO on the last eligible item, the circuit hold, only-true copy, 'How to adjust this plan' (DECISIONS E-110 ... E-134).
// 0.4.0 (fix round 2 / F2): athletic work - jumps and ankle work as two never-drop families, one scale down the block and even
//   steps, a timed test in its station's place and the baseline dose in the end-test week, athletic picks by sport and client, the
//   Olympic lift by the day's lift, WOD density, circuit throws by the round, swimmer shoulder care (DECISIONS E-160 ... E-177).
// 0.4.0 (fix round 2 / F3): selection, dosing and the printed plan - a second selection pass on the stations the time check kept
//   (the upper laterality dial, movement families, the second hip as a leg curl, core planes, no step down, swaps by category),
//   unilateral rep floor, heavy-compound rest, the aerobic ladder, kept exercises / over-time days / test days told in words, the
//   client's Focus picks, class instructions, neutral Spanish (DECISIONS E-178 ... E-205).
// 0.5.0 (work package V1, design/ENGINE_V05_PLAN.md; COACH-CT CT-01, COACH-R4, COACH-CX): template-first, no time-fitting. Session
//   minutes are neither an input nor a constraint (the time check, the cutters, the offers and timefit.mjs are deleted; estimate.mjs
//   keeps the printed estimate); days are the coach's templates sized by exercise count; weekly sets per GROUP follow the stairway
//   to the planned final sets through engine/progression (the audited kernel); the 2-day rule; the bonus exercise on the optional
//   day; plan edits (engine/edit.mjs) (DECISIONS section G).
// 0.5.0 (work package V3 "words and checks"): the liability gate and the release line on every plan (COACH-R4 R4-SCP-01 / R4-SCP-02),
//   reps and load as a rule the person applies (R4-PRG-03), the acceleration note (R4-PRG-02), the time estimate as information
//   (CT-01), easy-to-remove hints (R4-SES-04), the weekly sets per group week by week and the macro views; the v0.5 check list
//   V30 ... V37 (DECISIONS G-37 ... G-50).
// 0.5.0 (work package V4 "integrate"): the coach's gym A / B / C and push / pull / legs days keep each slot's laterality and print slot
//   for slot (COACH-R4 R4-SES-05), a Focus slot never pushes a group over its final sets (R4-PRG-04), the athletic block keeps the
//   speed-session order, every main day opens with a warm-up (ORD-08), handstand work and "no floor work" for older adults, the block
//   view in session order (DECISIONS G-51 ... G-57; samples/STATUS_v0.5.md).
// 0.5.0 (fix round 1, the coach-eye reviews of the 8 samples): the athletic A / B / C days keep each slot's laterality, the
//   'Chest / Shoulders' slot and the high-incline credit, the tested lift first, the floor on the training days, pull against push,
//   isolation at 3 sets with the bonus and the extra small exercise, the steps shared between the weeks (stairwayProgress /
//   staggerStairways), the class and bootcamp sessions, the scaled athletic week, joint care in the template's lift, the MYO rule
//   (DECISIONS G-58 ... G-75; samples/STATUS_v0.5.md).
// 0.5.0 (fix round 2, the second coach-eye review of the 8 samples): core slots on the live library and the low-back repeat, the
//   swimmer's presses, the third chest lift, loaded jumps, the sprint buy-out, the back at its sport-scaled final sets, the cutting
//   sport's single-leg and one-arm work, class skeletons, hang power lifts, bootcamp stations by the kit in his order with 5-s
//   timer steps, the set order (first exercise first), the schedule the plan really runs, the pain words
//   (tools/fixture/v05-fix2.mjs; DECISIONS G-76 ... G-96; samples/STATUS_v0.5.md).
// 0.6.0 (the round-4 coach-eye reviews of the 8 samples, three packages merged): volume targets and set placement - the main lift
//   first, the optional day's bonus for small groups, every capped group said, the physique start, one step an exercise a week, a
//   circuit above its top said (tools/fixture/v06-volume.mjs; DECISIONS G-100 ... G-119); selection - the athletic arm slot,
//   low-back core only with low-back pain, stage-2 jumps, the safe power slot, one-detail block changes, the bootcamp's cardio
//   station, team practices (tools/fixture/v06-select.mjs; G-130 ... G-139); words - circuit progression from the weeks, the
//   pyramid written out, "What changes" by exercise with its sets before and after, one acceleration line a week, the printed-copy
//   minors (tools/fixture/v06-words.mjs; G-160 ... G-179); the integration of the three (G-190 ... G-199).
// 0.7.0 (work package "safety gate, printed words, public files", coach_answers_round5.md): a health-check flag no longer stops the plan
//   - the plan is built and prints a health warning in English and Spanish (R5-GEN-02; severe pain built with the moderate pain rules,
//   PROPOSED); the core block printed as optional and adjustable (R5-GRD-06) (tools/fixture/v07-words.mjs; DECISIONS G-270 ... G-289).
// 0.7.0 (fix round on the round-9 coach-eye reviews): the first press takes the group's first added set and a dip waits behind it (VOL-07),
//   the class's own WODs vary week to week with the Girl and the Hero on training days and small muscles at 10-12 (R5-GRD-04, R5-CLS-05),
//   normal core with a weekly rotational drill without low-back pain (R5-ATH-08), the test week's lighter athletic work said, the cutting
//   sport's lateral jump, a weekly light overhead press for incline-first plans (R5-ATH-04) (DECISIONS G-291 ... G-299).
// 0.7.0 (sweep fix round): a bonus week never raised above a later week, the weeks' targets rewritten with the levelled schedule (H21 / H22),
//   the hold rule never raises plyometric work over the share nor lengthens the next plateau (V27) (DECISIONS G-301 ... G-304).
// 0.7.0 (release "model v1.4 + engine 0.7.0", 2026-10-13): the seed reads rules.determinism.seed_version_map, so the model label
//   1.4.0 keeps the 1.3.0 tie-breaks and every plan is unchanged (DECISIONS G-305).
// 0.7.0 (performance pass, DECISIONS G-311): faster set placement, identical plans - memoised credits, versioned tallies, a memo of the
//   scratch runs, replayed allocation steps; no syntax newer than Safari 15. The version stays 0.7.0: the plan JSON carries it.
export const ENGINE_VERSION = '0.7.0';
