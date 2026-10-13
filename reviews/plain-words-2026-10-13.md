# Plain words, 2026-10-13 (COACH-CH7 CH7-09)

The coach's request, verbatim: **"all explanations should be elementary school reading comprehension"**
(`coach_answers_chat_2026-10-13b.md` CH7-09). This review records what was rewritten, how it was measured, and what is left.

Words only. No key, rule, number, exercise name or placeholder changed. Every sample plan's JSON is byte-identical (the plan holds
keys, not words); only the rendered Markdown changed. Model version 1.4.0, engine 0.7.0 (DECISIONS G-315).

## Method

* **Scope.** Every explanation a person reads: the model's words (`model/i18n/{en,es}.json`: notes, warnings, why lines,
  progression rules, week and block words, "How to adjust this plan", the printed checks and locked rules, the class's named
  workouts) and the web tool's words (`app/i18n.js`). The agent tools reuse both (`agent/questions.json` regenerated), and
  `AGENT_PLAYBOOK.md`, `agent/questions.mjs > AGENT_RULES` and the `build-plan` skill tell agents to talk at the same level.
* **Left out on purpose.** [LEGAL REVIEW] copy and the lines around it (release, release lines, health warning, health
  questions, coach-bypass lines, the plan's disclaimer line): used verbatim until the attorney reviews them. The coach's own
  "Basic Instruction" and CrossFit lines from his sheets, and his warning sentence "Make sure (that) you have a fitness
  professional to help you understand what this means" (R2-ATH-08). Names: exercises, sports, activities, days, muscles,
  programs. Brand words in `app/brands/*.js`.
* **Where.** Model words: a last words layer, `tools/fixture/v07-plain.mjs` (`UI_P7`, values of existing keys only), applied
  after every other layer by both builds (`tools/fixture/build-fixture.mjs`, `tools/compile/i18n.mjs`). Web tool words: values
  in `app/i18n.js` (keys unchanged, so the parallel `app-link` branch merges cleanly).
* **Score.** `tools/readability.mjs` (no dependencies). English: Flesch-Kincaid grade. Spanish: the Fernández-Huerta ease
  (corrected form), put on a grade scale with its published bands (80-90 = 5th grade): grade = 3.5 + (100 - ease) / 10. Only
  lines of 8 words or more are graded; shorter labels are checked against a jargon list instead. Fernández-Huerta reads short
  Spanish lines about a grade higher than Flesch-Kincaid reads the same English (Spanish words are longer: "repeticiones" has 5
  syllables), so Spanish numbers run higher for the same plainness.
* **How it was rewritten.** Short sentences (12-15 words at most), one idea each, common words, active voice. Jargon replaced
  or explained the first time:

  | Before | After (EN) | After (ES) |
  |---|---|---|
  | leave 2 in the tank (2 RIR, RPE 8) | leave 2 in the tank (effort 8 out of 10) | deja 2 de sobra (esfuerzo de 8 de 10) |
  | work:rest 1:5 to 1:10 | rest 5 to 10 times as long as you work | descansa de 5 a 10 veces lo que trabajas |
  | Sets follow the stairway | The plan adds sets week by week, like steps | El plan suma series semana a semana, como escalones |
  | one intensifier ... a MYO set | one extra-hard set ... a MYO set (see the note on the exercise) | una serie extra dura ... (mira la nota del ejercicio) |
  | MYO set on the last set: about 15 reps, then 5 mini-sets of 5 ... | MYO set (an extra-hard last set): do about 15 reps. Rest about 5 breaths. Do 5 more reps. Repeat that 5 times. | Serie MYO (una última serie extra dura): haz unas 15 repeticiones. Descansa unas 5 respiraciones. ... |
  | back-off set | lighter set | serie más ligera |
  | Plyo share 40% | Quick jumps: 40% | Saltos rápidos: 40% |
  | last set MAX (technical failure) | last set MAX: as many reps as you can with good form | última serie al MÁX: todas las repeticiones que puedas con buena técnica |
  | Taper | Easier weeks | Semanas más suaves |
  | Getting used to it (small steps) / Driving it | Easy start (small steps) / Building up | Inicio suave (pasos pequeños) / Subiendo |
  | Horizontal before vertical (rows before pulldowns ...) | Rows come before pulldowns. Chest presses come before overhead presses | Los remos van antes que los jalones. ... |
  | anti-extension and anti-rotation first | first, moves where you keep your back from arching or twisting | primero, ejercicios donde evitas que la espalda se arquee o gire |

  The "climbs like a stairway" picture stays in the one intro line that explains it; "Receive-Create" (the coach's jump-stage
  name) stays, with "(jump stage 1)" next to it; AMRAP and EMOM keep their spelled-out meaning. Spanish keeps "desactivar" for
  "switch off" (E-112).

## Results

| | Strings graded | Mean grade | Median | Above grade 5 | Above grade 8 | Hardest |
|---|---|---|---|---|---|---|
| EN before | 502 | 5.4 | 5 | 248 | 90 | 15.5 |
| EN after | 514 | 3 | 2.9 | 67 | 2 | 10.7 |
| ES before | 541 | 6 | 6.1 | 408 | 32 | 11.7 |
| ES after | 539 | 4.9 | 4.9 | 232 | 2 | 8.7 |

* 1420 strings in scope (1148 model, 272 app); rewritten 465 (443 model, 22 app).
* Lines with a jargon term (EN + ES): before 121, after 26. (the 26 left are the allowed ones: the stairway intro lines, the spelled-out AMRAP, and the MYO set lines that point to its explanation).
* Every rewritten line keeps exactly its placeholders (recorded in `tests/fixtures/plain-words-placeholders.json`).

## The 30 most-read lines, before and after

Ranked by how often the line's longest fixed piece is printed in the 8 English sample plans (an approximate count: lines that share a piece, such as the two effort lines, count each other's prints).

**1. `effort.rir`** (printed 2192 times in the 8 English samples) · grade EN 0 -> 2.5 · ES 1.9 -> 3.1

- EN before: leave {min}-{max} in the tank ({min}-{max} RIR, RPE {rpe_low}-{rpe_high})
- EN after: leave {min}-{max} in the tank (effort {rpe_low}-{rpe_high} out of 10)
- ES before: deja {min}-{max} en reserva ({min}-{max} RIR, RPE {rpe_low}-{rpe_high})
- ES after: deja {min}-{max} de sobra (esfuerzo de {rpe_low}-{rpe_high} de 10)

**2. `effort.rir_single`** (printed 2192 times in the 8 English samples) · grade EN 0 -> 2.5 · ES 1.9 -> 3.1

- EN before: leave {n} in the tank ({n} RIR, RPE {rpe})
- EN after: leave {n} in the tank (effort {rpe} out of 10)
- ES before: deja {n} en reserva ({n} RIR, RPE {rpe})
- ES after: deja {n} de sobra (esfuerzo de {rpe} de 10)

**3. `ui.plan.progress.double`** (printed 2032 times in the 8 English samples) · grade EN 7.2 -> 7.2 · ES 5 -> 4.9

- EN before: Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time and start again at {low}.
- EN after: Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time and start again at {low}.
- ES before: Progresión: cuando llegues a {high} en todas las series con {rir} en reserva, sube el peso la próxima vez y vuelve a empezar en {low}.
- ES after: Para avanzar: cuando llegues a {high} en todas las series con {rir} de sobra, sube el peso la próxima vez y vuelve a empezar en {low}.

**4. `ui.plan.progress.double_side`** (printed 2032 times in the 8 English samples) · grade EN 7.8 -> 7.8 · ES 5.1 -> 5.1

- EN before: Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time and start again at {low}.
- EN after: Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time and start again at {low}.
- ES before: Progresión: cuando llegues a {high} por lado en todas las series con {rir} en reserva, sube el peso la próxima vez y vuelve a empezar en {low}.
- ES after: Para avanzar: cuando llegues a {high} por lado en todas las series con {rir} de sobra, sube el peso la próxima vez y vuelve a empezar en {low}.

**5. `swap.loses.same_drill`** (printed 1969 times in the 8 English samples) · grade EN 6.3 -> 1.7 · ES 7.6 -> 5.9

- EN before: the exact drill - the same quality, trained another way
- EN after: the exact drill. It trains the same thing another way
- ES before: el ejercicio exacto: la misma cualidad, trabajada de otra forma
- ES after: el ejercicio exacto. Entrena lo mismo de otra forma

**6. `ui.plan.superset_suggest_line`** (printed 1142 times in the 8 English samples) · grade EN 3.7 -> 3.7 · ES 6.4 -> 6.4

- EN before: Superset to save time: {pair} (about {min} min saved)
- EN after: Superset to save time: {pair} (saves about {min} min)
- ES before: Superserie para ahorrar tiempo: {pair} (ahorras unos {min} min)
- ES after: Superserie para ahorrar tiempo: {pair} (ahorras unos {min} min)

**7. `effort.core_opener`** (printed 480 times in the 8 English samples) · grade EN 5 -> 0.6 · ES 5.9 -> 3.4

- EN before: easy and controlled: stop well before it gets hard
- EN after: easy and slow. Stop well before it gets hard
- ES before: fácil y controlado: detente mucho antes de que se ponga difícil
- ES after: fácil y con control. Para mucho antes de que se ponga difícil

**8. `ui.plan.edit_day`** (printed 396 times in the 8 English samples) · grade EN 3.1 -> 2.3 · ES 6 -> 6.4

- EN before: You can switch off these blocks today: {blocks}. You can also add or remove exercises.
- EN after: You can turn off these blocks today: {blocks}. You can also add or take out exercises.
- ES before: Hoy puedes desactivar (o quitar) estos bloques: {blocks}. También puedes agregar o quitar ejercicios.
- ES after: Hoy puedes desactivar estos bloques: {blocks}. También puedes agregar o quitar ejercicios.

**9. `ui.plan.est_line`** (printed 396 times in the 8 English samples) · grade EN 10.7 -> 5.9 · ES 6.5 -> 4.8

- EN before: Average time: about {low}-{high} min (an estimate, for information only)
- EN after: Average time: about {low}-{high} min (an estimate, just so you know)
- ES before: Tiempo promedio: aprox. {low}-{high} min (un estimado, solo como información)
- ES after: Tiempo promedio: unos {low}-{high} min (un cálculo, solo para que sepas)

**10. `ui.plan.est_line_one`** (printed 396 times in the 8 English samples) · grade EN 10.7 -> 5.9 · ES 6.5 -> 4.8

- EN before: Average time: about {min} min (an estimate, for information only)
- EN after: Average time: about {min} min (an estimate, just so you know)
- ES before: Tiempo promedio: aprox. {min} min (un estimado, solo como información)
- ES after: Tiempo promedio: unos {min} min (un cálculo, solo para que sepas)

**11. `ui.plan.label_part.single_leg_hinge`** (printed 384 times in the 8 English samples) · grade EN - -> - · ES 6.4 -> -

- EN before: single-leg hinge
- EN after: single-leg hinge
- ES before: bisagra de cadera a una pierna (single-leg hinge)
- ES after: bisagra a una pierna

**12. `effort.hold_quality`** (printed 232 times in the 8 English samples) · grade EN 0.8 -> 0 · ES 6.4 -> 5.2

- EN before: hold with good form, stop before it breaks
- EN after: hold with good form. Stop before your form slips
- ES before: mantén con buena técnica, detente antes de perderla
- ES after: sostén con buena técnica. Para antes de perderla

**13. `rest.work_rest`** (printed 206 times in the 8 English samples) · grade EN - -> 0.1 · ES - -> 3.1

- EN before: work:rest 1:{min} to 1:{max}
- EN after: rest {min} to {max} times as long as you work
- ES before: trabajo:descanso 1:{min} a 1:{max}
- ES after: descansa de {min} a {max} veces lo que trabajas

**14. `ui.plan.progress.fixed`** (printed 160 times in the 8 English samples) · grade EN 5.2 -> 5.2 · ES 4.5 -> 4.5

- EN before: Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time.
- EN after: Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time.
- ES before: Progresión: cuando llegues a {high} en todas las series con {rir} en reserva, sube el peso la próxima vez.
- ES after: Para avanzar: cuando llegues a {high} en todas las series con {rir} de sobra, sube el peso la próxima vez.

**15. `ui.plan.progress.fixed_side`** (printed 160 times in the 8 English samples) · grade EN 5.8 -> 5.8 · ES 4.7 -> 4.6

- EN before: Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time.
- EN after: Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time.
- ES before: Progresión: cuando llegues a {high} por lado en todas las series con {rir} en reserva, sube el peso la próxima vez.
- ES after: Para avanzar: cuando llegues a {high} por lado en todas las series con {rir} de sobra, sube el peso la próxima vez.

**16. `note.walk_after`** (printed 120 times in the 8 English samples) · grade EN 6.7 -> 6.7 · ES 7.1 -> 6.4

- EN before: Long walk after your workout: 20-30 min easy
- EN after: Long, easy walk after your workout: 20-30 min
- ES before: Caminata larga después de entrenar: 20-30 min suave
- ES after: Caminata larga y suave después de entrenar: 20-30 min

**17. `effort.circuit_rir`** (printed 112 times in the 8 English samples) · grade EN 3.6 -> 3.6 · ES 5.7 -> 6.2

- EN before: pick a weight you could keep moving with about {rir} reps left at the bell
- EN after: pick a weight you could keep moving, with about {rir} reps left at the bell
- ES before: elige un peso con el que podrías seguir con unas {rir} repeticiones en reserva al sonar la señal
- ES after: elige un peso que podrías seguir moviendo, con unas {rir} repeticiones de sobra al sonar la señal

**18. `note.hold_weights`** (printed 100 times in the 8 English samples) · grade EN 7 -> 6.4 · ES 6.3 -> 5.4

- EN before: Hold dumbbells at your sides (or a barbell on your back) once your body weight is easy at this effort
- EN after: When your body weight feels easy at this effort, hold dumbbells at your sides (or a bar on your back)
- ES before: Sostén mancuernas a los lados (o una barra en la espalda) cuando tu peso corporal resulte fácil a este esfuerzo
- ES after: Cuando tu peso se sienta fácil a este esfuerzo, sostén mancuernas a los lados (o una barra en la espalda)

**19. `effort.olympic_power`** (printed 94 times in the 8 English samples) · grade EN 4.7 -> 0.1 · ES 6.3 -> 5.5

- EN before: move it fast: if the bar slows down or your technique breaks, it is too heavy
- EN after: move it fast. If the bar slows down or your form slips, it is too heavy
- ES before: muévela rápido: si la barra se frena o se rompe la técnica, está demasiado pesada
- ES after: muévela rápido. Si la barra se frena o pierdes la técnica, pesa demasiado

**20. `note.olympic_power`** (printed 94 times in the 8 English samples) · grade EN 6.7 -> 4.2 · ES 7.1 -> 6.4

- EN before: Olympic lifts are for power: no percentages unless your coach switches them on
- EN after: Olympic lifts are for power. No percentages unless your coach turns them on
- ES before: Los olímpicos son para potencia: sin porcentajes salvo que tu entrenador los active
- ES after: Los olímpicos son para potencia. Sin porcentajes, salvo que tu entrenador los active

**21. `note.repeat_low`** (printed 92 times in the 8 English samples) · grade EN 5.9 -> 2.2 · ES 5.4 -> 4.6

- EN before: Quick, continuous contacts: stay springy on the balls of your feet
- EN after: Quick jumps in a row: stay bouncy on the balls of your feet
- ES before: Contactos rápidos y continuos: rebota sobre la punta de los pies
- ES after: Saltos rápidos seguidos: rebota en la punta de los pies

**22. `note.circuit_stations`** (printed 84 times in the 8 English samples) · grade EN 6.1 -> 2.6 · ES 5.2 -> 3.7

- EN before: Station by station: {rounds} sets of {work_s} s with {transition_s} s of rest between sets, then the next station
- EN after: Station by station: {rounds} sets of {work_s} s, with {transition_s} s of rest between sets. Then go to the next station
- ES before: Estación por estación: {rounds} series de {work_s} s con {transition_s} s de descanso entre series, luego la siguiente estación
- ES after: Estación por estación: {rounds} series de {work_s} s, con {transition_s} s de descanso entre series. Luego pasa a la siguiente

**23. `note.bonus_final`** (printed 80 times in the 8 English samples) · grade EN 11.2 -> 3.2 · ES 7.6 -> 5

- EN before: Bonus exercise, done last: your template's lifts for this muscle group are already at their top sets, so this one adds the last sets to reach your final number.
- EN after: Bonus exercise, done last. Your plan's lifts for this muscle group are already full. This one adds the last sets so you reach your final number.
- ES before: Ejercicio extra, al final: los ejercicios de tu plantilla para este grupo muscular ya están en su máximo de series, así que este suma las últimas series para llegar a tu número final.
- ES after: Ejercicio extra, al final. Los ejercicios de tu plan para este grupo ya están llenos. Este suma las últimas series para llegar a tu número final.

**24. `note.aerobic_required`** (printed 76 times in the 8 English samples) · grade EN 6.8 -> 5.9 · ES 4.5 -> 4.5

- EN before: This cardio session is part of the plan even if you skip the optional lifting.
- EN after: This cardio is part of the plan, even if you skip the optional lifting.
- ES before: Esta sesión de cardio es parte del plan aunque te saltes las pesas opcionales.
- ES after: Este cardio es parte del plan, aunque te saltes las pesas opcionales.

**25. `warmup.mobility_prep`** (printed 60 times in the 8 English samples) · grade EN 15.5 -> 6.8 · ES 8.7 -> 6.3

- EN before: Mobility: KB book openers, thoracic rotations and pec-minor openers (5 min)
- EN after: Loosen up: KB book openers, upper-back twists and chest stretches (5 min)
- ES before: Movilidad: aperturas de libro con kettlebell, rotaciones torácicas y aperturas de pectoral menor (5 min)
- ES after: Suelta el cuerpo: aperturas de libro con kettlebell, giros de espalda alta y estiramientos de pecho (5 min)

**26. `note.joint_care_slot`** (printed 48 times in the 8 English samples) · grade EN 5.2 -> 1.6 · ES 6.4 -> 7.8

- EN before: This lift is also your joint care: lower slowly and stay in a pain-free range.
- EN after: This lift also cares for your joints. Lower it slowly and stay where it does not hurt.
- ES before: Este ejercicio también es tu cuidado articular: baja lento y quédate en un rango sin dolor.
- ES after: Este ejercicio también cuida tus articulaciones. Bájalo lento y quédate donde no duela.

**27. `prehab.label.OVERHEAD_HEALTH`** (printed 48 times in the 8 English samples) · grade EN 7.2 -> 1.8 · ES 6.7 -> 4.2

- EN before: Shoulder health: a light overhead press through your full range, once a week - your incline press builds the strength, this keeps your reach
- EN after: Healthy shoulders: a light overhead press through your full range, once a week. Your incline press builds the strength. This keeps your reach
- ES before: Salud del hombro: un press ligero por encima de la cabeza en todo tu rango, una vez a la semana - tu press inclinado construye la fuerza, este mantiene tu alcance
- ES after: Hombros sanos: un press ligero sobre la cabeza en todo tu rango, una vez a la semana. Tu press inclinado da la fuerza. Este cuida tu alcance

**28. `detail.v.pause_knee`** (printed 46 times in the 8 English samples) · grade EN - -> - · ES 5.1 -> -

- EN before: 1-second pause just below the knee
- EN after: 1-second pause just below the knee
- ES before: pausa de 1 segundo justo debajo de la rodilla
- ES after: pausa de 1 segundo bajo la rodilla

**29. `ui.plan.edit_aerobic_day`** (printed 46 times in the 8 English samples) · grade EN 6.7 -> 5.8 · ES 6.5 -> 7

- EN before: Optional: you can switch off this cardio session, or move it to another day.
- EN after: Optional: you can turn off this cardio, or move it to another day.
- ES before: Opcional: puedes desactivar esta sesión de cardio o pasarla a otro día.
- ES after: Opcional: puedes desactivar este cardio o pasarlo a otro día.

**30. `note.wod`** (printed 40 times in the 8 English samples) · grade EN 4.4 -> 5.9 · ES 5.4 -> 6.4

- EN before: WOD: nothing in the WOD counts as muscle sets (thrusters, swings, jumps, throws, wall balls)
- EN after: WOD (workout of the day): nothing in it counts as muscle sets (thrusters, swings, jumps, throws, wall balls)
- ES before: WOD: nada del WOD cuenta como series musculares (thrusters, swings, saltos, lanzamientos, wall balls)
- ES after: WOD (entrenamiento del día): nada cuenta como series de músculo (thrusters, swings, saltos, lanzamientos, wall balls)

## Left above grade 5, and why

English: 32 lines are above grade 6 (all listed below); the rest of the 67 English lines above grade 5 sit between 5 and 6. Spanish: 91 lines are above grade 6 (the hardest 15 below).

* **Names and lists of names** (`intake.goal.opt.active`, `prehab.code.AGE_50_RACKET`, the named workouts): the grade comes from the names (pickleball, HYROX, Achilles, double-unders). They are allowed above the per-line limit in the test.
* **Short lines with one long word.** A 9-word line with "exercises", "repeticiones" or "isquiotibiales" scores grade 6-8 on the formula although a child reads it ("Sentadilla pesada y peso muerto pesado en días aparte"). Shorter words would change the gym term, so these stay.
* **Lines a coach review fixed word for word.** Some lines keep the wording a coach-eye review asked for and a regression test guards: "add weight next time and start again at 8" (R4-PRG-03), "not a number this plan promises", "Example from your plan", "above its usual top of 18", "Receive-Create", "of this plan's weekly". Each was kept and shortened around it.
* **The coach's own sentence** ("Make sure (that) you have a fitness professional to help you understand what this means", R2-ATH-08) is kept as he said it.

| Lang | Key | Grade | Text |
|---|---|---|---|
| EN | `intake.goal.opt.active` | 10.7 | Stay athletic and active (pickleball, HYROX, tennis, golf, sports leagues, running, hiking ...) |
| EN | `prehab.code.AGE_50_RACKET` | 9.7 | racket players 50+: knees, Achilles, shoulders and elbows |
| EN | `guide.adjust.accessories` | 7.8 | Switching off the accessories block takes away every set just for {groups}. |
| EN | `ui.plan.progress.double_side` | 7.8 | Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time and start again at {low}. |
| EN | `ui.plan.session_size` | 7.8 | about {n} exercises a session (plus the warm-up and 2 core exercises) |
| EN | `ui.plan.session_size_range` | 7.8 | about {low}-{high} exercises a session (plus the warm-up and 2 core exercises) |
| EN | `why.pre_season` | 7.6 | Before the season: about 60% of the off-season sets, with more speed and power |
| EN | `ui.plan.progress.double` | 7.2 | Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time and start again at {low}. |
| EN | `why.age_50_racket` | 7.2 | Racket player 50+: strength that is kind to the knees, calf and Achilles work, and soft jumps only |
| EN | `plan.next.pre_season` | 7 | your before-the-season block ({weeks} weeks) before your season starts on {date}. Its first week can be the recommended easy week (optional) |
| EN | `note.pre_season` | 6.9 | Before the season: fewer sets, with faster and more powerful moves |
| EN | `warmup.mobility_prep` | 6.8 | Loosen up: KB book openers, upper-back twists and chest stretches (5 min) |
| EN | `changes.new_exercise_block` | 6.7 | New exercise block: some exercises change a little |
| EN | `check.h22_no_checkin_no_change` | 6.7 | The plan is set ahead: every week follows the plan, with no weekly check-ins |
| EN | `note.walk_after` | 6.7 | Long, easy walk after your workout: 20-30 min |
| EN | `warmup.balance_prep` | 6.7 | Balance and quick feet: one-leg balance reach, split step and first-step reactions (5 min) |
| EN | `warmup.mobility` | 6.7 | Loosen up for pressing (like KB book openers) |
| EN | `why.pyramid` | 6.7 | Pyramid 12/10/8, then a light 20 |
| EN | `why.two_spine_days` | 6.7 | Heavy squat and heavy deadlift on different days |
| EN | `about.minor_note` | 6.7 | Under 18: a parent or guardian accepts the release at the last step. |
| EN | `note.hold_weights` | 6.4 | When your body weight feels easy at this effort, hold dumbbells at your sides (or a bar on your back) |
| EN | `plan.next.block_choice` | 6.4 | you choose: the next block (an easy week first is good, not a must), a plan to keep what you have, or a new plan |
| EN | `ui.plan.progress.written` | 6.4 | Progress: when you hit the written reps on every set with {rir} left in the tank, add weight next time. |
| EN | `why.second_hip_knee_flexion` | 6.4 | The hip day pairs its one-leg hip bend with a leg curl, not a second hip bend (hips = glutes + hamstrings) |
| EN | `why.two_day_full_body` | 6.4 | Two training days a week: each day trains your whole body (a squat with a pull, a hip bend with a press) |
| EN | `note.recovery` | 6.3 | Easy week: same exercises, about half the sets, lighter |
| EN | `check.v13_caps` | 6.1 | Day size: no more exercises than your type of plan allows, and no more sets than the top limit |
| EN | `plan.next.pre_season_rest` | 6.1 | {weeks} more pre-season weeks (with easier weeks at the end) before your season starts on {date} |
| EN | `swap.loses.vertical_pull` | 6.1 | the pull from above (a pull-up bar, a cable or a TRX would bring it back) |
| EN | `why.assisted_jump` | 6.1 | Knee pain: your jumps start with help, holding onto something, before jumps with just your weight |
| EN | `why.hard_eve` | 6.1 | The hard intervals moved off the day before your fastest sprints or your heavy hip lift |
| EN | `wod.named.chelsea.std` | 6.1 | Chelsea: at the start of every minute, do 5 pull-ups, 10 push-ups and 15 squats. Go for 30 minutes. |
| ES | `intake.goal.opt.active` | 8.7 | Mantenerme atlético y activo (pickleball, HYROX, tenis, golf, ligas, correr, caminata ...) |
| ES | `why.glute_second_hip` | 8.3 | El día de cadera junta una bisagra y un ejercicio de glúteo (cadera = glúteos + isquiotibiales) |
| ES | `why.rep_cap` | 7.9 | Este ejercicio tiene su propio tope de repeticiones |
| ES | `why.sets_hold` | 7.9 | Mismas series esta semana: sube repeticiones o peso |
| ES | `note.joint_care_slot` | 7.8 | Este ejercicio también cuida tus articulaciones. Bájalo lento y quédate donde no duela. |
| ES | `wod.named.chelsea.std` | 7.8 | Chelsea: al inicio de cada minuto, haz 5 dominadas, 10 lagartijas y 15 sentadillas. Durante 30 minutos. |
| ES | `wod.named.elizabeth.std` | 7.8 | Elizabeth: 21-15-9 repeticiones de cargadas con sentadilla y fondos en anillas. Por tiempo. |
| ES | `why.two_spine_days` | 7.7 | Sentadilla pesada y peso muerto pesado en días aparte |
| ES | `why.older_opt_in` | 7.6 | Trabajo de potencia 60+ agregado porque lo pediste (con la advertencia) |
| ES | `ui.plan.test_end_body` | 7.5 | Prueba final esta semana: pésate y mídete la primera mañana, antes de entrenar |
| ES | `note.older_opt_in` | 7.3 | Elegiste agregar trabajo de potencia. Asegúrate de tener un profesional del fitness que te ayude a entender lo que esto significa. |
| ES | `build.calm` | 7.3 | Puede tardar unos segundos. Todo pasa en este dispositivo. |
| ES | `why.core_low_back` | 7.2 | Core para tu espalda baja: primero, ejercicios donde evitas que la espalda se arquee o gire |
| ES | `wod.named.murph.std` | 7.2 | Murph: corre 1 milla. Haz 100 dominadas, 200 lagartijas y 300 sentadillas. Corre otra milla. Por tiempo. Divide las repeticiones como quieras. |
| ES | `changes.new_exercise_block_same` | 7.1 | Nuevo bloque de ejercicios: los ejercicios siguen igual |

## Not changed, on purpose

* [LEGAL REVIEW] copy and the legal lines around it (see Method): the attorney review comes first. These are the hardest lines a
  person reads now; a plain-words pass on them should go to the attorney with this request.
* The coach's "Basic Instruction" lines (instruction.1 ... 5) and his CrossFit lines (instruction.cf.1 ... 3): his words from
  his sheets. Their plain "bridge" lines underneath were rewritten. If he wants his own lines simplified too, that is his call.
* Exercise names and cues, sport, activity, day and program names, and the Son Hábitos brand words (`app/brands/sonhabitos.js`).
* About 830 Spanish lines are still marked machine-written in `model/i18n/es_review.json`; the new plain lines are listed in its
  `priority_review` for the coach (or a Spanish-speaking coach he trusts) to read first.

## Tests

* `tests/v07-plain-words.test.mjs`: English mean grade <= 5 and no line above 8 (2 allowed name lists); Spanish mean <= 5.5
  and no line above 9; no jargon outside the allowed explaining lines; every placeholder kept; the layer only rewrites existing
  explanation keys, never legal copy, names or the coach's own lines.
* Wording-only conversions in older tests (never logic), listed in `engine/DECISIONS.md` G-315: `render.test.mjs` (the effort
  and rest words), `review-r2f3.test.mjs` (the circuit week line, the adjust line prefix, the accessories line),
  `review-v12.test.mjs` (the quick-jumps line and the effort line read through their keys), `v07-select.test.mjs` (the
  jump-pain line, the named-workout and bootcamp lines), `v05-words.test.mjs` (the time estimate line), and the "the layer's
  words are in the model" loops of `v05-fix2`, `v05-words`, `v06-select`, `v06-volume`, `v06-words`, `v07-select` and
  `v07-words`, which now skip a line the plain-words layer rewrote (checked by the new test instead).
