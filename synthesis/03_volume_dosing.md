# 03 - Volume and dosing model (Blaze Camp) - v1

**What this is.** A single model of how much training the coach prescribes: exercises per session, working sets per session and per week, weekly sets per muscle, rep ranges, effort, rest, athletic-pattern dosing (contacts, throws, sprints, cuts, Olympic lifts) and conditioning. It ends with a generator-ready rule set (section 9). The machine-readable companion is `03_volume_rules.json` (same folder).

**How it fits with the volume engine.** The weekly-volume engine (starting sets per muscle, the person-based 3/5/7 % rate, banking, where each new set goes, priority, pain, bilateral:unilateral share, plan shapes, deload timing, learning) is **`12_volume_algorithm_v1.md` / `12_volume_algorithm_v1.json`, which is authoritative**. This document keeps the evidence from the sheets (sections 2-8), states each coach rule in one line with its question ID and points to the 12 section for the numbers, and fully specifies only what 12 does not: rep selection, effort and rest, session caps by population, the athletic sport dial and conditioning dose. Where 12 and a coach answer disagree, the coach answer wins and the conflict is listed in the v1 section below.

**Status.** v1, 2026-10-08. The coach answered 138 of 140 questions (`coach_answers_full.md`; earlier chat statements in `coach_answers.md`). **His answers override every inference from the sheets and every earlier team decision in this file.** Where he asked the team to propose, or left a gap, the rule is marked **PROPOSED - PENDING COACH APPROVAL** (short form: PROPOSED). The v0 file (2026-10-07, two verification passes) is backed up in the session scratchpad (`v1_03/03_volume_dosing.v0_backup.md`). An adversarial v1 verification (2026-10-08, last section of this file) checked every volume-relevant coach answer against the rules, tables, examples and JSON and fixed what it found (v1 change rows 42-47, conflicts 4-6).

**Audience.** The coach (to check that this is how he thinks) and the engineer who will build the generator (to encode it).

**Evidence tags (used on every claim).** Authority order, highest first:
- **COACH-ANSWER <ID>** = the coach's own answer in `coach_answers_full.md` (question ID, e.g. COACH-ANSWER VOL-07). A RIGHT chip with no text makes the team's assumption his rule.
- **OBSERVED** = read from a cell, colour, merge or formula in the coach's sheets. The location is cited as workbook / tab / cell or the decode file that holds it.
- **SCIENCE** = external literature or published coaching references, cited inline and listed in section 12 (and in `12_volume_algorithm_v1.md` §8).
- **INFERRED** = team reasoning from the observed data.
- **PROPOSED** = team design to fill a gap; needs the coach's OK before it ships.

**Sources read.** `coach_answers_full.md` (in full), `coach_answers.md`, `12_volume_algorithm_v1.md` and `.json`; all decode files in `analysis/programs/` (every `*.md` quantitative section and every `*.volume.json`), `analysis/library/L4_dosing_vocab.json`, `L4_notes.md`, `analysis/reference/specialty_notes.md`, `sheet23_notes.md`, and these raw dumps for verbatim checks: `MASTER_MODEL/08_AEROBIC_CAPACITY_CHEAT_SHEET.txt`, `10_ALL_ABOUT_SQUATS.txt`, `14_NOT_DONE_ALL_ABOUT_BALLISTICS.txt`. Nothing in Google Sheets was opened or changed.

**Abbreviations.** BYOP = workbook 'BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL'. MM = workbook 'BLAZE CAMP MASTER MODEL'. Canonical buckets: RP_BKD/BHD = bilateral knee/hip dominant, RP_UKD/UHD = unilateral knee/hip dominant, RP_HPUSH/VPUSH/HPULL/VPULL = horizontal/vertical push/pull, ISO_* = single-joint isolation (ISO_HAM = the **leg-flexion** segment: leg curls, nordics, slider curls, COACH-ANSWER CAT-09), AP_* = athletic pattern (PLYO, JUMP_LIMITED_KNEE, THROW, COD, SPRINT, TRIPLE_EXT), CT/CP = core thorax/pelvis. RIR = reps in reserve. RPE = rating of perceived exertion. L1-L3 = client volume levels (COACH-ANSWER PRG-05). 'JUSTICE LEAGUE' is the sheet tab name of a weekend-warrior athletic program for non-competitive adults and youth (COACH-ANSWER ATH-13); it is cited here only as a source, and the generator must use a generic name (COACH-ANSWER FIX-03). Contacts are plyometric ground contacts; RC1-RC3 = the plyo method stages receive & pause / receive then create / repeated receive-create (working name PROPOSED in 12 §7 item 18; COACH-ANSWER CAT-10, CAT-11: "not necessarily a plyo zone").

---

## v1 - coach answers applied

### What changed (one line each, with the question that changed it)

| # | Change in v1 | Coach answer | Where |
|---|---|---|---|
| 1 | The weekly 3 / 5 / 7 % increase is chosen each week by the **person's** state (fatigue, life, response to training), never by muscle size; the coach (or client, if allowed) can set it by hand from 0 to 7 % (his 3/5/7 band; 10 % is never offered as a rate because he called it "way too much", UNI-05; v1 verification). Every "big muscle 3 %, chest/back 5 %, small 7 %" mapping is retired. | VOL-05, UNI-05 | §0, §9.2, §9.6; JSON `generator_rules.muscle_classes`, `.progression` |
| 2 | The % is a percentage of **weekly sets per muscle** (load and volume load are tracked, not driven by %). | VOL-04 | §9.6 |
| 3 | **10 %/week is a hard ceiling** on total weekly resistance sets ("way too much"), no longer labelled INFERRED smoothing; a week must stay **below** +10 % (a +10 % week is what he called too much; v1 verification). | UNI-05 | §9.7 |
| 4 | Rounding: **bank the fraction, add a whole set when the bank reaches 1.0** (v0 released at 0.75). | VOL-06 | §9.6 |
| 5 | New sets go to the **first exercise for that muscle in session order, then the next** (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); 3-4 exercises per muscle group on its day; a small muscle trained at the end of a session gets extra volume as a **bonus exercise**. v0's "isolation slot first / alternate bilateral-unilateral" rule is retired. | VOL-07 | §9.6, §9.7 |
| 6 | Helper credit **0.25** (v0: 0.5, and glutes 1.0 from every hinge and unilateral knee set). Dips 0.5 triceps + 0.5 chest; thrusters 1.0 quads + 0.5 shoulders. Section 3 tables are recomputed with this coach count. | VOL-09, LIB-16, LIB-14 | §1, §3; JSON `counting`, `program_views[].normalized_muscles_coach_v1` |
| 7 | One **10/10** unilateral set = **1 set** to the primary muscle (RFE lunge → quads; glute credit still to be decided); alternating lifts count the same way. | UNI-01, UNI-07 | §1 |
| 8 | **Athletic patterns never count** toward muscle sets (plyos, ballistics, throws, Olympic lifts, sprints, change of direction). This is now his rule, not an accounting convention; v0's "0.5 set-equivalent against a lower-body fatigue budget" is retired. | VOL-10 | §1, §6.5, §9.7 |
| 9 | Leg curls, nordics and slider curls are a **leg-flexion** segment, not hip dominant. | CAT-09 | §1, §3.4 |
| 10 | Weekly sets per muscle are **starting** volumes by level: beginner **10-12**, intermediate **15-20**, advanced **20+**; 15-20 = maintenance to some growth, 20-25 = growth. v0's peak-week table (15-20 read as the destination, start back-solved) and level L4 are retired; the engine's start table is 12 §3.3. | VOL-01, UNI-01, PRG-05 | §0, §9.3 |
| 11 | Priority muscle: **+4 to +6 sets** on the start, cap **about 25-30**, 1-2 at a time, its exercise first in the session; delivery = own exercises → Focus slots (both may hit the same muscle) → bonus exercise. v0's "+2 percentage points of rate" is retired. | VOL-02, ORD-04, ORD-10, ORD-11 | §9.4 |
| 12 | Pain: that muscle or pattern **-30 to -50 %**, move it to constrained machines or split grips, or **drop the exercise**; a bilateral lift swapped to unilateral keeps its sets "ideally, but adjust accordingly". | VOL-03, UNI-08, EQ-03 | §9.5 |
| 13 | **Calves 3 sets every leg day** (single-leg on a ramp/plate/deficit or bilateral, treated like any other muscle); **rear delts get their own sets**; **about 2 core exercises** per session, done first by default. | VOL-17, ATH-11 | §0, §3.5, §9.3, §9.10 |
| 14 | The templates' chest-low / side-delt-high pattern was not intended: the generator **balances** to the start table, with a **V-taper bias** available as an optional per-client bias (mechanism PROPOSED). | VOL-18 | §3.5, §9.4 |
| 15 | Session caps by population: resistance sessions **5-7 exercises**; off-season field athletes **up to 10-12** (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); athletes, bodybuilders and powerlifters **~1.5 h (max 2 h)**; general and weight-loss **45-60 min**; unilateral time must be accounted for. v0's minutes-by-level table is retired. | VOL-08, VOL-16, VOL-17, UNI-09 | §0, §9.7, §9.10 |
| 16 | Default sets when blank: **3 on compounds, 2 on isolation, 3 on calves; 2 per slot in athletic templates.** | VOL-16, VOL-17 | §9.7, §9.10 |
| 17 | Reps: small muscles **12-30** (20s, MAX, MYO), big muscles **5-15 mixed**. **40-rep sets are removed from the defaults** (incl. the fat-loss matrix); they exist only as an optional CrossFit/AMRAP style. | VOL-11 | §4.3, §9.9 |
| 18 | Preference style ("lighter, more sets" vs powerlifting "heavier, fewer reps") moves the **rep range on big compound lifts only**; **weekly sets stay the same** (v0's ×1.1 / ×0.85 set factors removed); small muscles stay high-rep. | VOL-12 | §9.9 |
| 19 | Unilateral lifts default to moderate-high reps; **heavy low-rep unilateral work is an optional toggle** for the athlete or coach. Unilateral and bilateral volume progress the same way. | UNI-04, UNI-05 | §9.6, §9.9 |
| 20 | Effort: **RIR is the primary scale, 1-3 RIR on every working set** ("leave 1 in the tank"), no planned RIR ramp; **MAX = technical failure, only on small-muscle or bodyweight work**; RPE is shown next to RIR as an explanation; % of 1RM stays in the strength and Olympic templates. | VOL-13, PER-09 | §5, §9.9 |
| 21 | Rest: hypertrophy **1-2 min** (up to 3), strength **3-6 min**, athletic "as prescribed"; supersets rest after the pair. | VOL-14 | §5, §9.9 |
| 22 | **MYO sets only on the last exercise**, machine or isolation. | VOL-15 | §9.9 |
| 23 | Aerobic sessions/week: **3** general and fat loss, **2** athletes in season, **4** aesthetics/bodybuilders, **plus long walks after workouts**; any erg, tracked by calories, time or distance. | ATH-07, EQ-14 | §0, §7.3, §9.12 |
| 24 | Deload = **about half the sets**, same exercises, lighter or 3+ RIR, no buy-out or finisher (v0's 0.85 × week 1, built from the shallower observed deloads, is retired; the observed shapes stay as evidence). | PER-05 | §9.8 |
| 25 | Plan lengths: 4-6 weeks = maintenance/transition at **50-70 %**; 8 weeks start hard (4 adapting + 4 driving); 12 weeks preferred (2-4 acclimation, 4-6 driving, last weeks hardest); week-by-week and yearly modes. v0's 6/8/12 layouts are retired (12 §3.12; `06_periodization`). | PER-01 | §9.8 |
| 26 | Smooth weekly adds for hypertrophy and general clients; 2-week steps and waves for fight or competition prep. | PER-10 | §8, §9.6 |
| 27 | Levels **L1-L3**: novice = newby (under ~6-12 months, or 6-12+ months off); intermediate = over 1 year consistent; ex-pros start at L1 only briefly. "NOVICE below NEWBY" and L4 are retired. | PRG-05 | §9.2 |
| 28 | Plyo "zones" are not zones (Davidson zones are rotation biases and do not apply to plyos). Plyo method = receive & pause → receive then create → repeated receive/create; unilateral harder than bilateral; programs start ballistic and become plyometric. | CAT-10, CAT-11, ATH-01 | §6.1, §9.9, §9.11 |
| 29 | Sport dial: plyo vs ballistic share set by the sport's **ground-contact time**; total jump volume follows his ranking (baseball now below MMA and tennis); **everyone in athletic training gets Olympic lifts** (baseball no longer "optional, pre-season only"); boxers **reduce, never cut** pressing/arm volume in high-punching weeks. | ATH-01, ATH-02, ATH-10, ATH-04 | §9.3, §9.11 |
| 30 | No medball work for aesthetics/bodybuilders except warm-up; medballs never over 20 lb. | ATH-05, EQ-06 | §9.9, §9.11 |
| 31 | **No bands and no variable resistance** in any generator rule; banded, chained and reverse-banded items in the sheets stay as evidence only. | EQ-01, EQ-07, EQ-08, EQ-12 | §4.1, §6.1, §9.11 |
| 32 | Older clients: few plyos unless they ask; extra volume on constrained machines; never overhead squat, snatch, low-bar or depth jumps; **no sex-based rules** (age, foundation, goal, injuries decide). | ATH-09, EQ-03, GEN-02 | §9.1, §9.11 |
| 33 | Rep notation: '10/10' = 10 per side; '12/10/8 -20' = pyramid (12 mid weight, 10 heavier, 8 heaviest) then a light 20-rep set. The UL upper-day rep rise with level was a fill error: rep and set rules must be the same for every level. | PRG-07, UNI-01, PRG-06 | §1, §4.3, §9.9 |
| 34 | VOL 1 / VOL 2 / VOL 3 compound/isolation rep phases apply to all athletes, one per block. | PER-11 | §9.9 |
| 35 | Week-to-week adjustment from EFFORT and HOW IT FELT confirmed; the rate is set per person (12 §3.7); two output modes proposed because he is unsure whether people should track in the tool. | GEN-05, GEN-03 | §9.13 |
| 36 | '21.6 mile run' in the cardio list is "a marathon" to the coach. Flag: a marathon is 26.2 miles. | LIB-18 | §7.2 |
| 37 | A 'MYO SET' counts as **2 hard sets** (stated here so 03 matches 12 §3.1; INFERRED), and only on the last machine or isolation exercise. | VOL-15 | §1 |
| 38 | **Same-pattern pairing** (squat + lunge) is allowed for aesthetics and high-level clients to drive one muscle harder; cross-pattern pairing stays for bootcamp and general clients (less soreness). | UNI-06 | §9.10 |
| 39 | **No second axial squat in a week, for every population** (squat one day, leg press or belt squat the other); deadlifts also load the spine, so the hinge gets the same treatment (one axial hinge a week, the other hinge exposure non-axial, as `05_session_architecture` rule 18; that reading INFERRED, §11.3 item 13), and **hip dominant + push / knee dominant + pull** on every full-body and bootcamp day. v1 had stated both only for general clients. | PER-04, EQ-11, UNI-11, ORD-06 | §9.10 |
| 40 | Client effort explanation: RIR first with RPE beside it, and the EFFORT menu is **read against each set's planned RIR** ('8 - That was perfect' = landed on the target). Otherwise a client working at 1 RIR as told ("leave 1 in the tank" = RPE 9) logs '9 - That was terrible' and the engine holds every week (PROPOSED). | VOL-13, GEN-05 | §5.3, §9.9, §10 (24), §11.3 |
| 41 | "high-raw athletes" in his 40-rep answer is read as **HYROX** athletes (INFERRED from the dictation; to confirm). 40-rep sets stay optional only. | VOL-11 | §9.9, §11.3 |
| 42 | **Bilateral : unilateral share stated here in his words** (v1 had only a pointer to 12): range 90/10 to 10/90 by athlete, adjustable; bodybuilders/powerlifters about 50/50 at the start → 80/20-90/10 bilateral; field/COD athletes 80-90 % unilateral; in-season bilateral minimal; pain adjusts it; upper body the same logic; contralateral loading pulls into the hip (COD athletes), ipsilateral helps out of the hip (sprint acceleration); contra/ipsi for bodybuilders and powerlifters as health accessories mostly in weeks 1-4. | UNI-02, UNI-03, UNI-10, CAT-13, UNI-12 | §9.3 |
| 43 | **Core first on every population row**, including the weekend-warrior athletic program (v1 had "athletic block first" there) and the observed athletic-block reading in §6.4. | ATH-11 | §6.4, §9.10 |
| 44 | **Olympic lifts by level follow ATH-10**: beginners and "beginning intermediates" use DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate and up get the full scope (v1's matrix held the full lifts back to L3). | ATH-10 | §9.9 |
| 45 | **Older clients in the sport dial**: no snatch variants and no depth jumps (v1's row allowed "DB/KB" Olympic work without that limit). | EQ-03, ATH-09 | §9.11 |
| 46 | **Deload keeps the same exercises**, Olympic lifts included at half the sets and light technique loads (the v1 JSON removed Olympic work, against "same exercises"). | PER-05, ATH-10 | §9.8 |
| 47 | **Exercises by session length are his confirmed numbers**: 45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9 (the VOL-08 assumption he marked RIGHT); v1 had capped resistance sessions at 7, "up to 8 PROPOSED". | VOL-08, VOL-16 | §0, §9.7, §9.10 |

Rows 37-41 were added in the v1 audit pass (2026-10-08, verification log); rows 1-36 are the first v1 pass; rows 42-47 come from the v1 verification (last log entry).

### Conflicts with `12_volume_algorithm_v1` (resolved in favour of the coach)

1. **Default sets in athletic templates.** 12 §3.10 (`session_limits.default_sets`) gives every template 3 / 2 / 3 (compound / isolation / calves), and its tennis example uses 3 sets on most slots. COACH-ANSWER VOL-16 confirmed the assumption "Athletic templates use 2 everywhere". **Here: athletic-template slots default to 2 sets**; the engine may still add sets by VOL-07. 12 should add this default.
2. **RIR in the last weeks.** 12 §3.12 lets weeks 10-12 move "RIR toward 1". COACH-ANSWER VOL-13 confirmed "1-3 RIR at all times ... no planned RIR ramp". **Here: RIR stays inside 1-3 on every working set**; drifting to the 1-RIR end in the hardest weeks stays inside his band and is PROPOSED, not a ramp.
3. **Field-athlete exercise cap (not a conflict with 12; an ambiguity inside his answers).** 12 and this file both use "up to 10-12" (COACH-ANSWER VOL-08: "max maybe 12 different exercises"). In VOL-17 he lists 2 core + 2-4 plyo + 2-3 Olympic + 3-4 resistance (up to 13) and says "12 to 14". **Both files: 12 is the cap** (his direct answer to the cap question); the 12-vs-14 question is in §11.3.
4. **Hand-set rate (added in the v1 verification).** 12 §3.7 step 4 lets the coach or client "set the rate by hand from 0 to 10 %". COACH-ANSWER UNI-05: "it can progress week by week by 10 %. That's way too much." **Here: a hand-set rate runs from 0 to 7 % (his 3/5/7 band), and a week's total increase must stay below +10 %**; 10 % is a guardrail, never a rate. A coach who wants a different rule adds it as his own rule (COACH-ANSWER GEN-08). 12 should change step 4.
5. **Priority add per level (inside 12, added in the v1 verification).** 12 §3.5 says +4 (L1-L2) to +6 (L3); 12 §3.3's table gives big muscles +5 at L2. The coach gave only "+4-6" (COACH-ANSWER VOL-02). **Here: +4 to +6, with the split by level PROPOSED**; 12 should make its two sections agree.
6. **Exercises per resistance session (added in the v1 verification).** 12 §3.10 gives "5-7 (default 7); up to 8 in 90-min ... sessions", with 8 PROPOSED. COACH-ANSWER VOL-08 marked RIGHT the assumption "45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9 exercises". **Here: his length mapping**, with "usually 7" as the default for a 60-min resistance session; 12 should adopt it.

### Still pending after v1

- Every PROPOSED item in `12_volume_algorithm_v1.md` §7 (20 decisions: small muscles at ~80 % of the big-muscle start, rear-delt 4 / 6 / 8, glute credit values and the athlete glute policy, L3 definition, readiness score and bands, intake rate defaults, acclimation caps, no fixed deload inside a plan, cycle step, maintenance base, non-priority 3 % cap, share numbers he did not give, plyo:ballistic table, per-session limits, core block counting, two output modes, yearly quarters, plyo stage name, time model).
- 03-specific PROPOSED items in this file: the V-taper bias mechanism (§9.4); reading the EFFORT menu against each set's planned RIR (§9.9); the heavy-unilateral toggle parameters (§9.9); the sport-dial numbers (plyo contacts, throws, cuts, Olympic sets per week; §9.11); aerobic sessions for off-season athletes and strength clients and the colour rotation at 4 sessions (§9.12); rep brackets for pain (§9.5); in-season plyo contacts at about half (§9.11) and the in-season Olympic/jump maintenance dose (§10, tension 22); Olympic lifts kept in the deload at half the sets (§9.8); the Kong row used for pain clients, not to fill back volume (§1); the one-axial-hinge reading of PER-04 (§9.10).
- For the owner of 12: conflicts 4 (hand-set rate 0-10 %), 5 (priority +5 vs +4/+6) and 6 (exercises by session length) above.
- Unanswered from v0: the % basis of the Olympic and STRENGTH-12 percentages (COACH-ANSWER PER-09 confirmed the template "I just want to make sure it's correct", not the basis); whether a set's RIR / % applies to every set or only the last; the level unlock of aerobic colours.
- Not answered at all: LIB-10 (KB face pulls under vertical pull: rear-delt credit or not) and LIB-12 (bench push-ups hands vs feet on the bench).
- New questions raised by the answers: §11.3.

---

## 0. The short answers

| Question | Coach rule (v1) | What the sheets show (OBSERVED unless tagged) |
|---|---|---|
| 1. Exercises per session | Resistance sessions **5-7 exercises** on average, "usually 7"; by length 45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 (COACH-ANSWER VOL-08, VOL-16); off-season field athletes **up to 10-12**: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance (VOL-08, VOL-17); 3-4 exercises per muscle group on its day (VOL-07). Session length: athletes, bodybuilders, powerlifters ~1.5 h (max 2 h); general and weight loss 45-60 min (UNI-09); bootcamp 35-45 min, 5-7 stations (PRG-03). Optional days ideally separate (ORD-10). | Physique main day **5-7** lifts (BYOP 7, 3-day 5, fat-burn 5), plus (MM UL/PPL tabs only) a 5-min 'Any Cardio Equipment' warm-up and 3 A-drills on lower days. Athletic day: **10** slots in BYOP (4-5 athletic + 5-6 resistance); 6-16 lines in MM athletic; baseball median **9** (6-11). Strength tracks **3-4** slots ('the work' / 'the accessory' / 'the nuance' / 'the survival'). Optional day **5** slots ('Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2'). |
| 2. Working sets | Defaults when blank: **3 on compounds, 2 on isolation, 3 on calves, 2 per slot in athletic templates** (VOL-16, VOL-17). Sets per session follow from exercises × sets and the time model (12 §3.10, PROPOSED: 45 min ≈ 13-14 sets, 60 ≈ 19-20, 75 ≈ 25-26, 90 ≈ 31-32). | Physique main day **15-21** (the one filled BYOP day: 7 exercises, 19 sets). Athletic BYOP day **20** (10 slots × 2 sets, 'JUSTICE LEAGUE'). Baseball median **29** per session (22-51, supersets/tri-sets/complexes). Strength track **11-16**. Per week **44-84** resistance sets on 3-4 main days (up to 132 on the 6-day push/pull/legs and 158 in the 12-week aesthetics peak, 148 without its 10 superset-finisher sets); **97-174** total working sets in athletic programs once jumps, core and throw sets are counted. Sets per exercise **2-4** almost everywhere; 5-7 on main lifts in strength/peak weeks. |
| 3. Weekly sets per muscle | **Start** (not peak): beginner **10-12**, intermediate **15-20**, advanced **20+**; 15-20 = "maintenance to a little bit of growth", 20-25 = "growth" (VOL-01, UNI-01). Priority +4-6, cap ~25-30 (VOL-02). Calves **3 sets every leg day**, rear delts **own sets**, **~2 core exercises** per session (VOL-17). Counting: main mover 1.0, **helpers 0.25**, 10/10 = 1 set, athletic work never counts (VOL-09, UNI-01, VOL-10). Engine start table: 12 §3.3. | Coach count (section 3): quads (median 16) and hamstrings (12-17.6 by goal family) sit in his 15-20 band in about 40 % of views; **glutes only 7-9** (almost all helper credit); upper body below 15 except the 6-day push/pull/legs and the 12-week aesthetics track (chest median 10 in hypertrophy programs, 4 in athletic ones). Rear delts (<6 in 51 of 58 views), calves (median 3) and abs (often 0 outside athletic programs) chronically low - not intended (VOL-17). |
| 4. Rep ranges | Small muscles **12-30** (20s, MAX, MYO), big muscles **5-15 mixed** (VOL-11). **No 40-rep sets** except an optional CrossFit/AMRAP style (VOL-11). Preference moves reps on **big compound lifts only**; weekly sets unchanged (VOL-12). Unilateral moderate-high by default, heavy low-rep optional (UNI-04). | Compounds **6-15** (mean ~10-12 physique, ~10 baseball, 6-8 heavy/athletic, 1-5 strength/peak). Isolation **15-20** or 'MAX REPS'/'MYO SET' (up to 30-40 in the fat-burn template). In practice single-joint = more reps (leg extensions get 20s and MYO sets). Section 4. |
| 5. Effort and rest | **RIR primary, 1-3 RIR on every working set**, no planned ramp; **MAX = technical failure on small-muscle or bodyweight work only**; RPE shown as an explanation; % in strength/Olympic templates (VOL-13, PER-09). Rest **1-2 min** hypertrophy (up to 3), **3-6 min** strength, athletic as prescribed; supersets rest after the pair (VOL-14). | '*Always leave 1 rep in the tank, never work up to failure but get as close as you can' and 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM UL/PPL A4/A6; MM athletic A3/A5). Squat menus '(1 RIR) *RPE8+'. Strength ladder '1RIR' → '2RIR' → 'MAX' → 'ALL'. EFFORT menu: '8 - That was perfect' is the bullseye. Rest: '*REST 1-2 MIN BETWEEN SETS', '*REST 3-6 MIN BETWEEN SETS', '*REST AS PRESCRIBED'. Section 5. |
| 6. Athletic dosing | **Never counted as muscle sets** (VOL-10). Plyo vs ballistic share set by the sport's ground-contact time; programs start ballistic and end plyometric; method stages receive & pause → receive then create → repeated (CAT-10, CAT-11, ATH-01); sport ranking ATH-02; **Olympic lifts for everyone in athletic training** (ATH-10). Numbers per sport: §9.11 (PROPOSED). | Lower-body plyo contacts **72-96/week** (BYOP template at 2 sets, INFERRED from rep picks), **132-191/week** (MM athletic), **258-306/week** (boxer weeks 3-8, of which 113-129 high intensity), **116-324/week** (baseball). Per session **18-77**, at or below the NSCA beginner 80-100. Throws **64-96/week** (BYOP), **70-290** (baseball), **190-420** (MM athletic and boxer). Cuts **48-64/week** (BYOP), zero in every MM example. Section 6. |
| 7. Conditioning | Aerobic sessions/week: **3** general/fat loss, **2** athletes in season, **4** aesthetics/bodybuilders, **+ long walks after workouts** (ATH-07); any erg, tracked by calories, time or distance (EQ-14). | Colour system: Blue 'A' short/high, Green 'B' moderate, Orange 'C' long/low; 'one of each colour every week, total of 3 Aerobic capacity workouts per week'; 'LVL 1 = C' ... 'LVL 4 = LACTATE CLERANCE'. Most templates schedule 2 ('WEDNESDAYS & SATURDAYS max 40 min of steady'); BYOP '3 DAY BUILDER' 3, bootcamp 2 six, CrossFit grids 2/2/3/4 by level, baseball buy-outs only. Section 7. |
| Weekly increase | **3, 5 or 7 % of weekly sets per muscle, chosen each week by the person's state** (fatigue, life, response), never by muscle size; coach-adjustable; **10 %/week is too much** (hard ceiling); bank the fraction, add whole sets; the new set goes to the first exercise first (VOL-04, VOL-05, UNI-05, VOL-06, VOL-07). Smooth for hypertrophy/general, steps/waves for fight or competition prep (PER-10). Engine: 12 §3.7-3.9. | Never written as a percentage. Observed ramps are **whole-set steps every 2-3 weeks** with flat weeks between; the step weeks are +20 to +50 %. Block averages: **+4.75 %/week** (AESTHETICS-12), **+5.2 %** (STRENGTH-12), **+5.5 %** (CrossFit, if one level per month), but **+16.5 %** (AESTHETICS-8) and **+10.4 %** (HYBRID 8-week). Section 8. |
| Plan length and deload | 4-6 weeks = maintenance/transition at 50-70 %; 8 weeks start hard; 12 weeks preferred; week-by-week; yearly (PER-01). Deload = about half the sets, lighter (PER-05). Engine: 12 §3.12. | Written deloads return to about week-1 volume (0.75-1.0 × week 1, -25 to -50 % from the peak); two 8-week athletic blocks end at the peak. Section 9.8. |

---

## 1. Counting conventions (read before any number)

1. **One working set** (a hard set at 1-3 RIR; warm-up sets and A-drills never count) = **1.0 set to the main mover and 0.25 to each clear helper** (COACH-ANSWER VOL-09: "I would suggest a 0.25 to the helpers, not a 0.5"; VOL-13, ORD-08). His exercise-level exceptions: **dips 0.5 triceps + 0.5 chest**, done on push days (COACH-ANSWER LIB-16); **thrusters 1.0 quads + 0.5 shoulders** (COACH-ANSWER LIB-14); leg extension and leg curl count fully to quads and hamstrings (COACH-ANSWER VOL-09); leg curls, nordics and slider/swiss-ball curls form their own **leg-flexion** segment, not hip dominant (COACH-ANSWER CAT-09); 'Pull under' = lat pull-over → lats 1.0 (COACH-ANSWER LIB-09); the Kong row (double-KB row from the floor) counts as a row but "doesn't really create a lot of stimulus", so the generator uses it for clients with shoulder or back pain, not to fill back volume (COACH-ANSWER LIB-09; use PROPOSED). Thrusters keep the 0.5 shoulder credit he confirmed (LIB-14) even though helpers are now 0.25 (VOL-09); asked in §11.3 item 14. The full credit map, including the PROPOSED glute values (squats and lunges 0.25, hinges 0.5, hip-thrust family 1.0), lives in `12_volume_algorithm_v1.json > counting.credit_map`. A **'MYO SET'** (15 reps, then 5-rep clusters to 40 total, OBSERVED 'ALL ABOUT SQUATS' A30) counts as **2 hard sets** for its muscle, the same convention as 12 §3.1 (INFERRED, unchanged from v0); it is only allowed on the last machine or isolation exercise (COACH-ANSWER VOL-15).
   - SCIENCE: Pelland et al. (Sports Medicine, 2026) compared three ways of counting indirect sets (1, 0.5, 0) across 67 studies and found the **0.5 fractional count** fit hypertrophy best. The coach's 0.25 is lower. For chest, quads, hamstrings and back (mostly direct work) the two counts barely differ; for glutes, arms and delts his count is lower. The engine steers on the coach count and stores the 0.5 count beside it so the data can later show which predicts progress better (12 §2.2, §3.14; PROPOSED).
2. **Unilateral and alternating sets.** '10/10' means 10 reps on each side, and one 10/10 set = **1 set** to the primary muscle: 3 × 10/10 rear-foot-elevated lunges = 3 quad sets ("I don't necessarily count it for glutes, but we can figure out a way"; glute credit PROPOSED 0.25) (COACH-ANSWER UNI-01). Alternating lifts count the same way (COACH-ANSWER UNI-07). A unilateral set takes longer and "has to be accounted for" in session time (COACH-ANSWER UNI-09; 1.5 × a bilateral set, PROPOSED in 12 §3.10).
3. **Athletic sets never count toward muscle sets** (COACH-ANSWER VOL-10: "counting towards muscles is more for resistance patterns, not for athletic patterns"). Plyos, ballistics, throws, Olympic lifts, sprints and change of direction are tracked in their own units (contacts, throws, reps, meters or bouts, cuts; 12 §3.13). SCIENCE background, kept from v0: in combat-sport athletes plyometric training did not change muscle mass (Ramirez-Campillo et al., Sports 2023; ES -0.01 to -0.06), while a review of 6 plyometric-vs-resistance trials found similar lower-body hypertrophy in untrained or recreational people over up to 12 weeks (Grgic, Schoenfeld, Mikulic, J Sport Health Sci 2021). The coach's rule decides the accounting. The v0 rule that charged athletic sets 0.5 each against a "lower-body fatigue budget" is retired: the recovery cost of athletic work is handled by the athlete volume factors (12 §3.4) and the separate athletic budget with NSCA contact caps (12 §3.13).
4. **Single canonical credit map for the comparison tables (section 3), v1 coach count.** Every program is recomputed from its bucket totals with one map:

| Bucket | 1.0 | 0.5 | 0.25 | Tag |
|---|---|---|---|---|
| RP_BKD (squat, leg press) | quads | - | glutes | COACH-ANSWER VOL-09; glute value PROPOSED (12) |
| RP_UKD (split squat, lunge, step-up) | quads | - | glutes | COACH-ANSWER UNI-01 ("mostly for quads"), VOL-09; glute value PROPOSED |
| RP_BHD, RP_UHD (hinges, single-leg RDL) | hamstrings | glutes | - | glute 0.5 PROPOSED (12) |
| RP_HPUSH | chest | - | front delts, triceps | COACH-ANSWER VOL-09 |
| RP_VPUSH | front delts | - | side delts, triceps | COACH-ANSWER VOL-09 |
| RP_HPULL | lats/upper back | - | rear delts, biceps | COACH-ANSWER VOL-09 |
| RP_VPULL | lats/upper back | - | biceps | COACH-ANSWER VOL-09 |
| ISO_QUAD / ISO_HAM (leg flexion) / ISO_CHEST / ISO_BICEP / ISO_TRICEP / ISO_CALF | the target muscle | - | - | COACH-ANSWER VOL-09, CAT-09 |
| ISO_SIDE_REAR_DELT | split by the exercise written (below) | - | - | OBSERVED |
| any core bucket | abs/obliques | - | - | COACH-ANSWER CAT-08 |
| AP_* (plyo, jump, throw, COD, sprint, triple extension) | none | - | - | COACH-ANSWER VOL-10 |

   The bucket recompute cannot see per-exercise overrides (dips, thrusters, upright rows, plyo push-ups, curl-to-press), so a cell can differ by 1-3 sets from an exercise-level count. The ISO_SIDE_REAR_DELT bucket is split by the exercise actually written (unchanged from the v0 second verification pass): 'Reverse Flies' (BYOP PPL), 'DB Reverse Flies or Machine' (MM PPL), 'face pulls' / 'machine or db Reverse flies' (AESTHETICS-12) → rear delts 1.0; 'Front Raises' (MM athletic STARTING, boxer weeks 3-8) → front delts 1.0; side raises and upright rows → side delts 1.0. Baseball's few 'bent over db Reverse flies' / 'db front raises' rows (about 1 set/week) stay in side delts.
   - **What the v1 count changes:** the v0 analyst map gave synergists 0.5 and credited glutes 1.0 from every hinge and unilateral knee set, so glutes looked like the most-trained muscle in the model (median 21 in hypertrophy programs). Under the coach count the same programs give glutes a median of 9. The v0 numbers stay in `03_volume_rules.json > observed.program_views[].normalized_muscles` (labelled v0 analyst map), the v1 numbers are in `normalized_muscles_coach_v1`, and the decode files' own numbers stay in `reported_muscles`.
5. **"As written" vs "assumed".** Most BYOP templates are empty ('CHOOSE 👇'), so their volume is slot count × an assumed set number. Two assumptions recur, and the coach confirmed both as his defaults (COACH-ANSWER VOL-16): **3 sets on compounds and calves, 2 on other isolation** (taken from the only filled BYOP day) and **2 sets per slot in athletic templates** (every filled 'JUSTICE LEAGUE' slot). MM tabs are fully typed, so their numbers are observed except where the coach left a dose blank (noted).
6. **Reps stored as dates; rep notation.** Google Sheets turned '12/12', '8/8', '6-8', '3-4', '10/10' into dates in many MM cells (OBSERVED, all decode files). The generator must store reps as text. 'N/N' = N per side (COACH-ANSWER UNI-01, PRG-07: "10 and 10 means 10 on each arm. If I put it bilateral on purpose, then it would be a set of 10 and then another set of 10"). '12/10/8 -20' = four sets: 12 at mid weight, 10 heavier, 8 heaviest, then a light 20 (COACH-ANSWER PRG-07).

---

## 2. Exercises and working sets per session (questions 1 and 2)

### 2.1 Per program (OBSERVED counts; sets assumed where the template is empty)

| Program (tab) | Goal | Level | Days/wk | Exercises per session | Working sets per session | Sets per exercise |
|---|---|---|---|---|---|---|
| BYOP 'AESTHETICS - FULL BODY - 4 DAYS' | physique | per slot | 4 (+2 optional) | 7 / 7 / 7 / 7; optional 5 | 19 (Day 1 as written), 19-21 assumed; optional ~12 | compounds 3, isolation 2, calves 3, one 'DB Push press' 5 |
| BYOP '3 DAY BUILDER' | physique | per slot | 3 (+3 optional) | 5 / 5 / 5; optional 5 | 14-15 | 3 (assumed) |
| BYOP 'NO ACCESS - AESTHETICS - FB - 4' (hidden) | physique logbook | per slot | 4 + 2 optional | 7 / 7 / 5 / 7 / 7 / 5 | 17-21 | assumed |
| BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' | athletic | per slot | 4 (+2 optional) | 10 / 10 / 10 / 10 (A day 5 athletic + 5 resistance; B day 4 + 6); optional 5 | 20 at 2 sets, 30 at 3 | template blank except G12 'MYO SET' pre-filled on the Monday 'Leg Extensions' slot |
| BYOP 'JUSTICE LEAGUE' (a weekend-warrior athletic program for non-competitive adults and youth, not a real team; COACH-ANSWER ATH-13) | athletic, non-competitive | mixed per slot | 4 (+2) | 10 (Monday fully filled) | **20** (Monday: 10 athletic + 10 resistance) | **2 on every filled slot** (11 of 11 cells) |
| BYOP 'PUSHPULLLEGS - 3 or 6 DAYS A WK' | hypertrophy | per slot | 6 (or 3) | 7 every day | 21 at 3 sets; 17-18 coach-default | assumed |
| BYOP 'BOOTCAMP - OPTION 1' | bootcamp | per slot | 4 (+2) | 7 / 7 / 5 / 7 / 7 / 5 | 21 / 12 at 3 sets | assumed |
| BYOP 'BOOTCAMP - OPTION 2' (title cell A1 reads 'BOOTCAMP OPTION 1') | bootcamp | per slot | 6 short (sessions '1A'-'3B', no weekdays; 'SUNDAY' 'OFF') | 5 (4 + 'Cardio') | 12 + 1 cardio bout (assumed 3 sets) | no dose columns at all |
| MM 'EXAMPLE UPPERLOWER SPLIT' | hypertrophy/general | 'NOVICE' / 'NEWBY' / 'INTERMEDIATE' | 4 (inferred A/B/A/B) | lower 10 (3 A-drills + 7 lifts), upper 8 | NOV 20 / 24, NEW 30 / 24, INT 32 / 27 | 2-4 |
| MM 'EXAMPLE PUSHPULLLEGS SPLIT' | hypertrophy | same three | 3 or 6 | push 6, pull 6, legs 10 | NOV 16 / 18 / 20, NEW 18 / 20 / 30, INT 20 / 23 / 32 | 2-5 (pulldown 5 x 12 at INT) |
| MM 'EXAMPLE FAT BURNBODY TONING PRO' | fat loss | one | 4 lifting + 2 cardio | 5 every lifting day + a 4-station circuit on 2 days | 14-18 (WK1 15, WK4 17-18) | 2-4 (never more than 4) |
| MM 'EXAMPLE ATHLETIC FULL BODY SPLI' | athletic off-season | 'STARTING' / ' MID' / ' ADVANCED' | 3 / 4 / 4 | lines 10 / 7 / 7; 10 / 14 / 8 / 16; 6 / 6 / 8 / 6 | 35 / 24 / 30; 21 / 10 / 25 / 16; 14 / 19 / 17 / 9 (excl. throws; every superset/complex component counted as its own set - analyst convention, the sheet gives one set number per line) | Starting 1-5 (mostly 2-3; 'Side Plank presses' 5 x ':30 sec./ :30 sec.'), Mid 1-4 (mostly 1-2; 'Lateral Step ups' 4, 'HEX bar loaded Jumps' 3, one line '2 to 4'), Advanced 1-3 |
| MM 'EXAMPLE BOXING 8 WEEK BUILD UP' | fighter | one | 4 | wk1-2 8 / 7 / 7 / 6; wk3-8 8 / 5 / 7 / 5 lines (10 / 9 / 12 / 10 movements) | wk1-2 24 / 18 / 20 / 18; wk3 30 / 24 / 36 / 23; wk8 30 / 30 / 39 / 37 | wk1-2 3; wk3-8 2-3, ramping rows to 4-6 in wk8 |
| MM 'BASEBALL' (24 weeks) | baseball | int-adv | 4 | median 9 (6-11); recovery week 3 | median 29 (22-51; 51 = complex rounds counted per component) | Part C/D 4 (5 late pre-season, 3 deload); Part A 2-3 |
| MM 'EXAMPLE CROSSFIT SPLIT' competitor | CrossFit | macro levels 1-4 | 4 (+SAT) | 1-4 quality components/day | 2-15 lifting sets/day | strength 3-6, power 3-6, resistance 2-3 |
| MM '4 TRACKS' STRENGTH-8 / 'EXAMPLE CONJUGATE' | strength | int-adv | 4 | 4 / 4 / 4 / 3 | 14 / 15 / 16 / 11 (v04); 15 / 16 / 16 / 13 (draft) | column B (week 1): Mon/Wed 5 / 3 / 4 / 2-3, Thu 3 / 5 / 4 / 4, Sat 3 / 4 / 4 (no 4th row). So 'the work' is 5 on the 'M.E.' days but 3 on Thu ('EASY' plyo 3 x 6) and Sat ('FAST BANDED BENCH PRESS'); accessory 3-5; nuance 4; survival 2-4. Ladders in E4:L6, colour-matched to the cells that say 'SEE': green B6D7A8 5,5,4,4,3,3,2,1 (same green as the 'the work' set cells B9/B13/B17/B21, read as weekly sets, INFERRED); pink EAD1DC 5,4,3,2,1,3,2,1 (= reps for the Mon/Wed 'SEE' cells C9/C13); blue CFE2F3 3,3,2,1,3,2,1,1 (= reps for the Thu/Sat 'FAST' 'SEE' cells C18/C21) |
| MM '4 TRACKS' STRENGTH-12 | strength | int | 4 | 4 / 4 / 4 / 4 | 10-13 as written, 13-16 with accessory assumed | header 'SETS' 4,4,5,5,6,6,3,5,6,6,7,7 |
| MM '4 TRACKS' AESTHETICS-8 | physique | gen-int | 4 + 2 cardio | 5 / 5 / 5 / 4 | 10 / 10 / 10 / 8 (wk1) -> 25 / 25 / 25 / 20 (wk7) | header 'SETS' 2,3,3,3,4,4,5 |
| MM '4 TRACKS' AESTHETICS-12 (push/pull/legs x2) | physique | int | 6 | 5-6 | 15-18 (wk1) -> 23-25 (wk12) | header 3,3,3,4,4,4,3,4,4,4,4,5 |
| MM '4 TRACKS' HYBRID | hybrid | int | 5 | 4-6 components | 8-12 (wk1) -> 15-22 (wk8) assumed | header 2,2,2,3,3,3,4,4 |

### 2.2 What the session counts say (INFERRED rules, read against the coach's answers)

- **The coach thinks in exercises and minutes, not in a set budget.** His answers: 5-7 exercises for resistance sessions, up to 10-12 for off-season field athletes; ~1.5 h (max 2 h) for athletes, bodybuilders and powerlifters, 45-60 min for general and weight-loss clients (COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09). The ~20-set day below is what a 60-minute, 7-exercise session holds (12 §3.10 time model), so it stays as an observation, not as a cap (section 9.10).
- **A fixed session budget of about 20 working sets** is the most stable number in the whole model. AESTHETICS Day 1 (7 exercises, 19 sets), the athletic 'JUSTICE LEAGUE' Monday (10 exercises, 20 sets), PPL (21 at 3 sets, 17-18 coach-default), bootcamp (21), UL/PPL examples (16-32) and the 4-track peaks (20-25) all cluster at 15-25. Baseball goes higher (median 29) because Part C is a superset and Part D a tri-set, so density is higher per minute.
- **Athletic work buys slots by lowering sets per exercise.** The athletic template keeps the ~20-set session and spends about 45 % of it (36 of 80 weekly sets) on athletic qualities, which drops sets per exercise from 3 to 2 (OBSERVED in 'JUSTICE LEAGUE': 2 sets on all 11 filled slots; confirmed as his athletic-template default, COACH-ANSWER VOL-16).
- **Level changes the dose, not the number of exercises**, in the gym splits (UL/PPL keep the same 8-10 exercises at every level). In the athletic off-season ladder the opposite happens: higher level = **fewer** exercises and sets per session (Advanced 6-8 lines, 9-19 sets) and higher intensity. This holds for working sets excluding the medicine-ball throws (89 -> 72 -> 59 per week); counting each throw line as a set, MID (112) sits above STARTING (108) because MID doubles the throw volume, and only ADVANCED drops (97). MID also has more lines per session than STARTING (10 / 14 / 8 / 16 vs 10 / 7 / 7).
- **Optional days hold 5 low-cost slots** (calves, cardio, core, two Focus slots). They are where specialisation volume lives. The coach: they can be add-ons or separate days, "ideally separate days, so they don't get in the way"; both Focus slots may hit the same muscle (COACH-ANSWER ORD-10, ORD-11).

### 2.3 Weekly totals (sets per week, all sources)

| View | Resistance (RP+ISO) | Core | Athletic excl. throws | Throw sets | Focus | Total |
|---|---|---|---|---|---|---|
| BYOP AESTHETICS 4 main days (coach-default) | 78 | 0 | 0 | 0 | 0 | 78 |
| ... + 2 optional days | 84 | 6 | 0 | 0 | 12 | 102 |
| BYOP 3 DAY BUILDER main / + optional | 44 / 53 | 0 / 9 | 0 | 0 | 0 / 18 | 44 / 80 |
| BYOP ATHLETIC 4 main days @2 / @3 | 44 / 66 | 0 | 28 / 42 | 8 / 12 | 0 | 80 / 120 |
| BYOP PPL 6-day @3 / coach-default | 120 / 102 | 0 | 0 | 0 | 6 / 4 | 126 / 106 |
| BYOP BOOTCAMP 1 4-day @3 / + Wed-Sat | 84 / 90 | 0 / 6 | 0 | 0 | 0 / 12 | 84 / 108 |
| BYOP BOOTCAMP 2 6 sessions @3 | 66 | 6 | 0 | 0 | 0 | 72 |
| MM UL NOV / NEW / INT (4 d) | 76 / 90 / 102 | 0 | 12 / 18 / 16 (A-drills) | 0 | 0 | 88 / 108 / 118 |
| MM PPL NOV / NEW / INT, 6 d | 94 / 116 / 132 | 2 | 12 / 18 / 16 | 0 | 0 | 108 / 136 / 150 |
| MM FAT BURN WK1 -> WK4 (lifting only) | 60 -> 70 | 0 (core in circuits: 9-15) | 0 | 0 | 0 | 60 -> 70 (+ circuits 24 -> 40 station-sets) |
| MM ATHLETIC STARTING / MID / ADVANCED | 44 / 44 / 24 | 20 / 14 / 26 | 25 / 14 / 9 | 19 / 40 / 38 | 0 | 89 / 72 / 59 excl. throws; 108 / 112 / 97 incl. throws |
| MM BOXING wk1-2 / wk3-6 / wk7 / wk8 | 66 / 57 / 50 / 68 | 14 / 16-18 / 16 / 20 | 0 / 40-42 / 38 / 48 | 19 / 38 / 38 / 38 | 0 | 80 / 113-117 / 104 / 136 excl. throws; 99 / 151-155 / 142 / 174 incl. throws |
| MM BASEBALL block means B1 / B2 / B3 | 72 / 78 / 72 | 11 / 16 / 16 | 16 / 26 / 21 | 9 / 11 / 12 | 0 | 105-151 per week; deload 82 |
| MM CrossFit competitor JULY (peak lifting) | 60 (24 strength + 36 illustrative resistance) | 0 | 0 | 0 | 0 | 36 as written |
| MM STRENGTH-8 (mean wk1-7) / STRENGTH-12 (mean loading) | 53 / 58 | 0 | 3 / 0 | 0 | 0 | 56 / 48-64 |
| MM AESTHETICS-8 wk1 -> wk7 | 32 -> 80 | 0 | 0 | 0 | 6 -> 15 | 38 -> 95 |
| MM AESTHETICS-12 wk1 / wk6 / wk12 | 96 / 128 / 158 | 0 | 0 | 0 | 0 | 96 / 128 / 158 (wk12 = 148 written exercise sets + 10 superset-finisher sets: Tue Z41 'Superset with 15 squats with no weight every set' and Thu Z52 'superset with a set of max bench dips', 5 each) |
| MM HYBRID wk1 -> wk8 | 27 -> 56 | 11 -> 16 | 10 | 0 | 6 -> 12 | 54 -> 94 |

**Reps per session (OBSERVED arithmetic in the decodes).** AESTHETICS Day 1 about 275 reps (rep-range midpoints). 'JUSTICE LEAGUE' Monday about 204-256 reps (64-88 athletic, 140-168 resistance, of which 80 are two MYO sets). UL sessions 248-360 reps. FAT BURN 781 -> 1040 reps per week.

### 2.4 Against the science (SCIENCE)

- **Per-session ceiling.** A per-session meta-regression (Remmert, Pelland, Robinson, Hinson, Zourdos; SportRxiv preprint) found hypertrophy gains stop being detectably better beyond about **11 fractional sets per muscle per session**, and strength beyond about **2 direct sets per session** (point of undetectable outcome superiority, not a harm threshold). Many of the coach's sessions sit below 11 (AESTHETICS A day: quads 3 BKD + 3 UKD + 2 leg extension = 8; baseball Part C+D: quads or hamstrings about 8). Quads reach it on the MM UL/PPL 'INTERMEDIATE' lower day (squat 4 + lunges 4 + leg ext 3 = 11) and pass it on the AESTHETICS-12 week-12 legs day (front squat 5 + leg press 5 + lunges 5 + supersets). Under the v0 analyst map several lower days also passed it for **glutes** (UL/PPL 'INTERMEDIATE' 13, FAT BURN WK4 12) because every lower slot credited glutes 0.5-1.0; under the coach count (helpers 0.25, hinges 0.5 PROPOSED; section 1) glute credit per lower day drops by half or more and stays under 11. The engine uses 11 fractional sets per muscle per session as a soft ceiling, 14 for a priority muscle (12 §3.10, PROPOSED).
- **Frequency.** In the 4-day full-body, 6-day push/pull/legs, bootcamp and athletic templates every main pattern is trained **2x/week** (OBSERVED). It is **not** universal: BYOP '3 DAY BUILDER' trains vertical pull, vertical push, unilateral hip, leg curls and calves **once** a week (bilateral knee/hip, horizontal push/pull and unilateral knee twice), and the 3-day variants of both push/pull/legs tabs train every pattern once a week. A volume-equated meta-analysis (Schoenfeld et al., 2019) found frequency does not matter much for hypertrophy when weekly sets are equal, and practical guidance is at least 2x/week; Pelland et al. found frequency matters more for strength. The 2x/week default is well supported; the 1x/week cases are where the coach accepts lower frequency for fewer days.

---

## 3. Weekly sets per muscle and per bucket (question 3)

### 3.1 Every decoded program on one convention (v1 coach count, section 1)

Columns: days per week; weekly resistance (RP+ISO), core, athletic excluding throws, throw and Focus sets; then fractional sets per muscle with **main mover 1.0 and helpers 0.25** (COACH-ANSWER VOL-09; glute values PROPOSED, section 1.4). Bold = inside the coach's 15-20 band ("a good foundation for maintenance to a little bit of growth", COACH-ANSWER UNI-01). Means (baseball blocks, strength tracks) are shown to one decimal. Athletic sets are never credited (COACH-ANSWER VOL-10).

| View | days | res | core | ath | throws | focus | quads | glutes | hams | chest | back | f.delt | s.delt | r.delt | biceps | triceps | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BYOP_AES4 main (coach-default) | 4 | 78 | 0 | 0 | 0 | 0 | **16** | 9 | **16** | 6 | 12 | 11.5 | 6.5 | 1.5 | 7 | 8 | 6 | 0 |
| BYOP_AES4 + optional | 6 | 84 | 6 | 0 | 0 | 12 | **16** | 9 | **16** | 6 | 12 | 11.5 | 6.5 | 1.5 | 7 | 8 | 12 | 6 |
| BYOP_AES3 main | 3 | 44 | 0 | 0 | 0 | 0 | 12 | 7.5 | 11 | 6 | 9 | 4.5 | 0.75 | 1.5 | 2.25 | 2.25 | 3 | 0 |
| BYOP_AES3 + optional | 6 | 53 | 9 | 0 | 0 | 18 | 12 | 7.5 | 11 | 6 | 9 | 4.5 | 0.75 | 1.5 | 2.25 | 2.25 | 12 | 9 |
| BYOP_ATH4 @2 sets | 4 | 44 | 0 | 28 | 8 | 0 | 12 | 6 | 12 | 4 | 8 | 5 | 5 | 1 | 2 | 2 | 0 | 0 |
| BYOP_ATH4 @3 sets | 4 | 66 | 0 | 42 | 12 | 0 | **18** | 9 | **18** | 6 | 12 | 7.5 | 7.5 | 1.5 | 3 | 3 | 0 | 0 |
| BYOP_ATH4 @2, 6 days | 6 | 48 | 4 | 28 | 8 | 8 | 12 | 6 | 12 | 4 | 8 | 5 | 5 | 1 | 2 | 2 | 4 | 4 |
| BYOP_PPL 6-day @3 | 6 | 120 | 0 | 0 | 0 | 6 | **18** | 9 | **18** | 24 | **18** | 10.5 | 7.5 | 9 | **16.5** | **18** | 0 | 0 |
| BYOP_PPL 6-day coach-default | 6 | 102 | 0 | 0 | 0 | 4 | **16** | 9 | **16** | 22 | **18** | 10.5 | 5.5 | 7 | 12.5 | 14 | 0 | 0 |
| BYOP_PPL 3-day @3 | 3 | 60 | 0 | 0 | 0 | 3 | 9 | 4.5 | 9 | 12 | 9 | 5.25 | 3.75 | 4.5 | 8.25 | 9 | 0 | 0 |
| BYOP_BOOT1 4-day @3 | 4 | 84 | 0 | 0 | 0 | 0 | **18** | 9 | **18** | 6 | 12 | 7.5 | 7.5 | 1.5 | 9 | 9 | 6 | 0 |
| BYOP_BOOT1 6-day @3 | 6 | 90 | 6 | 0 | 0 | 12 | **18** | 9 | **18** | 6 | 12 | 7.5 | 7.5 | 1.5 | 9 | 9 | 12 | 6 |
| BYOP_BOOT2 6 sessions @3 | 6 | 66 | 6 | 0 | 0 | 0 | 12 | 9 | 12 | 6 | 12 | 7.5 | 7.5 | 1.5 | 9 | 9 | 0 | 6 |
| MM_UL 'NOVICE' 4d | 4 | 76 | 0 | 12 | 0 | 0 | 12 | 6 | 12 | 6 | 12 | 7.5 | 13.5 | 1.5 | 9 | 9 | 4 | 0 |
| MM_UL 'NEWBY' 4d | 4 | 90 | 0 | 18 | 0 | 0 | **18** | 9 | **18** | 6 | 12 | 7.5 | 13.5 | 1.5 | 9 | 9 | 6 | 0 |
| MM_UL 'INTERMEDIATE' 4d | 4 | 102 | 0 | 16 | 0 | 0 | 22 | 11 | **20** | 8 | 14 | 10 | 14 | 1.5 | 9.5 | 10 | 6 | 0 |
| MM_PPL 'NOVICE' 3d | 3 | 47 | 1 | 6 | 0 | 0 | 6 | 3 | 6 | 9 | 6 | 2.25 | 6 | 3.75 | 7.5 | 5.25 | 2 | 1 |
| MM_PPL 'NOVICE' 6d | 6 | 94 | 2 | 12 | 0 | 0 | 12 | 6 | 12 | **18** | 12 | 4.5 | 12 | 7.5 | **15** | 10.5 | 4 | 2 |
| MM_PPL 'NEWBY' 6d | 6 | 116 | 2 | 18 | 0 | 0 | **18** | 9 | **18** | **20** | **16** | 5 | 14 | 8 | **16** | 11 | 6 | 2 |
| MM_PPL 'INTERMEDIATE' 3d | 3 | 66 | 1 | 8 | 0 | 0 | 11 | 5.5 | 10 | 12 | 9 | 3 | 8 | 5 | 8.25 | 6 | 3 | 1 |
| MM_PPL 'INTERMEDIATE' 6d | 6 | 132 | 2 | 16 | 0 | 0 | 22 | 11 | **20** | 24 | **18** | 6 | **16** | 10 | **16.5** | 12 | 6 | 2 |
| MM_FATBURN WK1 | 4 | 60 | 0 | 0 | 0 | 0 | **16** | 8 | 14 | 7 | 13 | 4.75 | 3.75 | 1.5 | 5.25 | 4.5 | 0 | 0 |
| MM_FATBURN WK4 | 4 | 70 | 0 | 0 | 0 | 0 | **17** | 10.5 | **17** | 8 | **15** | 5 | 4.75 | 1.75 | 6.75 | 5.75 | 0 | 0 |
| MM_ATH 'STARTING' | 3 | 44 | 20 | 25 | 19 | 0 | 11 | 8 | **18** | 0 | 6 | 6 | 3.75 | 0.75 | 1.5 | 0.75 | 0 | **20** |
| MM_ATH ' MID' | 4 | 44 | 14 | 14 | 40 | 0 | 9 | 6.25 | 11 | 4 | 6 | 3 | 2.5 | 0.5 | 6.5 | 6.5 | 0 | 14 |
| MM_ATH ' ADVANCED' | 4 | 24 | 26 | 9 | 38 | 0 | 5 | 4.25 | 7 | 0 | 2 | 2 | 2.5 | 0.5 | 2.5 | 2.5 | 2 | 26 |
| MM_BOX wk1-2 | 4 | 66 | 14 | 0 | 19 | 0 | **18** | 9 | **18** | 6 | 12 | 7.5 | 1.5 | 1.5 | 6 | 6 | 0 | 14 |
| MM_BOX wk3 (= wk4) | 4 | 57 | 16 | 40 | 38 | 0 | 21 | 9.75 | 21 | 0 | 3 | 6 | 3.75 | 0.75 | 0.75 | 0.75 | 3 | **16** |
| MM_BOX wk7 (mini-deload) | 4 | 50 | 16 | 38 | 38 | 0 | **16** | 9 | **18** | 0 | 4 | 7 | 4 | 1 | 1 | 1 | 2 | **16** |
| MM_BOX wk8 (peak) | 4 | 68 | 20 | 48 | 38 | 0 | 21 | 13.25 | 28 | 0 | 6 | 8 | 3.5 | 1.5 | 1.5 | 1.5 | 3 | **20** |
| MM_BASEBALL block 1 mean | 4 | 72 | 11 | 16 | 9 | 0 | 14.3 | 9.3 | 14.4 | 5.1 | 8.6 | 6.4 | 5.9 | 1.1 | 10.8 | 8.8 | 4.6 | 11.4 |
| MM_BASEBALL block 2 mean | 4 | 78 | 16 | 26 | 11 | 0 | **16.6** | 11.2 | **17.2** | 6.4 | 9.4 | 5.9 | 7.1 | 0.9 | 10.1 | 8 | 4.9 | **15.5** |
| MM_BASEBALL block 2 'WEEK 8' (peak) | 4 | 84 | 15 | 36 | 16 | 0 | **19** | 14.75 | **20** | 5 | 10 | 6.25 | 8.25 | 0 | 9.5 | 8.5 | 5 | **15** |
| MM_BASEBALL block 2 'DELOAD WEEK' | 4 | 58 | 7 | 9 | 8 | 0 | 12.5 | 9.12 | 12 | 3 | 6.5 | 3.75 | 6.75 | 0.88 | 7.62 | 7.5 | 3 | 7 |
| MM_BASEBALL block 3 mean (in-season) | 4 | 72 | 16 | 21 | 12 | 0 | 12.5 | 10.1 | **16** | 6 | 8.5 | 6 | 6.6 | 1.1 | 10.1 | 9.1 | 4.5 | **16.3** |
| MM_CF competitor JULY (illustrative resistance) | 4 | 60 | 0 | 0 | 0 | 0 | **15** | 9 | **15** | 6 | 12 | 7.5 | 4.5 | 1.5 | 4.5 | 4.5 | 0 | 0 |
| MM_CF class wk1 ('HALF TIME') | 6 | 9 | 0 | 6 | 0 | 0 | 3 | 2.25 | 3 | 0 | 0 | 3 | 0.75 | 0 | 0 | 0.75 | 0 | 0 |
| MM STRENGTH-8 v04 mean wk1-7 | 4 | 53 | 0 | 3 | 0 | 0 | 10.4 | 6.9 | 8.6 | 12.6 | **15** | 6.6 | 0.9 | 1.9 | 6.8 | 4 | 0 | 0 |
| MM STRENGTH-12 mean of loading weeks | 4 | 58 | 0 | 0 | 0 | 0 | 14.4 | 8.6 | 14.7 | 14.1 | 6 | 2.8 | 1.4 | 0.8 | 3.1 | 8.8 | 0 | 0 |
| MM AESTHETICS-8 wk1 | 4 | 32 | 0 | 0 | 0 | 6 | 8 | 6 | 8 | 4 | 8 | 5 | 1 | 1 | 2 | 2 | 0 | 0 |
| MM AESTHETICS-8 wk7 | 4 | 80 | 0 | 0 | 0 | 15 | **20** | **15** | **20** | 10 | **20** | 2.5 | 10 | 2.5 | 5 | 2.5 | 0 | 0 |
| MM AESTHETICS-12 wk1 | 6 | 96 | 0 | 0 | 0 | 0 | **18** | 10.5 | 12 | **15** | **18** | 2.25 | 6 | 7.5 | 10.5 | **17.25** | 0 | 0 |
| MM AESTHETICS-12 wk6 | 6 | 128 | 0 | 0 | 0 | 0 | 28 | 12 | 12 | 24 | 24 | 4 | **16** | 2 | 14 | **20** | 0 | 0 |
| MM AESTHETICS-12 wk12 | 6 | 158 | 0 | 0 | 0 | 0 | 33 | 14.5 | **20** | 30 | 30 | **15** | 2.5 | **15** | **17.5** | 22.5 | 0 | 0 |
| MM HYBRID wk1 | 5 | 27 | 11 | 10 | 0 | 6 | 8 | 6 | 8 | 5 | 4 | 3.25 | 0.5 | 1 | 1 | 1.75 | 0 | 11 |
| MM HYBRID wk8 | 5 | 56 | 16 | 10 | 0 | 12 | **16** | 12 | **16** | 4 | 12 | 9 | 2 | 2 | 3 | 3 | 0 | **16** |

The full list of 61 views (every scenario, every boxing week, every level) is in `03_volume_rules.json` → `observed.program_views`, each with `normalized_muscles_coach_v1` (this table) and `normalized_muscles` (the v0 analyst map, synergists 0.5 and glutes 0.5-1.0 from every lower slot).

### 3.2 Medians by goal family (coach count; [min-max]; delt columns use the exercise-level split of section 1.4)

| Goal family (views) | quads | glutes | hams | chest | back | f.delt | s.delt | r.delt | biceps | triceps | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hypertrophy/aesthetics (23) | 16 [6-33] | 9 [3-15] | 12 [6-20] | 10 [4-30] | 12 [6-30] | 5.2 [2.2-15] | 6.5 [0.8-16] | 3.5 [1-15] | 8.2 [2-17.5] | 9 [2-22.5] | 3 [0-12] | 0 [0-9] |
| bootcamp/general (6) | 16 [12-18] | 9 | 16 [12-18] | 6 | 12 | 7.5 | 6.5 [5.5-7.5] | 1.5 | 8 [7-9] | 8 [7-9] | 6 [0-12] | 4 [0-6] |
| fat loss, 4 weeks (4) | 15.5 [15-17] | 8.9 [8-10.5] | 14.5 [13-17] | 7.5 [7-8] | 14 [13-15] | 3.4 [1.8-5] | 5.4 [3.8-7] | 1.6 [1.5-1.8] | 6 [5.2-6.8] | 4.8 [3.8-5.8] | 0 | 0 |
| athletic incl. baseball, boxing, hybrid (20) | 16 [5-21] | 9.2 [4.2-14.8] | 17.6 [7-28] | 4 [0-6.4] | 6.2 [2-12] | 6 [2-9] | 3.8 [0.5-8.2] | 1 [0-2] | 2.2 [0.8-10.8] | 2.2 [0.8-9.1] | 3 [0-5] | 15.8 [0-26] |
| strength/CrossFit (5) | 10.9 [3-15] | 7.3 [2.2-9] | 9.1 [3-15] | 12.6 [0-14.1] | 12 [0-16] | 6.6 [2.8-7.7] | 1.1 [0.8-4.5] | 1.5 [0-2] | 4.5 [0-7] | 4.5 [0.8-8.8] | 0 | 0 |

### 3.3 Where each muscle lands (count of the 58 comparable views, coach count)

Bands follow the coach's own numbers: 10-12 = beginner start, **15-20** = intermediate start / maintenance to some growth, 20-25 = growth, 25-30 = priority cap (COACH-ANSWER VOL-01, UNI-01, VOL-02).

| Muscle | <6 | 6-9.9 | 10-14.9 | **15-20** | 20.1-25 | >25 |
|---|---|---|---|---|---|---|
| quads | 2 | 7 | 17 | **23** | 7 | 2 |
| glutes | 7 | 39 | 11 | **1** | 0 | 0 |
| hamstrings | 1 | 9 | 18 | **25** | 4 | 1 |
| chest | 18 | 24 | 8 | **3** | 4 | 1 |
| lats / upper back | 8 | 18 | 21 | **9** | 1 | 1 |
| front delts | 26 | 26 | 5 | **1** | 0 | 0 |
| side delts | 33 | 17 | 6 | **2** | 0 | 0 |
| rear delts | 51 | 5 | 1 | **1** | 0 | 0 |
| biceps | 23 | 24 | 6 | **5** | 0 | 0 |
| triceps | 28 | 21 | 5 | **3** | 1 | 0 |
| calves | 47 | 7 | 4 | **0** | 0 | 0 |
| abs / obliques | 37 | 5 | 4 | **11** | 0 | 1 |

Under the v0 analyst map the 15-20 / above-20 counts were: quads 23 / 9, glutes 9 / 36, hamstrings 25 / 5, chest 3 / 5, back 9 / 2, front delts 3 / 0, side delts 5 / 0, rear delts 1 / 0, biceps 5 / 3, triceps 5 / 3. Main movers (quads, hamstrings, chest, back) do not move; glutes, delts and arms drop because most of their sets in the templates are helper sets.

### 3.4 Weekly sets per bucket (pattern view)

- **BYOP templates (OBSERVED slot counts):** every main pattern appears **2x/week** in the 4-day, bootcamp and athletic templates (the '3 DAY BUILDER' has VPULL, VPUSH, UHD, leg curls and calves once a week). At 2-3 sets per slot that is **4-6 sets per pattern per week** (BKD, BHD, UKD, UHD, HPUSH, VPUSH, HPULL, VPULL), plus 4-6 for each isolation slot. PPL is the exception: horizontal push 6 slots (18 sets at 3) and horizontal pull 4 slots (12). Leg curls are counted as the leg-flexion segment, not as hinge volume (COACH-ANSWER CAT-09).
- **Baseball (OBSERVED):** each lower pattern slot asks for **8 sets/week** (2 exposures × 4 sets) and each upper pattern 4 sets/week. Part of the lower slots is filled with jumps or hamstring curls, so resistance sets per lower pattern are 4-9.
- **Athletic buckets (BYOP template):** plyo 6 slots, throws 4, COD 4, triple extension 4 per week → 12 / 8 / 8 / 8 sets at 2 sets/slot. None of these count toward muscles (COACH-ANSWER VOL-10).

### 3.5 What the numbers mean (INFERRED, read against the coach's answers)

1. **The coach's 15-20 is a lower-body reality and an upper-body aspiration.** Quads reach 15-20 in 23 of 58 views and pass 20 in 9 (UL/PPL 'INTERMEDIATE', AESTHETICS-12 weeks 6 and 12, boxer weeks 3-8); hamstrings reach 15-20 in 25 views. Chest is in 15-20 or above in only 8 of 58 views. The generator now starts an intermediate at 15 for every big muscle (COACH-ANSWER VOL-01; 12 §3.3), so upper-body volume in the generated plans will sit above most of his written templates.
2. **Glutes are mostly helper credit.** Counted his way, glutes reach 15 in 1 of 58 views (AESTHETICS-8 week 7) and never pass it (median 9 in hypertrophy programs), because the templates train glutes through squats, lunges and hinges, not through hip-thrust-type work. A client with a glute goal needs direct glute exercises or Focus slots (the engine does this in 12 §5.2). The glute credit values are PROPOSED (12 §7 item 3), so these glute numbers move if he changes them.
3. **The upper body reaches 15-20 only through specialisation**: the 6-day push/pull/legs splits and the 12-week aesthetics track. In the 4-day templates the coach's lever is the 'Focus 1'/'Focus 2' slots (+12 to +18 sets/week available on optional days; both may hit the same muscle, COACH-ANSWER ORD-11).
4. **Athletes run low upper-body volume by design** (chest median 4). This matches his rule that field athletes "don't need to get bigger and stronger that much" (COACH-ANSWER UNI-02). One observed case goes further than his rule: the boxer's chest drops to 0 in weeks 3-8, but he now says to bring pressing and arm volume "down, down, down ... but not completely cut it out" (COACH-ANSWER ATH-04).
5. **Small and "forgotten" muscles get almost nothing directly**: rear delts under 6 sets in 51 of 58 views (direct work only in the push/pull/legs tabs, 'Reverse Flies' / 'DB Reverse Flies or Machine', and AESTHETICS-12 'face pulls' / 'machine or db Reverse flies'), calves median 3 (0 in fat burn, strength, CrossFit and every 4-track), abs 0 outside athletic programs and optional days. **The coach: "They don't, but they should ... It wasn't intentional. I just usually didn't put it in there because I usually just didn't show it to the athletes"** (COACH-ANSWER VOL-17). v1 rule: calves 3 sets every leg day, rear delts their own sets every week, about 2 core exercises per session (section 9.3).
6. **Chest low, side delts high in UL and fat burn** (UL chest 6-8 vs side delts 13.5-14 coach count) was not intended; the generator balances to the start table, and a V-taper bias is an optional per-client choice (COACH-ANSWER VOL-18; section 9.4).

### 3.6 Against the science (SCIENCE)

- **Dose-response.** Schoenfeld, Ogborn and Krieger (2017; 15 studies) found 10+ weekly sets per muscle beat 5-9, which beat <5. Baz-Valle et al. (2022) proposed **12-20 weekly sets** as the standard recommendation for trained men, with no extra benefit above 20 for quads and biceps (triceps an exception). Schoenfeld et al. (2019) showed 1 vs 3 vs 5 sets per exercise (6-9 / 18-27 / 30-45 weekly sets) gave more hypertrophy with more volume but similar strength. Pelland et al. (2026) confirmed a positive dose-response with diminishing returns, stronger diminishing returns for strength. The full research comparison with his numbers (Pelland efficiency tiers, Aube, Barbalho, the chart he asked for) is in 12 §2.1-2.2.
  - **Fit:** his intermediate 15-20 sits inside the 12-20 consensus band and his "20-25 = growth" sits in Pelland's lower-efficiency tier (more growth at a higher cost per set) (12 §2.2). His written templates put quads and hamstrings at 12-22 and most upper-body muscles at 6-12, i.e. at or below the 10-set threshold unless Focus slots are used.
- **RP volume landmarks (current RP Strength muscle guides, intermediate lifters, direct sets/week).** Volume landmarks: MV = maintenance volume, MEV = minimum effective volume, MAV = maximum adaptive volume, MRV = maximum recoverable volume; "*P" = when the muscle is the primary priority and other training is reduced (RP's definition).

| Muscle | MV | MEV | MAV | MRV | MAV*P | MRV*P | RP frequency |
|---|---|---|---|---|---|---|---|
| Chest | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 2-4x |
| Quads | 2-4 | 4-6 | 6-14 | 14-18 | 10-18 | 18-24+ | 2-5x |
| Hamstrings | 0-2 | 2-4 | 2-8 | 8-14 | 8-14 | 14-20 | 2-3x |
| Glutes | 2-6 | 6-8 | 8-24 | 24-30 | 24-30 | 30-40+ | 2-5x |
| Back (text, not chart) | ~6 | ~10 | 4-12 per session | ~20 (2x/wk) to ~25 (3x/wk) | - | - | 2-4x |
| Biceps | 6-8 | 8-10 | 14-20 | 20-26 | 20-26 | 26-35 | 3-6x |
| Triceps | 0-4 | 4-6 | 6-16 | 16-20 | 16-20 | 20-26+ | 2-4x |
| Front delts | 0-2 | 0-2 | 4-8 | 8-12 | 12-16 | 16-20+ | 2-3x |
| Side delts (older RP figures via a secondary summary) | 6 | 8 | 16-22 | 26+ | - | - | 2-6x |
| Rear delts | 0-4 | 0-4 | 4-12 | 12-20 | 24-30 | 30-40+ | 3-6x |
| Calves | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 3-6x |
| Abs | 0-4 | 0-4 | 4-12 | 12-20 | 16-24 | 24-32+ | 3-6x |

  - **Fit and tension.** RP counts **direct** sets. Quads and hamstrings are almost all direct sets under the coach count, so the high-volume views pass RP's direct quad MRV (14-18) and hamstring MRV (8-14): UL/PPL 'INTERMEDIATE' quads 22, AESTHETICS-12 week 12 quads 33, boxer week 8 hamstrings 28. These sit at or above his own 20-25 growth band and priority cap, so they are peak-week values, not starting values.
  - **Glutes (v0 tension retired).** v0 reported glutes at 26-35 in peak weeks, above RP's glute MRV (24-30). That came from the v0 analyst map (glutes 1.0 from every hinge and unilateral knee set). Under the coach count no view passes 15, so the over-MRV concern does not apply; the open issue is the opposite (glutes under-served unless they get direct work, section 3.5 point 2).
  - **Front delts:** RP says most people need no direct front-delt work because pressing covers it. The coach agrees in practice (no front-delt slot; 'ABdution' menu front raises are rare) and does not place front delts in his big or small class (COACH-ANSWER CAT-02); they are a floor muscle in the engine (12 §3.3).
  - **Rear delts:** at 1-2 coach-count sets in most templates they are below RP's MAV (4-12); the 6-day push/pull/legs tabs (7-10) and AESTHETICS-12 weeks 1 and 12 (7.5 and 15) reach it. v1 gives rear delts their own sets every week (COACH-ANSWER VOL-17; start 4 / 6 / 8 by level PROPOSED in 12 §3.3).

---

## 4. Rep ranges (question 4)

**Coach rule (v1).** Small muscles 12-30 reps (20s, 'MAX', MYO sets), big muscles 5-15 "mixed" (COACH-ANSWER VOL-11, RIGHT); no 40-rep sets except an optional CrossFit/AMRAP style (VOL-11); preference moves the reps of big compound lifts only (VOL-12); unilateral lifts moderate-high by default, heavy low reps optional (UNI-04); VOL 1 / 2 / 3 rep phases for all athletes (PER-11); the same rep rules at every level (PRG-06). The generator matrix is section 9.9. Sections 4.1-4.4 below are the evidence from the sheets.

### 4.1 The coach's own statements and menus (OBSERVED)

- Coach (request text): "smaller muscles are going to take a lot more reps because you can't really go that heavy, and bigger muscles are going to take more of a mix. Essentially, everybody tries to pick whatever is best for them between 5 and 30 reps."
- BYOP SETS menu (`AV8:AV16`): 1, 2, 3, 4, 5, 6, 7, 8, 'SUPERSET W/ 👇'.
- BYOP REPS menu (`'MASTER EXERCISE LIBRARY'!AW8:AW14`): '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'. No 1-3, no 25-30, no per-side, no time, no distance.
- 'MYO SET' (MM 'ALL ABOUT SQUATS' A30): 15 reps, ~3 s pause, 5 reps, repeat 5 x 5 -> **40 reps**, labelled '**MYO SET - ADVANCED' and prescribed 3 x '15/5/5/5/5/5'. Also '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (4 TRACKS W61).
- BASEBALL legend (rows 19-22; header A19 'RESISTANCE PATTERNS', column headers B19 'COMPOUND' and C19 'SMALLER ISOLATIONS'; E19 'ATHLETIC PATTERNS' heads the speed zones): 'VOL 1' '12-15 Reps' / '10-12 Reps'; 'VOL 2' '8-12 Reps' / '15 REPS'; 'VOL 3' '6-8 Reps' / 'MAX REPS'. As compound reps fall, 'SMALLER ISOLATIONS' reps rise. Note the coach's own column name combines both ideas (small muscle + single joint).
- 'ALL ABOUT SQUATS' menus (exercise cell 'Whatever Squat', rows 23-26 'Whatever + Max air squats', row 27 '**MYO SET - ADVANCED'): hypertrophy 3x15, 3x12, 3x10, 3x8, 4x15, 4x12, 4x10, 4x8, then 4x15/4x12/4x10/5x8 + 'Max air squats', then 3 x MYO; strength 5x3, 6x3, 5x4, 6x4, 7x3, 6x4, 8x2, 7x2, 4x4, 4x5, 5x5, 6x4; athletic ('ATHLETIC FOCUSED WORKOUTS', G13) 'OFF SEASON' 'FRENCH CONTRAST' sets '3-4' (cell stored as date 2022-03-04) x '3/3/3/3/3': '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps'. Rule A5: "****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus". Banded/chained loads: 'BOTTOM BANDED' 'Weight should be lower ranges around 50% so you can move fast'; 'REVERSE BANDED' 'Weight should be lower ranges and fast speed'; 'BOTTOM CHAINS' 'Weght can be moderate around 70%'. **Out of scope for the generator:** the coach does not program bands and wants no variable resistance (bands, chains, weight releasers) for now (COACH-ANSWER EQ-01, EQ-12), so the banded/chained rows and the 'reverse banded squat jumps' are kept here as evidence only; the French contrast uses an unbanded jump in its place (PROPOSED).
- Notation (COACH-ANSWER PRG-07): '12/10/8 -20' on curls = 12 reps at mid weight, 10 heavier, 8 heaviest, then a light 20-rep set; '10/10' = 10 per arm (a bilateral 10/10 written on purpose would be two sets of 10).

### 4.2 Observed rep distributions (set-weighted)

**BYOP filled cells (AESTHETICS + 'JUSTICE LEAGUE'):** compounds 3 x '15 Reps' (leg press, pulldown, DB deadlift, push-ups) or 3 x '8 to 12 Reps' (barbell row, reverse lunge); explosive compound 'DB Push press' 5 x '6 to 8 Reps'; isolation 2 x '20 Reps' (EZ curls, leg extensions); calves 3 x '15 Reps'; athletic and front squat 2 x '6 to 8 Reps'; throws, rows, lunges, pull-ups 2 x '8 to 12 Reps'; leg extensions 2 x 'MYO SET'. Set-weighted mean: compounds ~12 reps/set, isolation + calves ~18.

**MM gym splits (decode bins):**

| Program / level | Big compounds | Small/isolation |
|---|---|---|
| UL NOVICE | 6-8: 45 %, 9-12: 55 % (mean 10.2) | 16-20: 72 %, AMRAP: 28 % (mean 20) |
| UL NEWBY | 9-12: 100 % (mean 10.25) | 16-20: 71 %, AMRAP 29 % |
| UL INTERMEDIATE | 6-8: 50 %, 9-12: 50 % (mean 10.0) | 16-20: 71 %, AMRAP 29 % |
| PPL NOVICE | 6-8: 48 %, 13-15: 52 % (mean 11.7) | 13-15: 38 %, 16-20: 54 % (mean 18.0) |
| PPL NEWBY | 9-12: 100 % (mean 10.0) | 6-8 14 %, 9-12 21 %, 16-20 54 % (mean 15.7) |
| PPL INTERMEDIATE | 6-8: 75 %, 9-12: 14 %, AMRAP 11 % (mean 8.6) | 6-8 40 %, 16-20 50 % (mean 14.7) |
| FAT BURN WK1 -> WK4 | mean 11.0 -> 8.9 (6-8 share 27 % -> 70 %) | mean 19.0 -> 35.0 (31-40 reps 75 % in WK4) |

**MM athletic, boxing and baseball (computed from item rows, set-weighted; `03_volume_rules.json` -> `observed.rep_distributions`):**

| Class | Baseball (24 wks) | Athletic STARTING | ' MID' | ' ADVANCED' | Boxer wk1-2 | Boxer wk3-8 |
|---|---|---|---|---|---|---|
| Big compound (RP_*) | 9-12: 55 %, 6-8: 26 %, AMRAP 8 %, 1-5: 2 %; median 10; 4.05 sets/line | median 12 (9-12 48 %, 6-8 31 %, 1-5 10 %) | median 8 (6-8 61 %) | median 6 (6-8 79 %, 1-5 21 %) | 10 (100 %) | median 6 (6-8 50 %, 1-5 29 %) |
| Big-muscle isolation (leg ext/curl, flies) | 16-20: 55 %, time 31 %; median 20 | median 16 | 8 | 20 | 10 | 6 and 20 in the same week |
| Small-muscle isolation (arms, delts) | 9-12: 36 %, **AMRAP 34 %**, 13-15: 15 %, MYO 4 %; median 11 | 8 | 12 | 12 | 10-15 | 20 |
| Calves | **AMRAP 58 %**, 9-12: 27 %, 16-20: 12 % | - | - | 8 | - | 3 (deficit, unclear) |
| Core | time/accumulate 51 %, 9-12: 29 % | time 65 % | median 20 | median 20 | 15 | 10 |
| Plyo (contacts per set) | median 10 (1-5: 23 %, 9-12: 47 %) | 8 | 8 (squirrel 40) | 20 | - | 5 (complexes) |
| Throws | median 10 per set | 10 | 10 | 10 | 10 | 10 |
| Triple extension / Olympic | median 6 (6-8: 79 %) | 8 | 7 | 3 | - | 10 |

### 4.3 What the coach actually does (INFERRED rules, with his answers)

0. **His answer settles the framing.** He confirmed the size framing "small muscles 12-30 (20s, MAX, myo sets); big muscles 5-15 mixed" (COACH-ANSWER VOL-11). The single-joint observation below fits inside it: big-muscle isolation at 15-20 is part of the "mix".
1. **Single-joint = higher reps.** Isolation (including big-muscle isolation such as leg extensions and leg curls) sits at 15-20, 'MAX REPS' or 'MYO SET'. Compounds sit at 8-15. That is a stronger pattern than "small muscle = high reps": PPL 'INTERMEDIATE' gives side raises, reverse flies and upright rows 4 x 8 (side raises are already 4 x 8 at 'NEWBY'), and the athletic tabs give curls 12. The coach's own baseball label is 'SMALLER ISOLATIONS', so his category is small-muscle single-joint work; big-muscle isolation (leg extensions, leg curls) follows the same high-rep rule in practice.
2. **Compounds mostly move down with level; isolation stays fixed or moves up.** OBSERVED per tab: PPL push/pull compounds 15 -> 10 -> 8 (rows '15/15' -> '10/10' -> '8/8'); UL lower compounds 12 -> 10 -> 8; but PPL legs go 8 -> 10 -> 8 and UL upper pressing/pulling goes **up** 8 -> 10 -> 12 (a fill error per COACH-ANSWER PRG-06; the generator uses one rep rule at every level), so the UL set-weighted compound mean is flat (10.2 / 10.25 / 10.0) while PPL falls (11.7 / 10.0 / 8.6). Arm isolation stays 3 x 20 at every level (UL curls are 3 x 'MAX REPS' at every level). FAT BURN compounds 11.0 -> 8.9 mean over 4 weeks while isolation goes 19 -> 35. BASEBALL legend VOL 1 -> 3 does the same (compound 12-15 -> 6-8, isolation 10-12 -> MAX).
3. **Big muscles get "a mix"** (the coach's words): heavy bilateral 6-8 (or 4-6/1-5 in strength), secondary 8-12, machine and unilateral 12-15, isolation 20.
4. **Role decides reps on athletic days**: high-intent items (plyo, COD, power clean, main squat) '6 to 8 Reps'; secondary/unilateral/upper '8 to 12 Reps'; finisher MYO ('JUSTICE LEAGUE').
5. **The 5-30 envelope** holds for most work. Outside it: strength singles/doubles (1-3) in strength and pre-season blocks, 40-50-rep core lines, MYO sets (40), and the fat-burn isolation sets of 40. The coach on the 40s: "I'm not really a big fan of 40 reps ... it's not necessarily more fat-burning ... it's optional", e.g. inside an AMRAP (COACH-ANSWER VOL-11), so the generator never uses them by default.
6. **Preference styles appear as two tracks.** "More sets of squats with less weight" = the hypertrophy menu (3-5 x 8-15, 1-2 min rest). "Powerlifting style, heavier, fewer reps" = the strength menu (4-8 x 2-5, 3-6 min rest) and the conjugate tracks ('the work' 5,4,3,2,1 at '1RIR'). The coach confirmed that preference moves only the rep range of the big compound lifts, with weekly sets similar and small muscles still high-rep (COACH-ANSWER VOL-12).
7. **Unilateral reps** (OBSERVED: bilateral 4-15 reps, e.g. 12/10/8/8; unilateral 8/8 to 12/12): moderate-high by default; "sometimes they use heavy low reps ... That might be something that can be optional" (COACH-ANSWER UNI-04).

### 4.4 Against the science (SCIENCE)

- **Wide loading range works for hypertrophy.** Schoenfeld, Grgic, Van Every and Plotkin (Sports, 2021) propose that similar hypertrophy happens from about **5 to 30+ reps** when sets are equated and taken close to failure. RP's muscle guides give the same window ("weights in the 30%-85% 1RM range ... between 5 and 30 reps") and split weekly sets about **25 % heavy (5-10), 50 % moderate (10-20), 25 % light (20-30)**. The coach's "everybody picks between 5 and 30 reps" matches both almost word for word.
- **Muscle-specific notes from RP that support the coach's small-muscle rule:** rear delts respond poorly at 5-10 and "very productive" at 20-30; hamstring hinges 5-10 but leg curls 10-30; chest flies 10-20. There is no strong evidence that small muscles *need* high reps; the practical reasons are joint stress, load increments and technique, which is close to the coach's "you can't really go that heavy".
- **Strength needs heavier loads.** Strength gains are greater with heavier loads (same 2021 review). The coach's strength menu (2-5 reps) and conjugate ladders are consistent.
- **Prilepin's chart (a reference point, not the coach's model).**

| % 1RM | Reps per set | Optimal total | Range |
|---|---|---|---|
| 55-65 | 3-6 | 24 | 18-30 |
| 70-80 | 3-6 | 18 | 12-24 |
| 80-90 | 2-4 | 15 | 10-20 |
| 90+ | 1-2 | 7 | 4-10 |

  - **Tension 1 (baseball optional Olympic piece, 'OPTIONAL PIECE' 'OLY', hang cleans and hang snatches on alternate days):** 'Hang cleans @ 75%' 4 x 8 = 32 reps (Prilepin 70-80 %: 3-6 per set, 12-24 total), '@ 80%' 4 x 6 = 24 (exactly the top edge of the 70-80 % row, above the 80-90 % row), '@ 85%' 4 x 6 = 24 (80-90 %: 2-4 per set, 10-20 total), '@ 90%' 4 x 4 = 16 (90+ %: 1-2 per set, 4-10 total). Every prescription except @80 % (read as the 70-80 % row) exceeds Prilepin's range, and the reps per set are about 1.3-2x the top of Prilepin's reps-per-set range (8 vs 6, 6 vs 4, 4 vs 2). Either the % is of a different max (for example a training max well below true 1RM) or the volume is intentionally high. The coach confirmed the template itself ("That's right. That's essentially it. I just want to make sure it's correct", COACH-ANSWER PER-09) but not the max it is taken from; still open (section 10, tension 3).
  - **Tension 2 (STRENGTH-12):** 6 x 3 at 90 % (18 reps) in weeks 5-6 and 7 x 2 in weeks 11-12 at RPE 9-10 sit far above Prilepin's 4-10 total reps at 90+ %. Wave 1 weeks 1-4 (4 x 5 at 80 % = 20; 5 x 4 at 85 % = 20) fit the 70-80 % and the top of the 80-90 % rows.
  - **Tension 3 ('ALL ABOUT SQUATS' strength menu at '(1 RIR)'):** 1 RIR on sets of 2-5 implies roughly 3RM-6RM loads (about 85-93 % 1RM by common rep-max tables; a set of 3 at 1 RIR is a 4RM, about 88-92 %). The menu totals are 14-25 reps (7x2 = 14 ... 5x5 = 25). The 2-3-rep schemes (5x3 = 15, 6x3 = 18, 7x3 = 21, 8x2 = 16, 7x2 = 14) fit inside the 80-90 % row (10-20, optimal 15) except 7x3 = 21, but are far above the 90+ % row (4-10) that a ~90 % load belongs to; the 4-5-rep schemes at ~85-87 % (6x4 = 24, 5x5 = 25) exceed the 80-90 % row. If the 1 RIR applies to the **last** set only, the earlier sets are lighter and the totals are plausible. Still open after the answers (section 11.2).

---

## 5. Effort (RIR/RPE) and rest (question 5)

**Coach rule (v1).** "There's RIR, there are percentages, and there's RPE ... I like RIR in my model, so that's what I'm going to be using. We can also add the explanation of RIR and kind of mix it with RPE" (COACH-ANSWER VOL-13). He confirmed **1-3 RIR at all times, no planned RIR ramp, and MAX / MAX REPS = technical failure only on small-muscle or bodyweight work** (VOL-13, RIGHT). Percentages stay in his strength and Olympic templates (PER-09). Rest: "1 to 2 minutes is usually fine" for hypertrophy, "maybe ... 1 to 3 minutes", strength 3-6 min, athletic as prescribed, supersets rest after the pair (VOL-14). The generator rules and the client-facing RIR/RPE explanation are in section 9.9; 5.1-5.3 are the evidence.

### 5.1 Every effort cue in the sheets (OBSERVED) and its decoded target (INFERRED)

| Cue (verbatim) | Where | Decoded target |
|---|---|---|
| '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' | MM UL/PPL A4, athletic A3, conjugate A5 | 1 RIR (RPE 9) on working sets |
| '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' | MM UL/PPL A6, athletic A5 | 1-3 RIR. The coach equates this with "RPE 7+" |
| 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+' / 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' | 'ALL ABOUT SQUATS' A13/D13 | 1 RIR (RPE 9). See tension below |
| '1-2 RIR' on every row | 4 TRACKS AESTHETICS-8 column D | RPE 8-9 |
| Monday/Wednesday ('M.E.', written only in N9/N13) rows 9-12 / 13-16: '1RIR' (main lift), '2RIR', 'MAX', 'ALL'. Thursday rows 17-20: 'EASY' (plyo), '1RIR' ('FAST ...' lift), '2RIR', 'MAX'. Saturday rows 21-23: '1RIR' ('FAST ...' lift), '2RIR', 'MAX' (no 4th row). "D.E." (dynamic effort) for Thu/Sat is the analyst's label: the sheet writes 'FAST ...' in the lift names and N17/N21 'FAST RPE6 or about 60-70%' | 4 TRACKS STRENGTH-8 / conjugate column D. Row labels in column M ('the work', 'the accessory', 'the nuance', 'the survival') are row-aligned, so on Thursday the '1RIR' lift sits on 'the accessory' row and 'MAX' on 'the survival' row | 1 RIR -> 2 RIR -> ~0-1 RIR heaviest for the reps -> to technical failure; plyos submaximal amplitude |
| RPE header 7,7,7,8,8,9,7,8,9,9,9,10 with % 80,80,85,85,90,90 | 4 TRACKS STRENGTH-12 | main lift RPE climbs 7 -> 9, deload 7, wave 2 8 -> 10 |
| 'FAST RPE6 or about 60-70%' | STRENGTH-12 Thu/Sat | speed work ~4 RIR, maximal bar speed |
| 'DEADLIFTS (1RIR)' 3 x 1; 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' | MM athletic ADVANCED, boxer wk3-8 | explicit RIR only on the heaviest hinge |
| 'HEAVY' / 'Heavy' (14 athletic lines), '(MID WEIGHT)', 'light weights - same speed for all reps', 'FAST', 'slow' | MM athletic, boxing, baseball | load words instead of numbers; INFERRED: HEAVY ≈ 1-2 RIR at 3-8 reps, MID ≈ 3 RIR |
| 'MAX REPS', 'MAX', 'max', 'myo set(s)', 'UNBROKEN' | UL/PPL calves and curls, baseball isolation (34 % of small-muscle sets AMRAP/MAX, plus 4 % MYO), core | AMRAP / to technical failure on isolation only |
| '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' | MM CrossFit A4 | progressive overload across weeks, not failure in a session |
| EFFORT menu '1 - Way Too Easy' ... '7 - That was tough', '8 - That was perfect', '9 - That was terrible', "10 - I'm done" | BYOP `AX8:AX17` (tracking tabs) | 8 = bullseye; 9-10 = overshoot (v0 read 8 as RPE 8 / 2 RIR; v1 reads it against the set's planned RIR, 9.9, PROPOSED) |
| HOW IT FELT? 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it" | BYOP `AY8:AY11` | target-tissue and pain screen (section 9.13) |

**Rule visible across programs (INFERRED):** effort rises as exercise complexity and systemic cost fall. Heavy multi-joint lifts stay at 1-2 RIR; isolation and pump work may go to 'MAX'/'ALL'; plyometrics and speed work are never taken near failure.

### 5.2 Rest (OBSERVED)

| Context | Rest written by the coach |
|---|---|
| Hypertrophy squats | '*REST 1-2 MIN BETWEEN SETS' ('ALL ABOUT SQUATS' B28) |
| Strength squats | '*REST 3-6 MIN BETWEEN SETS' (E28) |
| Athletic squat work | '*REST AS PRESCRIBED' (H28) |
| Blue (A) aerobic intervals | rest periods '3 Minutes' ... '8 Minutes' (cheat sheet A36:A41; INFERRED between blocks) |
| Green (B) | '1:1', '1:2', '1:3 Work:Rest' |
| Orange (C) | 'Active', ':30 sec', '1 Minute', '2 Minutes', '3 Minutes' |
| Lactate clearance | '2 - Rest 1 min btwn SETS', '3 - Rest 2 min btwn SETS', '4 - Rest 3 min btwn SETS' |
| Buy-outs | '3x 10 cal bike sprint (2 min rest)'; 'Fast run/ walk back or 3 min walk/rest' (baseball) |
| Everything else (BYOP, UL/PPL, fat burn, 4 tracks) | not written |

### 5.3 Against the science (SCIENCE) and tensions

- **RIR-RPE scale.** On the resistance-training RPE scale (Zourdos et al., 2016), RPE 10 = 0 RIR, RPE 9 = 1 RIR, **RPE 8 = 2 RIR**. So '(1 RIR) *RPE8+' is not a contradiction - 1 RIR is RPE 9, which satisfies "8+" - but the RPE floor is one point looser than the RIR it is paired with; '1-3 RIR aka RPE 7+' is exact as a floor (3 RIR = RPE 7). v0 read the client EFFORT menu's '8 - That was perfect' as RPE 8 = 2 RIR. That reading breaks his own cue: a client who stops at 1 RIR as told ("leave 1 in the tank" = RPE 9) would log '9 - That was terrible', and the feedback loop treats a median of 9 as an overshoot (hold). v1 therefore reads the EFFORT menu **against the set's planned RIR** ('8 - That was perfect' = landed on the target, whether the target was 1, 2 or 3 RIR; PROPOSED, section 9.9; tension 24). v0's INFERRED resolution (1-2 RIR on compounds, 0-1 on isolation last sets) is replaced by the coach's rule: **1-3 RIR on every working set, 0 RIR ('MAX') only on small-muscle or bodyweight last sets; strength main lifts follow his % / RPE template; speed work RPE 6** (COACH-ANSWER VOL-13, PER-09).
- **Proximity to failure.** A dose-response meta-analysis (Robinson et al., 2023 preprint, later published) found hypertrophy improves as sets get closer to failure while strength is largely insensitive. Refalo et al. (2024) found training to failure and stopping 1-2 RIR gave similar growth over 8 weeks, but failure caused more fatigue. The coach's "close but not to failure" for compounds and 'MAX'/'ALL' only on isolation fits this well.
- **"Never to failure" vs 'MAX REPS'.** A4 forbids failure while UL/PPL calves, curls and dips and 34 % of baseball small-muscle isolation sets (58 % of baseball calf sets) are AMRAP/MAX. Resolved by COACH-ANSWER VOL-13: 'MAX' = technical failure on small-muscle or bodyweight work only (last set).
- **Rest.** A Bayesian meta-analysis (Singer et al., 2024; 9 studies) found a small hypertrophy benefit from resting **more than 60 s**, with no further benefit beyond about **90 s**. The coach's 1-2 min hypertrophy rest fits, and his "up to 3 minutes" (COACH-ANSWER VOL-14) covers heavy compounds, where the generator defaults to the top of the 1-2 min range or longer. NSCA plyometric guidance: work:rest 1:5 to 1:10, depth jumps 5-10 s between reps and 2-3 min between sets, 48-72 h between plyometric sessions (Cortland lecture summarising NSCA).

---

## 6. Athletic-pattern dosing vs resistance dosing (question 6)

**Coach rule (v1).** Athletic sets "don't go towards muscles" (COACH-ANSWER VOL-10). The plyo vs ballistic mix is set by how long the sport keeps the athlete on the ground (more ground time → more ballistics; less → more plyos), with his sport ranking for jump volume (ATH-01, ATH-02). Programs start more ballistic and become more plyometric; the plyo method goes receive & pause → receive then create → repeated receive/create, and these are not "zones" (CAT-10, CAT-11). Everyone in athletic training gets Olympic lifts (ATH-10). The sport dial is section 9.11; the athletic budget engine is 12 §3.13. 6.1-6.5 are the evidence.

### 6.1 Plyometric ground contacts

| Program | High-intensity contacts/wk | Low-amplitude contacts/wk | Total/wk | Per session | Notes (OBSERVED) |
|---|---|---|---|---|---|
| BYOP ATHLETIC template @2 sets (INFERRED from 6 plyo slots x 2 x '6 to 8 Reps') | - | - | 72-96 (108-144 @3) | A day 24-32, B day 12-16 | 2 plyo slots on A days, 1 on B days |
| 'JUSTICE LEAGUE' Monday | - | - | 24-32 that day | - | 'Medium Depth Drop' + 'Ankle Hops ' 2 x '6 to 8 Reps' |
| MM athletic 'STARTING' (3 d) | 146 | 0 | 146 (+210 est. from 'High Knee Runs FAST' 2 x :30) | 48.7 | max-intent jumps 2 x 8, repeat jump squats 3 x 10, lunge jumps, box step-up jumps |
| MM athletic ' MID' (4 d) | 71 | 120 | 191 | 47.8 (17.8 high) | landings 1 x 8 'Drop & Stick - Hold for 3 seconds', squirrel jumps 1 x 40 and 40 & 40 |
| MM athletic ' ADVANCED' (4 d) | 32 | 100 | 132 | 33 (8 high) | single-leg/plate jumps, squirrel 1 x 40 |
| MM boxer wk1-2 | 0 | 0 | 0 | 0 | hypertrophy base |
| MM boxer wk3-8 | 113-129 | 142-177 | 258-306 (+720-1440 jump rope est.) | 64.5-76.5 (28-32 high) | complexes with 5-rep jumps, SL squirrel 20/20 reverse banded |
| MM baseball (training weeks) | - | - | 116-324; block means 199 / 241 / 201 | ~60-160 on the 2 lower-plyo days (INFERRED split) | 'LOWER ballistics/plyo' Tue/Fri, jump variants in 'bkd'/'bhd'/'calfs' slots |
| MM conjugate STRENGTH-8 | 18/wk | - | 18 | 18 on Thursday (the only plyo line of the week) | 'the work' plyo 3 x 6 'EASY' (E17:K17 'WEIGHTED DEPTH DROP', 'DEPTH DROP & JUMP', 'HIGH SQUAT JUMPS', 'REPEAT HIGH JUMPS') |
| MM HYBRID | ~36 (assumed 3 x 6, 2 days) | - | ~36 | 18 | landing -> reactive ladder |
| MM UL/PPL (A-drills, not plyo) | - | UL 72 / 90 / 64 and PPL 48 / 90 / 64 reps per leg per lower day (NOV / NEW / INT; PPL 'NOVICE' is 2 x '8/8', UL 'NOVICE' 2 x '12/12'); about 128-180 per leg per week on the 4-day UL | - | - | primer; unlabelled in UL/PPL. The same drills appear in the aerobic cheat sheet 'RUNNING WARMUP' block (E23) and in baseball BA46 'A Marches / A skips / A runners' |

**Progression levers inside plyos (labels OBSERVED in the ballistics tab + Sheet23 key; reading them as a left-to-right progression is INFERRED):** force phase 'TAKING IN FORCES' -> 'DELIVER FORCES FAST' -> 'AMORTIZATION OF FORCES' (columns A-C under A22 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST', '*I USE THESE FOR MUSCULAR FORCE PRODUCTION') -> 'REBOUNDING ' (column D under D22 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY', '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'); zone 'ZONE 1' 'Receive pause/creat' -> 'ZONE 2' 'Receive/create' -> 'ZONE 3 ' 'Repeat receive create'; bilateral -> unilateral; unloaded -> weighted; drop height low -> medium -> 'High Depth Drop (above hip)'; reverse-banded last. Within the athletic off-season ladder, **high-intensity contacts fall 146 -> 71 -> 32** while low-amplitude reactive contacts rise 0 -> 120 -> 100.

**What the coach said about these labels.** The 'ZONE 1/2/3' plyo labels are "not necessarily a plyo zone ... I just gave it a name ... I don't know what to call it yet" (COACH-ANSWER CAT-11); the zones from Pat Davidson's book are rotation biases of body positions and "don't apply to the plyos" (CAT-10). The plyo labels describe how the jump is done: receive and pause first ("your connective tissue need to learn how to receive forces before we teach it how to create"), then receive then create (stick then jump or hop), then repeated receive/create (hops); unilateral is harder than bilateral (CAT-10). This file calls them RC1 / RC2 / RC3 (working name PROPOSED in 12 §7 item 18). Reverse-banded and banded variants are out of scope (COACH-ANSWER EQ-01, EQ-12).

### 6.2 Medicine-ball throws

| Program | Throws/wk | Dose rule |
|---|---|---|
| BYOP athletic template | 4 throw slots x 2 x 8-12 = **64-96** | 'Situps to overhead throw' 2 x '8 to 12 Reps' (JL) |
| MM 'MEDBALL CHEAT SHEET' (ballistics A51:D71) | 1 pass = 19 throws, **210 reps** | '1' x '10' each, '1' x '20' for the two sit-up throws; most rotational/step throws are listed as R/L pairs (the side-to-side slams and alternating back-to-wall scoops are single lines), 5 throws are bilateral ('Chest pass', 'Overhead throw', 'Squat to Chest Pass', 2 sit-up throws). Rows 72-89 add 9 'SPECIALTIES' and 7 'CORE EXTRAS' (1 x 10 each) outside the 19-throw pass (the boxer's 19-item list uses 10 on the sit-up throws, = 190) |
| MM athletic STARTING / MID / ADVANCED | **210 / 400 / 420** | Mid = only the 10 rotational/half-kneeling throws at 2 x 10, twice a week |
| MM boxer wk1-2 / wk3-8 | **190 / 380** | 19 x 10 per list |
| MM baseball | **70-290** (block means 178 / 192 / 176) | 'Upper Ballistics/plyo' Mon/Thu, also inside 'Transverse core' |

### 6.3 Sprints, change of direction, Olympic lifts

| Quality | OBSERVED dosing |
|---|---|
| Sprint / acceleration | Baseball buy-outs 1-3 bouts of 10-20 cal bike/row/ski or 15-30 s runs, ~3-4 bouts/week, almost all in 'SPEED POWER' '10-39 Secs' (note DI29: 'Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run'); '30m acceleration sprint' 5; 'accelerations baseball starts'. Boxer 'Sprint 20/ Recover 40' 5,5,6,6,7,8 rounds (100 -> 160 s of work). HYBRID 10/12/15 x 15 s at 1:2, then 10/12/15 x 20 s at 1:2, then 5/10 x 30 s at 1:4 'fastest'. Cheat-sheet blue 10 x '10X10m Sprints'. Warm-up 2 x 10 yd A-drills + 5 x 10 yd 'Falling start accelerations'. UL/PPL A-drills 2-4 sets x 8-12 per leg. |
| Change of direction | BYOP 4 'COD' slots/week; JL 'DIG/OUT' 2 x '6 to 8 Reps' with note 'LATERAL' -> **12-16 cuts/session, 48-64/week** at 2 sets (INFERRED). **Zero** dedicated COD drills in every MM example (athletic, boxing, baseball); the only frontal-plane jumping is baseball 'skater jumps over hurdle' (DT47) and 'skater jumps with MB rotations' (AJ64), which are plyos, not cuts. |
| Olympic / triple extension | BYOP JL 'Power Clean' 2 x '6 to 8 Reps'; MM athletic 'Low Hang Power Cleans (mid weight)' 3 x 8 -> 'Heavy Power Cleans' 2 x 8 -> 'Power Cleans' 3 x 3; boxer 'Clean Pull/ hang Power Clean' 3 x 8, 'Hang Power Clean & Press' 3-6 x 12; baseball optional 4 x 8 @75 % -> 4 x 6 @80 % -> 4 x 6 @85 % -> 4 x 4 @90 % (16 sets/wk, never in-season); CrossFit POWER FULL TIME 3x3 -> 4x3 -> 5x3 -> 6x3, HALF TIME 3x4 -> 3x3 -> 3x2 -> 3x1; HYBRID 2-4 sets x 1-5 'heavy'. |
| Energy-system zones (baseball legend E19:F22) | 'SPEED ENDURANCE' '>40 Secs'; 'SPEED POWER' '10-39 Secs'; 'SPEED STRENGTH & POWER' '0-12 Secs' |

### 6.4 Athletic vs resistance dosing (INFERRED reading)

- **Athletic work is dosed by count and quality, resistance by sets x reps near failure.** Plyos 1-3 sets of 5-10 contacts (squirrel/rebound 20-40), throws 1-2 x 10 per side, Olympic 2-4 x 3-8, cuts 2 x 6-8, sprints by bout duration.
- **The athletic block sits first in the session** in the templates (plyo -> throw -> COD -> triple extension -> strength -> isolation; OBSERVED order). The generator puts about 2 core exercises **before** it by default, movable by the client (COACH-ANSWER ATH-11, NOT RIGHT on "core after the power block"). The athletic block **costs resistance volume**: BYOP athletic resistance sets are 44/week at 2 sets (66 at 3) vs 78 in the aesthetics version of the same skeleton (coach-default convention; 84 at a flat 3). Same-assumption comparison: 66 vs 84 at 3 sets, i.e. 22 resistance slots vs 28.
- **The sport dial is not "fewer contacts" for boxers.** The boxer's weeks 3-8 carry more total contacts (258-306) than the generic athletic example (132-191). What is lower is **high-amplitude bilateral jumping per session** (28-32 vs 48.7) and **bilateral max-height work**; the boxer's volume is low-amplitude, single-leg, stiffness-type bouncing (squirrel jumps, jump rope). INFERRED: "boxers and karate athletes don't need that many plyos" means fewer **rebounding/high-amplitude** contacts, not less elastic work. The coach's answer agrees with this reading: the more time on the ground (karate, fighters), the more ballistics and the fewer plyos, but "some plyos are always good because I need them to have other tissues really strong" (COACH-ANSWER ATH-01).
- **Olympic lifts for everyone in athletic training.** Observed Olympic work is limited to some programs (baseball's is an 'OPTIONAL PIECE', never in-season). The coach: "everyone gets Olympic lifts" - beginners DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate+ the full lifts (COACH-ANSWER ATH-10).

### 6.5 Against the science (SCIENCE)

- **NSCA contact guidance:** about **80-100 contacts per session (beginner), 100-120 (intermediate), 120-140 (advanced)** (NSCA CSCS chapter 18 as summarised by PT Pioneer; re-checked 2026-10-07); 48-72 h between plyometric sessions; off-season 2-3 sessions/week for football, 3-4 for track; in-season 1 (football) / 2-3 (track) (SUNY Cortland lecture page, which gives the same numbers but cites no source). The coach's sessions (18-77 counted contacts) sit **at or below the beginner range**, even for advanced athletes; only baseball peak days and the boxer's complex days approach it. That is conservative and consistent with his "Bring athletes back to feeling/moving great" note.
- **Meta-analysis of what drives jump gains:** more than 10 weeks, more than 20 sessions and **more than 50 jumps per session** maximised vertical-jump improvement (de Villarreal et al., 2009; 56 studies). The BYOP template at 2 sets (24-32 per A day) is below 50; the MM athletic Starting (48.7) and boxer (64-77) are at or above it.
- **Low volume is often enough.** In youth basketball players (a study in the University of Zaragoza repository), 49 vs 99 jumps per session twice a week for 6 weeks gave similar jump gains, with the low volume more efficient per rep. Combat-sport plyo programs typically ran 2-3 sessions/week for 4-12 weeks and improved jump, strength and COD (Ramirez-Campillo et al., Sports 2023).
- **Should athletic sets count toward the 15-20?** The evidence is mixed: in combat-sport athletes plyometrics did not change muscle mass (Ramirez-Campillo 2023, ES -0.01 to -0.06), but in untrained/recreational people plyometric training produced lower-body hypertrophy similar to resistance training (Grgic, Schoenfeld, Mikulic 2021 review, 6 comparison trials, up to 12 weeks). **Settled by the coach: they do not count** ("I think counting towards muscles is more for resistance patterns, not for athletic patterns. That's important", COACH-ANSWER VOL-10). Their lower-body and tendon cost is handled by the athlete volume factors (12 §3.4) and the separate athletic budget with NSCA contact caps (12 §3.13); v0's 0.5 charge against a lower-body fatigue budget is retired.

---

## 7. Conditioning dosing (question 7)

**Coach rule (v1).** "Both are important. This just needs to be picked accordingly": **3 aerobic sessions/week for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics/bodybuilders, and long walks after their workouts** (COACH-ANSWER ATH-07). The colour work can run on any tool and be tracked by calories, time or distance; "doing the block is the important part" (EQ-14). Fighters' daily opening cardio is a real aerobic block (ORD-09); fat-burn circuits are finishers (PRG-11). Generator rules: section 9.12.

### 7.1 The aerobic colour system (OBSERVED, 'AEROBIC CAPACITY CHEAT SHEET')

Rules (A3:A5, cyan): '*These are only recomendations & samples'; '**Follow Running Warmups'; '***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week'.

| Letter / colour | Duration | Intensity | Work | Rest |
|---|---|---|---|---|
| 'A' Blue A4C2F4 | 'Short Duration ' | 'High Intensity' | 'Seconds ': '15/45', '20/40', '30/30', '40/20', '45/15 Work:Rest' | '3 Minutes' ... '8 Minutes' |
| 'B' Green B6D7A8 | 'Moderate Duration' | 'Moderate Intensity' | '1 Minute', '2 Minutes', '3 Minutes' | '1:1', '1:2', '1:3 Work:Rest' |
| 'C' Orange F9CB9C | 'Long Duration' | 'Low intensity' | '4+ Minutes' | 'Active', ':30 sec' ... '3 Minutes' |

Level grid (A8:I21; 'BEGGINER WORKOUTS' green, ' INTERMEDIATE WORKOUTS' yellow, ' ADVANCED WORKOUTS' red):

| Colour | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Blue | 10 x '10X10m Sprints' MODERATE; 10 x '15 Sec Run/ 45 Sec Walk' EASY; 10 x '20 Sec Run/ 40 Sec Walk' EASY | 10 x 10 m MODERATE; 10 x '30 Sec Run/ 30 Sec Walk' MODERATE; 10 x '40 Sec Run/ 20 Sec Walk' MODERATE | 10 x 10 m SPRINT; 10 x 15/45 FAST; 10 x 20/40 FAST |
| Green | 5 x '1 Minute run/ 3 Min Walk' FAST; 5 x 2'/4' FAST; 5 x '3 Minute Run/ 3 Min Walk' MODERATE | 7 x 1'/3' MODERATE; 7 x 2'/4' FAST; 5 x 3'/3' FAST | '4-6' x 1'/3' FASTEST; '3-5' x 2'/4' FASTEST; '2-4' x 3'/3' FASTEST |
| Orange | 4 x '5 Minute Run/ :30 Sec Walk', 3 x '8 Minute Run/ 1 Minute Walk', 2 x '11 Minute Run/ 2 Min Walk' EASY; 1 / 2 / 3 mile EASY | 6 x 5'/:30, 4 x 8'/1', 3 x 11'/2' MODERATE; 1 mile FAST, 3 mile MODERATE, 5 mile EASY | 4 x 5'/:30, 3 x 8'/1', 2 x 11'/2' FASTEST; 1 / 3 / 5+ mile FASTEST |

Level unlock (MM 'EXAMPLE CROSSFIT SPLIT' D21:D24, repeated T21:T24): 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE'; the CrossFit monthly grids schedule **2, 2, 3, 4** aerobic sessions/week ('YES' cells) for levels 1-4. Back in the cheat sheet: lactate clearance, 16 surge-and-float formats (G26:I41), e.g. '1 min MODERATE/20 Sec FASTEST/ 2 Min EASY' x '4 (NO REST)'. Running warm-up (cheat sheet 'RUNNING WARMUP', D26:F32): 2 x 10 yd 'A March', 'A Skip', 'A Runs', 'Bilateral forward hops', 'Bilateral backward hops', 2 x '10/10' 'Single leg in place hops', 5 x 10 yd 'Falling start accelerations'.

### 7.2 What programs actually schedule (OBSERVED)

| Program | Conditioning |
|---|---|
| UL / PPL / athletic MM | "**Do steady cardio whenever you want, just don't over do it... I reccomend doing it WEDNESDAYS & SATURDAYS max 40 min of steady" (UL/PPL A5, athletic A4). UL/PPL only: 'Any Cardio Equipment' 1 x '5 Minutes' warm-up each session (6 cells in UL, 9 in PPL; none in the athletic tab) |
| BYOP athletic / aesthetics / bootcamp 1 | 2 'Aerobic Capacity'/'Cardio' slots per week (Wed/Sat in athletic and bootcamp 1; the two 'Optional' blocks in aesthetics), no rep dropdown, dose in the item (library column B, e.g. '3 min Fast - 2 min walk', '1 mile run - 1 min walk', distance tests up to '21.6 mile run', which the coach calls "a marathon, don't know when/where we need that" (COACH-ANSWER LIB-18; flag: a marathon is 26.2 miles)). The library also lists '400m' (B125) and '20 cals' (B135), but those rows sit outside the slot dropdown range B7:B122, so a client cannot pick them |
| BYOP '3 DAY BUILDER' | 3 'Cardio' slots per week, one in each 'Optional' block (B9, B19, B29) |
| BYOP push/pull/legs | no cardio slot |
| BYOP bootcamp 2 | 'Cardio' in every session (6/week) |
| FAT BURN | '30-40 mi slow/steady CARDIO' Wed + Sat (60-80 min/week) + circuits 3 x 30 s -> 4 x 35 s -> 4 x 40 s -> 5 x 50 s (12.0 -> 33.3 min of work/week, x2.78 in 4 weeks) |
| AESTHETICS-8 | '30-40 mi slow/steady CARDIO' Wed + Sat |
| Boxer | wk1-2 '20 sec fast/ 40 sec slow (cardio of choice)' + 'Easy cardio of choice (steady pace)' '20 min'; wk3-8 'Cardio of any choice' '20-40 min' + 'Sprint 20/ Recover 40' 5 -> 8 rounds |
| Baseball | buy-outs only (SPEED POWER), recovery week 'Paced Cardio - easy' 4 x '10 min'; no aerobic base in-season or pre-season |
| HYBRID | Tue 'SPEED' sprints (A) + Fri 'DISTANCE' '15-40 min constant cardo easy' (C) |
| CrossFit competitor | 2-4 aerobic sessions/week by level + WODs 'LVL 1 = 1 a week', 'LVL 2 = 2 wods a week', 'LVL 3 = 3 wods a week', 'LVL 4 = wods a week' (no number written for level 4) |
| Half marathon (Sheet24, 'HALF MARATHON PROGRAM by CHRIS HINSHAW ') | 2 training days/week for 21 weeks; the longer day grows 3 -> 12 miles, cut-back weeks 3, 6, 8, 12, 18, week 21 taper + race. In 7 weeks (2, 5, 7, 10, 14, 17, 20) the long day is split a.m./p.m. (e.g. week 20 '12 miles (7 miles a.m. + 5 miles p.m.)'), so the longest single continuous run is 11 miles (week 19) |

### 7.3 Against the science (SCIENCE) and tensions

- **Intensity distribution.** Elite endurance athletes do roughly 80 % of sessions at low intensity and 20 % hard (Seiler's polarised model). One blue + one green + one orange per week is 33 % low by session count, i.e. **not** polarised; but for strength and team-sport athletes, where conditioning is a minority of training, a 1:1:1 rotation that caps high-intensity work at 1-2 sessions/week is a reasonable concurrent-training choice.
- **Interference.** The interference of endurance work with strength, power and hypertrophy grows with endurance **frequency and duration** (Wilson et al., 2012; 21 studies). The coach's 'max 40 min of steady' and placement on non-lifting days fit that evidence.
- **Tension: 2 vs 3 sessions.** The cheat sheet asks for 3 per week; most templates have 2 slots (exceptions: the '3 DAY BUILDER' with 3, bootcamp 2 with 6 'Cardio' lines, CrossFit grids with 2-4 by level). **Resolved by the coach** (COACH-ANSWER ATH-07): 3 general/fat loss, 2 athletes in season, 4 aesthetics/bodybuilders + long walks. v0's level-based proposal (2 for L1-L2, 3 for L3+) is retired. Left open: which colour repeats at 4 sessions, and whether the level unlock ('LVL 1 = C') still holds at 3-4 sessions (section 11.3).

---

## 8. Progression as observed (evidence for rule 9.6)

**Coach rule (v1).** 3 / 5 / 7 % of weekly sets per muscle, picked by the person's state each week, 10 %/week "way too much", whole sets released from a bank, new sets on the first exercise first (COACH-ANSWER VOL-04, VOL-05, VOL-06, VOL-07, UNI-05); smooth weekly adds for hypertrophy and general clients, steps and waves for fight or competition prep (PER-10). The table below is how his sheets actually progress.

| Program | Lever | Weekly-equivalent rate (computed in decodes) |
|---|---|---|
| CrossFit FULL TIME strength | +1 set per level (3 x 7 -> 4 x 6 -> 5 x 5 -> 6 x 4) | about +26 %/level; = **+5.5 %/week** only if one level per month (INFERRED; the macro row actually runs STRENGTH levels APR 1, JUNE 3, JULY 4, OCT 2, NOV 2, so levels jump and fall) |
| CrossFit HALF TIME / class | sets fixed at 3, reps 7 -> 4 then 1RM | intensification only (reps -14 to -20 % per step) |
| STRENGTH-12 'the work' | sets 4,4,5,5,6,6 / 3 (deload) / 5,6,6,7,7; reps 5 -> 2; % 80 -> 90, +5 % every 2 weeks | **+5.2 %/week** sets; session totals +6.7 to +7.7 % per step |
| AESTHETICS-12 | sets/exercise 3,3,3,4,4,4,3,4,4,4,4,5 | **+4.75 %/week** |
| AESTHETICS-8 | sets 2,3,3,3,4,4,5; reps 12,10,8 wave | +16.5 %/week (from a 2-set start) |
| HYBRID | sets 2,2,2,3,3,3,4,4 (D71); reps 6,8,10,6,8,10,6,8 (D72); 'AMRAP' row D70 12,15,16,17,18,19,20,20 (a density/time lever; what it applies to is not written - the decode reads it as minutes for the Saturday circuit, INFERRED) | +10.4 %/week sets, +15 %/week reps; AMRAP +25 % in week 2, then +1 per week to 20 (12 -> 20 = +7.6 %/week compounded over wk1-wk8) |
| Conjugate / STRENGTH-8 | sets flat or falling (green ladder 5,5,4,4,3,3,2,1) | volume traded for intensity |
| Baseball block 2 (pre-season) | Part C/D 4 -> 5 sets | resistance 76, 74, 75, 76, 78, 81, 84: last steps **+2.6, +3.8, +3.7 %**, then deload -31 % |
| Baseball block 3 (in-season) | sets locked at 4, reps 10 | flat |
| FAT BURN (4 weeks) | compounds +sets, -reps; isolation +reps (leg ext/curl 4 x 15 -> 3 x 20 -> 2 x 40 -> 3 x 40; arm isolation 2 x 30 -> 2 x 30 -> 3 x 30 -> 3 x 40; side raises 3 x 15 -> 4 x 15 -> 3 x 20 -> 4 x 20) | sets 60, 60, 64, 70 (**0, +6.7, +9.4 %**); reps 781, 822, 924, 1040 (+5.2, +12.4, +12.6 %) |
| Boxer | 2-week steps + wave | 0, +41 % (phase change), 0, +3.5, 0, -11 (mini-deload), +31 % (peak) |
| UL/PPL levels | NOV -> NEWBY -> INT | resistance sets +18-23 %, then +13-14 % per level |
| Athletic off-season levels | STARTING -> MID -> ADVANCED | working sets excl. throws -19 %, -18 % (89 -> 72 -> 59); incl. throw sets +4 %, -13 % (108 -> 112 -> 97); intensity and specificity up |
| Squat hypertrophy menu | 3 runs of 15/12/10/8 reps (rows 15-18, 19-22, 23-26); 3 -> 4 -> 4-5 sets | +33 % sets between the first two runs, +25 % on the last row only. The sheet has no week labels; reading each row as one week (3 x 4-week waves) is INFERRED |

**Summary (INFERRED).** The coach never writes "+5 %". He adds **whole sets to individual slots every 2-3 weeks** and waves reps, so his week-over-week changes are step-shaped: 0 % for 1-2 weeks, then +20 to +50 % in one step. Averaged over a block, the 12-week products and the CrossFit levels land at **+4.75 to +5.5 % per week**, inside his stated 3-7 %; the 8-week AESTHETICS (+16.5 %/week from 2 sets) and 8-week HYBRID (+10.4 %/week) ramp 2-3x faster, above his stated range. Athletic blocks progress by **phase change and quality** (exercise level, contrast, peak) more than by % volume. In-season is flat. AESTHETICS-8, STRENGTH-8, STRENGTH-12, AESTHETICS-12 and the CrossFit class block have a scheduled deload or test; the 8-week HYBRID (week 8 = 4 sets, 'AMRAP' 20, '2x 1 heavy squat clean') and the 8-week boxer build-up (mini-deload in week 7, peak in week 8) end at the peak with nothing written after it.

**Against his answers.** The 12-week products' block averages (+4.75 to +5.5 %/week) sit inside his 3-7 %; the step shape of his sheets (flat, then +20 to +50 %) and the two 8-week products (+10.4 and +16.5 %/week) exceed his own "10 % is way too much" (COACH-ANSWER UNI-05). The generator follows his stated rule; his step/wave pattern survives only for fight or competition prep (COACH-ANSWER PER-10). The observed level jumps (UL/PPL +13-23 % per level) are between levels, not week to week.

---

## 9. Generator-ready rule set (v1)

Every rule carries its tag. Where `12_volume_algorithm_v1` covers a topic, the rule is stated in one line with the coach's question ID and the numbers are read from `12_volume_algorithm_v1.json` (the section is named); they are not repeated here so the two files cannot drift. Topics 12 does not cover (rep selection, effort, rest, session caps by population, the athletic sport dial, conditioning, the feedback mapping) are specified here in full. Every number is a default the coach can change in one place in `03_volume_rules.json` or `12_volume_algorithm_v1.json`; coaches using the tool can add their own rules on top (COACH-ANSWER GEN-08).

### 9.1 Inputs that change the dose

The full intake is in `09_generator_inputs.md`; these are the fields the volume and dosing rules read.

| Input | Values | Why it matters | Tag |
|---|---|---|---|
| goal | aesthetics/bodybuilding, strength/powerlifting, athletic (competitive sport), weekend-warrior athletic (non-competitive adults and youth), fat loss, general fitness, bootcamp | goal factors (12 §3.4), rep matrix (9.9), session caps (9.10), conditioning (9.12) | COACH-ANSWER GEN-02, ATH-13 |
| sport, position, season | competitive sport → sport + position + season (off, pre, in, post); recreational sport → sport only | athletic dial (9.11), bilateral share (12 §3.11), phase factors (12 §3.4) | COACH-ANSWER GEN-02, PER-08 |
| training experience | years of consistent training, months off, ex-pro yes/no | level L1-L3 (9.2) | COACH-ANSWER GEN-02, PRG-05 |
| age, body weight | numbers; **no sex field** | older-adult rules, loaded-jump loads (10-20 % of body weight, EQ-15) | COACH-ANSWER GEN-02, ATH-09, EQ-15 |
| days per week, session length | 2-6 days; minutes | session caps (9.10), time model (12 §3.10) | COACH-ANSWER UNI-09, PRG-02 |
| plan mode | 4-6-week maintenance/transition, 8-week, 12-week, week-by-week, yearly | plan shape and rate limits (12 §3.12) | COACH-ANSWER PER-01 |
| priority muscles and bias | up to 2 priority muscles; optional bias (e.g. V-taper) | 9.4 | COACH-ANSWER VOL-02, VOL-18 |
| pain / injury areas | joints or muscles | 9.5 | COACH-ANSWER VOL-03 |
| preference style | 'volume_lighter', 'balanced', 'heavy_powerlifting'; optional heavy-unilateral toggle | rep brackets only (9.9) | COACH-ANSWER VOL-12, UNI-04 |
| equipment | full commercial gym, basic gym, home gym, home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track kit (no bands) | exercise filtering (`10_equipment_model`) | COACH-ANSWER EQ-01 |
| recovery signal | usual sleep, stress, physical job / other sport load (3 taps) | planned rate before any logs (12 §3.7 step 3) | PROPOSED (12) |
| tests | checkboxes at block start (strength, cardio, speed) or "no testing" | test week (12 §3.12) | COACH-ANSWER PER-07 |
| output mode | static plan or adaptive weekly check-in | rate source (9.13) | PROPOSED (12 §3.14) |

### 9.2 Levels and muscle classes

- **Levels (COACH-ANSWER PRG-05, CAT-06).** **L1** = novice (he uses "novice" and "newbie" for the same thing): under about 6-12 months of training, **or** more than 6-12 months off (the body is treated as a beginner; exercise skill can stay higher because it returns fast). **L2** = intermediate: consistent training for more than a year. **L3** = advanced: definition PROPOSED in 12 §3.2 (3+ years consistent and 4+ days/week now, or a competitive physique/strength athlete). Ex-pro athletes start at L1 only for a short acclimation, then move up. Level up at the end of a block when the logs show mostly '8 - That was perfect' or easier with no pain (COACH-ANSWER PER-06). **L4 is retired**: competition level now changes the athlete profile (sport, position, season), not the volume level (12 §3.2).
- **How the sheet labels map (INFERRED from his definitions):** gym 'NOVICE' and 'NEWBY' → L1 (same thing; the v0 claim that 'NOVICE' sits below 'NEWBY' is retired); gym 'INTERMEDIATE' → L2; aerobic 'BEGGINER' / ' INTERMEDIATE' / ' ADVANCED' → L1 / L2 / L3. The athletic 'STARTING' / ' MID' / ' ADVANCED OFF SEASON' tabs can be used either as back-to-back blocks or as levels, "depends on whatever is needed" (COACH-ANSWER PRG-04). Level colours (OBSERVED, for display only): green 93C47D, yellow FFD966, orange F6B26B (gym) / red E06666 (athletic, aerobic).
- **Client level and exercise level are separate axes** (COACH-ANSWER CAT-06; OBSERVED: UL/PPL give leg press and barbell deadlift to 'NOVICE'). Level sets the **dose**; the exercise's difficulty is chosen per slot, and levels add options without removing any (COACH-ANSWER CAT-05).
- **Muscle classes (COACH-ANSWER CAT-02, RIGHT).** Big: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs. Not placed: traps, front delts, adductors, neck (floor muscles in 12 §3.3). **The class drives rep defaults (9.9) and the PROPOSED small-muscle start share (12 §3.3). It never drives the weekly rate** (COACH-ANSWER VOL-05).
- **Accounting muscle list** = the coach's 10 FOCUS headers ('QUADS 👇', 'SHOULDERS/TRAPS 👇', 'BACK 👇', 'TRICEP 👇', 'GLUTES 👇', 'HAMSTRINGS 👇', 'CHEST 👇', 'CORE 👇', 'BICEP 👇', 'CALVES 👇') with shoulders split into front / side / rear (12 accounting muscles), plus traps, forearms, adductors and neck as reported floor muscles.

### 9.3 Weekly sets per muscle: starting volumes, caps, other goals

**The coach's numbers (all COACH-ANSWER):**

| What | Value | ID |
|---|---|---|
| Starting weekly hard sets per muscle | beginner **10-12**, intermediate **15-20**, advanced **20+** ("sounds about right ... we just got to make sure we adjust accordingly") | VOL-01 |
| What the bands mean | 15-20 = "a good foundation for maintenance to a little bit of growth"; 20-25 = "a good growth foundation"; 40 sets of chest "way too much", 5 "too little" | UNI-01 |
| Priority muscle | +4 to +6 sets, cap about 25-30 | VOL-02 |
| Calves | 3 sets every leg day | VOL-17 |
| Rear delts | their own sets and reps every week | VOL-17 |
| Core | about 2 core exercises per session, first | VOL-17, ATH-11 |
| The tool learns | "this eventually will be something that learns from the data of all the people that use it" | VOL-01 |

**Engine values** (start per level, level caps, fill policy per muscle, small muscles at ~80 % of the big-muscle start, rear-delt 4 / 6 / 8, core block 2 × 2 sets): `12_volume_algorithm_v1.json > starting_table` (12 §3.3; the small-muscle share, rear-delt numbers and caps are PROPOSED). **Other goals, phases and populations** are multipliers on those starts (`goal_phase_modifiers`, 12 §3.4): strength keeps weekly sets similar and moves reps (COACH-ANSWER VOL-12); general and fat loss 0.8 (PROPOSED); field athletes off-season lower 0.7 / upper 0.5 with arms, side delts and glutes on helper credit (COACH-ANSWER UNI-02; factors PROPOSED); in-season 0.4-0.5 lower (COACH-ANSWER PER-08, UNI-10; factors PROPOSED); boxers in high-punching weeks **pressing and arms × 0.5-0.7, never zero** (COACH-ANSWER ATH-04; factor PROPOSED).

**What the start table changes against his written templates (coach count, hypertrophy family medians from 3.2 vs the L2 start):**

| Muscle | L2 start (12 §3.3) | His templates, median | Change |
|---|---|---|---|
| quads | 15 | 16 | about the same |
| hamstrings | 15 | 12 | +3 |
| glutes | 15 (athletes: helper credit only, PROPOSED) | 9 | +6, mostly direct glute work or Focus |
| chest | 15 | 10 | +5 |
| lats/upper back | 15 | 12 | +3 |
| side delts | 12 (PROPOSED 80 %) | 6.5 | +5.5 |
| rear delts | 6 (PROPOSED) | 3.5 | +2.5, own sets (VOL-17) |
| biceps / triceps | 12 (PROPOSED 80 %) | 8.2 / 9 | +3-4 |
| calves | 3 per leg day (6-12) | 3 | +3-9 (VOL-17) |
| abs | 2 exercises (VOL-17) × 2 sets (PROPOSED, 12 §7 item 15) per session | 0 | new (VOL-17) |

**Retired (v0):** the peak-week target table with back-solved starts (`start = peak / (1 + rate)^(weeks - 1)`), the "other goals L2" peak table and its level multipliers (L1 × 0.75 ... L4 × 1.15; athletic L3 × 0.9, L4 × 0.75). The coach gave starting volumes (COACH-ANSWER VOL-01), so the start is set first and the rate moves it (12 §3.3, §3.7).

**Floors** (any goal, unless a sport profile removes a muscle on purpose): big muscles 4 sets, small muscles 2 (12 §3.3, PROPOSED). SCIENCE: strength and size were kept for up to 32 weeks with 1 session/week and 1 set per exercise if intensity stayed high, in younger adults; older adults needed about 2 sessions/week and 2-3 sets to keep size (Spiering et al. 2021; Bickel et al. 2011; 12 §2.4). The v0 exception "fighter pressing may go to ~0" is retired (COACH-ANSWER ATH-04).

**Bilateral : unilateral share of the weekly sets** (the coach called this relationship "very important", `coach_answers.md`). His rules, all COACH-ANSWER; the profile table, the share filter and the numbers he did not give are in 12 §3.11 (PROPOSED there):
- **The range is 90/10 to 10/90**, set by the athlete, adjustable by the coach, and "we got to figure that out and put that algorithm together" (UNI-02). "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces" (UNI-02).
- **Bodybuilders and powerlifters:** unilateral "stays at the beginning just as a small foundation, maybe 50", then "turns more into an 80/20 or 90/10" bilateral (UNI-02). Contralateral and ipsilateral lunges are health accessories, given "much more of that at the beginning of their program ... the first couple of weeks, 3 weeks, up to 4", then bilateral-dominant; one stays in as an accessory "if there is anything bugging them" (CAT-13).
- **Field and change-of-direction athletes** (tennis, soccer, basketball, football skill positions): **80-90 % unilateral** so they keep their rotational forces; bilateral work is their health and connective-tissue foundation (UNI-02). Contralateral loading pulls the athlete **into** the hip and is their main unilateral loading; ipsilateral loading helps **out of** the hip, e.g. ipsilateral step-ups for a sprinter's acceleration (CAT-13). Court and combat athletes get more frontal and transverse unilateral work (UNI-12).
- **Season:** unilateral share rises toward the season; in-season bilateral work stays minimal, "maintain their strength and their potentiation" (UNI-10).
- **Upper body:** the same logic and the same 90/10-10/90 range (UNI-03); alternating lifts count as unilateral (UNI-07).
- **Pain or injury** moves the share: "we need to adjust accordingly" (UNI-02); a lift swapped for pain keeps its sets "ideally" (UNI-08; section 9.5).
- **Counting and progression:** one 10/10 set = 1 set (UNI-01); unilateral and bilateral volume progress the same way (UNI-05); unilateral reps stay moderate-high unless the heavy-unilateral toggle is on (UNI-04; section 9.9).

### 9.4 Priority muscles and biases

- **Priority** (COACH-ANSWER VOL-02, PARTLY: "That's the idea ... we'll collect data to see if we need to adjust it"): 1-2 muscles at a time; start = level start + 4 to + 6; cap about 25-30. The split by level (+4 at L1-L2, +6 at L3) is PROPOSED in 12 §3.5 (12 §3.3's table uses +5 at L2; conflict 5 in the v1 section).
- **Its exercise goes first** in its session, small priority muscles included (COACH-ANSWER ORD-04: calves first on aesthetics A-days and side raises first on push days were priority/pre-fatigue).
- **Delivery order:** its own exercises in the VOL-07 order (first exercise first) → 'Focus 1' / 'Focus 2' on the optional day (2-3 sets each; both may hit the same muscle) → a bonus exercise (COACH-ANSWER VOL-07, ORD-10, ORD-11).
- **Rate:** the person's rate applies to the priority muscle; non-priority muscles are held to at most 3 %/week while a priority runs (12 §3.5; PROPOSED). v0's "+2 percentage points of rate for a priority muscle" is retired (the rate is per person, COACH-ANSWER VOL-05).
- SCIENCE: RP defines MAV*P as the volume for a primary-priority muscle "if you prioritize its training and reduce the training for other muscles substantially"; their MAV*P values are roughly 1.3-2 × normal MAV, which bounds +4 to +6.
- **Bias (COACH-ANSWER VOL-18: "it can work into that V-taper bias. It just depends on the bias of the athlete, so the model needs to be able to understand that").** Default = **no bias**: the generator balances every muscle to the start table (the chest-low / side-delt-high pattern in UL and fat burn was not intended). Optional bias, PROPOSED mechanism: **'v_taper'** = side delts and lats/upper back treated as the 1-2 priority muscles (+4 to +6 each, side-delt exercise first on upper days), chest held at its start (no priority), all other rules unchanged. Other biases (glute, arm) would use the same switch. PENDING COACH APPROVAL.

### 9.5 Pain and injury

The coach's rules (all COACH-ANSWER), applied in this order; the trigger table with the engine actions is 12 §3.6:

1. **Pain area declared at intake:** that muscle or pattern starts **30-50 % lower**, its exercises move to **constrained machines** (constraint 4-5 on the approved 1-5 scale) or **split grips** (dumbbells, kettlebells, individual handles), positions that hurt are excluded (VOL-03, EQ-03, EQ-13; OBSERVED UL/PPL A7: '****When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'; athletic A6 adds 'usually going unilateral'). Older, injured and high-volume clients collect volume "in a safe place with more constraints" and never get overhead squat, snatch, low-bar squat or depth jumps (EQ-03).
2. **'Felt a PAIN' logged once:** swap inside the same category to a more constrained, split-grip or unilateral variant; **keep the sets "ideally, but you have to adjust accordingly"** (UNI-08).
3. **Pain again on the same slot:** that slot -30 to -50 %, freeze the muscle's rate (VOL-03); the removed sets may move to a pain-free exercise for the same muscle (PROPOSED, 12 §3.6).
4. **Still too much:** "maybe even drop the exercise altogether" for the block and flag for review (VOL-03).
5. **Pain moves the bilateral:unilateral share** toward the pain-free side (UNI-02 "we need to adjust accordingly"; 20 points PROPOSED, 12 §3.11). Low back sore after axial loading → belt squat (no spinal load) (EQ-11, PER-04).
6. 'Felt the WRONG muscle' → change one small variable in the same category; "Couldn't do it" → regress one exercise level or use an assisted version; volume unchanged (GEN-05 assumption RIGHT, PER-02).

Dosing details this file adds (PROPOSED, kept from the v0 INFERRED rule): on the painful pattern, shift the rep bracket up one notch (e.g. '8 to 12' → '10 to 15'), no MYO or MAX sets, and for an injured lower-limb joint only the first plyo stage (RC1, receive & pause landings).

### 9.6 Weekly progression: how 3 %, 5 % and 7 % are applied

**The rule (all COACH-ANSWER):**
- The weekly increase is **3 %, 5 % or 7 % of that muscle's weekly sets** (VOL-04: "your chest example: 20 → 22 sets at the same load"; load and volume load are tracked, not driven by %).
- **It is chosen by the person's state, not by muscle size:** "It doesn't really go by muscle ... It's just more on what's going on with the person ... they're going to have to somehow be able to adjust accordingly, or their coach" (VOL-05); "how the athlete feels, how good the athlete is getting, and how they're doing the rest of the things in their life" (UNI-05).
- **10 %/week is too much:** "It's hard to sustain a program like that for an 8-week program" (UNI-05). It is a hard ceiling on the person's total weekly resistance sets: a week must stay below +10 %. A hand-set rate runs from 0 to 7 %; 10 % is never offered as a rate (12 §3.7 step 4 says 0-10 %; conflict 4 in the v1 section).
- **Unilateral and bilateral volume progress the same way** (UNI-05).
- **Rounding:** bank the fraction and add a whole set when it reaches 1 ("round up, round down. That's fine"); the tool, not the client, does the math (VOL-06).
- **Where the new set goes:** the first exercise for that muscle in the day's order, then the next: 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3; "I'm adding sets to the things that matter most ... in the beginning of the exercise because I put all my energy into it" (VOL-07). Small muscles trained at the end of a session (biceps after a back day) get extra volume as a **bonus exercise** (VOL-07).
- **Shape:** smooth weekly adds for hypertrophy and general clients; 2-week steps and waves for fight or competition prep (PER-10).

**Engine (12):** readiness gates and score that pick 3 / 5 / 7 % or hold each week (§3.7, PROPOSED weights and bands), the planned rate before any logs (§3.7 step 3: 5 % default, 3 % for stressed / older / returning / pain, 7 % only once logs earn it; PROPOSED), phase limits on the rate (§3.7, §3.12), banking (§3.8), placement with day rotation and the bilateral:unilateral filter (§3.9). Retired from v0: size-class rates (large lower 3 %, large upper 5 %, small 7 %), the 0.75 release threshold, the "isolation slot first / alternate bilateral and unilateral" placement, the compounding target formula and the v0 worked example built on them (COACH-ANSWER VOL-05, VOL-06, VOL-07).

**Illustration (computed with the session scratchpad script `v1_03/bank_example.py`).** L2 quads, start 15 direct sets: day A (Mon) back squat 3 / Bulgarian split squat 10/10 3 / leg extension 2; day B (Thu) leg press 3 / walking lunge 10/10 2 / leg extension 2. The person's weekly rate comes from that week's readiness (12 §3.7). The share filter of 12 §3.9 step 2 is left out to show his order alone.

| Week | Person rate | Added to bank | Quads sets | Bank left | Sets per exercise (day A · day B) |
|---|---|---|---|---|---|
| 1 | - | - | 15 | 0.00 | A 3/3/2 · B 3/2/2 |
| 2 | 5 % | +0.75 | 15 | 0.75 | A 3/3/2 · B 3/2/2 |
| 3 | 5 % | +0.75 | 16 | 0.50 | A 3/3/**3** · B 3/2/2 |
| 4 | 3 % (busy week) | +0.48 | 16 | 0.98 | A 3/3/3 · B 3/2/2 |
| 5 | hold (EFFORT 9) | +0.00 | 16 | 0.98 | A 3/3/3 · B 3/2/2 |
| 6 | 7 % (fresh, lifts up) | +1.12 | 18 | 0.10 | A **4**/3/3 · B 3/**3**/2 |
| 7 | 5 % | +0.90 | 19 | 0.00 | A 4/3/3 · B 3/3/**3** |
| 8 | 5 % | +0.95 | 19 | 0.95 | A 4/3/3 · B 3/3/3 |

Days rotate (A, then B), and inside a day the set goes to the first exercise whose sets are below the first exercise's, otherwise to the first: exactly his 3/3/2 → 3/3/3 → 4/3/3. The two-set week 6 is +12.5 % for quads but the 10 % ceiling applies to the person's total weekly resistance sets, not to one muscle (12 §3.7 step 4). Full multi-muscle runs with the share filter, supersets, bonus exercises and Focus slots: 12 §5.1-5.4.

**What progresses, by goal:**

| Goal | What the person's rate moves | What else progresses | Tag |
|---|---|---|---|
| Aesthetics / hypertrophy | weekly sets per muscle | reps inside the bracket, then load; MYO on the last machine/isolation exercise | COACH-ANSWER VOL-04, VOL-05, VOL-15 |
| Fat loss | weekly sets on compounds | isolation reps step up inside 12-30 (OBSERVED FAT BURN steps; 40 only in the optional AMRAP/CrossFit style); finisher circuits add rounds and work time (OBSERVED rounds 3 → 5, work 30 → 50 s) | COACH-ANSWER VOL-11, PRG-11 |
| Strength / powerlifting | load on the main lifts by his % template (4 Tracks: 80/80/85/85/90/90 %, RPE 7 → 10; Olympic 75 → 80 → 85 → 90 % with 4 × 8 → 4 × 6 → 4 × 6 → 4 × 4) | main-lift sets per the template; accessories by the person's rate; the preference style moves reps, not weekly sets | COACH-ANSWER PER-09, VOL-12 |
| Athletic | quality first: ballistic → plyometric share, plyo stage RC1 → RC3, exercise level, Olympic intensity, VOL 1 → VOL 3 rep phases | resistance sets by the person's rate inside the athlete factors and phase limits; in-season 0 % | COACH-ANSWER ATH-01, CAT-10, PER-08, PER-11; 12 §3.4, §3.12 |
| General / weekend-warrior / bootcamp | weekly sets (bootcamp: rounds and station time) | reps, conditioning density | COACH-ANSWER VOL-05, PRG-03 |
| Fight or competition prep | same average rate, applied as 2-week steps and waves | | COACH-ANSWER PER-10 |

**His written step pattern vs his rule.** His own products step +20 to +50 % on a step week with flat weeks between, and two 8-week products average +10.4 and +16.5 %/week (section 8). Those are above his stated "10 % is way too much". The generator follows his stated rule (COACH-ANSWER UNI-05, PER-10); the observed steps stay as evidence of how the sheets were written.

### 9.7 Caps

| Cap | v1 value | Tag |
|---|---|---|
| Week-over-week increase in total weekly resistance sets | **below +10 %** (hard ceiling; +10 % itself is "way too much"); exempt: returning to pre-deload volume, block-boundary swaps that add no sets | COACH-ANSWER UNI-05; exemptions PROPOSED (12 §3.7) |
| Hand-set weekly rate (coach or client) | 0-7 % (his 3/5/7 band) | COACH-ANSWER VOL-05, UNI-05; v1 conflict 4 with 12 §3.7 |
| Weekly sets per muscle | level caps in 12 §3.3 (PROPOSED); his outer bounds "5 too little, 40 way too much" | COACH-ANSWER UNI-01; PROPOSED |
| Priority muscle | about 25-30 | COACH-ANSWER VOL-02 |
| Per muscle per session | soft 11 fractional sets, priority 14 | SCIENCE Remmert (~11), RP (8-12); values PROPOSED (12 §3.10) |
| Resistance exercises per session | "usually 7", 5-7 on average; by session length **45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9** | COACH-ANSWER VOL-08 (RIGHT: the length mapping was part of the confirmed assumption), VOL-16 |
| Field athlete, off-season | up to 10-12 exercises: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance | COACH-ANSWER VOL-08, VOL-17 (12 vs 14: §11.3) |
| Exercises per muscle group on its day | 3-4 | COACH-ANSWER VOL-07 |
| Sets per exercise | defaults: 3 compound, 2 isolation, 3 calves, **2 per slot in athletic templates**; max 4 (L1) / 5 (L2-L3), isolation 4 (PROPOSED, 12 §3.9); strength 'the work' up to 7 (OBSERVED STRENGTH-12 header); BYOP SETS menu 1-8 + 'SUPERSET W/ 👇' (OBSERVED 'MASTER EXERCISE LIBRARY'!AV8:AV16) | COACH-ANSWER VOL-16, VOL-17; OBSERVED; PROPOSED |
| Session length | athletes, bodybuilders, powerlifters ~90 min (max 120); general and weight loss 45-60; bootcamp 35-45 | COACH-ANSWER UNI-09, PRG-03 |
| Plyo contacts per session | L1 80, L2 100, L3 120 (lower ends of NSCA ranges; his own sessions run lower and that is fine) | SCIENCE NSCA; OBSERVED; using the lower ends as caps PROPOSED |
| Plyo spacing | 48-72 h between plyo sessions for the same area; older/masters 3-4 days | SCIENCE NSCA (12 §2.8, §3.13) |
| Medball weight | never over 20 lb; 8-10 lb for speed passes and rotations; slams 10-20 lb (slam ball), overhead throws 6-10 lb, sit-up throws 6-8 lb; lighter for youth and older clients; heavier balls only for specific work (heavy medball hang clean, wall balls) | COACH-ANSWER EQ-06 (RIGHT); coach chat statement (coach_answers.md) |
| Loaded jumps | 10-20 % of body weight; too heavy when jump height or speed clearly drops | COACH-ANSWER EQ-15 |

**Retired (v0):** per-session working-set caps by level (L1 15 / L2 20 / L3 22 / L4 24; athletic 24-30) → replaced by exercise counts, minutes and the time model (COACH-ANSWER VOL-08, UNI-09); the lower-body fatigue budget that charged athletic sets 0.5 each (COACH-ANSWER VOL-10); L4 values (COACH-ANSWER PRG-05); "≤ +10 %/week as INFERRED smoothing" (now his rule).

### 9.8 Plan length and deload

**The rule (COACH-ANSWER PER-01, PER-02, PER-03, PER-05, PER-07, PER-10):** 4-6-week plans are for maintenance or transition (vacation, travel, season change, moving) at about **50-70 %** of normal volume; 8-week plans "want to modify you, so you have to start hard" (first 4 weeks adapting, next 4 driving hard); 12-week plans are his preferred shape (2-4 weeks getting used to the movements, 4-6 weeks driving hard "not all the way to the top", the last weeks hardest), and a repeated 12-week cycle starts one level higher ("start at a 2 and end at an 11"); there is also a week-by-week mode and a yearly mode. Blocks last 4-6 weeks with small variable changes between them; A/B lead-lift weeks are an option for clients who want variety, not a default (PER-03). **Deload = about half the sets, same exercises, lighter load or 3+ RIR, no buy-out or finisher.** Tests are picked by checkbox at the start of a block, or none. The engine layouts, rate limits per phase, deload triggers and the cycle step are in 12 §3.12 (week splits, triggers and step size PROPOSED); periodization detail is in `06_periodization`.

**Deload dose (v1):** about **0.5 × the current week's sets** (round up, at least 1 set per exercise), same exercises and frequency, lighter or 3+ RIR; no AMRAP/MAX, MYO, supersets, buy-outs or finishers; Olympic lifts stay (same exercises; everyone in athletic training keeps them, ATH-10) at half the sets with light technique loads; plyos only RC1 landings or low-amplitude hops at about half the contacts; conditioning orange (C) only (COACH-ANSWER PER-05, ATH-10; athletic and conditioning details PROPOSED, 12 §3.12). The observed baseball deload dropped its optional Olympic piece; that stays evidence only.

**Observed deloads (evidence only; his written deloads were shallower than his stated rule):**
- Baseball 'DELOAD WEEK': same template, Part C '3 or 4' × 8, Part D 3 × 8/8, Part A 1-2 sets, no buy-out, no Olympic piece; resistance -31 %, all sets -46 %.
- AESTHETICS-12 week 7: 3 sets of '8/8/8-12' (-25 % sets). STRENGTH-12 week 7: 3 × 4 at RPE 7 (-50 % work sets). Boxer week 7: eleven rows 3 → 2 sets while three rows go 3 → 4 (I20, I35 'Hang Power Clean & Press', I46 complex) and the sprints 6 → 7 rounds (net -11 %) before the week-8 peak.
- They cut **25-50 % from the peak** and land at **0.75-1.0 × week-1 volume** (AESTHETICS-12 1.0, STRENGTH-12 0.75, baseball 0.76, boxer 0.92 of week 3). The v0 rule (0.85 × week 1) was built from these and is retired by COACH-ANSWER PER-05. Half of a peak week that is 1.3-1.5 × week 1 lands at about 0.65-0.75 × week 1, close to the deepest observed deloads.
- SCIENCE: deloads every 5.6 ± 2.3 weeks lasting 6.4 ± 1.7 days, mostly cutting sets (Rogerson, Bell et al. 2024); Delphi consensus: deloads cut sets and proximity to failure, may be planned or autoregulated (Bell et al. 2023); details 12 §2.7.

**Maintenance and plan-length SCIENCE:** 12 §2.4 (Spiering 2021, Bickel 2011, Barsuhn 2024): 50-70 % of an intermediate's volume is well above the research minimum to keep muscle in younger adults; older adults keep the high end (≥ 70 %, PROPOSED).

### 9.9 Rep-range, effort and rest selection

**Base matrix (goal × exercise class), using the coach's own menu labels; new labels in italics.**

| Exercise class | Aesthetics / hypertrophy | Strength / powerlifting | Athletic | Fat loss | General / weekend-warrior |
|---|---|---|---|---|---|
| Main bilateral compound (squat, hinge, bench, row, press) | '8 to 12 Reps' (L1 '10 to 15' / '15 Reps'); L2+ may run the pyramid *'12/10/8 -20'* (12 mid, 10 heavier, 8 heaviest, light 20) | his % template (PER-09); 'the work' 5,4,3,2,1 ladder at '1RIR'; speed work 'FAST RPE6 or about 60-70%' | VOL 1 '12-15 Reps' → VOL 2 '8-12 Reps' → VOL 3 '6-8 Reps', one per block (PER-11); pre-season *'1 to 3'* - '4 to 6' | '10 to 15' → '8 to 12' over the block | '10 to 15' |
| Machine / stable compound (leg press, pulldown, pendulum) | '15 Reps' or '10 to 15'; 'MYO SET' only if it is the last exercise | '6 to 8' at 2 RIR (accessory) | '8 to 12' | '15 Reps' | '15 Reps' |
| Unilateral compound (lunge, step-up, SL hinge, 1-arm row; alternating lifts the same) | '8 to 12' per side (*'N/N'*); heavy '4 to 6' / '6 to 8' per side only with the heavy-unilateral toggle | '8 to 12' per side at 1-2 RIR | '6 to 8' per side, or contrast (intermediate+ off-season, heavy lift ~78-85 %, no rest within the complex, ATH-12) | '8 to 12' / *'10/10'* | '10 to 15' per side |
| Big-muscle isolation (leg extension, leg curl, flies) | '15 Reps' - '20 Reps'; 'MYO SET' only as the last exercise | '8 to 12' ('3x8' survival) | '8 to 12', or MYO finisher if last | '15 Reps' → '20 Reps' (OBSERVED WK1-2), up to *'30'*; *'40'* only in the optional AMRAP/CrossFit style | '15 Reps' |
| Small-muscle isolation (curls, triceps, side and rear delts) | '15 Reps' - '20 Reps' (12-30 range); rear delts *'20 to 30'*; last set 'MAX' allowed | '8 to 12' 'ALL'; triceps '20 Reps' (TATE PRESS 3 × 20) | '10 to 15' | arms *'30'* (OBSERVED WK1-3); side raises '15' → '20'; *'40'* only in the optional style | '15 to 20' |
| Calves (3 sets every leg day) | '15 Reps' - '20 Reps', last set 'MAX'; single-leg (ramp, plate, deficit) or bilateral | '10 to 15' | '8 to 12' heavy single-leg; ankle hops count as contacts, not calf sets | '15 to 20' | '15 to 20' |
| Core (about 2 exercises, first) | '10 to 15' or *'20-60 s'* / *'Accumulate N min'* | '8 to 12' | by plane; *'20-50 s'*; 'UNBROKEN'; more rotational core where the sport needs it (VOL-17) | circuit *'30-50 s'* | '10 to 15' / time |
| Plyo (contacts per set; never muscle sets) | none (no plyo block) | 'EASY' 3 × 6 (conjugate Thursday) | RC1 receive & pause 6-8 (stick 3 s); RC2 receive then create 5-8; RC3 repeated receive/create 10-20; squirrel/ankle 20-40 | - | RC1-RC2 |
| Throws (medball ≤ 20 lb) | none; warm-up only (ATH-05) | - | 10 per side per set (sit-up throws 20); 8-10 lb for speed | - | light, 10 per side |
| Olympic | - | his % template (PER-09) | L1 and early L2 (his "beginning intermediates"): DB/KB snatch, hex-bar jump, hang pull or hang clean '6 to 8'; L2-L3 the full scope: hang and power variants '3 to 5' up to the full lifts (*'Squat Snatch'*, *'Squat Clean'*, *'Squat Clean & Jerk'*) *'1 to 3'* - '3 to 5' (ATH-10); push press before push jerk; older or injured clients never snatch (EQ-03) | - | L1 variants |

Tags for the matrix: COACH-ANSWER VOL-11, VOL-12, VOL-15, VOL-17, UNI-04, PRG-07, PER-09, PER-11, ATH-05, ATH-10, ATH-12, LIB-07 (full lifts named with "Squat"), LIB-13 (push press easier, push jerk intermediate/advanced), CAT-10/11 (plyo stages); cells without a coach answer keep their v0 OBSERVED/INFERRED source (section 4).

**Rep rules by muscle size (COACH-ANSWER VOL-11, RIGHT):** small muscles **12-30** (20s, 'MAX', 'MYO SET'); big muscles **5-15**, "a mix" (bilateral slot heavier, unilateral and machine moderate, isolation lighter). The observed habit of 15-20 on big-muscle isolation (leg extensions, leg curls) fits inside "a mix". SCIENCE: similar hypertrophy from about 5 to 30+ reps when sets are close to failure (Schoenfeld et al. 2021); RP splits weekly sets about 25 % heavy (5-10), 50 % moderate (10-20), 25 % light (20-30).

**40-rep sets (COACH-ANSWER VOL-11):** "I'm not really a big fan of 40 reps ... it's not necessarily more fat-burning ... it's optional. It can be put together into different styles of workouts, like maybe an AMRAP." → never a default; available only when the client or coach picks an AMRAP/CrossFit-style workout. He also said a 40-rep set "would be more for CrossFit, maybe, or for high-raw athletes"; we read "high-raw" as **HYROX** (fitness-racing) athletes, so a HYROX-style option is the natural second home for it (INFERRED from the dictation; confirm, §11.3 item 8). The OBSERVED FAT BURN 40s (section 4.2, 8) stay as evidence only.

**Preference style (COACH-ANSWER VOL-12, RIGHT: "It moves the rep range on the big compound lifts only ... Weekly sets stay similar and small muscles stay high-rep"):**

| Style | Big compound lifts | Weekly sets | Small muscles | Rest on the big lifts | Effort |
|---|---|---|---|---|---|
| 'volume_lighter' ("more sets of squats with less weight") | one bracket up ('10 to 15' / '15 Reps'; squat-menu rows 3-4 × 12-15) | **unchanged** | unchanged (high-rep) | 1-2 min | 1-3 RIR |
| 'balanced' | matrix default | **unchanged** | unchanged | 1-2 min (up to 3 on heavy compounds) | 1-3 RIR |
| 'heavy_powerlifting' ("heavier on the weight and fewer reps") | one bracket down ('4 to 6' / '6 to 8'); strength-menu rows (5 × 3, 5 × 4, 6 × 4) on the first lift of each day | **unchanged** | unchanged | 3-5 min | 1-2 RIR; never MAX on compounds |

v0's weekly-set factors (×1.1 for volume_lighter, ×0.85 for heavy_powerlifting) are removed.

**Heavy unilateral toggle (COACH-ANSWER UNI-04: "sometimes they use heavy low reps ... That might be something that can be optional in our algorithm. If the athlete or the coach wants to submit that").** Off by default. PROPOSED when on: the first unilateral lower lift of the day may use '4 to 6' or '6 to 8' per side at 1-2 RIR (constrained or supported variants for older clients); other unilateral lifts stay moderate-high.

**Effort (COACH-ANSWER VOL-13):** **RIR is the scale**, 1-3 RIR on every working set at all times ("leave 1 in the tank"), no planned RIR ramp; **'MAX' / 'MAX REPS' = technical failure, only on small-muscle or bodyweight work** (last set). % of 1RM and RPE stay where his templates use them (strength and Olympic, COACH-ANSWER PER-09). Speed work 'FAST RPE6 or about 60-70%'; plyos, throws and sprints at maximum intent and stopped when quality drops. Deload 3+ RIR (PER-05).

**How the client sees it (he asked to "add the explanation of RIR and kind of mix it with RPE"; text PROPOSED, needs the Spanish version too, COACH-ANSWER GEN-01).** Every working set shows its **target RIR** (his scale) with the RPE beside it:

| Target RIR (reps left in the tank) | RPE | Plain words |
|---|---|---|
| 3 | 7 | hard; 3 more clean reps were possible |
| 2 | 8 | very hard; 2 more clean reps |
| 1 | 9 | "leave 1 in the tank": only 1 more clean rep |
| 0 ('MAX') | 10 | technical failure: no more clean reps (small-muscle or bodyweight last sets only, VOL-13) |

**Logging EFFORT against the target (PROPOSED - PENDING COACH APPROVAL).** The client keeps his EFFORT menu, but rates the set **against the target RIR it was given**, not as a raw RPE:

| EFFORT logged | Read as | Feedback loop (9.13; 12 §3.7) |
|---|---|---|
| '1 - Way Too Easy' ... '6 - Broke a Sweat' | finished with clearly more reps left than the target | add (at least 5 %, load or reps first) |
| '7 - That was tough' | about one rep short of the target effort | the person's rate |
| '8 - That was perfect' | landed on the target RIR (the bullseye, at 1, 2 or 3 RIR) | the person's rate |
| '9 - That was terrible' | went closer to failure than planned | hold when it is the week's median |
| "10 - I'm done" | failed, or no clean reps left while reps were still planned | that exercise -1 set next week |

Why: read as raw RPE, a client who trains exactly as told at 1 RIR ("leave 1 in the tank" = RPE 9) would log '9 - That was terrible', and the engine would hold every heavy week. Read against the target, his menu, his 1-3 RIR band (VOL-13) and the log-based adjustments he confirmed (GEN-05) agree. Tension 24; question §11.3 item 12.

SCIENCE: RPE 10 = 0 RIR, 9 = 1, 8 = 2, 7 = 3 (Zourdos et al. 2016; Helms et al. 2016); people misjudge RIR by about one rep, more so far from failure and above ~12 reps, so effort is read as a weekly trend (Halperin et al. 2022; 12 §2.6).

**Rest (COACH-ANSWER VOL-14):** hypertrophy **1-2 min** default, up to **3 min** (heavy compounds); strength **3-6 min**; athletic "as prescribed" (OBSERVED 'ALL ABOUT SQUATS' B28/E28/H28); supersets rest after the pair; "every time they do a set, they do it correctly and they do it with effort". Seconds in the JSON: hypertrophy compound 60-180 (default 60-120), isolation 60-120, strength main lift 180-360, strength accessory 120-180, Olympic 120-180, superset round 60-120. Plyo work:rest 1:5-1:10, depth jumps 5-10 s between reps and 2-3 min between sets (SCIENCE NSCA). SCIENCE: a small hypertrophy benefit from resting more than 60 s, little beyond ~90 s (Singer et al. 2024).

**Same rules at every level (COACH-ANSWER PRG-06):** the UL upper-day rise 3 × 8 → 3 × 10 → 4 × 12 by level was "probably a fill error"; the generator applies the same compound rule on upper and lower days at every level.

### 9.10 Session caps by population

| Population | Session length | Exercises | Order inside the session | Default sets | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding / powerlifting | ~90 min (max 120) | 5-7 resistance on average; 8-9 in a 75-90-min session (VOL-08) | warm-up → core block (~2) → main lift ('the work') → accessories → small muscles last (bonus exercise if more volume is needed); calves 3 sets each leg day; priority muscle first; same-pattern pairing allowed (squat + lunge) to drive one muscle harder | 3 compound / 2 isolation / 3 calves | COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09, UNI-06, ATH-11, ORD-02, ORD-04, ORD-08 |
| General fitness / weight loss | 45-60 min | 5-7 | core first; hip dominant + push and knee dominant + pull pairs; no second axial squat (or axial hinge) in the week | 3 / 2 | COACH-ANSWER UNI-09, UNI-11, ORD-06, PER-04, ATH-11 |
| Bootcamp | 35-45 min | 5-7 stations, 3-5 rounds × 30-50 s | core first; cross-pattern pairing (less soreness); hip dominant + push, knee dominant + pull | time-based | COACH-ANSWER PRG-03, UNI-06, ORD-06, ATH-11 |
| Field/court athlete, off-season | ~90 min (max 120) | up to 10-12 | core (2) → plyo/ballistic (2-4) → Olympic/power (2-3) → strength → resistance accessories (3-4) | **2 per slot** | COACH-ANSWER VOL-08, VOL-16, VOL-17, ORD-03, ATH-11 |
| Athlete pre-season / in-season | shorter; in-season 2 days/week | fewer | in-season: sprints for speed athletes, strength maintenance or jumps for others | 2 | COACH-ANSWER PER-08; minutes PROPOSED |
| Weekend-warrior athletic (non-competitive adults and youth) | 60-90 min (PROPOSED) | ~10 (OBSERVED 'JUSTICE LEAGUE' Monday: 10 slots) | core (~2) → athletic block → resistance | 2 per slot (OBSERVED) | COACH-ANSWER ATH-13, VOL-16, ATH-11 |
| Optional day | separate day ideally, or added on | 5 slots: 'Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2' | - | Focus 2-3 sets each | COACH-ANSWER ORD-10, ORD-11 |

Core goes first by default and the client may move it after the plyos or after the strength work (COACH-ANSWER ATH-11). A warm-up is always written (5 min any cardio + A-drills or mobility) and never counts as volume (COACH-ANSWER ORD-08).

**Rules for every population (not only general clients).** On full-body and bootcamp days pair **hip dominant with push and knee dominant with pull** (lower posterior with upper anterior) so the work does not bleed over (COACH-ANSWER UNI-11, ORD-06; the Bootcamp Option 1 Tue/Fri wiring was a mistake). **No second axial squat in a week**: squat one day, leg press or belt squat the other ("I don't want to always load the lower back and the spine twice per week"). Deadlifts "load it ... as well", so the hinge follows the same rule: one axial hinge a week, the other hinge exposure non-axial (`05_session_architecture` rule 18; this reading INFERRED; whether squat and deadlift should share one spinal-loading day is §11.3 item 13). A client already sore from axial loading moves to the belt squat (COACH-ANSWER PER-04, EQ-11). The full session rules live in `05_session_architecture`; they matter here because they limit which exercise a new set may go to (12 §3.9 step 6). **Pairing by goal** (COACH-ANSWER UNI-06): same pattern (squat + lunge) for aesthetics and high-level clients who need more stimulus on one muscle; cross pattern for bootcamp and general clients, so they are less sore and can train more often.

**What fits in the time (12 §3.10, PROPOSED time model):** 45 min ≈ 13-14 working sets, 60 ≈ 19-20 (matches the OBSERVED ~20-set day: AESTHETICS Day 1, 7 exercises, 19 sets), 75 ≈ 25-26, 90 ≈ 31-32. A unilateral set costs 1.5 × a bilateral set (COACH-ANSWER UNI-09 "has to be accounted for"); supersets add 25-35 %.

**Supersets (COACH-ANSWER ORD-05, PARTLY): a fatigue and density tool**, used when time is short, for advanced clients who need more stimulus, for off-season athletes' VO2 max and mitochondrial work, and for beginners who do not fatigue on their own ("a tool to use to fatigue the heart more and compress the time"). The superset pairs follow the pairing rule (lower posterior with upper anterior, knee dominant with pull).

**Retired (v0):** the minutes-by-level table (30-90 min × L1-L4); its minute rows were INFERRED and the coach gave lengths by population instead (COACH-ANSWER UNI-09).

### 9.11 Sport profiles: the athletic dial

**The coach's rules:**
- **Plyo vs ballistic is set by the sport's ground-contact time:** "the more time on the ground ... like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics" (COACH-ANSWER ATH-01). Basketball "a good mix"; baseball "doesn't need a lot of plyos. They need more ballistics and rotational forces ... Sprinting is going to be there" (ATH-01).
- **Sport ranking for jump volume (COACH-ANSWER ATH-02, RIGHT):** basketball ≈ volleyball > sprinters > football skill positions > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf.
- **Programs start more ballistic and become more plyometric**; plyo method stages receive & pause → receive then create → repeated receive/create; unilateral plyos are harder than bilateral (COACH-ANSWER CAT-10, CAT-11).
- **Everyone in athletic training gets Olympic lifts**: beginners DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate+ the full lifts (COACH-ANSWER ATH-10). Youth may do some Olympic lifts from the floor (ATH-09).
- **Resistance emphasis:** more strength/size for football linemen, wrestlers, rugby, heavyweight fighters, throwers; more speed/power for sprinters, basketball, skill positions, volleyball (COACH-ANSWER ATH-03). Bilateral:unilateral share: his rules in §9.3 (field/COD athletes 80-90 % unilateral, in-season bilateral minimal, contralateral into the hip for COD athletes, ipsilateral out of the hip for acceleration); numbers by profile in 12 §3.11 (COACH-ANSWER UNI-02, UNI-10, CAT-13).
- **Medball throws:** high for baseball, boxing, MMA, tennis and golf (rotational), moderate for basketball and football, none for aesthetics/bodybuilders except warm-up (COACH-ANSWER ATH-05); medballs ≤ 20 lb (EQ-06).
- **Change of direction** drills (the football route names, tiered by turn angle) are for every athlete (COACH-ANSWER ATH-06).
- **Boxers/strikers:** reduce pressing and arm volume when punching volume is high, never cut it out (COACH-ANSWER ATH-04). **Pitchers:** less overhead pressing, more arm care, rotational throws kept light (ATH-08). **Older adults:** few plyos unless they ask (ATH-09).
- **Seasons:** off-season most volume (strength + plyos); pre-season more speed/power, less volume; in-season 2 days/week, low volume, sprints for speed athletes and strength maintenance or jumps for others; post-season recovery (COACH-ANSWER PER-08).

**Weekly targets at L2 (PROPOSED - PENDING COACH APPROVAL).** He gave the rule and the ranking but no numbers (ATH-01). Plyo contacts are fast-SSC contacts (short ground contact) at the **end** of an off-season block; the block starts at about 30-40 % of that (RC1 landings, more ballistic), as in 12's tennis example (40 → 140 contacts/week, 12 §5.3). Ranges follow his ranking, stay inside the NSCA per-session caps (9.7) over 2-3 plyo days, and scale L1 × 0.7, L3 × 1.2. Plyo share (start → end of block) is 12 §3.13. In-season: about half (PROPOSED).

| ATH-02 rank | Sport profile | Plyo share (12 §3.13) | Plyo contacts/week, block end | Throws/week | Cuts/week | Sprint / buy-out | Olympic sets/week | Resistance emphasis |
|---|---|---|---|---|---|---|---|---|
| 1 | Basketball / volleyball | 45 → 60 % | 180-240 | 60-120 | 60-100 | accelerations 6-10 × 10-20 m, 2×/wk | 6-8 | legs high, upper moderate; COD → unilateral 80-90 % |
| 2 | Sprinters / jumpers | 60 → 75 % | 160-220 | 30-60 | 0-20 | speed sessions: squirrel jumps → MACH drills / acceleration starts → max velocity (OBSERVED Sheet23 order, LIB-21) | 6-8 | ipsilateral step-ups for acceleration (CAT-13) |
| 3 | Football skill positions | 40 → 55 % | 140-180 | 64-120 | 48-80 (OBSERVED BYOP 48-64) | 3-5 bouts 10-30 s | 8 (OBSERVED 4 slots × 2) | legs high, upper low-moderate |
| 4 | Soccer | 40 → 55 % | 130-170 | 64-100 | 48-80 | 3-5 bouts 10-30 s | 6-8 | legs high, upper low |
| 5 | MMA | 30 → 45 % | 110-150 | 200-400 rotational | 20-40 lateral | 20/40 sprints 5-8 rounds + lactate clearance | 6-9 | legs moderate-high, upper moderate |
| 6 | Tennis / racket | 30 → 55 % | 100-140 | 120-200 rotational | 60-100 lateral | short repeated sprints (PROPOSED) | 6-9 | unilateral 80-90 %, contralateral loading, frontal-plane work (UNI-12) |
| 7 | Baseball / softball | 15 → 30 % | 60-100 | 150-250 rotational, R/L pairs | 10-30 (base running) | 3-5 buy-outs 10-39 s ('SPEED POWER', OBSERVED) | 6-16 every block (OBSERVED optional piece 16/wk pre-season) | glutes/hams high, chest low, DB pressing; pitchers less overhead |
| 8 | Hockey | 30 → 45 % | 55-90 | 80-150 | 40-60 | 3-5 bouts | 6-8 | legs high |
| - | Football linemen / strength-type (ATH-03) | 25 → 35 % | 50-80 | 60-100 | 20-40 | short bouts | 8-9 | resistance high, bilateral-leaning |
| 9 | Wrestling / BJJ | 25 → 35 % | 45-80 | 100-200 | 20-40 | 20/40 rounds | 6-9 | resistance high |
| 10 | Boxing / karate / kickboxing | 20 → 35 % | 40-70 high-amplitude (jump rope and ankle bouncing are conditioning, not counted) | 190-380 rotational (OBSERVED boxer) | 0-20 | 20/40 sprints 5 → 8 rounds (OBSERVED) | 6-9 (pulls, hang clean & press) | legs high; pressing/arms × 0.5-0.7 in high-punching weeks |
| 11 | Golf | 10 → 20 % | 0-30 | 100-160 rotational | 0 | - | 2-4 | rotational core, hips |
| - | CrossFit | (HYBRID, OBSERVED) | 36-80 | 0-60 | 0 | per macro level | 6-24 by level | balanced |
| - | Weekend-warrior athletic | 30 → 45 % | 60-100 | 40-80 | 20-40 | 3-5 bouts | 4-8 (L1 variants) | balanced, cross-pattern |
| - | Older adults (60+) | 0-10 %, only if asked | 0-30 low-amplitude; never depth jumps (EQ-03) | light | 0 | - | only if asked: DB/KB cleans, hang pulls, hex-bar jumps; never snatch variants (EQ-03) | constrained machines |
| - | Aesthetics / bodybuilding / fat loss / general | no plyo block (A-drills primer 2-4 × 8-12 per leg on lower days, OBSERVED UL/PPL, warm-up) | 0 | 0 (medball warm-up only) | 0 | conditioning only | 0 | per goal |

What changed from v0: v0 put baseball (120-180 high-intensity contacts) above MMA (80-140), against his ranking; baseball's Olympic work was "optional, pre-season only", against ATH-10; boxing pressing was "near zero after base", against ATH-04; tennis and golf had no row. OBSERVED anchors are unchanged (section 6): baseball's 116-324 lower-body jump contacts per week are mostly ballistic or jump-limited items under the ATH-01 rule.

**Plyo progression inside a block (COACH-ANSWER CAT-10, CAT-11; week split PROPOSED in 12 §3.13):** weeks 1-2 RC1 receive & pause (stick-the-landing, 3 s holds); weeks 3-5 RC2 receive then create (stick then jump or hop); weeks 6+ RC3 repeated receive/create (hops, rebounds) for sports that need them, low-amplitude reactive work for long-ground-time sports. Bilateral before unilateral inside each stage; unloaded before loaded (loaded jumps 10-20 % of body weight, EQ-15); box and hurdle heights low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12+ in advanced (EQ-16). **No reverse-banded or banded jumps** (COACH-ANSWER EQ-01, EQ-12).

**Athletic sets and muscle volume:** athletic sets never count toward muscle sets (COACH-ANSWER VOL-10). Ankle hops in a 'calfs' slot count as contacts (OBSERVED: 16 of the 42 calf-labelled slots in 'BASEBALL', about 40 %, hold ankle hops); calves still get their 3 resistance sets each leg day (COACH-ANSWER VOL-17).

### 9.12 Conditioning rules

| Population | Aerobic sessions/week | Content | Tag |
|---|---|---|---|
| General fitness, fat loss | **3** | one of each colour (Blue A, Green B, Orange C) per week, as the cheat sheet says | COACH-ANSWER ATH-07; OBSERVED cheat sheet A5 |
| Aesthetics / bodybuilders | **4** + long walks after workouts | colours for the 4th session PROPOSED: C, B, A + a second C (only 3 colours exist; §11.3) | COACH-ANSWER ATH-07 |
| Athletes, in-season | **2** | plus speed work: sprints for speed athletes (PER-08) | COACH-ANSWER ATH-07, PER-08 |
| Athletes, off/pre-season | PROPOSED 2-3 + sprint buy-outs; off-season VO2 max / mitochondrial work also through supersets (ORD-05) | baseball and boxing OBSERVED as anchors (section 7.2) | PROPOSED |
| Strength / powerlifting | PROPOSED 2 (C) | - | PROPOSED |
| Fighters | the daily opening cardio is a real aerobic block (Orange/easy) | OBSERVED boxer | COACH-ANSWER ORD-09 |
| Fat-loss circuits | finisher after lifting, not a separate session; rounds 3 → 5, work 30 → 50 s (OBSERVED) | - | COACH-ANSWER PRG-11 |
| Bootcamp | the circuit is the session (9.10) | - | COACH-ANSWER PRG-03 |
| Endurance event | Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' used as is, half marathon only | - | COACH-ANSWER PRG-12 |

- **Equipment and tracking (COACH-ANSWER EQ-14):** the Blue/Green/Orange work runs on any tool (run, bike, rower, ski erg); track by calories, time or distance ("I wouldn't completely throw away distance"); "doing the block is the important part, and being able to track it and see any changes week to week".
- **Level unlock** (OBSERVED 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE') stays the PROPOSED default; with L4 retired, lactate clearance is unlocked at L3 for competitors. How it combines with 3-4 sessions/week and "never the same colour twice" is a new question (§11.3).
- **Progression** (OBSERVED in the level grid): beginner → intermediate adds volume/density at moderate pace (green 5 → 7 sets; orange ~20-24 → ~30-33 min); intermediate → advanced raises pace (FAST/FASTEST/SPRINT) and drops volume ('4-6', '3-5', '2-4' sets). Running warm-up before every run (OBSERVED cheat sheet 'RUNNING WARMUP').
- **Placement:** steady cardio ≤ 40 min (OBSERVED 'max 40 min of steady'), on non-lifting days or after lifting; long walks after workouts for aesthetics clients (ATH-07). SCIENCE: interference with strength and hypertrophy grows with endurance frequency and duration (Wilson et al. 2012).

### 9.13 Feedback loop (uses the BYOP logbook columns)

The rate is one number for the person each week, picked from the logs (12 §3.7); muscle- and exercise-level gates can only lower it. The coach confirmed adjusting from EFFORT and HOW IT FELT (COACH-ANSWER GEN-05, RIGHT).

| Logged | Next week | Tag |
|---|---|---|
| Median EFFORT ≤ 6 ('6 - Broke a Sweat' or easier) | add: at least 5 %, raise load or reps first | COACH-ANSWER GEN-05 |
| EFFORT 7-8 ('That was tough' / 'That was perfect') | keep load; take the person's rate | COACH-ANSWER GEN-05; 12 §3.7 |
| Median EFFORT ≥ 9, or "10 - I'm done" on 2+ exercises | hold (0 %) for the week | COACH-ANSWER GEN-05 |
| "10 - I'm done" on one exercise | that exercise -1 set next week | COACH-ANSWER GEN-05 |
| 'Felt the RIGHT muscles' | keep the exercise | - |
| 'Felt the WRONG muscle' | change one small variable in the same category; volume unchanged | COACH-ANSWER GEN-05, PER-02 |
| 'Felt a PAIN' | pain steps (9.5) | COACH-ANSWER VOL-03, UNI-08 |
| "Couldn't do it" | regress one exercise level or assisted version | COACH-ANSWER GEN-05 |
| Two holds in a row, or the other triggers in 12 §3.12 | deload next week (about half the sets) | COACH-ANSWER PER-05; triggers PROPOSED |
| 'WEIGHT USED or SCORE' | performance trend for the readiness score; add a separate notes field (the coach wrote cues such as 'LATERAL', 'SINGLE ARM', 'OUCH' in it, OBSERVED) | PROPOSED |

**Tracking or not (COACH-ANSWER GEN-03 vs GEN-05).** He confirmed adjusting from logs (GEN-05) but also said "I don't think that they should be tracking it from us. They should be tracking it themselves". 12 §3.14 proposes two output modes: a **static** plan computed up front with the intake-based rate (no tracking needed), and an optional **adaptive** plan with a 30-second weekly check-in (required for week-by-week mode). PENDING COACH APPROVAL.

---

## 10. Tensions and flags (status after the coach's answers)

| # | Tension (v0) | Status in v1 |
|---|---|---|
| 1 | '(1 RIR) *RPE8+' pairs an exact RIR with a looser RPE floor; EFFORT '8 - That was perfect' and '1-3 RIR aka RPE 7+' point to 2 RIR | **Resolved** (COACH-ANSWER VOL-13): RIR is his scale, 1-3 RIR on every working set; RPE is shown only as an explanation (9.9). |
| 2 | 'never work up to failure' vs 'MAX REPS'/'ALL' on isolation | **Resolved** (VOL-13): MAX = technical failure, only on small-muscle or bodyweight work. |
| 3 | Olympic percentages exceed Prilepin's chart (4 × 8 @75 % ... 4 × 4 @90 %); STRENGTH-12 6 × 3 @90 % and 7 × 2 @RPE 10 too | **Partly open.** COACH-ANSWER PER-09 confirmed the template ("That's essentially it. I just want to make sure it's correct") but not what the % is of. PROPOSED: keep the template, read the % as of the specific lift's max (e.g. hang clean, not full clean), and stop a set when bar speed or technique drops (Olympic sets stay ≥ 2 RIR). Pending. |
| 4 | Upper-body volume below the 10-set threshold in most templates and all athletic programs | **Resolved by rule.** Athletes are low on purpose (UNI-02); aesthetics clients now start at 15 per big muscle (L2, VOL-01) and the imbalance is balanced unless a bias is chosen (VOL-18). |
| 5 | Glutes credited above RP's MRV (26-35) in peak weeks | **Retired.** Artefact of the v0 map; under the coach count no view passes 15 (section 3.6). New concern: glutes under-served without direct work (3.5 point 2; glute values PROPOSED in 12 §7). |
| 6 | Calves, rear delts and abs near zero | **Resolved** (VOL-17): not intended; calves 3 sets each leg day, rear delts own sets, ~2 core exercises. |
| 7 | 40-rep isolation sets (fat burn) outside his 5-30 | **Resolved** (VOL-11): not a default; optional AMRAP/CrossFit style only. |
| 8 | 3/5/7 % never written; observed progression is whole-set steps; 8-week products ramp 10-16 %/week | **Resolved** (VOL-04, VOL-05, UNI-05, PER-10): person-based rate on weekly sets, 10 % ceiling, smooth for hypertrophy/general, steps for fight/competition prep; his faster 8-week ramps stay as evidence only. |
| 9 | 2 aerobic slots in templates vs 3 in the cheat sheet | **Resolved** (ATH-07): 3 general/fat loss, 2 athletes in season, 4 aesthetics + walks. New: colour rotation at 4 sessions (§11.3). |
| 10 | UL upper-day reps rise with level | **Resolved** (PRG-06): fill error; same rep rules at every level. |
| 11 | Plyo contacts per session at or below NSCA beginner ranges | **Partly resolved** (ATH-01, ATH-02): rule and ranking given, numbers PROPOSED (9.11), still inside NSCA caps. |
| 12 | "Boxers need fewer plyos" not visible as fewer contacts; it shows as lower amplitude | **Resolved** (ATH-01): more ground time → more ballistics, fewer plyos; jump rope and ankle bouncing are conditioning. |
| 13 | RP landmarks are direct sets; the coach's totals are fractional | **Updated** (VOL-09): his count is helpers 0.25; RP and Pelland comparisons in 12 §2.2-2.3; both counts stored. |
| 14 | Pat Davidson: no dosing numbers found | **Updated** (CAT-04, CAT-10): his Davidson link is the zones (rotation biases; level by load position), which shape exercise level, not dose; zones do not apply to plyos. Still no Davidson dosing numbers. |
| 15 | Smoothing vs steps | **Resolved** (PER-10). |
| 16 | Written deloads (0.75-1.0 × week 1) shallower than textbook deloads | **Resolved** (PER-05): about half the sets. The written shapes stay as evidence; which week "half" is taken from is in §11.3. |
| 17 | **New:** GEN-05 (adjust from logs, RIGHT) vs GEN-03 ("they should be tracking it themselves") | Two output modes PROPOSED (9.13; 12 §3.14). |
| 18 | **New:** athletic templates 2 sets per slot (VOL-16) vs 12's 3 / 2 / 3 defaults everywhere | Resolved here for the coach (v1 section, conflict 1). |
| 19 | **New:** max ~12 exercises (VOL-08) vs "12 to 14" (VOL-17) for off-season field athletes | 12 used as the cap; asked in §11.3. |
| 20 | **New:** no planned RIR ramp (VOL-13) vs 12's "RIR toward 1" in the last weeks | Coach wins: inside 1-3 RIR (v1 section, conflict 2). |
| 21 | **New:** observed boxer weeks 3-8 cut chest work to 0 vs "don't completely cut it" (ATH-04) | Generator reduces (× 0.5-0.7), never zero. |
| 22 | **New:** observed baseball in-season block has no Olympic lifts vs "everyone gets Olympic lifts" (ATH-10) with in-season maintenance (PER-08) | PROPOSED: in-season Olympic or jump maintenance at low volume (2-4 sets/week) for non-speed athletes; speed athletes get sprints. Pending. |
| 23 | **New:** the cardio list's '21.6 mile run' is "a marathon" to him (LIB-18), but a marathon is 26.2 miles; "don't know when/where we need that" | Flagged; not used by any rule. |
| 24 | **New:** the EFFORT menu read as raw RPE ('8 - That was perfect' = RPE 8, '9 - That was terrible' = RPE 9) vs his 1-3 RIR band and "leave 1 in the tank" (= RPE 9) (VOL-13). A client training at 1 RIR as told would log 9 and the GEN-05 loop would hold every week. | PROPOSED: log EFFORT against each set's planned RIR (9.9); asked in §11.3 item 12. |
| 25 | **New (v1 verification):** 12 §3.7 lets a coach or client hand-set the rate up to 10 % vs "10 % ... That's way too much" (UNI-05) | Coach wins here: hand-set 0-7 %, weekly total below +10 % (v1 section, conflict 4). |

---

## 11. Open questions for the coach

### 11.1 The v0 questions and what his answers settled

| # | v0 question (short) | Status | Answer |
|---|---|---|---|
| 1 | 3 / 5 / 7 %: by muscle size? of what? | Answered | % of weekly sets per muscle (VOL-04); chosen by the person, not the muscle (VOL-05, UNI-05) |
| 2 | 15-20 sets: peak week or week 1? | Answered | Starting volume by level: 10-12 / 15-20 / 20+ (VOL-01); 20-25 = growth (UNI-01) |
| 3 | Do athletic sets count toward muscles? Ankle hops as calf sets? | Answered | No (VOL-10); ankle hops are contacts |
| 4 | 2 sets/slot athletic, 3 compound / 2 isolation physique? | Answered | Yes (VOL-16) |
| 5 | RIR target 1 or 2? | Answered | 1-3 RIR at all times, RIR primary, RPE explained (VOL-13) |
| 6 | 'MAX' / 'ALL' true failure, isolation only? | Answered | Technical failure, small-muscle or bodyweight only (VOL-13) |
| 7 | Baseball Olympic %: of what max? | Partly | Template confirmed (PER-09); % basis open (§11.2) |
| 8 | RIR / % on the last set or every set? | Open | §11.2 |
| 9 | Contacts per week by sport; amplitude or count? | Partly | Rule by ground-contact time and ranking (ATH-01, ATH-02); numbers PROPOSED (9.11) |
| 10 | Aerobic 2 or 3; colours by level? | Partly | 3 / 2 / 4 + walks (ATH-07); colour unlock open |
| 11 | 6-week plans? | Answered | 4-6 weeks = maintenance/transition at 50-70 % (PER-01) |
| 12 | Deload dose; planned or triggered? | Answered / PROPOSED | About half the sets, lighter (PER-05); triggers PROPOSED (12 §3.12) |
| 13 | Priority muscles: how many, how much, both Focus slots? | Answered | 1-2, +4-6, cap ~25-30 (VOL-02); both Focus slots may hit one muscle (ORD-11) |
| 14 | Pain: swap first, cut if it repeats? | Answered | Keep sets ideally, adjust (UNI-08); -30-50 %, machines, drop (VOL-03) |
| 15 | Minimum sets for calves, rear delts, abs? | Answered | Calves 3 per leg day, rear delts own sets, ~2 core exercises (VOL-17) |
| 16 | 40 reps a fat-loss rule? | Answered | No; optional AMRAP/CrossFit style (VOL-11) |
| 17 | NOVICE below NEWBY? L1-L4? | Answered | Same thing; L1-L3 (PRG-05) |
| 18 | Athlete volume down with level? | Partly | "Depends on whatever is needed" (PRG-04); 12 uses phase factors |
| 19 | Rest 1-2 or 2-3 min? Supersets, complexes, plyos? | Answered | 1-2 min, up to 3; supersets after the pair; athletic as prescribed (VOL-14) |
| 20 | Typical session lengths? | Answered | ~1.5 h (max 2 h) athletes/bodybuilders/powerlifters; 45-60 min general (UNI-09) |
| 21 | Keep whole-set steps or smooth 3/5/7 %? | Answered | Smooth for hypertrophy/general, steps/waves for fight/competition (PER-10); 10 %/week too much (UNI-05) |

### 11.2 Still open from v0 (or PROPOSED in this file)

1. What max are the Olympic and STRENGTH-12 percentages taken from (full-lift 1RM, the hang variant's max, or a training max)? Is the PROPOSED reading in tension 3 right?
2. In STRENGTH-12 and the squat strength menu, does the RIR or % apply to every set or only the last set?
3. The sport-dial numbers in 9.11 (plyo contacts, throws, cuts, Olympic sets per week by sport) - right order of magnitude?
4. Aerobic colours by level ('LVL 1 = C' ... 'LVL 3 = C, B, A'): keep the unlock?
5. The V-taper bias mechanism (9.4), the heavy-unilateral toggle (9.9), the pain rep-bracket shift (9.5), in-season Olympic maintenance (tension 22).
6. LIB-10 (KB face pulls in vertical pull: count them as rear-delt work?) and LIB-12 (bench push-ups: hands or feet on the bench) were not answered.
7. Everything listed in 12 §7.

### 11.3 New questions raised by the answers

1. **Exercise cap for off-season field athletes:** VOL-08 says "max maybe 12 different exercises"; VOL-17 lists 2 core + 2-4 plyo + 2-3 Olympic + 3-4 resistance (up to 13) and says "12 to 14 sets". Is the cap 12 or 14 exercises, and did "sets" mean exercises there?
2. **3-4 exercises per muscle group per day (VOL-07) on full-body days:** with 5-7 exercises per session (VOL-08), should a full-body day give each muscle 1-2 exercises, or should full-body days go past 7?
3. **Aerobic colours at 4 sessions:** aesthetics clients get 4 sessions (ATH-07) but there are only 3 colours and the cheat sheet says never the same colour twice in a week. Which colour repeats? And does 'LVL 1 = C only' still apply when a beginner fat-loss client needs 3 sessions?
4. **Long walks after workouts:** how long, and do they count as aerobic sessions or come on top?
5. **Aerobic sessions for athletes off-season / pre-season and for strength/powerlifting clients** (ATH-07 named only in-season athletes): how many?
6. **Deload "about half the sets":** half of the current (peak) week or half of week 1? His written deloads land at 0.75-1.0 × week 1, which is closer to half of a peak week.
7. **Heavy unilateral option (UNI-04):** which reps (e.g. 4-6 per side) and which lifts?
8. **40-rep sets (VOL-11):** only inside AMRAP/CrossFit-style workouts, or also as an optional fat-loss finisher? And did "high-raw athletes" mean HYROX athletes (our reading of the dictation), so a HYROX-style option should carry them too?
9. **Rotational core (VOL-17: "some athletes need a lot more rotational core"):** which sports get more than about 2 core exercises, and do extra core exercises count inside the 10-12 exercise cap?
10. **V-taper and other biases (VOL-18):** which muscles define the V-taper bias (side delts and lats up, chest held?), and should other biases exist (glutes, arms)?
11. **'21.6 mile run' (LIB-18):** correct it to the marathon distance (26.2 miles), keep it as written, or drop it?
12. **EFFORT menu vs RIR (VOL-13, GEN-05):** "leave 1 in the tank" is RPE 9, but your EFFORT menu calls 9 'That was terrible', and the tool holds volume when a week's median is 9. Should clients rate EFFORT against the RIR each set asks for ('8 - That was perfect' = "I hit the RIR you gave me"), as PROPOSED in 9.9, or should the log ask for RIR directly?
13. **Spinal loading (PER-04):** you squat once a week and said deadlifts load the spine too. Should the week have one axial squat and one axial deadlift on different days (our current reading, as in `05_session_architecture`), or should the squat and the deadlift share one day so the spine is loaded on one day only?
14. **Thrusters (LIB-14 vs VOL-09):** you confirmed thrusters = 1.0 quads + 0.5 shoulders, and later set helpers to 0.25. Keep 0.5 shoulders for thrusters as an exception (like dips 0.5 / 0.5), or use 0.25?

---

## 12. Sources

**Coach's answers (COACH-ANSWER).** `coach_answers_full.md` (138 of 140 questions answered, collected 2026-10-08; question IDs CAT, UNI, VOL, PER, ATH, ORD, EQ, GEN, LIB, PRG, FIX); `coach_answers.md` (his earlier chat statements).

**Volume engine (authoritative for weekly sets per muscle).** `12_volume_algorithm_v1.md` and `12_volume_algorithm_v1.json` (same folder), including its research section (§2) and sources (§8: Pelland 2026 efficiency tiers, Aube 2022, Barbalho 2020, Enes 2023/2024, Scarpelli 2022, Barsuhn 2024, Bickel 2011, Spiering 2021, Bell 2023, Rogerson 2024, Coleman 2024, Borde 2015, Fragala 2019, Liao 2022, Halperin 2022, Hickmott 2022, Gabbett 2016 / Impellizzeri 2021, Nielsen 2013, Helms 2016, Gentil 2015, Kassiano 2022, fast/slow SSC sources).

**Coach's sheets (OBSERVED).** Decode files: `analysis/programs/prog_byop_aesthetics.md/.volume.json`, `prog_byop_athletic.*`, `prog_byop_ppl_bootcamp.*`, `prog_mm_gym.*`, `prog_mm_athletic_boxing.*`, `prog_mm_baseball.*`, `prog_mm_crossfit_tracks.*`; `analysis/library/L4_dosing_vocab.json`, `L4_notes.md`; `analysis/reference/specialty_notes.md`, `sheet23_notes.md`; dumps `MASTER_MODEL/08_AEROBIC_CAPACITY_CHEAT_SHEET.txt`, `10_ALL_ABOUT_SQUATS.txt`, `14_NOT_DONE_ALL_ABOUT_BALLISTICS.txt`. Computation scripts (scratchpad): v0 `build_volume_compare.py`, `rep_dist.py`, `worked_example.py`; v1 `v1_03/recount.py` (coach-count recompute of all 61 views), `v1_03/tables.py` / `tables2.py` (section 3 tables), `v1_03/bank_example.py` (9.6 illustration), `v1_03/update_json.py` (JSON v1).

**SCIENCE.**
- RP Strength muscle guides (current versions, fetched 2026-10-07): [Chest](https://rpstrength.com/chest-training-tips-hypertrophy/), [Quads](https://rpstrength.com/quad-training-tips-hypertrophy/), [Hamstrings](https://rpstrength.com/expert-advice/hamstring-size-training-tips), [Glutes](https://rpstrength.com/glute-training-tips-hypertrophy/), [Biceps](https://rpstrength.com/bicep-training-tips-hypertrophy/), [Triceps](https://rpstrength.com/triceps-hypertrophy-training-tips/), [Front delts](https://rpstrength.com/front-delt-training-tips-hypertrophy/), [Rear delts](https://rpstrength.com/expert-advice/rear-delt-size-training-tips), [Calves](https://rpstrength.com/calves-training-tips-hypertrophy), [Abs](https://rpstrength.com/ab-training/), [Back](https://rpstrength.com/back-training-tips-hypertrophy/), [Volume landmarks](https://rpstrength.com/training-volume-landmarks-muscle-growth/), [In defense of set increases within the mesocycle](https://rpstrength.com/expert-advice/in-defense-of-set-increases-within-the-hypertrophy-mesocycle). Side-delt figures via a secondary summary ([mrpotato substack](https://mrpotato.substack.com/p/build-big-shoulders)).
- Schoenfeld, Ogborn, Krieger (2017) J Sports Sci 35(11): dose-response of weekly sets ([PDF](https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf)).
- Schoenfeld et al. (2019) MSSE 51(1): 1/3/5 sets per exercise ([PubMed](https://pubmed.ncbi.nlm.nih.gov/30153194/)).
- Baz-Valle et al. (2022) J Hum Kinet: 12-20 weekly sets ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/)).
- Pelland, Remmert, Robinson, Hinson, Zourdos (2026) Sports Medicine 56(2): weekly volume and frequency meta-regressions ([preprint](https://sportrxiv.org/index.php/server/preprint/view/460)); Remmert et al. per-session preprint ([SportRxiv 537](https://sportrxiv.org/index.php/server/preprint/view/537)).
- Ralston et al. (2017) Sports Med: weekly sets and strength ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5684266/)).
- Schoenfeld et al. (2019) frequency meta-analysis ([summary](https://ro.ecu.edu.au/ecuworkspost2013/5665)).
- Schoenfeld, Grgic, Van Every, Plotkin (2021) Sports 9(2): repetition continuum ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7927075/)).
- Zourdos et al. (2016) JSCR: RIR-based RPE scale ([record](https://openrepository.aut.ac.nz/items/efef3b25-6701-4fb5-bb82-55fcd2a26027/full)).
- Robinson et al. (2023) proximity to failure dose-response; Refalo et al. (2024) failure vs RIR ([summary](https://biolayne.com/reps/issue-32/the-failure-factor-the-relationship-between-proximity-to-failure-and-strength-and-hypertrophy/)).
- Singer et al. (2024) Front Sports Act Living: inter-set rest ([PubMed](https://pubmed.ncbi.nlm.nih.gov/39205815/)).
- Rogerson, Bell et al. (2024) Sports Med Open: deloading practices ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10948666/)); Bell et al. (2023) deload Delphi consensus ([SHURA](https://shura.shu.ac.uk/32417/)).
- Spiering et al. (2021) JSCR: minimal maintenance dose ([PubMed](https://pubmed.ncbi.nlm.nih.gov/33629972/)).
- Prilepin's chart ([70sBig](https://70sbig.com/blog/2012/05/prilepins-chart/), [Torokhtiy](https://torokhtiy.com/blogs/guides/prilepins-chart)).
- NSCA plyometric volume guidance as summarised in a SUNY Cortland lecture ([page](https://web.cortland.edu/buckenmeyerp/plyometrics.htm)) and [PT Pioneer CSCS chapter 18](https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/).
- de Villarreal et al. (2009) JSCR 23(2): plyometric variables ([PubMed](https://pubmed.ncbi.nlm.nih.gov/19197203/)).
- Ramirez-Campillo et al. (2023) Sports: plyometric training in combat sports ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9965890/)); youth basketball plyometric volume ([record](https://zaguan.unizar.es/record/144751)).
- Grgic, Schoenfeld, Mikulic (2021) J Sport Health Sci 10(5):530-536: plyometric vs resistance training and hypertrophy ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8500805)).
- Wilson et al. (2012) JSCR: concurrent training interference ([PEDro](https://search.pedro.org.au/search-results/record-detail/34457)).
- Seiler polarised training ([Fast Talk Labs](https://www.fasttalklabs.com/pathways/polarized-training/)).
- Pat Davidson public profile and program descriptions ([Escape Fitness](https://escapefitness.com/us/discover/unlocking-your-physical-potential-insights-from-dr-pat-davidson/) - search summary only, the page blocked direct fetching; [Self Made Podcast ep. 107](https://theselfmadepodcast.buzzsprout.com/1772275/11734865); [Ganbaru Method](https://ganbarumethod.com/pages/patdavidson)); no set/rep table verifiable.

---

## Verification log

The two v0 passes below refer to the v0 section contents (e.g. the v0 9.6 size-class rates and 9.8 deload factor); those rules are now retired as listed in the v1 section at the top. The v1 entry is last.

Adversarial fact-check, 2026-10-07. Every OBSERVED claim in sections 0-9 was checked against the raw dumps (`dumps/BYOP`, `dumps/MASTER_MODEL`), the raw xlsx files (openpyxl, read-only) and the decode files in `analysis/programs/`. The SCIENCE claims were checked against the sources (RP chest and glute pages, Remmert and Pelland preprints, Ramirez-Campillo 2023, NSCA contact tables, Grgic 2021). Nothing in Google Sheets was opened or changed. A backup of the JSON before the edits is in the session scratchpad (`03_volume_rules.before_verify.json`).

**Recomputed independently (python on the raw xlsx). These match the doc:**
1. AESTHETICS Day 1: 7 exercises, 19 sets, 275 reps at rep-range midpoints.
2. 'JUSTICE LEAGUE': the 11 filled SETS cells (F3:F13) are all 2. Monday has 10 slots and 20 sets, 204-256 reps (athletic 64-88, resistance 140-168).
3. MM UL sets per session (excluding the 5-min cardio) NOV 20/24, NEWBY 30/24, INT 32/27. MM PPL push/pull/legs NOV 16/18/20, NEWBY 18/20/30, INT 20/23/32. Weekly resistance UL 76/90/102, PPL 6-day 94/116/132.
4. FAT BURN: weekly sets 60/60/64/70, reps 781/822/924/1040, compound mean reps 11.0 -> 8.9 (6-8 share 27 % -> 70 %), isolation mean 19 -> 35, circuit work 12.0 / 18.7 / 21.3 / 33.3 min (24 -> 40 station-sets).
5. Medball cheat sheet: 19 throws, 210 reps. MM athletic MID: 400 throws/week.
6. Progression averages: STRENGTH-12 +5.22 %/week, AESTHETICS-12 +4.75 %, AESTHETICS-8 +16.5 %, HYBRID +10.4 %.
7. Section 3.3 band counts reproduce exactly from `program_views` (58 = 61 views minus the two BOOT2 'A only' views and one CrossFit view). The hypertrophy-family medians in 3.2 reproduce.
8. Prilepin values, the Zourdos RIR-RPE mapping, the RP chest and glute landmarks (re-fetched), the Remmert per-session PUOS (~11 fractional / ~2 direct), the Pelland 67-study fractional-counting result and the NSCA 80-100 / 100-120 / 120-140 contacts per session are all correct.

**Corrected (claim -> problem -> fix):**
1. Conjugate STRENGTH-8 plyo contacts were "54/wk". There is one plyo line a week (Thursday 3 x 6 'EASY'), so the count is **18/wk**. Fixed in 6.1, section 0 (per-session range is now 18-77) and the JSON.
2. MM athletic sets per exercise were "Starting 2-3, Mid 1-2". The sheet has Starting {1, 2, 3, 5} (A21 = 5) and Mid {1, 2, 3, 4, '2 to 4'}. Fixed. Also noted that superset components are counted as separate sets, which is an analyst convention.
3. "Every main pattern is trained 2x/week in every 3-6 day template (OBSERVED)" was false. The '3 DAY BUILDER' has VPULL, VPUSH, UHD, leg curls and calves once a week, and the 3-day PPL variants train every pattern once a week. Fixed in 2.4 and 3.4.
4. "Only the AESTHETICS-12 week-12 legs day passes ~11 fractional sets/session" was false. The UL/PPL 'INTERMEDIATE' lower day gives glutes 13 and quads 11, and FAT BURN WK4 lower days give glutes 12. Fixed in 2.4.
5. FAT BURN isolation reps were given as "15 -> 20 -> 30 -> 40", a sequence that is not in the sheet. Observed: leg ext/curl 15 -> 20 -> 40 -> 40; arm isolation 30 -> 30 -> 30 -> 40; side raises 15 -> 15 -> 20 -> 20. The invented "25 to 30" step was removed from the 9.9 matrix. Fixed in 8, 9.6, 9.9 and the JSON.
6. Progression was presented as "+4.75 to +5.5 %/week, inside his 3-7 %". That summary left out AESTHETICS-8 (+16.5 %/week) and HYBRID (+10.4 %/week) and hid the step shape (+20 to +50 % on step weeks). Fixed in section 0, section 8, tension 8 and the JSON. Tension 15 and open question 21 were added.
7. The 9.7 cap "<= +10 %/week" was justified as "OBSERVED steps are 0-9.4 %". Only FAT BURN and baseball pre-season fit that; the coach's other step weeks are +20 to +50 %. The cap is now labelled INFERRED smoothing.
8. The deload rule "about 60 % of week-1 sets (50-70 %)" was attributed to observed deloads. Every observed deload lands at 0.75-1.0 x week 1 (AESTHETICS-12 1.0, STRENGTH-12 0.75, baseball 0.76, boxer 0.92 of wk3). The rule is now 0.85 x week 1 (range 0.75-1.0, i.e. -25 to -50 % from the peak). The worked-example deload columns were recomputed (W8 and the 12-week D values), open question 12 was rewritten and tension 16 was added. The JSON `deload` and worked examples were updated.
9. The level colours were described as "athletic and aerobic ... with the same colours" as the gym scale. The athletic and aerobic scales are green / yellow / **red** E06666; the gym 'INTERMEDIATE' is **orange** F6B26B; the aerobic ' INTERMEDIATE' is yellow (the NEWBY colour). L4 is INFERRED, and only CrossFit has 4 tiers. Fixed in 9.2 and the JSON levels.
10. UL/PPL compounds were said to go "15 -> 10 -> 8 by level". That holds only for PPL push/pull. UL lower goes 12 -> 10 -> 8, UL upper goes 8 -> 10 -> 12 and PPL legs go 8 -> 10 -> 8. Fixed in 4.3 and tension 10.
11. Baseball AMRAP share of small-muscle isolation was "35 %". The decode gives 33.9 %, so it now reads 34 % (+4 % MYO). Fixed in 5.1 and 5.3.
12. The 'Any Cardio Equipment' 5-min warm-up was listed for "UL / PPL / athletic MM". It is in the UL/PPL tabs only. Fixed in section 0 and 7.2.
13. The BYOP cardio dose examples '400m' and '20 cals' sit at library B125/B135, outside the dropdown range B7:B122, so a client cannot select them. Fixed in 7.2.
14. The athletic-tab instruction rows were cited as "A4/A6". They are A3/A5 (UL/PPL A4/A6). Fixed in section 0.
15. The ATHLETIC template was described as "blank". G12 'MYO SET' is pre-filled on the leg-extension slot. Fixed.
16. The glute-over-MRV weeks were said to be followed by a deload "in 3 of 4 cases". The correct count is 2 of 4 (AESTHETICS-8, baseball); the boxer week 8 and AESTHETICS-12 week 12 end at the peak. Fixed in 3.6 and tension 5.
17. The medball list was described as "always R/L pairs". It has 5 bilateral throws and 2 single-line rotational throws, and 16 extra specialty/core rows sit outside the 19-throw pass. Fixed in 6.2.
18. The plyo force-phase order was labelled OBSERVED. The labels are OBSERVED, but reading them as a progression is INFERRED; A-C sit under 'BALLISTIC PURPOSE', D under 'PLYOMETRIC PURPOSE'. Fixed in 6.1.
19. The squat hypertrophy menu was called "3 x 4-week waves" and labelled OBSERVED. The rows carry no week labels, so the waves are INFERRED. The missing athletic 'FRENCH CONTRAST' menu ('3-4' x '3/3/3/3/3' at 78 %), rule A5 and the banded/chain load cues (~50 %, ~70 %) were added to 4.1.
20. CrossFit "+1 set per level per month" depended on an unstated assumption. The macro STRENGTH levels jump (APR 1, JUNE 3, JULY 4, OCT 2, NOV 2), so "per month" is now labelled INFERRED.
21. The Olympic Prilepin tension said "every week exceeds". 4 x 6 @80 % is exactly the top edge of the 70-80 % row, and hang snatches alternate with cleans. Fixed in 4.4.
22. Session-length rows in 9.10 were marked OBSERVED. No sheet states a duration, so only the counts are OBSERVED. Labelled.
23. The 9.11 sport rows were marked "(OBSERVED ...)" although the values are inferred targets. Labelled, and the observed boxer (113-129 high; bilateral jumps excluding landings 53-69) and baseball totals were added beside the targets.
24. The 9.3 anchors misquoted boxer week 1-2 upper body ("9-12"; chest is 6 and side delts 3) and fat-loss legs. Restated from table 3.1.
25. SCIENCE: the doc said plyometrics "do not build meaningful muscle mass". The evidence is mixed: Ramirez-Campillo ES is -0.01 to -0.06 (not "0.02"), and Grgic, Schoenfeld and Mikulic 2021 found similar lower-body hypertrophy from plyometric and resistance training in untrained samples. The AP exclusion is now labelled an INFERRED convention (1.2, 6.5, JSON). Spiering 2021 is now limited to younger adults. The NSCA citation was clarified (the Cortland page cites no source).
26. Table repair: the STRENGTH-12 row in section 8 had unescaped '|' inside a cell (broke the table); replaced with '/'.
27. Other small fixes: throws range (baseball 70-290 added), aerobic 2-vs-3 exceptions (bootcamp 2, CrossFit grids), the 'BOOTCAMP - OPTION 2' title cell, the BYOP SETS menu incl. 'SUPERSET W/ 👇', the baseball 'This is NOT a sprint' note, and the MM COD statement (skater jumps are plyos, not cuts).

**Not changed (checked or spot-checked against dumps and decodes, no fault found):** section 2.1 session counts, 2.3 weekly totals (spot-checked), 3.1 normalized table (spot-checked: AES4, UL, FAT BURN rows recomputed), 4.2 rep distributions (UL/PPL/FAT BURN recomputed; baseball/boxer taken from the decode), 5.2 rest cues, 7.1 cheat-sheet values (every grid cell checked), Sheet24 half-marathon structure, the STRENGTH-12 header (% / RPE / SETS / REPS) and the boxer week-to-week ramp (80, 80, 113, 113, 117, 117, 104, 136).

### Second verification pass (2026-10-08)

A second adversarial check of the whole document against `dumps/BYOP`, `dumps/MASTER_MODEL`, the raw xlsx files (openpyxl, read-only) and the decodes in `analysis/`. Nothing in Google Sheets was opened or changed. A backup of the JSON before these edits is in the session scratchpad (`fc03b/03_volume_rules.before_verify2.json`); the recompute scripts are `fc03b/recompute5.py` and `fc03b/recheck_bands.py`.

**Recomputed independently (python on the raw xlsx and on `program_views`). These match the doc:**
1. BYOP AESTHETICS Day 1 SETS cells E3:E9 = 3, 3, 3, 3, 3, 2, 2 = 19.
2. FAT BURN weekly lifting sets 60 / 60 / 64 / 70; circuit work 12.0 / 18.7 / 21.3 / 33.3 min; WK1 isolation mean 19.0, WK4 35.0 (75 % of sets at 40).
3. AESTHETICS-12 weekly sets 96 (wk1), 128 (wk6), 148 written + 10 superset-finisher sets = 158 (wk12).
4. Progression rates: STRENGTH-12 +5.22 %/week (4 -> 7 sets over 11 weeks), AESTHETICS-12 +4.75 %, AESTHETICS-8 +16.5 %, CrossFit +26 %/level = +5.5 %/week at one level per month; boxer steps +41 / +3.5 / -11 / +31 %.
5. Medball cheat sheet: 19 throws, 210 reps; 9 'SPECIALTIES' and 7 'CORE EXTRAS' outside the pass.
6. MM athletic contacts: STARTING high-intensity 146 (48.7 per session); MID 71 high + 120 low = 191; ADVANCED 32 + 100 = 132.
7. MM UL and PPL sets per session, weekly resistance totals, all rep-bin shares in 4.2 for UL/PPL, the cheat-sheet grid, the 'ALL ABOUT SQUATS' menus, the STRENGTH-12 header rows, the CrossFit 'LVL' tables and the 2 / 2 / 3 / 4 'YES' aerobic cells.
8. Section 3.2 and 3.3 reproduce exactly from `program_views` before the fix below (58 views).

**Corrected (claim -> problem -> fix):**
1. Normalized delt credits (3.1, 3.2, 3.3, section 0, 3.5, 3.6, 9.3, tension 6). The single-bucket recompute credited every ISO_SIDE_REAR_DELT set to side delts, so the 'Reverse Flies' / 'DB Reverse Flies or Machine' sets in both push/pull/legs tabs and the AESTHETICS-12 'face pulls' / 'machine or db Reverse flies' were counted as side-delt work (AESTHETICS-12 wk12 showed side 15 / rear 10; the sheet gives side 5 / rear 20). The front raises in MM athletic STARTING and boxer weeks 3-8 were also counted as side delts. The bucket is now split by the exercise written (19 views). Hypertrophy medians: side delts 11 -> 8, rear delts 3 -> 5 [2-20]; athletic: front 5 -> 6, side 7.5 -> 4.75. Band counts: rear delts <6 in 49 of 58 views (was 55), one view in 15-20 (was 0). "Rear delts median 3 / spill-over from rows only" is no longer true for PPL (6-12) and AESTHETICS-12 (9-20).
2. Section 0 said "59-151 total working sets ... once jumps, core and throw sets are counted (MM athletic 59-89, boxer 80-136, ...)". The MM athletic and boxer figures excluded the throw sets while baseball's included them. With throws: MM athletic 97-112, boxer 99-174, baseball 105-151 (deload 82). Fixed in section 0 and 2.3.
3. "MM athletic STARTING -> ADVANCED cut total sets 89 -> 59" (9.3, 8, open question 18, JSON multiplier note) holds only without the throws. Counting each throw line as a set it is 108 -> 112 -> 97, so MID is higher than STARTING. Qualified everywhere; 2.2 also notes MID has more lines per session than STARTING.
4. AESTHETICS-12 week 12 "158" includes 10 superset-finisher sets (Z41 '15 squats with no weight', Z52 'max bench dips'); the written exercises give 148 (the decode's own figure). Noted in section 0 and 2.3.
5. STRENGTH-8 sets per exercise (2.1) said "'the work' 5 ... accessory 3-4". Column B gives 'the work' 5 only on Mon/Wed; Thu 3 ('EASY' plyo) and Sat 3 ('FAST BANDED BENCH PRESS'); accessory 3-5. The three colour-matched ladders (green 5,5,4,4,3,3,2,1; pink 5,4,3,2,1,3,2,1; blue 3,3,2,1,3,2,1,1) are now all listed, with the blue one tied to the Thu/Sat 'SEE' cells.
6. "D.E." was presented inside a verbatim cue (5.1, 9.8, JSON). The sheet writes 'M.E.' only (N9/N13); Thu/Sat carry 'FAST ...' lift names and 'FAST RPE6 or about 60-70%'. Marked as an analyst label.
7. SCIENCE/logic: "'(1 RIR) *RPE8+' is internally inconsistent" was too strong. 1 RIR = RPE 9, which satisfies "8+"; the RPE floor is just looser than the RIR. Fixed in 5.3, tension 1 and the JSON.
8. Tension 3 (squat strength menu vs Prilepin) said "totals of 15-24 ... exceed the 90+ % row". The totals are 14-25; the 2-3-rep schemes fit the 80-90 % row except 7x3 = 21 but far exceed the 90+ % row; the 4-5-rep schemes (24-25) exceed the 80-90 % row. Rewritten. Tension 1 "reps per set 1.5-2x" -> 1.3-2x the top of Prilepin's range.
9. BASEBALL legend: the coach's column headers are 'COMPOUND' and 'SMALLER ISOLATIONS' (under 'RESISTANCE PATTERNS'), not "compound / isolation". Added verbatim to 4.1 and the JSON; 4.3 rule 1 now notes that his own label is small-muscle isolation.
10. Conditioning (section 0, 7.2, 7.3): the BYOP '3 DAY BUILDER' has a 'Cardio' slot in each of its 3 'Optional' blocks (3/week, matching the cheat sheet) and was missing from the exception list; BYOP push/pull/legs has none. CrossFit 'LVL 4 = wods a week' has no number, so "1-4 WODs" was partly inferred. Sheet24: the long day is split a.m./p.m. in 7 of 21 weeks (week 20 '12 miles (7 miles a.m. + 5 miles p.m.)'), so the longest continuous run is 11 miles.
11. Section 8 said "Every 8- or 12-week product has a scheduled deload or test". HYBRID-8 and the boxer 8-week build-up end at the peak. Fixed in section 8, the 9.8 table (athletic test + deload now INFERRED), tension 16 and the JSON plan layout.
12. Section 8 HYBRID row omitted the 'AMRAP' header row D70 (12, 15, 16, 17, 18, 19, 20, 20), a density lever (+7.6 %/week compounded). Added; what it applies to is not written (INFERRED as the Saturday circuit minutes).
13. 9.8 boxer deload: "eleven rows 3 -> 2 sets" left out that three rows go 3 -> 4 (I20, I35 'Hang Power Clean & Press', I46 complex) and the sprints 6 -> 7. Added.
14. 9.11 "43 % of baseball calf slots are ankle hops": the sheet has 16 ankle-hop fills in 42 calf-labelled slots (38 %; about 40 % after removing two empty and one row-shifted slot). Changed to "16 of 42, about 40 %".
15. 6.1 A-drill reps "72 / 90 / 64 per leg per lower day" applied to UL only; PPL 'NOVICE' is 2 x '8/8' = 48. Split into UL and PPL values.

**Not changed (checked, no fault found):** BYOP slot structures of all eight program tabs, the dropdown ranges (AV/AW/AX/AY), the 10 FOCUS headers, 'JUSTICE LEAGUE' doses and notes, bootcamp 1/2 layouts, the aerobic cheat sheet values and colours, the level colours, 'ALL ABOUT SQUATS' cells A5/A13/D13/G13/G18/B28/E28/H28/A30/B36/B38/B40, the baseball Olympic piece (4 x 8 @75 % ... 4 x 4 @90 %), the medball list, the STRENGTH-12 header, AESTHETICS-8 header and '1-2 RIR' column, FAT BURN rows, the 1RIR/2RIR/MAX/ALL ladder, CrossFit level tables and macro STRENGTH levels, the RIR-RPE mapping (Zourdos 2016), Prilepin values, NSCA contact ranges, de Villarreal 2009, Rogerson 2024 deload survey, Spiering 2021, Schoenfeld 2017/2019 and Baz-Valle 2022 summaries.

### v1 update: coach answers applied (2026-10-08)

**Method.** `coach_answers_full.md` read in full (CAT-01 ... FIX-04; LIB-10 and LIB-12 unanswered) and `coach_answers.md`; `12_volume_algorithm_v1.md` and `.json` read in full and used as the authoritative engine. Every rule that a coach answer confirms or overrules now carries its question ID. Nothing in Google Sheets was opened or changed. Scripts and backups of both v0 files are in the session scratchpad (`v1_03/`); all computation used the team venv (`.venv/bin/python`).

**Recomputed.**
1. Reproduced the v0 `normalized_muscles` of all 61 program views from their bucket totals with the v0 analyst map and the exercise-level delt split: identical except 34 rounding-only differences (≤ 0.05) on six mean views stored at one decimal (`recount.py`). The recompute method is therefore exact, and swapping in the coach map gives apples-to-apples v1 numbers.
2. Recomputed all 61 views with the coach count (helpers 0.25, glute values as PROPOSED in 12) → `normalized_muscles_coach_v1` in the JSON and the section 3.1-3.3 tables (`tables.py`, `tables2.py`). Main movers (quads, hamstrings, chest, back) are unchanged; hypertrophy-family medians changed for glutes 21 → 9, front delts 9 → 5.2, side delts 8 → 6.5, rear delts 5 → 3.5, biceps 10.5 → 8.2, triceps 12 → 9; glutes now reach 15 in 1 of 58 views (v0: 15-20 in 9, above 20 in 36); rear delts < 6 in 51 of 58 views (v0: 49).
3. Computed the 9.6 banking and set-placement illustration (`bank_example.py`); the sequence reproduces his 3/3/2 → 3/3/3 → 4/3/3 order with day rotation.
4. Rebuilt `03_volume_rules.json` to v1 (`update_json.py`) and validated it with `json.load`.

**Changed sections.** Header and evidence tags (COACH-ANSWER, PROPOSED added), the new "v1 - coach answers applied" section, 0, 1, 2.1-2.2 and 2.4 (coach notes; glute per-session claim), 3 (all tables and readings recomputed), 4 (coach rule, band scope, notation, 40-rep, preference, unilateral), 5 (coach rule; 5.3 resolutions), 6 (coach rule; plyo "zones"; Olympic for all; 6.5 settled), 7 (coach rule; marathon flag; 7.3 resolved), 8 (coach rule vs observed steps), 9 (rewritten), 10 (statuses + 7 new tensions), 11 (answered / still open / 11 new questions), 12 (coach answers and 12 added).

**Conflicts with 12 found and resolved for the coach:** athletic-template default sets (VOL-16), RIR in the last weeks (VOL-13), field-athlete exercise cap (VOL-08 vs VOL-17). Listed in the v1 section.

**Not changed (still valid evidence):** session counts (2.1), weekly totals (2.3), the RP landmark table, rep distributions (4.2), effort cues and rest (5.1-5.2), athletic dosing (6.1-6.3), the aerobic cheat sheet (7.1-7.2), progression evidence (8 table), science summaries and sources.

### v1 audit pass (2026-10-08, continuation run)

**Method.** Re-read `coach_answers_full.md` in full and `12_volume_algorithm_v1.md` in full (its files are dated before the first v1 pass of this file, so nothing in 12 changed in between). Checked every VOL answer (VOL-01 ... VOL-18), UNI-01/04/05/07/08/09, ATH-07 and the session rules against sections 0-11 and the JSON. Scanned both files for v0 rules that survived outside a "retired" note (size-class rates, 0.5 helpers, L4, the fatigue budget, the 0.75 release, the 0.85 deload, preference set factors, 40-rep defaults, bands): none found. The remaining hits are OBSERVED evidence (banded squat cues) or v0 verification entries. Re-checked the 9.6 banking illustration by hand (15 → 16 → 18 → 19, release at 1.0, 3/3/2 → 3/3/3 → 4/3/3): correct. The 12 conflicts listed at the top still stand: 12 §3.10 still has no 2-set athletic default, and 12 §3.12 still says "RIR toward 1". Backups of both files before this pass: session scratchpad `v1_03/03_volume_dosing.v1_pre_audit.md`, `v1_03/03_volume_rules.v1_pre_audit.json`.

**Changed (v1 change rows 37-41):** MYO = 2 hard sets now stated in §1 (it was in the JSON and 12, not in this file); same-pattern pairing for aesthetics added to 9.10 (UNI-06); axial-once and hip+push / knee+pull now apply to every population (PER-04, EQ-11, UNI-11, ORD-06); the client effort explanation is split into RIR/RPE and an EFFORT-against-target reading, which resolves a real conflict between VOL-13 and the GEN-05 hold gate (tension 24, question 11.3 item 12); "high-raw athletes" read as HYROX (VOL-11, INFERRED); conflict 3 is relabelled as an ambiguity inside his answers, not a conflict with 12; the abs row in 9.3 marks the 2 sets per exercise as PROPOSED.

## v1 verification log

**Date and method.** 2026-10-08, adversarial check of the v1 files (`03_volume_dosing.md`, `03_volume_rules.json`). `coach_answers_full.md` was re-read in full and `coach_answers.md` for his chat statements. Every answer that bears on volume or dosing was checked against the rules, tables, worked example and JSON of both files, not only against the change log. `12_volume_algorithm_v1.md` §3.3-3.12 and `05_session_architecture.md` rule 18 were read to check the cross-references. Nothing in Google Sheets was opened or changed. Computation used the team venv. Backups from before this pass are in the session scratchpad: `adv03/03_volume_dosing.pre_adv.md` and `adv03/03_volume_rules.pre_adv.json`. The JSON update script is `adv03/update_json_adv.py`.

**Coach answers relevant to volume, and where they now live.** These were checked against both files. "OK" means the files already said it correctly. "Fixed" means this pass changed it.

| Answers | Rule | Where | Status |
|---|---|---|---|
| VOL-01, UNI-01, VOL-02 | starts 10-12 / 15-20 / 20+; 15-20 = maintenance to some growth, 20-25 = growth; priority +4-6, cap 25-30; the tool learns from data | §0, §3.3, §9.3, §9.4 | OK. The priority split by level is now tagged PROPOSED (fixed). |
| VOL-03, UNI-08, EQ-03, EQ-13 | pain: -30-50 %, constrained machines or split grips, drop the exercise; a swapped lift keeps its sets "ideally" | §9.5 | OK |
| VOL-04, VOL-05, VOL-06, UNI-05 | 3/5/7 % of weekly sets, chosen from the person's state and never by muscle size; bank the fraction; 10 %/week too much | §0, §9.6, §9.7, JSON `progression`, `caps` | Fixed. The hand-set rate was 0-10 % and is now 0-7 %; the weekly ceiling is now "below +10 %". |
| VOL-07 | 3-4 exercises per muscle per day; first exercise first (2/2/2 → 4/3/3); bonus exercise for small muscles | §9.6 table and illustration, §9.7 | OK (illustration recomputed by hand: 15 → 16 → 18 → 19) |
| VOL-08, VOL-16, VOL-17, UNI-09 | 5-7 exercises (45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); field athletes up to 10-12; ~1.5 h / 45-60 min; calves 3 per leg day; rear delts own sets; ~2 core | §0, §9.3, §9.7, §9.10 | Fixed. His length mapping (RIGHT) replaced "5-7, up to 8 PROPOSED". |
| VOL-09, LIB-14, LIB-16, LIB-09, CAT-09, UNI-07 | helpers 0.25; dips 0.5/0.5; thrusters 1.0/0.5; pull under = lat pull-over; leg flexion own segment; 10/10 = 1 set | §1, §3, JSON `counting` | OK. The Kong row note and the thrusters question (§11.3 item 14) were added. |
| VOL-10 | athletic patterns never count | §1, §6.5, §9.11 | OK |
| VOL-11, VOL-12, VOL-13, VOL-14, VOL-15, UNI-04, PRG-06, PRG-07, PER-11 | reps, effort, rest, MYO, preference, unilateral reps, notation, same rules at every level, VOL 1-3 | §4, §5, §9.9 | OK |
| VOL-18 | balance by default; V-taper as an optional bias | §9.4 | OK |
| UNI-02, UNI-03, UNI-10, UNI-12, CAT-13 | bilateral : unilateral share from 90/10 to 10/90; bodybuilders ~50/50 → 80/20-90/10; COD athletes 80-90 % unilateral; in-season bilateral minimal; contra/ipsi | §9.3, §9.11, JSON `bilateral_unilateral_share` | Fixed. v1 had only a pointer to 12 and none of his rules. |
| UNI-06, UNI-11, ORD-06, PER-04, EQ-11 | same-pattern vs cross-pattern pairing; hip + push / knee + pull; spinal loading | §9.10 | Fixed. The axial rule now reads "no second axial squat; one axial hinge" (as 05 rule 18), with question §11.3 item 13. |
| ATH-11, ORD-08, ORD-10, ORD-11, ORD-05 | core first and movable; warm-up; optional days; Focus slots; supersets | §6.4, §9.10 | Fixed. Weekend-warrior order and §6.4 now put core first; bootcamp and general rows list core first. |
| PER-01, PER-02, PER-03, PER-05, PER-07, PER-10 | plan modes; blocks; A/B weeks optional; deload ≈ half with the same exercises; tests; smooth vs steps | §9.8, JSON `plan_layouts`, `deload` | Fixed. The JSON deload removed Olympic lifts, against "same exercises"; PER-03 was added. |
| ATH-01, ATH-02, ATH-03, ATH-04, ATH-05, ATH-06, ATH-08, ATH-10, ATH-12, PER-08, CAT-10, CAT-11, EQ-15, EQ-16, LIB-07, LIB-13, LIB-21 | sport dial, plyo stages, Olympic lifts for everyone, boxers reduce but never cut | §6, §9.9, §9.11 | Fixed. Olympic levels follow ATH-10 (intermediate+ get the full scope); the ATH-12 "no rest within the complex" detail was added. |
| ATH-09, EQ-03, GEN-02 | older clients; no sex rules; youth Olympic lifts from the floor | §9.1, §9.11 | Fixed. The older-adults row had no snatch or depth-jump limit. |
| ATH-07, EQ-14, ORD-09, PRG-03, PRG-11, PRG-12, LIB-18 | conditioning sessions, tools, finishers, bootcamp, half marathon, marathon flag | §7, §9.12 | OK |
| EQ-01, EQ-07, EQ-08, EQ-12, EQ-06 | no bands or variable resistance; medballs ≤ 20 lb | §4.1, §6.1, §9.7, §9.11 | OK. Fixed: the EQ-06 weights per throw type (RIGHT) were missing. |
| PRG-05, PRG-04, CAT-05, CAT-06, PER-06 | L1-L3; athletic tabs as blocks or levels; client level separate from exercise level; level-up | §9.2 | OK |
| GEN-01, GEN-03, GEN-05, GEN-08, ATH-13, FIX-03 | Spanish; output modes; feedback; coach rules; generic names | §9.1, §9.9, §9.13 | OK |

**Retired ideas: grep of both files (python regex over the md and over every JSON string).**
1. Size-based 3/5/7 % (large lower 3 %, large upper 5 %, small 7 %): appears only in "retired" notes, in the v0 question text inside `open_questions.answered_v0`, and in log entries. No rule uses it. The muscle class drives rep defaults only.
2. Helper credit 0.5: appears only as the dips and thrusters exceptions he confirmed, the PROPOSED glute 0.5 on hinges, the Pelland 0.5 research count, and the superseded v0 map (labelled). No rule uses it.
3. Band, chain and weight-releaser substitutes: none. Banded items survive only as OBSERVED sheet evidence and are marked out of scope (EQ-01, EQ-12). There are no band chops, banded leg extensions, band home kits or "bands only" options.
4. Plyo zones as a fixed exercise property: the 'ZONE 1/2/3' strings are quoted only as sheet labels, followed by his correction (CAT-10, CAT-11). Rules use the method stages RC1-RC3 (name PROPOSED).
5. Core after the power block as the default: no hit for "Part B" or "after the power". One place put the athletic block first (the weekend-warrior row) and was fixed. §6.4 is now annotated.
6. Sex-based rules: only "no sex field / no sex-based rules".
7. Justice League as a program name: 'JUSTICE LEAGUE' appears only as the sheet tab cited as a source. The generator goal is `weekend_warrior_athletic`.
8. Hack squat ranked last: no hit. Machines are not ranked anywhere in 03.
9. 6-week = 5 weeks + deload: appears only in the v0 question text and the `plan_layouts.retired_v0` note.

**Recomputed independently.**
1. `normalized_muscles_coach_v1` for all 61 program views, from their bucket totals with the coach map (helpers 0.25, PROPOSED glute values) and the exercise-level delt split: 0 differences above 0.05.
2. §3.3 band counts (58 views = 61 minus the two BOOT2 'A only' views and MM_CF_FT_AUG): all 12 muscles reproduce exactly. The §3.5 statements also hold: quads 23 / 9, hamstrings 25, chest 8, glutes 1, rear delts 51.
3. §9.6 banking illustration: 0.75, 1.50 → 16 (0.50), 0.98, hold, 2.10 → 18 (0.10), 1.00 → 19 (0.00), 0.95; placement 3/3/2 → 3/3/3 → 4/3/3 with day rotation. Correct.

**Corrected (claim → problem → fix).**
1. "Coach or client can set the rate by hand from 0 to 10 %" (md v1 row 1, JSON `progression.rule.rate`) → he called 10 %/week "way too much" (UNI-05) → the hand-set rate is now 0-7 %, a week must stay below +10 %, and `caps.hand_set_rate_max` = 0.07. This is listed as conflict 4 with 12 §3.7 step 4 and tension 25.
2. The bilateral : unilateral share, which he called very important, was only a pointer to 12 → his rules (UNI-02, UNI-03, UNI-10, CAT-13, UNI-12) are now in §9.3 and `generator_rules.bilateral_unilateral_share`. Numbers stay in 12 §3.11.
3. The weekend-warrior session order "athletic block first, then resistance" contradicted ATH-11 (NOT RIGHT on core after the power block) → now core (~2) → athletic block → resistance. Core first was added to the bootcamp and general rows, and §6.4's observed reading was annotated.
4. The Olympic matrix gave the full lifts at L3 only (L2 = hang power variants), while §9.11 and ATH-10 say intermediate and up get the full scope → L1 and early L2 use the variants, and L2-L3 get the full scope.
5. The older-adults sport row allowed "DB/KB" Olympic work with no limit → no snatch variants and never depth jumps (EQ-03).
6. The JSON deload removed "Olympic/max-effort work", against PER-05 "same exercises" (RIGHT) and ATH-10 → Olympic lifts stay at half the sets with light technique loads (PROPOSED). The md now says the same.
7. "Load the spine axially once a week ... deadlifts count" could be read as one axial exercise a week in total, which would forbid a deadlift on any non-squat day, and it disagreed with `05` rule 18 → now "no second axial squat; one axial hinge a week" (reading INFERRED), with question §11.3 item 13.
8. Priority "+4 (L1-L2) to +6 (L3)" was presented as the coach's rule → the split is now tagged PROPOSED. 12's internal mismatch (+5 at L2 in §3.3) is conflict 5.
9. "Resistance exercises 5-7 (default 7); up to 8 ... PROPOSED" understated his confirmed numbers (VOL-08 RIGHT: 75-90 min ≈ 8-9) → the length mapping is restored in §0, §9.7, §9.10 and the JSON. This is conflict 6 with 12 §3.10.
10. The medball cap held only "≤ 20 lb, 8-10 lb speed" → the EQ-06 weights he marked RIGHT were added (slams 10-20, overhead 6-10, sit-up 6-8, lighter for youth and older clients).
11. Thrusters 0.5 shoulders (LIB-14) sat next to helpers 0.25 (VOL-09) without a note → kept as his exercise-level answer and asked in §11.3 item 14. A note on the Kong row's low stimulus (LIB-09) was added.
12. Plyo contacts per-session caps were tagged SCIENCE/OBSERVED only → choosing the NSCA lower ends as caps is now tagged PROPOSED.
13. PER-03 (A/B lead-lift weeks only for variety seekers) was missing from §9.8 and `plan_layouts` → added.
14. ATH-12 "no rest within the complex" was missing from the contrast cell → added.
15. JSON list references written by this pass use the file's 1-based convention, which `meta.how_to_use` now states.

**Not changed (checked, no fault found):** §2-§8 observed evidence and tables (2.1 counts, 2.3 totals, 3.1-3.3 recomputed above, 4.2 distributions, 5.1-5.2 cues, 6.1-6.3 athletic dosing, 7.1-7.2 conditioning, the 8 progression table), §9.5 pain steps, §9.9 effort and the EFFORT-against-target proposal, §9.12 conditioning, §9.13 feedback loop, tensions 1-24, and the RP/science summaries. Both files parse. The md tables were checked for column counts (0 broken rows) and the JSON was re-loaded with `json.load`.
