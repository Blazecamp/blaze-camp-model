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
