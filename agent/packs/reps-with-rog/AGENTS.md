# Reps with Rog plan builder: how to build a plan

Instructions for any agent that gets a request for a **training plan, workout, routine or program** (for someone on the team or for a client). The plan comes from the Reps with Rog API or it does not come at all: **never invent a workout**.

## The API

- Base: `https://white-label-previews.vercel.app/reps-with-rog` (Reps with Rog only: its logo, colors and legal line are on every plan and PDF)
- Questions: `GET /api/questions?lang=en` (`es` if the person writes in Spanish)
- Build the plan: `POST /api/plan`
- API description: `GET /api/openapi`
- How to talk to people: https://raw.githubusercontent.com/Blazecamp/blaze-camp-model/main/AGENT_PLAYBOOK.md
- Agent setup and MCP: https://raw.githubusercontent.com/Blazecamp/blaze-camp-model/main/agent/README.md
- All questions in one read (a copy): `questions.en.md`

## The legal links (ALWAYS sent with the release)

- Spanish: https://white-label-previews.vercel.app/reps-with-rog/disclaimer.es.html (section 5 is the part for coaches, the one that applies when the plan is for a client)
- English: https://white-label-previews.vercel.app/reps-with-rog/disclaimer.html
- PAR-Q (the 5 health questions come from here): https://eparmedx.com/

They are sent so the coach can forward them to the client as they are, and the client **confirms by text** that they accept. The agent never accepts for anyone.

## The flow, in TWO messages

**Message 1: all the questions together.** Not one by one. Each one with its proposed answer already filled in (age, weight and whether they are new come from what you already know about the client; the default is 3 days), and the person corrects what is wrong. The order:

1. who it is for (me / a client)
2. if it is for a client: the health check, run the PAR-Q now or skip it because the coach screens with their own process
3. age · weight · units · years training consistently
4. goal and its details (muscle: focus muscles · fat loss or general: gym or bootcamp · sport: sport, position, season, level, practices · stay active: activity, play days, event)
5. days per week and which days
6. where they train (full gym, basic gym, home gym, dumbbells and bench, kettlebells, bodyweight, hotel gym, field or track)
7. options (split, supersets, plan length, start date, tests, extra equipment)
8. anything that hurts (optional): area and mild / moderate / severe
9. the 5 health questions (unless the health check was skipped)

What is not asked keeps its default. **Never ask** sex or gender, sleep, stress, job, life, energy or session length: the engine refuses them.

**End message 1 with a clear question, on its own line:** "Is everything right? Reply **YES** to continue, or tell me what to change." Do not go on until the person says yes, go ahead, or similar. If they change something, show the updated answers and ask again.

**Message 2: the release, with its links.** Show the release text **word for word** (`release.versions` from `/api/questions`), with the two links above, plus a one-line summary of the answers.

Only with an **explicit "I accept" in that conversation** (or "Acepto") send `accepted: true`. Never assume it, never pre-tick it, and never accept for someone who is not in the chat. With clients, the coach accepts; the client confirms by text. A "yes" on health does not stop the plan: it comes with the warning to see a professional first, and never say which answer caused it.

**End message 2 with a clear question, on its own line:** "Do you accept the terms and the release of liability? Reply **I ACCEPT** (or YES) and I will build the plan." Build only after that answer. No plan is ever built without a clear YES to message 1 AND a clear acceptance of message 2.

## Build and deliver

- `POST /api/plan` with `{"answers": {...}, "lang": "en", "format": "md"}`. From the reply keep only `summary` and `link`: **do not send the plan as text**.
- 422 → read the `problems` list and ask for that.
- Repeat the POST with `"format": "pdf"` and save the file with the name in the `Content-Disposition` header.
- **One delivery message**: a 3-5 line summary (goal, days, weeks, start date and the health warning if there is one), the PDF attached (every exercise has its ▶ that opens YouTube) and the link (opens the plan in the web tool to edit it or download the PDF again).
- If the plan is for a client who is not in the chat: send the **prefilled link**; they accept the release on the page and tap Build. The PDF only if asked.

## Rules

- Nothing is stored: the answers are not kept after the plan is delivered.
- Never change the plan's numbers by hand: edits happen in the web tool through the link (swap, sets +/-, remove, add, link exercises into supersets). An agent with the MCP server can make the same edits with `edit_plan`.
- It is general fitness information, not medical advice, and it does not prevent injuries. Say it once, in the delivery.
- Talk in plain words: short sentences, common words.
- If the API fails, say the error. Never invent a plan.

---

Reps with Rog plan builder

_Generated by `node agent/packs.mjs` from the brand file and the live questions. Do not edit by hand._
