# Blaze Camp plan generator: engine (Phase 0)

A person fills in the intake (goal, sport or activity, days, equipment, pain, experience - no session length, v0.5). The engine turns it into a
training plan written the way the Blaze Camp coach programs: his own day templates with his exercise counts, a 12-week (or 8-week)
"stairway" of whole weekly sets per muscle group that reaches its final sets in the last week, two spine days, power before strength, core first, effort by reps in reserve, tests only at
the start and the end, and every word in English or Spanish.

* **Rules, numbers and words** come from the compiled model in `model/` (built from the coach's answers and the synthesis docs).
* **Code** is plain ES modules in `engine/`, Node 22, no npm dependencies, no build step. Engine files import only other engine
  files, so they run unchanged in a browser.
* **Deterministic**: the same intake and model give a byte-identical plan (seeded tie-breaks; no clock, no random, no `Intl`).
* **Explainable**: every non-trivial decision carries a machine-readable `why` (`{key, ref, args}`), where `ref` is the coach answer,
  round-2 id, rule or decision id behind it.

Binding documents: `engine/CONTRACTS.md` (shapes, names, signatures; contracts/1.1.1 + the engine 0.4.0 amendment boxes of stages
B1 … B4 + the engine 0.5.0 boxes V1 … V4 and fix rounds 1 and 2, which win over everything under them), `engine/DECISIONS.md` (every gap or
conflict decided once: C-01 … C-19, D-01 … D-81, round 3 E-01 … E-205, engine 0.5.0 G-01 … G-96), `engine/BUILD_PLAN.md`
(who built what, engine 0.2 to 0.4: history). Authority for coaching rules: `coach_answers_round4.md` and
`coach_answers_time_2026-10-10.md` (CT-01) > `coach_answers_codex_2026-10-10.md` (CX-01..04) > `coach_answers_round3.md` >
`coach_answers_round2.md` > `coach_answers_full.md` > `coach_chat_statements.md` / `coach_answers.md` > OBSERVED sheet facts >
`generator_spec_v1.json` / `synthesis/` (INFERRED / SCIENCE / PROPOSED).

**Engine 0.5.0, work package V1 "structure and volume" (2026-10-11; DECISIONS section G, the CONTRACTS 0.5.0 amendment box).**
* **No time fitting** (CT-01, R4-SES-01): there is no session length, no time check, nothing is cut, moved or offered because of minutes.
  `est_minutes` on a day is an estimate, shown as information. `engine/timefit.mjs` is deleted.
* **Template first** (R4-SES-02, R4-SES-05): a session is sized by its exercise count (general 5-7, aesthetics 6-8, strength 5-6,
  bootcamp 5-7 stations, field athletes up to 12, older adults 5-6; the warm-up and the 2 core exercises are outside the count) and the
  full-body days follow the coach's A / B skeleton (A: row, squat, pulldown, lunge, biceps, quad isolation, calves; B: press, hinge,
  vertical or incline press, single-leg hinge, triceps, leg curl, side delt), his 3-day builder and his push / pull / legs.
* **2 training days** (R4-SES-03): every big group at about 6-8 weekly sets, the plan says so and suggests a third day. The floor of 10
  applies from 3 training days.
* **The stairway** (CX-01, R4-PRG-01 / 02 / 04): one whole-set schedule per muscle group, fitted to reach the final sets in the last week
  (faster steps than 3 % / 5 % are allowed; a week above about 15 % carries a note); the next block starts about 5 % higher.
* **Allocation**: sets go to the group's exercises 2-5 at a time (2-4 at L1), first exercise first, exposures alternating; a group its
  template cannot take to the target gets a bonus exercise on an optional day, else it is capped - and the plan says so. **Nothing is
  dropped automatically** (R4-SES-04): what a template cannot hold is named (`warning.capped_by_template`, `below_floor_template`,
  `credit_only_groups`), and each day lists what is easiest to remove if the person wants a shorter session.
* **Edits** (CX-02 / CX-04): `engine/edit.mjs applyPlanEdits` - sets per day or week, add / remove an exercise, a block on / off; totals
  are recomputed and the plan is marked `edited`.
* Not in this package: integration and the benchmark run (V4).

**Engine 0.5.0, work package V2 "library and selection" (2026-10-11; DECISIONS G-25 ... G-36, the CONTRACTS V2 amendment box).**
Model layer: `tools/fixture/v05-library.mjs`; engine: `engine/library.mjs`.
* **Optional add-ons** (R4-LIB-01): the exercises the library marked proposed are optional (`status: optional_addon`). A template
  never picks one; a plan lists them as swaps and offers the ones that fit the client in `plan.meta.addons` ("Optional add-ons" on
  the page); the person adds one with an edit. Only wall balls and sled pushes may be picked - in a HYROX station circuit and in the
  CrossFit-style class WOD. Neck work stays proposed and is never shown. Joint care takes the code's own live exercise.
* **Carries and sled work** (R4-LIB-02): 2-4 trips of 20-40 m or 20-40 s, never reps; no muscle-set credit; with core / conditioning.
* **Mid-range pull** (R4-LIB-03): its own category (high row, 45-degree row, the face-pull angle), listed as a swap of rows and
  pulldowns. **Incline first**: bodybuilding and general-population plans lead the vertical / mid-range push slot with an incline
  press; overhead pressing stays in the swaps.
* **Swaps say what they keep and lose** (R4-LIB-04): `item.swap_notes`; a pick that stands in for missing equipment says what it
  replaces (`item.instead_of`, `note.instead_of`).
* **Video** (R4-LIB-05): no third-party link anywhere in `model/` or the library source; every exercise carries a YouTube search link
  built from its English name and the plan prints that exact name to copy.
* **Sport profile confidence** (R4-SCP-03): `confirmed_by_coach` / `similar_sport` / `proposed` on every profile (data and docs only).
* **Selection** (coach-eye findings not about time): the lead chest press is two-arm and never a floor press while a bench or
  machine press is in the kit; no two versions of one exercise in a session; a hip day's second hinge is a single-leg hip extension;
  a movement family keeps its week cap; route drills stay with football; a block change names its detail.
* Four tests stay `todo` (the athletic dose layer, G-36).

**Engine 0.5.0, work package V3 "words and checks" (2026-10-11; DECISIONS G-37 ... G-50, the CONTRACTS V3 amendment box).**
Model layer: `tools/fixture/v05-words.mjs`.
* **The liability gate** (R4-SCP-02): no plan is generated until the terms and the release are accepted (`release.accepted: true`;
  the check runs first). **The release line** (R4-SCP-01 / R4-SCP-02) is printed on top and at the bottom of every plan and on every
  view, in English and Spanish, with the link to `DISCLAIMER.md` / `DISCLAIMER.es.md` (drafts for attorney review).
* **Progression is a rule the person applies** (R4-PRG-03): every lift prints "Progress: when you hit 12 on every set with N left in
  the tank, add weight next time and start again at 8"; "How you progress" explains it with an example from the plan. No number is
  promised for a week. **A week that adds more than about 15 %** is marked and said (R4-PRG-02).
* **Time is information** (CT-01, R4-SES-01): a day prints an average range ("about 80-95 min, an estimate, for information only").
  **Nothing is removed for the person** (R4-SES-04): a day names what is easiest to remove.
* **Tables and macro views** (R2-GEN-02): the weekly sets per muscle group for every week; `macro: true` gives the week and the day
  as compact tables for a screenshot; the block view was already one.
* **The v0.5 check list**: V21 liability gate, V30 template skeleton and nothing dropped, V31 optional add-ons, V32 incline first
  (warn), V33 no third-party video links, V34 the progression rule, V35 the acceleration note, V36 the easy-to-remove list, V37
  carries by distance or time; `rules.validation.v05.by_rule` maps each v0.5 rule to its checks. No check reads minutes.
* **Benchmark scorer 2.0** (`design/bench/`): no minutes-based metric; one metric per v0.5 rule; `node design/bench/run.mjs` writes
  `results_v05.json` + `V05.md`; `node design/bench/selftest.mjs` checks the scorer itself.
* **Spanish**: the plan-facing lines were reviewed for neutral Latin American wording (41 lines changed); exercise names and cues
  still wait for the coach.

**Engine 0.5.0, work package V4 "integrate" (2026-10-11; DECISIONS G-51 ... G-57, the CONTRACTS V4 amendment box).**
Model layer: `tools/fixture/v05-integrate.mjs`. Status and numbers: `samples/STATUS_v0.5.md`.
* **The coach's days come out slot for slot** (R4-SES-05; checked against `dumps/BYOP`): on a gym A / B / C day and a push / pull /
  legs day a two-leg slot holds a two-leg lift and a single-leg slot a single-leg lift in every exercise block, the A day's first
  row is a two-arm row, push / pull / legs prints in the order of his sheet and its two triceps slots pick their kind. The laterality
  dial (UNI-02 / UNI-03) still works on the athletic days and on the slots the skeleton leaves open. V30 holds it.
* **A Focus slot never pushes a group over its final sets** (R4-PRG-04, ORD-11): surplus optional-day Focus slots close and the
  group climbs on its main-day lifts (`meta.stairway[].focus_closed`).
* **Order and warm-up**: the athletic block always runs sprint, jump, ankle, throw, cuts (the jump + throw pair no longer reorders
  it); every main day opens with a warm-up (ORD-08).
* **Older adults and "no floor work"**: handstand work is never a 60+ pick; the exclusion covers the lifts done on the floor and
  leaves the hands-elevated push-up.
* **The block view** lists a day's rows in session order.
* **Benchmark scorer 2.1**: reads four rules the way the engine applies them on purpose (MYO exclusions, the end-test week's
  athletic dose, low-amplitude hops in stage 1, the share on the stations the dial may move) and adds the skeleton's laterality.
  Run of 2026-10-11: 102 plans, 26 hard violations in 5 plans (673 in 55 before V4), every v0.5 row (A2-A10) passes.

**Engine 0.5.0, fix round 2 (2026-10-11; DECISIONS G-76 ... G-96, the CONTRACTS fix-round-2 amendment box).**
Model layer: `tools/fixture/v05-fix2.mjs`. Source: the second coach-eye review of the 8 samples. Status and numbers:
`samples/STATUS_v0.5.md` ("Fix round 2").
* **Core**: a core slot takes a live-library exercise, never a carry; a low-back client repeats a plank two or more days apart
  before a crunch or a leg raise takes the slot; the opener is light in every week.
* **Presses**: a swimmer presses with dumbbells or a machine and takes the incline press in slot 3; a 3-day athletic week holds a
  third chest lift; a cutting sport may take the alternating incline press.
* **Athletic work**: no loaded jump opens a plan or outweighs 20 % of body weight; the sprint buy-out is 1 x 20, 2 x 15, 3 x 10
  calories; the session after lifting is the easy one.
* **Volume**: the back keeps its sport-scaled final sets (a press may lead the pulls by one set); the first exercise takes the
  set first and a compound lift reaches 3 sets before an isolation exercise takes more; the printed schedule is the one the plan
  runs; a block that ends with a strength-test week arrives the week before and holds.
* **Class and bootcamp**: class days name a skeleton (`class_*`), the lunge runs with the pulls, V30 holds the knee + pull and
  hip + push partners; bootcamp stations follow the kit in his slot order, the timer climbs 35 -> 50 s in 5-s steps and the last
  two weeks run one more round.
* **Pain**: the pain line is said up front and "chosen to protect" only under a lift the pain changed.

**Engine 0.5.0, fix round 1 (2026-10-11; DECISIONS G-58 ... G-75, the CONTRACTS fix-round-1 amendment box).**
Model layer: `tools/fixture/v05-fix1.mjs`. Source: the coach-eye reviews of the 8 samples. Status and numbers: `samples/STATUS_v0.5.md`.
* **The athletic A / B / C days come out slot for slot too** (R4-SES-05): a two-leg lift in slot 2 on every day (a squat day and a
  leg-press day; a deadlift day and a hip-extension day), a two-arm first row. This replaces "the laterality dial still works on
  the athletic days" above.
* **Chest / Shoulders** (slot 3): one 30-45 degree incline press a week counts for chest; a high-incline press counts 1 front delts
  and half a set chest (class `MRPUSH`, PROPOSED).
* **Tests**: the tested lift opens the day's lifts and the test replaces its top set (R2-PER-07).
* **Volume**: the floor of 10 is read on the training days; pulling never falls under pressing for a sport that asks for it;
  isolation exercises hold 3 sets (4 in the hardest weeks), then the bonus exercise (2-4) and one extra small exercise; a Focus
  muscle's own lifts take the steps; calves climb on the leg days when no optional day carries them; the steps are shared between
  the weeks (`engine/progression/stairway.mjs`: `stairwayProgress`, `staggerStairways`).
* **Class and bootcamp**: the class lifts hold his sets, the press is the strict press, the WODs grow by rounds and hold a pulling
  station; each bootcamp session keeps his five slots in one circuit.
* **Athletic layer**: a 2- or 3-day week asks for three quarters of a 4-day profile's numbers (PROPOSED); the pre-season keeps the
  off-season work; heavy play weeks hold one jump station a day and a throw; the low box for 50+ court players and painful knees.
* **Joint care** lives in the template's own lift (flag `joint_care`); the MYO set never lands on a pain muscle.
* **Selection**: machines keep the leg-extension and leg-curl slots, "Tricep - Overhead" is an overhead extension, a lift keeps
  its credit class at a block change, every lift lists a swap, the dials weigh a station by the plan's sets.
* **Benchmark scorer 2.2**. Run of 2026-10-11: 102 plans, mean 97.49 (95.59 before the round), lowest 88.57 (86.71), 5 hard
  violations in 3 plans (26 in 5), no plan scores lower.

The paragraphs below describe engine 0.4.0; where they speak of minutes, the time check or offers, the 0.5.0 box above replaces them.

**What the plan is (round 3).** The plan is built **once**, with its whole stairway visible ahead of time - no check-ins, no tracking,
nothing adapts and no user data is kept (R3-VOL-02, R3-VOL-04, R3-GEN-01). People and coaches adjust it themselves: every block has a
stable id and says whether it can be switched off (athletic, core, joint care, cardio ...), exercises can be added or removed, and each
day lists the supersets that save time (R3-SES-02). *(Engine 0.4.0 only, retired in 0.5.0 by CT-01 and R4-SES-01 / 03 / 04: "when the
chosen days x minutes cannot hold the full plan, the plan says so up front, offers one more day or longer sessions in numbers, trains
fewer groups directly (big movers first) and every trained group still climbs". Engine 0.5.0 has no session length, no time check and
no offers; a plan comes out complete and the person removes what they want.)*
Every plan opens with the use-at-your-own-risk line and the release link (DISCLAIMER.md / DISCLAIMER.es.md, drafts for attorney review).

## 1. How to run

All commands from the code root (`blaze-camp-model/`), Node 22:

```sh
node tools/compile-model.mjs            # sources (synthesis/, spec, coach answers) -> model/*.json   (exit 1 on a contract error)
node tools/check-model.mjs              # contract checks on model/: shapes, bands, credits, i18n coverage, rules == fixture rules
node --test tests/                      # the whole suite (also: `node --test`)        -> 1,407 tests, 0 fail (4 todo, 2 skipped)
node tools/generate-samples.mjs         # the 8 sample plans -> samples/plans/<name>.json + <name>.<lang>.md (+ .en.md for ES)
node tools/sweep.mjs 1500 --render      # 1,500 random + 52 sports + 26 activities on the fixture and model/ (about 4 min)
node design/bench/selftest.mjs          # does the benchmark scorer see what it claims to see? (51 checks)
node design/bench/run.mjs               # the 94 benchmark intakes + the 8 samples -> design/bench/results_v05.json + V05.md
```

From clean (what stage B4 ran): `node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs && node tools/compile-model.mjs
&& node tools/check-model.mjs && node --test tests/ && node tools/generate-samples.mjs && node tools/sweep.mjs 1500 --render`. The
sweep prints, per model, the plans ok, throws, failing error / warn checks, main days above the session size range, plans that train
no group directly and render problems; it exits 1 on any failing error check (v0.5 after fix round 2, 2026-10-11: 1,578 of 1,578
plans ok on both models, 0 throws, 0 failing error checks, 0 render problems; warn checks only - V28 on 92 / 91 plans, V29 on
173 / 174, V29 now reading the balance rule's own press and pull classes; the run takes about 20 minutes since a block is planned
up to three times. After fix round 1: 1,578 of 1,578 plans
ok on both models, 0 throws, 0 failing error checks, 0 render problems; warn checks only - V28 on 76 / 75 plans, V29 on 221 / 220;
after V4 it was V28 on 164, V29 on 505, V32 on 3 / 1).

Useful variants:

```sh
node --test tests/volume.test.mjs                       # one module's tests
node tools/generate-samples.mjs --only 08               # one sample (file-name prefix)
node tools/generate-samples.mjs --fixture --out /tmp/p  # the same plans from the reference fixture model
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs   # rebuild + check engine/fixtures/mini-model.json
```

`generate-samples` prints one line per sample (template, program, training blocks, total sets week 1 -> last, failing checks,
warnings) and exits 1 if any plan is not `ok` or fails an `error` check.

Using the engine from code:

```js
import fs from 'node:fs';
import { loadModel } from './engine/model.mjs';
import { generate } from './engine/generate.mjs';
import { renderPlan } from './engine/render.mjs';

const dir = 'model';
const read = (f) => JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
const model = loadModel({ manifest: read('manifest.json'), catalog: read('catalog.json'), rules: read('rules.json'),
  templates: read('templates.json'), profiles: read('profiles.json'),
  i18n: { en: read('i18n/en.json'), es: read('i18n/es.json'), es_review: read('i18n/es_review.json') } });
const plan = generate(JSON.parse(fs.readFileSync('samples/intakes/08-pickleball-genpop.json', 'utf8')), model);
console.log(plan.status, plan.validation.ok);
console.log(renderPlan(plan, model, { lang: 'en', view: 'full' }));   // views: full | overview | block | week | day; format: markdown | text
                                                              // week / day + macro: true = the compact tables (v0.5 / V3)
```

(`tests/helpers/models.mjs > loadCompiledModel()` does the same read; `tools/generate-samples.mjs` too.)

## 2. Layout

```
model/          compiled runtime data (never hand-edited): manifest, catalog (733 exercises: 731 source records + 2 mid-range pull records), rules, templates (30, 1,682 stations),
                profiles (127 + 52-sport picker + 26 activities), i18n/en.json, es.json (2,697 keys each), es_review.json,
                MODEL_VERSION (1.3.0: round 3 - amendment layers tools/fixture/round3.mjs, athletic-b2.mjs, render-b3.mjs,
                integrate-b4.mjs on top of review-v12.mjs), CHANGELOG.md (coach corrections applied), COMPILE_REPORT.json
engine/         the generator (pure functions) + CONTRACTS / DECISIONS / BUILD_PLAN / CONTRACT_REQUESTS
  fixtures/mini-model.json   the architect's reference compile (shape reference for tests)
tools/          CLIs (the only place with file I/O): compile-model.mjs + compile/*.mjs, check-model.mjs, generate-samples.mjs,
                sweep.mjs (the random-intake sweep), fixture/*.mjs (reference fixture builder + the amendment layers;
                fixture/upgrade-plan-min.mjs keeps tests/fixtures/plan-min.json at the current plan/2 item shape)
tests/          node:test suites; helpers/ (models, random intakes, stubs); invariants/; run-all.mjs + package.json (runner entry)
samples/        intakes/ (the coach's 7 sample clients + the pickleball bonus), plans/ (generated), SAMPLES.md (what the engine decided),
                STATUS_v0.5.md (engine 0.5.0: what changed, test counts, benchmark numbers, known gaps),
                REVIEW_LOG.md (every review issue and its fix, per stage), RECHECK_v0.3.md (the coach-eye re-check of the v0.3 plans)
design/bench/   the 94 benchmark intakes, the scorer (score.mjs, 2.3), the runner (run.mjs), selftest.mjs; results_v05.json + V05.md
                (engine 0.5.0), results_baseline.json + BASELINE.md (engine 0.4, scorer 1.0: history only)
synthesis/ analysis/ dumps/ raw/ answers_raw*/   read-only sources
```

## 3. Module map

| File | Exports | What it does |
|---|---|---|
| `util.mjs` | `canonicalJSON`, `hash53`, `makeSeed`, `tieBreak`, `roundHalfUp`, `round2`, `why`, date helpers, `forbiddenKeys`, typedefs | shared helpers and the §4.0 JSDoc typedefs; `forbiddenKeys` finds sleep / stress / job / sex keys anywhere |
| `model.mjs` | `loadModel`, `assertModel` | wraps the model JSON in read-only accessors (`ex`, `bySlot`, `credits`, `kitAvailable`, `stair(N)`, `templateFor`, `sport`, `groupOf`, `t(lang, key, args)`, `has`); `assertModel` checks every §3 shape and the coach's data rules (no bands, credit maps, KB swing 0, thruster 1 / 0.5 / 0.25, medball ≤ 20 lb, 60+ never-list, ES coverage) |
| `intake.mjs` | `validateIntake`, `safetyScreen`, `checkRelease`, `sessionSize`, `deriveValues` | intake/2 validation (no sleep / stress / job / sex fields, release required; v0.5: no session length - a sent `schedule.session_minutes` is ignored with `warning.session_minutes_retired`), health screen (coach bypass), the session's exercise-count range by client type (`sessionSize`, R4-SES-02), derived values D1-D14: family, profile, level L1-L3, season, plan shape, template, constraint band, kit, targets (via volume), bilateral share, athletic budget, planned step, tests, aerobic count |
| `shape.mjs` | `buildShape`, `planTrainingBlocks` | training blocks (stairway / pre-season / taper / in-season / maintenance / recovery), exercise blocks, per-week stair level 2 -> 11, phase, planned RIR, rep phase, Receive-Create stage, test weeks, circuit dose |
| `volume.mjs` | `computeTargets`, `stairwayPlan`, `stairwayFrom`, `planWeeklySets`, `weeklyCredits`, `calvesFloor`, `plannedGrowth` | the volume engine on lines and FOCUS groups: starts / final sets / floor 10 from 3 training days (about 6-8 for big groups on 2 days, R4-SES-03) / Focus +2 / pain. **v0.5:** one whole-set schedule per group that reaches its planned final sets in the last week (`progression/stairway.mjs`; faster steps than 3 % / 5 % allowed, a note above about 15 %; CX-01, R4-PRG-01 / 02), allocated to the template's slots in the coach's order (VOL-07), then the bonus exercise and the Focus slots; what a template cannot hold is named (`capped_by_template`, `below_floor_template`), never dropped. *(v0.4, retired in 0.5.0: the time check of R3-SES-02 with its offers, room cuts and "fewer groups trained directly", `plan.time_check`, the "< 10 % weekly total rise" limit, circuits and flat blocks fitted to the minutes.)* v0.4 B4: the class model's work lifts stay (`class_lift`, E-64), a lone station leaves its day (E-69), `added_fills` (E-70) |
| `athletic.mjs` | `stagesForStairway`, `athleticBudget`, `planAthletic`, `splitContacts`, `athleticKeyOf`, `cueKeyFor`, `responseOf`, `perSetBounds`, `sprintMetres`, `circuitBallistic`, `plannedAthletic`, `plannedShare`, `ensureAthleticStations`, `pairAthleticBlock`, `isFloorJump`, `olympicAboveCeiling`, `olympicVariantByDay` | v0.4 stage B2: Receive-Create stages per exercise block (no jump exercise changes mid-block), how a drill is done and cued (landing / single / repeat), the weekly athletic targets (the 04 volume split by the coach's plyo share), **the athletic stairway** (doses land on the targets, scaled to what the block's stations hold, climbing week by week, the end-test week holding), circuit ballistic stations (R2-ATH-01/02/03, R3-ATH-01..05, E-26 ... E-45). Fix round 1 / F2: the plyo share held per week, the tracks' stations sized from the block's peak targets (ballistic jumps, a second sprint / max velocity, a second throw, the ankle block outside the jump / throw split and the 12 + 2 count), stage cues of a ballistic jump, the jump + throw contrast pair, the sport's Olympic ceiling (E-97 ... E-109). Fix round 2 / F2: jumps and ankle work as two never-drop families, one scale down the training block, even steps, one more set where the day has the minutes (`opts.rooms`), a bone-loading sport's second ankle day in the warm-up window, the share's block-end clamp, the pre-season hold, a timed test in its station's place and the baseline dose on the tested days of the end-test week, no Olympic work in the class's end-test week, the Olympic lift by the day's lift (E-160 ... E-177) |
| `budget.mjs` | `olympicSetsPerExposure`, `olympicSetsForIndex`, `blockProgress`, `stayActiveOlympic`, `warmupMode`, … | Olympic sets per exposure (v0.4 B2: climbing one set at a time on the earliest exposures; B4: 2 x 3 once a week in a game-heavy in-season block, E-66), warm-up prep by profile (60+: balance) |
| `lines.mjs` | `linesOf`, `lineCredits`, `groupCredits`, `primeLines` | v0.5: the muscle lines and FOCUS groups (R3-VOL-01, R3-SES-01); a set counts at most 1.0 to a group |
| `estimate.mjs` | `timeClassOf`, `restClassOf`, `setCost`, `supersetMinutes`, `testMinutes` | v0.5: the day's minutes as an ESTIMATE (information only, CT-01); nothing reads it to cut or reshape |
| `library.mjs` | `NEVER_PICK_STATUS`, `NOT_SHOWN_STATUS`, `neverPick`, `notShown`, `isAddon`, `addonPrimaryOk`, `isCarry`, `carryReps`, `implementOf`, `swapNote`, `swapNotes`, `videoOf` | v0.5 / V2: the library rules shared by select, week, dose, generate, edit and render - optional add-ons and the two approved primaries (R4-LIB-01), carries by distance or time (R4-LIB-02), what a swap keeps and loses (R4-LIB-04), the search link and the name to copy (R4-LIB-05) |
| `progression/stairway.mjs` | `solveEndpointCurve`, `arrivalSchedule`, `accelerationReport`, `planStairway`, `stairwayProgress`, `staggerStairways` | v0.5: the whole-set stairway that reaches the final target (CX-01, R4-PRG-01 / 02); fix round 1: one curve per group and the week's steps shared between the groups (R3-VOL-04) |
| `progression/prescription.mjs` | `nextBlockStart`, `planProgression`, `progressionRule`, `evaluatePrescription`, `applySetEdits` | v0.5: next-block start (R4-PRG-04), double progression as a rule the person applies (CX-02), set edits |
| `edit.mjs` | `applyPlanEdits` | v0.5: plan edits with recomputed totals and the `edited` flag (CX-04) |
| ~~`timefit.mjs`~~ (deleted in 0.5.0) | `linesOf`, `lineCredits`, `groupCredits`, `primeLines`, `setCost`, `supersetMinutes`, `testMinutes`, `timeClassOf`, `restClassOf` | v0.4: lines and FOCUS groups (R3-VOL-01, R3-SES-01; a set counts at most 1.0 to a group) and the v1.3 time model (work + rest by rest class, supersets share the rest, test work-ups), shared by volume, week and validate |
| `week.mjs` | `buildWeekLayout`, `layoutForWeek`, `estimateMinutes`, … | template -> weekdays (optional days skip play days), stations -> slots, block order (core first, power before strength, H before V), pairing, supersets, 2-4 per group on split days (1-4 on his A / B days, R4-SES-05), the day's exercise count (`keepStation`; v0.5: no minute caps and no cut order - nothing is dropped automatically, R4-SES-04), prehab (B4: every injury code one session before any second, E-75), warm-up, aerobic placement and colours, the time estimate (`estimateMinutes`: information only, CT-01), test placement (B4: the jump test on a free jump day, E-79), the Olympic exposure trim (B4: unfillable stations first, E-68) |
| `select.mjs` | `selectBlock`, `fillSlot`, `candidates`, `variationValues`, `isNearDuplicate`, `detailDistance`, `aerobicPick`, `offeredAddons` (v0.5 / V2), … | picks exercises: hard filters in order (kit, never-list, KB swing never in resistance slots, 60+ and youth rules, pain, exclusions, medball, two spine days, second exposure), scoring from `rules.selection.weights`, laterality share, Olympic day pattern, swaps 2-4 (core swaps in the same plane), exercise-block changes. v0.4 stage B3: one-detail block changes with concrete values ('weight in the opposite hand'), no near-duplicates in a session, the lead chest press and the canonical work lift, home substitutes only when needed, core once a week, aerobic sessions by level and exercise block (E-46 ... E-57). Fix round 1 / F3: the laterality dial on every lower station (one way), the non-spinal second hinge and the low-back core, delt stations by the Focus, above-level picks as fallbacks, week-wide movement families, heavy-powerlifting canonical lifts (E-127 ... E-133) Fix round 2 / F3 (E-178 ... E-189, E-204): `SECOND_PASS` - with `ctx.live` / `ctx.base` the stations the time check kept are picked again under `rules.selection.r2` inside the profile of their first pick (the upper laterality dial, movement families, the second hip as a leg curl, core planes, swaps by category, block changes on live stations, no step down, the push-up band, the class's strict press); the warm-up drill steps up by exercise block; the aerobic ladder climbs with the plan. |
| `dose.mjs` | `doseItem`, `doseAerobic`, `doseConditioning`, `repClassFor`, `positionFor`, `intensifierEligible` | reps (goal column, VOL phases, pyramid decided per exercise block, per side), effort (planned RIR, never below 1 on compounds; v0.4 B3: one MYO intensifier a day in the last week only, circuits follow the planned RIR), rest (a supersetted work lift keeps its strength rest), load hints (power language, ramp, medball ≤ 20 lb, WOD station loads), athletic counts, tests, WOD / circuit / aerobic doses (the client's own cardio tool), notes. Fix round 1 / F3: `intensifierEligible` (the MYO on the day's last eligible item), the circuit hold intensifier, superset rest in numbers, per-side one-arm Olympic lifts, rep-hint tops in every block, the class table on the class lifts (E-118 ... E-126) Fix round 2 / F3 (E-187, E-190 ... E-195): one-side lifts at 8+ reps per side, back extensions at 10+, rep caps that never get lighter by block, 2-3 min for a heavy two-arm / two-leg compound, no MYO on a bar, `note.hold_weights`, the week-1 tip by the week's effort, aerobic minutes climbing in the block and `effort.rung`, core holds 5 s longer per block. |
| `validate.mjs` | `validatePlan`, `CHECK_IDS` | V1-V37 and H01-H22 (CONTRACTS §6 and the 0.5.0 boxes; v0.5: V3 = no time fitting anywhere in a plan, V13 = session size, V15 / H10 = final sets reached in the last week, V30-V37 = template skeleton, add-ons, incline first, video search links, the progression rule, the acceleration note, the easy-to-remove list, carries by distance or time; no check reads minutes; V27 athletic budget, V28 bilateral share (warn), V29 push : pull (warn) added in v1.2; v0.4 B4 readings of V18 / V19 / V22 / V23 / H21), each a list of structured violations; recomputes credits, weekly sets, group counts and the stairway independently |
| `explain.mjs` | `whyText`, `explainItem`, `levelText`, `changesText`, `stairText`, `resolveArgs` | human explanations from the why-codes; resolves id arguments (exercise, weekday, muscle, joint-care code …) to words (v0.4 B3: lower-case weekdays inside Spanish sentences, singular reasons) Fix round 2 / F3: `listAnd` ('a, b and c' / 'a, b y c'), the block-change line counts what changes, a circuit week's own load line. |
| `render.mjs` | `renderPlan`, `renderBlockView`, `renderWeek`, `renderDay`, `format*` | markdown or text, EN or ES, phone-friendly; only `model.t` words (no hard-coded text). v0.4 stage B3: the use-at-your-own-risk line with the release link on top of every plan and view (R3-GEN-01), ~~'Your schedule' (the time check and the offers)~~ (retired in 0.5.0), per day the blocks that can be switched off and the supersets that save time (R3-SES-02), macro tables for screenshots (`view: 'overview'`), tests, notes and day titles in the client's words. Fix round 1 / F3: only what is true (the minutes, climbing, Focus, intensifier days, change lines per group), every switchable block, the flat release stamp + health-check / PAR-Q+ line, 'How to adjust this plan', the effort bridge, the weekly sets table with every group, superset partners side by side (E-111 ... E-123) Fix round 2 / F3 (E-196 ... E-203): a kept exercise named with its day, ~~every day over its minutes listed up front~~ (retired in 0.5.0), test days and dates in words, the client's own Focus picks and their table rows, the adjust line from the plan's real switches, class instructions (`rules.render`), swim lines, the block table by exercise block, day titles by the lead lift, the English gym name in a translated plan's video search. **v0.5:** the release line on top and at the bottom of every plan and view (R4-SCP-02), an average time per day as information only, the progression rule on every lift (R4-PRG-03), the acceleration note, what is easiest to remove on each day (R4-SES-04), the YouTube search link and the name to copy (R4-LIB-05), swap notes (R4-LIB-04). |
| `generate.mjs` | `generate`, `generateWith`, `realModulesStatus`, `REQUIRED_DEPS` | the orchestrator (pipeline below); `generateWith(deps, …)` runs it on injected modules (tests use stubs). v0.4: `adapt` / check-ins retired (R3-VOL-02 / R3-VOL-04) Fix round 2 / F3 (E-178): after the first volume pass the selections are made again on the live stations and the volume engine runs again (frozen when a trained group would be lost or the finished plan fails an error check). |
| `version.mjs` | `ENGINE_VERSION` | `0.5.0` (v0.5 package V1: structure and volume; before: `0.4.0` (round 3, stage B1: time, volume and structure; stage B2: athletic work; stage B3: selection, variation and rendering; stage B4: integration) Fix round 2: F1 (time, volume, structure), F2 (athletic work), F3 (selection, dosing, the printed plan). |

Pipeline (`generate.mjs`, CONTRACTS §4.12):

```
validateIntake -> safetyScreen -> deriveValues (D1-D14) -> buildShape -> buildWeekLayout (per training block)
  -> selectBlock (per exercise block) -> planWeeklySets (+ fillSlot for added bonus / Focus slots, estimateMinutes)
  -> second pass (fix round 2 / F3): selectBlock again on the stations that hold sets (ctx.live / ctx.base) -> planWeeklySets again
  -> athleticBudget -> per week: layoutForWeek, relocate rep-max tests (D-46), the week's items (v0.4 B2: collected first)
  -> planAthletic (the athletic stairway of each block, v0.4 B2) -> per week: doseItem / doseAerobic / doseConditioning,
     distinct details for a same-day repeat (D-48), test top-set items -> meta (warnings incl. time_check, long_day,
     test_day_long) -> plan.time_check -> summary -> validatePlan
```

v0.5: the same pipeline without the time steps - `planWeeklySets` allocates each group's whole-set schedule to the template's slots
(and opens the bonus exercise), `meta.warnings` carry `two_day_rule / acceleration / capped_by_template / below_floor_template /
credit_only_groups`, there is no `plan.time_check` and no `plan.offers`; `applyPlanEdits` (engine/edit.mjs) runs on a generated plan.

The output is a `plan/2` JSON (CONTRACTS §5): codes and keys only (no prose), stamped with model, engine and contracts versions,
the release stamp, the full derived values for audit, the stairway, every week / day / item with sets, reps, effort, rest, load,
credits, swaps, notes and `why`, a summary and the validation result. v0.4: the plan is built once with its planned stairway - no
check-ins, nothing is read back (R3-VOL-02 / R3-VOL-04); `plan.time_check` says up front what the chosen days x minutes hold, what
is not trained directly and what one more day or longer sessions would hold (R3-SES-02); days list superset recommendations and
blocks carry on / off switches.

## 4. How rules flow from `model/` to a plan

1. **Sources -> model.** `tools/compile-model.mjs` reads the read-only sources (spec v1.1, synthesis/02-12, coach answers), applies the
   16 coach corrections (bands removed, KB swings 0 credit, helpers 0.25, thruster 1 / 0.5 / 0.25, renames …; listed in
   `model/CHANGELOG.md`), and writes `rules.json` (every number and table), `catalog.json` (exercises with credit class, spine class,
   kit, 60+ / youth flags, variation axes), `templates.json` (the coach's week templates as stations), `profiles.json` (sport / activity
   profiles and the picker) and the EN / ES word lists. `rules.json` deep-equals the reference fixture's rules (a test asserts it).
2. **Model -> engine.** `loadModel` freezes the JSON and exposes accessors. Engine code reads numbers from `model.rules` (e.g. the
   floor `rules.volume.floor`, the stairway tables `rules.stairway.by_N`, caps, credit classes, cut order, time model, test catalogue);
   a literal in engine code is only allowed for structure or with an `// INFERRED` comment (DECISIONS D-66 lists the remaining ones).
3. **Engine -> plan.** Each decision is written into the plan with its `why` (`{key: 'why.two_spine_days', ref: 'R2-SES-01'}`), and
   every user-facing string is an i18n key (`exercise.<id>.name`, `note.*`, `warning.*` …).
4. **Plan -> words.** `render.mjs` / `explain.mjs` resolve keys through `model.t(lang, key, args)`; Spanish is a full twin
   (`model/i18n/es.json`, every machine-translated line listed in `es_review.json` for the coach to approve).

Example, the floor of 10 (R2-VOL-06): `rules.volume.floor = 10` -> `volume.computeTargets` lifts every target muscle's start to 10
(pain wins, credit-only muscles excluded) -> `planWeeklySets` places whole sets until each muscle reaches it or the schedule runs out
-> the time check (v0.4, R3-SES-02) keeps the groups the minutes hold at 10+ and climbing and names the others up front ->
`validate` V22 / H17 re-checks every stairway week -> `tests/invariants` re-checks it independently on 8 samples + 378 random / sweep
intakes, and `tools/sweep.mjs` on 1,578 intakes per model.

## 5. The coach's hard rules: where they live and how they are tested

| Rule | Model | Enforced in | Check | Test |
|---|---|---|---|---|
| No bands / chains / weight releasers | `rules.equipment.banned_tokens`; compile drops 36 records | compile, select | V9 / H01 | compile, model, invariants |
| Never to failure on heavy compounds (1-2 in the tank; MAX / MYO only where allowed) | `rules.effort` | dose | V17 / H02 | dose, validate, invariants |
| Power before strength; H before V; core first | `rules.ordering` | week | V12 / H03-H05 | week, validate, invariants |
| Hip + push, knee + pull | template pairs, `rules.pairing` | week | V11 / H06 | week, invariants |
| Two spine days (one counted squat, one counted hinge, different days) | catalog `axial`, `rules.axial` | select | V10 / H07 | select, invariants |
| Credits: helpers 0.25, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25; KB swings and athletic work never count | `rules.credit`, catalog `credit_class` | volume, generate | V14 / H08-H09 | volume, model, invariants |
| Every trained group reaches its planned final sets in the last week (one week early at most); faster steps than about 3 % / 5 % are allowed, with no hard limit and a note on a week that adds more than about 15 % (CX-01, R4-PRG-01 / 02). *Retired in 0.5.0: "planned step ≤ 7 %, weekly total < 10 %"* | `rules.stairway.progression` (`target_reached`, `arrival_weeks_early_max`, `note_above`); `rules.stairway.limits` holds only the slow step of a painful area | volume, progression/stairway | V15 / H10, V35 | volume, progression, v05-structure, invariants |
| No medball in aesthetics main work; ≤ 20 lb | `rules.medball` | select, dose | V16 / H11 | select, invariants |
| 60+: no Olympic / plyo / depth jumps by default; never overhead / low-bar squat, snatch, depth jumps | catalog `older_ok`, `rules.population.older` | week, select | V5 / H12 | select, invariants |
| No sex field; no sleep / stress / lifestyle inputs | `util.forbiddenKeys` | intake | H13, V26 / H16 | intake, invariants |
| English default, full Spanish | `model/i18n` | render | H14 | i18n, render, compile |
| No deload / maintenance week inside a block | `rules.plan_types` | shape | V24 / H15 | shape, invariants |
| Floor of 10 sets per trained FOCUS group from 3 training days; on 2 days every big group at about 6-8 and a third day suggested (R4-SES-03); a group its template cannot hold is said, never dropped (R4-SES-04). *Retired in 0.5.0: the time check that decided which groups were trained directly* | `rules.volume.floor` (`applies_from_days`), `rules.volume.two_day` | volume | V22 / H17 | volume, v05-structure, invariants |
| 2-4 exercises per FOCUS group on a split day; 1-4 on a full-body day, where his A / B template gives each group its exercises (R4-SES-05) | `rules.session.exercises_per_group` (`split_day`, `full_body_day`) | week, select, volume | V23 / H18, V30 | week, v05-structure, invariants |
| Tests only week 1 / last week; never a 1RM or max mile from zero | `rules.tests` | shape, dose, generate (D-46) | V25 / H19 | shape, dose, invariants |
| Release every build | intake/2 `release` | intake | V21 / H20 | intake, validate |
| Stairway shape (small steps early, bigger late, last weeks hardest; targets and sets never go down inside a block; a week may keep the same sets while reps or load progress, CX-02 / CX-03). *Retired in 0.5.0: "never flat" and the minimum climb (`min_climb`)* | `rules.stairway` (`progression.flat_weeks_ok`) | volume | H21 | volume, v05-structure, invariants |
| No check-ins - the planned stairway only (R3-VOL-02 / R3-VOL-04) | `rules.stairway.no_checkin = planned_only` | intake, generate | H22 | generate, intake, invariants |
| No time fitting (CT-01, R4-SES-01): no session length, no minute limit, no time check and no time offers; a day is sized by its exercise count (R4-SES-02) and prints an average time as information. *Retired in 0.5.0: the time check of R3-SES-02 (`rules.session.time_fit`)* | `rules.session.size`, `rules.session.easy_to_remove` (`automatic: false`), `rules.time_model` (`use: 'estimate_only'`) | intake, week, estimate | V3, V13, V36 | v05-structure, v05-words, invariants |
| The class keeps its lifts (OT18; v0.4 B4, PROPOSED; v0.5: `rules.session.class_lift`, no longer part of a time check) | `rules.session.class_lift` | volume | V22 / V23 / H17 / H18 (B4 readings) | review-b4, invariants |
| Athletic work: Receive-Create stages per exercise block, plyo share, the athletic stairway (climbs, never drops), first reactive exposures, sport-only drills (R2-ATH-01/02/03, R3-ATH-01..05) | `rules.athletic` (split, stages, response_cues, reconcile, first_reactive, cod, sprint, circuit_ballistic, hyrox), `rules.olympic.sets.climb`, catalog `athletic.response` | athletic, select, dose, budget | V27 | review-b2, shape, volume, invariants |
| Athletic work, round 2 (R3-VOL-04, R3-SES-02 step 4, R2-PER-06 / 07, R2-ATH-04, R3-ATH-01 / 02; fix round 2 / F2, PROPOSED numbers): families that climb to the block's peak in even steps, tests in their station's place, picks by sport / stage / client, WOD density, circuit throws by the round, swimmer shoulder care | `rules.athletic.r2`, `rules.athletic.reconcile.climb_families` / `warn_below_share`, `rules.conditioning.wod.density` / `rotate_r2`, `rules.athletic.circuit_ballistic.per_round`, `rules.prehab.by_injury_code.SHOULDER_SWIMMER` | athletic, select, dose, budget (seams: generate, week) | V27 (`early_peak`, `hold_over`), V19 (`day_lift`) | review-r2f2 |
| Selection, dosing and copy, round 2 (R3-SES-02, R3-SES-01, PER-02, UNI-02 / UNI-04, VOL-14 / VOL-15, CAT-05 / CAT-08, R2-GEN-06 / R2-GEN-08; fix round 2 / F3, PROPOSED weights and words): the second selection pass on the stations that hold sets (v0.4 wording: "the stations the time check kept"), the upper laterality dial, movement families, core planes, no step down, unilateral rep floor, heavy-compound rest, the aerobic ladder, truthful schedule / adjust / test-day lines | `rules.selection.r2`, `rules.reps.unilateral_floor` / `rep_floor_ids` / `rep_hint.monotone_cap` / `core_hold_seconds.block_step`, `rules.rest.heavy_compound`, `rules.effort.intensifiers.never_tags`, `rules.conditioning.aerobic_b3.r2`, `rules.warmup.progress_by_exercise_block`, `rules.render` | select, dose, render, explain (seams: generate, validate) | V12 / V17 (the MYO lists), V28 (the dial reads live stations) | review-r2f3 |

## 6. Tests (`node --test tests/`: 1407 tests, 1401 pass, 0 fail, 4 todo, 2 skipped - engine 0.5.0 after fix round 2)

v0.5 (fix round 2): `tests/v05-fix2.test.mjs` (31 tests, named by coach answer id: the amendment layer; on `model/` the 8 samples,
benchmark plans 19, 34 and 69 and two intakes of the random corpus - R4-LIB-01 core picks, 04 LOW_BACK_* the low-back opener,
R4-LIB-03 / R3-ATH-01 the swimmer's presses, R4-SES-05 the third chest lift and the class skeletons, EQ-15 loaded jumps,
OBSERVED BASEBALL Part E the buy-out, R2-SES-06, VOL-18 the back at its final sets, UNI-02 / UNI-03, ATH-10, R2-SES-03, R4-PRG-01,
OT06 the bootcamp stations and their order, PRG-03 / CX-02 the timer steps and rounds, VOL-06, VOL-07 / VOL-16, VOL-17, R4-PRG-04,
VOL-03 / R2-LIB-03 the pain words, R4-LIB-04 swap notes, scorer 2.3). 36 older tests were converted (DECISIONS, "Tests converted in
fix round 2"); none was retired. The 4 athletic `todo` tests remain.

v0.5 (fix round 1): `tests/v05-fix1.test.mjs` (43 tests, named by coach answer id: the stairway kernel's `stairwayProgress` and
`staggerStairways`; the amendment layer; on `model/` the 8 samples and benchmark plans 09, 10, 33, 56, 88 - R4-SES-05 the athletic
slots, the "Chest / Shoulders" slot and the overhead triceps slot, R2-PER-07 the tested lift, R2-VOL-06 the floor on training days,
R3-VOL-04 / R4-PRG-01 the shared steps, VOL-18 pull against push, PER-11, OT17 / OT18 / PRG-10 the class, OT06 the bootcamp, R3-SES-01
the Focus steps, VOL-16 / VOL-07, VOL-17, R2-VOL-04, EQ-08, R4-SES-02, R3-ATH-02 / R3-ATH-05, VOL-03 the MYO set, R2-PER-06, R2-ATH-07,
GEN-04 the swaps, CX-04 the capped notice; on the fixture four intakes of the random corpus). 49 older tests were converted
(DECISIONS, "Tests converted in fix round 1"); none was retired. The 4 athletic `todo` tests remain.

v0.5 (package V4): `tests/v05-integrate.test.mjs` (22 tests on the fixture and on `model/`, named by coach answer id: R4-SES-05 the
skeleton's laterality on the samples and on 14 gym / push-pull-legs benchmark intakes, the two-arm lead row, push / pull / legs in the
order of his sheet, the triceps slot kinds, V30 and V28 on generated and hand-broken plans; R4-PRG-04 / ORD-11 the Focus slot and the
final sets; ORD-08 the warm-up on every main day; SPEED_SESSION_ORDER on the samples and 11 athletic benchmark intakes; EQ-03 / F38
handstand work and "no floor work"; the block view's row order; plus 4 tests on the benchmark scorer 2.1 and 1 on the amendment
module). Four older tests were converted (DECISIONS, "Tests converted in work package V4"). The 4 athletic `todo` tests remain.

v0.5 (package V3): `tests/v05-words.test.mjs` (25 tests on the fixture and on `model/`, named by coach answer id: R4-SCP-01 / R4-SCP-02
the liability gate and the release line on every view, R4-PRG-03 the progression rule, R4-PRG-02 the acceleration note, CT-01 /
R4-SES-01 the time estimate as information, R4-SES-04 easy-to-remove hints, the week-by-week sets table and the macro views, the
v0.5 check list V21 / V30 ... V37 on generated and hand-broken plans, R2-GEN-08 the Spanish of the new lines; plus 3 tests on the
benchmark scorer 2.0, one of which runs `design/bench/selftest.mjs`); `tests/validate.test.mjs` holds one failing mutation for each
of the 59 check ids.

v0.5 (package V2): `tests/v05-library.test.mjs` (31 tests on the fixture and on `model/`, named by coach answer id: R4-LIB-01 optional
add-ons, R4-LIB-02 carries, R4-LIB-03 mid-range pull and incline first, R4-LIB-04 swap notes, R4-LIB-05 video search links,
R4-SCP-03 profile confidence, the HANDOFF clean-ups, Appendix F1, and the selection findings; the selection tests read the 8 samples
and 25 of the benchmark intakes of `design/bench/intakes/`). The four selection `todo` tests of V1 are converted and pass; 4 athletic
`todo` tests remain (G-36).

v0.5 (package V1): `tests/v05-structure.test.mjs` (72 tests on the fixture and on `model/`, named by coach answer id: CT-01 / R4-SES-01
no time fitting, R4-SES-02 session size, R4-SES-03 the 2-day rule, R4-SES-04 nothing dropped / everything said, R4-SES-05 the A / B
skeleton, CX-01 / R4-PRG-01 the stairway that reaches its target, R4-PRG-02 the acceleration note, R4-PRG-04 the next block, VOL-17
calves, the allocation steps, PRG-03 circuits, CX-04 edits, V3); `tests/progression/*` and `tests/audit/*` (the kernel and the audit
fixes; the 3 former `todo` tests pass). The tests of earlier rounds that asserted time-fitting behaviour were converted or retired - each
with a one-line reason in `engine/DECISIONS.md` section G (96 converted, 69 retired). 8 tests are `todo` (4 athletic, 4 selection: real
effects of the new structure that belong to the next packages, G-23). The invariants suite runs the validator and an independent
re-check of every hard rule on 386 intakes (8 samples, 300 random, 52 sports, 26 activities); `node tools/sweep.mjs` runs 1,578 intakes
on the fixture and on `model/`: 0 failing error checks. The per-file counts in the table below are the 0.4.0 ones.

### Tests of engine 0.4.0 (`1035 tests`)

| File | Tests | Covers |
|---|---|---|
| `compile.test.mjs` | 26 | model == fresh compile, rules == fixture rules, credits, bands, KB swings, ES coverage, pinned cross-check values |
| `model.test.mjs` | 30 | `assertModel` passes on fixture + model/ and catches 19 kinds of injected defects (incl. an unresolved `[PLACEHOLDER]`) |
| `intake.test.mjs` / `shape.test.mjs` / `volume.test.mjs` | 42 / 24 / 64 | the coach's worked numbers: L1 / L2 / L3 stairways (λ 0.76 / 0.867 / 0.501), per-line starts / caps / λ for all 8 samples, Focus +2, calves floor, VOL-07 placement and day rotation, < 10 % rise, group floors and climbs, pain freeze, circuits, the time check, season shapes |
| `week.test.mjs` / `select.test.mjs` / `dose.test.mjs` | 24 / 19 / 20 | templates and weekdays, caps and cuts, filters in order, spine days, swaps, rep classes, effort, tests |
| `validate.test.mjs` | 77 | one failing mutation per check id (V1-V29, H01-H22; v0.4: group floors from the items, listed-but-trained, no warning exemption, check-ins retired) |
| `generate.test.mjs` / `explain.test.mjs` / `render.test.mjs` | 30 / 6 / 17 | orchestration on stubs and real modules, §9 facts, warnings, check-ins retired, views and formats |
| `i18n.test.mjs` | 18 | every sample in EN + ES, all views, markdown + text: no undefined, no placeholder, no raw key or engine code |
| `determinism.test.mjs` | 10 | twice-identical, shuffled keys, no clock / random / Intl in engine sources |
| `review-v12.test.mjs` | 81 | one regression test per fixed coach-eye review issue on the 8 sample plans (IDs as in `samples/REVIEW_LOG.md`) |
| `review-r3.test.mjs` | 33 | v0.4: one regression test per RECHECK_v0.3 issue fixed in stage B1 (`R<sample>-<slug>`) and per round-3 feature (`R3-<slug>`) |
| `review-b2.test.mjs` | 29 | v0.4 stage B2 (athletic work): one regression test per RECHECK_v0.3 athletic issue (`R<sample>-<slug>`) and per R3-ATH answer (`R3-ATH-01` ... `05`, toggles, the split and the bounds) |
| `review-b3.test.mjs` | 35 | v0.4 stage B3 (selection, variation, rendering): one regression test per RECHECK_v0.3 issue fixed in stage B3 (`R<sample>-<slug>`) and per round-3 feature of the printed plan (`R3-own-risk-line`, `R3-time-check-printed`, `R3-block-toggles-printed`, `R3-superset-recommendations-printed`, `R3-no-checkin-text`, `R3-macro-views`) |
| `review-b4.test.mjs` | 22 | v0.4 stage B4 (integration): one regression test per issue found reading the 8 regenerated plans (`R<sample>-<slug>`: class lifts, class day title, lower peaks, circuit throws, even pull days, rotator-cuff care, 'not trained in this plan' copy, test-day warning, tests spread) and per sweep intake that failed an error check (`B4-sweep-random-<n>-<slug>`); each fails on the pre-B4 engine |
| `review-r2f1.test.mjs` | 30 | v0.4 fix round 2 / F1 (time, volume, structure): one regression test per fixed issue of the second coach-eye reviews (`R<sample>-<slug>`; `R2F1-sweep-<intake>-<slug>` for the round's own sweep findings: the climb on the main days, H21 on the main days, cross-pattern `athletic.3`, the class split, day patterns and pattern stations, the ceiling in the last week, real test days, circuit sequencing and switchable stations, circuit seconds by the approved steps, Focus back under a time cut, big movers before arms, MYO outside a pair) |
| `review-r2f2.test.mjs` | 32 | v0.4 fix round 2 / F2 (athletic work): one regression test per fixed issue of the second coach-eye reviews (`R<sample>-<slug>`: families that climb to the end, the second ankle day, shoulder care 2 sets in the rests, the Olympic lift by the day's lift, told capacity, a timed test in its station's place, the end-test week's baseline dose, the V27 `early_peak` mutation, COD tiers and the reaction drill, sport-fit jumps, the share's end clamp, throws per block, the set climb, soccer's jump stations and pre-season, WOD density and rotation, the class end-test week, circuit throws by the round and plane, low-impact lateral picks and swaps) and `R2F2-sweep-<intake>-<slug>` for the round's own sweep findings; `R2F2-even-steps-unit` drives `planAthletic` directly |
| `review-r2f3.test.mjs` | 38 | v0.4 fix round 2 / F3 (selection, dosing and the printed plan): one regression test per fixed issue of the second coach-eye reviews (`R<sample>-<slug>`: the second pass keeps the time check, core planes and holds, back-extension reps and rep caps by block, swaps in the category, no load-limited flips or step-downs, the kept press named, swim lines, the upper laterality dial, week families, the unilateral rep floor, heavy-compound rest, MYO never on a bar, the core opener, the implement note, days over listed, something changes each block, the second hip as a leg curl, the aerobic ladder, the athletic line and the end-test header, neutral Spanish, the class press and class copy, skill swaps, body-weight copy, the circuit week line, the push-up band and calves, loaded Focus picks, the dial toward two-arm, the Focus line and rows, day titles and the block table, client copy without rule ids, one pulldown a day, the warm-up drill, the court player's core, recreational copy) and `R2F3-sweep-<intake>-<slug>` for the round's own sweep findings |
| `review-f3.test.mjs` | 40 | v0.4 fix round 1 / F3 (selection, dosing and the printed plan): one regression test per fixed coach-eye review issue of the 8 samples (`R<sample>-<slug>`: the minutes promise, every switchable block, the two-leg / single-leg direction and the laterality dial, Focus vs bonus labels, the Focus muscles line, kept-pattern notes, the legal lines, the effort bridge, 'How to adjust this plan', truthful schedule lists, change lines per group, the halfway intro, the weekly sets table, copy fixes, pair rest and order, intensifier fallback and the circuit hold, non-spinal hinge, low-back core, delt variants, level fallbacks, hot-spot picks, class lifts' table, powerlifting lifts, week families, detail words, rep caps, the switched-off late off-season step) and per corpus intake the round's own changes broke on the way (`F3-sweep-<intake>-<slug>`), plus the V12 / V17 MYO reading |
| `review-f2.test.mjs` | 28 | v0.4 fix round 1 / F2 (athletic work): one regression test per fixed coach-eye review issue of the 8 samples (`R<sample>-<slug>`: ballistic jumps before the ankle block, Friday jump and throw, the share held, overhead throw first, stage drills and cues, the ankle block in place first, second sprint, medball dose, Olympic ceiling, jump ladder, the ankle block outside the split, max velocity, both-sides throws, COD reps, reactive COD, the pre-season's Repeat stage, split capacity warnings, power first in a circuit, the racket ankle track, low-impact stage drills) and per corpus intake the round's own changes broke on the way (`F2-sweep-<intake>-<slug>`), plus the V27 `share_over` check and a `planAthletic` unit |
| `review-f1.test.mjs` | 36 | v0.4 fix round 1 / F1 (time, volume, structure): one regression test per fixed coach-eye review issue of the 8 samples (`R<sample>-<slug>`: big movers kept, pattern stations, skill minutes, starts at the level, groups climb through the block, 2-set added exercises, compound order, calves, one hips target, the absolute ceiling, tests as top sets, block ids, supersets, circuit donors and seconds, joint care) and per sweep intake the round's own changes broke on the way (`F1-sweep-<intake>-<slug>`) |
| `invariants/invariants.test.mjs` | 224 | 8 samples x 2 models + 300 random + 52 sports + 26 activities: generate ok, every error check, independent re-checks of H01-H22 (v0.4: group floors / climbs from the items, listed groups untrained, time-check offers only), check-in output modes planned like plan-only, no same-day duplicate, rep-max tests on bilateral lifts |

## 7. Known limits (Phase 0)

**Engine 0.5.0 (package V1) - read first; the 0.4.0 limits below that speak of minutes no longer apply.** This list was written at package V1. Packages V2 to V4 and fix rounds 1 and 2 changed several items (the incline press now counts for chest in slot 3, the selection `todo` tests pass, the validator holds V30-V37). The current list of known gaps and open questions is `samples/STATUS_v0.5.md`.
* **Chest is capped on the A / B template** (sample 06: 13 weekly sets against a planned 25): slot 3 of the B day ("vertical push or
  incline press") still takes an overhead press. V2 routes the incline press there; until then the plan says "this template holds 13".
* **Capped groups at L2 / L3 on 4 days**: 7 exercises a day x 5 sets hold less than the level's tops of 22-25 for back, biceps and
  triceps; the plan says so (`warning.capped_by_template`) and adds the bonus exercise on the optional days.
* **Slot order inside a pair**: the day opens with the upper lift of the pair (R4-SES-05 wording: row, then squat); his sheets also
  show the lower lift first. A coach question.
* **PROPOSED numbers** (DECISIONS G-07, G-08, G-09, G-11, G-12): stay-active 5-8 and class 5-7 exercises, bootcamp rounds 3 / 4 / 5 by
  level, the sprint buy-out only for competitive athletes and classes, the acceleration note from 2 whole sets, at most 2 bonus
  exercises on an optional day, a next block at least 1 set higher.
* **Bootcamp circuits at 7 stations** drop the calf station of the 8-station days and may leave biceps / triceps / shoulders under 10
  (`warning.below_floor_template`); which 7 stations stay is by rank (compound lifts, the conditioning station, then isolations).
* **Athletic layer (4 `todo` tests, G-23)**: the linebacker's sprint metres hold for 5 weeks, the soccer pre-season holds fewer cuts
  than the last off-season week, the soccer week keeps an upper-body plyo station, the V27 early-peak mutation needs a new case.
* **Selection (4 `todo` tests, G-23; package V2)**: two alternating DB overhead presses in the football week, two staggered-stance DB
  hinges on the soccer hip day, two cable pulldowns on a PPL pull day, the upper-body two-arm share does not fall by exercise block.
* **End-test week**: with the A / B / C lifts the three strength tests sit on three days, so every day of the end-test week runs the
  baseline athletic dose (R2-PER-07).
* **Estimated minutes are long** for the full templates (a class day about 2 hours at the peak, a 12-exercise athletic day about 2
  hours): information only; each day lists what is easiest to remove.
* The model version is still 1.3.0; `design/` bench intakes still send `session_minutes` (ignored with a warning); a 3-day push /
  pull / legs variant is not built; the validator has the minimum v0.5 checks (V3 of the plan owns the full list).

* *Engine 0.4.0 only (history; retired in 0.5.0 by CT-01 and R4-SES-03 / 04):* Session time vs. volume (v0.4, R3-SES-02): short schedules keep fewer groups trained directly (told up front, with one more day /
  longer sessions in numbers); the keep order, the minimum climb, the rest-class minutes and the work-lift below-floor exemption are
  PROPOSED (DECISIONS E). A CrossFit-style class at 4 x 60 min trains back and chest directly and keeps its squat, deadlift and
  strict press as class lifts (3 sets, heavier by the week; E-64, PROPOSED). A swimmer at 3 x 60 gets no squat or chest press and a
  pickleball player at 2 x 45 no row or press (the plan says 'not trained in this plan'); open question for the coach.
* *Engine 0.4.0 only (history; 0.5.0 has no session length):* 30-minute sessions (sweep, E-80): the fixed blocks (warm-up, core, athletic / Olympic / WOD) can fill the session - 35 of 1,578
  random plans train no group directly and 56 have non-test days over 125 % of the minutes; the plan says so and offers more time.
* *Engine 0.4.0 only (history):* Test weeks run long on the test days (work-ups and timed tests on top of the session; `warning.test_day_long`).
* V28 (bilateral share) and V29 (push : pull) are warnings; the sweep shows them on about a third of the random plans.
* Athletic weekly budgets (04): v0.4 stage B2 doses them as an athletic stairway (E-29) and V27 enforces over / under / drops;
  where the time check and the 12 + 2 cap leave few stations (soccer 3 x 75, pickleball 2 x 45) the work is scaled to what the
  stations hold and the client is told (`warning.athletic_capacity`). The share split of the 04 numbers is INFERRED (E-28).
  Fix round 1 / F2: the plyo share is held within 5 points every week where the doses allow it (V27 `share_over`); the soccer and
  football jump volume stays well under the 04 targets (told up front, jumps and ankle work apart); the share tolerance, the station
  sizes and the stage cue words are PROPOSED (E-97 ... E-109).
  Fix round 2 / F2 (E-160 ... E-177): the families climb to what the hardest weeks' stations hold and a peak under 85 % of the
  target is told; the extra athletic set (E-161) only lands where a day has the minutes - none of the 8 samples has them; a
  low-impact client's box-jump pool is small (the same lateral box jump in two blocks). The told line, the COD turn tiers, the
  throws a round, the WOD density and the swimmer's 2 in-rest sets are PROPOSED.
* Fix round 2 / F3 (E-178 ... E-205): the second selection pass doubles the selection and volume work of a plan (the test suite runs
  about a minute longer); a plan whose dial flips would cost a trained group or an error check keeps the first pass's lateralities
  (01 swimming: its V28 warning stays). The upper dial stops at the day's first chest press (02 ends at 33 % two-arm against 20 %).
  Library limits show in the picks: two non-thrust glute exercises (06 keeps three hip-thrust versions a week), one family of
  single-leg hinges, three live calf records, no vertical pull for a DB-only kit. A glute-dominant second hip pick for athletes and
  circuits waits for the hips target on group credit (volume). The one-arm upper stations and the 2-3 min heavy-compound rest add
  minutes the time model does not count yet. Every weight, ladder and word of the round is PROPOSED; the new Spanish strings are in
  `es_review.priority_review`.
* Check-ins are retired (R3-VOL-02 / R3-VOL-04); all Spanish is PROPOSED.
* Block-to-block details (v0.4 B3, E-46): the one-detail rule is the coach's; the value vocabulary ('1-second pause at the bottom',
  'one leg at a time' ...) is PROPOSED; one MYO intensifier a day in the last week is PROPOSED (R3-VOL-04 says 'intensifiers').
* Round-3 defaults in use are listed per plan in `meta.r3_pending`.
* Fix round 1 / F3 (E-134): built and switched off for the coach - the late off-season VOL2 -> VOL3 step at the halfway week (it
  costs the 3 x 75 soccer week chest and calves) and the racket player's glute pick next to the leg curl (it flattened the 2 x 45 hips
  stairway); the upper-body laterality dial, the flat-bench press test and the schedule offers stay open. Every F3 weight and word is
  PROPOSED; the health-check / release lines are LEGAL REVIEW.
