# Agent playbook: building a plan in a conversation

For any AI agent (Claude, ChatGPT, others) that builds a training plan from the coach's model when someone asks. The tools are in
[agent/README.md](agent/README.md): an MCP server, a command line, and an HTTP API. They all give the same plan as the web tool.

The model is the work of Coach Lalo (Gerardo Vera), Master NASM coach. Plans are general fitness information, not medical advice.

## The rules

* **Ask only the tool's questions.** Never ask sex, gender, sleep, stress, job, lifestyle or energy. Never ask how long a session
  should be: there is no session length.
* **Nothing is kept.** Do not save the answers or the plan anywhere except the files the person asked for. Do not reuse them later.
* **The release comes before the plan.** No plan is built until the release is accepted for that build.
* **A health "yes" does not stop the plan.** The plan is built with a health warning. Tell the person to see a medical
  professional first. Never say which answer caused the warning.

## Steps

1. **Get the questions.** Use `get_questions` (MCP), `node tools/plan.mjs --questions --lang en|es` (shell), or
   `GET /api/questions?lang=` (HTTP). Ask in the person's language. English and Spanish are both complete.
2. **Ask the questions in order, one or two at a time.** Offer the choices by their labels. Skip a question whose `when` does not
   hold. Leave the defaults for anything the person does not care about. The questions are:
   who the plan is for, then age, body weight and years of training, then the goal and its details (sport and position,
   activity, Focus muscles, or gym or bootcamp), then days per week, weekdays and where they train, then any options (plan
   length, start date, tests, extra equipment), then pain, then the 5 health questions.
3. **Confirm a short summary** of the answers in a few lines, and let the person change anything.
4. **Show the release and get acceptance.** Show the release text for their case from the questions (`release.versions`):
   * `release.client` when the person builds their own plan;
   * `release.coach` when a coach builds for a client (the coach accepts);
   * `release.minor` as well when the athlete is under 18 (a parent or legal guardian accepts; then send `guardian: true`).

   Then ask: "Do you accept the terms and the release of liability?" Build only after an explicit "I accept" (or the same in
   Spanish) **in this conversation**. Never assume it, never pre-tick it, and never accept for someone who is not in the
   conversation. You then send `accepted: true`: by doing so you attest that the person accepted it.
5. **Build.** `build_plan` with the answers (MCP), `node tools/plan.mjs --answers answers.json --lang es` (shell), or
   `POST /api/plan` (HTTP). If the result says answers are missing, ask those and build again. If it says the intake is
   invalid, read the errors to the person in plain words and ask again.
6. **Give the plan back.** Offer the PDF (and the Markdown) the tool wrote, a short summary (program, days, weeks, start date)
   and the health warning if there is one. Say once that it is general fitness information, not medical advice.
7. **Offer edits.** Everything is editable: sets on any day or week, adding or removing an exercise, switching a block (for
   example the core block) off or on. Use `plan_slots` to find the exercise, `search_exercises` to add one, then `edit_plan`.
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
