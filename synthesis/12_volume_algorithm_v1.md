# 12 · Volume algorithm v1 (research + design)

**What this is.** The weekly-volume engine for the Blaze Camp plan generator: how many hard sets each muscle gets per week, how that number moves week to week, where each new set goes, and how the engine learns. It answers the coach's request: *"go find charts that show those averages and match them with my experience"*, *"what has been studied on volume"*, *"what would be the best algorithm for us"* and *"this tool should figure out the percentages"* (COACH-ANSWER VOL-01, UNI-01, VOL-06). The machine-readable twin is `12_volume_algorithm_v1.json` (same folder).

**Status.** v1, 2026-10-08. Built on the coach's 138 answers in `coach_answers_full.md`. **His answers override every earlier inference and every earlier team decision.** Where he left a gap or asked us to propose, the rule is marked **PROPOSED - PENDING COACH APPROVAL** (short form below: **PROPOSED**).

**Evidence tags (on every rule).**

| Tag | Meaning |
|---|---|
| **COACH-ANSWER <ID>** | The coach's own answer (question ID from `coach_answers_full.md`). A RIGHT chip with no text makes our assumption his rule. |
| **OBSERVED** | Read from his Google Sheets (via the dumps and decode notes). |
| **SCIENCE** | Published research or a published coaching reference, cited with a URL (section 8). |
| **INFERRED** | Our reasoning from observed data. |
| **PROPOSED** | Our design to fill a gap. It needs his OK before it ships. |

**How the numbers were made.** Every worked example in section 5 was computed by a reference prototype of this engine (`vol_engine_v1.py`, `ex1.py`, `ex_all.py`, output `examples_out.json`, in the session scratchpad; see the verification log). Nothing in the coach's Google Sheets was opened or changed.

---

## 0. The algorithm on one page

| # | Rule | Tag |
|---|---|---|
| 1 | Count **weekly hard sets per muscle**. Main mover = 1.0 set; helpers = **0.25**; dips = 0.5 triceps + 0.5 chest; thruster = 1.0 quads + 0.5 shoulders. A **10/10** unilateral set = **1 set**. Plyos, ballistics, throws, Olympic lifts, sprints and change of direction **never** count toward muscles. | COACH-ANSWER VOL-09, LIB-16, LIB-14, UNI-01, VOL-10 |
| 2 | **Starting weekly sets** (big muscles): beginner **10-12**, intermediate **15-20**, advanced **20+**. **15-20** = maintenance to some growth, **20-25** = growth. Small muscles start at about 80 % of that (8 / 12 / 15). | COACH-ANSWER VOL-01, UNI-01; small-muscle share PROPOSED |
| 3 | **Priority muscle:** +4 to +6 sets on the start, cap about 25-30, 1-2 at a time. | COACH-ANSWER VOL-02 |
| 4 | **Pain:** that muscle or pattern -30 to -50 %, move it to constrained machines or split grips, or drop the exercise. | COACH-ANSWER VOL-03, UNI-08, EQ-03 |
| 5 | **Weekly increase = 3 %, 5 % or 7 % of that muscle's weekly sets, chosen by the PERSON's state** (effort logs, completion, performance, life stress), never by muscle size. Coach can override per client. **10 %/week is a hard ceiling.** | COACH-ANSWER VOL-04, VOL-05, UNI-05; readiness score PROPOSED |
| 6 | **Rounding:** bank the fraction every week; add a whole set when the bank reaches 1. | COACH-ANSWER VOL-06 |
| 7 | **Where a new set goes:** the first exercise for that muscle in that day's order, then the next (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3). Days rotate. The bilateral:unilateral target decides which group gets the set first. | COACH-ANSWER VOL-07; day rotation and group filter PROPOSED |
| 8 | **Small muscles at the end of a session** (biceps after a back day, etc.) get extra volume as a **bonus exercise**, ideally on a separate optional day. Big muscles that are full get a **Focus** slot. | COACH-ANSWER VOL-07, ORD-10, ORD-11 |
| 9 | **Session limits:** resistance-only sessions 5-7 exercises; field athletes off-season up to 10-12 (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance). Athletes, bodybuilders and powerlifters about 1.5 h (max 2 h); general and weight loss 45-60 min. About 11 fractional sets per muscle per session is the soft ceiling. Supersets are the tool when time is short or the client needs more fatigue. | COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09, ORD-05; SCIENCE (per-session ceiling) |
| 10 | **Bilateral:unilateral share** runs from 90/10 to 10/90 by athlete, goal, phase and pain: bodybuilders/powerlifters ~50/50 at the start → 80/20-90/10; field/COD athletes 80-90 % unilateral; in-season minimal bilateral. | COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13 |
| 11 | **Plan shapes:** 12-week (preferred) = 2-4 weeks acclimation, 4-6 weeks driving hard, last weeks hardest. 8-week = starts hard, first 4 weeks adapting, last 4 driving. 4-6-week = maintenance/transition at **50-70 %**. Also open-ended week-by-week and a yearly mode. **Deload ≈ half the sets, lighter.** Each repeated 12-week cycle starts one level higher. | COACH-ANSWER PER-01, PER-05 |
| 12 | **Learning:** log EFFORT, HOW IT FELT, DONE, WEIGHT/SCORE and a 3-question weekly check-in; tune each person's rate band and personal cap first, then the population tables, always inside fixed guardrails and with coach approval. | COACH-ANSWER VOL-01, VOL-02, GEN-05; method PROPOSED |

**What this retires (COACH-ANSWER VOL-05).** Every "big muscle = 3 %, medium = 5 %, small = 7 %" mapping in `03_volume_dosing.md` §9.6, `03_volume_rules.json > generator_rules.progression`, `generator_spec_v0.json > rule_tables.muscles.list[*].rate`, `> rule_tables.muscles.focus_rule` and `> progression.engine.rates`. Full supersede list in section 6.

---

## 1. What the coach decided (the inputs to this design)

His answers, grouped by what the engine needs. Quotes are short; the full text is in `coach_answers_full.md`.

**Counting**
- 10/10 means 10 on each leg; three sets of 10/10 rear-foot-elevated lunges count "mostly for quads" (glutes undecided). (COACH-ANSWER UNI-01)
- Alternating lifts count like unilateral ones. (COACH-ANSWER UNI-07)
- Helpers get **0.25**, not 0.5. (COACH-ANSWER VOL-09)
- Dips: "more tricep than chest but still .5 and .5". (COACH-ANSWER LIB-16) Thrusters: 1.0 quads, 0.5 shoulders. (COACH-ANSWER LIB-14)
- Leg curls, nordics and slider curls are a **leg flexion** segment, not hip dominant. (COACH-ANSWER CAT-09)
- Plyos, Olympic lifts, sprints and throws do not count toward muscles: "counting towards muscles is more for resistance patterns, not for athletic patterns." (COACH-ANSWER VOL-10)
- Big muscles: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs. Traps, front delts, adductors and neck are not placed. (COACH-ANSWER CAT-02)

**How much**
- Start: beginner 10-12, intermediate 15-20, advanced 20+ ("sounds about right"); the tool should learn from everyone's data. (COACH-ANSWER VOL-01)
- 15-20 sets is "a good foundation for maintenance to a little bit of growth", 20-25 "a good growth foundation"; 40 sets of chest is "way too much", 5 "too little". (COACH-ANSWER UNI-01)
- Priority: +4 to +6, cap about 25-30. (COACH-ANSWER VOL-02, PARTLY: "that's the idea... we'll collect data")
- Pain: cut 30-50 %, machines or split grips, "maybe even drop the exercise altogether". (COACH-ANSWER VOL-03)
- Calves get 3 sets every leg day; rear delts get their own sets; about 2 core exercises. (COACH-ANSWER VOL-17)
- The chest-vs-side-delt imbalance in his templates was not intended; balance it, but allow a V-taper bias when the athlete wants it. (COACH-ANSWER VOL-18)

**How it moves**
- The 3/5/7 % is a percentage of weekly sets per muscle. (COACH-ANSWER VOL-04)
- "It doesn't really go by muscle... It's just more on what's going on with the person"; the person or their coach adjusts it. (COACH-ANSWER VOL-05)
- "It can progress week by week by 10 %. That's way too much." Unilateral and bilateral progress the same way. (COACH-ANSWER UNI-05)
- Bank the fraction; "I need this tool... to figure out the percentages." (COACH-ANSWER VOL-06)
- 3-4 exercises per muscle group per day; add to the first exercise, then the second (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); small muscles at the end get a bonus exercise. (COACH-ANSWER VOL-07)
- Smooth increases for hypertrophy and general clients; steps and waves for fight or competition prep. (COACH-ANSWER PER-10)

**Session and week**
- Core first by default (warm-up), movable. (COACH-ANSWER ATH-11)
- Hip dominant + push, knee dominant + pull, for full body and bootcamps. (COACH-ANSWER UNI-11, ORD-06)
- No axial loading twice a week: squat once, leg press or belt squat the other day; deadlifts also load the spine. (COACH-ANSWER PER-04, EQ-11)
- 5-7 exercises in resistance sessions; field athletes off-season up to 10-12. (COACH-ANSWER VOL-08, VOL-16, VOL-17)
- About 1.5 h (max 2 h) for athletes, bodybuilders and powerlifters; 45-60 min for weight loss and everyday clients; unilateral work takes longer and "has to be accounted for". (COACH-ANSWER UNI-09)
- Supersets are a fatigue and density tool: short time, advanced clients who need more stimulus, off-season VO2/mitochondrial work, and beginners who don't fatigue. (COACH-ANSWER ORD-05)
- Optional days: add-on or separate, ideally separate. Focus slots can both hit the same muscle. (COACH-ANSWER ORD-10, ORD-11)
- Priority small muscles may go first in the session. (COACH-ANSWER ORD-04)

**Bilateral vs unilateral**
- Bodybuilders and powerlifters: ~50/50 at the start, then 80/20 or 90/10; field athletes 80-90 % unilateral; anywhere from 90/10 to 10/90; adjustable; pain adjusts it. Unilateral = health and rotational foundation, bilateral = driving force. Upper body follows the same logic. (COACH-ANSWER UNI-02, UNI-03)
- In-season: minimal bilateral. (COACH-ANSWER UNI-10)
- Contralateral load pulls you into the hip (change-of-direction athletes: football, soccer, basketball, tennis); ipsilateral helps you out of the hip (sprint acceleration step-ups); for bodybuilders and powerlifters contra/ipsi are health accessories mostly in the first 2-4 weeks. (COACH-ANSWER CAT-13)
- Same-pattern pairing (squat + lunge) drives a muscle harder for high-level and aesthetics clients; cross-pattern for bootcamp (less soreness). (COACH-ANSWER UNI-06)

**Plan shapes** (COACH-ANSWER PER-01, PER-02, PER-05, PER-07)
- 4-6 weeks: maintenance or transition (vacation, travel, off-season to in-season, moving) at about 50-70 % volume.
- 8 weeks: first 4 adapting, next 4 driving hard; "an 8-week program wants to modify you, so you have to start hard."
- 12 weeks (his preferred): 2-4 weeks getting used to the movements, 4-6 weeks driving hard "not all the way to the top", last weeks hardest. The next 12 weeks start one level higher ("start at a 2 and end at an 11").
- Week-by-week mode with no fixed length; yearly mode with quarter themes and automatic maintenance over the holidays.
- Blocks of 4-6 weeks with small variable changes between blocks. Deload = about half the sets, lighter. Tests chosen by checkbox, or none.

**Athletes** (COACH-ANSWER ATH-01, ATH-02, ATH-04, ATH-05, ATH-07, ATH-09, ATH-10, CAT-10, CAT-11, PER-08)
- Plyo vs ballistic is set by the sport's time on the ground: more ground time (karate, fighters) → more ballistics; less (sprinters) → more plyos; basketball a mix; baseball ballistics + rotational + sprints, few plyos. Programs start more ballistic and become more plyometric.
- Plyo method progression: receive and pause → receive then create → repeated receive/create. Not "zones"; he has not named it yet. Unilateral plyos are harder than bilateral.
- Everyone in athletic training gets Olympic lifts (beginners: DB/KB snatches, hex-bar jumps, hang pulls/cleans).
- Boxers: reduce pressing/arm volume when punching volume is high; do not cut it.
- No medball for aesthetics or bodybuilders except warm-up; medballs never over 20 lb.
- Aerobic sessions/week: 3 general/fat loss, 2 athletes in season, 4 aesthetics/bodybuilders, plus walks after workouts.
- Older clients: few plyos unless requested; no sex-based rules (age, foundation, goal, injuries decide).

**Levels and intake** (COACH-ANSWER PRG-05, GEN-02, CAT-06)
- Novice = under about 6-12 months; intermediate = consistent for over a year; more than 6-12 months off → the body is treated as a beginner (skills come back fast); ex-pros start at Level 1 only briefly. Level 1/2/3 naming is fine.
- Intake: drop sex; ask training experience in years; add body weight; competitive sport → sport, position, season; recreational → sport only.
- The client's level (volume) and the exercise's level (difficulty) are separate.

**Generator** (COACH-ANSWER GEN-03, GEN-05, GEN-08)
- Adjust week to week from logged EFFORT and HOW IT FELT: RIGHT. But for the output he is unsure whether people should track inside the tool ("They should be tracking it themselves"). **Conflict flagged; section 3.14 proposes two modes.**
- Coaches can add their own rules.

---

## 2. What the research says (the charts he asked for)

### 2.1 Weekly sets and muscle growth: the main studies

| Study | What it did | Key numbers | Tag |
|---|---|---|---|
| Schoenfeld, Ogborn, Krieger (J Sports Sci 2017, online 2016) | Meta-analysis, 15 studies, 34 groups | Each extra weekly set ≈ **+0.37 %** muscle growth; **10+ sets/week** beat 5-9, which beat <5. Few data above ~20. | SCIENCE |
| Schoenfeld et al. (MSSE 2019) | 34 trained men, 1 vs 3 vs 5 sets per exercise (≈6-9 / 18-27 / 30-45 weekly sets) for 8 weeks | Most growth at the highest volume; **strength the same** in all groups. | SCIENCE |
| Baz-Valle et al. (J Hum Kinet 2022) | Systematic review, 7 studies (6 meta-analysed), trained men | **12-20 weekly sets** recommended; above 20 helped triceps only (no extra for quads or biceps). | SCIENCE |
| Barbalho et al. (IJSPP 2020) | 37 trained men, 5 / 10 / 15 / 20 sets per muscle per week for 24 weeks | 5-10 sets gave strength gains equal to or larger than 15-20; growth showed the same trend, not significant. | SCIENCE |
| Aube et al. (JSCR 2022) | 35 trained people, 12 / 18 / 24 lower-body sets per week, 8 weeks | **18 best**, 12 adequate, 24 no better ("inverted U"). | SCIENCE |
| **Pelland, Remmert, Robinson, Hinson, Zourdos (Sports Med 2026; 56(2):481-505)** | Bayesian meta-regression, **67 studies, 2,058 people**; compared three ways of counting indirect sets (1, **0.5**, 0) | The **0.5 "fractional"** count fit best. Growth rises with volume with **diminishing returns** (+0.24 % per extra fractional set at the mean of 12.25 sets); strength plateaus much earlier. Frequency barely matters for growth when volume is equal, but helps strength. | SCIENCE |
| Remmert, Pelland, Robinson et al. (SportRxiv preprint) | Same team, **per-session** volume | Extra sets stop being detectably better at about **11 fractional sets per muscle per session** for growth and about **2 direct sets per session** for strength. | SCIENCE |

**Pelland's efficiency tiers** (preprint v2, Table 2A; the clearest "chart" in the literature). The smallest detectable change in muscle size was 2.05 %.

| Weekly fractional sets | Tier | Extra sets needed for the next detectable gain |
|---|---|---|
| 4 | minimum effective dose | - |
| 5-10 | higher efficiency | ~6 |
| 11-18 | intermediate efficiency | ~8.5 |
| 19-29 | lower efficiency | ~10.75 |
| 30-42 | lowest efficiency | ~12.5 |
| 43+ | unclear (few data, possibly less growth) | - |

For **strength** the tiers end much sooner: 1 set is the minimum, and above about 5 weekly sets more sets did not reliably add strength (Table 2B). Strength responds more to frequency and load.

### 2.2 The chart: his numbers against the research

One character = one weekly set per muscle.

```
                                     0    5    10   15   20   25   30   35   40   45
                                    ||----|----|----|----|----|----|----|----|----|
Pelland 2026: minimum dose          |    #
  higher efficiency (+1 step/6 sets)|     ======
  intermediate (+1 step/8.5 sets)   |           ========
  lower (+1 step/10.75 sets)        |                   -----------
  lowest (+1 step/12.5 sets)        |                              .............
  unclear, little data (43+)        |                                           ???
Schoenfeld 2017: <5 | 5-9 | 10+     |.....-----=============
Baz-Valle 2022: standard 12-20      |            =========
Barbalho 2020 (24 wk): 5-10 = best  |     ======
Aube 2022: 12 ok, 18 best, 24 worse |            o     #     x
RP chest: MEV . MAV = MRV -         |    ...==========--------
RP chest priority MRV*P 24-32+      |                        ---------
COACH beginner 10-12                |          BBB
COACH intermediate / maint.+ 15-20  |               IIIIII
COACH growth 20-25 / advanced 20+   |                    GGGGGG
COACH priority cap 25-30            |                         PPPPPP
COACH "5 too little", "40 too much" |     x                                  x
```

**How his experience matches (verdicts).**

| His number | Where the research puts it | Verdict |
|---|---|---|
| Beginner 10-12 (VOL-01) | Top of Pelland's high-efficiency tier, inside Schoenfeld's best category (10+), at the floor of Baz-Valle's 12-20. RP: beginners' landmarks are "substantially lower" than intermediates'. | **Matches.** Enough to grow, little waste. |
| Intermediate 15-20 = "maintenance to some growth" (VOL-01, UNI-01) | Pelland's intermediate tier; exactly Baz-Valle's standard; Aube's best (18). | **Matches as a productive baseline.** Science says true maintenance needs far less (section 2.4), so his "maintenance" here means "keeps you progressing slowly", not "the minimum to keep muscle". |
| Growth 20-25, advanced 20+ (UNI-01, VOL-01) | Pelland's lower-efficiency tier: still more growth, but each detectable step costs ~11 more sets. Baz-Valle found >20 helped triceps, not quads or biceps. | **Matches for trained people who recover well**, with a clear cost. Good for limited periods (end of a block), not all year. |
| Priority cap 25-30 (VOL-02) | Edge of Pelland's lower/lowest tiers; inside RP's priority ranges (chest MRV*P 24-32+). | **Matches** for one or two muscles at a time, with other muscles held back. |
| "5 too little, 40 too much" (UNI-01) | 5 = Pelland's minimum dose; 40 = lowest efficiency / almost no data. | **Matches.** |
| "10 % per week is too much" (UNI-05) | No study tested weekly % caps directly. Related evidence in section 2.6. | **Supported indirectly.** 3-7 % is conservative and sensible. |

**Counting difference to keep in mind.** Pelland counted indirect sets at 0.5; the coach counts helpers at 0.25 (COACH-ANSWER VOL-09). For chest, quads, hamstrings and back (mostly direct work) both counts are almost the same. For glutes, triceps, biceps and the delts the coach's count is lower than Pelland's for the same program. The engine stores **both** counts so the data can later show which predicts results better (section 3.14).

### 2.3 Per-muscle landmarks (Renaissance Periodization, intermediate lifters, direct sets/week)

MV = maintenance volume, MEV = minimum effective, MAV = maximum adaptive, MRV = maximum recoverable, "*P" = when the muscle is the priority and other training is cut back. RP notes beginners' landmarks are lower and advanced lifters' are similar to these. Chest, quads and rear delts re-checked on rpstrength.com on 2026-10-08; the rest from the team's 2026-10-07 fetch (`03_volume_dosing.md` §3.6).

| Muscle | MV | MEV | MAV | MRV | MAV*P | MRV*P | Frequency |
|---|---|---|---|---|---|---|---|
| Chest | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 2-4x |
| Quads | 2-4 | 4-6 | 6-14 | 14-18 | 10-18 | 18-24+ | 2-5x |
| Hamstrings | 0-2 | 2-4 | 2-8 | 8-14 | 8-14 | 14-20 | 2-3x |
| Glutes | 2-6 | 6-8 | 8-24 | 24-30 | 24-30 | 30-40+ | 2-5x |
| Back | ~6 | ~10 | 4-12 per session | ~20-25 | - | - | 2-4x |
| Biceps | 6-8 | 8-10 | 14-20 | 20-26 | 20-26 | 26-35 | 3-6x |
| Triceps | 0-4 | 4-6 | 6-16 | 16-20 | 16-20 | 20-26+ | 2-4x |
| Front delts | 0-2 | 0-2 | 4-8 | 8-12 | 12-16 | 16-20+ | 2-3x |
| Side delts (older RP figures, secondary source) | 0-6 | 8 | 16-22 | 26+ | - | - | 2-6x |
| Rear delts | 0-4 | 0-4 | 4-12 | 12-20 | 24-30 | 30-40+ | 3-6x |
| Calves | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 3-6x |
| Abs | 0-4 | 0-4 | 4-12 | 12-20 | 16-24 | 24-32+ | 3-6x |

RP also puts a practical per-session ceiling at about **8-12 sets per muscle**, close to Remmert's ~11. (SCIENCE)

**Why RP's numbers look lower than his.** RP counts direct sets only and assumes the indirect work is "free". His totals include helper credit (0.25) and his clients often run more sessions. On the big muscles his 15-20 sits at RP's MAV-to-MRV range: an intermediate pushing toward the top of a block, which is what his 12-week shape describes.

### 2.4 Maintenance (what a 4-6-week maintenance block needs)

- **Spiering et al. (JSCR 2021), review:** strength and size were kept for up to 32 weeks with **1 session/week and 1 set per exercise** if the load stayed heavy, in younger adults; older adults needed about **2 sessions/week and 2-3 sets per exercise** to keep size. (SCIENCE)
- **Bickel, Cross, Bamman (MSSE 2011):** after 16 weeks of 3 days/week × 3 sets, 32 weeks at **1/3 of the dose** (1 day/week, 3 sets) or **1/9** (1 day/week, 1 set). Young adults: 1/3 kept growing, 1/9 kept size. Older adults (60-75): neither dose kept the muscle-fibre growth, though strength was largely kept; the authors conclude older adults need more weekly sets than younger adults to keep size. (SCIENCE)
- **RP:** MV about 6 sets per muscle per week. (SCIENCE)
- **Barsuhn et al. (J Appl Physiol 2024):** trained men who simply kept their previous weekly sets grew and got stronger as much as (slightly more than) those who added 30 % or 60 %. (SCIENCE)

**Verdict for his 50-70 % rule (PER-01).** 50-70 % of an intermediate's working volume (about 8-14 sets per muscle) is **well above** the minimum the research needs to keep muscle in younger adults, so a 4-6-week block at that level should keep size and most strength while giving real recovery. For older adults the research says keep the high end (PROPOSED: floor 70 %).

### 2.5 Adding sets inside a block

- **RP:** start a block near MEV and add sets while recovery allows; the RP app's default is about **+1 set per muscle per week**, with soreness, pump and performance deciding; advanced lifters typically add only **2-3 sets per muscle per session over the whole 4-week accumulation**. RP argues autoregulated additions beat pre-planned ones. (SCIENCE; the "+1 per week" figure is from a secondary summary of the RP app)
- **Enes et al. (MSSE 2023/2024):** trained men, 12 weeks, quads, all starting at 22 sets/week: fixed 22, **+4 sets every 2 weeks (to 42)** or **+6 every 2 weeks (to 52)**. Strength: +6 > +4 > fixed. Growth: no significant group difference (a trend that levelled off at the higher volumes). The +6 group reported clearly less pleasant sessions and the highest training strain. (SCIENCE)
- **Scarpelli et al. (2022):** one leg on a fixed 22 sets/week, the other on **1.2 × the person's previous volume** (+20 %): the individualized leg grew more. (SCIENCE)
- **Barsuhn et al. (2024):** +30 % and +60 % above previous volume did not beat staying at the previous volume over 8 weeks. (SCIENCE)

**What this means for 3/5/7 %.** At 15-20 sets, 3 % adds ~0.5 set/week, 5 % ~0.8, 7 % ~1.1, i.e. RP's "about one set per week" at the top end. Big jumps (+30-60 %, or +4-6 sets every 2 weeks from 22) add strain without reliably adding growth. A person-based 3-7 % with a 10 % ceiling is a conservative, defensible design. (INFERRED from the above)

**The 10 % question in other sports.** In team sports, week-to-week load jumps above ~10-15 % have been linked to more injuries (Gabbett 2016, the acute:chronic workload model), but that model has been heavily criticised as a statistical artefact (Impellizzeri et al. 2021). In runners the "10 % rule" is weakly supported: injured runners in one cohort had ~32 % average weekly increases vs ~22 % in healthy runners, a difference that was not statistically significant (Nielsen et al. 2013). So 10 % is a sensible **ceiling**, not a target. (SCIENCE)

### 2.6 Readiness and autoregulation (choosing 3, 5 or 7 %)

- **RIR scale:** reps in reserve map to RPE (RPE 8 = 2 RIR, RPE 9 = 1 RIR). (Helms et al. 2016; Zourdos et al. 2016; SCIENCE)
- **People misjudge RIR by about one rep** (they think they have fewer reps left than they do); accuracy improves near failure and in sets under ~12 reps. (Halperin et al. 2022; SCIENCE) → use effort as a **trend**, not a single-set truth.
- **Autoregulated loading (RPE/RIR or bar speed) works as well as percentage-based loading** for strength (meta-analysis, 1RM difference 2.07 kg, not significant). (Hickmott et al. 2022; SCIENCE)
- **Life stress slows progress:** in 135 students over 12 weeks, high-stress lifters gained less bench and squat strength (Bartholomew et al. 2008); chronic stress slowed muscle recovery over 96 h (Stults-Kolehmainen et al. 2014). (SCIENCE)
- **Sleep:** several nights of short sleep lower force on multi-joint lifts (Knowles et al. 2018). (SCIENCE)

→ The coach's "it depends on how tired they are and what's going on in their life" (UNI-05, VOL-05) has direct research support. The readiness inputs in section 3.7 are exactly these: logged effort trend, completion, performance trend, sleep and stress.

### 2.7 Deloads

- **Bell et al. (Sports Med Open 2023), Delphi consensus of strength and physique coaches:** the consensus defines a deload as a planned period of lower training stress that clears physical and mental fatigue, helps recovery and prepares for the next block. Full agreement that deloads cut **sets** and **proximity to failure**; 95 % agreed a deload can sit in the **last week** of a block, 75 % in the **first week of the next block**; it can be pre-planned or autoregulated; keep the main multi-joint lifts. (SCIENCE)
- **Survey of 246 strength and physique athletes (Rogerson, Bell et al. 2024):** deload every **5.6 ± 2.3 weeks**, lasting **6.4 ± 1.7 days**; 79 % cut sets; most also cut effort; 47 % pre-plan, 39 % mix planned and reactive. (SCIENCE)
- **Coleman et al. (PeerJ 2024):** a full week off at the middle of a 9-week program did not change muscle growth but slightly reduced strength gains. (SCIENCE)

→ His "about half the sets, lighter" (PER-05) is in the middle of practice. Because the evidence for a fixed mid-block deload is weak and his 12-week description has none, v1 deloads **on readiness triggers** or **as the first week of the next cycle** (PROPOSED, section 3.12).

### 2.8 Older adults

- **Borde, Hortobágyi, Granacher (Sports Med 2015), 25 trials, age 65+:** best strength results with 2-3 sets per exercise, 7-9 reps, 70-79 % 1RM, 2 sessions/week; none of the volume variables predicted changes in muscle size. (SCIENCE)
- **NSCA position statement (Fragala et al. 2019):** 2-3 sets per major muscle group, 2-3 days/week, start from single sets and progress individually; power work at 40-60 % 1RM; 2 min rest. (SCIENCE)
- **Bickel 2011:** older adults need more weekly sets than younger adults to keep size. (SCIENCE)
- **Plyometrics for masters athletes:** 3-4 days between plyo sessions (NSCA guidance as summarised for the CSCS exam). (SCIENCE)

→ Fits the coach: older clients go to constrained machines for extra volume, few plyos unless they ask (EQ-03, ATH-09).

### 2.9 Unilateral vs bilateral

- **Liao et al. (Biol Sport 2022), 14 studies, 392 athletes aged 16-26:** unilateral training improved **single-leg jumps** much more (effect size 0.89); bilateral training improved **bilateral strength** more (-0.43, favouring bilateral); sprint, change of direction and single-leg strength showed no reliable difference. (SCIENCE)

→ Training is specific: bilateral drives force (powerlifters, bodybuilders), unilateral carries over to single-leg athletic actions. This is the coach's split (UNI-02).

### 2.10 Plyometrics vs ballistics and contact counts

- **Ground contact time classifies jumps:** fast stretch-shortening cycle (SSC) under **~250 ms** (sprinting ~80-90 ms, hurdle hops ~150 ms, low depth jumps) vs slow SSC over 250 ms (countermovement jumps ~500 ms). The 250 ms line is usually credited to Schmidtbleicher and is a continuum, not a hard border; newer work proposes refined thresholds. (SCIENCE)
- **NSCA lower-body contacts per session:** beginner 80-100, intermediate 100-120, advanced 120-140; 48-72 h between plyo sessions on the same area; 2-3 min between sets of depth jumps. (SCIENCE)
- **Observed in his sheets:** his own sessions sit at or below the NSCA beginner range (18-77 counted contacts per session; `03_volume_dosing.md` §6). (OBSERVED)

→ The coach's rule maps cleanly: sports that live in short contacts (sprinters, jumpers, basketball) get more fast-SSC plyos; sports with long ground time (karate, fighters, baseball) get more slow-SSC/ballistic work (ATH-01).

---

## 3. The engine v1

### 3.1 Counting units

**Credit map** (one working set; RIR 1-3, 5-30 reps). Main mover 1.0, helpers 0.25 (COACH-ANSWER VOL-09).

| Category (canonical bucket) | 1.0 | 0.5 | 0.25 | Tag |
|---|---|---|---|---|
| Bilateral knee dominant (squat, leg press, hack, belt squat) | quads | - | glutes, adductors | COACH VOL-09 (0.25); glute value PROPOSED |
| Unilateral knee dominant (split squat, lunge, step-up) | quads | - | glutes, adductors | COACH UNI-01 ("mostly quads"); glute value PROPOSED |
| Bilateral / unilateral hip dominant (deadlift, RDL, single-leg RDL, back extension) | hamstrings | glutes | - | glute 0.5 PROPOSED |
| Glute isolation (hip thrust, bridge, kickback, abduction) | glutes | - | hamstrings | PROPOSED |
| Leg flexion (leg curl, nordic, slider/swiss-ball curl) | hamstrings | - | - | COACH CAT-09 |
| Leg extension | quads | - | - | COACH VOL-09 assumption |
| Horizontal push | chest | - | triceps, front delts | COACH VOL-09 |
| Vertical push | front delts | - | side delts, triceps | COACH VOL-09 |
| Dips | - | triceps, chest | - | COACH LIB-16 |
| Thruster | quads | front delts ("shoulders") | - | COACH LIB-14 |
| Horizontal pull (rows; Kong row = double-KB row, low stimulus) | lats/upper back | - | biceps, rear delts | COACH VOL-09, LIB-09 |
| Vertical pull | lats/upper back | - | biceps | COACH VOL-09 |
| Lat pull-over ("pull under") | lats/upper back | - | - | COACH LIB-09 |
| Chest fly, side raise (and upright row), rear-delt fly / face pull, curls, triceps isolation, calf raise | the target muscle | - | forearms 0.25 on curls | COACH VOL-09, LIB-16 assumption |
| Core (thorax / pelvis) | abs/obliques | - | - | COACH CAT-08 |
| Plyo, ballistic, throw, Olympic, sprint, change of direction | **none** (own budget, section 3.13) | | | COACH VOL-10 |

**Other counting rules**
- **10/10 = one set** for the muscle (each side does one set). Alternating = unilateral. (COACH-ANSWER UNI-01, UNI-07; SCIENCE agrees: each limb's muscle did one set.)
- **Unilateral sets cost more time** (both sides): 1.5 × a bilateral set in the time model. (COACH-ANSWER UNI-09 "has to be accounted for"; factor PROPOSED)
- **MYO set** = 2 hard sets (INFERRED, unchanged from v0; only on the last machine or isolation exercise, COACH-ANSWER VOL-15).
- **Hard set** = a working set at 1-3 RIR (COACH-ANSWER VOL-13). Warm-up sets and A-drills never count (COACH-ANSWER ORD-08).
- The engine stores the **coach count (helpers 0.25)** as the steering number and the **Pelland count (indirect 0.5)** for research comparison. (PROPOSED)

### 3.2 Levels (client volume level, separate from exercise difficulty)

| Level | Who | Tag |
|---|---|---|
| **L1** (novice / "newby", the same thing) | Under about 6-12 months of consistent training, **or** more than 6-12 months off (body treated as a beginner; exercise level can stay higher because skills return fast). Ex-pros: L1 for one short acclimation block only, then up. | COACH-ANSWER PRG-05, CAT-06 |
| **L2** (intermediate) | Consistent training for more than 1 year. | COACH-ANSWER PRG-05 |
| **L3** (advanced) | 3+ years of consistent training **and** currently training 4+ days/week, or a competitive physique/strength athlete. | PROPOSED (he did not define advanced) |
| Level up | At the end of a block, when the client's logs show mostly "8 - That was perfect" or easier with no pain. | COACH-ANSWER PER-06 |

The old L4 is retired: competition level now changes the **athlete profile** (sport, position, season), not the volume level. (COACH-ANSWER PRG-05 accepts three levels; PROPOSED retirement of L4)

### 3.3 Starting weekly sets per muscle (aesthetics / hypertrophy goal; coach count)

"Fill policy" says what the engine does when a muscle is below its start: **target** = add direct sets; **credit** = count helper credit only, no direct slot unless it is a priority or the sport needs it; **floor** = indirect only, report it, never add; **core block** = set by the session count.

| Muscle | Class (CAT-02) | Fill policy | L1 start | L2 start | L3 start | Level cap L1 / L2 / L3 | Priority start (+4-6) / cap | RP intermediate direct (MEV / MAV / MRV) | Pelland tier at L2 start |
|---|---|---|---|---|---|---|---|---|---|
| Quads | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +5 / 26 (L2), 30 (L3) | 4-6 / 6-14 / 14-18 | intermediate |
| Hamstrings (hinge + leg flexion) | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +5 / 26, 30 | 2-4 / 2-8 / 8-14 | intermediate |
| Glutes | big | target (athletes: credit) | **10** | **15** | **20** | 14 / 22 / 25 | +5 / 26, 30 | 6-8 / 8-24 / 24-30 | intermediate |
| Chest | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +5 / 26-28, 30 | 4-6 / 6-16 / 16-24 | intermediate |
| Lats / upper back | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +5 / 26, 30 | ~10 / - / ~20-25 | intermediate |
| Side delts | small | target (athletes: credit) | 8 | 12 | 15 | 12 / 18 / 22 | +4 / 22, 26 | 8 / 16-22 / 26+ | intermediate |
| Biceps | small | target (athletes: credit) | 8 | 12 | 15 | 12 / 18 / 22 | +4 / 22, 26 | 8-10 / 14-20 / 20-26 | intermediate |
| Triceps | small | target (athletes: credit) | 8 | 12 | 15 | 12 / 18 / 22 | +4 / 22, 26 | 4-6 / 6-16 / 16-20 | intermediate |
| Calves | small | target | **3 per leg day** (6-12) | 3 per leg day | 3-4 per leg day | 16 / 18 / 24 | +4 / 22, 26 | 4-6 / 6-16 / 16-24 | high-intermediate |
| Rear delts | small | target (own sets) | 4 | 6 | 8 | 8 / 12 / 16 | +4 / 16, 20 | 0-4 / 4-12 / 12-20 | high |
| Abs / obliques | small | core block | 2 exercises × 2 sets per session, first | same | 2 × 2-3 | 16 / 20 / 20 | - | 0-4 / 4-12 / 12-20 | - |
| Front delts | unplaced | floor | indirect | indirect | indirect | - | opens a direct slot only if chosen | 0-2 / 4-8 / 8-12 | - |
| Traps, forearms, adductors, neck | unplaced / small | floor | indirect | indirect | indirect | - | direct slot only if chosen | - | - |

Tags: big-muscle starts **COACH-ANSWER VOL-01**; calves 3 per leg day, rear-delt own sets, ~2 core exercises **COACH-ANSWER VOL-17**; core first **COACH-ANSWER ATH-11**; priority +4-6 and cap 25-30 **COACH-ANSWER VOL-02**. **PROPOSED:** small muscles at ~80 % of the big-muscle start; rear-delt numbers; level caps; glute fill policy for athletes; the L3 start of 20 as the low end of "20+".

**Why small muscles start at ~80 % (PROPOSED).** (1) Time: with his 5-7 exercises per session (VOL-08, VOL-16), a 4 × 60-min beginner week holds about 78 working sets (computed, section 5.1); every muscle at 10-12 does not fit until supersets are used. (2) Untrained arms grow about as well from multi-joint lifts alone as from adding isolation (Gentil et al. 2015; SCIENCE). (3) 8-12 sets sit in Pelland's high-to-intermediate efficiency tiers and at RP's MEV-MAV. If he wants the same 10-12 / 15-20 / 20+ for every muscle, it is one switch in the JSON.

**Floors** (any goal, unless a sport profile removes a muscle on purpose): big muscles 4 sets, small muscles 2 (≈ research maintenance). (PROPOSED, unchanged from v0)

### 3.4 Goal, phase and population modifiers (multiply the start values)

| Situation | Lower body | Upper body | Small muscles | Rate / notes | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding / hypertrophy | 1.0 | 1.0 | 1.0 | same-pattern pairing allowed (squat + lunge) | COACH VOL-01, UNI-06 |
| Strength / powerlifting | 1.0 | 1.0 | 0.75 | weekly sets stay similar; preference moves the **reps** on big lifts | COACH VOL-12; small-muscle factor PROPOSED |
| General fitness, weekend-warrior athletic program (non-competitive adults and youth) | 0.8 | 0.8 | 0.8 | 45-60 min; cross-pattern pairing | COACH UNI-09, UNI-06, ATH-13; factor PROPOSED |
| Bootcamp | circuits 3-5 rounds × 30-50 s, 5-7 stations, 35-45 min | | | not set-based | COACH PRG-03 |
| Fat loss | 0.8 | 0.8 | 0.8 | + 3 aerobic sessions/week | COACH ATH-07; factor PROPOSED |
| Field/court athlete, off-season | 0.7 | 0.5 | credit only (side delts, arms) | resistance is 3-4 exercises after core, plyo and Olympic work | COACH VOL-08, VOL-17, UNI-02; factors PROPOSED |
| Strength-type athlete off-season (linemen, wrestlers, rugby, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6 | | COACH ATH-03; factors PROPOSED |
| Athlete pre-season | 0.6 | 0.4 | credit | more speed/power, less volume | COACH PER-08; factors PROPOSED |
| Athlete in-season | 0.4-0.5 | 0.3-0.4 | credit | 2 days/week; sprints for speed athletes, strength maintenance or jumps for others; bilateral minimal | COACH PER-08, UNI-10; SCIENCE (Bickel, Spiering maintenance); factors PROPOSED |
| Boxer / striker in high-punching weeks | as profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | reduce, never cut to zero | COACH ATH-04; factor PROPOSED |
| Older adult (60+) | as goal | as goal | as goal | default rate 3 %; extra volume on constrained machines (constraint 4-5); no overhead squat, snatch, low-bar or depth jumps; few plyos unless asked | COACH EQ-03, EQ-04, ATH-09; SCIENCE (Borde, Fragala, Bickel); 3 % PROPOSED |
| No sex-based rules | - | - | - | age, foundation, goal and injuries decide | COACH ATH-09, GEN-02 |

### 3.5 Priority muscles

1. One or two at a time; start = level start + 4 (L1-L2) to +6 (L3); cap about 25-30 (L2 26-28, L3 30). (COACH-ANSWER VOL-02; split by level PROPOSED)
2. The priority muscle's exercise goes **first** in its session (small priority muscles included). (COACH-ANSWER ORD-04)
3. Delivery order for the extra sets: its own exercises (VOL-07 order) → Focus 1 / Focus 2 slots on the optional day (both may hit the same muscle, 2-3 sets each) → a bonus exercise. (COACH-ANSWER ORD-10, ORD-11, VOL-07)
4. While a priority runs, **non-priority muscles progress at most 3 %/week** so the total stays recoverable. RP's priority ranges assume other muscles are trained less. (PROPOSED; SCIENCE RP)
5. Per-session ceiling for the priority muscle: 14 fractional sets (soft ceiling 11 for the rest). (PROPOSED; SCIENCE Remmert ~11)

### 3.6 Pain and injury

| Trigger | Action | Tag |
|---|---|---|
| Pain area declared at intake | Affected muscle/pattern starts at 50-70 % of its start (-30 to -50 %); its exercises move to constraint 4-5 machines or split grips; positions that hurt are excluded; that muscle's rate = 0 until 2 pain-free weeks. | COACH-ANSWER VOL-03, EQ-03; 2-week rule PROPOSED |
| 'Felt a PAIN' logged once | Next exposure: swap inside the same category to a more constrained, split-grip or unilateral variant; **keep the sets** if possible. | COACH-ANSWER UNI-08, GEN-05 |
| 'Felt a PAIN' on the same slot again | That slot -30 to -50 %; muscle rate 0. Removed sets may move to a pain-free exercise for the same muscle (e.g. hinge pain → leg curl + hip thrust). | COACH-ANSWER VOL-03; move PROPOSED |
| Third time | Drop the exercise for the block; flag for coach review. | COACH-ANSWER VOL-03 ("drop the exercise altogether") |
| Pain shifts the bilateral:unilateral share | Low-back pain under axial bilateral loads → 20 points toward unilateral/belt squat/machines; knee or hip pain in single-leg positions → 20 points toward bilateral machines. | COACH-ANSWER UNI-02 ("adjust accordingly"), EQ-11; 20 points PROPOSED |
| 'Felt the WRONG muscle' | Change one variable in the same category; volume unchanged. | COACH-ANSWER GEN-05 assumption, PER-02 |
| "Couldn't do it" | Regress one exercise level or use an assisted version; volume unchanged. | COACH-ANSWER GEN-05 assumption |

### 3.7 The weekly rate: 3 %, 5 % or 7 %, chosen by the person

The rate is **one number for the person each week** (COACH-ANSWER VOL-05). Muscle-level gates (pain, EFFORT 10 on that muscle's exercises) can only lower it for that muscle.

**Step 1: hard gates** (checked first)

| Gate | Effect | Tag |
|---|---|---|
| Median EFFORT of the week ≥ 9 ("9 - That was terrible"), or "10 - I'm done" on 2+ exercises | **Hold** (0 %) for everyone this week | COACH-ANSWER GEN-05 ("EFFORT 9-10 → hold or cut") |
| "10 - I'm done" on an exercise | That exercise -1 set next week | COACH-ANSWER GEN-05 |
| 'Felt a PAIN' | Pain protocol (3.6); that muscle 0 % | COACH-ANSWER VOL-03, GEN-05 |
| Hold for 2 weeks in a row | Deload next week | PROPOSED |
| Median EFFORT ≤ 6 ("6 - Broke a Sweat" or easier) | At least 5 %, and raise load or reps first | COACH-ANSWER GEN-05 ("EFFORT ≤ 6 → add") |

**Step 2: readiness score R (0-100)** (PROPOSED weights; tuned later from data, section 3.14)

```
R = 0.40·E + 0.20·C + 0.20·P + 0.20·L
E  effort fit   : median weekly EFFORT ≤6 → 100, 7 → 85, 8 → 70   (8 = "That was perfect", the bullseye)
C  completion   : % of planned sets marked DONE
P  performance  : main lifts vs last exposure (WEIGHT USED or SCORE, reps at the same load): up 100, flat 70, down 30 (average)
L  life         : weekly check-in (sleep, stress, energy, 1-5 each) → 0-100; if missing, the intake value
```

| R | Weekly rate | Plain meaning |
|---|---|---|
| ≥ 85 | **7 %** | fresh, everything done, lifts going up, life calm |
| 70-84 | **5 %** | on target (all "8 - That was perfect", sessions done) |
| 55-69 | **3 %** | busy or tired week, still training |
| < 55 | **0 % (hold)** | life is in the way; keep volume, no add |

Checks (computed): all EFFORT 8 + all sets done + flat lifts + normal life → R = 76 → 5 %. EFFORT 7 + lifts up + good life → 94 → 7 %. EFFORT 8 + 80 % done + flat + poor sleep/stress → 66 → 3 %. EFFORT 8 + 60 % done + lifts down + poor life → 54 → hold.

**Step 3: the planned rate before any logs** (static plans, week 1) (PROPOSED)
- Intake recovery signal (new intake question, 3 taps: usual sleep, stress, physical job / other sport load) plus age and layoff:
  - default **5 %**;
  - **3 %** if any of: high stress, under 6 h sleep, physically hard job or heavy sport practice load, age 60+, back from a 6+ month layoff (first block), pain declared;
  - **7 % is never given before logs show it** (the person has to earn it).
- **Target-seeking:** the plan uses the smallest of 3/5/7 % that lands the peak in the plan's final phase, never more than the intake band. Computed defaults (big muscles): L1 10 → 14 needs ~4 %/week over a 12-week plan → 5 %; L2 15 → 22 → 5 %; **L3 20 → 25 → 3 %** (at 5 % an advanced lifter hits the cap by week 7, too early for "last weeks hardest"). This also matches RP: advanced lifters add only 2-3 sets per muscle over a whole block.

**Step 4: ceilings**
- **10 %/week** on the person's total weekly resistance sets is a hard ceiling. Exempt: returning from a deload to the pre-deload volume, and block-boundary swaps that do not add sets. (COACH-ANSWER UNI-05; exemptions PROPOSED)
- The coach (or the client, if allowed) can set the rate by hand from 0 to 10 %. (COACH-ANSWER VOL-05, GEN-08)

**Phase limits on the rate** (section 3.12): 12-week acclimation weeks ≤ 3 %; 8-week first 4 weeks ≤ 5 %; maintenance blocks 0 %; fight or competition prep may use 2-week steps instead of smooth weekly adds (COACH-ANSWER PER-10).

### 3.8 Banking and rounding

```
bank[m] += rate × current_weekly_sets[m]          # every week, every target muscle
while bank[m] ≥ 1 and current[m] + 1 ≤ cap[m]:
    place one set (3.9); bank[m] -= 1
if current[m] ≥ cap[m]: bank[m] = 0                # at cap: progress load/reps/intensifiers instead
```
(COACH-ANSWER VOL-06: bank the fraction, add a whole set at 1; "round up, round down, that's fine". Release at exactly 1.0, not 0.75 as in v0.)

Helper credit gained when another muscle's set is placed is counted but does not use the bank. A muscle can exceed its cap by up to ~1 set through helper spill-over; the engine reports it and never adds direct sets above the cap. (PROPOSED)

### 3.9 Where a new set goes

1. **Day:** rotate through the days that train the muscle as a main mover (day A, then day B, …). (PROPOSED; COACH-ANSWER VOL-07 shows the order inside one day)
2. **Laterality group first** (big lower and upper muscles): if the current bilateral share is more than 3 points below target, the set goes to a bilateral exercise; more than 3 above, to a unilateral one; otherwise no preference. (PROPOSED, joins COACH-ANSWER UNI-02 with VOL-07)
3. **Inside the day, the coach's order:** add to the first exercise (in session order) whose sets are below the first exercise's; if all are equal, add to the first. This produces exactly 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3. (COACH-ANSWER VOL-07)
4. **Limits:** sets per exercise ≤ 4 (L1) or 5 (L2-L3), isolation ≤ 4; the muscle's per-session fractional sets ≤ 11 (priority 14); session minutes ≤ the client's limit. (COACH-ANSWER VOL-16 defaults of 3/2; limits PROPOSED; SCIENCE ~11 per session)
5. **No room on any day:**
   - first, superset the lower/upper pairs on that day if that frees the time (COACH-ANSWER ORD-05: short time, beginners who don't fatigue, advanced clients needing more fatigue);
   - **small muscle → bonus exercise** (2 sets) from the same category, on the optional day if there is one, otherwise the training day with the fewest exercises (COACH-ANSWER VOL-07, ORD-10);
   - **big muscle → Focus slot** (2 sets) on the optional day, otherwise on a day that already trains that region (COACH-ANSWER ORD-11; big-muscle use PROPOSED);
   - still no room → the bank waits (max 1.99) and progress comes from load, reps, and intensifiers (MYO on the last machine/isolation, supersets) (COACH-ANSWER VOL-15, ORD-05).
6. Respect the hard rules: core first; hip dominant + push, knee dominant + pull; no second axial-loaded day (squat once; leg press or belt squat on the other day; deadlifts count as spinal loading); row before pulldown; power before strength. (COACH-ANSWER ATH-11, ORD-06, PER-04, ORD-01, ORD-03)
7. Exercises stay fixed inside a 4-6-week block; only sets, reps, load and RIR change. Between blocks change one or two small variables (grip, stance, implement, range of motion, rep range); a stance change may swap laterality (used in example 5.2). A/B lead-lift weeks only for clients who want variety. (COACH-ANSWER PER-02, PER-03; SCIENCE Kassiano 2022: planned variation helps, random rotation can hurt)

### 3.10 Session limits and the time model

| Limit | Value | Tag |
|---|---|---|
| Resistance exercises per session | 5-7 (default 7); up to 8 in 90-min bodybuilding/powerlifting sessions or a full-body day that also carries calves | COACH VOL-08, VOL-16; 8 PROPOSED |
| Field athlete, off-season | up to 10-12 exercises: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance | COACH VOL-08, VOL-17 |
| Exercises per muscle group on its day | 3-4 | COACH VOL-07 |
| Default sets | 3 compounds, 2 isolation, 3 calves; minimum 2 per exercise | COACH VOL-16, VOL-17; minimum PROPOSED |
| Session length | athletes/bodybuilders/powerlifters ~90 min (max 120); general/weight loss 45-60; bootcamp 35-45 | COACH UNI-09, PRG-03 |
| Per muscle per session | soft 11 fractional sets, priority 14 | SCIENCE Remmert; RP 8-12; values PROPOSED |
| Rest | hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed | COACH VOL-14 |

**Time model** (PROPOSED; minutes per working set including rest): warm-up 8 (COACH-ANSWER ORD-08: 5 min cardio + drills); core block 2 × 2 sets × 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 ×); isolation 1.75 (unilateral 2.5); plyo/ballistic 1.5; Olympic 3.0; throw 1.25; supersetted pair × 0.65.
Capacity, mixed hypertrophy work: **45 min ≈ 13-14 sets, 60 ≈ 19-20, 75 ≈ 25-26, 90 ≈ 31-32**; supersets add ~25-35 %.

### 3.11 Bilateral : unilateral share

Share = bilateral sets ÷ (bilateral + unilateral sets) in the lower-body knee- and hip-dominant compound slots. Leg flexion, leg extension and isolation are excluded (COACH-ANSWER CAT-09). The same logic runs for upper-body push/pull (alternating = unilateral) (COACH-ANSWER UNI-03, UNI-07). A coach slider can set anything from 90/10 to 10/90 (COACH-ANSWER UNI-02).

| Profile | Start of block / weeks 1-4 | Later blocks / off-season | Pre-season | In-season | Upper body | Tag |
|---|---|---|---|---|---|---|
| Bodybuilder, powerlifter (L2-L3) | **50/50** for weeks 1-3/4 | **80/20 → 90/10** by the peak; keep a unilateral accessory if something bugs them | - | - | 80-90 % bilateral | COACH UNI-02, CAT-13 |
| Beginner aesthetics / general (L1) | 50/50 | 50/50 → 60/40 in later cycles | - | - | 70/30 | PROPOSED |
| Weekend-warrior athletic, bootcamp | 50/50, cross-pattern pairing | 50/50 | - | - | 60/40 | COACH UNI-06; numbers PROPOSED |
| Field/court change-of-direction athletes (tennis, soccer, basketball, football skill) | 20/80 | 15/85 | 15/85 | **10/90** (bilateral minimal) | 20/80 | COACH UNI-02 (80-90 % unilateral), UNI-10 |
| Sprinters / acceleration | 40/60 | 40/60 | 30/70 | 20/80 | 40/60 | PROPOSED (force need + ipsilateral step-ups, CAT-13) |
| Strength-type athletes (linemen, wrestlers, rugby, throwers) | 60/40 | 60/40 | 40/60 | 25/75 | 60/40 | PROPOSED (ATH-03) |
| Baseball / softball | 50/50 (OBSERVED: 4 bilateral + 4 unilateral sets) | 50/50 | 35/65 | 20/80 | 30/70 (pitchers: less overhead) | OBSERVED; COACH ATH-08; rest PROPOSED |
| Combat (boxing, MMA, karate) | 40/60 | 40/60 | 30/70 | 20/80 | 30/70 rotational | PROPOSED |
| Older / injured | 60/40 on constrained machines with supported unilateral work | | | | 70/30 | COACH EQ-03; numbers PROPOSED |
| Pain | shift 20 points toward the pain-free side | | | | | COACH UNI-02; 20 points PROPOSED |

**Inside the unilateral share** (COACH-ANSWER CAT-13; percentages PROPOSED): change-of-direction athletes load ~70 % of unilateral sets **contralaterally** (into the hip); sprinters use **ipsilateral** step-ups for acceleration (~60 % of unilateral sets); bodybuilders and powerlifters use contra/ipsi mostly in weeks 1-4 as health accessories. Court and combat athletes also get more frontal/transverse unilateral work (lateral lunges, cossacks, lateral step-ups) (COACH-ANSWER UNI-12).

**Pairing** (COACH-ANSWER UNI-06): same-pattern (squat + lunge) for high-level and aesthetics clients who need more stimulus on one muscle; cross-pattern for bootcamp and general clients (less soreness, more frequent sessions).

### 3.12 Plan shapes, deloads and cycles

| Mode | Shape | Rate limits | Tag |
|---|---|---|---|
| **12-week (preferred)** | Weeks 1-3 acclimation (2 for L3; 4 for L1 or returning), weeks 4-9 driving hard "not to the top", weeks 10-12 hardest (cap reached; intensifiers and RIR toward 1). | acclimation ≤ 3 %; then the person's rate | COACH PER-01; week split PROPOSED |
| **8-week** | Starts hard: **+10 %** on the start (two 5 % steps, "level 3 of 10"); weeks 1-4 adapting, 5-8 driving hard. | weeks 1-4 ≤ 5 %; then the person's rate | COACH PER-01; +10 % PROPOSED |
| **4-6-week maintenance / transition** | Flat volume at **50-70 %** of the last block's average of its final 4 loading weeks (new clients: of their level start). 50 % vacation/limited equipment; 60 % travel/moving/season change; 70 % planned maintenance. Older adults ≥ 70 %. RIR 2-3, no intensifiers. | 0 % | COACH PER-01; base, splits and older floor PROPOSED; SCIENCE Bickel, Spiering |
| **Week by week** (no end date) | Same phases: acclimation, then drive; block boundary every 4-6 weeks (variable change); deload on triggers or at the latest after 12 loading weeks. | person's rate | COACH PER-01, PER-02; 12-week limit PROPOSED |
| **Yearly** | Four quarters, each about one 12-week cycle + a transition week. Q1 (Jan-Mar): hard work with more cardio, cutting toward summer. Q2 (Apr-Jun): lose fat / get in shape, building some muscle while keeping fat down. Q3 (Jul-Sep): maintain the look and stay healthy (volume at the low end of 15-20, or 70 %). Q4 (Oct-mid Dec): build muscle (growth 20-25, priorities). **Last 2 weeks of December: automatic maintenance 50-70 %.** | per quarter | COACH PER-01 (his Q2 text is ambiguous; confirm) |
| **Fight / competition prep** | 2-week steps and waves instead of smooth weekly adds. | step every 2 weeks, same average rate | COACH PER-10; step size PROPOSED |
| **Athlete seasons** | off-season most volume; pre-season less volume, more speed/power; in-season 2 days, low volume; post-season recovery. | in-season 0 % | COACH PER-08 |

**Deload** (COACH-ANSWER PER-05): about **half the sets** of the current week (round up, minimum 1 per exercise), same exercises, lighter load or 3+ RIR, no buy-out, finisher, MYO or supersets; plyos only low-amplitude landings at half the contacts; conditioning easy (orange) only.
**When** (PROPOSED; SCIENCE Bell 2023, Rogerson 2024, Coleman 2024): no fixed deload inside the 12- or 8-week plan; triggered by (a) 2 weeks of hold, (b) median EFFORT ≥ 9 two weeks in a row, (c) 'Felt a PAIN' on 2+ slots in one week, (d) performance down on 3+ main lifts for 2 exposures; after a triggered deload, resume at the volume of 2 weeks before it. The **first week of the next cycle is a deload** (or the client goes into a maintenance block).
**Repeated 12-week cycles** (COACH-ANSWER PER-01, "start at a 2 and end at an 11"): next start = previous start × 1.05 (one step up), next cap = previous cap + 1 set, never above 25 (non-priority) / 30 (priority). Example L2 big muscle: 15 → 22, then 16 → 23, 17 → 24, 18 → 25. If the last cycle ended with holds or pain, or a maintenance block came between, repeat the same start instead (and skip the opening deload after a maintenance block, which already was the recovery). (step size PROPOSED)
**Tests:** chosen by checkbox at the start of the block, or "no testing"; the test week replaces the last loading week's top sets. (COACH-ANSWER PER-07)

### 3.13 Athletic volume (its own budget, never muscle sets)

| Rule | Value | Tag |
|---|---|---|
| Counting | contacts (plyos), reps/sets (ballistics, Olympic), throws, meters or bouts (sprints), cuts (change of direction) | COACH VOL-10 |
| Plyo vs ballistic share | set by the sport's ground-contact demand (short contacts → more fast-SSC plyos; long ground time → more slow-SSC ballistics) | COACH ATH-01; SCIENCE (<250 ms fast SSC) |
| Within a block | start more ballistic, end more plyometric (shift ~+25 points of plyo share across a block) | COACH CAT-10; size PROPOSED |
| Plyo method stage | weeks 1-2 receive & pause (stick landings) → weeks 3-5 receive then create → weeks 6+ repeated receive/create (hops, rebounds); bilateral before unilateral inside each stage (unilateral is harder). Not "zones". | COACH CAT-10, CAT-11; week split PROPOSED |
| Contacts per session ceiling | L1 80, L2 100, L3 120 (NSCA, lower ends); his own sessions run lower and that is fine | SCIENCE NSCA; OBSERVED |
| Sessions with plyos | 2-3/week off-season, 48-72 h apart for the same area; older/masters 3-4 days apart | SCIENCE NSCA |
| Olympic lifts | everyone in athletic training: L1 DB/KB snatches, hex-bar jumps, hang pulls/cleans; L2+ hang power, L3 full lifts (full Snatch / Squat Clean / Squat Clean & Jerk); youth may lift from the floor | COACH ATH-10, ATH-09, LIB-07 |
| Medball | rotational/athletic work only; never over 20 lb; light (8-10 lb) for speed; none for aesthetics/bodybuilders except warm-up | COACH ATH-05, EQ-06 |
| Older clients | few plyos unless requested; low-amplitude only | COACH ATH-09 |
| Deload | contacts and throws about half; landings only | COACH PER-05; PROPOSED |

**Plyo share by sport** (start of block → end of block; total jump volume follows his ranking basketball ≈ volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf, COACH-ANSWER ATH-02). Numbers PROPOSED.

| Sport | Plyo share (rest = ballistic) | Note |
|---|---|---|
| Sprinters, jumpers | 60 % → 75 % | shortest contacts |
| Basketball, volleyball | 45 % → 60 % | "a good mix" |
| Football skill, soccer | 40 % → 55 % | |
| Tennis / racket | 30 % → 55 % | (example 5.3) |
| MMA | 30 % → 45 % | "some plyos are always good" |
| Hockey | 30 % → 45 % | |
| Football linemen | 25 % → 35 % | |
| Wrestling / BJJ | 25 % → 35 % | |
| Boxing, karate, kickboxing | 20 % → 35 % | most ground time |
| Baseball / softball | 15 % → 30 % | ballistics + rotational + sprints |
| Golf | 10 % → 20 % | |
| Weekend-warrior athletic | 30 % → 45 % | |
| Older adults | 0-10 % (only if asked) | |
| Aesthetics, bodybuilding | no plyo block | |

### 3.14 How the engine learns

**Two delivery modes** (resolves the GEN-03 vs GEN-05 conflict; PROPOSED)
- **Static plan** (PDF, printable or phone page): the whole plan is computed up front with the intake-based rate (section 3.7 step 3). No tracking needed. Matches "they should be tracking it themselves" (COACH-ANSWER GEN-03).
- **Adaptive plan** (optional): a 30-second weekly check-in (or the BYOP log columns) and the generator writes next week. Required for the week-by-week mode. Matches "adjust week to week from logged EFFORT and HOW IT FELT" (COACH-ANSWER GEN-05). Learning uses only adaptive users who opt in.

**What to log** (minimum, phone-friendly; COACH-ANSWER GEN-02, GEN-05, PER-07)

| Level | Fields |
|---|---|
| Per exercise per session | DONE (sets done), reps or "hit target" yes/no, WEIGHT USED or SCORE, EFFORT 1-10 (his menu: '1 - Way Too Easy' … '6 - Broke a Sweat', '7 - That was tough', '8 - That was perfect', '9 - That was terrible', '10 - I'm done'), HOW IT FELT ('Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it"), pain location if any |
| Per week | check-in: sleep, stress, energy (1-5 each); body weight; reason for missed sessions |
| Per block | tests ticked at the start (strength, cardio, speed, or none); optional photos or girths |
| Computed | weekly fractional sets per muscle (coach 0.25 count and Pelland 0.5 count), e1RM per main lift (Epley) and rep PRs at fixed loads, readiness score, rate used, holds, deloads, pain events, adherence |

**What it tunes, in order** (PROPOSED)
1. **Each person's rate band.** If 7 % weeks are followed by green weeks and rising lifts, allow 7 % earlier next time; if 5 % weeks are followed by holds or pain, default that person to 3 %.
2. **Each person's cap (personal MRV).** The weekly sets at which lifts stall and EFFORT climbs for 2+ weeks become next block's cap minus 1-2 sets (RP's MRV idea, measured instead of guessed).
3. **Each person's next start.** One step up after a productive block (PER-01); same start after a block with holds.
4. **Population tables** (start, caps, rate bands, readiness weights, share targets, plyo shares) by level × goal × age band × sport, updated from many people's outcomes with a hierarchical model; a cell changes only after enough completed blocks (e.g. 200+) and **only with coach approval**. No sex-based cells (COACH-ANSWER ATH-09, GEN-02).
5. **Counting rules.** Test whether the 0.25 helper count or Pelland's 0.5 predicts each muscle's progress better (Pelland's own method). Keep 0.25 unless the data and the coach agree to change.
6. **Readiness weights.** Fit the score to predict next week's hold, EFFORT 10 or pain.

**Guardrails the learning can never remove:** 10 %/week ceiling; pain protocol; deload ≈ half; hard ordering and safety rules (no axial loading twice, core first, older-adult exclusions, no bands/variable resistance); priority cap 30; coaches' own added rules (COACH-ANSWER GEN-08). Every parameter set is versioned; any experiment needs the user's consent.

---

## 4. Pseudo-code

```python
# ---------- 0. intake -> profile ----------
level = level_from_experience(years_consistent, months_off, ex_pro)        # PRG-05 (L1/L2/L3)
goal, sport, position, season = intake.goal, intake.sport, ...            # GEN-02
age, body_weight, pain_areas, recovery = intake.age, intake.weight, ...   # GEN-02 + PROPOSED recovery question
mode = intake.plan_mode            # '12wk' | '8wk' | 'maint_4_6' | 'week_by_week' | 'yearly'
output = intake.output_mode        # 'static' | 'adaptive'                  # PROPOSED (GEN-03 vs GEN-05)

# ---------- 1. weekly targets ----------
for m in MUSCLES:
    start[m] = START_TABLE[m][level]                                      # 3.3 (VOL-01, VOL-17)
    start[m] *= GOAL_PHASE_FACTOR[goal, season][region(m)]                # 3.4
    if m in priorities: start[m] += 4 if level in ('L1','L2') else 6      # VOL-02
    if m in pain_muscles: start[m] *= 0.5 to 0.7                          # VOL-03
    cap[m] = CAP_TABLE[m][level] (+ priority cap, + cycle bonus)          # 3.3, 3.12
    if mode == '8wk': start[m] *= 1.10                                    # PER-01 "start hard"
    if mode == 'maint_4_6': start[m] = factor(context, age) * last_block_avg[m]   # PER-01 50-70 %
    if previous_cycle_completed_green: start[m] *= 1.05; cap[m] += 1      # PER-01 "start at 2, end at 11"
share_target = SHARE_TABLE[profile][phase]; apply pain shift              # 3.11 (UNI-02/03/10)

# ---------- 2. week-1 build ----------
slots = template(goal, days, minutes)                     # pairing hip+push / knee+pull, core first, no 2nd axial day
set defaults: compound 3, isolation 2, calves 3, core block 2x2           # VOL-16, VOL-17, ATH-11
repeat: trim muscles > start+1 (latest isolation first, min 2 sets);
        add to muscles < start-1 (largest relative deficit first) with place_set()
plan_rate = min(intake_band(recovery, age, layoff, pain), smallest of {3,5,7}% that lands the peak in the final phase)

# ---------- 3. weekly loop ----------
for week in plan:
    if deload_due(week): emit deload(current, factor=0.5); continue       # PER-05
    rate = plan_rate if output == 'static' else readiness_rate(logs[week-1])   # 3.7
    rate = min(rate, phase_cap(mode, week), 0.10)                          # acclimation 3 %, 8wk first 4 wks 5 %, ceiling 10 %
    for m in sorted(MUSCLES, key=priority_first_then_big):
        r = 0 if m in pain_frozen else (min(rate, 0.03) if priorities and m not in priorities else rate)
        bank[m] += r * weekly_sets[m]
        while bank[m] >= 1 and weekly_sets[m] + 1 <= cap[m]:
            if total_sets_after_add > 1.10 * total_sets_last_week: break  # hard ceiling
            if not place_set(m): bank[m] = min(bank[m], 1.99); break
            bank[m] -= 1
        if weekly_sets[m] >= cap[m]: bank[m] = 0; use_load_reps_intensifiers(m)
    apply_effort10_cuts(logs); apply_pain_protocol(logs)                  # GEN-05, VOL-03
    if week is block_boundary: change_one_small_variable(); rebalance_share(share_target)   # PER-02
    emit(week)

def place_set(m):
    for day in rotate(days_training(m)):                                   # day A, then B ...
        group = laterality_group(m, share_target)                         # bilateral vs unilateral first
        ex = first exercise in session order with sets < sets of the first, else the first (below max)   # VOL-07
        if fits(ex, per_exercise_max, per_session_muscle_cap=11 (14 priority), session_minutes): ex.sets += 1; return True
        if superset_frees_time(day): enable_superset(day); retry           # ORD-05
    if m is small: return add_bonus_exercise(m, prefer=optional_day)       # VOL-07, ORD-10
    if m is big:   return add_focus_slot(m, prefer=optional_day)           # ORD-11
    return False

def readiness_rate(log):
    if log.median_effort >= 9 or log.n_effort10 >= 2: return 0.0          # GEN-05 hold
    E = {<=6: 100, 7: 85, 8: 70}[log.median_effort]
    R = .4*E + .2*log.pct_done + .2*log.performance + .2*log.life
    rate = .07 if R >= 85 else .05 if R >= 70 else .03 if R >= 55 else 0.0
    if log.median_effort <= 6: rate = max(rate, .05)                      # GEN-05 add
    return rate

# athletic block (separate budget, VOL-10)
plyo_share(week) = SPORT_PLYO_SHARE[sport].start + progress(week) * (end - start)   # ATH-01, CAT-10
method_stage(week) = 'receive & pause' | 'receive then create' | 'repeated receive/create'  # CAT-10/11
contacts_per_session <= NSCA[level]
```

---

## 5. Worked examples (computed with the reference prototype)

Reading the tables: numbers are **weekly fractional sets per muscle (coach count, helpers 0.25)**. "rate" is the rate the engine used to build that week from the week before (it comes from the readiness score; the log behind each week is described under the table). "resist. sets" = total resistance working sets in the week (core block not included).

### 5.1 Beginner (L1) aesthetics, 12 weeks, 4 days × 60 min, full body

**Inputs.** 9 months of training, aesthetics goal, no priority, no pain, normal life stress → planned rate 5 % (intake band 5 %; target-seeking 10 → 14 needs ~4 %). Share 50/50 (beginner foundation). Days: Mon and Thu knee dominant + pull, Tue and Fri hip dominant + push (COACH-ANSWER ORD-06); squat Mon, leg press Thu (no second axial day, PER-04); core block first every day (ATH-11); calves 3 sets every day (VOL-17). Max 8 resistance exercises (7 + calves).

**Week 1 (after the week-1 fit):**
- **Mon:** Dead bug 2 · Side plank 2 · Goblet squat 3 · Chest-supported DB row 3 · DB split squat 10/10 2 · Lat pulldown 3 · Leg extension 2 · DB curl 3 · Calf raise 3
- **Tue:** Bird dog 2 · Pallof hold 2 · DB Romanian deadlift 2 · DB bench press 3 · Alternating staggered-stance DB deadlift 10/10 2 · Seated DB shoulder press 3 · Leg curl 2 · Cable pushdown 2 · DB side raise 4 · Calf raise 3
- **Thu:** Dead bug 2 · Side plank 2 · Leg press 2 · 1-arm DB row 10/10 3 · DB step-up 10/10 2 · Neutral-grip pulldown 2 · Hammer curl 2 · Reverse DB fly 2 · Single-leg calf raise 10/10 3
- **Fri:** Bird dog 2 · Pallof hold 2 · Hip thrust 4 · Incline DB press 3 · DB single-leg RDL 10/10 2 · Machine chest press 3 · Leg curl 2 · Overhead DB triceps extension 2 · DB side raise 3 · Calf raise 3

| Wk | phase | rate | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | acclimation | - | 11 | 11 | 9.25 | 9 | 11 | 7.75 | 7 | 7.75 | 3.5 | 12 | 16 | 78 |
| 2 | acclimation | 3% | 11 | 11 | 9.25 | 9 | 11 | 7.75 | 7 | 7.75 | 3.5 | 12 | 16 | 78 |
| 3 | acclimation | 3% | 11 | 11 | 9.25 | 9 | 11 | 7.75 | 7 | 7.75 | 3.5 | 12 | 16 | 78 |
| 4 | drive | 5% | 12 | 12 | 10 | 9 | 12 | 8 | 7 | 7.75 | 3.75 | 13 | 16 | 82 |
| 5 | drive | 5% | 12 | 12 | 10 | 10 | 12 | 9 | 8.25 | 8.75 | 3.75 | 13 | 16 | 86 |
| 6 | drive | 3% | 13 | 13 | 10.75 | 10 | 13 | 9.25 | 8.25 | 8.75 | 3.75 | 14 | 16 | 90 |
| 7 | drive | 5% | 13 | 13 | 10.75 | 11 | 13 | 9.25 | 8.5 | 8.75 | 3.75 | 15 | 16 | 92 |
| 8 | drive | hold | 13 | 13 | 10.75 | 11 | 13 | 9.25 | 8.5 | 8.75 | 3.75 | 15 | 16 | 92 |
| 9 | drive | 5% | 14 | 14 | 11.5 | 11 | 14 | 10.5 | 10.5 | 8.75 | 4.75 | 15 | 16 | 99 |
| 10 | final | 7% | 14 | 14 | 11.5 | 11 | 14 | 10.5 | 10.5 | 8.75 | 4.75 | 15 | 16 | 99 |
| 11 | final | 5% | 14 | 14 | 11.5 | 11 | 14 | 10.5 | 10.5 | 8.75 | 4.75 | 15 | 16 | 99 |
| 12 | final | 5% | 14 | 14 | 11.5 | 11 | 14 | 10.5 | 10.5 | 8.75 | 4.75 | 15 | 16 | 99 |

**Log behind the rates:** weeks 2-3 acclimation (capped at 3 %; the bank fills but releases nothing yet, exactly "getting used to the movements"); week 6 a poor-sleep, high-stress week (R ≈ 66 → 3 %); week 8 median EFFORT 9 → hold; week 10 EFFORT 7 with rep PRs (R ≈ 94 → 7 %).

**What happened.**
- Quads, hamstrings and back reach the L1 cap (14) in week 9; weeks 10-12 progress through load and reps (the "hardest" weeks are harder by intensity, not more sets).
- **The 60-minute limit is the real constraint.** Week 1 already fills ~60 min per day. To keep adding sets the engine supersets the lower/upper pairs on all four days (ORD-05: short time; beginners who don't fatigue), and from week 9 chest, side delts and glutes cannot get more sets inside 60 min. A beginner who wants more volume needs a 5th (optional) day or 75-min sessions; otherwise load/rep progression carries the last weeks.
- **VOL-07 order with the 50/50 share:** the quads sequence on Monday went Goblet squat 3 → 4 (week 4, bilateral share was below 50 %) and DB split squat 2 → 3 (week 9); Thursday Leg press 2 → 3 (week 6). The share decides the group, then the first exercise in that group gets the set.
- **Bonus exercise:** in week 9 triceps had no room in Tue/Fri, so a "Rope pushdown (bonus)" 2 sets appeared at the end of Thursday (VOL-07).
- Total resistance sets 78 → 99 (+27 % over 12 weeks, average +2.2 %/week; the largest single week +7.6 %, under the 10 % ceiling).

### 5.2 Intermediate (L2) bodybuilder, chest priority, 12 weeks, 5 days × 90 min + optional Focus day

**Inputs.** 4 years of training, aesthetics/bodybuilding, priority = chest. Chest start 15 + 5 = 20, cap 28 (VOL-02); other big muscles 15 (cap 22), small 12 (cap 18), rear delts 6, calves 3 per leg day; non-priority rate ≤ 3 %. Share: lower 50/50 in block 1 (weeks 1-4), 80/20 from block 2 (week 5) (UNI-02, CAT-13); upper 80 % bilateral. Split: Mon Push (chest first, ORD-04), Tue Legs A (back squat, the week's only axial squat), Wed Pull (row before pulldown, ORD-01), Thu optional Focus day (45 min: Focus 1 and Focus 2 both chest, ORD-11), Fri Upper (second chest exposure, different exercises, PER-04), Sat Legs B (belt squat, no second axial squat, EQ-11).

| Wk | phase | rate | quads | hams | glutes | **chest** | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | acclimation | - | 14 | 14.25 | 14.75 | **21** | 16 | 11.5 | 11.75 | 12.75 | 5 | 11 | 20 | 116 |
| 2 | acclimation | 3% | 14 | 14.25 | 14.75 | **21** | 16 | 11.5 | 11.75 | 12.75 | 5 | 11 | 20 | 116 |
| 3 | acclimation | 3% | 14 | 14.25 | 14.75 | **22** | 16 | 11.5 | 12 | 12.75 | 5 | 11 | 20 | 117 |
| 4 | drive | 5% | 15 | 15.5 | 16 | **23.5** | 17 | 13.75 | 12.75 | 13.75 | 5.25 | 11 | 20 | 126 |
| 5 | drive | 5% | 15 | 15.5 | 16 | **24.5** | 17 | 13.75 | 12.75 | 13.75 | 5.25 | 13 | 20 | 129 |
| 6 | drive | 7% | 16 | 17.75 | 18.25 | **26.5** | 18 | 14 | 13.25 | 13.75 | 5.5 | 13 | 20 | 136 |
| 7 | drive | 5% | 16 | 17.75 | 18.25 | **27.5** | 19 | 15.25 | 14.5 | 14.75 | 5.5 | 14 | 20 | 142 |
| 8 | drive | 5% | 17 | 19.25 | 21 | **27.5** | 19 | 15.25 | 14.5 | 14.75 | 6.5 | 14 | 20 | 147 |
| 9 | drive | 3% | 17 | 19.5 | 22 | **28** | 20 | 16.5 | 15 | 16.75 | 6.75 | 14 | 20 | 153 |
| 10 | final | 5% | 18 | 20.5 | 22.75 | **28** | 20 | 16.5 | 15 | 16.75 | 6.75 | 15 | 20 | 156 |
| 11 | final | 5% | 18 | 20.5 | 22.75 | **28** | 20 | 16.5 | 15 | 17.75 | 6.75 | 15 | 20 | 157 |
| 12 | final | 5% | 19 | 20.5 | 23 | **28** | 20 | 16.5 | 16 | 17.75 | 6.75 | 15 | 20 | 159 |

**The coach's add order, live** (chest exercises per day, in session order; Mon = bench / incline DB / machine press / cable fly; Fri = incline machine / flat DB / dips, where dips are triceps-led at 0.5 + 0.5 so the chest adds go to the two presses; Thu = the two Focus slots):

| Week | Mon | Fri | Thu (Focus) |
|---|---|---|---|
| 1-2 | 3/3/2/2 | 3/3/2 | 2/2 |
| 3 | 3/3/**3**/2 | 3/3/2 | 2/2 |
| 4 | 3/3/3/2 | **4**/3/**3** (dip set added by triceps) | 2/2 |
| 5 | 3/3/3/**3** | 4/3/3 | 2/2 |
| 6 | **4**/3/3/3 | 4/**4**/3 | 2/2 |
| 7 | 4/3/3/3 | **5**/4/3 | 2/2 |
| 9-12 | 4/3/3/3 | 5/4/4 | 2/2 (chest at cap 28 from week 9) |

**Block 2 (week 5), bilateral share 50/50 → 80/20.** The engine moved 2 sets from unilateral to bilateral lifts, then (because each unilateral lift keeps a 2-set floor) changed one variable on two lifts at the block boundary: the alternating staggered-stance DB deadlift became a reverse hyper / 45° back extension (no spinal loading, keeping PER-04) and the Bulgarian split squat became a hack squat (constrained machine, EQ-11). The walking lunge stays as the contralateral health accessory (CAT-13). Share 0.89 in week 5, 0.88 in week 12.

**What happened.**
- Chest climbs 21 → 28 in 9 weeks (+33 %) and holds at the cap; weeks 10-12 progress by load, reps and intensifiers. Monday chest = 13 fractional sets: allowed for a priority (cap 14) but above the ~11 ceiling, flagged.
- Glutes got **Focus** cable-kickback slots from week 1 (the template's direct glute work could not reach 15 inside Saturday's limits) and hamstrings a 45° back-extension Focus slot from week 6 (ORD-11). In weeks 8-9 one glute Focus slot landed on the pull day because both leg days were full (8 exercises) and the optional day was at its 5-exercise limit; a coach would likely allow 6 slots on the optional day instead. Flagged as a placement-rule refinement.
- Biceps and side delts got **bonus exercises** (VOL-07); with the optional day full, they went to the training day with the fewest exercises.
- Total sets 116 → 159 (+37 %; largest week-to-week rise +7.7 % in week 4, the first drive week, still under the 10 % ceiling). Friday reaches the 90-min limit in week 12.
- Glutes reach 23 (cap 22) through helper spill-over from squats and hinges: reported, no direct sets added.

### 5.3 Tennis player (L2) off-season, 8 weeks, 80-90 % unilateral, 4 days × 90 min

**Inputs.** Competitive tennis, off-season, 2 years of structured training. Base (field athlete off-season: lower × 0.7, upper × 0.5): quads, hamstrings 10; chest 6; back 8; rear delts 6 (shoulder health); calves 3 per leg day; glutes, biceps, triceps and side delts **credit only**. 8-week start = +10 % ("start hard"), cap = base × 1.3. Share: lower 15/85, upper 20/80, contralateral loading on lunges and single-leg RDLs (CAT-13), frontal-plane work (lateral lunge, cossack, lateral step-up; UNI-12). Each day: core first → plyo or ballistic → medball → Olympic/power → 3-4 resistance pairs → calves (VOL-08, VOL-17, ATH-10).

**Week 1:**
- **Mon:** Pallof press 10/10 2 · Copenhagen side plank 2 · Lateral bound 3 · Medball rotational scoop toss 8 lb 3 · Hang power clean 3 · Hex-bar jump 2 · RFE split squat 8/8, contralateral DB 3 · 1-arm DB row 10/10 3 · Lateral lunge 8/8 2 · Half-kneeling 1-arm pulldown 10/10 2 · Single-leg calf raise 12/12 3
- **Tue:** Dead bug 2 · Side plank 2 · Seated box jump 3 · Medball side toss 8 lb 3 · DB snatch 5/5 3 · Trap-bar RDL 2 · Alternating DB bench press 3 · Single-leg RDL 8/8, contralateral DB 3 · Half-kneeling landmine press 8/8 2 · Nordic curl (assisted) 2 · Reverse DB fly 3 · Single-leg calf raise 12/12 3
- **Thu:** Pallof press 10/10 2 · Copenhagen side plank 2 · Skater hop 3 · Medball shot-put throw 8 lb 3 · Hang clean pull 3 · Lateral step-up 8/8 3 · Pull-up 3 · Cossack squat 6/6 2 · 1-arm cable row 10/10 2 · Single-leg calf raise 12/12 3
- **Fri:** Dead bug 2 · Side plank 2 · Broad jump (stick) 3 · Medball overhead slam 10 lb 3 · KB swing 2 · Goblet squat 2 · 1-arm DB bench 8/8 2 · Single-leg hip thrust 10/10 5 · Push-up 2 · Slider leg curl 2 · Face pull 2 · Single-leg calf raise 12/12 3

| Wk | phase | rate | quads | hams | glutes* | chest | back | biceps* | triceps* | side d.* | rear d. | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | adapting | - | 12 | 10.75 | 9 | 7 | 10 | 2.5 | 2.25 | 0.5 | 6.25 | 12 | 16 | 61 |
| 2 | adapting | 5% | 12 | 10.75 | 9 | 7 | 10 | 2.5 | 2.25 | 0.5 | 6.25 | 12 | 16 | 61 |
| 3 | adapting | 5% | 13 | 11.75 | 9.75 | 7 | 10 | 2.5 | 2.25 | 0.5 | 6.25 | 13 | 16 | 64 |
| 4 | adapting | 5% | 13 | 11.75 | 9.75 | 8 | 10 | 2.5 | 2.5 | 0.5 | 6.25 | 13 | 16 | 65 |
| 5 | drive | 5% | 13 | 12.75 | 9.75 | 8 | 10 | 2.5 | 2.5 | 0.5 | 7.25 | 14 | 16 | 68 |
| 6 | drive | 7% | 13 | 12.75 | 9.75 | 8 | 10 | 2.5 | 2.5 | 0.5 | 7.25 | 14 | 16 | 68 |
| 7 | drive | 3% | 13 | 12.75 | 9.75 | 8 | 10 | 2.5 | 2.5 | 0.5 | 7.25 | 14 | 16 | 68 |
| 8 | drive | 5% | 13 | 12.75 | 9.75 | 8 | 10 | 2.5 | 2.5 | 0.5 | 7.25 | 14 | 16 | 68 |

\* credit only (helper sets), by design for a field athlete who does not need size (UNI-02).

Lower-body bilateral share **0.24** in week 1 and **0.21** in week 8 (goblet squat and trap-bar RDL are the only bilateral lifts: 76 % → 79 % unilateral, the low edge of his 80-90 %; the engine's new sets went to unilateral lifts because the share was above the 15 % target). Upper 0.25. Week 7 rate 3 % = a tournament-travel week.

**Athletic budget (separate; never in the table above):**

| Wk | Plyo sets | Ballistic sets | Plyo share | Plyo method stage | Plyo contacts/week | per plyo day | Throws/week | Olympic sets/week |
|---|---|---|---|---|---|---|---|---|
| 1 | 5 | 11 | 30 % | receive & pause | 40 | 20 | 168 | 9 |
| 2 | 5 | 11 | 33 % | receive & pause | 40 | 20 | 168 | 9 |
| 3 | 6 | 11 | 36 % | receive then create | 60 | 30 | 168 | 9 |
| 4 | 7 | 10 | 40 % | receive then create | 70 | 35 | 168 | 9 |
| 5 | 8 | 10 | 44 % | receive then create | 80 | 40 | 168 | 9 |
| 6 | 9 | 9 | 48 % | repeated receive/create | 126 | 63 | 168 | 9 |
| 7 | 10 | 9 | 52 % | repeated receive/create | 140 | 70 | 168 | 9 |
| 8 | 10 | 9 | 55 % | repeated receive/create | 140 | 70 | 168 | 9 |

(Plyo/ballistic sets are the engine's weekly targets; the generator meets a rising plyo share by turning ballistic slots into plyo variants of the same pattern, e.g. broad jump stick → repeated broad jumps. Contacts: 4 per side per set for stick landings, 5 per side for receive-then-create, 7 per side for repeated rebounds; throws = 3 medball exercises × 3 × 8 per side + slams 3 × 8.)

**What happened.** Resistance volume hits the athlete caps by weeks 5-6 (61 → 68 sets, +11 %); the "drive hard" weeks 5-8 come from the **athletic side** (ballistic → plyometric, single response → repeated rebounds), load, and Olympic intensity, which is how the coach describes athletes (resistance supports; athletic qualities lead). Plyo contacts stay at or under his own observed range and far under the NSCA intermediate ceiling (100-120 per session).

### 5.4 Maintenance / transition block, 4 weeks (the same bodybuilder after 5.2, travelling)

**Base** = average of 5.2's last 4 loading weeks (156 resistance sets/week): quads 18, hamstrings 20.2, glutes 22.6, chest 28, back 20, biceps 16.5, triceps 15.2, side delts 17.2, rear delts 6.8, calves 14.8.

| Factor | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves |
|---|---|---|---|---|---|---|---|---|---|---|
| 50 % (vacation, limited kit) | 9 | 10 | 11 | 14 | 10 | 8 | 8 | 9 | 3 | 7 |
| **60 % (travel, hotel gym)** | 11 | 12 | 14 | 17 | 12 | 10 | 9 | 10 | 4 | 9 |
| 70 % (planned maintenance; older adults' floor) | 13 | 14 | 16 | 20 | 14 | 12 | 11 | 12 | 5 | 10 |

**Two hotel-gym schedules at 60 % (flat for 4 weeks, RIR 2-3, machines and DBs, no intensifiers):**

| Schedule | Resistance sets | Share of base | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 3 × 60 min | 65 | **42 %** | 9 | 8.25 | 7.75 | 12 | 9 | 7.25 | 6.25 | 6 | 3.25 | 6 |
| **4 × 60 min** | **84** | **54 %** | 12 | 11.25 | 10.5 | 16 | 11 | 9.75 | 8.5 | 8 | 3.5 | 8 |

4 × 60 min plan:
- **Mon:** Dead bug 2 · Leg press 3 · Machine chest press 4 · Seated cable row 3 · DB split squat 10/10 2 · Leg extension 2 · Cable pushdown 3 · Calf raise 4
- **Tue:** Pallof press 2 · DB Romanian deadlift 3 · Incline DB press 4 · Lat pulldown 3 · Hip thrust 5 · Leg curl 2 · DB curl 4 · DB side raise 4 (supersets on)
- **Thu:** Dead bug 2 · Hack squat or Smith squat 3 · Flat DB press 3 · Chest-supported DB row 3 · Step-up 10/10 2 · Cable fly 2 · Reverse DB fly 2 · Calf raise 4
- **Fri:** Pallof press 2 · 45-degree back extension 3 · Machine incline press 3 · Neutral-grip pulldown 2 · Leg curl 2 · Hammer curl 3 · Cable side raise 4 · Overhead triceps extension 2

**What this shows.** Three 60-minute sessions cannot hold 60 % of a 156-set week (they hold 42 %). The engine should say so and offer: a 4th short session, 75-minute sessions, or supersets; or accept ~42 %, which the research says still keeps muscle in a younger adult for 4 weeks (Bickel: even 1/3 of the dose maintained or grew size in the young). For an older client it should insist on ≥ 70 % (Bickel). After the block, the next 12-week cycle starts at the **previous** start (not one step higher) and without an opening deload, since the maintenance block already gave the recovery. (PROPOSED)

---

## 6. What this changes in the v0 files (for the integrator)

| v0 location | v0 rule | v1 rule | Why |
|---|---|---|---|
| `generator_spec_v0.json > rule_tables.muscles.list[*].rate`, `.focus_rule`; `> progression.engine.rates`; `03_volume_rules.json > generator_rules.progression`; `03_volume_dosing.md` §9.6; `BLAZE_CAMP_BRAIN.md` §7.3 | big lower 3 %, big upper 5 %, small 7 %; focus "one class up" | person-based 3/5/7 % from readiness; priority = +4-6 sets on the start, not a faster rate | COACH-ANSWER VOL-05, VOL-02 |
| `rule_tables.counting.credit`; `03_volume_rules.json > counting.fractional_credit_map` | synergists 0.5 | helpers 0.25; dips 0.5/0.5; thruster 1.0/0.5; glute values PROPOSED | COACH-ANSWER VOL-09, LIB-16, LIB-14 |
| `rule_tables.counting.unilateral_set` | "'10/10' = 1 set (pending)" | 10/10 = 1 set, resolved | COACH-ANSWER UNI-01 |
| `rule_tables.weekly_sets` (hypertrophy_peak L1-L4; "15-20 read as the peak week") | peak-week targets, start back-solved | **start** table (10-12 / 15-20 / 20+), level caps, priority caps; L4 retired | COACH-ANSWER VOL-01, UNI-01, VOL-02, PRG-05 |
| `progression.engine.release` | threshold 1.0 with chunk = clamp(round(0.10 × current), 1, 2) | one whole set per bank unit; 10 % ceiling on the weekly total | COACH-ANSWER VOL-06, UNI-05 |
| `progression.engine.placement` | round-robin, never the same exercise twice in a row | his order: first exercise first (2/2/2 → 3/2/2 → …), day rotation, bonus/Focus fallback | COACH-ANSWER VOL-07 |
| `progression.deload.dose` | round(min(0.85 × W1, 0.75 × peak)) | ≈ 0.5 × current week's sets, lighter | COACH-ANSWER PER-05 |
| `progression.plan_shapes` 6 / 8 / 12 | 6 = 6 loading; 8 = 7 + deload; 12 = 6 + deload + 5 | 4-6 = maintenance 50-70 %; 8 = start hard, 4 + 4; 12 = 2-4 acclimation, 4-6 drive, last weeks hardest; week-by-week; yearly | COACH-ANSWER PER-01 (NOT RIGHT on v0) |
| `rule_tables.bilateral_unilateral.target_bilateral_share_lower` | 0.35-0.70 by goal | 90/10 ↔ 10/90 table (section 3.11) | COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13 |
| `rule_tables.session_budget` | 15-24 sets by level; athletic 24-30 | 5-7 exercises; athletes 10-12; 90 / 45-60 min; time model | COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09 |
| `vocab.levels` L1-L4 | four levels, NOVICE below NEWBY | L1 (novice = newby), L2, L3 | COACH-ANSWER PRG-05 |
| `progression.autoregulation` | EFFORT bands per muscle | person-level readiness score + gates (section 3.7) | COACH-ANSWER VOL-05, GEN-05 |
| `03_volume_rules.json > generator_rules.priority_muscles` | +4-6 and rate +2 points | +4-6 on the start, cap 25-30, non-priority ≤ 3 % | COACH-ANSWER VOL-02; PROPOSED |
| Band substitutes anywhere in volume swaps | banded leg extension etc. | removed; no bands or variable resistance | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12 |

---

## 7. Decisions waiting for the coach (PROPOSED - PENDING COACH APPROVAL)

1. **Small muscles** start at ~80 % of the big-muscle numbers (8 / 12 / 15), or the same 10-12 / 15-20 / 20+?
2. **Rear delts** own sets 4 / 6 / 8 per week to start?
3. **Glute counting:** hip thrust family 1.0, hinges 0.5, squats and lunges 0.25?
4. **Advanced (L3)** = 3+ years consistent and 4+ days/week now (or a competitive physique/strength athlete)?
5. **Readiness score** (effort 40 %, completion 20 %, performance 20 %, life 20 %) and the bands 85 / 70 / 55 for 7 / 5 / 3 / hold. A 3-question weekly check-in (sleep, stress, energy).
6. **Before any logs:** 5 % default, 3 % for stressed / older / returning / pain; 7 % only after logs earn it; the plan picks the smallest rate that puts the peak in the last weeks (advanced lifters therefore default to 3 %).
7. **Acclimation weeks** capped at 3 % (12-week) and 8-week first 4 weeks capped at 5 %; 8-week starts +10 %.
8. **No fixed deload inside a 12-week plan;** deload on triggers, and week 1 of the next cycle is a deload.
9. **Next cycle** = start × 1.05, cap + 1 (max 25 non-priority, 30 priority); same start after a maintenance block or a block with holds.
10. **Maintenance base** = average of the last 4 loading weeks; 50 % vacation, 60 % travel/moving/season change, 70 % planned maintenance; older adults never under 70 %.
11. **Non-priority muscles** limited to 3 %/week while a priority runs.
12. **Share numbers** for profiles he did not give: sprinters, strength-type athletes, baseball, combat, beginners, older/injured, pain shift of 20 points; contralateral ~70 % for change-of-direction athletes.
13. **Plyo:ballistic table** by sport and the +25-point shift across a block.
14. **Per-session limits:** 11 fractional sets per muscle (14 priority); 8 resistance exercises max in 90-min sessions or full-body days with calves; min 2 sets per exercise; max 4 (L1) / 5 (L2-L3) sets per exercise.
15. **Core block** = 2 exercises × 2 sets every session, counted toward abs; progress by difficulty or time, not by sets.
16. **Two output modes** (static plan from intake vs adaptive weekly check-in) to settle GEN-03 vs GEN-05.
17. **Yearly quarters** as written in section 3.12 (his Q2 description is ambiguous; please confirm Q1-Q4).
18. **Name for the plyo method progression** (CAT-11: "I don't know what to call it yet"). Suggestion: **"Receive-Create stages"** (RC1 receive & pause, RC2 receive then create, RC3 repeated receive/create).
19. **Glute target for athletes** = credit only (no hip-thrust volume added unless glutes are a priority or the sport needs it)?
20. **Time model** (2.5 min per bilateral compound set, 1.5 × for unilateral, 0.65 × for supersets) as the basis for "what fits".

---

## 8. Sources

**Coach and sheets.** `coach_answers_full.md` (138 of 140 answers, 2026-10-08), `coach_answers.md`; `synthesis/03_volume_dosing.md`, `03_volume_rules.json`, `generator_spec_v0.json`, `09_generator_inputs.md`; BYOP EFFORT and HOW IT FELT menus (`dumps/BYOP/`, 'MASTER EXERCISE LIBRARY' AX8:AY17). Google Sheets were not opened or changed.

**SCIENCE** (fetched or verified 2026-10-08 unless noted)
- Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci 2017 (online 2016). [PDF](https://paulogentil.com/pdf/Dose-response%20relationship%20between%20weekly%20resistance%20training%20volume%20and%20increases%20in%20muscle%20mass%20-%20A%20systematic%20review%20and%20metaanalysis.pdf)
- Schoenfeld BJ et al. Resistance training volume enhances muscle hypertrophy but not strength in trained men. MSSE 2019;51(1):94-103. [PubMed](https://pubmed.ncbi.nlm.nih.gov/30153194/)
- Baz-Valle E et al. A systematic review of the effects of different resistance training volumes on muscle hypertrophy. J Hum Kinet 2022;81:199-210. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/)
- Barbalho M et al. Evidence of a ceiling effect for training volume in muscle hypertrophy and strength in trained men - less is more? IJSPP 2020. [record](https://pure.solent.ac.uk/en/publications/evidence-of-a-ceiling-effect-for-training-volume-in-muscle-hypert/)
- Aube D et al. Progressive resistance training volume: effects on muscle thickness, mass, and strength adaptations in resistance-trained individuals. JSCR 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32058362/)
- Pelland JC, Remmert JF, Robinson ZP, Hinson SR, Zourdos MC. The resistance training dose response: meta-regressions exploring the effects of weekly volume and frequency on muscle hypertrophy and strength gains. Sports Med 2026;56(2):481-505, doi 10.1007/s40279-025-02344-w. [record](https://sponet.de/sponet/Record/4097139?lng=en) · [preprint v2 (efficiency tiers, slopes)](https://sportrxiv.org/index.php/server/preprint/view/460)
- Remmert JF, Pelland JC, Robinson ZP et al. Is there too much of a good thing? Meta-regressions of the effect of per-session volume on hypertrophy and strength. SportRxiv preprint. [preprint](https://sportrxiv.org/index.php/server/preprint/view/537)
- Renaissance Periodization: [volume landmarks](https://rpstrength.com/training-volume-landmarks-muscle-growth/), [chest](https://rpstrength.com/chest-training-tips-hypertrophy/), [quads](https://rpstrength.com/quad-training-tips-hypertrophy/), [rear delts](https://rpstrength.com/expert-advice/rear-delt-size-training-tips), [in defense of set increases within the mesocycle](https://rpstrength.com/expert-advice/in-defense-of-set-increases-within-the-hypertrophy-mesocycle); other muscle guides as listed in `03_volume_dosing.md` §12 (fetched 2026-10-07). Secondary summary of the RP app's +1 set/muscle/week and ~50 % deload: [arvo.guru](https://arvo.guru/resources/methods/rp-training). Side-delt figures: [secondary summary](https://mrpotato.substack.com/p/build-big-shoulders).
- Spiering BA et al. Maintaining physical performance: the minimal dose of exercise needed to preserve endurance and strength over time. JSCR 2021;35(5):1449-1458. [PubMed](https://pubmed.ncbi.nlm.nih.gov/33629972/)
- Bickel CS, Cross JM, Bamman MM. Exercise dosing to retain resistance training adaptations in young and older adults. MSSE 2011. [PubMed](https://pubmed.ncbi.nlm.nih.gov/21131862/) · [full text](https://paulogentil.com/pdf/Exercise%20Dosing%20to%20Retain%20Resistance%20Training%20Adaptations%20in%20Young%20and%20Older%20Adults.pdf)
- Enes A et al. Effects of different weekly set progressions on muscular adaptations in trained males. MSSE 2023/2024. [summary](https://www.fisiologiadelejercicio.com/efectos-de-diferentes-progresiones-en-el-aumento-de-series-semanales-en-entrenamiento-de-fuerza/) · companion perceptual paper [J Hum Kinet](https://jhk.termedia.pl/Exploring-the-Dose-Response-Relationship-between-Resistance-Training-Volume-and-Psychophysiological,209051,0,2.html)
- Scarpelli MC et al. Muscle hypertrophy response is affected by previous resistance training volume in trained individuals. JSCR 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32108724/)
- Barsuhn A et al. Training volume increases or maintenance based on previous volume: the effects on muscular adaptations in trained males. J Appl Physiol 2024, doi 10.1152/japplphysiol.00476.2024. [record](https://openrepository.aut.ac.nz/items/87b4d27e-50d0-4dd4-b652-1cf456281ded/full)
- Gabbett TJ. The training-injury prevention paradox. BJSM 2016. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4789704) · Impellizzeri FM et al. What role do chronic workloads play in the acute to chronic workload ratio? Time to dismiss ACWR. Sports Med 2021. [PDF](https://iris.univr.it/retrieve/e34cfb98-e922-4c2f-aab5-18583ab7e31b/Impellizzeri_What%20Role%20Do%20Chronic%20Workloads%20Play_SportMed_2021.pdf) · Nielsen RO et al. Can GPS be used to detect deleterious progression in training volume among runners? JSCR 2013. [record](https://research.rug.nl/en/publications/can-gps-be-used-to-detect-deleterious-progression-in-training-vol/)
- Helms ER et al. Application of the repetitions in reserve-based RPE scale. SCJ 2016. [record](https://openrepository.aut.ac.nz/items/92cefeac-7c32-44f1-bfbc-f48f4a5dd8cf/full) · Zourdos MC et al. Novel RT-specific RPE scale measuring RIR. JSCR 2016. [record](https://openrepository.aut.ac.nz/items/efef3b25-6701-4fb5-bb82-55fcd2a26027/full)
- Halperin I et al. Accuracy in predicting repetitions to task failure in resistance exercise. 2022. [preprint](https://sportrxiv.org/index.php/server/preprint/view/67)
- Hickmott LM et al. The effect of load and volume autoregulation on muscular strength and hypertrophy. Sports Med Open 2022. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8762534)
- Bartholomew JB et al. Strength gains after resistance training: the effect of stressful, negative life events. JSCR 2008. [record](https://pure.psu.edu/en/publications/strength-gains-after-resistance-training-the-effect-of-stressful-/) · Stults-Kolehmainen MA et al. Chronic psychological stress impairs recovery of muscular function and somatic sensations over a 96-hour period. JSCR 2014. [PubMed](https://pubmed.ncbi.nlm.nih.gov/24343323/)
- Knowles OE et al. Inadequate sleep and muscle strength: implications for resistance training. J Sci Med Sport 2018. [PubMed](https://pubmed.ncbi.nlm.nih.gov/29422383/)
- Bell L et al. Integrating deloading into strength and physique sports training programmes: an international Delphi consensus approach. Sports Med Open 2023. [record](https://shura.shu.ac.uk/32417/)
- Rogerson D, Bell L et al. Deloading practices in strength and physique sports: a cross-sectional survey. Sports Med Open 2024. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10948666/)
- Coleman M et al. Gaining more from doing less? The effects of a one-week deload period during supervised resistance training on muscular adaptations. PeerJ 2024. [PeerJ](https://peerj.com/articles/16777)
- Borde R, Hortobágyi T, Granacher U. Dose-response relationships of resistance training in healthy old adults. Sports Med 2015. [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4656698/)
- Fragala MS et al. Resistance training for older adults: position statement from the NSCA. JSCR 2019. [PubMed](https://pubmed.ncbi.nlm.nih.gov/31343601/) · [summary](https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html)
- Liao K et al. Effects of unilateral vs. bilateral resistance training interventions on measures of strength, jump, linear and change of direction speed. Biol Sport 2022;39(3):485-497. [Termedia](https://termedia.pl/Effects-of-unilateral-vs-bilateral-resistance-training-interventions-on-measures-of-strength-jump-linear-and-change-of-direction-speed-a-systematic-review-and-meta-analysis,78,44423,0,1.html)
- Gentil P et al. Single vs. multi-joint resistance exercises: effects on muscle strength and hypertrophy. Asian J Sports Med 2015. [article](https://brieflands.com/articles/asjsm-21609.html)
- Kassiano W et al. Does varying resistance exercises promote superior muscle hypertrophy and strength gains? A systematic review. JSCR 2022. [record](https://lida.sport-iat.de/ta/Record/4077216?lng=en)
- NSCA plyometric program design (CSCS chapter 18 summary). [PT Pioneer](https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/)
- Fast vs slow stretch-shortening cycle (<250 ms vs >250 ms). [Science for Sport](https://www.scienceforsport.com/stretch-shortening-cycle/) · [UKSCA technical models](https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/plyometric-technical-models-biomechanical-principles-636806567189424439.pdf) · refined thresholds: [A new approach for classification of SSC: beyond 250 ms](https://www.sponet.de/sponet/Record/4091532?lng=en)

---

## Verification log

- **Coach answers:** `coach_answers_full.md` read in full (CAT-01 … FIX-04, 140 questions; LIB-10 and LIB-12 unanswered) and `coach_answers.md`. Every COACH-ANSWER tag in this file cites the question it comes from.
- **Research:** each SCIENCE claim was fetched or searched on 2026-10-08 (Pelland preprint text and Table 2A/2B, Bickel full text, Bell Delphi full text extracted locally; others from the abstract page or a cited summary, labelled where secondary). RP chest, quads and rear-delt landmarks re-fetched; other RP rows carried from the 2026-10-07 fetch in `03_volume_dosing.md`.
- **Computation:** a reference prototype of sections 3-4 (`vol_engine_v1.py`, `ex1.py`, `ex_all.py`) was run with the team venv (`.venv/bin/python`); output `ex_all_out.txt` and `examples_out.json`, all in the session scratchpad (`/private/tmp/claude-501/.../scratchpad/`). The four examples, the chest/quads add-order traces, the weeks-to-cap table (L1 10 → 14, L2 15 → 22, L3 20 → 25 at 3/5/7 %), the cycle progression (15/22 → 16/23 → 17/24 → 18/25) and the band chart were all produced by those scripts.
- **Prototype findings that changed the rules:** (1) at 4 × 60 min a beginner's week 1 already fills the time, so the superset fallback (ORD-05) was added; (2) hamstrings and glutes stalled once their only exercise hit the per-exercise maximum, so the big-muscle Focus fallback (ORD-11) was added; (3) bonus exercises pushed a push day to 10 exercises, so the exercise-count limit (VOL-08) now applies to bonus and Focus slots; (4) moving sets could not reach 80/20 while unilateral lifts keep 2 sets, so the block-boundary stance swap (PER-02) was added; (5) at 5 % an advanced lifter hits the cap by week 7, so the planned rate became target-seeking (3 % for L3).
