# 13 · Product and output: how people get, follow and adjust a Blaze Camp plan (v1.3)

## v1.3 - round 4, CT-01 and CX-01..04 applied (2026-10-11)

The coach's newest answers outrank everything below: round 4 (`coach_answers_round4.md`, 20 answers, 2026-10-11), his clarification on session time (`coach_answers_time_2026-10-10.md`, **CT-01**) and his clarifications on progression and editing (`coach_answers_codex_2026-10-10.md`, **CX-01..04**). **Authority order: round 4 and CT-01 > CX-01..04 > round 3 > round 2 > round 1 > chat statements > sheets.** **Where this section and a later section of this file disagree, this section wins.** Later sections that v1.3 supersedes carry a "RETIRED in v1.3" or "Changed in v1.3" note under their heading; the text under such a note is history. The master record is `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0d). The twin spec is `generator_spec_v1.json` 1.3.0. The working engine is `engine/` 0.5.0 on the compiled `model/` 1.3.0; its plan contract is `engine/CONTRACTS.md`.

### V1. What v1.3 changes in this file

| # | Change | Sections below it replaces | Source |
|---|---|---|---|
| 1 | **No session-length question and no time check.** The plan is sized by the number of exercises. Each day prints an average time ("about 60-75 min") as information only. Nothing is cut or changed because of time | v1.2 change 4; §0 item 7; §3.1 S5; §4 (time-check row); §12.1; §12.5 C19, C20; §12.6; E4; E5; E6; E10 | COACH-CT CT-01; COACH-R4 R4-SES-01 |
| 2 | **Exercises per session by client type** (general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6); with 2 days every big group at about 6-8 weekly sets and a third day suggested | §3.1 S5 | COACH-R4 R4-SES-02, R4-SES-03 |
| 3 | **His own templates** (the A / B days, push / pull / legs) are what the plan prints; nothing is dropped automatically; each day names the easiest things to remove | §14.5 | COACH-R4 R4-SES-05, R4-SES-04 |
| 4 | **Everything is editable**, the sets of any day or week included; after an edit the totals are recomputed and the plan is marked edited, with no old "validated" stamp | §0 item 6; §14.5; E5 | COACH-CX CX-02, CX-04 |
| 5 | **The stairway reaches its final sets**; a week that jumps more than about 15 % carries a note; a week may keep the same sets; **reps and load progress by a rule the person applies**; the next block starts about 5 % above the last start | §2.2; §15; E6; E10 | COACH-CX CX-01..03; COACH-R4 R4-PRG-01..04 |
| 6 | **The terms and the release must be accepted before a plan is generated** (no plan without it), and **a short release line is printed on every plan**, at the top and the bottom, in English and Spanish, linking `DISCLAIMER.md`. Everyone may use the plans on their own | §0 item 10; §12.4 | COACH-R4 R4-SCP-01, R4-SCP-02 |
| 7 | **Videos: no third-party links.** A YouTube search link built from the exercise name, and the exact name with a one-tap copy; his own videos later | §0 item 15; §7.3 | COACH-R4 R4-LIB-05 |
| 8 | **Optional add-ons**: a list on the plan the person can add from; never template picks (wall balls and sled pushes in HYROX excepted). **Swaps say what they keep and lose** | §14.5 | COACH-R4 R4-LIB-01, R4-LIB-04 |
| 9 | **Sport profiles carry a confidence label** in the data and the docs; it is not shown on a plan | §13 | COACH-R4 R4-SCP-03 |
| 10 | **Credit**: a complete coaching model from the experience of Coach Lalo (Gerardo Vera), Master NASM coach - his intellectual property; no "world's best" or injury-prevention claims | §8 (README wording) | COACH-R4 R4-REL-03 |
| 11 | **Release**: model v1.3 is the product; the engine was rebuilt now (0.5.0, template-first, no time-fitting) and stays marked experimental; the website is built after the model and the engine are finished | §5; §6 | COACH-R4 R4-REL-01, R4-REL-02 |

### V2. What the person sees that is new (wording from the engine's word lists; PROPOSED, the legal lines for attorney review)

| Where | English | Spanish |
|---|---|---|
| Before the build, when the box is not ticked | Read and accept the terms and the release of liability first. No plan is built without it. | Primero lee y acepta los términos y la liberación de responsabilidad. Sin eso no se crea ningún plan. |
| Top of every full plan (self-built) | You accepted the terms and released Lalo Vera, Blaze Camp and BFit Studios Corp. from all liability before this plan was built. You follow it entirely at your own risk. It is general fitness information, not medical advice: stop and see a professional if something hurts. | Aceptaste los términos y liberaste de toda responsabilidad a Lalo Vera, Blaze Camp y BFit Studios Corp. antes de que se creara este plan. Lo sigues por completo bajo tu propio riesgo. Es información general de acondicionamiento físico, no un consejo médico: detente y consulta a un profesional si algo te duele. |
| Every block, week and day view | Liability released before this plan was built: use it at your own risk. Not medical advice. | Responsabilidad liberada antes de crear este plan: úsalo bajo tu propio riesgo. No es un consejo médico. |
| Bottom of every full plan | Liability released: the terms and the release were accepted before this plan was built. | Responsabilidad liberada: los términos y la liberación de responsabilidad se aceptaron antes de crear este plan. |
| Each day | Average time: about {low}-{high} min (an estimate, for information only) | Tiempo promedio: aprox. {low}-{high} min (un estimado, solo como información) |
| Each day | Easiest to remove if you want a shorter day (your choice): {list} | Lo más fácil de quitar si quieres un día más corto (tú decides): {list} |
| Each lift | Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time and start again at {low}. | Progresión: cuando llegues a {high} en todas las series con {rir} en reserva, sube el peso la próxima vez y vuelve a empezar en {low}. |
| A week that jumps | This week jumps more than usual ({pct} % more sets for {group}): adjust if needed. | Esta semana sube más de lo habitual ({pct} % más series para {group}): ajusta si hace falta. |
| A 2-day plan | With {days} training days a week every big muscle group is trained with about {low}-{high} weekly sets instead of 10 or more. A third training day would let every group reach 10. | Con {days} días de entrenamiento a la semana, cada grupo muscular grande se entrena con unas {low}-{high} series semanales en lugar de 10 o más. Un tercer día de entrenamiento permitiría que cada grupo llegue a 10. |
| A group its template cannot hold | {group}: this template holds {held} weekly sets, below the planned {planned}. Add an exercise if you want more. | {group}: esta plantilla alcanza {held} series semanales, menos que las {planned} planeadas. Agrega un ejercicio si quieres más. |
| Each exercise | Name to copy into YouTube: {name} | Nombre para copiar en YouTube: {name} |
| The add-on list | Optional add-ons. Not part of your template. Add any of these if you want; the plan is complete without them. | Extras opcionales. No son parte de tu plantilla. Agrega los que quieras; el plan está completo sin ellos. |
| An old intake that still sends a session length | Session length is no longer asked: the plan is sized by exercises, and how long a session takes is up to you. The time shown on each day is only an estimate. | Ya no se pregunta la duración de la sesión: el plan se arma por número de ejercicios, y cuánto dura cada sesión depende de ti. El tiempo que aparece en cada día es solo un estimado. |

A coach-built plan and a minor's plan have their own release line (a fitness professional built it and is responsible for the client's screening; a parent or guardian accepted). Spanish stays PROPOSED until he or a coach he trusts approves it (R2-GEN-08).

### V3. Session sizes and the time estimate

| Session type | Exercises (not counting the warm-up or the 2 core exercises) | Default sets | ID |
|---|---|---|---|
| General fitness / fat loss, gym days | **5-7** (his A / B day; 7 by default) | 3 compound / 2 isolation / 3 calves | **R4-SES-02**; VOL-16 |
| Aesthetics / bodybuilding | **6-8** (his A / B days; push / pull / legs as his sheet) | 3 compound / 2 isolation / 3 calves | **R4-SES-02, R4-SES-05** |
| Strength | **5-6**: the four roles + survival isolations | his template | **R4-SES-02**; ORD-07 |
| Bootcamp | **5-7 stations**; 3 / 4 / 5 rounds by level (PROPOSED) × 35-50 s | time-based | **R4-SES-02**; PRG-03 |
| Field athlete off-season | **up to 12** (jumps / throws + Olympic + lifts) + the 2-exercise core block | **2 per slot** | **R4-SES-02**; VOL-08, VOL-17, VOL-16; R2-SES-04 |
| Non-competitive athletic / stay athletic | 5-10 (his sheet has 10 slots; range PROPOSED) | 2 per slot | ATH-13 |
| Older adults 60+ | **5-6** | as the goal | **R4-SES-02** |
| CrossFit-style class | warm-up → light core → skill → strength / power → WOD; 5-7 lifts around the skill and the WOD (PROPOSED) | his class tables | OBSERVED; R2-GEN-07 |
| In-season athlete | 2 days a week (the 2-day athletic template, in-season variant) | 1-2 | PER-08 |
| Optional day | Focus 1, Focus 2, calves, core, aerobic; bonus exercises land here | Focus 2-3 sets each | ORD-10, ORD-11 |

**Lengths are estimates, never limits** (CT-01, R4-SES-01). Each day prints "Average time: about 60-75 min (an estimate, for information only)"; the arithmetic is in §5.6. "Sometimes it might be 45 minutes. Sometimes they can take off exercises and make it faster. Sometimes they can add exercises and make it longer. We don't need to be counting their time."

**Counting convention** (APPROVED R2-SES-04; R4-SES-02): warm-up drills never count; the 2 core exercises sit outside the count; a superset of two small isolations counts as one station.

**Time vs minimums: RETIRED** (CT-01; master §5.6.1). **Time-overflow rule: RETIRED** (round 3). Nothing is cut or reshaped for time, and nothing is dropped automatically (R4-SES-04).

### V4. Editing the plan (replaces §14.5 where it differs)

"They should be able to turn off that day's athletic training or that day's core training and just focus on resistance. Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves, or their connective tissues just don't feel like doing any plies and things like that. Then it could be turned off, or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly. The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." (R3-SES-02) "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

"This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to. Ideally, the tool is just so great and smart that edits are probably not going to be needed ... it will be editable, but they might not need to most of the time." (CX-04) "should be editable if they want to adjust their sets on that week or that day doesnt matter" (CX-02)

| Control | What it does | Tag |
|---|---|---|
| **Blocks with stable ids** | every block of every day carries an id that does not change between the weeks of an exercise block, e.g. `blk.A.core.1`, `blk.A.athletic.1`, `blk.A.olympic.1`, `blk.A.strength.2`, `blk.B.calves.1`, `blk.A.finisher.1`; items keep their slot ids, added items get `edit.<n>` | R3-SES-02; format PROPOSED (spec `plan_editing.block_ids`) |
| **Block switch (on / off)** | `core`, `skill`, `athletic` (jumps, throws, agility, sprints), `olympic`, `accessory`, `calves`, `focus` (optional-day Focus slots), `finisher` (conditioning finishers and HYROX station circuits) and `cardio` carry `optional: true, toggle: true` (the union of the 05 / 12 and 13 / spec lists, master §0.3); the `warmup` cannot be switched off; the `strength` block (05 / 12 `resistance`) is edited exercise by exercise (or removed as a block); default scope "this day every week of the exercise block", or "this day only"; switched-off blocks stay visible, greyed, and print as "(switched off)" | **R3-SES-02**; per-kind flags PROPOSED |
| What a switch changes | athletic, Olympic, core and conditioning work never count as muscle sets (VOL-10), so switching them off changes no stairway and no weekly set number (the opener's abs credit drops for that day); the day's time estimate drops by that block's minutes | VOL-10; R3-SES-02 |
| **Remove an exercise / a block** | removes it (this day or every week of the block); the remaining exercises keep their planned sets and keep climbing; **the sets of a removed exercise are not moved elsewhere automatically** (13 / spec; 12 v1.2 §3.10.2 would move them to the group's other exercises that day - cross-file decision §0.3); when a removal leaves a group with 1 exercise that day, the editor says so; the person's choice wins | R3-SES-02; R2-SES-05; mechanism PROPOSED |
| **Change the sets** (v1.3) | the sets of any exercise, on one day or in one week or for the rest of the block; the weekly sets per group are recomputed from what is now written | **CX-02, CX-04** |
| **Easiest to remove** (v1.3) | each day prints "Easiest to remove if you want a shorter day (your choice)": the conditioning finisher, then extra jump / throw stations, then small-muscle accessories, then bonus exercises; at most 6 names; nothing is removed by the tool | **R4-SES-04** |
| **Optional add-ons** (v1.3) | the plan lists up to 6 optional add-ons that fit the person (joint care for their pain areas, the add-ons marked for their sport, a farmer carry for general and athletic goals); the person adds one with an edit; carries land in the conditioning block and count no muscle sets | **R4-LIB-01, R4-LIB-02**; list size and order PROPOSED |
| **+ Add an exercise / a block** | the list offers only what the generator could have picked for this person (equipment, level, age and pain rules, exclusions; never V-squat, bands or 60+ power work without the switch and its warning); **rear-delt work is always offered on upper days** ("People and coaches should always be able to add more rear delts"); default sets compound 3, isolation 2, calves 3; an added exercise climbs with its group's stairway from the week it is added; blocks: a core superset or monster set anywhere (R2-SES-03), an accessory block, a cardio session | **R3-SES-02, R3-VOL-01**; R2-SES-03 |
| **Swap** | the same-category dropdown (GEN-04); one-detail variations only (R2-LIB-01) | GEN-04 |
| **Superset suggested** | every eligible pair (knee lift + pull, hip lift + push, biceps + rear delts, triceps + side delts, calves + delts, core supersets) carries `{pair_id, items, minutes_saved, on}`; shown by default ("Recommend doing supersets so that it's a faster workout"); the person switches a pair on - no session length does (CT-01); suggested only between neighbouring exercises, so nothing is reordered; never two lower compounds, never a heavy lift with a fatiguing lift for the same muscle (contrast excepted) | **R3-SES-02**; ORD-05 |
| **Reset** | "Reset to the generated plan" undoes every edit | PROPOSED |
| After an edit | the weekly sets per group are **recomputed**; the plan is **marked edited** (`plan.edited = true`, with the list of edits); the checks run again and their result is stamped "edited" - **no old "validated" stamp stays on a changed plan**; where the edit leaves the template's rules (a trained group under its floor, a day without its core block, a day above its exercise count) the tool lists it as a note - **notes, never refusals, and nothing is repaired behind the person's back**: the locked rules bind what the generator builds and what the "add" list offers, not what people take out of their own plan | **CX-04**; R3-VOL-04, R3-SES-02; mechanism PROPOSED |
| Where edits live | inside the plan (`plan.edits[]` on top of the generated plan); they travel with the plan link and the plan file and are printed in every image, PDF and sheet; Blaze Camp keeps nothing | **R3-GEN-01** |
| What every export says | "You can switch off today's jump / throw block or core block, remove or add exercises or blocks, and do the suggested supersets to save time" (copy C17, `edit.hint`), with the optional blocks and suggested supersets marked, so a coach's screenshot tells the client what they can change | **R3-SES-02** |

The generator still builds every plan by the rules first: the core opener every session, the athletic budget, his template complete, calves on leg days, the floor on every trained group from 3 training days, a stairway that reaches its planned final sets. It does not shorten or trim a plan for anyone. The person does that, with the hints above (R4-SES-04). An editable template is not a guarantee that every possible edit follows the rules (CX-04's record). The engine's edit function is `applyPlanEdits(plan, edits, model)` in `engine/edit.mjs` (`set_sets`, `remove_exercise`, `add_exercise`, `set_block`); the generated plan is never changed in place.

### V5. The data contracts in v1.3 (replaces E4 where it differs)

- **Intake** (`intake/3`): no `schedule.session_minutes`. An intake that still sends it is accepted, the value is ignored, and the plan carries a notice. `release.accepted` must be `true` or no plan is generated.
- **Plan** (`plan/2`, engine 0.5.0): no `time_check`, no offers, no session minutes, no day minute limit. New: `edited`; `release_stamp.accepted`; `meta.session_size`, `meta.two_day`, `meta.addons`; `meta.stairway[]` per group (start, top, schedule, arrival week, capped, below the floor, bonus, acceleration); day `exercise_count`, `skeleton`, `easy_to_remove`, `est_minutes` (information only); item `progression`, `swap_notes`, `instead_of`, `video {kind: search, url, copy_name}`. The authoritative contract is `engine/CONTRACTS.md`.
- **Engine API**: `generate(intake, model)`, `applyPlanEdits(plan, edits, model)` (`set_sets`, `remove_exercise`, `add_exercise`, `set_block`), `validate(plan)`, the renderers (full plan, overview, block, week, day; macro views for screenshots). The generated plan is never changed in place.
- **Checks**: no check reads minutes; the list is in `BLAZE_CAMP_BRAIN.md` §13.6 (V1-V37).

---


## v1.2 - round 3 applied (2026-10-09)

> **Changed again in v1.3.** This list is the v1.2 change record, kept as written. Its rows about the time check and time vs minimums (R3-SES-02: offers, "fewer groups trained directly", "never flat"), about the 7 % and 10 % limits, and about the next block's "cap + 1" were changed again by COACH-CT CT-01, COACH-CX CX-01..04 and round 4. The v1.3 section above wins.

What changed from v1.1. Each change is applied in the tables, examples and contracts below, not only listed here. The v1.1 change table and the v1.1 verification log are kept near the end of the file as history; the v1.2 verification log closes the file.

| # | Change | Source |
|---|---|---|
| 1 | **No check-ins, no tracking, no adaptive inputs.** The generator takes the answers and puts out the whole plan once, with its built-in stairway; people and coaches adjust it themselves. The weekly check-in, the four tracking levels, the check-in step table, the HOW IT FELT? engine rules, the "block can't be finished" signals, the in-app maintenance and block-done prompts, week-by-week mode on check-ins and `adapt()` are **RETIRED** (§2, §3.2, E4-E6). | COACH-R3 R3-VOL-02, R3-VOL-04 |
| 2 | **No data kept, anywhere.** No accounts, no server database, no analytics with personal fields, no research data, no email field. The engine runs in the browser; the person keeps the plan as an image, PDF, sheet, plan link or plan file. The v1.1 "data to collect with consent" section and the v2 accounts are retired (§2.5, §7.5, E8). | R3-GEN-01 |
| 3 | **The plan can be edited.** Switch off a day's athletic block or core block, add or remove exercises or whole blocks, turn suggested supersets on or off. Blocks carry stable ids and on / off flags; every export tells the reader what can be switched off (§14.5, E4 `plan/2`, spec `plan_editing`). | R3-SES-02 |
| 4 | **Time vs minimums - RETIRED in v1.3 (COACH-CT CT-01; COACH-R4 R4-SES-01)**. v1.2 text: tell the person up front and offer another day or longer sessions; if they keep their time, train fewer groups directly (big movers first; keeping the focus groups too is our PROPOSED reading of R3-SES-01, N-PROD-27); recommend supersets; the stairway always climbs on the groups that are trained (S5, copy C19-C20). | R3-SES-02 |
| 5 | **Focus muscle 1 and Focus muscle 2** (optional, max 2) replace "muscles to bring up": each gets +1 to +3 extra weekly sets over the balanced plan, riding the stairway. One "shoulders" choice covers front, side and rear delts. No sex field. | R3-SES-01, R3-VOL-01 |
| 6 | **The stairway is approved in numbers** (about 3 % a week to the halfway week, about 5 % after it, each group reaching its ceiling in the last week; effort 3 RIR → 2 → 1-2 → 1 + intensifiers in the last week, always inside 1-3) and is now the only way a plan grows (§2.2, §15). | R3-VOL-04 |
| 7 | **The easy week after a block is a recommendation.** When a block ends, it ends, and the person builds the next one. Holidays go between blocks. The plan's last page says what's next (copy C15). | R3-PER-01 |
| 8 | **Health check and release approved:** a short Blaze Camp health check written by a lawyer in English and Spanish, with a link to the official PAR-Q+; coaches run it with the client or skip it with the legal warning; **one unticked box (use at my own risk + terms and conditions + liability release) every time a plan is built or rebuilt**, based on `DISCLAIMER.md` / `DISCLAIMER.es.md`; the record is printed on the plan and every export, never stored (§12). | R3-GEN-01 |
| 9 | **MIT licence** to Lalo Vera (doing business as Blaze Camp) and BFit Studios Corp. for the whole repository; Apache-2.0 + CC BY 4.0 retired (§8, `LICENSE`). | R3-GEN-01 |
| 10 | **Stay-active play days and event dates approved:** the hardest gym day stays at least 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps; a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2); with an event date the hardest weeks end 1 week before, then 1 easy week at about half the sets (§13.3). "High rows" = HYROX is confirmed. | R3-ATH-05, R3-ATH-03 |
| 11 | Athlete defaults that show on product screens: 60+ (landing drills, balance, quick stepping, light medball throws, fast machine work on; ankle hops, other jumps, Olympic lifts and depth jumps off unless switched on with the warning), pickleball / padel / tennis players from 50, swimming dryland, HYROX (copy C7, C7b; §13). | R3-ATH-01, R3-ATH-02, R3-ATH-03, R3-ATH-04 |
| 12 | **Recommendation and roadmap:** phase 1 = the plan website with editing and exports; then open source under MIT. No phase 1.1 check-in, no v2 accounts, no learning phase. MVP estimate 13.5-20 developer-weeks (§5, §6, §9, E12). | R3-VOL-02, R3-VOL-04, R3-GEN-01; estimate INFERRED |
| 13 | Videos stay optional (no change). | R2-GEN-02 |

---

**What this is.** The coach asked for ideas on what the generator should hand people (COACH-ANSWER GEN-03): "I don't know what the output should be yet ... you should be able to give me some ideas." v1 laid out four options; in round 2 he approved a website, then a check-in, then open source (R2-GEN-02); in round 3 he simplified it: "I want this to be very simple ... I want them to be able to kick out a program, and that's it" (R3-VOL-04), with no data kept (R3-GEN-01). This v1.2 document describes that product: what a user sees, how plans are shared and edited, how the health check, terms and release work, how the sport picker covers every popular US sport and the "stay athletic and active" crowd, what it costs, and what is still open. The main body is written for the coach. The engineer appendix (section E) holds the data contracts and the build plan.

**Status.** Items marked APPROVED come from his round-2 or round-3 answers. Everything marked PROPOSED is a recommendation waiting for his yes or no. RETIRED marks what round 3 removed. Legal copy is marked **[LEGAL REVIEW]** and must not ship without a lawyer's review. Nothing here changes a training rule; the training rules live in `BLAZE_CAMP_BRAIN.md`, `generator_spec_v1.json` and synthesis files 01-12. This file only decides how those rules reach people.

**Read with.** v1.3: `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md` (CT-01) and `coach_answers_codex_2026-10-10.md` (CX-01..04) are authoritative above everything else; `generator_spec_v1.json` is 1.3.0. v1.2: `coach_answers_round3.md` (authoritative, above everything else), `coach_answers_round2.md`, `coach_answers_full.md`, `generator_spec_v1.json` 1.2.0 (`inputs_schema`, `plan_editing`, `legal_and_privacy` and `output` are the machine twin of this file; `adaptation` is a retired stub), `BLAZE_CAMP_BRAIN.md` §13-14, `12_volume_algorithm_v1` v1.2 (stairway, focus sets, time vs minimums), `05_session_architecture` v1.2 (groups, templates), `06_periodization` v1.2 (plan shapes, block end, calendar), `04_profiles.json` v1.2 (sport and activity profiles), `DISCLAIMER.md`, `DISCLAIMER.es.md`, `LICENSE`.

**Map.** §0 one page · §1 your decisions · §2 no check-ins: the whole plan up front · §3-5 the options and the recommendation · §6 roadmap · §7 how it is built · §8 open source (MIT) · §9 cost · §10 risks · §11 decisions for you · §12 start flow: health check, terms and release · §13 sport and activity picker · §14 views, editing, screenshots and exports · §15 weight guidance · Appendix E for the engineer · History (v1.1) · v1.2 verification log.

**Evidence labels.**

| Label | Meaning |
|---|---|
| **COACH-R3 <ID>** | The coach's round-3 answer in `coach_answers_round3.md` (2026-10-09). Highest authority. |
| **COACH-R2 <ID>** | The coach's round-2 answer in `coach_answers_round2.md` (2026-10-08). Authoritative unless round 3 changed it. |
| **COACH-ANSWER <ID>** | The coach's round-1 answer in `coach_answers_full.md` (2026-10-08). Authoritative unless round 2 or 3 changed it. |
| **COACH-CHAT <date>** | A direct request from the coach in the project chat (2026-10-08: "all of the different popular sports in the United States", swimming, pickleball, "high rows", "stay athletic and active"). |
| **OBSERVED** | Read from his sheets (dumps) or computed from the team's catalog files with the project venv. |
| **SCIENCE** | Peer-reviewed evidence (references at the end). |
| **RESEARCH** | Product, pricing, platform or legal facts from public web pages, accessed 2026-10-08 (references at the end). Prices and terms change; re-check before buying or shipping anything. |
| **INFERRED** | The team's reasoning or estimate. |
| **PROPOSED - PENDING COACH APPROVAL** | A recommendation the coach must accept before it is built. Shortened to **PROPOSED** below. |
| **APPROVED** | A PROPOSED item the coach marked RIGHT in round 2 or round 3 (the ID is given). |
| **RETIRED** | Removed by a coach answer (the ID is given); kept only as a short note. |

---

## 0. The answer on one page (for the coach)

1. **A website, not an app.** It opens from a link on any phone, looks and feels like an app, can be added to the home screen and opens without signal in the gym (the site itself is cached; none of your answers are). [APPROVED, R2-GEN-02; COACH-ANSWER GEN-03]
2. **Put in your answers, get the whole plan.** The tool builds the plan once, with its built-in stairway, and shows all of it ahead of time. No check-ins, no tracking, nothing to report back. People and coaches adjust it themselves. [APPROVED, R3-VOL-02, R3-VOL-04]
3. **Nothing is kept.** No accounts, no server, no email field; Blaze Camp never sees the answers or the plan. People keep their plan as an image, PDF, sheet, link or file. [APPROVED, R3-GEN-01]
4. **As few clicks as possible, made for the phone.** One question per screen with big buttons, smart defaults, "More options" folded away; a client gets from the link to a plan in about 14 taps (INFERRED count, §12.6). [R2-GEN-02; R3-VOL-04]
5. **See the whole thing at a glance.** One toggle switches between the **Block** (all 12 weeks), the **Week** and the **Day**, with "show" chips (exercises, sets × reps, effort, cardio, jumps and throws). [R2-GEN-02; layout PROPOSED, §14]
6. **Change it yourself.** Switch off today's jump / throw block or core block (a pickleball player with sore calves), remove or add exercises or whole blocks, change the sets of any day or week, and turn on the suggested supersets to save time. Nothing is dropped automatically: each day names the easiest things to remove and you decide. Every screenshot says what can be switched off. [APPROVED, R3-SES-02; v1.3 COACH-CX CX-02, CX-04, COACH-R4 R4-SES-04; layout PROPOSED, §14.5]
7. **Sized by exercises, not by minutes.** The form does not ask how long you want to train. A session holds the number of exercises that fits the person (general fitness and fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6), built on your own day templates. Each day shows an average time as information only; nothing is cut or changed because of time. With 2 training days every big muscle is still trained, at about 6-8 sets a week, and the plan suggests a third day. [v1.3: COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02, R4-SES-03, R4-SES-05. Retired: "Not enough time? It says so first", R3-SES-02's time order]
8. **Focus muscle 1 and Focus muscle 2.** Optional: each gets 1 to 3 extra sets a week on top of a balanced plan. [APPROVED, R3-SES-01]
9. **Screenshot and send.** One tap saves the whole 12-week block or one week (or one day) as an image a coach can text to a client; also print / PDF, a Google Sheets / Excel download with your BYOP columns, a plan link and a plan file. [R2-GEN-02; §14]
10. **Health check, coach skip, own risk every time.** Clients answer a short Blaze Camp health check (written by a lawyer in English and Spanish, with a link to the official PAR-Q+); coaches can run it with their client or skip it with your legal warning. **Everyone, client or coach, ticks "use at my own risk + terms + liability release" every time a plan is built. v1.3: the tick is required - no plan is generated without it - and a short "liability released" line is printed at the top and the bottom of every plan, in English and Spanish.** [APPROVED, R3-GEN-01; R2-GEN-03; v1.3 COACH-R4 R4-SCP-01, R4-SCP-02; §12]
11. **Only workouts, nothing about sleep or stress.** [R2-GEN-04]
12. **Every popular US sport, with positions, swimming included; and a "Stay athletic and active" door** for gen-pop people who want pickleball, padel, tennis, golf, HYROX, rec leagues, running, hiking or skiing, with optional play days and an event date. [COACH-CHAT 2026-10-08; R2-GEN-05; APPROVED R3-ATH-05; §13]
13. **Weights in plain words.** "Leave 2 reps in the tank (RPE 8)": 3 in the tank early, 2 in the middle, 1-2 late, 1 plus a few extra-hard sets in the last week; percentages only with a recent tested best on a barbell main lift; Olympic lifts explained as power. v1.3: every lift prints the rule for adding weight ("when you hit 12 on every set with 2 left in the tank, add weight next time and start again at 8"); no number is promised for a week (COACH-R4 R4-PRG-03). [R2-GEN-06; APPROVED R3-VOL-04; §15]
14. **When a block ends, it ends.** The last page recommends an easy week and then building the next block one step up (about 5 % above the last start, never above the level's top; COACH-R4 R4-PRG-04) (or a maintenance plan); the easy week is a recommendation, not a rule. Holidays go between blocks. [APPROVED, R3-PER-01]
15. **Videos: a YouTube search, never someone else's link.** A "Watch how" link opens a YouTube search for the exercise name, and the exact name can be copied with one tap; your own videos replace it as you film them. [R2-GEN-02; v1.3 COACH-R4 R4-LIB-05; §7.3]
16. **English first, full Spanish switch;** legal texts legally equivalent in both languages. [APPROVED, R2-GEN-08; R3-GEN-01]
17. **Default exercise in every slot, with a dropdown to swap within the same category;** coaches can add their own rules; your hard rules stay locked for what the tool builds. [COACH-ANSWER GEN-04, GEN-08; mechanism PROPOSED]
18. **Open source under MIT,** to you, Blaze Camp and BFit Studios Corp., with the disclaimer in English and Spanish. [APPROVED, R3-GEN-01] v1.3: it describes itself as a complete coaching model from the experience of Coach Lalo (Gerardo Vera), Master NASM coach - your intellectual property - with no "world's best" or injury-prevention claims (COACH-R4 R4-REL-03).

**The plan in one line [v1.2; R3-VOL-02, R3-VOL-04, R3-GEN-01]:** phase 1 the plan website (Option A with plan editing; the Google Sheet as a download, Option C) → open source under MIT (Option D) once you approve v1. The weekly check-in (Option B) is retired.

---

## 1. What you already decided

### 1.1 Round 1 (the product rules from your first answers; notes where rounds 2 and 3 changed them)

| ID | Your answer | What it means for the product |
|---|---|---|
| GEN-01 | Users: clients, coaches, trainers, strength and conditioning coaches, anyone. "It should start in English and toggle to Spanish if needed, the whole thing." | One site for everyone, with a **coach mode** for people building plans for others (now also the switch for the health-check bypass, R2-GEN-03). Spanish covers screens, exercise names, cues, images, PDFs and sheets alike (no emails are sent, R3-GEN-01). |
| GEN-02 | Drop sex. Use training experience in years. Competitive athletes: sport, position, season. Recreational: general sport only. Add body weight. | The intake (§12, §13, E4) uses these fields. No sex field; body weight required; sport, position, season and practice load only for competitive athletes; recreational players pick an activity only. |
| GEN-03 | Output undecided; ideas: a PDF they can screenshot, something easy on the phone, maybe a Google Sheet, no full app, maybe a website plus an open-source repo. Unsure whether people should track. | Decided in round 2 (R2-GEN-02): website, images, PDF, sheet download, open source later; round 3 removed the check-in and keeps no data (R3-VOL-02, R3-VOL-04, R3-GEN-01). |
| GEN-04 | Pick the default and keep the dropdowns: "That's going to be important." | Every exercise card has a swap list limited to the same category. |
| GEN-05 | RIGHT: adjust week to week from logged EFFORT and HOW IT FELT. | **Superseded by round 3** (R3-VOL-02, R3-VOL-04): no check-in. The stairway and the reps-in-reserve cue do the week-to-week work, and people and coaches change the plan themselves (§2). |
| GEN-06 | Video for every exercise: "we need more links ... needs to get done." | Softened in round 2: videos are optional; link-out to YouTube until his own library exists (R2-GEN-02, §7.3). |
| GEN-07 | RIGHT: a short cue per exercise plus your instruction block at the top. | Cue under every exercise; your instruction lines at the top of every plan. |
| GEN-08 | RIGHT: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped; "and options for a coach to add their own rules." | Locked rules plus a coach rule layer (§7.2). |
| PER-01 | Plan lengths: 4-6-week maintenance / transition at about 50-70 % volume, 8 weeks, 12 weeks preferred, week by week, a year. | Plan-type choice on the intake. **Round 2 changed the shapes**: every plan is a stairway (R2-PER-03, R2-PER-04); maintenance length is chosen (R2-PER-06). **Round 3:** "week by week" ran on check-ins and is retired as a separate mode (N-PROD-22); maintenance after a block is a recommendation (R3-PER-01). |
| PER-07 | Tests chosen by checkbox, or "No need for testing"; a reminder "It's time for your test. Get ready." | Test checkboxes on the intake; **round 2: test before the block (or in week 1) and at the end, never mid-block; untrained people never test a 1-rep max or a max mile from zero** (R2-PER-07). The reminder is printed in the plan and set as a calendar alarm (nothing stored, R3-GEN-01). |
| VOL-01, VOL-02 | "This eventually will be something that learns from the data of all the people that use it." | **Superseded by round 3** (R3-GEN-01: "I don't want any data kept"): nothing is collected, so the tool does not learn from users; the model improves through your reviews (§7.5; N-PROD-26 asks you to confirm). |
| VOL-06 | "I need this tool that we're building eventually to figure out the percentages." | Users never see percentages; they see the sets × reps of every week, the stairway written out. |
| VOL-13 | RIR is the effort language; explain RIR and how it relates to RPE. | Effort written as "leave 2 reps in the tank (2 RIR · RPE 8)", always inside 1-3 RIR, with a short "How hard?" page in both languages (§15). |
| ATH-11 | Core first (it is the warm-up), but users can move the core block. | "Move core block" setting: start (default) / after plyos / after strength / end. Round 2: core opens light (2 × 2) and coaches may add core supersets anywhere (R2-SES-03). Round 3: a day's core block can be switched off in the plan view (R3-SES-02). |
| ORD-10 | Optional days: ideally separate. | Setting: "Optional work: on its own day (recommended) / added to my training days". |
| PER-03 | A/B lead-lift weeks for people who want variety. | Setting: "I like variety" turns A/B weeks on. |
| EQ-10 | The client's own preference can choose between alternatives. | The swap dropdown; a swap applies to that slot for the exercise block and travels with the plan (nothing stored). |
| EQ-01, EQ-07, EQ-08, EQ-12 | No bands, no variable resistance anywhere for now. | Equipment screens offer no band options; band exercises are never shown or offered as swaps. |
| EQ-14 | Aerobic work on any machine; tracking it week to week matters. | The sheet keeps a 'WEIGHT USED or SCORE' column for time, distance or calories, for the person's own tracking (PRG-08). Round 2: users can ask for more or less cardio (R2-SES-06). |
| PRG-05 | L1 / L2 / L3 "but explain it a little bit better". | Level explained on screen in plain words with the reason ("You trained 3 years but took 9 months off, so we start your body at Level 1 for now"). |
| ATH-13, FIX-03 | Names general and understandable; 'Justice League' was a marketing name for a non-competitive all-round athletic program. | Plan names shown to users are descriptive ("Athletic all-round, non-competitive"). This program is now one tile of the "Stay athletic and active" door ("A bit of everything", §13.3). |
| FIX-04 | Correct spelling in the generator; leave his sheets alone. | All shown text corrected; his sheets never touched. |
| PRG-01 | SKIP ('NO ACCESS' tabs). | Answered in round 2: a self-serve version without coach access (R2-LIB-08). Product tiers: **self-serve** (anyone, no coach) and **coached** (coach mode, no accounts; R3-GEN-01). Free vs paid is still open (N-PROD-09). |

### 1.2 Round 2 (what you decided about the product; v1.2 notes where round 3 changed it)

| ID | Your answer | What it means for the product |
|---|---|---|
| R2-GEN-01 | RIGHT: the plan works with no tracking; an optional 1-minute weekly check-in decides next week's step; the week-by-week plan needs the check-in. | v1.1: tracking levels 0-3 and a check-in for week-by-week mode. **v1.2: RETIRED** by R3-VOL-02 / R3-VOL-04 (no check-in, §2.4); "the plan works with no tracking" is now the whole product. |
| R2-GEN-02 | RIGHT: phone-friendly website first, then the check-in, then open source. "The fewer clicks, the better ... the macro view of the week, the macro view of the block, and the macro view per day ... options for visibility easily toggled." A coach "can just screenshot their 12 weeks ... or 1 week and send it over". Videos: "They can just look up the videos on their own on YouTube"; add his own videos later; a "send us your video" email. | §0, §5, §6 (website and open source still approved; the check-in step retired by R3-VOL-02 / R3-VOL-04; licence now MIT, R3-GEN-01); §14 views and screenshots; §7.3 optional videos. |
| R2-GEN-03 | RIGHT on the refer list (chest pain or heart issues, surgery or fracture in 6 months, pregnant or gave birth in 6 months, injury under treatment, doctor said no). Clients go through the PAR-Q; coaches can toggle the check or bypass it with a legal warning to follow their own onboarding; "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." | §12: start flow, refer rule, coach skip, liability release every time; **round 3 approved the details** (lawyer-written short health check EN / ES with a PAR-Q+ link; one own-risk + terms + release box every build; nothing stored; R3-GEN-01) [LEGAL REVIEW]. |
| R2-GEN-04 | NOT RIGHT on sleep, stress and physical-job taps: "I just need the workouts here. There's no need to talk about sleep or stress or anything else." | Intake field "Your usual week" removed; no lifestyle question anywhere (and, since round 3, no check-in at all). |
| R2-GEN-05 | RIGHT: ask the next season start date (or "in season until") plus practice and game days per week; the tool works out off-season, pre-season and in-season. | Competitive athlete screens (§13.2). |
| R2-GEN-06 | RIGHT: reps-in-reserve language with a week-1 tip; percentages only with a recent best. Plus: untested Olympic lifts and maxes → RPE or RIR; "Olympic lifts should be explained on there easily: these are for power output"; percentages only for competitive Olympic lifters, whose programming "is completely different". | §15 weight guidance; Olympic weightlifting as its own program type (§13.2, N-PROD-17). |
| R2-GEN-07 | RIGHT: he will grade sample plans: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs. | Phase 0 sample set (§6). His list has seven plans although the question said five; we plan for seven (INFERRED). |
| R2-GEN-08 | RIGHT: neutral Latin American Spanish, English gym word in brackets, approved line by line by him or a coach he trusts; lb in the US, kg elsewhere, switchable. | §7.4; F06 units. |
| R2-VOL-01, R2-VOL-02, R2-VOL-03 | Step table approved; effort 10 = "the max I can do, not a fail"; no check-in = "the plan doesn't change. There is no data to go off of." | v1.1 check-in and step table. **v1.2: RETIRED** with the check-in (R3-VOL-02); "no data, no change" now holds for every plan: the planned stairway is the plan (R3-VOL-04). Effort 10 = "the max I can do" survives as the helper of the sheet's EFFORT column (C13). |
| R2-VOL-07, R2-PER-06 | No maintenance or deload week in the middle of a block; can't complete it → cancel the block → maintenance → a whole new block; maintenance weeks are chosen and extendable, and at the end the tool asks what next. | No maintenance or deload week inside a block (still a locked rule). **v1.2:** the "can't finish" offer and the in-app maintenance screens are retired; the person stops when they decide and builds a maintenance plan (weeks chosen) or a new block; the easy week after a finished block is a recommendation (R3-VOL-02, R3-PER-01). |
| R2-PER-01, R2-PER-02 | The year plan is for gen-pop "stay in shape"; users can re-order blocks, change cardio, add a winter powerlifting-style block, mark their own holidays. | S16 year view becomes editable (§3.1); holidays are planned between blocks (R3-PER-01). |
| R2-PER-07 | Test before the block (or at the start) and at the end, never during; no 1-rep max or max mile from zero ("If they haven't finished a block of training ... they should never start from zero testing their maxes"), use a 5- or 3-rep max or 80-90 % efforts. | F26b tests screen and reminders (§3.1, §12.6); a 1-rep max or an all-out mile is offered only to someone coming off a completed training block (§3.1 S6, §7.6). |
| R2-SES-06 | Cardio adjustable: "I need more cardio" adds it; "less cardio" takes it away. | A "Cardio: less / as planned / more" control in the week view and settings. |
| R2-ATH-08 | 60+: no Olympic lifts, plyos or depth jumps by default; an option if they want it, with a warning to have a fitness professional help them. | Opt-in switch with his warning; **refined by R3-ATH-02**: landing drills, balance, quick stepping, light medball throws and fast machine work stay on; plus the racket-player rules from 50 (§12.5 C7, C7b). |
| R2-LIB-08 | 'NO ACCESS' = a self-serve version without coach access. | Self-serve tier (§1.1 PRG-01). |

### 1.3 Round 3 (what you decided on 2026-10-09)

| ID | Your answer | What it means for the product |
|---|---|---|
| R3-VOL-02 | RIGHT, and: "we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." | The weekly check-in and everything built on it are retired (§2.4). The intake asks nothing after the build. |
| R3-VOL-04 | RIGHT on the stairway in numbers, and: "anybody can just plug in the numbers of what they want as far as weeks and sport or goals. The program would just kick itself out ... I don't want people to be checking back on their phone in their program ... very simple for them to see the whole thing ahead of time." | The plan is generated once and shown whole (Block view). Its stairway (about 3 % a week to halfway, about 5 % after, each group at its ceiling in the last week) and the effort drift (3 → 2 → 1-2 → 1 RIR + intensifiers) are the only progression (§2.2, §15). |
| R3-VOL-01 | PARTLY: rear delts are "part of the shoulder cap"; "I wouldn't categorize the rear delt as an individual muscle ... People and coaches should always be able to add more rear delts." | The Focus picker has one "Shoulders" choice; the floor is counted on the shoulders group; "add exercise" offers rear-delt work (§14.5). Numbers in `12` v1.2. |
| R3-VOL-03 | RIGHT: an added set alternates between Monday's and Thursday's first exercise for the muscle; extra small-muscle sets become a short bonus exercise on the optional day or on a day that already trains that muscle, never as that day's only exercise for it. | No screen; the plan shows it in the Block view as the stairway's added sets. |
| R3-SES-02 | RIGHT on the time-vs-minimums order (**superseded by CT-01 in v1.3**), and: "Recommend doing supersets so that it's a faster workout ... they should be able to turn off that day's athletic training or that day's core training and just focus on resistance ... they can delete certain exercises ... The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." | The time check on the schedule screen (S5, C19-C20); plan editing: block switches, add / remove exercises or blocks, superset suggestions (§14.5). |
| R3-SES-01 | RIGHT on counting focus groups (hips = glutes + hamstrings; shoulders = front + side + rear delts; calves one exercise × 3 sets per leg day; field athletes 2-4 exercises per group trained that day inside 12 + 2 core; cross pattern by default, same-pattern template for size-focused and high-level athletes), and: "they should be able to choose one of the main muscles that they want to work on the most ... an extra set or two or three ... a main focus muscle 1 and a main focus muscle 2." | Focus muscle 1 / Focus muscle 2 on the goal screen, +1 to +3 weekly sets each (S3, C21). His example of a woman choosing glutes is only an example: no sex field. |
| R3-PER-01 | RIGHT, and: "maintenance weeks are a recommendation. They don't have to be mandatory ... when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." | The last page of every plan recommends an easy week and the next block; the person builds it (S18, C15). Holidays are planned between blocks; a holiday marked inside a running block ends that block there. |
| R3-ATH-01 | RIGHT: swimming dryland defaults (3 gym days + 1 optional, 2 for younger or lower-level swimmers; 0 extra cardio; jumps mostly ballistic, 25 % plyometric at the end of a block; Olympic lifts 2-3 days; shoulder care every session, never bands; a 2-week dryland taper lined up with the swim taper before the main championship meet). | The swimming picker asks the championship meet date (F14) so the taper lands on it (§13.2). |
| R3-ATH-02 | RIGHT: from 60, landing drills, balance, quick stepping, light medball throws and fast machine work on; ankle hops, other jumps, Olympic lifts and depth jumps off unless switched on with your warning; overhead and low-bar squats out. Pickleball, padel and tennis players from 50: knee-friendly strength, calf and Achilles work every leg day, rotator cuff, low-impact jumps only unless switched on. | Two switches under More options with your warning (C7, C7b). |
| R3-ATH-03 | RIGHT: "high rows" = HYROX; 2 strength + 2 hybrid days, 4 cardio sessions, 2 short station circuits a week as finishers (not muscle sets), wall balls ≤ 20 lb, 40-rep / AMRAP sets only inside the circuits, jumps 50 % plyometric. | The HYROX tile is confirmed (§13.3). |
| R3-ATH-04 | RIGHT: plyometric shares for the remaining sports; no extra cardio for swimmers, runners, rowers and endurance cyclists; the in-season game-heavy rule for more team sports; recreational players use their activity's share. | No new screen; sport and activity profiles (`04` v1.2). |
| R3-ATH-05 | RIGHT: play days (hardest gym day ≥ 48 h before the biggest play day; 3+ play sessions a week drop the extra agility drills and half the jumps); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2); an optional event date (hardest weeks end 1 week before, then 1 easy week at about half the sets). | Play days, play length and event date under More options for stay-active users (§13.3). Answers N-PROD-18. |
| R3-GEN-01 | RIGHT on the lawyer-written Blaze Camp health check (EN / ES) with a link to the official PAR-Q+, the coach skip with a legal warning and the release at every build, and: "there probably should be a 'use at your own risk' checkbox. I don't know if we should be keeping any kind of data, but I don't want any data kept ... Terms and conditions and liability releases. They should all be in that." Plus: MIT to Lalo Vera, Blaze Camp and BFit Studios Corp.; the README and repo state that people download and use it at their own expense and risk, and that anyone using it for clients needs their own liability release; a legally equivalent Spanish version. | §12 (one box, every build, printed not stored), §2.5 and §7.5 (nothing kept), §8 (MIT; `LICENSE`, `DISCLAIMER.md`, `DISCLAIMER.es.md` already exist as drafts for a Florida attorney). |

### 1.4 Round 4, CT-01 and CX (what you decided on 2026-10-10 and 2026-10-11)

| ID | Your verdict and words | What it means for the product |
|---|---|---|
| CT-01 | "You need to stop trying to be responsible for the people's time ... I want you to not get complicated over the time." | no time-fitting anywhere; a time estimate as information |
| CX-01..03 | "go ahead and increase faster if thats the need, they could edit accordingly"; the same sets may hold while reps or load progress | the stairway reaches its final sets; a note on big weeks |
| CX-04 | "it should be all editable as they need to ... it will be editable, but they might not need to most of the time" | a complete, editable template |
| R4-SES-01 | RIGHT: "Drop it. We don't need it." | no session-length question |
| R4-SES-02 | RIGHT: "These are templates that we're giving them for them to add or take away" | exercises per session by client type |
| R4-SES-03 | RIGHT | 2 days: every big muscle at about 6-8 weekly sets; a third day suggested |
| R4-SES-04 | PARTLY: "they get to pick what they want to keep or what they want to take away" | nothing dropped automatically; "easiest to remove" hints |
| R4-SES-05 | NOT RIGHT, with your A / B template | your day templates are the skeleton |
| R4-PRG-01..04 | RIGHT | arrival in the last week; no hard limit with a note; rule-based progression; the next block |
| R4-LIB-01..05 | RIGHT | optional add-ons; carries by distance or time; mid-range pull and incline first; swap notes; YouTube search and copy-the-name |
| R4-SCP-01, R4-SCP-02 | RIGHT / PARTLY: "they need to click it before the plan shows" | the release is a required gate and a printed line |
| R4-SCP-03 | RIGHT | confidence labels on sport profiles, not on plans |
| R4-REL-01..03 | RIGHT / PARTLY | model v1.3 is the product; the engine built now, experimental; the credit line |

---


## 2. No check-ins: the whole plan up front, adjusted by people and coaches [APPROVED, R3-VOL-02, R3-VOL-04]

### 2.1 What you decided

* GEN-03 (round 1): "I don't think that they should be tracking it from us. They should be tracking it themselves."
* R3-VOL-02: "we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly."
* R3-VOL-04: "The program will just have its natural algorithm recommendation of growth throughout it ... It's already a template, and you need to adjust it as you need to ... This needs to be very simple for them to see the whole thing ahead of time, ideally, and they can adjust ahead of time, ideally. It doesn't need to rely too much on inputs."
* R3-GEN-01: "I don't want any data kept."

**Resolution [APPROVED].** The product is **answers in → the whole plan out**. The plan is generated once, written out week by week from the first day to the last, and handed over as views, images, a PDF, a sheet, a link and a file. Nothing comes back into the tool: no check-ins, no logbook, no readiness questions, no tracking. When something needs to change, the person or their coach changes the plan (§2.3, §14.5) or builds a new one.

### 2.2 How the plan grows without a check-in [APPROVED, R3-VOL-04]

* **The stairway is built in.** Weekly sets grow about 3 % a week until the halfway week and about 5 % after it; each trained group's steps are sized so it reaches its ceiling exactly in the last week. His approved example: an intermediate big muscle goes from 15 to 22 sets a week, the last four weeks 19, 20, 21, 22. All numbers live in `12_volume_algorithm_v1` v1.2 (the engine twin: spec `rule_tables.rate_engine`, `derived_values.D12_planned_step`).
* **The effort climbs with it.** Week 1 feels like a 2 and the last week like an 11 (R2-PER-05): the effort cue goes from 3 reps in the tank in the early weeks, to 2, to 1-2, to 1 plus intensifiers (supersets, a last-set MYO on a machine) in the last week, always inside his 1-3 RIR band (VOL-13; APPROVED R3-VOL-04). A 12-week block: weeks 1-6 at 3 RIR, 7-9 at 2, 10-11 at 1-2, week 12 at 1 + intensifiers.
* **The load fits the day by itself.** Because every set is written as "leave N reps in the tank", the weight a person picks moves with how they feel that day; that is load autoregulation inside a fixed plan, and RIR-based autoregulation does at least as well as fixed loading for strength (Graham and Cleather 2021; Zhang et al. 2021; Hickmott et al. 2022; Helms et al. 2020) [SCIENCE]. The sets and the stairway stay as written.
* **Focus muscles ride the same stairway:** their 1-3 extra sets climb with everything else (R3-SES-01).
* **Maintenance, pre-season and in-season stay flat** (PER-01, R2-PER-06, R2-ATH-07); the stairway is for training blocks.

### 2.3 What people and coaches do instead [APPROVED principle R3-VOL-04, R3-SES-02; wording PROPOSED]

The plan's instruction block (his lines at the top of every plan, GEN-07) adds a short "How to adjust this plan" part in his voice, so people know what to do without a check-in:

| When | What the plan already does | What the person or coach can do (no input to the tool) |
|---|---|---|
| A hard week (busy, sore, slept badly) | The reps-in-reserve cue lets them go lighter and still do the plan | Switch off today's jump / throw block or core block, remove an exercise, or simply repeat the week (§14.5) |
| It feels too easy | The stairway and the effort cue get harder every week | Use more weight inside the RIR cue; a coach can add sets or exercises, or rebuild with a higher level |
| An exercise hits the wrong muscle | - | Swap it in the dropdown (same category, one-detail variations only; GEN-04, R2-LIB-01) |
| Something hurts | Pain entered at the start is already built in (pain protocol, VOL-03) | Stop that exercise, swap it or remove it, and see a professional (printed in every plan) |
| Life gets in the way and the block can't be finished | - | Stop when they decide; build a maintenance plan (they choose the weeks) or a new block; "Did you finish your last block? No" keeps the same starting level (F25c) |
| The block is finished | The last page says what's next | Take the recommended easy week (about half the sets) and build the next block, which starts one step up; or build a maintenance plan; or build something new (R3-PER-01) |
| Test weeks | Week 1 and the last week are marked; the calendar file has reminders | Do the tests; nothing is sent back |
| They like to log | The downloaded sheet keeps his columns: 'WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?' | Log in the sheet for themselves; the tool never reads it back (GEN-03) |

### 2.4 RETIRED in v1.2 [R3-VOL-02, R3-VOL-04]

Retired, with nothing replacing them inside the tool: the one-minute weekly check-in and its five questions; tracking levels 1-3 (check-in, phone logbook, coach-connected accounts); the step table read against the stairway (planned step + 2 points, hold, −1 set after a "10", repeat the week); the HOW IT FELT? rules applied by the engine; the "block can't be finished" signals and offer; the maintenance-end and block-done prompts inside the app; week-by-week mode on check-ins; the readiness score; `adapt()`. The v1.1 text is in git history (commit e74e833) and summarised in the v1.1 verification log at the end. The science that supported self-report check-ins (Saw et al. 2016; Foster et al. 2001; Michie et al. 2009; Eckerstorfer et al. 2018) no longer drives a feature. Comparable apps that adapt from feedback (RP Hypertrophy, JuggernautAI, Volt's Cortex, Fitbod) are subscription apps that keep their users' data [RESEARCH]; Blaze Camp deliberately does neither (R3-VOL-02, R3-GEN-01). His EFFORT and HOW IT FELT? menus survive only as dropdown columns in the downloaded sheet.

### 2.5 Where the plan lives: only with the person [APPROVED principle, R3-GEN-01; details PROPOSED]

* **Nothing is sent.** The site is static files; the engine runs on the phone. The answers, the health check, the plan and the release tick never leave the device, and Blaze Camp runs no server that could receive them.
* **Nothing is kept by default.** When the page is closed, the site forgets the plan. The person keeps it as an image, a PDF, a sheet, a **plan link** (the whole plan, edits included, packed after the "#" in the link; browsers never send that part to the website) or a **plan file**. Whether the site may remember the last plan on that one phone (never sent anywhere) is your call (N-PROD-21).
* **An optional answers file** ("Save my answers") lets a person or a coach rebuild the next block in seconds; it stays with them (PROPOSED).
* **The same answers give the same plan.** The engine is deterministic for a model version, so a lost plan can be rebuilt (with the release ticked again).
* **The release record is printed, not stored:** on the plan and on every image, PDF, sheet, link and file (§12.4).
* The iPhone 7-day storage limit that mattered in v1.1 no longer matters: nothing is stored to lose (RESEARCH, WebKit).

---

## 3. The four options (v1 analysis; v1.2: A is the product, C a download inside it, D open source under MIT, B retired)

All options use the same engine (the model turned into code). The engine is the biggest single piece of work (section 9). The options differ in what people see and how the plan travels.

### 3.1 Option A · Plan website (bilingual, built in the browser, phone-first, editable, images, PDF, sheet and link exports) [APPROVED as phase 1, R2-GEN-02; v1.2 scope R3-VOL-04, R3-SES-02, R3-GEN-01]

**One line.** A website that asks the intake questions, builds the whole plan on the phone, shows it as Block / Week / Day views the person can edit, and saves it as images, a PDF, a Google Sheets / Excel file, a link or a file. No tracking, no accounts, nothing kept.

**What the user sees** (one question per screen, big buttons, auto-advance; "More options" folded away; R2-GEN-02).

| Screen | Content |
|---|---|
| **S0 · Landing** | "Build your training plan in the Blaze Camp style." EN / ES switch top right (English first, GEN-01); lb / kg set from the phone's region and switchable (R2-GEN-08). Two doors: "Build my plan" and "I'm a coach or trainer building for a client" (F39). One line: "Not medical advice. Use at your own risk. Blaze Camp keeps nothing you enter." (C14, C23) |
| **S1 · Health check** | Client door: the short Blaze Camp health check (§12.2) with a link to the official PAR-Q+; any refer answer → no automatic plan and a "see a professional" message. Coach door: "Run the health check with my client now" or "Skip: I follow my own onboarding" with the coach warning (§12.3). [APPROVED, R3-GEN-01] |
| **S2 · About you** | Age; body weight (required, GEN-02); training experience in years, months off in the last 2 years, "I used to compete" (PRG-05) on the same screen. The level it chose and why, in plain words. No sex question (GEN-02). No sleep, stress or job questions (R2-GEN-04). |
| **S3 · Goal** | Build muscle · Get stronger · **Train for my sport** · **Stay athletic and active** (§13.3) · Lose fat · General fitness and health · Hybrid / CrossFit. Then, where it applies: lift style; gym or bootcamp format (PRG-03). One optional line for every goal (competitive field athletes PROPOSED, N-PROD-25): **Focus muscle 1 · Focus muscle 2** ("Each gets 1 to 3 extra sets a week on top of a balanced plan"; glutes, quads, hamstrings, back, chest, shoulders, biceps, triceps, calves, core, V-taper) [APPROVED, R3-SES-01; list PROPOSED]. |
| **S4 · Sport or activity** | "Train for my sport" → competitive or recreational → sport (every popular US sport, searchable, EN / ES) → position or event group → level of play → next season start date (or in season until / competition date; swimmers give the main championship meet date) → practice days and game days (§13.2; R2-GEN-05; R3-ATH-01). "Stay athletic and active" (or recreational) → pick up to two activities, no position or season (§13.3; GEN-02); under More options: the days they play, how long they usually play, and an event date [APPROVED, R3-ATH-05]. |
| **S5 · Schedule** (v1.3: no session length, no time check - COACH-CT CT-01, COACH-R4 R4-SES-01; with 2 days the screen says every big muscle gets about 6-8 weekly sets and suggests a third day, R4-SES-03) | *v1.2 text, retired:* Days per week, which days, session length (45-60 min suggested for general / fat loss; about 90 min, max 120, for athletes, bodybuilders and powerlifters, UNI-09), start date. **Time check [APPROVED order, R3-SES-02]:** when the days and minutes can't hold the minimums (10 sets a week per trained group, 2-4 exercises per group trained that day, 3 calf sets per leg day, a climbing stairway), the screen says so right away with the numbers and offers **Add a day** or **Make sessions N min**; if the person taps **Keep my time**, the plan trains fewer groups directly (big movers first, APPROVED; the focus muscles kept too, INFERRED from R3-SES-01 and PROPOSED, N-PROD-27; arms, calves and shoulder isolation from the big lifts), suggests supersets, and still climbs on every group it trains (C19, C20). It never squeezes 2-4 exercises per group into a day that can't hold them. |
| **S6 · Plan type and tests** | **12 weeks (recommended)** · **8 weeks** · **Maintenance** (you choose the weeks, 1-8; R2-PER-06) · **Full year** (gen-pop, tunable; R2-PER-01, R2-PER-02). "Week by week" is no longer offered (it ran on check-ins; R3-VOL-02); the Week view of any plan shows it one week at a time (N-PROD-22). "Have you finished a Blaze Camp 12-week plan before?" → how many, and "Did you finish your last block?" (yes → the next starts one step up; no → the same start; PER-01, R2-VOL-06). Tests: strength / cardio / speed and agility / jumps / body weight / "No need for testing", **before the block (or in week 1) and at the end** (R2-PER-07). "Never from zero": anyone not coming off a completed training block (new and returning users, Level 1) only sees safe choices (a 5- or 3-rep max, beginners 5-8; cardio and speed at 80-90 % effort; never a 1-rep max or an all-out mile). A 1-rep max ('Work up to 1RM') is offered to intermediate and up only at the end of a completed block, or at the start when a Level 2-3 user taps "I just finished a training block" [gate PROPOSED; R2-PER-07; 06 §6]. |
| **S7 · Equipment** | Where you train, extra equipment, machines; no band or chain options (EQ-01, EQ-12). |
| **S8 · Pain and injuries** | Areas, side, how bad, what makes it worse. "Severe" → refer (V1). |
| **S9 · Preferences** (More options) | Core block position (start by default, ATH-11); optional work on its own day or added on (ORD-10); "I like variety" (A/B weeks, PER-03); cardio: less / as planned / more (R2-SES-06); **superset suggestions on / off** (on by default, R3-SES-02); 60+ only: "Include ankle hops, jumps, Olympic lifts and depth jumps" with his warning (R3-ATH-02); pickleball / padel / tennis 50+: "Include depth jumps, hurdle hops and bounds" with the same warning (R3-ATH-02); things you can't or won't do. |
| **S10 · Terms, release and build** | A short summary of the terms (client or coach version, §12.4) with a link to the full Terms and Release of Liability, **one unticked box: "I accept the Terms and the Release of Liability, and I use this plan at my own risk"**, and the **Build my plan** button. Every build or rebuild, including each new block; not when a saved plan is reopened [APPROVED, R3-GEN-01]. |
| **S11 · Your plan: Block view** | The stairway at a glance (a 12-step bar from "easy start" to "hardest weeks" with the week's 2 → 11 level), test weeks marked, and one compact table per training day: the block's exercises down the side, the weeks across, sets × reps in each cell (§14.2). Your instruction block at the top (GEN-07), with "How to adjust this plan" (§2.3). If the time check trimmed groups: "Not trained directly this block (time): …" and the offer. Coaches land here. |
| **S12 · Week view** | The 7 days of one week: each training day's title, about how long, and its exercises with sets × reps; rest days; cardio sessions with a "less / more cardio" control (R2-SES-06); switched-off blocks greyed. Swipe between weeks. |
| **S13 · Day view (editable)** | One card per exercise, in session order (sketch below). Each card: PURPOSE, exercise name, swap dropdown (same category), sets × reps (10/10 written as "10/10 each side", PRG-07), effort as RIR words with the RPE number, rest, a one-line cue, a "Watch how" link, remove (×). Each optional block (core, jumps / throws, Olympic, accessories, calves, finisher, cardio) has an **on / off switch**; each block has **+ add exercise**; suggested pairs show **"Superset suggested · saves about N min"** with a switch (§14.5). Clients land on today. |
| **S14 · Exercise sheet** | Tap a card: the cue, why this slot exists ("knee dominant paired with a pull to avoid bleed-over", UNI-11), the swap list, the video (Blaze Camp's own if filmed, otherwise "Watch how" opens a YouTube search, §7.3). |
| **S15 · Exports** | Save as image: **whole block** / **this week** / **this day** · Print / PDF (block or week) · Google Sheets / Excel file · **Plan link** · **Plan file** · Share (phone share sheet) · Add to calendar (with test reminders) (§14.4). Every export carries the release line, the own-risk line and "You can switch off …" (C17). |
| **S16 · Year view** (full-year plans) | The year as chained blocks with the gen-pop quarter themes (R2-PER-01); **fully tunable**: drag blocks to re-order, change a block's theme (for example a winter powerlifting-style block with less cardio), more or less cardio, mark your own holidays (Christmas, Semana Santa, Thanksgiving …), hemisphere for summer (R2-PER-02). **Holidays are placed between blocks**; a holiday marked inside a running block ends that block there unless the mark is removed; the easy week between blocks is recommended, not required [APPROVED, R3-PER-01]. Each block is built (and its release ticked) when the person builds it. Athletes follow their season instead. |
| **S17 · Edit controls** | The switches and buttons of S13 in one place, with "this day only" or "this day every week of the block" (default) and **Reset to the generated plan** (§14.5). |
| **S18 · End of the block** | The plan's last page: "Your block ends here. What next? Recommended: one easy week at about half the sets, then build your next block (it starts one step up). Or build a maintenance plan. Or build something new. Plan holidays between blocks." (C15) [APPROVED, R3-PER-01]. Building again goes back to the intake (the answers file pre-fills it) and S10 again. |

**Day view sketch (phone).** Names are illustrative.

```
+--------------------------------------+
| [ BLOCK | WEEK | DAY ]   EN|ES  lb|kg |
| WEEK 5 of 12 · stairway level 4.4/11 |
| MONDAY · Day A · about 75 min        |
| show: [sets x reps] [effort] [cues]  |
+--------------------------------------+
| 1 CORE (warm-up, light)  [on]  [move]|
|   Dead Bug          2 x 10/10    [x] |
|   "Ribs down, slow."  [Watch how]    |
| 2 JUMP (ballistic)       [on]        |
|   Low Box Jump      3 x 5        [x] |
|   land soft, stick it                |
| 3 POWER (clean day)      [on]        |
|   Hang Power Clean  4 x 3 [swap] [x] |
|   move it fast: power, not max weight|
| 4 KNEE DOMINANT + PULL               |
|   Superset suggested · saves ~6 min  |
|   [ do as superset ]                 |
|   a) Back Squat       3 x 6 [swap]   |
|   b) Chest-Supp. Row  3 x 10 [swap]  |
|   leave 3 in the tank (RPE 7)        |
|   [+ add exercise]                   |
| 5 ...                                |
| 8 CALVES  Standing DB Calf Raise 3x15|
+--------------------------------------+
| You can switch off today's jump or   |
| core block, add or remove exercises. |
| [Save as image v] [Print] [Share]    |
+--------------------------------------+
```

The order follows his rules: core first and light (ATH-11, R2-SES-03), jumps and power before strength (ORD-03), knee dominant paired with a pull and hip dominant with a push (UNI-11, ORD-06), calves on every leg day (VOL-17). Monday is the week's heavy squat day and a clean day: clean-family lifts go on squat-pattern days, snatch-family lifts on hinge days, up to 4 Olympic slots a week (R2-SES-01, R2-ATH-04). A box jump is a ballistic jump, not a plyometric one (R2-ATH-02). Olympic lifts carry the power cue instead of a load (R2-GEN-06). The effort line is the week's planned reps in reserve (3 in the early weeks of a 12-week block, APPROVED R3-VOL-04). The switches and the "add / remove" buttons are his R3-SES-02 options; the generator itself never leaves the core block out (GEN-08).

**Tracking and adjusting.** None inside the site, by design (R3-VOL-02, R3-VOL-04). The plan already includes its stairway; people adjust it with the edit controls or rebuild it (and tick the release again). People who like to log use the downloaded sheet for themselves (§2.3).

**How it matches your words.** The website, phone view, screenshots (block, week, day), PDF and Google Sheet ideas (GEN-03, R2-GEN-02); fewest clicks and macro views (R2-GEN-02); "kick out a program, and that's it" and "see the whole thing ahead of time" (R3-VOL-04); no check-ins (R3-VOL-02); editing, superset suggestions, block switches (R3-SES-02); the time check (R3-SES-02); focus muscles (R3-SES-01); health check, own-risk box, terms and release every build, nothing kept (R3-GEN-01); Spanish (GEN-01, R2-GEN-08); dropdowns (GEN-04); optional videos (R2-GEN-02); cues (GEN-07).

**Build effort, cost and time [INFERRED estimates; detail in E12].** About 13.5-20 developer-weeks (model compile, engine, edit layer and tests 6-8.75; screens, views, editing UI, exports, health check and release, sport picker and the language plumbing 7.5-11), so roughly 3.5-5 months for one experienced developer working full time. v1.1 estimated 11-16 for Option A; round 3 adds the plan-editing layer and its UI, the time check and the plan link / file (about +2.5-4). The v1.1 check-in increment (3.5-5 weeks) is gone. Running cost: a domain name (roughly $10-20 a year) and free static hosting (Cloudflare Pages' free plan has unlimited bandwidth and 500 builds a month; GitHub Pages' terms say its free hosting is not meant for commercial or software-as-a-service sites, so check the chosen host's current terms before launch). [RESEARCH]

**Risks.** A fixed plan cannot see a bad week or a sore shoulder; the reps-in-reserve cue, the edit controls, the printed "How to adjust" lines and a rebuild cover it (§10). No data to improve the model from users (by his choice, R3-GEN-01). A 12-week block image is long (the per-day table layout in §14.2 keeps it readable). Excel files opened in Google Sheets may lose some formatting (to be tested). Edits can unbalance a plan (the tool shows the effect, §14.5).

### 3.2 Option B · Option A + weekly check-in + logbook, accounts later [RETIRED, R3-VOL-02, R3-VOL-04]

Approved as phase 1.1 in round 2 (R2-GEN-02, R2-GEN-01), retired in round 3: "we're not going to have check-ins ... We're only doing outputs" (R3-VOL-02); "I don't want people to be checking back on their phone in their program" (R3-VOL-04); "I don't want any data kept" (R3-GEN-01). Its screens (check-in, logbook rows, progress, "block can't be finished", backup code, week-by-week mode), its 3.5-5 developer-weeks and its v2 accounts are dropped. What survives from it lives elsewhere: the block-end choice becomes the printed last page (S18), maintenance is a plan the person builds (S6), and his tracking columns stay in the downloaded sheet (§3.3).

### 3.3 Option C · Google Sheets output only (kept as a download inside A)

**One line.** The generator's only output is a spreadsheet like your BYOP workbook: the full plan with dropdowns for swaps and your tracking columns, ready in Google Sheets.

**Three ways to deliver it.**

| Route | How it works | Sign-in | Notes |
|---|---|---|---|
| C1 · Download file | The site builds an .xlsx file in the browser (all weeks stacked, like 'JUSTICE LEAGUE', or one tab per week) with dropdowns (exercise swaps in the same category, his EFFORT and HOW IT FELT? lists) and colours; the user opens it in Google Sheets, Excel or Numbers. | none | Nothing leaves the phone. Libraries such as ExcelJS (MIT licence) write dropdown lists and conditional colours in the browser [RESEARCH]. Whether every dropdown survives the import into Google Sheets must be tested in a short spike [INFERRED]. |
| C2 · Straight into their Google Drive | The site asks the user to sign in with Google and creates the spreadsheet in their own Drive. | Google sign-in | Uses the `drive.file` permission, which only touches files the app creates; Google classes it as non-sensitive [RESEARCH]. The file goes to the user's Drive, not to Blaze Camp; whether a Google sign-in fits "no data kept" is part of N-PROD-21 (optional, later). |
| C3 · Copy a template | A master sheet shared with a "make a copy" link (the URL ending `/copy` forces a copy into the user's Drive), filled by hand. | Google account | Close to how BYOP works today. [RESEARCH; OBSERVED BYOP] |

**What the user sees.** A spreadsheet: rows WEEK / DAY / PURPOSE / CATEGORY / EXERCISE / SETS / REPS / WEIGHT USED or SCORE / EFFORT / HOW IT FELT? / DONE? (his exact columns, OBSERVED 'JUSTICE LEAGUE' row 2), plus VIDEO (the "Watch how" link) and NOTES columns, the release line and the own-risk line in the header, and the "You can switch off …" line.

**Tracking.** Natural in a sheet, and that is where it belongs: the person logs for themselves (GEN-03); the tool never reads it back (R3-VOL-02).

**How it matches your words.** Covers "maybe a Google Sheet" (GEN-03) and the dropdowns (GEN-04). Weak on the phone, on the whole-thing Spanish switch (a sheet is created in one language) and on videos (links only).

**Build effort, cost and time [INFERRED].** Engine 5-7 weeks plus 2-3 weeks for a simple intake page and the sheet design and generation (C1: 7-10 weeks). Running cost near zero.

**Verdict.** A **download inside A** (C1 in phase 1; C2 optional later), as approved in R2-GEN-02; weak as the only product.

### 3.4 Option D · Open-source engine and model + Blaze Camp reference site [APPROVED for after v1, R2-GEN-02; licence MIT, R3-GEN-01]

**One line.** Publish the whole repository (engine code, the model data, the exercise tags, the sample plans, the docs) under the MIT licence to Lalo Vera, Blaze Camp and BFit Studios Corp., so any coach or developer can build on the model ("give away the repo ... to any coach and person that wants to create a training app", GEN-03), while the Blaze Camp site stays the official version.

**What people see.** Users see the Blaze Camp site, unchanged. Coaches and developers see a public repository with: the engine; the model data (rule tables, exercise catalog with all lenses, templates, plan shapes, sport profiles); the English and Spanish word lists; documentation of how to write a rule pack and how to add an exercise; the tests that prove the engine follows your rules; `LICENSE` (MIT), `DISCLAIMER.md` and `DISCLAIMER.es.md`, and a README that says, in English and Spanish, that people download and use it at their own expense and risk, that anyone using it for clients needs their own liability release, and that Blaze Camp is released from liability (R3-GEN-01).

**Tracking and adjusting.** Same as the site: none inside; people adjust the plan themselves.

**How it matches your words.** Directly answers the open-source idea in GEN-03 and his round-3 licence: "the MIT of Lalo Vera ... Blaze Camp ... and BFit Studios Corp ... so that the repo has that license to me" (R3-GEN-01). A fork can change anything, but MIT gives no right to his name (§8).

**Build effort, cost and time [INFERRED].** About 1-2 developer-weeks on top of A (the `LICENSE`, the disclaimers and the first agent and contributor docs already exist or are being written), then roughly 2-4 hours a week answering issues and reviewing contributions. Hosting the code on GitHub is free.

**Risks.** Someone sells a copy (MIT allows it, with the copyright and licence notice kept; section 8); weak forks that give bad plans (mitigation: they cannot use his name; the disclaimer travels with the code); a support load; private material leaking (mitigation: publish only the cleaned model, never client names or unpublished programs; what to do with the raw sheet dumps is a decision before release, §8). Comparable open projects exist: Liftosaur (AGPL-3.0, offline-capable web app with its own progression scripting language) and wger (AGPL-3.0 workout manager with an 800+ exercise database and an API). [RESEARCH]

**Verdict.** A **distribution decision**, taken once v1 is approved (Phase 2).

### 3.5 Considered and set aside

| Idea | Why not now |
|---|---|
| Native iPhone / Android app | Ruled out (GEN-03, R2-GEN-02). A home-screen web app gives most of the feel without app stores. |
| A weekly check-in or an adaptive app that changes next week from feedback | Retired: "We're only doing outputs, and people can change accordingly" (R3-VOL-02, R3-VOL-04). The v1.1 design is in git history. |
| Accounts, a server database, syncing between phones, research data | Retired: "I don't want any data kept" (R3-GEN-01). |
| Running plans through an existing coaching platform (TrueCoach, TrainHeroic and similar) | They charge per coach by number of clients (TrueCoach about $26-137 a month; TrainHeroic from $9.99 a month, with a marketplace that takes $1 per athlete a month plus card fees), store client data and cannot run your generator. Worth revisiting only as a sales channel for finished programs; program-library apps such as Boostcamp (free coach programs with built-in progression; Pro $59.99 a year) are another such channel. [RESEARCH] |
| PDF only | The easiest to build, but no swaps or edits after printing (GEN-04, R3-SES-02) and no language switch after printing. Kept as an export. |
| A chatbot that writes plans with AI | Plans would not be reproducible or checkable against your rules. AI is still useful behind the scenes: drafting Spanish translations and cue lines for you to correct. |
| Embedding YouTube videos found by search | Search results are not curated; embedding a stranger's video makes it look endorsed. A plain "Watch how" link that opens a YouTube search keeps it clearly outside Blaze Camp until his own videos exist (§7.3). [INFERRED] |

---

## 4. Side-by-side comparison (v1.2)

| Need (source) | A · Plan website (+ editing) | C · Sheet only | D · Open source (with A) |
|---|---|---|---|
| Fewest clicks, phone first (R2-GEN-02) | Yes | No (sheets are hard on phones) | as A |
| Input → the whole plan, nothing after the build (R3-VOL-02, R3-VOL-04) | Yes | Yes | as A |
| See the whole plan ahead of time (R3-VOL-04) | Yes (Block view) | Yes (one long sheet) | as A |
| Block / week / day views with toggles (R2-GEN-02) | Yes | Partly | as A |
| Screenshot the whole 12 weeks or one week (R2-GEN-02) | Yes (block / week / day images) | Partly (print from Sheets) | as A |
| Switch off a day's athletic or core block, add / remove exercises or blocks, superset suggestions (R3-SES-02) | Yes | By hand (edit cells) | as A, and deeper (fork) |
| ~~Time check with an offer (R3-SES-02)~~ retired in v1.3 (CT-01) | Yes | Only on the intake page | as A |
| Focus muscles 1 / 2 (R3-SES-01) | Yes | Yes (intake page) | as A |
| No data kept (R3-GEN-01) | Yes | Yes (C1); C2 writes to the user's Drive | Yes (a fork's privacy is the fork's job, DISCLAIMER §7) |
| Health check, coach skip, own risk + terms + release every build (R3-GEN-01) | Yes | Only with the website in front | as A |
| No lifestyle questions (R2-GEN-04) | Yes | Yes | Yes |
| Google Sheet (GEN-03) | Yes, as a download | Yes | as A |
| Every popular US sport + "stay athletic and active" (COACH-CHAT 2026-10-08) | Yes | Yes (intake page) | Yes (profiles published) |
| Full Spanish switch (GEN-01, R2-GEN-08) | Yes | Partly (new file per language) | Yes (word lists published) |
| Default + dropdown swaps (GEN-04) | Yes | Yes | Yes |
| Videos optional, link-out (R2-GEN-02) | Yes | Links only | Yes |
| Coaches add rules (GEN-08) | Yes (rule-pack file) | Hard | Yes, and deeper (fork) |
| Build effort (developer-weeks, INFERRED) | 13.5-20 | 7-10 (C1) | +1-2 |
| Running cost (RESEARCH, INFERRED) | ~$10-20 / year | ~$0 | ~$0 + your time |
| Main risk | A fixed plan can't see a bad week (people adjust it themselves) | Phone experience | Support load, copies |

Option B (A + check-in) is retired and left out of the table (§3.2).

---

## 5. Recommendation [v1.2: APPROVED direction, R2-GEN-02 as simplified by R3-VOL-02, R3-VOL-04, R3-GEN-01]

**Option A, the plan website, with plan editing and every export; Option C as a download inside it; Option D (open source under MIT) once you have approved v1.** You said: "I want this to be very simple. This works. We're not going to need a lot of inputs for this ... I want them to be able to kick out a program, and that's it" (R3-VOL-04), and "I don't want any data kept" (R3-GEN-01).

Why it fits your answers:

1. It is exactly "kick out a program": answers in, the whole plan out, visible from week 1 to the last week, with its stairway built in (R3-VOL-04).
2. Nobody is asked to check in or track (GEN-03, R3-VOL-02); people and coaches change the plan themselves with block switches, add / remove and superset suggestions (R3-SES-02).
3. It keeps nothing: no server, no accounts, no analytics with personal fields (R3-GEN-01), which also keeps the legal and privacy load as small as it can be.
4. It is phone-first, few clicks, with block / week / day views and screenshots (R2-GEN-02), Spanish throughout (R2-GEN-08), and costs almost nothing to run.
5. Your Google Sheet idea survives as a download with your exact columns, for people who like to log for themselves.
6. The open-source release under MIT starts from a model you have signed off, with the disclaimer in both languages.

The v1.1 recommendation (A, then B with the weekly check-in, then D) is superseded: phase 1.1 is retired.

---

## 6. Roadmap (v1.2) [phases from R2-GEN-02 as simplified by R3-VOL-02, R3-VOL-04, R3-GEN-01; contents PROPOSED; durations INFERRED for one experienced developer, full time]

| Phase | What ships | Your part | Done when | Rough time |
|---|---|---|---|---|
| **0 · Freeze the model** (in progress) | Model v1.3 with rounds 1-4, CT-01 and CX folded in (v1.3 note: the engine is now 0.5.0, template-first with no time check); the runtime model files (E3); the merged sport profiles (`04_profiles.json` v1.2); the engine (v0.4) with the test suite of your hard rules, the time check, focus muscles and group floors; **sample plans for you to grade**: your seven (R2-GEN-07: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs) plus the pickleball gen-pop bonus sample. | Grade the plans; answer the few round-4 questions (§11.2); pick plan names (N-PROD-10). | You sign off the sample plans. | 2-3 weeks (team), ~8 hours of yours |
| **1 · MVP: plan website (Option A)** | Start flow (role → health check or coach skip → intake with focus muscles, sport / activity, play days and event date → schedule (days; no session length) → … → own risk + terms + release, §12); Block / Week / Day views with show chips (§14); **plan editing** (block switches, add / remove exercises or blocks, superset suggestions, reset; §14.5); swaps, cues, "Watch how" links, Blaze Camp videos where they exist; instruction block with "How to adjust this plan"; weight guidance (§15); plan types 12 / 8 weeks, maintenance (chosen weeks), full year (tunable, holidays between blocks); tests at start and end; the end-of-block page; save block / week / day as image; print / PDF; Excel / Google Sheets download; plan link and plan file; share; calendar; EN / ES; lb / kg. **No accounts, no data kept, no check-in.** | A Florida lawyer turns `DISCLAIMER.md` / `DISCLAIMER.es.md` into the final Terms and Release and writes the short health check (EN / ES); check the Spanish; approve cue lines and the "How to adjust" lines; send videos whenever you film them (optional). | 20-50 of your clients and coaches use it for 4 weeks and send feedback by email or in person (nothing is collected by the site). | 13.5-20 developer-weeks (about 3.5-5 months) |
| **2 · Open source (Option D) and coach tools without accounts** | Public repository under MIT with `LICENSE`, `DISCLAIMER.md` / `DISCLAIMER.es.md` and a bilingual README (own risk, own release for clients); docs for rule packs and for adding exercises; coach tools that keep nothing on a server: a rule-pack editor (rules saved as a file the coach keeps), "start from a saved answers file" to rebuild a client's next block, Olympic weightlifting as its own program type (R2-GEN-06; N-PROD-17); optional Google Drive export (C2). | Approve the public release and the README; decide coach tools free or paid (N-PROD-09). | First outside coaches use the repo or rule packs. | 5-9 developer-weeks + legal review |
| **Model updates** (ongoing) | New model versions when you change a rule: you review sample plans and the feedback people choose to send; each approved change ships with a changelog and a new `model_version`. No learning from user data (R3-GEN-01). | Approve or reject each change. | - | as needed |

**Retired from the v1.1 roadmap:** phase 1.1 (check-in, adaptation, logbook, progress screen, week-by-week mode, backup code; R3-VOL-02, R3-VOL-04), v2 accounts and sync, coach-connected client check-ins and pain alerts, consented research data (R3-GEN-01), and phase 3 "Learning" (R3-GEN-01).

The Spanish switch, the video map and the coach rule layer are built into the MVP's foundations (word lists, video map, rule layers) even where their screens arrive later, so nothing has to be rebuilt.

---

## 7. How it is built (plain language)

### 7.1 Four parts

```
  MODEL (data files, versioned)          ENGINE (code, runs on the phone)   RENDERERS (code)
  +------------------------------+      +------------------------------+   +---------------------------+
  | rule tables (JSON)           |----->| build the whole plan once    |-->| block / week / day views  |
  | exercise catalog (JSON)      |      | session size + focus muscles |   |   with edit controls      |
  | templates, stairway shapes   |      | apply the person's edits     |   | block, week, day images   |
  | sport + activity profiles    |      | explain each choice          |   | print / PDF               |
  | coach rule packs (files)     |      | check the plan vs rules      |   | Excel / Google Sheets     |
  | video map (JSON, optional)   |      +------------------------------+   | plan link, plan file, ICS |
  | words: English / Spanish     |-------------------------------------------------^  (every word on screen)
  +------------------------------+
            nothing goes back: no check-ins, no accounts, no server (R3-VOL-02, R3-GEN-01)
```

1. **The model is data, not code.** Your rules (sets per level, the stairway, focus groups, pairings, order, swaps, the pain rule, the sport profiles) live in tables that the engine reads. Changing a number means editing a table. These tables are compiled from the team's files (`generator_spec_v1.json` rule tables, `02_exercise_catalog.json`, `05_templates.json`, `06_periodization.json`, `04_profiles.json`, `10_equipment_model.json`, `03_volume_rules.json`, `12_volume_algorithm_v1.json`). Every plan records which model version built it.
2. **The engine** turns answers into the whole plan once, checks whether the schedule can hold the minimums (and makes the offer when it can't), explains each choice ("why this exercise?"), checks the plan against your hard rules before showing it, and applies the person's own edits on top. It never reads anything back after the build.
3. **The word lists (English and Spanish)** hold every word the user sees, including the health check, terms and release, warnings and the "How hard?" page. The plan itself stores only codes, so switching language re-draws the same plan in the other language instantly.
4. **The renderers** draw the plan: the three views with their edit controls, the images, the printed pages, the spreadsheet, the plan link and file, and the calendar file. A new output later (for example a coach's branded PDF) is a new renderer; nothing else changes.

### 7.2 How a coach adds rules (GEN-08) [PROPOSED]

**Four layers, applied in this order:**

| Layer | Who owns it | Can it be changed? | Examples |
|---|---|---|---|
| 1 · Locked Blaze Camp rules | you | No (only in a fork of the open-source code, which is then not Blaze Camp) | never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped by the generator (GEN-08); no bands or variable resistance (EQ-01, EQ-12); athletic sets never count toward muscle sets (VOL-10); KB swings are ballistic and never count as glute sets (R2-VOL-05); no time-fitting (CT-01); nothing dropped automatically (R4-SES-04); the terms and release accepted before a plan is generated (R4-SCP-02); *(v1.3 removed "weekly total rise < 10 %": CX-01, R4-PRG-02)*; no deload or maintenance week inside a block (R2-VOL-07); **no data kept; no check-ins or feedback inputs** (R3-GEN-01, R3-VOL-02); **the own-risk + terms + release tick before every build** (R2-GEN-03, R3-GEN-01); no sex-based rules (ATH-09) |
| 2 · Blaze Camp defaults | you | Yes, by a coach's rule pack | starting sets by level and the floor of 10 sets per trained group (VOL-01, R2-VOL-04, R2-VOL-06, R3-SES-01); helpers count 0.25 (VOL-09); heavy squat and heavy deadlift on two different days (R2-SES-01, R2-SES-02); 3 calf sets per leg day (VOL-17); session lengths (UNI-09); caps per level ("this is all customizable", R2-VOL-06); focus add +1 to +3 (R3-SES-01); 60+ and racket-50+ defaults (R3-ATH-02) |
| 3 · Coach rule pack | the coach using the tool | Yes | "My youth clients under 15 do no Olympic lifts from the floor"; "Tennis players: lower body 85 % unilateral"; "Always put Hip Thrust Machine first on glute-focus days"; "Athletic block off on the day after pickleball" (a toggle rule, R3-SES-02); a **pro level** that lets one focus muscle go above 30 sets for a very advanced client (R2-VOL-06; PROPOSED) |
| 4 · Client preferences and edits | the client | Yes, within the layers above for what the tool offers | swaps in the dropdown (EQ-10), core block position (ATH-11), variety on / off (PER-03), optional days separate or added on (ORD-10), more or less cardio (R2-SES-06), year blocks re-ordered or re-themed (R2-PER-02), 60+ and racket-50+ switches with the warning (R3-ATH-02), Focus muscle 1 / 2 (R3-SES-01), superset suggestions on / off, and the plan edits: block switches, add / remove exercises or blocks (R3-SES-02) |

**Locked rules and the person's own edits.** Locked rules bind what the generator builds and what the "add exercise" list offers (it never offers a V-squat, a band exercise, or 60+ power work without the switch and its warning). They do not stop people from removing things from their own plan: switching off a day's core block is his R3-SES-02 option; the plan shows a note ("This day now has no core block") instead of refusing (PROPOSED).

**How a coach writes a rule.** A form, no code: **When** [conditions picked from lists: goal, sport, position, activity, season, level, age range, pain area, equipment, day type, week of plan, play day] **then** [one action picked from a list: exclude an exercise / equipment / tag; prefer an exercise in a slot; set the unilateral share; set a muscle's weekly set range; cap or fix the weekly step; add or remove a slot; add a core superset (R2-SES-03); switch a block off on certain days (R3-SES-02); recommend a superset (R3-SES-02); move a block in the order; add a note to the plan]. Before saving, the coach sees the effect on 3 sample clients ("this rule changes 4 exercises in week 1"). Conflicting rules are flagged; a locked rule always wins.

**Where rules are kept.** A rule pack is a small file the coach keeps, re-uploads and shares with other coaches; Blaze Camp keeps no copy (R3-GEN-01). Coaches can also add their own exercises, but only with all the tags (family, pattern, laterality, plane, muscles, equipment, level; CAT-01), otherwise the engine cannot place them; a video link is optional (R2-GEN-02).

### 7.3 Videos: optional, link-out first, your own library later (R2-GEN-02; unchanged in v1.2) [APPROVED direction; details PROPOSED]

His words: "They can just look up the videos on their own on YouTube. No need to have the videos on there. If we want to have the videos on there of the exercises we have ... We haven't built our video library. If you would like to add video for this, please send an email to whatever, something like that. I don't know yet." (R2-GEN-02)

**What each exercise card shows, in this order:**

1. **Blaze Camp's own video**, if one is in the video map (status *coach*), played inside the site.
2. Otherwise a **"Watch how" link** that opens a YouTube search for the exercise name in the user's language (Spanish users search the Spanish name plus the English gym term in brackets). Nothing is embedded, so no YouTube cookies load until the person taps, and nobody mistakes a stranger's video for a Blaze Camp one [INFERRED]. Coaches can pin a specific link per exercise in their rule pack.
3. Under it, a small line: "Videos open on YouTube and are not made by Blaze Camp. We're building our own library. Have a great video of this exercise? Send it to [VIDEO_CONTACT]." The contact (email or form) is a placeholder until he picks one (N-PROD-14).

**The video map** stays as designed in v1, but every entry is optional: where it is hosted, the video ID, start and end seconds, who recorded it, and its status (*coach*, *approved public*, *search link*). A "missing videos" list is generated automatically for whenever he wants to film. When he films, silent 10-30-second clips (front or 45-degree, 2-3 clean reps) work in both languages because the cue text switches language.

**The backlog (OBSERVED, computed from `02_exercise_catalog.json` `video_urls`, v1 count).** About 350 live library exercises; about 79 have one of his links; 85 exercises he uses in his own programs have none (for example the staggered-stance deadlift, barbell bench press, leg press, pull-up, machine leg curl, standing DB calf raise). If and when he films, those 85 come first (one 3-4 hour session). Filming no longer blocks any phase.

**Hosting (when his videos exist).** Unlisted YouTube videos cost nothing and can be embedded with YouTube's privacy-enhanced mode (`youtube-nocookie.com`), which holds back cookies until the viewer presses play, though it still contacts Google [RESEARCH]. Paid video hosts can be added later by changing only the video map.

### 7.4 The Spanish switch [APPROVED, R2-GEN-08; GEN-01; legal equivalence R3-GEN-01]

* Every word comes from the word lists; nothing is typed into the plan in one language.
* **Neutral Latin American Spanish**, with the common English gym term in brackets where gyms use it ("Empuje de cadera (Hip Thrust)", "Cargada colgante (Hang Clean)"). The coach approved this choice: "That sounds right."
* **Who approves:** the coach or a coach he trusts approves every line. AI drafts first. A missing Spanish line falls back to English and is listed for review, so the site never breaks.
* **Legal text** (health check, terms and release, warnings) is translated "as legally equivalent as possible in English and Spanish" (R3-GEN-01) and reviewed by a lawyer in both languages; the base texts are `DISCLAIMER.md` and `DISCLAIMER.es.md`, and the lawyer decides which language governs (the Spanish draft already says the reviewing lawyer decides). Legal lines never fall back to English silently.
* Volume [INFERRED]: about 450-650 screen phrases (the check-in phrases are gone; the editing controls, focus muscles and terms are new; v1.3: the time-check phrases are gone too, COACH-CT CT-01), about 350-590 exercise names, about 80-120 sport, position and activity names, one cue line per exercise, his instruction block with the "How to adjust" lines, the effort and feeling labels of the sheet, the explanations.
* **Units:** pounds by default in the US, kilograms elsewhere, switchable at any time (R2-GEN-08).

### 7.5 Data: none collected, none kept [APPROVED, R3-GEN-01]

His words: "I don't know if we should be keeping any kind of data, but I don't want any data kept. It doesn't matter if they click it; it comes out. If they click it, they understand it."

* **No collection at any phase.** No accounts, no server database, no analytics with personal fields, no cookies, no research data. The v1.1 plan for opt-in anonymous training data (tiers 0-2, consent records, a learning pipeline) is **RETIRED**.
* **What this means for "the tool learns" (VOL-01, VOL-02).** In round 1 he said the tool "eventually will be something that learns from the data of all the people that use it". With no data kept, it cannot; the model improves through his reviews of sample plans and the feedback people choose to send by email, each change released as a new model version (N-PROD-26 asks him to confirm).
* **Page counts.** None in the MVP. A cookieless counter of page views with no personal data is possible only if he says yes (N-PROD-23).
* **Why it also helps legally.** Pain, injury and training data count as health data in several places: the EU's GDPR treats health data as a special category that needs explicit consent; Washington State's My Health My Data Act covers fitness apps; the US FTC's Health Breach Notification Rule (updated 2024) covers health and fitness apps that hold identifiable health information; the amended COPPA rule requires verifiable parental consent before collecting personal information from children under 13. [RESEARCH] A tool that collects and keeps nothing stays out of most of that; the lawyer still reviews the one-line privacy statement ("Blaze Camp keeps none of your answers or your plan", C23).
* **The repo.** Anyone who builds their own app from the open-source code is responsible for their own data handling and privacy terms (`DISCLAIMER.md` §7).

### 7.6 Safety guardrails in the product

* **Health check before every client plan** (§12.2): any answer on the approved refer list → no automatic plan, "see a professional or a coach" (R2-GEN-03, R3-GEN-01). Severe pain on the pain screen → the same (V1).
* **Coach skip only in coach mode**, with the legal warning that the coach screens the client with their own onboarding (R2-GEN-03, R3-GEN-01).
* **Own risk + terms + release ticked every time a plan is built**, by clients and coaches alike; under-18s need a parent or guardian (§12.4). [LEGAL REVIEW]
* **"Not medical advice. Use at your own risk."** on the landing page, in the plan header and on every export, with a link to the full Disclaimer (C14).
* **Printed "How to adjust this plan" lines** tell people to stop, swap or remove an exercise that hurts and to see a professional (§2.3); there is no check-in to catch it.
* **Testing safely** (R2-PER-07): tests only before or at the start and at the end, never in the middle of a block; anyone not coming off a completed training block is offered a 5- or 3-rep max or 80-90 % efforts, never a 1-rep max or an all-out mile "from zero"; a 1-rep max only for intermediate and up at the end of a completed block (or after "I just finished a training block", PROPOSED).
* **60+ clients** (R3-ATH-02, APPROVED): landing drills, balance, quick stepping without a hop, light medball throws and fast machine work are on; low ankle hops, other jumps, Olympic lifts and depth jumps are off and can be switched on with his warning ("Make sure that you have a fitness professional to help you understand what this means"); overhead and low-bar squats stay out. **Pickleball, padel and tennis players from 50:** knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, only low-impact jumps unless switched on. Clients in pain still never get overhead squats, snatches, low-bar squats or depth jumps (EQ-03). The engine's checks enforce these before a plan is shown, and the "add exercise" list respects them.
* **Youth**: athletic plans allowed (ATH-09, ATH-13); floor Olympic lifts from about 14 after a block of hang work (R2-ATH-08); a guardian accepts the release; nothing is kept for anyone.

---

## 8. Open source: MIT (Option D) [APPROVED, R3-GEN-01; replaces the v1.1 Apache-2.0 + CC BY 4.0 default]

His words: "for people that are downloading the repo, eventually the public repo, the README, and all the files, there should be the MIT of Lalo Vera (which is me), Blaze Camp (which is the doing-business-as), and BFit Studios Corp (which is the corporation) ... That repo should have, in the README and in certain places where it needs to be, that we are releasing liability, that you're downloading this at your own expense and risk, and that if you are going to use this for other clients, for other people, you should have your own liability release."

| Piece | v1.2 decision |
|---|---|
| Engine code, model data (rule tables, exercise tags, templates, sport profiles), docs, sample plans | **MIT**, "Copyright (c) 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation)" (the repo's `LICENSE`, already written). Anyone may use, copy, change and sell it, keeping the copyright and licence notice. |
| Disclaimer and release | `DISCLAIMER.md` (English) and `DISCLAIMER.es.md` (Spanish), referenced from `LICENSE` and the README: not medical advice; use at your own risk and expense; no warranty; release and limitation of liability; coaches and gyms need their own screening, consent, release and insurance and indemnify Blaze Camp; minors supervised; no data collection; Florida law; acceptance by downloading or by ticking "I accept / use at my own risk". Both are **drafts for a licensed Florida attorney** (the files say so). |
| His future videos | Not in the repo; hosted separately (unlisted YouTube); all rights reserved by default. |
| The name and logo "Blaze Camp" | MIT is a copyright licence and grants no trademark rights, so forks may say "based on the Blaze Camp model" but should not present themselves as Blaze Camp [INFERRED from the licence text; RESEARCH on forks and trademarks]. Whether to register the name is a question for the lawyer. |
| Raw sheet dumps, client names, unpublished programs | Client names and unpublished programs are never published. Whether the raw sheet dumps (`dumps/`, `raw/`) stay in the public repo is a decision for him before the public release (INFERRED; they are his programs). |

[RESEARCH: licence terms from choosealicense.com; open-source licences do not grant trademark rights, which is why forks of trademarked projects rename (Hudson → Jenkins).]

**When:** after Phase 0 (he approved the sample plans) and Phase 1 (real users), so the public version starts from a model he has signed off (R2-GEN-02). The `LICENSE` and the two disclaimer drafts already exist in the repo.

---

## 9. Cost, effort and time [INFERRED unless marked]

**Developer time (one experienced developer, full time; part-time or with an AI coding assistant, expect 1.3-2 times the calendar time).**

| Piece | Developer-weeks | Needed by |
|---|---|---|
| Model compile tool, engine (rule tables → whole plan, stairway, groups and floors, focus muscles, ~~time check~~ (retired in v1.3, COACH-CT CT-01; the estimate is the v1.2 one), explanations, checks), edit layer and tests | 6-8.75 | A, C, D |
| Intake screens (few-click flow, focus muscles, ~~time check~~ (retired in v1.3; no session-length question, COACH-R4 R4-SES-01), play days / event date), sport and activity picker | 1.5-2.25 | A |
| Health check, coach skip, own risk + terms + release flow and the printed stamp | 0.5-0.75 | A |
| Block / week / day views with show chips, exercise sheet, swaps, cues, video links | 2-2.25 | A |
| Plan editing UI (block switches, add / remove exercises or blocks, superset switches, reset, notes) | 1-1.5 | A |
| Block / week / day images, print / PDF, share, plan link and plan file, calendar | 1.5-2.25 | A |
| Excel / Google Sheets download (C1) | 0.5-1 | A, C |
| Word lists and language switch (plumbing, not translation) | 0.5-1 | all |
| Open-source preparation (README EN / ES, docs, CI) | 1-2 | D |
| Coach tools without accounts (rule-pack editor, answers files), Olympic weightlifting program type, optional Drive export (C2) | 4-7 | Phase 2 |

**Totals.** A (the MVP): about 13.5-20 weeks. C alone: 7-10 weeks (C1). D: +1-2 weeks and 2-4 hours a week after release. Phase 2 in all: 5-9 weeks plus legal review. If a contractor builds it, cost ≈ developer-weeks × 40 hours × hourly rate (for example 16 weeks × 40 h × $60 = $38,400); rates vary widely by country and experience. Retired from v1.1: the check-in increment (3.5-5 weeks) and v2 accounts (8-12 weeks).

**Running costs (RESEARCH for prices; INFERRED totals).**

| Item | MVP and later |
|---|---|
| Domain name | ~$10-20 a year |
| Hosting (static site) | $0 (Cloudflare Pages free: unlimited bandwidth, 500 builds a month) |
| Video hosting | $0 (link-out to YouTube search; his own unlisted YouTube videos when filmed) |
| Database, accounts, analytics | none, ever (R3-GEN-01) |
| Email | the video-contact inbox only (N-PROD-14) |
| Legal review of the health check (EN / ES), the Terms and Release of Liability (from `DISCLAIMER.md` / `DISCLAIMER.es.md`), the coach terms, the minors clause and the one-line privacy statement | **needed before launch** (one-off; get quotes from a Florida attorney) |
| Health-check licence | $0: our own short screen with the lawyer and a link to the official PAR-Q+ (APPROVED, R3-GEN-01) |
| Google verification for Drive export | only if the optional C2 is built |

**Your time.**

| Task | Rough time |
|---|---|
| Grade the sample plans (R2-GEN-07 + the pickleball bonus) | ~8 hours |
| Answer round 4 (a handful of questions, §11.2) | under 1 hour |
| Approve cue lines and the "How to adjust this plan" lines (AI-drafted from your notes) | ~350 one-liners; a few evenings |
| Approve Spanish | 2-4 days of review, spread out |
| Work with the lawyer on the Terms, Release and health check (EN / ES) | a few meetings |
| Film videos (optional, R2-GEN-02) | the 85 most-used in one 3-4 hour session, whenever you want |

---

## 10. Risks and mitigations

| Risk | Where | Mitigation |
|---|---|---|
| The engine misreads your style | all | The graded sample plans become automatic tests; every plan shows "why" for each choice; model versions are stamped on plans. |
| Someone gets hurt following a plan | all | Health check (R3-GEN-01), pain rules at the build (VOL-03), machine bias for injured clients (EQ-03), 60+ and racket-50+ defaults (R3-ATH-02), safe testing (R2-PER-07), printed "see a professional" and "How to adjust" lines, the own-risk + terms + release tick every build, the disclaimer on every export. |
| A fixed plan cannot react to a bad week or a sore joint | A | The reps-in-reserve cue lets the load follow the day; people switch off blocks, remove or swap exercises, repeat a week, or stop and build a maintenance plan; coaches edit or rebuild (§2.3, §14.5). This is his choice: "people will adjust accordingly over time" (R3-VOL-04). |
| The release does not hold up, or cannot be proven because nothing is stored | all | Lawyer-written EN / ES text from the `DISCLAIMER` drafts; an unticked box plus a separate Build button; the text version, role, date and health route printed on the plan and every export; parent or guardian for under-18s. With no stored record (his decision, R3-GEN-01), the lawyer must confirm that a printed record is enough. Parent-signed releases are not enforced in many US states, so youth plans carry extra risk. [RESEARCH] |
| A coach skips the health check and the client is unfit | coach mode | The skip exists only in coach mode, with the legal warning; the coach terms say the coach screens with their own onboarding and needs their own release (§12.3, `DISCLAIMER.md` §5). |
| Health-check text breaks copyright | all | Resolved: our own short screen written with the lawyer and only a link to the official PAR-Q+ (R3-GEN-01). [RESEARCH] |
| People edit the plan into something unbalanced | A | The editor shows the minutes and the weekly sets per group after each edit, notes a group under its floor or a day without core, and offers "Reset to the generated plan"; the "add exercise" list never offers excluded exercises (§14.5). |
| A plan is lost (nothing stored) | A | Images, PDF, sheet, plan link and plan file; the same answers rebuild the same plan (deterministic); the optional answers file (§2.5). |
| A YouTube search shows poor technique | all | The link is clearly labelled as YouTube, not Blaze Camp; the cue under every exercise is his; coaches can pin a better link; his own videos replace links over time. |
| Missing sports or wrong positions | all | The picker comes from the merged sport profiles with a coverage table; "Not listed? Pick the closest type" fallback (§13.4); users can tell us by email. |
| Spanish quality, legal equivalence | all | He or a coach he trusts approves every line; the lawyer reviews the legal texts in both languages (R3-GEN-01); English fallback flagged (never for legal lines). |
| Copies of the open-source version give bad plans or misuse the name | D | MIT allows copies; the disclaimer travels with the code; no trademark rights under MIT; publish only after he approves the model; tests shipped with the code. |
| Scope creep back into "an app" with tracking | all | "No check-ins, no tracking, no data kept" is a locked product rule (R3-VOL-02, R3-VOL-04, R3-GEN-01); each phase has a fixed list and a "done when" test (section 6). |

---

## 11. Decisions for you

### 11.1 Status of the product questions after round 3

| ID | Question | Status after round 3 |
|---|---|---|
| N-PROD-01 | Website first, sheet as a download, open source after v1? | **APPROVED** (R2-GEN-02), **simplified** by round 3: no check-in phase (R3-VOL-02, R3-VOL-04). |
| N-PROD-02 | Is the check-in step table right? | **RETIRED** with the check-in (R3-VOL-02). |
| N-PROD-03 | PDF style? | **Answered** (R2-GEN-02): images of the whole block, one week or one day; print the block (one page per training day) or a week per page (§14). |
| N-PROD-04 | Google Sheets: download now, Drive later; layout? | Download **APPROVED** (R2-GEN-02); Drive optional later. Layout default: all weeks stacked like 'JUSTICE LEAGUE' (PROPOSED). |
| N-PROD-05 | Open source: when and which licences? | **Answered** (R3-GEN-01): **MIT** to Lalo Vera, Blaze Camp and BFit Studios Corp.; after v1. |
| N-PROD-06 | Which Spanish, gym terms in brackets, who approves? | **APPROVED** (R2-GEN-08); legal texts legally equivalent (R3-GEN-01). |
| N-PROD-07 | Videos? | **Superseded** by R2-GEN-02: videos optional; link-out to YouTube search; his own videos later (§7.3). |
| N-PROD-08 | Learning data: adults only, opt-in, v2? | **RETIRED**: no data kept (R3-GEN-01). |
| N-PROD-09 | Business model: free site? coach tools free or paid? | 'NO ACCESS' answered (a self-serve version without coach access, R2-LIB-08). Free vs paid still open; decide before Phase 2. |
| N-PROD-10 | Plan names shown to users? | Still open; descriptive names in both languages by default. |
| N-PROD-11 | The 8 knee-band core exercises: drop, or a ball or pad squeeze instead? | Still open (library question); default: ball or pad squeeze. |
| N-PROD-12 | Units: lb in the US, kg elsewhere, switchable? | **APPROVED** (R2-GEN-08). |
| N-PROD-13 | When to accept the release? | **Answered** (R3-GEN-01): every build or rebuild, including the start of each new block; not when a saved plan is reopened. |
| N-PROD-14 | Where should "send us your video" go? | Still open; placeholder `[VIDEO_CONTACT]`. |
| N-PROD-15 | Health check: license the PAR-Q+ or write our own? | **Answered** (R3-GEN-01): a lawyer writes a short Blaze Camp health check in English and Spanish, with a link to the official PAR-Q+. |
| N-PROD-16 | Release record on the phone only, or a server log? | **Answered** (R3-GEN-01): no data kept; the record is printed on the plan and every export (the lawyer confirms it is enough). |
| N-PROD-17 | Competitive Olympic weightlifters before their program type exists? | Still open; default: explain that a dedicated program is coming, offer the athletic strength-and-power plan meanwhile. |
| N-PROD-18 | An optional event date for stay-active users? | **APPROVED** (R3-ATH-05): hardest weeks end 1 week before, then 1 easy week at about half the sets. |
| N-PROD-19 | The failed answer in the check-in? | **RETIRED** with the check-in (R3-VOL-02); "Couldn't do it" stays in the sheet's HOW IT FELT? column for people who log. |
| N-PROD-20 | Olympic lifts: may a coach switch percentages on for one tested athlete? | Still open; default: coach mode only, per athlete and per lift. |

### 11.2 New questions (round 4 candidates; only what blocks the product)

> **Status after round 4 (v1.3).** Round 4 was re-scoped after CT-01 and asked other questions (section V1). N-PROD-27 is moot (the time check is retired). N-PROD-13's box is now a required gate (R4-SCP-02). The other N-PROD questions below were not asked and keep their defaults. New open questions: `BLAZE_CAMP_BRAIN.md` §0d.3.

| ID | Question | Our suggestion |
|---|---|---|
| N-PROD-21 | "No data kept": may the site remember the last plan **on that one phone only** (never sent anywhere; one tap clears it), or should it forget everything when the page closes (people keep their image, PDF, sheet, link or file)? The same question covers the optional Google Drive export (C2), which needs a Google sign-in. | Forget everything by default; offer a "Keep this plan on this phone" switch, off by default. No Drive export in the MVP. |
| N-PROD-22 | "Week by week" (one of your round-1 plan lengths) ran on check-ins. Retire it, or keep it as a 12-week plan that opens on the Week view? | Keep the name as a shortcut to the Week view of a 12-week plan; no separate mode. |
| N-PROD-23 | A cookieless count of page views (no personal data, nothing about the person), or nothing at all? | Nothing in the MVP. |
| N-PROD-24 | Your words: own risk, terms and release "should all be in that". One box for all three, or separate ticks if the lawyer prefers? | One box (fewest clicks), unless the lawyer asks for separate ticks. |
| N-PROD-25 | Focus muscles for competitive field athletes (football, soccer …): offer them, or keep athletes on their sport profile only? | Offer them, with a one-line note that the sport work comes first. |
| N-PROD-26 | Round 1 (VOL-01): the tool "eventually will be something that learns from the data of all the people that use it". With "no data kept", that is off. Off for good, or only for now? | Off; the model improves through your reviews and the feedback people choose to email. |
| N-PROD-27 (**moot in v1.3**: the time check is retired, CT-01) | Time check (R3-SES-02): when someone keeps a short schedule, you approved "big movers first; arms, calves and rear delts from compound credit". If that person picked a Focus muscle that is an arm or the calves (R3-SES-01), is it still trained directly, or does it also come from compound credit? | Keep the Focus muscles trained directly (they are what the person asked for) and trim another small group instead; say so on the time-check screen. |

---

## 12. Start flow: who you are, health check, terms and release (R2-GEN-03; APPROVED R3-GEN-01) [screen layout PROPOSED; all copy LEGAL REVIEW]

### 12.1 The flow

```
Landing (EN|ES, lb|kg)  "Not medical advice. Use at your own risk. Blaze Camp keeps nothing you enter."
   |
   v
Who is this plan for?  ---- "Me" (client) ------------------> 12.2 Blaze Camp health check (+ link to the official PAR-Q+)
   |                                                              | any refer answer -> REFER (no automatic plan)
   | "A client: I'm a coach or trainer"                           | all clear -> continue
   v                                                              v
12.3 Coach: "Run the health check with my client now" ----> same health check, coach taps the answers
            "Skip: I follow my own onboarding (SOP)" -----> coach warning (C1) -> continue
   |
   v
About you -> Goal (+ Focus muscle 1 / 2) -> Sport or activity (+ play days, event date)
   -> Schedule (days and weekdays; v1.3: no session length, no time check) -> Plan type and tests
   -> Equipment -> Pain -> (More options)
   |
   v
12.4 Terms, release and own risk (client or coach version) + ONE unticked box + [Build my plan]
   |      (under 18: a parent or guardian accepts)
   v
The whole plan (Block / Week / Day, editable)  -- nothing goes back to the tool
   |
   v
Last page: what next (easy week recommended, then build the next block)  -> building again = this flow again, 12.4 again
```

### 12.2 Health check for clients [APPROVED, R3-GEN-01; R2-GEN-03]

* **Who sees it:** every client ("Me"), and coach-mode users who choose "Run the health check with my client now".
* **What it is (APPROVED, R3-GEN-01):** a short Blaze Camp health check written by a lawyer in English and Spanish: his five "see a professional first" items (chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury currently under treatment; a doctor said not to train) plus the usual PAR-Q topics (heart and blood pressure, chest pain, dizziness or loss of balance, a bone, joint or soft-tissue problem made worse by exercise, a chronic condition or medicine a doctor manages), with **a link to the official PAR-Q+** for anyone who wants the full questionnaire (C3c). The official PAR-Q+ is copyrighted ("All rights reserved"), must be used unchanged and lists no Spanish version, which is why it is linked, not embedded [RESEARCH, eparmedx.com, 2026-10-08]. We added "fainting" to the heart item (PROPOSED, LEGAL REVIEW).
* **Any refer answer** → **no automatic plan**, the refer message (C3), and a pointer to a professional or a coach. Answers to the general questions that are not on the refer list lead to "check with your doctor before you start" and an unticked "My doctor or a qualified professional has cleared me to exercise" box before continuing [PROPOSED; LEGAL REVIEW].
* **Fewest clicks:** one big button "None of these apply to me" and a "Some apply" button that opens the switches; never switches pre-set to "no" (a pre-set answer is not an answer) [INFERRED; LEGAL REVIEW].
* **Privacy:** the answers are used on screen for this build only; they are never stored, never in the plan, links, images or exports. The plan's stamp carries only the route ("health check by the client", "by the coach with the client", "coach's own onboarding") (R3-GEN-01).

### 12.3 Coach mode: run the check or skip it [APPROVED, R3-GEN-01; R2-GEN-03]

His words (round 2): "If you're a coach, it should be able to be toggled ... I want to be able to bypass it if I'm a coach and I just want to get it done. Meaning that it should have some type of legal warning to the coach."

* Coach mode asks once per plan: **"Run the health check with my client now"** or **"Skip: I'm a fitness professional and I screen my clients with my own onboarding"**.
* Choosing Skip shows the coach warning (C1) and puts "coach's own onboarding" on the plan's stamp; the coach terms (C5) then include the screening responsibility and the coach's own release for the client (`DISCLAIMER.md` §5).
* The skip is never offered on the client door [PROPOSED].
* A coach can make Skip the default on the page they have open (fewest clicks; nothing is stored by Blaze Camp), but the warning line stays visible and the box is still ticked every time [PROPOSED].

### 12.4 Terms, release and own risk: everyone, every build [APPROVED, R3-GEN-01]

> **Changed in v1.3** (COACH-R4 R4-SCP-01, R4-SCP-02). The tick is a required gate: without it no plan is generated, and the check runs before the health check. A short release line is printed on every plan (top and bottom of a full plan; a short line on every block, week and day view), in English and Spanish, linking `DISCLAIMER.md` / `DISCLAIMER.es.md`. Everyone may use the plans on their own. Where the text below differs, the v1.3 section at the top of this file wins.

His words: "there probably should be a 'use at your own risk' checkbox. I don't know if we should be keeping any kind of data, but I don't want any data kept. It doesn't matter if they click it; it comes out. If they click it, they understand it ... Terms and conditions and liability releases. They should all be in that." (R3-GEN-01); "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." (R2-GEN-03)

* **Who:** every client and every coach. Two versions: client (C4) and coach (C5). Under 18: a parent or legal guardian reads and accepts (C6); a parent's acceptance is not enforced in many US states, which the lawyer must weigh [RESEARCH].
* **When:** on the last screen before a plan is built, every time a plan is built or rebuilt, including the start of each new block; not when a saved plan (link or file) is just reopened [APPROVED, R3-GEN-01].
* **What:** a short summary on screen and a link to the full **Terms and Release of Liability**: the lawyer-approved version of `DISCLAIMER.md` (English) or `DISCLAIMER.es.md` (Spanish), shown in the chosen language. Both drafts already exist in the repo for a Florida attorney's review.
* **How (clickwrap):** **one unticked box** that covers all three: "I accept the Terms and the Release of Liability, and I use this plan at my own risk" (C16, matching the disclaimer's own acceptance clause), and a separate **Build my plan** button that only works when the box is ticked. Pre-ticked boxes are not real consent [RESEARCH]. If the lawyer prefers separate ticks, we split it (N-PROD-24).
* **Record (printed, not stored):** `{text_version, language, role, accepted_at, plan_id, health_route, guardian?}` is stamped on the plan and printed in the footer of every image, PDF, sheet, link and file ("Terms and release v0.1 accepted 2026-10-12 by the client · use at your own risk"). Blaze Camp keeps no copy and runs no server log (R3-GEN-01; the lawyer confirms a printed record is enough).
* **Fewest clicks:** one tick + one tap.

### 12.5 Copy text placeholders (EN / ES) [LEGAL REVIEW: placeholders only, not final legal text]

Keys follow the word-list convention (`ui.*`, `health.*`, `release.*`, `warn.*`, `edit.*`, `time.*`, `plan.*`, `privacy.*`). Spanish is neutral Latin American (R2-GEN-08), legally equivalent to the English (R3-GEN-01), and needs the same legal review.

| Key | English | Español |
|---|---|---|
| C0 `ui.start.role` | Who is this plan for? · **Me** · **A client (I'm a coach or trainer)** | ¿Para quién es este plan? · **Para mí** · **Para un cliente (soy entrenador/a)** |
| C1 `warn.coach_bypass` | You chose to skip the health check. You confirm you are a fitness professional and that you screen this client with your own onboarding procedures (health questionnaire, and medical clearance when needed) before they start. Blaze Camp has not screened this client. [LEGAL REVIEW] | Elegiste omitir el chequeo de salud. Confirmas que eres profesional del fitness y que evalúas a este cliente con tus propios procedimientos de ingreso (cuestionario de salud y autorización médica cuando haga falta) antes de que empiece. Blaze Camp no ha evaluado a este cliente. [REVISIÓN LEGAL] |
| C2 `health.intro` | Before we build your plan, a few health questions. If any of these apply to you, please talk to a doctor or a qualified professional first. [LEGAL REVIEW] | Antes de crear tu plan, unas preguntas de salud. Si alguna aplica a tu caso, habla primero con un médico o un profesional calificado. [REVISIÓN LEGAL] |
| C2b `health.none` / `health.some` | **None of these apply to me** · **Some apply** | **Ninguna aplica a mi caso** · **Algunas aplican** |
| C3 `health.refer` | Thank you for being honest. With this answer we can't build an automatic plan for you right now. Please talk to your doctor or a qualified health professional first. When you are cleared, a coach can build your plan with you. [LEGAL REVIEW] | Gracias por tu sinceridad. Con esta respuesta no podemos crear un plan automático para ti en este momento. Habla primero con tu médico o con un profesional de la salud calificado. Cuando tengas su autorización, un entrenador puede crear tu plan contigo. [REVISIÓN LEGAL] |
| C3b `health.cleared` | ☐ My doctor or a qualified professional has cleared me to exercise. [LEGAL REVIEW] | ☐ Mi médico o un profesional calificado me autorizó a hacer ejercicio. [REVISIÓN LEGAL] |
| C3c `health.parq_link` | Want the full official questionnaire? Open the official PAR-Q+ (opens eparmedx.com, in English). | ¿Quieres el cuestionario oficial completo? Abre el PAR-Q+ oficial (abre eparmedx.com, en inglés). |
| C4 `release.client` | **Before we build your plan (version [RELEASE_VERSION])** [LEGAL REVIEW: placeholder; the full text is the lawyer-approved version of `DISCLAIMER.md`] This plan is general fitness information, not medical advice, and does not replace a doctor. Exercise carries risks, including injury. You follow this plan at your own risk and expense. Stop any exercise that causes pain, dizziness or chest discomfort, and get medical advice when you need it. To the extent the law allows, you release Lalo Vera, Blaze Camp and BFit Studios Corp. from liability for any injury or loss from using this plan. Blaze Camp keeps none of your answers. [Read the full Terms and Release of Liability] ☐ (C16) **[Build my plan]** | **Antes de crear tu plan (versión [RELEASE_VERSION])** [REVISIÓN LEGAL: texto provisional; el texto completo es la versión aprobada por el abogado de `DISCLAIMER.es.md`] Este plan es información general de acondicionamiento físico, no es consejo médico y no reemplaza a un médico. El ejercicio implica riesgos, incluidas lesiones. Sigues este plan bajo tu propio riesgo y por tu propia cuenta. Detén cualquier ejercicio que te cause dolor, mareo o molestias en el pecho, y busca consejo médico cuando lo necesites. En la medida en que la ley lo permita, liberas a Lalo Vera, Blaze Camp y BFit Studios Corp. de toda responsabilidad por lesiones o pérdidas derivadas del uso de este plan. Blaze Camp no guarda ninguna de tus respuestas. [Leer los Términos y la Liberación de Responsabilidad completos] ☐ (C16) **[Crear mi plan]** |
| C5 `release.coach` | **Coach terms and release (version [RELEASE_VERSION])** [LEGAL REVIEW: placeholder; full text = `DISCLAIMER.md` §5] You are building this plan for someone else. You act under your own professional judgment and are solely responsible for the plans you give your client: screening them, your own health questionnaire, informed consent, liability release and professional insurance. Blaze Camp's release does not cover your client. To the extent the law allows, you release Lalo Vera, Blaze Camp and BFit Studios Corp. from liability and hold them harmless against claims from your clients. [Read the full Terms and Release of Liability] ☐ (C16) **[Build the plan]** | **Términos y liberación para entrenadores (versión [RELEASE_VERSION])** [REVISIÓN LEGAL: texto provisional; texto completo = `DISCLAIMER.es.md` §5] Estás creando este plan para otra persona. Actúas bajo tu propio criterio profesional y eres el único responsable de los planes que entregues a tu cliente: su evaluación, tu propio cuestionario de salud, el consentimiento informado, la liberación de responsabilidad y tu seguro profesional. La liberación de Blaze Camp no cubre a tu cliente. En la medida en que la ley lo permita, liberas a Lalo Vera, Blaze Camp y BFit Studios Corp. de toda responsabilidad y los mantienes libres de responsabilidad frente a reclamos de tus clientes. [Leer los Términos y la Liberación de Responsabilidad completos] ☐ (C16) **[Crear el plan]** |
| C6 `release.minor` | Under 18: a parent or legal guardian must read and accept this release. Guardian's name: [ ] [LEGAL REVIEW] | Menores de 18 años: un padre, madre o tutor legal debe leer y aceptar este descargo. Nombre del tutor: [ ] [REVISIÓN LEGAL] |
| C7 `warn.older_athletic` | From age 60, your plan includes landing drills, balance work, quick stepping, light medball throws and fast machine work. Ankle hops, other jumps, Olympic lifts and depth jumps are switched off. You can switch them on. Make sure that you have a fitness professional to help you understand what this means. (R3-ATH-02; last sentence his wording, R2-ATH-08) | A partir de los 60 años, tu plan incluye ejercicios de aterrizaje, equilibrio, pasos rápidos, lanzamientos ligeros de balón medicinal y trabajo rápido en máquinas. Los saltitos de tobillo, los demás saltos, los levantamientos olímpicos y los saltos en profundidad están desactivados. Puedes activarlos. Asegúrate de contar con un profesional del fitness que te ayude a entender lo que esto implica. |
| C7b `warn.racket_50_impact` | Pickleball, padel and tennis players from 50: your plan uses knee-friendly strength work, calf and Achilles work on every leg day, rotator-cuff work and low-impact jumps only. Depth jumps, hurdle hops and bounds are switched off. You can switch them on. Make sure that you have a fitness professional to help you understand what this means. (R3-ATH-02) | Jugadores de pickleball, pádel y tenis desde los 50 años: tu plan usa trabajo de fuerza amable con las rodillas, trabajo de pantorrilla y tendón de Aquiles en cada día de pierna, trabajo del manguito rotador y solo saltos de bajo impacto. Los saltos en profundidad, los saltos de vallas y los saltos largos alternos (bounds) están desactivados. Puedes activarlos. Asegúrate de contar con un profesional del fitness que te ayude a entender lo que esto implica. |
| C8 `video.link` / `video.note` | **Watch how** (opens YouTube) · Videos open on YouTube and are not made by Blaze Camp. We're building our own library. Have a great video of this exercise? Send it to [VIDEO_CONTACT]. | **Ver cómo se hace** (abre YouTube) · Los videos se abren en YouTube y no son de Blaze Camp. Estamos creando nuestra propia biblioteca. ¿Tienes un buen video de este ejercicio? Envíalo a [VIDEO_CONTACT]. |
| C9 `effort.how_hard` | **How heavy?** Each exercise tells you how many reps to leave in the tank: "leave 2 in the tank" means you could do 2 more reps at the end of the set (about RPE 8; 3 left = RPE 7, 1 left = RPE 9). Your plan starts with 3 in the tank, then 2, then 1-2, and in the last week 1 with a few extra-hard sets. Week 1: start a little lighter, with a weight you could lift 2-3 more times. | **¿Cuánto peso?** Cada ejercicio te dice cuántas repeticiones dejar en reserva: "deja 2 en reserva" significa que podrías hacer 2 repeticiones más al final de la serie (aproximadamente RPE 8; 3 en reserva = RPE 7, 1 en reserva = RPE 9). Tu plan empieza con 3 en reserva, luego 2, luego 1-2, y en la última semana 1 con algunas series extra duras. Semana 1: empieza un poco más ligero, con un peso que podrías levantar 2-3 veces más. |
| C10 `effort.olympic` | **Olympic lifts are for power.** Cleans, snatches and their dumbbell and kettlebell versions train power: move the weight as fast as you can with clean technique. Pick a weight you can move explosively on every rep; if it slows down or your technique breaks, it's too heavy. You don't need percentages for these unless you compete in Olympic weightlifting. | **Los levantamientos olímpicos son para la potencia.** Las cargadas (cleans), las arrancadas (snatches) y sus versiones con mancuernas y kettlebells entrenan potencia: mueve el peso lo más rápido que puedas con buena técnica. Elige un peso que puedas mover de forma explosiva en cada repetición; si se frena o se rompe la técnica, es demasiado pesado. No necesitas porcentajes para estos levantamientos, a menos que compitas en halterofilia (Olympic weightlifting). |
| C11 | RETIRED (`maint.end`, an in-app prompt at the end of maintenance; R3-PER-01, R3-VOL-02): the maintenance plan ends with C15 like every plan. | RETIRADO |
| C12 | RETIRED (`block.cannot_finish`, the check-in offer to stop a block; R3-VOL-02): people stop when they decide (§2.3). | RETIRADO |
| C13 `effort.ten` (sheet helper) | 10 - I'm done: the most I could do, and I made it. (If you couldn't finish a set, mark that exercise "Couldn't do it".) - shown under the EFFORT column of the downloaded sheet only | 10 - No puedo más: lo máximo que podía hacer, y lo logré. (Si no pudiste terminar una serie, marca ese ejercicio como "No pude hacerlo".) |
| C14 `ui.disclaimer` | Not medical advice. Use at your own risk. Train within your limits. Full terms: Disclaimer and Release of Liability. | No es consejo médico. Úsalo bajo tu propio riesgo. Entrena dentro de tus límites. Términos completos: Aviso legal y liberación de responsabilidad. |
| C15 `plan.next_steps` | Your block ends here. What next? Recommended: one easy week at about half the sets, then build your next block (it starts one step up). Or build a maintenance plan (you choose the weeks). Or build something new. Plan holidays and vacations between blocks. (R3-PER-01) | Tu bloque termina aquí. ¿Qué sigue? Recomendado: una semana suave con aproximadamente la mitad de las series y luego crea tu siguiente bloque (empieza un escalón más arriba). O crea un plan de mantenimiento (tú eliges las semanas). O crea algo nuevo. Planifica los feriados y las vacaciones entre bloques. |
| C16 `release.own_risk` | ☐ I accept the Terms and the Release of Liability, and I use this plan at my own risk. (R3-GEN-01; one unticked box) [LEGAL REVIEW] | ☐ Acepto los Términos y la Liberación de Responsabilidad, y uso este plan bajo mi propio riesgo. [REVISIÓN LEGAL] |
| C17 `edit.hint` | You can change this plan: switch off today's jump / throw block or core block, remove or add exercises or blocks, and do the suggested supersets to save time. (R3-SES-02) | Puedes cambiar este plan: desactiva hoy el bloque de saltos / lanzamientos o el bloque de core, quita o agrega ejercicios o bloques, y haz las superseries sugeridas para ahorrar tiempo. |
| C18 `edit.superset_suggested` | Superset suggested: do these two back to back, then rest. Saves about {minutes} min. | Superserie sugerida: haz estos dos ejercicios seguidos y luego descansa. Ahorras unos {minutes} min. |
| ~~C19 `time.too_short`~~ **RETIRED in v1.3** (CT-01) | {days} days × {minutes} min can't hold every muscle group at its weekly minimum. Choose one: **Add a day** · **Make sessions {suggested} min** · **Keep my time (train fewer groups directly)** (R3-SES-02) | {days} días × {minutes} min no alcanzan para que cada grupo muscular llegue a su mínimo semanal. Elige una opción: **Agregar un día** · **Hacer sesiones de {suggested} min** · **Mantener mi tiempo (entrenar menos grupos de forma directa)** |
| ~~C20 `time.kept`~~ **RETIRED in v1.3** (CT-01) | Trained directly this block: {groups}. Not trained directly (time): {others} - they still get work from the big lifts. Supersets are suggested to save time. Every trained group still climbs week by week. | Entrenados de forma directa en este bloque: {groups}. No entrenados de forma directa (tiempo): {others}; igual reciben trabajo de los ejercicios grandes. Se sugieren superseries para ahorrar tiempo. Cada grupo entrenado sigue subiendo semana a semana. |
| C21 `focus.help` | Want extra work for one or two muscles? Focus muscle 1 · Focus muscle 2 (optional). Each gets 1 to 3 extra sets a week on top of a balanced plan. (R3-SES-01) | ¿Quieres trabajo extra para uno o dos músculos? Músculo de enfoque 1 · Músculo de enfoque 2 (opcional). Cada uno recibe de 1 a 3 series extra por semana además de un plan equilibrado. |
| C22 `intake.activity.play_days` / `.event_date` | Which days do you play? (optional) · Event date (optional): a race, tournament or trip you are getting ready for (R3-ATH-05) | ¿Qué días juegas? (opcional) · Fecha del evento (opcional): una carrera, un torneo o un viaje para el que te preparas |
| C23 `privacy.nothing_kept` | Blaze Camp keeps none of your answers and none of your plan. Save your plan as an image, PDF, sheet, link or file: it lives only where you save it. (R3-GEN-01) [LEGAL REVIEW] | Blaze Camp no guarda ninguna de tus respuestas ni tu plan. Guarda tu plan como imagen, PDF, hoja de cálculo, enlace o archivo: solo existe donde tú lo guardes. [REVISIÓN LEGAL] |

### 12.6 Fewest clicks: the express path [R2-GEN-02; R3-VOL-04; counts INFERRED]

Rules: one question per screen; big buttons that move on by themselves; numbers by stepper with a sensible start value; units and language pre-filled (v1.3: no session length is asked); everything optional under "More options"; nothing asked that the engine does not use (R2-GEN-04); nothing asked after the build (R3-VOL-02, R3-VOL-04).

| Path | Screens (taps) | About |
|---|---|---|
| Client, gym goal | role (1) · health "none apply" (1) · about you: age, weight, years (3) · goal (1) · days (1) · plan type (1, default 12 weeks) · equipment (1) · pain "nothing" (1) · box + Build (2) | 12-13 taps (v1.3: one fewer, no session length) |
| + Focus muscles | + 2 | optional |
| ~~+ Time check (only when the schedule is short)~~ retired in v1.3 | + 1 (add a day / longer sessions / keep my time) | |
| Client, "stay athletic and active" | as above + activity (1-2); play days and event date optional (+2-4) | 14-16 taps |
| Competitive athlete | as above + competitive (1) · sport (1-2, with search) · position (1) · level of play (1) · season start date (2) · practice and game days (2) | 20-22 taps |
| Coach, skip on by default | role (1) · about the client (3) · goal (1) · … · box + Build (2); or "start from a saved answers file" and change what differs | 11-13 taps |

---

## 13. Sport and activity picker (COACH-CHAT 2026-10-08; R2-GEN-05; GEN-02; R3-ATH-01..05) [PROPOSED unless marked]

His request: for the athletes, all of the popular sports in the United States, swimming included; for the general population, pickleball, because "Gen Pop and general fitness people are wanting to do things like high rows and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." We read "high rows" as **HYROX**, the indoor fitness race, and he **confirmed** it (R3-ATH-03).

**Where the profiles come from.** Four research files (`synthesis/sports/team.json`, `aquatic-endurance-track.json`, `combat-strength-fitness.json`, `genpop-active.json`) were merged into `04_profiles.json` v1.1 (127 profile ids after the v1.1 sport verification, the 27 v1 ids kept; final picker ids in `generator_spec_v1.json > vocab.profiles` and `inputs_schema.fields.F11 / F11r`, status FINAL); the round-3 athlete defaults are applied in `04_profiles.json` v1.2. The ids shown below in brackets are the picker's sport ids; bold ids are the original v1 profiles. Padel has no competitive profile yet (it uses the pickleball, then the tennis profile).

### 13.1 Two doors on the goal screen

| Goal tile (EN / ES) | Who | Then | Profile |
|---|---|---|---|
| **Train for my sport** / **Entrenar para mi deporte** | People who compete, or train for a sport | "Do you compete?" → **Yes** → §13.2 · **I play for fun** → §13.3 · **No sport, I just want to be athletic** → "A bit of everything" | sport profile (+ position variant); recreational → activity |
| **Stay athletic and active** / **Mantenerme atlético y activo** (new) | Gen pop and general-fitness people who play or do something active: pickleball, HYROX, tennis, golf, rec leagues, running, hiking ... | §13.3 activity picker; no position, no season (GEN-02) | activity profile from `genpop-active`, else `weekend_warrior` + activity tag |

Both doors land in the same engine family (athletic); "Stay athletic and active" is simply the recreational path made visible on the first screen so gen-pop users see it as an option for them (COACH-CHAT 2026-10-08) [PROPOSED].

### 13.2 Competitive sports: every popular US sport, with positions [R2-GEN-05 approved; list PROPOSED]

Screen order: sport (tiles for the most chosen + search box, EN / ES names) → position or event group (only where it changes the training) → level of play (youth / high school / college / pro / masters / amateur; swimming adds age-group / club) → **next season start date**, or "I'm in season until", or a competition / fight / meet date, or "no season right now" → **practice days per week and game (meet, match, fight) days** (R2-GEN-05). The tool works out off-season, pre-season (a 4-6-week block at about 60 % of off-season sets with more speed and power, then a 1-2-week taper; R2-PER-06) and in-season (R2-ATH-07).

| Group (source file) | Sport (provisional id; existing profile ids in bold) | Position / event choices shown |
|---|---|---|
| Team field and court (`team`) | American football (`american_football` → **football_skill**, **football_big_skill**, **football_lineman**; team.json: `football_qb`, `football_rb`, `football_wr_db`, `football_te_lb`, `football_ol`, `football_dl`, `football_k_p`) | QB · RB · FB · WR · TE · OL · DL · LB · CB · S · K / P |
| | Flag football (`flag_football`) | none shown (one competitive profile; team.json lists QB / center / WR / rusher / DB inside it) |
| | Basketball (**basketball**) | guard · wing · big |
| | Baseball (**baseball_position**) | pitcher · catcher · infield · outfield |
| | Softball (**softball**) | pitcher · catcher · infield · outfield |
| | Soccer (**soccer**) | goalkeeper · defender · midfielder · forward |
| | Ice hockey (**hockey**) | forward · defense · goalie |
| | Volleyball, indoor (**volleyball**) | outside / opposite · middle · setter · libero |
| | Beach volleyball (`beach_volleyball` → team.json `volleyball_beach`) | none (or blocker · defender) |
| | Lacrosse (`lacrosse`) | men's or women's, then attack · midfield · defense · goalie (team.json `lacrosse_m_*` / `lacrosse_w_*`) |
| | Field hockey (`field_hockey`) | forward · midfield · defense · goalkeeper |
| | Rugby (`rugby`) | forwards · backs · sevens (team.json `rugby_sevens`) |
| | Cheerleading / stunt (`cheerleading`) | base · flyer · back spot · tumbler (team.json: bases and back spots → `cheer_base_spot`; flyers and tumblers → `cheer_flyer_tumbler`) |
| | Competitive dance / drill team (`dance_team`, added in the v1.1 verification) | none; until a profile is written it uses the flyers-and-tumblers profile (INFERRED) |
| | Ultimate (`ultimate`) | handler · cutter |
| Aquatic, endurance and track (`aquatic-endurance-track`) | **Swimming** (`swimming`) | event group: sprint (50-100) · middle (200-400) · distance (800-1500 / open water); main stroke: free · back · breast · fly · IM; the main championship meet date, so the 2-week dryland taper lines up with the swim taper (R3-ATH-01) |
| | Diving (`diving`) | springboard · platform |
| | Water polo (`water_polo`) | field player · center · goalkeeper |
| | Track and field (**track_sprinter** and variants) | sprints 100-200 · 400 · hurdles · jumps (long, triple, high, pole vault) · throws (shot, discus, javelin, hammer) · 800-1500 |
| | Cross country and road running (**distance_runner**) | 5K-10K · half marathon · marathon (his half-marathon plan used as-is; no 21.6-mile run, R2-LIB-06) |
| | Triathlon (`triathlon`) | sprint / Olympic · 70.3 · full |
| | Cycling (`cycling`) | road · mountain · track |
| | Rowing (`rowing`) | sweep · sculling |
| | Alpine skiing / snowboarding (`ski_snowboard`) | alpine · freestyle · snowboard |
| | Figure skating (`figure_skating`, added in the v1.1 verification) | singles · pairs / ice dance; until a profile is written it uses the gymnastics profile `gymnastics_artistic` (INFERRED) |
| Combat (`combat-strength-fitness`) | Wrestling (**wrestling**), Boxing (**boxing**), MMA (**mma**), BJJ / grappling (**bjj_grappling**), Judo (`judo`), Karate / Taekwondo (**karate_taekwondo**), Kickboxing / Muay Thai (**kickboxing_muay_thai**), Fencing (`fencing`, added in the v1.1 verification; until profiled it uses the tennis profile: fast lunging footwork, mostly unilateral, INFERRED) | weight class: light · middle · heavy (heavier fighters get more resistance work, ATH-03) |
| Strength and fitness sports (`combat-strength-fitness`) | Powerlifting (**powerlifting_strength**), Olympic weightlifting (`olympic_weightlifting`, its own %-based program type, N-PROD-17), Strongman (`strongman`), CrossFit (**crossfit_competitor**), HYROX (`hyrox_competitive`), Obstacle course racing (`ocr`), Bodybuilding / physique (**bodybuilding_aesthetics**), Gymnastics (`gymnastics`), Climbing / bouldering (`climbing`) | HYROX: singles open · singles pro · doubles / relay; physique: bodybuilding · classic · men's physique · bikini / figure / wellness |
| Racket and club (`combat-strength-fitness`) | Tennis (**tennis**), Pickleball (`pickleball_competitive`), Padel (`padel_competitive`), Golf (**golf**); added in the v1.1 verification, routed to the nearest profile until one is written (INFERRED): Badminton / squash / racquetball / table tennis (`racket_other` → tennis), Bowling (`bowling` → golf) | singles · doubles (racket sports) |
| Youth | Any sport above with age under 18 uses the youth rules (**youth_athlete**; floor Olympic lifts from about 14 after a hang block, R2-ATH-08) | as the sport |

Sport popularity sources for the list: the SFIA participation reports (pickleball has been the fastest-growing US sport for four years, 19.8 million players in 2024) and the coverage table the merge step writes into `04_athlete_profiles.md` v1.1 [RESEARCH]. The v1.1 verification added figure skating, competitive dance / drill, fencing, the smaller racket sports and bowling, which are common US school and college sports but were missing from the research lists; they need profiles from the merge or sport-verification step (until then they use the nearest profile named above).

Round 3 settled the athlete defaults that sit behind these tiles (`04_profiles.json` v1.2): swimming dryland (R3-ATH-01), 60+ and racket players from 50 (R3-ATH-02), HYROX (R3-ATH-03), the plyometric shares of the remaining sports and the in-season game-heavy rule for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball (R3-ATH-04).

### 13.3 "Stay athletic and active" activities (gen pop; recreational) [list PROPOSED; play days, cardio credit and event dates APPROVED, R3-ATH-05]

Pick up to two (the first one leads). No position, no season (GEN-02). Under More options (all optional, R3-ATH-05):

* **Which days you play.** The hardest gym day stays at least 48 hours before the biggest play day. Weeks with 3 or more play sessions drop the extra agility drills and half the jumps.
* **How long you usually play** (under 45 / 45-60 / more than 60 min; default 45-60). A 45-60+ minute session of the activity counts as one of the person's 3 cardio sessions, up to 2.
* **Event date** (event-type activities: a first HYROX race, a pickleball tournament, a 10K, a ski or hiking trip). The hardest weeks end 1 week before the event, then 1 easy week at about half the sets.

| Tile (EN / ES) | Profile id (`04` v1.1 merge; numbers v1.2) | Notes |
|---|---|---|
| Pickleball / Pickleball | `rec_pickleball` | many players are 50+: from 50, knee-friendly strength, calf and Achilles work every leg day, rotator cuff, low-impact jumps only unless switched on (R3-ATH-02, C7b); 60+ defaults apply (R3-ATH-02, C7); jumps 50 % plyometric at the end of a block (R3-ATH-04) |
| HYROX / HYROX | `hyrox_fitness` | "high rows" = HYROX, **confirmed** (R3-ATH-03): 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated), 4 cardio sessions (running is about half the race), 2 short station circuits a week as finishers that do not count as muscle sets, wall balls with the race ball (never over 20 lb), 40-rep / AMRAP sets only inside these circuits, jumps 50 % plyometric; the race is 8 × 1 km runs, each followed by a workout station [RESEARCH] |
| Tennis / Tenis | `rec_tennis` | the racket-player defaults from 50 (R3-ATH-02) |
| Padel / Pádel | `rec_padel` | the racket-player defaults from 50 (R3-ATH-02); 50 % plyometric (R3-ATH-04) |
| Golf / Golf | `rec_golf` | 25 % plyometric (R3-ATH-04) |
| Rec league / Liga recreativa | `rec_league` + league sport: basketball · soccer · softball · flag football · volleyball · ice hockey · ultimate · kickball | the league sport sets the movement demands (`rec_basketball`, `rec_soccer`, `rec_softball`, `rec_flag_football`, `rec_volleyball`, `rec_hockey`, `rec_ultimate`, `rec_kickball`); no position; rec soccer 60 % plyometric (R3-ATH-04) |
| Running for fitness / Correr por salud | `run_fitness` | first 5K / 10K, run club; 75 % plyometric (R3-ATH-04); event date for a race |
| Hiking and rucking / Senderismo y caminata con mochila (rucking) | `hike_ruck` | event date for a trip |
| Cycling / indoor cycling / Ciclismo / ciclismo indoor | `cycling_fitness` | |
| Lap swimming / Natación por salud | `lap_swim` | |
| Ski / snowboard season prep / Preparación para esquí o snowboard | `ski_snow_prep` | event date = the trip |
| Surf and paddleboard / Surf y paddle | `surf_paddle` | |
| Dance and fitness classes / Baile y clases de fitness | `dance_fitness` | |
| A bit of everything / Un poco de todo | **weekend_warrior** | his former 'Justice League' program: non-competitive all-round athletic adults and youth (ATH-13); 50 % plyometric (R3-ATH-04) |

The v1.1 sport verification also added recreational triathlon, rowing, CrossFit-style classes, combat-fitness classes (striking or grappling), climbing, obstacle course racing and several routed activities (smaller racket sports, disc golf, bowling, trail running, mountain biking, kayak / canoe / wakeboard); the full list with profile ids is in the spec (`inputs_schema.fields.F11r`).

What an "athletic but not competitive" plan contains (some power, some agility, core, resistance and aerobic work, and how much) is defined in `04_profiles.json` and `04_athlete_profiles.md`, in his terms. Age-based rules (60+, racket players from 50, youth) apply automatically from the age on the "About you" screen.

**The option also shows up for gen-pop goals [PROPOSED].** So that people who chose "Lose fat" or "General fitness and health" also see that staying athletic is an option for them (COACH-CHAT 2026-10-08), the goal screen keeps a one-line link under those tiles: "Do you also play something (pickleball, HYROX, tennis ...)? Add it" → the same activity list (one tap, optional). The plan keeps its fat-loss or general goal and adds the activity's athletic work, the play-day spacing and the cardio credit.

### 13.4 Not listed

"Not listed? Pick the closest: court sport · field sport · endurance · combat · strength and power · water sport · board and snow" → the nearest generic profile of that type, plus a "Tell us your sport" box so the list can grow [PROPOSED]. Examples that go through this door for now: equestrian, archery and shooting, rodeo, skateboarding, competitive surfing.

---

## 14. Views, editing, screenshots and exports (R2-GEN-02, R3-SES-02) [layout PROPOSED]

His words: "The better I can see the macro view of the week, the macro view of the block, and the macro view per day. I should be able to have the options for visibility easily toggled ... if a coach creates a program for somebody, they can just screenshot their 12 weeks and send it over to them, or they can screenshot 1 week and send it over to them."

### 14.1 One toggle, three views

* A sticky **BLOCK | WEEK | DAY** switch at the top of the plan. Tapping a week in the block view opens that week; tapping a day opens that day; swiping moves to the next week or day.
* **Show chips** under the switch, remembered per view: exercises · sets × reps · effort (RIR / RPE) · rest · cues · cardio · jumps and throws · sets per muscle. Defaults: block = exercises + sets × reps; week = exercises + sets × reps + cardio; day = everything.
* **Where you land**: clients open on today's Day view; coaches open on the Block view (PROPOSED).
* **Cardio control** in the week view: "Cardio: less · as planned · more" adds or removes one aerobic session per tap (R2-SES-06).
* **Edit controls** in the day view (block switches, remove, "+ add exercise", superset switches; §14.5) (R3-SES-02).
* **The whole plan is there from the start** (R3-VOL-04): every week of the block can be opened before it begins.

### 14.2 The block view (the whole 12 weeks on one screen)

Because the exercises stay the same inside an exercise block (PER-02; one-detail variations only between exercise blocks, R2-LIB-01), the whole block fits in one compact table per training day: the exercises down the side, the weeks across, sets × reps in each cell (a thin line marks the exercise-block changes at weeks 5 and 9). A thin stairway bar on top shows the 12 steps from "easy start" to "hardest weeks" with each week's 2 → 11 level (R2-PER-03, R2-PER-04, R2-PER-05; R3-VOL-04; 12 v1.2 §3.7), with the test weeks marked (R2-PER-07).

```
STAIRWAY  W1 ▁ W2 ▁ W3 ▂ W4 ▂ W5 ▃ W6 ▃ W7 ▄ W8 ▄ W9 ▅ W10 ▆ W11 ▇ W12 █ (test)
level      2   2.6  3.2  3.8  4.4  5    6    7    8    9    10   11
MONDAY · Day A           W1    W2    W3    W4   ...  W11   W12
Dead Bug                 2x10  2x10  2x10  2x10      2x10  2x10
Low Box Jump             3x5   3x5   3x5   4x5       4x5   test
Hang Power Clean         4x3   4x3   4x3   5x3       5x3   5x3
Back Squat               3x6   3x6   3x6   4x6       4x5   test
Chest-Supported Row      3x10  3x10  4x10  4x10      4x8   4x8
...
```
(numbers illustrative; the real cells come from the stairway in `12` / `06` v1.2; on test weeks the test replaces that week's top sets; switched-off blocks are greyed)

### 14.3 The week and day views

* **Week**: the 7 days as a vertical list on the phone (a 7-column grid on a wide screen): day title, about how long, the exercises with sets × reps, rest days, cardio sessions.
* **Day**: the full exercise cards (§3.1 sketch).

### 14.4 Screenshots and exports

| Button | What it makes | Notes |
|---|---|---|
| **Save block as image** | One tall image per training day with the 12 week columns, or one image of the whole block (the user picks) | language, units, plan name, model version, release stamp, the own-risk / not-medical-advice line and the edit hint (C14, C17) baked in; no age, weight, pain or health answers |
| **Save week as image** | One image of the whole week | the coach's "screenshot 1 week and send it" |
| **Save day as image** | One image of the day, phone-sized | |
| **Share** | Opens the phone's share sheet with the image (text it, WhatsApp it) | fewest clicks for coaches sending to clients (INFERRED: supported by current mobile browsers; confirm in the build spike) |
| **Print / PDF** | Block (one landscape page per training day with the week columns) or week (one page per week) | Letter / A4 by region |
| **Google Sheets / Excel** | His BYOP columns, all weeks stacked | §3.3 C1 |
| **Plan link** | The whole plan, edits included, without personal fields, packed after the "#" (never sent to a server) | reopening it needs no new release tick; a rebuild does (R3-GEN-01) |
| **Plan file** | The same plan as a small file the person keeps | for long plans and for coaches |
| **Add to calendar** | One event per training day, with test-reminder alarms | no notifications from Blaze Camp |

### 14.5 Editing the plan (R3-SES-02) [APPROVED options; mechanism PROPOSED]

> **Changed in v1.3** (COACH-CX CX-02, CX-04; COACH-R4 R4-SES-04, R4-LIB-01, R4-LIB-04). Everything is editable, the sets of any day or week included; after an edit the totals are recomputed and the plan is marked edited; each day names the easiest things to remove; the plan offers optional add-ons; a swap says what it keeps and loses; supersets are never switched on by a session length (section V4). Where the text below differs, the v1.3 section at the top of this file wins.

His words: "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance. Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves, or their connective tissues just don't feel like doing any plies and things like that. Then it could be turned off, or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly. The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." (R3-SES-02) And: "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

**What can be changed, and how.**

| Control | What it does | Default scope | Source |
|---|---|---|---|
| **Block switch (on / off)** | Switches off a day's core block, jump / throw (athletic) block, Olympic block, accessory block, calves block, finisher (including HYROX station circuits) or a cardio session; switched-off blocks stay visible, greyed, and print as "(switched off)" | this day every week of the current exercise block; or "this day only" | R3-SES-02 |
| **Remove exercise (×)** | Removes one exercise | as above | R3-SES-02 |
| **+ Add exercise** | Adds an exercise to a block from that day's categories; the list only offers what the generator could have picked for this person (equipment, level, age, pain and exclusions); rear-delt work is always offered on upper days ("People and coaches should always be able to add more rear delts", R3-VOL-01); default sets: compound 3, isolation 2, calves 3 | as above | R3-SES-02, R3-VOL-01 |
| **Add / remove a block** | Adds a core superset or monster set anywhere (R2-SES-03), an accessory block or a cardio session; removes any block | as above | R3-SES-02, R2-SES-03 |
| **Swap** | The same-category dropdown | the exercise block | GEN-04 |
| **Superset suggested** | Marks a pair that can be done back to back (knee lift + pull, hip lift + push, biceps + rear delts, triceps + side delts, calves + delts, core supersets) with the minutes it saves; a switch turns it into a superset or back. Suggestions show by default (S9); the person switches them on (v1.3: no session length does, CT-01) | the pair, every week of the block | R3-SES-02 |
| **Reset to the generated plan** | Undoes every edit | the whole plan | PROPOSED |

**What the tool shows after an edit [PROPOSED].** The day's estimated minutes; the weekly sets per focus group for the weeks affected, with a note when a trained group drops below its floor of 10 or stops climbing; a note when a day has no core block ("This day now has no core block") or no athletic block. It never blocks the person's own edit: your locked rules bind what the generator builds and what the "add" list offers, not what people take out of their own plan (§7.2). Remaining exercises keep their planned sets and keep climbing; the sets of a removed exercise are not moved elsewhere automatically; an added exercise follows its group's planned steps from the week it is added.

**Where edits live.** Inside the plan: the generated plan plus a list of edits applied on top (so it can always be reset). The edits travel with the plan link and the plan file and are printed in every image, PDF and sheet. Blaze Camp keeps nothing (R3-GEN-01).

**What every export says.** "You can switch off today's jump / throw block or core block, remove or add exercises or blocks, and do the suggested supersets to save time" (C17), with the optional blocks and suggested supersets marked, so a coach's screenshot tells the client what they can change.

**What the generator still guarantees.** Before any edit, the plan the tool builds follows every rule: the core opener every session (GEN-08), the athletic budget for the sport, your template complete (v1.3: the A / B days or push / pull / legs), calves on leg days, the floor on every trained group from 3 training days and a stairway that reaches its final sets. v1.3: no time check runs and the tool shortens nothing; the person does, with the "easiest to remove" hints (R4-SES-04).

---

## 15. Weight guidance: reps in reserve, RPE, and Olympic lifts as power (R2-GEN-06; drift APPROVED R3-VOL-04) [wording PROPOSED]

> **Changed in v1.3** (COACH-R4 R4-PRG-03). Every lift also prints the rule for progressing: "Progress: when you hit 12 on every set with 2 left in the tank, add weight next time and start again at 8." A section "How you progress" explains it. No number is promised for a week. Where the text below differs, the v1.3 section at the top of this file wins.

* **Default language: reps in reserve with the RPE number beside it.** "Leave 2 reps in the tank (2 RIR · RPE 8)" (VOL-13: "add an explanation of RIR and how it relates to RPE"). Mapping shown on the "How hard?" page: 3 reps left = RPE 7, 2 = RPE 8, 1 = RPE 9, 0 = RPE 10 (spec `rule_tables.effort.rir_rpe`).
* **The number follows the stairway [APPROVED, R3-VOL-04].** 3 reps in the tank in the early weeks, then 2, then 1-2, and 1 + intensifiers (supersets, a last-set MYO on a machine or isolation) in the last week, always inside his 1-3 RIR band. On a 12-week block: weeks 1-6 at 3 RIR, weeks 7-9 at 2, weeks 10-11 at 1-2, week 12 at 1 + intensifiers (12 v1.2 §3.7). This replaces the v1.1 flag against VOL-13's "no planned RIR ramp": he approved the drift.
* **Week-1 tip:** "pick a weight you could lift 2-3 more times" (R2-GEN-06; copy C9).
* **Percentages only with a recent tested best,** and only on barbell main lifts (R2-GEN-06; PER-09). Untested lifts and maxes always use RIR / RPE: "if they haven't tested their Olympic lifts, 1-rep maxes, or anything like that, then they should pick an RPE or reps in reserve."
* **Olympic lifts are explained as power output** (copy C10): move it fast; if it slows down or technique breaks, it is too heavy. The coach's eye on speed matters; full squat cleans and snatches use 3-5 reps per set (R2-ATH-05). **By default an Olympic lift never shows a percentage**, even when that lift has a tested best: "they don't necessarily need to go by percentage unless you're a competitive Olympic lifter" (R2-GEN-06). A coach (coach mode, rule pack) may switch percentages on for an athlete whose own tested best on that lift exists [opt-in PROPOSED, N-PROD-20].
* **Competitive Olympic weightlifters** are their own program type with percentage-based programming ("completely different but kind of the same on here", R2-GEN-06); built in Phase 2 (N-PROD-17).
* **Effort 10** means "the most I could do, and I made it" (R2-VOL-02); it now appears only as the helper under the EFFORT column of the downloaded sheet (C13), since there is no check-in; never to failure on heavy compounds (GEN-08).

---

## Appendix E · For the engineer

### E1 · Stack [PROPOSED]

* **Static single-page web app**, TypeScript, a small UI library (Preact or Svelte), built to static files. **No server, ever** (R3-GEN-01): the engine runs in the browser (a Web Worker), nothing the person enters leaves the device.
* **Hosting:** Cloudflare Pages (free plan: unlimited bandwidth, 500 builds a month; confirm current terms for a commercial site before launch). Avoid GitHub Pages for the product site (its terms say it is not meant for commercial / SaaS sites); it is fine for open-source docs. [RESEARCH]
* **PWA:** web app manifest + service worker caching the app shell, the compiled model and the word lists only (no user data); videos and YouTube links online only.
* **Storage:** none by default (R3-GEN-01). The plan lives in memory while the page is open and in what the person exports (plan link, plan file, images, PDF, sheet). If the coach says yes to N-PROD-21, a single "keep this plan on this phone" slot in IndexedDB, off by default, cleared with one tap, never synced.
* **i18n:** i18next-style JSON namespaces (`ui`, `health`, `release`, `terms`, `warn`, `edit`, `time`, `plan`, `privacy`, `sports`, `exercise_names`, `cues`, `explain`, `instructions`) with CLDR plurals; ICU only if needed. [RESEARCH]
* **Exports:** print CSS (`@media print`, block = one landscape page per training day, week = one page per week, `break-after: page`); DOM-to-PNG for block / week / day images rendered off-screen at full length (not just the viewport); Web Share API with files for the share sheet, falling back to download; ExcelJS (MIT) for .xlsx with data validation lists and conditional fills, lazy-loaded; `.ics` with alarms for test reminders; the plan link = `#p=` + base64url(deflate(plan/2 JSON)) with personal fields removed; the plan file = the same JSON as `.blazecamp.json`. Optional later: pdf-lib / jsPDF. [RESEARCH; share-sheet support INFERRED, spike]
* **Google Drive export (optional, Phase 2, C2):** Google Identity Services token flow + Sheets API `spreadsheets.create` and `batchUpdate` with the `drive.file` scope only; only if the coach agrees (N-PROD-21). [RESEARCH]
* **No analytics** in the MVP (N-PROD-23).
* **Rule evaluation:** a small in-house evaluator over a fixed action vocabulary (preferred: deterministic, typed, no `eval`), or json-rules-engine if a general engine is wanted. [RESEARCH]

### E2 · Repository layout

The repository today (`blaze-camp-model`, MIT): `engine/*.mjs` (plain JavaScript, Node 22, no dependencies; `README.md`, `CONTRACTS.md`, `DECISIONS.md`), `model/` (compiled runtime model, built by `tools/compile-model.mjs` and the amendment layer in `tools/fixture/`), `synthesis/` (model documents), `generator_spec_v1.json`, `tests/` (`node --test tests/`), `samples/intakes` and `samples/plans`, `LICENSE` (MIT), `DISCLAIMER.md`, `DISCLAIMER.es.md`. The product site would add [PROPOSED]:

```
app/                          # UI + renderers (static site)
  screens/                    # intake flow S0-S10, plan views S11-S18
  renderers/{block,week,day,image,print,xlsx,ics,link,file,share}/
  edit/                       # block switches, add / remove, superset switches, reset (calls engine applyEdits)
  i18n/                       # word lists from model/ i18n
  legal/{terms,release,health}/   # lawyer-approved texts from DISCLAIMER.md / DISCLAIMER.es.md, versioned
LICENSE (MIT)  DISCLAIMER.md  DISCLAIMER.es.md  README.md (EN / ES own-risk notice)  CONTRIBUTING.md
```

Retired from the v1.1 layout: `engine/adapt.ts`, `app/storage/`, `LICENSE-MODEL (CC BY 4.0)`, the Apache-2.0 `LICENSE`, the v2 backend.

### E3 · Runtime model compile step

* Input: `generator_spec_v1.json` 1.2.0 plus the synthesis JSON files (catalog, equipment model, templates, profiles, periodization, volume rules, training variables). The compiler (`tools/compile-model.mjs`) already exists and reads them; it never writes to the sources and stops (writing nothing) on any contract error.
* Output: a runtime bundle that keeps only what the engine reads. A slim catalog of the live-library and program exercises with runtime fields measured about 1.3 MB raw / **80 kB gzipped** (OBSERVED, computed for v1). Target for the whole runtime model, sport profiles included: under ~350 kB gzipped [INFERRED].
* The compile step applies the coach's corrections as data patches with their IDs (rounds 1-2 as before; round 3: rear delts inside the shoulders group, focus groups, the 60+ and racket-50+ defaults, HYROX circuits not counted as muscle sets). Each patch is logged; the compile fails if a patch target is missing.
* **v1.2 note (OBSERVED 2026-10-09):** with spec 1.2.0 the compiler's fixture-key check stops on 26 retired or renamed i18n keys (`checkin.*`, `intake.output_mode.*`, `intake.email.label`, `intake.priority.*`, `maint.end`, `block.cannot_finish`, `block.done`) until engine stage B1 updates `tools/fixture` and `tools/compile/i18n.mjs` (spec `_meta.v1_2_changelog[0].pending_cross_refs`).
* Every compiled bundle carries `model_version`; plans store it, and the site keeps old model versions available so a plan link or file always re-renders identically.

### E4 · Data contracts (abridged)

> **Changed in v1.3** (COACH-CT CT-01; round 4). See section V5: the intake has no `session_minutes`, the plan has no `time_check`. The examples below are v1.2. Where the text below differs, the v1.3 section at the top of this file wins.

**Intake** (`generator_spec_v1.json > inputs_schema`, schema `intake/3`). The intake lives in memory during the build and is never stored or sent (R3-GEN-01). Example 1: a competitive college sprint swimmer, client door.

```json
{
  "schema": "intake/3",
  "lang": "es", "units": "kg",
  "role": "self",
  "health": {"route": "client_screen", "screen_version": "blaze-screen-0.1",
             "refer_items": {"heart": false, "surgery_6mo": false, "pregnant_postpartum_6mo": false, "injury_in_treatment": false, "doctor_said_no": false},
             "general_items_any_yes": false, "cleared_by_professional": null, "outcome": "clear"},
  "age": 20, "body_weight": {"value": 78, "unit": "kg"},
  "goal": "athletic", "focus_muscles": [], "lift_style": "balanced",
  "sport": {"competitive": "competitive", "sport": "swimming", "position": {"event_group": "sprint", "stroke": "fly"},
            "level_of_play": "college",
            "season": {"type": "competition_date", "date": "2027-02-24"},
            "practice": {"practice_days_per_week": 6, "game_days": ["Sat"]}},
  "activity": null,
  "experience": {"years_consistent": 4, "months_off_last_2y": 0, "former_competitor": false},
  "schedule": {"days_per_week": 3, "weekdays": ["Mon","Wed","Fri"], "start_date": "2026-10-12"},
  "plan": {"mode": "fixed_12", "previous_cycles": {"count": 0, "last_block_finished": null}, "tests": ["strength","jumps"], "maintenance_weeks": null},
  "equipment": {"profile": "FULL_GYM", "extra": ["medball","plyo_box"], "machines": ["cable_stack","lat_pulldown"]},
  "pain": [{"area": "shoulder", "side": "right", "severity": "mild", "worse_with": ["overhead"]}],
  "prefs": {"core_position": "start", "optional_days": "separate", "variety_ab": false, "cardio_adjust": 0,
            "superset_recommendations": "show", "older_athletic_opt_in": false, "racket_50_impact_opt_in": false, "exclusions": []},
  "coach_rule_pack_ids": [],
  "release": {"text_version": "terms-release-client-es-0.1", "language": "es", "role": "client", "accepted": true,
              "own_risk_terms_release": true, "accepted_at": "2026-10-12T18:04:00-05:00", "guardian": null}
}
```

(College swimming in the US runs from about October to March, so in October this swimmer is in season and gives the championship meet date; the tool works out in-season dryland and lines up a 2-week dryland taper with the swim taper before the meet (R3-ATH-01). Swimming dryland defaults: 3 gym days + 1 optional, 0 extra cardio (the pool is the aerobic work), jumps mostly ballistic (25 % plyometric at the end of a block), Olympic lifts 2-3 days, shoulder care every session without bands (R3-ATH-01). Tests: with no completed block yet, "strength" means a 5- or 3-rep max, not a 1-rep max (R2-PER-07).)

Example 2 (only the parts that differ): a 63-year-old recreational pickleball player on the "Stay athletic and active" door, with a focus muscle.

```json
{"goal": "active", "sport": null, "focus_muscles": ["glutes"],
 "activity": {"ids": ["rec_pickleball"], "league_sport": null, "play_days": ["Tue","Sat"], "play_minutes": "60_plus", "event_date": "2027-03-14"},
 "age": 63, "prefs": {"older_athletic_opt_in": false, "racket_50_impact_opt_in": false, "cardio_adjust": 0, "superset_recommendations": "show"}}
```

(From 60 the older-adult defaults apply and the older-adult switch covers jumps; the racket switch is the one shown from 50 to 59. The racket-player defaults from 50 (knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work) also apply at 63 (R3-ATH-02). Each 60+ minute play session counts as a cardio session, up to 2 of the 3; the hardest gym day stays 48 h before Saturday; the hardest weeks end a week before the 14 March tournament, then one easy week at about half the sets (R3-ATH-05). "Glutes" gets 1-3 extra sets a week (R3-SES-01).)

Example 3 (only the parts that differ): a coach who skips the health check.

```json
{"role": "client",
 "health": {"route": "coach_own_sop", "refer_items": null, "outcome": "bypassed_by_coach"},
 "release": {"text_version": "terms-release-coach-en-0.1", "language": "en", "role": "coach", "accepted": true, "own_risk_terms_release": true, "accepted_at": "2026-10-12T09:30:00-05:00", "guardian": null}}
```

`role`: `self` (client door) | `client` (coach mode, building for a client) (F39). `health.route`: `client_screen` | `coach_screen` | `coach_own_sop` (F45); `outcome`: `clear` | `refer` | `cleared_by_professional` | `bypassed_by_coach`. `goal` adds `active` (Stay athletic and active), which maps to the athletic family with `competitive = recreational`. `focus_muscles` (F09): up to 2 of `glutes`, `quads`, `hamstrings`, `back`, `chest`, `shoulders`, `biceps`, `triceps`, `calves`, `core`, `v_taper` (uses both slots); intake/2 `priority_muscles` is accepted as an alias, and its `side_delts` / `rear_delts` values map to `shoulders` (R3-VOL-01). `plan.mode` ∈ `fixed_12` | `fixed_8` | `maintenance_4_6` | `year` (`week_by_week` accepted as an alias of `fixed_12` opening on the Week view, PROPOSED; the `maintenance_4_6` code is kept, its length comes from `maintenance_weeks`, 1-8). **Removed:** `sex` (GEN-02), `recovery` (R2-GEN-04), `output_mode` (R3-VOL-02, R3-VOL-04), `email` (R3-GEN-01), `previous_cycles.last_had_holds_or_pain` (→ `last_block_finished`). No plan is generated unless `release.accepted` and `release.own_risk_terms_release` are true for this generation and `health.outcome` ≠ `refer`.

**Plan** (`plan/2`; codes only; all words resolved by the renderer through the word lists). **The example below is the v1.2 shape and is RETIRED in v1.3: a v1.3 plan carries no `time_check` and trims no groups for time (section V5; `engine/CONTRACTS.md`).** Illustrative: a 3-day × 45-minute general-fitness plan where the time check trimmed groups and the person kept their time.

```json
{
  "schema": "plan/2", "model_version": "1.2.0", "engine_version": "0.4.0", "seed": "a91f…",
  "intake_hash": "sha256:…", "level": {"client": "L2", "reason_keys": ["exp_4y", "no_layoff"]},
  "release_stamp": {"text_version": "terms-release-client-en-0.1", "role": "client", "accepted_at": "2026-10-12T18:04:00-05:00",
                    "own_risk_terms_release": true, "health_route": "client_screen"},
  "focus_groups": ["hips"],
  "shape": {"key": "STAIRWAY_12", "steps": 12,
            "labels": [{"weeks": [1,6], "label_key": "phase.small_steps"}, {"weeks": [7,8], "label_key": "phase.bigger_steps"}, {"weeks": [9,12], "label_key": "phase.hardest"}],
            "level_by_week": [2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11],
            "rir_by_week": ["3","3","3","3","3","3","2","2","2","1-2","1-2","1+"],
            "tests": {"start_week": 1, "end_week": 12}},
  "time_check": {"fits": false, "needed_minutes": 60, "offered": {"extra_day": true, "session_minutes": 60}, "kept_time": true,
                 "trained_groups": ["hips", "quads", "back", "chest"], "not_trained_directly": ["biceps", "triceps", "calves", "shoulders"],
                 "supersets_recommended": true},
  "weeks": [{
    "n": 1, "kind": "build",
    "summary": {"sets_by_group": {"hips": 12, "quads": 10, "back": 10, "chest": 10}, "contacts": {"high": 0, "low": 30}, "throws": 20, "aerobic_sessions": 3},
    "days": [{
      "weekday": "Mon", "day_type": "A", "est_minutes": 45,
      "blocks": [
        {"block_id": "blk.A.core.1", "kind": "core", "optional": true, "toggle": true, "on": true, "movable": true,
         "items": [{"slot_id": "A.core.1", "purpose_key": "purpose.core", "category": "CT.THORAX.STATIC",
                    "exercise_id": "dead-bug", "alternatives": ["bird-dog", "hollow-hold"],
                    "sets": [{"reps": {"type": "per_side", "value": 10}}, {"reps": {"type": "per_side", "value": 10}}],
                    "effort": {"rir": [2, 3], "rpe": [7, 8]}, "load_hint": null, "rest_s": [60, 90],
                    "cue_key": "cue.dead-bug", "video": {"kind": "search", "query_key": "exercise.dead-bug.name"},
                    "credits": {"core": 1.0}, "why_keys": ["why.core_first"]}]},
        {"block_id": "blk.A.athletic.1", "kind": "athletic", "optional": true, "toggle": true, "on": true, "items": ["…"]},
        {"block_id": "blk.A.strength.1", "kind": "strength", "optional": false, "toggle": false, "removable": true,
         "items": [{"slot_id": "A.knee.1", "…": "…"}, {"slot_id": "A.pull.1", "…": "…"}]}
      ]
    }]
  }],
  "superset_recommendations": [{"pair_id": "A.ss.1", "items": ["A.knee.1", "A.pull.1"], "minutes_saved": 6, "on": true}],
  "edits": [],
  "next_steps_key": "plan.next_steps",
  "checks": [{"id": "GEN-08.power_before_strength", "pass": true}, {"id": "R3-GEN-01.release_stamp", "pass": true}, {"id": "R3-SES-02.time_fit", "pass": true}]
}
```

IDs, category codes, groups and numbers in these examples are illustrative, not real catalog or engine output; the stairway labels and RIR follow `12_volume_algorithm_v1` v1.2 §3.7 and `06_periodization` v1.2 (3 % steps to week 6, 5 % from week 7, the last 4 weeks the hardest, R2-PER-04; RIR drift R3-VOL-04) and the 2 → 11 level (R2-PER-05); the exact time-check trimming comes from `12` v1.2 / `05` v1.2 (R3-SES-02). Reps are structured per set so the renderer can show pyramids exactly as the coach writes them (`12/10/8 -20`, `10/10` per side; PRG-07, UNI-01). `load_hint` is `{"type": "pct", "of": "tested_best", "value": [0.75, 0.8]}` only on a barbell main lift with a recent tested best (R2-GEN-06); on Olympic lifts it is always `{"type": "power"}` unless the profile is competitive Olympic weightlifting or a coach switched percentages on (`show_olympic_percentages`, N-PROD-20). `video.kind` ∈ `coach` | `approved_public` | `search` (R2-GEN-02). Block `kind` ∈ `warmup` | `core` | `athletic` | `olympic` | `strength` | `accessory` | `calves` | `finisher` | `cardio` (spec `plan_editing.block_kinds`).

**Edits** (applied on top of the generated plan by `applyEdits`; travel with the plan link and file; R3-SES-02):

```json
"edits": [
  {"op": "toggle_block", "block_id": "blk.B.athletic.1", "on": false, "scope": "block_weeks"},
  {"op": "remove_exercise", "slot_id": "C.accessory.2", "scope": "day", "week": 3},
  {"op": "add_exercise", "block_id": "blk.A.strength.2", "exercise_id": "reverse-pec-deck", "sets": 2, "scope": "block_weeks"},
  {"op": "add_block", "day_type": "B", "kind": "core", "position": "end", "items": ["side-plank"]},
  {"op": "superset", "pair_id": "A.ss.1", "on": false}
]
```

`scope` ∈ `day` (one week) | `block_weeks` (this day every week of the current exercise block, default). `op` ∈ `toggle_block` | `remove_exercise` | `add_exercise` | `remove_block` | `add_block` | `swap` | `superset` (spec `plan_editing.edits`).

**Check-in** (`checkin/*`): **RETIRED** (R3-VOL-02, R3-VOL-04). No check-in schema exists in v1.2; the spec keeps an empty `adaptation` stub only until the compiler stops reading it.

**Rule pack** (coach layer; one action per rule; a file the coach keeps):

```json
{"schema": "rulepack/1", "id": "coach-jdoe-2026-11", "author": "Coach J. Doe", "model_min": "1.2.0",
 "rules": [
  {"id": "youth-no-floor-oly", "when": {"all": [{"fact": "age", "op": "lt", "value": 15}]},
   "then": {"action": "exclude_tag", "tag": "olympic_from_floor"},
   "note_key": "rule.youth_no_floor_oly"},
  {"id": "tennis-unilateral", "when": {"all": [{"fact": "sport.sport", "op": "eq", "value": "tennis"}]},
   "then": {"action": "set_unilateral_share", "region": "lower", "value": 0.85}},
  {"id": "pickleball-athletic-off-after-play", "when": {"all": [{"fact": "activity.ids", "op": "contains", "value": "rec_pickleball"}, {"fact": "day.after_play_day", "op": "eq", "value": true}]},
   "then": {"action": "toggle_block", "block_kind": "athletic", "state": "off"}},
  {"id": "pickleball-core-superset", "when": {"all": [{"fact": "activity.ids", "op": "contains", "value": "rec_pickleball"}]},
   "then": {"action": "add_core_superset", "day_type": "B", "position": "end"}}
 ]}
```

Action vocabulary (closed list): `exclude_exercise`, `exclude_tag`, `exclude_equipment`, `prefer_exercise_in_slot`, `set_unilateral_share`, `set_muscle_weekly_range`, `cap_weekly_step`, `fix_weekly_step` (before the build; VOL-05), `add_slot`, `remove_slot`, `add_core_superset` (R2-SES-03), `move_block`, `set_rest`, `set_rep_range`, `pin_video_link` (R2-GEN-02), `show_olympic_percentages` (R2-GEN-06 / R2-ATH-05 coach opt-in, PROPOSED, N-PROD-20), `set_aerobic_sessions` (R2-SES-06), `toggle_block` (R3-SES-02, new), `recommend_superset` (R3-SES-02, new), `add_note`. Facts: intake fields, derived values, `week.n`, `week.phase`, `day.type`, `day.after_play_day`, `slot.category`, `block.kind`, `exercise.tags`, `activity.ids`, `focus_muscles`, `plan.time_check`.

**Video map entry:** `{"exercise_id": "leg-press", "status": "coach", "provider": "youtube", "id": "<VIDEO_ID>", "start": 12, "end": 34, "recorded_by": "blaze", "lang": "none"}`; with no entry the renderer builds the search link (E7).

**Release record (printed, not stored):** `{"text_version": "terms-release-client-en-0.1", "language": "en", "role": "client|coach", "accepted_at": "…", "plan_id": "…", "own_risk_terms_release": true, "health_route": "client_screen|coach_screen|coach_own_sop", "guardian": null}`; one per generation; stamped on the plan and printed on every export; Blaze Camp keeps no copy (R3-GEN-01).

**Consent record:** RETIRED (no data is collected, R3-GEN-01).

### E5 · Engine API and determinism

* `generate(intake, model, rulePacks, opts) → Plan` builds the whole plan once (refuses without the F46 tick for this generation, or with `health.outcome = refer`); v1.3: no time check runs; it returns the plan with its stairway record, `superset_recommendations`, block ids and kinds. · `applyPlanEdits(plan, edits[], model) → Plan` (v1.2 name `applyEdits`; totals recomputed, plan marked edited) (pure; edits never feed back into `generate`) · `explain(plan, slot_id) → reason keys` · `validate(plan) → checks[]` (for an edited plan: notes, not refusals). **`adapt()` is RETIRED** (R3-VOL-02, R3-VOL-04).
* Pure functions; seeded random only for tie-breaks (`seed` = hash of intake + model version); no clock reads inside the engine (dates come from the intake); **no network access** (R3-GEN-01).
* Rule precedence: locked > coach rule pack > Blaze defaults > client preference (client swaps cannot re-introduce an exercise a coach or locked rule excluded; the "add exercise" list obeys the same filter). Conflicts inside one layer: the more specific `when` wins; equal specificity → the later rule wins, and the coach UI flags it.
* Performance target: a 12-week plan in under 200 ms on a mid-range phone [INFERRED]; run in a Web Worker so the UI never freezes.

### E6 · The planned stairway (no feedback) [R3-VOL-04; replaces the v1.1 "weekly step implementation"]

> **Changed in v1.3** (COACH-CX CX-01; COACH-R4 R4-PRG-01, R4-PRG-02). λ is free, so every trained group reaches its final sets; there is no 7 % or 10 % limit; weeks that add more than about 15 % are noted. Kernel: `engine/progression/stairway.mjs`. Where the text below differs, the v1.3 section at the top of this file wins.

The engine math is owned by `12_volume_algorithm_v1` v1.2 §3.7 and §4; this is the product view of the same loop and must stay identical to it.

```
groups   = trained focus groups (v1.3: no time check, CT-01); rear delts inside shoulders (R3-VOL-01)
start[g] = level start x modifiers, floor 10 in a training block, + focus add (+1..+3) if g is a focus group (R3-SES-01)
plan_step[g][w] = lambda[g] x (3 % if w <= ceil(N/2) else 5 %)          # each group reaches its ceiling in week N (R3-VOL-04)
T[g] = start[g]                                                          # week 1
for w in 2..N:                                                           # no deload or maintenance week inside a block (R2-VOL-07)
  for g in groups:
    step = plan_step[g][w]
    if focus groups exist and g not in focus: step = min(step, 0.03)     # R2-VOL-06
    if age >= 60: step = min(step, 0.03)                                 # PROPOSED
    if mode in (maintenance, pre_season, in_season): step = 0            # flat (PER-01, R2-PER-06, R2-ATH-07)
    step = min(step, COACH_CAP, 0.07)                                    # coach rule pack, set before the build (VOL-05)
    T[g] = min(ceiling[g], T[g] x (1 + step))
    while T[g] - sets[g] >= 1:                                           # whole sets only (VOL-06)
      place one set in VOL-07 order, alternating the two exposures of the same day type (R3-VOL-03);
      a small-muscle extra becomes a short bonus exercise on the optional day, or on a day that already trains it,
      never as that day's only exercise for it (R3-VOL-03)
  v1.3: no rate limit; note the weeks that add more than about 15 % (CX-01; R4-PRG-02)
  planned effort of week w: 3 RIR -> 2 -> 1-2 -> 1 + intensifiers in week N, inside 1-3 (R3-VOL-04)
week N: end test if ticked; last page = plan.next_steps (R3-PER-01)
# nothing after the build changes T: no check-in, no effort rows, no readiness, no logbook (R3-VOL-02, R3-VOL-04)
```

All thresholds live in the rule tables and are coach-editable before the build. **RETIRED in v1.2:** the check-in rows read against the stairway, the effort-10 set removal, the repeat-the-week rule, the "block at risk" signals and the end-of-block prompt as an in-app choice (R3-VOL-02, R3-VOL-04, R3-PER-01); retired in v1.1: the life column, the `early_deload` triggers, the before-logs intake step and target-seeking.

### E7 · Renderers

* **Block view:** per training day, rows = the block's exercises, columns = weeks; cells = sets × reps (+ effort if the chip is on); stairway bar from the plan's `shape`; test weeks marked; switched-off blocks greyed. *(Retired in v1.3, COACH-CT CT-01: the "Not trained directly this block (time): …" line from `time_check`. A plan carries no `time_check`; what a template cannot hold is said in `meta.stairway[].capped`.)*
* **Week view and day view:** one component per block with its `block_id`, `kind` and switch (`toggle`, `on`); superset pairs grouped and labelled with his 'SUPERSET W/' wording (arrow emoji in his label not reproduced here); suggested pairs from `superset_recommendations` with the minutes saved and a switch; effort as RIR text with the RPE number; Olympic lifts with the power cue instead of a load unless `load_hint` is a percentage; rest; cue; video; remove (×) and "+ add exercise" in the day view (§14.5).
* **Video:** `coach` / `approved_public` → lazy iframe on tap (`youtube-nocookie.com`); `search` → a plain link `https://www.youtube.com/results?search_query=` + URL-encoded exercise name in the user's language (Spanish adds the English gym term), opened in a new tab; the C8 note under it.
* **Images:** block (per training day or whole block), week, day; rendered off-screen at full length; language, units, plan name, model version, the release stamp, the own-risk / not-medical-advice line (C14), the edit hint (C17) and the switched-off marks baked in at export time; never age, weight, pain or health answers.
* **Print / PDF:** block = one landscape page per training day; week = one page per week (Letter / A4 by region); instruction block with "How to adjust this plan" on page 1; the last page = `plan.next_steps` (C15); footer with model version, release stamp and C14.
* **XLSX (C1):** sheet `PLAN` with his columns WEEK / DAY / PURPOSE / CATEGORY / EXERCISE / SETS / REPS / WEIGHT USED or SCORE / EFFORT / HOW IT FELT? / DONE? + VIDEO + NOTES for the person's own logging (never read back); a hidden `LISTS` sheet for dropdown sources (his EFFORT menu with the C13 helper, HOW IT FELT?); release stamp, C14 and C17 in the header rows. Spike: confirm dropdowns and fills survive Google Sheets import.
* **Google Sheets (C2, optional Phase 2):** same layout via `batchUpdate`, into the user's own Drive.
* **Plan link:** `#p=` + base64url(deflate(plan/2 JSON incl. edits)) with personal fields removed (no age, weight, pain, health answers, intake); the part after `#` is never sent to the server. Long plans: the plan file instead (no server-side short links, R3-GEN-01).
* **Plan file:** the same JSON as `.blazecamp.json`; reopening it re-renders the plan (no new release tick; a rebuild asks for one).
* **ICS:** one event per training day with the day title; alarms for the test reminders (block start, 7 days before the end test, the day before).

### E8 · Storage: none [R3-GEN-01]

* Nothing is written to a server; there is no server. Nothing is written to the device by default: the plan lives in memory while the page is open (R3-GEN-01).
* The person keeps the plan in what they export: images, PDF, sheet, plan link, plan file; optionally an answers file (`.blazecamp-answers.json`) to rebuild the next block. These are the person's files; Blaze Camp never receives them.
* Optional, only if the coach says yes (N-PROD-21): one "keep this plan on this phone" slot, off by default, cleared with one tap, never synced, never holding health-check answers.
* **RETIRED from v1.1:** IndexedDB `{intake, checkins[], swaps, logs, rulePacks, release_log[]}`, the backup code and QR, v2 sync, the server-side release log.

### E9 · i18n details

* Keys are stable IDs (`exercise.leg-press.name`, `cue.leg-press`, `why.hinge_with_push`, `edit.hint`, `time.too_short`, `plan.next_steps`, `release.client`, `release.own_risk`, `sports.swimming.name`, `activity.rec_pickleball.name`, `intake.focus.label`). The plan never stores text.
* Spanish exercise names carry an optional `gym_term` shown in brackets (R2-GEN-08).
* Legal namespaces (`health`, `release`, `terms`, `warn`, `privacy`) carry a `text_version` per language, come from the lawyer-approved versions of `DISCLAIMER.md` / `DISCLAIMER.es.md`, are legally equivalent in both languages (R3-GEN-01) and are only editable through the legal review workflow.
* CI check: every key present in `en` must exist in `es` or be listed in `es/_missing.json`; the build fails if a new English key has no entry in either; legal keys may never fall back silently.
* Number, date and unit formatting through `Intl`; lb / kg conversion at render time.
* Retired keys (v1.1): `checkin.*`, `intake.output_mode.*`, `intake.email.label`, `intake.priority.*` (→ `intake.focus.*`), `maint.end`, `block.cannot_finish`, `block.done` (→ `plan.next_steps`).

### E10 · Tests (golden plans + invariants from the coach's answers)

Golden: the coach-graded plans (R2-GEN-07: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs; plus the pickleball gen-pop bonus) as snapshots; any diff needs review.

Invariants (property tests over thousands of random intakes):

| Invariant | Source |
|---|---|
| No plan without the F46 tick (own risk + terms + release) for that generation; the release stamp (text version, role, date, health route) and the own-risk line on the plan and every export | R2-GEN-03, R3-GEN-01 |
| Client door: any refer answer → no plan; the coach skip exists only in coach mode | R2-GEN-03, R3-GEN-01 |
| No lifestyle field (sleep, stress, job, life) and no check-in or tracking field in the intake; `generate` reads nothing after the build | R2-GEN-04, R3-VOL-02, R3-VOL-04 |
| The engine makes no network call; share links, plan links, images and exports never contain age, weight, pain or health answers | R3-GEN-01 |
| No deload or maintenance week inside a block; maintenance only when the person builds it; the easy week between blocks is a recommendation on the last page | R2-VOL-07, R2-PER-06, R3-PER-01 |
| On every trained group the planned weekly sets follow the stairway: about 3 % steps to the halfway week, about 5 % after, never down inside a block (except pain cuts), the planned final sets in the last week (one week early at most). **v1.3:** steps may be faster when the final sets need it, a week that adds more than about 15 % carries a note, and a week may keep the same sets while reps or load progress ("never flat" is retired) | R2-PER-03, R2-PER-04, R3-VOL-04; COACH-CX CX-01, CX-02; COACH-R4 R4-PRG-01, R4-PRG-02 |
| Planned RIR: 3 → 2 → 1-2 → 1 + intensifiers in the last week, always inside 1-3 | VOL-13, R3-VOL-04 |
| ~~Time check~~ **RETIRED in v1.3 (CT-01); the test is now: no plan carries a session length, a minute limit, a time check or a time offer.** v1.2: when days × minutes cannot hold the minimums, the plan carries the offer; with the time kept, every trained group meets its floor and climbs, the rest are listed as not trained directly, superset suggestions are on; never 2-4 exercises per group squeezed into a day that cannot hold them | R3-SES-02 |
| Floors counted on focus groups (hips = glutes + hamstrings; shoulders = front + side + rear delts): every trained group ≥ 10 weekly sets in a training block with 3 or more training days; on 2 days every big group ≥ 6 (v1.3, R4-SES-03) (exempt: maintenance, pre-season, in-season, pain cuts, athletes' credit-only groups, groups the plan says its template cannot hold) | R2-VOL-06, R3-SES-01, R3-VOL-01 |
| Focus muscles: at most 2; each gets +1 to +3 weekly sets over the balanced plan and climbs with the stairway; no sex field anywhere | R3-SES-01, GEN-02 |
| Added sets alternate between the two exposures of the same day type; a small-muscle extra is never the only exercise for that muscle on its day | R3-VOL-03 |
| Every block has a stable id and kind; core, athletic, Olympic, accessory, calves, finisher and cardio blocks carry switches; `applyEdits` is pure and reversible ("Reset" restores the generated plan); edits never reach `generate` | R3-SES-02 |
| The "add exercise" list never offers excluded exercises (bands, V-squat, 60+ or racket-50+ power work without the switch, pain exclusions) | R3-SES-02, EQ-01, GEN-08, R3-ATH-02 |
| No band, chain or weight-releaser exercise, and no band substitute, appears anywhere | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12 |
| v1.3: every trained group reaches its planned final sets in the last week (one week early at most); a week that adds more than about 15 % carries the note; every lift carries its progression rule. *(Retired: planned step never above 7 %; total weekly sets rise < 10 %.)* | COACH-CX CX-01; COACH-R4 R4-PRG-01, R4-PRG-02, R4-PRG-03 |
| Helper credit 0.25; dips 0.5 / 0.5; thruster 1.0 quads / 0.5 shoulders / 0.25 glutes; KB swings credit no muscle; 10/10 counts 1 set; athletic sets and HYROX station circuits credit no muscle | VOL-09, LIB-16, R2-VOL-05, UNI-01, VOL-10, R3-ATH-03 |
| Core block first and light unless moved; never left out by the generator (the person may switch it off) | ATH-11, R2-SES-03, GEN-08, R3-SES-02 |
| Power / Olympic before strength; horizontal pull before vertical pull; the day's main lift before accessories | ORD-03, ORD-01, ORD-02, GEN-08 |
| Hip dominant paired with push, knee dominant with pull | UNI-11, ORD-06 |
| Heavy (axial) squat and heavy (axial) deadlift on two different days, at most one of each per week; other days non-axial | R2-SES-01, R2-SES-02 |
| No V-squat; no heavy compound prescribed to failure | GEN-08 |
| 60+: landing drills, balance, quick stepping, light medball throws, fast machine work on; no ankle hops, other jumps, Olympic lifts or depth jumps unless switched on (warning shown); never overhead or low-bar squats. Pickleball, padel and tennis players from 50 (60+ included): knee-friendly strength, calf / Achilles work every leg day, rotator-cuff work, low-impact jumps only unless switched on (50-59: the racket switch; 60+: the older-adult switch). Clients in pain: no overhead squat, snatch, low-bar squat or depth jumps | R3-ATH-02, R2-ATH-08, EQ-03 |
| Swimming: 3 gym days + 1 optional by default (2 for younger or lower-level swimmers), 0 extra cardio, jumps mostly ballistic (25 % plyometric at the end of a block), Olympic lifts 2-3 days, shoulder care every session without bands, dryland taper lined up with the meet | R3-ATH-01 |
| HYROX: 2 strength + 2 hybrid days, 4 cardio sessions, 2 station circuits a week as finishers, wall ball ≤ 20 lb, 40-rep / AMRAP sets only inside the circuits, 50 % plyometric | R3-ATH-03 |
| Stay-active play days: the hardest gym day ≥ 48 h before the biggest play day; 3+ play sessions → no extra agility drills, half the jumps; 45-60+ min play sessions count as cardio (up to 2 of 3); event date → hardest weeks end 1 week before, then 1 easy week at about half the sets | R3-ATH-05 |
| No percentage load on an Olympic lift unless the profile is competitive Olympic weightlifting, or a coach switched percentages on for an athlete whose own tested best on that lift exists | R2-GEN-06, R2-ATH-05 |
| Olympic lifts up to 4 slots a week; clean-family lifts on squat-pattern days, snatch-family lifts on hinge days; full squat cleans and snatches 3-5 reps per set; in season a light piece, dropped in heavy game weeks | R2-ATH-04, R2-ATH-05 |
| In-season game-heavy sports (since round 3 also lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball): the one hard gym day at least 48 h before a game day; gym plyos about half | R2-ATH-07, R3-ATH-04 |
| Youth: Olympic lifts from the floor only from about 14 and after one block of hang work | R2-ATH-08 |
| No 1-rep max or all-out mile test for anyone not coming off a completed training block; tests only before or in week 1 and in the last week, never in the middle | R2-PER-07 |
| No '21.6 mile run' in any plan or test | R2-LIB-06 |
| No medball in the main work for aesthetics / bodybuilding goals; no medball or wall ball above 20 lb | ATH-05, EQ-06, R3-ATH-03 |
| Calves one exercise × 3 sets on every leg day; about 2 core exercises a day as generated | VOL-17, R3-SES-01 |
| Exercise count per session: resistance-only about 5-7 (8-9 at 75-90 min); field athletes up to 12 + the 2-exercise core block with 2-4 exercises for each group trained that day; full-body days 2-4 exercises per group trained that day, never 1; field athletes use the cross pattern by default and the same-pattern athletic template when size-focused or high-level | VOL-08, R2-SES-04, R2-SES-05, R3-SES-01 |
| Same exercises inside a block; between blocks only one-detail variations, never invented exercises | PER-02, R2-LIB-01 |

### E11 · Analytics and learning pipeline: RETIRED [R3-GEN-01]

No page analytics with personal fields, no opt-in events, no research data, no learning from users. Model changes come from the coach's reviews and are released as new model versions with a changelog. A cookieless page counter with no personal data is possible only if the coach says yes (N-PROD-23).

### E12 · Build estimate breakdown (developer-weeks, INFERRED)

| Work package | Low | High |
|---|---|---|
| Model compile tool + coach-answer patches (rounds 1-3) + schema validation | 1 | 1.5 |
| Engine: level, stairway, groups and floors, focus muscles, ~~time check~~ (retired in v1.3, COACH-CT CT-01), week layout, slots, sets allocation, exercise choice, reps / effort / rest, order, maintenance, checks | 4 | 5.5 |
| Engine: edit layer (`applyEdits`, block ids and kinds, switches, superset recommendations, re-timing, reset) | 0.5 | 0.75 |
| Engine tests: golden plans + invariants | 0.5 | 1 |
| Intake screens (few-click flow, branching, focus muscles, ~~time check~~ (retired in v1.3, COACH-R4 R4-SES-01), play days / event date) | 1.25 | 1.75 |
| Sport and activity picker (search, positions, EN / ES names, "not listed") | 0.25 | 0.5 |
| Health check, coach skip, own risk + terms + release flow, printed stamp | 0.5 | 0.75 |
| Block / week / day views with show chips, exercise sheet, swaps, video links | 2 | 2.25 |
| Plan editing UI (switches, add / remove exercises or blocks, superset switches, reset, notes) | 1 | 1.5 |
| Block / week / day images, print CSS, share sheet, plan link and plan file, ICS with alarms | 1.5 | 2.25 |
| XLSX export + Google Sheets import spike | 0.5 | 1 |
| i18n plumbing, unit switch | 0.5 | 1 |
| **Phase 1 (MVP) total** | **13.5** | **19.75** |
| Open-source prep (README EN / ES with the own-risk notice, docs, CI; `LICENSE` and the disclaimers already exist) | 1 | 2 |
| Coach tools without accounts (rule-pack editor, answers files), Olympic weightlifting program type, optional Drive export | 4 | 7 |
| **Phase 2 total** | **5** | **9** |

(The main text rounds these: MVP about 13.5-20 weeks, Phase 2 about 5-9 weeks. Retired from v1.1: the Option B increment (check-in, adapt, logbook, progress, PWA backup code; 3.5-5 weeks) and v2 accounts, sync, consent and research pipeline (8-12 weeks).)

---

## References

**Coach and team sources (v1.2).** `coach_answers_round3.md` (R3-VOL-01 to R3-VOL-04, R3-SES-01, R3-SES-02, R3-PER-01, R3-ATH-01 to R3-ATH-05, R3-GEN-01; read in full); `DISCLAIMER.md`, `DISCLAIMER.es.md` and `LICENSE` (read; referenced, not rewritten); `generator_spec_v1.json` 1.2.0 (`inputs_schema` intake/3, `plan_editing`, `legal_and_privacy`, `output`); engine code read for the compile check (`tools/compile-model.mjs`, `tools/compile/i18n.mjs`, `tools/fixture/build-fixture.mjs`). v1.1 sources: `coach_answers_round2.md` (R2-GEN-01 to R2-GEN-08, R2-VOL-01 to R2-VOL-08, R2-SES-01 to R2-SES-06, R2-ATH-02, R2-ATH-04, R2-ATH-05, R2-ATH-07, R2-ATH-08, R2-LIB-01, R2-LIB-04 to R2-LIB-08, R2-PER-01 to R2-PER-07, LIB-10); `coach_answers_full.md` (GEN-01 to GEN-08, PER-01 to PER-03, PER-05 to PER-07, VOL-01 to VOL-10, VOL-13, VOL-17, UNI-01, UNI-05, UNI-08 to UNI-11, ATH-03, ATH-05, ATH-09, ATH-11, ATH-13, ORD-01 to ORD-06, ORD-10, EQ-01, EQ-03, EQ-06 to EQ-08, EQ-10, EQ-12, EQ-14, LIB-07, LIB-09, LIB-16, PRG-01, PRG-03, PRG-05, PRG-07, PRG-08, FIX-03, FIX-04); the coach's chat request of 2026-10-08 (popular US sports, swimming, pickleball, "high rows", "stay athletic and active"); `BLAZE_CAMP_BRAIN.md` §3.5, §13, §14, §16; `generator_spec_v1.json` 1.1.0; `synthesis/sports/*.json` (in progress; `team.json` read for the picker ids) and `04_profiles.json`; `12_volume_algorithm_v1.md` v1.1 §3.7-§5 and `06_periodization.md` v1.1 §6-§7 (stairway, check-in reading, block flow, tests); `02_exercise_catalog.json` (video counts, computed 2026-10-08); BYOP dump `04_JUSTICE_LEAGUE.columns.txt` (row 2 column headers).

**SCIENCE.**
1. Saw AE, Main LC, Gastin PB (2016). Monitoring the athlete training response: subjective self-reported measures trump commonly used objective measures: a systematic review. *British Journal of Sports Medicine* 50(5):281-291. https://dro.deakin.edu.au/articles/journal_contribution/Monitoring_the_athlete_training_response_Subjective_self-reported_measures_trump_commonly_used_objective_measures_A_systematic_review/20899435
2. Foster C, et al. (2001). A new approach to monitoring exercise training. *Journal of Strength and Conditioning Research* 15(1):109-115. https://paulogentil.com/pdf/A%20New%20Approach%20to%20Monitoring%20Exercise%20Training.pdf
3. Graham T, Cleather DJ (2021). Autoregulation by "repetitions in reserve" leads to greater improvements in strength over a 12-week training program than fixed loading. *Journal of Strength and Conditioning Research* 35(9):2451-2456. https://consensus.app/papers/details/212e6b63eb3d51a0bbef6438e4b931a7/
4. Zhang X, et al. (2021). Auto-regulation method vs. fixed-loading method in maximum strength training for athletes: a systematic review and meta-analysis. *Frontiers in Physiology*. https://consensus.app/papers/details/c076828ab8f551c3b19a805b31fc7e76/
5. Hickmott LM, et al. (2022). The effect of load and volume autoregulation on muscular strength and hypertrophy: a systematic review and meta-analysis. *Sports Medicine - Open*. https://consensus.app/papers/details/0e6bb3b98d875b1392222cf931190cb8/
6. Helms ER, et al. (2020). Methods for regulating and monitoring resistance training. *Journal of Human Kinetics*. https://consensus.app/papers/details/4250e509fa9f5444a814e328eee94373/
7. Michie S, et al. (2009). Effective techniques in healthy eating and physical activity interventions: a meta-regression. *Health Psychology* 28(6):690-701. https://consensus.app/papers/details/54020d3f4060526cb5b03286d506b12f/
8. Eckerstorfer LV, et al. (2018). Key elements of mHealth interventions to successfully increase physical activity: meta-regression. *JMIR mHealth and uHealth*. https://consensus.app/papers/details/4d3c2798b0a6514db2594881e7704c4a/

**RESEARCH (accessed 2026-10-08).**
* PAR-Q+ official site (copyright "PAR-Q+ Collaboration ... All rights reserved"; use official, unmodified versions; online version available; translations listed without Spanish): https://eparmedx.com/ ; PAR-Q+ publications: https://hfjc.library.ubc.ca/index.php/HFJC/issue/view/9
* Clickwrap enforceability (affirmative unticked "I agree", records of who, when and which version; ESIGN / UETA): https://www.sirion.ai/library/contract-management/clickwrap-agreement/
* Parent-signed waivers for minors (enforceability varies by state; many states reject them): https://ottersign.com/blog/can-minors-sign-waivers/ ; https://sportslitigationalert.com/?p=13143 ; https://www.superlawyers.com/resources/personal-injury-plaintiff/liability-waivers/
* SFIA participation (pickleball fastest-growing US sport four years running, 19.8 million players in 2024): https://sfia.org/research/u-s-pickleball-participation/ ; https://www.sportstravelmagazine.com/sports-fitness-industry-association-releases-2025-topline-participation-report
* HYROX format (8 × 1 km runs each followed by a workout station; open, pro, doubles divisions): https://us.puma.com/us/en/articles/what-is-hyrox
* RP Hypertrophy app (feedback on pump, soreness, workload; pricing): https://rpstrength.com/hypertrophy-app
* JuggernautAI individualisation and readiness: https://help.jtsstrength.com/en/articles/3-how-juggernautai-is-individualized-to-you ; https://garagegymreviews.com/juggernautai-review
* Volt Athletics (Cortex, sport and position programs, coach platform): https://voltathletics.com/training-app ; https://voltathletics.com/coach-platform
* Fitbod (adaptation, pricing 2026): https://www.sensai.fit/blog/fitbod-review-2026 ; https://tooldirectory.ai/tools/fitbod
* Boostcamp (free coach programs, Pro pricing): https://boostcamp.app/free-workout-app
* TrueCoach pricing and printing programs: https://www.quickcoach.fit/truecoach-pricing-2026.html ; https://help.truecoach.co/en/articles/2393507-printing-a-program
* TrainHeroic pricing and marketplace: https://www.fitbudd.com/post/how-much-does-trainheroic-cost ; https://www.trainheroic.com/grow/
* Liftosaur (AGPL-3.0 PWA, Liftoscript): https://github.com/astashov/liftosaur ; https://www.liftosaur.com/doc/liftoscript
* wger (AGPL-3.0 workout manager, REST API): https://wger.readthedocs.io/en/2.4/
* free-exercise-db (Unlicense, 800+ exercises JSON): https://github.com/yuhonas/free-exercise-db
* Google Sheets API scopes (drive.file non-sensitive): https://developers.google.com/workspace/sheets/api/scopes ; spreadsheets.create: https://developers.google.com/sheets/reference/rest/v4/spreadsheets/create
* Force-copy links for Google Sheets: https://infoinspired.com/google-docs/spreadsheet/share-google-sheet-files-on-copy-mode
* ExcelJS (MIT; data validation, conditional formatting; browser): https://cdnjs.com/libraries/exceljs
* PDF generation approaches in the browser vs server: https://www.nutrient.io/blog/javascript-pdf-libraries/
* PWA on iOS (storage, push, install): https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide ; WebKit 7-day storage cap and home-screen exemption: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
* Cloudflare Pages limits: https://55041f86.previews.developers.cloudflare.com/pages/platform/limits/index.md ; GitHub Pages limits and commercial-use note: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
* Supabase pricing 2026: https://makerkit.dev/blog/saas/supabase-pricing ; https://toolradar.com/blog/supabase-pricing-2026
* i18next vs FormatJS: https://www.locize.com/blog/react-intl-vs-react-i18next
* json-rules-engine: https://npmjs.com/package/json-rules-engine
* YouTube privacy-enhanced embeds: https://axbom.com/embed-youtube-videos-without-cookies/ ; https://www.stefanjudis.com/blog/the-lie-of-youtubes-privacy-enhanced-embed-mode
* Licences: https://choosealicense.com/licenses/ ; Creative Commons and databases: https://wiki.creativecommons.org/4.0/Sui_generis_database_rights ; trademarks and forks: https://NLnet.nl/NGI0/bestpractices/Forking_and_Trademarks.pdf ; https://www.theregister.com/2011/01/11/hudson_renamed_jenkins/
* Health-data rules: FTC Health Breach Notification Rule (2024): https://jonesday.com/en/insights/2024/07/ftc-issues-final-health-breach-notification-rule ; Washington My Health My Data Act and fitness apps: https://terms.law/washington-mhmda-for-fitness-apps/ ; GDPR Article 9 health data consent: https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data ; amended COPPA rule (2025): https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule ; https://www.loeb.com/en/insights/publications/2025/05/childrens-online-privacy-in-2025-the-amended-coppa-rule

---

## History: v1.1 (2026-10-08), superseded where v1.2 says so

Kept for the record. Everything about the weekly check-in, tracking levels, the logbook, accounts, consented data, Apache-2.0 / CC BY 4.0 and phase 1.1 in this History section is RETIRED by round 3 (R3-VOL-02, R3-VOL-04, R3-GEN-01).

### v1.1 - round 2 applied (2026-10-08)

What changed from v1 (each change is applied in the tables, examples and contracts below, not only listed here):

| # | Change | Source |
|---|---|---|
| 1 | The product direction is **approved**: a phone-friendly website first (plan, images, PDF, sheet download), then the weekly check-in, then open source (Apache-2.0 code, CC BY 4.0 model; his videos, cues and the Blaze Camp name stay his). Status of §0, §5, §6 and §8 moved from PROPOSED to APPROVED where he approved it. | COACH-R2 R2-GEN-02 |
| 2 | **Fewest clicks, phone first, macro views.** New §14: Block / Week / Day views with one toggle and "show" chips; save the **whole 12-week block** or **one week** (or one day) as an image to send; coaches open on the block view, clients on today. | R2-GEN-02 |
| 3 | **Videos are optional.** No launch blocker: each exercise has a "Watch how" link that opens a YouTube search; Blaze Camp videos replace the link as they are filmed; a "send us your video" contact placeholder. §7.3 rewritten. | R2-GEN-02 |
| 4 | **Start flow: health check, coach bypass, liability release.** New §12: clients go through a PAR-Q-style health check; coaches choose "run the check with my client" or "skip, I follow my own onboarding" with a legal warning; **everyone accepts a liability release every time they get a plan**. Copy text placeholders in EN / ES, all marked for legal review. | R2-GEN-03 |
| 5 | **No lifestyle questions anywhere.** The intake "your usual week" field (sleep, stress, hard job / other sport; v1 F42) is removed, and the check-in loses "How was life this week?". The weekly step is decided from **effort, sessions completed and pain** only; the approved step table is kept without its life column (§2.3). | R2-GEN-04 overrides the life column of R2-VOL-01 |
| 6 | **No check-in = the plan does not change.** Without a check-in the next week is exactly the planned week of the stairway ("there is no data to go off of"). | R2-VOL-03 |
| 7 | **Effort 10 = "the max I could do, and I made it"**, not a fail. A failed exercise is logged with his own HOW IT FELT option "Couldn't do it". | R2-VOL-02 |
| 8 | **No deload or maintenance week inside a block.** The check-in no longer triggers early deloads; when a block cannot be completed the tool offers: stop the block → maintenance phase (length chosen, extendable) → a whole new block. At the end of maintenance it asks: keep maintaining / change plan / start a training block. | R2-VOL-07, R2-PER-06 |
| 9 | **Every plan is a stairway** (small steps first, a bit bigger after the halfway point, the hardest weeks last). The v1 acclimation and 8-week "start hard" caps are gone from the product screens; the exact stairway math lives in `12_volume_algorithm_v1` v1.1 and `06_periodization` v1.1, and the check-in rows are read against it (§2.3, E6). | R2-PER-03, R2-PER-04, R2-PER-05 |
| 10 | **Sport picker covers every popular US sport with positions, swimming included**, and a new top-level goal **"Stay athletic and active"** (pickleball, padel, tennis, golf, HYROX, rec leagues, running, hiking, skiing and more). New §13. Profiles are being written in `synthesis/sports/` and merged into `04_profiles.json` v1.1; ids here are provisional until that merge. | COACH-CHAT 2026-10-08; R2-GEN-05 |
| 11 | **Competitive athletes**: next season start date (or "in season until", or a competition date) **plus practice days and game days** per week, both required. | R2-GEN-05 |
| 12 | **Weight guidance**: reps-in-reserve words with the RPE number beside them and a week-1 tip; percentages only where a recent tested best exists; **Olympic lifts explained as power output**, with no percentages by default (competitive Olympic weightlifters are their own program type; a coach opt-in for one tested lift is PROPOSED, N-PROD-20). New §15. | R2-GEN-06, R2-ATH-05 |
| 13 | **Spanish approved**: neutral Latin American Spanish, English gym term in brackets, every line approved by him or a coach he trusts; pounds in the US, kilograms elsewhere, switchable. | R2-GEN-08 |
| 14 | **Sample plans he will grade** changed to seven: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs (Phase 0, §6). | R2-GEN-07 |
| 15 | Smaller product consequences: cardio sessions adjustable up or down by the user (R2-SES-06); the gen-pop year fully tunable in the year view (R2-PER-01, R2-PER-02); maintenance length chosen and extendable (R2-PER-06); tests before or in week 1 and at the end only, safe test choices for untrained people (R2-PER-07); 60+ clients get no Olympic lifts, plyos or depth jumps by default, with an opt-in and a warning (R2-ATH-08); core supersets can be added anywhere in coach edit mode (R2-SES-03); 'NO ACCESS' = a self-serve version without coach access (R2-LIB-08). | as listed |
| 16 | Build estimate updated for the new screens (health check and release, macro views and block image, sport and activity picker): MVP about 11-16 developer-weeks, check-in +3.5-5 (§9, E12). | INFERRED |

### v1.1 verification log

Adversarial check of the r2-product update (this file and `generator_spec_v1.json` > `inputs_schema`, `adaptation`, `output`, `_meta.version` = 1.1.0), 2026-10-08. Read in full first: `coach_answers_round2.md`; then this file, the three spec parts, `12_volume_algorithm_v1.md` v1.1 §3.7-§5, `06_periodization.md` v1.1 §6-§7, `synthesis/sports/team.json`. Backups of both files before the fixes are in the session scratchpad. JSON edited and re-validated with the project venv; only `_meta`, `inputs_schema`, `adaptation` and `output` changed in the spec.

**Verdict.** The round-2 product answers were applied in the body, not only in the changelog, and the intake, check-in and copy carry no lifestyle input. Four real defects were found and fixed: (1) the check-in step table used absolute +7 / +5 % in every week and its worked example contradicted the stairway math in 12 v1.1 / 06 v1.1 (early weeks are one notch smaller); (2) Olympic-lift percentages were described three different ways (C10 vs §15 vs `output.weight_guidance` / E10); (3) the "untrained" test rule was narrower than the coach's words ("If they haven't finished a block of training ..."); (4) the plan-shape labels in E4 put the bigger steps at weeks 5-8 instead of from week 7. Several smaller gaps were closed (below). Leftovers that sit outside the parts this step may edit are listed for the master step, not edited.

#### Round-2 answers relevant to these files: where each is applied

| ID | Status | Where (this file / spec) |
|---|---|---|
| R2-GEN-01 | OK | §2.1-2.2, S22; F43, `adaptation.modes` |
| R2-GEN-02 | OK | §0, §3.1, §7.3, §14; `output.views/renderers/videos`. No "video for every exercise" requirement left (GEN-06 marked as softened) |
| R2-GEN-03 | OK; FIXED | §12, S1, S10, C0-C6; F39, F45, F01, F46. "Fainting" in the approved heart item now marked as our PROPOSED addition (§12.2, F01 tag) |
| R2-GEN-04 | OK | no sleep / stress / job / life field in the intake (F42 removed), the check-in (life question removed) or the step (life column removed). The life-column resolution is flagged in §2.3 and `adaptation.step.resolution_flag` |
| R2-GEN-05 | OK; FIXED | §13.2; F14, F15. Example 1 (college swimmer) moved from "next season starts in January" to a championship meet date, because college swimming is in season from about October to March |
| R2-GEN-06 | FIXED | §0, §15, C9, C10, E4 `load_hint`, E10; `output.weight_guidance`, `plan_schema`, copy. Olympic lifts: no % by default, even with a tested max; competitive Olympic weightlifting is its own program type; a coach opt-in for one tested lift is PROPOSED (N-PROD-20, rule action `show_olympic_percentages`) |
| R2-GEN-07 | OK | §6 Phase 0, E2, E10 golden plans (7 plans) |
| R2-GEN-08 | OK | §7.4, E9; F00, F06. New copy (C15, the "also play" link, F26b gate) written in neutral Latin American Spanish with the English term in brackets |
| R2-VOL-01 | FIXED | §2.3 table, rules, worked example (recomputed), E6; `adaptation.step` now has `read_against_stairway` (the engine reading, same as 12 v1.1 §3.7.3) and `table_as_approved` (his numbers = the late half) |
| R2-VOL-02 | OK; FLAG | effort 10 = "the most I could do, and I made it" everywhere (Q2 helper, C13, S18, `checkin_schema`); the fail answer is his "Couldn't do it". 12 v1.1 proposes a separate 'Failed' answer with different handling: N-PROD-19 |
| R2-VOL-03 | OK; FIXED | §2.2-2.3, E5, E6, E10; F43, `adaptation.no_checkin`. Now stated for week-by-week too; F17 no longer feeds a "before-logs step" |
| R2-VOL-04, R2-VOL-06 | OK; FIXED | floor 10 and customizable caps (§7.2 layer 2), pro level (§7.2 layer 3); E10 floor invariant now lists the exceptions (maintenance, pre-season, in-season, pain cuts, athletes' credit-only muscles) and the rear-delt reading (flag kept). F25c re-tagged R2-VOL-06 (approved) |
| R2-VOL-05 | OK in this file | §7.2 layer 1, E3, E10. The spec's `rule_tables.counting` still credits KB swings to glutes: handed to the master step |
| R2-VOL-07 | OK; FIXED | §2.3, S20, S22, C12; `adaptation.block_cannot_be_finished`. The offer signals now match 06 / 12 v1.1 (added "effort 9-10 two weeks" and "under half the sessions two weeks"); the completed-block choice (easy week + next block × 1.05 / cap + 1, maintenance, or change plan) added: §2.3, S20, C15, `adaptation.block_end` |
| R2-VOL-08 | OK; FIXED | default marked for round 3 (§2.3, E6, E10); the no-optional-day placement now matches 12 v1.1 §3.9 (a day already training that group, never a lone exercise) |
| R2-SES-01, R2-SES-02 | OK; FIXED | §7.2, E10; the day sketch now shows Monday as the heavy squat day (it paired a clean with a trap-bar deadlift) |
| R2-SES-03 | OK | S9, §7.2, E4 rule action `add_core_superset`, E10; F44 note |
| R2-SES-04 | OK | E10 |
| R2-SES-05 | OK; FIXED | E10 ("never 1"); S5 and F24 now tell the user when full-body days need longer sessions and offer longer sessions / more days / a split |
| R2-SES-06 | OK | S9, S12, §14.1; F44 `cardio_adjust` |
| R2-ATH-02 | FIXED | the day sketch labelled a box jump "PLYO"; it is a ballistic jump |
| R2-ATH-04 | FIXED | E10 invariant added: up to 4 Olympic slots a week, clean family on squat days, snatch family on hinge days; sketch note |
| R2-ATH-05 | OK; FIXED | §15 (3-5 reps, coach's eye on speed); % rule reconciled with R2-GEN-06 |
| R2-ATH-07 | FIXED | E10 invariant added (hard gym day ≥ 48 h before a game from F15) |
| R2-ATH-08 | OK; FIXED | C7, S9, §7.2, §7.6; F02, F44. Youth floor-Olympic invariant added to E10 |
| R2-LIB-01 | OK | §2.3 swaps, §14.2, E10 |
| R2-LIB-04, -05, -07, LIB-10, LIB-12 | OK | E3 compile patches |
| R2-LIB-06 | OK; FIXED | §13.2, E3; E10 invariant added |
| R2-LIB-08 | OK | §1.1 PRG-01, `output.tiers` |
| R2-PER-01, R2-PER-02 | OK; FIXED | S16; F25 `year` now marked for non-competitive goals only (athletes follow their season) |
| R2-PER-03, R2-PER-04, R2-PER-05 | OK; FIXED | E4 shape labels corrected (small steps 1-6, bigger 7-8, hardest 9-12, `level_by_week` 2 → 11); block view and day sketch show the level; C9 and §15 say the reps in reserve follow the week of the stairway; F25c no longer quotes "start at a 2 and end at an 11" for a set step |
| R2-PER-06 | OK | S6, S20, C11; F25d; pre-season in §13.2 and F14 |
| R2-PER-07 | FIXED | S6, §1.2, §7.6, E10; F26b `untrained_rule` + `one_rm_gate`: no 1RM or all-out mile without a completed block (the coach's words), 1RM only for intermediate and up at the end of a completed block or after "I just finished a training block" (PROPOSED) |
| Coach chat 2026-10-08 (sports, swimming, pickleball, HYROX) | OK; FIXED | §13, F07, F11, F11r. Swimming present in depth (event group + main stroke; first sample plan). Picker rows mapped to the ids of `team.json`, `aquatic-endurance-track.json` and `combat-strength-fitness.json` (`profiles_v1_1`); padel has no profile yet (routes to pickleball / tennis); lacrosse men's / women's; rugby sevens; rec league adds hockey and ultimate; **added** figure skating, competitive dance / drill, fencing, badminton / squash / racquetball / table tennis, bowling (common US school and college sports missing from the research lists; `routes_to` placeholders until profiled); an "I also play something" link under the fat-loss and general goals so gen pop sees pickleball and HYROX as an option (PROPOSED). "High rows" = HYROX stays INFERRED, to confirm |

#### Leftover grep (patterns: acclimation, start hard, target-seeking, deload, life / sleep / stress, effort 10 = fail, KB swing, 1-exercise-per-muscle, Olympic once a week, mid-block test, 1RM from zero, mandatory video)

* **This file:** every remaining hit is a retirement or a negation ("no deload inside a block", "never mid-block", "KB swings credit no muscle", "videos optional", "no lifestyle questions", "retired: target-seeking"). No live leftover.
* **Spec, parts edited here:** same; the only hits are `removed_fields`, `retired`, `retired_v1`, the life-column flag and F17's PRG-05 "get acclimated" quote (a level rule, now labelled as such).
* **Spec, parts this step may not edit (left unchanged, listed in `_meta.v1_1_changelog[0].pending_cross_refs` for the master step):** `rule_tables.counting` KB swings glutes 1.0; `rule_tables.rate_engine` readiness L (sleep / stress), `planned_rate_before_logs` (lifestyle items, target-seeking, 3-tap question), `phase_limits` C12 acclimation 3 % and C8 weeks 1-4 5 %, gate "hold 2 weeks → deload", `checkin_step_table` life columns and "10 = failed", `hard_ceiling` deload exemption; `rule_tables.learning.log_schema` sleep / stress / energy; `plan_types` fixed_12 acclimation cap, fixed_8 "start hard", deload triggers, week_by_week "deload on triggers"; `tests.when` and `tests.catalogue` (never from zero); `derived_values.D12_before_logs_step`; `pipeline[1]`, `pipeline[6]`; `validation_checks` V1 / V5; `coach_rule_hooks`. The original list sent several of these to "the volume step" or "the periodization step", but those steps do not edit the spec; they are now addressed to the master step.

#### Cross-file notes (not edited here)

* `12_volume_algorithm_v1` v1.1 proposes an optional separate 'Failed' answer; this file uses his "Couldn't do it" (N-PROD-19). One of the two must change once he answers.
* `06_periodization` v1.1 still names the first stairway phase "ACCLIMATION" (a label; its step cap is retired). The product shows "small steps / bigger steps / hardest weeks".
* Week-by-week: 06 v1.1 adds a recovery week after every 12-week stairway, 12 v1.1 shows the end-of-block prompt; this file shows both as the "block done" choice with the easy week as the default.
* `synthesis/sports/aquatic-endurance-track.json` and `combat-strength-fitness.json` arrived during this verification and their ids were added to the spec picker (`profiles_v1_1`); `genpop-active.json` did not exist yet, so the "Stay athletic and active" ids (`rec_pickleball`, `hyrox_fitness` ...) stay provisional (lap swim, running, cycling and ski prep point to the `rec_*` candidates in the aquatic file). Padel (competitive) has no profile in any file. The five sports added here (figure skating, dance / drill, fencing, the smaller racket sports, bowling) need profiles from the merge or sport-verification step.

## v1.2 verification log

Adversarial check of the r3-product-spec update (this file v1.2 and `generator_spec_v1.json` 1.2.0), 2026-10-09. Read in full first: `coach_answers_round3.md`; then this file, every spec part the update touched, `LICENSE`, `DISCLAIMER.md` and `DISCLAIMER.es.md` (referenced, not rewritten), and the compiler reads of the spec (`tools/compile/i18n.mjs`, `tools/compile/crosscheck.mjs`, `tools/fixture/build-fixture.mjs`). Backups of both files before the fixes are in the session scratchpad. JSON edited with the project venv, re-validated and written in the file's own format (indent 1, UTF-8); `_meta.version` stays 1.2.0, and the fixes are logged in `_meta.v1_2_changelog[1]`.

**Verdict.** PASS after fixes. All 13 round-3 answers are applied in the body, tables, examples and JSON, not only in the change tables. No live check-in, readiness, adapt(), logbook-driven or stored-data path is left in either file; each remaining mention is a RETIRED note, a removed field or a negation. Licensing is MIT only, with the copyright line identical to `LICENSE`. Five real defects and about 20 smaller gaps were fixed (all listed below). The five real defects:
1. The spec still marked the approved effort drift as PROPOSED (`rule_tables.effort.planned_drift`).
2. The rear-delt table entry still carried its own priority add, as if rear delts were a muscle you could choose. The floors were still worded "per muscle" instead of per focus group.
3. The racket-player rules were limited to ages 50-59 (E10), but the coach said "50+".
4. Keeping the focus muscles when the time check trims groups had been presented as approved. The coach approved "big movers first", so it is now labelled INFERRED / PROPOSED and asked as N-PROD-27.
5. `open_decisions.round3_ids` left out R3-SES-02.

### Round-3 answers relevant to these files: where each is applied

| ID | Status | Where (this file / spec) |
|---|---|---|
| R3-VOL-01 | OK; FIXED | v1.2 table 5, §1.3, S3 (one "Shoulders" choice), §14.5 (+ add exercise always offers rear-delt work), E4 (`side_delts` / `rear_delts` → `shoulders`), E6, E10 floor row; spec F09 options and `retired_values`, `removed_fields`, `vocab.muscles.focus_groups`, `rule_tables.muscles.focus_groups_ref`, `weekly_sets.floors`, V18, V22, `pipeline[3]`. **Fixed:** `weekly_sets.muscles.rear_delts` gets `v1_2_status` (no own floor, not a Focus choice) and its `priority` sub-entry is marked RETIRED; `weekly_sets.floors.rule` and `landmarks_coach.floor` now count per trained focus group; `rate_engine.planned_targets_by_level_v1_2_note` says the rear-delt rows are rear-delt work inside the shoulders group; `vocab.muscles.focus_groups.rear_delts` (a note that read like a group key) renamed `rear_delts_note` |
| R3-VOL-02 | OK; FIXED | §0 item 2, §2, §3.2, §3.5, E4 check-in RETIRED, E5, E6, E8, E11; spec `adaptation` (RETIRED stub), `rate_engine.no_feedback` and `.retired`, `learning` RETIRED, F43 and F25c in `removed_fields`, V26. **Fixed:** `rule_tables.effort.effort_menu_reading` was an engine reading of check-in efforts; now marked a sheet helper only, never an engine input |
| R3-VOL-03 | OK | §1.3, E6, E10; spec `set_placement` (day step and the small-muscle no-room step), `pipeline[6]` |
| R3-VOL-04 | OK; FIXED | §0 items 2 and 13, §2.2, §14.2, §15, C9, E4 `shape` (`rir_by_week`, `level_by_week`), E6, E10; spec `rate_engine.math` / `standard_steps` / `start_at_2_end_at_11`, `plan_types.fixed_12` / `fixed_8` `planned_rir` (the 15 → 22 curve with 19-22 in the last four weeks matches his example), D12, `output.weight_guidance`, `effort.how_hard`. **Fixed:** `rule_tables.effort.planned_drift` PROPOSED → APPROVED |
| R3-SES-02 | OK; FIXED | §0 items 6-7, S5, S9, S11-S13, S17, §14.5, C17-C20, E4 `plan/2` (block ids, `optional`, `toggle`, `on`, `superset_recommendations[]`, `time_check`) and `edits`, E5 `applyEdits`, E7, E10; spec `plan_editing`, F24 `time_check`, D15, `session_limits.time_vs_minimums`, `core_block.toggle`, `athletic.block_toggle`, `supersets_contrast_circuits.recommendations`, V28-V30, `output.exports_rules` (edit.hint baked into every export). **Fixed:** "big movers **and focus groups** first" was presented as his approved order; his words are "big movers first", so keeping focus groups is now INFERRED / PROPOSED (§0, v1.2 table 4, S5; spec F09, F24, D15, `time_vs_minimums`) and asked as **N-PROD-27**; `open_decisions.round3_ids` was missing R3-SES-02 |
| R3-SES-01 | OK; FIXED | §0 item 8, S3, C21, E4 `focus_muscles`, E6, E10 (focus, floors, counts); spec F09 (max 2, +1 to +3, no sex field), D9, V8, V22, `session_limits.full_body_days` / `muscle_grouping_templates` (cross pattern default, same-pattern template), `priority.v1_2_focus_muscles`. **Fixed:** E10 exercise-count row now carries the cross-pattern / same-pattern rule; focus muscles for competitive field athletes marked PROPOSED (N-PROD-25) in S3 and F09; `learning.model_guardrails` floor per focus group |
| R3-PER-01 | OK; FIXED | §0 item 14, §2.3, S16, S18, C15, E10; spec `plan_types.deload.when`, `fixed_12` / `fixed_8` `deload`, `maintenance_4_6`, F25, F25d, `plan_editing.stopping_and_next_block`, `plan.next_steps`, `vocab.week_types`, `year.calendar` (holidays between blocks). **Fixed:** `plan_types.year` listed recovery weeks 13 / 26 and an "automatic" December maintenance with no qualifier; `year.v1_2_note` now says they are recommended defaults the person can remove or replace; `effort.deload` says the easy week is recommended |
| R3-ATH-01 | OK; FIXED | §1.3, S4, §13.2 swimming row (meet date), E4 example 1, E10; spec `plan_types.season.meet_sports_taper`, `conditioning.sessions_per_week.sport_is_the_aerobic_work`, D14. **Fixed:** E10 adds "2 for younger or lower-level swimmers"; the spec tag now labels the team's addition of water polo and triathlon INFERRED |
| R3-ATH-02 | OK; FIXED | S9, C7, C7b, §7.6, §13.3, E4 example 2, E10; spec F02, F44 (`older_athletic_opt_in`, `racket_50_impact_opt_in`), `athletic.older`, `athletic.racket_50plus`, V5, `goal_phase_modifiers`. **Fixed:** E10 said "Racket players 50-59", but he approved these rules for players 50 and over, so a 60+ racket player keeps the calf / Achilles, rotator-cuff and knee-friendly work. Example 2's note now says the racket rules apply at 63. Spec `F11r.age_rules` still had the R2-ATH-08 wording and now follows R3-ATH-02 |
| R3-ATH-03 | OK | §13 intro, §13.3 HYROX row, E10 (HYROX row; circuits credit no muscle; wall ball ≤ 20 lb); spec `conditioning.sessions_per_week.hyrox_ocr_race_block`, `plan_editing.block_kinds.finisher` |
| R3-ATH-04 | OK; FIXED | §13.2 note, §13.3 shares; spec `athletic.plyo_share_remaining_sports`, D14. **Fixed:** the in-season game-heavy rule for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball was not in the spec (`plan_types.season.game_heavy_sports_v1_2` added) or in E10 |
| R3-ATH-05 | OK | S4, C22, §13.3, E4 example 2, E10; spec F11r `play_days` / `play_minutes` / `event_date`, D14, `conditioning.sessions_per_week.stay_athletic_and_active`, `plan_types.prep.gen_pop_event`, `pipeline[3]` |
| R3-GEN-01 | OK; FIXED | §0 items 3, 10, 18; §2.5, §7.5, §8, §12, C4-C6, C14, C16, C23, E1, E4, E8, E9, E11; spec `legal_and_privacy`, F01, F45, F46, `output.licence`, `output.data`, V27, V31; the copy strings are word-for-word the same as §12.5, checked programmatically; the claims about `LICENSE` and `DISCLAIMER` match the files (copyright string; §5 coaches; §6 minors; §7 no data; §10 acceptance; the Spanish draft lets the reviewing lawyer decide which version governs). **Fixed:** spec F39 `coach_mode` offered "duplicate a previous client's plan", which implies stored data; it now starts from the coach's own answers file or plan file. F17 "then re-placed" now says this happens at the next build, with nothing tracked |

### Leftover grep

Patterns searched in both files: check-in / checkin, readiness, adapt / adapt(), logbook, log_schema, store / stored / storage, tracking, feedback, HOW IT FELT, learn, rear delt(s), Apache, CC BY, mandatory, account, email, sex.

* **This file, main body (§0 to the References):** every hit is one of these: a RETIRED note; a negation ("no check-ins", "nothing stored", "no accounts"); the person's own sheet columns that the tool never reads back; rear-delt work inside the shoulders group; or MIT replacing Apache-2.0 / CC BY 4.0. The History section is marked RETIRED as a whole.
* **Spec, outside `_meta`:** every hit falls into one of these: `removed_fields`, `changes_from_intake_2`, `adaptation` (RETIRED stub), `rate_engine.no_feedback` / `.retired`, `learning` (RETIRED), `plan_types.retired_v1`, `legal_and_privacy` / `output.licence` (Apache and CC BY only as RETIRED), or negations. The exceptions were the defects fixed above. "Mandatory" appears once, as "a RECOMMENDATION, not mandatory".
* **Spec `_meta`:** v1.1 history entries (`v1_1_changelog`, `integration_decisions[*].v1_1_status`), each with a `v1_2_status` or a v1.2 changelog line where round 3 changed it. `renamed_keys_v1_1` pointed at `rate_engine.retired_v1`, which no longer exists; it now names `rate_engine.retired`.

### Other fixes

* Spec `coach_rule_hooks`: the locked "release before every build" rule was listed twice (merged). `facts` said D1-D14 (D15 exists) and lacked `activity.ids` / `day.after_play_day`, which the example rule uses.
* Spec `F11r.mapping_rule`: a duplicated phrase was removed.
* This file: the map and the History intro now point to this log.

### Checks run

* `node tools/compile-model.mjs --out <scratch>` (before and after the fixes): exit 1, "26 contract error(s); nothing written". These are exactly the 26 retired or renamed i18n keys that `_meta.v1_2_changelog[0].pending_cross_refs[0]` expects; there is no other error, and `model/` was not touched.
* `node --test tests/`: 700 pass, 5 fail, 6 todo. None of the failures come from this verification's edits:
  * Tests 3, 20 and 21 fail on the same 26 retired keys (expected until engine stage B1).
  * Test 10 fails because `model/` is stale against the changed sources (spec 1.2.0; `04_profiles.json` and `06_periodization.json` were changed by parallel steps).
  * Test 7 fails because templates and profiles differ from the reference build. `synthesis/04_profiles.json` changed in the parallel profiles step, and `tools/compile/templates-profiles.mjs` does not read the spec.

### Cross-file notes (not edited here)

* `BLAZE_CAMP_BRAIN.md` G4 (about line 1733) still reads "then the weekly check-in, then open source (Apache-2.0 code, CC BY 4.0 model ...)". The master step owns the BRAIN.
* `engine/intake.mjs` (OUTPUT_MODES, `week_by_week_needs_checkin`, `email`), `engine/validate.mjs` (the adapt / check-in branches near line 985) and `engine/CONTRACTS.md` (intake/2 `priority_muscles` with `side_delts` / `rear_delts`) are still v1.1. They belong to engine stages B1-B3 (spec `pending_cross_refs[2]`, `[7]`).
* `tools/fixture` and `tools/compile/i18n.mjs`: drop the 26 keys and the `adaptation` stub reads, then delete the `adaptation` key from the spec (engine stage B1, `pending_cross_refs[0]`, `[1]`).
* Rule-table numbers for rear delts, the Focus add (+1 to +3 by level) and the worked `planned_targets_by_level` rows wait for `12_volume_algorithm_v1` v1.2 (master step, `pending_cross_refs[3]`, `[4]`).


## v1.3 verification log (2026-10-11)

- Read first, in full: `design/ENGINE_V05_PLAN.md`, `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`.
- Added the v1.3 section and §1.4; rewrote §0 items 7 and 15 and extended items 6, 10, 13, 14 and 18; retired the time check in S5, the comparison table, the roadmap, the start flow, the copy table (C19, C20), the express path, E4-E6 and the E10 tests; marked §12.4, §14.5, §15, E4 and E6 as changed.
- The English and Spanish lines of section V2 are copied from the compiled word lists (`model/i18n/en.json`, `model/i18n/es.json`, model 1.3.0).
- The blocks of sections V3 and V4 are the same text as `BLAZE_CAMP_BRAIN.md` v1.3 (§10.5, §10.10); "master §" in them points to that file.
- Not changed: the option analysis, the cost and effort estimates (only the feature names in them), the sport picker, the references and the v1.1 / v1.2 history and logs. The effort estimates still count a "time check" item in a few rows of §9 and E12; read it as the session-size and estimate work, which is smaller.