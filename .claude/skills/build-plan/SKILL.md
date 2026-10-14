---
name: build-plan
description: Build a training plan from Coach Lalo's model in a conversation - ask the plan questions, show the release and get an explicit "I accept", then build the plan (PDF + Markdown, English or Spanish, Blaze Camp or Son Hábitos brand) or hand out a prefilled web link. Use when someone asks for a workout program, training plan or routine from this model.
---

# Build a plan

Follow [AGENT_PLAYBOOK.md](../../../AGENT_PLAYBOOK.md) step by step. In short:

0. Read the brand's pack first: `agent/packs/<brand>/AGENTS.md` (the API, the legal links and the coach's flow).
1. Get the questions: `node tools/plan.mjs --questions --lang en` (or `--lang es`). Message 1: ask them ALL together, in order,
   each with its proposed answer filled in, so the person only corrects what is wrong. Never ask sex, gender, sleep, stress,
   job, lifestyle, energy or session length.
   End message 1 with a clear question: "Is everything right? Reply YES to continue, or tell me what to change." Wait for yes.
2. Message 2: the release word for word with the brand's legal links (in its pack), plus a one-line summary of the answers.
   End message 2 with a clear question: "Do you accept the terms and the release of liability? Reply I ACCEPT and I will build the plan."
   Never build without a clear YES to message 1 AND a clear acceptance of message 2 (CH7-14).
3. Show the release text (`release.versions` in the questions output: `release.client`, `release.coach` for a coach's client,
   `release.minor` too under 18). Build only after an explicit "I accept" in this conversation. Never assume it.
4. Write the answers to a scratch file and build:
   `node tools/plan.mjs --answers <file> --lang <en|es> --brand <blazecamp|sonhabitos> --out <dir> --format md,pdf --site <https://site>`
   (`--site` is required for Son Hábitos; it also gives the prefilled link). Exit 1 means answers are missing or invalid: the
   message says which, in plain words.
5. Deliver in one message: a 3-5 line summary (and any health warning), the PDF, and the link. Not the plan as text. Offer edits:
   `node tools/plan.mjs --plan <plan.json> --edits <edits.json> --out <dir>` (ops in `agent/README.md`).
6. When the person is not in this conversation, give the prefilled link instead (`node tools/plan.mjs --link --answers <file>
   --site <https://site>`): they accept the release and tap Build on the page.

Talk in plain words the whole time (the coach's rule, CH7-09): short sentences, common words, one idea at a time, no jargon
without a plain explanation ("leave 2 reps in the tank", not "2 RIR"). Keep exercise names and the release and health warning
text exactly as the tool gives them.

Nothing is kept: delete the scratch answers file when done.
