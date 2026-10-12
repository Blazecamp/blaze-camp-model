# Coach-eye review, round 5: sample 05, Bootcamp (3 sessions, DB + KB kit, 8 weeks), engine 0.6

**Grade: B+.** Only small tweaks are left. All three round-4 majors are fixed in the engine, not by hand. Each session now has a real cardio station in his slot. The progression text matches what the client will actually do. The shoulders running past their top number is now stated, with what to do about it. What remains is open coach questions (Q8, Q10, Q13, G-119(3)) and copy or selection polish. Nothing here would stop Lalo from handing the plan out.

Files reviewed: `samples/plans/05-bootcamp.en.md`, `.es.md`, `.json`; intake `samples/intakes/05-bootcamp.json` (42 y, general population, L2, Mon/Wed/Fri, FIELD_TRACK_KIT + DB (35 lb pair) + KB, medballs to 14 lb, Spanish output). Template `fat_loss_bootcamp.3` (BYOP 'BOOTCAMP - OPTION 2', 1A/2A/3A).
Authority used: CH5 + R4 + CT-01 > CX > R3 > R2 > full > chat > sheets. Session length was not judged (CT-01). Open coach questions 8, 10, 13, 14 (`samples/STATUS_v0.5.md`) and the G-119 / G-139 / G-199 open items (`engine/DECISIONS.md`) are rated minor at most.

## Round-4 majors: status

| R4 # | Problem | Status in 0.6 | Evidence |
|---|---|---|---|
| M1 | Cardio station filled by a power drill (KB swing, medball slam), moved to station 1 and dosed as max-intent | **Fixed** | Mon jump rope (station 4), Wed burpees (station 6), Fri jumping jacks (station 3). All three are dosed "hard but steady pace" for the whole station and stay in his slot order. There is no ballistic station, no throw budget, and no "athletic work: 20 throws" line (G-135). |
| M2 | Progression text contradicted the plan ("rounds stay", "climbs every week", ranges ending at 4 x 45 s, week 7 silent on the extra round) | **Fixed** | "How you progress": "4 rounds, then 5 from week 7; ... 35 s to 50 s, a step every 2 weeks". Per-day ranges read "4 rounds x 35 s → 5 rounds x 50 s". Week 7 "What changes" says "One more round: 5 rounds a station (was 4)". The weekly table note and the ES twin agree. |
| M3 | Shoulders ran from 18 to 22.5, above the top of 18, without saying so | **Fixed (said)** | "Before you start" says shoulders reach 22.5 against a usual top of 18 and to "skip one Shoulders station in the extra round" (EN/ES). `meta.stairway[0].over_top` records it. Whether to hold the stations off the round instead is G-119(3), open. |

Round-4 minors fixed along the way: m7 (the slam is gone), m10 (one acceleration line: "25 % more sets for every muscle group: one more circuit round"), m11 in part ("more than 1 rep left" / "más de 1 repetición" are now singular), m12 (the weekly tables print whole sets), m13 (no throw count, and the cardio station is labelled "conditioning station").

## What the plan does (week 1)

| Day | His slots (OPTION 2) | Plan stations, in order (4 rounds x 35 s) |
|---|---|---|
| Mon (1A) | BKD, H-pull, single-leg hinge, Core, Cardio | box goblet squat, chest-supported row, rear-foot-on-wall DB RDL, **jump rope**, + step-up, + reverse fly, + hammer curl |
| Wed (2A) | BHD, H-push, Bicep, V-push, Cardio | single-KB deadlift, DB floor press, DB curl, + offset push-up, alternating DB OH press, **burpees**, + floor skullcrusher |
| Fri (3A) | V-pull, single-leg squat, Cardio, Tricep, ABduction | chest-supported row (for the V-pull, swap line printed), split squat, **jumping jacks**, + push-up, + bent-over row, OH triceps ext, supinated lateral raise |

Core opener (2 x 2) comes first every day, and there are 7 stations every day. Weekly sets, week 1 → week 8: quads 12→15, hips 11→14, back 12→15, chest 12→15, shoulders 18→23 (22.5), biceps 11→14, triceps 12→15; total 72→90. Timer 35-35-40-40-45-45-50-50 s, 4 rounds in weeks 1-6 and 5 in weeks 7-8, 15 s to change, 90 s between rounds. RIR 3/3/3/3/2/2/1-2/1 + a 10 s hold on one small-muscle station a day in week 8. Block 2 (week 5) changes one detail on 6 stations.

## Problems

### Blockers

None.

### Major

None. The round-4 majors are fixed. Everything still open belongs to a listed coach question or is copy or selection polish.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Weekly sets; Mon/Wed stations | Hips are still the smallest group (11 → 14) and have no bridge or hip thrust, though the kit holds a bench and DBs (`dumbbell-hip-thrust` is live). Open question 10. | STATUS Q10; R4-SES-05 (Day B hip work) | minor | After Q10: let the freed station take `RP_BHD` (DB hip thrust) when `no_vertical_pull` is set (`engine/select.mjs`, bootcamp station filler). |
| m2 | Week 7 | Sets sit flat at 72 for six weeks, then rise 25 % in one week (the 5th round). It is now said clearly, so it is acceptable, but week 7 is still a cliff rather than a step. Open question 13. | R2-PER-03/04; STATUS Q13 | minor | Once Q13 is answered, set `rules.json > stairway.circuit` (for example the 5th round in week 8 only). |
| m3 | Shoulders | 22.5 sets against a top of 18 is now said. Holding them off the extra round is open item G-119(3). Also, "Before you start" says 22.5 while the tables print 23. | G-119(3); CX-03 | minor | Print the over-top number with the same rounding as the tables (`render.mjs`, `warning.circuit_over_top` args). |
| m4 | Mon station 2 and Fri station 1 | The same chest-supported row (a `reference_only` record) is a template pick twice a week. Friday then has two horizontal rows and no vertical pull. Open question 8. | R4-LIB-01 / V31 spirit; STATUS Q8 | minor | After Q8, promote the row records, or give Friday's first row its `detail_variation` (underhand or pause) from week 1. |
| m5 | Mon core, every week | The Copenhagen plank is still the day-1 pelvis opener for a 42-year-old general-population client. It is a hard adductor hold, not a light opener, and STATUS lists it as not fixed. Easier swaps are printed, so the client has a way out. | R2-SES-03 (light core opener) | minor | In `engine/select.mjs`, exclude `copenhagen-*` from the general-population core opener at L1-L2 and default to `side-plank-hip-lifts` or the side plank. |
| m6 | Wed station 5 | Overhead press with no incline option. The kit's `bench` is not a `weight_bench`, so incline-first cannot be met, and the plan does not say so. The buy list (pull-up bar, TRX) does not offer an adjustable bench. | R4-LIB-03, R4-LIB-04 | minor | When `incline_first` cannot be met, print a swap line ("Overhead press instead of an incline press: no adjustable bench") and add `weight_bench` to `meta.kit.buy_list`. |
| m7 | Mon station 6 (reverse fly) | Still no "instead of" line. `instead_of: null` while `flags: ["no_vertical_pull","pattern_gap"]`. Friday's row has one. | R4-LIB-04 | minor | In `engine/library.mjs`, give a `pattern_gap` filler an `instead_of` record so the swap note prints. |
| m8 | Fri station 1, weeks 5-8 | The swap line under "Chest-Supported Row - underhand grip" still reads "Chest-Supported Row instead of Single-Arm Lat Pulldown". | R4-LIB-04 (accurate one-liner) | minor | Build `instead_of` text from the current block's exercise name (`render.mjs`). |
| m9 | Wed and Fri order | Added stations sit inside his slot order: Wed puts the offset push-up between his Bicep and V-push slots; Fri puts push-up and bent-over row before his Tricep and ABduction. Horizontal-before-vertical and multi-joint-before-single-joint make this defensible, but it goes against the template note "his slots first, then the floor stations". Carried over from R4 m14. | R4-SES-05 / V30; template note | minor | Either append added stations after his slots in `week.mjs` (the H-push can still precede the V-push if it is the template's own rule), or change the template note to match. |
| m10 | Every day, "You can switch off these blocks today: core, ..." | Core is still listed first, and `day.easy_to_remove` is empty. The day should name the easiest things to remove (curl, lateral raise, the cardio station). | R4-SES-04; H05; V36 | minor | Fill `day.easy_to_remove` for circuit days (small-muscle stations first) in `engine/week.mjs`, and print core last or only in the general "How to adjust" list. |
| m11 | Station picks | Odd defaults for this client: a *supinated* lateral raise where he names DB lateral raises; a rear-foot-on-wall RDL where he named the staggered-stance DB deadlift (it sits in the swap list); "Step-Up (forward and lateral)" asks for two patterns in one 35-50 s station. Carried over from R4 m8. | R4-SES-05 (his named examples) | minor | Add a `coach_named` selection bonus in `rules.json > selection` for the staggered-stance DB deadlift and the plain DB lateral raise. |
| m12 | Cardio station swap lines | Jump rope's swaps read "keeps the jump" for the intervals and the run/walk; burpees read "keeps the conditioning effect". On a cardio station the kept quality is conditioning. The warm-up A-March also reads "keeps the sprint work" for a general-population client. | GEN-01 tone; R4-LIB-04 | minor | Key `swap.keeps.*` on the station bucket (`COND_CIRCUIT` → conditioning) rather than the record's own tag (`library.mjs`). |
| m13 | "How to adjust" | "In a circuit you can skip the jump, throw or cardio station": this plan has no jump or throw station. | GEN-01 | minor | Print only the station kinds the plan holds (`render.mjs`). |
| m14 | Weekly table | Calves are a `floor_groups` member and are not trained (his OPTION 2 drops them, which is fine), but the table has no "-" row, though its legend promises one. Carried over from R4 m6. | R3-SES-01; H17 "named, never hidden" | minor | Print the calves row with "-" when `floor_groups` holds calves and no station trains them. |
| m15 | Copy, EN and ES | EN: "Optional upgrade: pull-up bar or suspension trainer (TRX) would add" (needs "a pull-up bar or a TRX"). ES: "... (TRX) agregaría" (should be "agregarían"), "Aperturas posteriores inclinado" (better "con el torso inclinado"), "este es más difícil / más fácil" after feminine names (Elevación..., Sentadilla... → "esta"), "Saltar la cuerda (Jump Rope) (estación de acondicionamiento)" (double brackets), "salta una estación de Hombros" (lower-case "hombros"; EN "Shoulders station" likewise). EN week 7: "more than 1-2 reps left" reads oddly. | R2-GEN-08 (quality ES); GEN-01 | minor | Fix the `before.upgrade` keys in `tools/compile/es/*.mjs` and EN; add gender to `swap.loses.*` ES strings; lower-case group names mid-sentence; print the RIR band floor ("more than 2") in "What changes" (`render.mjs`). |

Minor count: 15.

## What Lalo would like

- **His skeleton, in his order.** 1A/2A/3A of BOOTCAMP - OPTION 2 are all there, each slot in its place. Core moves to the opener, and the cardio slot sits where he put it (Mon 4th once core leaves, Wed after the V-push, Fri after the single-leg squat). The cross pattern holds every day: squat + row, hinge + press, single-leg squat + pull (UNI-11, ORD-06).
- **A real cardio station every session.** Jump rope, burpees and jumping jacks, all in the kit, worked continuously for the whole station, with cardio swaps (intervals, run/walk). This is his "Cardio" row.
- **7 stations a day**, inside his 5-7 (R4-SES-02, PRG-03). 4-5 rounds of 35-50 s with 15 s changes and 90 s between rounds is his bootcamp format.
- **Floor of 10** on every trained group (11-12 in week 1), pulling level with pressing (4 stations each), and nothing piled on.
- **Core first** with a light 2 x 2 opener. Horizontal before vertical on Wednesday (floor press and push-up before the OH press).
- **Progression written as a rule the person applies.** "Pick a weight you could keep moving with about 3 reps left at the bell; add load only where you finish with more left" (R4-PRG-03). The text now matches the plan: the extra round in week 7, a time step every 2 weeks, and a clear week-7 note (R4-PRG-02). RIR drifts 3 → 2 → 1-2 → 1, with one 10 s hold on a small-muscle station in week 8 (R3-VOL-04, H02).
- **Honest about the kit.** It says up front there is no vertical pull and what would add one. Friday's swap prints what it keeps and what it loses. The over-top shoulders are said, with what to do about them.
- **Block 2 changes one detail** (goblet → high-Zercher, KB → DB deadlift, alternating → seesaw press, overhand → underhand rows, hammer → Zottman).
- **Optional add-ons** (wall sit; farmer carry by distance or time, no muscle credit) sit outside the template (R4-LIB-01/02). YouTube search links come with the name to copy (R4-LIB-05).
- **The liability line** prints at the top and the bottom in EN and ES (R4-SCP-02).
- **The Spanish is natural and neutral Latin American**, with English gym terms in brackets throughout ("Sentadilla goblet al cajón, tocar y subir (Box Goblet Squat)", "Saltar la cuerda (Jump Rope)", "Remo con pecho apoyado (Chest-Supported Row)"). Only the small slips in m15 remain.
