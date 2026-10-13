# Agent tools: build plans from a conversation

Let an AI agent (Claude Desktop, Claude Code, Claude in Chrome, ChatGPT, or any agent with MCP, a shell or web calls) ask the plan
questions, build the plan and hand back a PDF and Markdown, in English or Spanish, for any brand. How the agent should talk to
the person is in [AGENT_PLAYBOOK.md](../AGENT_PLAYBOOK.md). Node 22, no npm dependencies, nothing stored or logged.

**Giving one brand's API to an agent?** Hand it that brand's pack: [packs/blazecamp/](packs/blazecamp/) or
[packs/sonhabitos/](packs/sonhabitos/). Its `AGENTS.md` is all the agent needs: the brand's API, the legal links and the
coach's two-message flow (CH7-10). `node agent/packs.mjs` rebuilds every pack; a new brand gets one automatically.

Everything uses the same code as the web tool: the wizard's answers (`app/intake-builder.js`), the engine, the model, the brand
(`app/brands/<id>.js` with `tools/brand-legal.mjs > brandModelRaw`, the same function the site build uses), the PDF (`app/pdf.js`
with the vendored jsPDF, run in Node) and the prefilled link (`app/prefill.js`). A plan built here is the plan the web tool builds.

| File | What |
|---|---|
| `core.mjs` | the shared logic: brands, the model per brand, answers -> intake, build, Markdown / PDF / JSON / HTML, edits |
| `questions.mjs`, `questions.json` | the questions as data (for the default brand); `node agent/questions.mjs --write` refreshes the JSON (a test checks it) |
| `mcp-server.mjs` | the MCP server (stdio) |
| `http.mjs` | the HTTP API behind `api/plan.mjs`, `api/questions.mjs`, `api/openapi.mjs` (Vercel functions) |
| `../tools/plan.mjs` | the command line |
| `../app/prefill.js` | the prefilled web link (encode / decode) |

## The rules every path keeps

* **Liability gate (H20).** No plan without `accepted: true` (answers) or `release.accepted: true` (intake). The agent sends it
  only after the person (the coach, for a client; a parent or guardian, under 18) read the release and said "I accept" in the
  conversation. The agent attests the acceptance by sending it (coach's decision, 2026-10-13). When the person is not in the
  conversation, the prefilled link is the path: they accept on the page.
* **Health check (R5-GEN-02).** A yes builds the plan with a health warning; it never stops it.
* **No forbidden inputs (H13, H16, CT-01).** The engine refuses sex, gender, sleep, stress, job, life, energy and session length.
* **Nothing kept (R3-GEN-01).** No storage, no logs, no request bodies anywhere. Files are written only to the output folder.

## Recipes

### Claude Desktop (MCP)

In `claude_desktop_config.json` (Settings > Developer > Edit Config), with absolute paths:

```json
{
  "mcpServers": {
    "blaze-plan": {
      "command": "node",
      "args": ["/absolute/path/to/blaze-camp-model/agent/mcp-server.mjs", "--out", "/absolute/path/to/plans"],
      "env": { "SITE_URL_BLAZECAMP": "https://<blaze camp site>", "SITE_URL_SONHABITOS": "https://<son habitos site>" }
    }
  }
}
```

Restart Claude Desktop. Then ask: "Build a plan for a client". Claude calls `get_questions`, asks, shows the release, and calls
`build_plan`. Without `--out` each plan goes to a new folder in the system's temp folder. `--brand sonhabitos` sets the default
brand; any call can pass `brand`.

### Claude Code

```sh
claude mcp add blaze-plan -- node agent/mcp-server.mjs --out ./plans     # from the repository root
```

The repository also has a skill, `.claude/skills/build-plan/SKILL.md` (uses the command line; no MCP needed). Ask Claude Code to
"build a plan" and it follows the playbook.

### ChatGPT (custom GPT with an Action)

1. Create a GPT. In its instructions paste [AGENT_PLAYBOOK.md](../AGENT_PLAYBOOK.md).
2. *Actions > Create new action > Import from URL*: `https://<the brand's site>/api/openapi`. Authentication: none.
3. The GPT calls `getQuestions`, asks, shows the release, then `buildPlan` with `format: "md"`. It gives back the Markdown
   overview and the prefilled `link`; the person opens the link to get the PDF from the web tool.

Each brand's site has its own API (the deployment's `BRAND`), so a Son Hábitos GPT imports the Son Hábitos site's URL.

### Any shell agent (CLI)

```sh
node tools/plan.mjs --questions --lang es                       # the questions (one language), the health questions, the release texts
node tools/plan.mjs --answers answers.json --lang es --brand sonhabitos --site https://<site> --out plans --format md,pdf
node tools/plan.mjs --intake samples/intakes/03-soccer.json --out plans --format md,pdf,json,html
node tools/plan.mjs --link --answers answers.json --site https://<site> --lang es   # only the prefilled link
node tools/plan.mjs --plan plans/<name>.json --edits edits.json --out plans         # edits; '--json' prints JSON
```

`answers.json` holds only what was asked, keyed by the question ids (dotted ids are nested):

```json
{ "age": 41, "weight": 72, "unit": "kg", "years": 2, "goal": "athletic",
  "sport": { "id": "soccer", "position": "winger" }, "days": 4, "equipment": "BASIC_GYM",
  "pain": [{ "area": "knee", "severity": "mild" }], "health": "none", "accepted": true }
```

Exit 1 means the answers are incomplete or invalid; the message lists what to fix in plain words.

### HTTP API

`GET /api/questions?lang=en|es`, `POST /api/plan` with `{answers | intake, lang, format: "md"|"json"|"pdf", view, weeks}`,
`GET /api/openapi`. Responses are `Cache-Control: no-store`. A missing release or health answer gives 422 with the problems and
the prefilled link; an invalid intake gives 422 with the errors. The API is open like the web tool (coach's decision,
2026-10-13). There is no rate limit yet: add one with a Vercel firewall rule if it is abused.

## Edits

`edit_plan` / `--edits` take the engine's operations (`engine/edit.mjs`):

* `{"op": "set_sets", "weekday": "Mon", "slot_id": "Mon.A1.s05", "sets": 3, "weeks": [1, 2]}` (weeks optional: all weeks)
* `{"op": "remove_exercise", "weekday": "Mon", "slot_id": "..."}`
* `{"op": "add_exercise", "weekday": "Mon", "exercise_id": "...", "sets": 3, "block": "..."}` (library exercises: `search_exercises`)
* `{"op": "set_block", "weekday": "Mon", "block": "core", "on": false}`
* `{"op": "swap_exercise", "weekday": "Mon", "slot_id": "...", "exercise_id": "..."}` (same place and dose)
* `{"op": "link_exercises", "weekday": "Mon", "slot_ids": ["Mon.A1.s09", "Mon.A1.s10"]}` (the person's own superset: 2 = superset,
  3 = triset, 4+ = giant set; done one after the other, then rest)
* `{"op": "unlink_exercises", "weekday": "Mon", "slot_id": "Mon.A1.s10"}` (also on the plan's own supersets)

`plan_slots` lists a week's slot ids and blocks, and `linked_with` (the group an exercise is done in, or null). An edited plan is written beside the original as `...-edited.<lang>.<ext>`.

## Brands

* Each Vercel deployment answers with its `BRAND` (default `blazecamp`). The CLI and the MCP server take `--brand` / `brand`.
* The brand's site address: `--site`, else env `SITE_URL_<ID>` (e.g. `SITE_URL_SONHABITOS`), else `SITE_URL`, else
  `app/brands/<id>.js > site_url`. The API uses its own host. It gives the prefilled link, and for a brand with its own
  disclaimer pages (Son Hábitos) the release link, so it is required for that brand.
* A new brand: add `app/brands/<id>.js` (+ its assets in `app/brands/<id>/`) and a Vercel project with `BRAND=<id>`. The site, the
  API, the CLI and the MCP server pick it up with no other change. Forks and branches inherit everything.
