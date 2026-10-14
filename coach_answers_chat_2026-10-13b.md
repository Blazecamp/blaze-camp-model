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

## CH7-11 The legal party of a white-label gym, and who releases whom

**Answer (verbatim):** "Just find me the closest thing to the best thing available. I think it's just Lalo Vera BFit Studios Corp. and then white-label whatever to whatever gym name and their corporation name. The agent needs to go find out who it is. For the gym, we need to know exactly how to just release to that gym, whether it be a client or a gym making the workout. It's the gym's responsibility to make sure that the person is signing a liability waiver for all of that, and the website itself doesn't release the responsibility."

**Reading (PROPOSED until his attorney decides; general information, not legal advice).**
- The released parties of a white-label brand are "Lalo Vera, BFit Studios Corp. and <gym's legal name> (doing business as <gym brand>)" (ES "Lalo Vera, BFit Studios Corp. y <razón social> (que opera como <marca>)"); when the gym's legal name is its brand name, it is named once. Son Hábitos and Blaze Camp keep their wording (CH7-03).
- The gym's disclaimer pages (EN and ES) get one more section, "How this tool is provided" / "Cómo se ofrece esta herramienta", in plain words: the gym offers the plan builder to its members and clients under license from BFit Studios Corp.; it is software that gives general fitness information; the gym does its own health screening and has every member or client sign the gym's own liability waiver before training, whether the person builds the plan or a coach at the gym builds it; the website's terms do not replace that waiver and do not move the gym's responsibility to Lalo Vera or BFit Studios Corp. The base disclaimer stays (its section 5 already covers coaches and gyms). The release text shown before a plan is built and the short release line carry the same parties and one short sentence on the gym's own waiver. Every [LEGAL REVIEW] marker stays.
- The agent finds the gym's company itself: `tools/new-brand.mjs --from-website` reads the footer copyright line, company endings (LLC, Inc., Corp., S.A. de C.V., S.A.S. ...) and the terms and privacy pages linked from the home page; `--legal-name` sets it by hand. Not found: the preview is still made with the brand name, marked `legal_name_confirmed: false`, and `tools/export-brand.mjs` refuses the hand-off until it is looked up (the state business registry, for Florida Sunbiz; or ask the gym). Steps in `WHITE_LABEL.md`.

## CH7-12 Logos as PNG, remade by the agent

**Answer (verbatim):** "Yes, the logos. The agent should remake the logo for a PNG to use it itself. It should just capture whatever online and remake it and have the power to rebuild."

**Reading.** Every white-label logo becomes a clean PNG that the tool uses everywhere (the header, the PDF cover, the icons): any image the website has (PNG, SVG, JPEG, WEBP, GIF, ICO, an inline SVG) is drawn by a browser (Playwright or a Chrome on the machine), trimmed, at most 512 px wide, transparent where an SVG is empty. With no usable logo, a wordmark of the gym's name in its main colour is made (`--logo-text`). With no browser, the agent makes the PNG with its own image tools and runs again with `--logo file.png`. `--force` rebuilds a brand (logo, colours, name, legal name) and keeps what it is not told to change.

## CH7-13 The preview link, right away

**Answer (verbatim):** "I don't really need a picture of the preview. I need the actual link to the preview right away."

**Reading.** `node tools/new-brand.mjs --from-website <url> --publish` makes the brand, runs its checks (leak check, trial build, contrast), commits only that brand's files to `main`, waits for the previews site, and prints only the link `https://white-label-previews.vercel.app/<id>/` and "live" (or "building, ready in ~1-2 min"). The agent sends the coach the link as soon as it prints; no screenshots in the report (the internal checks stay). The agent asks the coach for nothing unless the website gives no name or logo at all (with no logo, a wordmark of the name is made and the link still goes out; a real logo can follow with `--force --publish`).

## CH7-14 Both agent messages ask to confirm

**Answer (verbatim):** "The agent needs to ask to confirm, both messages should ASK to confirm so it prompts the reader to say YEs or GO AHEAD, but it needs to be clear. Give me the prompt to give to my agents so they know each mesage needs to have that before kicking out a fitness plan"

**Reading.** Message 1 (all the questions with proposed answers) ends with a clear question on its own line: "Is everything right? Reply YES to continue, or tell me what to change." (ES «¿Todo está bien? Responde SÍ para seguir, o dime qué cambiar.»). Message 2 (the release with its links) ends with: "Do you accept the terms and the release of liability? Reply I ACCEPT (or YES) and I will build the plan." (ES «¿Aceptas los términos y la liberación de responsabilidad? Responde ACEPTO (o SÍ) y armo el plan.»). No plan is built without a clear yes to message 1 and a clear acceptance of message 2. In every brand's pack (`agent/packs.mjs`), `AGENT_PLAYBOOK.md`, the build-plan skill and the agents' rule list in `agent/questions.mjs`.
