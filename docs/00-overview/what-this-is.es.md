# Qué es esto

Este repositorio contiene el modelo de entrenamiento del coach Lalo Vera (Blaze Camp). Describe cómo clasifica los ejercicios, cuántas series le da a cada grupo muscular, cómo ordena una sesión y una semana, cómo un plan se vuelve más difícil semana a semana, y cómo cambia todo eso según el deporte, la edad de la persona, el equipo y el dolor. El modelo está escrito dos veces: en lenguaje sencillo para coaches, y como archivos de datos para desarrolladores y agentes de IA. La meta es una herramienta simple. Una persona da unas pocas respuestas, recibe el plan completo de una vez y lo ajusta por su cuenta. Todo es de uso libre bajo la licencia MIT. Es un trabajo en curso. Algunas partes siguen marcadas como **PROPOSED**: el equipo las sugirió y el coach todavía no las aprueba. El motor de planes se está reconstruyendo, y el coach todavía no ha calificado los planes de muestra.

> **No es asesoría médica. Uso bajo su propio riesgo.** Si usa esto con clientes o con otras personas, necesita su propia evaluación de salud, liberación de responsabilidad y seguro. Lea [safety-and-liability.md](safety-and-liability.md) y [DISCLAIMER.es.md](../../DISCLAIMER.es.md).

*English: [what-this-is.md](what-this-is.md).*

**Sobre esta traducción.** Las citas del coach están en inglés, como él las dijo, con una traducción entre paréntesis. La traducción es nuestra, no son palabras suyas. Las etiquetas (`PROPOSED`, `OBSERVED` ...), los códigos de respuesta (`R3-VOL-04`) y los nombres de archivos se quedan en inglés, igual que en todo el repositorio. Este texto en español es PROPOSED hasta que el coach, o un coach de su confianza, lo revise (R2-GEN-08).

## La regla

**Entran unas pocas respuestas. Sale el plan completo, una sola vez. La gente lo ajusta por su cuenta.**

| | |
|---|---|
| Qué entra | Objetivo, deporte o actividad, experiencia de entrenamiento, edad, peso corporal, días de entrenamiento, minutos por sesión, equipo y dolor. Opcional: hasta dos músculos de enfoque. Un **músculo de enfoque** (Focus muscle) es el músculo que la persona más quiere trabajar. Recibe de 1 a 3 series extra por semana. |
| Qué sale | El plan completo, con todas las semanas a la vista desde el inicio: 12 semanas (la duración que él prefiere), 8 semanas, un plan de mantenimiento, un año completo para la población general, o un plan de temporada para atletas. |
| Qué pasa después | La persona o su coach ajusta el plan. No se registra nada. No se guarda nada. |

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

Sobre a quién debe servir, dijo "different gyms, different people, different coaches, and all of our clients" (distintos gimnasios, distintas personas, distintos coaches y todos nuestros clientes), y que debe ser gratis "for anybody to use in their own app and their own training" (para que cualquiera lo use en su propia app y en su propio entrenamiento) (conversación).

## Qué es el modelo

En sus palabras: "The hardest thing to understand is the categorization of everything" (lo más difícil de entender es la categorización de todo) (conversación). Por eso el modelo empieza ahí, y todas las demás partes se apoyan en eso.

| Parte | Qué contiene | Lea |
|---|---|---|
| Categorías | Cada ejercicio se etiqueta en todos sus lentes a la vez: familia (atlético, resistencia, core, cardio), patrón de movimiento, un lado o dos, plano, músculo grande o pequeño, equipo y nivel. En sus palabras, "this is the whole taxonomy of each exercise" (esta es toda la taxonomía de cada ejercicio) (CAT-01). | [categories](../02-model/categories.md) |
| Biblioteca de ejercicios | Su MASTER EXERCISE LIBRARY con esas etiquetas. Cada **espacio** (slot, un lugar en el plan) tiene una primera elección y una lista de **alternativas** (swaps, otros ejercicios del mismo tipo). | [exercise library](../02-model/exercise-library.md) |
| Volumen | **Series duras** por semana para cada grupo muscular. Una serie dura es una serie de trabajo que termina con 1 a 3 repeticiones en reserva. Inicios y techos por nivel, y un mínimo de 10. | [volume](../02-model/volume.md) |
| La escalera (stairway) | Su palabra para la forma en que sube todo plan: pasos pequeños al inicio, pasos más grandes después de la mitad, y las semanas más duras al final. | [stairway](../02-model/stairway.md) |
| Sesiones | Core primero, potencia antes que fuerza, horizontal antes que vertical, cadera + empuje y rodilla + jalón, de 2 a 4 ejercicios por grupo. | [sessions](../02-model/sessions.md) |
| Bilateral y unilateral | Cuánto trabajo se hace con las dos piernas o con una, según el tipo de atleta. | [bilateral and unilateral](../02-model/bilateral-unilateral.md) |
| Equipo | Máquinas, peso libre y qué usar cuando falta algo. Sin ligas ni bandas elásticas. | [equipment](../02-model/equipment.md) |
| Atletas y personas activas | Saltos, lanzamientos y levantamientos olímpicos según el deporte. Reglas para adultos mayores, jóvenes y dolor. | [athletes](../02-model/athletes.md), [sports](../02-model/sports.md), [stay athletic and active](../02-model/stay-athletic-and-active.md) |
| Planes y pruebas | Duración de los planes, el año, las temporadas, y pruebas solo al inicio y al final. | [plans and calendar](../02-model/plans-and-calendar.md), [testing](../02-model/testing.md) |
| El motor de planes | Código que convierte las reglas y las respuestas de una persona en un plan. La parte que decide las series se está reconstruyendo. | [for developers](for-developers.md) |

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
- **Generar planes de muestra** con el motor. Trátelos como borradores hasta que termine la reconstrucción.

## Qué no es

| No es | Por qué | Fuente |
|---|---|---|
| Asesoría médica | Es información general de acondicionamiento físico. Quien tiene una condición de salud consulta primero a un profesional. | [DISCLAIMER.es.md](../../DISCLAIMER.es.md) |
| Un sitio web o una app terminada | Primero van los datos y el contexto. El sitio web todavía no está hecho. | conversación; GEN-03 |
| Un sistema de seguimiento | No hay chequeos semanales (check-ins), ni una bitácora que la herramienta lea, ni ajustes semanales hechos por la herramienta. | R3-VOL-02, R3-VOL-04 |
| Un recolector de datos | "I don't want any data kept." (No quiero que se guarde ningún dato.) | R3-GEN-01 |
| Un plan de estilo de vida o de nutrición | "I just need the workouts here." (Aquí solo necesito los entrenamientos.) No hay preguntas sobre sueño, estrés o trabajo. | R2-GEN-04 |
| Un método empaquetado | Él no construye sobre 5/3/1, el Texas Method ni la tabla de Prilepin. | conversación |
| Un reemplazo del ojo de un coach | El plan es una plantilla. Una persona o un coach todavía tiene que adaptarlo al día. | R3-VOL-04, R3-SES-02 |
| Algo confirmado por completo | Algunos números y mecanismos son del equipo. Están marcados PROPOSED hasta que él los apruebe. | [registros de decisiones](../04-decisions/index.md) |
| Algo ya calificado por el coach | Él dijo que va a calificar planes de muestra, y nombró siete. Eso todavía no ha pasado, y el motor se está reconstruyendo. | R2-GEN-07; [roadmap](../06-history/roadmap.md) |
| Una videoteca | Los videos son opcionales. Los enlaces de video de sus hojas no son suyos. | R2-GEN-02; conversación |
| Algo aprobado por un abogado | El aviso legal y la liberación de responsabilidad son borradores que esperan la revisión de un abogado con licencia en Florida. | [DISCLAIMER.es.md](../../DISCLAIMER.es.md) |

También deja fuera algunas cosas a propósito: no hay campo de sexo, no hay ligas, bandas elásticas ni resistencia variable, y no hay semana suave a mitad de un bloque. Vea [what he rejected](../01-philosophy/what-he-rejected.md).

## Los números

| Qué | Cuántos | Dónde vive |
|---|---|---|
| Preguntas que se le hicieron al coach | 198, en tres rondas (140, 45 y 13). Las 198 ya tienen su respuesta. | [coach_answers_full.md](../../coach_answers_full.md), [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md) |
| Registros en el catálogo de ejercicios | 939. De ellos, 732 están activos: 633 ejercicios, 72 elementos de cardio, 14 ejercicios de técnica (drills) y 13 pruebas. | `synthesis/02_exercise_catalog.json` |
| Registros que pueden ser la primera elección de un espacio | 368 (329 ejercicios, 22 elementos de cardio, 13 pruebas y 4 ejercicios de técnica). Los demás registros activos solo pueden ser alternativas (swaps). | mismo archivo, `generator.default_candidate` |
| Deportes en el selector | 52, en 5 grupos, con 146 opciones de posición o prueba | `synthesis/04_profiles.json > sports.list` |
| Actividades de "mantenerse atlético y activo" | 26 (pickleball, HYROX, ligas recreativas, correr y más) | `synthesis/04_profiles.json > activities.list` |
| Perfiles | 127. Un **perfil** es el registro que fija los ajustes del plan para un deporte, una posición o un tipo de persona. | `synthesis/04_profiles.json > profiles` |
| Plantillas de semana | 30 (6 familias de entrenamiento, cada una para 2 a 6 días por semana) | `synthesis/05_templates.json > generator_split_templates` |
| Preguntas del formulario inicial | 39 campos. Muchos son opcionales o solo se muestran a algunas personas. | `generator_spec_v1.json > inputs_schema.fields` |
| Reglas duras que nunca se rompen | 22 | [AGENTS.md](../../AGENTS.md) §10 |
| Registros de decisiones | 48 | [04-decisions](../04-decisions/index.md) |
| Libros de origen | 2 hojas de Google con 34 pestañas | `raw/`, `dumps/` |
| Idiomas | 2. Inglés primero, con un cambio completo a español (GEN-01). | `model/i18n/` |

Notas sobre los números:

- Todo lo que él saltó, dejó en blanco o no entendió en una ronda se volvió a preguntar y quedó respondido en una ronda posterior (PRG-01, FIX-01, LIB-10, LIB-12, CAT-12, R2-VOL-08).
- La copia compilada que lee el motor (`model/`) tiene hoy 731 ejercicios. Esa carpeta se genera, y sus números pueden moverse mientras se reconstruye el motor.
- De los 732 registros activos, 31 son registros que el equipo propuso (PROPOSED): 27 ejercicios y 4 elementos de cardio. Solo pueden ser alternativas hasta que él los apruebe.

## Dónde vive en los datos

| Archivo | Qué es |
|---|---|
| [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | El documento maestro (v1.2). Cada regla, con su etiqueta de evidencia. |
| [generator_spec_v1.json](../../generator_spec_v1.json) | El mismo modelo como datos: `inputs_schema`, `derived_values`, `rule_tables`, `plan_types`, `tests`, `plan_editing`, `legal_and_privacy`, `validation_checks`. |
| `synthesis/` | Un documento detallado por tema, la mayoría con su gemelo `.json`. |
| `coach_answers*.md`, [coach_chat_statements.md](../../coach_chat_statements.md) | Sus propias palabras. Son la autoridad final. La ronda más nueva gana. |
| `raw/`, `dumps/` | Sus dos hojas originales, como copias de Excel y como texto. |
| `model/`, `engine/`, `tests/`, `samples/` | El modelo compilado, el motor de planes, sus pruebas y los planes de muestra. Todo esto está cambiando. |

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
