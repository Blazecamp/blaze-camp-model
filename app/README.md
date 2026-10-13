# Blaze Camp - Plan Builder (the public web tool)

A static, build-free page that turns a few taps into Coach Lalo's complete training plan, in English or Spanish. It runs the
engine (`engine/*.mjs`) and the compiled model (`model/*.json`) in the browser. Nothing is sent to a server and nothing about the
person is stored. The only thing the browser keeps is the language choice (`localStorage` key `bc.lang`, `sh.lang` on the Son
Hábitos site; R3-GEN-01).

One codebase, two brands: **Blaze Camp** (the default) and **Son Hábitos** (Nati Vera's brand, Spanish first). See "Brands" below.

Model by Coach Lalo (Gerardo Vera), Master NASM coach. Use at your own risk: see [DISCLAIMER.md](../DISCLAIMER.md) /
[DISCLAIMER.es.md](../DISCLAIMER.es.md).

## Screens

1. **Wizard**: 4 screens, each made to fit a phone (390×844) with little or no scrolling. Defaults are already chosen, tap
   targets are big, Back / Next sit at the bottom, and the EN | ES toggle is always in the top bar.
   1. *About you*: who the plan is for (me / a client), age and body weight (steppers, lb | kg), years training (chips).
   2. *Your goal*: six cards. A goal with details shrinks the cards and opens the details on the same screen:
      * Sport: a search over the 52 sports, then the position (and second choice) as a drop-down, and "Season and team
        practices" folded with its defaults (off-season, 0 practices).
      * Activity: a search over the 26 activities, league sport or style as a drop-down, play days, and the event date folded.
      * Build muscle: Focus muscles (at most 2). Lose fat / general fitness: gym sessions or bootcamp circuits.
      * Get stronger has no details and moves on by itself.
   3. *Your week*: days per week (2-6), the weekdays (the template's own, editable) and where you train (8 places, a compact
      grid). *Options* (closed): split (where the template has one), plan length (12 or 8 weeks), start date, tests and extra kit.
   4. *Safety check*: pain areas with mild / moderate / severe (optional), the 5 health questions with "None of these apply" or
      "Some apply" (yes / no each only then; a yes warns and does not stop the plan, R5-GEN-02), the coach's own-screening
      choice for a client, the guardian box for an athlete under 18, the release in a short scroll box, the required accept box
      (H20) and *Build my plan*.
   The screens group the same steps as before (`intake-builder.js > SCREENS / screenBlocker`), so every intake field and every
   check is unchanged.
2. **Building your 12-week plan...**: the plan is built in a module Web Worker (`worker.js`), so the page never freezes (a
   worker that fails falls back to the main thread). A calm moving bar (no percentage: the engine gives none), the step it is
   on, and a note when it takes longer.
3. **Plan**: the plan's name with the *Plan | Progress* tabs in one row. *New plan* (keeps the answers; the release must be
   accepted again) sits with *Save image* and *Download PDF* under the card (a small *Print* link under them on a desktop).
   * **Plan**:
     * ◀ Week n of N ▶ with the phase, plus a *Test week* badge and a *bigger step* badge (the engine's acceleration note).
     * Day tabs (optional, cardio, play and sport days are marked). *This week* (the engine's week notes, including "What
       changes this week") sits under the card on a phone and beside it on a wide screen.
     * The **day card**, compact enough for one screenshot: day, week and the average time (information only, CT-01), the
       title and a *Day tips* toggle (the full time sentence, blocks you can switch off, supersets, what is easiest to
       remove). Warm-up and cool-down are one line each ("Warm-up: 5 min any cardio + ..."), tap to open. The core block
       says it is optional.
     * One row per exercise, two short lines: the name, then "3 × 10-12 · 3 in the tank · 60-120 s" (the engine's dose and
       rest in short form, `plan-view.js > shortDose / shortMeta`), and badges (`+1 set`, `new`, `bonus`, superset letters).
       Tap a row to see the full name, the effort in full, the progression rule (R4-PRG-03), notes and cues, swaps with what
       they keep and lose (R4-LIB-04), the YouTube search, and the exact name with a Copy button (R4-LIB-05). A typical gym
       day card is under one phone screen; an athlete day with its athletic blocks is about 1.5 screens of page.
     * The release line sits in the card footer (plus the health warning when there is one).
     * Swipe left / right on phones, ← / → on desktop (Shift + ← / → changes the week).
     * *Save image* draws the card to a PNG with no outside library: SVG foreignObject to canvas.
     * *Download PDF* builds a real PDF file of the whole plan in the page's language (`pdf.js`, with the vendored jsPDF
       loaded only when the button is pressed): a cover page (the plan's name, who / goal, days, weeks, the plan at a glance
       with the start date, the health warning when there is one, the release, the credit line), then every week from a new
       page with each day as a compact table (exercise, sets x reps, effort and rest, block headings, "+1 set" badges; a day
       never splits across pages), the weekly sets per muscle group and the plan's own notes. Every page carries the
       release line (and the health line) and "Page n of N" in its footer. Text, not screenshots: 60-140 KB for a 12-week
       plan. File name: `Blaze-Camp-plan-<goal>-<start date>.pdf` (`Son-Habitos-plan-...` on the Son Hábitos site).
     * How the file reaches the person (`deliver.js`, both buttons). iPhone in-app browsers ignore `window.print()` and often
       `<a download>`, so on a phone or tablet: the share sheet (`navigator.share` with the file) straight from the tap; when
       the file took longer than about 1 s to make (the first PDF on a slow network), or the browser refuses the share, a
       small sheet opens with its own *Share* button (a fresh tap), and always the fallbacks: the image to press and hold, or
       *Open PDF* (the file in a new tab), plus *Download*. Without the share sheet at all, that sheet opens directly. On a
       desktop the file downloads (else it opens in a new tab), with a "PDF saved" toast. Nothing fails silently.
     * *Print* (desktop only, where `window.print` exists) still prints the whole plan from the print styles.
   * **Progress**:
     * The health warning, when there is one.
     * The weekly sets per muscle group as a heat strip: every week, the exercise-block breaks, the final sets and the effort
       of each week.
     * The plan at a glance.
     * The engine's own sections: *Before you start*, *How you progress*, the coach's *Basic Instruction*, *How to adjust
       this plan* and *Optional add-ons*.
     * The full release line.

## One box per thing to do

The coach (2026-10-13): "each exercise ... boxed, and then each set or superset ... boxed itself, so people understand this is the
segmentation of each one of the things I need to do today". On the day card (and in the print view, the PDF and the saved image):

* A straight exercise is one light box, numbered 1, 2 ... within its block. The block names (warm-up, core, strength ...) stay as
  headings above their boxes.
* Work done one after the other and then repeated is one box with a coloured rail (the brand colour) and a header in plain words;
  its exercises are lighter inner boxes A1 ↓ A2 ↓ A3, lettered A, B ... across the day:
  * **superset** (2), **triset** (3), **giant set** (4+) from the items' superset id: "A · SUPERSET do A1 → A2, rest 60-90 s,
    repeat ×3" (ES "SUPERSERIE haz A1 → A2, descansa 60-90 s, repite ×3"). The rest is said once, for the group, and taken off each
    row; different sets are said simply ("B2: 2 rounds only").
  * **circuit** (a bootcamp circuit block): "CIRCUIT do A1 → A2 → … → A7 in order, rest 90 s, 3 rounds · 35 s work · 15 s to
    change"; a station-by-station circuit says so.
  * **WOD** (the class): the WOD line, then its stations A1 → A2 → A3 (each with its ▶ search), worded by format (AMRAP "then
    again", EMOM "one each minute", for time "N rounds").
* Edits keep it right: a swap stays in its group; a superset left with one exercise is a straight exercise again.
* The PDF draws a light band in the brand colour for each group header and a rail beside its exercises.

`plan-view.js > groupCard` (in `dayCard`) and `groupHeader`; words `grp.*` in `i18n.js`; tested by `tests/app-groups.test.mjs`
and `tools/app-qa/groups.mjs` (screenshots `phone-<lang>-8-superset / 8b-circuit / 8c-wod`, both brands). Today's wizard plans hold
circuits and WODs; supersets appear when a plan has them switched on (the engine's `prefs.supersets_for_fatigue`).

## Editing

The plan is an editable template (COACH-CX CX-02 / CX-04: "it should be all editable as they need to"; R4-SES-04: the person picks
what to keep or take away). Everything happens on the day card, in a tap or two, phone first:

* **▶ beside every exercise** (no need to open the row): the YouTube search for that exercise's exact name (the item's own
  `video` link, R4-LIB-05: a search, never a third-party video), in a new tab or the YouTube app. Label "Watch videos of
  <name>" / "Ver videos de <name>"; a 44 px tap target that does not open or close the row. After a swap or an add it searches
  the new exercise. Left out of the saved image, the print and the PDF table.

* **Tap an exercise row.** Under it, before the details:
  * **Sets − n +**: one set less or more in the shown week *and every later week* that holds the same exercise in that line, each
    week from its own number (the stairway keeps its shape). Never under 1 set. Above the usual top for one exercise
    (`rules.placement.max_sets_per_exercise`) is allowed and shown as an info line.
  * **⇄ Swap**: the row's library swaps, each with its one line on what it keeps and what it loses (R4-LIB-04). A tap puts it in
    that line in every week that holds the same exercise: same sets, reps, effort, rest, block and position. The swap list then
    offers the original first, so a swap is easy to take back.
  * **✕ Remove**: the exercise leaves that day in every week that holds it. Allowed for any line, the core and the main lifts
    too (the person owns the plan); the day tips still name what is easiest to remove.
* **Block switch** on a block's header (the blocks the engine marks switchable: core, jumps / throws, power, accessories, joint
  care ...): **On / Off** for that day in every week. A block that is off stays on the card, dimmed, marked "(switched off)".
* **＋ Add exercise** under the card: the plan's own suggested add-ons, or a search over the exercise library (accents ignored).
  The list holds only exercises that fit the plan's equipment and age (60+: never the never-list, H12; under 18: youth-suitable),
  optional add-ons included (R4-LIB-01), never a proposed record or neck work, never a band, chain or releaser (H01), no medball
  in a physique plan (H11). Choose the block (default: the exercise's usual block) and the sets (default 3); it goes on that day
  in every week, with the dose the day already uses for that kind of exercise.
* **Edited**: once edited, the plan's name carries an *Edited* badge and a strip above the card has **↶ Undo last** and **Undo
  all** (back to the generated plan). The strip also lists, as short information, what the edits changed against the plan's own
  shape, e.g. "This week: Back: 12 sets (plan: 16) · also weeks 2-4" (`applyPlanEdits` conflicts that the generated plan did not
  already have). The edit is always made (CX-04).
* The week totals, the Progress tab, *Save image*, *Download PDF* (its cover says *Edited*) and *Print* all use the edited plan.
  The buttons never show in the saved image or the print.
* Edits live in page memory only: never stored, never sent (R3-GEN-01). *New plan* or closing the page drops them.

How: `edit-ui.js` (pure) turns a tap into engine edits; `main.js` sends them with the current plan to the worker
(`{type:'edit'}`, else the main thread), which runs `engine/edit.mjs > applyPlanEdits` (ops `set_sets`, `remove_exercise`,
`add_exercise`, `set_block`, and `swap_exercise`, added for this: engine/DECISIONS.md G-312). Each tap is one step in the
history; Undo pops a step. Generated plans are unchanged (the engine version is unchanged: edits are not generation).

Not built yet: the person's own exercise (COACH-CH6 CH6-02: a free name and one muscle question, labelled "your exercise: not
checked by Blaze Camp rules"). It needs an engine op that adds a line without a catalog record and its credit rules; it is left
for a separate change.

## How it maps to the engine

* `intake-builder.js > buildIntake(answers)` writes one `intake/2` object using exactly the engine's field names and values
  (`engine/intake.mjs validateIntake`).
  * Fields the wizard does not ask take the engine's defaults.
  * There is no sex, gender, sleep, stress, job or session-length field (H13, H16, CT-01).
  * The release version follows age and role: `release.minor` under 18, `release.coach` for a client, else `release.client`.
* The page runs `validateIntake` first, so field problems show at once with words from the model (`intake.error.*`). Then the
  worker runs `generate(intake, model)`.
* `plan-view.js` turns the plan into what the page shows. The words are the engine's own: the day card and the week notes are
  parsed from `engine/render.mjs` (`renderDay`, `renderWeek`, `renderPlan`). The plan JSON adds each row's exercise, sets,
  swaps, video link and last week's sets.
  * Switching EN / ES re-renders the same plan JSON. It does not build the plan again.
* Reviewer markers such as `[LEGAL REVIEW]` in the model's legal texts are hidden on the page; the sentences are shown as written.
  See "For the coach".

## Files

| File | What |
|---|---|
| `index.html`, `styles.css` | the page shell and its look (light and dark, phone first, print styles) |
| `main.js` | the page: wizard, build, plan view, save image, print, keys and swipe |
| `worker.js`, `model-loader.js` | the build off the main thread; fetching and loading `model/*.json` |
| `intake-builder.js`, `plan-view.js`, `md.js`, `i18n.js` | pure modules (no DOM), tested by `tests/app.test.mjs` |
| `edit-ui.js` | editing (pure): the engine edits a tap makes, the Add exercise library and search, undo history, info lines; tested by `tests/app-edit.test.mjs` |
| `snapshot.js` | *Save image*: the day card as a PNG |
| `pdf.js` | *Download PDF*: `pdfDoc` (the PDF's words, pure) and `drawPdf` (the layout, given jsPDF), tested by `tests/app-pdf.test.mjs` |
| `deliver.js` | hands the PDF / PNG over: share sheet, the fallback sheet, download; the toast |
| `prefill.js` | a prefilled link from an AI agent (`#a=<base64url answers>&l=es`, in the fragment so it never reaches a server): the page opens on its last screen with the answers filled in; never the acceptance, the guardian box or the health answers (`agent/README.md`) |
| `vendor/` | `jspdf.umd.min.js` (jsPDF 4.2.1 from npm, MIT, its license in `jspdf.LICENSE.txt`; only the source-map comment removed) |
| `brand.js`, `brand-apply.js`, `brands/` | the active brand (the build rewrites `brand.js`), what a brand changes (pure: words, language, disclaimer link), and the brands: `brands/blazecamp.js`, `brands/sonhabitos.js` + `brands/sonhabitos/` (stylesheet, logo, icons) |
| `screenshots/` | phone (390×844) and desktop (1280×800) screenshots, EN and ES: the 4 wizard screens, the building screen, day cards and the progress tab; `screenshots/sonhabitos/` the Son Hábitos site (phone, ES first) |

## Run it locally

```sh
node tools/build-site.mjs                 # builds site/ (the app at the root, engine/, model/, the disclaimers): Blaze Camp
node tools/build-site.mjs --brand sonhabitos --out /tmp/site-sh   # the Son Hábitos site (or: BRAND=sonhabitos node tools/build-site.mjs)
python3 -m http.server -d site 8766       # then open http://127.0.0.1:8766/
```

Any static server works. Module scripts need `.mjs` served as JavaScript (Python 3.10+ does this). The source folder also runs
unbuilt: serve the repo root and open `/app/`.

## Tests and checks

```sh
node --test tests/app-pdf.test.mjs        # the PDF from 3 sample plans (EN / ES): every week and day, accents, the release on
                                          # every page, page numbers, size; the iPhone / Android / desktop checks
node --test tests/app-brand.test.mjs      # both brands complete, Son Hábitos opens in Spanish, the legal party wording EN / ES,
                                          # both built sites (no other brand's name on the Son Hábitos site), a Son Hábitos PDF
node --test tests/app-edit.test.mjs tests/edit-swap.test.mjs   # editing: the edits each tap makes, the Add library (kit, age,
                                          # no proposed / neck / bands), info lines EN / ES, undo; the engine's swap_exercise (G-312)
node --test tests/app.test.mjs            # wizard answers -> valid intake/2 (700+ combinations, every sport and activity, pain,
                                          # health, coach mode, the release gate), UI words EN = ES, the view model, the build
node tools/check-model.mjs
```

The browser QA scripts live in `tools/app-qa/` (`qa.mjs`, `shots.mjs`, `extra.mjs`). Playwright is not a dependency of this
repository; install it in a scratch folder:

```sh
(cd /tmp/pw && npm init -y && npm install playwright && npx playwright install chromium)
export BC_PLAYWRIGHT=/tmp/pw/node_modules/playwright/index.mjs BC_QA_URL=http://127.0.0.1:8766/
node tools/app-qa/qa.mjs        # 8 samples + a health yes + a coach client, EN and ES, every day of every week:
                                # no console error, no raw key / undefined / NaN, the release line on every view
node tools/app-qa/shots.mjs     # screenshots into app/screenshots/
node tools/app-qa/extra.mjs     # save image, keys, print to PDF, under the production Content-Security-Policy
node tools/app-qa/pdf.mjs       # Download PDF and Save image on 3 plans (08 ES, 07 EN, 05 ES) under the production CSP: desktop
                                # download; iPhone with a mocked share sheet (also a slow network and a refused share); iPhone
                                # without it (the fallback sheet, Open PDF); each PDF checked (%PDF, pages, size, text with pypdf)
node tools/app-qa/edit.mjs      # editing at 390x844 under the production CSP, EN and ES: sets + / -, swap, remove, a block off and
                                # on, add from the search, Progress, PDF (says Edited, names the swap) and image, Undo last / all;
                                # screenshots phone-<lang>-7-edit / 7b-swap / 7c-add (BC_SHOTS_DIR=app/screenshots/sonhabitos/)
# the Son Hábitos build (served on its own port): the same qa.mjs, then
BC_PDF_PREFIX=Son-Habitos-plan BC_FORBID_NAMES=1 node tools/app-qa/pdf.mjs   # + no other brand's name in the PDF text
node tools/app-qa/brand-shots.mjs  # opens in Spanish, a saved choice wins; every screen checked for raw keys and other-brand
                                   # names; screenshots into app/screenshots/sonhabitos/
```

## Brands

One codebase, two sites, so every fix reaches both. A brand is one file, `app/brands/<id>.js`, with the same shape for every
brand (`tests/app-brand.test.mjs`): name, short name, default language (and whether the browser's language is followed), its
`localStorage` key, page title and description EN / ES, theme colour, icons, logo markup and an optional stylesheet, its assets
(`app/brands/<id>/`), the PDF's file prefix, author, logo and colours, the Save-image file prefix, its own app words EN / ES
(over `app/i18n.js`, which names no brand), display overrides of model words, and an optional `legal` block.

* **Blaze Camp** (`blazecamp`, the default): English first (Spanish when the browser is Spanish), the look of `styles.css`, the
  model's words and legal files exactly as they are. Its build is the same site as before brands.
* **Son Hábitos** (`sonhabitos`): Spanish first whatever the browser says (the EN | ES toggle stays; a saved choice wins), the
  sonhabitos.com look (`brands/sonhabitos/brand.css`: white, deep teal headings, bright teal accent, magenta pill buttons with a
  darker bottom edge, rounded cards; light and dark), its logo and a heart icon, credit "Son Hábitos · Nati Vera", and no
  Blaze Camp or Coach Lalo text anywhere. Its legal party wording (coach's decision, 2026-10-13): "Lalo Vera and BFit Studios
  Corp., doing business as Son Hábitos" / "Lalo Vera y BFit Studios Corp., que opera como Son Hábitos".

`tools/build-site.mjs` takes the brand from `--brand <id>`, else the env var `BRAND`, else `blazecamp`, and:
* writes `site/brand.js` (re-exports the brand), copies only that brand's file and assets, and fills `index.html`'s language,
  title, description, theme colour, icons, stylesheet and logo from it;
* for a brand with a `legal` block: applies the party wording (`tools/brand-legal.mjs`) to the site's copy of the model's words
  (`model/i18n/en.json`, `es.json`, `es_review.json`) and to `rules.legal.owner`; writes the brand's own disclaimer pages
  (`disclaimer.html`, `disclaimer.es.html`) from `DISCLAIMER.md` / `DISCLAIMER.es.md` with the same wording, instead of shipping
  the Markdown files and `LICENSE`; leaves out the one engine comment line that names Blaze Camp; and **fails the build** if
  any page, script, style or model file still names Blaze Camp, Gerardo or "Lalo" outside the legal party wording.
  The repository's `model/`, `engine/` and `DISCLAIMER*.md` are never changed. The plans are the same on both sites (a plan
  holds codes; its seed comes from the intake and the model version).
* The page (`main.js`) points the disclaimer link at the brand's own page next to it (`brand-apply.js > brandRaw`), and uses the
  brand's words for the title, the top bar, the welcome line, the building screen, the day card and print footers, the PDF
  (cover logo, colours, file name, properties) and the Save-image file name.

The exact wording substituted for Son Hábitos (`tools/brand-legal.mjs`), in this order:
1. Disclaimer owner line. EN "Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp., a Florida corporation (together,
   "Blaze Camp")" -> "Lalo Vera and BFit Studios Corp., a Florida corporation, doing business as Son Hábitos (together, "Son
   Hábitos")"; ES "... que opera comercialmente como Blaze Camp, y BFit Studios Corp., una corporación de Florida (en conjunto,
   "Blaze Camp")" -> "Lalo Vera y BFit Studios Corp., una corporación de Florida, que opera como Son Hábitos (en conjunto, "Son
   Hábitos")".
2. EN "Lalo Vera, Blaze Camp, BFit Studios Corp., and their" / ES "Lalo Vera, Blaze Camp, BFit Studios Corp. y a sus" -> the
   parties + ", and their" / ", y a sus".
3. EN "Blaze Camp's release" -> "The Son Hábitos release"; "Blaze Camp's total liability" -> "the total liability of Son Hábitos".
4. "Lalo Vera, Blaze Camp and BFit Studios Corp." (ES "... y ...") -> the parties, then "," when the sentence goes on and "."
   when it ends (the release texts, the release lines, the own-risk line).
5. Any other "Blaze Camp" -> "Son Hábitos" ("Son Hábitos keeps none of your answers", "Son Hábitos has not screened this
   client", "Your Son Hábitos plan" ...).
Plus one display word: the coach's Basic Instruction 5 ("ask me - IG @BLAZECAMP ...") becomes "If you have any questions, just
ask us." / "Si tienes alguna pregunta, solo pregúntanos."

## Deploy on Vercel

The project builds **only the tool**. `vercel.json` sets `buildCommand: node tools/build-site.mjs` and `outputDirectory: site`,
so the coach's sources, research, tests and samples are never served. There is no npm install and no dependency.

* New project: *New Project → Import Blazecamp/blaze-camp-model → Framework: Other → (the build command and output folder come
  from vercel.json) → Deploy*.
* Production branch: `main`. Any other branch gets a preview deployment.
* **The Son Hábitos site** is a second Vercel project on the same repository: *New Project → Import Blazecamp/blaze-camp-model
  → Project name (e.g. son-habitos) → Framework Preset: Other → Environment Variables: `BRAND` = `sonhabitos` (Production and
  Preview) → Deploy*. Production branch `main`. The build command and output folder come from `vercel.json` as for Blaze Camp.
  Optional: `SITE_URL` (e.g. `https://plan.sonhabitos.com`) gives the served `rules.json` its disclaimer address; the page sets
  the link from its own address anyway.
* `vercel.json` also sets these headers:
  * Cache: no cache for the app files; 10 min for `engine/` and 1 h for `model/`, both with stale-while-revalidate. The model
    files are fetched with `?v=<model version>`.
  * A strict Content-Security-Policy: only the site's own scripts and files; YouTube and GitHub are plain links. jsPDF is one
    of the site's own files (no CDN), and the PDF / image blob URLs need nothing more (`img-src` already allows `blob:`; the
    *Open PDF* tab is a navigation, checked in Chrome under this policy).

## For the coach (open decisions)

* **Build time.** Most plans build in 0.5-3 s in the browser. The physique plans (build muscle, 4-6 days) take 12-18 s on a
  laptop, and longer on a phone. The time is spent in the engine's set placement (`engine/volume.mjs`), not in the page. The
  page shows a progress screen; making the engine faster is separate engine work.
* **`[LEGAL REVIEW]` markers.** The model's release and health texts carry `[LEGAL REVIEW]` / `[REVISIÓN LEGAL]` markers (kept
  as reminders, CH6-03).
  * The page hides the bracketed marker and shows the sentence as written.
  * The release text's mock-up placeholders (`[ ] I accept ...`, `[Build my plan]`, "Guardian's name: [ ]") become a real
    checkbox and button.
  * The guardian box says: "I am the parent or legal guardian of this athlete (under 18), I read the release and I accept it
    for them." This wording is the app's own and needs the coach's OK.
* **Inputs left out to keep it short.** Level of play, game days, growth stage, lift style, equipment detail (medball
  weights, box height, running space, cardio machines), exclusions, cardio adjustment and the year / maintenance plan types.
  The engine uses its defaults. Each could be added as one optional chip row.
* **The disclaimer link** goes to the GitHub copy (`rules.legal.disclaimer_url`). The built site also ships `DISCLAIMER.md`.
  On the Son Hábitos site it goes to that site's own `disclaimer.html` / `disclaimer.es.html` (the same drafts with the Son
  Hábitos party wording; still pending the attorney's review).
* **Son Hábitos, for the coach and Nati:**
  * The credit line is "Son Hábitos · Nati Vera" (it does not say who wrote the model, per the coach's decision); the welcome
    line, eyebrow and building screen words are the app's own (`app/brands/sonhabitos.js > words`).
  * The coach's Basic Instruction 5 named his Instagram; on Son Hábitos it says "ask us" with no handle. Nati's handle can be
    added there.
  * The Son Hábitos build does not ship `LICENSE` (it names Blaze Camp). The owner may want a Son Hábitos copyright line instead.
  * "Programa exclusivo para mujeres" is not printed: the plan builder has no sex field (H13) and its plans are not
    women-specific; it can go in as an eyebrow if Nati wants it.
