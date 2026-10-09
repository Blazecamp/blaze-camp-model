// tools/compile/es/labels.mjs - B1 machine translation (neutral Latin American Spanish, English gym term in brackets where
// gyms use it; R2-GEN-08) of the coach cues, the 05 day labels and the 04 profile names that carry no Spanish in the sources.
// Keyed by the compiled EN text (a changed EN line stops matching and lands in es_review.missing_keys). Every line produced
// from these tables is listed in model/i18n/es_review.json > machine_translated (PROPOSED - PENDING COACH APPROVAL).

/** coach cues (02 v1.1 coach_cues[0].cue) */
export const ES_CUES = {
  'Hold the DBs (or a barbell), take a half step back into a staggered stance and deadlift on the front leg; switch legs and keep alternating every rep. Saves time compared with finishing one side first.':
    'Sostén las mancuernas (o una barra), da medio paso atrás a una postura escalonada y haz el peso muerto con la pierna de adelante; cambia de pierna y alterna en cada repetición. Ahorra tiempo comparado con terminar un lado primero.',
  "Counts 0.5 chest + 0.5 triceps ('more tricep than chest but still .5 and .5'); program it on a push day as a push exercise.":
    "Cuenta 0.5 pecho + 0.5 tríceps ('más tríceps que pecho, pero igual .5 y .5'); prográmalo en un día de empuje como ejercicio de empuje.",
  'No levels: just do them right (quality and intent over load).':
    'Sin niveles: solo hazlos bien (calidad e intención por encima de la carga).',
  'No axial (spinal) load: swap in when the athlete already loaded the back that week or is sore.':
    'Sin carga axial (en la columna): úsalo cuando el atleta ya cargó la espalda esa semana o está adolorido.',
  'MODERATE: about 6 in hurdles; reps can pause between hops.':
    'MODERADO: vallas de unas 6 in (15 cm); se puede pausar entre saltos.',
  'Zone 1 = arms down by the sides (vertical, external-rotation bias); zone 2 = arms in front at shoulder height (horizontal, internal-rotation bias, compressive); zone 3 = arms overhead (vertical, external-rotation bias).':
    'Zona 1 = brazos abajo a los costados (vertical, tendencia a rotación externa); zona 2 = brazos al frente a la altura de los hombros (horizontal, tendencia a rotación interna, compresiva); zona 3 = brazos arriba de la cabeza (vertical, tendencia a rotación externa).',
  "Lat pull-over on a cable machine (the coach's 'pull under').":
    "Pullover de dorsales en polea (el 'pull under' del coach).",
  'Full squat catch.':
    'Recepción en sentadilla completa.',
  "No ball needed: mimic the slam and the catch / return 'any way possible' - the coach's no-medball substitute for slams.":
    "No necesitas balón: imita el azote y la recepción / regreso 'como sea posible' - el sustituto del coach cuando no hay balón medicinal.",
  'Use if the gym has one and the client feels the right muscles (hamstrings / glutes).':
    'Úsalo si el gimnasio tiene uno y el cliente siente los músculos correctos (isquiotibiales / glúteos).',
  "No ranking: 'if the hack squat that you have in your gym works and you feel it is good, then that's great.' More constrained than a Smith machine.":
    "Sin ranking: 'si la sentadilla hack de tu gimnasio funciona y la sientes bien, perfecto.' Más guiada que una máquina Smith.",
  'Box height above hip height (as written).':
    'Altura del cajón por arriba de la cadera (tal como está escrito).',
  'ADVANCED: taller hurdles (12 in and up) and continuous, quick-contact reps.':
    'AVANZADO: vallas más altas (12 in / 30 cm o más) y repeticiones continuas con contacto rápido.',
  'Two KBs on the floor in front of you; wide stance, hinge down, row both off the floor, set them down every rep.':
    'Dos kettlebells en el piso frente a ti; postura abierta, baja en bisagra, rema ambas desde el piso y apóyalas en cada repetición.',
  'Constrained, no axial (spinal) load: the default second squat-pattern lift of the week (PER-04).':
    'Guiado, sin carga axial (en la columna): el segundo ejercicio de sentadilla por defecto de la semana (PER-04).',
  'Box height about 6-12 in.':
    'Altura del cajón de unas 6-12 in (15-30 cm).',
  'One DB in each hand, arms hanging at the sides; squat down keeping the DBs low. Not a goblet, not racked.':
    'Una mancuerna en cada mano, brazos colgando a los costados; baja en sentadilla manteniendo las mancuernas abajo. No es goblet ni en posición frontal.',
  'Box height about 12-18 in.':
    'Altura del cajón de unas 12-18 in (30-45 cm).',
  'Hands start on the floor and pop up to land on a box - the opposite direction of the stick-the-landing drill.':
    'Las manos empiezan en el piso y saltan para aterrizar sobre un cajón - la dirección contraria al aterrizaje controlado.',
  'Hands start on a box; push off, land with the hands on the floor and stick (freeze) the landing.':
    'Las manos empiezan sobre un cajón; empuja, aterriza con las manos en el piso y congela el aterrizaje.',
  'Use if available and the client feels the right muscles.':
    'Úsalo si está disponible y el cliente siente los músculos correctos.',
  'Sit on a box, bench or chair, put one foot forward and stand up on that one leg; the other foot only touches the floor for balance or stays off it. Works like an assisted / box pistol.':
    'Siéntate en un cajón, banco o silla, adelanta un pie y levántate con esa pierna; el otro pie solo toca el piso para equilibrio o se queda arriba. Funciona como una sentadilla pistola asistida / al cajón.',
  'Less constrained than a hack squat or leg press (EQ-11).':
    'Menos guiada que una sentadilla hack o una prensa de piernas (EQ-11).',
  "Any implement: 'weighted squats to calf raise can be done with any tool'.":
    "Cualquier implemento: 'la sentadilla con peso a elevación de talones se puede hacer con cualquier herramienta'."
};

/** 05 v1.1 day labels (EN cleaned of internal notes by tools/compile/i18n.mjs cleanDayLabel, FIX-03) */
export const ES_DAY_LABELS = {
  'Optional day': 'Día opcional',
  'Aerobic session': 'Sesión aeróbica',
  'Run / walk-run': 'Carrera / caminata-carrera',
  'Upper': 'Tren superior',
  'Pull': 'Jalón (Pull)',
  'Push': 'Empuje (Push)',
  'Day A - squat + pull, hip thrust + press': 'Día A - sentadilla + jalón, empuje de cadera + press',
  'Day B - deadlift + push, leg press + pull': 'Día B - peso muerto + empuje, prensa de piernas + jalón',
  'Day C - both bilaterals, non-axial': 'Día C - ambos bilaterales, sin carga axial',
  'A - squat + pull (axial squat)': 'A - sentadilla + jalón (sentadilla con carga axial)',
  'B - deadlift + push (axial hinge)': 'B - peso muerto + empuje (bisagra con carga axial)',
  'A1 - squat + pull (axial squat)': 'A1 - sentadilla + jalón (sentadilla con carga axial)',
  'A2 - leg press + pull (non-axial)': 'A2 - prensa de piernas + jalón (sin carga axial)',
  'B1 - hip thrust + push (non-axial hinge)': 'B1 - empuje de cadera + empuje (bisagra sin carga axial)',
  'B2 - deadlift + push (axial hinge)': 'B2 - peso muerto + empuje (bisagra con carga axial)',
  'Lower 1 - squat-led': 'Tren inferior 1 - enfocado en sentadilla',
  'Lower 2 - hinge-led': 'Tren inferior 2 - enfocado en bisagra',
  'Legs 1 - squat-led (axial squat)': 'Piernas 1 - enfocado en sentadilla (sentadilla con carga axial)',
  'Legs 2 - hinge-led (axial hinge, leg press)': 'Piernas 2 - enfocado en bisagra (bisagra con carga axial, prensa de piernas)',
  'A - squat + pull (axial squat; clean day)': 'A - sentadilla + jalón (sentadilla con carga axial; día de cargada)',
  'B - deadlift + push (axial hinge; snatch day)': 'B - peso muerto + empuje (bisagra con carga axial; día de arranque)',
  'In-season A - sprint/jumps + single-leg squat + pull': 'En temporada A - sprint / saltos + sentadilla a una pierna + jalón',
  'In-season B - jumps + light hinge + push': 'En temporada B - saltos + bisagra ligera + empuje',
  'S1 - jump + knee + pull': 'S1 - salto + rodilla + jalón',
  'S2 - medball + hip + push': 'S2 - balón medicinal + cadera + empuje',
  'S3 - Olympic + strength': 'S3 - olímpicos + fuerza',
  'A1 - squat + pull (axial squat; clean day)': 'A1 - sentadilla + jalón (sentadilla con carga axial; día de cargada)',
  'A2 - leg press / belt squat + pull (clean day)': 'A2 - prensa de piernas / sentadilla con cinturón + jalón (día de cargada)',
  'B1 - non-axial hinge + push (snatch day)': 'B1 - bisagra sin carga axial + empuje (día de arranque)',
  'B2 - deadlift + push (axial hinge; snatch day)': 'B2 - peso muerto + empuje (bisagra con carga axial; día de arranque)',
  "Fri 'speed' - hinge + vertical press": "Vie 'velocidad' - bisagra + press vertical",
  "Mon 'Speed' - squat + row": "Lun 'velocidad' - sentadilla + remo",
  'Thu (strength) - squat + vertical pull': 'Jue (fuerza) - sentadilla + jalón vertical',
  "Tue 'strength' - hinge + bench": "Mar 'fuerza' - bisagra + press de banca",
  'A1 - squat + lunge + both pulls': 'A1 - sentadilla + zancada + ambos jalones',
  'A2 - leg press + lunge + both pulls': 'A2 - prensa de piernas + zancada + ambos jalones',
  'B1 - hinge + single-leg hinge + both pushes': 'B1 - bisagra + bisagra a una pierna + ambos empujes',
  'B2 - deadlift + single-leg hinge + both pushes': 'B2 - peso muerto + bisagra a una pierna + ambos empujes',
  'Day A - squat + pull / single-leg hinge + press': 'Día A - sentadilla + jalón / bisagra a una pierna + press',
  'Day B - hinge + push / single-leg squat + pull': 'Día B - bisagra + empuje / sentadilla a una pierna + jalón',
  'Bootcamp 1 - squat + row + single-leg hinge': 'Bootcamp 1 - sentadilla + remo + bisagra a una pierna',
  'Bootcamp 2 - hinge + presses': 'Bootcamp 2 - bisagra + presses',
  'Bootcamp 3 - single-leg squat + pulls + arms': 'Bootcamp 3 - sentadilla a una pierna + jalones + brazos',
  'Bootcamp A - squat + pull / single-leg hinge + press': 'Bootcamp A - sentadilla + jalón / bisagra a una pierna + press',
  'Bootcamp B - hinge + push / single-leg squat + pull': 'Bootcamp B - bisagra + empuje / sentadilla a una pierna + jalón',
  'Hybrid 1 - clean + squat': 'Híbrido 1 - cargada + sentadilla',
  'Hybrid 2 - snatch + deadlift': 'Híbrido 2 - arranque + peso muerto',
  'Deadlift + clean day': 'Día de peso muerto + cargada',
  'Press + snatch day': 'Día de press + arranque',
  'Squat day': 'Día de sentadilla',
  'Clean + push': 'Cargada + empuje',
  'WOD-only class': 'Clase solo de WOD',
  'Fri - easy aerobic + jumps + single-leg hinge + OH press': 'Vie - aeróbico suave + saltos + bisagra a una pierna + press sobre la cabeza',
  'Sat - leg press / lunge + pulls': 'Sáb - prensa de piernas / zancada + jalones',
  'Tue - sprint + jumps + bench': 'Mar - sprint + saltos + press de banca',
  'Day A - squat + pull / single-leg hinge + press (bodyweight)': 'Día A - sentadilla + jalón / bisagra a una pierna + press (peso corporal)',
  'Day B - hinge + push / single-leg squat + pull (bodyweight)': 'Día B - bisagra + empuje / sentadilla a una pierna + jalón (peso corporal)',
  'Bootcamp 1 - squat + row + single-leg hinge (bodyweight)': 'Bootcamp 1 - sentadilla + remo + bisagra a una pierna (peso corporal)',
  'Bootcamp 2 - hinge + presses (bodyweight)': 'Bootcamp 2 - bisagra + presses (peso corporal)',
  'Bootcamp 3 - single-leg squat + pulls + arms (bodyweight)': 'Bootcamp 3 - sentadilla a una pierna + jalones + brazos (peso corporal)',
  'Bootcamp A - squat + pull / single-leg hinge + press (bodyweight)': 'Bootcamp A - sentadilla + jalón / bisagra a una pierna + press (peso corporal)',
  'Bootcamp B - hinge + push / single-leg squat + pull (bodyweight)': 'Bootcamp B - bisagra + empuje / sentadilla a una pierna + jalón (peso corporal)',
  'Full-body dynamic effort (week A hinge speed)': 'Cuerpo completo, esfuerzo dinámico (semana A: velocidad en bisagra)',
  'Full-body max effort (week A squat-led)': 'Cuerpo completo, esfuerzo máximo (semana A: enfocado en sentadilla)',
  'Deadlift day': 'Día de peso muerto',
  'Press day': 'Día de press',
  'Dynamic-effort lower (week A: hinge speed)': 'Tren inferior, esfuerzo dinámico (semana A: velocidad en bisagra)',
  'Dynamic-effort lower (week B: squat speed)': 'Tren inferior, esfuerzo dinámico (semana B: velocidad en sentadilla)',
  'Dynamic-effort upper (week A)': 'Tren superior, esfuerzo dinámico (semana A)',
  'Dynamic-effort upper (week B)': 'Tren superior, esfuerzo dinámico (semana B)',
  'Max-effort lower (squat-led week A)': 'Tren inferior, esfuerzo máximo (semana A: enfocado en sentadilla)',
  'Max-effort lower (hinge-led week B)': 'Tren inferior, esfuerzo máximo (semana B: enfocado en bisagra)',
  'Max-effort upper (week A)': 'Tren superior, esfuerzo máximo (semana A)',
  'Max-effort upper (week B)': 'Tren superior, esfuerzo máximo (semana B)'
};

/** 04 v1.1 profile / variant names without name_es */
export const ES_PROFILE_NAMES = {
  'Aesthetics 12-week PPL (6 days)': 'Estética 12 semanas Empuje / Jalón / Piernas (6 días)',
  'Aesthetics 3-day builder': 'Estética - constructor de 3 días',
  'No-gi / submission grappling': 'Grappling sin gi / de sumisión (No-Gi)',
  'Bootcamp option 1': 'Bootcamp opción 1',
  'Bootcamp option 2': 'Bootcamp opción 2',
  'Heavyweight': 'Peso pesado',
  'Lead / sport climbing': 'Escalada deportiva (de dificultad)',
  'Speed climbing': 'Escalada de velocidad',
  'Defenders': 'Defensas',
  'Forwards': 'Delanteros',
  'Midfielders': 'Mediocampistas',
  'Flag QB': 'Mariscal de campo de flag (Flag QB)',
  'Edge rusher (DE / OLB in a 3-4)': 'Cazador de mariscales por fuera (Edge Rusher: DE / OLB en 3-4)',
  "Men's artistic (6 events incl. rings, pommel, p-bars, high bar)": 'Artística varonil (6 aparatos, incluye anillas, arzones, paralelas y barra fija)',
  'Doubles / relay': 'Dobles / relevos',
  'Pro division (heavier stations)': 'División Pro (estaciones más pesadas)',
  'Heavy weight classes': 'Categorías de peso pesado',
  'Kata (forms)': 'Kata (formas)',
  'Face-off specialist (FOGO)': 'Especialista en saque neutral (FOGO)',
  'Long-stick midfielder (LSM)': 'Mediocampista de palo largo (LSM)',
  'Draw specialist': 'Especialista en saque (Draw)',
  'MM athletic ADVANCED': 'MM atlético AVANZADO',
  'MM athletic MID': 'MM atlético INTERMEDIO',
  'MM athletic STARTING (off-season block 1)': 'MM atlético INICIAL (bloque 1 fuera de temporada)',
  'Muay Thai (clinch heavy)': 'Muay Thai (con mucho clinch)',
  'Long course (Beast 21 km / Ultra)': 'Recorrido largo (Beast 21 km / Ultra)',
  'Older adults (60+, or foundation / injury based)': 'Adultos mayores (60+, o por base / lesión)',
  'Bikini': 'Bikini',
  'Classic physique': 'Classic Physique',
  'Figure': 'Figure',
  "Men's bodybuilding": 'Fisicoculturismo varonil (Bodybuilding)',
  "Men's physique": "Men's Physique",
  'Wellness': 'Wellness',
  "Women's physique / bodybuilding": "Women's Physique / fisicoculturismo femenil",
  'Senior divisions (60+; also offered to 50+)': 'Divisiones senior (60+; también para 50+)',
  'Back row (flankers / No. 8)': 'Tercera línea (flankers / número 8)',
  'Back three (wings / fullback)': 'Línea de tres (alas / zaguero)',
  'Centres': 'Centros',
  'Front row (props / hooker)': 'Primera línea (pilares / talonador)',
  'Halves (9 / 10)': 'Medios (9 / 10)',
  'Locks': 'Segunda línea (Locks)',
  'Full-back / wing-back': 'Lateral / carrilero',
  'Wide midfielder / winger': 'Volante por banda / extremo',
  'Softball catcher': 'Receptor de sóftbol (Catcher)',
  'Strength 12-week (percent + RPE)': 'Fuerza 12 semanas (porcentaje + RPE)',
  'Poomsae (forms)': 'Poomsae (formas)',
  'Blocker': 'Bloqueador',
  'Defender': 'Defensor',
  'L3 / national-level lifter (5-6 days)': 'Pesista L3 / nivel nacional (5-6 días)',
  'Greco-Roman': 'Grecorromana',
  'Upper weights / heavyweight': 'Categorías altas / peso pesado'
};

/** any other key (by i18n key) that the sources leave without Spanish */
export const ES_MISC = {};
