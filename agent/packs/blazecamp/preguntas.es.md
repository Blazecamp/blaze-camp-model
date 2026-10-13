# Preguntas del plan builder de Blaze Camp (modelo 1.4.0)

Generado desde `GET /api/questions?lang=es`. **Siempre pide la lista viva antes de preguntar**: esto es solo una copia para leer de un tirón.

`when` = solo se pregunta si se cumple. Lo que no se pregunte queda en su default.

## `lang` · Idioma
- *tipo*: choice
- *opciones*: Inglés (`en`) · Español (`es`)
- *default*: `"en"`
- *obligatoria*
- The plan language (not an answers field: pass it as `lang`). Ask in the person's language; both are complete.

## `role` · Este plan es para
- *tipo*: choice
- *opciones*: Mí (`self`) · Un cliente (soy coach) (`client`)
- *default*: `"self"`
- *obligatoria*

## `health_route` · Revisión de salud de tu cliente
- *when*: `role == "client"`
- *tipo*: choice
- *opciones*: Hacer la revisión de salud (PAR-Q) con mi cliente ahora (`coach_screen`) · Omitirlo: soy profesional del fitness y evalúo a mis clientes con mi propio proceso de ingreso (`coach_own_sop`)
- *default*: `"coach_screen"`
- *obligatoria*
- Elegiste omitir la revisión de salud. Confirmas que eres profesional del fitness y que evalúas a este cliente con tus propios procedimientos de ingreso (cuestionario de salud y autorización médica cuando haga falta) antes de que empiece. Blaze Camp no ha evaluado a este cliente.

## `age` · Edad
- *tipo*: integer
- *default*: `30`
- *obligatoria*
- Menores de 18: un padre, madre o tutor acepta la liberación en el último paso.

## `weight` · Peso corporal
- *tipo*: number
- *default*: `170`
- *obligatoria*

## `unit` · Unidades
- *tipo*: choice
- *opciones*: Libras (lb) (`lb`) · Kilogramos (kg) (`kg`)
- *default*: `"lb"`
- *obligatoria*

## `years` · Años entrenando de forma constante
- *tipo*: choice
- *opciones*: Nuevo (`0`) · 6-12 meses (`0.5`) · 1-2 años (`1`) · 2-3 años (`2`) · 3-5 años (`3`) · 5+ años (`5`)
- *default*: `1`
- *obligatoria*

## `goal` · Tu objetivo
- *tipo*: choice
- *opciones*: Ganar músculo (`muscle`) · Ganar fuerza (`strength`) · Perder grasa (`fat_loss`) · Condición general (`general`) · Atleta de un deporte (`athletic`) · Mantenerme activo (`active`)
- *obligatoria*

## `sport.id` · Tu deporte
- *when*: `goal == "athletic"`
- *tipo*: choice
- *opciones*: Fútbol americano (`american_football`) · Flag football (fútbol americano sin contacto) (`flag_football`) · Baloncesto (básquetbol) (`basketball`) · Béisbol (`baseball`) · Sóftbol (`softball`) · Fútbol (soccer) (`soccer`) · Hockey sobre hielo (`ice_hockey`) · Voleibol (sala) (`volleyball`) · Voleibol de playa (`beach_volleyball`) · Lacrosse (masculino y femenino) (`lacrosse`) · Hockey sobre césped (`field_hockey`) · Rugby (`rugby`) · Porrismo / animación (cheerleading, STUNT) (`cheerleading`) · Ultimate (frisbee) (`ultimate`) · Danza competitiva / equipo de baile (drill team) (`dance_team`) · Natación (`swimming`) · Clavados (`diving`) · Waterpolo (`water_polo`) · Atletismo (pista y campo) (`track_and_field`) · Campo traviesa (cross country) y carreras de ruta (`distance_running`) · Triatlón (`triathlon`) · Ciclismo (`cycling`) · Remo (`rowing`) · Esquí / snowboard (competitivo) (`ski_snowboard`) · Patinaje artístico (`figure_skating`) · Lucha (folkstyle / libre / grecorromana) (`wrestling`) · Boxeo (`boxing`) · MMA (artes marciales mixtas) (`mma`) · Jiu-jitsu brasileño (BJJ) / grappling (`bjj`) · Judo (`judo`) · Karate (`karate`) · Taekwondo (`taekwondo`) · Kickboxing / Muay Thai (`kickboxing_muay_thai`) · Esgrima (`fencing`) · Powerlifting (levantamiento de potencia) (`powerlifting`) · Halterofilia (levantamiento olímpico) (`olympic_weightlifting`) · Strongman (hombre más fuerte) (`strongman`) · CrossFit (competitivo) (`crossfit`) · HYROX (competitivo) (`hyrox`) · Carreras de obstáculos (OCR, Spartan y similares) (`ocr`) · Fisicoculturismo (Bodybuilding / Physique) (`bodybuilding_physique`) · Gimnasia artística (`gymnastics`) · Escalada / búlder (bouldering) (`climbing`) · Tenis (`tennis`) · Pickleball (torneos) (`pickleball`) · Pádel (torneos) (`padel`) · Golf (`golf`) · Bádminton / squash / ráquetbol / tenis de mesa (`racket_other`) · Boliche (bowling) (`bowling`) · Patineta (skateboarding: street / park) (`skateboarding`) · Surf (competitivo) (`surfing`) · Patinaje de velocidad (pista larga / corta) (`speed_skating`)
- *obligatoria*
- Each sport lists its positions (sport.position) and, for some, a second choice (sport.detail).

## `sport.position` · Posición o prueba (opcional)
- *when*: `goal == "athletic" and the sport has positions`
- *tipo*: choice
- *opciones de*: `sport.id -> positions`
- No sé / de todo

## `sport.detail` · Segunda opción
- *when*: `goal == "athletic" and the sport has a second_choice`
- *tipo*: choice
- *opciones de*: `sport.id -> second_choice.options`

## `sport.season` · Tu temporada
- *when*: `goal == "athletic"`
- *tipo*: choice
- *opciones*: Fuera de temporada (`no_season`) · La temporada empieza el (`next_season_start`) · En temporada hasta el (`in_season_until`) · Competencia el (`competition_date`)
- *default*: `"no_season"`

## `sport.season_date` · Fecha
- *when*: `sport.season != "no_season"`
- *tipo*: date
- *obligatoria*

## `sport.level` · Nivel de competencia (opcional)
- *when*: `goal == "athletic"`
- *tipo*: choice
- *opciones*: Juvenil / club / categorías por edad (`youth_club`) · Escolar / preparatoria (`high_school`) · Universitario (`college`) · Profesional (`pro`) · Máster / veteranos (`masters`) · Amateur (`amateur`)

## `sport.practice` · Prácticas de equipo por semana
- *when*: `goal == "athletic"`
- *tipo*: integer
- *default*: `0`
- Team practices are not built into the plan; the plan tells the athlete to account for them (CH5-01).

## `activity.id` · Tu actividad
- *when*: `goal == "active"`
- *tipo*: choice
- *opciones*: Pickleball (`rec_pickleball`) · HYROX (`hyrox_fitness`) · Tenis (`rec_tennis`) · Pádel (`rec_padel`) · Golf (`rec_golf`) · Liga recreativa (elige el deporte) (`rec_league`) · Correr por salud (primer 5K / 10K, club de corredores) (`run_fitness`) · Senderismo y caminata con mochila (rucking) (`hike_ruck`) · Ciclismo / ciclismo indoor (`cycling_fitness`) · Natación por salud (incluye entrenamientos tipo máster) (`lap_swim`) · Preparación para esquí o snowboard (`ski_snow_prep`) · Surf y paddle (`surf_paddle`) · Baile y clases de fitness (`dance_fitness`) · Triatlón por salud (primera carrera / grupos de edad) (`rec_triathlon`) · Remo / remo indoor (`rec_rowing`) · Clases estilo CrossFit (`crossfit_class`) · Un poco de todo (`weekend_warrior`) · Clases de boxeo, kickboxing o artes marciales (`rec_combat_fitness`) · Escalada / búlder (bouldering) en gimnasio (`rec_climbing`) · Carrera de obstáculos (primer Spartan / Tough Mudder) (`rec_ocr`) · Bádminton, squash, ráquetbol o tenis de mesa (`rec_racket_other`) · Disc golf (golf de disco) (`rec_disc_golf`) · Boliche (bowling) (`rec_bowling`) · Carrera de montaña (trail running) (`rec_trail_running`) · Ciclismo de montaña (MTB) (`rec_mountain_biking`) · Kayak, canoa, wakeboard o esquí acuático (`rec_paddle_water`)
- *obligatoria*

## `activity.league` · ¿Qué deporte? (opcional)
- *when*: `goal == "active" and the activity has league choices`
- *tipo*: choice
- *opciones de*: `activity.id -> league`

## `activity.style` · ¿Qué estilo? (opcional)
- *when*: `goal == "active" and the activity has style choices`
- *tipo*: choice
- *opciones de*: `activity.id -> style`

## `activity.play_days` · ¿Qué días juegas? (opcional)
- *when*: `goal == "active"`
- *tipo*: multi
- *opciones*: Lunes (`Mon`) · Martes (`Tue`) · Miércoles (`Wed`) · Jueves (`Thu`) · Viernes (`Fri`) · Sábado (`Sat`) · Domingo (`Sun`)
- *default*: `[]`

## `activity.event_date` · Fecha del evento (opcional)
- *when*: `goal == "active"`
- *tipo*: date
- Las semanas más duras terminan una semana antes.

## `focus` · Músculos de enfoque (opcional, hasta 2)
- *when*: `goal == "muscle"`
- *tipo*: multi
- *opciones*: Pecho (`chest`) · Espalda (`back`) · Hombros (deltoides anterior, lateral y posterior) (`shoulders`) · Forma en V (espalda y hombros; usa las dos opciones) (`v_taper`) · Cuádriceps (`quads`) · Glúteos (`glutes`) · Isquiotibiales (`hamstrings`) · Bíceps (`biceps`) · Tríceps (`triceps`) · Pantorrillas (`calves`) · Core / abdomen (`core`)
- *default*: `[]`
- Elige hasta 2 músculos para que crezcan un poco más rápido (opcional). El plan les suma unas 2 series por semana.

## `format` · ¿Cómo te gusta entrenar?
- *when*: `goal in ["fat_loss", "general"]`
- *tipo*: choice
- *opciones*: Sesiones de gimnasio (`gym`) · Circuitos bootcamp (`bootcamp`)
- *default*: `"gym"`

## `days` · Días de entrenamiento por semana
- *tipo*: choice
- *opciones*: 2 (`2`) · 3 (`3`) · 4 (`4`) · 5 (`5`) · 6 (`6`)
- *default*: `3`
- *obligatoria*
- Con 2 días se puede. Cada músculo grande se sigue entrenando. Un tercer día deja que cada músculo llegue a 10 series.

## `weekdays` · ¿Qué días?
- *tipo*: multi
- *opciones*: Lunes (`Mon`) · Martes (`Tue`) · Miércoles (`Wed`) · Jueves (`Thu`) · Viernes (`Fri`) · Sábado (`Sat`) · Domingo (`Sun`)
- Exactly `days` weekdays, or leave it out: the plan then uses its template's own days.

## `equipment` · ¿Dónde entrenas?
- *tipo*: choice
- *opciones*: Gimnasio comercial completo (`FULL_GYM`) · Gimnasio básico (sin máquinas especiales) (`BASIC_GYM`) · Gimnasio en casa (rack + barra + mancuernas) (`HOME_BARBELL`) · Casa: mancuernas + banco (`HOME_DB_BENCH`) · Solo kettlebells (pesas rusas) (`KB_ONLY`) · Solo peso corporal (`BODYWEIGHT`) · Gimnasio de hotel (`HOTEL_GYM`) · Campo / pista / equipo al aire libre (`FIELD_TRACK_KIT`)
- *default*: `"FULL_GYM"`
- *obligatoria*

## `split` · Cómo se divide la semana
- *when*: `goal == "muscle" and days in [4, 6]`
- *tipo*: choice
- *opciones*: Días de cuerpo completo del coach (`default`) · Tren superior / inferior (`upper_lower`) · Empuje / tirón / piernas (`ppl`)
- *default*: `"default"`
- upper_lower only with 4 days, ppl only with 6 days.

## `supersets` · Superseries
- *tipo*: choice
- *opciones*: Como está planeado (`normal`) · Más superseries (`more`)
- *default*: `"normal"`
- more = the template's exercise pairs are done as supersets (CH7-07).

## `weeks` · Duración del plan
- *tipo*: choice
- *opciones*: 12 semanas (`12`) · 8 semanas (`8`)
- *default*: `12`

## `start_date` · Fecha de inicio
- *tipo*: date
- Default: the next Monday.

## `tests` · ¿Medirte al inicio y al final? (opcional)
- *tipo*: multi
- *opciones*: Fuerza (`strength`) · Cardio (`cardio`) · Velocidad / agilidad (`speed_agility`) · Saltos (`jumps`) · Peso corporal / medidas (`body`)
- *default*: `[]`
- Tests only in week 1 and the last week.

## `extras` · ¿Algo extra? (opcional)
- *tipo*: multi
- *opciones*: mancuernas (dumbbells) (`dumbbell`) · pesas rusas (kettlebells) (`kettlebell`) · barra (barbell) (`barbell`) · rack de sentadillas (`rack`) · banco (`bench`) · barra de dominadas (pull-up bar) (`pullup_bar`) · estación de poleas (cable) (`cable`) · balón medicinal (medball) (`medball`) · cajón (`box`) · trineo (sled) (`sled`) · cuerda para saltar (`jump_rope`) · entrenador de suspensión (TRX) (`trx`) · máquina de cardio con contador de calorías (`cardio_machine_cal`) · espacio abierto (20 m o más) (`open_space_long`)
- *default*: `[]`

## `pain` · ¿Te duele algo? (opcional)
- *tipo*: list
- *default*: `[]`
- Toca una zona y luego cuánto duele.

## `health` · Revisión de salud
- *when*: `not (role == "client" and health_route == "coach_own_sop")`
- *tipo*: choice
- *opciones*: Ninguna aplica a mi caso (`none`) · Algunas aplican (`some`)
  - `heart`: Dolor en el pecho, desmayos o una condición cardíaca
  - `surgery_6mo`: Cirugía o fractura en los últimos 6 meses
  - `pregnant_postpartum_6mo`: Embarazo, o parto en los últimos 6 meses
  - `injury_in_treatment`: Una lesión en tratamiento actualmente
  - `doctor_said_no`: Un médico te indicó no entrenar
- *obligatoria*
- Un sí no detiene tu plan. El plan se crea con un aviso de salud: consulta primero a un profesional médico.

## `safety` · Revisión de salud
- *when*: `health == "some"`
- *tipo*: yes_no_each
- *default*: `{"heart":false,"surgery_6mo":false,"pregnant_postpartum_6mo":false,"injury_in_treatment":false,"doctor_said_no":false}`
- *obligatoria*

## `accepted` · Términos y liberación (obligatorio)
- *tipo*: release
- *default*: `false`
- *obligatoria*
- Show the release text for the version that applies (release.client for the person themselves, release.coach for a coach building for a client, release.minor in addition under 18), then ask for an explicit "I accept". Never assume it.

## `guardian` · Soy el padre, la madre o el tutor legal de este atleta (menor de 18), leí la liberación y la acepto en su nombre.
- *when*: `age < 18`
- *tipo*: boolean
- *default*: `false`
- *obligatoria*
- Menores de 18 años: un padre, madre o tutor legal debe leer y aceptar esta liberación de responsabilidad. Nombre del tutor: [ ]
