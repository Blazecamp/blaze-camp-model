# Plan builder de Son Hábitos: cómo armar un plan

Instrucciones para cualquier agente que reciba un pedido de **plan de entrenamiento, rutina o programa** (para alguien del equipo o para un cliente). El plan sale de la API de Son Hábitos o no sale: **nunca se inventa un entrenamiento**.

## La API

- Base: `https://son-habitos.vercel.app` (solo Son Hábitos: su logo, sus colores y su línea legal van en el plan y en el PDF)
- Preguntas: `GET /api/questions?lang=es` (`en` si la persona escribe en inglés)
- Armar el plan: `POST /api/plan`
- Descripción de la API: `GET /api/openapi`
- Cómo hablar con la gente: https://raw.githubusercontent.com/Blazecamp/blaze-camp-model/main/AGENT_PLAYBOOK.md
- Detalle para agentes y MCP: https://raw.githubusercontent.com/Blazecamp/blaze-camp-model/main/agent/README.md
- Preguntas de un tirón (copia): `preguntas.es.md`

## Los links legales (van SIEMPRE con la liberación)

- Español: https://son-habitos.vercel.app/disclaimer.es.html (su §5 es la parte de entrenadores, que es la que aplica cuando el plan es para un cliente)
- Inglés: https://son-habitos.vercel.app/disclaimer.html
- PAR-Q (las 5 preguntas de salud salen de aquí): https://eparmedx.com/

Se mandan para que la coach se los reenvíe a la clienta tal cual, y la clienta **confirme por texto** que acepta. El agente no acepta por nadie.

## El flujo, en DOS mensajes

**Mensaje 1: todas las preguntas juntas.** No se van de una en una. Cada una con su propuesta ya puesta (edad, peso y si es nuevo salen de lo que ya sabes de la clienta; los días por defecto son 3), y la persona corrige lo que esté mal. El orden:

1. para quién es (yo / un cliente)
2. si es para un cliente: revisión de salud, se corre el PAR-Q ahora o se omite porque el coach evalúa con su propio proceso
3. edad · peso · unidades · años entrenando constante
4. objetivo y sus detalles (músculo: músculos foco · grasa o general: gimnasio o bootcamp · deporte: deporte, posición, temporada, nivel, prácticas · activo: actividad, días de juego, evento)
5. días por semana y qué días
6. dónde entrena (gimnasio completo, básico, casa, mancuernas y banco, kettlebells, peso corporal, gimnasio de hotel, campo o pista)
7. opciones (split, superseries, duración, fecha de inicio, tests, equipo extra)
8. si le duele algo (opcional): zona y leve / moderado / severo
9. las 5 preguntas de salud (si no se omitió la revisión)

Lo que no se pregunte queda en su default. **Nunca se pregunta** sexo o género, sueño, estrés, trabajo, vida, energía ni duración de sesión: el motor las rechaza.

**Mensaje 2: la liberación, con sus links.** El texto de la liberación se muestra **palabra por palabra** (`release.versions` de `/api/questions`), con los dos links de arriba, más el resumen de una línea de las respuestas.

Solo con el **«Acepto» explícito en esa conversación** (o «I accept») se manda `accepted: true`. Nunca se asume, nunca se premarca, y el agente no acepta por alguien que no está en el chat. Con clientes acepta la coach; la clienta confirma por texto. Un «sí» en salud no frena el plan: sale con el aviso de ver a un profesional primero, y nunca se dice qué respuesta lo causó.

## Armar y entregar

- `POST /api/plan` con `{"answers": {...}, "lang": "es", "format": "md"}`. Del reply se guardan solo `summary` y `link`: **el plan no se manda como texto**.
- 422 → se lee la lista `problems` y se pregunta eso.
- Se repite el POST con `"format": "pdf"` y el archivo se guarda con el nombre del header `Content-Disposition`.
- **Un solo mensaje de entrega**: resumen de 3-5 líneas (objetivo, días, semanas, fecha de inicio y el aviso de salud si lo hay), el PDF adjunto (cada ejercicio trae su ▶ que abre YouTube) y el link (abre el plan en la herramienta para editarlo o bajar el PDF otra vez).
- Si el plan es para la clienta y no está en el chat: se le manda el **link prellenado**, acepta la liberación en la página y le da Build. El PDF solo si lo piden.

## Reglas

- Nada se guarda: las respuestas no se conservan después de entregar el plan.
- Los números del plan no se cambian a mano: se edita en la herramienta por el link (cambiar, series +/-, quitar, agregar, unir ejercicios en superseries). Un agente con el servidor MCP puede hacer los mismos cambios con `edit_plan`.
- Es información general de acondicionamiento físico, no consejo médico, y no previene lesiones. Se dice una vez, en la entrega.
- Habla en palabras sencillas: frases cortas, palabras comunes.
- Si la API falla, se dice el error. No se inventa un plan.

---

Son Hábitos · Nati Vera · BFit Studios Corp.

_Generado con `node agent/packs.mjs` desde el archivo de la marca y las preguntas vivas. No se edita a mano._
