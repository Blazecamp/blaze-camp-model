# Qué es esto

Este repositorio contiene el modelo de entrenamiento del Coach Lalo (Gerardo Vera, Blaze Camp), coach Master NASM. Es un modelo completo de coaching que nace de su experiencia, y es su propiedad intelectual: cómo clasifica los ejercicios, cuántas series le da a cada grupo muscular, cómo ordena una sesión y una semana, cómo un plan se vuelve más difícil semana a semana, y cómo cambia todo eso según el deporte, la edad de la persona, el equipo y el dolor. El modelo está escrito dos veces: en lenguaje sencillo para coaches, y como archivos de datos para desarrolladores y agentes de IA. La meta es una herramienta simple. Una persona da unas pocas respuestas, recibe el plan completo de una vez y lo ajusta por su cuenta. Todo es de uso libre bajo la licencia MIT. Este es el modelo v1.3. Algunas partes siguen marcadas como **PROPOSED**: el equipo las sugirió y el coach todavía no las aprueba. Un motor de planes (versión 0.5) arma planes a partir del modelo. El coach todavía no ha calificado sus planes de muestra.

> **No es asesoría médica. Uso bajo su propio riesgo.** Si usa esto con clientes o con otras personas, necesita su propia evaluación de salud, liberación de responsabilidad y seguro. Lea [safety-and-liability.md](safety-and-liability.md) y [DISCLAIMER.es.md](../../DISCLAIMER.es.md).

*English: [what-this-is.md](what-this-is.md).*

**Sobre esta traducción.** Las citas del coach están en inglés, como él las dijo, con una traducción entre paréntesis. La traducción es nuestra, no son palabras suyas. Las etiquetas (`PROPOSED`, `OBSERVED` ...), los códigos de respuesta (`R3-VOL-04`) y los nombres de archivos se quedan en inglés, igual que en todo el repositorio. Este texto en español es PROPOSED hasta que el coach, o un coach de su confianza, lo revise (R2-GEN-08).

## La regla

**Entran unas pocas respuestas. Sale el plan completo, una sola vez. La gente lo ajusta por su cuenta.**

| | |
|---|---|
| Qué entra | Objetivo, deporte o actividad, experiencia de entrenamiento, edad, peso corporal, días de entrenamiento, equipo y dolor. Opcional: hasta dos músculos de enfoque. Un **músculo de enfoque** (Focus muscle) es el músculo que la persona más quiere trabajar. Recibe de 1 a 3 series extra por semana. La persona también acepta los términos y la liberación de responsabilidad: sin eso no se arma ningún plan (R4-SCP-02). No se pregunta cuánto dura la sesión (R4-SES-01). |
| Qué sale | El plan completo, con todas las semanas a la vista desde el inicio: 12 semanas (la duración que él prefiere), 8 semanas, un plan de mantenimiento, un año completo para la población general, o un plan de temporada para atletas. Cada día se arma sobre una de sus propias plantillas y su tamaño se define por el número de ejercicios. En cada día aparece un tiempo promedio, solo como información. |
| Qué pasa después | La persona o su coach ajusta el plan: cambia un ejercicio, agrega, quita, apaga un bloque, cambia las series. "It should be all editable as they need to." (Todo debe poder editarse según lo necesiten.) (CX-04). No se registra nada. No se guarda nada. |

## Por qué

Estas son palabras del propio coach. El código después de cada cita es el id de la respuesta de donde viene (vea [cómo leer los ids](../04-decisions/index.md)).

> "I want this to be very simple. This works. We're not going to need a lot of inputs for this." (R3-VOL-04)
>
> (Quiero que esto sea muy simple. Esto funciona. No vamos a necesitar muchos datos de entrada.)

> "I want them to be able to kick out a program, and that's it. That's the program." (R3-VOL-04)
>
> (Quiero que puedan sacar un programa, y ya. Ese es el programa.)

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)
>
> (Ya es una plantilla, y usted la ajusta según lo necesite.)

> "We're only doing outputs, and people can change accordingly." (R3-VOL-02)
>
> (Solo entregamos resultados, y la gente los cambia según corresponda.)

> "You need to stop trying to be responsible for the people's time." (CT-01)
>
> (Tienen que dejar de querer hacerse responsables del tiempo de la gente.)

Sobre a quién debe servir, dijo "different gyms, different people, different coaches, and all of our clients" (distintos gimnasios, distintas personas, distintos coaches y todos nuestros clientes), y que debe ser gratis "for anybody to use in their own app and their own training" (para que cualquiera lo use en su propia app y en su propio entrenamiento) (conversación).

## Qué es el modelo

En sus palabras: "The hardest thing to understand is the categorization of everything" (lo más difícil de entender es la categorización de todo) (conversación). Por eso el modelo empieza ahí, y todas las demás partes se apoyan en eso.

| Parte | Qué contiene | Lea |
|---|---|---|
| Categorías | Cada ejercicio se etiqueta en todos sus lentes a la vez: familia (atlético, resistencia, core, cardio), patrón de movimiento, un lado o dos, plano, músculo grande o pequeño, equipo y nivel. En sus palabras, "this is the whole taxonomy of each exercise" (esta es toda la taxonomía de cada ejercicio) (CAT-01). | [categories](../02-model/categories.md) |
| Biblioteca de ejercicios | Su MASTER EXERCISE LIBRARY con esas etiquetas. Cada **espacio** (slot, un lugar en el plan) tiene una primera elección y una lista de **alternativas** (swaps, otros ejercicios del mismo tipo). Cada alternativa dice qué conserva y qué pierde. Los ejercicios que propuso el equipo son extras opcionales (optional add-ons): una plantilla nunca los elige (R4-LIB-01). | [exercise library](../02-model/exercise-library.md) |
| Volumen | **Series duras** por semana para cada grupo muscular. Una serie dura es una serie de trabajo que termina con 1 a 3 repeticiones en reserva. Inicios y topes por nivel, un mínimo de 10 cuando hay 3 o más días de entrenamiento, y unas 6 a 8 series para cada músculo grande cuando hay 2 días. | [volume](../02-model/volume.md) |
| La escalera (stairway) | Su palabra para la forma en que sube todo plan: pasos pequeños al inicio, pasos más grandes después de la mitad, y las semanas más duras al final. Cada grupo muscular llega a sus series finales planeadas. Las repeticiones y el peso se escriben como una regla que la persona aplica. | [stairway](../02-model/stairway.md) |
| Sesiones | Core primero, potencia antes que fuerza, horizontal antes que vertical, cadera + empuje y rodilla + jalón. Sus propias plantillas de día (Día A, Día B, empuje / jalón / piernas) son el esqueleto. El tamaño de una sesión se define por el número de ejercicios, no por minutos. | [sessions](../02-model/sessions.md) |
| Bilateral y unilateral | Cuánto trabajo se hace con las dos piernas o con una, según el tipo de atleta. | [bilateral and unilateral](../02-model/bilateral-unilateral.md) |
| Equipo | Máquinas, peso libre y qué usar cuando falta algo. Sin ligas ni bandas elásticas. | [equipment](../02-model/equipment.md) |
| Atletas y personas activas | Saltos, lanzamientos y levantamientos olímpicos según el deporte. Reglas para adultos mayores, jóvenes y dolor. | [athletes](../02-model/athletes.md), [sports](../02-model/sports.md), [stay athletic and active](../02-model/stay-athletic-and-active.md) |
| Planes y pruebas | Duración de los planes, el año, las temporadas, y pruebas solo al inicio y al final. | [plans and calendar](../02-model/plans-and-calendar.md), [testing](../02-model/testing.md) |
| El motor de planes | Código que convierte las reglas y las respuestas de una persona en un plan. La versión 0.5 parte de sus plantillas y no ajusta nada por tiempo. | [for developers](for-developers.md) |

El modelo sale de sus propias hojas y de sus propias respuestas. Sus raíces son el Dr. Pat Davidson, el Dr. Mike Israetel y la ciencia del entrenamiento desde primeros principios. Él está "building the segmentation and the buckets from the ground up" (construyendo la segmentación y las categorías desde cero) (conversación). Vea [lineage](../01-philosophy/lineage.md).

## Para quién es

Él mismo nombró a los usuarios: "clients", "coaches", "trainers", "strength and conditioning coaches", "anyone" (clientes, coaches, entrenadores, preparadores físicos, cualquier persona) (GEN-01).

| Usted es | Qué recibe | Empiece por |
|---|---|---|
| Coach, entrenador o gimnasio | Todo su sistema, con la razón de cada regla y los números que usted puede cambiar. | [for-coaches.md](for-coaches.md) |
| Una persona que entrena | Una imagen clara de cómo se arma un plan. El sitio web que armaría uno en pocos toques todavía no existe. | [how-a-plan-is-made.md](how-a-plan-is-made.md) |
| Desarrollador | El modelo como datos, libre para construir sobre él. | [for-developers.md](for-developers.md) |
| Agente de IA | Un archivo de contexto y una guía de trabajo. | [CONTEXT_FOR_AI.md](../CONTEXT_FOR_AI.md), [AGENTS.md](../../AGENTS.md), [llms.txt](../../llms.txt) |
| Revisor | Qué revisar y cómo reportarlo. | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |

Por ahora, de esta carpeta solo esta página está en español. Las demás páginas enlazadas están en inglés. La guía [adding-exercises.es.md](../adding-exercises.es.md) y el aviso legal [DISCLAIMER.es.md](../../DISCLAIMER.es.md) sí están en español.

## Qué puede hacer con esto

- **Leer cómo programa él, y por qué.** Cada regla nombra la respuesta donde él la decidió.
- **Usar la biblioteca de ejercicios** con sus etiquetas en su propio gimnasio o producto.
- **Cambiar los números para su propia gente.** En sus palabras, "this is all customizable" (todo esto se puede personalizar) (R2-VOL-06). Vea [for-coaches.md](for-coaches.md).
- **Construir su propia app sobre los datos.** Desde el principio pensó en regalar el repositorio: "open source it to any coach and person that wants to create a training app and just use this model to put it all together" (abrirlo como código abierto para cualquier coach o persona que quiera crear una app de entrenamiento y usar este modelo para armarla) (GEN-03).
- **Agregar ejercicios.** Vea [adding-exercises.es.md](../adding-exercises.es.md) (inglés: [adding-exercises.md](../adding-exercises.md)).
- **Ver sus hojas originales**, guardadas como copias de Excel en `raw/` y como texto en `dumps/`, "so people can download it and play with it" (para que la gente las descargue y juegue con ellas) (conversación).
- **Generar planes de muestra** con el motor. Trátelos como borradores hasta que el coach los califique.

## Qué no es

| No es | Por qué | Fuente |
|---|---|---|
| Asesoría médica | Es información general de acondicionamiento físico. Quien tiene una condición de salud consulta primero a un profesional. | [DISCLAIMER.es.md](../../DISCLAIMER.es.md) |
| Un sitio web o una app terminada | Primero van los datos y el contexto. El sitio web todavía no está hecho. | conversación; GEN-03 |
| Un sistema de seguimiento | No hay chequeos semanales (check-ins), ni una bitácora que la herramienta lea, ni ajustes semanales hechos por la herramienta. | R3-VOL-02, R3-VOL-04 |
| Un recolector de datos | "I don't want any data kept." (No quiero que se guarde ningún dato.) | R3-GEN-01 |
| Un plan de estilo de vida o de nutrición | "I just need the workouts here." (Aquí solo necesito los entrenamientos.) No hay preguntas sobre sueño, estrés o trabajo. | R2-GEN-04 |
| Un método empaquetado | Él no construye sobre 5/3/1, el Texas Method ni la tabla de Prilepin. | conversación |
| Un reemplazo del ojo de un coach | El plan es una plantilla. Una persona o un coach todavía tiene que adaptarlo al día. | R3-VOL-04, R3-SES-02, CX-04 |
| Un reloj | No ajusta los planes a una duración de sesión. Cuánto dura una sesión depende de la persona. | CT-01, R4-SES-01 |
| "El mejor del mundo" ni un método para prevenir lesiones | El repositorio no hace esas afirmaciones. | R4-REL-03 |
| Algo confirmado por completo | Algunos números y mecanismos son del equipo. Están marcados PROPOSED hasta que él los apruebe. Cada perfil de deporte lleva una etiqueta: confirmado por el coach (23), basado en un deporte parecido (67) o propuesto (37). | [registros de decisiones](../04-decisions/index.md); R4-SCP-03 |
| Algo ya calificado por el coach | Él dijo que va a calificar planes de muestra, y nombró siete. Eso todavía no ha pasado. Revisores que leyeron las 8 muestras actuales como lo haría él las calificaron entre B- y B+. | R2-GEN-07; [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) |
| Una videoteca | Los videos son opcionales. Los enlaces de video de sus hojas no son suyos y se quitaron de los datos del modelo (el modelo compilado y la biblioteca de ejercicios). Las exportaciones de sus hojas originales, en `raw/`, `dumps/` y `analysis/`, todavía los muestran. Cada ejercicio trae un enlace de búsqueda en YouTube y su nombre para copiar. | R2-GEN-02, R4-LIB-05 |
| Algo aprobado por un abogado | El aviso legal y la liberación de responsabilidad son borradores que esperan la revisión de un abogado con licencia en Florida. | [DISCLAIMER.es.md](../../DISCLAIMER.es.md) |

También deja fuera algunas cosas a propósito: no hay campo de sexo, no hay ligas, bandas elásticas ni resistencia variable, y no hay semana suave a mitad de un bloque. Vea [what he rejected](../01-philosophy/what-he-rejected.md).

## Los números

| Qué | Cuántos | Dónde vive |
|---|---|---|
| Preguntas que se le hicieron al coach | 218, en cuatro rondas (140, 45, 13 y 20). Todas tienen su respuesta. Además dio dos aclaraciones con fecha, en conversación, el 2026-10-10 (CX-01 a CX-04 y CT-01). | [coach_answers_full.md](../../coach_answers_full.md), [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md), [coach_answers_round4.md](../../coach_answers_round4.md), [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md), [coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md) |
| Registros en el catálogo de ejercicios | 939. De ellos, 732 están activos: 633 ejercicios, 72 elementos de cardio, 14 ejercicios de técnica (drills) y 13 pruebas. | `synthesis/02_exercise_catalog.json` |
| Registros que pueden ser la primera elección de un espacio | 368 (329 ejercicios, 22 elementos de cardio, 13 pruebas y 4 ejercicios de técnica). Los demás registros activos solo pueden ser alternativas (swaps). | mismo archivo, `generator.default_candidate` |
| Deportes en el selector | 52, en 5 grupos, con 146 opciones de posición o prueba | `synthesis/04_profiles.json > sports.list` |
| Actividades de "mantenerse atlético y activo" | 26 (pickleball, HYROX, ligas recreativas, correr y más) | `synthesis/04_profiles.json > activities.list` |
| Perfiles | 127. Un **perfil** es el registro que fija los ajustes del plan para un deporte, una posición o un tipo de persona. | `synthesis/04_profiles.json > profiles` |
| Plantillas de semana | 30 (6 familias de entrenamiento, cada una para 2 a 6 días por semana) | `synthesis/05_templates.json > generator_split_templates` |
| Preguntas del formulario inicial | 38 campos en uso. Muchos son opcionales o solo se muestran a algunas personas. La especificación lista 39: el campo de duración de la sesión (F24) está retirado y queda solo como historia (R4-SES-01). | `generator_spec_v1.json > inputs_schema.fields` |
| Reglas duras que nunca se rompen | 22 | [AGENTS.md](../../AGENTS.md) §10 |
| Registros de decisiones | 58 | [04-decisions](../04-decisions/index.md) |
| Libros de origen | 2 hojas de Google con 34 pestañas | `raw/`, `dumps/` |
| Idiomas | 2. Inglés primero, con un cambio completo a español (GEN-01). | `model/i18n/` |

Notas sobre los números:

- Todo lo que él saltó, dejó en blanco o no entendió en una ronda se volvió a preguntar y quedó respondido en una ronda posterior (PRG-01, FIX-01, LIB-10, LIB-12, CAT-12, R2-VOL-08).
- La copia compilada que lee el motor (`model/`) tiene 733 ejercicios: 731 de los registros de origen, más las 2 remadas de rango medio (mid-range pull) que se agregaron en la ronda 4. Esa carpeta se genera; lea `model/manifest.json` para los números vigentes.
- De los 732 registros activos, 31 son registros que propuso el equipo (27 ejercicios y 4 elementos de cardio). En la ronda 4 él convirtió 29 en extras opcionales (optional add-ons): la persona puede elegirlos y agregarlos, pero una plantilla nunca los elige (R4-LIB-01). Los 2 registros de cuello siguen como PROPOSED y no se muestran.

## Dónde vive en los datos

| Archivo | Qué es |
|---|---|
| [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | El documento maestro (v1.3). Cada regla, con su etiqueta de evidencia. |
| [generator_spec_v1.json](../../generator_spec_v1.json) | El mismo modelo como datos: `inputs_schema`, `derived_values`, `rule_tables`, `plan_types`, `tests`, `plan_editing`, `legal_and_privacy`, `validation_checks`. |
| `synthesis/` | Un documento detallado por tema, la mayoría con su gemelo `.json`. |
| `coach_answers*.md`, [coach_chat_statements.md](../../coach_chat_statements.md) | Sus propias palabras. Son la autoridad final. Gana la respuesta más nueva: primero la ronda 4 y las aclaraciones del 2026-10-10. |
| `raw/`, `dumps/` | Sus dos hojas originales, como copias de Excel y como texto. |
| `model/`, `engine/`, `tests/`, `samples/` | El modelo compilado, el motor de planes (0.5), sus pruebas y 8 planes de muestra. Estado: [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md). |

## A dónde ir después

| Quiero | Lea |
|---|---|
| Ver cómo se arma un plan paso a paso | [how-a-plan-is-made.md](how-a-plan-is-made.md) |
| Usar el modelo en mi gimnasio | [for-coaches.md](for-coaches.md) |
| Construir sobre los datos | [for-developers.md](for-developers.md) |
| Conocer los riesgos y mis obligaciones | [safety-and-liability.md](safety-and-liability.md) |
| Entender cómo piensa él | [principles](../01-philosophy/principles.md), [how he thinks](../01-philosophy/how-he-thinks.md) |
| Leer todas sus respuestas, por tema | [03-coach-answers](../03-coach-answers/index.md) |
| Buscar una palabra | [glosario](../05-reference/glossary.es.md) |
| Ver cómo se construyó esto y qué sigue | [timeline](../06-history/timeline.md), [roadmap](../06-history/roadmap.md) |
| Ver el mapa de toda la documentación | [docs/README.md](../README.md) |
