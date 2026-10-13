# Cómo agregar un ejercicio (o una variación) al catálogo de Blaze Camp

Para coaches y desarrolladores. Esta guía explica cómo agregar un ejercicio nuevo a la biblioteca, o una variación de uno, para que el generador de planes lo clasifique, lo cuente y lo use como lo haría el coach Lalo Vera (Blaze Camp). Necesita Node 22 y Python 3 (solo la biblioteca estándar). No hace falta `npm install`.

*English version: [adding-exercises.md](adding-exercises.md).*

> **Uso bajo su propio riesgo.** La biblioteca de ejercicios y cada plan generado con ella son información general de acondicionamiento físico, no asesoría médica. Agregar o usar un ejercicio es por su propia cuenta y riesgo. Si programa para otras personas, necesita su propia evaluación de salud, liberación de responsabilidad y seguro. Lea [DISCLAIMER.es.md](../DISCLAIMER.es.md) ([DISCLAIMER.md](../DISCLAIMER.md) en inglés). Licencia: [MIT](../LICENSE).

**Etiquetas de evidencia** (vea [CONTRIBUTING.md](../CONTRIBUTING.md)): `OBSERVED` (leído en sus hojas), `COACH-ANSWER <id>` (ronda 1), `COACH-R2 <id>`, `COACH-R3 <id>` (sus rondas siguientes), `INFERRED` (nuestra lectura), `SCIENCE` (literatura citada), `PROPOSED` (espera su aprobación). Las etiquetas se escriben en inglés, igual que en todo el repositorio. Todo ejercicio que usted agregue empieza como **PROPOSED**.

**Nota sobre el idioma de los datos.** Los nombres de campos y sus valores (`pattern_code`, `HPULL`, `bilateral` ...) son códigos y se quedan en inglés. Solo el nombre del ejercicio tiene versión en español (paso 8.5).

## Contenido

1. [Reglas que nunca cambian](#1-reglas-que-nunca-cambian)
2. [¿Ejercicio nuevo o variación?](#2-ejercicio-nuevo-o-variación)
3. [Dónde va: archivos fuente y compilados](#3-dónde-va-archivos-fuente-y-compilados)
4. [Los lentes del coach: cómo clasificar un ejercicio](#4-los-lentes-del-coach-cómo-clasificar-un-ejercicio)
5. [Referencia de campos](#5-referencia-de-campos)
6. [Palabras del id que cambian lo que pasa](#6-palabras-del-id-que-cambian-lo-que-pasa)
7. [Tres ejemplos completos](#7-tres-ejemplos-completos)
8. [Paso a paso: agregar, recompilar, probar](#8-paso-a-paso-agregar-recompilar-probar)
9. [Cuando el coach aprueba (o dice que no)](#9-cuando-el-coach-aprueba-o-dice-que-no)
10. [Lista de verificación](#10-lista-de-verificación)
11. [Solución de problemas](#11-solución-de-problemas)

---

## 1. Reglas que nunca cambian

| Regla | Fuente |
|---|---|
| **Nada de ligas o bandas elásticas, cadenas ni liberadores de peso (weight releasers)** en ningún lugar: ni en un montaje, id, nombre, indicación, alternativa ni nombre en español ("liga", "banda" y "cadena" también fallan la verificación; escriba "cadena posterior" de otra forma). | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12; regla dura H01 |
| **Nunca la sentadilla en V (V-squat).** | COACH-ANSWER GEN-08 |
| **El generador nunca inventa ejercicios.** Solo usa los registros del catálogo. Un registro que usted agrega es `PROPOSED`. Desde la ronda 4 el compilador lo trata como un **extra opcional**: puede aparecer en las listas de alternativas (swaps) y en la lista de extras opcionales del plan, y ninguna plantilla lo elige, hasta que el coach lo apruebe. | COACH-ANSWER CAT-07; COACH-R2 R2-LIB-01, R2-LIB-07; COACH-R4 R4-LIB-01 |
| **El trabajo atlético nunca cuenta como series de músculo** (saltos, lanzamientos, levantamientos olímpicos, sprints, cambios de dirección, swings con kettlebell, acondicionamiento). Se cuenta en contactos, lanzamientos, repeticiones, cortes o metros. | COACH-ANSWER VOL-10; COACH-R2 R2-VOL-05 |
| **Un registro por ejercicio real.** Los casi duplicados se fusionan. Busque antes de agregar. | COACH-ANSWER LIB-17 |
| **Nombre en inglés y en español** para cada ejercicio. El español es latinoamericano neutro con el término de gimnasio en inglés entre paréntesis. | COACH-ANSWER GEN-01; COACH-R2 R2-GEN-08 |
| **Las indicaciones (cues) son palabras del coach.** No escriba una indicación "del coach" por él; déjela vacía salvo que él la haya escrito. | COACH-ANSWER GEN-07 |
| **Nunca edite las hojas de Google del coach**, las exportaciones en `raw/` y `dumps/`, ni los archivos de respuestas del coach. | CONTRIBUTING.md |

## 2. ¿Ejercicio nuevo o variación?

El coach aprobó las **variaciones de un solo detalle**: el ejercicio de su biblioteca sigue siendo la elección principal y, entre bloques de ejercicios, el plan puede cambiar un detalle y mostrarlo como "Nombre de la biblioteca - detalle", por ejemplo "Zancada hacia atrás - mancuerna en la mano contraria" (COACH-R2 R2-LIB-01). Una variación así **no es un registro nuevo**: es un eje del registro que ya existe.

| Qué cambia | Qué hacer |
|---|---|
| Solo uno de estos detalles: qué mano sostiene el peso, agarre, postura, implemento, rango (altura del cajón, profundidad, tamaño del hexágono ...) | **Variación.** Es un eje del registro existente (`variation_axes`). Use solo estos cinco ejes: `implement`, `stance`, `grip`, `range`, `hand` (en la fuente se escribe `which hand holds the weight`). El plan ya tiene las palabras para mostrarlos (`detail.implement` ... `detail.hand`). Si falta el eje, vea "Agregar un eje a un registro existente" más abajo. |
| Cualquier cosa que el generador clasifique o cuente distinto: escalón de nivel, patrón, motor principal o crédito, lateralidad, montaje del equipo, clase de columna, nivel de restricción, balístico o pliométrico, etapa Recibir-Crear, una etiqueta de seguridad (sobre la cabeza, flexión profunda de rodilla, salto en profundidad ...), el valor por defecto para 60+ | **Registro nuevo.** Ejemplo: "Bench Push-Up - Hands on Bench" (fundamental) y "Bench Push-Up - Feet on Bench" (avanzado) son dos registros (COACH-R2 R2-LIB-05). Únalos con `related`. |
| El mismo ejercicio con otro nombre | **Nada que agregar.** Los casi duplicados se fusionan (LIB-17). Si el nombre es mejor, proponga el cambio en un issue. |

**Agregar un eje a un registro existente.** Los registros existentes no se reescriben en la fuente; sus correcciones pasan por la capa de ajustes que corren tanto la copia de referencia como el compilador (`AGENTS.md` §11.3). Abra un issue o (desarrolladores) agregue una línea etiquetada en `amendExercise` de `tools/fixture/review-v12.mjs`, justo antes de `e.tags = [...tags].sort();`:

```js
  // R2-LIB-01 one-detail variation axis (PROPOSED 2026-10-09): a DB hip thrust can also use a KB or a plate
  if (e.id === 'dumbbell-hip-thrust' && !e.variation_axes.includes('implement')) e.variation_axes = [...e.variation_axes, 'implement'];
```

Después recompile, reconstruya la copia de referencia y pruebe como en los pasos 8.6-8.12 (sin cambios en los números fijados). El plan puede mostrar ahora "Empuje de cadera con mancuerna (Hip Thrust) - implemento diferente" en un bloque de ejercicios posterior, así que lea el diff de los planes de muestra.

Antes de agregar cualquier cosa, busque duplicados (desde la raíz del repositorio):

```sh
python3 - "hip thrust" <<'EOF'
import json, sys
q = sys.argv[1].lower()
for r in json.load(open('synthesis/02_exercise_catalog.json', encoding='utf-8')):
    if q in (r['id'] + ' ' + r['name']).lower().replace('-', ' '):
        print(f"{r['id']:55} {r['record_type']:12} {r['status']}")
EOF
```

Pruebe dos o tres formas de escribirlo ("meadows", "landmine row", "single arm row"); el catálogo está en inglés.

## 3. Dónde va: archivos fuente y compilados

```
FUENTE (usted edita estos)
  synthesis/02_exercise_catalog.json   el registro del ejercicio (un arreglo JSON; 939 registros en v1.1)
  tools/compile/es/exercises.mjs       su nombre en español, con el nombre en inglés como clave
        |
        |  node tools/compile-model.mjs
        |    tools/compile/catalog.mjs      normalizeExercise(): registro fuente -> registro de ejecución
        |    tools/compile/patches.mjs      las correcciones del coach (bandas quitadas, nombres, créditos ...)
        |    tools/fixture/review-v12.mjs   amendExercise(): ajustes de la revisión v1.2 (columna, barra, etiquetas)
        v
GENERADO (nunca se edita a mano)
  model/catalog.json                   registros que lee el motor (CONTRACTS.md §3.2)
  model/i18n/en.json, es.json, es_review.json
  model/CHANGELOG.md, COMPILE_REPORT.json, manifest.json
  engine/fixtures/mini-model.json      copia de referencia, se reconstruye con node tools/fixture/build-fixture.mjs
```

- `model/` se reconstruye desde las fuentes cada vez. Un cambio a mano ahí se pierde, y falla la prueba "model/ on disk is the current compile of the sources".
- `engine/CONTRACTS.md` §1.1 marca `synthesis/` como solo lectura para los roles que construyen el motor. Agregar al catálogo es un **cambio del modelo**, no código del motor: va en su propio pull request, que solo toca el registro fuente, el nombre en español, los archivos regenerados y los números fijados en las pruebas (paso 8), y los mantenedores lo revisan como cambio del modelo.
- Respete el formato del archivo fuente: sangría de 1 espacio, UTF-8 (los acentos quedan como letras), sin salto de línea al final, y números como `1.0` tal como están. El script del paso 8 hace exactamente eso. No vuelva a guardar el archivo desde un editor ni con `JSON.stringify` (reescribe cada `1.0` como `1`: un diff de 10 MB).

## 4. Los lentes del coach: cómo clasificar un ejercicio

**Cada ejercicio se etiqueta en todos los lentes a la vez** (familia, patrón, lateralidad, plano, tamaño del músculo, músculos acreditados, implemento y restricción, nivel), para que el generador pueda segmentar por cualquiera de ellos. Él lo llamó "toda la taxonomía de cada ejercicio" (COACH-ANSWER CAT-01). El documento maestro es `BLAZE_CAMP_BRAIN.md` §2-§3; esta sección es la versión corta.

### 4.1 Familia: qué cualidad entrena

| Código del coach | `taxonomy.family` | Entrena | Se cuenta en | Fuente |
|---|---|---|---|---|
| AP Patrones atléticos | `ATHLETIC` | una cualidad: velocidad, potencia, reactividad, cambio de dirección | contactos, lanzamientos, repeticiones de potencia, cortes, metros; **nunca series de músculo** | VOL-10 |
| RP Patrones de resistencia | `RESISTANCE` | un músculo | series x repeticiones a 1-3 repeticiones en reserva, por músculo | VOL-09 |
| CO Control / core: CT tórax, CP pelvis, CB ambos | `CONTROL` | el tronco | series de core (abdomen / oblicuos) | CAT-08 |
| CA Cardio / acondicionamiento | `CARDIO` | el sistema aeróbico | sesiones y bloques | ATH-07 |
| FN Funcional (acarreos, arrastres, cadenas musculares o slings) | `FUNCTIONAL` | todo el cuerpo | sin series de músculo | LIB-19 |

### 4.2 Patrón: el lente que organiza

Los músculos grandes, el trabajo atlético y el core se organizan **por patrón**; los músculos pequeños **por músculo** (COACH-ANSWER CAT-02, CAT-03). `taxonomy.pattern_code` decide los slots (espacios de la sesión) que el ejercicio puede llenar y cómo se acredita:

| `pattern_code` | Significado | Slot (casilla de la plantilla) | Clase de crédito y créditos por serie |
|---|---|---|---|
| `BKD` | dominante de rodilla bilateral (sentadillas, prensa) | `RP_BKD` | `BKD`: cuádriceps 1, glúteos 0.25, aductores 0.25 (`THRUSTER` para thrusters) |
| `UKD` | dominante de rodilla unilateral (zancadas, sentadillas divididas, subidas al cajón) | `RP_UKD` | `UKD`: igual que BKD |
| `BHD` | dominante de cadera bilateral (peso muerto, RDL, empuje de cadera, puentes) | `RP_BHD` | `BHD`: isquiotibiales 1, glúteos 0.25; `GLUTE_ISO` (glúteos 1, isquiotibiales 0.25) cuando los glúteos son el motor 1.0 |
| `UHD` | bisagra o puente a una pierna | `RP_UHD` | `UHD` o `GLUTE_ISO`, como arriba |
| `KEXT` | extensión de pierna | `ISO_QUAD` | `LEG_EXTENSION`: cuádriceps 1 |
| `KFLEX` | **flexión de pierna**: curl femoral, nórdico, curl con deslizadores o pelota (no es dominante de cadera, CAT-09) | `ISO_LEG_FLEXION` | `LEG_FLEXION`: isquiotibiales 1 |
| `HPUSH` | empuje horizontal (press de banca, lagartijas, aperturas, fondos) | `RP_HPUSH` | `HPUSH`: pecho 1, tríceps 0.25, deltoides anterior 0.25; `DIPS`: pecho 0.5, tríceps 0.5; `ISO_CHEST` (aperturas, slot `ISO_CHEST`): pecho 1 |
| `MRPUSH` | empuje de rango medio (inclinado, press con landmine) | `RP_HPUSH` o `RP_VPUSH` según el motor principal | `HPUSH` o `VPUSH` |
| `VPUSH` | empuje vertical | `RP_VPUSH` | `VPUSH`: deltoides anterior 1, lateral 0.25, tríceps 0.25 |
| `HPULL` | jalón horizontal (remos) | `RP_HPULL` | `HPULL`: espalda 1, bíceps 0.25, deltoides posterior 0.25 |
| `VPULL` | jalón vertical (dominadas, jalones al pecho, pull-overs) | `RP_VPULL` | `VPULL`: espalda 1, bíceps 0.25; `PULLOVER`: espalda 1 |
| `SHLD` | aislamiento de hombro: elevaciones laterales, remo al mentón, deltoides posterior, elevaciones frontales, face pulls | `ISO_SIDE_REAR_DELT` | `ISO_SIDE` deltoides lateral 1; `ISO_REAR` posterior 1; `ISO_FRONT` anterior 1; `FACEPULL` posterior 1 + lateral 0.25 |
| `BIC` / `TRI` / `CALF` / `NECK` | bíceps / tríceps / pantorrillas / cuello | `ISO_BICEP` / `ISO_TRICEP` / `ISO_CALF` / `PREHAB_NECK` | músculo objetivo 1 (bíceps también antebrazos 0.25) |
| `CT` / `CP` / `CB` | core tórax (el tronco se mueve sobre una pelvis quieta) / core pelvis (la pelvis y las piernas se mueven sobre un tronco quieto) / ambos | `CT_CORE_THORAX` / `CP_CORE_PELVIS` / ambos, más `CORE_ANY` | `CORE`: abdomen y oblicuos 1 |
| `AOS` | cadena oblicua anterior (cortes o chops, trabajo Pallof) | `CT_CORE_THORAX`, `CORE_ANY` | `CORE` |
| `PLYO` | saltos (pliométricos y balísticos) | `AP_PLYO` | `ATHLETIC`: nada |
| `ANKLE` | saltos de tobillo / rodilla limitada (saltos de tobillo, tipo pogo) | `AP_JUMP_LIMITED_KNEE` | `ATHLETIC` |
| `THROW` | lanzamientos con balón medicinal | `AP_THROW` | `ATHLETIC` |
| `TX` | triple extensión / levantamientos olímpicos | `AP_TRIPLE_EXT` | `ATHLETIC` |
| `COD` / `SPRINT` | cambio de dirección / sprint y mecánica | `AP_COD` / `AP_SPRINT` | `ATHLETIC` |
| `CARDIO` / `WARMUP` | cardio / preparación del calentamiento | `COND_AEROBIC` / `WARMUP_PREP` | `ATHLETIC` |
| `CARRY` / `DRAG` / `ARMCARE` | acarreos / arrastres / cuidado de hombro y brazo | `FUNCTIONAL` / `RECOVERY_ARM_CARE` | `NONE` |

Todo registro de resistencia (salvo el trabajo de cuello) también llena el slot **`FOCUS`**, que sirve a los músculos de enfoque 1 y 2 de la persona (cada uno recibe 1-3 series semanales extra, COACH-R3 R3-SES-01). Los pares de superserie salen de los slots: rodilla + jalón, cadera + empuje, bíceps + deltoides posterior, tríceps + deltoides lateral, pantorrillas + deltoides (`rules.supersets`); así que su patrón también decide en qué pares el plan puede recomendarlo.

### 4.3 Lateralidad y plano

- `laterality`: `bilateral`, `unilateral`, `alternating` (cuenta como unilateral) o `n/a`. En trabajo de un lado, **10 repeticiones por lado = 1 serie** (COACH-ANSWER UNI-01, UNI-07). La lateralidad alimenta la proporción bilateral / unilateral del plan, que el coach considera muy importante.
- `plane`: `sagittal`, `frontal`, `transverse`, `multi` o `n/a`. La biomecánica es la descripción que lleva cada ejercicio, no una categoría (CAT-03). El plan lee el plano para la proporción frontal / transversal de los atletas de cancha y de combate, y para rotar los planos del core.

### 4.4 Nivel: posición de la carga + habilidad + estabilidad (y la zona de Davidson)

- **Nivel = habilidad + exigencia de estabilidad + dónde está la carga.** Carga al frente o abajo = fundamental; cerca del cuerpo y sobre él = intermedio; detrás del cuerpo o sobre la cabeza = avanzado (COACH-ANSWER CAT-04).
- **Un asiento, una máquina o una polea hacen más fácil cualquier posición**: un press sentado con mancuernas o un jalón al pecho son fundamentales aunque vayan sobre la cabeza (CAT-04; COACH-R2 R2-LIB-02).
- **Los niveles agregan opciones y nunca las quitan**; son un valor por defecto suave, nunca una barrera (CAT-05). El nivel del ejercicio no es el nivel del cliente (L1-L3 indica cuánto volumen; CAT-06).
- **La zona de Davidson** (del libro del Dr. Pat Davidson, como la usa el coach) es una **etiqueta, no un nivel** (COACH-R2 R2-LIB-02, R2-LIB-03):

| Zona | Posición | Sesgo de rotación |
|---|---|---|
| 1, vertical baja | de pie, brazos abajo, carga baja y cerca | externa |
| 2, horizontal | manos al frente; rodilla a la altura de la cadera (a media sentadilla) | interna, más compresiva |
| 3, vertical alta | brazos sobre la cabeza; sentadilla profunda | externa |

  El plan mantiene ambos sesgos cada semana y usa el sesgo para elegir una alternativa cuando algo duele. Las zonas no aplican a los pliométricos (CAT-10); no ponga zona en saltos ni en core sin carga.

### 4.5 Músculos: grandes y pequeños, motor principal 1.0, auxiliares 0.25

- **Grandes**: cuádriceps, glúteos, isquiotibiales, dorsales / espalda alta, pecho. **Pequeños**: bíceps, tríceps, deltoides lateral, deltoides posterior, pantorrillas, antebrazos, abdomen (COACH-ANSWER CAT-02). Deltoides anterior, trapecios, aductores y cuello están "sin ubicar": reciben crédito, pero no se llenan por sí solos.
- **Crédito por serie: el motor principal 1.0, cada auxiliar 0.25** (VOL-09). El crédito sale del patrón (tabla de 4.2), no del slot ni de los números que usted escriba. Sus excepciones, todas incluidas en las clases de crédito:
  - empuje de cadera y puentes: **glúteos 1.0** (isquiotibiales 0.25); sentadillas, zancadas, peso muerto y RDL dan a los glúteos solo 0.25 (COACH-R2 R2-VOL-05);
  - **fondos: pecho 0.5 + tríceps 0.5** (LIB-16);
  - **thrusters: cuádriceps 1.0 + deltoides anterior 0.5 + glúteos 0.25** (LIB-14; R2-VOL-05);
  - los face pulls (polea o kettlebell) son trabajo de hombro: deltoides posterior 1.0 + lateral 0.25, nunca el jalón vertical principal (R2-LIB-04, LIB-10);
  - **swings con kettlebell: sin crédito de músculo** (repeticiones balísticas de potencia, R2-VOL-05);
  - el curl femoral cuenta completo a isquiotibiales como flexión de pierna (CAT-09); el pull-over de dorsales cuenta solo espalda 1.0 (LIB-09).
- **Grupos** (COACH-R3 R3-SES-01): el plan cuenta 2-4 ejercicios por **grupo** entrenado en un día: cadera = glúteos + isquiotibiales (un RDL + un empuje de cadera + un curl femoral = 3 ejercicios de cadera), hombros = deltoides anterior + lateral + posterior (el modelo también incluye los trapecios aquí, INFERRED). Las pantorrillas llevan un ejercicio x 3 series por día de pierna.
- **El deltoides posterior es parte del grupo de hombros** (COACH-R3 R3-VOL-01): siga acreditando `rear_delts` en el registro (los remos le dan 0.25, las elevaciones posteriores 1.0); el plan cuenta ese trabajo dentro del grupo de hombros, y personas y coaches pueden agregar más trabajo de deltoides posterior.

### 4.6 Equipo y restricción (1-5)

- `equipment.setups_any_of` lista los **montajes**. Cada montaje es una lista de implementos que se necesitan todos juntos; más de un montaje son alternativas. Ejemplo: `[["dumbbell", "bench"], ["kettlebell", "bench"]]`.
- Use solo las palabras de implemento que el compilador conoce (`IMPLEMENT_TO_KIT` en `tools/compile/catalog.mjs`): `none any_cardio_mode rope dumbbell kettlebell barbell medball open_space_long open_space_short cable box machine cardio_treadmill cardio_machine step bench weight_bench wall pullup_bar plate plate_low_target hex_bar squat_rack household_object hurdles landmine seal_bench stability_ball ez_bar suspension_trainer dip_station sled sandbag slider jump_rope cones smith dip_belt farmer_handles box_high ssb foam_roller hyper_bench ghd anchor reverse_hyper`. Un tipo de equipo nuevo es un cambio del modelo de equipo (`synthesis/10_equipment_model.json` y los perfiles del formulario): abra un issue.
- **Nivel de restricción** (escala aprobada, COACH-ANSWER EQ-13):

| Nivel | Definición | Ejemplos | Para quién |
|---|---|---|---|
| 5 | máquina sentada con respaldo, trayectoria fija | prensa, extensión de pierna, remo en máquina, press de pecho en máquina, bicicleta | adultos mayores o frágiles, dolor, finalizadores de alto volumen |
| 4 | máquina de discos, Smith, peso libre con apoyo de pecho | péndulo, hack, jalón al pecho, sentadilla con cinturón, GHD | principiantes en jalones, clientes de volumen, mayores / lesionados |
| 3 | polea, o peso libre apoyado en banco o en el piso | press en polea, press de banca con mancuernas, puente de glúteo, core en el piso | principiantes, accesorios de hipertrofia, regresiones por dolor |
| 2 | peso libre de pie | sentadilla frontal, peso muerto, press de pie con mancuernas, lagartija, zancadas con carga, levantamientos olímpicos | levantamientos principales de fuerza, atletas |
| 1 | peso corporal, balístico, reactivo | dominadas, pistol, push press, swing con kettlebell, todos los pliométricos y sprints | atletas, habilidad avanzada con peso corporal |

  Los clientes mayores, lesionados y de alto volumen se apoyan en los niveles 4-5; los levantamientos principales de los atletas, en 1-2 (`BLAZE_CAMP_BRAIN.md` §8.3).

### 4.7 Carga axial: los dos días de columna

El coach pone la sentadilla pesada y el peso muerto pesado en **dos días distintos** (COACH-R2 R2-SES-01). Solo estos levantamientos se **cuentan** como carga de columna: sentadillas con barra trasera, frontal, zercher, sobre la cabeza y en Smith; peso muerto y RDL con barra o barra hexagonal; buenos días (good mornings). **No se cuentan**: prensa, sentadilla con cinturón, empuje de cadera, extensión de espalda, reverse hyper, trabajo a una pierna con mancuernas, levantamientos olímpicos, saltos con carga. Las sentadillas goblet, hack y péndulo son una "opción para el segundo día si no hay dolor muscular" (R2-SES-02).

- `axial_spinal_load.value`: `none`, `low`, `moderate`, `high` (cuánto se carga la columna).
- `axial_spinal_load.spine_day_v1_1`: `class` = "counted spine-loading lift", "second-day option if not sore" o "not counted" (escrito así, en inglés); `counts_as_heavy_spine_lift` = true solo para la lista que se cuenta.
- El compilador cuenta un levantamiento solo en un patrón de sentadilla o de bisagra, y la capa de ajustes v1.2 cuenta además **toda bisagra (clase de crédito BHD o UHD, es decir, no un empuje de cadera ni un puente) cuyos montajes necesitan todos una barra o una barra hexagonal** (posturas escalonadas y kickstand incluidas, R2-SES-02), salvo que sea un levantamiento olímpico, un salto con carga o un swing con kettlebell. Así que una variación nueva de peso muerto con barra se cuenta aunque usted escriba "not counted".

### 4.8 Etiquetas atléticas: balístico o pliométrico, etapa Recibir-Crear, familia olímpica

- **Balístico** = contacto con el piso más largo o un solo esfuerzo grande: saltos en sentadilla, al cajón, de longitud, con carga o con barra hexagonal, lanzamientos con balón medicinal, swings con kettlebell. **Pliométrico** = contactos cortos, elásticos y repetidos: saltos de tobillo y tipo pogo, saltos de valla, saltos en profundidad, zancadas saltadas (bounds), saltos de ardilla, saltos repetidos. **Recepción** = ejercicios de aterrizar y fijar (stick the landing) (COACH-R2 R2-ATH-02). Llene `contact_class_v1_1.value` (`ballistic`, `plyometric`, `receive`) y `athletic_quality.value` (el texto debe empezar con la cualidad, en inglés: "plyometric (short ground contact, repeated)", "ballistic (longer ground contact, single effort)", "landing (receive force)", "olympic / triple extension", "change of direction", "speed (sprint / sprint drill)", "ballistic (throw)").
- Por qué importa: cada deporte tiene una proporción pliométrica de su trabajo de saltos y lanzamientos al final de un bloque (corredores 75 %, pickleball 50 %, natación 25 % ...; COACH-R2 R2-ATH-01, COACH-R3 R3-ATH-04), y cada bloque empieza 15 puntos más balístico. El plan cuenta su ejercicio del lado correcto de esa proporción.
- **Etapas Recibir-Crear (Receive-Create)** (R2-ATH-03): 1 Aterrizar (fijar), 2 Aterrizar y saltar (fijar y luego un salto), 3 Repetir (rebotes continuos). Ponga en `athletic_quality.receive_create_stage.default_stage` la etapa que implica el nombre y en `plyo_method` uno de `receive_and_pause`, `receive_then_create`, `repeated_receive_create` o `create_then_land`. El plan igual elige la etapa de cada semana (12 semanas: semanas 1-3 / 4-7 / 8-12). Ponga `unilateral_harder` en true para saltos a una pierna.
- **Levantamientos olímpicos**: `olympic_v1_1.family` = `clean` (días de rodilla / sentadilla), `snatch` (días de cadera / bisagra), `jerk` (cualquier día) o `loaded_jump` (R2-ATH-04). Las cargadas y arranques completos en sentadilla usan 3-5 repeticiones por serie (R2-ATH-05).

### 4.9 Adultos mayores y jóvenes

- **60+ (COACH-R3 R3-ATH-02)**: activados por defecto: ejercicios de aterrizaje (bajar de un escalón y fijar, sin rebote), equilibrio, pasos rápidos sin brinco, lanzamientos ligeros con balón medicinal y trabajo rápido en máquinas. Desactivados por defecto, y activables con su advertencia (en el plan: "Asegúrate de tener un profesional del fitness que te ayude a entender lo que esto significa", `warning.older_athletic`): saltos bajos de tobillo, otros saltos, levantamientos olímpicos, saltos en profundidad. Nunca: sentadilla sobre la cabeza y sentadilla con barra baja.
  - Ponga `older_default_excluded.value: true` en todo salto pliométrico o de tobillo, levantamiento olímpico o derivado, salto con carga o en profundidad y ejercicio de acondicionamiento con saltos. El compilador pone entonces `older_ok: false` (desactivado por defecto). Las cualidades pliométrica y olímpica quedan desactivadas por defecto aunque se le olvide.
  - `older_opt_in_ok` es false solo para las etiquetas de la lista de "nunca". Hoy la compilación además mantiene bloqueados para 60+ los saltos en profundidad, las caídas desde altura y los arranques, aun activados (`OLDER_NEVER_PHASE0`, `engine/DECISIONS.md` D-05). R3-ATH-02 aprobó permitir los saltos en profundidad con la advertencia, así que revise D-05 para ver el estado actual.
- **Jugadores de pickleball, pádel y tenis de 50 a 59 años** (R3-ATH-02): solo saltos de bajo impacto salvo que se activen; se evitan los saltos en profundidad, de valla y los bounds (`rules.population.active_aging_50`). Esos se encuentran con etiquetas que salen del id (sección 6).
- **Jóvenes (menores de 18)**: `youth_ok` es siempre true; los límites vienen de la escalera de niveles (hasta intermedio) y de los levantamientos olímpicos desde el piso a partir de unos 14 años, después de un bloque desde colgado (R2-ATH-08).
- **Reglas de población**: se convierten en etiquetas solo cuando el texto coincide exactamente con estas frases en inglés (cópielas tal cual):

| `population_rules[].population` | `rule` empieza con / contiene | Etiqueta |
|---|---|---|
| "older / injured / high-volume clients" | empieza con "preferred" | `older_preferred` |
| "aesthetics / bodybuilding clients" | contiene "warm-up only" | `aesthetics_warmup_only` |
| "baseball pitchers" | contiene "overhead" | `pitcher_reduce` |
| "boxers / striking athletes in high punching-volume weeks" | (cualquiera) | `striker_reduce` |
| "beginners in athletic training / no bumper plates" | (cualquiera) | `beginner_olympic` |
| "youth athletes" | contiene "floor" | `youth_floor_ok` |
| "athletes already axially loaded that week, or sore" | (cualquiera) | `axial_unload` |
| "clients with shoulder or back pain" | (cualquiera) | `pain_friendly` |
| "older adults (60+)" | "excluded by default; opt-in with the WARN_60PLUS_POWER_WORK warning" | (documenta `older_default_excluded`) |

### 4.10 Dosis sugerida, video, uso por deporte

- `typical_rep_range`: una sugerencia (`value` como "8-12 per side") y una unidad `dose_unit`: `reps`, `reps per side`, `contacts`, `throws`, `seconds`, `reps or seconds`, `time / distance / calories`. La dosis real sale de las reglas (meta, clase de repeticiones, semana de la escalera). `seconds` la convierte en un sostenido con tiempo.
- `video_urls`: déjelo vacío (`[]`). La biblioteca no guarda enlaces de video de terceros (COACH-R4 R4-LIB-05): el compilador le da a cada ejercicio un enlace de búsqueda en YouTube armado con su nombre en inglés, y el plan muestra ese nombre exacto para copiarlo. Los videos propios del coach se pueden agregar después.
- `sport_use_v1_1`: deportes o actividades que necesitan especialmente el ejercicio ("pickleball", "tennis", "swimming", "general population", "home" ...). Da un pequeño bono de selección; nunca filtra.
- `implement_load` (solo balón medicinal): `typical_lb` como "8-10". **Nunca más de 20 lb** (EQ-06); nada de balón medicinal en el trabajo principal de un cliente de estética, solo en el calentamiento (ATH-05).

## 5. Referencia de campos

Izquierda: el campo que usted escribe en `synthesis/02_exercise_catalog.json`. Centro: lo que el compilador hace con él en `model/catalog.json` (CONTRACTS.md §3.2). Los campos que el compilador no lee siguen siendo parte del registro: documentan la decisión y alimentan los otros documentos del modelo.

**Identidad y estado**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `id` | `id`, `source_id`, `name_key` | Minúsculas separadas con guiones, hecho a partir del nombre en inglés, único, palabras simples de gimnasio. Las palabras importan (sección 6). |
| `name` | nombre en inglés (`exercise.<id>.name`) | Inglés de gimnasio simple, genérico y entendible (FIX-03, FIX-04). Un detalle corto puede ir entre paréntesis: "Landmine Meadows Row (bent-over, one arm)". Los paréntesis que contienen "inferred", "not stated", "unconfirmed", "ambiguous", "unclear", "verify" o "listing" se quitan del nombre que se muestra. |
| `record_type` | `kind` | `exercise` (casi siempre); `drill` (ejercicios de técnica), `test`, `conditioning_prescription` (una sesión de cardio, se vuelve `conditioning`). Otros tipos se descartan. |
| `status` | `status` | Nuevo: **`proposed_v1_1`** (el estado propuesto que reconoce el compilador). El compilador lo convierte en `optional_addon` en `model/catalog.json`: una alternativa y un extra opcional, nunca una elección de la plantilla (COACH-R4 R4-LIB-01). El trabajo de cuello es la excepción: sigue como propuesto y no se muestra. Después de la aprobación: `added_v1_1`. Valores existentes: `live_library_selectable` (su biblioteca BYOP, puede ser la elección principal), `reference_only` y `program_only` (alternativas), `live_library_not_selectable`, `retired` (se descarta). |
| `generic` | ninguno | `false`. |
| `aliases`, `placements` | ninguno | `[]`. Guardan celdas de las hojas, solo OBSERVED. |

**Generador**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `generator.eligible` | (se conserva o se descarta) | `true`. |
| `generator.pools` | `slots` | El o los códigos de patrón cuyos slots puede llenar, normalmente `[pattern_code]`. Un salto que también sirve para el bloque bajo de tobillo: `["PLYO", "ANKLE"]`. |
| `generator.default_candidate` | `default_in_slots` | `false` en un registro nuevo. El estado propuesto fuerza `[]` de todas formas. |
| `generator.default_candidate_by_pool` | `default_in_slots` | Opcional: valor por defecto solo en algunos pools (un swing con kettlebell es valor por defecto solo en `TX`). |
| `generator.why` | ninguno | Una línea, por ejemplo "PROPOSED addition - swap only until the coach approves it". |

**Clasificación**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `taxonomy.family` | `family` | `RESISTANCE`, `ATHLETIC`, `CONTROL`, `CARDIO`, `FUNCTIONAL` (4.1). |
| `taxonomy.pattern_code` | `pattern`, `slots`, `credit_class` | Un código de la tabla de 4.2. |
| `taxonomy.node_01_taxonomy` | `node` | El id del árbol canónico, por ejemplo `RP.PL.H.UL`, `AP.JMP.LK`, `CO.CT` (`BLAZE_CAMP_BRAIN.md` §2.3, `synthesis/01_taxonomy.json > nodes`). |
| `taxonomy.region`, `category`, `category_label`, `sub_pattern`, `path`, `pattern_label_verbatim` | ninguno | Cópielos de un registro hermano del mismo patrón; `pattern_label_verbatim: null` (cita su hoja). |
| `laterality` | `laterality` | `bilateral`, `unilateral`, `alternating`, `n/a` (4.3). |
| `plane` | `plane` | `sagittal`, `frontal`, `transverse`, `multi`, `n/a`. |
| `level.generator_min_level` (+ `primary`, `basis`, `generator_min_level_basis`) | `level` | `foundational`, `intermediate`, `advanced` (4.4). Explique el porqué en `basis`. |
| `davidson_zone.zone`, `.rotation_bias` (+ `basis`, `use_v1_1`) | `zone`, `rotation_bias` | 1, 2 o 3; el texto del sesgo empieza con "external-rotation bias" o "internal-rotation bias". No ponga el campo en pliométricos ni en core sin carga. |
| `muscle_size_class` | `size_class` | `big`, `small`, `mixed`, `n/a` (del motor principal; descriptivo). |
| `exercise_class` | `exercise_class` | `compound`, `isolation`, `athletic`, `control`, `conditioning`, `warmup`, `mobility`. En un empuje horizontal, `isolation` lo vuelve una apertura. |
| `volume_counting` | `counting` | `hypertrophy_sets`, `control_sets`, `contacts`, `throws`, `power_reps`, `conditioning_bouts`, `reps_or_distance`, `warmup_not_counted`, `not_counted`. |

**Músculos y crédito**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `primary_muscles`, `secondary_muscles`, `coach_muscle_groups` | ninguno | Quién trabaja (descriptivo): por ejemplo `["lats", "upper_back"]`, `["biceps", "rear_delts"]`, `["BACK"]`. |
| `volume_credit.counts_toward_muscle_volume` | (clase de crédito) | `true` en resistencia y core; `false` en atlético, cardio y calentamiento. |
| `volume_credit.per_set` | (solo excepciones) | Sus grupos generales con 1.0 / 0.25: `QUADS`, `HAMSTRINGS`, `GLUTES`, `CHEST`, `BACK`, `SHOULDERS/TRAPS`, `BICEP`, `TRICEP`, `CALVES`, `CORE`. El compilador **no** copia estos números; los lee para las excepciones: `GLUTES: 1.0` en una bisagra = crédito de empuje de cadera; `CHEST: 0.5` + `TRICEP: 0.5` = fondos; `SHOULDERS/TRAPS: 0.5` en una sentadilla = thruster; `CHEST: 1.0` solo en un empuje = una apertura. Por eso **escriba los auxiliares** en un empuje compuesto. |
| `delt_head.value` | (clase de crédito) | Solo aislamiento de hombro: `side`, `rear` o `front`. |
| (calculado) | `credit_class`, `credits`, `primary_muscle`, `is_athletic` | Del patrón y las excepciones (4.2, 4.5). |

**Equipo**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `equipment.setups_any_of` | `equipment.any_of` | Montajes (4.6). `[["none"]]` = sin equipo. |
| `equipment.machine_type` | `equipment.machine` (con las palabras del id) | `null` salvo que sea una máquina; entonces el tipo de máquina ("leg curl") y las palabras de máquina en el id (sección 6). |
| `equipment.implements`, `min_access_tier`, `min_access_tier_label`, `household_substitutions`, `substitutes_by_equipment`, `basis` | ninguno | Descriptivos. Niveles de acceso: 0 "T0 bodyweight + household", 1 "T1 minimal kit ...", 2 "T2 home light weights (DB/KB/medball)", 3 "T3 gym". |
| `no_equipment_ok`, `minimal_kit_ok`, `home_weights_ok` | ninguno | Booleanos descriptivos. |
| `constraint_level.value` (+ `basis`) | `constraint` | 1-5 (4.6). Por defecto 2. |

**Carga y columna**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `axial_spinal_load.value` | `axial_class` | `none`, `low`, `moderate`, `high`. Si falta = `none`. |
| `axial_spinal_load.spine_day_v1_1.counts_as_heavy_spine_lift` | `axial` | `true` solo para la lista que se cuenta (4.7). |
| `axial_spinal_load.spine_day_v1_1.class` | `spine_class` | "counted spine-loading lift", "second-day option if not sore", "not counted". |
| (calculado) | `axial_pattern` | `squat` para BKD / UKD, `hinge` para BHD / UHD; si no, null. |
| `load_ceiling` | `load_ceiling` | `low`, `moderate`, `high`: cuánto peso admite. Los slots de levantamiento principal prefieren más; un cambio de bloque nunca baja el techo. |
| `skill_demand` | `skill` | `low`, `moderate`, `high`. |
| `impact_level` | `impact` | `none`, `low`, `moderate`, `high` ("high" en el texto agrega la etiqueta `high_impact`). |
| `implement_load.typical_lb`, `.max_lb` | `medball` | Solo balón medicinal; tope de 20 lb. |

**Atlético** (saltos, lanzamientos, olímpicos, sprints, cambio de dirección)

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `athletic_quality.value` | `athletic.quality` | Texto que empieza con la cualidad (4.8). |
| `contact_class_v1_1.value` | `athletic.contact_class` | `plyometric`, `ballistic`, `receive` (se muestra como `landing`). |
| `athletic_quality.plyo_method` | `athletic.plyo_method_default` | `receive_and_pause`, `receive_then_create`, `repeated_receive_create`, `create_then_land`. |
| `athletic_quality.receive_create_stage.default_stage` | `athletic.rc_stage_default` | 1, 2, 3 (se muestra como `RC1`-`RC3`). |
| `athletic_quality.unilateral_harder` | `athletic.unilateral_harder` | `true` en saltos a una pierna. |
| `olympic_v1_1.family` | `athletic.olympic_family`, `day_pattern`, `olympic_tier` | `clean`, `snatch`, `jerk`, `loaded_jump`. |
| (calculado) | `athletic.count_unit`, `full_catch`, `from_floor`, `loaded_jump` | De la cualidad y de palabras del id. |

**Población**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `older_default_excluded.value` (+ `population`, `what`, `opt_in`, `warning_key`, `evidence`) | `older_ok` | `true` = desactivado por defecto para 60+ (4.9). |
| `population_rules[]` | `tags` | Frases exactas (4.9). |
| (calculado) | `older_opt_in_ok`, `youth_ok` | 4.9. |

**Dosis, medios, deporte, variación**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `typical_rep_range.value`, `.dose_unit` | `rep_hint` | 4.10. |
| `video_urls[]` (`url`, `source`) | `video` | Opcional; casi siempre `[]`. |
| `coach_cues[]` (`cue`) | `cue_key` y la indicación en inglés | Solo las palabras del coach. Una indicación también necesita su línea en español en `tools/compile/es/labels.mjs > ES_CUES`. |
| `sport_use_v1_1` | `sport_use` | 4.10. |
| `variation_v1_1.axes` (+ `evidence`) | `variation_axes` | `implement`, `stance`, `grip`, `range`, `which hand holds the weight` (sección 2). |

**Evidencia y registro de cambios**

| Campo fuente | Campo de ejecución | Qué escribir |
|---|---|---|
| `new_in_v1_1` | `rule_refs` (su `qid`) | `{"kind": "PROPOSED-ADDITION", "qid": "PROPOSED <AAAA-MM-DD>", "evidence": "PROPOSED - PENDING COACH APPROVAL", "why_needed": "<el vacío que llena>"}`. |
| `sources` | ninguno | `["PROPOSED - PENDING COACH APPROVAL (contributor addition <fecha>)"]`. |
| `inferred_fields` | ninguno | Los campos que usted decidió (músculos, equipo, nivel, restricción ...). |
| `notes`, `related` | ninguno | Cómo se hace, en una o dos líneas; los ids de sus parientes más cercanos. |
| (calculado) | `tags` | La lista cerrada de etiquetas de CONTRACTS.md §3.2.5, hecha por el compilador (sección 6). Las etiquetas no se ponen a mano. |
| (calculado) | `conditioning` | Solo sesiones de cardio (el color se lee de nombres como "Aerobic A (blue) ..."). |

## 6. Palabras del id que cambian lo que pasa

Varias reglas leen palabras del id (`tools/compile/catalog.mjs`: `creditClass`, `slotsFor`, `tagsFor`, `machineFor`, `athleticFor`; `tools/fixture/review-v12.mjs`; `engine/select.mjs` y `engine/dose.mjs`). Son atajos de ingeniería (INFERRED), así que nombre el id según lo que el ejercicio es en realidad, recompile y **lea las `tags` compiladas**. Si falta una etiqueta que el ejercicio necesita, cambie el id solo si el nuevo id sigue siendo un nombre verdadero; si no, pida a los mantenedores una regla del compilador en un pull request aparte. Nunca corrija `model/` a mano.

| El id contiene | Efecto |
|---|---|
| `band`, `banded`, `chain`, `weight-releaser` | Se quitan, se renombra o se rechaza. No las use. |
| `v-squat` | Rechazado en todas partes. |
| `face-pull` | Face pull: deltoides posterior 1.0 + lateral 0.25, slot de hombro, nunca un jalón vertical. |
| `front-raise` | Crédito de deltoides anterior. |
| `reverse-fly`, `rear-delt`, `t-raise`, `y-raise`, `y-t-raise` | Crédito de deltoides posterior. |
| `thruster` | Crédito de thruster (cuádriceps 1.0, deltoides anterior 0.5, glúteos 0.25). |
| `pullover`, `pull-over` | Pull-over de dorsales: solo espalda 1.0. |
| `swing` (en un patrón de bisagra) | Swing con kettlebell: balístico, 0 series de músculo, solo slot de potencia. |
| `tibialis-raise` | Cuidado de la pierna baja, sin crédito de pantorrilla. |
| `overhead-squat`, `low-bar` | Nunca para 60+, lesionados ni clientes de alto volumen. |
| `snatch`, `depth-jump` (y la familia de caídas), `high-depth-drop` | Bloqueados para 60+ en la compilación actual (D-05) y para lesionados / alto volumen. |
| `hurdle-hop`, `bound` | Se evitan en jugadores de raqueta de 50 a 59 años salvo que se activen, y con dolor de rodilla. |
| `ankle-hops`, `pogo` | Etiqueta `ankle_hop`: preferidos en el bloque bajo de tobillo. |
| `dip` (no "hip"), `upright-row`, `skull`, `good-morning`, `bent-over`, `chest-supported` / `seal-` / `machine-row` / `seated-cable-row`, `sumo`, `cossack`, `pistol` / `sissy` / `deep`, `front-squat` / `front-rack` / `clean`, `push-up`, `overhead` | Etiquetas de los filtros de dolor (`dips`, `upright_row`, `skullcrusher`, `good_morning`, `bent_over`, `chest_supported`, `sumo`, `cossack`, `deep_knee_flexion`, `front_rack`, `push_up_floor`, `overhead`). Ejemplo: el dolor de cuello, espalda alta y espalda baja evita `bent_over`. |
| `single-arm`, `alternating` (y todo montaje con mancuerna o kettlebell) | `split_grip` (preferido con dolor de hombro, codo o muñeca). |
| `assisted` | Menos probable para clientes L2-L3. |
| `barbell` (sin db / kb / ez en el id) | Solo se conservan los montajes con barra. |
| `wall-ball`, `slam`, `sit-up`, `overhead` (balón medicinal) | El tipo de balón medicinal y su rango de carga. |
| `lateral`, `side`, `zig-zag`, `skater`, `cossack` / `broad`, `forward`, `bound`, `hurdle`, `backward` | Dirección del salto: lateral / horizontal (todo lo demás cuenta como vertical), comparada con las direcciones de salto del deporte. |
| `plank`, `hold`, `hollow`, `dead-hang`, `wall-sit`, `isometric` | Se dosifica como sostenido con tiempo. |
| `plank`, `pallof`, `dead-bug`, `bird-dog`, `hollow`, `suitcase`, `offset`, `anti` | Core anti-movimiento. |
| `plank`, `crunch`, `sit-up`, `lying`, `supine`, `floor`, `v-up`, `leg-raise`, `hollow`, `dead-bug`, `bird-dog`, `bridge` | Core en el piso: se omite cuando la persona excluye el trabajo en el piso. |
| `sit-up`, `crunch`, `v-up`, `leg-raise`, `knees-to`, `toes-to` | Flexión de tronco: el plan evita dos en un mismo día. |
| `split`, `lunge`, `staggered`, `kickstand` | Postura dividida: indicación de carga contralateral en trabajo de pierna a un lado. |
| `nordic` | Nunca relleno de Focus ni estación de circuito. |
| `-not-stated`, `-any-kind`, `-any-loading` | Se trata como marcador genérico: última opción. |
| Palabras de máquina: `leg-press`, `hack-squat-machine`, `pendulum-squat`, `belt-squat`, `leg-extension-machine`, `seated-leg-curl`, `lying-leg-curl`, `lat-pulldown`, `assisted-pull-up`, `machine-row`, `machine-chest-press`, `seated-machine-shoulder-press`, `hip-thrust-machine` | Qué máquina (y qué ficha de equipo) necesita un montaje `machine`; cualquier otra máquina cuenta como máquina de selector. |

Los levantamientos olímpicos desde el piso y la lista de flexión profunda de rodilla también son en parte listas fijas (`fromFloor` en `athleticFor`, `DEEP_KNEE_IDS` en `review-v12.mjs`). Un levantamiento nuevo de ese tipo necesita que un mantenedor lo agregue a la lista.

## 7. Tres ejemplos completos

Los tres se agregaron a una copia de trabajo del repositorio, se compilaron y se probaron (2026-10-09): la compilación y `check-model` pasaron con 0 errores y, después de subir los dos números fijados (paso 8.10), toda la batería de pruebas pasó con 0 fallas. Son ejemplos: **no** están en el catálogo.

### 7.1 Un ejercicio de resistencia: Remo Meadows con landmine (Landmine Meadows Row)

Un remo pesado a un brazo tomando el extremo grueso de una barra en landmine, inclinado, con postura escalonada.

| Lente | Decisión | Por qué |
|---|---|---|
| ¿Duplicado? | No. La biblioteca tiene un remo a un brazo con mancuerna / kettlebell apoyado en banco, un remo inclinado con barra a dos manos y un remo con apoyo de pecho. Este cambia en montaje, nivel y restricción, así que es un registro nuevo. | LIB-17; sección 2 |
| Familia | `RESISTANCE`: entrena un músculo con series x repeticiones. | CAT-01 |
| Patrón | `HPULL`, jalón horizontal, nodo `RP.PL.H.UL`: slot `RP_HPULL`, más `FOCUS`. | §4.2 |
| Lateralidad, plano | `unilateral` (10 repeticiones por brazo = 1 serie), `sagittal`. | UNI-01, UNI-07 |
| Zona de Davidson | 2: manos al frente, jalón horizontal, sesgo de rotación interna. | R2-LIB-02, R2-LIB-03 |
| Nivel | `intermediate`: la carga cuelga baja y al frente (una posición fácil), pero la persona está inclinada, en postura escalonada, sin apoyo ni asiento; el equilibrio y la técnica de bisagra suben un escalón. Un remo con apoyo de pecho sigue siendo fundamental. | CAT-04, R2-LIB-02 |
| Músculos | Espalda (grande) 1.0; bíceps 0.25 y deltoides posterior 0.25 como auxiliares. En el plan el crédito del deltoides posterior cuenta dentro del grupo de hombros. | VOL-09, CAT-02, R3-VOL-01 |
| Equipo, restricción | Un montaje `["landmine", "barbell"]`; restricción 2 (peso libre de pie). | EQ-13 |
| Carga axial | `low`, "not counted": la carga está en la mano y no es una sentadilla ni una bisagra. | R2-SES-01, R2-SES-02 |
| Palabras del id | `bent-over` da la etiqueta `bent_over`, así el dolor de cuello, espalda alta y espalda baja lo evita. | sección 6 |
| Ejes de variación | `grip`, `stance`, `range`. | R2-LIB-01 |
| Estado | `proposed_v1_1`, `default_candidate: false`. | CAT-07 |

Registro fuente (lo que usted agrega):

```json
{
 "id": "landmine-meadows-row-bent-over",
 "name": "Landmine Meadows Row (bent-over, one arm)",
 "record_type": "exercise",
 "generic": false,
 "status": "proposed_v1_1",
 "aliases": [],
 "placements": [],
 "taxonomy": {
  "family": "RESISTANCE",
  "region": "UPPER",
  "pattern_code": "HPULL",
  "category": "horizontal_pull",
  "category_label": "HORIZONTAL PULL",
  "pattern_label_verbatim": null,
  "sub_pattern": "UNILATERAL",
  "path": "RESISTANCE > UPPER > HORIZONTAL PULL > UNILATERAL",
  "node_01_taxonomy": "RP.PL.H.UL"
 },
 "laterality": "unilateral",
 "plane": "sagittal",
 "level": {
  "primary": "intermediate",
  "basis": "PROPOSED (new record): the load hangs low and in front (an easy position), but the lifter stands bent over on a staggered stance with no pad or seat, so balance and hinge skill raise it one rung (COACH-ANSWER CAT-04; COACH-R2 R2-LIB-02)",
  "generator_min_level": "intermediate",
  "generator_min_level_basis": "primary level; higher-level clients may still pick it (COACH-ANSWER CAT-05)"
 },
 "primary_muscles": ["lats", "upper_back"],
 "secondary_muscles": ["biceps", "rear_delts", "forearms_grip", "obliques"],
 "coach_muscle_groups": ["BACK"],
 "muscle_size_class": "big",
 "exercise_class": "compound",
 "volume_counting": "hypertrophy_sets",
 "equipment": {
  "setups_any_of": [["landmine", "barbell"]],
  "implements": ["landmine", "barbell"],
  "machine_type": null,
  "basis": "PROPOSED (new record)",
  "substitutes_by_equipment": {},
  "min_access_tier": 3,
  "min_access_tier_label": "T3 gym",
  "household_substitutions": []
 },
 "no_equipment_ok": false,
 "minimal_kit_ok": false,
 "home_weights_ok": false,
 "load_ceiling": "moderate",
 "skill_demand": "moderate",
 "impact_level": "none",
 "typical_rep_range": {"value": "8-12 per side", "dose_unit": "reps per side", "basis": "PROPOSED (new record)"},
 "video_urls": [],
 "sources": ["PROPOSED - PENDING COACH APPROVAL (contributor addition 2026-10-09)"],
 "inferred_fields": ["muscles", "equipment", "typical_rep_range", "level", "constraint_level", "davidson_zone", "axial_spinal_load"],
 "notes": ["Bent-over one-arm row on the thick end of a landmine bar; staggered stance, free hand on the front knee."],
 "related": ["single-arm-db-kb-row", "bent-over-barbell-row", "chest-supported-row"],
 "new_in_v1_1": {
  "kind": "PROPOSED-ADDITION",
  "qid": "PROPOSED 2026-10-09",
  "evidence": "PROPOSED - PENDING COACH APPROVAL",
  "why_needed": "a heavy one-arm back row for full-gym clients that is neither bench-supported nor a barbell bent-over row"
 },
 "generator": {"eligible": true, "pools": ["HPULL"], "default_candidate": false, "why": "PROPOSED addition - swap only until the coach approves it"},
 "constraint_level": {"value": 2, "basis": "PROPOSED: standing free weight = level 2 on the approved 1-5 scale (COACH-ANSWER EQ-13)"},
 "volume_credit": {
  "counts_toward_muscle_volume": true,
  "per_set": {"BACK": 1.0, "BICEP": 0.25, "SHOULDERS/TRAPS": 0.25},
  "basis": "COACH-ANSWER VOL-09: 1.0 to the main mover, 0.25 to each helper",
  "set_counting": "one set = both sides (10/10 = 1 set) - COACH-ANSWER UNI-01 / UNI-07"
 },
 "davidson_zone": {
  "zone": 2,
  "rotation_bias": "internal-rotation bias (horizontal: hands in front / knee at hip height; compressive)",
  "basis": "zone PROPOSED for this new record; meaning approved by COACH-R2 R2-LIB-02 (tag only; level from load position, skill and stability)",
  "use_v1_1": "swap selector when something hurts (pick the other bias); both biases every week (COACH-R2 R2-LIB-03)"
 },
 "axial_spinal_load": {
  "value": "low",
  "basis": "PROPOSED: bent-over hold with the load in one hand; not on the back",
  "spine_day_v1_1": {"class": "not counted", "counts_as_heavy_spine_lift": false, "evidence": "COACH-R2 R2-SES-02 (counted: barbell squats, barbell or trap-bar deadlifts and RDLs, good mornings)"}
 },
 "variation_v1_1": {"axes": ["grip", "stance", "range"], "evidence": "COACH-R2 R2-LIB-01 (rule approved); axes PROPOSED"},
 "sport_use_v1_1": []
}
```

Lo que hizo el compilador:

| Campo de ejecución | Valor | Significado |
|---|---|---|
| `credit_class`, `credits` | `HPULL`, `{lats_upper_back: 1, biceps: 0.25, rear_delts: 0.25}` | Su crédito de remo, que sale del patrón. |
| `primary_muscle` | `lats_upper_back` | La espalda es el motor principal. |
| `slots`, `default_in_slots` | `["FOCUS", "RP_HPULL"]`, `[]` | Alternativa para cualquier slot de jalón horizontal o un slot Focus de espalda; todavía nunca la elección principal. |
| `equipment.any_of` | `[["barbell", "landmine"]]` | Necesita las dos cosas; hoy solo los perfiles de gimnasio completo incluyen un landmine. |
| `zone`, `rotation_bias` | `2`, `internal` | Sirve para elegir una alternativa con dolor de hombro. |
| `tags` | `["barbell", "bent_over", "fixed_grip"]` | Filtros de dolor: se evita con dolor de cuello, espalda alta o espalda baja (`bent_over`) y con dolor de hombro, codo o muñeca (`fixed_grip`). |
| `axial`, `spine_class` | `false`, `not_counted` | No es uno de los dos levantamientos pesados de columna de la semana. |
| `older_ok`, `older_opt_in_ok` | `true`, `true` | Permitido para 60+ (no es trabajo de potencia). |
| `rule_refs` | `["PROPOSED 2026-10-09"]` | De dónde viene. |

En los planes: en la prueba apareció solo en las listas de alternativas de los slots de jalón horizontal del plan de muestra de fútbol americano. Una serie = los dos brazos.

<details><summary>Registro compilado completo</summary>

```json
{"id": "landmine-meadows-row-bent-over", "source_id": "landmine-meadows-row-bent-over", "name_key": "exercise.landmine-meadows-row-bent-over.name", "cue_key": null, "kind": "exercise", "family": "RESISTANCE", "pattern": "HPULL", "node": "RP.PL.H.UL", "slots": ["FOCUS", "RP_HPULL"], "default_in_slots": [], "laterality": "unilateral", "plane": "sagittal", "level": "intermediate", "zone": 2, "rotation_bias": "internal", "size_class": "big", "exercise_class": "compound", "counting": "hypertrophy_sets", "credit_class": "HPULL", "credits": {"lats_upper_back": 1, "biceps": 0.25, "rear_delts": 0.25}, "primary_muscle": "lats_upper_back", "equipment": {"any_of": [["barbell", "landmine"]], "machine": null}, "constraint": 2, "axial_class": "low", "axial": false, "spine_class": "not_counted", "axial_pattern": null, "skill": "moderate", "impact": "none", "load_ceiling": "moderate", "is_athletic": false, "athletic": null, "conditioning": null, "medball": null, "older_ok": true, "older_opt_in_ok": true, "youth_ok": true, "tags": ["barbell", "bent_over", "fixed_grip"], "variation_axes": ["grip", "stance", "range"], "rep_hint": {"text": "8-12 per side", "unit": "reps per side"}, "video": null, "status": "proposed_v1_1", "sport_use": [], "rule_refs": ["PROPOSED 2026-10-09"]}
```
</details>

Fila del nombre en español (`tools/compile/es/exercises.mjs`):

```js
  'Landmine Meadows Row (bent-over, one arm)': 'Remo Meadows con landmine, inclinado a un brazo (Meadows Row)',
```

### 7.2 Un pliométrico: Saltos de tobillo en hexágono (Hexagon Ankle Hops)

Saltos rápidos y bajos con los dos pies hacia afuera de cada lado de un hexágono marcado en el piso y de regreso al centro, mirando siempre hacia el mismo lado.

| Lente | Decisión | Por qué |
|---|---|---|
| ¿Duplicado? | No. La familia de saltos de tobillo tiene saltos laterales, en zigzag, en ángulo recto y adelante / atrás, pero no un hexágono en todas direcciones. (Un hexágono más grande o más chico sería solo una variación de `range`.) | LIB-17; sección 2 |
| Familia | `ATHLETIC`: entrena una cualidad (tobillos rápidos y rígidos), se cuenta en contactos, nunca en series de músculo. | VOL-10 |
| Patrón | `ANKLE` (salto de tobillo / rodilla limitada), nodo `AP.JMP.LK`: slot `AP_JUMP_LIMITED_KNEE`. | §4.2 |
| Lateralidad, plano | `bilateral`, `multi` (adelante, de lado y atrás en cada vuelta). | CAT-03 |
| Zona | Ninguna: las zonas no aplican a los pliométricos. | CAT-10 |
| Nivel | `foundational`: saltos bajos con dos pies, sin carga; el cambio de dirección es la única exigencia extra. | CAT-04 |
| Balístico o pliométrico | `plyometric`: contactos cortos, elásticos y repetidos (los saltos de tobillo están en su lista pliométrica). | R2-ATH-02 |
| Etapa Recibir-Crear | Por defecto 3 (Repetir), `repeated_receive_create`. El plan igual elige la etapa de cada semana. | R2-ATH-03 |
| Músculos | Ninguno acreditado. Las pantorrillas trabajan, pero el trabajo atlético nunca cuenta como series. | VOL-10 |
| Equipo, restricción | `[["none"]]` (cinta o gis); restricción 1 (peso corporal, reactivo). | EQ-13 |
| Impacto | `low`: sin etiqueta `high_impact`. | |
| 60+ | `older_default_excluded: true`: desactivado por defecto desde los 60, activable con la advertencia. | R2-ATH-08, R3-ATH-02 |
| Raqueta 50-59 | Un salto de bajo impacto sin ninguna de las etiquetas que se evitan (salto en profundidad, de valla, bound): permitido. | R3-ATH-02 |
| Palabras del id | `ankle-hops` da la etiqueta `ankle_hop`, que el bloque bajo de tobillo prefiere. | sección 6 |
| Uso por deporte | pickleball, tenis, pádel, básquetbol (un bono de selección, nunca un filtro). | R3-ATH-04 |

Registro fuente:

```json
{
 "id": "hexagon-ankle-hops",
 "name": "Hexagon Ankle Hops",
 "record_type": "exercise",
 "generic": false,
 "status": "proposed_v1_1",
 "aliases": [],
 "placements": [],
 "taxonomy": {
  "family": "ATHLETIC",
  "region": "ATHLETIC",
  "pattern_code": "ANKLE",
  "category": "jumping_ankle",
  "category_label": "JUMPING ANKLE / LIMITED KNEE",
  "pattern_label_verbatim": null,
  "sub_pattern": "JUMPING ANKLE",
  "path": "ATHLETIC > JUMPING ANKLE / LIMITED KNEE > JUMPING ANKLE",
  "node_01_taxonomy": "AP.JMP.LK"
 },
 "laterality": "bilateral",
 "plane": "multi",
 "level": {
  "primary": "foundational",
  "basis": "PROPOSED (new record): low hops on both feet, no load; the direction change each hop is the only extra demand",
  "generator_min_level": "foundational",
  "generator_min_level_basis": "primary level; higher-level clients may still pick it (COACH-ANSWER CAT-05)"
 },
 "primary_muscles": ["calves"],
 "secondary_muscles": ["quads", "glutes", "glute_med", "lower_leg_foot"],
 "coach_muscle_groups": [],
 "muscle_size_class": "small",
 "exercise_class": "athletic",
 "volume_counting": "contacts",
 "equipment": {
  "setups_any_of": [["none"]],
  "implements": ["none"],
  "machine_type": null,
  "basis": "PROPOSED (new record): a hexagon of tape or chalk on the floor, about 60 cm (24 in) a side",
  "substitutes_by_equipment": {},
  "min_access_tier": 0,
  "min_access_tier_label": "T0 bodyweight + household",
  "household_substitutions": []
 },
 "no_equipment_ok": true,
 "minimal_kit_ok": true,
 "home_weights_ok": true,
 "load_ceiling": "low",
 "skill_demand": "moderate",
 "impact_level": "low",
 "typical_rep_range": {"value": "2-3 trips around the hexagon (12-18 contacts)", "dose_unit": "contacts", "basis": "PROPOSED (new record)"},
 "video_urls": [],
 "sources": ["PROPOSED - PENDING COACH APPROVAL (contributor addition 2026-10-09)"],
 "inferred_fields": ["muscles", "equipment", "typical_rep_range", "level", "constraint_level", "athletic_quality"],
 "notes": ["Face one way the whole time; hop out over each side of the hexagon and back to the centre, quick and low."],
 "related": ["bilateral-lateral-ankle-hops", "bilateral-zig-zag-ankle-hops"],
 "new_in_v1_1": {
  "kind": "PROPOSED-ADDITION",
  "qid": "PROPOSED 2026-10-09",
  "evidence": "PROPOSED - PENDING COACH APPROVAL",
  "why_needed": "a multi-direction, low-impact ankle drill for court players (pickleball, tennis, padel)"
 },
 "generator": {"eligible": true, "pools": ["ANKLE"], "default_candidate": false, "why": "PROPOSED addition - swap only until the coach approves it"},
 "constraint_level": {"value": 1, "basis": "PROPOSED: bodyweight reactive = level 1 (COACH-ANSWER EQ-13)"},
 "volume_credit": {
  "counts_toward_muscle_volume": false,
  "per_set": {},
  "basis": "COACH-ANSWER VOL-10: athletic patterns never count toward muscle volume; tracked as contacts"
 },
 "athletic_quality": {
  "value": "plyometric (short ground contact, repeated)",
  "plyo_method": "repeated_receive_create",
  "receive_create_stage": {"default_stage": 3, "default_stage_name": "Repeat", "stages_available": [1, 2, 3], "role": "default_as_named", "evidence": "COACH-R2 R2-ATH-03"},
  "unilateral_harder": false,
  "basis": "COACH-R2 R2-ATH-02 (pogo and ankle hops are plyometric: short, bouncy contacts)"
 },
 "contact_class_v1_1": {"value": "plyometric", "basis": "COACH-R2 R2-ATH-02"},
 "older_default_excluded": {
  "value": true,
  "population": "older adults (60+)",
  "what": "Olympic lifts, plyos and depth jumps are not in a 60+ plan by default",
  "opt_in": "an additional option when the client wants it (or their coach decides), shown with the warning",
  "warning_key": "WARN_60PLUS_POWER_WORK",
  "evidence": "COACH-R2 R2-ATH-08; COACH-R3 R3-ATH-02 (low ankle hops off by default from 60, can be switched on with the warning)"
 },
 "population_rules": [
  {"population": "older adults (60+)", "rule": "excluded by default; opt-in with the WARN_60PLUS_POWER_WORK warning", "evidence": "COACH-R2 R2-ATH-08; COACH-R3 R3-ATH-02"}
 ],
 "variation_v1_1": {"axes": ["range"], "evidence": "COACH-R2 R2-LIB-01 (rule approved); axes PROPOSED"},
 "sport_use_v1_1": ["pickleball", "tennis", "padel", "basketball"]
}
```

Lo que hizo el compilador:

| Campo de ejecución | Valor | Significado |
|---|---|---|
| `credit_class`, `credits`, `is_athletic` | `ATHLETIC`, `{}`, `true` | Nunca una serie de músculo. |
| `slots` | `["AP_JUMP_LIMITED_KNEE"]` | El bloque bajo de tobillo. |
| `athletic` | `quality: plyometric`, `contact_class: plyometric`, `plyo_method_default: repeated_receive_create`, `rc_stage_default: RC3`, `count_unit: contacts` | Cuenta como contactos pliométricos en la proporción del deporte (pickleball: 50 % al final de un bloque). |
| `tags` | `["ankle_hop", "plyo_repeated"]` | Preferido en el bloque de tobillo; se evita con dolor de tobillo o pie (`plyo_repeated`). |
| `older_ok`, `older_opt_in_ok` | `false`, `true` | Desactivado por defecto desde los 60; disponible al activarlo con la advertencia. |
| `rule_refs` | `["PROPOSED 2026-10-09", "R2-ATH-08"]` | Agregado por la regla de 60+. |

<details><summary>Registro compilado completo</summary>

```json
{"id": "hexagon-ankle-hops", "source_id": "hexagon-ankle-hops", "name_key": "exercise.hexagon-ankle-hops.name", "cue_key": null, "kind": "exercise", "family": "ATHLETIC", "pattern": "ANKLE", "node": "AP.JMP.LK", "slots": ["AP_JUMP_LIMITED_KNEE"], "default_in_slots": [], "laterality": "bilateral", "plane": "multi", "level": "foundational", "zone": null, "rotation_bias": null, "size_class": "small", "exercise_class": "athletic", "counting": "contacts", "credit_class": "ATHLETIC", "credits": {}, "primary_muscle": null, "equipment": {"any_of": [[]], "machine": null}, "constraint": 1, "axial_class": "none", "axial": false, "spine_class": "not_counted", "axial_pattern": null, "skill": "moderate", "impact": "low", "load_ceiling": "low", "is_athletic": true, "athletic": {"quality": "plyometric", "contact_class": "plyometric", "olympic_family": null, "day_pattern": null, "olympic_tier": null, "full_catch": false, "from_floor": false, "plyo_method_default": "repeated_receive_create", "rc_stage_default": "RC3", "unilateral_harder": false, "loaded_jump": false, "count_unit": "contacts"}, "conditioning": null, "medball": null, "older_ok": false, "older_opt_in_ok": true, "youth_ok": true, "tags": ["ankle_hop", "plyo_repeated"], "variation_axes": ["range"], "rep_hint": {"text": "2-3 trips around the hexagon (12-18 contacts)", "unit": "contacts"}, "video": null, "status": "proposed_v1_1", "sport_use": ["basketball", "padel", "pickleball", "tennis"], "rule_refs": ["PROPOSED 2026-10-09", "R2-ATH-08"]}
```
</details>

Fila del nombre en español:

```js
  'Hexagon Ankle Hops': 'Saltos de tobillo en hexágono (Hexagon Ankle Hops)',
```

### 7.3 Un ejercicio de core: Sierra en plancha con deslizadores (Slider Body Saw)

Una plancha de antebrazos con los pies sobre deslizadores (o una toalla en un piso liso): el cuerpo se mece hacia adelante y hacia atrás desde los hombros mientras el tronco se queda quieto.

| Lente | Decisión | Por qué |
|---|---|---|
| ¿Duplicado? | No. Existen la plancha de antebrazos y el rodillo con balón medicinal; la base que se desliza y la palanca más larga hacen un escalón más difícil, no un cambio de un solo detalle. | sección 2 |
| Familia | `CONTROL` (core). | CAT-08 |
| Patrón | `CT`, core tórax, nodo `CO.CT`: slots `CT_CORE_THORAX` y `CORE_ANY`. Su biblioteca archiva las planchas en CORE THORAX (OBSERVED), así que la sierra las sigue (INFERRED por analogía). | CAT-08 |
| Lateralidad, plano | `bilateral`, `sagittal`. | |
| Zona | Ninguna (core sin carga). | R2-LIB-02 |
| Nivel | `intermediate`: una plancha (fundamental) más una base que se desliza y una palanca más larga. | CAT-04 |
| Músculos | Abdomen y oblicuos 1.0 (series de core para el grupo core). | VOL-17 |
| Equipo, restricción | `[["slider"]]`: la ficha de equipo `slider` significa "toalla o deslizador en un piso liso", así que sirve en casa. Restricción 3 (core en el piso). | EQ-13 |
| Dosis | 20-40 s. `plank` en el id la vuelve un sostenido con tiempo de todas formas. | sección 6 |
| Ejes de variación | `range` (qué tan lejos se desliza). | R2-LIB-01 |

Registro fuente:

```json
{
 "id": "slider-body-saw-forearm-plank",
 "name": "Slider Body Saw (forearm plank)",
 "record_type": "exercise",
 "generic": false,
 "status": "proposed_v1_1",
 "aliases": [],
 "placements": [],
 "taxonomy": {
  "family": "CONTROL",
  "region": "CORE",
  "pattern_code": "CT",
  "category": "core_thorax",
  "category_label": "CORE THORAX",
  "pattern_label_verbatim": null,
  "sub_pattern": "CORE THORAX SAGITAL",
  "path": "CONTROL > CORE > CORE THORAX > CORE THORAX SAGITAL",
  "node_01_taxonomy": "CO.CT"
 },
 "laterality": "bilateral",
 "plane": "sagittal",
 "level": {
  "primary": "intermediate",
  "basis": "PROPOSED (new record): a forearm plank (foundational) with a sliding base and a longer lever; more stability demand, one rung up (COACH-ANSWER CAT-04)",
  "generator_min_level": "intermediate",
  "generator_min_level_basis": "primary level; higher-level clients may still pick it (COACH-ANSWER CAT-05)"
 },
 "primary_muscles": ["abs"],
 "secondary_muscles": ["obliques", "front_delts", "serratus", "lats"],
 "coach_muscle_groups": ["CORE"],
 "muscle_size_class": "small",
 "exercise_class": "control",
 "volume_counting": "control_sets",
 "equipment": {
  "setups_any_of": [["slider"]],
  "implements": ["slider"],
  "machine_type": null,
  "basis": "PROPOSED (new record): sliders, or a towel on a smooth floor",
  "substitutes_by_equipment": {},
  "min_access_tier": 0,
  "min_access_tier_label": "T0 bodyweight + household",
  "household_substitutions": ["slider: towel on a smooth floor"]
 },
 "no_equipment_ok": true,
 "minimal_kit_ok": true,
 "home_weights_ok": true,
 "load_ceiling": "low",
 "skill_demand": "moderate",
 "impact_level": "none",
 "typical_rep_range": {"value": "20-40 s of slow saws", "dose_unit": "seconds", "basis": "PROPOSED (new record)"},
 "video_urls": [],
 "sources": ["PROPOSED - PENDING COACH APPROVAL (contributor addition 2026-10-09)"],
 "inferred_fields": ["muscles", "equipment", "typical_rep_range", "level", "constraint_level", "taxonomy.pattern_code"],
 "notes": ["Forearm plank with the feet on sliders; rock the body forward and back from the shoulders while the trunk stays still. Filed CORE THORAX like the forearm plank in the coach's library (INFERRED by analogy, COACH-ANSWER CAT-08)."],
 "related": ["plank-forearm-low-plank", "medball-ab-rollouts-hands-on-medball"],
 "new_in_v1_1": {
  "kind": "PROPOSED-ADDITION",
  "qid": "PROPOSED 2026-10-09",
  "evidence": "PROPOSED - PENDING COACH APPROVAL",
  "why_needed": "a harder anti-extension step after the forearm plank that needs no gym"
 },
 "generator": {"eligible": true, "pools": ["CT"], "default_candidate": false, "why": "PROPOSED addition - swap only until the coach approves it"},
 "constraint_level": {"value": 3, "basis": "PROPOSED: floor core = level 3 (COACH-ANSWER EQ-13)"},
 "volume_credit": {
  "counts_toward_muscle_volume": true,
  "per_set": {"CORE": 1.0},
  "basis": "core control sets (VOL-17: about 2 core exercises a day; core first by default, ATH-11)"
 },
 "variation_v1_1": {"axes": ["range"], "evidence": "COACH-R2 R2-LIB-01 (rule approved); axes PROPOSED"},
 "sport_use_v1_1": []
}
```

Lo que hizo el compilador:

| Campo de ejecución | Valor | Significado |
|---|---|---|
| `credit_class`, `credits` | `CORE`, `{abs_obliques: 1}` | Una serie de core por serie. |
| `slots` | `["CORE_ANY", "CT_CORE_THORAX"]` | Estaciones de core tórax y de cualquier core. |
| `equipment.any_of` | `[["slider"]]` | Todos los perfiles de equipo, incluido peso corporal, incluyen `slider`. |
| `rep_hint` | `20-40 s of slow saws`, `seconds` | Un sostenido con tiempo. |
| `tags` | `[]` | Sin etiquetas; el motor igual lee `plank` en el id como core anti-movimiento y en el piso. |

En los planes: en la prueba apareció solo en la lista de alternativas del slot de core del plan de muestra de estética de cuerpo completo. Puede ir en la apertura ligera de core (2 ejercicios x 2 series, primero por defecto) o en un bloque de core. Cualquier día la persona o el coach puede desactivar el bloque de core (COACH-R3 R3-SES-02), y se omite cuando la persona excluye el trabajo en el piso.

<details><summary>Registro compilado completo</summary>

```json
{"id": "slider-body-saw-forearm-plank", "source_id": "slider-body-saw-forearm-plank", "name_key": "exercise.slider-body-saw-forearm-plank.name", "cue_key": null, "kind": "exercise", "family": "CONTROL", "pattern": "CT", "node": "CO.CT", "slots": ["CORE_ANY", "CT_CORE_THORAX"], "default_in_slots": [], "laterality": "bilateral", "plane": "sagittal", "level": "intermediate", "zone": null, "rotation_bias": null, "size_class": "small", "exercise_class": "control", "counting": "control_sets", "credit_class": "CORE", "credits": {"abs_obliques": 1}, "primary_muscle": "abs_obliques", "equipment": {"any_of": [["slider"]], "machine": null}, "constraint": 3, "axial_class": "none", "axial": false, "spine_class": "not_counted", "axial_pattern": null, "skill": "moderate", "impact": "none", "load_ceiling": "low", "is_athletic": false, "athletic": null, "conditioning": null, "medball": null, "older_ok": true, "older_opt_in_ok": true, "youth_ok": true, "tags": [], "variation_axes": ["range"], "rep_hint": {"text": "20-40 s of slow saws", "unit": "seconds"}, "video": null, "status": "proposed_v1_1", "sport_use": [], "rule_refs": ["PROPOSED 2026-10-09"]}
```
</details>

Fila del nombre en español:

```js
  'Slider Body Saw (forearm plank)': 'Sierra en plancha de antebrazos con deslizadores (Body Saw)',
```

## 8. Paso a paso: agregar, recompilar, probar

Todos los comandos se corren desde la raíz del repositorio.

**8.1 Busque duplicados** (sección 2) y decida: variación o registro nuevo.

**8.2 Parta de un hermano.** Imprima un registro del mismo patrón y copie su forma:

```sh
python3 - single-arm-db-kb-row <<'EOF'
import json, sys
for r in json.load(open('synthesis/02_exercise_catalog.json', encoding='utf-8')):
    if r['id'] == sys.argv[1]:
        print(json.dumps(r, indent=1, ensure_ascii=False))
EOF
```

**8.3 Escriba su o sus registros** en un archivo aparte, por ejemplo `mis-ejercicios.json`, como un arreglo JSON (uno o más registros). Llene todos los campos de la sección 5 y etiquete cada decisión.

**8.4 Agréguelos al catálogo**, conservando el formato exacto del archivo:

```sh
python3 - mis-ejercicios.json <<'EOF'
import json, sys
SRC = 'synthesis/02_exercise_catalog.json'
cat = json.load(open(SRC, encoding='utf-8'))
new = json.load(open(sys.argv[1], encoding='utf-8'))
ids = {r['id'] for r in cat}
for r in new:
    assert r['id'] not in ids, 'duplicate id ' + r['id']
    cat.append(r); ids.add(r['id'])
with open(SRC, 'w', encoding='utf-8') as f:
    f.write(json.dumps(cat, indent=1, ensure_ascii=False))  # mismo formato: sangría de 1 espacio, UTF-8, sin salto final
EOF
git diff --stat synthesis/02_exercise_catalog.json   # solo inserciones, ninguna eliminación
```

**8.5 Agregue el nombre en español** como una fila en `tools/compile/es/exercises.mjs > ES_EXERCISE_NAMES`. La clave es el **nombre en inglés tal como se compila** (el `name` sin los calificativos que se quitan). Español latinoamericano neutro, el término de gimnasio en inglés entre paréntesis, sin "the / with / and / single-leg / lunge / squat" fuera de los paréntesis, sin "liga / banda / cadena". La línea queda listada como traducción automática (PROPOSED) hasta que el coach, o un coach de su confianza, la apruebe (R2-GEN-08).

**8.6 Compile:**

```sh
node tools/compile-model.mjs
```

Imprime una línea de resumen. Verifique que `kept` creció en el número de registros que agregó y que `es_missing` es `0`. El código de salida 1 significa un error de contrato, y no se escribió nada.

**8.7 Lea su registro compilado** y compárelo con lo que quería (créditos, slots, nivel, equipo, etiquetas, banderas de 60+):

```sh
node -e 'const c = require("./model/catalog.json"); console.log(JSON.stringify(c.exercises.find(e => e.id === process.argv[1]), null, 1))' landmine-meadows-row-bent-over
```

**8.8 Corra las verificaciones de contrato:**

```sh
node tools/check-model.mjs        # su línea de resumen debe decir "errors":0
```

**8.9 Reconstruya la copia de referencia (fixture)** para que siga teniendo todos los registros activos:

```sh
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs
git diff --stat engine/fixtures/
```

Solo deben cambiar sus registros (y el manifiesto de la copia). Si cambia algo más, deténgase y avise a los mantenedores: la copia ya estaba desactualizada antes de su cambio.

**8.10 Actualice los números fijados.** `tests/compile.test.mjs` fija el número de ejercicios conservados (742 en el modelo 1.4.0; en tres lugares de la prueba "counts") y de líneas en español traducidas automáticamente (832 en el modelo 1.4.0). Suba cada uno en el número que agregó. Actualice también los conteos de ejercicios que citan `README.md` y `engine/README.md` si cambiaron.

**8.11 Corra todas las pruebas:**

```sh
node --test tests/                # 0 fallas; algunas pruebas están marcadas "todo" a propósito
```

**8.12 Regenere los planes de muestra y lea el diff:**

```sh
node tools/generate-samples.mjs   # cada muestra debe decir ok
git diff --stat samples/plans/
```

Un registro PROPOSED solo puede aparecer en listas de `swaps` y en los extras opcionales del plan (`meta.addons`). Si cambió una elección principal, algo está mal en el registro (casi siempre el estado).

**8.13 Abra el pull request** con: qué agregó y por qué (el vacío que llena); la tabla de lentes de cada ejercicio (como en la sección 7); las etiquetas de evidencia; los comandos que corrió y sus resultados; los cambios en las listas de alternativas de las muestras. Mantenga el PR solo con datos: registro del catálogo, fila en español, `model/`, copia de referencia y muestras regenerados, números fijados. Los cambios al compilador o al motor van en otro PR.

## 9. Cuando el coach aprueba (o dice que no)

Los mantenedores juntan las adiciones PROPOSED en la siguiente ronda de preguntas para el coach (como `round3_questions.json` y `coach-questions.html`). Su respuesta queda en un nuevo `coach_answers_round<N>.md`.

- **Aprobado:** ponga `status` en `added_v1_1` y `generator.default_candidate` en `true`; en `new_in_v1_1` ponga `kind: "coach-approved addition"`, `qid` = el id de su respuesta, `evidence: "COACH-R<N> <id>"`; reemplace PROPOSED por su id en cada fundamento (basis) que él confirmó. Recompile y pruebe: ahora `default_in_slots` tiene valores y los planes de muestra pueden cambiar sus elecciones principales, así que lea ese diff. El nombre en español sigue en revisión hasta que él o un coach de su confianza lo apruebe.
- **Con cambios:** aplique sus correcciones a los campos y dígalo en las líneas de fundamento.
- **Rechazado:** ponga `status` en `retired` (el compilador lo descarta; el registro se queda para que las referencias viejas se resuelvan), quite la fila en español y vuelva a bajar los números fijados.

## 10. Lista de verificación

- [ ] Busqué duplicados; es un ejercicio nuevo, no una variación de un solo detalle.
- [ ] `id`: único, minúsculas con guiones, palabras simples; sin palabras de bandas ni de V-squat; revisé la sección 6.
- [ ] `name`: inglés de gimnasio simple y genérico.
- [ ] `status: proposed_v1_1`, `generator.eligible: true`, `generator.default_candidate: false`, `generator.pools` lleno.
- [ ] Familia y patrón según 4.1 y 4.2; nodo lleno.
- [ ] Lateralidad y plano.
- [ ] Nivel por posición de la carga + habilidad + estabilidad (asiento, máquina o polea = más fácil), con su línea de fundamento.
- [ ] Zona de Davidson y sesgo en trabajo con carga que no es pliométrico (ninguno en pliométricos ni core sin carga).
- [ ] Músculos: principal y auxiliares listados; `per_set` escrito con los auxiliares; toda excepción (empuje de cadera, fondos, thruster, face pull, swing) es intencional.
- [ ] Montajes de equipo con las palabras conocidas; restricción 1-5.
- [ ] Carga axial y clase de columna (se cuenta solo la lista aprobada).
- [ ] Trabajo atlético: clase de contacto, texto de la cualidad, etapa Recibir-Crear, método pliométrico, `unilateral_harder`, familia olímpica si aplica; `counts_toward_muscle_volume: false`.
- [ ] 60+: `older_default_excluded` en todo salto, levantamiento olímpico y acondicionamiento con saltos; frases de población exactas.
- [ ] Sin bandas en ningún lugar; balón medicinal de 20 lb o menos.
- [ ] `variation_v1_1.axes` solo entre implement, stance, grip, range, which hand holds the weight.
- [ ] Sin indicación del coach salvo que él la haya escrito; video opcional.
- [ ] Evidencia: `sources`, `inferred_fields`, `new_in_v1_1` llenos; cada decisión etiquetada.
- [ ] Fila del nombre en español agregada.
- [ ] `node tools/compile-model.mjs` (kept +N, `es_missing` 0); registro compilado leído y correcto.
- [ ] `node tools/check-model.mjs`: 0 errores.
- [ ] Copia de referencia reconstruida; solo cambiaron mis registros.
- [ ] Números fijados actualizados; conteos del README actualizados.
- [ ] `node --test tests/`: 0 fallas.
- [ ] Muestras regeneradas: todas ok; el registro aparece solo en listas de alternativas o en los extras opcionales, nunca como elección.
- [ ] Descripción del PR con la tabla de lentes, las etiquetas y los resultados.

## 11. Solución de problemas

| Usted ve | Qué significa | Solución |
|---|---|---|
| `Error: unmapped implement X in <id>` (el compilador se detiene) | Una palabra de implemento que el compilador no conoce. | Use una palabra de 4.6, o abra un issue para un tipo de equipo nuevo. |
| `compile-model: N contract error(s); nothing written` | Falló una verificación de forma o de reglas (palabra de banda, id duplicado, valor inválido ...). | Lea las líneas `ERROR` y corrija el registro. |
| La prueba "counts: 733 kept ..." falla con `736 !== 733` | El conteo fijado de ejercicios. | Paso 8.10. |
| La prueba "i18n: every key used has EN and ES ..." falla con `845 !== 842` | El conteo fijado de traducciones automáticas. | Paso 8.10. |
| `es_missing` mayor que 0, o falta una clave `exercise.<id>.name` | No hay fila en español, o su clave no coincide con el nombre en inglés compilado. | Copie el nombre en inglés de `model/i18n/en.json` como clave. |
| Falla la prueba "Spanish exercise names ..." | Quedaron palabras en inglés fuera de los paréntesis, o el español es igual al inglés. | Reescriba el nombre en español. |
| `model/ is stale: run node tools/compile-model.mjs` | `model/` no coincide con las fuentes. | Recompile y suba los archivos regenerados. |
| Cambió una elección principal de un plan después de agregar un registro PROPOSED | El registro no quedó como extra opcional. | Revise `status: proposed_v1_1` y `default_candidate: false`. |
| Los créditos no son los que esperaba | Los decidió el patrón o una excepción. | Revise 4.2, las excepciones de `per_set` y las palabras del id (`face-pull`, `thruster`, `pullover`, `swing` ...). |
| Falta una etiqueta o sobra una | Las etiquetas salen del id, el patrón, el equipo y las frases de población. | Sección 6; pida una regla del compilador si el id no puede llevar la palabra. |
| `git diff` muestra todo el catálogo cambiado | El archivo se guardó con otro serializador. | Restáurelo y use el script del paso 8.4. |
