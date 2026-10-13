# Agent playbook: building a plan in a conversation

For any AI agent (Claude, ChatGPT, others) that builds a training plan from the coach's model when someone asks. The tools are in
[agent/README.md](agent/README.md): an MCP server, a command line, and an HTTP API. They all give the same plan as the web tool.

The model is the work of Coach Lalo (Gerardo Vera), Master NASM coach. Plans are general fitness information, not medical advice.

**Start here: your brand's pack.** Each brand has a ready-made pack in [agent/packs/](agent/packs/) (`blazecamp/`, `sonhabitos/`,
and one for every future brand): `AGENTS.md` with the brand's API, legal links and this flow, the questions in English and
Spanish, an example body and `check.sh`. An agent given one brand's API reads that brand's `AGENTS.md` and follows it.

## The rules

* **Ask only the tool's questions.** Never ask sex, gender, sleep, stress, job, lifestyle or energy. Never ask how long a session
  should be: there is no session length.
* **Nothing is kept.** Do not save the answers or the plan anywhere except the files the person asked for. Do not reuse them later.
* **The release comes before the plan.** No plan is built until the release is accepted for that build.
* **A health "yes" does not stop the plan.** The plan is built with a health warning. Tell the person to see a medical
  professional first. Never say which answer caused the warning.
* **Talk in plain words** (the coach's rule, CH7-09: "all explanations should be elementary school reading comprehension").
  Write the way you would explain it to a 9-year-old, in English or Spanish:
  * short sentences, about 12 words or fewer, one idea each;
  * common words and the active voice ("add a set", not "a set is added");
  * no gym jargon without a plain explanation. Say "leave 2 reps in the tank" (not "2 RIR"), "effort 8 out of 10" (not
    "RPE 8"), "the plan adds sets week by week" (not "the stairway"), "a lighter set" (not "a back-off set"), "quick jumps"
    (not "plyometrics");
  * keep exercise names exactly as the tool gives them;
  * never reword the release, the health warning or other legal text: show it exactly as the tool gives it.

## Steps

1. **Get the questions.** Use `get_questions` (MCP), `node tools/plan.mjs --questions --lang en|es` (shell), or
   `GET /api/questions?lang=` (HTTP). Ask in the person's language. English and Spanish are both complete.
2. **Message 1: ask ALL the questions together** (the coach's rule, CH7-10), not one by one. Give each one its proposed
   answer already filled in (the default, or what you already know about the person: age, weight, whether they are new; 3 days
   by default), so the person only corrects what is wrong. Offer the choices by their labels. Skip a question whose `when` does
   not hold; what is not asked keeps its default. The order: who the plan is for (and, for a client, the health check now or
   skipped because the coach screens with their own process), then age, body weight, units and years of training, then the
   goal and its details (sport and position, activity, Focus muscles, or gym or bootcamp), then days per week and weekdays,
   then where they train, then options (split, supersets, plan length, start date, tests, extra equipment), then pain, then
   the 5 health questions.
3. **Message 2: the release, with its links,** plus a one-line summary of the answers. Always send the brand's legal links
   with it (the Spanish and English disclaimer pages and the PAR-Q, in the brand's pack), so a coach can forward them to the
   client as they are and the client confirms by text.
4. **Get acceptance.** Show the release text for their case from the questions (`release.versions`), word for word:
   * `release.client` when the person builds their own plan;
   * `release.coach` when a coach builds for a client (the coach accepts);
   * `release.minor` as well when the athlete is under 18 (a parent or legal guardian accepts; then send `guardian: true`).

   Then ask: "Do you accept the terms and the release of liability?" Build only after an explicit "I accept" (or the same in
   Spanish) **in this conversation**. Never assume it, never pre-tick it, and never accept for someone who is not in the
   conversation. You then send `accepted: true`: by doing so you attest that the person accepted it.
5. **Build.** `build_plan` with the answers (MCP), `node tools/plan.mjs --answers answers.json --lang es` (shell), or
   `POST /api/plan` (HTTP). If the result says answers are missing, ask those and build again. If it says the intake is
   invalid, read the errors to the person in plain words and ask again.
6. **Deliver in ONE message:** a 3-5 line summary (goal, days, weeks, start date, and the health warning if there is one), the
   PDF attached (every exercise has its ▶ that opens YouTube; over HTTP, build again with `"format": "pdf"`), and the link
   (opens the plan in the web tool to edit it or download the PDF again). Do not send the plan as text. Say once that it is
   general fitness information, not medical advice, and that it does not prevent injuries.
7. **Offer edits.** Everything is editable: sets on any day or week, adding or removing an exercise, switching a block (for
   example the core block) off or on, swapping an exercise, and linking two or more exercises into the person's own superset
   (`link_exercises`; `unlink_exercises` takes one out). Use `plan_slots` to find the exercise, `search_exercises` to add one,
   then `edit_plan`.
   The tool rebuilds the files. Read any "conflicts" to the person as information; the edit is still applied.

## The prefilled link (recommended when the person is not in the conversation)

When the coach builds for a client who will use the plan themselves, or when the person prefers to accept on the page, give a
**prefilled link** instead of building the plan for them. The tools return it as `link` when the brand's site is known
(`--site https://...`; the HTTP API always knows it). It opens the web tool with every answer filled in, on the last screen.
The person answers the health check, reads and accepts the release themselves, and taps Build. The answers sit in the part of
the link after `#`, which the browser never sends to a server. The link never carries the acceptance or the health answers.

## Brands

Each web site is one brand (Blaze Camp, Son Hábitos, any future one). Build with the brand the person uses: `--brand <id>` or
`brand` (`list_brands` shows them). The HTTP API answers with its own deployment's brand. The brand changes the name, the words,
the PDF's look and the legal party wording. The plan itself is the same.
