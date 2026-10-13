# Blaze Camp - Plan Builder (the public web tool)

A static, build-free page that turns a few taps into Coach Lalo's complete training plan, in English or Spanish. It runs the
engine (`engine/*.mjs`) and the compiled model (`model/*.json`) in the browser. Nothing is sent to a server and nothing about the
person is stored. The only thing the browser keeps is the language choice (`localStorage` key `bc.lang`; R3-GEN-01).

Model by Coach Lalo (Gerardo Vera), Master NASM coach. Use at your own risk: see [DISCLAIMER.md](../DISCLAIMER.md) /
[DISCLAIMER.es.md](../DISCLAIMER.es.md).

## Screens

1. **Wizard**: one screen per step, big tap targets, defaults already chosen, Back / Next, a progress bar. The EN | ES toggle is always in
   the top bar.
   1. *About you*: who the plan is for (me / a client), age and body weight (steppers, lb | kg), years training (chips).
   2. *Goal*: six cards (build muscle, get stronger, lose fat, general fitness, sport athlete, stay active).
   3. *Goal details*, only when needed:
      * Sport: a searchable list of the 52 sports, position, second choice, season (with a date) and team practices.
      * Activity: a searchable list of the 26 activities, league sport or style, play days, and an optional event date.
      * Build muscle: Focus muscles (at most 2).
      * Lose fat / general fitness: gym sessions or bootcamp circuits.
   4. *Your week*: days per week (2-6), with the template's weekdays filled in and editable. Also the plan length (12 or 8
      weeks), the start date, the split (full body / push-pull-legs / upper-lower, where the template has one) and optional tests.
   5. *Where you train*: the 8 equipment profiles, plus optional extra kit.
   6. *Health and pain*: pain areas with mild / moderate / severe, and the 5 health questions ("None of these apply" or "Some
      apply" with yes / no each). A yes warns and does not stop the plan (R5-GEN-02). A coach can skip the check for a client
      with the warning.
   7. *Last step*: a summary and the release text. The required box must be ticked (H20); a minor also needs the parent or
      guardian box. Then *Build my plan*.
2. **Building your plan...**: the plan is built in a module Web Worker (`worker.js`), so the page never freezes. Rotating
   messages are shown, plus a note when it takes longer.
3. **Plan**: a one-line summary, *New plan* (keeps the answers; the release must be accepted again), and two tabs.
   * **Plan**:
     * ◀ Week n of N ▶ with the phase, plus a *Test week* badge and a *bigger step* badge (the engine's acceleration note).
     * Day tabs (optional, cardio, play and sport days are marked) and *This week*, the engine's week notes including
       "What changes this week".
     * The **day card**: title, the average time (information only, CT-01), *Day tips* (blocks you can switch off,
       supersets, what is easiest to remove), then each block. The core block says it is optional.
     * One compact row per exercise: name, sets × reps, reps in the tank, rest, and badges (`+1 set`, `new`, `bonus`,
       superset letters). Tap a row to see the effort in full, the progression rule (R4-PRG-03), notes and cues, swaps with
       what they keep and lose (R4-LIB-04), the YouTube search, and the exact name with a Copy button (R4-LIB-05).
     * The release line sits in the card footer (plus the health warning when there is one).
     * Swipe left / right on phones, ← / → on desktop (Shift + ← / → changes the week).
     * *Save image* draws the card to a PNG with no outside library: SVG foreignObject to canvas. On phones it opens the
       share sheet, on desktop it downloads.
     * *Print / PDF* prints the whole plan: a summary page, then one week per page, with no day split across pages.
   * **Progress**:
     * The health warning, when there is one.
     * The weekly sets per muscle group as a heat strip: every week, the exercise-block breaks, the final sets and the effort
       of each week.
     * The plan at a glance.
     * The engine's own sections: *Before you start*, *How you progress*, the coach's *Basic Instruction*, *How to adjust
       this plan* and *Optional add-ons*.
     * The full release line.

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
| `snapshot.js` | *Save image* |
| `screenshots/` | phone (390×844) and desktop (1280×800) screenshots, EN and ES, of every step, a day card and the progress tab |

## Run it locally

```sh
node tools/build-site.mjs                 # builds site/ (the app at the root, engine/, model/, the disclaimers)
python3 -m http.server -d site 8766       # then open http://127.0.0.1:8766/
```

Any static server works. Module scripts need `.mjs` served as JavaScript (Python 3.10+ does this). The source folder also runs
unbuilt: serve the repo root and open `/app/`.

## Tests and checks

```sh
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
```

## Deploy on Vercel

The project builds **only the tool**. `vercel.json` sets `buildCommand: node tools/build-site.mjs` and `outputDirectory: site`,
so the coach's sources, research, tests and samples are never served. There is no npm install and no dependency.

* New project: *New Project → Import Blazecamp/blaze-camp-model → Framework: Other → (the build command and output folder come
  from vercel.json) → Deploy*.
* Production branch: `main`. Any other branch gets a preview deployment.
* `vercel.json` also sets these headers:
  * Cache: no cache for the app files; 10 min for `engine/` and 1 h for `model/`, both with stale-while-revalidate. The model
    files are fetched with `?v=<model version>`.
  * A strict Content-Security-Policy: only the site's own scripts and files; YouTube and GitHub are plain links.

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
