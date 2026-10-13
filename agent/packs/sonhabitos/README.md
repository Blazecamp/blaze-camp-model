# Plan builder de Son Hábitos: paquete para agentes

Un agente que reciba este paquete ya sabe qué hacer cuando alguien pide un plan de entrenamiento: **lee `AGENTS.md`** y lo sigue. El plan sale de la API, nunca inventado.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `AGENTS.md` | Las instrucciones completas. Es lo que se lee primero. |
| `AGENTS.en.md` | Lo mismo en el otro idioma. |
| `preguntas.es.md` | Todas las preguntas con sus opciones, defaults y cuándo aplican (copia; la lista viva es `/api/questions`). |
| `questions.en.md` | Lo mismo en el otro idioma. |
| `answers.example.json` | Cuerpo de ejemplo para `POST /api/plan`. |
| `check.sh` | Comprueba que la API esté viva. |

## La API, de un vistazo

```
GET  https://plan.sonhabitos.com/api/questions?lang=es
POST https://plan.sonhabitos.com/api/plan
GET  https://plan.sonhabitos.com/api/openapi
```

`POST` acepta `{"answers": {...}, "lang": "es"|"en", "format": "md"|"json"|"pdf"}`. Sin `accepted: true` (o sin la revisión de salud cuando toca) devuelve **422** con la lista `problems` y el link prellenado.

## Los links legales (van SIEMPRE con la liberación)

- Español: https://plan.sonhabitos.com/disclaimer.es.html (su §5 es la parte de entrenadores, que es la que aplica cuando el plan es para un cliente)
- Inglés: https://plan.sonhabitos.com/disclaimer.html
- PAR-Q (las 5 preguntas de salud salen de aquí): https://eparmedx.com/

---

Son Hábitos · Nati Vera · BFit Studios Corp.
