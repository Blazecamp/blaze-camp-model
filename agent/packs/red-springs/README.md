# Red Springs Fitness plan builder: agent pack

An agent that gets this pack knows what to do when someone asks for a training plan: **read `AGENTS.md`** and follow it. The plan comes from the API, never invented.

## What is here

| File | What |
|---|---|
| `AGENTS.md` | The full instructions. Read this first. |
| `AGENTS.es.md` | The same in the other language. |
| `questions.en.md` | Every question with its choices, defaults and when it applies (a copy; the live list is `/api/questions`). |
| `preguntas.es.md` | The same in the other language. |
| `answers.example.json` | An example body for `POST /api/plan`. |
| `check.sh` | Checks that the API is alive. |

## The API at a glance

```
GET  https://white-label-previews.vercel.app/red-springs/api/questions?lang=en
POST https://white-label-previews.vercel.app/red-springs/api/plan
GET  https://white-label-previews.vercel.app/red-springs/api/openapi
```

`POST` takes `{"answers": {...}, "lang": "en"|"es", "format": "md"|"json"|"pdf"}`. Without `accepted: true` (or without the health check when it applies) it answers **422** with the `problems` list and the prefilled link.

## The legal links (ALWAYS sent with the release)

- Spanish: https://white-label-previews.vercel.app/red-springs/disclaimer.es.html (section 5 is the part for coaches, the one that applies when the plan is for a client)
- English: https://white-label-previews.vercel.app/red-springs/disclaimer.html
- PAR-Q (the 5 health questions come from here): https://eparmedx.com/

---

Red Springs Fitness plan builder
