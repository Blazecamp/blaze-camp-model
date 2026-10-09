# 13 · Product and output: how people get, follow and adapt a Blaze Camp plan (v1.1)

## v1.1 - round 2 applied (2026-10-08)

What changed from v1 (each change is applied in the tables, examples and contracts below, not only listed here):

| # | Change | Source |
|---|---|---|
| 1 | The product direction is **approved**: a phone-friendly website first (plan, images, PDF, sheet download), then the weekly check-in, then open source (Apache-2.0 code, CC BY 4.0 model; his videos, cues and the Blaze Camp name stay his). Status of §0, §5, §6 and §8 moved from PROPOSED to APPROVED where he approved it. | COACH-R2 R2-GEN-02 |
| 2 | **Fewest clicks, phone first, macro views.** New §14: Block / Week / Day views with one toggle and "show" chips; save the **whole 12-week block** or **one week** (or one day) as an image to send; coaches open on the block view, clients on today. | R2-GEN-02 |
| 3 | **Videos are optional.** No launch blocker: each exercise has a "Watch how" link that opens a YouTube search; Blaze Camp videos replace the link as they are filmed; a "send us your video" contact placeholder. §7.3 rewritten. | R2-GEN-02 |
| 4 | **Start flow: health check, coach bypass, liability release.** New §12: clients go through a PAR-Q-style health check; coaches choose "run the check with my client" or "skip, I follow my own onboarding" with a legal warning; **everyone accepts a liability release every time they get a plan**. Copy text placeholders in EN / ES, all marked for legal review. | R2-GEN-03 |
| 5 | **No lifestyle questions anywhere.** The intake "your usual week" field (sleep, stress, hard job / other sport; v1 F42) is removed, and the check-in loses "How was life this week?". The weekly step is decided from **effort, sessions completed and pain** only; the approved step table is kept without its life column (§2.3). | R2-GEN-04 overrides the life column of R2-VOL-01 |
| 6 | **No check-in = the plan does not change.** Without a check-in the next week is exactly the planned week of the stairway ("there is no data to go off of"). | R2-VOL-03 |
| 7 | **Effort 10 = "the max I could do, and I made it"**, not a fail. A failed exercise is logged with his own HOW IT FELT option "Couldn't do it". | R2-VOL-02 |
| 8 | **No deload or maintenance week inside a block.** The check-in no longer triggers early deloads; when a block cannot be completed the tool offers: stop the block → maintenance phase (length chosen, extendable) → a whole new block. At the end of maintenance it asks: keep maintaining / change plan / start a training block. | R2-VOL-07, R2-PER-06 |
| 9 | **Every plan is a stairway** (small steps first, a bit bigger after the halfway point, the hardest weeks last). The v1 acclimation and 8-week "start hard" caps are gone from the product screens; the exact stairway math lives in `12_volume_algorithm_v1` v1.1 and `06_periodization` v1.1, and the check-in rows are read against it (§2.3, E6). | R2-PER-03, R2-PER-04, R2-PER-05 |
| 10 | **Sport picker covers every popular US sport with positions, swimming included**, and a new top-level goal **"Stay athletic and active"** (pickleball, padel, tennis, golf, HYROX, rec leagues, running, hiking, skiing and more). New §13. Profiles are being written in `synthesis/sports/` and merged into `04_profiles.json` v1.1; ids here are provisional until that merge. | COACH-CHAT 2026-10-08; R2-GEN-05 |
| 11 | **Competitive athletes**: next season start date (or "in season until", or a competition date) **plus practice days and game days** per week, both required. | R2-GEN-05 |
| 12 | **Weight guidance**: reps-in-reserve words with the RPE number beside them and a week-1 tip; percentages only where a recent tested best exists; **Olympic lifts explained as power output**, with no percentages by default (competitive Olympic weightlifters are their own program type; a coach opt-in for one tested lift is PROPOSED, N-PROD-20). New §15. | R2-GEN-06, R2-ATH-05 |
| 13 | **Spanish approved**: neutral Latin American Spanish, English gym term in brackets, every line approved by him or a coach he trusts; pounds in the US, kilograms elsewhere, switchable. | R2-GEN-08 |
| 14 | **Sample plans he will grade** changed to seven: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs (Phase 0, §6). | R2-GEN-07 |
| 15 | Smaller product consequences: cardio sessions adjustable up or down by the user (R2-SES-06); the gen-pop year fully tunable in the year view (R2-PER-01, R2-PER-02); maintenance length chosen and extendable (R2-PER-06); tests before or in week 1 and at the end only, safe test choices for untrained people (R2-PER-07); 60+ clients get no Olympic lifts, plyos or depth jumps by default, with an opt-in and a warning (R2-ATH-08); core supersets can be added anywhere in coach edit mode (R2-SES-03); 'NO ACCESS' = a self-serve version without coach access (R2-LIB-08). | as listed |
| 16 | Build estimate updated for the new screens (health check and release, macro views and block image, sport and activity picker): MVP about 11-16 developer-weeks, check-in +3.5-5 (§9, E12). | INFERRED |

---

**What this is.** The coach asked for ideas on what the generator should hand people (COACH-ANSWER GEN-03): "I don't know what the output should be yet ... you should be able to give me some ideas." v1 laid out four options; in round 2 he approved the recommended path (R2-GEN-02) and added his own product rules (R2-GEN-01 to R2-GEN-08). This v1.1 document describes the approved product: what a user sees, how plans are shared, how the health check and liability release work, how the sport picker covers every popular US sport and the "stay athletic and active" crowd, how tracking and the weekly check-in work, what it costs, and what is still open. The main body is written for the coach. The engineer appendix (section E) holds the data contracts and the build plan.

**Status.** Items marked APPROVED come from his round-2 answers. Everything marked PROPOSED is a recommendation waiting for his yes or no. Legal copy is marked **[LEGAL REVIEW]** and must not ship without a lawyer's review. Nothing here changes a training rule; the training rules live in `BLAZE_CAMP_BRAIN.md`, `generator_spec_v1.json` and synthesis files 01-12. This file only decides how those rules reach people.

**Read with.** `coach_answers_round2.md` (authoritative, above everything else), `coach_answers_full.md`, `generator_spec_v1.json` 1.1.0 (`inputs_schema`, `adaptation`, `output` are the machine twin of this file), `BLAZE_CAMP_BRAIN.md` §13-14, `12_volume_algorithm_v1` v1.1 (stairway and step math), `06_periodization` v1.1 (plan shapes, maintenance flow, testing), `synthesis/sports/*.json` and `04_profiles.json` v1.1 (sport profiles).

**Map.** §0 one page · §1 your decisions · §2 tracking and the check-in · §3-5 the options and the recommendation · §6 roadmap · §7 how it is built · §8 open source · §9 cost · §10 risks · §11 decisions for you · **§12 start flow: health check and liability release · §13 sport and activity picker · §14 views, screenshots and exports · §15 weight guidance** · Appendix E for the engineer.

**Evidence labels.**

| Label | Meaning |
|---|---|
| **COACH-R2 <ID>** | The coach's round-2 answer in `coach_answers_round2.md` (2026-10-08). Highest authority. |
| **COACH-ANSWER <ID>** | The coach's round-1 answer in `coach_answers_full.md` (2026-10-08). Authoritative unless round 2 changed it. |
| **COACH-CHAT <date>** | A direct request from the coach in the project chat (2026-10-08: "all of the different popular sports in the United States", swimming, pickleball, "high rows", "stay athletic and active"). |
| **OBSERVED** | Read from his sheets (dumps) or computed from the team's catalog files with the project venv. |
| **SCIENCE** | Peer-reviewed evidence (references at the end). |
| **RESEARCH** | Product, pricing, platform or legal facts from public web pages, accessed 2026-10-08 (references at the end). Prices and terms change; re-check before buying or shipping anything. |
| **INFERRED** | The team's reasoning or estimate. |
| **PROPOSED - PENDING COACH APPROVAL** | A recommendation the coach must accept before it is built. Shortened to **PROPOSED** below. |
| **APPROVED** | A PROPOSED item the coach marked RIGHT in round 2 (the R2 ID is given). |

---

## 0. The answer on one page (for the coach)

1. **A website, not an app.** It opens from a link on any phone, looks and feels like an app, can be added to the home screen and keeps working without signal in the gym. [APPROVED, R2-GEN-02; COACH-ANSWER GEN-03]
2. **As few clicks as possible, made for the phone.** One question per screen with big buttons, smart defaults, "More options" folded away; a client gets from the link to a plan in about 14 taps (INFERRED count, §12.6). [R2-GEN-02]
3. **See the whole thing at a glance.** One toggle switches between the **Block** (all 12 weeks), the **Week** and the **Day**, with "show" chips (exercises, sets × reps, effort, cardio, jumps and throws). [R2-GEN-02; layout PROPOSED, §14]
4. **Screenshot and send.** One tap saves the whole 12-week block or one week (or one day) as an image a coach can text to a client; also print / PDF and a Google Sheets / Excel download with your BYOP columns. [R2-GEN-02; §14]
5. **Health check, coach bypass, release every time.** Clients answer a short PAR-Q-style health check (any red flag: no automatic plan, see a professional). Coaches can run the check with their client or skip it because they follow their own onboarding, with a legal warning. **Everyone, client or coach, accepts a liability release every time they get a plan.** All wording goes to a lawyer first. [R2-GEN-03; flow PROPOSED, §12]
6. **Only workouts, nothing about sleep or stress.** The form asks about training only; no lifestyle questions in the form or the check-in. [R2-GEN-04]
7. **Every popular US sport, with positions, swimming included; and a "Stay athletic and active" door** for gen-pop people who want pickleball, padel, tennis, golf, HYROX, rec leagues, running, hiking or skiing. Competitive athletes give their next season start date plus practice and game days; recreational players only pick the activity. [COACH-CHAT 2026-10-08; R2-GEN-05; GEN-02; picker PROPOSED, §13]
8. **Tracking is optional; the check-in is short; no check-in, no change.** (a) Just the plan: it climbs its stairway week by week on its own. (b) A one-minute weekly check-in (sessions done, effort, how it felt, anything hurting) sets next week's step. (c) A full logbook with your columns. Without a check-in the next week is exactly what the plan already had. [R2-GEN-01, R2-VOL-01, R2-VOL-03, R2-GEN-04]
9. **Weights in plain words.** "Leave 2 reps in the tank (RPE 8)", the number following the week of the stairway (more in the tank early, less in the last weeks), with a week-1 tip; percentages only when someone has a recent tested best on a barbell main lift; Olympic lifts explained as power ("move it fast"), no percentages needed unless you compete in Olympic weightlifting. [R2-GEN-06; §15]
10. **Videos optional.** A "Watch how" link opens a YouTube search for the exercise; your own videos replace it as you film them; "Have a video? Send it to us" placeholder. [R2-GEN-02; §7.3]
11. **English first, full Spanish switch.** Neutral Latin American Spanish with the English gym word in brackets ("Empuje de cadera (Hip Thrust)"); you or a coach you trust approve every line; pounds in the US, kilograms elsewhere, switchable. [APPROVED, R2-GEN-08; GEN-01]
12. **Default exercise in every slot, with a dropdown to swap within the same category;** coaches can add their own rules; your hard rules stay locked. [COACH-ANSWER GEN-04, GEN-08; mechanism PROPOSED]
13. **Open source once you approve the model:** Apache-2.0 code, CC BY 4.0 model data; your videos, cues and the Blaze Camp name stay yours. [APPROVED, R2-GEN-02]

**The plan in one line [APPROVED, R2-GEN-02]:** phase 1 plan website (Option A in §3) → phase 1.1 the weekly check-in (Option B) → open source (Option D) after you approve v1, with the Google Sheet as a download inside the site (Option C as an export, not the product).

---

## 1. What you already decided

### 1.1 Round 1 (the product rules from your first answers; v1.1 notes where round 2 changed them)

| ID | Your answer | What it means for the product |
|---|---|---|
| GEN-01 | Users: clients, coaches, trainers, strength and conditioning coaches, anyone. "It should start in English and toggle to Spanish if needed, the whole thing." | One site for everyone, with a **coach mode** for people building plans for others (now also the switch for the health-check bypass, R2-GEN-03). Spanish covers screens, exercise names, cues, PDFs, sheets and emails alike. |
| GEN-02 | Drop sex. Use training experience in years. Competitive athletes: sport, position, season. Recreational: general sport only. Add body weight. | The intake (§12, §13, E4) uses these fields. No sex field; body weight required; sport, position, season and practice load only for competitive athletes; recreational players pick an activity only. |
| GEN-03 | Output undecided; ideas: a PDF they can screenshot, something easy on the phone, maybe a Google Sheet, no full app, maybe a website plus an open-source repo. Unsure whether people should track. | Decided in round 2 (R2-GEN-02): website, images, PDF, sheet download, optional check-in, open source later. |
| GEN-04 | Pick the default and keep the dropdowns: "That's going to be important." | Every exercise card has a swap list limited to the same category. |
| GEN-05 | RIGHT: adjust week to week from logged EFFORT and HOW IT FELT. | The weekly check-in (§2.3), now without the life question (R2-GEN-04). |
| GEN-06 | Video for every exercise: "we need more links ... needs to get done." | Softened in round 2: videos are optional; link-out to YouTube until his own library exists (R2-GEN-02, §7.3). |
| GEN-07 | RIGHT: a short cue per exercise plus your instruction block at the top. | Cue under every exercise; your instruction lines at the top of every plan. |
| GEN-08 | RIGHT: never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core is never skipped; "and options for a coach to add their own rules." | Locked rules plus a coach rule layer (§7.2). |
| PER-01 | Plan lengths: 4-6-week maintenance / transition at about 50-70 % volume, 8 weeks, 12 weeks preferred, week by week, a year. | Plan-type choice on the intake. **Round 2 changed the shapes**: every plan is a stairway (R2-PER-03, R2-PER-04); maintenance length is chosen and extendable (R2-PER-06). |
| PER-07 | Tests chosen by checkbox, or "No need for testing"; a reminder "It's time for your test. Get ready." | Test checkboxes on the intake; **round 2: test before the block (or in week 1) and at the end, never mid-block; untrained people never test a 1-rep max or a max mile from zero** (R2-PER-07). |
| VOL-01, VOL-02 | "This eventually will be something that learns from the data of all the people that use it." | Consented data collection designed in from the start (§7.5), switched on only after legal review (v2). |
| VOL-06 | "I need this tool that we're building eventually to figure out the percentages." | Users never see percentages; they see "+1 set on Back Squat next week". |
| VOL-13 | RIR is the effort language; explain RIR and how it relates to RPE. | Effort written as "leave 2 reps in the tank (2 RIR · RPE 8)", always inside 1-3 RIR, with a short "How hard?" page in both languages (§15). |
| ATH-11 | Core first (it is the warm-up), but users can move the core block. | "Move core block" setting: start (default) / after plyos / after strength / end. Round 2: core opens light (2 × 2) and coaches may add core supersets anywhere (R2-SES-03). |
| ORD-10 | Optional days: ideally separate. | Setting: "Optional work: on its own day (recommended) / added to my training days". |
| PER-03 | A/B lead-lift weeks for people who want variety. | Setting: "I like variety" turns A/B weeks on. |
| EQ-10 | The client's own preference can choose between alternatives. | The swap dropdown, remembered per slot for the block. |
| EQ-01, EQ-07, EQ-08, EQ-12 | No bands, no variable resistance anywhere for now. | Equipment screens offer no band options; band exercises are never shown or offered as swaps. |
| EQ-14 | Aerobic work on any machine; tracking it week to week matters. | The aerobic card has a 'WEIGHT USED or SCORE' field for time, distance or calories (PRG-08). Round 2: users can ask for more or less cardio (R2-SES-06). |
| PRG-05 | L1 / L2 / L3 "but explain it a little bit better". | Level explained on screen in plain words with the reason ("You trained 3 years but took 9 months off, so we start your body at Level 1 for now"). |
| ATH-13, FIX-03 | Names general and understandable; 'Justice League' was a marketing name for a non-competitive all-round athletic program. | Plan names shown to users are descriptive ("Athletic all-round, non-competitive"). This program is now one tile of the "Stay athletic and active" door ("A bit of everything", §13.3). |
| FIX-04 | Correct spelling in the generator; leave his sheets alone. | All shown text corrected; his sheets never touched. |
| PRG-01 | SKIP ('NO ACCESS' tabs). | Answered in round 2: a self-serve version without coach access (R2-LIB-08). Product tiers: **self-serve** (anyone, no coach) and **coached** (coach mode; coach-connected accounts in v2). Free vs paid is still open (N-PROD-09). |

### 1.2 Round 2 (what you decided about the product)

| ID | Your answer | What it means for the product |
|---|---|---|
| R2-GEN-01 | RIGHT: the plan works with no tracking; an optional 1-minute weekly check-in decides next week's step; the week-by-week plan needs the check-in. | Tracking levels 0-3 (§2.2). Week-by-week mode requires the check-in. |
| R2-GEN-02 | RIGHT: phone-friendly website first, then the check-in, then open source. "The fewer clicks, the better ... the macro view of the week, the macro view of the block, and the macro view per day ... options for visibility easily toggled." A coach "can just screenshot their 12 weeks ... or 1 week and send it over". Videos: "They can just look up the videos on their own on YouTube"; add his own videos later; a "send us your video" email. | §0, §5, §6 approved; §14 views and screenshots; §7.3 optional videos. |
| R2-GEN-03 | RIGHT on the refer list (chest pain or heart issues, surgery or fracture in 6 months, pregnant or gave birth in 6 months, injury under treatment, doctor said no). Clients go through the PAR-Q; coaches can toggle the check or bypass it with a legal warning to follow their own onboarding; "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach." | §12: start flow, refer rule, coach bypass, liability release every time, copy placeholders [LEGAL REVIEW]. |
| R2-GEN-04 | NOT RIGHT on sleep, stress and physical-job taps: "I just need the workouts here. There's no need to talk about sleep or stress or anything else." | Intake field "Your usual week" removed; check-in question "How was life this week?" removed; the step table loses its life column (§2.3). |
| R2-GEN-05 | RIGHT: ask the next season start date (or "in season until") plus practice and game days per week; the tool works out off-season, pre-season and in-season. | Competitive athlete screens (§13.2). |
| R2-GEN-06 | RIGHT: reps-in-reserve language with a week-1 tip; percentages only with a recent best. Plus: untested Olympic lifts and maxes → RPE or RIR; "Olympic lifts should be explained on there easily: these are for power output"; percentages only for competitive Olympic lifters, whose programming "is completely different". | §15 weight guidance; Olympic weightlifting as its own program type (§13.2, N-PROD-17). |
| R2-GEN-07 | RIGHT: he will grade sample plans: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs. | Phase 0 sample set (§6). His list has seven plans although the question said five; we plan for seven (INFERRED). |
| R2-GEN-08 | RIGHT: neutral Latin American Spanish, English gym word in brackets, approved line by line by him or a coach he trusts; lb in the US, kg elsewhere, switchable. | §7.4; F06 units. |
| R2-VOL-01, R2-VOL-02, R2-VOL-03 | Step table approved; effort 10 = "the max I can do, not a fail"; no check-in = "the plan doesn't change. There is no data to go off of." | §2.3 check-in and step; §2.2 level 0. |
| R2-VOL-07, R2-PER-06 | No maintenance or deload week in the middle of a block; can't complete it → cancel the block → maintenance → a whole new block; maintenance weeks are chosen and extendable, and at the end the tool asks what next. | §2.3 "When a block can't be finished"; S20 maintenance screens (§3.2). |
| R2-PER-01, R2-PER-02 | The year plan is for gen-pop "stay in shape"; users can re-order blocks, change cardio, add a winter powerlifting-style block, mark their own holidays. | S14 year view becomes editable (§3.1). |
| R2-PER-07 | Test before the block (or at the start) and at the end, never during; no 1-rep max or max mile from zero ("If they haven't finished a block of training ... they should never start from zero testing their maxes"), use a 5- or 3-rep max or 80-90 % efforts. | F26b tests screen and reminders (§3.1, §12.6); a 1-rep max or an all-out mile is offered only to someone coming off a completed training block (§3.1 S6, §7.6). |
| R2-SES-06 | Cardio adjustable: "I need more cardio" adds it; "less cardio" takes it away. | A "Cardio: less / as planned / more" control in the week view and settings. |
| R2-ATH-08 | 60+: no Olympic lifts, plyos or depth jumps by default; an option if they want it, with a warning to have a fitness professional help them. | Opt-in toggle with his warning (§12.5 copy C7). |
| R2-LIB-08 | 'NO ACCESS' = a self-serve version without coach access. | Self-serve tier (§1.1 PRG-01). |

---

## 2. Tracking and the weekly check-in

### 2.1 The tension, and how round 2 settled it

* GEN-03: "I don't think that they should be tracking it from us. They should be tracking it themselves."
* GEN-05 (RIGHT): adjust week to week from the client's EFFORT and HOW IT FELT.
* R2-GEN-01 (RIGHT): the plan works with no tracking; an optional one-minute weekly check-in decides next week's step; week-by-week mode needs it.
* R2-VOL-03: "if they don't check in, the plan doesn't change. There is no data to go off of."
* R2-GEN-04: no sleep, stress or life questions: "I just need the workouts here."

**Resolution [APPROVED, R2-GEN-01; with R2-VOL-03 and R2-GEN-04 applied]:** *tracking* (writing down every set) stays optional and can happen anywhere. *Checking in* is one short screen a week about the training only: which sessions were done, how hard they were, how the exercises felt, anything hurting. It needs no account. Without it, the plan follows its planned stairway exactly.

### 2.2 Four tracking levels (the user picks; they can change any week)

| Level | What the user does | What the tool does with it | Who it suits | Phase |
|---|---|---|---|---|
| **0 · Just the plan** | Follows the plan. Tracks in a notebook or not at all. | Nothing to read, so nothing changes: every week is the planned step of the stairway (R2-VOL-03; stairway R2-PER-03/04). No deload or maintenance week appears inside the block (R2-VOL-07). | People who want "tell me what to do"; screenshot and PDF users; maintenance phases. | MVP |
| **1 · Weekly check-in (no account)** | Once a week, about one minute: sessions done, effort per session, how it felt, anything hurting, optional best set or test result. | Picks next week's step from the approved table (§2.3), applies the pain and swap rules, and offers "stop the block → maintenance → new block" when the block can't be finished (R2-VOL-07). | Most users; required for week-by-week mode (R2-GEN-01). | v1.1 |
| **2 · Full logbook** | Fills your columns per exercise: 'WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?'. On the phone, or in the downloaded sheet. | Same as level 1, per exercise instead of per day, plus weight history and best-set charts. The check-in pre-fills itself from the log. | Lifters who already log; athletes; coaches' clients. | v1.1 (phone), MVP (in the sheet, no adaptation) |
| **3 · Coach-connected (account)** | Same as level 1 or 2, saved to an account the coach can see. | The coach sees check-ins, gets a flag when 'Felt a PAIN' repeats on the same exercise, and can change the plan. | Your clients and other coaches' clients. | v2 |

### 2.3 The weekly check-in (no account) [APPROVED as a mechanism, R2-GEN-01, R2-VOL-01; life column removed, R2-GEN-04]

**When.** The day after the last session of the week, the plan shows "Check in to build next week". If the user ignores it, next week is exactly the planned week; nothing is guessed (R2-VOL-03). They can check in late; a late check-in changes the weeks that have not started yet.

**The questions (about one minute; all taps, no typing).** His own menus are used word for word where they exist (OBSERVED, BYOP 'MASTER EXERCISE LIBRARY' AV:AY; `BLAZE_CAMP_BRAIN.md` §3.5).

| # | Question (EN / ES) | Answers | Feeds |
|---|---|---|---|
| 1 | Which sessions did you do? / ¿Qué sesiones hiciste? | a tick per training day ('DONE?') | completion; repeat-week rule |
| 2 | How hard was each session? / ¿Qué tan duro fue cada sesión? | his EFFORT scale per day: '1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', '8 - That was perfect', '9 - That was terrible', "10 - I'm done". Helper line under 10: "the most I could do, and I made it" / "lo máximo que podía hacer, y lo logré" (R2-VOL-02). | weekly step (table below) |
| 3 | How did it feel? / ¿Cómo se sintió? | per day, default 'Felt the RIGHT muscles'; tap an exercise to change it to 'Felt the WRONG muscle', 'Felt a PAIN' or "Couldn't do it". "Couldn't do it" is the **failed** option (R2-VOL-02: "We can add a fail with it if we need to"). | exercise-level rules |
| 4 | Anything hurting now? / ¿Te duele algo ahora? | no / body area from the intake list (neck, shoulder, elbow, wrist or hand, upper back, lower back, hip or groin, knee, ankle or foot) + better / same / worse than last week | pain rule (VOL-03) |
| 5 | (optional) Your best set or test result / Tu mejor serie o resultado de prueba (opcional) | weight × reps, or time / distance / calories | test weeks (R2-PER-07), % lifts, history |

Removed in v1.1: "How was life this week (sleep, stress, work, travel)?" (R2-GEN-04).

**Weekly step: how much the plan grows next week.** One step for the whole week, applied to every muscle's weekly sets (COACH-ANSWER VOL-04). "Effort" = what the sessions mostly were (the median of the session ratings, as in `12_volume_algorithm_v1` v1.1 §3.7.3 and `06_periodization` v1.1); any single "10" is handled separately. EFFORT is read against what the plan asked for: '8 - That was perfect' means the person hit the target (R2-VOL-02 approved the reading; 10 is a successful all-out effort, not a fail).

The check-in does not replace the stairway; it is **read against the planned step of the stairway** (the engine math lives in `12_volume_algorithm_v1` v1.1 §3.7.3; this product table must match it). His approved numbers (R2-VOL-01) are what the rows give from the halfway week on, where the planned step is 5 %; in the first half the planned step is "a little bit smaller" (3 %, R2-PER-03), so the same rows give one notch less.

| Effort mostly | Next week (engine) | First half (planned 3 %) | From halfway (planned 5 %): his approved number | Basis |
|---|---|---|---|---|
| 1-6 (too easy … broke a sweat) | the planned step + 2 points, never above 7 % | +5 % | **+7 %** | R2-VOL-01; reading against the stairway INFERRED (12 v1.1) |
| 7-8 ('That was tough' … 'That was perfect', the target) | the planned step | +3 % | **+5 %** | R2-VOL-01, R2-PER-03/04 |
| 9 ('That was terrible') | hold (0 %) | hold | **hold** | R2-VOL-01 (its "+3 % only if life was better" cell dropped with the life column, R2-GEN-04) |
| "10 - I'm done" on any day | hold, and −1 set on that day (with the logbook: on the exercise rated 10; with the check-in only: the set most recently added to that day); the stairway continues from the lower level (PROPOSED, 12 v1.1) | hold, −1 set | **hold, −1 set** | R2-VOL-01, R2-VOL-02 |
| Under half of the planned sessions done | repeat the week: the stairway does not advance and the block becomes one week longer | repeat | **repeat** | R2-VOL-01; "one week longer" PROPOSED (12 v1.1, 06 v1.1) |
| **No check-in** | **the planned step** (the plan does not change) | +3 % | +5 % | R2-VOL-03 |

A muscle whose cap would come early (for example an advanced lifter's big muscles, 20 → 25) has all its planned steps shrunk by one factor λ so it peaks in the last week (12 v1.1 §3.7.1: L3 big muscles 1.5 % then 2.5 %); the rows above then read against those smaller steps, and "+2 points" still never passes 7 %.

The approved R2-VOL-01 table had a life column ("+5 % if life was harder", "hold if life much harder"). The coach then rejected every lifestyle input (R2-GEN-04), so the column is gone and the step is decided by effort, completion and pain only. **This resolution is ours [INFERRED from R2-VOL-01 + R2-GEN-04] and is flagged for him to confirm** (BLAZE_CAMP_BRAIN.md §16; round 3).

Rules around the table:

* **Never more than 7 %** in a week (R2-VOL-01; COACH-ANSWER UNI-05: 10 % "is way too much"); the person's total weekly sets always rise by less than 10 % (UNI-05). While 1-2 priority muscles are pushed, every other muscle grows at most 3 % a week (R2-VOL-06).
* **Repeat the week** if fewer than half the planned sessions were done (R2-VOL-01): the stairway waits one week.
* **No check-in → no change**: the planned stairway week is used as it is (R2-VOL-03), in every mode, week-by-week included (its rolling stairway has planned steps too).
* **The stairway stays the shape.** The planned weekly steps are small in the first half, a bit bigger after the halfway point, and the hardest weeks come last (R2-PER-03, R2-PER-04); the block should end feeling like an "11", a little past the person's usual limits (R2-PER-05). A check-in can slow the climb (hold, repeat, −1 set) or add up to 2 points to one week; it never inserts a deload or maintenance week (R2-VOL-07).
* **Maintenance phases, pre-season blocks and in-season weeks**: the step is always 0 (flat sets; pre-season and in-season climb in speed and power quality, not sets) (PER-01, R2-PER-06, UNI-10, PER-08, R2-ATH-07).
* **The coach can override** the step for a client (fixed or capped, 0-7 %) (VOL-05: "or their coach to adjust accordingly").
* **Fractions are banked** and a whole set is added when the bank reaches one (COACH-ANSWER VOL-06).
* **Week-by-week mode needs the check-in** (R2-GEN-01).

**When a block can't be finished [R2-VOL-07, R2-PER-06; signals PROPOSED, the same list as 06 v1.1 §7.0.2 and 12 v1.1 §3.12].** "No matter what the athlete puts, they need to be able to manage their block and complete it. If they can't complete it, they should cancel the block and start a maintenance phase" (R2-VOL-07). The check-in offers, never forces, this choice when it sees two hold weeks in a row, effort mostly 9-10 two weeks in a row, under half the sessions two weeks running, 'Felt a PAIN' on two or more exercises in one week, pain reported two weeks running or "worse" (safety, INFERRED), or whenever the user taps "I can't finish this block". Without check-ins there are no signals and the block runs as planned (R2-VOL-03).

1. **Keep going** (the plan continues on the stairway; holds and pain rules still apply), or
2. **Stop this block and start maintenance**: the user picks how many weeks (default 4, from 1 to 8, PROPOSED range), at about 50-70 % of the volume (PER-01); weeks can be added at any time.
3. **At the end of maintenance** the tool asks (R2-PER-06): **Keep maintaining** (+1 / +2 / +4 weeks) · **Change my plan** (back to the intake with answers kept) · **Start a training block** (a whole new block from week 1 of a new stairway, at the same start as the stopped block, PROPOSED).

The v1 "early deload" triggers are retired (R2-VOL-07).

**When a block is finished [R2-VOL-07, R2-VOL-06; choice PROPOSED, 06 v1.1 §7.0.2].** Maintenance and easy weeks belong at the end of a block, never in the middle (R2-VOL-07). After the last week (and the end test, if ticked) the tool asks: **Next block** (default): one easy week at about half the sets of the hardest week, same exercises, 3+ reps in reserve (the R2-VOL-07 "half of the current (hardest) week" dose), then the next block one step up (start × 1.05, cap + 1 set, never above 25 or 30 for a priority, all customizable; R2-VOL-06) · **Maintenance** (choose the weeks; it replaces the easy week) · **Change my plan**. Copy C15.

**Exercise-level rules (from HOW IT FELT?).**

| Answer | Next week | Basis |
|---|---|---|
| 'Felt the RIGHT muscles' | keep it; it can move up a level at the end of the block if effort was 8 or easier and pain-free | COACH-ANSWER PER-06 |
| 'Felt the WRONG muscle' | offer two swaps from the same category (or one small change: stance, grip, implement, hand that holds the weight); the user picks or keeps it | COACH-ANSWER GEN-04, PER-02; R2-LIB-01 (one-detail variations, never invented exercises); offer PROPOSED |
| 'Felt a PAIN' | swap within the category or one level down; that muscle or pattern −30-50 %, moved to a machine, or the exercise dropped if needed; same sets kept on a unilateral swap "ideally, but adjust accordingly" | COACH-ANSWER GEN-05, VOL-03, UNI-08 |
| "Couldn't do it" (the failed option) | one level down in the same category or an easier version; sets unchanged | COACH-ANSWER GEN-05; R2-VOL-02. `12_volume_algorithm_v1` v1.1 proposes a separate optional 'Failed' answer (hold, that exercise −1 set and lighter); the product uses his own "Couldn't do it" option (one tap, his words) until he decides (N-PROD-19) |
| Pain reported two weeks running, or "worse" | the plan keeps going around it, the screen says to see a professional (or the coach, if connected), and the "stop the block → maintenance" choice is offered | INFERRED safety; R2-VOL-07 |

**Where the new sets go** (COACH-ANSWER VOL-07): to the first exercise of that muscle in the day's order, then the second, then the third (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3). When a muscle is trained on two days, the added sets alternate between the two days' first exercises so both days stay even; a small-muscle bonus exercise (2 sets) goes on the optional day; with no optional day, on a training day that already trains that muscle group (the one with the fewest exercises), never as that muscle's only exercise of the day (R2-SES-05; 12 v1.1 §3.9). R2-VOL-08 was not understood by the coach, so this is the **default, marked for round 3** (INFERRED default).

**Worked example (illustration, computed with the project venv using the 12 v1.1 stairway rules).** A fixed 12-week block with weekly check-ins. Biceps of an intermediate (L2) lifter: start 12 sets a week, cap 22, so λ = 1 and the planned steps are 3 % in weeks 2-6 and 5 % in weeks 7-12 (12 v1.1 §3.7.1). Biceps are trained on the two pull days, Day B and Day D, with three biceps exercises each (2/2/2; R2-SES-05: never one exercise per muscle). "Stairway week" does not advance in a repeated week; "level" is the 2 → 11 feel of the week (R2-PER-05).

| Calendar week | Stairway week (level) | Check-in about the week before | Step taken | Planned target (banked) | Sets written | Day B | Day D |
|---|---|---|---|---|---|---|---|
| 1 | 1 (2) | (start) | - | 12.00 | 12 | 2/2/2 | 2/2/2 |
| 2 | 2 (2.6) | effort 6 (too easy) | planned 3 % + 2 points = 5 % | 12.60 | 12 | 2/2/2 | 2/2/2 |
| 3 | 3 (3.2) | effort 8 | planned 3 % | 12.98 | 12 | 2/2/2 | 2/2/2 |
| 4 | 4 (3.8) | effort 7 | planned 3 % | 13.37 | 13 | 3/2/2 | 2/2/2 |
| 5 | 5 (4.4) | effort 9 | hold | 13.37 | 13 | 3/2/2 | 2/2/2 |
| 6 | 5 (4.4) | effort 8, but only 1 of 4 sessions done | repeat the week (stairway waits) | 13.37 | 13 | 3/2/2 | 2/2/2 |
| 7 | 6 (5) | effort 8 | planned 3 % | 13.77 | 13 | 3/2/2 | 2/2/2 |
| 8 | 7 (6) | effort 8 | planned 5 % (bigger steps from halfway) | 14.46 | 14 | 3/2/2 | 3/2/2 |
| 9 | 8 (7) | "10" on Day B, the rest 8 | hold, −1 set on Day B | 13.46 | 13 | 2/2/2 | 3/2/2 |
| 10 | 9 (8) | effort 8 | planned 5 % | 14.13 | 14 | 3/2/2 | 3/2/2 |
| 11 | 10 (9) | effort 5 (too easy) | planned 5 % + 2 points = 7 % | 15.12 | 15 | 3/2/2 | 3/3/2 |
| 12 | 11 (10) | **no check-in** | planned 5 % (R2-VOL-03) | 15.87 | 15 | 3/2/2 | 3/3/2 |
| 13 | 12 (11) | effort 8 | planned 5 % | 16.67 | 16 | 3/3/2 | 3/3/2 |

With no check-ins at all the same biceps would follow the planned stairway exactly: 12 · 12 · 12 · 13 · 13 · 13 · 14 · 15 · 16 · 16 · 17 · 18 in weeks 1-12 (planned target 18.64 in week 12). Here the hold, the "10" and the repeated week cost two sets and one calendar week; no deload week was inserted (R2-VOL-07), and no "can't finish" offer appeared (one hold and one repeated week are not two holds in a row). The end test, if ticked, goes in the last stairway week (calendar week 13), never in the middle (R2-PER-07).

What the user reads after a check-in: "Next week: +1 set on Back Squat (Monday, first exercise). Leg Press stays at 2 sets. Your shoulder: Barbell Bench Press is swapped for Machine Chest Press this week." The numbers stay inside the tool (VOL-06).

### 2.4 What the science and comparable products say

* **Simple self-reports are good enough to steer training.** A systematic review of 56 studies found subjective self-reported measures reflected acute and chronic training load with better sensitivity and consistency than commonly used objective measures (Saw, Main and Gastin 2016). Session RPE (a single effort rating per session) is a valid way to quantify training across many kinds of exercise (Foster et al. 2001). The check-in keeps the training self-reports (effort, completion, how it felt, pain) and drops the wellbeing ones at the coach's request (R2-GEN-04). [SCIENCE; product choice COACH-R2]
* **Adjusting from effort is at least as good as a fixed plan, often better.** Twelve weeks of RIR-based autoregulated squat training gave larger strength gains than fixed percentage loading at matched volume (Graham and Cleather 2021). A meta-analysis in athletes favoured autoregulation over fixed loading for maximal strength (effect size 0.64; Zhang et al. 2021); another found autoregulated and standardised loading gave similar strength gains (Hickmott et al. 2022). A review of monitoring methods rates RIR-based RPE as practical and reliable (Helms et al. 2020). [SCIENCE]
* **Optional logging helps the people who use it.** Self-monitoring explained the most variation in the success of physical-activity and healthy-eating programs (Michie et al. 2009); in phone-based programs, goals or self-monitoring raised the effect (Eckerstorfer et al. 2018). That supports offering the logbook, not forcing it. [SCIENCE]
* **Products already work this way.** The RP Hypertrophy app asks about pump, soreness and workload to set the next week's volume. JuggernautAI asks for readiness (sleep, motivation, soreness) and RPE; Blaze Camp deliberately does not ask about sleep or stress (R2-GEN-04). Volt's Cortex adjusts workouts from feedback and builds seasonal plans for teams. Fitbod adapts the next workout from logged sessions. All four are subscription apps (RP $24.99-34.99 a month, Fitbod $15.99 a month in 2026); none is free, bilingual by design and built around one coach's model. [RESEARCH]

### 2.5 Where the data lives when there is no account [PROPOSED]

* **On the phone.** Answers, swaps, check-ins, logs and release acceptances are saved in the browser's storage on that device. Nothing is sent to Blaze Camp.
* **The iPhone catch.** Safari deletes a site's saved data after seven days of Safari use without visiting the site; web apps added to the home screen are exempt (WebKit). So the site asks people to "Add to Home Screen" after the plan is made, and offers a backup. [RESEARCH]
* **Backup code.** One tap gives a short code, QR code or small file that holds the answers and check-ins. Pasting it on another phone restores the plan exactly (the engine always builds the same plan from the same answers). We never see it.
* **Share link and images.** Share the plan (exercises, sets, reps), never the person's answers (age, weight, pain, health answers). Coaches use them to send a plan to a client.
* **Accounts come later (v2)** for people who want sync across devices or a connected coach.

---

## 3. The four options (v1 analysis; the coach chose the A → B → D path, R2-GEN-02)

All four use the same engine (the model turned into code). The engine is the biggest single piece of work, whichever option is chosen (section 9). The options differ in what people see and how the plan travels.

### 3.1 Option A · Plan website (bilingual, built in the browser, phone-first, images, PDF and sheet exports) [APPROVED as phase 1, R2-GEN-02]

**One line.** A website that asks the intake questions, builds the plan on the phone and shows it as Block / Week / Day views, with buttons to save the block, a week or a day as an image, print or save as PDF, download a Google Sheets / Excel file, or share a link. No tracking, no accounts.

**What the user sees** (one question per screen, big buttons, auto-advance; "More options" folded away; R2-GEN-02).

| Screen | Content |
|---|---|
| **S0 · Landing** | "Build your training plan in the Blaze Camp style." EN / ES switch top right (English first, GEN-01); lb / kg set from the phone's region and switchable (R2-GEN-08). Two doors: "Build my plan" and "I'm a coach or trainer building for a client" (F39). Short "not medical advice" line. |
| **S1 · Health check** | Client door: the PAR-Q-style health check (§12.2); any red flag → no automatic plan and a "see a professional" message. Coach door: "Run the health check with my client now" or "Skip: I follow my own onboarding" with the coach warning (§12.3). [R2-GEN-03] |
| **S2 · About you** | Age; body weight (required, GEN-02); training experience in years, months off in the last 2 years, "I used to compete" (PRG-05) on the same screen. The level it chose and why, in plain words. No sex question (GEN-02). No sleep, stress or job questions (R2-GEN-04). |
| **S3 · Goal** | Build muscle · Get stronger · **Train for my sport** · **Stay athletic and active** (new, §13.3) · Lose fat · General fitness and health · Hybrid / CrossFit. Then, where it applies: up to two focus muscles; lift style; gym or bootcamp format (PRG-03). |
| **S4 · Sport or activity** | "Train for my sport" → competitive or recreational → sport (every popular US sport, searchable, EN / ES) → position or event group → level of play → next season start date (or in season until / competition date) → practice days and game days (§13.2; R2-GEN-05). "Stay athletic and active" (or recreational) → pick up to two activities (pickleball, HYROX, tennis / padel, golf, running, rec league, hiking ...), no position or season (§13.3; GEN-02). |
| **S5 · Schedule** | Days per week, which days, session length (45-60 min suggested for general / fat loss; about 90 min, max 120, for athletes, bodybuilders and powerlifters, UNI-09), start date. Full-body days keep 2-4 exercises for every muscle trained that day (R2-SES-05), so they can run longer (about 55-80 min with supersets, 12 v1.1 §5.1); when the chosen length is too short the screen says so in one line and offers: longer sessions · more days · a split instead of full body [wording PROPOSED]. |
| **S6 · Plan type and tests** | **12 weeks (recommended)** · **8 weeks** · **Maintenance / transition** (you choose the weeks, 1-8, extendable; R2-PER-06) · **Week by week** (needs the check-in, R2-GEN-01) · **Full year** (gen-pop, tunable; R2-PER-01, R2-PER-02). "Have you finished a Blaze Camp 12-week plan before?" → start one level higher (PER-01). Tests: strength / cardio / speed and agility / jumps / body weight / "No need for testing", done **before the block (or in week 1) and at the end** (R2-PER-07). "Never from zero": anyone not coming off a completed training block (new and returning users, Level 1) only sees safe choices (a 5- or 3-rep max, beginners 5-8; cardio and speed at 80-90 % effort; never a 1-rep max or an all-out mile). A 1-rep max ('Work up to 1RM') is offered to intermediate and up only at the end of a completed block, or at the start when a Level 2-3 user taps "I just finished a training block" (one tap, shown only to them) [gate PROPOSED; R2-PER-07; 06 v1.1 §6]. |
| **S7 · Equipment** | Where you train, extra equipment, machines; no band or chain options (EQ-01, EQ-12). |
| **S8 · Pain and injuries** | Areas, side, how bad, what makes it worse. "Severe" → refer (V1). |
| **S9 · Preferences** (More options) | Core block position (start by default, ATH-11); optional work on its own day or added on (ORD-10); "I like variety" (A/B weeks, PER-03); cardio: less / as planned / more (R2-SES-06); 60+ only: "Include Olympic lifts, jumps and plyos" with his warning (R2-ATH-08); things you can't or won't do. |
| **S10 · Release and build** | The liability release (client or coach version, §12.4), an unticked "I have read and accept" box and the **Build my plan** button. Shown every time a plan is built (R2-GEN-03). |
| **S11 · Your plan: Block view** | The stairway at a glance (a 12-step bar from "easy start" to "hardest weeks" with the week's 2 → 11 level, R2-PER-03/04/05), test weeks marked, and one compact table per training day: the block's exercises down the side, the weeks across, sets × reps in each cell (§14.2). Your instruction block at the top (GEN-07). Coaches land here. |
| **S12 · Week view** | The 7 days of one week: each training day's title, about how long, and its exercises with sets × reps; rest days; cardio sessions with a "less / more cardio" control (R2-SES-06). Swipe between weeks. |
| **S13 · Day view** | One card per exercise, in session order (sketch below). Each card: PURPOSE, exercise name, swap dropdown (same category), sets × reps (10/10 written as "10/10 each side", PRG-07), effort as RIR words with the RPE number, rest, a one-line cue, a "Watch how" link, and a SUPERSET marker when paired. Clients land on today. |
| **S14 · Exercise sheet** | Tap a card: the cue, why this slot exists ("knee dominant paired with a pull to avoid bleed-over", UNI-11), the swap list, the video (Blaze Camp's own if filmed, otherwise "Watch how" opens a YouTube search, §7.3). |
| **S15 · Exports** | Save as image: **whole block** / **this week** / **this day** · Print / PDF (block or week) · Google Sheets / Excel file · Share (phone share sheet) · Add to calendar (§14.4). |
| **S16 · Year view** (full-year plans) | The year as chained blocks with the gen-pop quarter themes (R2-PER-01) and holiday weeks set to maintenance; **fully tunable**: drag blocks to re-order, change a block's theme (for example a winter powerlifting-style block with less cardio), more or less cardio, mark your own holidays (Christmas, Semana Santa, Thanksgiving ...), hemisphere for summer (R2-PER-02). Athletes follow their season instead. |

**Day view sketch (phone).** Names are illustrative.

```
+--------------------------------------+
| [ BLOCK | WEEK | DAY ]   EN|ES  lb|kg |
| WEEK 5 of 12 · stairway level 4.4/11 |
| MONDAY · Day A · about 85 min        |
| show: [sets x reps] [effort] [cues]  |
+--------------------------------------+
| 1 CORE (warm-up, light)    [move]    |
|   Dead Bug          2 x 10/10        |
|   "Ribs down, slow."  [Watch how]    |
| 2 JUMP (ballistic)                   |
|   Low Box Jump      3 x 5            |
|   land soft, stick it                |
| 3 POWER (clean day)                  |
|   Hang Power Clean  4 x 3   [swap]   |
|   move it fast: power, not max weight|
|   rest 2-3 min                       |
| 4 KNEE DOMINANT + PULL · SUPERSET    |
|   a) Back Squat       3 x 6  [swap]  |
|   b) Chest-Supp. Row  3 x 10 [swap]  |
|   leave 3 in the tank (RPE 7)        |
|   rest 2 min after the pair          |
| 5 ...                                |
| 8 CALVES  Standing DB Calf Raise 3x15|
+--------------------------------------+
| [Save as image v]  [Print]  [Share]  |
+--------------------------------------+
```

The order follows his rules: core first and light (ATH-11, R2-SES-03), jumps and power before strength (ORD-03), knee dominant paired with a pull and hip dominant with a push (UNI-11, ORD-06), calves on every leg day (VOL-17). Monday is the week's heavy squat day and a clean day: clean-family lifts go on squat-pattern days, snatch-family lifts on hinge days, up to 4 Olympic slots a week (R2-SES-01, R2-ATH-04). A box jump is a ballistic jump, not a plyometric one (R2-ATH-02). Olympic lifts carry the power cue instead of a load (R2-GEN-06). The effort line is the week's planned reps in reserve: more in the tank in the early weeks, less in the last weeks, always inside his 1-3 RIR band (VOL-13; 12 v1.1 §3.7.2).

**Tracking and adaptation.** None inside the site. The plan already includes its stairway. People can track on paper or in the downloaded sheet. To change the plan they rebuild it (and accept the release again).

**How it matches your words.** Covers the website, phone view, screenshot (block, week, day), PDF and Google Sheet ideas (GEN-03, R2-GEN-02), fewest clicks and macro views (R2-GEN-02), health check and release (R2-GEN-03), Spanish (GEN-01, R2-GEN-08), dropdowns (GEN-04), optional videos (R2-GEN-02), cues (GEN-07). The week-to-week check-in (GEN-05) comes with phase 1.1.

**Build effort, cost and time [INFERRED estimates; detail in E12].** About 11-16 developer-weeks (engine 5-7; screens, views, exports, health check and release, sport picker and the language plumbing 6-9), so roughly 3-4 months for one experienced developer working full time. v1 estimated 10-14; the round-2 additions (health check and release flow, block view and block image, the bigger sport and activity picker) add about 1.5-2 weeks. Running cost: a domain name (roughly $10-20 a year) and free static hosting (Cloudflare Pages' free plan has unlimited bandwidth and 500 builds a month; GitHub Pages' terms say its free hosting is not meant for commercial or software-as-a-service sites, so check the chosen host's current terms before launch). [RESEARCH]

**Risks.** A fixed plan cannot react to a bad week or a sore shoulder until the person rebuilds it or checks in (phase 1.1); no data to improve the model; a 12-week block image is long (the per-day table layout in §14.2 keeps it readable); Excel files opened in Google Sheets may lose some formatting (to be tested).

### 3.2 Option B · Option A + weekly check-in + optional logbook (no account), accounts later [APPROVED as phase 1.1, R2-GEN-02]

**One line.** Everything in A, plus the one-minute weekly check-in that writes next week, an optional per-exercise logbook with your columns, offline use, and a backup code. Accounts and coach connection arrive in v2.

**What the user sees (in addition to A).**

| Screen | Content |
|---|---|
| **S17 · Check-in** | The five questions of section 2.3 on one screen; then "Here's what changes next week" in plain sentences (sets added, swaps, holds) with an "OK" and an "Undo this change" per item. |
| **S18 · Logbook row on each card** | Optional fields under each exercise: 'WEIGHT USED or SCORE', 'EFFORT' (his 10 options, with the "10 = the most I could do, and I made it" helper), 'HOW IT FELT?' (his 4 options), 'DONE?'. A separate NOTES box so weights and notes don't mix. Rest timer. |
| **S19 · Progress** | Weekly sets per muscle (planned vs done), best sets on main lifts, aerobic scores week to week (EQ-14), test results (start vs end, R2-PER-07). |
| **S20 · Block can't be finished / maintenance / block done** | "Keep going" or "Stop this block and start maintenance" (pick the weeks, add weeks any time); at the end of maintenance: Keep maintaining · Change my plan · Start a training block (R2-VOL-07, R2-PER-06; copy C11, C12). When a block is completed: Next block (one easy week, then the next block one step up) · Maintenance · Change my plan (R2-VOL-07, R2-VOL-06; copy C15). |
| **S21 · Backup and devices** | Backup code / QR / file; "Add to Home Screen" help; restore from code. |
| **S22 · Week-by-week mode** | No end date; the person sees one week at a time. It runs on rolling 12-week stairways (06 v1.1, 12 v1.1; PROPOSED): each check-in sets the next week's step against the planned stairway, and a week without a check-in runs the planned step (R2-VOL-03); exercises change one small detail between exercise blocks (PER-02, R2-LIB-01); no deload or maintenance week inside a stairway; after each 12-week stairway the "block done" choice (an easy week and the next stairway one step up, maintenance, or change plan); maintenance only when chosen or when a stairway is stopped (R2-VOL-07, R2-PER-06). |

**Tracking and adaptation.** Levels 0, 1 and 2 of section 2.2, chosen by the user. Adaptation runs on the phone; the engine re-builds the plan from the answers plus all check-ins, so the result is always reproducible.

**How it matches your words.** Everything A covers, plus GEN-05 and R2-GEN-01 (adjust week to week from effort and how it felt), R2-VOL-03 (no check-in, no change), R2-VOL-07 and R2-PER-06 (block → maintenance → new block), PER-01 week-by-week mode, R2-PER-07 test reminders, and, once consent is added in v2, the learning data VOL-01 asks for. It respects GEN-03 and R2-GEN-04: nobody has to track, nothing is stored with us, and nothing outside the workouts is asked.

**Build effort, cost and time [INFERRED].** A plus about 3.5-5 developer-weeks (check-in, adaptation and the maintenance flow 1.5-2, logbook 1-1.5, offline / backup / install 1-1.5). Running cost the same as A until accounts arrive. v2 accounts: a hosted database such as Supabase (free tier: 500 MB database, 50,000 monthly active users, but paused after a week of inactivity; Pro $25 a month) plus possibly an email service. [RESEARCH]

**Risks.** People ignore the check-in (mitigation: the plan still works and simply follows its stairway; a gentle reminder on the plan screen; one screen). Data lost on a phone that is wiped (mitigation: backup code, home-screen install).

### 3.3 Option C · Google Sheets output only (kept as an export inside A / B)

**One line.** The generator's only output is a spreadsheet like your BYOP workbook: the full plan with dropdowns for swaps and your tracking columns, ready in Google Sheets.

**Three ways to deliver it.**

| Route | How it works | Sign-in | Notes |
|---|---|---|---|
| C1 · Download file | The site builds an .xlsx file in the browser (all weeks stacked, like 'JUSTICE LEAGUE', or one tab per week) with dropdowns (exercise swaps in the same category, his EFFORT and HOW IT FELT? lists) and colours; the user opens it in Google Sheets, Excel or Numbers. | none | Libraries such as ExcelJS (MIT licence) write dropdown lists and conditional colours in the browser [RESEARCH]. Whether every dropdown survives the import into Google Sheets must be tested in a short spike [INFERRED]. |
| C2 · Straight into their Google Drive | The site asks the user to sign in with Google and creates the spreadsheet in their Drive. | Google sign-in | Uses the `drive.file` permission, which only touches files the app creates; Google classes it as non-sensitive, needing only basic app verification [RESEARCH]. Native checkboxes and protected ranges possible. |
| C3 · Copy a template | A master sheet shared with a "make a copy" link (the URL ending `/copy` forces a copy into the user's Drive), then filled by script or by hand. | Google account | Close to how BYOP works today. Filling it automatically still needs C2's sign-in or an Apps Script. [RESEARCH; OBSERVED BYOP] |

**What the user sees.** A spreadsheet: rows WEEK / DAY / PURPOSE / CATEGORY / EXERCISE / SETS / REPS / WEIGHT USED or SCORE / EFFORT / HOW IT FELT? / DONE? (his exact columns, OBSERVED 'JUSTICE LEAGUE' row 2), plus VIDEO (the "Watch how" link) and NOTES columns, and the release line in the header.

**Tracking and adaptation.** Tracking is natural in a sheet. Adapting is not: next week would need either a script inside the sheet (Apps Script with broad permissions and scary consent screens) or the user coming back to the website (which is Option B anyway).

**How it matches your words.** Covers "maybe a Google Sheet" (GEN-03) and the dropdowns (GEN-04). Weak on the phone, on the whole-thing Spanish switch (a sheet is created in one language), on videos (links only) and on adaptation (GEN-05).

**Build effort, cost and time [INFERRED].** Engine 5-7 weeks plus 2-3 weeks for a simple intake page and the sheet design and generation (C1: 7-10 weeks); plus 1-2 weeks and a Google verification step for C2 (8-12 weeks). Running cost near zero.

**Risks.** Poor phone experience; Google API or policy changes; people editing formulas and breaking the sheet; no data for learning.

**Verdict.** An **export inside A / B** (C1 in phase 1, C2 in v2), as approved in R2-GEN-02; weak as the only product.

### 3.4 Option D · Open-source engine and model + Blaze Camp reference site [APPROVED for after v1, R2-GEN-02]

**One line.** Publish the engine code, the rule tables and the exercise tags publicly so any coach or developer can build on the model ("give away the repo ... to any coach and person that wants to create a training app", GEN-03), while the Blaze Camp site stays the official, best version.

**What people see.** Users see the Blaze Camp site, unchanged. Coaches and developers see a public code repository with: the engine; the model data (rule tables, exercise catalog with all lenses, templates, plan shapes, sport profiles); the English and Spanish word lists; documentation of how to write a rule pack; the tests that prove the engine follows your rules; and a licence file and a trademark note.

**Tracking and adaptation.** Same as the site it is paired with.

**How it matches your words.** Directly answers the open-source idea in GEN-03 and the approved licences in R2-GEN-02, and opens a deeper way for coaches to add rules (GEN-08): a fork can change anything, but then it is no longer Blaze Camp (trademark, section 8).

**Build effort, cost and time [INFERRED].** About 1.5-2.5 developer-weeks on top of A or B, then roughly 2-4 hours a week answering issues and reviewing contributions. Hosting the code on GitHub is free.

**Risks.** Someone sells a copy (allowed under permissive licences; section 8); weak forks that give bad plans (mitigation: the trademark keeps them from using your name); a support load; private material leaking (mitigation: publish only the cleaned model, never the raw sheet dumps, client names or unpublished programs). Comparable open projects exist: Liftosaur (AGPL-3.0, offline-capable web app with its own progression scripting language) and wger (AGPL-3.0 workout manager with an 800+ exercise database and an API). [RESEARCH]

**Verdict.** A **distribution decision**, taken once v1 is approved (Phase 2).

### 3.5 Considered and set aside

| Idea | Why not now |
|---|---|
| Native iPhone / Android app | Ruled out (GEN-03, R2-GEN-02). A home-screen web app gives most of the feel without app stores. |
| Running plans through an existing coaching platform (TrueCoach, TrainHeroic and similar) | They charge per coach by number of clients (TrueCoach about $26-137 a month; TrainHeroic from $9.99 a month, with a marketplace that takes $1 per athlete a month plus card fees) and cannot run your generator. Worth revisiting only as a sales channel for finished programs; program-library apps such as Boostcamp (free coach programs with built-in progression; Pro $59.99 a year) are another such channel. [RESEARCH] |
| PDF only | The easiest to build, but no swaps after printing (GEN-04), no language switch after printing, no adaptation (GEN-05). Kept as an export. |
| A chatbot that writes plans with AI | Plans would not be reproducible or checkable against your rules. AI is still useful behind the scenes: drafting Spanish translations and cue lines for you to correct. |
| Embedding YouTube videos found by search | Search results are not curated; embedding a stranger's video makes it look endorsed. A plain "Watch how" link that opens a YouTube search keeps it clearly outside Blaze Camp until his own videos exist (§7.3). [INFERRED] |

---

## 4. Side-by-side comparison

| Need (source) | A · Plan website | B · A + check-in | C · Sheet only | D · Open source (with A or B) |
|---|---|---|---|---|
| Fewest clicks, phone first (R2-GEN-02) | Yes | Yes | No (sheets are hard on phones) | as paired site |
| Block / week / day macro views with toggles (R2-GEN-02) | Yes | Yes | Partly (one long sheet) | as paired site |
| Screenshot the whole 12 weeks or one week (R2-GEN-02) | Yes (block / week / day images) | Yes | Partly (print from Sheets) | as paired site |
| Google Sheet (GEN-03) | Yes, as export | Yes, as export | Yes | as paired site |
| No full app (GEN-03) | Yes | Yes | Yes | Yes |
| Health check, coach bypass, release every time (R2-GEN-03) | Yes | Yes | Only with the website in front | as paired site |
| No lifestyle questions (R2-GEN-04) | Yes | Yes | Yes | Yes |
| Tracking optional (GEN-03, R2-GEN-01) | Yes (no tracking) | Yes (three levels) | Tracking built in | as paired site |
| Adjust week to week from EFFORT / HOW IT FELT (GEN-05, R2-GEN-01) | No | Yes | Only with scripts | as paired site |
| No check-in = plan unchanged (R2-VOL-03) | Yes (always the planned stairway) | Yes | Yes | as paired site |
| Every popular US sport + "stay athletic and active" (COACH-CHAT 2026-10-08) | Yes | Yes | Yes (intake page) | Yes (profiles published) |
| Full Spanish switch (GEN-01, R2-GEN-08) | Yes | Yes | Partly (new file per language) | Yes (word lists published) |
| Default + dropdown swaps (GEN-04) | Yes | Yes | Yes | Yes |
| Videos optional, link-out (R2-GEN-02) | Yes | Yes | Links only | Yes |
| Coaches add rules (GEN-08) | Yes (rule pack) | Yes | Hard | Yes, and deeper (fork) |
| Data to learn from later (VOL-01) | No | Yes, with consent (v2) | No | Yes, contributions |
| Week-by-week and yearly modes (PER-01, R2-PER-02) | Year view only | Both | Awkward | as paired site |
| Privacy by default | High (nothing stored) | High (on the phone until v2) | High (user's Drive) | as paired site |
| Build effort (developer-weeks, INFERRED) | 11-16 | 14.5-21 | 7-10 (C1) / 8-12 (C2) | +1.5-2.5 |
| Running cost (RESEARCH, INFERRED) | ~$10-20 / year | same until v2; then ~$0-50 / month | ~$0 | ~$0 + your time |
| Main risk | No adaptation | Check-in ignored; data on one phone | Phone experience | Support load, copies |

---

## 5. Recommendation [APPROVED, R2-GEN-02]

**Option B, built in phases starting from Option A; Option C as downloads inside it; Option D once you have approved v1.** You answered: "Yeah, ideally, we want to make it as simple as possible. The fewer clicks, the better."

Why it fits your answers:

1. It honours both of your answers on tracking: nobody is forced to track (GEN-03), and the plan still adjusts week to week from effort and how it felt (GEN-05, R2-GEN-01), while doing nothing on guesses when there is no check-in (R2-VOL-03).
2. It is the only option that can move the stairway from what actually happened in the week (your 3 / 5 / 7 % steps, holds and repeated weeks from effort, sessions done and pain; R2-VOL-01, R2-GEN-04).
3. It is the only path to the learning system you described (VOL-01, VOL-02): check-ins are the outcome data, shared only by people who say yes.
4. It is phone-first, few clicks, with block / week / day views and screenshots (R2-GEN-02), Spanish throughout (R2-GEN-08), and costs almost nothing to run until accounts are added.
5. Building A first gets a usable product to your clients sooner, and nothing in A is thrown away when B is added.
6. Your Google Sheet idea survives as a download with your exact columns, and the open-source release starts from a model you have signed off.

---

## 6. Roadmap (MVP → v2) [phases APPROVED, R2-GEN-02; contents PROPOSED; durations INFERRED for one experienced developer, full time]

| Phase | What ships | Your part | Done when | Rough time |
|---|---|---|---|---|
| **0 · Freeze the model** | Model v1.1 with the round-1 and round-2 answers folded in; the runtime model files (section E3); the merged sport profiles (`04_profiles.json` v1.1); a test suite of your hard rules; **7 sample plans for you to grade** (R2-GEN-07): swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs. | Grade the 7 plans; answer round 3 (a few questions only); pick plan names (N-PROD-10). | You sign off the 7 plans. | 2-3 weeks (team), ~7 hours of yours |
| **1 · MVP: plan website (Option A)** | Start flow (role → health check or coach bypass → … → release every time, §12); intake with the sport and activity picker (§13); Block / Week / Day views with show chips (§14); swaps, cues, "Watch how" links, Blaze Camp videos where they exist; instruction block; weight guidance (§15); plan types 12 / 8 weeks, maintenance (chosen weeks), full year (tunable view); tests at start and end; save block / week / day as image; print / PDF; Excel / Google Sheets download; share; EN / ES; lb / kg. No accounts. Page-view counts only. | A lawyer reviews the health check and release text; check the Spanish; approve cue lines; send videos whenever you film them (optional). | 20-50 of your clients use it for 4 weeks and send feedback through a short form. | 11-16 developer-weeks (about 3-4 months) |
| **1.1 · Check-in (Option B)** | Weekly check-in (sessions, effort, how it felt, pain; no life question) and adaptation, the "block can't be finished → maintenance → new block" flow, the end-of-maintenance prompt and the "block done" choice (easy week + next block one step up, maintenance, or change plan), logbook with your columns, progress screen, week-by-week mode, test reminders, home-screen install and offline use, backup code. | Review the first month of adjustments with real clients (are the steps right?). | Most active users check in; you agree with the changes it makes. | +3.5-5 developer-weeks (about 1-1.5 months) |
| **2 · Coaches, accounts, open source** | Optional accounts and sync; coach mode (build for clients, edit any slot, add core supersets anywhere (R2-SES-03), rule packs, see client check-ins, pain alerts, duplicate a previous client's plan); Google Sheets straight into Drive (C2); consented research data (section 7.5) after a lawyer's review; Olympic weightlifting as its own program type (R2-GEN-06; N-PROD-17); open-source release (Option D). | Approve the consent wording; decide whether coach mode is free or paid (N-PROD-09). | First outside coaches use rule packs; first consented data arrives. | 8-12 developer-weeks + legal review |
| **3 · Learning** | Dashboards for you (which exercises get swapped most, where pain is reported, how effort moves through a 12-week stairway, who drops off when); then careful tuning of starting sets, steps and caps, each change approved by you and released as a new model version. | Approve or reject each suggested change. | Changes are backed by enough data and by you. | ongoing |

The Spanish switch, the video map, the release log and the coach rule layer are built into the MVP's foundations (word lists, video map, local storage, rule layers) even where their screens arrive later, so nothing has to be rebuilt.

---

## 7. How it is built (plain language)

### 7.1 Four parts

```
  MODEL (data files, versioned)          ENGINE (code)                    RENDERERS (code)
  +------------------------------+      +----------------------------+   +---------------------------+
  | rule tables (JSON)           |----->| build plan from answers    |-->| block / week / day views  |
  | exercise catalog (JSON)      |      | adjust from check-ins      |   | block, week, day images   |
  | templates, stairway shapes   |      | explain each choice        |   | print / PDF               |
  | sport + activity profiles    |      | check the plan vs rules    |   | Excel / Google Sheets     |
  | coach rule packs (JSON)      |      +----------------------------+   | share, calendar           |
  | video map (JSON, optional)   |                                       +---------------------------+
  | words: English / Spanish     |-------------------------------------------------^  (every word on screen)
  +------------------------------+
```

1. **The model is data, not code.** Your rules (sets per level, the 3 / 5 / 7 % steps, the stairway, pairings, order, swaps, the pain rule, the sport profiles) live in tables that the engine reads. Changing a number means editing a table. These tables are compiled from the team's files (`generator_spec_v1.json` rule tables, `02_exercise_catalog.json`, `05_templates.json`, `06_periodization.json`, `04_profiles.json` v1.1 with the sports from `synthesis/sports/`, `10_equipment_model.json`, `03_volume_rules.json`). Every plan records which model version built it.
2. **The engine** turns answers into a plan, adjusts it from check-ins, explains each choice ("why this exercise?") and checks the plan against your hard rules before showing it.
3. **The word lists (English and Spanish)** hold every word the user sees, including the health check, release, warnings and the "How hard?" page. The plan itself stores only codes, so switching language re-draws the same plan in the other language instantly.
4. **The renderers** draw the plan: the three views, the images, the printed pages, the spreadsheet, the share and calendar files. A new output later (for example a coach's branded PDF) is a new renderer; nothing else changes.

### 7.2 How a coach adds rules (GEN-08) [PROPOSED]

**Four layers, applied in this order:**

| Layer | Who owns it | Can it be changed? | Examples |
|---|---|---|---|
| 1 · Locked Blaze Camp rules | you | No (only in a fork of the open-source code, which is then not Blaze Camp) | never to failure on heavy compounds; no V-squat; power before strength; horizontal before vertical; core never skipped (GEN-08); no bands or variable resistance (EQ-01, EQ-12); athletic sets never count toward muscle sets (VOL-10); KB swings are ballistic and never count as glute sets (R2-VOL-05); weekly total rise < 10 % (UNI-05); no deload or maintenance week inside a block (R2-VOL-07); a release before every plan (R2-GEN-03); no sex-based rules (ATH-09) |
| 2 · Blaze Camp defaults | you | Yes, by a coach's rule pack | starting sets by level and the floor of 10 sets per muscle (VOL-01, R2-VOL-04, R2-VOL-06); helpers count 0.25 (VOL-09); heavy squat and heavy deadlift on two different days, leg press / belt squat / non-axial hinge on the others (R2-SES-01, R2-SES-02); 3 calf sets per leg day (VOL-17); session lengths (UNI-09); caps per level ("this is all customizable", R2-VOL-06); 60+ default exclusions (R2-ATH-08) |
| 3 · Coach rule pack | the coach using the tool | Yes | "My youth clients under 15 do no Olympic lifts from the floor"; "Tennis players: lower body 85 % unilateral"; "Always put Hip Thrust Machine first on glute-focus days"; "Never program Bulgarian split squats for client X"; a **pro level** that lets one priority muscle go above 30 sets for a very advanced client (R2-VOL-06: "Maybe we can add a pro level"; PROPOSED, pending the volume research in `12` v1.1) |
| 4 · Client preferences | the client | Yes, within the layers above | swaps in the dropdown (EQ-10), core block position (ATH-11), variety on / off (PER-03), optional days separate or added on (ORD-10), more or less cardio (R2-SES-06), year blocks re-ordered or re-themed (R2-PER-02), 60+ opt-in to Olympic lifts, jumps and plyos with the warning (R2-ATH-08) |

**How a coach writes a rule.** A form, no code: **When** [conditions picked from lists: goal, sport, position, activity, season, level, age range, pain area, equipment, day type, week of plan] **then** [one action picked from a list: exclude an exercise / equipment / tag; prefer an exercise in a slot; set the unilateral share; set a muscle's weekly set range; cap the weekly step; add or remove a slot; add a core superset (R2-SES-03); move a block in the order; add a note to the plan]. Before saving, the coach sees the effect on 3 sample clients ("this rule changes 4 exercises in week 1"). Conflicting rules are flagged; a locked rule always wins.

**Where rules are kept.** A rule pack is a small file the coach can download, re-upload and share with other coaches (no accounts needed in the MVP and v1.1); in v2 it is saved in the coach's account. Coaches can also add their own exercises, but only with all the tags (family, pattern, laterality, plane, muscles, equipment, level; CAT-01), otherwise the engine cannot place them; a video link is optional (R2-GEN-02).

### 7.3 Videos: optional, link-out first, your own library later (R2-GEN-02) [APPROVED direction; details PROPOSED]

His words: "They can just look up the videos on their own on YouTube. No need to have the videos on there. If we want to have the videos on there of the exercises we have ... We haven't built our video library. If you would like to add video for this, please send an email to whatever, something like that. I don't know yet." (R2-GEN-02)

**What each exercise card shows, in this order:**

1. **Blaze Camp's own video**, if one is in the video map (status *coach*), played inside the site.
2. Otherwise a **"Watch how" link** that opens a YouTube search for the exercise name in the user's language (Spanish users search the Spanish name plus the English gym term in brackets). Nothing is embedded, so no YouTube cookies load until the person taps, and nobody mistakes a stranger's video for a Blaze Camp one [INFERRED]. Coaches can pin a specific link per exercise in their rule pack.
3. Under it, a small line: "Videos open on YouTube and are not made by Blaze Camp. We're building our own library. Have a great video of this exercise? Send it to [VIDEO_CONTACT]." The contact (email or form) is a placeholder until he picks one (N-PROD-14).

**The video map** stays as designed in v1, but every entry is optional: where it is hosted, the video ID, start and end seconds, who recorded it, and its status (*coach*, *approved public*, *search link*). A "missing videos" list is generated automatically for whenever he wants to film. When he films, silent 10-30-second clips (front or 45-degree, 2-3 clean reps) work in both languages because the cue text switches language.

**The backlog (OBSERVED, computed from `02_exercise_catalog.json` `video_urls`, v1 count).** About 350 live library exercises; about 79 have one of his links; 85 exercises he uses in his own programs have none (for example the staggered-stance deadlift, barbell bench press, leg press, pull-up, machine leg curl, standing DB calf raise). If and when he films, those 85 come first (one 3-4 hour session). Filming no longer blocks any phase.

**Hosting (when his videos exist).** Unlisted YouTube videos cost nothing and can be embedded with YouTube's privacy-enhanced mode (`youtube-nocookie.com`), which holds back cookies until the viewer presses play, though it still contacts Google [RESEARCH]. Paid video hosts can be added later by changing only the video map.

### 7.4 The Spanish switch [APPROVED, R2-GEN-08; GEN-01]

* Every word comes from the word lists; nothing is typed into the plan in one language.
* **Neutral Latin American Spanish**, with the common English gym term in brackets where gyms use it ("Empuje de cadera (Hip Thrust)", "Cargada colgante (Hang Clean)"). The coach approved this choice: "That sounds right."
* **Who approves:** the coach or a coach he trusts approves every line. AI drafts first. A missing Spanish line falls back to English and is listed for review, so the site never breaks.
* **Legal text** (health check, release, warnings) is translated and then reviewed by a lawyer in both languages; the lawyer decides which language version governs (N-PROD-15).
* Volume [INFERRED]: about 450-650 screen phrases (more than v1 because of the health check, release, sport and activity names), about 350-590 exercise names, about 80-120 sport, position and activity names, one cue line per exercise, his instruction block, the effort and feeling labels, the check-in, the explanations.
* **Units:** pounds by default in the US, kilograms elsewhere, switchable at any time (R2-GEN-08).

### 7.5 What data to collect (with consent) so the engine can learn later [PROPOSED; switched on only in v2 after legal review]

**Principle.** Collect nothing by default. Ask adults, separately and plainly, whether they want to share their anonymous plan and weekly check-ins to improve Blaze Camp. No bundled "I agree to everything" box, and never bundled with the liability release.

| Tier | What | Consent | Used to learn |
|---|---|---|---|
| 0 · Site counts | Page views, which export button was used, errors. No answers, no cookies. | Not needed (no personal data) | Which outputs and views people use; where the intake loses people |
| 1 · Anonymous training data (opt-in, adults) | A random ID; age band, body-weight band, experience band, goal, sport / position / activity / season, level, days, session length, equipment profile, plan type; each week: sessions done, effort per session, HOW IT FELT? per exercise, pain area (body region only, no free text), swaps chosen, steps the engine took, blocks stopped and maintenance chosen; test results if entered. No name, email, exact age, health-check answers or birth date. | Explicit, separate, unticked box; list of exactly what is shared; can be withdrawn and deleted with the backup code | Whether starting sets per level fit real responses; which check-in answers should map to 3 / 5 / 7 %; which default exercises get swapped or cause pain; how effort moves through the stairway; drop-off points |
| 2 · Account data (v2) | The same plus account details and full logs, visible to the person and to a coach they connect | Separate consent for the account and for coach access | Coach features; long-term progress |

**How learning would work (Phase 3).** First, plain dashboards for him. Then small, explainable adjustments to a few numbers (starting sets, step thresholds, caps), each proposed with the data behind it, approved or rejected by him, and released as a new model version with a change log. Locked rules are never changed by data.

**Legal checkpoints (not legal advice; get a lawyer's review before collecting anything).** Pain, injury and training data count as health data in several places: the EU's GDPR treats health data as a special category that needs explicit, specific consent; Washington State's My Health My Data Act requires separate consent to collect and to share consumer health data, and covers fitness apps; the US FTC's Health Breach Notification Rule (updated 2024) covers health and fitness apps that hold identifiable health information; the amended COPPA rule requires verifiable parental consent before collecting personal information from children under 13. [RESEARCH] Simplest safe design: research data only from adults (18+); youth plans are built and kept on the phone only; health-check answers never leave the phone.

### 7.6 Safety guardrails in the product

* **Health check before every client plan** (§12.2): any red flag on the approved list → no automatic plan, "see a professional or a coach" (R2-GEN-03). Severe pain on the pain screen → the same (V1).
* **Coach bypass only in coach mode**, with a warning that the coach screens the client with their own onboarding (R2-GEN-03).
* **Liability release accepted every time a plan is built**, by clients and coaches alike; under-18s need a parent or guardian (§12.4). [LEGAL REVIEW]
* A short "not medical advice" line on the landing page, in the plan header and in every export.
* Repeated pain in check-ins → "see a professional" message and the "stop the block → maintenance" choice (and a coach alert in v2).
* **Testing safely** (R2-PER-07): tests only before or at the start and at the end, never in the middle of a block; anyone not coming off a completed training block is offered a 5- or 3-rep max or 80-90 % efforts, never a 1-rep max or an all-out mile "from zero"; a 1-rep max only for intermediate and up at the end of a completed block (or after "I just finished a training block", PROPOSED).
* **60+ clients** get no Olympic lifts, plyos or depth jumps by default; they can opt in, and the screen shows his warning to work with a fitness professional (R2-ATH-08). Clients in pain still never get overhead squats, snatches, low-bar squats or depth jumps (EQ-03). The engine's checks enforce both before a plan is shown.
* **Youth**: athletic plans allowed (ATH-09, ATH-13); floor Olympic lifts from about 14 after a block of hang work (R2-ATH-08); no data leaves the phone.

---

## 8. Open-source choices (Option D) [APPROVED defaults, R2-GEN-02]

**What there is to share, and what each licence means.**

| Piece | Generous (anyone may use, even commercially; must credit you) | Share-alike (anyone may use, but must share their changes under the same terms) | Keep closed |
|---|---|---|---|
| Engine code | MIT or Apache-2.0 (Apache adds an explicit patent grant) | AGPL-3.0 (anyone running a modified version as a website must publish their changes; Liftosaur and wger chose this) | private repository |
| Model data (rule tables, exercise tags, templates, sport profiles) | CC BY 4.0 (credit "based on the Blaze Camp model") | CC BY-SA 4.0 (improvements to the model must stay open) | private |
| Your videos, cue lines in your voice, your written explanations | (not recommended) | (not recommended) | All rights reserved; free to watch and link |
| The name and logo "Blaze Camp" | n/a | n/a | trademark: forks must rename; they may say "based on the Blaze Camp model" |
| Legal texts (release, health check wording) | not published as reusable templates; each operator needs its own legal review | - | - |
| Raw sheet dumps, client names, unpublished programs | never published | never published | never published |

[RESEARCH: licence terms from choosealicense.com; Creative Commons 4.0 covers databases and recommends against NonCommercial terms for open data; open-source licences do not grant trademark rights, which is why forks of trademarked projects rename (Hudson → Jenkins).]

**Approved default [R2-GEN-02]:** engine **Apache-2.0**, model data **CC BY 4.0**, videos, cues and the **Blaze Camp name kept his**. **When:** after Phase 0 (he approved the sample plans) and Phase 1 (real users), so the public version starts from a model he has signed off.

---

## 9. Cost, effort and time [INFERRED unless marked]

**Developer time (one experienced developer, full time; part-time or with an AI coding assistant, expect 1.3-2 times the calendar time).**

| Piece | Developer-weeks | Needed by |
|---|---|---|
| Engine (rule tables → plan, stairway, adaptation, explanations, checks) and its tests | 5-7 | all options |
| Intake screens (few-click flow), sport and activity picker, plan views (block / week / day with show chips), swaps, cues, video links | 3.25-4.25 | A, B |
| Health check, coach bypass, release flow and release log | 0.5-0.75 | A, B |
| Block / week / day images, print / PDF, share, calendar | 1.25-2 | A, B |
| Excel / Google Sheets download (C1) | 0.5-1 | A, B, C |
| Google Drive creation with sign-in (C2) + verification | 1-2 | v2, or C |
| Word lists and language switch (plumbing, not translation) | 0.5-1 | all |
| Check-in, adaptation, maintenance flow, logbook, progress | 2.5-3.5 | B |
| Offline, home-screen install, backup code | 1-1.5 | B |
| Open-source preparation | 1.5-2.5 | D |
| Accounts, coach mode, consented data, Olympic weightlifting program type (v2) | 8-12 | v2 |

**Totals.** A: about 11-16 weeks. B: about 14.5-21 weeks (A + 3.5-5). C alone: 7-10 weeks (C1) or 8-12 (C2). D: +1.5-2.5 weeks and 2-4 hours a week after release. v2: +8-12 weeks plus legal review. If a contractor builds it, cost ≈ developer-weeks × 40 hours × hourly rate (for example 14 weeks × 40 h × $60 = $33,600); rates vary widely by country and experience.

**Running costs (RESEARCH for prices; INFERRED totals).**

| Item | MVP and v1.1 | v2 |
|---|---|---|
| Domain name | ~$10-20 a year | same |
| Hosting (static site) | $0 (Cloudflare Pages free: unlimited bandwidth, 500 builds a month) | $0 |
| Video hosting | $0 (link-out to YouTube search; his own unlisted YouTube videos when filmed) | $0, or a paid host if wanted |
| Database and accounts | none | Supabase free tier, then Pro at $25 a month |
| Email (account links, coach invites, video submissions) | the video-contact inbox only | $0-20 a month on small volumes |
| Legal review of the health check, release (EN / ES) and disclaimers | **needed before launch** (one-off; get quotes) | plus privacy terms and consent |
| Health-check licence | $0 if we write our own short screen with the lawyer; a licence or permission if the official PAR-Q+ is embedded (§12.2) | same |
| Google verification for Drive export | not needed (C1 download) | free, takes time |

**Your time.**

| Task | Rough time |
|---|---|
| Grade 7 sample plans (R2-GEN-07) | ~7 hours |
| Answer round 3 (a handful of questions) | under 1 hour |
| Approve cue lines (AI-drafted from your notes) | ~350 one-liners; a few evenings |
| Approve Spanish | 2-4 days of review, spread out |
| Review check-in adjustments in the first month | ~1 hour a week |
| Film videos (optional, R2-GEN-02) | the 85 most-used in one 3-4 hour session, whenever you want |

---

## 10. Risks and mitigations

| Risk | Where | Mitigation |
|---|---|---|
| The engine misreads your style | all | The 7 graded sample plans become automatic tests; every plan shows "why" for each choice; model versions are stamped on plans. |
| Someone gets hurt following a plan | all | Health check (R2-GEN-03), pain rules (VOL-03), machine bias for injured clients (EQ-03), 60+ defaults (R2-ATH-08), safe testing (R2-PER-07), "see a professional" prompts, disclaimer, liability release every time. |
| The release does not hold up, or is not accepted the right way | all | Lawyer-written EN / ES text; unticked box plus a separate Build button; text version, role and time stored with each plan and printed on every export; parent or guardian for under-18s; legal review of whether an on-device record is enough (N-PROD-16). Parent-signed releases are not enforced in many US states, so youth plans carry extra risk. [RESEARCH] |
| A coach skips the health check and the client is unfit | coach mode | The bypass is only in coach mode, with a warning that the coach screens with their own onboarding, and the coach release (§12.3, §12.4). |
| Health-check text breaks copyright | all | The official PAR-Q+ is "All rights reserved" and is to be used only in its official, unmodified versions; either get permission or write our own short screen with the lawyer (§12.2, N-PROD-15). [RESEARCH] |
| People ignore the check-in | B | The plan still works and follows its stairway (R2-VOL-03); one screen; a reminder on the plan screen; no nagging notifications in the MVP. |
| A YouTube search shows poor technique | all | The link is clearly labelled as YouTube, not Blaze Camp; the cue under every exercise is his; coaches can pin a better link; his own videos replace links over time. |
| Missing sports or wrong positions | all | The picker comes from the merged sport profiles with a coverage table (04 v1.1); "Not listed? Pick the closest type" fallback (§13.4); users can report a missing sport. |
| Data lost on iPhones | B | Home-screen install (exempt from Safari's 7-day deletion), backup code, optional accounts in v2. |
| Spanish quality | all | He or a coach he trusts approves every line; English fallback flagged; users can report a bad translation. |
| Health-data law | v2 | No server data in MVP and v1.1; health-check answers never leave the phone; opt-in adults only; lawyer review before v2. |
| Copies of the open-source version give bad plans | D | Trademark (they can't use his name); publish only after he approves the model; tests shipped with the code. |
| Scope creep into "an app" | all | Each phase has a fixed list and a "done when" test (section 6). |

---

## 11. Decisions for you

### 11.1 Status of the v1 product questions

| ID | Question | Status after round 2 |
|---|---|---|
| N-PROD-01 | Option B, built from Option A, sheet as a download, open source after v1? | **APPROVED** (R2-GEN-02). |
| N-PROD-02 | Is the check-in step table right? | **APPROVED** (R2-VOL-01); the life column is removed because of R2-GEN-04 (§2.3; to confirm in round 3). |
| N-PROD-03 | PDF style? | **Answered** by R2-GEN-02: images of the whole block, one week or one day; print the block (one page per training day) or a week per page (§14). |
| N-PROD-04 | Google Sheets: download now, Drive later; one tab per week or all weeks stacked? | Download in phase 1 **APPROVED** (R2-GEN-02); Drive in v2. Layout default: all weeks stacked like 'JUSTICE LEAGUE' (PROPOSED). |
| N-PROD-05 | Open source: when and which licences? | **APPROVED** (R2-GEN-02): after v1; Apache-2.0 code, CC BY 4.0 model; videos, cues and name his. |
| N-PROD-06 | Which Spanish, gym terms in brackets, who approves? | **APPROVED** (R2-GEN-08). |
| N-PROD-07 | Videos: silent clips, 85 first, approved public videos meanwhile? | **Superseded** by R2-GEN-02: videos optional; link-out to YouTube search; his own videos later (§7.3). |
| N-PROD-08 | Learning data: adults only, opt-in, v2, after legal review? | Still open (not asked in round 2). Default as proposed. |
| N-PROD-09 | Business model: free site? coach mode free or paid? 'NO ACCESS'? | 'NO ACCESS' answered: a self-serve version without coach access (R2-LIB-08). Free vs paid still open; decide before v2. |
| N-PROD-10 | Plan names shown to users? | Still open; descriptive names in both languages by default. |
| N-PROD-11 | The 8 knee-band core exercises: drop, or a ball or pad squeeze instead? | Still open (library question); default: ball or pad squeeze. |
| N-PROD-12 | Units: lb in the US, kg elsewhere, switchable? | **APPROVED** (R2-GEN-08). |

### 11.2 New questions (round 3 candidates; only what blocks the product)

| ID | Question | Our suggestion |
|---|---|---|
| N-PROD-13 | "Every time they're going to get it": accept the release each time a plan is **built or rebuilt** (new plan, new block, changed answers), or also each time a saved plan is opened or a weekly check-in is sent? | Each build or rebuild, including the start of every new block; not on re-opening or on check-ins (fewest clicks). |
| N-PROD-14 | Where should "send us your video" go: an email address, a form, or a social account? | One email address or a simple form; placeholder `[VIDEO_CONTACT]` until you pick. |
| N-PROD-15 | Health check: license the official PAR-Q+ (copyrighted, "All rights reserved", official unmodified versions only, no Spanish version listed on its site), or have a lawyer write a short Blaze Camp screen covering the same topics plus your five refer items? Who writes and approves the release in English and Spanish? | Our own short screen written with a lawyer for the MVP, with a link to the official PAR-Q+ online for anyone who wants it; you approve the lawyer's text. |
| N-PROD-16 | The release record lives only on the person's phone and is printed on every export. Is that enough for you, or do you want a server log of who accepted what (that means collecting names or emails, privacy terms and a lawyer's sign-off)? | Phone record + printed on exports for the MVP; server log only with accounts in v2, if the lawyer advises it. |
| N-PROD-17 | Competitive Olympic weightlifters need their own percentage-based programming (R2-GEN-06). Until that program type exists (v2), what should the picker do if someone picks "Olympic weightlifting (competitive)"? | Show it, explain that a dedicated weightlifting program is coming, and offer the athletic strength-and-power plan meanwhile. |
| N-PROD-18 | Recreational and "stay active" users do not get a season (GEN-02). Some activities have an event date (a first HYROX race, a first 5K or half marathon, a ski trip, a hiking trip, a pickleball tournament). Offer an optional "event date" under More options so the plan peaks and tapers for it? | Yes, optional, only for event-type activities; no position and no season. |
| N-PROD-19 | You said 10 is "the max I can do, not a fail" and "we can add a fail with it if we need to" (R2-VOL-02). Your HOW IT FELT menu already has "Couldn't do it". Use that as the fail answer (one level down or an easier version next week, sets unchanged, your GEN-05 rule), or add a separate 'Failed' answer that also holds the week and removes a set (the volume file's proposal)? | Use your "Couldn't do it" (no new button, your own words and rule). |
| N-PROD-20 | Olympic lifts: no percentages by default, even with a tested max (R2-GEN-06). May a coach switch percentages on for one athlete who has tested that lift (your 4 × 8 @ 75 % → 4 × 4 @ 90 % ramp, R2-ATH-05)? | Yes, coach mode only, per athlete and per lift; clients never see it on by default. |

---

## 12. Start flow: who you are, health check, liability release (R2-GEN-03) [flow PROPOSED; all copy LEGAL REVIEW]

### 12.1 The flow

```
Landing (EN|ES, lb|kg)
   |
   v
Who is this plan for?  ---- "Me" (client) ------------------> 12.2 Health check (PAR-Q style)
   |                                                              | any red flag -> REFER (no automatic plan)
   | "A client: I'm a coach or trainer"                           | all clear -> continue
   v                                                              v
12.3 Coach: "Run the health check with my client now" ----> same health check, coach taps the answers
            "Skip: I follow my own onboarding (SOP)" -----> coach warning (C1) -> continue
   |
   v
About you -> Goal -> Sport or activity -> Schedule -> Plan type and tests -> Equipment -> Pain -> (More options)
   |
   v
12.4 Liability release (client or coach version) + unticked "I have read and accept" + [Build my plan]
   |      (under 18: a parent or guardian accepts)
   v
Plan (Block / Week / Day)  -- every rebuild or new block shows 12.4 again (N-PROD-13)
```

### 12.2 Health check for clients (PAR-Q style) [R2-GEN-03]

* **Who sees it:** every client ("Me"), and coach-mode users who choose "Run the health check with my client now".
* **The refer list (APPROVED, R2-GEN-03):** chest pain or a heart condition (we added "fainting" to the same item: PROPOSED, LEGAL REVIEW); surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury currently under treatment; a doctor said not to train. Any yes → **no automatic plan**, the refer message (C3), and a pointer to a professional or a coach.
* **The PAR-Q part:** he asked for the PAR-Q ("If you're a client, then we take them through the park queue"). The official PAR-Q+ is copyrighted by the PAR-Q+ Collaboration ("All rights reserved"), is meant to be used only in its official, unmodified versions, and has an official online version; its site lists no Spanish translation [RESEARCH, eparmedx.com, 2026-10-08]. So the product has two routes, decided in N-PROD-15:
  * **(a) Official PAR-Q+**, only with permission from the PAR-Q+ Collaboration, shown unmodified, with its own follow-up logic; Spanish only if an official translation or permission exists.
  * **(b) Blaze Camp short screen (recommended for the MVP)**: the five refer items plus a few general questions on the same topics (heart and blood pressure, chest pain, dizziness or loss of balance, a bone, joint or soft-tissue problem made worse by exercise, a chronic condition or medicine a doctor manages), written with the lawyer in our own words, plus a link to the official PAR-Q+ online for anyone who wants it. Answers to the general questions that are not on the refer list lead to "check with your doctor before you start" and an unticked "My doctor or a qualified professional has cleared me to exercise" box before continuing [PROPOSED; LEGAL REVIEW].
* **Fewest clicks:** one screen with all items as yes / no switches pre-set to "no" is **not** allowed (a pre-set answer is not an answer); instead one big button "None of these apply to me" and a "Some apply" button that opens the switches [INFERRED; LEGAL REVIEW].
* **Privacy:** the answers stay on the phone, are never put in share links, images or exports, and are never part of research data.

### 12.3 Coach mode: run the check or bypass it [R2-GEN-03]

His words: "If you're a coach, it should be able to be toggled: do you want to follow your park queue because you are not a fitness professional, or are you a fitness professional just pulling a program for one of your clients? ... I want to be able to bypass it if I'm a coach and I just want to get it done. Meaning that it should have some type of legal warning to the coach."

* Coach mode asks once per plan: **"Run the health check with my client now"** or **"Skip: I'm a fitness professional and I screen my clients with my own onboarding"**.
* Choosing Skip shows the coach warning (C1) and sets `health.route = coach_own_sop`; the coach release (C5) then includes the screening responsibility.
* The bypass is never offered on the client door [PROPOSED].
* A coach who builds for many clients can make Skip their default in settings (fewest clicks), but the warning line stays visible on the screen and the release is still accepted every time [PROPOSED].

### 12.4 Liability release: everyone, every time [R2-GEN-03]

His words: "We want everyone that's using it, every time they're going to get it, to release liability, whether it be a client or a coach."

* **Who:** every client and every coach. Two versions: client (C4) and coach (C5). Under 18: a parent or legal guardian reads and accepts (C6); a parent's acceptance is not enforced in many US states, which the lawyer must weigh [RESEARCH].
* **When:** on the last screen before a plan is built, every time a plan is built or rebuilt, including the start of each new block (interpretation PROPOSED; N-PROD-13).
* **How (clickwrap):** the full text on screen (scrollable), an **unticked** "I have read and accept this release" box, and a separate **Build my plan** button that only works when the box is ticked. Pre-ticked boxes are not real consent; the record should hold who accepted, when, and which version of the text [RESEARCH]. Typing a full name as a signature is optional pending the lawyer (N-PROD-16).
* **Record:** `{text_version, language, role, accepted_at, plan_id, signer_name?, guardian?}` saved on the phone and printed in the footer of every image, PDF and sheet ("Release v0.1 accepted 2026-10-12 by the client"). Nothing is sent to a server in the MVP (N-PROD-16).
* **Fewest clicks:** the acceptance is the same tap row as the Build button (one tick + one tap).

### 12.5 Copy text placeholders (EN / ES) [LEGAL REVIEW: placeholders only, not final legal text]

Keys follow the word-list convention (`ui.start.*`, `health.*`, `release.*`, `warn.*`). Spanish is neutral Latin American (R2-GEN-08) and needs the same legal review.

| Key | English | Español |
|---|---|---|
| C0 `ui.start.role` | Who is this plan for? · **Me** · **A client (I'm a coach or trainer)** | ¿Para quién es este plan? · **Para mí** · **Para un cliente (soy entrenador/a)** |
| C1 `warn.coach_bypass` | You chose to skip the health check. You confirm you are a fitness professional and that you screen this client with your own onboarding procedures (health questionnaire, and medical clearance when needed) before they start. Blaze Camp has not screened this client. [LEGAL REVIEW] | Elegiste omitir el chequeo de salud. Confirmas que eres profesional del fitness y que evalúas a este cliente con tus propios procedimientos de ingreso (cuestionario de salud y autorización médica cuando haga falta) antes de que empiece. Blaze Camp no ha evaluado a este cliente. [REVISIÓN LEGAL] |
| C2 `health.intro` | Before we build your plan, a few health questions. If any of these apply to you, please talk to a doctor or a qualified professional first. [LEGAL REVIEW] | Antes de crear tu plan, unas preguntas de salud. Si alguna aplica a tu caso, habla primero con un médico o un profesional calificado. [REVISIÓN LEGAL] |
| C2b `health.none` / `health.some` | **None of these apply to me** · **Some apply** | **Ninguna aplica a mi caso** · **Algunas aplican** |
| C3 `health.refer` | Thank you for being honest. With this answer we can't build an automatic plan for you right now. Please talk to your doctor or a qualified health professional first. When you are cleared, a coach can build your plan with you. [LEGAL REVIEW] | Gracias por tu sinceridad. Con esta respuesta no podemos crear un plan automático para ti en este momento. Habla primero con tu médico o con un profesional de la salud calificado. Cuando tengas su autorización, un entrenador puede crear tu plan contigo. [REVISIÓN LEGAL] |
| C3b `health.cleared` | ☐ My doctor or a qualified professional has cleared me to exercise. [LEGAL REVIEW] | ☐ Mi médico o un profesional calificado me autorizó a hacer ejercicio. [REVISIÓN LEGAL] |
| C4 `release.client` | **Liability release (version [RELEASE_VERSION])** [LEGAL REVIEW: placeholder, not final] Exercise carries risks, including injury. This plan is general fitness information, not medical advice, and does not replace a doctor or an in-person coach. I take part voluntarily. I will train within my limits, stop if I feel pain, dizziness or chest discomfort, and get medical advice when I need it. I accept these risks and, to the extent the law allows, release Blaze Camp, its coaches and the people who built this tool from liability for injury or loss from using this plan. [Governing law, minors and exact wording: LEGAL REVIEW] ☐ I have read and accept this release. **[Build my plan]** | **Descargo de responsabilidad (versión [RELEASE_VERSION])** [REVISIÓN LEGAL: texto provisional, no final] El ejercicio implica riesgos, incluidas lesiones. Este plan es información general de acondicionamiento físico, no es consejo médico y no reemplaza a un médico ni a un entrenador presencial. Participo de forma voluntaria. Entrenaré dentro de mis límites, me detendré si siento dolor, mareo o molestias en el pecho, y buscaré consejo médico cuando lo necesite. Acepto estos riesgos y, en la medida en que la ley lo permita, libero a Blaze Camp, a sus entrenadores y a quienes crearon esta herramienta de toda responsabilidad por lesiones o pérdidas derivadas del uso de este plan. [Ley aplicable, menores y redacción exacta: REVISIÓN LEGAL] ☐ Leí y acepto este descargo. **[Crear mi plan]** |
| C5 `release.coach` | **Coach release (version [RELEASE_VERSION])** [LEGAL REVIEW: placeholder] I am building this plan for someone else. I am responsible for screening my client, following my own onboarding procedures and liability documents, adapting this plan to my client, and supervising or advising them as my profession requires. To the extent the law allows, I release Blaze Camp, its coaches and the people who built this tool from liability arising from plans I build or deliver with it. ☐ I have read and accept this release. **[Build the plan]** | **Descargo de responsabilidad para entrenadores (versión [RELEASE_VERSION])** [REVISIÓN LEGAL: texto provisional] Estoy creando este plan para otra persona. Soy responsable de evaluar a mi cliente, de seguir mis propios procedimientos de ingreso y documentos de responsabilidad, de adaptar este plan a mi cliente y de supervisarlo o asesorarlo como lo exige mi profesión. En la medida en que la ley lo permita, libero a Blaze Camp, a sus entrenadores y a quienes crearon esta herramienta de toda responsabilidad derivada de los planes que cree o entregue con ella. ☐ Leí y acepto este descargo. **[Crear el plan]** |
| C6 `release.minor` | Under 18: a parent or legal guardian must read and accept this release. Guardian's name: [ ] [LEGAL REVIEW] | Menores de 18 años: un padre, madre o tutor legal debe leer y aceptar este descargo. Nombre del tutor: [ ] [REVISIÓN LEGAL] |
| C7 `warn.older_athletic` | From age 60, Olympic lifts, jumps and plyometrics are not in your plan by default. You can add them. Make sure you have a fitness professional to help you understand what this means. (his wording, R2-ATH-08) | A partir de los 60 años, los levantamientos olímpicos, los saltos y la pliometría no se incluyen en tu plan por defecto. Puedes añadirlos. Asegúrate de contar con un profesional del fitness que te ayude a entender lo que esto implica. |
| C8 `video.link` / `video.note` | **Watch how** (opens YouTube) · Videos open on YouTube and are not made by Blaze Camp. We're building our own library. Have a great video of this exercise? Send it to [VIDEO_CONTACT]. | **Ver cómo se hace** (abre YouTube) · Los videos se abren en YouTube y no son de Blaze Camp. Estamos creando nuestra propia biblioteca. ¿Tienes un buen video de este ejercicio? Envíalo a [VIDEO_CONTACT]. |
| C9 `effort.how_hard` | **How heavy?** Each exercise tells you how many reps to leave in the tank: "leave 2 in the tank" means you could do 2 more reps at the end of the set (about RPE 8; 3 left = RPE 7, 1 left = RPE 9). The first weeks leave more in the tank, the last weeks less. Week 1: start a little lighter, with a weight you could lift 2-3 more times. | **¿Cuánto peso?** Cada ejercicio te dice cuántas repeticiones dejar en reserva: "deja 2 en reserva" significa que podrías hacer 2 repeticiones más al final de la serie (aproximadamente RPE 8; 3 en reserva = RPE 7, 1 en reserva = RPE 9). Las primeras semanas dejas más en reserva y las últimas, menos. Semana 1: empieza un poco más ligero, con un peso que podrías levantar 2-3 veces más. |
| C10 `effort.olympic` | **Olympic lifts are for power.** Cleans, snatches and their dumbbell and kettlebell versions train power: move the weight as fast as you can with clean technique. Pick a weight you can move explosively on every rep; if it slows down or your technique breaks, it's too heavy. You don't need percentages for these unless you compete in Olympic weightlifting. | **Los levantamientos olímpicos son para la potencia.** Las cargadas (cleans), las arrancadas (snatches) y sus versiones con mancuernas y kettlebells entrenan potencia: mueve el peso lo más rápido que puedas con buena técnica. Elige un peso que puedas mover de forma explosiva en cada repetición; si se frena o se rompe la técnica, es demasiado pesado. No necesitas porcentajes para estos levantamientos, a menos que compitas en halterofilia (Olympic weightlifting). |
| C11 `maint.end` | Your maintenance weeks are done. What next? **Keep maintaining** (+1 / +2 / +4 weeks) · **Change my plan** · **Start a training block** | Terminaste tus semanas de mantenimiento. ¿Qué sigue? **Seguir en mantenimiento** (+1 / +2 / +4 semanas) · **Cambiar mi plan** · **Empezar un bloque de entrenamiento** |
| C12 `block.cannot_finish` | This block looks hard to finish right now. Blocks are meant to be completed, so instead of an easy week in the middle you can stop this block, do a maintenance phase (you choose how long), and then start a brand-new block. **Keep going** · **Stop the block and start maintenance** | Este bloque se ve difícil de terminar en este momento. Los bloques están hechos para completarse; en lugar de una semana suave a la mitad, puedes detener este bloque, hacer una fase de mantenimiento (tú eliges cuánto dura) y luego empezar un bloque nuevo. **Seguir** · **Detener el bloque y empezar mantenimiento** |
| C13 `effort.ten` | 10 - I'm done: the most I could do, and I made it. (If you couldn't finish a set, mark that exercise "Couldn't do it".) | 10 - No puedo más: lo máximo que podía hacer, y lo logré. (Si no pudiste terminar una serie, marca ese ejercicio como "No pude hacerlo".) |
| C14 `ui.disclaimer` | Not medical advice. Train within your limits. | No es consejo médico. Entrena dentro de tus límites. |
| C15 `block.done` | You finished your block. What next? **Next block** (one easy week, then your next block one step up) · **Maintenance** (you choose how long) · **Change my plan** | Terminaste tu bloque. ¿Qué sigue? **Siguiente bloque** (una semana suave y luego tu siguiente bloque, un escalón más arriba) · **Mantenimiento** (tú eliges cuánto dura) · **Cambiar mi plan** |

### 12.6 Fewest clicks: the express path [R2-GEN-02; counts INFERRED]

Rules: one question per screen; big buttons that move on by themselves; numbers by stepper with a sensible start value; units, language and session length pre-filled; everything optional under "More options"; nothing asked that the engine does not use (R2-GEN-04).

| Path | Screens (taps) | About |
|---|---|---|
| Client, gym goal | role (1) · health "none apply" (1) · about you: age, weight, years (3) · goal (1) · days (1) · minutes (1, pre-filled) · plan type (1, default 12 weeks) · equipment (1) · pain "nothing" (1) · release tick + Build (2) | 13-14 taps |
| Client, "stay athletic and active" | as above + activity (1-2) | 14-16 taps |
| Competitive athlete | as above + competitive (1) · sport (1-2, with search) · position (1) · level of play (1) · season start date (2) · practice and game days (2) | 20-22 taps |
| Coach, bypass on by default | role (1) · about the client (3) · goal (1) · … · release tick + Build (2); or "Duplicate a previous client's plan" and change what differs | 11-13 taps |

---

## 13. Sport and activity picker (COACH-CHAT 2026-10-08; R2-GEN-05; GEN-02) [PROPOSED]

His request: for the athletes, all of the popular sports in the United States, swimming included; for the general population, pickleball, because "Gen Pop and general fitness people are wanting to do things like high rows and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." We read "high rows" as **HYROX**, the indoor fitness race (INFERRED from the context of gen-pop fitness events next to pickleball; to confirm).

**Where the profiles come from.** Four research files are being written in parallel and merged into `04_profiles.json` v1.1: `synthesis/sports/team.json`, `aquatic-endurance-track.json`, `combat-strength-fitness.json`, `genpop-active.json`. The ids below are **provisional**; the merge step reconciles them with the existing 27 profile ids (kept as they are) and publishes the final list in `generator_spec_v1.json > vocab.profiles` and `inputs_schema.fields.F11 / F11r`. `team.json` is already written (53 profiles, position-level ids such as `football_qb`, `basketball_guard`, `lacrosse_w_midfield`, `rec_basketball`); the team rows below and the spec picker (`F11.picker.groups[team_field_court]`, `profiles_v1_1`) already point to those ids (OBSERVED, `synthesis/sports/team.json`, 2026-10-08). `aquatic-endurance-track.json` (30 profiles, e.g. `swimming_sprint` / `_middle` / `_distance`, `rec_swimming`) and `combat-strength-fitness.json` (21 profiles, e.g. `karate` and `taekwondo` separately, `weightlifting`, `physique_competitive`, `crossfit_class`) arrived during the v1.1 verification and are mapped the same way in the spec; padel has no profile yet (it uses the pickleball, then tennis profile).

### 13.1 Two doors on the goal screen

| Goal tile (EN / ES) | Who | Then | Profile |
|---|---|---|---|
| **Train for my sport** / **Entrenar para mi deporte** | People who compete, or train for a sport | "Do you compete?" → **Yes** → §13.2 · **I play for fun** → §13.3 · **No sport, I just want to be athletic** → "A bit of everything" | sport profile (+ position variant); recreational → activity |
| **Stay athletic and active** / **Mantenerme atlético y activo** (new) | Gen pop and general-fitness people who play or do something active: pickleball, HYROX, tennis, golf, rec leagues, running, hiking ... | §13.3 activity picker; no position, no season (GEN-02) | activity profile from `genpop-active`, else `weekend_warrior` + activity tag |

Both doors land in the same engine family (athletic); "Stay athletic and active" is simply the recreational path made visible on the first screen so gen-pop users see it as an option for them (COACH-CHAT 2026-10-08) [PROPOSED].

### 13.2 Competitive sports: every popular US sport, with positions [R2-GEN-05 approved; list PROPOSED]

Screen order: sport (tiles for the most chosen + search box, EN / ES names) → position or event group (only where it changes the training) → level of play (youth / high school / college / pro / masters / amateur; swimming adds age-group / club) → **next season start date**, or "I'm in season until", or a competition / fight / meet date, or "no season right now" → **practice days per week and game (meet, match, fight) days** (R2-GEN-05). The tool works out off-season, pre-season (a 4-6-week block at about 60 % of off-season sets with more speed and power, then a 1-2-week taper; R2-PER-06) and in-season (R2-ATH-07).

| Group (source file) | Sport (provisional id; existing profile ids in bold) | Position / event choices shown |
|---|---|---|
| Team field and court (`team`) | American football (`american_football` → **football_skill**, **football_big_skill**, **football_lineman**; team.json: `football_qb`, `football_rb`, `football_wr_db`, `football_te_lb`, `football_ol`, `football_dl`, `football_k_p`) | QB · RB · FB · WR · TE · OL · DL · LB · CB · S · K / P |
| | Flag football (`flag_football`) | none shown (one competitive profile; team.json lists QB / center / WR / rusher / DB inside it) |
| | Basketball (**basketball**) | guard · wing · big |
| | Baseball (**baseball_position**) | pitcher · catcher · infield · outfield |
| | Softball (**softball**) | pitcher · catcher · infield · outfield |
| | Soccer (**soccer**) | goalkeeper · defender · midfielder · forward |
| | Ice hockey (**hockey**) | forward · defense · goalie |
| | Volleyball, indoor (**volleyball**) | outside / opposite · middle · setter · libero |
| | Beach volleyball (`beach_volleyball` → team.json `volleyball_beach`) | none (or blocker · defender) |
| | Lacrosse (`lacrosse`) | men's or women's, then attack · midfield · defense · goalie (team.json `lacrosse_m_*` / `lacrosse_w_*`) |
| | Field hockey (`field_hockey`) | forward · midfield · defense · goalkeeper |
| | Rugby (`rugby`) | forwards · backs · sevens (team.json `rugby_sevens`) |
| | Cheerleading / stunt (`cheerleading`) | base · flyer · back spot · tumbler (team.json: bases and back spots → `cheer_base_spot`; flyers and tumblers → `cheer_flyer_tumbler`) |
| | Competitive dance / drill team (`dance_team`, added in the v1.1 verification) | none; until a profile is written it uses the flyers-and-tumblers profile (INFERRED) |
| | Ultimate (`ultimate`) | handler · cutter |
| Aquatic, endurance and track (`aquatic-endurance-track`) | **Swimming** (`swimming`) | event group: sprint (50-100) · middle (200-400) · distance (800-1500 / open water); main stroke: free · back · breast · fly · IM |
| | Diving (`diving`) | springboard · platform |
| | Water polo (`water_polo`) | field player · center · goalkeeper |
| | Track and field (**track_sprinter** and variants) | sprints 100-200 · 400 · hurdles · jumps (long, triple, high, pole vault) · throws (shot, discus, javelin, hammer) · 800-1500 |
| | Cross country and road running (**distance_runner**) | 5K-10K · half marathon · marathon (his half-marathon plan used as-is; no 21.6-mile run, R2-LIB-06) |
| | Triathlon (`triathlon`) | sprint / Olympic · 70.3 · full |
| | Cycling (`cycling`) | road · mountain · track |
| | Rowing (`rowing`) | sweep · sculling |
| | Alpine skiing / snowboarding (`ski_snowboard`) | alpine · freestyle · snowboard |
| | Figure skating (`figure_skating`, added in the v1.1 verification) | singles · pairs / ice dance; until a profile is written it uses the gymnastics profile `gymnastics_artistic` (INFERRED) |
| Combat (`combat-strength-fitness`) | Wrestling (**wrestling**), Boxing (**boxing**), MMA (**mma**), BJJ / grappling (**bjj_grappling**), Judo (`judo`), Karate / Taekwondo (**karate_taekwondo**), Kickboxing / Muay Thai (**kickboxing_muay_thai**), Fencing (`fencing`, added in the v1.1 verification; until profiled it uses the tennis profile: fast lunging footwork, mostly unilateral, INFERRED) | weight class: light · middle · heavy (heavier fighters get more resistance work, ATH-03) |
| Strength and fitness sports (`combat-strength-fitness`) | Powerlifting (**powerlifting_strength**), Olympic weightlifting (`olympic_weightlifting`, its own %-based program type, N-PROD-17), Strongman (`strongman`), CrossFit (**crossfit_competitor**), HYROX (`hyrox_competitive`), Obstacle course racing (`ocr`), Bodybuilding / physique (**bodybuilding_aesthetics**), Gymnastics (`gymnastics`), Climbing / bouldering (`climbing`) | HYROX: singles open · singles pro · doubles / relay; physique: bodybuilding · classic · men's physique · bikini / figure / wellness |
| Racket and club (`combat-strength-fitness`) | Tennis (**tennis**), Pickleball (`pickleball_competitive`), Padel (`padel_competitive`), Golf (**golf**); added in the v1.1 verification, routed to the nearest profile until one is written (INFERRED): Badminton / squash / racquetball / table tennis (`racket_other` → tennis), Bowling (`bowling` → golf) | singles · doubles (racket sports) |
| Youth | Any sport above with age under 18 uses the youth rules (**youth_athlete**; floor Olympic lifts from about 14 after a hang block, R2-ATH-08) | as the sport |

Sport popularity sources for the list: the SFIA participation reports (pickleball has been the fastest-growing US sport for four years, 19.8 million players in 2024) and the coverage table the merge step writes into `04_athlete_profiles.md` v1.1 [RESEARCH]. The v1.1 verification added figure skating, competitive dance / drill, fencing, the smaller racket sports and bowling, which are common US school and college sports but were missing from the research lists; they need profiles from the merge or sport-verification step (until then they use the nearest profile named above).

### 13.3 "Stay athletic and active" activities (gen pop; recreational) [PROPOSED]

Pick up to two (the first one leads). No position, no season (GEN-02). Optional under More options: which days you play (so the hardest gym days stay away from the day before you play) and, for event-type activities, an event date (N-PROD-18).

| Tile (EN / ES) | Provisional id (`genpop-active`) | Notes |
|---|---|---|
| Pickleball / Pickleball | `rec_pickleball` | many players are 50+; knee, Achilles and shoulder care; lateral movement; 60+ defaults apply (R2-ATH-08) |
| HYROX / HYROX | `hyrox_fitness` | first race or fitness goal; the race is 8 × 1 km runs, each followed by a workout station [RESEARCH] |
| Tennis / Tenis | `rec_tennis` | |
| Padel / Pádel | `rec_padel` | |
| Golf / Golf | `rec_golf` | |
| Rec league / Liga recreativa | `rec_league` + league sport: basketball · soccer · softball · flag football · volleyball · ice hockey · ultimate · kickball | the league sport sets the movement demands (team.json: `rec_basketball`, `rec_soccer`, `rec_softball`, `rec_flag_football`, `rec_volleyball`, `rec_hockey`, `rec_ultimate`; kickball → `weekend_warrior`, INFERRED); no position |
| Running for fitness / Correr por salud | `run_fitness` | first 5K / 10K, run club |
| Hiking and rucking / Senderismo y caminata con mochila (rucking) | `hike_ruck` | |
| Cycling / indoor cycling / Ciclismo / ciclismo indoor | `cycling_fitness` | |
| Lap swimming / Natación por salud | `lap_swim` | |
| Ski / snowboard season prep / Preparación para esquí o snowboard | `ski_snow_prep` | |
| Surf and paddleboard / Surf y paddle | `surf_paddle` | |
| Dance and fitness classes / Baile y clases de fitness | `dance_fitness` | |
| A bit of everything / Un poco de todo | **weekend_warrior** | his former 'Justice League' program: non-competitive all-round athletic adults and youth (ATH-13) |

What an "athletic but not competitive" plan contains (some power, some agility, core, resistance and aerobic work, and how much) is defined in `genpop-active` and `04_athlete_profiles.md` v1.1, in his terms. Age-based rules (60+, youth) apply automatically from the age on the "About you" screen.

**The option also shows up for gen-pop goals [PROPOSED].** So that people who chose "Lose fat" or "General fitness and health" also see that staying athletic is an option for them (COACH-CHAT 2026-10-08), the goal screen keeps a one-line link under those tiles: "Do you also play something (pickleball, HYROX, tennis ...)? Add it" → the same activity list (one tap, optional). The plan keeps its fat-loss or general goal and adds the activity's athletic work and the play-day spacing.

### 13.4 Not listed

"Not listed? Pick the closest: court sport · field sport · endurance · combat · strength and power · water sport · board and snow" → the nearest generic profile of that type, plus a "Tell us your sport" box so the list can grow [PROPOSED]. Examples that go through this door for now: equestrian, archery and shooting, rodeo, skateboarding, competitive surfing.

---

## 14. Views, screenshots and exports (R2-GEN-02) [layout PROPOSED]

His words: "The better I can see the macro view of the week, the macro view of the block, and the macro view per day. I should be able to have the options for visibility easily toggled ... if a coach creates a program for somebody, they can just screenshot their 12 weeks and send it over to them, or they can screenshot 1 week and send it over to them."

### 14.1 One toggle, three views

* A sticky **BLOCK | WEEK | DAY** switch at the top of the plan. Tapping a week in the block view opens that week; tapping a day opens that day; swiping moves to the next week or day.
* **Show chips** under the switch, remembered per view: exercises · sets × reps · effort (RIR / RPE) · rest · cues · cardio · jumps and throws · sets per muscle. Defaults: block = exercises + sets × reps; week = exercises + sets × reps + cardio; day = everything.
* **Where you land**: clients open on today's Day view; coaches open on the Block view (PROPOSED).
* **Cardio control** in the week view: "Cardio: less · as planned · more" adds or removes one aerobic session per tap (R2-SES-06).

### 14.2 The block view (the whole 12 weeks on one screen)

Because the exercises stay the same inside an exercise block (PER-02; one-detail variations only between exercise blocks, R2-LIB-01), the whole block fits in one compact table per training day: the exercises down the side, the weeks across, sets × reps in each cell (a thin line marks the exercise-block changes at weeks 5 and 9). A thin stairway bar on top shows the 12 steps from "easy start" to "hardest weeks" with each week's 2 → 11 level (R2-PER-03, R2-PER-04, R2-PER-05; 12 v1.1 §3.7.2), with the test weeks marked (R2-PER-07).

```
STAIRWAY  W1 ▁ W2 ▁ W3 ▂ W4 ▂ W5 ▃ W6 ▃ W7 ▄ W8 ▄ W9 ▅ W10 ▆ W11 ▇ W12 █ (test)
level      2   2.6  3.2  3.8  4.4  5    6    7    8    9    10   11
MONDAY · Day A           W1    W2    W3    W4   ...  W11   W12
Dead Bug                 2x10  2x10  2x10  2x10      2x10  2x10
Low Box Jump             3x5   3x5   3x5   4x5       4x5   test
Hang Power Clean         4x3   4x3   4x3   5x3       5x3   5x3
Back Squat               3x6   3x6   3x6   4x6       4x5   test
Chest-Supported Row      3x10  3x10  4x10  4x10      4x8   4x8
...
```
(numbers illustrative; the real cells come from the stairway in `12` / `06` v1.1; on test weeks the test replaces that week's top sets)

### 14.3 The week and day views

* **Week**: the 7 days as a vertical list on the phone (a 7-column grid on a wide screen): day title, about how long, the exercises with sets × reps, rest days, cardio sessions.
* **Day**: the full exercise cards (§3.1 sketch).

### 14.4 Screenshots and exports

| Button | What it makes | Notes |
|---|---|---|
| **Save block as image** | One tall image per training day with the 12 week columns, or one image of the whole block (the user picks) | language, units, plan name, model version, release line and "not medical advice" baked in; no age, weight, pain or health answers |
| **Save week as image** | One image of the whole week | the coach's "screenshot 1 week and send it" |
| **Save day as image** | One image of the day, phone-sized | |
| **Share** | Opens the phone's share sheet with the image (text it, WhatsApp it) | fewest clicks for coaches sending to clients (INFERRED: supported by current mobile browsers; confirm in the build spike) |
| **Print / PDF** | Block (one landscape page per training day with the week columns) or week (one page per week) | Letter / A4 by region |
| **Google Sheets / Excel** | His BYOP columns, all weeks stacked | §3.3 C1 |
| **Share link** | The plan without personal fields | |
| **Add to calendar** | One event per training day | |

---

## 15. Weight guidance: reps in reserve, RPE, and Olympic lifts as power (R2-GEN-06) [APPROVED rule; wording PROPOSED]

* **Default language: reps in reserve with the RPE number beside it.** "Leave 2 reps in the tank (2 RIR · RPE 8)" (VOL-13: "add an explanation of RIR and how it relates to RPE"). Mapping shown on the "How hard?" page: 3 reps left = RPE 7, 2 = RPE 8, 1 = RPE 9, 0 = RPE 10 (spec `rule_tables.effort.rir_rpe`). The number on each exercise is the plan's planned effort for that week: it stays inside his 1-3 RIR band and moves with the stairway (about 3 RIR in the early weeks, 2 in the middle, 1-2 and then 1 in the last weeks; 12 v1.1 §3.7.2, PROPOSED drift, flagged there against VOL-13's "no planned RIR ramp").
* **Week-1 tip:** "pick a weight you could lift 2-3 more times" (R2-GEN-06; copy C9).
* **Percentages only with a recent tested best,** and only on barbell main lifts (R2-GEN-06; PER-09). Untested lifts and maxes always use RIR / RPE: "if they haven't tested their Olympic lifts, 1-rep maxes, or anything like that, then they should pick an RPE or reps in reserve."
* **Olympic lifts are explained as power output** (copy C10): move it fast; if it slows down or technique breaks, it is too heavy. The coach's eye on speed matters; full squat cleans and snatches use 3-5 reps per set (R2-ATH-05). **By default an Olympic lift never shows a percentage**, even when that lift has a tested best: "they don't necessarily need to go by percentage unless you're a competitive Olympic lifter" (R2-GEN-06). A coach (coach mode, rule pack) may switch percentages on for an athlete whose own tested best on that lift exists; the % then comes from that lift's own max (R2-ATH-05) [opt-in PROPOSED, N-PROD-20].
* **Competitive Olympic weightlifters** are their own program type with percentage-based programming ("completely different but kind of the same on here", R2-GEN-06); built in v2 (N-PROD-17).
* **Effort 10 in the check-in** means "the most I could do, and I made it" (R2-VOL-02; copy C13); never to failure on heavy compounds (GEN-08).

---

## Appendix E · For the engineer

### E1 · Stack [PROPOSED]

* **Static single-page web app**, TypeScript, a small UI library (Preact or Svelte), built to static files. No server needed for the MVP and v1.1.
* **Hosting:** Cloudflare Pages (free plan: unlimited bandwidth, 500 builds a month; confirm current terms for a commercial site before launch). Avoid GitHub Pages for the product site (its terms say it is not meant for commercial / SaaS sites); it is fine for open-source docs. [RESEARCH]
* **PWA:** web app manifest + service worker caching the app shell, the compiled model and the word lists; videos and YouTube links online only. Request persistent storage (`navigator.storage.persist()`).
* **Storage:** IndexedDB through a thin wrapper; schema-versioned with migrations (intake/1 → intake/2 drops `recovery`; checkin/1 → checkin/2 drops `life`).
* **i18n:** i18next-style JSON namespaces (`ui`, `health`, `release`, `warn`, `sports`, `exercise_names`, `cues`, `explain`, `instructions`, `checkin`) with CLDR plurals; ICU only if needed. [RESEARCH]
* **Exports:** print CSS (`@media print`, block = one landscape page per training day, week = one page per week, `break-after: page`); DOM-to-PNG for block / week / day images rendered off-screen at full length (not just the viewport); Web Share API with files for the share sheet, falling back to download; ExcelJS (MIT) for .xlsx with data validation lists and conditional fills, lazy-loaded; `.ics` for calendar. Optional later: pdf-lib / jsPDF. [RESEARCH; share-sheet support INFERRED, spike]
* **Google Drive export (v2, C2):** Google Identity Services token flow + Sheets API `spreadsheets.create` and `batchUpdate` with the `drive.file` scope only. [RESEARCH]
* **v2 backend:** Supabase (Postgres + auth + row-level security) or equivalent; research data in a separate schema keyed by random IDs, never joined to account tables; health-check answers never stored server-side.
* **Rule evaluation:** a small in-house evaluator over a fixed action vocabulary (preferred: deterministic, typed, no `eval`), or json-rules-engine if a general engine is wanted. [RESEARCH]

### E2 · Repository layout [PROPOSED]

```
blaze-camp/
  model/                      # source model (from synthesis/, coach answers applied) - CC BY 4.0 when opened
    rule_tables/*.json        # counting, weekly_sets, steps (stairway + check-in table), session_budget, reps, effort, rest,
                              # bilateral_unilateral, athletic, conditioning, pain, ordering, pairing, plan_shapes, maintenance, validation
    catalog/exercises.json    # runtime fields only; provenance stays in synthesis/
    catalog/videos.json       # video map (optional entries; search-link fallback)
    templates/*.json          # week layouts, slot grammars
    profiles/*.json           # sports, positions, activities, goals (04 v1.1 merged with synthesis/sports/)
    i18n/en/*.json, i18n/es/*.json
    legal/{release,health}/*.md   # lawyer-approved texts, versioned; NOT under the model licence
    rule_packs/examples/*.json
    MODEL_VERSION             # semver; bumped on any rule change; CHANGELOG.md
  engine/                     # pure TypeScript, no DOM; runs in browser and Node
    generate.ts adapt.ts explain.ts validate.ts rules/ (evaluator, actions) rng.ts
  app/                        # UI + renderers
    screens/ renderers/{block,week,day,image,print,xlsx,gsheets,ics,share}/ storage/ i18n/
  tools/compile-model/        # synthesis JSON -> model/ (strip provenance, apply coach corrections, validate)
  tests/
    golden/                   # coach-graded intakes + expected plans (snapshot): the 7 R2-GEN-07 plans
    invariants/               # property tests (E10)
  LICENSE (Apache-2.0)  LICENSE-MODEL (CC BY 4.0)  TRADEMARK.md  CONTRIBUTING.md
```

### E3 · Runtime model compile step

* Input: `generator_spec_v1.json` 1.1.0 plus the synthesis JSON files (catalog 6.9 MB; equipment model 2.1 MB; templates, profiles, periodization, volume rules, training variables 160-530 kB each). OBSERVED sizes (v1).
* Output: a runtime bundle that keeps only what the engine reads. A slim catalog of the live-library and program exercises with runtime fields measured about 1.3 MB raw / **80 kB gzipped** (OBSERVED, computed for v1). Target for the whole runtime model, sport profiles included: under ~350 kB gzipped [INFERRED].
* The compile step applies the coach's corrections as data patches with their IDs (round 1: LIB-07, LIB-09, EQ-01, EQ-07, EQ-08, EQ-12, VOL-09, LIB-16, UNI-01, VOL-10, FIX-04; round 2: KB swing no glute credit and thruster 1.0 / 0.5 / 0.25 (R2-VOL-05), KB face pull to shoulder work (R2-LIB-04, LIB-10), bench push-ups both versions (R2-LIB-05), 21.6-mile run removed (R2-LIB-06), the R2-LIB-07 additions). Each patch is logged; the compile fails if a patch target is missing.
* Every compiled bundle carries `model_version`; plans store it, and the app keeps old model versions available so a saved plan always re-generates identically.

### E4 · Data contracts (abridged)

**Intake** (`generator_spec_v1.json > inputs_schema`, schema `intake/2`). Example 1: a competitive college sprint swimmer, client door.

```json
{
  "schema": "intake/2",
  "lang": "es", "units": "kg",
  "role": "self",
  "health": {"route": "client_screen", "screen_version": "blaze-screen-0.1",
             "refer_items": {"heart": false, "surgery_6mo": false, "pregnant_postpartum_6mo": false, "injury_in_treatment": false, "doctor_said_no": false},
             "general_items_any_yes": false, "cleared_by_professional": null, "outcome": "clear"},
  "age": 20, "body_weight": {"value": 78, "unit": "kg"},
  "goal": "athletic", "focus_muscles": [], "lift_style": "balanced",
  "sport": {"competitive": "competitive", "sport": "swimming", "position": {"event_group": "sprint", "stroke": "fly"},
            "level_of_play": "college",
            "season": {"type": "competition_date", "date": "2027-02-24"},
            "practice": {"practice_days_per_week": 6, "game_days": ["Sat"]}},
  "activity": null,
  "experience": {"years_consistent": 4, "months_off_last_2y": 0, "former_competitor": false},
  "schedule": {"days_per_week": 3, "weekdays": ["Mon","Wed","Fri"], "session_minutes": 60, "start_date": "2026-10-12"},
  "plan": {"mode": "fixed_12", "previous_cycles": 0, "tests": ["strength","jumps"], "maintenance_weeks": null},
  "equipment": {"profile": "FULL_GYM", "extra": ["medball","plyo_box"], "machines": ["cable_stack","lat_pulldown"]},
  "pain": [{"area": "shoulder", "side": "right", "severity": "mild", "worse_with": ["overhead"]}],
  "prefs": {"core_position": "start", "optional_days": "separate", "variety_ab": false,
            "cardio_adjust": 0, "older_athletic_opt_in": false, "exclusions": []},
  "output_mode": "checkin",
  "coach_rule_pack_ids": [],
  "release": {"text_version": "release-client-es-0.1", "language": "es", "role": "client", "accepted": true,
              "accepted_at": "2026-10-12T18:04:00-05:00", "signer_name": null, "guardian": null}
}
```

(College swimming in the US runs from about October to March, so in October this swimmer is in season and gives the championship meet date; the tool works out in-season dryland and the taper before the meet. A high-school or club swimmer in the off-season would give "next season starts on" instead (R2-GEN-05; calendar from `synthesis/sports/aquatic-endurance-track.json` `swimming_sprint.season_calendar_us`: college dual meets October-January, conference championships mid-late February, which also proposes asking for the main championship meet date so the taper lands on it). Tests: with no completed block yet, "strength" means a 5- or 3-rep max, not a 1-rep max (R2-PER-07).)

Example 2 (only the parts that differ): a 63-year-old recreational pickleball player on the "Stay athletic and active" door.

```json
{"goal": "active", "sport": null,
 "activity": {"ids": ["rec_pickleball"], "league_sport": null, "play_days": ["Tue","Sat"], "event_date": null},
 "age": 63, "prefs": {"older_athletic_opt_in": false, "cardio_adjust": 0}}
```

Example 3 (only the parts that differ): a coach who bypasses the health check.

```json
{"role": "client",
 "health": {"route": "coach_own_sop", "refer_items": null, "outcome": "bypassed_by_coach"},
 "release": {"text_version": "release-coach-en-0.1", "language": "en", "role": "coach", "accepted": true, "accepted_at": "2026-10-12T09:30:00-05:00", "signer_name": null, "guardian": null}}
```

`role`: `self` (client door) | `client` (coach mode, building for a client) (F39). `health.route`: `client_screen` | `coach_screen` | `coach_own_sop` (F45); `outcome`: `clear` | `refer` | `cleared_by_professional` | `bypassed_by_coach`. `goal` adds `active` (Stay athletic and active), which maps to the athletic family with `competitive = recreational`. `plan.mode` ∈ `fixed_12` | `fixed_8` | `maintenance_4_6` | `week_by_week` | `year` (the `maintenance_4_6` code is kept for compatibility; its length now comes from `maintenance_weeks`, 1-8, extendable; R2-PER-06). Removed: `sex` (GEN-02), `recovery` (sleep, stress, hard job; R2-GEN-04). No plan is generated unless `release.accepted` is true for this generation and `health.outcome` ≠ `refer`.

**Plan** (codes only; all words resolved by the renderer through the word lists):

```json
{
  "schema": "plan/1", "model_version": "1.1.0", "engine_version": "1.1.0", "seed": "a91f…",
  "intake_hash": "sha256:…", "level": {"client": "L2", "reason_keys": ["exp_4y", "no_layoff"]},
  "release_stamp": {"text_version": "release-client-es-0.1", "role": "client", "accepted_at": "2026-10-12T18:04:00-05:00"},
  "shape": {"key": "STAIRWAY_12", "steps": 12,
            "labels": [{"weeks": [1,6], "label_key": "phase.small_steps"}, {"weeks": [7,8], "label_key": "phase.bigger_steps"}, {"weeks": [9,12], "label_key": "phase.hardest"}],
            "level_by_week": [2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11],
            "tests": {"start_week": 1, "end_week": 12}},
  "weeks": [{
    "n": 1, "kind": "build",
    "summary": {"sets_by_muscle": {"quads": 12, "hamstrings": 10}, "contacts": {"high": 40, "low": 60}, "throws": 30, "aerobic_sessions": 1},
    "days": [{
      "weekday": "Mon", "day_type": "A", "est_minutes": 60,
      "blocks": [{
        "tier": "core", "movable": true,
        "items": [{
          "slot_id": "A.core.1", "purpose_key": "purpose.core", "category": "CT.THORAX.STATIC",
          "exercise_id": "dead-bug", "alternatives": ["bird-dog", "hollow-hold"],
          "sets": [{"reps": {"type": "per_side", "value": 10}}, {"reps": {"type": "per_side", "value": 10}}],
          "effort": {"rir": [2, 3], "rpe": [7, 8]}, "load_hint": null, "rest_s": [60, 90], "superset": null,
          "cue_key": "cue.dead-bug", "video": {"kind": "search", "query_key": "exercise.dead-bug.name"},
          "credits": {"core": 1.0}, "why_keys": ["why.core_first"]
        }]
      }]
    }]
  }],
  "checks": [{"id": "GEN-08.power_before_strength", "pass": true}, {"id": "R2-GEN-03.release_accepted", "pass": true}]
}
```

IDs, category codes, labels and numbers in these examples are illustrative, not real catalog values; the stairway labels follow the step halves of `12_volume_algorithm_v1` v1.1 §3.7.1 and `06_periodization` v1.1 §7.0.1 (3 % steps to week 6, 5 % from week 7, the last 4 weeks the hardest, R2-PER-04) and the 2 → 11 level (R2-PER-05). Reps are structured per set so the renderer can show pyramids exactly as the coach writes them (`12/10/8 -20`, `10/10` per side; PRG-07, UNI-01); seconds, metres, contacts, calories and rounds are reps types too. `load_hint` is `{"type": "pct", "of": "tested_best", "value": [0.75, 0.8]}` only on a barbell main lift with a recent tested best (R2-GEN-06); on Olympic lifts it is always `{"type": "power"}` unless the profile is competitive Olympic weightlifting or a coach switched percentages on for that tested lift (`show_olympic_percentages`, N-PROD-20). `video.kind` ∈ `coach` | `approved_public` | `search` (R2-GEN-02).

**Check-in** (schema `checkin/2`; `life` removed, R2-GEN-04):

```json
{"schema": "checkin/2", "week": 5, "submitted": "2026-11-15",
 "sessions_done": {"Mon": true, "Tue": true, "Thu": false, "Fri": true},
 "effort": {"Mon": 8, "Tue": 9, "Fri": 7},
 "felt": [{"slot_id": "B.push.1", "value": "pain"}, {"slot_id": "A.knee.2", "value": "wrong_muscle"}, {"slot_id": "D.pull.3", "value": "couldnt_do_it"}],
 "pain_now": [{"area": "shoulder", "trend": "same"}],
 "results": [{"exercise_id": "trap-bar-deadlift", "kg": 140, "reps": 5}],
 "block_action": null}
```

`effort` 10 = the most the person could do, successful (R2-VOL-02); a failed exercise is `felt = couldnt_do_it`. `block_action` ∈ `null` | `stop_block_start_maintenance` | `maintenance_extend:<weeks>` | `maintenance_end:keep|change_plan|new_block` (R2-VOL-07, R2-PER-06).

**Rule pack** (coach layer; one action per rule):

```json
{"schema": "rulepack/1", "id": "coach-jdoe-2026-11", "author": "Coach J. Doe", "model_min": "1.1.0",
 "rules": [
  {"id": "youth-no-floor-oly", "when": {"all": [{"fact": "age", "op": "lt", "value": 15}]},
   "then": {"action": "exclude_tag", "tag": "olympic_from_floor"},
   "note_key": "rule.youth_no_floor_oly"},
  {"id": "tennis-unilateral", "when": {"all": [{"fact": "sport.sport", "op": "eq", "value": "tennis"}]},
   "then": {"action": "set_unilateral_share", "region": "lower", "value": 0.85}},
  {"id": "pickleball-core-superset", "when": {"all": [{"fact": "activity.ids", "op": "contains", "value": "rec_pickleball"}]},
   "then": {"action": "add_core_superset", "day_type": "B", "position": "end"}}
 ]}
```

Action vocabulary (closed list): `exclude_exercise`, `exclude_tag`, `exclude_equipment`, `prefer_exercise_in_slot`, `set_unilateral_share`, `set_muscle_weekly_range`, `cap_weekly_step`, `fix_weekly_step`, `add_slot`, `remove_slot`, `add_core_superset` (R2-SES-03, new), `move_block`, `set_rest`, `set_rep_range`, `pin_video_link` (R2-GEN-02, new), `show_olympic_percentages` (R2-GEN-06 / R2-ATH-05 coach opt-in for a tested lift, PROPOSED, N-PROD-20), `add_note`. Facts: intake fields, derived values, `week.n`, `week.phase`, `day.type`, `slot.category`, `exercise.tags`, `activity.ids`.

**Video map entry:** `{"exercise_id": "leg-press", "status": "coach", "provider": "youtube", "id": "<VIDEO_ID>", "start": 12, "end": 34, "recorded_by": "blaze", "lang": "none"}`; with no entry the renderer builds the search link (E7).

**Release record:** `{"text_version": "release-client-en-0.1", "language": "en", "role": "client|coach", "accepted_at": "…", "plan_id": "…", "signer_name": null, "guardian": null}`; one per generation; kept on the device; printed on exports.

**Consent record (v2):** `{"subject_id": "random-uuid", "scope": "research_tier1", "text_version": "consent-es-1.0", "given_at": "…", "withdrawn_at": null, "age_attested_18_plus": true}`.

### E5 · Engine API and determinism

* `generate(intake, model, rulePacks, opts) → Plan` (refuses without an accepted release for this generation, or with `health.outcome = refer`) · `adapt(plan, checkins[], model, rulePacks) → Plan` (re-runs generation from the intake and applies all check-ins in order; weeks without a check-in stay as planned) · `explain(plan, slot_id) → reason keys` · `validate(plan) → checks[]`.
* Pure functions; seeded random only for tie-breaks (`seed` = hash of intake + model version); no clock reads inside the engine (dates come from the intake).
* Rule precedence: locked > coach rule pack > Blaze defaults > client preference (client swaps cannot re-introduce an exercise a coach or locked rule excluded). Conflicts inside one layer: the more specific `when` wins; equal specificity → the later rule wins, and the coach UI flags it.
* Performance target: a 12-week plan in under 200 ms on a mid-range phone [INFERRED]; run in a Web Worker so the UI never freezes.

### E6 · Weekly step implementation (section 2.3)

The engine math is owned by `12_volume_algorithm_v1` v1.1 §3.7 and §4; this is the product view of the same loop and must stay identical to it.

```
plan_step[m][w]  = λ[m] × (3 % if w <= ceil(N/2) else 5 %)      # the planned stairway (12 v1.1 §3.7.1; R2-PER-03/04)
T[m] = start[m]; stair_w = 1                                    # week 1
each calendar week (no deload or maintenance week inside a block: R2-VOL-07):
  c = check-in about the week just finished (None if not sent)
  for each muscle m:
    step = plan_step[m][stair_w + 1]                             # no check-in -> exactly this (R2-VOL-03)
    if c is not None:                                            # effort, completion and pain only (R2-GEN-04)
      if c.sessions_done < 0.5 * planned_sessions:  step = REPEAT     # stairway does not advance; block one week longer
      elif any day rated 10:                                     # R2-VOL-01; 10 = max but successful (R2-VOL-02)
          step = 0                                               # every muscle holds this week
          # once per day rated 10 (not per muscle): remove 1 set on that day (logbook: the exercise rated 10;
          # else the set most recently added to that day); that set's muscle: T[m] -= 1
      elif median(c.effort) >= 9:  step = 0                      # hold
      elif median(c.effort) <= 6:  step = min(step + 0.02, 0.07) # too easy: planned + 2 points
      # 7-8: the planned step
      if m in c.pain_muscles:  step = 0; pain protocol (VOL-03)
    if priorities and m not in priorities:  step = min(step, 0.03)          # R2-VOL-06
    if mode in (maintenance, pre_season, in_season):  step = 0              # flat (PER-01, R2-PER-06, R2-ATH-07)
    step = min(step, COACH_CAP, 0.07)                                       # R2-VOL-01 ceiling; coach override 0-7 % (VOL-05)
    T[m] = min(cap[m], T[m] * (1 + step))                                   # REPEAT counts as 0
    while T[m] - sets[m] >= 1: place one set in VOL-07 order, alternating the muscle's weekly exposures (R2-VOL-08 default)
  enforce total weekly rise < 10 % (UNI-05; smallest banks wait)
  if not REPEAT: stair_w += 1
  if block_at_risk(check-ins): offer "keep going" or "stop -> maintenance (weeks chosen, extendable) -> end prompt"   # R2-VOL-07, R2-PER-06
  # block_at_risk (PROPOSED, same list as 06 / 12 v1.1): 2 holds in a row; effort mostly 9-10 two weeks; under half the
  # sessions 2 weeks running; 'Felt a PAIN' on 2+ exercises in a week; pain 2 weeks running or worse; the user taps it
after the last stairway week: end test (if ticked) -> "block done" choice: easy week (~half the hardest week, 3+ RIR)
  + next block (start x1.05, cap +1) | maintenance | change plan        # R2-VOL-07, R2-VOL-06, R2-PER-07
```

HOW IT FELT? handling per the section 2.3 table. All thresholds live in `rule_tables/steps.json` and are coach-editable. Retired in v1.1: the life column, the absolute "+7 / +5 %" reading in the first half (the rows now read against the stairway), the `early_deload` triggers, the before-logs intake step and target-seeking (R2-GEN-04, R2-VOL-03, R2-VOL-07, R2-PER-03/04).

### E7 · Renderers

* **Block view:** per training day, rows = the block's exercises, columns = weeks; cells = sets × reps (+ effort if the chip is on); stairway bar from the plan's `shape`; test weeks marked.
* **Week view and day view:** one component per block tier; superset pairs grouped and labelled with his 'SUPERSET W/' wording (arrow emoji in his label not reproduced here); effort as RIR text with the RPE number; Olympic lifts with the power cue instead of a load unless `load_hint` is a percentage; rest; cue; video.
* **Video:** `coach` / `approved_public` → lazy iframe on tap (`youtube-nocookie.com`); `search` → a plain link `https://www.youtube.com/results?search_query=` + URL-encoded exercise name in the user's language (Spanish adds the English gym term), opened in a new tab; the C8 note under it.
* **Images:** block (per training day or whole block), week, day; rendered off-screen at full length; language, units, plan name, model version, release line and disclaimer baked in at export time; never age, weight, pain or health answers.
* **Print / PDF:** block = one landscape page per training day; week = one page per week (Letter / A4 by region); instruction block on page 1; footer with model version, release line and disclaimer.
* **XLSX (C1):** sheet `PLAN` with his columns WEEK / DAY / PURPOSE / CATEGORY / EXERCISE / SETS / REPS / WEIGHT USED or SCORE / EFFORT / HOW IT FELT? / DONE? + VIDEO + NOTES; a hidden `LISTS` sheet for dropdown sources; release line in the header row. Spike: confirm dropdowns and fills survive Google Sheets import.
* **Google Sheets (C2, v2):** same layout via `batchUpdate`.
* **Share link:** `#plan=` + compressed plan JSON with personal fields removed (no age, weight, pain, health answers, intake); for long plans, a short code stored server-side only in v2.
* **ICS:** one event per training day with the day title and a link back to the day view.

### E8 · Storage, backup code, sync

* IndexedDB stores `{intake, checkins[], swaps, logs, rulePacks, release_log[], model_version}`; written after every change. `release_log` keeps every acceptance (text version, role, time, plan id).
* Backup code = base64url(deflate(JSON)) using the browser's CompressionStream; typically 1-3 kB for a 12-week plan with check-ins [INFERRED]; offered as text, QR and a `.blazecamp.json` file. Never sent anywhere. Health-check answers are excluded from share links but included in the private backup (so a restored plan stays valid).
* v2 sync: the same document stored per account; last-writer-wins per check-in week; the coach view reads only clients who connected; a server-side release log only if the lawyer advises it (N-PROD-16).

### E9 · i18n details

* Keys are stable IDs (`exercise.leg-press.name`, `cue.leg-press`, `why.hinge_with_push`, `checkin.effort.10.help`, `release.client.body`, `sports.swimming.name`, `activity.rec_pickleball.name`). The plan never stores text.
* Spanish exercise names carry an optional `gym_term` shown in brackets (R2-GEN-08).
* Legal namespaces (`health`, `release`, `warn`) carry a `text_version` per language and are only editable through the legal review workflow.
* CI check: every key present in `en` must exist in `es` or be listed in `es/_missing.json`; the build fails if a new English key has no entry in either; legal keys may never fall back silently.
* Number, date and unit formatting through `Intl`; lb / kg conversion at render time; loads stored in the user's unit as entered.

### E10 · Tests (golden plans + invariants from the coach's answers)

Golden: the 7 coach-graded plans (R2-GEN-07: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push / pull / legs) as snapshots; any diff needs review.

Invariants (property tests over thousands of random intakes):

| Invariant | Source |
|---|---|
| No plan without an accepted release for that generation; release record stamped on the plan and every export | R2-GEN-03 |
| Client door: any refer answer → no plan; the coach bypass exists only in coach mode | R2-GEN-03 |
| No lifestyle field (sleep, stress, job, life) in the intake or the check-in | R2-GEN-04 |
| A week with no check-in equals the planned week | R2-VOL-03 |
| No deload or maintenance week inside a block; maintenance only when chosen or after a stopped block | R2-VOL-07, R2-PER-06 |
| Planned weekly sets follow a stairway: smaller steps to the halfway week, bigger after it, never down inside a block (except −1 set after a 10 and pain cuts), hardest weeks last; a check-in step equals the planned step, +2 points (max 7 %), 0 or a repeated week, never anything else | R2-PER-03, R2-PER-04, R2-VOL-01 (12 v1.1 §3.7.3) |
| No band, chain or weight-releaser exercise, and no band substitute, appears anywhere | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12 |
| Weekly step never above 7 %; total weekly sets rise < 10 % | R2-VOL-01, UNI-05 |
| Weekly sets per trained target muscle never below 10 in a training block (floor). Not floored: maintenance phases, pre-season and in-season doses, muscles cut by the pain protocol, credit-only muscles of athletes; rear delts keep their own 4 / 6 / 8 sets with the floor read on his shoulders / traps group (INFERRED in 12 v1.1 §3.3, flagged for round 3) | R2-VOL-04, R2-VOL-06 |
| Helper credit 0.25; dips 0.5 / 0.5; thruster 1.0 quads / 0.5 shoulders / 0.25 glutes; KB swings credit no muscle; 10/10 counts 1 set; athletic sets credit no muscle | VOL-09, LIB-16, R2-VOL-05, UNI-01, VOL-10 |
| Core block first and light unless moved; never skipped | ATH-11, R2-SES-03, GEN-08 |
| Power / Olympic before strength; horizontal pull before vertical pull; the day's main lift before accessories | ORD-03, ORD-01, ORD-02, GEN-08 |
| Hip dominant paired with push, knee dominant with pull | UNI-11, ORD-06 |
| Heavy (axial) squat and heavy (axial) deadlift on two different days, at most one of each per week; other days non-axial | R2-SES-01, R2-SES-02 |
| No V-squat; no heavy compound prescribed to failure | GEN-08 |
| 60+: no Olympic lifts, plyos or depth jumps unless opted in (with the warning shown); clients in pain: no overhead squat, snatch, low-bar squat or depth jumps | R2-ATH-08, EQ-03 |
| No percentage load on an Olympic lift unless the profile is competitive Olympic weightlifting, or a coach switched percentages on for an athlete whose own tested best on that lift exists | R2-GEN-06, R2-ATH-05 |
| Olympic lifts up to 4 slots a week (never capped at 1); clean-family lifts on squat-pattern days, snatch-family lifts on hinge days; full squat cleans and snatches 3-5 reps per set; in season a light piece, dropped in heavy game weeks | R2-ATH-04, R2-ATH-05 |
| In-season game-heavy sports (basketball, volleyball, soccer, football, hockey): the one hard gym day at least 48 h before a game day from F15; gym plyos about half | R2-ATH-07, R2-GEN-05 |
| Youth: Olympic lifts from the floor only from about 14 and after one block of hang work | R2-ATH-08 |
| No 1-rep max or all-out mile test for anyone not coming off a completed training block (5RM / 3RM, beginners 5-8RM, and 80-90 % efforts instead); tests only before or in week 1 and in the last week of a block, never in the middle | R2-PER-07 |
| No '21.6 mile run' in any plan or test | R2-LIB-06 |
| No medball in the main work for aesthetics / bodybuilding goals; no medball above 20 lb | ATH-05, EQ-06 |
| Calves 3 sets on every leg day; rear delts get their own sets; about 2 core exercises a day | VOL-17 |
| Exercise count per session: resistance-only about 5-7 (8-9 at 75-90 min); field athletes up to 12 + the 2-exercise core block; full-body days 2-4 exercises per muscle group trained that day, never 1, even when that makes the day 7-10 exercises and longer (the schedule screen then says so) | VOL-08, R2-SES-04, R2-SES-05 |
| Added sets go to the first exercise of the muscle in session order first, alternating between its two weekly exposures | VOL-07, R2-VOL-08 (default) |
| Same exercises inside a block; between blocks only one-detail variations, never invented exercises | PER-02, R2-LIB-01 |
| Share links and images never contain age, weight, pain or health answers | INFERRED privacy |

### E11 · Analytics and learning pipeline (v2-v3)

* Tier 0: cookieless page analytics (no intake fields): views used (block / week / day), image and print buttons, drop-off screen.
* Tier 1 events (opt-in only): `plan_generated` (banded intake, model_version), `checkin_submitted` (the check-in minus free text), `swap_chosen`, `block_stopped`, `maintenance_chosen`, `test_result`. Random subject ID; no IP storage; retention limit (for example 3 years) and deletion by backup code or account. Never health-check answers or release records.
* Analysis: weekly cohort tables; later, simple hierarchical models per segment (level × goal × sport or activity) for starting sets and step thresholds; outputs are proposals in a review queue for the coach; an approved change bumps `model_version` and the CHANGELOG.

### E12 · Build estimate breakdown (developer-weeks, INFERRED)

| Work package | Low | High |
|---|---|---|
| Model compile tool + coach-answer patches (round 1 and 2) + schema validation | 1 | 1.5 |
| Engine: level, stairway shape, week layout, slots, sets allocation, exercise choice, reps / effort / rest, order, progression, maintenance, checks | 3.5 | 4.5 |
| Engine tests: 7 golden plans + invariants | 0.5 | 1 |
| Intake screens (few-click flow, branching) | 1 | 1.5 |
| Sport and activity picker (search, positions, EN / ES names, "not listed") | 0.25 | 0.5 |
| Health check, coach bypass, release flow, release log | 0.5 | 0.75 |
| Block / week / day views with show chips, exercise sheet, swaps, video links | 2 | 2.25 |
| Block / week / day images, print CSS, share sheet, share link, ICS | 1.25 | 2 |
| XLSX export + Google Sheets import spike | 0.5 | 1 |
| i18n plumbing, unit switch | 0.5 | 1 |
| **Option A total** | **11** | **16** |
| Check-in + adapt + "what changes" screen + block-stop / maintenance / block-done flow | 1.5 | 2 |
| Logbook + progress | 1 | 1.5 |
| PWA offline, install prompts, backup code | 1 | 1.5 |
| **Option B increment** | **3.5** | **5** |
| Open-source prep (docs, licences, CI, contribution guide, rule-pack docs) | 1.5 | 2.5 |
| v2: accounts, sync, coach mode, rule-pack editor UI, consent and research pipeline, Drive export, Olympic weightlifting program type | 8 | 12 |

(The main text rounds these: A about 11-16 weeks, B about 14.5-21 weeks.)

---

## References

**Coach and team sources.** `coach_answers_round2.md` (R2-GEN-01 to R2-GEN-08, R2-VOL-01 to R2-VOL-08, R2-SES-01 to R2-SES-06, R2-ATH-02, R2-ATH-04, R2-ATH-05, R2-ATH-07, R2-ATH-08, R2-LIB-01, R2-LIB-04 to R2-LIB-08, R2-PER-01 to R2-PER-07, LIB-10); `coach_answers_full.md` (GEN-01 to GEN-08, PER-01 to PER-03, PER-05 to PER-07, VOL-01 to VOL-10, VOL-13, VOL-17, UNI-01, UNI-05, UNI-08 to UNI-11, ATH-03, ATH-05, ATH-09, ATH-11, ATH-13, ORD-01 to ORD-06, ORD-10, EQ-01, EQ-03, EQ-06 to EQ-08, EQ-10, EQ-12, EQ-14, LIB-07, LIB-09, LIB-16, PRG-01, PRG-03, PRG-05, PRG-07, PRG-08, FIX-03, FIX-04); the coach's chat request of 2026-10-08 (popular US sports, swimming, pickleball, "high rows", "stay athletic and active"); `BLAZE_CAMP_BRAIN.md` §3.5, §13, §14, §16; `generator_spec_v1.json` 1.1.0; `synthesis/sports/*.json` (in progress; `team.json` read for the picker ids) and `04_profiles.json`; `12_volume_algorithm_v1.md` v1.1 §3.7-§5 and `06_periodization.md` v1.1 §6-§7 (stairway, check-in reading, block flow, tests); `02_exercise_catalog.json` (video counts, computed 2026-10-08); BYOP dump `04_JUSTICE_LEAGUE.columns.txt` (row 2 column headers).

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
* PAR-Q+ official site (copyright "PAR-Q+ Collaboration ... All rights reserved"; use official, unmodified versions; online version available; translations listed without Spanish): https://eparmedx.com/ ; PAR-Q+ publications: https://hfjc.library.ubc.ca/index.php/HFJC/issue/view/9
* Clickwrap enforceability (affirmative unticked "I agree", records of who, when and which version; ESIGN / UETA): https://www.sirion.ai/library/contract-management/clickwrap-agreement/
* Parent-signed waivers for minors (enforceability varies by state; many states reject them): https://ottersign.com/blog/can-minors-sign-waivers/ ; https://sportslitigationalert.com/?p=13143 ; https://www.superlawyers.com/resources/personal-injury-plaintiff/liability-waivers/
* SFIA participation (pickleball fastest-growing US sport four years running, 19.8 million players in 2024): https://sfia.org/research/u-s-pickleball-participation/ ; https://www.sportstravelmagazine.com/sports-fitness-industry-association-releases-2025-topline-participation-report
* HYROX format (8 × 1 km runs each followed by a workout station; open, pro, doubles divisions): https://us.puma.com/us/en/articles/what-is-hyrox
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

---

## v1.1 verification log

Adversarial check of the r2-product update (this file and `generator_spec_v1.json` > `inputs_schema`, `adaptation`, `output`, `_meta.version` = 1.1.0), 2026-10-08. Read in full first: `coach_answers_round2.md`; then this file, the three spec parts, `12_volume_algorithm_v1.md` v1.1 §3.7-§5, `06_periodization.md` v1.1 §6-§7, `synthesis/sports/team.json`. Backups of both files before the fixes are in the session scratchpad. JSON edited and re-validated with the project venv; only `_meta`, `inputs_schema`, `adaptation` and `output` changed in the spec.

**Verdict.** The round-2 product answers were applied in the body, not only in the changelog, and the intake, check-in and copy carry no lifestyle input. Four real defects were found and fixed: (1) the check-in step table used absolute +7 / +5 % in every week and its worked example contradicted the stairway math in 12 v1.1 / 06 v1.1 (early weeks are one notch smaller); (2) Olympic-lift percentages were described three different ways (C10 vs §15 vs `output.weight_guidance` / E10); (3) the "untrained" test rule was narrower than the coach's words ("If they haven't finished a block of training ..."); (4) the plan-shape labels in E4 put the bigger steps at weeks 5-8 instead of from week 7. Several smaller gaps were closed (below). Leftovers that sit outside the parts this step may edit are listed for the master step, not edited.

### Round-2 answers relevant to these files: where each is applied

| ID | Status | Where (this file / spec) |
|---|---|---|
| R2-GEN-01 | OK | §2.1-2.2, S22; F43, `adaptation.modes` |
| R2-GEN-02 | OK | §0, §3.1, §7.3, §14; `output.views/renderers/videos`. No "video for every exercise" requirement left (GEN-06 marked as softened) |
| R2-GEN-03 | OK; FIXED | §12, S1, S10, C0-C6; F39, F45, F01, F46. "Fainting" in the approved heart item now marked as our PROPOSED addition (§12.2, F01 tag) |
| R2-GEN-04 | OK | no sleep / stress / job / life field in the intake (F42 removed), the check-in (life question removed) or the step (life column removed). The life-column resolution is flagged in §2.3 and `adaptation.step.resolution_flag` |
| R2-GEN-05 | OK; FIXED | §13.2; F14, F15. Example 1 (college swimmer) moved from "next season starts in January" to a championship meet date, because college swimming is in season from about October to March |
| R2-GEN-06 | FIXED | §0, §15, C9, C10, E4 `load_hint`, E10; `output.weight_guidance`, `plan_schema`, copy. Olympic lifts: no % by default, even with a tested max; competitive Olympic weightlifting is its own program type; a coach opt-in for one tested lift is PROPOSED (N-PROD-20, rule action `show_olympic_percentages`) |
| R2-GEN-07 | OK | §6 Phase 0, E2, E10 golden plans (7 plans) |
| R2-GEN-08 | OK | §7.4, E9; F00, F06. New copy (C15, the "also play" link, F26b gate) written in neutral Latin American Spanish with the English term in brackets |
| R2-VOL-01 | FIXED | §2.3 table, rules, worked example (recomputed), E6; `adaptation.step` now has `read_against_stairway` (the engine reading, same as 12 v1.1 §3.7.3) and `table_as_approved` (his numbers = the late half) |
| R2-VOL-02 | OK; FLAG | effort 10 = "the most I could do, and I made it" everywhere (Q2 helper, C13, S18, `checkin_schema`); the fail answer is his "Couldn't do it". 12 v1.1 proposes a separate 'Failed' answer with different handling: N-PROD-19 |
| R2-VOL-03 | OK; FIXED | §2.2-2.3, E5, E6, E10; F43, `adaptation.no_checkin`. Now stated for week-by-week too; F17 no longer feeds a "before-logs step" |
| R2-VOL-04, R2-VOL-06 | OK; FIXED | floor 10 and customizable caps (§7.2 layer 2), pro level (§7.2 layer 3); E10 floor invariant now lists the exceptions (maintenance, pre-season, in-season, pain cuts, athletes' credit-only muscles) and the rear-delt reading (flag kept). F25c re-tagged R2-VOL-06 (approved) |
| R2-VOL-05 | OK in this file | §7.2 layer 1, E3, E10. The spec's `rule_tables.counting` still credits KB swings to glutes: handed to the master step |
| R2-VOL-07 | OK; FIXED | §2.3, S20, S22, C12; `adaptation.block_cannot_be_finished`. The offer signals now match 06 / 12 v1.1 (added "effort 9-10 two weeks" and "under half the sessions two weeks"); the completed-block choice (easy week + next block × 1.05 / cap + 1, maintenance, or change plan) added: §2.3, S20, C15, `adaptation.block_end` |
| R2-VOL-08 | OK; FIXED | default marked for round 3 (§2.3, E6, E10); the no-optional-day placement now matches 12 v1.1 §3.9 (a day already training that group, never a lone exercise) |
| R2-SES-01, R2-SES-02 | OK; FIXED | §7.2, E10; the day sketch now shows Monday as the heavy squat day (it paired a clean with a trap-bar deadlift) |
| R2-SES-03 | OK | S9, §7.2, E4 rule action `add_core_superset`, E10; F44 note |
| R2-SES-04 | OK | E10 |
| R2-SES-05 | OK; FIXED | E10 ("never 1"); S5 and F24 now tell the user when full-body days need longer sessions and offer longer sessions / more days / a split |
| R2-SES-06 | OK | S9, S12, §14.1; F44 `cardio_adjust` |
| R2-ATH-02 | FIXED | the day sketch labelled a box jump "PLYO"; it is a ballistic jump |
| R2-ATH-04 | FIXED | E10 invariant added: up to 4 Olympic slots a week, clean family on squat days, snatch family on hinge days; sketch note |
| R2-ATH-05 | OK; FIXED | §15 (3-5 reps, coach's eye on speed); % rule reconciled with R2-GEN-06 |
| R2-ATH-07 | FIXED | E10 invariant added (hard gym day ≥ 48 h before a game from F15) |
| R2-ATH-08 | OK; FIXED | C7, S9, §7.2, §7.6; F02, F44. Youth floor-Olympic invariant added to E10 |
| R2-LIB-01 | OK | §2.3 swaps, §14.2, E10 |
| R2-LIB-04, -05, -07, LIB-10, LIB-12 | OK | E3 compile patches |
| R2-LIB-06 | OK; FIXED | §13.2, E3; E10 invariant added |
| R2-LIB-08 | OK | §1.1 PRG-01, `output.tiers` |
| R2-PER-01, R2-PER-02 | OK; FIXED | S16; F25 `year` now marked for non-competitive goals only (athletes follow their season) |
| R2-PER-03, R2-PER-04, R2-PER-05 | OK; FIXED | E4 shape labels corrected (small steps 1-6, bigger 7-8, hardest 9-12, `level_by_week` 2 → 11); block view and day sketch show the level; C9 and §15 say the reps in reserve follow the week of the stairway; F25c no longer quotes "start at a 2 and end at an 11" for a set step |
| R2-PER-06 | OK | S6, S20, C11; F25d; pre-season in §13.2 and F14 |
| R2-PER-07 | FIXED | S6, §1.2, §7.6, E10; F26b `untrained_rule` + `one_rm_gate`: no 1RM or all-out mile without a completed block (the coach's words), 1RM only for intermediate and up at the end of a completed block or after "I just finished a training block" (PROPOSED) |
| Coach chat 2026-10-08 (sports, swimming, pickleball, HYROX) | OK; FIXED | §13, F07, F11, F11r. Swimming present in depth (event group + main stroke; first sample plan). Picker rows mapped to the ids of `team.json`, `aquatic-endurance-track.json` and `combat-strength-fitness.json` (`profiles_v1_1`); padel has no profile yet (routes to pickleball / tennis); lacrosse men's / women's; rugby sevens; rec league adds hockey and ultimate; **added** figure skating, competitive dance / drill, fencing, badminton / squash / racquetball / table tennis, bowling (common US school and college sports missing from the research lists; `routes_to` placeholders until profiled); an "I also play something" link under the fat-loss and general goals so gen pop sees pickleball and HYROX as an option (PROPOSED). "High rows" = HYROX stays INFERRED, to confirm |

### Leftover grep (patterns: acclimation, start hard, target-seeking, deload, life / sleep / stress, effort 10 = fail, KB swing, 1-exercise-per-muscle, Olympic once a week, mid-block test, 1RM from zero, mandatory video)

* **This file:** every remaining hit is a retirement or a negation ("no deload inside a block", "never mid-block", "KB swings credit no muscle", "videos optional", "no lifestyle questions", "retired: target-seeking"). No live leftover.
* **Spec, parts edited here:** same; the only hits are `removed_fields`, `retired`, `retired_v1`, the life-column flag and F17's PRG-05 "get acclimated" quote (a level rule, now labelled as such).
* **Spec, parts this step may not edit (left unchanged, listed in `_meta.v1_1_changelog[0].pending_cross_refs` for the master step):** `rule_tables.counting` KB swings glutes 1.0; `rule_tables.rate_engine` readiness L (sleep / stress), `planned_rate_before_logs` (lifestyle items, target-seeking, 3-tap question), `phase_limits` C12 acclimation 3 % and C8 weeks 1-4 5 %, gate "hold 2 weeks → deload", `checkin_step_table` life columns and "10 = failed", `hard_ceiling` deload exemption; `rule_tables.learning.log_schema` sleep / stress / energy; `plan_types` fixed_12 acclimation cap, fixed_8 "start hard", deload triggers, week_by_week "deload on triggers"; `tests.when` and `tests.catalogue` (never from zero); `derived_values.D12_before_logs_step`; `pipeline[1]`, `pipeline[6]`; `validation_checks` V1 / V5; `coach_rule_hooks`. The original list sent several of these to "the volume step" or "the periodization step", but those steps do not edit the spec; they are now addressed to the master step.

### Cross-file notes (not edited here)

* `12_volume_algorithm_v1` v1.1 proposes an optional separate 'Failed' answer; this file uses his "Couldn't do it" (N-PROD-19). One of the two must change once he answers.
* `06_periodization` v1.1 still names the first stairway phase "ACCLIMATION" (a label; its step cap is retired). The product shows "small steps / bigger steps / hardest weeks".
* Week-by-week: 06 v1.1 adds a recovery week after every 12-week stairway, 12 v1.1 shows the end-of-block prompt; this file shows both as the "block done" choice with the easy week as the default.
* `synthesis/sports/aquatic-endurance-track.json` and `combat-strength-fitness.json` arrived during this verification and their ids were added to the spec picker (`profiles_v1_1`); `genpop-active.json` did not exist yet, so the "Stay athletic and active" ids (`rec_pickleball`, `hyrox_fitness` ...) stay provisional (lap swim, running, cycling and ski prep point to the `rec_*` candidates in the aquatic file). Padel (competitive) has no profile in any file. The five sports added here (figure skating, dance / drill, fencing, the smaller racket sports, bowling) need profiles from the merge or sport-verification step.
