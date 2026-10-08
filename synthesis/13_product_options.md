# 13 · Product and output options: how people get, follow and adapt a Blaze Camp plan

**What this is.** The coach asked for ideas on what the generator should hand people (COACH-ANSWER GEN-03): "I don't know what the output should be yet ... you should be able to give me some ideas." This document lays out four concrete options, says what a user sees in each, how tracking and week-to-week adjustment work, what each costs to build and run, and what can go wrong. It ends with a recommendation and a phased roadmap (MVP → v2). The main body is written for the coach. The engineer appendix (section E) holds the data contracts and the build plan.

**Status.** Everything marked PROPOSED is a recommendation waiting for the coach's yes or no. Nothing here changes a training rule; the training rules live in `BLAZE_CAMP_BRAIN.md`, `generator_spec_v0.json` and synthesis files 01-11. This file only decides how those rules reach people.

**Read with.** `09_generator_inputs.md` (the intake form, corrected below by GEN-02), `generator_spec_v0.json` (the engine's rule tables), `BLAZE_CAMP_BRAIN.md` §3.5 (his logbook menus) and §13 (the decision pipeline), `08_open_questions_for_coach.md` §2.7 (the N-OUT output questions this file answers or narrows), `coach_answers_full.md` (authoritative).

**Evidence labels.**

| Label | Meaning |
|---|---|
| **COACH-ANSWER <ID>** | The coach's answer in `coach_answers_full.md` (2026-10-08). Authoritative. |
| **OBSERVED** | Read from his sheets (dumps) or computed from the team's catalog files with the project venv. |
| **SCIENCE** | Peer-reviewed evidence (references at the end). |
| **RESEARCH** | Product, pricing, platform or legal facts from public web pages, accessed 2026-10-08 (references at the end). Prices change; re-check before buying anything. |
| **INFERRED** | The team's reasoning or estimate. |
| **PROPOSED - PENDING COACH APPROVAL** | A recommendation the coach must accept before it is built. Shortened to **PROPOSED** below. |

---

## 0. The answer on one page (for the coach)

1. **Build a website, not an app.** It opens from a link on any phone, looks and feels like an app, can be added to the home screen and keeps working without signal in the gym. No app store, no app to maintain (COACH-ANSWER GEN-03: "I don't want to create a whole app. Maybe just a website"). [PROPOSED]
2. **The plan is built on the person's own phone.** The site sends the whole Blaze Camp model to the browser and the plan is generated there. Nobody's answers (age, weight, pain) reach a server unless they choose to share. That keeps it private and almost free to run. [PROPOSED]
3. **One plan, many outputs.** The same plan can be shown as: the phone view (default); "save this day as an image" (your screenshot idea, made one tap); a printable PDF (one week per page); a Google Sheets / Excel file with your BYOP tracking columns ('WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?'); and a share link. [PROPOSED; columns OBSERVED in BYOP 'JUSTICE LEAGUE' row 2]
4. **Tracking is optional, and adapting does not need tracking.** You said people should track however they want, notebook included (GEN-03), and you also said the plan should adjust week to week from EFFORT and HOW IT FELT (GEN-05, RIGHT). Both hold if the site offers three levels: (a) no tracking, the plan already rises week by week on its own; (b) a one-minute **weekly check-in** with no account: "how hard was this week, how did it feel, anything hurt, how was life", and the site writes next week; (c) a full logbook with your columns, for those who want it. [PROPOSED]
5. **The check-in is how the tool picks 3 %, 5 % or 7 %.** You said the weekly increase depends on the person (fatigue, life, how they respond), not on muscle size (VOL-05), and that 10 % a week is too much (UNI-05). The check-in is the only way the tool can know the person's state. [COACH-ANSWER VOL-05, UNI-05; mechanism PROPOSED]
6. **English first, full Spanish switch.** Every word on every screen and in every export comes from two word lists (English and Spanish), so the switch changes the whole thing instantly without rebuilding the plan. [COACH-ANSWER GEN-01; mechanism PROPOSED]
7. **Default exercise in every slot, with a dropdown to swap within the same category.** [COACH-ANSWER GEN-04]
8. **Coaches can add their own rules** through a simple "When ... then ..." form; your hard rules stay locked. [COACH-ANSWER GEN-08; mechanism PROPOSED]
9. **Videos: one short silent clip per exercise.** Silent clips work in both languages; the cue text under the video switches language. About 79 of the ~350 live library exercises have one of your links today; 85 exercises that you actually use in your own programs have none, so those get filmed first. [COACH-ANSWER GEN-06; counts OBSERVED; plan PROPOSED]
10. **Open source, in a way that protects you.** Publish the engine and the model once you have graded and approved it; keep your videos, your written cues and the Blaze Camp name as yours. [COACH-ANSWER GEN-03 idea; licensing PROPOSED]

**Recommendation in one line [PROPOSED]:** Option B (plan website + optional no-account weekly check-in), built in phases starting from Option A, with the Google Sheet offered as a download inside it (not as the main product), and the open-source release (Option D) once you have approved v1.

---

## 1. What you already decided (the product rules from your answers)

| ID | Your answer | What it means for the product |
|---|---|---|
| GEN-01 | Users: clients, coaches, trainers, strength and conditioning coaches, anyone. "It should start in English and toggle to Spanish if needed, the whole thing." | One site for everyone, with a **coach mode** for people building plans for others. Spanish covers screens, exercise names, cues, PDFs, sheets and emails alike. |
| GEN-02 | Drop sex. Use training experience in years. Competitive athletes: sport, position, season. Recreational: general sport only. Add body weight. | The intake screens in section 3.1 use these fields. `09_generator_inputs.md` F04 (sex) is removed; F05 (body weight) is added to every intake (required: INFERRED from "weight is going to be important"); F11-F14 only open fully for competitive athletes. |
| GEN-03 | Output undecided; ideas: a PDF they can screenshot, something easy on the phone, maybe a Google Sheet, no full app, maybe a website plus an open-source repo. Unsure whether people should track: "They should be tracking it themselves, however they want ... notebook or whatever." | Sections 2-5 of this document. |
| GEN-04 | Pick the default and keep the dropdowns: "That's going to be important." | Every exercise card has a swap list limited to the same category. |
| GEN-05 | RIGHT: adjust week to week from logged EFFORT and HOW IT FELT ('Felt a PAIN' → swap within the category or lower the level; EFFORT 9-10 → hold or cut sets; EFFORT ≤ 6 → add). | The weekly check-in (section 2.3). |
| GEN-06 | Video for every exercise: "we need more links, I don't have them all ... needs to get done." | Video plan and backlog (section 7.3). |
| GEN-07 | RIGHT: a short cue per exercise plus your instruction block at the top. | Cue under every exercise; your instruction lines at the top of every plan. |
| GEN-08 | RIGHT: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped; "and options for a coach to add their own rules." | Locked rules plus a coach rule layer (section 7.2). |
| PER-01 | 4-6-week plans are maintenance / transition (vacation, travel, season change, moving) at about 50-70 % volume. 8 weeks: first 4 adapting, next 4 driving hard. 12 weeks preferred: 2-4 weeks getting used to it, 4-6 weeks driving hard, last weeks hardest; the next 12 weeks start one level higher. Also week-by-week with no set length, and a yearly option (holiday weeks go to maintenance automatically; quarter themes). | Plan-length choice on the intake: **4-6 weeks (maintenance / transition)**, **8 weeks**, **12 weeks (recommended)**, **week by week**, **full year**. Returning users are offered "start one level higher". |
| PER-07 | Tests chosen by checkbox at block start, or "No need for testing"; at the end the plan says "It's time for your test. Get ready." | Test checkboxes on the intake; a test banner and day in the plan; results are entered in the check-in if the user wants. |
| VOL-01, VOL-02 | "This eventually will be something that learns from the data of all the people that use it." "We'll collect data to see if we need to adjust it." | Consented data collection is designed in from the start (section 7.5) but switched on only after legal review (v2). |
| VOL-06 | "I need this tool that we're building eventually to figure out the percentages." | Users never see percentages; they see "+1 set on Back Squat next week". |
| VOL-13 | RIR is the effort language; add an explanation of RIR and how it relates to RPE. | Effort targets written as "leave 1-2 reps in the tank (1-2 RIR)", with a short "How hard?" page in both languages. |
| ATH-11 | Core first (it is the warm-up), but users can move the core block. | A "Move core block" setting: start (default) / after plyos / after strength / end. |
| ORD-10 | Optional days: add-on or separate days, ideally separate. | A setting: "Optional work: on its own day (recommended) / added to my training days". |
| PER-03 | A/B lead-lift weeks for people who want variety. | A setting: "I like variety" turns A/B weeks on. |
| EQ-10 | The client's own preference can choose between alternatives. | The swap dropdown, remembered per slot for the block. |
| EQ-01, EQ-07, EQ-08, EQ-12 | No bands, no variable resistance anywhere for now. | Equipment screens offer no band options; band exercises are never shown or offered as swaps. |
| EQ-14 | Aerobic work can be done on any machine; tracking it and seeing changes week to week matters. | The aerobic card has a 'WEIGHT USED or SCORE' field for time, distance or calories (PRG-08: SCORE = times, rounds, distances). |
| PRG-05 | L1 / L2 / L3 are fine "but explain it a little bit better"; novice under about 6-12 months; intermediate over a year consistent; more than 6-12 months off → body treated as a beginner, skills come back fast; ex-pros start at L1 only briefly. | Level is explained on screen in plain words, and the user sees why they were placed there ("You trained 3 years but took 9 months off, so we start your body at Level 1 for 2 weeks"). |
| ATH-13, FIX-03 | Names must be general and understandable; 'Justice League' was only a marketing name for a non-competitive all-round athletic program. | Plan names shown to users are descriptive (for example "Athletic all-round, non-competitive" / "Atlético integral, no competitivo"). Final names: question N-PROD-10. |
| FIX-04 | Correct spelling in the generator; leave his sheets alone. | All shown text is corrected; his sheets are never touched. |
| PRG-01 | SKIP ('NO ACCESS' tabs: no gym access, or self-serve without coach access?). | Still unknown. If it meant a self-serve tier without coach access, that is a product tier idea (free self-serve vs coached). Asked again as N-PROD-09. |

---

## 2. The tracking question, settled with options

### 2.1 The tension

* GEN-03: "I don't know if people want to track it or not. I don't think that they should be tracking it from us. They should be tracking it themselves."
* GEN-05 (RIGHT): adjust week to week from the client's logged EFFORT and HOW IT FELT.
* VOL-05: the 3 / 5 / 7 % weekly increase "doesn't really go by muscle ... It's just more on what's going on with the person ... they're going to have to somehow be able to adjust accordingly, or their coach."

**Resolution [PROPOSED]:** separate *tracking* (writing down every set) from *checking in* (telling the tool, once a week, how the week went). Tracking stays optional and can happen anywhere (notebook, notes app, the sheet). The check-in is one short screen, needs no account, and is all the tool needs to choose next week's increase and apply the pain and swap rules. People who skip it still get a complete plan that rises on its own.

### 2.2 Four tracking levels (the user picks; they can change any week)

| Level | What the user does | What the tool does with it | Who it suits | Phase |
|---|---|---|---|---|
| **0 · Just the plan** | Follows the plan. Tracks in a notebook or not at all. | Nothing to read. The plan already contains the planned weekly rise and the deloads from its shape (PER-01, PER-05). | People who want "tell me what to do"; printed-PDF users; the 4-6-week maintenance plans. | MVP |
| **1 · Weekly check-in (no account)** | Once a week, about one minute: effort, how it felt, anything that hurt, how life was, sessions done. | Writes next week: picks the hold / 3 % / 5 % / 7 % step, applies pain swaps and cuts, swaps exercises that felt wrong, triggers an early deload when needed. | Most users; anyone on week-by-week mode. | v1.1 |
| **2 · Full logbook** | Fills your columns per exercise: 'WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?'. On the phone, or in the downloaded sheet. | Same as level 1, but per exercise instead of per day, plus weight history and best-set charts. The check-in pre-fills itself from the log. | Lifters who already log; athletes; coaches' clients. | v1.1 (on the phone), MVP (in the sheet, no adaptation) |
| **3 · Coach-connected (account)** | Same as level 1 or 2, but saved to an account the coach can see. | The coach sees check-ins, gets a flag when 'Felt a PAIN' repeats on the same exercise (N-OUT-11), and can change the plan. | Your clients and other coaches' clients. | v2 |

### 2.3 The weekly check-in (no account) [PROPOSED]

**When.** The day after the last session of the week, the plan shows "Check in to build next week". If the user ignores it, next week follows the plan's planned shape (PER-01) and nothing is lost; they can check in late.

**The questions (about one minute; all taps, no typing).** His own menus are used verbatim where they exist (OBSERVED, BYOP 'MASTER EXERCISE LIBRARY' AV:AY; see `BLAZE_CAMP_BRAIN.md` §3.5).

| # | Question (EN / ES) | Answers | Feeds |
|---|---|---|---|
| 1 | Which sessions did you do? / ¿Qué sesiones hiciste? | a tick per training day ('DONE?') | adherence; repeat-week rule |
| 2 | How hard was each session? / ¿Qué tan duro fue cada sesión? | his EFFORT scale per day: '1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', '8 - That was perfect', '9 - That was terrible', "10 - I'm done" | weekly step (table below) |
| 3 | How did it feel? / ¿Cómo se sintió? | per day, default 'Felt the RIGHT muscles'; tap an exercise to change it to 'Felt the WRONG muscle', 'Felt a PAIN' or "Couldn't do it" | exercise-level rules |
| 4 | Anything hurting now? / ¿Te duele algo ahora? | no / body area from the intake list (neck, shoulder, elbow, wrist or hand, upper back, lower back, hip or groin, knee, ankle or foot) + better / same / worse than last week | pain rule (VOL-03) |
| 5 | How was life this week (sleep, stress, work, travel)? / ¿Cómo estuvo tu semana (sueño, estrés, trabajo, viajes)? | Better than usual / Normal / Harder than usual / Much harder (sick, travel, no sleep) | weekly step (VOL-05 "what's going on with the person") |
| 6 | (optional) Your best set or score on the main lifts / test results | weight × reps, or time / distance / calories | test week (PER-07), % lifts (PER-09), history |

**Weekly step: how much the plan grows next week.** One step for the whole week, applied to every muscle's weekly sets (COACH-ANSWER VOL-04: the percentage is of weekly sets per muscle). Effort = the average of the session ratings, with any single "10 - I'm done" shown separately.

| Average EFFORT ↓ / Life → | Better than usual | Normal | Harder than usual | Much harder |
|---|---|---|---|---|
| 1-6 (too easy … broke a sweat) | +7 % | +7 % | +5 % | hold (0 %) |
| 7-8 ('That was tough' … 'That was perfect', the target) | +5 % | +5 % | +3 % | hold |
| 9 ('That was terrible') | +3 % | hold | hold | hold |
| 10 ("I'm done") on any day | hold, and −1 set on that day (with the logbook: on the exercise rated 10; with the check-in only: the set most recently added to that day) | same | same | same |

Rules around the table:

* **Never more than 7 %** in a week (COACH-ANSWER UNI-05: 10 % "is way too much ... hard to sustain").
* **Repeat the week** (hold) if fewer than half the planned sessions were done.
* **Early deload**: two weeks in a row on hold because of effort 9-10, or 'Felt a PAIN' on two or more exercises in one week → a deload week next (about half the sets, lighter; COACH-ANSWER PER-05).
* **Inside the plan's shape**: during weeks 1-3 of a 12-week plan ("getting used to the movements", PER-01) the step is capped at the planned acclimation rise; in 4-6-week maintenance plans (about 50-70 % volume, PER-01) the step is always hold; in-season athletes stay on maintenance (UNI-10, PER-08).
* **The coach can override** the step for a client (fixed 3 %, for example) (VOL-05: "or their coach to adjust accordingly").
* **Fractions are banked** and a whole set is added when the bank reaches one (COACH-ANSWER VOL-06).

**Exercise-level rules (from HOW IT FELT?).**

| Answer | Next week | Basis |
|---|---|---|
| 'Felt the RIGHT muscles' | keep it; it can move up a level at the end of the block if effort was 8 or easier and pain-free | COACH-ANSWER PER-06 |
| 'Felt the WRONG muscle' | offer two swaps from the same category (or one small change: stance, grip, implement); the user picks or keeps it | COACH-ANSWER GEN-04, PER-02; offer PROPOSED |
| 'Felt a PAIN' | swap within the category or one level down; that muscle or pattern −30-50 %, moved to a machine, or the exercise dropped if needed; same sets kept on a unilateral swap "ideally, but adjust accordingly" | COACH-ANSWER GEN-05, VOL-03, UNI-08 |
| "Couldn't do it" | one level down in the same category or an easier version; sets unchanged | COACH-ANSWER GEN-05 (lower the level) |
| Pain reported two weeks running, or "worse" | plan keeps going around it, and the screen says to see a professional (or the coach, if connected) | INFERRED safety; N-OUT-11 |

**Where the new sets go** (COACH-ANSWER VOL-07): to the first exercise of that muscle in the day's order, then the second, then the third (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3). Small muscles that come at the end of a long day get their extra volume as a bonus exercise.

**Worked example (illustration, computed with the project venv).** Week-by-week mode (so no acclimation cap). Quads at 12 sets a week, trained on Day A and Day C (three quad exercises each, 2/2/2). The order in which Day A and Day C take turns is an assumption for this illustration; the volume doc owns the exact placement.

| Week | Check-in last week | Step | Planned weekly sets (banked) | Sets actually written | Day A | Day C |
|---|---|---|---|---|---|---|
| 1 | (start) | - | 12.00 | 12 | 2/2/2 | 2/2/2 |
| 2 | effort 6, life normal | +7 % | 12.84 | 12 | 2/2/2 | 2/2/2 |
| 3 | effort 8, life normal | +5 % | 13.48 | 13 | 3/2/2 | 2/2/2 |
| 4 | effort 7, life normal | +5 % | 14.16 | 14 | 3/2/2 | 3/2/2 |
| 5 | effort 9, bad sleep | hold | 14.16 | 14 | 3/2/2 | 3/2/2 |
| 6 | effort 8, life harder | +3 % | 14.58 | 14 | 3/2/2 | 3/2/2 |
| 7 | effort 8, life normal | +5 % | 15.31 | 15 | 3/3/2 | 3/2/2 |

What the user reads after a check-in: "Next week: +1 set on Back Squat (Monday, first exercise). Leg Press stays at 2 sets. Your shoulder: Barbell Bench Press is swapped for Machine Chest Press this week." The numbers stay inside the tool (VOL-06).

### 2.4 What the science and comparable products say

* **Simple self-reports are good enough to steer training.** A systematic review of 56 studies found subjective self-reported measures reflected acute and chronic training load with better sensitivity and consistency than commonly used objective measures (Saw, Main and Gastin 2016). Session RPE (a single effort rating per session) is a valid way to quantify training across many kinds of exercise (Foster et al. 2001). [SCIENCE]
* **Adjusting from effort is at least as good as a fixed plan, often better.** Twelve weeks of RIR-based autoregulated squat training gave larger strength gains than fixed percentage loading at matched volume (Graham and Cleather 2021). A meta-analysis in athletes favoured autoregulation over fixed loading for maximal strength (effect size 0.64; Zhang et al. 2021); another found autoregulated and standardised loading gave similar strength gains (Hickmott et al. 2022). A review of monitoring methods rates RIR-based RPE as practical and reliable (Helms et al. 2020). So the check-in should not make results worse, and may make them better. [SCIENCE]
* **Optional logging helps the people who use it.** Self-monitoring was the technique that explained the most variation in the success of physical-activity and healthy-eating programs, especially when combined with goals and feedback (Michie et al. 2009); in phone-based programs, goals or self-monitoring raised the effect (Eckerstorfer et al. 2018). That supports offering the logbook, not forcing it. [SCIENCE]
* **Products already work this way.** The RP Hypertrophy app (Dr. Mike Israetel, part of the coach's lineage) asks users about pump, soreness and workload and uses the answers to set the following week's volume. JuggernautAI asks for readiness (sleep, motivation, soreness) and RPE and adjusts loads and reps session to session and week to week. Volt's Cortex adjusts workouts from feedback and builds full-year seasonal plans for teams. Fitbod adapts the next workout from logged sessions and muscle recovery. All four are subscription apps (RP $24.99-34.99 a month, Fitbod $15.99 a month in 2026); none is free, bilingual by design and built around one coach's model. [RESEARCH]

### 2.5 Where the data lives when there is no account [PROPOSED]

* **On the phone.** Answers, swaps, check-ins and logs are saved in the browser's storage on that device. Nothing is sent to Blaze Camp.
* **The iPhone catch.** Safari deletes a site's saved data after seven days of Safari use without visiting the site; web apps added to the home screen are exempt (WebKit). So the site asks people to "Add to Home Screen" after the plan is made, and offers a backup. [RESEARCH]
* **Backup code.** One tap gives a short code, QR code or small file that holds the answers and check-ins. Pasting it on another phone restores the plan exactly (the engine always builds the same plan from the same answers). We never see it.
* **Share link.** Shares the plan (exercises, sets, reps), never the person's answers (age, weight, pain). Coaches use it to send a plan to a client.
* **Accounts come later (v2)** for people who want sync across devices or a connected coach.

---

## 3. The four options

All four use the same engine (the model turned into code). The engine is the biggest single piece of work, whichever option is chosen (section 9). The options differ in what people see and how the plan travels.

### 3.1 Option A · Plan website (bilingual, built in the browser, phone-first, PDF and sheet exports)

**One line.** A website that asks the intake questions, builds the plan on the phone and shows it as a clean day-by-day view, with buttons to save a day as an image, print or save the week as a PDF, download a Google Sheets / Excel file, or share a link. No tracking, no accounts.

**What the user sees.**

| Screen | Content |
|---|---|
| **S0 · Landing** | "Build your training plan in the Blaze Camp style." EN / ES switch top right (English first, GEN-01); lb / kg switch. Two doors: "Build my plan" and "I'm a coach building for a client". Short disclaimer (not medical advice). |
| **S1 · Safety check** | The five health questions from `09_generator_inputs.md` F01; any "yes" means no automatic plan and a message to see a professional or a coach first (pending N-IN-04). |
| **S2 · About you** | Age; body weight (now required, GEN-02); units. No sex question (GEN-02). |
| **S3 · Goal** | Build muscle / get stronger / perform in my sport / lose fat / hybrid / general fitness and health / athletic all-round, non-competitive (the generic name for the former 'Justice League' idea, ATH-13). Up to two focus muscles. Lift style ("lighter weight, more sets" / "a mix" / "heavier weight, fewer reps"). |
| **S4 · Sport** (sport goals only) | Competitive or recreational? Competitive → sport, position, season (dates). Recreational → general sport only, no position or season (GEN-02). |
| **S5 · Experience** | Years of consistent training; time off in the last year; for ex-competitors "I used to compete" (PRG-05: start at L1 only briefly). The screen shows the level it chose and why, in plain words. |
| **S6 · Schedule** | Days per week, which days, session length (45-60 min suggested for general / fat loss; about 90 min, max 120, for athletes, bodybuilders and powerlifters, UNI-09), start date. Plan type: **4-6 weeks maintenance / transition**, **8 weeks**, **12 weeks (recommended)**, **week by week**, **full year** (PER-01). "Have you finished a Blaze Camp 12-week plan before?" → start one level higher (PER-01). Tests at the end: strength / cardio / speed / jumps / "No need for testing" (PER-07). |
| **S7 · Equipment** | Where you train, extra equipment, machines; no band or chain options (EQ-01, EQ-12). |
| **S8 · Pain and injuries** | Areas, side, how bad, what makes it worse (09 F35-F37). |
| **S9 · Preferences** | Core block position (start by default, ATH-11); optional work on its own day or added on (ORD-10); "I like variety" (A/B weeks, PER-03); things you can't or won't do. |
| **S10 · Your plan (overview)** | The block timeline in words (for a 12-week plan: "Weeks 1-3 getting used to it · Weeks 4-8 driving hard · Weeks 9-12 hardest + test week"); the week grid; a small weekly summary (sets per muscle, jump contacts, throws, aerobic sessions; N-OUT-04); your instruction block at the top (GEN-07). |
| **S11 · Day view** | One card per exercise, in session order (sketch below). Each card: PURPOSE, exercise name, swap dropdown (same category), sets × reps (10/10 written as "10/10 each side", PRG-07), effort as RIR words, rest, a one-line cue, a video button, and a SUPERSET marker when paired. |
| **S12 · Exercise sheet** | Tap a card: the video, the cue, why this slot exists ("knee dominant paired with a pull to avoid bleed-over", UNI-11), the swap list. |
| **S13 · Exports** | Save day as image · Print / PDF (one week per page) · Google Sheets / Excel file · Share link · Add to calendar. |
| **S14 · Year view** (full-year plans) | The year as chained blocks with the quarter themes from PER-01 and the holiday weeks set to maintenance automatically; dates editable. |

**Day view sketch (phone).** Names are illustrative.

```
+--------------------------------------+
| WEEK 5 of 12 · Driving it hard       |
| MONDAY · Day A · about 85 min        |
|                       EN|ES   lb|kg  |
+--------------------------------------+
| 1 CORE (warm-up)          [move]     |
|   Dead Bug          2 x 10/10        |
|   [video]  "Ribs down, slow."        |
| 2 PLYO                               |
|   Low Box Jump      3 x 5            |
|   land soft, stick it                |
| 3 POWER                              |
|   Hang Power Clean  4 x 3   [swap]   |
|   leave 2 in the tank · rest 2-3 min |
| 4 HIP DOMINANT + PUSH · SUPERSET     |
|   a) Trap Bar Deadlift 3 x 6 [swap]  |
|   b) DB Bench Press    3 x 10 [swap] |
|   1-2 RIR · rest 2 min after the pair|
| 5 ...                                |
| 8 CALVES  Standing DB Calf Raise 3x15|
+--------------------------------------+
| [Save day as image]  [Print week]    |
+--------------------------------------+
```

The order follows his rules: core first (ATH-11), plyos and power before strength (ORD-03), hip dominant paired with a push and knee dominant with a pull (UNI-11, ORD-06), calves on every leg day (VOL-17).

**Tracking and adaptation.** None inside the site. The plan already includes the planned weekly rise and deloads. People can track on paper or in the downloaded sheet. To "adapt", they would have to rebuild the plan.

**How it matches your words.** Covers the website, phone view, PDF / screenshot and Google Sheet ideas (GEN-03), Spanish (GEN-01), dropdowns (GEN-04), videos (GEN-06), cues (GEN-07). Misses GEN-05 (week-to-week adjustment) and collects nothing to learn from (VOL-01).

**Build effort, cost and time [INFERRED estimates; detail in E12].** About 10-14 developer-weeks (engine 5-7; screens, exports and the language plumbing 4.5-7), so roughly 2.5-3.5 months for one experienced developer working full time. Running cost: a domain name (roughly $10-20 a year) and free static hosting (Cloudflare Pages' free plan has unlimited bandwidth and 500 builds a month; GitHub Pages' terms say its free hosting is not meant for commercial or software-as-a-service sites, so check the chosen host's current terms before launch). [RESEARCH]

**Risks.** A fixed plan cannot react to a bad week or a sore shoulder until the person rebuilds it; no data to improve the model; PDFs printed from iPhones are fiddly (the image button covers that); Excel files opened in Google Sheets may lose some formatting (to be tested).

### 3.2 Option B · Option A + weekly check-in + optional logbook (no account), accounts later

**One line.** Everything in A, plus the one-minute weekly check-in that writes next week, an optional per-exercise logbook with your columns, offline use, and a backup code. Accounts and coach connection arrive in v2.

**What the user sees (in addition to A).**

| Screen | Content |
|---|---|
| **S15 · Check-in** | The six questions of section 2.3 on one screen; then "Here's what changes next week" in plain sentences (sets added, swaps, deload or not) with an "OK" and an "Undo this change" per item. |
| **S16 · Logbook row on each card** | Optional fields under each exercise: 'WEIGHT USED or SCORE', 'EFFORT' (his 10 options), 'HOW IT FELT?' (his 4 options), 'DONE?'. A separate NOTES box so weights and notes don't mix (N-OUT-07). Rest timer. |
| **S17 · Progress** | Weekly sets per muscle (planned vs done), best sets on main lifts, aerobic scores week to week (EQ-14), test results. |
| **S18 · Backup and devices** | Backup code / QR / file; "Add to Home Screen" help; restore from code. |
| **S19 · Week-by-week mode** | No end date; each check-in produces the next week; blocks of 4-6 weeks with small variable changes between them (PER-02) and deloads come automatically. |

**Tracking and adaptation.** Levels 0, 1 and 2 of section 2.2, chosen by the user. Adaptation runs on the phone; the engine re-builds the plan from the answers plus all check-ins, so the result is always reproducible.

**How it matches your words.** Everything A covers, plus GEN-05 (adjust week to week), VOL-05 (step chosen by the person's state), PER-01 week-by-week mode, PER-07 test reminders, and, once consent is added in v2, the learning data VOL-01 asks for. It respects GEN-03: nobody has to track, and nothing is stored with us.

**Build effort, cost and time [INFERRED].** A plus about 3.5-5 developer-weeks (check-in and adaptation 1.5-2, logbook 1-1.5, offline / backup / install 1-1.5). Running cost the same as A until accounts arrive. v2 accounts: a hosted database such as Supabase (free tier: 500 MB database, 50,000 monthly active users, but paused after a week of inactivity; Pro $25 a month) plus possibly an email service. [RESEARCH]

**Risks.** People ignore the check-in (mitigation: the plan still works; a gentle reminder on the plan screen; the check-in is one screen). Data lost on a phone that is wiped (mitigation: backup code, home-screen install). The step table is our proposal until you approve it.

### 3.3 Option C · Google Sheets output only

**One line.** The generator's only output is a spreadsheet like your BYOP workbook: the full plan with dropdowns for swaps and your tracking columns, ready in Google Sheets.

**Three ways to deliver it.**

| Route | How it works | Sign-in | Notes |
|---|---|---|---|
| C1 · Download file | The site builds an .xlsx file in the browser (one tab per week or all weeks stacked, N-OUT-05) with dropdowns (exercise swaps in the same category, his EFFORT and HOW IT FELT? lists) and colours; the user opens it in Google Sheets, Excel or Numbers. | none | Libraries such as ExcelJS (MIT licence) write dropdown lists and conditional colours in the browser [RESEARCH]. Whether every dropdown survives the import into Google Sheets must be tested in a short spike [INFERRED]. |
| C2 · Straight into their Google Drive | The site asks the user to sign in with Google and creates the spreadsheet in their Drive. | Google sign-in | Uses the `drive.file` permission, which only touches files the app creates; Google classes it as non-sensitive, needing only basic app verification [RESEARCH]. Native checkboxes and protected ranges possible. |
| C3 · Copy a template | A master sheet shared with a "make a copy" link (the URL ending `/copy` forces a copy into the user's Drive), then filled by script or by hand. | Google account | This is close to how BYOP works today (a build-your-own workbook). Filling it automatically still needs C2's sign-in or an Apps Script. [RESEARCH; OBSERVED BYOP] |

**What the user sees.** A form (it could be a web page or a Google Form), then a spreadsheet: rows WEEK / DAY / PURPOSE / CATEGORY / EXERCISE / SETS / REPS / WEIGHT USED or SCORE / EFFORT / HOW IT FELT? / DONE? (his exact columns, OBSERVED 'JUSTICE LEAGUE' row 2), plus VIDEO and NOTES columns.

**Tracking and adaptation.** Tracking is natural in a sheet. Adapting is not: next week would need either a script inside the sheet (Apps Script running the engine with broad permissions, which brings scary consent screens) or the user coming back to a website to paste results (which is Option B anyway).

**How it matches your words.** Covers "maybe a Google Sheet" (GEN-03) and the dropdowns (GEN-04). Weak on "something easy for phone view" (spreadsheets are hard to use on phones), on the whole-thing Spanish switch (a sheet is created in one language; switching means a new file), on videos (links only, no player) and on adaptation (GEN-05).

**Build effort, cost and time [INFERRED].** Engine 5-7 weeks plus 2-3 weeks for a simple intake page and the sheet design and generation (C1: 7-10 weeks); plus 1-2 weeks and a Google verification step for C2 (8-12 weeks). Running cost near zero.

**Risks.** Poor phone experience; Google API or policy changes; people editing formulas and breaking the sheet; no data for learning (it lives in each person's Drive).

**Verdict.** Excellent as an **export inside A / B** (C1, then C2 later); weak as the only product.

### 3.4 Option D · Open-source engine and model + Blaze Camp reference site

**One line.** Publish the engine code, the rule tables and the exercise tags publicly so any coach or developer can build on the model ("give away the repo ... to any coach and person that wants to create a training app", GEN-03), while the Blaze Camp site (Option A or B) stays the official, best version.

**What people see.** Users see the Blaze Camp site, unchanged. Coaches and developers see a public code repository with: the engine; the model data (rule tables, exercise catalog with all lenses, templates, plan shapes); the English and Spanish word lists; documentation of how to write a rule pack; the tests that prove the engine follows your rules; and a licence file and a trademark note.

**Tracking and adaptation.** Same as the site it is paired with.

**How it matches your words.** Directly answers the open-source idea in GEN-03 and opens a way for coaches to add rules (GEN-08) at a deeper level: a fork can change anything, but then it is no longer Blaze Camp (trademark, section 8).

**Build effort, cost and time [INFERRED].** About 1.5-2.5 developer-weeks on top of A or B (clean-up, documentation, licence, contribution guide, automated tests on every change), then roughly 2-4 hours a week answering issues and reviewing contributions. Hosting the code on GitHub is free.

**Risks.** Someone sells a copy (allowed under permissive licences; section 8 shows the choices); weak forks that give bad plans (mitigation: the trademark keeps them from using your name); a support load; private material leaking (mitigation: publish only the cleaned model, never the raw sheet dumps, client names or unpublished programs). Comparable open projects exist: Liftosaur (an open-source, offline-capable web app under AGPL-3.0 with its own progression scripting language) and wger (an open-source workout manager under AGPL-3.0 with an 800+ exercise database and an API). [RESEARCH]

**Verdict.** Not a delivery option on its own; a **distribution decision** to take once v1 is approved (Phase 3).

### 3.5 Considered and set aside

| Idea | Why not now |
|---|---|
| Native iPhone / Android app | You ruled it out (GEN-03). A home-screen web app gives most of the feel without app stores. |
| Running plans through an existing coaching platform (TrueCoach, TrainHeroic and similar) | They charge per coach by number of clients (TrueCoach about $26-137 a month; TrainHeroic from $9.99 a month, with a marketplace that takes $1 per athlete a month plus card fees) and cannot run your generator; plans would have to be re-typed. Worth revisiting only as a sales channel for finished programs; program-library apps such as Boostcamp (free library of coach programs with built-in progression rules; Pro $59.99 a year) are another such channel. [RESEARCH] |
| PDF only | The easiest to build, but no swaps after printing (GEN-04), no language switch after printing, videos only as links or QR codes, no adaptation (GEN-05). Kept as an export. |
| A chatbot that writes plans with AI | Plans would not be reproducible or checkable against your rules. AI is still useful behind the scenes: drafting Spanish translations and cue lines for you to correct. |

---

## 4. Side-by-side comparison

| Need (source) | A · Plan website | B · A + check-in | C · Sheet only | D · Open source (with A or B) |
|---|---|---|---|---|
| Easy on the phone (GEN-03) | Yes | Yes | Partly (sheets are hard on phones) | as paired site |
| PDF / screenshot (GEN-03) | Yes (image + PDF) | Yes | Partly (print from Sheets) | as paired site |
| Google Sheet (GEN-03) | Yes, as export | Yes, as export | Yes | as paired site |
| No full app (GEN-03) | Yes | Yes | Yes | Yes |
| Tracking optional (GEN-03) | Yes (no tracking) | Yes (three levels) | Tracking built in | as paired site |
| Adjust week to week from EFFORT / HOW IT FELT (GEN-05) | No | Yes | Only with scripts | as paired site |
| Step chosen by the person's state (VOL-05) | No (planned rise only) | Yes | No | as paired site |
| Full Spanish switch (GEN-01) | Yes | Yes | Partly (new file per language) | Yes (word lists published) |
| Default + dropdown swaps (GEN-04) | Yes | Yes | Yes | Yes |
| Video for every exercise (GEN-06) | Yes (player) | Yes (player) | Links only | Yes |
| Coaches add rules (GEN-08) | Yes (rule pack) | Yes | Hard | Yes, and deeper (fork) |
| Data to learn from later (VOL-01) | No | Yes, with consent (v2) | No | Yes, contributions |
| Week-by-week and yearly modes (PER-01) | Yearly view only | Both | Awkward | as paired site |
| Privacy by default | High (nothing stored) | High (on the phone until v2) | High (user's Drive) | as paired site |
| Build effort (developer-weeks, INFERRED) | 10-14 | 13-19 | 7-10 (C1) / 8-12 (C2) | +1.5-2.5 |
| Running cost (RESEARCH, INFERRED) | ~$10-20 / year | same until v2; then ~$0-50 / month | ~$0 | ~$0 + your time |
| Main risk | No adaptation | Check-in ignored; data on one phone | Phone experience | Support load, copies |

---

## 5. Recommendation [PROPOSED]

**Choose Option B, built in phases starting from Option A; offer Option C as downloads inside it; release Option D once you have approved v1.**

Why:

1. It is the only option that honours both of your answers on tracking: nobody is forced to track (GEN-03), and the plan still adjusts week to week from effort and how it felt (GEN-05).
2. It is the only option that can choose 3 %, 5 % or 7 % by the person's state (VOL-05), because it is the only one that asks about the person's week.
3. It is the only path to the learning system you described (VOL-01, VOL-02): check-ins are the outcome data, shared only by people who say yes.
4. It is phone-first and app-like without being an app (GEN-03), Spanish throughout (GEN-01), and costs almost nothing to run until accounts are added.
5. Building A first gets a usable product to your clients sooner, and nothing in A is thrown away when B is added.
6. Your Google Sheet idea survives as a download with your exact columns, and the open-source idea is kept for when the model is approved (so forks start from a model you have signed off).

---

## 6. Roadmap (MVP → v2) [PROPOSED; durations INFERRED for one experienced developer, full time]

| Phase | What ships | Your part | Done when | Rough time |
|---|---|---|---|---|
| **0 · Freeze the model** | Model v1 with all 138 answers folded in; the runtime model files (section E3); a test suite of your hard rules; 5 sample plans generated for sample clients (beginner fat loss, intermediate aesthetics, off-season basketball, boxer, home dumbbell client). | Grade the 5 plans (N-OUT-12); approve the check-in table (N-PROD-02); pick plan names (N-PROD-10). | You sign off the 5 plans. | 2-3 weeks (team), ~5 hours of yours |
| **1 · MVP: plan website (Option A)** | Intake (with GEN-02 changes), plan overview, day view, swaps, cues, videos where they exist, instruction block, plan types 4-6 / 8 / 12 weeks, tests checkboxes, save-day-as-image, print / PDF, Excel / Google Sheets download, share link, EN / ES, lb / kg. No accounts. Page-view counts only (no personal data). | Film the first 85 videos; check the Spanish; write or approve cue lines. | 20-50 of your clients use it for 4 weeks and send feedback through a short form. | 10-14 developer-weeks (about 2.5-3.5 months) |
| **1.1 · Check-in (Option B)** | Weekly check-in and adaptation, logbook with your columns, progress screen, week-by-week mode, year view, test reminders, home-screen install and offline use, backup code, core-block and variety settings. | Review the first month of adjustments with real clients (are the steps right?). | Most active users check in; you agree with the changes it makes. | +3.5-5 developer-weeks (about 1-1.5 months) |
| **2 · Coaches, accounts, open source** | Optional accounts and sync; coach mode (build for clients, edit any slot, rule packs, see client check-ins, pain alerts); Google Sheets straight into Drive (C2); consented research data (section 7.5) after a lawyer's review; open-source release (Option D). | Decide licences (N-PROD-05); approve the consent wording; decide whether coach mode is free or paid (N-PROD-09). | First outside coaches use rule packs; first consented data arrives. | 8-12 developer-weeks + legal review |
| **3 · Learning** | Dashboards for you (which exercises get swapped most, where pain is reported, how effort moves through a 12-week plan, who drops off when); then careful tuning of starting sets, steps and landmarks, each change approved by you and released as a new model version. | Approve or reject each suggested change. | Changes are backed by enough data and by you. | ongoing |

The Spanish switch, the video player and the coach rule layer are built into the MVP's foundations (word lists, video map, rule layers) even where their screens arrive later, so nothing has to be rebuilt.

---

## 7. How it is built (plain language)

### 7.1 Four parts

```
  MODEL (data files, versioned)          ENGINE (code)                    RENDERERS (code)
  +------------------------------+      +----------------------------+   +---------------------------+
  | rule tables (JSON)           |----->| build plan from answers    |-->| phone view (web app)      |
  | exercise catalog (JSON)      |      | adjust from check-ins      |   | day image, print / PDF    |
  | templates and plan shapes    |      | explain each choice        |   | Excel / Google Sheets     |
  | coach rule packs (JSON)      |      | check the plan vs rules    |   | share link, calendar      |
  | video map (JSON)             |      +----------------------------+   +---------------------------+
  | words: English / Spanish     |-------------------------------------------------^  (every word on screen)
  +------------------------------+
```

1. **The model is data, not code.** Your rules (sets per level, the 3 / 5 / 7 % steps, pairings, order, swaps, the pain rule) live in tables that the engine reads. Changing a number means editing a table, not rewriting the program. These tables are compiled from the team's files (`generator_spec_v0.json` rule tables, `02_exercise_catalog.json`, `05_templates.json`, `06_periodization.json`, `04_profiles.json`, `10_equipment_model.json`, `03_volume_rules.json`) after your answers are applied. Every plan records which model version built it.
2. **The engine** is the program that turns answers into a plan, adjusts it from check-ins, explains each choice ("why this exercise?") and checks the plan against your hard rules before showing it.
3. **The word lists (English and Spanish)** hold every word the user sees: screens, exercise names, cues, your instruction lines, effort labels, check-in questions, explanations. The plan itself stores only codes, so switching language re-draws the same plan in the other language instantly.
4. **The renderers** draw the plan: the phone view, the day image, the printed week, the spreadsheet, the share link and calendar file. A new output later (for example a coach's branded PDF) is a new renderer, nothing else changes.

### 7.2 How a coach adds rules (GEN-08) [PROPOSED]

**Four layers, applied in this order:**

| Layer | Who owns it | Can it be changed? | Examples |
|---|---|---|---|
| 1 · Locked Blaze Camp rules | you | No (only in a fork of the open-source code, which is then not Blaze Camp) | never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped (GEN-08); no bands or variable resistance for now (EQ-01, EQ-12); athletic sets never count toward muscle sets (VOL-10) |
| 2 · Blaze Camp defaults | you | Yes, by a coach's rule pack | starting sets by level (VOL-01); helpers count 0.25 (VOL-09); a loaded squat once a week, the other knee-dominant day leg press or belt squat, deadlifts counted as spinal loading too (PER-04); 3 calf sets per leg day (VOL-17); session lengths (UNI-09) |
| 3 · Coach rule pack | the coach using the tool | Yes | "My youth clients under 15 do no Olympic lifts from the floor"; "Tennis players: lower body 85 % unilateral"; "Always put Hip Thrust Machine first on glute-focus days"; "Never program Bulgarian split squats for client X" |
| 4 · Client preferences | the client | Yes, within the layers above | swaps in the dropdown (EQ-10), core block position (ATH-11), variety on / off (PER-03), optional days separate or added on (ORD-10) |

**How a coach writes a rule.** A form, no code: **When** [conditions picked from lists: goal, sport, position, season, level, age range, pain area, equipment, day type, week of plan] **then** [one action picked from a list: exclude an exercise / equipment / tag; prefer an exercise in a slot; set the unilateral share; set a muscle's weekly set range; cap the weekly step; add or remove a slot; move a block in the order; add a note to the plan]. Before saving, the coach sees the effect on 3 sample clients ("this rule changes 4 exercises in week 1"). Conflicting rules are flagged; a locked rule always wins.

**Where rules are kept.** A rule pack is a small file the coach can download, re-upload and share with other coaches (works without accounts in the MVP and v1.1); in v2 it is saved in the coach's account. Coaches can also add their own exercises, but only with all the tags (family, pattern, laterality, plane, muscles, equipment, level; CAT-01), otherwise the engine cannot place them, and with their own video link.

### 7.3 How videos are attached (GEN-06) [PROPOSED]

**The video map.** Each exercise in the catalog has one video entry: where it is hosted, the video ID, start and end seconds (so one long video can serve several exercises), who recorded it, and its status: *your video*, *approved public video*, or *missing*. The app shows your video if there is one, otherwise an approved public video if you have approved one, otherwise the text cue with "Video coming soon". A "missing videos" list for you is generated automatically.

**The format.** Silent clips of 10-30 seconds, front or 45-degree angle, 2-3 clean reps, filmed in landscape and portrait-safe framing. Silent clips work in both languages; the spoken coaching lives in the cue text, which switches language. One clip per exercise; variations that look the same share a clip with a different cue.

**Hosting.** Unlisted YouTube videos cost nothing and can be embedded with YouTube's privacy-enhanced mode (`youtube-nocookie.com`), which holds back cookies until the viewer presses play, though it still contacts Google [RESEARCH]. YouTube shows its branding and suggestions at the end; paid video hosts avoid that and can be added later without changing anything else (only the video map changes). Public-domain exercise datasets exist (for example free-exercise-db: 800+ exercises in JSON with images, released under the Unlicense) and could fill picture gaps, but their names and technique are not yours; not recommended for default exercises [RESEARCH; recommendation PROPOSED].

**The backlog (OBSERVED, computed from `02_exercise_catalog.json` `video_urls`, after removing the exercises you dropped and band variants).** About 350 live library exercises; about 79 have one of your links (about 23 %; file 08 quoted 81 of 322 selectable before the latest clean-up); **237 non-cardio exercises have no video**, and **85 of those appear in your own programs** (for example the staggered-stance deadlift, barbell bench press, leg press, pull-up, alternating incline DB bench press, machine leg curl, standing DB calf raise, Tate press, incline barbell bench, DB upright row, cable fly, DB hammer curl). **Film those 85 first**; they cover most default picks. Rough time [INFERRED]: batch filming at 2-3 minutes per exercise means the 85 take one 3-4 hour session; the full backlog takes 3-4 sessions plus about 10 minutes each to trim, upload and label.

### 7.4 The Spanish switch (GEN-01) [PROPOSED]

* Every word comes from the word lists; nothing is typed into the plan in one language.
* Volume [INFERRED]: about 400-600 screen phrases, about 350-590 exercise names, one cue line per exercise, your instruction block, the effort and feeling labels, the check-in, the explanations.
* Workflow: an AI draft, then you (or a fluent coach you trust) approve each line. A missing Spanish line falls back to English and is listed for review, so the site never breaks.
* Exercise names: show the Spanish name with the common gym term underneath where gyms use the English word (for example "Empuje de cadera (Hip Thrust)"). Question N-PROD-06 asks which Spanish (neutral Latin American is the usual choice) and how to treat gym terms.
* Units are a separate switch (lb / kg), set from the phone's region and changeable (N-OUT-10).

### 7.5 What data to collect (with consent) so the engine can learn later [PROPOSED; switched on only in v2 after legal review]

**Principle.** Collect nothing by default. Ask adults, separately and plainly, whether they want to share their anonymous plan and weekly check-ins to improve Blaze Camp. No bundled "I agree to everything" box.

| Tier | What | Consent | Used to learn |
|---|---|---|---|
| 0 · Site counts | Page views, which export button was used, errors. No answers, no cookies. | Not needed (no personal data) | Which outputs people use; where the intake loses people |
| 1 · Anonymous training data (opt-in, adults) | A random ID; age band (for example 25-34), body-weight band, experience band, goal, sport / position / season, level, days, session length, equipment profile, plan type; each week: sessions done, effort per session, HOW IT FELT? per exercise, pain area (body region only, no free text), swaps chosen, steps the engine took; test results if entered. No name, email, exact age or birth date. | Explicit, separate, unticked box; list of exactly what is shared; can be withdrawn and deleted with the backup code | Whether starting sets per level (VOL-01: 10-12 / 15-20 / 20+) fit real responses; which check-in answers should map to 3 / 5 / 7 %; which default exercises get swapped or cause pain; how effort moves through 8- and 12-week shapes; drop-off points |
| 2 · Account data (v2) | The same plus account details and full logs, visible to the person and to a coach they connect | Separate consent for the account and for coach access | Coach features; long-term progress |

**How learning would work (Phase 3).** First, plain dashboards for you. Then small, explainable adjustments to a few numbers (starting sets, step thresholds, landmark ranges), each proposed with the data behind it, approved or rejected by you, and released as a new model version with a change log. Locked rules are never changed by data.

**Legal checkpoints (not legal advice; get a lawyer's review before collecting anything).** Pain, injury and training data count as health data in several places: the EU's GDPR treats health data as a special category that needs explicit, specific consent; Washington State's My Health My Data Act requires separate consent to collect and to share consumer health data, and covers fitness apps; the US FTC's Health Breach Notification Rule (updated 2024) covers health and fitness apps that hold identifiable health information; the amended COPPA rule (compliance by April 2026) requires verifiable parental consent before collecting personal information from children under 13. [RESEARCH] Simplest safe design: research data only from adults (18+); youth plans are built and kept on the phone only.

### 7.6 Safety guardrails in the product

* The safety check (09 F01, F36 "severe", F37 diagnosed or in rehab) stops the automatic plan and points the person to a professional or a coach (pending N-IN-04).
* A short "not medical advice" line on the landing page, in the plan header and in every export.
* Repeated pain in check-ins → "see a professional" message (and a coach alert in v2).
* Youth: athletic plans allowed (ATH-09, ATH-13), but no data leaves the phone.
* Plans for older clients and anyone in pain lean on machines and never include overhead squats, snatches, low-bar squats or depth jumps (EQ-03); the engine's checks enforce it before a plan is shown.

---

## 8. Open-source choices (Option D) [PROPOSED]

**What there is to share, and what each licence means.**

| Piece | Generous (anyone may use, even commercially; must credit you) | Share-alike (anyone may use, but must share their changes under the same terms) | Keep closed |
|---|---|---|---|
| Engine code | MIT or Apache-2.0 (Apache adds an explicit patent grant) | AGPL-3.0 (anyone running a modified version as a website must publish their changes; Liftosaur and wger chose this) | private repository |
| Model data (rule tables, exercise tags, templates) | CC BY 4.0 (credit "based on the Blaze Camp model") | CC BY-SA 4.0 (improvements to the model must stay open) | private |
| Your videos, cue lines in your voice, your written explanations | (not recommended) | (not recommended) | All rights reserved; free to watch and link |
| The name and logo "Blaze Camp" | n/a | n/a | trademark: forks must rename; they may say "based on the Blaze Camp model" |
| Raw sheet dumps, client names, unpublished programs | never published | never published | never published |

[RESEARCH: licence terms from choosealicense.com; Creative Commons 4.0 covers databases and recommends against NonCommercial terms for open data; open-source licences do not grant trademark rights, which is why forks of trademarked projects rename (Hudson → Jenkins).]

**Recommended default [PROPOSED]:** engine **Apache-2.0**, model data **CC BY 4.0**, videos and cues **all rights reserved**, the **name protected** with a short trademark note. This matches "give away the repo ... to any coach and person that wants to create a training app" (GEN-03): coaches and companies can build on it, everyone must credit you, and nobody can call their version Blaze Camp. If you would rather force anyone who improves the model to share it back, switch the model data to CC BY-SA 4.0 and the code to AGPL-3.0 (it will put off some commercial builders). **When:** after Phase 0 (you approved the sample plans) and Phase 1 (real users), so the public version starts from a model you have signed off.

---

## 9. Cost, effort and time [INFERRED unless marked]

**Developer time (one experienced developer, full time; part-time or with an AI coding assistant, expect 1.3-2 times the calendar time).**

| Piece | Developer-weeks | Needed by |
|---|---|---|
| Engine (rule tables → plan, adaptation, explanations, checks) and its tests | 5-7 | all options |
| Intake screens, plan and day views, swaps, cues, video player | 2.5-3.5 | A, B |
| Day image, print / PDF, share link, calendar | 1-1.5 | A, B |
| Excel / Google Sheets download (C1) | 0.5-1 | A, B, C |
| Google Drive creation with sign-in (C2) + verification | 1-2 | v2, or C |
| Word lists and language switch (plumbing, not translation) | 0.5-1 | all |
| Check-in, adaptation screens, logbook, progress | 2.5-3.5 | B |
| Offline, home-screen install, backup code | 1-1.5 | B |
| Open-source preparation | 1.5-2.5 | D |
| Accounts, coach mode, consented data (v2) | 8-12 | v2 |

**Totals.** A: about 10-14 weeks. B: about 13-19 weeks (A + 3.5-5). C alone: 7-10 weeks (C1) or 8-12 (C2). D: +1.5-2.5 weeks and 2-4 hours a week after release. v2: +8-12 weeks plus legal review. If a contractor builds it, cost ≈ developer-weeks × 40 hours × hourly rate (for example 12 weeks × 40 h × $60 = $28,800); rates vary widely by country and experience.

**Running costs (RESEARCH for prices; INFERRED totals).**

| Item | MVP and v1.1 | v2 |
|---|---|---|
| Domain name | ~$10-20 a year | same |
| Hosting (static site) | $0 (Cloudflare Pages free: unlimited bandwidth, 500 builds a month) | $0 |
| Video hosting | $0 (unlisted YouTube) | $0, or a paid host if wanted |
| Database and accounts | none | Supabase free tier, then Pro at $25 a month |
| Email (account links, coach invites) | none | $0-20 a month on small volumes |
| Legal review of privacy terms and consent | not needed (no data collected) | one-off; get quotes |
| Google verification for Drive export | not needed (C1 download) | free, takes time |

**Your time.**

| Task | Rough time |
|---|---|
| Grade 5 sample plans | ~5 hours |
| Film the first 85 videos | one 3-4 hour session + uploads |
| Film the rest (~150) | 2-3 more sessions |
| Approve cue lines (AI-drafted from your notes) | ~350 one-liners; a few evenings |
| Approve Spanish | 2-4 days of review, spread out |
| Review check-in adjustments in the first month | ~1 hour a week |

---

## 10. Risks and mitigations

| Risk | Where | Mitigation |
|---|---|---|
| The engine misreads your style | all | Golden sample plans you graded become automatic tests; every plan shows "why" for each choice so errors are visible; model versions are stamped on plans. |
| Someone gets hurt following a plan | all | Safety check, pain rules (VOL-03), machine bias for older and injured clients (EQ-03), "see a professional" prompts, disclaimer; no maximal testing unless chosen (PER-07). |
| People ignore the check-in | B | The plan still works without it; the check-in is one screen; a reminder on the plan screen; no nagging notifications in the MVP. |
| Data lost on iPhones | B | Home-screen install (exempt from Safari's 7-day deletion), backup code, optional accounts in v2. |
| Spanish quality | all | You or a fluent coach approve every line; English fallback flagged; users can report a bad translation. |
| Videos missing for a long time | all | Text cues for every exercise from day one; film the 85 most-used first; a public list of what's missing. |
| Health-data law | v2 | No server data in MVP and v1.1; opt-in adults only; lawyer review before v2; data deletion by code or account. |
| Copies of the open-source version give bad plans | D | Trademark (they can't use your name); publish only after you approve the model; tests shipped with the code. |
| Scope creep into "an app" | all | Each phase has a fixed list and a "done when" test (section 6). |
| Unsettled training rules (for example the step table) | B | Every number is a table entry you can change; nothing is hard-coded. |

---

## 11. Decisions for you

| ID | Question | Our suggestion |
|---|---|---|
| N-PROD-01 | Go with Option B, built from Option A first, with the sheet as a download and open source after v1? | Yes (section 5). |
| N-PROD-02 | Is the check-in table in section 2.3 right? Especially: life "much harder" means hold, effort 9 with a normal week means hold, effort ≤ 6 means +7 %, effort 10 means hold and −1 set on that day. | As written; you can change any cell. |
| N-PROD-03 | PDF style: a day per phone screen (image button) plus one week per printed page? | Yes, both. |
| N-PROD-04 | Google Sheets: a download file now, straight into their Drive (Google sign-in) later? One tab per week, or all weeks stacked like 'JUSTICE LEAGUE' (N-OUT-05)? | Download now, Drive in v2; weeks stacked. |
| N-PROD-05 | Open source: when, and which licences? | After v1; Apache-2.0 code, CC BY 4.0 model, your videos and cues reserved, name protected. |
| N-PROD-06 | Spanish: neutral Latin American Spanish? Show English gym terms in brackets where gyms use them? Who approves the Spanish? | Yes; yes; you or a coach you trust. |
| N-PROD-07 | Videos: silent 10-30 s clips, your 85 most-used exercises first? Can we show approved public videos while yours are being filmed? | Yes; only ones you approve one by one. |
| N-PROD-08 | Learning data: ask adults (18+) only, opt-in, starting in v2 after a legal review? | Yes. |
| N-PROD-09 | Business model: is the site free for everyone? Is coach mode free or paid? Did 'NO ACCESS' (PRG-01) mean a self-serve version without coach access? | Free plan website; decide coach mode before v2. |
| N-PROD-10 | Plan names shown to users (FIX-03, ATH-13): for example "Athletic all-round, non-competitive", "Bootcamp (35-45 min circuits)", "Build muscle, 4 days", "Strength, 3 days". | Descriptive names in both languages. |
| N-PROD-11 | Your library has 8 core exercises with a knee band (OBSERVED, BYOP 'MASTER EXERCISE LIBRARY' BC11-BC49, for example 'Knee banded for adduction, half kneeling Pallof hold' in BC48). With "no bands" (EQ-01), do these go, or switch to squeezing a ball or pad between the knees? | Switch to a ball or pad squeeze, keep the exercise. |
| N-PROD-12 | Units: pounds by default in the US, kilograms elsewhere, switchable (N-OUT-10)? | Yes. |

---

## Appendix E · For the engineer

### E1 · Stack [PROPOSED]

* **Static single-page web app**, TypeScript, a small UI library (Preact or Svelte), built to static files. No server needed for the MVP and v1.1.
* **Hosting:** Cloudflare Pages (free plan: unlimited bandwidth, 500 builds a month; confirm current terms for a commercial site before launch). Avoid GitHub Pages for the product site (its terms say it is not meant for commercial / SaaS sites); it is fine for open-source docs. [RESEARCH]
* **PWA:** web app manifest + service worker caching the app shell, the compiled model and the word lists; videos stream online only. Request persistent storage (`navigator.storage.persist()`).
* **Storage:** IndexedDB through a thin wrapper; schema-versioned with migrations.
* **i18n:** i18next-style JSON namespaces (`ui`, `exercise_names`, `cues`, `explain`, `instructions`, `checkin`) with CLDR plurals; ICU only if needed. [RESEARCH]
* **Exports:** print CSS (`@media print`, one week per page, `break-after: page`) for paper PDF; DOM-to-PNG for "save day as image" at phone aspect ratio; ExcelJS (MIT) for .xlsx with data validation lists and conditional fills, lazy-loaded; `.ics` for calendar. Paid coaching platforms work the same way (TrueCoach prints programs through the browser's 'save as PDF'). Optional later: pdf-lib / jsPDF for a server-free, browser-consistent PDF. Server-side headless Chrome (Puppeteer) gives the most faithful PDFs but needs a server; not needed. [RESEARCH]
* **Google Drive export (v2, C2):** Google Identity Services token flow + Sheets API `spreadsheets.create` and `batchUpdate` with the `drive.file` scope only (non-sensitive, basic verification). [RESEARCH]
* **v2 backend:** Supabase (Postgres + auth + row-level security) or equivalent; research data in a separate schema keyed by random IDs, never joined to account tables.
* **Rule evaluation:** a small in-house evaluator over a fixed action vocabulary (preferred: deterministic, typed, no `eval`), or json-rules-engine (JSON conditions / events, isomorphic, no `eval`, ~17 kB gzipped) if a general engine is wanted. [RESEARCH]

### E2 · Repository layout [PROPOSED]

```
blaze-camp/
  model/                      # source model (from synthesis/, coach answers applied) - CC BY 4.0 if opened
    rule_tables/*.json        # counting, weekly_sets, steps, session_budget, reps, effort, rest, bilateral_unilateral,
                              # athletic, conditioning, pain, ordering, pairing, plan_shapes, deload, validation
    catalog/exercises.json    # runtime fields only; provenance stays in synthesis/
    catalog/videos.json       # video map
    templates/*.json          # week layouts, slot grammars
    profiles/*.json           # sports / goals
    i18n/en/*.json, i18n/es/*.json
    rule_packs/examples/*.json
    MODEL_VERSION             # semver; bumped on any rule change; CHANGELOG.md
  engine/                     # pure TypeScript, no DOM; runs in browser and Node
    generate.ts adapt.ts explain.ts validate.ts rules/ (evaluator, actions) rng.ts
  app/                        # UI + renderers
    screens/ renderers/{phone,image,print,xlsx,gsheets,ics,share}/ storage/ i18n/
  tools/compile-model/        # synthesis JSON -> model/ (strip provenance, apply coach corrections, validate)
  tests/
    golden/                   # coach-graded intakes + expected plans (snapshot)
    invariants/               # property tests (E10)
  LICENSE (Apache-2.0)  LICENSE-MODEL (CC BY 4.0)  TRADEMARK.md  CONTRIBUTING.md
```

### E3 · Runtime model compile step

* Input: `generator_spec_v0.json` (74 kB) plus the synthesis JSON files (catalog 6.9 MB; equipment model 2.1 MB; templates, profiles, periodization, volume rules, training variables 160-310 kB each). OBSERVED sizes.
* Output: a runtime bundle that keeps only what the engine reads. A slim catalog of the 586 live-library and program exercises with runtime fields (id, name key, family, pattern, category, taxonomy node, laterality, plane, muscles, size class, exercise class, volume counting, equipment, load ceiling, skill, impact, rep range, slots, coach preference, level, video key) measured 1.3 MB raw / **80 kB gzipped** (OBSERVED, computed). Target for the whole runtime model: under ~300 kB gzipped [INFERRED].
* The compile step applies the coach's corrections as data patches with their IDs, for example: remove 'Camporini Deadlift' and 'strap rotating in/out' (LIB-09); rename 'Pull under' → lat pull-over (LIB-09); add "Squat" to full Snatch / Clean / Clean & Jerk (LIB-07); exclude band, banded, reverse-banded and chain variants and band substitutes (EQ-01, EQ-07, EQ-08, EQ-12); helper credit 0.25 and dips 0.5 / 0.5 (VOL-09, LIB-16); unilateral 10/10 = 1 set to the primary muscle (UNI-01); athletic patterns never count to muscles (VOL-10); spelling fixes (FIX-04). Each patch is logged; the compile fails if a patch target is missing.
* Every compiled bundle carries `model_version`; plans store it, and the app keeps old model versions available so a saved plan always re-generates identically.

### E4 · Data contracts (abridged)

**Intake** (from `09_generator_inputs.md`, with GEN-02 / PER-01 / PER-07 / ATH-11 / ORD-10 / PER-03 changes):

```json
{
  "schema": "intake/1",
  "lang": "es", "units": "kg",
  "safety": {"heart": false, "recent_surgery": false, "pregnancy_postpartum": false, "injury_in_treatment": false, "doctor_said_no": false},
  "age": 34, "body_weight": {"value": 82, "unit": "kg"},
  "goal": "athlete", "focus_muscles": [], "lift_style": "balanced",
  "sport": {"competitive": true, "sport": "tennis", "position": null, "season": {"type": "next_season_start", "date": "2027-03-01"}},
  "experience": {"years_consistent": 4, "months_off_last_year": 0, "former_competitor": false},
  "schedule": {"days_per_week": 4, "weekdays": ["Mon","Tue","Thu","Fri"], "session_minutes": 90, "start_date": "2026-10-12"},
  "plan": {"mode": "fixed_12", "previous_blaze_12wk_completed": 0, "tests": ["strength","speed"]},
  "equipment": {"profile": "FULL_GYM", "extra": ["medball","plyo_box","hurdles"], "machines": ["leg_press","belt_squat","leg_curl_seated","cable"]},
  "pain": [{"area": "shoulder", "side": "right", "severity": "mild", "worse_with": ["overhead"]}],
  "prefs": {"core_position": "start", "optional_days": "separate", "variety_ab": false, "exclusions": []},
  "coach_rule_pack_ids": []
}
```

`plan.mode` ∈ `maintenance_4_6` | `fixed_8` | `fixed_12` | `week_by_week` | `year` (PER-01). No `sex` field (GEN-02).

**Plan** (codes only; all words resolved by the renderer through the word lists):

```json
{
  "schema": "plan/1", "model_version": "1.0.0", "engine_version": "1.0.0", "seed": "a91f…",
  "intake_hash": "sha256:…", "level": {"client": "L2", "reason_keys": ["exp_4y", "no_layoff"]},
  "shape": {"key": "ATHLETE_OFF_12", "phases": [{"weeks": [1,3], "label_key": "phase.acclimate"}, {"weeks": [4,8], "label_key": "phase.drive"}, {"weeks": [9,12], "label_key": "phase.hardest"}], "test_week": 12},
  "weeks": [{
    "n": 1, "kind": "build",
    "summary": {"sets_by_muscle": {"quads": 12, "hamstrings": 10}, "contacts": {"high": 40, "low": 60}, "throws": 30, "aerobic_sessions": 2},
    "days": [{
      "weekday": "Mon", "day_type": "A", "est_minutes": 85,
      "blocks": [{
        "tier": "core", "movable": true,
        "items": [{
          "slot_id": "A.core.1", "purpose_key": "purpose.core", "category": "CT.THORAX.STATIC",
          "exercise_id": "dead-bug", "alternatives": ["bird-dog", "hollow-hold"],
          "sets": [{"reps": {"type": "per_side", "value": 10}}, {"reps": {"type": "per_side", "value": 10}}],
          "effort": {"rir": [1, 2]}, "rest_s": [60, 90], "superset": null,
          "cue_key": "cue.dead-bug", "video_key": "dead-bug",
          "credits": {"core": 1.0}, "why_keys": ["why.core_first"]
        }]
      }]
    }]
  }],
  "checks": [{"id": "GEN-08.power_before_strength", "pass": true}]
}
```

IDs, category codes and numbers in these examples are illustrative, not real catalog values. Reps are structured per set so the renderer can show pyramids exactly as the coach writes them: `12/10/8 -20` = four sets with load hints mid / heavier / heaviest / light (PRG-07); `10/10` = per side (PRG-07, UNI-01); seconds, metres, contacts, calories and rounds are reps types too (N-OUT-01).

**Check-in:**

```json
{"schema": "checkin/1", "week": 5, "submitted": "2026-11-15",
 "sessions_done": {"Mon": true, "Tue": true, "Thu": false, "Fri": true},
 "effort": {"Mon": 8, "Tue": 9, "Fri": 7},
 "felt": [{"slot_id": "B.push.1", "value": "pain"}, {"slot_id": "A.knee.2", "value": "wrong_muscle"}],
 "pain_now": [{"area": "shoulder", "trend": "same"}],
 "life": "harder", "results": [{"exercise_id": "trap-bar-deadlift", "kg": 140, "reps": 5}]}
```

**Rule pack** (coach layer; one action per rule):

```json
{"schema": "rulepack/1", "id": "coach-jdoe-2026-11", "author": "Coach J. Doe", "model_min": "1.0.0",
 "rules": [
  {"id": "youth-no-floor-oly", "when": {"all": [{"fact": "age", "op": "lt", "value": 15}]},
   "then": {"action": "exclude_tag", "tag": "olympic_from_floor"},
   "note_key": "rule.youth_no_floor_oly"},
  {"id": "tennis-unilateral", "when": {"all": [{"fact": "sport.sport", "op": "eq", "value": "tennis"}]},
   "then": {"action": "set_unilateral_share", "region": "lower", "value": 0.85}},
  {"id": "cap-step-older", "when": {"all": [{"fact": "age", "op": "gte", "value": 60}]},
   "then": {"action": "cap_weekly_step", "max_pct": 3}}
 ]}
```

Action vocabulary (closed list): `exclude_exercise`, `exclude_tag`, `exclude_equipment`, `prefer_exercise_in_slot`, `set_unilateral_share`, `set_muscle_weekly_range`, `cap_weekly_step`, `fix_weekly_step`, `add_slot`, `remove_slot`, `move_block`, `set_rest`, `set_rep_range`, `add_note`. Facts: intake fields, derived values D1-D20 (09 section 2), `week.n`, `week.phase`, `day.type`, `slot.category`, `exercise.tags`.

**Video map entry:** `{"exercise_id": "leg-press", "provider": "youtube", "id": "<VIDEO_ID>", "start": 12, "end": 34, "status": "coach", "recorded_by": "blaze", "lang": "none"}`.

**Consent record (v2):** `{"subject_id": "random-uuid", "scope": "research_tier1", "text_version": "consent-es-1.0", "given_at": "…", "withdrawn_at": null, "age_attested_18_plus": true}`.

### E5 · Engine API and determinism

* `generate(intake, model, rulePacks, opts) → Plan` · `adapt(plan, checkins[], model, rulePacks) → Plan` (re-runs generation from the intake and applies all check-ins in order, so the same inputs always give the same plan) · `explain(plan, slot_id) → reason keys` · `validate(plan) → checks[]` (09 V1-V16 plus the invariants in E10).
* Pure functions; seeded random only for tie-breaks (`seed` = hash of intake + model version); no clock reads inside the engine (dates come from the intake).
* Rule precedence: locked > coach rule pack > Blaze defaults > client preference (client swaps cannot re-introduce an exercise a coach or locked rule excluded). Conflicts inside one layer: the more specific `when` wins; equal specificity → the rule listed later wins, and the coach UI flags it.
* Performance target: a 12-week plan in under 200 ms on a mid-range phone [INFERRED]; run in a Web Worker so the UI never freezes.

### E6 · Weekly step implementation (section 2.3)

```
step = STEP_TABLE[effort_band(avg_effort)][life]           # +7 / +5 / +3 / 0 (%), table in rule_tables/steps.json
if sessions_done < 0.5 * planned: step = 0
if any_effort_10: step = 0; for each day rated 10: sets -= 1 on the slot rated 10 (logbook) else on the last-added set of that day
step = min(step, PHASE_CAP[shape.phase(week)], COACH_CAP)  # acclimation cap; maintenance = 0; in-season = 0
step = min(step, 7)                                        # UNI-05 hard ceiling
for muscle: bank[m] += target[m] * step; add floor(bank[m]) sets in VOL-07 order; bank[m] -= added
early_deload if (two consecutive holds from effort 9-10) or (pain on >= 2 slots this week)   # PER-05 dose
```

HOW IT FELT? handling per section 2.3 table. All thresholds live in `rule_tables/steps.json` and are coach-editable.

### E7 · Renderers

* **Phone view:** one component per block tier; superset pairs grouped and labelled with his 'SUPERSET W/' wording (arrow emoji in his label not reproduced here); effort as RIR text plus his EFFORT scale in the logbook; rest; cue; video button (lazy iframe on tap; `youtube-nocookie.com`).
* **Day image:** fixed 9:19.5 canvas; one day per image; language and units baked in at export time.
* **Print / PDF:** one week per page (Letter / A4 auto by locale); QR code per exercise linking to its video; instruction block on page 1; footer with model version and disclaimer.
* **XLSX (C1):** sheet `PLAN` with his columns WEEK / DAY / PURPOSE / CATEGORY / EXERCISE / SETS / REPS / WEIGHT USED or SCORE / EFFORT / HOW IT FELT? / DONE? + VIDEO + NOTES; a hidden `LISTS` sheet for dropdown sources (per-category alternatives, EFFORT, HOW IT FELT?, DONE? yes/no); day colours as in his sheets (N-OUT-06 pending). Spike: confirm dropdowns and fills survive Google Sheets import.
* **Google Sheets (C2, v2):** same layout via `batchUpdate` (data validation rules, checkboxes for DONE?, protected header rows).
* **Share link:** `#plan=` + compressed plan JSON with personal fields removed (no age, weight, pain, intake); for long plans, a short code stored server-side only in v2.
* **ICS:** one event per training day with the day title and a link back to the day view.

### E8 · Storage, backup code, sync

* IndexedDB stores `{intake, checkins[], swaps, logs, rulePacks, model_version}`; written after every change.
* Backup code = base64url(deflate(JSON)) using the browser's CompressionStream; typically 1-3 kB for a 12-week plan with check-ins [INFERRED]; offered as text, QR and a `.blazecamp.json` file. Never sent anywhere.
* v2 sync: the same document stored per account; last-writer-wins per check-in week; the coach view reads only clients who connected.

### E9 · i18n details

* Keys are stable IDs (`exercise.leg-press.name`, `cue.leg-press`, `why.hinge_with_push`, `checkin.life.harder`). The plan never stores text.
* Spanish exercise names carry an optional `gym_term` shown in brackets.
* CI check: every key present in `en` must exist in `es` or be listed in `es/_missing.json`; the build fails if a new English key has no entry in either.
* Number, date and unit formatting through `Intl`; lb / kg conversion at render time; loads stored in the user's unit as entered.

### E10 · Tests (golden plans + invariants from the coach's answers)

Golden: the 5 coach-graded plans (N-OUT-12) as snapshots; any diff needs review.

Invariants (property tests over thousands of random intakes):

| Invariant | Source |
|---|---|
| No band, chain or weight-releaser exercise, and no band substitute, appears anywhere | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12 |
| Weekly step never above 7 % for any muscle | UNI-05, VOL-05 |
| Helper credit 0.25; dips 0.5 triceps / 0.5 chest; 10/10 counts 1 set to the primary muscle; athletic sets credit no muscle | VOL-09, LIB-16, UNI-01, VOL-10 |
| Core block first unless the user moved it; never skipped | ATH-11, GEN-08 |
| Power / Olympic before strength; horizontal pull before vertical pull; the day's main lift ("the work") before accessories | ORD-03, ORD-01, ORD-02, GEN-08 |
| Hip dominant paired with push, knee dominant with pull (full body and bootcamp too) | UNI-11, ORD-06 |
| Spinal (axial) loading: a loaded squat once a week, the other knee-dominant day uses leg press, belt squat or another non-axial option; deadlifts count as spinal loading too (the exact weekly cap for deadlifts is owned by the session-architecture doc) | PER-04, EQ-11 |
| No V-squat; no heavy compound prescribed to failure | GEN-08 |
| Older, injured or high-volume clients: no overhead squat, snatch, low-bar squat or depth jumps | EQ-03 |
| No medball in the main work for aesthetics / bodybuilding goals (warm-up only); no medball above 20 lb | ATH-05, EQ-06 |
| Calves 3 sets on every leg day; rear delts get their own sets; about 2 core exercises a day | VOL-17 |
| Exercise count per session: resistance-only about 5-7; field athletes off-season up to 10-12 | VOL-08, VOL-16 |
| 4-6-week maintenance plans at about 50-70 % of normal volume; deload ≈ half the sets, lighter | PER-01, PER-05 |
| Added sets go to the first exercise of the muscle in session order first | VOL-07 |
| Same exercises inside a block; between blocks only small variables change | PER-02 |

### E11 · Analytics and learning pipeline (v2-v3)

* Tier 0: cookieless page analytics (no intake fields).
* Tier 1 events (opt-in only): `plan_generated` (banded intake, model_version), `checkin_submitted` (the check-in minus free text), `swap_chosen`, `deload_triggered`, `test_result`. Random subject ID; no IP storage; retention limit (for example 3 years) and deletion by backup code or account.
* Analysis: weekly cohort tables; later, simple hierarchical models per segment (level × goal) for starting sets and step thresholds; outputs are proposals in a review queue for the coach; an approved change bumps `model_version` and the CHANGELOG.

### E12 · Build estimate breakdown (developer-weeks, INFERRED)

| Work package | Low | High |
|---|---|---|
| Model compile tool + coach-answer patches + schema validation | 1 | 1.5 |
| Engine: level, shape, week layout, slots, sets allocation, exercise choice, reps / effort / rest, order, progression, deload, checks | 3.5 | 4.5 |
| Engine tests: golden + invariants | 0.5 | 1 |
| Intake screens (with branching) | 1 | 1.5 |
| Plan overview, day view, exercise sheet, swaps, video player | 1.5 | 2 |
| Day image, print CSS, share link, ICS | 1 | 1.5 |
| XLSX export + Google Sheets import spike | 0.5 | 1 |
| i18n plumbing, unit switch | 0.5 | 1 |
| **Option A total** | **9.5** | **14** |
| Check-in + adapt + "what changes" screen | 1.5 | 2 |
| Logbook + progress | 1 | 1.5 |
| PWA offline, install prompts, backup code | 1 | 1.5 |
| **Option B increment** | **3.5** | **5** |
| Open-source prep (docs, licences, CI, contribution guide, rule-pack docs) | 1.5 | 2.5 |
| v2: accounts, sync, coach mode, rule-pack editor UI, consent and research pipeline, Drive export | 8 | 12 |

(The main text rounds these: A about 10-14 weeks, B about 13-19 weeks.)

---

## References

**Coach and team sources.** `coach_answers_full.md` (GEN-01 to GEN-08, PER-01, PER-03, PER-05 to PER-07, VOL-01 to VOL-10, VOL-13, VOL-17, UNI-01, UNI-05, UNI-08 to UNI-11, ATH-05, ATH-09, ATH-11, ATH-13, ORD-01 to ORD-06, ORD-10, EQ-01, EQ-03, EQ-06 to EQ-08, EQ-10, EQ-12, EQ-14, LIB-07, LIB-09, LIB-16, PRG-01, PRG-05, PRG-07, PRG-08, FIX-03, FIX-04); `coach_answers.md`; `BLAZE_CAMP_BRAIN.md` §3.5, §11.8, §13; `generator_spec_v0.json`; `09_generator_inputs.md`; `08_open_questions_for_coach.md` §2.7 (N-OUT-01 to N-OUT-13); `02_exercise_catalog.json` (video counts, computed 2026-10-08); BYOP dump `04_JUSTICE_LEAGUE.columns.txt` (row 2 column headers).

**SCIENCE.**
1. Saw AE, Main LC, Gastin PB (2016). Monitoring the athlete training response: subjective self-reported measures trump commonly used objective measures: a systematic review. *British Journal of Sports Medicine* 50(5):281-291. https://dro.deakin.edu.au/articles/journal_contribution/Monitoring_the_athlete_training_response_Subjective_self-reported_measures_trump_commonly_used_objective_measures_A_systematic_review/20899435
2. Foster C, et al. (2001). A new approach to monitoring exercise training. *Journal of Strength and Conditioning Research* 15(1):109-115. https://paulogentil.com/pdf/A%20New%20Approach%20to%20Monitoring%20Exercise%20Training.pdf
3. Graham T, Cleather DJ (2021). Autoregulation by "repetitions in reserve" leads to greater improvements in strength over a 12-week training program than fixed loading. *Journal of Strength and Conditioning Research* 35(9):2451-2456. https://consensus.app/papers/details/212e6b63eb3d51a0bbef6438e4b931a7/
4. Zhang X, et al. (2021). Auto-regulation method vs. fixed-loading method in maximum strength training for athletes: a systematic review and meta-analysis. *Frontiers in Physiology*. https://consensus.app/papers/details/c076828ab8f551c3b19a805b31fc7e76/
5. Hickmott LM, et al. (2022). The effect of load and volume autoregulation on muscular strength and hypertrophy: a systematic review and meta-analysis. *Sports Medicine - Open*. https://consensus.app/papers/details/0e6bb3b98d875b1392222cf931190cb8/
6. Helms ER, et al. (2020). Methods for regulating and monitoring resistance training. *Journal of Human Kinetics*. https://consensus.app/papers/details/4250e509fa9f5444a814e328eee94373/
7. Michie S, et al. (2009). Effective techniques in healthy eating and physical activity interventions: a meta-regression. *Health Psychology* 28(6):690-701. https://consensus.app/papers/details/54020d3f4060526cb5b03286d506b12f/
8. Eckerstorfer LV, et al. (2018). Key elements of mHealth interventions to successfully increase physical activity: meta-regression. *JMIR mHealth and uHealth*. https://consensus.app/papers/details/4d3c2798b0a6514db2594881e7704c4a/

**RESEARCH (accessed 2026-10-08).**
* RP Hypertrophy app (feedback on pump, soreness, workload; pricing): https://rpstrength.com/hypertrophy-app
* JuggernautAI individualisation and readiness: https://help.jtsstrength.com/en/articles/3-how-juggernautai-is-individualized-to-you ; https://garagegymreviews.com/juggernautai-review
* Volt Athletics (Cortex, sport and position programs, coach platform): https://voltathletics.com/training-app ; https://voltathletics.com/coach-platform
* Fitbod (adaptation, pricing 2026): https://www.sensai.fit/blog/fitbod-review-2026 ; https://tooldirectory.ai/tools/fitbod
* Boostcamp (free coach programs, Pro pricing): https://boostcamp.app/free-workout-app
* TrueCoach pricing and printing programs: https://www.quickcoach.fit/truecoach-pricing-2026.html ; https://help.truecoach.co/en/articles/2393507-printing-a-program
* TrainHeroic pricing and marketplace: https://www.fitbudd.com/post/how-much-does-trainheroic-cost ; https://www.trainheroic.com/grow/
* Liftosaur (AGPL-3.0 PWA, Liftoscript): https://github.com/astashov/liftosaur ; https://www.liftosaur.com/doc/liftoscript
* wger (AGPL-3.0 workout manager, REST API): https://wger.readthedocs.io/en/2.4/
* free-exercise-db (Unlicense, 800+ exercises JSON): https://github.com/yuhonas/free-exercise-db
* Google Sheets API scopes (drive.file non-sensitive): https://developers.google.com/workspace/sheets/api/scopes ; spreadsheets.create: https://developers.google.com/sheets/reference/rest/v4/spreadsheets/create
* Force-copy links for Google Sheets: https://infoinspired.com/google-docs/spreadsheet/share-google-sheet-files-on-copy-mode
* ExcelJS (MIT; data validation, conditional formatting; browser): https://cdnjs.com/libraries/exceljs
* PDF generation approaches in the browser vs server: https://www.nutrient.io/blog/javascript-pdf-libraries/
* PWA on iOS (storage, push, install): https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide ; WebKit 7-day storage cap and home-screen exemption: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
* Cloudflare Pages limits: https://55041f86.previews.developers.cloudflare.com/pages/platform/limits/index.md ; GitHub Pages limits and commercial-use note: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
* Supabase pricing 2026: https://makerkit.dev/blog/saas/supabase-pricing ; https://toolradar.com/blog/supabase-pricing-2026
* i18next vs FormatJS: https://www.locize.com/blog/react-intl-vs-react-i18next
* json-rules-engine: https://npmjs.com/package/json-rules-engine
* YouTube privacy-enhanced embeds: https://axbom.com/embed-youtube-videos-without-cookies/ ; https://www.stefanjudis.com/blog/the-lie-of-youtubes-privacy-enhanced-embed-mode
* Licences: https://choosealicense.com/licenses/ ; Creative Commons and databases: https://wiki.creativecommons.org/4.0/Sui_generis_database_rights ; trademarks and forks: https://NLnet.nl/NGI0/bestpractices/Forking_and_Trademarks.pdf ; https://www.theregister.com/2011/01/11/hudson_renamed_jenkins/
* Health-data rules: FTC Health Breach Notification Rule (2024): https://jonesday.com/en/insights/2024/07/ftc-issues-final-health-breach-notification-rule ; Washington My Health My Data Act and fitness apps: https://terms.law/washington-mhmda-for-fitness-apps/ ; GDPR Article 9 health data consent: https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data ; amended COPPA rule (2025): https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule ; https://www.loeb.com/en/insights/publications/2025/05/childrens-online-privacy-in-2025-the-amended-coppa-rule
