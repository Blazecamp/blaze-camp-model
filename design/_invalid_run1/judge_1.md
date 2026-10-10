# Judge 1 - coach fidelity

Lens: would the plans feel like Lalo wrote them, and does every rule tier match his stated priorities?
Written 2026-10-09 21:50 (local). Nothing outside `design/` was written.

---

## 0. Status: the three design documents do not exist

The task was to read the three planner designs and score them. The list of files to read arrived empty, and the files are not on disk:

- `design/design_milp.md`, `design/design_two-stage.md`, `design/design_template-parametric.md`: **none exists** (checked at 21:41, 21:43 and 21:49; no file in `design/` is newer than `algorithm_research.md`, 21:26, except another judge's scratch folder).
- `workflows/planner_design.js` builds the judge prompt from the designs that returned a result. All three design agents returned nothing, so the panel has nothing to compare.

**What this file judges instead, and how far to trust it.** I scored the three design *angles* exactly as the workflow briefed them (`workflows/planner_design.js`, the `ANGLES` list), against the coach sources and the evidence that does exist: `design/diagnosis.md`, `design/rules_as_constraints.md`, `design/algorithm_research.md` and the prototype outputs in `design/research/` (the only plans the new math has produced so far). The scores are therefore **provisional scores of approaches, not reviews of documents**. A real document could move a score by about one point either way; section 3 says what would move each one.

**For whoever runs the workflow:** the Spec phase is told to "take the winning design". There is no design to take. Either re-run the Design panel, or let the spec writer build from the diagnosis, the research, the rule inventory and the judge files. Sections 4 to 8 below are written so that they are useful in both cases.

---

## 1. Verdict on one page

| Angle (as briefed) | Score (1-10) | One-line reason |
|---|---|---|
| **two-stage** | **8** | It plans in the coach's own unit and order: first the weekly sets per group per week (the table he screenshots), then where each set goes (his VOL-07 and R3-VOL-03 rules). Its risk is the link between the stages. |
| milp | 7 | Best match to his stated priority *order* and to exact, honest infeasibility. Weakest on feel: a whole-block optimizer writes whatever its objective and tie-breaks say, and the prototypes already show plans he would not sign. |
| template-parametric | 6 | The day looks like his sheet, and it is the simplest to explain. But fixed skeletons are the measured root cause of the short-time failures, and his newest answers changed the structure his sheets used. |

**Winner: two-stage**, built on the coach's templates as the day grammar, with the exact kernels of the MILP angle inside stage 1.

**The grafts** (full text in section 7):

1. From milp: strict tier-by-tier optimization with whole-number freezes, and an exact yes / no / unknown feasibility test for group selection (never drop a group on "unknown").
2. From milp: offers computed by re-solving at valid intake values, plus the "what each switch buys" ladder.
3. From milp: a minimal-conflict explanation for every untrained group, in plain words.
4. From template-parametric: the coach's templates are the only source of day shape; the solver never invents a day.
5. From template-parametric: format-specific progressions for the class, the bootcamp circuit and the conjugate strength day.
6. From template-parametric: skeleton variants by days x minutes that he can approve like a sheet; his worked examples as golden tests.
7. From this audit: seven tier corrections (section 4) that apply to any design.

---

## 2. The lens: what "Lalo wrote it" means

Seven criteria, each taken from his answers (ids in brackets; authority round 3 > round 2 > round 1 > master > templates).

| # | Criterion | What he said (paraphrased) | Weight |
|---|---|---|---|
| F1 | **His priority order** | When time cannot hold the minimums: tell first and offer, then train fewer groups directly with big movers first, then supersets, and the trained groups still climb (R3-SES-02). Hard rules are never traded (GEN-08 locked list). | 20 % |
| F2 | **The day looks like his day** | Warm-up, light core 2 x 2, jumps and throws, Olympic, the work with its opposite partner (hip + push, knee + pull), second pairs, isolation, calves; spine loaded once per pattern; the slot skeleton is the program (ORD-01..08, UNI-11, R2-SES-01/03, 05 section 10). | 15 % |
| F3 | **The weekly volume story** | Weekly hard sets per group; nobody trained below 10; a balanced plan with 1-3 extra sets on Focus 1 / 2; new sets go to what matters most (R2-VOL-06, R3-SES-01, VOL-07). | 15 % |
| F4 | **The stairway feel** | Small steps early, bigger after halfway, the last four weeks the hardest, each group at its ceiling in the last week; week 1 feels like a 2 and the last like an 11 (R2-PER-03/04/05, R3-VOL-04). | 15 % |
| F5 | **Short time, handled his way** | Never squeeze, never one exercise, honest list of what is not trained directly, supersets recommended, and the person can switch a day's athletic or core block off (R3-SES-02). | 15 % |
| F6 | **The athletic prefix** | Athletic work is its own budget and never muscle sets; ballistic to plyometric by sport share; Receive-Create stages; cleans on squat days, snatches on hinge days (R2-ATH-01..05, R3-ATH-01..05). | 10 % |
| F7 | **Simple, whole, editable** | Few inputs, the whole plan at once, nothing stored; "this is all customizable"; coaches add their own rules; the plan is a template people adjust (R3-VOL-04, R2-VOL-06, GEN-08). | 10 % |

Two facts about the sources matter for every score:

- **His rules have moved past his sheets.** His observed full-body templates hold 5-7 exercises with 1-2 per muscle. In round 2 he rejected that for full-body days (2-4 per group, never 1, R2-SES-05), and in round 3 he approved restructuring the week when time is short (R3-SES-02). Where a template and a newer answer disagree, the answer wins.
- **The order of R3-SES-02 is his; most numbers inside it are ours.** The 2 x 45 result "hips 10 -> 14 plus pinned calves" (12 v1.2 section 5.5) is computed from his approved order with PROPOSED numbers. Whether very short weeks should instead train the big movers once a week is still a round-4 question (BRAIN section 16.6 item 2). The diagnosis calls 5.5 "the coach's approved worked example"; the policy is approved, the output is not yet.

---

## 3. Scores

Scale per criterion: 1-10. Total = weighted sum, rounded.

| Criterion (weight) | two-stage | milp | template-parametric |
|---|---|---|---|
| F1 priority order (20) | 8 | 9 | 4 |
| F2 the day (15) | 7 | 5 | 9 |
| F3 volume story (15) | 9 | 7 | 5 |
| F4 stairway feel (15) | 9 | 6 | 7 |
| F5 short time (15) | 8 | 9 | 4 |
| F6 athletic (10) | 6 | 7 | 7 |
| F7 simple, editable (10) | 9 | 5 | 9 |
| **Weighted** | **8.05** | **7.05** | **6.15** |
| **Score** | **8** | **7** | **6** |

### 3.1 two-stage: 8

Brief: stage 1 decides weekly sets per group per week (monotone stairway, floors, caps, Focus, group selection by an exact feasibility check against time); stage 2 packs sets into days and slots; a provable guarantee links the two.

Why it fits him:

- **It is his own two questions, in his order.** He answers "how many sets a week for this muscle" first (VOL-01, R2-VOL-06, R3-VOL-04) and "where does the new set go" second (VOL-07, R3-VOL-03). The volume document he reviewed is laid out the same way (12 v1.2 section 0).
- **Stage 1's output is the block view he asked for** (R2-GEN-02): one row per week, one column per group, the level 2 -> 11 and the effort cue. A coach can read it, screenshot it and argue with it. That is also the most direct form of "explainable".
- **The stairway is defined where he defined it**: on each group's weekly total. The inventory's SF-1 shows his "round up, round down" rule is already the best whole-set tracker of the planned curve, so stage 1 needs no bank and no smoothing passes.
- **Stage 2 can be his rules verbatim.** VOL-07 and R3-VOL-03 are procedures, not preferences. SF-3 and SF-4 show they are closed-form: the per-day, per-exercise allocation is a function of the weekly total. A plan built this way reproduces his own example line by line (12 section 5.1: goblet squat 2 -> 3 in week 6, leg press in week 8, split squat in week 11, step-up in week 12).
- **Group selection sits at the right level.** "Train fewer groups directly" is a decision about groups, made before any set is placed. Today it is made by probing placements, which is why the answer changes with every fix round (diagnosis 1.10).

Where it loses points:

- **F2 (7).** "Bin packing" in stage 2, read literally, is a free optimizer over days. He does not pack; he fills a skeleton. If stage 2 may move work between days to save minutes, days stop looking like his. Graft 4 fixes this.
- **F1 and F5 (8).** Everything depends on the link. If stage 1 checks time with a rough capacity and stage 2 then cannot place the sets, the repair loop returns, and a repair loop is where his order gets inverted (diagnosis RC4: hips, his first big mover, dropped by a rounding difference). The guarantee must be the SF-10 kind: stage 1 uses stage 2's own minutes formula.
- **F6 (6).** The brief does not say where athletic minutes, stations and stages live. They must be in stage 1's capacity, not bolted on.

What would move the score: a document that makes stage 2 the closed-form placement on his skeletons, and proves the link, is a 9. One that keeps a "verify, then cut" loop between the stages is a 6.

### 3.2 milp: 7

Brief: the whole block (weeks x days x groups x slots) as one mixed-integer program with lexicographic goal programming, a solver strategy, decomposition, exact infeasibility reporting.

Why it fits him:

- **F1 (9).** Lexicographic tiers are his way of talking: an ordered list where a lower item never costs a higher one. Nothing else guarantees that "fewer groups" is decided before "higher ceilings", every time.
- **F5 (9).** An exact test is the only honest way to say "your time cannot hold chest". The research prototype reproduced the over-cut he saw (a search that gives up and reads that as "does not fit" drops biceps and triceps from a plan that holds all eight groups). It also found something a coach should be told: on the 2-day template chest can never reach 10 at any session length, so the right offer is another day, not longer sessions.

Where it loses points, with evidence from the prototypes (section 5):

- **F2 (5) and F7 (5).** In a whole-block model, everything he did not state as a rule is decided by the objective and the tie-break. He will not recognize the reasons. "The solver found it optimal" is not an explanation he can give a client, and a coach who wants to change the floor from 10 to 8 should not need to read constraint rows.
- **F3 (7).** A set-counting objective buys the cheapest sets. In the prototype's L3 4 x 90 plan, shoulders climb 16 -> 24 while chest runs 16 -> 18, below its own level start of 20. That is the "sets go to flies and calves" complaint from three sample reviews, now produced by an optimal solve.
- **F4 (6).** With weeks inside the program, step timing is whatever keeps a higher tier optimal. The prototype moved one back set to week 2 and then held back at 21 for ten weeks, so that the weekly total would not be flat.
- The inventory files VOL-07 and R3-VOL-03 as soft, tier 7. In a strict lexicographic solve they then yield to one extra cheap set. The research formulation already writes them as hard rows (its C13); the inventory and the design must agree on that.

What would move the score: a MILP design that takes the day grammar and the placement rules as fixed structure, and uses the solver only for selection and endpoint dosing, is an 8. At that point it is the two-stage design with a solver inside, which is the recommendation.

### 3.3 template-parametric: 6

Brief: the coach's proven day templates as fixed skeletons chosen by goal x days x minutes; a small set of parameters (sets per slot per week) solved exactly; slots added or removed only by explicit rules.

Why it fits him:

- **F2 (9) and F7 (9).** "The slot skeleton is the program; the exercise is a choice inside it" (05 section 10). Every review's "what works" list is the template's work: core first, power before strength, pairs, spine days. A handful of numbers per slot is also the easiest plan to explain and to edit.
- **F6 (7).** The athletic prefix, the class format and the bootcamp circuit already live in the templates.

Where it loses points:

- **F1 (4).** It puts his lowest-authority source (the sheets) above his newest answers. When the skeleton cannot hold the floor, the skeleton wins by construction, and the plan either trains groups below 10 or loses them.
- **F5 (4).** This is diagnosis root cause RC2, measured: on a fixed skeleton the pickleball player at 3 x 45 trains only chest and calves while Monday has 11 free minutes; the swimmer's quads have stations on one day and sit at 5-6 sets for 12 weeks; a fifth football day changes nothing. "Add or remove slots only by explicit rules" is the current patch list (E-94, E-144, E-145) under a new name.
- **F3 (5).** A group's reachable sets are capped by where the skeleton put its stations, not by the minutes (chest at most 9 on the 2-day template).
- **F4 (7).** Sets per slot per week can be solved to climb, but a skeleton with few slots for a group has few steps to give.

What would move the score: skeleton *variants* per days x minutes in which each group's days are a solved choice, approved by the coach like sheets, would lift F1 and F5 to about 7. That is graft 6.

---

## 4. Do the rule tiers match his priorities?

This audits the tier order in `design/rules_as_constraints.md` (T0 hard > T1 policy > T2 floors > T3 stairway > T4 time > T5 caps and attainment > T6 counts > T7 pairing, order, placement > T8 balance, variety), because every design will inherit it.

**What matches.** T1 above T2 and T3, with the floor and the minimum climb as conditions of "trained directly", is his R3-SES-02 order exactly. Time above ceiling height (T4 > T5) matches "if they keep their time". The minimum climb above time matches "never flat". Hard structure in T0 (core first, power before strength, horizontal before vertical, pairing, spine days, never one exercise, 12 + 2) matches his locked list.

**What does not match.** Seven corrections, in order of how much a coach would notice.

| # | Where | Problem | His words point to | Correction |
|---|---|---|---|---|
| A1 | T5-CAP-04, attainment as a plain sum of shortfalls | The solver fills time with the cheapest sets; a lower-priority group out-climbs a big mover (prototype E3, E4). Balance sits in T8, where it can no longer repair T5. | Balanced plan plus 1-3 extra on Focus (R3-SES-01); sets go to what matters most (VOL-07); big movers first (R3-SES-02). | Make attainment a priority-ordered max-min on *relative* progress (start -> ceiling), Focus and big movers first. Add a balance band inside T5: no group may be more than one step ahead of a higher-priority group in relative progress unless a named hard rule blocks the higher one. |
| A2 | T3, order of the stairway terms (the research flow uses: land in the last week > weekly total never flat > shape) | "Total never flat in every week" is not his sentence. His approved table holds weeks 2-3 on every line. Ranking it above shape pulls steps into week 2 and leaves groups flat for 8-10 weeks; forcing every final set into week N makes week 11 the smallest step and week 12 a lump (all five prototypes). | Small steps early, bigger late; the last four weeks brutal, each week more (R2-PER-03/04); his example ends 19, 20, 21, 22 (R3-VOL-04). | Inside T3: (1) never down, minimum climb; (2) the last third of the block adds at least one set to the weekly total every week when the steps exist; (3) each line tracks its own planned curve within one week; (4) no weekly total rise above 7 %; (5) early flat weeks are allowed, and the plan prints what climbs that week (level, effort, load). A line may reach its ceiling in week N-1 when that removes a late flat week or a lump. Confirm with the coach (section 9). |
| A3 | T1-POL-08, the BELOW_FLOOR state (PROPOSED, rank 2) | It is the outcome he rejected: groups trained under the floor. 4 of 8 samples ship a group under 10 with every check green (quads or hips at 4-7.5 sets in three of them, chest at 9 in the fourth). | Fewer groups directly "instead of dropping below the floor" (R3-SES-02). | Default states: FULL, PATTERN, NONE. BELOW_FLOOR off unless he approves it (round-4 item 2). The class lift of the CrossFit format is a format rule and is printed as "class lift", never as a trained group. |
| A4 | T7-PLC-01, T7-PLC-02 filed as soft | VOL-07 and R3-VOL-03 are approved procedures. As soft terms below T5 they give way to one more cheap set. | First exercise first; this time Monday, next time Thursday (VOL-07, R3-VOL-03). | Placement is their closed form (SF-3, SF-4), hard inside a group-day. The work lift never has fewer sets than another exercise of its group. Only the choice of day yields, and only when a day is full, with the reason printed. |
| A5 | T1-POL-02, fit factor 1.10 in the keep-time branch | A plan that says "keep 45 minutes" and prints 48-50 reads as a broken promise (RECHECK 01, 08). "A little longer" was said about full-body days needing 2-4 exercises, not about the plan built after the person refused more time. | "If they keep their time" (R3-SES-02); a little longer day (R2-SES-05). | Take the factor per branch as data. Proposed default: 1.00 on printed minutes once the person keeps their time; 1.10 only for the full plan on full-body days. Coach decision. |
| A6 | T5 ceilings per line for two-line groups | Hips gets two full ceilings (glutes + hamstrings): 35 sets a week in sample 06, past his "30 is for a very advanced person". | Hips is one group; Focus glutes means a bias of 1-3 sets inside it (R3-SES-01). | One ceiling per group. Lines are a sub-target inside the group (the Focus bias), never a second ceiling. |
| A7 | T1-POL-13, athletic blocks auto-cut for stay-active clients (PROPOSED) | The engine decides something he gave to the person. Fix rounds flipped the pickleball ankle work on, off and on again. | They can switch off that day's athletic or core block and focus on resistance (R3-SES-02); the 50+ racket defaults stay on (R3-ATH-02); heavy play weeks halve the jumps (R3-ATH-05). | One named parameter per profile class for "which fixed blocks stay ahead of a big mover". Default: the approved profile defaults stay, at their smallest dose (one athletic piece a day). The plan prints the ladder: what each switch buys. |

Smaller points:

- **Start of a kept group when time is short.** 12 v1.2 section 3.10.1 plans kept groups from the floor. The prototype instead holds week 1 near the level start, so hips runs 14 -> 16 with eight flat weeks where his example runs 10 -> 14. Starting at the floor gives more steps, which is the stairway he wants. In keep-time plans, "more steps" must outrank "start at the level start".
- **Week 1 above the start (SF-9).** Two exercises x 2 sets on every day a group is trained can start a beginner at 12 with a ceiling of 14. How many days a group trains must be a stage-1 decision.
- **Exercise count on full-body days.** T6 applies his counts (45 min about 5, 60 about 6-7, 75-90 about 8-9; VOL-08) to split days only. With "every pair supersetted" as the time test, a solver can build a 75-minute day of 12 two-set exercises. Use his counts, with a superset margin, as a capacity sanity cap in T1.
- **Laterality (T8).** For change-of-direction athletes 80-90 % unilateral is part of who the plan is for (UNI-02). It also changes minutes per set. It has to be chosen with the skeleton, before stage 1 checks time, not steered after dosing.
- **Calves.** His newest rule is one exercise x 3 sets per leg day (R3-SES-01). The floor of 10 for calves is our derivation. Calves at 6-8 on two leg days are his rule, not a floor miss; do not create an optional-day calf slot to chase 10 unless calves are a Focus muscle or he says so.
- **Athletic targets.** The 04 weekly numbers are PROPOSED; his own sessions run lower. Attainment against them must never outrank a resistance floor. For competitive athletes the approved structure (2 jump or throw stations + 1 Olympic lift inside 12 + 2) is hard; doses are scaled to the minutes first, then climb.

---

## 5. Coach-eye reading of the plans the new math has produced

The only plans from an exact method are the five prototype runs in `design/research/proto_endpoint.out.txt`. The prototype states its simplifications, and its checks (time, floor, slot decreases, VOL-07 shape, twin days, step caps) all pass. Read as a coach would read them:

| Run | What the numbers say | Coach-eye verdict |
|---|---|---|
| E4, L3 aesthetics 4 x 90 | chest 16 -> 18 (level start 20, ceiling 25); shoulders 16 -> 24; back 20, then 21 for ten weeks, then 22; quads 20 for eight weeks | Not signable. A big mover starts under its level and gains 2 while shoulders gain 8. Two big movers sit still for most of the block. (A1, A2) |
| E3, L2 4 x 75, Focus hips | chest 15 -> 18 (82 % of ceiling); shoulders 16 -> 22 (100 %); back 15 -> 20 | Same inversion, milder. (A1) |
| E2, the 2 x 45 racket player | hips 14 -> 16, calves 6 -> 8; weekly total 20 for six weeks, then 21, 22, 22, 22, 22, 24; days 43-49 min for 45 | Right groups (hips + pinned calves). Wrong feel: weeks 9-11 flat, then +9 % in week 12; week 1 starts high so only 4 steps exist; over the chosen minutes. (A2, A5, start-at-floor) |
| E1, L1 4 x 60 | all 8 groups kept; quads, hips, calves 12 -> 14; days 65-66 min in week 12; supersets needed on all four days; last four weekly rises +2, +2, +1, +8 | Arguable. Every day at 110 % with every pair supersetted is the edge of his policy, and the last week jumps 7.8 %. 12 v1.2 section 5.1 (heavier time model) sends triceps and calves to compound credit and stays inside 60. |
| All five | rises in the last four weeks: [2, 2, 1, 8], [0, 0, 0, 2], [4, 5, 4, 8], [3, 2, 1, 8], [3, 1, 1, 6] | Week 11 is the smallest late step (or tied) and week 12 a lump in every run. His "last four weeks" climb evenly. (A2) |

What this shows: **exact is necessary and not sufficient.** Every one of these plans is "proven optimal". The feel problems come from the objective and the tier order, which is why section 4 matters more to this lens than the choice of solver. The stairway-as-flow prototype is a real gain over the current rounding (weekly total flat weeks 7 -> 0 on the L1 case); it needs the A2 ordering, not replacement.

---

## 6. What he would expect on the three hardest samples

These are fidelity oracles for the benchmark. They are derived from repo documents (12 v1.2 sections 3.10.1 and 5.5, 05 v1.2 section 8.7.1, diagnosis table 1.5), not approved outputs. Ranges are deliberate; the exact method decides inside them.

**Pickleball, 2 x 45, stay-active, 50+ (sample 08).**
- First, before week 1: what the time holds and the ladder. From 12 section 5.5 for the same kind of client: 2 x 60 adds quads; 2 x 75 adds quads and back; core opener off buys about 8 minutes a day and a higher hips peak.
- If they keep 2 x 45: pinned calves (3 sets per leg day, 6 -> 7 or 8) and hips at 10 climbing to 12-14, on both days, two hip exercises each. The hinge keeps its push partner as a pair (one press), knee-friendly. One athletic piece a day, cuff and Achilles care, 4-5 resistance exercises, every day inside 45 minutes.
- Never: quads 4 -> 6 and hips 4.5 -> 6.75 "trained" (today); chest and calves only (the 3 x 45 trace); hips without calves; a week with more minutes training fewer groups.

**CrossFit-style class, 4 x 60 (sample 04).**
- First: the floor for every group needs about 90 minutes (peak about 95) or another day.
- If they keep 4 x 60: the class stays a class (warm-up, light core, skill, strength or power, WOD 10-20 min) and the work lifts follow his HALF TIME class levels. About 19 resistance minutes a day remain, so two or three groups (hips, quads, back in his order) are trained at 10 or more and climb, each on two days with two exercises. Press and bench stay as class lifts and are printed as class lifts. WOD minutes hold while a kept group needs the room. Skill is costed at its real minutes.
- Never: groups under 10 printed as trained (today quads 5-6 and hips 6-7.5); rear delts as the only group that climbs (RECHECK 04).

**Swimmer, 3 x 60 dryland (sample 01).**
- First: the athletic 3-day week at 60 needs about 80 minutes (peak about 95) or another day.
- If they keep 3 x 60: about 27 resistance minutes a day after warm-up, core, jumps, Olympic lift and shoulder care, so about three groups at 10 -> 12. Back first (lats and upper back lead the priority list of every swimming profile in `model/profiles.json`), then hips and quads, each on at least two days. Presses stay as pair partners. Shoulder care every session and never cut (R3-ATH-01). Olympic lifts on 2-3 days. Jumps mostly ballistic, plyometric share 10 -> 25 %. The optional Saturday carries bonus work only.
- Never: quads at 5 for 12 weeks; back flat in the last six weeks; cuff care cut while two near-identical flies stay.

---

## 7. Winner and grafts

**Winner: two-stage.** In one sentence: decide the block table in his unit with exact math, then place every set with his own procedures on his own skeletons.

Shape of the recommended planner, from this lens only:

| Stage | Decides | Coach rule it carries | Hard or solved |
|---|---|---|---|
| S0 skeleton | day types, slot order, pairs, spine days, athletic prefix, laterality share per exercise block | templates, ORD, UNI-11, R2-SES-01, UNI-02 | chosen from coach-approved variants; never invented |
| S1 who is trained | group states, which days each group trains, fixed blocks on or off | R3-SES-02 steps 1-2, R3-ATH-02 | exact, lexicographic in his keep order |
| S2 block table | sets per group per week, start and peak | floors, ceilings, Focus, stairway | exact; balance band; back-loaded steps |
| S3 placement | sets per exercise per day per week | VOL-07, R3-VOL-03, bonus rules, fixed exercises in a block | closed form, no search |
| S4 athletic | stations, sets, per-set doses, stage per exercise block | R2-ATH-01..05, R3-ATH | scaled to capacity before S2, then monotone |
| S5 dose and check | reps, RIR, rest; one time function; independent scorer | VOL-13/14, R3-VOL-04 | no volume change after S3 |

The link: S1 and S2 cost time with S3's own formula, so every table S2 emits has a placement inside the minutes (inventory SF-10; research "sandwich" argument for the middle weeks).

### Grafts from the milp angle

1. **Tier-by-tier optimization with whole-number freezes.** No weights between tiers. Tiers and their order are data, with his answer ids.
2. **Exact feasibility test for group selection**, with three results: fits, proven not to fit, unknown. "Unknown" never drops a group. Selection is the best set in his keep order, not the first set that probes clean.
3. **Offers by re-solving** at allowed values only (30 / 45 / 60 / 75 / 90 / 105 / 120 minutes, days + 1 on the template that intake would really get). Each offer states what it adds. Add the ladder of switches: core off, athletic off, what each buys.
4. **A minimal-conflict reason for every untrained group and every lowered peak**, written as a coach would say it ("Tuesday and Thursday hold 26 lifting minutes; hips and calves need 28").
5. **Leximin attainment**, upgraded by correction A1.
6. **An independent solver as a test-time cross-check only.** Nothing in the shipped plan depends on it.

### Grafts from the template-parametric angle

7. **Templates are the only source of day shape.** S0 picks a skeleton; later stages may empty a slot or use an approved variant, never rearrange a day.
8. **Format-specific progressions.** CrossFit class: his HALF TIME levels on the work lifts and resistance lifts, WOD minutes. Bootcamp: work seconds 35 -> 50 and rounds. Conjugate strength: the work, the accessory, the nuance, the survival. These formats climb in his variables, not only in sets per group.
9. **Skeleton variants by days x minutes as reviewable data.** The 2 x 45, 3 x 45 and 3 x 60 variants (which groups can sit on which day) are written out so he can approve them the way he approves a sheet.
10. **A small parameter vector as the explanation.** The plan can always be described as "these slots, this many sets, these weeks".
11. **Calibrate the time model on his sessions** (BYOP day 1: 7 exercises, 19 sets, about 60 minutes) and keep the worked examples of 12 v1.2 section 5 as golden tests.

### Grafts from this audit (apply to any design)

12. Corrections **A1-A7** of section 4.
13. **Keep-time plans start kept groups at the floor** and spend the saved minutes on the peak.
14. **Group-day frequency is solved** (SF-9), so week 1 starts at the level start, not at the ceiling.
15. **His exercise counts as a capacity sanity cap** on full-body days.
16. **One ceiling per group**; Focus is a bias of 1-3 sets inside it, two sets above the balanced line every week, its exercise first in its session.
17. **A coach-eye scorer that shares nothing with the planner** (section 8). A green solver certificate is not a signable plan.

---

## 8. Coach-fidelity acceptance checks for the benchmark

Each is measurable on a plan JSON. They complement the rule metrics of the inventory.

| Id | Check | Pass |
|---|---|---|
| CF-1 | Golden examples from 12 v1.2 section 5: 2 x 45 keeps calves + hips; 2 x 60 adds quads; 2 x 75 adds quads and back; Focus chest stays two sets above the balanced line and alternates Monday, Friday, Monday | exact groups; set tables within 1 set |
| CF-2 | No group printed as trained while under the floor | 0, unless the coach enables the state |
| CF-3 | Big movers first: relative progress of a group never more than one step ahead of a higher-priority group, unless a named hard rule blocks | 0 inversions |
| CF-4 | Late climb: in the last third of the block the weekly total rises every week when steps exist; no weekly rise above 7 %; no trained group's longest hold reaches into the last third | 0 breaks |
| CF-5 | Keep-time honesty: every non-test day at or under the chosen minutes, measured by re-costing the printed doses | 0 days over (or over the coach's tolerance) |
| CF-6 | His staircase: inside a group-day the sets are non-increasing in session order and differ by at most 1; the work lift is never below another exercise of its group; two exposures within 1 set | 0 breaks |
| CF-7 | More time never trains less: across the minutes and days sweep, no group is untrained, swapped for a lower one, or given a lower peak | 0 violations |
| CF-8 | Exercises per day inside his counts (with the superset margin); athletes 12 + 2 core | 0 over |
| CF-9 | Athletic: every key non-decreasing inside a stairway block, stage changes only at exercise-block starts, share within 5 points, planned at least 90 % of the scaled target and the scale printed | 0 breaks |
| CF-10 | Offers: every offered schedule is a valid intake and, when taken, gives exactly what the offer said | 100 % |
| CF-11 | The "what works" list never regresses: core first, power before strength, horizontal before vertical, pairs, one heavy squat and one heavy hinge on different days, no bands, medball at most 20 lb, tests only at the start and the end | 0 breaks |
| CF-12 | Every untrained group and lowered peak has a one-sentence reason naming the day and the minutes | 100 % |

---

## 9. Coach decisions that would move this judgement

Short, because the diagnosis and the inventory already list them. These five change what "faithful" means for the planner:

1. **Below-floor big movers on very short weeks** (round-4 item 2; A3). If he says yes, a fourth state returns as a named, solved parameter.
2. **Landing vs the last weeks** (A2): may one group reach its ceiling a week early so that each of the last weeks adds a set and no week jumps more than 7 %?
3. **The 10 % "little longer day"** (A5): does it apply after the person has chosen to keep their time?
4. **Which fixed blocks stay ahead of a big mover**, by profile class (A7).
5. **Calves on fewer than four leg days**: is 3 sets per leg day the whole rule?

Until he answers, the planner should take each as a parameter with the default proposed above, and the plan should print the default it used.

---

## 10. Files read

`workflows/planner_design.js`; `design/diagnosis.md`; `design/algorithm_research.md`; `design/rules_as_constraints.md` (tiers, T1-T5 items, objective vector, structural facts, failure modes, conflicts, tunable parameters); `design/research/proto_endpoint.out.txt`, `proto_stairway_flow.out.txt`; `coach_answers_round3.md`; `coach_answers_round2.md`; `synthesis/12_volume_algorithm_v1.md` (sections 3.7-3.14, 5, 7); `synthesis/05_session_architecture.md` (sections 0, 8.7.1-8.9, 9, 10); `BLAZE_CAMP_BRAIN.md` (sections 0c.3, 1, 5.6, 16); `samples/REVIEW_LOG.md` (v1.2 round and fix round 1 / F1); `samples/RECHECK_v0.3.md` (swimming, CrossFit class, pickleball).
