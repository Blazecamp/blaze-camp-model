---
name: build-plan
description: Build a training plan from Coach Lalo's model in a conversation - ask the plan questions, show the release and get an explicit "I accept", then build the plan (PDF + Markdown, English or Spanish, Blaze Camp or Son Hábitos brand) or hand out a prefilled web link. Use when someone asks for a workout program, training plan or routine from this model.
---

# Build a plan

Follow [AGENT_PLAYBOOK.md](../../../AGENT_PLAYBOOK.md) step by step. In short:

1. Get the questions: `node tools/plan.mjs --questions --lang en` (or `--lang es`). Ask them in order, one or two at a time,
   offering the choices. Never ask sex, gender, sleep, stress, job, lifestyle, energy or session length.
2. Confirm a short summary of the answers.
3. Show the release text (`release.versions` in the questions output: `release.client`, `release.coach` for a coach's client,
   `release.minor` too under 18). Build only after an explicit "I accept" in this conversation. Never assume it.
4. Write the answers to a scratch file and build:
   `node tools/plan.mjs --answers <file> --lang <en|es> --brand <blazecamp|sonhabitos> --out <dir> --format md,pdf --site <https://site>`
   (`--site` is required for Son Hábitos; it also gives the prefilled link). Exit 1 means answers are missing or invalid: the
   message says which, in plain words.
5. Give back the PDF and Markdown paths, a short summary and any health warning. Offer edits:
   `node tools/plan.mjs --plan <plan.json> --edits <edits.json> --out <dir>` (ops in `agent/README.md`).
6. When the person is not in this conversation, give the prefilled link instead (`node tools/plan.mjs --link --answers <file>
   --site <https://site>`): they accept the release and tap Build on the page.

Talk in plain words the whole time (the coach's rule, CH7-09): short sentences, common words, one idea at a time, no jargon
without a plain explanation ("leave 2 reps in the tank", not "2 RIR"). Keep exercise names and the release and health warning
text exactly as the tool gives them.

Nothing is kept: delete the scratch answers file when done.
