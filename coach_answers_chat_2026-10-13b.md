# Coach answers in chat, 2026-10-13, second set (CH7)

Coach Lalo (Gerardo Vera), in the build conversation about the web tool. Quoted verbatim, then the reading the team applies. Authority: newest, on branding and the legal party name of the web tool only. Nothing here changes the training model.

## CH7-01 A Son Hábitos copy of the tool

**Answer (verbatim):** "Please make me a copy of all of this everywhere you need to make it so that we can have one branded for Sonabitos. ... whenever you open it, it needs to be in Spanish first."

**Answer (verbatim), on keeping it in step:** "I think you have to make sure that it copies from the original repo in a way that, whatever we change in the original repo, it changes in the Sonabitos one."

**Reading.** One codebase, two brands. The Son Hábitos site is the same app built with `BRAND=sonhabitos` (`app/brands/sonhabitos.js`, `node tools/build-site.mjs --brand sonhabitos`), deployed as a second Vercel project from the same repository, so every change on `main` reaches both sites. It opens in Spanish; English stays one tap away. The plans are identical: same model, same engine.

## CH7-02 Credit and look

**Answers (chosen in chat):** credit "Son Hábitos only"; look "Use www.sonhabitos.com".

**Reading.** The Son Hábitos site shows only the Son Hábitos name and logo, in the colours of sonhabitos.com. "Blaze Camp", "Gerardo" and "Lalo" do not appear on it, except "Lalo Vera" inside the legal party line below. The build fails if they leak.

## CH7-03 The legal party for any brand

**Answer (verbatim):** "Either way, the corporation is BFit Studios Corp. You can always use that one for everything branded as that ... BFit Studios Corp., doing business as Sonaitos, for example, or doing business as BlazeCamp, or doing business as whatever we want in the future. All the legal in there has my information, so it should be fine."

**Reading.** The legal party on every brand is "Lalo Vera and BFit Studios Corp., doing business as <brand>" (ES: "Lalo Vera y BFit Studios Corp., que opera como <brand>"). Blaze Camp keeps its existing wording. Any future brand follows the same pattern: a new `app/brands/<brand>.js` with its name, colours, logo and the "doing business as" line.

## CH7-04 Agents that build plans: a public API

**Question.** A web API on each brand's site would let any AI agent (or anyone) build plans, the same as the website. Open, or locked?

**Answer (verbatim):** "yes"

**Reading.** The plan API is public and open like the website: no account, no key, nothing stored or logged (R3-GEN-01 still holds).

## CH7-05 Who accepts the release when an agent builds the plan

**Question.** When an agent builds a plan, the "I accept" comes from whoever talks to the agent. Acceptable, with the prefilled link (the client accepts on the website) recommended for clients building for themselves?

**Answer (verbatim):** "sure, whatever is easier and best"

**Reading.** An agent may build a plan once the person, or the coach for a client, says "I accept" in the conversation after seeing the release text in full. For a client building for themselves, the recommended path is the prefilled link: the client reads and accepts the release on the website. The liability gate (H20) still runs before every build.

## CH7-06 The Son Hábitos credit line

**Question.** The Son Hábitos site and PDF credit read "Son Hábitos · Nati Vera". Keep "Nati Vera"?

**Answer (verbatim):** "nati ver is fine"

**Reading.** The credit stays "Son Hábitos · Nati Vera".

## CH7-07 More or fewer supersets

**Question.** Plans pair exercises as supersets only when the supersets preference is on, and the wizard does not ask it. How should a person get them?

**Answer (verbatim):** "supersets will probably be an option if they click on an option button that says "More supersets" or something like that. You figure that out. I don't know. Something that can be simple, but they can choose to have them more often in their training or less often. Something like that, maybe, without complicating things"

**Reading.** One simple choice under the plan's options: *Supersets: as planned* (the default; the template's pairs stay straight sets, with the superset suggestion printed) or *More supersets* (the template's pairs are done as supersets). It is the person's choice at any level; it replaces the level limit (beginners and advanced only, from ORD-05) for this preference. Nothing else changes: the same exercises, sets and order.

## CH7-08 The person's own exercise

**Question.** Editing adds library exercises only; the person's own exercise (CH6-02) is not built. What next?

**Answer (verbatim):** "I think right now, editing uses library exercises only should be fine this is the mvp. We can learn from this and maybe add it in the next round when we do V2."

**Reading.** Version 1 (the MVP) edits with library exercises only. The person's own exercise (CH6-02) moves to version 2.

## CH7-09 Plain words

**Answer (verbatim, 2026-10-13):** "all explanations should be elementary school reading comprehension"

**Reading.** Every explanation a person reads, in the web tool, the printed plan (Markdown, day cards, PDF) and what an agent says, reads at about a 3rd-5th grade level, in English and in neutral Latin American Spanish: short sentences (about 12-15 words at most), common words, active voice, one idea per sentence, and no jargon without a plain explanation ("RIR" is "reps left in the tank", "RPE 8" is "effort 8 out of 10", the stairway is "the plan adds sets week by week", a back-off set is "a lighter set"). Words only: the meaning, the numbers and the rules stay exactly the same. Exercise names, labels and the [LEGAL REVIEW] copy (release, health warning, disclaimers) are not rewritten; the legal copy waits for the attorney. Built in `tools/fixture/v07-plain.mjs` (model words) and `app/i18n.js` (web tool words); grades in `reviews/plain-words-2026-10-13.md`; checked by `tests/v07-plain-words.test.mjs` (DECISIONS G-315).

## CH7-10 How agents build a plan

**Answer (verbatim):** "The agents needed some modifications, i only did son habitos one; but you need to add instructions for agents on the repo so when they read it they understand what we need if we ask the agent something. Here is the example for son habitos, we need this as well for blaze camp and all future agents that get mcp or api access to know how to use it"

His Son Hábitos instructions (the model for every brand), in short: the plan comes from the brand's API, never invented; fetch the live questions first; **message 1** asks ALL the questions together, each with its proposed answer filled in, so the person only corrects what is wrong; **message 2** is the release word for word with its legal links (Spanish and English disclaimer pages, section 5 for coaches, and the PAR-Q), so the coach forwards them and the client confirms by text; only an explicit "Acepto" / "I accept" sends `accepted: true`, and the agent never accepts for anyone; build with `format: md`, keep only `summary` and `link`, build again with `format: pdf`; deliver in ONE message (a 3-5 line summary, the PDF with its ▶ YouTube buttons, the link); a client not in the chat gets the prefilled link; a health "yes" does not stop the plan; nothing is stored; the plan's numbers are edited only in the tool.

**Reading.** Every brand gets the same pack, generated from its brand file: `agent/packs/<brand>/` (`AGENTS.md` in the brand's own language first, the other language beside it, the questions in both, an example body, `check.sh`). `AGENT_PLAYBOOK.md`, the build-plan skill and the agents' rule list in `agent/questions.mjs` follow this flow. The Son Hábitos pack credits Son Hábitos only (CH7-02, CH7-06).
